export default {
  id: 16,
  title: 'Тестирование архитектуры',
  description: 'Unit-тесты доменного слоя, интеграционные тесты, Architecture Tests (ArchUnit), тестовые дублёры и стратегия тестирования.',
  lessons: [
    {
      id: 1,
      title: 'Стратегия тестирования в Clean Architecture',
      type: 'theory',
      content: [
        { type: 'text', value: 'Clean Architecture делает тестирование естественным: каждый слой тестируется изолированно. Доменный слой — unit-тестами без зависимостей. Application — с фейками. Infrastructure — интеграционными тестами.' },
        { type: 'heading', value: 'Пирамида тестов в Clean Architecture' },
        { type: 'list', value: [
          'Unit Tests (Domain): тестируют Entity, Value Object, Domain Service — быстрые, без зависимостей',
          'Unit Tests (Application): тестируют Use Cases с фейковыми репозиториями',
          'Integration Tests: тестируют Infrastructure (реальная БД, API)',
          'Architecture Tests: проверяют правила зависимостей между слоями',
          'E2E Tests: тестируют полный путь запроса от API до БД'
        ]},
        { type: 'heading', value: 'Соотношение тестов' },
        { type: 'text', value: 'Много unit-тестов для Domain (они бесплатные — быстрые, стабильные). Средний объём тестов для Application (с фейками). Мало интеграционных (медленные, но проверяют реальные взаимодействия). Минимум E2E.' },
        { type: 'tip', value: 'Если Domain тестировать трудно — это симптом плохой архитектуры. Правильно спроектированный Domain не требует моков, фейков, БД — только new Entity() и вызов методов.' }
      ]
    },
    {
      id: 2,
      title: 'Unit-тесты доменного слоя',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тесты Domain-слоя — самые ценные: они проверяют бизнес-логику, работают мгновенно и не ломаются при изменении инфраструктуры.' },
        { type: 'code', language: 'java', value: '// Тесты Value Object\nclass MoneyTest {\n    @Test\n    void shouldAddSameCurrency() {\n        Money a = Money.of(100, "RUB");\n        Money b = Money.of(50, "RUB");\n        assertEquals(Money.of(150, "RUB"), a.add(b));\n    }\n    \n    @Test\n    void shouldRejectNegativeAmount() {\n        assertThrows(NegativeAmountException.class, () -> Money.of(-10, "RUB"));\n    }\n    \n    @Test\n    void shouldRejectDifferentCurrencies() {\n        Money rub = Money.of(100, "RUB");\n        Money usd = Money.of(50, "USD");\n        assertThrows(CurrencyMismatchException.class, () -> rub.add(usd));\n    }\n}\n\n// Тесты Entity\nclass OrderTest {\n    @Test\n    void shouldAddItemToDraftOrder() {\n        Order order = Order.create(customerId());\n        order.addItem(productId(), 2, Money.of(500, "RUB"));\n        assertEquals(1, order.lineCount());\n        assertEquals(Money.of(1000, "RUB"), order.total());\n    }\n    \n    @Test\n    void shouldNotAddItemToSubmittedOrder() {\n        Order order = createSubmittedOrder();\n        assertThrows(OrderNotEditableException.class, () ->\n            order.addItem(productId(), 1, Money.of(100, "RUB"))\n        );\n    }\n    \n    @Test\n    void shouldCancelPendingOrder() {\n        Order order = createSubmittedOrder();\n        order.cancel("Передумал");\n        assertEquals(OrderStatus.CANCELLED, order.status());\n    }\n    \n    @Test\n    void shouldNotCancelShippedOrder() {\n        Order order = createShippedOrder();\n        assertThrows(CannotCancelShippedException.class, () ->\n            order.cancel("Хочу отменить")\n        );\n    }\n    \n    @Test\n    void shouldGenerateOrderPlacedEvent() {\n        Order order = Order.create(customerId());\n        order.addItem(productId(), 1, Money.of(100, "RUB"));\n        order.submit();\n        \n        assertThat(order.domainEvents())\n            .hasSize(1)\n            .first()\n            .isInstanceOf(OrderSubmittedEvent.class);\n    }\n}' },
        { type: 'note', value: 'Обратите внимание: ни одного мока! Domain-тесты работают только с доменными объектами. Нет БД, нет HTTP, нет фреймворков. Это и есть главное преимущество Clean Architecture.' }
      ]
    },
    {
      id: 3,
      title: 'Тесты Application-слоя с фейками',
      type: 'theory',
      content: [
        { type: 'text', value: 'Use Cases тестируются с фейковыми (in-memory) реализациями репозиториев и внешних сервисов. Фейки проще и надёжнее моков.' },
        { type: 'code', language: 'java', value: '// Фейковый репозиторий\npublic class InMemoryOrderRepository implements OrderRepository {\n    private final Map<OrderId, Order> store = new HashMap<>();\n    \n    @Override\n    public Optional<Order> findById(OrderId id) {\n        return Optional.ofNullable(store.get(id));\n    }\n    \n    @Override\n    public void save(Order order) {\n        store.put(order.id(), order);\n    }\n    \n    // Вспомогательные методы для тестов\n    public int count() { return store.size(); }\n    public List<Order> all() { return new ArrayList<>(store.values()); }\n}\n\npublic class FakePaymentGateway implements PaymentGateway {\n    public boolean shouldSucceed = true;\n    public List<Money> chargedAmounts = new ArrayList<>();\n    \n    @Override\n    public PaymentResult charge(Money amount) {\n        chargedAmounts.add(amount);\n        return shouldSucceed \n            ? PaymentResult.success("txn_fake_123")\n            : PaymentResult.failed("Недостаточно средств");\n    }\n}' },
        { type: 'code', language: 'java', value: '// Тесты Use Case\nclass PlaceOrderUseCaseTest {\n    private InMemoryOrderRepository orderRepo;\n    private InMemoryProductRepository productRepo;\n    private FakePaymentGateway paymentGateway;\n    private FakeEmailSender emailSender;\n    private PlaceOrderUseCase useCase;\n    \n    @BeforeEach\n    void setUp() {\n        orderRepo = new InMemoryOrderRepository();\n        productRepo = new InMemoryProductRepository();\n        paymentGateway = new FakePaymentGateway();\n        emailSender = new FakeEmailSender();\n        useCase = new PlaceOrderUseCase(orderRepo, productRepo, paymentGateway, emailSender);\n        \n        // Подготовка данных\n        productRepo.save(Product.create(ProductId.of("p1"), "Книга", Money.of(500, "RUB")));\n    }\n    \n    @Test\n    void shouldPlaceOrderSuccessfully() {\n        PlaceOrderCommand cmd = new PlaceOrderCommand("cust-1", List.of("p1"), "ул. Пушкина");\n        OrderDto result = useCase.execute(cmd);\n        \n        assertNotNull(result.orderId());\n        assertEquals(1, orderRepo.count());\n        assertEquals(1, paymentGateway.chargedAmounts.size());\n        assertEquals(1, emailSender.sentEmails.size());\n    }\n    \n    @Test\n    void shouldFailWhenPaymentDeclined() {\n        paymentGateway.shouldSucceed = false;\n        PlaceOrderCommand cmd = new PlaceOrderCommand("cust-1", List.of("p1"), "ул. Пушкина");\n        \n        assertThrows(PaymentFailedException.class, () -> useCase.execute(cmd));\n        assertEquals(0, orderRepo.count()); // заказ не сохранён\n    }\n}' },
        { type: 'tip', value: 'Фейки > Моки. Фейк — полноценная in-memory реализация. Мок — программируемый стаб. Фейки надёжнее, меньше привязаны к деталям реализации и не ломаются при рефакторинге.' }
      ]
    },
    {
      id: 4,
      title: 'Architecture Tests (ArchUnit)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Architecture Tests автоматически проверяют, что код следует архитектурным правилам: зависимости направлены внутрь, Domain не импортирует Spring, Use Cases не обращаются к БД напрямую.' },
        { type: 'code', language: 'java', value: '// ArchUnit: тесты архитектурных правил\nimport static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.*;\nimport static com.tngtech.archunit.library.Architectures.layeredArchitecture;\n\n@AnalyzeClasses(packages = "com.example.shop")\npublic class ArchitectureTest {\n    \n    // Проверяем слоистую архитектуру\n    @ArchTest\n    static final ArchRule layerDependencies = layeredArchitecture()\n        .consideringAllDependencies()\n        .layer("Domain").definedBy("..domain..")\n        .layer("Application").definedBy("..application..")\n        .layer("Infrastructure").definedBy("..infrastructure..")\n        .layer("Presentation").definedBy("..presentation..")\n        .whereLayer("Domain").mayOnlyBeAccessedByLayers("Application", "Infrastructure", "Presentation")\n        .whereLayer("Application").mayOnlyBeAccessedByLayers("Infrastructure", "Presentation")\n        .whereLayer("Infrastructure").mayNotBeAccessedByAnyLayer()\n        .whereLayer("Presentation").mayNotBeAccessedByAnyLayer();\n    \n    // Domain не должен зависеть от Spring\n    @ArchTest\n    static final ArchRule domainShouldNotDependOnSpring = \n        noClasses().that().resideInAPackage("..domain..")\n            .should().dependOnClassesThat().resideInAPackage("org.springframework..");\n    \n    // Domain не должен зависеть от JPA\n    @ArchTest\n    static final ArchRule domainShouldNotDependOnJpa = \n        noClasses().that().resideInAPackage("..domain..")\n            .should().dependOnClassesThat().resideInAPackage("jakarta.persistence..");\n    \n    // Use Cases должны быть в Application слое\n    @ArchTest\n    static final ArchRule useCasesShouldBeInApplication = \n        classes().that().haveSimpleNameEndingWith("UseCase")\n            .should().resideInAPackage("..application..");\n    \n    // Репозитории — интерфейсы в Domain, реализации в Infrastructure\n    @ArchTest\n    static final ArchRule repositoryInterfacesInDomain = \n        classes().that().haveSimpleNameEndingWith("Repository")\n            .and().areInterfaces()\n            .should().resideInAPackage("..domain..");\n}' },
        { type: 'heading', value: 'Что проверяют Architecture Tests' },
        { type: 'list', value: [
          'Правило зависимостей — Domain не зависит от Infrastructure',
          'Именование — Use Cases в Application, Repositories-интерфейсы в Domain',
          'Запрет циклических зависимостей между пакетами',
          'Domain не использует аннотации фреймворков',
          'Entity не имеют публичных сеттеров'
        ]},
        { type: 'warning', value: 'Architecture Tests — это инвестиция в качество. Без них правила архитектуры нарушаются постепенно: один разработчик добавит @Entity в Domain, другой вызовет БД из Use Case. Architecture Tests ловят это автоматически.' }
      ]
    },
    {
      id: 5,
      title: 'Интеграционные тесты Infrastructure',
      type: 'theory',
      content: [
        { type: 'text', value: 'Интеграционные тесты проверяют, что Infrastructure правильно работает с реальными внешними системами: БД, API, файловой системой.' },
        { type: 'code', language: 'java', value: '// Testcontainers для интеграционных тестов\n@Testcontainers\nclass JpaOrderRepositoryIntegrationTest {\n    \n    @Container\n    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");\n    \n    private JpaOrderRepository repository;\n    \n    @BeforeEach\n    void setUp() {\n        DataSource ds = createDataSource(postgres.getJdbcUrl());\n        repository = new JpaOrderRepository(new EntityManager(ds), new OrderMapper());\n    }\n    \n    @Test\n    void shouldSaveAndLoadOrder() {\n        // Arrange\n        Order order = Order.create(new CustomerId(UUID.randomUUID()));\n        order.addItem(ProductId.generate(), 2, Money.of(500, "RUB"));\n        \n        // Act\n        repository.save(order);\n        Optional<Order> loaded = repository.findById(order.id());\n        \n        // Assert\n        assertTrue(loaded.isPresent());\n        assertEquals(order.id(), loaded.get().id());\n        assertEquals(order.total(), loaded.get().total());\n        assertEquals(1, loaded.get().lineCount());\n    }\n    \n    @Test\n    void shouldUpdateOrderStatus() {\n        Order order = createAndSaveOrder();\n        order.submit();\n        repository.save(order);\n        \n        Order loaded = repository.findById(order.id()).orElseThrow();\n        assertEquals(OrderStatus.SUBMITTED, loaded.status());\n    }\n}' },
        { type: 'code', language: 'typescript', value: '// TypeScript: интеграционный тест с реальной БД\ndescribe("PgOrderRepository", () => {\n  let pool: Pool;\n  let repo: PgOrderRepository;\n\n  beforeAll(async () => {\n    pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });\n    await pool.query("DELETE FROM orders");\n    repo = new PgOrderRepository(pool);\n  });\n\n  afterAll(() => pool.end());\n\n  it("should save and find order", async () => {\n    const order = Order.create(new CustomerId("cust-1"));\n    order.addItem(new ProductId("p1"), 2, Money.of(500, "RUB"));\n    \n    await repo.save(order);\n    const loaded = await repo.findById(order.id);\n    \n    expect(loaded).not.toBeNull();\n    expect(loaded!.id).toEqual(order.id);\n    expect(loaded!.total().amount).toBe(1000);\n  });\n});' },
        { type: 'note', value: 'Интеграционные тесты медленнее, но они незаменимы: проверяют маппинг Domain ↔ ORM, SQL-запросы, миграции. Используйте Testcontainers для изоляции — каждый тест получает чистую БД.' }
      ]
    },
    {
      id: 6,
      title: 'E2E тесты и Test Fixtures',
      type: 'theory',
      content: [
        { type: 'text', value: 'E2E (end-to-end) тесты проверяют полный путь: HTTP-запрос → Controller → Use Case → Domain → Repository → БД и обратно. Они дорогие, но проверяют, что всё работает вместе.' },
        { type: 'code', language: 'java', value: '// Spring Boot E2E тест\n@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)\n@Testcontainers\nclass OrderE2ETest {\n    @Container\n    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");\n    \n    @Autowired\n    private TestRestTemplate restTemplate;\n    \n    @Test\n    void shouldCreateAndRetrieveOrder() {\n        // Создаём заказ\n        var request = Map.of(\n            "customerId", "cust-1",\n            "items", List.of(Map.of("productId", "p-1", "quantity", 2)),\n            "shippingAddress", "ул. Пушкина 10"\n        );\n        \n        var createResponse = restTemplate.postForEntity(\n            "/api/v1/orders", request, Map.class\n        );\n        assertEquals(HttpStatus.CREATED, createResponse.getStatusCode());\n        String orderId = (String) createResponse.getBody().get("orderId");\n        \n        // Получаем заказ\n        var getResponse = restTemplate.getForEntity(\n            "/api/v1/orders/" + orderId, Map.class\n        );\n        assertEquals(HttpStatus.OK, getResponse.getStatusCode());\n        assertEquals(orderId, getResponse.getBody().get("orderId"));\n    }\n}' },
        { type: 'heading', value: 'Test Fixtures — построители тестовых данных' },
        { type: 'code', language: 'java', value: '// Test Fixture Builder\npublic class OrderFixture {\n    private CustomerId customerId = new CustomerId(UUID.randomUUID());\n    private List<OrderLine> lines = new ArrayList<>();\n    private OrderStatus status = OrderStatus.DRAFT;\n    \n    public static OrderFixture anOrder() {\n        return new OrderFixture();\n    }\n    \n    public OrderFixture withCustomer(String id) {\n        this.customerId = new CustomerId(UUID.fromString(id));\n        return this;\n    }\n    \n    public OrderFixture withItem(String productId, int qty, int price) {\n        lines.add(new OrderLine(ProductId.of(productId), qty, Money.of(price, "RUB")));\n        return this;\n    }\n    \n    public OrderFixture submitted() {\n        this.status = OrderStatus.SUBMITTED;\n        return this;\n    }\n    \n    public Order build() {\n        Order order = Order.create(customerId);\n        lines.forEach(l -> order.addItem(l.productId(), l.quantity(), l.unitPrice()));\n        if (status == OrderStatus.SUBMITTED) order.submit();\n        return order;\n    }\n}\n\n// Использование в тестах\nOrder order = OrderFixture.anOrder()\n    .withItem("p1", 2, 500)\n    .withItem("p2", 1, 300)\n    .submitted()\n    .build();' },
        { type: 'tip', value: 'Используйте Fixture Builders (Object Mother) для создания тестовых объектов. Это убирает дублирование и делает тесты читаемыми: anOrder().withItem().submitted().build().' }
      ]
    },
    {
      id: 7,
      title: 'Практика: тестирование Clean Architecture',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите тесты всех уровней для модуля бронирования: unit, application, architecture tests.',
      requirements: [
        'Unit-тесты для Entity Reservation (бизнес-правила)',
        'Unit-тесты для Value Object DateRange',
        'Тесты Use Case: CreateReservationUseCase с фейками',
        'Architecture Test: Domain не зависит от Infrastructure',
        'Создать Fixture Builder для Reservation'
      ],
      hint: 'Начните с самых простых — тесты Value Object DateRange. Затем тесты Entity. Для Use Case создайте InMemoryReservationRepository. Architecture Test проверяет импорты.',
      expectedOutput: 'Полный набор тестов: unit (Domain), application (Use Cases с фейками), architecture (правила зависимостей). Все тесты проходят без внешних зависимостей.',
      solution: '// === Unit Test: Value Object ===\ndescribe("DateRange", () => {\n  it("should create valid range", () => {\n    const range = DateRange.create(new Date("2025-06-01"), new Date("2025-06-05"));\n    expect(range.nights()).toBe(4);\n  });\n\n  it("should reject end before start", () => {\n    expect(() => DateRange.create(new Date("2025-06-05"), new Date("2025-06-01")))\n      .toThrow("Check-out должен быть после check-in");\n  });\n\n  it("should detect overlap", () => {\n    const a = DateRange.create(new Date("2025-06-01"), new Date("2025-06-05"));\n    const b = DateRange.create(new Date("2025-06-03"), new Date("2025-06-08"));\n    expect(a.overlaps(b)).toBe(true);\n  });\n\n  it("should detect no overlap", () => {\n    const a = DateRange.create(new Date("2025-06-01"), new Date("2025-06-03"));\n    const b = DateRange.create(new Date("2025-06-05"), new Date("2025-06-08"));\n    expect(a.overlaps(b)).toBe(false);\n  });\n});\n\n// === Unit Test: Entity ===\ndescribe("Reservation", () => {\n  it("should create confirmed reservation", () => {\n    const res = Reservation.create("guest-1", "hotel-1", "room-1",\n      DateRange.create(new Date("2025-06-01"), new Date("2025-06-03")),\n      Money.of(5000, "RUB"));\n    expect(res.status).toBe("confirmed");\n    expect(res.totalPrice.amount).toBe(10000);\n  });\n\n  it("should cancel reservation", () => {\n    const res = createReservation();\n    res.cancel();\n    expect(res.status).toBe("cancelled");\n  });\n\n  it("should not cancel already cancelled", () => {\n    const res = createReservation();\n    res.cancel();\n    expect(() => res.cancel()).toThrow("Already cancelled");\n  });\n});\n\n// === Application Test: Use Case ===\ndescribe("CreateReservationUseCase", () => {\n  let hotelRepo: InMemoryHotelRepository;\n  let reservationRepo: InMemoryReservationRepository;\n  let useCase: CreateReservationUseCase;\n\n  beforeEach(() => {\n    hotelRepo = new InMemoryHotelRepository();\n    reservationRepo = new InMemoryReservationRepository();\n    useCase = new CreateReservationUseCase(hotelRepo, reservationRepo);\n    hotelRepo.save(createHotel("hotel-1", [{ id: "room-1", type: "standard" }]));\n  });\n\n  it("should create reservation for available room", async () => {\n    await useCase.execute({ guestId: "g-1", hotelId: "hotel-1", roomType: "standard",\n      checkIn: "2025-06-01", checkOut: "2025-06-03" });\n    expect(reservationRepo.count()).toBe(1);\n  });\n\n  it("should reject if no room available", async () => {\n    await useCase.execute({ guestId: "g-1", hotelId: "hotel-1", roomType: "standard",\n      checkIn: "2025-06-01", checkOut: "2025-06-03" });\n    await expect(useCase.execute({ guestId: "g-2", hotelId: "hotel-1", roomType: "standard",\n      checkIn: "2025-06-02", checkOut: "2025-06-04" })).rejects.toThrow("No available room");\n  });\n});\n\n// === Fixture Builder ===\nclass ReservationFixture {\n  private guestId = "guest-1";\n  private hotelId = "hotel-1";\n  private dates = DateRange.create(new Date("2025-06-01"), new Date("2025-06-03"));\n  static aReservation() { return new ReservationFixture(); }\n  withGuest(id: string) { this.guestId = id; return this; }\n  withDates(checkIn: string, checkOut: string) {\n    this.dates = DateRange.create(new Date(checkIn), new Date(checkOut)); return this;\n  }\n  build() { return Reservation.create(this.guestId, this.hotelId, "room-1", this.dates, Money.of(5000, "RUB")); }\n}',
      explanation: 'Unit-тесты DateRange проверяют валидацию и логику overlap без зависимостей. Unit-тесты Reservation проверяют бизнес-правила (создание, отмена, двойная отмена). Application-тест CreateReservationUseCase использует InMemory-фейки для проверки координации. Fixture Builder упрощает создание тестовых данных. Все тесты быстрые и не требуют БД.'
    }
  ]
}
