export default {
  id: 1,
  title: 'Введение в Spring',
  description: 'Что такое Spring Framework, его история, архитектура и зачем он нужен Java-разработчику',
  lessons: [
    {
      id: 1,
      title: 'Что такое Spring Framework?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Framework — это мощный фреймворк для разработки Java-приложений. Он появился в 2003 году и с тех пор стал стандартом де-факто в корпоративной Java-разработке.' },
        { type: 'tip', value: 'Представь Spring как строительные леса для здания. Ты не строишь леса с нуля — ты используешь готовую конструкцию, которая помогает тебе строить быстро и правильно. Spring берёт на себя рутинные задачи, чтобы ты мог сосредоточиться на бизнес-логике.' },
        { type: 'heading', value: 'Зачем нужен Spring?' },
        { type: 'text', value: 'До Spring разработчики писали огромное количество шаблонного (boilerplate) кода для каждого приложения: создание объектов, управление зависимостями, работа с базой данных, обработка HTTP-запросов. Spring автоматизирует всё это.' },
        { type: 'list', items: [
          'Управление зависимостями — Spring сам создаёт и связывает объекты',
          'Декларативное программирование — аннотации вместо XML конфигураций',
          'Интеграция с базами данных через Spring Data',
          'Безопасность через Spring Security',
          'REST API через Spring MVC и Spring Boot',
          'Огромная экосистема готовых решений'
        ]},
        { type: 'heading', value: 'История Spring' },
        { type: 'text', value: 'Spring создал Род Джонсон в 2003 году как альтернативу тяжёлым Enterprise JavaBeans (EJB). В книге "Expert One-on-One J2EE Design and Development" он описал концепцию лёгкого контейнера. Версия Spring Boot 1.0 вышла в 2014 году и произвела революцию в разработке.' },
        { type: 'note', value: 'Spring Boot — это не отдельный фреймворк, а надстройка над Spring Framework. Boot добавляет автоконфигурацию и убирает необходимость в ручной настройке.' }
      ]
    },
    {
      id: 2,
      title: 'Экосистема Spring',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring — это не один фреймворк, а целая экосистема проектов. Каждый проект решает определённую задачу.' },
        { type: 'heading', value: 'Основные проекты Spring' },
        { type: 'list', items: [
          'Spring Framework — ядро: IoC контейнер, AOP, транзакции',
          'Spring Boot — автоконфигурация, встроенный сервер, starter-зависимости',
          'Spring Data — работа с базами данных (JPA, MongoDB, Redis и другие)',
          'Spring Security — аутентификация и авторизация',
          'Spring Cloud — микросервисная архитектура',
          'Spring Batch — пакетная обработка данных',
          'Spring WebFlux — реактивное программирование'
        ]},
        { type: 'tip', value: 'Не нужно учить всё сразу. Начни с Spring Boot + Spring Data JPA + Spring Security — это покрывает 90% задач в реальных проектах.' },
        { type: 'heading', value: 'Что такое Spring Boot?' },
        { type: 'text', value: 'Spring Boot — это convention over configuration. Он следует соглашениям и автоматически настраивает приложение на основе зависимостей в проекте. Добавил зависимость spring-boot-starter-data-jpa? Он сам настроит подключение к базе данных.' },
        { type: 'code', language: 'java', value: '// Минимальное Spring Boot приложение — всего несколько строк!\n@SpringBootApplication\npublic class Application {\n    public static void main(String[] args) {\n        SpringApplication.run(Application.class, args);\n    }\n}' },
        { type: 'note', value: 'Аннотация @SpringBootApplication включает сразу три вещи: @Configuration, @EnableAutoConfiguration и @ComponentScan. Это точка входа в любое Spring Boot приложение.' }
      ]
    },
    {
      id: 3,
      title: 'Архитектура Spring: IoC контейнер',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сердце Spring — IoC контейнер (Inversion of Control Container). Он управляет жизненным циклом объектов в приложении.' },
        { type: 'heading', value: 'Что такое IoC?' },
        { type: 'text', value: 'Inversion of Control (инверсия управления) — это принцип, при котором управление созданием объектов передаётся фреймворку. Вместо того чтобы ты создавал объекты через new, Spring делает это за тебя.' },
        { type: 'code', language: 'java', value: '// БЕЗ Spring — ты сам создаёшь зависимости\npublic class OrderService {\n    private EmailService emailService;\n\n    public OrderService() {\n        this.emailService = new EmailService(); // жёсткая связь!\n    }\n}\n\n// СО Spring — контейнер внедряет зависимости\n@Service\npublic class OrderService {\n    private final EmailService emailService;\n\n    public OrderService(EmailService emailService) { // Spring сам передаст объект\n        this.emailService = emailService;\n    }\n}' },
        { type: 'tip', value: 'IoC — это как ресторан. Ты не идёшь на кухню сам готовить еду (не создаёшь объекты вручную). Ты делаешь заказ (объявляешь зависимость), и официант (Spring) приносит тебе готовое блюдо (объект).' },
        { type: 'heading', value: 'ApplicationContext' },
        { type: 'text', value: 'ApplicationContext — это главный интерфейс IoC контейнера. Он хранит все бины (beans) — объекты, которыми управляет Spring.' },
        { type: 'note', value: 'Bean (бин) — это любой объект, которым управляет Spring IoC контейнер. Ты объявляешь бины через аннотации (@Component, @Service, @Repository, @Bean), а контейнер их создаёт и хранит.' }
      ]
    },
    {
      id: 4,
      title: 'Maven и зависимости Spring Boot',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Boot использует Maven или Gradle для управления зависимостями. В большинстве проектов применяют Maven с файлом pom.xml.' },
        { type: 'heading', value: 'Spring Boot Parent POM' },
        { type: 'text', value: 'Все Spring Boot проекты наследуются от spring-boot-starter-parent. Это избавляет от указания версий для большинства библиотек — они уже совместимы друг с другом.' },
        { type: 'code', language: 'java', value: '<!-- pom.xml -->\n<parent>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-parent</artifactId>\n    <version>3.2.0</version>\n</parent>\n\n<dependencies>\n    <!-- Стартер для веб-разработки -->\n    <dependency>\n        <groupId>org.springframework.boot</groupId>\n        <artifactId>spring-boot-starter-web</artifactId>\n    </dependency>\n\n    <!-- Стартер для тестов -->\n    <dependency>\n        <groupId>org.springframework.boot</groupId>\n        <artifactId>spring-boot-starter-test</artifactId>\n        <scope>test</scope>\n    </dependency>\n</dependencies>' },
        { type: 'heading', value: 'Что такое Starter?' },
        { type: 'text', value: 'Spring Boot Starter — это набор зависимостей, собранных для определённой цели. Например, spring-boot-starter-web включает Spring MVC, Tomcat, Jackson и другие библиотеки для создания веб-приложений.' },
        { type: 'list', items: [
          'spring-boot-starter-web — для REST API и веб-приложений',
          'spring-boot-starter-data-jpa — для работы с базой данных через JPA',
          'spring-boot-starter-security — для аутентификации и авторизации',
          'spring-boot-starter-test — для тестирования',
          'spring-boot-starter-validation — для валидации данных',
          'spring-boot-starter-mail — для отправки email'
        ]},
        { type: 'warning', value: 'Всегда используй актуальную версию Spring Boot. На момент написания — 3.x. Версии 2.x и 3.x имеют важные отличия: Boot 3 требует Java 17+ и использует Jakarta EE вместо javax.' }
      ]
    },
    {
      id: 5,
      title: 'Spring Initializr — создаём проект',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Initializr (start.spring.io) — официальный генератор проектов Spring Boot. За несколько кликов ты получишь готовый проект с нужными зависимостями.' },
        { type: 'heading', value: 'Настройки при создании проекта' },
        { type: 'list', items: [
          'Project: Maven (или Gradle)',
          'Language: Java',
          'Spring Boot: последняя стабильная версия (например 3.2.x)',
          'Group: com.example (или ваш домен наоборот)',
          'Artifact: название проекта (например myapp)',
          'Packaging: Jar (для большинства случаев)',
          'Java: 17 или 21'
        ]},
        { type: 'tip', value: 'В IntelliJ IDEA Ultimate есть встроенная интеграция с Spring Initializr. В Community Edition можно скачать архив с start.spring.io и открыть его в IDE.' },
        { type: 'heading', value: 'Структура проекта' },
        { type: 'code', language: 'java', value: 'myapp/\n├── src/\n│   ├── main/\n│   │   ├── java/com/example/myapp/\n│   │   │   └── MyappApplication.java\n│   │   └── resources/\n│   │       ├── application.properties\n│   │       ├── static/\n│   │       └── templates/\n│   └── test/\n│       └── java/com/example/myapp/\n│           └── MyappApplicationTests.java\n└── pom.xml' },
        { type: 'note', value: 'application.properties (или application.yml) — главный файл настроек. Здесь указывают порт сервера, подключение к базе данных, секреты и другие конфигурации.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Анализ структуры Spring Boot проекта',
      type: 'practice',
      difficulty: 'easy',
      description: 'Изучи структуру типового Spring Boot проекта и ответь на вопросы о назначении каждого файла и аннотации.',
      requirements: [
        'Определи назначение аннотации @SpringBootApplication',
        'Объясни что делает SpringApplication.run()',
        'Укажи в каком файле хранятся настройки приложения',
        'Перечисли минимум 3 starter-зависимости и их назначение'
      ],
      expectedOutput: '@SpringBootApplication — запускает Spring контейнер\nSpringApplication.run() — стартует встроенный сервер\nНастройки: application.properties\nStarterы: web, data-jpa, security',
      hint: 'Вспомни урок про экосистему Spring и структуру проекта. @SpringBootApplication включает несколько аннотаций сразу.',
      solution: '// @SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan\n// Она говорит Spring: "Сканируй этот пакет и все вложенные,\n// настройся автоматически и это класс конфигурации"\n\n@SpringBootApplication\npublic class Application {\n    public static void main(String[] args) {\n        // SpringApplication.run() создаёт ApplicationContext,\n        // запускает встроенный Tomcat на порту 8080\n        // и начинает обрабатывать HTTP-запросы\n        SpringApplication.run(Application.class, args);\n    }\n}\n\n// Настройки — src/main/resources/application.properties\n// spring-boot-starter-web — REST API\n// spring-boot-starter-data-jpa — база данных\n// spring-boot-starter-security — безопасность',
      explanation: '@SpringBootApplication — ключевая аннотация. Она объединяет три аннотации: @Configuration (класс конфигурации), @EnableAutoConfiguration (автонастройка по зависимостям), @ComponentScan (сканирование компонентов). SpringApplication.run() создаёт IoC контейнер, регистрирует все бины и запускает встроенный веб-сервер.'
    },
    {
      id: 7,
      title: 'Практика: Первый запуск Spring Boot',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай минимальное Spring Boot приложение с одним endpoint-ом, который возвращает приветственное сообщение.',
      requirements: [
        'Создай класс Application с аннотацией @SpringBootApplication',
        'Создай контроллер HelloController с аннотацией @RestController',
        'Добавь метод hello(), возвращающий строку "Привет от Spring Boot!"',
        'Пометь метод аннотацией @GetMapping("/hello")',
        'Убедись что приложение запускается на порту 8080'
      ],
      expectedOutput: 'GET http://localhost:8080/hello\n=> "Привет от Spring Boot!"',
      hint: 'Создай два класса: Application (точка входа) и HelloController (контроллер). @RestController + @GetMapping — минимум для REST endpoint-а.',
      solution: '// Application.java\n@SpringBootApplication\npublic class Application {\n    public static void main(String[] args) {\n        SpringApplication.run(Application.class, args);\n    }\n}\n\n// HelloController.java\n@RestController\npublic class HelloController {\n\n    @GetMapping("/hello")\n    public String hello() {\n        return "Привет от Spring Boot!";\n    }\n}',
      explanation: '@RestController сообщает Spring, что этот класс — REST контроллер, и все его методы возвращают данные напрямую (не через шаблонизатор). @GetMapping("/hello") связывает HTTP GET запрос по пути /hello с методом hello(). При запуске Spring Boot автоматически поднимает Tomcat на порту 8080.'
    }
  ]
}
