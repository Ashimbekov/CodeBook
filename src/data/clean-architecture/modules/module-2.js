export default {
  id: 2,
  title: 'Clean Architecture Роберта Мартина',
  description: 'Концепция чистой архитектуры: слои, правило зависимостей, Entities, Use Cases, Interface Adapters и Frameworks.',
  lessons: [
    {
      id: 1,
      title: 'Идея Clean Architecture',
      type: 'theory',
      content: [
        { type: 'text', value: 'Clean Architecture — архитектурный подход, предложенный Робертом Мартином (Uncle Bob) в 2012 году. Это синтез идей Hexagonal Architecture (Alistair Cockburn), Onion Architecture (Jeffrey Palermo) и других подходов.' },
        { type: 'heading', value: 'Главная цель' },
        { type: 'text', value: 'Разделить бизнес-логику и детали реализации (фреймворки, БД, UI). Бизнес-правила не должны знать, откуда приходят данные и куда уходят результаты.' },
        { type: 'heading', value: 'Ключевые принципы' },
        { type: 'list', value: [
          'Независимость от фреймворков — фреймворк это инструмент, а не ограничение',
          'Тестируемость — бизнес-логику можно тестировать без UI, БД и веб-сервера',
          'Независимость от UI — UI можно заменить без изменения бизнес-логики',
          'Независимость от БД — можно заменить PostgreSQL на MongoDB без изменения бизнес-правил',
          'Независимость от внешних агентов — бизнес-правила не знают о внешнем мире'
        ]},
        { type: 'tip', value: 'Clean Architecture — это не строгий набор правил, а набор принципов. Количество слоёв и их точные названия могут варьироваться. Неизменно одно: зависимости направлены внутрь.' }
      ]
    },
    {
      id: 2,
      title: 'Правило зависимостей (Dependency Rule)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Главное правило Clean Architecture: зависимости в исходном коде могут указывать только внутрь — от внешних слоёв к внутренним. Ничто из внутреннего слоя не может знать о чём-то из внешнего слоя.' },
        { type: 'heading', value: 'Слои (от внешнего к внутреннему)' },
        { type: 'list', value: [
          'Frameworks & Drivers — фреймворки, БД, UI, веб (внешний слой)',
          'Interface Adapters — контроллеры, презентеры, шлюзы (адаптеры)',
          'Application Business Rules — Use Cases (бизнес-сценарии)',
          'Enterprise Business Rules — Entities (бизнес-сущности, внутренний слой)'
        ]},
        { type: 'code', language: 'java', value: '// Entities (внутренний слой) — не знают о Use Cases, не знают о БД\npublic class Order {\n    private OrderId id;\n    private Money totalAmount;\n    private OrderStatus status;\n    \n    public void confirm() {\n        if (this.status != OrderStatus.PENDING) {\n            throw new IllegalStateException("Можно подтвердить только ожидающий заказ");\n        }\n        this.status = OrderStatus.CONFIRMED;\n    }\n}\n\n// Use Case (средний слой) — знает об Entities, но не знает о БД\npublic class ConfirmOrderUseCase {\n    private final OrderRepository orderRepository; // интерфейс!\n    \n    public void execute(OrderId orderId) {\n        Order order = orderRepository.findById(orderId);\n        order.confirm();\n        orderRepository.save(order);\n    }\n}\n\n// Repository Implementation (внешний слой) — знает о БД\npublic class JpaOrderRepository implements OrderRepository {\n    private final JpaEntityManager em;\n    \n    public Order findById(OrderId id) {\n        return em.find(OrderEntity.class, id.value()).toDomain();\n    }\n}' },
        { type: 'warning', value: 'Нарушение правила зависимостей — главный anti-pattern. Если Entity импортирует Spring-аннотацию или JPA-аннотацию — правило нарушено. Entity не должен знать о фреймворке.' }
      ]
    },
    {
      id: 3,
      title: 'Слой Entities',
      type: 'theory',
      content: [
        { type: 'text', value: 'Entities — самый внутренний слой. Здесь живут бизнес-сущности и бизнес-правила, которые не зависят от конкретного приложения. Это правила, которые были бы одинаковы, даже если бы приложения не существовало.' },
        { type: 'heading', value: 'Что содержат Entities' },
        { type: 'list', value: [
          'Бизнес-объекты с поведением (не просто данные)',
          'Бизнес-правила, специфичные для предметной области',
          'Value Objects — неизменяемые объекты без идентичности',
          'Domain Events — события предметной области'
        ]},
        { type: 'code', language: 'java', value: '// Entity с бизнес-логикой\npublic class BankAccount {\n    private AccountId id;\n    private Money balance;\n    private AccountStatus status;\n    \n    // Бизнес-правило: нельзя снять больше, чем есть на счёте\n    public void withdraw(Money amount) {\n        if (this.status != AccountStatus.ACTIVE) {\n            throw new AccountNotActiveException(this.id);\n        }\n        if (amount.isGreaterThan(this.balance)) {\n            throw new InsufficientFundsException(this.balance, amount);\n        }\n        this.balance = this.balance.subtract(amount);\n    }\n    \n    // Бизнес-правило: перевод между счетами\n    public void transferTo(BankAccount target, Money amount) {\n        this.withdraw(amount);\n        target.deposit(amount);\n    }\n}' },
        { type: 'code', language: 'typescript', value: '// Value Object — неизменяемый, сравнивается по значению\nclass Money {\n  private constructor(\n    private readonly amount: number,\n    private readonly currency: string\n  ) {\n    if (amount < 0) throw new Error("Сумма не может быть отрицательной");\n  }\n\n  static of(amount: number, currency: string): Money {\n    return new Money(amount, currency);\n  }\n\n  add(other: Money): Money {\n    if (this.currency !== other.currency) {\n      throw new Error("Нельзя сложить разные валюты");\n    }\n    return new Money(this.amount + other.amount, this.currency);\n  }\n\n  equals(other: Money): boolean {\n    return this.amount === other.amount && this.currency === other.currency;\n  }\n}' },
        { type: 'note', value: 'Entities — это НЕ ORM-сущности с аннотациями @Entity. Это чистые доменные объекты, свободные от любых инфраструктурных зависимостей.' }
      ]
    },
    {
      id: 4,
      title: 'Слой Use Cases',
      type: 'theory',
      content: [
        { type: 'text', value: 'Use Cases (Application Business Rules) содержат бизнес-логику, специфичную для конкретного приложения. Каждый Use Case представляет один сценарий использования системы.' },
        { type: 'heading', value: 'Принципы Use Cases' },
        { type: 'list', value: [
          'Один Use Case = один бизнес-сценарий (Single Responsibility)',
          'Use Case оркестрирует Entities, но не содержит бизнес-правил домена',
          'Определяет интерфейсы (порты) для внешних зависимостей',
          'Не знает о конкретных технологиях (HTTP, SQL, SMTP)'
        ]},
        { type: 'code', language: 'java', value: '// Use Case: оформление заказа\npublic class PlaceOrderUseCase {\n    private final OrderRepository orderRepository;\n    private final ProductRepository productRepository;\n    private final PaymentGateway paymentGateway; // интерфейс, не реализация!\n    private final OrderConfirmationSender confirmationSender; // интерфейс\n    \n    public PlaceOrderUseCase(\n        OrderRepository orderRepository,\n        ProductRepository productRepository,\n        PaymentGateway paymentGateway,\n        OrderConfirmationSender confirmationSender\n    ) {\n        this.orderRepository = orderRepository;\n        this.productRepository = productRepository;\n        this.paymentGateway = paymentGateway;\n        this.confirmationSender = confirmationSender;\n    }\n    \n    public OrderResult execute(PlaceOrderCommand command) {\n        // 1. Получить продукты\n        List<Product> products = productRepository.findAllByIds(command.productIds());\n        \n        // 2. Создать заказ (бизнес-логика в Entity)\n        Order order = Order.create(command.customerId(), products);\n        \n        // 3. Провести оплату\n        PaymentResult payment = paymentGateway.charge(\n            command.paymentMethod(), order.totalAmount()\n        );\n        \n        if (!payment.isSuccessful()) {\n            return OrderResult.paymentFailed(payment.errorMessage());\n        }\n        \n        // 4. Подтвердить заказ\n        order.confirm(payment.transactionId());\n        orderRepository.save(order);\n        \n        // 5. Отправить подтверждение\n        confirmationSender.send(order);\n        \n        return OrderResult.success(order.id());\n    }\n}' },
        { type: 'tip', value: 'Use Case не должен быть толстым. Если в нём слишком много логики — скорее всего, часть логики должна быть в Entity. Use Case оркестрирует, а не вычисляет.' }
      ]
    },
    {
      id: 5,
      title: 'Interface Adapters и Frameworks',
      type: 'theory',
      content: [
        { type: 'text', value: 'Два внешних слоя отвечают за связь с внешним миром. Interface Adapters преобразуют данные между форматами Use Cases и внешнего мира. Frameworks & Drivers — конкретные технологические реализации.' },
        { type: 'heading', value: 'Interface Adapters' },
        { type: 'list', value: [
          'Controllers — принимают HTTP-запросы, вызывают Use Cases',
          'Presenters — форматируют данные для ответа',
          'Gateways — реализации интерфейсов репозиториев',
          'Mappers — преобразование между доменными и инфраструктурными моделями'
        ]},
        { type: 'code', language: 'typescript', value: '// Controller (Interface Adapter) — преобразует HTTP → Use Case\nclass CreateOrderController {\n  constructor(private placeOrderUseCase: PlaceOrderUseCase) {}\n\n  async handle(req: HttpRequest): Promise<HttpResponse> {\n    // Преобразуем HTTP-запрос в команду Use Case\n    const command: PlaceOrderCommand = {\n      customerId: req.body.customerId,\n      productIds: req.body.items.map((i: any) => i.productId),\n      paymentMethod: req.body.payment,\n    };\n\n    // Вызываем Use Case\n    const result = await this.placeOrderUseCase.execute(command);\n\n    // Преобразуем результат в HTTP-ответ\n    if (result.isSuccess) {\n      return { status: 201, body: { orderId: result.orderId } };\n    }\n    return { status: 400, body: { error: result.errorMessage } };\n  }\n}' },
        { type: 'heading', value: 'Frameworks & Drivers' },
        { type: 'text', value: 'Самый внешний слой. Сюда попадает всё технологическое: Express/Spring/NestJS, PostgreSQL/MongoDB, React/Angular, SMTP-клиенты и т.д. Этот слой — деталь реализации, которую можно заменить.' },
        { type: 'code', language: 'java', value: '// Frameworks & Drivers — конкретная технология\n@RestController\n@RequestMapping("/api/orders")\npublic class SpringOrderController {\n    private final CreateOrderController controller; // наш адаптер\n    \n    @PostMapping\n    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {\n        HttpResponse response = controller.handle(toHttpRequest(request));\n        return ResponseEntity.status(response.status()).body(response.body());\n    }\n}' },
        { type: 'warning', value: 'Аннотации фреймворка (@RestController, @Entity, @Injectable) должны быть только на внешних слоях. Если вы видите @Entity на доменном объекте — архитектура нарушена.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: структура Clean Architecture проекта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте структуру проекта по принципам Clean Architecture для системы управления библиотекой.',
      requirements: [
        'Создать Entity: Book с бизнес-правилами (бронирование, возврат)',
        'Создать Value Object: ISBN с валидацией',
        'Создать Use Case: BorrowBookUseCase',
        'Определить интерфейс BookRepository',
        'Реализовать Controller, который вызывает Use Case'
      ],
      hint: 'Начните с доменного слоя: определите Entity и Value Objects. Затем создайте Use Case, который использует интерфейс репозитория. Контроллер и реализация репозитория — в последнюю очередь.',
      expectedOutput: 'Проект структурирован по слоям Clean Architecture: domain (Book, ISBN), application (BorrowBookUseCase, BookRepository интерфейс), infrastructure (JpaBookRepository), presentation (BookController).',
      solution: '// domain/entities/Book.java\npublic class Book {\n    private BookId id;\n    private ISBN isbn;\n    private String title;\n    private BookStatus status;\n    private UserId borrowedBy;\n\n    public void borrow(UserId userId) {\n        if (this.status != BookStatus.AVAILABLE) {\n            throw new BookNotAvailableException(this.id);\n        }\n        this.status = BookStatus.BORROWED;\n        this.borrowedBy = userId;\n    }\n\n    public void returnBook() {\n        if (this.status != BookStatus.BORROWED) {\n            throw new BookNotBorrowedException(this.id);\n        }\n        this.status = BookStatus.AVAILABLE;\n        this.borrowedBy = null;\n    }\n}\n\n// domain/valueobjects/ISBN.java\npublic record ISBN(String value) {\n    public ISBN {\n        if (!value.matches("^(97[89])-\\\\d{1,5}-\\\\d{1,7}-\\\\d{1,7}-\\\\d$")) {\n            throw new InvalidISBNException(value);\n        }\n    }\n}\n\n// application/usecases/BorrowBookUseCase.java\npublic class BorrowBookUseCase {\n    private final BookRepository bookRepository;\n\n    public void execute(BookId bookId, UserId userId) {\n        Book book = bookRepository.findById(bookId)\n            .orElseThrow(() -> new BookNotFoundException(bookId));\n        book.borrow(userId);\n        bookRepository.save(book);\n    }\n}\n\n// application/ports/BookRepository.java\npublic interface BookRepository {\n    Optional<Book> findById(BookId id);\n    void save(Book book);\n}',
      explanation: 'Зависимости направлены внутрь: Controller → UseCase → Entity. BookRepository — интерфейс, определённый в слое application. Его реализация (JpaBookRepository) находится в слое infrastructure и зависит от интерфейса, а не наоборот.'
    }
  ]
}
