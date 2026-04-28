export default {
  id: 18,
  title: 'Мониторинг микросервисов',
  description: 'Мониторинг с Prometheus и Grafana: метрики приложений, RED/USE методы, alerting, SLI/SLO/SLA, health dashboards.',
  lessons: [
    {
      id: 1,
      title: 'Метрики микросервисов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Метрики — числовые показатели здоровья системы. В микросервисах мониторят: RED (Rate, Errors, Duration) для сервисов и USE (Utilization, Saturation, Errors) для ресурсов.' },
        { type: 'code', language: 'bash', value: '# RED Method — для каждого сервиса:\n# R (Rate):     количество запросов в секунду\n# E (Errors):   количество ошибок (4xx, 5xx)\n# D (Duration): время ответа (p50, p95, p99)\n\n# USE Method — для каждого ресурса (CPU, RAM, Disk, Network):\n# U (Utilization): процент использования (CPU 75%)\n# S (Saturation):  степень перегрузки (очередь запросов)\n# E (Errors):      ошибки ресурса (disk I/O errors)\n\n# Четыре золотых сигнала (Google SRE):\n# 1. Latency:    время ответа (отдельно для успешных и ошибок)\n# 2. Traffic:    requests per second\n# 3. Errors:     error rate (%)\n# 4. Saturation: насколько загружена система\n\n# Типы метрик Prometheus:\n# Counter:   только растёт (total requests, total errors)\n# Gauge:     может расти и падать (temperature, active connections)\n# Histogram:  распределение значений (request duration buckets)\n# Summary:    квантили (p50, p95, p99)' },
        { type: 'tip', value: 'Начните с RED метрик для каждого сервиса. Это даёт 80% видимости. Затем добавьте бизнес-метрики: количество заказов, средний чек, конверсия.' }
      ]
    },
    {
      id: 2,
      title: 'Prometheus и Spring Boot',
      type: 'theory',
      content: [
        { type: 'text', value: 'Prometheus — система мониторинга с pull-моделью. Spring Boot Actuator + Micrometer экспортируют метрики в формате Prometheus. Prometheus периодически собирает (scrape) метрики с каждого сервиса.' },
        { type: 'code', language: 'java', value: '// Spring Boot + Prometheus\n// build.gradle:\n// implementation "org.springframework.boot:spring-boot-starter-actuator"\n// implementation "io.micrometer:micrometer-registry-prometheus"\n\n// Кастомные бизнес-метрики\n@Service\npublic class OrderService {\n    private final Counter orderCreatedCounter;\n    private final Timer orderProcessingTimer;\n    private final DistributionSummary orderAmountSummary;\n    private final AtomicInteger activeOrders;\n\n    public OrderService(MeterRegistry registry) {\n        this.orderCreatedCounter = Counter.builder("orders.created.total")\n            .description("Total orders created")\n            .tag("service", "order-service")\n            .register(registry);\n\n        this.orderProcessingTimer = Timer.builder("orders.processing.duration")\n            .description("Order processing time")\n            .publishPercentiles(0.5, 0.95, 0.99)\n            .register(registry);\n\n        this.orderAmountSummary = DistributionSummary.builder("orders.amount")\n            .description("Order amounts")\n            .baseUnit("dollars")\n            .publishPercentiles(0.5, 0.95)\n            .register(registry);\n\n        this.activeOrders = registry.gauge("orders.active",\n            new AtomicInteger(0));\n    }\n\n    public Order createOrder(CreateOrderRequest request) {\n        return orderProcessingTimer.record(() -> {\n            activeOrders.incrementAndGet();\n            try {\n                Order order = processOrder(request);\n                orderCreatedCounter.increment();\n                orderAmountSummary.record(order.getTotalAmount().doubleValue());\n                return order;\n            } finally {\n                activeOrders.decrementAndGet();\n            }\n        });\n    }\n}' },
        { type: 'code', language: 'yaml', value: '# application.yml\nmanagement:\n  endpoints:\n    web:\n      exposure:\n        include: health,info,prometheus\n  metrics:\n    tags:\n      application: order-service\n      environment: production\n\n# GET /actuator/prometheus возвращает:\n# orders_created_total{service="order-service"} 1523\n# orders_processing_duration_seconds_bucket{le="0.1"} 1200\n# orders_processing_duration_seconds_bucket{le="0.5"} 1450\n# orders_processing_duration_seconds_bucket{le="1.0"} 1520\n# orders_amount_sum 2284500.0\n# orders_active 5\n# jvm_memory_used_bytes{area="heap"} 268435456\n# http_server_requests_seconds_count{method="POST",uri="/api/v1/orders",status="201"} 1523' },
        { type: 'note', value: 'Spring Boot Actuator автоматически экспортирует: JVM метрики (memory, GC, threads), HTTP метрики (requests count, duration), connection pool, Kafka consumer lag, Resilience4j circuit breaker state.' }
      ]
    },
    {
      id: 3,
      title: 'Prometheus конфигурация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Prometheus периодически scrape-ит метрики с endpoint-ов сервисов. В Kubernetes — автоматическое обнаружение через annotations или ServiceMonitor (Prometheus Operator).' },
        { type: 'code', language: 'yaml', value: '# prometheus.yml — конфигурация\nglobal:\n  scrape_interval: 15s\n  evaluation_interval: 15s\n\nrule_files:\n  - "alert_rules.yml"\n\nalerting:\n  alertmanagers:\n    - static_configs:\n        - targets: ["alertmanager:9093"]\n\nscrape_configs:\n  # Spring Boot сервисы\n  - job_name: "microservices"\n    metrics_path: /actuator/prometheus\n    scrape_interval: 10s\n    static_configs:\n      - targets:\n          - "order-service:8080"\n          - "user-service:8081"\n          - "payment-service:8082"\n\n  # Kubernetes service discovery\n  - job_name: "kubernetes-pods"\n    kubernetes_sd_configs:\n      - role: pod\n    relabel_configs:\n      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]\n        action: keep\n        regex: true\n      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]\n        action: replace\n        target_label: __metrics_path__\n        regex: (.+)\n      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_port]\n        action: replace\n        target_label: __address__\n        regex: (.+)' },
        { type: 'code', language: 'yaml', value: '# Kubernetes Pod annotations для auto-discovery\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: order-service\nspec:\n  template:\n    metadata:\n      annotations:\n        prometheus.io/scrape: "true"\n        prometheus.io/path: "/actuator/prometheus"\n        prometheus.io/port: "8080"' },
        { type: 'tip', value: 'Prometheus Operator + ServiceMonitor — рекомендуемый подход в Kubernetes. ServiceMonitor CRD позволяет объявить какие сервисы мониторить декларативно, без изменения prometheus.yml.' }
      ]
    },
    {
      id: 4,
      title: 'Grafana дашборды',
      type: 'theory',
      content: [
        { type: 'text', value: 'Grafana — платформа визуализации метрик. Поддерживает Prometheus, Elasticsearch, CloudWatch и десятки других источников. Dashboards, alerts, annotations.' },
        { type: 'code', language: 'bash', value: '# PromQL запросы для Grafana дашборда:\n\n# Requests per second (по сервисам):\nrate(http_server_requests_seconds_count[5m])\n\n# Error rate (%):\nrate(http_server_requests_seconds_count{status=~"5.."}[5m])\n/ rate(http_server_requests_seconds_count[5m]) * 100\n\n# P99 latency:\nhistogram_quantile(0.99,\n  rate(http_server_requests_seconds_bucket[5m]))\n\n# Active orders:\norders_active\n\n# Orders per minute:\nrate(orders_created_total[1m]) * 60\n\n# JVM Memory used:\njvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"} * 100\n\n# CPU Usage:\nrate(process_cpu_seconds_total[5m]) * 100\n\n# Kafka consumer lag:\nkafka_consumer_lag{group="payment-service"}' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml — Prometheus + Grafana\nservices:\n  prometheus:\n    image: prom/prometheus:v2.48.0\n    ports:\n      - "9090:9090"\n    volumes:\n      - ./prometheus.yml:/etc/prometheus/prometheus.yml\n      - ./alert_rules.yml:/etc/prometheus/alert_rules.yml\n\n  grafana:\n    image: grafana/grafana:10.2.0\n    ports:\n      - "3000:3000"\n    environment:\n      GF_SECURITY_ADMIN_PASSWORD: admin\n    volumes:\n      - grafana-data:/var/lib/grafana\n\n  alertmanager:\n    image: prom/alertmanager:v0.26.0\n    ports:\n      - "9093:9093"\n    volumes:\n      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml' },
        { type: 'note', value: 'Grafana Labs предоставляет готовые дашборды на grafana.com/dashboards. ID 4701 — JVM Micrometer, ID 11378 — Spring Boot. Импортируйте их и кастомизируйте под свои нужды.' }
      ]
    },
    {
      id: 5,
      title: 'Alerting и SLO',
      type: 'theory',
      content: [
        { type: 'text', value: 'SLI (Service Level Indicator) — метрика качества (latency p99). SLO (Service Level Objective) — целевое значение (p99 < 500ms). SLA (Service Level Agreement) — контракт с клиентом. Alerts срабатывают при нарушении SLO.' },
        { type: 'code', language: 'yaml', value: '# alert_rules.yml — правила алертинга\ngroups:\n  - name: microservices\n    rules:\n      # Высокий error rate\n      - alert: HighErrorRate\n        expr: |\n          rate(http_server_requests_seconds_count{status=~\"5..\"}[5m])\n          / rate(http_server_requests_seconds_count[5m]) > 0.05\n        for: 5m\n        labels:\n          severity: critical\n        annotations:\n          summary: \"High error rate (>5%) in {{ $labels.application }}\"\n          description: \"Error rate is {{ $value | humanizePercentage }}\"\n\n      # Высокая латентность (SLO violation)\n      - alert: HighLatency\n        expr: |\n          histogram_quantile(0.99,\n            rate(http_server_requests_seconds_bucket[5m])) > 0.5\n        for: 5m\n        labels:\n          severity: warning\n        annotations:\n          summary: \"P99 latency > 500ms in {{ $labels.application }}\"\n\n      # Circuit Breaker открыт\n      - alert: CircuitBreakerOpen\n        expr: resilience4j_circuitbreaker_state == 1\n        for: 1m\n        labels:\n          severity: critical\n        annotations:\n          summary: \"Circuit Breaker OPEN: {{ $labels.name }}\"\n\n      # JVM Heap usage > 85%\n      - alert: HighMemoryUsage\n        expr: |\n          jvm_memory_used_bytes{area=\"heap\"}\n          / jvm_memory_max_bytes{area=\"heap\"} > 0.85\n        for: 5m\n        labels:\n          severity: warning' },
        { type: 'code', language: 'yaml', value: '# alertmanager.yml — маршрутизация алертов\nroute:\n  receiver: slack-default\n  group_by: [alertname, application]\n  group_wait: 30s\n  group_interval: 5m\n  repeat_interval: 4h\n  routes:\n    - match:\n        severity: critical\n      receiver: pagerduty-critical\n    - match:\n        severity: warning\n      receiver: slack-warnings\n\nreceivers:\n  - name: slack-default\n    slack_configs:\n      - api_url: https://hooks.slack.com/services/xxx\n        channel: "#alerts"\n        title: "{{ .GroupLabels.alertname }}"\n        text: "{{ range .Alerts }}{{ .Annotations.summary }}\\n{{ end }}"\n\n  - name: pagerduty-critical\n    pagerduty_configs:\n      - service_key: xxx' },
        { type: 'tip', value: 'Определите SLO для каждого сервиса: Order Service — 99.9% availability, p99 < 500ms, error rate < 1%. Мониторьте error budget: сколько "допустимых" ошибок осталось до конца месяца.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Мониторинг',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте полный стек мониторинга: Prometheus + Grafana + Alertmanager для микросервисов.',
      requirements: [
        'Настройте Prometheus для scraping метрик из 3 сервисов',
        'Добавьте кастомные бизнес-метрики: orders.created, orders.amount',
        'Создайте Grafana дашборд: RPS, Error Rate, P99 Latency, JVM Heap',
        'Настройте SLO alert: error rate > 5% за 5 минут -> critical',
        'Настройте Alertmanager: critical -> PagerDuty, warning -> Slack',
        'Добавьте RED метрики для каждого сервиса'
      ],
      hint: 'Используйте micrometer-registry-prometheus. Grafana Data Source = Prometheus. PromQL для RPS: rate(http_server_requests_seconds_count[5m]). Alert rules в prometheus rules файле.',
      expectedOutput: 'Prometheus :9090 scraping 3 сервисов каждые 15 секунд.\nGrafana :3000 дашборд "Microservices Overview":\n  - RPS: order-service 150 req/s, payment 50 req/s\n  - Error Rate: 0.5% (в пределах SLO < 5%)\n  - P99 Latency: 320ms (в пределах SLO < 500ms)\n  - JVM Heap: 65% (warning при > 85%)\nCustom metrics: orders_created_total=1523, orders_amount_sum=2.2M.\nAlert test: error rate 6% -> Alertmanager -> Slack notification.',
      solution: '# prometheus.yml\nglobal:\n  scrape_interval: 15s\nscrape_configs:\n  - job_name: microservices\n    metrics_path: /actuator/prometheus\n    static_configs:\n      - targets: [order-service:8080, user-service:8081, payment-service:8082]\n\n# Java кастомные метрики\n@Service\npublic class OrderService {\n    private final Counter ordersCounter;\n    public OrderService(MeterRegistry registry) {\n        this.ordersCounter = Counter.builder("orders.created.total")\n            .register(registry);\n    }\n    public Order create(CreateOrderRequest req) {\n        Order order = process(req);\n        ordersCounter.increment();\n        return order;\n    }\n}\n\n# Grafana: Import dashboard, Data Source = Prometheus\n# PromQL: rate(http_server_requests_seconds_count[5m])',
      explanation: 'Мониторинг с Prometheus и Grafana обеспечивает видимость здоровья микросервисов. RED метрики для каждого сервиса, бизнес-метрики для продукта, JVM метрики для инфраструктуры. Alerting через Prometheus rules + Alertmanager уведомляет при нарушении SLO. Это основа SRE-практик.'
    }
  ]
}
