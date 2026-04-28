export default {
  id: 23,
  title: 'Database per Service',
  description: 'Паттерн Database per Service: polyglot persistence, стратегии синхронизации данных, CQRS для запросов между сервисами, API Composition.',
  lessons: [
    {
      id: 1,
      title: 'Принцип Database per Service',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый микросервис имеет собственную базу данных. Другие сервисы не могут обращаться к ней напрямую — только через API. Это обеспечивает слабую связанность и независимость деплоя.' },
        { type: 'code', language: 'bash', value: '# Database per Service:\n# [User Service]    -> [PostgreSQL: users_db]\n# [Order Service]   -> [PostgreSQL: orders_db]\n# [Catalog Service] -> [PostgreSQL: catalog_db] + [Elasticsearch]\n# [Session Service] -> [Redis]\n# [Analytics]       -> [ClickHouse]\n\n# Что НЕЛЬЗЯ:\n# Order Service -> SELECT * FROM users_db.users WHERE id = 123\n# Прямой доступ к чужой БД = shared database anti-pattern!\n\n# Что МОЖНО:\n# Order Service -> GET http://user-service/api/v1/users/123\n# Через API сервиса!\n\n# Преимущества:\n# 1. Независимый деплой — схема одного сервиса не ломает другие\n# 2. Оптимальный выбор БД — PostgreSQL для транзакций, Redis для кэша\n# 3. Независимое масштабирование БД\n# 4. Чёткие границы — нет "общих таблиц"\n\n# Проблемы:\n# 1. JOIN между сервисами невозможен\n# 2. Распределённые транзакции (нет ACID)\n# 3. Дублирование данных (денормализация)\n# 4. Запросы по данным нескольких сервисов (API Composition)' },
        { type: 'warning', value: 'Shared Database — анти-паттерн! Если два сервиса используют одну БД, они становятся связанными: изменение схемы в одном ломает другой, деплой требует координации, масштабирование невозможно отдельно.' }
      ]
    },
    {
      id: 2,
      title: 'Polyglot Persistence',
      type: 'theory',
      content: [
        { type: 'text', value: 'Polyglot Persistence — использование разных БД для разных сервисов, выбирая оптимальную технологию для каждой задачи. PostgreSQL для транзакций, MongoDB для документов, Redis для кэша.' },
        { type: 'code', language: 'yaml', value: '# Polyglot Persistence в e-commerce:\n\n# User Service -> PostgreSQL\n# - Реляционные данные: пользователи, адреса, роли\n# - ACID транзакции для регистрации\n# - SQL запросы для отчётов\n\n# Product Catalog -> MongoDB + Elasticsearch\n# - Гибкая схема: разные товары имеют разные поля\n# - MongoDB: хранение документов (товар = JSON)\n# - Elasticsearch: полнотекстовый поиск, фильтрация\n\n# Order Service -> PostgreSQL\n# - Строгие транзакции: создание заказа, оплата\n# - Реляционные связи: заказ -> товары -> платежи\n\n# Session/Cache -> Redis\n# - Быстрый доступ к сессиям, корзинам\n# - TTL для автоматической очистки\n# - Pub/Sub для real-time уведомлений\n\n# Analytics -> ClickHouse\n# - Колоночная БД для аналитики\n# - Быстрые агрегации: сумма продаж, средний чек\n\n# Notification -> PostgreSQL + Redis\n# - PostgreSQL: история уведомлений\n# - Redis: очередь отправки (List)\n\n# Recommendations -> Neo4j\n# - Графовая БД: "пользователь X купил товар Y"\n# - Запросы: "похожие товары", "часто покупают вместе"' },
        { type: 'tip', value: 'Не усложняйте: если PostgreSQL решает задачу — используйте PostgreSQL. Polyglot Persistence оправдан когда реляционная БД не оптимальна: полнотекстовый поиск (Elasticsearch), графы (Neo4j), time-series (InfluxDB).' }
      ]
    },
    {
      id: 3,
      title: 'API Composition для запросов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда нужно получить данные из нескольких сервисов (аналог JOIN), используют API Composition: один сервис вызывает несколько API и агрегирует результат.' },
        { type: 'code', language: 'java', value: '// Проблема: "Показать заказ с именем клиента и названиями товаров"\n// В монолите: SELECT o.*, u.name, p.title FROM orders o\n//             JOIN users u ON o.customer_id = u.id\n//             JOIN products p ON oi.product_id = p.id\n// В микросервисах: JOIN невозможен!\n\n// Решение 1: API Composition (синхронный)\n@Service\npublic class OrderDetailsComposer {\n    private final OrderServiceClient orderClient;\n    private final UserServiceClient userClient;\n    private final ProductServiceClient productClient;\n\n    public OrderDetailsResponse getOrderDetails(UUID orderId) {\n        // Параллельные вызовы для скорости\n        CompletableFuture<OrderResponse> orderFuture =\n            CompletableFuture.supplyAsync(() -> orderClient.getOrder(orderId));\n\n        OrderResponse order = orderFuture.join();\n\n        CompletableFuture<UserResponse> userFuture =\n            CompletableFuture.supplyAsync(() -> userClient.getUser(order.customerId()));\n\n        CompletableFuture<List<ProductResponse>> productsFuture =\n            CompletableFuture.supplyAsync(() ->\n                order.items().stream()\n                    .map(item -> productClient.getProduct(item.productId()))\n                    .toList());\n\n        UserResponse user = userFuture.join();\n        List<ProductResponse> products = productsFuture.join();\n\n        return new OrderDetailsResponse(\n            order.id(), user.name(), user.email(),\n            order.status(), order.totalAmount(),\n            products.stream().map(p -> new ProductInfo(p.id(), p.name(), p.price())).toList()\n        );\n    }\n}\n\n// Решение 2: Денормализация (данные хранятся локально)\n// Order Service хранит копию имени клиента и названий товаров\n@Entity\npublic class Order {\n    private UUID id;\n    private UUID customerId;\n    private String customerName;   // Денормализация!\n    private String customerEmail;  // Денормализация!\n    private List<OrderItem> items; // OrderItem содержит productName\n}\n// Синхронизация через события: UserUpdated -> Order Service обновляет имя' },
        { type: 'note', value: 'API Composition добавляет latency (несколько сетевых вызовов) и хрупкость (если один сервис упал — весь ответ не собрать). Денормализация быстрее при чтении, но нужна синхронизация при изменениях.' }
      ]
    },
    {
      id: 4,
      title: 'Синхронизация данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'При Database per Service данные дублируются между сервисами. Нужна стратегия синхронизации: Event-Carried State Transfer, CQRS проекции, периодическая синхронизация.' },
        { type: 'code', language: 'java', value: '// Event-Carried State Transfer:\n// User Service публикует полные данные в событии\npublic record UserUpdatedEvent(\n    UUID userId,\n    String name,       // Полные данные\n    String email,\n    String phone,\n    Address address    // Всё что может понадобиться\n) {}\n\n// Order Service подписан и обновляет свою копию\n@KafkaListener(topics = "user-events\", groupId = \"order-service\")\npublic void handleUserUpdated(UserUpdatedEvent event) {\n    // Обновляем локальную копию данных пользователя\n    customerRepository.upsert(new Customer(\n        event.userId(),\n        event.name(),\n        event.email()\n    ));\n\n    // Обновляем денормализованные данные в заказах\n    orderRepository.updateCustomerName(\n        event.userId(), event.name());\n}\n\n// CQRS Projection — создание read model из событий\n@Service\npublic class OrderSearchProjection {\n\n    @KafkaListener(topics = \"order-events\")\n    public void on(OrderCreatedEvent event) {\n        // Создаём поисковый документ в Elasticsearch\n        elasticRepo.save(new OrderSearchDocument(\n            event.orderId(),\n            event.customerName(),  // Уже денормализовано в событии\n            event.items().stream().map(OrderItem::productName).toList(),\n            event.totalAmount(),\n            event.createdAt()\n        ));\n    }\n}\n\n// Периодическая синхронизация (для reconciliation)\n@Scheduled(cron = \"0 0 2 * * *\") // Каждый день в 2:00\npublic void reconcileCustomerData() {\n    List<Customer> localCustomers = customerRepository.findAll();\n    for (Customer local : localCustomers) {\n        UserResponse remote = userServiceClient.getUser(local.getUserId());\n        if (!local.getName().equals(remote.name())) {\n            local.setName(remote.name());\n            customerRepository.save(local);\n            log.warn(\"Reconciliation: customer {} name updated\", local.getUserId());\n        }\n    }\n}' },
        { type: 'warning', value: 'Event-Carried State Transfer — eventual consistency. Данные в Order Service могут быть устаревшими на секунды. Для критических операций (проверка баланса) используйте синхронный вызов к source of truth.' }
      ]
    },
    {
      id: 5,
      title: 'Миграция схемы в микросервисах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый сервис управляет миграциями своей БД независимо. Flyway или Liquibase запускают миграции при старте сервиса. Миграции должны быть обратно совместимыми для zero-downtime деплоя.' },
        { type: 'code', language: 'bash', value: '# Flyway миграции: src/main/resources/db/migration/\n# V1__create_orders_table.sql\n# V2__add_customer_email.sql\n# V3__add_order_items_table.sql\n\n# Zero-downtime миграция (expand-contract):\n# Проблема: переименовать колонку customer_id -> buyer_id\n\n# Шаг 1: EXPAND (добавляем новую, оставляем старую)\n# V4__add_buyer_id_column.sql:\n# ALTER TABLE orders ADD COLUMN buyer_id UUID;\n# UPDATE orders SET buyer_id = customer_id;\n# Деплоим код: пишет в ОБА поля\n\n# Шаг 2: MIGRATE (переводим весь код на новую)\n# Деплоим код: читает из buyer_id, пишет в buyer_id\n\n# Шаг 3: CONTRACT (удаляем старую)\n# V5__drop_customer_id_column.sql:\n# ALTER TABLE orders DROP COLUMN customer_id;' },
        { type: 'code', language: 'yaml', value: '# application.yml — Flyway\nspring:\n  flyway:\n    enabled: true\n    locations: classpath:db/migration\n    baseline-on-migrate: true\n    validate-on-migrate: true' },
        { type: 'tip', value: 'При Rolling Update старая и новая версии приложения работают одновременно. Миграция должна быть совместима с обеими версиями. Никогда не удаляйте колонку в той же миграции где обновляете код — сначала код, потом удаление.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Database per Service',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Database per Service с денормализацией данных и Event-Carried State Transfer.',
      requirements: [
        'Каждый сервис имеет свою PostgreSQL БД (через Docker Compose)',
        'Order Service хранит копию имени клиента (денормализация)',
        'User Service публикует UserUpdatedEvent с полными данными',
        'Order Service подписан на user-events и обновляет копию',
        'Реализуйте API Composition для OrderDetails (order + user + products)',
        'Добавьте reconciliation job для проверки согласованности'
      ],
      hint: 'Создайте отдельные БД в Docker Compose: users_db, orders_db, products_db. Event-Carried State Transfer через Kafka. API Composition через параллельные CompletableFuture вызовы. Reconciliation через @Scheduled.',
      expectedOutput: 'Order Service: order_db содержит customer_name (денормализация).\nUser Service: UserUpdated("John" -> "John Doe") -> событие в Kafka.\nOrder Service: получил событие -> обновил customer_name в orders.\nAPI Composition: GET /order-details/123 -> {order + user + products} за 50ms.\nReconciliation: 0 расхождений (данные согласованы).',
      solution: '// Event-Carried State Transfer\n@KafkaListener(topics = "user-events")\npublic void handleUserUpdated(UserUpdatedEvent event) {\n    customerRepo.upsert(event.userId(), event.name(), event.email());\n    orderRepo.updateCustomerName(event.userId(), event.name());\n}\n\n// API Composition\npublic OrderDetailsResponse getOrderDetails(UUID orderId) {\n    var orderFuture = CompletableFuture.supplyAsync(() -> orderClient.get(orderId));\n    OrderResponse order = orderFuture.join();\n    var userFuture = CompletableFuture.supplyAsync(() -> userClient.get(order.customerId()));\n    var productsFuture = CompletableFuture.supplyAsync(() ->\n        order.items().stream().map(i -> productClient.get(i.productId())).toList());\n    return new OrderDetailsResponse(order, userFuture.join(), productsFuture.join());\n}\n\n// Reconciliation\n@Scheduled(cron = "0 0 2 * * *")\npublic void reconcile() {\n    customerRepo.findAll().forEach(local -> {\n        var remote = userClient.getUser(local.getUserId());\n        if (!local.getName().equals(remote.name())) {\n            local.setName(remote.name());\n            customerRepo.save(local);\n        }\n    });\n}',
      explanation: 'Database per Service — фундаментальный принцип микросервисов. Денормализация и Event-Carried State Transfer обеспечивают быстрое чтение без cross-service вызовов. API Composition решает задачу агрегации данных. Reconciliation как safety net для обнаружения расхождений.'
    }
  ]
}
