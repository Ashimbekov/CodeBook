export default {
  id: 61,
  title: 'Практикум: OpenAPI и документация',
  description: 'Практические задачи по документированию REST API с помощью OpenAPI 3 и Springdoc: Swagger UI, аннотации, схемы, примеры, security и генерация кода.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Настройка Swagger UI',
      type: 'practice',
      difficulty: 'easy',
      description: 'Подключите springdoc-openapi к проекту и настройте Swagger UI для автоматической генерации документации REST API.',
      requirements: [
        'Добавление зависимости springdoc-openapi-starter-webmvc-ui',
        'Настройка OpenAPI info: title, version, description, contact',
        'Доступ к Swagger UI по адресу /swagger-ui.html',
        'Настройка путей: apiDocsPath и swaggerUiPath через application.yml'
      ],
      expectedOutput: 'GET /swagger-ui.html → Swagger UI с документацией API\n\nGET /v3/api-docs → JSON спецификация OpenAPI 3.0\n\nOpenAPI info:\n  title: "Task Manager API"\n  version: "1.0.0"\n  description: "REST API для управления задачами"\n  contact: { name: "Dev Team", email: "dev@example.com" }',
      hint: 'Используйте @OpenAPIDefinition или @Bean OpenAPI для конфигурации. В application.yml настройте springdoc.api-docs.path и springdoc.swagger-ui.path.',
      solution: `// --- pom.xml ---
// <dependency>
//     <groupId>org.springdoc</groupId>
//     <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
//     <version>2.3.0</version>
// </dependency>

// --- application.yml ---
// springdoc:
//   api-docs:
//     path: /v3/api-docs
//   swagger-ui:
//     path: /swagger-ui.html
//     operationsSorter: method
//     tagsSorter: alpha
//     tryItOutEnabled: true

// --- OpenAPI Configuration ---
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Task Manager API")
                        .version("1.0.0")
                        .description("REST API для управления задачами и проектами")
                        .contact(new Contact()
                                .name("Dev Team")
                                .email("dev@example.com")
                                .url("https://github.com/example/task-manager"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .externalDocs(new ExternalDocumentation()
                        .description("Wiki документация")
                        .url("https://wiki.example.com"));
    }
}

// --- Контроллер с базовыми аннотациями ---
@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Tasks", description = "Управление задачами")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Получить все задачи")
    public ResponseEntity<List<TaskDto>> getAllTasks() {
        return ResponseEntity.ok(taskService.findAll());
    }

    @PostMapping
    @Operation(summary = "Создать задачу")
    public ResponseEntity<TaskDto> createTask(@RequestBody TaskCreateDto dto) {
        return ResponseEntity.status(201).body(taskService.create(dto));
    }
}`,
      explanation: 'springdoc-openapi автоматически генерирует OpenAPI 3.0 спецификацию из Spring контроллеров. Swagger UI предоставляет интерактивный интерфейс для тестирования API. @Tag группирует эндпоинты, @Operation описывает каждый эндпоинт. Конфигурация через application.yml настраивает пути и поведение UI.'
    },
    {
      id: 2,
      title: 'Задача: Аннотации @Operation, @ApiResponse, @Parameter',
      type: 'practice',
      difficulty: 'easy',
      description: 'Документируйте REST контроллер с помощью детальных аннотаций OpenAPI: описание операций, параметров и ответов.',
      requirements: [
        '@Operation с summary и description для каждого эндпоинта',
        '@ApiResponse для всех возможных HTTP статусов (200, 201, 400, 404, 500)',
        '@Parameter для path/query параметров с описанием и примерами',
        'Документирование pagination параметров (page, size, sort)'
      ],
      expectedOutput: 'GET /api/tasks/{id}:\n  summary: "Получить задачу по ID"\n  parameters: [{ name: "id", in: "path", required: true, example: 1 }]\n  responses:\n    200: { description: "Задача найдена", content: TaskDto }\n    404: { description: "Задача не найдена", content: ErrorResponse }',
      hint: 'Используйте @ApiResponses для нескольких ответов. @Parameter(description, example, required) для параметров. @io.swagger.v3.oas.annotations.parameters.RequestBody для тела запроса.',
      solution: `@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Tasks", description = "CRUD операции для задач")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Operation(
            summary = "Получить список задач",
            description = "Возвращает пагинированный список задач с возможностью сортировки")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Список задач получен"),
            @ApiResponse(responseCode = "401", description = "Не авторизован",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<Page<TaskDto>> getAllTasks(
            @Parameter(description = "Номер страницы (начиная с 0)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Размер страницы", example = "20")
            @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Сортировка (поле,направление)", example = "createdAt,desc")
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(parseSortParam(sort)));
        return ResponseEntity.ok(taskService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить задачу по ID",
            description = "Возвращает детальную информацию о задаче")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Задача найдена",
                    content = @Content(schema = @Schema(implementation = TaskDto.class))),
            @ApiResponse(responseCode = "404", description = "Задача не найдена",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<TaskDto> getTask(
            @Parameter(description = "ID задачи", required = true, example = "1")
            @PathVariable Long id) {
        return ResponseEntity.ok(taskService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Создать новую задачу")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Задача создана"),
            @ApiResponse(responseCode = "400", description = "Ошибка валидации",
                    content = @Content(schema = @Schema(implementation = ValidationErrorResponse.class)))
    })
    public ResponseEntity<TaskDto> createTask(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Данные новой задачи", required = true)
            @Valid @RequestBody TaskCreateDto dto) {
        TaskDto created = taskService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Обновить задачу")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Задача обновлена"),
            @ApiResponse(responseCode = "404", description = "Задача не найдена"),
            @ApiResponse(responseCode = "400", description = "Ошибка валидации")
    })
    public ResponseEntity<TaskDto> updateTask(
            @Parameter(description = "ID задачи", required = true) @PathVariable Long id,
            @Valid @RequestBody TaskUpdateDto dto) {
        return ResponseEntity.ok(taskService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить задачу")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Задача удалена"),
            @ApiResponse(responseCode = "404", description = "Задача не найдена")
    })
    public ResponseEntity<Void> deleteTask(
            @Parameter(description = "ID задачи") @PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}`,
      explanation: '@Operation описывает эндпоинт (summary — краткое, description — подробное). @ApiResponse документирует каждый возможный HTTP-ответ с описанием и схемой тела. @Parameter описывает параметры запроса с примерами и обязательностью. @Content + @Schema связывают ответ с Java-классом.'
    },
    {
      id: 3,
      title: 'Задача: Описание схем DTO',
      type: 'practice',
      difficulty: 'easy',
      description: 'Документируйте DTO-классы с помощью @Schema для описания полей, примеров и ограничений.',
      requirements: [
        '@Schema(description, example, required) на полях DTO',
        'Описание enum значений с @Schema',
        'Указание формата для дат, email, URI',
        'Описание вложенных объектов и массивов'
      ],
      expectedOutput: 'TaskDto schema:\n  id: { type: integer, example: 1 }\n  title: { type: string, example: "Исправить баг", minLength: 3, maxLength: 200 }\n  status: { type: string, enum: [TODO, IN_PROGRESS, DONE] }\n  assignee: { $ref: "#/components/schemas/UserDto" }\n  tags: { type: array, items: { type: string }, example: ["bug","urgent"] }',
      hint: 'Используйте @Schema(implementation = UserDto.class) для вложенных объектов. Для enum используйте @Schema(allowableValues = {"TODO","IN_PROGRESS","DONE"}).',
      solution: `@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Schema(description = "Задача")
public class TaskDto {

    @Schema(description = "Уникальный идентификатор задачи",
            example = "1", accessMode = Schema.AccessMode.READ_ONLY)
    private Long id;

    @Schema(description = "Название задачи", example = "Исправить баг авторизации",
            minLength = 3, maxLength = 200, requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank @Size(min = 3, max = 200)
    private String title;

    @Schema(description = "Подробное описание задачи",
            example = "При логине с неверным паролем возвращается 500 вместо 401",
            maxLength = 5000)
    private String description;

    @Schema(description = "Статус задачи", example = "IN_PROGRESS",
            allowableValues = {"TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"})
    private TaskStatus status;

    @Schema(description = "Приоритет задачи", example = "HIGH",
            allowableValues = {"LOW", "MEDIUM", "HIGH", "CRITICAL"})
    private TaskPriority priority;

    @Schema(description = "Исполнитель задачи", implementation = UserSummaryDto.class)
    private UserSummaryDto assignee;

    @Schema(description = "Теги задачи", example = "[\"bug\", \"urgent\", \"backend\"]")
    private List<String> tags;

    @Schema(description = "Дата создания", example = "2024-03-10T12:00:00",
            format = "date-time", accessMode = Schema.AccessMode.READ_ONLY)
    private LocalDateTime createdAt;

    @Schema(description = "Срок выполнения", example = "2024-03-20",
            format = "date")
    private LocalDate dueDate;
}

@Data @Builder
@Schema(description = "Краткая информация о пользователе")
public class UserSummaryDto {

    @Schema(description = "ID пользователя", example = "42")
    private Long id;

    @Schema(description = "Email пользователя", example = "john@example.com",
            format = "email")
    private String email;

    @Schema(description = "Полное имя", example = "Иван Петров")
    private String fullName;

    @Schema(description = "URL аватара", example = "https://cdn.example.com/avatars/42.jpg",
            format = "uri")
    private String avatarUrl;
}

@Schema(description = "Статус задачи")
public enum TaskStatus {
    @Schema(description = "Задача создана, ожидает выполнения")
    TODO,
    @Schema(description = "Задача в процессе выполнения")
    IN_PROGRESS,
    @Schema(description = "Задача на проверке")
    IN_REVIEW,
    @Schema(description = "Задача завершена")
    DONE
}

@Data
@Schema(description = "Запрос на создание задачи")
public class TaskCreateDto {

    @Schema(description = "Название задачи", example = "Добавить пагинацию",
            requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank
    private String title;

    @Schema(description = "Описание", example = "Реализовать cursor-based пагинацию для /api/tasks")
    private String description;

    @Schema(description = "Приоритет", example = "MEDIUM", defaultValue = "MEDIUM")
    private TaskPriority priority = TaskPriority.MEDIUM;

    @Schema(description = "ID исполнителя", example = "42")
    private Long assigneeId;

    @Schema(description = "Теги", example = "[\"feature\", \"api\"]")
    private List<String> tags;

    @Schema(description = "Дедлайн", example = "2024-04-01", format = "date")
    private LocalDate dueDate;
}`,
      explanation: '@Schema аннотация описывает каждое поле DTO в OpenAPI спецификации. description объясняет назначение поля, example показывает пример значения. format указывает формат данных (date-time, email, uri). accessMode=READ_ONLY исключает поле из request body. allowableValues перечисляет допустимые значения для enum.'
    },
    {
      id: 4,
      title: 'Задача: Примеры запросов и ответов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Добавьте множественные примеры запросов и ответов к эндпоинтам с использованием @ExampleObject.',
      requirements: [
        '@ExampleObject для нескольких вариантов request body',
        '@ExampleObject для разных вариантов response body (успех, ошибка)',
        'Примеры для разных сценариев: создание, обновление, ошибка валидации',
        'Использование $ref для переиспользования примеров'
      ],
      expectedOutput: 'POST /api/tasks — Examples:\n  "Простая задача": { "title":"Fix bug", "priority":"LOW" }\n  "Задача с деталями": { "title":"Redesign API", "description":"...", "priority":"HIGH", "tags":["api"] }\n\nResponses:\n  "201 Успех": { "id":1, "title":"Fix bug", "status":"TODO" }\n  "400 Валидация": { "errors":[{"field":"title","message":"не может быть пустым"}] }',
      hint: 'Используйте @Content(examples = {@ExampleObject(name="...", value="...")}) внутри @ApiResponse. Значение value должно быть валидным JSON-строкой.',
      solution: `@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @Operation(summary = "Создать задачу",
            description = "Создаёт новую задачу. Статус автоматически устанавливается в TODO.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Задача создана",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TaskDto.class),
                            examples = {
                                    @ExampleObject(name = "Простая задача",
                                            summary = "Минимальные данные",
                                            value = """
                                            {
                                                "id": 1,
                                                "title": "Fix login bug",
                                                "status": "TODO",
                                                "priority": "LOW",
                                                "createdAt": "2024-03-10T12:00:00"
                                            }"""),
                                    @ExampleObject(name = "Полная задача",
                                            summary = "Все поля заполнены",
                                            value = """
                                            {
                                                "id": 2,
                                                "title": "Redesign REST API",
                                                "description": "Переработать API v1 на v2",
                                                "status": "TODO",
                                                "priority": "HIGH",
                                                "assignee": {"id": 42, "fullName": "Иван Петров"},
                                                "tags": ["api", "refactoring"],
                                                "dueDate": "2024-04-01"
                                            }""")
                            })),
            @ApiResponse(responseCode = "400", description = "Ошибка валидации",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "Ошибка валидации",
                                    value = """
                                    {
                                        "status": 400,
                                        "message": "Ошибка валидации",
                                        "errors": [
                                            {"field": "title", "message": "не может быть пустым"},
                                            {"field": "priority", "message": "недопустимое значение"}
                                        ]
                                    }""")))
    })
    public ResponseEntity<TaskDto> createTask(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Данные новой задачи",
                    required = true,
                    content = @Content(
                            examples = {
                                    @ExampleObject(name = "Минимальный запрос",
                                            summary = "Только обязательные поля",
                                            value = """
                                            {
                                                "title": "Fix login bug"
                                            }"""),
                                    @ExampleObject(name = "Полный запрос",
                                            summary = "Все поля",
                                            value = """
                                            {
                                                "title": "Redesign REST API",
                                                "description": "Переработать API",
                                                "priority": "HIGH",
                                                "assigneeId": 42,
                                                "tags": ["api", "refactoring"],
                                                "dueDate": "2024-04-01"
                                            }""")
                            }))
            @Valid @RequestBody TaskCreateDto dto) {
        TaskDto created = taskService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить задачу")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Задача найдена",
                    content = @Content(
                            examples = @ExampleObject(value = """
                                    {
                                        "id": 1,
                                        "title": "Fix login bug",
                                        "status": "IN_PROGRESS",
                                        "priority": "HIGH",
                                        "assignee": {"id": 42, "fullName": "Иван Петров"},
                                        "createdAt": "2024-03-10T12:00:00"
                                    }"""))),
            @ApiResponse(responseCode = "404", description = "Не найдена",
                    content = @Content(
                            examples = @ExampleObject(value = """
                                    {
                                        "status": 404,
                                        "message": "Задача с id=999 не найдена",
                                        "timestamp": "2024-03-10T12:00:00"
                                    }""")))
    })
    public ResponseEntity<TaskDto> getTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.findById(id));
    }
}`,
      explanation: '@ExampleObject позволяет добавить конкретные JSON-примеры для request и response. Множественные примеры отображаются в Swagger UI как выпадающий список. name — название примера в UI, summary — краткое описание, value — JSON. Это помогает разработчикам быстро понять формат данных без чтения документации.'
    },
    {
      id: 5,
      title: 'Задача: Security в OpenAPI',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте описание JWT Bearer аутентификации в OpenAPI спецификации для Swagger UI.',
      requirements: [
        'Security scheme: Bearer JWT в OpenAPI config',
        '@SecurityRequirement на контроллерах и методах',
        'Глобальный security requirement с исключениями для public endpoints',
        'Отображение кнопки "Authorize" в Swagger UI'
      ],
      expectedOutput: 'Swagger UI: кнопка "Authorize" → ввод "Bearer eyJhbG..."\n\nGET /api/tasks (🔒) → требует авторизации\nPOST /api/auth/login (🔓) → публичный эндпоинт\n\nOpenAPI spec:\n  securitySchemes:\n    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }',
      hint: 'Используйте @SecurityScheme на уровне приложения и @SecurityRequirement на уровне контроллера. Для public endpoints добавьте @SecurityRequirement пустым.',
      solution: `// --- OpenAPI Security Config ---
@Configuration
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        description = "JWT токен авторизации. Получите токен через POST /api/auth/login"
)
public class OpenApiSecurityConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Task Manager API").version("1.0.0"))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new io.swagger.v3.oas.models.security.SecurityScheme()
                                        .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT авторизация")));
    }
}

// --- Публичный контроллер (без авторизации) ---
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Аутентификация и регистрация")
public class AuthController {

    @PostMapping("/login")
    @Operation(summary = "Войти в систему",
            security = {}) // пустой security = публичный endpoint
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Успешный вход",
                    content = @Content(schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "401", description = "Неверные учётные данные")
    })
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // ...
    }

    @PostMapping("/register")
    @Operation(summary = "Зарегистрироваться", security = {})
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        // ...
    }
}

// --- Защищённый контроллер ---
@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Tasks", description = "Управление задачами")
@SecurityRequirement(name = "bearerAuth") // все методы требуют JWT
public class TaskController {

    @GetMapping
    @Operation(summary = "Получить задачи")
    public ResponseEntity<List<TaskDto>> getTasks() {
        // ...
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Удалить задачу (только ADMIN)",
            description = "Требуется роль ADMIN")
    @SecurityRequirement(name = "bearerAuth") // дополнительное указание
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        // ...
    }
}

// --- Swagger UI Security Filter ---
@Configuration
public class SwaggerSecurityConfig {

    @Bean
    public SecurityFilterChain swaggerFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/v3/api-docs/**",
                        "/api/auth/**"
                ).permitAll()
                .anyRequest().authenticated());
        return http.build();
    }
}`,
      explanation: '@SecurityScheme определяет способ аутентификации в OpenAPI спецификации. @SecurityRequirement на контроллере помечает все его эндпоинты как защищённые. security = {} снимает requirement для публичных эндпоинтов. В Swagger UI появляется кнопка Authorize для ввода JWT токена, который автоматически добавляется ко всем запросам.'
    },
    {
      id: 6,
      title: 'Задача: Группировка эндпоинтов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте группировку API эндпоинтов для разделения документации по доменам и версиям.',
      requirements: [
        'GroupedOpenApi для разделения по доменам: tasks, users, admin',
        'Группировка по пути: /api/v1/**, /api/v2/**',
        'Группировка по тегам для удобной навигации',
        'Отдельные Swagger UI страницы для каждой группы'
      ],
      expectedOutput: 'Swagger UI dropdown:\n  - "Tasks API" → /api/tasks/**, /api/projects/**\n  - "User API" → /api/users/**, /api/auth/**\n  - "Admin API" → /api/admin/**\n\nGET /v3/api-docs/tasks → спецификация только для задач\nGET /v3/api-docs/admin → спецификация только для админки',
      hint: 'Используйте GroupedOpenApi.builder().group("tasks").pathsToMatch("/api/tasks/**").build(). Каждый GroupedOpenApi — отдельный bean.',
      solution: `@Configuration
public class OpenApiGroupConfig {

    @Bean
    public GroupedOpenApi tasksApi() {
        return GroupedOpenApi.builder()
                .group("tasks")
                .displayName("Tasks API")
                .pathsToMatch("/api/tasks/**", "/api/projects/**")
                .addOpenApiCustomizer(openApi -> openApi
                        .info(new Info()
                                .title("Tasks API")
                                .version("1.0.0")
                                .description("API для управления задачами и проектами")))
                .build();
    }

    @Bean
    public GroupedOpenApi usersApi() {
        return GroupedOpenApi.builder()
                .group("users")
                .displayName("User API")
                .pathsToMatch("/api/users/**", "/api/auth/**")
                .addOpenApiCustomizer(openApi -> openApi
                        .info(new Info()
                                .title("User API")
                                .version("1.0.0")
                                .description("API пользователей и аутентификации")))
                .build();
    }

    @Bean
    public GroupedOpenApi adminApi() {
        return GroupedOpenApi.builder()
                .group("admin")
                .displayName("Admin API")
                .pathsToMatch("/api/admin/**")
                .addOpenApiCustomizer(openApi -> openApi
                        .info(new Info()
                                .title("Admin API")
                                .version("1.0.0")
                                .description("API администрирования")))
                .build();
    }

    // Группировка по версии API
    @Bean
    public GroupedOpenApi v1Api() {
        return GroupedOpenApi.builder()
                .group("v1")
                .displayName("API v1")
                .pathsToMatch("/api/v1/**")
                .build();
    }

    @Bean
    public GroupedOpenApi v2Api() {
        return GroupedOpenApi.builder()
                .group("v2")
                .displayName("API v2")
                .pathsToMatch("/api/v2/**")
                .build();
    }

    // Группировка по тегам
    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public")
                .displayName("Public API")
                .pathsToExclude("/api/admin/**", "/api/internal/**")
                .build();
    }

    @Bean
    public GroupedOpenApi internalApi() {
        return GroupedOpenApi.builder()
                .group("internal")
                .displayName("Internal API")
                .pathsToMatch("/api/internal/**")
                .addOpenApiMethodFilter(method ->
                        method.isAnnotationPresent(InternalApi.class))
                .build();
    }
}`,
      explanation: 'GroupedOpenApi создаёт отдельные спецификации для каждой группы. В Swagger UI группы отображаются как выпадающий список. pathsToMatch/pathsToExclude фильтруют по URL. addOpenApiCustomizer позволяет настроить info для каждой группы. addOpenApiMethodFilter фильтрует по аннотациям на методах.'
    },
    {
      id: 7,
      title: 'Задача: Кастомная конфигурация Swagger UI',
      type: 'practice',
      difficulty: 'easy',
      description: 'Настройте внешний вид и поведение Swagger UI: тема, логотип, сортировка, параметры по умолчанию.',
      requirements: [
        'Настройка title, description, contact, license через OpenAPI bean',
        'Серверы (servers) для разных окружений: dev, staging, prod',
        'Кастомные параметры Swagger UI: defaultModelsExpandDepth, filter',
        'Внешние ссылки на документацию (externalDocs)'
      ],
      expectedOutput: 'Swagger UI header: "Task Manager API v1.0.0"\nDescription: "REST API для управления задачами"\nContact: "Dev Team <dev@example.com>"\n\nServers dropdown:\n  - "Local Dev" — http://localhost:8080\n  - "Staging" — https://staging.api.example.com\n  - "Production" — https://api.example.com',
      hint: 'Используйте .servers(List.of(new Server().url("...").description("..."))) в OpenAPI bean. Настройки UI через application.yml: springdoc.swagger-ui.*',
      solution: `// --- application.yml ---
// springdoc:
//   swagger-ui:
//     path: /swagger-ui.html
//     operations-sorter: method
//     tags-sorter: alpha
//     try-it-out-enabled: true
//     filter: true
//     default-models-expand-depth: 2
//     default-model-expand-depth: 3
//     doc-expansion: list
//     display-request-duration: true
//     show-extensions: true
//     syntax-highlight:
//       activated: true
//       theme: monokai
//   api-docs:
//     path: /v3/api-docs
//     resolve-schema-properties: true

// --- OpenAPI Config ---
@Configuration
public class OpenApiConfig {

    @Value("\${app.version:1.0.0}")
    private String appVersion;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Task Manager API")
                        .version(appVersion)
                        .description("""
                                REST API для управления задачами и проектами.

                                ## Возможности
                                - CRUD операции для задач и проектов
                                - Назначение исполнителей
                                - Комментарии и вложения
                                - Уведомления по email

                                ## Аутентификация
                                Используйте JWT токен. Получите его через POST /api/auth/login.
                                """)
                        .contact(new Contact()
                                .name("Dev Team")
                                .email("dev@example.com")
                                .url("https://github.com/example/task-manager"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT"))
                        .termsOfService("https://example.com/terms"))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Local Development"),
                        new Server()
                                .url("https://staging.api.example.com")
                                .description("Staging Environment"),
                        new Server()
                                .url("https://api.example.com")
                                .description("Production")))
                .externalDocs(new ExternalDocumentation()
                        .description("Полная документация проекта")
                        .url("https://wiki.example.com/task-manager"))
                .addTagsItem(new Tag().name("Tasks").description("Управление задачами"))
                .addTagsItem(new Tag().name("Projects").description("Управление проектами"))
                .addTagsItem(new Tag().name("Users").description("Пользователи"))
                .addTagsItem(new Tag().name("Authentication").description("Вход и регистрация"));
    }
}`,
      explanation: 'OpenAPI bean позволяет полностью настроить метаинформацию API. Servers определяют окружения, которые можно выбрать в Swagger UI для отправки запросов. Tags с описаниями группируют эндпоинты. Настройки Swagger UI через application.yml управляют отображением: сортировка, фильтр, глубина раскрытия схем, тема подсветки синтаксиса.'
    },
    {
      id: 8,
      title: 'Задача: Версионирование API в документации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте документацию для нескольких версий API с пометкой deprecated эндпоинтов.',
      requirements: [
        'Контроллеры для v1 и v2 с разными DTO',
        '@Deprecated аннотация для устаревших эндпоинтов v1',
        'Отображение deprecated endpoints в Swagger UI (зачёркнутые)',
        'GroupedOpenApi для каждой версии с отдельной спецификацией'
      ],
      expectedOutput: 'Swagger UI "API v1":\n  GET /api/v1/tasks → 🚫 Deprecated: "Используйте v2"\n  POST /api/v1/tasks → 🚫 Deprecated\n\nSwagger UI "API v2":\n  GET /api/v2/tasks → ✅ Актуальный\n  POST /api/v2/tasks → ✅ Актуальный\n\nGET /v3/api-docs/v1 → спецификация v1\nGET /v3/api-docs/v2 → спецификация v2',
      hint: 'Используйте @Operation(deprecated = true) или стандартную Java-аннотацию @Deprecated. В описании укажите какую версию использовать вместо.',
      solution: `// --- V1 Controller (deprecated) ---
@RestController
@RequestMapping("/api/v1/tasks")
@Tag(name = "Tasks v1", description = "⚠️ Устаревшая версия. Используйте /api/v2/tasks")
@Deprecated
public class TaskV1Controller {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Получить задачи (v1)",
            deprecated = true,
            description = "⚠️ Deprecated. Используйте GET /api/v2/tasks с пагинацией")
    public ResponseEntity<List<TaskV1Dto>> getAllTasks() {
        // возвращает старый формат DTO
        return ResponseEntity.ok(taskService.findAllV1());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить задачу (v1)", deprecated = true)
    public ResponseEntity<TaskV1Dto> getTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.findByIdV1(id));
    }
}

// --- V2 Controller (актуальный) ---
@RestController
@RequestMapping("/api/v2/tasks")
@Tag(name = "Tasks v2", description = "Актуальная версия API задач")
public class TaskV2Controller {

    private final TaskService taskService;

    @GetMapping
    @Operation(summary = "Получить задачи (v2)",
            description = "Возвращает пагинированный список задач с фильтрацией")
    public ResponseEntity<PageResponse<TaskV2Dto>> getAllTasks(
            @Parameter(description = "Страница") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Размер") @RequestParam(defaultValue = "20") int size,
            @Parameter(description = "Статус фильтр") @RequestParam(required = false) TaskStatus status) {
        return ResponseEntity.ok(taskService.findAllV2(page, size, status));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Получить задачу (v2)")
    public ResponseEntity<TaskV2Dto> getTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.findByIdV2(id));
    }

    @PostMapping
    @Operation(summary = "Создать задачу (v2)")
    public ResponseEntity<TaskV2Dto> createTask(@Valid @RequestBody TaskCreateV2Dto dto) {
        return ResponseEntity.status(201).body(taskService.createV2(dto));
    }
}

// --- GroupedOpenApi для версий ---
@Configuration
public class VersionedApiConfig {

    @Bean
    public GroupedOpenApi v1Api() {
        return GroupedOpenApi.builder()
                .group("v1")
                .displayName("API v1 (Deprecated)")
                .pathsToMatch("/api/v1/**")
                .addOpenApiCustomizer(openApi -> openApi
                        .info(new Info()
                                .title("Task Manager API v1")
                                .version("1.0.0")
                                .description("⚠️ Устаревшая версия. Мигрируйте на v2.")))
                .build();
    }

    @Bean
    public GroupedOpenApi v2Api() {
        return GroupedOpenApi.builder()
                .group("v2")
                .displayName("API v2 (Current)")
                .pathsToMatch("/api/v2/**")
                .addOpenApiCustomizer(openApi -> openApi
                        .info(new Info()
                                .title("Task Manager API v2")
                                .version("2.0.0")
                                .description("Актуальная версия API")))
                .build();
    }
}`,
      explanation: 'Версионирование через URL path (/api/v1/, /api/v2/) — самый простой подход. @Deprecated и @Operation(deprecated=true) помечают эндпоинты как устаревшие в Swagger UI. GroupedOpenApi создаёт отдельные спецификации для каждой версии. При миграции сначала помечаем v1 как deprecated, даём время клиентам мигрировать, затем удаляем.'
    },
    {
      id: 9,
      title: 'Задача: Экспорт OpenAPI спецификации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте экспорт OpenAPI спецификации в JSON и YAML форматах для CI/CD и внешних инструментов.',
      requirements: [
        'Эндпоинт /v3/api-docs для JSON спецификации',
        'Эндпоинт /v3/api-docs.yaml для YAML спецификации',
        'Maven plugin для генерации спецификации при сборке',
        'Тест для валидации OpenAPI спецификации'
      ],
      expectedOutput: 'GET /v3/api-docs → JSON OpenAPI 3.0 spec\nGET /v3/api-docs.yaml → YAML OpenAPI 3.0 spec\n\nmvn verify → target/openapi.json, target/openapi.yaml\n\nTest: "OpenAPI spec is valid and has all required endpoints"',
      hint: 'Используйте springdoc-openapi-maven-plugin для генерации при сборке. Для тестов используйте OpenAPI parser для валидации.',
      solution: `// --- application.yml ---
// springdoc:
//   api-docs:
//     path: /v3/api-docs
//     enabled: true
//   writer-with-default-pretty-printer: true

// --- pom.xml plugins ---
// <plugin>
//     <groupId>org.springdoc</groupId>
//     <artifactId>springdoc-openapi-maven-plugin</artifactId>
//     <version>1.4</version>
//     <executions>
//         <execution>
//             <id>generate-openapi</id>
//             <phase>integration-test</phase>
//             <goals><goal>generate</goal></goals>
//         </execution>
//     </executions>
//     <configuration>
//         <apiDocsUrl>http://localhost:8080/v3/api-docs</apiDocsUrl>
//         <outputFileName>openapi.json</outputFileName>
//         <outputDir>\${project.build.directory}</outputDir>
//     </configuration>
// </plugin>

// --- Controller для скачивания ---
@RestController
@RequestMapping("/api/docs")
@Tag(name = "Documentation", description = "Экспорт документации")
public class DocsExportController {

    private final ObjectMapper objectMapper;
    private final ObjectMapper yamlMapper;

    public DocsExportController() {
        this.objectMapper = new ObjectMapper()
                .enable(SerializationFeature.INDENT_OUTPUT);
        this.yamlMapper = new ObjectMapper(new YAMLFactory())
                .enable(SerializationFeature.INDENT_OUTPUT);
    }

    @GetMapping(value = "/export/json", produces = "application/json")
    @Operation(summary = "Скачать OpenAPI spec (JSON)")
    public ResponseEntity<Resource> exportJson(WebClient.Builder webClientBuilder) {
        String json = webClientBuilder.build()
                .get().uri("http://localhost:8080/v3/api-docs")
                .retrieve().bodyToMono(String.class).block();

        ByteArrayResource resource = new ByteArrayResource(json.getBytes());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=openapi.json")
                .contentType(MediaType.APPLICATION_JSON)
                .body(resource);
    }

    @GetMapping(value = "/export/yaml", produces = "application/x-yaml")
    @Operation(summary = "Скачать OpenAPI spec (YAML)")
    public ResponseEntity<Resource> exportYaml(WebClient.Builder webClientBuilder) {
        String json = webClientBuilder.build()
                .get().uri("http://localhost:8080/v3/api-docs")
                .retrieve().bodyToMono(String.class).block();

        try {
            Object jsonObj = objectMapper.readValue(json, Object.class);
            String yaml = yamlMapper.writeValueAsString(jsonObj);
            ByteArrayResource resource = new ByteArrayResource(yaml.getBytes());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=openapi.yaml")
                    .body(resource);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка конвертации в YAML", e);
        }
    }
}

// --- Integration Test ---
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class OpenApiSpecTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void shouldReturnValidOpenApiSpec() {
        ResponseEntity<String> response = restTemplate
                .getForEntity("/v3/api-docs", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        String json = response.getBody();
        assertThat(json).contains("openapi");
        assertThat(json).contains("3.0");
        assertThat(json).contains("/api/tasks");
        assertThat(json).contains("/api/auth/login");
    }

    @Test
    void shouldContainAllRequiredPaths() throws Exception {
        ResponseEntity<Map> response = restTemplate
                .getForEntity("/v3/api-docs", Map.class);

        Map<String, Object> spec = response.getBody();
        Map<String, Object> paths = (Map<String, Object>) spec.get("paths");

        assertThat(paths).containsKey("/api/tasks");
        assertThat(paths).containsKey("/api/tasks/{id}");
        assertThat(paths).containsKey("/api/auth/login");
        assertThat(paths).containsKey("/api/auth/register");
    }

    @Test
    void shouldReturnYamlSpec() {
        ResponseEntity<String> response = restTemplate
                .getForEntity("/v3/api-docs.yaml", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("openapi:");
    }
}`,
      explanation: 'springdoc-openapi автоматически предоставляет /v3/api-docs (JSON) и /v3/api-docs.yaml (YAML). Maven plugin генерирует спецификацию при сборке для CI/CD. Экспортный контроллер позволяет скачать файлы. Интеграционные тесты проверяют наличие всех эндпоинтов и валидность спецификации.'
    },
    {
      id: 10,
      title: 'Задача: Contract-first разработка',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте contract-first подход: сначала OpenAPI спецификация, затем генерация кода из неё с помощью openapi-generator.',
      requirements: [
        'OpenAPI YAML спецификация для Pet Store API',
        'Настройка openapi-generator-maven-plugin для генерации интерфейсов',
        'Реализация сгенерированных интерфейсов в контроллерах',
        'Валидация реализации против спецификации через тесты'
      ],
      expectedOutput: 'src/main/resources/openapi/petstore.yaml → исходная спецификация\n\nmvn generate-sources → generated-sources/:\n  PetsApi.java (interface)\n  PetDto.java\n  CreatePetRequest.java\n\nPetController implements PetsApi → компиляция проверяет соответствие контракту',
      hint: 'Используйте openapi-generator-maven-plugin с generatorName=spring, interfaceOnly=true. Контроллер реализует сгенерированный интерфейс.',
      solution: `// --- src/main/resources/openapi/petstore.yaml ---
// openapi: 3.0.3
// info:
//   title: Pet Store API
//   version: 1.0.0
// paths:
//   /api/pets:
//     get:
//       operationId: listPets
//       summary: List all pets
//       parameters:
//         - name: limit
//           in: query
//           schema: { type: integer, default: 20 }
//       responses:
//         '200':
//           description: A list of pets
//           content:
//             application/json:
//               schema:
//                 type: array
//                 items: { $ref: '#/components/schemas/Pet' }
//     post:
//       operationId: createPet
//       summary: Create a pet
//       requestBody:
//         required: true
//         content:
//           application/json:
//             schema: { $ref: '#/components/schemas/CreatePetRequest' }
//       responses:
//         '201':
//           description: Pet created
//           content:
//             application/json:
//               schema: { $ref: '#/components/schemas/Pet' }
//   /api/pets/{petId}:
//     get:
//       operationId: getPetById
//       parameters:
//         - name: petId
//           in: path
//           required: true
//           schema: { type: integer, format: int64 }
//       responses:
//         '200':
//           content:
//             application/json:
//               schema: { $ref: '#/components/schemas/Pet' }
//         '404':
//           content:
//             application/json:
//               schema: { $ref: '#/components/schemas/ErrorResponse' }
// components:
//   schemas:
//     Pet:
//       type: object
//       properties:
//         id: { type: integer, format: int64 }
//         name: { type: string }
//         species: { type: string, enum: [DOG, CAT, BIRD, FISH] }
//         age: { type: integer }
//     CreatePetRequest:
//       type: object
//       required: [name, species]
//       properties:
//         name: { type: string, minLength: 1, maxLength: 100 }
//         species: { type: string, enum: [DOG, CAT, BIRD, FISH] }
//         age: { type: integer, minimum: 0 }

// --- pom.xml plugin ---
// <plugin>
//     <groupId>org.openapitools</groupId>
//     <artifactId>openapi-generator-maven-plugin</artifactId>
//     <version>7.2.0</version>
//     <executions>
//         <execution>
//             <goals><goal>generate</goal></goals>
//             <configuration>
//                 <inputSpec>\${project.basedir}/src/main/resources/openapi/petstore.yaml</inputSpec>
//                 <generatorName>spring</generatorName>
//                 <apiPackage>com.example.api</apiPackage>
//                 <modelPackage>com.example.model</modelPackage>
//                 <configOptions>
//                     <interfaceOnly>true</interfaceOnly>
//                     <useSpringBoot3>true</useSpringBoot3>
//                     <useTags>true</useTags>
//                     <dateLibrary>java8</dateLibrary>
//                     <openApiNullable>false</openApiNullable>
//                 </configOptions>
//             </configuration>
//         </execution>
//     </executions>
// </plugin>

// --- Реализация сгенерированного интерфейса ---
@RestController
@RequiredArgsConstructor
public class PetController implements PetsApi {

    private final PetService petService;

    @Override
    public ResponseEntity<List<Pet>> listPets(Integer limit) {
        List<Pet> pets = petService.findAll(limit != null ? limit : 20);
        return ResponseEntity.ok(pets);
    }

    @Override
    public ResponseEntity<Pet> createPet(CreatePetRequest request) {
        Pet pet = petService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(pet);
    }

    @Override
    public ResponseEntity<Pet> getPetById(Long petId) {
        Pet pet = petService.findById(petId);
        return ResponseEntity.ok(pet);
    }
}

// --- Contract Test ---
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ContractTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void apiShouldMatchContract() {
        ResponseEntity<String> specResponse = restTemplate
                .getForEntity("/v3/api-docs", String.class);

        // Проверяем что реализация соответствует контракту
        String spec = specResponse.getBody();
        assertThat(spec).contains("/api/pets");
        assertThat(spec).contains("listPets");
        assertThat(spec).contains("createPet");
        assertThat(spec).contains("getPetById");
    }

    @Test
    void createPetShouldReturn201() {
        CreatePetRequest request = new CreatePetRequest();
        request.setName("Buddy");
        request.setSpecies(CreatePetRequest.SpeciesEnum.DOG);
        request.setAge(3);

        ResponseEntity<Pet> response = restTemplate
                .postForEntity("/api/pets", request, Pet.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getName()).isEqualTo("Buddy");
    }
}`,
      explanation: 'Contract-first подход: сначала создаётся OpenAPI спецификация (контракт), затем из неё генерируется код. openapi-generator создаёт Java-интерфейсы и DTO из YAML-спецификации. Контроллер реализует сгенерированный интерфейс — компилятор гарантирует соответствие контракту. Это обеспечивает согласованность между документацией и реализацией.'
    }
  ]
}
