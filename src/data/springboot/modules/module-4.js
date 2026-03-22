export default {
  id: 4,
  title: 'Аннотации @Configuration, @Bean, @Scope',
  description: 'Java-конфигурация Spring: создание бинов через @Bean, настройка scope, условные бины',
  lessons: [
    {
      id: 1,
      title: '@Configuration и @Bean',
      type: 'theory',
      content: [
        { type: 'text', value: '@Configuration — аннотация для классов конфигурации. В таких классах через @Bean методы вручную создают бины для IoC контейнера.' },
        { type: 'heading', value: 'Когда нужен @Bean?' },
        { type: 'text', value: '@Component работает для твоих собственных классов. Но что если надо добавить в контейнер объект сторонней библиотеки? Например, ObjectMapper из Jackson или RestTemplate? У них нет @Component. Решение — @Bean в классе @Configuration.' },
        { type: 'code', language: 'java', value: '@Configuration\npublic class AppConfig {\n\n    // Метод с @Bean создаёт бин и регистрирует его в контейнере\n    @Bean\n    public ObjectMapper objectMapper() {\n        ObjectMapper mapper = new ObjectMapper();\n        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);\n        mapper.enable(SerializationFeature.INDENT_OUTPUT);\n        return mapper;\n    }\n\n    @Bean\n    public RestTemplate restTemplate() {\n        return new RestTemplate();\n    }\n}' },
        { type: 'tip', value: 'Имя бина по умолчанию — имя метода. objectMapper() создаёт бин с именем "objectMapper". Можно переименовать: @Bean("myMapper").' },
        { type: 'note', value: '@SpringBootApplication включает @Configuration, поэтому @Bean методы можно писать прямо в главном классе. Но лучше выносить конфигурацию в отдельные классы — так чище.' }
      ]
    },
    {
      id: 2,
      title: 'Зависимости между @Bean методами',
      type: 'theory',
      content: [
        { type: 'text', value: '@Bean методы могут использовать другие @Bean методы как зависимости. Spring гарантирует правильный порядок создания.' },
        { type: 'code', language: 'java', value: '@Configuration\npublic class SecurityConfig {\n\n    @Bean\n    public PasswordEncoder passwordEncoder() {\n        // BCrypt — стандарт для хэширования паролей\n        return new BCryptPasswordEncoder();\n    }\n\n    @Bean\n    public UserDetailsService userDetailsService(UserRepository userRepository) {\n        // Spring передаст userRepository автоматически\n        return username -> userRepository\n            .findByEmail(username)\n            .orElseThrow(() -> new UsernameNotFoundException("Не найден: " + username));\n    }\n\n    @Bean\n    public AuthService authService(UserRepository repo, PasswordEncoder encoder) {\n        // Spring внедрит оба зависимых бина\n        return new AuthService(repo, encoder);\n    }\n}' },
        { type: 'heading', value: 'Вызов @Bean методов напрямую' },
        { type: 'code', language: 'java', value: '@Configuration\npublic class DatabaseConfig {\n\n    @Bean\n    public DataSource dataSource() {\n        return new HikariDataSource(hikariConfig());\n    }\n\n    @Bean\n    public HikariConfig hikariConfig() {\n        HikariConfig config = new HikariConfig();\n        config.setJdbcUrl("jdbc:postgresql://localhost:5432/mydb");\n        return config;\n    }\n    // dataSource() вызывает hikariConfig() — Spring\n    // перехватывает вызов и возвращает уже созданный бин,\n    // а не создаёт новый объект!\n}' },
        { type: 'warning', value: 'Spring использует CGLIB прокси для @Configuration классов. Поэтому вызов hikariConfig() внутри @Configuration возвращает тот же бин, а не создаёт новый. Это важно!' }
      ]
    },
    {
      id: 3,
      title: 'Scope бинов: Singleton и Prototype',
      type: 'theory',
      content: [
        { type: 'text', value: 'Scope (область видимости) определяет сколько экземпляров бина создаёт Spring и когда.' },
        { type: 'heading', value: 'Singleton (по умолчанию)' },
        { type: 'code', language: 'java', value: '// По умолчанию все бины — Singleton\n@Service\npublic class UserService { ... }\n\n// Явное указание\n@Service\n@Scope("singleton")  // или ConfigurableBeanFactory.SCOPE_SINGLETON\npublic class UserService { ... }\n\n// Один экземпляр на весь ApplicationContext\n// Spring создаёт его при старте и использует везде\nUserService s1 = context.getBean(UserService.class);\nUserService s2 = context.getBean(UserService.class);\nSystem.out.println(s1 == s2); // true — один и тот же объект!' },
        { type: 'heading', value: 'Prototype' },
        { type: 'code', language: 'java', value: '@Component\n@Scope("prototype")  // или ConfigurableBeanFactory.SCOPE_PROTOTYPE\npublic class RequestContext {\n    private String requestId;\n    // Каждый раз создаётся НОВЫЙ экземпляр\n}\n\nRequestContext r1 = context.getBean(RequestContext.class);\nRequestContext r2 = context.getBean(RequestContext.class);\nSystem.out.println(r1 == r2); // false — разные объекты!' },
        { type: 'heading', value: 'Веб-scope: Request и Session' },
        { type: 'code', language: 'java', value: '// Новый экземпляр для каждого HTTP запроса\n@Component\n@Scope(value = WebApplicationContext.SCOPE_REQUEST,\n       proxyMode = ScopedProxyMode.TARGET_CLASS)\npublic class RequestData {\n    private String userId;\n}\n\n// Живёт в рамках HTTP сессии пользователя\n@Component\n@Scope(value = WebApplicationContext.SCOPE_SESSION,\n       proxyMode = ScopedProxyMode.TARGET_CLASS)\npublic class ShoppingCart {\n    private List<Item> items = new ArrayList<>();\n}' },
        { type: 'tip', value: 'Используй Singleton для stateless сервисов (без состояния) — UserService, ProductService. Prototype — для объектов с состоянием, которое меняется для каждого клиента.' }
      ]
    },
    {
      id: 4,
      title: 'Условные бины: @Conditional и @Profile',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда нужно создавать разные бины в зависимости от среды запуска или конфигурации. Для этого Spring предоставляет @Conditional аннотации.' },
        { type: 'heading', value: '@ConditionalOnProperty' },
        { type: 'code', language: 'java', value: '@Configuration\npublic class CacheConfig {\n\n    // Бин создаётся только если в application.properties:\n    // cache.enabled=true\n    @Bean\n    @ConditionalOnProperty(name = "cache.enabled", havingValue = "true")\n    public CacheManager redisCacheManager() {\n        return new RedisCacheManager();\n    }\n\n    // Бин создаётся если cache.enabled=false или свойства нет\n    @Bean\n    @ConditionalOnProperty(name = "cache.enabled", havingValue = "false",\n                           matchIfMissing = true)\n    public CacheManager inMemoryCacheManager() {\n        return new ConcurrentMapCacheManager();\n    }\n}' },
        { type: 'heading', value: '@Profile' },
        { type: 'code', language: 'java', value: '// Для разработки — H2 база данных\n@Configuration\n@Profile("dev")\npublic class DevDatabaseConfig {\n    @Bean\n    public DataSource dataSource() {\n        return new EmbeddedDatabaseBuilder()\n            .setType(EmbeddedDatabaseType.H2)\n            .build();\n    }\n}\n\n// Для продакшена — PostgreSQL\n@Configuration\n@Profile("prod")\npublic class ProdDatabaseConfig {\n    @Bean\n    public DataSource dataSource() {\n        // Настройки PostgreSQL из переменных окружения\n        return DataSourceBuilder.create().build();\n    }\n}\n\n// Активация профиля:\n// application.properties: spring.profiles.active=dev\n// Или через переменную среды: SPRING_PROFILES_ACTIVE=prod' },
        { type: 'note', value: '@Profile — мощный инструмент для разделения конфигурации по средам. Dev, test, staging, prod — каждая среда может иметь свою конфигурацию бинов.' }
      ]
    },
    {
      id: 5,
      title: '@Primary и приоритет бинов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда несколько бинов реализуют один интерфейс, @Primary помечает "основной" бин который Spring будет внедрять по умолчанию.' },
        { type: 'code', language: 'java', value: 'public interface NotificationService {\n    void send(String message);\n}\n\n@Service\n@Primary  // Будет использоваться по умолчанию\npublic class EmailNotificationService implements NotificationService {\n    public void send(String message) {\n        System.out.println("Email: " + message);\n    }\n}\n\n@Service\npublic class SmsNotificationService implements NotificationService {\n    public void send(String message) {\n        System.out.println("SMS: " + message);\n    }\n}\n\n@Service\npublic class OrderService {\n    // Spring выберет EmailNotificationService (помечен @Primary)\n    private final NotificationService notificationService;\n\n    public OrderService(NotificationService notificationService) {\n        this.notificationService = notificationService;\n    }\n}' },
        { type: 'tip', value: '@Primary полезен когда одна реализация используется в большинстве случаев, а @Qualifier нужен только в исключениях. Это избавляет от @Qualifier во всех местах.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Конфигурация через @Bean',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай класс конфигурации, который регистрирует несколько бинов для работы с данными.',
      requirements: [
        'Создай @Configuration класс AppConfig',
        'Зарегистрируй бин ObjectMapper с настройкой INDENT_OUTPUT',
        'Зарегистрируй бин DateTimeFormatter для формата "dd.MM.yyyy"',
        'В контроллере внедри оба бина и используй их',
        'GET /format/date — возвращает текущую дату в формате "23.12.2024"'
      ],
      expectedOutput: 'GET /format/date => "21.03.2026"',
      hint: '@Configuration класс. @Bean public DateTimeFormatter dateFormatter() { return DateTimeFormatter.ofPattern("dd.MM.yyyy"); }. В контроллере внедри через конструктор.',
      solution: '// AppConfig.java\n@Configuration\npublic class AppConfig {\n\n    @Bean\n    public ObjectMapper objectMapper() {\n        ObjectMapper mapper = new ObjectMapper();\n        mapper.enable(SerializationFeature.INDENT_OUTPUT);\n        return mapper;\n    }\n\n    @Bean\n    public DateTimeFormatter dateFormatter() {\n        return DateTimeFormatter.ofPattern("dd.MM.yyyy");\n    }\n}\n\n// FormatController.java\n@RestController\n@RequestMapping("/format")\npublic class FormatController {\n    private final DateTimeFormatter dateFormatter;\n\n    public FormatController(DateTimeFormatter dateFormatter) {\n        this.dateFormatter = dateFormatter;\n    }\n\n    @GetMapping("/date")\n    public String formatDate() {\n        return LocalDate.now().format(dateFormatter);\n    }\n}',
      explanation: '@Configuration + @Bean позволяют регистрировать объекты сторонних библиотек в Spring контейнере. DateTimeFormatter и ObjectMapper — классы из Java/Jackson которые нельзя пометить @Component, поэтому мы создаём их через @Bean методы.'
    },
    {
      id: 7,
      title: 'Практика: Scope Prototype',
      type: 'practice',
      difficulty: 'hard',
      description: 'Продемонстрируй разницу между Singleton и Prototype scope, создав бины обоих типов.',
      requirements: [
        'Создай SingletonCounter с @Component (singleton по умолчанию) и счётчиком',
        'Создай PrototypeCounter с @Component @Scope("prototype") и счётчиком',
        'У обоих должен быть метод increment() и getCount()',
        'GET /counter/test — демонстрирует разницу: increment оба, вернуть их значения',
        'Singleton должен помнить состояние между запросами, Prototype — нет'
      ],
      expectedOutput: 'GET /counter/test (первый вызов) => {"singleton":1,"prototype":1}\nGET /counter/test (второй вызов) => {"singleton":2,"prototype":1}',
      hint: 'Singleton накапливает значение между запросами. Prototype каждый раз создаётся заново с 0. Для Prototype в Singleton-контроллере нужен ApplicationContext.getBean().',
      solution: '// SingletonCounter.java\n@Component\npublic class SingletonCounter {\n    private int count = 0;\n    public void increment() { count++; }\n    public int getCount() { return count; }\n}\n\n// PrototypeCounter.java\n@Component\n@Scope("prototype")\npublic class PrototypeCounter {\n    private int count = 0;\n    public void increment() { count++; }\n    public int getCount() { return count; }\n}\n\n// CounterController.java\n@RestController\npublic class CounterController {\n    private final SingletonCounter singletonCounter;\n    private final ApplicationContext context;\n\n    public CounterController(SingletonCounter singletonCounter,\n                              ApplicationContext context) {\n        this.singletonCounter = singletonCounter;\n        this.context = context;\n    }\n\n    @GetMapping("/counter/test")\n    public Map<String, Integer> test() {\n        // Singleton: один и тот же объект каждый раз\n        singletonCounter.increment();\n\n        // Prototype: новый объект каждый getBean() вызов\n        PrototypeCounter protoCounter = context.getBean(PrototypeCounter.class);\n        protoCounter.increment();\n\n        return Map.of(\n            "singleton", singletonCounter.getCount(),\n            "prototype", protoCounter.getCount()\n        );\n    }\n}',
      explanation: 'Singleton создаётся один раз и разделяется — поэтому счётчик растёт с каждым запросом. Prototype создаётся заново при каждом getBean() — счётчик всегда 1. Важно: для получения Prototype бина из Singleton используй ApplicationContext.getBean(), иначе Spring внедрит Prototype один раз при создании Singleton.'
    }
  ]
}
