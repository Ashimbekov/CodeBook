export default {
  id: 5,
  title: 'Request & Response',
  description: 'JSON структура, DTO паттерн, envelope pattern, стандартизация формата запросов и ответов REST API.',
  lessons: [
    {
      id: 1,
      title: 'JSON как формат данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'JSON (JavaScript Object Notation) — стандартный формат данных для REST API. Он лёгкий, читаемый и поддерживается всеми языками программирования.' },
        { type: 'heading', value: 'Правила JSON для API' },
        { type: 'list', items: [
          'camelCase для ключей: firstName (не first_name, не FirstName)',
          'Даты в ISO 8601: "2024-01-15T10:30:00Z"',
          'Денежные суммы: передавайте в минимальных единицах (копейки/тиын)',
          'null для отсутствующих значений (не пустая строка)',
          'Массивы всегда возвращайте как массив (пустой [] вместо null)',
          'Консистентные типы: если поле число — всегда число, не строка'
        ]},
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        // Хороший JSON ответ\n        System.out.println("=== Хороший JSON ===");\n        String good = \"{\\n\"\n            + \"  \\\"id\\\": 42,\\n\"\n            + \"  \\\"firstName\\\": \\\"Алия\\\",\\n\"\n            + \"  \\\"lastName\\\": \\\"Серикова\\\",\\n\"\n            + \"  \\\"email\\\": \\\"aliya@mail.kz\\\",\\n\"\n            + \"  \\\"age\\\": 25,\\n\"\n            + \"  \\\"balance\\\": 1500000,\\n\"\n            + \"  \\\"isActive\\\": true,\\n\"\n            + \"  \\\"address\\\": null,\\n\"\n            + \"  \\\"roles\\\": [\\\"USER\\\", \\\"MODERATOR\\\"],\\n\"\n            + \"  \\\"createdAt\\\": \\\"2024-01-15T10:30:00Z\\\"\\n\"\n            + \"}\";\n        System.out.println(good);\n\n        // Плохой JSON\n        System.out.println(\"\\n=== Плохой JSON (антипаттерны) ===\");\n        String bad = \"{\\n\"\n            + \"  \\\"Id\\\": 42,\\n\"\n            + \"  \\\"first_name\\\": \\\"Алия\\\",\\n\"\n            + \"  \\\"Balance\\\": \\\"1500000\\\",\\n\"\n            + \"  \\\"is_active\\\": \\\"true\\\",\\n\"\n            + \"  \\\"address\\\": \\\"\\\",\\n\"\n            + \"  \\\"roles\\\": null,\\n\"\n            + \"  \\\"created_at\\\": \\\"15.01.2024\\\"\\n\"\n            + \"}\";\n        System.out.println(bad);\n        System.out.println(\"\\nОшибки: PascalCase Id, snake_case, строка вместо числа,\");\n        System.out.println(\"строка вместо boolean, пустая строка вместо null,\");\n        System.out.println(\"null вместо пустого массива, нестандартная дата\");\n    }\n}' },
        { type: 'tip', value: 'Stripe API использует snake_case (customer_id), GitHub API — snake_case (created_at). Google API — camelCase (firstName). Выберите один стиль и придерживайтесь его во всём API.' },
        { type: 'note', value: 'В Java-мире camelCase — естественный выбор, потому что Java сама использует camelCase. Jackson по умолчанию сериализует поля в camelCase.' }
      ]
    },
    {
      id: 2,
      title: 'Структура ответа: одиночный ресурс',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ответ для одного ресурса (GET /api/users/1) должен содержать все поля объекта в плоском JSON. Не оборачивайте в дополнительные обёртки без необходимости.' },
        { type: 'heading', value: 'Простой формат (прямой объект)' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        // GET /api/users/42 -> 200 OK\n        System.out.println("=== Простой формат (GitHub/Stripe стиль) ===");\n        System.out.println("{");\n        System.out.println("  \\\"id\\\": 42,");\n        System.out.println("  \\\"name\\\": \\\"Алия Серикова\\\",");\n        System.out.println("  \\\"email\\\": \\\"aliya@mail.kz\\\",");\n        System.out.println("  \\\"role\\\": \\\"ADMIN\\\",");\n        System.out.println("  \\\"createdAt\\\": \\\"2024-01-15T10:30:00Z\\\"");\n        System.out.println("}");\n\n        // Envelope формат\n        System.out.println("\\n=== Envelope формат (обёртка) ===");\n        System.out.println("{");\n        System.out.println("  \\\"success\\\": true,");\n        System.out.println("  \\\"data\\\": {");\n        System.out.println("    \\\"id\\\": 42,");\n        System.out.println("    \\\"name\\\": \\\"Алия Серикова\\\",");\n        System.out.println("    \\\"email\\\": \\\"aliya@mail.kz\\\"");\n        System.out.println("  },");\n        System.out.println("  \\\"meta\\\": {");\n        System.out.println("    \\\"requestId\\\": \\\"req-abc-123\\\",");\n        System.out.println("    \\\"timestamp\\\": \\\"2024-01-15T10:30:00Z\\\"");\n        System.out.println("  }");\n        System.out.println("}");\n\n        System.out.println("\\n=== Когда какой формат ===");\n        System.out.println("Простой: GitHub, Stripe — чистый объект");\n        System.out.println("Envelope: когда нужна мета-информация");\n        System.out.println("Рекомендация: начинайте с простого, добавьте envelope при необходимости");\n    }\n}' },
        { type: 'heading', value: 'Связанные ресурсы' },
        { type: 'text', value: 'Для связанных ресурсов есть два подхода: встраивание (embedding) и ссылки (linking).' },
        { type: 'code', language: 'java', value: '// Подход 1: Embedding (встраивание)\n// GET /api/orders/7\n// {\n//   "id": 7,\n//   "customer": {       <- встроенный объект\n//     "id": 42,\n//     "name": "Алия"\n//   },\n//   "items": [...]      <- встроенный массив\n// }\n\n// Подход 2: Linking (ссылки)\n// GET /api/orders/7\n// {\n//   "id": 7,\n//   "customerId": 42,   <- только ID\n//   "links": {\n//     "customer": "/api/users/42",\n//     "items": "/api/orders/7/items"\n//   }\n// }' },
        { type: 'tip', value: 'GitHub API использует embedding для автора коммита и linking для остальных связей. Stripe API встраивает все связанные объекты. Выбирайте embedding для часто используемых связей.' }
      ]
    },
    {
      id: 3,
      title: 'Структура ответа: коллекция',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ответ для коллекции (GET /api/users) содержит массив объектов и мета-информацию о пагинации. Есть два подхода: массив напрямую и обёртка (envelope).' },
        { type: 'heading', value: 'Варианты формата коллекции' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        // Вариант 1: Прямой массив (GitHub стиль)\n        System.out.println("=== Вариант 1: Прямой массив ===");\n        System.out.println("GET /api/users");\n        System.out.println("[");\n        System.out.println("  {\\\"id\\\": 1, \\\"name\\\": \\\"Алия\\\"},");\n        System.out.println("  {\\\"id\\\": 2, \\\"name\\\": \\\"Бауыржан\\\"}");\n        System.out.println("]");\n        System.out.println("Пагинация в заголовках: Link: </api/users?page=2>; rel=\\\"next\\\"");\n\n        // Вариант 2: Envelope (Stripe стиль)\n        System.out.println("\\n=== Вариант 2: Envelope ===");\n        System.out.println("GET /api/users?page=1&size=20");\n        System.out.println("{");\n        System.out.println("  \\\"data\\\": [");\n        System.out.println("    {\\\"id\\\": 1, \\\"name\\\": \\\"Алия\\\"},");\n        System.out.println("    {\\\"id\\\": 2, \\\"name\\\": \\\"Бауыржан\\\"}");\n        System.out.println("  ],");\n        System.out.println("  \\\"pagination\\\": {");\n        System.out.println("    \\\"page\\\": 1,");\n        System.out.println("    \\\"size\\\": 20,");\n        System.out.println("    \\\"totalElements\\\": 150,");\n        System.out.println("    \\\"totalPages\\\": 8,");\n        System.out.println("    \\\"hasNext\\\": true");\n        System.out.println("  }");\n        System.out.println("}");\n\n        // Вариант 3: Cursor pagination (Stripe стиль)\n        System.out.println("\\n=== Вариант 3: Cursor ===");\n        System.out.println("GET /api/users?limit=20&after=usr_abc");\n        System.out.println("{");\n        System.out.println("  \\\"data\\\": [...],");\n        System.out.println("  \\\"hasMore\\\": true,");\n        System.out.println("  \\\"nextCursor\\\": \\\"usr_xyz\\\"");\n        System.out.println("}");\n    }\n}' },
        { type: 'heading', value: 'Пустая коллекция' },
        { type: 'text', value: 'Пустая коллекция — это НЕ ошибка. Возвращайте 200 OK с пустым массивом, а не 404 Not Found.' },
        { type: 'code', language: 'java', value: '// ПРАВИЛЬНО: пустой массив = нет результатов\n// GET /api/users?city=Tokio -> 200 OK\n// {"data": [], "pagination": {"totalElements": 0}}\n\n// НЕПРАВИЛЬНО: 404 для пустого списка\n// GET /api/users?city=Tokio -> 404 Not Found\n// Это ошибка! 404 — ресурс не существует, а /api/users существует' },
        { type: 'warning', value: 'Частая ошибка: возвращать 404 для пустого списка. 404 означает "ресурс /api/users не существует", а не "список пуст". Пустой результат — это 200 OK с пустым массивом.' }
      ]
    },
    {
      id: 4,
      title: 'DTO паттерн',
      type: 'theory',
      content: [
        { type: 'text', value: 'DTO (Data Transfer Object) — это объект для передачи данных между клиентом и сервером. DTO отделяет внутреннюю модель от внешнего API.' },
        { type: 'heading', value: 'Зачем нужен DTO?' },
        { type: 'list', items: [
          'Безопасность — не раскрывать внутренние поля (password, salt)',
          'Гибкость — разные DTO для создания и чтения',
          'Версионирование — можно менять внутреннюю модель без изменения API',
          'Валидация — DTO содержит правила валидации',
          'Оптимизация — не передавать ненужные поля'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    // Внутренняя модель (Entity) — все поля\n    static Map<String, Object> userEntity() {\n        Map<String, Object> entity = new LinkedHashMap<>();\n        entity.put("id", 42);\n        entity.put("name", "Алия");\n        entity.put("email", "aliya@mail.kz");\n        entity.put("passwordHash", "$2a$10$xyz...");\n        entity.put("salt", "random_salt");\n        entity.put("internalNotes", "VIP клиент");\n        entity.put("createdAt", "2024-01-15T10:30:00Z");\n        entity.put("updatedAt", "2024-06-20T14:00:00Z");\n        return entity;\n    }\n\n    // CreateUserRequest DTO — что клиент отправляет при создании\n    static Map<String, Object> createUserDto() {\n        Map<String, Object> dto = new LinkedHashMap<>();\n        dto.put("name", "Алия");\n        dto.put("email", "aliya@mail.kz");\n        dto.put("password", "secret123");\n        return dto;\n    }\n\n    // UserResponse DTO — что клиент получает\n    static Map<String, Object> userResponseDto(Map<String, Object> entity) {\n        Map<String, Object> dto = new LinkedHashMap<>();\n        dto.put("id", entity.get("id"));\n        dto.put("name", entity.get("name"));\n        dto.put("email", entity.get("email"));\n        dto.put("createdAt", entity.get("createdAt"));\n        // НЕ включаем: passwordHash, salt, internalNotes!\n        return dto;\n    }\n\n    // UserListItem DTO — краткий формат для списка\n    static Map<String, Object> userListDto(Map<String, Object> entity) {\n        Map<String, Object> dto = new LinkedHashMap<>();\n        dto.put("id", entity.get("id"));\n        dto.put("name", entity.get("name"));\n        return dto;\n    }\n\n    public static void main(String[] args) {\n        Map<String, Object> entity = userEntity();\n\n        System.out.println("=== Entity (внутренняя модель) ===");\n        System.out.println(entity);\n\n        System.out.println("\\n=== CreateUserRequest DTO ===");\n        System.out.println(createUserDto());\n\n        System.out.println("\\n=== UserResponse DTO ===");\n        System.out.println(userResponseDto(entity));\n\n        System.out.println("\\n=== UserListItem DTO ===");\n        System.out.println(userListDto(entity));\n\n        System.out.println("\\nВажно: passwordHash и salt НИКОГДА не попадают в ответ!");\n    }\n}' },
        { type: 'heading', value: 'Типы DTO' },
        { type: 'text', value: 'CreateUserRequest — для создания, UpdateUserRequest — для обновления, UserResponse — для ответа, UserListItem — для списка. Разные DTO для разных операций.' },
        { type: 'note', value: 'В Stripe API customer.create принимает {email, name, payment_method}, а возвращает полный объект с {id, created, livemode, ...}. Входные и выходные данные — это разные DTO.' }
      ]
    },
    {
      id: 5,
      title: 'Стандартизация формата ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Формат ошибок должен быть единым для всего API. Клиент должен знать, в каком формате придёт ошибка, чтобы корректно её обработать.' },
        { type: 'heading', value: 'Стандартный формат ошибки' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        // Простой формат\n        System.out.println("=== Простой формат ===");\n        System.out.println("{");\n        System.out.println("  \\\"error\\\": {");\n        System.out.println("    \\\"code\\\": \\\"VALIDATION_ERROR\\\",");\n        System.out.println("    \\\"message\\\": \\\"Ошибки валидации\\\",");\n        System.out.println("    \\\"details\\\": [");\n        System.out.println("      {\\\"field\\\": \\\"email\\\", \\\"message\\\": \\\"Невалидный email\\\"},");\n        System.out.println("      {\\\"field\\\": \\\"name\\\", \\\"message\\\": \\\"Обязательное поле\\\"}");\n        System.out.println("    ]");\n        System.out.println("  }");\n        System.out.println("}");\n\n        // RFC 7807 Problem Details\n        System.out.println("\\n=== RFC 7807 Problem Details ===");\n        System.out.println("{");\n        System.out.println("  \\\"type\\\": \\\"https://api.example.com/errors/validation\\\",");\n        System.out.println("  \\\"title\\\": \\\"Validation Error\\\",");\n        System.out.println("  \\\"status\\\": 422,");\n        System.out.println("  \\\"detail\\\": \\\"Тело запроса содержит ошибки валидации\\\",");\n        System.out.println("  \\\"instance\\\": \\\"/api/users\\\",");\n        System.out.println("  \\\"errors\\\": [");\n        System.out.println("    {\\\"field\\\": \\\"email\\\", \\\"message\\\": \\\"Невалидный формат\\\"}");\n        System.out.println("  ]");\n        System.out.println("}");\n\n        // Stripe стиль\n        System.out.println("\\n=== Stripe стиль ===");\n        System.out.println("{");\n        System.out.println("  \\\"error\\\": {");\n        System.out.println("    \\\"type\\\": \\\"card_error\\\",");\n        System.out.println("    \\\"code\\\": \\\"card_declined\\\",");\n        System.out.println("    \\\"message\\\": \\\"Карта отклонена\\\",");\n        System.out.println("    \\\"param\\\": \\\"source\\\"");\n        System.out.println("  }");\n        System.out.println("}");\n    }\n}' },
        { type: 'heading', value: 'Рекомендуемый формат' },
        { type: 'list', items: [
          'code — машиночитаемый код ошибки (VALIDATION_ERROR, NOT_FOUND)',
          'message — человекочитаемое описание на языке пользователя',
          'details — массив деталей (для валидации: поле + сообщение)',
          'traceId — ID запроса для корреляции с логами'
        ]},
        { type: 'warning', value: 'Не изобретайте свои статус-коды внутри JSON! {\"status\": 200, \"errorCode\": 42} — антипаттерн. Используйте HTTP статус-коды. Они для этого и созданы.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Форматирование ответов API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте систему форматирования ответов API с поддержкой успешных ответов, ошибок и пагинации.',
      requirements: [
        'Создайте метод success(data) для одиночного ресурса',
        'Создайте метод successList(data, page, size, total) для коллекции с пагинацией',
        'Создайте метод error(code, message, details) для ошибок',
        'Создайте метод validationError(fieldErrors) для ошибок валидации',
        'Все методы возвращают форматированную JSON строку',
        'Продемонстрируйте все форматы'
      ],
      expectedOutput: '=== 200 OK: Один ресурс ===\n{"id":1,"name":"Алия","email":"aliya@mail.kz"}\n\n=== 200 OK: Коллекция ===\n{"data":[{"id":1,"name":"Алия"},{"id":2,"name":"Бауыржан"}],"pagination":{"page":1,"size":20,"totalElements":2,"totalPages":1}}\n\n=== 404 Error ===\n{"error":{"code":"NOT_FOUND","message":"Пользователь не найден"}}\n\n=== 422 Validation Error ===\n{"error":{"code":"VALIDATION_ERROR","message":"Ошибки валидации","details":[{"field":"email","message":"Невалидный email"}]}}',
      hint: 'Используйте StringBuilder для построения JSON. Или создайте вспомогательные методы jsonObject() и jsonArray().',
      solution: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Одиночный ресурс\n        System.out.println("=== 200 OK: Один ресурс ===");\n        Map<String, Object> user = new LinkedHashMap<>();\n        user.put("id", 1);\n        user.put("name", "Алия");\n        user.put("email", "aliya@mail.kz");\n        System.out.println(toJson(user));\n\n        // Коллекция с пагинацией\n        System.out.println("\\n=== 200 OK: Коллекция ===");\n        List<Map<String, Object>> users = new ArrayList<>();\n        Map<String, Object> u1 = new LinkedHashMap<>();\n        u1.put("id", 1); u1.put("name", "Алия");\n        Map<String, Object> u2 = new LinkedHashMap<>();\n        u2.put("id", 2); u2.put("name", "Бауыржан");\n        users.add(u1); users.add(u2);\n        System.out.println(successList(users, 1, 20, 2));\n\n        // Ошибка 404\n        System.out.println("\\n=== 404 Error ===");\n        System.out.println(error("NOT_FOUND", "Пользователь не найден", null));\n\n        // Ошибка валидации\n        System.out.println("\\n=== 422 Validation Error ===");\n        List<Map<String, String>> fieldErrors = new ArrayList<>();\n        Map<String, String> e1 = new LinkedHashMap<>();\n        e1.put("field", "email"); e1.put("message", "Невалидный email");\n        fieldErrors.add(e1);\n        System.out.println(validationError(fieldErrors));\n    }\n\n    static String successList(List<Map<String, Object>> data, int page, int size, int total) {\n        Map<String, Object> pagination = new LinkedHashMap<>();\n        pagination.put("page", page);\n        pagination.put("size", size);\n        pagination.put("totalElements", total);\n        pagination.put("totalPages", (int) Math.ceil((double) total / size));\n\n        Map<String, Object> response = new LinkedHashMap<>();\n        response.put("data", data);\n        response.put("pagination", pagination);\n        return toJson(response);\n    }\n\n    static String error(String code, String message, List<Map<String, String>> details) {\n        Map<String, Object> err = new LinkedHashMap<>();\n        err.put("code", code);\n        err.put("message", message);\n        if (details != null) err.put("details", details);\n\n        Map<String, Object> response = new LinkedHashMap<>();\n        response.put("error", err);\n        return toJson(response);\n    }\n\n    static String validationError(List<Map<String, String>> fieldErrors) {\n        return error("VALIDATION_ERROR", "Ошибки валидации", fieldErrors);\n    }\n\n    @SuppressWarnings("unchecked")\n    static String toJson(Object obj) {\n        if (obj == null) return "null";\n        if (obj instanceof String) return "\\\"" + obj + "\\\"";\n        if (obj instanceof Number || obj instanceof Boolean) return obj.toString();\n        if (obj instanceof Map) {\n            Map<String, Object> map = (Map<String, Object>) obj;\n            StringBuilder sb = new StringBuilder("{");\n            int i = 0;\n            for (Map.Entry<String, Object> entry : map.entrySet()) {\n                if (i > 0) sb.append(",");\n                sb.append("\\\"").append(entry.getKey()).append("\\\":").append(toJson(entry.getValue()));\n                i++;\n            }\n            return sb.append("}").toString();\n        }\n        if (obj instanceof List) {\n            List<?> list = (List<?>) obj;\n            StringBuilder sb = new StringBuilder("[");\n            for (int i = 0; i < list.size(); i++) {\n                if (i > 0) sb.append(",");\n                sb.append(toJson(list.get(i)));\n            }\n            return sb.append("]").toString();\n        }\n        return obj.toString();\n    }\n}',
      explanation: 'Стандартизация формата ответов — критически важна. Клиент API должен знать, что успешный ответ для коллекции содержит data[] и pagination{}, а ошибка — error{code, message, details[]}. Единый формат позволяет написать один обработчик ошибок на клиенте, который работает для всех endpoints.'
    },
    {
      id: 7,
      title: 'Практика: DTO маппинг',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему DTO с маппингом Entity -> DTO и DTO -> Entity для User ресурса.',
      requirements: [
        'Создайте UserEntity с полями: id, name, email, passwordHash, role, isActive, createdAt',
        'Создайте CreateUserRequest с полями: name, email, password',
        'Создайте UpdateUserRequest с полями: name, email (опциональные)',
        'Создайте UserResponse без passwordHash',
        'Создайте UserListItem только с id и name',
        'Реализуйте методы маппинга между ними'
      ],
      expectedOutput: 'CreateUserRequest: {name=Дана, email=dana@mail.kz, password=secret}\n-> Entity: {id=1, name=Дана, email=dana@mail.kz, passwordHash=hashed_secret, role=USER, isActive=true}\n-> UserResponse: {id=1, name=Дана, email=dana@mail.kz, role=USER, createdAt=2024-01-15}\n-> UserListItem: {id=1, name=Дана}\n\nUpdateUserRequest: {name=Дана Серикова}\n-> Entity after update: {id=1, name=Дана Серикова, email=dana@mail.kz}',
      hint: 'Каждый DTO — это Map<String, Object> с определённым набором полей. Маппинг — это копирование нужных полей из одного Map в другой.',
      solution: 'import java.util.*;\n\npublic class Main {\n    static int nextId = 1;\n\n    public static void main(String[] args) {\n        // 1. CreateUserRequest -> Entity\n        Map<String, Object> createReq = new LinkedHashMap<>();\n        createReq.put("name", "Дана");\n        createReq.put("email", "dana@mail.kz");\n        createReq.put("password", "secret");\n        System.out.println("CreateUserRequest: " + createReq);\n\n        Map<String, Object> entity = toEntity(createReq);\n        System.out.println("-> Entity: " + entity);\n\n        // 2. Entity -> UserResponse\n        Map<String, Object> response = toResponse(entity);\n        System.out.println("-> UserResponse: " + response);\n\n        // 3. Entity -> UserListItem\n        Map<String, Object> listItem = toListItem(entity);\n        System.out.println("-> UserListItem: " + listItem);\n\n        // 4. UpdateUserRequest -> patch Entity\n        System.out.println();\n        Map<String, Object> updateReq = new LinkedHashMap<>();\n        updateReq.put("name", "Дана Серикова");\n        System.out.println("UpdateUserRequest: " + updateReq);\n\n        applyUpdate(entity, updateReq);\n        System.out.println("-> Entity after update: " + toResponse(entity));\n    }\n\n    static Map<String, Object> toEntity(Map<String, Object> createReq) {\n        Map<String, Object> entity = new LinkedHashMap<>();\n        entity.put("id", nextId++);\n        entity.put("name", createReq.get("name"));\n        entity.put("email", createReq.get("email"));\n        entity.put("passwordHash", "hashed_" + createReq.get("password"));\n        entity.put("role", "USER");\n        entity.put("isActive", true);\n        entity.put("createdAt", "2024-01-15");\n        return entity;\n    }\n\n    static Map<String, Object> toResponse(Map<String, Object> entity) {\n        Map<String, Object> dto = new LinkedHashMap<>();\n        dto.put("id", entity.get("id"));\n        dto.put("name", entity.get("name"));\n        dto.put("email", entity.get("email"));\n        dto.put("role", entity.get("role"));\n        dto.put("createdAt", entity.get("createdAt"));\n        // passwordHash НЕ включаем!\n        return dto;\n    }\n\n    static Map<String, Object> toListItem(Map<String, Object> entity) {\n        Map<String, Object> dto = new LinkedHashMap<>();\n        dto.put("id", entity.get("id"));\n        dto.put("name", entity.get("name"));\n        return dto;\n    }\n\n    static void applyUpdate(Map<String, Object> entity, Map<String, Object> updateReq) {\n        for (Map.Entry<String, Object> entry : updateReq.entrySet()) {\n            if (entry.getValue() != null) {\n                entity.put(entry.getKey(), entry.getValue());\n            }\n        }\n    }\n}',
      explanation: 'DTO маппинг — обязательный паттерн в REST API. Entity содержит ВСЕ поля, включая чувствительные (passwordHash). CreateUserRequest принимает password (не hash). UserResponse НЕ содержит passwordHash. UserListItem содержит только id и name для оптимизации списков. В реальном проекте используют MapStruct или ModelMapper для автоматического маппинга.'
    }
  ]
}
