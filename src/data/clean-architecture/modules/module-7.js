export default {
  id: 7,
  title: 'DDD: Repository и Domain Services',
  description: 'Паттерн Repository для работы с агрегатами, Domain Services для кросс-агрегатной логики, Specification Pattern.',
  lessons: [
    {
      id: 1,
      title: 'Паттерн Repository',
      type: 'theory',
      content: [
        { type: 'text', value: 'Repository (репозиторий) — абстракция, которая имитирует коллекцию доменных объектов. Доменный код работает с Repository как с коллекцией в памяти, не зная о деталях хранения (SQL, NoSQL, файлы).' },
        { type: 'heading', value: 'Правила Repository в DDD' },
        { type: 'list', value: [
          'Один Repository на один Aggregate Root',
          'Repository работает с доменными объектами, не с ORM-сущностями',
          'Интерфейс Repository определён в доменном слое',
          'Реализация — в инфраструктурном слое',
          'Repository скрывает детали хранения и маппинга'
        ]},
        { type: 'code', language: 'java', value: '// Интерфейс Repository — в доменном слое\npublic interface OrderRepository {\n    Optional<Order> findById(OrderId id);\n    void save(Order order);       // и для создания, и для обновления\n    void delete(Order order);\n    List<Order> findByCustomerId(CustomerId customerId);\n}\n\n// НЕЛЬЗЯ: Repository для внутреннего объекта агрегата\n// public interface OrderLineRepository { ... } // НЕПРАВИЛЬНО!\n// OrderLine — часть агрегата Order, доступ только через Order' },
        { type: 'heading', value: 'Save vs Add + Update' },
        { type: 'text', value: 'Есть два подхода к API репозитория. Collection-oriented (как коллекция): add(), remove(), find(). Persistence-oriented (как хранилище): save(). Второй подход проще — save() и создаёт, и обновляет.' },
        { type: 'tip', value: 'Repository — это не DAO (Data Access Object). DAO работает с таблицами БД. Repository работает с агрегатами домена. DAO возвращает строки, Repository — доменные объекты.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация Repository',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реализация Repository находится в инфраструктурном слое и отвечает за маппинг между доменной моделью и моделью хранения.' },
        { type: 'code', language: 'java', value: '// Реализация для JPA/Hibernate\npublic class JpaOrderRepository implements OrderRepository {\n    private final EntityManager em;\n    private final OrderMapper mapper;\n    \n    public JpaOrderRepository(EntityManager em, OrderMapper mapper) {\n        this.em = em;\n        this.mapper = mapper;\n    }\n    \n    @Override\n    public Optional<Order> findById(OrderId id) {\n        OrderJpaEntity entity = em.find(OrderJpaEntity.class, id.value());\n        return Optional.ofNullable(entity).map(mapper::toDomain);\n    }\n    \n    @Override\n    public void save(Order order) {\n        OrderJpaEntity entity = mapper.toJpa(order);\n        em.merge(entity); // merge обрабатывает и insert, и update\n        \n        // Публикуем доменные события после сохранения\n        order.getDomainEvents().forEach(event -> \n            em.unwrap(Session.class)\n               .getSessionFactory()\n               .getEventPublisher()\n               .publish(event)\n        );\n        order.clearEvents();\n    }\n}\n\n// Mapper: Domain <-> JPA\npublic class OrderMapper {\n    public Order toDomain(OrderJpaEntity entity) {\n        return Order.reconstitute(\n            new OrderId(entity.getId()),\n            new CustomerId(entity.getCustomerId()),\n            entity.getLines().stream()\n                .map(this::lineToDomain)\n                .toList(),\n            OrderStatus.valueOf(entity.getStatus()),\n            Money.of(entity.getTotalAmount(), entity.getCurrency())\n        );\n    }\n    \n    public OrderJpaEntity toJpa(Order order) {\n        OrderJpaEntity entity = new OrderJpaEntity();\n        entity.setId(order.id().value());\n        entity.setCustomerId(order.customerId().value());\n        entity.setStatus(order.status().name());\n        entity.setTotalAmount(order.totalAmount().amount());\n        entity.setCurrency(order.totalAmount().currency().code());\n        return entity;\n    }\n}' },
        { type: 'note', value: 'Маппинг — это "налог" за чистую архитектуру. Он добавляет код, но даёт независимость доменной модели от модели хранения. Таблицы могут меняться без изменения бизнес-логики.' }
      ]
    },
    {
      id: 3,
      title: 'Domain Services',
      type: 'theory',
      content: [
        { type: 'text', value: 'Domain Service — сервис в доменном слое, содержащий бизнес-логику, которая не принадлежит ни одной конкретной сущности. Типично это операции, затрагивающие несколько агрегатов.' },
        { type: 'heading', value: 'Когда использовать Domain Service' },
        { type: 'list', value: [
          'Операция включает несколько агрегатов',
          'Операция реализует бизнес-правило, но не является частью ни одной сущности',
          'Операция требует доступа к данным другого агрегата для принятия решения',
          'НЕ используйте, если логику можно поместить в Entity'
        ]},
        { type: 'code', language: 'java', value: '// Domain Service: перевод денег между счетами\npublic class MoneyTransferService {\n    \n    // Бизнес-правило: перевод с комиссией\n    public TransferResult transfer(\n        BankAccount source,\n        BankAccount destination,\n        Money amount\n    ) {\n        // Бизнес-правило: комиссия за перевод между банками\n        Money fee = calculateFee(source, destination, amount);\n        Money totalDebit = amount.add(fee);\n        \n        // Бизнес-правило: проверка суточного лимита\n        if (source.dailyTransferAmount().add(totalDebit)\n                .isGreaterThan(source.dailyLimit())) {\n            return TransferResult.limitExceeded();\n        }\n        \n        source.withdraw(totalDebit);\n        destination.deposit(amount);\n        \n        return TransferResult.success(fee);\n    }\n    \n    private Money calculateFee(BankAccount source, BankAccount destination, Money amount) {\n        if (source.bankId().equals(destination.bankId())) {\n            return Money.ZERO; // внутрибанковский — бесплатно\n        }\n        return amount.percentage(1); // 1% за межбанковский\n    }\n}' },
        { type: 'heading', value: 'Domain Service vs Application Service' },
        { type: 'text', value: 'Domain Service содержит бизнес-логику и живёт в доменном слое. Application Service — координатор, он живёт в слое приложения и не содержит бизнес-логики.' },
        { type: 'code', language: 'java', value: '// Application Service: координирует, НЕ содержит бизнес-логику\npublic class TransferMoneyUseCase {\n    private final AccountRepository accountRepo;\n    private final MoneyTransferService transferService; // Domain Service\n    \n    public TransferResultDto execute(TransferCommand cmd) {\n        BankAccount source = accountRepo.findById(cmd.sourceId());\n        BankAccount dest = accountRepo.findById(cmd.destId());\n        Money amount = Money.of(cmd.amount(), cmd.currency());\n        \n        // Делегируем бизнес-логику Domain Service\n        TransferResult result = transferService.transfer(source, dest, amount);\n        \n        if (result.isSuccess()) {\n            accountRepo.save(source);\n            accountRepo.save(dest);\n        }\n        return TransferResultDto.from(result);\n    }\n}' },
        { type: 'warning', value: 'Не злоупотребляйте Domain Services. Если логику можно поместить в Entity — поместите в Entity. Domain Service — для случаев, когда Entity не может содержать всю логику (например, работа с несколькими агрегатами).' }
      ]
    },
    {
      id: 4,
      title: 'Specification Pattern',
      type: 'theory',
      content: [
        { type: 'text', value: 'Specification Pattern — способ инкапсулировать бизнес-правила в отдельные объекты, которые можно комбинировать, переиспользовать и тестировать независимо.' },
        { type: 'code', language: 'java', value: '// Базовый интерфейс Specification\npublic interface Specification<T> {\n    boolean isSatisfiedBy(T entity);\n    \n    default Specification<T> and(Specification<T> other) {\n        return entity -> this.isSatisfiedBy(entity) && other.isSatisfiedBy(entity);\n    }\n    \n    default Specification<T> or(Specification<T> other) {\n        return entity -> this.isSatisfiedBy(entity) || other.isSatisfiedBy(entity);\n    }\n    \n    default Specification<T> not() {\n        return entity -> !this.isSatisfiedBy(entity);\n    }\n}\n\n// Конкретные спецификации\npublic class OrderOverAmountSpec implements Specification<Order> {\n    private final Money threshold;\n    \n    public OrderOverAmountSpec(Money threshold) { this.threshold = threshold; }\n    \n    @Override\n    public boolean isSatisfiedBy(Order order) {\n        return order.totalAmount().isGreaterThan(threshold);\n    }\n}\n\npublic class OrderInStatusSpec implements Specification<Order> {\n    private final OrderStatus status;\n    \n    public OrderInStatusSpec(OrderStatus status) { this.status = status; }\n    \n    @Override\n    public boolean isSatisfiedBy(Order order) {\n        return order.status() == status;\n    }\n}\n\n// Комбинирование спецификаций\nSpecification<Order> highValuePendingOrders = \n    new OrderOverAmountSpec(Money.of(10000, "RUB"))\n        .and(new OrderInStatusSpec(OrderStatus.PENDING));\n\n// Использование\nList<Order> filtered = orders.stream()\n    .filter(highValuePendingOrders::isSatisfiedBy)\n    .toList();' },
        { type: 'code', language: 'typescript', value: '// Specification Pattern в TypeScript\ninterface Specification<T> {\n  isSatisfiedBy(entity: T): boolean;\n}\n\nclass AndSpecification<T> implements Specification<T> {\n  constructor(\n    private left: Specification<T>,\n    private right: Specification<T>\n  ) {}\n  \n  isSatisfiedBy(entity: T): boolean {\n    return this.left.isSatisfiedBy(entity) && this.right.isSatisfiedBy(entity);\n  }\n}\n\n// Бизнес-правило: клиент может получить премиум-статус\nclass EligibleForPremiumSpec implements Specification<Customer> {\n  isSatisfiedBy(customer: Customer): boolean {\n    return customer.totalPurchases.isGreaterThan(Money.of(100000))\n      && customer.accountAge() > 365\n      && customer.hasNoComplaints();\n  }\n}' },
        { type: 'tip', value: 'Specification отлично подходит для валидации, фильтрации и бизнес-правил доступа. Спецификации можно использовать и в Repository — для фильтрации на уровне БД.' }
      ]
    },
    {
      id: 5,
      title: 'Unit of Work и транзакции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Unit of Work — паттерн, который отслеживает все изменения доменных объектов в рамках одной бизнес-операции и сохраняет их атомарно (в одной транзакции).' },
        { type: 'heading', value: 'Зачем Unit of Work?' },
        { type: 'text', value: 'Без Unit of Work каждый вызов repository.save() выполняет отдельный запрос к БД. Если второй save() упадёт — первый уже записан, и данные рассогласованы. Unit of Work решает эту проблему.' },
        { type: 'code', language: 'typescript', value: '// Unit of Work интерфейс\ninterface UnitOfWork {\n  orderRepository: OrderRepository;\n  customerRepository: CustomerRepository;\n  commit(): Promise<void>;\n  rollback(): Promise<void>;\n}\n\n// Реализация с транзакцией БД\nclass DatabaseUnitOfWork implements UnitOfWork {\n  orderRepository: OrderRepository;\n  customerRepository: CustomerRepository;\n  private transaction: Transaction;\n\n  constructor(private dataSource: DataSource) {\n    this.transaction = dataSource.createTransaction();\n    this.orderRepository = new SqlOrderRepository(this.transaction);\n    this.customerRepository = new SqlCustomerRepository(this.transaction);\n  }\n\n  async commit(): Promise<void> {\n    await this.transaction.commit();\n  }\n\n  async rollback(): Promise<void> {\n    await this.transaction.rollback();\n  }\n}\n\n// Использование в Application Service\nclass PlaceOrderUseCase {\n  constructor(private uowFactory: () => UnitOfWork) {}\n\n  async execute(command: PlaceOrderCommand): Promise<void> {\n    const uow = this.uowFactory();\n    try {\n      const customer = await uow.customerRepository.findById(command.customerId);\n      const order = Order.create(customer.id, command.items);\n      customer.addOrder(order.id);\n      \n      await uow.orderRepository.save(order);\n      await uow.customerRepository.save(customer);\n      await uow.commit(); // атомарно!\n    } catch (error) {\n      await uow.rollback();\n      throw error;\n    }\n  }\n}' },
        { type: 'note', value: 'В JPA/Hibernate Unit of Work реализован из коробки через EntityManager и @Transactional. В TypeScript/Node.js обычно реализуют вручную.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Repository и Domain Service',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Repository и Domain Service для системы управления складом.',
      requirements: [
        'Создать Aggregate: Product с количеством на складе',
        'Создать интерфейс ProductRepository с методами findById, save, findLowStock',
        'Реализовать Domain Service: InventoryService для перемещения товаров',
        'Реализовать Specification: LowStockSpecification',
        'Реализовать Application Service: TransferProductUseCase'
      ],
      hint: 'Product — агрегат с бизнес-правилами (нельзя списать больше, чем есть). InventoryService — Domain Service для перемещения между складами. LowStockSpecification проверяет, что товаров мало.',
      expectedOutput: 'Product содержит бизнес-логику управления остатками, Repository абстрагирует хранение, Domain Service координирует перемещение, Specification фильтрует товары с низким остатком.',
      solution: '// Aggregate: Product\npublic class Product extends AggregateRoot {\n    private ProductId id;\n    private String name;\n    private int quantity;\n    private int reorderLevel;\n    \n    public void addStock(int amount) {\n        if (amount <= 0) throw new InvalidQuantityException();\n        this.quantity += amount;\n    }\n    \n    public void removeStock(int amount) {\n        if (amount <= 0) throw new InvalidQuantityException();\n        if (amount > this.quantity) {\n            throw new InsufficientStockException(this.id, this.quantity, amount);\n        }\n        this.quantity -= amount;\n        if (this.quantity <= this.reorderLevel) {\n            registerEvent(new LowStockEvent(this.id, this.quantity));\n        }\n    }\n    \n    public boolean isLowStock() {\n        return this.quantity <= this.reorderLevel;\n    }\n}\n\n// Repository Interface\npublic interface ProductRepository {\n    Optional<Product> findById(ProductId id);\n    void save(Product product);\n    List<Product> findAll(Specification<Product> spec);\n}\n\n// Specification\npublic class LowStockSpec implements Specification<Product> {\n    public boolean isSatisfiedBy(Product product) {\n        return product.isLowStock();\n    }\n}\n\n// Domain Service\npublic class InventoryService {\n    public void transferStock(Product source, Product destination, int quantity) {\n        source.removeStock(quantity);\n        destination.addStock(quantity);\n    }\n}\n\n// Application Service\npublic class TransferProductUseCase {\n    private final ProductRepository repo;\n    private final InventoryService inventoryService;\n    \n    public void execute(TransferCommand cmd) {\n        Product source = repo.findById(cmd.sourceId()).orElseThrow();\n        Product dest = repo.findById(cmd.destId()).orElseThrow();\n        inventoryService.transferStock(source, dest, cmd.quantity());\n        repo.save(source);\n        repo.save(dest);\n    }\n}',
      explanation: 'Product — агрегат с бизнес-логикой управления остатками. removeStock() генерирует LowStockEvent при достижении порога. InventoryService — Domain Service, координирующий перемещение между двумя Product. Application Service (TransferProductUseCase) загружает агрегаты, делегирует логику Domain Service и сохраняет результат.'
    }
  ]
}
