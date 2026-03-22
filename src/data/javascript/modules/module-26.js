export default {
  id: 26,
  title: 'Async/Await',
  description: 'async/await — синтаксический сахар над Promise для написания асинхронного кода в синхронном стиле. Обработка ошибок, параллельность, последовательность.',
  lessons: [
    {
      id: 1,
      title: 'Основы async/await',
      type: 'theory',
      content: [
        { type: 'text', value: 'async объявляет функцию асинхронной — она всегда возвращает Promise. await внутри async-функции "ждёт" разрешения Promise, не блокируя поток выполнения.' },
        { type: 'code', language: 'javascript', value: '// async функция ВСЕГДА возвращает Promise\nasync function getNumber() {\n  return 42; // автоматически оборачивается в Promise.resolve(42)\n}\nconsole.log(getNumber()); // Promise { 42 }\n\nasync function hello() {\n  return "Привет";\n}\nhello().then(console.log); // "Привет"\n\n// await "разворачивает" Promise\nasync function loadUser(id) {\n  const response = await fetch(`/api/users/${id}`);\n  // ждём здесь, но поток НЕ заблокирован\n  const user = await response.json();\n  // ждём снова\n  return user; // возвращается как Promise.resolve(user)\n}\n\n// Вместо цепочки .then:\n// fetch(...).then(r => r.json()).then(user => ...)\n\n// Читается как синхронный код!\nasync function main() {\n  const user = await loadUser(1);\n  console.log(user.name);\n}' },
        { type: 'tip', value: 'await можно использовать только внутри async функций (или в Top-Level Await в модулях ES2022). Попытка использовать await на верхнем уровне в обычном скрипте — SyntaxError.' }
      ]
    },
    {
      id: 2,
      title: 'try/catch для обработки ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'В async/await для обработки ошибок используют try/catch — это делает обработку ошибок интуитивной и позволяет использовать тот же синтаксис что и для синхронных ошибок.' },
        { type: 'code', language: 'javascript', value: 'async function fetchUser(id) {\n  try {\n    const res = await fetch(`/api/users/${id}`);\n\n    if (!res.ok) {\n      throw new Error(`HTTP ${res.status}: ${res.statusText}`);\n    }\n\n    const user = await res.json();\n    return user;\n\n  } catch (err) {\n    // Поймает:\n    // 1. Сетевые ошибки (fetch упал)\n    // 2. Ошибки парсинга JSON\n    // 3. Наши throw-ошибки\n    console.error("Ошибка загрузки:", err.message);\n    return null; // или throw для передачи выше\n  } finally {\n    console.log("Запрос завершён");\n  }\n}\n\n// Несколько операций — одни try/catch\nasync function processOrder(orderId) {\n  try {\n    const order   = await fetchOrder(orderId);\n    const user    = await fetchUser(order.userId);\n    const product = await fetchProduct(order.productId);\n    return { order, user, product };\n  } catch (err) {\n    // Любая ошибка из любого await попадёт сюда\n    throw new Error(`Ошибка обработки заказа: ${err.message}`);\n  }\n}' },
        { type: 'code', language: 'javascript', value: '// Паттерн: обёртка to(promise) в стиле Go\nasync function to(promise) {\n  try {\n    const data = await promise;\n    return [null, data];\n  } catch (err) {\n    return [err, null];\n  }\n}\n\nasync function loadDashboard() {\n  const [err, user] = await to(fetchUser(1));\n  if (err) return console.log("Ошибка:", err.message);\n\n  const [ordErr, orders] = await to(fetchOrders(user.id));\n  if (ordErr) return console.log("Ошибка заказов");\n\n  return { user, orders };\n}' },
        { type: 'note', value: 'Не забывай await перед Promise! Ошибка: const res = fetch("/api/data") — это Promise, а не данные. res.json() выбросит ошибку. Правильно: const res = await fetch(...).' }
      ]
    },
    {
      id: 3,
      title: 'Параллельное выполнение с await',
      type: 'theory',
      content: [
        { type: 'text', value: 'Последовательный await — задачи выполняются одна за другой. Параллельный await через Promise.all — задачи выполняются одновременно. Выбор влияет на производительность.' },
        { type: 'code', language: 'javascript', value: 'const delay = (ms, val) => new Promise(r => setTimeout(() => r(val), ms));\n\n// ПОСЛЕДОВАТЕЛЬНО — медленно!\nasync function sequential() {\n  const a = await delay(1000, "A"); // ждём 1с\n  const b = await delay(1000, "B"); // ждём ещё 1с\n  const c = await delay(1000, "C"); // ждём ещё 1с\n  return [a, b, c];\n  // Итого: 3 секунды\n}\n\n// ПАРАЛЛЕЛЬНО — быстро!\nasync function parallel() {\n  const [a, b, c] = await Promise.all([\n    delay(1000, "A"),\n    delay(1000, "B"),\n    delay(1000, "C")\n  ]);\n  return [a, b, c];\n  // Итого: 1 секунда (максимум из трёх)!\n}' },
        { type: 'code', language: 'javascript', value: '// Когда последовательно — правильно:\nasync function createUserAndOrder(userData) {\n  // Сначала НУЖНО создать пользователя, потом заказ\n  const user  = await createUser(userData);    // нужен user.id\n  const order = await createOrder(user.id);    // зависит от user!\n  return { user, order };\n}\n\n// Когда параллельно — правильно:\nasync function loadProfile(userId) {\n  // Эти запросы НЕЗАВИСИМЫ — можно параллельно\n  const [user, posts, followers] = await Promise.all([\n    fetchUser(userId),\n    fetchPosts(userId),\n    fetchFollowers(userId)\n  ]);\n  return { user, posts, followers };\n}\n\n// Смешанный случай\nasync function mixed(userId) {\n  const user = await fetchUser(userId); // нужен для остальных\n  const [posts, friends] = await Promise.all([\n    fetchPosts(user.id),     // параллельно\n    fetchFriends(user.id)    // параллельно\n  ]);\n  return { user, posts, friends };\n}' },
        { type: 'tip', value: 'Правило: если операция B не зависит от результата A — запускай их параллельно через Promise.all. Последовательный await только когда есть зависимость данных.' }
      ]
    },
    {
      id: 4,
      title: 'async в разных контекстах',
      type: 'theory',
      content: [
        { type: 'text', value: 'async работает везде где есть функции: методы класса, методы объектов, стрелочные функции, callback в forEach и т.д.' },
        { type: 'code', language: 'javascript', value: '// async метод класса\nclass UserService {\n  async findById(id) {\n    const res = await fetch(`/api/users/${id}`);\n    return res.json();\n  }\n\n  async createUser(data) {\n    const res = await fetch("/api/users", {\n      method: "POST",\n      headers: { "Content-Type": "application/json" },\n      body: JSON.stringify(data)\n    });\n    if (!res.ok) throw new Error("Не удалось создать");\n    return res.json();\n  }\n}\n\n// async стрелочная функция\nconst fetchData = async (url) => {\n  const res = await fetch(url);\n  return res.json();\n};\n\n// ЛОВУШКА: async в forEach не ждёт!\nasync function wrong() {\n  const ids = [1, 2, 3];\n  ids.forEach(async (id) => {\n    const user = await fetchUser(id); // не ждётся!\n    console.log(user);\n  });\n  console.log("Готово?"); // выведется ДО пользователей!\n}\n\n// Правильно: for...of с await\nasync function correct() {\n  const ids = [1, 2, 3];\n  for (const id of ids) {\n    const user = await fetchUser(id); // ждётся!\n    console.log(user);\n  }\n  console.log("Готово!"); // выведется ПОСЛЕ всех\n}' },
        { type: 'note', value: 'forEach не "ждёт" async callback — он просто запускает их и не ожидает Promise. Используй for...of для последовательного выполнения или Promise.all(arr.map(async fn)) для параллельного.' }
      ]
    },
    {
      id: 5,
      title: 'Top-level await и async patterns',
      type: 'theory',
      content: [
        { type: 'text', value: 'Top-Level Await (ES2022) позволяет использовать await вне async функции в ES модулях. Удобно для инициализации модулей.' },
        { type: 'code', language: 'javascript', value: '// === config.mjs (ES модуль) ===\n// Top-Level Await — работает только в ES модулях!\nconst config = await fetch("/api/config").then(r => r.json());\nexport { config };\n\n// === db.mjs ===\nconst connection = await connectToDatabase();\nexport { connection };\n\n// Другие модули дождутся инициализации автоматически!\n// import { config } from "./config.mjs";\n// config уже загружен и готов' },
        { type: 'code', language: 'javascript', value: '// Паттерн: async IIFE для top-level\n(async () => {\n  try {\n    const data = await fetchInitialData();\n    initApp(data);\n  } catch (err) {\n    console.error("Ошибка инициализации:", err);\n    process.exit(1);\n  }\n})();\n\n// Декоратор asyncHandler для Express\nfunction asyncHandler(fn) {\n  return (req, res, next) => {\n    Promise.resolve(fn(req, res, next)).catch(next);\n  };\n}\n\n// Использование\napp.get("/users/:id", asyncHandler(async (req, res) => {\n  const user = await User.findById(req.params.id);\n  if (!user) return res.status(404).json({ error: "Не найден" });\n  res.json(user);\n}));\n// Ошибки автоматически передаются в next(err)!' },
        { type: 'tip', value: 'asyncHandler — незаменимый паттерн в Express. Без него каждый async обработчик нужно оборачивать в try/catch вручную. asyncHandler делает это автоматически.' }
      ]
    },
    {
      id: 6,
      title: 'Дебаггинг и распространённые ошибки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Распространённые ошибки с async/await: забытый await, несколько необработанных промисов, неправильная цепочка асинхронных операций.' },
        { type: 'code', language: 'javascript', value: '// Ошибка 1: забытый await\nasync function bad1() {\n  const user = fetchUser(1); // !! Promise, не данные\n  console.log(user.name); // undefined!\n}\n\n// Ошибка 2: Promise не awaited — потеря ошибок\nasync function bad2() {\n  fetchData().catch(console.error); // запустили и забыли\n  doOtherStuff(); // продолжаем без ожидания\n}\n\n// Ошибка 3: последовательный await там, где нужен параллельный\nasync function bad3() {\n  const a = await fetchA(); // ждём\n  const b = await fetchB(); // ждём ещё (но B не зависит от A!)\n  return [a, b]; // медленно!\n}\n\n// Правильно:\nasync function good3() {\n  const [a, b] = await Promise.all([fetchA(), fetchB()]); // параллельно!\n  return [a, b];\n}\n\n// Ошибка 4: async в конструкторе\nclass Bad {\n  constructor() {\n    this.data = await fetchData(); // SyntaxError!\n  }\n}\n\n// Правильно: static factory method\nclass Good {\n  static async create() {\n    const instance = new Good();\n    instance.data = await fetchData();\n    return instance;\n  }\n}\nconst g = await Good.create();' }
      ]
    },
    {
      id: 7,
      title: 'Практика: асинхронный загрузчик данных',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй набор утилит для работы с async/await.',
      requirements: [
        'fetchWithRetry(url, options, retries) — fetch с повторными попытками',
        'loadSequential(urls) — загрузить URLs последовательно, вернуть массив результатов',
        'loadParallel(urls, concurrency) — загрузить параллельно с ограничением одновременных запросов',
        'withTimeout(asyncFn, ms) — обёртка добавляющая таймаут к async функции'
      ],
      hint: 'loadParallel с concurrency: создай N "воркеров", каждый берёт следующий URL из очереди. Или использй семафор — счётчик активных запросов.',
      expectedOutput: 'fetchWithRetry(url) -> возвращает данные после повторных попыток\nParallel fetch 3 URLs -> все результаты получены за время max(t1,t2,t3)\nsequential(tasks) -> задачи выполнены по очереди',
      solution: 'async function fetchWithRetry(url, options = {}, retries = 3) {\n  for (let attempt = 1; attempt <= retries; attempt++) {\n    try {\n      const res = await fetch(url, options);\n      if (!res.ok) throw new Error(`HTTP ${res.status}`);\n      return await res.json();\n    } catch (err) {\n      if (attempt === retries) throw err;\n      const wait = 2 ** (attempt - 1) * 100;\n      console.log(`Попытка ${attempt} провалена, ждём ${wait}мс...`);\n      await new Promise(r => setTimeout(r, wait));\n    }\n  }\n}\n\nasync function loadSequential(urls) {\n  const results = [];\n  for (const url of urls) {\n    const data = await fetch(url).then(r => r.json());\n    results.push(data);\n  }\n  return results;\n}\n\nasync function loadParallel(urls, concurrency = 3) {\n  const results = new Array(urls.length);\n  let nextIndex = 0;\n\n  async function worker() {\n    while (nextIndex < urls.length) {\n      const i = nextIndex++;\n      try {\n        results[i] = await fetch(urls[i]).then(r => r.json());\n      } catch (err) {\n        results[i] = { error: err.message };\n      }\n    }\n  }\n\n  await Promise.all(\n    Array.from({ length: Math.min(concurrency, urls.length) }, worker)\n  );\n  return results;\n}\n\nfunction withTimeout(asyncFn, ms) {\n  return async (...args) => {\n    return Promise.race([\n      asyncFn(...args),\n      new Promise((_, reject) =>\n        setTimeout(() => reject(new Error(`Таймаут ${ms}мс`)), ms)\n      )\n    ]);\n  };\n}\n\nconst safeFetch = withTimeout(\n  async (url) => fetch(url).then(r => r.json()),\n  5000\n);\n\nconst data = await safeFetch("/api/slow-endpoint").catch(err =>\n  console.log(err.message) // "Таймаут 5000мс"\n);',
      explanation: 'fetchWithRetry использует exponential backoff (100, 200, 400мс). loadSequential — for...of для строго последовательного выполнения. loadParallel — паттерн "worker pool" с общим nextIndex. withTimeout возвращает новую функцию-обёртку, не выполняет сразу.'
    }
  ]
}
