export default {
  id: 6,
  title: 'Обработка запросов',
  description: 'Получение данных из HTTP запросов: @PathVariable, @RequestParam, @RequestBody, @RequestHeader',
  lessons: [
    {
      id: 1,
      title: '@PathVariable — переменные из URL',
      type: 'theory',
      content: [
        { type: 'text', value: '@PathVariable извлекает значения из пути URL. Переменные в пути обозначаются фигурными скобками: /users/{id}.' },
        { type: 'code', language: 'java', value: '@RestController\n@RequestMapping("/api")\npublic class ExampleController {\n\n    // GET /api/users/42\n    @GetMapping("/users/{id}")\n    public String getUser(@PathVariable Long id) {\n        return "Пользователь с id=" + id;\n    }\n\n    // GET /api/users/42/posts/7\n    @GetMapping("/users/{userId}/posts/{postId}")\n    public String getPost(\n            @PathVariable Long userId,\n            @PathVariable Long postId) {\n        return "Пост " + postId + " пользователя " + userId;\n    }\n\n    // Если имя переменной отличается от параметра метода\n    @GetMapping("/products/{product-id}")\n    public String getProduct(@PathVariable("product-id") Long productId) {\n        return "Продукт " + productId;\n    }\n}' },
        { type: 'heading', value: 'Необязательный PathVariable' },
        { type: 'code', language: 'java', value: '// Необязательный PathVariable (редко используется)\n@GetMapping(value = {"/users", "/users/{id}"})\npublic String getUsers(@PathVariable(required = false) Long id) {\n    if (id == null) {\n        return "Все пользователи";\n    }\n    return "Пользователь " + id;\n}' },
        { type: 'tip', value: 'Используй правильный тип для PathVariable. Если id всегда число — Long. Если строка — String. Spring автоматически конвертирует строку из URL в нужный тип.' }
      ]
    },
    {
      id: 2,
      title: '@RequestParam — параметры запроса',
      type: 'theory',
      content: [
        { type: 'text', value: '@RequestParam извлекает параметры из строки запроса (query string): /search?name=phone&minPrice=1000.' },
        { type: 'code', language: 'java', value: '// GET /api/products/search?name=phone\n@GetMapping("/products/search")\npublic List<Product> search(@RequestParam String name) {\n    return productService.findByName(name);\n}\n\n// GET /api/products?page=0&size=10&sort=name\n@GetMapping("/products")\npublic List<Product> getAll(\n        @RequestParam(defaultValue = "0") int page,\n        @RequestParam(defaultValue = "10") int size,\n        @RequestParam(defaultValue = "id") String sort) {\n    return productService.findAll(page, size, sort);\n}\n\n// Необязательный параметр\n@GetMapping("/users")\npublic List<User> getUsers(\n        @RequestParam(required = false) String email) {\n    if (email != null) {\n        return userService.findByEmail(email);\n    }\n    return userService.findAll();\n}' },
        { type: 'heading', value: 'Multiple values' },
        { type: 'code', language: 'java', value: '// GET /api/products?tags=java&tags=spring&tags=boot\n@GetMapping("/products")\npublic List<Product> getByTags(\n        @RequestParam List<String> tags) {\n    return productService.findByTags(tags);\n}' },
        { type: 'note', value: 'PathVariable vs RequestParam: PathVariable — часть пути (/users/42), RequestParam — после знака ? (/users?id=42). PathVariable для идентификации ресурса, RequestParam для фильтрации, пагинации, поиска.' }
      ]
    },
    {
      id: 3,
      title: '@RequestBody — тело запроса',
      type: 'theory',
      content: [
        { type: 'text', value: '@RequestBody десериализует тело HTTP запроса (обычно JSON) в Java объект. Jackson автоматически преобразует JSON в POJO.' },
        { type: 'code', language: 'java', value: '// Класс для тела запроса (DTO)\npublic class CreateUserRequest {\n    private String name;\n    private String email;\n    private int age;\n    // геттеры и сеттеры\n}\n\n@RestController\n@RequestMapping("/api/users")\npublic class UserController {\n\n    // POST /api/users\n    // Тело: {"name": "Иван", "email": "ivan@test.com", "age": 25}\n    @PostMapping\n    public ResponseEntity<User> create(@RequestBody CreateUserRequest request) {\n        // Spring автоматически преобразовал JSON в CreateUserRequest\n        User user = userService.create(request);\n        return ResponseEntity.status(HttpStatus.CREATED).body(user);\n    }\n\n    // PUT — полное обновление\n    @PutMapping("/{id}")\n    public User update(\n            @PathVariable Long id,\n            @RequestBody UpdateUserRequest request) {\n        return userService.update(id, request);\n    }\n}' },
        { type: 'tip', value: 'Создавай отдельные DTO (Data Transfer Object) классы для запросов и ответов. Не используй Entity напрямую — это смешивает слои и создаёт проблемы безопасности (можно случайно принять поля которые не должны изменяться).' }
      ]
    },
    {
      id: 4,
      title: '@RequestHeader и @CookieValue',
      type: 'theory',
      content: [
        { type: 'text', value: '@RequestHeader извлекает значения из HTTP заголовков. @CookieValue — из cookies.' },
        { type: 'code', language: 'java', value: '@RestController\npublic class HeaderController {\n\n    // Читаем конкретный заголовок\n    @GetMapping("/api/resource")\n    public String getResource(\n            @RequestHeader("Authorization") String authToken,\n            @RequestHeader("Accept-Language") String language) {\n        return "Токен: " + authToken + ", Язык: " + language;\n    }\n\n    // Необязательный заголовок с дефолтным значением\n    @GetMapping("/api/data")\n    public String getData(\n            @RequestHeader(value = "X-Client-Version",\n                          required = false,\n                          defaultValue = "unknown") String clientVersion) {\n        return "Версия клиента: " + clientVersion;\n    }\n\n    // Все заголовки сразу\n    @GetMapping("/api/headers")\n    public Map<String, String> getAllHeaders(\n            @RequestHeader Map<String, String> headers) {\n        return headers;\n    }\n}' },
        { type: 'code', language: 'java', value: '// Чтение Cookie\n@GetMapping("/api/profile")\npublic String getProfile(\n        @CookieValue(value = "sessionId", required = false) String sessionId) {\n    if (sessionId == null) {\n        return "Сессия не найдена";\n    }\n    return "Сессия: " + sessionId;\n}' },
        { type: 'note', value: 'В REST API аутентификационные токены обычно передаются в заголовке Authorization: Bearer <token>. Cookies используются реже, в основном для сессионной аутентификации.' }
      ]
    },
    {
      id: 5,
      title: 'HttpServletRequest — прямой доступ',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда нужен полный доступ к HTTP запросу. Spring позволяет добавить HttpServletRequest как параметр метода.' },
        { type: 'code', language: 'java', value: '@GetMapping("/api/info")\npublic Map<String, String> getRequestInfo(HttpServletRequest request) {\n    Map<String, String> info = new HashMap<>();\n    info.put("method", request.getMethod());\n    info.put("url", request.getRequestURL().toString());\n    info.put("remoteAddr", request.getRemoteAddr());\n    info.put("userAgent", request.getHeader("User-Agent"));\n    return info;\n}' },
        { type: 'heading', value: 'Получение тела запроса вручную' },
        { type: 'code', language: 'java', value: '@PostMapping("/api/raw")\npublic String handleRaw(HttpServletRequest request) throws IOException {\n    // Читаем тело запроса напрямую как строку\n    String body = request.getReader().lines()\n        .collect(Collectors.joining(System.lineSeparator()));\n    return "Получили: " + body;\n}' },
        { type: 'tip', value: 'Прямое использование HttpServletRequest — редкость. В большинстве случаев @RequestBody, @RequestParam и @PathVariable удобнее. HttpServletRequest нужен для нестандартных сценариев.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: API с фильтрацией и пагинацией',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай endpoint для списка товаров с фильтрацией по категории, поиском по названию и пагинацией.',
      requirements: [
        'GET /api/products — все продукты',
        'GET /api/products?category=electronics — фильтр по категории',
        'GET /api/products?search=phone — поиск по названию',
        'GET /api/products?page=0&size=5 — пагинация',
        'Параметры необязательны, можно комбинировать'
      ],
      expectedOutput: 'GET /api/products?category=electronics&page=0&size=2 => [{...},{...}]',
      hint: 'Все параметры через @RequestParam(required = false). В сервисе фильтруй List<Product> через stream(). Пагинация: skip(page * size).limit(size).',
      solution: '// ProductController.java\n@RestController\n@RequestMapping("/api/products")\npublic class ProductController {\n    private final ProductService productService;\n\n    public ProductController(ProductService productService) {\n        this.productService = productService;\n    }\n\n    @GetMapping\n    public List<Product> getProducts(\n            @RequestParam(required = false) String category,\n            @RequestParam(required = false) String search,\n            @RequestParam(defaultValue = "0") int page,\n            @RequestParam(defaultValue = "10") int size) {\n        return productService.findFiltered(category, search, page, size);\n    }\n}\n\n// ProductService.java\n@Service\npublic class ProductService {\n    private final List<Product> products = List.of(\n        new Product(1L, "iPhone 15", "electronics", 90000.0),\n        new Product(2L, "Samsung TV", "electronics", 60000.0),\n        new Product(3L, "Ноутбук Dell", "electronics", 80000.0),\n        new Product(4L, "Стул офисный", "furniture", 15000.0),\n        new Product(5L, "Стол письменный", "furniture", 25000.0)\n    );\n\n    public List<Product> findFiltered(String category, String search,\n                                       int page, int size) {\n        return products.stream()\n            .filter(p -> category == null ||\n                    p.getCategory().equalsIgnoreCase(category))\n            .filter(p -> search == null ||\n                    p.getName().toLowerCase().contains(search.toLowerCase()))\n            .skip((long) page * size)\n            .limit(size)\n            .collect(Collectors.toList());\n    }\n}',
      explanation: 'required = false делает @RequestParam необязательным — если его нет в URL, значение будет null. defaultValue задаёт значение по умолчанию. Stream API удобен для фильтрации: filter() убирает ненужные элементы, skip() и limit() реализуют пагинацию.'
    },
    {
      id: 7,
      title: 'Практика: Обработка различных типов данных в запросе',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай endpoint для регистрации пользователя, который принимает данные из тела запроса и заголовков.',
      requirements: [
        'POST /api/register принимает JSON с именем, email, паролем',
        'Считай заголовок X-Client-Platform (web/mobile/default: unknown)',
        'Считай заголовок X-Client-Version (optional)',
        'Ответ: объект с userId, email и информацией о клиенте',
        'Возвращай 201 Created'
      ],
      expectedOutput: 'POST /api/register\nHeaders: X-Client-Platform: mobile\nBody: {"name":"Иван","email":"ivan@test.com","password":"secret"}\n=> 201 {"userId":1,"email":"ivan@test.com","platform":"mobile","version":"unknown"}',
      hint: 'Создай RegistrationRequest DTO и RegistrationResponse DTO. Метод принимает @RequestBody RegistrationRequest и @RequestHeader заголовки.',
      solution: '// RegistrationRequest.java\npublic class RegistrationRequest {\n    private String name;\n    private String email;\n    private String password;\n    // геттеры, сеттеры\n}\n\n// RegistrationResponse.java\npublic class RegistrationResponse {\n    private Long userId;\n    private String email;\n    private String platform;\n    private String version;\n    // геттеры, сеттеры, конструктор\n}\n\n// AuthController.java\n@RestController\n@RequestMapping("/api")\npublic class AuthController {\n\n    @PostMapping("/register")\n    public ResponseEntity<RegistrationResponse> register(\n            @RequestBody RegistrationRequest request,\n            @RequestHeader(value = "X-Client-Platform",\n                          defaultValue = "unknown") String platform,\n            @RequestHeader(value = "X-Client-Version",\n                          required = false,\n                          defaultValue = "unknown") String version) {\n\n        // Симулируем создание пользователя\n        Long userId = (long) (Math.random() * 1000);\n\n        RegistrationResponse response = new RegistrationResponse(\n            userId,\n            request.getEmail(),\n            platform,\n            version\n        );\n\n        return ResponseEntity.status(HttpStatus.CREATED).body(response);\n    }\n}',
      explanation: 'В одном методе можно комбинировать @RequestBody, @RequestHeader, @PathVariable и @RequestParam. Spring извлекает каждое значение из соответствующей части HTTP запроса. DTO (Data Transfer Objects) разделяют внутреннюю модель данных от API контракта.'
    }
  ]
}
