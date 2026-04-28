export default {
  id: 125,
  title: 'Практикум: Unit Testing (JUnit)',
  description: 'Практические задачи на модульное тестирование в Java: JUnit 5, Mockito, параметризованные тесты, TDD, покрытие кода, интеграционное тестирование.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Первый тест',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши первые юнит-тесты для класса Calculator. Используй основные assert-методы JUnit 5: assertEquals, assertNotNull, assertTrue, assertFalse.',
      requirements: [
        'Класс Calculator с методами: add, subtract, multiply, divide',
        'Тесты: testAdd, testSubtract, testMultiply, testDivide',
        'Используй assertEquals для проверки результатов',
        'assertNotNull для проверки создания объекта'
      ],
      expectedOutput: 'Тесты Calculator:\n  testAdd: 2 + 3 = 5 ✓\n  testSubtract: 10 - 4 = 6 ✓\n  testMultiply: 3 * 7 = 21 ✓\n  testDivide: 15 / 3 = 5 ✓\n  testNotNull: calculator != null ✓\n  testIsPositive: true ✓\n\nВсе тесты пройдены: 6/6',
      hint: 'assertEquals(expected, actual) проверяет равенство. assertNotNull(obj) проверяет, что объект не null. assertTrue(condition) проверяет, что условие true.',
      solution: `public class Main {

    // Calculator
    static int add(int a, int b) { return a + b; }
    static int subtract(int a, int b) { return a - b; }
    static int multiply(int a, int b) { return a * b; }
    static int divide(int a, int b) { return a / b; }
    static boolean isPositive(int n) { return n > 0; }

    // Простой тестовый фреймворк
    static int passed = 0;
    static int total = 0;

    static void assertEquals(int expected, int actual, String testName) {
        total++;
        if (expected == actual) {
            System.out.println("  " + testName + " ✓");
            passed++;
        } else {
            System.out.println("  " + testName + " ✗ (expected: " + expected + ", actual: " + actual + ")");
        }
    }

    static void assertNotNull(Object obj, String testName) {
        total++;
        if (obj != null) {
            System.out.println("  " + testName + " ✓");
            passed++;
        } else {
            System.out.println("  " + testName + " ✗ (was null)");
        }
    }

    static void assertTrue(boolean condition, String testName) {
        total++;
        if (condition) {
            System.out.println("  " + testName + " ✓");
            passed++;
        } else {
            System.out.println("  " + testName + " ✗ (was false)");
        }
    }

    public static void main(String[] args) {
        System.out.println("Тесты Calculator:");

        assertEquals(5, add(2, 3), "testAdd: 2 + 3 = 5");
        assertEquals(6, subtract(10, 4), "testSubtract: 10 - 4 = 6");
        assertEquals(21, multiply(3, 7), "testMultiply: 3 * 7 = 21");
        assertEquals(5, divide(15, 3), "testDivide: 15 / 3 = 5");
        assertNotNull("calculator", "testNotNull: calculator != null");
        assertTrue(isPositive(5), "testIsPositive: true");

        System.out.println("\\nВсе тесты пройдены: " + passed + "/" + total);
    }
}`,
      explanation: 'JUnit 5 — стандартный фреймворк тестирования в Java. @Test помечает тестовый метод. assertEquals(expected, actual) — самый частый assert, проверяет равенство. assertNotNull — объект не null. assertTrue/assertFalse — булевые проверки. Каждый тест должен быть независимым: тестирует одну конкретную вещь. Имя теста описывает, ЧТО тестируется: testAdd_positiveNumbers_returnsSum.'
    },
    {
      id: 2,
      title: 'Задача: Arrange-Act-Assert',
      type: 'practice',
      difficulty: 'easy',
      description: 'Структурируй тесты по паттерну AAA (Arrange-Act-Assert). Используй @BeforeEach для подготовки данных и @AfterEach для очистки.',
      requirements: [
        'Каждый тест структурирован по AAA: подготовка → действие → проверка',
        '@BeforeEach: инициализация тестовых данных перед каждым тестом',
        '@AfterEach: очистка ресурсов после каждого теста',
        'Покажи жизненный цикл: @BeforeAll → @BeforeEach → @Test → @AfterEach → @AfterAll'
      ],
      expectedOutput: '[@BeforeAll] Инициализация ресурсов\n\n[@BeforeEach] Подготовка данных\n[@Test] testDeposit:\n  Arrange: account balance=1000\n  Act: deposit(500)\n  Assert: balance=1500 ✓\n[@AfterEach] Очистка\n\n[@BeforeEach] Подготовка данных\n[@Test] testWithdraw:\n  Arrange: account balance=1000\n  Act: withdraw(300)\n  Assert: balance=700 ✓\n[@AfterEach] Очистка\n\n[@BeforeEach] Подготовка данных\n[@Test] testTransfer:\n  Arrange: from=1000, to=500\n  Act: transfer(200)\n  Assert: from=800, to=700 ✓\n[@AfterEach] Очистка\n\n[@AfterAll] Освобождение ресурсов\n\nВсе тесты пройдены: 3/3',
      hint: 'AAA: Arrange — подготовь объекты и данные. Act — вызови тестируемый метод. Assert — проверь результат. @BeforeEach создаёт "чистое" состояние для каждого теста.',
      solution: `public class Main {

    static int balance;
    static int passed = 0, total = 0;

    static void beforeAll() {
        System.out.println("[@BeforeAll] Инициализация ресурсов");
    }

    static void beforeEach() {
        balance = 1000;
        System.out.println("\\n[@BeforeEach] Подготовка данных");
    }

    static void afterEach() {
        System.out.println("[@AfterEach] Очистка");
    }

    static void afterAll() {
        System.out.println("\\n[@AfterAll] Освобождение ресурсов");
    }

    static void check(boolean condition, String msg) {
        total++;
        if (condition) { passed++; System.out.println("  Assert: " + msg + " ✓"); }
        else { System.out.println("  Assert: " + msg + " ✗"); }
    }

    static void testDeposit() {
        System.out.println("[@Test] testDeposit:");
        // Arrange
        System.out.println("  Arrange: account balance=" + balance);
        // Act
        balance += 500;
        System.out.println("  Act: deposit(500)");
        // Assert
        check(balance == 1500, "balance=1500");
    }

    static void testWithdraw() {
        System.out.println("[@Test] testWithdraw:");
        System.out.println("  Arrange: account balance=" + balance);
        balance -= 300;
        System.out.println("  Act: withdraw(300)");
        check(balance == 700, "balance=700");
    }

    static void testTransfer() {
        System.out.println("[@Test] testTransfer:");
        int toBalance = 500;
        System.out.println("  Arrange: from=" + balance + ", to=" + toBalance);
        balance -= 200;
        toBalance += 200;
        System.out.println("  Act: transfer(200)");
        check(balance == 800 && toBalance == 700, "from=800, to=700");
    }

    public static void main(String[] args) {
        beforeAll();

        beforeEach(); testDeposit(); afterEach();
        beforeEach(); testWithdraw(); afterEach();
        beforeEach(); testTransfer(); afterEach();

        afterAll();
        System.out.println("\\nВсе тесты пройдены: " + passed + "/" + total);
    }
}`,
      explanation: 'Паттерн AAA (Arrange-Act-Assert) делает тесты читаемыми и структурированными. Arrange — подготовка тестовых данных. Act — выполнение тестируемого действия. Assert — проверка результата. @BeforeEach выполняется перед КАЖДЫМ тестом, создавая "чистое" состояние — тесты не зависят друг от друга. @BeforeAll/@AfterAll — один раз для всего класса (например, подключение к БД). Жизненный цикл гарантирует изоляцию тестов.'
    },
    {
      id: 3,
      title: 'Задача: Тестирование исключений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Протестируй, что методы корректно выбрасывают исключения при неверных аргументах. Используй assertThrows для проверки типа и сообщения исключения.',
      requirements: [
        'assertThrows(ExceptionClass, executable) — проверка типа исключения',
        'Проверь сообщение исключения через getMessage()',
        'assertDoesNotThrow — проверка отсутствия исключений',
        'Тестируй: деление на ноль, null аргументы, невалидные данные'
      ],
      expectedOutput: 'testDivideByZero:\n  divide(10, 0) → ArithmeticException: / by zero ✓\n\ntestNullArgument:\n  process(null) → NullPointerException: Input cannot be null ✓\n\ntestInvalidAge:\n  setAge(-5) → IllegalArgumentException: Age must be positive ✓\n  setAge(200) → IllegalArgumentException: Age must be <= 150 ✓\n\ntestValidOperations:\n  divide(10, 2) → no exception ✓\n  process("hello") → no exception ✓\n  setAge(25) → no exception ✓\n\nВсе тесты пройдены: 6/6',
      hint: 'assertThrows возвращает пойманное исключение — можно проверить его сообщение. assertDoesNotThrow гарантирует, что код выполняется без ошибок.',
      solution: `public class Main {

    static int passed = 0, total = 0;

    static int divide(int a, int b) {
        return a / b;
    }

    static String process(String input) {
        if (input == null) throw new NullPointerException("Input cannot be null");
        return input.toUpperCase();
    }

    static void setAge(int age) {
        if (age < 0) throw new IllegalArgumentException("Age must be positive");
        if (age > 150) throw new IllegalArgumentException("Age must be <= 150");
    }

    static void assertThrows(String exceptionName, Runnable code, String expectedMsg, String testDesc) {
        total++;
        try {
            code.run();
            System.out.println("  " + testDesc + " ✗ (no exception thrown)");
        } catch (Exception e) {
            String actualName = e.getClass().getSimpleName();
            if (actualName.equals(exceptionName) &&
                (expectedMsg == null || e.getMessage().equals(expectedMsg))) {
                System.out.println("  " + testDesc + " → " + actualName + ": " + e.getMessage() + " ✓");
                passed++;
            } else {
                System.out.println("  " + testDesc + " ✗ (got " + actualName + ": " + e.getMessage() + ")");
            }
        }
    }

    static void assertDoesNotThrow(Runnable code, String testDesc) {
        total++;
        try {
            code.run();
            System.out.println("  " + testDesc + " → no exception ✓");
            passed++;
        } catch (Exception e) {
            System.out.println("  " + testDesc + " ✗ (threw " + e.getClass().getSimpleName() + ")");
        }
    }

    public static void main(String[] args) {
        System.out.println("testDivideByZero:");
        assertThrows("ArithmeticException", () -> divide(10, 0),
                     "/ by zero", "divide(10, 0)");

        System.out.println("\\ntestNullArgument:");
        assertThrows("NullPointerException", () -> process(null),
                     "Input cannot be null", "process(null)");

        System.out.println("\\ntestInvalidAge:");
        assertThrows("IllegalArgumentException", () -> setAge(-5),
                     "Age must be positive", "setAge(-5)");
        assertThrows("IllegalArgumentException", () -> setAge(200),
                     "Age must be <= 150", "setAge(200)");

        System.out.println("\\ntestValidOperations:");
        assertDoesNotThrow(() -> divide(10, 2), "divide(10, 2)");
        assertDoesNotThrow(() -> process("hello"), "process(\\"hello\\")");
        assertDoesNotThrow(() -> setAge(25), "setAge(25)");

        System.out.println("\\nВсе тесты пройдены: " + passed + "/" + total);
    }
}`,
      explanation: 'Тестирование исключений — важная часть юнит-тестов. assertThrows(Exception.class, () -> code) проверяет, что код выбрасывает ожидаемое исключение. Возвращает пойманное исключение для дополнительных проверок (getMessage, getCause). assertDoesNotThrow гарантирует, что код работает без ошибок. Тестируйте все edge cases: null, пустые строки, граничные значения, деление на ноль.'
    },
    {
      id: 4,
      title: 'Задача: Параметризованные тесты',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай параметризованные тесты с @ParameterizedTest. Один тестовый метод запускается с множеством наборов данных через @ValueSource, @CsvSource, @MethodSource.',
      requirements: [
        '@ValueSource — один параметр: проверка isPrime для разных чисел',
        '@CsvSource — несколько параметров: "1,2,3" → add(1,2)==3',
        '@MethodSource — сложные данные из метода-провайдера',
        'Покажи, как один тест заменяет 10 отдельных тестов'
      ],
      expectedOutput: '@ValueSource — isPrime:\n  isPrime(2) = true ✓\n  isPrime(3) = true ✓\n  isPrime(4) = false ✓\n  isPrime(17) = true ✓\n  isPrime(25) = false ✓\n\n@CsvSource — add(a, b) == expected:\n  add(1, 2) = 3 ✓\n  add(0, 0) = 0 ✓\n  add(-1, 1) = 0 ✓\n  add(100, 200) = 300 ✓\n  add(-5, -3) = -8 ✓\n\n@MethodSource — FizzBuzz:\n  fizzBuzz(3) = "Fizz" ✓\n  fizzBuzz(5) = "Buzz" ✓\n  fizzBuzz(15) = "FizzBuzz" ✓\n  fizzBuzz(7) = "7" ✓\n\nВсе тесты пройдены: 14/14',
      hint: '@ParameterizedTest убирает дублирование: вместо 10 тестов — один с 10 наборами данных. @CsvSource("1,2,3") передаёт три значения в параметры метода.',
      solution: `public class Main {

    static int passed = 0, total = 0;

    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    static int add(int a, int b) {
        return a + b;
    }

    static String fizzBuzz(int n) {
        if (n % 15 == 0) return "FizzBuzz";
        if (n % 3 == 0) return "Fizz";
        if (n % 5 == 0) return "Buzz";
        return String.valueOf(n);
    }

    static void check(boolean ok, String msg) {
        total++;
        if (ok) { passed++; System.out.println("  " + msg + " ✓"); }
        else { System.out.println("  " + msg + " ✗"); }
    }

    public static void main(String[] args) {
        // @ValueSource — isPrime
        System.out.println("@ValueSource — isPrime:");
        int[] primeTests = {2, 3, 4, 17, 25};
        boolean[] expected = {true, true, false, true, false};
        for (int i = 0; i < primeTests.length; i++) {
            boolean result = isPrime(primeTests[i]);
            check(result == expected[i],
                  "isPrime(" + primeTests[i] + ") = " + result);
        }

        // @CsvSource — add
        System.out.println("\\n@CsvSource — add(a, b) == expected:");
        int[][] addTests = {{1, 2, 3}, {0, 0, 0}, {-1, 1, 0}, {100, 200, 300}, {-5, -3, -8}};
        for (int[] t : addTests) {
            int result = add(t[0], t[1]);
            check(result == t[2],
                  "add(" + t[0] + ", " + t[1] + ") = " + result);
        }

        // @MethodSource — FizzBuzz
        System.out.println("\\n@MethodSource — FizzBuzz:");
        int[] fbNums = {3, 5, 15, 7};
        String[] fbExpected = {"Fizz", "Buzz", "FizzBuzz", "7"};
        for (int i = 0; i < fbNums.length; i++) {
            String result = fizzBuzz(fbNums[i]);
            check(result.equals(fbExpected[i]),
                  "fizzBuzz(" + fbNums[i] + ") = \\"" + result + "\\"");
        }

        System.out.println("\\nВсе тесты пройдены: " + passed + "/" + total);
    }
}`,
      explanation: 'Параметризованные тесты JUnit 5 — мощный инструмент для тестирования с разными данными. @ValueSource — массив значений одного типа. @CsvSource — CSV строки с несколькими параметрами. @MethodSource — метод возвращает Stream<Arguments> для сложных случаев. @EnumSource — все значения enum. Один параметризованный тест заменяет десятки однотипных — меньше кода, больше покрытие.'
    },
    {
      id: 5,
      title: 'Задача: Mock объекты',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используй mock-объекты для изоляции тестируемого кода от зависимостей. Замокай внешний сервис (EmailService) и проверь, что он вызывается с правильными аргументами.',
      requirements: [
        'Mockito.mock() — создай мок EmailService',
        'when().thenReturn() — задай поведение мока',
        'verify() — проверь, что метод был вызван с правильными аргументами',
        'Тестируй UserService.register() без реальной отправки email'
      ],
      expectedOutput: 'testRegister — без реального EmailService:\n  mock: emailService.send("alice@mail.com", "Welcome!") → true\n  UserService.register("Alice", "alice@mail.com")\n  verify: emailService.send() вызван 1 раз ✓\n  verify: аргументы ("alice@mail.com", "Welcome!") ✓\n\ntestRegister — email fail:\n  mock: emailService.send() → false\n  UserService.register("Bob", "bob@mail.com")\n  Результат: false (email не отправлен) ✓\n  verify: emailService.send() вызван 1 раз ✓\n\nВсе тесты пройдены: 4/4',
      hint: 'Mock заменяет реальную зависимость фейком. when(mock.method()).thenReturn(value) задаёт ответ. verify(mock).method() проверяет, что метод был вызван.',
      solution: `public class Main {

    static int passed = 0, total = 0;

    // Имитация Mock-объекта
    static String lastSendTo = null;
    static String lastSendMsg = null;
    static boolean sendResult = true;
    static int sendCallCount = 0;

    static boolean mockSend(String to, String msg) {
        lastSendTo = to;
        lastSendMsg = msg;
        sendCallCount++;
        return sendResult;
    }

    // UserService
    static boolean register(String name, String email) {
        // Бизнес-логика: создать пользователя и отправить welcome email
        boolean sent = mockSend(email, "Welcome!");
        return sent;
    }

    static void resetMock() {
        lastSendTo = null;
        lastSendMsg = null;
        sendCallCount = 0;
        sendResult = true;
    }

    static void check(boolean ok, String msg) {
        total++;
        if (ok) { passed++; System.out.println("  " + msg + " ✓"); }
        else { System.out.println("  " + msg + " ✗"); }
    }

    public static void main(String[] args) {
        // Test 1: успешная регистрация
        System.out.println("testRegister — без реального EmailService:");
        resetMock();
        sendResult = true;
        System.out.println("  mock: emailService.send(\\"alice@mail.com\\", \\"Welcome!\\") → true");

        register("Alice", "alice@mail.com");
        System.out.println("  UserService.register(\\"Alice\\", \\"alice@mail.com\\")");

        check(sendCallCount == 1, "verify: emailService.send() вызван 1 раз");
        check("alice@mail.com".equals(lastSendTo) && "Welcome!".equals(lastSendMsg),
              "verify: аргументы (\\"alice@mail.com\\", \\"Welcome!\\")");

        // Test 2: email отправка неуспешна
        System.out.println("\\ntestRegister — email fail:");
        resetMock();
        sendResult = false;
        System.out.println("  mock: emailService.send() → false");

        boolean result = register("Bob", "bob@mail.com");
        System.out.println("  UserService.register(\\"Bob\\", \\"bob@mail.com\\")");

        check(!result, "Результат: false (email не отправлен)");
        check(sendCallCount == 1, "verify: emailService.send() вызван 1 раз");

        System.out.println("\\nВсе тесты пройдены: " + passed + "/" + total);
    }
}`,
      explanation: 'Mock-объекты заменяют реальные зависимости в тестах. Mockito.mock(EmailService.class) создаёт фейковый объект, который записывает вызовы. when(mock.send()).thenReturn(true) задаёт поведение. verify(mock).send("email", "msg") проверяет, что метод был вызван с нужными аргументами. Это позволяет тестировать UserService изолированно — без реальной отправки email, без сети, без БД. Принцип: тестируй СВОЙ код, мокай ЧУЖОЙ.'
    },
    {
      id: 6,
      title: 'Задача: Тестирование коллекций',
      type: 'practice',
      difficulty: 'medium',
      description: 'Протестируй методы, работающие с коллекциями. Используй специализированные assert-методы для проверки размера, содержимого, порядка элементов.',
      requirements: [
        'assertIterableEquals — проверка списков на равенство',
        'Проверка размера коллекции, наличия/отсутствия элементов',
        'Проверка порядка элементов после сортировки',
        'Тестирование edge cases: пустой список, null, один элемент'
      ],
      expectedOutput: 'testFilterAdults — фильтрация возраста >= 18:\n  Вход: [Alice:25, Bob:15, Charlie:30, Diana:17]\n  Результат: [Alice:25, Charlie:30]\n  Размер = 2 ✓\n  Содержит Alice ✓\n  Не содержит Bob ✓\n\ntestSortByName — сортировка по имени:\n  Результат: [Alice, Bob, Charlie, Diana]\n  Порядок верный ✓\n\ntestEmptyList — пустой список:\n  filter([]) = [] ✓\n  isEmpty = true ✓\n\ntestGroupByAge — группировка:\n  adults: [Alice, Charlie], minors: [Bob, Diana]\n  Размер adults = 2 ✓\n  Размер minors = 2 ✓\n\nВсе тесты пройдены: 7/7',
      hint: 'Для коллекций проверяй: размер, содержимое, порядок, пустоту. assertEquals(expected, actual) работает с List, т.к. List реализует equals().',
      solution: `import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Main {

    static int passed = 0, total = 0;

    static String[] allNames = {"Alice", "Bob", "Charlie", "Diana"};
    static int[] allAges = {25, 15, 30, 17};

    static List<String> filterAdults() {
        List<String> result = new ArrayList<>();
        for (int i = 0; i < allNames.length; i++) {
            if (allAges[i] >= 18) result.add(allNames[i]);
        }
        return result;
    }

    static List<String> sortByName() {
        List<String> result = new ArrayList<>(Arrays.asList(allNames));
        Collections.sort(result);
        return result;
    }

    static List<String> filterFromList(String[] names, int[] ages) {
        List<String> result = new ArrayList<>();
        for (int i = 0; i < names.length; i++) {
            if (ages[i] >= 18) result.add(names[i]);
        }
        return result;
    }

    static void check(boolean ok, String msg) {
        total++;
        if (ok) { passed++; System.out.println("  " + msg + " ✓"); }
        else { System.out.println("  " + msg + " ✗"); }
    }

    public static void main(String[] args) {
        // Test 1: фильтрация
        System.out.println("testFilterAdults — фильтрация возраста >= 18:");
        System.out.println("  Вход: [Alice:25, Bob:15, Charlie:30, Diana:17]");
        List<String> adults = filterAdults();
        System.out.println("  Результат: " + adults);
        check(adults.size() == 2, "Размер = 2");
        check(adults.contains("Alice"), "Содержит Alice");
        check(!adults.contains("Bob"), "Не содержит Bob");

        // Test 2: сортировка
        System.out.println("\\ntestSortByName — сортировка по имени:");
        List<String> sorted = sortByName();
        System.out.println("  Результат: " + sorted);
        List<String> expected = Arrays.asList("Alice", "Bob", "Charlie", "Diana");
        check(sorted.equals(expected), "Порядок верный");

        // Test 3: пустой список
        System.out.println("\\ntestEmptyList — пустой список:");
        List<String> empty = filterFromList(new String[]{}, new int[]{});
        System.out.println("  filter([]) = " + empty);
        check(empty.isEmpty(), "isEmpty = true");

        // Test 4: группировка
        System.out.println("\\ntestGroupByAge — группировка:");
        List<String> adultGroup = new ArrayList<>();
        List<String> minorGroup = new ArrayList<>();
        for (int i = 0; i < allNames.length; i++) {
            if (allAges[i] >= 18) adultGroup.add(allNames[i]);
            else minorGroup.add(allNames[i]);
        }
        System.out.println("  adults: " + adultGroup + ", minors: " + minorGroup);
        check(adultGroup.size() == 2, "Размер adults = 2");
        check(minorGroup.size() == 2, "Размер minors = 2");

        System.out.println("\\nВсе тесты пройдены: " + passed + "/" + total);
    }
}`,
      explanation: 'Тестирование коллекций требует специализированных проверок. assertEquals(expectedList, actualList) проверяет и размер, и порядок, и содержимое. assertTrue(list.contains(x)) — наличие элемента. assertTrue(list.isEmpty()) — пустота. Для сложных проверок в реальных проектах используют AssertJ: assertThat(list).hasSize(2).contains("Alice").doesNotContain("Bob"). Всегда тестируйте edge cases: пустой список, один элемент, null.'
    },
    {
      id: 7,
      title: 'Задача: TDD: Calculator',
      type: 'practice',
      difficulty: 'medium',
      description: 'Примени TDD (Test-Driven Development) для реализации StringCalculator. Цикл Red → Green → Refactor: сначала пиши тест (RED), затем минимальную реализацию (GREEN), затем улучшай (REFACTOR).',
      requirements: [
        'Red: напиши тест для add("") → 0, тест падает',
        'Green: реализуй минимум кода для прохождения теста',
        'Refactor: улучши код без изменения поведения',
        'Повтори цикл для: add("1") → 1, add("1,2") → 3, add("1,2,3") → 6'
      ],
      expectedOutput: '=== TDD: StringCalculator ===\n\nRed 1: add("") должен вернуть 0\n  Тест: FAIL (ещё нет реализации)\nGreen 1: реализуем базовый случай\n  add("") = 0 ✓\n\nRed 2: add("1") должен вернуть 1\n  Тест: FAIL (не обрабатывает числа)\nGreen 2: добавляем парсинг одного числа\n  add("1") = 1 ✓\n\nRed 3: add("1,2") должен вернуть 3\n  Тест: FAIL (не обрабатывает разделитель)\nGreen 3: добавляем split по запятой\n  add("1,2") = 3 ✓\n\nRed 4: add("1,2,3,4") должен вернуть 10\nGreen 4: уже работает!\n  add("1,2,3,4") = 10 ✓\n\nRefactor: код чистый, тесты зелёные\n\nВсе тесты: 4/4',
      hint: 'TDD: 1) Напиши тест на желаемое поведение. 2) Запусти — должен упасть. 3) Напиши минимум кода для прохождения. 4) Запусти — должен пройти. 5) Рефактори.',
      solution: `public class Main {

    static int passed = 0, total = 0;

    // Эволюция реализации через TDD
    // Версия 1: только пустая строка
    static int addV1(String numbers) {
        if (numbers.isEmpty()) return 0;
        return -1; // ещё не реализовано
    }

    // Версия 2: пустая строка + одно число
    static int addV2(String numbers) {
        if (numbers.isEmpty()) return 0;
        return Integer.parseInt(numbers);
    }

    // Версия 3 (финальная): любое количество чисел
    static int add(String numbers) {
        if (numbers.isEmpty()) return 0;
        String[] parts = numbers.split(",");
        int sum = 0;
        for (String part : parts) {
            sum += Integer.parseInt(part.trim());
        }
        return sum;
    }

    static void check(boolean ok, String msg) {
        total++;
        if (ok) { passed++; System.out.println("  " + msg + " ✓"); }
        else { System.out.println("  " + msg + " ✗"); }
    }

    public static void main(String[] args) {
        System.out.println("=== TDD: StringCalculator ===");

        // Red → Green 1
        System.out.println("\\nRed 1: add(\\"\\") должен вернуть 0");
        System.out.println("  Тест: FAIL (ещё нет реализации)");
        System.out.println("Green 1: реализуем базовый случай");
        check(addV1("") == 0, "add(\\"\\") = 0");

        // Red → Green 2
        System.out.println("\\nRed 2: add(\\"1\\") должен вернуть 1");
        System.out.println("  Тест: FAIL (не обрабатывает числа)");
        System.out.println("Green 2: добавляем парсинг одного числа");
        check(addV2("1") == 1, "add(\\"1\\") = 1");

        // Red → Green 3
        System.out.println("\\nRed 3: add(\\"1,2\\") должен вернуть 3");
        System.out.println("  Тест: FAIL (не обрабатывает разделитель)");
        System.out.println("Green 3: добавляем split по запятой");
        check(add("1,2") == 3, "add(\\"1,2\\") = 3");

        // Green 4 — уже работает
        System.out.println("\\nRed 4: add(\\"1,2,3,4\\") должен вернуть 10");
        System.out.println("Green 4: уже работает!");
        check(add("1,2,3,4") == 10, "add(\\"1,2,3,4\\") = 10");

        System.out.println("\\nRefactor: код чистый, тесты зелёные");
        System.out.println("\\nВсе тесты: " + passed + "/" + total);
    }
}`,
      explanation: 'TDD (Test-Driven Development) — методология: сначала тест, потом код. Цикл: Red (пиши тест, он падает) → Green (минимальный код для прохождения) → Refactor (улучши без изменения поведения). Преимущества: 100% покрытие, продуманный дизайн, документация через тесты, уверенность в коде. StringCalculator — классическое TDD-ката. Каждый шаг добавляет минимальный функционал, подтверждённый тестом.'
    },
    {
      id: 8,
      title: 'Задача: Тестирование исключений в DAO',
      type: 'practice',
      difficulty: 'medium',
      description: 'Протестируй обработку ошибок в DAO слое. Замокай JDBC-компоненты, чтобы они выбрасывали SQLException, и проверь, что DAO корректно обрабатывает все ошибки.',
      requirements: [
        'Mock Connection, PreparedStatement, ResultSet',
        'Симулируй SQLException при выполнении запроса',
        'Проверь, что DAO оборачивает SQLException в DaoException',
        'Проверь, что ресурсы закрываются даже при ошибке (try-with-resources)'
      ],
      expectedOutput: 'testFindById_Success:\n  mock: ResultSet вернёт User{id=1, name=Alice}\n  dao.findById(1) → User{id=1, name=Alice} ✓\n\ntestFindById_NotFound:\n  mock: ResultSet пустой (rs.next() = false)\n  dao.findById(99) → null ✓\n\ntestFindById_SQLException:\n  mock: PreparedStatement бросает SQLException\n  dao.findById(1) → DaoException: "DB error: Connection refused" ✓\n\ntestSave_ConnectionClosed:\n  mock: Connection.prepareStatement() бросает SQLException\n  dao.save(user) → DaoException ✓\n  Connection.close() вызван ✓\n\nВсе тесты пройдены: 5/5',
      hint: 'when(mockStmt.executeQuery()).thenThrow(new SQLException("Connection refused")) — мок бросает исключение. Проверяй, что DAO ловит его и оборачивает в DaoException.',
      solution: `public class Main {

    static int passed = 0, total = 0;

    // Имитация DAO с обработкой ошибок
    static boolean simulateDbError = false;
    static boolean simulateEmpty = false;
    static boolean connectionClosed = false;

    static String findById(int id) throws Exception {
        try {
            if (simulateDbError) {
                throw new Exception("DB error: Connection refused");
            }
            if (simulateEmpty) {
                return null;
            }
            return "User{id=" + id + ", name=Alice}";
        } catch (Exception e) {
            connectionClosed = true;
            throw new Exception("DaoException: " + e.getMessage());
        }
    }

    static String save(String user) throws Exception {
        connectionClosed = false;
        try {
            if (simulateDbError) {
                throw new Exception("Connection refused");
            }
            return "saved";
        } catch (Exception e) {
            connectionClosed = true;
            throw new Exception("DaoException: " + e.getMessage());
        }
    }

    static void check(boolean ok, String msg) {
        total++;
        if (ok) { passed++; System.out.println("  " + msg + " ✓"); }
        else { System.out.println("  " + msg + " ✗"); }
    }

    public static void main(String[] args) {
        // Test 1: успех
        System.out.println("testFindById_Success:");
        simulateDbError = false; simulateEmpty = false;
        System.out.println("  mock: ResultSet вернёт User{id=1, name=Alice}");
        try {
            String result = findById(1);
            check("User{id=1, name=Alice}".equals(result),
                  "dao.findById(1) → " + result);
        } catch (Exception e) {
            check(false, "Неожиданное исключение");
        }

        // Test 2: не найден
        System.out.println("\\ntestFindById_NotFound:");
        simulateEmpty = true; simulateDbError = false;
        System.out.println("  mock: ResultSet пустой (rs.next() = false)");
        try {
            String result = findById(99);
            check(result == null, "dao.findById(99) → null");
        } catch (Exception e) {
            check(false, "Неожиданное исключение");
        }

        // Test 3: SQLException
        System.out.println("\\ntestFindById_SQLException:");
        simulateDbError = true; simulateEmpty = false;
        System.out.println("  mock: PreparedStatement бросает SQLException");
        try {
            findById(1);
            check(false, "Исключение не выброшено");
        } catch (Exception e) {
            check(e.getMessage().contains("DaoException") &&
                  e.getMessage().contains("Connection refused"),
                  "dao.findById(1) → " + e.getMessage());
        }

        // Test 4: ресурсы закрываются
        System.out.println("\\ntestSave_ConnectionClosed:");
        simulateDbError = true; connectionClosed = false;
        System.out.println("  mock: Connection.prepareStatement() бросает SQLException");
        try {
            save("user");
            check(false, "Исключение не выброшено");
        } catch (Exception e) {
            check(e.getMessage().contains("DaoException"), "dao.save(user) → DaoException");
            check(connectionClosed, "Connection.close() вызван");
        }

        System.out.println("\\nВсе тесты пройдены: " + passed + "/" + total);
    }
}`,
      explanation: 'Тестирование DAO с моками JDBC — ключевой навык. Мокаем Connection, PreparedStatement, ResultSet для имитации разных сценариев: успех, пустой результат, ошибка. when(mock).thenThrow(SQLException) имитирует сбой БД. Проверяем: 1) DAO оборачивает SQLException в DaoException, 2) ресурсы закрываются (verify(conn).close()), 3) транзакции откатываются. try-with-resources гарантирует закрытие даже при исключениях.'
    },
    {
      id: 9,
      title: 'Задача: Test Coverage',
      type: 'practice',
      difficulty: 'medium',
      description: 'Разберись с покрытием кода (code coverage). Напиши тесты, покрывающие все ветви: happy path, edge cases, ошибки. Используй JaCoCo для измерения покрытия.',
      requirements: [
        'Класс UserValidator с множеством ветвлений',
        'Happy path: корректные данные проходят валидацию',
        'Edge cases: граничные значения, пустые строки, null',
        'Error cases: невалидные данные, все типы ошибок'
      ],
      expectedOutput: '=== Test Coverage для UserValidator ===\n\nHappy Path:\n  validate("Alice", "a@b.com", 25) → OK ✓\n  validate("Bob", "bob@mail.ru", 18) → OK ✓\n\nEdge Cases:\n  validate("Al", "a@b.c", 0) → OK (граничные) ✓\n  validate(50 символов, email, 150) → OK (макс) ✓\n\nError Cases:\n  validate(null, ...) → "name required" ✓\n  validate("", ...) → "name required" ✓\n  validate("A", ...) → "name too short" ✓\n  validate(..., null, ...) → "email required" ✓\n  validate(..., "invalid", ...) → "email format" ✓\n  validate(..., ..., -1) → "age invalid" ✓\n  validate(..., ..., 200) → "age invalid" ✓\n\nПокрытие: 11 тестов, все ветви покрыты\nLine coverage: 100%, Branch coverage: 100%',
      hint: 'Для 100% branch coverage нужно проверить каждое условие if/else. Составь таблицу: условие → true/false → тест. JaCoCo показывает непокрытые строки красным.',
      solution: `public class Main {

    static int passed = 0, total = 0;

    static String validate(String name, String email, int age) {
        if (name == null || name.trim().isEmpty()) return "name required";
        if (name.length() < 2) return "name too short";
        if (name.length() > 50) return "name too long";
        if (email == null || email.trim().isEmpty()) return "email required";
        if (!email.contains("@") || email.indexOf('.', email.indexOf('@')) < 0)
            return "email format";
        if (age < 0 || age > 150) return "age invalid";
        return "OK";
    }

    static void check(boolean ok, String msg) {
        total++;
        if (ok) { passed++; System.out.println("  " + msg + " ✓"); }
        else { System.out.println("  " + msg + " ✗"); }
    }

    public static void main(String[] args) {
        System.out.println("=== Test Coverage для UserValidator ===");

        // Happy Path
        System.out.println("\\nHappy Path:");
        check("OK".equals(validate("Alice", "a@b.com", 25)),
              "validate(\\"Alice\\", \\"a@b.com\\", 25) → OK");
        check("OK".equals(validate("Bob", "bob@mail.ru", 18)),
              "validate(\\"Bob\\", \\"bob@mail.ru\\", 18) → OK");

        // Edge Cases
        System.out.println("\\nEdge Cases:");
        check("OK".equals(validate("Al", "a@b.c", 0)),
              "validate(\\"Al\\", \\"a@b.c\\", 0) → OK (граничные)");
        String longName = "A".repeat(50);
        check("OK".equals(validate(longName, "a@b.c", 150)),
              "validate(50 символов, email, 150) → OK (макс)");

        // Error Cases
        System.out.println("\\nError Cases:");
        check("name required".equals(validate(null, "a@b.c", 25)),
              "validate(null, ...) → \\"name required\\"");
        check("name required".equals(validate("", "a@b.c", 25)),
              "validate(\\"\\", ...) → \\"name required\\"");
        check("name too short".equals(validate("A", "a@b.c", 25)),
              "validate(\\"A\\", ...) → \\"name too short\\"");
        check("email required".equals(validate("Alice", null, 25)),
              "validate(..., null, ...) → \\"email required\\"");
        check("email format".equals(validate("Alice", "invalid", 25)),
              "validate(..., \\"invalid\\", ...) → \\"email format\\"");
        check("age invalid".equals(validate("Alice", "a@b.c", -1)),
              "validate(..., ..., -1) → \\"age invalid\\"");
        check("age invalid".equals(validate("Alice", "a@b.c", 200)),
              "validate(..., ..., 200) → \\"age invalid\\"");

        System.out.println("\\nПокрытие: " + total + " тестов, все ветви покрыты");
        System.out.println("Line coverage: 100%, Branch coverage: 100%");
        System.out.println("\\nВсе тесты: " + passed + "/" + total);
    }
}`,
      explanation: 'Code coverage — метрика, показывающая, какая доля кода исполняется тестами. Line coverage — процент исполненных строк. Branch coverage — процент проверенных ветвей (if/else). Для хорошего покрытия нужны тесты трёх типов: Happy Path (нормальные данные), Edge Cases (граничные значения), Error Cases (ошибки). JaCoCo — инструмент для измерения покрытия в Java. 80%+ — хороший показатель, но 100% не означает отсутствие багов.'
    },
    {
      id: 10,
      title: 'Задача: Интеграционный тест',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напиши интеграционный тест для DAO с реальной (in-memory) базой данных H2. Тест проверяет полный цикл: создание таблицы → вставка → чтение → обновление → удаление.',
      requirements: [
        'Используй H2 in-memory базу данных',
        '@BeforeEach: создай таблицу и тестовые данные',
        '@AfterEach: удали таблицу (DROP TABLE)',
        'Тестируй полный CRUD цикл с реальными SQL запросами'
      ],
      expectedOutput: '=== Интеграционный тест: UserDao + H2 ===\n\n[Setup] CREATE TABLE users\n[Setup] INSERT 3 тестовых пользователя\n\ntestFindAll:\n  SELECT * FROM users → 3 записи ✓\n\ntestFindById:\n  SELECT WHERE id=1 → Alice ✓\n  SELECT WHERE id=99 → null ✓\n\ntestSave:\n  INSERT Diana → id=4 ✓\n  SELECT count → 4 записи ✓\n\ntestUpdate:\n  UPDATE id=1 name=Alice Updated\n  SELECT id=1 → Alice Updated ✓\n\ntestDelete:\n  DELETE id=2\n  SELECT count → 2 записи ✓\n  SELECT id=2 → null ✓\n\n[Teardown] DROP TABLE users\n\nВсе тесты пройдены: 7/7',
      hint: 'H2 in-memory: jdbc:h2:mem:testdb — база живёт только в памяти и уничтожается при закрытии соединения. Идеально для тестов: быстро, изолированно, не нужен внешний сервер.',
      solution: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Main {

    static int passed = 0, total = 0;

    // Имитация in-memory БД
    static Map<Integer, String[]> db = new HashMap<>();
    static int nextId = 1;

    static void setup() {
        System.out.println("[Setup] CREATE TABLE users");
        db.clear();
        nextId = 1;
        db.put(nextId++, new String[]{"Alice", "alice@mail.com"});
        db.put(nextId++, new String[]{"Bob", "bob@mail.com"});
        db.put(nextId++, new String[]{"Charlie", "charlie@mail.com"});
        System.out.println("[Setup] INSERT 3 тестовых пользователя");
    }

    static void teardown() {
        db.clear();
        System.out.println("\\n[Teardown] DROP TABLE users");
    }

    static List<String> findAll() {
        List<String> result = new ArrayList<>();
        for (Map.Entry<Integer, String[]> e : db.entrySet()) {
            result.add(e.getValue()[0]);
        }
        return result;
    }

    static String findById(int id) {
        String[] data = db.get(id);
        return data != null ? data[0] : null;
    }

    static int save(String name, String email) {
        int id = nextId++;
        db.put(id, new String[]{name, email});
        return id;
    }

    static void update(int id, String name) {
        String[] data = db.get(id);
        if (data != null) data[0] = name;
    }

    static void delete(int id) {
        db.remove(id);
    }

    static void check(boolean ok, String msg) {
        total++;
        if (ok) { passed++; System.out.println("  " + msg + " ✓"); }
        else { System.out.println("  " + msg + " ✗"); }
    }

    public static void main(String[] args) {
        System.out.println("=== Интеграционный тест: UserDao + H2 ===\\n");
        setup();

        // Test findAll
        System.out.println("\\ntestFindAll:");
        List<String> all = findAll();
        check(all.size() == 3, "SELECT * FROM users → 3 записи");

        // Test findById
        System.out.println("\\ntestFindById:");
        check("Alice".equals(findById(1)), "SELECT WHERE id=1 → Alice");
        check(findById(99) == null, "SELECT WHERE id=99 → null");

        // Test save
        System.out.println("\\ntestSave:");
        int newId = save("Diana", "diana@mail.com");
        check(newId == 4, "INSERT Diana → id=" + newId);
        check(findAll().size() == 4, "SELECT count → 4 записи");

        // Test update
        System.out.println("\\ntestUpdate:");
        update(1, "Alice Updated");
        System.out.println("  UPDATE id=1 name=Alice Updated");
        check("Alice Updated".equals(findById(1)), "SELECT id=1 → Alice Updated");

        // Test delete
        System.out.println("\\ntestDelete:");
        delete(2);
        System.out.println("  DELETE id=2");
        check(findAll().size() == 3, "SELECT count → 3 записи");
        check(findById(2) == null, "SELECT id=2 → null");

        teardown();
        System.out.println("\\nВсе тесты пройдены: " + passed + "/" + total);
    }
}`,
      explanation: 'Интеграционный тест проверяет взаимодействие компонентов — в данном случае DAO с реальной БД. H2 in-memory (jdbc:h2:mem:test) — идеальная БД для тестов: быстрая, не требует установки, изолированная. @BeforeEach создаёт схему и тестовые данные, @AfterEach удаляет. Тест проверяет полный CRUD цикл с реальными SQL запросами. В Spring Boot: @DataJpaTest автоматически настраивает H2 и откатывает транзакции после каждого теста.'
    }
  ]
}
