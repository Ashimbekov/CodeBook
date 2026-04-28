export default {
  id: 12,
  title: 'HATEOAS и зрелость API',
  description: 'HATEOAS (Hypermedia as the Engine of Application State), модель зрелости Ричардсона и эволюция REST API.',
  lessons: [
    {
      id: 1,
      title: 'Модель зрелости Ричардсона',
      type: 'theory',
      content: [
        { type: 'text', value: 'Леонард Ричардсон предложил модель зрелости REST API из 4 уровней (0-3). Большинство API в реальности находятся на уровне 2. Уровень 3 (HATEOAS) — это "настоящий REST".' },
        { type: 'heading', value: 'Уровни зрелости' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("=== Уровень 0: Одна точка входа ===");\n        System.out.println("POST /api");\n        System.out.println("{\\\"action\\\": \\\"getUser\\\", \\\"userId\\\": 42}");\n        System.out.println("POST /api");\n        System.out.println("{\\\"action\\\": \\\"createOrder\\\", ...}");\n        System.out.println("Один URL, всё через POST, action в теле\\n");\n\n        System.out.println("=== Уровень 1: Ресурсы ===");\n        System.out.println("POST /api/users/42     (получить)");\n        System.out.println("POST /api/users        (создать)");\n        System.out.println("POST /api/orders       (создать)");\n        System.out.println("Разные URL, но всё ещё только POST\\n");\n\n        System.out.println("=== Уровень 2: HTTP методы + статус-коды ===");\n        System.out.println("GET    /api/users/42    -> 200 OK");\n        System.out.println("POST   /api/users       -> 201 Created");\n        System.out.println("PUT    /api/users/42    -> 200 OK");\n        System.out.println("DELETE /api/users/42    -> 204 No Content");\n        System.out.println("GET    /api/unknown     -> 404 Not Found");\n        System.out.println("Большинство API здесь!\\n");\n\n        System.out.println("=== Уровень 3: HATEOAS ===");\n        System.out.println("GET /api/users/42");\n        System.out.println("{");\n        System.out.println("  \\\"id\\\": 42,");\n        System.out.println("  \\\"name\\\": \\\"Алия\\\",");\n        System.out.println("  \\\"_links\\\": {");\n        System.out.println("    \\\"self\\\": {\\\"href\\\": \\\"/api/users/42\\\"},");\n        System.out.println("    \\\"orders\\\": {\\\"href\\\": \\\"/api/users/42/orders\\\"},");\n        System.out.println("    \\\"update\\\": {\\\"href\\\": \\\"/api/users/42\\\", \\\"method\\\": \\\"PUT\\\"},");\n        System.out.println("    \\\"delete\\\": {\\\"href\\\": \\\"/api/users/42\\\", \\\"method\\\": \\\"DELETE\\\"}");\n        System.out.println("  }");\n        System.out.println("}");\n        System.out.println("Ответ содержит ссылки на возможные действия!");\n    }\n}' },
        { type: 'tip', value: 'Уровень 2 — это стандарт индустрии (Stripe, GitHub, Google). Уровень 3 (HATEOAS) используется реже, но некоторые API его применяют (PayPal, Spring Data REST).' },
        { type: 'note', value: 'Рой Филдинг (создатель REST) считает, что без HATEOAS API нельзя называть RESTful. Но на практике большинство разработчиков используют термин REST для уровня 2.' }
      ]
    },
    {
      id: 2,
      title: 'HATEOAS: Гипермедиа',
      type: 'theory',
      content: [
        { type: 'text', value: 'HATEOAS (Hypermedia As The Engine Of Application State) — принцип, при котором сервер сообщает клиенту, какие действия доступны прямо сейчас, через ссылки в ответе. Клиент не должен "зашивать" URL в код.' },
        { type: 'heading', value: 'Пример: Заказ с HATEOAS' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Заказ в разных статусах — разные доступные действия\n        System.out.println("=== Заказ: CREATED ===");\n        printOrder(1, "CREATED", "iPhone", 999,\n            Map.of(\n                "self", "/api/orders/1",\n                "pay", "/api/orders/1/pay",\n                "cancel", "/api/orders/1/cancel",\n                "user", "/api/users/42"\n            ));\n\n        System.out.println("\\n=== Заказ: PAID ===");\n        printOrder(1, "PAID", "iPhone", 999,\n            Map.of(\n                "self", "/api/orders/1",\n                "cancel", "/api/orders/1/cancel",\n                "refund", "/api/orders/1/refund",\n                "track", "/api/orders/1/tracking"\n            ));\n        System.out.println("(нет ссылки pay — заказ уже оплачен!)\\n");\n\n        System.out.println("=== Заказ: SHIPPED ===");\n        printOrder(1, "SHIPPED", "iPhone", 999,\n            Map.of(\n                "self", "/api/orders/1",\n                "track", "/api/orders/1/tracking"\n            ));\n        System.out.println("(нельзя отменить или вернуть — уже отправлен!)");\n    }\n\n    static void printOrder(int id, String status, String item, int price,\n                           Map<String, String> links) {\n        System.out.println("{");\n        System.out.println("  \\\"id\\\": " + id + ",");\n        System.out.println("  \\\"status\\\": \\\"" + status + "\\\",");\n        System.out.println("  \\\"item\\\": \\\"" + item + "\\\",");\n        System.out.println("  \\\"price\\\": " + price + ",");\n        System.out.println("  \\\"_links\\\": {");\n        int i = 0;\n        for (Map.Entry<String, String> link : links.entrySet()) {\n            i++;\n            System.out.println("    \\\"" + link.getKey() + "\\\": {\\\"href\\\": \\\""\n                + link.getValue() + "\\\"}"\n                + (i < links.size() ? "," : ""));\n        }\n        System.out.println("  }");\n        System.out.println("}");\n    }\n}' },
        { type: 'heading', value: 'Преимущества HATEOAS' },
        { type: 'list', items: [
          'Клиент не зашивает URL — следует ссылкам из ответа',
          'Сервер контролирует навигацию — меняет ссылки без обновления клиента',
          'Состояние определяет действия — PAID заказ нельзя оплатить повторно',
          'Самодокументируемый API — ссылки показывают что можно делать',
          'Discoverability — клиент "открывает" API в процессе работы'
        ]},
        { type: 'warning', value: 'HATEOAS усложняет разработку клиента: нужно парсить ссылки, обрабатывать их отсутствие. Для простых API (CRUD без бизнес-логики) это избыточно.' }
      ]
    },
    {
      id: 3,
      title: 'Форматы гипермедиа',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существует несколько стандартов для представления гипермедиа ссылок в JSON: HAL, JSON:API, Siren, Collection+JSON. HAL — самый популярный благодаря простоте.' },
        { type: 'heading', value: 'Форматы гипермедиа' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        // HAL (Hypertext Application Language)\n        System.out.println("=== HAL (application/hal+json) ===");\n        System.out.println("{");\n        System.out.println("  \\\"id\\\": 42, \\\"name\\\": \\\"Алия\\\",");\n        System.out.println("  \\\"_links\\\": {");\n        System.out.println("    \\\"self\\\": {\\\"href\\\": \\\"/api/users/42\\\"},");\n        System.out.println("    \\\"orders\\\": {\\\"href\\\": \\\"/api/users/42/orders\\\"}");\n        System.out.println("  },");\n        System.out.println("  \\\"_embedded\\\": {");\n        System.out.println("    \\\"latestOrder\\\": {\\\"id\\\": 7, \\\"item\\\": \\\"iPhone\\\"}");\n        System.out.println("  }");\n        System.out.println("}\\n");\n\n        // JSON:API\n        System.out.println("=== JSON:API (application/vnd.api+json) ===");\n        System.out.println("{");\n        System.out.println("  \\\"data\\\": {");\n        System.out.println("    \\\"type\\\": \\\"users\\\",");\n        System.out.println("    \\\"id\\\": \\\"42\\\",");\n        System.out.println("    \\\"attributes\\\": {\\\"name\\\": \\\"Алия\\\"},");\n        System.out.println("    \\\"relationships\\\": {");\n        System.out.println("      \\\"orders\\\": {\\\"links\\\": {\\\"related\\\": \\\"/api/users/42/orders\\\"}}");\n        System.out.println("    },");\n        System.out.println("    \\\"links\\\": {\\\"self\\\": \\\"/api/users/42\\\"}");\n        System.out.println("  }");\n        System.out.println("}\\n");\n\n        // Сравнение\n        System.out.println("=== Сравнение ===");\n        System.out.println("HAL       — простой, _links и _embedded, широко используется");\n        System.out.println("JSON:API  — строгий, data/attributes/relationships, мощный");\n        System.out.println("Siren     — действия (actions) + ссылки, для сложных workflow");\n        System.out.println("Рекомендация: HAL для большинства случаев");\n    }\n}' },
        { type: 'heading', value: 'HAL — структура' },
        { type: 'list', items: [
          '_links — объект со ссылками (self, next, prev, related)',
          '_embedded — вложенные ресурсы (чтобы не делать лишние запросы)',
          'self — обязательная ссылка на сам ресурс',
          'href — URL ссылки',
          'templated — true если URL шаблонный (/users/{id})'
        ]},
        { type: 'note', value: 'PayPal API использует HATEOAS: каждый платёж содержит ссылки approve, capture, void. Spring HATEOAS (spring-projects/spring-hateoas) упрощает создание HAL ответов в Spring Boot.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: HATEOAS ответы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему, которая генерирует HATEOAS ответы с динамическими ссылками в зависимости от состояния ресурса.',
      requirements: [
        'Моделируйте заказ с состояниями: CREATED, PAID, SHIPPED, DELIVERED, CANCELLED',
        'Для каждого состояния определите доступные действия (ссылки)',
        'CREATED: pay, cancel; PAID: ship, refund; SHIPPED: track, deliver; DELIVERED: return; CANCELLED: нет действий',
        'Генерируйте HAL-формат с _links',
        'Покажите ответ для каждого состояния заказа'
      ],
      expectedOutput: '=== CREATED ===\n{id: 1, status: CREATED, _links: {self, pay, cancel}}\n\n=== PAID ===\n{id: 1, status: PAID, _links: {self, ship, refund}}\n\n=== SHIPPED ===\n{id: 1, status: SHIPPED, _links: {self, track, deliver}}\n\n=== DELIVERED ===\n{id: 1, status: DELIVERED, _links: {self, return}}\n\n=== CANCELLED ===\n{id: 1, status: CANCELLED, _links: {self}}',
      hint: 'Создайте Map<String, List<String[]>> где ключ — статус, значение — список пар [rel, href]. Всегда добавляйте self.',
      solution: 'import java.util.*;\n\npublic class Main {\n    static Map<String, List<String[]>> stateLinks = new LinkedHashMap<>();\n    static {\n        stateLinks.put("CREATED", Arrays.asList(\n            new String[]{"pay", "/api/orders/1/pay", "POST"},\n            new String[]{"cancel", "/api/orders/1/cancel", "POST"}\n        ));\n        stateLinks.put("PAID", Arrays.asList(\n            new String[]{"ship", "/api/orders/1/ship", "POST"},\n            new String[]{"refund", "/api/orders/1/refund", "POST"}\n        ));\n        stateLinks.put("SHIPPED", Arrays.asList(\n            new String[]{"track", "/api/orders/1/tracking", "GET"},\n            new String[]{"deliver", "/api/orders/1/deliver", "POST"}\n        ));\n        stateLinks.put("DELIVERED", Arrays.asList(\n            new String[]{"return", "/api/orders/1/return", "POST"}\n        ));\n        stateLinks.put("CANCELLED", Collections.emptyList());\n    }\n\n    public static void main(String[] args) {\n        String[] statuses = {"CREATED", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"};\n\n        for (String status : statuses) {\n            System.out.println("=== " + status + " ===");\n            printOrderHal(1, status, "iPhone 15", 499990);\n            System.out.println();\n        }\n    }\n\n    static void printOrderHal(int id, String status, String item, int price) {\n        System.out.println("{");\n        System.out.println("  \\\"id\\\": " + id + ",");\n        System.out.println("  \\\"status\\\": \\\"" + status + "\\\",");\n        System.out.println("  \\\"item\\\": \\\"" + item + "\\\",");\n        System.out.println("  \\\"price\\\": " + price + ",");\n        System.out.println("  \\\"_links\\\": {");\n\n        // self всегда\n        List<String[]> links = stateLinks.getOrDefault(status, Collections.emptyList());\n        System.out.print("    \\\"self\\\": {\\\"href\\\": \\\"/api/orders/" + id + "\\\"}");\n\n        for (String[] link : links) {\n            System.out.println(",");\n            System.out.print("    \\\"" + link[0] + "\\\": {\\\"href\\\": \\\""\n                + link[1] + "\\\", \\\"method\\\": \\\"" + link[2] + "\\\"}");\n        }\n        System.out.println();\n\n        System.out.println("  }");\n        System.out.println("}");\n    }\n}',
      explanation: 'HATEOAS делает API самоописуемым: клиент не зашивает URL, а следует ссылкам. Ключевой принцип — ссылки зависят от состояния. CREATED заказ можно оплатить или отменить, но нельзя отследить. SHIPPED — можно отследить, но нельзя оплатить. Сервер управляет доступными действиями через _links.'
    },
    {
      id: 5,
      title: 'Практика: Навигация по API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте симулятор клиента, который "ходит" по HATEOAS API, следуя ссылкам от корня до конкретного ресурса.',
      requirements: [
        'Корень API (GET /) возвращает ссылки на коллекции: users, products, orders',
        'GET /users возвращает список с пагинацией (next, prev) и ссылками на каждого пользователя',
        'GET /users/1 возвращает пользователя со ссылками на его заказы',
        'Клиент проходит путь: / -> /users -> /users/1 -> /users/1/orders',
        'На каждом шаге покажите доступные ссылки и выбранное действие'
      ],
      expectedOutput: 'Шаг 1: GET /\nДоступные ссылки: users, products, orders\nВыбираем: users\n\nШаг 2: GET /api/users\nДоступные ссылки: self, next, user[1], user[2]\nВыбираем: user[1]\n\nШаг 3: GET /api/users/1\nДоступные ссылки: self, orders, update, delete\nВыбираем: orders\n\nШаг 4: GET /api/users/1/orders\nДоступные ссылки: self, order[101], order[102]\nНайдено 2 заказа пользователя!',
      hint: 'Создайте Map<String, Map<String, Object>> как "сервер", где ключ — URL, значение — ответ с данными и _links. Клиент начинает с "/" и переходит по ссылкам.',
      solution: 'import java.util.*;\n\npublic class Main {\n    // Имитация сервера: URL -> ответ\n    static Map<String, Map<String, Object>> server = new LinkedHashMap<>();\n    static {\n        // Корень\n        Map<String, Object> root = new LinkedHashMap<>();\n        root.put("title", "My API v1");\n        root.put("_links", Map.of(\n            "users", "/api/users",\n            "products", "/api/products",\n            "orders", "/api/orders"\n        ));\n        server.put("/", root);\n\n        // Список пользователей\n        Map<String, Object> users = new LinkedHashMap<>();\n        users.put("data", "[{id:1, name:Алия}, {id:2, name:Бауыржан}]");\n        users.put("_links", new LinkedHashMap<>(Map.of(\n            "self", "/api/users",\n            "next", "/api/users?page=2",\n            "user[1]", "/api/users/1",\n            "user[2]", "/api/users/2"\n        )));\n        server.put("/api/users", users);\n\n        // Пользователь 1\n        Map<String, Object> user1 = new LinkedHashMap<>();\n        user1.put("id", 1);\n        user1.put("name", "Алия");\n        user1.put("_links", new LinkedHashMap<>(Map.of(\n            "self", "/api/users/1",\n            "orders", "/api/users/1/orders",\n            "update", "/api/users/1",\n            "delete", "/api/users/1"\n        )));\n        server.put("/api/users/1", user1);\n\n        // Заказы пользователя 1\n        Map<String, Object> orders = new LinkedHashMap<>();\n        orders.put("data", "[{id:101, item:iPhone}, {id:102, item:MacBook}]");\n        orders.put("_links", new LinkedHashMap<>(Map.of(\n            "self", "/api/users/1/orders",\n            "order[101]", "/api/orders/101",\n            "order[102]", "/api/orders/102"\n        )));\n        server.put("/api/users/1/orders", orders);\n    }\n\n    public static void main(String[] args) {\n        // Клиент проходит по ссылкам\n        String[] path = {"/", "users", "user[1]", "orders"};\n        String currentUrl = "/";\n\n        for (int step = 0; step < path.length; step++) {\n            System.out.println("Шаг " + (step + 1) + ": GET " + currentUrl);\n\n            Map<String, Object> response = server.get(currentUrl);\n            @SuppressWarnings("unchecked")\n            Map<String, String> links = (Map<String, String>) response.get("_links");\n\n            System.out.print("Доступные ссылки: ");\n            System.out.println(String.join(", ", links.keySet()));\n\n            if (step < path.length - 1) {\n                String nextRel = path[step + 1];\n                currentUrl = links.get(nextRel);\n                System.out.println("Выбираем: " + nextRel);\n            } else {\n                System.out.println("Найдено 2 заказа пользователя!");\n            }\n            System.out.println();\n        }\n    }\n}',
      explanation: 'HATEOAS-клиент не знает URL заранее — он открывает корень API и следует ссылкам. Путь: / (корень) -> /users (коллекция) -> /users/1 (ресурс) -> /users/1/orders (связанные). Преимущество: если сервер изменит URL (например, /api/v2/users), клиенту не нужно обновлять код — он всё ещё следует ссылкам из ответа. Это принцип "follow your nose".'
    }
  ]
}
