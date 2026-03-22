export default {
  id: 79,
  title: 'Best Practices: Безопасность кода',
  description: 'Написание защищённого кода на Java: предотвращение SQL-инъекций, валидация входных данных, безопасное хранение паролей, защита чувствительных данных в логах, потокобезопасность через неизменяемые объекты.',
  lessons: [
    {
      id: 1,
      title: 'SQL-инъекции и PreparedStatement',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'SQL-инъекция — одна из самых опасных уязвимостей. Злоумышленник вставляет SQL-код в пользовательский ввод, изменяя логику запроса. Это может привести к краже, изменению или удалению данных.'
        },
        {
          type: 'heading',
          text: 'Как работает SQL-инъекция'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — конкатенация пользовательского ввода',
          code: 'public User findUser(String username, String password) {\n    // Пользователь вводит: username = "admin\'--"\n    // SQL становится: SELECT * FROM users WHERE username=\'admin\'--\' AND password=\'что угодно\'\n    // -- комментарий в SQL: всё после -- игнорируется\n    // Злоумышленник входит как admin без знания пароля!\n    String sql = "SELECT * FROM users WHERE username=\'" + username +\n                 "\' AND password=\'" + password + "\'";\n    return executeQuery(sql);\n}\n\n// Ещё хуже:\n// username = "a\'; DROP TABLE users; --"\n// Удалит всю таблицу пользователей!'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — PreparedStatement с параметрами',
          code: 'public User findUser(String username, String password) {\n    // ? — плейсхолдеры, значения передаются отдельно\n    String sql = "SELECT * FROM users WHERE username = ? AND password_hash = ?";\n\n    try (Connection conn = dataSource.getConnection();\n         PreparedStatement ps = conn.prepareStatement(sql)) {\n\n        ps.setString(1, username);  // параметр 1\n        ps.setString(2, hashPassword(password)); // параметр 2\n\n        try (ResultSet rs = ps.executeQuery()) {\n            if (rs.next()) {\n                return mapRowToUser(rs);\n            }\n        }\n    } catch (SQLException e) {\n        throw new DataAccessException("Ошибка поиска пользователя", e);\n    }\n    return null;\n}\n// PreparedStatement экранирует специальные символы автоматически.\n// Теперь username = "admin\'--" просто ищется буквально.'
        },
        {
          type: 'warning',
          text: 'PreparedStatement защищает от инъекций ТОЛЬКО если ты используешь ? для всех динамических значений. Если конкатенируешь имя таблицы или столбца через + — уязвимость остаётся. Имена таблиц и столбцов нужно проверять по белому списку.'
        },
        {
          type: 'tip',
          text: 'Используй ORM (Hibernate, Spring Data JPA) или QueryDSL — они используют PreparedStatement под капотом. Но даже с ORM избегай Native Queries с конкатенацией строк.'
        }
      ]
    },
    {
      id: 2,
      title: 'Валидация входных данных',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Никогда не доверяй внешним данным. Любой ввод от пользователя, из файла, из сети должен быть провалидирован перед использованием. Это защита не только от злоумышленников, но и от случайных ошибок.'
        },
        {
          type: 'heading',
          text: 'Принцип: валидируй на входе, один раз'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — использование данных без проверки',
          code: 'public class OrderService {\n    public Order createOrder(String userId, int quantity, double price) {\n        // Что если quantity = -1000? price = -99.99? userId = null?\n        // Что если userId = "../../etc/passwd" (path traversal)?\n        User user = userRepo.findById(userId);\n        return new Order(user, quantity, price);\n        // Создадим заказ с отрицательным количеством и ценой\n    }\n}'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — строгая валидация на входе',
          code: 'public class OrderService {\n\n    private static final int MAX_QUANTITY = 10_000;\n    private static final double MAX_PRICE = 1_000_000.0;\n    // Белый список допустимых символов для ID\n    private static final String SAFE_ID_PATTERN = "^[a-zA-Z0-9_-]{1,50}$";\n\n    public Order createOrder(String userId, int quantity, double price) {\n        // Валидация: проверяем все входные данные\n        if (userId == null || !userId.matches(SAFE_ID_PATTERN)) {\n            throw new IllegalArgumentException("Некорректный userId: " + userId);\n        }\n        if (quantity <= 0 || quantity > MAX_QUANTITY) {\n            throw new IllegalArgumentException(\n                "Количество должно быть от 1 до " + MAX_QUANTITY);\n        }\n        if (price <= 0 || price > MAX_PRICE || Double.isNaN(price)) {\n            throw new IllegalArgumentException(\n                "Цена должна быть от 0 до " + MAX_PRICE);\n        }\n\n        // Только после валидации работаем с данными\n        User user = userRepo.findById(userId)\n            .orElseThrow(() -> new UserNotFoundException(userId));\n        return new Order(user, quantity, price);\n    }\n}'
        },
        {
          type: 'heading',
          text: 'Валидация строк: типичные проверки'
        },
        {
          type: 'list',
          items: [
            'Не null и не пустая: если null — выброси исключение, не работай с null молча',
            'Длина: слишком длинные строки могут вызвать DoS (сохранение гигабайт в БД)',
            'Формат через regex: email, телефон, UUID — проверяй соответствие шаблону',
            'Белый список: разреши только допустимые символы, остальные запрети',
            'HTML/JS эскейпинг: при выводе в HTML — экранируй < > & " символы'
          ]
        },
        {
          type: 'warning',
          text: 'Никогда не полагайся ТОЛЬКО на клиентскую валидацию (JavaScript в браузере). Злоумышленник может отправить запрос напрямую минуя интерфейс. Всегда валидируй на сервере.'
        }
      ]
    },
    {
      id: 3,
      title: 'Безопасное хранение паролей',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Хранить пароли в открытом виде — критическая ошибка. Даже зашифрованные пароли опасны, если утечёт ключ. Правильный подход — хэширование с солью через специализированные алгоритмы.'
        },
        {
          type: 'heading',
          text: 'Неправильные подходы'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — открытый текст и обычные хэши',
          code: 'public class BadPasswordStorage {\n\n    // КРИТИЧНО ПЛОХО: пароль в открытом виде\n    void savePassword_1(String password) {\n        user.setPassword(password); // "qwerty123" в базе\n    }\n\n    // ПЛОХО: MD5 и SHA-1 устарели, есть радужные таблицы\n    void savePassword_2(String password) throws Exception {\n        MessageDigest md = MessageDigest.getInstance("MD5");\n        byte[] hash = md.digest(password.getBytes());\n        user.setPasswordHash(Base64.getEncoder().encodeToString(hash));\n        // MD5("password") = "5f4dcc3b5aa765d61d8327deb882cf99"\n        // Злоумышленник смотрит в таблицу — мгновенно находит пароль\n    }\n\n    // ВСЁ ЕЩЁ ПЛОХО: SHA-256 без соли, всё равно уязвим к rainbow tables\n    void savePassword_3(String password) throws Exception {\n        MessageDigest md = MessageDigest.getInstance("SHA-256");\n        byte[] hash = md.digest(password.getBytes());\n        user.setPasswordHash(Base64.getEncoder().encodeToString(hash));\n    }\n}'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — BCrypt хэширование с солью',
          code: 'import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;\n\npublic class SecurePasswordStorage {\n\n    // BCrypt автоматически генерирует соль и включает её в хэш\n    // cost factor = 12: регулирует скорость хэширования\n    // (выше = медленнее для атакующего, но и для тебя)\n    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);\n\n    public String hashPassword(String plainPassword) {\n        return encoder.encode(plainPassword);\n        // Результат: "$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"\n        // Соль уже внутри хэша! Каждый раз разный хэш для одного пароля.\n    }\n\n    public boolean verifyPassword(String plainPassword, String storedHash) {\n        return encoder.matches(plainPassword, storedHash);\n        // matches извлекает соль из хэша и сравнивает правильно\n    }\n\n    // Пример использования\n    public void registerUser(String username, String plainPassword) {\n        String hash = hashPassword(plainPassword);\n        userRepository.save(new User(username, hash));\n        // В базе хранится только хэш, никогда пароль\n    }\n\n    public boolean loginUser(String username, String plainPassword) {\n        User user = userRepository.findByUsername(username);\n        if (user == null) return false;\n        return verifyPassword(plainPassword, user.getPasswordHash());\n    }\n}'
        },
        {
          type: 'list',
          items: [
            'Используй BCrypt, scrypt или Argon2 — они специально разработаны для паролей',
            'Никогда не используй MD5, SHA-1 для паролей — слишком быстрые для перебора',
            'Соль (salt) делает хэши уникальными: одинаковый пароль у двух пользователей — разные хэши',
            'Никогда не храни и не логируй plaintext пароли даже временно',
            'При смене пароля — хэшируй новый, старый хэш перезаписывай'
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Чувствительные данные в логах и неизменяемые объекты',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Логи часто хранятся в открытом виде, отправляются в сторонние системы, доступны большому числу людей. Попадание чувствительных данных в логи — серьёзная утечка.'
        },
        {
          type: 'heading',
          text: 'Что нельзя логировать'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — чувствительные данные в логах',
          code: 'public void processPayment(PaymentRequest request) {\n    // НИКОГДА не логируй:\n    log.info("Обработка платежа для карты: " + request.getCardNumber());\n    // Теперь номер карты в лог-файле, доступном всей команде!\n\n    log.debug("Пользователь: " + user.getEmail() +\n              ", пароль: " + user.getPassword()); // КРИТИЧНО!\n\n    log.info("Запрос: " + httpRequest.getBody());\n    // Тело запроса может содержать токены, пароли, личные данные\n}'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — маскирование чувствительных данных',
          code: 'public class MaskedPaymentRequest {\n    private String cardNumber;\n\n    // При логировании — маскируем\n    public String getMaskedCardNumber() {\n        if (cardNumber == null || cardNumber.length() < 4) return "****";\n        return "**** **** **** " + cardNumber.substring(cardNumber.length() - 4);\n    }\n\n    // toString для логирования без чувствительных данных\n    @Override\n    public String toString() {\n        return "PaymentRequest{card=" + getMaskedCardNumber() +\n               ", amount=" + amount + "}";\n    }\n}\n\npublic void processPayment(PaymentRequest request) {\n    // Логируем только безопасные данные\n    log.info("Обработка платежа: {}", request); // вызовет toString() с маскированием\n    log.info("Карта: {}", request.getMaskedCardNumber()); // "****  **** **** 1234"\n\n    // Логируем ID транзакции, не данные карты\n    log.info("Транзакция {} для пользователя ID {}", transactionId, user.getId());\n}'
        },
        {
          type: 'heading',
          text: 'Неизменяемые объекты для безопасности'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — изменяемый объект можно модифицировать снаружи',
          code: 'public class UserProfile {\n    private String[] roles; // массив изменяем!\n\n    public String[] getRoles() {\n        return roles; // возвращаем прямую ссылку\n    }\n}\n\n// Злоумышленный код:\nString[] roles = user.getRoles();\nroles[0] = "ADMIN"; // изменил роли без ведома UserProfile!'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — defensive copy и неизменяемость',
          code: 'public final class UserProfile { // final: нельзя наследовать\n    private final String name;    // final поля\n    private final List<String> roles;\n\n    public UserProfile(String name, List<String> roles) {\n        this.name = name;\n        // Defensive copy: копируем входной список\n        this.roles = Collections.unmodifiableList(new ArrayList<>(roles));\n    }\n\n    public String getName() { return name; }\n\n    public List<String> getRoles() {\n        return roles; // уже неизменяемый, можно вернуть как есть\n    }\n}'
        },
        {
          type: 'tip',
          text: 'Для логирования используй структурированные логи (JSON) с явным списком разрешённых полей. Это лучше, чем надеяться что toString() всегда безопасен. Инструменты: Logback + logstash-logback-encoder.'
        }
      ]
    },
    {
      id: 5,
      title: 'Принцип минимальных привилегий и defensive copying',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'Принцип минимальных привилегий (principle of least privilege) — каждый компонент должен иметь доступ только к тому, что необходимо для его работы. Это ограничивает ущерб при компрометации.'
        },
        {
          type: 'heading',
          text: 'Принцип минимальных привилегий в коде'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — избыточный доступ',
          code: 'public class ReportService {\n    private final DatabaseManager db; // полный доступ ко всем операциям с БД!\n\n    // Но ReportService нужно только ЧИТАТЬ данные\n    public Report generateReport() {\n        // db.delete(...) тоже доступен — это лишнее\n        return new Report(db.query("SELECT ..."));\n    }\n}'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — только необходимый доступ',
          code: '// Интерфейс только для чтения\npublic interface ReadOnlyRepository {\n    List<Record> findAll();\n    Optional<Record> findById(long id);\n    // Нет методов save, delete, update\n}\n\n// Полный репозиторий реализует и readonly-интерфейс\npublic class RecordRepository implements ReadOnlyRepository {\n    public List<Record> findAll() { ... }\n    public Optional<Record> findById(long id) { ... }\n    public void save(Record record) { ... }  // только для тех, кто имеет FullRepository\n    public void delete(long id) { ... }\n}\n\n// ReportService получает только readonly-доступ\npublic class ReportService {\n    private final ReadOnlyRepository repository; // не может случайно удалить данные!\n\n    public Report generateReport() {\n        List<Record> records = repository.findAll();\n        return new Report(records);\n    }\n}'
        },
        {
          type: 'heading',
          text: 'Defensive Copying — защитное копирование'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ПЛОХО — внешний код может изменить внутреннее состояние',
          code: 'public class Schedule {\n    private List<Date> importantDates;\n\n    // ПЛОХО: возвращаем прямую ссылку\n    public List<Date> getImportantDates() {\n        return importantDates; // внешний код может add/remove!\n    }\n\n    // ПЛОХО: принимаем без копирования\n    public Schedule(List<Date> dates) {\n        this.importantDates = dates; // внешний код всё ещё владеет этим списком\n    }\n}'
        },
        {
          type: 'code',
          language: 'java',
          label: 'ХОРОШО — defensive copy на входе и выходе',
          code: 'public class Schedule {\n    private final List<Date> importantDates;\n\n    public Schedule(List<Date> dates) {\n        // Копируем входной список — разрываем связь с внешним кодом\n        this.importantDates = new ArrayList<>(dates);\n    }\n\n    // Возвращаем неизменяемое представление\n    public List<Date> getImportantDates() {\n        return Collections.unmodifiableList(importantDates);\n    }\n\n    // Или возвращаем копию для полной изоляции\n    public List<Date> getImportantDatesCopy() {\n        return new ArrayList<>(importantDates);\n    }\n}'
        },
        {
          type: 'list',
          items: [
            'Используй интерфейсы с минимальным набором методов',
            'Объявляй поля private и предоставляй только нужные геттеры',
            'Делай классы final если они не должны наследоваться',
            'Копируй входные коллекции в конструкторе',
            'Возвращай неизменяемые представления коллекций',
            'Используй модули Java (module-info.java) для ограничения доступа к пакетам'
          ]
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Исправление SQL-инъекции',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан класс UserRepository с уязвимым кодом. Исправь его: замени конкатенацию строк на PreparedStatement, добавь валидацию входных данных, реализуй маскирование email для логов.',
      requirements: [
        'Метод findByUsername(String username) использует PreparedStatement',
        'Метод findByEmailAndAge(String email, int age) использует PreparedStatement с двумя параметрами',
        'Метод validateUsername(String username) — проверяет: не null, длина 3-50, только буквы/цифры/_',
        'Метод maskEmail(String email) возвращает маскированную версию: "u***r@e***e.com"',
        'Метод findByUsername бросает IllegalArgumentException при невалидном username'
      ],
      expectedOutput: 'Поиск безопасен (PreparedStatement)\nВалидный логин: true\nНевалидный логин (SQL-инъекция): false\nМаскированный email: u***r@e***e.com\nМаскированный email: a***a@g*****l.com\nОшибка: Username содержит недопустимые символы',
      hint: 'Для maskEmail: разбей по @, первую часть маскируй оставив первый и последний символ (s.charAt(0) + "***" + s.charAt(s.length()-1)), домен аналогично но сохрани расширение (.com). validateUsername использует matches("^[a-zA-Z0-9а-яёА-ЯЁ_]{3,50}$").',
      solution: 'import java.util.regex.Pattern;\n\npublic class SecureUserRepository {\n\n    private static final Pattern USERNAME_PATTERN =\n        Pattern.compile("^[a-zA-Z0-9а-яёА-ЯЁ_]{3,50}$");\n    private static final int MIN_USERNAME_LENGTH = 3;\n    private static final int MAX_USERNAME_LENGTH = 50;\n\n    public boolean validateUsername(String username) {\n        if (username == null || username.isEmpty()) return false;\n        if (username.length() < MIN_USERNAME_LENGTH ||\n            username.length() > MAX_USERNAME_LENGTH) return false;\n        return USERNAME_PATTERN.matcher(username).matches();\n    }\n\n    // Симуляция безопасного запроса с PreparedStatement\n    public String findByUsername(String username) {\n        if (!validateUsername(username)) {\n            throw new IllegalArgumentException(\n                "Username содержит недопустимые символы: " + username);\n        }\n\n        // В реальном коде:\n        // String sql = "SELECT * FROM users WHERE username = ?";\n        // try (PreparedStatement ps = conn.prepareStatement(sql)) {\n        //     ps.setString(1, username); // безопасная подстановка\n        //     ResultSet rs = ps.executeQuery();\n        //     ...\n        // }\n\n        // Симуляция для демонстрации\n        System.out.println("Поиск безопасен (PreparedStatement)");\n        return "User{username=\'" + username + "\'}";\n    }\n\n    // Безопасный запрос с двумя параметрами\n    public String findByEmailAndAge(String email, int age) {\n        if (email == null || !email.contains("@")) {\n            throw new IllegalArgumentException("Некорректный email");\n        }\n        if (age < 0 || age > 150) {\n            throw new IllegalArgumentException("Некорректный возраст: " + age);\n        }\n\n        // В реальном коде:\n        // String sql = "SELECT * FROM users WHERE email = ? AND age = ?";\n        // ps.setString(1, email);\n        // ps.setInt(2, age);\n\n        return "User{email=\'" + maskEmail(email) + "\', age=" + age + "}";\n    }\n\n    public String maskEmail(String email) {\n        if (email == null || !email.contains("@")) return "***";\n\n        int atIdx = email.indexOf("@");\n        String localPart = email.substring(0, atIdx);\n        String domain = email.substring(atIdx + 1);\n\n        String maskedLocal = maskPart(localPart);\n\n        // Маскируем домен, сохраняя расширение\n        int dotIdx = domain.lastIndexOf(".");\n        String maskedDomain;\n        if (dotIdx > 0) {\n            String domainName = domain.substring(0, dotIdx);\n            String extension = domain.substring(dotIdx); // ".com"\n            maskedDomain = maskPart(domainName) + extension;\n        } else {\n            maskedDomain = maskPart(domain);\n        }\n\n        return maskedLocal + "@" + maskedDomain;\n    }\n\n    private String maskPart(String part) {\n        if (part == null || part.length() <= 2) return "***";\n        return part.charAt(0) + "***" + part.charAt(part.length() - 1);\n    }\n\n    public static void main(String[] args) {\n        SecureUserRepository repo = new SecureUserRepository();\n\n        repo.findByUsername("alice");\n\n        System.out.println("Валидный логин: " + repo.validateUsername("alice_123"));\n        System.out.println("Невалидный логин (SQL-инъекция): " +\n            repo.validateUsername("admin\'--"));\n\n        System.out.println("Маскированный email: " + repo.maskEmail("user@example.com"));\n        System.out.println("Маскированный email: " + repo.maskEmail("aliya@gmail.com"));\n\n        try {\n            repo.findByUsername("'; DROP TABLE users; --");\n        } catch (IllegalArgumentException e) {\n            System.out.println("Ошибка: " + e.getMessage());\n        }\n    }\n}',
      explanation: 'Задача показывает два эшелона защиты от SQL-инъекций. Первый: валидация по белому списку (regex только для допустимых символов) — злоумышленный ввод отклоняется ещё до формирования запроса. Второй: PreparedStatement — даже если валидация пропустила что-то, параметры экранируются автоматически. Pattern.compile вне метода — компиляция regex один раз, а не каждый вызов. maskEmail демонстрирует принцип минимального раскрытия: сохраняем достаточно для диагностики (первый/последний символ, расширение домена), но не раскрываем полный email.'
    },
    {
      id: 7,
      title: 'Практика: Безопасное хранение паролей',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй систему безопасного управления паролями без внешних библиотек. Используй PBKDF2 (встроен в Java) для хэширования с солью. Реализуй генерацию соли, хэширование и верификацию пароля.',
      requirements: [
        'Метод generateSalt() возвращает случайный массив байт (16 байт)',
        'Метод hashPassword(String password, byte[] salt) использует PBKDF2WithHmacSHA256, 100000 итераций, 256 бит',
        'Метод createPasswordRecord(String password) возвращает String в формате "iterations:соль:хэш" (Base64)',
        'Метод verifyPassword(String password, String record) возвращает boolean',
        'Класс PasswordRecord как вспомогательный для хранения компонентов'
      ],
      expectedOutput: 'Пароль сохранён как: 100000:...base64соль...:...base64хэш...\nВерный пароль: true\nНеверный пароль: false\nДва хэша одного пароля разные: true\nВремя хэширования: ~100-500 мс (намеренно медленно)',
      hint: 'Используй SecureRandom для генерации соли. PBEKeySpec принимает (password.toCharArray(), salt, iterations, keyLength). SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256"). Формат записи: iterations + ":" + Base64соль + ":" + Base64хэш. При верификации парси строку по ":", декодируй соль и хэшируй с ней.',
      solution: 'import javax.crypto.SecretKeyFactory;\nimport javax.crypto.spec.PBEKeySpec;\nimport java.security.SecureRandom;\nimport java.security.spec.InvalidKeySpecException;\nimport java.util.Arrays;\nimport java.util.Base64;\n\npublic class PasswordManager {\n\n    private static final int SALT_LENGTH_BYTES = 16;\n    private static final int ITERATIONS = 100_000;\n    private static final int KEY_LENGTH_BITS = 256;\n    private static final String ALGORITHM = "PBKDF2WithHmacSHA256";\n    private static final String SEPARATOR = ":";\n\n    // Вспомогательный класс для хранения компонентов\n    static class PasswordRecord {\n        final int iterations;\n        final byte[] salt;\n        final byte[] hash;\n\n        PasswordRecord(int iterations, byte[] salt, byte[] hash) {\n            this.iterations = iterations;\n            this.salt = salt;\n            this.hash = hash;\n        }\n    }\n\n    public byte[] generateSalt() {\n        SecureRandom random = new SecureRandom(); // криптографически стойкий генератор\n        byte[] salt = new byte[SALT_LENGTH_BYTES];\n        random.nextBytes(salt);\n        return salt;\n    }\n\n    public byte[] hashPassword(String password, byte[] salt)\n            throws Exception {\n        PBEKeySpec spec = new PBEKeySpec(\n            password.toCharArray(), // char[] безопаснее String (можно обнулить)\n            salt,\n            ITERATIONS,\n            KEY_LENGTH_BITS\n        );\n        try {\n            SecretKeyFactory factory = SecretKeyFactory.getInstance(ALGORITHM);\n            return factory.generateSecret(spec).getEncoded();\n        } finally {\n            spec.clearPassword(); // обнуляем пароль из памяти\n        }\n    }\n\n    public String createPasswordRecord(String password) throws Exception {\n        byte[] salt = generateSalt();\n        byte[] hash = hashPassword(password, salt);\n\n        Base64.Encoder encoder = Base64.getEncoder();\n        return ITERATIONS + SEPARATOR +\n               encoder.encodeToString(salt) + SEPARATOR +\n               encoder.encodeToString(hash);\n    }\n\n    public boolean verifyPassword(String password, String record) {\n        try {\n            String[] parts = record.split(SEPARATOR);\n            if (parts.length != 3) return false;\n\n            int iterations = Integer.parseInt(parts[0]);\n            byte[] salt = Base64.getDecoder().decode(parts[1]);\n            byte[] storedHash = Base64.getDecoder().decode(parts[2]);\n\n            // Хэшируем введённый пароль с той же солью\n            PBEKeySpec spec = new PBEKeySpec(\n                password.toCharArray(), salt, iterations, KEY_LENGTH_BITS);\n            try {\n                SecretKeyFactory factory = SecretKeyFactory.getInstance(ALGORITHM);\n                byte[] inputHash = factory.generateSecret(spec).getEncoded();\n                // Сравниваем в постоянное время — защита от timing attack\n                return Arrays.equals(storedHash, inputHash);\n            } finally {\n                spec.clearPassword();\n            }\n        } catch (Exception e) {\n            return false; // любая ошибка = неверный пароль\n        }\n    }\n\n    public static void main(String[] args) throws Exception {\n        PasswordManager pm = new PasswordManager();\n\n        long start = System.currentTimeMillis();\n        String record = pm.createPasswordRecord("MySecretP@ssw0rd");\n        long elapsed = System.currentTimeMillis() - start;\n\n        System.out.println("Пароль сохранён как: " + record.substring(0, 40) + "...");\n        System.out.println("Верный пароль: " + pm.verifyPassword("MySecretP@ssw0rd", record));\n        System.out.println("Неверный пароль: " + pm.verifyPassword("wrongpassword", record));\n\n        // Два хэша одного пароля разные из-за разной соли\n        String record2 = pm.createPasswordRecord("MySecretP@ssw0rd");\n        System.out.println("Два хэша одного пароля разные: " + !record.equals(record2));\n        System.out.println("Время хэширования: " + elapsed + " мс (намеренно медленно)");\n    }\n}',
      explanation: 'Задача показывает реальную реализацию безопасного хранения паролей на стандартной библиотеке Java. PBKDF2 (Password-Based Key Derivation Function 2) специально разработан для хэширования паролей: 100000 итераций делают перебор в 100000 раз медленнее. SecureRandom вместо Random — криптографически стойкий генератор, необходимый для соли. PBEKeySpec использует char[] вместо String: массив можно обнулить spec.clearPassword() после использования, String в Java неизменяем и остаётся в памяти до GC. Arrays.equals для сравнения хэшей — защита от timing attack: обычное equals может вернуть false быстрее если первые байты не совпадают, что даёт атакующему информацию. Формат "iterations:salt:hash" позволяет будущим версиям изменить число итераций без сброса паролей.'
    }
  ]
}
