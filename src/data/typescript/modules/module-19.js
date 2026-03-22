export default {
  id: 19,
  title: 'Продвинутые типы',
  description: 'Условные типы, mapped types, template literal types, infer, variadic tuples и паттерны для сложных типовых трансформаций',
  lessons: [
    {
      id: 1,
      title: 'Условные типы (Conditional Types)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Условные типы — это "тернарный оператор" для типов: T extends U ? X : Y. Если T совместим с U — результат X, иначе Y. Это мощный инструмент для создания адаптивных типов.' },
        { type: 'heading', value: 'Базовый синтаксис' },
        { type: 'code', language: 'typescript', value: '// T extends U ? X : Y\ntype IsString<T> = T extends string ? true : false;\n\ntype A = IsString<string>; // true\ntype B = IsString<number>; // false\ntype C = IsString<"hello">; // true (литерал extends string)\n\n// Вложенные условные типы\ntype TypeName<T> =\n  T extends string  ? "string"  :\n  T extends number  ? "number"  :\n  T extends boolean ? "boolean" :\n  T extends null    ? "null"    :\n  T extends undefined ? "undefined" :\n  "object";\n\ntype T1 = TypeName<string>;    // "string"\ntype T2 = TypeName<42>;        // "number"\ntype T3 = TypeName<boolean>;   // "boolean"\ntype T4 = TypeName<string[]>;  // "object"' },
        { type: 'heading', value: 'Дистрибутивные условные типы' },
        { type: 'code', language: 'typescript', value: '// При применении к union — условный тип "распределяется"\ntype Unwrap<T> = T extends Array<infer U> ? U : T;\n\ntype R1 = Unwrap<string[]>;        // string\ntype R2 = Unwrap<number[]>;        // number\ntype R3 = Unwrap<string | number>; // string | number\n\n// Exclude — встроенный, основан на условных типах:\ntype MyExclude<T, U> = T extends U ? never : T;\n\ntype E1 = MyExclude<"a" | "b" | "c", "a" | "b">; // "c"\n// Как работает: "a" extends "a"|"b" ? never : "a" -> never\n//              "b" extends "a"|"b" ? never : "b" -> never\n//              "c" extends "a"|"b" ? never : "c" -> "c"\n// never в union исчезает -> результат "c"' },
        { type: 'note', value: 'Когда T — union тип, условный тип применяется к каждому члену по отдельности (дистрибутивность). Чтобы отключить дистрибутивность, оберните в кортеж: [T] extends [U].' }
      ]
    },
    {
      id: 2,
      title: 'infer — извлечение типов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ключевое слово infer в условных типах позволяет "захватить" и вывести тип из паттерна. Именно на infer основаны встроенные типы ReturnType, Parameters и другие.' },
        { type: 'heading', value: 'infer в действии' },
        { type: 'code', language: 'typescript', value: '// ReturnType — извлекаем тип возврата функции\ntype MyReturnType<T extends (...args: any) => any> =\n  T extends (...args: any) => infer R ? R : never;\n\nfunction greet(name: string): string { return `Привет, ${name}`; }\nfunction getCount(): number { return 42; }\n\ntype GreetReturn  = MyReturnType<typeof greet>;   // string\ntype CountReturn  = MyReturnType<typeof getCount>; // number\n\n// Parameters — извлекаем типы параметров\ntype MyParameters<T extends (...args: any) => any> =\n  T extends (...args: infer P) => any ? P : never;\n\nfunction createUser(name: string, age: number, admin: boolean): void {}\ntype Params = MyParameters<typeof createUser>; // [string, number, boolean]\n\n// Первый параметр\ntype FirstParam<T extends (...args: any) => any> =\n  T extends (first: infer F, ...rest: any) => any ? F : never;\n\ntype First = FirstParam<typeof createUser>; // string' },
        { type: 'heading', value: 'infer с Promise и вложенными типами' },
        { type: 'code', language: 'typescript', value: '// Awaited — тип значения Promise (встроенный в TS 4.5+)\ntype MyAwaited<T> =\n  T extends Promise<infer U>\n    ? U extends Promise<any> ? MyAwaited<U> : U\n    : T;\n\ntype A = MyAwaited<Promise<string>>;                   // string\ntype B = MyAwaited<Promise<Promise<number>>>;           // number\ntype C = MyAwaited<string>;                            // string (не Promise)\n\n// Извлечение типа элемента массива\ntype ElementType<T> = T extends (infer U)[] ? U : never;\ntype E = ElementType<string[]>; // string\ntype F = ElementType<number[]>; // number\n\n// Первый элемент кортежа\ntype Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never;\ntype H = Head<[string, number, boolean]>; // string' }
      ]
    },
    {
      id: 3,
      title: 'Mapped Types',
      type: 'theory',
      content: [
        { type: 'text', value: 'Mapped Types позволяют создавать новый тип путём итерации по ключам существующего. Синтаксис { [K in keyof T]: ... }. Это основа большинства встроенных Utility Types.' },
        { type: 'heading', value: 'Базовые mapped types' },
        { type: 'code', language: 'typescript', value: 'interface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\n// Сделать все поля readonly\ntype MyReadonly<T> = { readonly [K in keyof T]: T[K] };\ntype ReadonlyUser = MyReadonly<User>;\n// { readonly id: number; readonly name: string; readonly email: string }\n\n// Сделать все поля необязательными\ntype MyPartial<T> = { [K in keyof T]?: T[K] };\ntype PartialUser = MyPartial<User>;\n// { id?: number; name?: string; email?: string }\n\n// Изменить тип всех полей на string\ntype Stringify<T> = { [K in keyof T]: string };\ntype StringUser = Stringify<User>;\n// { id: string; name: string; email: string }' },
        { type: 'heading', value: 'Фильтрация ключей в mapped types' },
        { type: 'code', language: 'typescript', value: '// Выбрать только ключи определённого типа\ntype KeysOfType<T, V> = {\n  [K in keyof T]: T[K] extends V ? K : never;\n}[keyof T];\n\ninterface Mixed {\n  id: number;\n  name: string;\n  active: boolean;\n  score: number;\n  label: string;\n}\n\ntype StringKeys = KeysOfType<Mixed, string>;  // "name" | "label"\ntype NumberKeys = KeysOfType<Mixed, number>;  // "id" | "score"\n\n// Pick только числовых полей\ntype PickNumbers<T> = Pick<T, KeysOfType<T, number>>;\ntype NumberFields = PickNumbers<Mixed>;\n// { id: number; score: number }\n\n// Mapped type с переименованием ключей (as)\ntype Getters<T> = {\n  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];\n};\n\ntype UserGetters = Getters<User>;\n// { getId: () => number; getName: () => string; getEmail: () => string }' }
      ]
    },
    {
      id: 4,
      title: 'Template Literal Types',
      type: 'theory',
      content: [
        { type: 'text', value: 'Template Literal Types — строковые типы с шаблонами. Похожи на template literals в JavaScript, но работают на уровне типов. Позволяют создавать точные строковые типы.' },
        { type: 'heading', value: 'Базовый синтаксис' },
        { type: 'code', language: 'typescript', value: 'type EventName = "click" | "focus" | "blur";\ntype HandlerName = `on${Capitalize<EventName>}`;\n// "onClick" | "onFocus" | "onBlur"\n\ntype CSSProperty = "margin" | "padding" | "border";\ntype CSSDirection = "top" | "right" | "bottom" | "left";\ntype CSSValues = `${CSSProperty}-${CSSDirection}`;\n// "margin-top" | "margin-right" | ... (16 комбинаций!)\n\n// Типизированные геттеры/сеттеры\ntype PropName = "name" | "email" | "age";\ntype Getter = `get${Capitalize<PropName>}`; // "getName" | "getEmail" | "getAge"\ntype Setter = `set${Capitalize<PropName>}`; // "setName" | "setEmail" | "setAge"\n\n// Типизированный event emitter\ntype EventMap = {\n  userCreated: { id: number; name: string };\n  userDeleted: { id: number };\n  error: { message: string };\n};\n\ntype EventNames = keyof EventMap; // "userCreated" | "userDeleted" | "error"\ntype EmitFn<T extends EventNames> = (event: T, data: EventMap[T]) => void;' },
        { type: 'heading', value: 'Реальный пример: типизированный EventEmitter' },
        { type: 'code', language: 'typescript', value: 'type EventMap = {\n  login:  { userId: number; timestamp: Date };\n  logout: { userId: number };\n  error:  { message: string; code: number };\n};\n\nclass TypedEventEmitter<TMap extends Record<string, any>> {\n  private listeners: Partial<{\n    [K in keyof TMap]: ((data: TMap[K]) => void)[];\n  }> = {};\n\n  on<K extends keyof TMap>(event: K, listener: (data: TMap[K]) => void): void {\n    const existing = this.listeners[event] || [];\n    this.listeners[event] = [...existing, listener];\n  }\n\n  emit<K extends keyof TMap>(event: K, data: TMap[K]): void {\n    this.listeners[event]?.forEach(l => l(data));\n  }\n}\n\nconst emitter = new TypedEventEmitter<EventMap>();\n\nemitter.on("login", ({ userId, timestamp }) => {\n  // userId: number, timestamp: Date — полный intellisense!\n  console.log(`Вход: user ${userId} в ${timestamp.toISOString()}`);\n});\n\nemitter.emit("login", { userId: 1, timestamp: new Date() }); // OK\n// emitter.emit("login", { userId: "1" }); <- Ошибка!' }
      ]
    },
    {
      id: 5,
      title: 'Variadic Tuple Types',
      type: 'theory',
      content: [
        { type: 'text', value: 'Variadic tuples (вариадические кортежи) позволяют работать с кортежами переменной длины и объединять их. Используют spread синтаксис ...T в типах.' },
        { type: 'heading', value: 'Базовые операции с кортежами' },
        { type: 'code', language: 'typescript', value: '// Конкатенация кортежей\ntype Concat<T extends any[], U extends any[]> = [...T, ...U];\n\ntype AB = Concat<[string, number], [boolean, Date]>;\n// [string, number, boolean, Date]\n\n// Tail — убрать первый элемент\ntype Tail<T extends any[]> = T extends [any, ...infer Rest] ? Rest : never;\ntype T1 = Tail<[string, number, boolean]>; // [number, boolean]\n\n// Last — последний элемент\ntype Last<T extends any[]> = T extends [...any, infer L] ? L : never;\ntype L1 = Last<[string, number, boolean]>; // boolean\n\n// Реверс кортежа\ntype Reverse<T extends any[]> =\n  T extends [infer Head, ...infer Tail]\n    ? [...Reverse<Tail>, Head]\n    : [];\n\ntype Rev = Reverse<[1, 2, 3]>; // [3, 2, 1]' },
        { type: 'heading', value: 'Практическое применение: функция pipe' },
        { type: 'code', language: 'typescript', value: '// Типизированный pipe (передаём функции по цепочке)\ntype Fn = (x: any) => any;\n\n// Простой typed pipe для двух функций\nfunction pipe2<A, B, C>(\n  fn1: (x: A) => B,\n  fn2: (x: B) => C\n): (x: A) => C {\n  return (x: A) => fn2(fn1(x));\n}\n\nconst process = pipe2(\n  (s: string) => s.trim().toLowerCase(),\n  (s: string) => s.split(" ").filter(Boolean)\n);\n\nconst result: string[] = process("  Hello World  ");\nconsole.log(result); // ["hello", "world"]' }
      ]
    },
    {
      id: 6,
      title: 'Рекурсивные типы',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript поддерживает рекурсивные типы — типы, которые ссылаются сами на себя. Это позволяет описывать дерева, JSON, вложенные структуры.' },
        { type: 'heading', value: 'Рекурсивные структуры данных' },
        { type: 'code', language: 'typescript', value: '// Тип для JSON\ntype JsonPrimitive = string | number | boolean | null;\ntype JsonObject = { [key: string]: JsonValue };\ntype JsonArray = JsonValue[];\ntype JsonValue = JsonPrimitive | JsonObject | JsonArray;\n\nconst data: JsonValue = {\n  name: "Алиса",\n  age: 30,\n  active: true,\n  address: { city: "Москва", zip: "101000" },\n  tags: ["admin", "user"],\n  extra: null,\n};\n\n// Бесконечно вложенный объект\ninterface NestedObject {\n  value: number;\n  children?: NestedObject[];\n}\n\nconst tree: NestedObject = {\n  value: 1,\n  children: [\n    { value: 2, children: [{ value: 4 }, { value: 5 }] },\n    { value: 3, children: [{ value: 6 }] },\n  ],\n};' },
        { type: 'heading', value: 'Deep Readonly и Deep Partial' },
        { type: 'code', language: 'typescript', value: '// Readonly рекурсивный (для вложенных объектов)\ntype DeepReadonly<T> = {\n  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];\n};\n\ninterface Config {\n  server: { host: string; port: number };\n  database: { url: string; pool: number };\n}\n\ntype ReadonlyConfig = DeepReadonly<Config>;\n// Все вложенные поля тоже readonly!\n\n// Deep Partial\ntype DeepPartial<T> = {\n  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];\n};\n\ntype PartialConfig = DeepPartial<Config>;\n\nconst update: PartialConfig = {\n  server: { port: 8080 }, // host не обязателен!\n  // database — тоже не обязателен\n};' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Система типов для форм',
      type: 'practice',
      difficulty: 'hard',
      description: 'Используя продвинутые типы, создайте систему типов для форм: автоматическое создание типов ошибок и touched-состояния из типа данных формы, утилитный тип FormState<T>.',
      requirements: [
        'FormErrors<T> — тот же объект, но все поля string | undefined',
        'FormTouched<T> — тот же объект, но все поля boolean',
        'FormState<T> — объект с values: T, errors: FormErrors<T>, touched: FormTouched<T>',
        'Функция createFormState<T>(initial: T): FormState<T>',
        'Функция validateField<T, K extends keyof T>(state: FormState<T>, field: K, value: T[K]): FormState<T>',
        'Протестируйте на форме с полями name, email, age'
      ],
      hint: 'FormErrors<T> — это mapped type: { [K in keyof T]: string | undefined }. FormTouched<T> — { [K in keyof T]: boolean }. Используйте эти типы в FormState<T>.',
      solution: '// Utility types для форм\ntype FormErrors<T> = {\n  [K in keyof T]: string | undefined;\n};\n\ntype FormTouched<T> = {\n  [K in keyof T]: boolean;\n};\n\ninterface FormState<T> {\n  values: T;\n  errors: FormErrors<T>;\n  touched: FormTouched<T>;\n  isValid: boolean;\n}\n\nfunction createFormState<T extends object>(initial: T): FormState<T> {\n  const errors = {} as FormErrors<T>;\n  const touched = {} as FormTouched<T>;\n  \n  for (const key in initial) {\n    errors[key] = undefined;\n    touched[key] = false;\n  }\n  \n  return { values: { ...initial }, errors, touched, isValid: true };\n}\n\nfunction validateField<T extends object, K extends keyof T>(\n  state: FormState<T>,\n  field: K,\n  value: T[K]\n): FormState<T> {\n  const newErrors = { ...state.errors };\n  \n  if (value === null || value === undefined || value === "") {\n    newErrors[field] = `Поле ${String(field)} обязательно`;\n  } else if (String(field) === "email" && !String(value).includes("@")) {\n    newErrors[field] = "Некорректный email";\n  } else {\n    newErrors[field] = undefined;\n  }\n  \n  const newTouched = { ...state.touched, [field]: true };\n  const isValid = Object.values(newErrors).every(e => e === undefined);\n  \n  return {\n    values: { ...state.values, [field]: value },\n    errors: newErrors,\n    touched: newTouched as FormTouched<T>,\n    isValid,\n  };\n}\n\n// Тестирование\ninterface LoginForm { name: string; email: string; age: number; }\n\nlet state = createFormState<LoginForm>({ name: "", email: "", age: 0 });\nconsole.log("Начальное состояние:", state.isValid, state.errors);\n\nstate = validateField(state, "email", "не-email");\nconsole.log("После email:", state.errors.email); // Некорректный email\n\nstate = validateField(state, "name", "Алиса");\nstate = validateField(state, "email", "alice@example.com");\nstate = validateField(state, "age", 25);\nconsole.log("Форма валидна:", state.isValid); // true',
      explanation: 'FormErrors<T> и FormTouched<T> — mapped types, которые трансформируют тип T в новый тип с теми же ключами, но другими значениями. FormState<T> объединяет всё. createFormState использует keyof и тип T для создания начальных значений. validateField — generic функция с K extends keyof T для типобезопасного обращения к полям.'
    }
  ]
}
