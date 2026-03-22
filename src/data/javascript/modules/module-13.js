export default {
  id: 13,
  title: 'Spread и Rest',
  description: 'Оператор ... в двух ролях: spread разворачивает итерируемые объекты, rest собирает аргументы. Клонирование, слияние, вариадические функции.',
  lessons: [
    {
      id: 1,
      title: 'Spread оператор для массивов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spread оператор (...) "разворачивает" массив или итерируемый объект на отдельные элементы. Это позволяет удобно копировать, объединять массивы и передавать элементы как аргументы.' },
        { type: 'code', language: 'javascript', value: 'const a = [1, 2, 3];\nconst b = [4, 5, 6];\n\n// Объединение массивов\nconst combined = [...a, ...b];\nconsole.log(combined); // [1, 2, 3, 4, 5, 6]\n\n// Добавление элементов в начало / конец\nconst withFirst = [0, ...a];\nconst withLast  = [...a, 4];\nconst withBoth  = [0, ...a, 4, ...b];\n\n// Клонирование массива (поверхностное!)\nconst copy = [...a];\ncopy.push(99);\nconsole.log(a);    // [1, 2, 3] — оригинал не изменился\nconsole.log(copy); // [1, 2, 3, 99]\n\n// Spread в вызове функции\nconst numbers = [3, 1, 4, 1, 5, 9, 2];\nconsole.log(Math.max(...numbers)); // 9 (вместо Math.max(3,1,4,1,5,9,2))' },
        { type: 'heading', value: 'Spread со строками и Set' },
        { type: 'code', language: 'javascript', value: '// Строка -> массив символов\nconst chars = [..."hello"];\nconsole.log(chars); // ["h", "e", "l", "l", "o"]\n\n// Уникальные элементы (Set -> массив)\nconst nums = [1, 2, 2, 3, 3, 3, 4];\nconst unique = [...new Set(nums)];\nconsole.log(unique); // [1, 2, 3, 4]\n\n// NodeList (DOM) -> массив\n// const divs = [...document.querySelectorAll("div")];\n\n// Map -> массив пар\nconst map = new Map([["a", 1], ["b", 2]]);\nconsole.log([...map]); // [["a", 1], ["b", 2]]' },
        { type: 'tip', value: 'Spread создаёт поверхностную копию. Для вложенных объектов/массивов нужно глубокое копирование: JSON.parse(JSON.stringify(obj)) или structuredClone(obj) (ES2022).' }
      ]
    },
    {
      id: 2,
      title: 'Spread оператор для объектов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spread для объектов (ES2018) разворачивает свойства объекта в новый объект. Удобен для клонирования, слияния и обновления объектов без мутации.' },
        { type: 'code', language: 'javascript', value: 'const defaults = { theme: "light", lang: "ru", fontSize: 14 };\nconst userPrefs = { theme: "dark", fontSize: 16 };\n\n// Слияние с переопределением (последний побеждает!)\nconst config = { ...defaults, ...userPrefs };\nconsole.log(config);\n// { theme: "dark", lang: "ru", fontSize: 16 }\n\n// Клонирование объекта\nconst original = { a: 1, b: 2 };\nconst clone = { ...original };\nclone.a = 99;\nconsole.log(original.a); // 1 (не изменился)\n\n// Добавление / изменение свойств\nconst user = { name: "Алия", age: 25 };\nconst updatedUser = { ...user, age: 26, city: "Алматы" };\nconsole.log(updatedUser);\n// { name: "Алия", age: 26, city: "Алматы" }' },
        { type: 'heading', value: 'Порядок важен!' },
        { type: 'code', language: 'javascript', value: 'const base = { color: "red", size: "M", brand: "Nike" };\n\n// Переопределяем ПОСЛЕ — новое значение побеждает\nconst v1 = { ...base, color: "blue" };\nconsole.log(v1.color); // "blue"\n\n// Переопределяем ДО — базовое значение побеждает\nconst v2 = { color: "blue", ...base };\nconsole.log(v2.color); // "red" (base перезаписал!)\n\n// Практика: обновление состояния в Redux (иммутабельность)\nconst state = { user: "Алия", count: 5, loading: false };\n\nfunction reducer(state, action) {\n  switch (action.type) {\n    case "INCREMENT":\n      return { ...state, count: state.count + 1 };\n    case "SET_LOADING":\n      return { ...state, loading: action.payload };\n    default:\n      return state;\n  }\n}' },
        { type: 'note', value: 'Spread объектов — поверхностное копирование. { ...user } скопирует ссылки на вложенные объекты/массивы. Для вложенных структур используй { ...user, address: { ...user.address, city: "Алматы" } }.' }
      ]
    },
    {
      id: 3,
      title: 'Rest параметры в функциях',
      type: 'theory',
      content: [
        { type: 'text', value: 'Rest параметр (...args) собирает оставшиеся аргументы функции в массив. Позволяет создавать вариадические функции (принимающие любое количество аргументов).' },
        { type: 'code', language: 'javascript', value: '// Rest собирает ВСЕ аргументы\nfunction sum(...numbers) {\n  return numbers.reduce((acc, n) => acc + n, 0);\n}\n\nconsole.log(sum(1, 2, 3));          // 6\nconsole.log(sum(1, 2, 3, 4, 5));    // 15\nconsole.log(sum());                 // 0\n\n// Rest с обычными параметрами (rest ДОЛЖЕН быть последним!)\nfunction log(level, ...messages) {\n  console.log(`[${level}]`, ...messages);\n}\n\nlog("INFO", "Сервер запущен");          // [INFO] Сервер запущен\nlog("ERROR", "Ошибка", "код:", 404);   // [ERROR] Ошибка код: 404\n\n// НЕЛЬЗЯ: rest не последний\n// function bad(...args, last) {} // SyntaxError!' },
        { type: 'heading', value: 'Rest vs arguments' },
        { type: 'code', language: 'javascript', value: '// Старый способ: объект arguments (псевдомассив)\nfunction oldSum() {\n  // arguments — не настоящий массив!\n  // arguments.reduce не существует\n  return Array.from(arguments).reduce((a, b) => a + b, 0);\n}\n\n// Новый способ: rest — настоящий массив!\nfunction newSum(...args) {\n  return args.reduce((a, b) => a + b, 0);\n  // args.map, args.filter, args.slice — всё работает!\n}\n\n// arguments НЕ работает в стрелочных функциях:\nconst arrow = () => {\n  // console.log(arguments); // ReferenceError!\n  // Используй rest:\n};\n\nconst arrowWithRest = (...args) => args.length;\nconsole.log(arrowWithRest(1, 2, 3)); // 3' },
        { type: 'tip', value: 'Всегда используй rest вместо arguments. Rest — настоящий массив с полным набором методов. arguments — устаревший псевдомассив, не работает в стрелочных функциях.' }
      ]
    },
    {
      id: 4,
      title: 'Rest в деструктуризации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Rest в деструктуризации собирает "оставшиеся" элементы массива или свойства объекта. Это другое применение того же оператора ...' },
        { type: 'code', language: 'javascript', value: '// Rest в деструктуризации массива\nconst [first, second, ...rest] = [1, 2, 3, 4, 5];\nconsole.log(first);  // 1\nconsole.log(second); // 2\nconsole.log(rest);   // [3, 4, 5]\n\n// Rest в деструктуризации объекта\nconst { name, age, ...otherProps } = {\n  name: "Алия",\n  age: 25,\n  city: "Алматы",\n  role: "admin"\n};\nconsole.log(name, age);  // Алия 25\nconsole.log(otherProps); // { city: "Алматы", role: "admin" }\n\n// Практика: "убрать" свойство из объекта\nfunction removeId({ id, ...data }) {\n  return data; // объект без id\n}\n\nconst userWithId = { id: 42, name: "Берик", age: 30 };\nconsole.log(removeId(userWithId));\n// { name: "Берик", age: 30 }' },
        { type: 'note', value: 'Rest в деструктуризации — элегантный способ "исключить" свойства. Паттерн const { toRemove, ...clean } = obj; создаёт объект без свойства toRemove. Без мутации!' }
      ]
    },
    {
      id: 5,
      title: 'Практические паттерны spread/rest',
      type: 'theory',
      content: [
        { type: 'text', value: 'Spread и rest — строительные блоки многих современных паттернов JavaScript. Разберём самые важные.' },
        { type: 'code', language: 'javascript', value: '// 1. Функция с опциями (options pattern)\nfunction request(url, { method = "GET", headers = {}, body = null } = {}) {\n  console.log(`${method} ${url}`, headers, body);\n}\n\nrequest("/api/users");\nrequest("/api/create", { method: "POST", body: { name: "Алия" } });\n\n// 2. Мерж с глубокими значениями\nfunction deepMerge(target, source) {\n  return {\n    ...target,\n    ...source,\n    // Если оба — объекты, рекурсивно мержим\n    ...Object.fromEntries(\n      Object.entries(source).map(([k, v]) => [\n        k,\n        v && typeof v === "object" && !Array.isArray(v)\n          ? deepMerge(target[k] || {}, v)\n          : v\n      ])\n    )\n  };\n}' },
        { type: 'code', language: 'javascript', value: '// 3. Pipe — композиция функций\nconst pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);\n\nconst process = pipe(\n  x => x * 2,\n  x => x + 10,\n  x => x.toString()\n);\nconsole.log(process(5)); // "20"\n\n// 4. Partial application\nfunction partial(fn, ...presetArgs) {\n  return (...laterArgs) => fn(...presetArgs, ...laterArgs);\n}\n\nconst multiply = (a, b) => a * b;\nconst double = partial(multiply, 2);\nconst triple = partial(multiply, 3);\n\nconsole.log(double(5)); // 10\nconsole.log(triple(5)); // 15' },
        { type: 'tip', value: 'Паттерн pipe (конвейер функций) — мощный инструмент функционального программирования. С rest + spread он реализуется в одну строку: const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: утилиты с spread/rest',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй набор утилит используя spread и rest операторы.',
      requirements: [
        'flatten(arr) — "сплющить" массив массивов в один массив используя spread',
        'omit(obj, ...keys) — вернуть объект без указанных ключей',
        'pick(obj, ...keys) — вернуть объект только с указанными ключами',
        'mergeDefaults(defaults, ...overrides) — слить defaults с переопределениями'
      ],
      hint: 'Для flatten: [].concat(...arr) или arr.reduce((acc, item) => [...acc, ...item], []). Для omit: деструктуризация с rest или Object.fromEntries + filter.',
      solution: 'function flatten(arr) {\n  return arr.reduce((acc, item) => [...acc, ...item], []);\n}\n\nfunction omit(obj, ...keys) {\n  return Object.fromEntries(\n    Object.entries(obj).filter(([k]) => !keys.includes(k))\n  );\n}\n\nfunction pick(obj, ...keys) {\n  return Object.fromEntries(\n    keys.filter(k => k in obj).map(k => [k, obj[k]])\n  );\n}\n\nfunction mergeDefaults(defaults, ...overrides) {\n  return Object.assign({}, defaults, ...overrides);\n  // или: return [defaults, ...overrides].reduce((acc, o) => ({ ...acc, ...o }), {});\n}\n\n// Тесты\nconsole.log(flatten([[1,2], [3,4], [5]])); // [1, 2, 3, 4, 5]\n\nconst user = { id: 1, name: "Алия", age: 25, password: "secret" };\nconsole.log(omit(user, "password", "age"));\n// { id: 1, name: "Алия" }\n\nconsole.log(pick(user, "name", "age"));\n// { name: "Алия", age: 25 }\n\nconsole.log(mergeDefaults(\n  { theme: "light", lang: "en" },\n  { lang: "ru" },\n  { theme: "dark" }\n));\n// { theme: "dark", lang: "ru" }',
      explanation: 'flatten использует spread для разворачивания каждого подмассива. omit и pick работают через Object.entries + filter/map + Object.fromEntries. mergeDefaults применяет spread в Object.assign — последнее переопределяет предыдущее.'
    }
  ]
}
