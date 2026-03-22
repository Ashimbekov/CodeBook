export default {
  id: 51,
  title: 'Clean Code',
  description: 'Принципы чистого кода: именование, функции, DRY, KISS, SOLID, комментарии и рефакторинг',
  lessons: [
    {
      id: 1,
      title: 'Именование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошие имена — самая важная часть чистого кода. Код читают чаще чем пишут. Имена должны передавать намерение: что, зачем, как используется.' },
        { type: 'heading', value: 'Принципы именования' },
        { type: 'code', language: 'javascript', value: '// === ПЛОХО ===\nconst d = new Date();\nconst u = users.filter(x => x.a);\nconst fn = (arr, cb) => arr.forEach(cb);\nconst data2 = processData(data);\nlet temp;\nconst mgr = new Manager();\n\n// === ХОРОШО ===\nconst currentDate = new Date();\nconst activeUsers = users.filter(user => user.isActive);\nconst forEachUser = (users, handler) => users.forEach(handler);\nconst validatedUsers = validateUsers(rawUsers);\nlet cachedResult;\nconst userManager = new UserManager();\n\n// Переменные: существительные, описывают данные\nconst userCount = users.length;        // Не: usersLength, numUsers\nconst isLoggedIn = !!currentUser;      // Булевы: is/has/can/should\nconst hasPermission = (user, perm) => user.permissions.includes(perm);\nconst canEdit = hasPermission(user, "write");\nconst MAX_RETRY_COUNT = 3;             // Константы: SCREAMING_SNAKE_CASE\n\n// Функции: глаголы, описывают действие\nconst getUser = (id) => users.find(u => u.id === id);\nconst createUser = (data) => ({ ...data, id: Date.now() });\nconst updateUserEmail = (userId, email) => ({ ... });\nconst deleteExpiredSessions = () => { ... };\nconst calculateTotalPrice = (items) => items.reduce((sum, i) => sum + i.price, 0);\nconst validateEmailFormat = (email) => /\\S+@\\S+/.test(email);\nconst isValidEmail = (email) => /\\S+@\\S+/.test(email); // is... для предикатов\n\n// Классы: PascalCase, существительные\nclass UserRepository { }\nclass EmailService { }\nclass OrderProcessor { }\n\n// Избегайте: Manager, Helper, Utils, Processor — слишком расплывчато\n// Лучше: UserCache, EmailSender, OrderValidator' },
        { type: 'tip', value: 'Правило поиска: если вы можете найти имя в Google и понять что это — имя хорошее. "d" найти невозможно. "currentDate" — очевидно.' }
      ]
    },
    {
      id: 2,
      title: 'Функции — чистые и маленькие',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функции должны делать одну вещь. Если функция делает A, B и C — разбейте её на три. Один уровень абстракции, один уровень вложенности, ранний возврат.' },
        { type: 'heading', value: 'Принципы функций' },
        { type: 'code', language: 'javascript', value: '// === ПЛОХО — функция делает слишком много ===\nasync function handleUserRegistration(data, db, email, logger) {\n  if (data.email && data.password && data.name) {\n    const existingUser = await db.users.findOne({ email: data.email });\n    if (!existingUser) {\n      const hash = await bcrypt.hash(data.password, 12);\n      const user = await db.users.create({ email: data.email, name: data.name, password: hash });\n      await email.send(data.email, "Добро пожаловать!");\n      logger.info(`Зарегистрирован: ${data.email}`);\n      return { success: true, userId: user.id };\n    } else {\n      return { success: false, error: "Email занят" };\n    }\n  }\n  return { success: false, error: "Неверные данные" };\n}\n\n// === ХОРОШО — каждая функция делает одно ===\nconst validateRegistrationData = ({ email, password, name }) => {\n  if (!email || !password || !name) throw new ValidationError("Все поля обязательны");\n  if (password.length < 8) throw new ValidationError("Пароль минимум 8 символов");\n};\n\nconst checkEmailAvailability = async (email, db) => {\n  const exists = await db.users.findOne({ email });\n  if (exists) throw new ConflictError("Email уже занят");\n};\n\nconst createUserRecord = async (data, db) => {\n  const passwordHash = await bcrypt.hash(data.password, 12);\n  return db.users.create({ ...data, passwordHash, password: undefined });\n};\n\nasync function registerUser(data, { db, email, logger }) {\n  validateRegistrationData(data);                    // 1. Валидация\n  await checkEmailAvailability(data.email, db);      // 2. Проверка дубликата\n  const user = await createUserRecord(data, db);     // 3. Создание\n  await email.sendWelcome(data.email);               // 4. Email\n  logger.info(`Зарегистрирован: ${data.email}`);\n  return { success: true, userId: user.id };\n}' }
      ]
    },
    {
      id: 3,
      title: 'DRY — Don\'t Repeat Yourself',
      type: 'theory',
      content: [
        { type: 'text', value: 'DRY: каждая часть знания должна иметь единое, однозначное представление в системе. Дублирование кода приводит к несинхронным изменениям и багам.' },
        { type: 'heading', value: 'Устранение дублирования' },
        { type: 'code', language: 'javascript', value: '// === ПЛОХО — дублирование ===\nconst validateName = (name) => {\n  if (!name) return "Имя обязательно";\n  if (name.length < 2) return "Имя минимум 2 символа";\n  if (name.length > 50) return "Имя максимум 50 символов";\n  return null;\n};\n\nconst validateCity = (city) => {\n  if (!city) return "Город обязателен";\n  if (city.length < 2) return "Город минимум 2 символа";\n  if (city.length > 50) return "Город максимум 50 символов";\n  return null;\n};\n\n// === ХОРОШО — абстракция ===\nconst validateStringField = (fieldName, min = 2, max = 50) => (value) => {\n  if (!value) return `${fieldName} обязательно`;\n  if (value.length < min) return `${fieldName} минимум ${min} символа`;\n  if (value.length > max) return `${fieldName} максимум ${max} символов`;\n  return null;\n};\n\nconst validateName = validateStringField("Имя");\nconst validateCity = validateStringField("Город");\nconst validateTitle = validateStringField("Заголовок", 5, 100);\n\n// Дублирование в условиях\n// Плохо:\nif (user.role === "admin" || user.role === "superadmin" || user.role === "moderator") { ... }\n\n// Хорошо:\nconst PRIVILEGED_ROLES = ["admin", "superadmin", "moderator"];\nif (PRIVILEGED_ROLES.includes(user.role)) { ... }\n\n// Дублирование в обработчиках\n// Плохо:\napp.get("/users", authenticate, (req, res) => { ... });\napp.post("/users", authenticate, (req, res) => { ... });\napp.delete("/users/:id", authenticate, (req, res) => { ... });\n\n// Хорошо:\nconst usersRouter = express.Router();\nusersRouter.use(authenticate); // Один раз\nusersRouter.get("/", ...);\nusersRouter.post("/", ...);\nusersRouter.delete("/:id", ...);' }
      ]
    },
    {
      id: 4,
      title: 'KISS и YAGNI',
      type: 'theory',
      content: [
        { type: 'text', value: 'KISS (Keep It Simple, Stupid): простой код лучше сложного. YAGNI (You Ain\'t Gonna Need It): не добавляйте функциональность "на будущее" — вы её не используете.' },
        { type: 'heading', value: 'Простота и минимализм' },
        { type: 'code', language: 'javascript', value: '// === НАРУШЕНИЕ KISS — сложное решение простой задачи ===\nclass UserNameFormatter {\n  constructor(options = {}) {\n    this.separator = options.separator || " ";\n    this.transform = options.transform || "none";\n    this.truncateAt = options.truncateAt || Infinity;\n  }\n\n  format(firstName, lastName) {\n    let result = `${firstName}${this.separator}${lastName}`;\n    if (this.transform === "upper") result = result.toUpperCase();\n    if (this.transform === "lower") result = result.toLowerCase();\n    return result.slice(0, this.truncateAt);\n  }\n}\n\n// === KISS — простое решение ===\nconst formatUserName = (firstName, lastName) => `${firstName} ${lastName}`;\n\n// === YAGNI — не делай то, что не нужно СЕЙЧАС ===\n// Плохо: "Может понадобится поддержка разных БД"\nclass UserRepository {\n  constructor(adapter) {\n    // Абстракция для MongoDB И PostgreSQL И Redis\n    // хотя используется только MongoDB\n    this.adapter = adapter;\n  }\n}\n\n// Хорошо: решаем текущую задачу\nconst userRepo = {\n  findById: (id) => User.findById(id),\n  create: (data) => User.create(data)\n};\n// Рефакторинг, когда реально появится вторая БД\n\n// === Сложность часто прячется в коде ===\n// Плохо\nconst result = arr.reduce((acc, x) => acc + (x.active ? x.value : 0), 0);\n\n// Хорошо — явные шаги\nconst activeItems = arr.filter(x => x.active);\nconst total = activeItems.reduce((sum, x) => sum + x.value, 0);' },
        { type: 'tip', value: 'Правило Scout: оставьте код чище, чем нашли. Каждый PR улучшает читаемость — переименуйте неясную переменную, вынесите магическое число в константу, добавьте один комментарий.' }
      ]
    },
    {
      id: 5,
      title: 'Комментарии и документация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Лучший комментарий — хорошее имя переменной/функции. Комментарий должен объяснять ЗАЧЕМ, не ЧТО. Устаревшие комментарии хуже их отсутствия.' },
        { type: 'heading', value: 'Когда и как комментировать' },
        { type: 'code', language: 'javascript', value: '// === ПЛОХИЕ комментарии ===\n\n// Получаем пользователей\nconst getUsers = () => { /* ... */ }; // Очевидно из имени\n\n// i++ увеличивает i на 1\ni++;\n\n// Закомментированный код — удаляйте, Git помнит всё!\n// const oldFunction = () => { ... };\n\n// Устаревший комментарий\n// Проверяем возраст (СЕЙЧАС ПРОВЕРЯЕМ EMAIL)\nif (user.email !== existingEmail) { ... }\n\n// === ХОРОШИЕ комментарии ===\n\n// RFC 2822 требует особый формат для служебных адресов\nconst isValidEmail = (email) =>\n  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/.test(email);\n\n// Bcrypt целенаправленно медленный, 12 rounds — разумный баланс\n// безопасности и производительности (~300ms на современном железе)\nconst SALT_ROUNDS = 12;\n\n// HACK: обходной путь для бага в Safari 15.x\n// Удалить после выхода Safari 16\nconst forceRepaint = () => void element.offsetHeight;\n\n// TODO: заменить на Redis после нагрузочного тестирования\nconst cache = new Map();\n\n// JSDoc для публичного API\n/**\n * Вычисляет итоговую стоимость корзины с учётом скидок\n * @param {CartItem[]} items - товары в корзине\n * @param {number} [discountPercent=0] - скидка в процентах (0-100)\n * @returns {number} итоговая стоимость в тенге\n * @throws {RangeError} если discountPercent вне диапазона 0-100\n */\nfunction calculateCartTotal(items, discountPercent = 0) { ... }' }
      ]
    },
    {
      id: 6,
      title: 'Рефакторинг',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рефакторинг — улучшение структуры кода без изменения поведения. Включает: extract function/variable, rename, inline, move method, replace conditional with polymorphism.' },
        { type: 'heading', value: 'Техники рефакторинга' },
        { type: 'code', language: 'javascript', value: '// 1. Extract Function — выделить функцию\n// До\nfunction printOrderSummary(order) {\n  console.log("=".repeat(30));\n  console.log(`Заказ #${order.id}`);\n  console.log(`Клиент: ${order.customer.name}`);\n  let total = 0;\n  for (const item of order.items) {\n    console.log(`  ${item.name}: ${item.price} x ${item.qty}`);\n    total += item.price * item.qty;\n  }\n  if (total > 10000) total *= 0.9;\n  console.log(`Итого: ${total}`);\n  console.log("=".repeat(30));\n}\n\n// После\nconst printDivider = () => console.log("=".repeat(30));\nconst printOrderHeader = ({ id, customer }) => {\n  console.log(`Заказ #${id}`);\n  console.log(`Клиент: ${customer.name}`);\n};\nconst printOrderItems = (items) =>\n  items.forEach(i => console.log(`  ${i.name}: ${i.price} x ${i.qty}`));\nconst calculateTotal = (items) =>\n  items.reduce((sum, i) => sum + i.price * i.qty, 0);\nconst applyDiscount = (total) => total > 10000 ? total * 0.9 : total;\n\nfunction printOrderSummaryClean(order) {\n  printDivider();\n  printOrderHeader(order);\n  printOrderItems(order.items);\n  const total = applyDiscount(calculateTotal(order.items));\n  console.log(`Итого: ${total}`);\n  printDivider();\n}\n\n// 2. Ранний возврат — убирает глубокую вложенность\n// До\nfunction processOrder(order) {\n  if (order) {\n    if (order.status === "pending") {\n      if (order.items.length > 0) {\n        return processItems(order.items);\n      }\n    }\n  }\n  return null;\n}\n\n// После (guard clauses)\nfunction processOrderClean(order) {\n  if (!order) return null;\n  if (order.status !== "pending") return null;\n  if (order.items.length === 0) return null;\n  return processItems(order.items);\n}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Рефакторинг',
      type: 'practice',
      difficulty: 'medium',
      description: 'Выполните рефакторинг предоставленного кода: улучшите именование, устраните дублирование, упростите функции.',
      requirements: [
        'Переименуйте все переменные и функции согласно принципам именования',
        'Разбейте функцию processData на несколько маленьких',
        'Устраните дублирование в валидации полей',
        'Замените вложенные if на guard clauses',
        'Добавьте JSDoc для публичных функций',
        'Вынесите magic numbers в именованные константы'
      ],
      solution: {
        code: '// ДО рефакторинга\nfunction proc(d, t) {\n  let r = [];\n  for (let i = 0; i < d.length; i++) {\n    if (d[i].s === 1) {\n      if (d[i].p > 0) {\n        if (d[i].p > 10000) {\n          let tmp = { ...d[i], p: d[i].p * 0.9, t: t };\n          r.push(tmp);\n        } else {\n          r.push({ ...d[i], t: t });\n        }\n      }\n    }\n  }\n  return r;\n}\n\n// ПОСЛЕ рефакторинга\nconst DISCOUNT_THRESHOLD = 10000;\nconst DISCOUNT_RATE = 0.9;\nconst STATUS_ACTIVE = 1;\n\n/**\n * Проверяет что товар активен и имеет цену\n * @param {Object} product\n * @returns {boolean}\n */\nconst isEligibleProduct = (product) =>\n  product.status === STATUS_ACTIVE && product.price > 0;\n\n/**\n * Применяет скидку если цена превышает порог\n * @param {number} price\n * @returns {number}\n */\nconst applyBulkDiscount = (price) =>\n  price > DISCOUNT_THRESHOLD ? price * DISCOUNT_RATE : price;\n\n/**\n * Обогащает продукт вычисленными полями\n * @param {string} taxCode\n * @returns {Function}\n */\nconst enrichProduct = (taxCode) => (product) => ({\n  ...product,\n  price: applyBulkDiscount(product.price),\n  taxCode\n});\n\n/**\n * Обрабатывает список продуктов для выставления счёта\n * @param {Object[]} products - список товаров\n * @param {string} taxCode - код налогового периода\n * @returns {Object[]} отфильтрованные и обогащённые товары\n */\nfunction processProducts(products, taxCode) {\n  return products\n    .filter(isEligibleProduct)\n    .map(enrichProduct(taxCode));\n}\n\nconst result = processProducts(rawProducts, "2024-Q1");\nconsole.log(result);',
        language: 'javascript'
      },
      explanation: 'Magic numbers 1, 0.9, 10000 заменены именованными константами STATUS_ACTIVE, DISCOUNT_RATE, DISCOUNT_THRESHOLD — теперь понятно что они означают. Вложенные if с тремя уровнями разделены на отдельные функции с одной ответственностью. enrichProduct — функция высшего порядка (замыкание над taxCode), возвращает трансформер продукта. JSDoc документирует публичный API: параметры, возвращаемое значение, что делает функция. Цепочка filter + map читается как описание алгоритма: отфильтруй подходящие, обогати каждый.'
    }
  ]
};
