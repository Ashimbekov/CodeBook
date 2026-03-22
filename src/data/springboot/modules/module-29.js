export default {
  id: 29,
  title: 'Spring Boot Actuator',
  description: 'Мониторинг и управление приложением через Actuator: health checks, метрики с Micrometer, кастомные индикаторы здоровья, интеграция с Prometheus и Grafana',
  lessons: [
    {
      id: 1,
      title: 'Подключение и базовая конфигурация Actuator',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Boot Actuator предоставляет production-ready endpoints для мониторинга и управления приложением: состояние здоровья, метрики, информация о среде, управление кешем и другое.' },
        { type: 'heading', value: 'Зависимость и конфигурация' },
        { type: 'code', language: 'xml', value: '<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-actuator</artifactId>\n</dependency>' },
        { type: 'code', language: 'java', value: '# application.properties\n# Открыть все endpoints (осторожно в продакшене!)\nmanagement.endpoints.web.exposure.include=*\n\n# Рекомендуется в продакшене — только нужные\nmanagement.endpoints.web.exposure.include=health,info,metrics,prometheus\n\n# Изменить базовый путь (по умолчанию /actuator)\nmanagement.endpoints.web.base-path=/actuator\n\n# Запустить на отдельном порту (не доступен пользователям)\nmanagement.server.port=8081' },
        { type: 'heading', value: 'Основные endpoints' },
        { type: 'code', language: 'java', value: '# GET /actuator/health — состояние приложения\n# GET /actuator/info — информация о приложении\n# GET /actuator/metrics — доступные метрики\n# GET /actuator/metrics/jvm.memory.used — конкретная метрика\n# GET /actuator/env — переменные окружения\n# POST /actuator/refresh — обновить конфиг (@RefreshScope)\n# GET /actuator/loggers — уровни логирования\n# POST /actuator/loggers/com.example — изменить уровень лога\n# GET /actuator/threaddump — дамп потоков\n# GET /actuator/heapdump — дамп памяти' }
      ]
    },
    {
      id: 2,
      title: 'Health Checks',
      type: 'theory',
      content: [
        { type: 'text', value: '/actuator/health показывает состояние всех компонентов: база данных, Redis, дисковое пространство. Kubernetes использует этот endpoint для liveness и readiness проб.' },
        { type: 'heading', value: 'Детальный health response' },
        { type: 'code', language: 'java', value: '# Включить детали (по умолчанию скрыты)\nmanagement.endpoint.health.show-details=always\n# Или только для авторизованных\nmanagement.endpoint.health.show-details=when-authorized\n\n# Ответ:\n{\n  "status": "UP",\n  "components": {\n    "db": {\n      "status": "UP",\n      "details": { "database": "PostgreSQL", "validationQuery": "isValid()" }\n    },\n    "redis": { "status": "UP" },\n    "diskSpace": {\n      "status": "UP",\n      "details": { "total": 250685575168, "free": 100000000000, "threshold": 10485760 }\n    }\n  }\n}' },
        { type: 'heading', value: 'Kubernetes Probes' },
        { type: 'code', language: 'java', value: '# application.properties\nmanagement.endpoint.health.probes.enabled=true\n\n# /actuator/health/liveness — приложение живо (перезапустить если DOWN)\n# /actuator/health/readiness — готово принимать трафик\n\n# kubernetes deployment.yaml\n# livenessProbe:\n#   httpGet:\n#     path: /actuator/health/liveness\n#     port: 8080\n#   initialDelaySeconds: 30\n#   periodSeconds: 10\n# readinessProbe:\n#   httpGet:\n#     path: /actuator/health/readiness\n#     port: 8080' }
      ]
    },
    {
      id: 3,
      title: 'Кастомные Health Indicators',
      type: 'theory',
      content: [
        { type: 'text', value: 'Можно создать собственный индикатор здоровья — например, проверить внешний API или бизнес-условие. Реализуй интерфейс HealthIndicator.' },
        { type: 'heading', value: 'Кастомный HealthIndicator' },
        { type: 'code', language: 'java', value: 'import org.springframework.boot.actuate.health.Health;\nimport org.springframework.boot.actuate.health.HealthIndicator;\n\n@Component("paymentSystem")\npublic class PaymentSystemHealthIndicator implements HealthIndicator {\n\n    @Autowired\n    private PaymentGatewayClient paymentClient;\n\n    @Override\n    public Health health() {\n        try {\n            boolean isAvailable = paymentClient.ping();\n            if (isAvailable) {\n                return Health.up()\n                    .withDetail("provider", "KaspiPay")\n                    .withDetail("latency", "12ms")\n                    .build();\n            } else {\n                return Health.down()\n                    .withDetail("provider", "KaspiPay")\n                    .withDetail("reason", "Платёжная система недоступна")\n                    .build();\n            }\n        } catch (Exception e) {\n            return Health.down(e)\n                .withDetail("error", e.getMessage())\n                .build();\n        }\n    }\n}' },
        { type: 'heading', value: 'ReactiveHealthIndicator для WebFlux' },
        { type: 'code', language: 'java', value: '@Component\npublic class ReactiveExternalServiceHealth implements ReactiveHealthIndicator {\n\n    @Override\n    public Mono<Health> health() {\n        return webClient.get().uri("/health")\n            .retrieve()\n            .toBodilessEntity()\n            .map(r -> Health.up().build())\n            .onErrorReturn(Health.down().build());\n    }\n}' }
      ]
    },
    {
      id: 4,
      title: 'Метрики с Micrometer',
      type: 'theory',
      content: [
        { type: 'text', value: 'Micrometer — facade для метрик (как SLF4J для логов). Пишешь один код, метрики экспортируются в Prometheus, Datadog, InfluxDB и другие системы.' },
        { type: 'heading', value: 'Кастомные метрики' },
        { type: 'code', language: 'java', value: '@Service\npublic class OrderService {\n\n    private final MeterRegistry meterRegistry;\n    private final Counter orderCounter;\n    private final Timer orderProcessingTimer;\n\n    public OrderService(MeterRegistry meterRegistry) {\n        this.meterRegistry = meterRegistry;\n        this.orderCounter = Counter.builder("orders.created")\n            .description("Количество созданных заказов")\n            .tag("service", "order-service")\n            .register(meterRegistry);\n        this.orderProcessingTimer = Timer.builder("order.processing.time")\n            .description("Время обработки заказа")\n            .register(meterRegistry);\n    }\n\n    public Order createOrder(OrderRequest request) {\n        return orderProcessingTimer.recordCallable(() -> {\n            Order order = processOrder(request);\n            orderCounter.increment();\n            meterRegistry.gauge("orders.active", activeOrderService.count());\n            return order;\n        });\n    }\n}' }
      ]
    },
    {
      id: 5,
      title: 'Prometheus и Grafana',
      type: 'theory',
      content: [
        { type: 'text', value: 'Prometheus собирает метрики с приложений по расписанию (scraping). Grafana визуализирует метрики из Prometheus в дашбордах. Связка Prometheus+Grafana — стандарт мониторинга.' },
        { type: 'heading', value: 'Подключение Prometheus' },
        { type: 'code', language: 'xml', value: '<dependency>\n    <groupId>io.micrometer</groupId>\n    <artifactId>micrometer-registry-prometheus</artifactId>\n</dependency>' },
        { type: 'code', language: 'java', value: '# application.properties\nmanagement.endpoints.web.exposure.include=health,prometheus\nmanagement.endpoint.prometheus.enabled=true\n\n# prometheus.yml (конфиг Prometheus)\nscrape_configs:\n  - job_name: "spring-app"\n    metrics_path: "/actuator/prometheus"\n    scrape_interval: 15s\n    static_configs:\n      - targets: ["app:8080"]' },
        { type: 'heading', value: 'Полезные PromQL запросы' },
        { type: 'code', language: 'java', value: '# HTTP запросы в секунду\nrate(http_server_requests_seconds_count[1m])\n\n# 99-й перцентиль времени ответа\nhistogram_quantile(0.99, rate(http_server_requests_seconds_bucket[5m]))\n\n# Количество ошибок 5xx\nrate(http_server_requests_seconds_count{status=~"5.."}[1m])\n\n# Использование памяти JVM\njvm_memory_used_bytes{area="heap"}' }
      ]
    },
    {
      id: 6,
      title: 'Практика: полный мониторинг приложения',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте полный мониторинг Spring Boot приложения: health checks с кастомным индикатором, метрики Prometheus, кастомный счётчик заказов, Grafana дашборд.',
      requirements: [
        'Подключи Spring Boot Actuator и Micrometer Prometheus',
        'Открой endpoints: health, info, metrics, prometheus',
        'Создай ExternalApiHealthIndicator для проверки внешнего API',
        'Добавь кастомный Counter для подсчёта успешных и неуспешных заказов',
        'Добавь Timer для измерения времени выполнения OrderService.create()',
        'Настрой Prometheus для scraping каждые 15 секунд',
        'Создай docker-compose.yml с app, prometheus, grafana'
      ],
      hint: 'Timer.record(Supplier<T>) удобен для измерения времени метода. Tags позволяют группировать метрики: tag("status", "success") и tag("status", "error").',
      solution: '// pom.xml dependencies: actuator, micrometer-registry-prometheus\n\n// application.properties\nmanagement.endpoints.web.exposure.include=health,info,metrics,prometheus\nmanagement.endpoint.health.show-details=always\n\n// ExternalApiHealthIndicator\n@Component("externalApi")\npublic class ExternalApiHealthIndicator implements HealthIndicator {\n    @Autowired RestTemplate restTemplate;\n    public Health health() {\n        try {\n            restTemplate.getForObject("https://api.external.kz/health", String.class);\n            return Health.up().withDetail("api", "external.kz").build();\n        } catch (Exception e) {\n            return Health.down().withDetail("error", e.getMessage()).build();\n        }\n    }\n}\n\n// OrderService с метриками\n@Service\npublic class OrderService {\n    private final Counter successCounter;\n    private final Counter errorCounter;\n    private final Timer timer;\n\n    public OrderService(MeterRegistry registry) {\n        this.successCounter = registry.counter("orders", "status", "success");\n        this.errorCounter = registry.counter("orders", "status", "error");\n        this.timer = Timer.builder("order.processing").register(registry);\n    }\n\n    public Order create(OrderRequest req) {\n        return timer.recordCallable(() -> {\n            try {\n                Order o = repo.save(new Order(req));\n                successCounter.increment();\n                return o;\n            } catch (Exception e) {\n                errorCounter.increment(); throw e;\n            }\n        });\n    }\n}',
      explanation: 'MeterRegistry инжектируется в конструктор. Counter.increment() вызывается при каждом событии. Timer.recordCallable() автоматически измеряет время выполнения и записывает метрику.'
    }
  ]
}
