export default {
  id: 20,
  title: 'this и контекст',
  description: 'Ключевое слово this в JavaScript: как определяется контекст, методы bind/call/apply, стрелочные функции и this, паттерны потери контекста.',
  lessons: [
    {
      id: 1,
      title: 'Что такое this',
      type: 'theory',
      content: [
        { type: 'text', value: 'this — специальное ключевое слово, которое ссылается на "владельца" функции в момент вызова. В отличие от замыканий, this определяется не при написании кода, а при его вызове.' },
        { type: 'code', language: 'javascript', value: '// this зависит от СПОСОБА ВЫЗОВА функции\n\n// 1. Метод объекта — this = объект\nconst user = {\n  name: "Алия",\n  greet() {\n    console.log(`Привет, я ${this.name}!`);\n  }\n};\nuser.greet(); // Привет, я Алия!\n\n// 2. Обычная функция — this = global (или undefined в strict mode)\nfunction standalone() {\n  console.log(this); // Window (браузер) или global (Node.js)\n}\nstandalone();\n\n// 3. strict mode\n"use strict";\nfunction strictFn() {\n  console.log(this); // undefined!\n}\nstrictFn();\n\n// 4. Конструктор (new) — this = новый объект\nfunction Person(name) {\n  this.name = name; // this = новый объект\n  this.greet = function() {\n    console.log(`Привет, ${this.name}`);\n  };\n}\nconst p = new Person("Берик");\np.greet(); // Привет, Берик' },
        { type: 'tip', value: 'Главное правило: this определяется тем, КАК вызвана функция, а не тем, ГДЕ она написана (кроме стрелочных). obj.method() — this=obj, fn() — this=global/undefined, new Fn() — this=новый объект.' }
      ]
    },
    {
      id: 2,
      title: 'Потеря контекста',
      type: 'theory',
      content: [
        { type: 'text', value: 'Самая частая проблема с this — "потеря контекста". Когда метод объекта передаётся как callback или присваивается переменной, this теряет связь с объектом.' },
        { type: 'code', language: 'javascript', value: 'const timer = {\n  name: "Таймер",\n  start() {\n    console.log(`${this.name} запущен`);\n    // ПОТЕРЯ КОНТЕКСТА в callback!\n    setTimeout(function() {\n      console.log(this.name); // undefined или Window.name!\n      // this = Window, потому что setTimeout вызывает функцию как standalone\n    }, 1000);\n  }\n};\n\ntimer.start(); // "Таймер запущен", потом "" или ошибка\n\n// Другие примеры потери контекста:\nconst { start } = timer;\nstart(); // this = undefined (strict) или global\n\nconst fns = [timer.start];\nfns[0](); // this = fns массив (в некоторых случаях)!\n\n// В event handler:\n// button.addEventListener("click", timer.start);\n// this = button (DOM элемент), а не timer!' },
        { type: 'heading', value: 'Решения потери контекста' },
        { type: 'code', language: 'javascript', value: '// Решение 1: сохранить this в переменную (устаревший способ)\nconst obj1 = {\n  name: "Берик",\n  start() {\n    const self = this; // сохраняем this\n    setTimeout(function() {\n      console.log(self.name); // используем self\n    }, 100);\n  }\n};\n\n// Решение 2: стрелочная функция (лучший способ)\nconst obj2 = {\n  name: "Алия",\n  start() {\n    setTimeout(() => {\n      console.log(this.name); // this из start() — стрелочная!\n    }, 100); // Алия ✓\n  }\n};\n\n// Решение 3: bind()\nconst obj3 = {\n  name: "Сауле",\n  start() {\n    setTimeout(function() {\n      console.log(this.name);\n    }.bind(this), 100); // привязываем this\n  }\n};' },
        { type: 'note', value: 'В современном JS стрелочные функции решают 90% проблем с потерей контекста в callback. Используй стрелочную функцию везде, где нужно сохранить this из внешней области.' }
      ]
    },
    {
      id: 3,
      title: 'call и apply',
      type: 'theory',
      content: [
        { type: 'text', value: 'call() и apply() позволяют вызвать функцию с явно указанным this. Разница: call передаёт аргументы через запятую, apply — как массив.' },
        { type: 'code', language: 'javascript', value: 'function greet(greeting, punctuation) {\n  return `${greeting}, ${this.name}${punctuation}`;\n}\n\nconst alice = { name: "Алия" };\nconst bob   = { name: "Берик" };\n\n// call(thisArg, arg1, arg2, ...)\nconsole.log(greet.call(alice, "Привет", "!"));\n// "Привет, Алия!"\n\nconsole.log(greet.call(bob, "Здравствуйте", "."));\n// "Здравствуйте, Берик."\n\n// apply(thisArg, [arg1, arg2, ...])\nconsole.log(greet.apply(alice, ["Привет", "!"]));\n// "Привет, Алия!"\n\n// apply полезен когда аргументы уже в массиве\nconst args = ["Привет", "!!!"];\nconsole.log(greet.apply(bob, args)); // "Привет, Берик!!!"' },
        { type: 'heading', value: 'Практические применения call/apply' },
        { type: 'code', language: 'javascript', value: '// 1. Заимствование методов\nconst arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };\n\n// arrayLike не массив, у него нет slice\n// Но можно заимствовать метод массива!\nconst arr = Array.prototype.slice.call(arrayLike);\nconsole.log(arr); // ["a", "b", "c"]\n\n// Современный способ: Array.from(arrayLike)\n\n// 2. Проверка типа через Object.prototype.toString\nfunction getType(val) {\n  return Object.prototype.toString.call(val);\n  // возвращает "[object Type]"\n}\nconsole.log(getType([]));          // "[object Array]"\nconsole.log(getType(null));        // "[object Null]"\nconsole.log(getType(new Date())); // "[object Date]"\n\n// 3. Math.max с массивом (до spread)\nconst nums = [3, 1, 4, 1, 5, 9];\nconsole.log(Math.max.apply(null, nums)); // 9\n// Современный способ: Math.max(...nums)' },
        { type: 'tip', value: 'В современном JS apply часто заменяется spread: fn.apply(ctx, args) === fn.call(ctx, ...args). Но apply всё ещё используется для заимствования методов и в метапрограммировании.' }
      ]
    },
    {
      id: 4,
      title: 'bind — постоянная привязка',
      type: 'theory',
      content: [
        { type: 'text', value: 'bind() создаёт новую функцию с постоянно привязанным this (и, опционально, аргументами). В отличие от call/apply, bind не вызывает функцию, а возвращает новую.' },
        { type: 'code', language: 'javascript', value: 'const user = {\n  name: "Алия",\n  greet(greeting) {\n    return `${greeting}, я ${this.name}!`;\n  }\n};\n\n// bind создаёт новую функцию с привязанным this\nconst boundGreet = user.greet.bind(user);\nconsole.log(boundGreet("Привет")); // "Привет, я Алия!"\n\n// Можно передать куда угодно — this не потеряется\nconst greetFn = user.greet.bind({ name: "Берик" });\nconsole.log(greetFn("Здравствуй")); // "Здравствуй, я Берик!"\n\n// Partial application — частичное применение аргументов\nfunction multiply(a, b) { return a * b; }\n\nconst double  = multiply.bind(null, 2); // a=2, b — потом\nconst triple  = multiply.bind(null, 3);\nconst percent = multiply.bind(null, 0.01);\n\nconsole.log(double(5));   // 10\nconsole.log(triple(5));   // 15\nconsole.log(percent(75)); // 0.75' },
        { type: 'code', language: 'javascript', value: '// bind в классах (React паттерн)\nclass Button {\n  constructor(label) {\n    this.label = label;\n    // Привязываем метод в конструкторе\n    this.handleClick = this.handleClick.bind(this);\n  }\n\n  handleClick() {\n    console.log(`Нажата кнопка: ${this.label}`);\n  }\n\n  render() {\n    // Теперь this.handleClick имеет правильный контекст\n    // button.addEventListener("click", this.handleClick);\n    return this.handleClick;\n  }\n}\n\nconst btn = new Button("Отправить");\nconst handler = btn.render();\nhandler(); // "Нажата кнопка: Отправить"' },
        { type: 'note', value: 'bind() используется в старом React коде в constructor. В современном React используют стрелочные свойства класса: handleClick = () => { ... } — они автоматически захватывают this.' }
      ]
    },
    {
      id: 5,
      title: 'this в стрелочных функциях',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стрелочные функции НЕ имеют своего this. Они захватывают this из окружающего лексического контекста. call/apply/bind не могут изменить this стрелочной функции.' },
        { type: 'code', language: 'javascript', value: '// Стрелочная функция захватывает this из внешней области\nconst obj = {\n  name: "Алия",\n  regularFn: function() {\n    console.log(this.name); // "Алия" (obj.regularFn())\n  },\n  arrowFn: () => {\n    console.log(this.name); // undefined или "" (this = глобальный!)\n    // this захвачен из МЕСТА ОБЪЯВЛЕНИЯ объекта (глобальная область)\n  },\n  withTimer() {\n    // this здесь = obj (вызов obj.withTimer())\n    setTimeout(() => {\n      console.log(this.name); // "Алия"!\n      // Стрелочная захватывает this из withTimer() = obj\n    }, 100);\n  }\n};\n\nobj.regularFn(); // Алия\nobj.arrowFn();   // undefined\nobj.withTimer(); // Алия (через 100мс)' },
        { type: 'code', language: 'javascript', value: '// bind/call/apply НЕ работают с стрелочными\nconst arrow = () => this;\n\nconst bound = arrow.bind({ name: "игнорируется" });\nconsole.log(bound()); // глобальный this, не { name: ... }\n\narrow.call({ name: "также игнорируется" }); // this не меняется\n\n// Стрелочная в методе vs метод\nclass Timer {\n  constructor() { this.count = 0; }\n\n  start() {\n    // Стрелочная захватывает this из start() = экземпляр Timer\n    setInterval(() => {\n      this.count++;\n      console.log(this.count);\n    }, 1000);\n  }\n}\n\nconst t = new Timer();\nt.start(); // 1, 2, 3, ... (this работает!)\n\n// Но: стрелочная как метод класса — НЕ в прототипе, а в экземпляре\nclass Btn {\n  label = "OK";\n  click = () => console.log(this.label); // стрелочное свойство\n}' },
        { type: 'tip', value: 'Правило: используй стрелочные функции для callback (setTimeout, addEventListener, map/filter). Используй обычные функции для методов объекта/класса и конструкторов.' }
      ]
    },
    {
      id: 6,
      title: 'this в классах ES6',
      type: 'theory',
      content: [
        { type: 'text', value: 'В классах ES6 this в методах ведёт себя предсказуемо при вызове через экземпляр. Но методы всё равно теряют контекст при передаче как callback.' },
        { type: 'code', language: 'javascript', value: 'class UserService {\n  constructor(baseUrl) {\n    this.baseUrl = baseUrl;\n    this.users = [];\n    // Способ 1: bind в конструкторе\n    this.fetchUser = this.fetchUser.bind(this);\n  }\n\n  // Способ 2: стрелочное свойство (bind не нужен)\n  loadUsers = async () => {\n    const data = await fetch(`${this.baseUrl}/users`);\n    this.users = await data.json();\n  };\n\n  // Обычный метод — нужен bind при передаче как callback\n  fetchUser(id) {\n    return fetch(`${this.baseUrl}/users/${id}`);\n  }\n}\n\nconst service = new UserService("https://api.example.com");\n\n// loadUsers — стрелочная, this сохранён:\nconst load = service.loadUsers;\nload(); // this.baseUrl работает!\n\n// fetchUser — привязан в constructor:\nconst fetch2 = service.fetchUser;\nfetch2(1); // this.baseUrl работает (bind)' },
        { type: 'note', value: 'Стрелочные свойства класса (loadUsers = () => {...}) создаются в каждом экземпляре, а не в прототипе. Это потребляет больше памяти при создании многих экземпляров. Для классов с 1-2 экземплярами — не важно.' }
      ]
    },
    {
      id: 7,
      title: 'Паттерны и продвинутое использование this',
      type: 'theory',
      content: [
        { type: 'text', value: 'Метод chaining (цепочки вызовов) — популярный паттерн, который возможен благодаря return this. Рассмотрим также globalThis и динамические методы.' },
        { type: 'code', language: 'javascript', value: '// Method chaining через return this\nclass QueryBuilder {\n  constructor() {\n    this._table = "";\n    this._where = [];\n    this._limit = null;\n  }\n\n  from(table) {\n    this._table = table;\n    return this; // возвращаем this для цепочки\n  }\n\n  where(condition) {\n    this._where.push(condition);\n    return this;\n  }\n\n  limit(n) {\n    this._limit = n;\n    return this;\n  }\n\n  build() {\n    let sql = `SELECT * FROM ${this._table}`;\n    if (this._where.length) sql += ` WHERE ${this._where.join(" AND ")}`;\n    if (this._limit) sql += ` LIMIT ${this._limit}`;\n    return sql;\n  }\n}\n\nconst query = new QueryBuilder()\n  .from("users")\n  .where("age > 18")\n  .where("active = true")\n  .limit(10)\n  .build();\n\nconsole.log(query);\n// SELECT * FROM users WHERE age > 18 AND active = true LIMIT 10' },
        { type: 'code', language: 'javascript', value: '// globalThis — кросс-платформенный доступ к глобальному объекту\n// В браузере: window\n// В Node.js: global\n// globalThis — всегда правильно!\n\nconsole.log(globalThis === window); // true (в браузере)\nconsole.log(globalThis === global); // true (в Node.js)\n\n// Проверка среды выполнения\nconst isBrowser = typeof globalThis.window !== "undefined";\nconst isNode    = typeof globalThis.process !== "undefined";' },
        { type: 'tip', value: 'Method chaining (jQuery, Lodash, запросы к БД) работает через return this. Каждый метод возвращает сам объект — это позволяет вызывать методы цепочкой без промежуточных переменных.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: EventEmitter с правильным this',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй класс EventEmitter с методами on, off, emit и поддержкой цепочки вызовов.',
      requirements: [
        'Класс EventEmitter с методами on(event, handler), off(event, handler), emit(event, ...args)',
        'once(event, handler) — обработчик, вызываемый только один раз',
        'Все методы возвращают this для поддержки метод-чейнинга',
        'emit вызывает все обработчики с правильным this = экземпляр EventEmitter'
      ],
      hint: 'Храни обработчики в Map: { eventName -> [handlers] }. Для once: создай wrapper-функцию которая вызывает off, потом оригинальный handler.',
      solution: 'class EventEmitter {\n  constructor() {\n    this._events = new Map();\n  }\n\n  on(event, handler) {\n    if (!this._events.has(event)) {\n      this._events.set(event, []);\n    }\n    this._events.get(event).push(handler);\n    return this; // chaining!\n  }\n\n  off(event, handler) {\n    const handlers = this._events.get(event);\n    if (handlers) {\n      this._events.set(event, handlers.filter(h => h !== handler));\n    }\n    return this;\n  }\n\n  once(event, handler) {\n    const wrapper = (...args) => {\n      this.off(event, wrapper);\n      handler.apply(this, args);\n    };\n    wrapper._original = handler;\n    return this.on(event, wrapper);\n  }\n\n  emit(event, ...args) {\n    const handlers = this._events.get(event) || [];\n    handlers.forEach(h => h.apply(this, args));\n    return this;\n  }\n}\n\nconst emitter = new EventEmitter();\n\nconst handler = (msg) => console.log("Получено:", msg);\n\nemitter\n  .on("message", handler)\n  .once("connect", () => console.log("Подключено!"))\n  .emit("connect")   // "Подключено!"\n  .emit("connect")   // ничего (once!)\n  .emit("message", "Привет!"); // "Получено: Привет!"',
      explanation: 'EventEmitter использует Map для хранения обработчиков. once создаёт wrapper-функцию, которая сначала удаляет себя (off), потом вызывает оригинальный handler. Метод chaining через return this позволяет писать компактный декларативный код.'
    }
  ]
}
