export default {
  id: 38,
  title: 'Express REST API',
  description: 'Построение RESTful API: CRUD операции, параметры и query, HTTP статус коды, валидация, пагинация и версионирование',
  lessons: [
    {
      id: 1,
      title: 'Принципы REST',
      type: 'theory',
      content: [
        { type: 'text', value: 'REST (Representational State Transfer) — архитектурный стиль для API. Ключевые принципы: единый интерфейс, отсутствие состояния, ресурсо-ориентированность, стандартные HTTP методы.' },
        { type: 'heading', value: 'RESTful соглашения' },
        { type: 'code', language: 'javascript', value: '// RESTful соглашения для ресурса "users"\n//\n// GET    /users         — список всех пользователей\n// GET    /users/:id     — конкретный пользователь\n// POST   /users         — создать пользователя\n// PUT    /users/:id     — полностью заменить пользователя\n// PATCH  /users/:id     — частично обновить пользователя\n// DELETE /users/:id     — удалить пользователя\n//\n// Вложенные ресурсы:\n// GET    /users/:id/posts        — посты конкретного пользователя\n// POST   /users/:id/posts        — создать пост для пользователя\n// GET    /users/:id/posts/:postId — конкретный пост пользователя\n\nconst express = require("express");\nconst router = express.Router();\n\n// Коллекция\nrouter.get("/", getAllUsers);\nrouter.post("/", createUser);\n\n// Один элемент\nrouter.get("/:id", getUser);\nrouter.put("/:id", replaceUser);\nrouter.patch("/:id", updateUser);\nrouter.delete("/:id", deleteUser);\n\n// Вложенный ресурс\nrouter.get("/:id/posts", getUserPosts);\n\nmodule.exports = router;' },
        { type: 'tip', value: 'Используйте существительные (не глаголы) для URL: /users (не /getUsers), /posts (не /createPost). Действие определяет HTTP метод.' }
      ]
    },
    {
      id: 2,
      title: 'CRUD — полная реализация',
      type: 'theory',
      content: [
        { type: 'text', value: 'CRUD (Create, Read, Update, Delete) — четыре базовые операции над данными. Каждой операции соответствует HTTP метод: POST, GET, PUT/PATCH, DELETE.' },
        { type: 'heading', value: 'Полный CRUD для продуктов' },
        { type: 'code', language: 'javascript', value: 'const express = require("express");\nconst router = express.Router();\n\nlet products = [\n  { id: 1, name: "Ноутбук", price: 150000, category: "электроника" },\n  { id: 2, name: "Мышка", price: 3000, category: "электроника" }\n];\nlet nextId = 3;\n\n// READ ALL\nrouter.get("/", (req, res) => {\n  res.json({ success: true, count: products.length, data: products });\n});\n\n// READ ONE\nrouter.get("/:id", (req, res) => {\n  const product = products.find(p => p.id === +req.params.id);\n  if (!product) return res.status(404).json({ success: false, error: "Продукт не найден" });\n  res.json({ success: true, data: product });\n});\n\n// CREATE\nrouter.post("/", (req, res) => {\n  const { name, price, category } = req.body;\n  if (!name || !price) return res.status(400).json({ error: "name и price обязательны" });\n  const product = { id: nextId++, name, price: Number(price), category: category || "other" };\n  products.push(product);\n  res.status(201).json({ success: true, data: product });\n});\n\n// REPLACE (PUT — полная замена)\nrouter.put("/:id", (req, res) => {\n  const idx = products.findIndex(p => p.id === +req.params.id);\n  if (idx === -1) return res.status(404).json({ error: "Не найдено" });\n  const { name, price, category } = req.body;\n  if (!name || !price) return res.status(400).json({ error: "Требуются все поля" });\n  products[idx] = { id: +req.params.id, name, price, category };\n  res.json({ success: true, data: products[idx] });\n});\n\n// UPDATE (PATCH — частичное обновление)\nrouter.patch("/:id", (req, res) => {\n  const idx = products.findIndex(p => p.id === +req.params.id);\n  if (idx === -1) return res.status(404).json({ error: "Не найдено" });\n  products[idx] = { ...products[idx], ...req.body };\n  res.json({ success: true, data: products[idx] });\n});\n\n// DELETE\nrouter.delete("/:id", (req, res) => {\n  const idx = products.findIndex(p => p.id === +req.params.id);\n  if (idx === -1) return res.status(404).json({ error: "Не найдено" });\n  const deleted = products.splice(idx, 1)[0];\n  res.json({ success: true, data: deleted });\n});\n\nmodule.exports = router;' }
      ]
    },
    {
      id: 3,
      title: 'Параметры пути и query',
      type: 'theory',
      content: [
        { type: 'text', value: 'req.params — обязательные части пути (:id). req.query — опциональные параметры (?sort=name&order=asc). Правильное использование делает API интуитивным.' },
        { type: 'heading', value: 'Фильтрация, сортировка, поиск' },
        { type: 'code', language: 'javascript', value: 'router.get("/", (req, res) => {\n  let result = [...products];\n\n  // Фильтрация: GET /products?category=электроника\n  const { category, minPrice, maxPrice, search } = req.query;\n  if (category) result = result.filter(p => p.category === category);\n  if (minPrice) result = result.filter(p => p.price >= +minPrice);\n  if (maxPrice) result = result.filter(p => p.price <= +maxPrice);\n  if (search) result = result.filter(p =>\n    p.name.toLowerCase().includes(search.toLowerCase())\n  );\n\n  // Сортировка: GET /products?sort=price&order=desc\n  const { sort = "id", order = "asc" } = req.query;\n  result.sort((a, b) => {\n    const aVal = a[sort]; const bVal = b[sort];\n    if (typeof aVal === "string") {\n      return order === "asc"\n        ? aVal.localeCompare(bVal)\n        : bVal.localeCompare(aVal);\n    }\n    return order === "asc" ? aVal - bVal : bVal - aVal;\n  });\n\n  // Пагинация: GET /products?page=2&limit=10\n  const page = parseInt(req.query.page) || 1;\n  const limit = parseInt(req.query.limit) || 10;\n  const start = (page - 1) * limit;\n  const paginated = result.slice(start, start + limit);\n\n  res.json({\n    success: true,\n    total: result.length,\n    page,\n    totalPages: Math.ceil(result.length / limit),\n    data: paginated\n  });\n});' },
        { type: 'tip', value: 'Всегда приводите типы: parseInt() для чисел, toLowerCase() для строк. req.query возвращает всё как строки.' }
      ]
    },
    {
      id: 4,
      title: 'HTTP статус коды',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильные HTTP коды — признак хорошего API. 2xx — успех, 3xx — перенаправление, 4xx — ошибка клиента, 5xx — ошибка сервера.' },
        { type: 'heading', value: 'Основные коды ответа' },
        { type: 'code', language: 'javascript', value: 'const express = require("express");\nconst app = express();\napp.use(express.json());\n\n// 200 OK — успешный GET, PUT, PATCH\napp.get("/users", (req, res) => {\n  res.status(200).json({ data: [] }); // 200 — по умолчанию\n});\n\n// 201 Created — успешный POST (ресурс создан)\napp.post("/users", (req, res) => {\n  const user = { id: 1, ...req.body };\n  res\n    .status(201)\n    .location(`/users/${user.id}`) // Заголовок Location\n    .json(user);\n});\n\n// 204 No Content — успешный DELETE (без тела)\napp.delete("/users/:id", (req, res) => {\n  // Удаляем...\n  res.status(204).end(); // Нет тела ответа\n});\n\n// 400 Bad Request — ошибка валидации\napp.post("/login", (req, res) => {\n  if (!req.body.email) return res.status(400).json({ error: "Email обязателен" });\n});\n\n// 401 Unauthorized — не авторизован\n// 403 Forbidden — авторизован, но нет прав\n// 404 Not Found — ресурс не найден\n// 409 Conflict — конфликт (дубликат email)\n// 422 Unprocessable Entity — ошибка валидации\n// 429 Too Many Requests — превышен лимит\n// 500 Internal Server Error — ошибка сервера\n\n// Хелпер\nconst STATUS = {\n  OK: 200, CREATED: 201, NO_CONTENT: 204,\n  BAD_REQUEST: 400, UNAUTHORIZED: 401,\n  FORBIDDEN: 403, NOT_FOUND: 404, CONFLICT: 409,\n  SERVER_ERROR: 500\n};' }
      ]
    },
    {
      id: 5,
      title: 'Валидация запросов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Валидация входных данных критически важна для безопасности и надёжности. Можно делать вручную или использовать библиотеки: Joi, express-validator, Zod.' },
        { type: 'heading', value: 'Валидация с Joi' },
        { type: 'code', language: 'javascript', value: '// npm install joi\nconst Joi = require("joi");\nconst express = require("express");\nconst router = express.Router();\n\n// Схемы валидации\nconst userSchema = Joi.object({\n  name: Joi.string().min(2).max(50).required(),\n  email: Joi.string().email().required(),\n  age: Joi.number().integer().min(18).max(120).required(),\n  role: Joi.string().valid("user", "admin").default("user")\n});\n\nconst updateSchema = Joi.object({\n  name: Joi.string().min(2).max(50),\n  email: Joi.string().email(),\n  age: Joi.number().integer().min(18)\n}).min(1); // Минимум одно поле\n\n// Middleware валидации\nconst validate = (schema) => (req, res, next) => {\n  const { error, value } = schema.validate(req.body, { abortEarly: false });\n  if (error) {\n    const errors = error.details.map(d => ({\n      field: d.path.join("."),\n      message: d.message\n    }));\n    return res.status(400).json({ success: false, errors });\n  }\n  req.body = value; // Используем очищенные данные\n  next();\n};\n\nrouter.post("/users", validate(userSchema), (req, res) => {\n  res.status(201).json({ success: true, data: req.body });\n});\n\nrouter.patch("/users/:id", validate(updateSchema), (req, res) => {\n  res.json({ success: true, data: req.body });\n});' }
      ]
    },
    {
      id: 6,
      title: 'Версионирование API',
      type: 'theory',
      content: [
        { type: 'text', value: 'Версионирование API позволяет обновлять API без поломки клиентов. Основные способы: URL (/api/v1/), заголовок (Accept: application/vnd.api.v2+json), query параметр (?version=2).' },
        { type: 'heading', value: 'Версионирование через URL' },
        { type: 'code', language: 'javascript', value: 'const express = require("express");\nconst app = express();\napp.use(express.json());\n\n// Версия 1 роутера\nconst v1Router = express.Router();\nv1Router.get("/users", (req, res) => {\n  res.json([{ id: 1, name: "Алия Иванова" }]);\n});\n\n// Версия 2 — другой формат ответа\nconst v2Router = express.Router();\nv2Router.get("/users", (req, res) => {\n  res.json({\n    data: [{ id: 1, firstName: "Алия", lastName: "Иванова" }],\n    meta: { version: 2 }\n  });\n});\n\napp.use("/api/v1", v1Router);\napp.use("/api/v2", v2Router);\n\n// Middleware для определения версии из заголовка\nconst detectVersion = (req, res, next) => {\n  const accept = req.headers["accept"] || "";\n  const match = accept.match(/vnd\\.api\\.v(\\d+)\\+json/);\n  req.apiVersion = match ? parseInt(match[1]) : 1;\n  next();\n};\n\napp.use(detectVersion);\napp.get("/api/users", (req, res) => {\n  if (req.apiVersion === 2) {\n    return res.json({ data: [], meta: { v: 2 } });\n  }\n  res.json([]);\n});\n\napp.listen(3000);' }
      ]
    },
    {
      id: 7,
      title: 'Структура ответа API',
      type: 'theory',
      content: [
        { type: 'text', value: 'Единообразная структура ответов упрощает работу клиентов. Хорошая практика: всегда включать success, data/error поля и единый формат для коллекций и отдельных объектов.' },
        { type: 'heading', value: 'Стандартизированные ответы' },
        { type: 'code', language: 'javascript', value: '// Хелперы для форматирования ответов\nconst ApiResponse = {\n  success: (res, data, status = 200, meta = {}) => {\n    return res.status(status).json({ success: true, data, ...meta });\n  },\n  created: (res, data) => {\n    return res.status(201).json({ success: true, data });\n  },\n  noContent: (res) => {\n    return res.status(204).end();\n  },\n  error: (res, message, status = 400, errors = null) => {\n    const body = { success: false, error: message };\n    if (errors) body.errors = errors;\n    return res.status(status).json(body);\n  },\n  notFound: (res, resource = "Ресурс") => {\n    return res.status(404).json({ success: false, error: `${resource} не найден` });\n  },\n  paginated: (res, data, page, limit, total) => {\n    return res.json({\n      success: true,\n      data,\n      pagination: {\n        page, limit, total,\n        totalPages: Math.ceil(total / limit),\n        hasNext: page * limit < total,\n        hasPrev: page > 1\n      }\n    });\n  }\n};\n\n// Использование\napp.get("/products", (req, res) => {\n  const products = getProducts();\n  ApiResponse.paginated(res, products, 1, 10, 100);\n});\n\napp.get("/products/:id", (req, res) => {\n  const product = findProduct(req.params.id);\n  if (!product) return ApiResponse.notFound(res, "Продукт");\n  ApiResponse.success(res, product);\n});' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Полный REST API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте полноценный REST API для блога со статьями и комментариями. Включите фильтрацию, пагинацию и правильные статус коды.',
      requirements: [
        'Ресурс /api/v1/articles: CRUD с полями title, body, tags[], author',
        'GET /articles поддерживает: ?search=, ?tag=, ?author=, ?page=, ?limit=, ?sort=, ?order=',
        'Вложенный ресурс /articles/:id/comments: GET и POST',
        'Валидация через Joi или вручную: обязательные поля, типы',
        'Правильные HTTP коды: 201 для создания, 204 для удаления, 404/400/409',
        'Единообразная структура ответов: { success, data, pagination }',
        'Хранение в памяти (массивы)',
        'Версионирование: /api/v1 prefix'
      ],
      hint: 'Для пагинации используйте query параметры: page=1&limit=10 -> skip=(page-1)*limit. Фильтрацию реализуйте через Array.filter перед пагинацией. Статус 201 для POST, 204 для DELETE.',
      expectedOutput: 'GET /articles?page=1&limit=2 -> { data: [...], total: 10, page: 1, totalPages: 5 }\nGET /articles?author=Алия -> отфильтрованные статьи\nPOST /articles -> 201 { id: "uuid", title: "...", ... }\nGET /articles/id/comments -> комментарии статьи',
      solution: 'const express = require("express");\nconst app = express();\napp.use(express.json());\n\nlet articles = [\n  { id: 1, title: "Express основы", body: "Текст...", tags: ["node"], author: "Алия", comments: [] },\n];\nlet nextId = 2;\n\nconst router = express.Router();\n\nrouter.get("/articles", (req, res) => {\n  let result = [...articles];\n  const { search, tag, author, page = 1, limit = 10, sort = "id", order = "asc" } = req.query;\n  if (search) result = result.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));\n  if (tag) result = result.filter(a => a.tags.includes(tag));\n  if (author) result = result.filter(a => a.author === author);\n  result.sort((a, b) => order === "asc" ? (a[sort] > b[sort] ? 1 : -1) : (a[sort] < b[sort] ? 1 : -1));\n  const total = result.length;\n  const data = result.slice((+page - 1) * +limit, +page * +limit);\n  res.json({ success: true, data, pagination: { page: +page, limit: +limit, total, totalPages: Math.ceil(total / +limit) } });\n});\n\nrouter.get("/articles/:id", (req, res) => {\n  const article = articles.find(a => a.id === +req.params.id);\n  if (!article) return res.status(404).json({ success: false, error: "Не найдено" });\n  res.json({ success: true, data: article });\n});\n\nrouter.post("/articles", (req, res) => {\n  const { title, body, author, tags = [] } = req.body;\n  if (!title || !body || !author) return res.status(400).json({ error: "title, body, author обязательны" });\n  const article = { id: nextId++, title, body, author, tags, comments: [] };\n  articles.push(article);\n  res.status(201).json({ success: true, data: article });\n});\n\nrouter.put("/articles/:id", (req, res) => {\n  const idx = articles.findIndex(a => a.id === +req.params.id);\n  if (idx === -1) return res.status(404).json({ error: "Не найдено" });\n  articles[idx] = { ...articles[idx], ...req.body };\n  res.json({ success: true, data: articles[idx] });\n});\n\nrouter.delete("/articles/:id", (req, res) => {\n  const idx = articles.findIndex(a => a.id === +req.params.id);\n  if (idx === -1) return res.status(404).json({ error: "Не найдено" });\n  articles.splice(idx, 1);\n  res.status(204).end();\n});\n\nrouter.get("/articles/:id/comments", (req, res) => {\n  const article = articles.find(a => a.id === +req.params.id);\n  if (!article) return res.status(404).json({ error: "Не найдено" });\n  res.json({ success: true, data: article.comments });\n});\n\nrouter.post("/articles/:id/comments", (req, res) => {\n  const article = articles.find(a => a.id === +req.params.id);\n  if (!article) return res.status(404).json({ error: "Не найдено" });\n  const { text, author } = req.body;\n  if (!text || !author) return res.status(400).json({ error: "text и author обязательны" });\n  const comment = { id: Date.now(), text, author };\n  article.comments.push(comment);\n  res.status(201).json({ success: true, data: comment });\n});\n\napp.use("/api/v1", router);\napp.listen(3000, () => console.log("API готов"));',
      explanation: 'Фильтрация применяется последовательно: сначала search по заголовку, затем tag через includes, затем author. Сортировка универсальная — сравнивает поля динамически через bracket notation. Пагинация: slice((page-1)*limit, page*limit) вырезает нужную страницу. Вложенный ресурс /articles/:id/comments хранится прямо в массиве статьи. Код 204 возвращается без тела — end() вместо json(). Версионирование через app.use("/api/v1", router) позволяет в будущем добавить v2 без изменений.'
    }
  ]
};
