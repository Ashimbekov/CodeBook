export default {
  id: 9,
  title: 'Обработка ошибок',
  description: 'Стандартизация ошибок в REST API: формат ответа, коды ошибок, RFC 7807 Problem Details, валидация и глобальная обработка исключений.',
  lessons: [
    {
      id: 1,
      title: 'Зачем стандартизировать ошибки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хороший API понятен не только когда всё работает, но и когда что-то идёт не так. Стандартизированный формат ошибок позволяет клиенту автоматически обрабатывать любые сбои.' },
        { type: 'heading', value: 'Плохой vs Хороший ответ об ошибке' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        // Плохо: непонятный формат, нет деталей\n        System.out.println("=== Плохой ответ ===");\n        System.out.println("500 Internal Server Error");\n        System.out.println("{\\\"error\\\": true}");\n        System.out.println("Клиент: что случилось? Что делать?\\n");\n\n        // Плохо: HTML вместо JSON\n        System.out.println("=== Ещё хуже ===");\n        System.out.println("500 Internal Server Error");\n        System.out.println("<html><body>Something went wrong</body></html>");\n        System.out.println("Клиент: не могу распарсить!\\n");\n\n        // Хорошо: структурированный формат\n        System.out.println("=== Хороший ответ ===");\n        System.out.println("422 Unprocessable Entity");\n        System.out.println("{");\n        System.out.println("  \\\"error\\\": {");\n        System.out.println("    \\\"code\\\": \\\"VALIDATION_ERROR\\\",");\n        System.out.println("    \\\"message\\\": \\\"Невалидные данные\\\",");\n        System.out.println("    \\\"details\\\": [");\n        System.out.println("      {\\\"field\\\": \\\"email\\\", \\\"message\\\": \\\"Невалидный формат email\\\"},");\n        System.out.println("      {\\\"field\\\": \\\"age\\\", \\\"message\\\": \\\"Должно быть >= 18\\\"}");\n        System.out.println("    ]");\n        System.out.println("  }");\n        System.out.println("}");\n        System.out.println("Клиент: понятно, покажу ошибки у каждого поля!");\n    }\n}' },
        { type: 'heading', value: 'Принципы хорошей обработки ошибок' },
        { type: 'list', items: [
          'Единый формат для всех ошибок (JSON, не HTML)',
          'Правильный HTTP статус-код (4xx для клиентских, 5xx для серверных)',
          'Машиночитаемый код ошибки (VALIDATION_ERROR, NOT_FOUND)',
          'Человекочитаемое описание (что произошло и что делать)',
          'Детали для конкретных полей (при валидации)',
          'Уникальный request ID для отладки'
        ]},
        { type: 'tip', value: 'Stripe, GitHub, Google — все крупные API используют единый формат ошибок. Это упрощает жизнь разработчикам: один обработчик ошибок для всех endpoints.' }
      ]
    },
    {
      id: 2,
      title: 'Формат ошибки API',
      type: 'theory',
      content: [
        { type: 'text', value: 'Единый формат ошибки должен быть предсказуемым. Клиент всегда знает, какие поля ожидать, и может написать универсальный обработчик.' },
        { type: 'heading', value: 'Стандартный формат ошибки' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Формат ошибки\n        System.out.println("=== Стандартный формат ===" );\n        printError(404, "NOT_FOUND", "Пользователь не найден",\n            "Пользователь с id=999 не существует", null);\n\n        System.out.println();\n\n        // Ошибка валидации с деталями по полям\n        List<String> details = Arrays.asList(\n            "{\\\"field\\\": \\\"email\\\", \\\"code\\\": \\\"INVALID_FORMAT\\\", \\\"message\\\": \\\"Некорректный email\\\"}",\n            "{\\\"field\\\": \\\"password\\\", \\\"code\\\": \\\"TOO_SHORT\\\", \\\"message\\\": \\\"Минимум 8 символов\\\"}",\n            "{\\\"field\\\": \\\"age\\\", \\\"code\\\": \\\"OUT_OF_RANGE\\\", \\\"message\\\": \\\"Должно быть от 18 до 120\\\"}"\n        );\n        printError(422, "VALIDATION_ERROR", "Ошибка валидации",\n            "Переданные данные не прошли проверку", details);\n\n        System.out.println();\n\n        // Серверная ошибка\n        printError(500, "INTERNAL_ERROR", "Внутренняя ошибка сервера",\n            "Произошла непредвиденная ошибка. Попробуйте позже.", null);\n    }\n\n    static void printError(int status, String code, String message,\n                           String detail, List<String> fieldErrors) {\n        System.out.println(status + ":");\n        System.out.println("{");\n        System.out.println("  \\\"error\\\": {");\n        System.out.println("    \\\"code\\\": \\\"" + code + "\\\",");\n        System.out.println("    \\\"message\\\": \\\"" + message + "\\\",");\n        System.out.println("    \\\"detail\\\": \\\"" + detail + "\\\",");\n        System.out.println("    \\\"requestId\\\": \\\"req-abc-123\\\",");\n        System.out.println("    \\\"timestamp\\\": \\\"2024-01-15T10:30:00Z\\\""\n            + (fieldErrors != null ? "," : ""));\n        if (fieldErrors != null) {\n            System.out.println("    \\\"fieldErrors\\\": [");\n            for (int i = 0; i < fieldErrors.size(); i++) {\n                System.out.println("      " + fieldErrors.get(i)\n                    + (i < fieldErrors.size() - 1 ? "," : ""));\n            }\n            System.out.println("    ]");\n        }\n        System.out.println("  }");\n        System.out.println("}");\n    }\n}' },
        { type: 'heading', value: 'Поля ошибки' },
        { type: 'list', items: [
          'code — машиночитаемый код (NOT_FOUND, VALIDATION_ERROR, UNAUTHORIZED)',
          'message — краткое описание для разработчика',
          'detail — подробности (что именно не найдено, почему невалидно)',
          'requestId — ID запроса для отладки в логах',
          'timestamp — время возникновения ошибки',
          'fieldErrors — массив ошибок по полям (для валидации)'
        ]},
        { type: 'note', value: 'GitHub API возвращает: {"message": "Not Found", "documentation_url": "..."}. Stripe: {"error": {"type": "card_error", "code": "card_declined", "message": "..."}}. Каждый API выбирает свой формат, но структура похожа.' }
      ]
    },
    {
      id: 3,
      title: 'RFC 7807 Problem Details',
      type: 'theory',
      content: [
        { type: 'text', value: 'RFC 7807 (обновлён в RFC 9457) — стандарт формата ошибок для HTTP API. Он определяет Content-Type: application/problem+json и набор обязательных полей.' },
        { type: 'heading', value: 'Поля Problem Details' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // RFC 7807 Problem Details формат\n        System.out.println("Content-Type: application/problem+json\\n");\n\n        System.out.println("=== Пример 1: Недостаточно средств ===");\n        printProblem(\n            "https://api.example.com/problems/insufficient-funds",\n            "Недостаточно средств на счёте",\n            403,\n            "На вашем счёте 500 KZT, но для операции требуется 1000 KZT.",\n            "/api/v1/transfers/42",\n            Map.of("balance", "500", "required", "1000", "currency", "KZT")\n        );\n\n        System.out.println();\n\n        System.out.println("=== Пример 2: Валидация ===");\n        printProblem(\n            "https://api.example.com/problems/validation-error",\n            "Данные не прошли валидацию",\n            422,\n            "Два поля содержат ошибки.",\n            "/api/v1/users",\n            Map.of("errors", "[{field: email, reason: invalid}, {field: age, reason: < 18}]")\n        );\n\n        System.out.println();\n\n        System.out.println("=== Пример 3: Rate Limit ===");\n        printProblem(\n            "https://api.example.com/problems/rate-limit-exceeded",\n            "Превышен лимит запросов",\n            429,\n            "Вы отправили 101 запрос за последнюю минуту (лимит: 100).",\n            "/api/v1/products",\n            Map.of("limit", "100", "window", "60s", "retryAfter", "30s")\n        );\n    }\n\n    static void printProblem(String type, String title, int status,\n                             String detail, String instance, Map<String, String> extra) {\n        System.out.println("{");\n        System.out.println("  \\\"type\\\": \\\"" + type + "\\\",");\n        System.out.println("  \\\"title\\\": \\\"" + title + "\\\",");\n        System.out.println("  \\\"status\\\": " + status + ",");\n        System.out.println("  \\\"detail\\\": \\\"" + detail + "\\\",");\n        System.out.println("  \\\"instance\\\": \\\"" + instance + "\\\",");\n        int i = 0;\n        for (Map.Entry<String, String> e : extra.entrySet()) {\n            i++;\n            System.out.println("  \\\"" + e.getKey() + "\\\": \\\"" + e.getValue() + "\\\""\n                + (i < extra.size() ? "," : ""));\n        }\n        System.out.println("}");\n    }\n}' },
        { type: 'heading', value: 'Стандартные поля RFC 7807' },
        { type: 'list', items: [
          'type — URI, описывающий тип проблемы (ссылка на документацию)',
          'title — краткое человекочитаемое описание типа проблемы',
          'status — HTTP статус-код (дублирует статус ответа)',
          'detail — описание конкретного случая проблемы',
          'instance — URI, идентифицирующий конкретный запрос'
        ]},
        { type: 'tip', value: 'RFC 7807 позволяет добавлять любые дополнительные поля (balance, retryAfter, errors). Главное — сохранять обязательные поля. Spring Boot 3+ поддерживает Problem Details из коробки.' }
      ]
    },
    {
      id: 4,
      title: 'Ошибки валидации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Валидация — самый частый источник ошибок в API. Хорошее API показывает ВСЕ ошибки разом, а не по одной. Это избавляет клиента от цикла "отправил → ошибка → исправил → отправил → другая ошибка".' },
        { type: 'heading', value: 'Валидатор с агрегацией ошибок' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Хороший подход: собираем ВСЕ ошибки\n        System.out.println("=== POST /api/users ===");\n        System.out.println("Тело: {name: \\\"\\\", email: \\\"bad\\\", age: 12, password: \\\"123\\\"}\\n");\n\n        Map<String, String> body = new LinkedHashMap<>();\n        body.put("name", "");\n        body.put("email", "bad");\n        body.put("age", "12");\n        body.put("password", "123");\n\n        List<Map<String, String>> errors = validateUser(body);\n\n        if (!errors.isEmpty()) {\n            System.out.println("422 Unprocessable Entity");\n            System.out.println("{");\n            System.out.println("  \\\"code\\\": \\\"VALIDATION_ERROR\\\",");\n            System.out.println("  \\\"message\\\": \\\"Ошибка валидации (" + errors.size() + " полей)\\\",");\n            System.out.println("  \\\"errors\\\": [");\n            for (int i = 0; i < errors.size(); i++) {\n                Map<String, String> e = errors.get(i);\n                System.out.println("    {\\\"field\\\": \\\"" + e.get("field")\n                    + "\\\", \\\"code\\\": \\\"" + e.get("code")\n                    + "\\\", \\\"message\\\": \\\"" + e.get("message") + "\\\"}"\n                    + (i < errors.size() - 1 ? "," : ""));\n            }\n            System.out.println("  ]");\n            System.out.println("}");\n        }\n\n        // Валидный запрос\n        System.out.println("\\n=== POST /api/users (валидные данные) ===");\n        body.clear();\n        body.put("name", "Алия");\n        body.put("email", "aliya@mail.kz");\n        body.put("age", "25");\n        body.put("password", "strongPass123");\n\n        errors = validateUser(body);\n        System.out.println(errors.isEmpty() ? "201 Created: OK" : "Errors: " + errors.size());\n    }\n\n    static List<Map<String, String>> validateUser(Map<String, String> body) {\n        List<Map<String, String>> errors = new ArrayList<>();\n\n        String name = body.getOrDefault("name", "");\n        if (name.isEmpty()) {\n            errors.add(fieldError("name", "REQUIRED", "Имя обязательно"));\n        } else if (name.length() < 2) {\n            errors.add(fieldError("name", "TOO_SHORT", "Минимум 2 символа"));\n        }\n\n        String email = body.getOrDefault("email", "");\n        if (email.isEmpty()) {\n            errors.add(fieldError("email", "REQUIRED", "Email обязателен"));\n        } else if (!email.contains("@") || !email.contains(".")) {\n            errors.add(fieldError("email", "INVALID_FORMAT", "Невалидный формат email"));\n        }\n\n        String ageStr = body.getOrDefault("age", "0");\n        int age = Integer.parseInt(ageStr);\n        if (age < 18) {\n            errors.add(fieldError("age", "MIN_VALUE", "Минимальный возраст: 18"));\n        } else if (age > 120) {\n            errors.add(fieldError("age", "MAX_VALUE", "Максимальный возраст: 120"));\n        }\n\n        String password = body.getOrDefault("password", "");\n        if (password.length() < 8) {\n            errors.add(fieldError("password", "TOO_SHORT", "Минимум 8 символов"));\n        }\n\n        return errors;\n    }\n\n    static Map<String, String> fieldError(String field, String code, String message) {\n        Map<String, String> error = new LinkedHashMap<>();\n        error.put("field", field);\n        error.put("code", code);\n        error.put("message", message);\n        return error;\n    }\n}' },
        { type: 'warning', value: 'Не возвращайте ошибки по одной! Если email и password невалидны — покажите обе ошибки сразу. Иначе пользователь будет исправлять и отправлять форму по кругу.' },
        { type: 'note', value: 'Stripe возвращает конкретную ошибку поля: {"param": "exp_month", "code": "invalid_expiry_month"}. GitHub: {"message": "Validation Failed", "errors": [{resource, field, code}]}.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Обработчик ошибок API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте универсальный обработчик ошибок API с поддержкой разных типов ошибок и формата RFC 7807.',
      requirements: [
        'Создайте класс ApiError с полями type, title, status, detail, instance',
        'Реализуйте фабричные методы: notFound(), badRequest(), unauthorized(), validationError()',
        'ValidationError должен содержать список fieldErrors',
        'Каждый метод принимает detail и формирует полный ответ',
        'Продемонстрируйте обработку 5 разных сценариев ошибок'
      ],
      expectedOutput: '=== 404 Not Found ===\n{"type":"about:blank","title":"Not Found","status":404,"detail":"Пользователь id=999 не найден","instance":"/api/users/999"}\n\n=== 400 Bad Request ===\n{"type":"about:blank","title":"Bad Request","status":400,"detail":"Невалидный JSON в теле запроса","instance":"/api/users"}\n\n=== 401 Unauthorized ===\n{"type":"about:blank","title":"Unauthorized","status":401,"detail":"Токен истёк","instance":"/api/orders"}\n\n=== 422 Validation Error ===\n{"type":"about:blank","title":"Unprocessable Entity","status":422,"detail":"2 ошибок валидации","instance":"/api/users","errors":[{"field":"email","message":"Невалидный формат"},{"field":"age","message":"Должно быть >= 18"}]}\n\n=== 500 Internal Error ===\n{"type":"about:blank","title":"Internal Server Error","status":500,"detail":"Непредвиденная ошибка","instance":"/api/payments"}',
      hint: 'Создайте базовый метод с общими полями и специализированные методы для каждого типа. Для валидации добавьте List<FieldError>.',
      solution: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("=== 404 Not Found ===");\n        System.out.println(buildError("about:blank", "Not Found", 404,\n            "Пользователь id=999 не найден", "/api/users/999", null));\n\n        System.out.println("\\n=== 400 Bad Request ===");\n        System.out.println(buildError("about:blank", "Bad Request", 400,\n            "Невалидный JSON в теле запроса", "/api/users", null));\n\n        System.out.println("\\n=== 401 Unauthorized ===");\n        System.out.println(buildError("about:blank", "Unauthorized", 401,\n            "Токен истёк", "/api/orders", null));\n\n        System.out.println("\\n=== 422 Validation Error ===");\n        List<String> fieldErrors = Arrays.asList(\n            "{\\\"field\\\":\\\"email\\\",\\\"message\\\":\\\"Невалидный формат\\\"}",\n            "{\\\"field\\\":\\\"age\\\",\\\"message\\\":\\\"Должно быть >= 18\\\"}"\n        );\n        System.out.println(buildError("about:blank", "Unprocessable Entity", 422,\n            "2 ошибок валидации", "/api/users", fieldErrors));\n\n        System.out.println("\\n=== 500 Internal Error ===");\n        System.out.println(buildError("about:blank", "Internal Server Error", 500,\n            "Непредвиденная ошибка", "/api/payments", null));\n    }\n\n    static String buildError(String type, String title, int status,\n                             String detail, String instance,\n                             List<String> fieldErrors) {\n        StringBuilder sb = new StringBuilder();\n        sb.append("{");\n        sb.append("\\\"type\\\":\\\"").append(type).append("\\\",");\n        sb.append("\\\"title\\\":\\\"").append(title).append("\\\",");\n        sb.append("\\\"status\\\":").append(status).append(",");\n        sb.append("\\\"detail\\\":\\\"").append(detail).append("\\\",");\n        sb.append("\\\"instance\\\":\\\"").append(instance).append("\\\"");\n\n        if (fieldErrors != null && !fieldErrors.isEmpty()) {\n            sb.append(",\\\"errors\\\":[");\n            for (int i = 0; i < fieldErrors.size(); i++) {\n                sb.append(fieldErrors.get(i));\n                if (i < fieldErrors.size() - 1) sb.append(",");\n            }\n            sb.append("]");\n        }\n\n        sb.append("}");\n        return sb.toString();\n    }\n}',
      explanation: 'RFC 7807 Problem Details стандартизирует формат ошибок: type (URI типа проблемы), title (заголовок), status (HTTP код), detail (описание конкретного случая), instance (путь запроса). Можно добавлять кастомные поля (errors для валидации). Единый формат позволяет клиенту обрабатывать любые ошибки одним обработчиком.'
    },
    {
      id: 6,
      title: 'Практика: Валидатор запросов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте валидатор REST API запросов, который проверяет данные и формирует детальные ошибки для каждого поля.',
      requirements: [
        'Реализуйте валидацию для создания заказа (POST /api/orders)',
        'Валидируйте поля: productId (обязательно, > 0), quantity (обязательно, 1-100), address (обязательно, мин 10 символов), phone (обязательно, формат +7XXXXXXXXXX)',
        'Соберите ВСЕ ошибки разом (не по одной)',
        'Покажите результат для невалидного, частично валидного и полностью валидного запроса',
        'Формат ошибок: {field, code, message, rejectedValue}'
      ],
      expectedOutput: '=== Запрос 1: Всё неправильно ===\n422: 4 ошибок валидации\n  productId: INVALID_VALUE — Должно быть > 0 (получено: -1)\n  quantity: OUT_OF_RANGE — От 1 до 100 (получено: 200)\n  address: TOO_SHORT — Минимум 10 символов (получено: Алматы)\n  phone: INVALID_FORMAT — Формат: +7XXXXXXXXXX (получено: 123)\n\n=== Запрос 2: Частично валидный ===\n422: 1 ошибок валидации\n  phone: INVALID_FORMAT — Формат: +7XXXXXXXXXX (получено: 87001234567)\n\n=== Запрос 3: Всё правильно ===\n201 Created: Заказ создан',
      hint: 'Для каждого правила создайте отдельную проверку и добавляйте ошибку в список. Для телефона проверьте длину (12) и префикс (+7).',
      solution: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Запрос 1: всё неправильно\n        System.out.println("=== Запрос 1: Всё неправильно ===");\n        validate(-1, 200, "Алматы", "123");\n\n        // Запрос 2: частично валидный\n        System.out.println("\\n=== Запрос 2: Частично валидный ===");\n        validate(5, 2, "ул. Абая 150, кв 12, Алматы", "87001234567");\n\n        // Запрос 3: всё правильно\n        System.out.println("\\n=== Запрос 3: Всё правильно ===");\n        validate(5, 2, "ул. Абая 150, кв 12, Алматы", "+77001234567");\n    }\n\n    static void validate(int productId, int quantity, String address, String phone) {\n        List<String[]> errors = new ArrayList<>();\n\n        // productId\n        if (productId <= 0) {\n            errors.add(new String[]{"productId", "INVALID_VALUE",\n                "Должно быть > 0", String.valueOf(productId)});\n        }\n\n        // quantity\n        if (quantity < 1 || quantity > 100) {\n            errors.add(new String[]{"quantity", "OUT_OF_RANGE",\n                "От 1 до 100", String.valueOf(quantity)});\n        }\n\n        // address\n        if (address == null || address.isEmpty()) {\n            errors.add(new String[]{"address", "REQUIRED",\n                "Адрес обязателен", ""});\n        } else if (address.length() < 10) {\n            errors.add(new String[]{"address", "TOO_SHORT",\n                "Минимум 10 символов", address});\n        }\n\n        // phone\n        if (phone == null || phone.isEmpty()) {\n            errors.add(new String[]{"phone", "REQUIRED",\n                "Телефон обязателен", ""});\n        } else if (!phone.startsWith("+7") || phone.length() != 12) {\n            errors.add(new String[]{"phone", "INVALID_FORMAT",\n                "Формат: +7XXXXXXXXXX", phone});\n        }\n\n        if (errors.isEmpty()) {\n            System.out.println("201 Created: Заказ создан");\n        } else {\n            System.out.println("422: " + errors.size() + " ошибок валидации");\n            for (String[] e : errors) {\n                System.out.printf("  %s: %s — %s (получено: %s)%n",\n                    e[0], e[1], e[2], e[3]);\n            }\n        }\n    }\n}',
      explanation: 'Хороший валидатор собирает ВСЕ ошибки за один проход и возвращает их разом. Каждая ошибка содержит: поле, код ошибки, описание, отклонённое значение. Это позволяет клиенту подсветить ошибки у каждого поля формы. Порядок проверок важен: сначала REQUIRED, потом формат и диапазон.'
    }
  ]
}
