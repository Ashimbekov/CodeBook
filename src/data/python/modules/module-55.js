export default {
  id: 55,
  title: 'Безопасность',
  description: 'Безопасность Python кода: SQL-инъекции, секреты в коде, валидация ввода, зависимости',
  lessons: [
    {
      id: 1,
      title: 'Управление секретами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Секреты в коде — одна из самых частых уязвимостей. Пароли, API-ключи, токены никогда не должны быть захардкожены.' },
        { type: 'code', language: 'python', value: '# ПЛОХО: секреты в коде\nDB_PASSWORD = "super_secret_123"\nAPI_KEY = "sk-abcdef123456"\nSECRET_KEY = "my-secret-key"\n\n# ХОРОШО: переменные окружения\nimport os\nfrom dotenv import load_dotenv\n\nload_dotenv()  # загружает .env файл\n\nDB_PASSWORD = os.environ.get("DB_PASSWORD")\nAPI_KEY = os.environ.get("API_KEY")\nSECRET_KEY = os.environ.get("SECRET_KEY")\n\n# Проверка наличия обязательных секретов\nrequired_env_vars = ["DB_PASSWORD", "SECRET_KEY", "API_KEY"]\nfor var in required_env_vars:\n    if not os.environ.get(var):\n        raise RuntimeError(f"Обязательная переменная окружения {var!r} не задана")\n\n# .env файл (в .gitignore!):\n# DB_PASSWORD=very_secret_password\n# API_KEY=sk-abcdef123456\n# SECRET_KEY=random-256-bit-key\n\n# Генерация безопасных секретов\nimport secrets\n\n# Для SECRET_KEY Flask/Django\nsecret_key = secrets.token_hex(32)      # 64 hex символа\napi_token = secrets.token_urlsafe(32)   # URL-safe base64\npassword = secrets.token_hex(16)        # случайный пароль\n\nprint(f"Сгенерированный SECRET_KEY: {secret_key}")\n\n# Проверка на утечку в git\n# git-secrets: pip install git-secrets\n# truffleHog: анализирует историю git на секреты' },
        { type: 'warning', value: 'Если случайно закоммитил секрет — немедленно отзови его (смени пароль/токен). Удаление коммита не помогает — он уже мог быть склонирован или проиндексирован.' }
      ]
    },
    {
      id: 2,
      title: 'SQL-инъекции: параметризованные запросы',
      type: 'theory',
      content: [
        { type: 'text', value: 'SQL-инъекция — вставка вредоносного SQL через пользовательский ввод. Всегда используй параметризованные запросы, никогда не форматируй SQL строками.' },
        { type: 'code', language: 'python', value: 'import sqlite3\n\nconn = sqlite3.connect("users.db")\ncursor = conn.cursor()\n\n# КРИТИЧЕСКАЯ УЯЗВИМОСТЬ: SQL-инъекция\nusername = "admin\' OR \'1\'=\'1\' --"\n\n# ПЛОХО: конкатенация строк\nquery = f"SELECT * FROM users WHERE username = \'{username}\'"\n# Итоговый запрос: SELECT * FROM users WHERE username = \'admin\' OR \'1\'=\'1\' --\'\n# Вернёт ВСЕХ пользователей!\ncursor.execute(query)  # ОПАСНО!\n\n# ХОРОШО: параметризованные запросы\ncursor.execute("SELECT * FROM users WHERE username = ?", (username,))\n# SQLite использует ? в качестве placeholder\n\n# PostgreSQL (psycopg2) использует %s\n# cursor.execute("SELECT * FROM users WHERE username = %s", (username,))\n\n# Несколько параметров\ncursor.execute(\n    "SELECT * FROM users WHERE username = ? AND role = ?\",\n    (username, \'admin\')\n)\n\n# ORM автоматически защищает от инъекций\n# Django ORM:\n# User.objects.filter(username=username)  # безопасно\n# User.objects.raw(f"SELECT * WHERE username={username}")  # опасно!\n\n# SQLAlchemy:\n# session.query(User).filter(User.username == username)  # безопасно\n\n# Валидация входных данных\ndef get_user_by_username(conn, username: str):\n    if not isinstance(username, str) or len(username) > 50:\n        raise ValueError("Некорректное имя пользователя")\n    cursor = conn.cursor()\n    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))\n    return cursor.fetchone()' }
      ]
    },
    {
      id: 3,
      title: 'Валидация и санитизация ввода',
      type: 'theory',
      content: [
        { type: 'text', value: 'Никогда не доверяй пользовательскому вводу. Валидируй формат, санитизируй содержимое, ограничивай длину.' },
        { type: 'code', language: 'python', value: 'import re\nimport html\nfrom pathlib import Path\n\n# Валидация email\ndef validate_email(email: str) -> bool:\n    pattern = r\'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\'\n    return bool(re.match(pattern, email)) and len(email) <= 254\n\n# Валидация с Pydantic (рекомендуется)\nfrom pydantic import BaseModel, validator, EmailStr\n\nclass UserRegistration(BaseModel):\n    username: str\n    email: str\n    age: int\n    password: str\n\n    @validator(\'username\')\n    def username_valid(cls, v):\n        if not re.match(r\'^[a-zA-Z0-9_]{3,30}$\', v):\n            raise ValueError(\'Имя пользователя: 3-30 символов, a-z, 0-9, _\')\n        return v\n\n    @validator(\'age\')\n    def age_valid(cls, v):\n        if not 18 <= v <= 120:\n            raise ValueError(\'Возраст должен быть от 18 до 120\')\n        return v\n\n    @validator(\'password\')\n    def password_strong(cls, v):\n        if len(v) < 8:\n            raise ValueError(\'Пароль минимум 8 символов\')\n        if not any(c.isupper() for c in v):\n            raise ValueError(\'Пароль должен содержать заглавную букву\')\n        return v\n\n# HTML экранирование (защита от XSS)\nuser_input = "<script>alert(\'XSS\')</script>"\nsafe_output = html.escape(user_input)\nprint(safe_output)  # &lt;script&gt;alert(&#x27;XSS&#x27;)&lt;/script&gt;\n\n# Path traversal защита\ndef safe_read_file(filename: str, base_dir: str = "/safe/dir") -> str:\n    # Нормализация и проверка что файл внутри base_dir\n    safe_path = Path(base_dir) / filename\n    safe_path = safe_path.resolve()  # убирает .. и симлинки\n    if not str(safe_path).startswith(base_dir):\n        raise ValueError(f"Доступ запрещён: {filename}")\n    return safe_path.read_text()' }
      ]
    },
    {
      id: 4,
      title: 'Безопасное хранение паролей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пароли никогда не хранятся в открытом виде. Используй bcrypt, argon2 или pbkdf2 — медленные алгоритмы хеширования с солью.' },
        { type: 'code', language: 'python', value: '# pip install bcrypt passlib[bcrypt]\nimport bcrypt\nfrom passlib.context import CryptContext\n\n# Хеширование пароля\npassword = "my_secure_password"\npassword_bytes = password.encode(\'utf-8\')\n\n# Генерируем соль и хешируем\nsalt = bcrypt.gensalt(rounds=12)  # rounds=12 — работа ~ 0.3с\nhashed = bcrypt.hashpw(password_bytes, salt)\nprint(hashed)  # b\'$2b$12$...\'\n\n# Проверка пароля\ndef verify_password(plain: str, hashed: bytes) -> bool:\n    return bcrypt.checkpw(plain.encode(\'utf-8\'), hashed)\n\nprint(verify_password("my_secure_password", hashed))  # True\nprint(verify_password("wrong_password", hashed))       # False\n\n# Passlib — более высокоуровневый API\npwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")\n\n# Хеширование\nhash_value = pwd_context.hash("my_password")\n\n# Проверка\npwd_context.verify("my_password", hash_value)   # True\npwd_context.verify("wrong", hash_value)          # False\n\n# Django и Flask используют похожие подходы:\n# Django: make_password() и check_password()\n# Flask: generate_password_hash() и check_password_hash()\n\n# НИКОГДА не делай:\n# hashlib.md5(password).hexdigest()  # MD5 — взломан, быстрый\n# hashlib.sha256(password).hexdigest()  # без соли — уязвим к rainbow tables' },
        { type: 'warning', value: 'MD5 и SHA1 для паролей — критическая уязвимость. Используй только bcrypt, argon2 или pbkdf2. Параметр rounds/iterations должен делать хеширование занимающим 100-500мс.' }
      ]
    },
    {
      id: 5,
      title: 'Безопасность зависимостей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Уязвимости в сторонних библиотеках — частая причина взломов. Регулярно проверяй и обновляй зависимости.' },
        { type: 'code', language: 'python', value: '# Проверка уязвимостей в зависимостях\n# pip install pip-audit safety\n\n# pip-audit — официальный инструмент PyPA\n# pip-audit                          # проверить текущее окружение\n# pip-audit -r requirements.txt     # проверить из файла\n\n# safety — проверка по базе CVE\n# safety check\n# safety check -r requirements.txt\n\n# Фиксация версий для воспроизводимости\n# pip freeze > requirements.lock     # точные версии\n\n# Зависимости: минимальный принцип\n# Устанавливай только то что нужно\n# Проверяй популярность и активность пакета\n\n# Проверка пакета перед установкой:\n# 1. Правильное название (typosquatting: colorama vs coloarama)\n# 2. Количество загрузок (PyPI stats)\n# 3. Дата последнего обновления\n# 4. GitHub issues/stars\n# 5. Известные CVE на snyk.io или nvd.nist.gov\n\n# Безопасный импорт пользовательских модулей\n# ПЛОХО: eval и exec с пользовательским вводом\nuser_code = "import os; os.system(\'rm -rf /\')\"\nexec(user_code)  # ОПАСНО!\n\n# ХОРОШО: ограниченный eval для математики\nimport ast\n\ndef safe_eval(expression: str) -> float:\n    """Безопасное вычисление математических выражений."""\n    # Разрешаем только числа и базовые операторы\n    allowed_nodes = (\n        ast.Expression, ast.BinOp, ast.UnaryOp,\n        ast.Add, ast.Sub, ast.Mult, ast.Div, ast.Pow,\n        ast.Num, ast.Constant\n    )\n    try:\n        tree = ast.parse(expression, mode=\'eval\')\n        for node in ast.walk(tree):\n            if not isinstance(node, allowed_nodes):\n                raise ValueError(f"Недопустимая операция: {type(node).__name__}")\n        return eval(compile(tree, \'<string>\', \'eval\'))\n    except Exception as e:\n        raise ValueError(f"Некорректное выражение: {e}")' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Аудит безопасности кода',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди и исправь уязвимости безопасности в предоставленном коде.',
      requirements: [
        'Найди минимум 5 проблем безопасности в уязвимом коде',
        'Исправь SQL-инъекцию: используй параметризованный запрос',
        'Исправь хранение пароля: используй bcrypt вместо MD5',
        'Перенеси секреты в переменные окружения',
        'Добавь валидацию ввода для username и email',
        'Исправь path traversal уязвимость'
      ],
      expectedOutput: 'Исправленный код:\n1. Параметризованный SQL запрос\n2. bcrypt вместо MD5\n3. Секреты из os.environ\n4. Валидация через regex\n5. Защита от path traversal',
      hint: 'cursor.execute("... WHERE username = ?", (username,)) для SQLite. bcrypt.hashpw(pwd.encode(), bcrypt.gensalt()). Path(base_dir).resolve() для защиты от ../.',
      solution: '# УЯЗВИМЫЙ КОД (для анализа):\n# import hashlib\n# import sqlite3\n# SECRET_KEY = "hardcoded-secret-123"\n# DB_PASS = "admin123"\n# def login(username, password):\n#     conn = sqlite3.connect("db.sqlite3")\n#     q = f"SELECT * FROM users WHERE username = \'{username}\'"\n#     user = conn.execute(q).fetchone()\n#     pwd_hash = hashlib.md5(password.encode()).hexdigest()\n#     return user and user[\'password\'] == pwd_hash\n# def read_file(filename):\n#     return open(f"/var/data/{filename}").read()\n\n# ИСПРАВЛЕННЫЙ КОД:\nimport os\nimport re\nimport sqlite3\nfrom pathlib import Path\nimport bcrypt\nfrom dotenv import load_dotenv\n\nload_dotenv()\n\n# 1. Секреты из переменных окружения\nSECRET_KEY = os.environ.get("SECRET_KEY")\nif not SECRET_KEY:\n    raise RuntimeError("SECRET_KEY не задан")\n\nBASE_DIR = "/var/data"\n\n\ndef validate_username(username: str) -> bool:\n    """Валидация имени пользователя."""\n    return bool(re.match(r\'^[a-zA-Z0-9_]{3,50}$\', username))\n\n\ndef hash_password(password: str) -> bytes:\n    """Хеширует пароль с помощью bcrypt."""\n    return bcrypt.hashpw(password.encode(\'utf-8\'), bcrypt.gensalt(rounds=12))\n\n\ndef login(username: str, password: str) -> bool:\n    """Аутентификация пользователя.\n\n    Returns:\n        True если аутентификация успешна.\n    """\n    # 2. Валидация ввода\n    if not validate_username(username):\n        return False\n\n    conn = sqlite3.connect("db.sqlite3")\n    conn.row_factory = sqlite3.Row\n    try:\n        # 3. Параметризованный запрос (защита от SQL-инъекции)\n        cursor = conn.execute(\n            "SELECT password_hash FROM users WHERE username = ?",\n            (username,)\n        )\n        user = cursor.fetchone()\n        if not user:\n            return False\n        # 4. Сравнение через bcrypt (защита от timing attack)\n        return bcrypt.checkpw(password.encode(\'utf-8\'), user[\'password_hash\'])\n    finally:\n        conn.close()\n\n\ndef read_user_file(filename: str) -> str:\n    """Безопасное чтение файлов из разрешённой директории.\n\n    Raises:\n        ValueError: При попытке path traversal.\n        FileNotFoundError: Если файл не найден.\n    """\n    # 5. Защита от path traversal\n    safe_path = (Path(BASE_DIR) / filename).resolve()\n    if not str(safe_path).startswith(str(Path(BASE_DIR).resolve())):\n        raise ValueError(f"Доступ запрещён: {filename}")\n    return safe_path.read_text(encoding=\'utf-8\')\n\n\nprint("Найденные уязвимости:")\nprint("1. SQL-инъекция в f-string запросе")\nprint("2. MD5 для хеширования паролей")\nprint("3. Хардкоженные секреты SECRET_KEY и DB_PASS")\nprint("4. Отсутствие валидации ввода")\nprint("5. Path traversal в read_file")',
      explanation: 'bcrypt.checkpw защищает от timing attacks (постоянное время сравнения). conn.row_factory = sqlite3.Row позволяет обращаться к столбцам по имени. Path.resolve() разрешает симлинки и убирает .. из пути. Всегда проверяй что resolved путь начинается с разрешённой директории.'
    }
  ]
}
