export default {
  id: 6,
  title: 'DDD: Тактические паттерны',
  description: 'Entity, Value Object, Aggregate, Aggregate Root — строительные блоки доменной модели в Domain-Driven Design.',
  lessons: [
    {
      id: 1,
      title: 'Entity: объекты с идентичностью',
      type: 'theory',
      content: [
        { type: 'text', value: 'Entity (сущность) — объект, который определяется своей идентичностью, а не атрибутами. Два человека с одинаковыми именами — разные сущности, потому что у них разные ID.' },
        { type: 'heading', value: 'Характеристики Entity' },
        { type: 'list', value: [
          'Имеет уникальный идентификатор (ID)',
          'Идентичность сохраняется при изменении атрибутов',
          'Имеет жизненный цикл (создание → изменения → удаление)',
          'Содержит бизнес-логику (не просто данные!)',
          'Сравнивается по ID, а не по значениям полей'
        ]},
        { type: 'code', language: 'java', value: '// Entity: User с идентичностью и бизнес-логикой\npublic class User {\n    private final UserId id;\n    private Email email;\n    private FullName name;\n    private UserStatus status;\n    private List<Role> roles;\n    \n    // Бизнес-правило\n    public void deactivate() {\n        if (this.roles.contains(Role.ADMIN)) {\n            throw new CannotDeactivateAdminException();\n        }\n        this.status = UserStatus.INACTIVE;\n    }\n    \n    public void assignRole(Role role) {\n        if (this.status != UserStatus.ACTIVE) {\n            throw new InactiveUserException("Нельзя назначить роль неактивному пользователю");\n        }\n        if (this.roles.contains(role)) {\n            return; // идемпотентность\n        }\n        this.roles.add(role);\n    }\n    \n    // Сравнение по ID\n    @Override\n    public boolean equals(Object o) {\n        if (this == o) return true;\n        if (!(o instanceof User other)) return false;\n        return this.id.equals(other.id);\n    }\n    \n    @Override\n    public int hashCode() {\n        return id.hashCode();\n    }\n}' },
        { type: 'warning', value: 'Entity — это НЕ JPA/Hibernate Entity. JPA @Entity — аннотация ORM. Domain Entity — объект с идентичностью и бизнес-логикой. Не путайте эти понятия.' }
      ]
    },
    {
      id: 2,
      title: 'Value Object: объекты-значения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Value Object (объект-значение) — объект, который определяется своими атрибутами, а не идентичностью. Два Value Object с одинаковыми значениями — это один и тот же объект.' },
        { type: 'heading', value: 'Характеристики Value Object' },
        { type: 'list', value: [
          'Нет идентификатора',
          'Неизменяемый (immutable) — вместо изменения создаётся новый',
          'Сравнивается по значениям всех полей',
          'Валидирует себя при создании',
          'Содержит поведение, связанное со своим значением'
        ]},
        { type: 'code', language: 'java', value: '// Value Object: Email\npublic record Email(String value) {\n    public Email {\n        if (value == null || !value.matches("^[\\\\w.-]+@[\\\\w.-]+\\\\.[a-zA-Z]{2,}$")) {\n            throw new InvalidEmailException(value);\n        }\n        value = value.toLowerCase(); // нормализация\n    }\n}\n\n// Value Object: Money\npublic record Money(BigDecimal amount, Currency currency) {\n    public Money {\n        if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0) {\n            throw new NegativeAmountException();\n        }\n    }\n    \n    public Money add(Money other) {\n        ensureSameCurrency(other);\n        return new Money(this.amount.add(other.amount), this.currency);\n    }\n    \n    public Money subtract(Money other) {\n        ensureSameCurrency(other);\n        BigDecimal result = this.amount.subtract(other.amount);\n        if (result.compareTo(BigDecimal.ZERO) < 0) {\n            throw new InsufficientFundsException();\n        }\n        return new Money(result, this.currency);\n    }\n    \n    public Money multiply(int factor) {\n        return new Money(this.amount.multiply(BigDecimal.valueOf(factor)), this.currency);\n    }\n    \n    private void ensureSameCurrency(Money other) {\n        if (!this.currency.equals(other.currency)) {\n            throw new CurrencyMismatchException(this.currency, other.currency);\n        }\n    }\n}' },
        { type: 'code', language: 'typescript', value: '// Value Object в TypeScript\nclass DateRange {\n  private constructor(\n    readonly start: Date,\n    readonly end: Date\n  ) {}\n\n  static create(start: Date, end: Date): DateRange {\n    if (end <= start) {\n      throw new Error("Дата окончания должна быть после даты начала");\n    }\n    return new DateRange(start, end);\n  }\n\n  contains(date: Date): boolean {\n    return date >= this.start && date <= this.end;\n  }\n\n  overlaps(other: DateRange): boolean {\n    return this.start < other.end && other.start < this.end;\n  }\n\n  durationInDays(): number {\n    return Math.ceil((this.end.getTime() - this.start.getTime()) / (1000 * 60 * 60 * 24));\n  }\n\n  equals(other: DateRange): boolean {\n    return this.start.getTime() === other.start.getTime()\n      && this.end.getTime() === other.end.getTime();\n  }\n}' },
        { type: 'tip', value: 'Используйте Value Objects максимально часто. String email, String phone, int age — это примитивная одержимость (Primitive Obsession). Email, Phone, Age как Value Objects гарантируют валидность и добавляют поведение.' }
      ]
    },
    {
      id: 3,
      title: 'Aggregate: граница консистентности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Aggregate (агрегат) — кластер доменных объектов, которые рассматриваются как единое целое при изменении данных. Aggregate обеспечивает консистентность внутри своих границ.' },
        { type: 'heading', value: 'Правила агрегатов' },
        { type: 'list', value: [
          'У каждого Aggregate есть Aggregate Root — единственная точка входа',
          'Внешний код обращается только к Root, не к внутренним объектам',
          'Изменения внутри Aggregate должны быть атомарными (одна транзакция)',
          'Ссылки между агрегатами — только через ID, не через прямые ссылки',
          'Aggregate должен быть маленьким — предпочитайте маленькие агрегаты'
        ]},
        { type: 'code', language: 'java', value: '// Aggregate: Order (Aggregate Root) содержит OrderLine (внутренняя сущность)\npublic class Order { // Aggregate Root\n    private final OrderId id;\n    private CustomerId customerId; // ссылка на другой агрегат через ID!\n    private List<OrderLine> lines; // внутренние объекты\n    private OrderStatus status;\n    private Money totalAmount;\n    \n    // Внешний код работает ТОЛЬКО через Aggregate Root\n    public void addItem(ProductId productId, int quantity, Money unitPrice) {\n        if (this.status != OrderStatus.DRAFT) {\n            throw new OrderNotEditableException();\n        }\n        OrderLine line = new OrderLine(productId, quantity, unitPrice);\n        this.lines.add(line);\n        recalculateTotal();\n    }\n    \n    public void removeItem(ProductId productId) {\n        this.lines.removeIf(line -> line.productId().equals(productId));\n        recalculateTotal();\n    }\n    \n    public void submit() {\n        if (this.lines.isEmpty()) {\n            throw new EmptyOrderException();\n        }\n        this.status = OrderStatus.SUBMITTED;\n    }\n    \n    private void recalculateTotal() {\n        this.totalAmount = lines.stream()\n            .map(OrderLine::lineTotal)\n            .reduce(Money.ZERO, Money::add);\n    }\n}\n\n// Внутренний объект агрегата — НЕ доступен снаружи\nclass OrderLine { // package-private\n    private ProductId productId;\n    private int quantity;\n    private Money unitPrice;\n    \n    Money lineTotal() {\n        return unitPrice.multiply(quantity);\n    }\n}' },
        { type: 'note', value: 'Агрегат — это граница транзакции. Один агрегат = одна транзакция. Никогда не изменяйте два агрегата в одной транзакции. Если нужно согласованное изменение двух агрегатов — используйте Domain Events.' }
      ]
    },
    {
      id: 4,
      title: 'Проектирование агрегатов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильное определение границ агрегатов — одна из самых сложных задач в DDD. Слишком большие агрегаты создают проблемы с производительностью и параллелизмом. Слишком маленькие — затрудняют поддержание инвариантов.' },
        { type: 'heading', value: 'Правила проектирования (Vaughn Vernon)' },
        { type: 'list', value: [
          'Защищайте бизнес-инварианты внутри агрегата',
          'Проектируйте маленькие агрегаты',
          'Ссылайтесь на другие агрегаты только по ID',
          'Обновляйте другие агрегаты через eventual consistency (Domain Events)'
        ]},
        { type: 'code', language: 'java', value: '// ПЛОХО: слишком большой агрегат\npublic class Order {\n    private Customer customer;     // прямая ссылка на другой агрегат!\n    private List<Product> products; // прямая ссылка на другой агрегат!\n    private Payment payment;       // прямая ссылка на другой агрегат!\n    // Загрузка Order тянет за собой Customer, все Products и Payment\n}\n\n// ХОРОШО: маленький агрегат со ссылками по ID\npublic class Order {\n    private OrderId id;\n    private CustomerId customerId;        // ID, не объект\n    private List<OrderLine> lines;        // OrderLine — внутренний объект\n    private OrderStatus status;\n    \n    // OrderLine содержит ProductId, не Product\n}' },
        { type: 'heading', value: 'Как определить границы' },
        { type: 'text', value: 'Задайте вопрос: "Какие данные ДОЛЖНЫ быть согласованы в каждый момент времени?" Если Order и OrderLine должны быть согласованы (сумма = сумма строк), они в одном агрегате. Если Order и Product могут быть рассогласованы временно — они в разных агрегатах.' },
        { type: 'tip', value: 'Вон Вернон рекомендует начинать с агрегатов из одной сущности. Добавляйте внутренние объекты, только если есть инвариант, который нельзя защитить иначе.' }
      ]
    },
    {
      id: 5,
      title: 'Factory и Domain Events',
      type: 'theory',
      content: [
        { type: 'text', value: 'Два дополнительных тактических паттерна: Factory для создания сложных объектов и Domain Events для коммуникации между агрегатами.' },
        { type: 'heading', value: 'Factory' },
        { type: 'text', value: 'Когда создание агрегата требует сложной логики или нескольких шагов, используйте фабрику. Фабрика инкапсулирует знание о том, как создать валидный объект.' },
        { type: 'code', language: 'java', value: '// Factory метод в Aggregate Root\npublic class Order {\n    public static Order create(CustomerId customerId, List<OrderItem> items) {\n        if (items.isEmpty()) {\n            throw new EmptyOrderException();\n        }\n        OrderId id = OrderId.generate();\n        Order order = new Order(id, customerId, OrderStatus.DRAFT);\n        items.forEach(item -> order.addItem(item.productId(), item.quantity(), item.price()));\n        order.registerEvent(new OrderCreatedEvent(id, customerId));\n        return order;\n    }\n}' },
        { type: 'heading', value: 'Domain Events' },
        { type: 'text', value: 'Domain Event — факт, произошедший в домене. Используется для коммуникации между агрегатами без прямой зависимости.' },
        { type: 'code', language: 'java', value: '// Domain Event\npublic record OrderCreatedEvent(\n    OrderId orderId,\n    CustomerId customerId,\n    Money totalAmount,\n    Instant occurredAt\n) implements DomainEvent {\n    public OrderCreatedEvent(OrderId orderId, CustomerId customerId, Money totalAmount) {\n        this(orderId, customerId, totalAmount, Instant.now());\n    }\n}\n\n// Aggregate генерирует событие\npublic abstract class AggregateRoot {\n    private final List<DomainEvent> domainEvents = new ArrayList<>();\n    \n    protected void registerEvent(DomainEvent event) {\n        domainEvents.add(event);\n    }\n    \n    public List<DomainEvent> getDomainEvents() {\n        return Collections.unmodifiableList(domainEvents);\n    }\n    \n    public void clearEvents() {\n        domainEvents.clear();\n    }\n}\n\n// Обработчик события — в другом контексте\npublic class SendConfirmationOnOrderCreated {\n    private final NotificationService notificationService;\n    \n    public void handle(OrderCreatedEvent event) {\n        notificationService.sendOrderConfirmation(\n            event.customerId(), event.orderId()\n        );\n    }\n}' },
        { type: 'note', value: 'Domain Events именуются в прошедшем времени: OrderCreated, PaymentProcessed, UserRegistered. Это факты, которые уже произошли. Их нельзя отменить — можно только компенсировать другим событием.' }
      ]
    },
    {
      id: 6,
      title: 'Entity vs Value Object: когда что использовать',
      type: 'theory',
      content: [
        { type: 'text', value: 'Выбор между Entity и Value Object — частый вопрос. Неправильный выбор ведёт к усложнению кода. Вот чёткие критерии.' },
        { type: 'heading', value: 'Используйте Entity, когда:' },
        { type: 'list', value: [
          'Объект имеет жизненный цикл (создаётся, меняется, удаляется)',
          'Важна идентичность: два объекта с одинаковыми данными — это разные объекты',
          'Нужно отслеживать изменения конкретного экземпляра',
          'Примеры: User, Order, Product, BankAccount'
        ]},
        { type: 'heading', value: 'Используйте Value Object, когда:' },
        { type: 'list', value: [
          'Объект описывает характеристику или измерение',
          'Два объекта с одинаковыми данными равны',
          'Объект неизменяемый (immutable)',
          'Примеры: Email, Money, Address, DateRange, Color, Coordinates'
        ]},
        { type: 'code', language: 'typescript', value: '// Address — Entity или Value Object?\n// Зависит от контекста!\n\n// В системе доставки: Address — Entity (у каждого адреса свой ID,\n// мы отслеживаем историю доставок по этому адресу)\nclass DeliveryAddress {\n  constructor(\n    readonly id: AddressId,\n    public street: string,\n    public city: string,\n    public deliveryInstructions: string\n  ) {}\n}\n\n// В системе биллинга: Address — Value Object (нам важно только значение)\nclass BillingAddress {\n  private constructor(\n    readonly street: string,\n    readonly city: string,\n    readonly zipCode: string\n  ) {}\n\n  static create(street: string, city: string, zipCode: string): BillingAddress {\n    if (!zipCode.match(/^\\d{6}$/)) throw new Error("Некорректный индекс");\n    return new BillingAddress(street, city, zipCode);\n  }\n\n  equals(other: BillingAddress): boolean {\n    return this.street === other.street\n      && this.city === other.city\n      && this.zipCode === other.zipCode;\n  }\n}' },
        { type: 'tip', value: 'Предпочитайте Value Objects. Они проще, безопаснее (immutable), легче тестируются. Делайте Entity только когда действительно нужна идентичность.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: моделирование агрегатов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спроектируйте агрегаты для системы бронирования отелей с бизнес-инвариантами.',
      requirements: [
        'Определить агрегаты: Hotel, Reservation, Guest',
        'Определить Value Objects: DateRange, RoomType, Money, Email',
        'Реализовать бизнес-инварианты: нельзя забронировать занятый номер, минимальный срок 1 ночь',
        'Ссылки между агрегатами только по ID',
        'Генерировать Domain Events: ReservationCreated, ReservationCancelled'
      ],
      hint: 'Hotel содержит список Room (внутренний объект агрегата). Reservation — отдельный агрегат, ссылающийся на Hotel и Room по ID. Guest — ещё один агрегат.',
      expectedOutput: 'Три агрегата с чёткими границами, бизнес-инварианты защищены внутри агрегатов, Domain Events генерируются при создании/отмене бронирования.',
      solution: '// === VALUE OBJECTS ===\n\npublic record DateRange(LocalDate checkIn, LocalDate checkOut) {\n    public DateRange {\n        if (!checkOut.isAfter(checkIn)) {\n            throw new InvalidDateRangeException("Check-out должен быть после check-in");\n        }\n    }\n    public long nights() {\n        return ChronoUnit.DAYS.between(checkIn, checkOut);\n    }\n    public boolean overlaps(DateRange other) {\n        return checkIn.isBefore(other.checkOut) && other.checkIn.isBefore(checkOut);\n    }\n}\n\npublic record RoomType(String value) {\n    public static final RoomType STANDARD = new RoomType("standard");\n    public static final RoomType DELUXE = new RoomType("deluxe");\n    public static final RoomType SUITE = new RoomType("suite");\n}\n\n// === AGGREGATE: Hotel ===\n\npublic class Hotel extends AggregateRoot {\n    private HotelId id;\n    private String name;\n    private List<Room> rooms; // внутренний объект\n    \n    public RoomId findAvailableRoom(RoomType type, DateRange dates) {\n        return rooms.stream()\n            .filter(room -> room.type().equals(type))\n            .filter(room -> room.isAvailable(dates))\n            .findFirst()\n            .map(Room::id)\n            .orElseThrow(() -> new NoAvailableRoomException(type, dates));\n    }\n    \n    public void markRoomBooked(RoomId roomId, DateRange dates) {\n        Room room = findRoom(roomId);\n        room.addBooking(dates);\n    }\n}\n\nclass Room {\n    private RoomId id;\n    private RoomType type;\n    private Money pricePerNight;\n    private List<DateRange> bookings;\n    \n    boolean isAvailable(DateRange dates) {\n        return bookings.stream().noneMatch(b -> b.overlaps(dates));\n    }\n    void addBooking(DateRange dates) {\n        if (!isAvailable(dates)) throw new RoomNotAvailableException();\n        bookings.add(dates);\n    }\n}\n\n// === AGGREGATE: Reservation ===\n\npublic class Reservation extends AggregateRoot {\n    private ReservationId id;\n    private GuestId guestId;    // ссылка по ID\n    private HotelId hotelId;    // ссылка по ID\n    private RoomId roomId;      // ссылка по ID\n    private DateRange dates;\n    private Money totalPrice;\n    private ReservationStatus status;\n    \n    public static Reservation create(GuestId guest, HotelId hotel, RoomId room, DateRange dates, Money pricePerNight) {\n        Reservation r = new Reservation();\n        r.id = ReservationId.generate();\n        r.guestId = guest;\n        r.hotelId = hotel;\n        r.roomId = room;\n        r.dates = dates;\n        r.totalPrice = pricePerNight.multiply((int) dates.nights());\n        r.status = ReservationStatus.CONFIRMED;\n        r.registerEvent(new ReservationCreatedEvent(r.id, hotel, room, dates));\n        return r;\n    }\n    \n    public void cancel() {\n        if (this.status == ReservationStatus.CANCELLED) {\n            throw new AlreadyCancelledException();\n        }\n        this.status = ReservationStatus.CANCELLED;\n        registerEvent(new ReservationCancelledEvent(id, hotelId, roomId, dates));\n    }\n}',
      explanation: 'Hotel — агрегат с Room внутри (инвариант: нельзя забронировать занятый номер). Reservation — отдельный агрегат, ссылающийся на Hotel и Guest по ID. При отмене бронирования Reservation генерирует ReservationCancelledEvent, который Hotel обработает и освободит номер. Это eventual consistency между агрегатами.'
    }
  ]
}
