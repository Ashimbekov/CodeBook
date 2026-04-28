export default {
  id: 22,
  title: 'Логирование: ELK Stack',
  description: 'Централизованное логирование с ELK Stack: Elasticsearch для хранения, Logstash для обработки, Kibana для визуализации.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужно централизованное логирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'В микросервисной архитектуре логи разбросаны по десяткам контейнеров и серверов. Централизованное логирование собирает все логи в одно место для поиска, анализа и корреляции.' },
        { type: 'heading', value: 'Проблемы без централизованного логирования' },
        { type: 'list', value: [
          'Логи на 50 серверах — где искать ошибку?',
          'Контейнер перезапустился — логи потеряны',
          'Нет корреляции между сервисами (один запрос -> 5 сервисов)',
          'Невозможно строить аналитику и тренды',
          'Нет алертов на паттерны ошибок'
        ] },
        { type: 'heading', value: 'ELK Stack' },
        { type: 'code', language: 'bash', value: '# ELK Stack:\n# Elasticsearch — хранение и поиск логов (полнотекстовый поиск)\n# Logstash      — приём, обработка и отправка логов\n# Kibana        — визуализация и анализ логов\n\n# Расширенный стек (EFK):\n# Elasticsearch — хранение\n# Fluentd/Fluent Bit — сбор логов (легче Logstash)\n# Kibana        — визуализация\n\n# Альтернативы:\n# Loki + Grafana — от создателей Grafana, легче ELK\n# Datadog Logs   — SaaS\n# Splunk         — enterprise\n\n# Поток данных:\n# [App Logs] -> [Filebeat/Fluentd] -> [Logstash] -> [Elasticsearch] -> [Kibana]\n#                  сбор              обработка      хранение         визуализация' },
        { type: 'tip', value: 'Для небольших проектов Loki + Grafana проще и дешевле ELK. Для enterprise с большим объёмом логов и сложным поиском — ELK незаменим. Elasticsearch требует много ресурсов (RAM!).' }
      ]
    },
    {
      id: 2,
      title: 'Elasticsearch',
      type: 'theory',
      content: [
        { type: 'text', value: 'Elasticsearch — распределённая поисковая система. Хранит документы (логи) в индексах и обеспечивает быстрый полнотекстовый поиск по миллиардам записей.' },
        { type: 'heading', value: 'Запуск и базовые операции' },
        { type: 'code', language: 'bash', value: '# Запуск через Docker\ndocker run -d --name elasticsearch \\\n  -e "discovery.type=single-node" \\\n  -e "xpack.security.enabled=false" \\\n  -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \\\n  -p 9200:9200 \\\n  elasticsearch:8.12.0\n\n# Проверка\ncurl http://localhost:9200\n# { "name": "node-1", "version": { "number": "8.12.0" } }\n\n# Индексы\ncurl -X GET "localhost:9200/_cat/indices?v"\n# health index            docs.count\n# green  app-logs-2024.03  1542389\n\n# Добавление документа\ncurl -X POST "localhost:9200/app-logs/_doc" -H "Content-Type: application/json" -d \'{\n  "timestamp": "2024-03-21T10:00:00Z",\n  "level": "ERROR",\n  "service": "auth-service",\n  "message": "Failed to connect to database",\n  "trace_id": "abc-123"\n}\'\n\n# Поиск\ncurl -X GET "localhost:9200/app-logs/_search" -H "Content-Type: application/json" -d \'{\n  "query": {\n    "bool": {\n      "must": [\n        { "match": { "level": "ERROR" } },\n        { "match": { "service": "auth-service" } }\n      ],\n      "filter": [\n        { "range": { "timestamp": { "gte": "now-1h" } } }\n      ]\n    }\n  }\n}\''},
        { type: 'warning', value: 'Elasticsearch требует минимум 2 GB RAM (рекомендуется 4-8 GB для production). Не выделяй больше 50% RAM хоста для JVM heap. Используй Index Lifecycle Management (ILM) для автоматического удаления старых индексов.' }
      ]
    },
    {
      id: 3,
      title: 'Logstash и Filebeat',
      type: 'theory',
      content: [
        { type: 'text', value: 'Logstash принимает, обрабатывает и отправляет логи. Filebeat — легковесный агент для сбора логов с файлов и отправки в Logstash/Elasticsearch.' },
        { type: 'heading', value: 'Конфигурация Logstash' },
        { type: 'code', language: 'bash', value: '# logstash.conf\ninput {\n  beats {\n    port => 5044\n  }\n  tcp {\n    port => 5000\n    codec => json\n  }\n}\n\nfilter {\n  # Парсинг JSON логов\n  if [message] =~ /^\\{/ {\n    json {\n      source => "message"\n    }\n  }\n\n  # Парсинг nginx access log\n  if [fields][type] == "nginx-access" {\n    grok {\n      match => { "message" => "%{COMBINEDAPACHELOG}" }\n    }\n    geoip {\n      source => "clientip"\n    }\n  }\n\n  # Добавление метаданных\n  mutate {\n    add_field => { "environment" => "production" }\n    remove_field => ["@version", "host"]\n  }\n\n  # Парсинг даты\n  date {\n    match => ["timestamp", "ISO8601"]\n    target => "@timestamp"\n  }\n}\n\noutput {\n  elasticsearch {\n    hosts => ["elasticsearch:9200"]\n    index => "app-logs-%{+YYYY.MM.dd}"\n  }\n}' },
        { type: 'heading', value: 'Конфигурация Filebeat' },
        { type: 'code', language: 'yaml', value: '# filebeat.yml\nfilebeat.inputs:\n  - type: log\n    enabled: true\n    paths:\n      - /var/log/nginx/access.log\n      - /var/log/nginx/error.log\n    fields:\n      type: nginx\n    multiline.pattern: "^\\\\["\n    multiline.negate: true\n    multiline.match: after\n\n  - type: container\n    paths:\n      - /var/lib/docker/containers/*/*.log\n    processors:\n      - add_docker_metadata: ~\n\noutput.logstash:\n  hosts: ["logstash:5044"]\n\n# Или напрямую в Elasticsearch:\n# output.elasticsearch:\n#   hosts: ["elasticsearch:9200"]\n#   index: "filebeat-%{+yyyy.MM.dd}"' },
        { type: 'tip', value: 'Filebeat легче Logstash (10 MB vs 1 GB RAM). Используй Filebeat для сбора логов на серверах и контейнерах, Logstash — для сложной обработки (grok, geoip, enrichment). Можно использовать Filebeat -> Logstash -> Elasticsearch.' }
      ]
    },
    {
      id: 4,
      title: 'Kibana: визуализация логов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kibana — веб-интерфейс для поиска и визуализации логов из Elasticsearch. Позволяет искать, фильтровать, строить графики и создавать дашборды.' },
        { type: 'heading', value: 'Основные возможности' },
        { type: 'code', language: 'bash', value: '# Запуск Kibana\ndocker run -d --name kibana \\\n  -e "ELASTICSEARCH_HOSTS=http://elasticsearch:9200" \\\n  -p 5601:5601 \\\n  kibana:8.12.0\n\n# Открыть: http://localhost:5601\n\n# 1. Discover — поиск логов\n# KQL (Kibana Query Language):\n# level: "ERROR"\n# level: "ERROR" and service: "auth"\n# message: "connection refused"\n# status >= 500\n# @timestamp >= "2024-03-21" and @timestamp < "2024-03-22"\n\n# 2. Visualize — графики\n# Bar chart: количество ошибок по часам\n# Pie chart: распределение по status code\n# Line chart: RPS по времени\n# Data table: топ ошибок\n\n# 3. Dashboard — дашборды\n# Комбинация нескольких визуализаций\n# Общий фильтр по времени\n# Автообновление\n\n# 4. Alerting — алерты на паттерны в логах\n# "Более 100 ошибок за 5 минут" -> Slack уведомление' },
        { type: 'heading', value: 'Полезные KQL запросы' },
        { type: 'code', language: 'bash', value: '# Ошибки за последний час\nlevel: "ERROR" and @timestamp >= "now-1h"\n\n# Конкретный сервис\nservice: "payment-service" and level: ("ERROR" or "WARN")\n\n# Поиск по тексту\nmessage: "timeout" or message: "connection refused"\n\n# Конкретный пользователь\nuser_id: "12345" and action: "login"\n\n# HTTP ошибки\nstatus >= 500\nstatus: (502 or 503 or 504)\n\n# Исключить healthcheck\nnot path: "/health" and not path: "/ready"\n\n# По trace_id (распределённая трассировка)\ntrace_id: "abc-123-def-456"' },
        { type: 'note', value: 'Index Patterns в Kibana определяют какие индексы показывать. Создай pattern: app-logs-* для матчинга всех индексов по дням. Поле @timestamp должно быть правильно настроено для фильтрации по времени.' }
      ]
    },
    {
      id: 5,
      title: 'Структурированное логирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Структурированные логи (JSON) намного полезнее текстовых. Они легко парсятся, фильтруются и анализируются. Это стандарт для облачных приложений.' },
        { type: 'heading', value: 'Текстовые vs структурированные логи' },
        { type: 'code', language: 'bash', value: '# ПЛОХО — текстовые логи:\n# 2024-03-21 10:00:00 ERROR auth Failed login for user admin from 192.168.1.1\n# Как парсить? Как фильтровать по user? По IP?\n\n# ХОРОШО — JSON логи:\n# {\n#   "timestamp": "2024-03-21T10:00:00Z",\n#   "level": "ERROR",\n#   "service": "auth-service",\n#   "event": "login_failed",\n#   "user": "admin",\n#   "ip": "192.168.1.1",\n#   "reason": "invalid_password",\n#   "trace_id": "abc-123",\n#   "request_id": "req-456"\n# }' },
        { type: 'heading', value: 'Best Practices логирования' },
        { type: 'list', value: [
          'Используй JSON формат — легко парсить и искать',
          'Добавляй trace_id / request_id — корреляция между сервисами',
          'Логируй уровни: DEBUG, INFO, WARN, ERROR, FATAL',
          'Не логируй секреты (пароли, токены, PII)',
          'Добавляй контекст: service, environment, hostname',
          'В продакшене: INFO и выше (не DEBUG)',
          'Настрой rotation и retention — логи не должны заполнить диск'
        ] },
        { type: 'code', language: 'bash', value: '# Пример конфигурации Docker для JSON-логов\n# docker-compose.yml:\n# services:\n#   app:\n#     logging:\n#       driver: json-file\n#       options:\n#         max-size: "10m"\n#         max-file: "3"\n#         tag: "{{.Name}}"\n\n# Или отправка в Fluentd:\n# services:\n#   app:\n#     logging:\n#       driver: fluentd\n#       options:\n#         fluentd-address: localhost:24224\n#         tag: app.myservice' },
        { type: 'warning', value: 'Логи могут содержать персональные данные (PII): email, IP, имена. В EU это регулируется GDPR. Маскируй PII в логах или используй отдельные индексы с ограниченным доступом.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Развёртывание ELK',
      type: 'practice',
      difficulty: 'hard',
      description: 'Разверните ELK Stack и настройте сбор логов из приложения.',
      requirements: [
        'Запустите Elasticsearch, Logstash и Kibana через Docker Compose',
        'Настройте Filebeat для сбора логов Docker контейнеров',
        'Создайте Logstash pipeline для парсинга JSON-логов',
        'Создайте Index Pattern в Kibana',
        'Выполните поиск логов по уровню ERROR',
        'Создайте дашборд с графиком ошибок по времени'
      ],
      hint: 'docker compose up для ELK. Filebeat input: type: container. Logstash filter: json. Kibana: Management -> Index Patterns -> app-logs-*.',
      expectedOutput: 'ELK Stack запущен: ES :9200, Kibana :5601\nFilebeat собирает логи контейнеров\nLogstash парсит JSON и отправляет в ES\nKibana: Index Pattern app-logs-* создан\nDiscover: найдены ERROR логи\nДашборд: график ошибок по времени',
      solution: '# docker-compose-elk.yml включает:\n# elasticsearch (9200), logstash (5044), kibana (5601), filebeat\n\n# 1. Запуск\ndocker compose -f docker-compose-elk.yml up -d\n\n# 2. Проверка ES\ncurl http://localhost:9200/_cat/health?v\n\n# 3. Logstash pipeline (logstash.conf):\n# input { beats { port => 5044 } }\n# filter {\n#   json { source => "message" }\n#   date { match => ["timestamp", "ISO8601"] target => "@timestamp" }\n# }\n# output { elasticsearch { hosts => ["elasticsearch:9200"] index => "app-logs-%{+YYYY.MM.dd}" } }\n\n# 4. Filebeat (filebeat.yml):\n# filebeat.inputs:\n#   - type: container\n#     paths: ["/var/lib/docker/containers/*/*.log"]\n# output.logstash:\n#   hosts: ["logstash:5044"]\n\n# 5. Kibana:\n# http://localhost:5601\n# Stack Management -> Index Patterns -> Create: app-logs-*\n# Discover -> KQL: level: "ERROR"\n\n# 6. Dashboard:\n# Visualize -> Create -> Lens\n# X-axis: @timestamp, Y-axis: Count\n# Filter: level: "ERROR"',
      explanation: 'Filebeat собирает логи из Docker контейнеров и отправляет в Logstash. Logstash парсит JSON, извлекает поля (level, service, message) и индексирует в Elasticsearch. Kibana подключается к Elasticsearch и позволяет искать, фильтровать и визуализировать логи. Index Pattern определяет какие индексы отображать.'
    }
  ]
}
