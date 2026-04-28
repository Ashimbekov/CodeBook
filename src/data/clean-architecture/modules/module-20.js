export default {
  id: 20,
  title: 'SOLID в контексте архитектуры',
  description: 'Принципы SOLID на уровне архитектуры: SRP для модулей, OCP для расширения, LSP для подменяемости, ISP и DIP для слоёв.',
  lessons: [
    {
      id: 1,
      title: 'SRP: Single Responsibility на уровне модулей',
      type: 'theory',
      content: [
        { type: 'text', value: 'SRP на уровне архитектуры: каждый модуль/компонент должен иметь одну причину для изменения. На уровне классов это означает одну ответственность, на уровне модулей — одну бизнес-область.' },
        { type: 'heading', value: 'SRP для классов' },
        { type: 'code', language: 'java', value: '// Нарушение SRP: два повода для изменения\npublic class UserService {\n    public void registerUser(UserDto dto) { ... }  // бизнес-логика\n    public String formatUserReport(User user) { ... } // форматирование\n}\n\n// Решение: разделить ответственности\npublic class UserRegistrationUseCase {\n    public void execute(RegisterUserCommand cmd) { ... }\n}\n\npublic class UserReportFormatter {\n    public String format(User user) { ... }\n}' },
        { type: 'heading', value: 'SRP для модулей' },
        { type: 'text', value: 'Модуль Ordering отвечает за заказы. Если нужно изменить логику расчёта скидок — изменяется модуль Pricing. Если нужно изменить способ доставки — модуль Shipping. Каждый модуль меняется по одной причине.' },
        { type: 'heading', value: 'Как определить нарушение SRP' },
        { type: 'list', value: [
          'Модуль меняется по нескольким бизнес-причинам',
          'Разные стейкхолдеры просят изменения в одном модуле',
          'При изменении бизнес-правила нужно менять несколько несвязанных частей'
        ]},
        { type: 'tip', value: 'Роберт Мартин уточняет: SRP — не "одна функция", а "одна причина для изменения" или "один актёр (стейкхолдер), для которого модуль работает".' }
      ]
    },
    {
      id: 2,
      title: 'OCP: Open/Closed для расширяемости',
      type: 'theory',
      content: [
        { type: 'text', value: 'OCP (Open/Closed Principle): модуль открыт для расширения, закрыт для модификации. Добавление нового поведения не должно требовать изменения существующего кода.' },
        { type: 'code', language: 'java', value: '// Нарушение OCP: добавление нового типа уведомления требует изменения класса\npublic class NotificationService {\n    public void send(String type, String message, String recipient) {\n        switch (type) {\n            case "email" -> sendEmail(message, recipient);\n            case "sms" -> sendSms(message, recipient);\n            // Для добавления push нужно менять этот класс!\n        }\n    }\n}\n\n// Соблюдение OCP: расширение через интерфейс\npublic interface NotificationChannel {\n    boolean supports(String type);\n    void send(String message, String recipient);\n}\n\npublic class EmailChannel implements NotificationChannel {\n    public boolean supports(String type) { return "email".equals(type); }\n    public void send(String message, String recipient) { /* email */ }\n}\n\npublic class SmsChannel implements NotificationChannel {\n    public boolean supports(String type) { return "sms".equals(type); }\n    public void send(String message, String recipient) { /* sms */ }\n}\n\n// Новый канал — просто новый класс, без изменения существующих!\npublic class PushChannel implements NotificationChannel {\n    public boolean supports(String type) { return "push".equals(type); }\n    public void send(String message, String recipient) { /* push */ }\n}\n\npublic class NotificationService {\n    private final List<NotificationChannel> channels;\n    \n    public void send(String type, String message, String recipient) {\n        channels.stream()\n            .filter(ch -> ch.supports(type))\n            .findFirst()\n            .orElseThrow(() -> new UnsupportedChannelException(type))\n            .send(message, recipient);\n    }\n}' },
        { type: 'heading', value: 'OCP на уровне архитектуры' },
        { type: 'text', value: 'Plugins Architecture — система расширяется через подключение новых модулей без модификации ядра. Clean Architecture по своей природе следует OCP: новый адаптер (PostgreSQL → MongoDB) не требует изменения Domain.' },
        { type: 'note', value: 'OCP не означает "никогда не менять код". Это значит, что типичные расширения (новый тип платежа, новый формат отчёта) не должны требовать изменения существующего кода.' }
      ]
    },
    {
      id: 3,
      title: 'LSP: подменяемость и контракты',
      type: 'theory',
      content: [
        { type: 'text', value: 'LSP (Liskov Substitution Principle): подтипы должны быть взаимозаменяемы с базовыми типами. Если система работает с интерфейсом Repository, любая реализация должна работать корректно.' },
        { type: 'code', language: 'java', value: '// Нарушение LSP: подтип меняет поведение\npublic interface Collection<T> {\n    void add(T item);\n    int size();\n}\n\npublic class ReadOnlyCollection<T> implements Collection<T> {\n    @Override\n    public void add(T item) {\n        throw new UnsupportedOperationException(); // НАРУШЕНИЕ LSP!\n        // Код, работающий с Collection, не ожидает исключения при add()\n    }\n}\n\n// Правильно: разделить интерфейсы\npublic interface ReadableCollection<T> {\n    int size();\n    T get(int index);\n}\n\npublic interface WritableCollection<T> extends ReadableCollection<T> {\n    void add(T item);\n}' },
        { type: 'heading', value: 'LSP в Clean Architecture' },
        { type: 'code', language: 'typescript', value: '// LSP: все реализации Repository должны вести себя одинаково\ninterface UserRepository {\n  findById(id: string): Promise<User | null>;\n  save(user: User): Promise<void>;\n}\n\n// PostgreSQL реализация\nclass PgUserRepository implements UserRepository {\n  async findById(id: string): Promise<User | null> {\n    const row = await this.db.query("SELECT * FROM users WHERE id = $1", [id]);\n    return row ? this.toDomain(row) : null; // null если не найден — корректно\n  }\n}\n\n// InMemory реализация для тестов\nclass InMemoryUserRepository implements UserRepository {\n  async findById(id: string): Promise<User | null> {\n    return this.store.get(id) || null; // null если не найден — тоже корректно\n  }\n}\n\n// НАРУШЕНИЕ LSP:\nclass CachedUserRepository implements UserRepository {\n  async findById(id: string): Promise<User | null> {\n    throw new Error("Cache miss"); // НЕПРАВИЛЬНО! Должен вернуть null\n  }\n}' },
        { type: 'warning', value: 'Нарушение LSP в адаптерах — частая проблема. Если InMemoryRepository бросает исключение там, где JpaRepository возвращает null — тесты будут проходить, но продакшен сломается. Соблюдайте контракт!' }
      ]
    },
    {
      id: 4,
      title: 'ISP: разделение интерфейсов',
      type: 'theory',
      content: [
        { type: 'text', value: 'ISP (Interface Segregation Principle): клиент не должен зависеть от методов, которые не использует. Лучше много маленьких интерфейсов, чем один большой.' },
        { type: 'code', language: 'java', value: '// Нарушение ISP: толстый интерфейс\npublic interface UserRepository {\n    User findById(UserId id);\n    User findByEmail(Email email);\n    List<User> findAll();\n    List<User> findByRole(Role role);\n    void save(User user);\n    void delete(UserId id);\n    long count();\n    boolean existsByEmail(Email email);\n    List<User> search(String query, int page, int size);\n}\n\n// Use Case нужен только findById и save, но зависит от ВСЕХ методов\npublic class DeactivateUserUseCase {\n    private final UserRepository repo; // зависит от 9 методов, использует 2\n}' },
        { type: 'heading', value: 'Решение: разделение' },
        { type: 'code', language: 'java', value: '// ISP: разделяем интерфейсы по потребностям\npublic interface UserReader {\n    Optional<User> findById(UserId id);\n    Optional<User> findByEmail(Email email);\n}\n\npublic interface UserWriter {\n    void save(User user);\n    void delete(UserId id);\n}\n\npublic interface UserSearcher {\n    List<User> search(String query, int page, int size);\n    List<User> findByRole(Role role);\n}\n\n// Каждый Use Case зависит только от нужного интерфейса\npublic class DeactivateUserUseCase {\n    private final UserReader reader;  // только чтение\n    private final UserWriter writer;  // только запись\n}\n\npublic class SearchUsersQueryHandler {\n    private final UserSearcher searcher; // только поиск\n}' },
        { type: 'heading', value: 'ISP на уровне модулей' },
        { type: 'text', value: 'Публичный API модуля не должен быть монолитным. Если Ordering нужен только getProduct() из Catalog, он не должен зависеть от updateProduct(), deleteProduct() и т.д.' },
        { type: 'tip', value: 'ISP тесно связан с SRP и минимизацией coupling. Маленький интерфейс = меньше связей = меньше поводов для изменения. CQRS естественно следует ISP — Read и Write отделены.' }
      ]
    },
    {
      id: 5,
      title: 'DIP: инверсия зависимостей — основа Clean Architecture',
      type: 'theory',
      content: [
        { type: 'text', value: 'DIP (Dependency Inversion Principle): модули высокого уровня не должны зависеть от модулей низкого уровня. Оба должны зависеть от абстракций. DIP — фундамент Clean Architecture.' },
        { type: 'code', language: 'java', value: '// Без DIP: бизнес-логика зависит от деталей\npublic class OrderService {                    // высокий уровень\n    private final PostgresOrderDao orderDao;     // зависит от низкого уровня!\n    private final SmtpEmailClient emailClient;   // зависит от низкого уровня!\n}\n\n// С DIP: оба зависят от абстракций\npublic interface OrderRepository {}             // абстракция\npublic interface EmailSender {}                 // абстракция\n\npublic class OrderService {                    // высокий уровень\n    private final OrderRepository repo;         // зависит от абстракции\n    private final EmailSender sender;           // зависит от абстракции\n}\n\npublic class PostgresOrderRepository implements OrderRepository {} // зависит от абстракции\npublic class SmtpEmailSender implements EmailSender {}             // зависит от абстракции' },
        { type: 'heading', value: 'DIP и направление зависимостей в Clean Architecture' },
        { type: 'text', value: 'В классической архитектуре: Controller → Service → Repository → Database. Зависимости сверху вниз.\nВ Clean Architecture с DIP: Controller → UseCase ← Repository Interface. UseCase определяет интерфейс, Repository реализует. Зависимость инвертирована!' },
        { type: 'code', language: 'typescript', value: '// DIP: кто определяет интерфейс?\n\n// БЕЗ DIP: Infrastructure определяет интерфейс\n// Infrastructure/OrderRepository.ts\ninterface OrderRepository {\n  findBySQL(query: string): Promise<any[]>; // детали утекают!\n}\n\n// С DIP: Domain определяет интерфейс\n// Domain/OrderRepository.ts\ninterface OrderRepository {\n  findById(id: OrderId): Promise<Order | null>; // чистый доменный контракт\n  save(order: Order): Promise<void>;\n}\n\n// Infrastructure РЕАЛИЗУЕТ интерфейс Domain\n// Infrastructure/PgOrderRepository.ts\nclass PgOrderRepository implements OrderRepository {\n  async findById(id: OrderId): Promise<Order | null> {\n    // SQL здесь — деталь реализации, скрытая за интерфейсом\n    const row = await this.db.query("SELECT * FROM orders WHERE id = $1", [id.value]);\n    return row ? this.toDomain(row) : null;\n  }\n}' },
        { type: 'note', value: 'DIP — самый важный принцип для Clean Architecture. Без DIP невозможна инверсия зависимостей, а значит Domain будет зависеть от Infrastructure, что нарушает основное правило.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: применение SOLID к архитектуре',
      type: 'practice',
      difficulty: 'medium',
      description: 'Отрефакторьте код платёжной системы, применив все 5 принципов SOLID на архитектурном уровне.',
      requirements: [
        'SRP: разделить PaymentManager на отдельные Use Cases',
        'OCP: добавить новый способ оплаты без изменения существующего кода',
        'LSP: обеспечить взаимозаменяемость реализаций PaymentGateway',
        'ISP: разделить толстый интерфейс PaymentService',
        'DIP: инвертировать зависимость от конкретного шлюза к интерфейсу'
      ],
      hint: 'PaymentManager — God Object. Разбейте на ChargePaymentUseCase, RefundPaymentUseCase. PaymentGateway — интерфейс с реализациями Stripe, PayPal. Новый метод оплаты = новый класс.',
      expectedOutput: 'Код следует SOLID: каждый Use Case — одна ответственность (SRP), новый шлюз — новый класс (OCP), все шлюзы взаимозаменяемы (LSP), интерфейсы маленькие (ISP), Domain не зависит от Infrastructure (DIP).',
      solution: '// SRP: отдельные Use Cases\nclass ChargePaymentUseCase {\n  constructor(private gateway: PaymentGateway, private repo: PaymentRepository) {}\n  async execute(cmd: ChargeCommand): Promise<PaymentResult> {\n    const payment = Payment.initiate(cmd.orderId, cmd.amount);\n    const result = await this.gateway.charge(cmd.amount, cmd.method);\n    payment.complete(result.transactionId);\n    await this.repo.save(payment);\n    return PaymentResult.from(payment);\n  }\n}\n\nclass RefundPaymentUseCase {\n  constructor(private gateway: PaymentGateway, private repo: PaymentRepository) {}\n  async execute(cmd: RefundCommand): Promise<void> {\n    const payment = await this.repo.findById(cmd.paymentId);\n    await this.gateway.refund(payment.transactionId, cmd.amount);\n    payment.refund(cmd.amount);\n    await this.repo.save(payment);\n  }\n}\n\n// OCP + LSP: интерфейс PaymentGateway, реализации взаимозаменяемы\ninterface PaymentGateway {\n  charge(amount: Money, method: PaymentMethod): Promise<ChargeResult>;\n  refund(transactionId: string, amount: Money): Promise<RefundResult>;\n}\n\nclass StripeGateway implements PaymentGateway {\n  async charge(amount: Money, method: PaymentMethod): Promise<ChargeResult> {\n    const intent = await this.stripe.paymentIntents.create({ amount: amount.cents() });\n    return { transactionId: intent.id, success: true };\n  }\n  async refund(txnId: string, amount: Money): Promise<RefundResult> {\n    await this.stripe.refunds.create({ payment_intent: txnId });\n    return { success: true };\n  }\n}\n\n// OCP: новый шлюз — просто новый класс!\nclass PayPalGateway implements PaymentGateway {\n  async charge(amount: Money, method: PaymentMethod): Promise<ChargeResult> { /* PayPal API */ }\n  async refund(txnId: string, amount: Money): Promise<RefundResult> { /* PayPal API */ }\n}\n\n// ISP: разделённые интерфейсы\ninterface PaymentReader {\n  findById(id: PaymentId): Promise<Payment | null>;\n  findByOrder(orderId: OrderId): Promise<Payment[]>;\n}\ninterface PaymentWriter {\n  save(payment: Payment): Promise<void>;\n}\n\n// DIP: Domain определяет интерфейс, Infrastructure реализует\n// domain/PaymentGateway.ts — интерфейс\n// infrastructure/StripeGateway.ts — реализация',
      explanation: 'SRP: PaymentManager разбит на ChargePaymentUseCase и RefundPaymentUseCase. OCP: добавление PayPalGateway не требует изменения существующего кода. LSP: Stripe и PayPal взаимозаменяемы через PaymentGateway. ISP: PaymentReader и PaymentWriter разделены. DIP: PaymentGateway — интерфейс в Domain, реализации — в Infrastructure.'
    }
  ]
}
