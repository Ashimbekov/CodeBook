export default {
  id: 22,
  title: 'Классы (ES6+)',
  description: 'Классы ES6: constructor, extends, super, static методы, приватные поля #, геттеры/сеттеры, абстракция и инкапсуляция в современном JavaScript.',
  lessons: [
    {
      id: 1,
      title: 'Объявление класса и конструктор',
      type: 'theory',
      content: [
        { type: 'text', value: 'Класс в ES6 — синтаксический сахар над прототипным наследованием. class объявляет шаблон для создания объектов, constructor — метод инициализации нового экземпляра.' },
        { type: 'code', language: 'javascript', value: 'class Person {\n  // Поля класса (ES2022) — объявляются перед constructor\n  species = "Homo sapiens"; // публичное поле\n\n  constructor(name, age) {\n    this.name = name;\n    this.age  = age;\n  }\n\n  // Метод\n  greet() {\n    return `Привет, я ${this.name}!`;\n  }\n\n  // Getter — доступ как к свойству\n  get info() {\n    return `${this.name} (${this.age} лет)`;\n  }\n\n  // Setter — присвоение с логикой\n  set age(value) {\n    if (value < 0 || value > 150) {\n      throw new RangeError("Некорректный возраст");\n    }\n    this._age = value;\n  }\n  get age() { return this._age; }\n\n  // toString для красивого вывода\n  toString() {\n    return `Person(${this.name}, ${this.age})`;\n  }\n}\n\nconst alice = new Person("Алия", 25);\nconsole.log(alice.greet());  // "Привет, я Алия!"\nconsole.log(alice.info);     // "Алия (25 лет)" (getter!)\nconsole.log(alice.species);  // "Homo sapiens"\nalice.age = 26;              // setter!\nconsole.log(alice.age);      // 26' },
        { type: 'tip', value: 'class — это не функция с "поднятием" (hoisting). class expression и class declaration существуют, но class declaration не поднимается как function declaration. Объявляй классы до использования.' }
      ]
    },
    {
      id: 2,
      title: 'Статические методы и свойства',
      type: 'theory',
      content: [
        { type: 'text', value: 'static методы и свойства принадлежат классу, а не экземплярам. Они вызываются через имя класса: Class.method(). Используются для фабричных методов и утилит.' },
        { type: 'code', language: 'javascript', value: 'class Temperature {\n  static unit = "Celsius"; // статическое поле\n\n  constructor(celsius) {\n    this.celsius = celsius;\n  }\n\n  // Геттеры\n  get fahrenheit() { return this.celsius * 9/5 + 32; }\n  get kelvin()     { return this.celsius + 273.15; }\n\n  // Статические фабричные методы\n  static fromFahrenheit(f) {\n    return new Temperature((f - 32) * 5/9);\n  }\n  static fromKelvin(k) {\n    return new Temperature(k - 273.15);\n  }\n\n  // Статический метод-утилита\n  static compare(t1, t2) {\n    return t1.celsius - t2.celsius;\n  }\n\n  toString() {\n    return `${this.celsius}°C`;\n  }\n}\n\n// Фабричные методы\nconst boiling  = new Temperature(100);\nconst bodyTemp = Temperature.fromFahrenheit(98.6);\nconst absolute = Temperature.fromKelvin(0);\n\nconsole.log(boiling.fahrenheit);  // 212\nconsole.log(bodyTemp.toString());  // "37°C"\nconsole.log(absolute.celsius);     // -273.15\nconsole.log(Temperature.unit);     // "Celsius"\nconsole.log(boiling.unit);         // undefined (не у экземпляра!)' },
        { type: 'note', value: 'static методы полезны для: 1) Фабричных методов (fromXxx), 2) Утилитарных функций связанных с классом, 3) Паттерна Singleton. В статическом методе this = сам класс (не экземпляр).' }
      ]
    },
    {
      id: 3,
      title: 'Наследование: extends и super',
      type: 'theory',
      content: [
        { type: 'text', value: 'extends создаёт дочерний класс. super() в constructor вызывает родительский конструктор (обязательно в дочернем классе). super.method() вызывает метод родителя.' },
        { type: 'code', language: 'javascript', value: 'class Animal {\n  constructor(name) {\n    this.name = name;\n    this.alive = true;\n  }\n  speak() {\n    return `${this.name} издаёт звук`;\n  }\n  toString() {\n    return `${this.constructor.name}(${this.name})`;\n  }\n}\n\nclass Dog extends Animal {\n  constructor(name, breed) {\n    super(name);        // ОБЯЗАТЕЛЬНО первым в constructor!\n    this.breed = breed;\n  }\n\n  speak() {\n    const base = super.speak(); // вызов родительского метода\n    return `${base}: Гав!`;\n  }\n\n  fetch(item) {\n    return `${this.name} принёс ${item}`;\n  }\n}\n\nclass GoldenRetriever extends Dog {\n  constructor(name) {\n    super(name, "Голден ретривер"); // передаём breed\n  }\n  speak() {\n    return super.speak() + " (дружелюбно)";\n  }\n}\n\nconst buddy = new GoldenRetriever("Бадди");\nconsole.log(buddy.speak());    // "Бадди издаёт звук: Гав! (дружелюбно)"\nconsole.log(buddy.fetch("мяч")); // "Бадди принёс мяч"\nconsole.log(buddy instanceof GoldenRetriever); // true\nconsole.log(buddy instanceof Dog);             // true\nconsole.log(buddy instanceof Animal);          // true' },
        { type: 'tip', value: 'super() должен вызываться до обращения к this в дочернем constructor. Если этого не сделать — ReferenceError: Must call super constructor before accessing "this".' }
      ]
    },
    {
      id: 4,
      title: 'Приватные поля и методы (#)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Приватные поля с # (ES2022) — настоящая инкапсуляция в JavaScript. Они недоступны снаружи класса, даже через прототип или Object.keys(). Это не просто соглашение, а языковая гарантия.' },
        { type: 'code', language: 'javascript', value: 'class BankAccount {\n  // Приватные поля объявляются с #\n  #balance;\n  #history = [];\n  #owner;\n\n  constructor(owner, initialBalance = 0) {\n    this.#owner   = owner;\n    this.#balance = initialBalance;\n  }\n\n  // Приватный метод\n  #validate(amount) {\n    if (amount <= 0) throw new Error("Сумма должна быть > 0");\n    return true;\n  }\n\n  deposit(amount) {\n    this.#validate(amount);\n    this.#balance += amount;\n    this.#history.push({ type: "deposit", amount });\n    return this;\n  }\n\n  withdraw(amount) {\n    this.#validate(amount);\n    if (amount > this.#balance) throw new Error("Недостаточно средств");\n    this.#balance -= amount;\n    this.#history.push({ type: "withdraw", amount });\n    return this;\n  }\n\n  get balance() { return this.#balance; }\n  get owner()   { return this.#owner; }\n  get history() { return [...this.#history]; }\n}\n\nconst acc = new BankAccount("Алия", 1000);\nacc.deposit(500).withdraw(200);\nconsole.log(acc.balance); // 1300\nconsole.log(acc.history); // [{...}, {...}]\n\n// Приватные поля недоступны снаружи:\nconsole.log(acc.balance); // 1300 (через getter — ок)\n// console.log(acc.#balance); // SyntaxError!!\nconsole.log(Object.keys(acc)); // [] — приватные поля скрыты!' },
        { type: 'note', value: 'Приватные поля # — настоящая приватность, в отличие от соглашения _field. Они не наследуются, недоступны через prototype tricks, и не видны в JSON.stringify.' }
      ]
    },
    {
      id: 5,
      title: 'Абстрактные классы и интерфейсы',
      type: 'theory',
      content: [
        { type: 'text', value: 'JavaScript не имеет встроенных абстрактных классов и интерфейсов, но их легко эмулировать через throw в методах и проверку в constructor.' },
        { type: 'code', language: 'javascript', value: '// Абстрактный базовый класс\nclass Shape {\n  constructor() {\n    if (new.target === Shape) {\n      throw new Error("Shape — абстрактный класс, нельзя создать напрямую");\n    }\n  }\n\n  // Абстрактные методы — должны быть реализованы\n  area() {\n    throw new Error(`${this.constructor.name} должен реализовать area()`);\n  }\n  perimeter() {\n    throw new Error(`${this.constructor.name} должен реализовать perimeter()`);\n  }\n\n  // Конкретный метод (с реализацией)\n  describe() {\n    return `${this.constructor.name}: площадь=${this.area().toFixed(2)}, периметр=${this.perimeter().toFixed(2)}`;\n  }\n}\n\nclass Circle extends Shape {\n  constructor(radius) {\n    super();\n    this.radius = radius;\n  }\n  area()      { return Math.PI * this.radius ** 2; }\n  perimeter() { return 2 * Math.PI * this.radius; }\n}\n\nclass Rectangle extends Shape {\n  constructor(w, h) { super(); this.w = w; this.h = h; }\n  area()      { return this.w * this.h; }\n  perimeter() { return 2 * (this.w + this.h); }\n}\n\n// new Shape(); // Error: абстрактный!\nconst c = new Circle(5);\nconsole.log(c.describe());\n// "Circle: площадь=78.54, периметр=31.42"' },
        { type: 'tip', value: 'new.target — ссылка на конструктор, вызванный через new. Если new.target === ИмяКласса, значит этот класс вызван напрямую. Это позволяет запретить создание "абстрактных" классов.' }
      ]
    },
    {
      id: 6,
      title: 'Mixins — множественное наследование',
      type: 'theory',
      content: [
        { type: 'text', value: 'JavaScript поддерживает только одиночное наследование через extends. Mixins — паттерн для добавления методов из нескольких источников.' },
        { type: 'code', language: 'javascript', value: '// Mixin — функция, принимающая класс и возвращающая расширенный класс\nconst Serializable = (Base) => class extends Base {\n  serialize() {\n    return JSON.stringify(this);\n  }\n  static deserialize(json) {\n    return Object.assign(new this(), JSON.parse(json));\n  }\n};\n\nconst Validatable = (Base) => class extends Base {\n  validate() {\n    const errors = [];\n    for (const [key, rules] of Object.entries(this.constructor.validationRules || {})) {\n      if (rules.required && !this[key]) errors.push(`${key} обязателен`);\n    }\n    return errors;\n  }\n};\n\nconst Timestamped = (Base) => class extends Base {\n  constructor(...args) {\n    super(...args);\n    this.createdAt = new Date().toISOString();\n  }\n};\n\n// Применяем mixins через "цепочку расширений"\nclass User extends Serializable(Validatable(Timestamped(class {}))) {\n  static validationRules = { name: { required: true }, email: { required: true } };\n\n  constructor(name, email) {\n    super();\n    this.name  = name;\n    this.email = email;\n  }\n}\n\nconst user = new User("Алия", "aliya@mail.kz");\nconsole.log(user.serialize()); // JSON строка\nconsole.log(user.validate());  // [] (нет ошибок)\nconsole.log(user.createdAt);   // ISO дата' },
        { type: 'note', value: 'Mixins через функции высшего порядка — элегантное решение для множественного наследования. Каждый mixin — чистая функция (Base) => class extends Base, что делает их компонуемыми.' }
      ]
    },
    {
      id: 7,
      title: 'Паттерн Singleton и другие',
      type: 'theory',
      content: [
        { type: 'text', value: 'Классы ES6 удобны для реализации классических паттернов проектирования: Singleton, Observer, Builder.' },
        { type: 'code', language: 'javascript', value: '// Singleton\nclass Config {\n  static #instance = null;\n  #settings = {};\n\n  constructor() {\n    if (Config.#instance) {\n      return Config.#instance;\n    }\n    Config.#instance = this;\n  }\n\n  set(key, value) { this.#settings[key] = value; return this; }\n  get(key)        { return this.#settings[key]; }\n\n  static getInstance() {\n    if (!Config.#instance) new Config();\n    return Config.#instance;\n  }\n}\n\nconst cfg1 = Config.getInstance();\nconst cfg2 = Config.getInstance();\nconsole.log(cfg1 === cfg2); // true — один экземпляр!\n\ncfg1.set("theme", "dark");\nconsole.log(cfg2.get("theme")); // "dark" (тот же объект!)' },
        { type: 'code', language: 'javascript', value: '// Builder паттерн\nclass QueryBuilder {\n  #table = "";\n  #conditions = [];\n  #orderBy = null;\n  #limitVal = null;\n\n  from(table) { this.#table = table; return this; }\n  where(cond)  { this.#conditions.push(cond); return this; }\n  order(field) { this.#orderBy = field; return this; }\n  limit(n)     { this.#limitVal = n; return this; }\n\n  build() {\n    let q = `SELECT * FROM ${this.#table}`;\n    if (this.#conditions.length) q += ` WHERE ${this.#conditions.join(" AND ")}`;\n    if (this.#orderBy) q += ` ORDER BY ${this.#orderBy}`;\n    if (this.#limitVal) q += ` LIMIT ${this.#limitVal}`;\n    return q;\n  }\n}\n\nconst sql = new QueryBuilder()\n  .from("users")\n  .where("active = 1")\n  .where("age > 18")\n  .order("name")\n  .limit(10)\n  .build();\nconsole.log(sql);\n// SELECT * FROM users WHERE active = 1 AND age > 18 ORDER BY name LIMIT 10' }
      ]
    },
    {
      id: 8,
      title: 'Практика: иерархия фигур',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй иерархию геометрических фигур с приватными полями, геттерами и абстрактным базовым классом.',
      requirements: [
        'Абстрактный класс Shape с методами area() и perimeter() (бросают Error если не переопределены)',
        'Circle(radius) с приватным #radius, getter area и perimeter',
        'Rectangle(width, height) с приватными полями',
        'Triangle(a, b, c) с проверкой корректности треугольника в constructor, метод isRight()',
        'Функция largestArea(shapes) — возвращает фигуру с наибольшей площадью'
      ],
      hint: 'Для Triangle: проверь что a + b > c (и все перестановки). isRight(): теорема Пифагора — a² + b² === c² (с погрешностью для float). Используй Math.hypot.',
      expectedOutput: 'circle.area() -> 78.54 (для радиуса 5)\nrectangle.perimeter() -> 30 (для 5x10)\nshape.area() -> ошибка "Метод area() должен быть реализован"\ncircle.toString() -> "Circle(r=5)"',
      solution: 'class Shape {\n  constructor() {\n    if (new.target === Shape) throw new Error("Shape абстрактный");\n  }\n  area()      { throw new Error("Реализуй area()"); }\n  perimeter() { throw new Error("Реализуй perimeter()"); }\n  toString()  { return `${this.constructor.name}(area=${this.area().toFixed(2)})`; }\n}\n\nclass Circle extends Shape {\n  #radius;\n  constructor(radius) {\n    super();\n    if (radius <= 0) throw new RangeError("Радиус должен быть > 0");\n    this.#radius = radius;\n  }\n  get radius() { return this.#radius; }\n  area()       { return Math.PI * this.#radius ** 2; }\n  perimeter()  { return 2 * Math.PI * this.#radius; }\n}\n\nclass Rectangle extends Shape {\n  #w; #h;\n  constructor(w, h) {\n    super();\n    this.#w = w; this.#h = h;\n  }\n  area()      { return this.#w * this.#h; }\n  perimeter() { return 2 * (this.#w + this.#h); }\n}\n\nclass Triangle extends Shape {\n  #a; #b; #c;\n  constructor(a, b, c) {\n    super();\n    if (a + b <= c || a + c <= b || b + c <= a)\n      throw new Error("Некорректный треугольник");\n    this.#a = a; this.#b = b; this.#c = c;\n  }\n  perimeter() { return this.#a + this.#b + this.#c; }\n  area() {\n    const s = this.perimeter() / 2;\n    return Math.sqrt(s * (s-this.#a) * (s-this.#b) * (s-this.#c));\n  }\n  isRight() {\n    const sides = [this.#a, this.#b, this.#c].sort((a,b) => a-b);\n    return Math.abs(sides[0]**2 + sides[1]**2 - sides[2]**2) < 1e-10;\n  }\n}\n\nfunction largestArea(shapes) {\n  return shapes.reduce((max, s) => s.area() > max.area() ? s : max);\n}\n\nconst shapes = [new Circle(5), new Rectangle(4, 6), new Triangle(3, 4, 5)];\nconsole.log(largestArea(shapes).toString()); // Circle(area=78.54)\nconsole.log(new Triangle(3, 4, 5).isRight()); // true',
      explanation: 'Shape проверяет new.target для запрета создания напрямую. Приватные поля # гарантируют инкапсуляцию. Triangle валидирует неравенство треугольника в конструкторе. isRight использует теорему Пифагора с поправкой на погрешность Float. largestArea использует reduce для нахождения максимума.'
    }
  ]
}
