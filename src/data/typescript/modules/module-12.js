export default {
  id: 12,
  title: 'Utility Types',
  description: 'Встроенные утилитарные типы TypeScript: Partial, Required, Readonly, Pick, Omit, Record, Exclude, Extract, NonNullable и их применение на практике.',
  lessons: [
    {
      id: 1,
      title: 'Partial, Required, Readonly',
      type: 'theory',
      content: [
        { type: 'text', value: 'Три фундаментальных utility type для трансформации обязательности свойств.' },
        { type: 'code', language: 'typescript', value: 'interface Task {\n    id: number;\n    title: string;\n    description: string;\n    dueDate: Date;\n    completed: boolean;\n}\n\n// Partial<T> — все поля становятся опциональными\n// Используется для частичного обновления (PATCH запросы)\ntype TaskUpdate = Partial<Task>;\nfunction updateTask(id: number, updates: TaskUpdate): void {\n    // Обновляем только переданные поля\n}\nupdateTask(1, { title: "Новый заголовок" }); // OK — остальное не нужно\n\n// Required<T> — все поля становятся обязательными\ntype CompleteTask = Required<TaskUpdate>; // Снова всё обязательно\n\n// Readonly<T> — все поля только для чтения\nconst frozenTask: Readonly<Task> = {\n    id: 1, title: "Задача", description: "Описание",\n    dueDate: new Date(), completed: false\n};\n// frozenTask.title = "другое"; — Ошибка!',
        },
        { type: 'tip', value: 'Partial + Omit — популярный паттерн для CreateDTO: Omit<User, "id"> (без ID) или Partial<Omit<User, "id">> (опциональное создание).' }
      ]
    },
    {
      id: 2,
      title: 'Pick и Omit',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pick выбирает подмножество полей, Omit исключает поля. Незаменимы для создания DTO и проекций.' },
        { type: 'code', language: 'typescript', value: 'interface User {\n    id: number;\n    name: string;\n    email: string;\n    password: string;\n    role: "admin" | "user";\n    createdAt: Date;\n}\n\n// Pick — выбираем только нужные поля\ntype UserPublic = Pick<User, "id" | "name" | "role">;\n// { id: number; name: string; role: "admin" | "user"; }\n\n// Omit — убираем секретные поля\ntype UserSafe = Omit<User, "password">;\n// Всё кроме password\n\n// CreateDTO — без ID и createdAt (они генерируются)\ntype CreateUserDTO = Omit<User, "id" | "createdAt">;\n\n// UpdateDTO — ID обязателен, остальное опционально\ntype UpdateUserDTO = Pick<User, "id"> & Partial<Omit<User, "id">>;' },
        { type: 'note', value: 'Omit<User, "password"> безопаснее чем вручную писать интерфейс без password — при добавлении поля в User, Omit автоматически его включит.' }
      ]
    },
    {
      id: 3,
      title: 'Record',
      type: 'theory',
      content: [
        { type: 'text', value: 'Record<K, V> создаёт тип объекта с ключами типа K и значениями типа V.' },
        { type: 'code', language: 'typescript', value: '// Словарь с строковыми ключами\ntype StringMap = Record<string, string>;\nconst translations: StringMap = { hello: "привет", bye: "пока" };\n\n// Объект с конкретными ключами (часто + literal types)\ntype DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";\ntype WorkSchedule = Record<DayOfWeek, boolean>;\n\nconst schedule: WorkSchedule = {\n    Mon: true, Tue: true, Wed: true, Thu: true, Fri: true,\n    Sat: false, Sun: false\n};\n// TypeScript проверяет что все 7 дней указаны!\n\n// Record с интерфейсом как значением\ntype UserById = Record<number, User>;\nconst users: UserById = {\n    1: { id: 1, name: "Алибек" },\n    2: { id: 2, name: "Жанар" }\n};' },
        { type: 'tip', value: 'Record<LiteralUnion, V> гарантирует полное покрытие: TypeScript выдаст ошибку если не все ключи указаны. Это лучше чем { [key: string]: V }.' }
      ]
    },
    {
      id: 4,
      title: 'Exclude, Extract, NonNullable',
      type: 'theory',
      content: [
        { type: 'text', value: 'Три utility type для работы с union типами: Exclude убирает типы, Extract оставляет совпадающие, NonNullable убирает null/undefined.' },
        { type: 'code', language: 'typescript', value: 'type A = "a" | "b" | "c" | "d";\ntype B = "b" | "d";\n\n// Exclude — убрать типы из A которые есть в B\ntype OnlyA = Exclude<A, B>; // "a" | "c"\n\n// Extract — оставить типы из A которые есть в B\ntype InBoth = Extract<A, B>; // "b" | "d"\n\n// NonNullable — убрать null и undefined\ntype C = string | number | null | undefined;\ntype NotNull = NonNullable<C>; // string | number\n\n// Практическое применение\ntype EventType = "click" | "submit" | "change" | "focus";\ntype InteractiveEvents = Exclude<EventType, "focus">; // убираем неинтерактивные\n// "click" | "submit" | "change"\n\ntype StringEvents = Extract<EventType, `${"click" | "change"}`>; // "click" | "change"' }
      ]
    },
    {
      id: 5,
      title: 'ReturnType, Parameters, InstanceType',
      type: 'theory',
      content: [
        { type: 'text', value: 'Utility types для работы с типами функций и классов.' },
        { type: 'code', language: 'typescript', value: 'function createUser(name: string, age: number, role: "admin" | "user") {\n    return { id: Math.random(), name, age, role, createdAt: new Date() };\n}\n\n// ReturnType — тип возвращаемого значения\ntype User = ReturnType<typeof createUser>;\n// { id: number; name: string; age: number; role: "admin"|"user"; createdAt: Date; }\n\n// Parameters — типы параметров функции\ntype CreateParams = Parameters<typeof createUser>;\n// [name: string, age: number, role: "admin" | "user"]\n\ntype FirstParam = Parameters<typeof createUser>[0]; // string\n\n// InstanceType — тип экземпляра класса\nclass Service {\n    constructor(public url: string) {}\n    fetch(): Promise<string> { return fetch(this.url).then(r => r.text()); }\n}\n\ntype ServiceInstance = InstanceType<typeof Service>; // Service' },
        { type: 'tip', value: 'ReturnType<typeof fn> полезен когда функция возвращает сложный объект без явного интерфейса — TypeScript автоматически выводит его тип.' }
      ]
    },
    {
      id: 6,
      title: 'Awaited и PromiseType',
      type: 'theory',
      content: [
        { type: 'text', value: 'Awaited (TypeScript 4.5+) разворачивает тип Promise, возвращая тип разрешённого значения.' },
        { type: 'code', language: 'typescript', value: '// Awaited — тип разрешённого значения Promise\ntype A = Awaited<Promise<string>>;          // string\ntype B = Awaited<Promise<Promise<number>>>;  // number (рекурсивно)\ntype C = Awaited<string>;                   // string (не Promise)\n\n// Практическое применение\nasync function fetchUser(id: number) {\n    const response = await fetch(`/api/users/${id}`);\n    return response.json() as Promise<{ id: number; name: string; }>;\n}\n\ntype FetchedUser = Awaited<ReturnType<typeof fetchUser>>;\n// { id: number; name: string; }\n\n// Комбинирование utility types\ntype ApiResult<T> = {\n    data: T;\n    timestamp: string;\n};\n\nasync function getUsers(): Promise<ApiResult<User[]>> {\n    return { data: [], timestamp: new Date().toISOString() };\n}\n\ntype UsersResult = Awaited<ReturnType<typeof getUsers>>;\n// ApiResult<User[]>' }
      ]
    },
    {
      id: 7,
      title: 'Практика: типобезопасный API клиент',
      type: 'practice',
      difficulty: 'hard',
      description: 'Используйте utility types для создания типобезопасного API клиента с DTO-трансформациями.',
      requirements: [
        'interface UserEntity { id: number; name: string; email: string; passwordHash: string; createdAt: Date; }',
        'type CreateUserDTO = Omit<UserEntity, "id" | "passwordHash" | "createdAt"> & { password: string; }',
        'type UpdateUserDTO = Pick<UserEntity, "id"> & Partial<Pick<UserEntity, "name" | "email">>',
        'type UserResponse = Omit<UserEntity, "passwordHash">',
        'class UserApiClient с методами create(dto: CreateUserDTO): Promise<UserResponse>, update(dto: UpdateUserDTO): Promise<UserResponse>, getById(id: number): Promise<UserResponse>'
      ],
      expectedOutput: 'Создан: {id: 1, name: "Алибек", email: "alibek@test.com", createdAt: "..."}\nОбновлён: {id: 1, name: "Алибек Иванов", email: "alibek@test.com", createdAt: "..."}',
      hint: 'create убирает password и добавляет id, passwordHash, createdAt. Используйте деструктуризацию: const { password, ...rest } = dto.',
      solution: 'interface UserEntity {\n    id: number;\n    name: string;\n    email: string;\n    passwordHash: string;\n    createdAt: Date;\n}\n\ntype CreateUserDTO = Omit<UserEntity, "id" | "passwordHash" | "createdAt"> & { password: string; };\ntype UpdateUserDTO = Pick<UserEntity, "id"> & Partial<Pick<UserEntity, "name" | "email">>;\ntype UserResponse = Omit<UserEntity, "passwordHash">;\n\nclass UserApiClient {\n    private users = new Map<number, UserEntity>();\n    private nextId = 1;\n\n    async create(dto: CreateUserDTO): Promise<UserResponse> {\n        const { password, ...rest } = dto;\n        const entity: UserEntity = {\n            ...rest,\n            id: this.nextId++,\n            passwordHash: `hash_${password}`,\n            createdAt: new Date()\n        };\n        this.users.set(entity.id, entity);\n        const { passwordHash, ...response } = entity;\n        return response;\n    }\n\n    async update(dto: UpdateUserDTO): Promise<UserResponse> {\n        const existing = this.users.get(dto.id);\n        if (!existing) throw new Error("Пользователь не найден");\n        const updated = { ...existing, ...dto };\n        this.users.set(dto.id, updated);\n        const { passwordHash, ...response } = updated;\n        return response;\n    }\n\n    async getById(id: number): Promise<UserResponse> {\n        const entity = this.users.get(id);\n        if (!entity) throw new Error("Не найден");\n        const { passwordHash, ...response } = entity;\n        return response;\n    }\n}\n\nasync function main() {\n    const client = new UserApiClient();\n    const user = await client.create({ name: "Алибек", email: "alibek@test.com", password: "secret" });\n    console.log("Создан:", JSON.stringify(user));\n    const updated = await client.update({ id: user.id, name: "Алибек Иванов" });\n    console.log("Обновлён:", JSON.stringify(updated));\n}\n\nmain();',
      explanation: 'Omit исключает поля passwordHash из ответа на уровне типов. Деструктуризация { passwordHash, ...response } убирает его из объекта в рантайме. TypeScript гарантирует соответствие типов на всех этапах.'
    }
  ]
}
