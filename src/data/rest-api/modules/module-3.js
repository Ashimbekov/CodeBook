export default {
  id: 3,
  title: 'HTTP статус-коды',
  description: 'Статус-коды 1xx-5xx: когда какой использовать, типичные ошибки, примеры из реальных API.',
  lessons: [
    {
      id: 1,
      title: 'Обзор статус-кодов',
      type: 'theory',
      content: [
        { type: 'text', value: 'HTTP статус-код — трёхзначное число в ответе сервера, которое сообщает клиенту результат обработки запроса. Коды делятся на 5 классов по первой цифре.' },
        { type: 'heading', value: '5 классов статус-кодов' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, String> classes = new LinkedHashMap<>();\n        classes.put("1xx Informational", "Запрос принят, обработка продолжается");\n        classes.put("2xx Success",       "Запрос успешно обработан");\n        classes.put("3xx Redirection",   "Нужно дополнительное действие (перенаправление)");\n        classes.put("4xx Client Error",  "Ошибка клиента (неверный запрос)");\n        classes.put("5xx Server Error",  "Ошибка сервера (сбой на стороне сервера)");\n\n        System.out.println("=== Классы HTTP статус-кодов ===");\n        for (Map.Entry<String, String> entry : classes.entrySet()) {\n            System.out.println(entry.getKey() + " — " + entry.getValue());\n        }\n\n        System.out.println("\\n=== Самые частые в REST API ===");\n        String[][] common = {\n            {"200", "OK", "Успешный GET, PUT, PATCH"},\n            {"201", "Created", "Ресурс создан (POST)"},\n            {"204", "No Content", "Успех без тела (DELETE)"},\n            {"400", "Bad Request", "Неверный запрос клиента"},\n            {"401", "Unauthorized", "Не аутентифицирован"},\n            {"403", "Forbidden", "Нет прав доступа"},\n            {"404", "Not Found", "Ресурс не найден"},\n            {"409", "Conflict", "Конфликт (дубликат)"},\n            {"422", "Unprocessable Entity", "Ошибка валидации"},\n            {"429", "Too Many Requests", "Превышен лимит запросов"},\n            {"500", "Internal Server Error", "Ошибка на сервере"}\n        };\n        for (String[] code : common) {\n            System.out.printf("  %s %s — %s%n", code[0], code[1], code[2]);\n        }\n    }\n}' },
        { type: 'tip', value: 'Запомните минимум: 200 (ОК), 201 (Создано), 204 (Пусто), 400 (Плохой запрос), 401 (Не авторизован), 404 (Не найдено), 500 (Ошибка сервера). Этих 7 кодов достаточно для большинства API.' },
        { type: 'note', value: 'Никогда не возвращайте 200 с ошибкой в теле! Некоторые API возвращают 200 OK с {"error": "user not found"} — это антипаттерн. Используйте правильные статус-коды.' }
      ]
    },
    {
      id: 2,
      title: 'Коды успеха (2xx)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Коды 2xx означают успешную обработку запроса. Выбор конкретного кода зависит от HTTP метода и характера ответа.' },
        { type: 'heading', value: 'Когда какой 2xx код' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // 200 OK — GET, PUT, PATCH\n        System.out.println("=== 200 OK ===");\n        System.out.println("GET /api/users/1");\n        System.out.println("Ответ: {\\\"id\\\":1, \\\"name\\\":\\\"Алия\\\"}");\n        System.out.println("Когда: любой успешный запрос с телом ответа\\n");\n\n        // 201 Created — POST\n        System.out.println("=== 201 Created ===");\n        System.out.println("POST /api/users");\n        System.out.println("Заголовок: Location: /api/users/42");\n        System.out.println("Ответ: {\\\"id\\\":42, \\\"name\\\":\\\"Новый\\\"}");\n        System.out.println("Когда: создан новый ресурс\\n");\n\n        // 202 Accepted — асинхронная обработка\n        System.out.println("=== 202 Accepted ===");\n        System.out.println("POST /api/reports/generate");\n        System.out.println("Ответ: {\\\"taskId\\\":\\\"abc\\\", \\\"status\\\":\\\"processing\\\"}");\n        System.out.println("Когда: запрос принят, но ещё обрабатывается\\n");\n\n        // 204 No Content — DELETE, PUT без тела\n        System.out.println("=== 204 No Content ===");\n        System.out.println("DELETE /api/users/42");\n        System.out.println("Ответ: (пустое тело)");\n        System.out.println("Когда: успех, но нечего возвращать");\n    }\n}' },
        { type: 'heading', value: 'Таблица: Метод → Статус-код' },
        { type: 'list', items: [
          'GET → 200 OK (найден) или 404 Not Found',
          'POST → 201 Created (создан) + Location заголовок',
          'PUT → 200 OK (обновлён) или 201 Created (если создал новый)',
          'PATCH → 200 OK (обновлён)',
          'DELETE → 204 No Content (удалён) или 200 OK (с удалённым объектом)'
        ]},
        { type: 'tip', value: 'GitHub API возвращает 201 Created при создании issue и 204 No Content при удалении. Stripe API возвращает 200 OK для всех успешных операций, включая создание — это допустимо, но не идеально.' }
      ]
    },
    {
      id: 3,
      title: 'Коды ошибок клиента (4xx)',
      type: 'theory',
      content: [
        { type: 'text', value: '4xx коды означают ошибку на стороне клиента: неверный формат запроса, отсутствие прав, ресурс не найден. Клиент должен исправить запрос.' },
        { type: 'heading', value: 'Важнейшие 4xx коды' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // 400 Bad Request — неверный формат/синтаксис\n        System.out.println("=== 400 Bad Request ===");\n        System.out.println("POST /api/users с телом: {invalid json");\n        System.out.println("Ответ: {\\\"error\\\": \\\"Невалидный JSON\\\"}\\n");\n\n        // 401 Unauthorized — не аутентифицирован\n        System.out.println("=== 401 Unauthorized ===");\n        System.out.println("GET /api/orders без заголовка Authorization");\n        System.out.println("Ответ: {\\\"error\\\": \\\"Токен не предоставлен\\\"}\\n");\n\n        // 403 Forbidden — нет прав\n        System.out.println("=== 403 Forbidden ===");\n        System.out.println("DELETE /api/users/1 (роль: USER, нужно: ADMIN)");\n        System.out.println("Ответ: {\\\"error\\\": \\\"Недостаточно прав\\\"}\\n");\n\n        // 404 Not Found — ресурс не найден\n        System.out.println("=== 404 Not Found ===");\n        System.out.println("GET /api/users/99999");\n        System.out.println("Ответ: {\\\"error\\\": \\\"Пользователь 99999 не найден\\\"}\\n");\n\n        // 409 Conflict — конфликт\n        System.out.println("=== 409 Conflict ===");\n        System.out.println("POST /api/users с email уже существующего");\n        System.out.println("Ответ: {\\\"error\\\": \\\"Email уже зарегистрирован\\\"}\\n");\n\n        // 422 Unprocessable Entity — ошибка валидации\n        System.out.println("=== 422 Unprocessable Entity ===");\n        System.out.println("POST /api/users {\\\"name\\\":\\\"\\\", \\\"email\\\":\\\"not-email\\\"}");\n        System.out.println("Ответ: {\\\"errors\\\": [");\n        System.out.println("  {\\\"field\\\": \\\"name\\\", \\\"message\\\": \\\"Обязательное поле\\\"},");\n        System.out.println("  {\\\"field\\\": \\\"email\\\", \\\"message\\\": \\\"Невалидный email\\\"}");\n        System.out.println("]}\\n");\n\n        // 429 Too Many Requests — лимит\n        System.out.println("=== 429 Too Many Requests ===");\n        System.out.println("Заголовок: Retry-After: 60");\n        System.out.println("Ответ: {\\\"error\\\": \\\"Превышен лимит. Повторите через 60 сек\\\"}");\n    }\n}' },
        { type: 'heading', value: '401 vs 403 — в чём разница?' },
        { type: 'text', value: '401 Unauthorized — клиент НЕ аутентифицирован (не предоставил токен или токен невалидный). 403 Forbidden — клиент аутентифицирован, но НЕ авторизован (нет прав на это действие).' },
        { type: 'warning', value: '400 vs 422: используйте 400 для синтаксических ошибок (невалидный JSON), 422 для семантических (валидный JSON, но поле email невалидно). Многие API используют только 400 для обоих случаев — это тоже допустимо.' }
      ]
    },
    {
      id: 4,
      title: 'Коды ошибок сервера (5xx)',
      type: 'theory',
      content: [
        { type: 'text', value: '5xx коды означают ошибку на стороне сервера. Клиент отправил корректный запрос, но сервер не смог его обработать. Клиент может повторить запрос.' },
        { type: 'heading', value: 'Основные 5xx коды' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // 500 Internal Server Error\n        System.out.println("=== 500 Internal Server Error ===");\n        System.out.println("Причина: NullPointerException в коде сервера");\n        System.out.println("Что видит клиент: {\\\"error\\\": \\\"Внутренняя ошибка сервера\\\"}");\n        System.out.println("Что видит разработчик (логи): java.lang.NPE at UserService.java:42\\n");\n\n        // 502 Bad Gateway\n        System.out.println("=== 502 Bad Gateway ===");\n        System.out.println("Причина: прокси/балансировщик не может достучаться до backend");\n        System.out.println("Пример: Nginx получил ошибку от Tomcat\\n");\n\n        // 503 Service Unavailable\n        System.out.println("=== 503 Service Unavailable ===");\n        System.out.println("Причина: сервер перегружен или на обслуживании");\n        System.out.println("Заголовок: Retry-After: 300");\n        System.out.println("Пример: деплой новой версии, перезагрузка\\n");\n\n        // 504 Gateway Timeout\n        System.out.println("=== 504 Gateway Timeout ===");\n        System.out.println("Причина: backend не ответил за отведённое время");\n        System.out.println("Пример: тяжёлый SQL запрос > 30 секунд\\n");\n\n        // Правило: не раскрывайте внутренние ошибки!\n        System.out.println("=== ВАЖНО: Безопасность ===");\n        System.out.println("ПЛОХО: {\\\"error\\\": \\\"Connection to DB 192.168.1.100:5432 failed\\\"}");\n        System.out.println("ХОРОШО: {\\\"error\\\": \\\"Внутренняя ошибка сервера\\\", \\\"traceId\\\": \\\"abc123\\\"}");\n        System.out.println("TraceId позволяет найти ошибку в логах без раскрытия деталей.");\n    }\n}' },
        { type: 'warning', value: 'НИКОГДА не возвращайте стектрейс или детали ошибки в production! Это раскрывает внутреннюю архитектуру злоумышленнику. Возвращайте общее сообщение + traceId для корреляции с логами.' },
        { type: 'note', value: '500 ошибки — это всегда баг. Если ваш API возвращает 500 — это значит, что вы не обработали какой-то edge case. Цель — чтобы 500 ошибок было 0.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Обработчик статус-кодов',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте систему, которая симулирует возврат правильных HTTP статус-кодов для различных сценариев API.',
      requirements: [
        'Создайте метод processRequest(String method, String path, String body, String token) который возвращает статус-код и сообщение',
        'GET /api/users/1 с валидным токеном -> 200 OK',
        'GET /api/users/999 -> 404 Not Found',
        'POST /api/users без токена -> 401 Unauthorized',
        'DELETE /api/users/1 с токеном роли USER -> 403 Forbidden',
        'POST /api/users с пустым name -> 422 Unprocessable Entity',
        'POST /api/users успешно -> 201 Created'
      ],
      expectedOutput: 'GET /api/users/1 [token=admin] -> 200 OK\nGET /api/users/999 [token=admin] -> 404 Not Found\nPOST /api/users [token=null] -> 401 Unauthorized\nDELETE /api/users/1 [token=user] -> 403 Forbidden\nPOST /api/users [name=] -> 422 Unprocessable Entity\nPOST /api/users [name=Дана] -> 201 Created',
      hint: 'Проверяйте условия в порядке: сначала аутентификация (401), потом авторизация (403), потом валидация (422), потом бизнес-логика (404/409), и наконец успех (200/201).',
      solution: 'import java.util.*;\n\npublic class Main {\n    static Set<Integer> existingIds = new HashSet<>(Arrays.asList(1, 2, 3));\n\n    public static void main(String[] args) {\n        System.out.println(processRequest("GET", "/api/users/1", null, "admin"));\n        System.out.println(processRequest("GET", "/api/users/999", null, "admin"));\n        System.out.println(processRequest("POST", "/api/users", "", null));\n        System.out.println(processRequest("DELETE", "/api/users/1", null, "user"));\n        System.out.println(processRequest("POST", "/api/users", "", "admin"));\n        System.out.println(processRequest("POST", "/api/users", "Дана", "admin"));\n    }\n\n    static String processRequest(String method, String path, String body, String token) {\n        String display = method + " " + path + " [token=" + token;\n        if (body != null && method.equals("POST")) {\n            display += ", name=" + (body.isEmpty() ? "(пусто)" : body);\n        }\n        display += "]";\n\n        // 1. Аутентификация\n        if (token == null) {\n            return display + " -> 401 Unauthorized";\n        }\n\n        // 2. Авторизация\n        if (method.equals("DELETE") && !token.equals("admin")) {\n            return display + " -> 403 Forbidden";\n        }\n\n        // 3. Валидация (для POST/PUT)\n        if ((method.equals("POST") || method.equals("PUT")) && (body == null || body.isEmpty())) {\n            return display + " -> 422 Unprocessable Entity";\n        }\n\n        // 4. Существование ресурса\n        String[] segments = path.split("/");\n        if (segments.length == 4) {\n            int id = Integer.parseInt(segments[3]);\n            if (!existingIds.contains(id)) {\n                return display + " -> 404 Not Found";\n            }\n        }\n\n        // 5. Успех\n        if (method.equals("POST")) {\n            return display + " -> 201 Created";\n        } else if (method.equals("DELETE")) {\n            return display + " -> 204 No Content";\n        }\n        return display + " -> 200 OK";\n    }\n}',
      explanation: 'Порядок проверок важен: сначала аутентификация (кто ты?), потом авторизация (что тебе можно?), потом валидация (корректны ли данные?), потом бизнес-логика (существует ли ресурс?). Этот порядок обеспечивает правильные статус-коды и не раскрывает лишнюю информацию (не говорим "ресурс не найден" неаутентифицированному пользователю).'
    },
    {
      id: 6,
      title: 'Практика: Карта статус-кодов API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте утилиту, которая генерирует документацию по статус-кодам для каждого endpoint API.',
      requirements: [
        'Создайте класс Endpoint с полями: method, path, описание',
        'Для каждого endpoint определите список возможных статус-кодов с описанием',
        'Покройте endpoints: GET /users, GET /users/{id}, POST /users, PUT /users/{id}, DELETE /users/{id}',
        'Выведите таблицу: метод + путь -> список кодов',
        'Добавьте подсчёт: сколько раз каждый код встречается'
      ],
      expectedOutput: 'GET /api/users\n  200 OK - Список пользователей\n  401 Unauthorized - Нет токена\n  429 Too Many Requests - Лимит\n\nPOST /api/users\n  201 Created - Пользователь создан\n  400 Bad Request - Невалидный JSON\n  409 Conflict - Email занят\n  422 Unprocessable Entity - Ошибки валидации\n\n...\n\nСтатистика: 200(2) 201(1) 204(1) 400(2) 401(5) 403(1) 404(2) 409(1) 422(2) 429(3)',
      hint: 'Используйте Map<String, List<String>> для хранения кодов каждого endpoint. TreeMap для сортированной статистики.',
      solution: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Map<String, Object>> endpoints = new ArrayList<>();\n\n        endpoints.add(endpoint("GET", "/api/users", new String[][] {\n            {"200", "OK", "Список пользователей"},\n            {"401", "Unauthorized", "Нет токена"},\n            {"429", "Too Many Requests", "Лимит запросов"}\n        }));\n\n        endpoints.add(endpoint("GET", "/api/users/{id}", new String[][] {\n            {"200", "OK", "Пользователь найден"},\n            {"401", "Unauthorized", "Нет токена"},\n            {"404", "Not Found", "Пользователь не найден"},\n            {"429", "Too Many Requests", "Лимит запросов"}\n        }));\n\n        endpoints.add(endpoint("POST", "/api/users", new String[][] {\n            {"201", "Created", "Пользователь создан"},\n            {"400", "Bad Request", "Невалидный JSON"},\n            {"401", "Unauthorized", "Нет токена"},\n            {"409", "Conflict", "Email уже занят"},\n            {"422", "Unprocessable Entity", "Ошибки валидации"},\n            {"429", "Too Many Requests", "Лимит запросов"}\n        }));\n\n        endpoints.add(endpoint("PUT", "/api/users/{id}", new String[][] {\n            {"200", "OK", "Пользователь обновлён"},\n            {"400", "Bad Request", "Невалидный JSON"},\n            {"401", "Unauthorized", "Нет токена"},\n            {"403", "Forbidden", "Нет прав"},\n            {"404", "Not Found", "Пользователь не найден"},\n            {"422", "Unprocessable Entity", "Ошибки валидации"}\n        }));\n\n        endpoints.add(endpoint("DELETE", "/api/users/{id}", new String[][] {\n            {"204", "No Content", "Пользователь удалён"},\n            {"401", "Unauthorized", "Нет токена"},\n            {"403", "Forbidden", "Нет прав"}\n        }));\n\n        // Вывод документации\n        Map<String, Integer> stats = new TreeMap<>();\n        for (Map<String, Object> ep : endpoints) {\n            System.out.println(ep.get("method") + " " + ep.get("path"));\n            String[][] codes = (String[][]) ep.get("codes");\n            for (String[] code : codes) {\n                System.out.printf("  %s %s - %s%n", code[0], code[1], code[2]);\n                stats.merge(code[0], 1, Integer::sum);\n            }\n            System.out.println();\n        }\n\n        // Статистика\n        StringBuilder sb = new StringBuilder("Статистика: ");\n        stats.forEach((code, count) -> sb.append(code).append("(").append(count).append(") "));\n        System.out.println(sb.toString().trim());\n    }\n\n    static Map<String, Object> endpoint(String method, String path, String[][] codes) {\n        Map<String, Object> ep = new LinkedHashMap<>();\n        ep.put("method", method);\n        ep.put("path", path);\n        ep.put("codes", codes);\n        return ep;\n    }\n}',
      explanation: 'Документирование статус-кодов для каждого endpoint — важная практика. Клиент API должен знать, какие коды ожидать, чтобы корректно обработать каждый случай. В OpenAPI/Swagger спецификации это делается автоматически. Статистика показывает, что 401 встречается почти в каждом endpoint — это логично, ведь аутентификация проверяется везде.'
    }
  ]
}
