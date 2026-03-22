export default {
  id: 9,
  title: 'Enums',
  description: 'Перечисления (Enums) в TypeScript: числовые, строковые, const enum, их применение и ограничения.',
  lessons: [
    {
      id: 1,
      title: 'Числовые перечисления',
      type: 'theory',
      content: [
        { type: 'text', value: 'Enum (перечисление) — набор именованных констант. Числовые enum автоматически нумеруются начиная с 0.' },
        { type: 'code', language: 'typescript', value: 'enum Direction {\n    North, // 0\n    South, // 1\n    East,  // 2\n    West   // 3\n}\n\nconsole.log(Direction.North); // 0\nconsole.log(Direction.East);  // 2\n\n// Ручная нумерация\nenum StatusCode {\n    OK = 200,\n    NotFound = 404,\n    ServerError = 500\n}\n\nconsole.log(StatusCode.OK); // 200\n\n// Числовые enum двунаправлены!\nconsole.log(Direction[0]); // "North"\nconsole.log(StatusCode[404]); // "NotFound"' },
        { type: 'note', value: 'Числовые enum генерируют двунаправленный объект в JavaScript: и Direction.North === 0, и Direction[0] === "North". Это полезно для отладки, но увеличивает бандл.' }
      ]
    },
    {
      id: 2,
      title: 'Строковые перечисления',
      type: 'theory',
      content: [
        { type: 'text', value: 'Строковые enum надёжнее числовых: значения явны, нет магических чисел, лучше отлаживаются.' },
        { type: 'code', language: 'typescript', value: 'enum UserStatus {\n    Active   = "active",\n    Inactive = "inactive",\n    Banned   = "banned",\n    Pending  = "pending"\n}\n\nfunction checkStatus(status: UserStatus): string {\n    switch (status) {\n        case UserStatus.Active:   return "Пользователь активен";\n        case UserStatus.Banned:   return "Пользователь заблокирован";\n        case UserStatus.Pending:  return "Ожидает подтверждения";\n        default:                  return "Неактивен";\n    }\n}\n\nconsole.log(checkStatus(UserStatus.Active)); // "Пользователь активен"\n\n// Строковые enum НЕ двунаправлены\n// UserStatus["active"] — undefined (в отличие от числовых)' },
        { type: 'tip', value: 'Предпочитайте строковые enum числовым: значения читаемы в логах, API, БД. "active" понятнее чем 0.' }
      ]
    },
    {
      id: 3,
      title: 'const enum: оптимизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'const enum полностью инлайнится при компиляции — вместо обращения к объекту подставляется значение напрямую. Нулевой overhead в рантайме.' },
        { type: 'code', language: 'typescript', value: 'const enum Role {\n    Admin   = "admin",\n    User    = "user",\n    Manager = "manager"\n}\n\nconst userRole: Role = Role.Admin;\n\n// Компилируется в:\nconst userRole = "admin"; // Значение инлайнено!\n// Никакого объекта Role в JavaScript!\n\n// Обычный enum компилируется в объект:\nvar Role;\n(function (Role) {\n    Role["Admin"] = "admin";\n    Role["User"] = "user";\n})(Role || (Role = {}));' },
        { type: 'warning', value: 'const enum нельзя использовать если TypeScript-файл будет обрабатываться Babel/esbuild без tsc (они не поддерживают инлайнинг const enum). Безопаснее использовать обычный enum или union типы.' }
      ]
    },
    {
      id: 4,
      title: 'Enum vs Union типы',
      type: 'theory',
      content: [
        { type: 'text', value: 'В современном TypeScript Union типы часто предпочтительнее enum. Сравним оба подхода.' },
        { type: 'code', language: 'typescript', value: '// Подход с enum\nenum Color {\n    Red   = "red",\n    Green = "green",\n    Blue  = "blue"\n}\n\n// Подход с Union\ntype Color = "red" | "green" | "blue";\n\n// Union: проще, меньше кода, нет рантайм-объекта\ntype Status = "pending" | "active" | "done";\n\nfunction getLabel(status: Status): string {\n    const labels: Record<Status, string> = {\n        pending: "Ожидание",\n        active:  "Активно",\n        done:    "Завершено"\n    };\n    return labels[status];\n}' },
        { type: 'list', value: 'Используйте Enum когда: значения нужны в рантайме, нужна итерация по значениям, большая команда с Java/C# фоном\nИспользуйте Union когда: простые строковые/числовые константы, меньше бойлерплейта, совместимость с Babel/esbuild' }
      ]
    },
    {
      id: 5,
      title: 'Работа с Enum: итерация и проверки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Числовые enum имеют двунаправленный маппинг — это нужно учитывать при итерации. Строковые enum итерируются проще.' },
        { type: 'code', language: 'typescript', value: 'enum Weekday {\n    Mon = 1, Tue, Wed, Thu, Fri, Sat, Sun\n}\n\n// Итерация по числовому enum\nfor (const key in Weekday) {\n    if (isNaN(Number(key))) { // Фильтруем числовые ключи (обратный маппинг)\n        console.log(`${key}: ${Weekday[key as keyof typeof Weekday]}`);\n    }\n}\n\n// Получить все значения\nconst values = Object.values(Weekday).filter(v => typeof v === "string");\n\n// Проверить принадлежность\nfunction isWeekday(value: unknown): value is Weekday {\n    return Object.values(Weekday).includes(value as Weekday);\n}\n\nconsole.log(isWeekday(Weekday.Mon)); // true\nconsole.log(isWeekday(8));           // false' },
        { type: 'list', items: [
          'Числовой enum: for...in включает как строковые ключи ("Mon"), так и числовые ("1") — обратный маппинг. Фильтруй isNaN(Number(key))',
          'Object.values(Weekday).filter(v => typeof v === "string") — получить только имена членов enum',
          'Строковый enum: for...in и Object.values работают без фильтрации — нет обратного маппинга',
          'typeof Weekday — тип самого объекта enum; keyof typeof Weekday — union ключей ("Mon" | "Tue" | ...)',
          'Type guard value is Weekday: Object.values(SomeEnum).includes(value) — безопасная проверка принадлежности'
        ]},
        { type: 'tip', value: 'Для строкового enum итерацию можно упростить: Object.values(UserStatus) вернёт ["active", "inactive", "banned", "pending"] — без лишних числовых ключей.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: система прав доступа с Enum',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему прав доступа (RBAC) с помощью enum и битовых масок.',
      requirements: [
        'const enum Permission { Read = 1, Write = 2, Delete = 4, Admin = 8 }',
        'type Role = "viewer" | "editor" | "admin"',
        'const ROLE_PERMISSIONS: Record<Role, number> — битовые маски прав',
        'function hasPermission(role: Role, permission: Permission): boolean',
        'Проверить: viewer может Read, editor может Read+Write, admin может всё'
      ],
      expectedOutput: 'viewer может читать: true\nviewer может писать: false\neditor может писать: true\neditor может удалять: false\nadmin может всё: true',
      hint: 'hasPermission использует побитовое И: (ROLE_PERMISSIONS[role] & permission) !== 0',
      solution: 'const enum Permission {\n    Read   = 1,\n    Write  = 2,\n    Delete = 4,\n    Admin  = 8\n}\n\ntype Role = "viewer" | "editor" | "admin";\n\nconst ROLE_PERMISSIONS: Record<Role, number> = {\n    viewer: Permission.Read,\n    editor: Permission.Read | Permission.Write,\n    admin:  Permission.Read | Permission.Write | Permission.Delete | Permission.Admin\n};\n\nfunction hasPermission(role: Role, permission: Permission): boolean {\n    return (ROLE_PERMISSIONS[role] & permission) !== 0;\n}\n\nconsole.log("viewer может читать:", hasPermission("viewer", Permission.Read));\nconsole.log("viewer может писать:", hasPermission("viewer", Permission.Write));\nconsole.log("editor может писать:", hasPermission("editor", Permission.Write));\nconsole.log("editor может удалять:", hasPermission("editor", Permission.Delete));\nconsole.log("admin может всё:", hasPermission("admin", Permission.Admin));',
      explanation: 'Битовые маски: каждое право — степень двойки. Побитовое ИЛИ объединяет права, побитовое И проверяет наличие. const enum инлайнится — ноль оверхеда в рантайме.'
    }
  ]
}
