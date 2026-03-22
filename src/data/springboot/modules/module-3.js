export default {
  id: 3,
  title: 'IoC и Dependency Injection',
  description: 'Принципы инверсии управления, внедрение зависимостей через @Component, @Autowired, @Service',
  lessons: [
    {
      id: 1,
      title: 'Принцип Inversion of Control (IoC)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Inversion of Control (IoC) — один из фундаментальных принципов Spring. Суть: управление созданием и жизненным циклом объектов передаётся фреймворку, а не остаётся в руках программиста.' },
        { type: 'heading', value: 'Проблема без IoC' },
        { type: 'code', language: 'java', value: '// БЕЗ IoC — жёсткие зависимости, сложно тестировать\npublic class UserService {\n    private UserRepository repository = new UserRepository(); // прямое создание\n    private EmailService emailService = new EmailService();\n    private SmsService smsService = new SmsService();\n\n    // Проблемы:\n    // 1. UserService знает как создать UserRepository\n    // 2. Нельзя подменить реализацию в тестах\n    // 3. Нельзя переиспользовать один экземпляр\n}' },
        { type: 'heading', value: 'Решение с IoC' },
        { type: 'code', language: 'java', value: '// С IoC — Spring управляет созданием объектов\n@Service\npublic class UserService {\n    private final UserRepository repository;\n    private final EmailService emailService;\n\n    // Spring сам передаст нужные объекты\n    public UserService(UserRepository repository, EmailService emailService) {\n        this.repository = repository;\n        this.emailService = emailService;\n    }\n}' },
        { type: 'tip', value: 'Думай об IoC как о голливудском принципе: "Не звони нам, мы позвоним тебе". Ты не создаёшь зависимости сам — Spring найдёт тебя и передаст всё необходимое.' },
        { type: 'note', value: 'IoC — это принцип. Dependency Injection (DI) — это конкретная техника реализации IoC. Spring реализует IoC именно через DI.' }
      ]
    },
    {
      id: 2,
      title: 'Аннотация @Component',
      type: 'theory',
      content: [
        { type: 'text', value: '@Component — базовая аннотация Spring. Любой класс с этой аннотацией становится бином — Spring создаст его экземпляр и добавит в IoC контейнер.' },
        { type: 'code', language: 'java', value: '@Component\npublic class MessageFormatter {\n\n    public String format(String message) {\n        return "[" + LocalDateTime.now() + "] " + message;\n    }\n}\n\n// Spring автоматически:\n// 1. Найдёт класс при сканировании\n// 2. Создаст один экземпляр (singleton по умолчанию)\n// 3. Зарегистрирует в контейнере\n// 4. Будет внедрять туда где нужно' },
        { type: 'heading', value: 'Специализированные аннотации' },
        { type: 'text', value: 'Spring предоставляет специализированные аннотации — они делают то же что @Component, но добавляют семантику (понятность) коду:' },
        { type: 'list', items: [
          '@Component — общий компонент, нет конкретной роли',
          '@Service — бизнес-логика (сервисный слой)',
          '@Repository — работа с базой данных',
          '@Controller — обработка HTTP запросов',
          '@RestController — REST контроллер (@Controller + @ResponseBody)'
        ]},
        { type: 'code', language: 'java', value: '@Service  // бизнес-логика\npublic class ProductService { ... }\n\n@Repository  // доступ к данным\npublic class ProductRepository { ... }\n\n@Controller  // веб-слой\npublic class ProductController { ... }' },
        { type: 'tip', value: 'Используй правильную аннотацию для каждого слоя. @Repository дополнительно включает обработку исключений базы данных. @Service помогает другим разработчикам понять роль класса.' }
      ]
    },
    {
      id: 3,
      title: 'Dependency Injection: три способа',
      type: 'theory',
      content: [
        { type: 'text', value: 'Dependency Injection (внедрение зависимостей) — механизм, при котором Spring передаёт зависимости в объект. Есть три способа DI в Spring.' },
        { type: 'heading', value: '1. Внедрение через конструктор (рекомендуется)' },
        { type: 'code', language: 'java', value: '@Service\npublic class OrderService {\n    private final UserService userService;\n    private final PaymentService paymentService;\n\n    // @Autowired не обязателен если конструктор один\n    public OrderService(UserService userService, PaymentService paymentService) {\n        this.userService = userService;\n        this.paymentService = paymentService;\n    }\n}' },
        { type: 'heading', value: '2. Внедрение через поле (не рекомендуется)' },
        { type: 'code', language: 'java', value: '@Service\npublic class OrderService {\n    @Autowired  // Spring внедрит значение напрямую в поле\n    private UserService userService;\n\n    @Autowired\n    private PaymentService paymentService;\n    // Минусы: сложнее тестировать, поле нельзя сделать final\n}' },
        { type: 'heading', value: '3. Внедрение через сеттер' },
        { type: 'code', language: 'java', value: '@Service\npublic class OrderService {\n    private UserService userService;\n\n    @Autowired\n    public void setUserService(UserService userService) {\n        this.userService = userService;\n    }\n    // Используется когда зависимость необязательна\n}' },
        { type: 'warning', value: 'Официальная рекомендация Spring Team: используй внедрение через конструктор. Это позволяет делать поля final (неизменяемые), упрощает тестирование и явно показывает зависимости.' }
      ]
    },
    {
      id: 4,
      title: 'Аннотация @Autowired',
      type: 'theory',
      content: [
        { type: 'text', value: '@Autowired — аннотация для автоматического внедрения зависимостей. Spring найдёт подходящий бин в контейнере и внедрит его.' },
        { type: 'code', language: 'java', value: '@Service\npublic class NotificationService {\n\n    // Spring найдёт бин типа EmailSender и внедрит\n    @Autowired\n    private EmailSender emailSender;\n\n    public void notify(String message) {\n        emailSender.send(message);\n    }\n}' },
        { type: 'heading', value: 'Когда @Autowired не нужен' },
        { type: 'text', value: 'Начиная со Spring 4.3, @Autowired не нужен если у класса единственный конструктор. Spring автоматически внедрит зависимости:' },
        { type: 'code', language: 'java', value: '@Service\npublic class NotificationService {\n    private final EmailSender emailSender;\n    private final SmsSender smsSender;\n\n    // @Autowired НЕ нужен — Spring видит один конструктор\n    public NotificationService(EmailSender emailSender, SmsSender smsSender) {\n        this.emailSender = emailSender;\n        this.smsSender = smsSender;\n    }\n}' },
        { type: 'heading', value: 'Проблема: несколько реализаций' },
        { type: 'code', language: 'java', value: '// Если есть два класса реализующих один интерфейс\n@Component\npublic class GmailSender implements EmailSender { ... }\n\n@Component\npublic class OutlookSender implements EmailSender { ... }\n\n// Spring не знает какой выбрать — ошибка!\n@Autowired\nprivate EmailSender emailSender; // NoUniqueBeanDefinitionException!\n\n// Решение: @Qualifier\n@Autowired\n@Qualifier("gmailSender")\nprivate EmailSender emailSender; // явно указываем имя бина' },
        { type: 'note', value: 'Имя бина по умолчанию — имя класса с маленькой буквы. GmailSender → "gmailSender". Можно задать своё имя: @Component("myGmail").' }
      ]
    },
    {
      id: 5,
      title: 'Аннотации @Service и @Repository',
      type: 'theory',
      content: [
        { type: 'text', value: 'Трёхслойная архитектура — стандарт для Spring Boot приложений. Каждый слой имеет свою роль и свою аннотацию.' },
        { type: 'heading', value: 'Слой Repository (доступ к данным)' },
        { type: 'code', language: 'java', value: '@Repository\npublic class UserRepository {\n    // Здесь: SQL запросы, работа с JPA, JDBC\n    // Spring добавляет обработку исключений БД\n\n    private final List<User> users = new ArrayList<>();\n\n    public Optional<User> findById(Long id) {\n        return users.stream()\n            .filter(u -> u.getId().equals(id))\n            .findFirst();\n    }\n\n    public void save(User user) {\n        users.add(user);\n    }\n}' },
        { type: 'heading', value: 'Слой Service (бизнес-логика)' },
        { type: 'code', language: 'java', value: '@Service\npublic class UserService {\n    private final UserRepository userRepository;\n\n    public UserService(UserRepository userRepository) {\n        this.userRepository = userRepository;\n    }\n\n    // Здесь: бизнес-правила, валидация, транзакции\n    public User registerUser(String email, String password) {\n        if (userRepository.findByEmail(email).isPresent()) {\n            throw new IllegalArgumentException("Email уже занят");\n        }\n        User user = new User(email, encodePassword(password));\n        return userRepository.save(user);\n    }\n}' },
        { type: 'tip', value: 'Разделение ответственности — ключ к хорошей архитектуре. Repository работает с данными, Service содержит бизнес-логику, Controller обрабатывает HTTP. Никогда не пиши SQL в контроллере!' }
      ]
    },
    {
      id: 6,
      title: 'Жизненный цикл бина',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring управляет жизненным циклом бинов: создаёт их при старте, управляет ими во время работы, уничтожает при остановке.' },
        { type: 'heading', value: 'Фазы жизненного цикла' },
        { type: 'list', items: [
          '1. Создание бина через конструктор',
          '2. Внедрение зависимостей (DI)',
          '3. Вызов методов инициализации (@PostConstruct)',
          '4. Бин готов к использованию',
          '5. При остановке: вызов методов очистки (@PreDestroy)',
          '6. Уничтожение бина'
        ]},
        { type: 'code', language: 'java', value: '@Service\npublic class DatabaseConnectionService {\n    private Connection connection;\n\n    @PostConstruct  // вызывается ПОСЛЕ создания и DI\n    public void init() {\n        System.out.println("Открываем соединение с БД...");\n        connection = openConnection();\n    }\n\n    @PreDestroy  // вызывается ПЕРЕД уничтожением\n    public void cleanup() {\n        System.out.println("Закрываем соединение с БД...");\n        connection.close();\n    }\n}' },
        { type: 'note', value: '@PostConstruct удобен для инициализации ресурсов, загрузки данных при старте. @PreDestroy — для освобождения ресурсов (закрытие соединений, сохранение состояния).' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Сервис с DI',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай трёхслойную структуру: Repository, Service и Controller для работы с простым списком задач (ToDo).',
      requirements: [
        'Создай класс Todo с полями id (Long) и title (String)',
        'Создай TodoRepository с @Repository, хранящий список в памяти',
        'Добавь методы: findAll(), findById(), save()',
        'Создай TodoService с @Service, внедри TodoRepository через конструктор',
        'GET /todos — возвращает список всех задач (List<Todo>)'
      ],
      expectedOutput: 'GET /todos => [{"id":1,"title":"Изучить Spring"}, {"id":2,"title":"Написать REST API"}]',
      hint: 'TodoRepository — @Repository с List<Todo>. TodoService — @Service с final TodoRepository. TodoController — @RestController с final TodoService. Внедряй через конструкторы!',
      solution: '// Todo.java\npublic class Todo {\n    private Long id;\n    private String title;\n    // конструктор, геттеры, сеттеры\n}\n\n// TodoRepository.java\n@Repository\npublic class TodoRepository {\n    private List<Todo> todos = new ArrayList<>(List.of(\n        new Todo(1L, "Изучить Spring"),\n        new Todo(2L, "Написать REST API")\n    ));\n\n    public List<Todo> findAll() { return todos; }\n}\n\n// TodoService.java\n@Service\npublic class TodoService {\n    private final TodoRepository todoRepository;\n\n    public TodoService(TodoRepository todoRepository) {\n        this.todoRepository = todoRepository;\n    }\n\n    public List<Todo> getAllTodos() {\n        return todoRepository.findAll();\n    }\n}\n\n// TodoController.java\n@RestController\n@RequestMapping("/todos")\npublic class TodoController {\n    private final TodoService todoService;\n\n    public TodoController(TodoService todoService) {\n        this.todoService = todoService;\n    }\n\n    @GetMapping\n    public List<Todo> getAll() {\n        return todoService.getAllTodos();\n    }\n}',
      explanation: 'Трёхслойная архитектура: Controller → Service → Repository. Каждый слой знает только о следующем. Controller не знает про Repository. Service содержит бизнес-логику. Repository работает с данными. Внедрение через конструктор делает зависимости явными и код легко тестируемым.'
    },
    {
      id: 8,
      title: 'Практика: @Qualifier для выбора бина',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай два бина реализующих один интерфейс и научись выбирать нужный через @Qualifier.',
      requirements: [
        'Создай интерфейс GreetingService с методом greet(String name)',
        'Создай FormalGreeting: "Уважаемый, [name]!" с @Component("formal")',
        'Создай CasualGreeting: "Привет, [name]!" с @Component("casual")',
        'В контроллере внедри оба через @Qualifier',
        'GET /greet/formal/{name} и GET /greet/casual/{name}'
      ],
      expectedOutput: 'GET /greet/formal/Иван => "Уважаемый, Иван!"\nGET /greet/casual/Иван => "Привет, Иван!"',
      hint: 'Интерфейс GreetingService, два класса с @Component("имя"). В контроллере: @Autowired @Qualifier("formal") private GreetingService formalGreeting;',
      solution: '// GreetingService.java\npublic interface GreetingService {\n    String greet(String name);\n}\n\n// FormalGreeting.java\n@Component("formal")\npublic class FormalGreeting implements GreetingService {\n    public String greet(String name) {\n        return "Уважаемый, " + name + "!";\n    }\n}\n\n// CasualGreeting.java\n@Component("casual")\npublic class CasualGreeting implements GreetingService {\n    public String greet(String name) {\n        return "Привет, " + name + "!";\n    }\n}\n\n// GreetingController.java\n@RestController\n@RequestMapping("/greet")\npublic class GreetingController {\n\n    @Autowired\n    @Qualifier("formal")\n    private GreetingService formalGreeting;\n\n    @Autowired\n    @Qualifier("casual")\n    private GreetingService casualGreeting;\n\n    @GetMapping("/formal/{name}")\n    public String formal(@PathVariable String name) {\n        return formalGreeting.greet(name);\n    }\n\n    @GetMapping("/casual/{name}")\n    public String casual(@PathVariable String name) {\n        return casualGreeting.greet(name);\n    }\n}',
      explanation: '@Qualifier("имя") позволяет выбрать конкретный бин когда несколько реализуют один интерфейс. Программирование через интерфейс — хорошая практика: легко менять реализацию без изменения кода который её использует.'
    }
  ]
}
