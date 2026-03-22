export default {
  id: 7,
  title: 'Валидация данных',
  description: 'Валидация входящих данных с Bean Validation: @Valid, @NotBlank, @Size, @Email, @Min, @Max',
  lessons: [
    {
      id: 1,
      title: 'Bean Validation и @Valid',
      type: 'theory',
      content: [
        { type: 'text', value: 'Bean Validation — стандарт Java для декларативной валидации. Spring Boot интегрирует Hibernate Validator (реализацию стандарта) через starter-зависимость.' },
        { type: 'heading', value: 'Подключение' },
        { type: 'code', language: 'java', value: '<!-- pom.xml -->\n<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-validation</artifactId>\n</dependency>' },
        { type: 'heading', value: 'Базовое использование' },
        { type: 'code', language: 'java', value: '// 1. Аннотации на DTO\npublic class CreateUserRequest {\n    @NotBlank(message = "Имя обязательно")\n    private String name;\n\n    @Email(message = "Неверный формат email")\n    @NotBlank(message = "Email обязателен")\n    private String email;\n\n    @Size(min = 6, max = 50, message = "Пароль: от 6 до 50 символов")\n    private String password;\n\n    @Min(value = 0, message = "Возраст не может быть отрицательным")\n    @Max(value = 150, message = "Возраст не может быть больше 150")\n    private int age;\n}\n\n// 2. @Valid в контроллере запускает валидацию\n@PostMapping("/users")\npublic ResponseEntity<User> create(@Valid @RequestBody CreateUserRequest request) {\n    // Если валидация не прошла — Spring бросает MethodArgumentNotValidException\n    // и возвращает 400 Bad Request\n    return ResponseEntity.status(HttpStatus.CREATED)\n        .body(userService.create(request));\n}' },
        { type: 'note', value: '@Valid запускает каскадную валидацию. Без @Valid аннотации на полях игнорируются. @Validated — более мощная альтернатива от Spring с поддержкой групп валидации.' }
      ]
    },
    {
      id: 2,
      title: 'Основные аннотации валидации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Bean Validation предоставляет богатый набор аннотаций для разных типов данных.' },
        { type: 'heading', value: 'Строки' },
        { type: 'code', language: 'java', value: 'public class UserDto {\n    @NotNull(message = "Значение не должно быть null")\n    private String field1;\n\n    @NotEmpty(message = "Строка не должна быть пустой (но может быть пробелами)")\n    private String field2;\n\n    @NotBlank(message = "Строка не должна быть пустой или состоять из пробелов")\n    private String name;\n\n    @Size(min = 2, max = 100)\n    private String lastName;\n\n    @Email\n    private String email;\n\n    @Pattern(regexp = "^\\\\+?[1-9]\\\\d{10,14}$",\n             message = "Неверный формат телефона")\n    private String phone;\n}' },
        { type: 'heading', value: 'Числа и даты' },
        { type: 'code', language: 'java', value: 'public class ProductDto {\n    @Min(0)\n    @Max(1_000_000)\n    private double price;\n\n    @Positive(message = "Количество должно быть положительным")\n    private int quantity;\n\n    @PositiveOrZero\n    private int discount;\n\n    @Future(message = "Дата должна быть в будущем")\n    private LocalDate expiryDate;\n\n    @Past(message = "Дата рождения должна быть в прошлом")\n    private LocalDate birthDate;\n\n    @FutureOrPresent\n    private LocalDateTime scheduledAt;\n}' },
        { type: 'tip', value: 'NotBlank vs NotEmpty vs NotNull: NotNull проверяет только null. NotEmpty — не null и не пустая строка. NotBlank — не null, не пустая, и не только пробелы. Для строк чаще всего нужен NotBlank.' }
      ]
    },
    {
      id: 3,
      title: 'Обработка ошибок валидации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда валидация не проходит, Spring выбрасывает MethodArgumentNotValidException. Нужно обработать это исключение и вернуть понятный ответ клиенту.' },
        { type: 'code', language: 'java', value: '// Обработчик ошибок валидации\n@RestControllerAdvice\npublic class ValidationExceptionHandler {\n\n    @ExceptionHandler(MethodArgumentNotValidException.class)\n    public ResponseEntity<Map<String, String>> handleValidationErrors(\n            MethodArgumentNotValidException ex) {\n\n        Map<String, String> errors = new HashMap<>();\n\n        // Извлекаем все ошибки валидации\n        ex.getBindingResult()\n            .getFieldErrors()\n            .forEach(error -> errors.put(\n                error.getField(),\n                error.getDefaultMessage()\n            ));\n\n        return ResponseEntity.badRequest().body(errors);\n    }\n}\n\n// Ответ клиенту при ошибке валидации:\n// HTTP 400 Bad Request\n// {\n//   "name": "Имя обязательно",\n//   "email": "Неверный формат email",\n//   "password": "Пароль: от 6 до 50 символов"\n// }' },
        { type: 'warning', value: 'Без @RestControllerAdvice Spring вернёт подробный стек-трейс в ответе — это утечка информации. Всегда обрабатывай ошибки валидации и возвращай клиентские ошибки в понятном формате.' }
      ]
    },
    {
      id: 4,
      title: 'Кастомные аннотации валидации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда стандартных аннотаций недостаточно. Можно создать собственную аннотацию валидации.' },
        { type: 'code', language: 'java', value: '// 1. Создаём аннотацию\n@Documented\n@Constraint(validatedBy = UniqueEmailValidator.class)\n@Target({ElementType.FIELD})\n@Retention(RetentionPolicy.RUNTIME)\npublic @interface UniqueEmail {\n    String message() default "Email уже используется";\n    Class<?>[] groups() default {};\n    Class<? extends Payload>[] payload() default {};\n}\n\n// 2. Создаём валидатор\n@Component\npublic class UniqueEmailValidator\n        implements ConstraintValidator<UniqueEmail, String> {\n\n    private final UserRepository userRepository;\n\n    public UniqueEmailValidator(UserRepository userRepository) {\n        this.userRepository = userRepository;\n    }\n\n    @Override\n    public boolean isValid(String email, ConstraintValidatorContext context) {\n        if (email == null) return true; // NotBlank проверит null\n        return !userRepository.existsByEmail(email);\n    }\n}\n\n// 3. Используем\npublic class RegisterRequest {\n    @UniqueEmail\n    @Email\n    private String email;\n}' },
        { type: 'note', value: 'Кастомный валидатор может обращаться к базе данных и другим сервисам. Но будь осторожен: валидация с запросом к БД при каждом запросе может замедлить API.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Валидация формы регистрации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай endpoint регистрации с полной валидацией всех полей и правильной обработкой ошибок.',
      requirements: [
        'DTO с полями: username (3-20 символов), email (валидный), password (8-100 символов), age (18-120)',
        '@Valid в контроллере',
        'Обработчик ошибок возвращает Map с полями и ошибками',
        'POST /api/register -> 201 при успехе, 400 с ошибками при валидации'
      ],
      expectedOutput: 'POST /api/register {"username":"ab","email":"not-email","password":"123","age":15}\n=> 400 {"username":"от 3 до 20 символов","email":"Неверный email","password":"мин. 8 символов","age":"минимум 18 лет"}',
      hint: 'RegisterRequest с аннотациями валидации. @RestControllerAdvice с @ExceptionHandler(MethodArgumentNotValidException.class). Используй getBindingResult().getFieldErrors().',
      solution: '// RegisterRequest.java\npublic class RegisterRequest {\n    @NotBlank(message = "Имя пользователя обязательно")\n    @Size(min = 3, max = 20, message = "от 3 до 20 символов")\n    private String username;\n\n    @NotBlank(message = "Email обязателен")\n    @Email(message = "Неверный email")\n    private String email;\n\n    @NotBlank(message = "Пароль обязателен")\n    @Size(min = 8, max = 100, message = "мин. 8 символов")\n    private String password;\n\n    @Min(value = 18, message = "минимум 18 лет")\n    @Max(value = 120, message = "максимум 120 лет")\n    private int age;\n    // геттеры, сеттеры\n}\n\n// AuthController.java\n@RestController\n@RequestMapping("/api")\npublic class AuthController {\n    @PostMapping("/register")\n    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest req) {\n        return ResponseEntity.status(HttpStatus.CREATED)\n            .body("Пользователь " + req.getUsername() + " зарегистрирован");\n    }\n}\n\n// GlobalExceptionHandler.java\n@RestControllerAdvice\npublic class GlobalExceptionHandler {\n    @ExceptionHandler(MethodArgumentNotValidException.class)\n    public ResponseEntity<Map<String, String>> handleValidation(\n            MethodArgumentNotValidException ex) {\n        Map<String, String> errors = new LinkedHashMap<>();\n        ex.getBindingResult().getFieldErrors()\n            .forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));\n        return ResponseEntity.badRequest().body(errors);\n    }\n}',
      explanation: 'Валидация работает в три шага: 1) аннотации на полях DTO описывают правила, 2) @Valid в контроллере запускает проверку, 3) @ExceptionHandler перехватывает ошибки и формирует понятный ответ. Клиент получает 400 Bad Request с описанием каждой ошибки.'
    },
    {
      id: 6,
      title: 'Практика: Валидация вложенных объектов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай API заказа с вложенными объектами и каскадной валидацией.',
      requirements: [
        'OrderRequest содержит: items (List<OrderItem>, min 1 элемент), address (Address)',
        'OrderItem: productId (не null), quantity (1-100)',
        'Address: street (не пустой), city (не пустой), zipCode (5 символов)',
        '@Valid на вложенных объектах для каскадной валидации',
        'Ошибки для вложенных полей: items[0].quantity, address.city и т.д.'
      ],
      expectedOutput: 'POST /api/orders {"items":[],"address":{"street":"","city":"Алматы","zipCode":"050"}} => 400 ошибки для items и address.street и address.zipCode',
      hint: 'На поле items: @NotEmpty @Valid. На поле address: @NotNull @Valid. На Address.zipCode: @Size(min=5, max=5). Spring автоматически формирует пути к полям.',
      solution: '// Address.java\npublic class Address {\n    @NotBlank(message = "Улица обязательна")\n    private String street;\n\n    @NotBlank(message = "Город обязателен")\n    private String city;\n\n    @Size(min = 5, max = 5, message = "Почтовый индекс: ровно 5 символов")\n    private String zipCode;\n    // геттеры, сеттеры\n}\n\n// OrderItem.java\npublic class OrderItem {\n    @NotNull(message = "ID продукта обязателен")\n    private Long productId;\n\n    @Min(value = 1, message = "Минимум 1 штука")\n    @Max(value = 100, message = "Максимум 100 штук")\n    private int quantity;\n    // геттеры, сеттеры\n}\n\n// OrderRequest.java\npublic class OrderRequest {\n    @NotEmpty(message = "Список товаров не может быть пустым")\n    @Valid  // каскадная валидация элементов списка\n    private List<OrderItem> items;\n\n    @NotNull(message = "Адрес обязателен")\n    @Valid  // каскадная валидация адреса\n    private Address address;\n    // геттеры, сеттеры\n}\n\n// OrderController.java\n@RestController\n@RequestMapping("/api/orders")\npublic class OrderController {\n    @PostMapping\n    public ResponseEntity<String> createOrder(\n            @Valid @RequestBody OrderRequest request) {\n        return ResponseEntity.status(HttpStatus.CREATED)\n            .body("Заказ создан с " + request.getItems().size() + " товарами");\n    }\n}',
      explanation: '@Valid на полях вложенных объектов включает каскадную валидацию. Spring сам формирует пути к вложенным полям: items[0].quantity, address.city. Без @Valid на поле address — аннотации внутри Address будут проигнорированы.'
    }
  ]
}
