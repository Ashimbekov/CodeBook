export default {
  id: 10,
  title: 'OpenAPI / Swagger',
  description: 'OpenAPI спецификация: описание API, документирование endpoints, схемы данных, генерация клиентов и серверов.',
  lessons: [
    {
      id: 1,
      title: 'Что такое OpenAPI',
      type: 'theory',
      content: [
        { type: 'text', value: 'OpenAPI Specification (OAS) — стандарт для описания REST API. Это YAML/JSON файл, который определяет endpoints, параметры, тела запросов, ответы и схемы данных. Swagger — набор инструментов для работы с OpenAPI.' },
        { type: 'heading', value: 'Зачем нужен OpenAPI' },
        { type: 'list', items: [
          'Документация — автоматическая генерация интерактивной документации (Swagger UI)',
          'Контракт — frontend и backend разрабатывают параллельно по спецификации',
          'Генерация кода — автоматическое создание клиентов и серверных заглушек',
          'Валидация — проверка запросов/ответов на соответствие спецификации',
          'Тестирование — автоматическое создание тестов по спецификации'
        ]},
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        // Минимальный OpenAPI документ (YAML формат)\n        System.out.println("=== OpenAPI 3.0 спецификация ===");\n        System.out.println("openapi: 3.0.3");\n        System.out.println("info:");\n        System.out.println("  title: User Management API");\n        System.out.println("  description: API для управления пользователями");\n        System.out.println("  version: 1.0.0");\n        System.out.println("  contact:");\n        System.out.println("    name: API Support");\n        System.out.println("    email: support@example.com");\n        System.out.println("servers:");\n        System.out.println("  - url: https://api.example.com/v1");\n        System.out.println("    description: Production");\n        System.out.println("  - url: https://staging-api.example.com/v1");\n        System.out.println("    description: Staging");\n        System.out.println("paths:");\n        System.out.println("  /users:");\n        System.out.println("    get:");\n        System.out.println("      summary: Получить список пользователей");\n        System.out.println("      operationId: getUsers");\n        System.out.println("      responses:");\n        System.out.println("        \\\"200\\\":");\n        System.out.println("          description: Список пользователей");\n        System.out.println("    post:");\n        System.out.println("      summary: Создать пользователя");\n        System.out.println("      operationId: createUser");\n        System.out.println("      responses:");\n        System.out.println("        \\\"201\\\":");\n        System.out.println("          description: Пользователь создан");\n    }\n}' },
        { type: 'heading', value: 'Swagger vs OpenAPI' },
        { type: 'text', value: 'OpenAPI — это спецификация (стандарт). Swagger — это набор инструментов: Swagger UI (визуальная документация), Swagger Editor (редактор), Swagger Codegen (генерация кода). С версии 3.0 стандарт называется OpenAPI, но термин "Swagger" по-прежнему используется.' },
        { type: 'tip', value: 'Совет: начинайте проектирование API со спецификации (API-first подход). Опишите endpoints в OpenAPI файле, согласуйте с командой, а потом реализуйте.' }
      ]
    },
    {
      id: 2,
      title: 'Описание Endpoints',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый endpoint в OpenAPI описывается в секции paths. Для каждого пути указываются HTTP методы, параметры, тело запроса и варианты ответов.' },
        { type: 'heading', value: 'Описание CRUD для /users' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("=== OpenAPI Paths ===\\n");\n\n        // GET /users\n        printEndpoint("GET", "/users",\n            "Получить список пользователей",\n            "parameters:\\n" +\n            "  - name: page\\n    in: query\\n    schema: {type: integer, default: 1}\\n" +\n            "  - name: size\\n    in: query\\n    schema: {type: integer, default: 20}\\n" +\n            "  - name: sort\\n    in: query\\n    schema: {type: string, enum: [name, -name, created]}",\n            "200: {description: Список пользователей, content: [User]}\\n" +\n            "401: {description: Не авторизован}");\n\n        // GET /users/{id}\n        printEndpoint("GET", "/users/{id}",\n            "Получить пользователя по ID",\n            "parameters:\\n" +\n            "  - name: id\\n    in: path\\n    required: true\\n    schema: {type: integer}",\n            "200: {description: Пользователь найден, content: User}\\n" +\n            "404: {description: Пользователь не найден}");\n\n        // POST /users\n        printEndpoint("POST", "/users",\n            "Создать нового пользователя",\n            "requestBody:\\n" +\n            "  required: true\\n  content: application/json\\n  schema: CreateUserRequest",\n            "201: {description: Создан, headers: {Location: /users/{id}}}\\n" +\n            "422: {description: Ошибка валидации}");\n\n        // DELETE /users/{id}\n        printEndpoint("DELETE", "/users/{id}",\n            "Удалить пользователя",\n            "parameters:\\n  - name: id\\n    in: path\\n    required: true",\n            "204: {description: Удалён}\\n" +\n            "404: {description: Не найден}");\n    }\n\n    static void printEndpoint(String method, String path,\n                              String summary, String params, String responses) {\n        System.out.println(method + " " + path);\n        System.out.println("  summary: " + summary);\n        System.out.println("  " + params.replace("\\n", "\\n  "));\n        System.out.println("  responses:");\n        System.out.println("    " + responses.replace("\\n", "\\n    "));\n        System.out.println();\n    }\n}' },
        { type: 'heading', value: 'Типы параметров' },
        { type: 'list', items: [
          'path — в URL пути: /users/{id} (required: true всегда)',
          'query — в строке запроса: /users?page=1&size=20',
          'header — в заголовке: X-Request-Id, Authorization',
          'cookie — в cookie: session_id'
        ]},
        { type: 'note', value: 'operationId — уникальное имя для каждого endpoint (getUsers, createUser). Из него генерируются имена методов в клиентских SDK. Выбирайте понятные имена!' }
      ]
    },
    {
      id: 3,
      title: 'Схемы данных (Components)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Схемы данных описываются в секции components/schemas. Это определение типов: поля, типы данных, ограничения, примеры. Схемы переиспользуются через $ref.' },
        { type: 'heading', value: 'Описание схем' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("=== components/schemas ===\\n");\n\n        // User\n        System.out.println("User:");\n        System.out.println("  type: object");\n        System.out.println("  properties:");\n        System.out.println("    id: {type: integer, readOnly: true, example: 42}");\n        System.out.println("    name: {type: string, minLength: 2, maxLength: 100, example: Алия}");\n        System.out.println("    email: {type: string, format: email, example: aliya@mail.kz}");\n        System.out.println("    role: {type: string, enum: [USER, ADMIN, MODERATOR]}");\n        System.out.println("    createdAt: {type: string, format: date-time}");\n        System.out.println("  required: [name, email]\\n");\n\n        // CreateUserRequest (без id и readOnly полей)\n        System.out.println("CreateUserRequest:");\n        System.out.println("  type: object");\n        System.out.println("  properties:");\n        System.out.println("    name: {type: string, minLength: 2, maxLength: 100}");\n        System.out.println("    email: {type: string, format: email}");\n        System.out.println("    password: {type: string, minLength: 8, format: password}");\n        System.out.println("  required: [name, email, password]\\n");\n\n        // Страничный ответ\n        System.out.println("UserListResponse:");\n        System.out.println("  type: object");\n        System.out.println("  properties:");\n        System.out.println("    data: {type: array, items: {$ref: \\\"#/components/schemas/User\\\"}}");\n        System.out.println("    pagination:");\n        System.out.println("      type: object");\n        System.out.println("      properties:");\n        System.out.println("        page: {type: integer, example: 1}");\n        System.out.println("        size: {type: integer, example: 20}");\n        System.out.println("        totalPages: {type: integer, example: 5}");\n        System.out.println("        totalElements: {type: integer, example: 95}");\n    }\n}' },
        { type: 'heading', value: 'Типы данных OpenAPI' },
        { type: 'list', items: [
          'string — строка (format: email, date-time, uuid, password, uri)',
          'integer — целое число (format: int32, int64)',
          'number — число с плавающей точкой (format: float, double)',
          'boolean — true/false',
          'array — массив (items: {type: ...})',
          'object — объект (properties: {...})'
        ]},
        { type: 'tip', value: '$ref — ключевая фича OpenAPI. Вместо дублирования схемы User в каждом endpoint, описываете её один раз и ссылаетесь: {$ref: "#/components/schemas/User"}.' }
      ]
    },
    {
      id: 4,
      title: 'API-first подход',
      type: 'theory',
      content: [
        { type: 'text', value: 'API-first — это подход, при котором сначала проектируется спецификация API (OpenAPI), а потом реализуется код. Это противоположность code-first, где сначала пишется код, а документация генерируется из аннотаций.' },
        { type: 'heading', value: 'API-first vs Code-first' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        // API-first подход\n        System.out.println("=== API-first ===");\n        System.out.println("1. Проектируем OpenAPI спецификацию");\n        System.out.println("2. Согласуем с frontend, mobile, QA");\n        System.out.println("3. Генерируем серверный код (заглушки)");\n        System.out.println("4. Генерируем клиентские SDK");\n        System.out.println("5. Frontend начинает работу с mock сервером");\n        System.out.println("6. Backend реализует бизнес-логику");\n        System.out.println("7. Тестируем на соответствие спецификации");\n        System.out.println("Итого: параллельная разработка!\\n");\n\n        // Code-first подход\n        System.out.println("=== Code-first ===");\n        System.out.println("1. Backend пишет код");\n        System.out.println("2. Добавляет аннотации (@Operation, @Schema)");\n        System.out.println("3. Генерирует OpenAPI из кода (springdoc)");\n        System.out.println("4. Frontend получает документацию");\n        System.out.println("5. Frontend начинает интеграцию");\n        System.out.println("Проблема: frontend ждёт backend!\\n");\n\n        // Инструменты\n        System.out.println("=== Инструменты ===");\n        System.out.println("Swagger Editor   — веб-редактор OpenAPI");\n        System.out.println("Swagger UI       — интерактивная документация");\n        System.out.println("Swagger Codegen  — генерация кода");\n        System.out.println("Stoplight Studio — визуальный редактор");\n        System.out.println("Prism            — mock сервер по OpenAPI");\n        System.out.println("springdoc        — OpenAPI для Spring Boot");\n    }\n}' },
        { type: 'heading', value: 'Когда какой подход' },
        { type: 'list', items: [
          'API-first — когда несколько команд или клиентов (mobile, web, partners)',
          'API-first — когда API является продуктом (Stripe, Twilio)',
          'Code-first — для внутренних API, небольших проектов, быстрого прототипирования',
          'Гибридный — начните с API-first, потом поддерживайте из кода'
        ]},
        { type: 'warning', value: 'API-first не означает "больше работы". Это означает "меньше переделок". Без согласованной спецификации frontend и backend часто расходятся, и интеграция становится болезненной.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Генератор OpenAPI',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите программу, которая генерирует OpenAPI спецификацию для заданного набора endpoints.',
      requirements: [
        'Создайте класс, который моделирует OpenAPI компоненты: EndpointSpec (method, path, summary, params, responseCode)',
        'Зарегистрируйте 5 endpoints: CRUD для /products + GET /products/{id}/reviews',
        'Сгенерируйте YAML-подобный вывод с секциями info, paths, components',
        'Для каждого endpoint покажите метод, параметры, коды ответов',
        'Добавьте описание схемы Product (id, name, price, category)'
      ],
      expectedOutput: 'openapi: 3.0.3\ninfo:\n  title: Product API\n  version: 1.0.0\npaths:\n  GET /products -> 200: Список продуктов\n  POST /products -> 201: Продукт создан\n  GET /products/{id} -> 200: Продукт найден\n  PUT /products/{id} -> 200: Продукт обновлён\n  DELETE /products/{id} -> 204: Продукт удалён\n  GET /products/{id}/reviews -> 200: Отзывы продукта\ncomponents:\n  Product: {id: integer, name: string, price: number, category: string}',
      hint: 'Создайте список объектов EndpointSpec и выведите их в формате OpenAPI. Для схемы используйте Map<String, String> с типами полей.',
      solution: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Регистрация endpoints\n        List<String[]> endpoints = new ArrayList<>();\n        endpoints.add(new String[]{"GET", "/products", "Список продуктов", "200"});\n        endpoints.add(new String[]{"POST", "/products", "Продукт создан", "201"});\n        endpoints.add(new String[]{"GET", "/products/{id}", "Продукт найден", "200"});\n        endpoints.add(new String[]{"PUT", "/products/{id}", "Продукт обновлён", "200"});\n        endpoints.add(new String[]{"DELETE", "/products/{id}", "Продукт удалён", "204"});\n        endpoints.add(new String[]{"GET", "/products/{id}/reviews", "Отзывы продукта", "200"});\n\n        // Генерация OpenAPI\n        System.out.println("openapi: 3.0.3");\n        System.out.println("info:");\n        System.out.println("  title: Product API");\n        System.out.println("  version: 1.0.0");\n\n        System.out.println("paths:");\n        for (String[] ep : endpoints) {\n            System.out.println("  " + ep[0] + " " + ep[1]\n                + " -> " + ep[3] + ": " + ep[2]);\n        }\n\n        // Схема\n        System.out.println("components:");\n        Map<String, String> schema = new LinkedHashMap<>();\n        schema.put("id", "integer");\n        schema.put("name", "string");\n        schema.put("price", "number");\n        schema.put("category", "string");\n\n        StringBuilder sb = new StringBuilder("  Product: {");\n        int i = 0;\n        for (Map.Entry<String, String> field : schema.entrySet()) {\n            sb.append(field.getKey()).append(": ").append(field.getValue());\n            if (++i < schema.size()) sb.append(", ");\n        }\n        sb.append("}");\n        System.out.println(sb);\n    }\n}',
      explanation: 'OpenAPI спецификация описывает API формально: endpoints, параметры, схемы данных. Мы создали упрощённый генератор, который выводит основные секции: info (метаданные), paths (endpoints с методами и ответами), components (схемы). В реальных проектах используют Swagger Editor или springdoc для генерации полного OpenAPI документа.'
    },
    {
      id: 6,
      title: 'Практика: Валидатор по схеме',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте валидатор, который проверяет JSON-объект на соответствие OpenAPI-подобной схеме.',
      requirements: [
        'Определите схему как Map: поле -> {type, required, minLength, maxLength, minimum, maximum}',
        'Реализуйте валидацию типов: string, integer, number, boolean',
        'Проверяйте required, minLength, maxLength, minimum, maximum',
        'Соберите все ошибки и выведите их',
        'Протестируйте на 3 примерах: валидный, невалидные типы, нарушение ограничений'
      ],
      expectedOutput: '=== Тест 1: Валидный объект ===\nРезультат: VALID\n\n=== Тест 2: Невалидные типы ===\nname: TYPE_MISMATCH — Ожидается string, получен integer\nprice: TYPE_MISMATCH — Ожидается number, получен string\n\n=== Тест 3: Нарушение ограничений ===\nname: TOO_SHORT — Минимум 2 символов (получено 1)\nprice: TOO_SMALL — Минимум 0.01 (получено -5.0)\ncategory: REQUIRED — Поле обязательно',
      hint: 'Храните правила в Map<String, Map<String, Object>>. Для каждого поля проверяйте тип через instanceof, затем ограничения.',
      solution: 'import java.util.*;\n\npublic class Main {\n    // Схема: поле -> правила\n    static Map<String, Map<String, Object>> schema = new LinkedHashMap<>();\n    static {\n        schema.put("name", Map.of("type", "string", "required", true,\n            "minLength", 2, "maxLength", 50));\n        schema.put("price", Map.of("type", "number", "required", true,\n            "minimum", 0.01));\n        schema.put("category", Map.of("type", "string", "required", true));\n        schema.put("inStock", Map.of("type", "boolean", "required", false));\n    }\n\n    public static void main(String[] args) {\n        // Тест 1: Валидный\n        System.out.println("=== Тест 1: Валидный объект ===");\n        Map<String, Object> valid = Map.of(\n            "name", "iPhone", "price", 999.99,\n            "category", "Электроника", "inStock", true);\n        validate(valid);\n\n        // Тест 2: Неверные типы\n        System.out.println("\\n=== Тест 2: Невалидные типы ===");\n        Map<String, Object> badTypes = Map.of(\n            "name", 123, "price", "дорого", "category", "OK");\n        validate(badTypes);\n\n        // Тест 3: Нарушение ограничений\n        System.out.println("\\n=== Тест 3: Нарушение ограничений ===");\n        Map<String, Object> badValues = new HashMap<>();\n        badValues.put("name", "A");\n        badValues.put("price", -5.0);\n        badValues.put("category", null);\n        validate(badValues);\n    }\n\n    static void validate(Map<String, Object> obj) {\n        List<String> errors = new ArrayList<>();\n\n        for (Map.Entry<String, Map<String, Object>> entry : schema.entrySet()) {\n            String field = entry.getKey();\n            Map<String, Object> rules = entry.getValue();\n            Object value = obj.get(field);\n            boolean required = (boolean) rules.getOrDefault("required", false);\n\n            if (value == null) {\n                if (required) errors.add(field + ": REQUIRED — Поле обязательно");\n                continue;\n            }\n\n            String expectedType = (String) rules.get("type");\n            if (!checkType(value, expectedType)) {\n                errors.add(field + ": TYPE_MISMATCH — Ожидается " + expectedType\n                    + ", получен " + getType(value));\n                continue;\n            }\n\n            if ("string".equals(expectedType)) {\n                String s = (String) value;\n                if (rules.containsKey("minLength") && s.length() < (int) rules.get("minLength")) {\n                    errors.add(field + ": TOO_SHORT — Минимум " + rules.get("minLength")\n                        + " символов (получено " + s.length() + ")");\n                }\n                if (rules.containsKey("maxLength") && s.length() > (int) rules.get("maxLength")) {\n                    errors.add(field + ": TOO_LONG — Максимум " + rules.get("maxLength")\n                        + " символов (получено " + s.length() + ")");\n                }\n            }\n\n            if ("number".equals(expectedType) || "integer".equals(expectedType)) {\n                double num = ((Number) value).doubleValue();\n                if (rules.containsKey("minimum") && num < ((Number) rules.get("minimum")).doubleValue()) {\n                    errors.add(field + ": TOO_SMALL — Минимум " + rules.get("minimum")\n                        + " (получено " + num + ")");\n                }\n                if (rules.containsKey("maximum") && num > ((Number) rules.get("maximum")).doubleValue()) {\n                    errors.add(field + ": TOO_LARGE — Максимум " + rules.get("maximum")\n                        + " (получено " + num + ")");\n                }\n            }\n        }\n\n        if (errors.isEmpty()) {\n            System.out.println("Результат: VALID");\n        } else {\n            for (String e : errors) System.out.println(e);\n        }\n    }\n\n    static boolean checkType(Object value, String type) {\n        switch (type) {\n            case "string": return value instanceof String;\n            case "integer": return value instanceof Integer || value instanceof Long;\n            case "number": return value instanceof Number;\n            case "boolean": return value instanceof Boolean;\n            default: return true;\n        }\n    }\n\n    static String getType(Object value) {\n        if (value instanceof String) return "string";\n        if (value instanceof Integer || value instanceof Long) return "integer";\n        if (value instanceof Number) return "number";\n        if (value instanceof Boolean) return "boolean";\n        return value.getClass().getSimpleName();\n    }\n}',
      explanation: 'OpenAPI схемы описывают структуру данных: типы, ограничения, обязательность. Валидатор проверяет входящие данные на соответствие схеме. В реальных проектах используют библиотеки (json-schema-validator, Hibernate Validator), но принцип тот же: итерация по правилам, проверка типа, затем ограничений, сбор всех ошибок.'
    }
  ]
}
