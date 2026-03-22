export default {
  id: 21,
  title: 'Практикум: Основы',
  description: 'Практические задания на базовые типы, интерфейсы, функции, классы и стандартные паттерны TypeScript',
  lessons: [
    {
      id: 1,
      title: 'Задание: Калькулятор с типами',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте типизированный калькулятор с поддержкой всех базовых операций и обработкой ошибок (деление на ноль).',
      requirements: [
        'Тип Operation: "add" | "subtract" | "multiply" | "divide"',
        'Функция calculate(a: number, b: number, op: Operation): number',
        'Бросает TypeError при делении на ноль',
        'Все 4 операции должны быть реализованы'
      ],
      hint: 'Используйте switch по operation. Для деления проверяйте b === 0.',
      solution: 'type Operation = "add" | "subtract" | "multiply" | "divide";\n\nfunction calculate(a: number, b: number, op: Operation): number {\n  switch (op) {\n    case "add":      return a + b;\n    case "subtract": return a - b;\n    case "multiply": return a * b;\n    case "divide":\n      if (b === 0) throw new TypeError("Деление на ноль!");\n      return a / b;\n  }\n}\n\nconsole.log(calculate(10, 5, "add"));      // 15\nconsole.log(calculate(10, 5, "subtract")); // 5\nconsole.log(calculate(10, 5, "multiply")); // 50\nconsole.log(calculate(10, 5, "divide"));   // 2\ntry { calculate(10, 0, "divide"); } catch (e: unknown) {\n  if (e instanceof TypeError) console.log(e.message); // Деление на ноль!\n}',
      explanation: 'Union тип Operation ограничивает допустимые значения. switch по нему — exhaustive: TypeScript выдаст ошибку если добавить новую операцию. TypeError — правильное исключение для неверного аргумента.'
    },
    {
      id: 2,
      title: 'Задание: Стек на дженериках',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте generic класс Stack<T> с методами push, pop, peek, isEmpty и size.',
      requirements: [
        'class Stack<T> с приватным массивом',
        'push(item: T): void — добавить на вершину',
        'pop(): T — извлечь с вершины (бросает ошибку если пуст)',
        'peek(): T — посмотреть вершину (не удалять)',
        'isEmpty(): boolean и size: number (геттер)'
      ],
      hint: 'Храните элементы в private items: T[] = []. pop() и peek() должны проверять isEmpty().',
      solution: 'class Stack<T> {\n  private items: T[] = [];\n\n  push(item: T): void {\n    this.items.push(item);\n  }\n\n  pop(): T {\n    if (this.isEmpty()) throw new Error("Стек пуст!");\n    return this.items.pop()!;\n  }\n\n  peek(): T {\n    if (this.isEmpty()) throw new Error("Стек пуст!");\n    return this.items[this.items.length - 1];\n  }\n\n  isEmpty(): boolean { return this.items.length === 0; }\n\n  get size(): number { return this.items.length; }\n}\n\nconst stack = new Stack<number>();\nstack.push(1); stack.push(2); stack.push(3);\nconsole.log(stack.size); // 3\nconsole.log(stack.peek()); // 3\nconsole.log(stack.pop()); // 3\nconsole.log(stack.size); // 2',
      explanation: 'Generic класс Stack<T> работает с любым типом. Компилятор проверяет, что в стек<number> нельзя положить string. pop! безопасен — мы только что проверили isEmpty().'
    },
    {
      id: 3,
      title: 'Задание: Типизированный EventEmitter',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте типизированный EventEmitter с generic картой событий. Подписка, отписка и вызов должны быть полностью типобезопасны.',
      requirements: [
        'class EventEmitter<TMap extends Record<string, any>>',
        'on<K extends keyof TMap>(event: K, listener: (data: TMap[K]) => void): void',
        'off<K extends keyof TMap>(event: K, listener: (data: TMap[K]) => void): void',
        'emit<K extends keyof TMap>(event: K, data: TMap[K]): void',
        'Протестировать с EventMap: { greet: string; count: number }'
      ],
      hint: 'Храните listeners в Map<keyof TMap, Function[]> или через Partial<Record<keyof TMap, Function[]>>.',
      solution: 'class EventEmitter<TMap extends Record<string, any>> {\n  private listeners: Partial<{ [K in keyof TMap]: ((data: TMap[K]) => void)[] }> = {};\n\n  on<K extends keyof TMap>(event: K, listener: (data: TMap[K]) => void): void {\n    const list = (this.listeners[event] as ((data: TMap[K]) => void)[] | undefined) || [];\n    this.listeners[event] = [...list, listener] as any;\n  }\n\n  off<K extends keyof TMap>(event: K, listener: (data: TMap[K]) => void): void {\n    const list = this.listeners[event] as ((data: TMap[K]) => void)[] | undefined;\n    if (list) {\n      this.listeners[event] = list.filter(l => l !== listener) as any;\n    }\n  }\n\n  emit<K extends keyof TMap>(event: K, data: TMap[K]): void {\n    const list = this.listeners[event] as ((data: TMap[K]) => void)[] | undefined;\n    list?.forEach(l => l(data));\n  }\n}\n\ntype MyEvents = { greet: string; count: number };\nconst emitter = new EventEmitter<MyEvents>();\n\nconst handler = (name: string) => console.log(`Привет, ${name}!`);\nemitter.on("greet", handler);\nemitter.emit("greet", "Алиса"); // Привет, Алиса!\nemitter.off("greet", handler);\nemitter.emit("greet", "Боб");   // (нет вывода)',
      explanation: 'Generic карта TMap обеспечивает типобезопасность: on("greet", (data: number) => {}) — ошибка компиляции. emit("greet", 42) — ошибка, ожидается string. Listeners хранятся в Partial чтобы разрешить undefined для событий без подписчиков.'
    },
    {
      id: 4,
      title: 'Задание: Валидатор форм',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте систему валидации с типизированными правилами. Валидатор должен принимать объект с правилами и проверять данные.',
      requirements: [
        'Тип ValidationRule<T>: функция (value: T) => string | null',
        'Тип Schema<T>: Record<keyof T, ValidationRule<T[keyof T]>[]>',
        'Функция validate<T>(data: T, schema: Partial<Schema<T>>): Record<keyof T, string[]>',
        'Готовые правила: required, minLength(n), maxLength(n), email',
        'Протестировать на форме { name: string; email: string; password: string }'
      ],
      hint: 'ValidationRule — функция возвращающая null если OK или сообщение об ошибке. validate перебирает ключи schema и применяет все правила к значению.',
      solution: 'type ValidationRule<T> = (value: T) => string | null;\n\n// Готовые правила\nconst required: ValidationRule<unknown> = (v) =>\n  v === null || v === undefined || v === "" ? "Поле обязательно" : null;\n\nconst minLength = (n: number): ValidationRule<string> => (v) =>\n  v.length < n ? `Минимум ${n} символов` : null;\n\nconst maxLength = (n: number): ValidationRule<string> => (v) =>\n  v.length > n ? `Максимум ${n} символов` : null;\n\nconst email: ValidationRule<string> = (v) =>\n  /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v) ? null : "Некорректный email";\n\n// Валидатор\nfunction validate<T extends Record<string, any>>(\n  data: T,\n  schema: Partial<Record<keyof T, ValidationRule<any>[]>>\n): Record<keyof T, string[]> {\n  const errors = {} as Record<keyof T, string[]>;\n  for (const key in schema) {\n    const rules = schema[key] || [];\n    const fieldErrors = rules\n      .map(rule => rule(data[key]))\n      .filter((e): e is string => e !== null);\n    errors[key as keyof T] = fieldErrors;\n  }\n  return errors;\n}\n\ninterface Form { name: string; email: string; password: string; }\n\nconst data: Form = { name: "Al", email: "not-email", password: "123" };\nconst errors = validate(data, {\n  name:     [required, minLength(3)],\n  email:    [required, email],\n  password: [required, minLength(8)],\n});\nconsole.log(errors);\n// { name: ["Минимум 3 символов"], email: ["Некорректный email"], password: ["Минимум 8 символов"] }',
      explanation: 'Фабричные функции minLength/maxLength возвращают готовые правила с замкнутым параметром n. validate перебирает ключи schema, применяет все правила и собирает ошибки. filter с type predicate убирает null из массива.'
    },
    {
      id: 5,
      title: 'Задание: Паттерн Observer',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте паттерн Observer с TypeScript. Subject хранит список наблюдателей и уведомляет их при изменении состояния.',
      requirements: [
        'Интерфейс Observer<T> с методом update(data: T): void',
        'Класс Subject<T> с методами subscribe, unsubscribe, notify',
        'Класс TemperatureSensor extends Subject<number>',
        'Класс TemperatureLogger implements Observer<number>',
        'При изменении температуры все наблюдатели получают уведомление'
      ],
      hint: 'Subject хранит observers: Observer<T>[] и notify() вызывает update() для каждого. TemperatureSensor имеет метод setTemperature(value: number) который вызывает notify.',
      solution: 'interface Observer<T> {\n  update(data: T): void;\n}\n\nclass Subject<T> {\n  private observers: Observer<T>[] = [];\n\n  subscribe(observer: Observer<T>): void {\n    this.observers.push(observer);\n  }\n\n  unsubscribe(observer: Observer<T>): void {\n    this.observers = this.observers.filter(o => o !== observer);\n  }\n\n  protected notify(data: T): void {\n    this.observers.forEach(o => o.update(data));\n  }\n}\n\nclass TemperatureSensor extends Subject<number> {\n  private _temperature = 0;\n\n  setTemperature(value: number): void {\n    this._temperature = value;\n    this.notify(value);\n  }\n\n  get temperature(): number { return this._temperature; }\n}\n\nclass TemperatureLogger implements Observer<number> {\n  private history: number[] = [];\n\n  update(temp: number): void {\n    this.history.push(temp);\n    console.log(`[Лог] Температура: ${temp}°C`);\n  }\n\n  getAverage(): number {\n    return this.history.reduce((a, b) => a + b, 0) / this.history.length;\n  }\n}\n\nconst sensor = new TemperatureSensor();\nconst logger = new TemperatureLogger();\nsensor.subscribe(logger);\nsensor.setTemperature(22); // [Лог] Температура: 22°C\nsensor.setTemperature(25); // [Лог] Температура: 25°C\nconsole.log(logger.getAverage()); // 23.5',
      explanation: 'Observer паттерн реализован с generic типом T — Subject и Observer работают с любыми данными. notify protected — вызывается только подклассами. TemperatureSensor расширяет Subject<number> и вызывает notify при каждом изменении.'
    },
    {
      id: 6,
      title: 'Задание: Immutable-класс с Builder',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте immutable класс User и Builder для его создания. Все поля User readonly, изменение — через метод with() который возвращает новый объект.',
      requirements: [
        'Класс User с readonly полями: id, name, email, role',
        'Приватный конструктор принимает все поля',
        'Метод with(updates: Partial<UserData>): User возвращает новый User',
        'Статический метод User.create(data: UserData): User',
        'Тип UserData: Omit<User, "id" | "with" | "create">'
      ],
      hint: 'with() создаёт новый User с id текущего и обновлёнными полями через spread. Для UserData используйте type с нужными полями явно.',
      solution: 'type UserRole = "admin" | "user" | "guest";\n\ninterface UserData {\n  name: string;\n  email: string;\n  role: UserRole;\n}\n\nclass User {\n  readonly id: number;\n  readonly name: string;\n  readonly email: string;\n  readonly role: UserRole;\n\n  private constructor(id: number, data: UserData) {\n    this.id = id;\n    this.name = data.name;\n    this.email = data.email;\n    this.role = data.role;\n  }\n\n  static create(data: UserData): User {\n    return new User(Date.now(), data);\n  }\n\n  with(updates: Partial<UserData>): User {\n    return new User(this.id, {\n      name: this.name,\n      email: this.email,\n      role: this.role,\n      ...updates,\n    });\n  }\n\n  toString(): string {\n    return `User(${this.id}: ${this.name}, ${this.role})`;\n  }\n}\n\nconst user1 = User.create({ name: "Алиса", email: "alice@test.com", role: "user" });\nconsole.log(user1.toString());\n\nconst admin = user1.with({ role: "admin" });\nconsole.log(admin.toString()); // Тот же id, другая роль\nconsole.log(user1.role); // user — не изменился!',
      explanation: 'Приватный конструктор запрещает создание через new снаружи — только через User.create(). with() возвращает новый экземпляр с тем же id — объект immutable. readonly поля предотвращают прямое изменение.'
    },
    {
      id: 7,
      title: 'Задание: Utility типы для API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используя встроенные и кастомные Utility Types, создайте типы для REST API: Create/Update/Response варианты для сущностей.',
      requirements: [
        'Интерфейс BaseEntity: id, createdAt, updatedAt',
        'Тип CreateInput<T>: убирает поля BaseEntity',
        'Тип UpdateInput<T>: делает все поля необязательными, убирает BaseEntity',
        'Тип ApiResponse<T>: обёртка с полями data, status, message',
        'Применить к User и Product',
        'Функция createApiResponse<T>(data: T, status: number): ApiResponse<T>'
      ],
      hint: 'CreateInput<T> = Omit<T, keyof BaseEntity>. UpdateInput<T> = Partial<Omit<T, keyof BaseEntity>>. Используйте keyof для получения ключей BaseEntity.',
      solution: 'interface BaseEntity {\n  id: number;\n  createdAt: Date;\n  updatedAt: Date;\n}\n\ntype CreateInput<T extends BaseEntity> = Omit<T, keyof BaseEntity>;\ntype UpdateInput<T extends BaseEntity> = Partial<Omit<T, keyof BaseEntity>>;\n\ninterface ApiResponse<T> {\n  data: T;\n  status: number;\n  message: string;\n  timestamp: string;\n}\n\nfunction createApiResponse<T>(data: T, status: number = 200, message: string = "OK"): ApiResponse<T> {\n  return { data, status, message, timestamp: new Date().toISOString() };\n}\n\ninterface User extends BaseEntity {\n  name: string;\n  email: string;\n  role: "admin" | "user";\n}\n\ninterface Product extends BaseEntity {\n  title: string;\n  price: number;\n  category: string;\n}\n\ntype CreateUserInput   = CreateInput<User>;   // { name, email, role }\ntype UpdateUserInput   = UpdateInput<User>;   // { name?, email?, role? }\ntype CreateProductInput = CreateInput<Product>;\n\nconst newUser: CreateUserInput = { name: "Алиса", email: "a@test.com", role: "user" };\nconst userPatch: UpdateUserInput = { name: "Алиса Иванова" }; // Только имя!\nconst response = createApiResponse({ id: 1, ...newUser, createdAt: new Date(), updatedAt: new Date() });\nconsole.log(response.status); // 200',
      explanation: 'keyof BaseEntity даёт "id" | "createdAt" | "updatedAt". Omit убирает эти поля. Вместе: CreateInput<User> = { name: string; email: string; role: ... }. Generic createApiResponse автоматически выводит тип T из аргумента data.'
    },
    {
      id: 8,
      title: 'Задание: Типизированный Proxy',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте типизированную функцию createValidatedProxy<T>, которая оборачивает объект в Proxy и проверяет типы при установке значений.',
      requirements: [
        'Функция createValidatedProxy<T extends object>(target: T, validators: Validators<T>): T',
        'Тип Validators<T>: Partial<Record<keyof T, (v: unknown) => boolean>>',
        'Proxy должен вызывать валидатор при set и бросать ошибку если не прошёл',
        'Возвращает тот же тип T (не обёртку)',
        'Протестировать с объектом { age: number; name: string }'
      ],
      hint: 'createValidatedProxy возвращает new Proxy(target, handler). В handler.set проверяйте наличие валидатора для ключа и вызывайте его.',
      solution: 'type Validators<T> = Partial<Record<keyof T, (v: unknown) => boolean>>;\n\nfunction createValidatedProxy<T extends object>(target: T, validators: Validators<T>): T {\n  return new Proxy(target, {\n    set(obj: T, key: string | symbol, value: unknown): boolean {\n      const validator = validators[key as keyof T];\n      if (validator && !validator(value)) {\n        throw new TypeError(`Невалидное значение "${String(value)}" для поля "${String(key)}"`);\n      }\n      (obj as any)[key] = value;\n      return true;\n    }\n  });\n}\n\ninterface Person { age: number; name: string; }\n\nconst validators: Validators<Person> = {\n  age:  (v) => typeof v === "number" && v >= 0 && v <= 150,\n  name: (v) => typeof v === "string" && v.trim().length >= 2,\n};\n\nconst person = createValidatedProxy<Person>({ age: 25, name: "Алиса" }, validators);\nperson.name = "Боб";    // OK\nperson.age = 30;        // OK\nconsole.log(person);    // { age: 30, name: "Боб" }\n\ntry {\n  person.age = -5;      // TypeError: Невалидное значение\n} catch (e: unknown) {\n  if (e instanceof TypeError) console.log(e.message);\n}',
      explanation: 'Proxy перехватывает операцию set. Validators<T> использует Partial чтобы разрешить валидацию только для нужных полей. keyof T в Record обеспечивает, что ключи validators соответствуют ключам T. Возвращаемый тип T — тот же объект, не обёртка.'
    },
    {
      id: 9,
      title: 'Задание: Конечный автомат (State Machine)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте типизированный конечный автомат для управления состоянием заказа. Переходы должны быть строго типизированы.',
      requirements: [
        'Тип OrderStatus: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"',
        'Тип Transitions: Record<OrderStatus, OrderStatus[]> — допустимые переходы',
        'Класс OrderStateMachine с методом transition(to: OrderStatus): void',
        'Метод canTransition(to: OrderStatus): boolean',
        'Бросает ошибку при недопустимом переходе'
      ],
      hint: 'transitions — объект, где ключ — текущий статус, значение — массив допустимых следующих статусов. canTransition проверяет, есть ли to в transitions[currentStatus].',
      solution: 'type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";\n\ntype Transitions = Record<OrderStatus, OrderStatus[]>;\n\nconst ORDER_TRANSITIONS: Transitions = {\n  pending:   ["confirmed", "cancelled"],\n  confirmed: ["shipped",   "cancelled"],\n  shipped:   ["delivered"],\n  delivered: [],\n  cancelled: [],\n};\n\nclass OrderStateMachine {\n  private status: OrderStatus;\n  private history: OrderStatus[] = [];\n\n  constructor(initial: OrderStatus = "pending") {\n    this.status = initial;\n    this.history.push(initial);\n  }\n\n  canTransition(to: OrderStatus): boolean {\n    return ORDER_TRANSITIONS[this.status].includes(to);\n  }\n\n  transition(to: OrderStatus): void {\n    if (!this.canTransition(to)) {\n      throw new Error(\n        `Нельзя перейти из "${this.status}" в "${to}". ` +\n        `Допустимо: [${ORDER_TRANSITIONS[this.status].join(", ")}]`\n      );\n    }\n    this.history.push(to);\n    this.status = to;\n    console.log(`Статус изменён: ${this.history.join(" -> ")}`);\n  }\n\n  get currentStatus(): OrderStatus { return this.status; }\n}\n\nconst order = new OrderStateMachine();\norder.transition("confirmed"); // pending -> confirmed\norder.transition("shipped");   // pending -> confirmed -> shipped\norder.transition("delivered"); // ... -> delivered\ntry {\n  order.transition("cancelled"); // Ошибка! delivered -> [] нет переходов\n} catch (e: unknown) {\n  if (e instanceof Error) console.log(e.message);\n}',
      explanation: 'transitions определяет граф допустимых переходов. Тип Transitions = Record<OrderStatus, OrderStatus[]> гарантирует, что все статусы описаны. canTransition использует Array.includes с типом OrderStatus. history сохраняет весь путь переходов.'
    },
    {
      id: 10,
      title: 'Задание: Комплексная типизация конфига',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте строго типизированную систему конфигурации приложения с вложенными объектами, readonly полями и функцией merge.',
      requirements: [
        'Интерфейс AppConfig с полями server, database, features, logging',
        'Все поля в AppConfig и вложенных объектах readonly',
        'Тип DeepPartial<T> для частичных обновлений',
        'Функция mergeConfig(base: AppConfig, override: DeepPartial<AppConfig>): AppConfig',
        'Функция validateConfig(config: unknown): config is AppConfig с проверкой обязательных полей'
      ],
      hint: 'mergeConfig делает глубокое слияние объектов. Для вложенных объектов рекурсивно применяет spread. validateConfig проверяет наличие всех обязательных полей с typeof.',
      solution: 'interface ServerConfig  { readonly host: string; readonly port: number; readonly https: boolean; }\ninterface DatabaseConfig { readonly url: string; readonly poolSize: number; readonly timeout: number; }\ninterface FeaturesConfig { readonly darkMode: boolean; readonly analytics: boolean; }\ninterface LoggingConfig  { readonly level: "debug" | "info" | "warn" | "error"; readonly file?: string; }\n\ninterface AppConfig {\n  readonly server:   ServerConfig;\n  readonly database: DatabaseConfig;\n  readonly features: FeaturesConfig;\n  readonly logging:  LoggingConfig;\n}\n\ntype DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };\n\nfunction mergeConfig(base: AppConfig, override: DeepPartial<AppConfig>): AppConfig {\n  return {\n    server:   { ...base.server,   ...(override.server   || {}) },\n    database: { ...base.database, ...(override.database || {}) },\n    features: { ...base.features, ...(override.features || {}) },\n    logging:  { ...base.logging,  ...(override.logging  || {}) },\n  };\n}\n\nfunction validateConfig(config: unknown): config is AppConfig {\n  if (typeof config !== "object" || config === null) return false;\n  const c = config as Record<string, unknown>;\n  return (\n    typeof c.server   === "object" &&\n    typeof c.database === "object" &&\n    typeof c.features === "object" &&\n    typeof c.logging  === "object"\n  );\n}\n\nconst defaultConfig: AppConfig = {\n  server:   { host: "localhost", port: 3000, https: false },\n  database: { url: "postgres://localhost/dev", poolSize: 5, timeout: 5000 },\n  features: { darkMode: false, analytics: false },\n  logging:  { level: "info" },\n};\n\nconst prodConfig = mergeConfig(defaultConfig, {\n  server:   { port: 443, https: true },\n  logging:  { level: "warn", file: "/var/log/app.log" },\n});\n\nconsole.log(prodConfig.server.port);    // 443\nconsole.log(prodConfig.server.host);    // localhost (из base)\nconsole.log(prodConfig.logging.level);  // warn',
      explanation: 'Все поля readonly — изменение config.server.port вызовет ошибку компиляции. DeepPartial позволяет передавать только нужные поля для override. mergeConfig делает поверхностное слияние вложенных объектов — этого достаточно для одного уровня вложенности. validateConfig — type guard для unknown данных из JSON.'
    }
  ]
}
