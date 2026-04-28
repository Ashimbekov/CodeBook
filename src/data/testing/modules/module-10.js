export default {
  id: 10,
  title: 'Тестирование REST API',
  description: 'MockMvc, тестирование контроллеров, проверка JSON-ответов',
  lessons: [
    {
      id: 1,
      title: 'Тестирование REST API: обзор',
      type: 'theory',
      content: [
        { type: 'text', value: 'REST API тестирование проверяет, что HTTP-endpoints возвращают правильные ответы, статус-коды и JSON.' },
        { type: 'heading', value: 'Что проверяем в API-тесте' },
        { type: 'list', items: [
          'HTTP статус-код (200, 201, 400, 404, 500)',
          'Тело ответа (JSON-структура и значения)',
          'Заголовки (Content-Type, Location)',
          'Валидацию входных данных (400 для невалидных)',
          'Авторизацию (401/403 без токена)'
        ]},
        { type: 'heading', value: 'MockMvc в Spring Boot' },
        { type: 'code', language: 'java', value: '// MockMvc тестирует контроллеры БЕЗ запуска сервера:\n@WebMvcTest(UserController.class)\nclass UserControllerTest {\n\n    @Autowired\n    MockMvc mockMvc;\n\n    @MockBean\n    UserService userService;\n\n    @Test\n    void shouldReturnUser() throws Exception {\n        when(userService.findById(1L))\n            .thenReturn(new User("John"));\n\n        mockMvc.perform(get("/api/users/1"))\n            .andExpect(status().isOk())\n            .andExpect(jsonPath("$.name").value("John"));\n    }\n}' },
        { type: 'heading', value: 'RestAssured — альтернатива' },
        { type: 'code', language: 'java', value: '// RestAssured — для полных интеграционных тестов:\ngiven()\n    .contentType(ContentType.JSON)\n    .body(newUser)\n.when()\n    .post("/api/users")\n.then()\n    .statusCode(201)\n    .body("name", equalTo("John"))\n    .body("email", equalTo("john@mail.com"));' },
        { type: 'tip', value: 'MockMvc — быстрый (без HTTP-сервера). RestAssured — полный (с реальным HTTP). Используйте MockMvc для unit, RestAssured для integration.' }
      ]
    },
    {
      id: 2,
      title: 'Тестирование GET и POST',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый HTTP-метод тестируется по своему шаблону: GET — получение, POST — создание, PUT — обновление, DELETE — удаление.' },
        { type: 'heading', value: 'Тестирование GET' },
        { type: 'code', language: 'java', value: '// GET /api/users — список\nmockMvc.perform(get("/api/users"))\n    .andExpect(status().isOk())\n    .andExpect(jsonPath("$", hasSize(3)))\n    .andExpect(jsonPath("$[0].name").value("John"));\n\n// GET /api/users/1 — один\nmockMvc.perform(get("/api/users/1"))\n    .andExpect(status().isOk())\n    .andExpect(jsonPath("$.name").value("John"));\n\n// GET /api/users/999 — не найден\nmockMvc.perform(get("/api/users/999"))\n    .andExpect(status().isNotFound());' },
        { type: 'heading', value: 'Тестирование POST' },
        { type: 'code', language: 'java', value: '// POST /api/users — создание\nmockMvc.perform(post("/api/users")\n    .contentType(MediaType.APPLICATION_JSON)\n    .content(\n        "{\\\"name\\\": \\\"John\\\", \\\"email\\\": \\\"john@mail.com\\\"}"\n    ))\n    .andExpect(status().isCreated())\n    .andExpect(jsonPath("$.id").exists())\n    .andExpect(jsonPath("$.name").value("John"));\n\n// POST с невалидными данными\nmockMvc.perform(post("/api/users")\n    .contentType(MediaType.APPLICATION_JSON)\n    .content("{\\\"name\\\": \\\"\\\"}")) // пустое имя\n    .andExpect(status().isBadRequest());' },
        { type: 'heading', value: 'JsonPath — навигация по JSON' },
        { type: 'code', language: 'java', value: '// JsonPath выражения:\n"$.name"          // поле name в корне\n"$.address.city"  // вложенное поле\n"$[0].name"       // первый элемент массива\n"$.items.length()" // длина массива\n"$.items[?(@.price > 100)]" // фильтрация' },
        { type: 'note', value: '@WebMvcTest загружает только контроллер, без сервиса и репозитория. Зависимости мокаются через @MockBean.' }
      ]
    },
    {
      id: 3,
      title: 'Тестирование валидации и ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тестирование ошибок не менее важно, чем тестирование happy path. API должен правильно отвечать на невалидные запросы.' },
        { type: 'heading', value: 'Тестирование валидации (@Valid)' },
        { type: 'code', language: 'java', value: '// Контроллер с валидацией:\n@PostMapping("/api/users")\nResponseEntity<User> create(@Valid @RequestBody UserDto dto) {\n    // @NotBlank name, @Email email, @Min(18) age\n}\n\n// Тест невалидных данных:\nmockMvc.perform(post("/api/users")\n    .contentType(MediaType.APPLICATION_JSON)\n    .content("{\\\"name\\\": \\\"\\\", \\\"email\\\": \\\"not-email\\\", \\\"age\\\": 5}"))\n    .andExpect(status().isBadRequest())\n    .andExpect(jsonPath("$.errors", hasSize(3)));' },
        { type: 'heading', value: 'Тестирование HTTP-кодов ошибок' },
        { type: 'code', language: 'java', value: '// 400 Bad Request — невалидные данные\n.andExpect(status().isBadRequest());\n\n// 401 Unauthorized — нет авторизации\n.andExpect(status().isUnauthorized());\n\n// 403 Forbidden — нет прав\n.andExpect(status().isForbidden());\n\n// 404 Not Found — ресурс не найден\n.andExpect(status().isNotFound());\n\n// 409 Conflict — конфликт (дубликат)\n.andExpect(status().isConflict());\n\n// 500 Internal Server Error — ошибка сервера\n.andExpect(status().isInternalServerError());' },
        { type: 'heading', value: 'Структура ошибки' },
        { type: 'code', language: 'java', value: '// Стандартная структура ошибки:\n{\n  "status": 400,\n  "error": "Bad Request",\n  "message": "Validation failed",\n  "errors": [\n    {"field": "name", "message": "must not be blank"},\n    {"field": "email", "message": "must be valid email"}\n  ]\n}' },
        { type: 'tip', value: 'Всегда тестируйте негативные сценарии: пустое тело, невалидный JSON, отсутствие обязательных полей, неверный Content-Type.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: Симуляция API-тестов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте мини-HTTP фреймворк и протестируйте REST API для управления задачами.',
      requirements: [
        'Создайте Router с методами: handleGet(path), handlePost(path, body), handleDelete(path)',
        'Реализуйте CRUD endpoints: GET /tasks, GET /tasks/{id}, POST /tasks, DELETE /tasks/{id}',
        'Ответ содержит статус-код и тело: "200:{json}" или "404:Not found"',
        'Протестируйте все endpoints включая ошибки',
        'Минимум 7 тестов'
      ],
      expectedOutput: 'PASS: testGetAllTasks_empty\nPASS: testPostTask\nPASS: testGetTaskById\nPASS: testGetTaskNotFound\nPASS: testDeleteTask\nPASS: testDeleteNotFound\nPASS: testPostInvalid\nИтого: 7/7',
      hint: 'Парсите path чтобы определить endpoint и id. Используйте Map для хранения задач.',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- In-memory storage ---
    static Map<Integer, String> tasks = new HashMap<>();
    static int nextId = 1;

    // --- Router (симуляция REST Controller) ---
    static String handleGet(String path) {
        if (path.equals("/tasks")) {
            StringBuilder sb = new StringBuilder();
            sb.append("[");
            boolean first = true;
            for (Map.Entry<Integer, String> e : tasks.entrySet()) {
                if (!first) sb.append(",");
                sb.append("{\"id\":").append(e.getKey())
                  .append(",\"title\":\"").append(e.getValue())
                  .append("\"}");
                first = false;
            }
            sb.append("]");
            return "200:" + sb.toString();
        }

        if (path.startsWith("/tasks/")) {
            try {
                int id = Integer.parseInt(
                    path.substring("/tasks/".length()));
                String title = tasks.get(id);
                if (title == null) return "404:Task not found";
                return "200:{\"id\":" + id +
                    ",\"title\":\"" + title + "\"}";
            } catch (NumberFormatException e) {
                return "400:Invalid id";
            }
        }

        return "404:Endpoint not found";
    }

    static String handlePost(String path, String body) {
        if (path.equals("/tasks")) {
            if (body == null || body.trim().isEmpty()) {
                return "400:Body is required";
            }
            // Простой парсинг title из body
            String title = body.trim();
            if (title.isEmpty()) {
                return "400:Title is required";
            }
            int id = nextId++;
            tasks.put(id, title);
            return "201:{\"id\":" + id +
                ",\"title\":\"" + title + "\"}";
        }
        return "404:Endpoint not found";
    }

    static String handleDelete(String path) {
        if (path.startsWith("/tasks/")) {
            try {
                int id = Integer.parseInt(
                    path.substring("/tasks/".length()));
                if (tasks.remove(id) != null) {
                    return "204:Deleted";
                }
                return "404:Task not found";
            } catch (NumberFormatException e) {
                return "400:Invalid id";
            }
        }
        return "404:Endpoint not found";
    }

    // --- Assertions ---
    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Expected [" + expected + "], got [" + actual + "]");
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Expected true");
    }

    static void assertStatus(String response, int expectedStatus) {
        int actualStatus = Integer.parseInt(
            response.substring(0, response.indexOf(':')));
        if (actualStatus != expectedStatus) {
            throw new RuntimeException(
                "Status: expected " + expectedStatus +
                ", got " + actualStatus);
        }
    }

    static void setUp() {
        tasks.clear();
        nextId = 1;
    }

    static void runTest(String name, Runnable test) {
        total++;
        setUp();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testGetAllTasks_empty", () -> {
            String response = handleGet("/tasks");
            assertStatus(response, 200);
            assertTrue(response.contains("[]"));
        });

        runTest("testPostTask", () -> {
            String response = handlePost("/tasks", "Написать тесты");
            assertStatus(response, 201);
            assertTrue(response.contains("\"id\":1"));
            assertTrue(response.contains("Написать тесты"));
        });

        runTest("testGetTaskById", () -> {
            handlePost("/tasks", "Ревью кода");
            String response = handleGet("/tasks/1");
            assertStatus(response, 200);
            assertTrue(response.contains("Ревью кода"));
        });

        runTest("testGetTaskNotFound", () -> {
            String response = handleGet("/tasks/999");
            assertStatus(response, 404);
        });

        runTest("testDeleteTask", () -> {
            handlePost("/tasks", "Удалить это");
            String response = handleDelete("/tasks/1");
            assertStatus(response, 204);
            // Проверяем, что удалено
            assertStatus(handleGet("/tasks/1"), 404);
        });

        runTest("testDeleteNotFound", () -> {
            String response = handleDelete("/tasks/999");
            assertStatus(response, 404);
        });

        runTest("testPostInvalid", () -> {
            String response = handlePost("/tasks", "");
            assertStatus(response, 400);
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы симулировали тестирование REST API. Router разбирает path и вызывает соответствующую логику. Ответ содержит статус-код и тело. assertStatus проверяет HTTP-код. В реальном Spring Boot MockMvc делает то же самое, но с настоящим HTTP-парсером и сериализацией JSON.'
    },
    {
      id: 5,
      title: 'Практика: Тестирование JSON-ответов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте мини-JSON builder и протестируйте корректность формирования ответов API.',
      requirements: [
        'Создайте JsonBuilder с методами: field(key, value), array(key, items), build()',
        'Создайте API, который формирует JSON-ответы через JsonBuilder',
        'Протестируйте: правильная структура JSON, наличие полей, значения полей',
        'Протестируйте вложенные объекты и массивы',
        'Минимум 5 тестов'
      ],
      expectedOutput: 'PASS: testSimpleJson\nPASS: testJsonWithArray\nPASS: testUserResponse\nPASS: testErrorResponse\nPASS: testListResponse\nИтого: 5/5',
      hint: 'JsonBuilder строит строку. Для проверки используйте contains и startsWith.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Simple JSON Builder ---
    static List<String> jsonFields;

    static void jsonStart() {
        jsonFields = new ArrayList<>();
    }

    static void jsonField(String key, String value) {
        jsonFields.add("\"" + key + "\":\"" + value + "\"");
    }

    static void jsonField(String key, int value) {
        jsonFields.add("\"" + key + "\":" + value);
    }

    static void jsonField(String key, boolean value) {
        jsonFields.add("\"" + key + "\":" + value);
    }

    static void jsonArray(String key, String[] items) {
        StringBuilder sb = new StringBuilder();
        sb.append("\"").append(key).append("\":[");
        for (int i = 0; i < items.length; i++) {
            if (i > 0) sb.append(",");
            sb.append("\"").append(items[i]).append("\"");
        }
        sb.append("]");
        jsonFields.add(sb.toString());
    }

    static String jsonBuild() {
        return "{" + String.join(",", jsonFields) + "}";
    }

    // --- API responses ---
    static String userResponse(int id, String name, String email) {
        jsonStart();
        jsonField("id", id);
        jsonField("name", name);
        jsonField("email", email);
        jsonField("active", true);
        return jsonBuild();
    }

    static String errorResponse(int status, String message) {
        jsonStart();
        jsonField("status", status);
        jsonField("error", message);
        return jsonBuild();
    }

    static String listResponse(String[][] users) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < users.length; i++) {
            if (i > 0) sb.append(",");
            jsonStart();
            jsonField("id", i + 1);
            jsonField("name", users[i][0]);
            sb.append(jsonBuild());
        }
        sb.append("]");
        return sb.toString();
    }

    // --- Assertions ---
    static void assertTrue(boolean c, String msg) {
        if (!c) throw new RuntimeException(msg);
    }

    static void assertContains(String json, String expected) {
        if (!json.contains(expected)) {
            throw new RuntimeException(
                "JSON не содержит: " + expected +
                "\\nJSON: " + json);
        }
    }

    static void assertStartsWith(String json, String prefix) {
        if (!json.startsWith(prefix)) {
            throw new RuntimeException(
                "JSON не начинается с: " + prefix);
        }
    }

    static void runTest(String name, Runnable test) {
        total++;
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testSimpleJson", () -> {
            jsonStart();
            jsonField("name", "John");
            jsonField("age", 25);
            String json = jsonBuild();
            assertContains(json, "\"name\":\"John\"");
            assertContains(json, "\"age\":25");
            assertStartsWith(json, "{");
            assertTrue(json.endsWith("}"), "Должен заканчиваться на }");
        });

        runTest("testJsonWithArray", () -> {
            jsonStart();
            jsonField("name", "John");
            jsonArray("roles", new String[]{"admin", "user"});
            String json = jsonBuild();
            assertContains(json, "\"roles\":[\"admin\",\"user\"]");
        });

        runTest("testUserResponse", () -> {
            String json = userResponse(1, "John", "john@mail.com");
            assertContains(json, "\"id\":1");
            assertContains(json, "\"name\":\"John\"");
            assertContains(json, "\"email\":\"john@mail.com\"");
            assertContains(json, "\"active\":true");
        });

        runTest("testErrorResponse", () -> {
            String json = errorResponse(404, "Not found");
            assertContains(json, "\"status\":404");
            assertContains(json, "\"error\":\"Not found\"");
        });

        runTest("testListResponse", () -> {
            String json = listResponse(new String[][]{
                {"Alice"}, {"Bob"}, {"Charlie"}
            });
            assertStartsWith(json, "[");
            assertTrue(json.endsWith("]"), "Массив должен заканчиваться на ]");
            assertContains(json, "\"name\":\"Alice\"");
            assertContains(json, "\"name\":\"Bob\"");
            assertContains(json, "\"name\":\"Charlie\"");
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы протестировали формирование JSON-ответов API. JsonBuilder собирает JSON из полей. assertContains проверяет наличие полей в JSON. В реальных проектах для проверки JSON используется JsonPath ($.name) или библиотека JSONAssert, но принцип тот же: проверить структуру и значения.'
    },
    {
      id: 6,
      title: 'Практика: Тестирование авторизации API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Симулируйте тестирование API с авторизацией: токены, роли, доступ.',
      requirements: [
        'Создайте систему токенов: generateToken(userId, role), validateToken(token)',
        'API endpoints: GET /profile (нужен токен), POST /admin/users (нужна роль ADMIN)',
        'Протестируйте: без токена -> 401, с невалидным токеном -> 401',
        'Протестируйте: USER не может в /admin -> 403, ADMIN может',
        'Минимум 5 тестов'
      ],
      expectedOutput: 'PASS: testNoToken_401\nPASS: testInvalidToken_401\nPASS: testValidToken_200\nPASS: testUserAccessAdmin_403\nPASS: testAdminAccess_200\nИтого: 5/5',
      hint: 'Токен = "TOKEN-userId-role". validateToken парсит строку и извлекает userId и role.',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Token system ---
    static Map<Integer, String> users = new HashMap<>();

    static String generateToken(int userId, String role) {
        return "TOKEN-" + userId + "-" + role;
    }

    static String[] validateToken(String token) {
        if (token == null || !token.startsWith("TOKEN-")) {
            return null; // невалидный
        }
        String[] parts = token.split("-");
        if (parts.length != 3) return null;
        try {
            int userId = Integer.parseInt(parts[1]);
            String role = parts[2];
            if (!users.containsKey(userId)) return null;
            return new String[]{String.valueOf(userId), role};
        } catch (Exception e) {
            return null;
        }
    }

    // --- API handlers ---
    static String handleGetProfile(String token) {
        String[] auth = validateToken(token);
        if (auth == null) {
            return "401:Unauthorized";
        }
        int userId = Integer.parseInt(auth[0]);
        String name = users.get(userId);
        return "200:{\"id\":" + userId + ",\"name\":\"" + name + "\"}";
    }

    static String handleAdminCreateUser(String token, String name) {
        String[] auth = validateToken(token);
        if (auth == null) {
            return "401:Unauthorized";
        }
        if (!"ADMIN".equals(auth[1])) {
            return "403:Forbidden - Admin only";
        }
        int newId = users.size() + 1;
        users.put(newId, name);
        return "201:User created with id=" + newId;
    }

    // --- Assertions ---
    static void assertStatus(String response, int expected) {
        int actual = Integer.parseInt(
            response.substring(0, response.indexOf(':')));
        if (actual != expected) {
            throw new RuntimeException(
                "Status: expected " + expected +
                ", got " + actual + " (response: " + response + ")");
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Expected true");
    }

    static void setUp() {
        users.clear();
        users.put(1, "John");
        users.put(2, "Admin User");
    }

    static void runTest(String name, Runnable test) {
        total++;
        setUp();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testNoToken_401", () -> {
            String response = handleGetProfile(null);
            assertStatus(response, 401);
        });

        runTest("testInvalidToken_401", () -> {
            String response = handleGetProfile("invalid-token");
            assertStatus(response, 401);

            String response2 = handleGetProfile("TOKEN-999-USER");
            assertStatus(response2, 401); // user not in DB
        });

        runTest("testValidToken_200", () -> {
            String token = generateToken(1, "USER");
            String response = handleGetProfile(token);
            assertStatus(response, 200);
            assertTrue(response.contains("John"));
        });

        runTest("testUserAccessAdmin_403", () -> {
            String userToken = generateToken(1, "USER");
            String response = handleAdminCreateUser(userToken, "New");
            assertStatus(response, 403);
        });

        runTest("testAdminAccess_200", () -> {
            String adminToken = generateToken(2, "ADMIN");
            String response = handleAdminCreateUser(
                adminToken, "NewUser");
            assertStatus(response, 201);
            assertTrue(response.contains("User created"));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы симулировали тестирование API с авторизацией. Токен содержит userId и role. Middleware (validateToken) проверяет токен. 401 = нет/невалидный токен, 403 = нет прав. Это базовый паттерн в реальных Spring Security тестах: без токена -> Unauthorized, без роли -> Forbidden.'
    },
    {
      id: 7,
      title: 'Практика: Полный CRUD API тест',
      type: 'practice',
      difficulty: 'hard',
      description: 'Протестируйте полный CRUD API для заметок (Notes) с валидацией и фильтрацией.',
      requirements: [
        'CRUD: POST /notes, GET /notes, GET /notes/{id}, PUT /notes/{id}, DELETE /notes/{id}',
        'Фильтрация: GET /notes?tag=work — фильтр по тегу',
        'Валидация: title обязательный, максимум 100 символов',
        'Протестируйте весь CRUD цикл + валидацию + фильтрацию',
        'Минимум 7 тестов'
      ],
      expectedOutput: 'PASS: testCreateNote\nPASS: testGetNote\nPASS: testUpdateNote\nPASS: testDeleteNote\nPASS: testListNotes\nPASS: testFilterByTag\nPASS: testValidation\nИтого: 7/7',
      hint: 'Для фильтрации парсите query string из path: /notes?tag=work.',
      solution: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Storage ---
    static Map<Integer, String[]> notes = new HashMap<>();
    // String[] = {title, body, tag}
    static int nextId = 1;

    // --- Validation ---
    static String validate(String title) {
        if (title == null || title.trim().isEmpty()) {
            return "Title is required";
        }
        if (title.length() > 100) {
            return "Title must be <= 100 chars";
        }
        return null; // valid
    }

    // --- API Router ---
    static String handleRequest(String method, String path, String body) {
        // Parse path and query
        String cleanPath = path;
        String query = null;
        if (path.contains("?")) {
            cleanPath = path.substring(0, path.indexOf("?"));
            query = path.substring(path.indexOf("?") + 1);
        }

        switch (method) {
            case "POST":
                if (cleanPath.equals("/notes")) {
                    return createNote(body);
                }
                break;
            case "GET":
                if (cleanPath.equals("/notes")) {
                    return listNotes(query);
                }
                if (cleanPath.startsWith("/notes/")) {
                    return getNote(parseId(cleanPath));
                }
                break;
            case "PUT":
                if (cleanPath.startsWith("/notes/")) {
                    return updateNote(parseId(cleanPath), body);
                }
                break;
            case "DELETE":
                if (cleanPath.startsWith("/notes/")) {
                    return deleteNote(parseId(cleanPath));
                }
                break;
        }
        return "404:Not found";
    }

    static int parseId(String path) {
        return Integer.parseInt(path.substring(path.lastIndexOf('/') + 1));
    }

    static String createNote(String body) {
        // body format: "title|content|tag"
        String[] parts = body.split("\\\\|");
        String err = validate(parts[0]);
        if (err != null) return "400:" + err;
        int id = nextId++;
        notes.put(id, new String[]{
            parts[0],
            parts.length > 1 ? parts[1] : "",
            parts.length > 2 ? parts[2] : ""
        });
        return "201:id=" + id;
    }

    static String getNote(int id) {
        String[] note = notes.get(id);
        if (note == null) return "404:Not found";
        return "200:" + note[0] + "|" + note[1] + "|" + note[2];
    }

    static String updateNote(int id, String body) {
        if (!notes.containsKey(id)) return "404:Not found";
        String[] parts = body.split("\\\\|");
        String err = validate(parts[0]);
        if (err != null) return "400:" + err;
        notes.put(id, new String[]{
            parts[0],
            parts.length > 1 ? parts[1] : "",
            parts.length > 2 ? parts[2] : ""
        });
        return "200:Updated";
    }

    static String deleteNote(int id) {
        if (notes.remove(id) == null) return "404:Not found";
        return "204:Deleted";
    }

    static String listNotes(String query) {
        List<String> result = new ArrayList<>();
        String tagFilter = null;
        if (query != null && query.startsWith("tag=")) {
            tagFilter = query.substring(4);
        }
        for (Map.Entry<Integer, String[]> e : notes.entrySet()) {
            if (tagFilter == null || e.getValue()[2].equals(tagFilter)) {
                result.add(e.getKey() + ":" + e.getValue()[0]);
            }
        }
        return "200:[" + String.join(",", result) + "]";
    }

    // --- Assertions ---
    static void assertStatus(String resp, int expected) {
        int actual = Integer.parseInt(resp.substring(0, resp.indexOf(':')));
        if (actual != expected) throw new RuntimeException(
            "Status: expected " + expected + ", got " + actual);
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Expected true");
    }

    static void setUp() {
        notes.clear();
        nextId = 1;
    }

    static void runTest(String name, Runnable test) {
        total++;
        setUp();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testCreateNote", () -> {
            String r = handleRequest("POST", "/notes", "Купить молоко|Срочно|home");
            assertStatus(r, 201);
            assertTrue(r.contains("id=1"));
        });

        runTest("testGetNote", () -> {
            handleRequest("POST", "/notes", "Тест|Описание|work");
            String r = handleRequest("GET", "/notes/1", null);
            assertStatus(r, 200);
            assertTrue(r.contains("Тест"));
        });

        runTest("testUpdateNote", () -> {
            handleRequest("POST", "/notes", "Старое|X|work");
            String r = handleRequest("PUT", "/notes/1", "Новое|Y|home");
            assertStatus(r, 200);
            String get = handleRequest("GET", "/notes/1", null);
            assertTrue(get.contains("Новое"));
        });

        runTest("testDeleteNote", () -> {
            handleRequest("POST", "/notes", "Удалить|X|work");
            String r = handleRequest("DELETE", "/notes/1", null);
            assertStatus(r, 204);
            assertStatus(handleRequest("GET", "/notes/1", null), 404);
        });

        runTest("testListNotes", () -> {
            handleRequest("POST", "/notes", "Note1|X|work");
            handleRequest("POST", "/notes", "Note2|Y|home");
            String r = handleRequest("GET", "/notes", null);
            assertStatus(r, 200);
            assertTrue(r.contains("Note1"));
            assertTrue(r.contains("Note2"));
        });

        runTest("testFilterByTag", () -> {
            handleRequest("POST", "/notes", "Work1|X|work");
            handleRequest("POST", "/notes", "Home1|Y|home");
            handleRequest("POST", "/notes", "Work2|Z|work");
            String r = handleRequest("GET", "/notes?tag=work", null);
            assertStatus(r, 200);
            assertTrue(r.contains("Work1"));
            assertTrue(r.contains("Work2"));
            assertTrue(!r.contains("Home1"));
        });

        runTest("testValidation", () -> {
            assertStatus(handleRequest("POST", "/notes", "|X|work"), 400);
            String longTitle = "A".repeat(101);
            assertStatus(handleRequest("POST", "/notes",
                longTitle + "|X|work"), 400);
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы создали полный CRUD API-тест для Notes. Router разбирает method+path и вызывает соответствующий handler. Тестируем весь lifecycle: create -> get -> update -> delete, плюс фильтрацию по тегу и валидацию. Это паттерн, который используется в каждом Spring Boot проекте.'
    }
  ]
}
