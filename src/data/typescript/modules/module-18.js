export default {
  id: 18,
  title: 'TypeScript с Node.js',
  description: 'TypeScript на бэкенде: настройка Express, типизация роутов, middleware, работа с базой данных и сборка для production',
  lessons: [
    {
      id: 1,
      title: 'Настройка TypeScript + Node.js проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript в Node.js требует дополнительной настройки: установки типов (@types/node), настройки tsconfig для Node.js и инструментов для разработки (ts-node или tsx).' },
        { type: 'heading', value: 'Инициализация проекта' },
        { type: 'code', language: 'typescript', value: '// Шаги создания проекта:\n// 1. npm init -y\n// 2. npm install typescript ts-node @types/node --save-dev\n// 3. npx tsc --init\n\n// tsconfig.json для Node.js:\n// {\n//   "compilerOptions": {\n//     "target": "ES2022",\n//     "module": "CommonJS",\n//     "rootDir": "./src",\n//     "outDir": "./dist",\n//     "strict": true,\n//     "esModuleInterop": true,\n//     "resolveJsonModule": true,\n//     "types": ["node"]\n//   },\n//   "include": ["src"]\n// }\n\n// package.json scripts:\n// {\n//   "scripts": {\n//     "dev": "tsx watch src/index.ts",\n//     "build": "tsc",\n//     "start": "node dist/index.js"\n//   }\n// }\n\n// Первый файл src/index.ts:\nconst message: string = "TypeScript + Node.js работает!";\nconsole.log(message);\n\nconst server = require("http").createServer((req: any, res: any) => {\n  res.end("Hello TypeScript!");\n});\nserver.listen(3000, () => console.log("Сервер на порту 3000"));' },
        { type: 'note', value: 'tsx (не путать с .tsx файлами) — быстрый runner для TypeScript в Node.js. Альтернативы: ts-node (классика), ts-node-dev (с перезапуском). В Node.js 22+ есть нативная поддержка TypeScript (--experimental-strip-types).' }
      ]
    },
    {
      id: 2,
      title: 'TypeScript + Express',
      type: 'theory',
      content: [
        { type: 'text', value: 'Express — самый популярный Node.js фреймворк. С TypeScript нужен пакет @types/express для типов Request, Response, NextFunction.' },
        { type: 'heading', value: 'Базовый Express сервер' },
        { type: 'code', language: 'typescript', value: 'import express, { Request, Response, NextFunction } from "express";\n\nconst app = express();\napp.use(express.json()); // Парсинг JSON тела\n\n// Типизированный роут\napp.get("/health", (req: Request, res: Response) => {\n  res.json({ status: "ok", timestamp: new Date().toISOString() });\n});\n\n// Роут с параметрами\napp.get("/users/:id", (req: Request, res: Response) => {\n  const id = parseInt(req.params.id);\n  if (isNaN(id)) {\n    return res.status(400).json({ error: "id должен быть числом" });\n  }\n  res.json({ id, name: "Пользователь " + id });\n});\n\n// Роут с query параметрами\napp.get("/search", (req: Request, res: Response) => {\n  const { q, limit = "10" } = req.query;\n  const limitNum = parseInt(limit as string);\n  res.json({ query: q, limit: limitNum });\n});\n\napp.listen(3000, () => console.log("Сервер запущен на :3000"));' },
        { type: 'heading', value: 'Расширение типов Request' },
        { type: 'code', language: 'typescript', value: '// src/types/express.d.ts\ndeclare namespace Express {\n  interface Request {\n    user?: {\n      id: number;\n      email: string;\n      role: "admin" | "user";\n    };\n    requestId?: string;\n  }\n}\n\n// Теперь можно использовать req.user в middleware:\nconst authMiddleware = (req: Request, res: Response, next: NextFunction) => {\n  const token = req.headers.authorization?.replace("Bearer ", "");\n  if (!token) {\n    return res.status(401).json({ error: "Нет токена" });\n  }\n  // После аутентификации:\n  req.user = { id: 1, email: "user@example.com", role: "user" };\n  next();\n};\n\n// TypeScript знает о req.user!\napp.get("/profile", authMiddleware, (req: Request, res: Response) => {\n  res.json({ user: req.user }); // req.user типизирован!\n});' }
      ]
    },
    {
      id: 3,
      title: 'Типизированные роутеры и контроллеры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошая архитектура Express приложения: роутеры для группировки маршрутов, контроллеры для бизнес-логики. TypeScript помогает структурировать код.' },
        { type: 'heading', value: 'Структура роутеров' },
        { type: 'code', language: 'typescript', value: 'import { Router, Request, Response } from "express";\n\n// Интерфейсы для тел запросов\ninterface CreateUserBody {\n  name: string;\n  email: string;\n  age?: number;\n}\n\ninterface UpdateUserBody {\n  name?: string;\n  email?: string;\n}\n\ntype UserParams = { id: string };\n\n// Типизированный контроллер\nclass UserController {\n  getAll = async (req: Request, res: Response): Promise<void> => {\n    const users = [{ id: 1, name: "Алиса" }, { id: 2, name: "Боб" }];\n    res.json(users);\n  };\n\n  getOne = async (req: Request<UserParams>, res: Response): Promise<void> => {\n    const id = parseInt(req.params.id);\n    res.json({ id, name: "Пользователь" });\n  };\n\n  create = async (\n    req: Request<{}, {}, CreateUserBody>,\n    res: Response\n  ): Promise<void> => {\n    const { name, email } = req.body; // Типизировано!\n    res.status(201).json({ id: Date.now(), name, email });\n  };\n}\n\n// Роутер\nconst userRouter = Router();\nconst controller = new UserController();\n\nuserRouter.get("/",    controller.getAll);\nuserRouter.get("/:id", controller.getOne);\nuserRouter.post("/",   controller.create);\n\nexport default userRouter;' }
      ]
    },
    {
      id: 4,
      title: 'Middleware и обработка ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Middleware — функции, которые выполняются между запросом и ответом. TypeScript помогает правильно типизировать middleware и централизованную обработку ошибок.' },
        { type: 'heading', value: 'Типизированный middleware' },
        { type: 'code', language: 'typescript', value: 'import { Request, Response, NextFunction, RequestHandler } from "express";\n\n// Тип для middleware\ntype Middleware = RequestHandler;\n\n// Логирование запросов\nconst requestLogger: Middleware = (req, res, next) => {\n  const start = Date.now();\n  res.on("finish", () => {\n    const duration = Date.now() - start;\n    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);\n  });\n  next();\n};\n\n// Валидация тела запроса\nfunction validateBody<T>(schema: (body: unknown) => body is T): RequestHandler {\n  return (req, res, next) => {\n    if (!schema(req.body)) {\n      res.status(400).json({ error: "Невалидные данные" });\n      return;\n    }\n    next();\n  };\n}\n\n// Кастомный тип ошибки\nclass AppError extends Error {\n  constructor(\n    message: string,\n    public statusCode: number = 500,\n    public code?: string\n  ) {\n    super(message);\n    this.name = "AppError";\n  }\n}\n\n// Централизованная обработка ошибок (4 параметра!)\nconst errorHandler = (\n  err: Error,\n  req: Request,\n  res: Response,\n  next: NextFunction\n): void => {\n  if (err instanceof AppError) {\n    res.status(err.statusCode).json({\n      error: err.message,\n      code: err.code\n    });\n    return;\n  }\n  console.error("Неожиданная ошибка:", err);\n  res.status(500).json({ error: "Внутренняя ошибка сервера" });\n};\n\nexport { requestLogger, validateBody, AppError, errorHandler };' }
      ]
    },
    {
      id: 5,
      title: 'Работа с переменными окружения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Переменные окружения (process.env) в TypeScript имеют тип string | undefined. Нужна валидация при старте приложения. Паттерн config модуля обеспечивает типобезопасный доступ к настройкам.' },
        { type: 'heading', value: 'Типизированный config модуль' },
        { type: 'code', language: 'typescript', value: '// src/config.ts\ninterface Config {\n  port: number;\n  nodeEnv: "development" | "production" | "test";\n  database: {\n    host: string;\n    port: number;\n    name: string;\n  };\n  jwt: {\n    secret: string;\n    expiresIn: string;\n  };\n}\n\nfunction requireEnv(key: string): string {\n  const value = process.env[key];\n  if (!value) {\n    throw new Error(`Переменная окружения ${key} не задана`);\n  }\n  return value;\n}\n\nfunction getEnv(key: string, defaultValue: string): string {\n  return process.env[key] || defaultValue;\n}\n\nexport const config: Config = {\n  port: parseInt(getEnv("PORT", "3000")),\n  nodeEnv: (getEnv("NODE_ENV", "development")) as Config["nodeEnv"],\n  database: {\n    host: getEnv("DB_HOST", "localhost"),\n    port: parseInt(getEnv("DB_PORT", "5432")),\n    name: requireEnv("DB_NAME"),\n  },\n  jwt: {\n    secret: requireEnv("JWT_SECRET"),\n    expiresIn: getEnv("JWT_EXPIRES", "7d"),\n  },\n};\n\n// Использование:\nimport { config } from "./config";\nconsole.log(config.port);             // number\nconsole.log(config.database.host);    // string\nconsole.log(config.nodeEnv);          // "development" | "production" | "test"' },
        { type: 'tip', value: 'requireEnv бросает ошибку при старте, если обязательная переменная не задана. Это "fail fast" подход — лучше упасть сразу, чем получить непонятную ошибку в рантайме.' }
      ]
    },
    {
      id: 6,
      title: 'Работа с fs и path',
      type: 'theory',
      content: [
        { type: 'text', value: 'Node.js fs (файловая система) и path — модули с полными TypeScript типами через @types/node. Современный подход — использовать промис-версии из fs/promises.' },
        { type: 'heading', value: 'Типизированная работа с файлами' },
        { type: 'code', language: 'typescript', value: 'import { readFile, writeFile, readdir, stat, mkdir } from "fs/promises";\nimport { join, extname, dirname } from "path";\n\ninterface FileInfo {\n  name: string;\n  path: string;\n  size: number;\n  extension: string;\n  isDirectory: boolean;\n}\n\nasync function getFilesInfo(dirPath: string): Promise<FileInfo[]> {\n  const entries = await readdir(dirPath);\n  const infos: FileInfo[] = [];\n\n  for (const entry of entries) {\n    const fullPath = join(dirPath, entry);\n    const stats = await stat(fullPath);\n\n    infos.push({\n      name: entry,\n      path: fullPath,\n      size: stats.size,\n      extension: extname(entry),\n      isDirectory: stats.isDirectory(),\n    });\n  }\n\n  return infos.sort((a, b) => a.name.localeCompare(b.name));\n}\n\nasync function writeJson<T>(filePath: string, data: T): Promise<void> {\n  const dir = dirname(filePath);\n  await mkdir(dir, { recursive: true });\n  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");\n}\n\nasync function readJson<T>(filePath: string): Promise<T> {\n  const content = await readFile(filePath, "utf-8");\n  return JSON.parse(content) as T;\n}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: REST API сервер',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте типизированный REST API для управления задачами на Express + TypeScript. Должны быть все CRUD операции, валидация, обработка ошибок и in-memory хранилище.',
      requirements: [
        'Интерфейс Task: id, title, description?, completed, createdAt',
        'In-memory хранилище TaskRepository с методами findAll, findById, create, update, delete',
        'Роутер /api/tasks с GET, POST, PUT /id, DELETE /id',
        'Валидация тела запроса через type guard',
        'Кастомный класс NotFoundError extends AppError',
        'Middleware для обработки ошибок'
      ],
      hint: 'TaskRepository хранит задачи в Map<number, Task>. create генерирует id через Date.now(). update использует Object.assign для частичного обновления. Каждый метод типизирован.',
      solution: 'import express, { Request, Response, NextFunction } from "express";\n\n// Типы\ninterface Task {\n  id: number;\n  title: string;\n  description?: string;\n  completed: boolean;\n  createdAt: Date;\n}\n\ntype CreateTaskBody = Pick<Task, "title" | "description">;\ntype UpdateTaskBody = Partial<Pick<Task, "title" | "description" | "completed">>;\n\n// Ошибки\nclass AppError extends Error {\n  constructor(message: string, public statusCode: number = 500) {\n    super(message);\n  }\n}\n\nclass NotFoundError extends AppError {\n  constructor(id: number) {\n    super(`Задача с id ${id} не найдена`, 404);\n  }\n}\n\n// Хранилище\nclass TaskRepository {\n  private tasks = new Map<number, Task>();\n\n  findAll(): Task[] { return Array.from(this.tasks.values()); }\n\n  findById(id: number): Task {\n    const task = this.tasks.get(id);\n    if (!task) throw new NotFoundError(id);\n    return task;\n  }\n\n  create(body: CreateTaskBody): Task {\n    const task: Task = { id: Date.now(), ...body, completed: false, createdAt: new Date() };\n    this.tasks.set(task.id, task);\n    return task;\n  }\n\n  update(id: number, body: UpdateTaskBody): Task {\n    const task = this.findById(id);\n    Object.assign(task, body);\n    return task;\n  }\n\n  delete(id: number): void {\n    if (!this.tasks.has(id)) throw new NotFoundError(id);\n    this.tasks.delete(id);\n  }\n}\n\n// Роутер\nconst repo = new TaskRepository();\nconst router = express.Router();\n\nrouter.get("/", (req: Request, res: Response) => {\n  res.json(repo.findAll());\n});\n\nrouter.post("/", (req: Request<{}, {}, CreateTaskBody>, res: Response) => {\n  const { title, description } = req.body;\n  if (!title?.trim()) {\n    res.status(400).json({ error: "title обязателен" });\n    return;\n  }\n  res.status(201).json(repo.create({ title: title.trim(), description }));\n});\n\nrouter.put("/:id", (req: Request<{id: string}, {}, UpdateTaskBody>, res: Response, next: NextFunction) => {\n  try {\n    const id = parseInt(req.params.id);\n    res.json(repo.update(id, req.body));\n  } catch (e) { next(e); }\n});\n\nrouter.delete("/:id", (req: Request<{id: string}>, res: Response, next: NextFunction) => {\n  try {\n    repo.delete(parseInt(req.params.id));\n    res.status(204).send();\n  } catch (e) { next(e); }\n});\n\nconst app = express();\napp.use(express.json());\napp.use("/api/tasks", router);\napp.use((err: Error, req: Request, res: Response, next: NextFunction) => {\n  if (err instanceof AppError) {\n    res.status(err.statusCode).json({ error: err.message });\n  } else {\n    res.status(500).json({ error: "Внутренняя ошибка" });\n  }\n});\napp.listen(3000, () => console.log("API запущено на :3000"));',
      explanation: 'TaskRepository инкапсулирует хранилище с полной типизацией. NotFoundError наследует AppError — централизованная обработка ошибок в одном middleware. Request<Params, Response, Body> — три generic параметра Express для типобезопасных params и body.'
    }
  ]
}
