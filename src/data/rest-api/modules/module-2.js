export default {
  id: 2,
  title: 'REST принципы',
  description: 'Ресурсы, URI design, statelessness, CRUD операции — архитектурные принципы RESTful API.',
  lessons: [
    {
      id: 1,
      title: 'Что такое REST?',
      type: 'theory',
      content: [
        { type: 'text', value: 'REST (Representational State Transfer) — это архитектурный стиль для распределённых систем. Он был описан Роем Филдингом в 2000 году в его докторской диссертации. REST — это не протокол и не стандарт, а набор ограничений (constraints).' },
        { type: 'heading', value: '6 ограничений REST' },
        { type: 'list', items: [
          'Client-Server — клиент и сервер разделены, развиваются независимо',
          'Stateless — сервер не хранит состояние между запросами',
          'Cacheable — ответы должны быть помечены как кэшируемые или нет',
          'Uniform Interface — единый интерфейс взаимодействия',
          'Layered System — система может состоять из слоёв (балансировщик, кэш, сервер)',
          'Code on Demand (опционально) — сервер может отправлять исполняемый код'
        ]},
        { type: 'tip', value: 'REST — это как меню ресторана. Ты (клиент) выбираешь блюдо (ресурс) по названию (URI), говоришь действие (GET — посмотреть, POST — заказать, DELETE — отменить), и получаешь результат. Ресторан не помнит тебя между визитами (stateless).' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        // REST = Ресурсы + HTTP методы + Представления\n\n        // Ресурс: пользователь\n        // URI: /api/users/1\n        // Представление: JSON\n\n        System.out.println("Ресурс: Пользователь");\n        System.out.println("URI: /api/users/1");\n        System.out.println("GET -> Получить представление ресурса");\n        System.out.println("PUT -> Заменить ресурс новым представлением");\n        System.out.println("DELETE -> Удалить ресурс");\n        System.out.println();\n        System.out.println("Представление (JSON):");\n        System.out.println("{");\n        System.out.println("  \\\"id\\\": 1,");\n        System.out.println("  \\\"name\\\": \\\"Мария\\\",");\n        System.out.println("  \\\"email\\\": \\\"maria@mail.kz\\\"");\n        System.out.println("}");\n    }\n}' },
        { type: 'note', value: 'Не каждый API, использующий HTTP, является RESTful. Многие API называют себя REST, но на самом деле это просто HTTP API. Настоящий REST соблюдает все 6 ограничений.' }
      ]
    },
    {
      id: 2,
      title: 'Ресурсы и URI',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ресурс — это центральное понятие REST. Всё является ресурсом: пользователь, заказ, товар, комментарий. URI (Uniform Resource Identifier) — это адрес ресурса.' },
        { type: 'heading', value: 'Правила именования URI' },
        { type: 'list', items: [
          'Используйте существительные, не глаголы: /api/users (не /api/getUsers)',
          'Используйте множественное число: /api/users (не /api/user)',
          'Используйте kebab-case: /api/user-profiles (не /api/userProfiles)',
          'Не используйте расширения файлов: /api/users (не /api/users.json)',
          'Вложенность для связанных ресурсов: /api/users/1/orders',
          'Максимум 2 уровня вложенности'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Хорошие URI\n        String[] goodUris = {\n            "GET /api/users",\n            "GET /api/users/42",\n            "GET /api/users/42/orders",\n            "GET /api/users/42/orders/7",\n            "POST /api/users",\n            "GET /api/product-categories",\n            "GET /api/search?q=java&type=book"\n        };\n\n        // Плохие URI (антипаттерны)\n        String[] badUris = {\n            "GET /api/getUsers           <- глагол в URI",\n            "GET /api/user               <- единственное число",\n            "POST /api/createUser        <- глагол + единственное",\n            "GET /api/userProfiles       <- camelCase",\n            "DELETE /api/users/delete/42 <- глагол в URI",\n            "GET /api/users.json         <- расширение файла"\n        };\n\n        System.out.println("=== Хорошие URI ===");\n        for (String uri : goodUris) {\n            System.out.println("  " + uri);\n        }\n\n        System.out.println("\\n=== Плохие URI (антипаттерны) ===");\n        for (String uri : badUris) {\n            System.out.println("  " + uri);\n        }\n    }\n}' },
        { type: 'heading', value: 'Примеры из реальных API' },
        { type: 'text', value: 'GitHub: /repos/{owner}/{repo}/issues/{number}/comments. Stripe: /v1/customers/{id}/sources. Kaspi: /api/v1/payments/{id}. Все используют существительные и множественное число.' },
        { type: 'warning', value: 'Исключение: действия, которые не являются CRUD. Например, POST /api/users/42/activate — это допустимо, потому что activate — это не CRUD операция, а бизнес-действие.' }
      ]
    },
    {
      id: 3,
      title: 'Statelessness',
      type: 'theory',
      content: [
        { type: 'text', value: 'Stateless (без состояния) — каждый запрос содержит всю необходимую информацию для обработки. Сервер не хранит состояние клиента между запросами.' },
        { type: 'heading', value: 'Почему Stateless?' },
        { type: 'list', items: [
          'Масштабируемость — любой сервер может обработать любой запрос',
          'Надёжность — падение одного сервера не теряет данные сессии',
          'Простота — сервер проще, нет управления состоянием',
          'Кэширование — запросы можно кэшировать',
          'Балансировка нагрузки — запросы равномерно распределяются'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // STATEFUL (плохо для REST) — сервер хранит состояние\n        System.out.println("=== STATEFUL (антипаттерн) ===");\n        System.out.println("Запрос 1: POST /api/login {user: admin}");\n        System.out.println("Сервер: сохраняю сессию session_id=abc");\n        System.out.println("Запрос 2: GET /api/orders");\n        System.out.println("Сервер: ищу сессию abc... нашёл user=admin");\n        System.out.println("Проблема: другой сервер не знает о сессии!\\n");\n\n        // STATELESS (правильный REST) — всё в запросе\n        System.out.println("=== STATELESS (REST) ===");\n        System.out.println("Запрос 1: GET /api/orders");\n        System.out.println("  Header: Authorization: Bearer eyJhbGci...");\n        System.out.println("Сервер: верифицирую токен -> user=admin -> отдаю заказы");\n        System.out.println();\n        System.out.println("Запрос 2: GET /api/orders");\n        System.out.println("  Header: Authorization: Bearer eyJhbGci...");\n        System.out.println("ЛЮБОЙ сервер: верифицирую токен -> user=admin -> отдаю заказы");\n\n        System.out.println();\n        System.out.println("Вывод: токен содержит всю информацию о пользователе.");\n        System.out.println("Любой сервер может обработать запрос без сессии.");\n    }\n}' },
        { type: 'tip', value: 'JWT (JSON Web Token) — идеальное решение для stateless аутентификации. Токен содержит информацию о пользователе и подписан сервером. Любой сервер может его проверить.' },
        { type: 'note', value: 'Stateless не значит, что сервер не хранит данные. База данных — это хранилище данных. Stateless значит, что сервер не хранит СОСТОЯНИЕ КЛИЕНТА (сессии, контексты разговора) между запросами.' }
      ]
    },
    {
      id: 4,
      title: 'CRUD и HTTP методы',
      type: 'theory',
      content: [
        { type: 'text', value: 'CRUD (Create, Read, Update, Delete) — четыре базовые операции над данными. В REST каждая CRUD операция соответствует HTTP методу.' },
        { type: 'heading', value: 'Маппинг CRUD → HTTP' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    static List<Map<String, Object>> products = new ArrayList<>();\n    static int nextId = 1;\n\n    public static void main(String[] args) {\n        // CREATE → POST\n        System.out.println("=== CREATE (POST /api/products) ===");\n        Map<String, Object> p1 = create("iPhone 15", 599990);\n        Map<String, Object> p2 = create("Samsung S24", 499990);\n        System.out.println("201 Created: " + p1);\n        System.out.println("201 Created: " + p2);\n\n        // READ → GET (список)\n        System.out.println("\\n=== READ ALL (GET /api/products) ===");\n        System.out.println("200 OK: " + readAll());\n\n        // READ → GET (один)\n        System.out.println("\\n=== READ ONE (GET /api/products/1) ===");\n        System.out.println("200 OK: " + readOne(1));\n\n        // UPDATE → PUT (полная замена)\n        System.out.println("\\n=== UPDATE (PUT /api/products/1) ===");\n        Map<String, Object> updated = update(1, "iPhone 15 Pro", 699990);\n        System.out.println("200 OK: " + updated);\n\n        // UPDATE → PATCH (частичное)\n        System.out.println("\\n=== PARTIAL UPDATE (PATCH /api/products/1) ===");\n        Map<String, Object> patched = patch(1, "price", 649990);\n        System.out.println("200 OK: " + patched);\n\n        // DELETE → DELETE\n        System.out.println("\\n=== DELETE (DELETE /api/products/2) ===");\n        delete(2);\n        System.out.println("204 No Content");\n\n        // Проверяем\n        System.out.println("\\n=== ПОСЛЕ УДАЛЕНИЯ (GET /api/products) ===");\n        System.out.println("200 OK: " + readAll());\n    }\n\n    static Map<String, Object> create(String name, int price) {\n        Map<String, Object> product = new LinkedHashMap<>();\n        product.put("id", nextId++);\n        product.put("name", name);\n        product.put("price", price);\n        products.add(product);\n        return product;\n    }\n\n    static List<Map<String, Object>> readAll() {\n        return products;\n    }\n\n    static Map<String, Object> readOne(int id) {\n        return products.stream()\n            .filter(p -> (int) p.get("id") == id)\n            .findFirst().orElse(null);\n    }\n\n    static Map<String, Object> update(int id, String name, int price) {\n        Map<String, Object> p = readOne(id);\n        if (p != null) { p.put("name", name); p.put("price", price); }\n        return p;\n    }\n\n    static Map<String, Object> patch(int id, String field, Object value) {\n        Map<String, Object> p = readOne(id);\n        if (p != null) { p.put(field, value); }\n        return p;\n    }\n\n    static void delete(int id) {\n        products.removeIf(p -> (int) p.get("id") == id);\n    }\n}' },
        { type: 'heading', value: 'Таблица соответствия' },
        { type: 'text', value: 'CREATE = POST (не идемпотентный), READ = GET (безопасный, идемпотентный), UPDATE = PUT/PATCH (идемпотентный), DELETE = DELETE (идемпотентный).' },
        { type: 'note', value: 'В Kaspi API: POST /api/v1/payments — создание платежа, GET /api/v1/payments/{id} — проверка статуса, DELETE /api/v1/payments/{id} — отмена платежа. Классический CRUD.' }
      ]
    },
    {
      id: 5,
      title: 'Коллекции и элементы',
      type: 'theory',
      content: [
        { type: 'text', value: 'В REST API URL указывает на два типа ресурсов: коллекция (список) и элемент (конкретный ресурс). Они обрабатываются по-разному.' },
        { type: 'heading', value: 'Коллекция vs Элемент' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // КОЛЛЕКЦИЯ: /api/users\n        System.out.println("=== КОЛЛЕКЦИЯ: /api/users ===");\n        System.out.println("GET    /api/users       -> Список пользователей");\n        System.out.println("POST   /api/users       -> Создать пользователя");\n        System.out.println("PUT    /api/users       -> 405 Method Not Allowed");\n        System.out.println("DELETE /api/users       -> 405 (или удалить все)");\n\n        System.out.println();\n\n        // ЭЛЕМЕНТ: /api/users/{id}\n        System.out.println("=== ЭЛЕМЕНТ: /api/users/{id} ===");\n        System.out.println("GET    /api/users/42    -> Получить пользователя 42");\n        System.out.println("POST   /api/users/42    -> 405 Method Not Allowed");\n        System.out.println("PUT    /api/users/42    -> Обновить пользователя 42");\n        System.out.println("PATCH  /api/users/42    -> Частично обновить");\n        System.out.println("DELETE /api/users/42    -> Удалить пользователя 42");\n\n        System.out.println();\n\n        // ВЛОЖЕННЫЕ РЕСУРСЫ\n        System.out.println("=== ВЛОЖЕННЫЕ РЕСУРСЫ ===");\n        System.out.println("GET  /api/users/42/orders       -> Заказы пользователя 42");\n        System.out.println("POST /api/users/42/orders       -> Создать заказ у пользователя 42");\n        System.out.println("GET  /api/users/42/orders/7     -> Заказ 7 пользователя 42");\n        System.out.println("GET  /api/orders/7              -> Альтернатива (если ID уникален)");\n\n        System.out.println();\n\n        // ПРИМЕРЫ РЕАЛЬНЫХ API\n        System.out.println("=== ПРИМЕРЫ РЕАЛЬНЫХ API ===");\n        System.out.println("GitHub:  GET /repos/octocat/hello-world/issues");\n        System.out.println("GitHub:  GET /repos/octocat/hello-world/issues/1");\n        System.out.println("Stripe:  GET /v1/customers");\n        System.out.println("Stripe:  GET /v1/customers/cus_123/sources");\n    }\n}' },
        { type: 'heading', value: 'Глубина вложенности' },
        { type: 'text', value: 'Максимум 2 уровня вложенности. Если нужна более глубокая вложенность — используйте query параметры или выделяйте ресурс на верхний уровень.' },
        { type: 'code', language: 'java', value: '// Плохо — слишком глубоко\n// GET /api/countries/kz/cities/almaty/districts/bostandyk/streets\n\n// Хорошо — вынесли на верхний уровень с фильтрацией\n// GET /api/streets?country=kz&city=almaty&district=bostandyk' },
        { type: 'tip', value: 'Если дочерний ресурс имеет глобально уникальный ID, его можно запрашивать напрямую: GET /api/orders/7 вместо GET /api/users/42/orders/7. Это упрощает API.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: CRUD хранилище',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте in-memory CRUD хранилище для ресурса "Задача" (Task) с маршрутизацией по HTTP методам.',
      requirements: [
        'Создайте класс Task с полями: id, title, description, completed',
        'Реализуйте операции: createTask, getAllTasks, getTaskById, updateTask, deleteTask',
        'Создайте метод handleRequest(String method, String path, String body), который маршрутизирует запрос',
        'Продемонстрируйте полный CRUD цикл: создание 3 задач, чтение списка, обновление, удаление'
      ],
      expectedOutput: 'POST /api/tasks -> 201: {id=1, title=Купить продукты, completed=false}\nPOST /api/tasks -> 201: {id=2, title=Написать код, completed=false}\nPOST /api/tasks -> 201: {id=3, title=Почитать книгу, completed=false}\nGET /api/tasks -> 200: [3 задачи]\nGET /api/tasks/2 -> 200: {id=2, title=Написать код}\nPUT /api/tasks/2 -> 200: {id=2, title=Написать код, completed=true}\nDELETE /api/tasks/3 -> 204 No Content\nGET /api/tasks -> 200: [2 задачи]',
      hint: 'Используйте ArrayList для хранения задач и AtomicInteger для генерации ID. Разбирайте path.split("/") для определения маршрута.',
      solution: 'import java.util.*;\n\npublic class Main {\n    static List<Map<String, Object>> tasks = new ArrayList<>();\n    static int nextId = 1;\n\n    public static void main(String[] args) {\n        // CREATE\n        System.out.println(handleRequest("POST", "/api/tasks",\n            "title=Купить продукты&description=Молоко, хлеб"));\n        System.out.println(handleRequest("POST", "/api/tasks",\n            "title=Написать код&description=REST API"));\n        System.out.println(handleRequest("POST", "/api/tasks",\n            "title=Почитать книгу&description=Clean Code"));\n\n        // READ ALL\n        System.out.println(handleRequest("GET", "/api/tasks", null));\n\n        // READ ONE\n        System.out.println(handleRequest("GET", "/api/tasks/2", null));\n\n        // UPDATE\n        System.out.println(handleRequest("PUT", "/api/tasks/2",\n            "title=Написать код&completed=true"));\n\n        // DELETE\n        System.out.println(handleRequest("DELETE", "/api/tasks/3", null));\n\n        // READ ALL AGAIN\n        System.out.println(handleRequest("GET", "/api/tasks", null));\n    }\n\n    static String handleRequest(String method, String path, String body) {\n        String[] segments = path.split("/");\n        boolean hasId = segments.length == 4;\n        int id = hasId ? Integer.parseInt(segments[3]) : -1;\n\n        switch (method) {\n            case "GET":\n                if (hasId) {\n                    Map<String, Object> task = findById(id);\n                    return "GET " + path + " -> 200: " + (task != null ? task : "404 Not Found");\n                }\n                return "GET " + path + " -> 200: " + tasks;\n            case "POST": {\n                Map<String, Object> task = new LinkedHashMap<>();\n                task.put("id", nextId++);\n                parseBody(body, task);\n                task.putIfAbsent("completed", false);\n                tasks.add(task);\n                return "POST " + path + " -> 201: " + task;\n            }\n            case "PUT": {\n                Map<String, Object> task = findById(id);\n                if (task == null) return "PUT " + path + " -> 404 Not Found";\n                parseBody(body, task);\n                return "PUT " + path + " -> 200: " + task;\n            }\n            case "DELETE": {\n                tasks.removeIf(t -> (int) t.get("id") == id);\n                return "DELETE " + path + " -> 204 No Content";\n            }\n            default:\n                return method + " " + path + " -> 405 Method Not Allowed";\n        }\n    }\n\n    static Map<String, Object> findById(int id) {\n        return tasks.stream()\n            .filter(t -> (int) t.get("id") == id)\n            .findFirst().orElse(null);\n    }\n\n    static void parseBody(String body, Map<String, Object> target) {\n        if (body == null) return;\n        for (String pair : body.split("&")) {\n            String[] kv = pair.split("=", 2);\n            String value = kv.length > 1 ? kv[1] : "";\n            if (value.equals("true") || value.equals("false")) {\n                target.put(kv[0], Boolean.parseBoolean(value));\n            } else {\n                target.put(kv[0], value);\n            }\n        }\n    }\n}',
      explanation: 'Этот пример демонстрирует полный CRUD цикл. Маршрутизатор разбирает URL и метод, определяя какую операцию выполнить. POST создаёт ресурс с автогенерируемым ID, GET читает (коллекцию или элемент), PUT обновляет, DELETE удаляет. Это основа любого REST API.'
    },
    {
      id: 7,
      title: 'Практика: Идемпотентность',
      type: 'practice',
      difficulty: 'medium',
      description: 'Продемонстрируйте разницу между идемпотентными и неидемпотентными HTTP методами.',
      requirements: [
        'Покажите что POST не идемпотентен: 3 одинаковых POST создадут 3 ресурса',
        'Покажите что PUT идемпотентен: 3 одинаковых PUT дадут одно состояние',
        'Покажите что DELETE идемпотентен: повторный DELETE не создаёт побочных эффектов',
        'Покажите что GET безопасен: 3 GET не изменят данные',
        'Реализуйте Idempotency-Key для POST (как в Stripe API)'
      ],
      expectedOutput: '=== POST (не идемпотентный) ===\nPOST #1: создан id=1\nPOST #2: создан id=2\nPOST #3: создан id=3\nВсего: 3 ресурса\n\n=== PUT (идемпотентный) ===\nPUT #1: обновлён id=1 name=Обновлённый\nPUT #2: обновлён id=1 name=Обновлённый\nPUT #3: обновлён id=1 name=Обновлённый\nВсего: 1 ресурс, одно состояние\n\n=== Idempotency-Key ===\nPOST key=abc: создан id=4\nPOST key=abc: возвращён кэш id=4\nPOST key=abc: возвращён кэш id=4',
      hint: 'Для Idempotency-Key используйте HashMap, где ключ — это idempotency key, а значение — результат первого запроса. Повторные запросы с тем же ключом возвращают кэшированный результат.',
      solution: 'import java.util.*;\n\npublic class Main {\n    static List<Map<String, Object>> items = new ArrayList<>();\n    static int nextId = 1;\n    static Map<String, Map<String, Object>> idempotencyCache = new HashMap<>();\n\n    public static void main(String[] args) {\n        // POST — не идемпотентный\n        System.out.println("=== POST (не идемпотентный) ===");\n        for (int i = 1; i <= 3; i++) {\n            Map<String, Object> item = createItem("Товар");\n            System.out.println("POST #" + i + ": создан id=" + item.get("id"));\n        }\n        System.out.println("Всего: " + items.size() + " ресурса");\n\n        // PUT — идемпотентный\n        System.out.println("\\n=== PUT (идемпотентный) ===");\n        for (int i = 1; i <= 3; i++) {\n            Map<String, Object> updated = updateItem(1, "Обновлённый");\n            System.out.println("PUT #" + i + ": обновлён id=" + updated.get("id")\n                + " name=" + updated.get("name"));\n        }\n        System.out.println("Всего: " + items.size() + " ресурсов, одно состояние");\n\n        // DELETE — идемпотентный\n        System.out.println("\\n=== DELETE (идемпотентный) ===");\n        for (int i = 1; i <= 3; i++) {\n            boolean deleted = deleteItem(3);\n            System.out.println("DELETE #" + i + ": " +\n                (deleted ? "удалён" : "уже не существует"));\n        }\n        System.out.println("Побочный эффект только один раз");\n\n        // Idempotency-Key (как Stripe)\n        System.out.println("\\n=== Idempotency-Key ===");\n        for (int i = 1; i <= 3; i++) {\n            Map<String, Object> result = createWithIdempotencyKey("abc", "Платёж");\n            boolean cached = i > 1;\n            System.out.println("POST key=abc: " +\n                (cached ? "возвращён кэш" : "создан") + " id=" + result.get("id"));\n        }\n    }\n\n    static Map<String, Object> createItem(String name) {\n        Map<String, Object> item = new LinkedHashMap<>();\n        item.put("id", nextId++);\n        item.put("name", name);\n        items.add(item);\n        return item;\n    }\n\n    static Map<String, Object> updateItem(int id, String name) {\n        for (Map<String, Object> item : items) {\n            if ((int) item.get("id") == id) {\n                item.put("name", name);\n                return item;\n            }\n        }\n        return null;\n    }\n\n    static boolean deleteItem(int id) {\n        return items.removeIf(item -> (int) item.get("id") == id);\n    }\n\n    static Map<String, Object> createWithIdempotencyKey(String key, String name) {\n        if (idempotencyCache.containsKey(key)) {\n            return idempotencyCache.get(key);\n        }\n        Map<String, Object> item = createItem(name);\n        idempotencyCache.put(key, item);\n        return item;\n    }\n}',
      explanation: 'Идемпотентность — ключевое свойство REST. POST не идемпотентен: каждый вызов создаёт новый ресурс. PUT и DELETE идемпотентны: повторные вызовы не меняют результат. Idempotency-Key (как в Stripe API) решает проблему дублирования для POST: если сеть оборвалась и клиент повторяет запрос — сервер вернёт кэшированный результат вместо создания дубликата.'
    }
  ]
}
