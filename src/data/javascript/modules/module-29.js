export default {
  id: 29,
  title: 'WeakMap, WeakSet, WeakRef',
  description: 'Слабые коллекции JavaScript: WeakMap/WeakSet для кэширования без утечек памяти, WeakRef для слабых ссылок, FinalizationRegistry для очистки ресурсов.',
  lessons: [
    {
      id: 1,
      title: 'Проблема утечек памяти',
      type: 'theory',
      content: [
        { type: 'text', value: 'В JavaScript объекты живут пока есть ссылки на них. Сборщик мусора (GC) удаляет объекты без ссылок. Обычные Map/Set держат сильные ссылки — объект не удаляется, даже если больше нигде не нужен.' },
        { type: 'code', language: 'javascript', value: '// УТЕЧКА ПАМЯТИ с обычным Map\nconst cache = new Map();\n\nfunction processUser(user) {\n  if (cache.has(user)) return cache.get(user);\n\n  const result = expensiveOperation(user);\n  cache.set(user, result); // Map держит user!\n  return result;\n}\n\nlet user = { name: "Алия", data: new Array(1000000) };\nprocessUser(user);\n\n// Даже после этого — user НЕ будет удалён GC!\n// Map держит сильную ссылку!\nuser = null; // Пытаемся освободить\n// Но cache всё ещё хранит ключ user!\n// Утечка!\n\n// С WeakMap — нет утечки!\nconst weakCache = new WeakMap();\n\nfunction processUserSafe(user) {\n  if (weakCache.has(user)) return weakCache.get(user);\n  const result = expensiveOperation(user);\n  weakCache.set(user, result);\n  return result;\n}\n\nlet user2 = { name: "Берик", data: new Array(1000000) };\nprocessUserSafe(user2);\nuser2 = null; // GC может теперь удалить user2 и запись в weakCache!' },
        { type: 'tip', value: 'WeakMap/WeakSet не влияют на сборку мусора. Когда объект-ключ удаляется — запись в WeakMap автоматически исчезает. Это предотвращает утечки при кэшировании данных объектов.' }
      ]
    },
    {
      id: 2,
      title: 'WeakMap — слабые ключи',
      type: 'theory',
      content: [
        { type: 'text', value: 'WeakMap как обычный Map, но: 1) Ключи только объекты (не примитивы), 2) Нет итерации (нет forEach, keys, values, size), 3) Ключи слабо хранятся (GC может удалить).' },
        { type: 'code', language: 'javascript', value: '// WeakMap API: get, set, has, delete\nconst wm = new WeakMap();\n\nconst obj1 = { id: 1 };\nconst obj2 = { id: 2 };\n\nwm.set(obj1, "данные для obj1");\nwm.set(obj2, { extra: "данные" });\n\nconsole.log(wm.has(obj1)); // true\nconsole.log(wm.get(obj1)); // "данные для obj1"\nwm.delete(obj1);\nconsole.log(wm.has(obj1)); // false\n\n// Нет итерации!\n// wm.size    -- undefined\n// wm.keys()  -- TypeError\n// wm.forEach -- undefined\n\n// Практика 1: дополнительные данные для DOM элементов\nconst elementData = new WeakMap();\n\nfunction attachData(element, data) {\n  elementData.set(element, data);\n}\n\nfunction getData(element) {\n  return elementData.get(element);\n}\n\n// Когда элемент удаляется из DOM, GC очищает WeakMap автоматически!' },
        { type: 'code', language: 'javascript', value: '// Практика 2: приватные данные для классов\nconst _private = new WeakMap();\n\nclass Person {\n  constructor(name, age) {\n    _private.set(this, { age });\n    this.name = name;\n  }\n\n  getAge() {\n    return _private.get(this).age;\n  }\n\n  birthday() {\n    _private.get(this).age++;\n    return this;\n  }\n}\n\nconst p = new Person("Алия", 25);\nconsole.log(p.getAge()); // 25\np.birthday();\nconsole.log(p.getAge()); // 26\n\n// До ES2022 приватных полей (#) — WeakMap был стандартом для приватности\nconsole.log(p.age); // undefined (приватно!)' },
        { type: 'note', value: 'WeakMap нельзя итерировать намеренно — GC может удалить ключи в любой момент, и порядок/состояние коллекции непредсказуемо. Это ограничение по дизайну, не случайность.' }
      ]
    },
    {
      id: 3,
      title: 'WeakSet — слабые множества',
      type: 'theory',
      content: [
        { type: 'text', value: 'WeakSet — как Set, но: 1) Только объекты, 2) Нет итерации, 3) Слабые ссылки. Используется для отслеживания объектов без удержания их в памяти.' },
        { type: 'code', language: 'javascript', value: '// WeakSet API: add, has, delete\nconst ws = new WeakSet();\n\nconst a = { name: "a" };\nconst b = { name: "b" };\n\nws.add(a);\nws.add(b);\n\nconsole.log(ws.has(a)); // true\nws.delete(a);\nconsole.log(ws.has(a)); // false\n\n// Практика 1: отслеживание посещённых объектов\nconst visited = new WeakSet();\n\nfunction processOnce(obj) {\n  if (visited.has(obj)) {\n    console.log("Уже обработано!");\n    return;\n  }\n  visited.add(obj);\n  console.log("Обрабатываем:", obj.name);\n}\n\nconst task = { name: "Задача 1" };\nprocessOnce(task); // "Обрабатываем: Задача 1"\nprocessOnce(task); // "Уже обработано!"' },
        { type: 'code', language: 'javascript', value: '// Практика 2: обнаружение циклических ссылок\nfunction deepClone(obj, seen = new WeakSet()) {\n  if (obj === null || typeof obj !== "object") return obj;\n\n  // Проверяем на цикл\n  if (seen.has(obj)) {\n    return "[Circular]";\n  }\n  seen.add(obj);\n\n  const copy = Array.isArray(obj) ? [] : {};\n  for (const key of Object.keys(obj)) {\n    copy[key] = deepClone(obj[key], seen);\n  }\n  return copy;\n}\n\nconst original = { a: 1, b: { c: 2 } };\noriginal.self = original; // цикл!\n\nconsole.log(deepClone(original));\n// { a: 1, b: { c: 2 }, self: "[Circular]" }' },
        { type: 'tip', value: 'WeakSet идеален для детектирования циклических ссылок при обходе/клонировании объектов. WeakMap — для кэширования результатов или хранения метаданных объектов.' }
      ]
    },
    {
      id: 4,
      title: 'WeakRef — слабые ссылки',
      type: 'theory',
      content: [
        { type: 'text', value: 'WeakRef (ES2021) позволяет хранить слабую ссылку на объект. Объект может быть собран GC, и тогда weakRef.deref() вернёт undefined. Используется для кэшей.' },
        { type: 'code', language: 'javascript', value: '// WeakRef — слабая ссылка\nlet obj = { data: new Array(1000000), name: "Большой объект" };\n\nconst weakRef = new WeakRef(obj);\n\n// deref() — получить объект (или undefined если собран GC)\nconsole.log(weakRef.deref()?.name); // "Большой объект"\n\nobj = null; // Сильная ссылка удалена\n// GC МОЖЕТ теперь удалить объект\n// weakRef.deref() может вернуть undefined\n\n// Практика: кэш с WeakRef\nclass WeakCache {\n  #cache = new Map();\n\n  set(key, value) {\n    this.#cache.set(key, new WeakRef(value));\n  }\n\n  get(key) {\n    const ref = this.#cache.get(key);\n    if (!ref) return undefined;\n\n    const value = ref.deref();\n    if (value === undefined) {\n      this.#cache.delete(key); // очищаем мёртвую ссылку\n      return undefined;\n    }\n    return value;\n  }\n}' },
        { type: 'note', value: 'WeakRef.deref() может возвращать undefined в любой момент после того, как пропали все сильные ссылки. Никогда не полагайся на то, что объект ещё жив — всегда проверяй deref() !== undefined.' }
      ]
    },
    {
      id: 5,
      title: 'FinalizationRegistry — очистка ресурсов',
      type: 'theory',
      content: [
        { type: 'text', value: 'FinalizationRegistry (ES2021) позволяет зарегистрировать callback, который вызовется когда объект будет собран GC. Используется для освобождения внешних ресурсов.' },
        { type: 'code', language: 'javascript', value: '// FinalizationRegistry\nconst registry = new FinalizationRegistry((heldValue) => {\n  console.log(`Объект удалён, heldValue: ${heldValue}`);\n  // heldValue — значение переданное при регистрации\n});\n\nlet bigObj = { name: "Большой" };\n\n// Регистрируем: когда bigObj собран GC -> вызвать callback с "my-key"\nregistry.register(bigObj, "my-key");\n\nbigObj = null; // Убираем сильную ссылку\n// Когда GC соберёт объект:\n// Callback: "Объект удалён, heldValue: my-key"' },
        { type: 'code', language: 'javascript', value: '// Практический пример: управление соединениями\nclass DatabaseConnection {\n  static #registry = new FinalizationRegistry((connId) => {\n    console.log(`Соединение ${connId} не было явно закрыто! Принудительное закрытие.`);\n    // Закрыть соединение на уровне C++ / native\n  });\n\n  #connId;\n  #closed = false;\n\n  constructor(url) {\n    this.#connId = Math.random().toString(36).slice(2);\n    // Регистрируем для очистки при GC\n    DatabaseConnection.#registry.register(this, this.#connId);\n    console.log(`Соединение ${this.#connId} открыто`);\n  }\n\n  close() {\n    this.#closed = true;\n    console.log(`Соединение ${this.#connId} явно закрыто`);\n    // При явном закрытии можно разрегистрировать:\n    // DatabaseConnection.#registry.unregister(token);\n  }\n}' },
        { type: 'tip', value: 'FinalizationRegistry не даёт гарантий когда (и даст ли вообще) вызовется callback. GC недетерминирован. Используй только как "страховку", основной путь очистки должен быть явным (close(), dispose()).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: умный кэш с автоочисткой',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй интеллектуальный кэш используя WeakRef и FinalizationRegistry.',
      requirements: [
        'SmartCache класс с методами set(key, value, ttl), get(key)',
        'TTL (time-to-live): значения автоматически истекают через ms',
        'WeakRef для значений-объектов: GC может очистить редко используемые',
        'FinalizationRegistry для логирования и очистки при GC'
      ],
      hint: 'Для TTL: хранить { ref: new WeakRef(value), expiresAt: Date.now() + ttl }. В get: проверяй expiresAt и ref.deref(). FinalizationRegistry.register(value, key) для логирования.',
      solution: 'class SmartCache {\n  #store = new Map();\n  #registry = new FinalizationRegistry((key) => {\n    console.log(`[Cache] GC собрал значение для ключа: ${key}`);\n    this.#store.delete(key);\n  });\n\n  set(key, value, ttl = Infinity) {\n    const entry = {\n      ref: typeof value === "object" && value !== null\n        ? new WeakRef(value)\n        : null,\n      primitiveValue: typeof value !== "object" ? value : null,\n      expiresAt: ttl === Infinity ? Infinity : Date.now() + ttl\n    };\n\n    if (entry.ref) {\n      this.#registry.register(value, key);\n    }\n\n    this.#store.set(key, entry);\n    return this;\n  }\n\n  get(key) {\n    const entry = this.#store.get(key);\n    if (!entry) return undefined;\n\n    if (Date.now() > entry.expiresAt) {\n      this.#store.delete(key);\n      return undefined;\n    }\n\n    if (entry.ref) {\n      const value = entry.ref.deref();\n      if (value === undefined) {\n        this.#store.delete(key);\n        return undefined;\n      }\n      return value;\n    }\n\n    return entry.primitiveValue;\n  }\n\n  has(key) { return this.get(key) !== undefined; }\n\n  get size() { return this.#store.size; }\n}\n\nconst cache = new SmartCache();\ncache.set("user", { name: "Алия" }, 5000); // TTL 5 сек\ncache.set("count", 42); // примитив\n\nconsole.log(cache.get("user")?.name); // "Алия"\nconsole.log(cache.get("count"));      // 42',
      explanation: 'SmartCache использует WeakRef для объектов — GC может их собрать при нехватке памяти. Примитивы хранятся напрямую (WeakRef не работает с примитивами). TTL реализован через expiresAt. FinalizationRegistry автоматически очищает записи при GC.'
    }
  ]
}
