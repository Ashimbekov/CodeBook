export default {
  id: 9,
  title: 'Интеграционные тесты',
  description: 'Testcontainers, embedded DB, тестирование слоёв приложения вместе',
  lessons: [
    {
      id: 1,
      title: 'Что такое интеграционные тесты?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Интеграционные тесты проверяют, что несколько компонентов работают ВМЕСТЕ правильно. В отличие от unit-тестов, здесь не мокают зависимости.' },
        { type: 'heading', value: 'Unit vs Integration' },
        { type: 'code', language: 'text', value: 'Unit-тест:         [Service] + [Mock Repo]\nИнтеграционный:    [Service] + [Real Repo] + [Real DB]' },
        { type: 'heading', value: 'Что тестируем интеграционно?' },
        { type: 'list', items: [
          'Service + Repository + Database — CRUD операции',
          'Controller + Service — HTTP endpoint до бизнес-логики',
          'Сериализация/десериализация JSON',
          'SQL-запросы — правильный маппинг колонок',
          'Конфигурация Spring — правильная сборка бинов',
          'Транзакции — правильный rollback при ошибке'
        ]},
        { type: 'heading', value: 'Пример интеграционного теста' },
        { type: 'code', language: 'java', value: '// В Spring Boot:\n@SpringBootTest\n@Transactional // откатит изменения после теста\nclass UserServiceIntegrationTest {\n\n    @Autowired\n    UserService service;\n\n    @Autowired\n    UserRepository repository;\n\n    @Test\n    void shouldSaveAndFindUser() {\n        // Act\n        User saved = service.createUser("John", "john@mail.com");\n\n        // Assert — проверяем через репозиторий\n        User found = repository.findById(saved.getId()).orElseThrow();\n        assertEquals("John", found.getName());\n        assertEquals("john@mail.com", found.getEmail());\n    }\n}' },
        { type: 'warning', value: 'Интеграционные тесты медленнее unit-тестов. Запускайте их отдельно от unit-тестов (разные Maven profiles).' },
        { type: 'tip', value: 'Правило: если баг можно найти unit-тестом — не пишите интеграционный. Интеграционные тесты — для проверки ВЗАИМОДЕЙСТВИЯ.' }
      ]
    },
    {
      id: 2,
      title: 'Testcontainers и Embedded DB',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для интеграционных тестов нужна настоящая БД. Есть два подхода: Testcontainers (Docker) и Embedded DB (H2).' },
        { type: 'heading', value: 'H2 Embedded Database' },
        { type: 'code', language: 'java', value: '// В application-test.yml:\n// spring.datasource.url=jdbc:h2:mem:testdb\n// spring.datasource.driver=org.h2.Driver\n// spring.jpa.hibernate.ddl-auto=create-drop\n\n// Плюсы: быстро, без Docker\n// Минусы: H2 != PostgreSQL (разный SQL)' },
        { type: 'heading', value: 'Testcontainers — реальная БД в Docker' },
        { type: 'code', language: 'java', value: '// Testcontainers поднимает PostgreSQL в Docker:\n@Testcontainers\n@SpringBootTest\nclass UserRepoTest {\n\n    @Container\n    static PostgreSQLContainer<?> postgres =\n        new PostgreSQLContainer<>("postgres:15")\n            .withDatabaseName("testdb")\n            .withUsername("test")\n            .withPassword("test");\n\n    @DynamicPropertySource\n    static void configureProperties(\n            DynamicPropertyRegistry registry) {\n        registry.add("spring.datasource.url",\n            postgres::getJdbcUrl);\n        registry.add("spring.datasource.username",\n            postgres::getUsername);\n        registry.add("spring.datasource.password",\n            postgres::getPassword);\n    }\n\n    @Test\n    void testSaveUser() {\n        // Тест использует РЕАЛЬНЫЙ PostgreSQL!\n    }\n}' },
        { type: 'heading', value: 'Сравнение подходов' },
        { type: 'code', language: 'text', value: '           H2              Testcontainers\nСкорость:  Очень быстро     Медленнее (Docker)\nТочность:  Примерно         Полная (тот же SQL)\nSetup:     Просто           Нужен Docker\nCI/CD:     Везде             Нужен Docker в CI' },
        { type: 'tip', value: 'Используйте H2 для быстрого фидбека в dev, Testcontainers — в CI для точной проверки SQL-совместимости.' }
      ]
    },
    {
      id: 3,
      title: '@Transactional и изоляция тестов',
      type: 'theory',
      content: [
        { type: 'text', value: '@Transactional на тесте откатывает все изменения после завершения. Каждый тест начинает с чистой БД.' },
        { type: 'heading', value: 'Проблема без @Transactional' },
        { type: 'code', language: 'java', value: '// БЕЗ @Transactional — тесты влияют друг на друга!\nclass UserTest {\n    @Test\n    void test1() {\n        repo.save(new User("John")); // John остаётся в БД\n    }\n\n    @Test\n    void test2() {\n        List<User> all = repo.findAll();\n        assertEquals(0, all.size());\n        // FAIL! John из test1 ещё в БД!\n    }\n}' },
        { type: 'heading', value: 'Решение: @Transactional' },
        { type: 'code', language: 'java', value: '@Transactional // все изменения откатятся\nclass UserTest {\n    @Test\n    void test1() {\n        repo.save(new User("John")); // ROLLBACK после теста\n    }\n\n    @Test\n    void test2() {\n        List<User> all = repo.findAll();\n        assertEquals(0, all.size()); // PASS! БД чистая\n    }\n}' },
        { type: 'heading', value: 'Другие стратегии изоляции' },
        { type: 'list', items: [
          '@Transactional — откат транзакции (самый простой)',
          '@Sql — выполнить SQL перед/после теста',
          '@DirtiesContext — пересоздать весь Spring контекст',
          'Ручная очистка в @AfterEach — repo.deleteAll()'
        ]},
        { type: 'code', language: 'java', value: '// @Sql — выполнить скрипт перед тестом:\n@Sql("/test-data.sql")\n@Test\nvoid testWithPreparedData() {\n    List<User> users = repo.findAll();\n    assertEquals(5, users.size()); // данные из test-data.sql\n}' },
        { type: 'warning', value: '@DirtiesContext — очень медленно! Пересоздаёт Spring контекст. Используйте только если нет альтернативы.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: Симуляция интеграционного теста',
      type: 'practice',
      difficulty: 'medium',
      description: 'Симулируйте интеграционный тест: Service + Repository + In-Memory Database.',
      requirements: [
        'Создайте in-memory "базу данных" на HashMap',
        'Создайте UserRepository с методами: save, findById, findAll, deleteById',
        'Создайте UserService, который использует UserRepository',
        'Протестируйте полный CRUD flow БЕЗ моков (интеграционно)',
        'Каждый тест должен начинаться с чистой "БД" (симуляция @Transactional)'
      ],
      expectedOutput: 'PASS: testCreateAndFind\nPASS: testFindAll\nPASS: testUpdate\nPASS: testDelete\nPASS: testNotFound\nPASS: testIsolation\nИтого: 6/6',
      hint: 'HashMap<Integer, String[]> для хранения. В setUp очищайте map.',
      solution: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- In-Memory Database ---
    static Map<Integer, String[]> database = new HashMap<>();
    static int nextId = 1;

    // --- Repository (доступ к "БД") ---
    static int save(String name, String email) {
        int id = nextId++;
        database.put(id, new String[]{name, email});
        return id;
    }

    static String[] findById(int id) {
        return database.get(id); // null если нет
    }

    static List<String[]> findAll() {
        return new ArrayList<>(database.values());
    }

    static boolean deleteById(int id) {
        return database.remove(id) != null;
    }

    static void update(int id, String name, String email) {
        if (!database.containsKey(id)) {
            throw new RuntimeException("User not found: " + id);
        }
        database.put(id, new String[]{name, email});
    }

    // --- Service (бизнес-логика) ---
    static int createUser(String name, String email) {
        // Проверка дубликата email
        for (String[] user : database.values()) {
            if (user[1].equals(email)) {
                throw new RuntimeException("Email already exists");
            }
        }
        return save(name, email);
    }

    static String getUserName(int id) {
        String[] user = findById(id);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return user[0];
    }

    // --- Test infrastructure ---
    static void setUp() {
        database.clear();
        nextId = 1;
    }

    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Expected [" + expected + "], got [" + actual + "]");
        }
    }

    static void assertNull(Object obj) {
        if (obj != null) throw new RuntimeException("Expected null");
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Expected true");
    }

    static void assertThrows(Runnable code) {
        try {
            code.run();
            throw new RuntimeException("Expected exception");
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Expected exception")) throw e;
        }
    }

    static void runTest(String name, Runnable test) {
        total++;
        setUp(); // симуляция @Transactional (чистая БД)
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testCreateAndFind", () -> {
            // Интеграционный: Service -> Repo -> DB
            int id = createUser("John", "john@mail.com");
            String name = getUserName(id);
            assertEquals("John", name);
        });

        runTest("testFindAll", () -> {
            createUser("Alice", "alice@mail.com");
            createUser("Bob", "bob@mail.com");
            List<String[]> all = findAll();
            assertEquals(2, all.size());
        });

        runTest("testUpdate", () -> {
            int id = save("John", "john@mail.com");
            update(id, "John Updated", "john@mail.com");
            String[] user = findById(id);
            assertEquals("John Updated", user[0]);
        });

        runTest("testDelete", () -> {
            int id = createUser("ToDelete", "del@mail.com");
            assertTrue(deleteById(id));
            assertNull(findById(id));
        });

        runTest("testNotFound", () -> {
            assertThrows(() -> getUserName(999));
        });

        runTest("testIsolation", () -> {
            // Проверяем, что БД чистая (предыдущие тесты не повлияли)
            assertEquals(0, findAll().size());
            createUser("Test", "test@mail.com");
            assertEquals(1, findAll().size());
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы симулировали интеграционный тест: Service использует Repository, Repository работает с in-memory DB (HashMap). Нет моков — все слои работают по-настоящему. setUp() играет роль @Transactional — очищает "БД" перед каждым тестом. Тест testIsolation проверяет, что тесты изолированы.'
    },
    {
      id: 5,
      title: 'Практика: Тестирование транзакций',
      type: 'practice',
      difficulty: 'hard',
      description: 'Симулируйте транзакционное поведение: если одна операция упала, все изменения откатываются.',
      requirements: [
        'Создайте метод transferMoney(fromId, toId, amount) — перевод между счетами',
        'Если денег недостаточно — RuntimeException, обе суммы не меняются',
        'Если получатель не найден — RuntimeException, сумма отправителя не меняется',
        'Протестируйте: успешный перевод, недостаточно средств, получатель не найден',
        'Проверьте "откат": при ошибке балансы остаются прежними'
      ],
      expectedOutput: 'PASS: testSuccessfulTransfer\nPASS: testInsufficientFunds\nPASS: testRecipientNotFound\nPASS: testBalancesUnchangedOnError\nPASS: testMultipleTransfers\nИтого: 5/5',
      hint: 'Сохраните балансы ДО операции. При ошибке восстановите. Это симуляция transaction rollback.',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- In-Memory Bank DB ---
    static Map<Integer, Double> accounts = new HashMap<>();

    static void createAccount(int id, double balance) {
        accounts.put(id, balance);
    }

    static double getBalance(int id) {
        Double balance = accounts.get(id);
        if (balance == null) {
            throw new RuntimeException("Account not found: " + id);
        }
        return balance;
    }

    // --- Transfer with "transaction" ---
    static void transferMoney(int fromId, int toId, double amount) {
        // Сохраняем состояние для "rollback"
        Double fromBalance = accounts.get(fromId);
        Double toBalance = accounts.get(toId);

        if (fromBalance == null) {
            throw new RuntimeException("Sender not found");
        }
        if (toBalance == null) {
            throw new RuntimeException("Recipient not found");
        }
        if (fromBalance < amount) {
            throw new RuntimeException("Insufficient funds");
        }

        // "Commit" — обе операции или ни одной
        accounts.put(fromId, fromBalance - amount);
        accounts.put(toId, toBalance + amount);
    }

    // --- Assertions ---
    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Expected [" + expected + "], got [" + actual + "]");
        }
    }

    static void assertThrows(String expectedMsg, Runnable code) {
        try {
            code.run();
            throw new RuntimeException("Expected exception");
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Expected exception")) throw e;
            if (!e.getMessage().contains(expectedMsg)) {
                throw new RuntimeException(
                    "Wrong message: " + e.getMessage());
            }
        }
    }

    static void setUp() {
        accounts.clear();
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
        runTest("testSuccessfulTransfer", () -> {
            createAccount(1, 1000.0);
            createAccount(2, 500.0);

            transferMoney(1, 2, 300.0);

            assertEquals(700.0, getBalance(1));
            assertEquals(800.0, getBalance(2));
        });

        runTest("testInsufficientFunds", () -> {
            createAccount(1, 100.0);
            createAccount(2, 500.0);

            assertThrows("Insufficient funds",
                () -> transferMoney(1, 2, 200.0));
        });

        runTest("testRecipientNotFound", () -> {
            createAccount(1, 1000.0);

            assertThrows("Recipient not found",
                () -> transferMoney(1, 999, 100.0));
        });

        runTest("testBalancesUnchangedOnError", () -> {
            createAccount(1, 100.0);
            createAccount(2, 200.0);

            // Попытка перевести больше, чем есть
            try {
                transferMoney(1, 2, 500.0);
            } catch (Exception e) {
                // expected
            }

            // Балансы НЕ изменились (rollback)
            assertEquals(100.0, getBalance(1));
            assertEquals(200.0, getBalance(2));
        });

        runTest("testMultipleTransfers", () -> {
            createAccount(1, 1000.0);
            createAccount(2, 0.0);
            createAccount(3, 500.0);

            transferMoney(1, 2, 300.0); // 1: 700, 2: 300
            transferMoney(3, 2, 200.0); // 3: 300, 2: 500
            transferMoney(2, 1, 100.0); // 2: 400, 1: 800

            assertEquals(800.0, getBalance(1));
            assertEquals(400.0, getBalance(2));
            assertEquals(300.0, getBalance(3));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы симулировали транзакционное поведение: transferMoney проверяет ВСЕ условия ДО изменений. Если условие не выполняется — бросает исключение, балансы не меняются. Это паттерн "validate first, then mutate" — ключевой для финансовых систем. В реальном Spring @Transactional делает rollback автоматически.'
    },
    {
      id: 6,
      title: 'Практика: Тестирование слоёв приложения',
      type: 'practice',
      difficulty: 'hard',
      description: 'Симулируйте полный интеграционный тест трёхслойной архитектуры: Controller -> Service -> Repository.',
      requirements: [
        'Repository: save, findById, findAll (HashMap)',
        'Service: создание задачи с валидацией, получение, обновление статуса',
        'Controller: обработка "запросов" и возврат "ответов" (строки)',
        'Протестируйте полный путь: запрос -> контроллер -> сервис -> репозиторий -> ответ',
        'Минимум 5 тестов'
      ],
      expectedOutput: 'PASS: testCreateTask\nPASS: testGetTask\nPASS: testCompleteTask\nPASS: testCreateInvalidTask\nPASS: testGetAllTasks\nИтого: 5/5',
      hint: 'Controller возвращает строки типа "200:Task created" или "404:Not found".',
      solution: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Main {
    static int passed = 0;
    static int total = 0;

    // === REPOSITORY LAYER ===
    static Map<Integer, String[]> taskDb = new HashMap<>();
    static int nextId = 1;

    static int repoSave(String title, String status) {
        int id = nextId++;
        taskDb.put(id, new String[]{title, status});
        return id;
    }

    static String[] repoFindById(int id) {
        return taskDb.get(id);
    }

    static List<String[]> repoFindAll() {
        return new ArrayList<>(taskDb.values());
    }

    static void repoUpdateStatus(int id, String status) {
        String[] task = taskDb.get(id);
        if (task != null) task[1] = status;
    }

    // === SERVICE LAYER ===
    static int serviceCreateTask(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
        return repoSave(title.trim(), "TODO");
    }

    static String[] serviceGetTask(int id) {
        String[] task = repoFindById(id);
        if (task == null) {
            throw new RuntimeException("Task not found: " + id);
        }
        return task;
    }

    static void serviceCompleteTask(int id) {
        String[] task = repoFindById(id);
        if (task == null) {
            throw new RuntimeException("Task not found: " + id);
        }
        repoUpdateStatus(id, "DONE");
    }

    // === CONTROLLER LAYER ===
    static String handleCreate(String title) {
        try {
            int id = serviceCreateTask(title);
            return "201:Task created with id=" + id;
        } catch (IllegalArgumentException e) {
            return "400:" + e.getMessage();
        }
    }

    static String handleGet(int id) {
        try {
            String[] task = serviceGetTask(id);
            return "200:" + task[0] + " [" + task[1] + "]";
        } catch (RuntimeException e) {
            return "404:" + e.getMessage();
        }
    }

    static String handleComplete(int id) {
        try {
            serviceCompleteTask(id);
            return "200:Task completed";
        } catch (RuntimeException e) {
            return "404:" + e.getMessage();
        }
    }

    static String handleGetAll() {
        List<String[]> tasks = repoFindAll();
        return "200:Found " + tasks.size() + " tasks";
    }

    // --- Test infrastructure ---
    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Expected [" + expected + "], got [" + actual + "]");
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Expected true");
    }

    static void setUp() {
        taskDb.clear();
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
        runTest("testCreateTask", () -> {
            String response = handleCreate("Написать тесты");
            assertTrue(response.startsWith("201:"));
            assertTrue(response.contains("id=1"));
        });

        runTest("testGetTask", () -> {
            handleCreate("Код-ревью");
            String response = handleGet(1);
            assertEquals("200:Код-ревью [TODO]", response);
        });

        runTest("testCompleteTask", () -> {
            handleCreate("Деплой");
            handleComplete(1);
            String response = handleGet(1);
            assertEquals("200:Деплой [DONE]", response);
        });

        runTest("testCreateInvalidTask", () -> {
            String response = handleCreate("");
            assertTrue(response.startsWith("400:"));
            String response2 = handleCreate(null);
            assertTrue(response2.startsWith("400:"));
        });

        runTest("testGetAllTasks", () -> {
            handleCreate("Задача 1");
            handleCreate("Задача 2");
            handleCreate("Задача 3");
            String response = handleGetAll();
            assertEquals("200:Found 3 tasks", response);
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы симулировали полный интеграционный тест трёхслойной архитектуры. Запрос проходит Controller -> Service -> Repository -> Database (HashMap). Нет моков — все слои реальные. Controller обрабатывает ошибки и возвращает HTTP-подобные коды. Это классическая архитектура Spring Boot приложений.'
    }
  ]
}
