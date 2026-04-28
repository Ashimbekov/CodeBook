export default {
  id: 38,
  title: 'Очереди сообщений: RabbitMQ и Kafka',
  description: 'Message Queues обеспечивают асинхронную коммуникацию между сервисами. RabbitMQ для классических очередей, Kafka для event streaming.',
  lessons: [
    {
      id: 1,
      title: 'Паттерны очередей сообщений',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Зачем нужны очереди?' },
        { type: 'text', value: 'Message Queue — промежуточный слой для асинхронной коммуникации между сервисами. Очереди развязывают сервисы, сглаживают пиковые нагрузки, обеспечивают гарантию доставки и позволяют обрабатывать задачи в фоне.' },
        { type: 'list', items: [
          'Decoupling — сервисы не знают друг о друге, общаются через очередь',
          'Load Leveling — очередь буферизирует пиковую нагрузку',
          'Guaranteed Delivery — сообщение не потеряется при сбое consumer',
          'Async Processing — отправитель не ждёт обработки',
          'Fan-out — одно сообщение может обработать несколько consumer'
        ] },
        { type: 'heading', value: 'Основные паттерны' },
        { type: 'code', language: 'bash', value: '# 1. Point-to-Point (Queue)\n# Producer -> [Queue] -> Consumer\n# Одно сообщение = один consumer\n# Пример: обработка заказов\n\n# 2. Publish/Subscribe (Topic)\n# Producer -> [Topic] -> Consumer A\n#                     -> Consumer B\n#                     -> Consumer C\n# Одно сообщение = все subscribers\n# Пример: уведомления (email + push + SMS)\n\n# 3. Request/Reply\n# Client -> [Request Queue] -> Server\n# Client <- [Reply Queue]   <- Server\n# Пример: RPC через очереди\n\n# 4. Dead Letter Queue (DLQ)\n# Если сообщение не обработано N раз -> [DLQ]\n# Для анализа и ручной обработки ошибок' },
        { type: 'heading', value: 'RabbitMQ vs Kafka' },
        { type: 'code', language: 'bash', value: '# RabbitMQ — traditional message broker\n# + Гибкая маршрутизация (exchanges, routing keys)\n# + Гарантия доставки (ack/nack)\n# + Приоритеты сообщений\n# + Лёгкий старт, меньше complexity\n# - Сообщения удаляются после обработки\n# - Ниже throughput при больших объёмах\n\n# Apache Kafka — event streaming platform\n# + Экстремальный throughput (миллионы msg/sec)\n# + Сообщения хранятся (replay)\n# + Consumer groups для параллельной обработки\n# + Event sourcing, stream processing\n# - Сложнее в эксплуатации\n# - Нет гибкой маршрутизации\n\n# Когда что:\n# RabbitMQ — task queues, email sending, order processing\n# Kafka — event streaming, log aggregation, real-time analytics' },
        { type: 'tip', value: 'Правило: RabbitMQ для "smart broker, dumb consumer" (сложная маршрутизация). Kafka для "dumb broker, smart consumer" (высокий throughput, event sourcing).' }
      ]
    },
    {
      id: 2,
      title: 'RabbitMQ: установка и настройка',
      type: 'theory',
      content: [
        { type: 'heading', value: 'RabbitMQ в Kubernetes' },
        { type: 'text', value: 'RabbitMQ — один из самых популярных message broker. Поддерживает AMQP, MQTT, STOMP протоколы. Для Kubernetes рекомендуется RabbitMQ Cluster Operator для автоматического управления кластером.' },
        { type: 'code', language: 'bash', value: '# Установка RabbitMQ Operator\nkubectl apply -f https://github.com/rabbitmq/cluster-operator/releases/latest/download/cluster-operator.yml\n\n# Или через Helm\nhelm repo add bitnami https://charts.bitnami.com/bitnami\nhelm install rabbitmq bitnami/rabbitmq \\\n  --namespace messaging \\\n  --create-namespace \\\n  --set auth.username=admin \\\n  --set auth.password=secret \\\n  --set replicaCount=3 \\\n  --set metrics.enabled=true' },
        { type: 'code', language: 'yaml', value: '# RabbitmqCluster CRD (через Operator)\napiVersion: rabbitmq.com/v1beta1\nkind: RabbitmqCluster\nmetadata:\n  name: rabbitmq\n  namespace: messaging\nspec:\n  replicas: 3\n  resources:\n    requests:\n      cpu: 500m\n      memory: 1Gi\n    limits:\n      cpu: 1000m\n      memory: 2Gi\n  persistence:\n    storageClassName: gp3\n    storage: 20Gi\n  rabbitmq:\n    additionalConfig: |\n      vm_memory_high_watermark.relative = 0.7\n      disk_free_limit.relative = 1.5\n      consumer_timeout = 3600000\n  override:\n    statefulSet:\n      spec:\n        template:\n          metadata:\n            annotations:\n              prometheus.io/scrape: \"true\"\n              prometheus.io/port: \"15692\"' },
        { type: 'heading', value: 'Основные концепции RabbitMQ' },
        { type: 'code', language: 'bash', value: '# Компоненты RabbitMQ:\n#\n# Producer -> Exchange -> Binding -> Queue -> Consumer\n#\n# Exchange типы:\n# direct   — маршрутизация по точному routing key\n# topic    — маршрутизация по паттерну (order.* или #.error)\n# fanout   — отправка во все привязанные очереди\n# headers  — маршрутизация по headers сообщения\n\n# rabbitmqctl — CLI для управления\nkubectl exec rabbitmq-server-0 -- rabbitmqctl list_queues\nkubectl exec rabbitmq-server-0 -- rabbitmqctl list_exchanges\nkubectl exec rabbitmq-server-0 -- rabbitmqctl list_connections\nkubectl exec rabbitmq-server-0 -- rabbitmqctl cluster_status\n\n# Management UI (port 15672)\nkubectl port-forward svc/rabbitmq 15672:15672 -n messaging\n# Откройте http://localhost:15672' },
        { type: 'note', value: 'RabbitMQ Management Plugin предоставляет веб-интерфейс для управления очередями, мониторинга и отладки. Включён по умолчанию в большинстве установок.' }
      ]
    },
    {
      id: 3,
      title: 'Apache Kafka: основы',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Архитектура Kafka' },
        { type: 'text', value: 'Kafka — распределённая платформа для event streaming. Данные организованы в topics, разделённые на partitions для параллелизма. Сообщения хранятся на диске и могут быть прочитаны повторно.' },
        { type: 'code', language: 'bash', value: '# Ключевые концепции Kafka:\n#\n# Topic    — категория сообщений (orders, payments, logs)\n# Partition — часть topic для параллельной обработки\n# Producer — отправляет сообщения в topic\n# Consumer — читает сообщения из topic\n# Consumer Group — группа consumers, делящих partitions\n# Broker   — сервер Kafka (обычно 3+ для HA)\n# Offset   — позиция consumer в partition\n#\n# Topic: orders (3 partitions)\n# Partition 0: [msg1, msg4, msg7, msg10...]\n# Partition 1: [msg2, msg5, msg8, msg11...]\n# Partition 2: [msg3, msg6, msg9, msg12...]\n#\n# Consumer Group A:\n#   Consumer 1 -> Partition 0\n#   Consumer 2 -> Partition 1, 2\n#\n# Consumer Group B (независимое чтение):\n#   Consumer 3 -> Partition 0, 1, 2' },
        { type: 'heading', value: 'Kafka в Kubernetes (Strimzi)' },
        { type: 'code', language: 'bash', value: '# Установка Strimzi Operator\nhelm repo add strimzi https://strimzi.io/charts/\nhelm install strimzi strimzi/strimzi-kafka-operator \\\n  --namespace kafka \\\n  --create-namespace' },
        { type: 'code', language: 'yaml', value: '# Kafka Cluster через Strimzi\napiVersion: kafka.strimzi.io/v1beta2\nkind: Kafka\nmetadata:\n  name: my-cluster\n  namespace: kafka\nspec:\n  kafka:\n    version: 3.7.0\n    replicas: 3\n    listeners:\n      - name: plain\n        port: 9092\n        type: internal\n        tls: false\n      - name: tls\n        port: 9093\n        type: internal\n        tls: true\n    config:\n      offsets.topic.replication.factor: 3\n      transaction.state.log.replication.factor: 3\n      transaction.state.log.min.isr: 2\n      default.replication.factor: 3\n      min.insync.replicas: 2\n      log.retention.hours: 168  # 7 дней\n    storage:\n      type: persistent-claim\n      size: 100Gi\n      class: gp3\n    resources:\n      requests:\n        memory: 2Gi\n        cpu: 500m\n  zookeeper:\n    replicas: 3\n    storage:\n      type: persistent-claim\n      size: 50Gi\n  entityOperator:\n    topicOperator: {}\n    userOperator: {}' },
        { type: 'code', language: 'bash', value: '# Работа с Kafka через CLI\n# Создание topic\nkubectl exec my-cluster-kafka-0 -n kafka -- \\\n  kafka-topics.sh --create \\\n  --bootstrap-server localhost:9092 \\\n  --topic orders \\\n  --partitions 6 \\\n  --replication-factor 3\n\n# Список topics\nkubectl exec my-cluster-kafka-0 -n kafka -- \\\n  kafka-topics.sh --list --bootstrap-server localhost:9092\n\n# Отправка сообщения\nkubectl exec -it my-cluster-kafka-0 -n kafka -- \\\n  kafka-console-producer.sh --bootstrap-server localhost:9092 --topic orders\n\n# Чтение сообщений\nkubectl exec my-cluster-kafka-0 -n kafka -- \\\n  kafka-console-consumer.sh --bootstrap-server localhost:9092 \\\n  --topic orders --from-beginning --group my-app' },
        { type: 'tip', value: 'Количество partitions определяет максимальный параллелизм consumers в группе. Если 6 partitions — максимум 6 consumers в группе. Больше partitions = выше throughput, но больше overhead.' }
      ]
    },
    {
      id: 4,
      title: 'Kafka Connect',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Kafka Connect — интеграция данных' },
        { type: 'text', value: 'Kafka Connect — фреймворк для потоковой передачи данных между Kafka и внешними системами (базы данных, S3, Elasticsearch). Source Connectors читают данные в Kafka, Sink Connectors пишут из Kafka.' },
        { type: 'code', language: 'yaml', value: '# KafkaConnect Cluster (Strimzi)\napiVersion: kafka.strimzi.io/v1beta2\nkind: KafkaConnect\nmetadata:\n  name: my-connect\n  namespace: kafka\n  annotations:\n    strimzi.io/use-connector-resources: \"true\"\nspec:\n  version: 3.7.0\n  replicas: 2\n  bootstrapServers: my-cluster-kafka-bootstrap:9092\n  config:\n    group.id: connect-cluster\n    offset.storage.topic: connect-offsets\n    config.storage.topic: connect-configs\n    status.storage.topic: connect-status\n  build:\n    output:\n      type: docker\n      image: ghcr.io/myorg/kafka-connect:latest\n    plugins:\n      - name: debezium-postgres\n        artifacts:\n          - type: tgz\n            url: https://repo1.maven.org/maven2/io/debezium/debezium-connector-postgresql/2.5.0.Final/debezium-connector-postgresql-2.5.0.Final-plugin.tar.gz\n      - name: elasticsearch-sink\n        artifacts:\n          - type: zip\n            url: https://d1i4a15mxbxib1.cloudfront.net/api/plugins/confluentinc/kafka-connect-elasticsearch/versions/14.0.12/confluentinc-kafka-connect-elasticsearch-14.0.12.zip' },
        { type: 'heading', value: 'Debezium CDC — Change Data Capture' },
        { type: 'code', language: 'yaml', value: '# PostgreSQL Source Connector (CDC через Debezium)\napiVersion: kafka.strimzi.io/v1beta2\nkind: KafkaConnector\nmetadata:\n  name: postgres-source\n  namespace: kafka\n  labels:\n    strimzi.io/cluster: my-connect\nspec:\n  class: io.debezium.connector.postgresql.PostgresConnector\n  tasksMax: 1\n  config:\n    database.hostname: postgres-primary.production\n    database.port: 5432\n    database.user: debezium\n    database.password: ${secrets:postgres-password}\n    database.dbname: mydb\n    topic.prefix: mydb\n    plugin.name: pgoutput\n    slot.name: debezium_slot\n    publication.name: dbz_publication\n    # Результат: topic mydb.public.users содержит все изменения таблицы users' },
        { type: 'code', language: 'yaml', value: '# Elasticsearch Sink Connector\napiVersion: kafka.strimzi.io/v1beta2\nkind: KafkaConnector\nmetadata:\n  name: elasticsearch-sink\n  namespace: kafka\n  labels:\n    strimzi.io/cluster: my-connect\nspec:\n  class: io.confluent.connect.elasticsearch.ElasticsearchSinkConnector\n  tasksMax: 3\n  config:\n    connection.url: http://elasticsearch.logging:9200\n    topics: mydb.public.users,mydb.public.orders\n    type.name: _doc\n    key.ignore: false\n    schema.ignore: true\n    behavior.on.null.values: delete' },
        { type: 'note', value: 'Debezium CDC отслеживает изменения в базе данных (INSERT/UPDATE/DELETE) и отправляет их в Kafka topics. Это позволяет синхронизировать данные между системами в реальном времени без изменения кода приложения.' }
      ]
    },
    {
      id: 5,
      title: 'Event-Driven Architecture',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Event-Driven Architecture (EDA)' },
        { type: 'text', value: 'EDA — архитектурный паттерн, где сервисы общаются через события. Сервис публикует событие ("заказ создан"), а другие сервисы реагируют на него. Это обеспечивает слабую связанность и масштабируемость.' },
        { type: 'code', language: 'bash', value: '# Пример: E-commerce Event-Driven Architecture\n#\n# 1. User Service: пользователь создаёт заказ\n#    -> Publish: "OrderCreated" {orderId, userId, items, total}\n#\n# 2. Payment Service: слушает OrderCreated\n#    -> Обработка платежа\n#    -> Publish: "PaymentProcessed" {orderId, status}\n#\n# 3. Inventory Service: слушает OrderCreated\n#    -> Резервирование товаров\n#    -> Publish: "InventoryReserved" {orderId, items}\n#\n# 4. Notification Service: слушает PaymentProcessed\n#    -> Отправка email/push пользователю\n#\n# 5. Analytics Service: слушает ВСЕ события\n#    -> Обновление real-time дашборда\n\n# Каждый сервис независим и масштабируется отдельно\n# Добавление нового subscriber не требует изменений в producer' },
        { type: 'heading', value: 'Стандарт CloudEvents' },
        { type: 'code', language: 'bash', value: '# CloudEvents — стандартный формат событий\n# {\n#   "specversion": "1.0",\n#   "type": "com.company.order.created",\n#   "source": "/order-service",\n#   "id": "A234-1234-1234",\n#   "time": "2024-03-15T10:30:00Z",\n#   "datacontenttype": "application/json",\n#   "data": {\n#     "orderId": "ORD-12345",\n#     "userId": "USR-67890",\n#     "items": [\n#       {"productId": "PROD-1", "quantity": 2, "price": 29.99}\n#     ],\n#     "total": 59.98\n#   }\n# }' },
        { type: 'heading', value: 'Мониторинг очередей' },
        { type: 'code', language: 'bash', value: '# Ключевые метрики для мониторинга:\n\n# RabbitMQ:\n# rabbitmq_queue_messages — количество сообщений в очереди\n# rabbitmq_queue_messages_unacknowledged — неподтверждённые\n# rabbitmq_queue_consumers — количество consumers\n# rabbitmq_channel_messages_published_total — отправленные\n\n# Kafka:\n# kafka_consumer_group_lag — отставание consumer от producer\n# kafka_server_brokertopicmetrics_messagesinpersec — throughput\n# kafka_server_replicamanager_underreplicatedpartitions — проблемы репликации\n\n# Алерт: Consumer Lag растёт\n# Если lag постоянно увеличивается — consumer не справляется\n# Решение: добавить consumers или partitions\n\n# Алерт: Queue depth > threshold\n# Если очередь переполняется — проблема с consumer\n# Решение: масштабировать consumers, проверить DLQ' },
        { type: 'tip', value: 'Consumer Lag — главная метрика для Kafka. Если lag растёт, consumer не успевает обрабатывать сообщения. Решение: увеличить количество consumers (до числа partitions) или оптимизировать обработку.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка очередей',
      type: 'practice',
      difficulty: 'medium',
      description: 'Разверните RabbitMQ и Kafka в Kubernetes, настройте producer/consumer, мониторинг и Dead Letter Queue.',
      requirements: [
        'Установите RabbitMQ через Helm с 3 репликами',
        'Создайте exchange (topic), queue и binding для обработки заказов',
        'Установите Kafka через Strimzi Operator с 3 brokers',
        'Создайте Kafka topic "orders" с 6 partitions',
        'Настройте Dead Letter Queue для необработанных сообщений',
        'Создайте Prometheus алерт на consumer lag > 1000'
      ],
      hint: 'RabbitMQ через bitnami/rabbitmq Helm chart. Kafka через Strimzi CRD. DLQ в RabbitMQ через x-dead-letter-exchange. Consumer lag мониторинг через kafka_consumergroup_lag.',
      expectedOutput: 'kubectl get pods -n messaging => rabbitmq 3/3 Running\nkubectl get kafka -n kafka => my-cluster 3 brokers Ready\nkafka-topics.sh --describe --topic orders => 6 partitions, RF=3\nRabbitMQ Management: orders queue with DLQ configured\nPrometheus: kafka_consumergroup_lag metric available',
      solution: '# 1. RabbitMQ\nhelm install rabbitmq bitnami/rabbitmq -n messaging \\\n  --create-namespace --set replicaCount=3 --set metrics.enabled=true\n\n# 2. Kafka (Strimzi)\nhelm install strimzi strimzi/strimzi-kafka-operator -n kafka --create-namespace\n# kubectl apply -f kafka-cluster.yaml\n# apiVersion: kafka.strimzi.io/v1beta2\n# kind: Kafka\n# spec:\n#   kafka: { replicas: 3 }\n#   zookeeper: { replicas: 3 }\n\n# 3. Kafka Topic\n# apiVersion: kafka.strimzi.io/v1beta2\n# kind: KafkaTopic\n# metadata:\n#   name: orders\n#   labels: { strimzi.io/cluster: my-cluster }\n# spec:\n#   partitions: 6\n#   replicas: 3\n\n# 4. DLQ в RabbitMQ\n# rabbitmqctl set_policy DLQ "orders.*" \\\n#   \'{"dead-letter-exchange":"dlx","dead-letter-routing-key":"dlq"}\'\n\n# 5. Алерт\n# alert: KafkaConsumerLag\n# expr: kafka_consumergroup_lag > 1000\n# for: 5m',
      explanation: 'RabbitMQ подходит для task queues с гибкой маршрутизацией и гарантией доставки. Kafka — для event streaming с высоким throughput и хранением событий. DLQ перехватывает необработанные сообщения для анализа. Consumer lag — главная метрика здоровья pipeline.'
    }
  ]
}
