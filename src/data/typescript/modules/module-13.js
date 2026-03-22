export default {
  id: 13,
  title: 'Type Guards и Narrowing',
  description: 'Защита типов и сужение: typeof, instanceof, in, пользовательские type guards, discriminated unions и exhaustive checks',
  lessons: [
    {
      id: 1,
      title: 'Что такое Narrowing и зачем он нужен',
      type: 'theory',
      content: [
        { type: 'text', value: 'Narrowing (сужение) — это процесс, при котором TypeScript уточняет тип переменной внутри условного блока. Когда у вас есть переменная типа string | number, внутри if-блока TypeScript "знает" точный тип.' },
        { type: 'tip', value: 'Представьте: у вас посылка, на которой написано "книга или ноутбук". Пока не открыли — тип union. Открыли и увидели книгу — TypeScript теперь знает точный тип.' },
        { type: 'heading', value: 'Простой пример narrowing' },
        { type: 'code', language: 'typescript', value: 'function printLength(value: string | number): void {\n  // Здесь value: string | number — TypeScript не знает точный тип\n  // value.length  <- Ошибка! number не имеет .length\n\n  if (typeof value === "string") {\n    // Здесь TypeScript знает: value: string\n    console.log("Длина строки:", value.length);\n  } else {\n    // Здесь TypeScript знает: value: number\n    console.log("Число:", value.toFixed(2));\n  }\n}\n\nprintLength("hello"); // Длина строки: 5\nprintLength(3.14159); // Число: 3.14' },
        { type: 'heading', value: 'Control Flow Analysis' },
        { type: 'text', value: 'TypeScript анализирует поток управления: после проверки null, в блоке if TypeScript исключает null из возможных типов.' },
        { type: 'code', language: 'typescript', value: 'function greet(name: string | null): string {\n  if (name === null) {\n    return "Привет, гость!";\n  }\n  // Здесь name: string (null исключён)\n  return `Привет, ${name}!`;\n}\n\n// Ранний возврат — тоже narrowing\nfunction processUser(user: string | undefined): void {\n  if (!user) return; // undefined и "" исключены\n  // Здесь user: string (непустая строка)\n  console.log(user.toUpperCase());\n}' },
        { type: 'note', value: 'Narrowing работает автоматически — не нужно никаких аннотаций. TypeScript отслеживает ваш код и понимает, какие типы возможны в каждой точке программы.' }
      ]
    },
    {
      id: 2,
      title: 'typeof и instanceof Guards',
      type: 'theory',
      content: [
        { type: 'text', value: 'typeof — оператор JavaScript для проверки примитивных типов. instanceof — оператор для проверки принадлежности к классу. Оба отлично работают как type guards в TypeScript.' },
        { type: 'heading', value: 'typeof guard' },
        { type: 'code', language: 'typescript', value: 'type InputValue = string | number | boolean | null;\n\nfunction formatInput(val: InputValue): string {\n  if (val === null) return "null";\n  \n  switch (typeof val) {\n    case "string":\n      return `"${val}"`; // val: string\n    case "number":\n      return val.toFixed(2); // val: number\n    case "boolean":\n      return val ? "да" : "нет"; // val: boolean\n    default:\n      return String(val);\n  }\n}\n\nconsole.log(formatInput("привет")); // "привет"\nconsole.log(formatInput(3.14));     // 3.14\nconsole.log(formatInput(true));     // да' },
        { type: 'heading', value: 'instanceof guard' },
        { type: 'code', language: 'typescript', value: 'class Dog {\n  name: string;\n  constructor(name: string) { this.name = name; }\n  bark(): string { return `${this.name} говорит: Гав!`; }\n}\n\nclass Cat {\n  name: string;\n  constructor(name: string) { this.name = name; }\n  meow(): string { return `${this.name} говорит: Мяу!`; }\n}\n\nfunction makeSound(animal: Dog | Cat): string {\n  if (animal instanceof Dog) {\n    return animal.bark(); // animal: Dog\n  } else {\n    return animal.meow(); // animal: Cat\n  }\n}\n\nconsole.log(makeSound(new Dog("Шарик"))); // Шарик говорит: Гав!\nconsole.log(makeSound(new Cat("Мурка"))); // Мурка говорит: Мяу!' },
        { type: 'tip', value: 'typeof работает только с примитивами: string, number, boolean, bigint, symbol, undefined, object, function. Для классов используйте instanceof.' }
      ]
    },
    {
      id: 3,
      title: 'in operator и property checks',
      type: 'theory',
      content: [
        { type: 'text', value: 'Оператор in проверяет наличие свойства в объекте. TypeScript использует это для сужения типов — если у объекта есть определённое свойство, TypeScript знает, какой это тип.' },
        { type: 'heading', value: 'in operator для различения типов' },
        { type: 'code', language: 'typescript', value: 'interface Circle {\n  kind: string;\n  radius: number;\n}\n\ninterface Rectangle {\n  kind: string;\n  width: number;\n  height: number;\n}\n\ntype Shape = Circle | Rectangle;\n\nfunction getArea(shape: Shape): number {\n  if ("radius" in shape) {\n    // shape: Circle — есть свойство radius\n    return Math.PI * shape.radius ** 2;\n  } else {\n    // shape: Rectangle — нет radius\n    return shape.width * shape.height;\n  }\n}\n\nconsole.log(getArea({ kind: "circle", radius: 5 }));\nconsole.log(getArea({ kind: "rect", width: 4, height: 6 }));' },
        { type: 'heading', value: 'Проверка необязательных свойств' },
        { type: 'code', language: 'typescript', value: 'interface Admin {\n  name: string;\n  adminLevel: number;\n  permissions: string[];\n}\n\ninterface User {\n  name: string;\n  email: string;\n}\n\ntype Person = Admin | User;\n\nfunction describe(person: Person): string {\n  if ("adminLevel" in person) {\n    // person: Admin\n    return `Администратор ${person.name}, уровень ${person.adminLevel}`;\n  }\n  // person: User\n  return `Пользователь ${person.name}, email: ${person.email}`;\n}\n\nconst admin: Admin = { name: "Алиса", adminLevel: 3, permissions: ["read", "write"] };\nconst user: User  = { name: "Боб", email: "bob@example.com" };\nconsole.log(describe(admin));\nconsole.log(describe(user));' },
        { type: 'note', value: 'Оператор in идеален, когда типы не имеют общего дискриминирующего поля или когда вы работаете с интерфейсами (а не классами), где instanceof не применим.' }
      ]
    },
    {
      id: 4,
      title: 'Discriminated Unions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Discriminated Union (размеченное объединение) — паттерн, где у каждого типа в union есть общее "дискриминирующее" поле с уникальным литеральным значением. Это самый чистый способ работы с union типами.' },
        { type: 'heading', value: 'Базовый паттерн' },
        { type: 'code', language: 'typescript', value: 'interface LoadingState {\n  status: "loading"; // дискриминатор\n}\n\ninterface SuccessState {\n  status: "success"; // дискриминатор\n  data: string[];\n}\n\ninterface ErrorState {\n  status: "error"; // дискриминатор\n  message: string;\n}\n\ntype State = LoadingState | SuccessState | ErrorState;\n\nfunction render(state: State): string {\n  switch (state.status) {\n    case "loading":\n      return "Загрузка...";\n    case "success":\n      // state: SuccessState — TypeScript знает про data\n      return `Загружено ${state.data.length} элементов`;\n    case "error":\n      // state: ErrorState — TypeScript знает про message\n      return `Ошибка: ${state.message}`;\n  }\n}' },
        { type: 'heading', value: 'Реальный пример: Redux actions' },
        { type: 'code', language: 'typescript', value: 'interface AddTodo {\n  type: "ADD_TODO";\n  payload: { id: number; text: string };\n}\n\ninterface ToggleTodo {\n  type: "TOGGLE_TODO";\n  payload: { id: number };\n}\n\ninterface DeleteTodo {\n  type: "DELETE_TODO";\n  payload: { id: number };\n}\n\ntype TodoAction = AddTodo | ToggleTodo | DeleteTodo;\n\nfunction todoReducer(actions: TodoAction[]): string[] {\n  const log: string[] = [];\n  for (const action of actions) {\n    switch (action.type) {\n      case "ADD_TODO":\n        log.push(`Добавлено: ${action.payload.text}`);\n        break;\n      case "TOGGLE_TODO":\n        log.push(`Переключено: id=${action.payload.id}`);\n        break;\n      case "DELETE_TODO":\n        log.push(`Удалено: id=${action.payload.id}`);\n        break;\n    }\n  }\n  return log;\n}' },
        { type: 'tip', value: 'Discriminated unions + switch = идеальная комбинация. TypeScript в каждом case знает точный тип и даёт полный intellisense. Это самый читаемый и безопасный паттерн для работы с union.' }
      ]
    },
    {
      id: 5,
      title: 'Пользовательские Type Guards (is)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда встроенных проверок (typeof, instanceof, in) недостаточно. Пользовательские type guards позволяют создавать свои функции-предикаты с ключевым словом is.' },
        { type: 'heading', value: 'Синтаксис type predicate' },
        { type: 'code', language: 'typescript', value: 'interface Fish {\n  swim(): void;\n  name: string;\n}\n\ninterface Bird {\n  fly(): void;\n  name: string;\n}\n\n// Пользовательский type guard: "pet is Fish"\nfunction isFish(pet: Fish | Bird): pet is Fish {\n  return (pet as Fish).swim !== undefined;\n}\n\nfunction move(pet: Fish | Bird): void {\n  if (isFish(pet)) {\n    // pet: Fish\n    pet.swim();\n  } else {\n    // pet: Bird\n    pet.fly();\n  }\n}\n\n// Тип-предикат работает и с filter!\nconst animals: (Fish | Bird)[] = [\n  { name: "Немо", swim: () => console.log("плывёт") },\n  { name: "Орёл", fly: () => console.log("летит") },\n];\n\nconst onlyFish: Fish[] = animals.filter(isFish); // Fish[]!' },
        { type: 'heading', value: 'Сложный type guard с валидацией' },
        { type: 'code', language: 'typescript', value: 'interface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\n// Проверяем, что unknown является валидным User\nfunction isUser(obj: unknown): obj is User {\n  return (\n    typeof obj === "object" &&\n    obj !== null &&\n    "id" in obj &&\n    "name" in obj &&\n    "email" in obj &&\n    typeof (obj as User).id === "number" &&\n    typeof (obj as User).name === "string" &&\n    typeof (obj as User).email === "string"\n  );\n}\n\n// Безопасная обработка данных из API\nfunction processApiResponse(data: unknown): string {\n  if (isUser(data)) {\n    return `Пользователь: ${data.name} (${data.email})`;\n  }\n  return "Неверный формат данных";\n}' },
        { type: 'note', value: 'Пользовательские type guards особенно полезны при работе с данными из API (тип unknown), JSON.parse() и любыми внешними источниками данных, где тип неизвестен на этапе компиляции.' }
      ]
    },
    {
      id: 6,
      title: 'Exhaustive Check и never тип',
      type: 'theory',
      content: [
        { type: 'text', value: 'Exhaustive check — проверка на полноту обработки всех вариантов union. TypeScript использует тип never: переменная типа never не может существовать. Если код дошёл до never — мы что-то не обработали.' },
        { type: 'heading', value: 'Паттерн exhaustive check' },
        { type: 'code', language: 'typescript', value: 'type Color = "red" | "green" | "blue";\n\nfunction assertNever(x: never): never {\n  throw new Error(`Необработанный вариант: ${JSON.stringify(x)}`);\n}\n\nfunction getColorCode(color: Color): string {\n  switch (color) {\n    case "red":   return "#FF0000";\n    case "green": return "#00FF00";\n    case "blue":  return "#0000FF";\n    default:\n      // Если забудем добавить case для нового цвета —\n      // TypeScript выдаст ошибку ЗДЕСЬ!\n      return assertNever(color);\n  }\n}\n\n// Теперь добавьте "yellow" в Color:\n// type Color = "red" | "green" | "blue" | "yellow";\n// TypeScript сразу выдаст ошибку в default-ветке!' },
        { type: 'heading', value: 'Exhaustive check с объектом маппинга' },
        { type: 'code', language: 'typescript', value: 'type Status = "active" | "inactive" | "pending";\n\n// Объект-маппинг — TypeScript проверит полноту\nconst statusLabels: Record<Status, string> = {\n  active:   "Активный",\n  inactive: "Неактивный",\n  pending:  "Ожидает",\n  // Если добавить новый статус в Status и забыть сюда —\n  // TypeScript выдаст ошибку!\n};\n\nfunction getLabel(status: Status): string {\n  return statusLabels[status];\n}' },
        { type: 'tip', value: 'Exhaustive checks делают рефакторинг безопасным: добавили новый вариант в union — TypeScript сам укажет все места, где нужно добавить обработку. Никаких пропущенных case!' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Система обработки событий',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте систему обработки событий с discriminated unions и type guards. Реализуйте обработчик событий, который безопасно обрабатывает разные типы событий и содержит exhaustive check.',
      requirements: [
        'Создайте union тип Event с полями: ClickEvent (x, y), KeyEvent (key, ctrlKey), InputEvent (value, target)',
        'Добавьте дискриминирующее поле type для каждого события',
        'Напишите функцию handleEvent(event: Event): string',
        'Используйте switch по type с exhaustive check в default',
        'Напишите type guard isClickEvent(e: Event): e is ClickEvent',
        'Протестируйте все три типа событий'
      ],
      hint: 'Дискриминирующее поле type должно иметь строковые литеральные типы: "click", "key", "input". В default ветке switch используйте функцию assertNever.',
      solution: 'interface ClickEvent {\n  type: "click";\n  x: number;\n  y: number;\n}\n\ninterface KeyEvent {\n  type: "key";\n  key: string;\n  ctrlKey: boolean;\n}\n\ninterface InputEvent {\n  type: "input";\n  value: string;\n  target: string;\n}\n\ntype AppEvent = ClickEvent | KeyEvent | InputEvent;\n\nfunction assertNever(x: never): never {\n  throw new Error(`Необработанное событие: ${JSON.stringify(x)}`);\n}\n\nfunction isClickEvent(e: AppEvent): e is ClickEvent {\n  return e.type === "click";\n}\n\nfunction handleEvent(event: AppEvent): string {\n  switch (event.type) {\n    case "click":\n      return `Клик в позиции (${event.x}, ${event.y})`;\n    case "key":\n      const combo = event.ctrlKey ? `Ctrl+${event.key}` : event.key;\n      return `Нажата клавиша: ${combo}`;\n    case "input":\n      return `Введено "${event.value}" в поле ${event.target}`;\n    default:\n      return assertNever(event);\n  }\n}\n\nconst events: AppEvent[] = [\n  { type: "click", x: 100, y: 200 },\n  { type: "key", key: "S", ctrlKey: true },\n  { type: "input", value: "Привет", target: "username" }\n];\n\nevents.forEach(e => console.log(handleEvent(e)));\n\nconst clicks = events.filter(isClickEvent);\nconsole.log(`Кликов: ${clicks.length}`);',
      explanation: 'Discriminated union с полем type позволяет TypeScript точно знать тип в каждой ветке switch. Функция assertNever гарантирует, что при добавлении нового типа события компилятор выдаст ошибку. Type guard isClickEvent полезен для фильтрации массивов событий.'
    }
  ]
}
