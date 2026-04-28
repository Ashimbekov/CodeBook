export default {
  id: 11,
  title: 'Rate Limiting & Caching',
  description: 'Ограничение частоты запросов (Rate Limiting) и кэширование HTTP-ответов (Caching) для производительности и защиты API.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужен Rate Limiting',
      type: 'theory',
      content: [
        { type: 'text', value: 'Rate Limiting ограничивает количество запросов к API за единицу времени. Это защищает от DDoS-атак, предотвращает злоупотребления и обеспечивает справедливое распределение ресурсов между клиентами.' },
        { type: 'heading', value: 'Rate Limiting в действии' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    // Лимит: 5 запросов в минуту\n    static final int LIMIT = 5;\n    static final long WINDOW_MS = 60_000;\n    static Map<String, List<Long>> requestLog = new HashMap<>();\n\n    public static void main(String[] args) {\n        String clientIp = "192.168.1.42";\n\n        System.out.println("Лимит: " + LIMIT + " запросов в минуту\\n");\n\n        // Симуляция 7 запросов\n        for (int i = 1; i <= 7; i++) {\n            String result = handleRequest(clientIp);\n            System.out.println("Запрос " + i + ": " + result);\n        }\n\n        // Заголовки Rate Limit\n        System.out.println("\\n=== Заголовки ответа ===");\n        System.out.println("X-RateLimit-Limit: " + LIMIT);\n        int remaining = Math.max(0, LIMIT - getRequestCount(clientIp));\n        System.out.println("X-RateLimit-Remaining: " + remaining);\n        System.out.println("X-RateLimit-Reset: " + (System.currentTimeMillis() / 1000 + 60));\n        System.out.println("Retry-After: 60");\n    }\n\n    static String handleRequest(String clientId) {\n        long now = System.currentTimeMillis();\n        List<Long> timestamps = requestLog.computeIfAbsent(clientId, k -> new ArrayList<>());\n\n        // Удаляем запросы за пределами окна\n        timestamps.removeIf(t -> now - t > WINDOW_MS);\n\n        if (timestamps.size() >= LIMIT) {\n            return "429 Too Many Requests — лимит исчерпан";\n        }\n\n        timestamps.add(now);\n        int remaining = LIMIT - timestamps.size();\n        return "200 OK (осталось: " + remaining + "/" + LIMIT + ")";\n    }\n\n    static int getRequestCount(String clientId) {\n        return requestLog.getOrDefault(clientId, Collections.emptyList()).size();\n    }\n}' },
        { type: 'heading', value: 'Заголовки Rate Limit' },
        { type: 'list', items: [
          'X-RateLimit-Limit — максимальное количество запросов в окне',
          'X-RateLimit-Remaining — сколько запросов осталось',
          'X-RateLimit-Reset — Unix timestamp когда лимит сбросится',
          'Retry-After — через сколько секунд можно повторить (при 429)'
        ]},
        { type: 'tip', value: 'GitHub API: 5000 запросов/час для аутентифицированных, 60 для анонимных. Stripe: 100 запросов/сек в live, 25 в test. Twitter: разные лимиты на каждый endpoint.' }
      ]
    },
    {
      id: 2,
      title: 'Алгоритмы Rate Limiting',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существует несколько алгоритмов Rate Limiting: Fixed Window, Sliding Window, Token Bucket, Leaky Bucket. Каждый имеет свои преимущества.' },
        { type: 'heading', value: 'Fixed Window vs Sliding Window' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("=== Fixed Window ===");\n        System.out.println("Окно: каждую минуту (00:00, 01:00, ...)");\n        System.out.println("Лимит: 10 запросов в минуту");\n        System.out.println();\n        System.out.println("00:55 — 8 запросов  -> OK (осталось 2)");\n        System.out.println("00:59 — 2 запроса   -> OK (осталось 0)");\n        System.out.println("01:01 — 10 запросов -> OK (новое окно!)");\n        System.out.println("Проблема: 12 запросов за 6 секунд (00:59-01:01)!\\n");\n\n        System.out.println("=== Sliding Window ===");\n        System.out.println("Окно: последние 60 секунд (скользящее)");\n        System.out.println("Лимит: 10 запросов в минуту");\n        System.out.println();\n        System.out.println("00:55 — 8 запросов  -> OK");\n        System.out.println("00:59 — 2 запроса   -> OK (10/10)");\n        System.out.println("01:01 — 1 запрос    -> 429! (ещё 8 из 00:55 в окне)");\n        System.out.println("01:56 — 1 запрос    -> OK (запросы 00:55 вышли из окна)\\n");\n\n        // Token Bucket\n        System.out.println("=== Token Bucket ===");\n        System.out.println("Корзина: 10 токенов, пополнение 1 токен/6 сек");\n        int tokens = 10;\n        String[] requests = {"burst 5", "burst 3", "wait 30s", "burst 5", "burst 4"};\n        for (String req : requests) {\n            if (req.startsWith("burst")) {\n                int count = Integer.parseInt(req.split(" ")[1]);\n                if (count <= tokens) {\n                    tokens -= count;\n                    System.out.println("  " + req + " -> OK (осталось: " + tokens + ")");\n                } else {\n                    System.out.println("  " + req + " -> 429! (доступно: " + tokens + ")");\n                }\n            } else {\n                tokens = Math.min(10, tokens + 5); // +5 за 30 сек\n                System.out.println("  " + req + " -> пополнено до " + tokens);\n            }\n        }\n    }\n}' },
        { type: 'heading', value: 'Сравнение алгоритмов' },
        { type: 'list', items: [
          'Fixed Window — простой, но допускает всплески на границе окон',
          'Sliding Window — точный, но требует больше памяти (хранит timestamp каждого запроса)',
          'Token Bucket — гибкий, позволяет контролируемые всплески (burst)',
          'Leaky Bucket — ровный поток, без всплесков (как очередь)'
        ]},
        { type: 'note', value: 'Redis часто используется для Rate Limiting в распределённых системах. Команды INCR + EXPIRE реализуют Fixed Window, а ZADD + ZRANGEBYSCORE — Sliding Window.' }
      ]
    },
    {
      id: 3,
      title: 'HTTP кэширование',
      type: 'theory',
      content: [
        { type: 'text', value: 'HTTP кэширование позволяет клиентам и прокси-серверам хранить ответы и повторно использовать их. Это снижает нагрузку на сервер и ускоряет ответы.' },
        { type: 'heading', value: 'Заголовки кэширования' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Cache-Control\n        System.out.println("=== Cache-Control ===");\n        System.out.println("Публичные данные (список товаров):");\n        System.out.println("  Cache-Control: public, max-age=3600");\n        System.out.println("  -> Кэшировать на 1 час, можно на CDN\\n");\n\n        System.out.println("Приватные данные (профиль):");\n        System.out.println("  Cache-Control: private, max-age=300");\n        System.out.println("  -> Кэшировать 5 мин, только у клиента\\n");\n\n        System.out.println("Динамические данные (баланс):");\n        System.out.println("  Cache-Control: no-cache");\n        System.out.println("  -> Проверять свежесть каждый раз\\n");\n\n        System.out.println("Секретные данные (пароли, токены):");\n        System.out.println("  Cache-Control: no-store");\n        System.out.println("  -> Не кэшировать вообще\\n");\n\n        // ETag\n        System.out.println("=== ETag (условные запросы) ===");\n        String data = "{\\\"id\\\": 42, \\\"name\\\": \\\"Алия\\\"}";\n        String etag = "\\\"" + Integer.toHexString(data.hashCode()) + "\\\"";\n\n        System.out.println("1. GET /api/users/42");\n        System.out.println("   Ответ: 200 OK");\n        System.out.println("   ETag: " + etag);\n        System.out.println("   Body: " + data);\n\n        System.out.println("\\n2. GET /api/users/42");\n        System.out.println("   If-None-Match: " + etag);\n        System.out.println("   Ответ: 304 Not Modified (тело не передаётся!)");\n        System.out.println("   Экономия трафика!");\n\n        System.out.println("\\n3. PUT /api/users/42 (данные изменились)");\n        String newData = "{\\\"id\\\": 42, \\\"name\\\": \\\"Алия Сериковна\\\"}";\n        String newEtag = "\\\"" + Integer.toHexString(newData.hashCode()) + "\\\"";\n        System.out.println("   GET /api/users/42");\n        System.out.println("   If-None-Match: " + etag);\n        System.out.println("   Ответ: 200 OK (данные изменились)");\n        System.out.println("   ETag: " + newEtag);\n    }\n}' },
        { type: 'heading', value: 'Директивы Cache-Control' },
        { type: 'list', items: [
          'public — можно кэшировать на CDN и прокси',
          'private — только в браузере клиента',
          'max-age=N — кэш живёт N секунд',
          'no-cache — кэшировать, но проверять свежесть (ETag/Last-Modified)',
          'no-store — не кэшировать вообще',
          'must-revalidate — после истечения обязательно проверять'
        ]},
        { type: 'tip', value: 'GitHub API отправляет ETag с каждым ответом. Если повторить GET с If-None-Match и данные не изменились — 304 Not Modified. Это не считается в лимит 5000 запросов/час!' }
      ]
    },
    {
      id: 4,
      title: 'Стратегии кэширования API',
      type: 'theory',
      content: [
        { type: 'text', value: 'Разные endpoints требуют разных стратегий кэширования. Статичные справочники кэшируются надолго, пользовательские данные — коротко, а мутирующие операции — не кэшируются.' },
        { type: 'heading', value: 'Стратегии по типу ресурса' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Кэширование по типу данных\n        String[][] strategies = {\n            {"GET /api/countries", "public, max-age=86400",\n                "Справочник стран — меняется редко, кэш 24 часа"},\n            {"GET /api/products", "public, max-age=300",\n                "Каталог товаров — кэш 5 мин, CDN"},\n            {"GET /api/products/{id}", "public, max-age=60, stale-while-revalidate=300",\n                "Карточка товара — кэш 1 мин, фон обновление"},\n            {"GET /api/users/me", "private, max-age=60",\n                "Мой профиль — только у клиента, 1 мин"},\n            {"GET /api/orders", "private, no-cache",\n                "Мои заказы — проверять свежесть каждый раз"},\n            {"GET /api/balance", "no-store",\n                "Баланс — не кэшировать (актуальность критична)"},\n            {"POST /api/orders", "no-store",\n                "Создание заказа — никогда не кэшировать"},\n        };\n\n        System.out.println("=== Стратегии кэширования ===\\n");\n        for (String[] s : strategies) {\n            System.out.println(s[0]);\n            System.out.println("  Cache-Control: " + s[1]);\n            System.out.println("  " + s[2]);\n            System.out.println();\n        }\n\n        // CDN кэширование\n        System.out.println("=== CDN (Surrogate-Control) ===");\n        System.out.println("Cache-Control: private, no-cache");\n        System.out.println("CDN-Cache-Control: public, max-age=300");\n        System.out.println("-> Клиент не кэширует, CDN кэширует 5 мин");\n    }\n}' },
        { type: 'heading', value: 'Инвалидация кэша' },
        { type: 'list', items: [
          'Time-based — кэш автоматически истекает (max-age)',
          'Event-based — сервер сбрасывает кэш при изменении данных',
          'Versioned URL — /api/v1/config?v=abc123 (новая версия = новый URL)',
          'Purge API — DELETE /cache/products/{id} (принудительная очистка CDN)',
          'stale-while-revalidate — отдать старый кэш, обновить в фоне'
        ]},
        { type: 'warning', value: 'Не кэшируйте POST, PUT, PATCH, DELETE запросы. Не кэшируйте ответы с Set-Cookie. Не кэшируйте персональные данные на CDN (Cache-Control: private).' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Rate Limiter',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Rate Limiter с алгоритмом Sliding Window, поддержкой разных лимитов для разных клиентов.',
      requirements: [
        'Лимиты: FREE — 5 запросов/мин, BASIC — 20 запросов/мин, PREMIUM — 100 запросов/мин',
        'Алгоритм: Sliding Window (учитывайте timestamp каждого запроса)',
        'Возвращайте заголовки: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset',
        'При превышении лимита возвращайте 429 с заголовком Retry-After',
        'Продемонстрируйте работу для FREE (6 запросов) и PREMIUM (3 запроса)'
      ],
      expectedOutput: '=== FREE план (лимит: 5/мин) ===\nЗапрос 1: 200 OK [Remaining: 4/5]\nЗапрос 2: 200 OK [Remaining: 3/5]\nЗапрос 3: 200 OK [Remaining: 2/5]\nЗапрос 4: 200 OK [Remaining: 1/5]\nЗапрос 5: 200 OK [Remaining: 0/5]\nЗапрос 6: 429 Too Many Requests [Retry-After: 60]\n\n=== PREMIUM план (лимит: 100/мин) ===\nЗапрос 1: 200 OK [Remaining: 99/100]\nЗапрос 2: 200 OK [Remaining: 98/100]\nЗапрос 3: 200 OK [Remaining: 97/100]',
      hint: 'Используйте Map<String, List<Long>> для хранения timestamp запросов. Перед каждым запросом удаляйте записи старше 60 секунд.',
      solution: 'import java.util.*;\n\npublic class Main {\n    static Map<String, Integer> planLimits = Map.of(\n        "FREE", 5, "BASIC", 20, "PREMIUM", 100\n    );\n    static Map<String, List<Long>> requestLog = new HashMap<>();\n    static final long WINDOW_MS = 60_000;\n\n    public static void main(String[] args) {\n        // FREE план\n        System.out.println("=== FREE план (лимит: 5/мин) ===");\n        for (int i = 1; i <= 6; i++) {\n            System.out.println("Запрос " + i + ": " + handleRequest("user-1", "FREE"));\n        }\n\n        // PREMIUM план\n        System.out.println("\\n=== PREMIUM план (лимит: 100/мин) ===");\n        for (int i = 1; i <= 3; i++) {\n            System.out.println("Запрос " + i + ": " + handleRequest("user-2", "PREMIUM"));\n        }\n    }\n\n    static String handleRequest(String clientId, String plan) {\n        long now = System.currentTimeMillis();\n        int limit = planLimits.getOrDefault(plan, 5);\n\n        List<Long> timestamps = requestLog.computeIfAbsent(clientId,\n            k -> new ArrayList<>());\n\n        // Sliding window: удаляем старые записи\n        timestamps.removeIf(t -> now - t > WINDOW_MS);\n\n        if (timestamps.size() >= limit) {\n            return "429 Too Many Requests [Retry-After: 60]";\n        }\n\n        timestamps.add(now);\n        int remaining = limit - timestamps.size();\n        return "200 OK [Remaining: " + remaining + "/" + limit + "]";\n    }\n}',
      explanation: 'Sliding Window Rate Limiter хранит timestamp каждого запроса. При новом запросе удаляются записи старше окна (60 сек), затем проверяется размер списка. Разные планы (FREE, PREMIUM) имеют разные лимиты. Заголовки X-RateLimit-* информируют клиента о состоянии лимита. В продакшене вместо HashMap используют Redis (ZADD + ZREMRANGEBYSCORE).'
    },
    {
      id: 6,
      title: 'Практика: HTTP кэш-менеджер',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте HTTP кэш-менеджер с поддержкой ETag, max-age и условных запросов (If-None-Match).',
      requirements: [
        'Кэш хранит: URL -> {data, etag, cachedAt, maxAge}',
        'GET запрос: если кэш свежий -> вернуть из кэша, если устарел -> условный запрос',
        'Поддержка ETag: генерация хэша от данных, сравнение If-None-Match',
        '304 Not Modified если данные не изменились',
        'Продемонстрируйте: первый запрос, из кэша, 304, инвалидация после PUT'
      ],
      expectedOutput: '=== 1. Первый GET /products/1 ===\n200 OK (от сервера)\nETag: "a1b2c3"\nCache-Control: max-age=60\nBody: {id: 1, name: iPhone, price: 999}\n\n=== 2. Повторный GET /products/1 (кэш свежий) ===\n200 OK (из кэша, без запроса к серверу)\nВозраст кэша: 0 сек\n\n=== 3. GET /products/1 (кэш устарел, данные те же) ===\n304 Not Modified (сервер подтвердил)\nЭкономия трафика!\n\n=== 4. PUT /products/1 + GET (данные изменились) ===\n200 OK (от сервера, новые данные)\nETag: "d4e5f6"\nBody: {id: 1, name: iPhone 15, price: 1099}',
      hint: 'Используйте Map<String, Map<String, Object>> для кэша. ETag = Integer.toHexString(data.hashCode()). При PUT — обновляйте данные на "сервере" и инвалидируйте кэш.',
      solution: 'import java.util.*;\n\npublic class Main {\n    // "Сервер" — хранилище данных\n    static Map<String, String> serverData = new HashMap<>();\n    static {\n        serverData.put("/products/1", "{id: 1, name: iPhone, price: 999}");\n    }\n\n    // Кэш клиента\n    static Map<String, Map<String, Object>> cache = new HashMap<>();\n\n    public static void main(String[] args) {\n        // 1. Первый запрос — кэш пустой\n        System.out.println("=== 1. Первый GET /products/1 ===");\n        get("/products/1", 60);\n\n        // 2. Повторный запрос — кэш свежий\n        System.out.println("\\n=== 2. Повторный GET /products/1 (кэш свежий) ===");\n        get("/products/1", 60);\n\n        // 3. Кэш устарел — условный запрос\n        System.out.println("\\n=== 3. GET /products/1 (кэш устарел, данные те же) ===");\n        expireCache("/products/1");\n        get("/products/1", 60);\n\n        // 4. Данные изменились\n        System.out.println("\\n=== 4. PUT /products/1 + GET (данные изменились) ===");\n        serverData.put("/products/1", "{id: 1, name: iPhone 15, price: 1099}");\n        cache.remove("/products/1");\n        get("/products/1", 60);\n    }\n\n    static void get(String url, int maxAge) {\n        Map<String, Object> cached = cache.get(url);\n\n        // Кэш свежий?\n        if (cached != null) {\n            long age = System.currentTimeMillis() - (long) cached.get("cachedAt");\n            if (age < (int) cached.get("maxAge") * 1000L) {\n                System.out.println("200 OK (из кэша, без запроса к серверу)");\n                System.out.println("Возраст кэша: " + (age / 1000) + " сек");\n                return;\n            }\n\n            // Условный запрос с ETag\n            String cachedEtag = (String) cached.get("etag");\n            String serverEtag = generateEtag(serverData.get(url));\n\n            if (cachedEtag.equals(serverEtag)) {\n                System.out.println("304 Not Modified (сервер подтвердил)");\n                System.out.println("Экономия трафика!");\n                cached.put("cachedAt", System.currentTimeMillis());\n                return;\n            }\n        }\n\n        // Полный запрос к серверу\n        String data = serverData.get(url);\n        String etag = generateEtag(data);\n\n        System.out.println("200 OK (от сервера)");\n        System.out.println("ETag: \\\"" + etag + "\\\"");\n        System.out.println("Cache-Control: max-age=" + maxAge);\n        System.out.println("Body: " + data);\n\n        // Сохраняем в кэш\n        Map<String, Object> entry = new HashMap<>();\n        entry.put("data", data);\n        entry.put("etag", etag);\n        entry.put("cachedAt", System.currentTimeMillis());\n        entry.put("maxAge", maxAge);\n        cache.put(url, entry);\n    }\n\n    static void expireCache(String url) {\n        Map<String, Object> cached = cache.get(url);\n        if (cached != null) {\n            cached.put("cachedAt", 0L);\n        }\n    }\n\n    static String generateEtag(String data) {\n        return Integer.toHexString(Math.abs(data.hashCode()));\n    }\n}',
      explanation: 'HTTP кэширование работает в 3 режима: 1) Кэш свежий (max-age не истёк) — ответ из кэша без запроса к серверу. 2) Кэш устарел, но данные не изменились — 304 Not Modified (экономия трафика). 3) Данные изменились — полный ответ 200. ETag — хэш данных, позволяет серверу сравнить без передачи тела. В продакшене кэширование реализуют CDN (Cloudflare, CloudFront) и прокси (Nginx, Varnish).'
    }
  ]
}
