export default {
  id: 10,
  title: 'Классы',
  description: 'Классы в TypeScript: типизация свойств, модификаторы доступа, абстрактные классы, implements, декораторы и паттерны.',
  lessons: [
    {
      id: 1,
      title: 'Классы и типизация свойств',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript добавляет к классам ES6 строгую типизацию свойств, модификаторы доступа и параметрические свойства конструктора.' },
        { type: 'code', language: 'typescript', value: 'class Person {\n    // Явное объявление свойств с типами\n    name: string;\n    age: number;\n    private email: string;\n\n    constructor(name: string, age: number, email: string) {\n        this.name = name;\n        this.age = age;\n        this.email = email;\n    }\n\n    greet(): string {\n        return `Привет, я ${this.name}, мне ${this.age} лет`;\n    }\n}\n\n// Краткая запись: параметрические свойства\nclass PersonShort {\n    constructor(\n        public name: string,      // public свойство\n        private age: number,      // private свойство\n        protected email: string   // protected свойство\n    ) {}\n\n    greet(): string {\n        return `Привет, я ${this.name}`;\n    }\n}' },
        { type: 'tip', value: 'public/private/protected в параметрах конструктора — сокращение TypeScript. Они автоматически создают и инициализируют свойства класса.' }
      ]
    },
    {
      id: 2,
      title: 'Модификаторы доступа',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript поддерживает три модификатора доступа: public, private, protected. Также есть readonly.' },
        { type: 'list', value: 'public (по умолчанию) — доступно везде\nprivate — только внутри класса\nprotected — внутри класса и наследников\nreadonly — только для чтения после инициализации' },
        { type: 'code', language: 'typescript', value: 'class BankAccount {\n    readonly id: number;         // нельзя изменить извне\n    private balance: number;     // только методы класса\n    protected owner: string;     // класс и наследники\n    public currency: string;     // везде\n\n    constructor(id: number, owner: string, initialBalance: number) {\n        this.id = id;\n        this.owner = owner;\n        this.balance = initialBalance;\n        this.currency = "KZT";\n    }\n\n    deposit(amount: number): void {\n        this.balance += amount; // OK — метод класса\n    }\n\n    getBalance(): number {\n        return this.balance;\n    }\n}\n\nconst account = new BankAccount(1, "Алибек", 10000);\n// account.balance; — Ошибка: private\n// account.id = 2;  — Ошибка: readonly' },
        { type: 'warning', value: 'private TypeScript — только проверка на уровне типов! В скомпилированном JS свойство остаётся доступным. Для настоящего runtime private используйте #property (ES2020 private fields).' }
      ]
    },
    {
      id: 3,
      title: 'Наследование и implements',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: 'interface Printable {\n    print(): void;\n}\n\ninterface Serializable {\n    serialize(): string;\n}\n\nabstract class Shape implements Printable {\n    abstract area(): number;    // Должен быть реализован\n    abstract perimeter(): number;\n\n    print(): void {\n        console.log(`Площадь: ${this.area()}, периметр: ${this.perimeter()}`);\n    }\n}\n\nclass Circle extends Shape implements Serializable {\n    constructor(private radius: number) { super(); }\n\n    area(): number { return Math.PI * this.radius ** 2; }\n    perimeter(): number { return 2 * Math.PI * this.radius; }\n    serialize(): string { return JSON.stringify({ type: "circle", radius: this.radius }); }\n}\n\nconst circle = new Circle(5);\ncircle.print(); // Площадь: 78.5..., периметр: 31.4...' },
        { type: 'note', value: 'abstract класс нельзя инстанцировать напрямую. Он задаёт контракт для подклассов. implements — реализация интерфейса (проверяет что все методы реализованы).' },
        { type: 'list', items: [
          'extends — наследование: подкласс получает все методы и свойства родителя, abstract методы обязательны к реализации',
          'implements — реализация интерфейса: TypeScript проверяет наличие всех методов, объект класса не расширяется',
          'Класс может implements несколько интерфейсов через запятую: class C implements A, B',
          'super() в конструкторе дочернего класса — обязателен, вызывает конструктор родителя перед доступом к this',
          'Полиморфизм: переменная типа Shape может содержать Circle, Rectangle — TypeScript проверит совместимость'
        ]},
        { type: 'tip', value: 'Предпочитайте интерфейсы абстрактным классам для описания контрактов. Абстрактный класс используйте когда нужно общее поведение (шаблонный метод) плюс контракт.' }
      ]
    },
    {
      id: 4,
      title: 'Геттеры и сеттеры',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: 'class Temperature {\n    private _celsius: number;\n\n    constructor(celsius: number) {\n        this._celsius = celsius;\n    }\n\n    // Геттер\n    get fahrenheit(): number {\n        return this._celsius * 9/5 + 32;\n    }\n\n    // Сеттер с валидацией\n    set celsius(value: number) {\n        if (value < -273.15) {\n            throw new Error("Ниже абсолютного нуля!");\n        }\n        this._celsius = value;\n    }\n\n    get celsius(): number {\n        return this._celsius;\n    }\n}\n\nconst temp = new Temperature(0);\nconsole.log(temp.fahrenheit); // 32\ntemp.celsius = 100;\nconsole.log(temp.fahrenheit); // 212\n// temp.celsius = -300; — выброс исключения' },
        { type: 'tip', value: 'Геттеры/сеттеры позволяют добавить логику к "полям" сохраняя внешний интерфейс без явного вызова методов.' },
        { type: 'list', items: [
          'Геттер без сеттера — readonly свойство. TypeScript не позволит присвоить значение: "Cannot set property"',
          'Сеттер без геттера — write-only, читать нельзя. Редкий паттерн (например, для записи пароля)',
          'Типы геттера и сеттера должны быть совместимы: get celsius(): number, set celsius(v: number) — тип v должен быть number',
          'Геттеры ленивые: вычисляются при каждом обращении. Для дорогих вычислений кэшируй в приватном поле',
          'Интерфейс может объявлять readonly свойство, которое класс реализует через геттер: interface I { readonly name: string }'
        ]}
      ]
    },
    {
      id: 5,
      title: 'Статические члены',
      type: 'theory',
      content: [
        { type: 'text', value: 'static методы и свойства принадлежат классу, а не экземпляру. Они вызываются через имя класса.' },
        { type: 'code', language: 'typescript', value: 'class MathUtils {\n    static readonly PI: number = 3.14159;\n\n    static circleArea(r: number): number {\n        return MathUtils.PI * r * r;\n    }\n\n    static clamp(value: number, min: number, max: number): number {\n        return Math.max(min, Math.min(max, value));\n    }\n}\n\nconsole.log(MathUtils.PI); // 3.14159\nconsole.log(MathUtils.circleArea(5)); // 78.5\nconsole.log(MathUtils.clamp(15, 0, 10)); // 10\n\n// Singleton паттерн\nclass Database {\n    private static instance: Database | null = null;\n    private constructor() { console.log("Подключение к БД..."); }\n    static getInstance(): Database {\n        if (!Database.instance) Database.instance = new Database();\n        return Database.instance;\n    }\n}' },
        { type: 'list', items: [
          'static свойства/методы — на прототипе класса, а не экземпляра. this в статическом методе — сам класс',
          'static readonly — константы класса. Лучше чем отдельные const: связаны с контекстом класса',
          'Singleton: private constructor запрещает new, getInstance() контролирует создание единственного экземпляра',
          'static блок инициализации (ES2022+): static { this.config = loadConfig(); } — для сложной инициализации',
          'Наследование static: дочерний класс наследует статические методы, this указывает на текущий класс'
        ]},
        { type: 'tip', value: 'Фабричный метод — популярный паттерн для static: static create(...): MyClass. Лучше чем конструктор когда создание сложное или может вернуть null.' }
      ]
    },
    {
      id: 6,
      title: 'Дженерик классы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Классы могут быть обобщёнными (generic) — параметризованными по типу.' },
        { type: 'code', language: 'typescript', value: 'class Container<T> {\n    private value: T;\n\n    constructor(value: T) {\n        this.value = value;\n    }\n\n    getValue(): T { return this.value; }\n    setValue(newValue: T): void { this.value = newValue; }\n    map<U>(transform: (value: T) => U): Container<U> {\n        return new Container(transform(this.value));\n    }\n}\n\nconst num = new Container(42);\nconsole.log(num.getValue()); // 42\n\nconst str = num.map(n => n.toString());\nconsole.log(str.getValue()); // "42"\n\n// Stack — обобщённая структура данных\nclass Stack<T> {\n    private items: T[] = [];\n    push(item: T): void { this.items.push(item); }\n    pop(): T | undefined { return this.items.pop(); }\n    peek(): T | undefined { return this.items[this.items.length - 1]; }\n    get size(): number { return this.items.length; }\n}' },
        { type: 'list', items: [
          'class Container<T> — тип параметр T фиксируется при создании: new Container(42) выводит T = number',
          'Можно указать явно: new Container<string>("hello") — полезно когда TypeScript не может вывести тип',
          'Метод map<U> — свой тип параметр U, независимый от T класса. Позволяет возвращать Container другого типа',
          'Ограничения: class Repo<T extends Entity> — T должен иметь поля Entity (например id)',
          'Несколько параметров: class Pair<K, V> { constructor(public key: K, public value: V) {} }'
        ]},
        { type: 'tip', value: 'Дженерик классы — основа паттернов Repository, Service, EventEmitter. Один раз типизируешь базовый класс — все наследники автоматически типобезопасны.' }
      ]
    },
    {
      id: 7,
      title: 'Mixins',
      type: 'theory',
      content: [
        { type: 'text', value: 'Mixin — паттерн для добавления функциональности к классам без множественного наследования.' },
        { type: 'code', language: 'typescript', value: 'type Constructor<T = {}> = new (...args: unknown[]) => T;\n\n// Mixin добавляет метод timestamp\nfunction Timestamped<TBase extends Constructor>(Base: TBase) {\n    return class extends Base {\n        createdAt = new Date();\n        getAge(): number {\n            return Date.now() - this.createdAt.getTime();\n        }\n    };\n}\n\n// Mixin добавляет логирование\nfunction Loggable<TBase extends Constructor>(Base: TBase) {\n    return class extends Base {\n        log(msg: string) { console.log(`[LOG] ${msg}`); }\n    };\n}\n\nclass User {\n    constructor(public name: string) {}\n}\n\nconst TimestampedUser = Timestamped(User);\nconst LoggableTimestampedUser = Loggable(TimestampedUser);\n\nconst user = new LoggableTimestampedUser("Алибек");\nuser.log(`Создан пользователь: ${user.name}`);' },
        { type: 'tip', value: 'Mixins решают проблему множественного наследования. Вместо наследования от нескольких классов — компонуем функциональность.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: система управления товарами',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте систему управления товарами магазина с использованием классов, интерфейсов и дженериков.',
      requirements: [
        'interface IProduct { id: number; name: string; price: number; }',
        'abstract class BaseRepository<T extends { id: number }> с методами getById, getAll, add, remove',
        'class ProductRepository extends BaseRepository<IProduct> с дополнительным методом findByPriceRange',
        'class CartItem { product: IProduct; quantity: number; get total(): number }',
        'class ShoppingCart с методами addItem, removeItem, get totalPrice, printReceipt'
      ],
      expectedOutput: 'Чек:\n- Ноутбук x1: 150000 тг\n- Мышь x2: 5000 тг\nИтого: 155000 тг',
      hint: 'BaseRepository использует Map<number, T> для хранения. CartItem.total = product.price * quantity.',
      solution: 'interface IProduct { id: number; name: string; price: number; }\n\nabstract class BaseRepository<T extends { id: number }> {\n    protected items = new Map<number, T>();\n    add(item: T): void { this.items.set(item.id, item); }\n    remove(id: number): void { this.items.delete(id); }\n    getById(id: number): T | undefined { return this.items.get(id); }\n    getAll(): T[] { return Array.from(this.items.values()); }\n}\n\nclass ProductRepository extends BaseRepository<IProduct> {\n    findByPriceRange(min: number, max: number): IProduct[] {\n        return this.getAll().filter(p => p.price >= min && p.price <= max);\n    }\n}\n\nclass CartItem {\n    constructor(public product: IProduct, public quantity: number) {}\n    get total(): number { return this.product.price * this.quantity; }\n}\n\nclass ShoppingCart {\n    private items: CartItem[] = [];\n    addItem(product: IProduct, quantity: number = 1): void {\n        const existing = this.items.find(i => i.product.id === product.id);\n        if (existing) existing.quantity += quantity;\n        else this.items.push(new CartItem(product, quantity));\n    }\n    get totalPrice(): number { return this.items.reduce((sum, i) => sum + i.total, 0); }\n    printReceipt(): void {\n        console.log("Чек:");\n        this.items.forEach(i => console.log(`- ${i.product.name} x${i.quantity}: ${i.total} тг`));\n        console.log(`Итого: ${this.totalPrice} тг`);\n    }\n}\n\nconst repo = new ProductRepository();\nrepo.add({ id: 1, name: "Ноутбук", price: 150000 });\nrepo.add({ id: 2, name: "Мышь", price: 2500 });\n\nconst cart = new ShoppingCart();\ncart.addItem(repo.getById(1)!, 1);\ncart.addItem(repo.getById(2)!, 2);\ncart.printReceipt();',
      explanation: 'T extends { id: number } — ограничение generic гарантирует что у объектов есть поле id. Map<number, T> даёт O(1) поиск по ID. get total() — геттер для вычисляемого свойства.'
    }
  ]
}
