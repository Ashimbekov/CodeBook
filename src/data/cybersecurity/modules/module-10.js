export default {
  id: 10,
  title: 'Безопасность API',
  description: 'OAuth2, API ключи, rate limiting, валидация входных данных, защита REST и GraphQL API от основных уязвимостей.',
  lessons: [
    {
      id: 1,
      title: 'Основные уязвимости API',
      type: 'theory',
      content: [
        { type: 'text', value: 'OWASP API Security Top 10 выделяет специфические угрозы для API: Broken Object Level Authorization (BOLA), Broken Authentication, Excessive Data Exposure, Mass Assignment и другие.' },
        { type: 'heading', value: 'OWASP API Security Top 10' },
        { type: 'list', value: [
          'BOLA (Broken Object Level Authorization) — доступ к чужим ресурсам через ID',
          'Broken Authentication — слабая аутентификация API',
          'Broken Object Property Level Authorization — mass assignment, чрезмерное раскрытие',
          'Unrestricted Resource Consumption — отсутствие rate limiting',
          'Broken Function Level Authorization — доступ к админ-функциям',
          'Server Side Request Forgery — SSRF через API',
          'Security Misconfiguration — CORS, debug endpoints',
          'Lack of Protection from Automated Threats — боты, credential stuffing'
        ]},
        { type: 'code', language: 'javascript', value: '// === BOLA (самая частая уязвимость API) ===\n\n// УЯЗВИМО: нет проверки владельца\napp.get("/api/orders/:orderId", async (req, res) => {\n  const order = await Order.findById(req.params.orderId);\n  res.json(order); // Любой может получить любой заказ!\n  // GET /api/orders/1 — мой заказ\n  // GET /api/orders/2 — чужой заказ (BOLA!)\n});\n\n// БЕЗОПАСНО: проверка владельца\napp.get("/api/orders/:orderId", auth, async (req, res) => {\n  const order = await Order.findOne({\n    _id: req.params.orderId,\n    userId: req.user.id  // Только свои заказы!\n  });\n  if (!order) return res.status(404).json({ error: "Not found" });\n  res.json(order);\n});\n\n// === Mass Assignment ===\n\n// УЯЗВИМО: принимаем все поля из запроса\napp.put("/api/profile", auth, async (req, res) => {\n  await User.findByIdAndUpdate(req.user.id, req.body);\n  // Атакующий отправит: { "role": "admin", "verified": true }\n});\n\n// БЕЗОПАСНО: whitelist полей\napp.put("/api/profile", auth, async (req, res) => {\n  const { name, email, bio } = req.body; // Только разрешённые поля\n  await User.findByIdAndUpdate(req.user.id, { name, email, bio });\n});' },
        { type: 'warning', value: 'BOLA (Broken Object Level Authorization) — уязвимость №1 в API. Всегда проверяйте, что пользователь имеет доступ к запрашиваемому ресурсу. Недостаточно аутентифицировать — нужно авторизовать каждый запрос.' }
      ]
    },
    {
      id: 2,
      title: 'OAuth2 и безопасная аутентификация API',
      type: 'theory',
      content: [
        { type: 'text', value: 'OAuth2 — стандартный протокол авторизации для API. Основные flows: Authorization Code (для веб-приложений), Client Credentials (для сервис-сервис), PKCE (для SPA и мобильных).' },
        { type: 'code', language: 'javascript', value: '// === OAuth2 Authorization Code + PKCE (для SPA) ===\n\n// 1. Генерация code_verifier и code_challenge (клиент)\nfunction generatePKCE() {\n  const verifier = crypto.randomBytes(32).toString("base64url");\n  const challenge = crypto\n    .createHash("sha256")\n    .update(verifier)\n    .digest("base64url");\n  return { verifier, challenge };\n}\n\n// 2. Redirect на Authorization Server\n// GET https://auth.example.com/authorize?\n//   response_type=code&\n//   client_id=my-app&\n//   redirect_uri=https://myapp.com/callback&\n//   scope=openid profile email&\n//   state=random-csrf-state&        // Защита от CSRF!\n//   code_challenge=sha256hash&      // PKCE\n//   code_challenge_method=S256\n\n// 3. Callback: обмен code на токены (сервер)\napp.get("/callback", async (req, res) => {\n  const { code, state } = req.query;\n  \n  // Проверяем state (CSRF защита)\n  if (state !== req.session.oauthState) {\n    return res.status(403).json({ error: "Invalid state" });\n  }\n  \n  // Обмен code на токены\n  const tokenResponse = await fetch("https://auth.example.com/token", {\n    method: "POST\",\n    headers: { "Content-Type": "application/x-www-form-urlencoded" },\n    body: new URLSearchParams({\n      grant_type: "authorization_code",\n      code: code,\n      redirect_uri: "https://myapp.com/callback",\n      client_id: "my-app",\n      code_verifier: req.session.codeVerifier,  // PKCE\n    })\n  });\n  \n  const { access_token, refresh_token, id_token } = await tokenResponse.json();\n  // Валидация id_token (JWT), сохранение токенов\n});' },
        { type: 'heading', value: 'Безопасность API ключей' },
        { type: 'code', language: 'python', value: '# === Безопасное управление API ключами ===\nimport secrets\nimport hashlib\nfrom datetime import datetime, timedelta\n\ndef generate_api_key() -> tuple[str, str]:\n    """Генерация API ключа и его хэша для хранения"""\n    # Показываем пользователю полный ключ ОДИН раз\n    api_key = f"sk_{secrets.token_urlsafe(32)}"  # sk_prefix для идентификации\n    \n    # В БД храним только хэш\n    key_hash = hashlib.sha256(api_key.encode()).hexdigest()\n    \n    return api_key, key_hash\n\ndef validate_api_key(provided_key: str) -> dict:\n    """Валидация API ключа"""\n    key_hash = hashlib.sha256(provided_key.encode()).hexdigest()\n    key_record = db.api_keys.find_one({\n        "hash": key_hash,\n        "revoked": False,\n        "expires_at": {"$gt": datetime.utcnow()}\n    })\n    if not key_record:\n        raise AuthError("Invalid API key")\n    \n    # Rate limiting по ключу\n    check_rate_limit(key_record["owner_id"])\n    \n    return key_record' },
        { type: 'tip', value: 'Для SPA всегда используйте Authorization Code + PKCE (не Implicit flow, он устарел). API ключи храните хэшированными в БД, показывайте полный ключ только при создании. Добавляйте префикс (sk_, pk_) для идентификации типа ключа.' }
      ]
    },
    {
      id: 3,
      title: 'Rate Limiting и защита от злоупотреблений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Rate Limiting ограничивает количество запросов к API. Защищает от: DDoS, брутфорса, скрейпинга, исчерпания ресурсов. Алгоритмы: Fixed Window, Sliding Window, Token Bucket, Leaky Bucket.' },
        { type: 'code', language: 'javascript', value: '// === Rate Limiting с express-rate-limit ===\nconst rateLimit = require("express-rate-limit");\nconst RedisStore = require("rate-limit-redis");\nconst Redis = require("ioredis");\n\nconst redis = new Redis();\n\n// Общий rate limit\nconst globalLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000,  // 15 минут\n  max: 100,                    // 100 запросов на окно\n  standardHeaders: true,       // RateLimit-* заголовки\n  store: new RedisStore({ sendCommand: (...args) => redis.call(...args) }),\n  message: { error: "Too many requests, try again later" },\n});\n\n// Строгий rate limit для аутентификации\nconst authLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 5,  // Только 5 попыток логина за 15 минут\n  skipSuccessfulRequests: true,  // Не считать успешные\n});\n\n// Rate limit по API ключу (для платного API)\nconst apiKeyLimiter = rateLimit({\n  windowMs: 60 * 1000,  // 1 минута\n  max: (req) => {\n    // Разные лимиты для разных планов\n    const plan = req.apiKeyPlan;\n    return { free: 10, pro: 100, enterprise: 1000 }[plan] || 10;\n  },\n  keyGenerator: (req) => req.headers["x-api-key\"] || req.ip,\n});\n\napp.use(globalLimiter);\napp.post("/auth/login", authLimiter);\napp.use("/api/v1", apiKeyLimiter);' },
        { type: 'code', language: 'python', value: '# === Rate Limiting в Python (Token Bucket) ===\nimport time\nimport redis\n\nr = redis.Redis()\n\ndef token_bucket_rate_limit(\n    key: str,\n    max_tokens: int = 10,\n    refill_rate: float = 1.0,  # токенов в секунду\n) -> bool:\n    """Token Bucket алгоритм с Redis"""\n    now = time.time()\n    pipe = r.pipeline()\n    \n    # Получаем текущее состояние\n    tokens_key = f"rl:{key}:tokens"\n    timestamp_key = f"rl:{key}:ts"\n    \n    tokens = float(r.get(tokens_key) or max_tokens)\n    last_refill = float(r.get(timestamp_key) or now)\n    \n    # Добавляем токены за прошедшее время\n    elapsed = now - last_refill\n    tokens = min(max_tokens, tokens + elapsed * refill_rate)\n    \n    if tokens >= 1:\n        tokens -= 1\n        pipe.set(tokens_key, tokens)\n        pipe.set(timestamp_key, now)\n        pipe.expire(tokens_key, 60)\n        pipe.expire(timestamp_key, 60)\n        pipe.execute()\n        return True  # Запрос разрешён\n    else:\n        return False  # Rate limit превышен' },
        { type: 'tip', value: 'Возвращайте заголовки Rate Limit: RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset. Это поможет клиентам правильно обрабатывать ограничения. Разные эндпоинты заслуживают разных лимитов.' }
      ]
    },
    {
      id: 4,
      title: 'Валидация входных данных API',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый входящий запрос к API должен быть валидирован: типы данных, длина строк, диапазоны чисел, формат email/URL, допустимые значения enum. Невалидированный ввод — источник инъекций, переполнений и логических ошибок.' },
        { type: 'code', language: 'javascript', value: '// === Валидация с Zod (TypeScript/JavaScript) ===\nconst { z } = require("zod");\n\n// Схема для создания пользователя\nconst createUserSchema = z.object({\n  name: z.string().min(2).max(100).trim(),\n  email: z.string().email().toLowerCase(),\n  age: z.number().int().min(13).max(150).optional(),\n  role: z.enum(["user", "moderator"]),  // НЕ "admin"!\n  password: z.string()\n    .min(12, "Минимум 12 символов")\n    .regex(/[A-Z]/, "Нужна заглавная буква")\n    .regex(/[0-9]/, "Нужна цифра")\n    .regex(/[!@#$%^&*]/, "Нужен спецсимвол"),\n  website: z.string().url().optional().nullable(),\n}).strict();  // .strict() отклоняет неизвестные поля!\n\n// Middleware валидации\nfunction validate(schema) {\n  return (req, res, next) => {\n    const result = schema.safeParse(req.body);\n    if (!result.success) {\n      return res.status(400).json({\n        error: "Validation failed",\n        details: result.error.issues.map(i => ({\n          field: i.path.join("."),\n          message: i.message\n        }))\n      });\n    }\n    req.validatedBody = result.data;  // Только валидированные данные!\n    next();\n  };\n}\n\napp.post("/api/users", validate(createUserSchema), async (req, res) => {\n  // req.validatedBody гарантированно валиден\n  const user = await createUser(req.validatedBody);\n  res.status(201).json(user);\n});' },
        { type: 'code', language: 'python', value: '# === Валидация с Pydantic (Python) ===\nfrom pydantic import BaseModel, Field, EmailStr, validator\nfrom typing import Optional\nfrom enum import Enum\n\nclass UserRole(str, Enum):\n    USER = "user"\n    MODERATOR = "moderator"\n\nclass CreateUserRequest(BaseModel):\n    name: str = Field(..., min_length=2, max_length=100)\n    email: EmailStr\n    age: Optional[int] = Field(None, ge=13, le=150)\n    role: UserRole = UserRole.USER\n    password: str = Field(..., min_length=12)\n    \n    @validator("password")\n    def validate_password(cls, v):\n        if not any(c.isupper() for c in v):\n            raise ValueError("Нужна заглавная буква")\n        if not any(c.isdigit() for c in v):\n            raise ValueError("Нужна цифра")\n        return v\n    \n    class Config:\n        extra = "forbid"  # Запретить неизвестные поля\n\n# FastAPI автоматически валидирует\n@app.post("/api/users")\nasync def create_user(user: CreateUserRequest):\n    # user уже валидирован Pydantic!\n    return await save_user(user)' },
        { type: 'tip', value: 'Используйте .strict() / extra="forbid" для отклонения неизвестных полей — это защита от Mass Assignment. Валидируйте на входе (request) И на выходе (response) — это предотвращает утечку лишних данных.' }
      ]
    },
    {
      id: 5,
      title: 'Безопасность GraphQL API',
      type: 'theory',
      content: [
        { type: 'text', value: 'GraphQL имеет уникальные проблемы безопасности: глубокие вложенные запросы (DoS), интроспекция (раскрытие схемы), отсутствие rate limiting на уровне полей, чрезмерная выборка данных.' },
        { type: 'code', language: 'javascript', value: '// === Проблемы безопасности GraphQL ===\n\n// 1. Глубокие вложенные запросы (DoS)\n// query {\n//   user(id: 1) {\n//     friends {\n//       friends {\n//         friends {\n//           friends { ... } // Экспоненциальная сложность!\n//         }\n//       }\n//     }\n//   }\n// }\n\n// Защита: ограничение глубины запроса\nconst depthLimit = require("graphql-depth-limit");\nconst server = new ApolloServer({\n  typeDefs,\n  resolvers,\n  validationRules: [\n    depthLimit(5),  // Максимальная глубина: 5 уровней\n  ]\n});\n\n// 2. Query cost analysis\nconst costAnalysis = require("graphql-cost-analysis");\n// Каждое поле имеет \"стоимость\", суммарная стоимость запроса ограничена\n\n// 3. Отключение интроспекции в production\nconst server = new ApolloServer({\n  typeDefs,\n  resolvers,\n  introspection: process.env.NODE_ENV !== "production",\n});\n\n// 4. Авторизация на уровне полей\nconst resolvers = {\n  User: {\n    email: (parent, args, context) => {\n      // Только владелец или админ видит email\n      if (context.user.id !== parent.id && context.user.role !== "admin") {\n        return null;\n      }\n      return parent.email;\n    },\n    // Никогда не раскрывать пароль!\n    password: () => { throw new Error("Field not accessible"); }\n  }\n};\n\n// 5. Rate limiting по сложности запроса\n// Простой запрос { user { name } } = cost 1\n// Сложный запрос { users { friends { posts } } } = cost 100' },
        { type: 'tip', value: 'В production отключайте интроспекцию GraphQL, используйте Persisted Queries (только заранее одобренные запросы), ограничивайте глубину и стоимость запросов. GraphQL без этих мер — открытая дверь для злоупотреблений.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Безопасный REST API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте безопасный REST API с аутентификацией, авторизацией, валидацией, rate limiting и защитой от основных уязвимостей.',
      requirements: [
        'Реализуйте JWT аутентификацию с access/refresh токенами',
        'Добавьте BOLA защиту (проверка владельца ресурса)',
        'Настройте rate limiting (глобальный + по эндпоинту)',
        'Добавьте валидацию всех входных данных (Zod/Pydantic)',
        'Добавьте security headers и CORS настройку'
      ],
      hint: 'Используйте middleware для аутентификации, авторизации и валидации. Rate limiting через Redis. CORS только для разрешённых origins.',
      expectedOutput: 'JWT: access_token (15 мин) + refresh_token (7 дней)\nBOLA: GET /api/orders/123 — 404 если не мой заказ\nRate Limit: 100 req/15min (global), 5 req/15min (login)\nВалидация: невалидный email — 400 с подробностями\nHeaders: CORS only app.example.com, HSTS, X-Content-Type-Options',
      solution: 'const express = require("express");\nconst helmet = require("helmet");\nconst rateLimit = require("express-rate-limit");\nconst cors = require("cors");\nconst { z } = require("zod");\nconst jwt = require("jsonwebtoken");\n\nconst app = express();\napp.use(express.json({ limit: "10kb" }));\napp.use(helmet());\n\n// CORS\napp.use(cors({\n  origin: ["https://app.example.com"],\n  methods: ["GET", "POST", "PUT", "DELETE"],\n  credentials: true,\n}));\n\n// Rate Limiting\napp.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));\napp.post("/auth/login", rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }));\n\n// Auth middleware\nconst auth = (req, res, next) => {\n  const token = req.headers.authorization?.replace("Bearer ", "");\n  if (!token) return res.status(401).json({ error: "No token" });\n  try {\n    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });\n    next();\n  } catch (e) {\n    res.status(401).json({ error: "Invalid token" });\n  }\n};\n\n// Validation middleware\nconst validate = (schema) => (req, res, next) => {\n  const result = schema.safeParse(req.body);\n  if (!result.success) return res.status(400).json({ error: result.error.issues });\n  req.body = result.data;\n  next();\n};\n\n// BOLA-safe endpoint\napp.get("/api/orders/:id", auth, async (req, res) => {\n  const order = await Order.findOne({\n    _id: req.params.id,\n    userId: req.user.sub  // BOLA protection!\n  });\n  if (!order) return res.status(404).json({ error: "Not found" });\n  res.json(order);\n});\n\n// Validated creation\nconst orderSchema = z.object({\n  product: z.string().min(1).max(200),\n  quantity: z.number().int().min(1).max(100),\n}).strict();\n\napp.post("/api/orders", auth, validate(orderSchema), async (req, res) => {\n  const order = await Order.create({ ...req.body, userId: req.user.sub });\n  res.status(201).json(order);\n});',
      explanation: 'Безопасный API строится на слоях: аутентификация (JWT), авторизация (BOLA — проверка владельца), валидация (Zod — типы и ограничения), rate limiting (защита от злоупотреблений), security headers (CORS, HSTS). Каждый слой защищает от определённого класса атак.'
    }
  ]
}
