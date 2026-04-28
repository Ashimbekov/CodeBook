export default {
  id: 1,
  title: 'Зачем нужны тесты',
  description: 'Виды тестов, пирамида тестирования, зачем писать тесты и как они экономят время',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужны тесты?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Представьте: вы написали сервис для перевода денег между счетами. Всё работает. Через месяц добавили новую фичу — и перевод сломался. Клиенты теряют деньги. Как это предотвратить? Тестами.' },
        { type: 'heading', value: 'Что такое тест?' },
        { type: 'text', value: 'Тест — это код, который проверяет другой код. Вы пишете метод, а потом пишете отдельный метод, который вызывает первый и проверяет результат.' },
        { type: 'code', language: 'java', value: '// Наш код\npublic static int add(int a, int b) {\n    return a + b;\n}\n\n// Наш тест\npublic static void testAdd() {\n    int result = add(2, 3);\n    if (result != 5) {\n        throw new RuntimeException(\n            "FAIL: ожидали 5, получили " + result\n        );\n    }\n    System.out.println("PASS: add(2, 3) = 5");\n}' },
        { type: 'heading', value: 'Почему тесты важны?' },
        { type: 'list', items: [
          'Находят баги ДО продакшена — дешевле исправить',
          'Дают уверенность при рефакторинге — меняешь код, запускаешь тесты',
          'Служат документацией — показывают, как код должен работать',
          'Ускоряют разработку — не нужно каждый раз проверять вручную',
          'Улучшают дизайн кода — сложно тестировать = плохой дизайн'
        ]},
        { type: 'tip', value: 'Тесты — это страховка. Вы тратите 20% времени на написание тестов, но экономите 80% времени на отладке и исправлении багов.' },
        { type: 'text', value: 'В реальных проектах без тестов невозможно. Любая серьёзная компания требует покрытие кода тестами. Это стандарт индустрии.' }
      ]
    },
    {
      id: 2,
      title: 'Виды тестов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тесты бывают разные — от быстрых проверок одного метода до полного прогона всей системы.' },
        { type: 'heading', value: 'Unit-тесты (модульные)' },
        { type: 'text', value: 'Проверяют один метод или класс в изоляции. Самые быстрые и дешёвые.' },
        { type: 'code', language: 'java', value: '// Unit-тест: проверяем калькулятор\npublic static void testMultiply() {\n    Calculator calc = new Calculator();\n    int result = calc.multiply(3, 4);\n    assertEquals(12, result); // ожидаем 12\n}' },
        { type: 'heading', value: 'Интеграционные тесты' },
        { type: 'text', value: 'Проверяют взаимодействие нескольких компонентов. Например, сервис + база данных.' },
        { type: 'code', language: 'java', value: '// Интеграционный тест: сервис + репозиторий\npublic static void testCreateUser() {\n    UserService service = new UserService(new UserRepository());\n    User user = service.createUser("John", "john@mail.com");\n    assertEquals("John", user.getName());\n    // Проверяем, что сохранено в БД\n}' },
        { type: 'heading', value: 'E2E тесты (end-to-end)' },
        { type: 'text', value: 'Проверяют систему целиком — от UI до базы данных. Самые медленные и дорогие.' },
        { type: 'heading', value: 'Другие виды' },
        { type: 'list', items: [
          'Smoke-тесты — быстрая проверка, что система запускается',
          'Regression-тесты — проверка, что старый функционал не сломался',
          'Performance-тесты — проверка скорости и нагрузки',
          'Security-тесты — проверка безопасности'
        ]},
        { type: 'note', value: 'В этом курсе мы фокусируемся на unit-тестах и интеграционных тестах — они составляют 90% всех тестов в Java-проектах.' }
      ]
    },
    {
      id: 3,
      title: 'Пирамида тестирования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пирамида тестирования — это модель, которая показывает, сколько тестов каждого вида нужно писать.' },
        { type: 'heading', value: 'Структура пирамиды' },
        { type: 'code', language: 'text', value: '         /\\          E2E тесты (мало)\n        /  \\         - медленные, дорогие\n       /----\\        - проверяют всю систему\n      /      \\\n     / Интегр. \\     Интеграционные (средне)\n    /  тесты    \\    - средняя скорость\n   /------------\\    - проверяют связки\n  /              \\\n /  Unit-тесты    \\  Unit-тесты (много)\n/------------------\\ - быстрые, дешёвые\n                     - проверяют один метод' },
        { type: 'heading', value: 'Почему именно пирамида?' },
        { type: 'list', items: [
          'Unit-тесты — фундамент. Их должно быть БОЛЬШЕ всего (70-80%)',
          'Интеграционные — средний слой (15-20%)',
          'E2E — вершина. Их должно быть МАЛО (5-10%)'
        ]},
        { type: 'heading', value: 'Антипаттерн: перевёрнутая пирамида' },
        { type: 'text', value: 'Если у вас много E2E и мало unit-тестов — это проблема. E2E тесты медленные, хрупкие и сложные в поддержке. Один E2E тест может работать 30 секунд, а 1000 unit-тестов — за 5 секунд.' },
        { type: 'warning', value: 'Антипаттерн "Ice Cream Cone" — когда больше всего ручного тестирования и E2E, а unit-тестов мало. Это дорого и ненадёжно.' },
        { type: 'tip', value: 'Правило: если баг можно поймать unit-тестом — пишите unit-тест. Не поднимайте уровень тестирования без необходимости.' }
      ]
    },
    {
      id: 4,
      title: 'Структура теста: AAA',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый тест должен следовать паттерну AAA — Arrange, Act, Assert. Это делает тесты читаемыми и предсказуемыми.' },
        { type: 'heading', value: 'Arrange (Подготовка)' },
        { type: 'text', value: 'Создаём объекты, настраиваем входные данные, готовим всё необходимое.' },
        { type: 'heading', value: 'Act (Действие)' },
        { type: 'text', value: 'Вызываем тестируемый метод. Обычно одна строка.' },
        { type: 'heading', value: 'Assert (Проверка)' },
        { type: 'text', value: 'Проверяем результат — совпадает ли он с ожидаемым.' },
        { type: 'code', language: 'java', value: 'public static void testDiscount() {\n    // Arrange (подготовка)\n    PriceCalculator calculator = new PriceCalculator();\n    double originalPrice = 100.0;\n    double discountPercent = 15.0;\n\n    // Act (действие)\n    double result = calculator.applyDiscount(\n        originalPrice, discountPercent\n    );\n\n    // Assert (проверка)\n    assertEquals(85.0, result);\n}' },
        { type: 'heading', value: 'Правила хорошего теста' },
        { type: 'list', items: [
          'Один тест = одна проверка (один assert в идеале)',
          'Тест должен быть независимым от других тестов',
          'Тест должен быть быстрым (миллисекунды)',
          'Тест должен быть детерминированным — всегда один результат',
          'Название теста описывает, ЧТО проверяется'
        ]},
        { type: 'tip', value: 'Думайте о тесте как о рецепте: сначала подготовьте ингредиенты (Arrange), потом приготовьте блюдо (Act), потом попробуйте на вкус (Assert).' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Простой тестовый фреймворк',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте свой мини-фреймворк для тестирования: методы assertEquals, assertTrue, assertFalse. Затем протестируйте простой калькулятор.',
      requirements: [
        'Создайте метод assertEquals(expected, actual) — бросает исключение, если значения не равны',
        'Создайте метод assertTrue(condition) — бросает исключение, если false',
        'Создайте метод assertFalse(condition) — бросает исключение, если true',
        'Создайте класс Calculator с методами add, subtract, multiply',
        'Напишите тесты для каждого метода Calculator используя ваши assert-методы',
        'Выведите результат каждого теста: PASS или FAIL'
      ],
      expectedOutput: 'PASS: testAdd\nPASS: testSubtract\nPASS: testMultiply\nPASS: testAddNegative\nВсе тесты пройдены: 4/4',
      hint: 'Создайте статические методы assert, которые бросают RuntimeException при несовпадении. Оберните вызовы тестов в try-catch для подсчёта.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Ожидали " + expected + ", получили " + actual
            );
        }
    }

    static void assertTrue(boolean condition) {
        if (!condition) {
            throw new RuntimeException("Ожидали true, получили false");
        }
    }

    static void assertFalse(boolean condition) {
        if (condition) {
            throw new RuntimeException("Ожидали false, получили true");
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

    // --- Calculator ---
    static int add(int a, int b) { return a + b; }
    static int subtract(int a, int b) { return a - b; }
    static int multiply(int a, int b) { return a * b; }

    public static void main(String[] args) {
        runTest("testAdd", () -> {
            assertEquals(5, add(2, 3));
        });

        runTest("testSubtract", () -> {
            assertEquals(7, subtract(10, 3));
        });

        runTest("testMultiply", () -> {
            assertEquals(12, multiply(3, 4));
        });

        runTest("testAddNegative", () -> {
            assertEquals(-1, add(-3, 2));
        });

        System.out.println("Все тесты пройдены: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы создали мини-фреймворк тестирования. assertEquals проверяет равенство, assertTrue/assertFalse проверяют boolean. Метод runTest оборачивает тест в try-catch и считает результаты. Это упрощённая версия того, что делает JUnit.'
    },
    {
      id: 6,
      title: 'Практика: Тестирование строкового валидатора',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте валидатор email-адресов и протестируйте его разными входными данными.',
      requirements: [
        'Создайте метод isValidEmail(String email), который проверяет наличие @ и точки после @',
        'Напишите минимум 5 тестов для разных случаев',
        'Протестируйте: валидный email, без @, без точки, пустую строку, null',
        'Используйте паттерн AAA в каждом тесте'
      ],
      expectedOutput: 'PASS: testValidEmail\nPASS: testEmailWithoutAt\nPASS: testEmailWithoutDot\nPASS: testEmptyEmail\nPASS: testNullEmail\nВсе тесты пройдены: 5/5',
      hint: 'Метод isValidEmail должен вернуть false для null и пустой строки. Проверяйте contains("@") и indexOf(".") после indexOf("@").',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Ожидали " + expected + ", получили " + actual
            );
        }
    }

    static void assertTrue(boolean condition) {
        if (!condition) {
            throw new RuntimeException("Ожидали true, получили false");
        }
    }

    static void assertFalse(boolean condition) {
        if (condition) {
            throw new RuntimeException("Ожидали false, получили true");
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

    // --- Валидатор ---
    static boolean isValidEmail(String email) {
        if (email == null || email.isEmpty()) return false;
        int atIndex = email.indexOf('@');
        if (atIndex <= 0) return false;
        int dotIndex = email.indexOf('.', atIndex);
        return dotIndex > atIndex + 1 && dotIndex < email.length() - 1;
    }

    public static void main(String[] args) {
        // Arrange & Act & Assert для каждого теста

        runTest("testValidEmail", () -> {
            // Arrange
            String email = "user@example.com";
            // Act
            boolean result = isValidEmail(email);
            // Assert
            assertTrue(result);
        });

        runTest("testEmailWithoutAt", () -> {
            String email = "userexample.com";
            boolean result = isValidEmail(email);
            assertFalse(result);
        });

        runTest("testEmailWithoutDot", () -> {
            String email = "user@examplecom";
            boolean result = isValidEmail(email);
            assertFalse(result);
        });

        runTest("testEmptyEmail", () -> {
            String email = "";
            boolean result = isValidEmail(email);
            assertFalse(result);
        });

        runTest("testNullEmail", () -> {
            boolean result = isValidEmail(null);
            assertFalse(result);
        });

        System.out.println("Все тесты пройдены: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы создали валидатор email и написали 5 тестов, каждый следует паттерну AAA. Тестируем как позитивный (валидный email), так и негативные сценарии (без @, без точки, пустой, null). Это типичный подход к тестированию — проверять не только "правильные" входы, но и ошибочные.'
    }
  ]
}
