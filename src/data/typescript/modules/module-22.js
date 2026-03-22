export default {
  id: 22,
  title: 'Практикум: Generics и типы',
  description: 'Практические задания на generics, продвинутые типы, conditional types, mapped types и утилитные паттерны',
  lessons: [
    {
      id: 1,
      title: 'Задание: Generic Repository',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте generic интерфейс Repository<T> и его in-memory реализацию. Должны быть все CRUD методы с правильными типами.',
      requirements: [
        'Интерфейс Repository<T extends { id: number }>',
        'Методы: findAll(): T[], findById(id: number): T | undefined, save(item: T): T, delete(id: number): boolean',
        'class InMemoryRepository<T extends { id: number }> implements Repository<T>',
        'Создать UserRepository = InMemoryRepository<User>'
      ],
      hint: 'InMemoryRepository хранит items в Map<number, T>. save добавляет или обновляет. delete возвращает true если удалось.',
      expectedOutput: '[ \'Алиса\', \'Боб\' ]\nАлиса\ntrue',
      solution: 'interface Repository<T extends { id: number }> {\n  findAll(): T[];\n  findById(id: number): T | undefined;\n  save(item: T): T;\n  delete(id: number): boolean;\n}\n\nclass InMemoryRepository<T extends { id: number }> implements Repository<T> {\n  private items = new Map<number, T>();\n\n  findAll(): T[] { return Array.from(this.items.values()); }\n\n  findById(id: number): T | undefined { return this.items.get(id); }\n\n  save(item: T): T {\n    this.items.set(item.id, item);\n    return item;\n  }\n\n  delete(id: number): boolean {\n    return this.items.delete(id);\n  }\n}\n\ninterface User { id: number; name: string; email: string; }\nconst userRepo = new InMemoryRepository<User>();\n\nuserRepo.save({ id: 1, name: "Алиса", email: "alice@test.com" });\nuserRepo.save({ id: 2, name: "Боб",   email: "bob@test.com" });\nconsole.log(userRepo.findAll().map(u => u.name)); // ["Алиса", "Боб"]\nconsole.log(userRepo.findById(1)?.name); // Алиса\nconsole.log(userRepo.delete(2)); // true',
      explanation: 'T extends { id: number } — ограничение: только объекты с числовым id. InMemoryRepository<T> реализует Repository<T> — TypeScript проверяет, что все методы правильно типизированы. Map<number, T> — O(1) поиск по id.'
    },
    {
      id: 2,
      title: 'Задание: Функция pick',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте типизированную функцию pick, которая извлекает указанные поля из объекта. TypeScript должен точно знать тип результата.',
      requirements: [
        'function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>',
        'Возвращает новый объект только с указанными полями',
        'TypeScript должен знать точный тип возврата',
        'Тестировать на User с выбором name и email (без id)'
      ],
      hint: 'Создайте пустой объект {} as Pick<T, K> и добавляйте поля через цикл по keys. TypeScript знает результат через Pick<T, K>.',
      expectedOutput: '{ name: \'Алиса\', email: \'alice@test.com\' }\n{ name: \'Алиса\', role: \'admin\' }',
      solution: 'function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {\n  const result = {} as Pick<T, K>;\n  keys.forEach(key => { result[key] = obj[key]; });\n  return result;\n}\n\ninterface User { id: number; name: string; email: string; age: number; role: string; }\n\nconst user: User = { id: 1, name: "Алиса", email: "alice@test.com", age: 30, role: "admin" };\n\nconst nameAndEmail = pick(user, ["name", "email"]);\n// Тип: { name: string; email: string }\nconsole.log(nameAndEmail); // { name: "Алиса", email: "alice@test.com" }\n// nameAndEmail.id  <- Ошибка TypeScript! id не выбрали\n\nconst public = pick(user, ["name", "role"]);\nconsole.log(public); // { name: "Алиса", role: "admin" }',
      explanation: 'K extends keyof T гарантирует, что keys содержит только реальные ключи T. Pick<T, K> — встроенный Utility Type, который оставляет только указанные ключи. TypeScript точно знает, что nameAndEmail содержит только name и email.'
    },
    {
      id: 3,
      title: 'Задание: Кэш с TTL',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте generic кэш с временем жизни (TTL). Устаревшие записи должны автоматически удаляться при попытке чтения.',
      requirements: [
        'class Cache<K, V> с конструктором принимающим ttl: number (мс)',
        'set(key: K, value: V): void — добавить с временем жизни',
        'get(key: K): V | undefined — вернуть или undefined если устарело',
        'has(key: K): boolean — есть ли свежая запись',
        'delete(key: K): void и clear(): void'
      ],
      hint: 'Храните { value: V, expiresAt: number } в Map. get проверяет Date.now() > expiresAt и удаляет устаревшие.',
      expectedOutput: '42\nundefined',
      solution: 'interface CacheEntry<V> {\n  value: V;\n  expiresAt: number;\n}\n\nclass Cache<K, V> {\n  private store = new Map<K, CacheEntry<V>>();\n  private ttl: number;\n\n  constructor(ttlMs: number) { this.ttl = ttlMs; }\n\n  set(key: K, value: V): void {\n    this.store.set(key, { value, expiresAt: Date.now() + this.ttl });\n  }\n\n  get(key: K): V | undefined {\n    const entry = this.store.get(key);\n    if (!entry) return undefined;\n    if (Date.now() > entry.expiresAt) {\n      this.store.delete(key);\n      return undefined;\n    }\n    return entry.value;\n  }\n\n  has(key: K): boolean { return this.get(key) !== undefined; }\n  delete(key: K): void { this.store.delete(key); }\n  clear(): void { this.store.clear(); }\n  get size(): number { return this.store.size; }\n}\n\nconst cache = new Cache<string, number>(100); // TTL 100мс\ncache.set("count", 42);\nconsole.log(cache.get("count")); // 42\n\nsetTimeout(() => {\n  console.log(cache.get("count")); // undefined (устарело)\n}, 150);',
      explanation: 'CacheEntry<V> хранит значение и время устаревания. get удаляет устаревшие записи при чтении (lazy eviction). Double generic K, V: ключи и значения независимых типов — Cache<string, User[]> работает так же хорошо.'
    },
    {
      id: 4,
      title: 'Задание: Conditional Types — Flatten',
      type: 'practice',
      difficulty: 'hard',
      description: 'Используя conditional types и infer, реализуйте тип Flatten<T>, который раскрывает массивы и Promise одного уровня, и функцию flatten.',
      requirements: [
        'Тип Flatten<T>: T extends Array<infer U> ? U : T extends Promise<infer U> ? U : T',
        'Функция flatten<T>(value: T[]): T — из массива массивов делает плоский массив',
        'Тип DeepFlatten<T>: рекурсивно раскрывает вложенные массивы',
        'Тип UnwrapPromise<T>: рекурсивно раскрывает вложенные Promise'
      ],
      hint: 'DeepFlatten: если T extends Array<infer U>, рекурсивно применяем DeepFlatten<U>. UnwrapPromise: если T extends Promise<infer U>, рекурсивно UnwrapPromise<U>.',
      expectedOutput: '[1, 2, 3, 4, 5, 6]',
      solution: '// Flatten — один уровень\ntype Flatten<T> =\n  T extends Array<infer U>   ? U :\n  T extends Promise<infer U> ? U :\n  T;\n\ntype F1 = Flatten<string[]>;           // string\ntype F2 = Flatten<number[][]>;         // number[] (один уровень)\ntype F3 = Flatten<Promise<boolean>>;   // boolean\ntype F4 = Flatten<string>;             // string (не массив)\n\n// DeepFlatten — все уровни\ntype DeepFlatten<T> =\n  T extends Array<infer U> ? DeepFlatten<U> : T;\n\ntype DF1 = DeepFlatten<string[][][]>;  // string\ntype DF2 = DeepFlatten<number[]>;      // number\n\n// UnwrapPromise — рекурсивно\ntype UnwrapPromise<T> =\n  T extends Promise<infer U> ? UnwrapPromise<U> : T;\n\ntype P1 = UnwrapPromise<Promise<string>>;                  // string\ntype P2 = UnwrapPromise<Promise<Promise<number>>>;         // number\ntype P3 = UnwrapPromise<Promise<Promise<Promise<boolean>>>>;// boolean\n\n// Функция flatten (runtime)\nfunction flatten<T>(arr: T[][]): T[] {\n  return arr.reduce<T[]>((acc, val) => acc.concat(val), []);\n}\n\nconst nested: number[][] = [[1, 2], [3, 4], [5, 6]];\nconst flat: number[] = flatten(nested);\nconsole.log(flat); // [1, 2, 3, 4, 5, 6]',
      explanation: 'Flatten использует infer для извлечения типа элемента. DeepFlatten рекурсивно применяет себя — TypeScript ограничивает глубину рекурсии. UnwrapPromise — аналогично встроенному Awaited. Функция flatten типизирована через generic: результат T[], не any[].'
    },
    {
      id: 5,
      title: 'Задание: Mapped Types — трансформации',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте серию mapped types: Mutable (снять readonly), RequiredDeep, NullableAll и функцию toNullable.',
      requirements: [
        'Mutable<T>: снять все readonly (-readonly)',
        'RequiredDeep<T>: сделать все поля обязательными рекурсивно',
        'NullableAll<T>: сделать все поля nullable (T | null)',
        'Функция toNullable<T extends object>(obj: T): NullableAll<T>',
        'Протестировать на Config интерфейсе'
      ],
      hint: '-readonly [K in keyof T] снимает readonly. -? снимает необязательность. Для рекурсивности проверяйте T[K] extends object.',
      expectedOutput: '{ host: \'prod.server.com\', port: null }',
      solution: '// Снять readonly\ntype Mutable<T> = { -readonly [K in keyof T]: T[K] };\n\n// Сделать все обязательными рекурсивно\ntype RequiredDeep<T> = {\n  [K in keyof T]-?: T[K] extends object ? RequiredDeep<T[K]> : T[K];\n};\n\n// Все поля nullable\ntype NullableAll<T> = { [K in keyof T]: T[K] | null };\n\nfunction toNullable<T extends object>(obj: T): NullableAll<T> {\n  const result = {} as NullableAll<T>;\n  for (const key in obj) {\n    result[key] = obj[key] ?? null;\n  }\n  return result;\n}\n\ninterface Config {\n  readonly host: string;\n  readonly port: number;\n  ssl?: boolean;\n  database?: { readonly url: string; pool?: number };\n}\n\n// Mutable<Config> — можно изменять\ntype MutableConfig = Mutable<Config>;\nconst cfg: MutableConfig = { host: "localhost", port: 3000 };\ncfg.host = "prod.server.com"; // OK! readonly снят\n\n// RequiredDeep — все поля обязательны\ntype RequiredConfig = RequiredDeep<Config>;\n// { host: string; port: number; ssl: boolean; database: { url: string; pool: number } }\n\n// NullableAll\nconst nullableConfig = toNullable(cfg);\nconsole.log(nullableConfig); // { host: "prod.server.com", port: null... }',
      explanation: '-readonly и -? — модификаторы для снятия ограничений. Mutable снимает readonly со всех полей. RequiredDeep рекурсивно снимает необязательность. toNullable заменяет undefined/пропущенные значения на null, что полезно при работе с API.'
    },
    {
      id: 6,
      title: 'Задание: Template Literal маршруты',
      type: 'practice',
      difficulty: 'hard',
      description: 'Используя template literal types, создайте типизированную систему маршрутов API. Система должна извлекать параметры из строки маршрута.',
      requirements: [
        'Тип ExtractParams<S> извлекает имена параметров из строки типа "/users/:id/posts/:postId"',
        'Тип RouteParams<S> создаёт объект с извлечёнными параметрами: { id: string; postId: string }',
        'Функция createRoute<S extends string>(path: S) с типизированными параметрами',
        'Тестировать с "/users/:id", "/users/:userId/posts/:postId"'
      ],
      hint: 'ExtractParams рекурсивно разбирает строку: если начинается с ":", захватывает имя до "/"; иначе пропускает символ. Это сложный рекурсивный условный тип.',
      expectedOutput: '{ userId: \'42\', postId: \'7\' }',
      solution: '// Извлечение имён параметров из строки маршрута\ntype ExtractParams<S extends string> =\n  S extends `${string}:${infer Param}/${infer Rest}`\n    ? Param | ExtractParams<`/${Rest}`>\n    : S extends `${string}:${infer Param}`\n    ? Param\n    : never;\n\ntype RouteParams<S extends string> = {\n  [K in ExtractParams<S>]: string;\n};\n\n// Тестирование типов\ntype P1 = ExtractParams<"/users/:id">;                    // "id"\ntype P2 = ExtractParams<"/users/:userId/posts/:postId">;  // "userId" | "postId"\ntype P3 = ExtractParams<"/static/path">;                  // never\n\ntype R1 = RouteParams<"/users/:id">;                      // { id: string }\ntype R2 = RouteParams<"/users/:userId/posts/:postId">;    // { userId: string; postId: string }\n\n// Runtime функция\nfunction parseRoute<S extends string>(path: S, url: string): RouteParams<S> | null {\n  const pathParts = path.split("/");\n  const urlParts  = url.split("/");\n  if (pathParts.length !== urlParts.length) return null;\n  \n  const params = {} as RouteParams<S>;\n  for (let i = 0; i < pathParts.length; i++) {\n    if (pathParts[i].startsWith(":")) {\n      const key = pathParts[i].slice(1) as keyof RouteParams<S>;\n      params[key] = urlParts[i] as any;\n    } else if (pathParts[i] !== urlParts[i]) {\n      return null;\n    }\n  }\n  return params;\n}\n\nconst params = parseRoute("/users/:userId/posts/:postId", "/users/42/posts/7");\nconsole.log(params); // { userId: "42", postId: "7" }\n// params.userId  <- string, TypeScript знает!',
      explanation: 'ExtractParams рекурсивно разбирает строку: сначала ищет паттерн ":param/rest", захватывает param и рекурсивно обрабатывает rest. Затем ищет паттерн ":param" в конце. RouteParams превращает union ключей в объект. parseRoute — runtime функция с типом параметров из строки маршрута.'
    },
    {
      id: 7,
      title: 'Задание: Typed Builder Pattern',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте типизированный Builder паттерн с помощью generics. Билдер должен знать, какие поля уже установлены, и требовать только недостающие при build().',
      requirements: [
        'class QueryBuilder<T extends object> с методами where, select, limit, offset',
        'Метод build(): Query возвращает объект с условиями',
        'Интерфейс Query: table, conditions, fields, limit?, offset?',
        'where(field: keyof T, value: T[keyof T]): this',
        'select(...fields: (keyof T)[]): this'
      ],
      hint: 'QueryBuilder хранит внутренний объект conditions: Partial<T>, fields: (keyof T)[] и т.д. Каждый метод модифицирует этот объект и возвращает this для цепочки.',
      expectedOutput: "SELECT id, name, email FROM users WHERE active = 'true' LIMIT 10 OFFSET 20",
      solution: 'interface Query<T> {\n  table: string;\n  conditions: Partial<T>;\n  fields: (keyof T)[];\n  limitValue?: number;\n  offsetValue?: number;\n}\n\nclass QueryBuilder<T extends object> {\n  private query: Query<T>;\n\n  constructor(table: string) {\n    this.query = { table, conditions: {}, fields: [] };\n  }\n\n  where<K extends keyof T>(field: K, value: T[K]): this {\n    this.query.conditions[field] = value;\n    return this;\n  }\n\n  select(...fields: (keyof T)[]): this {\n    this.query.fields = fields;\n    return this;\n  }\n\n  limit(n: number): this {\n    this.query.limitValue = n;\n    return this;\n  }\n\n  offset(n: number): this {\n    this.query.offsetValue = n;\n    return this;\n  }\n\n  build(): Query<T> {\n    return { ...this.query };\n  }\n\n  toSQL(): string {\n    const fields = this.query.fields.length > 0\n      ? this.query.fields.map(String).join(", ")\n      : "*";\n    let sql = `SELECT ${fields} FROM ${this.query.table}`;\n    const conds = Object.entries(this.query.conditions)\n      .map(([k, v]) => `${k} = \'${v}\'`).join(" AND ");\n    if (conds) sql += ` WHERE ${conds}`;\n    if (this.query.limitValue)  sql += ` LIMIT ${this.query.limitValue}`;\n    if (this.query.offsetValue) sql += ` OFFSET ${this.query.offsetValue}`;\n    return sql;\n  }\n}\n\ninterface User { id: number; name: string; email: string; active: boolean; }\n\nconst query = new QueryBuilder<User>("users")\n  .select("id", "name", "email")\n  .where("active", true)\n  .limit(10)\n  .offset(20)\n  .toSQL();\n\nconsole.log(query);\n// SELECT id, name, email FROM users WHERE active = \'true\' LIMIT 10 OFFSET 20',
      explanation: 'where<K extends keyof T>(field: K, value: T[K]) — TypeScript не позволит where("nonexistent", ...) или where("name", 42). select(...fields: (keyof T)[]) принимает только реальные поля T. this как тип возврата позволяет цепочки вызовов с сохранением типа.'
    },
    {
      id: 8,
      title: 'Задание: Type-safe localStorage',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте типизированную обёртку над localStorage с generic методами и схемой хранилища.',
      requirements: [
        'Тип StorageSchema — объект с ключами и типами значений',
        'class TypedStorage<TSchema extends Record<string, unknown>>',
        'get<K extends keyof TSchema>(key: K): TSchema[K] | null',
        'set<K extends keyof TSchema>(key: K, value: TSchema[K]): void',
        'remove<K extends keyof TSchema>(key: K): void',
        'Протестировать с схемой { token: string; userId: number; theme: "light" | "dark" }'
      ],
      hint: 'Используйте JSON.stringify при set и JSON.parse при get. Тип ключа K extends keyof TSchema гарантирует только допустимые ключи.',
      expectedOutput: '// Компилируется без ошибок\n// storage.set("theme", "purple") -> error TS2345: Argument of type "purple" is not assignable to "light" | "dark"\n// storage.set("unknown", "val") -> error TS2345: Argument of type "unknown" is not assignable to keyof AppStorage\n// storage.get("token") возвращает string | null — TypeScript знает тип!',
      solution: 'class TypedStorage<TSchema extends Record<string, unknown>> {\n  private prefix: string;\n\n  constructor(prefix: string = "") {\n    this.prefix = prefix ? `${prefix}:` : "";\n  }\n\n  private key(k: string): string { return `${this.prefix}${k}`; }\n\n  get<K extends keyof TSchema>(key: K): TSchema[K] | null {\n    try {\n      const raw = localStorage.getItem(this.key(String(key)));\n      return raw !== null ? (JSON.parse(raw) as TSchema[K]) : null;\n    } catch { return null; }\n  }\n\n  set<K extends keyof TSchema>(key: K, value: TSchema[K]): void {\n    localStorage.setItem(this.key(String(key)), JSON.stringify(value));\n  }\n\n  remove<K extends keyof TSchema>(key: K): void {\n    localStorage.removeItem(this.key(String(key)));\n  }\n\n  clear(): void { localStorage.clear(); }\n}\n\ninterface AppStorage {\n  token: string;\n  userId: number;\n  theme: "light" | "dark";\n}\n\nconst storage = new TypedStorage<AppStorage>("app");\n\nstorage.set("token", "abc123");      // OK — string\nstorage.set("userId", 42);           // OK — number\nstorage.set("theme", "dark");        // OK — литерал\n// storage.set("theme", "purple");  <- Ошибка! Не в union\n// storage.set("unknown", "value"); <- Ошибка! Нет в схеме\n\nconst token = storage.get("token");  // string | null\nconst theme = storage.get("theme");  // "light" | "dark" | null',
      explanation: 'TSchema определяет схему хранилища. K extends keyof TSchema — ключ должен быть в схеме. TSchema[K] — тип значения для конкретного ключа. Компилятор не пустит set("theme", "purple") — тип "purple" не входит в "light" | "dark".'
    },
    {
      id: 9,
      title: 'Задание: Retry обёртка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте типизированную функцию retry, которая повторяет асинхронную операцию при ошибке с настройкой задержки.',
      requirements: [
        'function retry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T>',
        'RetryOptions: { maxAttempts: number; delay: number; backoff?: number }',
        'При ошибке ждёт delay * backoff^attempt мс и повторяет',
        'После maxAttempts бросает последнюю ошибку',
        'Возвращаемый тип T выводится из fn автоматически'
      ],
      hint: 'Используйте цикл for с try/catch. При ошибке ждите через new Promise(resolve => setTimeout(resolve, delay)). delay = options.delay * (options.backoff || 1) ** attempt.',
      expectedOutput: 'Попытка 1 не удалась. Следующая через 100мс\nПопытка 2 не удалась. Следующая через 200мс\nУспех!',
      solution: 'interface RetryOptions {\n  maxAttempts: number;\n  delay: number;      // мс\n  backoff?: number;   // множитель задержки (default 1)\n}\n\nasync function retry<T>(\n  fn: () => Promise<T>,\n  options: RetryOptions\n): Promise<T> {\n  const { maxAttempts, delay, backoff = 1 } = options;\n  let lastError: Error = new Error("Неизвестная ошибка");\n\n  for (let attempt = 0; attempt < maxAttempts; attempt++) {\n    try {\n      return await fn();\n    } catch (error: unknown) {\n      lastError = error instanceof Error ? error : new Error(String(error));\n      if (attempt < maxAttempts - 1) {\n        const wait = delay * Math.pow(backoff, attempt);\n        console.log(`Попытка ${attempt + 1} не удалась. Следующая через ${wait}мс`);\n        await new Promise(resolve => setTimeout(resolve, wait));\n      }\n    }\n  }\n  throw lastError;\n}\n\n// Тестирование\nlet attempts = 0;\nconst unstableFn = async (): Promise<string> => {\n  attempts++;\n  if (attempts < 3) throw new Error(`Ошибка попытки ${attempts}`);\n  return "Успех!";\n};\n\nretry(unstableFn, { maxAttempts: 5, delay: 100, backoff: 2 })\n  .then(result => console.log(result))\n  .catch(err => console.error("Все попытки исчерпаны:", err.message));',
      explanation: 'Generic T выводится из типа возврата fn: () => Promise<T>. TypeScript автоматически знает тип результата. Backoff: delay * backoff^attempt создаёт экспоненциальную задержку. error: unknown в catch — правильная практика, instanceof Error проверяет тип перед использованием.'
    },
    {
      id: 10,
      title: 'Задание: Discriminated Union для FSM',
      type: 'practice',
      difficulty: 'hard',
      description: 'Используя discriminated unions и conditional types, создайте типизированную систему переходов конечного автомата. Недопустимые переходы должны быть ошибкой на уровне типов.',
      requirements: [
        'Discriminated union States: Idle, Loading, Success<T>, Error',
        'Тип Transition<S, E>: тип следующего состояния для события E из состояния S',
        'Функция transition принимает текущее состояние и событие',
        'Функция render обрабатывает все состояния с exhaustive check',
        'Протестировать с загрузкой данных пользователя'
      ],
      hint: 'Каждое состояние — интерфейс с полем status как дискриминатор. События — union тип. Функция transition использует switch по state.status и event.type.',
      expectedOutput: 'Данные: Алиса',
      solution: '// Состояния\ninterface IdleState    { status: "idle" }\ninterface LoadingState { status: "loading"; startedAt: Date }\ninterface SuccessState<T> { status: "success"; data: T; loadedAt: Date }\ninterface ErrorState   { status: "error"; error: string; retryCount: number }\n\ntype AsyncState<T> = IdleState | LoadingState | SuccessState<T> | ErrorState;\n\n// События\ninterface FetchEvent   { type: "FETCH" }\ninterface SuccessEvent<T> { type: "SUCCESS"; data: T }\ninterface FailEvent    { type: "FAIL"; error: string }\ninterface RetryEvent   { type: "RETRY" }\ninterface ResetEvent   { type: "RESET" }\n\ntype AsyncEvent<T> = FetchEvent | SuccessEvent<T> | FailEvent | RetryEvent | ResetEvent;\n\nfunction assertNever(x: never): never {\n  throw new Error(`Необработан: ${JSON.stringify(x)}`);\n}\n\nfunction transition<T>(\n  state: AsyncState<T>,\n  event: AsyncEvent<T>\n): AsyncState<T> {\n  switch (state.status) {\n    case "idle":\n      if (event.type === "FETCH") return { status: "loading", startedAt: new Date() };\n      return state;\n    case "loading":\n      if (event.type === "SUCCESS") return { status: "success", data: event.data, loadedAt: new Date() };\n      if (event.type === "FAIL")    return { status: "error", error: event.error, retryCount: 0 };\n      return state;\n    case "error":\n      if (event.type === "RETRY") return { status: "loading", startedAt: new Date() };\n      if (event.type === "RESET") return { status: "idle" };\n      return state;\n    case "success":\n      if (event.type === "RESET") return { status: "idle" };\n      return state;\n    default:\n      return assertNever(state);\n  }\n}\n\nfunction render<T>(state: AsyncState<T>, formatData: (d: T) => string): string {\n  switch (state.status) {\n    case "idle":    return "Нажмите загрузить";\n    case "loading": return "Загружаем...";\n    case "success": return `Данные: ${formatData(state.data)}`;\n    case "error":   return `Ошибка: ${state.error} (попыток: ${state.retryCount})`;\n    default:        return assertNever(state);\n  }\n}\n\ninterface User { id: number; name: string; }\nlet state: AsyncState<User> = { status: "idle" };\nstate = transition(state, { type: "FETCH" });\nstate = transition(state, { type: "SUCCESS", data: { id: 1, name: "Алиса" } });\nconsole.log(render(state, u => u.name)); // Данные: Алиса',
      explanation: 'Каждое состояние имеет уникальный status — TypeScript знает конкретный тип в каждой ветке switch. assertNever в default гарантирует exhaustive check. Generic T в SuccessState<T> и SuccessEvent<T> позволяет использовать FSM для любых данных.'
    }
  ]
}
