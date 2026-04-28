export default {
  id: 6,
  title: 'Apache Kafka глубже',
  description: 'Углублённое изучение Kafka: topics и partitions, consumer groups, exactly-once semantics, Kafka Streams, Schema Registry и production-настройка.',
  lessons: [
    {
      id: 1,
      title: 'Topics и Partitions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Topic в Kafka — категория сообщений (как таблица в БД). Partition — физическое разделение topic для параллелизма. Сообщения внутри одной partition строго упорядочены. Key определяет в какую partition попадёт сообщение.' },
        { type: 'code', language: 'bash', value: '# Структура Topic:\n# Topic: order-events\n#   Partition 0: [msg1] [msg3] [msg5] [msg8]\n#   Partition 1: [msg2] [msg4] [msg7]\n#   Partition 2: [msg6] [msg9] [msg10]\n\n# Порядок ГАРАНТИРОВАН только внутри одной partition!\n# msg1 < msg3 < msg5 < msg8  (внутри partition 0)\n# msg1 и msg2 — порядок НЕ гарантирован (разные partitions)\n\n# Key определяет partition:\n# key = orderId -> hash(orderId) % numPartitions\n# Все события одного заказа попадут в одну partition!\n\n# Создание topic через CLI:\nkafka-topics.sh --create \\\n  --bootstrap-server kafka:9092 \\\n  --topic order-events \\\n  --partitions 12 \\\n  --replication-factor 3 \\\n  --config retention.ms=604800000 \\\n  --config cleanup.policy=delete\n\n# Просмотр topic:\nkafka-topics.sh --describe \\\n  --bootstrap-server kafka:9092 \\\n  --topic order-events\n\n# Topic: order-events  Partitions: 12  Replication: 3\n# Partition: 0  Leader: 1  Replicas: 1,2,3  ISR: 1,2,3\n# Partition: 1  Leader: 2  Replicas: 2,3,1  ISR: 2,3,1' },
        { type: 'tip', value: 'Количество partitions = максимальный параллелизм consumer-ов. 12 partitions = максимум 12 consumer-ов в одной group. Выбирайте количество с запасом, увеличить partitions легко, уменьшить — нельзя.' }
      ]
    },
    {
      id: 2,
      title: 'Consumer Groups и Offsets',
      type: 'theory',
      content: [
        { type: 'text', value: 'Consumer Group — группа consumer-ов, читающих topic. Kafka распределяет partitions между consumer-ами группы. Каждая partition обрабатывается ровно одним consumer-ом в группе. Offset — позиция чтения в partition.' },
        { type: 'code', language: 'bash', value: '# Consumer Group распределение:\n# Topic: order-events (6 partitions)\n# Group: payment-service (3 instances)\n#\n# Consumer 1: Partition 0, Partition 1\n# Consumer 2: Partition 2, Partition 3\n# Consumer 3: Partition 4, Partition 5\n#\n# Если Consumer 3 упал -> rebalance:\n# Consumer 1: Partition 0, Partition 1, Partition 4\n# Consumer 2: Partition 2, Partition 3, Partition 5\n\n# Разные группы читают НЕЗАВИСИМО:\n# Group: payment-service  -> читает ВСЕ сообщения\n# Group: notification-service -> читает ВСЕ сообщения (свой offset)\n# Group: analytics-service -> читает ВСЕ сообщения (свой offset)\n\n# Просмотр offsets:\nkafka-consumer-groups.sh --describe \\\n  --bootstrap-server kafka:9092 \\\n  --group payment-service\n\n# GROUP             TOPIC         PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG\n# payment-service   order-events  0          1523            1525            2\n# payment-service   order-events  1          1890            1890            0\n# LAG = LOG-END-OFFSET - CURRENT-OFFSET (сколько не обработано)\n\n# Сброс offset (перечитать с начала):\nkafka-consumer-groups.sh --reset-offsets \\\n  --bootstrap-server kafka:9092 \\\n  --group payment-service \\\n  --topic order-events \\\n  --to-earliest \\\n  --execute' },
        { type: 'warning', value: 'Если consumer-ов больше чем partitions — лишние consumer-ы будут idle (простаивать). 6 partitions и 10 consumer-ов = 6 работают, 4 простаивают. Поэтому partitions >= количество consumer-ов.' }
      ]
    },
    {
      id: 3,
      title: 'Exactly-Once Semantics',
      type: 'theory',
      content: [
        { type: 'text', value: 'Гарантии доставки в Kafka: at-most-once (может потерять), at-least-once (может дублировать), exactly-once (ровно один раз). Exactly-once — самая строгая гарантия, достигается через idempotent producer и transactional API.' },
        { type: 'code', language: 'java', value: '// Гарантии доставки:\n\n// At-Most-Once: автокоммит offset ДО обработки\n// consumer получил -> commit offset -> обработка\n// Если обработка упала — сообщение потеряно!\n\n// At-Least-Once: коммит offset ПОСЛЕ обработки\n// consumer получил -> обработка -> commit offset\n// Если commit упал — сообщение обработается повторно!\n\n// Exactly-Once: транзакционная обработка\n// consumer получил -> обработка + commit offset в одной транзакции\n\n// Настройка Idempotent Producer\n@Bean\npublic ProducerFactory<String, Object> producerFactory() {\n    Map<String, Object> props = new HashMap<>();\n    props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:9092");\n    props.put(ProducerConfig.ACKS_CONFIG, "all");\n    props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true); // Idempotent!\n    props.put(ProducerConfig.RETRIES_CONFIG, 3);\n    props.put(ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION, 5);\n    return new DefaultKafkaProducerFactory<>(props);\n}\n\n// Transactional Producer + Consumer\n@Bean\npublic ProducerFactory<String, Object> producerFactory() {\n    Map<String, Object> props = new HashMap<>();\n    props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:9092");\n    props.put(ProducerConfig.TRANSACTIONAL_ID_CONFIG, "order-service-tx");\n    props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);\n    return new DefaultKafkaProducerFactory<>(props);\n}\n\n// Использование транзакций\n@Service\npublic class OrderProcessor {\n    private final KafkaTemplate<String, Object> kafkaTemplate;\n\n    public void processAndForward(OrderCreatedEvent event) {\n        kafkaTemplate.executeInTransaction(operations -> {\n            // Обработка\n            PaymentRequest payment = createPaymentRequest(event);\n            // Отправка в другой topic в рамках транзакции\n            operations.send("payment-requests", event.orderId().toString(), payment);\n            return null;\n        });\n    }\n}' },
        { type: 'note', value: 'Exactly-once в Kafka работает только внутри Kafka (read-process-write). Для exactly-once с внешними системами (БД, REST) нужен Outbox Pattern или idempotent consumer (проверка по id обработанных сообщений).' }
      ]
    },
    {
      id: 4,
      title: 'Schema Registry и Avro',
      type: 'theory',
      content: [
        { type: 'text', value: 'Schema Registry хранит и версионирует схемы сообщений. Avro — бинарный формат сериализации с поддержкой эволюции схемы. Вместе они гарантируют совместимость producer и consumer.' },
        { type: 'code', language: 'json', value: '// Avro Schema для OrderCreatedEvent\n{\n  "type": "record",\n  "name": "OrderCreatedEvent",\n  "namespace": "com.shop.order.events",\n  "fields": [\n    {"name": "orderId", "type": "string"},\n    {"name": "customerId", "type": "string"},\n    {"name": "totalAmount", "type": "double"},\n    {"name": "createdAt", "type": "long", "logicalType": "timestamp-millis"},\n    {"name": "items", "type": {\n      "type": "array",\n      "items": {\n        "type": "record",\n        "name": "OrderItem",\n        "fields": [\n          {"name": "productId", "type": "string"},\n          {"name": "quantity", "type": "int"},\n          {"name": "price", "type": "double"}\n        ]\n      }\n    }}\n  ]\n}' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml — Kafka + Schema Registry\nservices:\n  zookeeper:\n    image: confluentinc/cp-zookeeper:7.5.0\n    environment:\n      ZOOKEEPER_CLIENT_PORT: 2181\n\n  kafka:\n    image: confluentinc/cp-kafka:7.5.0\n    depends_on: [zookeeper]\n    ports:\n      - "9092:9092"\n    environment:\n      KAFKA_BROKER_ID: 1\n      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181\n      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092\n      KAFKA_NUM_PARTITIONS: 6\n      KAFKA_DEFAULT_REPLICATION_FACTOR: 1\n\n  schema-registry:\n    image: confluentinc/cp-schema-registry:7.5.0\n    depends_on: [kafka]\n    ports:\n      - "8081:8081"\n    environment:\n      SCHEMA_REGISTRY_HOST_NAME: schema-registry\n      SCHEMA_REGISTRY_KAFKASTORE_BOOTSTRAP_SERVERS: kafka:9092\n      SCHEMA_REGISTRY_LISTENERS: http://0.0.0.0:8081' },
        { type: 'list', value: [
          'BACKWARD — новая схема может читать данные старой (удаление поля, добавление optional)',
          'FORWARD — старая схема может читать данные новой (добавление поля, удаление optional)',
          'FULL — оба направления совместимы (самый строгий, рекомендуемый)',
          'NONE — без проверки совместимости (опасно)'
        ] }
      ]
    },
    {
      id: 5,
      title: 'Kafka Streams',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kafka Streams — библиотека для потоковой обработки данных прямо в Kafka. Не требует отдельного кластера (как Apache Flink/Spark). Работает как обычное Java-приложение.' },
        { type: 'code', language: 'java', value: '// Kafka Streams — подсчёт заказов по статусам в реальном времени\n@Configuration\npublic class OrderStreamConfig {\n\n    @Bean\n    public KStream<String, OrderEvent> orderStream(\n            StreamsBuilder streamsBuilder) {\n\n        // Читаем поток событий заказов\n        KStream<String, OrderEvent> orderStream = streamsBuilder\n            .stream("order-events",\n                Consumed.with(Serdes.String(), orderEventSerde));\n\n        // Фильтрация: только подтверждённые заказы\n        KStream<String, OrderEvent> confirmedOrders = orderStream\n            .filter((key, event) -> event.getStatus() == OrderStatus.CONFIRMED);\n\n        // Трансформация: вычисляем revenue по категориям\n        KTable<String, Double> revenueByCategory = confirmedOrders\n            .map((key, event) -> KeyValue.pair(\n                event.getCategory(), event.getTotalAmount()))\n            .groupByKey(Grouped.with(Serdes.String(), Serdes.Double()))\n            .reduce(Double::sum);\n\n        // Записываем результат в выходной topic\n        revenueByCategory.toStream()\n            .to("revenue-by-category",\n                Produced.with(Serdes.String(), Serdes.Double()));\n\n        // Windowed aggregation: заказы за последний час\n        KTable<Windowed<String>, Long> ordersPerHour = orderStream\n            .groupByKey()\n            .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofHours(1)))\n            .count();\n\n        return orderStream;\n    }\n}\n\n// Результат:\n// Topic revenue-by-category:\n// electronics -> 15000.0\n// clothing -> 8500.0\n// books -> 3200.0\n// Обновляется в реальном времени!' },
        { type: 'tip', value: 'Kafka Streams идеален для: агрегации в реальном времени, обогащения событий (join между streams), фильтрации и трансформации потоков. Для более сложных сценариев рассмотрите Apache Flink.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Kafka pipeline',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте Kafka pipeline для обработки заказов с exactly-once семантикой и Kafka Streams аналитикой.',
      requirements: [
        'Настройте Kafka кластер с 3 topics: order-events, payment-events, analytics',
        'Реализуйте Idempotent Producer для отправки OrderCreatedEvent',
        'Настройте Consumer Group для Payment Service с exactly-once обработкой',
        'Создайте Kafka Streams приложение для подсчёта заказов по статусам',
        'Настройте Schema Registry с Avro-схемами и FULL compatibility',
        'Добавьте мониторинг consumer lag через kafka-consumer-groups'
      ],
      hint: 'Для exactly-once используйте transactional.id в producer и isolation.level=read_committed в consumer. Kafka Streams автоматически управляет exactly-once при настройке processing.guarantee=exactly_once_v2.',
      expectedOutput: 'Kafka кластер запущен: 3 брокера, Schema Registry на порту 8081.\nOrderCreatedEvent отправлен в order-events (partition 3, offset 42).\nPayment Service обработал транзакционно (exactly-once).\nKafka Streams: revenue-by-category обновлён в реальном времени.\nConsumer lag: payment-service lag=0, notification-service lag=5.\nАвро-схема зарегистрирована: OrderCreatedEvent v1 (FULL compatible).',
      solution: '// Полный pipeline\n\n// 1. Docker Compose запуск\n// docker-compose up -d zookeeper kafka schema-registry\n\n// 2. Producer конфигурация\nspring:\n  kafka:\n    producer:\n      bootstrap-servers: kafka:9092\n      acks: all\n      properties:\n        enable.idempotence: true\n        transactional.id: order-service-tx-${random.uuid}\n    consumer:\n      bootstrap-servers: kafka:9092\n      group-id: payment-service\n      auto-offset-reset: earliest\n      isolation-level: read_committed\n      enable-auto-commit: false\n\n// 3. Transactional Producer\n@Service\npublic class OrderPublisher {\n    @Transactional\n    public void publish(Order order) {\n        kafkaTemplate.executeInTransaction(ops -> {\n            ops.send("order-events", order.getId().toString(),\n                new OrderCreatedEvent(order));\n            return null;\n        });\n    }\n}\n\n// 4. Kafka Streams аналитика\n@Bean\npublic KStream<String, OrderEvent> analytics(StreamsBuilder builder) {\n    return builder.stream("order-events")\n        .groupBy((k, v) -> v.getStatus().name())\n        .count()\n        .toStream()\n        .peek((status, count) -> log.info("{}: {}", status, count));\n}\n\n// 5. Мониторинг\n// kafka-consumer-groups.sh --describe --group payment-service',
      explanation: 'Kafka pipeline с exactly-once гарантирует что каждый заказ обработается ровно один раз. Schema Registry обеспечивает совместимость при эволюции схем. Kafka Streams обрабатывает аналитику в реальном времени без отдельного кластера. Consumer lag мониторинг показывает здоровье системы.'
    }
  ]
}
