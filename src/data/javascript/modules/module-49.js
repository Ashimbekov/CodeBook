export default {
  id: 49,
  title: 'Паттерны проектирования',
  description: 'Классические паттерны в JavaScript: Module, Observer, Factory, Singleton, PubSub, Strategy и их практическое применение',
  lessons: [
    {
      id: 1,
      title: 'Module Pattern',
      type: 'theory',
      content: [
        { type: 'text', value: 'Module Pattern инкапсулирует данные и методы, создавая приватное пространство. В современном JS — ES Modules (import/export). Классически — IIFE или замыкание.' },
        { type: 'heading', value: 'Module через замыкание' },
        { type: 'code', language: 'javascript', value: '// Классический Module Pattern через IIFE\nconst Counter = (function() {\n  let count = 0; // Приватная переменная\n\n  function validate(value) { // Приватная функция\n    if (typeof value !== "number") throw new Error("Ожидается число");\n  }\n\n  return {\n    // Публичный API\n    increment(by = 1) {\n      validate(by);\n      count += by;\n      return this;\n    },\n    decrement(by = 1) {\n      validate(by);\n      count -= by;\n      return this;\n    },\n    reset() { count = 0; return this; },\n    getValue() { return count; },\n    toString() { return `Counter(${count})`; }\n  };\n})();\n\nCounter.increment(5).increment(3).decrement(2);\nconsole.log(Counter.getValue()); // 6\nconsole.log(Counter.count); // undefined — приватное!\n\n// Фабричная функция — создаёт несколько экземпляров\nfunction createCounter(initial = 0) {\n  let count = initial;\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    get: () => count,\n    reset: () => { count = initial; }\n  };\n}\n\nconst c1 = createCounter(10);\nconst c2 = createCounter(0);\nc1.increment(); // 11 — независимо от c2\n\n// ES Module (современный способ)\n// counter.js\nlet count = 0; // Локальная переменная модуля\nexport const increment = () => ++count;\nexport const getCount = () => count;' }
      ]
    },
    {
      id: 2,
      title: 'Observer Pattern',
      type: 'theory',
      content: [
        { type: 'text', value: 'Observer (наблюдатель) — объект уведомляет подписчиков об изменениях. Реализация встроена в EventEmitter (Node.js), addEventListener (браузер). Основа реактивного программирования.' },
        { type: 'heading', value: 'Реализация Observer' },
        { type: 'code', language: 'javascript', value: '// Реализация Observer\nclass EventEmitter {\n  constructor() {\n    this._events = {};\n  }\n\n  on(event, listener) {\n    if (!this._events[event]) this._events[event] = [];\n    this._events[event].push(listener);\n    return this; // Для цепочек\n  }\n\n  once(event, listener) {\n    const wrapper = (...args) => {\n      listener(...args);\n      this.off(event, wrapper);\n    };\n    return this.on(event, wrapper);\n  }\n\n  off(event, listener) {\n    if (!this._events[event]) return this;\n    this._events[event] = this._events[event].filter(l => l !== listener);\n    return this;\n  }\n\n  emit(event, ...args) {\n    const listeners = this._events[event] || [];\n    listeners.forEach(listener => listener(...args));\n    return this;\n  }\n}\n\n// Использование\nclass UserStore extends EventEmitter {\n  constructor() {\n    super();\n    this.users = [];\n  }\n\n  addUser(user) {\n    this.users.push(user);\n    this.emit("userAdded", user);    // Уведомляем подписчиков\n    this.emit("change", this.users); // Общее событие изменения\n  }\n\n  removeUser(id) {\n    this.users = this.users.filter(u => u.id !== id);\n    this.emit("userRemoved", id);\n    this.emit("change", this.users);\n  }\n}\n\nconst store = new UserStore();\nstore.on("userAdded", (user) => console.log("Добавлен:", user.name));\nstore.on("change", (users) => updateUI(users));\nstore.once("userAdded", () => console.log("Первый пользователь!"));\n\nstore.addUser({ id: 1, name: "Алия" });' }
      ]
    },
    {
      id: 3,
      title: 'Factory Pattern',
      type: 'theory',
      content: [
        { type: 'text', value: 'Factory (фабрика) создаёт объекты не используя new напрямую. Полезен когда тип объекта определяется в runtime, или нужно скрыть детали создания.' },
        { type: 'heading', value: 'Фабричные функции' },
        { type: 'code', language: 'javascript', value: '// Простая фабрика\nfunction createUser(role) {\n  const base = {\n    createdAt: new Date().toISOString(),\n    isActive: true\n  };\n\n  const configs = {\n    admin: { role: "admin", permissions: ["read", "write", "delete", "manage"] },\n    editor: { role: "editor", permissions: ["read", "write"] },\n    viewer: { role: "viewer", permissions: ["read"] }\n  };\n\n  if (!configs[role]) throw new Error(`Неизвестная роль: ${role}`);\n  return { ...base, ...configs[role] };\n}\n\nconst admin = createUser("admin");\nconst viewer = createUser("viewer");\n\n// Abstract Factory — семейство связанных объектов\nconst UIFactory = {\n  light: {\n    createButton: () => ({ type: "button", theme: "light", style: "bg-white text-black" }),\n    createInput:  () => ({ type: "input", theme: "light", style: "border-gray-300" }),\n    createModal:  () => ({ type: "modal", theme: "light", style: "bg-white" })\n  },\n  dark: {\n    createButton: () => ({ type: "button", theme: "dark", style: "bg-gray-800 text-white" }),\n    createInput:  () => ({ type: "input", theme: "dark", style: "border-gray-600 bg-gray-700" }),\n    createModal:  () => ({ type: "modal", theme: "dark", style: "bg-gray-900" })\n  }\n};\n\nfunction createUI(theme) {\n  const factory = UIFactory[theme];\n  if (!factory) throw new Error(`Неизвестная тема: ${theme}`);\n  return {\n    button: factory.createButton(),\n    input: factory.createInput(),\n    modal: factory.createModal()\n  };\n}\n\nconst darkUI = createUI("dark");\nconst lightUI = createUI("light");' }
      ]
    },
    {
      id: 4,
      title: 'Singleton Pattern',
      type: 'theory',
      content: [
        { type: 'text', value: 'Singleton гарантирует единственный экземпляр класса и глобальную точку доступа к нему. В Node.js модули автоматически кэшируются — это уже Singleton.' },
        { type: 'heading', value: 'Реализация Singleton' },
        { type: 'code', language: 'javascript', value: '// Классический Singleton\nclass DatabaseConnection {\n  static instance = null; // Статическое поле\n\n  constructor(config) {\n    if (DatabaseConnection.instance) {\n      return DatabaseConnection.instance; // Возвращаем существующий\n    }\n    this.config = config;\n    this.connected = false;\n    DatabaseConnection.instance = this;\n  }\n\n  async connect() {\n    if (this.connected) return this;\n    await this._connect(this.config);\n    this.connected = true;\n    return this;\n  }\n\n  static getInstance(config) {\n    if (!DatabaseConnection.instance) {\n      DatabaseConnection.instance = new DatabaseConnection(config);\n    }\n    return DatabaseConnection.instance;\n  }\n}\n\nconst db1 = DatabaseConnection.getInstance({ host: "localhost" });\nconst db2 = DatabaseConnection.getInstance(); // Тот же экземпляр!\nconsole.log(db1 === db2); // true\n\n// Node.js модульный Singleton (проще)\n// config.js\nlet instance = null;\n\nfunction getConfig() {\n  if (!instance) {\n    instance = {\n      db: process.env.DB_URL,\n      port: process.env.PORT || 3000,\n      // ...другие настройки\n    };\n  }\n  return instance;\n}\n\nmodule.exports = { getConfig };\n// Модуль кэшируется Node.js — фактически Singleton\n\n// Использование (антипаттерн для состояния, нормально для конфига)\nconst config = require("./config"); // Всегда один объект' }
      ]
    },
    {
      id: 5,
      title: 'PubSub Pattern',
      type: 'theory',
      content: [
        { type: 'text', value: 'PubSub (Publisher-Subscriber) — расширение Observer. Добавляет брокер сообщений между издателем и подписчиками. Они не знают друг о друге — полное разделение.' },
        { type: 'heading', value: 'Реализация PubSub' },
        { type: 'code', language: 'javascript', value: '// PubSub / Event Bus\nconst EventBus = (() => {\n  const channels = {};\n\n  return {\n    subscribe(channel, callback) {\n      if (!channels[channel]) channels[channel] = [];\n      channels[channel].push(callback);\n      // Возвращаем функцию отписки\n      return () => this.unsubscribe(channel, callback);\n    },\n\n    unsubscribe(channel, callback) {\n      if (channels[channel]) {\n        channels[channel] = channels[channel].filter(cb => cb !== callback);\n      }\n    },\n\n    publish(channel, data) {\n      (channels[channel] || []).forEach(cb => {\n        setTimeout(() => cb(data), 0); // Асинхронно\n      });\n    },\n\n    clear(channel) {\n      delete channels[channel];\n    }\n  };\n})();\n\n// Компоненты не знают друг о друге!\n// Компонент A публикует\nfunction UserLoginComponent() {\n  const login = async (credentials) => {\n    const user = await authenticate(credentials);\n    EventBus.publish("user:logged-in", user); // Не знает кто слушает\n    EventBus.publish("analytics:event", { type: "login", userId: user.id });\n  };\n}\n\n// Компонент B подписывается\nfunction NotificationComponent() {\n  const unsubscribe = EventBus.subscribe("user:logged-in", (user) => {\n    showToast(`Добро пожаловать, ${user.name}!`);\n  });\n  // Отписка при уничтожении компонента\n  return unsubscribe;\n}\n\n// Компонент C тоже подписывается\nfunction SessionComponent() {\n  EventBus.subscribe("user:logged-in", (user) => {\n    localStorage.setItem("session", JSON.stringify(user));\n  });\n}' }
      ]
    },
    {
      id: 6,
      title: 'Strategy Pattern',
      type: 'theory',
      content: [
        { type: 'text', value: 'Strategy позволяет менять алгоритм во время выполнения. Семейство алгоритмов инкапсулируется, становятся взаимозаменяемыми. Убирает if/else ветвления.' },
        { type: 'heading', value: 'Стратегии сортировки и валидации' },
        { type: 'code', language: 'javascript', value: '// Strategy Pattern — алгоритмы сортировки\nconst sortStrategies = {\n  bubble: (arr) => {\n    const a = [...arr];\n    for (let i = 0; i < a.length; i++)\n      for (let j = 0; j < a.length - i - 1; j++)\n        if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];\n    return a;\n  },\n  quick: (arr) => {\n    if (arr.length <= 1) return arr;\n    const pivot = arr[Math.floor(arr.length / 2)];\n    const left = arr.filter(x => x < pivot);\n    const right = arr.filter(x => x > pivot);\n    return [...sortStrategies.quick(left), pivot, ...sortStrategies.quick(right)];\n  },\n  builtin: (arr) => [...arr].sort((a, b) => a - b)\n};\n\nclass Sorter {\n  constructor(strategy = "builtin") {\n    this.setStrategy(strategy);\n  }\n\n  setStrategy(name) {\n    if (!sortStrategies[name]) throw new Error(`Неизвестная стратегия: ${name}`);\n    this.strategy = sortStrategies[name];\n  }\n\n  sort(data) { return this.strategy(data); }\n}\n\nconst sorter = new Sorter("quick");\nconsole.log(sorter.sort([3, 1, 4, 1, 5, 9]));\nsorter.setStrategy("bubble"); // Меняем стратегию в runtime\n\n// Strategy для валидации\nconst validators = {\n  required: (v) => !!v || "Поле обязательно",\n  email: (v) => /\\S+@\\S+\\.\\S+/.test(v) || "Некорректный email",\n  minLength: (min) => (v) => v.length >= min || `Минимум ${min} символов`,\n  maxLength: (max) => (v) => v.length <= max || `Максимум ${max} символов`,\n};\n\nconst validate = (value, rules) => {\n  for (const rule of rules) {\n    const result = rule(value);\n    if (result !== true) return result;\n  }\n  return null;\n};\n\nvalidate("a@b.c", [validators.required, validators.email]); // null (ок)\nvalidate("abc", [validators.required, validators.email]);    // "Некорректный email"' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Применение паттернов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте систему уведомлений используя Observer/PubSub, систему авторизации с стратегиями и кэш-менеджер как Singleton.',
      requirements: [
        'NotificationCenter — PubSub брокер с subscribe/publish/unsubscribe',
        'Подписчики: EmailNotifier, PushNotifier, SMSNotifier (разные стратегии)',
        'AuthService использует Strategy: emailPassword, google, github',
        'CacheManager — Singleton с get/set/delete/clear и TTL',
        'Продемонстрируйте что CacheManager.getInstance() === CacheManager.getInstance()',
        'Все паттерны должны быть слабо связаны через интерфейсы'
      ],
      hint: 'Observer/PubSub: subscribe(event, fn) -> unsubscribe, publish(event, data). Singleton: храните instance как статическое свойство класса или в замыкании. Strategy: передавайте стратегию как зависимость, не hardcode.',
      expectedOutput: 'PubSub.subscribe("userCreated", fn) -> fn вызван при publish\nCacheManager.getInstance() === CacheManager.getInstance() -> true (singleton)\nAuthContext.setStrategy(jwtStrategy) -> смена стратегии аутентификации\nNotificationSystem.notify("email", user) -> уведомление отправлено',
      solution: {
        code: '// PubSub — NotificationCenter\nconst NotificationCenter = (() => {\n  const subs = {};\n  return {\n    subscribe(event, cb) { (subs[event] = subs[event] || []).push(cb); return () => this.unsubscribe(event, cb); },\n    unsubscribe(event, cb) { subs[event] = (subs[event] || []).filter(f => f !== cb); },\n    publish(event, data) { (subs[event] || []).forEach(cb => cb(data)); }\n  };\n})();\n\n// Стратегии уведомлений\nconst EmailNotifier = { notify: (data) => console.log(`EMAIL: ${data.message} -> ${data.user}`) };\nconst PushNotifier  = { notify: (data) => console.log(`PUSH:  ${data.message}`) };\nconst SMSNotifier   = { notify: (data) => console.log(`SMS:   ${data.message} -> ${data.phone}`) };\n\nNotificationCenter.subscribe("notification", (data) => EmailNotifier.notify(data));\nNotificationCenter.subscribe("notification", (data) => PushNotifier.notify(data));\nNotificationCenter.publish("notification", { message: "Новый заказ", user: "admin@test.com", phone: "+77001234567" });\n\n// Strategy — AuthService\nconst authStrategies = {\n  emailPassword: async ({ email, password }) => ({ userId: 1, email, method: "email" }),\n  google: async ({ token }) => ({ userId: 2, email: "user@gmail.com", method: "google" }),\n  github: async ({ code }) => ({ userId: 3, username: "dev", method: "github" })\n};\n\nconst AuthService = {\n  strategy: "emailPassword",\n  setStrategy(name) { this.strategy = name; },\n  async authenticate(credentials) {\n    const fn = authStrategies[this.strategy];\n    if (!fn) throw new Error(`Стратегия ${this.strategy} не найдена`);\n    return fn(credentials);\n  }\n};\n\n// Singleton — CacheManager\nconst CacheManager = (() => {\n  let instance = null;\n  class Cache {\n    constructor() { this.store = new Map(); }\n    set(key, value, ttl = Infinity) { this.store.set(key, { value, expires: Date.now() + ttl }); }\n    get(key) {\n      const entry = this.store.get(key);\n      if (!entry) return null;\n      if (Date.now() > entry.expires) { this.store.delete(key); return null; }\n      return entry.value;\n    }\n    delete(key) { this.store.delete(key); }\n    clear() { this.store.clear(); }\n  }\n  return { getInstance: () => { if (!instance) instance = new Cache(); return instance; } };\n})();\n\nconst cache1 = CacheManager.getInstance();\nconst cache2 = CacheManager.getInstance();\nconsole.log(cache1 === cache2); // true\ncache1.set("user:1", { name: "Алия" }, 5000);\nconsole.log(cache2.get("user:1")); // { name: "Алия" }',
        language: 'javascript'
      },
      explanation: 'NotificationCenter реализован через IIFE — subs замкнут и недоступен снаружи. subscribe возвращает функцию отписки — удобный паттерн для cleanup. Strategy через объект-словарь authStrategies устраняет if/else цепочки — добавление новой стратегии не меняет AuthService. Singleton использует IIFE с instance в замыкании — класс Cache скрыт, снаружи доступен только getInstance(). TTL в Cache хранится как абсолютное время Date.now() + ttl, проверяется при чтении (ленивое удаление). cache1 === cache2 доказывает единственность экземпляра.'
    }
  ]
};
