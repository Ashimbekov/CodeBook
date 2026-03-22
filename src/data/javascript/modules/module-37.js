export default {
  id: 37,
  title: 'Express Middleware',
  description: 'Middleware в Express: app.use, morgan для логирования, cors для кросс-доменных запросов, обработка ошибок и создание своих middleware',
  lessons: [
    {
      id: 1,
      title: 'Что такое Middleware',
      type: 'theory',
      content: [
        { type: 'text', value: 'Middleware — функции, выполняемые между получением запроса и отправкой ответа. Каждая функция получает (req, res, next) и либо завершает цикл, либо передаёт управление дальше через next().' },
        { type: 'heading', value: 'Цепочка middleware' },
        { type: 'code', language: 'javascript', value: 'const express = require("express");\nconst app = express();\n\n// Middleware — это функция с (req, res, next)\nconst logger = (req, res, next) => {\n  const start = Date.now();\n  console.log(`--> ${req.method} ${req.path}`);\n\n  // Вызов next() передаёт управление следующему middleware\n  next();\n\n  // Этот код выполнится ПОСЛЕ отправки ответа\n  // (только с специальной техникой — res.on("finish"))\n};\n\nconst auth = (req, res, next) => {\n  const token = req.headers.authorization;\n  if (!token) {\n    // Можно завершить цикл, не вызывая next()\n    return res.status(401).json({ error: "Не авторизован" });\n  }\n  next(); // Продолжаем, если токен есть\n};\n\nconst addTimestamp = (req, res, next) => {\n  req.timestamp = new Date().toISOString(); // Добавляем данные в req\n  next();\n};\n\n// Порядок важен! Выполняются сверху вниз\napp.use(logger);\napp.use(addTimestamp);\n\n// auth только для конкретного маршрута\napp.get("/profile", auth, (req, res) => {\n  res.json({ profile: "data", time: req.timestamp });\n});' },
        { type: 'tip', value: 'Всегда вызывайте next() или отправляйте ответ. Если не делать ни того, ни другого — запрос "зависнет". Для передачи ошибки: next(new Error("сообщение")).' }
      ]
    },
    {
      id: 2,
      title: 'app.use — подключение middleware',
      type: 'theory',
      content: [
        { type: 'text', value: 'app.use() регистрирует middleware для всех маршрутов или только для указанного пути. Встроенные middleware: express.json(), express.urlencoded(), express.static().' },
        { type: 'heading', value: 'Встроенные и глобальные middleware' },
        { type: 'code', language: 'javascript', value: 'const express = require("express");\nconst app = express();\n\n// Встроенные middleware\napp.use(express.json());           // Парсит JSON тело\napp.use(express.urlencoded({ extended: true })); // Парсит form-data\napp.use(express.static("public")); // Раздаёт статику\n\n// Middleware только для /api маршрутов\napp.use("/api", (req, res, next) => {\n  res.setHeader("X-API-Version", "1.0");\n  next();\n});\n\n// Несколько middleware подряд\napp.use(\n  (req, res, next) => { req.startTime = Date.now(); next(); },\n  (req, res, next) => { req.requestId = Math.random().toString(36).slice(2); next(); }\n);\n\n// Условное применение\nif (process.env.NODE_ENV !== "production") {\n  app.use((req, res, next) => {\n    console.log("DEV:", req.method, req.url);\n    next();\n  });\n}\n\n// app.use для роутера\nconst apiRouter = express.Router();\napiRouter.get("/users", (req, res) => res.json([]));\napp.use("/api/v1", apiRouter);\n// Маршрут будет: /api/v1/users' }
      ]
    },
    {
      id: 3,
      title: 'morgan — логирование запросов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Morgan — популярный HTTP-логгер для Express. Показывает метод, путь, статус, время ответа. Поддерживает форматы: tiny, combined, dev, common.' },
        { type: 'heading', value: 'Настройка morgan' },
        { type: 'code', language: 'javascript', value: '// npm install morgan\nconst express = require("express");\nconst morgan = require("morgan");\nconst fs = require("fs");\nconst path = require("path");\n\nconst app = express();\n\n// Простое использование — вывод в консоль\napp.use(morgan("dev"));\n// Вывод: GET /users 200 12.345 ms - 128\n// Цвета: зелёный (2xx), жёлтый (3xx), красный (4xx/5xx)\n\n// Форматы:\n// "tiny"     — метод, путь, статус, время\n// "dev"      — как tiny, но с цветами\n// "common"   — Apache common log format\n// "combined" — Apache combined format (IP, дата, реферер)\n\n// Запись логов в файл\nconst logStream = fs.createWriteStream(\n  path.join(__dirname, "access.log"),\n  { flags: "a" } // append\n);\napp.use(morgan("combined", { stream: logStream }));\n\n// Кастомный формат\nmorgan.token("user-id", (req) => req.user?.id || "anonymous");\napp.use(morgan(":method :url :status :response-time ms — userId: :user-id"));\n\n// Пропуск статики\napp.use(morgan("dev", {\n  skip: (req, res) => req.url.startsWith("/static")\n}));\n\napp.listen(3000);' },
        { type: 'tip', value: 'В production используйте morgan("combined") с записью в файл. В development — morgan("dev") для цветного вывода в терминал.' }
      ]
    },
    {
      id: 4,
      title: 'cors — кросс-доменные запросы',
      type: 'theory',
      content: [
        { type: 'text', value: 'CORS (Cross-Origin Resource Sharing) позволяет браузеру делать запросы к другому домену. По умолчанию браузеры блокируют такие запросы — cors middleware добавляет нужные заголовки.' },
        { type: 'heading', value: 'Настройка CORS' },
        { type: 'code', language: 'javascript', value: '// npm install cors\nconst express = require("express");\nconst cors = require("cors");\nconst app = express();\n\n// Разрешить все домены (НЕ для production!)\napp.use(cors());\n// Добавляет: Access-Control-Allow-Origin: *\n\n// Конкретный домен\napp.use(cors({\n  origin: "https://myapp.com",\n  methods: ["GET", "POST", "PUT", "DELETE"],\n  allowedHeaders: ["Content-Type", "Authorization"],\n  credentials: true, // Разрешить cookies\n}));\n\n// Несколько доменов\nconst allowedOrigins = ["http://localhost:3000", "https://myapp.com"];\napp.use(cors({\n  origin: (origin, callback) => {\n    if (!origin || allowedOrigins.includes(origin)) {\n      callback(null, true);\n    } else {\n      callback(new Error("Не разрешено CORS"));\n    }\n  }\n}));\n\n// CORS только для конкретного маршрута\napp.get("/public-data", cors(), (req, res) => {\n  res.json({ data: "Открытые данные" });\n});\n\n// Preflight OPTIONS запросы\napp.options("*", cors()); // Разрешить preflight для всех маршрутов\n\napp.listen(3000);' }
      ]
    },
    {
      id: 5,
      title: 'Кастомные middleware',
      type: 'theory',
      content: [
        { type: 'text', value: 'Создание своих middleware позволяет добавить логику аутентификации, валидации, кэширования. Middleware может добавлять данные в req для использования в следующих обработчиках.' },
        { type: 'heading', value: 'Примеры кастомных middleware' },
        { type: 'code', language: 'javascript', value: '// 1. Middleware аутентификации\nconst jwt = require("jsonwebtoken");\n\nconst authenticate = (req, res, next) => {\n  const authHeader = req.headers.authorization;\n  if (!authHeader?.startsWith("Bearer ")) {\n    return res.status(401).json({ error: "Токен не предоставлен" });\n  }\n  const token = authHeader.split(" ")[1];\n  try {\n    req.user = jwt.verify(token, process.env.JWT_SECRET);\n    next();\n  } catch {\n    res.status(401).json({ error: "Недействительный токен" });\n  }\n};\n\n// 2. Middleware валидации тела\nconst validateBody = (schema) => (req, res, next) => {\n  const { error } = schema.validate(req.body);\n  if (error) return res.status(400).json({ error: error.details[0].message });\n  next();\n};\n\n// 3. Rate limiter\nconst rateMap = new Map();\nconst rateLimiter = (maxRequests, windowMs) => (req, res, next) => {\n  const key = req.ip;\n  const now = Date.now();\n  const requests = rateMap.get(key) || [];\n  const recent = requests.filter(t => now - t < windowMs);\n  if (recent.length >= maxRequests) {\n    return res.status(429).json({ error: "Слишком много запросов" });\n  }\n  recent.push(now);\n  rateMap.set(key, recent);\n  next();\n};\n\n// Использование\napp.get("/profile", authenticate, (req, res) => {\n  res.json({ user: req.user });\n});\n\napp.use("/api", rateLimiter(100, 60000)); // 100 запросов в минуту' }
      ]
    },
    {
      id: 6,
      title: 'Обработка ошибок middleware',
      type: 'theory',
      content: [
        { type: 'text', value: 'Error-handling middleware имеет сигнатуру (err, req, res, next) с 4 параметрами. Express вызывает его только когда передают ошибку через next(err) или выбрасывают её синхронно.' },
        { type: 'heading', value: 'Централизованная обработка ошибок' },
        { type: 'code', language: 'javascript', value: 'const express = require("express");\nconst app = express();\napp.use(express.json());\n\n// Кастомный класс ошибки\nclass AppError extends Error {\n  constructor(message, statusCode = 500) {\n    super(message);\n    this.statusCode = statusCode;\n    this.isOperational = true; // Ожидаемая ошибка\n  }\n}\n\n// Обёртка для async обработчиков\nconst asyncHandler = (fn) => (req, res, next) =>\n  Promise.resolve(fn(req, res, next)).catch(next);\n\n// Маршруты используют asyncHandler\napp.get("/users/:id", asyncHandler(async (req, res) => {\n  const user = await User.findById(req.params.id);\n  if (!user) throw new AppError("Пользователь не найден", 404);\n  res.json(user);\n}));\n\n// 404 middleware (перед error handler)\napp.use((req, res, next) => {\n  next(new AppError(`Маршрут ${req.originalUrl} не найден`, 404));\n});\n\n// Глобальный error handler (4 параметра, ПОСЛЕДНИЙ)\napp.use((err, req, res, next) => {\n  const status = err.statusCode || 500;\n  const message = err.isOperational\n    ? err.message\n    : "Внутренняя ошибка сервера";\n\n  // Логируем только неожиданные ошибки\n  if (!err.isOperational) console.error("UNEXPECTED ERROR:", err);\n\n  res.status(status).json({\n    success: false,\n    error: message,\n    ...(process.env.NODE_ENV === "development" && { stack: err.stack })\n  });\n});\n\napp.listen(3000);' },
        { type: 'tip', value: 'asyncHandler — незаменимый паттерн. Без него каждый async маршрут нужно оборачивать в try/catch. С asyncHandler достаточно выбросить ошибку.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Middleware стек',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Express приложение с полным стеком middleware: логирование, CORS, аутентификация, rate limiting и обработка ошибок.',
      requirements: [
        'Подключите morgan для логирования всех запросов',
        'Настройте cors для localhost:3000 и localhost:5173',
        'Создайте middleware логирования запросов в файл requests.log',
        'Создайте authenticate middleware, проверяющий Bearer токен "secret-token-123"',
        'Создайте rateLimiter: не более 5 запросов в 10 секунд с одного IP',
        'Защищённые маршруты /api/protected требуют аутентификации',
        'Публичные маршруты /api/public доступны всем',
        'Глобальный error handler возвращает { error, statusCode }'
      ],
      solution: {
        code: 'const express = require("express");\nconst morgan = require("morgan");\nconst cors = require("cors");\nconst fs = require("fs");\nconst app = express();\n\n// Логирование в файл\nconst logStream = fs.createWriteStream("requests.log", { flags: "a" });\napp.use(morgan("combined", { stream: logStream }));\napp.use(morgan("dev"));\n\n// CORS\napp.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"] }));\napp.use(express.json());\n\n// Rate limiter\nconst rateMap = new Map();\nconst rateLimiter = (req, res, next) => {\n  const key = req.ip;\n  const now = Date.now();\n  const hits = (rateMap.get(key) || []).filter(t => now - t < 10000);\n  if (hits.length >= 5) return res.status(429).json({ error: "Слишком много запросов" });\n  hits.push(now);\n  rateMap.set(key, hits);\n  next();\n};\napp.use(rateLimiter);\n\n// Auth middleware\nconst authenticate = (req, res, next) => {\n  const auth = req.headers.authorization;\n  if (auth !== "Bearer secret-token-123")\n    return res.status(401).json({ error: "Не авторизован" });\n  req.user = { id: 1, name: "Admin" };\n  next();\n};\n\napp.get("/api/public", (req, res) => res.json({ data: "Публичные данные" }));\napp.get("/api/protected", authenticate, (req, res) => res.json({ user: req.user }));\n\napp.use((err, req, res, next) => {\n  res.status(err.statusCode || 500).json({ error: err.message });\n});\n\napp.listen(3000, () => console.log("Готово"));',
        language: 'javascript'
      }
    }
  ]
};
