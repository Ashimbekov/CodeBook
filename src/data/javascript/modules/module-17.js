export default {
  id: 17,
  title: 'Модули (import/export)',
  description: 'ES6 модульная система: named и default экспорты, импорты, переименование, реэкспорт, динамический import() и отличия от CommonJS.',
  lessons: [
    {
      id: 1,
      title: 'Named exports и imports',
      type: 'theory',
      content: [
        { type: 'text', value: 'ES6 модули — стандарт JavaScript для разделения кода на файлы. Named export позволяет экспортировать несколько именованных значений из одного файла.' },
        { type: 'code', language: 'javascript', value: '// === math.js ===\n// Способ 1: export при объявлении\nexport const PI = 3.14159;\nexport function add(a, b) { return a + b; }\nexport function multiply(a, b) { return a * b; }\nexport class Vector {\n  constructor(x, y) { this.x = x; this.y = y; }\n}\n\n// Способ 2: export в конце файла\nconst subtract = (a, b) => a - b;\nconst divide   = (a, b) => a / b;\nexport { subtract, divide };\n\n// Экспорт с переименованием\nconst _internal = (a) => a * 2;\nexport { _internal as double };\n\n// === main.js ===\n// Именованный импорт\nimport { add, multiply, PI } from "./math.js";\nconsole.log(add(2, 3));      // 5\nconsole.log(multiply(2, 3)); // 6\nconsole.log(PI);             // 3.14159\n\n// Импорт с переименованием\nimport { subtract as sub, double } from "./math.js";\nconsole.log(sub(10, 4)); // 6\nconsole.log(double(5));  // 10\n\n// Импорт всего в пространство имён\nimport * as MathUtils from "./math.js";\nconsole.log(MathUtils.add(1, 2));   // 3\nconsole.log(MathUtils.PI);          // 3.14159' },
        { type: 'tip', value: 'Named импорты статически анализируются — bundler (Webpack, Vite) знает, что именно импортируется, и может удалить неиспользуемые экспорты (tree shaking).' }
      ]
    },
    {
      id: 2,
      title: 'Default export и import',
      type: 'theory',
      content: [
        { type: 'text', value: 'Default export — один главный экспорт файла. При импорте можно использовать любое имя. Каждый файл может иметь только один default export.' },
        { type: 'code', language: 'javascript', value: '// === UserService.js ===\nclass UserService {\n  constructor() { this.users = []; }\n  add(user) { this.users.push(user); }\n  getAll() { return [...this.users]; }\n  findById(id) { return this.users.find(u => u.id === id); }\n}\n\nexport default UserService;\n// или сразу: export default class UserService {...}\n\n// === main.js ===\n// Имя можно выбрать любое!\nimport UserService from "./UserService.js";\nimport Service     from "./UserService.js"; // тоже работает\nimport US          from "./UserService.js"; // тоже работает\n\nconst service = new UserService();\nservice.add({ id: 1, name: "Алия" });\nconsole.log(service.getAll());' },
        { type: 'code', language: 'javascript', value: '// Смешанный экспорт: default + named\n// === api.js ===\nexport const BASE_URL = "https://api.example.com";\nexport const VERSION  = "v2";\n\nexport function buildUrl(path) {\n  return `${BASE_URL}/${VERSION}/${path}`;\n}\n\nexport default class Api {\n  async get(path) {\n    const url = buildUrl(path);\n    const res = await fetch(url);\n    return res.json();\n  }\n}\n\n// === app.js ===\nimport Api, { BASE_URL, buildUrl } from "./api.js";\n// default + named в одном импорте!\n\nconst api = new Api();\nconsole.log(BASE_URL);\nconsole.log(buildUrl("users")); // https://api.example.com/v2/users' },
        { type: 'note', value: 'Соглашение: default export для "главного" объекта файла (класс, компонент, функция), named exports для вспомогательных (константы, типы, утилиты).' }
      ]
    },
    {
      id: 3,
      title: 'Реэкспорт и barrel files',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реэкспорт позволяет перенаправлять экспорты из других модулей. Barrel файлы (index.js) собирают экспорты из многих файлов в одном месте для удобного импорта.' },
        { type: 'code', language: 'javascript', value: '// === utils/string.js ===\nexport function capitalize(s) { return s[0].toUpperCase() + s.slice(1); }\nexport function truncate(s, n) { return s.length > n ? s.slice(0,n)+"..." : s; }\n\n// === utils/array.js ===\nexport function unique(arr) { return [...new Set(arr)]; }\nexport function flatten(arr) { return arr.flat(); }\n\n// === utils/index.js (barrel file) ===\n// Реэкспорт всего из подмодулей\nexport { capitalize, truncate } from "./string.js";\nexport { unique, flatten }     from "./array.js";\n\n// Реэкспорт всего с *\nexport * from "./string.js";\nexport * from "./array.js";\n\n// Реэкспорт default как named\nexport { default as UserService } from "./UserService.js";\n\n// === app.js ===\n// Вместо трёх импортов — один!\nimport { capitalize, truncate, unique, flatten } from "./utils/index.js";\n// или просто:\nimport { capitalize, unique } from "./utils";' },
        { type: 'tip', value: 'Barrel файлы (index.js/index.ts) — популярный паттерн в больших проектах. Позволяет импортировать из папки: import { Button, Modal } from "./components" вместо длинных путей.' }
      ]
    },
    {
      id: 4,
      title: 'Динамический import()',
      type: 'theory',
      content: [
        { type: 'text', value: 'Динамический import() — функция (не ключевое слово), возвращает Promise. Позволяет загружать модули по требованию: ленивая загрузка, условный импорт.' },
        { type: 'code', language: 'javascript', value: '// Статический import — загружается СРАЗУ при старте\nimport { heavyModule } from "./heavy.js"; // всегда загружается\n\n// Динамический import() — загружается когда нужно\nasync function loadHeavyFeature() {\n  const module = await import("./heavy.js");\n  module.doSomething();\n}\n\n// Деструктуризация при динамическом импорте\nasync function initChart() {\n  const { Chart, registerables } = await import("chart.js");\n  Chart.register(...registerables);\n  return new Chart(/* ... */);\n}\n\n// Условный импорт\nasync function loadPolyfill() {\n  if (!window.fetch) {\n    await import("whatwg-fetch"); // грузим polyfill только если нужен\n  }\n}\n\n// Динамические пути\nasync function loadLocale(lang) {\n  const { messages } = await import(`./locales/${lang}.js`);\n  return messages;\n}\n\nconst ruMessages = await loadLocale("ru");\nconst enMessages = await loadLocale("en");' },
        { type: 'code', language: 'javascript', value: '// Lazy loading в React (аналогичный паттерн)\n// React.lazy(() => import("./HeavyComponent"))\n\n// Параллельная загрузка нескольких модулей\nasync function initApp() {\n  const [utilsModule, apiModule, configModule] = await Promise.all([\n    import("./utils.js"),\n    import("./api.js"),\n    import("./config.js")\n  ]);\n\n  const { processData } = utilsModule;\n  const api = new apiModule.default();\n  const { config } = configModule;\n\n  console.log("Все модули загружены!");\n}' },
        { type: 'note', value: 'import() — мощный инструмент для оптимизации: code splitting позволяет разбить приложение на чанки (chunks). Vite и Webpack автоматически создают отдельные bundle для каждого динамического импорта.' }
      ]
    },
    {
      id: 5,
      title: 'ES Modules vs CommonJS',
      type: 'theory',
      content: [
        { type: 'text', value: 'CommonJS (require/module.exports) — система модулей Node.js до ES modules. ES Modules (import/export) — стандарт JavaScript. В Node.js используются оба, важно понимать различия.' },
        { type: 'code', language: 'javascript', value: '// === CommonJS (устаревший, но всё ещё широко используется) ===\n\n// Экспорт\nconst add = (a, b) => a + b;\nconst PI = 3.14;\nmodule.exports = { add, PI };      // объект\nmodule.exports.subtract = (a,b) => a - b; // добавить после\n\n// Импорт\nconst math = require("./math");     // синхронно!\nconst { add, PI } = require("./math");\nconst path = require("path");       // встроенные модули\n\n// === ES Modules ===\n// Экспорт\nexport const add = (a, b) => a + b;\nexport const PI = 3.14;\n\n// Импорт\nimport { add, PI } from "./math.js"; // асинхронно\nimport path from "node:path";        // встроенные через node:\n\n// Главные отличия:\n// 1. CJS: синхронный, ESM: асинхронный\n// 2. CJS: динамический (require в if), ESM: статический\n// 3. CJS: .js по умолчанию, ESM: .mjs или "type":"module" в package.json\n// 4. CJS: __dirname/__filename, ESM: import.meta.url\n// 5. CJS: circular deps, ESM: live bindings' },
        { type: 'code', language: 'javascript', value: '// __dirname аналог в ESM\nimport { fileURLToPath } from "url";\nimport { dirname }       from "path";\n\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname  = dirname(__filename);\n\n// import.meta — метаинформация о модуле\nconsole.log(import.meta.url);  // file:///path/to/module.js\nconsole.log(import.meta.env);  // в Vite: переменные окружения' },
        { type: 'tip', value: 'В package.json добавь "type": "module" чтобы .js файлы воспринимались как ESM. Или используй расширение .mjs для ESM и .cjs для CommonJS файлов явно.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: организация модульного кода',
      type: 'practice',
      difficulty: 'easy',
      description: 'Организуй код в модульную структуру с barrel файлом.',
      requirements: [
        'Опиши содержимое файла validators.js (3 named exports: validateEmail, validateAge, validateName)',
        'Опиши содержимое файла formatters.js (default export объект с методами и 2 named exports)',
        'Опиши barrel файл utils/index.js который реэкспортирует всё',
        'Покажи как импортировать из barrel файла и использовать динамический import()'
      ],
      hint: 'Barrel файл: export { validateEmail, validateAge } from "./validators.js"; export * from "./formatters.js".',
      solution: '// === validators.js ===\nexport function validateEmail(email) {\n  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);\n}\nexport function validateAge(age) {\n  return typeof age === "number" && age >= 0 && age <= 150;\n}\nexport function validateName(name) {\n  return typeof name === "string" && name.trim().length >= 2;\n}\n\n// === formatters.js ===\nexport const DATE_FORMAT = "YYYY-MM-DD";\nexport function formatDate(date) {\n  return date.toISOString().split("T")[0];\n}\nexport default {\n  currency(n, symbol = "₸") { return `${n.toLocaleString()} ${symbol}`; },\n  percent(n, digits = 1) { return `${n.toFixed(digits)}%`; },\n  name(first, last) { return `${last} ${first}`; }\n};\n\n// === utils/index.js (barrel) ===\nexport { validateEmail, validateAge, validateName } from "./validators.js";\nexport { DATE_FORMAT, formatDate } from "./formatters.js";\nexport { default as Formatters } from "./formatters.js";\n\n// === app.js ===\nimport { validateEmail, Formatters, formatDate } from "./utils/index.js";\n\nconsole.log(validateEmail("a@b.com")); // true\nconsole.log(Formatters.currency(1500)); // "1 500 ₸"\n\n// Динамический импорт\nasync function initAdmin() {\n  if (userRole === "admin") {\n    const { AdminPanel } = await import("./admin/panel.js");\n    new AdminPanel().init();\n  }\n}',
      explanation: 'Barrel файлы упрощают импорты в больших проектах. export { x } from "..." — реэкспорт без загрязнения пространства текущего модуля. export * from "..." — реэкспорт всех named экспортов. Динамический import() позволяет загружать код только когда он нужен.'
    }
  ]
}
