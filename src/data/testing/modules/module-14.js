export default {
  id: 14,
  title: 'Практикум: Моки и интеграция',
  description: 'Практические задачи на моки, стабы и тестирование сервисного слоя: создание фейковых реализаций, проверка вызовов, интеграция компонентов',
  lessons: [
    {
      id: 1,
      title: 'Фейковый репозиторий',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте UserService, который зависит от UserRepository (интерфейс). Напишите фейковую реализацию репозитория (in-memory) и протестируйте сервис.',
      requirements: [
        'Определите интерфейс UserRepository: save, findById, findAll, delete',
        'Создайте FakeUserRepository — хранит данные в HashMap',
        'Создайте UserService с методами: createUser, getUser, getAllUsers, deleteUser',
        'UserService использует UserRepository через конструктор (DI)',
        'Протестируйте UserService с FakeUserRepository',
        'Минимум 6 тестов: CRUD + поведение при отсутствии пользователя'
      ],
      expectedOutput: 'PASS: testCreateUser\nPASS: testGetUser\nPASS: testGetUserNotFound\nPASS: testGetAllUsers\nPASS: testDeleteUser\nPASS: testDeleteNonExistent\nИтого: 6/6',
      hint: 'FakeUserRepository — полноценная in-memory реализация с HashMap<Integer, String[]>. UserService делегирует все операции репозиторию, но может добавлять бизнес-логику (валидацию).',
      solution: `import java.util.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- "Интерфейс" Repository (через методы) ---
    // Фейковый репозиторий (in-memory)
    static Map<Integer, String[]> db; // id -> [name, email]
    static int nextId;

    static void initRepo() {
        db = new HashMap<>();
        nextId = 1;
    }

    static int repoSave(String name, String email) {
        int id = nextId++;
        db.put(id, new String[]{name, email});
        return id;
    }

    static String[] repoFindById(int id) {
        return db.get(id);
    }

    static List<String[]> repoFindAll() {
        return new ArrayList<>(db.values());
    }

    static boolean repoDelete(int id) {
        return db.remove(id) != null;
    }

    // --- UserService ---
    static int createUser(String name, String email) {
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Имя не может быть пустым");
        }
        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Некорректный email");
        }
        return repoSave(name, email);
    }

    static String[] getUser(int id) {
        String[] user = repoFindById(id);
        if (user == null) {
            throw new RuntimeException("Пользователь не найден: " + id);
        }
        return user;
    }

    static List<String[]> getAllUsers() {
        return repoFindAll();
    }

    static boolean deleteUser(int id) {
        return repoDelete(id);
    }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (!Objects.equals(expected, actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Ожидали true");
    }

    static void assertFalse(boolean c) {
        if (c) throw new RuntimeException("Ожидали false");
    }

    static void assertThrows(Runnable code) {
        try {
            code.run();
            throw new RuntimeException("Ожидали исключение");
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Ожидали исключение")) throw e;
        }
    }

    static void runTest(String name, Runnable test) {
        total++;
        initRepo(); // setUp — чистый репозиторий для каждого теста
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testCreateUser", () -> {
            // Act
            int id = createUser("John", "john@mail.com");
            // Assert
            assertTrue(id > 0);
            String[] user = repoFindById(id);
            assertEquals("John", user[0]);
            assertEquals("john@mail.com", user[1]);
        });

        runTest("testGetUser", () -> {
            // Arrange
            int id = createUser("Jane", "jane@mail.com");
            // Act
            String[] user = getUser(id);
            // Assert
            assertEquals("Jane", user[0]);
        });

        runTest("testGetUserNotFound", () -> {
            assertThrows(() -> getUser(999));
        });

        runTest("testGetAllUsers", () -> {
            createUser("Alice", "alice@mail.com");
            createUser("Bob", "bob@mail.com");
            List<String[]> users = getAllUsers();
            assertEquals(2, users.size());
        });

        runTest("testDeleteUser", () -> {
            int id = createUser("John", "john@mail.com");
            assertTrue(deleteUser(id));
            // Проверяем, что пользователь удалён
            assertThrows(() -> getUser(id));
        });

        runTest("testDeleteNonExistent", () -> {
            assertFalse(deleteUser(999));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Фейковый репозиторий (Fake) — полноценная in-memory реализация интерфейса. В отличие от мока, Fake содержит рабочую логику, но хранит данные в памяти вместо базы данных. UserService не знает, что работает с фейком — это принцип подстановки Лисков (DI). initRepo() вызывается перед каждым тестом, обеспечивая независимость.'
    },
    {
      id: 2,
      title: 'Верификация вызовов (Spy)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Spy-обёртку, которая записывает все вызовы методов. Проверьте, что сервис вызывает репозиторий правильное количество раз с правильными аргументами.',
      requirements: [
        'Создайте SpyRepository — записывает каждый вызов: имя метода + аргументы',
        'Реализуйте verify: проверка, что метод был вызван N раз',
        'Реализуйте verifyArgs: проверка аргументов последнего вызова',
        'Протестируйте: createUser вызывает save один раз',
        'Протестируйте: deleteUser вызывает delete с правильным id',
        'Протестируйте: getAllUsers вызывает findAll, а не findById'
      ],
      expectedOutput: 'PASS: testCreateCallsSave\nPASS: testCreateCallsSaveWithCorrectArgs\nPASS: testDeleteCallsDelete\nPASS: testGetAllCallsFindAll\nPASS: testNoUnexpectedCalls\nPASS: testMultipleCallsTracked\nИтого: 6/6',
      hint: 'SpyRepository хранит List<String> вызовов. При каждом вызове метода добавляйте запись: "save:John:john@mail.com". verify() считает вхождения.',
      solution: `import java.util.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Spy: записывает все вызовы ---
    static List<String> calls;
    static Map<Integer, String[]> spyDb;
    static int spyNextId;

    static void initSpy() {
        calls = new ArrayList<>();
        spyDb = new HashMap<>();
        spyNextId = 1;
    }

    // --- Spy Repository методы ---
    static int spySave(String name, String email) {
        calls.add("save:" + name + ":" + email);
        int id = spyNextId++;
        spyDb.put(id, new String[]{name, email});
        return id;
    }

    static String[] spyFindById(int id) {
        calls.add("findById:" + id);
        return spyDb.get(id);
    }

    static List<String[]> spyFindAll() {
        calls.add("findAll");
        return new ArrayList<>(spyDb.values());
    }

    static boolean spyDelete(int id) {
        calls.add("delete:" + id);
        return spyDb.remove(id) != null;
    }

    // --- Verify хелперы ---
    static int countCalls(String methodName) {
        int count = 0;
        for (String call : calls) {
            if (call.startsWith(methodName + ":") || call.equals(methodName)) {
                count++;
            }
        }
        return count;
    }

    static String getLastCallFor(String methodName) {
        for (int i = calls.size() - 1; i >= 0; i--) {
            if (calls.get(i).startsWith(methodName + ":") ||
                calls.get(i).equals(methodName)) {
                return calls.get(i);
            }
        }
        return null;
    }

    // --- Сервис (использует spy) ---
    static int svcCreateUser(String name, String email) {
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Имя пустое");
        }
        return spySave(name, email);
    }

    static boolean svcDeleteUser(int id) {
        return spyDelete(id);
    }

    static List<String[]> svcGetAllUsers() {
        return spyFindAll();
    }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (!Objects.equals(expected, actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Ожидали true");
    }

    static void runTest(String name, Runnable test) {
        total++;
        initSpy();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testCreateCallsSave", () -> {
            svcCreateUser("John", "john@mail.com");
            // Verify: save вызван ровно 1 раз
            assertEquals(1, countCalls("save"));
        });

        runTest("testCreateCallsSaveWithCorrectArgs", () -> {
            svcCreateUser("Jane", "jane@mail.com");
            // Verify: save вызван с правильными аргументами
            String lastCall = getLastCallFor("save");
            assertEquals("save:Jane:jane@mail.com", lastCall);
        });

        runTest("testDeleteCallsDelete", () -> {
            int id = spySave("John", "john@mail.com");
            calls.clear(); // Сбрасываем историю
            svcDeleteUser(id);
            // Verify: delete вызван с правильным id
            assertEquals(1, countCalls("delete"));
            assertEquals("delete:" + id, getLastCallFor("delete"));
        });

        runTest("testGetAllCallsFindAll", () -> {
            svcGetAllUsers();
            // Verify: findAll вызван, findById — НЕ вызван
            assertEquals(1, countCalls("findAll"));
            assertEquals(0, countCalls("findById"));
        });

        runTest("testNoUnexpectedCalls", () -> {
            svcCreateUser("Alice", "alice@mail.com");
            // Verify: только save был вызван
            assertEquals(1, calls.size());
            assertTrue(calls.get(0).startsWith("save"));
        });

        runTest("testMultipleCallsTracked", () -> {
            svcCreateUser("A", "a@mail.com");
            svcCreateUser("B", "b@mail.com");
            svcCreateUser("C", "c@mail.com");
            // Verify: save вызван 3 раза
            assertEquals(3, countCalls("save"));
            assertEquals(3, calls.size());
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Spy — это обёртка, которая записывает все вызовы (название метода + аргументы). В Mockito это verify(mock).save(any()). Мы реализовали это вручную: calls хранит историю, countCalls проверяет количество, getLastCallFor проверяет аргументы. Spy позволяет тестировать ПОВЕДЕНИЕ, а не только результат.'
    },
    {
      id: 3,
      title: 'Stub: управление ответами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Stub-репозиторий, который возвращает заранее настроенные ответы. Протестируйте поведение сервиса при разных ответах от зависимости.',
      requirements: [
        'Создайте StubRepository — возвращает заранее заданные значения',
        'Реализуйте whenFindById(id, result) — настраивает ответ для findById',
        'Реализуйте whenFindAllReturn(list) — настраивает ответ для findAll',
        'Протестируйте: сервис корректно обрабатывает null от репозитория',
        'Протестируйте: сервис обрабатывает пустой список от findAll',
        'Протестируйте: сервис работает с предустановленными данными'
      ],
      expectedOutput: 'PASS: testServiceWithStubData\nPASS: testServiceWhenUserNotFound\nPASS: testServiceWithEmptyList\nPASS: testServiceWithMultipleUsers\nPASS: testStubOverride\nPASS: testServiceErrorHandling\nИтого: 6/6',
      hint: 'Stub использует Map для маппинга id -> ответ. when(id, result) добавляет маппинг. findById возвращает значение из Map или null.',
      solution: `import java.util.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Stub Repository ---
    static Map<Integer, String[]> stubResponses;
    static List<String[]> stubFindAllResponse;
    static boolean stubShouldThrow;

    static void initStub() {
        stubResponses = new HashMap<>();
        stubFindAllResponse = new ArrayList<>();
        stubShouldThrow = false;
    }

    // Настройка стаба
    static void whenFindById(int id, String name, String email) {
        stubResponses.put(id, new String[]{name, email});
    }

    static void whenFindAllReturn(List<String[]> users) {
        stubFindAllResponse = users;
    }

    static void whenThrowOnSave() {
        stubShouldThrow = true;
    }

    // Stub-методы
    static String[] stubFindById(int id) {
        return stubResponses.get(id); // null если не настроено
    }

    static List<String[]> stubFindAll() {
        return stubFindAllResponse;
    }

    static int stubSave(String name, String email) {
        if (stubShouldThrow) {
            throw new RuntimeException("Database error");
        }
        return 1;
    }

    // --- Сервис ---
    static String getUserName(int id) {
        String[] user = stubFindById(id);
        if (user == null) return "Неизвестный";
        return user[0];
    }

    static int getUserCount() {
        return stubFindAll().size();
    }

    static List<String> getAllUserNames() {
        List<String> names = new ArrayList<>();
        for (String[] user : stubFindAll()) {
            names.add(user[0]);
        }
        return names;
    }

    static String createUserSafely(String name, String email) {
        try {
            int id = stubSave(name, email);
            return "OK:" + id;
        } catch (Exception e) {
            return "ERROR:" + e.getMessage();
        }
    }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (!Objects.equals(expected, actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Ожидали true");
    }

    static void runTest(String name, Runnable test) {
        total++;
        initStub();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testServiceWithStubData", () -> {
            // Arrange: настраиваем стаб
            whenFindById(1, "John", "john@mail.com");
            // Act
            String name = getUserName(1);
            // Assert
            assertEquals("John", name);
        });

        runTest("testServiceWhenUserNotFound", () -> {
            // Стаб не настроен для id=99 -> вернёт null
            String name = getUserName(99);
            assertEquals("Неизвестный", name);
        });

        runTest("testServiceWithEmptyList", () -> {
            whenFindAllReturn(new ArrayList<>());
            assertEquals(0, getUserCount());
            assertTrue(getAllUserNames().isEmpty());
        });

        runTest("testServiceWithMultipleUsers", () -> {
            List<String[]> users = new ArrayList<>();
            users.add(new String[]{"Alice", "alice@mail.com"});
            users.add(new String[]{"Bob", "bob@mail.com"});
            users.add(new String[]{"Charlie", "c@mail.com"});
            whenFindAllReturn(users);

            assertEquals(3, getUserCount());
            List<String> names = getAllUserNames();
            assertEquals("Alice", names.get(0));
            assertEquals("Bob", names.get(1));
            assertEquals("Charlie", names.get(2));
        });

        runTest("testStubOverride", () -> {
            whenFindById(1, "John", "john@mail.com");
            assertEquals("John", getUserName(1));
            // Перенастраиваем стаб
            whenFindById(1, "Jane", "jane@mail.com");
            assertEquals("Jane", getUserName(1));
        });

        runTest("testServiceErrorHandling", () -> {
            whenThrowOnSave();
            String result = createUserSafely("John", "john@mail.com");
            assertEquals("ERROR:Database error", result);
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Stub — это объект с заранее настроенными ответами. В Mockito: when(repo.findById(1)).thenReturn(user). Мы реализовали это вручную через Map: whenFindById(1, "John", ...) настраивает ответ. Стаб позволяет тестировать сервис изолированно: мы контролируем ВСЕ ответы зависимости. Тест testServiceErrorHandling показывает тестирование обработки ошибок — стаб бросает исключение.'
    },
    {
      id: 4,
      title: 'Тестирование сервиса уведомлений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте NotificationService с email и SMS каналами. Используйте фейковые реализации каналов для тестирования логики маршрутизации уведомлений.',
      requirements: [
        'NotificationService принимает тип уведомления (EMAIL/SMS) и сообщение',
        'Создайте FakeEmailSender и FakeSmsSender — записывают отправленные сообщения',
        'Протестируйте: EMAIL уведомление идёт через email-канал',
        'Протестируйте: SMS уведомление идёт через SMS-канал',
        'Протестируйте: невалидный тип бросает исключение',
        'Проверьте, что сообщение доставлено корректно (текст, получатель)'
      ],
      expectedOutput: 'PASS: testSendEmail\nPASS: testSendSms\nPASS: testInvalidChannel\nPASS: testEmailContent\nPASS: testSmsContent\nPASS: testMultipleNotifications\nPASS: testEmptyMessage\nИтого: 7/7',
      hint: 'Каждый канал хранит List<String[]> отправленных сообщений. После вызова sendNotification проверяйте, что сообщение попало в правильный канал.',
      solution: `import java.util.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Fake каналы ---
    static List<String[]> emailsSent; // [to, message]
    static List<String[]> smsSent;    // [phone, message]

    static void initChannels() {
        emailsSent = new ArrayList<>();
        smsSent = new ArrayList<>();
    }

    static void fakeEmailSend(String to, String message) {
        emailsSent.add(new String[]{to, message});
    }

    static void fakeSmsSend(String phone, String message) {
        smsSent.add(new String[]{phone, message});
    }

    // --- NotificationService ---
    static void sendNotification(String channel, String recipient,
                                  String message) {
        if (message == null || message.isEmpty()) {
            throw new IllegalArgumentException("Сообщение не может быть пустым");
        }
        switch (channel.toUpperCase()) {
            case "EMAIL":
                fakeEmailSend(recipient, message);
                break;
            case "SMS":
                fakeSmsSend(recipient, message);
                break;
            default:
                throw new IllegalArgumentException(
                    "Неизвестный канал: " + channel);
        }
    }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (!Objects.equals(expected, actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Ожидали true");
    }

    static void assertThrows(Runnable code) {
        try {
            code.run();
            throw new RuntimeException("Ожидали исключение");
        } catch (IllegalArgumentException e) {
            // OK
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Ожидали исключение")) throw e;
        }
    }

    static void runTest(String name, Runnable test) {
        total++;
        initChannels();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testSendEmail", () -> {
            sendNotification("EMAIL", "user@mail.com", "Привет");
            assertEquals(1, emailsSent.size());
            assertEquals(0, smsSent.size()); // SMS не вызван
        });

        runTest("testSendSms", () -> {
            sendNotification("SMS", "+77001234567", "Код: 1234");
            assertEquals(0, emailsSent.size()); // Email не вызван
            assertEquals(1, smsSent.size());
        });

        runTest("testInvalidChannel", () -> {
            assertThrows(() ->
                sendNotification("TELEGRAM", "user", "test"));
        });

        runTest("testEmailContent", () -> {
            sendNotification("EMAIL", "admin@site.com", "Отчёт готов");
            String[] email = emailsSent.get(0);
            assertEquals("admin@site.com", email[0]);
            assertEquals("Отчёт готов", email[1]);
        });

        runTest("testSmsContent", () -> {
            sendNotification("SMS", "+77005551234", "Ваш код: 9876");
            String[] sms = smsSent.get(0);
            assertEquals("+77005551234", sms[0]);
            assertEquals("Ваш код: 9876", sms[1]);
        });

        runTest("testMultipleNotifications", () -> {
            sendNotification("EMAIL", "a@mail.com", "Сообщение 1");
            sendNotification("EMAIL", "b@mail.com", "Сообщение 2");
            sendNotification("SMS", "+77001111111", "SMS 1");
            assertEquals(2, emailsSent.size());
            assertEquals(1, smsSent.size());
        });

        runTest("testEmptyMessage", () -> {
            assertThrows(() ->
                sendNotification("EMAIL", "user@mail.com", ""));
            assertThrows(() ->
                sendNotification("SMS", "+77001234567", null));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'NotificationService маршрутизирует уведомления по каналам. Фейковые каналы (FakeEmailSender, FakeSmsSender) записывают сообщения в списки вместо реальной отправки. Мы проверяем: правильный канал получает сообщение, другой канал не задействован, содержимое сообщения корректно. Это аналог Mockito verify + argument captor.'
    },
    {
      id: 5,
      title: 'Тестирование кеша',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте CacheService, который кеширует результаты из медленного DataSource. Протестируйте: попадание в кеш, промах, инвалидация.',
      requirements: [
        'CacheService хранит данные в Map (кеш) и обращается к DataSource при промахе',
        'Создайте FakeDataSource — считает количество вызовов',
        'При попадании в кеш DataSource НЕ вызывается',
        'При промахе DataSource вызывается и результат кешируется',
        'Реализуйте invalidate(key) — удаляет ключ из кеша',
        'Протестируйте: повторный запрос использует кеш, а не DataSource'
      ],
      expectedOutput: 'PASS: testCacheMiss\nPASS: testCacheHit\nPASS: testInvalidate\nPASS: testDifferentKeys\nPASS: testDataSourceCallCount\nPASS: testInvalidateAndRefetch\nИтого: 6/6',
      hint: 'FakeDataSource хранит счётчик вызовов. Первый get — промах (вызывает DataSource). Второй get того же ключа — попадание (DataSource не вызывается). После invalidate — снова промах.',
      solution: `import java.util.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Fake DataSource ---
    static Map<String, String> dataSourceData;
    static int dataSourceCallCount;

    static String dataSourceGet(String key) {
        dataSourceCallCount++;
        return dataSourceData.get(key);
    }

    // --- Cache Service ---
    static Map<String, String> cache;

    static void initAll() {
        dataSourceData = new HashMap<>();
        dataSourceCallCount = 0;
        cache = new HashMap<>();
    }

    static String cacheGet(String key) {
        // Попадание в кеш
        if (cache.containsKey(key)) {
            return cache.get(key);
        }
        // Промах — идём в DataSource
        String value = dataSourceGet(key);
        if (value != null) {
            cache.put(key, value);
        }
        return value;
    }

    static void cacheInvalidate(String key) {
        cache.remove(key);
    }

    static void cacheClear() {
        cache.clear();
    }

    static int cacheSize() {
        return cache.size();
    }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (!Objects.equals(expected, actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertNull(Object obj) {
        if (obj != null) throw new RuntimeException(
            "Ожидали null, получили [" + obj + "]");
    }

    static void runTest(String name, Runnable test) {
        total++;
        initAll();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testCacheMiss", () -> {
            dataSourceData.put("user:1", "John");
            // Первый запрос — промах, идёт в DataSource
            String result = cacheGet("user:1");
            assertEquals("John", result);
            assertEquals(1, dataSourceCallCount);
        });

        runTest("testCacheHit", () -> {
            dataSourceData.put("user:1", "John");
            cacheGet("user:1"); // промах
            // Второй запрос — попадание в кеш
            String result = cacheGet("user:1");
            assertEquals("John", result);
            assertEquals(1, dataSourceCallCount); // DataSource вызван только 1 раз!
        });

        runTest("testInvalidate", () -> {
            dataSourceData.put("user:1", "John");
            cacheGet("user:1"); // кешируем
            assertEquals(1, cacheSize());
            cacheInvalidate("user:1");
            assertEquals(0, cacheSize());
        });

        runTest("testDifferentKeys", () -> {
            dataSourceData.put("user:1", "John");
            dataSourceData.put("user:2", "Jane");
            cacheGet("user:1");
            cacheGet("user:2");
            assertEquals(2, dataSourceCallCount);
            assertEquals(2, cacheSize());
        });

        runTest("testDataSourceCallCount", () -> {
            dataSourceData.put("config", "value");
            // 5 запросов одного ключа
            cacheGet("config");
            cacheGet("config");
            cacheGet("config");
            cacheGet("config");
            cacheGet("config");
            // DataSource вызван ТОЛЬКО 1 раз
            assertEquals(1, dataSourceCallCount);
        });

        runTest("testInvalidateAndRefetch", () -> {
            dataSourceData.put("price", "100");
            cacheGet("price"); // промах -> DataSource
            assertEquals(1, dataSourceCallCount);

            // Обновляем данные в DataSource
            dataSourceData.put("price", "200");
            // Кеш всё ещё хранит старое значение
            assertEquals("100", cacheGet("price"));
            assertEquals(1, dataSourceCallCount);

            // Инвалидируем кеш
            cacheInvalidate("price");
            // Теперь получим новое значение
            String result = cacheGet("price");
            assertEquals("200", result);
            assertEquals(2, dataSourceCallCount);
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Кеш — отличный пример для тестирования моков. Мы проверяем поведение: при промахе DataSource вызывается и результат сохраняется. При попадании DataSource НЕ вызывается — это ключевой тест (dataSourceCallCount не увеличивается). Инвалидация удаляет значение из кеша, следующий запрос снова идёт в DataSource. Счётчик вызовов — простейший аналог verify(dataSource, times(1)).'
    },
    {
      id: 6,
      title: 'Тестирование цепочки обработчиков',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте паттерн Chain of Responsibility для обработки заказов. Протестируйте, что каждый обработчик вызывается в правильном порядке.',
      requirements: [
        'Цепочка: Validator -> DiscountApplier -> TaxCalculator -> OrderFinalizer',
        'Каждый обработчик записывает свой вызов в лог (spy)',
        'Validator отклоняет заказы с totalPrice <= 0',
        'DiscountApplier применяет скидку 10% для заказов > 1000',
        'TaxCalculator добавляет 12% НДС',
        'Протестируйте: порядок вызовов, корректность вычислений, отклонение заказа'
      ],
      expectedOutput: 'PASS: testFullChain\nPASS: testChainOrder\nPASS: testValidatorRejects\nPASS: testDiscountApplied\nPASS: testNoDiscount\nPASS: testTaxCalculation\nПASS: testFinalPrice\nИтого: 7/7',
      hint: 'Каждый обработчик — метод, который модифицирует заказ и добавляет запись в лог. processOrder вызывает обработчики последовательно. Если Validator отклонил — остальные не вызываются.',
      solution: `import java.util.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Order ---
    static double orderPrice;
    static String orderStatus;
    static List<String> processingLog;

    static void initOrder(double price) {
        orderPrice = price;
        orderStatus = "NEW";
        processingLog = new ArrayList<>();
    }

    // --- Обработчики ---
    static boolean validate() {
        processingLog.add("VALIDATE");
        if (orderPrice <= 0) {
            orderStatus = "REJECTED";
            return false;
        }
        orderStatus = "VALIDATED";
        return true;
    }

    static void applyDiscount() {
        processingLog.add("DISCOUNT");
        if (orderPrice > 1000) {
            orderPrice = orderPrice * 0.9; // скидка 10%
        }
    }

    static void calculateTax() {
        processingLog.add("TAX");
        orderPrice = orderPrice * 1.12; // НДС 12%
    }

    static void finalizeOrder() {
        processingLog.add("FINALIZE");
        orderStatus = "COMPLETED";
        orderPrice = Math.round(orderPrice * 100.0) / 100.0;
    }

    // --- Цепочка ---
    static void processOrder(double price) {
        initOrder(price);
        if (!validate()) return; // Отклонён — прерываем
        applyDiscount();
        calculateTax();
        finalizeOrder();
    }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (!Objects.equals(expected, actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertDoubleEquals(double expected, double actual) {
        if (Math.abs(expected - actual) > 0.01) {
            throw new RuntimeException(
                "Ожидали " + expected + ", получили " + actual);
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Ожидали true");
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
        runTest("testFullChain", () -> {
            processOrder(500);
            assertEquals("COMPLETED", orderStatus);
            assertEquals(4, processingLog.size());
        });

        runTest("testChainOrder", () -> {
            processOrder(500);
            assertEquals("VALIDATE", processingLog.get(0));
            assertEquals("DISCOUNT", processingLog.get(1));
            assertEquals("TAX", processingLog.get(2));
            assertEquals("FINALIZE", processingLog.get(3));
        });

        runTest("testValidatorRejects", () -> {
            processOrder(-100);
            assertEquals("REJECTED", orderStatus);
            assertEquals(1, processingLog.size()); // Только VALIDATE
            assertEquals("VALIDATE", processingLog.get(0));
        });

        runTest("testDiscountApplied", () -> {
            processOrder(2000);
            // 2000 * 0.9 = 1800 (скидка 10%)
            // 1800 * 1.12 = 2016 (НДС)
            assertDoubleEquals(2016.0, orderPrice);
        });

        runTest("testNoDiscount", () -> {
            processOrder(500);
            // 500 * 1.12 = 560 (без скидки, только НДС)
            assertDoubleEquals(560.0, orderPrice);
        });

        runTest("testTaxCalculation", () -> {
            processOrder(100);
            // 100 * 1.12 = 112
            assertDoubleEquals(112.0, orderPrice);
        });

        runTest("testFinalPrice", () -> {
            processOrder(1500);
            // 1500 * 0.9 = 1350 (скидка)
            // 1350 * 1.12 = 1512.0 (НДС)
            assertDoubleEquals(1512.0, orderPrice);
            assertEquals("COMPLETED", orderStatus);
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Цепочка обработчиков — реальный паттерн из production-кода (middleware, фильтры). processingLog — spy, записывающий порядок вызовов. Мы проверяем: полный проход цепочки, правильный порядок, прерывание при отклонении (validate вернул false — остальные не вызваны), корректность вычислений на каждом этапе. Это комбинация spy + интеграционного теста.'
    },
    {
      id: 7,
      title: 'Мок с состоянием: конечный автомат',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте OrderStateMachine с переходами между состояниями. Протестируйте допустимые и недопустимые переходы.',
      requirements: [
        'Состояния: NEW -> CONFIRMED -> PAID -> SHIPPED -> DELIVERED',
        'Допустимые переходы: NEW->CONFIRMED, CONFIRMED->PAID, PAID->SHIPPED, SHIPPED->DELIVERED',
        'Отмена: NEW->CANCELLED, CONFIRMED->CANCELLED',
        'Недопустимый переход бросает IllegalStateException',
        'Каждый переход записывает историю переходов',
        'Протестируйте: полный цикл, отмену, недопустимые переходы'
      ],
      expectedOutput: 'PASS: testFullLifecycle\nPASS: testCancelFromNew\nPASS: testCancelFromConfirmed\nPASS: testInvalidTransition\nPASS: testCannotShipUnpaid\nPASS: testTransitionHistory\nPASS: testCannotCancelAfterPaid\nИтого: 7/7',
      hint: 'Храните текущее состояние как String. Для каждого перехода проверяйте, допустим ли он из текущего состояния. История — List<String> переходов.',
      solution: `import java.util.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- State Machine ---
    static String currentState;
    static List<String> history;
    static Map<String, Set<String>> transitions;

    static void initStateMachine() {
        currentState = "NEW";
        history = new ArrayList<>();
        history.add("NEW");

        transitions = new HashMap<>();
        transitions.put("NEW", new HashSet<>(Arrays.asList("CONFIRMED", "CANCELLED")));
        transitions.put("CONFIRMED", new HashSet<>(Arrays.asList("PAID", "CANCELLED")));
        transitions.put("PAID", new HashSet<>(Arrays.asList("SHIPPED")));
        transitions.put("SHIPPED", new HashSet<>(Arrays.asList("DELIVERED")));
        transitions.put("DELIVERED", new HashSet<>());
        transitions.put("CANCELLED", new HashSet<>());
    }

    static void transition(String newState) {
        Set<String> allowed = transitions.get(currentState);
        if (allowed == null || !allowed.contains(newState)) {
            throw new IllegalStateException(
                "Переход " + currentState + " -> " + newState + " невозможен");
        }
        currentState = newState;
        history.add(newState);
    }

    static void confirm() { transition("CONFIRMED"); }
    static void pay() { transition("PAID"); }
    static void ship() { transition("SHIPPED"); }
    static void deliver() { transition("DELIVERED"); }
    static void cancel() { transition("CANCELLED"); }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (!Objects.equals(expected, actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertThrows(Runnable code) {
        try {
            code.run();
            throw new RuntimeException("Ожидали исключение");
        } catch (IllegalStateException e) {
            // OK
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Ожидали исключение")) throw e;
        }
    }

    static void runTest(String name, Runnable test) {
        total++;
        initStateMachine();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testFullLifecycle", () -> {
            confirm();
            pay();
            ship();
            deliver();
            assertEquals("DELIVERED", currentState);
        });

        runTest("testCancelFromNew", () -> {
            cancel();
            assertEquals("CANCELLED", currentState);
        });

        runTest("testCancelFromConfirmed", () -> {
            confirm();
            cancel();
            assertEquals("CANCELLED", currentState);
        });

        runTest("testInvalidTransition", () -> {
            // Нельзя оплатить без подтверждения
            assertThrows(() -> pay());
        });

        runTest("testCannotShipUnpaid", () -> {
            confirm();
            // Нельзя отправить без оплаты
            assertThrows(() -> ship());
        });

        runTest("testTransitionHistory", () -> {
            confirm();
            pay();
            ship();
            assertEquals(4, history.size());
            assertEquals("NEW", history.get(0));
            assertEquals("CONFIRMED", history.get(1));
            assertEquals("PAID", history.get(2));
            assertEquals("SHIPPED", history.get(3));
        });

        runTest("testCannotCancelAfterPaid", () -> {
            confirm();
            pay();
            assertThrows(() -> cancel());
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Конечный автомат (State Machine) — паттерн для моделирования жизненного цикла объекта. transitions хранит допустимые переходы для каждого состояния. Тесты проверяют: полный цикл (happy path), отмену на разных этапах, недопустимые переходы (IllegalStateException). history — spy-лог, записывающий все переходы для верификации.'
    },
    {
      id: 8,
      title: 'Тестирование с моком времени',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте систему подписок с проверкой срока действия. Используйте фейковые часы (mock clock) для тестирования без зависимости от реального времени.',
      requirements: [
        'Создайте FakeClock — возвращает настраиваемое текущее время (дни)',
        'Subscription хранит: userId, plan, startDay, durationDays',
        'isActive() — проверяет, что подписка не истекла (по FakeClock)',
        'daysRemaining() — сколько дней осталось',
        'Протестируйте: активная подписка, истекшая, на границе, продление',
        'FakeClock.advanceDays(n) — перемотка времени для тестов'
      ],
      expectedOutput: 'PASS: testActiveSubscription\nPASS: testExpiredSubscription\nPASS: testExpirationBoundary\nPASS: testDaysRemaining\nPASS: testAdvanceTime\nPASS: testRenewSubscription\nИтого: 6/6',
      hint: 'FakeClock хранит currentDay как int. advanceDays прибавляет к нему. isActive: currentDay < startDay + durationDays. Это классический пример подмены системного времени в тестах.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Fake Clock ---
    static int currentDay;

    static void initClock(int day) { currentDay = day; }
    static void advanceDays(int days) { currentDay += days; }
    static int now() { return currentDay; }

    // --- Subscription ---
    static String subUserId;
    static String subPlan;
    static int subStartDay;
    static int subDuration;

    static void createSubscription(String userId, String plan,
                                    int startDay, int durationDays) {
        subUserId = userId;
        subPlan = plan;
        subStartDay = startDay;
        subDuration = durationDays;
    }

    static boolean isActive() {
        return now() < subStartDay + subDuration;
    }

    static int daysRemaining() {
        int remaining = (subStartDay + subDuration) - now();
        return Math.max(0, remaining);
    }

    static void renew(int additionalDays) {
        if (isActive()) {
            subDuration += additionalDays;
        } else {
            subStartDay = now();
            subDuration = additionalDays;
        }
    }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Ожидали true");
    }

    static void assertFalse(boolean c) {
        if (c) throw new RuntimeException("Ожидали false");
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
        runTest("testActiveSubscription", () -> {
            initClock(1);
            createSubscription("user1", "PREMIUM", 1, 30);
            assertTrue(isActive());
        });

        runTest("testExpiredSubscription", () -> {
            initClock(1);
            createSubscription("user1", "BASIC", 1, 30);
            advanceDays(31); // Перемотка: день 32
            assertFalse(isActive());
        });

        runTest("testExpirationBoundary", () -> {
            initClock(1);
            createSubscription("user1", "PREMIUM", 1, 30);
            advanceDays(29); // День 30 — последний день
            assertTrue(isActive());
            advanceDays(1); // День 31 — уже истекла
            assertFalse(isActive());
        });

        runTest("testDaysRemaining", () -> {
            initClock(1);
            createSubscription("user1", "PREMIUM", 1, 30);
            assertEquals(30, daysRemaining());
            advanceDays(10);
            assertEquals(20, daysRemaining());
            advanceDays(25);
            assertEquals(0, daysRemaining()); // Истекла
        });

        runTest("testAdvanceTime", () -> {
            initClock(100);
            createSubscription("user1", "BASIC", 100, 7);
            assertTrue(isActive());
            advanceDays(3);
            assertEquals(4, daysRemaining());
            advanceDays(4);
            assertFalse(isActive());
        });

        runTest("testRenewSubscription", () -> {
            initClock(1);
            createSubscription("user1", "PREMIUM", 1, 30);
            advanceDays(20); // 10 дней осталось
            renew(30); // Продлить на 30 дней
            assertEquals(40, daysRemaining()); // 10 + 30

            // Продление после истечения
            advanceDays(50); // Истекла
            assertFalse(isActive());
            renew(14); // Новая подписка
            assertTrue(isActive());
            assertEquals(14, daysRemaining());
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'FakeClock — классический мок для тестирования времени. В production-коде используется Clock.systemUTC(), в тестах — фиксированный Clock. advanceDays() позволяет "перематывать" время без ожидания. Мы тестируем: активность подписки, истечение, граничный случай (последний день vs первый день после), продление. Без FakeClock такие тесты были бы невозможны без Thread.sleep().'
    },
    {
      id: 9,
      title: 'Интеграционный тест: сервис заказов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте полный сервис заказов с ProductCatalog, InventoryService и PaymentService. Протестируйте интеграцию всех компонентов с фейковыми реализациями.',
      requirements: [
        'ProductCatalog — хранит товары (id, name, price)',
        'InventoryService — следит за остатками (id -> quantity)',
        'PaymentService — обрабатывает оплату (баланс пользователя)',
        'OrderService.placeOrder(userId, productId, qty) — создаёт заказ',
        'Проверьте: товар существует, достаточно на складе, достаточно средств',
        'При успешном заказе: остаток уменьшается, баланс уменьшается'
      ],
      expectedOutput: 'PASS: testSuccessfulOrder\nPASS: testProductNotFound\nPASS: testInsufficientStock\nPASS: testInsufficientFunds\nPASS: testStockDecreased\nPASS: testBalanceDecreased\nPASS: testMultipleOrders\nИтого: 7/7',
      hint: 'Каждый сервис — отдельная группа static-методов с собственным хранилищем. OrderService координирует: проверяет товар -> проверяет остаток -> списывает деньги -> уменьшает остаток.',
      solution: `import java.util.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Product Catalog ---
    static Map<Integer, String[]> products; // id -> [name, price]

    static void addProduct(int id, String name, double price) {
        products.put(id, new String[]{name, String.valueOf(price)});
    }

    static String[] findProduct(int id) {
        return products.get(id);
    }

    // --- Inventory Service ---
    static Map<Integer, Integer> inventory; // productId -> quantity

    static void setStock(int productId, int qty) {
        inventory.put(productId, qty);
    }

    static int getStock(int productId) {
        return inventory.getOrDefault(productId, 0);
    }

    static void decreaseStock(int productId, int qty) {
        inventory.put(productId, getStock(productId) - qty);
    }

    // --- Payment Service ---
    static Map<String, Double> balances; // userId -> balance

    static void setBalance(String userId, double amount) {
        balances.put(userId, amount);
    }

    static double getBalance(String userId) {
        return balances.getOrDefault(userId, 0.0);
    }

    static void charge(String userId, double amount) {
        balances.put(userId, getBalance(userId) - amount);
    }

    // --- Order Service ---
    static String placeOrder(String userId, int productId, int qty) {
        // 1. Проверяем товар
        String[] product = findProduct(productId);
        if (product == null) {
            return "ERROR:PRODUCT_NOT_FOUND";
        }
        double price = Double.parseDouble(product[1]);
        double totalPrice = price * qty;

        // 2. Проверяем остаток
        if (getStock(productId) < qty) {
            return "ERROR:INSUFFICIENT_STOCK";
        }

        // 3. Проверяем баланс
        if (getBalance(userId) < totalPrice) {
            return "ERROR:INSUFFICIENT_FUNDS";
        }

        // 4. Выполняем заказ
        charge(userId, totalPrice);
        decreaseStock(productId, qty);
        return "OK:" + product[0] + ":" + totalPrice;
    }

    static void initAll() {
        products = new HashMap<>();
        inventory = new HashMap<>();
        balances = new HashMap<>();
    }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (!Objects.equals(expected, actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertDoubleEquals(double expected, double actual) {
        if (Math.abs(expected - actual) > 0.01) {
            throw new RuntimeException(
                "Ожидали " + expected + ", получили " + actual);
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Ожидали true");
    }

    static void runTest(String name, Runnable test) {
        total++;
        initAll();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testSuccessfulOrder", () -> {
            addProduct(1, "Ноутбук", 500000);
            setStock(1, 10);
            setBalance("user1", 1000000);

            String result = placeOrder("user1", 1, 1);
            assertTrue(result.startsWith("OK:"));
        });

        runTest("testProductNotFound", () -> {
            setBalance("user1", 1000000);
            String result = placeOrder("user1", 999, 1);
            assertEquals("ERROR:PRODUCT_NOT_FOUND", result);
        });

        runTest("testInsufficientStock", () -> {
            addProduct(1, "Телефон", 200000);
            setStock(1, 2);
            setBalance("user1", 5000000);

            String result = placeOrder("user1", 1, 5);
            assertEquals("ERROR:INSUFFICIENT_STOCK", result);
        });

        runTest("testInsufficientFunds", () -> {
            addProduct(1, "Телевизор", 300000);
            setStock(1, 10);
            setBalance("user1", 100000);

            String result = placeOrder("user1", 1, 1);
            assertEquals("ERROR:INSUFFICIENT_FUNDS", result);
        });

        runTest("testStockDecreased", () -> {
            addProduct(1, "Мышка", 5000);
            setStock(1, 10);
            setBalance("user1", 100000);

            placeOrder("user1", 1, 3);
            assertEquals(7, getStock(1)); // 10 - 3 = 7
        });

        runTest("testBalanceDecreased", () -> {
            addProduct(1, "Клавиатура", 15000);
            setStock(1, 10);
            setBalance("user1", 100000);

            placeOrder("user1", 1, 2);
            assertDoubleEquals(70000.0, getBalance("user1")); // 100000 - 30000
        });

        runTest("testMultipleOrders", () -> {
            addProduct(1, "USB", 1000);
            addProduct(2, "HDMI", 2000);
            setStock(1, 100);
            setStock(2, 50);
            setBalance("user1", 50000);

            placeOrder("user1", 1, 5);  // 5000
            placeOrder("user1", 2, 3);  // 6000
            assertEquals(95, getStock(1));
            assertEquals(47, getStock(2));
            assertDoubleEquals(39000.0, getBalance("user1"));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Интеграционный тест проверяет взаимодействие нескольких компонентов: ProductCatalog, InventoryService, PaymentService, OrderService. Все зависимости — фейковые (in-memory). Мы тестируем: успешный сценарий, ошибки (товар не найден, нет на складе, нет денег), побочные эффекты (остаток уменьшился, баланс списан), множественные заказы. initAll() обеспечивает чистое состояние для каждого теста.'
    },
    {
      id: 10,
      title: 'Тестирование событийной системы',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте EventBus (издатель-подписчик) и протестируйте публикацию событий, подписку и отписку с помощью spy-подписчиков.',
      requirements: [
        'EventBus поддерживает: subscribe(eventType, handler), publish(eventType, data), unsubscribe',
        'Создайте SpyHandler — записывает полученные события',
        'Протестируйте: подписка и получение события',
        'Протестируйте: несколько подписчиков на одно событие',
        'Протестируйте: отписка — после unsubscribe события не приходят',
        'Протестируйте: разные типы событий доставляются правильным подписчикам'
      ],
      expectedOutput: 'PASS: testSubscribeAndPublish\nPASS: testMultipleSubscribers\nPASS: testUnsubscribe\nPASS: testDifferentEventTypes\nPASS: testNoSubscribers\nPASS: testEventData\nИтого: 6/6',
      hint: 'EventBus хранит Map<String, List<Handler>>. publish находит всех подписчиков по eventType и вызывает их. SpyHandler добавляет полученные данные в список для проверки.',
      solution: `import java.util.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- EventBus ---
    static Map<String, List<Integer>> subscribers; // eventType -> list of handler IDs
    static Map<Integer, List<String>> handlerReceivedEvents; // handlerId -> received data
    static int nextHandlerId;

    static void initEventBus() {
        subscribers = new HashMap<>();
        handlerReceivedEvents = new HashMap<>();
        nextHandlerId = 1;
    }

    static int subscribe(String eventType) {
        int handlerId = nextHandlerId++;
        subscribers.computeIfAbsent(eventType, k -> new ArrayList<>()).add(handlerId);
        handlerReceivedEvents.put(handlerId, new ArrayList<>());
        return handlerId;
    }

    static void unsubscribe(String eventType, int handlerId) {
        List<Integer> handlers = subscribers.get(eventType);
        if (handlers != null) {
            handlers.remove(Integer.valueOf(handlerId));
        }
    }

    static void publish(String eventType, String data) {
        List<Integer> handlers = subscribers.get(eventType);
        if (handlers == null) return;
        for (int handlerId : handlers) {
            handlerReceivedEvents.get(handlerId).add(eventType + ":" + data);
        }
    }

    static List<String> getReceivedEvents(int handlerId) {
        return handlerReceivedEvents.getOrDefault(handlerId, new ArrayList<>());
    }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (!Objects.equals(expected, actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Ожидали true");
    }

    static void runTest(String name, Runnable test) {
        total++;
        initEventBus();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testSubscribeAndPublish", () -> {
            int handler = subscribe("ORDER_CREATED");
            publish("ORDER_CREATED", "order-123");
            List<String> events = getReceivedEvents(handler);
            assertEquals(1, events.size());
            assertEquals("ORDER_CREATED:order-123", events.get(0));
        });

        runTest("testMultipleSubscribers", () -> {
            int handler1 = subscribe("USER_REGISTERED");
            int handler2 = subscribe("USER_REGISTERED");
            int handler3 = subscribe("USER_REGISTERED");
            publish("USER_REGISTERED", "user-42");
            // Все 3 подписчика получили событие
            assertEquals(1, getReceivedEvents(handler1).size());
            assertEquals(1, getReceivedEvents(handler2).size());
            assertEquals(1, getReceivedEvents(handler3).size());
        });

        runTest("testUnsubscribe", () -> {
            int handler = subscribe("PAYMENT_DONE");
            publish("PAYMENT_DONE", "pay-1");
            assertEquals(1, getReceivedEvents(handler).size());

            unsubscribe("PAYMENT_DONE", handler);
            publish("PAYMENT_DONE", "pay-2");
            // После отписки — событие НЕ получено
            assertEquals(1, getReceivedEvents(handler).size());
        });

        runTest("testDifferentEventTypes", () -> {
            int orderHandler = subscribe("ORDER");
            int paymentHandler = subscribe("PAYMENT");

            publish("ORDER", "order-1");
            publish("PAYMENT", "pay-1");

            // Каждый получил только своё событие
            assertEquals(1, getReceivedEvents(orderHandler).size());
            assertTrue(getReceivedEvents(orderHandler).get(0).contains("ORDER"));
            assertEquals(1, getReceivedEvents(paymentHandler).size());
            assertTrue(getReceivedEvents(paymentHandler).get(0).contains("PAYMENT"));
        });

        runTest("testNoSubscribers", () -> {
            // Публикация без подписчиков — без ошибок
            publish("UNKNOWN_EVENT", "data");
            // Просто не должно быть исключений
        });

        runTest("testEventData", () -> {
            int handler = subscribe("LOG");
            publish("LOG", "info:Сервер запущен");
            publish("LOG", "warn:Мало памяти");
            publish("LOG", "error:Диск заполнен");

            List<String> events = getReceivedEvents(handler);
            assertEquals(3, events.size());
            assertEquals("LOG:info:Сервер запущен", events.get(0));
            assertEquals("LOG:warn:Мало памяти", events.get(1));
            assertEquals("LOG:error:Диск заполнен", events.get(2));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'EventBus (паттерн Observer/Pub-Sub) — реальный паттерн из микросервисной архитектуры. Каждый подписчик (handler) — spy, записывающий полученные события. Мы тестируем: доставку событий, множественных подписчиков, отписку (после unsubscribe события не приходят), изоляцию типов (ORDER-подписчик не получает PAYMENT), устойчивость к публикации без подписчиков.'
    }
  ]
}
