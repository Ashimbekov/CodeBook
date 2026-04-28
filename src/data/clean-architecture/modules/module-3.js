export default {
  id: 3,
  title: 'Гексагональная архитектура',
  description: 'Hexagonal Architecture (Ports & Adapters): порты, адаптеры, первичные и вторичные актёры, и как изолировать бизнес-логику от внешнего мира.',
  lessons: [
    {
      id: 1,
      title: 'Концепция Ports & Adapters',
      type: 'theory',
      content: [
        { type: 'text', value: 'Гексагональная архитектура (Hexagonal Architecture) предложена Алистером Кокберном в 2005 году. Другое название — Ports & Adapters. Идея: приложение — это ядро с бизнес-логикой, которое взаимодействует с внешним миром через порты (интерфейсы) и адаптеры (реализации).' },
        { type: 'heading', value: 'Почему "гексагональная"?' },
        { type: 'text', value: 'Шестиугольник — это просто визуальная метафора. Кокберн выбрал гексагон, чтобы показать, что у приложения может быть много граней (портов), а не только два слоя (UI сверху, БД снизу), как в классической трёхзвенной архитектуре.' },
        { type: 'heading', value: 'Ключевые элементы' },
        { type: 'list', value: [
          'Application Core — ядро с бизнес-логикой, не зависит от внешнего мира',
          'Ports — интерфейсы, через которые ядро общается с внешним миром',
          'Adapters — конкретные реализации портов для конкретных технологий',
          'Primary (Driving) Adapters — те, кто вызывает ядро (UI, REST, CLI)',
          'Secondary (Driven) Adapters — те, кого вызывает ядро (БД, email, очередь)'
        ]},
        { type: 'tip', value: 'Представьте приложение как осьминога: ядро — это тело, а щупальца — порты. К каждому щупальцу можно подключить разный адаптер: вместо PostgreSQL — MongoDB, вместо REST — GraphQL.' }
      ]
    },
    {
      id: 2,
      title: 'Порты: входящие и исходящие',
      type: 'theory',
      content: [
        { type: 'text', value: 'Порт — это интерфейс, определённый ядром приложения. Порты бывают двух типов: входящие (driving/primary) и исходящие (driven/secondary).' },
        { type: 'heading', value: 'Входящие порты (Driving Ports)' },
        { type: 'text', value: 'Определяют, что приложение умеет делать. Это API ядра для внешнего мира. Первичные адаптеры (контроллеры, CLI) вызывают эти порты.' },
        { type: 'code', language: 'java', value: '// Входящий порт — что приложение умеет делать\npublic interface ManageOrders {\n    OrderId placeOrder(PlaceOrderCommand command);\n    void cancelOrder(OrderId orderId);\n    OrderDetails getOrderDetails(OrderId orderId);\n}\n\n// Реализация порта — сервис в ядре\npublic class OrderService implements ManageOrders {\n    private final OrderRepository orderRepo;  // исходящий порт\n    private final PaymentGateway paymentGateway; // исходящий порт\n    \n    @Override\n    public OrderId placeOrder(PlaceOrderCommand command) {\n        Order order = Order.create(command);\n        paymentGateway.charge(order.totalAmount());\n        orderRepo.save(order);\n        return order.id();\n    }\n}' },
        { type: 'heading', value: 'Исходящие порты (Driven Ports)' },
        { type: 'text', value: 'Определяют, что ядру нужно от внешнего мира. Это интерфейсы, которые ядро использует, но не реализует. Реализация — во внешнем слое.' },
        { type: 'code', language: 'java', value: '// Исходящие порты — что ядру нужно от внешнего мира\npublic interface OrderRepository {\n    Order findById(OrderId id);\n    void save(Order order);\n}\n\npublic interface PaymentGateway {\n    PaymentResult charge(Money amount);\n}\n\npublic interface NotificationSender {\n    void sendOrderConfirmation(Order order);\n}' },
        { type: 'note', value: 'Входящие порты определяют USE CASES (что делает система). Исходящие порты определяют ЗАВИСИМОСТИ (что нужно системе). Порты принадлежат ядру — это ключевое отличие от обычных интерфейсов.' }
      ]
    },
    {
      id: 3,
      title: 'Адаптеры: первичные и вторичные',
      type: 'theory',
      content: [
        { type: 'text', value: 'Адаптер — конкретная реализация порта для конкретной технологии. Адаптеры находятся снаружи гексагона и легко заменяемы.' },
        { type: 'heading', value: 'Первичные (Driving) адаптеры' },
        { type: 'text', value: 'Инициируют взаимодействие с ядром. Примеры: REST-контроллер, GraphQL-резолвер, CLI-обработчик, gRPC-сервис.' },
        { type: 'code', language: 'typescript', value: '// Первичный адаптер: REST Controller\nclass OrderRestAdapter {\n  constructor(private manageOrders: ManageOrders) {} // входящий порт\n\n  async handleCreateOrder(req: Request, res: Response): Promise<void> {\n    const command: PlaceOrderCommand = {\n      customerId: req.body.customerId,\n      items: req.body.items,\n    };\n    const orderId = await this.manageOrders.placeOrder(command);\n    res.status(201).json({ orderId });\n  }\n}\n\n// Первичный адаптер: CLI\nclass OrderCliAdapter {\n  constructor(private manageOrders: ManageOrders) {} // тот же порт!\n\n  async handleCommand(args: string[]): Promise<void> {\n    const command = this.parseArgs(args);\n    const orderId = await this.manageOrders.placeOrder(command);\n    console.log(`Order created: ${orderId}`);\n  }\n}' },
        { type: 'heading', value: 'Вторичные (Driven) адаптеры' },
        { type: 'text', value: 'Реализуют исходящие порты ядра. Примеры: JPA-репозиторий, SMTP-клиент, REST-клиент к внешнему API, Kafka-продюсер.' },
        { type: 'code', language: 'typescript', value: '// Вторичный адаптер: PostgreSQL реализация репозитория\nclass PostgresOrderRepository implements OrderRepository {\n  constructor(private pool: Pool) {}\n\n  async findById(id: OrderId): Promise<Order | null> {\n    const result = await this.pool.query(\n      "SELECT * FROM orders WHERE id = $1", [id.value]\n    );\n    return result.rows[0] ? this.toDomain(result.rows[0]) : null;\n  }\n\n  async save(order: Order): Promise<void> {\n    await this.pool.query(\n      "INSERT INTO orders (id, customer_id, total, status) VALUES ($1, $2, $3, $4)",\n      [order.id.value, order.customerId.value, order.total.amount, order.status]\n    );\n  }\n}\n\n// Вторичный адаптер: In-Memory (для тестов)\nclass InMemoryOrderRepository implements OrderRepository {\n  private orders: Map<string, Order> = new Map();\n\n  async findById(id: OrderId): Promise<Order | null> {\n    return this.orders.get(id.value) || null;\n  }\n\n  async save(order: Order): Promise<void> {\n    this.orders.set(order.id.value, order);\n  }\n}' },
        { type: 'tip', value: 'Главное преимущество адаптеров — заменяемость. Для тестов используем InMemoryRepository, для продакшена — PostgresRepository. Ядро не меняется.' }
      ]
    },
    {
      id: 4,
      title: 'Структура проекта в Hexagonal Architecture',
      type: 'theory',
      content: [
        { type: 'text', value: 'Структура папок в гексагональной архитектуре отражает разделение на ядро, порты и адаптеры.' },
        { type: 'heading', value: 'Типичная структура' },
        { type: 'code', language: 'java', value: 'src/\n├── domain/                          # Ядро — бизнес-логика\n│   ├── model/\n│   │   ├── Order.java               # Entity\n│   │   ├── OrderId.java             # Value Object\n│   │   ├── Money.java               # Value Object\n│   │   └── OrderStatus.java         # Enum\n│   ├── port/\n│   │   ├── in/                      # Входящие порты\n│   │   │   ├── ManageOrders.java     # Use Case интерфейс\n│   │   │   └── PlaceOrderCommand.java\n│   │   └── out/                     # Исходящие порты\n│   │       ├── OrderRepository.java\n│   │       └── PaymentGateway.java\n│   └── service/\n│       └── OrderService.java        # Реализация входящего порта\n│\n├── adapter/                         # Адаптеры — внешний мир\n│   ├── in/                          # Первичные адаптеры\n│   │   ├── rest/\n│   │   │   └── OrderController.java\n│   │   └── cli/\n│   │       └── OrderCli.java\n│   └── out/                         # Вторичные адаптеры\n│       ├── persistence/\n│       │   ├── JpaOrderRepository.java\n│       │   └── OrderJpaEntity.java\n│       └── payment/\n│           └── StripePaymentAdapter.java\n│\n└── config/                          # Конфигурация DI\n    └── BeanConfiguration.java' },
        { type: 'heading', value: 'Правила зависимостей в структуре' },
        { type: 'list', value: [
          'domain/ не импортирует ничего из adapter/ или config/',
          'adapter/in/ импортирует domain/port/in/',
          'adapter/out/ реализует domain/port/out/',
          'config/ связывает всё вместе через DI'
        ]},
        { type: 'warning', value: 'Не путайте JPA Entity (OrderJpaEntity) с доменной Entity (Order). Это разные объекты! JPA Entity живёт в адаптере, доменная Entity — в ядре. Между ними нужен маппер.' }
      ]
    },
    {
      id: 5,
      title: 'Hexagonal vs Layered Architecture',
      type: 'theory',
      content: [
        { type: 'text', value: 'Традиционная слоистая архитектура (Controller → Service → Repository) выглядит похоже, но имеет принципиальные отличия от гексагональной.' },
        { type: 'heading', value: 'Проблемы классической Layered Architecture' },
        { type: 'list', value: [
          'Зависимости направлены сверху вниз — бизнес-слой зависит от слоя данных',
          'Сложно тестировать — Service напрямую вызывает конкретный Repository',
          'БД диктует дизайн — доменная модель подстраивается под таблицы',
          'Anemic Domain — сервис содержит логику, Entity — только данные'
        ]},
        { type: 'heading', value: 'Как Hexagonal решает эти проблемы' },
        { type: 'code', language: 'java', value: '// Layered Architecture (проблема: Service зависит от конкретного Repository)\n// service/OrderService.java\npublic class OrderService {\n    @Autowired\n    private JpaOrderRepository repository; // зависимость от конкретной реализации!\n}\n\n// Hexagonal Architecture (решение: Service зависит от интерфейса)\n// domain/service/OrderService.java\npublic class OrderService implements ManageOrders {\n    private final OrderRepository repository; // интерфейс, определённый в domain\n    \n    // Конструктор — DI через конструктор, не через @Autowired\n    public OrderService(OrderRepository repository) {\n        this.repository = repository;\n    }\n}' },
        { type: 'heading', value: 'Сравнительная таблица' },
        { type: 'text', value: 'Layered: зависимости сверху вниз, домен зависит от БД, тестирование требует моков БД.\nHexagonal: зависимости направлены к ядру, БД зависит от домена, тестирование через подмену адаптеров.' },
        { type: 'tip', value: 'Hexagonal Architecture не исключает слои — она меняет направление зависимостей. Domain больше не зависит от Infrastructure — наоборот, Infrastructure реализует интерфейсы Domain.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: реализация Hexagonal Architecture',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему управления задачами (Task Manager) с использованием гексагональной архитектуры.',
      requirements: [
        'Определить доменную модель: Task с состояниями (todo, in_progress, done)',
        'Создать входящий порт ManageTasks с методами createTask, completeTask, getTasks',
        'Создать исходящий порт TaskRepository',
        'Реализовать TaskService (ядро)',
        'Создать REST-адаптер (первичный) и InMemory-адаптер (вторичный)'
      ],
      hint: 'Начните с определения портов (интерфейсов). Затем реализуйте ядро (TaskService). Адаптеры создавайте в последнюю очередь.',
      expectedOutput: 'Система с чётким разделением: ядро не зависит от адаптеров, адаптеры легко заменяемы, тестирование ядра возможно без внешних зависимостей.',
      solution: '// === DOMAIN (ядро) ===\n\n// domain/model/Task.ts\nclass Task {\n  private constructor(\n    public readonly id: string,\n    public readonly title: string,\n    private _status: "todo" | "in_progress" | "done"\n  ) {}\n\n  static create(id: string, title: string): Task {\n    if (!title.trim()) throw new Error("Название задачи обязательно");\n    return new Task(id, title, "todo");\n  }\n\n  get status() { return this._status; }\n\n  start(): void {\n    if (this._status !== "todo") throw new Error("Можно начать только новую задачу");\n    this._status = "in_progress";\n  }\n\n  complete(): void {\n    if (this._status === "done") throw new Error("Задача уже выполнена");\n    this._status = "done";\n  }\n}\n\n// domain/port/in/ManageTasks.ts\ninterface ManageTasks {\n  createTask(title: string): Promise<Task>;\n  completeTask(taskId: string): Promise<void>;\n  getTasks(): Promise<Task[]>;\n}\n\n// domain/port/out/TaskRepository.ts\ninterface TaskRepository {\n  save(task: Task): Promise<void>;\n  findById(id: string): Promise<Task | null>;\n  findAll(): Promise<Task[]>;\n}\n\n// domain/service/TaskService.ts\nclass TaskService implements ManageTasks {\n  constructor(private taskRepo: TaskRepository) {}\n\n  async createTask(title: string): Promise<Task> {\n    const task = Task.create(crypto.randomUUID(), title);\n    await this.taskRepo.save(task);\n    return task;\n  }\n\n  async completeTask(taskId: string): Promise<void> {\n    const task = await this.taskRepo.findById(taskId);\n    if (!task) throw new Error("Задача не найдена");\n    task.complete();\n    await this.taskRepo.save(task);\n  }\n\n  async getTasks(): Promise<Task[]> {\n    return this.taskRepo.findAll();\n  }\n}\n\n// === ADAPTERS ===\n\n// adapter/out/InMemoryTaskRepository.ts\nclass InMemoryTaskRepository implements TaskRepository {\n  private tasks = new Map<string, Task>();\n  async save(task: Task) { this.tasks.set(task.id, task); }\n  async findById(id: string) { return this.tasks.get(id) || null; }\n  async findAll() { return Array.from(this.tasks.values()); }\n}\n\n// adapter/in/TaskRestAdapter.ts\nclass TaskRestAdapter {\n  constructor(private manageTasks: ManageTasks) {}\n  async handleCreate(req: Request, res: Response) {\n    const task = await this.manageTasks.createTask(req.body.title);\n    res.status(201).json(task);\n  }\n}',
      explanation: 'Ядро (Task, TaskService) не зависит от конкретных технологий. TaskRepository — интерфейс в ядре, реализации — в адаптерах. REST-адаптер вызывает ManageTasks (входящий порт), не зная деталей реализации. InMemory-адаптер идеален для тестов.'
    }
  ]
}
