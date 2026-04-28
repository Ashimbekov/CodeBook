export default {
  id: 3,
  title: 'JUnit 5: продвинутый',
  description: 'Параметризованные тесты, вложенные классы, теги, условное выполнение',
  lessons: [
    {
      id: 1,
      title: 'Параметризованные тесты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Параметризованные тесты позволяют запускать один и тот же тест с разными входными данными. Вместо 10 одинаковых тестов — один с 10 наборами данных.' },
        { type: 'heading', value: 'Проблема: дублирование тестов' },
        { type: 'code', language: 'java', value: '// Плохо — дублирование:\n@Test void testIsPositive_1() { assertTrue(isPositive(1)); }\n@Test void testIsPositive_5() { assertTrue(isPositive(5)); }\n@Test void testIsPositive_100() { assertTrue(isPositive(100)); }\n// ... и так далее' },
        { type: 'heading', value: 'Решение: @ParameterizedTest' },
        { type: 'code', language: 'java', value: '// В JUnit 5:\n@ParameterizedTest\n@ValueSource(ints = {1, 5, 100, 999})\nvoid testIsPositive(int number) {\n    assertTrue(isPositive(number));\n}\n\n// Строки:\n@ParameterizedTest\n@ValueSource(strings = {"racecar", "madam", "level"})\nvoid testIsPalindrome(String word) {\n    assertTrue(isPalindrome(word));\n}' },
        { type: 'heading', value: 'Источники данных' },
        { type: 'list', items: [
          '@ValueSource — простые значения (int, String, double)',
          '@CsvSource — CSV-строки для нескольких параметров',
          '@MethodSource — метод возвращает Stream аргументов',
          '@EnumSource — значения enum',
          '@NullAndEmptySource — null и пустые значения'
        ]},
        { type: 'code', language: 'java', value: '// @CsvSource — несколько параметров:\n@ParameterizedTest\n@CsvSource({"1, 2, 3", "10, 20, 30", "-1, 1, 0"})\nvoid testAdd(int a, int b, int expected) {\n    assertEquals(expected, calculator.add(a, b));\n}' },
        { type: 'tip', value: 'Параметризованные тесты — must-have для валидаторов, парсеров, калькуляторов — всего, что обрабатывает разные входные данные.' }
      ]
    },
    {
      id: 2,
      title: '@Nested: вложенные тестовые классы',
      type: 'theory',
      content: [
        { type: 'text', value: '@Nested позволяет группировать тесты в логические блоки внутри одного тестового класса. Это улучшает читаемость и организацию.' },
        { type: 'heading', value: 'Без @Nested — плоский список' },
        { type: 'code', language: 'java', value: '// Плоский список — трудно найти нужное:\nclass UserServiceTest {\n    void testCreateUser() { }\n    void testCreateUserWithNull() { }\n    void testCreateUserDuplicate() { }\n    void testDeleteUser() { }\n    void testDeleteUserNotFound() { }\n    void testUpdateUser() { }\n    void testUpdateUserNotFound() { }\n}' },
        { type: 'heading', value: 'С @Nested — логическая структура' },
        { type: 'code', language: 'java', value: '// В JUnit 5:\nclass UserServiceTest {\n\n    @Nested\n    class CreateUser {\n        @Test void withValidData() { }\n        @Test void withNullName() { }\n        @Test void withDuplicateEmail() { }\n    }\n\n    @Nested\n    class DeleteUser {\n        @Test void existingUser() { }\n        @Test void nonExistingUser() { }\n    }\n\n    @Nested\n    class UpdateUser {\n        @Test void existingUser() { }\n        @Test void nonExistingUser() { }\n    }\n}' },
        { type: 'heading', value: 'Преимущества' },
        { type: 'list', items: [
          'Логическая группировка — Create, Read, Update, Delete',
          'Каждый @Nested может иметь свой @BeforeEach',
          'Отчёт о тестах становится древовидным',
          'Легче найти нужные тесты'
        ]},
        { type: 'note', value: 'Вложенные классы наследуют @BeforeEach родительского класса и могут добавлять свои.' }
      ]
    },
    {
      id: 3,
      title: 'Теги и условное выполнение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Теги позволяют маркировать тесты и запускать только нужные. Условные аннотации включают/выключают тесты по условию.' },
        { type: 'heading', value: '@Tag — маркировка тестов' },
        { type: 'code', language: 'java', value: '// В JUnit 5:\n@Tag("fast")\n@Test\nvoid testCalculation() { /* быстрый тест */ }\n\n@Tag("slow")\n@Tag("integration")\n@Test\nvoid testDatabaseQuery() { /* медленный тест */ }\n\n// Запуск только быстрых:\n// mvn test -Dgroups="fast"\n// Исключить медленные:\n// mvn test -DexcludedGroups="slow"' },
        { type: 'heading', value: 'Условное выполнение' },
        { type: 'code', language: 'java', value: '// Запускать только на Linux:\n@EnabledOnOs(OS.LINUX)\n@Test\nvoid testLinuxFeature() { }\n\n// Запускать только с Java 17+:\n@EnabledForJreRange(min = JRE.JAVA_17)\n@Test\nvoid testJava17Feature() { }\n\n// Запускать по условию:\n@EnabledIf("isDevEnvironment")\n@Test\nvoid testDevOnly() { }\n\nstatic boolean isDevEnvironment() {\n    return "dev".equals(System.getenv("ENV"));\n}\n\n// Запускать при наличии env-переменной:\n@EnabledIfEnvironmentVariable(\n    named = "CI", matches = "true"\n)\n@Test\nvoid testOnCI() { }' },
        { type: 'heading', value: 'Кастомные аннотации' },
        { type: 'code', language: 'java', value: '// Создаём свою аннотацию:\n@Target(ElementType.METHOD)\n@Retention(RetentionPolicy.RUNTIME)\n@Tag("fast")\n@Test\n@interface FastTest { }\n\n// Используем:\n@FastTest\nvoid testQuickCalc() { }' },
        { type: 'tip', value: 'Используйте теги для разделения: @Tag("unit"), @Tag("integration"), @Tag("e2e"). В CI запускайте unit-тесты на каждый коммит, а интеграционные — раз в час.' }
      ]
    },
    {
      id: 4,
      title: 'assertThrows и assertTimeout',
      type: 'theory',
      content: [
        { type: 'text', value: 'Два мощных assertion-метода из JUnit 5: проверка исключений и проверка времени выполнения.' },
        { type: 'heading', value: 'assertThrows — проверка исключений' },
        { type: 'code', language: 'java', value: '// В JUnit 5:\n@Test\nvoid testDivideByZero() {\n    Calculator calc = new Calculator();\n    ArithmeticException ex = assertThrows(\n        ArithmeticException.class,\n        () -> calc.divide(10, 0)\n    );\n    assertEquals("/ by zero", ex.getMessage());\n}\n\n@Test\nvoid testNullArgument() {\n    assertThrows(\n        NullPointerException.class,\n        () -> service.process(null)\n    );\n}' },
        { type: 'heading', value: 'assertDoesNotThrow — проверка отсутствия исключения' },
        { type: 'code', language: 'java', value: '@Test\nvoid testValidInput() {\n    assertDoesNotThrow(\n        () -> service.process("valid data")\n    );\n}' },
        { type: 'heading', value: 'assertTimeout — ограничение времени' },
        { type: 'code', language: 'java', value: '// Тест упадёт, если выполняется > 1 секунды:\n@Test\nvoid testPerformance() {\n    assertTimeout(Duration.ofSeconds(1), () -> {\n        service.processLargeDataset();\n    });\n}\n\n// assertTimeoutPreemptively — прервёт выполнение:\n@Test\nvoid testWithCutoff() {\n    assertTimeoutPreemptively(\n        Duration.ofMillis(500),\n        () -> riskyOperation()\n    );\n}' },
        { type: 'warning', value: 'assertTimeout ждёт завершения, а assertTimeoutPreemptively прерывает выполнение. Второй быстрее, но может оставить ресурсы незакрытыми.' },
        { type: 'note', value: 'assertThrows возвращает объект исключения — вы можете проверить его сообщение, cause и другие поля.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Параметризованные тесты',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте симуляцию параметризованных тестов: один метод тестирования запускается с разными данными.',
      requirements: [
        'Создайте метод isPrime(int n), определяющий простое число',
        'Реализуйте метод parameterizedTest(name, testData, testLogic) — принимает массив данных и тестовую логику',
        'Протестируйте isPrime с набором простых чисел (2,3,5,7,11,13)',
        'Протестируйте isPrime с набором НЕ простых чисел (0,1,4,6,8,9,10)',
        'Выведите результат для каждого набора данных'
      ],
      expectedOutput: 'Параметризованный тест: testPrimeNumbers\n  [2] -> PASS\n  [3] -> PASS\n  [5] -> PASS\n  [7] -> PASS\n  [11] -> PASS\n  [13] -> PASS\nПараметризованный тест: testNotPrimeNumbers\n  [0] -> PASS\n  [1] -> PASS\n  [4] -> PASS\n  [6] -> PASS\n  [8] -> PASS\n  [9] -> PASS\n  [10] -> PASS\nИтого: 13/13 пройдено',
      hint: 'Используйте массив int[] для данных и интерфейс для тестовой логики (или Runnable).',
      solution: `import java.util.function.IntPredicate;

public class Main {
    static int passed = 0;
    static int total = 0;

    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    static void parameterizedTest(String name, int[] data,
                                  IntPredicate assertion) {
        System.out.println("Параметризованный тест: " + name);
        for (int value : data) {
            total++;
            try {
                if (!assertion.test(value)) {
                    throw new RuntimeException("Assertion failed");
                }
                passed++;
                System.out.println("  [" + value + "] -> PASS");
            } catch (Exception e) {
                System.out.println("  [" + value + "] -> FAIL");
            }
        }
    }

    public static void main(String[] args) {
        // Тест: все эти числа простые
        parameterizedTest("testPrimeNumbers",
            new int[]{2, 3, 5, 7, 11, 13},
            n -> isPrime(n) == true
        );

        // Тест: все эти числа НЕ простые
        parameterizedTest("testNotPrimeNumbers",
            new int[]{0, 1, 4, 6, 8, 9, 10},
            n -> isPrime(n) == false
        );

        System.out.println("Итого: " + passed + "/" + total + " пройдено");
    }
}`,
      explanation: 'Мы симулировали @ParameterizedTest из JUnit 5. Вместо написания 13 отдельных тестов, мы написали 2 параметризованных теста с массивами данных. IntPredicate играет роль тестовой логики. В реальном JUnit вы используете @ValueSource или @CsvSource для того же эффекта.'
    },
    {
      id: 6,
      title: 'Практика: Вложенные тесты',
      type: 'practice',
      difficulty: 'medium',
      description: 'Симулируйте структуру @Nested тестов для класса Stack (стек).',
      requirements: [
        'Реализуйте простой Stack с методами: push, pop, peek, isEmpty, size',
        'Создайте группы тестов: "Когда стек пуст" и "Когда стек не пуст"',
        'Для пустого стека: isEmpty=true, size=0, pop бросает исключение',
        'Для непустого стека: isEmpty=false, push увеличивает size, pop возвращает последний элемент',
        'Выведите древовидную структуру результатов'
      ],
      expectedOutput: 'StackTest\n  Когда стек пуст\n    PASS: isEmpty возвращает true\n    PASS: size возвращает 0\n    PASS: pop бросает исключение\n  Когда стек не пуст\n    PASS: isEmpty возвращает false\n    PASS: push увеличивает size\n    PASS: pop возвращает последний элемент\n    PASS: peek не удаляет элемент\nИтого: 7/7',
      hint: 'Используйте ArrayList для реализации стека. Для группировки тестов создайте методы testWhenEmpty() и testWhenNotEmpty().',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Stack ---
    static List<Integer> stack = new ArrayList<>();

    static void push(int value) {
        stack.add(value);
    }

    static int pop() {
        if (stack.isEmpty()) {
            throw new RuntimeException("Stack is empty");
        }
        return stack.remove(stack.size() - 1);
    }

    static int peek() {
        if (stack.isEmpty()) {
            throw new RuntimeException("Stack is empty");
        }
        return stack.get(stack.size() - 1);
    }

    static boolean isEmpty() {
        return stack.isEmpty();
    }

    static int size() {
        return stack.size();
    }

    // --- Assertions ---
    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Expected " + expected + ", got " + actual);
        }
    }

    static void assertTrue(boolean cond) {
        if (!cond) throw new RuntimeException("Expected true");
    }

    static void assertFalse(boolean cond) {
        if (cond) throw new RuntimeException("Expected false");
    }

    static void assertThrows(Runnable code) {
        try {
            code.run();
            throw new RuntimeException("Ожидали исключение, но его не было");
        } catch (RuntimeException e) {
            // Ожидаемое исключение поймано
            if (e.getMessage().equals("Ожидали исключение, но его не было")) {
                throw e;
            }
        }
    }

    static void runNested(String group, String name, Runnable test) {
        total++;
        try {
            test.run();
            passed++;
            System.out.println("    PASS: " + name);
        } catch (Exception e) {
            System.out.println("    FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        System.out.println("StackTest");

        // @Nested: Когда стек пуст
        System.out.println("  Когда стек пуст");
        stack = new ArrayList<>();

        runNested("empty", "isEmpty возвращает true", () -> {
            assertTrue(isEmpty());
        });

        runNested("empty", "size возвращает 0", () -> {
            assertEquals(0, size());
        });

        runNested("empty", "pop бросает исключение", () -> {
            assertThrows(() -> pop());
        });

        // @Nested: Когда стек не пуст
        System.out.println("  Когда стек не пуст");
        stack = new ArrayList<>();
        push(10);
        push(20);
        push(30);

        runNested("notEmpty", "isEmpty возвращает false", () -> {
            assertFalse(isEmpty());
        });

        stack = new ArrayList<>();
        runNested("notEmpty", "push увеличивает size", () -> {
            push(1);
            push(2);
            assertEquals(2, size());
        });

        stack = new ArrayList<>();
        push(10);
        push(20);
        runNested("notEmpty", "pop возвращает последний элемент", () -> {
            assertEquals(20, pop());
            assertEquals(10, pop());
        });

        stack = new ArrayList<>();
        push(42);
        runNested("notEmpty", "peek не удаляет элемент", () -> {
            assertEquals(42, peek());
            assertEquals(1, size());
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы симулировали @Nested из JUnit 5. Тесты группируются по контексту: "Когда стек пуст" и "Когда стек не пуст". Каждая группа имеет свою подготовку данных. В реальном JUnit @Nested классы имеют свой @BeforeEach, что делает код чище.'
    },
    {
      id: 7,
      title: 'Практика: assertThrows и assertTimeout',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте assertThrows и assertTimeout и протестируйте сервис деления чисел и операции с таймаутом.',
      requirements: [
        'Реализуйте assertThrows(expectedType, code) — проверяет, что код бросает ожидаемое исключение',
        'Реализуйте assertTimeout(maxMillis, code) — проверяет, что код выполняется быстрее заданного времени',
        'Создайте метод divide(a, b) — бросает ArithmeticException при делении на 0',
        'Создайте метод slowOperation() — симулирует долгую операцию',
        'Протестируйте оба сценария'
      ],
      expectedOutput: 'PASS: testDivideByZero_throwsException\nPASS: testDivideValid_noException\nPASS: testDivideByZero_messageCheck\nPASS: testFastOperation_withinTimeout\nPASS: testSlowOperation_exceedsTimeout\nИтого: 5/5',
      hint: 'Для assertTimeout замерьте время через System.currentTimeMillis(). Для assertThrows оберните вызов в try-catch и проверьте тип исключения.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Custom Assertions ---
    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Expected " + expected + ", got " + actual);
        }
    }

    static RuntimeException assertThrows(Class<?> expectedType,
                                          Runnable code) {
        try {
            code.run();
            throw new RuntimeException(
                "Ожидали " + expectedType.getSimpleName() +
                ", но исключение не было брошено"
            );
        } catch (RuntimeException e) {
            if (e.getMessage() != null &&
                e.getMessage().startsWith("Ожидали ")) {
                throw e; // пробрасываем нашу ошибку
            }
            if (!expectedType.isInstance(e)) {
                throw new RuntimeException(
                    "Ожидали " + expectedType.getSimpleName() +
                    ", но получили " + e.getClass().getSimpleName()
                );
            }
            return e;
        }
    }

    static void assertTimeout(long maxMillis, Runnable code) {
        long start = System.currentTimeMillis();
        code.run();
        long elapsed = System.currentTimeMillis() - start;
        if (elapsed > maxMillis) {
            throw new RuntimeException(
                "Превышен таймаут: " + elapsed + "ms > " + maxMillis + "ms"
            );
        }
    }

    static void assertTimeoutExceeded(long maxMillis, Runnable code) {
        long start = System.currentTimeMillis();
        code.run();
        long elapsed = System.currentTimeMillis() - start;
        if (elapsed <= maxMillis) {
            throw new RuntimeException(
                "Ожидали превышение таймаута, но выполнено за " +
                elapsed + "ms"
            );
        }
    }

    // --- Business Logic ---
    static double divide(int a, int b) {
        if (b == 0) {
            throw new ArithmeticException("Деление на ноль");
        }
        return (double) a / b;
    }

    static void fastOperation() {
        int sum = 0;
        for (int i = 0; i < 1000; i++) sum += i;
    }

    static void slowOperation() {
        try { Thread.sleep(200); } catch (Exception e) { }
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
        runTest("testDivideByZero_throwsException", () -> {
            assertThrows(ArithmeticException.class,
                () -> divide(10, 0));
        });

        runTest("testDivideValid_noException", () -> {
            double result = divide(10, 2);
            assertEquals(5.0, result);
        });

        runTest("testDivideByZero_messageCheck", () -> {
            RuntimeException ex = assertThrows(
                ArithmeticException.class,
                () -> divide(10, 0)
            );
            assertEquals("Деление на ноль", ex.getMessage());
        });

        runTest("testFastOperation_withinTimeout", () -> {
            assertTimeout(100, () -> fastOperation());
        });

        runTest("testSlowOperation_exceedsTimeout", () -> {
            assertTimeoutExceeded(50, () -> slowOperation());
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'assertThrows ловит исключение и проверяет его тип — это точная симуляция JUnit 5. assertTimeout замеряет время выполнения. В реальном JUnit assertThrows возвращает пойманное исключение, что позволяет проверить его message — мы тоже это реализовали.'
    }
  ]
}
