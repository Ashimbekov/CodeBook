export default {
  id: 39,
  title: 'JWT и аутентификация',
  description: 'JSON Web Tokens с jsonwebtoken, хэширование паролей с bcrypt, защита маршрутов и авторизационный middleware',
  lessons: [
    {
      id: 1,
      title: 'Что такое JWT',
      type: 'theory',
      content: [
        { type: 'text', value: 'JWT (JSON Web Token) — стандарт для передачи данных между сторонами в виде подписанного JSON объекта. Состоит из трёх частей: header.payload.signature, закодированных в base64.' },
        { type: 'heading', value: 'Структура JWT' },
        { type: 'code', language: 'javascript', value: '// JWT состоит из трёх частей:\n// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  — Header (алгоритм, тип)\n// eyJ1c2VySWQiOjEsImVtYWlsIjoiYUBiLmMifQ  — Payload (данные)\n// SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c  — Signature (подпись)\n\n// npm install jsonwebtoken\nconst jwt = require("jsonwebtoken");\n\nconst SECRET = process.env.JWT_SECRET || "my-secret-key";\n\n// Создание токена\nconst token = jwt.sign(\n  { userId: 1, email: "user@example.com", role: "user" }, // payload\n  SECRET,              // секретный ключ\n  { expiresIn: "1h" }  // опции: срок жизни\n);\nconsole.log(token); // eyJ...\n\n// Проверка токена\ntry {\n  const decoded = jwt.verify(token, SECRET);\n  console.log(decoded);\n  // { userId: 1, email: "user@example.com", role: "user", iat: 1234567890, exp: 1234571490 }\n} catch (err) {\n  // JsonWebTokenError — неверная подпись\n  // TokenExpiredError — токен просрочен\n  // NotBeforeError — токен ещё не активен\n  console.error("Неверный токен:", err.message);\n}\n\n// Декодирование без проверки (не безопасно!)\nconst data = jwt.decode(token);\nconsole.log(data); // payload без проверки подписи' },
        { type: 'tip', value: 'Никогда не храните JWT_SECRET в коде! Используйте переменные окружения (.env). Секрет должен быть длинным и случайным: crypto.randomBytes(64).toString("hex").' }
      ]
    },
    {
      id: 2,
      title: 'bcrypt — хэширование паролей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пароли нельзя хранить в открытом виде. bcrypt — медленный алгоритм хэширования специально для паролей. "Медленность" защищает от брутфорса. Salt rounds определяет сложность.' },
        { type: 'heading', value: 'Работа с bcrypt' },
        { type: 'code', language: 'javascript', value: '// npm install bcryptjs (чистый JS) или bcrypt (нативный)\nconst bcrypt = require("bcryptjs");\n\n// ХЭШИРОВАНИЕ при регистрации\nasync function hashPassword(plainPassword) {\n  const saltRounds = 12; // 2^12 итераций (рекомендуется 10-14)\n  const hash = await bcrypt.hash(plainPassword, saltRounds);\n  return hash;\n  // "$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"\n}\n\n// ПРОВЕРКА при входе\nasync function verifyPassword(plainPassword, hash) {\n  const isMatch = await bcrypt.compare(plainPassword, hash);\n  return isMatch; // true или false\n}\n\n// Использование\nasync function registerUser(email, password) {\n  const existingUser = await User.findByEmail(email);\n  if (existingUser) throw new Error("Email уже занят");\n\n  const passwordHash = await hashPassword(password);\n  const user = await User.create({ email, passwordHash });\n  return user;\n  // НЕ храним plainPassword!\n}\n\nasync function loginUser(email, password) {\n  const user = await User.findByEmail(email);\n  if (!user) throw new Error("Пользователь не найден");\n\n  const isValid = await verifyPassword(password, user.passwordHash);\n  if (!isValid) throw new Error("Неверный пароль");\n\n  return user;\n}\n\n// Синхронные версии (не используйте в production!)\n// const hash = bcrypt.hashSync(password, 12);\n// const match = bcrypt.compareSync(password, hash);' }
      ]
    },
    {
      id: 3,
      title: 'Регистрация и вход',
      type: 'theory',
      content: [
        { type: 'text', value: 'Полный flow аутентификации: регистрация (хэш пароля + сохранение), вход (проверка + выдача JWT), защищённые маршруты (проверка JWT).' },
        { type: 'heading', value: 'Auth роутер' },
        { type: 'code', language: 'javascript', value: 'const express = require("express");\nconst jwt = require("jsonwebtoken");\nconst bcrypt = require("bcryptjs");\nconst router = express.Router();\n\nconst SECRET = process.env.JWT_SECRET || "secret";\nconst users = []; // В реальности — база данных\n\n// РЕГИСТРАЦИЯ\nrouter.post("/register", async (req, res) => {\n  try {\n    const { email, password, name } = req.body;\n    if (!email || !password || !name)\n      return res.status(400).json({ error: "Все поля обязательны" });\n    if (password.length < 8)\n      return res.status(400).json({ error: "Пароль минимум 8 символов" });\n\n    const exists = users.find(u => u.email === email);\n    if (exists) return res.status(409).json({ error: "Email уже занят" });\n\n    const passwordHash = await bcrypt.hash(password, 12);\n    const user = { id: users.length + 1, email, name, passwordHash };\n    users.push(user);\n\n    const token = jwt.sign({ userId: user.id, email }, SECRET, { expiresIn: "7d" });\n    res.status(201).json({\n      message: "Регистрация успешна",\n      token,\n      user: { id: user.id, email, name } // НЕ включаем passwordHash!\n    });\n  } catch (err) {\n    res.status(500).json({ error: "Ошибка сервера" });\n  }\n});\n\n// ВХОД\nrouter.post("/login", async (req, res) => {\n  try {\n    const { email, password } = req.body;\n    const user = users.find(u => u.email === email);\n    if (!user) return res.status(401).json({ error: "Неверные данные" });\n\n    const isValid = await bcrypt.compare(password, user.passwordHash);\n    if (!isValid) return res.status(401).json({ error: "Неверные данные" });\n\n    const token = jwt.sign({ userId: user.id, email }, SECRET, { expiresIn: "7d" });\n    res.json({ token, user: { id: user.id, email, name: user.name } });\n  } catch (err) {\n    res.status(500).json({ error: "Ошибка сервера" });\n  }\n});\n\nmodule.exports = router;' },
        { type: 'tip', value: 'При неверном email или пароле возвращайте одинаковое сообщение "Неверные данные". Разные сообщения позволяют перебирать существующие email (user enumeration attack).' }
      ]
    },
    {
      id: 4,
      title: 'Auth middleware',
      type: 'theory',
      content: [
        { type: 'text', value: 'Middleware аутентификации проверяет JWT в каждом защищённом запросе. Токен обычно передаётся в заголовке Authorization: Bearer <token>.' },
        { type: 'heading', value: 'Защита маршрутов' },
        { type: 'code', language: 'javascript', value: 'const jwt = require("jsonwebtoken");\nconst SECRET = process.env.JWT_SECRET;\n\n// Middleware аутентификации\nconst authenticate = (req, res, next) => {\n  const authHeader = req.headers.authorization;\n  if (!authHeader || !authHeader.startsWith("Bearer ")) {\n    return res.status(401).json({ error: "Токен не предоставлен" });\n  }\n  const token = authHeader.split(" ")[1];\n  try {\n    const decoded = jwt.verify(token, SECRET);\n    req.user = decoded; // Добавляем данные пользователя в req\n    next();\n  } catch (err) {\n    if (err.name === "TokenExpiredError")\n      return res.status(401).json({ error: "Токен истёк" });\n    return res.status(401).json({ error: "Неверный токен" });\n  }\n};\n\n// Middleware авторизации по роли\nconst requireRole = (...roles) => (req, res, next) => {\n  if (!roles.includes(req.user.role)) {\n    return res.status(403).json({ error: "Недостаточно прав" });\n  }\n  next();\n};\n\n// Использование\nconst express = require("express");\nconst router = express.Router();\n\n// Публичный маршрут\nrouter.get("/public", (req, res) => res.json({ data: "Публичные данные" }));\n\n// Только для авторизованных\nrouter.get("/profile", authenticate, (req, res) => {\n  res.json({ user: req.user });\n});\n\n// Только для администраторов\nrouter.delete("/users/:id", authenticate, requireRole("admin"), (req, res) => {\n  res.json({ deleted: req.params.id });\n});\n\n// Применить authenticate ко всему роутеру\nconst protectedRouter = express.Router();\nprotectedRouter.use(authenticate);\nprotectedRouter.get("/data", (req, res) => res.json({ secret: "data" }));' }
      ]
    },
    {
      id: 5,
      title: 'Refresh tokens',
      type: 'theory',
      content: [
        { type: 'text', value: 'Access токены короткоживущие (15 мин — 1 час). Refresh токены долгоживущие (7-30 дней), хранятся в БД. Позволяют выдавать новые access токены без повторного входа.' },
        { type: 'heading', value: 'Система refresh токенов' },
        { type: 'code', language: 'javascript', value: 'const jwt = require("jsonwebtoken");\nconst ACCESS_SECRET = process.env.ACCESS_SECRET;\nconst REFRESH_SECRET = process.env.REFRESH_SECRET;\n\n// Хранилище refresh токенов (в реальности — Redis или БД)\nconst refreshTokensStore = new Set();\n\nconst generateTokens = (userId, email) => {\n  const accessToken = jwt.sign(\n    { userId, email },\n    ACCESS_SECRET,\n    { expiresIn: "15m" } // Короткоживущий\n  );\n  const refreshToken = jwt.sign(\n    { userId, email },\n    REFRESH_SECRET,\n    { expiresIn: "7d" } // Долгоживущий\n  );\n  return { accessToken, refreshToken };\n};\n\n// Эндпоинт для обновления токена\nrouter.post("/refresh", (req, res) => {\n  const { refreshToken } = req.body;\n  if (!refreshToken || !refreshTokensStore.has(refreshToken)) {\n    return res.status(401).json({ error: "Refresh token не найден" });\n  }\n  try {\n    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);\n    refreshTokensStore.delete(refreshToken); // Ротация\n    const tokens = generateTokens(decoded.userId, decoded.email);\n    refreshTokensStore.add(tokens.refreshToken);\n    res.json(tokens);\n  } catch {\n    refreshTokensStore.delete(refreshToken);\n    res.status(401).json({ error: "Refresh token истёк" });\n  }\n});\n\n// Выход — удаляем refresh token\nrouter.post("/logout", (req, res) => {\n  const { refreshToken } = req.body;\n  refreshTokensStore.delete(refreshToken);\n  res.json({ message: "Вышли успешно" });\n});' }
      ]
    },
    {
      id: 6,
      title: 'Безопасность аутентификации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Безопасность auth системы включает: защиту от брутфорса, HTTPS, безопасное хранение токенов, CSRF защиту, валидацию входных данных.' },
        { type: 'heading', value: 'Основные меры безопасности' },
        { type: 'code', language: 'javascript', value: '// 1. Rate limiting для auth эндпоинтов\nconst rateLimit = require("express-rate-limit");\n\nconst authLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000, // 15 минут\n  max: 10, // 10 попыток\n  message: { error: "Слишком много попыток входа, подождите 15 минут" },\n  skipSuccessfulRequests: true, // Не считаем успешные\n});\n\napp.use("/api/auth/login", authLimiter);\napp.use("/api/auth/register", authLimiter);\n\n// 2. Helmet — безопасные HTTP заголовки\nconst helmet = require("helmet");\napp.use(helmet());\n\n// 3. Проверка сложности пароля\nconst validatePassword = (password) => {\n  const checks = [\n    { test: password.length >= 8, msg: "Минимум 8 символов" },\n    { test: /[A-Z]/.test(password), msg: "Нужна заглавная буква" },\n    { test: /[a-z]/.test(password), msg: "Нужна строчная буква" },\n    { test: /[0-9]/.test(password), msg: "Нужна цифра" },\n    { test: /[!@#$%]/.test(password), msg: "Нужен спецсимвол" }\n  ];\n  const failed = checks.filter(c => !c.test).map(c => c.msg);\n  return { valid: failed.length === 0, errors: failed };\n};\n\n// 4. Не раскрывать детали ошибок\nrouter.post("/login", async (req, res) => {\n  const user = await findUser(req.body.email);\n  if (!user || !(await bcrypt.compare(req.body.password, user.hash))) {\n    // Одно сообщение для обоих случаев\n    return res.status(401).json({ error: "Неверный email или пароль" });\n  }\n  // ...\n});' },
        { type: 'tip', value: 'Храните JWT в httpOnly cookies в браузере, а не в localStorage. httpOnly cookies недоступны JavaScript коду, что защищает от XSS атак.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Система аутентификации',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте полную систему аутентификации с регистрацией, входом, refresh токенами и защищёнными маршрутами.',
      requirements: [
        'POST /auth/register: email, password (min 8), name. Хэш пароля bcrypt, выдача JWT',
        'POST /auth/login: проверка email+password, выдача access (15m) + refresh (7d) токенов',
        'POST /auth/refresh: проверка refresh token, выдача новых токенов (ротация)',
        'POST /auth/logout: удаление refresh token',
        'GET /profile: только с валидным access token',
        'GET /admin: только для role="admin"',
        'Rate limiting: 5 попыток входа за 15 минут',
        'Единообразные сообщения об ошибках (не раскрывать детали)'
      ],
      solution: {
        code: 'const express = require("express");\nconst jwt = require("jsonwebtoken");\nconst bcrypt = require("bcryptjs");\nconst app = express();\napp.use(express.json());\n\nconst ACCESS_SECRET = "access-secret";\nconst REFRESH_SECRET = "refresh-secret";\nconst users = [];\nconst refreshTokens = new Set();\nconst loginAttempts = new Map();\n\nconst rateLimiter = (req, res, next) => {\n  const key = req.ip;\n  const now = Date.now();\n  const attempts = (loginAttempts.get(key) || []).filter(t => now - t < 900000);\n  if (attempts.length >= 5) return res.status(429).json({ error: "Слишком много попыток" });\n  loginAttempts.set(key, [...attempts, now]);\n  next();\n};\n\nconst authenticate = (req, res, next) => {\n  const token = req.headers.authorization?.split(" ")[1];\n  if (!token) return res.status(401).json({ error: "Нет токена" });\n  try { req.user = jwt.verify(token, ACCESS_SECRET); next(); }\n  catch { res.status(401).json({ error: "Неверный токен" }); }\n};\n\nconst requireAdmin = (req, res, next) =>\n  req.user.role === "admin" ? next() : res.status(403).json({ error: "Нет прав" });\n\napp.post("/auth/register", async (req, res) => {\n  const { email, password, name } = req.body;\n  if (!email || !password || !name) return res.status(400).json({ error: "Все поля обязательны" });\n  if (password.length < 8) return res.status(400).json({ error: "Пароль минимум 8 символов" });\n  if (users.find(u => u.email === email)) return res.status(409).json({ error: "Email занят" });\n  const hash = await bcrypt.hash(password, 12);\n  const user = { id: users.length + 1, email, name, hash, role: "user" };\n  users.push(user);\n  const accessToken = jwt.sign({ userId: user.id, email, role: user.role }, ACCESS_SECRET, { expiresIn: "15m" });\n  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: "7d" });\n  refreshTokens.add(refreshToken);\n  res.status(201).json({ accessToken, refreshToken, user: { id: user.id, email, name } });\n});\n\napp.post("/auth/login", rateLimiter, async (req, res) => {\n  const { email, password } = req.body;\n  const user = users.find(u => u.email === email);\n  if (!user || !(await bcrypt.compare(password, user.hash)))\n    return res.status(401).json({ error: "Неверный email или пароль" });\n  const accessToken = jwt.sign({ userId: user.id, email, role: user.role }, ACCESS_SECRET, { expiresIn: "15m" });\n  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: "7d" });\n  refreshTokens.add(refreshToken);\n  res.json({ accessToken, refreshToken });\n});\n\napp.post("/auth/refresh", (req, res) => {\n  const { refreshToken } = req.body;\n  if (!refreshToken || !refreshTokens.has(refreshToken)) return res.status(401).json({ error: "Неверный refresh token" });\n  try {\n    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);\n    refreshTokens.delete(refreshToken);\n    const user = users.find(u => u.id === decoded.userId);\n    const newAccess = jwt.sign({ userId: user.id, email: user.email, role: user.role }, ACCESS_SECRET, { expiresIn: "15m" });\n    const newRefresh = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: "7d" });\n    refreshTokens.add(newRefresh);\n    res.json({ accessToken: newAccess, refreshToken: newRefresh });\n  } catch { res.status(401).json({ error: "Токен истёк" }); }\n});\n\napp.post("/auth/logout", (req, res) => {\n  refreshTokens.delete(req.body.refreshToken);\n  res.json({ message: "Вышли" });\n});\n\napp.get("/profile", authenticate, (req, res) => res.json({ user: req.user }));\napp.get("/admin", authenticate, requireAdmin, (req, res) => res.json({ secret: "admin data" }));\n\napp.listen(3000, () => console.log("Auth сервер запущен"));',
        language: 'javascript'
      },
      explanation: 'Два отдельных секрета для access и refresh токенов — компрометация одного не раскрывает другой. bcrypt.hash с 12 раундами даёт ~300мс на хэширование — достаточно медленно против брутфорса. Ротация refresh токенов при /auth/refresh: старый удаляется, новый добавляется — это предотвращает повторное использование украденного токена. Rate limiter фильтрует попытки за последние 15 минут (900000мс). Одинаковое сообщение об ошибке при неверном email и пароле защищает от перебора пользователей.'
    }
  ]
};
