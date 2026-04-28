export default {
  id: 7,
  title: 'Версионирование API',
  description: 'Стратегии версионирования REST API: через URL, заголовки, query параметры, deprecation и миграция.',
  lessons: [
    {
      id: 1,
      title: 'Зачем версионировать API',
      type: 'theory',
      content: [
        { type: 'text', value: 'API эволюционирует: добавляются новые поля, меняется формат ответа, удаляются устаревшие endpoints. Версионирование позволяет вносить несовместимые изменения (breaking changes) без поломки существующих клиентов.' },
        { type: 'heading', value: 'Что такое breaking change?' },
        { type: 'list', items: [
          'Удаление поля из ответа',
          'Изменение типа поля (String -> Number)',
          'Изменение структуры ответа (плоский -> вложенный)',
          'Удаление endpoint',
          'Изменение семантики (поле price было в тенге, стало в тиынах)',
          'Изменение обязательности поля в запросе'
        ]},
        { type: 'heading', value: 'Что НЕ является breaking change' },
        { type: 'list', items: [
          'Добавление нового поля в ответ',
          'Добавление нового endpoint',
          'Добавление опционального параметра в запрос',
          'Расширение enum новыми значениями (если клиент обрабатывает unknown)',
          'Добавление нового HTTP метода к существующему ресурсу'
        ]},
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("=== Breaking Changes ===");\n        System.out.println("v1: {\\\"name\\\": \\\"Алия\\\"}         <- поле name");\n        System.out.println("v2: {\\\"firstName\\\": \\\"Алия\\\"}    <- name -> firstName (BREAKING!)");\n        System.out.println();\n        System.out.println("v1: {\\\"price\\\": 1500}           <- price в тенге");\n        System.out.println("v2: {\\\"price\\\": 150000}         <- price в тиынах (BREAKING!)");\n        System.out.println();\n        System.out.println("=== НЕ Breaking Changes ===");\n        System.out.println("v1: {\\\"name\\\": \\\"Алия\\\"}");\n        System.out.println("v1+: {\\\"name\\\": \\\"Алия\\\", \\\"age\\\": 25}  <- добавили поле (ОК)");\n    }\n}' },
        { type: 'tip', value: 'Правило: добавлять можно, удалять/менять нельзя. Если клиент написан на Java, добавление нового поля в JSON не сломает десериализацию (Jackson игнорирует неизвестные поля по умолчанию).' }
      ]
    },
    {
      id: 2,
      title: 'Версионирование через URL',
      type: 'theory',
      content: [
        { type: 'text', value: 'Версия в URL — самый распространённый и простой подход. Версия указывается в начале пути: /api/v1/users, /api/v2/users.' },
        { type: 'heading', value: 'Примеры реальных API' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        // URL-based versioning\n        System.out.println("=== URL Versioning ===");\n        System.out.println("Stripe:  https://api.stripe.com/v1/charges");\n        System.out.println("Twitter: https://api.twitter.com/2/tweets");\n        System.out.println("Kaspi:   https://api.kaspi.kz/api/v1/payments");\n        System.out.println();\n\n        // Маршрутизация по версии\n        String[][] requests = {\n            {"GET", "/api/v1/users/42"},\n            {"GET", "/api/v2/users/42"},\n            {"GET", "/api/v3/users/42"}\n        };\n\n        for (String[] req : requests) {\n            String result = routeVersioned(req[0], req[1]);\n            System.out.println(req[0] + " " + req[1] + " -> " + result);\n        }\n    }\n\n    static String routeVersioned(String method, String path) {\n        String[] segments = path.split("/");\n        if (segments.length < 3) return "400 Bad Request";\n\n        String version = segments[2]; // v1, v2, ...\n\n        switch (version) {\n            case "v1":\n                return "200 OK: {\\\"name\\\": \\\"Алия\\\"}";\n            case "v2":\n                return "200 OK: {\\\"firstName\\\": \\\"Алия\\\", \\\"lastName\\\": \\\"Серикова\\\"}";\n            default:\n                return "404 Not Found: версия " + version + " не поддерживается";\n        }\n    }\n}' },
        { type: 'heading', value: 'Плюсы и минусы URL versioning' },
        { type: 'list', items: [
          'Плюсы: простота, наглядность, легко тестировать в браузере',
          'Плюсы: кэширование работает из коробки (разные URL = разные кэши)',
          'Плюсы: легко документировать (отдельная документация для каждой версии)',
          'Минусы: нарушает REST (URI должен идентифицировать ресурс, а не версию)',
          'Минусы: дублирование кода при множестве версий'
        ]},
        { type: 'note', value: 'Несмотря на теоретический минус (нарушение REST), URL versioning — стандарт индустрии. Stripe, Twitter, Google Maps, Kaspi — все используют этот подход.' }
      ]
    },
    {
      id: 3,
      title: 'Версионирование через заголовки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Версия в HTTP заголовке — более "чистый" REST подход. URL остаётся неизменным, версия передаётся в заголовке Accept или кастомном заголовке.' },
        { type: 'heading', value: 'Два подхода' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Подход 1: Content Negotiation (Accept header)\n        System.out.println("=== Accept Header (GitHub стиль) ===");\n        System.out.println("GET /api/users/42");\n        System.out.println("Accept: application/vnd.myapi.v1+json");\n        System.out.println("-> v1 ответ\\n");\n\n        System.out.println("GET /api/users/42");\n        System.out.println("Accept: application/vnd.myapi.v2+json");\n        System.out.println("-> v2 ответ\\n");\n\n        // Подход 2: Кастомный заголовок\n        System.out.println("=== Кастомный заголовок ===");\n        System.out.println("GET /api/users/42");\n        System.out.println("X-API-Version: 2");\n        System.out.println("-> v2 ответ\\n");\n\n        // Подход 3: Дата вместо номера (Stripe стиль)\n        System.out.println("=== Дата-версия (Stripe стиль) ===");\n        System.out.println("GET /v1/charges");\n        System.out.println("Stripe-Version: 2024-01-15");\n        System.out.println("-> ответ по версии API от 15 января 2024\\n");\n\n        // Демонстрация маршрутизации\n        System.out.println("=== Маршрутизация ===");\n        System.out.println(handleRequest("/api/users/42", "application/vnd.myapi.v1+json"));\n        System.out.println(handleRequest("/api/users/42", "application/vnd.myapi.v2+json"));\n        System.out.println(handleRequest("/api/users/42", "application/json"));\n    }\n\n    static String handleRequest(String path, String accept) {\n        String version = "v1"; // default\n        if (accept.contains("v2")) version = "v2";\n        else if (accept.contains("v3")) version = "v3";\n\n        String response;\n        switch (version) {\n            case "v1": response = "{\\\"name\\\": \\\"Алия\\\"}"; break;\n            case "v2": response = "{\\\"firstName\\\": \\\"Алия\\\", \\\"lastName\\\": \\\"Серикова\\\"}"; break;\n            default: response = "404 Version not found";\n        }\n        return "Accept: " + accept + " -> " + version + ": " + response;\n    }\n}' },
        { type: 'heading', value: 'GitHub API: content negotiation' },
        { type: 'text', value: 'GitHub API использует Accept header: application/vnd.github.v3+json. Это позволяет менять версию без изменения URL. Но на практике большинство разработчиков используют URL versioning.' },
        { type: 'tip', value: 'Stripe использует гибридный подход: /v1/ в URL + Stripe-Version: 2024-01-15 в заголовке. URL определяет мажорную версию, заголовок — минорную. Это лучший из обоих миров.' }
      ]
    },
    {
      id: 4,
      title: 'Deprecation и миграция',
      type: 'theory',
      content: [
        { type: 'text', value: 'Deprecation — это процесс вывода старой версии API из эксплуатации. Нельзя просто взять и выключить старую версию — нужно дать клиентам время на миграцию.' },
        { type: 'heading', value: 'Процесс deprecation' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("=== Процесс Deprecation ===");\n        System.out.println();\n\n        // Шаг 1: Анонс\n        System.out.println("Шаг 1: Анонс (за 6-12 месяцев)");\n        System.out.println("  - Объявление в блоге и changelog");\n        System.out.println("  - Email разработчикам");\n        System.out.println("  - Заголовок Deprecation в ответах v1");\n        System.out.println();\n\n        // Шаг 2: Заголовки deprecation\n        System.out.println("Шаг 2: Заголовки в ответах v1");\n        Map<String, String> headers = new LinkedHashMap<>();\n        headers.put("Deprecation", "true");\n        headers.put("Sunset", "2025-06-01T00:00:00Z");\n        headers.put("Link", "</api/v2/users>; rel=\\\"successor-version\\\"");\n        headers.forEach((k, v) -> System.out.println("  " + k + ": " + v));\n        System.out.println();\n\n        // Шаг 3: Предупреждения\n        System.out.println("Шаг 3: Warning заголовок");\n        System.out.println("  Warning: 299 - \\\"API v1 deprecated. Use v2. Sunset: 2025-06-01\\\"\");\n        System.out.println();\n\n        // Шаг 4: Отключение\n        System.out.println("Шаг 4: После даты Sunset");\n        System.out.println("  GET /api/v1/users -> 410 Gone");\n        System.out.println("  Body: {\\\"error\\\": \\\"API v1 отключён. Используйте /api/v2/users\\\"}");\n\n        System.out.println();\n        System.out.println("=== Рекомендуемые сроки ===");\n        System.out.println("  Публичный API: минимум 12 месяцев");\n        System.out.println("  Внутренний API: минимум 3 месяца");\n        System.out.println("  Stripe: поддерживает все версии за последние 3 года!");\n    }\n}' },
        { type: 'heading', value: 'Заголовки для deprecation' },
        { type: 'list', items: [
          'Deprecation: true — endpoint устарел',
          'Sunset: 2025-06-01T00:00:00Z — дата отключения (RFC 8594)',
          'Link: </v2/resource>; rel="successor-version" — ссылка на новую версию',
          'Warning: 299 - "описание" — предупреждение для разработчиков'
        ]},
        { type: 'warning', value: 'Никогда не отключайте версию API без предупреждения! Stripe объявляет deprecation за 12+ месяцев и отправляет email всем разработчикам. Это уважение к экосистеме.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Версионированный маршрутизатор',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте маршрутизатор, поддерживающий несколько версий API с разными форматами ответов.',
      requirements: [
        'Поддержите версии v1 и v2 через URL (/api/v1/users, /api/v2/users)',
        'v1 возвращает: {name: "Алия Серикова", email: "aliya@mail.kz"}',
        'v2 возвращает: {firstName: "Алия", lastName: "Серикова", contacts: {email: "aliya@mail.kz"}}',
        'Добавьте заголовки Deprecation и Sunset для v1',
        'Для неизвестных версий верните 404',
        'Покажите оба формата ответа'
      ],
      expectedOutput: 'GET /api/v1/users/1 -> 200 OK\nHeaders: Deprecation: true, Sunset: 2025-12-01\nBody: {"name":"Алия Серикова","email":"aliya@mail.kz"}\n\nGET /api/v2/users/1 -> 200 OK\nBody: {"firstName":"Алия","lastName":"Серикова","contacts":{"email":"aliya@mail.kz"}}\n\nGET /api/v3/users/1 -> 404 Not Found\nBody: {"error":"API version v3 not found"}',
      hint: 'Разберите URL для извлечения версии. Создайте отдельные методы formatV1() и formatV2() для разных форматов ответа.',
      solution: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        String[] urls = {\n            "/api/v1/users/1",\n            "/api/v2/users/1",\n            "/api/v3/users/1"\n        };\n\n        for (String url : urls) {\n            System.out.println("GET " + url);\n            handleRequest(url);\n            System.out.println();\n        }\n    }\n\n    static void handleRequest(String url) {\n        String[] segments = url.split("/");\n        String version = segments[2];\n\n        switch (version) {\n            case "v1": {\n                System.out.println("-> 200 OK");\n                System.out.println("Headers:");\n                System.out.println("  Deprecation: true");\n                System.out.println("  Sunset: 2025-12-01T00:00:00Z");\n                System.out.println("  Link: </api/v2/users/1>; rel=\\\"successor-version\\\"");\n                System.out.println("  Warning: 299 - \\\"v1 deprecated, use v2\\\"");\n                System.out.println("Body: " + formatV1());\n                break;\n            }\n            case "v2": {\n                System.out.println("-> 200 OK");\n                System.out.println("Body: " + formatV2());\n                break;\n            }\n            default: {\n                System.out.println("-> 404 Not Found");\n                System.out.println("Body: {\\\"error\\\": \\\"API version " + version + " not found\\\","\n                    + " \\\"availableVersions\\\": [\\\"v1\\\", \\\"v2\\\"]}");\n            }\n        }\n    }\n\n    static String formatV1() {\n        // v1: плоская структура, полное имя\n        Map<String, Object> response = new LinkedHashMap<>();\n        response.put("id", 1);\n        response.put("name", "Алия Серикова");\n        response.put("email", "aliya@mail.kz");\n        response.put("city", "Алматы");\n        return toJson(response);\n    }\n\n    static String formatV2() {\n        // v2: структурированная, имя разделено, контакты вложены\n        Map<String, Object> contacts = new LinkedHashMap<>();\n        contacts.put("email", "aliya@mail.kz");\n        contacts.put("phone", "+77011234567");\n\n        Map<String, Object> address = new LinkedHashMap<>();\n        address.put("city", "Алматы");\n        address.put("country", "KZ");\n\n        Map<String, Object> response = new LinkedHashMap<>();\n        response.put("id", 1);\n        response.put("firstName", "Алия");\n        response.put("lastName", "Серикова");\n        response.put("contacts", contacts);\n        response.put("address", address);\n        return toJson(response);\n    }\n\n    @SuppressWarnings("unchecked")\n    static String toJson(Object obj) {\n        if (obj instanceof String) return "\\\"" + obj + "\\\"";\n        if (obj instanceof Number) return obj.toString();\n        if (obj instanceof Map) {\n            Map<String, Object> map = (Map<String, Object>) obj;\n            StringBuilder sb = new StringBuilder("{");\n            int i = 0;\n            for (Map.Entry<String, Object> e : map.entrySet()) {\n                if (i > 0) sb.append(", ");\n                sb.append("\\\"").append(e.getKey()).append("\\\": ").append(toJson(e.getValue()));\n                i++;\n            }\n            return sb.append("}").toString();\n        }\n        return String.valueOf(obj);\n    }\n}',
      explanation: 'Версионированный маршрутизатор извлекает версию из URL и вызывает соответствующий обработчик. v1 использует плоскую структуру (name = полное имя), v2 — структурированную (firstName + lastName, вложенные contacts). v1 помечен deprecated с заголовками Sunset и Link на v2. Это позволяет клиентам плавно мигрировать.'
    },
    {
      id: 6,
      title: 'Практика: Changelog генератор',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте генератор changelog для API, который документирует изменения между версиями.',
      requirements: [
        'Определите список изменений между v1 и v2 с типами: added, changed, deprecated, removed',
        'Для каждого изменения укажите: тип, endpoint, описание, breaking (true/false)',
        'Выведите changelog в читаемом формате',
        'Подсчитайте количество breaking и non-breaking changes',
        'Дайте рекомендацию: нужна ли новая мажорная версия'
      ],
      expectedOutput: '=== API Changelog: v1 -> v2 ===\n\nBREAKING CHANGES:\n  [changed] GET /users/{id} - поле name разделено на firstName и lastName\n  [changed] GET /users/{id} - поле email перенесено в contacts.email\n  [removed] GET /users - удалён параметр format=xml\n\nNON-BREAKING CHANGES:\n  [added] GET /users/{id} - добавлено поле phone\n  [added] POST /users/{id}/avatar - новый endpoint загрузки аватара\n  [deprecated] GET /users?format - используйте Accept header\n\nИтого: 3 breaking, 3 non-breaking\nРекомендация: НУЖНА новая мажорная версия (есть breaking changes)',
      hint: 'Создайте список Map с полями type, endpoint, description, breaking. Отсортируйте по breaking (сначала breaking) и выведите.',
      solution: 'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Map<String, Object>> changes = new ArrayList<>();\n\n        // Breaking changes\n        changes.add(change("changed", "GET /users/{id}",\n            "поле name разделено на firstName и lastName", true));\n        changes.add(change("changed", "GET /users/{id}",\n            "поле email перенесено в contacts.email", true));\n        changes.add(change("removed", "GET /users",\n            "удалён параметр format=xml", true));\n\n        // Non-breaking changes\n        changes.add(change("added", "GET /users/{id}",\n            "добавлено поле phone", false));\n        changes.add(change("added", "POST /users/{id}/avatar",\n            "новый endpoint загрузки аватара", false));\n        changes.add(change("deprecated", "GET /users?format",\n            "используйте Accept header", false));\n\n        // Вывод\n        System.out.println("=== API Changelog: v1 -> v2 ===\\n");\n\n        List<Map<String, Object>> breaking = changes.stream()\n            .filter(c -> (boolean) c.get("breaking"))\n            .collect(Collectors.toList());\n\n        List<Map<String, Object>> nonBreaking = changes.stream()\n            .filter(c -> !(boolean) c.get("breaking"))\n            .collect(Collectors.toList());\n\n        System.out.println("BREAKING CHANGES:");\n        for (Map<String, Object> c : breaking) {\n            System.out.printf("  [%s] %s - %s%n",\n                c.get("type"), c.get("endpoint"), c.get("description"));\n        }\n\n        System.out.println("\\nNON-BREAKING CHANGES:");\n        for (Map<String, Object> c : nonBreaking) {\n            System.out.printf("  [%s] %s - %s%n",\n                c.get("type"), c.get("endpoint"), c.get("description"));\n        }\n\n        System.out.printf("\\nИтого: %d breaking, %d non-breaking%n",\n            breaking.size(), nonBreaking.size());\n\n        if (!breaking.isEmpty()) {\n            System.out.println("Рекомендация: НУЖНА новая мажорная версия (есть breaking changes)");\n        } else {\n            System.out.println("Рекомендация: достаточно минорной версии (нет breaking changes)");\n        }\n    }\n\n    static Map<String, Object> change(String type, String endpoint,\n                                       String description, boolean breaking) {\n        Map<String, Object> c = new LinkedHashMap<>();\n        c.put("type", type);\n        c.put("endpoint", endpoint);\n        c.put("description", description);\n        c.put("breaking", breaking);\n        return c;\n    }\n}',
      explanation: 'Changelog — важный инструмент для управления версиями API. Каждое изменение классифицируется: added (новое), changed (изменённое), deprecated (устаревшее), removed (удалённое). Breaking changes требуют новой мажорной версии (v1 -> v2). Non-breaking changes можно выпускать без смены версии. Это соответствует Semantic Versioning (SemVer).'
    }
  ]
}
