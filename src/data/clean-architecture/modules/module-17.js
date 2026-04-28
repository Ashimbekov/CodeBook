export default {
  id: 17,
  title: 'Anti-patterns архитектуры',
  description: 'God Object, Anemic Domain Model, Big Ball of Mud, Smart UI, Distributed Monolith и другие архитектурные ошибки.',
  lessons: [
    {
      id: 1,
      title: 'God Object и God Class',
      type: 'theory',
      content: [
        { type: 'text', value: 'God Object (божественный объект) — класс, который знает слишком много и делает слишком много. Он нарушает Single Responsibility Principle и является центральной точкой связанности.' },
        { type: 'code', language: 'java', value: '// God Object — делает ВСЁ\npublic class ApplicationManager {\n    private Database db;\n    private EmailClient email;\n    private HttpClient http;\n    \n    public User createUser(String name, String email) { ... }\n    public void sendEmail(String to, String body) { ... }\n    public void processPayment(Order order) { ... }\n    public void generateReport(Date from, Date to) { ... }\n    public void backupDatabase() { ... }\n    public void syncWithExternalApi() { ... }\n    public void calculateTaxes(Invoice invoice) { ... }\n    public void resizeImage(byte[] image) { ... }\n    // 5000 строк кода...\n}' },
        { type: 'heading', value: 'Признаки God Object' },
        { type: 'list', value: [
          'Класс имеет более 500-1000 строк кода',
          'Класс имеет более 10-15 методов',
          'Класс инжектирует более 5-7 зависимостей',
          'Класс используется повсюду в проекте',
          'Изменение в одном методе часто ломает другие'
        ]},
        { type: 'heading', value: 'Решение: декомпозиция' },
        { type: 'text', value: 'Разбейте God Object на несколько классов, каждый с одной ответственностью: UserService, EmailService, PaymentService, ReportGenerator, DatabaseBackupService.' },
        { type: 'warning', value: 'God Object часто появляется из "удобства": проще добавить метод в существующий класс, чем создать новый. Но каждый добавленный метод увеличивает сложность и coupling. Рефакторинг становится всё дороже.' }
      ]
    },
    {
      id: 2,
      title: 'Anemic Domain Model',
      type: 'theory',
      content: [
        { type: 'text', value: 'Anemic Domain Model (анемичная доменная модель) — Entity содержат только данные (геттеры/сеттеры) без бизнес-логики. Вся логика в Service-классах. Мартин Фаулер назвал это анти-паттерном.' },
        { type: 'code', language: 'java', value: '// АНЕМИЧНАЯ модель: Entity = DTO\npublic class Order {\n    private Long id;\n    private String status;\n    private BigDecimal total;\n    private List<OrderLine> lines;\n    \n    // Только геттеры и сеттеры — ноль логики!\n    public String getStatus() { return status; }\n    public void setStatus(String status) { this.status = status; }\n    public void setTotal(BigDecimal total) { this.total = total; }\n}\n\n// Вся логика в сервисе\npublic class OrderService {\n    public void addItem(Order order, Product product, int qty) {\n        // Бизнес-логика ВНЕ Entity — нарушение!\n        if (!order.getStatus().equals("DRAFT")) {\n            throw new RuntimeException("Нельзя редактировать");\n        }\n        order.getLines().add(new OrderLine(product.getId(), qty, product.getPrice()));\n        BigDecimal total = order.getLines().stream()\n            .map(l -> l.getPrice().multiply(BigDecimal.valueOf(l.getQty())))\n            .reduce(BigDecimal.ZERO, BigDecimal::add);\n        order.setTotal(total); // сеттер — кто угодно может поставить любой total!\n    }\n}' },
        { type: 'heading', value: 'Почему это плохо' },
        { type: 'list', value: [
          'Инварианты не защищены — setTotal() позволяет установить неверную сумму',
          'Дублирование — проверка статуса копируется в каждый метод сервиса',
          'Процедурный код — ООП используется только как контейнер данных',
          'Логика расползается по разным сервисам — невозможно найти все правила'
        ]},
        { type: 'heading', value: 'Решение: Rich Domain Model' },
        { type: 'code', language: 'java', value: '// БОГАТАЯ модель: логика внутри Entity\npublic class Order {\n    private OrderId id;\n    private OrderStatus status;\n    private Money total;\n    private List<OrderLine> lines;\n    \n    // Нет публичных сеттеров!\n    \n    public void addItem(ProductId productId, int qty, Money price) {\n        ensureEditable(); // защита инварианта\n        lines.add(new OrderLine(productId, qty, price));\n        recalculateTotal(); // total всегда корректен\n    }\n    \n    private void ensureEditable() {\n        if (status != OrderStatus.DRAFT) {\n            throw new OrderNotEditableException(id);\n        }\n    }\n    \n    private void recalculateTotal() {\n        this.total = lines.stream()\n            .map(OrderLine::lineTotal)\n            .reduce(Money.ZERO, Money::add);\n    }\n}' },
        { type: 'tip', value: 'Если ваш Entity — класс с @Data/@Getter/@Setter и без единого бизнес-метода, а рядом есть Service с 500+ строк логики — это Anemic Domain Model. Перенесите логику в Entity.' }
      ]
    },
    {
      id: 3,
      title: 'Big Ball of Mud',
      type: 'theory',
      content: [
        { type: 'text', value: 'Big Ball of Mud (большой ком грязи) — система без видимой архитектуры. Код хаотично связан, нет чётких границ модулей, изменение в одном месте ломает всё остальное.' },
        { type: 'heading', value: 'Признаки' },
        { type: 'list', value: [
          'Нет чётких слоёв или модулей — всё перемешано',
          'Циклические зависимости между пакетами',
          'Изменение одного класса требует изменения десятков других',
          'Невозможно написать unit-тест — всё связано со всем',
          'Новый разработчик тратит недели на понимание кода',
          'Единственная стратегия развёртывания — полный деплой'
        ]},
        { type: 'heading', value: 'Как система превращается в Ball of Mud' },
        { type: 'text', value: '1. Проект начинается без архитектуры ("потом разберёмся").\n2. Дедлайны вынуждают срезать углы ("сделаем хак, потом исправим").\n3. Команда растёт, но правил нет — каждый пишет по-своему.\n4. Технический долг накапливается — рефакторинг всё дороже.\n5. Система становится "legacy" через 2-3 года.' },
        { type: 'heading', value: 'Как предотвратить' },
        { type: 'list', value: [
          'Определить архитектуру на старте проекта',
          'Использовать Architecture Tests для автоматической проверки',
          'Регулярный рефакторинг — не копить технический долг',
          'Code Review с фокусом на архитектуру',
          'Bounded Contexts — чёткие границы модулей'
        ]},
        { type: 'warning', value: 'Big Ball of Mud — самый распространённый архитектурный стиль в мире. По данным исследований, более 50% проектов не имеют осознанной архитектуры.' }
      ]
    },
    {
      id: 4,
      title: 'Distributed Monolith и другие ловушки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Distributed Monolith (распределённый монолит) — микросервисы, которые не могут деплоиться и работать независимо. Все недостатки монолита + все недостатки микросервисов.' },
        { type: 'heading', value: 'Признаки Distributed Monolith' },
        { type: 'list', value: [
          'Сервисы деплоятся вместе — нельзя обновить один без другого',
          'Синхронные REST-вызовы между всеми сервисами — длинные цепочки',
          'Общая БД для нескольких сервисов',
          'Изменение API одного сервиса ломает все остальные',
          'Распределённые транзакции — 2PC между сервисами'
        ]},
        { type: 'heading', value: 'Другие anti-patterns' },
        { type: 'list', value: [
          'Smart UI — бизнес-логика в UI-компонентах (onClick делает всё)',
          'Shotgun Surgery — одно изменение требует правок в десятках файлов',
          'Leaky Abstraction — абстракция протекает деталями реализации',
          'Cargo Cult — используем паттерн, не понимая зачем (CQRS для CRUD)',
          'Golden Hammer — используем один подход для всех задач'
        ]},
        { type: 'code', language: 'typescript', value: '// Smart UI anti-pattern: логика в компоненте\nfunction OrderButton({ order }: { order: Order }) {\n  const handleClick = async () => {\n    // Бизнес-логика в UI!\n    if (order.total > 10000 && order.customer.loyalty === "gold") {\n      order.total *= 0.9; // 10% скидка\n    }\n    if (order.items.some(i => i.outOfStock)) {\n      alert("Товар закончился");\n      return;\n    }\n    const response = await fetch("/api/orders", {\n      method: "POST",\n      body: JSON.stringify(order),\n    });\n    // ...\n  };\n  return <button onClick={handleClick}>Оформить</button>;\n}\n\n// Правильно: UI только вызывает Use Case\nfunction OrderButton({ order }: { order: Order }) {\n  const placeOrder = usePlaceOrder(); // хук/сервис\n  return <button onClick={() => placeOrder(order.id)}>Оформить</button>;\n}' },
        { type: 'note', value: 'Каждый anti-pattern начинается с "так проще сейчас". Но "проще сейчас" означает "дороже потом". Осознанная архитектура — инвестиция в будущее проекта.' }
      ]
    },
    {
      id: 5,
      title: 'Как распознать архитектурный запах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Архитектурные запахи (architecture smells) — признаки того, что архитектура деградирует. Их важно ловить рано, пока рефакторинг ещё дёшев.' },
        { type: 'heading', value: 'Красные флаги' },
        { type: 'list', value: [
          'Время добавления фичи растёт экспоненциально',
          'Каждый баг-фикс создаёт 2-3 новых бага',
          'Невозможно написать unit-тест без поднятия всей системы',
          'Merge-конфликты в каждом PR — все работают с одними файлами',
          'Страх трогать старый код — "работает — не трогай"',
          'Onboarding нового разработчика занимает больше месяца'
        ]},
        { type: 'heading', value: 'Метрики деградации' },
        { type: 'code', language: 'typescript', value: '// Пример автоматической проверки метрик\ninterface ArchitectureMetrics {\n  // Если класс зависит от > 7 классов — слишком высокий coupling\n  maxEfferentCoupling: number;\n  \n  // Если > 3 слоя — циклическая зависимость\n  maxCyclomaticDependency: number;\n  \n  // Если файл > 500 строк — потенциальный God Object\n  maxLinesPerFile: number;\n  \n  // Если метод > 30 строк — слишком сложный\n  maxLinesPerMethod: number;\n}\n\nconst thresholds: ArchitectureMetrics = {\n  maxEfferentCoupling: 7,\n  maxCyclomaticDependency: 0, // циклов быть не должно\n  maxLinesPerFile: 500,\n  maxLinesPerMethod: 30,\n};' },
        { type: 'tip', value: 'Настройте статический анализ (SonarQube, ESLint, ArchUnit) для автоматического обнаружения архитектурных запахов. Ловите проблемы на CI, а не на code review.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: рефакторинг anti-patterns',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найдите и исправьте архитектурные anti-patterns в данном коде: God Object, Anemic Domain, утечка абстракции.',
      requirements: [
        'Идентифицировать God Object и разбить на отдельные сервисы',
        'Найти Anemic Domain Model и перенести логику в Entity',
        'Убрать зависимость Domain от Infrastructure',
        'Устранить циклическую зависимость между модулями',
        'Добавить Architecture Test для предотвращения регрессии'
      ],
      hint: 'Ищите классы с >10 зависимостей (God Object), Entity без методов (Anemic), import Spring в Domain (нарушение зависимостей).',
      expectedOutput: 'Код рефакторирован: God Object разбит на отдельные сервисы, бизнес-логика перемещена в Entity, зависимости инвертированы, циклов нет.',
      solution: '// BEFORE: God Object + Anemic Domain\npublic class OrderManager {\n    @Autowired private JdbcTemplate db;\n    @Autowired private JavaMailSender mailer;\n    @Autowired private RestTemplate restTemplate;\n    \n    public void placeOrder(OrderDto dto) {\n        // Валидация, создание, оплата, email, аналитика — всё в одном классе\n        if (dto.getTotal() < 0) throw new RuntimeException("bad total");\n        db.update("INSERT INTO orders ...", dto.getId(), dto.getTotal());\n        mailer.send(createMessage(dto));\n        restTemplate.postForObject("http://analytics/track", dto, Void.class);\n    }\n}\n\n// AFTER: Clean Architecture\n\n// Domain Entity с логикой\npublic class Order {\n    private OrderId id;\n    private Money total;\n    private OrderStatus status;\n    private List<OrderLine> lines;\n    \n    public static Order create(CustomerId customerId, List<CartItem> items) {\n        if (items.isEmpty()) throw new EmptyOrderException();\n        Order order = new Order();\n        order.id = OrderId.generate();\n        items.forEach(item -> order.addLine(item));\n        order.raise(new OrderPlacedEvent(order.id));\n        return order;\n    }\n    \n    private void addLine(CartItem item) {\n        lines.add(OrderLine.from(item));\n        recalculateTotal();\n    }\n}\n\n// Use Case (Application)\npublic class PlaceOrderUseCase {\n    private final OrderRepository orderRepo;\n    private final NotificationSender notifier;\n    \n    public OrderDto execute(PlaceOrderCommand cmd) {\n        Order order = Order.create(cmd.customerId(), cmd.items());\n        orderRepo.save(order);\n        notifier.sendConfirmation(order.id());\n        return OrderDto.from(order);\n    }\n}\n\n// Repository Interface (Domain)\npublic interface OrderRepository {\n    void save(Order order);\n}\n\n// Repository Implementation (Infrastructure)\npublic class JpaOrderRepository implements OrderRepository {\n    private final JdbcTemplate db;\n    public void save(Order order) { /* маппинг + SQL */ }\n}',
      explanation: 'God Object OrderManager разбит на: Order (Entity с логикой), PlaceOrderUseCase (координация), JpaOrderRepository (Infrastructure). Anemic Domain исправлена — Order.create() содержит бизнес-логику. Зависимость от Spring (JdbcTemplate) перенесена из Domain в Infrastructure через интерфейс OrderRepository.'
    }
  ]
}
