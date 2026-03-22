export default {
  id: 36,
  title: 'Express — основы',
  description: 'Создание сервера с Express: маршруты app.get/post, Router, middleware, обработка JSON и статических файлов',
  lessons: [
    {
      id: 1,
      title: 'Создание сервера Express',
      type: 'theory',
      content: [
        { type: 'text', value: 'Express — минималистичный веб-фреймворк для Node.js. Устанавливается через npm, создаёт HTTP-сервер с удобным API для маршрутов и middleware.' },
        { type: 'heading', value: 'Базовый сервер' },
        { type: 'code', language: 'javascript', value: 'const express = require("express");\nconst app = express();\nconst PORT = 3000;\n\n// Простой маршрут\napp.get("/", (req, res) => {\n  res.send("Hello, World!");\n});\n\n// Запуск сервера\napp.listen(PORT, () => {\n  console.log(`Сервер запущен на порту ${PORT}`);\n});\n\n// npm install express\n// node index.js — запуск\n// nodemon index.js — с авторестартом' },
        { type: 'tip', value: 'Установите nodemon глобально: npm install -g nodemon. Он автоматически перезапускает сервер при изменении файлов в режиме разработки.' }
      ]
    },
    {
      id: 2,
      title: 'Маршруты GET и POST',
      type: 'theory',
      content: [
        { type: 'text', value: 'app.get() обрабатывает GET-запросы (чтение данных), app.post() — POST-запросы (отправка данных). Каждый маршрут принимает путь и callback с req/res.' },
        { type: 'heading', value: 'Основные HTTP методы' },
        { type: 'code', language: 'javascript', value: 'const express = require("express");\nconst app = express();\n\n// Парсинг JSON тела запроса\napp.use(express.json());\n\n// GET — получение данных\napp.get("/users", (req, res) => {\n  res.json([{ id: 1, name: "Алия" }, { id: 2, name: "Берик" }]);\n});\n\n// POST — создание данных\napp.post("/users", (req, res) => {\n  const { name, email } = req.body; // Данные из тела запроса\n  const newUser = { id: Date.now(), name, email };\n  res.status(201).json(newUser); // 201 Created\n});\n\n// PUT — полное обновление\napp.put("/users/:id", (req, res) => {\n  const { id } = req.params;\n  const updated = { id: Number(id), ...req.body };\n  res.json(updated);\n});\n\n// DELETE — удаление\napp.delete("/users/:id", (req, res) => {\n  const { id } = req.params;\n  res.json({ message: `Пользователь ${id} удалён` });\n});\n\napp.listen(3000);' },
        { type: 'tip', value: 'app.use(express.json()) обязателен для парсинга JSON тела запросов. Без него req.body будет undefined.' }
      ]
    },
    {
      id: 3,
      title: 'Параметры маршрутов и query',
      type: 'theory',
      content: [
        { type: 'text', value: 'req.params — динамические части пути (:id). req.query — параметры строки запроса (?key=value). req.body — тело запроса (JSON, form-data).' },
        { type: 'heading', value: 'Три способа передать данные' },
        { type: 'code', language: 'javascript', value: 'app.get("/products/:id", (req, res) => {\n  // URL: /products/42\n  console.log(req.params.id); // "42" (строка!)\n  const id = Number(req.params.id);\n  res.json({ id });\n});\n\n// Несколько параметров\napp.get("/users/:userId/posts/:postId", (req, res) => {\n  const { userId, postId } = req.params;\n  res.json({ userId, postId });\n});\n\n// Query параметры\napp.get("/search", (req, res) => {\n  // URL: /search?q=express&page=2&limit=10\n  const { q, page = 1, limit = 10 } = req.query;\n  console.log(q);     // "express"\n  console.log(page);  // "2" (тоже строка!)\n  res.json({ query: q, page: Number(page), limit: Number(limit) });\n});\n\n// req.body — с middleware express.json()\napp.post("/login", (req, res) => {\n  const { username, password } = req.body;\n  res.json({ username, authenticated: true });\n});' }
      ]
    },
    {
      id: 4,
      title: 'Express Router',
      type: 'theory',
      content: [
        { type: 'text', value: 'Router позволяет группировать маршруты в отдельные модули. Это делает код модульным: каждый ресурс (users, products) — в своём файле.' },
        { type: 'heading', value: 'Модульные маршруты с Router' },
        { type: 'code', language: 'javascript', value: '// routes/users.js\nconst express = require("express");\nconst router = express.Router();\n\n// Все маршруты относительно /users\nrouter.get("/", (req, res) => {\n  res.json([{ id: 1, name: "Алия" }]);\n});\n\nrouter.get("/:id", (req, res) => {\n  res.json({ id: req.params.id, name: "Алия" });\n});\n\nrouter.post("/", (req, res) => {\n  res.status(201).json({ ...req.body, id: Date.now() });\n});\n\nrouter.put("/:id", (req, res) => {\n  res.json({ id: req.params.id, ...req.body });\n});\n\nrouter.delete("/:id", (req, res) => {\n  res.json({ message: "Удалено" });\n});\n\nmodule.exports = router;\n\n// app.js — подключение роутера\nconst express = require("express");\nconst usersRouter = require("./routes/users");\nconst productsRouter = require("./routes/products");\n\nconst app = express();\napp.use(express.json());\n\napp.use("/users", usersRouter);     // /users, /users/:id\napp.use("/products", productsRouter); // /products, /products/:id\n\napp.listen(3000);' },
        { type: 'tip', value: 'Router.route() позволяет объединить методы одного пути: router.route("/").get(getAll).post(create). Это уменьшает повторение путей.' }
      ]
    },
    {
      id: 5,
      title: 'Отправка ответов',
      type: 'theory',
      content: [
        { type: 'text', value: 'res имеет методы для разных типов ответов: res.json(), res.send(), res.status(), res.redirect(), res.sendFile(). Всегда отправляйте один ответ!' },
        { type: 'heading', value: 'Методы ответа' },
        { type: 'code', language: 'javascript', value: 'app.get("/demo", (req, res) => {\n  // JSON ответ (автоматически ставит Content-Type: application/json)\n  res.json({ success: true, data: [] });\n\n  // res.send() — для строк, Buffer, HTML\n  // res.send("<h1>Hello</h1>");\n\n  // Статус + json\n  // res.status(201).json({ created: true });\n  // res.status(400).json({ error: "Плохой запрос" });\n  // res.status(404).json({ error: "Не найдено" });\n  // res.status(500).json({ error: "Ошибка сервера" });\n\n  // Редирект\n  // res.redirect("/login");\n  // res.redirect(301, "/new-url"); // постоянный\n\n  // Отправка файла\n  // res.sendFile("/absolute/path/to/file.html");\n\n  // Установка заголовков\n  // res.set("X-Custom-Header", "value");\n  // res.set({ "Content-Type": "text/plain", "X-Another": "header" });\n});\n\n// Паттерн ответа для API\nconst sendSuccess = (res, data, status = 200) =>\n  res.status(status).json({ success: true, data });\n\nconst sendError = (res, message, status = 400) =>\n  res.status(status).json({ success: false, error: message });' }
      ]
    },
    {
      id: 6,
      title: 'Статические файлы и шаблоны',
      type: 'theory',
      content: [
        { type: 'text', value: 'express.static() раздаёт статические файлы (HTML, CSS, JS, картинки). Для динамических страниц используют шаблонизаторы (EJS, Pug, Handlebars).' },
        { type: 'heading', value: 'Статика и шаблонизация' },
        { type: 'code', language: 'javascript', value: 'const path = require("path");\nconst express = require("express");\nconst app = express();\n\n// Раздаём папку public как статику\n// Файлы: public/index.html, public/css/style.css, public/js/app.js\napp.use(express.static("public"));\n\n// Или с префиксом URL\napp.use("/static", express.static("public"));\n// Доступ: /static/index.html\n\n// Абсолютный путь (надёжнее)\napp.use(express.static(path.join(__dirname, "public")));\n\n// Шаблонизатор EJS (npm install ejs)\napp.set("view engine", "ejs");\napp.set("views", path.join(__dirname, "views"));\n\napp.get("/profile/:name", (req, res) => {\n  // Рендерит views/profile.ejs\n  res.render("profile", {\n    username: req.params.name,\n    items: ["React", "Node", "Express"]\n  });\n});\n\n// views/profile.ejs:\n// <h1>Привет, <%= username %>!</h1>\n// <% items.forEach(item => { %>\n//   <li><%= item %></li>\n// <% }); %>' }
      ]
    },
    {
      id: 7,
      title: 'Обработка ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Express обрабатывает ошибки через специальный middleware с четырьмя параметрами: (err, req, res, next). Вызов next(err) передаёт ошибку в этот обработчик.' },
        { type: 'heading', value: 'Централизованная обработка ошибок' },
        { type: 'code', language: 'javascript', value: 'const express = require("express");\nconst app = express();\napp.use(express.json());\n\n// Синхронные ошибки Express ловит автоматически\napp.get("/sync-error", (req, res) => {\n  throw new Error("Синхронная ошибка");\n});\n\n// Для async нужен try/catch + next\napp.get("/async-error", async (req, res, next) => {\n  try {\n    const data = await someAsyncOperation();\n    res.json(data);\n  } catch (err) {\n    next(err); // Передаём ошибку в error middleware\n  }\n});\n\n// 404 — маршрут не найден\napp.use((req, res, next) => {\n  res.status(404).json({ error: "Маршрут не найден" });\n});\n\n// Глобальный обработчик ошибок (4 параметра!)\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  const status = err.status || 500;\n  res.status(status).json({\n    error: err.message || "Внутренняя ошибка сервера"\n  });\n});\n\n// Кастомный класс ошибки\nclass AppError extends Error {\n  constructor(message, status) {\n    super(message);\n    this.status = status;\n  }\n}\n\napp.get("/not-found", (req, res, next) => {\n  next(new AppError("Ресурс не найден", 404));\n});\n\napp.listen(3000);' },
        { type: 'tip', value: 'Ставьте error middleware последним, после всех маршрутов. 404 middleware — предпоследним (перед error).' }
      ]
    },
    {
      id: 8,
      title: 'Практика: REST сервер для задач',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Express сервер с CRUD API для управления задачами (todo list). Используйте Router и хранение в памяти.',
      requirements: [
        'GET /tasks — список всех задач',
        'GET /tasks/:id — одна задача (404 если не найдена)',
        'POST /tasks — создать задачу { title, completed: false }',
        'PUT /tasks/:id — обновить задачу',
        'DELETE /tasks/:id — удалить задачу',
        'Вынесите маршруты в отдельный Router (routes/tasks.js)',
        'Добавьте middleware для логирования запросов',
        'Обработка ошибок: 400 для пустого title, 404 для несуществующих id'
      ],
      solution: {
        code: '// routes/tasks.js\nconst express = require("express");\nconst router = express.Router();\n\nlet tasks = [\n  { id: 1, title: "Изучить Express", completed: false },\n  { id: 2, title: "Написать API", completed: true }\n];\nlet nextId = 3;\n\nrouter.get("/", (req, res) => {\n  res.json(tasks);\n});\n\nrouter.get("/:id", (req, res) => {\n  const task = tasks.find(t => t.id === Number(req.params.id));\n  if (!task) return res.status(404).json({ error: "Задача не найдена" });\n  res.json(task);\n});\n\nrouter.post("/", (req, res) => {\n  const { title } = req.body;\n  if (!title) return res.status(400).json({ error: "Title обязателен" });\n  const task = { id: nextId++, title, completed: false };\n  tasks.push(task);\n  res.status(201).json(task);\n});\n\nrouter.put("/:id", (req, res) => {\n  const idx = tasks.findIndex(t => t.id === Number(req.params.id));\n  if (idx === -1) return res.status(404).json({ error: "Задача не найдена" });\n  tasks[idx] = { ...tasks[idx], ...req.body };\n  res.json(tasks[idx]);\n});\n\nrouter.delete("/:id", (req, res) => {\n  const idx = tasks.findIndex(t => t.id === Number(req.params.id));\n  if (idx === -1) return res.status(404).json({ error: "Задача не найдена" });\n  tasks.splice(idx, 1);\n  res.json({ message: "Удалено" });\n});\n\nmodule.exports = router;\n\n// app.js\nconst express = require("express");\nconst tasksRouter = require("./routes/tasks");\nconst app = express();\n\napp.use(express.json());\napp.use((req, res, next) => {\n  console.log(`${req.method} ${req.path}`);\n  next();\n});\napp.use("/tasks", tasksRouter);\napp.use((req, res) => res.status(404).json({ error: "Не найдено" }));\napp.use((err, req, res, next) => res.status(500).json({ error: err.message }));\n\napp.listen(3000, () => console.log("Сервер на порту 3000"));',
        language: 'javascript'
      }
    }
  ]
};
