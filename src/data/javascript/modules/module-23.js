export default {
  id: 23,
  title: 'Symbol и итераторы',
  description: 'Symbol — уникальные примитивы, well-known символы Symbol.iterator и Symbol.toPrimitive, создание кастомных итерируемых объектов.',
  lessons: [
    {
      id: 1,
      title: 'Symbol — уникальные ключи',
      type: 'theory',
      content: [
        { type: 'text', value: 'Symbol — примитивный тип данных, каждый экземпляр которого уникален. Используется для создания гарантированно уникальных ключей свойств объектов, не конфликтующих ни с чем.' },
        { type: 'code', language: 'javascript', value: '// Создание символов\nconst id1 = Symbol();\nconst id2 = Symbol();\nconsole.log(id1 === id2); // false — каждый уникален!\n\n// Описание (опциональное, только для отладки)\nconst userId = Symbol("userId");\nconsole.log(userId.toString()); // "Symbol(userId)"\nconsole.log(userId.description); // "userId"\n\n// Symbol как ключ свойства\nconst ID = Symbol("id");\nconst user = {\n  name: "Алия",\n  [ID]: 42        // вычисляемый ключ\n};\n\nconsole.log(user[ID]);    // 42\nconsole.log(user.name);   // "Алия"\n\n// Symbol-ключи НЕ видны в обычных операциях!\nconsole.log(Object.keys(user));   // ["name"] — без Symbol!\nconsole.log(JSON.stringify(user)); // {"name":"Алия"} — без Symbol!\n\nfor (const key in user) console.log(key); // только "name"\n\n// Но можно получить явно:\nconsole.log(Object.getOwnPropertySymbols(user)); // [Symbol(id)]\nconsole.log(Reflect.ownKeys(user)); // ["name", Symbol(id)]' },
        { type: 'tip', value: 'Symbol.for("key") создаёт глобальный символ — один для всего приложения. Symbol("key") создаёт новый уникальный символ. Symbol.for используй для межмодульного общения.' }
      ]
    },
    {
      id: 2,
      title: 'Well-known символы: Symbol.iterator',
      type: 'theory',
      content: [
        { type: 'text', value: 'Well-known символы — встроенные Symbol.xxx, определяющие поведение объектов в стандартных операциях. Symbol.iterator делает объект итерируемым в for...of и spread.' },
        { type: 'code', language: 'javascript', value: '// Symbol.iterator — сделать объект итерируемым\nconst range = {\n  from: 1,\n  to: 5,\n\n  [Symbol.iterator]() {\n    let current = this.from;\n    const last = this.to;\n\n    return {\n      next() {\n        if (current <= last) {\n          return { value: current++, done: false };\n        }\n        return { value: undefined, done: true };\n      }\n    };\n  }\n};\n\n// Теперь объект итерируем!\nfor (const n of range) {\n  console.log(n); // 1, 2, 3, 4, 5\n}\n\nconsole.log([...range]); // [1, 2, 3, 4, 5]\n\nconst [first, second, ...rest] = range;\nconsole.log(first, second, rest); // 1 2 [3, 4, 5]' },
        { type: 'code', language: 'javascript', value: '// Бесконечный итератор\nconst fibonacci = {\n  [Symbol.iterator]() {\n    let a = 0, b = 1;\n    return {\n      next() {\n        [a, b] = [b, a + b];\n        return { value: a, done: false }; // никогда не done!\n      }\n    };\n  }\n};\n\n// Берём первые 8 чисел Фибоначчи\nconst fibs = [];\nfor (const n of fibonacci) {\n  fibs.push(n);\n  if (fibs.length === 8) break;\n}\nconsole.log(fibs); // [1, 1, 2, 3, 5, 8, 13, 21]' },
        { type: 'note', value: 'Итератор — объект с методом next(), возвращающим { value, done }. Итерируемый — объект с методом [Symbol.iterator]() возвращающим итератор. Строки, массивы, Map, Set — итерируемые. Классы могут стать итерируемыми реализовав [Symbol.iterator].' }
      ]
    },
    {
      id: 3,
      title: 'Symbol.toPrimitive и другие well-known символы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Symbol.toPrimitive управляет преобразованием объекта в примитив. Symbol.hasInstance — поведение instanceof. Symbol.species — класс для производных объектов.' },
        { type: 'code', language: 'javascript', value: '// Symbol.toPrimitive\nclass Money {\n  constructor(amount, currency) {\n    this.amount   = amount;\n    this.currency = currency;\n  }\n\n  [Symbol.toPrimitive](hint) {\n    // hint: "number", "string", или "default"\n    if (hint === "number") {\n      return this.amount;\n    }\n    if (hint === "string") {\n      return `${this.amount} ${this.currency}`;\n    }\n    // "default" — обычно для == сравнения\n    return this.amount;\n  }\n}\n\nconst price = new Money(1500, "₸");\n\nconsole.log(+price);          // 1500 (hint: "number")\nconsole.log(`${price}`);      // "1500 ₸" (hint: "string")\nconsole.log(price + 500);     // 2000 (hint: "default")\nconsole.log(price > 1000);    // true (hint: "number")' },
        { type: 'code', language: 'javascript', value: '// Symbol.hasInstance — кастомный instanceof\nclass EvenNumber {\n  static [Symbol.hasInstance](num) {\n    return Number.isInteger(num) && num % 2 === 0;\n  }\n}\n\nconsole.log(4  instanceof EvenNumber); // true\nconsole.log(3  instanceof EvenNumber); // false\nconsole.log(10 instanceof EvenNumber); // true\n\n// Symbol.toStringTag — тег для Object.prototype.toString\nclass Database {\n  get [Symbol.toStringTag]() {\n    return "Database";\n  }\n}\n\nconst db = new Database();\nconsole.log(Object.prototype.toString.call(db));\n// "[object Database]"' },
        { type: 'tip', value: 'Symbol.toPrimitive приоритетнее valueOf() и toString() при преобразовании. Hint "default" используется в == (нестрогое равенство) и оператором +. Используй Symbol.toPrimitive для полного контроля.' }
      ]
    },
    {
      id: 4,
      title: 'Кастомный итерируемый класс',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реализация Symbol.iterator в классе делает его экземпляры итерируемыми. Удобный паттерн — возвращать this из [Symbol.iterator] и иметь next() как метод класса.' },
        { type: 'code', language: 'javascript', value: 'class LinkedList {\n  #head = null;\n  #size = 0;\n\n  push(value) {\n    this.#head = { value, next: this.#head };\n    this.#size++;\n    return this;\n  }\n\n  get size() { return this.#size; }\n\n  // Делаем класс итерируемым\n  [Symbol.iterator]() {\n    let current = this.#head;\n    return {\n      next() {\n        if (current) {\n          const value = current.value;\n          current = current.next;\n          return { value, done: false };\n        }\n        return { value: undefined, done: true };\n      }\n    };\n  }\n}\n\nconst list = new LinkedList();\nlist.push(1).push(2).push(3);\n\nfor (const val of list) {\n  console.log(val); // 3, 2, 1 (стек — обратный порядок)\n}\n\nconst arr = [...list];\nconsole.log(arr); // [3, 2, 1]\n\nconst [a, b] = list;\nconsole.log(a, b); // 3 2' }
      ]
    },
    {
      id: 5,
      title: 'Symbol.for и реестр символов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Symbol.for(key) работает с глобальным реестром символов. Если символ с таким ключом уже существует — возвращает его, иначе создаёт новый. Позволяет использовать один символ в разных модулях.' },
        { type: 'code', language: 'javascript', value: '// Symbol() — всегда новый уникальный символ\nconst s1 = Symbol("id");\nconst s2 = Symbol("id");\nconsole.log(s1 === s2); // false\n\n// Symbol.for() — глобальный реестр\nconst g1 = Symbol.for("app.id");\nconst g2 = Symbol.for("app.id");\nconsole.log(g1 === g2); // true! (один и тот же)\n\n// Symbol.keyFor() — найти ключ в реестре\nconsole.log(Symbol.keyFor(g1)); // "app.id"\nconsole.log(Symbol.keyFor(s1)); // undefined (не в реестре)\n\n// Практика: межмодульное общение\n// === moduleA.js ===\nconst AUTH_TOKEN = Symbol.for("app.auth.token");\n// obj[AUTH_TOKEN] = "Bearer ..."\n\n// === moduleB.js ===\nconst AUTH_TOKEN = Symbol.for("app.auth.token"); // тот же символ!\n// const token = obj[AUTH_TOKEN] // получаем тот же токен' },
        { type: 'code', language: 'javascript', value: '// Практический пример: plugin system\nconst PLUGIN_API = Symbol.for("myapp.pluginAPI");\n\nclass App {\n  #plugins = [];\n\n  [PLUGIN_API] = {\n    register: (plugin) => this.#plugins.push(plugin),\n    getAll:   () => [...this.#plugins]\n  };\n}\n\nconst app = new App();\n\n// Плагин использует символ для доступа к API\nfunction installPlugin(appInstance) {\n  const api = appInstance[Symbol.for("myapp.pluginAPI")];\n  api.register({ name: "logger" });\n}\n\ninstallPlugin(app);\nconsole.log(app[PLUGIN_API].getAll()); // [{ name: "logger" }]' },
        { type: 'note', value: 'Symbol.for создаёт символы в глобальном реестре, который существует за пределами отдельных скриптов/воркеров. Это единственный способ поделить символ между разными средами выполнения.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: пользовательская коллекция',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай класс NumberRange — итерируемый диапазон чисел с поддержкой Symbol.iterator и Symbol.toPrimitive.',
      requirements: [
        'NumberRange(start, end, step=1) — диапазон от start до end с шагом step',
        'Итерируемость: for...of, spread, деструктуризация',
        'Symbol.toPrimitive: в числовом контексте — размер диапазона, в строковом — "start..end"',
        'Методы: includes(n), toArray(), map(fn), filter(fn)'
      ],
      hint: 'В [Symbol.iterator](): let current = this.start, возвращай { value: current, done: current > this.end }, current += this.step.',
      expectedOutput: '[...new NumberRange(1, 5)] -> [1, 2, 3, 4, 5]\nNumberRange(1, 10) + 0 -> 10 (через Symbol.toPrimitive)\nfor...of обходит диапазон от start до end включительно',
      solution: 'class NumberRange {\n  constructor(start, end, step = 1) {\n    if (step <= 0) throw new RangeError("Шаг должен быть > 0");\n    this.start = start;\n    this.end   = end;\n    this.step  = step;\n  }\n\n  [Symbol.iterator]() {\n    let current = this.start;\n    const { end, step } = this;\n    return {\n      next() {\n        if (current <= end) {\n          const value = current;\n          current += step;\n          return { value, done: false };\n        }\n        return { value: undefined, done: true };\n      }\n    };\n  }\n\n  [Symbol.toPrimitive](hint) {\n    if (hint === "string") return `${this.start}..${this.end}`;\n    return Math.floor((this.end - this.start) / this.step) + 1;\n  }\n\n  includes(n) {\n    return n >= this.start && n <= this.end && (n - this.start) % this.step === 0;\n  }\n\n  toArray() { return [...this]; }\n\n  map(fn) { return this.toArray().map(fn); }\n\n  filter(fn) { return this.toArray().filter(fn); }\n\n  get size() { return +this; }\n}\n\nconst r = new NumberRange(1, 10, 2); // 1, 3, 5, 7, 9\nfor (const n of r) process.stdout.write(n + " "); // 1 3 5 7 9\nconsole.log();\nconsole.log([...r]);          // [1, 3, 5, 7, 9]\nconsole.log(`Диапазон: ${r}`); // "Диапазон: 1..10"\nconsole.log(+r);              // 5 (размер)\nconsole.log(r.includes(5));   // true\nconsole.log(r.includes(4));   // false',
      explanation: 'Symbol.iterator возвращает объект-итератор с методом next(). Каждый вызов next() отдаёт следующий элемент. Symbol.toPrimitive позволяет объекту вести себя как число или строка в зависимости от контекста. toArray() делегирует spread оператору, который использует Symbol.iterator.'
    }
  ]
}
