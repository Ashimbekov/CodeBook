export default {
  id: 45,
  title: 'API Versioning',
  description: 'Стратегии версионирования REST API: URL versioning, header versioning, content-type versioning, deprecation, обратная совместимость и миграция.',
  lessons: [
    {
      id: 1,
      title: 'URL Versioning',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Зачем версионировать API?' },
        { type: 'text', value: 'API эволюционирует: добавляются поля, меняется формат ответа, удаляются endpoints. Без версионирования любое изменение ломает существующих клиентов. Версионирование позволяет поддерживать старую и новую версию одновременно.' },
        { type: 'heading', value: 'URL Versioning — самый популярный подход' },
        { type: 'code', language: 'java', value: '// Версия в URL: /api/v1/users, /api/v2/users\n\n// V1 контроллер\n@RestController\n@RequestMapping("/api/v1/users")\npublic class UserControllerV1 {\n\n    @GetMapping("/{id}")\n    public UserResponseV1 getUser(@PathVariable Long id) {\n        User user = userService.findById(id);\n        return new UserResponseV1(\n            user.getId(),\n            user.getFirstName() + " " + user.getLastName(),  // одно поле name\n            user.getEmail()\n        );\n    }\n}\n\npublic record UserResponseV1(Long id, String name, String email) {}\n\n// V2 контроллер — разделённое имя\n@RestController\n@RequestMapping("/api/v2/users")\npublic class UserControllerV2 {\n\n    @GetMapping("/{id}")\n    public UserResponseV2 getUser(@PathVariable Long id) {\n        User user = userService.findById(id);\n        return new UserResponseV2(\n            user.getId(),\n            user.getFirstName(),   // отдельно имя\n            user.getLastName(),    // отдельно фамилия\n            user.getEmail(),\n            user.getCreatedAt()    // новое поле\n        );\n    }\n}\n\npublic record UserResponseV2(\n    Long id, String firstName, String lastName, \n    String email, LocalDateTime createdAt\n) {}' },
        { type: 'heading', value: 'Организация пакетов' },
        { type: 'code', language: 'text', value: 'src/main/java/com/example/\n├── controller/\n│   ├── v1/\n│   │   ├── UserControllerV1.java\n│   │   └── OrderControllerV1.java\n│   └── v2/\n│       ├── UserControllerV2.java\n│       └── OrderControllerV2.java\n├── dto/\n│   ├── v1/\n│   │   └── UserResponseV1.java\n│   └── v2/\n│       └── UserResponseV2.java\n└── service/\n    └── UserService.java  // общий сервис для всех версий' },
        { type: 'heading', value: 'Общий сервис для разных версий' },
        { type: 'code', language: 'java', value: '// Сервис не зависит от версии API\n@Service\npublic class UserService {\n\n    public User findById(Long id) {\n        return userRepository.findById(id)\n            .orElseThrow(() -> new UserNotFoundException(id));\n    }\n\n    public User create(String firstName, String lastName, String email) {\n        User user = new User();\n        user.setFirstName(firstName);\n        user.setLastName(lastName);\n        user.setEmail(email);\n        return userRepository.save(user);\n    }\n}\n\n// V1 принимает: { "name": "Иван Иванов", "email": "..." }\n// V2 принимает: { "firstName": "Иван", "lastName": "Иванов", "email": "..." }\n// Оба вызывают один и тот же сервис' },
        { type: 'tip', value: 'URL versioning самый простой и явный. Клиенты видят версию прямо в URL. Недостаток: дублирование контроллеров. Подходит для публичных API.' }
      ]
    },
    {
      id: 2,
      title: 'Header и Content-Type Versioning',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Header Versioning' },
        { type: 'text', value: 'Версия передаётся в кастомном HTTP заголовке. URL остаётся чистым, но версия менее заметна.' },
        { type: 'code', language: 'java', value: '// Версия в кастомном заголовке: X-API-Version: 2\n\n@RestController\n@RequestMapping("/api/users")\npublic class UserController {\n\n    @GetMapping(value = "/{id}", headers = "X-API-Version=1")\n    public UserResponseV1 getUserV1(@PathVariable Long id) {\n        User user = userService.findById(id);\n        return UserResponseV1.from(user);\n    }\n\n    @GetMapping(value = "/{id}", headers = "X-API-Version=2")\n    public UserResponseV2 getUserV2(@PathVariable Long id) {\n        User user = userService.findById(id);\n        return UserResponseV2.from(user);\n    }\n}\n\n// curl -H "X-API-Version: 1" http://localhost:8080/api/users/1\n// curl -H "X-API-Version: 2" http://localhost:8080/api/users/1' },
        { type: 'heading', value: 'Content-Type Versioning (Media Type)' },
        { type: 'code', language: 'java', value: '// Версия в Accept header: application/vnd.myapp.v2+json\n\n@RestController\n@RequestMapping("/api/users")\npublic class UserController {\n\n    @GetMapping(value = "/{id}\", \n                produces = \"application/vnd.myapp.v1+json\")\n    public UserResponseV1 getUserV1(@PathVariable Long id) {\n        return UserResponseV1.from(userService.findById(id));\n    }\n\n    @GetMapping(value = \"/{id}\", \n                produces = \"application/vnd.myapp.v2+json\")\n    public UserResponseV2 getUserV2(@PathVariable Long id) {\n        return UserResponseV2.from(userService.findById(id));\n    }\n}\n\n// curl -H \"Accept: application/vnd.myapp.v1+json\" http://localhost:8080/api/users/1\n// curl -H \"Accept: application/vnd.myapp.v2+json\" http://localhost:8080/api/users/1' },
        { type: 'heading', value: 'Кастомный RequestMappingHandlerMapping' },
        { type: 'code', language: 'java', value: '// Элегантный способ: кастомная аннотация @ApiVersion\n@Target({ElementType.TYPE, ElementType.METHOD})\n@Retention(RetentionPolicy.RUNTIME)\npublic @interface ApiVersion {\n    int value();\n}\n\n@Configuration\npublic class ApiVersionConfig implements WebMvcRegistrations {\n\n    @Override\n    public RequestMappingHandlerMapping getRequestMappingHandlerMapping() {\n        return new ApiVersionRequestMappingHandlerMapping();\n    }\n}\n\npublic class ApiVersionRequestMappingHandlerMapping \n        extends RequestMappingHandlerMapping {\n\n    @Override\n    protected RequestCondition<?> getCustomTypeCondition(Class<?> handlerType) {\n        ApiVersion apiVersion = AnnotationUtils.findAnnotation(\n            handlerType, ApiVersion.class);\n        return apiVersion != null \n            ? new ApiVersionCondition(apiVersion.value()) : null;\n    }\n\n    @Override\n    protected RequestCondition<?> getCustomMethodCondition(Method method) {\n        ApiVersion apiVersion = AnnotationUtils.findAnnotation(\n            method, ApiVersion.class);\n        return apiVersion != null \n            ? new ApiVersionCondition(apiVersion.value()) : null;\n    }\n}\n\n// Использование\n@RestController\n@RequestMapping(\"/api/users\")\n@ApiVersion(2)\npublic class UserControllerV2 {\n    @GetMapping(\"/{id}\")\n    public UserResponseV2 getUser(@PathVariable Long id) { }\n}' },
        { type: 'note', value: 'GitHub использует Accept header versioning, Google и Twitter — URL versioning. Выбирайте подход исходя из потребностей: URL — самый простой, Header — самый чистый.' }
      ]
    },
    {
      id: 3,
      title: 'Deprecation и обратная совместимость',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Правила обратной совместимости' },
        { type: 'list', items: [
          'Добавление нового поля в ответ — совместимо (клиенты игнорируют неизвестные поля)',
          'Удаление поля из ответа — НЕСОВМЕСТИМО (клиенты могут зависеть от него)',
          'Добавление необязательного параметра — совместимо',
          'Добавление обязательного параметра — НЕСОВМЕСТИМО',
          'Изменение типа поля (String -> Integer) — НЕСОВМЕСТИМО',
          'Изменение URL — НЕСОВМЕСТИМО'
        ] },
        { type: 'heading', value: 'Стратегия Deprecation' },
        { type: 'code', language: 'java', value: '// 1. Пометить старый endpoint как deprecated\n@RestController\n@RequestMapping(\"/api/v1/users\")\npublic class UserControllerV1 {\n\n    @GetMapping(\"/{id}\")\n    @Deprecated\n    public ResponseEntity<UserResponseV1> getUser(@PathVariable Long id) {\n        User user = userService.findById(id);\n        return ResponseEntity.ok()\n            .header(\"Deprecation\", \"true\")\n            .header(\"Sunset\", \"Sat, 01 Jul 2026 00:00:00 GMT\")\n            .header(\"Link\", \"</api/v2/users/\" + id + \">; rel=\\\"successor-version\\\"\")\n            .body(UserResponseV1.from(user));\n    }\n}\n\n// 2. Логировать использование deprecated endpoints\n@Aspect\n@Component\npublic class DeprecationLogger {\n\n    @Before(\"execution(* com.example.controller.v1..*(..))\")\n    public void logDeprecatedUsage(JoinPoint joinPoint) {\n        HttpServletRequest request = getCurrentRequest();\n        log.warn(\"DEPRECATED API call: {} {} from IP: {}\",\n            request.getMethod(), request.getRequestURI(),\n            request.getRemoteAddr());\n\n        deprecationMetrics.incrementCounter(\n            request.getRequestURI(), request.getRemoteAddr());\n    }\n}' },
        { type: 'heading', value: 'Migration Guide' },
        { type: 'code', language: 'java', value: '// 3. Endpoint для проверки миграции клиентов\n@RestController\n@RequestMapping(\"/api/admin/deprecation\")\npublic class DeprecationController {\n\n    @GetMapping(\"/stats\")\n    public DeprecationStats getStats() {\n        return new DeprecationStats(\n            deprecationMetrics.getV1CallCount(),\n            deprecationMetrics.getV2CallCount(),\n            deprecationMetrics.getV1UniqueClients(),\n            deprecationMetrics.getLastV1Call()\n        );\n    }\n}\n\n// Ответ:\n// {\n//   "v1Calls": 1250,\n//   "v2Calls": 45000,\n//   "v1UniqueClients": 3,\n//   "lastV1Call": "2026-04-04T15:30:00"\n// }' },
        { type: 'heading', value: 'Адаптер для совместимости' },
        { type: 'code', language: 'java', value: '// Adapter pattern: V1 использует V2 внутри\n@RestController\n@RequestMapping(\"/api/v1/users\")\npublic class UserControllerV1 {\n\n    private final UserControllerV2 v2Controller;\n\n    @GetMapping(\"/{id}\")\n    public ResponseEntity<UserResponseV1> getUser(@PathVariable Long id) {\n        UserResponseV2 v2Response = v2Controller.getUser(id).getBody();\n\n        // Конвертация V2 -> V1\n        UserResponseV1 v1Response = new UserResponseV1(\n            v2Response.id(),\n            v2Response.firstName() + \" \" + v2Response.lastName(),\n            v2Response.email()\n        );\n\n        return ResponseEntity.ok()\n            .header(\"Deprecation\", \"true\")\n            .body(v1Response);\n    }\n}' },
        { type: 'tip', value: 'Sunset header указывает дату отключения API. Это стандартный HTTP header (RFC 8594), который клиенты могут читать автоматически.' }
      ]
    },
    {
      id: 4,
      title: 'Стратегии миграции',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Поэтапная миграция' },
        { type: 'code', language: 'text', value: 'Этап 1 (месяц 1-2): Выпуск V2 API\n  - V1 и V2 работают параллельно\n  - V1 помечен как deprecated\n  - Документация V2 с migration guide\n\nЭтап 2 (месяц 3-4): Уведомление клиентов\n  - Email рассылка о deprecation V1\n  - Deprecation header в ответах V1\n  - Мониторинг использования V1\n\nЭтап 3 (месяц 5): Ограничение V1\n  - Rate limiting для V1 (снижаем лимит)\n  - Warning в ответах V1\n\nЭтап 4 (месяц 6): Отключение V1\n  - V1 возвращает 410 Gone\n  - Redirect на V2 документацию' },
        { type: 'heading', value: 'Feature Flags для версий' },
        { type: 'code', language: 'java', value: '// Использование Feature Flags вместо жёстких версий\n@Service\npublic class UserResponseBuilder {\n\n    private final FeatureFlagService featureFlags;\n\n    public Map<String, Object> buildUserResponse(User user, String apiKey) {\n        Map<String, Object> response = new LinkedHashMap<>();\n        response.put(\"id\", user.getId());\n        response.put(\"email\", user.getEmail());\n\n        // Новые поля доступны только если клиент включил feature\n        if (featureFlags.isEnabled(\"split-name\", apiKey)) {\n            response.put(\"firstName\", user.getFirstName());\n            response.put(\"lastName\", user.getLastName());\n        } else {\n            response.put(\"name\", user.getFullName());\n        }\n\n        if (featureFlags.isEnabled(\"user-metadata\", apiKey)) {\n            response.put(\"createdAt\", user.getCreatedAt());\n            response.put(\"lastLoginAt\", user.getLastLoginAt());\n        }\n\n        return response;\n    }\n}' },
        { type: 'heading', value: 'Версионирование в OpenAPI/Swagger' },
        { type: 'code', language: 'java', value: '@Configuration\npublic class SwaggerConfig {\n\n    @Bean\n    public GroupedOpenApi v1Api() {\n        return GroupedOpenApi.builder()\n            .group(\"v1\")\n            .pathsToMatch(\"/api/v1/**\")\n            .addOpenApiCustomizer(openApi -> \n                openApi.info(new Info()\n                    .title(\"API V1 (Deprecated)\")\n                    .version(\"1.0\")\n                    .description(\"Устаревшая версия. Используйте V2.\")))\n            .build();\n    }\n\n    @Bean\n    public GroupedOpenApi v2Api() {\n        return GroupedOpenApi.builder()\n            .group(\"v2\")\n            .pathsToMatch(\"/api/v2/**\")\n            .addOpenApiCustomizer(openApi -> \n                openApi.info(new Info()\n                    .title(\"API V2\")\n                    .version(\"2.0\")\n                    .description(\"Текущая версия API.\")))\n            .build();\n    }\n}\n\n// Swagger UI: /swagger-ui.html\n// Выбор версии через dropdown: v1, v2' },
        { type: 'note', value: 'API Versioning — это не только техническая задача. Нужна коммуникация с клиентами: changelog, migration guide, deprecation timeline.' }
      ]
    },
    {
      id: 5,
      title: 'Документация версий',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Changelog и Migration Guide' },
        { type: 'code', language: 'java', value: '// Endpoint для получения changelog\n@RestController\n@RequestMapping(\"/api\")\npublic class VersionController {\n\n    @GetMapping(\"/version\")\n    public VersionInfo getVersion() {\n        return new VersionInfo(\n            \"2.0\",\n            \"2026-04-01\",\n            List.of(\"1.0\"),\n            \"/docs/migration-v1-to-v2\"\n        );\n    }\n\n    @GetMapping(\"/changelog\")\n    public List<ChangelogEntry> getChangelog() {\n        return List.of(\n            new ChangelogEntry(\"2.0\", \"2026-04-01\", List.of(\n                \"Разделение поля name на firstName/lastName\",\n                \"Добавлено поле createdAt\",\n                \"POST /users теперь возвращает 201 вместо 200\"\n            )),\n            new ChangelogEntry(\"1.1\", \"2026-01-15\", List.of(\n                \"Добавлен endpoint GET /users/search\",\n                \"Пагинация по умолчанию: size=20\"\n            ))\n        );\n    }\n}\n\npublic record VersionInfo(\n    String current, String releaseDate, \n    List<String> deprecated, String migrationGuide\n) {}\n\npublic record ChangelogEntry(\n    String version, String date, List<String> changes\n) {}' },
        { type: 'heading', value: 'Автоматическая документация различий' },
        { type: 'code', language: 'java', value: '// Swagger аннотации для версий\n@RestController\n@RequestMapping(\"/api/v2/users\")\n@Tag(name = \"Users V2\", description = \"Управление пользователями (V2)\")\npublic class UserControllerV2 {\n\n    @Operation(\n        summary = \"Получить пользователя\",\n        description = \"Возвращает пользователя по ID. \" +\n                      \"V2: firstName/lastName вместо name.\"\n    )\n    @ApiResponses({\n        @ApiResponse(responseCode = \"200\", description = \"Пользователь найден\"),\n        @ApiResponse(responseCode = \"404\", description = \"Не найден\")\n    })\n    @GetMapping(\"/{id}\")\n    public UserResponseV2 getUser(@PathVariable Long id) {\n        return UserResponseV2.from(userService.findById(id));\n    }\n}\n\n// V1 с deprecated\n@Operation(\n    summary = \"Получить пользователя (DEPRECATED)\",\n    deprecated = true,\n    description = \"Используйте /api/v2/users/{id}. Будет отключён 01.07.2026.\"\n)\n@GetMapping(\"/{id}\")\npublic UserResponseV1 getUserV1(@PathVariable Long id) { }' },
        { type: 'heading', value: 'Тестирование обратной совместимости' },
        { type: 'code', language: 'java', value: '// Contract Testing — проверяем что V1 контракт не сломан\n@SpringBootTest(webEnvironment = RANDOM_PORT)\nclass V1CompatibilityTest {\n\n    @Autowired\n    TestRestTemplate restTemplate;\n\n    @Test\n    void v1GetUser_shouldRetainNameField() {\n        ResponseEntity<String> response = restTemplate.getForEntity(\n            \"/api/v1/users/1\", String.class);\n\n        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);\n\n        DocumentContext json = JsonPath.parse(response.getBody());\n        // V1 контракт: поле \"name\" должно быть строкой\n        assertThat(json.read(\"$.name\", String.class)).isNotBlank();\n        // Поля V2 НЕ должно быть\n        assertThatThrownBy(() -> json.read(\"$.firstName\"))\n            .isInstanceOf(PathNotFoundException.class);\n    }\n\n    @Test\n    void v1GetUser_shouldHaveDeprecationHeader() {\n        ResponseEntity<String> response = restTemplate.getForEntity(\n            \"/api/v1/users/1\", String.class);\n        assertThat(response.getHeaders().getFirst(\"Deprecation\")).isEqualTo(\"true\");\n        assertThat(response.getHeaders().getFirst(\"Sunset\")).isNotBlank();\n    }\n\n    @Test\n    void v2GetUser_shouldHaveSplitName() {\n        ResponseEntity<String> response = restTemplate.getForEntity(\n            \"/api/v2/users/1\", String.class);\n\n        DocumentContext json = JsonPath.parse(response.getBody());\n        assertThat(json.read(\"$.firstName\", String.class)).isNotBlank();\n        assertThat(json.read(\"$.lastName\", String.class)).isNotBlank();\n    }\n}' },
        { type: 'tip', value: 'Consumer-Driven Contract Testing (Spring Cloud Contract, Pact) позволяет клиентам определять свои ожидания, а API — проверять что они не нарушены.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Версионированный API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте версионированный REST API для пользователей: V1 с полем name, V2 с firstName/lastName, deprecation headers и тесты совместимости.',
      requirements: [
        'V1: GET /api/v1/users/{id} -> { id, name, email }',
        'V2: GET /api/v2/users/{id} -> { id, firstName, lastName, email, createdAt }',
        'V1 возвращает Deprecation и Sunset headers',
        'V1 адаптер вызывает V2 логику внутри',
        'Swagger документация для обеих версий',
        'Deprecation Logger Aspect',
        'Contract тесты для V1 и V2',
        'GET /api/version — информация о текущей версии и changelog'
      ],
      hint: 'Общий UserService возвращает User entity. V1/V2 контроллеры маппят его в свои DTO. V1 адаптер конвертирует V2 ответ в V1 формат.',
      expectedOutput: 'GET /api/v1/users/1:\nHeaders: Deprecation: true, Sunset: Sat, 01 Jul 2026 00:00:00 GMT\n{"id": 1, "name": "Иван Иванов", "email": "ivan@mail.com"}\n\nGET /api/v2/users/1:\n{"id": 1, "firstName": "Иван", "lastName": "Иванов", "email": "ivan@mail.com", "createdAt": "2026-01-15T10:00:00"}\n\nGET /api/version:\n{"current": "2.0", "deprecated": ["1.0"], "sunset": "2026-07-01"}\n\nSwagger UI: /swagger-ui.html -> группы v1, v2',
      solution: '@RestController @RequestMapping("/api/v2/users")\n@Tag(name = "Users V2")\npublic class UserControllerV2 {\n    private final UserService service;\n\n    @GetMapping("/{id}")\n    public ResponseEntity<UserResponseV2> getUser(@PathVariable Long id) {\n        User user = service.findById(id);\n        return ResponseEntity.ok(UserResponseV2.from(user));\n    }\n}\n\n@RestController @RequestMapping("/api/v1/users")\n@Tag(name = "Users V1 (Deprecated)")\npublic class UserControllerV1 {\n    private final UserService service;\n\n    @GetMapping("/{id}")\n    @Operation(deprecated = true)\n    public ResponseEntity<UserResponseV1> getUser(@PathVariable Long id) {\n        User user = service.findById(id);\n        return ResponseEntity.ok()\n            .header("Deprecation", "true")\n            .header("Sunset", "Sat, 01 Jul 2026 00:00:00 GMT")\n            .header("Link", "</api/v2/users/" + id + ">; rel=\\"successor-version\\"")\n            .body(new UserResponseV1(user.getId(),\n                user.getFirstName() + " " + user.getLastName(),\n                user.getEmail()));\n    }\n}\n\npublic record UserResponseV1(Long id, String name, String email) {}\npublic record UserResponseV2(Long id, String firstName, String lastName,\n    String email, LocalDateTime createdAt) {\n    public static UserResponseV2 from(User u) {\n        return new UserResponseV2(u.getId(), u.getFirstName(),\n            u.getLastName(), u.getEmail(), u.getCreatedAt());\n    }\n}\n\n@Aspect @Component\npublic class DeprecationLogger {\n    @Before("execution(* com.example.controller.v1..*.*(..))")\n    public void log(JoinPoint jp) {\n        log.warn("DEPRECATED API: {}", jp.getSignature());\n    }\n}',
      explanation: 'V1 и V2 контроллеры используют один UserService. V1 адаптирует ответ в старый формат (name вместо firstName + lastName). Deprecation и Sunset headers информируют клиентов о сроках. Aspect автоматически логирует все вызовы устаревших endpoints.'
    }
  ]
}
