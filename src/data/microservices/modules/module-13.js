export default {
  id: 13,
  title: 'Распределённые транзакции',
  description: 'Подходы к транзакциям между сервисами: 2PC, Saga, Outbox Pattern, CDC, idempotent consumers. Гарантии доставки и консистентность.',
  lessons: [
    {
      id: 1,
      title: 'Проблема распределённых транзакций',
      type: 'theory',
      content: [
        { type: 'text', value: 'В микросервисах нет единой базы данных — ACID-транзакции невозможны между сервисами. Каждый сервис имеет свою БД. Нужны паттерны для обеспечения согласованности данных.' },
        { type: 'code', language: 'bash', value: '# ACID в монолите (одна БД):\n# BEGIN;\n#   INSERT INTO orders (id, customer_id, total) VALUES (1, 100, 500);\n#   UPDATE inventory SET stock = stock - 1 WHERE product_id = 42;\n#   INSERT INTO payments (order_id, amount, status) VALUES (1, 500, \'paid\');\n# COMMIT; -- Всё или ничего!\n\n# В микросервисах (3 БД):\n# Order DB:     INSERT INTO orders ...   -- ОК\n# Inventory DB: UPDATE inventory ...     -- Сетевая ошибка!\n# Payment DB:   INSERT INTO payments ... -- Не выполнится\n# Результат: заказ создан, товар не зарезервирован, оплата не прошла\n\n# Подходы к решению:\n# 1. Two-Phase Commit (2PC) — синхронный, блокирующий\n# 2. Saga Pattern — последовательность локальных транзакций\n# 3. Outbox Pattern — надёжная публикация событий\n# 4. CDC (Change Data Capture) — захват изменений из БД\n# 5. Eventual Consistency — согласованность "в конечном счёте"' },
        { type: 'warning', value: 'CAP теорема: в распределённой системе можно выбрать максимум 2 из 3: Consistency, Availability, Partition tolerance. Микросервисы обычно выбирают AP (availability + partition tolerance) с eventual consistency.' }
      ]
    },
    {
      id: 2,
      title: 'Two-Phase Commit (2PC)',
      type: 'theory',
      content: [
        { type: 'text', value: '2PC — классический протокол распределённых транзакций. Координатор (Transaction Manager) управляет двумя фазами: Prepare (все готовы?) и Commit (все фиксируют). Используется редко в микросервисах из-за блокировок.' },
        { type: 'code', language: 'java', value: '// Two-Phase Commit (2PC)\n// Phase 1: PREPARE\n// Coordinator -> Order Service: "Готов зафиксировать?"\n// Coordinator -> Inventory Service: "Готов зафиксировать?"\n// Coordinator -> Payment Service: "Готов зафиксировать?"\n// Все отвечают: "Да, готов" (VOTE_COMMIT)\n\n// Phase 2: COMMIT\n// Coordinator -> Order Service: "Фиксируй!"\n// Coordinator -> Inventory Service: "Фиксируй!"\n// Coordinator -> Payment Service: "Фиксируй!"\n// Все фиксируют -> COMMITTED\n\n// Если хоть один ответил "Не готов" (VOTE_ABORT):\n// Coordinator -> ALL: "Откати!" -> ABORTED\n\n// Проблемы 2PC:\npublic class TwoPhaseCommitProblems {\n    // 1. Blocking: участники блокируют ресурсы до COMMIT\n    //    Если координатор упал после PREPARE — ресурсы заблокированы!\n\n    // 2. Latency: два round-trip + блокировки\n    //    Prepare: coordinator -> all participants (wait)\n    //    Commit:  coordinator -> all participants (wait)\n\n    // 3. Single Point of Failure: координатор\n    //    Координатор упал -> все заблокированы\n\n    // 4. Не масштабируется: чем больше участников, тем хуже\n\n    // В микросервисах 2PC используется КРАЙНЕ РЕДКО\n    // Только когда ABSOLUTELY нужна строгая консистентность\n    // Пример: межбанковские переводы\n}' },
        { type: 'note', value: '2PC доступен через JTA (Java Transaction API) и XA-ресурсы. Но он не работает через HTTP/REST — нужна поддержка на уровне БД. В микросервисах предпочитают Saga и Outbox Pattern.' }
      ]
    },
    {
      id: 3,
      title: 'Outbox Pattern',
      type: 'theory',
      content: [
        { type: 'text', value: 'Outbox Pattern решает проблему атомарной публикации: сохранение в БД и отправка события должны происходить атомарно. Решение: сохраняем событие в outbox-таблицу в той же транзакции, отдельный процесс публикует в Kafka.' },
        { type: 'code', language: 'java', value: '// Проблема: dual write\n@Transactional\npublic Order createOrder(CreateOrderRequest request) {\n    Order order = orderRepository.save(new Order(request));\n    kafkaTemplate.send("order-events", new OrderCreatedEvent(order)); // Не в транзакции!\n    return order;\n    // Что если Kafka недоступен? Order сохранён, событие потеряно!\n    // Что если приложение упало между save и send?\n}\n\n// Решение: Outbox Pattern\n@Entity\n@Table(name = "outbox_events")\npublic class OutboxEvent {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    private String aggregateType;    // "Order"\n    private String aggregateId;      // UUID заказа\n    private String eventType;        // "OrderCreated"\n    @Column(columnDefinition = "jsonb")\n    private String payload;          // JSON события\n    private boolean published;       // Опубликовано ли\n    private Instant createdAt;\n}\n\n@Service\npublic class OrderService {\n    @Transactional  // Одна транзакция!\n    public Order createOrder(CreateOrderRequest request) {\n        // 1. Сохраняем заказ\n        Order order = orderRepository.save(new Order(request));\n\n        // 2. Сохраняем событие в outbox (та же транзакция!)\n        outboxRepository.save(new OutboxEvent(\n            "Order", order.getId().toString(),\n            "OrderCreated", toJson(new OrderCreatedEvent(order))));\n\n        return order;\n        // Гарантия: если order сохранён -> событие тоже сохранено\n        // Если транзакция упала -> ни order, ни событие не сохранены\n    }\n}\n\n// Polling Publisher — читает outbox и публикует в Kafka\n@Scheduled(fixedDelay = 100) // Каждые 100ms\npublic void publishOutboxEvents() {\n    List<OutboxEvent> events = outboxRepository\n        .findByPublishedFalseOrderByCreatedAtAsc();\n\n    for (OutboxEvent event : events) {\n        try {\n            kafkaTemplate.send(event.getAggregateType().toLowerCase() + "-events",\n                event.getAggregateId(), event.getPayload()).get();\n            event.setPublished(true);\n            outboxRepository.save(event);\n        } catch (Exception e) {\n            log.error("Ошибка публикации: {}", e.getMessage());\n            break; // Повторим в следующем цикле\n        }\n    }\n}' },
        { type: 'tip', value: 'Альтернатива polling: Debezium CDC читает WAL (Write-Ahead Log) базы данных и автоматически публикует изменения в outbox-таблице в Kafka. Быстрее и надёжнее polling.' }
      ]
    },
    {
      id: 4,
      title: 'CDC с Debezium',
      type: 'theory',
      content: [
        { type: 'text', value: 'Change Data Capture (CDC) — захват изменений из БД через чтение transaction log (WAL). Debezium — open-source CDC платформа, работающая как Kafka Connect коннектор.' },
        { type: 'code', language: 'json', value: '// Debezium connector для PostgreSQL\n{\n  "name": "order-service-connector",\n  "config": {\n    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",\n    "database.hostname": "order-db",\n    "database.port": "5432",\n    "database.user": "debezium",\n    "database.password": "secret",\n    "database.dbname": "orders",\n    "database.server.name": "order-service",\n    "table.include.list": "public.outbox_events",\n    "transforms": "outbox",\n    "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",\n    "transforms.outbox.table.field.event.id": "id",\n    "transforms.outbox.table.field.event.key": "aggregate_id",\n    "transforms.outbox.table.field.event.type": "event_type",\n    "transforms.outbox.table.field.event.payload": "payload",\n    "transforms.outbox.route.topic.replacement": "${routedByValue}.events"\n  }\n}' },
        { type: 'code', language: 'yaml', value: '# Docker Compose для Debezium\nservices:\n  zookeeper:\n    image: confluentinc/cp-zookeeper:7.5.0\n    environment:\n      ZOOKEEPER_CLIENT_PORT: 2181\n\n  kafka:\n    image: confluentinc/cp-kafka:7.5.0\n    depends_on: [zookeeper]\n    environment:\n      KAFKA_BROKER_ID: 1\n      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181\n      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092\n\n  connect:\n    image: debezium/connect:2.4\n    depends_on: [kafka]\n    ports:\n      - "8083:8083"\n    environment:\n      BOOTSTRAP_SERVERS: kafka:9092\n      GROUP_ID: debezium\n      CONFIG_STORAGE_TOPIC: connect-configs\n      OFFSET_STORAGE_TOPIC: connect-offsets\n      STATUS_STORAGE_TOPIC: connect-status\n\n  order-db:\n    image: postgres:15\n    command: ["-c", "wal_level=logical"]  # Включаем logical replication\n    environment:\n      POSTGRES_DB: orders\n      POSTGRES_USER: debezium\n      POSTGRES_PASSWORD: secret' },
        { type: 'note', value: 'Debezium читает WAL PostgreSQL (logical replication). Это эффективнее polling: нет нагрузки на БД от SELECT-запросов, задержка ~миллисекунды, не пропустит ни одного изменения.' }
      ]
    },
    {
      id: 5,
      title: 'Idempotent Consumer',
      type: 'theory',
      content: [
        { type: 'text', value: 'При at-least-once доставке сообщение может прийти повторно. Idempotent Consumer гарантирует что повторная обработка не создаст дубликатов. Это критичный паттерн для eventual consistency.' },
        { type: 'code', language: 'java', value: '// Idempotent Consumer — обработка дубликатов\n\n@Entity\n@Table(name = "processed_events")\npublic class ProcessedEvent {\n    @Id\n    private String eventId;  // Уникальный ID события\n    private Instant processedAt;\n}\n\n@Service\npublic class PaymentEventConsumer {\n\n    private final ProcessedEventRepository processedEventRepo;\n    private final PaymentService paymentService;\n\n    @KafkaListener(topics = "order-events", groupId = "payment-service")\n    @Transactional\n    public void handleOrderCreated(OrderCreatedEvent event) {\n        // 1. Проверяем: уже обработали это событие?\n        if (processedEventRepo.existsById(event.eventId())) {\n            log.info("Событие {} уже обработано, пропускаем", event.eventId());\n            return; // Idempotent!\n        }\n\n        // 2. Обрабатываем\n        paymentService.processPayment(event.orderId(), event.totalAmount());\n\n        // 3. Запоминаем что обработали (в той же транзакции!)\n        processedEventRepo.save(\n            new ProcessedEvent(event.eventId(), Instant.now()));\n    }\n}\n\n// Альтернатива: Idempotency Key\n@Service\npublic class OrderService {\n    @Transactional\n    public Order createOrder(CreateOrderRequest request, String idempotencyKey) {\n        // Проверяем: не создавали ли уже заказ с этим ключом?\n        Optional<Order> existing = orderRepository\n            .findByIdempotencyKey(idempotencyKey);\n        if (existing.isPresent()) {\n            return existing.get(); // Возвращаем существующий\n        }\n\n        // Создаём новый\n        Order order = new Order(request);\n        order.setIdempotencyKey(idempotencyKey);\n        return orderRepository.save(order);\n    }\n}\n\n// API с Idempotency Key\n@PostMapping("/orders")\npublic OrderResponse createOrder(\n        @RequestBody CreateOrderRequest request,\n        @RequestHeader("Idempotency-Key") String idempotencyKey) {\n    Order order = orderService.createOrder(request, idempotencyKey);\n    return OrderResponse.from(order);\n}' },
        { type: 'tip', value: 'Генерируйте Idempotency-Key на стороне клиента (UUID). Передавайте в заголовке. Это защищает от дублирования при retry: если первый запрос дошёл но ответ потерялся, повторный запрос с тем же ключом вернёт существующий результат.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Outbox Pattern с Debezium',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Outbox Pattern для надёжной публикации событий между Order Service и Payment Service.',
      requirements: [
        'Создайте outbox таблицу в PostgreSQL',
        'Реализуйте сохранение заказа и события в одной транзакции',
        'Настройте Debezium для чтения outbox таблицы',
        'Реализуйте Idempotent Consumer в Payment Service',
        'Обработайте сценарий дубликата сообщения',
        'Добавьте мониторинг: время между записью в outbox и публикацией'
      ],
      hint: 'Outbox таблица: id, aggregate_type, aggregate_id, event_type, payload (jsonb), created_at. Debezium Outbox Event Router автоматически маршрутизирует в правильный Kafka topic. Для idempotency используйте таблицу processed_events с eventId.',
      expectedOutput: 'Order создан и событие записано в outbox (одна транзакция).\nDebezium прочитал WAL -> опубликовал OrderCreatedEvent в Kafka за 50ms.\nPayment Service получил событие -> обработал оплату.\nПовторное получение того же события -> пропущено (idempotent).\nМониторинг: средняя задержка outbox->Kafka: 45ms.',
      solution: '-- SQL: Outbox таблица\nCREATE TABLE outbox_events (\n    id BIGSERIAL PRIMARY KEY,\n    aggregate_type VARCHAR(255) NOT NULL,\n    aggregate_id VARCHAR(255) NOT NULL,\n    event_type VARCHAR(255) NOT NULL,\n    payload JSONB NOT NULL,\n    created_at TIMESTAMP DEFAULT NOW()\n);\n\n-- SQL: Processed events для idempotency\nCREATE TABLE processed_events (\n    event_id VARCHAR(255) PRIMARY KEY,\n    processed_at TIMESTAMP DEFAULT NOW()\n);\n\n// Java: Order Service\n@Transactional\npublic Order createOrder(CreateOrderRequest req) {\n    Order order = orderRepo.save(new Order(req));\n    outboxRepo.save(new OutboxEvent("Order", order.getId().toString(),\n        "OrderCreated", toJson(order)));\n    return order;\n}\n\n// Java: Idempotent Consumer\n@KafkaListener(topics = "order.events")\n@Transactional\npublic void handle(OrderCreatedEvent event) {\n    if (processedRepo.existsById(event.eventId())) return;\n    paymentService.process(event);\n    processedRepo.save(new ProcessedEvent(event.eventId()));\n}',
      explanation: 'Outbox Pattern гарантирует атомарность записи в БД и публикации события. Debezium CDC читает WAL и публикует в Kafka с минимальной задержкой. Idempotent Consumer защищает от дублей при at-least-once доставке. Вместе эти паттерны обеспечивают надёжную eventual consistency между микросервисами.'
    }
  ]
}
