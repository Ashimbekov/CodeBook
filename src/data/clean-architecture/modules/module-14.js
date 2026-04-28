export default {
  id: 14,
  title: 'Слой Presentation',
  description: 'Presentation-слой: контроллеры, сериализация, валидация запросов, обработка ошибок и REST API.',
  lessons: [
    {
      id: 1,
      title: 'Роль Presentation-слоя',
      type: 'theory',
      content: [
        { type: 'text', value: 'Presentation-слой — точка входа в приложение. Он принимает запросы от внешнего мира (HTTP, CLI, WebSocket), преобразует их в команды/запросы Application-слоя и возвращает результат в формате, понятном клиенту.' },
        { type: 'heading', value: 'Ответственности Presentation-слоя' },
        { type: 'list', value: [
          'Приём и парсинг запросов (HTTP, gRPC, GraphQL)',
          'Валидация формата запроса (JSON schema, required fields)',
          'Преобразование Request → Command/Query',
          'Вызов Use Case из Application-слоя',
          'Преобразование результата → Response',
          'Обработка ошибок и HTTP-статусы'
        ]},
        { type: 'heading', value: 'Чего НЕ должно быть' },
        { type: 'list', value: [
          'Бизнес-логики',
          'Прямого доступа к БД',
          'Доменных объектов в ответах (только DTO)',
          'Сложной логики маршрутизации'
        ]},
        { type: 'tip', value: 'Контроллер должен быть тонким: принять запрос → преобразовать → вызвать Use Case → вернуть ответ. Если контроллер содержит if/else с бизнес-логикой — логика утекла из Domain/Application.' }
      ]
    },
    {
      id: 2,
      title: 'Контроллеры в Clean Architecture',
      type: 'theory',
      content: [
        { type: 'text', value: 'Контроллер — адаптер между HTTP-протоколом и Application-слоем. Он знает о HTTP (коды статуса, заголовки), но не знает о бизнес-логике.' },
        { type: 'code', language: 'java', value: '// Spring Boot Controller\n@RestController\n@RequestMapping("/api/v1/orders")\npublic class OrderController {\n    private final PlaceOrderUseCase placeOrderUseCase;\n    private final GetOrderDetailsQueryHandler getOrderDetails;\n    private final CancelOrderUseCase cancelOrderUseCase;\n    \n    @PostMapping\n    public ResponseEntity<OrderDto> createOrder(\n        @Valid @RequestBody CreateOrderRequest request\n    ) {\n        PlaceOrderCommand command = new PlaceOrderCommand(\n            request.customerId(),\n            request.items().stream()\n                .map(i -> new OrderItemDto(i.productId(), i.quantity()))\n                .toList(),\n            request.shippingAddress()\n        );\n        \n        OrderDto result = placeOrderUseCase.execute(command);\n        \n        return ResponseEntity\n            .status(HttpStatus.CREATED)\n            .body(result);\n    }\n    \n    @GetMapping("/{orderId}")\n    public ResponseEntity<OrderDetailsDto> getOrder(@PathVariable String orderId) {\n        OrderDetailsDto result = getOrderDetails.handle(\n            new GetOrderDetailsQuery(orderId)\n        );\n        return ResponseEntity.ok(result);\n    }\n    \n    @PostMapping("/{orderId}/cancel")\n    public ResponseEntity<Void> cancelOrder(\n        @PathVariable String orderId,\n        @RequestBody CancelOrderRequest request\n    ) {\n        cancelOrderUseCase.execute(new CancelOrderCommand(orderId, request.reason()));\n        return ResponseEntity.noContent().build();\n    }\n}' },
        { type: 'code', language: 'typescript', value: '// Express.js Controller\nclass OrderController {\n  constructor(\n    private placeOrder: PlaceOrderUseCase,\n    private getOrderDetails: GetOrderDetailsHandler\n  ) {}\n\n  async create(req: Request, res: Response): Promise<void> {\n    const command: PlaceOrderCommand = {\n      customerId: req.body.customerId,\n      items: req.body.items,\n      shippingAddress: req.body.shippingAddress,\n    };\n\n    const result = await this.placeOrder.execute(command);\n    res.status(201).json(result);\n  }\n\n  async getById(req: Request, res: Response): Promise<void> {\n    const result = await this.getOrderDetails.handle(\n      new GetOrderDetailsQuery(req.params.id)\n    );\n    res.status(200).json(result);\n  }\n}\n\n// Роуты\nconst router = express.Router();\nrouter.post("/orders", (req, res) => orderController.create(req, res));\nrouter.get("/orders/:id", (req, res) => orderController.getById(req, res));' },
        { type: 'note', value: 'Контроллер не должен знать о доменных объектах. Он работает с Request (входные данные) и DTO (выходные данные). Преобразование Request → Command — ответственность контроллера.' }
      ]
    },
    {
      id: 3,
      title: 'Request/Response модели',
      type: 'theory',
      content: [
        { type: 'text', value: 'Request Model (модель запроса) описывает входные данные от клиента. Response Model описывает формат ответа. Они отличаются от Command/DTO, так как привязаны к протоколу (HTTP, gRPC).' },
        { type: 'code', language: 'java', value: '// Request Model — привязана к HTTP (валидация формата)\npublic record CreateOrderRequest(\n    @NotBlank(message = "customerId обязателен")\n    String customerId,\n    \n    @NotEmpty(message = "Список товаров не может быть пустым")\n    @Valid\n    List<OrderItemRequest> items,\n    \n    @NotBlank(message = "Адрес доставки обязателен")\n    String shippingAddress\n) {}\n\npublic record OrderItemRequest(\n    @NotBlank String productId,\n    @Min(value = 1, message = "Количество минимум 1") int quantity\n) {}\n\n// Response Model — может отличаться от DTO\npublic record ApiResponse<T>(\n    boolean success,\n    T data,\n    String message,\n    Instant timestamp\n) {\n    public static <T> ApiResponse<T> ok(T data) {\n        return new ApiResponse<>(true, data, null, Instant.now());\n    }\n    \n    public static <T> ApiResponse<T> error(String message) {\n        return new ApiResponse<>(false, null, message, Instant.now());\n    }\n}\n\n// Пагинированный ответ\npublic record PagedResponse<T>(\n    List<T> items,\n    int page,\n    int pageSize,\n    long totalItems,\n    int totalPages\n) {}' },
        { type: 'heading', value: 'Слои данных при запросе' },
        { type: 'text', value: 'HTTP Request → Request Model → Command/Query → Domain Entity → DTO → Response Model → HTTP Response.\n\nКаждое преобразование защищает слой от деталей другого слоя.' },
        { type: 'tip', value: 'Для простых проектов Request Model и Command могут совпадать. Не создавайте лишних слоёв абстракции, если они не дают ценности. Добавляйте по мере роста проекта.' }
      ]
    },
    {
      id: 4,
      title: 'Обработка ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый слой выбрасывает свои исключения. Presentation-слой перехватывает их и преобразует в HTTP-ответы с правильными статус-кодами.' },
        { type: 'code', language: 'java', value: '// Глобальный обработчик ошибок (Spring)\n@RestControllerAdvice\npublic class GlobalExceptionHandler {\n    \n    // Доменные ошибки → 400/409/422\n    @ExceptionHandler(DomainException.class)\n    public ResponseEntity<ApiResponse<Void>> handleDomainException(DomainException ex) {\n        HttpStatus status = switch (ex) {\n            case NotFoundException e -> HttpStatus.NOT_FOUND;\n            case AlreadyExistsException e -> HttpStatus.CONFLICT;\n            case InsufficientFundsException e -> HttpStatus.UNPROCESSABLE_ENTITY;\n            default -> HttpStatus.BAD_REQUEST;\n        };\n        \n        return ResponseEntity.status(status)\n            .body(ApiResponse.error(ex.getMessage()));\n    }\n    \n    // Валидационные ошибки → 400\n    @ExceptionHandler(MethodArgumentNotValidException.class)\n    public ResponseEntity<ApiResponse<List<String>>> handleValidation(\n        MethodArgumentNotValidException ex\n    ) {\n        List<String> errors = ex.getBindingResult().getFieldErrors().stream()\n            .map(e -> e.getField() + ": " + e.getDefaultMessage())\n            .toList();\n        \n        return ResponseEntity.badRequest()\n            .body(new ApiResponse<>(false, errors, "Ошибка валидации", Instant.now()));\n    }\n    \n    // Непредвиденные ошибки → 500\n    @ExceptionHandler(Exception.class)\n    public ResponseEntity<ApiResponse<Void>> handleUnexpected(Exception ex) {\n        log.error("Непредвиденная ошибка", ex);\n        return ResponseEntity.internalServerError()\n            .body(ApiResponse.error("Внутренняя ошибка сервера"));\n    }\n}' },
        { type: 'code', language: 'typescript', value: '// Express.js middleware для обработки ошибок\nfunction errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {\n  if (err instanceof DomainException) {\n    const statusMap: Record<string, number> = {\n      NOT_FOUND: 404,\n      ALREADY_EXISTS: 409,\n      INSUFFICIENT_FUNDS: 422,\n      INVALID_OPERATION: 400,\n    };\n    const status = statusMap[err.code] || 400;\n    return res.status(status).json({ success: false, error: err.message });\n  }\n\n  if (err instanceof ValidationError) {\n    return res.status(400).json({ success: false, errors: err.details });\n  }\n\n  console.error("Unexpected error:", err);\n  res.status(500).json({ success: false, error: "Internal server error" });\n}' },
        { type: 'warning', value: 'Никогда не показывайте stack trace и внутренние детали ошибок клиенту в продакшене. Логируйте полный stack trace на сервере, но клиенту возвращайте только безопасное сообщение.' }
      ]
    },
    {
      id: 5,
      title: 'Версионирование API',
      type: 'theory',
      content: [
        { type: 'text', value: 'API-контракт (Request/Response модели) — часть Presentation-слоя. При изменении контракта нужно поддерживать старые версии для обратной совместимости.' },
        { type: 'heading', value: 'Способы версионирования' },
        { type: 'list', value: [
          'URL path: /api/v1/orders, /api/v2/orders — самый распространённый',
          'Header: Accept: application/vnd.shop.v2+json — REST-purist подход',
          'Query parameter: /api/orders?version=2 — просто, но менее чисто'
        ]},
        { type: 'code', language: 'java', value: '// Версионирование через URL\n@RestController\n@RequestMapping("/api/v1/orders")\npublic class OrderControllerV1 {\n    @GetMapping("/{id}")\n    public OrderResponseV1 getOrder(@PathVariable String id) {\n        OrderDto dto = getOrderDetails.handle(new GetOrderDetailsQuery(id));\n        return OrderResponseV1.from(dto); // старый формат\n    }\n}\n\n@RestController\n@RequestMapping("/api/v2/orders")\npublic class OrderControllerV2 {\n    @GetMapping("/{id}")\n    public OrderResponseV2 getOrder(@PathVariable String id) {\n        OrderDto dto = getOrderDetails.handle(new GetOrderDetailsQuery(id));\n        return OrderResponseV2.from(dto); // новый формат с дополнительными полями\n    }\n}\n\n// Оба контроллера вызывают ОДИН Use Case!\n// Различия только в формате Request/Response' },
        { type: 'heading', value: 'Стратегия совместимости' },
        { type: 'text', value: 'Добавление нового поля — обратно совместимо (клиент игнорирует незнакомые поля). Удаление или переименование поля — ломающее изменение, требует новую версию.' },
        { type: 'note', value: 'Версионирование — проблема Presentation-слоя. Domain и Application не меняются при смене версии API. Новая версия — это просто новый контроллер с другим маппингом Request ↔ Command.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Presentation-слой для REST API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Presentation-слой для API управления пользователями: контроллеры, валидация, обработка ошибок.',
      requirements: [
        'Создать Request Models: CreateUserRequest, UpdateUserRequest с валидацией',
        'Создать Response Models: UserResponse, PagedResponse',
        'Реализовать UserController с CRUD-операциями',
        'Реализовать глобальный обработчик ошибок',
        'Обеспечить правильные HTTP-статусы (201, 200, 204, 400, 404, 500)'
      ],
      hint: 'Контроллер принимает Request, преобразует в Command/Query, вызывает Use Case, возвращает Response. Ошибки перехватываются глобальным обработчиком и преобразуются в правильные HTTP-ответы.',
      expectedOutput: 'REST API с правильными HTTP-статусами, валидацией запросов, единообразным форматом ответов и обработкой ошибок. Контроллеры тонкие — логика в Use Cases.',
      solution: '// Request Models\nclass CreateUserRequest {\n  @IsNotEmpty() @IsEmail() email: string;\n  @IsNotEmpty() @MinLength(2) firstName: string;\n  @IsNotEmpty() @MinLength(2) lastName: string;\n  @IsNotEmpty() @MinLength(8) password: string;\n}\n\nclass UpdateUserRequest {\n  @IsOptional() @MinLength(2) firstName?: string;\n  @IsOptional() @MinLength(2) lastName?: string;\n}\n\n// Response Models\ninterface UserResponse {\n  id: string;\n  email: string;\n  firstName: string;\n  lastName: string;\n  createdAt: string;\n}\n\ninterface ApiResponse<T> {\n  success: boolean;\n  data?: T;\n  error?: string;\n}\n\n// Controller\nclass UserController {\n  constructor(\n    private registerUser: RegisterUserUseCase,\n    private updateUser: UpdateUserUseCase,\n    private getUserById: GetUserByIdHandler,\n    private listUsers: ListUsersHandler,\n    private deleteUser: DeleteUserUseCase\n  ) {}\n\n  async create(req: Request, res: Response) {\n    const command = new RegisterUserCommand(\n      req.body.email, req.body.firstName, req.body.lastName, req.body.password\n    );\n    const user = await this.registerUser.execute(command);\n    res.status(201).json({ success: true, data: user });\n  }\n\n  async getById(req: Request, res: Response) {\n    const user = await this.getUserById.handle(new GetUserByIdQuery(req.params.id));\n    res.status(200).json({ success: true, data: user });\n  }\n\n  async update(req: Request, res: Response) {\n    const command = new UpdateUserCommand(req.params.id, req.body.firstName, req.body.lastName);\n    const user = await this.updateUser.execute(command);\n    res.status(200).json({ success: true, data: user });\n  }\n\n  async delete(req: Request, res: Response) {\n    await this.deleteUser.execute(new DeleteUserCommand(req.params.id));\n    res.status(204).send();\n  }\n\n  async list(req: Request, res: Response) {\n    const query = new ListUsersQuery(Number(req.query.page) || 1, Number(req.query.size) || 20);\n    const result = await this.listUsers.handle(query);\n    res.status(200).json({ success: true, data: result });\n  }\n}\n\n// Error Handler Middleware\nfunction errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {\n  if (err instanceof NotFoundException) {\n    return res.status(404).json({ success: false, error: err.message });\n  }\n  if (err instanceof DomainException) {\n    return res.status(400).json({ success: false, error: err.message });\n  }\n  if (err instanceof ValidationError) {\n    return res.status(400).json({ success: false, error: "Validation failed", details: err.errors });\n  }\n  console.error(err);\n  res.status(500).json({ success: false, error: "Internal server error" });\n}',
      explanation: 'Controller принимает HTTP-запросы, преобразует в Command/Query, вызывает Use Case и возвращает Response с правильным HTTP-статусом. Валидация запросов через декораторы. Глобальный error handler преобразует DomainException → 400, NotFoundException → 404, непредвиденные → 500. Контроллеры тонкие — вся логика в Use Cases.'
    }
  ]
}
