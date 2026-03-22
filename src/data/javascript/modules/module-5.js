export default {
  id: 5,
  title: 'Условные операторы',
  description: 'if/else, switch/case, Guard clauses и паттерны условной логики',
  lessons: [
    {
      id: 1,
      title: 'if/else: основы',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'if/else — базовая конструкция ветвления. JavaScript использует "truthy/falsy" для условий, что иногда приводит к сюрпризам.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Базовый if/else\nconst score = 85;\nif (score >= 90) {\n  console.log("Отлично");\n} else if (score >= 70) {\n  console.log("Хорошо");\n} else if (score >= 50) {\n  console.log("Удовлетворительно");\n} else {\n  console.log("Неудовлетворительно");\n}\n\n// Truthy/Falsy условия\nconst users = [];\nif (users) {\n  // Выполнится! Пустой массив — truthy!\n  console.log("users определён:", users.length);\n}\n\n// Правильная проверка пустоты массива\nif (users.length > 0) {\n  console.log("Есть пользователи");\n} else {\n  console.log("Нет пользователей"); // Выполнится\n}\n\n// Проверка на существование\nconst user = null;\nif (user) {\n  // НЕ выполнится (null — falsy)\n  console.log(user.name);\n}\n\n// Короткие if без фигурных скобок (для однострочных)\nif (score > 50) console.log("Сдал!");\n// else console.log("Не сдал!"); // можно, но не рекомендуется'
        },
        {
          type: 'tip',
          value: 'Всегда используйте фигурные скобки {} для тела if/else, даже для однострочных блоков. Это предотвращает ошибки при добавлении новых строк.'
        }
      ]
    },
    {
      id: 2,
      title: 'Guard clauses и ранний возврат',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Guard clause — проверка условия "на выход" в начале функции. Это упрощает код, избегая глубокой вложенности if/else.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Плохо: глубокая вложенность (pyramid of doom)\nfunction processOrder_bad(user, order) {\n  if (user) {\n    if (user.isVerified) {\n      if (order) {\n        if (order.items.length > 0) {\n          // Логика обработки\n          return "Заказ обработан";\n        } else {\n          return "Нет товаров";\n        }\n      } else {\n        return "Нет заказа";\n      }\n    } else {\n      return "Пользователь не верифицирован";\n    }\n  } else {\n    return "Нет пользователя";\n  }\n}\n\n// Хорошо: guard clauses\nfunction processOrder(user, order) {\n  if (!user) return "Нет пользователя";\n  if (!user.isVerified) return "Пользователь не верифицирован";\n  if (!order) return "Нет заказа";\n  if (order.items.length === 0) return "Нет товаров";\n\n  // Основная логика — без вложенности!\n  return "Заказ обработан";\n}\n\nconsole.log(processOrder(null, null));\nconsole.log(processOrder({ isVerified: true }, { items: [1,2] }));\n\n// Guard clauses для валидации\nfunction createUser(name, age, email) {\n  if (!name || name.trim() === "") throw new Error("Имя обязательно");\n  if (typeof age !== "number" || age < 0 || age > 150) throw new Error("Некорректный возраст");\n  if (!email.includes("@")) throw new Error("Некорректный email");\n\n  return { id: Date.now(), name: name.trim(), age, email };\n}'
        },
        {
          type: 'note',
          value: 'Guard clauses — это принцип "fail fast" (быстрый отказ). Проверяй невалидные условия первыми и выходи из функции. Это уменьшает вложенность и делает код линейным.'
        }
      ]
    },
    {
      id: 3,
      title: 'switch/case',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'switch/case используется для множественного ветвления по значению. Использует строгое сравнение ===.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Базовый switch\nconst day = "Monday";\nswitch (day) {\n  case "Monday":\n  case "Tuesday":\n  case "Wednesday":\n  case "Thursday":\n  case "Friday":\n    console.log("Рабочий день");\n    break; // ВАЖНО! Без break — провал (fall-through)\n  case "Saturday":\n  case "Sunday":\n    console.log("Выходной");\n    break;\n  default:\n    console.log("Неизвестный день");\n}\n\n// Fall-through (намеренный провал)\nconst grade = "B";\nswitch (grade) {\n  case "A":\n    console.log("Отлично!");\n    break;\n  case "B":\n    // fall-through намеренно\n  case "C":\n    console.log("Хорошо");\n    break;\n  default:\n    console.log("Нужно подтянуться");\n}\n\n// switch с return (в функции break не нужен)\nfunction getDayType(day) {\n  switch (day.toLowerCase()) {\n    case "saturday":\n    case "sunday":\n      return "weekend";\n    default:\n      return "weekday";\n  }\n}'
        },
        {
          type: 'heading',
          value: 'Альтернативы switch'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Объект-маппинг (часто лучше switch)\nconst dayType = {\n  monday: "weekday",\n  tuesday: "weekday",\n  wednesday: "weekday",\n  thursday: "weekday",\n  friday: "weekday",\n  saturday: "weekend",\n  sunday: "weekend"\n};\n\nconst getType = (day) => dayType[day.toLowerCase()] ?? "unknown";\nconsole.log(getType("Monday")); // "weekday"\n\n// Map для сложных случаев\nconst handlers = new Map([\n  ["click", (e) => console.log("clicked", e)],\n  ["hover", (e) => console.log("hovered", e)],\n  ["submit", (e) => console.log("submitted", e)]\n]);\nconst handle = (event, e) => handlers.get(event)?.(e);'
        },
        {
          type: 'tip',
          value: 'Объект-маппинг обычно предпочтительнее switch: короче, без риска забыть break, легче расширять.'
        }
      ]
    },
    {
      id: 4,
      title: 'Паттерны условной логики',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Продвинутые паттерны для написания чистой условной логики в JavaScript.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Таблица решений\nconst rules = [\n  { condition: (score) => score >= 90, result: "A" },\n  { condition: (score) => score >= 80, result: "B" },\n  { condition: (score) => score >= 70, result: "C" },\n  { condition: (score) => score >= 60, result: "D" },\n  { condition: () => true, result: "F" } // default\n];\n\nconst getGrade = (score) =>\n  rules.find(rule => rule.condition(score))?.result ?? "F";\n\nconsole.log(getGrade(95)); // "A"\nconsole.log(getGrade(72)); // "C"\nconsole.log(getGrade(45)); // "F"\n\n// Polymorphism через объект\nconst shapes = {\n  circle: (r) => Math.PI * r ** 2,\n  square: (s) => s ** 2,\n  rectangle: (w, h) => w * h,\n  triangle: (b, h) => 0.5 * b * h\n};\n\nconst area = (type, ...args) => shapes[type]?.(...args) ?? 0;\nconsole.log(area("circle", 5));      // 78.54\nconsole.log(area("rectangle", 4, 6)); // 24\n\n// Условное присваивание\nconst config = {};\nif (process.env?.NODE_ENV === "production") {\n  config.debug = false;\n  config.logLevel = "error";\n} else {\n  config.debug = true;\n  config.logLevel = "debug";\n}\n\n// Более кратко через объект\nconst envConfig = {\n  production: { debug: false, logLevel: "error" },\n  development: { debug: true, logLevel: "debug" }\n};\nconst finalConfig = envConfig[process.env?.NODE_ENV ?? "development"] ?? envConfig.development;'
        },
        {
          type: 'tip',
          value: 'Паттерн "таблица правил" (rules table) — мощная альтернатива длинным if/else цепочкам. Легко расширять новыми правилами без изменения основной логики.'
        }
      ]
    },
    {
      id: 5,
      title: 'Условия с массивами и объектами',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Проверки для массивов и объектов требуют особого внимания из-за их ссылочной природы.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Проверки массивов\nconst arr = [1, 2, 3];\nif (Array.isArray(arr)) console.log("массив");\nif (arr.length > 0) console.log("не пустой");\nif (arr.includes(2)) console.log("содержит 2");\nif (arr.some(x => x > 2)) console.log("есть > 2");\nif (arr.every(x => x > 0)) console.log("все > 0");\n\n// Проверки объектов\nconst obj = { a: 1, b: 2 };\nif (obj !== null && typeof obj === "object") console.log("объект");\nif ("a" in obj) console.log("есть ключ a");\nif (Object.keys(obj).length > 0) console.log("не пустой");\nif (Object.hasOwn(obj, "a")) console.log("собственное свойство a"); // ES2022\n\n// Деструктуризация с условиями\nconst { name, age, role = "user" } = { name: "Alice", age: 30 };\nconsole.log(name, age, role); // "Alice" 30 "user"\n\n// Условная деструктуризация\nfunction processUser({ name, role = "user", permissions = [] } = {}) {\n  if (!name) return null;\n  return { displayName: name.toUpperCase(), role, count: permissions.length };\n}\n\nconsole.log(processUser({ name: "Bob" }));\nconsole.log(processUser()); // {} по умолчанию — не ошибка'
        },
        { type: 'list', items: [
          'Array.isArray(x) — единственно надёжный способ проверить массив (typeof возвращает "object")',
          'typeof null === "object" — классический баг JS; всегда проверяй x !== null',
          'Object.hasOwn(obj, key) — современная альтернатива obj.hasOwnProperty(key) (ES2022)',
          'Деструктуризация с = {} по умолчанию — безопасный вызов функции без аргументов',
          'arr.some() останавливается при первом совпадении, arr.every() — при первом несовпадении'
        ]},
        { type: 'tip', value: 'Для проверки "массив не пустой" используй arr.length > 0, не Boolean(arr) — пустой массив [] является truthy! Для объектов: Object.keys(obj).length > 0 или использование опционального чейнинга obj?.prop.' }
      ]
    },
    {
      id: 6,
      title: 'if/else и guard clauses: практика',
      type: 'practice',
      difficulty: 'medium',
      description: 'Применяйте guard clauses для рефакторинга вложенных условий.',
      requirements: [
        'Реализуйте функцию validatePassword(password) используя guard clauses:\n  - Минимум 8 символов\n  - Должна содержать заглавную букву\n  - Должна содержать цифру\n  - Должна содержать спецсимвол (!@#$%^&*)\n  - Возвращает {valid: true} или {valid: false, error: "..."}'
      ],
      expectedOutput: 'validatePassword("abc") -> {valid:false, error:"Минимум 8 символов"}\nvalidatePassword("abcdefgh") -> {valid:false, error:"Нужна заглавная буква"}\nvalidatePassword("Abcdefgh") -> {valid:false, error:"Нужна цифра"}\nvalidatePassword("Abcdefg1") -> {valid:false, error:"Нужен спецсимвол"}\nvalidatePassword("Abcdefg1!") -> {valid:true}',
      hint: 'Используйте guard clauses: if (!condition) return {valid: false, error: "..."};\n/[A-Z]/.test(password) для заглавной\n/[0-9]/.test(password) для цифры\n/[!@#$%^&*]/.test(password) для спецсимвола',
      solution: 'function validatePassword(password) {\n  if (typeof password !== "string") {\n    return { valid: false, error: "Пароль должен быть строкой" };\n  }\n  if (password.length < 8) {\n    return { valid: false, error: "Минимум 8 символов" };\n  }\n  if (!/[A-Z]/.test(password)) {\n    return { valid: false, error: "Нужна заглавная буква" };\n  }\n  if (!/[0-9]/.test(password)) {\n    return { valid: false, error: "Нужна цифра" };\n  }\n  if (!/[!@#$%^&*]/.test(password)) {\n    return { valid: false, error: "Нужен спецсимвол (!@#$%^&*)" };\n  }\n  return { valid: true };\n}\n\n// Тесты\nconst passwords = ["abc", "abcdefgh", "Abcdefgh", "Abcdefg1", "Abcdefg1!", "P@ssw0rd"];\nfor (const pwd of passwords) {\n  const result = validatePassword(pwd);\n  if (result.valid) {\n    console.log(`"${pwd}": ОК`);\n  } else {\n    console.log(`"${pwd}": ${result.error}`);\n  }\n}\n\n// Расширенная версия с несколькими ошибками\nfunction validatePasswordStrict(password) {\n  const errors = [];\n  if (typeof password !== "string" || password.length < 8) {\n    errors.push("Минимум 8 символов");\n  }\n  if (!/[A-Z]/.test(password)) errors.push("Нужна заглавная буква");\n  if (!/[a-z]/.test(password)) errors.push("Нужна строчная буква");\n  if (!/[0-9]/.test(password)) errors.push("Нужна цифра");\n  if (!/[!@#$%^&*]/.test(password)) errors.push("Нужен спецсимвол");\n  return { valid: errors.length === 0, errors };\n}\nconsole.log(validatePasswordStrict("abc"));',
      explanation: 'Guard clauses делают валидационный код линейным вместо вложенного. Каждая проверка — отдельная ответственность. Регулярные выражения /pattern/.test(str) удобны для символьных проверок. Версия с массивом ошибок (errors[]) более удобна для UX — пользователь видит все проблемы сразу, а не по одной.'
    },
    {
      id: 7,
      title: 'switch и объекты-маппинги: практика',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему обработки команд используя разные подходы.',
      requirements: [
        'Реализуйте функцию processCommand(command, data) используя объект-маппинг:\n  - "create" -> создаёт объект {id: Date.now(), ...data}\n  - "delete" -> возвращает null\n  - "update" -> обновляет объект {...existingData, ...data}\n  - "get" -> возвращает data как есть\n  - неизвестная команда -> выбрасывает ошибку',
        'Реализуйте функцию formatDate(date, format) где format: "short", "long", "iso"',
        'formatDate(new Date("2024-01-15"), "short") -> "15.01.2024"\nformatDate(new Date("2024-01-15"), "long") -> "15 января 2024"\nformatDate(new Date("2024-01-15"), "iso") -> "2024-01-15"'
      ],
      expectedOutput: 'processCommand("create", {name:"Alice"}) -> {id:..., name:"Alice"}\nprocessCommand("delete", {id:1}) -> null\nformatDate(new Date("2024-01-15"), "short") -> "15.01.2024"\nformatDate(new Date("2024-01-15"), "iso") -> "2024-01-15"',
      hint: 'const commands = { create: ..., delete: ..., update: ..., get: ... };\nif (!commands[command]) throw new Error(...);\nreturn commands[command](data);\nformatDate short: date.toLocaleDateString("ru-RU")\nformatDate long: date.toLocaleDateString("ru-RU", {day:"numeric",month:"long",year:"numeric"})',
      solution: 'function processCommand(command, data = {}, existingData = {}) {\n  const commands = {\n    create: (d) => ({ id: Date.now(), ...d, createdAt: new Date().toISOString() }),\n    delete: () => null,\n    update: (d) => ({ ...existingData, ...d, updatedAt: new Date().toISOString() }),\n    get: (d) => d ?? existingData\n  };\n\n  if (!commands[command]) {\n    throw new Error(`Неизвестная команда: ${command}. Доступные: ${Object.keys(commands).join(", ")}`);\n  }\n\n  return commands[command](data);\n}\n\nfunction formatDate(date, format = "short") {\n  const MONTHS = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];\n\n  const formatters = {\n    short: () => date.toLocaleDateString("ru-RU"),\n    long: () => {\n      const d = date.getDate();\n      const m = MONTHS[date.getMonth()];\n      const y = date.getFullYear();\n      return `${d} ${m} ${y}`;\n    },\n    iso: () => date.toISOString().split("T")[0]\n  };\n\n  return formatters[format]?.() ?? formatters.short();\n}\n\n// Тесты processCommand\nconsole.log(processCommand("create", { name: "Alice", age: 30 }));\nconsole.log(processCommand("delete", { id: 1 }));\nconsole.log(processCommand("update", { age: 31 }, { id: 1, name: "Alice", age: 30 }));\nconsole.log(processCommand("get", null, { id: 1, name: "Bob" }));\ntry {\n  processCommand("unknown", {});\n} catch (e) {\n  console.log("Ошибка:", e.message);\n}\n\n// Тесты formatDate\nconst d = new Date("2024-01-15");\nconsole.log(formatDate(d, "short")); // "15.01.2024"\nconsole.log(formatDate(d, "long"));  // "15 января 2024"\nconsole.log(formatDate(d, "iso"));   // "2024-01-15"',
      explanation: 'Объект-маппинг команд — паттерн Command Object. Более гибкий чем switch: легко добавить новые команды, можно передавать объект как зависимость (dependency injection). formatDate с объектом форматтеров позволяет легко добавлять новые форматы. toLocaleDateString с locale "ru-RU" использует системную локализацию. toISOString().split("T")[0] даёт формат YYYY-MM-DD без времени.'
    }
  ]
};
