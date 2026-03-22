export default {
  id: 20,
  title: 'Документация API со Swagger и OpenAPI',
  description: 'Автоматическая генерация документации REST API с использованием SpringDoc OpenAPI, аннотаций @Operation, @Schema, @ApiResponse и настройка Swagger UI',
  lessons: [
    {
      id: 1,
      title: 'Подключение SpringDoc OpenAPI',
      type: 'theory',
      content: [
        { type: 'text', value: 'Swagger (OpenAPI) генерирует интерактивную документацию для REST API. Разработчики фронтенда и мобильных приложений могут тестировать эндпоинты прямо в браузере. SpringDoc OpenAPI — официальная библиотека для Spring Boot 3.' },
        { type: 'heading', value: 'Зависимость Maven' },
        { type: 'code', language: 'xml', value: '<dependency>\n    <groupId>org.springdoc</groupId>\n    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>\n    <version>2.3.0</version>\n</dependency>' },
        { type: 'heading', value: 'Готово! Swagger UI доступен' },
        { type: 'code', language: 'java', value: '// После добавления зависимости Swagger UI автоматически доступен:\n// http://localhost:8080/swagger-ui.html\n// JSON-спецификация: http://localhost:8080/v3/api-docs\n\n// Никаких дополнительных настроек не нужно для базового использования!\n// Spring Boot автоматически сканирует все @RestController' },
        { type: 'tip', value: 'Просто добавь зависимость и запусти приложение — SpringDoc автоматически найдёт все контроллеры и создаст документацию.' }
      ]
    },
    {
      id: 2,
      title: 'Глобальная конфигурация OpenAPI',
      type: 'theory',
      content: [
        { type: 'text', value: 'Через @Bean OpenAPI настраивается глобальная информация: название API, версия, контакты, лицензия. Это отображается в шапке Swagger UI.' },
        { type: 'heading', value: 'OpenAPI Configuration Bean' },
        { type: 'code', language: 'java', value: 'import io.swagger.v3.oas.models.OpenAPI;\nimport io.swagger.v3.oas.models.info.Info;\nimport io.swagger.v3.oas.models.info.Contact;\n\n@Configuration\npublic class OpenApiConfig {\n\n    @Bean\n    public OpenAPI customOpenAPI() {\n        return new OpenAPI()\n            .info(new Info()\n                .title("User Management API")\n                .version("1.0")\n                .description("REST API для управления пользователями и заказами")\n                .contact(new Contact()\n                    .name("Команда разработки")\n                    .email("dev@company.kz")\n                    .url("https://company.kz"))\n            );\n    }\n}' },
        { type: 'heading', value: 'Настройка через application.properties' },
        { type: 'code', language: 'java', value: '# application.properties\nspringdoc.api-docs.path=/v3/api-docs\nspringdoc.swagger-ui.path=/swagger-ui.html\nspringdoc.swagger-ui.operationsSorter=method\nspringdoc.swagger-ui.tagsSorter=alpha\n\n# Отключить Swagger в продакшене\nspringdoc.api-docs.enabled=false\nspringdoc.swagger-ui.enabled=false' }
      ]
    },
    {
      id: 3,
      title: '@Operation и @Parameter',
      type: 'theory',
      content: [
        { type: 'text', value: '@Operation добавляет описание к эндпоинту. @Parameter описывает параметры запроса. Это делает документацию понятной для пользователей API.' },
        { type: 'heading', value: 'Аннотирование контроллера' },
        { type: 'code', language: 'java', value: 'import io.swagger.v3.oas.annotations.Operation;\nimport io.swagger.v3.oas.annotations.Parameter;\nimport io.swagger.v3.oas.annotations.tags.Tag;\n\n@RestController\n@RequestMapping("/api/users")\n@Tag(name = "Пользователи", description = "Операции с пользователями")\npublic class UserController {\n\n    @Operation(\n        summary = "Получить пользователя по ID",\n        description = "Возвращает полные данные пользователя включая профиль"\n    )\n    @GetMapping("/{id}")\n    public User getById(\n        @Parameter(description = "ID пользователя", example = "1")\n        @PathVariable Long id\n    ) {\n        return userService.findById(id);\n    }\n\n    @Operation(summary = "Создать нового пользователя")\n    @PostMapping\n    @ResponseStatus(HttpStatus.CREATED)\n    public User create(@RequestBody UserRequest request) {\n        return userService.create(request);\n    }\n}' },
        { type: 'heading', value: '@ApiResponse для документирования ответов' },
        { type: 'code', language: 'java', value: 'import io.swagger.v3.oas.annotations.responses.ApiResponse;\nimport io.swagger.v3.oas.annotations.responses.ApiResponses;\n\n@Operation(summary = "Удалить пользователя")\n@ApiResponses({\n    @ApiResponse(responseCode = "204", description = "Пользователь удалён"),\n    @ApiResponse(responseCode = "404", description = "Пользователь не найден"),\n    @ApiResponse(responseCode = "403", description = "Нет прав на удаление")\n})\n@DeleteMapping("/{id}")\n@ResponseStatus(HttpStatus.NO_CONTENT)\npublic void delete(@PathVariable Long id) {\n    userService.delete(id);\n}' }
      ]
    },
    {
      id: 4,
      title: '@Schema: документирование моделей',
      type: 'theory',
      content: [
        { type: 'text', value: '@Schema аннотирует поля DTO-классов: добавляет описания, примеры значений, обязательность. Swagger UI отображает это в разделе Schemas.' },
        { type: 'heading', value: 'Аннотирование DTO' },
        { type: 'code', language: 'java', value: 'import io.swagger.v3.oas.annotations.media.Schema;\n\n@Schema(description = "Запрос на создание пользователя")\npublic class UserRequest {\n\n    @Schema(\n        description = "Имя пользователя",\n        example = "Алибек Жаксыбеков",\n        requiredMode = Schema.RequiredMode.REQUIRED\n    )\n    @NotBlank\n    private String name;\n\n    @Schema(\n        description = "Email пользователя",\n        example = "alibek@mail.ru",\n        requiredMode = Schema.RequiredMode.REQUIRED\n    )\n    @Email\n    private String email;\n\n    @Schema(\n        description = "Возраст пользователя",\n        example = "25",\n        minimum = "18",\n        maximum = "100"\n    )\n    @Min(18) @Max(100)\n    private Integer age;\n}' },
        { type: 'heading', value: 'Скрытие полей через @Schema(hidden = true)' },
        { type: 'code', language: 'java', value: 'public class UserResponse {\n    private Long id;\n    private String name;\n    private String email;\n\n    @Schema(hidden = true)  // не показывать в документации\n    private String passwordHash;\n\n    @Schema(accessMode = Schema.AccessMode.READ_ONLY)  // только чтение\n    private LocalDateTime createdAt;\n}' }
      ]
    },
    {
      id: 5,
      title: 'Безопасность: документирование JWT в Swagger',
      type: 'theory',
      content: [
        { type: 'text', value: 'Если API защищено JWT, Swagger UI нужно настроить для отправки токена в заголовке Authorization. Иначе все защищённые эндпоинты вернут 401.' },
        { type: 'heading', value: 'Настройка Security Scheme' },
        { type: 'code', language: 'java', value: 'import io.swagger.v3.oas.models.security.SecurityScheme;\nimport io.swagger.v3.oas.models.security.SecurityRequirement;\n\n@Bean\npublic OpenAPI securedOpenAPI() {\n    final String securitySchemeName = "bearerAuth";\n\n    return new OpenAPI()\n        .addSecurityItem(new SecurityRequirement()\n            .addList(securitySchemeName))\n        .components(new Components()\n            .addSecuritySchemes(securitySchemeName,\n                new SecurityScheme()\n                    .name(securitySchemeName)\n                    .type(SecurityScheme.Type.HTTP)\n                    .scheme("bearer")\n                    .bearerFormat("JWT")\n            )\n        )\n        .info(new Info().title("Secured API").version("1.0"));\n}' },
        { type: 'tip', value: 'После этой настройки в Swagger UI появится кнопка "Authorize". Вставь JWT токен — все последующие запросы будут отправлять его в заголовке Authorization: Bearer <token>.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: документировать ProductController',
      type: 'practice',
      difficulty: 'easy',
      description: 'Добавьте полную OpenAPI-документацию к ProductController: описания эндпоинтов, параметров, ответов и модели ProductRequest.',
      requirements: [
        'Добавь @Tag на контроллер с названием "Продукты"',
        'Добавь @Operation с summary и description для каждого эндпоинта',
        'Задокументируй @Parameter для path-параметра {id}',
        'Добавь @ApiResponse для 200, 201, 404 ответов',
        'Аннотируй поля ProductRequest через @Schema с примерами',
        'Настрой глобальный OpenAPI bean с названием API и контактами'
      ],
      hint: '@Tag на классе группирует эндпоинты в Swagger UI. @Schema на полях DTO показывает примеры в разделе Schemas.',
      expectedOutput: 'Приложение запущено. Swagger UI доступен на http://localhost:8080/swagger-ui.html\n\nJSON спецификация: http://localhost:8080/v3/api-docs\n{\n  "info": { "title": "User Management API", "version": "1.0" },\n  "paths": {\n    "/api/products": { "get": { "summary": "Список продуктов", "tags": ["Продукты"] } },\n    "/api/products/{id}": { "get": { "summary": "Найти продукт по ID" } }\n  },\n  "components": {\n    "schemas": {\n      "ProductRequest": {\n        "properties": {\n          "name": { "example": "Ноутбук Dell XPS" },\n          "price": { "example": 150000.00 }\n        }\n      }\n    }\n  }\n}\n\nSwagger UI отображает группу "Продукты" со всеми эндпоинтами и примерами значений в схеме ProductRequest.',
      solution: '@RestController\n@RequestMapping("/api/products")\n@Tag(name = "Продукты", description = "Управление каталогом продуктов")\npublic class ProductController {\n\n    @Operation(summary = "Список продуктов", description = "Возвращает все активные продукты")\n    @GetMapping\n    public List<Product> getAll() { return service.findAll(); }\n\n    @Operation(summary = "Найти продукт по ID")\n    @ApiResponses({\n        @ApiResponse(responseCode = "200", description = "Продукт найден"),\n        @ApiResponse(responseCode = "404", description = "Продукт не найден")\n    })\n    @GetMapping("/{id}")\n    public Product getById(\n        @Parameter(description = "ID продукта", example = "1") @PathVariable Long id) {\n        return service.findById(id);\n    }\n\n    @Operation(summary = "Создать продукт")\n    @ApiResponse(responseCode = "201", description = "Продукт создан")\n    @PostMapping\n    @ResponseStatus(HttpStatus.CREATED)\n    public Product create(@RequestBody ProductRequest req) { return service.create(req); }\n}\n\n// ProductRequest\n@Schema(description = "Данные для создания продукта")\npublic class ProductRequest {\n    @Schema(description = "Название", example = "Ноутбук Dell XPS") @NotBlank String name;\n    @Schema(description = "Цена в тенге", example = "150000.00") @Positive Double price;\n}',
      explanation: '@Tag группирует эндпоинты в Swagger UI. @Operation описывает конкретный эндпоинт. @ApiResponse указывает возможные HTTP-коды. @Schema на DTO-полях делает документацию информативной с примерами.'
    }
  ]
}
