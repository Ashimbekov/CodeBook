export default {
  id: 59,
  title: 'Практикум — Hard задачи',
  description: 'Сложные задачи: динамическое программирование, графы, сложные алгоритмы и системный дизайн',
  lessons: [
    {
      id: 1,
      title: 'Задача о рюкзаке',
      type: 'practice',
      difficulty: 'hard',
      description: 'knapsack(items, capacity): найти максимальную стоимость предметов при ограничении веса рюкзака. Каждый предмет берём один раз (0/1 knapsack).',
      requirements: [
        'items = [{ weight, value }], capacity = число',
        'knapsack([{w:2,v:3},{w:3,v:4},{w:4,v:5}], 5) -> {value:7, items:[...]}',
        'Решение через динамическое программирование',
        'Восстановить набор предметов'
      ],
      solution: {
        code: 'function knapsack(items, capacity) {\n  const n = items.length;\n  // dp[i][w] = макс стоимость для i предметов и веса w\n  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));\n\n  for (let i = 1; i <= n; i++) {\n    const { weight: w, value: v } = items[i - 1];\n    for (let c = 0; c <= capacity; c++) {\n      dp[i][c] = dp[i - 1][c]; // Не берём предмет\n      if (c >= w) {\n        dp[i][c] = Math.max(dp[i][c], dp[i - 1][c - w] + v); // Берём\n      }\n    }\n  }\n\n  // Восстановление предметов\n  const selected = [];\n  let c = capacity;\n  for (let i = n; i > 0; i--) {\n    if (dp[i][c] !== dp[i - 1][c]) {\n      selected.unshift(items[i - 1]);\n      c -= items[i - 1].weight;\n    }\n  }\n\n  return { maxValue: dp[n][capacity], items: selected };\n}\n\nconst items = [\n  { weight: 2, value: 3, name: "Книга" },\n  { weight: 3, value: 4, name: "Ноутбук" },\n  { weight: 4, value: 5, name: "Камера" },\n  { weight: 5, value: 6, name: "Телефон" }\n];\n\nconsole.log(knapsack(items, 5));\n// { maxValue: 7, items: [{ weight:2,value:3,"Книга"}, {weight:3,value:4,"Ноутбук"}] }',
        language: 'javascript'
      }
    },
    {
      id: 2,
      title: 'Граф — обход и кратчайший путь',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте граф и алгоритмы: BFS (кратчайший путь без весов), DFS (поиск пути), Dijkstra (кратчайший путь с весами).',
      requirements: [
        'Graph с методами addEdge, addVertex',
        'bfs(start, end) -> массив вершин кратчайшего пути',
        'dfs(start, end) -> любой путь',
        'dijkstra(start, end) -> кратчайший взвешенный путь'
      ],
      solution: {
        code: 'class Graph {\n  constructor() { this.adjacency = new Map(); }\n\n  addVertex(v) { if (!this.adjacency.has(v)) this.adjacency.set(v, []); }\n\n  addEdge(v1, v2, weight = 1) {\n    this.addVertex(v1); this.addVertex(v2);\n    this.adjacency.get(v1).push({ node: v2, weight });\n    this.adjacency.get(v2).push({ node: v1, weight });\n  }\n\n  bfs(start, end) {\n    const visited = new Set([start]);\n    const queue = [[start, [start]]];\n    while (queue.length) {\n      const [node, path] = queue.shift();\n      if (node === end) return path;\n      for (const { node: neighbor } of this.adjacency.get(node) || []) {\n        if (!visited.has(neighbor)) {\n          visited.add(neighbor);\n          queue.push([neighbor, [...path, neighbor]]);\n        }\n      }\n    }\n    return null;\n  }\n\n  dijkstra(start, end) {\n    const distances = new Map();\n    const prev = new Map();\n    const visited = new Set();\n    const queue = new MinPQ(); // Упрощённо через Map\n\n    this.adjacency.forEach((_, v) => distances.set(v, Infinity));\n    distances.set(start, 0);\n\n    const allVertices = [...this.adjacency.keys()];\n    while (allVertices.some(v => !visited.has(v))) {\n      const current = allVertices\n        .filter(v => !visited.has(v))\n        .reduce((min, v) => distances.get(v) < distances.get(min) ? v : min);\n\n      if (distances.get(current) === Infinity || current === end) break;\n      visited.add(current);\n\n      for (const { node: neighbor, weight } of this.adjacency.get(current) || []) {\n        const newDist = distances.get(current) + weight;\n        if (newDist < distances.get(neighbor)) {\n          distances.set(neighbor, newDist);\n          prev.set(neighbor, current);\n        }\n      }\n    }\n\n    const path = [];\n    let curr = end;\n    while (curr) { path.unshift(curr); curr = prev.get(curr); }\n    return { path, distance: distances.get(end) };\n  }\n}\n\nconst g = new Graph();\ng.addEdge("A", "B", 4); g.addEdge("A", "C", 2);\ng.addEdge("B", "D", 3); g.addEdge("C", "D", 1);\ng.addEdge("C", "B", 1); g.addEdge("D", "E", 2);\n\nconsole.log(g.bfs("A", "E"));           // ["A","C","D","E"]\nconsole.log(g.dijkstra("A", "E"));      // { path:["A","C","D","E"], distance:5 }',
        language: 'javascript'
      }
    },
    {
      id: 3,
      title: 'Регулярные выражения: парсер',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте парсер математических выражений: parseExpression("2 + 3 * (4 - 1)") -> 11. Поддержка +, -, *, /, скобки.',
      requirements: [
        'parseExpression("2 + 3") -> 5',
        'parseExpression("2 + 3 * 4") -> 14 (приоритет *)',
        'parseExpression("(2 + 3) * 4") -> 20 (скобки)',
        'parseExpression("10 / 2 - 1") -> 4'
      ],
      solution: {
        code: '// Рекурсивный спуск\nfunction parseExpression(input) {\n  const tokens = tokenize(input);\n  let pos = 0;\n\n  function tokenize(str) {\n    return str.match(/\\d+\\.?\\d*|[+\\-*/()]/g) || [];\n  }\n\n  function peek() { return tokens[pos]; }\n  function consume() { return tokens[pos++]; }\n\n  function parseNum() {\n    const t = consume();\n    if (t === "(") {\n      const val = parseAddSub();\n      consume(); // ")"\n      return val;\n    }\n    return parseFloat(t);\n  }\n\n  function parseMulDiv() {\n    let left = parseNum();\n    while (peek() === "*" || peek() === "/") {\n      const op = consume();\n      const right = parseNum();\n      left = op === "*" ? left * right : left / right;\n    }\n    return left;\n  }\n\n  function parseAddSub() {\n    let left = parseMulDiv();\n    while (peek() === "+" || peek() === "-") {\n      const op = consume();\n      const right = parseMulDiv();\n      left = op === "+" ? left + right : left - right;\n    }\n    return left;\n  }\n\n  return parseAddSub();\n}\n\nconsole.log(parseExpression("2 + 3"));          // 5\nconsole.log(parseExpression("2 + 3 * 4"));     // 14\nconsole.log(parseExpression("(2 + 3) * 4"));   // 20\nconsole.log(parseExpression("10 / 2 - 1"));    // 4\nconsole.log(parseExpression("2 * (3 + 4) - 1")); // 13',
        language: 'javascript'
      }
    },
    {
      id: 4,
      title: 'Longest Common Subsequence',
      type: 'practice',
      difficulty: 'hard',
      description: 'lcs(str1, str2): найти наибольшую общую подпоследовательность двух строк. Динамическое программирование.',
      requirements: [
        'lcs("ABCBDAB", "BDCAB") -> "BCAB" (длина 4)',
        'Восстановить саму подпоследовательность',
        'Вернуть: { length, sequence }',
        'Применение: diff инструменты, git diff'
      ],
      solution: {
        code: 'function lcs(str1, str2) {\n  const m = str1.length;\n  const n = str2.length;\n\n  // Построить DP таблицу\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (str1[i - 1] === str2[j - 1]) {\n        dp[i][j] = dp[i - 1][j - 1] + 1;\n      } else {\n        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n      }\n    }\n  }\n\n  // Восстановление последовательности\n  let sequence = "";\n  let i = m, j = n;\n  while (i > 0 && j > 0) {\n    if (str1[i - 1] === str2[j - 1]) {\n      sequence = str1[i - 1] + sequence;\n      i--; j--;\n    } else if (dp[i - 1][j] > dp[i][j - 1]) {\n      i--;\n    } else {\n      j--;\n    }\n  }\n\n  return { length: dp[m][n], sequence };\n}\n\nconsole.log(lcs("ABCBDAB", "BDCAB"));\n// { length: 4, sequence: "BCAB" }\n\nconsole.log(lcs("XMJYAUZ", "MZJAWXU"));\n// { length: 4, sequence: "MJAU" }',
        language: 'javascript'
      }
    },
    {
      id: 5,
      title: 'Rate Limiter (Token Bucket)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Token Bucket алгоритм для rate limiting: токены добавляются с постоянной скоростью, каждый запрос тратит токен.',
      requirements: [
        'new TokenBucket({ capacity: 10, refillRate: 1 }) — 1 токен/сек',
        'bucket.consume() -> true если токен доступен',
        'Токены восстанавливаются плавно со временем',
        'Поддержка burst: capacity > refillRate'
      ],
      solution: {
        code: 'class TokenBucket {\n  constructor({ capacity, refillRate }) {\n    this.capacity = capacity;\n    this.refillRate = refillRate; // токенов в миллисекунду\n    this.tokens = capacity;       // Начинаем с полным ведром\n    this.lastRefill = Date.now();\n  }\n\n  _refill() {\n    const now = Date.now();\n    const elapsed = now - this.lastRefill;\n    const newTokens = elapsed * (this.refillRate / 1000);\n    this.tokens = Math.min(this.capacity, this.tokens + newTokens);\n    this.lastRefill = now;\n  }\n\n  consume(tokens = 1) {\n    this._refill();\n    if (this.tokens >= tokens) {\n      this.tokens -= tokens;\n      return true; // Разрешено\n    }\n    return false; // Отклонено\n  }\n\n  get available() {\n    this._refill();\n    return Math.floor(this.tokens);\n  }\n}\n\n// Использование для API\nconst buckets = new Map(); // IP -> bucket\n\nfunction rateLimitMiddleware(req, res, next) {\n  const ip = req.ip;\n  if (!buckets.has(ip)) {\n    buckets.set(ip, new TokenBucket({ capacity: 10, refillRate: 1 }));\n  }\n  const bucket = buckets.get(ip);\n  if (bucket.consume()) {\n    next();\n  } else {\n    res.status(429).json({\n      error: "Too Many Requests",\n      retryAfter: Math.ceil((1 - bucket.available) / 1)\n    });\n  }\n}\n\n// Тест\nconst bucket = new TokenBucket({ capacity: 5, refillRate: 2 });\nfor (let i = 0; i < 7; i++) {\n  console.log(`Запрос ${i + 1}: ${bucket.consume() ? "OK" : "REJECTED"} (${bucket.available} осталось)`);\n}',
        language: 'javascript'
      }
    },
    {
      id: 6,
      title: 'Диффы строк',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте упрощённый git diff: сравнивает две версии текста (массивы строк) и показывает добавленные/удалённые строки.',
      requirements: [
        'diff(oldLines, newLines) -> массив { type: "+" | "-" | "=", line }',
        'Использовать алгоритм LCS для поиска общих строк',
        'Формат вывода как у git diff',
        'Поддержка юникода'
      ],
      solution: {
        code: 'function diffLines(oldLines, newLines) {\n  // LCS для строк\n  const m = oldLines.length;\n  const n = newLines.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n\n  for (let i = 1; i <= m; i++)\n    for (let j = 1; j <= n; j++)\n      if (oldLines[i-1] === newLines[j-1]) dp[i][j] = dp[i-1][j-1] + 1;\n      else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n\n  // Восстановление diff\n  const result = [];\n  let i = m, j = n;\n\n  while (i > 0 || j > 0) {\n    if (i > 0 && j > 0 && oldLines[i-1] === newLines[j-1]) {\n      result.unshift({ type: "=", line: oldLines[i-1] });\n      i--; j--;\n    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {\n      result.unshift({ type: "+", line: newLines[j-1] });\n      j--;\n    } else {\n      result.unshift({ type: "-", line: oldLines[i-1] });\n      i--;\n    }\n  }\n\n  return result;\n}\n\nfunction formatDiff(diff) {\n  return diff.map(d => {\n    const prefix = d.type === "+" ? "+" : d.type === "-" ? "-" : " ";\n    return `${prefix} ${d.line}`;\n  }).join("\\n");\n}\n\nconst old = ["const x = 1;", "const y = 2;", "console.log(x + y);"];\nconst next = ["const x = 10;", "const z = 3;", "console.log(x + y);"];\n\nconst diff = diffLines(old, next);\nconsole.log(formatDiff(diff));\n// - const x = 1;\n// + const x = 10;\n// - const y = 2;\n// + const z = 3;\n//   console.log(x + y);',
        language: 'javascript'
      }
    },
    {
      id: 7,
      title: 'Immutable Store',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Redux-подобное иммутабельное хранилище: store.dispatch(action), subscribe(listener), getState(), middleware.',
      requirements: [
        'createStore(reducer, initialState, enhancer)',
        'dispatch(action) -> новый state через reducer',
        'subscribe(listener) -> функция отписки',
        'applyMiddleware(...middlewares) -> enhancer',
        'thunk middleware для async actions'
      ],
      solution: {
        code: 'function createStore(reducer, initialState, enhancer) {\n  if (typeof enhancer === "function") {\n    return enhancer(createStore)(reducer, initialState);\n  }\n\n  let state = initialState !== undefined ? initialState : reducer(undefined, { type: "@@INIT" });\n  const listeners = [];\n\n  return {\n    getState: () => state,\n\n    dispatch(action) {\n      state = reducer(state, action);\n      listeners.forEach(l => l());\n      return action;\n    },\n\n    subscribe(listener) {\n      listeners.push(listener);\n      return () => {\n        const idx = listeners.indexOf(listener);\n        if (idx >= 0) listeners.splice(idx, 1);\n      };\n    }\n  };\n}\n\nfunction applyMiddleware(...middlewares) {\n  return (createStore) => (reducer, initialState) => {\n    const store = createStore(reducer, initialState);\n    const chain = middlewares.map(mw => mw(store));\n    const dispatch = chain.reduceRight(\n      (next, mw) => mw(next),\n      store.dispatch\n    );\n    return { ...store, dispatch };\n  };\n}\n\n// Thunk middleware\nconst thunkMiddleware = (store) => (next) => (action) => {\n  if (typeof action === "function") {\n    return action(store.dispatch, store.getState);\n  }\n  return next(action);\n};\n\n// Использование\nconst counterReducer = (state = { count: 0 }, action) => {\n  switch (action.type) {\n    case "INCREMENT": return { ...state, count: state.count + 1 };\n    case "DECREMENT": return { ...state, count: state.count - 1 };\n    case "SET": return { ...state, count: action.payload };\n    default: return state;\n  }\n};\n\nconst store = createStore(counterReducer, undefined, applyMiddleware(thunkMiddleware));\nconst unsubscribe = store.subscribe(() => console.log("State:", store.getState()));\n\nstore.dispatch({ type: "INCREMENT" });\nstore.dispatch({ type: "INCREMENT" });\nstore.dispatch({ type: "SET", payload: 10 });\n\n// Async action через thunk\nstore.dispatch(async (dispatch) => {\n  await new Promise(r => setTimeout(r, 100));\n  dispatch({ type: "INCREMENT" });\n});\n\nunsubscribe();',
        language: 'javascript'
      }
    },
    {
      id: 8,
      title: 'Worker Thread Pool',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте пул Worker Threads для параллельных CPU-интенсивных задач в Node.js. Балансировка нагрузки и очередь задач.',
      requirements: [
        'new WorkerPool(workerFile, size) — создать N воркеров',
        'pool.exec(data) -> Promise с результатом',
        'Балансировка: задача идёт к свободному воркеру',
        'Очередь: если все воркеры заняты — задача ждёт',
        'pool.destroy() — завершить все воркеры'
      ],
      solution: {
        code: '// worker.js — файл воркера\n// const { workerData, parentPort } = require("worker_threads");\n// parentPort.on("message", (data) => {\n//   const result = heavyCalculation(data);\n//   parentPort.postMessage(result);\n// });\n\n// pool.js\nconst { Worker } = require("worker_threads");\n\nclass WorkerPool {\n  constructor(workerFile, poolSize = 4) {\n    this.workerFile = workerFile;\n    this.workers = [];\n    this.queue = [];\n    this.activeWorkers = new Map(); // worker -> { resolve, reject }\n\n    for (let i = 0; i < poolSize; i++) {\n      this._createWorker();\n    }\n  }\n\n  _createWorker() {\n    const worker = new Worker(this.workerFile);\n\n    worker.on("message", (result) => {\n      const { resolve } = this.activeWorkers.get(worker) || {};\n      this.activeWorkers.delete(worker);\n      if (resolve) resolve(result);\n      this._processNext(worker);\n    });\n\n    worker.on("error", (err) => {\n      const { reject } = this.activeWorkers.get(worker) || {};\n      this.activeWorkers.delete(worker);\n      if (reject) reject(err);\n      this._processNext(worker);\n    });\n\n    this.workers.push(worker);\n    return worker;\n  }\n\n  _getFreeWorker() {\n    return this.workers.find(w => !this.activeWorkers.has(w));\n  }\n\n  _processNext(worker) {\n    if (this.queue.length > 0) {\n      const { data, resolve, reject } = this.queue.shift();\n      this.activeWorkers.set(worker, { resolve, reject });\n      worker.postMessage(data);\n    }\n  }\n\n  exec(data) {\n    return new Promise((resolve, reject) => {\n      const freeWorker = this._getFreeWorker();\n      if (freeWorker) {\n        this.activeWorkers.set(freeWorker, { resolve, reject });\n        freeWorker.postMessage(data);\n      } else {\n        this.queue.push({ data, resolve, reject });\n      }\n    });\n  }\n\n  async destroy() {\n    await Promise.all(this.workers.map(w => w.terminate()));\n    this.workers = [];\n    this.queue = [];\n  }\n}\n\n// Использование\nconst pool = new WorkerPool("./worker.js", 4);\n\nconst tasks = Array.from({ length: 16 }, (_, i) => pool.exec({ n: i + 1 }));\nconst results = await Promise.all(tasks);\nconsole.log("Результаты:", results);\nawait pool.destroy();',
        language: 'javascript'
      }
    },
    {
      id: 9,
      title: 'JSON парсер',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте собственный JSON парсер без использования JSON.parse(). Поддержка: строки, числа, булевы, null, массивы, объекты.',
      requirements: [
        'parseJSON(\'{"name":"Алия","age":25}\') -> объект',
        'parseJSON(\'[1,2,3]\') -> массив',
        'parseJSON(\'{"nested":{"key":true}}\') -> вложенный объект',
        'Правильные сообщения об ошибках'
      ],
      solution: {
        code: 'function parseJSON(str) {\n  let pos = 0;\n\n  function skipWhitespace() {\n    while (pos < str.length && " \\t\\n\\r".includes(str[pos])) pos++;\n  }\n\n  function parseValue() {\n    skipWhitespace();\n    const ch = str[pos];\n    if (ch === "{") return parseObject();\n    if (ch === "[") return parseArray();\n    if (ch === "\\"") return parseString();\n    if (ch === "t") return parseKeyword("true", true);\n    if (ch === "f") return parseKeyword("false", false);\n    if (ch === "n") return parseKeyword("null", null);\n    if (ch === "-" || (ch >= "0" && ch <= "9")) return parseNumber();\n    throw new SyntaxError(`Неожиданный символ: ${ch} на позиции ${pos}`);\n  }\n\n  function parseObject() {\n    pos++; // "{"\n    const obj = {};\n    skipWhitespace();\n    if (str[pos] === "}") { pos++; return obj; }\n    while (true) {\n      const key = parseString();\n      skipWhitespace();\n      if (str[pos] !== ":") throw new SyntaxError("Ожидается \':\'");\n      pos++;\n      obj[key] = parseValue();\n      skipWhitespace();\n      if (str[pos] === "}") { pos++; return obj; }\n      if (str[pos] !== ",") throw new SyntaxError("Ожидается \',\' или \'}\'");\n      pos++;\n    }\n  }\n\n  function parseArray() {\n    pos++; // "["\n    const arr = [];\n    skipWhitespace();\n    if (str[pos] === "]") { pos++; return arr; }\n    while (true) {\n      arr.push(parseValue());\n      skipWhitespace();\n      if (str[pos] === "]") { pos++; return arr; }\n      if (str[pos] !== ",") throw new SyntaxError("Ожидается \',\'");\n      pos++;\n    }\n  }\n\n  function parseString() {\n    pos++; // открывающая кавычка\n    let result = "";\n    while (pos < str.length && str[pos] !== "\\"") {\n      if (str[pos] === "\\\\") {\n        pos++;\n        const escapes = { "\\"": "\\"", "\\\\": "\\\\", "/": "/", n: "\\n", r: "\\r", t: "\\t" };\n        result += escapes[str[pos]] || str[pos];\n      } else result += str[pos];\n      pos++;\n    }\n    pos++; // закрывающая кавычка\n    return result;\n  }\n\n  function parseNumber() {\n    const start = pos;\n    if (str[pos] === "-") pos++;\n    while (pos < str.length && str[pos] >= "0" && str[pos] <= "9") pos++;\n    if (str[pos] === ".") { pos++; while (str[pos] >= "0" && str[pos] <= "9") pos++; }\n    return parseFloat(str.slice(start, pos));\n  }\n\n  function parseKeyword(kw, value) {\n    if (str.slice(pos, pos + kw.length) !== kw) throw new SyntaxError(`Ожидается ${kw}`);\n    pos += kw.length;\n    return value;\n  }\n\n  const result = parseValue();\n  skipWhitespace();\n  if (pos !== str.length) throw new SyntaxError("Лишние символы в конце");\n  return result;\n}\n\nconsole.log(parseJSON(\'{"name":"Алия","age":25,"active":true}\'));\nconsole.log(parseJSON(\'[1,"два",null,{"key":false}]\'));',
        language: 'javascript'
      }
    },
    {
      id: 10,
      title: 'Промис с отменой и прогрессом',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте CancellablePromise: промис с поддержкой отмены (cancel()) и прогресса (onProgress). Совместим с обычными промисами.',
      requirements: [
        'const p = new CancellablePromise(executor)',
        'p.cancel() — отменить выполнение',
        'p.onProgress(callback) — callback(percent) при прогрессе',
        'executor получает: (resolve, reject, onCancel, reportProgress)',
        'Совместим с then/catch/finally'
      ],
      solution: {
        code: 'class CancellablePromise {\n  constructor(executor) {\n    this._isCancelled = false;\n    this._progressCallbacks = [];\n    this._cancelCallbacks = [];\n\n    this._promise = new Promise((resolve, reject) => {\n      const wrappedResolve = (value) => {\n        if (!this._isCancelled) resolve(value);\n      };\n      const wrappedReject = (reason) => {\n        if (!this._isCancelled) reject(reason);\n      };\n\n      const onCancel = (cb) => { this._cancelCallbacks.push(cb); };\n\n      const reportProgress = (percent) => {\n        if (!this._isCancelled) {\n          this._progressCallbacks.forEach(cb => cb(percent));\n        }\n      };\n\n      executor(wrappedResolve, wrappedReject, onCancel, reportProgress);\n    });\n  }\n\n  cancel() {\n    this._isCancelled = true;\n    this._cancelCallbacks.forEach(cb => cb());\n    return this;\n  }\n\n  onProgress(callback) {\n    this._progressCallbacks.push(callback);\n    return this;\n  }\n\n  then(onFulfilled, onRejected) {\n    return this._promise.then(onFulfilled, onRejected);\n  }\n\n  catch(onRejected) {\n    return this._promise.catch(onRejected);\n  }\n\n  finally(onFinally) {\n    return this._promise.finally(onFinally);\n  }\n}\n\n// Тест: загрузка файла с прогрессом\nconst download = new CancellablePromise((resolve, reject, onCancel, progress) => {\n  let percent = 0;\n  const interval = setInterval(() => {\n    percent += 20;\n    progress(percent);\n    if (percent >= 100) { clearInterval(interval); resolve("Файл загружен!"); }\n  }, 200);\n  onCancel(() => { clearInterval(interval); console.log("Загрузка отменена"); });\n});\n\ndownload.onProgress(p => console.log(`Прогресс: ${p}%`));\n\ndownload.then(result => console.log(result));\n\n// Отменить через 500ms\nsetTimeout(() => download.cancel(), 500);',
        language: 'javascript'
      }
    }
  ]
};
