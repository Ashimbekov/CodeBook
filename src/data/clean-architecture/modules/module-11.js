export default {
  id: 11,
  title: 'Слой Domain',
  description: 'Детальное проектирование доменного слоя: entities, value objects, бизнес-правила, доменные исключения и инварианты.',
  lessons: [
    {
      id: 1,
      title: 'Структура доменного слоя',
      type: 'theory',
      content: [
        { type: 'text', value: 'Доменный слой — ядро приложения. Здесь живёт вся бизнес-логика: сущности, объекты-значения, доменные сервисы, события и интерфейсы репозиториев.' },
        { type: 'heading', value: 'Структура папок' },
        { type: 'code', language: 'java', value: 'domain/\n├── model/                    # Доменные объекты\n│   ├── order/\n│   │   ├── Order.java        # Aggregate Root\n│   │   ├── OrderLine.java    # Entity внутри агрегата\n│   │   ├── OrderId.java      # Value Object (ID)\n│   │   └── OrderStatus.java  # Enum\n│   └── product/\n│       ├── Product.java\n│       ├── ProductId.java\n│       └── Price.java        # Value Object\n├── valueobject/              # Общие Value Objects\n│   ├── Money.java\n│   ├── Email.java\n│   └── DateRange.java\n├── service/                  # Domain Services\n│   ├── PricingService.java\n│   └── DiscountCalculator.java\n├── event/                    # Domain Events\n│   ├── OrderPlacedEvent.java\n│   └── OrderCancelledEvent.java\n├── exception/                # Доменные исключения\n│   ├── InsufficientFundsException.java\n│   └── OrderNotEditableException.java\n├── repository/               # Интерфейсы репозиториев\n│   ├── OrderRepository.java\n│   └── ProductRepository.java\n└── specification/            # Спецификации\n    └── PremiumCustomerSpec.java' },
        { type: 'heading', value: 'Правила доменного слоя' },
        { type: 'list', value: [
          'Нулевые зависимости от внешних фреймворков (Spring, JPA, Express)',
          'Только доменные типы: никаких String для email, int для денег',
          'Бизнес-логика ВНУТРИ объектов, а не в сервисах',
          'Всё валидируется при создании: невалидный объект невозможен'
        ]},
        { type: 'tip', value: 'Тест на качество Domain слоя: уберите все внешние слои (Spring, JPA, HTTP). Если доменный слой компилируется и тесты проходят — он правильно изолирован.' }
      ]
    },
    {
      id: 2,
      title: 'Rich Domain Model vs Anemic Domain Model',
      type: 'theory',
      content: [
        { type: 'text', value: 'Rich Domain Model (богатая модель) содержит и данные, и поведение. Anemic Domain Model (анемичная модель) — это DTO с геттерами/сеттерами, а логика размазана по сервисам. Мартин Фаулер называет Anemic Model anti-pattern.' },
        { type: 'heading', value: 'Anemic Domain Model (anti-pattern)' },
        { type: 'code', language: 'java', value: '// ПЛОХО: Anemic Domain Model — Entity без логики\npublic class Order {\n    private Long id;\n    private Long customerId;\n    private List<OrderLine> lines;\n    private BigDecimal total;\n    private String status;\n    \n    // Только геттеры и сеттеры — никакой логики!\n    public void setStatus(String status) { this.status = status; }\n    public void setTotal(BigDecimal total) { this.total = total; }\n}\n\n// Логика размазана по сервису\npublic class OrderService {\n    public void cancelOrder(Order order) {\n        if (order.getStatus().equals("SHIPPED")) {\n            throw new RuntimeException("Cannot cancel shipped order");\n        }\n        order.setStatus("CANCELLED");\n        // Кто угодно может вызвать order.setStatus() напрямую\n        // и обойти проверку!\n    }\n}' },
        { type: 'heading', value: 'Rich Domain Model (правильный подход)' },
        { type: 'code', language: 'java', value: '// ХОРОШО: Rich Domain Model — Entity с логикой\npublic class Order {\n    private OrderId id;\n    private CustomerId customerId;\n    private List<OrderLine> lines;\n    private Money total;\n    private OrderStatus status;\n    \n    // Нет публичных сеттеров! Изменения только через бизнес-методы\n    \n    public void cancel(String reason) {\n        if (this.status == OrderStatus.SHIPPED) {\n            throw new CannotCancelShippedException(this.id);\n        }\n        if (this.status == OrderStatus.CANCELLED) {\n            throw new AlreadyCancelledException(this.id);\n        }\n        this.status = OrderStatus.CANCELLED;\n        raise(new OrderCancelledEvent(this.id, reason));\n    }\n    \n    public void addLine(ProductId productId, int qty, Money price) {\n        if (this.status != OrderStatus.DRAFT) {\n            throw new OrderNotEditableException(this.id);\n        }\n        this.lines.add(new OrderLine(productId, qty, price));\n        recalculateTotal();\n    }\n}' },
        { type: 'warning', value: 'Anemic Domain Model — самый распространённый anti-pattern. Если ваши Entity — это классы с геттерами/сеттерами и без бизнес-логики, а вся логика в Service — это анемичная модель.' }
      ]
    },
    {
      id: 3,
      title: 'Доменные исключения и инварианты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Инвариант — условие, которое ВСЕГДА должно быть истинным для доменного объекта. Нарушение инварианта означает, что объект в невалидном состоянии. Доменные исключения сигнализируют о нарушении бизнес-правил.' },
        { type: 'heading', value: 'Доменные исключения' },
        { type: 'code', language: 'java', value: '// Базовый класс доменных исключений\npublic abstract class DomainException extends RuntimeException {\n    private final String code;\n    \n    protected DomainException(String code, String message) {\n        super(message);\n        this.code = code;\n    }\n    \n    public String code() { return code; }\n}\n\n// Конкретные доменные исключения\npublic class InsufficientFundsException extends DomainException {\n    public InsufficientFundsException(Money balance, Money requested) {\n        super("INSUFFICIENT_FUNDS",\n            "На счёте %s, запрошено %s".formatted(balance, requested));\n    }\n}\n\npublic class OrderNotEditableException extends DomainException {\n    public OrderNotEditableException(OrderId orderId) {\n        super("ORDER_NOT_EDITABLE",\n            "Заказ %s нельзя редактировать в текущем статусе".formatted(orderId));\n    }\n}' },
        { type: 'heading', value: 'Защита инвариантов' },
        { type: 'code', language: 'java', value: '// Инварианты проверяются при каждом изменении\npublic class Auction {\n    private AuctionId id;\n    private Money startingPrice;\n    private Money currentBid;\n    private AuctionStatus status;\n    private Instant endTime;\n    \n    // Инвариант: ставка должна быть выше текущей\n    public void placeBid(UserId bidderId, Money bidAmount) {\n        // Проверка инвариантов\n        ensureAuctionIsActive();\n        ensureBidIsHigherThanCurrent(bidAmount);\n        ensureAuctionNotExpired();\n        \n        this.currentBid = bidAmount;\n        raise(new BidPlacedEvent(this.id, bidderId, bidAmount));\n    }\n    \n    private void ensureAuctionIsActive() {\n        if (this.status != AuctionStatus.ACTIVE) {\n            throw new AuctionNotActiveException(this.id);\n        }\n    }\n    \n    private void ensureBidIsHigherThanCurrent(Money bidAmount) {\n        Money minimumBid = this.currentBid != null \n            ? this.currentBid.add(Money.of(1, "RUB")) \n            : this.startingPrice;\n        if (bidAmount.isLessThan(minimumBid)) {\n            throw new BidTooLowException(bidAmount, minimumBid);\n        }\n    }\n    \n    private void ensureAuctionNotExpired() {\n        if (Instant.now().isAfter(this.endTime)) {\n            throw new AuctionExpiredException(this.id);\n        }\n    }\n}' },
        { type: 'note', value: 'Объект домена должен быть ВСЕГДА валидным. Если конструктор не выбросил исключение — объект гарантированно в корректном состоянии. Это называется "Always Valid" подход.' }
      ]
    },
    {
      id: 4,
      title: 'Типизированные ID и Primitive Obsession',
      type: 'theory',
      content: [
        { type: 'text', value: 'Primitive Obsession — анти-паттерн, когда для доменных понятий используются примитивные типы (String, int, long). Вместо этого нужно создавать типизированные Value Objects.' },
        { type: 'heading', value: 'Проблема примитивов' },
        { type: 'code', language: 'java', value: '// ПЛОХО: Primitive Obsession\npublic class OrderService {\n    // Все параметры — String. Легко перепутать!\n    public void transfer(String fromAccountId, String toAccountId, double amount) {\n        // Можно случайно передать email вместо accountId\n        // Можно передать отрицательную сумму\n    }\n}\n\n// Вызов: легко перепутать параметры\nservice.transfer(toAccountId, fromAccountId, amount); // аргументы перепутаны!' },
        { type: 'heading', value: 'Решение: типизированные ID' },
        { type: 'code', language: 'java', value: '// ХОРОШО: типизированные Value Objects\npublic record OrderId(UUID value) {\n    public OrderId {\n        Objects.requireNonNull(value, "OrderId не может быть null");\n    }\n    public static OrderId generate() {\n        return new OrderId(UUID.randomUUID());\n    }\n    public static OrderId of(String value) {\n        return new OrderId(UUID.fromString(value));\n    }\n}\n\npublic record AccountId(UUID value) {\n    public AccountId {\n        Objects.requireNonNull(value, "AccountId не может быть null");\n    }\n}\n\n// Теперь компилятор не позволит перепутать\npublic class TransferService {\n    public void transfer(AccountId from, AccountId to, Money amount) {\n        // Нельзя передать OrderId вместо AccountId — ошибка компиляции!\n        // Нельзя передать отрицательную сумму — Money валидирует\n    }\n}' },
        { type: 'code', language: 'typescript', value: '// Типизированные ID в TypeScript (branded types)\ntype OrderId = string & { readonly __brand: "OrderId" };\ntype CustomerId = string & { readonly __brand: "CustomerId" };\n\nfunction createOrderId(value: string): OrderId {\n  if (!value.match(/^ord_[a-z0-9]+$/)) {\n    throw new Error("Некорректный формат OrderId");\n  }\n  return value as OrderId;\n}\n\n// Или через класс\nclass OrderId {\n  private constructor(readonly value: string) {}\n  static create(): OrderId { return new OrderId(`ord_${crypto.randomUUID()}`); }\n  static from(value: string): OrderId {\n    if (!value.startsWith("ord_")) throw new Error("Invalid OrderId");\n    return new OrderId(value);\n  }\n  equals(other: OrderId): boolean { return this.value === other.value; }\n}' },
        { type: 'tip', value: 'В Java используйте record для Value Objects — они автоматически immutable и с equals/hashCode. В TypeScript используйте branded types или классы с private constructor.' }
      ]
    },
    {
      id: 5,
      title: 'Паттерн State Machine в домене',
      type: 'theory',
      content: [
        { type: 'text', value: 'Многие доменные объекты имеют жизненный цикл с состояниями и переходами. State Machine (конечный автомат) формализует допустимые переходы и защищает инварианты.' },
        { type: 'code', language: 'java', value: '// Order с формальной State Machine\npublic class Order extends AggregateRoot {\n    private OrderId id;\n    private OrderStatus status;\n    \n    // Определяем допустимые переходы\n    private static final Map<OrderStatus, Set<OrderStatus>> TRANSITIONS = Map.of(\n        OrderStatus.DRAFT,     Set.of(OrderStatus.SUBMITTED, OrderStatus.CANCELLED),\n        OrderStatus.SUBMITTED, Set.of(OrderStatus.PAID, OrderStatus.CANCELLED),\n        OrderStatus.PAID,      Set.of(OrderStatus.SHIPPED, OrderStatus.REFUNDED),\n        OrderStatus.SHIPPED,   Set.of(OrderStatus.DELIVERED),\n        OrderStatus.DELIVERED, Set.of(OrderStatus.REFUNDED),\n        OrderStatus.CANCELLED, Set.of(),\n        OrderStatus.REFUNDED,  Set.of()\n    );\n    \n    private void transitionTo(OrderStatus newStatus) {\n        Set<OrderStatus> allowed = TRANSITIONS.getOrDefault(this.status, Set.of());\n        if (!allowed.contains(newStatus)) {\n            throw new InvalidOrderTransitionException(\n                "Переход из %s в %s недопустим".formatted(this.status, newStatus)\n            );\n        }\n        this.status = newStatus;\n    }\n    \n    public void submit() {\n        transitionTo(OrderStatus.SUBMITTED);\n        raise(new OrderSubmittedEvent(this.id));\n    }\n    \n    public void markPaid(PaymentId paymentId) {\n        transitionTo(OrderStatus.PAID);\n        raise(new OrderPaidEvent(this.id, paymentId));\n    }\n    \n    public void ship(TrackingNumber tracking) {\n        transitionTo(OrderStatus.SHIPPED);\n        raise(new OrderShippedEvent(this.id, tracking));\n    }\n    \n    public void cancel(String reason) {\n        transitionTo(OrderStatus.CANCELLED);\n        raise(new OrderCancelledEvent(this.id, reason));\n    }\n}' },
        { type: 'note', value: 'State Machine в домене гарантирует: из SHIPPED нельзя перейти в DRAFT; из CANCELLED нельзя перейти никуда. Все переходы явно определены и защищены.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: проектирование доменного слоя',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спроектируйте доменный слой для системы онлайн-кинотеатра: фильмы, подписки, просмотры.',
      requirements: [
        'Создать Entity: Movie, Subscription с бизнес-логикой',
        'Создать Value Objects: MovieId, Duration, SubscriptionPlan, Email',
        'Реализовать State Machine для Subscription (trial → active → expired → cancelled)',
        'Создать доменные исключения: SubscriptionExpiredException, MovieNotAvailableException',
        'Защитить инвариант: нельзя смотреть фильм без активной подписки'
      ],
      hint: 'Subscription имеет жизненный цикл: trial → active → expired/cancelled. Movie доступен для просмотра только с активной подпиской определённого уровня. WatchHistory — отдельный агрегат.',
      expectedOutput: 'Доменный слой с Rich Domain Model: Subscription управляет подпиской, Movie валидирует доступность, Value Objects гарантируют корректность данных, State Machine защищает переходы.',
      solution: '// Value Objects\npublic record MovieId(UUID value) {\n    public static MovieId generate() { return new MovieId(UUID.randomUUID()); }\n}\n\npublic record Duration(int minutes) {\n    public Duration {\n        if (minutes <= 0) throw new IllegalArgumentException("Длительность > 0");\n    }\n    public String formatted() {\n        return "%dч %dмин".formatted(minutes / 60, minutes % 60);\n    }\n}\n\npublic enum SubscriptionPlan {\n    BASIC(1),    // 1 устройство, SD\n    STANDARD(2), // 2 устройства, HD\n    PREMIUM(4);  // 4 устройства, 4K\n    \n    final int maxDevices;\n    SubscriptionPlan(int maxDevices) { this.maxDevices = maxDevices; }\n}\n\n// Entity: Subscription с State Machine\npublic class Subscription extends AggregateRoot {\n    private SubscriptionId id;\n    private UserId userId;\n    private SubscriptionPlan plan;\n    private SubscriptionStatus status;\n    private LocalDate startDate;\n    private LocalDate endDate;\n    \n    private static final Map<SubscriptionStatus, Set<SubscriptionStatus>> TRANSITIONS = Map.of(\n        SubscriptionStatus.TRIAL,     Set.of(SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELLED),\n        SubscriptionStatus.ACTIVE,    Set.of(SubscriptionStatus.EXPIRED, SubscriptionStatus.CANCELLED),\n        SubscriptionStatus.EXPIRED,   Set.of(SubscriptionStatus.ACTIVE),\n        SubscriptionStatus.CANCELLED, Set.of(SubscriptionStatus.ACTIVE)\n    );\n    \n    public static Subscription startTrial(UserId userId) {\n        Subscription sub = new Subscription();\n        sub.id = SubscriptionId.generate();\n        sub.userId = userId;\n        sub.plan = SubscriptionPlan.BASIC;\n        sub.status = SubscriptionStatus.TRIAL;\n        sub.startDate = LocalDate.now();\n        sub.endDate = LocalDate.now().plusDays(7);\n        return sub;\n    }\n    \n    public void activate(SubscriptionPlan plan) {\n        transitionTo(SubscriptionStatus.ACTIVE);\n        this.plan = plan;\n        this.endDate = LocalDate.now().plusMonths(1);\n    }\n    \n    public boolean canWatch() {\n        return (status == SubscriptionStatus.ACTIVE || status == SubscriptionStatus.TRIAL)\n            && !LocalDate.now().isAfter(endDate);\n    }\n    \n    private void transitionTo(SubscriptionStatus newStatus) {\n        if (!TRANSITIONS.getOrDefault(status, Set.of()).contains(newStatus)) {\n            throw new InvalidSubscriptionTransitionException(status, newStatus);\n        }\n        this.status = newStatus;\n    }\n}\n\n// Entity: Movie\npublic class Movie {\n    private MovieId id;\n    private String title;\n    private Duration duration;\n    private SubscriptionPlan requiredPlan;\n    \n    public void validateAccess(Subscription subscription) {\n        if (!subscription.canWatch()) {\n            throw new SubscriptionExpiredException();\n        }\n        if (subscription.plan().ordinal() < this.requiredPlan.ordinal()) {\n            throw new InsufficientPlanException(this.requiredPlan);\n        }\n    }\n}',
      explanation: 'Subscription управляет жизненным циклом через State Machine с явными переходами. Movie.validateAccess() проверяет, что подписка активна и уровень плана достаточен. Value Objects (Duration, MovieId) гарантируют валидность при создании. Все бизнес-правила внутри Entity, а не в сервисах.'
    }
  ]
}
