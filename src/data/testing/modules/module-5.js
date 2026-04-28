export default {
  id: 5,
  title: 'Mockito: продвинутый',
  description: 'Spy, ArgumentCaptor, doThrow/doReturn, мокирование void-методов',
  lessons: [
    {
      id: 1,
      title: 'Spy: частичные моки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spy (шпион) — это обёртка над реальным объектом. В отличие от мока, spy вызывает РЕАЛЬНЫЕ методы, но позволяет переопределить некоторые из них.' },
        { type: 'heading', value: 'Mock vs Spy' },
        { type: 'code', language: 'java', value: '// Mock — все методы "пустые" (возвращают null/0/false)\nList<String> mockList = mock(ArrayList.class);\nmockList.add("test"); // ничего не делает\nmockList.size(); // возвращает 0\n\n// Spy — реальный объект с возможностью переопределения\nList<String> spyList = spy(new ArrayList<>());\nspyList.add("test"); // РЕАЛЬНО добавляет!\nspyList.size(); // возвращает 1\n\n// Переопределяем один метод:\nwhen(spyList.size()).thenReturn(100);\nspyList.size(); // возвращает 100' },
        { type: 'heading', value: 'Когда использовать Spy' },
        { type: 'list', items: [
          'Нужно переопределить ОДИН метод, остальные оставить реальными',
          'Тестирование legacy-кода, который нельзя изменить',
          'Проверка вызова реального метода (verify на spy)',
          'Переопределение дорогих операций (сеть, БД) в реальном объекте'
        ]},
        { type: 'heading', value: 'doReturn vs when для Spy' },
        { type: 'code', language: 'java', value: '// ВАЖНО: для spy используйте doReturn вместо when!\n\n// ПРОБЛЕМА: when вызывает РЕАЛЬНЫЙ метод:\nwhen(spyList.get(0)).thenReturn("mock"); // бросит IndexOutOfBounds!\n\n// РЕШЕНИЕ: doReturn не вызывает реальный метод:\ndoReturn("mock").when(spyList).get(0); // OK!' },
        { type: 'warning', value: 'Spy — это антипаттерн в большинстве случаев. Если нужен spy, возможно, класс нарушает Single Responsibility. Предпочитайте mock + dependency injection.' }
      ]
    },
    {
      id: 2,
      title: 'ArgumentCaptor',
      type: 'theory',
      content: [
        { type: 'text', value: 'ArgumentCaptor захватывает аргумент, переданный в мок, для дальнейшей проверки. Полезен, когда аргумент создаётся внутри тестируемого метода.' },
        { type: 'heading', value: 'Проблема' },
        { type: 'code', language: 'java', value: '// UserService создаёт Event ВНУТРИ метода:\nclass UserService {\n    void registerUser(String name) {\n        User user = new User(name);\n        repo.save(user);\n        eventBus.publish(new UserRegisteredEvent(user));\n        // Как проверить Event? Мы не создавали его в тесте!\n    }\n}' },
        { type: 'heading', value: 'Решение: ArgumentCaptor' },
        { type: 'code', language: 'java', value: '// В Mockito:\nArgumentCaptor<UserRegisteredEvent> captor =\n    ArgumentCaptor.forClass(UserRegisteredEvent.class);\n\n// Act\nservice.registerUser("John");\n\n// Захватываем аргумент\nverify(mockEventBus).publish(captor.capture());\n\n// Проверяем захваченный аргумент\nUserRegisteredEvent event = captor.getValue();\nassertEquals("John", event.getUser().getName());' },
        { type: 'heading', value: 'Множественные захваты' },
        { type: 'code', language: 'java', value: '// Если метод вызывался несколько раз:\nservice.registerUser("John");\nservice.registerUser("Jane");\n\nverify(mockEventBus, times(2)).publish(captor.capture());\n\nList<UserRegisteredEvent> events = captor.getAllValues();\nassertEquals("John", events.get(0).getUser().getName());\nassertEquals("Jane", events.get(1).getUser().getName());' },
        { type: 'tip', value: 'ArgumentCaptor незаменим, когда тестируемый код создаёт объект внутри себя и передаёт в зависимость. Без captor вы не сможете проверить этот объект.' }
      ]
    },
    {
      id: 3,
      title: 'doThrow, doReturn, doAnswer',
      type: 'theory',
      content: [
        { type: 'text', value: 'Серия do-методов — альтернативный синтаксис Mockito. Необходим для void-методов и spy.' },
        { type: 'heading', value: 'Мокирование void-методов' },
        { type: 'code', language: 'java', value: '// void-методы нельзя настроить через when:\n// when(mock.voidMethod()).thenReturn(?) // ОШИБКА!\n\n// Используем doThrow:\ndoThrow(new RuntimeException("DB error"))\n    .when(mockRepo).delete(user);\n\n// doNothing (по умолчанию для void):\ndoNothing().when(mockRepo).delete(user);\n\n// doAnswer для void:\ndoAnswer(invocation -> {\n    User u = invocation.getArgument(0);\n    System.out.println("Deleting: " + u.getName());\n    return null; // void\n}).when(mockRepo).delete(any());' },
        { type: 'heading', value: 'doReturn для Spy' },
        { type: 'code', language: 'java', value: '// Для spy ВСЕГДА используйте doReturn:\nList<String> spy = spy(new ArrayList<>());\n\n// ПЛОХО: вызовет реальный метод\n// when(spy.get(0)).thenReturn("a");\n\n// ХОРОШО: не вызывает реальный метод\ndoReturn("a").when(spy).get(0);' },
        { type: 'heading', value: 'doCallRealMethod' },
        { type: 'code', language: 'java', value: '// На моке вызвать РЕАЛЬНЫЙ метод:\ndoCallRealMethod().when(mockService).calculate(anyInt());\n// Теперь этот метод мока работает как настоящий' },
        { type: 'heading', value: 'Цепочка do-методов' },
        { type: 'code', language: 'java', value: '// Первый вызов — исключение, второй — успех:\ndoThrow(new RuntimeException("Timeout"))\n    .doNothing()\n    .when(mockService).process();\n\n// Первый вызов process() бросит исключение\n// Второй вызов process() пройдёт нормально' },
        { type: 'note', value: 'when().thenReturn() и doReturn().when() делают одно и то же для обычных моков. Разница только для void-методов и spy.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: Spy — частичный мок',
      type: 'practice',
      difficulty: 'medium',
      description: 'Симулируйте концепцию Spy: реальный объект, у которого можно переопределить отдельные методы.',
      requirements: [
        'Создайте класс EmailService с методами formatEmail и sendEmail',
        'Создайте "spy": объект, который вызывает реальный formatEmail, но мокает sendEmail',
        'sendEmail в spy должен записывать вызов вместо реальной отправки',
        'Протестируйте: formatEmail работает реально, sendEmail записывает вызовы',
        'Проверьте verify на spy-объекте'
      ],
      expectedOutput: 'PASS: testFormatEmailReal\nPASS: testSendEmailMocked\nPASS: testFullFlow\nPASS: testVerifySendCalled\nИтого: 4/4',
      hint: 'Реальный formatEmail добавляет Subject и Body. Мокнутый sendEmail просто записывает вызов в список.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Real EmailService methods ---
    static String formatEmail(String to, String subject, String body) {
        return "To: " + to + "\\nSubject: " + subject + "\\nBody: " + body;
    }

    // --- Spy: мокнутый sendEmail ---
    static List<String> sentEmails = new ArrayList<>();
    static boolean sendCalled = false;
    static int sendCallCount = 0;

    static boolean spySendEmail(String formattedEmail) {
        // Вместо реальной отправки — записываем
        sendCalled = true;
        sendCallCount++;
        sentEmails.add(formattedEmail);
        return true; // "успешно отправлено"
    }

    // --- Full flow ---
    static boolean sendNotification(String to, String subject, String body) {
        String formatted = formatEmail(to, subject, body); // реальный метод
        return spySendEmail(formatted); // мокнутый метод
    }

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
        sentEmails.clear();
        sendCalled = false;
        sendCallCount = 0;
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
        runTest("testFormatEmailReal", () -> {
            // Реальный метод работает
            String result = formatEmail(
                "user@mail.com", "Hello", "World");
            assertTrue(result.contains("To: user@mail.com"));
            assertTrue(result.contains("Subject: Hello"));
            assertTrue(result.contains("Body: World"));
        });

        runTest("testSendEmailMocked", () -> {
            // Мокнутый метод записывает вызов
            spySendEmail("test email content");
            assertEquals(1, sendCallCount);
            assertEquals("test email content", sentEmails.get(0));
        });

        runTest("testFullFlow", () -> {
            // formatEmail реальный + sendEmail мокнутый
            boolean result = sendNotification(
                "admin@mail.com", "Alert", "Server down");
            assertTrue(result);
            assertTrue(sentEmails.get(0).contains("To: admin@mail.com"));
            assertTrue(sentEmails.get(0).contains("Subject: Alert"));
        });

        runTest("testVerifySendCalled", () -> {
            sendNotification("a@mail.com", "S1", "B1");
            sendNotification("b@mail.com", "S2", "B2");
            assertEquals(2, sendCallCount);
            assertTrue(sendCalled);
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Spy = реальный объект + мокнутые методы. formatEmail работает по-настоящему (реальная логика), а sendEmail заменён на мок, который записывает вызовы. В реальном Mockito spy = spy(new EmailService()), потом doReturn(...).when(spy).sendEmail(...).'
    },
    {
      id: 5,
      title: 'Практика: ArgumentCaptor',
      type: 'practice',
      difficulty: 'hard',
      description: 'Симулируйте ArgumentCaptor: захват аргументов, переданных в мок-метод, для проверки.',
      requirements: [
        'Создайте AuditService (мок), который принимает AuditEvent (action + timestamp + userId)',
        'Создайте UserService.registerUser(name) — создаёт user и отправляет AuditEvent',
        'Реализуйте captor: захватите AuditEvent и проверьте его поля',
        'Протестируйте: action="USER_REGISTERED", userId правильный',
        'Протестируйте захват нескольких событий при регистрации 3 пользователей'
      ],
      expectedOutput: 'PASS: testAuditEventCaptured\nPASS: testAuditEventAction\nPASS: testAuditEventUserId\nPASS: testMultipleCaptures\nИтого: 4/4',
      hint: 'Создайте список capturedEvents. При вызове мока audit добавляйте событие в этот список.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- AuditEvent ---
    static class AuditEvent {
        String action;
        String userId;
        long timestamp;

        AuditEvent(String action, String userId) {
            this.action = action;
            this.userId = userId;
            this.timestamp = System.currentTimeMillis();
        }
    }

    // --- ArgumentCaptor simulation ---
    static List<AuditEvent> capturedEvents = new ArrayList<>();

    // Мок AuditService: захватывает аргументы
    static void mockLogEvent(AuditEvent event) {
        capturedEvents.add(event); // capture!
    }

    // Получить последний захваченный
    static AuditEvent getCapturedValue() {
        if (capturedEvents.isEmpty()) {
            throw new RuntimeException("Нет захваченных аргументов");
        }
        return capturedEvents.get(capturedEvents.size() - 1);
    }

    // Получить все захваченные
    static List<AuditEvent> getAllCapturedValues() {
        return new ArrayList<>(capturedEvents);
    }

    // --- UserService (тестируемый код) ---
    static int nextUserId = 1;

    static String registerUser(String name) {
        String userId = "USER-" + nextUserId++;
        // ... создание пользователя ...
        // Отправляем audit event (внутри метода!)
        mockLogEvent(new AuditEvent("USER_REGISTERED", userId));
        return userId;
    }

    static void deleteUser(String userId) {
        // ... удаление пользователя ...
        mockLogEvent(new AuditEvent("USER_DELETED", userId));
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

    static void setUp() {
        capturedEvents.clear();
        nextUserId = 1;
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
        runTest("testAuditEventCaptured", () -> {
            registerUser("John");
            // Captor захватил 1 событие
            assertEquals(1, capturedEvents.size());
        });

        runTest("testAuditEventAction", () -> {
            registerUser("Jane");
            // Проверяем захваченный аргумент
            AuditEvent captured = getCapturedValue();
            assertEquals("USER_REGISTERED", captured.action);
        });

        runTest("testAuditEventUserId", () -> {
            String userId = registerUser("Bob");
            AuditEvent captured = getCapturedValue();
            assertEquals(userId, captured.userId);
            assertEquals("USER-1", captured.userId);
        });

        runTest("testMultipleCaptures", () -> {
            registerUser("Alice");
            registerUser("Bob");
            deleteUser("USER-1");

            List<AuditEvent> all = getAllCapturedValues();
            assertEquals(3, all.size());
            assertEquals("USER_REGISTERED", all.get(0).action);
            assertEquals("USER_REGISTERED", all.get(1).action);
            assertEquals("USER_DELETED", all.get(2).action);
            assertEquals("USER-1", all.get(2).userId);
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'ArgumentCaptor — это список, который записывает аргументы при вызове мока. Мы создали capturedEvents: каждый вызов mockLogEvent добавляет AuditEvent в список. Потом проверяем: action, userId и количество. В реальном Mockito: ArgumentCaptor<AuditEvent> captor = ArgumentCaptor.forClass(...), verify(mock).log(captor.capture()), captor.getValue().'
    },
    {
      id: 6,
      title: 'Практика: Мокирование void и цепочки ответов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Симулируйте мокирование void-методов и цепочки ответов (первый вызов — ошибка, второй — успех).',
      requirements: [
        'Создайте мок DatabaseConnection с void-методом connect() и методом query(sql)',
        'Настройте connect: первый вызов — исключение, второй — успех',
        'Настройте query: возвращает разные результаты при разных вызовах',
        'Создайте DatabaseService с retry-логикой для connect',
        'Протестируйте retry-логику и цепочку ответов'
      ],
      expectedOutput: 'PASS: testConnectRetrySuccess\nPASS: testConnectCallCount\nPASS: testQueryChain\nPASS: testQueryMultipleResults\nИтого: 4/4',
      hint: 'Используйте счётчик вызовов и массив заготовленных ответов/исключений.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Mock Database ---
    static int connectCallCount = 0;
    static List<Boolean> connectBehavior = new ArrayList<>();
    // true = success, false = throw

    static int queryCallCount = 0;
    static List<String> queryResults = new ArrayList<>();

    static void mockConnect() {
        int idx = connectCallCount++;
        if (idx < connectBehavior.size() && !connectBehavior.get(idx)) {
            throw new RuntimeException("Connection refused");
        }
        // else: success (void — ничего не возвращаем)
    }

    static String mockQuery(String sql) {
        int idx = queryCallCount++;
        if (idx < queryResults.size()) {
            return queryResults.get(idx);
        }
        return "empty";
    }

    // --- Настройка мока (doThrow/doNothing chain) ---
    static void setupConnectChain(boolean... behaviors) {
        connectBehavior.clear();
        for (boolean b : behaviors) {
            connectBehavior.add(b);
        }
    }

    static void setupQueryChain(String... results) {
        queryResults.clear();
        for (String r : results) {
            queryResults.add(r);
        }
    }

    // --- DatabaseService (тестируемый код) ---
    static boolean connectWithRetry(int maxRetries) {
        for (int i = 0; i < maxRetries; i++) {
            try {
                mockConnect();
                return true; // connected!
            } catch (RuntimeException e) {
                // retry
            }
        }
        return false; // all retries failed
    }

    static List<String> executeQueries(String... sqls) {
        List<String> results = new ArrayList<>();
        for (String sql : sqls) {
            results.add(mockQuery(sql));
        }
        return results;
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

    static void setUp() {
        connectCallCount = 0;
        queryCallCount = 0;
        connectBehavior.clear();
        queryResults.clear();
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
        runTest("testConnectRetrySuccess", () -> {
            // Первый вызов — fail, второй — success
            setupConnectChain(false, true);
            boolean connected = connectWithRetry(3);
            assertTrue(connected);
        });

        runTest("testConnectCallCount", () -> {
            // fail, fail, success
            setupConnectChain(false, false, true);
            connectWithRetry(5);
            assertEquals(3, connectCallCount); // 3 попытки до успеха
        });

        runTest("testQueryChain", () -> {
            // Разные ответы на каждый вызов
            setupQueryChain("user1", "user2", "user3");
            assertEquals("user1", mockQuery("SELECT 1"));
            assertEquals("user2", mockQuery("SELECT 2"));
            assertEquals("user3", mockQuery("SELECT 3"));
        });

        runTest("testQueryMultipleResults", () -> {
            setupQueryChain("Alice", "Bob", "Charlie");
            List<String> results = executeQueries(
                "SELECT name WHERE id=1",
                "SELECT name WHERE id=2",
                "SELECT name WHERE id=3"
            );
            assertEquals(3, results.size());
            assertEquals("Alice", results.get(0));
            assertEquals("Bob", results.get(1));
            assertEquals("Charlie", results.get(2));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы симулировали цепочки ответов из Mockito: doThrow().doNothing() и thenReturn("a").thenReturn("b"). Счётчик вызовов определяет, какое поведение использовать. Паттерн retry + цепочка исключений — реальный кейс при работе с нестабильными соединениями к БД или API.'
    }
  ]
}
