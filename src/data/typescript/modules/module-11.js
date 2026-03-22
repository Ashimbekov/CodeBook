export default {
  id: 11,
  title: 'Generics',
  description: 'Обобщённое программирование в TypeScript: дженерик функции, классы, интерфейсы, ограничения, условные типы и infer.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужны Generics?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Generics (обобщения) позволяют писать переиспользуемый код, который работает с разными типами, сохраняя типобезопасность.' },
        { type: 'code', language: 'typescript', value: '// Без generics — пришлось бы писать для каждого типа\nfunction firstString(arr: string[]): string | undefined { return arr[0]; }\nfunction firstNumber(arr: number[]): number | undefined { return arr[0]; }\n// ... и так для каждого типа\n\n// С any — теряем типобезопасность\nfunction firstAny(arr: any[]): any { return arr[0]; } // тип возврата any!\n\n// С Generic — переиспользуемо И типобезопасно!\nfunction first<T>(arr: T[]): T | undefined {\n    return arr[0];\n}\n\nconst n = first([1, 2, 3]);           // n: number | undefined\nconst s = first(["a", "b"]);          // s: string | undefined\nconst u = first([{ id: 1 }, { id: 2 }]); // u: {id: number} | undefined' },
        { type: 'note', value: 'T — традиционное имя типового параметра (от "Type"). Можно использовать любое имя: T, U, K, V, TItem, TResult. Имена-буквы — для простых случаев, слова — для сложных.' }
      ]
    },
    {
      id: 2,
      title: 'Дженерик функции',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: '// Несколько типовых параметров\nfunction zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {\n    const length = Math.min(arr1.length, arr2.length);\n    return Array.from({ length }, (_, i) => [arr1[i], arr2[i]]);\n}\n\nconst zipped = zip([1, 2, 3], ["a", "b", "c"]);\n// zipped: [number, string][] = [[1,"a"],[2,"b"],[3,"c"]]\n\n// Дженерик с несколькими параметрами\nfunction mapObject<K extends string, T, U>(\n    obj: Record<K, T>,\n    fn: (value: T, key: K) => U\n): Record<K, U> {\n    const result = {} as Record<K, U>;\n    for (const key in obj) {\n        result[key] = fn(obj[key], key);\n    }\n    return result;\n}\n\nconst doubled = mapObject({ a: 1, b: 2, c: 3 }, v => v * 2);\n// { a: 2, b: 4, c: 6 }' }
      ]
    },
    {
      id: 3,
      title: 'Ограничения Generics (extends)',
      type: 'theory',
      content: [
        { type: 'text', value: 'extends в generic параметре ограничивает допустимые типы — T должен "быть совместим с" (иметь поля/методы) указанного типа.' },
        { type: 'code', language: 'typescript', value: '// T должен иметь поле length\nfunction getLength<T extends { length: number }>(value: T): number {\n    return value.length;\n}\n\nconsole.log(getLength("hello"));     // 5 — string имеет length\nconsole.log(getLength([1, 2, 3]));   // 3 — array имеет length\n// getLength(42); — Ошибка: number нет поля length\n\n// keyof: ключи объекта\nfunction getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n    return obj[key];\n}\n\nconst user = { name: "Алибек", age: 25 };\nconst name = getProperty(user, "name"); // name: string\nconst age  = getProperty(user, "age");  // age: number\n// getProperty(user, "email"); — Ошибка: нет ключа "email"!' },
        { type: 'tip', value: 'K extends keyof T — паттерн для типобезопасного доступа к полям объекта. TypeScript знает точный тип T[K] для каждого ключа K.' }
      ]
    },
    {
      id: 4,
      title: 'Дженерик интерфейсы и классы',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: '// Дженерик интерфейс\ninterface Repository<T> {\n    findById(id: number): T | undefined;\n    findAll(): T[];\n    save(item: T): void;\n    delete(id: number): void;\n}\n\n// Реализация для конкретного типа\nclass InMemoryUserRepo implements Repository<User> {\n    private users = new Map<number, User>();\n    findById(id: number): User | undefined { return this.users.get(id); }\n    findAll(): User[] { return Array.from(this.users.values()); }\n    save(user: User): void { this.users.set(user.id, user); }\n    delete(id: number): void { this.users.delete(id); }\n}\n\n// Дженерик класс\nclass Pair<First, Second> {\n    constructor(public first: First, public second: Second) {}\n    swap(): Pair<Second, First> {\n        return new Pair(this.second, this.first);\n    }\n}\n\nconst pair = new Pair("hello", 42);\nconst swapped = pair.swap(); // Pair<number, string>' }
      ]
    },
    {
      id: 5,
      title: 'Условные типы (Conditional Types)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Условные типы позволяют выбирать тип на основе условия: T extends U ? X : Y.' },
        { type: 'code', language: 'typescript', value: '// Базовый условный тип\ntype IsString<T> = T extends string ? true : false;\ntype A = IsString<string>;  // true\ntype B = IsString<number>;  // false\n\n// NonNullable — встроенный условный тип\ntype NonNullable<T> = T extends null | undefined ? never : T;\ntype C = NonNullable<string | null>;    // string\ntype D = NonNullable<number | undefined>; // number\n\n// Распределение по union\ntype UnpackArray<T> = T extends (infer Item)[] ? Item : T;\ntype E = UnpackArray<string[]>;  // string\ntype F = UnpackArray<number>;    // number (не массив)\n\n// Практический пример\ntype Awaited<T> = T extends Promise<infer R> ? R : T;\ntype G = Awaited<Promise<string>>;  // string\ntype H = Awaited<string>;           // string (не Promise)' },
        { type: 'note', value: 'infer — ключевое слово для "захвата" части типа. infer R в T extends Promise<infer R> захватывает тип результата Promise.' }
      ]
    },
    {
      id: 6,
      title: 'Встроенные дженерик типы',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript предоставляет много встроенных дженерик типов для трансформации типов.' },
        { type: 'code', language: 'typescript', value: 'interface User { id: number; name: string; email: string; age: number; }\n\n// Partial — все поля опциональны (для update)\ntype UpdateUser = Partial<User>; // { id?: number; name?: string; ... }\n\n// Required — все поля обязательны\ntype RequiredUser = Required<Partial<User>>; // обратно к User\n\n// Pick — только выбранные поля\ntype UserPreview = Pick<User, "id" | "name">; // { id: number; name: string; }\n\n// Omit — все поля кроме выбранных\ntype UserWithoutId = Omit<User, "id">; // { name, email, age }\n\n// ReturnType — тип возвращаемого значения функции\nfunction createUser(): User { return { id: 1, name: "X", email: "x@x.com", age: 20 }; }\ntype CreatedUser = ReturnType<typeof createUser>; // User\n\n// Parameters — типы параметров функции\ntype CreateUserParams = Parameters<(name: string, age: number) => User>;\n// [name: string, age: number]' },
        { type: 'tip', value: 'Omit<User, "id"> — частый паттерн для CreateUserDTO (при создании ID генерируется сервером, не нужен в запросе).' }
      ]
    },
    {
      id: 7,
      title: 'infer и продвинутые паттерны',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: '// Тип первого параметра функции\ntype FirstParam<T> = T extends (first: infer F, ...rest: unknown[]) => unknown ? F : never;\ntype P = FirstParam<(name: string, age: number) => void>; // string\n\n// Глубокий Readonly (рекурсивный)\ntype DeepReadonly<T> = {\n    readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];\n};\n\ninterface Config {\n    server: { host: string; port: number; };\n    db: { url: string; };\n}\n\nconst config: DeepReadonly<Config> = {\n    server: { host: "localhost", port: 3000 },\n    db: { url: "postgres://..." }\n};\n// config.server.host = "other"; — Ошибка: readonly!' }
      ]
    },
    {
      id: 8,
      title: 'Практика: типобезопасный event emitter',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте полностью типобезопасный EventEmitter с дженериками.',
      requirements: [
        'type EventMap = Record<string, unknown[]> — карта событий: имя -> аргументы',
        'class TypedEventEmitter<Events extends EventMap>',
        'on<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): void',
        'emit<K extends keyof Events>(event: K, ...args: Events[K]): void',
        'off<K extends keyof Events>(event: K, listener: Function): void'
      ],
      expectedOutput: 'Пользователь создан: Алибек, 25\nСчётчик: 1\nСчётчик: 2',
      hint: 'Внутри хранить Map<keyof Events, Function[]>. emit вызывает всех подписчиков с ...args.',
      solution: 'type EventMap = Record<string, unknown[]>;\n\nclass TypedEventEmitter<Events extends EventMap> {\n    private listeners = new Map<keyof Events, Function[]>();\n\n    on<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): void {\n        const existing = this.listeners.get(event) ?? [];\n        this.listeners.set(event, [...existing, listener]);\n    }\n\n    emit<K extends keyof Events>(event: K, ...args: Events[K]): void {\n        this.listeners.get(event)?.forEach(l => l(...args));\n    }\n\n    off<K extends keyof Events>(event: K, listener: Function): void {\n        const list = this.listeners.get(event) ?? [];\n        this.listeners.set(event, list.filter(l => l !== listener));\n    }\n}\n\n// Объявляем карту событий\ntype AppEvents = {\n    userCreated: [name: string, age: number];\n    counter: [value: number];\n    error: [message: string];\n};\n\nconst emitter = new TypedEventEmitter<AppEvents>();\n\nemitter.on("userCreated", (name, age) => {\n    console.log(`Пользователь создан: ${name}, ${age}`);\n});\n\nemitter.on("counter", (value) => console.log(`Счётчик: ${value}`));\n\nemitter.emit("userCreated", "Алибек", 25);\nemitter.emit("counter", 1);\nemitter.emit("counter", 2);',
      explanation: 'Events[K] — тип аргументов для события K. ...args: Events[K] — spread-параметры с правильным типом. TypeScript проверяет что emit вызывается с правильными аргументами для каждого события.'
    }
  ]
}
