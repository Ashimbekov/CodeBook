export default {
  id: 2,
  title: 'Первый проект Spring Boot',
  description: 'Создаём первый Spring Boot проект с нуля: настройка, запуск, первый REST endpoint',
  lessons: [
    {
      id: 1,
      title: 'Создание проекта через Spring Initializr',
      type: 'theory',
      content: [
        { type: 'text', value: 'Самый быстрый способ начать проект на Spring Boot — воспользоваться сайтом start.spring.io. Это официальный генератор проектов от команды Spring.' },
        { type: 'heading', value: 'Шаги создания проекта' },
        { type: 'list', items: [
          'Открой start.spring.io в браузере',
          'Выбери Project: Maven, Language: Java',
          'Spring Boot: 3.2.x (последняя стабильная)',
          'Group: com.example, Artifact: demo',
          'Packaging: Jar, Java: 21',
          'В разделе Dependencies добавь: Spring Web',
          'Нажми Generate — скачается архив',
          'Распакуй и открой в IntelliJ IDEA'
        ]},
        { type: 'code', language: 'java', value: '<!-- Зависимость добавится автоматически в pom.xml -->\n<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-web</artifactId>\n</dependency>' },
        { type: 'tip', value: 'В IntelliJ IDEA Ultimate: File → New → Project → Spring Initializr. Всё можно настроить прямо в IDE без браузера.' },
        { type: 'note', value: 'spring-boot-starter-web включает: Spring MVC (веб-фреймворк), Apache Tomcat (встроенный сервер), Jackson (конвертация JSON), и другие необходимые библиотеки.' }
      ]
    },
    {
      id: 2,
      title: 'Структура Spring Boot проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'После создания проекта ты увидишь стандартную структуру Maven-проекта с несколькими дополнительными файлами от Spring Boot.' },
        { type: 'code', language: 'java', value: 'demo/\n├── src/\n│   ├── main/\n│   │   ├── java/\n│   │   │   └── com/example/demo/\n│   │   │       └── DemoApplication.java    // точка входа\n│   │   └── resources/\n│   │       ├── application.properties      // конфигурация\n│   │       ├── static/                     // статические файлы\n│   │       └── templates/                 // шаблоны (Thymeleaf)\n│   └── test/\n│       └── java/\n│           └── com/example/demo/\n│               └── DemoApplicationTests.java\n├── .mvn/\n├── mvnw                                   // Maven wrapper\n├── mvnw.cmd\n└── pom.xml                               // зависимости проекта' },
        { type: 'heading', value: 'Важные файлы' },
        { type: 'list', items: [
          'DemoApplication.java — главный класс с методом main()',
          'application.properties — настройки: порт, БД, логирование и т.д.',
          'pom.xml — зависимости и плагины Maven',
          'mvnw — Maven wrapper, запускает Maven без его установки'
        ]},
        { type: 'tip', value: 'Используй application.yml вместо application.properties — YAML более читаем для сложных конфигураций. Оба файла работают одинаково.' }
      ]
    },
    {
      id: 3,
      title: 'Главный класс и запуск приложения',
      type: 'theory',
      content: [
        { type: 'text', value: 'DemoApplication.java — точка входа в Spring Boot приложение. Разберём его по частям.' },
        { type: 'code', language: 'java', value: 'package com.example.demo;\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n\n@SpringBootApplication\npublic class DemoApplication {\n\n    public static void main(String[] args) {\n        SpringApplication.run(DemoApplication.class, args);\n    }\n}' },
        { type: 'heading', value: 'Что происходит при запуске' },
        { type: 'list', items: [
          'JVM запускает метод main()',
          'SpringApplication.run() создаёт ApplicationContext',
          'Сканирует пакет и регистрирует все @Component, @Service, @Repository, @Controller',
          'Автоматически настраивает приложение (AutoConfiguration)',
          'Запускает встроенный Tomcat на порту 8080',
          'Приложение готово принимать запросы'
        ]},
        { type: 'code', language: 'java', value: '// Вывод в консоли при успешном запуске:\n//\n// .   ____          _            __ _ _\n// /\\\\ / ___\'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\\n// ...\n// Started DemoApplication in 2.345 seconds (process running for 2.678)\n\n// Теперь можно открыть http://localhost:8080' },
        { type: 'warning', value: 'Если порт 8080 занят — измени его в application.properties: server.port=8081. Или завершите процесс, который занимает порт 8080.' }
      ]
    },
    {
      id: 4,
      title: 'Первый REST контроллер',
      type: 'theory',
      content: [
        { type: 'text', value: 'Контроллер — класс, который обрабатывает HTTP-запросы. В Spring Boot достаточно двух аннотаций чтобы создать REST endpoint.' },
        { type: 'code', language: 'java', value: 'package com.example.demo;\n\nimport org.springframework.web.bind.annotation.GetMapping;\nimport org.springframework.web.bind.annotation.RestController;\n\n@RestController\npublic class HelloController {\n\n    @GetMapping("/hello")\n    public String hello() {\n        return "Привет от Spring Boot!";\n    }\n\n    @GetMapping("/info")\n    public String info() {\n        return "Spring Boot версия 3.2, Java 21";\n    }\n}' },
        { type: 'heading', value: 'Разбор аннотаций' },
        { type: 'list', items: [
          '@RestController = @Controller + @ResponseBody. Говорит Spring что это REST контроллер, возвращающий данные в теле ответа',
          '@GetMapping("/hello") — обрабатывает GET запросы на URL /hello',
          'Метод возвращает String — Spring автоматически отправит его как текст'
        ]},
        { type: 'tip', value: 'Попробуй открыть http://localhost:8080/hello в браузере или в Postman. Ты увидишь ответ от твоего контроллера.' },
        { type: 'note', value: 'Имена методов в контроллере не важны для Spring — важны только аннотации. Можно назвать метод хоть getHelloMessage() — главное правильная аннотация.' }
      ]
    },
    {
      id: 5,
      title: 'application.properties: базовая настройка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Файл application.properties (или application.yml) — главный конфигурационный файл Spring Boot. Здесь настраивают всё приложение без изменения кода.' },
        { type: 'code', language: 'java', value: '# application.properties\n\n# Порт сервера (по умолчанию 8080)\nserver.port=8080\n\n# Название приложения\nspring.application.name=demo\n\n# Уровень логирования\nlogging.level.root=INFO\nlogging.level.com.example=DEBUG\n\n# Показывать SQL запросы в логах\nspring.jpa.show-sql=true' },
        { type: 'heading', value: 'Эквивалент в YAML формате' },
        { type: 'code', language: 'java', value: '# application.yml\nserver:\n  port: 8080\n\nspring:\n  application:\n    name: demo\n  jpa:\n    show-sql: true\n\nlogging:\n  level:\n    root: INFO\n    com.example: DEBUG' },
        { type: 'tip', value: 'YAML удобнее для вложенных настроек — меньше повторений. Но не используй табы в YAML, только пробелы!' },
        { type: 'heading', value: 'Свои настройки' },
        { type: 'code', language: 'java', value: '# Свои настройки\napp.name=Мой первый проект\napp.version=1.0.0\napp.max-users=100\n\n// В коде читаем через @Value\n@Value("${app.name}")\nprivate String appName;\n\n@Value("${app.max-users}")\nprivate int maxUsers;' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Контроллер с несколькими endpoints',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай REST контроллер с тремя endpoints, возвращающими разную информацию о воображаемом приложении.',
      requirements: [
        'GET /api/name — возвращает название приложения',
        'GET /api/version — возвращает версию приложения',
        'GET /api/status — возвращает строку "OK" или "Running"',
        'Все endpoints должны возвращать String'
      ],
      expectedOutput: 'GET /api/name => "Мой Spring App"\nGET /api/version => "1.0.0"\nGET /api/status => "Running"',
      hint: 'Создай один класс контроллера с тремя методами. Каждый метод помечай @GetMapping с соответствующим путём.',
      solution: '@RestController\n@RequestMapping("/api")\npublic class AppInfoController {\n\n    @GetMapping("/name")\n    public String getName() {\n        return "Мой Spring App";\n    }\n\n    @GetMapping("/version")\n    public String getVersion() {\n        return "1.0.0";\n    }\n\n    @GetMapping("/status")\n    public String getStatus() {\n        return "Running";\n    }\n}',
      explanation: '@RequestMapping("/api") на уровне класса задаёт базовый путь для всех методов. Каждый @GetMapping добавляет свой путь к базовому. В итоге: /api + /name = /api/name. Это удобнее чем повторять /api в каждом методе.'
    },
    {
      id: 7,
      title: 'Практика: Конфигурация через application.properties',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настрой приложение через application.properties и считай значения в контроллере через @Value.',
      requirements: [
        'Добавь в application.properties: app.greeting=Добро пожаловать и app.author=Твоё имя',
        'В контроллере считай оба значения через @Value',
        'GET /greet — возвращает "Добро пожаловать от Твоё имя"',
        'Значения должны браться из файла, не захардкожены'
      ],
      expectedOutput: 'GET /greet => "Добро пожаловать от Нурдаулет"',
      hint: '@Value("${app.greeting}") private String greeting; — так читаются значения из application.properties. Не забудь про знак $ и фигурные скобки.',
      solution: '// application.properties:\n// app.greeting=Добро пожаловать\n// app.author=Нурдаулет\n\n@RestController\npublic class GreetingController {\n\n    @Value("${app.greeting}")\n    private String greeting;\n\n    @Value("${app.author}")\n    private String author;\n\n    @GetMapping("/greet")\n    public String greet() {\n        return greeting + " от " + author;\n    }\n}',
      explanation: '@Value("${key}") — аннотация для инъекции значений из application.properties. Spring читает файл при старте и подставляет значения. Это позволяет менять поведение приложения без изменения кода — просто редактируешь .properties файл.'
    }
  ]
}
