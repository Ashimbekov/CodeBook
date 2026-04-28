export default {
  id: 12,
  title: 'Слой Application',
  description: 'Application-слой: Use Cases, DTO, Application Services, валидация входных данных и координация бизнес-процессов.',
  lessons: [
    {
      id: 1,
      title: 'Роль Application-слоя',
      type: 'theory',
      content: [
        { type: 'text', value: 'Application-слой (слой приложения) — посредник между внешним миром и доменом. Он координирует выполнение бизнес-сценариев, но НЕ содержит бизнес-логики. Вся бизнес-логика — в Domain-слое.' },
        { type: 'heading', value: 'Ответственности Application-слоя' },
        { type: 'list', value: [
          'Оркестрация Use Cases — последовательность шагов бизнес-процесса',
          'Управление транзакциями — начало, коммит, откат',
          'Валидация входных данных — формат, обязательные поля',
          'Маппинг DTO ↔ Domain — преобразование между мирами',
          'Публикация событий — после успешного сохранения',
          'Авторизация — проверка прав на операцию'
        ]},
        { type: 'heading', value: 'Чего НЕ должно быть в Application-слое' },
        { type: 'list', value: [
          'Бизнес-правил — они в Domain',
          'SQL-запросов — они в Infrastructure',
          'HTTP-логики — она в Presentation',
          'Ссылок на фреймворки — они в Infrastructure'
        ]},
        { type: 'tip', value: 'Тонкий Application Service — признак хорошей архитектуры. Если Application Service содержит if-else с бизнес-логикой — значит, логика утекла из Domain.' }
      ]
    },
    {
      id: 2,
      title: 'Use Cases: паттерн Command/Query',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый Use Case — отдельный класс с одним методом execute(). Это делает код читаемым, тестируемым и следует Single Responsibility Principle.' },
        { type: 'code', language: 'java', value: '// Один Use Case = один класс\npublic class RegisterUserUseCase {\n    private final UserRepository userRepo;\n    private final PasswordHasher passwordHasher;\n    private final EmailSender emailSender;\n    \n    public RegisterUserUseCase(\n        UserRepository userRepo,\n        PasswordHasher passwordHasher,\n        EmailSender emailSender\n    ) {\n        this.userRepo = userRepo;\n        this.passwordHasher = passwordHasher;\n        this.emailSender = emailSender;\n    }\n    \n    public UserDto execute(RegisterUserCommand command) {\n        // 1. Валидация на уровне приложения\n        if (userRepo.existsByEmail(new Email(command.email()))) {\n            throw new EmailAlreadyExistsException(command.email());\n        }\n        \n        // 2. Создание доменного объекта (бизнес-логика в конструкторе User)\n        User user = User.register(\n            new Email(command.email()),\n            new FullName(command.firstName(), command.lastName()),\n            passwordHasher.hash(command.password())\n        );\n        \n        // 3. Сохранение\n        userRepo.save(user);\n        \n        // 4. Side-effects\n        emailSender.sendWelcome(user.email());\n        \n        // 5. Возврат DTO\n        return UserDto.from(user);\n    }\n}' },
        { type: 'heading', value: 'Input: Command и Query объекты' },
        { type: 'code', language: 'java', value: '// Command — данные для изменения\npublic record RegisterUserCommand(\n    String email,\n    String firstName,\n    String lastName,\n    String password\n) {}\n\n// Query — данные для запроса\npublic record GetUserProfileQuery(String userId) {}\npublic record SearchUsersQuery(String keyword, int page, int pageSize) {}' },
        { type: 'note', value: 'Каждый Use Case принимает Command/Query (входные данные) и возвращает DTO (выходные данные). Доменные объекты НИКОГДА не покидают Use Case — наружу только DTO.' }
      ]
    },
    {
      id: 3,
      title: 'DTO: Data Transfer Objects',
      type: 'theory',
      content: [
        { type: 'text', value: 'DTO (Data Transfer Object) — объект для передачи данных между слоями. DTO не содержит бизнес-логики. Он защищает доменную модель от внешнего мира.' },
        { type: 'heading', value: 'Зачем DTO, если есть Entity?' },
        { type: 'list', value: [
          'Доменный объект может содержать больше данных, чем нужно клиенту',
          'Структура ответа может отличаться от структуры Entity',
          'Entity может измениться — DTO защищает публичный контракт',
          'Разные клиенты могут получать разные DTO для одного Entity'
        ]},
        { type: 'code', language: 'java', value: '// Entity — богатый объект с логикой\npublic class User {\n    private UserId id;\n    private Email email;\n    private FullName name;\n    private PasswordHash passwordHash; // чувствительные данные!\n    private UserRole role;\n    private Instant createdAt;\n    private Instant lastLoginAt;\n}\n\n// DTO для списка пользователей — минимум данных\npublic record UserListItemDto(\n    String id,\n    String name,\n    String email\n) {\n    public static UserListItemDto from(User user) {\n        return new UserListItemDto(\n            user.id().value().toString(),\n            user.name().fullName(),\n            user.email().value()\n        );\n    }\n}\n\n// DTO для профиля — больше данных, но без пароля!\npublic record UserProfileDto(\n    String id,\n    String firstName,\n    String lastName,\n    String email,\n    String role,\n    String memberSince\n) {\n    public static UserProfileDto from(User user) {\n        return new UserProfileDto(\n            user.id().value().toString(),\n            user.name().firstName(),\n            user.name().lastName(),\n            user.email().value(),\n            user.role().name(),\n            user.createdAt().toString()\n        );\n    }\n}' },
        { type: 'code', language: 'typescript', value: '// DTO в TypeScript\ninterface CreateProductCommand {\n  name: string;\n  description: string;\n  price: number;\n  currency: string;\n  categoryId: string;\n}\n\ninterface ProductDto {\n  id: string;\n  name: string;\n  description: string;\n  price: { amount: number; currency: string };\n  category: string;\n  createdAt: string;\n}\n\n// Mapper\nclass ProductMapper {\n  static toDto(product: Product): ProductDto {\n    return {\n      id: product.id.value,\n      name: product.name,\n      description: product.description,\n      price: {\n        amount: product.price.amount,\n        currency: product.price.currency,\n      },\n      category: product.categoryId.value,\n      createdAt: product.createdAt.toISOString(),\n    };\n  }\n}' },
        { type: 'warning', value: 'Никогда не возвращайте Entity из Use Case наружу! Это создаёт зависимость внешнего слоя от доменной модели. Всегда конвертируйте в DTO.' }
      ]
    },
    {
      id: 4,
      title: 'Валидация: Application vs Domain',
      type: 'theory',
      content: [
        { type: 'text', value: 'Валидация происходит на двух уровнях: Application-слой проверяет формат данных, Domain-слой проверяет бизнес-правила.' },
        { type: 'heading', value: 'Application-валидация (входные данные)' },
        { type: 'code', language: 'java', value: '// Application-валидация: формат, обязательные поля, длина\npublic class RegisterUserValidator {\n    public List<String> validate(RegisterUserCommand command) {\n        List<String> errors = new ArrayList<>();\n        \n        if (command.email() == null || command.email().isBlank()) {\n            errors.add("Email обязателен");\n        }\n        if (command.password() != null && command.password().length() < 8) {\n            errors.add("Пароль минимум 8 символов");\n        }\n        if (command.firstName() != null && command.firstName().length() > 100) {\n            errors.add("Имя не более 100 символов");\n        }\n        return errors;\n    }\n}' },
        { type: 'heading', value: 'Domain-валидация (бизнес-правила)' },
        { type: 'code', language: 'java', value: '// Domain-валидация: бизнес-правила, инварианты\npublic class Email {\n    private final String value;\n    \n    public Email(String value) {\n        // Доменное правило: формат email\n        if (!value.matches("^[\\\\w.-]+@[\\\\w.-]+\\\\.[a-zA-Z]{2,}$")) {\n            throw new InvalidEmailException(value);\n        }\n        this.value = value.toLowerCase();\n    }\n}\n\npublic class User {\n    // Доменное правило: нельзя зарегистрировать с запрещённым доменом\n    public static User register(Email email, FullName name, PasswordHash password) {\n        if (email.domain().equals("banned.com")) {\n            throw new BannedDomainException(email);\n        }\n        return new User(UserId.generate(), email, name, password);\n    }\n}' },
        { type: 'heading', value: 'Где какая валидация' },
        { type: 'list', value: [
          'Application: null-check, формат, длина, обязательные поля — "правильно ли заполнена форма?"',
          'Domain: бизнес-правила, инварианты, допустимые значения — "разрешает ли бизнес эту операцию?"',
          'Presentation: формат запроса (JSON schema, request validation) — "правильный ли HTTP-запрос?"'
        ]},
        { type: 'tip', value: 'Application-валидация — быстрая и дешёвая. Domain-валидация может требовать обращения к БД (проверка уникальности). Выполняйте Application-валидацию ДО вызова Domain-логики, чтобы не тратить ресурсы зря.' }
      ]
    },
    {
      id: 5,
      title: 'Application Services и транзакции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Application Service управляет транзакционными границами. Один Use Case = одна транзакция. Если что-то пойдёт не так — откат всей операции.' },
        { type: 'code', language: 'java', value: '// Application Service с управлением транзакциями\npublic class TransferMoneyUseCase {\n    private final AccountRepository accountRepo;\n    private final TransferService transferService;\n    private final TransactionManager txManager;\n    private final EventPublisher eventPublisher;\n    \n    public TransferResultDto execute(TransferMoneyCommand command) {\n        // Валидация входных данных\n        validateCommand(command);\n        \n        return txManager.executeInTransaction(() -> {\n            // Загрузка агрегатов\n            BankAccount source = accountRepo.findById(\n                new AccountId(command.sourceAccountId())\n            ).orElseThrow(() -> new AccountNotFoundException(command.sourceAccountId()));\n            \n            BankAccount destination = accountRepo.findById(\n                new AccountId(command.destinationAccountId())\n            ).orElseThrow(() -> new AccountNotFoundException(command.destinationAccountId()));\n            \n            Money amount = Money.of(command.amount(), command.currency());\n            \n            // Бизнес-логика делегирована Domain Service\n            TransferResult result = transferService.transfer(source, destination, amount);\n            \n            // Сохранение\n            accountRepo.save(source);\n            accountRepo.save(destination);\n            \n            // Публикация событий после коммита\n            source.domainEvents().forEach(eventPublisher::publish);\n            destination.domainEvents().forEach(eventPublisher::publish);\n            \n            return TransferResultDto.from(result);\n        });\n    }\n}' },
        { type: 'code', language: 'typescript', value: '// TypeScript: Use Case с транзакцией\nclass TransferMoneyUseCase {\n  constructor(\n    private accountRepo: AccountRepository,\n    private transferService: TransferService,\n    private unitOfWork: UnitOfWork\n  ) {}\n\n  async execute(command: TransferMoneyCommand): Promise<TransferResultDto> {\n    return this.unitOfWork.run(async () => {\n      const source = await this.accountRepo.findById(command.sourceId);\n      const destination = await this.accountRepo.findById(command.destId);\n      const amount = Money.of(command.amount, command.currency);\n      \n      const result = this.transferService.transfer(source, destination, amount);\n      \n      await this.accountRepo.save(source);\n      await this.accountRepo.save(destination);\n      \n      return TransferResultDto.from(result);\n    });\n  }\n}' },
        { type: 'note', value: 'Application Service — тонкий координатор: загрузить → делегировать Domain → сохранить → опубликовать события. Если он толстый — бизнес-логика утекла из Domain.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Application-слой для интернет-магазина',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Application-слой для интернет-магазина: Use Cases для корзины и оформления заказа.',
      requirements: [
        'Создать Command: AddToCartCommand, PlaceOrderCommand',
        'Создать Query: GetCartQuery, GetOrderHistoryQuery',
        'Реализовать AddToCartUseCase с валидацией',
        'Реализовать PlaceOrderUseCase с транзакцией',
        'Определить DTO для ответов: CartDto, OrderDto'
      ],
      hint: 'AddToCartUseCase загружает Cart и Product, вызывает cart.addItem(). PlaceOrderUseCase создаёт Order из Cart, проводит оплату через PaymentGateway и сохраняет. Все зависимости — через интерфейсы.',
      expectedOutput: 'Application-слой координирует бизнес-процессы: валидация → загрузка → делегирование Domain → сохранение → публикация событий. Use Cases тонкие, бизнес-логика в Domain.',
      solution: '// Commands\npublic record AddToCartCommand(String userId, String productId, int quantity) {}\npublic record PlaceOrderCommand(String userId, String paymentMethodId, String shippingAddress) {}\n\n// DTOs\npublic record CartDto(\n    String userId,\n    List<CartItemDto> items,\n    String totalAmount\n) {\n    public static CartDto from(Cart cart) {\n        return new CartDto(\n            cart.userId().value().toString(),\n            cart.items().stream().map(CartItemDto::from).toList(),\n            cart.total().toString()\n        );\n    }\n}\n\npublic record CartItemDto(String productId, String productName, int quantity, String price) {\n    public static CartItemDto from(CartItem item) {\n        return new CartItemDto(\n            item.productId().value().toString(),\n            item.productName(), item.quantity(), item.lineTotal().toString());\n    }\n}\n\n// Use Case: Добавление в корзину\npublic class AddToCartUseCase {\n    private final CartRepository cartRepo;\n    private final ProductRepository productRepo;\n    \n    public CartDto execute(AddToCartCommand cmd) {\n        if (cmd.quantity() <= 0) throw new ValidationException("Количество > 0");\n        \n        Product product = productRepo.findById(new ProductId(cmd.productId()))\n            .orElseThrow(() -> new ProductNotFoundException(cmd.productId()));\n        \n        Cart cart = cartRepo.findByUserId(new UserId(cmd.userId()))\n            .orElse(Cart.create(new UserId(cmd.userId())));\n        \n        cart.addItem(product.id(), product.name(), cmd.quantity(), product.price());\n        cartRepo.save(cart);\n        \n        return CartDto.from(cart);\n    }\n}\n\n// Use Case: Оформление заказа\npublic class PlaceOrderUseCase {\n    private final CartRepository cartRepo;\n    private final OrderRepository orderRepo;\n    private final PaymentGateway paymentGateway;\n    private final EventPublisher eventPublisher;\n    \n    @Transactional\n    public OrderDto execute(PlaceOrderCommand cmd) {\n        Cart cart = cartRepo.findByUserId(new UserId(cmd.userId()))\n            .orElseThrow(() -> new CartNotFoundException(cmd.userId()));\n        \n        Order order = Order.createFromCart(cart, new Address(cmd.shippingAddress()));\n        \n        PaymentResult payment = paymentGateway.charge(\n            new PaymentMethodId(cmd.paymentMethodId()), order.total());\n        \n        if (!payment.isSuccess()) {\n            throw new PaymentFailedException(payment.error());\n        }\n        order.markPaid(payment.transactionId());\n        orderRepo.save(order);\n        \n        cart.clear();\n        cartRepo.save(cart);\n        \n        order.domainEvents().forEach(eventPublisher::publish);\n        return OrderDto.from(order);\n    }\n}',
      explanation: 'AddToCartUseCase: валидирует количество, находит Product, загружает Cart, делегирует cart.addItem() (бизнес-логика в Cart). PlaceOrderUseCase: создаёт Order из Cart (логика в Order.createFromCart()), проводит оплату через PaymentGateway (интерфейс), очищает корзину, публикует события. Use Cases тонкие — они координируют, а не вычисляют.'
    }
  ]
}
