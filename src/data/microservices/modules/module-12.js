export default {
  id: 12,
  title: 'Circuit Breaker и Resilience',
  description: 'Паттерны устойчивости: Circuit Breaker, Retry, Timeout, Bulkhead, Rate Limiter. Resilience4j для Java. Предотвращение каскадных отказов.',
  lessons: [
    {
      id: 1,
      title: 'Каскадные отказы',
      type: 'theory',
      content: [
        { type: 'text', value: 'В микросервисах отказ одного сервиса может вызвать цепную реакцию. Если Payment Service не отвечает, Order Service накапливает зависшие потоки, исчерпывает connection pool и перестаёт обслуживать любые запросы.' },
        { type: 'code', language: 'bash', value: '# Каскадный отказ (cascading failure):\n# 1. Payment Service перегружен -> отвечает медленно (10 сек)\n# 2. Order Service ждёт ответа -> потоки блокированы\n# 3. 100 запросов к Order Service -> 100 потоков ждут Payment\n# 4. Thread pool Order Service исчерпан -> 503 на все запросы\n# 5. API Gateway получает 503 от Order Service\n# 6. Frontend показывает ошибку ВСЕМ пользователям\n# 7. Один медленный сервис -> вся система не работает!\n\n# Решение: Resilience Patterns\n# 1. Circuit Breaker — "выключатель" для упавших сервисов\n# 2. Timeout — ограничение времени ожидания\n# 3. Retry — повторные попытки с backoff\n# 4. Bulkhead — изоляция ресурсов (отдельные thread pools)\n# 5. Rate Limiter — ограничение скорости вызовов\n# 6. Fallback — запасной ответ при ошибке' },
        { type: 'warning', value: 'Без resilience паттернов микросервисная архитектура МЕНЕЕ устойчива чем монолит. В монолите вызов метода не может "зависнуть на 30 секунд". В микросервисах каждый сетевой вызов — потенциальная точка отказа.' }
      ]
    },
    {
      id: 2,
      title: 'Circuit Breaker паттерн',
      type: 'theory',
      content: [
        { type: 'text', value: 'Circuit Breaker работает как электрический автомат: при слишком многих ошибках "размыкает цепь" и перестаёт вызывать проблемный сервис. Три состояния: Closed (работает), Open (отключён), Half-Open (проверка).' },
        { type: 'code', language: 'java', value: '// Resilience4j Circuit Breaker\n\n// Конфигурация\n@Configuration\npublic class CircuitBreakerConfig {\n    @Bean\n    public CircuitBreaker paymentCircuitBreaker() {\n        CircuitBreakerConfig config = CircuitBreakerConfig.custom()\n            .failureRateThreshold(50)        // 50% ошибок -> OPEN\n            .slowCallRateThreshold(80)       // 80% медленных -> OPEN\n            .slowCallDurationThreshold(Duration.ofSeconds(3)) // > 3с = медленный\n            .waitDurationInOpenState(Duration.ofSeconds(30))  // 30с в OPEN\n            .permittedNumberOfCallsInHalfOpenState(5) // 5 тестовых вызовов\n            .slidingWindowType(SlidingWindowType.COUNT_BASED)\n            .slidingWindowSize(10)           // Окно: 10 последних вызовов\n            .minimumNumberOfCalls(5)         // Минимум вызовов для оценки\n            .build();\n        return CircuitBreaker.of("payment-service", config);\n    }\n}\n\n// Использование с аннотацией\n@Service\npublic class PaymentServiceClient {\n\n    @CircuitBreaker(name = "payment-service", fallbackMethod = "paymentFallback")\n    public PaymentResponse processPayment(UUID orderId, BigDecimal amount) {\n        return restClient.post()\n            .uri("/api/v1/payments")\n            .body(new PaymentRequest(orderId, amount))\n            .retrieve()\n            .body(PaymentResponse.class);\n    }\n\n    // Fallback — вызывается когда Circuit Breaker в состоянии OPEN\n    private PaymentResponse paymentFallback(UUID orderId, BigDecimal amount,\n                                             Throwable t) {\n        log.warn("Payment Service недоступен: {}", t.getMessage());\n        // Варианты fallback:\n        // 1. Вернуть кэшированный ответ\n        // 2. Поставить заказ в очередь на оплату\n        // 3. Вернуть "pending" статус\n        return new PaymentResponse(null, PaymentStatus.PENDING,\n            \"Оплата будет обработана позже\");\n    }\n}\n\n// Состояния Circuit Breaker:\n// CLOSED:    [вызов] -> успех/ошибка -> считает failure rate\n//            если failure rate >= 50% -> переход в OPEN\n// OPEN:      [вызов] -> сразу fallback (не вызывает сервис!)\n//            через 30 сек -> переход в HALF_OPEN\n// HALF_OPEN: [5 тестовых вызовов] -> если OK -> CLOSED\n//            если ошибки -> обратно в OPEN' },
        { type: 'tip', value: 'Circuit Breaker защищает и вызывающий сервис (не тратит ресурсы на зависший), и вызываемый сервис (даёт время восстановиться, не заваливая запросами).' }
      ]
    },
    {
      id: 3,
      title: 'Retry и Timeout',
      type: 'theory',
      content: [
        { type: 'text', value: 'Retry автоматически повторяет неудачные вызовы. Timeout ограничивает время ожидания ответа. Вместе они обеспечивают быстрое восстановление при временных сбоях.' },
        { type: 'code', language: 'java', value: '// Retry с exponential backoff\n@Service\npublic class UserServiceClient {\n\n    @Retry(name = "user-service\", fallbackMethod = \"getUserFallback\")\n    @TimeLimiter(name = \"user-service\")\n    @CircuitBreaker(name = \"user-service\")\n    public CompletableFuture<UserResponse> getUser(UUID userId) {\n        return CompletableFuture.supplyAsync(() ->\n            restClient.get()\n                .uri(\"/api/v1/users/{id}\", userId)\n                .retrieve()\n                .body(UserResponse.class)\n        );\n    }\n\n    private CompletableFuture<UserResponse> getUserFallback(\n            UUID userId, Throwable t) {\n        log.warn(\"User Service fallback для userId={}: {}\", userId, t.getMessage());\n        // Возвращаем кэшированные данные\n        return CompletableFuture.completedFuture(\n            userCache.getOrDefault(userId, UserResponse.unknown()));\n    }\n}' },
        { type: 'code', language: 'yaml', value: '# application.yml — конфигурация Resilience4j\nresilience4j:\n  retry:\n    instances:\n      user-service:\n        max-attempts: 3\n        wait-duration: 500ms\n        exponential-backoff-multiplier: 2  # 500ms, 1s, 2s\n        retry-exceptions:\n          - java.net.ConnectException\n          - java.net.SocketTimeoutException\n          - org.springframework.web.client.HttpServerErrorException\n        ignore-exceptions:\n          - org.springframework.web.client.HttpClientErrorException  # 4xx не ретраим!\n\n  timelimiter:\n    instances:\n      user-service:\n        timeout-duration: 3s  # Максимум 3 секунды на вызов\n        cancel-running-future: true\n\n  circuitbreaker:\n    instances:\n      user-service:\n        failure-rate-threshold: 50\n        slow-call-rate-threshold: 80\n        slow-call-duration-threshold: 2s\n        wait-duration-in-open-state: 30s\n        sliding-window-size: 10\n        minimum-number-of-calls: 5' },
        { type: 'warning', value: 'Порядок декораторов важен! Правильный: Retry -> CircuitBreaker -> TimeLimiter. Retry повторяет ВНУТРИ CircuitBreaker. Если наоборот — retry может обойти открытый Circuit Breaker.' }
      ]
    },
    {
      id: 4,
      title: 'Bulkhead паттерн',
      type: 'theory',
      content: [
        { type: 'text', value: 'Bulkhead (переборка корабля) — изоляция ресурсов. Каждый сервис получает свой пул потоков/соединений. Проблема с одним сервисом не исчерпывает ресурсы для других.' },
        { type: 'code', language: 'java', value: '// Bulkhead — изоляция потоков\n\n// Без Bulkhead:\n// Order Service имеет 200 потоков\n// Payment Service зависает -> 200 потоков ждут Payment\n// User Service, Product Service — нет свободных потоков!\n\n// С Bulkhead:\n// Payment calls:  max 50 потоков (остальные ждут)\n// User calls:     max 50 потоков\n// Product calls:  max 50 потоков\n// Свободные:      50 потоков для других задач\n\n@Service\npublic class PaymentServiceClient {\n\n    // Thread Pool Bulkhead — отдельный пул потоков\n    @Bulkhead(name = \"payment-service\", type = Bulkhead.Type.THREADPOOL)\n    @CircuitBreaker(name = \"payment-service\")\n    public CompletableFuture<PaymentResponse> processPayment(PaymentRequest request) {\n        return CompletableFuture.supplyAsync(() ->\n            restClient.post()\n                .uri(\"/api/v1/payments\")\n                .body(request)\n                .retrieve()\n                .body(PaymentResponse.class)\n        );\n    }\n}\n\n@Service\npublic class UserServiceClient {\n\n    // Semaphore Bulkhead — ограничение параллельных вызовов\n    @Bulkhead(name = \"user-service\", type = Bulkhead.Type.SEMAPHORE)\n    public UserResponse getUser(UUID userId) {\n        return restClient.get()\n            .uri(\"/api/v1/users/{id}\", userId)\n            .retrieve()\n            .body(UserResponse.class);\n    }\n}' },
        { type: 'code', language: 'yaml', value: '# Конфигурация Bulkhead\nresilience4j:\n  bulkhead:\n    instances:\n      user-service:\n        max-concurrent-calls: 50     # Макс параллельных вызовов\n        max-wait-duration: 500ms     # Макс ожидание в очереди\n\n  thread-pool-bulkhead:\n    instances:\n      payment-service:\n        max-thread-pool-size: 20     # Размер пула потоков\n        core-thread-pool-size: 10    # Базовый размер\n        queue-capacity: 50           # Размер очереди\n        keep-alive-duration: 30s' },
        { type: 'note', value: 'Semaphore Bulkhead: ограничивает количество одновременных вызовов, не создаёт отдельные потоки. Thread Pool Bulkhead: создаёт изолированный пул потоков. Semaphore проще и эффективнее для большинства случаев.' }
      ]
    },
    {
      id: 5,
      title: 'Мониторинг Resilience4j',
      type: 'theory',
      content: [
        { type: 'text', value: 'Resilience4j экспортирует метрики в Prometheus/Micrometer: состояние Circuit Breaker, количество retry, процент ошибок. Мониторинг позволяет оперативно реагировать на проблемы.' },
        { type: 'code', language: 'java', value: '// Метрики Resilience4j -> Prometheus через Micrometer\n\n// build.gradle:\n// implementation "io.github.resilience4j:resilience4j-micrometer"\n// implementation "io.micrometer:micrometer-registry-prometheus"\n\n// Автоматические метрики:\n// resilience4j_circuitbreaker_state{name="payment-service"} 0=CLOSED, 1=OPEN\n// resilience4j_circuitbreaker_failure_rate{name="payment-service"} 25.0\n// resilience4j_circuitbreaker_calls_seconds_count{kind="successful"} 150\n// resilience4j_circuitbreaker_calls_seconds_count{kind="failed"} 12\n// resilience4j_retry_calls_total{name="user-service", kind="successful_with_retry"} 30\n// resilience4j_bulkhead_available_concurrent_calls{name="user-service"} 45\n\n// Подписка на события\n@Component\npublic class CircuitBreakerEventLogger {\n\n    @PostConstruct\n    public void init() {\n        CircuitBreaker cb = circuitBreakerRegistry.circuitBreaker(\"payment-service\");\n\n        cb.getEventPublisher()\n            .onStateTransition(event -> {\n                log.warn(\"Circuit Breaker [{}]: {} -> {}\",\n                    event.getCircuitBreakerName(),\n                    event.getStateTransition().getFromState(),\n                    event.getStateTransition().getToState());\n\n                // Отправить alert в Slack/PagerDuty\n                if (event.getStateTransition().getToState() == State.OPEN) {\n                    alertService.sendAlert(\n                        \"CRITICAL: Payment Service Circuit Breaker OPEN\");\n                }\n            })\n            .onError(event -> log.error(\"CB error: {}\", event.getThrowable().getMessage()))\n            .onSuccess(event -> log.debug(\"CB success: {}ms\", event.getElapsedDuration().toMillis()));\n    }\n}' },
        { type: 'code', language: 'yaml', value: '# Grafana dashboard query (PromQL):\n# Circuit Breaker state:\n#   resilience4j_circuitbreaker_state{application="order-service"}\n\n# Failure rate:\n#   resilience4j_circuitbreaker_failure_rate{application="order-service"}\n\n# Calls per second:\n#   rate(resilience4j_circuitbreaker_calls_seconds_count[5m])\n\n# Retry rate:\n#   rate(resilience4j_retry_calls_total{kind="successful_with_retry"}[5m])\n\n# Alert rule:\n# alert: CircuitBreakerOpen\n# expr: resilience4j_circuitbreaker_state == 1\n# for: 1m\n# labels:\n#   severity: critical\n# annotations:\n#   summary: "Circuit Breaker OPEN for {{ $labels.name }}"' },
        { type: 'tip', value: 'Настройте alert на Circuit Breaker OPEN. Это означает что сервис недоступен. Также мониторьте retry rate — высокий процент retry указывает на нестабильность сервиса.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Resilience паттерны',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте Resilience4j для Order Service: Circuit Breaker, Retry, Timeout, Bulkhead для всех зависимых сервисов.',
      requirements: [
        'Настройте Circuit Breaker для Payment Service (50% failure -> OPEN)',
        'Добавьте Retry с exponential backoff для User Service (3 попытки)',
        'Настройте Timeout (3 секунды) для всех внешних вызовов',
        'Реализуйте Bulkhead: отдельные пулы для каждого сервиса',
        'Создайте fallback методы: кэш для User, pending для Payment',
        'Настройте мониторинг: метрики в Prometheus, alert на OPEN'
      ],
      hint: 'Используйте resilience4j-spring-boot3 стартер. Конфигурацию вынесите в application.yml. Порядок декораторов: @Bulkhead -> @CircuitBreaker -> @Retry -> @TimeLimiter. Fallback метод должен иметь ту же сигнатуру + Throwable.',
      expectedOutput: 'Payment Service отвечает ошибками:\n- Первые 5 вызовов: 3 ошибки из 5 -> failure rate 60% -> Circuit Breaker OPEN.\n- Следующие 30 секунд: все вызовы -> fallback (PaymentStatus.PENDING).\n- Через 30 секунд: HALF_OPEN -> 5 тестовых вызовов -> если OK -> CLOSED.\n\nUser Service медленно отвечает:\n- Timeout: вызов прерван через 3 секунды.\n- Retry: 3 попытки с 500ms, 1s, 2s задержкой.\n- Fallback: данные из кэша.\n\nМетрики: /actuator/prometheus содержит resilience4j метрики.',
      solution: '# application.yml\nresilience4j:\n  circuitbreaker:\n    instances:\n      payment-service:\n        failure-rate-threshold: 50\n        wait-duration-in-open-state: 30s\n        sliding-window-size: 10\n        minimum-number-of-calls: 5\n      user-service:\n        failure-rate-threshold: 60\n        wait-duration-in-open-state: 20s\n\n  retry:\n    instances:\n      user-service:\n        max-attempts: 3\n        wait-duration: 500ms\n        exponential-backoff-multiplier: 2\n\n  timelimiter:\n    instances:\n      payment-service:\n        timeout-duration: 3s\n      user-service:\n        timeout-duration: 3s\n\n  bulkhead:\n    instances:\n      payment-service:\n        max-concurrent-calls: 30\n      user-service:\n        max-concurrent-calls: 50\n\n// Java код\n@Service\npublic class PaymentClient {\n    @Bulkhead(name = "payment-service")\n    @CircuitBreaker(name = "payment-service", fallbackMethod = "fallback")\n    @TimeLimiter(name = "payment-service")\n    public CompletableFuture<PaymentResponse> pay(PaymentRequest req) {\n        return CompletableFuture.supplyAsync(() -> restClient.post()...);\n    }\n\n    private CompletableFuture<PaymentResponse> fallback(PaymentRequest req, Throwable t) {\n        return CompletableFuture.completedFuture(\n            new PaymentResponse(null, PaymentStatus.PENDING, "Позже"));\n    }\n}',
      explanation: 'Resilience паттерны предотвращают каскадные отказы. Circuit Breaker отключает вызовы к упавшему сервису. Retry обрабатывает временные сбои. Timeout предотвращает зависание. Bulkhead изолирует ресурсы. Fallback обеспечивает graceful degradation. Мониторинг через Prometheus даёт видимость здоровья системы.'
    }
  ]
}
