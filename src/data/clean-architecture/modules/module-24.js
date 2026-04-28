export default {
  id: 24,
  title: 'Рефакторинг к чистой архитектуре',
  description: 'Пошаговая миграция Legacy-кода к Clean Architecture: стратегия Strangler Fig, выделение слоёв, инверсия зависимостей.',
  lessons: [
    {
      id: 1,
      title: 'Оценка текущего состояния',
      type: 'theory',
      content: [
        { type: 'text', value: 'Прежде чем рефакторить, нужно понять текущее состояние: какие зависимости, где бизнес-логика, какие anti-patterns присутствуют.' },
        { type: 'heading', value: 'Чеклист для оценки' },
        { type: 'list', value: [
          'Есть ли разделение на слои? Или всё в одном пакете?',
          'Где живёт бизнес-логика? В Entity (хорошо) или в Service (плохо)?',
          'Зависит ли Domain от фреймворка? (аннотации @Entity, @Autowired)',
          'Есть ли интерфейсы для репозиториев?',
          'Можно ли тестировать бизнес-логику без БД?',
          'Есть ли циклические зависимости между пакетами?'
        ]},
        { type: 'heading', value: 'Типичное Legacy-состояние' },
        { type: 'code', language: 'java', value: '// Типичный Legacy-код\n@Service\npublic class OrderService {\n    @Autowired\n    private OrderRepository orderRepository; // Spring Data JPA\n    \n    @Autowired\n    private JavaMailSender mailSender;\n    \n    @Transactional\n    public void createOrder(CreateOrderDto dto) {\n        // Валидация, бизнес-логика, маппинг, отправка email — всё в одном месте\n        if (dto.getItems().isEmpty()) {\n            throw new RuntimeException("Order must have items");\n        }\n        \n        OrderEntity order = new OrderEntity();\n        order.setCustomerId(dto.getCustomerId());\n        order.setTotal(calculateTotal(dto.getItems()));\n        order.setStatus("PENDING");\n        \n        orderRepository.save(order); // JPA Entity напрямую\n        \n        // Отправка email прямо в сервисе\n        SimpleMailMessage message = new SimpleMailMessage();\n        message.setTo(dto.getCustomerEmail());\n        message.setText("Your order is created");\n        mailSender.send(message);\n    }\n}' },
        { type: 'tip', value: 'Не пытайтесь рефакторить всё сразу. Определите самые проблемные модули (высокий coupling, частые баги, сложные изменения) и начните с них.' }
      ]
    },
    {
      id: 2,
      title: 'Стратегия Strangler Fig',
      type: 'theory',
      content: [
        { type: 'text', value: 'Strangler Fig Pattern (паттерн фикуса-душителя) — стратегия постепенной замены legacy-системы. Новый код "обвивает" старый и постепенно заменяет его, пока старый не отомрёт.' },
        { type: 'heading', value: 'Шаги Strangler Fig' },
        { type: 'list', value: [
          '1. Добавить тесты для текущего поведения (safety net)',
          '2. Создать новую структуру (Domain, Application, Infrastructure)',
          '3. Перенести бизнес-логику в новую структуру',
          '4. Перенаправить вызовы к новому коду',
          '5. Удалить старый код после миграции'
        ]},
        { type: 'heading', value: 'Миграция по модулям' },
        { type: 'text', value: 'Не рефакторьте весь проект. Мигрируйте по одному модулю:\n1. Выберите модуль (Order)\n2. Создайте Domain Entity Order с бизнес-логикой\n3. Создайте Use Case PlaceOrderUseCase\n4. Создайте интерфейс OrderRepository\n5. Адаптируйте существующий JPA Repository\n6. Обновите контроллер для вызова Use Case\n7. Удалите старый OrderService' },
        { type: 'code', language: 'java', value: '// Шаг 1: Обернуть старый код фасадом\n// Новый код вызывает фасад, не зная о legacy\npublic class OrderFacade {\n    private final LegacyOrderService legacyService;\n    \n    public void placeOrder(PlaceOrderCommand command) {\n        // Пока делегируем legacy-коду\n        legacyService.createOrder(toLegacyDto(command));\n    }\n}\n\n// Шаг 2: Постепенно заменяем реализацию внутри фасада\npublic class OrderFacade {\n    private final PlaceOrderUseCase newUseCase; // новый код\n    \n    public void placeOrder(PlaceOrderCommand command) {\n        // Теперь вызываем новый код\n        newUseCase.execute(command);\n    }\n}\n\n// Шаг 3: Убираем фасад, контроллер вызывает Use Case напрямую' },
        { type: 'warning', value: 'Strangler Fig — медленный, но безопасный подход. "Большой рефакторинг за выходные" почти всегда заканчивается катастрофой. Мигрируйте инкрементально, деплоя после каждого шага.' }
      ]
    },
    {
      id: 3,
      title: 'Шаг 1: Выделение доменного слоя',
      type: 'theory',
      content: [
        { type: 'text', value: 'Первый и самый важный шаг: извлечь бизнес-логику из сервисов и контроллеров в доменные объекты.' },
        { type: 'code', language: 'java', value: '// BEFORE: логика в сервисе\n@Service\npublic class OrderService {\n    public void cancelOrder(Long orderId) {\n        OrderEntity order = repo.findById(orderId).orElseThrow();\n        if (order.getStatus().equals("SHIPPED")) {\n            throw new RuntimeException("Cannot cancel shipped order");\n        }\n        if (order.getStatus().equals("CANCELLED")) {\n            throw new RuntimeException("Already cancelled");\n        }\n        order.setStatus("CANCELLED");\n        repo.save(order);\n    }\n}\n\n// AFTER: логика в Domain Entity\n// 1. Создаём Domain Entity\npublic class Order {\n    private OrderId id;\n    private OrderStatus status;\n    \n    public void cancel() {\n        if (this.status == OrderStatus.SHIPPED) {\n            throw new CannotCancelShippedException(this.id);\n        }\n        if (this.status == OrderStatus.CANCELLED) {\n            throw new AlreadyCancelledException(this.id);\n        }\n        this.status = OrderStatus.CANCELLED;\n    }\n}\n\n// 2. Сервис становится тонким координатором\npublic class CancelOrderUseCase {\n    private final OrderRepository orderRepo;\n    \n    public void execute(OrderId orderId) {\n        Order order = orderRepo.findById(orderId).orElseThrow();\n        order.cancel(); // бизнес-логика в Entity!\n        orderRepo.save(order);\n    }\n}' },
        { type: 'heading', value: 'Что переносить в Domain' },
        { type: 'list', value: [
          'Бизнес-правила (if status == SHIPPED → нельзя отменить)',
          'Валидация (сумма > 0, email валиден)',
          'Расчёты (total = sum(lines), скидка = process(rules))',
          'Состояние (state machine переходов заказа)',
          'Доменные события (OrderCancelled, PaymentReceived)'
        ]},
        { type: 'note', value: 'После этого шага Domain Entity можно тестировать unit-тестами без БД и фреймворков. Это главный индикатор прогресса рефакторинга.' }
      ]
    },
    {
      id: 4,
      title: 'Шаг 2: Инверсия зависимостей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Второй шаг: определить интерфейсы в Domain и сделать Infrastructure зависимым от Domain (а не наоборот).' },
        { type: 'code', language: 'java', value: '// BEFORE: Domain зависит от JPA\n@Entity // JPA аннотация на доменном объекте — нарушение!\n@Table(name = "orders")\npublic class Order {\n    @Id @GeneratedValue\n    private Long id;\n    \n    @Column(name = "status")\n    private String status;\n}\n\n// AFTER: Domain чист, JPA Entity отдельно\n\n// domain/Order.java — чистый доменный объект\npublic class Order {\n    private OrderId id;\n    private OrderStatus status;\n    \n    public void cancel() { ... }\n}\n\n// domain/OrderRepository.java — интерфейс\npublic interface OrderRepository {\n    Optional<Order> findById(OrderId id);\n    void save(Order order);\n}\n\n// infrastructure/OrderJpaEntity.java — JPA Entity\n@Entity\n@Table(name = "orders")\npublic class OrderJpaEntity {\n    @Id\n    private UUID id;\n    @Column\n    private String status;\n    // геттеры/сеттеры\n}\n\n// infrastructure/JpaOrderRepository.java — реализация\npublic class JpaOrderRepository implements OrderRepository {\n    private final JpaOrderEntityRepo jpaRepo;\n    private final OrderMapper mapper;\n    \n    @Override\n    public Optional<Order> findById(OrderId id) {\n        return jpaRepo.findById(id.value()).map(mapper::toDomain);\n    }\n    \n    @Override\n    public void save(Order order) {\n        jpaRepo.save(mapper.toJpa(order));\n    }\n}' },
        { type: 'heading', value: 'Промежуточный этап: адаптер к legacy' },
        { type: 'code', language: 'java', value: '// Если полный маппинг слишком дорогой — временный адаптер\npublic class LegacyOrderRepositoryAdapter implements OrderRepository {\n    private final LegacyOrderRepository legacyRepo; // старый Spring Data JPA\n    \n    @Override\n    public Optional<Order> findById(OrderId id) {\n        return legacyRepo.findById(id.value())\n            .map(entity -> Order.reconstitute(\n                new OrderId(entity.getId()),\n                OrderStatus.valueOf(entity.getStatus())\n            ));\n    }\n}\n// Позже замените адаптер на полноценный JpaOrderRepository' },
        { type: 'tip', value: 'Не нужно мигрировать всю БД сразу. Адаптер позволяет новому Domain работать со старыми таблицами. Миграцию схемы БД можно сделать позже.' }
      ]
    },
    {
      id: 5,
      title: 'Шаг 3: Выделение Application-слоя',
      type: 'theory',
      content: [
        { type: 'text', value: 'Третий шаг: создать Use Cases (Application Services), которые координируют бизнес-процесс, и вынести туда всю оркестрацию.' },
        { type: 'code', language: 'java', value: '// BEFORE: Контроллер вызывает сервис с бизнес-логикой\n@RestController\npublic class OrderController {\n    @Autowired\n    private OrderService orderService; // 1000-строчный сервис\n    \n    @PostMapping("/orders")\n    public ResponseEntity<?> create(@RequestBody CreateOrderDto dto) {\n        return ResponseEntity.ok(orderService.createOrder(dto));\n    }\n}\n\n// AFTER: Контроллер → Use Case → Domain\n\n// application/PlaceOrderUseCase.java\npublic class PlaceOrderUseCase {\n    private final OrderRepository orderRepo;\n    private final ProductRepository productRepo;\n    private final PaymentGateway paymentGateway;\n    \n    public OrderDto execute(PlaceOrderCommand command) {\n        // 1. Загрузить данные\n        List<Product> products = productRepo.findAllByIds(command.productIds());\n        \n        // 2. Создать доменный объект (логика в Entity)\n        Order order = Order.create(command.customerId(), products);\n        \n        // 3. Оплата\n        paymentGateway.charge(order.total());\n        \n        // 4. Сохранить\n        order.confirm();\n        orderRepo.save(order);\n        \n        return OrderDto.from(order);\n    }\n}\n\n// presentation/OrderController.java — тонкий\n@RestController\npublic class OrderController {\n    private final PlaceOrderUseCase placeOrder;\n    \n    @PostMapping("/api/v1/orders")\n    public ResponseEntity<OrderDto> create(@RequestBody CreateOrderRequest req) {\n        PlaceOrderCommand cmd = new PlaceOrderCommand(\n            req.customerId(), req.items()\n        );\n        OrderDto result = placeOrder.execute(cmd);\n        return ResponseEntity.status(201).body(result);\n    }\n}' },
        { type: 'heading', value: 'Финальная структура после рефакторинга' },
        { type: 'code', language: 'java', value: 'src/\n├── domain/                    # Чистый Domain (0 зависимостей)\n│   ├── Order.java\n│   ├── OrderStatus.java\n│   ├── OrderRepository.java   # Интерфейс\n│   └── Money.java\n├── application/               # Use Cases\n│   ├── PlaceOrderUseCase.java\n│   ├── CancelOrderUseCase.java\n│   └── PlaceOrderCommand.java\n├── infrastructure/            # Реализации\n│   ├── JpaOrderRepository.java\n│   ├── OrderJpaEntity.java\n│   ├── OrderMapper.java\n│   └── StripePaymentGateway.java\n└── presentation/              # HTTP\n    ├── OrderController.java\n    └── CreateOrderRequest.java' },
        { type: 'note', value: 'Рефакторинг — итеративный процесс. Не обязательно достичь "идеальной" Clean Architecture. Даже частичная миграция (выделение Domain) даёт значительное улучшение тестируемости и поддерживаемости.' }
      ]
    },
    {
      id: 6,
      title: 'Частые ошибки при рефакторинге',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рефакторинг к Clean Architecture — непростой процесс. Вот типичные ошибки, которые допускают команды.' },
        { type: 'heading', value: 'Ошибка 1: Big Bang рефакторинг' },
        { type: 'text', value: 'Попытка переписать всё за один спринт. Результат: сломанный код, пропущенные дедлайны, откат к старому коду. Решение: Strangler Fig, инкрементальный рефакторинг.' },
        { type: 'heading', value: 'Ошибка 2: Cargo Cult Architecture' },
        { type: 'text', value: 'Создание слоёв ради слоёв. 5 классов маппинга для передачи string из контроллера в БД. Решение: добавляйте абстракции, когда они решают проблему, а не "на всякий случай".' },
        { type: 'heading', value: 'Ошибка 3: Забыть про тесты' },
        { type: 'text', value: 'Рефакторинг без тестов — русская рулетка. Перед любым изменением добавьте тесты для текущего поведения. Они — safety net.' },
        { type: 'heading', value: 'Ошибка 4: Игнорировать маппинг' },
        { type: 'text', value: 'Использование JPA Entity как Domain Entity — "быстрее, зачем делать две модели". Но это привязывает Domain к БД. Решение: начните с адаптера, добавьте маппинг позже.' },
        { type: 'heading', value: 'Ошибка 5: Перфекционизм' },
        { type: 'text', value: 'Попытка достичь "идеальной" архитектуры с первого раза. Решение: начните с MVP архитектуры (Domain + Use Cases), улучшайте итеративно.' },
        { type: 'warning', value: 'Лучшая архитектура — та, которая работает для вашей команды и проекта. Не копируйте архитектуру Netflix для проекта с тремя разработчиками.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: пошаговый рефакторинг',
      type: 'practice',
      difficulty: 'hard',
      description: 'Выполните пошаговый рефакторинг legacy UserService к Clean Architecture.',
      requirements: [
        'Шаг 1: Добавить тесты для текущего поведения',
        'Шаг 2: Выделить Domain Entity User из JPA Entity',
        'Шаг 3: Перенести бизнес-логику из UserService в User Entity',
        'Шаг 4: Создать интерфейс UserRepository и адаптер',
        'Шаг 5: Создать RegisterUserUseCase как Application Service',
        'Шаг 6: Обновить контроллер для вызова Use Case'
      ],
      hint: 'Начните с тестов! Тесты покрывают текущее поведение. Затем перенесите логику из сервиса в Entity. Затем создайте интерфейс репозитория. Контроллер — последний.',
      expectedOutput: 'Legacy UserService рефакторирован: бизнес-логика в User Entity, координация в RegisterUserUseCase, интерфейс UserRepository в Domain, реализация в Infrastructure.',
      solution: '// STEP 0: Legacy код\n// @Service public class UserService {\n//   @Autowired UserRepository repo; // Spring Data\n//   @Autowired PasswordEncoder encoder;\n//   public UserEntity register(String email, String password, String name) {\n//     if (repo.existsByEmail(email)) throw new RuntimeException("Email exists");\n//     if (password.length() < 8) throw new RuntimeException("Password too short");\n//     UserEntity user = new UserEntity();\n//     user.setEmail(email); user.setPassword(encoder.encode(password));\n//     user.setName(name); user.setStatus("ACTIVE");\n//     return repo.save(user);\n//   }\n// }\n\n// STEP 1: Тесты для текущего поведения\nclass UserServiceLegacyTest {\n  @Test void shouldRegisterUser() { ... }\n  @Test void shouldRejectDuplicateEmail() { ... }\n  @Test void shouldRejectShortPassword() { ... }\n}\n\n// STEP 2: Domain Entity\npublic class User {\n  private UserId id;\n  private Email email;\n  private HashedPassword password;\n  private String name;\n  private UserStatus status;\n\n  public static User register(Email email, String name, HashedPassword password) {\n    // Бизнес-логика перенесена из сервиса\n    return new User(UserId.generate(), email, password, name, UserStatus.ACTIVE);\n  }\n\n  public void deactivate() {\n    if (this.status == UserStatus.INACTIVE) throw new AlreadyInactiveException();\n    this.status = UserStatus.INACTIVE;\n  }\n}\n\npublic record Email(String value) {\n  public Email { if (!value.contains("@")) throw new InvalidEmailException(value); }\n}\n\n// STEP 3: Repository Interface (Domain)\npublic interface UserRepository {\n  Optional<User> findById(UserId id);\n  boolean existsByEmail(Email email);\n  void save(User user);\n}\n\n// STEP 4: Adapter к Legacy\npublic class JpaUserRepositoryAdapter implements UserRepository {\n  private final LegacyUserJpaRepository legacyRepo;\n  private final UserMapper mapper;\n\n  public boolean existsByEmail(Email email) {\n    return legacyRepo.existsByEmail(email.value());\n  }\n\n  public void save(User user) {\n    legacyRepo.save(mapper.toJpa(user));\n  }\n}\n\n// STEP 5: Use Case\npublic class RegisterUserUseCase {\n  private final UserRepository userRepo;\n  private final PasswordHasher hasher;\n\n  public UserDto execute(RegisterUserCommand cmd) {\n    Email email = new Email(cmd.email());\n    if (userRepo.existsByEmail(email)) {\n      throw new EmailAlreadyExistsException(cmd.email());\n    }\n    HashedPassword hashed = hasher.hash(cmd.password());\n    User user = User.register(email, cmd.name(), hashed);\n    userRepo.save(user);\n    return UserDto.from(user);\n  }\n}\n\n// STEP 6: Обновлённый контроллер\n@PostMapping("/api/v1/users")\npublic ResponseEntity<UserDto> register(@RequestBody RegisterRequest req) {\n  RegisterUserCommand cmd = new RegisterUserCommand(req.email(), req.password(), req.name());\n  UserDto result = registerUserUseCase.execute(cmd);\n  return ResponseEntity.status(201).body(result);\n}',
      explanation: 'Пошаговая миграция: (1) тесты фиксируют поведение, (2) Domain Entity User содержит бизнес-логику, (3) Email — Value Object с валидацией, (4) UserRepository — интерфейс в Domain, адаптер к legacy JPA, (5) RegisterUserUseCase — тонкий координатор, (6) Controller вызывает Use Case. Каждый шаг можно деплоить отдельно.'
    }
  ]
}
