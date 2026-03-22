export default {
  id: 52,
  title: 'Best Practices',
  description: 'Лучшие практики JavaScript: обработка ошибок, безопасность, производительность, код ревью и типичные антипаттерны',
  lessons: [
    {
      id: 1,
      title: 'Обработка ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильная обработка ошибок: различать операционные (ожидаемые) и программные (баги) ошибки, никогда не глотать ошибки, всегда логировать с контекстом.' },
        { type: 'heading', value: 'Паттерны обработки ошибок' },
        { type: 'code', language: 'javascript', value: '// Кастомные классы ошибок\nclass AppError extends Error {\n  constructor(message, code, statusCode = 500) {\n    super(message);\n    this.name = this.constructor.name;\n    this.code = code;\n    this.statusCode = statusCode;\n    Error.captureStackTrace(this, this.constructor);\n  }\n}\n\nclass ValidationError extends AppError {\n  constructor(message, fields = {}) {\n    super(message, "VALIDATION_ERROR", 400);\n    this.fields = fields;\n  }\n}\n\nclass NotFoundError extends AppError {\n  constructor(resource) {\n    super(`${resource} не найден`, "NOT_FOUND", 404);\n  }\n}\n\n// Result pattern (без исключений)\nconst Result = {\n  ok: (value) => ({ success: true, value }),\n  fail: (error) => ({ success: false, error })\n};\n\nasync function getUser(id) {\n  try {\n    const user = await db.findById(id);\n    if (!user) return Result.fail(new NotFoundError("Пользователь"));\n    return Result.ok(user);\n  } catch (err) {\n    return Result.fail(err);\n  }\n}\n\nconst { success, value: user, error } = await getUser(1);\nif (!success) handleError(error);\n\n// Никогда не глотайте ошибки\n// Плохо:\ntry { doSomething(); } catch (err) {} // Тихо игнорируем!\n\n// Хорошо:\ntry {\n  doSomething();\n} catch (err) {\n  logger.error({ err, context: "doSomething" }, "Ошибка");\n  throw err; // Или обработайте осмысленно\n}' },
        { type: 'tip', value: 'Всегда создавайте специфичные классы ошибок. Это позволяет поймать конкретный тип ошибки через catch и дать правильный HTTP ответ.' }
      ]
    },
    {
      id: 2,
      title: 'Безопасность',
      type: 'theory',
      content: [
        { type: 'text', value: 'Основные угрозы веб-приложений: XSS, SQL/NoSQL инъекции, CSRF, раскрытие данных, небезопасные зависимости. Принцип минимальных привилегий.' },
        { type: 'heading', value: 'Безопасность Node.js/Express' },
        { type: 'code', language: 'javascript', value: 'const express = require("express");\nconst helmet = require("helmet");       // Безопасные заголовки\nconst rateLimit = require("express-rate-limit");\nconst mongoSanitize = require("express-mongo-sanitize");\nconst xss = require("xss-clean");\n\nconst app = express();\n\n// 1. Безопасные HTTP заголовки\napp.use(helmet());\n// Устанавливает: X-Content-Type-Options, X-Frame-Options,\n// Content-Security-Policy, X-XSS-Protection и другие\n\n// 2. Rate limiting\napp.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));\n\n// 3. Очистка от NoSQL инъекций\n// { "$gt": "" } -> удаляется\napp.use(mongoSanitize());\n\n// 4. XSS защита\napp.use(xss());\n\n// 5. Никогда не раскрывайте детали ошибок в production\napp.use((err, req, res, next) => {\n  const isDev = process.env.NODE_ENV === "development";\n  res.status(err.statusCode || 500).json({\n    error: err.isOperational ? err.message : "Ошибка сервера",\n    stack: isDev ? err.stack : undefined // Только в dev\n  });\n});\n\n// 6. Переменные окружения для секретов\n// НИКОГДА в коде:\nconst secret = "hardcoded-secret"; // ПЛОХО\n// Всегда через env:\nconst jwtSecret = process.env.JWT_SECRET; // ХОРОШО\n\n// 7. Обновляйте зависимости\n// npm audit          — проверить уязвимости\n// npm audit fix      — исправить\n// npm outdated       — устаревшие пакеты\n\n// 8. .gitignore обязателен для:\n// .env, *.key, secrets.json, credentials.json' }
      ]
    },
    {
      id: 3,
      title: 'Производительность Node.js',
      type: 'theory',
      content: [
        { type: 'text', value: 'Node.js однопоточный — длинные синхронные операции блокируют весь сервер. Используйте async I/O, кластеризацию, кэширование и профилирование.' },
        { type: 'heading', value: 'Оптимизация Node.js' },
        { type: 'code', language: 'javascript', value: '// 1. Не блокируйте event loop\n// Плохо — синхронная тяжёлая операция\napp.get("/sort", (req, res) => {\n  const sorted = heavySort(millionItems); // Блокирует весь сервер!\n  res.json(sorted);\n});\n\n// Хорошо — вынести в Worker Thread\nconst { Worker } = require("worker_threads");\napp.get("/sort", (req, res) => {\n  const worker = new Worker("./sort-worker.js");\n  worker.postMessage(millionItems);\n  worker.on("message", sorted => res.json(sorted));\n});\n\n// 2. Параллельные async операции\n// Плохо — последовательно (медленно)\nconst user = await getUser(id);\nconst posts = await getPosts(id);\nconst friends = await getFriends(id);\n\n// Хорошо — параллельно\nconst [user, posts, friends] = await Promise.all([\n  getUser(id),\n  getPosts(id),\n  getFriends(id)\n]);\n\n// 3. Кэширование с Redis\nconst redis = require("redis");\nconst client = redis.createClient();\n\nasync function getCachedUser(id) {\n  const cached = await client.get(`user:${id}`);\n  if (cached) return JSON.parse(cached);\n\n  const user = await User.findById(id);\n  await client.setex(`user:${id}`, 300, JSON.stringify(user)); // 5 минут\n  return user;\n}\n\n// 4. Кластеризация — использовать все ядра CPU\nconst cluster = require("cluster");\nconst numCPUs = require("os").cpus().length;\n\nif (cluster.isMaster) {\n  for (let i = 0; i < numCPUs; i++) cluster.fork();\n} else {\n  require("./server");\n}' }
      ]
    },
    {
      id: 4,
      title: 'Типичные антипаттерны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Антипаттерны — распространённые плохие решения. Callback hell, promise hell, God object, магические числа, изменение прототипов встроенных объектов.' },
        { type: 'heading', value: 'Что не делать' },
        { type: 'code', language: 'javascript', value: '// 1. Callback Hell — используйте async/await\n// Плохо\ngetUser(id, (user) => {\n  getPosts(user.id, (posts) => {\n    getComments(posts[0].id, (comments) => {\n      // Ещё глубже...\n    });\n  });\n});\n\n// Хорошо\nconst user = await getUser(id);\nconst posts = await getPosts(user.id);\nconst comments = await getComments(posts[0].id);\n\n// 2. Изменение прототипов нативных объектов\n// НИКОГДА не делайте это!\nArray.prototype.sum = function() { return this.reduce((a, b) => a + b, 0); };\nString.prototype.capitalize = function() { return this[0].toUpperCase() + this.slice(1); };\n// Создайте утилиту:\nconst sum = (arr) => arr.reduce((a, b) => a + b, 0);\nconst capitalize = (str) => str[0].toUpperCase() + str.slice(1);\n\n// 3. Магические числа/строки\n// Плохо\nif (user.role === 2) { ... }          // Что такое 2?\nsetTimeout(retry, 5000);              // Почему 5000?\nif (items.length > 100) paginate();   // Откуда 100?\n\n// Хорошо\nconst ROLE_ADMIN = 2;\nconst RETRY_DELAY_MS = 5000;\nconst PAGE_SIZE = 100;\nif (user.role === ROLE_ADMIN) { ... }\nsetTimeout(retry, RETRY_DELAY_MS);\nif (items.length > PAGE_SIZE) paginate();\n\n// 4. God Object — один объект знает/делает всё\n// Плохо\nclass App {\n  // 50 методов: работа с БД, email, auth, файлами...\n}\n\n// Хорошо — разделение ответственностей (SRP)\nclass UserService { }\nclass EmailService { }\nclass AuthService { }\nclass FileUploadService { }' }
      ]
    },
    {
      id: 5,
      title: 'Структура проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошая структура проекта — это предсказуемость. Разработчик должен сразу знать где найти любой файл. Feature-based структура лучше чем type-based для больших проектов.' },
        { type: 'heading', value: 'Архитектура Express проекта' },
        { type: 'code', language: 'javascript', value: '// Type-based (плохо для больших проектов)\n// src/\n//   controllers/ (все контроллеры вместе)\n//   models/      (все модели вместе)\n//   routes/      (все роуты вместе)\n//   services/    (все сервисы вместе)\n\n// Feature-based (лучше)\n// src/\n//   features/\n//     users/\n//       user.controller.js\n//       user.service.js\n//       user.model.js\n//       user.router.js\n//       user.validator.js\n//       user.test.js\n//     products/\n//       product.controller.js\n//       ...\n//   shared/\n//     middleware/\n//     utils/\n//     config/\n//   app.js\n//   index.js\n\n// Слоистая архитектура\n// Controller -> Service -> Repository -> Database\n\n// controller — HTTP слой (req/res)\nconst userController = {\n  getUser: async (req, res, next) => {\n    try {\n      const user = await userService.findById(req.params.id);\n      res.json({ success: true, data: user });\n    } catch (err) { next(err); }\n  }\n};\n\n// service — бизнес-логика\nconst userService = {\n  findById: async (id) => {\n    const user = await userRepository.findById(id);\n    if (!user) throw new NotFoundError("Пользователь");\n    return user;\n  }\n};\n\n// repository — доступ к данным\nconst userRepository = {\n  findById: (id) => User.findById(id),\n  create: (data) => User.create(data)\n};\n\n// Плюсы: легко тестировать каждый слой отдельно\n// Можно заменить MongoDB на PostgreSQL, не меняя контроллер' }
      ]
    },
    {
      id: 6,
      title: 'Code Review чеклист',
      type: 'theory',
      content: [
        { type: 'text', value: 'Код ревью — важная практика для поддержания качества. Проверяйте не только ошибки, но и читаемость, тестируемость, безопасность и производительность.' },
        { type: 'heading', value: 'Чеклист ревью' },
        { type: 'code', language: 'javascript', value: '// === ЧЕКЛИСТ CODE REVIEW ===\n\n// КОРРЕКТНОСТЬ\n// [ ] Код делает то, что должен?\n// [ ] Граничные случаи обработаны?\n// [ ] Ошибки корректно обрабатываются?\n// [ ] Нет утечек памяти?\n\n// ЧИТАЕМОСТЬ\n// [ ] Имена переменных/функций понятны?\n// [ ] Комментарии объясняют "почему", не "что"?\n// [ ] Функции делают одну вещь?\n// [ ] Нет дублирования?\n\n// БЕЗОПАСНОСТЬ\n// [ ] Входные данные валидируются?\n// [ ] Нет SQL/NoSQL инъекций?\n// [ ] Авторизация проверяется?\n// [ ] Секреты не в коде?\n\n// ПРОИЗВОДИТЕЛЬНОСТЬ\n// [ ] Нет N+1 запросов к БД?\n// [ ] Используется ли кэширование где нужно?\n// [ ] Асинхронные операции параллельны где возможно?\n\n// N+1 проблема — типичная ошибка\n// Плохо: N запросов для N постов\nconst posts = await Post.find();\nfor (const post of posts) {\n  post.author = await User.findById(post.authorId); // N запросов!\n}\n\n// Хорошо: один запрос с populate\nconst posts = await Post.find().populate("author");\n\n// ТЕСТИРУЕМОСТЬ\n// [ ] Есть тесты для новой функциональности?\n// [ ] Существующие тесты проходят?\n// [ ] Функции не слишком зависимы для тестирования?\n\n// ДРУГОЕ\n// [ ] Нет console.log в production коде?\n// [ ] Нет TODO которые должны быть сделаны сейчас?\n// [ ] Документация обновлена?\n// [ ] Добавлены в .gitignore новые секреты?' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Аудит кода',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проведите аудит предоставленного кода: найдите проблемы безопасности, антипаттерны, нарушения clean code и исправьте их.',
      requirements: [
        'Найдите и исправьте проблемы безопасности: открытые пароли, инъекции',
        'Рефакторинг: устраните callback hell, добавьте async/await',
        'Исправьте именование всех переменных',
        'Добавьте валидацию входных данных',
        'Устраните дублирование кода',
        'Добавьте обработку ошибок'
      ],
      hint: 'Ищите: SQL/NoSQL инъекции (конкатенация запросов), XSS (вставка данных без экранирования), открытые sensitive данные в ответах, отсутствие валидации входных данных, жёстко заданные пароли в коде.',
      expectedOutput: 'Найдено 6 проблем безопасности:\n1. SQL инъекция в строке 12\n2. XSS уязвимость в строке 34\n3. Пароль захардкожен в строке 8\n4. Нет валидации входных данных\n5. Sensitive данные в ответе API\n6. eval() с пользовательскими данными',
      solution: '// ДО — проблемный код\nconst express = require("express");\nconst mongoose = require("mongoose");\nconst app = express();\napp.use(express.json());\n\n// ПЛОХО: пароль в коде\nmongoose.connect("mongodb://admin:password123@localhost/db");\n\napp.post("/login", (req, res) => {\n  // ПЛОХО: нет валидации, callback hell, NoSQL инъекция\n  mongoose.connection.db.collection("users").findOne({ email: req.body.e, password: req.body.p }, (err, u) => {\n    if (err) {\n      res.send("err");\n    } else {\n      if (u) {\n        res.send(u); // ПЛОХО: отправляем весь документ с паролем!\n      } else {\n        res.send("no user");\n      }\n    }\n  });\n});\n\n// ПОСЛЕ — исправленный код\nmongoose.connect(process.env.MONGODB_URI); // Из .env\n\napp.post("/auth/login", async (req, res, next) => {\n  try {\n    const { email, password } = req.body;\n    if (!email || !password)\n      return res.status(400).json({ error: "Email и пароль обязательны" });\n\n    const user = await User.findOne({ email: email.toLowerCase() });\n    if (!user || !(await bcrypt.compare(password, user.passwordHash)))\n      return res.status(401).json({ error: "Неверные данные" });\n\n    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });\n    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });\n  } catch (err) {\n    next(err);\n  }\n});\n\n// Глобальный обработчик\napp.use((err, req, res, next) => {\n  console.error(err);\n  res.status(500).json({ error: "Ошибка сервера" });\n});',
      explanation: 'Пароль БД в коде — критическая уязвимость: он попадёт в git и станет публичным. Решение: process.env.MONGODB_URI из .env файла. req.body.p для пароля — NoSQL инъекция: { "$gt": "" } пройдёт как пароль. Решение: bcrypt.compare против хэша. Callback hell заменён на async/await с try/catch. res.send(u) отправляет весь документ включая passwordHash — нельзя. Решение: явно выбирать поля { id, email, name }. email.toLowerCase() нормализует перед поиском. Единое сообщение "Неверные данные" не раскрывает существует ли email.'
    }
  ]
};
