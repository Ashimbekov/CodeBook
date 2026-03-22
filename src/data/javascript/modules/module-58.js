export default {
  id: 58,
  title: 'Практикум — Medium задачи',
  description: 'Задачи среднего уровня: структуры данных, алгоритмы, работа с DOM, паттерны',
  lessons: [
    {
      id: 1,
      title: 'LRU Кэш',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте LRU (Least Recently Used) кэш с заданным размером. При переполнении удаляет наименее используемый элемент.',
      requirements: [
        'new LRUCache(capacity)',
        'get(key) -> value или -1',
        'put(key, value) — добавить/обновить',
        'Обе операции O(1)',
        'Используйте Map (сохраняет порядок вставки)'
      ],
      solution: {
        code: 'class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map(); // Сохраняет порядок вставки\n  }\n\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    // Переместить в конец (наиболее свежий)\n    const value = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, value);\n    return value;\n  }\n\n  put(key, value) {\n    if (this.cache.has(key)) this.cache.delete(key);\n    else if (this.cache.size >= this.capacity) {\n      // Удалить первый (наименее используемый)\n      this.cache.delete(this.cache.keys().next().value);\n    }\n    this.cache.set(key, value);\n  }\n}\n\nconst cache = new LRUCache(3);\ncache.put(1, "a"); // {1:a}\ncache.put(2, "b"); // {1:a, 2:b}\ncache.put(3, "c"); // {1:a, 2:b, 3:c}\ncache.get(1);      // Использовали 1 -> {2:b, 3:c, 1:a}\ncache.put(4, "d"); // Выбросить 2 -> {3:c, 1:a, 4:d}\nconsole.log(cache.get(2)); // -1 (удалён)',
        language: 'javascript'
      }
    },
    {
      id: 2,
      title: 'Связный список',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте двусвязный список с методами: push, pop, shift, unshift, insertAt, removeAt, toArray.',
      requirements: [
        'push/pop — конец списка',
        'shift/unshift — начало списка',
        'insertAt(index, value) — вставка по индексу',
        'removeAt(index) — удаление по индексу',
        'toArray() -> обычный массив'
      ],
      solution: {
        code: 'class Node {\n  constructor(value) {\n    this.value = value;\n    this.next = null;\n    this.prev = null;\n  }\n}\n\nclass DoublyLinkedList {\n  constructor() {\n    this.head = null;\n    this.tail = null;\n    this.length = 0;\n  }\n\n  push(value) {\n    const node = new Node(value);\n    if (!this.tail) { this.head = this.tail = node; }\n    else { node.prev = this.tail; this.tail.next = node; this.tail = node; }\n    this.length++;\n    return this;\n  }\n\n  pop() {\n    if (!this.tail) return undefined;\n    const value = this.tail.value;\n    if (this.head === this.tail) { this.head = this.tail = null; }\n    else { this.tail = this.tail.prev; this.tail.next = null; }\n    this.length--;\n    return value;\n  }\n\n  unshift(value) {\n    const node = new Node(value);\n    if (!this.head) { this.head = this.tail = node; }\n    else { node.next = this.head; this.head.prev = node; this.head = node; }\n    this.length++;\n    return this;\n  }\n\n  shift() {\n    if (!this.head) return undefined;\n    const value = this.head.value;\n    if (this.head === this.tail) { this.head = this.tail = null; }\n    else { this.head = this.head.next; this.head.prev = null; }\n    this.length--;\n    return value;\n  }\n\n  getNode(index) {\n    if (index < 0 || index >= this.length) return null;\n    let current, i;\n    if (index < this.length / 2) { current = this.head; for (i = 0; i < index; i++) current = current.next; }\n    else { current = this.tail; for (i = this.length - 1; i > index; i--) current = current.prev; }\n    return current;\n  }\n\n  toArray() {\n    const arr = [];\n    let current = this.head;\n    while (current) { arr.push(current.value); current = current.next; }\n    return arr;\n  }\n}\n\nconst list = new DoublyLinkedList();\nlist.push(1).push(2).push(3).unshift(0);\nconsole.log(list.toArray()); // [0, 1, 2, 3]\nconsole.log(list.pop());     // 3\nconsole.log(list.shift());   // 0\nconsole.log(list.toArray()); // [1, 2]',
        language: 'javascript'
      }
    },
    {
      id: 3,
      title: 'Разворот связного списка',
      type: 'practice',
      difficulty: 'medium',
      description: 'reverseLinkedList(head): развернуть односвязный список. Итеративно и рекурсивно. Без создания нового списка — изменить указатели.',
      requirements: [
        '1->2->3->4 становится 4->3->2->1',
        'Итеративная реализация O(n) время O(1) память',
        'Рекурсивная реализация',
        'Вернуть новую голову'
      ],
      solution: {
        code: 'class ListNode {\n  constructor(val) { this.val = val; this.next = null; }\n}\n\n// Итеративно\nfunction reverseList(head) {\n  let prev = null;\n  let curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev; // Новая голова\n}\n\n// Рекурсивно\nfunction reverseListRecursive(head) {\n  if (!head || !head.next) return head;\n  const newHead = reverseListRecursive(head.next);\n  head.next.next = head;\n  head.next = null;\n  return newHead;\n}\n\n// Вспомогательные функции\nconst toList = (arr) => {\n  const dummy = new ListNode(0);\n  let curr = dummy;\n  arr.forEach(v => { curr.next = new ListNode(v); curr = curr.next; });\n  return dummy.next;\n};\n\nconst toArray = (head) => {\n  const arr = [];\n  while (head) { arr.push(head.val); head = head.next; }\n  return arr;\n};\n\nconst list = toList([1, 2, 3, 4, 5]);\nconsole.log(toArray(reverseList(list))); // [5, 4, 3, 2, 1]',
        language: 'javascript'
      }
    },
    {
      id: 4,
      title: 'Бинарное дерево поиска',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте BST (Binary Search Tree): insert, search, inOrder обход (даёт отсортированный массив), findMin/findMax.',
      requirements: [
        'insert(value) — добавить узел',
        'search(value) -> true/false',
        'inOrder() -> отсортированный массив',
        'findMin() / findMax()',
        'delete(value) — удалить узел'
      ],
      solution: {
        code: 'class BSTNode {\n  constructor(value) { this.value = value; this.left = null; this.right = null; }\n}\n\nclass BST {\n  constructor() { this.root = null; }\n\n  insert(value) {\n    const node = new BSTNode(value);\n    if (!this.root) { this.root = node; return this; }\n    let curr = this.root;\n    while (true) {\n      if (value < curr.value) {\n        if (!curr.left) { curr.left = node; return this; }\n        curr = curr.left;\n      } else {\n        if (!curr.right) { curr.right = node; return this; }\n        curr = curr.right;\n      }\n    }\n  }\n\n  search(value) {\n    let curr = this.root;\n    while (curr) {\n      if (value === curr.value) return true;\n      curr = value < curr.value ? curr.left : curr.right;\n    }\n    return false;\n  }\n\n  inOrder(node = this.root, result = []) {\n    if (!node) return result;\n    this.inOrder(node.left, result);\n    result.push(node.value);\n    this.inOrder(node.right, result);\n    return result;\n  }\n\n  findMin(node = this.root) {\n    while (node?.left) node = node.left;\n    return node?.value;\n  }\n\n  findMax(node = this.root) {\n    while (node?.right) node = node.right;\n    return node?.value;\n  }\n}\n\nconst bst = new BST();\n[5, 3, 7, 1, 4, 6, 8].forEach(v => bst.insert(v));\nconsole.log(bst.inOrder()); // [1, 3, 4, 5, 6, 7, 8]\nconsole.log(bst.search(4)); // true\nconsole.log(bst.findMin()); // 1\nconsole.log(bst.findMax()); // 8',
        language: 'javascript'
      }
    },
    {
      id: 5,
      title: 'Алгоритм быстрой сортировки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте quickSort(arr): сортировка разделением. Также реализуйте mergeSort. Оба алгоритма не мутируют исходный массив.',
      requirements: [
        'quickSort([3,1,4,1,5,9,2,6]) -> [1,1,2,3,4,5,6,9]',
        'mergeSort([5,2,8,1,9]) -> [1,2,5,8,9]',
        'Не мутировать входной массив',
        'quickSort: O(n log n) в среднем'
      ],
      solution: {
        code: 'function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[Math.floor(arr.length / 2)];\n  const left = arr.filter(x => x < pivot);\n  const middle = arr.filter(x => x === pivot);\n  const right = arr.filter(x => x > pivot);\n  return [...quickSort(left), ...middle, ...quickSort(right)];\n}\n\nfunction mergeSort(arr) {\n  if (arr.length <= 1) return arr;\n  const mid = Math.floor(arr.length / 2);\n  const left = mergeSort(arr.slice(0, mid));\n  const right = mergeSort(arr.slice(mid));\n  return merge(left, right);\n}\n\nfunction merge(left, right) {\n  const result = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) result.push(left[i++]);\n    else result.push(right[j++]);\n  }\n  return [...result, ...left.slice(i), ...right.slice(j)];\n}\n\nconst arr = [3, 1, 4, 1, 5, 9, 2, 6];\nconsole.log(quickSort(arr));  // [1, 1, 2, 3, 4, 5, 6, 9]\nconsole.log(mergeSort(arr));  // [1, 1, 2, 3, 4, 5, 6, 9]\nconsole.log(arr);             // [3, 1, 4, 1, 5, 9, 2, 6] — не изменился',
        language: 'javascript'
      }
    },
    {
      id: 6,
      title: 'Memoized рекурсия',
      type: 'practice',
      difficulty: 'medium',
      description: 'Решите задачу "лестница": сколько способов подняться на n ступенек, если можно делать шаги 1 или 2. Используйте мемоизацию.',
      requirements: [
        'climbStairs(1) -> 1',
        'climbStairs(2) -> 2',
        'climbStairs(5) -> 8',
        'climbStairs(45) -> быстро! (с мемо)',
        'Объяснить почему это Фибоначчи'
      ],
      solution: {
        code: '// С мемоизацией\nfunction climbStairs(n, memo = new Map()) {\n  if (n <= 1) return 1;\n  if (memo.has(n)) return memo.get(n);\n  // Способы = (шаги с позиции n-1) + (шаги с позиции n-2)\n  // Это последовательность Фибоначчи!\n  const result = climbStairs(n - 1, memo) + climbStairs(n - 2, memo);\n  memo.set(n, result);\n  return result;\n}\n\n// Динамическое программирование\nfunction climbStairsDP(n) {\n  if (n <= 1) return 1;\n  let prev2 = 1, prev1 = 1;\n  for (let i = 2; i <= n; i++) {\n    [prev2, prev1] = [prev1, prev1 + prev2];\n  }\n  return prev1;\n}\n\nconsole.log(climbStairs(5));   // 8\nconsole.log(climbStairs(45));  // 1836311903\nconsole.log(climbStairsDP(10)); // 89\n\n// Обобщение: k шагов (1..k)\nfunction climbKStairs(n, k, memo = new Map()) {\n  if (n <= 0) return 1;\n  if (memo.has(n)) return memo.get(n);\n  let ways = 0;\n  for (let i = 1; i <= Math.min(k, n); i++) ways += climbKStairs(n - i, k, memo);\n  memo.set(n, ways);\n  return ways;\n}\n\nconsole.log(climbKStairs(5, 3)); // Шаги 1,2,3 -> 13 способов',
        language: 'javascript'
      }
    },
    {
      id: 7,
      title: 'Генератор уникальных ID',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте несколько генераторов ID: UUID v4, NanoID (URL-safe), Snowflake ID (сортируемый по времени).',
      requirements: [
        'generateUUID() -> "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"',
        'generateNanoID(size=21) -> URL-safe строка',
        'generateSnowflake() -> числовой ID с временем',
        'Не использовать внешние библиотеки'
      ],
      solution: {
        code: '// UUID v4\nfunction generateUUID() {\n  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {\n    const r = Math.random() * 16 | 0;\n    const v = c === "x" ? r : (r & 0x3 | 0x8);\n    return v.toString(16);\n  });\n}\n\n// NanoID\nfunction generateNanoID(size = 21) {\n  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";\n  return Array.from({ length: size }, () =>\n    alphabet[Math.floor(Math.random() * alphabet.length)]\n  ).join("");\n}\n\n// Snowflake ID (упрощённый)\nconst EPOCH = 1609459200000; // 2021-01-01\nlet snowflakeSequence = 0;\n\nfunction generateSnowflake(machineId = 1) {\n  const timestamp = BigInt(Date.now() - EPOCH);\n  const machine = BigInt(machineId & 0x3FF);\n  const sequence = BigInt(snowflakeSequence++ & 0xFFF);\n  return String((timestamp << 22n) | (machine << 12n) | sequence);\n}\n\nconsole.log(generateUUID());\n// "f47ac10b-58cc-4372-a567-0e02b2c3d479"\n\nconsole.log(generateNanoID());\n// "V1StGXR8_Z5jdHi6B-myT"\n\nconsole.log(generateSnowflake());\n// "1641386563000000001"',
        language: 'javascript'
      }
    },
    {
      id: 8,
      title: 'Система событий с приоритетами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Расширьте EventEmitter: добавьте приоритеты обработчиков (число), wildcard подписки (*) и middleware перехватчики.',
      requirements: [
        'emitter.on("event", handler, { priority: 10 }) — приоритет',
        'Обработчики с высшим приоритетом вызываются первыми',
        'emitter.on("*", handler) — wildcard для всех событий',
        'emitter.use(middleware) — middleware перехват'
      ],
      solution: {
        code: 'class PriorityEventEmitter {\n  constructor() {\n    this._listeners = {};\n    this._wildcards = [];\n    this._middleware = [];\n  }\n\n  use(middleware) {\n    this._middleware.push(middleware);\n    return this;\n  }\n\n  on(event, handler, { priority = 0, once = false } = {}) {\n    if (event === "*") {\n      this._wildcards.push({ handler, priority, once });\n      this._wildcards.sort((a, b) => b.priority - a.priority);\n      return this;\n    }\n    if (!this._listeners[event]) this._listeners[event] = [];\n    this._listeners[event].push({ handler, priority, once });\n    this._listeners[event].sort((a, b) => b.priority - a.priority);\n    return this;\n  }\n\n  once(event, handler, opts = {}) {\n    return this.on(event, handler, { ...opts, once: true });\n  }\n\n  emit(event, ...args) {\n    // Применить middleware\n    let context = { event, args, stopped: false };\n    for (const mw of this._middleware) {\n      mw(context);\n      if (context.stopped) return;\n    }\n\n    const listeners = [...(this._listeners[event] || []), ...this._wildcards];\n    for (const { handler, once } of listeners) {\n      handler(event, ...context.args);\n    }\n\n    // Удалить once\n    if (this._listeners[event]) {\n      this._listeners[event] = this._listeners[event].filter(l => !l.once);\n    }\n    return this;\n  }\n}\n\nconst emitter = new PriorityEventEmitter();\n\nemitter.use((ctx) => {\n  console.log(`[middleware] Событие: ${ctx.event}`);\n});\n\nemitter.on("order", (e, data) => console.log("Обычный:", data.id), { priority: 0 });\nemitter.on("order", (e, data) => console.log("Приоритетный:", data.id), { priority: 10 });\nemitter.on("*", (e, data) => console.log(`Wildcard: ${e}`));\n\nemitter.emit("order", { id: 42 });',
        language: 'javascript'
      }
    },
    {
      id: 9,
      title: 'Шаблонизатор',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте простой шаблонизатор: template(str, data) заменяет {{key}} на значения из data. Поддержка вложенных ключей и условий {{#if}}...{{/if}}.',
      requirements: [
        'template("Hello {{name}}!", { name: "Алия" }) -> "Hello Алия!"',
        'template("{{user.city}}", { user: { city: "Алматы" } }) -> "Алматы"',
        'Условные блоки: {{#if condition}}текст{{/if}}',
        'Циклы: {{#each items}}{{name}}{{/each}} — необязательно'
      ],
      solution: {
        code: 'function template(str, data) {\n  // Условные блоки\n  str = str.replace(/\\{\\{#if (\\w+)\\}\\}([\\s\\S]*?)\\{\\{\\/if\\}\\}/g, (_, key, content) => {\n    return data[key] ? content : "";\n  });\n\n  // Переменные с вложенными ключами\n  str = str.replace(/\\{\\{([\\w.]+)\\}\\}/g, (match, path) => {\n    const value = path.split(".").reduce((obj, key) => obj?.[key], data);\n    return value !== undefined ? String(value) : "";\n  });\n\n  return str;\n}\n\nconsole.log(template("Hello {{name}}!", { name: "Алия" }));\n// "Hello Алия!"\n\nconsole.log(template("{{user.city}}, {{user.country}}", { user: { city: "Алматы", country: "Казахстан" } }));\n// "Алматы, Казахстан"\n\nconsole.log(template(\n  "{{#if isAdmin}}Привет, администратор {{name}}!{{/if}}",\n  { isAdmin: true, name: "Берик" }\n));\n// "Привет, администратор Берик!"\n\nconsole.log(template(\n  "{{#if isAdmin}}Скрытый текст{{/if}}",\n  { isAdmin: false }\n));\n// ""',
        language: 'javascript'
      }
    },
    {
      id: 10,
      title: 'Observable State',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте реактивное хранилище состояния: при изменении свойств автоматически вызываются подписчики. Похоже на Vue reactive.',
      requirements: [
        'const state = observable({ count: 0, name: "Алия" })',
        'watch(state, "count", (newVal, oldVal) => ...)',
        'state.count++ — триггерит подписчиков',
        'Поддержка вложенных объектов',
        'Реализовать через Proxy'
      ],
      solution: {
        code: 'function observable(obj) {\n  const listeners = new Map();\n\n  function on(key, callback) {\n    if (!listeners.has(key)) listeners.set(key, []);\n    listeners.get(key).push(callback);\n  }\n\n  function notify(key, newVal, oldVal) {\n    (listeners.get(key) || []).forEach(cb => cb(newVal, oldVal));\n    (listeners.get("*") || []).forEach(cb => cb(key, newVal, oldVal));\n  }\n\n  const proxy = new Proxy(obj, {\n    set(target, key, value) {\n      const oldVal = target[key];\n      target[key] = value;\n      if (oldVal !== value) notify(key, value, oldVal);\n      return true;\n    },\n    get(target, key) {\n      if (key === "$on") return on;\n      return target[key];\n    }\n  });\n\n  return proxy;\n}\n\nconst state = observable({ count: 0, name: "Алия" });\n\nstate.$on("count", (newVal, oldVal) => {\n  console.log(`count: ${oldVal} -> ${newVal}`);\n});\n\nstate.$on("*", (key, newVal) => {\n  console.log(`Изменено "${key}": ${newVal}`);\n});\n\nstate.count++;           // count: 0 -> 1\nstate.count = 5;         // count: 1 -> 5\nstate.name = "Берик";    // name: Берик',
        language: 'javascript'
      }
    }
  ]
};
