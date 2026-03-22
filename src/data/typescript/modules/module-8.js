export default {
  id: 8,
  title: 'Type Aliases и Literal Types',
  description: 'Type aliases для именования сложных типов, литеральные типы, template literal types и const assertion.',
  lessons: [
    {
      id: 1,
      title: 'Type Aliases',
      type: 'theory',
      content: [
        { type: 'text', value: 'Type alias — псевдоним для любого типа. Он не создаёт новый тип, а лишь даёт имя существующему.' },
        { type: 'code', language: 'typescript', value: '// Псевдоним для примитива\ntype UserId = number;\ntype UserName = string;\ntype IsActive = boolean;\n\n// Псевдоним для union\ntype StringOrNumber = string | number;\ntype Nullable<T> = T | null;\ntype Optional<T> = T | undefined;\n\n// Псевдоним для сложного типа\ntype Coordinates = { lat: number; lng: number; };\ntype UserInfo = { id: UserId; name: UserName; active: IsActive; };\n\n// Рекурсивный тип\ntype TreeNode<T> = {\n    value: T;\n    children: TreeNode<T>[];\n};\n\nconst tree: TreeNode<string> = {\n    value: "root",\n    children: [\n        { value: "child1", children: [] },\n        { value: "child2", children: [{ value: "grandchild", children: [] }] }\n    ]\n};' },
        { type: 'note', value: 'Type alias и interface часто взаимозаменяемы для объектов. Главное отличие: type поддерживает union, intersection, computed types; interface поддерживает declaration merging.' }
      ]
    },
    {
      id: 2,
      title: 'Literal Types (Литеральные типы)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Литеральный тип — конкретное значение как тип. "hello" — это тип с единственным допустимым значением "hello".' },
        { type: 'code', language: 'typescript', value: '// Строковые литералы\ntype Direction = "north" | "south" | "east" | "west";\ntype Status = "pending" | "active" | "inactive" | "banned";\n\nfunction move(direction: Direction): void {\n    console.log(`Движение: ${direction}`);\n}\nmove("north"); // OK\n// move("up");  — Ошибка: не входит в Direction\n\n// Числовые литералы\ntype DiceValue = 1 | 2 | 3 | 4 | 5 | 6;\nconst roll: DiceValue = 4; // OK\n// const bad: DiceValue = 7; — Ошибка!\n\n// Булевые литералы (редко, но возможно)\ntype AlwaysTrue = true;\ntype AlwaysFalse = false;' },
        { type: 'tip', value: 'Литеральные типы — мощный инструмент для описания конечного набора допустимых значений. Лучше чем string с проверкой в рантайме!' }
      ]
    },
    {
      id: 3,
      title: 'Template Literal Types',
      type: 'theory',
      content: [
        { type: 'text', value: 'Template literal types (шаблонные литеральные типы, TS 4.1+) позволяют создавать типы через шаблоны строк.' },
        { type: 'code', language: 'typescript', value: '// Базовый пример\ntype Greeting = `Привет, ${string}!`;\nconst g1: Greeting = "Привет, Алибек!"; // OK\nconst g2: Greeting = "Привет, Мир!";    // OK\n// const g3: Greeting = "Пока!";        — Ошибка!\n\n// Комбинирование литералов\ntype Color = "red" | "green" | "blue";\ntype Size = "sm" | "md" | "lg";\ntype ButtonVariant = `${Color}-${Size}`;\n// "red-sm" | "red-md" | "red-lg" | "green-sm" | ...\n\n// CSS свойства\ntype CSSProp = "margin" | "padding";\ntype CSSDirection = "top" | "right" | "bottom" | "left";\ntype CSSProperty = `${CSSProp}-${CSSDirection}`;\n// "margin-top" | "margin-right" | ....\n\n// Event handlers\ntype EventName = "click" | "focus" | "blur";\ntype HandlerName = `on${Capitalize<EventName>}`;\n// "onClick" | "onFocus" | "onBlur"' },
        { type: 'note', value: 'Capitalize, Uppercase, Lowercase, Uncapitalize — встроенные TypeScript утилиты для трансформации строковых типов.' }
      ]
    },
    {
      id: 4,
      title: 'const assertion (as const)',
      type: 'theory',
      content: [
        { type: 'text', value: 'as const делает значение полностью readonly с литеральными типами — TypeScript не расширяет тип до string/number.' },
        { type: 'code', language: 'typescript', value: '// Без as const — TypeScript расширяет тип\nconst config1 = {\n    host: "localhost",  // тип: string (не "localhost")\n    port: 3000          // тип: number (не 3000)\n};\n\n// С as const — литеральные типы и readonly\nconst config2 = {\n    host: "localhost",  // тип: "localhost"\n    port: 3000          // тип: 3000\n} as const;\n\n// config2.host = "другой"; — Ошибка: readonly!\n\n// Массив как readonly кортеж\nconst DIRECTIONS = ["north", "south", "east", "west"] as const;\ntype Direction = typeof DIRECTIONS[number]; // "north" | "south" | "east" | "west"\n\n// Объект-источник для типов\nconst HTTP_STATUS = { OK: 200, NOT_FOUND: 404, ERROR: 500 } as const;\ntype StatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS]; // 200 | 404 | 500' },
        { type: 'tip', value: 'typeof DIRECTIONS[number] — паттерн для получения union типа из значений массива. Очень мощно в сочетании с as const!' }
      ]
    },
    {
      id: 5,
      title: 'Mapped Types',
      type: 'theory',
      content: [
        { type: 'text', value: 'Mapped types преобразуют тип, проходя по его ключам. Это мощный инструмент для создания производных типов.' },
        { type: 'code', language: 'typescript', value: '// Делаем все поля опциональными\ntype Partial<T> = {\n    [K in keyof T]?: T[K];\n};\n\n// Делаем все поля readonly\ntype Readonly<T> = {\n    readonly [K in keyof T]: T[K];\n};\n\n// Пример: форма редактирования (все поля опциональны)\ninterface User { id: number; name: string; email: string; }\ntype UserUpdate = Partial<User>; // { id?: number; name?: string; email?: string; }\n\n// Собственный mapped type\ntype Nullable<T> = {\n    [K in keyof T]: T[K] | null;\n};\n\ntype NullableUser = Nullable<User>;\n// { id: number | null; name: string | null; email: string | null; }' },
        { type: 'list', items: [
          '[K in keyof T] — проходим по всем ключам типа T, K получает тип каждого ключа',
          '?: делает поле опциональным, -?: убирает опциональность (Required<T> использует это)',
          'readonly делает поле только для чтения, -readonly убирает readonly',
          'as K — ремаппинг ключей: можно переименовать ключи через as, например [K in keyof T as `get${Capitalize<K>}`]',
          'Фильтрация через never: [K in keyof T as T[K] extends Function ? never : K] — оставить только не-функции'
        ]},
        { type: 'tip', value: 'Встроенные Partial, Required, Readonly, Pick, Omit — всё это mapped types. Изучи их реализацию в lib.es5.d.ts — это лучший способ понять синтаксис mapped types.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: типизированная конфигурация',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте типизированную систему конфигурации с литеральными типами и const assertion.',
      requirements: [
        'const ENVIRONMENTS = ["development", "staging", "production"] as const',
        'type Environment = typeof ENVIRONMENTS[number]',
        'interface AppConfig { env: Environment; port: number; debug: boolean; apiUrl: string; }',
        'Функция createConfig(env: Environment): AppConfig — разные настройки для каждого env',
        'Функция isProduction(config: AppConfig): boolean'
      ],
      expectedOutput: 'Dev конфиг: port=3000, debug=true\nProd конфиг: port=8080, debug=false\nIsProduction(dev): false\nIsProduction(prod): true',
      hint: 'createConfig использует switch по env или ternary для разных значений.',
      solution: 'const ENVIRONMENTS = ["development", "staging", "production"] as const;\ntype Environment = typeof ENVIRONMENTS[number];\n\ninterface AppConfig {\n    env: Environment;\n    port: number;\n    debug: boolean;\n    apiUrl: string;\n}\n\nfunction createConfig(env: Environment): AppConfig {\n    const configs: Record<Environment, AppConfig> = {\n        development: { env, port: 3000, debug: true, apiUrl: "http://localhost:3000/api" },\n        staging: { env, port: 4000, debug: false, apiUrl: "https://staging.example.com/api" },\n        production: { env, port: 8080, debug: false, apiUrl: "https://api.example.com" }\n    };\n    return configs[env];\n}\n\nfunction isProduction(config: AppConfig): boolean {\n    return config.env === "production";\n}\n\nconst devConfig = createConfig("development");\nconst prodConfig = createConfig("production");\nconsole.log(`Dev конфиг: port=${devConfig.port}, debug=${devConfig.debug}`);\nconsole.log(`Prod конфиг: port=${prodConfig.port}, debug=${prodConfig.debug}`);\nconsole.log(`IsProduction(dev): ${isProduction(devConfig)}`);\nconsole.log(`IsProduction(prod): ${isProduction(prodConfig)}`);',
      explanation: 'as const + typeof array[number] — идиоматический способ создать union из массива констант. Record<Environment, AppConfig> гарантирует что все среды обработаны.'
    }
  ]
}
