export default {
  id: 4,
  title: 'Mockito: основы',
  description: 'Создание моков, when/thenReturn, verify, аргумент-матчеры',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужны моки?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мок (mock) — это подставной объект, который имитирует поведение реального. Моки нужны, когда тестируемый код зависит от внешних сервисов: БД, API, email.' },
        { type: 'heading', value: 'Проблема: зависимости' },
        { type: 'code', language: 'java', value: '// UserService зависит от UserRepository (БД)\nclass UserService {\n    private UserRepository repo; // зависимость от БД!\n\n    User findUser(String email) {\n        return repo.findByEmail(email); // обращение к БД\n    }\n}\n\n// Как тестировать без реальной БД?\n// Ответ: мокнуть UserRepository!' },
        { type: 'heading', value: 'Решение: мок' },
        { type: 'code', language: 'java', value: '// Мок имитирует UserRepository:\n// "Когда спросят findByEmail(\"john@mail.com\"),\n//  верни заготовленного пользователя"\n\nUserRepository mockRepo = mock(UserRepository.class);\nwhen(mockRepo.findByEmail("john@mail.com"))\n    .thenReturn(new User("John"));\n\n// Теперь UserService работает с моком\nUserService service = new UserService(mockRepo);\nUser user = service.findUser("john@mail.com");\nassertEquals("John", user.getName()); // работает!' },
        { type: 'heading', value: 'Когда использовать моки' },
        { type: 'list', items: [
          'База данных — не хотим поднимать реальную БД для unit-теста',
          'HTTP-клиенты — не хотим делать реальные запросы',
          'Email-сервисы — не хотим отправлять реальные письма',
          'Внешние API — могут быть недоступны или платными',
          'Генерация случайных чисел, текущая дата/время'
        ]},
        { type: 'warning', value: 'Не мокайте то, что не нужно мокать! Простые POJO, утилитные классы, value-объекты — тестируйте напрямую.' },
        { type: 'tip', value: 'Правило: мокайте зависимости, а не тестируемый класс. Если мок нужен для самого тестируемого класса — у вас проблемы с дизайном.' }
      ]
    },
    {
      id: 2,
      title: 'when/thenReturn: настройка поведения',
      type: 'theory',
      content: [
        { type: 'text', value: 'when().thenReturn() — основной паттерн Mockito. Он говорит: "когда вызовут ЭТОТ метод с ТАКИМИ аргументами — верни ВОТ ЭТО".' },
        { type: 'heading', value: 'Базовый синтаксис' },
        { type: 'code', language: 'java', value: '// Настройка мока:\nwhen(mockRepo.findById(1L))\n    .thenReturn(new User("John"));\n\nwhen(mockRepo.findById(999L))\n    .thenReturn(null);\n\n// Разные ответы для разных аргументов:\nwhen(mockService.calculate(10))\n    .thenReturn(100);\nwhen(mockService.calculate(20))\n    .thenReturn(200);' },
        { type: 'heading', value: 'thenThrow — бросить исключение' },
        { type: 'code', language: 'java', value: '// Мок бросает исключение:\nwhen(mockRepo.findById(-1L))\n    .thenThrow(new IllegalArgumentException("ID < 0"));\n\n// Тест:\nassertThrows(IllegalArgumentException.class,\n    () -> service.getUser(-1L));' },
        { type: 'heading', value: 'thenAnswer — динамический ответ' },
        { type: 'code', language: 'java', value: '// Ответ зависит от аргумента:\nwhen(mockCalc.double(anyInt()))\n    .thenAnswer(invocation -> {\n        int arg = invocation.getArgument(0);\n        return arg * 2;\n    });' },
        { type: 'heading', value: 'Цепочка ответов' },
        { type: 'code', language: 'java', value: '// Первый вызов — один ответ, второй — другой:\nwhen(mockIterator.next())\n    .thenReturn("first")\n    .thenReturn("second")\n    .thenThrow(new RuntimeException("No more"));' },
        { type: 'note', value: 'Не настроенный метод мока возвращает значение по умолчанию: null для объектов, 0 для чисел, false для boolean, пустую коллекцию.' }
      ]
    },
    {
      id: 3,
      title: 'verify: проверка вызовов',
      type: 'theory',
      content: [
        { type: 'text', value: 'verify() проверяет, что метод мока был вызван определённое количество раз с определёнными аргументами.' },
        { type: 'heading', value: 'Базовая проверка вызова' },
        { type: 'code', language: 'java', value: '// Проверяем, что метод был вызван:\nverify(mockRepo).save(user);\n\n// Проверяем, что метод был вызван с конкретным аргументом:\nverify(mockEmailService).send("john@mail.com", "Welcome!");' },
        { type: 'heading', value: 'Количество вызовов' },
        { type: 'code', language: 'java', value: '// Вызван ровно 1 раз (по умолчанию):\nverify(mockRepo, times(1)).save(user);\n\n// Вызван ровно 3 раза:\nverify(mockRepo, times(3)).findAll();\n\n// Не вызван ни разу:\nverify(mockRepo, never()).delete(user);\n\n// Вызван хотя бы 1 раз:\nverify(mockRepo, atLeastOnce()).findAll();\n\n// Вызван не более 5 раз:\nverify(mockRepo, atMost(5)).findAll();' },
        { type: 'heading', value: 'verifyNoMoreInteractions' },
        { type: 'code', language: 'java', value: '// Проверяем, что больше никаких вызовов не было:\nverify(mockRepo).save(user);\nverifyNoMoreInteractions(mockRepo);\n// Если был вызван ещё какой-то метод — тест упадёт' },
        { type: 'heading', value: 'Порядок вызовов' },
        { type: 'code', language: 'java', value: '// Проверяем порядок:\nInOrder inOrder = inOrder(mockRepo, mockNotifier);\ninOrder.verify(mockRepo).save(user);\ninOrder.verify(mockNotifier).notify(user);\n// save ДОЛЖЕН быть вызван ПЕРЕД notify' },
        { type: 'tip', value: 'verify — это не assertEquals. Он проверяет не результат, а ПОВЕДЕНИЕ: был ли вызван нужный метод с нужными аргументами.' }
      ]
    },
    {
      id: 4,
      title: 'Argument Matchers',
      type: 'theory',
      content: [
        { type: 'text', value: 'Argument Matchers позволяют задавать гибкие условия для аргументов в when() и verify().' },
        { type: 'heading', value: 'Основные матчеры' },
        { type: 'code', language: 'java', value: '// any() — любой аргумент:\nwhen(mockRepo.findByName(any())).thenReturn(user);\n\n// anyString(), anyInt(), anyLong():\nwhen(mockCalc.add(anyInt(), anyInt())).thenReturn(0);\n\n// eq() — точное значение (нужен если смешиваем):\nwhen(mockRepo.find(eq("John"), anyInt()))\n    .thenReturn(user);\n\n// isNull(), isNotNull():\nwhen(mockRepo.save(isNotNull())).thenReturn(true);' },
        { type: 'heading', value: 'Продвинутые матчеры' },
        { type: 'code', language: 'java', value: '// argThat — кастомное условие:\nwhen(mockRepo.save(argThat(user ->\n    user.getName().startsWith("J")\n))).thenReturn(true);\n\n// contains, startsWith для строк:\nverify(mockLogger).log(contains("error"));\nverify(mockLogger).log(startsWith("ERROR:"));' },
        { type: 'heading', value: 'Важное правило!' },
        { type: 'code', language: 'java', value: '// НЕЛЬЗЯ смешивать матчеры и точные значения:\nwhen(mock.method("exact", anyInt())) // ОШИБКА!\n\n// ПРАВИЛЬНО — используйте eq() для точных значений:\nwhen(mock.method(eq("exact"), anyInt())) // OK!' },
        { type: 'warning', value: 'Если один аргумент — матчер, все аргументы должны быть матчерами. Оборачивайте точные значения в eq().' },
        { type: 'tip', value: 'Используйте any() для when() (нам неважен аргумент) и точные значения для verify() (важно проверить, с чем вызвали).' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Создание мок-объекта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Симулируйте мок-объект для репозитория. Создайте мини-фреймворк моков с when/thenReturn.',
      requirements: [
        'Создайте простой мок-фреймворк: класс MockRepository, который можно настроить',
        'Реализуйте when(key).thenReturn(value) через HashMap',
        'Создайте UserService, который зависит от MockRepository',
        'Протестируйте UserService: findUser, findUser с null, createUser',
        'Выведите результаты тестов'
      ],
      expectedOutput: 'PASS: testFindExistingUser\nPASS: testFindNonExistingUser\nPASS: testCreateUser\nPASS: testFindAfterCreate\nPASS: testVerifyCallCount\nИтого: 5/5',
      hint: 'Используйте HashMap<String, String> для хранения настроенных ответов. Добавьте счётчик вызовов для verify.',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {
    static int passed = 0;
    static int total = 0;

    static void assertEquals(Object expected, Object actual) {
        if (expected == null && actual == null) return;
        if (expected == null || !expected.equals(actual)) {
            throw new RuntimeException(
                "Expected [" + expected + "], got [" + actual + "]");
        }
    }

    static void assertNull(Object obj) {
        if (obj != null) {
            throw new RuntimeException("Expected null, got [" + obj + "]");
        }
    }

    static void assertTrue(boolean cond) {
        if (!cond) throw new RuntimeException("Expected true");
    }

    // --- Mock Repository (симуляция Mockito mock) ---
    static Map<String, String> mockData = new HashMap<>();
    static Map<String, Integer> callCounts = new HashMap<>();

    static void whenFindByEmail(String email, String returnName) {
        mockData.put(email, returnName);
    }

    static String mockFindByEmail(String email) {
        callCounts.merge("findByEmail", 1, Integer::sum);
        return mockData.get(email); // null если не настроено
    }

    static void mockSave(String email, String name) {
        callCounts.merge("save", 1, Integer::sum);
        mockData.put(email, name);
    }

    static int getCallCount(String method) {
        return callCounts.getOrDefault(method, 0);
    }

    // --- UserService (тестируемый код) ---
    static String findUser(String email) {
        return mockFindByEmail(email);
    }

    static String createUser(String email, String name) {
        String existing = mockFindByEmail(email);
        if (existing != null) {
            throw new RuntimeException("User already exists");
        }
        mockSave(email, name);
        return name;
    }

    static void setUp() {
        mockData.clear();
        callCounts.clear();
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
        runTest("testFindExistingUser", () -> {
            // Arrange: настроим мок (when/thenReturn)
            whenFindByEmail("john@mail.com", "John");

            // Act
            String result = findUser("john@mail.com");

            // Assert
            assertEquals("John", result);
        });

        runTest("testFindNonExistingUser", () -> {
            // Мок не настроен — вернёт null (как в Mockito)
            String result = findUser("unknown@mail.com");
            assertNull(result);
        });

        runTest("testCreateUser", () -> {
            String result = createUser("jane@mail.com", "Jane");
            assertEquals("Jane", result);
        });

        runTest("testFindAfterCreate", () -> {
            createUser("bob@mail.com", "Bob");
            String result = findUser("bob@mail.com");
            assertEquals("Bob", result);
        });

        runTest("testVerifyCallCount", () -> {
            // Arrange
            whenFindByEmail("test@mail.com", "Test");

            // Act
            findUser("test@mail.com");
            findUser("test@mail.com");
            findUser("test@mail.com");

            // Verify: findByEmail вызван 3 раза
            assertEquals(3, getCallCount("findByEmail"));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы создали симуляцию Mockito: HashMap играет роль мок-объекта, whenFindByEmail — это when().thenReturn(), callCounts — это verify(). В реальном Mockito всё это работает через прокси и рефлексию, но принцип тот же: настроил ответ -> вызвал метод -> проверил вызовы.'
    },
    {
      id: 6,
      title: 'Практика: verify — проверка вызовов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте систему уведомлений и проверьте, что нужные методы вызываются с правильными аргументами.',
      requirements: [
        'Создайте мок NotificationService с методами sendEmail и sendSms',
        'Создайте OrderService, который при создании заказа вызывает уведомления',
        'Реализуйте verify: проверка вызова, количество вызовов, аргументы',
        'Протестируйте: email отправлен, sms отправлен, verify количество, verify аргументы',
        'Реализуйте verifyNever — проверка, что метод НЕ вызывался'
      ],
      expectedOutput: 'PASS: testEmailSentOnOrder\nPASS: testSmsSentOnOrder\nPASS: testNotificationCount\nPASS: testEmailArguments\nPASS: testNoSmsForSmallOrder\nИтого: 5/5',
      hint: 'Записывайте каждый вызов в список: имя метода + аргументы. Для verify проверяйте содержимое этого списка.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Mock Framework ---
    static List<String> calls = new ArrayList<>();
    static List<String[]> callArgs = new ArrayList<>();

    static void mockSendEmail(String to, String subject) {
        calls.add("sendEmail");
        callArgs.add(new String[]{to, subject});
    }

    static void mockSendSms(String phone, String message) {
        calls.add("sendSms");
        callArgs.add(new String[]{phone, message});
    }

    // Verify: метод вызван N раз
    static void verify(String method, int times) {
        long count = calls.stream()
            .filter(c -> c.equals(method)).count();
        if (count != times) {
            throw new RuntimeException(
                "verify: " + method + " вызван " + count +
                " раз, ожидали " + times);
        }
    }

    // Verify: метод не вызывался
    static void verifyNever(String method) {
        verify(method, 0);
    }

    // Verify: метод вызван с аргументами
    static void verifyArgs(String method, String... expectedArgs) {
        for (int i = 0; i < calls.size(); i++) {
            if (calls.get(i).equals(method)) {
                String[] actual = callArgs.get(i);
                boolean match = true;
                for (int j = 0; j < expectedArgs.length; j++) {
                    if (!expectedArgs[j].equals(actual[j])) {
                        match = false;
                        break;
                    }
                }
                if (match) return; // Нашли совпадение
            }
        }
        throw new RuntimeException(
            "verify: " + method + " не вызван с ожидаемыми аргументами");
    }

    // --- OrderService (тестируемый код) ---
    static void createOrder(String email, String phone,
                            String item, double price) {
        // Бизнес-логика: всегда шлём email
        mockSendEmail(email, "Заказ: " + item);

        // SMS только для заказов > 1000
        if (price > 1000) {
            mockSendSms(phone, "Заказ " + item + " на сумму " + price);
        }
    }

    static void setUp() {
        calls.clear();
        callArgs.clear();
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

    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Expected " + expected + ", got " + actual);
        }
    }

    public static void main(String[] args) {
        runTest("testEmailSentOnOrder", () -> {
            createOrder("user@mail.com", "+77001234567",
                "Ноутбук", 5000);
            verify("sendEmail", 1);
        });

        runTest("testSmsSentOnOrder", () -> {
            createOrder("user@mail.com", "+77001234567",
                "Ноутбук", 5000);
            verify("sendSms", 1);
        });

        runTest("testNotificationCount", () -> {
            createOrder("a@mail.com", "+7700", "Книга", 500);
            createOrder("b@mail.com", "+7701", "Телефон", 2000);
            verify("sendEmail", 2);
            verify("sendSms", 1); // только для дорогого заказа
        });

        runTest("testEmailArguments", () -> {
            createOrder("john@mail.com", "+77001111111",
                "Клавиатура", 3000);
            verifyArgs("sendEmail",
                "john@mail.com", "Заказ: Клавиатура");
        });

        runTest("testNoSmsForSmallOrder", () -> {
            createOrder("user@mail.com", "+77001234567",
                "Ручка", 50);
            verify("sendEmail", 1);
            verifyNever("sendSms"); // SMS не отправлен!
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы симулировали verify из Mockito. Записываем каждый вызов мока в список (calls + callArgs), затем проверяем: был ли вызван, сколько раз, с какими аргументами. В реальном Mockito verify(mock).method(args) делает то же самое через прокси-объекты.'
    },
    {
      id: 7,
      title: 'Практика: Мок с when/thenThrow',
      type: 'practice',
      difficulty: 'medium',
      description: 'Протестируйте обработку ошибок: мок бросает исключение, а сервис должен его корректно обработать.',
      requirements: [
        'Создайте мок PaymentGateway с настраиваемым поведением: успех или ошибка',
        'Создайте PaymentService, который обрабатывает ошибки от PaymentGateway',
        'Протестируйте: успешная оплата, ошибка оплаты, повторная попытка, логирование ошибки',
        'PaymentService при ошибке должен вернуть "FAILED" и записать причину'
      ],
      expectedOutput: 'PASS: testSuccessfulPayment\nPASS: testFailedPayment\nPASS: testPaymentErrorMessage\nPASS: testRetryOnFailure\nИтого: 4/4',
      hint: 'Для thenThrow используйте флаг shouldThrow и сообщение об ошибке. PaymentService оборачивает вызов в try-catch.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Mock PaymentGateway ---
    static boolean shouldThrow = false;
    static String throwMessage = "";
    static int gatewayCallCount = 0;
    static String lastError = null;

    static void whenPayThrow(String message) {
        shouldThrow = true;
        throwMessage = message;
    }

    static void whenPaySucceed() {
        shouldThrow = false;
    }

    static String mockPay(double amount) {
        gatewayCallCount++;
        if (shouldThrow) {
            throw new RuntimeException(throwMessage);
        }
        return "TX-" + (int)(Math.random() * 10000);
    }

    // --- PaymentService (тестируемый код) ---
    static String processPayment(double amount) {
        try {
            String txId = mockPay(amount);
            return "SUCCESS:" + txId;
        } catch (RuntimeException e) {
            lastError = e.getMessage();
            return "FAILED";
        }
    }

    static String processPaymentWithRetry(double amount, int maxRetries) {
        for (int i = 0; i < maxRetries; i++) {
            try {
                String txId = mockPay(amount);
                return "SUCCESS:" + txId;
            } catch (RuntimeException e) {
                lastError = e.getMessage();
            }
        }
        return "FAILED";
    }

    static void setUp() {
        shouldThrow = false;
        throwMessage = "";
        gatewayCallCount = 0;
        lastError = null;
    }

    static void assertEquals(Object expected, Object actual) {
        if (expected == null && actual == null) return;
        if (expected == null || !expected.equals(actual)) {
            throw new RuntimeException(
                "Expected [" + expected + "], got [" + actual + "]");
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Expected true");
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
        runTest("testSuccessfulPayment", () -> {
            whenPaySucceed();
            String result = processPayment(100.0);
            assertTrue(result.startsWith("SUCCESS:"));
        });

        runTest("testFailedPayment", () -> {
            whenPayThrow("Insufficient funds");
            String result = processPayment(100.0);
            assertEquals("FAILED", result);
        });

        runTest("testPaymentErrorMessage", () -> {
            whenPayThrow("Card expired");
            processPayment(100.0);
            assertEquals("Card expired", lastError);
        });

        runTest("testRetryOnFailure", () -> {
            whenPayThrow("Timeout");
            String result = processPaymentWithRetry(100.0, 3);
            assertEquals("FAILED", result);
            assertEquals(3, gatewayCallCount);
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы симулировали thenThrow из Mockito. Мок PaymentGateway настраивается: при shouldThrow=true бросает исключение. PaymentService корректно обрабатывает ошибку и возвращает "FAILED". Тест с retry проверяет, что gateway вызывается ровно 3 раза — это типичный паттерн в платёжных системах.'
    }
  ]
}
