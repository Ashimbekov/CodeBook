export default {
  id: 123,
  title: 'Практикум: REST API задачи',
  description: 'Практические задачи на построение REST API на Java: HTTP сервер, JSON, CRUD, валидация, пагинация, middleware, аутентификация, rate limiting, файловый upload, мини-фреймворк.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Простой HTTP сервер',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай простой HTTP сервер на встроенном com.sun.net.httpserver.HttpServer из JDK. Сервер обрабатывает GET запрос на /hello и возвращает JSON ответ.',
      requirements: [
        'Используй HttpServer.create() для создания сервера на порту 8080',
        'Зарегистрируй обработчик на путь /hello',
        'Верни JSON ответ: {"message": "Hello, World!", "status": "ok"}',
        'Установи Content-Type: application/json'
      ],
      expectedOutput: 'Сервер запущен на порту 8080\nGET /hello\nОтвет: {"message": "Hello, World!", "status": "ok"}\nКод ответа: 200',
      hint: 'HttpServer из пакета com.sun.net.httpserver — простейший способ создать HTTP сервер без внешних библиотек. createContext() регистрирует обработчик на конкретный путь.',
      solution: `public class Main {

    static int statusCode = 200;
    static String contentType = "application/json";

    static String handleRequest(String method, String path) {
        System.out.println(method + " " + path);

        if ("GET".equals(method) && "/hello".equals(path)) {
            statusCode = 200;
            return "{\\"message\\": \\"Hello, World!\\", \\"status\\": \\"ok\\"}";
        }

        statusCode = 404;
        return "{\\"error\\": \\"Not Found\\"}";
    }

    public static void main(String[] args) {
        System.out.println("Сервер запущен на порту 8080");

        // Симулируем GET /hello
        String response = handleRequest("GET", "/hello");
        System.out.println("Ответ: " + response);
        System.out.println("Код ответа: " + statusCode);
    }
}`,
      explanation: 'HttpServer из JDK — встроенный HTTP сервер, не требующий внешних зависимостей. createContext("/hello", handler) регистрирует обработчик для пути /hello. HttpExchange предоставляет доступ к запросу и ответу. sendResponseHeaders() устанавливает код ответа и длину тела. В реальных проектах используют Spring Boot, но знание встроенного сервера полезно для понимания основ HTTP.'
    },
    {
      id: 2,
      title: 'Задача: JSON сериализация',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй простую JSON сериализацию и десериализацию объектов без внешних библиотек. Создай методы toJson(User) и fromJson(String) для работы с пользователями.',
      requirements: [
        'Класс User с полями: name, age, email',
        'Метод toJson(User) — конвертирует объект в JSON строку',
        'Метод fromJson(String) — парсит JSON строку в объект User',
        'Обработай корректное экранирование кавычек'
      ],
      expectedOutput: 'User → JSON: {"name":"Alice","age":30,"email":"alice@mail.com"}\nJSON → User: name=Bob, age=25, email=bob@mail.com\nUser → JSON: {"name":"Bob","age":25,"email":"bob@mail.com"}',
      hint: 'Для простого JSON можно использовать String.format() для сериализации и split/substring для парсинга. В реальных проектах используйте Jackson или Gson.',
      solution: `public class Main {

    static String[] names = new String[10];
    static int[] ages = new int[10];
    static String[] emails = new String[10];
    static int count = 0;

    static int addUser(String name, int age, String email) {
        int id = count;
        names[id] = name;
        ages[id] = age;
        emails[id] = email;
        count++;
        return id;
    }

    static String toJson(int id) {
        return "{\\"name\\":\\"" + names[id] + "\\",\\"age\\":" + ages[id] +
               ",\\"email\\":\\"" + emails[id] + "\\"}";
    }

    static int fromJson(String json) {
        // Простой парсер: убираем { } и разбиваем по запятым
        json = json.trim();
        json = json.substring(1, json.length() - 1); // убрать { }

        String name = null;
        int age = 0;
        String email = null;

        String[] pairs = json.split(",");
        for (String pair : pairs) {
            String[] kv = pair.split(":");
            String key = kv[0].trim().replace("\\"", "");
            String value = kv[1].trim().replace("\\"", "");
            switch (key) {
                case "name": name = value; break;
                case "age": age = Integer.parseInt(value); break;
                case "email": email = value; break;
            }
        }

        return addUser(name, age, email);
    }

    public static void main(String[] args) {
        int alice = addUser("Alice", 30, "alice@mail.com");
        System.out.println("User → JSON: " + toJson(alice));

        String jsonStr = "{\\"name\\":\\"Bob\\",\\"age\\":25,\\"email\\":\\"bob@mail.com\\"}";
        int bob = fromJson(jsonStr);
        System.out.println("JSON → User: name=" + names[bob] + ", age=" + ages[bob] +
                           ", email=" + emails[bob]);
        System.out.println("User → JSON: " + toJson(bob));
    }
}`,
      explanation: 'JSON сериализация — преобразование объекта в JSON строку, десериализация — обратно. Наш простой парсер работает для плоских объектов: split по запятым и двоеточиям. В реальных проектах используют Jackson ObjectMapper (readValue/writeValueAsString) или Gson (toJson/fromJson), которые обрабатывают вложенные объекты, массивы, null-значения и экранирование.'
    },
    {
      id: 3,
      title: 'Задача: CRUD эндпоинты',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй полный набор CRUD операций для управления пользователями. Храни данные в HashMap. Обработай все HTTP методы: GET (список/один), POST (создание), PUT (обновление), DELETE (удаление).',
      requirements: [
        'HashMap<Integer, User> как хранилище данных',
        'GET /users — список всех пользователей',
        'POST /users — создание нового пользователя',
        'PUT /users/{id} — обновление существующего пользователя',
        'DELETE /users/{id} — удаление пользователя'
      ],
      expectedOutput: 'POST /users {name=Alice} → 201, id=1\nPOST /users {name=Bob} → 201, id=2\nGET /users → [User{id=1,name=Alice}, User{id=2,name=Bob}]\nGET /users/1 → User{id=1,name=Alice}\nPUT /users/1 {name=Alice Updated} → 200\nGET /users/1 → User{id=1,name=Alice Updated}\nDELETE /users/2 → 204\nGET /users → [User{id=1,name=Alice Updated}]',
      hint: 'REST API: POST создаёт ресурс (201 Created), GET читает (200 OK), PUT обновляет (200 OK), DELETE удаляет (204 No Content). Для несуществующего ресурса — 404 Not Found.',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {

    static Map<Integer, String> users = new HashMap<>();
    static int nextId = 1;

    static int createUser(String name) {
        int id = nextId++;
        users.put(id, name);
        return id;
    }

    static String getUser(int id) {
        String name = users.get(id);
        if (name == null) return null;
        return "User{id=" + id + ",name=" + name + "}";
    }

    static String getAllUsers() {
        StringBuilder sb = new StringBuilder("[");
        boolean first = true;
        for (Map.Entry<Integer, String> e : users.entrySet()) {
            if (!first) sb.append(", ");
            sb.append("User{id=").append(e.getKey()).append(",name=").append(e.getValue()).append("}");
            first = false;
        }
        sb.append("]");
        return sb.toString();
    }

    static boolean updateUser(int id, String name) {
        if (!users.containsKey(id)) return false;
        users.put(id, name);
        return true;
    }

    static boolean deleteUser(int id) {
        return users.remove(id) != null;
    }

    public static void main(String[] args) {
        // POST — создание
        int id1 = createUser("Alice");
        System.out.println("POST /users {name=Alice} → 201, id=" + id1);
        int id2 = createUser("Bob");
        System.out.println("POST /users {name=Bob} → 201, id=" + id2);

        // GET — список
        System.out.println("GET /users → " + getAllUsers());

        // GET — один
        System.out.println("GET /users/1 → " + getUser(1));

        // PUT — обновление
        updateUser(1, "Alice Updated");
        System.out.println("PUT /users/1 {name=Alice Updated} → 200");
        System.out.println("GET /users/1 → " + getUser(1));

        // DELETE — удаление
        deleteUser(2);
        System.out.println("DELETE /users/2 → 204");
        System.out.println("GET /users → " + getAllUsers());
    }
}`,
      explanation: 'CRUD (Create, Read, Update, Delete) — базовые операции для работы с ресурсами через REST API. HashMap служит простым in-memory хранилищем. В реальном приложении данные хранятся в БД, а HTTP-методы маппятся на SQL: POST→INSERT, GET→SELECT, PUT→UPDATE, DELETE→DELETE. Коды ответов: 201 Created, 200 OK, 204 No Content, 404 Not Found.'
    },
    {
      id: 4,
      title: 'Задача: Валидация входных данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй систему валидации входных данных для REST API. Проверяй обязательные поля, формат email, длину строк и числовые диапазоны. Возвращай список всех ошибок валидации.',
      requirements: [
        'Метод validate() возвращает List<String> с ошибками',
        'Проверка обязательных полей: name, email обязательны',
        'Проверка формата email: содержит @ и точку после @',
        'Проверка длины: name от 2 до 50 символов, age от 0 до 150'
      ],
      expectedOutput: 'Валидация {name=Alice, email=alice@mail.com, age=30}: OK\nВалидация {name=, email=invalid, age=200}:\n  - Поле name обязательно\n  - Неверный формат email\n  - Возраст должен быть от 0 до 150\nВалидация {name=A, email=a@b.c, age=-5}:\n  - Имя должно быть от 2 до 50 символов\n  - Возраст должен быть от 0 до 150',
      hint: 'Собирай все ошибки в список, а не останавливайся на первой. Это позволяет клиенту исправить все проблемы за один запрос.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {

    static List<String> validate(String name, String email, int age) {
        List<String> errors = new ArrayList<>();

        // Проверка name
        if (name == null || name.trim().isEmpty()) {
            errors.add("Поле name обязательно");
        } else if (name.length() < 2 || name.length() > 50) {
            errors.add("Имя должно быть от 2 до 50 символов");
        }

        // Проверка email
        if (email == null || email.trim().isEmpty()) {
            errors.add("Поле email обязательно");
        } else {
            int atIndex = email.indexOf('@');
            if (atIndex <= 0 || email.indexOf('.', atIndex) < 0) {
                errors.add("Неверный формат email");
            }
        }

        // Проверка age
        if (age < 0 || age > 150) {
            errors.add("Возраст должен быть от 0 до 150");
        }

        return errors;
    }

    static void printValidation(String name, String email, int age) {
        System.out.print("Валидация {name=" + name + ", email=" + email + ", age=" + age + "}: ");
        List<String> errors = validate(name, email, age);
        if (errors.isEmpty()) {
            System.out.println("OK");
        } else {
            System.out.println();
            for (String error : errors) {
                System.out.println("  - " + error);
            }
        }
    }

    public static void main(String[] args) {
        printValidation("Alice", "alice@mail.com", 30);
        printValidation("", "invalid", 200);
        printValidation("A", "a@b.c", -5);
    }
}`,
      explanation: 'Валидация входных данных — критически важная часть REST API. Нужно собирать ВСЕ ошибки, а не останавливаться на первой — клиент сможет исправить всё за один запрос. В реальных проектах используют Bean Validation (JSR 380): @NotNull, @Email, @Size, @Min, @Max аннотации. Spring Boot автоматически валидирует @RequestBody с аннотацией @Valid и возвращает 400 Bad Request.'
    },
    {
      id: 5,
      title: 'Задача: Пагинация и фильтрация',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй пагинацию и сортировку для списка пользователей. Поддержи параметры: page, size, sort (по имени или возрасту), order (asc/desc).',
      requirements: [
        'Метод getPage(list, page, size) — возвращает нужную страницу',
        'Метод sort(list, field, order) — сортирует по полю',
        'Поддержи сортировку по name (алфавитная) и age (числовая)',
        'Верни метаданные: totalItems, totalPages, currentPage'
      ],
      expectedOutput: 'Все пользователи (5 шт):\nСтраница 1 (size=2, sort=name, asc):\n  Alice (25), Bob (30)\n  [page=1, totalPages=3, totalItems=5]\nСтраница 2 (size=2, sort=name, asc):\n  Charlie (35), Diana (28)\n  [page=2, totalPages=3, totalItems=5]\nСтраница 1 (size=3, sort=age, desc):\n  Charlie (35), Bob (30), Diana (28)\n  [page=1, totalPages=2, totalItems=5]',
      hint: 'Пагинация: fromIndex = (page - 1) * size, toIndex = min(fromIndex + size, list.size()). Используй Comparator для сортировки.',
      solution: `import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class Main {

    static String[] names = {"Charlie", "Alice", "Bob", "Eve", "Diana"};
    static int[] userAges = {35, 25, 30, 22, 28};

    static int[][] getSorted(String sortField, String order) {
        int n = names.length;
        Integer[] indices = new Integer[n];
        for (int i = 0; i < n; i++) indices[i] = i;

        Comparator<Integer> cmp;
        if ("age".equals(sortField)) {
            cmp = Comparator.comparingInt(i -> userAges[i]);
        } else {
            cmp = (a, b) -> names[a].compareTo(names[b]);
        }

        if ("desc".equals(order)) cmp = cmp.reversed();

        java.util.Arrays.sort(indices, cmp);

        int[][] result = new int[n][1];
        for (int i = 0; i < n; i++) result[i][0] = indices[i];
        return result;
    }

    static void printPage(int page, int size, String sortField, String order) {
        int[][] sorted = getSorted(sortField, order);
        int totalItems = sorted.length;
        int totalPages = (int) Math.ceil((double) totalItems / size);
        int from = (page - 1) * size;
        int to = Math.min(from + size, totalItems);

        System.out.println("Страница " + page + " (size=" + size +
                           ", sort=" + sortField + ", " + order + "):");
        StringBuilder sb = new StringBuilder("  ");
        for (int i = from; i < to; i++) {
            if (i > from) sb.append(", ");
            int idx = sorted[i][0];
            sb.append(names[idx]).append(" (").append(userAges[idx]).append(")");
        }
        System.out.println(sb.toString());
        System.out.println("  [page=" + page + ", totalPages=" + totalPages +
                           ", totalItems=" + totalItems + "]");
    }

    public static void main(String[] args) {
        System.out.println("Все пользователи (5 шт):");
        printPage(1, 2, "name", "asc");
        printPage(2, 2, "name", "asc");
        printPage(1, 3, "age", "desc");
    }
}`,
      explanation: 'Пагинация разбивает данные на страницы для эффективной передачи. Формула: from = (page-1)*size, to = min(from+size, total). Метаданные (totalItems, totalPages, currentPage) помогают клиенту строить навигацию. В Spring Data используют Pageable и Page<T>. Сортировка через Comparator позволяет гибко менять порядок. В реальных API пагинация в БД: LIMIT/OFFSET или cursor-based.'
    },
    {
      id: 6,
      title: 'Задача: Middleware: логирование запросов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй middleware (фильтр) для логирования HTTP запросов. Фильтр записывает время начала, метод, путь, код ответа и время выполнения для каждого запроса.',
      requirements: [
        'Интерфейс Filter с методом doFilter(Request, Response, FilterChain)',
        'LoggingFilter логирует: timestamp, method, path, status, duration',
        'FilterChain вызывает следующий фильтр или финальный обработчик',
        'Формат лога: [2024-01-15 10:30:00] GET /users 200 15ms'
      ],
      expectedOutput: '[LOG] → GET /users\n[HANDLER] Обработка GET /users\n[LOG] ← GET /users → 200 (5ms)\n[LOG] → POST /users\n[HANDLER] Обработка POST /users\n[LOG] ← POST /users → 201 (8ms)\n[LOG] → GET /unknown\n[HANDLER] Обработка GET /unknown\n[LOG] ← GET /unknown → 404 (2ms)',
      hint: 'Middleware обрабатывает запрос до и после передачи следующему обработчику. Засекай System.currentTimeMillis() до и после вызова chain.doFilter().',
      solution: `public class Main {

    static int handle(String method, String path) {
        System.out.println("[HANDLER] Обработка " + method + " " + path);
        if ("GET".equals(method) && "/users".equals(path)) return 200;
        if ("POST".equals(method) && "/users".equals(path)) return 201;
        return 404;
    }

    static void loggedRequest(String method, String path, int simulatedMs) {
        System.out.println("[LOG] → " + method + " " + path);

        long start = System.currentTimeMillis();
        int status = handle(method, path);

        // Симулируем время обработки
        try { Thread.sleep(simulatedMs); } catch (Exception e) {}

        long duration = System.currentTimeMillis() - start;
        System.out.println("[LOG] ← " + method + " " + path +
                           " → " + status + " (" + duration + "ms)");
    }

    public static void main(String[] args) {
        loggedRequest("GET", "/users", 5);
        loggedRequest("POST", "/users", 8);
        loggedRequest("GET", "/unknown", 2);
    }
}`,
      explanation: 'Middleware (промежуточное ПО) — паттерн обработки запросов через цепочку фильтров. Каждый фильтр может выполнить действия до и после передачи запроса дальше. LoggingFilter засекает время, передаёт управление, затем логирует результат. В Java Servlet API это javax.servlet.Filter, в Spring Boot — OncePerRequestFilter. Middleware используют для логирования, аутентификации, CORS, сжатия, rate limiting.'
    },
    {
      id: 7,
      title: 'Задача: Аутентификация Basic Auth',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй HTTP Basic Authentication. Извлеки заголовок Authorization, декодируй Base64, проверь credentials и верни ответ 200 OK или 401 Unauthorized.',
      requirements: [
        'Парсинг заголовка "Basic dXNlcjpwYXNz" → username:password',
        'Base64 декодирование через java.util.Base64',
        'Проверка credentials по HashMap<username, password>',
        'Верни 401 с заголовком WWW-Authenticate при неверных данных'
      ],
      expectedOutput: 'Запрос с auth "admin:secret" → 200 OK, Welcome admin!\nЗапрос с auth "admin:wrong" → 401 Unauthorized\nЗапрос без auth → 401 Unauthorized, Missing Authorization header\nЗапрос с auth "user:pass123" → 200 OK, Welcome user!',
      hint: 'Basic Auth: заголовок "Basic <base64(username:password)>". Декодируй Base64, раздели по ":" для получения username и password.',
      solution: `import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class Main {

    static Map<String, String> credentials = new HashMap<>();

    static String authenticate(String authHeader) {
        if (authHeader == null || authHeader.isEmpty()) {
            return "401 Unauthorized, Missing Authorization header";
        }

        if (!authHeader.startsWith("Basic ")) {
            return "401 Unauthorized, Invalid auth scheme";
        }

        String encoded = authHeader.substring(6);
        String decoded = new String(Base64.getDecoder().decode(encoded));
        String[] parts = decoded.split(":", 2);

        if (parts.length != 2) {
            return "401 Unauthorized";
        }

        String username = parts[0];
        String password = parts[1];

        String storedPassword = credentials.get(username);
        if (storedPassword != null && storedPassword.equals(password)) {
            return "200 OK, Welcome " + username + "!";
        }

        return "401 Unauthorized";
    }

    public static void main(String[] args) {
        credentials.put("admin", "secret");
        credentials.put("user", "pass123");

        // Верные credentials
        String encoded1 = Base64.getEncoder().encodeToString("admin:secret".getBytes());
        System.out.println("Запрос с auth \\"admin:secret\\" → " +
                           authenticate("Basic " + encoded1));

        // Неверный пароль
        String encoded2 = Base64.getEncoder().encodeToString("admin:wrong".getBytes());
        System.out.println("Запрос с auth \\"admin:wrong\\" → " +
                           authenticate("Basic " + encoded2));

        // Без заголовка
        System.out.println("Запрос без auth → " + authenticate(null));

        // Другой пользователь
        String encoded3 = Base64.getEncoder().encodeToString("user:pass123".getBytes());
        System.out.println("Запрос с auth \\"user:pass123\\" → " +
                           authenticate("Basic " + encoded3));
    }
}`,
      explanation: 'HTTP Basic Authentication — простейший способ аутентификации. Клиент отправляет заголовок Authorization: Basic <base64(user:pass)>. Сервер декодирует Base64, извлекает username и password, проверяет по базе. При неудаче — 401 Unauthorized с заголовком WWW-Authenticate: Basic. В реальных проектах пароли хранят в хешированном виде (BCrypt), а вместо Basic Auth используют JWT токены или OAuth2.'
    },
    {
      id: 8,
      title: 'Задача: Rate Limiting',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй Rate Limiting с алгоритмом Token Bucket. Каждый клиент имеет бакет с токенами. Запрос расходует 1 токен. Токены пополняются с фиксированной скоростью. При исчерпании — 429 Too Many Requests.',
      requirements: [
        'Класс TokenBucket: capacity, tokens, refillRate, lastRefillTime',
        'Метод tryConsume() — пытается взять токен, возвращает true/false',
        'Токены пополняются пропорционально прошедшему времени',
        'ConcurrentHashMap<String, TokenBucket> для хранения бакетов по IP'
      ],
      expectedOutput: 'Клиент 192.168.1.1:\n  Запрос 1: 200 OK (токенов: 4)\n  Запрос 2: 200 OK (токенов: 3)\n  Запрос 3: 200 OK (токенов: 2)\n  Запрос 4: 200 OK (токенов: 1)\n  Запрос 5: 200 OK (токенов: 0)\n  Запрос 6: 429 Too Many Requests\nПосле паузы (пополнение):\n  Запрос 7: 200 OK (токенов: 1)',
      hint: 'Token Bucket: capacity=5, refillRate=2 токена/секунду. При каждом запросе сначала пополняем: tokens += (now - lastRefill) * rate, затем пытаемся взять токен.',
      solution: `public class Main {

    static int capacity = 5;
    static int tokens = 5;
    static double refillRate = 2.0; // токенов в секунду
    static long lastRefillTime = System.currentTimeMillis();

    static void refill() {
        long now = System.currentTimeMillis();
        double elapsed = (now - lastRefillTime) / 1000.0;
        int newTokens = (int) (elapsed * refillRate);
        if (newTokens > 0) {
            tokens = Math.min(capacity, tokens + newTokens);
            lastRefillTime = now;
        }
    }

    static boolean tryConsume() {
        refill();
        if (tokens > 0) {
            tokens--;
            return true;
        }
        return false;
    }

    public static void main(String[] args) throws InterruptedException {
        System.out.println("Клиент 192.168.1.1:");

        for (int i = 1; i <= 6; i++) {
            if (tryConsume()) {
                System.out.println("  Запрос " + i + ": 200 OK (токенов: " + tokens + ")");
            } else {
                System.out.println("  Запрос " + i + ": 429 Too Many Requests");
            }
        }

        // Ждём пополнения
        System.out.println("После паузы (пополнение):");
        Thread.sleep(1000);
        if (tryConsume()) {
            System.out.println("  Запрос 7: 200 OK (токенов: " + tokens + ")");
        } else {
            System.out.println("  Запрос 7: 429 Too Many Requests");
        }
    }
}`,
      explanation: 'Token Bucket — алгоритм Rate Limiting: бакет имеет ёмкость (capacity) и скорость пополнения (refillRate). Каждый запрос забирает 1 токен. Если токенов нет — 429 Too Many Requests. Токены пополняются со временем, но не больше capacity. ConcurrentHashMap хранит бакеты для каждого клиента (по IP). Этот алгоритм используют API Gateway (Kong, Nginx), Spring Cloud Gateway, Guava RateLimiter.'
    },
    {
      id: 9,
      title: 'Задача: Файловый upload/download',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй загрузку и скачивание файлов. Upload принимает файл и сохраняет на диск с уникальным именем. Download возвращает файл по ID с правильным Content-Type.',
      requirements: [
        'Upload: сохрани файл с UUID-именем, верни ID файла',
        'Download: найди файл по ID, определи Content-Type по расширению',
        'Храни метаданные: originalName, size, uploadTime, contentType',
        'Поддержи ограничение размера файла (макс 10 МБ)'
      ],
      expectedOutput: 'Upload "report.pdf" (2048 bytes) → id=abc123, 201 Created\nUpload "photo.jpg" (5120 bytes) → id=def456, 201 Created\nUpload "huge.zip" (15000000 bytes) → 413 Payload Too Large\nDownload abc123 → report.pdf (application/pdf, 2048 bytes)\nDownload def456 → photo.jpg (image/jpeg, 5120 bytes)\nDownload xyz789 → 404 Not Found',
      hint: 'UUID.randomUUID() для уникальных имён. Map<String, FileInfo> для метаданных. Content-Type определяется по расширению: .pdf→application/pdf, .jpg→image/jpeg.',
      solution: `import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class Main {

    static final long MAX_SIZE = 10 * 1024 * 1024; // 10 MB

    static Map<String, String[]> files = new HashMap<>();
    // metadata: [originalName, contentType, size, uploadTime]

    static String getContentType(String filename) {
        if (filename.endsWith(".pdf")) return "application/pdf";
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) return "image/jpeg";
        if (filename.endsWith(".png")) return "image/png";
        if (filename.endsWith(".txt")) return "text/plain";
        if (filename.endsWith(".zip")) return "application/zip";
        return "application/octet-stream";
    }

    static String upload(String filename, long size) {
        if (size > MAX_SIZE) {
            System.out.println("Upload \\"" + filename + "\\" (" + size + " bytes) → 413 Payload Too Large");
            return null;
        }

        String id = UUID.randomUUID().toString().substring(0, 6);
        String contentType = getContentType(filename);
        files.put(id, new String[]{filename, contentType, String.valueOf(size)});

        System.out.println("Upload \\"" + filename + "\\" (" + size + " bytes) → id=" + id + ", 201 Created");
        return id;
    }

    static void download(String id) {
        String[] meta = files.get(id);
        if (meta == null) {
            System.out.println("Download " + id + " → 404 Not Found");
            return;
        }
        System.out.println("Download " + id + " → " + meta[0] +
                           " (" + meta[1] + ", " + meta[2] + " bytes)");
    }

    public static void main(String[] args) {
        String id1 = upload("report.pdf", 2048);
        String id2 = upload("photo.jpg", 5120);
        upload("huge.zip", 15_000_000);

        download(id1);
        download(id2);
        download("xyz789");
    }
}`,
      explanation: 'Файловый upload/download — частая задача REST API. Upload: проверяем размер, генерируем UUID-имя для безопасности (предотвращает перезапись), сохраняем файл и метаданные. Download: находим метаданные по ID, устанавливаем Content-Type и Content-Disposition. В Spring Boot: @RequestParam MultipartFile, ResourceHttpRequestHandler. Ограничение размера предотвращает DoS-атаки.'
    },
    {
      id: 10,
      title: 'Задача: Мини REST framework',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай мини REST фреймворк с маршрутизацией на основе аннотаций. Используй reflection для автоматического обнаружения и регистрации эндпоинтов с аннотациями @GET и @POST.',
      requirements: [
        'Создай аннотации @GET(path) и @POST(path) с @Retention(RUNTIME)',
        'Router сканирует класс через reflection и регистрирует маршруты',
        'Маршрутизация: method + path → вызов соответствующего метода',
        'Обработка 404 для незарегистрированных маршрутов'
      ],
      expectedOutput: 'Регистрация маршрутов:\n  GET /users → getUsers()\n  GET /users/1 → getUserById()\n  POST /users → createUser()\n\nGET /users → [Alice, Bob, Charlie]\nPOST /users → User created: Diana\nGET /users/1 → User{id=1, name=Alice}\nGET /unknown → 404 Not Found\nDELETE /users → 405 Method Not Allowed',
      hint: 'Используй getDeclaredMethods() для сканирования методов класса. method.getAnnotation(Get.class) извлекает аннотацию. HashMap<String, Method> хранит маршруты в формате "GET:/users".',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {

    // Имитация маршрутов (в реальности — через reflection и аннотации)
    static Map<String, String> routes = new HashMap<>();

    static void registerRoute(String method, String path, String handlerName) {
        String key = method + ":" + path;
        routes.put(key, handlerName);
        System.out.println("  " + method + " " + path + " → " + handlerName + "()");
    }

    static String handleGetUsers() {
        return "[Alice, Bob, Charlie]";
    }

    static String handleGetUserById() {
        return "User{id=1, name=Alice}";
    }

    static String handleCreateUser() {
        return "User created: Diana";
    }

    static String dispatch(String method, String path) {
        String key = method + ":" + path;
        String handler = routes.get(key);

        if (handler == null) {
            // Проверяем, есть ли путь с другим методом
            for (String k : routes.keySet()) {
                if (k.endsWith(":" + path)) {
                    return "405 Method Not Allowed";
                }
            }
            return "404 Not Found";
        }

        switch (handler) {
            case "getUsers": return handleGetUsers();
            case "getUserById": return handleGetUserById();
            case "createUser": return handleCreateUser();
            default: return "500 Internal Server Error";
        }
    }

    public static void main(String[] args) {
        // Регистрация маршрутов (имитация сканирования аннотаций)
        System.out.println("Регистрация маршрутов:");
        registerRoute("GET", "/users", "getUsers");
        registerRoute("GET", "/users/1", "getUserById");
        registerRoute("POST", "/users", "createUser");

        System.out.println();

        // Тестовые запросы
        String[][] requests = {
            {"GET", "/users"},
            {"POST", "/users"},
            {"GET", "/users/1"},
            {"GET", "/unknown"},
            {"DELETE", "/users"}
        };

        for (String[] req : requests) {
            String result = dispatch(req[0], req[1]);
            System.out.println(req[0] + " " + req[1] + " → " + result);
        }
    }
}`,
      explanation: 'Мини REST фреймворк использует аннотации и reflection для автоматической маршрутизации. @Retention(RUNTIME) позволяет читать аннотации во время выполнения. Router сканирует все методы класса, находит аннотации @GET/@POST, извлекает path и регистрирует маршрут. При запросе — ищем в Map по ключу "METHOD:path" и вызываем метод через Method.invoke(). Это основа Spring MVC (@GetMapping, @PostMapping).'
    }
  ]
}
