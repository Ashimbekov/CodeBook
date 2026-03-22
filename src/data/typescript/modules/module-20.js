export default {
  id: 20,
  title: 'Best Practices',
  description: 'Лучшие практики TypeScript: избегание any, именование типов, организация кода, производительность компилятора и написание поддерживаемого кода',
  lessons: [
    {
      id: 1,
      title: 'Избегайте any — используйте unknown',
      type: 'theory',
      content: [
        { type: 'text', value: 'any — "выключатель" TypeScript. Переменная типа any полностью отключает проверку типов. unknown — безопасная альтернатива: вы обязаны сузить тип перед использованием.' },
        { type: 'heading', value: 'any vs unknown' },
        { type: 'code', language: 'typescript', value: '// any — опасно: TypeScript молчит об ошибках\nfunction processAny(value: any): void {\n  value.toUpperCase(); // OK — TypeScript не проверяет!\n  value.nonExistent(); // OK — TypeScript молчит!\n  value * 100;         // OK — но может быть NaN!\n}\n\nprocessAny(42);      // Ошибка в рантайме: toUpperCase is not a function\nprocessAny(null);    // Ошибка в рантайме: Cannot read properties of null\n\n// unknown — безопасно: НУЖНО проверить тип\nfunction processUnknown(value: unknown): string {\n  // value.toUpperCase(); <- Ошибка компиляции!\n  \n  if (typeof value === "string") {\n    return value.toUpperCase(); // OK — тип сужен\n  }\n  if (typeof value === "number") {\n    return value.toString();    // OK — тип сужен\n  }\n  return String(value);\n}\n\n// Правило: если нужен "любой тип" — используйте unknown, не any' },
        { type: 'heading', value: 'Когда any всё же уместен' },
        { type: 'code', language: 'typescript', value: '// 1. В migrate-сценариях: // @ts-expect-error\n// 2. Для очень сложных generic типов\n// 3. В тестовых моках\n// 4. В .d.ts файлах для legacy JS библиотек\n\n// Но лучше использовать:\n// - unknown вместо any\n// - never для невозможных состояний\n// - Generic параметры вместо any в функциях\n\n// Плохо:\nfunction identity(x: any): any { return x; }\n\n// Хорошо:\nfunction identity<T>(x: T): T { return x; }' },
        { type: 'tip', value: 'Включите eslint правило @typescript-eslint/no-explicit-any — оно будет предупреждать о каждом any в коде. В новых проектах стремитесь к нулевому количеству any.' }
      ]
    },
    {
      id: 2,
      title: 'Именование и организация типов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошие имена типов делают код самодокументированным. Правила именования и организации типов — важная часть поддерживаемости TypeScript проектов.' },
        { type: 'heading', value: 'Соглашения по именованию' },
        { type: 'code', language: 'typescript', value: '// Интерфейсы: PascalCase, без префикса I (NOT IUser!)\ninterface User { id: number; name: string; }\ninterface UserRepository { findById(id: number): User; }\n\n// Type aliases: PascalCase\ntype UserId = number;\ntype UserRole = "admin" | "user" | "guest";\n\n// Generic параметры: T, U, V или осмысленные имена\ntype ApiResponse<TData>    = { data: TData; status: number; };\ntype Dictionary<TValue>    = Record<string, TValue>;\ntype Callback<TArg, TResult> = (arg: TArg) => TResult;\n\n// Булевы типы: с вопросом или Is/Has/Can\ntype IsLoading = boolean;\ntype HasChildren = boolean;\n\n// Суффиксы для типов входа/выхода\ntype CreateUserInput  = Omit<User, "id" | "createdAt">;\ntype UpdateUserInput  = Partial<CreateUserInput>;\ntype UserResponse     = User & { token: string; };\ntype UserListResponse = { users: User[]; total: number; page: number; };' },
        { type: 'heading', value: 'Организация файлов с типами' },
        { type: 'code', language: 'typescript', value: '// Структура types/ директории:\n// types/\n//   domain/\n//     user.ts      — доменные типы User\n//     product.ts   — доменные типы Product\n//   api/\n//     requests.ts  — типы тел запросов\n//     responses.ts — типы ответов API\n//   common.ts      — общие утилитные типы\n//   index.ts       — barrel (реэкспорты)\n\n// types/common.ts\nexport type Nullable<T>    = T | null;\nexport type Optional<T>    = T | undefined;\nexport type Maybe<T>       = T | null | undefined;\nexport type AsyncFn<T>     = () => Promise<T>;\nexport type ID             = number | string;\nexport type Timestamp      = Date | string | number;\nexport type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };' },
        { type: 'note', value: 'Старая конвенция с I-префиксом (IUser, IRepository) — устаревшая. TypeScript core team и большинство современных стайлгайдов рекомендуют без префикса. Используйте осмысленные имена.' }
      ]
    },
    {
      id: 3,
      title: 'Предпочитайте interface vs type alias',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда использовать interface, а когда type? Общее правило: interface для описания форм объектов и классов, type для всего остального (union, intersection, mapped, conditional).' },
        { type: 'heading', value: 'Ключевые различия' },
        { type: 'code', language: 'typescript', value: '// interface — расширяемый, поддерживает declaration merging\ninterface Animal {\n  name: string;\n}\n// Позже можно дополнить (declaration merging):\ninterface Animal {\n  age: number;\n}\n// Теперь Animal = { name: string; age: number }\n\n// type — не расширяется после создания\ntype Animal2 = { name: string; };\n// type Animal2 = { age: number }; <- Ошибка!\n\n// interface extends\ninterface Dog extends Animal {\n  breed: string;\n}\n\n// type intersection\ntype Dog2 = Animal2 & { breed: string; };\n\n// type нужен для:\ntype StringOrNumber = string | number;              // union\ntype Callback = (value: string) => void;            // function type\ntype Triple<T> = [T, T, T];                        // tuple\ntype Point = [number, number];                     // named tuple\ntype EventMap = Record<string, () => void>;        // mapped\ntype KeyOf<T> = T extends object ? keyof T : never; // conditional' },
        { type: 'tip', value: 'Официальная рекомендация TypeScript: используйте interface пока не понадобятся возможности type (union, mapped types и т.д.). interface даёт лучшие сообщения об ошибках и поддерживает declaration merging.' }
      ]
    },
    {
      id: 4,
      title: 'Избегайте type assertions (as)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Type assertion (as Type) — "я знаю лучше TypeScript". Используйте осторожно. Каждый as — потенциальное место для runtime ошибки. Есть более безопасные альтернативы.' },
        { type: 'heading', value: 'Проблемы с type assertions' },
        { type: 'code', language: 'typescript', value: '// ПЛОХО — обход проверки типов\nconst user = fetchUser() as User; // А вдруг вернёт null?\nuser.name; // TypeError в рантайме!\n\n// ПЛОХО — двойной assertion\nconst x = someValue as unknown as string; // Красный флаг!\n\n// ХОРОШО — type guard\nfunction isUser(obj: unknown): obj is User {\n  return typeof obj === "object" && obj !== null &&\n         "id" in obj && "name" in obj;\n}\n\nconst data = fetchUser();\nif (isUser(data)) {\n  data.name; // Безопасно!\n}\n\n// ХОРОШО — assertion только с проверкой\nconst input = document.getElementById("myInput");\nif (input instanceof HTMLInputElement) {\n  input.value = "text"; // Безопасно, instanceof проверил!\n}\n\n// ХОРОШО — non-null assertion ! только когда уверены\nconst btn = document.getElementById("submit")!; // Только если знаем, что есть\nbtn.addEventListener("click", handler);' },
        { type: 'heading', value: 'Когда as допустим' },
        { type: 'code', language: 'typescript', value: '// 1. Констант-объекты для discriminated unions\nconst action = { type: "INCREMENT" } as const;\n// type: "INCREMENT" (литерал), не string\n\n// 2. Начальные значения в createFormState\nconst errors = {} as FormErrors<T>;\n// Мы знаем, что заполним все поля следом\n\n// 3. Сужение в теле функции, где проверка выполнена\nfunction assertIsString(val: unknown): asserts val is string {\n  if (typeof val !== "string") throw new Error("Ожидается string");\n}\n\nconst value: unknown = getFromLocalStorage();\nassertIsString(value); // Если ошибки нет, TypeScript знает: string\nconsole.log(value.toUpperCase()); // OK!' }
      ]
    },
    {
      id: 5,
      title: 'Производительность TypeScript проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Большие TypeScript проекты могут медленно компилироваться. Несколько практик ускоряют компиляцию: правильный tsconfig, разделение проектов, избегание тяжёлых типов.' },
        { type: 'heading', value: 'Ускорение компиляции' },
        { type: 'code', language: 'typescript', value: '// tsconfig.json оптимизации:\n// {\n//   "compilerOptions": {\n//     "incremental": true,           // Кэш компиляции\n//     "tsBuildInfoFile": "./.tscache", // Файл кэша\n//     "skipLibCheck": true,           // Не проверять .d.ts в node_modules\n//     "isolatedModules": true,         // Совместимость с esbuild/swc\n//   }\n// }\n\n// Разделение на subprojects через Project References:\n// tsconfig.json\n// {\n//   "references": [\n//     { "path": "./packages/core" },\n//     { "path": "./packages/ui" },\n//     { "path": "./packages/server" }\n//   ]\n// }' },
        { type: 'heading', value: 'Тяжёлые типы — как избежать' },
        { type: 'code', language: 'typescript', value: '// Избегайте избыточной рекурсии:\n// Плохо:\ntype DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] };\n// Каждый раз вычисляется заново!\n\n// Хорошо: используйте встроенные Utility Types где возможно\ntype ReadonlyUser = Readonly<User>;\n\n// Используйте import type для импорта только типов:\nimport type { User, Product } from "./types";\n// При сборке полностью удаляется, не влияет на runtime\n\n// Избегайте тяжёлых условных типов в hot paths:\n// Плохо:\ntype A<T> = T extends Record<string, infer V> ? V extends Array<infer U> ? U : V : T;\n// Хорошо: разбейте на несколько шагов с промежуточными типами' },
        { type: 'tip', value: 'Команда npx tsc --extendedDiagnostics покажет, что больше всего тормозит компиляцию: какие файлы и типы занимают больше всего времени.' }
      ]
    },
    {
      id: 6,
      title: 'ESLint + TypeScript',
      type: 'theory',
      content: [
        { type: 'text', value: 'TypeScript компилятор ловит типовые ошибки, но ESLint с плагином @typescript-eslint ловит проблемы стиля, потенциальные баги и неиспользованный код. Вместе они — мощный тандем.' },
        { type: 'heading', value: 'Настройка ESLint' },
        { type: 'code', language: 'typescript', value: '// Установка:\n// npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin\n\n// eslint.config.js (flat config):\n// import tsPlugin from "@typescript-eslint/eslint-plugin";\n// import tsParser from "@typescript-eslint/parser";\n//\n// export default [\n//   {\n//     files: ["**/*.ts", "**/*.tsx"],\n//     languageOptions: { parser: tsParser },\n//     plugins: { "@typescript-eslint": tsPlugin },\n//     rules: {\n//       "@typescript-eslint/no-explicit-any": "warn",\n//       "@typescript-eslint/no-unused-vars": "error",\n//       "@typescript-eslint/explicit-function-return-type": "off",\n//       "@typescript-eslint/prefer-nullish-coalescing": "error",\n//       "@typescript-eslint/prefer-optional-chain": "error",\n//     }\n//   }\n// ];' },
        { type: 'heading', value: 'Полезные правила' },
        { type: 'code', language: 'typescript', value: '// prefer-optional-chain: используй ?. вместо && цепочек\n// Было:\nconst name = user && user.profile && user.profile.name;\n// Стало:\nconst name = user?.profile?.name;\n\n// prefer-nullish-coalescing: используй ?? вместо ||\n// Было: const port = config.port || 3000; (0 считается falsy!)\n// Стало:\nconst port = config.port ?? 3000; // 0 допустимое значение!\n\n// no-non-null-assertion: запрет !\nconst el = document.getElementById("id")!; // Предупреждение\n\n// consistent-type-imports: всегда import type для типов\nimport type { User } from "./user"; // Правило может требовать это' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Рефакторинг кода с any',
      type: 'practice',
      difficulty: 'medium',
      description: 'Отрефакторьте данный код, убрав все any и добавив правильные типы. Используйте unknown, generics, type guards и правильное именование.',
      requirements: [
        'Убрать все any из кода',
        'Типизировать функцию parseResponse с generic T',
        'Добавить type guard isApiError',
        'Типизировать функцию fetchData с proper error handling',
        'Добавить интерфейсы ApiError и ApiSuccess<T>',
        'Использовать unknown для данных из внешних источников'
      ],
      hint: 'parseResponse должна возвращать ApiSuccess<T> | ApiError. Используйте unknown для тела ответа, затем type guard для сужения. fetchData — async generic функция.',
      expectedOutput: '// tsc --noEmit: 0 ошибок (все any заменены)\n\n// Успешный запрос:\nconst user = await fetchData<User>("/api/users/1");\nconsole.log(user.name); // Leanne Graham — TypeScript знает тип string!\n\n// Ошибка API (404):\n// Error: API Error 404: Not Found\n\n// Ошибка сети:\n// Error: Неизвестная ошибка сети\n\n// TypeScript проверяет типы:\n// user.nonExistentField  → error TS2339: Property \'nonExistentField\' does not exist on type \'User\'',
      solution: '// Типы\ninterface ApiSuccess<T> {\n  success: true;\n  data: T;\n  status: number;\n}\n\ninterface ApiError {\n  success: false;\n  error: string;\n  status: number;\n  code?: string;\n}\n\ntype ApiResponse<T> = ApiSuccess<T> | ApiError;\n\nfunction isApiError(response: ApiResponse<unknown>): response is ApiError {\n  return !response.success;\n}\n\n// Type guard для проверки shape данных\nfunction hasShape<T extends object>(obj: unknown, keys: (keyof T)[]): obj is T {\n  return (\n    typeof obj === "object" &&\n    obj !== null &&\n    keys.every(key => key in obj)\n  );\n}\n\nasync function parseResponse<T>(response: Response): Promise<ApiResponse<T>> {\n  const body: unknown = await response.json();\n  \n  if (!response.ok) {\n    return {\n      success: false,\n      error: typeof body === "object" && body !== null && "message" in body\n        ? String((body as any).message)\n        : "Неизвестная ошибка",\n      status: response.status,\n    };\n  }\n  \n  return {\n    success: true,\n    data: body as T, // Здесь as допустим: caller знает тип T\n    status: response.status,\n  };\n}\n\nasync function fetchData<T>(url: string): Promise<T> {\n  try {\n    const response = await fetch(url);\n    const result = await parseResponse<T>(response);\n    \n    if (isApiError(result)) {\n      throw new Error(`API Error ${result.status}: ${result.error}`);\n    }\n    \n    return result.data;\n  } catch (error: unknown) {\n    if (error instanceof Error) throw error;\n    throw new Error("Неизвестная ошибка сети");\n  }\n}\n\n// Использование:\ninterface User { id: number; name: string; email: string; }\n\n// TypeScript знает тип возврата!\nconst user = await fetchData<User>("/api/users/1");\nconsole.log(user.name); // string — полный intellisense',
      explanation: 'Замена any на unknown заставляет явно обрабатывать типы. ApiResponse<T> — discriminated union, isApiError — type guard для сужения. Generic fetchData<T> позволяет вызывающему коду указать ожидаемый тип. error: unknown в catch — более безопасно, чем error: any.'
    }
  ]
}
