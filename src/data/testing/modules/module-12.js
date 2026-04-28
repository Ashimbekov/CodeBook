export default {
  id: 12,
  title: 'Best Practices',
  description: 'Именование тестов, AAA, Test Data Builders, антипаттерны',
  lessons: [
    {
      id: 1,
      title: 'Именование тестов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Название теста — это его документация. Хорошее название объясняет, ЧТО тестируется, ПРИ КАКИХ УСЛОВИЯХ и КАКОЙ ОЖИДАЕМЫЙ РЕЗУЛЬТАТ.' },
        { type: 'heading', value: 'Плохие названия' },
        { type: 'code', language: 'java', value: '// Ничего не говорят:\ntest1()\ntestMethod()\ntestService()\ntestIt()' },
        { type: 'heading', value: 'Хорошие паттерны именования' },
        { type: 'code', language: 'java', value: '// Паттерн 1: should_Result_When_Condition\nshould_ThrowException_When_DivideByZero()\nshould_ReturnEmpty_When_UserNotFound()\nshould_SendEmail_When_OrderCreated()\n\n// Паттерн 2: methodName_condition_expectedResult\ndivide_byZero_throwsArithmeticException()\nfindUser_withInvalidId_returnsNull()\ncreateOrder_withValidData_returnsOrder()\n\n// Паттерн 3: given_When_Then (BDD)\ngivenInvalidEmail_whenRegister_thenThrowException()\ngivenEmptyCart_whenCheckout_thenReturnError()' },
        { type: 'heading', value: '@DisplayName для читаемости' },
        { type: 'code', language: 'java', value: '@DisplayName("Калькулятор скидок")\nclass DiscountCalculatorTest {\n\n    @Test\n    @DisplayName("Скидка 10% для заказов от 1000 руб")\n    void should_Apply10Percent_When_OrderOver1000() { }\n\n    @Test\n    @DisplayName("Без скидки для заказов меньше 500 руб")\n    void should_NoDiscount_When_OrderUnder500() { }\n}' },
        { type: 'tip', value: 'Представьте: тест упал в CI в 3 часа ночи. По одному названию нужно понять, ЧТО сломалось. "test1" не поможет, а "should_RejectPayment_When_CardExpired" — поможет.' }
      ]
    },
    {
      id: 2,
      title: 'Антипаттерны тестирования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Плохие тесты хуже отсутствия тестов — они дают ложную уверенность и замедляют разработку.' },
        { type: 'heading', value: 'Антипаттерн 1: Тест без assert' },
        { type: 'code', language: 'java', value: '// ПЛОХО — тест ничего не проверяет!\n@Test\nvoid testCreateUser() {\n    service.createUser("John", "john@mail.com");\n    // и всё... где assert?\n}' },
        { type: 'heading', value: 'Антипаттерн 2: Тест всего подряд' },
        { type: 'code', language: 'java', value: '// ПЛОХО — один тест проверяет 10 вещей:\n@Test\nvoid testEverything() {\n    User user = service.create("John");\n    assertEquals("John", user.getName());\n    service.update(user, "Jane");\n    assertEquals("Jane", user.getName());\n    service.delete(user);\n    assertNull(service.find(user.getId()));\n    // Если упадёт на update — мы не узнаем про delete\n}' },
        { type: 'heading', value: 'Антипаттерн 3: Хрупкий тест' },
        { type: 'code', language: 'java', value: '// ПЛОХО — привязан к реализации:\n@Test\nvoid testSort() {\n    // Проверяем, что вызван Arrays.sort()\n    verify(mockArrays).sort(any());\n    // Завтра заменим на Collections.sort — тест сломается\n}\n\n// ХОРОШО — проверяем результат:\n@Test\nvoid testSort() {\n    List<Integer> result = service.sort(List.of(3, 1, 2));\n    assertEquals(List.of(1, 2, 3), result);\n}' },
        { type: 'heading', value: 'Антипаттерн 4: Зависимые тесты' },
        { type: 'code', language: 'java', value: '// ПЛОХО — test2 зависит от test1:\n@Test @Order(1)\nvoid test1() {\n    user = service.create("John"); // user — общее поле\n}\n\n@Test @Order(2)\nvoid test2() {\n    service.delete(user); // FAIL если test1 не запустился\n}' },
        { type: 'heading', value: 'Ещё антипаттерны' },
        { type: 'list', items: [
          'Flaky tests — иногда проходят, иногда нет (race conditions, timestamps)',
          'Тестирование private-методов через reflection',
          'Слишком много моков — 5+ моков = плохой дизайн',
          'Copy-paste тестов — дублирование вместо параметризации'
        ]},
        { type: 'warning', value: 'Если тест сложнее, чем тестируемый код — что-то не так. Тесты должны быть ПРОЩЕ кода.' }
      ]
    },
    {
      id: 3,
      title: 'Test Data Builders',
      type: 'theory',
      content: [
        { type: 'text', value: 'Test Data Builder — паттерн создания тестовых данных. Избавляет от дублирования и делает тесты читаемыми.' },
        { type: 'heading', value: 'Проблема: создание объектов в тестах' },
        { type: 'code', language: 'java', value: '// ПЛОХО — повторяется в каждом тесте:\n@Test void test1() {\n    User user = new User("John", "john@mail.com",\n        25, "Москва", "ИТ", true, Role.USER);\n    // ...\n}\n@Test void test2() {\n    User user = new User("Jane", "jane@mail.com",\n        30, "Астана", "HR", true, Role.ADMIN);\n    // ...\n}' },
        { type: 'heading', value: 'Решение: Builder' },
        { type: 'code', language: 'java', value: '// Test Data Builder:\nclass UserBuilder {\n    private String name = "John"; // значения по умолчанию\n    private String email = "john@mail.com";\n    private int age = 25;\n    private String city = "Москва";\n    private boolean active = true;\n    private Role role = Role.USER;\n\n    static UserBuilder aUser() {\n        return new UserBuilder();\n    }\n\n    UserBuilder withName(String name) {\n        this.name = name;\n        return this;\n    }\n\n    UserBuilder withRole(Role role) {\n        this.role = role;\n        return this;\n    }\n\n    UserBuilder inactive() {\n        this.active = false;\n        return this;\n    }\n\n    User build() {\n        return new User(name, email, age, city, active, role);\n    }\n}' },
        { type: 'heading', value: 'Использование в тестах' },
        { type: 'code', language: 'java', value: '// Чисто и читаемо:\nUser user = aUser().withName("Jane").build();\nUser admin = aUser().withRole(Role.ADMIN).build();\nUser inactive = aUser().inactive().build();\n\n// Важно: указываем ТОЛЬКО отличия от дефолта\n// Тест фокусируется на том, что ВАЖНО' },
        { type: 'tip', value: 'Создайте Builders для всех сущностей проекта и положите в src/test/java. Это сэкономит часы при написании тестов.' }
      ]
    },
    {
      id: 4,
      title: 'F.I.R.S.T. принципы',
      type: 'theory',
      content: [
        { type: 'text', value: 'F.I.R.S.T. — пять свойств хорошего теста. Если тест нарушает хоть одно — переписывайте.' },
        { type: 'heading', value: 'F — Fast (Быстрый)' },
        { type: 'text', value: 'Unit-тест должен выполняться за миллисекунды. 1000 тестов — за секунды. Если тест медленный — это не unit-тест.' },
        { type: 'heading', value: 'I — Independent (Независимый)' },
        { type: 'text', value: 'Каждый тест работает автономно. Не зависит от порядка запуска, от других тестов, от состояния системы.' },
        { type: 'heading', value: 'R — Repeatable (Повторяемый)' },
        { type: 'text', value: 'Тест даёт одинаковый результат при каждом запуске. Никаких random, Date.now(), внешних API.' },
        { type: 'heading', value: 'S — Self-validating (Самопроверяющийся)' },
        { type: 'text', value: 'Тест сам определяет PASS/FAIL. Не нужно смотреть логи или вручную проверять базу.' },
        { type: 'heading', value: 'T — Timely (Своевременный)' },
        { type: 'text', value: 'Тесты пишутся вовремя — до или вместе с кодом, а не через месяц после релиза.' },
        { type: 'code', language: 'java', value: '// НАРУШЕНИЕ Repeatable:\n@Test void testExpiry() {\n    // ПЛОХО: завтра тест сломается!\n    Token token = new Token(LocalDate.of(2025, 12, 31));\n    assertTrue(token.isValid());\n}\n\n// ПРАВИЛЬНО:\n@Test void testExpiry() {\n    Token token = new Token(LocalDate.now().plusDays(30));\n    assertTrue(token.isValid());\n}' },
        { type: 'note', value: 'Если тест нарушает FIRST — он становится "flaky" (нестабильным). Flaky тесты — самое страшное: команда перестаёт доверять тестам.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Test Data Builder',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Test Data Builder для Order и используйте его в тестах.',
      requirements: [
        'Order имеет поля: id, customerName, items (список), totalPrice, status, createdDate',
        'Создайте OrderBuilder с fluent API и разумными значениями по умолчанию',
        'Используйте builder в 5 тестах: каждый переопределяет только нужные поля',
        'Покажите разницу: с builder тест фокусируется на главном',
        'Создайте хелпер-методы: aPaidOrder(), aCancelledOrder()'
      ],
      expectedOutput: 'PASS: testDefaultOrder\nPASS: testPaidOrder\nPASS: testCancelledOrder\nPASS: testOrderWithMultipleItems\nPASS: testOrderTotalCalculation\nИтого: 5/5',
      hint: 'Builder хранит дефолтные значения. Каждый with-метод возвращает this. build() создаёт итоговый объект.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Order ---
    static String[] orderFields; // id, customer, status, date
    static List<String> orderItems;
    static double orderTotal;

    // --- Order Builder ---
    static int buildId = 1;
    static String buildCustomer = "John Doe";
    static List<String> buildItems = new ArrayList<>();
    static double buildTotal = 100.0;
    static String buildStatus = "NEW";
    static String buildDate = "2025-01-01";

    static void resetBuilder() {
        buildId = 1;
        buildCustomer = "John Doe";
        buildItems = new ArrayList<>();
        buildItems.add("Item-1");
        buildTotal = 100.0;
        buildStatus = "NEW";
        buildDate = "2025-01-01";
    }

    static void withId(int id) { buildId = id; }
    static void withCustomer(String c) { buildCustomer = c; }
    static void withItems(String... items) {
        buildItems = new ArrayList<>();
        for (String i : items) buildItems.add(i);
    }
    static void withTotal(double t) { buildTotal = t; }
    static void withStatus(String s) { buildStatus = s; }

    static void buildOrder() {
        orderFields = new String[]{
            String.valueOf(buildId), buildCustomer,
            buildStatus, buildDate
        };
        orderItems = new ArrayList<>(buildItems);
        orderTotal = buildTotal;
    }

    // --- Convenience builders ---
    static void buildDefaultOrder() {
        resetBuilder();
        buildOrder();
    }

    static void buildPaidOrder() {
        resetBuilder();
        buildStatus = "PAID";
        buildTotal = 500.0;
        buildOrder();
    }

    static void buildCancelledOrder() {
        resetBuilder();
        buildStatus = "CANCELLED";
        buildTotal = 0.0;
        buildOrder();
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
        runTest("testDefaultOrder", () -> {
            // Builder создаёт заказ со всеми дефолтами
            buildDefaultOrder();
            assertEquals("John Doe", orderFields[1]);
            assertEquals("NEW", orderFields[2]);
            assertEquals(100.0, orderTotal);
            assertEquals(1, orderItems.size());
        });

        runTest("testPaidOrder", () -> {
            // Хелпер-метод — только статус и цена важны
            buildPaidOrder();
            assertEquals("PAID", orderFields[2]);
            assertEquals(500.0, orderTotal);
        });

        runTest("testCancelledOrder", () -> {
            buildCancelledOrder();
            assertEquals("CANCELLED", orderFields[2]);
            assertEquals(0.0, orderTotal);
        });

        runTest("testOrderWithMultipleItems", () -> {
            resetBuilder();
            withItems("Ноутбук", "Мышка", "Клавиатура");
            withTotal(75000.0);
            buildOrder();
            assertEquals(3, orderItems.size());
            assertTrue(orderItems.contains("Ноутбук"));
            assertTrue(orderItems.contains("Мышка"));
        });

        runTest("testOrderTotalCalculation", () -> {
            resetBuilder();
            withCustomer("Alice");
            withItems("A", "B");
            // Симуляция расчёта: 2 предмета по 50
            withTotal(50.0 * 2);
            buildOrder();
            assertEquals("Alice", orderFields[1]);
            assertEquals(100.0, orderTotal);
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Test Data Builder избавляет от конструкторов с 10 параметрами. resetBuilder() задаёт дефолты, with-методы меняют только нужное. buildPaidOrder() — хелпер для частого сценария. Тест фокусируется на том, что ВАЖНО для проверки, а не на создании объекта с 10 полями.'
    },
    {
      id: 6,
      title: 'Практика: Рефакторинг плохих тестов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан набор "плохих" тестов с антипаттернами. Перепишите их правильно.',
      requirements: [
        'Создайте класс UserService: register, login, changePassword',
        'Напишите сначала "плохие" тесты (один гигантский тест на всё), потом покажите правильные',
        'Примените: хорошие имена, AAA, один assert, независимость',
        'Каждый тест проверяет ОДНО поведение',
        'Минимум 6 отдельных тестов вместо одного большого'
      ],
      expectedOutput: 'ПЛОХОЙ ПОДХОД (1 тест на всё):\nPASS: testEverything (но ненадёжно!)\n\nХОРОШИЙ ПОДХОД (отдельные тесты):\nPASS: should_Register_When_ValidData\nPASS: should_FailRegister_When_DuplicateEmail\nPASS: should_Login_When_CorrectPassword\nPASS: should_FailLogin_When_WrongPassword\nPASS: should_ChangePassword_When_OldPasswordCorrect\nPASS: should_FailChangePassword_When_OldPasswordWrong\nИтого: 6/6',
      hint: 'Каждый тест начинает с чистого состояния (setUp). Каждый тест проверяет ровно одно поведение.',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- UserService ---
    static Map<String, String> users = new HashMap<>(); // email -> password

    static boolean register(String email, String password) {
        if (users.containsKey(email)) return false;
        users.put(email, password);
        return true;
    }

    static boolean login(String email, String password) {
        String stored = users.get(email);
        return stored != null && stored.equals(password);
    }

    static boolean changePassword(String email, String oldPass,
                                   String newPass) {
        String stored = users.get(email);
        if (stored == null || !stored.equals(oldPass)) return false;
        users.put(email, newPass);
        return true;
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
    static void assertFalse(boolean c) {
        if (c) throw new RuntimeException("Expected false");
    }

    static void setUp() {
        users.clear();
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
        // === ПЛОХОЙ ПОДХОД ===
        System.out.println("ПЛОХОЙ ПОДХОД (1 тест на всё):");
        setUp();
        try {
            // Один гигантский тест — антипаттерн!
            register("john@mail.com", "pass123");
            assertTrue(login("john@mail.com", "pass123"));
            assertFalse(login("john@mail.com", "wrong"));
            assertFalse(register("john@mail.com", "other"));
            assertTrue(changePassword("john@mail.com", "pass123", "new"));
            assertTrue(login("john@mail.com", "new"));
            System.out.println("PASS: testEverything (но ненадёжно!)");
        } catch (Exception e) {
            System.out.println("FAIL: testEverything");
        }

        // === ХОРОШИЙ ПОДХОД ===
        System.out.println("\\nХОРОШИЙ ПОДХОД (отдельные тесты):");

        runTest("should_Register_When_ValidData", () -> {
            // Arrange (nothing)
            // Act
            boolean result = register("john@mail.com", "pass123");
            // Assert
            assertTrue(result);
        });

        runTest("should_FailRegister_When_DuplicateEmail", () -> {
            // Arrange
            register("john@mail.com", "pass123");
            // Act
            boolean result = register("john@mail.com", "other");
            // Assert
            assertFalse(result);
        });

        runTest("should_Login_When_CorrectPassword", () -> {
            // Arrange
            register("john@mail.com", "pass123");
            // Act
            boolean result = login("john@mail.com", "pass123");
            // Assert
            assertTrue(result);
        });

        runTest("should_FailLogin_When_WrongPassword", () -> {
            // Arrange
            register("john@mail.com", "pass123");
            // Act
            boolean result = login("john@mail.com", "wrong");
            // Assert
            assertFalse(result);
        });

        runTest("should_ChangePassword_When_OldPasswordCorrect", () -> {
            // Arrange
            register("john@mail.com", "oldPass");
            // Act
            boolean result = changePassword(
                "john@mail.com", "oldPass", "newPass");
            // Assert
            assertTrue(result);
            assertTrue(login("john@mail.com", "newPass"));
        });

        runTest("should_FailChangePassword_When_OldPasswordWrong", () -> {
            // Arrange
            register("john@mail.com", "correct");
            // Act
            boolean result = changePassword(
                "john@mail.com", "wrong", "new");
            // Assert
            assertFalse(result);
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Плохой тест "testEverything" проверяет всё в одном методе — если register сломается, мы не узнаем о login и changePassword. Хорошие тесты: каждый независим (setUp очищает), имеет понятное имя (should_X_When_Y), следует AAA, проверяет ОДНО поведение. При падении сразу видно ЧТО сломалось.'
    }
  ]
}
