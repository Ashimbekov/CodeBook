export default {
  id: 3,
  title: 'REST и HTTP взаимодействие',
  description: 'Синхронное межсервисное взаимодействие через REST API, проектирование контрактов, версионирование, обработка ошибок, таймауты и retry.',
  lessons: [
    {
      id: 1,
      title: 'REST API между сервисами',
      type: 'theory',
      content: [
        { type: 'text', value: 'REST — самый распространённый способ синхронного взаимодействия между микросервисами. Каждый сервис предоставляет HTTP API, другие сервисы вызывают его как клиенты. Это просто, но имеет ограничения.' },
        { type: 'heading', value: 'Проектирование REST API сервиса' },
        { type: 'code', language: 'java', value: '// Order Service — REST контроллер\n@RestController\n@RequestMapping("/api/v1/orders")\npublic class OrderController {\n\n    @PostMapping\n    @ResponseStatus(HttpStatus.CREATED)\n    public OrderResponse createOrder(@Valid @RequestBody CreateOrderRequest request) {\n        Order order = orderService.create(request);\n        return OrderResponse.from(order);\n    }\n\n    @GetMapping("/{orderId}")\n    public OrderResponse getOrder(@PathVariable UUID orderId) {\n        return orderService.findById(orderId)\n            .map(OrderResponse::from)\n            .orElseThrow(() -> new OrderNotFoundException(orderId));\n    }\n\n    @PatchMapping("/{orderId}/status")\n    public OrderResponse updateStatus(\n            @PathVariable UUID orderId,\n            @Valid @RequestBody UpdateStatusRequest request) {\n        Order order = orderService.updateStatus(orderId, request.status());\n        return OrderResponse.from(order);\n    }\n}\n\n// DTO — контракт API\npublic record CreateOrderRequest(\n    @NotNull UUID customerId,\n    @NotEmpty List<OrderItemRequest> items\n) {}\n\npublic record OrderResponse(\n    UUID id,\n    UUID customerId,\n    String status,\n    BigDecimal totalAmount,\n    List<OrderItemResponse> items,\n    Instant createdAt\n) {\n    public static OrderResponse from(Order order) {\n        return new OrderResponse(\n            order.getId(), order.getCustomerId(),\n            order.getStatus().name(), order.getTotalAmount(),\n            order.getItems().stream().map(OrderItemResponse::from).toList(),\n            order.getCreatedAt()\n        );\n    }\n}' },
        { type: 'tip', value: 'Всегда используйте DTO (Data Transfer Objects) для API, никогда не возвращайте Entity напрямую. Это разделяет внутреннюю модель и контракт API — можно менять модель не ломая клиентов.' }
      ]
    },
    {
      id: 2,
      title: 'Вызов других сервисов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для вызова других микросервисов используются HTTP-клиенты: RestTemplate (устаревший), WebClient (реактивный), RestClient (новый в Spring 6.1), Feign Client (декларативный). Каждый вызов — это сетевой запрос с возможными ошибками.' },
        { type: 'code', language: 'java', value: '// Способ 1: RestClient (Spring 6.1+) — рекомендуемый\n@Configuration\npublic class RestClientConfig {\n    @Bean\n    public RestClient userServiceClient() {\n        return RestClient.builder()\n            .baseUrl("http://user-service:8081")\n            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)\n            .requestInterceptor((request, body, execution) -> {\n                // Прокидываем correlation ID для трейсинга\n                String correlationId = MDC.get("correlationId");\n                if (correlationId != null) {\n                    request.getHeaders().set("X-Correlation-ID", correlationId);\n                }\n                return execution.execute(request, body);\n            })\n            .build();\n    }\n}\n\n@Service\npublic class UserServiceClient {\n    private final RestClient restClient;\n\n    public UserResponse getUser(UUID userId) {\n        return restClient.get()\n            .uri("/api/v1/users/{id}", userId)\n            .retrieve()\n            .onStatus(HttpStatusCode::is4xxClientError, (request, response) -> {\n                if (response.getStatusCode() == HttpStatus.NOT_FOUND) {\n                    throw new UserNotFoundException(userId);\n                }\n                throw new ClientException("User Service error: " + response.getStatusCode());\n            })\n            .body(UserResponse.class);\n    }\n}\n\n// Способ 2: Feign Client (декларативный)\n@FeignClient(name = "user-service", url = "${services.user.url}")\npublic interface UserServiceClient {\n\n    @GetMapping("/api/v1/users/{id}")\n    UserResponse getUser(@PathVariable UUID id);\n\n    @PostMapping("/api/v1/users")\n    UserResponse createUser(@RequestBody CreateUserRequest request);\n}' },
        { type: 'warning', value: 'Каждый REST-вызов между сервисами — это сетевой запрос (1-50ms). Цепочка из 5 синхронных вызовов = 5-250ms задержки. Минимизируйте цепочки синхронных вызовов и используйте асинхронные события где возможно.' }
      ]
    },
    {
      id: 3,
      title: 'Версионирование API',
      type: 'theory',
      content: [
        { type: 'text', value: 'При изменении API нужно поддерживать обратную совместимость. Версионирование позволяет обновлять сервис не ломая потребителей. Существует несколько стратегий: URI, Header, Query parameter.' },
        { type: 'code', language: 'java', value: '// Стратегия 1: URI versioning (самый распространённый)\n@RestController\n@RequestMapping("/api/v1/orders")\npublic class OrderControllerV1 {\n    @GetMapping("/{id}")\n    public OrderResponseV1 getOrder(@PathVariable UUID id) {\n        return orderService.getOrderV1(id);\n    }\n}\n\n@RestController\n@RequestMapping("/api/v2/orders")\npublic class OrderControllerV2 {\n    @GetMapping("/{id}")\n    public OrderResponseV2 getOrder(@PathVariable UUID id) {\n        // V2 добавляет поле deliveryEstimate\n        return orderService.getOrderV2(id);\n    }\n}\n\n// Стратегия 2: Header versioning\n@GetMapping(value = "/{id}", headers = "X-API-Version=1")\npublic OrderResponseV1 getOrderV1(@PathVariable UUID id) { ... }\n\n@GetMapping(value = "/{id}", headers = "X-API-Version=2")\npublic OrderResponseV2 getOrderV2(@PathVariable UUID id) { ... }\n\n// Стратегия 3: Content negotiation\n@GetMapping(value = "/{id}", produces = "application/vnd.shop.v1+json")\npublic OrderResponseV1 getOrderV1(@PathVariable UUID id) { ... }\n\n@GetMapping(value = "/{id}", produces = "application/vnd.shop.v2+json")\npublic OrderResponseV2 getOrderV2(@PathVariable UUID id) { ... }' },
        { type: 'heading', value: 'Правила обратной совместимости' },
        { type: 'list', value: [
          'Добавление нового поля — совместимо (старые клиенты игнорируют)',
          'Удаление поля — НЕСОВМЕСТИМО (помечайте @Deprecated, удаляйте в новой версии)',
          'Изменение типа поля — НЕСОВМЕСТИМО (нужна новая версия)',
          'Добавление обязательного параметра — НЕСОВМЕСТИМО',
          'Добавление опционального параметра — совместимо'
        ] },
        { type: 'tip', value: 'Придерживайтесь правила: старая версия API работает минимум 6 месяцев после выхода новой. Логируйте использование версий — когда v1 перестанут вызывать, можно удалять.' }
      ]
    },
    {
      id: 4,
      title: 'Обработка ошибок и таймауты',
      type: 'theory',
      content: [
        { type: 'text', value: 'В распределённой системе ошибки неизбежны: сервис недоступен, таймаут, 500 ошибка. Правильная обработка ошибок критична для устойчивости системы.' },
        { type: 'code', language: 'java', value: '// Единый формат ошибок для всех сервисов\npublic record ErrorResponse(\n    String code,\n    String message,\n    String traceId,\n    Instant timestamp,\n    Map<String, String> details\n) {}\n\n// Глобальный обработчик ошибок\n@RestControllerAdvice\npublic class GlobalExceptionHandler {\n\n    @ExceptionHandler(OrderNotFoundException.class)\n    @ResponseStatus(HttpStatus.NOT_FOUND)\n    public ErrorResponse handleNotFound(OrderNotFoundException ex) {\n        return new ErrorResponse(\n            "ORDER_NOT_FOUND",\n            ex.getMessage(),\n            MDC.get("traceId"),\n            Instant.now(),\n            Map.of("orderId", ex.getOrderId().toString())\n        );\n    }\n\n    @ExceptionHandler(ServiceUnavailableException.class)\n    @ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)\n    public ErrorResponse handleServiceUnavailable(ServiceUnavailableException ex) {\n        return new ErrorResponse(\n            "DOWNSTREAM_SERVICE_UNAVAILABLE",\n            "Сервис временно недоступен, попробуйте позже",\n            MDC.get("traceId"),\n            Instant.now(),\n            Map.of("service", ex.getServiceName())\n        );\n    }\n}\n\n// Таймауты для HTTP-клиента\n@Bean\npublic RestClient userServiceClient() {\n    var httpClient = HttpClient.newBuilder()\n        .connectTimeout(Duration.ofSeconds(2))   // Таймаут подключения\n        .build();\n\n    var requestFactory = new JdkClientHttpRequestFactory(httpClient);\n    requestFactory.setReadTimeout(Duration.ofSeconds(5)); // Таймаут чтения\n\n    return RestClient.builder()\n        .baseUrl("http://user-service:8081")\n        .requestFactory(requestFactory)\n        .build();\n}' },
        { type: 'list', value: [
          'Connect timeout: 1-3 секунды — если не подключились, сервис недоступен',
          'Read timeout: 3-10 секунд — если не получили ответ, запрос слишком долгий',
          'Retry: повторять только идемпотентные запросы (GET, PUT с той же версией)',
          'Не повторять POST — может создать дублирующие заказы!'
        ] },
        { type: 'warning', value: 'Таймауты обязательны для всех HTTP-вызовов! Без таймаутов один зависший сервис заблокирует все потоки вызывающего сервиса — каскадный отказ (cascading failure).' }
      ]
    },
    {
      id: 5,
      title: 'OpenAPI и контракты',
      type: 'theory',
      content: [
        { type: 'text', value: 'OpenAPI (Swagger) — стандарт описания REST API. В микросервисах OpenAPI-спецификация служит контрактом между сервисами. Подход API-First: сначала описываем контракт, потом реализуем.' },
        { type: 'code', language: 'yaml', value: '# openapi.yaml — контракт Order Service\nopenapi: 3.0.3\ninfo:\n  title: Order Service API\n  version: 1.0.0\n  description: Сервис управления заказами\n\npaths:\n  /api/v1/orders:\n    post:\n      summary: Создать заказ\n      operationId: createOrder\n      requestBody:\n        required: true\n        content:\n          application/json:\n            schema:\n              $ref: \'#/components/schemas/CreateOrderRequest\'\n      responses:\n        \'201\':\n          description: Заказ создан\n          content:\n            application/json:\n              schema:\n                $ref: \'#/components/schemas/OrderResponse\'\n        \'400\':\n          description: Невалидный запрос\n          content:\n            application/json:\n              schema:\n                $ref: \'#/components/schemas/ErrorResponse\'\n\n  /api/v1/orders/{orderId}:\n    get:\n      summary: Получить заказ по ID\n      operationId: getOrder\n      parameters:\n        - name: orderId\n          in: path\n          required: true\n          schema:\n            type: string\n            format: uuid\n      responses:\n        \'200\':\n          description: OK\n          content:\n            application/json:\n              schema:\n                $ref: \'#/components/schemas/OrderResponse\'\n        \'404\':\n          description: Заказ не найден\n\ncomponents:\n  schemas:\n    CreateOrderRequest:\n      type: object\n      required: [customerId, items]\n      properties:\n        customerId:\n          type: string\n          format: uuid\n        items:\n          type: array\n          items:\n            $ref: \'#/components/schemas/OrderItemRequest\'\n\n    OrderResponse:\n      type: object\n      properties:\n        id:\n          type: string\n          format: uuid\n        customerId:\n          type: string\n          format: uuid\n        status:\n          type: string\n          enum: [CREATED, CONFIRMED, SHIPPED, DELIVERED, CANCELLED]\n        totalAmount:\n          type: number\n        createdAt:\n          type: string\n          format: date-time' },
        { type: 'tip', value: 'Используйте openapi-generator для генерации клиентов и серверных стабов из OpenAPI spec. Это гарантирует что клиент и сервер используют одинаковый контракт.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: REST-взаимодействие сервисов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте REST-взаимодействие между Order Service и User Service с обработкой ошибок.',
      requirements: [
        'Создайте REST контроллер для Order Service с CRUD операциями',
        'Реализуйте HTTP-клиент для вызова User Service с таймаутами',
        'Добавьте глобальный обработчик ошибок с единым форматом ErrorResponse',
        'Реализуйте retry для GET запросов с exponential backoff',
        'Опишите API в формате OpenAPI (YAML)',
        'Добавьте прокидывание X-Correlation-ID между сервисами'
      ],
      hint: 'Используйте RestClient из Spring 6.1 с настроенными таймаутами. Для retry используйте Spring Retry (@Retryable). Correlation ID генерируйте в API Gateway и прокидывайте через headers.',
      expectedOutput: 'Order Service запущен на порту 8080.\nPOST /api/v1/orders — создаёт заказ, вызывает User Service для проверки.\nUser Service отвечает 200 — заказ создан (201).\nUser Service отвечает 404 — ошибка CUSTOMER_NOT_FOUND (400).\nUser Service не отвечает — retry 3 раза, затем SERVICE_UNAVAILABLE (503).\nX-Correlation-ID прокидывается во все вызовы и логи.',
      solution: '// OrderService с вызовом UserService\n@Service\n@Slf4j\npublic class OrderService {\n    private final OrderRepository orderRepository;\n    private final UserServiceClient userServiceClient;\n\n    @Transactional\n    public Order createOrder(CreateOrderRequest request) {\n        // Проверяем существование пользователя\n        UserResponse user = userServiceClient.getUser(request.customerId());\n        if (user == null) {\n            throw new CustomerNotFoundException(request.customerId());\n        }\n\n        Order order = new Order();\n        order.setCustomerId(request.customerId());\n        order.setCustomerName(user.name()); // Денормализация\n        order.setStatus(OrderStatus.CREATED);\n        order.setItems(request.items().stream()\n            .map(i -> new OrderItem(i.productId(), i.price(), i.quantity()))\n            .toList());\n        order.recalculateTotal();\n\n        return orderRepository.save(order);\n    }\n}\n\n// HTTP клиент с retry и таймаутами\n@Service\n@Slf4j\npublic class UserServiceClient {\n    private final RestClient restClient;\n\n    @Retryable(\n        retryFor = {ResourceAccessException.class, HttpServerErrorException.class},\n        maxAttempts = 3,\n        backoff = @Backoff(delay = 500, multiplier = 2)\n    )\n    public UserResponse getUser(UUID userId) {\n        log.info("Вызов User Service для userId={}", userId);\n        return restClient.get()\n            .uri("/api/v1/users/{id}", userId)\n            .retrieve()\n            .body(UserResponse.class);\n    }\n\n    @Recover\n    public UserResponse getUserFallback(Exception ex, UUID userId) {\n        log.error("User Service недоступен после 3 попыток: {}", ex.getMessage());\n        throw new ServiceUnavailableException("user-service");\n    }\n}',
      explanation: 'REST-взаимодействие между сервисами требует обработки ошибок, таймаутов и retry. Correlation ID позволяет отследить запрос через все сервисы. Retry применяется только к идемпотентным операциям (GET). Для POST нужна идемпотентность через idempotency key.'
    }
  ]
}
