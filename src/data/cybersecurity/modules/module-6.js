export default {
  id: 6,
  title: 'OWASP Top 10: Broken Authentication',
  description: 'Уязвимости аутентификации, управление сессиями, многофакторная аутентификация (MFA), безопасность JWT токенов и защита от брутфорса.',
  lessons: [
    {
      id: 1,
      title: 'Уязвимости аутентификации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Broken Authentication — нарушение механизмов аутентификации, позволяющее атакующему получить доступ к чужим аккаунтам. Включает: слабые пароли, отсутствие MFA, небезопасное управление сессиями, утечка учётных данных.' },
        { type: 'heading', value: 'Типичные уязвимости' },
        { type: 'list', value: [
          'Credential Stuffing — использование утечённых паролей с других сайтов',
          'Brute Force — перебор паролей без ограничений',
          'Default Credentials — стандартные admin/admin, root/password',
          'Session Fixation — навязывание жертве известного session ID',
          'Insecure Password Recovery — предсказуемые ответы на секретные вопросы',
          'Missing MFA — отсутствие второго фактора аутентификации'
        ]},
        { type: 'code', language: 'python', value: '# Примеры уязвимостей аутентификации\n\n# УЯЗВИМО: нет ограничения попыток\ndef login_vulnerable(username, password):\n    user = db.find_user(username)\n    if user and check_password(password, user.password_hash):\n        return create_session(user)\n    return None  # Можно перебирать бесконечно!\n\n# УЯЗВИМО: предсказуемый session ID\nimport time\ndef create_session_vulnerable(user):\n    session_id = str(int(time.time())) + str(user.id)\n    # Атакующий может предсказать session_id!\n    return session_id\n\n# УЯЗВИМО: username enumeration\ndef login_with_enumeration(username, password):\n    user = db.find_user(username)\n    if not user:\n        return {"error": "Пользователь не найден"}  # Раскрывает что user не существует!\n    if not check_password(password, user.password_hash):\n        return {"error": "Неверный пароль"}  # Раскрывает что user существует!\n    return {"success": True}\n\n# БЕЗОПАСНО: общее сообщение об ошибке\ndef login_safe(username, password):\n    user = db.find_user(username)\n    if not user or not check_password(password, user.password_hash):\n        return {"error": "Неверное имя пользователя или пароль"}  # Одинаково для обоих случаев!\n    return {"success": True}' },
        { type: 'warning', value: 'Не раскрывайте информацию о существовании аккаунта. Сообщения "Пользователь не найден" vs "Неверный пароль" позволяют атакующему перечислить (enumerate) действующие аккаунты.' }
      ]
    },
    {
      id: 2,
      title: 'Безопасное управление сессиями',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сессия — механизм отслеживания аутентифицированного пользователя между HTTP запросами. Уязвимости: предсказуемые ID, отсутствие истечения, session fixation, хранение на клиенте без защиты.' },
        { type: 'code', language: 'python', value: 'import secrets\nimport time\nfrom functools import wraps\nfrom flask import Flask, request, session, abort\n\napp = Flask(__name__)\napp.secret_key = secrets.token_hex(32)  # Криптографически стойкий ключ\n\n# === Безопасная конфигурация сессий ===\napp.config.update(\n    SESSION_COOKIE_SECURE=True,      # Только через HTTPS\n    SESSION_COOKIE_HTTPONLY=True,     # Недоступна из JavaScript\n    SESSION_COOKIE_SAMESITE="Lax",   # Защита от CSRF\n    PERMANENT_SESSION_LIFETIME=1800,  # 30 минут\n    SESSION_COOKIE_NAME="__Host-session",  # Cookie prefix для дополнительной защиты\n)\n\n# === Защита от Session Fixation ===\ndef login_user(user):\n    # Регенерация session ID после аутентификации!\n    session.clear()  # Очищаем старую сессию\n    session["user_id"] = user.id\n    session["login_time"] = time.time()\n    session["ip"] = request.remote_addr\n    session.permanent = True\n\n# === Проверка активности сессии ===\ndef require_auth(f):\n    @wraps(f)\n    def decorated(*args, **kwargs):\n        if "user_id" not in session:\n            abort(401)\n        \n        # Проверка таймаута бездействия (30 минут)\n        if time.time() - session.get("last_activity", 0) > 1800:\n            session.clear()\n            abort(401, "Сессия истекла")\n        \n        session["last_activity"] = time.time()\n        return f(*args, **kwargs)\n    return decorated\n\n# === Logout: полное уничтожение сессии ===\n@app.route("/logout")\ndef logout():\n    session.clear()  # Удаляем ВСЕ данные сессии\n    response = redirect("/login")\n    response.delete_cookie("__Host-session")  # Удаляем cookie\n    return response' },
        { type: 'tip', value: 'Регенерируйте session ID после каждого изменения уровня привилегий (логин, смена роли). Устанавливайте флаги cookie: Secure, HttpOnly, SameSite. Храните сессии на сервере (Redis), а не в cookie.' }
      ]
    },
    {
      id: 3,
      title: 'JWT: безопасное использование',
      type: 'theory',
      content: [
        { type: 'text', value: 'JWT (JSON Web Token) — стандарт для создания токенов доступа. Часто используется неправильно, что приводит к серьёзным уязвимостям. Основные ошибки: слабый секрет, отсутствие валидации, алгоритм none.' },
        { type: 'heading', value: 'Уязвимости JWT' },
        { type: 'list', value: [
          'Algorithm None Attack — подмена алгоритма на "none" (нет подписи)',
          'Weak Secret — brute force секретного ключа (если он простой)',
          'Algorithm Confusion — подмена RS256 на HS256 (публичный ключ как секрет)',
          'Missing expiration — токен без срока действия',
          'Sensitive data in payload — пароли, секреты в незашифрованном payload'
        ]},
        { type: 'code', language: 'python', value: 'import jwt\nimport time\nimport secrets\n\n# Генерация надёжного секрета (минимум 256 бит)\nJWT_SECRET = secrets.token_hex(32)  # 64 символа hex = 256 бит\nJWT_ALGORITHM = "HS256"\n\n# === Безопасное создание JWT ===\ndef create_token(user_id: int, role: str) -> str:\n    now = int(time.time())\n    payload = {\n        "sub": str(user_id),      # Subject (идентификатор пользователя)\n        "role": role,\n        "iat": now,                # Issued At\n        "exp": now + 3600,         # Expires in 1 hour\n        "nbf": now,                # Not Before\n        "jti": secrets.token_hex(16),  # Unique ID (для revocation)\n    }\n    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)\n\n# === Безопасная валидация JWT ===\ndef validate_token(token: str) -> dict:\n    try:\n        payload = jwt.decode(\n            token,\n            JWT_SECRET,\n            algorithms=[JWT_ALGORITHM],  # Явно указываем допустимые алгоритмы!\n            options={\n                "require": ["sub", "exp", "iat", "jti"],  # Обязательные claims\n                "verify_exp": True,      # Проверять срок\n                "verify_iat": True,      # Проверять время создания\n                "verify_nbf": True,      # Проверять Not Before\n            }\n        )\n        return payload\n    except jwt.ExpiredSignatureError:\n        raise AuthError("Токен истёк")\n    except jwt.InvalidTokenError as e:\n        raise AuthError(f"Невалидный токен: {e}")\n\n# === Чёрный список (Token Revocation) ===\n# JWT нельзя "отозвать" — они stateless\n# Решения:\n# 1. Короткий срок жизни (15 min) + refresh token\n# 2. Чёрный список jti в Redis\n# 3. Версионирование токенов (token_version в БД)\n\nimport redis\nrevoked_tokens = redis.Redis()\n\ndef revoke_token(jti: str, exp: int):\n    """Добавить токен в чёрный список до его истечения"""\n    ttl = exp - int(time.time())\n    if ttl > 0:\n        revoked_tokens.setex(f"revoked:{jti}", ttl, "1")\n\ndef is_revoked(jti: str) -> bool:\n    return revoked_tokens.exists(f"revoked:{jti}")' },
        { type: 'warning', value: 'JWT payload НЕ зашифрован, только подписан! Любой может декодировать payload через base64. Никогда не храните в JWT конфиденциальные данные (пароли, номера карт). Для конфиденциальности используйте JWE (JSON Web Encryption).' }
      ]
    },
    {
      id: 4,
      title: 'Многофакторная аутентификация (MFA)',
      type: 'theory',
      content: [
        { type: 'text', value: 'MFA требует два или более факторов аутентификации: что-то, что вы знаете (пароль), что-то, что вы имеете (телефон, ключ), что-то, что вы есть (биометрия). MFA блокирует 99.9% автоматизированных атак.' },
        { type: 'heading', value: 'Типы MFA' },
        { type: 'list', value: [
          'TOTP (Time-based OTP) — Google Authenticator, Authy (рекомендуется)',
          'SMS OTP — одноразовый код через SMS (уязвим к SIM swap!)',
          'FIDO2/WebAuthn — аппаратные ключи YubiKey, Touch ID (самый безопасный)',
          'Push Notifications — подтверждение в приложении (Duo, Microsoft Authenticator)',
          'Email OTP — код на email (наименее безопасный из MFA)'
        ]},
        { type: 'code', language: 'python', value: 'import pyotp\nimport qrcode\nimport io\nimport base64\n\n# === TOTP (Time-based One-Time Password) ===\n\ndef setup_totp(user_email: str) -> dict:\n    """Настройка TOTP для пользователя"""\n    # Генерация секрета (храните в БД, зашифрованным!)\n    secret = pyotp.random_base32()\n    \n    # TOTP объект\n    totp = pyotp.TOTP(secret)\n    \n    # URI для QR кода (сканируется Google Authenticator)\n    uri = totp.provisioning_uri(\n        name=user_email,\n        issuer_name="MySecureApp"\n    )\n    # otpauth://totp/MySecureApp:user@email.com?secret=BASE32SECRET&issuer=MySecureApp\n    \n    return {\n        "secret": secret,  # Сохранить в БД (зашифрованным!)\n        "uri": uri,        # Для генерации QR кода\n    }\n\ndef verify_totp(secret: str, code: str) -> bool:\n    """Проверка TOTP кода"""\n    totp = pyotp.TOTP(secret)\n    # valid_window=1 допускает +-30 секунд (для расхождения часов)\n    return totp.verify(code, valid_window=1)\n\n# === Backup codes (резервные коды) ===\nimport secrets\n\ndef generate_backup_codes(count: int = 10) -> list[str]:\n    """Генерация одноразовых резервных кодов"""\n    codes = [secrets.token_hex(4).upper() for _ in range(count)]\n    # Хранить хэши кодов в БД, показать пользователю один раз\n    return codes\n\n# === Процесс логина с MFA ===\ndef login_with_mfa(username, password, totp_code=None):\n    user = authenticate(username, password)\n    if not user:\n        return {"error": "Неверные учётные данные"}\n    \n    if user.mfa_enabled:\n        if not totp_code:\n            return {"status": "mfa_required", "temp_token": create_temp_token(user)}\n        if not verify_totp(user.mfa_secret, totp_code):\n            return {"error": "Неверный код MFA"}\n    \n    return {"token": create_token(user.id, user.role)}' },
        { type: 'tip', value: 'FIDO2/WebAuthn — самый безопасный метод MFA (аппаратные ключи, биометрия). TOTP — хороший баланс безопасности и удобства. Избегайте SMS OTP как единственного фактора — SIM swap атаки реальны.' }
      ]
    },
    {
      id: 5,
      title: 'Защита от брутфорса и Credential Stuffing',
      type: 'theory',
      content: [
        { type: 'text', value: 'Brute Force — перебор паролей. Credential Stuffing — использование утечённых логинов/паролей с других сайтов. Защита: rate limiting, account lockout, CAPTCHA, мониторинг аномалий.' },
        { type: 'code', language: 'python', value: 'import time\nimport redis\nfrom flask import Flask, request, abort\n\napp = Flask(__name__)\nr = redis.Redis()\n\n# === Rate Limiting по IP ===\ndef rate_limit(key_prefix: str, max_attempts: int, window: int):\n    """Ограничение попыток: max_attempts за window секунд"""\n    def decorator(f):\n        def wrapper(*args, **kwargs):\n            ip = request.remote_addr\n            key = f"{key_prefix}:{ip}"\n            \n            attempts = r.incr(key)\n            if attempts == 1:\n                r.expire(key, window)\n            \n            if attempts > max_attempts:\n                retry_after = r.ttl(key)\n                abort(429, f"Слишком много попыток. Повторите через {retry_after} сек.")\n            \n            return f(*args, **kwargs)\n        return wrapper\n    return decorator\n\n# === Account Lockout ===\ndef check_account_lockout(username: str) -> bool:\n    """Проверка блокировки аккаунта после неудачных попыток"""\n    key = f"failed_login:{username}"\n    attempts = int(r.get(key) or 0)\n    \n    if attempts >= 5:\n        ttl = r.ttl(key)\n        raise AccountLockedError(\n            f"Аккаунт заблокирован. Попробуйте через {ttl} секунд"\n        )\n    return True\n\ndef record_failed_login(username: str):\n    key = f"failed_login:{username}"\n    attempts = r.incr(key)\n    if attempts == 1:\n        r.expire(key, 900)  # Сброс через 15 минут\n    \n    # Прогрессивная задержка\n    if attempts >= 3:\n        time.sleep(min(attempts * 2, 30))  # До 30 сек задержки\n\ndef record_successful_login(username: str):\n    r.delete(f"failed_login:{username}")  # Сброс счётчика\n\n# === Проверка утечённых паролей (Have I Been Pwned API) ===\nimport hashlib\nimport requests\n\ndef is_password_leaked(password: str) -> bool:\n    """Проверка пароля по базе утечек (k-anonymity, безопасно)"""\n    sha1 = hashlib.sha1(password.encode()).hexdigest().upper()\n    prefix, suffix = sha1[:5], sha1[5:]\n    \n    # Отправляем только первые 5 символов хэша!\n    resp = requests.get(f"https://api.pwnedpasswords.com/range/{prefix}")\n    \n    for line in resp.text.splitlines():\n        hash_suffix, count = line.split(":")\n        if hash_suffix == suffix:\n            return True  # Пароль найден в утечках!\n    return False' },
        { type: 'tip', value: 'Комбинируйте защиты: rate limiting по IP + account lockout + CAPTCHA после 3 попыток + проверка паролей по базе утечек (HIBP). Для API используйте API ключи + rate limiting по ключу.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Безопасная система аутентификации',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте безопасную систему аутентификации с JWT, rate limiting, account lockout и TOTP MFA.',
      requirements: [
        'Реализуйте регистрацию с проверкой сложности пароля и HIBP',
        'Реализуйте логин с rate limiting (5 попыток в 15 минут)',
        'Добавьте JWT access token (15 мин) и refresh token (7 дней)',
        'Реализуйте TOTP MFA (настройка + верификация)',
        'Реализуйте logout с отзывом токена'
      ],
      hint: 'Используйте bcrypt для паролей, PyJWT для токенов, pyotp для TOTP, Redis для rate limiting и чёрного списка.',
      expectedOutput: 'Регистрация: пароль проверен (сложность + HIBP), хэш bcrypt сохранён\nЛогин: rate limiting работает (429 после 5 попыток)\nJWT: access_token (15 мин) + refresh_token (7 дней)\nMFA: TOTP настроен, QR-код сгенерирован, код верифицирован\nLogout: токен добавлен в чёрный список Redis',
      solution: 'import jwt\nimport bcrypt\nimport pyotp\nimport secrets\nimport time\nimport re\nimport redis\n\nr = redis.Redis()\nJWT_SECRET = secrets.token_hex(32)\n\n# === Регистрация ===\ndef register(username: str, password: str):\n    # Валидация пароля\n    if len(password) < 12:\n        raise ValueError("Пароль должен быть не менее 12 символов")\n    if not re.search(r"[A-Z]", password):\n        raise ValueError("Нужна хотя бы 1 заглавная буква")\n    if not re.search(r"[0-9]", password):\n        raise ValueError("Нужна хотя бы 1 цифра")\n    if not re.search(r"[!@#$%^&*]", password):\n        raise ValueError("Нужен хотя бы 1 спецсимвол")\n    \n    # Хэширование\n    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12))\n    \n    # Сохранение в БД\n    db.users.insert({\n        "username": username,\n        "password_hash": password_hash,\n        "mfa_enabled": False,\n        "mfa_secret": None\n    })\n    return {"status": "registered"}\n\n# === Логин с Rate Limiting и MFA ===\ndef login(username: str, password: str, totp_code: str = None):\n    # Rate limiting\n    ip_key = f"login_attempts:{username}"\n    attempts = int(r.get(ip_key) or 0)\n    if attempts >= 5:\n        ttl = r.ttl(ip_key)\n        raise RateLimitError(f"Заблокировано на {ttl} сек")\n    \n    user = db.users.find_one({"username": username})\n    if not user or not bcrypt.checkpw(password.encode(), user["password_hash"]):\n        r.incr(ip_key)\n        r.expire(ip_key, 900)\n        raise AuthError("Неверные учётные данные")\n    \n    # MFA проверка\n    if user.get("mfa_enabled"):\n        if not totp_code:\n            return {"status": "mfa_required"}\n        if not pyotp.TOTP(user["mfa_secret"]).verify(totp_code, valid_window=1):\n            raise AuthError("Неверный MFA код")\n    \n    # Сброс счётчика\n    r.delete(ip_key)\n    \n    # Создание токенов\n    now = int(time.time())\n    access_token = jwt.encode(\n        {"sub": str(user["_id"]), "exp": now + 900, "type": "access", "jti": secrets.token_hex(16)},\n        JWT_SECRET, algorithm="HS256"\n    )\n    refresh_token = jwt.encode(\n        {"sub": str(user["_id"]), "exp": now + 604800, "type": "refresh", "jti": secrets.token_hex(16)},\n        JWT_SECRET, algorithm="HS256"\n    )\n    return {"access_token": access_token, "refresh_token": refresh_token}\n\n# === Logout ===\ndef logout(token: str):\n    payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])\n    ttl = payload["exp"] - int(time.time())\n    if ttl > 0:\n        r.setex(f"revoked:{payload[\'jti\']}", ttl, "1")\n    return {"status": "logged_out"}',
      explanation: 'Безопасная аутентификация требует многослойной защиты: bcrypt для паролей, rate limiting для защиты от брутфорса, JWT с коротким сроком + refresh token для стейтлесс аутентификации, TOTP MFA для второго фактора, Redis для чёрного списка токенов. Каждый слой защищает от определённого класса атак.'
    }
  ]
}
