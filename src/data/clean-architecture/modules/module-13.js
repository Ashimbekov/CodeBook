export default {
  id: 13,
  title: 'Слой Infrastructure',
  description: 'Infrastructure-слой: реализации репозиториев, ORM-маппинг, внешние сервисы, persistence и конфигурация.',
  lessons: [
    {
      id: 1,
      title: 'Роль Infrastructure-слоя',
      type: 'theory',
      content: [
        { type: 'text', value: 'Infrastructure-слой реализует все технические детали: работу с БД, внешние API, файловую систему, email-сервисы. Он реализует интерфейсы, определённые в Domain и Application слоях.' },
        { type: 'heading', value: 'Что содержит Infrastructure' },
        { type: 'list', value: [
          'Реализации репозиториев (JPA, TypeORM, Prisma, JDBC)',
          'ORM-сущности и маппинг Domain ↔ ORM',
          'Клиенты внешних API (REST, gRPC, SOAP)',
          'Реализации отправки email, SMS, push-уведомлений',
          'Работа с файловой системой и облачными хранилищами',
          'Конфигурация DI-контейнера (Composition Root)',
          'Миграции БД'
        ]},
        { type: 'heading', value: 'Принцип: зависимости направлены внутрь' },
        { type: 'text', value: 'Infrastructure зависит от Domain (реализует его интерфейсы). Domain НЕ зависит от Infrastructure. Это ключевое правило Clean Architecture.' },
        { type: 'code', language: 'java', value: '// Domain-слой определяет интерфейс (не знает о JPA)\npublic interface UserRepository {\n    Optional<User> findById(UserId id);\n    Optional<User> findByEmail(Email email);\n    void save(User user);\n    boolean existsByEmail(Email email);\n}\n\n// Infrastructure-слой реализует (знает о JPA)\n@Repository\npublic class JpaUserRepository implements UserRepository {\n    private final JpaUserEntityRepository jpaRepo;\n    private final UserMapper mapper;\n    \n    @Override\n    public Optional<User> findById(UserId id) {\n        return jpaRepo.findById(id.value()).map(mapper::toDomain);\n    }\n    \n    @Override\n    public void save(User user) {\n        UserJpaEntity entity = mapper.toJpa(user);\n        jpaRepo.save(entity);\n    }\n}' },
        { type: 'tip', value: 'Хороший тест: удалите весь Infrastructure-слой. Domain и Application должны компилироваться без единой ошибки. Если не компилируются — зависимости нарушены.' }
      ]
    },
    {
      id: 2,
      title: 'ORM Entity vs Domain Entity: маппинг',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Clean Architecture доменная модель и модель хранения — разные объекты. ORM Entity (с аннотациями @Entity, @Column) живёт в Infrastructure. Domain Entity (с бизнес-логикой) — в Domain.' },
        { type: 'code', language: 'java', value: '// Domain Entity — чистый объект с бизнес-логикой\npublic class Order {\n    private OrderId id;\n    private CustomerId customerId;\n    private List<OrderLine> lines;\n    private OrderStatus status;\n    private Money total;\n    \n    public void addLine(ProductId productId, int qty, Money price) { ... }\n    public void cancel(String reason) { ... }\n}\n\n// ORM Entity — для JPA/Hibernate\n@Entity\n@Table(name = "orders")\npublic class OrderJpaEntity {\n    @Id\n    private UUID id;\n    \n    @Column(name = "customer_id")\n    private UUID customerId;\n    \n    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)\n    private List<OrderLineJpaEntity> lines;\n    \n    @Enumerated(EnumType.STRING)\n    private String status;\n    \n    @Column(name = "total_amount")\n    private BigDecimal totalAmount;\n    \n    @Column(name = "total_currency")\n    private String totalCurrency;\n    \n    // Только геттеры/сеттеры — никакой бизнес-логики!\n}' },
        { type: 'heading', value: 'Mapper между моделями' },
        { type: 'code', language: 'java', value: '// Mapper: преобразование Domain <-> ORM\n@Component\npublic class OrderMapper {\n    \n    public Order toDomain(OrderJpaEntity entity) {\n        List<OrderLine> lines = entity.getLines().stream()\n            .map(this::lineToDomain)\n            .toList();\n        \n        return Order.reconstitute(\n            new OrderId(entity.getId()),\n            new CustomerId(entity.getCustomerId()),\n            lines,\n            OrderStatus.valueOf(entity.getStatus()),\n            Money.of(entity.getTotalAmount(), entity.getTotalCurrency())\n        );\n    }\n    \n    public OrderJpaEntity toJpa(Order domain) {\n        OrderJpaEntity entity = new OrderJpaEntity();\n        entity.setId(domain.id().value());\n        entity.setCustomerId(domain.customerId().value());\n        entity.setLines(domain.lines().stream()\n            .map(this::lineToJpa)\n            .toList());\n        entity.setStatus(domain.status().name());\n        entity.setTotalAmount(domain.total().amount());\n        entity.setTotalCurrency(domain.total().currency().code());\n        return entity;\n    }\n}' },
        { type: 'warning', value: 'Не используйте @Entity аннотации на доменных объектах! Это связывает домен с JPA. Если вы видите @Entity на Domain Entity — архитектура нарушена. Создайте отдельный JPA Entity в Infrastructure.' }
      ]
    },
    {
      id: 3,
      title: 'Реализация внешних сервисов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Внешние сервисы (email, платежи, SMS, API третьих сторон) реализуются в Infrastructure-слое через адаптеры к интерфейсам из Domain/Application.' },
        { type: 'code', language: 'typescript', value: '// Интерфейс в Domain/Application\ninterface PaymentGateway {\n  charge(amount: Money, paymentMethodId: string): Promise<PaymentResult>;\n  refund(transactionId: string, amount: Money): Promise<RefundResult>;\n}\n\ninterface NotificationSender {\n  sendOrderConfirmation(email: string, orderId: string): Promise<void>;\n  sendShippingUpdate(email: string, trackingNumber: string): Promise<void>;\n}\n\n// Реализация: Stripe Payment Gateway\nclass StripePaymentGateway implements PaymentGateway {\n  private stripe: Stripe;\n\n  constructor(apiKey: string) {\n    this.stripe = new Stripe(apiKey);\n  }\n\n  async charge(amount: Money, paymentMethodId: string): Promise<PaymentResult> {\n    try {\n      const intent = await this.stripe.paymentIntents.create({\n        amount: amount.toCents(),\n        currency: amount.currency.toLowerCase(),\n        payment_method: paymentMethodId,\n        confirm: true,\n      });\n      return PaymentResult.success(intent.id);\n    } catch (error) {\n      return PaymentResult.failed(error.message);\n    }\n  }\n\n  async refund(transactionId: string, amount: Money): Promise<RefundResult> {\n    const refund = await this.stripe.refunds.create({\n      payment_intent: transactionId,\n      amount: amount.toCents(),\n    });\n    return RefundResult.success(refund.id);\n  }\n}\n\n// Реализация: SendGrid Email\nclass SendGridNotificationSender implements NotificationSender {\n  constructor(private apiKey: string) {}\n\n  async sendOrderConfirmation(email: string, orderId: string): Promise<void> {\n    await sendgrid.send({\n      to: email,\n      from: "shop@example.com",\n      templateId: "d-order-confirmation",\n      dynamicTemplateData: { orderId },\n    });\n  }\n}' },
        { type: 'heading', value: 'Fake-реализации для тестов' },
        { type: 'code', language: 'typescript', value: '// Fake для тестов — не отправляет реальные email\nclass FakeNotificationSender implements NotificationSender {\n  sent: { email: string; orderId: string }[] = [];\n\n  async sendOrderConfirmation(email: string, orderId: string): Promise<void> {\n    this.sent.push({ email, orderId });\n  }\n\n  async sendShippingUpdate(): Promise<void> {\n    // ничего не делаем\n  }\n}\n\n// В тесте\nconst fakeNotifier = new FakeNotificationSender();\nconst useCase = new PlaceOrderUseCase(repo, paymentGw, fakeNotifier);\nawait useCase.execute(command);\nassert(fakeNotifier.sent.length === 1);' },
        { type: 'note', value: 'Благодаря интерфейсам в Domain слое, мы можем использовать FakePaymentGateway в тестах и StripePaymentGateway в продакшене. Domain не знает, какая реализация используется.' }
      ]
    },
    {
      id: 4,
      title: 'Конфигурация и Composition Root',
      type: 'theory',
      content: [
        { type: 'text', value: 'Composition Root — единственное место в приложении, где все зависимости соединяются вместе. Это точка входа, где конкретные реализации привязываются к интерфейсам.' },
        { type: 'code', language: 'java', value: '// Spring Boot: Composition Root через @Configuration\n@Configuration\npublic class ApplicationConfig {\n    \n    @Bean\n    public PlaceOrderUseCase placeOrderUseCase(\n        OrderRepository orderRepo,\n        ProductRepository productRepo,\n        PaymentGateway paymentGateway,\n        NotificationSender notificationSender\n    ) {\n        return new PlaceOrderUseCase(\n            orderRepo, productRepo, paymentGateway, notificationSender\n        );\n    }\n    \n    @Bean\n    public OrderRepository orderRepository(EntityManager em, OrderMapper mapper) {\n        return new JpaOrderRepository(em, mapper);\n    }\n    \n    @Bean\n    public PaymentGateway paymentGateway(@Value("${stripe.api-key}") String apiKey) {\n        return new StripePaymentGateway(apiKey);\n    }\n    \n    @Bean\n    public NotificationSender notificationSender(\n        @Value("${sendgrid.api-key}") String apiKey\n    ) {\n        return new SendGridNotificationSender(apiKey);\n    }\n}' },
        { type: 'code', language: 'typescript', value: '// TypeScript: Composition Root вручную\nfunction createApp(): Application {\n  // Infrastructure\n  const db = new PostgresPool(process.env.DATABASE_URL!);\n  const stripe = new StripePaymentGateway(process.env.STRIPE_KEY!);\n  const emailSender = new SendGridNotificationSender(process.env.SENDGRID_KEY!);\n  \n  // Repositories\n  const orderRepo = new PostgresOrderRepository(db);\n  const productRepo = new PostgresProductRepository(db);\n  const userRepo = new PostgresUserRepository(db);\n  \n  // Use Cases\n  const placeOrder = new PlaceOrderUseCase(orderRepo, productRepo, stripe, emailSender);\n  const getOrders = new GetOrdersQueryHandler(db); // Read Model — прямой SQL\n  \n  // Controllers\n  const orderController = new OrderController(placeOrder, getOrders);\n  \n  // Router\n  const router = new Router();\n  router.post("/orders", orderController.create.bind(orderController));\n  router.get("/orders", orderController.list.bind(orderController));\n  \n  return new Application(router);\n}' },
        { type: 'tip', value: 'Composition Root — единственное место, которое знает обо всех классах. Все остальные модули знают только об интерфейсах. Это обеспечивает максимальный декуплинг.' }
      ]
    },
    {
      id: 5,
      title: 'Работа с конфигурацией и секретами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Конфигурация (URL БД, API-ключи, порты) — часть Infrastructure. Domain и Application не должны знать о переменных окружения или конфигурационных файлах.' },
        { type: 'code', language: 'java', value: '// ПЛОХО: Domain знает о конфигурации\npublic class PricingService {\n    public Money calculateDiscount(Order order) {\n        // Domain не должен читать environment variables!\n        double rate = Double.parseDouble(System.getenv("DISCOUNT_RATE"));\n        return order.total().multiply(rate);\n    }\n}\n\n// ХОРОШО: конфигурация инжектится извне\npublic class PricingService {\n    private final DiscountPolicy discountPolicy;\n    \n    public PricingService(DiscountPolicy discountPolicy) {\n        this.discountPolicy = discountPolicy;\n    }\n    \n    public Money calculateDiscount(Order order) {\n        Percentage rate = discountPolicy.rateFor(order.customer());\n        return order.total().multiply(rate);\n    }\n}\n\n// Infrastructure: конфигурация из env\n@Configuration\npublic class PricingConfig {\n    @Bean\n    public DiscountPolicy discountPolicy(\n        @Value("${pricing.default-discount-rate}") double rate\n    ) {\n        return new ConfigurableDiscountPolicy(Percentage.of(rate));\n    }\n}' },
        { type: 'heading', value: 'Управление секретами' },
        { type: 'list', value: [
          'Никогда не хардкодьте секреты в коде',
          'Используйте переменные окружения или Vault',
          'Инжектируйте конфигурацию через Composition Root',
          'Domain и Application не знают, откуда пришла конфигурация'
        ]},
        { type: 'note', value: 'Конфигурация — это деталь реализации, как и БД. Domain работает с абстракциями (DiscountPolicy), не с конкретными значениями из env.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Infrastructure-слой',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Infrastructure-слой для блог-платформы: репозиторий статей, email-сервис и Composition Root.',
      requirements: [
        'Создать ORM Entity: ArticleJpaEntity с аннотациями',
        'Реализовать маппинг Domain Article <-> JPA Entity',
        'Реализовать JpaArticleRepository через маппер',
        'Создать FakeEmailSender для тестов',
        'Настроить Composition Root, связывающий все зависимости'
      ],
      hint: 'Domain Article — чистый объект с бизнес-логикой (publish(), archive()). JPA Entity — объект с аннотациями для ORM. Mapper преобразует между ними. Composition Root собирает всё вместе.',
      expectedOutput: 'Infrastructure-слой полностью изолирован от Domain. JPA Entity отдельно от Domain Entity. Repository реализует доменный интерфейс. Composition Root связывает всё.',
      solution: '// === DOMAIN (уже существует) ===\n// Article, ArticleId, ArticleRepository (интерфейс)\n\n// === INFRASTRUCTURE ===\n\n// ORM Entity\n@Entity\n@Table(name = "articles")\npublic class ArticleJpaEntity {\n    @Id\n    private UUID id;\n    \n    @Column(nullable = false)\n    private String title;\n    \n    @Column(columnDefinition = "TEXT")\n    private String content;\n    \n    @Column(name = "author_id")\n    private UUID authorId;\n    \n    @Column\n    private String status;\n    \n    @Column(name = "published_at")\n    private Instant publishedAt;\n    \n    // геттеры/сеттеры\n}\n\n// Mapper\npublic class ArticleMapper {\n    public Article toDomain(ArticleJpaEntity entity) {\n        return Article.reconstitute(\n            new ArticleId(entity.getId()),\n            entity.getTitle(),\n            entity.getContent(),\n            new AuthorId(entity.getAuthorId()),\n            ArticleStatus.valueOf(entity.getStatus()),\n            entity.getPublishedAt()\n        );\n    }\n    \n    public ArticleJpaEntity toJpa(Article domain) {\n        ArticleJpaEntity e = new ArticleJpaEntity();\n        e.setId(domain.id().value());\n        e.setTitle(domain.title());\n        e.setContent(domain.content());\n        e.setAuthorId(domain.authorId().value());\n        e.setStatus(domain.status().name());\n        e.setPublishedAt(domain.publishedAt());\n        return e;\n    }\n}\n\n// Repository Implementation\npublic class JpaArticleRepository implements ArticleRepository {\n    private final EntityManager em;\n    private final ArticleMapper mapper;\n    \n    public Optional<Article> findById(ArticleId id) {\n        ArticleJpaEntity entity = em.find(ArticleJpaEntity.class, id.value());\n        return Optional.ofNullable(entity).map(mapper::toDomain);\n    }\n    \n    public void save(Article article) {\n        em.merge(mapper.toJpa(article));\n    }\n}\n\n// Fake Email\npublic class FakeEmailSender implements EmailSender {\n    public List<SentEmail> sentEmails = new ArrayList<>();\n    \n    public void send(String to, String subject, String body) {\n        sentEmails.add(new SentEmail(to, subject, body));\n    }\n}\n\n// Composition Root\n@Configuration\npublic class AppConfig {\n    @Bean\n    public ArticleRepository articleRepo(EntityManager em) {\n        return new JpaArticleRepository(em, new ArticleMapper());\n    }\n    \n    @Bean\n    public PublishArticleUseCase publishArticle(ArticleRepository repo, EmailSender email) {\n        return new PublishArticleUseCase(repo, email);\n    }\n}',
      explanation: 'ArticleJpaEntity содержит ORM-аннотации и живёт в Infrastructure. Domain Article — чистый объект без зависимостей. ArticleMapper преобразует между ними. JpaArticleRepository реализует доменный интерфейс, используя маппер. FakeEmailSender позволяет тестировать без реального email. Composition Root (AppConfig) связывает все зависимости.'
    }
  ]
}
