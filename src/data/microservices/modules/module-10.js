export default {
  id: 10,
  title: 'Паттерн CQRS',
  description: 'Command Query Responsibility Segregation: разделение чтения и записи, отдельные модели, синхронизация через события, преимущества и сложности.',
  lessons: [
    {
      id: 1,
      title: 'Что такое CQRS',
      type: 'theory',
      content: [
        { type: 'text', value: 'CQRS (Command Query Responsibility Segregation) — паттерн разделения модели записи (Command) и модели чтения (Query). Вместо одной модели для всего, создаются две специализированные модели. Command изменяет данные, Query только читает.' },
        { type: 'heading', value: 'Традиционный CRUD vs CQRS' },
        { type: 'code', language: 'bash', value: '# Традиционный CRUD:\n# [Client] -> [Service] -> [одна Model] -> [одна DB]\n# Одна модель для записи И чтения\n# Проблема: модель для записи часто не оптимальна для чтения\n\n# CQRS:\n# Write:\n# [Client] -> [Command Handler] -> [Write Model] -> [Command DB]\n#                                         |\n#                                   [Domain Events]\n#                                         |\n# Read:\n# [Client] -> [Query Handler] -> [Read Model] -> [Query DB]\n#\n# Write Model: нормализованная, бизнес-правила, валидация\n# Read Model: денормализованная, оптимизирована для запросов\n\n# Пример: интернет-магазин\n# Write DB (PostgreSQL): orders, order_items, products (нормализовано)\n# Read DB (Elasticsearch): order_views (денормализовано, с именами товаров)\n# Read DB (Redis): order_summaries (кэш для быстрого доступа)' },
        { type: 'tip', value: 'CQRS не обязательно требует разных БД. Можно начать с разных моделей в одной БД: Command Repository и Query Repository. Разные БД — это оптимизация, не требование.' }
      ]
    },
    {
      id: 2,
      title: 'Command Side: запись',
      type: 'theory',
      content: [
        { type: 'text', value: 'Command Side принимает команды (CreateOrder, CancelOrder), валидирует бизнес-правила, изменяет состояние и публикует события. Модель оптимизирована для согласованности и валидации.' },
        { type: 'code', language: 'java', value: '// Command — намерение изменить состояние\npublic record CreateOrderCommand(\n    UUID customerId,\n    List<OrderItemDto> items\n) {}\n\npublic record CancelOrderCommand(\n    UUID orderId,\n    String reason\n) {}\n\n// Command Handler — обрабатывает команды\n@Service\npublic class OrderCommandHandler {\n\n    private final OrderRepository orderRepository;\n    private final EventPublisher eventPublisher;\n\n    public UUID handle(CreateOrderCommand command) {\n        // Бизнес-валидация\n        if (command.items().isEmpty()) {\n            throw new ValidationException("Заказ не может быть пустым");\n        }\n\n        // Создание агрегата\n        Order order = Order.create(\n            command.customerId(),\n            command.items()\n        );\n\n        // Сохранение\n        orderRepository.save(order);\n\n        // Публикация события для синхронизации Read Model\n        eventPublisher.publish(new OrderCreatedEvent(\n            order.getId(),\n            order.getCustomerId(),\n            order.getItems(),\n            order.getTotalAmount(),\n            order.getCreatedAt()\n        ));\n\n        return order.getId();\n    }\n\n    public void handle(CancelOrderCommand command) {\n        Order order = orderRepository.findById(command.orderId())\n            .orElseThrow(() -> new OrderNotFoundException(command.orderId()));\n\n        order.cancel(command.reason()); // Бизнес-правила внутри агрегата\n        orderRepository.save(order);\n\n        eventPublisher.publish(new OrderCancelledEvent(\n            order.getId(), command.reason()));\n    }\n}\n\n// Write Model — нормализованная, с бизнес-логикой\n@Entity\n@Table(name = "orders")\npublic class Order {\n    @Id private UUID id;\n    private UUID customerId;\n    @Enumerated(EnumType.STRING)\n    private OrderStatus status;\n    @OneToMany(cascade = CascadeType.ALL)\n    private List<OrderItem> items;\n    private BigDecimal totalAmount;\n\n    public void cancel(String reason) {\n        if (status == OrderStatus.DELIVERED) {\n            throw new IllegalStateException("Нельзя отменить доставленный заказ");\n        }\n        this.status = OrderStatus.CANCELLED;\n    }\n}' },
        { type: 'note', value: 'Command Handler не возвращает данные (кроме ID). Принцип: команда изменяет состояние, но не возвращает его. Для получения данных используйте Query Side.' }
      ]
    },
    {
      id: 3,
      title: 'Query Side: чтение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Query Side обрабатывает запросы на чтение. Read Model оптимизирована для быстрых запросов: денормализована, может использовать разные хранилища (Elasticsearch, Redis, MongoDB). Синхронизируется через события.' },
        { type: 'code', language: 'java', value: '// Query — запрос на чтение\npublic record GetOrderQuery(UUID orderId) {}\npublic record GetOrdersByCustomerQuery(UUID customerId, int page, int size) {}\npublic record SearchOrdersQuery(String searchTerm, OrderStatus status) {}\n\n// Read Model — денормализованная, для быстрого чтения\n@Document(indexName = "orders") // Elasticsearch\npublic class OrderView {\n    @Id\n    private String id;\n    private String customerId;\n    private String customerName;    // Денормализовано!\n    private String customerEmail;   // Денормализовано!\n    private String status;\n    private double totalAmount;\n    private List<OrderItemView> items; // С названиями товаров!\n    private Instant createdAt;\n}\n\npublic class OrderItemView {\n    private String productId;\n    private String productName;  // Денормализовано!\n    private int quantity;\n    private double price;\n}\n\n// Query Handler\n@Service\npublic class OrderQueryHandler {\n    private final OrderViewRepository viewRepository; // Elasticsearch\n\n    public OrderView handle(GetOrderQuery query) {\n        return viewRepository.findById(query.orderId().toString())\n            .orElseThrow(() -> new OrderNotFoundException(query.orderId()));\n    }\n\n    public Page<OrderView> handle(GetOrdersByCustomerQuery query) {\n        return viewRepository.findByCustomerId(\n            query.customerId().toString(),\n            PageRequest.of(query.page(), query.size())\n        );\n    }\n\n    public List<OrderView> handle(SearchOrdersQuery query) {\n        return viewRepository.searchByTermAndStatus(\n            query.searchTerm(), query.status());\n    }\n}\n\n// Event Handler — синхронизация Read Model\n@Service\npublic class OrderViewProjection {\n\n    @KafkaListener(topics = "order-events", groupId = "order-view-projection")\n    public void on(OrderCreatedEvent event) {\n        // Обогащаем данными из других сервисов\n        String customerName = userServiceClient.getName(event.customerId());\n\n        OrderView view = new OrderView();\n        view.setId(event.orderId().toString());\n        view.setCustomerName(customerName);\n        view.setStatus("CREATED");\n        view.setTotalAmount(event.totalAmount());\n        view.setCreatedAt(event.createdAt());\n\n        viewRepository.save(view);\n    }\n\n    @KafkaListener(topics = "order-events", groupId = "order-view-projection")\n    public void on(OrderCancelledEvent event) {\n        viewRepository.findById(event.orderId().toString())\n            .ifPresent(view -> {\n                view.setStatus("CANCELLED");\n                viewRepository.save(view);\n            });\n    }\n}' },
        { type: 'tip', value: 'Read Model можно пересоздать в любой момент: перечитать все события и построить проекцию заново. Это позволяет менять структуру Read Model без миграций — просто пересобрать из событий.' }
      ]
    },
    {
      id: 4,
      title: 'Синхронизация моделей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Command и Query модели синхронизируются через доменные события. Есть три подхода: синхронная проекция (в той же транзакции), асинхронная проекция (через Kafka), гибридная (sync + async).' },
        { type: 'code', language: 'java', value: '// Подход 1: Синхронная проекция (простой CQRS)\n@Service\n@Transactional\npublic class OrderCommandHandler {\n    public UUID handle(CreateOrderCommand command) {\n        Order order = Order.create(command);\n        orderRepository.save(order);\n\n        // Синхронное обновление Read Model в той же транзакции\n        orderViewRepository.save(OrderView.from(order));\n\n        return order.getId();\n    }\n    // Плюс: данные сразу согласованы\n    // Минус: медленнее, Read Model привязана к Write транзакции\n}\n\n// Подход 2: Асинхронная проекция (через Kafka)\n@Service\npublic class OrderCommandHandler {\n    public UUID handle(CreateOrderCommand command) {\n        Order order = Order.create(command);\n        orderRepository.save(order);\n        // Публикация события — асинхронно\n        kafkaTemplate.send("order-events\", event);\n        return order.getId();\n    }\n}\n\n// Projection обновляется позже (мс - секунды)\n@Component\npublic class OrderViewProjection {\n    @KafkaListener(topics = \"order-events\")\n    public void project(OrderCreatedEvent event) {\n        viewRepository.save(OrderView.from(event));\n    }\n    // Плюс: быстрая запись, read model масштабируется независимо\n    // Минус: eventual consistency (задержка секунды)\n}\n\n// Подход 3: Outbox Pattern для надёжности\n@Service\n@Transactional\npublic class OrderCommandHandler {\n    public UUID handle(CreateOrderCommand command) {\n        Order order = Order.create(command);\n        orderRepository.save(order);\n\n        // Сохраняем событие в outbox таблицу (та же транзакция!)\n        outboxRepository.save(new OutboxEvent(\n            \"order-events\", order.getId().toString(),\n            \"OrderCreated\", toJson(event)));\n\n        return order.getId();\n    }\n    // Debezium/Polling читает outbox -> публикует в Kafka\n    // Гарантия: событие публикуется ровно когда order сохранён\n}' },
        { type: 'warning', value: 'При асинхронной синхронизации возможен read-your-writes inconsistency: пользователь создал заказ, обновил страницу — а заказа ещё нет в Read Model. Решение: после создания возвращайте ID, клиент ждёт появления в Read Model.' }
      ]
    },
    {
      id: 5,
      title: 'Когда применять CQRS',
      type: 'theory',
      content: [
        { type: 'text', value: 'CQRS добавляет сложность и не нужен везде. Есть чёткие критерии когда CQRS оправдан и когда обычный CRUD достаточен.' },
        { type: 'heading', value: 'Критерии применения' },
        { type: 'list', value: [
          'Разные требования к чтению и записи (90% чтение, 10% запись)',
          'Сложные запросы требуют денормализации или другого хранилища',
          'Нужна независимое масштабирование чтения и записи',
          'Сложная бизнес-логика записи (domain model с правилами)',
          'Event Sourcing — CQRS практически обязателен',
          'Разные команды отвечают за чтение и запись'
        ] },
        { type: 'heading', value: 'Когда НЕ применять CQRS' },
        { type: 'list', value: [
          'Простой CRUD без сложной бизнес-логики',
          'Данные должны быть согласованы немедленно (не eventual)',
          'Маленький проект, маленькая команда',
          'Нет опыта с event-driven архитектурой',
          'Одинаковые требования к чтению и записи'
        ] },
        { type: 'note', value: 'CQRS можно применять не ко всей системе, а к отдельным bounded contexts. Order Service с CQRS, User Service с обычным CRUD — нормальная практика.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Реализация CQRS',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте CQRS для Order Service: Command Side с PostgreSQL, Query Side с Elasticsearch.',
      requirements: [
        'Создайте Command Model (Order entity) и Command Handler',
        'Создайте Query Model (OrderView document) и Query Handler',
        'Реализуйте Projection для синхронизации через Kafka события',
        'Добавьте REST контроллер с чётким разделением: POST -> Command, GET -> Query',
        'Реализуйте полнотекстовый поиск заказов через Elasticsearch',
        'Обработайте eventual consistency: возвращайте статус синхронизации'
      ],
      hint: 'Используйте spring-data-jpa для Command Side и spring-data-elasticsearch для Query Side. Projection подписывается на Kafka топик и обновляет Elasticsearch. Для поиска используйте @Query в Elasticsearch repository.',
      expectedOutput: 'POST /api/v1/orders/commands/create -> 201 Created, orderId в ответе.\nGET /api/v1/orders/queries/{id} -> OrderView из Elasticsearch.\nGET /api/v1/orders/queries/search?q=laptop -> список заказов с полнотекстовым поиском.\nCommand Model: PostgreSQL (orders table, нормализовано).\nQuery Model: Elasticsearch (orders index, денормализовано с именами).\nProjection: OrderCreated -> OrderView создан в Elasticsearch за ~100ms.',
      solution: '// Command Controller\n@RestController\n@RequestMapping("/api/v1/orders/commands")\npublic class OrderCommandController {\n    private final OrderCommandHandler commandHandler;\n\n    @PostMapping("/create")\n    @ResponseStatus(HttpStatus.CREATED)\n    public Map<String, UUID> createOrder(@RequestBody CreateOrderCommand command) {\n        UUID orderId = commandHandler.handle(command);\n        return Map.of("orderId", orderId);\n    }\n}\n\n// Query Controller\n@RestController\n@RequestMapping("/api/v1/orders/queries")\npublic class OrderQueryController {\n    private final OrderQueryHandler queryHandler;\n\n    @GetMapping("/{orderId}")\n    public OrderView getOrder(@PathVariable UUID orderId) {\n        return queryHandler.handle(new GetOrderQuery(orderId));\n    }\n\n    @GetMapping("/search")\n    public List<OrderView> search(@RequestParam String q) {\n        return queryHandler.handle(new SearchOrdersQuery(q, null));\n    }\n}\n\n// Projection\n@Service\npublic class OrderViewProjection {\n    @KafkaListener(topics = "order-events")\n    public void project(OrderCreatedEvent event) {\n        OrderView view = OrderView.builder()\n            .id(event.orderId().toString())\n            .customerName(userClient.getName(event.customerId()))\n            .status("CREATED")\n            .totalAmount(event.totalAmount())\n            .build();\n        elasticsearchRepository.save(view);\n    }\n}',
      explanation: 'CQRS разделяет ответственность: Command Side обеспечивает бизнес-правила и согласованность записи, Query Side оптимизирован для быстрого чтения и сложных запросов. Projection — мост между моделями, синхронизирующий данные через события. Elasticsearch обеспечивает полнотекстовый поиск, недоступный в обычном PostgreSQL.'
    }
  ]
}
