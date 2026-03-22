export default {
  id: 30,
  title: 'Best Practices Spring Boot',
  description: 'Лучшие практики разработки на Spring Boot: структура проекта, безопасность, производительность, управление исключениями, логирование и советы для продакшена',
  lessons: [
    {
      id: 1,
      title: 'Структура проекта и архитектура',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошая структура проекта — основа поддерживаемого кода. Стандартный подход: разделение по feature/domain, а не по техническому слою.' },
        { type: 'heading', value: 'Рекомендуемая структура' },
        { type: 'code', language: 'java', value: 'src/main/java/com/company/app/\n├── config/              # Spring конфигурации\n│   ├── SecurityConfig.java\n│   ├── WebConfig.java\n│   └── OpenApiConfig.java\n├── user/                # Feature: всё что связано с пользователями\n│   ├── User.java        # Entity\n│   ├── UserDto.java     # DTO (или record)\n│   ├── UserRepository.java\n│   ├── UserService.java\n│   └── UserController.java\n├── order/               # Feature: заказы\n│   ├── Order.java\n│   ├── ...\n├── common/              # Общий код\n│   ├── exception/\n│   │   ├── AppException.java\n│   │   └── GlobalExceptionHandler.java\n│   └── dto/\n│       └── ApiResponse.java\n└── Application.java' },
        { type: 'tip', value: 'Разделение по feature: все слои (controller, service, repository) для одной функциональности рядом. Легче найти код, легче удалить фичу, меньше cross-cutting зависимостей.' }
      ]
    },
    {
      id: 2,
      title: 'Обработка исключений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Централизованная обработка исключений через @RestControllerAdvice даёт единый формат ошибок для всего API. Клиенты знают, что всегда получат одинаковую структуру.' },
        { type: 'heading', value: 'GlobalExceptionHandler' },
        { type: 'code', language: 'java', value: '@RestControllerAdvice\n@Slf4j\npublic class GlobalExceptionHandler {\n\n    @ExceptionHandler(EntityNotFoundException.class)\n    @ResponseStatus(HttpStatus.NOT_FOUND)\n    public ApiError handleNotFound(EntityNotFoundException ex) {\n        return new ApiError(404, ex.getMessage());\n    }\n\n    @ExceptionHandler(ValidationException.class)\n    @ResponseStatus(HttpStatus.BAD_REQUEST)\n    public ApiError handleValidation(ValidationException ex) {\n        return new ApiError(400, ex.getMessage());\n    }\n\n    @ExceptionHandler(MethodArgumentNotValidException.class)\n    @ResponseStatus(HttpStatus.BAD_REQUEST)\n    public ApiError handleBindingErrors(MethodArgumentNotValidException ex) {\n        List<String> errors = ex.getBindingResult()\n            .getFieldErrors()\n            .stream()\n            .map(e -> e.getField() + ": " + e.getDefaultMessage())\n            .collect(Collectors.toList());\n        return new ApiError(400, "Ошибка валидации", errors);\n    }\n\n    @ExceptionHandler(Exception.class)\n    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)\n    public ApiError handleGeneral(Exception ex) {\n        log.error("Неожиданная ошибка: ", ex);\n        return new ApiError(500, "Внутренняя ошибка сервера");\n    }\n}' }
      ]
    },
    {
      id: 3,
      title: 'Производительность: правила N+1 и пагинация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Проблема N+1 — самая частая причина медленных приложений на Spring Data JPA. Пагинация обязательна для больших списков.' },
        { type: 'heading', value: 'Проблема N+1 и решение' },
        { type: 'code', language: 'java', value: '// ПЛОХО: N+1 запросов\n// 1 запрос для users + N запросов для orders каждого пользователя\nList<User> users = userRepository.findAll();\nusers.forEach(u -> System.out.println(u.getOrders().size())); // LAZY загрузка!\n\n// ХОРОШО: JOIN FETCH — один запрос\n@Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.active = true")\nList<User> findAllWithOrders();\n\n// ХОРОШО: @EntityGraph\n@EntityGraph(attributePaths = {"orders", "orders.items"})\nList<User> findByActiveTrue();\n\n// ХОРОШО: отдельные запросы для коллекций (Batch Fetching)\n@BatchSize(size = 20)  // на @OneToMany поле\nprivate List<Order> orders;' },
        { type: 'heading', value: 'Пагинация' },
        { type: 'code', language: 'java', value: '// Repository\nPage<Product> findByCategory(String category, Pageable pageable);\n\n// Service\npublic Page<ProductDto> findProducts(String category, int page, int size) {\n    Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());\n    return productRepository.findByCategory(category, pageable)\n        .map(this::toDto);\n}\n\n// Controller\n@GetMapping\npublic Page<ProductDto> getProducts(\n    @RequestParam(defaultValue = "0") int page,\n    @RequestParam(defaultValue = "20") int size,\n    @RequestParam(required = false) String category\n) {\n    return productService.findProducts(category, page, size);\n}' }
      ]
    },
    {
      id: 4,
      title: 'Безопасность: основные правила',
      type: 'theory',
      content: [
        { type: 'text', value: 'Безопасность нельзя добавить потом — нужно думать с начала. Основные правила: не хранить секреты в коде, валидация всех входных данных, минимум привилегий.' },
        { type: 'heading', value: 'Чеклист безопасности' },
        { type: 'code', language: 'java', value: '// 1. Никогда не хранить пароли в открытом виде\n@Bean\nPasswordEncoder passwordEncoder() {\n    return new BCryptPasswordEncoder(12);  // cost factor >= 12\n}\n\n// 2. Валидировать все входные данные\npublic record UserRequest(\n    @NotBlank @Size(min = 2, max = 100) String name,\n    @NotBlank @Email String email,\n    @NotBlank @Size(min = 8) @Pattern(regexp = ".*[A-Z].*") String password\n) {}\n\n// 3. Не возвращать лишние данные\n// ПЛОХО: возвращать User entity напрямую (включая passwordHash!)\n// ХОРОШО: создать UserResponse DTO без чувствительных полей\n\n// 4. CORS конфигурация\n@Bean\npublic CorsConfigurationSource corsConfigurationSource() {\n    CorsConfiguration config = new CorsConfiguration();\n    config.setAllowedOrigins(List.of("https://myapp.kz"));\n    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));\n    // НЕ ставить allowedOrigins = "*" для продакшена!\n    return new UrlBasedCorsConfigurationSource();\n}' },
        { type: 'warning', value: 'Секреты (JWT secret, DB password) всегда в переменных окружения. Никогда в application.properties в репозитории! Минимум длина JWT secret — 32 символа.' }
      ]
    },
    {
      id: 5,
      title: 'Логирование: что и как логировать',
      type: 'theory',
      content: [
        { type: 'text', value: 'Логи — глаза в продакшене. Правильное логирование: структурированные логи, правильные уровни, без чувствительных данных, корреляционные ID.' },
        { type: 'heading', value: 'Структурированное логирование' },
        { type: 'code', language: 'java', value: '@Service\n@Slf4j\npublic class OrderService {\n\n    public Order createOrder(Long userId, OrderRequest request) {\n        log.info("Создание заказа: userId={}, itemsCount={}", userId, request.getItems().size());\n\n        try {\n            Order order = processOrder(userId, request);\n            log.info("Заказ создан: orderId={}, userId={}, total={}",\n                order.getId(), userId, order.getTotal());\n            return order;\n        } catch (InsufficientStockException e) {\n            log.warn("Недостаточно товара: productId={}, requested={}, available={}",\n                e.getProductId(), e.getRequested(), e.getAvailable());\n            throw e;\n        } catch (Exception e) {\n            log.error("Ошибка создания заказа: userId={}, error={}", userId, e.getMessage(), e);\n            throw e;\n        }\n    }\n}' },
        { type: 'code', language: 'java', value: '# Уровни логирования\n# ERROR — ошибки, требующие внимания. Должны триггерить алерты\n# WARN  — потенциальные проблемы: недоступный внешний сервис, retry\n# INFO  — бизнес-события: создан заказ, пользователь зарегистрирован\n# DEBUG — детали для разработки: параметры запросов, промежуточные данные\n\n# application.properties\nlogging.level.root=WARN\nlogging.level.com.company.app=INFO\nlogging.level.com.company.app.order=DEBUG  # DEBUG только для проблемного модуля' }
      ]
    },
    {
      id: 6,
      title: 'Профили конфигурации и управление секретами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spring Profiles позволяют иметь разные конфигурации для dev, test, prod. Секреты никогда не должны быть в коде — только в переменных окружения или Vault.' },
        { type: 'heading', value: 'Профили конфигурации' },
        { type: 'code', language: 'java', value: '# application.properties — общие настройки\nspring.application.name=my-app\n\n# application-dev.properties — разработка\nspring.jpa.show-sql=true\nspring.jpa.hibernate.ddl-auto=create-drop\nlogging.level.com.company=DEBUG\n\n# application-prod.properties — продакшен\nspring.jpa.hibernate.ddl-auto=validate\nlogging.level.root=WARN\nspring.datasource.hikari.maximum-pool-size=20\nmanagement.endpoints.web.exposure.include=health,prometheus' },
        { type: 'code', language: 'java', value: '// Разные Bean для разных профилей\n@Configuration\npublic class StorageConfig {\n\n    @Bean\n    @Profile("dev")\n    public StorageService localStorage() {\n        return new LocalFileStorageService();\n    }\n\n    @Bean\n    @Profile("prod")\n    public StorageService s3Storage() {\n        return new S3StorageService();\n    }\n}' },
        { type: 'tip', value: 'Запуск с профилем: SPRING_PROFILES_ACTIVE=prod java -jar app.jar или java -Dspring.profiles.active=prod -jar app.jar' }
      ]
    },
    {
      id: 7,
      title: 'Практика: аудит кода на best practices',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проведите рефакторинг существующего контроллера с применением всех best practices: централизованная обработка ошибок, DTO вместо Entity, пагинация, логирование, валидация.',
      requirements: [
        'Создай GlobalExceptionHandler с обработкой ResourceNotFoundException и ValidationException',
        'Создай UserResponse DTO (без полей passwordHash, role)',
        'Добавь пагинацию в GET /api/users',
        'Добавь @Valid валидацию на UserRequest',
        'Добавь @Slf4j логирование в UserService с INFO и ERROR уровнями',
        'Переименуй методы контроллера чтобы описывали действие',
        'Добавь @Profile("dev") для Swagger, @Profile("prod") для S3 сервиса'
      ],
      hint: 'UserResponse можно сделать record-ом: public record UserResponse(Long id, String name, String email). Маппинг: return new UserResponse(user.getId(), user.getName(), user.getEmail()).',
      expectedOutput: 'GET /api/users?page=0&size=20:\n{\n  "content": [\n    {"id":1,"name":"Алибек","email":"a@mail.ru"},\n    {"id":2,"name":"Дана","email":"dana@mail.ru"}\n  ],\n  "totalElements": 2,\n  "totalPages": 1,\n  "size": 20,\n  "number": 0\n}\n\nPOST /api/users (с пустым именем):\nHTTP 400 Bad Request\n{"error": "name: must not be blank"}\n\nGET /api/users/99:\nHTTP 404 Not Found\n{"error": "Пользователь с id 99 не найден"}\n\nЛоги при создании пользователя:\nINFO  UserService: Создание пользователя email=test@mail.ru\nINFO  UserService: Пользователь создан id=3\n\nСвагер-аннотации применены. Swagger UI (с профилем dev) доступен на /swagger-ui.html.\nS3StorageService используется в профиле prod.',
      solution: '@RestController @RequestMapping("/api/users") @Slf4j\npublic class UserController {\n    @Autowired UserService service;\n\n    @GetMapping\n    public Page<UserResponse> listUsers(\n        @RequestParam(defaultValue = "0") int page,\n        @RequestParam(defaultValue = "20") int size) {\n        return service.findAll(PageRequest.of(page, size)).map(UserResponse::from);\n    }\n\n    @PostMapping\n    @ResponseStatus(HttpStatus.CREATED)\n    public UserResponse createUser(@Valid @RequestBody UserRequest req) {\n        return UserResponse.from(service.create(req));\n    }\n}\n\npublic record UserResponse(Long id, String name, String email) {\n    public static UserResponse from(User u) { return new UserResponse(u.getId(), u.getName(), u.getEmail()); }\n}\n\n@RestControllerAdvice\npublic class GlobalExceptionHandler {\n    @ExceptionHandler(ResourceNotFoundException.class)\n    @ResponseStatus(HttpStatus.NOT_FOUND)\n    public Map<String, String> handle404(ResourceNotFoundException e) {\n        return Map.of("error", e.getMessage());\n    }\n}',
      explanation: 'record для DTO — краткий синтаксис без boilerplate. Page<T> для пагинации включает данные и метаданные (total, pages). @Valid автоматически валидирует и возвращает 400 при ошибках.'
    }
  ]
}
