export default {
  id: 17,
  title: 'Централизованное логирование',
  description: 'ELK Stack (Elasticsearch, Logstash, Kibana), Fluentd, structured logging, корреляция логов между сервисами.',
  lessons: [
    {
      id: 1,
      title: 'Зачем централизованное логирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'В микросервисах логи разбросаны по десяткам контейнеров. Без централизации нужно ssh на каждый сервер и grep по файлам. Централизованное логирование собирает все логи в одно место с поиском и визуализацией.' },
        { type: 'code', language: 'bash', value: '# Проблема: 20 сервисов, 3 реплики каждый = 60 источников логов\n# kubectl logs order-service-abc123   -> логи одного Pod\n# kubectl logs order-service-def456   -> логи другого Pod\n# Нужно искать в 60 местах!\n\n# Решение: ELK Stack / EFK Stack\n# E = Elasticsearch (хранение и поиск)\n# L = Logstash (обработка и трансформация) / F = Fluentd\n# K = Kibana (визуализация и дашборды)\n\n# Архитектура:\n# [Service A] -> stdout -> [Fluentd/Filebeat] -> [Logstash] -> [Elasticsearch]\n# [Service B] -> stdout -> [Fluentd/Filebeat] -> [Logstash] -> [Elasticsearch]\n# [Service C] -> stdout -> [Fluentd/Filebeat] -> [Logstash] -> [Elasticsearch]\n#                                                                    |\n#                                                               [Kibana UI]\n#\n# В Kubernetes: DaemonSet Fluentd на каждой ноде\n# собирает stdout/stderr всех Pod-ов автоматически' },
        { type: 'tip', value: 'В микросервисах логируйте в stdout/stderr (12-Factor App). Не пишите в файлы. Kubernetes/Docker автоматически собирают stdout. Centralized logging система агрегирует.' }
      ]
    },
    {
      id: 2,
      title: 'Structured Logging',
      type: 'theory',
      content: [
        { type: 'text', value: 'Structured logging — логирование в формате JSON вместо текстовых строк. JSON легко парсится, индексируется и фильтруется в Elasticsearch. Каждый лог — документ с полями.' },
        { type: 'code', language: 'java', value: '// Unstructured (плохо):\n// 2026-04-04 10:15:30 INFO OrderService - Order created: 123 for user 456\n// Как искать? Regex? Какой сервис? Какой traceId?\n\n// Structured JSON (хорошо):\n// {\n//   "timestamp": "2026-04-04T10:15:30.123Z",\n//   "level": "INFO",\n//   "service": "order-service",\n//   "traceId": "abc123",\n//   "spanId": "def456",\n//   "correlationId": "req-789",\n//   "message": "Order created",\n//   "orderId": "order-123",\n//   "customerId": "user-456",\n//   "amount": 1500.00\n// }\n\n// Spring Boot + Logback JSON\n// build.gradle:\n// implementation "net.logstash.logback:logstash-logback-encoder:7.4"\n\n// Структурное логирование в коде:\n@Service\n@Slf4j\npublic class OrderService {\n    public Order createOrder(CreateOrderRequest request) {\n        Order order = orderRepository.save(new Order(request));\n\n        // Structured logging с полями\n        log.atInfo()\n            .addKeyValue("orderId", order.getId())\n            .addKeyValue("customerId", order.getCustomerId())\n            .addKeyValue("amount", order.getTotalAmount())\n            .addKeyValue("itemCount", order.getItems().size())\n            .log("Order created successfully");\n\n        return order;\n    }\n}' },
        { type: 'code', language: 'json', value: '// logback-spring.xml — JSON формат\n// <configuration>\n//   <appender name="JSON" class="ch.qos.logback.core.ConsoleAppender">\n//     <encoder class="net.logstash.logback.encoder.LogstashEncoder">\n//       <includeMdcKeyName>traceId</includeMdcKeyName>\n//       <includeMdcKeyName>spanId</includeMdcKeyName>\n//       <includeMdcKeyName>correlationId</includeMdcKeyName>\n//       <customFields>{"service":"order-service","env":"production"}</customFields>\n//     </encoder>\n//   </appender>\n//   <root level="INFO"><appender-ref ref="JSON"/></root>\n// </configuration>\n\n// Результат в stdout:\n{\n  "@timestamp": "2026-04-04T10:15:30.123Z",\n  "level": "INFO",\n  "logger_name": "com.shop.OrderService",\n  "message": "Order created successfully",\n  "traceId": "abc123def456",\n  "spanId": "span789",\n  "service": "order-service",\n  "orderId": "order-123",\n  "customerId": "user-456",\n  "amount": 1500.00\n}' },
        { type: 'warning', value: 'Не логируйте чувствительные данные: пароли, номера карт, персональные данные (GDPR). Используйте маскирование: email -> u***@example.com, card -> ****1234.' }
      ]
    },
    {
      id: 3,
      title: 'ELK Stack',
      type: 'theory',
      content: [
        { type: 'text', value: 'ELK Stack: Elasticsearch хранит и индексирует логи, Logstash обрабатывает и трансформирует, Kibana визуализирует. Стандарт для централизованного логирования.' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml — ELK Stack\nservices:\n  elasticsearch:\n    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0\n    environment:\n      - discovery.type=single-node\n      - xpack.security.enabled=false\n      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"\n    ports:\n      - "9200:9200"\n    volumes:\n      - es-data:/usr/share/elasticsearch/data\n\n  logstash:\n    image: docker.elastic.co/logstash/logstash:8.11.0\n    ports:\n      - "5044:5044"   # Beats input\n      - "5000:5000"   # TCP input\n    volumes:\n      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf\n    depends_on: [elasticsearch]\n\n  kibana:\n    image: docker.elastic.co/kibana/kibana:8.11.0\n    ports:\n      - "5601:5601"\n    environment:\n      ELASTICSEARCH_HOSTS: http://elasticsearch:9200\n    depends_on: [elasticsearch]' },
        { type: 'code', language: 'bash', value: '# logstash.conf — pipeline обработки\n# input {\n#   tcp {\n#     port => 5000\n#     codec => json\n#   }\n#   beats {\n#     port => 5044\n#   }\n# }\n#\n# filter {\n#   # Парсинг JSON если нужно\n#   json {\n#     source => "message"\n#     target => "parsed"\n#   }\n#   # Добавление geo IP\n#   geoip {\n#     source => "clientIp"\n#   }\n#   # Маскирование чувствительных данных\n#   mutate {\n#     gsub => [\n#       "message", "\\b\\d{16}\\b", "****MASKED****",\n#       "email", "(\\w{2})\\w+@", "\\1***@"\n#     ]\n#   }\n# }\n#\n# output {\n#   elasticsearch {\n#     hosts => ["elasticsearch:9200"]\n#     index => "microservices-logs-%{+YYYY.MM.dd}"\n#   }\n# }' },
        { type: 'note', value: 'Elasticsearch потребляет много ресурсов. В production: минимум 3 ноды, 16GB RAM каждая. Для экономии используйте Hot-Warm архитектуру: свежие логи на SSD (hot), старые на HDD (warm), удаляйте через ILM (Index Lifecycle Management).' }
      ]
    },
    {
      id: 4,
      title: 'Fluentd и Filebeat',
      type: 'theory',
      content: [
        { type: 'text', value: 'Fluentd и Filebeat — агенты для сбора логов. В Kubernetes запускаются как DaemonSet (по одному на ноду). Fluentd — более функциональный (Go + Ruby), Filebeat — легковесный (Go).' },
        { type: 'code', language: 'yaml', value: '# Fluentd DaemonSet для Kubernetes\napiVersion: apps/v1\nkind: DaemonSet\nmetadata:\n  name: fluentd\n  namespace: logging\nspec:\n  selector:\n    matchLabels:\n      app: fluentd\n  template:\n    spec:\n      containers:\n        - name: fluentd\n          image: fluent/fluentd-kubernetes-daemonset:v1.16-debian-elasticsearch8-1\n          env:\n            - name: FLUENT_ELASTICSEARCH_HOST\n              value: elasticsearch.logging.svc.cluster.local\n            - name: FLUENT_ELASTICSEARCH_PORT\n              value: "9200"\n          volumeMounts:\n            - name: varlog\n              mountPath: /var/log\n            - name: dockercontainers\n              mountPath: /var/lib/docker/containers\n              readOnly: true\n      volumes:\n        - name: varlog\n          hostPath:\n            path: /var/log\n        - name: dockercontainers\n          hostPath:\n            path: /var/lib/docker/containers' },
        { type: 'code', language: 'yaml', value: '# fluent.conf — конфигурация Fluentd\n<source>\n  @type tail\n  path /var/log/containers/*.log\n  pos_file /var/log/fluentd-containers.log.pos\n  tag kubernetes.*\n  <parse>\n    @type json\n    time_key time\n    time_format %Y-%m-%dT%H:%M:%S.%NZ\n  </parse>\n</source>\n\n<filter kubernetes.**>\n  @type kubernetes_metadata\n  # Автоматически добавляет: pod_name, namespace, container_name, labels\n</filter>\n\n<filter kubernetes.**>\n  @type record_transformer\n  <record>\n    cluster "production"\n    environment "prod"\n  </record>\n</filter>\n\n<match kubernetes.**>\n  @type elasticsearch\n  host elasticsearch.logging.svc.cluster.local\n  port 9200\n  logstash_format true\n  logstash_prefix microservices\n  include_tag_key true\n  <buffer>\n    @type file\n    path /var/log/fluentd-buffers/kubernetes\n    flush_interval 5s\n    chunk_limit_size 10M\n    retry_max_interval 30s\n  </buffer>\n</match>' },
        { type: 'tip', value: 'Fluentd vs Filebeat: Fluentd — более гибкий (200+ плагинов), используется в EFK Stack. Filebeat — проще, легче, от Elastic, используется в ELK Stack. В Kubernetes оба работают как DaemonSet.' }
      ]
    },
    {
      id: 5,
      title: 'Kibana: поиск и дашборды',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kibana — UI для работы с логами в Elasticsearch. Discover — поиск логов. Dashboards — визуализация. Alerts — уведомления при аномалиях.' },
        { type: 'code', language: 'bash', value: '# Kibana запросы (KQL — Kibana Query Language):\n\n# Все ошибки order-service:\n# service: "order-service" AND level: "ERROR"\n\n# Заказы конкретного пользователя:\n# customerId: "user-456" AND message: "Order created"\n\n# Медленные запросы (>1 сек):\n# duration: > 1000 AND service: "payment-service"\n\n# Ошибки за последний час с трейсом:\n# level: "ERROR" AND traceId: "abc123*"\n\n# Полезные визуализации для дашборда:\n# 1. Количество ошибок по сервисам (bar chart)\n# 2. Распределение уровней логов (pie chart)\n# 3. Количество запросов во времени (line chart)\n# 4. Top-10 ошибок (data table)\n# 5. Среднее время ответа по сервисам (gauge)\n\n# Alerting:\n# Условие: count(level: "ERROR") > 100 за 5 минут\n# Действие: уведомление в Slack/PagerDuty' },
        { type: 'note', value: 'Используйте Index Lifecycle Management (ILM) в Elasticsearch: hot (7 дней, SSD), warm (30 дней, HDD), cold (90 дней, сжатие), delete (>90 дней). Это оптимизирует хранение и стоимость.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка ELK',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте централизованное логирование для микросервисов с ELK Stack и structured logging.',
      requirements: [
        'Запустите ELK Stack через Docker Compose',
        'Настройте structured logging (JSON) в Spring Boot сервисах',
        'Добавьте traceId, spanId, correlationId в каждый лог',
        'Настройте Logstash pipeline для обработки и маскирования',
        'Создайте Kibana дашборд: ошибки по сервисам, requests per second',
        'Настройте alert: >50 ошибок за 5 минут -> уведомление'
      ],
      hint: 'Используйте logstash-logback-encoder для JSON формата. Logstash TCP input для приёма логов. В Kibana создайте index pattern microservices-*. Для alert используйте Kibana Alerting.',
      expectedOutput: 'ELK Stack запущен: Elasticsearch :9200, Kibana :5601.\nLogback JSON в stdout -> Logstash -> Elasticsearch.\nKibana Discover: поиск по traceId=abc123 показывает логи всех сервисов.\nDashboard: bar chart ошибок по сервисам, line chart RPS.\nAlert: 50+ ошибок за 5 минут -> "Critical: High error rate in order-service".',
      solution: '# docker-compose.yml\nservices:\n  elasticsearch:\n    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0\n    environment:\n      - discovery.type=single-node\n      - xpack.security.enabled=false\n    ports: ["9200:9200"]\n  logstash:\n    image: docker.elastic.co/logstash/logstash:8.11.0\n    volumes: [./logstash.conf:/usr/share/logstash/pipeline/logstash.conf]\n    ports: ["5000:5000"]\n  kibana:\n    image: docker.elastic.co/kibana/kibana:8.11.0\n    ports: ["5601:5601"]\n\n# logback-spring.xml\n# <appender name="JSON" class="ch.qos.logback.core.ConsoleAppender">\n#   <encoder class="net.logstash.logback.encoder.LogstashEncoder">\n#     <customFields>{"service":"order-service"}</customFields>\n#   </encoder>\n# </appender>\n# <appender name="LOGSTASH" class="net.logstash.logback.appender.LogstashTcpSocketAppender">\n#   <destination>logstash:5000</destination>\n#   <encoder class="net.logstash.logback.encoder.LogstashEncoder"/>\n# </appender>',
      explanation: 'Централизованное логирование с ELK позволяет искать и анализировать логи всех сервисов из одного UI. Structured logging (JSON) обеспечивает структурированный поиск. TraceId связывает логи с distributed traces. Kibana дашборды дают общую картину здоровья системы.'
    }
  ]
}
