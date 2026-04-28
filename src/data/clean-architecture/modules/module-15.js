export default {
  id: 15,
  title: 'Dependency Injection на практике',
  description: 'IoC-контейнеры, Composition Root, конструкторная инъекция, области видимости и практика DI в разных языках.',
  lessons: [
    {
      id: 1,
      title: 'Принцип Inversion of Control',
      type: 'theory',
      content: [
        { type: 'text', value: 'Inversion of Control (IoC) — принцип, при котором управление потоком программы передаётся фреймворку или контейнеру. Dependency Injection (DI) — конкретная реализация IoC: зависимости передаются объекту извне, а не создаются внутри.' },
        { type: 'heading', value: 'Без DI vs С DI' },
        { type: 'code', language: 'java', value: '// БЕЗ DI: класс сам создаёт зависимости\npublic class OrderService {\n    private final OrderRepository repo = new JpaOrderRepository(); // жёсткая привязка!\n    private final EmailSender sender = new SmtpEmailSender();       // жёсткая привязка!\n    \n    // Невозможно подменить для тестов\n    // Невозможно использовать другую реализацию\n}\n\n// С DI: зависимости инжектируются извне\npublic class OrderService {\n    private final OrderRepository repo;\n    private final EmailSender sender;\n    \n    // Конструкторная инъекция\n    public OrderService(OrderRepository repo, EmailSender sender) {\n        this.repo = repo;\n        this.sender = sender;\n    }\n    \n    // Легко подменить в тестах: new OrderService(fakeRepo, fakeEmailSender)\n}' },
        { type: 'heading', value: 'Три типа DI' },
        { type: 'list', value: [
          'Конструкторная инъекция (рекомендуется) — зависимости через конструктор',
          'Инъекция через setter — через метод setXxx()',
          'Инъекция через поле (@Autowired на поле) — антипаттерн, затрудняет тестирование'
        ]},
        { type: 'tip', value: 'Всегда используйте конструкторную инъекцию. Она делает зависимости явными, позволяет объявить поля final и гарантирует, что объект получит все зависимости при создании.' }
      ]
    },
    {
      id: 2,
      title: 'IoC-контейнеры',
      type: 'theory',
      content: [
        { type: 'text', value: 'IoC-контейнер автоматически создаёт объекты и инжектирует их зависимости. Вместо ручного создания new OrderService(new JpaRepo(), new SmtpSender()), контейнер делает это за нас.' },
        { type: 'heading', value: 'Spring IoC Container (Java)' },
        { type: 'code', language: 'java', value: '// Spring: регистрация бинов\n@Configuration\npublic class AppConfig {\n    @Bean\n    public OrderRepository orderRepository(DataSource ds) {\n        return new JpaOrderRepository(ds);\n    }\n    \n    @Bean\n    public EmailSender emailSender() {\n        return new SmtpEmailSender("smtp.gmail.com", 587);\n    }\n    \n    @Bean\n    public PlaceOrderUseCase placeOrderUseCase(\n        OrderRepository repo, EmailSender sender\n    ) {\n        // Spring автоматически инжектирует repo и sender\n        return new PlaceOrderUseCase(repo, sender);\n    }\n}\n\n// Или через аннотации (component scanning)\n@Service\npublic class PlaceOrderUseCase {\n    private final OrderRepository repo;\n    \n    // Spring автоматически найдёт и инжектирует\n    public PlaceOrderUseCase(OrderRepository repo) {\n        this.repo = repo;\n    }\n}' },
        { type: 'heading', value: 'NestJS IoC Container (TypeScript)' },
        { type: 'code', language: 'typescript', value: '// NestJS: модуль с провайдерами\n@Module({\n  providers: [\n    PlaceOrderUseCase,\n    {\n      provide: "OrderRepository",\n      useClass: TypeOrmOrderRepository,\n    },\n    {\n      provide: "EmailSender",\n      useClass: SendGridEmailSender,\n    },\n  ],\n  controllers: [OrderController],\n})\nexport class OrderModule {}\n\n// Use Case\n@Injectable()\nexport class PlaceOrderUseCase {\n  constructor(\n    @Inject("OrderRepository") private orderRepo: OrderRepository,\n    @Inject("EmailSender") private emailSender: EmailSender\n  ) {}\n\n  async execute(command: PlaceOrderCommand): Promise<OrderDto> {\n    // ...\n  }\n}' },
        { type: 'note', value: 'IoC-контейнер — деталь Infrastructure. Domain и Application слои не должны зависеть от контейнера. В Domain нет @Autowired, @Inject и подобных аннотаций.' }
      ]
    },
    {
      id: 3,
      title: 'Composition Root',
      type: 'theory',
      content: [
        { type: 'text', value: 'Composition Root — единственное место, где все зависимости собираются вместе. Это "корень" приложения, где конкретные реализации привязываются к интерфейсам.' },
        { type: 'heading', value: 'Принципы Composition Root' },
        { type: 'list', value: [
          'Только одно место знает обо всех конкретных реализациях',
          'Находится максимально близко к точке входа (main)',
          'Не содержит бизнес-логики — только конфигурация DI',
          'Все остальные модули работают с интерфейсами'
        ]},
        { type: 'code', language: 'java', value: '// Composition Root: main метод\npublic class Application {\n    public static void main(String[] args) {\n        // Infrastructure\n        DataSource ds = new HikariDataSource(config());\n        EventPublisher publisher = new KafkaEventPublisher(kafkaConfig());\n        \n        // Repositories\n        OrderRepository orderRepo = new JpaOrderRepository(ds);\n        ProductRepository productRepo = new JpaProductRepository(ds);\n        \n        // Domain Services\n        PricingService pricing = new PricingService();\n        \n        // Use Cases\n        PlaceOrderUseCase placeOrder = new PlaceOrderUseCase(\n            orderRepo, productRepo, pricing, publisher\n        );\n        GetOrdersQueryHandler getOrders = new GetOrdersQueryHandler(ds);\n        \n        // Controllers\n        OrderController orderCtrl = new OrderController(placeOrder, getOrders);\n        \n        // Web Server\n        new WebServer(8080)\n            .route("POST", "/api/orders", orderCtrl::create)\n            .route("GET", "/api/orders/:id", orderCtrl::getById)\n            .start();\n    }\n}' },
        { type: 'code', language: 'typescript', value: '// TypeScript Composition Root\nasync function bootstrap(): Promise<void> {\n  // Config\n  const config = loadConfig();\n  \n  // Infrastructure\n  const db = await createDatabasePool(config.databaseUrl);\n  const stripe = new StripeGateway(config.stripeKey);\n  const mailer = new SendGridMailer(config.sendgridKey);\n  const eventBus = new InMemoryEventBus();\n  \n  // Repositories\n  const orderRepo = new PgOrderRepository(db);\n  const userRepo = new PgUserRepository(db);\n  \n  // Use Cases\n  const placeOrder = new PlaceOrderUseCase(orderRepo, stripe, mailer, eventBus);\n  const registerUser = new RegisterUserUseCase(userRepo, mailer);\n  \n  // Controllers\n  const orderController = new OrderController(placeOrder);\n  const userController = new UserController(registerUser);\n  \n  // App\n  const app = express();\n  app.use(express.json());\n  app.post("/api/orders", orderController.create.bind(orderController));\n  app.post("/api/users", userController.register.bind(userController));\n  app.use(errorHandler);\n  \n  app.listen(config.port, () => console.log(`Server on port ${config.port}`));\n}\n\nbootstrap();' },
        { type: 'tip', value: 'Composition Root можно легко тестировать: замените реальные реализации на фейки, и получите полный интеграционный тест без внешних зависимостей.' }
      ]
    },
    {
      id: 4,
      title: 'Области видимости (Scopes)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Scope (область видимости) определяет жизненный цикл объекта: создаётся один раз или для каждого запроса.' },
        { type: 'heading', value: 'Типы Scopes' },
        { type: 'list', value: [
          'Singleton — один экземпляр на всё приложение (по умолчанию в Spring)',
          'Transient — новый экземпляр каждый раз при запросе',
          'Scoped/Request — один экземпляр на HTTP-запрос',
          'Session — один экземпляр на сессию пользователя'
        ]},
        { type: 'code', language: 'java', value: '// Spring Scopes\n@Configuration\npublic class ScopeConfig {\n    \n    @Bean\n    @Scope("singleton") // один на всё приложение (по умолчанию)\n    public PricingService pricingService() {\n        return new PricingService();\n    }\n    \n    @Bean\n    @Scope("prototype") // новый экземпляр каждый раз\n    public ShoppingCart shoppingCart() {\n        return new ShoppingCart();\n    }\n    \n    @Bean\n    @Scope("request") // один на HTTP-запрос\n    public RequestContext requestContext() {\n        return new RequestContext();\n    }\n}' },
        { type: 'heading', value: 'Правила выбора Scope' },
        { type: 'list', value: [
          'Stateless сервисы (Use Cases, Repositories) → Singleton',
          'Stateful объекты (корзина, контекст запроса) → Request/Transient',
          'Дорогие соединения (DB Pool, HTTP Client) → Singleton',
          'Объекты с мутабельным состоянием → осторожно с Singleton!'
        ]},
        { type: 'warning', value: 'Captive Dependency: Singleton зависит от Scoped/Transient объекта. Singleton живёт вечно, но его зависимость уже умерла. Это опасный баг! Singleton может зависеть только от других Singleton.' }
      ]
    },
    {
      id: 5,
      title: 'DI без контейнера: Pure DI',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pure DI (чистая инъекция) — DI без IoC-контейнера. Все зависимости создаются вручную в Composition Root через new. Это проще, безопаснее (проверка на этапе компиляции) и не требует фреймворка.' },
        { type: 'code', language: 'typescript', value: '// Pure DI: всё собирается вручную\nclass CompositionRoot {\n  // Singleton-кеш\n  private _orderRepo?: OrderRepository;\n  private _userRepo?: UserRepository;\n\n  constructor(private config: AppConfig) {}\n\n  // Lazy singleton\n  get orderRepo(): OrderRepository {\n    if (!this._orderRepo) {\n      this._orderRepo = new PgOrderRepository(this.config.databaseUrl);\n    }\n    return this._orderRepo;\n  }\n\n  get userRepo(): UserRepository {\n    if (!this._userRepo) {\n      this._userRepo = new PgUserRepository(this.config.databaseUrl);\n    }\n    return this._userRepo;\n  }\n\n  // Transient: новый каждый раз\n  createPlaceOrderUseCase(): PlaceOrderUseCase {\n    return new PlaceOrderUseCase(\n      this.orderRepo,\n      this.paymentGateway,\n      this.emailSender\n    );\n  }\n\n  get paymentGateway(): PaymentGateway {\n    return new StripePaymentGateway(this.config.stripeKey);\n  }\n\n  get emailSender(): EmailSender {\n    if (this.config.env === "test") {\n      return new FakeEmailSender();\n    }\n    return new SendGridEmailSender(this.config.sendgridKey);\n  }\n}\n\n// Использование\nconst root = new CompositionRoot(loadConfig());\nconst app = express();\nconst orderCtrl = new OrderController(root.createPlaceOrderUseCase());\napp.post("/orders", orderCtrl.create.bind(orderCtrl));' },
        { type: 'heading', value: 'Pure DI vs IoC Container' },
        { type: 'list', value: [
          'Pure DI: проверка зависимостей при компиляции, нет магии, нет рефлексии',
          'IoC Container: автоматическое разрешение, AOP, scopes из коробки',
          'Маленький проект → Pure DI',
          'Большой проект со сложными зависимостями → IoC Container'
        ]},
        { type: 'note', value: 'Mark Seemann (автор книги "Dependency Injection") рекомендует Pure DI для большинства проектов. IoC-контейнер — не обязательное требование для DI.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: настройка DI для проекта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте Dependency Injection для приложения управления задачами: Composition Root, scopes, тестовая конфигурация.',
      requirements: [
        'Создать Composition Root со всеми зависимостями',
        'Настроить Singleton для сервисов и Transient для Use Cases',
        'Создать тестовую конфигурацию с Fake-реализациями',
        'Обеспечить, чтобы Domain не зависел от DI-контейнера',
        'Продемонстрировать подмену зависимости для тестов'
      ],
      hint: 'Composition Root знает обо всех реализациях. Domain знает только об интерфейсах. Для тестов создайте отдельный Composition Root с Fake-реализациями.',
      expectedOutput: 'Полный Composition Root с production и test конфигурациями. Domain не содержит зависимостей от DI. Тесты используют Fake-реализации без изменения бизнес-логики.',
      solution: '// Production Composition Root\nclass ProductionContainer {\n  private db: Pool;\n  \n  constructor(config: Config) {\n    this.db = new Pool({ connectionString: config.databaseUrl });\n  }\n  \n  // Singleton repositories\n  private _taskRepo?: TaskRepository;\n  get taskRepo(): TaskRepository {\n    if (!this._taskRepo) {\n      this._taskRepo = new PgTaskRepository(this.db);\n    }\n    return this._taskRepo;\n  }\n  \n  private _userRepo?: UserRepository;\n  get userRepo(): UserRepository {\n    if (!this._userRepo) {\n      this._userRepo = new PgUserRepository(this.db);\n    }\n    return this._userRepo;\n  }\n  \n  get notifier(): NotificationService {\n    return new EmailNotificationService(process.env.SMTP_URL!);\n  }\n  \n  // Transient use cases\n  createTaskUseCase(): CreateTaskUseCase {\n    return new CreateTaskUseCase(this.taskRepo, this.notifier);\n  }\n  \n  completeTaskUseCase(): CompleteTaskUseCase {\n    return new CompleteTaskUseCase(this.taskRepo);\n  }\n}\n\n// Test Composition Root\nclass TestContainer {\n  taskRepo = new InMemoryTaskRepository();\n  userRepo = new InMemoryUserRepository();\n  notifier = new FakeNotificationService();\n  \n  createTaskUseCase(): CreateTaskUseCase {\n    return new CreateTaskUseCase(this.taskRepo, this.notifier);\n  }\n  \n  completeTaskUseCase(): CompleteTaskUseCase {\n    return new CompleteTaskUseCase(this.taskRepo);\n  }\n}\n\n// Тест\ndescribe("CreateTaskUseCase", () => {\n  it("should create task and send notification", async () => {\n    const container = new TestContainer();\n    const useCase = container.createTaskUseCase();\n    \n    await useCase.execute({ title: "Test task", assigneeId: "user-1" });\n    \n    // Проверяем через Fake\n    const tasks = await container.taskRepo.findAll();\n    expect(tasks).toHaveLength(1);\n    expect(tasks[0].title).toBe("Test task");\n    expect(container.notifier.sent).toHaveLength(1);\n  });\n});\n\n// Запуск приложения\nconst container = new ProductionContainer(loadConfig());\nconst app = express();\nconst taskCtrl = new TaskController(\n  container.createTaskUseCase(),\n  container.completeTaskUseCase()\n);\napp.post("/tasks", taskCtrl.create.bind(taskCtrl));',
      explanation: 'ProductionContainer собирает реальные зависимости (PostgreSQL, SMTP). TestContainer собирает Fake-зависимости (InMemory, FakeNotification). Domain и Application слои не знают, какой контейнер используется — они работают через интерфейсы. Тесты быстрые (InMemory) и проверяют бизнес-логику, не инфраструктуру.'
    }
  ]
}
