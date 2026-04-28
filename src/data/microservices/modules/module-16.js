export default {
  id: 16,
  title: 'Distributed Tracing',
  description: 'Отслеживание запросов через цепочку микросервисов: OpenTelemetry, Jaeger, Zipkin, correlation ID, spans и traces.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужен Distributed Tracing',
      type: 'theory',
      content: [
        { type: 'text', value: 'В микросервисах один запрос пользователя проходит через 5-10 сервисов. При ошибке или задержке нужно понять: в каком сервисе проблема? Distributed Tracing создаёт полную картину прохождения запроса.' },
        { type: 'code', language: 'bash', value: '# Запрос: POST /api/orders\n# Проходит через:\n# API Gateway -> Order Service -> User Service (проверка)\n#                              -> Inventory Service (резерв)\n#                              -> Payment Service (оплата)\n#                                    -> Fraud Detection (проверка)\n#                              -> Notification Service (email)\n\n# Без tracing: "Запрос занял 3 секунды. Где задержка?"\n# С tracing:\n# Trace ID: abc-123\n# ├── API Gateway          [0ms  - 3000ms] (total: 3000ms)\n# │   ├── Order Service    [10ms - 2990ms] (total: 2980ms)\n# │   │   ├── User Service [20ms - 50ms]   (30ms) ✓\n# │   │   ├── Inventory    [55ms - 100ms]  (45ms) ✓\n# │   │   ├── Payment      [105ms - 2800ms] (2695ms) ← BOTTLENECK!\n# │   │   │   └── Fraud    [110ms - 2790ms] (2680ms) ← ROOT CAUSE!\n# │   │   └── Notification [2805ms - 2980ms] (175ms) ✓\n\n# Термины:\n# Trace  — полный путь запроса через все сервисы\n# Span   — операция в одном сервисе\n# TraceId — уникальный ID всего trace\n# SpanId  — уникальный ID операции\n# ParentSpanId — ID родительского span' },
        { type: 'tip', value: 'Distributed Tracing отвечает на вопросы: Какие сервисы участвуют? Сколько времени занимает каждый? Где bottleneck? Какой сервис вызвал ошибку? Без него отладка микросервисов — это гадание.' }
      ]
    },
    {
      id: 2,
      title: 'OpenTelemetry',
      type: 'theory',
      content: [
        { type: 'text', value: 'OpenTelemetry (OTel) — единый стандарт для traces, metrics и logs. Vendor-neutral: данные можно отправлять в Jaeger, Zipkin, Datadog, New Relic. Spring Boot 3 интегрирован с Micrometer Tracing + OTel.' },
        { type: 'code', language: 'java', value: '// Spring Boot 3 + Micrometer Tracing + OpenTelemetry\n// build.gradle:\n// implementation "io.micrometer:micrometer-tracing-bridge-otel"\n// implementation "io.opentelemetry:opentelemetry-exporter-otlp"\n// implementation "io.micrometer:micrometer-observation"\n\n// Автоматическая инструментация:\n// Spring MVC контроллеры — span для каждого запроса\n// RestClient/WebClient — span для каждого исходящего вызова\n// JDBC — span для каждого SQL запроса\n// Kafka — span для produce и consume\n\n// Кастомный span\n@Service\npublic class OrderService {\n    private final ObservationRegistry observationRegistry;\n\n    public Order createOrder(CreateOrderRequest request) {\n        return Observation.createNotStarted("order.create", observationRegistry)\n            .lowCardinalityKeyValue("order.type", request.type())\n            .observe(() -> {\n                // Этот код будет внутри span "order.create"\n                Order order = new Order(request);\n                validateOrder(order);  // sub-span\n                processPayment(order); // sub-span\n                return orderRepository.save(order);\n            });\n    }\n\n    // Метод с автоматическим span через @Observed\n    @Observed(name = "order.validate\",\n              contextualName = \"validate-order\",\n              lowCardinalityKeyValues = {\"order.validation\", \"true\"})\n    private void validateOrder(Order order) {\n        // Автоматически создаётся span\n    }\n}' },
        { type: 'code', language: 'yaml', value: '# application.yml — OpenTelemetry конфигурация\nmanagement:\n  tracing:\n    sampling:\n      probability: 1.0  # 100% запросов (для dev). В prod: 0.1 (10%)\n  otlp:\n    tracing:\n      endpoint: http://otel-collector:4318/v1/traces\n\n# Логи с Trace ID\nlogging:\n  pattern:\n    level: "%5p [${spring.application.name:},%X{traceId:-},%X{spanId:-}]"\n\n# Пример лога:\n# INFO [order-service,abc123def456,span789] Creating order for user-42' },
        { type: 'note', value: 'Sampling rate в production — обычно 1-10%. При 100% запросов tracing генерирует огромный объём данных. Tail-based sampling (в OTel Collector) — умный подход: сохраняет все trace с ошибками и медленные, семплирует успешные.' }
      ]
    },
    {
      id: 3,
      title: 'Jaeger',
      type: 'theory',
      content: [
        { type: 'text', value: 'Jaeger — open-source система для distributed tracing от Uber. Позволяет визуализировать traces, искать по сервису/операции/времени, сравнивать traces.' },
        { type: 'code', language: 'yaml', value: '# Docker Compose — Jaeger + OpenTelemetry Collector\nservices:\n  # OpenTelemetry Collector — принимает данные и пересылает\n  otel-collector:\n    image: otel/opentelemetry-collector-contrib:0.91.0\n    ports:\n      - "4317:4317"   # gRPC receiver\n      - "4318:4318"   # HTTP receiver\n    volumes:\n      - ./otel-config.yaml:/etc/otel/config.yaml\n    command: [\"--config=/etc/otel/config.yaml\"]\n\n  # Jaeger — хранение и визуализация traces\n  jaeger:\n    image: jaegertracing/all-in-one:1.53\n    ports:\n      - "16686:16686"  # Jaeger UI\n      - "14250:14250"  # gRPC (от collector)\n    environment:\n      COLLECTOR_OTLP_ENABLED: \"true\"' },
        { type: 'code', language: 'yaml', value: '# otel-config.yaml — OpenTelemetry Collector конфигурация\nreceivers:\n  otlp:\n    protocols:\n      grpc:\n        endpoint: 0.0.0.0:4317\n      http:\n        endpoint: 0.0.0.0:4318\n\nprocessors:\n  batch:\n    timeout: 1s\n    send_batch_size: 1024\n  # Tail-based sampling\n  tail_sampling:\n    policies:\n      - name: errors\n        type: status_code\n        status_code: {status_codes: [ERROR]}  # Все ошибки\n      - name: slow-traces\n        type: latency\n        latency: {threshold_ms: 1000}  # Медленнее 1 сек\n      - name: probabilistic\n        type: probabilistic\n        probabilistic: {sampling_percentage: 10}  # 10% остальных\n\nexporters:\n  otlp:\n    endpoint: jaeger:4317\n    tls:\n      insecure: true\n\nservice:\n  pipelines:\n    traces:\n      receivers: [otlp]\n      processors: [tail_sampling, batch]\n      exporters: [otlp]' },
        { type: 'tip', value: 'OpenTelemetry Collector — рекомендуемый подход. Приложения отправляют данные в Collector, а Collector маршрутизирует в Jaeger/Zipkin/Datadog. При смене backend-а меняется только конфигурация Collector, не код приложений.' }
      ]
    },
    {
      id: 4,
      title: 'Propagation контекста',
      type: 'theory',
      content: [
        { type: 'text', value: 'Trace context (TraceId, SpanId) должен передаваться между сервисами. В HTTP — через заголовки (W3C Trace Context). В Kafka — через record headers. Spring Boot делает это автоматически.' },
        { type: 'code', language: 'java', value: '// W3C Trace Context — стандартные заголовки\n// traceparent: 00-abc123def456-span789-01\n//              version-traceId-parentSpanId-flags\n\n// Spring Boot автоматически:\n// 1. RestClient/WebClient: добавляет traceparent header\n// 2. KafkaTemplate: добавляет traceparent в record headers\n// 3. Kafka Consumer: извлекает traceparent из headers\n\n// Ручное управление контекстом\n@Service\npublic class CustomPropagation {\n    private final Tracer tracer;\n\n    // Создание child span\n    public void processWithTracing() {\n        Span span = tracer.nextSpan().name("custom-operation\").start();\n        try (Tracer.SpanInScope ws = tracer.withSpan(span)) {\n            // Весь код здесь — в контексте span\n            log.info(\"Processing...\"); // Лог будет содержать traceId\n            callExternalService();      // traceparent передастся автоматически\n        } catch (Exception e) {\n            span.error(e);\n            throw e;\n        } finally {\n            span.end();\n        }\n    }\n\n    // Добавление тегов и событий\n    public void enrichedSpan(Order order) {\n        Span currentSpan = tracer.currentSpan();\n        if (currentSpan != null) {\n            currentSpan.tag(\"order.id\", order.getId().toString());\n            currentSpan.tag(\"order.amount\", order.getTotalAmount().toString());\n            currentSpan.event(\"order.validated\");\n        }\n    }\n}\n\n// Для async/Kafka: контекст передаётся автоматически\n// с spring-kafka + micrometer-tracing\n@KafkaListener(topics = \"order-events\")\npublic void handle(OrderCreatedEvent event) {\n    // TraceId из producer автоматически восстановлен!\n    log.info(\"Processing event\"); // [order-service,abc123,newSpan456]\n}' },
        { type: 'warning', value: 'Для корректной работы tracing во всех сервисах должны быть одинаковые зависимости (micrometer-tracing + otel bridge). Если один сервис не прокидывает traceparent — trace обрывается на этом сервисе.' }
      ]
    },
    {
      id: 5,
      title: 'Correlation ID и Baggage',
      type: 'theory',
      content: [
        { type: 'text', value: 'Correlation ID — бизнесовый идентификатор запроса (orderId, requestId). Baggage — пользовательские данные, передаваемые через весь trace (userId, tenantId). В отличие от tags, baggage propagates между сервисами.' },
        { type: 'code', language: 'java', value: '// Correlation ID — фильтр для генерации и прокидывания\n@Component\n@Order(Ordered.HIGHEST_PRECEDENCE)\npublic class CorrelationIdFilter extends OncePerRequestFilter {\n\n    @Override\n    protected void doFilterInternal(HttpServletRequest request,\n            HttpServletResponse response, FilterChain chain)\n            throws ServletException, IOException {\n\n        String correlationId = request.getHeader("X-Correlation-ID\");\n        if (correlationId == null) {\n            correlationId = UUID.randomUUID().toString();\n        }\n\n        // Добавляем в MDC (для логов)\n        MDC.put(\"correlationId\", correlationId);\n        // Добавляем в response header\n        response.setHeader(\"X-Correlation-ID\", correlationId);\n\n        try {\n            chain.doFilter(request, response);\n        } finally {\n            MDC.remove(\"correlationId\");\n        }\n    }\n}\n\n// Baggage — передача кастомных данных через trace\n@Service\npublic class OrderService {\n    private final Tracer tracer;\n    private final BaggageField userIdBaggage =\n        BaggageField.create(\"user-id\");\n\n    public Order createOrder(CreateOrderRequest request, String userId) {\n        // Устанавливаем baggage\n        userIdBaggage.updateValue(tracer.currentTraceContext().context(), userId);\n\n        // userId будет доступен во ВСЕХ downstream сервисах!\n        // Payment Service, Notification Service — все увидят user-id\n        return processOrder(request);\n    }\n}' },
        { type: 'code', language: 'yaml', value: '# application.yml — propagation baggage\nmanagement:\n  tracing:\n    baggage:\n      remote-fields:\n        - user-id\n        - tenant-id\n        - X-Correlation-ID\n      correlation:\n        fields:\n          - user-id\n          - tenant-id' },
        { type: 'note', value: 'Baggage добавляет overhead — данные передаются в каждом запросе. Используйте только для действительно необходимых данных (userId, tenantId). Большие объёмы данных передавайте через API вызовы, не через baggage.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Distributed Tracing',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте OpenTelemetry + Jaeger для трейсинга запросов через 3 микросервиса.',
      requirements: [
        'Настройте OpenTelemetry Collector и Jaeger через Docker Compose',
        'Добавьте micrometer-tracing в Order, User, Payment сервисы',
        'Проверьте автоматическое создание spans для REST вызовов',
        'Добавьте кастомный span для бизнес-операции "validate order"',
        'Настройте Correlation ID propagation через все сервисы',
        'Найдите bottleneck через Jaeger UI'
      ],
      hint: 'Используйте micrometer-tracing-bridge-otel + opentelemetry-exporter-otlp. Jaeger UI на порту 16686. Для кастомного span используйте Observation API или Tracer.nextSpan().',
      expectedOutput: 'POST /api/orders -> trace abc123:\n  Span: API Gateway (3ms)\n    Span: Order Service (250ms)\n      Span: User Service GET /users/42 (30ms)\n      Span: validate-order (5ms)\n      Span: Payment Service POST /payments (200ms)\n      Span: Kafka produce order-events (10ms)\n\nJaeger UI: trace abc123 показывает полную цепочку.\nCorrelation ID: X-Correlation-ID=req-456 виден во всех логах.\nBottleneck: Payment Service 200ms (80% от общего времени).',
      solution: '# docker-compose.yml\nservices:\n  otel-collector:\n    image: otel/opentelemetry-collector-contrib:0.91.0\n    ports: ["4318:4318"]\n    volumes: [./otel-config.yaml:/etc/otel/config.yaml]\n    command: [--config=/etc/otel/config.yaml]\n  jaeger:\n    image: jaegertracing/all-in-one:1.53\n    ports: ["16686:16686"]\n\n# application.yml (для каждого сервиса)\nmanagement:\n  tracing:\n    sampling:\n      probability: 1.0\n  otlp:\n    tracing:\n      endpoint: http://otel-collector:4318/v1/traces\nlogging:\n  pattern:\n    level: "%5p [${spring.application.name},%X{traceId},%X{spanId}]"\n\n// Кастомный span\n@Observed(name = "order.validate")\npublic void validateOrder(Order order) {\n    // Автоматический span\n}',
      explanation: 'Distributed Tracing через OpenTelemetry + Jaeger даёт полную видимость запросов через все сервисы. Автоматическая инструментация Spring Boot покрывает REST, JDBC, Kafka. Кастомные spans добавляют бизнес-контекст. Correlation ID связывает логи со traces для эффективной отладки.'
    }
  ]
}
