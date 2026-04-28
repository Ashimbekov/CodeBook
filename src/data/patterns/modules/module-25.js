export default {
  id: 25,
  title: 'Паттерны в реальных проектах',
  description: 'Комбинации паттернов, антипаттерны, рефакторинг к паттернам, паттерны в популярных фреймворках',
  lessons: [
    {
      id: 1,
      title: 'Комбинации паттернов',
      type: 'theory',
      content: [
        { type: 'text', value: 'В реальных проектах паттерны редко используются изолированно. Чаще всего они комбинируются для решения сложных задач. Рассмотрим самые популярные комбинации.' },
        { type: 'heading', value: 'MVC = Observer + Strategy + Composite' },
        { type: 'code', language: 'java', value: '// Model — Subject (Observer)\nclass UserModel extends Observable {\n    private String name;\n\n    void setName(String name) {\n        this.name = name;\n        notifyObservers(); // Observer: уведомляет View\n    }\n}\n\n// View — Observer + Composite (дерево компонентов)\nclass UserView implements Observer {\n    void update(Observable o) {\n        // Перерисовка при изменении модели\n    }\n}\n\n// Controller — Strategy (можно подменять)\ninterface UserController {\n    void handleInput(String input);\n}' },
        { type: 'heading', value: 'Builder + Factory Method' },
        { type: 'code', language: 'java', value: '// Factory решает ЧТО строить, Builder — КАК\nclass NotificationFactory {\n    static NotificationBuilder create(String type) {\n        return switch (type) {\n            case "email" -> new EmailNotificationBuilder();\n            case "sms" -> new SmsNotificationBuilder();\n            case "push" -> new PushNotificationBuilder();\n            default -> throw new IllegalArgumentException(type);\n        };\n    }\n}\n\nNotification n = NotificationFactory.create("email")\n    .setRecipient("user@mail.com")\n    .setSubject("Привет!")\n    .setBody("Тело письма")\n    .build();' },
        { type: 'heading', value: 'Decorator + Strategy' },
        { type: 'code', language: 'typescript', value: '// Strategy для выбора компрессии\ninterface Compressor {\n    compress(data: string): string;\n}\n\n// Decorator для добавления логирования, метрик\nclass LoggingDecorator implements DataProcessor {\n    constructor(private inner: DataProcessor) {}\n\n    process(data: string): string {\n        console.log("Start processing...");\n        const result = this.inner.process(data);\n        console.log(`Done: ${data.length} → ${result.length}`);\n        return result;\n    }\n}\n\n// Комбинация: логирование + стратегия сжатия\nconst processor = new LoggingDecorator(\n    new CompressingProcessor(new GzipCompressor())\n);' },
        { type: 'tip', value: 'Не пытайтесь применить максимум паттернов. Комбинируйте их осознанно, когда каждый решает свою конкретную проблему.' }
      ]
    },
    {
      id: 2,
      title: 'Паттерны в Spring Boot',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Boot — кладезь паттернов проектирования. Понимание паттернов помогает глубже понять, как работает фреймворк.' },
        { type: 'heading', value: 'Singleton — все бины по умолчанию' },
        { type: 'code', language: 'java', value: '@Service // Singleton по умолчанию\npublic class UserService {\n    // Spring создаёт один экземпляр и инжектит везде\n}' },
        { type: 'heading', value: 'Factory Method — BeanFactory' },
        { type: 'code', language: 'java', value: '// ApplicationContext — это фабрика бинов\nApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);\nUserService service = ctx.getBean(UserService.class); // Factory Method' },
        { type: 'heading', value: 'Proxy — AOP, @Transactional, @Cacheable' },
        { type: 'code', language: 'java', value: '@Service\npublic class OrderService {\n    @Transactional // Spring создаёт Proxy вокруг метода\n    public void createOrder(Order order) {\n        // Proxy оборачивает в транзакцию\n    }\n\n    @Cacheable("orders") // Caching Proxy\n    public Order getOrder(Long id) {\n        return orderRepository.findById(id);\n    }\n}' },
        { type: 'heading', value: 'Template Method — JdbcTemplate, RestTemplate' },
        { type: 'code', language: 'java', value: '// JdbcTemplate — Template Method для JDBC\njdbcTemplate.query(\n    "SELECT * FROM users WHERE age > ?",\n    new Object[]{18},\n    (rs, rowNum) -> new User(          // Strategy: маппинг строк\n        rs.getString("name"),\n        rs.getInt("age")\n    )\n);' },
        { type: 'heading', value: 'Observer — ApplicationEvent' },
        { type: 'code', language: 'java', value: '// Публикация события\n@Service\npublic class UserService {\n    @Autowired ApplicationEventPublisher publisher;\n\n    public void register(User user) {\n        userRepository.save(user);\n        publisher.publishEvent(new UserRegisteredEvent(user)); // Observer\n    }\n}\n\n// Подписчик\n@EventListener\npublic void onUserRegistered(UserRegisteredEvent event) {\n    emailService.sendWelcome(event.getUser());\n}' },
        { type: 'list', items: [
          'Singleton — все @Service, @Repository, @Component бины',
          'Factory Method — BeanFactory, @Bean методы',
          'Proxy — @Transactional, @Cacheable, @Async, AOP',
          'Template Method — JdbcTemplate, RestTemplate, TransactionTemplate',
          'Observer — ApplicationEvent, @EventListener',
          'Strategy — Comparator, Validator, Converter',
          'Decorator — HandlerInterceptor, Filter',
          'Chain of Responsibility — Filter chain, Interceptor chain',
          'Adapter — HandlerAdapter, WebMvcConfigurer'
        ]}
      ]
    },
    {
      id: 3,
      title: 'Паттерны в React/Angular/TypeScript',
      type: 'theory',
      content: [
        { type: 'heading', value: 'React' },
        { type: 'code', language: 'typescript', value: '// Composite — дерево компонентов\nfunction App() {\n    return (\n        <Layout>           {/* Composite */}\n            <Header />     {/* Leaf */}\n            <Sidebar>      {/* Composite */}\n                <Menu />   {/* Leaf */}\n            </Sidebar>\n            <Content />    {/* Leaf */}\n        </Layout>\n    );\n}\n\n// Observer — useState / useEffect\nconst [count, setCount] = useState(0);\nuseEffect(() => {\n    // Реакция на изменение count (Observer)\n    document.title = `Count: ${count}`;\n}, [count]);\n\n// Strategy — render props / children as function\n<DataFetcher url="/api/users"\n    renderLoading={() => <Spinner />}\n    renderData={(data) => <UserList users={data} />}\n    renderError={(err) => <ErrorMessage error={err} />}\n/>\n\n// HOC — Decorator\nconst EnhancedComponent = withAuth(withLogging(MyComponent));' },
        { type: 'heading', value: 'Angular' },
        { type: 'code', language: 'typescript', value: '// DI Container — Abstract Factory + Singleton\n@Injectable({ providedIn: "root" }) // Singleton\nexport class ApiService {\n    constructor(private http: HttpClient) {} // DI\n}\n\n// Interceptor — Chain of Responsibility\n@Injectable()\nexport class AuthInterceptor implements HttpInterceptor {\n    intercept(req: HttpRequest<any>, next: HttpHandler) {\n        const authReq = req.clone({\n            headers: req.headers.set("Authorization", "Bearer ...")\n        });\n        return next.handle(authReq); // Передаём дальше по цепочке\n    }\n}\n\n// RxJS Observable — Observer\nthis.http.get("/api/users")\n    .pipe(\n        map(users => users.filter(u => u.active)),  // Strategy\n        catchError(err => of([]))                     // Strategy\n    )\n    .subscribe(users => this.users = users);          // Observer' },
        { type: 'heading', value: 'Общие паттерны в TypeScript' },
        { type: 'list', items: [
          'Module Pattern — ES модули (import/export) = Singleton',
          'Middleware — Express, Koa, NestJS = Chain of Responsibility + Decorator',
          'Redux — Mediator (store) + Command (actions) + Observer (subscribe)',
          'React Context — Mediator + Observer',
          'Hooks (useReducer) — Command + Memento',
          'Higher-Order Components — Decorator',
          'Render Props — Strategy'
        ]},
        { type: 'note', value: 'Понимание паттернов помогает разобраться в любом фреймворке. Если вы знаете Observer — вы поймёте RxJS, React hooks, Vue reactivity и Svelte stores.' }
      ]
    },
    {
      id: 4,
      title: 'Антипаттерны и типичные ошибки',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Топ-5 антипаттернов' },
        { type: 'list', items: [
          'God Object — один класс знает и делает всё. Нарушает SRP. Решение: декомпозиция, Facade, Mediator',
          'Spaghetti Code — запутанная логика без структуры. Решение: Strategy, Template Method, State',
          'Golden Hammer — использование любимого паттерна для всех задач. «Когда у тебя молоток, всё кажется гвоздём»',
          'Premature Abstraction — создание абстракций «на будущее». Решение: YAGNI (You Aren\'t Gonna Need It)',
          'Pattern Fever — применение паттерна ради паттерна, а не ради решения проблемы'
        ]},
        { type: 'heading', value: 'Singleton Abuse' },
        { type: 'code', language: 'java', value: '// ❌ Антипаттерн: всё через Singleton\nclass App {\n    void doWork() {\n        Database.getInstance().query("...");\n        Logger.getInstance().log("...");\n        Cache.getInstance().get("key");\n        Config.getInstance().get("setting");\n        // Тестировать невозможно!\n    }\n}\n\n// ✅ Dependency Injection\nclass App {\n    private final Database db;\n    private final Logger logger;\n\n    App(Database db, Logger logger) {\n        this.db = db;\n        this.logger = logger;\n    }\n    // Легко тестировать с mock-объектами\n}' },
        { type: 'heading', value: 'Over-engineering' },
        { type: 'code', language: 'typescript', value: '// ❌ Фабрика + Builder + Strategy для... Hello World\nclass GreeterFactory {\n    static create(type: string): GreeterBuilder {\n        return new ConcreteGreeterBuilder(type);\n    }\n}\n\n// ✅ Просто функция\nfunction greet(name: string): string {\n    return `Hello, ${name}!`;\n}' },
        { type: 'warning', value: 'Лучший код — простой код. Паттерн оправдан только тогда, когда без него код стал бы ещё сложнее. «Простота — это высшая степень мастерства» (Леонардо да Винчи).' }
      ]
    },
    {
      id: 5,
      title: 'Практика: рефакторинг к паттернам',
      type: 'practice',
      difficulty: 'hard',
      description: 'Отрефакторьте «плохой» код, применив подходящие паттерны.',
      requirements: [
        'Исходный код: класс NotificationManager с огромным switch для типов уведомлений',
        'Каждый тип (email, sms, push, slack) имеет свою логику отправки и форматирования',
        'Примените Strategy для выбора канала доставки',
        'Примените Template Method для общего алгоритма отправки',
        'Примените Factory Method для создания нужной стратегии'
      ],
      hint: 'Шаг 1: выделите интерфейс NotificationChannel (Strategy). Шаг 2: создайте базовый класс с шаблоном отправки (Template Method). Шаг 3: фабрика для создания канала по типу.',
      expectedOutput: '📧 [Email] Тема: Добро пожаловать!\n   Тело: Здравствуйте, Иван!\n   Отправлено: user@mail.com\n💬 [Slack] Канал: #general\n   Сообщение: Новый пользователь: Иван\n   Webhook: sent',
      solution: '// Strategy: канал доставки\ninterface NotificationChannel {\n    format(recipient: string, subject: string, body: string): string;\n    send(formatted: string): void;\n    getName(): string;\n}\n\nclass EmailChannel implements NotificationChannel {\n    format(to: string, subject: string, body: string): string {\n        return `📧 [Email] Тема: ${subject}\\n   Тело: ${body}\\n   Отправлено: ${to}`;\n    }\n    send(formatted: string): void { console.log(formatted); }\n    getName(): string { return "email"; }\n}\n\nclass SlackChannel implements NotificationChannel {\n    constructor(private channel: string) {}\n    format(to: string, subject: string, body: string): string {\n        return `💬 [Slack] Канал: ${this.channel}\\n   Сообщение: ${body}\\n   Webhook: sent`;\n    }\n    send(formatted: string): void { console.log(formatted); }\n    getName(): string { return "slack"; }\n}\n\n// Factory Method\nclass ChannelFactory {\n    static create(type: string, config?: any): NotificationChannel {\n        switch (type) {\n            case "email": return new EmailChannel();\n            case "slack": return new SlackChannel(config?.channel || "#general");\n            default: throw new Error(`Unknown channel: ${type}`);\n        }\n    }\n}\n\n// Template Method: общий алгоритм отправки\nabstract class NotificationService {\n    protected abstract getChannel(): NotificationChannel;\n\n    notify(recipient: string, subject: string, body: string): void {\n        const channel = this.getChannel();\n        this.validate(recipient, body);\n        const formatted = channel.format(recipient, subject, body);\n        this.log(channel.getName(), recipient);\n        channel.send(formatted);\n    }\n\n    private validate(recipient: string, body: string): void {\n        if (!recipient || !body) throw new Error("Пустые данные");\n    }\n\n    private log(channel: string, to: string): void {\n        // console.log(`[LOG] ${channel} → ${to}`);\n    }\n}\n\nclass ConfigurableNotificationService extends NotificationService {\n    private channel: NotificationChannel;\n\n    constructor(channelType: string, config?: any) {\n        super();\n        this.channel = ChannelFactory.create(channelType, config);\n    }\n\n    protected getChannel(): NotificationChannel {\n        return this.channel;\n    }\n}\n\n// Использование\nnew ConfigurableNotificationService("email")\n    .notify("user@mail.com", "Добро пожаловать!", "Здравствуйте, Иван!");\n\nnew ConfigurableNotificationService("slack", { channel: "#general" })\n    .notify("team", "Новый пользователь", "Новый пользователь: Иван");',
      explanation: 'Три паттерна решают три проблемы: Strategy (NotificationChannel) инкапсулирует канал доставки. Factory Method (ChannelFactory) создаёт канал по типу. Template Method (NotificationService) фиксирует алгоритм: validate → format → log → send.'
    },
    {
      id: 6,
      title: 'Практика: мини-фреймворк на паттернах',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте мини-веб-фреймворк, комбинирующий несколько паттернов.',
      requirements: [
        'Router — Chain of Responsibility (маршрутизация)',
        'Middleware — Decorator (логирование, аутентификация)',
        'Controller — Template Method (обработка запроса)',
        'DI Container — Singleton + Factory (управление зависимостями)',
        'Демонстрация: GET /users → middleware → controller → response'
      ],
      hint: 'Router.match(url, method) находит обработчик. Middleware оборачивает handler. Controller.handle() — шаблонный метод: parseRequest → process → formatResponse.',
      expectedOutput: '[Logger] GET /api/users\n[Auth] Token verified\n[UsersController] Получение списка пользователей\n[Response] 200 OK: [{"id":1,"name":"Иван"}]',
      solution: '// DI Container (Singleton + Factory)\nclass Container {\n    private static instance: Container;\n    private services = new Map<string, any>();\n\n    static getInstance(): Container {\n        if (!Container.instance) Container.instance = new Container();\n        return Container.instance;\n    }\n\n    register<T>(name: string, factory: () => T): void {\n        this.services.set(name, factory());\n    }\n\n    get<T>(name: string): T {\n        return this.services.get(name);\n    }\n}\n\n// Middleware (Decorator)\ntype Handler = (req: any) => any;\ntype Middleware = (handler: Handler) => Handler;\n\nconst logger: Middleware = (next) => (req) => {\n    console.log(`[Logger] ${req.method} ${req.url}`);\n    return next(req);\n};\n\nconst auth: Middleware = (next) => (req) => {\n    console.log("[Auth] Token verified");\n    req.user = { id: 1, role: "admin" };\n    return next(req);\n};\n\n// Controller (Template Method)\nabstract class Controller {\n    handle(req: any): any {\n        this.parseRequest(req);\n        const data = this.process(req);\n        return this.formatResponse(data);\n    }\n\n    protected parseRequest(req: any): void {}\n    protected abstract process(req: any): any;\n    protected formatResponse(data: any): any {\n        console.log(`[Response] 200 OK: ${JSON.stringify(data)}`);\n        return { status: 200, body: data };\n    }\n}\n\nclass UsersController extends Controller {\n    protected process(req: any): any {\n        console.log("[UsersController] Получение списка пользователей");\n        return [{ id: 1, name: "Иван" }];\n    }\n}\n\n// Router (Chain of Responsibility)\nclass Router {\n    private routes: { method: string; path: string; handler: Handler }[] = [];\n\n    get(path: string, handler: Handler): void {\n        this.routes.push({ method: "GET", path, handler });\n    }\n\n    post(path: string, handler: Handler): void {\n        this.routes.push({ method: "POST", path, handler });\n    }\n\n    dispatch(req: { method: string; url: string }): any {\n        for (const route of this.routes) {\n            if (route.method === req.method && route.path === req.url) {\n                return route.handler(req);\n            }\n        }\n        return { status: 404, body: "Not Found" };\n    }\n}\n\n// Сборка фреймворка\nconst container = Container.getInstance();\ncontainer.register("usersController", () => new UsersController());\n\nconst router = new Router();\n\nconst usersHandler: Handler = (req) => {\n    const ctrl = container.get<UsersController>("usersController");\n    return ctrl.handle(req);\n};\n\n// Применяем middleware (Decorator chain)\nconst pipeline = logger(auth(usersHandler));\nrouter.get("/api/users", pipeline);\n\n// Запрос\nrouter.dispatch({ method: "GET", url: "/api/users" });',
      explanation: 'Мини-фреймворк комбинирует 4 паттерна: Container (Singleton + Factory) управляет зависимостями. Middleware (Decorator) добавляет logger и auth. Controller (Template Method) фиксирует parse → process → format. Router (CoR) находит обработчик. Это упрощённая модель Express/NestJS/Spring MVC.'
    }
  ]
}
