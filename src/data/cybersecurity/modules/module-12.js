export default {
  id: 12,
  title: 'Аутентификация и авторизация',
  description: 'SSO, SAML, OpenID Connect, RBAC, ABAC — архитектура систем управления доступом и идентификацией.',
  lessons: [
    {
      id: 1,
      title: 'SSO и федеративная аутентификация',
      type: 'theory',
      content: [
        { type: 'text', value: 'SSO (Single Sign-On) — один вход для доступа ко всем системам. Пользователь аутентифицируется один раз через Identity Provider (IdP) и получает доступ ко всем Service Providers (SP). Протоколы: SAML, OpenID Connect (OIDC), OAuth2.' },
        { type: 'heading', value: 'Преимущества SSO' },
        { type: 'list', value: [
          'Удобство: один пароль для всех корпоративных систем',
          'Безопасность: централизованное управление, MFA в одном месте',
          'Offboarding: отключаем одну учётную запись — теряется доступ ко всем системам',
          'Аудит: единое место для логов аутентификации'
        ]},
        { type: 'code', language: 'javascript', value: '// === OpenID Connect (OIDC) — современный стандарт SSO ===\n// OIDC = OAuth2 + Identity Layer (id_token)\n\n// Настройка OIDC клиента (passport.js)\nconst passport = require("passport");\nconst OIDCStrategy = require("passport-openidconnect");\n\npassport.use(new OIDCStrategy({\n    issuer: "https://accounts.google.com",\n    authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",\n    tokenURL: "https://oauth2.googleapis.com/token",\n    userInfoURL: "https://openidconnect.googleapis.com/v1/userinfo",\n    clientID: process.env.GOOGLE_CLIENT_ID,\n    clientSecret: process.env.GOOGLE_CLIENT_SECRET,\n    callbackURL: "https://myapp.com/auth/callback",\n    scope: ["openid", "profile", "email"],\n  },\n  async (issuer, profile, context, idToken, accessToken, refreshToken, done) => {\n    // idToken содержит информацию о пользователе\n    // Проверьте: issuer, audience, expiration\n    const user = await findOrCreateUser({\n      provider: "google",\n      providerId: profile.id,\n      email: profile.emails[0].value,\n      name: profile.displayName,\n    });\n    return done(null, user);\n  }\n));\n\napp.get("/auth/google", passport.authenticate("openidconnect"));\napp.get("/auth/callback",\n  passport.authenticate("openidconnect\", { failureRedirect: "/login" }),\n  (req, res) => res.redirect("/")\n);' },
        { type: 'tip', value: 'Для веб-приложений используйте OIDC (OpenID Connect) вместо SAML — он проще и современнее. SAML остаётся стандартом для корпоративного SSO (Active Directory, Okta). Для SPA — OIDC + PKCE.' }
      ]
    },
    {
      id: 2,
      title: 'RBAC: ролевой контроль доступа',
      type: 'theory',
      content: [
        { type: 'text', value: 'RBAC (Role-Based Access Control) — модель доступа на основе ролей. Пользователю назначаются роли, ролям назначаются разрешения. Простая и понятная модель для большинства приложений.' },
        { type: 'code', language: 'python', value: '# === RBAC реализация ===\nfrom enum import Enum\nfrom functools import wraps\nfrom flask import request, abort, g\n\n# Определяем разрешения\nclass Permission(Enum):\n    READ_ARTICLES = "articles:read"\n    WRITE_ARTICLES = "articles:write"\n    DELETE_ARTICLES = "articles:delete"\n    MANAGE_USERS = "users:manage"\n    VIEW_ANALYTICS = "analytics:view"\n    MANAGE_SETTINGS = "settings:manage"\n\n# Определяем роли с набором разрешений\nROLES = {\n    "viewer": {\n        Permission.READ_ARTICLES,\n    },\n    "editor": {\n        Permission.READ_ARTICLES,\n        Permission.WRITE_ARTICLES,\n    },\n    "moderator": {\n        Permission.READ_ARTICLES,\n        Permission.WRITE_ARTICLES,\n        Permission.DELETE_ARTICLES,\n        Permission.VIEW_ANALYTICS,\n    },\n    "admin": {\n        Permission.READ_ARTICLES,\n        Permission.WRITE_ARTICLES,\n        Permission.DELETE_ARTICLES,\n        Permission.MANAGE_USERS,\n        Permission.VIEW_ANALYTICS,\n        Permission.MANAGE_SETTINGS,\n    },\n}\n\ndef require_permission(*permissions):\n    """Декоратор проверки разрешений"""\n    def decorator(f):\n        @wraps(f)\n        def wrapper(*args, **kwargs):\n            user_role = g.current_user.role\n            user_permissions = ROLES.get(user_role, set())\n            \n            for perm in permissions:\n                if perm not in user_permissions:\n                    abort(403, f"Нет разрешения: {perm.value}")\n            \n            return f(*args, **kwargs)\n        return wrapper\n    return decorator\n\n# Использование\n@app.route("/articles", methods=["POST"])\n@require_auth\n@require_permission(Permission.WRITE_ARTICLES)\ndef create_article():\n    # Только editor, moderator, admin\n    pass\n\n@app.route("/users", methods=["DELETE"])\n@require_auth\n@require_permission(Permission.MANAGE_USERS)\ndef delete_user():\n    # Только admin\n    pass' },
        { type: 'tip', value: 'Проверяйте разрешения (permissions), а не роли напрямую. Это позволяет гибко менять набор разрешений для ролей без изменения кода. Принцип наименьших привилегий: начинайте с минимальных прав, добавляйте по необходимости.' }
      ]
    },
    {
      id: 3,
      title: 'ABAC: атрибутный контроль доступа',
      type: 'theory',
      content: [
        { type: 'text', value: 'ABAC (Attribute-Based Access Control) — модель на основе атрибутов: пользователя, ресурса, действия и контекста. Более гибкая чем RBAC, позволяет создавать сложные политики доступа.' },
        { type: 'code', language: 'python', value: '# === ABAC реализация ===\nfrom dataclasses import dataclass\nfrom typing import Any\nfrom datetime import datetime, time\n\n@dataclass\nclass AccessRequest:\n    subject: dict    # Кто (пользователь)\n    resource: dict   # Что (ресурс)\n    action: str      # Как (действие)\n    context: dict    # Где/Когда (контекст)\n\nclass ABACEngine:\n    def __init__(self):\n        self.policies = []\n    \n    def add_policy(self, name: str, condition, effect: str = "allow"):\n        self.policies.append({\n            "name": name,\n            "condition": condition,\n            "effect": effect\n        })\n    \n    def evaluate(self, request: AccessRequest) -> bool:\n        for policy in self.policies:\n            if policy["condition"](request):\n                return policy["effect"] == "allow"\n        return False  # Deny по умолчанию\n\n# Создаём движок ABAC\nabac = ABACEngine()\n\n# Политика 1: Владелец может редактировать свой ресурс\nabac.add_policy(\n    "owner_edit",\n    lambda r: r.action == "edit" and \n              r.resource.get("owner_id") == r.subject.get("id"),\n    "allow"\n)\n\n# Политика 2: Доступ только в рабочее время (9:00-18:00)\nabac.add_policy(\n    "business_hours_only",\n    lambda r: r.resource.get("sensitivity") == "high\" and\n              not (time(9, 0) <= datetime.now().time() <= time(18, 0)),\n    "deny"\n)\n\n# Политика 3: Менеджер может просматривать отчёты своего отдела\nabac.add_policy(\n    "manager_department_reports\",\n    lambda r: r.action == \"read\" and \n              r.resource.get(\"type\") == \"report\" and\n              r.subject.get(\"role\") == \"manager\" and\n              r.resource.get(\"department\") == r.subject.get(\"department\"),\n    \"allow\"\n)\n\n# Проверка доступа\nrequest = AccessRequest(\n    subject={\"id\": 1, \"role\": \"manager\", \"department\": \"engineering\"},\n    resource={\"type\": \"report\", \"department\": \"engineering\", \"owner_id\": 2},\n    action=\"read\",\n    context={\"ip\": \"10.0.0.1\", \"time\": datetime.now()}\n)\nprint(f\"Доступ: {abac.evaluate(request)}\")  # True' },
        { type: 'tip', value: 'RBAC подходит для большинства приложений. ABAC нужен когда правила доступа зависят от множества атрибутов (время, локация, отдел, чувствительность данных). Часто используют гибрид: RBAC + контекстные проверки.' }
      ]
    },
    {
      id: 4,
      title: 'Безопасность сессий и токенов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Выбор между серверными сессиями и токенами (JWT) зависит от архитектуры. Каждый подход имеет свои проблемы безопасности. Токены хранят в HttpOnly cookies, а не в localStorage.' },
        { type: 'code', language: 'javascript', value: '// === Сравнение: Sessions vs JWT ===\n\n// SERVER SESSIONS\n// + Можно мгновенно отозвать (удалить из Redis)\n// + Минимум данных на клиенте (только session ID)\n// + Нет утечки данных (payload на сервере)\n// - Нужно хранилище состояния (Redis)\n// - Сложнее масштабировать (sticky sessions или shared store)\n\n// JWT TOKENS\n// + Stateless (не нужен Redis для каждого запроса)\n// + Масштабируется горизонтально\n// + Содержит данные (не нужен запрос к БД на каждый запрос)\n// - Нельзя мгновенно отозвать (до истечения)\n// - Payload видим (base64, не шифрование!)\n// - Больший размер (отправляется с каждым запросом)\n\n// === Где хранить токены? ===\n\n// ПЛОХО: localStorage / sessionStorage\n// localStorage.setItem("token", jwt);\n// Уязвимо к XSS! Любой JS код на странице может прочитать.\n\n// ХОРОШО: HttpOnly cookie\nres.cookie("access_token", jwt, {\n  httpOnly: true,   // JavaScript не может прочитать\n  secure: true,     // Только HTTPS\n  sameSite: "Lax",  // Защита от CSRF\n  maxAge: 15 * 60 * 1000  // 15 минут\n});\n\n// На клиенте: токен отправляется автоматически\nfetch("/api/data", {\n  credentials: "include\"  // Включить cookies\n});' },
        { type: 'warning', value: 'Никогда не храните JWT токены в localStorage. XSS уязвимость = украденный токен = полный доступ к аккаунту. HttpOnly cookie недоступна из JavaScript, что защищает от XSS кражи.' }
      ]
    },
    {
      id: 5,
      title: 'Passkeys и будущее аутентификации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Passkeys (WebAuthn/FIDO2) — стандарт беспарольной аутентификации. Использует криптографические ключи привязанные к устройству. Невозможно подделать, фишинг-устойчив, не требует паролей.' },
        { type: 'heading', value: 'Преимущества Passkeys' },
        { type: 'list', value: [
          'Фишинг-устойчивость: привязаны к конкретному домену',
          'Нет паролей: нечего утекать, нечего забывать',
          'Биометрия: Touch ID, Face ID, Windows Hello',
          'Кросс-устройство: синхронизация через iCloud Keychain, Google Password Manager',
          'Стандарт: поддержка Apple, Google, Microsoft, W3C'
        ]},
        { type: 'code', language: 'javascript', value: '// === WebAuthn Registration (упрощённо) ===\n\n// Клиент: запрос на регистрацию\nasync function registerPasskey() {\n  // 1. Получаем challenge от сервера\n  const options = await fetch("/auth/webauthn/register-options").then(r => r.json());\n  \n  // 2. Браузер показывает диалог (Touch ID / PIN)\n  const credential = await navigator.credentials.create({\n    publicKey: {\n      challenge: Uint8Array.from(options.challenge),\n      rp: { name: "My App", id: "myapp.com\" },\n      user: {\n        id: Uint8Array.from(options.userId),\n        name: options.userEmail,\n        displayName: options.userName\n      },\n      pubKeyCredParams: [\n        { type: "public-key\", alg: -7 },   // ES256 (ECDSA P-256)\n        { type: "public-key\", alg: -257 }  // RS256\n      ],\n      authenticatorSelection: {\n        authenticatorAttachment: "platform\",  // Встроенный (Touch ID)\n        residentKey: "required\"  // Discoverable credential\n      }\n    }\n  });\n  \n  // 3. Отправляем публичный ключ на сервер\n  await fetch(\"/auth/webauthn/register\", {\n    method: \"POST\",\n    body: JSON.stringify({\n      id: credential.id,\n      publicKey: credential.response.getPublicKey(),\n      attestation: credential.response.attestationObject\n    })\n  });\n}\n\n// === WebAuthn Login ===\nasync function loginWithPasskey() {\n  const options = await fetch(\"/auth/webauthn/login-options\").then(r => r.json());\n  const assertion = await navigator.credentials.get({\n    publicKey: {\n      challenge: Uint8Array.from(options.challenge),\n      rpId: \"myapp.com\"\n    }\n  });\n  // Сервер проверяет подпись приватным ключом устройства\n}' },
        { type: 'tip', value: 'Passkeys — будущее аутентификации. Начните внедрение как дополнительный метод входа наряду с паролем + MFA. Библиотеки: @simplewebauthn/server (Node.js), py_webauthn (Python).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Система авторизации с RBAC',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему RBAC авторизации с гранулярными разрешениями, middleware проверками и аудит-логом.',
      requirements: [
        'Определите роли (viewer, editor, admin) с наборами разрешений',
        'Создайте middleware для проверки разрешений',
        'Реализуйте BOLA проверки (пользователь — владелец ресурса)',
        'Добавьте аудит-лог всех авторизационных решений',
        'Протестируйте различные сценарии доступа'
      ],
      hint: 'Используйте декораторы/middleware для проверки permissions. Аудит-лог записывает: кто, что, когда, результат. Проверяйте permissions, не роли.',
      expectedOutput: 'Роли: viewer(2 perms), editor(4 perms), admin(8 perms)\nviewer GET /articles — 200 OK\nviewer POST /articles — 403 Forbidden\neditor POST /articles — 200 OK\neditor DELETE /users — 403 Forbidden\nadmin DELETE /users — 200 OK\nАудит: 5 записей с user_id, action, resource, result, timestamp',
      solution: 'from flask import Flask, request, g, jsonify, abort\nfrom functools import wraps\nfrom datetime import datetime\nfrom enum import Enum\n\napp = Flask(__name__)\naudit_log = []\n\nclass Perm(Enum):\n    READ_ARTICLES = "articles:read"\n    WRITE_ARTICLES = "articles:write"\n    DELETE_ARTICLES = "articles:delete"\n    READ_USERS = "users:read"\n    WRITE_USERS = "users:write"\n    DELETE_USERS = "users:delete"\n    VIEW_ANALYTICS = "analytics:view"\n    MANAGE_SETTINGS = "settings:manage"\n\nROLES = {\n    "viewer": {Perm.READ_ARTICLES, Perm.READ_USERS},\n    "editor": {Perm.READ_ARTICLES, Perm.WRITE_ARTICLES, Perm.READ_USERS, Perm.VIEW_ANALYTICS},\n    "admin": set(Perm),  # Все разрешения\n}\n\ndef log_audit(user_id, action, resource, result):\n    audit_log.append({\n        "user_id": user_id,\n        "action": action,\n        "resource": resource,\n        "result": result,\n        "timestamp": datetime.utcnow().isoformat()\n    })\n\ndef require_permission(*perms):\n    def decorator(f):\n        @wraps(f)\n        def wrapper(*args, **kwargs):\n            user = g.current_user\n            user_perms = ROLES.get(user["role"], set())\n            for p in perms:\n                if p not in user_perms:\n                    log_audit(user["id"], p.value, request.path, "denied")\n                    abort(403)\n            log_audit(user["id"], ",".join(p.value for p in perms), request.path, "allowed")\n            return f(*args, **kwargs)\n        return wrapper\n    return decorator\n\ndef require_owner(get_owner_id):\n    def decorator(f):\n        @wraps(f)\n        def wrapper(*args, **kwargs):\n            owner_id = get_owner_id(kwargs)\n            if g.current_user["id"] != owner_id and g.current_user["role"] != "admin":\n                log_audit(g.current_user["id"], "owner_check", request.path, "denied")\n                abort(403)\n            return f(*args, **kwargs)\n        return wrapper\n    return decorator\n\n@app.route("/articles", methods=["POST"])\n@require_permission(Perm.WRITE_ARTICLES)\ndef create_article():\n    return jsonify({"status": "created"})\n\n@app.route("/users/<int:user_id>", methods=["DELETE"])\n@require_permission(Perm.DELETE_USERS)\ndef delete_user(user_id):\n    return jsonify({"status": "deleted"})',
      explanation: 'RBAC система строится на трёх уровнях: роли определяют наборы разрешений, middleware проверяет разрешения перед каждым действием, BOLA проверки гарантируют доступ только к своим ресурсам. Аудит-лог фиксирует все решения авторизации для последующего анализа.'
    }
  ]
}
