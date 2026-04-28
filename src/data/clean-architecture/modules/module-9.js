export default {
  id: 9,
  title: 'CQRS: Основы',
  description: 'Command Query Responsibility Segregation: разделение моделей чтения и записи, команды, запросы и их обработчики.',
  lessons: [
    {
      id: 1,
      title: 'Что такое CQRS',
      type: 'theory',
      content: [
        { type: 'text', value: 'CQRS (Command Query Responsibility Segregation) — паттерн, разделяющий операции чтения и записи на две отдельные модели. Вместо одной модели для всего, мы создаём Write Model (для изменений) и Read Model (для запросов).' },
        { type: 'heading', value: 'Принцип CQS (предшественник CQRS)' },
        { type: 'text', value: 'Бертран Мейер предложил CQS (Command Query Separation): метод либо изменяет состояние (Command), либо возвращает данные (Query), но не то и другое одновременно.' },
        { type: 'code', language: 'java', value: '// CQS на уровне методов\npublic class Stack<T> {\n    // Command — изменяет состояние, ничего не возвращает\n    public void push(T item) { ... }\n    \n    // Query — возвращает данные, не изменяет состояние\n    public T peek() { ... }\n    \n    // Нарушение CQS — и изменяет, и возвращает\n    // public T pop() { ... } // меняет состояние И возвращает значение\n}' },
        { type: 'heading', value: 'CQRS — CQS на уровне архитектуры' },
        { type: 'text', value: 'CQRS масштабирует идею CQS на уровень всей системы: отдельная модель для записи (Commands) и отдельная модель для чтения (Queries). Они могут использовать разные БД, разные схемы, разные технологии.' },
        { type: 'tip', value: 'CQRS — не обязательный элемент Clean Architecture. Это дополнительный паттерн, который применяется, когда модели чтения и записи существенно отличаются (например, сложная запись, но простое чтение с денормализацией).' }
      ]
    },
    {
      id: 2,
      title: 'Commands и Command Handlers',
      type: 'theory',
      content: [
        { type: 'text', value: 'Command (команда) — намерение изменить состояние системы. Команда содержит все данные, необходимые для выполнения операции.' },
        { type: 'heading', value: 'Структура Command' },
        { type: 'code', language: 'java', value: '// Команды — DTO с данными для изменения\npublic record PlaceOrderCommand(\n    String customerId,\n    List<OrderItemDto> items,\n    String shippingAddress\n) {}\n\npublic record CancelOrderCommand(\n    String orderId,\n    String reason\n) {}\n\npublic record UpdateProductPriceCommand(\n    String productId,\n    BigDecimal newPrice\n) {}' },
        { type: 'heading', value: 'Command Handler' },
        { type: 'code', language: 'java', value: '// Интерфейс обработчика команд\npublic interface CommandHandler<C> {\n    void handle(C command);\n}\n\n// Обработчик: PlaceOrder\npublic class PlaceOrderHandler implements CommandHandler<PlaceOrderCommand> {\n    private final OrderRepository orderRepo;\n    private final ProductRepository productRepo;\n    \n    @Override\n    public void handle(PlaceOrderCommand command) {\n        List<Product> products = productRepo.findAllByIds(\n            command.items().stream().map(OrderItemDto::productId).toList()\n        );\n        \n        Order order = Order.place(\n            new CustomerId(command.customerId()),\n            mapToCartItems(command.items(), products)\n        );\n        \n        orderRepo.save(order);\n    }\n}\n\n// Обработчик: CancelOrder\npublic class CancelOrderHandler implements CommandHandler<CancelOrderCommand> {\n    private final OrderRepository orderRepo;\n    \n    @Override\n    public void handle(CancelOrderCommand command) {\n        Order order = orderRepo.findById(new OrderId(command.orderId()))\n            .orElseThrow(() -> new OrderNotFoundException(command.orderId()));\n        order.cancel(command.reason());\n        orderRepo.save(order);\n    }\n}' },
        { type: 'note', value: 'Команда именуется как действие: PlaceOrder, CancelOrder, UpdatePrice. Обработчик команды — это по сути Use Case из Clean Architecture. Одна команда = один обработчик.' }
      ]
    },
    {
      id: 3,
      title: 'Queries и Query Handlers',
      type: 'theory',
      content: [
        { type: 'text', value: 'Query (запрос) — намерение получить данные без изменения состояния. Read Model оптимизирована для чтения: денормализованные данные, подготовленные проекции.' },
        { type: 'code', language: 'java', value: '// Запросы — описание того, что нужно получить\npublic record GetOrderDetailsQuery(String orderId) {}\npublic record GetCustomerOrdersQuery(String customerId, int page, int size) {}\npublic record SearchProductsQuery(String keyword, String category, int page) {}\n\n// Read Model — оптимизированная для чтения структура\npublic record OrderDetailsView(\n    String orderId,\n    String customerName,\n    String customerEmail,\n    List<OrderLineView> items,\n    BigDecimal totalAmount,\n    String status,\n    String createdAt\n) {}\n\npublic record OrderLineView(\n    String productName,\n    int quantity,\n    BigDecimal unitPrice,\n    BigDecimal lineTotal\n) {}' },
        { type: 'heading', value: 'Query Handler' },
        { type: 'code', language: 'java', value: '// Обработчик запроса — читает данные напрямую из Read Model\npublic class GetOrderDetailsHandler implements QueryHandler<GetOrderDetailsQuery, OrderDetailsView> {\n    private final JdbcTemplate jdbc; // прямой доступ к БД — это нормально для Read!\n    \n    @Override\n    public OrderDetailsView handle(GetOrderDetailsQuery query) {\n        return jdbc.queryForObject(\n            """\n            SELECT o.id, c.name, c.email, o.total_amount, o.status, o.created_at\n            FROM orders o\n            JOIN customers c ON o.customer_id = c.id\n            WHERE o.id = ?\n            """,\n            (rs, rowNum) -> new OrderDetailsView(\n                rs.getString("id"),\n                rs.getString("name"),\n                rs.getString("email"),\n                getOrderLines(query.orderId()),\n                rs.getBigDecimal("total_amount"),\n                rs.getString("status"),\n                rs.getString("created_at")\n            ),\n            query.orderId()\n        );\n    }\n}' },
        { type: 'heading', value: 'Важное отличие' },
        { type: 'text', value: 'Write Model использует доменные объекты (Entity, Aggregate). Read Model может читать прямо из БД и возвращать денормализованные DTO. Для чтения не нужны агрегаты и бизнес-правила!' },
        { type: 'tip', value: 'Read Model может даже использовать другую БД. Например, запись в PostgreSQL, чтение из Elasticsearch. Синхронизация — через Domain Events.' }
      ]
    },
    {
      id: 4,
      title: 'Command Bus и Query Bus',
      type: 'theory',
      content: [
        { type: 'text', value: 'Command Bus и Query Bus — медиаторы, маршрутизирующие команды и запросы к соответствующим обработчикам. Они позволяют декуплить отправителя от обработчика.' },
        { type: 'code', language: 'typescript', value: '// Command Bus\nclass CommandBus {\n  private handlers: Map<string, CommandHandler<any>> = new Map();\n\n  register<C>(commandType: string, handler: CommandHandler<C>): void {\n    this.handlers.set(commandType, handler);\n  }\n\n  async dispatch<C>(command: C): Promise<void> {\n    const type = command.constructor.name;\n    const handler = this.handlers.get(type);\n    if (!handler) {\n      throw new Error(`Нет обработчика для команды: ${type}`);\n    }\n    await handler.handle(command);\n  }\n}\n\n// Query Bus\nclass QueryBus {\n  private handlers: Map<string, QueryHandler<any, any>> = new Map();\n\n  register<Q, R>(queryType: string, handler: QueryHandler<Q, R>): void {\n    this.handlers.set(queryType, handler);\n  }\n\n  async dispatch<Q, R>(query: Q): Promise<R> {\n    const type = query.constructor.name;\n    const handler = this.handlers.get(type);\n    if (!handler) {\n      throw new Error(`Нет обработчика для запроса: ${type}`);\n    }\n    return handler.handle(query);\n  }\n}\n\n// Контроллер использует Bus, не зная об обработчиках\nclass OrderController {\n  constructor(\n    private commandBus: CommandBus,\n    private queryBus: QueryBus\n  ) {}\n\n  async createOrder(req: Request): Promise<Response> {\n    await this.commandBus.dispatch(new PlaceOrderCommand(req.body));\n    return { status: 201 };\n  }\n\n  async getOrder(req: Request): Promise<Response> {\n    const view = await this.queryBus.dispatch(\n      new GetOrderDetailsQuery(req.params.id)\n    );\n    return { status: 200, body: view };\n  }\n}' },
        { type: 'heading', value: 'Преимущества Bus-паттерна' },
        { type: 'list', value: [
          'Декуплинг: контроллер не знает об обработчиках',
          'Middleware: можно добавить логирование, валидацию, авторизацию',
          'Тестирование: легко подменить обработчики',
          'Масштабирование: команды можно отправлять в очередь'
        ]},
        { type: 'note', value: 'Bus — не обязательный элемент CQRS. Можно вызывать обработчики напрямую. Bus полезен при большом количестве команд/запросов и необходимости cross-cutting concerns (логирование, аудит).' }
      ]
    },
    {
      id: 5,
      title: 'CQRS: когда применять',
      type: 'theory',
      content: [
        { type: 'text', value: 'CQRS добавляет сложность. Его нужно применять осознанно, когда преимущества перевешивают стоимость.' },
        { type: 'heading', value: 'Когда CQRS оправдан' },
        { type: 'list', value: [
          'Модели чтения и записи сильно отличаются',
          'Нагрузка на чтение значительно превышает нагрузку на запись',
          'Нужна независимая масштабируемость чтения и записи',
          'Сложная доменная модель для записи, но простые представления для чтения',
          'Event Sourcing — CQRS почти обязателен'
        ]},
        { type: 'heading', value: 'Когда CQRS не нужен' },
        { type: 'list', value: [
          'Простой CRUD без сложной бизнес-логики',
          'Модели чтения и записи практически одинаковы',
          'Маленькая команда — сложность CQRS не оправдана',
          'Нет проблем с производительностью чтения'
        ]},
        { type: 'heading', value: 'Уровни CQRS' },
        { type: 'text', value: 'CQRS можно внедрять постепенно:\n\n1. Простой CQRS — разделение Command/Query классов в одном приложении, одна БД\n2. Средний CQRS — отдельные модели чтения (View), но одна БД\n3. Полный CQRS — разные БД для чтения и записи, синхронизация через события' },
        { type: 'warning', value: 'Не начинайте с полного CQRS. Начните с простого разделения команд и запросов. Добавляйте Read Model и отдельные БД только когда есть реальная необходимость.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: реализация CQRS',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте CQRS для системы управления задачами: команды (создание, завершение) и запросы (список задач, детали задачи).',
      requirements: [
        'Определить команды: CreateTask, CompleteTask, AssignTask',
        'Определить запросы: GetTaskDetails, GetTasksByProject, GetOverdueTasks',
        'Реализовать Command Handlers с доменной логикой',
        'Реализовать Query Handlers с прямым чтением из Read Model',
        'Создать CommandBus и QueryBus'
      ],
      hint: 'Write-сторона работает через агрегат Task и TaskRepository. Read-сторона может использовать прямые SQL-запросы и возвращать плоские DTO.',
      expectedOutput: 'Команды изменяют состояние через агрегаты. Запросы читают денормализованные данные напрямую. CommandBus маршрутизирует команды, QueryBus маршрутизирует запросы.',
      solution: '// === COMMANDS ===\nclass CreateTaskCommand {\n  constructor(\n    public readonly title: string,\n    public readonly projectId: string,\n    public readonly assigneeId: string,\n    public readonly dueDate: Date\n  ) {}\n}\n\nclass CompleteTaskCommand {\n  constructor(public readonly taskId: string) {}\n}\n\n// === COMMAND HANDLERS ===\nclass CreateTaskHandler {\n  constructor(private taskRepo: TaskRepository) {}\n  \n  async handle(cmd: CreateTaskCommand): Promise<void> {\n    const task = Task.create(\n      cmd.title, cmd.projectId, cmd.assigneeId, cmd.dueDate\n    );\n    await this.taskRepo.save(task);\n  }\n}\n\nclass CompleteTaskHandler {\n  constructor(private taskRepo: TaskRepository) {}\n  \n  async handle(cmd: CompleteTaskCommand): Promise<void> {\n    const task = await this.taskRepo.findById(cmd.taskId);\n    if (!task) throw new Error("Задача не найдена");\n    task.complete();\n    await this.taskRepo.save(task);\n  }\n}\n\n// === QUERIES ===\nclass GetTasksByProjectQuery {\n  constructor(public readonly projectId: string, public readonly page: number = 1) {}\n}\n\nclass GetOverdueTasksQuery {\n  constructor(public readonly assigneeId: string) {}\n}\n\n// === READ MODELS ===\ninterface TaskListView {\n  id: string;\n  title: string;\n  assigneeName: string;\n  dueDate: string;\n  status: string;\n}\n\n// === QUERY HANDLERS ===\nclass GetTasksByProjectHandler {\n  constructor(private db: Database) {}\n  \n  async handle(query: GetTasksByProjectQuery): Promise<TaskListView[]> {\n    return this.db.query(\n      `SELECT t.id, t.title, u.name as assignee_name, t.due_date, t.status\n       FROM tasks t JOIN users u ON t.assignee_id = u.id\n       WHERE t.project_id = $1\n       ORDER BY t.due_date\n       LIMIT 20 OFFSET $2`,\n      [query.projectId, (query.page - 1) * 20]\n    );\n  }\n}\n\n// === BUSES ===\nclass CommandBus {\n  private handlers = new Map();\n  register(type: string, handler: any) { this.handlers.set(type, handler); }\n  async dispatch(cmd: any) {\n    const handler = this.handlers.get(cmd.constructor.name);\n    await handler.handle(cmd);\n  }\n}\n\nclass QueryBus {\n  private handlers = new Map();\n  register(type: string, handler: any) { this.handlers.set(type, handler); }\n  async dispatch(query: any) {\n    const handler = this.handlers.get(query.constructor.name);\n    return handler.handle(query);\n  }\n}',
      explanation: 'Write-сторона: CreateTaskCommand → CreateTaskHandler → Task.create() → TaskRepository.save(). Read-сторона: GetTasksByProjectQuery → GetTasksByProjectHandler → прямой SQL с JOIN. Модели чтения и записи независимы. CommandBus и QueryBus маршрутизируют к нужным обработчикам.'
    }
  ]
}
