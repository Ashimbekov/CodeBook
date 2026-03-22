export default {
  id: 16,
  title: 'Конфигурация и профили',
  description: 'Управление конфигурацией: application.yml, профили Spring, @ConfigurationProperties, переменные окружения',
  lessons: [
    {
      id: 1,
      title: 'application.yml vs application.properties',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Boot поддерживает оба формата. YAML удобнее для сложных настроек — нет повторений, читается как дерево.' },
        { type: 'code', language: 'java', value: '# application.properties стиль (много повторений)\nspring.datasource.url=jdbc:postgresql://localhost:5432/mydb\nspring.datasource.username=postgres\nspring.datasource.password=secret\nspring.datasource.driver-class-name=org.postgresql.Driver\nspring.jpa.hibernate.ddl-auto=validate\nspring.jpa.show-sql=false\n\n# Тоже самое в application.yml (нет повторений)\nspring:\n  datasource:\n    url: jdbc:postgresql://localhost:5432/mydb\n    username: postgres\n    password: secret\n    driver-class-name: org.postgresql.Driver\n  jpa:\n    hibernate:\n      ddl-auto: validate\n    show-sql: false' },
        { type: 'heading', value: 'Свои настройки' },
        { type: 'code', language: 'java', value: '# application.yml\napp:\n  name: "Мой проект"\n  version: "2.0.1"\n  max-upload-size: 10MB\n  allowed-origins:\n    - "http://localhost:3000"\n    - "https://myapp.com"\n  features:\n    email-notifications: true\n    dark-mode: false' },
        { type: 'tip', value: 'Используй kebab-case (слова через дефис) в .yml файлах: max-upload-size, not maxUploadSize. Spring автоматически конвертирует kebab-case, camelCase и UPPER_CASE в одно и то же свойство.' }
      ]
    },
    {
      id: 2,
      title: '@ConfigurationProperties: типобезопасная конфигурация',
      type: 'theory',
      content: [
        { type: 'text', value: '@ConfigurationProperties — способ привязать группу настроек к Java классу. Лучше @Value для сложных конфигураций.' },
        { type: 'code', language: 'java', value: '// Класс настроек\n@ConfigurationProperties(prefix = "app")\n@Component  // или используй @EnableConfigurationProperties\n@Validated  // включает Bean Validation\npublic class AppProperties {\n\n    @NotBlank\n    private String name;\n\n    private String version = "1.0.0";\n\n    @Min(1)\n    @Max(100)\n    private int maxConnections = 10;\n\n    private List<String> allowedOrigins = new ArrayList<>();\n\n    private Mail mail = new Mail();\n\n    // Вложенный класс\n    public static class Mail {\n        private String host;\n        private int port = 587;\n        private String username;\n        private String password;\n        // геттеры и сеттеры\n    }\n    // геттеры и сеттеры\n}\n\n// application.yml\n// app:\n//   name: "Мой проект"\n//   max-connections: 20\n//   allowed-origins:\n//     - "http://localhost:3000"\n//   mail:\n//     host: smtp.gmail.com\n//     port: 587\n//     username: myapp@gmail.com' },
        { type: 'code', language: 'java', value: '// Использование\n@Service\npublic class MailService {\n    private final AppProperties appProperties;\n\n    public MailService(AppProperties appProperties) {\n        this.appProperties = appProperties;\n    }\n\n    public void sendMail(String to, String subject, String body) {\n        String host = appProperties.getMail().getHost();\n        int port = appProperties.getMail().getPort();\n        // использование настроек\n    }\n}' },
        { type: 'note', value: '@ConfigurationProperties vs @Value: @Value("${prop}") — для одного значения. @ConfigurationProperties — для группы связанных настроек. @ConfigurationProperties типобезопасен и поддерживает сложные типы (List, Map, вложенные объекты).' }
      ]
    },
    {
      id: 3,
      title: 'Профили Spring: dev, test, prod',
      type: 'theory',
      content: [
        { type: 'text', value: 'Профили позволяют иметь разные конфигурации для разных сред: разработка, тестирование, продакшн.' },
        { type: 'code', language: 'java', value: '# Файлы конфигурации по профилям:\n# application.yml          — общие настройки\n# application-dev.yml      — только для dev\n# application-test.yml     — только для test\n# application-prod.yml     — только для prod\n\n# application.yml\nspring:\n  application:\n    name: myapp\napp:\n  feature-flags:\n    new-ui: false\n\n# application-dev.yml\nspring:\n  datasource:\n    url: jdbc:h2:mem:devdb\n  jpa:\n    show-sql: true\n    hibernate:\n      ddl-auto: create-drop\nlogging:\n  level:\n    com.example: DEBUG\napp:\n  feature-flags:\n    new-ui: true\n\n# application-prod.yml\nspring:\n  datasource:\n    url: ${DATABASE_URL}  # из переменной окружения!\n    username: ${DB_USER}\n    password: ${DB_PASSWORD}\n  jpa:\n    show-sql: false\n    hibernate:\n      ddl-auto: validate\nlogging:\n  level:\n    root: WARN' },
        { type: 'heading', value: 'Активация профиля' },
        { type: 'code', language: 'java', value: '# В application.properties/yml\nspring.profiles.active=dev\n\n# Через переменную окружения (лучший способ)\nexport SPRING_PROFILES_ACTIVE=prod\n\n# В командной строке\njava -jar myapp.jar --spring.profiles.active=prod\n\n# В IntelliJ IDEA: Run Configurations → Active profiles' }
      ]
    },
    {
      id: 4,
      title: 'Переменные окружения и секреты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Никогда не коммить секреты (пароли, токены, ключи) в git. Используй переменные окружения или внешние хранилища секретов.' },
        { type: 'code', language: 'java', value: '# application.yml\nspring:\n  datasource:\n    url: ${DATABASE_URL:jdbc:h2:mem:testdb}  # если нет переменной — дефолт\n    username: ${DB_USERNAME:sa}\n    password: ${DB_PASSWORD:}\n\njwt:\n  secret: ${JWT_SECRET:defaultSecretForDevOnly}\n  expiration: ${JWT_EXPIRATION:86400000}\n\naws:\n  access-key: ${AWS_ACCESS_KEY}\n  secret-key: ${AWS_SECRET_KEY}\n  region: ${AWS_REGION:eu-central-1}' },
        { type: 'code', language: 'java', value: '# .env файл (НЕ коммить в git!)\nDATABASE_URL=jdbc:postgresql://prod-server:5432/mydb\nDB_USERNAME=myapp_user\nDB_PASSWORD=verySecretPassword123\nJWT_SECRET=myLong256BitSecretKeyForJwtSigning\n\n# Задать переменные окружения в Linux/Mac:\nexport DATABASE_URL=jdbc:postgresql://localhost:5432/mydb\nexport DB_USERNAME=postgres\n\n# В Docker Compose:\n# environment:\n#   - DATABASE_URL=jdbc:postgresql://db:5432/mydb\n#   - DB_PASSWORD=${DB_PASSWORD}' },
        { type: 'warning', value: 'Добавь .env в .gitignore! Никогда не коммить файлы с паролями. На продакшне используй переменные окружения, Docker secrets или AWS Secrets Manager.' }
      ]
    },
    {
      id: 5,
      title: '@Profile на бинах и конфигурациях',
      type: 'theory',
      content: [
        { type: 'text', value: '@Profile на классах и методах позволяет регистрировать разные бины для разных профилей.' },
        { type: 'code', language: 'java', value: '// Интерфейс\npublic interface StorageService {\n    void save(String filename, byte[] data);\n    byte[] load(String filename);\n}\n\n// Реализация для разработки (локальные файлы)\n@Service\n@Profile("dev")  // только в dev профиле\npublic class LocalStorageService implements StorageService {\n    public void save(String filename, byte[] data) {\n        // сохраняем в папку /tmp/uploads/\n    }\n    public byte[] load(String filename) {\n        // читаем из /tmp/uploads/\n    }\n}\n\n// Реализация для продакшена (AWS S3)\n@Service\n@Profile("prod")  // только в prod профиле\npublic class S3StorageService implements StorageService {\n    private final AmazonS3 s3Client;\n\n    public void save(String filename, byte[] data) {\n        // загружаем в S3\n    }\n    public byte[] load(String filename) {\n        // скачиваем из S3\n    }\n}\n\n// В сервисе — просто используем интерфейс\n@Service\npublic class FileService {\n    private final StorageService storageService; // Spring выберет нужную реализацию\n}' },
        { type: 'tip', value: 'Можно комбинировать профили: @Profile("!prod") — все кроме prod. @Profile({"dev", "test"}) — и dev, и test.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Многопрофильная конфигурация',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настрой приложение с тремя профилями (dev, test, prod) с разными источниками данных и конфигурациями.',
      requirements: [
        'application.yml — общие настройки и AppProperties класс',
        'application-dev.yml — H2 БД, show-sql=true, DEBUG логи',
        'application-prod.yml — переменные окружения для БД',
        '@ConfigurationProperties класс AppProperties с: name, version, maxPageSize',
        'GET /api/config — показывает текущий профиль и настройки (только dev!)'
      ],
      expectedOutput: 'spring.profiles.active=dev\nGET /api/config => {"profile":"dev","appName":"...","maxPageSize":10}\nspring.profiles.active=prod\nGET /api/config => 404 (endpoint отключён в prod)',
      hint: 'Три yml файла. @ConfigurationProperties(prefix="app") класс. Контроллер с @Profile("dev") — будет создан только в dev. @Autowired Environment для текущего профиля.',
      solution: '// application.yml\napp:\n  name: "Моё приложение"\n  version: "1.0.0"\n  max-page-size: 100\nspring:\n  profiles:\n    active: dev\n\n// application-dev.yml\nspring:\n  datasource:\n    url: jdbc:h2:mem:devdb\n  jpa:\n    show-sql: true\n    hibernate:\n      ddl-auto: create-drop\n  h2:\n    console:\n      enabled: true\nlogging:\n  level:\n    com.example: DEBUG\napp:\n  max-page-size: 10\n\n// application-prod.yml\nspring:\n  datasource:\n    url: ${DATABASE_URL}\n    username: ${DB_USER}\n    password: ${DB_PASSWORD}\n  jpa:\n    show-sql: false\n    hibernate:\n      ddl-auto: validate\nlogging:\n  level:\n    root: WARN\n\n// AppProperties.java\n@ConfigurationProperties(prefix = "app")\n@Component\npublic class AppProperties {\n    private String name;\n    private String version;\n    private int maxPageSize = 20;\n    // геттеры, сеттеры\n}\n\n// ConfigController.java — только в dev!\n@RestController\n@RequestMapping("/api")\n@Profile("dev")\npublic class ConfigController {\n    private final AppProperties appProperties;\n    private final Environment environment;\n\n    public ConfigController(AppProperties appProperties,\n                             Environment environment) {\n        this.appProperties = appProperties;\n        this.environment = environment;\n    }\n\n    @GetMapping("/config")\n    public Map<String, Object> getConfig() {\n        return Map.of(\n            "profile", Arrays.toString(environment.getActiveProfiles()),\n            "appName", appProperties.getName(),\n            "version", appProperties.getVersion(),\n            "maxPageSize", appProperties.getMaxPageSize()\n        );\n    }\n}',
      explanation: 'Профили позволяют иметь разные настройки для разных сред. application-dev.yml переопределяет только нужные свойства — остальные берутся из application.yml. @Profile("dev") на контроллере — он создаётся только в dev профиле, в prod его нет. @ConfigurationProperties типобезопасно маппит yml настройки в Java объект.'
    }
  ]
}
