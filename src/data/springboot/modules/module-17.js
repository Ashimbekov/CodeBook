export default {
  id: 17,
  title: 'Логирование',
  description: 'SLF4J и Logback в Spring Boot: уровни логов, паттерны, файловые аппендеры, структурированное логирование',
  lessons: [
    {
      id: 1,
      title: 'SLF4J и Logback: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Boot использует SLF4J (Simple Logging Facade for Java) как API логирования и Logback как реализацию. Они включены по умолчанию в spring-boot-starter.' },
        { type: 'heading', value: 'Уровни логирования (от наименее к наиболее критичному)' },
        { type: 'list', items: [
          'TRACE — детальная отладочная информация (очень много)',
          'DEBUG — отладочная информация для разработки',
          'INFO — важные события (старт, остановка, milestone)',
          'WARN — предупреждения (что-то нехорошее, но не критичное)',
          'ERROR — ошибки требующие внимания',
          'FATAL — критические ошибки (Logback не использует, только log4j)'
        ]},
        { type: 'code', language: 'java', value: 'import org.slf4j.Logger;\nimport org.slf4j.LoggerFactory;\n\n@Service\npublic class UserService {\n    // Получаем Logger для этого класса\n    private static final Logger log =\n        LoggerFactory.getLogger(UserService.class);\n\n    public User createUser(String email, String password) {\n        log.debug("Создание пользователя: {}", email);\n\n        if (userRepository.existsByEmail(email)) {\n            log.warn("Попытка регистрации с существующим email: {}", email);\n            throw new EmailAlreadyExistsException(email);\n        }\n\n        User user = new User(email, passwordEncoder.encode(password));\n        User saved = userRepository.save(user);\n        log.info("Пользователь создан: id={}, email={}", saved.getId(), email);\n        return saved;\n    }\n}' },
        { type: 'tip', value: 'Используй {} плейсхолдеры вместо конкатенации строк! log.debug("User: " + user) всегда создаёт строку. log.debug("User: {}", user) — только если DEBUG уровень включён. Это экономит ресурсы.' }
      ]
    },
    {
      id: 2,
      title: 'Lombok @Slf4j',
      type: 'theory',
      content: [
        { type: 'text', value: 'Lombok упрощает логирование — аннотация @Slf4j автоматически добавляет поле log в класс.' },
        { type: 'code', language: 'java', value: '// Без Lombok — много бойлерплейта\npublic class UserService {\n    private static final Logger log =\n        LoggerFactory.getLogger(UserService.class);\n}\n\n// С Lombok — просто одна аннотация!\n@Slf4j\n@Service\npublic class UserService {\n    // Lombok автоматически добавляет:\n    // private static final Logger log = LoggerFactory.getLogger(UserService.class);\n\n    public void doSomething() {\n        log.info("Это работает!");\n        log.debug("Отладочная информация: {}", someVar);\n        log.error("Ошибка при обработке id={}", id, exception);\n    }\n}' },
        { type: 'code', language: 'java', value: '<!-- pom.xml -->\n<dependency>\n    <groupId>org.projectlombok</groupId>\n    <artifactId>lombok</artifactId>\n    <optional>true</optional>\n</dependency>\n\n// Другие Lombok аннотации для логирования:\n// @Log       — java.util.logging\n// @Log4j2    — Log4j 2\n// @Slf4j     — SLF4J (рекомендуется для Spring)' },
        { type: 'note', value: '@Slf4j — наиболее универсальный выбор в Spring Boot. Если потом захочется сменить Logback на другую реализацию — менять код не нужно, только зависимости.' }
      ]
    },
    {
      id: 3,
      title: 'Настройка логирования в application.yml',
      type: 'theory',
      content: [
        { type: 'text', value: 'Базовую настройку логирования можно сделать прямо в application.yml без отдельного XML файла конфигурации.' },
        { type: 'code', language: 'java', value: '# application.yml\nlogging:\n  level:\n    root: INFO                          # по умолчанию для всего\n    com.example: DEBUG                  # DEBUG для всего нашего кода\n    com.example.security: WARN          # только WARN для security пакета\n    org.hibernate.SQL: DEBUG            # SQL запросы\n    org.hibernate.type.descriptor: TRACE # параметры SQL запросов\n    org.springframework.web: DEBUG      # HTTP запросы\n\n  # Формат вывода в консоль\n  pattern:\n    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"\n\n  # Логирование в файл\n  file:\n    name: logs/application.log          # имя файла\n    max-size: 10MB                     # максимальный размер\n    max-history: 30                    # хранить 30 дней' },
        { type: 'heading', value: 'Паттерн формата лога' },
        { type: 'code', language: 'java', value: '# Элементы паттерна:\n# %d{yyyy-MM-dd HH:mm:ss} — дата и время\n# [%thread]               — поток выполнения\n# %-5level                — уровень (выровненный по 5 символов)\n# %logger{36}             — имя логгера (класса), макс 36 символов\n# %msg                    — само сообщение\n# %n                      — перенос строки\n# %X{requestId}           — MDC значение (ID запроса)\n\n# Пример вывода:\n# 2024-01-15 10:30:00 [http-nio-1] INFO  c.e.UserService - Пользователь создан: id=42' }
      ]
    },
    {
      id: 4,
      title: 'Logback XML конфигурация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для сложных сценариев логирования (несколько файлов, разные форматы) используй logback-spring.xml в src/main/resources.' },
        { type: 'code', language: 'java', value: '<!-- src/main/resources/logback-spring.xml -->\n<configuration>\n\n    <!-- Консольный аппендер -->\n    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">\n        <encoder>\n            <pattern>%d{HH:mm:ss} %-5level %logger{25} - %msg%n</pattern>\n            <charset>UTF-8</charset>\n        </encoder>\n    </appender>\n\n    <!-- Файловый аппендер с ротацией -->\n    <appender name="FILE"\n              class="ch.qos.logback.core.rolling.RollingFileAppender">\n        <file>logs/application.log</file>\n        <rollingPolicy\n            class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">\n            <!-- Новый файл каждый день -->\n            <fileNamePattern>logs/archived/app.%d{yyyy-MM-dd}.log.gz</fileNamePattern>\n            <maxHistory>30</maxHistory>   <!-- хранить 30 дней -->\n            <totalSizeCap>1GB</totalSizeCap>\n        </rollingPolicy>\n        <encoder>\n            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>\n        </encoder>\n    </appender>\n\n    <!-- Только ошибки в отдельный файл -->\n    <appender name="ERROR_FILE"\n              class="ch.qos.logback.core.rolling.RollingFileAppender">\n        <filter class="ch.qos.logback.classic.filter.LevelFilter">\n            <level>ERROR</level>\n            <onMatch>ACCEPT</onMatch>\n            <onMismatch>DENY</onMismatch>\n        </filter>\n        <file>logs/errors.log</file>\n        <encoder>\n            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %logger{36} - %msg%n</pattern>\n        </encoder>\n    </appender>\n\n    <!-- Профиль dev: подробные логи в консоль -->\n    <springProfile name="dev">\n        <root level="DEBUG">\n            <appender-ref ref="CONSOLE"/>\n        </root>\n    </springProfile>\n\n    <!-- Профиль prod: только INFO+ в файл -->\n    <springProfile name="prod">\n        <root level="INFO">\n            <appender-ref ref="FILE"/>\n            <appender-ref ref="ERROR_FILE"/>\n        </root>\n    </springProfile>\n\n</configuration>' }
      ]
    },
    {
      id: 5,
      title: 'MDC: контекст запроса в логах',
      type: 'theory',
      content: [
        { type: 'text', value: 'MDC (Mapped Diagnostic Context) позволяет добавить контекстную информацию (например, ID запроса) ко всем логам в рамках одного запроса.' },
        { type: 'code', language: 'java', value: '// MDC фильтр — добавляем уникальный ID к каждому запросу\n@Component\n@Order(1)\npublic class RequestIdFilter implements Filter {\n\n    @Override\n    public void doFilter(ServletRequest req, ServletResponse resp,\n                         FilterChain chain) throws IOException, ServletException {\n        try {\n            // Генерируем уникальный ID для запроса\n            String requestId = UUID.randomUUID().toString().substring(0, 8);\n            MDC.put("requestId", requestId);\n            MDC.put("clientIp", req.getRemoteAddr());\n\n            chain.doFilter(req, resp);\n        } finally {\n            MDC.clear(); // ВАЖНО: очищаем после запроса!\n        }\n    }\n}' },
        { type: 'code', language: 'java', value: '# В паттерне logback используем %X{requestId}\n# Паттерн:\n# %d{HH:mm:ss} [%X{requestId}] %-5level %logger{25} - %msg%n\n\n# Теперь все логи одного запроса имеют одинаковый ID:\n# 10:30:00 [a1b2c3d4] INFO  UserController - GET /api/users/42\n# 10:30:00 [a1b2c3d4] DEBUG UserService - Поиск пользователя id=42\n# 10:30:00 [a1b2c3d4] DEBUG UserRepository - SELECT * FROM users WHERE id=42\n# 10:30:00 [a1b2c3d4] INFO  UserController - Ответ 200 OK, время=15ms' },
        { type: 'tip', value: 'MDC — незаменимый инструмент в микросервисах. Передавай X-Request-ID из входящего запроса или генерируй новый. Так легко найти все логи одной операции среди тысяч строк.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Настройка логирования для проекта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настрой полноценное логирование для REST API приложения с разными уровнями по профилям.',
      requirements: [
        '@Slf4j на всех сервисах и контроллерах',
        'Логировать: вход в метод (DEBUG), успех (INFO), ошибки (ERROR)',
        'MDC фильтр добавляющий requestId к каждому запросу',
        'Паттерн логов включающий: время, requestId, уровень, класс, сообщение',
        'application-dev.yml: DEBUG, application-prod.yml: INFO'
      ],
      expectedOutput: '10:30:01 [a1b2c3d4] INFO  ProductController - GET /api/products\n10:30:01 [a1b2c3d4] DEBUG ProductService - findAll() вызван\n10:30:01 [a1b2c3d4] INFO  ProductController - Возвращаем 5 продуктов',
      hint: '@Slf4j на классах. log.debug() при входе в метод. log.info() при успехе. log.error("...", exception) при ошибках. MDC.put("requestId", uuid) в Filter. %X{requestId} в паттерне.',
      solution: '// RequestLoggingFilter.java\n@Component\n@Order(1)\npublic class RequestLoggingFilter extends OncePerRequestFilter {\n    private static final Logger log =\n        LoggerFactory.getLogger(RequestLoggingFilter.class);\n\n    @Override\n    protected void doFilterInternal(\n            HttpServletRequest request, HttpServletResponse response,\n            FilterChain chain) throws IOException, ServletException {\n        String requestId = UUID.randomUUID().toString().substring(0, 8);\n        long startTime = System.currentTimeMillis();\n        try {\n            MDC.put("requestId", requestId);\n            response.addHeader("X-Request-Id", requestId);\n            log.info("{} {} — начало", request.getMethod(),\n                request.getRequestURI());\n            chain.doFilter(request, response);\n            log.info("{} {} — {} ({}ms)",\n                request.getMethod(), request.getRequestURI(),\n                response.getStatus(),\n                System.currentTimeMillis() - startTime);\n        } finally {\n            MDC.clear();\n        }\n    }\n}\n\n// ProductService.java\n@Slf4j\n@Service\npublic class ProductService {\n    private final ProductRepository productRepository;\n\n    public List<Product> findAll() {\n        log.debug("findAll() вызван");\n        List<Product> products = productRepository.findAll();\n        log.info("Загружено {} продуктов", products.size());\n        return products;\n    }\n\n    public Product findById(Long id) {\n        log.debug("Поиск продукта id={}", id);\n        return productRepository.findById(id).orElseThrow(() -> {\n            log.warn("Продукт не найден: id={}", id);\n            return new RuntimeException("Продукт не найден: " + id);\n        });\n    }\n}\n\n// application.yml\n// logging:\n//   pattern:\n//     console: "%d{HH:mm:ss} [%X{requestId}] %-5level %logger{25} - %msg%n"\n//\n// application-dev.yml:\n// logging:\n//   level:\n//     com.example: DEBUG\n//\n// application-prod.yml:\n// logging:\n//   level:\n//     root: INFO',
      explanation: 'MDC.put() добавляет данные в контекст текущего потока. %X{requestId} в паттерне вставляет значение из MDC. MDC.clear() в finally — обязательно, иначе данные утекут в следующий запрос (пулы потоков переиспользуют потоки). log.debug() с {} плейсхолдерами не строит строку если DEBUG выключен.'
    }
  ]
}
