export default {
  id: 35,
  title: 'HTTP сервер',
  description: 'Создание HTTP сервера на Node.js: модуль http, обработка запросов/ответов, маршрутизация, чтение тела запроса, CORS, базовый REST API.',
  lessons: [
    {
      id: 1,
      title: 'Создание HTTP сервера',
      type: 'theory',
      content: [
        { type: 'text', value: 'Модуль http позволяет создать HTTP сервер без сторонних фреймворков. http.createServer() принимает callback (req, res) для каждого входящего запроса.' },
        { type: 'code', language: 'javascript', value: 'import http from "node:http";\n\nconst PORT = process.env.PORT || 3000;\n\nconst server = http.createServer((req, res) => {\n  // req: http.IncomingMessage — входящий запрос\n  // res: http.ServerResponse — исходящий ответ\n\n  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);\n\n  // Установка заголовков\n  res.setHeader("Content-Type", "application/json; charset=utf-8");\n  res.setHeader("X-Powered-By", "Node.js");\n\n  // Статус и тело ответа\n  res.statusCode = 200;\n  res.end(JSON.stringify({ message: "Привет!" }));\n});\n\n// Запуск сервера\nserver.listen(PORT, "0.0.0.0", () => {\n  console.log(`Сервер запущен: http://localhost:${PORT}`);\n  console.log(`PID: ${process.pid}`);\n});\n\n// Обработка ошибок\nserver.on("error", (err) => {\n  if (err.code === "EADDRINUSE") {\n    console.error(`Порт ${PORT} уже занят!`);\n    process.exit(1);\n  }\n  console.error("Ошибка сервера:", err);\n});\n\n// Graceful shutdown\nprocess.on("SIGTERM", () => {\n  console.log("Остановка сервера...");\n  server.close(() => process.exit(0));\n});' },
        { type: 'tip', value: 'res.end() всегда нужно вызвать — иначе соединение зависнет. res.write() + res.end() для потоковой отправки. Никогда не вызывай res.end() дважды — Node.js выбросит ошибку ERR_HTTP_HEADERS_SENT.' }
      ]
    },
    {
      id: 2,
      title: 'Объекты req и res',
      type: 'theory',
      content: [
        { type: 'text', value: 'req (IncomingMessage) содержит всё о запросе: метод, URL, заголовки, сокет. res (ServerResponse) — методы для формирования и отправки ответа.' },
        { type: 'code', language: 'javascript', value: 'import http from "node:http";\nimport { URL } from "node:url";\n\nhttp.createServer((req, res) => {\n  // === ЗАПРОС (req) ===\n  console.log(req.method);   // "GET", "POST", "PUT", "DELETE"\n  console.log(req.url);      // "/api/users?page=1&limit=10"\n  console.log(req.headers);  // { "content-type": "...", "authorization": "..." }\n  console.log(req.headers["user-agent"]);\n  console.log(req.headers["authorization"]);\n\n  // Разбор URL и query параметров\n  const url = new URL(req.url, `http://${req.headers.host}`);\n  console.log(url.pathname); // "/api/users"\n  console.log(url.searchParams.get("page"));  // "1"\n  console.log(url.searchParams.get("limit")); // "10"\n\n  // === ОТВЕТ (res) ===\n  // Методы установки заголовков:\n  res.setHeader("Content-Type", "application/json");\n  res.setHeader("Cache-Control", "no-cache");\n\n  // writeHead — статус + заголовки за один раз\n  res.writeHead(200, {\n    "Content-Type": "application/json",\n    "X-Request-Id": Math.random().toString(36).slice(2)\n  });\n\n  // Отправить данные\n  res.write(\'{"step": 1}\\n\'); // частичный ответ\n  res.write(\'{"step": 2}\\n\');\n  res.end(\'{"done": true}\'); // завершить\n\n}).listen(3000);' }
      ]
    },
    {
      id: 3,
      title: 'Чтение тела запроса',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тело POST/PUT запроса приходит порциями (chunked). Нужно накапливать chunks и собрать всё тело при событии "end". Для JSON обязательно обработать ошибку парсинга.' },
        { type: 'code', language: 'javascript', value: 'import http from "node:http";\n\n// Утилита для чтения тела запроса\nfunction readBody(req, maxSize = 1024 * 1024) {\n  return new Promise((resolve, reject) => {\n    const chunks = [];\n    let size = 0;\n\n    req.on("data", (chunk) => {\n      size += chunk.length;\n      if (size > maxSize) {\n        req.destroy();\n        reject(new Error("Тело запроса слишком большое"));\n        return;\n      }\n      chunks.push(chunk);\n    });\n\n    req.on("end",   () => resolve(Buffer.concat(chunks).toString("utf-8")));\n    req.on("error", reject);\n  });\n}\n\n// Утилита для JSON тела\nasync function readJSON(req) {\n  const body = await readBody(req);\n  try {\n    return JSON.parse(body);\n  } catch {\n    throw new Error("Невалидный JSON");\n  }\n}\n\nhttp.createServer(async (req, res) => {\n  if (req.method === "POST" && req.url === "/api/users") {\n    try {\n      const data = await readJSON(req);\n      console.log("Получено:", data);\n      res.writeHead(201, { "Content-Type": "application/json" });\n      res.end(JSON.stringify({ id: 1, ...data }));\n    } catch (err) {\n      res.writeHead(400, { "Content-Type": "application/json" });\n      res.end(JSON.stringify({ error: err.message }));\n    }\n  }\n}).listen(3000);' },
        { type: 'note', value: 'Ограничение maxSize обязательно! Без него злоумышленник может отправить запрос с огромным телом и исчерпать память сервера. 1MB достаточно для большинства API запросов.' }
      ]
    },
    {
      id: 4,
      title: 'Маршрутизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Маршрутизация определяет какой код выполнять для конкретного URL и метода. В голом Node.js — через if/switch. Для production — используй Express или Fastify.' },
        { type: 'code', language: 'javascript', value: 'import http from "node:http";\nimport { URL } from "node:url";\n\n// Простой роутер\nclass Router {\n  #routes = [];\n\n  add(method, path, handler) {\n    this.#routes.push({ method, path, handler });\n    return this;\n  }\n\n  get(path, handler)    { return this.add("GET",    path, handler); }\n  post(path, handler)   { return this.add("POST",   path, handler); }\n  put(path, handler)    { return this.add("PUT",    path, handler); }\n  delete(path, handler) { return this.add("DELETE", path, handler); }\n\n  handle(req, res) {\n    const url = new URL(req.url, `http://${req.headers.host}`);\n    const route = this.#routes.find(\n      r => r.method === req.method && r.path === url.pathname\n    );\n\n    if (!route) {\n      res.writeHead(404, { "Content-Type": "application/json" });\n      res.end(JSON.stringify({ error: "Маршрут не найден" }));\n      return;\n    }\n\n    route.handler(req, res, url);\n  }\n}\n\nconst router = new Router();\n\nrouter\n  .get("/",           (req, res) => send(res, 200, { message: "API v1" }))\n  .get("/api/health", (req, res) => send(res, 200, { status: "ok" }))\n  .get("/api/users",  (req, res) => send(res, 200, users));\n\nconst send = (res, status, data) => {\n  res.writeHead(status, { "Content-Type": "application/json" });\n  res.end(JSON.stringify(data));\n};\n\nconst users = [\n  { id: 1, name: "Алия" },\n  { id: 2, name: "Берик" }\n];\n\nhttp.createServer((req, res) => router.handle(req, res)).listen(3000);' },
        { type: 'tip', value: 'Этот базовый роутер не поддерживает параметры пути (/users/:id). Для параметров нужна regex-маршрутизация. В production используй Express.js — он решает все эти проблемы.' }
      ]
    },
    {
      id: 5,
      title: 'CORS и заголовки безопасности',
      type: 'theory',
      content: [
        { type: 'text', value: 'CORS (Cross-Origin Resource Sharing) — браузерный механизм безопасности. API должен явно разрешить запросы с других доменов через заголовки Access-Control-*.' },
        { type: 'code', language: 'javascript', value: 'import http from "node:http";\n\n// Middleware для CORS\nfunction setCORSHeaders(req, res, allowedOrigins = ["*"]) {\n  const origin = req.headers.origin;\n\n  if (allowedOrigins.includes("*")) {\n    res.setHeader("Access-Control-Allow-Origin", "*");\n  } else if (origin && allowedOrigins.includes(origin)) {\n    res.setHeader("Access-Control-Allow-Origin", origin);\n    res.setHeader("Vary", "Origin");\n  }\n\n  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");\n  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");\n  res.setHeader("Access-Control-Max-Age", "86400"); // кэш preflight 24ч\n}\n\n// Базовые заголовки безопасности\nfunction setSecurityHeaders(res) {\n  res.setHeader("X-Content-Type-Options", "nosniff");\n  res.setHeader("X-Frame-Options",        "DENY");\n  res.setHeader("X-XSS-Protection",       "1; mode=block");\n}\n\nhttp.createServer((req, res) => {\n  setCORSHeaders(req, res, ["https://myapp.kz", "http://localhost:3001"]);\n  setSecurityHeaders(res);\n\n  // Preflight запрос (браузер проверяет перед POST/PUT)\n  if (req.method === "OPTIONS") {\n    res.writeHead(204);\n    res.end();\n    return;\n  }\n\n  // Обычная обработка...\n  res.writeHead(200, { "Content-Type": "application/json" });\n  res.end(JSON.stringify({ message: "OK" }));\n}).listen(3000);' },
        { type: 'note', value: 'Браузер сначала отправляет OPTIONS preflight запрос для "небезопасных" методов (POST, PUT, DELETE с JSON). Сервер должен ответить 204 с CORS заголовками — только тогда браузер отправит настоящий запрос.' }
      ]
    },
    {
      id: 6,
      title: 'HTTP клиент — запросы к другим серверам',
      type: 'theory',
      content: [
        { type: 'text', value: 'Node.js может не только принимать HTTP запросы, но и отправлять их к другим сервисам. Встроенный http.request или глобальный fetch (Node.js 18+).' },
        { type: 'code', language: 'javascript', value: '// Нативный fetch (Node.js 18+) — рекомендуемый способ\nasync function fetchJSON(url, options = {}) {\n  const res = await fetch(url, {\n    headers: { "Content-Type": "application/json", ...options.headers },\n    ...options\n  });\n  if (!res.ok) throw new Error(`HTTP ${res.status}`);\n  return res.json();\n}\n\n// GET запрос\nconst users = await fetchJSON("https://jsonplaceholder.typicode.com/users");\nconsole.log(users[0].name);\n\n// POST запрос\nconst newPost = await fetchJSON("https://jsonplaceholder.typicode.com/posts", {\n  method: "POST",\n  body: JSON.stringify({ title: "Новый пост", body: "Текст" })\n});\nconsole.log(newPost.id);' },
        { type: 'code', language: 'javascript', value: '// http.request — низкоуровневый API (для legacy кода)\nimport https from "node:https";\n\nfunction get(url) {\n  return new Promise((resolve, reject) => {\n    https.get(url, (res) => {\n      const chunks = [];\n      res.on("data",  c => chunks.push(c));\n      res.on("end",   () => resolve(JSON.parse(Buffer.concat(chunks))));\n      res.on("error", reject);\n    }).on("error", reject);\n  });\n}\n\nconst data = await get("https://api.github.com/users/nodejs");\nconsole.log(data.name);' },
        { type: 'tip', value: 'В Node.js 18+ нативный fetch доступен без polyfill. Для Node.js <18 использовали пакет node-fetch. Axios — популярная альтернатива с перехватчиками (interceptors), автоматическим JSON и лучшей обработкой ошибок.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: мини REST API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай мини REST API для управления списком задач (To-Do) без фреймворков.',
      requirements: [
        'GET /api/todos — список всех задач',
        'POST /api/todos — создать задачу (тело: { title, description? })',
        'PUT /api/todos/:id — обновить задачу (title, done)',
        'DELETE /api/todos/:id — удалить задачу',
        'Правильные HTTP коды: 200, 201, 204, 404, 400'
      ],
      hint: 'Для параметров пути (/todos/:id) используй regex: /^\\/api\\/todos\\/(\\d+)$/. readBody для POST/PUT. Хранить задачи в массиве in-memory.',
      expectedOutput: 'GET /todos -> []\nPOST /todos {"title":"Задача"} -> { id: 1, title: "Задача", done: false }\nGET /todos/1 -> { id: 1, title: "Задача", done: false }\nDELETE /todos/1 -> 204 No Content',
      solution: 'import http from "node:http";\nimport { URL } from "node:url";\n\nlet todos = [];\nlet nextId = 1;\n\n// Утилиты\nconst json = (res, status, data) => {\n  res.writeHead(status, { "Content-Type": "application/json" });\n  res.end(status === 204 ? "" : JSON.stringify(data));\n};\n\nconst readBody = (req) => new Promise((resolve, reject) => {\n  const chunks = [];\n  req.on("data", c => chunks.push(c));\n  req.on("end",  () => {\n    try { resolve(JSON.parse(Buffer.concat(chunks) || "{}")); }\n    catch { reject(new Error("Невалидный JSON")); }\n  });\n  req.on("error", reject);\n});\n\nconst idFromUrl = (url) => {\n  const m = url.pathname.match(/^\\/api\\/todos\\/(\\d+)$/);\n  return m ? parseInt(m[1]) : null;\n};\n\n// Сервер\nhttp.createServer(async (req, res) => {\n  const url = new URL(req.url, `http://${req.headers.host}`);\n  res.setHeader("Access-Control-Allow-Origin", "*");\n\n  try {\n    // GET /api/todos\n    if (req.method === "GET" && url.pathname === "/api/todos") {\n      return json(res, 200, todos);\n    }\n\n    // POST /api/todos\n    if (req.method === "POST" && url.pathname === "/api/todos") {\n      const { title, description = "" } = await readBody(req);\n      if (!title?.trim()) return json(res, 400, { error: "title обязателен" });\n      const todo = { id: nextId++, title, description, done: false,\n        createdAt: new Date().toISOString() };\n      todos.push(todo);\n      return json(res, 201, todo);\n    }\n\n    // PUT /api/todos/:id\n    if (req.method === "PUT") {\n      const id = idFromUrl(url);\n      if (!id) return json(res, 404, { error: "Не найдено" });\n      const idx = todos.findIndex(t => t.id === id);\n      if (idx === -1) return json(res, 404, { error: "Задача не найдена" });\n      const updates = await readBody(req);\n      todos[idx] = { ...todos[idx], ...updates };\n      return json(res, 200, todos[idx]);\n    }\n\n    // DELETE /api/todos/:id\n    if (req.method === "DELETE") {\n      const id = idFromUrl(url);\n      if (!id) return json(res, 404, { error: "Не найдено" });\n      const before = todos.length;\n      todos = todos.filter(t => t.id !== id);\n      if (todos.length === before) return json(res, 404, { error: "Не найдена" });\n      return json(res, 204, null);\n    }\n\n    json(res, 404, { error: "Маршрут не найден" });\n\n  } catch (err) {\n    json(res, 500, { error: err.message });\n  }\n}).listen(3000, () => console.log("To-Do API на порту 3000"));',
      explanation: 'Мини REST API использует URL разбор для маршрутизации. idFromUrl извлекает числовой ID через regex. readBody накапливает chunks и парсит JSON. Задачи хранятся в памяти (при перезапуске теряются). Все HTTP статусы корректны: 201 (создано), 204 (удалено без тела), 404 (не найдено), 400 (ошибка запроса).'
    }
  ]
}
