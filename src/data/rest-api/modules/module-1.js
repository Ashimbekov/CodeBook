export default {
  id: 1,
  title: 'Основы HTTP',
  description: 'HTTP протокол: методы GET, POST, PUT, PATCH, DELETE, заголовки, тело запроса и ответа — фундамент REST API.',
  lessons: [
    {
      id: 1,
      title: 'Что такое HTTP?',
      type: 'theory',
      content: [
        { type: 'text', value: 'HTTP (HyperText Transfer Protocol) — это протокол прикладного уровня для передачи данных в вебе. Всё взаимодействие между клиентом (браузер, мобильное приложение) и сервером происходит через HTTP.' },
        { type: 'tip', value: 'HTTP работает по модели "запрос-ответ": клиент отправляет запрос, сервер возвращает ответ. Это как переписка по почте — ты отправляешь письмо (запрос) и ждёшь ответ.' },
        { type: 'heading', value: 'Структура HTTP запроса' },
        { type: 'text', value: 'Каждый HTTP запрос состоит из трёх частей: стартовая строка (метод + URL + версия), заголовки и тело (опционально).' },
        { type: 'code', language: 'java', value: '// Структура HTTP запроса\n// POST /api/users HTTP/1.1        <- стартовая строка\n// Host: api.example.com           <- заголовок\n// Content-Type: application/json  <- заголовок\n// Authorization: Bearer token123  <- заголовок\n//                                 <- пустая строка\n// {"name": "Нурсултан"}           <- тело запроса\n\npublic class Main {\n    public static void main(String[] args) {\n        // Моделируем HTTP запрос в Java\n        String method = "POST";\n        String path = "/api/users";\n        String httpVersion = "HTTP/1.1";\n\n        // Стартовая строка\n        String startLine = method + " " + path + " " + httpVersion;\n        System.out.println("Стартовая строка: " + startLine);\n\n        // Заголовки\n        String host = "Host: api.example.com";\n        String contentType = "Content-Type: application/json";\n        System.out.println("Заголовок: " + host);\n        System.out.println("Заголовок: " + contentType);\n\n        // Тело\n        String body = "{\\\"name\\\": \\\"Нурсултан\\\"}";\n        System.out.println("Тело: " + body);\n    }\n}' },
        { type: 'heading', value: 'Структура HTTP ответа' },
        { type: 'text', value: 'Ответ сервера тоже состоит из стартовой строки (версия + статус-код + описание), заголовков и тела.' },
        { type: 'code', language: 'java', value: '// HTTP/1.1 201 Created            <- стартовая строка\n// Content-Type: application/json  <- заголовок\n// Location: /api/users/42         <- заголовок\n//                                 <- пустая строка\n// {"id": 42, "name": "Нурсултан"} <- тело ответа' },
        { type: 'note', value: 'HTTP — это текстовый протокол. Все запросы и ответы — это обычный текст, который можно прочитать глазами. Это одна из причин популярности HTTP — его легко отлаживать.' }
      ]
    },
    {
      id: 2,
      title: 'HTTP метод GET',
      type: 'theory',
      content: [
        { type: 'text', value: 'GET — самый распространённый HTTP метод. Он используется для получения данных. GET запрос не должен изменять состояние сервера.' },
        { type: 'heading', value: 'Характеристики GET' },
        { type: 'list', items: [
          'Безопасный (safe) — не изменяет данные на сервере',
          'Идемпотентный — повторный запрос даёт тот же результат',
          'Кэшируемый — браузер может кэшировать ответ',
          'Не имеет тела запроса — параметры передаются в URL',
          'Ограничение длины URL — обычно 2048 символов'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Моделируем различные GET запросы\n\n        // GET /api/users — получить список всех пользователей\n        System.out.println("GET /api/users");\n        System.out.println("Ответ: [{\"id\":1,\"name\":\"Алия\"},{\"id\":2,\"name\":\"Бауыржан\"}]");\n        System.out.println();\n\n        // GET /api/users/1 — получить одного пользователя\n        System.out.println("GET /api/users/1");\n        System.out.println("Ответ: {\"id\":1,\"name\":\"Алия\",\"email\":\"aliya@mail.kz\"}");\n        System.out.println();\n\n        // GET /api/users?city=Almaty&age=25 — с query параметрами\n        System.out.println("GET /api/users?city=Almaty&age=25");\n        System.out.println("Ответ: [{\"id\":1,\"name\":\"Алия\",\"city\":\"Almaty\",\"age\":25}]");\n        System.out.println();\n\n        // Парсинг query параметров\n        String url = "/api/users?city=Almaty&age=25&sort=name";\n        Map<String, String> params = parseQueryParams(url);\n        System.out.println("Параметры: " + params);\n    }\n\n    static Map<String, String> parseQueryParams(String url) {\n        Map<String, String> params = new LinkedHashMap<>();\n        int idx = url.indexOf(\'?\');\n        if (idx == -1) return params;\n\n        String query = url.substring(idx + 1);\n        for (String pair : query.split("&")) {\n            String[] kv = pair.split("=", 2);\n            params.put(kv[0], kv.length > 1 ? kv[1] : "");\n        }\n        return params;\n    }\n}' },
        { type: 'tip', value: 'В реальных API (GitHub, Stripe) GET запросы используются для чтения данных. Например, GET /repos/octocat/hello-world — получить информацию о репозитории на GitHub.' },
        { type: 'warning', value: 'Никогда не используйте GET для изменения данных! GET /api/users/delete/1 — это антипаттерн. Поисковые роботы и кэши могут повторить такой запрос и случайно удалить данные.' }
      ]
    },
    {
      id: 3,
      title: 'HTTP методы POST и PUT',
      type: 'theory',
      content: [
        { type: 'text', value: 'POST создаёт новый ресурс, PUT полностью заменяет существующий. Оба метода передают данные в теле запроса.' },
        { type: 'heading', value: 'POST — создание ресурса' },
        { type: 'text', value: 'POST не является идемпотентным: повторный POST создаст ещё один ресурс. Сервер сам назначает ID.' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    // Хранилище пользователей\n    static List<Map<String, Object>> users = new ArrayList<>();\n    static int nextId = 1;\n\n    public static void main(String[] args) {\n        // POST /api/users — создаём пользователя\n        System.out.println("=== POST /api/users ===" );\n        Map<String, Object> user1 = createUser("Айдана", "aidana@mail.kz");\n        System.out.println("201 Created: " + user1);\n\n        // Повторный POST создаст ДРУГОГО пользователя (не идемпотентный!)\n        Map<String, Object> user2 = createUser("Айдана", "aidana@mail.kz");\n        System.out.println("201 Created: " + user2);\n        System.out.println("Два POST — два ресурса! ID: " + user1.get("id") + " и " + user2.get("id"));\n\n        System.out.println();\n\n        // PUT /api/users/1 — полная замена пользователя\n        System.out.println("=== PUT /api/users/1 ===");\n        Map<String, Object> updated = replaceUser(1, "Айдана Сериковна", "aidana.s@mail.kz");\n        System.out.println("200 OK: " + updated);\n\n        // Повторный PUT с теми же данными — тот же результат (идемпотентный!)\n        Map<String, Object> same = replaceUser(1, "Айдана Сериковна", "aidana.s@mail.kz");\n        System.out.println("200 OK: " + same);\n        System.out.println("Два PUT — один результат! Идемпотентный.");\n    }\n\n    static Map<String, Object> createUser(String name, String email) {\n        Map<String, Object> user = new LinkedHashMap<>();\n        user.put("id", nextId++);\n        user.put("name", name);\n        user.put("email", email);\n        users.add(user);\n        return user;\n    }\n\n    static Map<String, Object> replaceUser(int id, String name, String email) {\n        for (Map<String, Object> user : users) {\n            if ((int) user.get("id") == id) {\n                user.put("name", name);\n                user.put("email", email);\n                return user;\n            }\n        }\n        return null;\n    }\n}' },
        { type: 'heading', value: 'PUT — полная замена' },
        { type: 'text', value: 'PUT идемпотентен: повторный PUT с теми же данными не изменит результат. Важно: PUT заменяет ресурс ЦЕЛИКОМ. Если не указать какое-то поле — оно будет удалено.' },
        { type: 'warning', value: 'PUT /api/users/1 с телом {"name": "Айдана"} удалит email! PUT заменяет объект полностью. Для частичного обновления используйте PATCH.' },
        { type: 'tip', value: 'В Stripe API создание платежа — POST /v1/charges. В GitHub API создание issue — POST /repos/{owner}/{repo}/issues. Оба возвращают 201 Created с созданным объектом.' }
      ]
    },
    {
      id: 4,
      title: 'HTTP методы PATCH и DELETE',
      type: 'theory',
      content: [
        { type: 'text', value: 'PATCH частично обновляет ресурс (только указанные поля). DELETE удаляет ресурс. Оба метода важны для полноценного CRUD API.' },
        { type: 'heading', value: 'PATCH — частичное обновление' },
        { type: 'text', value: 'PATCH отправляет только те поля, которые нужно изменить. Остальные поля остаются без изменений. Это главное отличие от PUT.' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Исходный пользователь\n        Map<String, String> user = new LinkedHashMap<>();\n        user.put("id", "1");\n        user.put("name", "Бауыржан");\n        user.put("email", "baurzhan@mail.kz");\n        user.put("city", "Астана");\n        System.out.println("Исходный: " + user);\n\n        // PATCH /api/users/1 — обновляем только email\n        System.out.println("\\n=== PATCH /api/users/1 ===");\n        Map<String, String> patch = new LinkedHashMap<>();\n        patch.put("email", "baurzhan.new@mail.kz");\n        System.out.println("Тело запроса: " + patch);\n\n        // Применяем частичное обновление\n        for (Map.Entry<String, String> entry : patch.entrySet()) {\n            user.put(entry.getKey(), entry.getValue());\n        }\n        System.out.println("200 OK: " + user);\n        System.out.println("city осталось: " + user.get("city") + " (не затронуто!)");\n\n        // DELETE /api/users/1\n        System.out.println("\\n=== DELETE /api/users/1 ===");\n        System.out.println("204 No Content");\n        System.out.println("Ресурс удалён, тело ответа пустое");\n\n        // Повторный DELETE\n        System.out.println("\\n=== DELETE /api/users/1 (повторно) ===");\n        System.out.println("404 Not Found — ресурс уже удалён");\n    }\n}' },
        { type: 'heading', value: 'DELETE — удаление ресурса' },
        { type: 'list', items: [
          'DELETE идемпотентен — повторное удаление не создаёт побочных эффектов',
          'Обычно возвращает 204 No Content (без тела)',
          'Иногда возвращает 200 OK с удалённым объектом в теле',
          'Повторный DELETE может вернуть 404 Not Found',
          'Soft delete — не удаляем физически, а ставим флаг deleted=true'
        ]},
        { type: 'heading', value: 'Сравнение PUT vs PATCH' },
        { type: 'code', language: 'java', value: '// PUT — полная замена (нужно отправить ВСЕ поля)\n// PUT /api/users/1\n// {"name": "Бауыржан", "email": "new@mail.kz", "city": "Астана"}\n\n// PATCH — частичное обновление (только изменённые поля)\n// PATCH /api/users/1\n// {"email": "new@mail.kz"}\n\n// Если забыть поле в PUT:\n// PUT /api/users/1\n// {"name": "Бауыржан"}  <- city и email будут NULL!' },
        { type: 'note', value: 'В GitHub API обновление issue — PATCH /repos/{owner}/{repo}/issues/{number}. В Stripe API обновление клиента — POST /v1/customers/{id} (Stripe использует POST вместо PATCH по историческим причинам).' }
      ]
    },
    {
      id: 5,
      title: 'HTTP заголовки',
      type: 'theory',
      content: [
        { type: 'text', value: 'HTTP заголовки — это метаданные запроса и ответа. Они передают информацию о формате данных, аутентификации, кэшировании и многом другом.' },
        { type: 'heading', value: 'Основные заголовки запроса' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Заголовки запроса\n        Map<String, String> requestHeaders = new LinkedHashMap<>();\n\n        // Content-Type — формат тела запроса\n        requestHeaders.put("Content-Type", "application/json");\n\n        // Accept — какой формат ответа клиент принимает\n        requestHeaders.put("Accept", "application/json");\n\n        // Authorization — токен для аутентификации\n        requestHeaders.put("Authorization", "Bearer eyJhbGciOiJIUzI1NiJ9...");\n\n        // Accept-Language — предпочитаемый язык\n        requestHeaders.put("Accept-Language", "ru-RU, en-US");\n\n        // User-Agent — информация о клиенте\n        requestHeaders.put("User-Agent", "MyApp/1.0 Java/17");\n\n        System.out.println("=== Заголовки запроса ===");\n        requestHeaders.forEach((k, v) -> System.out.println(k + ": " + v));\n\n        // Заголовки ответа\n        System.out.println("\\n=== Заголовки ответа ===");\n        Map<String, String> responseHeaders = new LinkedHashMap<>();\n        responseHeaders.put("Content-Type", "application/json; charset=utf-8");\n        responseHeaders.put("X-Request-Id", "req-abc-123");\n        responseHeaders.put("X-RateLimit-Limit", "5000");\n        responseHeaders.put("X-RateLimit-Remaining", "4999");\n        responseHeaders.put("Cache-Control", "max-age=3600");\n        responseHeaders.put("ETag", "\\\"33a64df551425fcc55e4d42a148795d9f25f89d4\\\"");\n\n        responseHeaders.forEach((k, v) -> System.out.println(k + ": " + v));\n    }\n}' },
        { type: 'heading', value: 'Content-Type — самый важный заголовок' },
        { type: 'list', items: [
          'application/json — JSON данные (стандарт для REST API)',
          'application/x-www-form-urlencoded — данные HTML формы',
          'multipart/form-data — загрузка файлов',
          'text/plain — обычный текст',
          'application/xml — XML данные (устаревший формат для API)'
        ]},
        { type: 'heading', value: 'Кастомные заголовки' },
        { type: 'text', value: 'API часто используют кастомные заголовки с префиксом X-. Например, X-Request-Id для трассировки запросов, X-RateLimit-Limit для лимитов.' },
        { type: 'note', value: 'GitHub API использует заголовки X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset для информации о лимитах. Stripe API использует Idempotency-Key для обеспечения идемпотентности POST запросов.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Построение HTTP запроса',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напишите программу, которая моделирует построение HTTP запроса и ответа с заголовками и телом.',
      requirements: [
        'Создайте класс HttpRequest с полями method, path, headers (Map), body',
        'Создайте класс HttpResponse с полями statusCode, statusText, headers (Map), body',
        'Реализуйте метод toString() для форматированного вывода',
        'Создайте POST запрос для создания пользователя и соответствующий ответ 201 Created'
      ],
      expectedOutput: 'POST /api/users HTTP/1.1\nHost: api.example.com\nContent-Type: application/json\nAuthorization: Bearer token123\n\n{"name":"Алия","email":"aliya@mail.kz"}\n\n---\n\nHTTP/1.1 201 Created\nContent-Type: application/json\nLocation: /api/users/42\n\n{"id":42,"name":"Алия","email":"aliya@mail.kz"}',
      hint: 'Используй LinkedHashMap для сохранения порядка заголовков. StringBuilder для формирования строкового представления.',
      solution: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Строим POST запрос\n        Map<String, String> reqHeaders = new LinkedHashMap<>();\n        reqHeaders.put("Host", "api.example.com");\n        reqHeaders.put("Content-Type", "application/json");\n        reqHeaders.put("Authorization", "Bearer token123");\n\n        String request = buildRequest("POST", "/api/users", reqHeaders,\n            "{\\\"name\\\":\\\"Алия\\\",\\\"email\\\":\\\"aliya@mail.kz\\\"}");\n        System.out.println(request);\n\n        System.out.println("\\n---\\n");\n\n        // Строим ответ 201 Created\n        Map<String, String> resHeaders = new LinkedHashMap<>();\n        resHeaders.put("Content-Type", "application/json");\n        resHeaders.put("Location", "/api/users/42");\n\n        String response = buildResponse(201, "Created", resHeaders,\n            "{\\\"id\\\":42,\\\"name\\\":\\\"Алия\\\",\\\"email\\\":\\\"aliya@mail.kz\\\"}");\n        System.out.println(response);\n    }\n\n    static String buildRequest(String method, String path,\n                               Map<String, String> headers, String body) {\n        StringBuilder sb = new StringBuilder();\n        sb.append(method).append(" ").append(path).append(" HTTP/1.1\\n");\n        headers.forEach((k, v) -> sb.append(k).append(": ").append(v).append("\\n"));\n        if (body != null) {\n            sb.append("\\n").append(body);\n        }\n        return sb.toString();\n    }\n\n    static String buildResponse(int code, String text,\n                                Map<String, String> headers, String body) {\n        StringBuilder sb = new StringBuilder();\n        sb.append("HTTP/1.1 ").append(code).append(" ").append(text).append("\\n");\n        headers.forEach((k, v) -> sb.append(k).append(": ").append(v).append("\\n"));\n        if (body != null) {\n            sb.append("\\n").append(body);\n        }\n        return sb.toString();\n    }\n}',
      explanation: 'HTTP запрос и ответ — это обычный текст с чёткой структурой. Стартовая строка, затем заголовки (ключ: значение), пустая строка, тело. В реальности Java-разработчики используют HttpURLConnection или HttpClient, но понимание структуры HTTP — ключ к проектированию хороших API.'
    },
    {
      id: 7,
      title: 'Практика: Маршрутизатор запросов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите простой маршрутизатор, который по HTTP методу и пути определяет какое действие выполнить.',
      requirements: [
        'Создайте метод route(String method, String path), который возвращает описание действия',
        'Поддержите маршруты: GET /api/users, GET /api/users/{id}, POST /api/users, PUT /api/users/{id}, DELETE /api/users/{id}',
        'Извлеките ID из пути (например, /api/users/42 -> id=42)',
        'Для неизвестных маршрутов верните "404 Not Found"',
        'Выведите результат для каждого маршрута'
      ],
      expectedOutput: 'GET /api/users -> Получить список пользователей\nGET /api/users/42 -> Получить пользователя id=42\nPOST /api/users -> Создать пользователя\nPUT /api/users/42 -> Обновить пользователя id=42\nDELETE /api/users/42 -> Удалить пользователя id=42\nGET /api/unknown -> 404 Not Found',
      hint: 'Разбейте path по "/" и анализируйте количество сегментов. Если сегментов 3 — это коллекция (/api/users), если 4 — конкретный ресурс (/api/users/42).',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        String[][] requests = {\n            {"GET", "/api/users"},\n            {"GET", "/api/users/42"},\n            {"POST", "/api/users"},\n            {"PUT", "/api/users/42"},\n            {"DELETE", "/api/users/42"},\n            {"GET", "/api/unknown"}\n        };\n\n        for (String[] req : requests) {\n            String result = route(req[0], req[1]);\n            System.out.println(req[0] + " " + req[1] + " -> " + result);\n        }\n    }\n\n    static String route(String method, String path) {\n        String[] segments = path.split("/");\n        // /api/users -> ["", "api", "users"]\n        // /api/users/42 -> ["", "api", "users", "42"]\n\n        if (segments.length < 3 || !segments[1].equals("api")) {\n            return "404 Not Found";\n        }\n\n        String resource = segments[2];\n        if (!resource.equals("users")) {\n            return "404 Not Found";\n        }\n\n        boolean hasId = segments.length == 4;\n        String id = hasId ? segments[3] : null;\n\n        switch (method) {\n            case "GET":\n                return hasId\n                    ? "Получить пользователя id=" + id\n                    : "Получить список пользователей";\n            case "POST":\n                return "Создать пользователя";\n            case "PUT":\n                return hasId\n                    ? "Обновить пользователя id=" + id\n                    : "405 Method Not Allowed";\n            case "PATCH":\n                return hasId\n                    ? "Частично обновить пользователя id=" + id\n                    : "405 Method Not Allowed";\n            case "DELETE":\n                return hasId\n                    ? "Удалить пользователя id=" + id\n                    : "405 Method Not Allowed";\n            default:\n                return "405 Method Not Allowed";\n        }\n    }\n}',
      explanation: 'Маршрутизация — это сопоставление HTTP метода и URL с конкретным обработчиком. Каждый веб-фреймворк (Spring, Express, Django) реализует маршрутизатор. Мы разбиваем путь по "/" и анализируем сегменты: /api/users — работа с коллекцией, /api/users/42 — работа с конкретным ресурсом. Метод определяет действие (GET = чтение, POST = создание и т.д.).'
    }
  ]
}
