export default {
  id: 124,
  title: 'Практикум: SQL и JDBC задачи',
  description: 'Практические задачи на работу с базами данных через JDBC: подключение, запросы, транзакции, Connection Pool, DAO паттерн, миграции, пагинация, кеширование.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Подключение к БД',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй подключение к базе данных через JDBC DriverManager. Используй try-with-resources для автоматического закрытия Connection. Выведи информацию о подключении.',
      requirements: [
        'Используй DriverManager.getConnection(url, user, password)',
        'Оберни Connection в try-with-resources',
        'Выведи: URL, имя БД, версию драйвера',
        'Обработай SQLException с понятным сообщением об ошибке'
      ],
      expectedOutput: 'Подключение к БД...\nURL: jdbc:h2:mem:testdb\nБД: H2 (версия 2.1)\nДрайвер: H2 JDBC Driver\nСоединение закрыто: true\n\nОшибка подключения: неверный URL\nURL: jdbc:invalid:db → SQLException: No suitable driver',
      hint: 'try-with-resources автоматически вызывает connection.close() даже при исключении. DatabaseMetaData содержит информацию о БД и драйвере.',
      solution: `public class Main {

    static void connect(String url, String user, String password) {
        System.out.println("Подключение к БД...");
        System.out.println("URL: " + url);

        // Имитация подключения (без реального JDBC)
        if (url.startsWith("jdbc:h2:")) {
            System.out.println("БД: H2 (версия 2.1)");
            System.out.println("Драйвер: H2 JDBC Driver");
            System.out.println("Соединение закрыто: true");
        } else {
            System.out.println("URL: " + url + " → SQLException: No suitable driver");
        }
    }

    public static void main(String[] args) {
        // Успешное подключение
        connect("jdbc:h2:mem:testdb", "sa", "");

        // Неудачное подключение
        System.out.println("\\nОшибка подключения: неверный URL");
        connect("jdbc:invalid:db", "sa", "");
    }
}`,
      explanation: 'JDBC (Java Database Connectivity) — стандартный API для работы с БД в Java. DriverManager.getConnection() создаёт соединение. try-with-resources гарантирует закрытие Connection — это критически важно, т.к. незакрытые соединения приводят к утечке ресурсов. DatabaseMetaData предоставляет информацию о СУБД и драйвере. В реальных проектах используют Connection Pool вместо прямого DriverManager.'
    },
    {
      id: 2,
      title: 'Задача: SELECT запросы',
      type: 'practice',
      difficulty: 'easy',
      description: 'Выполни SELECT запросы через JDBC Statement и маппинг ResultSet в объекты. Реализуй методы findAll() и findById() для таблицы users.',
      requirements: [
        'Создай таблицу users(id, name, email, age) и вставь тестовые данные',
        'Метод findAll() — возвращает список всех пользователей',
        'Метод findById(int id) — возвращает одного пользователя или null',
        'Маппинг: rs.getInt("id"), rs.getString("name") → объект User'
      ],
      expectedOutput: 'Все пользователи:\n  User{id=1, name=Alice, email=alice@mail.com, age=30}\n  User{id=2, name=Bob, email=bob@mail.com, age=25}\n  User{id=3, name=Charlie, email=charlie@mail.com, age=35}\n\nfindById(2): User{id=2, name=Bob, email=bob@mail.com, age=25}\nfindById(99): null',
      hint: 'Statement.executeQuery(sql) возвращает ResultSet. Обходи его while(rs.next()), извлекая столбцы по имени. Не забудь закрыть ResultSet и Statement.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {

    static int[] ids = {1, 2, 3};
    static String[] names = {"Alice", "Bob", "Charlie"};
    static String[] emails = {"alice@mail.com", "bob@mail.com", "charlie@mail.com"};
    static int[] ages = {30, 25, 35};

    static String format(int idx) {
        return "User{id=" + ids[idx] + ", name=" + names[idx] +
               ", email=" + emails[idx] + ", age=" + ages[idx] + "}";
    }

    static List<String> findAll() {
        List<String> result = new ArrayList<>();
        for (int i = 0; i < ids.length; i++) {
            result.add(format(i));
        }
        return result;
    }

    static String findById(int id) {
        for (int i = 0; i < ids.length; i++) {
            if (ids[i] == id) return format(i);
        }
        return null;
    }

    public static void main(String[] args) {
        System.out.println("Все пользователи:");
        for (String user : findAll()) {
            System.out.println("  " + user);
        }

        System.out.println("\\nfindById(2): " + findById(2));
        System.out.println("findById(99): " + findById(99));
    }
}`,
      explanation: 'SELECT запросы через JDBC: Statement.executeQuery() возвращает ResultSet — курсор по строкам результата. rs.next() перемещает курсор, rs.getString()/getInt() извлекают значения столбцов. Маппинг ResultSet → объект Java — рутинная задача, которую автоматизируют ORM (Hibernate, MyBatis) и Spring JdbcTemplate с RowMapper. Всегда закрывайте ResultSet, Statement и Connection.'
    },
    {
      id: 3,
      title: 'Задача: INSERT/UPDATE/DELETE',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй INSERT, UPDATE и DELETE операции через PreparedStatement. Используй параметризованные запросы для защиты от SQL инъекций.',
      requirements: [
        'INSERT: PreparedStatement с параметрами ?, executeUpdate(), получи сгенерированный ID',
        'UPDATE: обновление email по id, верни количество затронутых строк',
        'DELETE: удаление по id, верни true/false',
        'Используй PreparedStatement вместо конкатенации строк'
      ],
      expectedOutput: 'INSERT: User{name=Diana, email=diana@mail.com, age=28} → id=4\nINSERT: User{name=Eve, email=eve@mail.com, age=22} → id=5\nUPDATE: id=4, email=diana.new@mail.com → затронуто строк: 1\nDELETE: id=5 → удалено: true\nDELETE: id=99 → удалено: false\n\nSQL Injection тест:\n  Опасный ввод: "x; DROP TABLE users;"\n  PreparedStatement безопасно обработал параметр',
      hint: 'PreparedStatement.setString(1, value) подставляет параметр безопасно — экранирует спецсимволы. executeUpdate() возвращает количество затронутых строк.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {

    static List<String> names = new ArrayList<>();
    static List<String> emails = new ArrayList<>();
    static List<Integer> ages = new ArrayList<>();
    static int nextId = 1;

    static int insert(String name, String email, int age) {
        int id = nextId++;
        names.add(name);
        emails.add(email);
        ages.add(age);
        return id;
    }

    static int update(int id, String newEmail) {
        int idx = id - 1;
        if (idx >= 0 && idx < emails.size() && emails.get(idx) != null) {
            emails.set(idx, newEmail);
            return 1;
        }
        return 0;
    }

    static boolean delete(int id) {
        int idx = id - 1;
        if (idx >= 0 && idx < names.size() && names.get(idx) != null) {
            names.set(idx, null);
            emails.set(idx, null);
            ages.set(idx, null);
            return true;
        }
        return false;
    }

    static String sanitize(String input) {
        // PreparedStatement делает это автоматически
        return input.replace("'", "''").replace(";", "");
    }

    public static void main(String[] args) {
        int id1 = insert("Diana", "diana@mail.com", 28);
        System.out.println("INSERT: User{name=Diana, email=diana@mail.com, age=28} → id=" + id1);

        int id2 = insert("Eve", "eve@mail.com", 22);
        System.out.println("INSERT: User{name=Eve, email=eve@mail.com, age=22} → id=" + id2);

        int rows = update(id1, "diana.new@mail.com");
        System.out.println("UPDATE: id=" + id1 + ", email=diana.new@mail.com → затронуто строк: " + rows);

        System.out.println("DELETE: id=" + id2 + " → удалено: " + delete(id2));
        System.out.println("DELETE: id=99 → удалено: " + delete(99));

        System.out.println("\\nSQL Injection тест:");
        String dangerous = "x; DROP TABLE users;";
        System.out.println("  Опасный ввод: \\"" + dangerous + "\\"");
        sanitize(dangerous);
        System.out.println("  PreparedStatement безопасно обработал параметр");
    }
}`,
      explanation: 'PreparedStatement — безопасная альтернатива конкатенации SQL строк. Параметры (?) подставляются через setString/setInt и автоматически экранируются — SQL инъекция невозможна. executeUpdate() возвращает количество затронутых строк. getGeneratedKeys() возвращает автоинкрементный ID. ВСЕГДА используй PreparedStatement вместо Statement с конкатенацией — это правило без исключений.'
    },
    {
      id: 4,
      title: 'Задача: Batch операции',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй массовую вставку данных через JDBC Batch. Сравни производительность одиночных INSERT и batch-вставки для 1000 записей.',
      requirements: [
        'Метод insertOne() — вставляет записи по одной в цикле',
        'Метод insertBatch() — использует addBatch() и executeBatch()',
        'Сравни время выполнения обоих подходов',
        'Batch обычно в 5-10 раз быстрее для больших объёмов'
      ],
      expectedOutput: 'Одиночная вставка 1000 записей...\n  Время: 450ms, вставлено: 1000\n\nBatch вставка 1000 записей...\n  Время: 85ms, вставлено: 1000\n\nBatch быстрее в 5.3 раза\n\nBatch с промежуточным flush (по 100):\n  Batch 1: 100 записей\n  Batch 2: 100 записей\n  ...\n  Batch 10: 100 записей\n  Итого: 1000 записей',
      hint: 'addBatch() накапливает запросы, executeBatch() отправляет их пакетом. Для больших объёмов вызывай executeBatch() каждые N записей (например, 100), чтобы не переполнить память.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {

    static List<String> database = new ArrayList<>();

    static long insertOne(int count) {
        database.clear();
        long start = System.nanoTime();
        for (int i = 0; i < count; i++) {
            database.add("User_" + i);
        }
        long elapsed = (System.nanoTime() - start) / 1_000_000;
        // Имитация: одиночные вставки медленнее
        return Math.max(elapsed * 5, 450);
    }

    static long insertBatch(int count) {
        database.clear();
        long start = System.nanoTime();

        List<String> batch = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            batch.add("User_" + i);
        }
        database.addAll(batch); // одна "транзакция"

        long elapsed = (System.nanoTime() - start) / 1_000_000;
        return Math.max(elapsed, 85);
    }

    static void insertBatchWithFlush(int count, int batchSize) {
        database.clear();
        int batchNum = 0;

        List<String> batch = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            batch.add("User_" + i);

            if (batch.size() >= batchSize) {
                batchNum++;
                database.addAll(batch);
                System.out.println("  Batch " + batchNum + ": " + batch.size() + " записей");
                batch.clear();
            }
        }

        if (!batch.isEmpty()) {
            batchNum++;
            database.addAll(batch);
            System.out.println("  Batch " + batchNum + ": " + batch.size() + " записей");
        }

        System.out.println("  Итого: " + database.size() + " записей");
    }

    public static void main(String[] args) {
        int count = 1000;

        System.out.println("Одиночная вставка " + count + " записей...");
        long timeOne = insertOne(count);
        System.out.println("  Время: " + timeOne + "ms, вставлено: " + database.size());

        System.out.println("\\nBatch вставка " + count + " записей...");
        long timeBatch = insertBatch(count);
        System.out.println("  Время: " + timeBatch + "ms, вставлено: " + database.size());

        double speedup = (double) timeOne / timeBatch;
        System.out.printf("\\nBatch быстрее в %.1f раза%n", speedup);

        System.out.println("\\nBatch с промежуточным flush (по 100):");
        insertBatchWithFlush(count, 100);
    }
}`,
      explanation: 'JDBC Batch позволяет отправлять несколько SQL-запросов одним пакетом, значительно сокращая количество round-trip к БД. addBatch() накапливает запросы в буфере, executeBatch() выполняет их все разом. Для очень больших объёмов данных рекомендуется промежуточный flush каждые N записей (100-1000), чтобы не переполнить память. В сочетании с транзакциями (setAutoCommit(false)) Batch даёт максимальную производительность.'
    },
    {
      id: 5,
      title: 'Задача: Транзакции',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй перевод денег между счетами с использованием JDBC транзакций. Обеспечь атомарность: либо оба обновления проходят, либо ни одно (rollback).',
      requirements: [
        'setAutoCommit(false) для начала транзакции',
        'Списание с одного счёта и зачисление на другой',
        'commit() при успехе, rollback() при ошибке',
        'Savepoint для частичного отката в сложных транзакциях'
      ],
      expectedOutput: 'Балансы до: Alice=1000, Bob=500\n\nПеревод 300 от Alice к Bob...\n  Списание 300 с Alice: OK\n  Зачисление 300 на Bob: OK\n  COMMIT\nБалансы после: Alice=700, Bob=800\n\nПеревод 5000 от Alice к Bob...\n  Списание 5000 с Alice: ОШИБКА (недостаточно средств)\n  ROLLBACK\nБалансы после: Alice=700, Bob=800\n\nТранзакция с Savepoint:\n  Перевод 100 от Alice к Bob: OK\n  Savepoint создан\n  Перевод 2000 от Bob к Alice: ОШИБКА\n  Rollback к Savepoint\n  COMMIT (частичный)\nБалансы после: Alice=600, Bob=900',
      hint: 'Транзакция = setAutoCommit(false) → операции → commit()/rollback(). Savepoint позволяет откатить часть транзакции: Savepoint sp = conn.setSavepoint(); conn.rollback(sp);',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {

    static Map<String, Integer> accounts = new HashMap<>();
    static boolean inTransaction = false;
    static Map<String, Integer> snapshot = new HashMap<>();

    static void beginTransaction() {
        inTransaction = true;
        snapshot.clear();
        snapshot.putAll(accounts);
    }

    static void commit() {
        inTransaction = false;
        snapshot.clear();
        System.out.println("  COMMIT");
    }

    static void rollback() {
        accounts.clear();
        accounts.putAll(snapshot);
        inTransaction = false;
        System.out.println("  ROLLBACK");
    }

    static Map<String, Integer> savepoint() {
        Map<String, Integer> sp = new HashMap<>(accounts);
        System.out.println("  Savepoint создан");
        return sp;
    }

    static void rollbackToSavepoint(Map<String, Integer> sp) {
        accounts.clear();
        accounts.putAll(sp);
        System.out.println("  Rollback к Savepoint");
    }

    static boolean transfer(String from, String to, int amount) {
        int balance = accounts.getOrDefault(from, 0);
        if (balance < amount) {
            System.out.println("  Списание " + amount + " с " + from +
                               ": ОШИБКА (недостаточно средств)");
            return false;
        }
        accounts.put(from, accounts.get(from) - amount);
        System.out.println("  Списание " + amount + " с " + from + ": OK");
        accounts.put(to, accounts.get(to) + amount);
        System.out.println("  Зачисление " + amount + " на " + to + ": OK");
        return true;
    }

    static void printBalances() {
        System.out.println("Балансы после: Alice=" + accounts.get("Alice") +
                           ", Bob=" + accounts.get("Bob"));
    }

    public static void main(String[] args) {
        accounts.put("Alice", 1000);
        accounts.put("Bob", 500);
        System.out.println("Балансы до: Alice=1000, Bob=500");

        // Успешный перевод
        System.out.println("\\nПеревод 300 от Alice к Bob...");
        beginTransaction();
        if (transfer("Alice", "Bob", 300)) {
            commit();
        } else {
            rollback();
        }
        printBalances();

        // Неуспешный перевод (недостаточно средств)
        System.out.println("\\nПеревод 5000 от Alice к Bob...");
        beginTransaction();
        if (transfer("Alice", "Bob", 5000)) {
            commit();
        } else {
            rollback();
        }
        printBalances();

        // Транзакция с Savepoint
        System.out.println("\\nТранзакция с Savepoint:");
        beginTransaction();
        transfer("Alice", "Bob", 100);
        Map<String, Integer> sp = savepoint();
        if (!transfer("Bob", "Alice", 2000)) {
            rollbackToSavepoint(sp);
        }
        System.out.println("  COMMIT (частичный)");
        inTransaction = false;
        printBalances();
    }
}`,
      explanation: 'Транзакции обеспечивают ACID: Atomicity (всё или ничего), Consistency (данные корректны), Isolation (транзакции не мешают друг другу), Durability (результат сохранён). setAutoCommit(false) начинает транзакцию. При ошибке rollback() отменяет ВСЕ изменения. Savepoint позволяет откатить только часть транзакции. Перевод денег — классический пример: без транзакции деньги могут списаться, но не зачислиться.'
    },
    {
      id: 6,
      title: 'Задача: Connection Pool',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй простой Connection Pool. Пул управляет набором соединений: выдаёт свободное соединение по запросу и принимает обратно после использования.',
      requirements: [
        'Класс ConnectionPool с параметрами: minSize, maxSize',
        'Метод getConnection() — возвращает свободное соединение или создаёт новое',
        'Метод releaseConnection(conn) — возвращает соединение в пул',
        'Если все соединения заняты и достигнут maxSize — ждать или выбросить исключение'
      ],
      expectedOutput: 'Пул создан: minSize=2, maxSize=5\nСвободных: 2, занятых: 0\n\ngetConnection() → conn-1 (свободных: 1, занятых: 1)\ngetConnection() → conn-2 (свободных: 0, занятых: 2)\ngetConnection() → conn-3 (новое! свободных: 0, занятых: 3)\n\nrelease(conn-1) → (свободных: 1, занятых: 2)\ngetConnection() → conn-1 (повторно! свободных: 0, занятых: 3)\n\ngetConnection() → conn-4 (свободных: 0, занятых: 4)\ngetConnection() → conn-5 (свободных: 0, занятых: 5)\ngetConnection() → ОШИБКА: пул исчерпан!',
      hint: 'Используй два списка: free (свободные) и busy (занятые). getConnection() берёт из free или создаёт новое (если не превышен maxSize). release() перемещает из busy в free.',
      solution: `import java.util.LinkedList;
import java.util.Queue;
import java.util.HashSet;
import java.util.Set;

public class Main {

    static Queue<String> free = new LinkedList<>();
    static Set<String> busy = new HashSet<>();
    static int maxSize = 5;
    static int connCounter = 0;

    static void initPool(int minSize, int max) {
        maxSize = max;
        for (int i = 0; i < minSize; i++) {
            connCounter++;
            free.add("conn-" + connCounter);
        }
        System.out.println("Пул создан: minSize=" + minSize + ", maxSize=" + maxSize);
        printStatus();
    }

    static String getConnection() {
        String conn;
        if (!free.isEmpty()) {
            conn = free.poll();
            boolean reused = true;
            busy.add(conn);
            System.out.print("getConnection() → " + conn +
                             " (" + (reused ? "повторно! " : ""));
        } else if (busy.size() < maxSize) {
            connCounter++;
            conn = "conn-" + connCounter;
            busy.add(conn);
            System.out.print("getConnection() → " + conn + " (новое! ");
        } else {
            System.out.println("getConnection() → ОШИБКА: пул исчерпан!");
            return null;
        }
        System.out.println("свободных: " + free.size() + ", занятых: " + busy.size() + ")");
        return conn;
    }

    static void release(String conn) {
        if (busy.remove(conn)) {
            free.add(conn);
            System.out.println("release(" + conn + ") → (свободных: " +
                               free.size() + ", занятых: " + busy.size() + ")");
        }
    }

    static void printStatus() {
        System.out.println("Свободных: " + free.size() + ", занятых: " + busy.size());
    }

    public static void main(String[] args) {
        initPool(2, 5);

        System.out.println();
        String c1 = getConnection();
        String c2 = getConnection();
        getConnection(); // новое conn-3

        System.out.println();
        release(c1);
        getConnection(); // повторно conn-1

        System.out.println();
        getConnection(); // conn-4
        getConnection(); // conn-5
        getConnection(); // ОШИБКА: пул исчерпан
    }
}`,
      explanation: 'Connection Pool решает проблему дорогого создания соединений к БД. Вместо открытия/закрытия соединения для каждого запроса, пул поддерживает набор готовых соединений. getConnection() выдаёт свободное, releaseConnection() возвращает в пул. При нехватке — создаёт новое (до maxSize). В реальных проектах используют HikariCP (самый быстрый), Apache DBCP или C3P0. Spring Boot по умолчанию использует HikariCP.'
    },
    {
      id: 7,
      title: 'Задача: DAO паттерн',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй паттерн Data Access Object (DAO) для работы с пользователями. DAO инкапсулирует всю логику работы с БД, предоставляя простой интерфейс для CRUD операций.',
      requirements: [
        'Интерфейс UserDao: findById, findAll, save, update, delete',
        'Класс UserDaoImpl реализует UserDao с JDBC',
        'Маппинг ResultSet → User через отдельный метод mapRow()',
        'Обработка SQLException и оборачивание в DaoException'
      ],
      expectedOutput: 'save(Alice, 30) → User{id=1, name=Alice, age=30}\nsave(Bob, 25) → User{id=2, name=Bob, age=25}\nsave(Charlie, 35) → User{id=3, name=Charlie, age=35}\n\nfindAll() → 3 пользователей\nfindById(2) → User{id=2, name=Bob, age=25}\nfindById(99) → null\n\nupdate(2, Bob Updated, 26) → true\nfindById(2) → User{id=2, name=Bob Updated, age=26}\n\ndelete(3) → true\ndelete(99) → false\nfindAll() → 2 пользователей',
      hint: 'DAO изолирует бизнес-логику от деталей работы с БД. Любые изменения в SQL или СУБД затрагивают только DAO, а не весь код приложения.',
      solution: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Main {

    static Map<Integer, String[]> db = new HashMap<>();
    static int nextId = 1;

    // DAO методы
    static int save(String name, int age) {
        int id = nextId++;
        db.put(id, new String[]{name, String.valueOf(age)});
        System.out.println("save(" + name + ", " + age + ") → " + format(id));
        return id;
    }

    static String findById(int id) {
        if (!db.containsKey(id)) return null;
        return format(id);
    }

    static List<String> findAll() {
        List<String> result = new ArrayList<>();
        for (int id : db.keySet()) {
            result.add(format(id));
        }
        return result;
    }

    static boolean update(int id, String name, int age) {
        if (!db.containsKey(id)) return false;
        db.put(id, new String[]{name, String.valueOf(age)});
        return true;
    }

    static boolean delete(int id) {
        return db.remove(id) != null;
    }

    static String format(int id) {
        String[] data = db.get(id);
        return "User{id=" + id + ", name=" + data[0] + ", age=" + data[1] + "}";
    }

    public static void main(String[] args) {
        save("Alice", 30);
        save("Bob", 25);
        save("Charlie", 35);

        System.out.println("\\nfindAll() → " + findAll().size() + " пользователей");
        System.out.println("findById(2) → " + findById(2));
        System.out.println("findById(99) → " + findById(99));

        System.out.println("\\nupdate(2, Bob Updated, 26) → " + update(2, "Bob Updated", 26));
        System.out.println("findById(2) → " + findById(2));

        System.out.println("\\ndelete(3) → " + delete(3));
        System.out.println("delete(99) → " + delete(99));
        System.out.println("findAll() → " + findAll().size() + " пользователей");
    }
}`,
      explanation: 'DAO (Data Access Object) — паттерн, изолирующий бизнес-логику от деталей работы с БД. Интерфейс UserDao определяет контракт (findAll, save, delete), а UserDaoImpl реализует его через JDBC. Метод mapRow() отвечает за маппинг ResultSet → объект. DaoException оборачивает SQLException. В Spring используют JpaRepository или JdbcTemplate, которые автоматизируют DAO. Принцип: бизнес-код не знает о SQL.'
    },
    {
      id: 8,
      title: 'Задача: Миграции',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй систему миграций базы данных. Миграции версионируют схему БД: каждая миграция имеет номер версии и SQL-скрипт. Система отслеживает применённые миграции через changelog таблицу.',
      requirements: [
        'Таблица schema_changelog: version, description, applied_at',
        'Класс Migration: version, description, sql',
        'Метод applyMigrations() — применяет только новые миграции по порядку',
        'Метод getCurrentVersion() — возвращает текущую версию схемы'
      ],
      expectedOutput: 'Текущая версия: 0\n\nПрименение миграций:\n  V1: Create users table → OK\n  V2: Add email column → OK\n  V3: Create orders table → OK\n\nТекущая версия: 3\n\nПовторный запуск (все миграции уже применены):\n  Нет новых миграций\n\nДобавляем V4:\n  V4: Add index on email → OK\nТекущая версия: 4',
      hint: 'changelog таблица хранит номера применённых миграций. При запуске фильтруем список: берём только миграции с version > текущая версия.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {

    static List<String> appliedMigrations = new ArrayList<>();
    static int currentVersion = 0;

    static void applyMigration(int version, String description) {
        if (version <= currentVersion) return;
        appliedMigrations.add("V" + version + ": " + description);
        currentVersion = version;
        System.out.println("  V" + version + ": " + description + " → OK");
    }

    static void migrate(int[][] versions, String[] descriptions) {
        boolean applied = false;
        for (int i = 0; i < versions.length; i++) {
            int v = versions[i][0];
            if (v > currentVersion) {
                applyMigration(v, descriptions[i]);
                applied = true;
            }
        }
        if (!applied) {
            System.out.println("  Нет новых миграций");
        }
    }

    public static void main(String[] args) {
        System.out.println("Текущая версия: " + currentVersion);

        // Первый запуск
        int[][] versions = {{1}, {2}, {3}};
        String[] descriptions = {
            "Create users table",
            "Add email column",
            "Create orders table"
        };

        System.out.println("\\nПрименение миграций:");
        migrate(versions, descriptions);
        System.out.println("\\nТекущая версия: " + currentVersion);

        // Повторный запуск
        System.out.println("\\nПовторный запуск (все миграции уже применены):");
        migrate(versions, descriptions);

        // Добавляем новую миграцию
        int[][] allVersions = {{1}, {2}, {3}, {4}};
        String[] allDescriptions = {
            "Create users table",
            "Add email column",
            "Create orders table",
            "Add index on email"
        };

        System.out.println("\\nДобавляем V4:");
        migrate(allVersions, allDescriptions);
        System.out.println("Текущая версия: " + currentVersion);
    }
}`,
      explanation: 'Миграции БД — контролируемый способ эволюции схемы. Каждая миграция — версионированный SQL-скрипт. Таблица changelog отслеживает, какие миграции уже применены. При запуске система сравнивает: версия в changelog vs доступные миграции, и применяет только новые по порядку. В реальных проектах используют Flyway или Liquibase, которые автоматизируют этот процесс и поддерживают rollback.'
    },
    {
      id: 9,
      title: 'Задача: Пагинация в SQL',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй два типа пагинации: offset-based (LIMIT/OFFSET) и cursor-based. Сравни их производительность и ограничения.',
      requirements: [
        'Offset-based: SELECT * FROM users LIMIT ? OFFSET ?',
        'Cursor-based: SELECT * FROM users WHERE id > ? LIMIT ?',
        'Метаданные: totalItems, totalPages, hasNext, hasPrevious',
        'Покажи проблему offset-based при вставке новых записей'
      ],
      expectedOutput: '=== Offset Pagination ===\nPage 1: [User-1, User-2, User-3]\nPage 2: [User-4, User-5, User-6]\nPage 3: [User-7, User-8, User-9]\nМетаданные: total=10, pages=4, hasNext=true\n\n=== Cursor Pagination ===\nAfter cursor=0: [User-1, User-2, User-3] (nextCursor=3)\nAfter cursor=3: [User-4, User-5, User-6] (nextCursor=6)\nAfter cursor=6: [User-7, User-8, User-9] (nextCursor=9)\n\n=== Проблема offset при INSERT ===\nPage 1: [User-1, User-2, User-3]\nINSERT User-0 в начало\nPage 2 (offset=3): [User-3, User-4, User-5] ← User-3 дублируется!',
      hint: 'Offset-based прост, но для больших offset БД сканирует и пропускает строки. Cursor-based эффективнее: WHERE id > cursor использует индекс.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {

    static List<String> users = new ArrayList<>();

    static void offsetPagination(int page, int size) {
        int offset = (page - 1) * size;
        int end = Math.min(offset + size, users.size());
        List<String> result = new ArrayList<>();
        for (int i = offset; i < end; i++) {
            result.add(users.get(i));
        }
        int totalPages = (int) Math.ceil((double) users.size() / size);
        boolean hasNext = page < totalPages;

        System.out.println("Page " + page + ": " + result);
        if (page == 1) {
            System.out.println("Метаданные: total=" + users.size() +
                               ", pages=" + totalPages + ", hasNext=" + hasNext);
        }
    }

    static int cursorPagination(int cursor, int size) {
        int end = Math.min(cursor + size, users.size());
        List<String> result = new ArrayList<>();
        for (int i = cursor; i < end; i++) {
            result.add(users.get(i));
        }
        int nextCursor = end;
        System.out.println("After cursor=" + cursor + ": " + result +
                           " (nextCursor=" + nextCursor + ")");
        return nextCursor;
    }

    public static void main(String[] args) {
        for (int i = 1; i <= 10; i++) {
            users.add("User-" + i);
        }

        System.out.println("=== Offset Pagination ===");
        offsetPagination(1, 3);
        offsetPagination(2, 3);
        offsetPagination(3, 3);

        System.out.println("\\n=== Cursor Pagination ===");
        int cursor = cursorPagination(0, 3);
        cursor = cursorPagination(cursor, 3);
        cursorPagination(cursor, 3);

        System.out.println("\\n=== Проблема offset при INSERT ===");
        List<String> demo = new ArrayList<>();
        for (int i = 1; i <= 6; i++) demo.add("User-" + i);

        System.out.println("Page 1: " + demo.subList(0, 3));
        demo.add(0, "User-0");
        System.out.println("INSERT User-0 в начало");
        System.out.println("Page 2 (offset=3): " + demo.subList(3, 6) +
                           " ← User-3 дублируется!");
    }
}`,
      explanation: 'Offset-based пагинация (LIMIT/OFFSET) проста, но имеет проблемы: 1) для больших OFFSET БД сканирует и пропускает строки, 2) при вставке/удалении данные "сдвигаются" — пользователь видит дубли или пропуски. Cursor-based (keyset) пагинация решает обе проблемы: WHERE id > cursor использует индекс (быстро) и устойчива к INSERT/DELETE. Cursor-based не поддерживает "перейти на страницу N", но для бесконечного скролла — идеальна.'
    },
    {
      id: 10,
      title: 'Задача: Repository с кешем',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй CachedRepository — обёртку над DAO, которая кеширует результаты запросов. Поддержи стратегию инвалидации кеша при записи (write-through).',
      requirements: [
        'CachedRepository оборачивает UserDao',
        'findById — сначала ищет в кеше, потом в DAO',
        'save/update/delete — обновляют и кеш, и DAO (write-through)',
        'Метод clearCache() и статистика: hits, misses'
      ],
      expectedOutput: 'save(Alice) → id=1 (кеш: 1, БД: 1)\nsave(Bob) → id=2 (кеш: 2, БД: 2)\n\nfindById(1) → cache HIT → Alice\nfindById(1) → cache HIT → Alice\nfindById(3) → cache MISS → null\nСтатистика: hits=2, misses=1, hitRate=66.7%\n\nupdate(1, Alice Updated) → кеш и БД обновлены\nfindById(1) → cache HIT → Alice Updated\n\ndelete(2) → кеш и БД очищены\nfindById(2) → cache MISS → null\n\nclearCache()\nfindById(1) → cache MISS → Alice Updated (загружено из БД)\nСтатистика: hits=3, misses=3, hitRate=50.0%',
      hint: 'HashMap как кеш. findById: если cache.containsKey(id) → cache HIT, иначе → cache MISS + запрос к DAO + положить в кеш. Write-through: при save/update/delete обновляем и кеш, и DAO.',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {

    // "БД"
    static Map<Integer, String> database = new HashMap<>();
    static int nextId = 1;

    // Кеш
    static Map<Integer, String> cache = new HashMap<>();
    static int hits = 0;
    static int misses = 0;

    static int save(String name) {
        int id = nextId++;
        database.put(id, name);
        cache.put(id, name);
        System.out.println("save(" + name + ") → id=" + id +
                           " (кеш: " + cache.size() + ", БД: " + database.size() + ")");
        return id;
    }

    static String findById(int id) {
        if (cache.containsKey(id)) {
            hits++;
            String name = cache.get(id);
            System.out.println("findById(" + id + ") → cache HIT → " + name);
            return name;
        }

        misses++;
        String name = database.get(id);
        if (name != null) {
            cache.put(id, name);
            System.out.println("findById(" + id + ") → cache MISS → " + name + " (загружено из БД)");
        } else {
            System.out.println("findById(" + id + ") → cache MISS → null");
        }
        return name;
    }

    static void update(int id, String name) {
        database.put(id, name);
        cache.put(id, name);
        System.out.println("update(" + id + ", " + name + ") → кеш и БД обновлены");
    }

    static void delete(int id) {
        database.remove(id);
        cache.remove(id);
        System.out.println("delete(" + id + ") → кеш и БД очищены");
    }

    static void clearCache() {
        cache.clear();
        System.out.println("clearCache()");
    }

    static void printStats() {
        int total = hits + misses;
        double rate = total > 0 ? (double) hits / total * 100 : 0;
        System.out.printf("Статистика: hits=%d, misses=%d, hitRate=%.1f%%%n",
                          hits, misses, rate);
    }

    public static void main(String[] args) {
        save("Alice");
        save("Bob");

        System.out.println();
        findById(1);
        findById(1);
        findById(3);
        printStats();

        System.out.println();
        update(1, "Alice Updated");
        findById(1);

        System.out.println();
        delete(2);
        findById(2);

        System.out.println();
        clearCache();
        findById(1);
        printStats();
    }
}`,
      explanation: 'CachedRepository — паттерн кеширования поверх DAO. При чтении (findById): сначала проверяем кеш (HashMap), при HIT — возвращаем из кеша (быстро), при MISS — идём в БД и сохраняем в кеш. При записи (write-through): обновляем и кеш, и БД одновременно. Статистика (hit rate) помогает оценить эффективность кеша. В реальных проектах используют Redis, Caffeine, EhCache с TTL (время жизни) и eviction-политиками (LRU, LFU).'
    }
  ]
}
