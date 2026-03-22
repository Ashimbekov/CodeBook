export default {
  id: 21,
  title: 'Прототипы',
  description: 'Прототипная цепочка JavaScript: __proto__, prototype, Object.create, наследование через прототипы, методы Object для работы с прототипами.',
  lessons: [
    {
      id: 1,
      title: 'Прототипная модель JavaScript',
      type: 'theory',
      content: [
        { type: 'text', value: 'JavaScript — прототипно-ориентированный язык. Каждый объект имеет внутреннюю ссылку [[Prototype]] на другой объект (прототип). При поиске свойства JS идёт по цепочке прототипов.' },
        { type: 'code', language: 'javascript', value: 'const animal = {\n  type: "Животное",\n  eat() {\n    console.log(`${this.name} ест`);\n  },\n  sleep() {\n    console.log(`${this.name} спит`);\n  }\n};\n\nconst dog = {\n  name: "Бобик",\n  bark() {\n    console.log("Гав!");\n  }\n};\n\n// Устанавливаем прототип dog = animal\nObject.setPrototypeOf(dog, animal);\n// или при создании: const dog = Object.create(animal);\n\nconsole.log(dog.name);  // "Бобик" — своё свойство\nconsole.log(dog.type);  // "Животное" — из прототипа!\ndog.eat();  // "Бобик ест" — из прототипа, но this=dog\ndog.bark(); // "Гав!" — своё\n\n// hasOwnProperty — только свои свойства\nconsole.log(dog.hasOwnProperty("name")); // true (своё)\nconsole.log(dog.hasOwnProperty("type")); // false (из прототипа)' },
        { type: 'heading', value: 'Цепочка прототипов' },
        { type: 'code', language: 'javascript', value: 'const base = { a: 1 };\nconst middle = Object.create(base);  // [[Prototype]] = base\nmiddle.b = 2;\nconst obj = Object.create(middle); // [[Prototype]] = middle\nobj.c = 3;\n\n// Поиск по цепочке:\nconsole.log(obj.c); // 3  (собственное)\nconsole.log(obj.b); // 2  (из middle)\nconsole.log(obj.a); // 1  (из base)\nconsole.log(obj.d); // undefined (конец цепочки = Object.prototype)\n\n// Конец цепочки — Object.prototype\nconsole.log(Object.getPrototypeOf(base) === Object.prototype); // true\nconsole.log(Object.getPrototypeOf(Object.prototype)); // null (конец!)\n\n// in — проверяет всю цепочку\nconsole.log("a" in obj); // true (из base)\nconsole.log("a" in obj !== obj.hasOwnProperty("a")); // true' },
        { type: 'tip', value: 'Не используй __proto__ для установки прототипа — это устаревший способ. Используй Object.create() при создании или Object.setPrototypeOf() для существующих объектов.' }
      ]
    },
    {
      id: 2,
      title: 'prototype функций-конструкторов',
      type: 'theory',
      content: [
        { type: 'text', value: 'У каждой функции есть свойство prototype (объект). При вызове через new, создаётся объект, чьим [[Prototype]] становится этот prototype. Методы обычно добавляют в prototype для экономии памяти.' },
        { type: 'code', language: 'javascript', value: 'function Animal(name, sound) {\n  this.name = name;   // в каждом экземпляре\n  this.sound = sound;\n}\n\n// Методы — в prototype, не в каждом экземпляре!\nAnimal.prototype.speak = function() {\n  console.log(`${this.name}: ${this.sound}`);\n};\n\nAnimal.prototype.toString = function() {\n  return `[Animal: ${this.name}]`;\n};\n\nconst cat = new Animal("Мурка", "Мяу");\nconst dog = new Animal("Бобик", "Гав");\n\ncat.speak(); // "Мурка: Мяу"\ndog.speak(); // "Бобик: Гав"\n\n// Оба используют ОДИН speak из prototype!\nconsole.log(cat.speak === dog.speak); // true (одна функция!)\n\n// При добавлении метода на экземпляр — перекрывает прототип\ncat.speak = function() { console.log("Тихо..."); };\ncat.speak(); // "Тихо..."\ndog.speak(); // "Бобик: Гав" (прототип не изменился)' },
        { type: 'code', language: 'javascript', value: '// constructor — ссылка обратно на функцию\nconsole.log(cat.constructor === Animal); // true\nconsole.log(cat instanceof Animal);      // true\n\n// Связи:\n// cat.__proto__ === Animal.prototype (true)\n// Animal.prototype.constructor === Animal (true)\n// cat instanceof Animal проверяет цепочку' },
        { type: 'note', value: 'Размещение методов в prototype важно для производительности: 1000 объектов с методом в prototype = 1 функция в памяти. 1000 объектов с методом в this = 1000 функций. Классы ES6 делают это автоматически.' }
      ]
    },
    {
      id: 3,
      title: 'Object.create — создание с прототипом',
      type: 'theory',
      content: [
        { type: 'text', value: 'Object.create(proto) создаёт новый объект с указанным прототипом. Это чистый способ настроить наследование без функций-конструкторов.' },
        { type: 'code', language: 'javascript', value: '// Object.create(proto, propertiesDescriptor)\n\nconst personProto = {\n  greet() {\n    console.log(`Привет, я ${this.name}, мне ${this.age}`);\n  },\n  toString() {\n    return `Person(${this.name})`;\n  }\n};\n\n// Создание объекта с прототипом\nconst alice = Object.create(personProto);\nalice.name = "Алия";\nalice.age = 25;\nalice.greet(); // "Привет, я Алия, мне 25"\n\n// С дескриптором свойств\nconst bob = Object.create(personProto, {\n  name: { value: "Берик", writable: true, enumerable: true, configurable: true },\n  age:  { value: 30,      writable: true, enumerable: true, configurable: true }\n});\nbob.greet(); // "Привет, я Берик, мне 30"\n\n// Object.create(null) — объект БЕЗ прототипа (чистый словарь)\nconst dict = Object.create(null);\ndict.key = "value";\nconsole.log(dict.toString);  // undefined (нет Object.prototype!)\n// Используется для "чистых" словарей без прототипных методов' },
        { type: 'tip', value: 'Object.create(null) — создаёт объект без прототипной цепочки вообще. Используется для чистых словарей/hash-map, где ключи не должны конфликтовать с методами Object.prototype (hasOwnProperty, toString, etc).' }
      ]
    },
    {
      id: 4,
      title: 'Прототипное наследование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Наследование через прототипы: дочерний конструктор вызывает родительский через call(), метод дочернего prototype ставится как Object.create(Parent.prototype).' },
        { type: 'code', language: 'javascript', value: '// Родительский конструктор\nfunction Shape(color) {\n  this.color = color;\n}\nShape.prototype.getColor = function() {\n  return this.color;\n};\nShape.prototype.describe = function() {\n  return `${this.constructor.name}: цвет=${this.color}`;\n};\n\n// Дочерний конструктор\nfunction Circle(color, radius) {\n  Shape.call(this, color); // вызываем родительский конструктор!\n  this.radius = radius;\n}\n\n// Настройка цепочки прототипов\nCircle.prototype = Object.create(Shape.prototype);\nCircle.prototype.constructor = Circle; // восстанавливаем constructor!\n\nCircle.prototype.area = function() {\n  return Math.PI * this.radius ** 2;\n};\n\nCircle.prototype.describe = function() {\n  // Вызов родительского метода\n  const base = Shape.prototype.describe.call(this);\n  return `${base}, радиус=${this.radius}`;\n};\n\nconst c = new Circle("красный", 5);\nconsole.log(c.getColor()); // "красный" (из Shape)\nconsole.log(c.area());     // 78.5...\nconsole.log(c.describe()); // "Circle: цвет=красный, радиус=5"\nconsole.log(c instanceof Circle); // true\nconsole.log(c instanceof Shape);  // true (!)' },
        { type: 'note', value: 'Восстановление constructor важно: после Circle.prototype = Object.create(...) constructor указывает на Shape. Без исправления c.constructor === Shape (ошибка). В ES6 классах это происходит автоматически.' }
      ]
    },
    {
      id: 5,
      title: 'Object.getPrototypeOf и методы Object',
      type: 'theory',
      content: [
        { type: 'text', value: 'JavaScript предоставляет набор методов для работы с прототипами и свойствами объектов.' },
        { type: 'code', language: 'javascript', value: '// Получение прототипа\nconst arr = [1, 2, 3];\nconsole.log(Object.getPrototypeOf(arr) === Array.prototype); // true\nconsole.log(Object.getPrototypeOf(Array.prototype) === Object.prototype); // true\n\n// Проверка в цепочке\nfunction isPrototypeInChain(proto, obj) {\n  return proto.isPrototypeOf(obj);\n}\nconsole.log(Array.prototype.isPrototypeOf(arr)); // true\nconsole.log(Object.prototype.isPrototypeOf(arr)); // true\n\n// Дескрипторы свойств\nconst obj = { x: 1 };\nconst desc = Object.getOwnPropertyDescriptor(obj, "x");\nconsole.log(desc);\n// { value: 1, writable: true, enumerable: true, configurable: true }\n\n// Неперечисляемые свойства (hidden)\nObject.defineProperty(obj, "secret", {\n  value: 42,\n  writable: false,\n  enumerable: false,   // не в for...in, не в Object.keys\n  configurable: false\n});\nconsole.log(obj.secret); // 42\nconsole.log(Object.keys(obj)); // ["x"] — secret скрыт!\n\n// Все собственные свойства (включая неперечисляемые)\nconsole.log(Object.getOwnPropertyNames(obj)); // ["x", "secret"]' },
        { type: 'tip', value: 'Методы встроенных объектов (toString, hasOwnProperty и т.д.) сделаны неперечисляемыми специально — чтобы они не появлялись в for...in циклах.' }
      ]
    },
    {
      id: 6,
      title: 'Классы ES6 как синтаксический сахар',
      type: 'theory',
      content: [
        { type: 'text', value: 'Классы ES6 — это синтаксический сахар над прототипным наследованием. Под капотом работает тот же механизм прототипов, но синтаксис намного чище.' },
        { type: 'code', language: 'javascript', value: '// ES6 класс под капотом — те же прототипы\nclass Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {                          // -> Animal.prototype.speak\n    console.log(`${this.name} говорит`);\n  }\n}\n\nclass Dog extends Animal {\n  constructor(name, breed) {\n    super(name);                     // -> Animal.call(this, name)\n    this.breed = breed;\n  }\n  speak() {                          // -> Dog.prototype.speak\n    super.speak();                   // -> Animal.prototype.speak.call(this)\n    console.log("Гав!");\n  }\n}\n\n// Под капотом:\nconsole.log(typeof Animal); // "function"\nconsole.log(Dog.prototype instanceof Animal); // false (prototype, не экземпляр)\nconsole.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype); // true!\n\nconst d = new Dog("Бобик", "Лабрадор");\nd.speak();\n// "Бобик говорит"\n// "Гав!"' },
        { type: 'note', value: 'extends устанавливает двойное прототипирование: Dog.prototype.__proto__ = Animal.prototype (для наследования методов экземпляра) и Dog.__proto__ = Animal (для наследования статических методов).' }
      ]
    },
    {
      id: 7,
      title: 'Практика: прототипное наследование',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй иерархию классов через прототипное наследование (без class синтаксиса) и проверь цепочку прототипов.',
      requirements: [
        'Vehicle(make, model, year) с методами describe() и age()',
        'Car(make, model, year, doors) наследует Vehicle, добавляет метод honk()',
        'ElectricCar(make, model, year, doors, range) наследует Car, переопределяет describe()',
        'Проверь instanceof для всех уровней иерархии'
      ],
      hint: 'Паттерн: Child.prototype = Object.create(Parent.prototype); Child.prototype.constructor = Child; В конструкторе Child вызывай Parent.call(this, ...).',
      expectedOutput: 'animal.speak() -> "Животное издаёт звук"\ndog.speak() -> "Гав!"\ndog instanceof Animal -> true\nObject.getPrototypeOf(Dog.prototype) === Animal.prototype -> true',
      solution: 'function Vehicle(make, model, year) {\n  this.make  = make;\n  this.model = model;\n  this.year  = year;\n}\nVehicle.prototype.describe = function() {\n  return `${this.year} ${this.make} ${this.model}`;\n};\nVehicle.prototype.age = function() {\n  return new Date().getFullYear() - this.year;\n};\n\nfunction Car(make, model, year, doors) {\n  Vehicle.call(this, make, model, year);\n  this.doors = doors;\n}\nCar.prototype = Object.create(Vehicle.prototype);\nCar.prototype.constructor = Car;\nCar.prototype.honk = function() {\n  return "Бип-бип!";\n};\n\nfunction ElectricCar(make, model, year, doors, range) {\n  Car.call(this, make, model, year, doors);\n  this.range = range;\n}\nElectricCar.prototype = Object.create(Car.prototype);\nElectricCar.prototype.constructor = ElectricCar;\nElectricCar.prototype.describe = function() {\n  return Vehicle.prototype.describe.call(this) + ` (электро, ${this.range}км)`;\n};\n\nconst tesla = new ElectricCar("Tesla", "Model 3", 2023, 4, 500);\nconsole.log(tesla.describe()); // "2023 Tesla Model 3 (электро, 500км)"\nconsole.log(tesla.honk());     // "Бип-бип!"\nconsole.log(tesla.age());      // 2\nconsole.log(tesla instanceof ElectricCar); // true\nconsole.log(tesla instanceof Car);         // true\nconsole.log(tesla instanceof Vehicle);     // true',
      explanation: 'Трёхуровневая иерархия через прототипы. Каждый уровень: 1) Вызывает родительский конструктор через Call, 2) Устанавливает prototype через Object.create, 3) Восстанавливает constructor. ElectricCar переопределяет describe() и вызывает Vehicle.prototype.describe через call для базового описания.'
    }
  ]
}
