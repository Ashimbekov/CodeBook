export default {
  id: 5,
  title: 'REST контроллеры',
  description: 'Создание REST API с @RestController, @GetMapping, @PostMapping, @PutMapping, @DeleteMapping',
  lessons: [
    {
      id: 1,
      title: 'Что такое REST API?',
      type: 'theory',
      content: [
        { type: 'text', value: 'REST (Representational State Transfer) — архитектурный стиль для создания веб-сервисов. REST API — это интерфейс взаимодействия между клиентом и сервером через HTTP.' },
        { type: 'heading', value: 'Принципы REST' },
        { type: 'list', items: [
          'Stateless — сервер не хранит состояние клиента между запросами',
          'Ресурсы — всё моделируется как ресурсы (/users, /products)',
          'HTTP методы — GET (чтение), POST (создание), PUT (обновление), DELETE (удаление)',
          'Единый интерфейс — предсказуемые URL и форматы',
          'JSON — стандартный формат данных'
        ]},
        { type: 'heading', value: 'Примеры REST endpoints' },
        { type: 'code', language: 'java', value: '// Ресурс: пользователи (users)\nGET    /users         — список всех пользователей\nGET    /users/42      — конкретный пользователь с id=42\nPOST   /users         — создать нового пользователя\nPUT    /users/42      — полностью обновить пользователя 42\nPATCH  /users/42      — частично обновить пользователя 42\nDELETE /users/42      — удалить пользователя 42\n\n// Вложенные ресурсы\nGET    /users/42/orders     — заказы пользователя 42\nGET    /users/42/orders/5   — заказ 5 пользователя 42' },
        { type: 'tip', value: 'URL должны быть именами (существительными), не действиями. Правильно: POST /users. Неправильно: POST /createUser или /users/create.' }
      ]
    },
    {
      id: 2,
      title: '@RestController и @RequestMapping',
      type: 'theory',
      content: [
        { type: 'text', value: '@RestController — ключевая аннотация для REST API в Spring Boot. Она сочетает @Controller (регистрация как обработчик запросов) и @ResponseBody (возврат данных напрямую в теле ответа).' },
        { type: 'code', language: 'java', value: '@RestController\n@RequestMapping("/api/v1/users")  // базовый путь для всех методов\npublic class UserController {\n\n    private final UserService userService;\n\n    public UserController(UserService userService) {\n        this.userService = userService;\n    }\n\n    // GET /api/v1/users\n    @GetMapping\n    public List<User> getAllUsers() {\n        return userService.findAll();\n    }\n\n    // GET /api/v1/users/42\n    @GetMapping("/{id}")\n    public User getUserById(@PathVariable Long id) {\n        return userService.findById(id);\n    }\n}' },
        { type: 'heading', value: 'Версионирование API' },
        { type: 'text', value: 'В реальных проектах принято версионировать API: /api/v1/, /api/v2/. Это позволяет менять API не ломая старых клиентов.' },
        { type: 'note', value: '@RequestMapping можно ставить и на уровне метода, и на уровне класса. На уровне класса задаёт базовый путь. На уровне метода — дополнение к базовому.' }
      ]
    },
    {
      id: 3,
      title: 'GET запросы: @GetMapping',
      type: 'theory',
      content: [
        { type: 'text', value: '@GetMapping обрабатывает HTTP GET запросы. GET используется для получения данных — он не изменяет состояние сервера (идемпотентный).' },
        { type: 'code', language: 'java', value: '@RestController\n@RequestMapping("/api/products")\npublic class ProductController {\n\n    // GET /api/products — список продуктов\n    @GetMapping\n    public List<Product> getAll() {\n        return productService.findAll();\n    }\n\n    // GET /api/products/5 — один продукт\n    @GetMapping("/{id}")\n    public Product getById(@PathVariable Long id) {\n        return productService.findById(id);\n    }\n\n    // GET /api/products/search?name=phone — поиск\n    @GetMapping("/search")\n    public List<Product> search(@RequestParam String name) {\n        return productService.findByName(name);\n    }\n\n    // GET /api/products/categories/electronics\n    @GetMapping("/categories/{category}")\n    public List<Product> getByCategory(@PathVariable String category) {\n        return productService.findByCategory(category);\n    }\n}' },
        { type: 'tip', value: 'Используй ResponseEntity<T> для полного контроля над HTTP ответом: статус код, заголовки, тело. Например: return ResponseEntity.ok(product); или return ResponseEntity.notFound().build();' }
      ]
    },
    {
      id: 4,
      title: 'POST запросы: @PostMapping',
      type: 'theory',
      content: [
        { type: 'text', value: '@PostMapping обрабатывает HTTP POST запросы. POST используется для создания новых ресурсов. Данные передаются в теле запроса (request body) в формате JSON.' },
        { type: 'code', language: 'java', value: '@RestController\n@RequestMapping("/api/users")\npublic class UserController {\n\n    // POST /api/users\n    // Тело запроса: {"name": "Иван", "email": "ivan@test.com"}\n    @PostMapping\n    public ResponseEntity<User> createUser(@RequestBody User user) {\n        User created = userService.create(user);\n        // 201 Created + ссылка на созданный ресурс\n        return ResponseEntity\n            .created(URI.create("/api/users/" + created.getId()))\n            .body(created);\n    }\n}' },
        { type: 'heading', value: 'HTTP статус коды' },
        { type: 'list', items: [
          '200 OK — успешный GET, PUT, DELETE',
          '201 Created — успешный POST (создание)',
          '204 No Content — успешный DELETE без тела ответа',
          '400 Bad Request — неверный запрос (ошибка валидации)',
          '401 Unauthorized — нет аутентификации',
          '403 Forbidden — нет прав',
          '404 Not Found — ресурс не найден',
          '500 Internal Server Error — ошибка сервера'
        ]},
        { type: 'code', language: 'java', value: '// Использование ResponseEntity для правильных статус кодов\n@PostMapping\npublic ResponseEntity<User> create(@RequestBody User user) {\n    User saved = userService.save(user);\n    return ResponseEntity.status(HttpStatus.CREATED).body(saved);\n    // Короче: return ResponseEntity.created(...).body(saved);\n}' }
      ]
    },
    {
      id: 5,
      title: 'PUT и DELETE запросы',
      type: 'theory',
      content: [
        { type: 'text', value: '@PutMapping обновляет ресурс целиком. @PatchMapping частично. @DeleteMapping удаляет ресурс.' },
        { type: 'code', language: 'java', value: '@RestController\n@RequestMapping("/api/users")\npublic class UserController {\n\n    // PUT /api/users/42 — полное обновление\n    @PutMapping("/{id}")\n    public ResponseEntity<User> updateUser(\n            @PathVariable Long id,\n            @RequestBody User user) {\n        User updated = userService.update(id, user);\n        return ResponseEntity.ok(updated);\n    }\n\n    // PATCH /api/users/42 — частичное обновление\n    @PatchMapping("/{id}")\n    public ResponseEntity<User> patchUser(\n            @PathVariable Long id,\n            @RequestBody Map<String, Object> updates) {\n        User patched = userService.patch(id, updates);\n        return ResponseEntity.ok(patched);\n    }\n\n    // DELETE /api/users/42\n    @DeleteMapping("/{id}")\n    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {\n        userService.delete(id);\n        return ResponseEntity.noContent().build(); // 204\n    }\n}' },
        { type: 'tip', value: 'PUT vs PATCH: PUT заменяет весь объект (все поля), PATCH обновляет только указанные поля. PUT идемпотентен (можно вызвать много раз с одинаковым результатом), POST — нет.' }
      ]
    },
    {
      id: 6,
      title: 'ResponseEntity и HTTP статусы',
      type: 'theory',
      content: [
        { type: 'text', value: 'ResponseEntity<T> — обёртка для полного контроля над HTTP ответом. Позволяет задать статус код, заголовки и тело.' },
        { type: 'code', language: 'java', value: '@GetMapping("/{id}")\npublic ResponseEntity<User> getUser(@PathVariable Long id) {\n    return userService.findById(id)\n        .map(user -> ResponseEntity.ok(user))           // 200 OK\n        .orElse(ResponseEntity.notFound().build());     // 404 Not Found\n}\n\n// Или через orElseThrow (лучше)\n@GetMapping("/{id}")\npublic User getUser(@PathVariable Long id) {\n    return userService.findById(id)\n        .orElseThrow(() -> new ResponseStatusException(\n            HttpStatus.NOT_FOUND, "Пользователь не найден: " + id\n        ));\n}' },
        { type: 'code', language: 'java', value: '// Полезные методы ResponseEntity\nResponseEntity.ok(body)                    // 200\nResponseEntity.created(location).body(x)  // 201\nResponseEntity.noContent().build()        // 204\nResponseEntity.badRequest().body(error)   // 400\nResponseEntity.notFound().build()         // 404\nResponseEntity.status(HttpStatus.ACCEPTED).body(x) // любой статус' },
        { type: 'note', value: 'Не всегда нужен ResponseEntity. Если метод просто возвращает объект — Spring автоматически вернёт 200 OK. ResponseEntity нужен когда статус зависит от логики (201, 204, 404 и т.д.).' }
      ]
    },
    {
      id: 7,
      title: 'Практика: CRUD контроллер для продуктов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай полный CRUD REST API для управления продуктами, хранящимися в памяти (List).',
      requirements: [
        'Класс Product: id (Long), name (String), price (Double)',
        'GET /api/products — все продукты',
        'GET /api/products/{id} — продукт по id (404 если нет)',
        'POST /api/products — создать продукт (201 Created)',
        'PUT /api/products/{id} — обновить продукт',
        'DELETE /api/products/{id} — удалить (204 No Content)'
      ],
      expectedOutput: 'POST /api/products {"name":"Телефон","price":50000} => 201\nGET /api/products/1 => {"id":1,"name":"Телефон","price":50000}\nDELETE /api/products/1 => 204',
      hint: 'Сервис хранит List<Product> и AtomicLong для id. findById возвращает Optional<Product>. Контроллер использует ResponseEntity для статус кодов.',
      solution: '// Product.java\npublic class Product {\n    private Long id;\n    private String name;\n    private Double price;\n    // геттеры, сеттеры, конструкторы\n}\n\n// ProductService.java\n@Service\npublic class ProductService {\n    private final List<Product> products = new ArrayList<>();\n    private final AtomicLong idGen = new AtomicLong(1);\n\n    public List<Product> findAll() { return products; }\n\n    public Optional<Product> findById(Long id) {\n        return products.stream().filter(p -> p.getId().equals(id)).findFirst();\n    }\n\n    public Product create(Product p) {\n        p.setId(idGen.getAndIncrement());\n        products.add(p);\n        return p;\n    }\n\n    public Optional<Product> update(Long id, Product data) {\n        return findById(id).map(p -> {\n            p.setName(data.getName());\n            p.setPrice(data.getPrice());\n            return p;\n        });\n    }\n\n    public boolean delete(Long id) {\n        return products.removeIf(p -> p.getId().equals(id));\n    }\n}\n\n// ProductController.java\n@RestController\n@RequestMapping("/api/products")\npublic class ProductController {\n    private final ProductService productService;\n\n    public ProductController(ProductService productService) {\n        this.productService = productService;\n    }\n\n    @GetMapping\n    public List<Product> getAll() { return productService.findAll(); }\n\n    @GetMapping("/{id}")\n    public ResponseEntity<Product> getById(@PathVariable Long id) {\n        return productService.findById(id)\n            .map(ResponseEntity::ok)\n            .orElse(ResponseEntity.notFound().build());\n    }\n\n    @PostMapping\n    public ResponseEntity<Product> create(@RequestBody Product product) {\n        Product created = productService.create(product);\n        return ResponseEntity.status(HttpStatus.CREATED).body(created);\n    }\n\n    @PutMapping("/{id}")\n    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product product) {\n        return productService.update(id, product)\n            .map(ResponseEntity::ok)\n            .orElse(ResponseEntity.notFound().build());\n    }\n\n    @DeleteMapping("/{id}")\n    public ResponseEntity<Void> delete(@PathVariable Long id) {\n        if (productService.delete(id)) {\n            return ResponseEntity.noContent().build();\n        }\n        return ResponseEntity.notFound().build();\n    }\n}',
      explanation: 'CRUD через REST: GET для чтения, POST для создания (возвращает 201), PUT для обновления, DELETE для удаления (возвращает 204). ResponseEntity позволяет контролировать статус код. Optional помогает обработать случай "не найдено" — возвращаем 404.'
    },
    {
      id: 8,
      title: 'Практика: Вложенные ресурсы',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай API с вложенными ресурсами: пользователи и их заказы.',
      requirements: [
        'GET /api/users/{userId}/orders — заказы пользователя',
        'POST /api/users/{userId}/orders — создать заказ для пользователя',
        'GET /api/users/{userId}/orders/{orderId} — конкретный заказ',
        'Возвращать 404 если пользователь не существует',
        'Order должен содержать: id, userId, description, total'
      ],
      expectedOutput: 'POST /api/users/1/orders {"description":"Заказ","total":1000} => 201\nGET /api/users/1/orders => [{"id":1,"userId":1,"description":"Заказ","total":1000}]',
      hint: '@RequestMapping("/api/users/{userId}/orders") на классе. В каждом методе добавляй @PathVariable Long userId. Проверяй существование пользователя перед работой с заказами.',
      solution: '@RestController\n@RequestMapping("/api/users/{userId}/orders")\npublic class OrderController {\n    private final UserService userService;\n    private final OrderService orderService;\n\n    public OrderController(UserService userService, OrderService orderService) {\n        this.userService = userService;\n        this.orderService = orderService;\n    }\n\n    @GetMapping\n    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {\n        if (!userService.exists(userId)) {\n            return ResponseEntity.notFound().build();\n        }\n        return ResponseEntity.ok(orderService.findByUserId(userId));\n    }\n\n    @PostMapping\n    public ResponseEntity<Order> createOrder(\n            @PathVariable Long userId,\n            @RequestBody Order order) {\n        if (!userService.exists(userId)) {\n            return ResponseEntity.notFound().build();\n        }\n        order.setUserId(userId);\n        Order created = orderService.create(order);\n        return ResponseEntity.status(HttpStatus.CREATED).body(created);\n    }\n\n    @GetMapping("/{orderId}")\n    public ResponseEntity<Order> getOrder(\n            @PathVariable Long userId,\n            @PathVariable Long orderId) {\n        return orderService.findByIdAndUserId(orderId, userId)\n            .map(ResponseEntity::ok)\n            .orElse(ResponseEntity.notFound().build());\n    }\n}',
      explanation: 'Вложенные ресурсы отражают иерархию данных. @RequestMapping на уровне класса задаёт базовый путь. userId из URL доступен в каждом методе через @PathVariable. Всегда проверяй существование родительского ресурса перед работой с дочерними.'
    }
  ]
}
