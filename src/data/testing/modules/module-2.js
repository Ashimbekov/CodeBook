export default {
  id: 2,
  title: 'JUnit 5: основы',
  description: 'Аннотация @Test, assertions, жизненный цикл тестов, setUp/tearDown',
  lessons: [
    {
      id: 1,
      title: 'Что такое JUnit 5?',
      type: 'theory',
      content: [
        { type: 'text', value: 'JUnit — стандартный фреймворк для тестирования в Java. JUnit 5 (Jupiter) — последняя версия с современным API. Он делает за вас всё, что мы создавали вручную в прошлом модуле.' },
        { type: 'heading', value: 'Архитектура JUnit 5' },
        { type: 'list', items: [
          'JUnit Platform — движок для запуска тестов',
          'JUnit Jupiter — новый API (аннотации, assertions)',
          'JUnit Vintage — поддержка старых тестов JUnit 3/4'
        ]},
        { type: 'heading', value: 'Как выглядит тест в JUnit 5' },
        { type: 'code', language: 'java', value: '// В реальном проекте с JUnit:\nimport org.junit.jupiter.api.Test;\nimport static org.junit.jupiter.api.Assertions.*;\n\nclass CalculatorTest {\n    @Test\n    void testAdd() {\n        Calculator calc = new Calculator();\n        assertEquals(5, calc.add(2, 3));\n    }\n}' },
        { type: 'text', value: 'Мы будем симулировать JUnit-подход в чистом Java, чтобы вы понимали, как это работает изнутри.' },
        { type: 'heading', value: 'Наша симуляция JUnit' },
        { type: 'code', language: 'java', value: '// Симулируем JUnit в чистом Java:\npublic class Main {\n    // Симуляция assertEquals\n    static void assertEquals(Object expected, Object actual) {\n        if (!expected.equals(actual)) {\n            throw new AssertionError(\n                "Expected: " + expected + ", but was: " + actual\n            );\n        }\n    }\n\n    // Тестовый метод (как @Test в JUnit)\n    static void testAdd() {\n        Calculator calc = new Calculator();\n        assertEquals(5, calc.add(2, 3));\n    }\n}' },
        { type: 'note', value: 'В реальном проекте JUnit подключается через Maven/Gradle. Мы симулируем его паттерны, чтобы понять механику.' }
      ]
    },
    {
      id: 2,
      title: 'Assertions: assertEquals, assertTrue, assertNull',
      type: 'theory',
      content: [
        { type: 'text', value: 'Assertions (утверждения) — это методы проверки. Если условие не выполняется, тест падает с ошибкой.' },
        { type: 'heading', value: 'Основные assertions' },
        { type: 'code', language: 'java', value: '// assertEquals — проверка равенства\nassertEquals(5, calc.add(2, 3));\nassertEquals("hello", str.toLowerCase());\n\n// assertTrue / assertFalse — проверка boolean\nassertTrue(list.contains("java"));\nassertFalse(list.isEmpty());\n\n// assertNull / assertNotNull — проверка на null\nassertNull(service.findUser("unknown"));\nassertNotNull(service.findUser("admin"));\n\n// assertSame — проверка что это ОДИН И ТОТ ЖЕ объект (==)\nassertSame(expected, actual);\n\n// assertNotEquals — проверка НЕравенства\nassertNotEquals(0, list.size());' },
        { type: 'heading', value: 'Сообщения об ошибках' },
        { type: 'text', value: 'Каждый assert может принимать сообщение, которое выведется при ошибке:' },
        { type: 'code', language: 'java', value: '// С кастомным сообщением:\nassertEquals(5, result,\n    "Сложение 2 + 3 должно давать 5");\n\nassertTrue(user.isActive(),\n    "Новый пользователь должен быть активным");' },
        { type: 'heading', value: 'assertAll — группировка проверок' },
        { type: 'text', value: 'Позволяет выполнить ВСЕ проверки, даже если первая упала:' },
        { type: 'code', language: 'java', value: '// В JUnit 5:\nassertAll(\n    () -> assertEquals("John", user.getName()),\n    () -> assertEquals(25, user.getAge()),\n    () -> assertTrue(user.isActive())\n);' },
        { type: 'tip', value: 'Всегда добавляйте понятное сообщение к assertions. Когда тест упадёт через полгода, вы скажете себе спасибо.' }
      ]
    },
    {
      id: 3,
      title: 'Жизненный цикл теста',
      type: 'theory',
      content: [
        { type: 'text', value: 'У каждого теста есть жизненный цикл — этапы, которые выполняются в определённом порядке.' },
        { type: 'heading', value: 'Аннотации жизненного цикла (JUnit 5)' },
        { type: 'code', language: 'java', value: '// В JUnit 5:\nclass UserServiceTest {\n    UserService service;\n\n    @BeforeAll      // Один раз ПЕРЕД всеми тестами\n    static void initAll() {\n        System.out.println("Инициализация ресурсов");\n    }\n\n    @BeforeEach     // Перед КАЖДЫМ тестом\n    void setUp() {\n        service = new UserService();\n    }\n\n    @Test\n    void testCreate() { /* ... */ }\n\n    @Test\n    void testDelete() { /* ... */ }\n\n    @AfterEach      // После КАЖДОГО теста\n    void tearDown() {\n        service.cleanup();\n    }\n\n    @AfterAll       // Один раз ПОСЛЕ всех тестов\n    static void tearDownAll() {\n        System.out.println("Освобождение ресурсов");\n    }\n}' },
        { type: 'heading', value: 'Порядок выполнения' },
        { type: 'code', language: 'text', value: '@BeforeAll\n  @BeforeEach → @Test (test1) → @AfterEach\n  @BeforeEach → @Test (test2) → @AfterEach\n  @BeforeEach → @Test (test3) → @AfterEach\n@AfterAll' },
        { type: 'heading', value: 'Зачем нужен setUp?' },
        { type: 'list', items: [
          'Каждый тест получает СВЕЖИЙ объект — тесты не влияют друг на друга',
          'Убирает дублирование — не нужно создавать объекты в каждом тесте',
          '@BeforeAll — для дорогих операций (подключение к БД)',
          '@AfterEach — для очистки (закрытие файлов, удаление данных)'
        ]},
        { type: 'warning', value: '@BeforeAll и @AfterAll должны быть static (или использоваться с @TestInstance(PER_CLASS)).' }
      ]
    },
    {
      id: 4,
      title: '@DisplayName, @Disabled, порядок тестов',
      type: 'theory',
      content: [
        { type: 'text', value: 'JUnit 5 предоставляет дополнительные аннотации для управления тестами.' },
        { type: 'heading', value: '@DisplayName — читаемые имена' },
        { type: 'code', language: 'java', value: '// Вместо testAddPositiveNumbers видно:\n@DisplayName("Сложение двух положительных чисел")\n@Test\nvoid testAddPositive() {\n    assertEquals(5, calc.add(2, 3));\n}\n\n@DisplayName("Деление на ноль бросает исключение")\n@Test\nvoid testDivideByZero() {\n    assertThrows(ArithmeticException.class,\n        () -> calc.divide(10, 0));\n}' },
        { type: 'heading', value: '@Disabled — отключение теста' },
        { type: 'code', language: 'java', value: '@Disabled("Баг #1234 — исправим в следующем спринте")\n@Test\nvoid testBrokenFeature() {\n    // Этот тест не запустится\n}' },
        { type: 'heading', value: '@Order — порядок выполнения' },
        { type: 'code', language: 'java', value: '@TestMethodOrder(MethodOrderer.OrderAnnotation.class)\nclass OrderedTest {\n    @Test @Order(1)\n    void createUser() { /* ... */ }\n\n    @Test @Order(2)\n    void updateUser() { /* ... */ }\n\n    @Test @Order(3)\n    void deleteUser() { /* ... */ }\n}' },
        { type: 'warning', value: 'Тесты НЕ должны зависеть от порядка! @Order нужен только для читаемости отчётов или в редких интеграционных сценариях.' },
        { type: 'heading', value: '@Timeout — ограничение времени' },
        { type: 'code', language: 'java', value: '@Timeout(5) // тест упадёт, если выполняется > 5 секунд\n@Test\nvoid testPerformance() {\n    List<Integer> result = service.processLargeData();\n    assertFalse(result.isEmpty());\n}' },
        { type: 'tip', value: 'Используйте @DisplayName всегда — это делает отчёт о тестах понятным для всей команды, включая QA и менеджеров.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Симуляция жизненного цикла',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте тестовый раннер с жизненным циклом: beforeAll, beforeEach, test, afterEach, afterAll. Протестируйте класс BankAccount.',
      requirements: [
        'Создайте класс BankAccount с методами deposit, withdraw, getBalance',
        'Реализуйте методы setUp (создание нового BankAccount) и tearDown (обнуление)',
        'Напишите 4 теста: deposit, withdraw, withdrawInsufficient, getBalanceInitial',
        'Выводите порядок выполнения: setUp -> test -> tearDown',
        'Подсчитайте и выведите итог тестов'
      ],
      expectedOutput: '--- beforeAll ---\nsetUp -> testDeposit -> tearDown: PASS\nsetUp -> testWithdraw -> tearDown: PASS\nsetUp -> testWithdrawInsufficient -> tearDown: PASS\nsetUp -> testGetBalanceInitial -> tearDown: PASS\n--- afterAll ---\nРезультат: 4/4 тестов пройдено',
      hint: 'В setUp создавайте новый BankAccount с балансом 100. В каждом тесте работайте с этим аккаунтом.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;
    static int balance;

    static void assertEquals(int expected, int actual) {
        if (expected != actual) {
            throw new RuntimeException(
                "Expected " + expected + ", but was " + actual
            );
        }
    }

    static void assertTrue(boolean condition) {
        if (!condition) {
            throw new RuntimeException("Expected true, but was false");
        }
    }

    // --- BankAccount ---
    static void deposit(int amount) {
        if (amount > 0) balance += amount;
    }

    static boolean withdraw(int amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }

    static int getBalance() {
        return balance;
    }

    // --- Lifecycle ---
    static void beforeAll() {
        System.out.println("--- beforeAll ---");
    }

    static void afterAll() {
        System.out.println("--- afterAll ---");
    }

    static void setUp() {
        balance = 100; // Свежий аккаунт с балансом 100
    }

    static void tearDown() {
        balance = 0;
    }

    static void runTest(String name, Runnable test) {
        total++;
        setUp();
        try {
            test.run();
            passed++;
            System.out.println("setUp -> " + name + " -> tearDown: PASS");
        } catch (Exception e) {
            System.out.println("setUp -> " + name + " -> tearDown: FAIL - " + e.getMessage());
        } finally {
            tearDown();
        }
    }

    public static void main(String[] args) {
        beforeAll();

        runTest("testDeposit", () -> {
            deposit(50);
            assertEquals(150, getBalance());
        });

        runTest("testWithdraw", () -> {
            boolean success = withdraw(30);
            assertTrue(success);
            assertEquals(70, getBalance());
        });

        runTest("testWithdrawInsufficient", () -> {
            boolean success = withdraw(200);
            assertTrue(!success);
            assertEquals(100, getBalance());
        });

        runTest("testGetBalanceInitial", () -> {
            assertEquals(100, getBalance());
        });

        afterAll();
        System.out.println("Результат: " + passed + "/" + total + " тестов пройдено");
    }
}`,
      explanation: 'Мы симулировали жизненный цикл JUnit. setUp вызывается перед КАЖДЫМ тестом — это гарантирует, что каждый тест начинает с чистого состояния (баланс = 100). tearDown очищает после каждого теста. Это паттерн, который JUnit реализует через @BeforeEach/@AfterEach.'
    },
    {
      id: 6,
      title: 'Практика: Полный набор assertions',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте полный набор assertion-методов и протестируйте класс StringUtils.',
      requirements: [
        'Реализуйте: assertEquals, assertNotEquals, assertTrue, assertFalse, assertNull, assertNotNull',
        'Создайте класс StringUtils с методами: reverse, isPalindrome, capitalize, countWords',
        'Напишите минимум 6 тестов, используя разные assertions',
        'Добавьте кастомные сообщения об ошибках к assertions'
      ],
      expectedOutput: 'PASS: testReverse\nPASS: testReverseEmpty\nPASS: testIsPalindrome\nPASS: testIsNotPalindrome\nPASS: testCapitalize\nPASS: testCountWords\nВсе тесты пройдены: 6/6',
      hint: 'Для reverse используйте StringBuilder.reverse(). isPalindrome — сравните строку с её реверсом.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Assertions ---
    static void assertEquals(Object expected, Object actual, String msg) {
        if (expected == null && actual == null) return;
        if (expected == null || !expected.equals(actual)) {
            throw new RuntimeException(msg +
                ": ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertNotEquals(Object unexpected, Object actual, String msg) {
        if (unexpected == null && actual == null) {
            throw new RuntimeException(msg + ": значения не должны быть равны");
        }
        if (unexpected != null && unexpected.equals(actual)) {
            throw new RuntimeException(msg + ": значения не должны быть равны");
        }
    }

    static void assertTrue(boolean condition, String msg) {
        if (!condition) throw new RuntimeException(msg);
    }

    static void assertFalse(boolean condition, String msg) {
        if (condition) throw new RuntimeException(msg);
    }

    static void assertNull(Object obj, String msg) {
        if (obj != null) throw new RuntimeException(msg + ": ожидали null");
    }

    static void assertNotNull(Object obj, String msg) {
        if (obj == null) throw new RuntimeException(msg + ": не ожидали null");
    }

    // --- StringUtils ---
    static String reverse(String s) {
        if (s == null) return null;
        return new StringBuilder(s).reverse().toString();
    }

    static boolean isPalindrome(String s) {
        if (s == null) return false;
        String clean = s.toLowerCase().replaceAll("\\\\s+", "");
        return clean.equals(new StringBuilder(clean).reverse().toString());
    }

    static String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return s.substring(0, 1).toUpperCase() + s.substring(1);
    }

    static int countWords(String s) {
        if (s == null || s.trim().isEmpty()) return 0;
        return s.trim().split("\\\\s+").length;
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
        runTest("testReverse", () -> {
            assertEquals("cba", reverse("abc"),
                "reverse должен перевернуть строку");
        });

        runTest("testReverseEmpty", () -> {
            assertEquals("", reverse(""),
                "reverse пустой строки должен вернуть пустую строку");
        });

        runTest("testIsPalindrome", () -> {
            assertTrue(isPalindrome("racecar"),
                "racecar является палиндромом");
        });

        runTest("testIsNotPalindrome", () -> {
            assertFalse(isPalindrome("hello"),
                "hello не является палиндромом");
        });

        runTest("testCapitalize", () -> {
            assertEquals("Hello", capitalize("hello"),
                "capitalize должен сделать первую букву заглавной");
        });

        runTest("testCountWords", () -> {
            assertEquals(3, countWords("один два три"),
                "countWords должен посчитать слова");
        });

        System.out.println("Все тесты пройдены: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы реализовали полный набор assertions с кастомными сообщениями. Каждый assertion принимает описание ошибки — это помогает понять, что пошло не так. StringUtils — типичный утилитный класс, который тестируют в реальных проектах.'
    },
    {
      id: 7,
      title: 'Практика: Тестирование корзины покупок',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте класс ShoppingCart и протестируйте его с полным жизненным циклом тестов.',
      requirements: [
        'Создайте ShoppingCart с методами: addItem(name, price), removeItem(name), getTotal(), getItemCount(), clear()',
        'Используйте setUp для создания свежей корзины перед каждым тестом',
        'Напишите 5 тестов: добавление, удаление, общая сумма, количество товаров, очистка',
        'Используйте разные assertions в тестах'
      ],
      expectedOutput: 'PASS: testAddItem\nPASS: testRemoveItem\nPASS: testGetTotal\nPASS: testGetItemCount\nPASS: testClear\nРезультат: 5/5',
      hint: 'Используйте ArrayList для хранения товаров. Каждый товар — массив из имени и цены.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static int passed = 0;
    static int total = 0;

    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Expected " + expected + ", but was " + actual
            );
        }
    }

    static void assertTrue(boolean condition) {
        if (!condition) throw new RuntimeException("Expected true");
    }

    // --- ShoppingCart ---
    static List<String> cartNames;
    static List<Double> cartPrices;

    static void addItem(String name, double price) {
        cartNames.add(name);
        cartPrices.add(price);
    }

    static boolean removeItem(String name) {
        int idx = cartNames.indexOf(name);
        if (idx >= 0) {
            cartNames.remove(idx);
            cartPrices.remove(idx);
            return true;
        }
        return false;
    }

    static double getTotal() {
        double sum = 0;
        for (double p : cartPrices) sum += p;
        return sum;
    }

    static int getItemCount() {
        return cartNames.size();
    }

    static void clearCart() {
        cartNames.clear();
        cartPrices.clear();
    }

    // --- Test lifecycle ---
    static void setUp() {
        cartNames = new ArrayList<>();
        cartPrices = new ArrayList<>();
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
        runTest("testAddItem", () -> {
            addItem("Книга", 500.0);
            addItem("Ручка", 50.0);
            assertEquals(2, getItemCount());
        });

        runTest("testRemoveItem", () -> {
            addItem("Книга", 500.0);
            addItem("Ручка", 50.0);
            removeItem("Книга");
            assertEquals(1, getItemCount());
        });

        runTest("testGetTotal", () -> {
            addItem("Книга", 500.0);
            addItem("Ручка", 50.0);
            addItem("Тетрадь", 100.0);
            assertEquals(650.0, getTotal());
        });

        runTest("testGetItemCount", () -> {
            assertEquals(0, getItemCount());
            addItem("Книга", 500.0);
            assertEquals(1, getItemCount());
        });

        runTest("testClear", () -> {
            addItem("Книга", 500.0);
            addItem("Ручка", 50.0);
            clearCart();
            assertEquals(0, getItemCount());
            assertEquals(0.0, getTotal());
        });

        System.out.println("Результат: " + passed + "/" + total);
    }
}`,
      explanation: 'Корзина покупок — классический пример для тестирования. setUp создаёт новую корзину перед каждым тестом, поэтому тесты не зависят друг от друга. Мы проверяем добавление, удаление, подсчёт суммы и очистку — все основные операции.'
    }
  ]
}
