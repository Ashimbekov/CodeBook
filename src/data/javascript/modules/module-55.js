export default {
  id: 55,
  title: 'Практикум — Async',
  description: 'Практические задачи по асинхронному JavaScript: Promise, async/await, параллельность, отмена запросов, retry',
  lessons: [
    {
      id: 1,
      title: 'Promise.all с обработкой ошибок',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте функцию allSettledCustom(promises): как Promise.allSettled — выполняет все промисы и возвращает результаты, даже если некоторые упали.',
      requirements: [
        'Возвращает массив { status: "fulfilled", value } или { status: "rejected", reason }',
        'Не останавливается при ошибке одного промиса',
        'allSettledCustom([Promise.resolve(1), Promise.reject("err"), Promise.resolve(3)])',
        'Не использовать Promise.allSettled напрямую'
      ],
      hint: 'Оберните каждый промис в .then(v => ({status:"fulfilled",value:v})).catch(e => ({status:"rejected",reason:e})). Затем используйте Promise.all() — теперь все "успешны" с точки зрения Promise.all.',
      expectedOutput: 'allSettledCustom([Promise.resolve(1), Promise.reject("err"), Promise.resolve(3)]) ->\n[{status:"fulfilled",value:1}, {status:"rejected",reason:"err"}, {status:"fulfilled",value:3}]',
      solution: 'async function allSettledCustom(promises) {\n  return Promise.all(\n    promises.map(p =>\n      Promise.resolve(p)\n        .then(value => ({ status: "fulfilled", value }))\n        .catch(reason => ({ status: "rejected", reason }))\n    )\n  );\n}\n\nconst results = await allSettledCustom([\n  Promise.resolve(1),\n  Promise.reject("ошибка"),\n  new Promise(resolve => setTimeout(() => resolve(3), 100))\n]);\n\nconsole.log(results);\n// [\n//   { status: "fulfilled", value: 1 },\n//   { status: "rejected", reason: "ошибка" },\n//   { status: "fulfilled", value: 3 }\n// ]\n\nconst fulfilled = results.filter(r => r.status === "fulfilled").map(r => r.value);\nconsole.log("Успешные:", fulfilled); // [1, 3]',
      explanation: 'Трюк: оборачиваем каждый промис в .then().catch() которые всегда резолвятся — никогда не реджектятся. Затем Promise.all ждёт все промисы и гарантированно получает все результаты. Promise.resolve(p) защищает от передачи не-промисов. Это точная реализация стандартного Promise.allSettled(). Паттерн полезен когда нужно выполнить несколько независимых операций и обработать каждый результат отдельно.'
    },
    {
      id: 2,
      title: 'Retry с экспоненциальным backoff',
      type: 'practice',
      difficulty: 'medium',
      description: 'Функция retry(fn, maxAttempts, baseDelay): повторяет async функцию при ошибке. Задержка растёт экспоненциально: 100ms, 200ms, 400ms...',
      requirements: [
        'retry(fetchData, 3, 100) — 3 попытки, начальная задержка 100ms',
        'Экспоненциальный backoff: delay = baseDelay * 2^attempt',
        'Jitter: случайность +-20% для предотвращения thundering herd',
        'Бросить последнюю ошибку если все попытки провалились'
      ],
      hint: 'Используйте рекурсию или цикл с async/await. Задержка: baseDelay * 2^attempt. При ошибке — await delay(задержка), затем повторите. После maxAttempts попыток — бросайте последнюю ошибку.',
      expectedOutput: 'retry(нестабильнаяФункция, 3, 100) -> успех на 2-й попытке\nПопытка 1: ошибка, ожидание 100мс\nПопытка 2: ошибка, ожидание 200мс\nПопытка 3: успех -> возвращает результат\nPосле 3 неудач -> бросает последнюю ошибку',
      solution: 'function sleep(ms) {\n  return new Promise(resolve => setTimeout(resolve, ms));\n}\n\nasync function retry(fn, maxAttempts = 3, baseDelay = 100) {\n  let lastError;\n\n  for (let attempt = 0; attempt < maxAttempts; attempt++) {\n    try {\n      return await fn();\n    } catch (err) {\n      lastError = err;\n\n      if (attempt < maxAttempts - 1) {\n        const delay = baseDelay * Math.pow(2, attempt);\n        // Jitter +-20%\n        const jitter = delay * 0.2 * (Math.random() * 2 - 1);\n        console.log(`Попытка ${attempt + 1} неудачна, ждём ${Math.round(delay + jitter)}ms`);\n        await sleep(delay + jitter);\n      }\n    }\n  }\n\n  throw lastError;\n}\n\n// Тест: функция которая падает 2 раза, потом работает\nlet callCount = 0;\nconst unreliableApi = async () => {\n  callCount++;\n  if (callCount < 3) throw new Error(`Ошибка попытки ${callCount}`);\n  return { data: "Успех!" };\n};\n\ntry {\n  const result = await retry(unreliableApi, 5, 50);\n  console.log("Результат:", result);\n} catch (err) {\n  console.error("Все попытки провалились:", err.message);\n}',
      explanation: 'Экспоненциальный backoff: delay = baseDelay * 2^attempt. Попытка 0 — 100ms, 1 — 200ms, 2 — 400ms. Это предотвращает перегрузку сервера при массовых ошибках. Jitter (случайное отклонение ±20%) решает проблему "thundering herd": если все клиенты ждут ровно одинаковое время, они могут снова атаковать сервер одновременно. lastError сохраняет последнюю ошибку чтобы пробросить её наружу после исчерпания попыток.'
    },
    {
      id: 3,
      title: 'Timeout для промисов',
      type: 'practice',
      difficulty: 'easy',
      description: 'Функция withTimeout(promise, ms): добавляет timeout к любому промису. Если промис не завершился за ms — отклоняет с TimeoutError.',
      requirements: [
        'withTimeout(fetch(url), 5000) — 5 секунд на запрос',
        'withTimeout(slowOperation(), 1000) -> TimeoutError если > 1000ms',
        'Если промис завершился раньше — вернуть его результат',
        'Очищать setTimeout при завершении'
      ],
      hint: 'Используйте Promise.race(). Создайте промис-таймер через new Promise((_, reject) => setTimeout(() => reject(new TimeoutError()), ms)). Первый завершившийся победит в race.',
      expectedOutput: 'withTimeout(fetchFast(), 1000) -> результат запроса\nwithTimeout(fetchSlow(), 100) -> TimeoutError: "Превышен таймаут 100мс"\nTimeoutError instanceof Error -> true',
      solution: 'class TimeoutError extends Error {\n  constructor(ms) {\n    super(`Операция превысила ${ms}ms`);\n    this.name = "TimeoutError";\n  }\n}\n\nfunction withTimeout(promise, ms) {\n  let timeoutId;\n\n  const timeoutPromise = new Promise((_, reject) => {\n    timeoutId = setTimeout(() => reject(new TimeoutError(ms)), ms);\n  });\n\n  return Promise.race([promise, timeoutPromise])\n    .finally(() => clearTimeout(timeoutId));\n}\n\n// Тест\nconst slowOp = new Promise(resolve => setTimeout(() => resolve("готово"), 2000));\n\ntry {\n  const result = await withTimeout(slowOp, 1000);\n  console.log(result);\n} catch (err) {\n  if (err instanceof TimeoutError) {\n    console.log("Timeout:", err.message);\n  }\n}\n\n// Быстрая операция — успех\nconst fastOp = Promise.resolve("быстро");\nconsole.log(await withTimeout(fastOp, 1000)); // "быстро"',
      explanation: 'Promise.race([promise, timeoutPromise]) завершается сразу как один из промисов завершится. Таймаут-промис настроен на reject через ms миллисекунд. finally(() => clearTimeout(timeoutId)) очищает таймер в любом случае — и при успехе и при ошибке — предотвращая утечки памяти. Кастомный класс TimeoutError (extends Error) позволяет отличать таймауты от других ошибок через instanceof. Важно: оригинальный промис продолжает выполняться — withTimeout только не ждёт его.'
    },
    {
      id: 4,
      title: 'Очередь задач',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте TaskQueue: очередь async задач с ограничением параллельности (concurrency). Не более N задач выполняются одновременно.',
      requirements: [
        'new TaskQueue({ concurrency: 3 })',
        'queue.add(asyncFn) — добавить задачу',
        'Выполнять максимум concurrency задач одновременно',
        'queue.onComplete — Promise на завершение всех задач'
      ],
      hint: 'Храните очередь pending задач и счётчик активных. При добавлении задачи: если active < concurrency — запускайте сразу, иначе добавляйте в очередь. По завершению задачи — берите следующую из очереди.',
      expectedOutput: 'queue = TaskQueue(2) // макс 2 параллельно\nqueue.add(task1, task2, task3, task4)\nTask1 и Task2 стартуют немедленно\nTask3 стартует когда завершится Task1 или Task2\nВсе 4 задачи выполнены',
      solution: 'class TaskQueue {\n  constructor({ concurrency = 3 } = {}) {\n    this.concurrency = concurrency;\n    this.running = 0;\n    this.queue = [];\n  }\n\n  add(task) {\n    return new Promise((resolve, reject) => {\n      this.queue.push({ task, resolve, reject });\n      this._run();\n    });\n  }\n\n  _run() {\n    while (this.running < this.concurrency && this.queue.length > 0) {\n      const { task, resolve, reject } = this.queue.shift();\n      this.running++;\n      task()\n        .then(resolve)\n        .catch(reject)\n        .finally(() => {\n          this.running--;\n          this._run(); // Запустить следующую задачу\n        });\n    }\n  }\n\n  async addAll(tasks) {\n    return Promise.all(tasks.map(t => this.add(t)));\n  }\n}\n\n// Тест\nconst queue = new TaskQueue({ concurrency: 2 });\n\nconst createTask = (id, delay) => () =>\n  new Promise(resolve => setTimeout(() => {\n    console.log(`Задача ${id} выполнена`);\n    resolve(id);\n  }, delay));\n\nconst results = await queue.addAll([\n  createTask(1, 300),\n  createTask(2, 100),\n  createTask(3, 200),\n  createTask(4, 150),\n  createTask(5, 50)\n]);\n\nconsole.log("Все выполнены:", results);',
      explanation: 'Паттерн: add() оборачивает задачу в промис и сохраняет resolve/reject в очередь. _run() запускает задачи пока не достигнут лимит concurrency. Ключевой момент: finally(() => { this.running--; this._run(); }) — когда задача завершается, освобождается слот и сразу запускается следующая из очереди. add() возвращает промис который резолвится когда конкретная задача завершится — удобно для ожидания конкретных результатов.'
    },
    {
      id: 5,
      title: 'Отмена fetch запросов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте cancellableFetch(url): fetch с поддержкой отмены. При повторном вызове отменяет предыдущий запрос. Применение: поиск при вводе.',
      requirements: [
        'Используйте AbortController для отмены',
        'Повторный вызов автоматически отменяет предыдущий',
        'Возвращает { data, cancel } или бросает AbortError',
        'Не логировать AbortError как ошибку'
      ],
      hint: 'Используйте AbortController. При каждом новом вызове cancellableFetch: создайте новый controller, отмените предыдущий (prevController.abort()), передайте signal в fetch({signal}). Обрабатывайте AbortError отдельно.',
      expectedOutput: 'cancellableFetch("/search?q=а") -> запрос начат\ncancellableFetch("/search?q=ал") -> предыдущий отменён, новый начат\nОтменённый fetch -> AbortError (не DOMException)\nПоследний запрос завершается успешно',
      solution: '// Функция которая отменяет предыдущий вызов\nfunction createCancellableFetch() {\n  let controller = null;\n\n  return async function cancellableFetch(url, options = {}) {\n    // Отменяем предыдущий запрос\n    if (controller) {\n      controller.abort();\n    }\n\n    controller = new AbortController();\n\n    try {\n      const response = await fetch(url, {\n        ...options,\n        signal: controller.signal\n      });\n\n      if (!response.ok) throw new Error(`HTTP ${response.status}`);\n      const data = await response.json();\n      controller = null;\n      return data;\n    } catch (err) {\n      if (err.name === "AbortError") {\n        return null; // Запрос отменён — не ошибка\n      }\n      throw err;\n    }\n  };\n}\n\n// Использование для поиска\nconst searchFetch = createCancellableFetch();\n\nconst searchInput = document.getElementById("search");\nsearchInput.addEventListener("input", async (e) => {\n  const query = e.target.value;\n  if (!query) return;\n\n  const results = await searchFetch(`/api/search?q=${query}`);\n  if (results) displayResults(results);\n  // null — запрос был отменён новым вводом\n});\n\nconsole.log("Cancellable fetch готов");',
      explanation: 'AbortController — стандартный Web API для отмены fetch-запросов. signal передаётся в опции fetch и связывает запрос с контроллером. При вызове abort() браузер прерывает запрос и fetch бросает ошибку с name === "AbortError". Фабричная функция createCancellableFetch хранит предыдущий контроллер в замыкании — при каждом новом вызове отменяет предыдущий запрос. Это классическая реализация "debounce для запросов".'
    },
    {
      id: 6,
      title: 'Cache с TTL',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте AsyncCache: кэш для async функций с TTL. Повторные вызовы с теми же аргументами в период TTL возвращают кэшированный результат.',
      requirements: [
        'cache.wrap(fn, ttl) — оборачивает функцию с кэшированием',
        'cache.get/set/delete/clear — прямой доступ',
        'Конкурентные вызовы к одному ключу: один запрос, все ждут его',
        'TTL в миллисекундах'
      ],
      hint: 'Для каждого кэшированного значения храните время создания. При обращении проверяйте: Date.now() - createdAt > ttl — если да, удаляйте и перезапрашивайте. Ключ кэша создавайте из аргументов через JSON.stringify.',
      expectedOutput: 'cache.get(fetchUser, [1]) -> первый вызов делает запрос\ncache.get(fetchUser, [1]) -> второй вызов за TTL -> из кэша (нет нового запроса)\nПосле истечения TTL -> делает новый запрос\ncache.clear() -> следующий вызов снова запрашивает данные',
      solution: 'class AsyncCache {\n  constructor() {\n    this.store = new Map();\n    this.pending = new Map(); // Для предотвращения дублирующих запросов\n  }\n\n  wrap(fn, ttl = 60000) {\n    return async (...args) => {\n      const key = JSON.stringify(args);\n\n      // Проверить кэш\n      const cached = this.store.get(key);\n      if (cached && Date.now() < cached.expires) {\n        return cached.value;\n      }\n\n      // Проверить pending — если уже выполняется, ждём\n      if (this.pending.has(key)) {\n        return this.pending.get(key);\n      }\n\n      // Запустить и кэшировать\n      const promise = fn(...args).then(value => {\n        this.store.set(key, { value, expires: Date.now() + ttl });\n        this.pending.delete(key);\n        return value;\n      }).catch(err => {\n        this.pending.delete(key);\n        throw err;\n      });\n\n      this.pending.set(key, promise);\n      return promise;\n    };\n  }\n\n  delete(key) { this.store.delete(key); }\n  clear() { this.store.clear(); }\n}\n\n// Тест\nconst cache = new AsyncCache();\nlet apiCalls = 0;\n\nconst fetchUser = cache.wrap(async (id) => {\n  apiCalls++;\n  await new Promise(r => setTimeout(r, 100));\n  return { id, name: `User ${id}` };\n}, 5000);\n\nconst [u1, u2, u3] = await Promise.all([\n  fetchUser(1), fetchUser(1), fetchUser(1) // 3 вызова, 1 запрос!\n]);\n\nconsole.log("API вызовов:", apiCalls); // 1\nconsole.log(u1 === u2);               // true (один объект)',
      explanation: 'Кэш TTL: хранит значение и время истечения (expires = now + ttl). pending Map решает проблему "cache stampede": если три запроса к fetchUser(1) придут одновременно до заполнения кэша, без pending все три сделают API-вызов. С pending: первый запрос создаёт промис и сохраняет его, остальные два просто ждут тот же промис. JSON.stringify(args) — ключ кэша из аргументов функции. При ошибке pending.delete гарантирует, что следующий вызов попробует снова.'
    },
    {
      id: 7,
      title: 'Параллельная обработка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Функция processInBatches(items, batchSize, asyncFn): обрабатывает массив элементов батчами с ограниченным параллелизмом.',
      requirements: [
        'processInBatches(users, 10, sendEmail) — по 10 параллельно',
        'Возвращает массив результатов в том же порядке что входной',
        'Обработка ошибок: возвращать { success, result/error } для каждого',
        'Прогресс: вызывать onProgress(completed, total)'
      ],
      hint: 'Разбейте items на батчи через slice(i, i+batchSize). Для каждого батча — Promise.all(batch.map(asyncFn)). Батчи обрабатываются последовательно: дождитесь завершения батча перед следующим.',
      expectedOutput: 'processInBatches([1..10], 3, asyncFn) ->\nБатч 1: [1,2,3] - параллельно\nБатч 2: [4,5,6] - после завершения батча 1\nБатч 3: [7,8,9] - после завершения батча 2\nБатч 4: [10] - последний\nВсе результаты в правильном порядке',
      solution: 'async function processInBatches(items, batchSize, asyncFn, onProgress) {\n  const results = new Array(items.length);\n  let completed = 0;\n\n  for (let i = 0; i < items.length; i += batchSize) {\n    const batch = items.slice(i, i + batchSize);\n    const batchResults = await Promise.all(\n      batch.map(async (item, idx) => {\n        try {\n          const result = await asyncFn(item);\n          return { success: true, result };\n        } catch (error) {\n          return { success: false, error: error.message };\n        }\n      })\n    );\n\n    batchResults.forEach((result, idx) => {\n      results[i + idx] = result;\n    });\n\n    completed += batch.length;\n    if (onProgress) onProgress(completed, items.length);\n    console.log(`Прогресс: ${completed}/${items.length}`);\n  }\n\n  return results;\n}\n\n// Тест\nconst emails = Array.from({ length: 25 }, (_, i) => `user${i}@test.com`);\n\nconst sendEmail = async (email) => {\n  await new Promise(r => setTimeout(r, 50));\n  if (Math.random() < 0.1) throw new Error("Ошибка отправки");\n  return `Отправлено: ${email}`;\n};\n\nconst results = await processInBatches(emails, 5, sendEmail,\n  (done, total) => console.log(`${done}/${total}`)\n);\n\nconst successful = results.filter(r => r.success).length;\nconsole.log(`Успешно: ${successful}/${emails.length}`);',
      explanation: 'Батчевая обработка балансирует между скоростью (параллельность внутри батча) и нагрузкой на сервер (ограничение числа одновременных запросов). for цикл с шагом batchSize делит массив на группы. Promise.all внутри батча — параллельная обработка элементов батча. await перед следующей итерацией — последовательная обработка батчей. try/catch для каждого элемента гарантирует что ошибка одного не прерывает весь батч. Порядок результатов сохраняется через индекс i + idx.'
    },
    {
      id: 8,
      title: 'Event-driven архитектура',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте простую event-driven систему для обработки заказов: создание -> валидация -> оплата -> уведомление через события.',
      requirements: [
        'OrderProcessor использует EventEmitter',
        'process(order) -> последовательная обработка через события',
        'Каждый шаг эмитирует событие о результате',
        'Обработка ошибок: событие "error" с контекстом',
        'Результат: Promise на завершение обработки'
      ],
      hint: 'Создайте EventBus с on/emit методами. Каждый этап (валидация, оплата, уведомление) подписывается на своё событие и при завершении эмитирует следующее. Ошибка на любом этапе эмитирует "order:failed".',
      expectedOutput: 'eventBus.emit("order:created", { id: 1, amount: 100 })\n-> "order:validated" -> "order:paid" -> "order:notified"\nЛог: "Заказ #1 создан" -> "Заказ #1 проверен" -> "Оплата 100₸" -> "Уведомление отправлено"\nПри ошибке оплаты -> "order:failed" { reason: "Недостаточно средств" }',
      solution: 'const EventEmitter = require("events");\n\nclass OrderProcessor extends EventEmitter {\n  async process(order) {\n    return new Promise(async (resolve, reject) => {\n      try {\n        this.emit("processing:started", order);\n\n        // Валидация\n        this.emit("processing:validate", order);\n        await this.validate(order);\n        this.emit("processing:validated", order);\n\n        // Оплата\n        this.emit("processing:payment", order);\n        const payment = await this.processPayment(order);\n        this.emit("processing:paid", { order, payment });\n\n        // Уведомление\n        await this.sendNotification(order);\n        this.emit("processing:completed", { order, payment });\n\n        resolve({ order, payment, status: "completed" });\n      } catch (err) {\n        this.emit("processing:error", { order, error: err });\n        reject(err);\n      }\n    });\n  }\n\n  async validate(order) {\n    if (!order.items?.length) throw new Error("Нет товаров в заказе");\n    if (!order.customerId) throw new Error("Нет ID покупателя");\n  }\n\n  async processPayment(order) {\n    await new Promise(r => setTimeout(r, 100));\n    return { transactionId: `TXN-${Date.now()}`, amount: order.total };\n  }\n\n  async sendNotification(order) {\n    console.log(`Email уведомление для заказа #${order.id}`);\n  }\n}\n\n// Использование\nconst processor = new OrderProcessor();\nprocessor.on("processing:started", o => console.log("Начало:", o.id));\nprocessor.on("processing:paid", ({ payment }) => console.log("Оплачено:", payment.transactionId));\nprocessor.on("processing:completed", () => console.log("Заказ обработан!"));\nprocessor.on("processing:error", ({ error }) => console.error("Ошибка:", error.message));\n\nconst result = await processor.process({\n  id: "ORD-001",\n  customerId: 123,\n  items: [{ name: "Книга", price: 1500 }],\n  total: 1500\n});\nconsole.log(result);',
      explanation: 'Event-driven архитектура разделяет "что происходит" от "как на это реагировать". OrderProcessor эмитирует события на каждом шаге — внешний код может подписаться на нужные без изменения процессора. Namespace событий (processing:started, processing:paid) с двоеточием — соглашение для группировки. extends EventEmitter даёт полный API: on, once, emit, off. emit синхронный — обработчики вызываются мгновенно в порядке подписки.'
    },
    {
      id: 9,
      title: 'Polling с backoff',
      type: 'practice',
      difficulty: 'medium',
      description: 'Функция poll(fn, condition, options): опрашивает async функцию пока condition не вернёт true. С настраиваемым интервалом и таймаутом.',
      requirements: [
        'poll(getJobStatus, status => status === "done", { interval: 1000, timeout: 30000 })',
        'Возвращает последний результат когда condition выполнено',
        'Бросает TimeoutError если timeout истёк',
        'Поддержка exponent: true для экспоненциального интервала'
      ],
      hint: 'Используйте цикл do...while с await delay(interval) между итерациями. Экспоненциальный backoff: interval = Math.min(interval * factor, maxInterval). Проверяйте общее время через Date.now() - startTime > timeout.',
      expectedOutput: 'poll(checkStatus, s => s === "ready", { interval: 500, timeout: 5000 }) ->\nПопытка 1: "pending"\nПопытка 2 (через 500мс): "pending"\nПопытка 3 (через 500мс): "ready" -> успех\nПри timeout -> TimeoutError',
      solution: 'function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }\n\nasync function poll(fn, condition, { interval = 1000, timeout = 30000, exponential = false } = {}) {\n  const startTime = Date.now();\n  let attempt = 0;\n\n  while (true) {\n    if (Date.now() - startTime > timeout) {\n      throw new Error(`Polling timeout после ${timeout}ms`);\n    }\n\n    const result = await fn();\n\n    if (condition(result)) return result;\n\n    const delay = exponential\n      ? Math.min(interval * Math.pow(2, attempt), timeout / 3)\n      : interval;\n\n    attempt++;\n    console.log(`Попытка ${attempt}, ждём ${delay}ms`);\n    await sleep(delay);\n  }\n}\n\n// Тест: симуляция долгой задачи\nlet jobAttempt = 0;\nconst getJobStatus = async () => {\n  jobAttempt++;\n  if (jobAttempt < 4) return { status: "processing", progress: jobAttempt * 25 };\n  return { status: "done", result: "Файл обработан" };\n};\n\nconst final = await poll(\n  getJobStatus,\n  res => res.status === "done",\n  { interval: 200, timeout: 10000 }\n);\n\nconsole.log("Готово:", final.result);',
      explanation: 'Polling — паттерн для ожидания готовности асинхронного процесса. Функция condition отделяет логику проверки от логики опроса — poll универсален. Проверка таймаута в начале цикла: если уже превысили — бросаем ошибку без лишнего вызова fn. Экспоненциальный режим с Math.min(..., timeout/3) ограничивает максимальную задержку третью таймаута. Применяется для ожидания: обработки файлов, статуса платежей, сборки CI/CD.'
    },
    {
      id: 10,
      title: 'Async генератор пагинации',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте async генератор paginate(fetchFn, options): итерирует по всем страницам API автоматически. Используйте for await...of.',
      requirements: [
        'async function* paginate(fetchPage) — генератор',
        'Автоматически запрашивает следующую страницу',
        'for await (const page of paginate(fn)) { ... }',
        'Остановиться когда нет следующей страницы'
      ],
      hint: 'Async генератор: async function* paginate(). Используйте while(true) с break при пустой странице. yield данные текущей страницы, затем увеличивайте page. Вызов for await...of автоматически управляет итерацией.',
      expectedOutput: 'for await (const page of paginate(fetchUsers, { pageSize: 10 })) -> итерирует по всем страницам\nСтраница 1: 10 записей\nСтраница 2: 10 записей\nСтраница 3: 5 записей\nИтерация завершена автоматически',
      solution: 'async function* paginate(fetchPage, startPage = 1) {\n  let page = startPage;\n  let hasNext = true;\n\n  while (hasNext) {\n    const response = await fetchPage(page);\n    yield response.data;\n\n    hasNext = response.hasNext || page < response.totalPages;\n    page++;\n  }\n}\n\n// Симуляция API\nasync function fetchUsers(page) {\n  await new Promise(r => setTimeout(r, 50));\n  const limit = 3;\n  const total = 10;\n  const start = (page - 1) * limit;\n  const data = Array.from({ length: Math.min(limit, total - start) }, (_, i) => ({\n    id: start + i + 1,\n    name: `User ${start + i + 1}`\n  }));\n  return {\n    data,\n    page,\n    totalPages: Math.ceil(total / limit),\n    hasNext: start + limit < total\n  };\n}\n\n// Использование\nconst allUsers = [];\nfor await (const pageData of paginate(fetchUsers)) {\n  console.log(`Страница: ${pageData.length} пользователей`);\n  allUsers.push(...pageData);\n}\nconsole.log("Всего:", allUsers.length); // 10',
      explanation: 'async function* — асинхронный генератор: функция которая может yield значения и await промисы. for await...of итерирует асинхронный итерируемый объект — ждёт каждый yield. Это элегантнее чем вручную писать while с накоплением результатов. Ленивость: следующая страница запрашивается только после обработки текущей. Применяется для пагинации API, потоковой обработки больших данных, SSE событий.'
    }
  ]
};
