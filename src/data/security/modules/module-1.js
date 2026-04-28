export default {
  id: 1,
  title: 'Основы безопасности',
  description: 'Аутентификация vs авторизация, основные угрозы и принципы защиты backend-приложений',
  lessons: [
    {
      id: 1,
      title: 'Что такое информационная безопасность?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Информационная безопасность (InfoSec) -- это защита данных от несанкционированного доступа, изменения и уничтожения. В мире backend-разработки это означает: только нужные люди получают доступ к нужным данным.' },
        { type: 'tip', value: 'Представь банковское приложение Kaspi. Когда ты входишь -- система проверяет, что ты это ты (аутентификация). Когда ты пытаешься перевести деньги -- система проверяет, есть ли у тебя право на эту операцию (авторизация).' },
        { type: 'heading', value: 'Триада CIA' },
        { type: 'text', value: 'Основа информационной безопасности -- три принципа (CIA triad):' },
        { type: 'list', items: [
          'Confidentiality (конфиденциальность) -- данные видят только те, кому положено',
          'Integrity (целостность) -- данные не могут быть изменены незаметно',
          'Availability (доступность) -- система доступна для легитимных пользователей'
        ]},
        { type: 'heading', value: 'Почему безопасность важна?' },
        { type: 'list', items: [
          'Утечка данных пользователей -- штрафы, потеря доверия, судебные иски',
          'Взлом API -- злоумышленник может читать, изменять, удалять данные',
          'DDoS атаки -- сервис становится недоступным для клиентов',
          'Финансовые потери -- украденные средства, мошенничество'
        ]},
        { type: 'note', value: 'По данным IBM, средняя стоимость утечки данных в 2024 году составила $4.88 млн. Безопасность -- это не "приятное дополнение", а обязательное требование.' }
      ]
    },
    {
      id: 2,
      title: 'Аутентификация vs Авторизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Два самых важных термина в безопасности -- аутентификация и авторизация. Их часто путают, но это разные вещи.' },
        { type: 'heading', value: 'Аутентификация (Authentication)' },
        { type: 'text', value: 'Аутентификация -- это проверка личности. КТО ты? Система подтверждает, что ты -- это действительно ты.' },
        { type: 'list', items: [
          'Логин + пароль -- самый распространённый способ',
          'Биометрия -- отпечаток пальца, Face ID',
          'Одноразовый код (OTP) -- SMS или приложение-аутентификатор',
          'Сертификат -- цифровой документ, подтверждающий личность'
        ]},
        { type: 'heading', value: 'Авторизация (Authorization)' },
        { type: 'text', value: 'Авторизация -- это проверка прав. ЧТО тебе разрешено делать? После того как система узнала кто ты, она проверяет твои полномочия.' },
        { type: 'tip', value: 'Аналогия: аутентификация -- это паспортный контроль в аэропорту (кто ты?). Авторизация -- это проверка билета (куда тебе можно лететь?). Сначала проверяют паспорт, потом -- билет.' },
        { type: 'code', language: 'java', value: '// Упрощённая модель аутентификации и авторизации\npublic class Main {\n    public static void main(String[] args) {\n        // Шаг 1: Аутентификация -- КТО ты?\n        String username = "admin";\n        String password = "myP@ssw0rd";\n        \n        boolean isAuthenticated = authenticate(username, password);\n        System.out.println("Аутентификация: " + (isAuthenticated ? "успешно" : "отказано"));\n        \n        // Шаг 2: Авторизация -- ЧТО тебе можно?\n        if (isAuthenticated) {\n            String role = "ADMIN";\n            boolean canDeleteUsers = authorize(role, "DELETE_USER");\n            System.out.println("Право удалять пользователей: " + canDeleteUsers);\n        }\n    }\n    \n    static boolean authenticate(String username, String password) {\n        // В реальности -- проверка в базе данных\n        return "admin".equals(username) && "myP@ssw0rd".equals(password);\n    }\n    \n    static boolean authorize(String role, String permission) {\n        // ADMIN может всё, USER -- только чтение\n        if ("ADMIN".equals(role)) return true;\n        if ("USER".equals(role) && "READ".equals(permission)) return true;\n        return false;\n    }\n}' },
        { type: 'warning', value: 'Никогда не путай аутентификацию и авторизацию в коде! Если пользователь аутентифицирован (вошёл), это НЕ значит, что ему можно всё. Всегда проверяй права.' }
      ]
    },
    {
      id: 3,
      title: 'Основные угрозы безопасности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Чтобы защищаться, нужно знать от чего. Рассмотрим основные типы атак на backend-приложения.' },
        { type: 'heading', value: 'Атаки на аутентификацию' },
        { type: 'list', items: [
          'Brute Force -- перебор паролей (миллионы комбинаций в секунду)',
          'Credential Stuffing -- использование утёкших паролей с других сайтов',
          'Phishing -- поддельные страницы входа для кражи логина/пароля',
          'Session Hijacking -- перехват сессии авторизованного пользователя'
        ]},
        { type: 'heading', value: 'Атаки на данные' },
        { type: 'list', items: [
          'SQL Injection -- внедрение вредоносного SQL-кода',
          'XSS (Cross-Site Scripting) -- внедрение JavaScript в страницу',
          'CSRF (Cross-Site Request Forgery) -- подделка запросов от имени пользователя',
          'Man-in-the-Middle -- перехват данных между клиентом и сервером'
        ]},
        { type: 'heading', value: 'Пример: Brute Force атака' },
        { type: 'code', language: 'java', value: 'public class Main {\n    // Имитация защиты от brute force\n    private static int failedAttempts = 0;\n    private static final int MAX_ATTEMPTS = 3;\n    private static long lockUntil = 0;\n    \n    public static void main(String[] args) {\n        // Злоумышленник пытается подобрать пароль\n        String[] attempts = {"123456", "password", "admin123", "correctPassword"};\n        \n        for (String attempt : attempts) {\n            System.out.println("Попытка входа с паролем: " + attempt);\n            boolean result = login("admin", attempt);\n            System.out.println("Результат: " + (result ? "УСПЕХ" : "ОТКАЗ"));\n            System.out.println("---");\n        }\n    }\n    \n    static boolean login(String username, String password) {\n        // Проверяем блокировку\n        if (System.currentTimeMillis() < lockUntil) {\n            System.out.println("Аккаунт заблокирован! Подождите.");\n            return false;\n        }\n        \n        if ("admin".equals(username) && "correctPassword".equals(password)) {\n            failedAttempts = 0;\n            return true;\n        }\n        \n        failedAttempts++;\n        if (failedAttempts >= MAX_ATTEMPTS) {\n            lockUntil = System.currentTimeMillis() + 30000; // блокировка 30 сек\n            System.out.println("Слишком много попыток! Блокировка на 30 секунд.");\n        }\n        return false;\n    }\n}' },
        { type: 'note', value: 'Реальные системы (Google, GitHub) используют CAPTCHA, временные блокировки, уведомления о подозрительном входе и двухфакторную аутентификацию для защиты от brute force.' }
      ]
    },
    {
      id: 4,
      title: 'Принципы безопасной разработки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существуют проверенные принципы, которые помогают создавать безопасные приложения. Следуя им, ты избежишь 90% типичных уязвимостей.' },
        { type: 'heading', value: 'Principle of Least Privilege (Принцип минимальных привилегий)' },
        { type: 'text', value: 'Давай каждому пользователю и компоненту только те права, которые необходимы для выполнения задачи. Ни больше, ни меньше.' },
        { type: 'heading', value: 'Defense in Depth (Эшелонированная защита)' },
        { type: 'text', value: 'Не полагайся на один уровень защиты. Используй несколько: firewall + аутентификация + авторизация + шифрование + логирование.' },
        { type: 'heading', value: 'Fail Securely (Безопасный отказ)' },
        { type: 'text', value: 'Если что-то пошло не так -- система должна блокировать доступ, а не открывать его.' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        // ПЛОХО: при ошибке -- доступ открыт\n        System.out.println("=== Небезопасный подход ===" );\n        System.out.println("Доступ: " + unsafeCheck("admin"));\n        System.out.println("Доступ (ошибка): " + unsafeCheck(null));\n        \n        // ХОРОШО: при ошибке -- доступ закрыт\n        System.out.println("\\n=== Безопасный подход ===" );\n        System.out.println("Доступ: " + safeCheck("admin"));\n        System.out.println("Доступ (ошибка): " + safeCheck(null));\n    }\n    \n    // ПЛОХО: при ошибке доступ ОТКРЫТ\n    static boolean unsafeCheck(String role) {\n        try {\n            return role.equals("admin");\n        } catch (Exception e) {\n            return true; // ОПАСНО! При ошибке даём доступ всем\n        }\n    }\n    \n    // ХОРОШО: при ошибке доступ ЗАКРЫТ\n    static boolean safeCheck(String role) {\n        try {\n            return "admin".equals(role); // ещё и null-safe!\n        } catch (Exception e) {\n            return false; // Безопасно: при любой ошибке -- отказ\n        }\n    }\n}' },
        { type: 'heading', value: 'Другие важные принципы' },
        { type: 'list', items: [
          'Don\'t Trust User Input -- всегда валидируй входные данные',
          'Security by Design -- думай о безопасности с первого дня, а не после взлома',
          'Keep It Simple -- сложные системы сложнее защитить',
          'Log Everything -- логируй все действия безопасности для аудита'
        ]},
        { type: 'tip', value: 'В Kaspi Bank каждое действие логируется: кто, когда, откуда, что сделал. Если произойдёт инцидент -- можно будет восстановить всю картину.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Проверка входа с защитой',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй систему логина с защитой от brute force -- блокировка после 5 неудачных попыток.',
      requirements: [
        'Создай класс Main с методом main',
        'Храни пользователей в HashMap (username -> password)',
        'Считай неудачные попытки для каждого пользователя',
        'Блокируй аккаунт после 5 неудачных попыток',
        'Выводи результат каждой попытки входа'
      ],
      expectedOutput: 'Попытка: admin/wrong1 -> ОТКАЗ (попытка 1/5)\nПопытка: admin/wrong2 -> ОТКАЗ (попытка 2/5)\nПопытка: admin/wrong3 -> ОТКАЗ (попытка 3/5)\nПопытка: admin/wrong4 -> ОТКАЗ (попытка 4/5)\nПопытка: admin/wrong5 -> ОТКАЗ (попытка 5/5)\nПопытка: admin/correct -> ЗАБЛОКИРОВАН\nПопытка: user/userpass -> УСПЕХ',
      hint: 'Используй HashMap<String, Integer> для хранения счётчика неудачных попыток каждого пользователя.',
      solution: 'import java.util.HashMap;\nimport java.util.Map;\n\npublic class Main {\n    static Map<String, String> users = new HashMap<>();\n    static Map<String, Integer> failedAttempts = new HashMap<>();\n    static final int MAX_ATTEMPTS = 5;\n    \n    public static void main(String[] args) {\n        users.put("admin", "securePass123");\n        users.put("user", "userpass");\n        \n        // Имитация brute force на admin\n        tryLogin("admin", "wrong1");\n        tryLogin("admin", "wrong2");\n        tryLogin("admin", "wrong3");\n        tryLogin("admin", "wrong4");\n        tryLogin("admin", "wrong5");\n        tryLogin("admin", "securePass123"); // уже заблокирован\n        tryLogin("user", "userpass"); // другой пользователь -- ОК\n    }\n    \n    static void tryLogin(String username, String password) {\n        int attempts = failedAttempts.getOrDefault(username, 0);\n        \n        if (attempts >= MAX_ATTEMPTS) {\n            System.out.println("Попытка: " + username + "/" + password + " -> ЗАБЛОКИРОВАН");\n            return;\n        }\n        \n        String storedPassword = users.get(username);\n        if (storedPassword != null && storedPassword.equals(password)) {\n            failedAttempts.put(username, 0);\n            System.out.println("Попытка: " + username + "/" + password + " -> УСПЕХ");\n        } else {\n            attempts++;\n            failedAttempts.put(username, attempts);\n            System.out.println("Попытка: " + username + "/" + password + " -> ОТКАЗ (попытка " + attempts + "/" + MAX_ATTEMPTS + ")");\n        }\n    }\n}',
      explanation: 'Мы используем две HashMap: одну для хранения пользователей, вторую -- для счётчика неудачных попыток. При каждой ошибке счётчик увеличивается. После 5 ошибок аккаунт блокируется. При успешном входе счётчик сбрасывается. Это базовая защита от brute force.'
    },
    {
      id: 6,
      title: 'Практика: Система ролей',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай простую систему аутентификации и авторизации с тремя ролями: ADMIN, MODERATOR, USER.',
      requirements: [
        'Создай класс Main с методом main',
        'Определи 3 роли: ADMIN, MODERATOR, USER',
        'ADMIN -- все права (read, write, delete)',
        'MODERATOR -- read и write',
        'USER -- только read',
        'Проверь доступ каждой роли ко всем операциям'
      ],
      expectedOutput: 'admin (ADMIN):\n  read: true\n  write: true\n  delete: true\nmoderator (MODERATOR):\n  read: true\n  write: true\n  delete: false\nuser (USER):\n  read: true\n  write: false\n  delete: false',
      hint: 'Используй Map<String, Set<String>> для хранения прав каждой роли.',
      solution: 'import java.util.*;\n\npublic class Main {\n    static Map<String, String> userRoles = new HashMap<>();\n    static Map<String, Set<String>> rolePermissions = new HashMap<>();\n    \n    public static void main(String[] args) {\n        // Настройка ролей и прав\n        rolePermissions.put("ADMIN", new HashSet<>(Arrays.asList("read", "write", "delete")));\n        rolePermissions.put("MODERATOR", new HashSet<>(Arrays.asList("read", "write")));\n        rolePermissions.put("USER", new HashSet<>(Arrays.asList("read")));\n        \n        // Назначение ролей пользователям\n        userRoles.put("admin", "ADMIN");\n        userRoles.put("moderator", "MODERATOR");\n        userRoles.put("user", "USER");\n        \n        // Проверка доступа\n        String[] users = {"admin", "moderator", "user"};\n        String[] actions = {"read", "write", "delete"};\n        \n        for (String u : users) {\n            String role = userRoles.get(u);\n            System.out.println(u + " (" + role + "):");\n            for (String action : actions) {\n                boolean allowed = hasPermission(u, action);\n                System.out.println("  " + action + ": " + allowed);\n            }\n        }\n    }\n    \n    static boolean hasPermission(String username, String action) {\n        String role = userRoles.get(username);\n        if (role == null) return false;\n        Set<String> permissions = rolePermissions.get(role);\n        if (permissions == null) return false;\n        return permissions.contains(action);\n    }\n}',
      explanation: 'Это базовая реализация RBAC (Role-Based Access Control). Каждому пользователю назначена роль, каждой роли -- набор разрешений. Метод hasPermission проверяет, имеет ли пользователь право на действие через его роль. Это фундамент авторизации в любом приложении.'
    }
  ]
}
