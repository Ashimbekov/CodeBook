export default {
  id: 5,
  title: 'Message Brokers: RabbitMQ и Kafka',
  description: 'Асинхронное межсервисное взаимодействие через брокеры сообщений: RabbitMQ (очереди), Apache Kafka (потоки), паттерны обмена сообщениями.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужен асинхронный обмен',
      type: 'theory',
      content: [
        { type: 'text', value: 'Синхронный вызов (REST/gRPC) блокирует вызывающий сервис до получения ответа. Асинхронный обмен через брокер сообщений позволяет отправить сообщение и продолжить работу. Получатель обработает его когда будет готов.' },
        { type: 'heading', value: 'Синхронный vs Асинхронный' },
        { type: 'code', language: 'bash', value: '# Синхронный (REST):\n# Order Service --POST /payments--> Payment Service\n# Order Service ЖДЁТ ответа (1-5 сек)\n# Если Payment Service упал — Order Service тоже ломается!\n\n# Асинхронный (Message Broker):\n# Order Service --publish OrderCreated--> [Kafka/RabbitMQ]\n# Order Service продолжает работу сразу\n# Payment Service --consume OrderCreated--> обрабатывает когда готов\n# Если Payment Service упал — сообщение ждёт в очереди!\n\n# Преимущества асинхронного обмена:\n# 1. Decoupling — сервисы не знают друг о друге\n# 2. Resilience — брокер буферизует при сбоях\n# 3. Scalability — можно добавить consumer-ов\n# 4. Peak smoothing — пик нагрузки сглаживается очередью\n\n# Недостатки:\n# 1. Eventual consistency — данные не сразу согласованы\n# 2. Сложность отладки — сообщение "где-то в очереди"\n# 3. Ordering — порядок сообщений не гарантирован (по умолчанию)\n# 4. Duplicate handling — сообщение может прийти дважды' },
        { type: 'tip', value: 'Правило: если вам нужен ответ прямо сейчас (проверка баланса перед оплатой) — REST/gRPC. Если можно обработать позже (отправка email, обновление статистики) — Message Broker.' }
      ]
    },
    {
      id: 2,
      title: 'RabbitMQ: очереди сообщений',
      type: 'theory',
      content: [
        { type: 'text', value: 'RabbitMQ — брокер сообщений на основе протокола AMQP. Основные концепции: Producer отправляет в Exchange, Exchange маршрутизирует в Queue, Consumer читает из Queue.' },
        { type: 'heading', value: 'Архитектура RabbitMQ' },
        { type: 'code', language: 'java', value: '// Spring Boot + RabbitMQ\n\n// Конфигурация\n@Configuration\npublic class RabbitMQConfig {\n\n    // Exchange — маршрутизатор сообщений\n    @Bean\n    public TopicExchange orderExchange() {\n        return new TopicExchange("order.exchange");\n    }\n\n    // Queue — очередь для сообщений\n    @Bean\n    public Queue orderCreatedQueue() {\n        return QueueBuilder.durable("order.created.queue")\n            .withArgument("x-dead-letter-exchange", "dlx.exchange") // DLQ\n            .withArgument("x-message-ttl", 86400000) // 24 часа TTL\n            .build();\n    }\n\n    // Binding — связь Exchange с Queue по routing key\n    @Bean\n    public Binding binding() {\n        return BindingBuilder\n            .bind(orderCreatedQueue())\n            .to(orderExchange())\n            .with("order.created"); // routing key\n    }\n}\n\n// Producer — отправка сообщений\n@Service\npublic class OrderEventPublisher {\n    private final RabbitTemplate rabbitTemplate;\n\n    public void publishOrderCreated(Order order) {\n        OrderCreatedEvent event = new OrderCreatedEvent(\n            order.getId(), order.getCustomerId(),\n            order.getTotalAmount(), Instant.now()\n        );\n        rabbitTemplate.convertAndSend(\n            "order.exchange",     // exchange\n            "order.created",      // routing key\n            event                 // message (auto-serialized to JSON)\n        );\n    }\n}\n\n// Consumer — получение сообщений\n@Service\npublic class PaymentEventConsumer {\n\n    @RabbitListener(queues = "order.created.queue")\n    public void handleOrderCreated(OrderCreatedEvent event) {\n        log.info("Получено событие OrderCreated: {}", event.orderId());\n        paymentService.processPayment(event.orderId(), event.totalAmount());\n    }\n}' },
        { type: 'list', value: [
          'Direct Exchange — маршрутизация по точному routing key',
          'Topic Exchange — маршрутизация по паттерну (order.* или order.#)',
          'Fanout Exchange — широковещательная рассылка во все очереди',
          'Headers Exchange — маршрутизация по заголовкам сообщения'
        ] }
      ]
    },
    {
      id: 3,
      title: 'Apache Kafka: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Apache Kafka — распределённая платформа потоковой передачи данных. В отличие от RabbitMQ, Kafka хранит сообщения на диске и позволяет читать историю. Основные концепции: Topic, Partition, Consumer Group.' },
        { type: 'code', language: 'java', value: '// Spring Boot + Kafka\n\n// Конфигурация\n@Configuration\npublic class KafkaConfig {\n\n    @Bean\n    public NewTopic orderTopic() {\n        return TopicBuilder.name("order-events")\n            .partitions(6)          // 6 партиций для параллелизма\n            .replicas(3)            // 3 реплики для отказоустойчивости\n            .config(TopicConfig.RETENTION_MS_CONFIG, "604800000") // 7 дней\n            .build();\n    }\n\n    @Bean\n    public ProducerFactory<String, Object> producerFactory() {\n        Map<String, Object> props = new HashMap<>();\n        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:9092");\n        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);\n        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);\n        props.put(ProducerConfig.ACKS_CONFIG, "all"); // Ждём подтверждения от всех реплик\n        return new DefaultKafkaProducerFactory<>(props);\n    }\n}\n\n// Producer — отправка событий в Kafka\n@Service\npublic class OrderKafkaPublisher {\n    private final KafkaTemplate<String, Object> kafkaTemplate;\n\n    public void publishOrderCreated(Order order) {\n        OrderCreatedEvent event = new OrderCreatedEvent(\n            order.getId(), order.getCustomerId(),\n            order.getTotalAmount(), Instant.now()\n        );\n\n        kafkaTemplate.send(\n            "order-events",              // topic\n            order.getId().toString(),     // key (определяет partition)\n            event                        // value\n        ).whenComplete((result, ex) -> {\n            if (ex != null) {\n                log.error("Ошибка отправки в Kafka: {}", ex.getMessage());\n            } else {\n                log.info("Событие отправлено: topic={}, partition={}, offset={}",\n                    result.getRecordMetadata().topic(),\n                    result.getRecordMetadata().partition(),\n                    result.getRecordMetadata().offset());\n            }\n        });\n    }\n}\n\n// Consumer — чтение событий из Kafka\n@Service\npublic class PaymentKafkaConsumer {\n\n    @KafkaListener(\n        topics = "order-events",\n        groupId = "payment-service",\n        containerFactory = "kafkaListenerContainerFactory"\n    )\n    public void handleOrderEvent(OrderCreatedEvent event) {\n        log.info("Payment Service получил: {}", event);\n        paymentService.processPayment(event.orderId(), event.totalAmount());\n    }\n}' },
        { type: 'note', value: 'Ключевое отличие Kafka от RabbitMQ: Kafka хранит сообщения после чтения (retention period). Consumer может перечитать историю, новый consumer может прочитать все прошлые события. В RabbitMQ сообщение удаляется после подтверждения.' }
      ]
    },
    {
      id: 4,
      title: 'RabbitMQ vs Kafka: когда что',
      type: 'theory',
      content: [
        { type: 'text', value: 'RabbitMQ и Kafka решают разные задачи. RabbitMQ — классический брокер сообщений для точечной доставки. Kafka — лог событий для потоковой обработки и event sourcing.' },
        { type: 'heading', value: 'Сравнение RabbitMQ и Kafka' },
        { type: 'code', language: 'bash', value: '# RabbitMQ — Smart Broker, Dumb Consumer\n# + Гибкая маршрутизация (exchanges, routing keys)\n# + Гарантия доставки каждому consumer-у\n# + Приоритеты сообщений\n# + Flexible routing patterns\n# + Легко начать, простая модель\n# - Сообщение удаляется после чтения\n# - Производительность ~50K msg/sec\n# - Не для replay событий\n\n# Apache Kafka — Dumb Broker, Smart Consumer\n# + Хранение истории (дни/недели/навсегда)\n# + Производительность ~1M msg/sec\n# + Event replay — перечитать всё с начала\n# + Строгий порядок внутри partition\n# + Идеален для Event Sourcing, CDC, Analytics\n# - Сложнее в настройке и эксплуатации\n# - Нет приоритетов сообщений\n# - Consumer сам следит за offset\n\n# КОГДА RabbitMQ:\n# ✓ Task queue (обработка задач воркерами)\n# ✓ Request/Reply паттерн\n# ✓ Routing по сложным правилам\n# ✓ Приоритеты сообщений\n# ✓ Маленький-средний объём (<50K msg/sec)\n\n# КОГДА Kafka:\n# ✓ Event streaming (поток событий)\n# ✓ Event Sourcing / CQRS\n# ✓ Analytics pipeline\n# ✓ Высокий throughput (>100K msg/sec)\n# ✓ Нужна история (audit log, replay)' },
        { type: 'tip', value: 'В крупных системах часто используют оба: Kafka для потока событий между сервисами (OrderCreated, PaymentProcessed) и RabbitMQ для task queue (отправка email, генерация PDF).' }
      ]
    },
    {
      id: 5,
      title: 'Паттерны обмена сообщениями',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существуют устоявшиеся паттерны асинхронного обмена: Publish/Subscribe, Point-to-Point, Request/Reply, Event-Carried State Transfer. Выбор паттерна зависит от задачи.' },
        { type: 'code', language: 'java', value: '// Паттерн 1: Publish/Subscribe — один ко многим\n// Order Service публикует OrderCreated\n// Payment Service, Notification Service, Analytics — все подписаны\n@Service\npublic class OrderEventPublisher {\n    public void publishOrderCreated(Order order) {\n        // Все подписчики получат это событие\n        kafkaTemplate.send("order-events", order.getId().toString(),\n            new OrderCreatedEvent(order.getId(), order.getTotalAmount()));\n    }\n}\n\n// Паттерн 2: Event-Carried State Transfer\n// Событие несёт все данные — получатель не вызывает отправителя\npublic record CustomerUpdatedEvent(\n    UUID customerId,\n    String name,        // Полные данные\n    String email,       // а не только ID\n    String phone,\n    Address address     // Получатель обновляет свою копию\n) {}\n\n@KafkaListener(topics = "customer-events", groupId = "order-service")\npublic void handleCustomerUpdated(CustomerUpdatedEvent event) {\n    // Обновляем локальную копию данных клиента\n    customerCache.update(event.customerId(), event.name(), event.email());\n}\n\n// Паттерн 3: Request/Reply через Kafka\n@Service\npublic class InventoryRequestService {\n    private final ReplyingKafkaTemplate<String, CheckStockRequest, CheckStockReply>\n        replyingTemplate;\n\n    public CheckStockReply checkStock(UUID productId, int quantity) {\n        ProducerRecord<String, CheckStockRequest> record =\n            new ProducerRecord<>("inventory-requests",\n                new CheckStockRequest(productId, quantity));\n        record.headers().add(new RecordHeader(\n            KafkaHeaders.REPLY_TOPIC, "inventory-replies".getBytes()));\n\n        RequestReplyFuture<String, CheckStockRequest, CheckStockReply> future =\n            replyingTemplate.sendAndReceive(record, Duration.ofSeconds(5));\n\n        return future.get().value(); // Блокирующее ожидание ответа\n    }\n}' },
        { type: 'warning', value: 'Event-Carried State Transfer создаёт дублирование данных между сервисами. Это нормально для микросервисов — каждый сервис хранит свою проекцию. Но нужно обрабатывать eventual consistency: данные могут быть устаревшими на секунды.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Асинхронное взаимодействие',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте асинхронное взаимодействие между Order Service, Payment Service и Notification Service через Kafka.',
      requirements: [
        'Настройте Kafka topics: order-events, payment-events',
        'Order Service публикует OrderCreatedEvent при создании заказа',
        'Payment Service подписан на order-events и обрабатывает оплату',
        'Payment Service публикует PaymentProcessedEvent',
        'Notification Service подписан на оба топика и отправляет уведомления',
        'Реализуйте обработку ошибок и Dead Letter Queue'
      ],
      hint: 'Используйте spring-kafka. Для DLQ настройте DefaultErrorHandler с DeadLetterPublishingRecoverer. Key сообщения = orderId для гарантии порядка одного заказа.',
      expectedOutput: 'Order Service: POST /orders -> OrderCreatedEvent отправлен в Kafka topic order-events.\nPayment Service: получил OrderCreatedEvent, обработал оплату -> PaymentProcessedEvent отправлен.\nNotification Service: получил OrderCreatedEvent -> отправил email "Заказ создан".\nNotification Service: получил PaymentProcessedEvent -> отправил email "Оплата получена".\nОшибка обработки -> сообщение в DLQ topic order-events.DLT.',
      solution: '// Kafka Producer в Order Service\n@Service\npublic class OrderKafkaPublisher {\n    private final KafkaTemplate<String, Object> kafkaTemplate;\n\n    public void publishOrderCreated(Order order) {\n        kafkaTemplate.send("order-events", order.getId().toString(),\n            new OrderCreatedEvent(order.getId(), order.getCustomerId(),\n                order.getTotalAmount(), Instant.now()));\n    }\n}\n\n// Kafka Consumer в Payment Service\n@Service\npublic class PaymentKafkaConsumer {\n    private final PaymentService paymentService;\n    private final KafkaTemplate<String, Object> kafkaTemplate;\n\n    @KafkaListener(topics = "order-events", groupId = "payment-service")\n    public void handle(OrderCreatedEvent event) {\n        Payment payment = paymentService.processPayment(\n            event.orderId(), event.totalAmount());\n        kafkaTemplate.send("payment-events", event.orderId().toString(),\n            new PaymentProcessedEvent(payment.getId(), event.orderId()));\n    }\n}\n\n// Kafka Consumer в Notification Service\n@Service\npublic class NotificationKafkaConsumer {\n    @KafkaListener(topics = {"order-events", "payment-events"},\n                   groupId = "notification-service")\n    public void handle(Object event) {\n        if (event instanceof OrderCreatedEvent e) {\n            notificationService.sendEmail(e.customerId(), "Заказ создан");\n        } else if (event instanceof PaymentProcessedEvent e) {\n            notificationService.sendEmail(e.orderId(), "Оплата получена");\n        }\n    }\n}\n\n// DLQ конфигурация\n@Bean\npublic DefaultErrorHandler errorHandler(KafkaTemplate<String, Object> template) {\n    var recoverer = new DeadLetterPublishingRecoverer(template);\n    return new DefaultErrorHandler(recoverer, new FixedBackOff(1000L, 3));\n}',
      explanation: 'Асинхронное взаимодействие через Kafka позволяет сервисам работать независимо. Order Service не ждёт пока Payment обработает оплату. Dead Letter Queue перехватывает сообщения которые не удалось обработать после нескольких попыток. Consumer Group гарантирует что каждое сообщение обработается ровно одним экземпляром сервиса.'
    }
  ]
}
