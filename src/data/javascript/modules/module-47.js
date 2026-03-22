export default {
  id: 47,
  title: 'Отладка JavaScript',
  description: 'Инструменты отладки: console методы, debugger, DevTools, source maps, breakpoints и профилирование производительности',
  lessons: [
    {
      id: 1,
      title: 'console — больше чем log',
      type: 'theory',
      content: [
        { type: 'text', value: 'console имеет много методов помимо log: warn, error, table, group, time, assert, count, trace. Правильное использование ускоряет отладку.' },
        { type: 'heading', value: 'Методы console' },
        { type: 'code', language: 'javascript', value: '// Уровни\nconsole.log("Обычное сообщение");     // Белый\nconsole.info("Информация");            // Синий\nconsole.warn("Предупреждение");        // Жёлтый\nconsole.error("Ошибка:", new Error()); // Красный\n\n// Структурированный вывод\nconst users = [\n  { id: 1, name: "Алия", role: "admin", age: 25 },\n  { id: 2, name: "Берик", role: "user", age: 30 }\n];\nconsole.table(users); // Красивая таблица!\n\n// Объекты\nconsole.log({ key: "value" });              // [object Object]\nconsole.dir({ key: "value" }, { depth: null }); // Развёрнутый объект\nconsole.log("%o", { key: "value" });        // Интерактивный объект в браузере\n\n// Группировка\nconsole.group("Пользователь #1");\nconsole.log("Имя:", users[0].name);\nconsole.log("Роль:", users[0].role);\nconsole.groupEnd();\n\nconsole.groupCollapsed("Свёрнутая группа"); // Свёрнутая по умолчанию\nconsole.log("Детали...");\nconsole.groupEnd();\n\n// Замер времени\nconsole.time("операция");\nconst result = heavyCalculation();\nconsole.timeEnd("операция"); // "операция: 123.456 ms"\nconsole.timeLog("операция"); // Промежуточное время без остановки\n\n// Счётчик\nconst click = () => console.count("клик"); // клик: 1, клик: 2...\nconsole.countReset("клик");\n\n// Утверждения (только при false)\nconsole.assert(1 === 2, "Утверждение не выполнено!"); // Показывает ошибку\nconsole.assert(1 === 1, "Не покажется");             // Ничего\n\n// Stack trace\nconsole.trace("Откуда вызвано?"); // Показывает стек вызовов' }
      ]
    },
    {
      id: 2,
      title: 'debugger и DevTools',
      type: 'theory',
      content: [
        { type: 'text', value: 'Оператор debugger останавливает выполнение и открывает DevTools. В Node.js — через node --inspect. Breakpoints позволяют остановиться в любом месте кода.' },
        { type: 'heading', value: 'debugger и брейкпоинты' },
        { type: 'code', language: 'javascript', value: '// debugger — останавливает выполнение в DevTools\nfunction processUser(user) {\n  debugger; // Выполнение остановится здесь, если DevTools открыт\n  const result = transformUser(user);\n  return result;\n}\n\n// В Node.js:\n// node --inspect src/index.js\n// Открыть chrome://inspect в Chrome\n// Или: node --inspect-brk src/index.js (остановить сразу при старте)\n\n// VS Code — launch.json конфигурация\n// {\n//   "version": "0.2.0",\n//   "configurations": [\n//     {\n//       "type": "node",\n//       "request": "launch",\n//       "name": "Debug",\n//       "skipFiles": ["<node_internals>/**"],\n//       "program": "${workspaceFolder}/src/index.js",\n//       "env": { "NODE_ENV": "development" }\n//     },\n//     {\n//       "type": "node",\n//       "request": "attach",\n//       "name": "Attach",\n//       "port": 9229  // node --inspect порт\n//     }\n//   ]\n// }\n\n// Типы breakpoints в DevTools:\n// Обычный — кликнуть на номер строки\n// Conditional — правой кнопкой -> "Add conditional breakpoint"\n// Logpoint — правой кнопкой -> "Add logpoint" (не останавливает, только логирует)\n// DOM breakpoint — при изменении DOM элемента\n// XHR breakpoint — при конкретном URL запросе\n// Exception breakpoint — при любом/непойманном исключении' },
        { type: 'tip', value: 'Используйте Logpoint вместо console.log + debugger. Logpoint выводит значение без изменения кода и без остановки выполнения. Добавляется в DevTools Sources правой кнопкой.' }
      ]
    },
    {
      id: 3,
      title: 'Source Maps',
      type: 'theory',
      content: [
        { type: 'text', value: 'Source maps связывают минифицированный/транспилированный код с оригинальным. Позволяют отлаживать TypeScript, JSX, Sass в браузере как будто это оригинальный код.' },
        { type: 'heading', value: 'Настройка Source Maps' },
        { type: 'code', language: 'javascript', value: '// TypeScript — tsconfig.json\n// {\n//   "compilerOptions": {\n//     "sourceMap": true,     // Генерировать .map файлы\n//     "inlineSourceMap": false, // Встроить в JS файл\n//     "declaration": true\n//   }\n// }\n\n// Webpack — webpack.config.js\nmodule.exports = {\n  devtool: "eval-source-map",    // Быстрый для development\n  // devtool: "source-map",      // Отдельный .map файл (production)\n  // devtool: "inline-source-map", // Встроен в bundle\n  // devtool: "cheap-module-source-map", // Строки без колонок\n  // devtool: false,             // Отключить\n};\n\n// Vite — автоматически в development\n// vite.config.js:\n// build: { sourcemap: true }\n\n// Node.js с TypeScript\n// npm install --save-dev source-map-support\nrequire("source-map-support").install();\n// Теперь stack traces показывают TS файлы, не JS\n\n// Или в tsconfig.json для ts-node:\n// "ts-node": { "transpileOnly": true }\n// node --require ts-node/register src/index.ts\n\n// Проверить source map в браузере:\n// DevTools -> Sources -> Page -> открыть минифицированный файл\n// Если source map работает — видите оригинальный код' }
      ]
    },
    {
      id: 4,
      title: 'Профилирование производительности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Performance API и DevTools Performance вкладка помогают найти узкие места. Performance.now() для точного замера, профайлер для анализа вызовов функций.' },
        { type: 'heading', value: 'Замер производительности' },
        { type: 'code', language: 'javascript', value: '// Performance.now() — точный таймер (высокое разрешение)\nconst t0 = performance.now();\nheavyOperation();\nconst t1 = performance.now();\nconsole.log(`Время: ${(t1 - t0).toFixed(3)} мс`);\n\n// Performance.measure() — именованные измерения\nperformance.mark("start");\nheavyOperation();\nperformance.mark("end");\nperformance.measure("heavyOp", "start", "end");\n\nconst [measure] = performance.getEntriesByName("heavyOp");\nconsole.log(`${measure.name}: ${measure.duration.toFixed(3)} мс`);\nperformance.clearMarks();\nperformance.clearMeasures();\n\n// Node.js профилирование\n// node --prof src/index.js    — создаёт isolate-*.log\n// node --prof-process isolate-*.log > profile.txt\n\n// Встроенный профайлер\nconst { PerformanceObserver } = require("perf_hooks");\nconst obs = new PerformanceObserver((list) => {\n  list.getEntries().forEach(entry => {\n    console.log(`${entry.name}: ${entry.duration}ms`);\n  });\n});\nobs.observe({ type: "measure", buffered: true });\n\n// Поиск утечек памяти\n// node --inspect src/index.js\n// DevTools -> Memory -> Take heap snapshot\n// Сравните два снимка — растущие объекты = утечка\n\n// v8.getHeapStatistics() в Node.js\nconst v8 = require("v8");\nconsole.log(v8.getHeapStatistics());' }
      ]
    },
    {
      id: 5,
      title: 'Стратегии отладки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Систематический подход к отладке: изоляция проблемы, воспроизведение, анализ, гипотеза, проверка. Чаще всего ошибки в граничных условиях и async коде.' },
        { type: 'heading', value: 'Паттерны отладки' },
        { type: 'code', language: 'javascript', value: '// 1. Логирование с контекстом\nconst debug = require("debug")("app:users"); // npm install debug\n// Включить: DEBUG=app:* node index.js\n// или DEBUG=app:users,app:auth node index.js\n\ndebug("Создание пользователя: %o", userData);\ndebug("SQL запрос выполнен за %dms", elapsed);\n\n// 2. Structured logging (Winston, Pino)\nconst pino = require("pino");\nconst logger = pino({ level: process.env.LOG_LEVEL || "info" });\n\nlogger.info({ userId: 1, action: "login" }, "Пользователь вошёл");\nlogger.error({ err: error, userId }, "Ошибка авторизации");\n// Вывод в JSON — удобно для log агрегаторов (ELK, Datadog)\n\n// 3. Error границы\nprocess.on("uncaughtException", (err) => {\n  logger.fatal(err, "Необработанное исключение");\n  process.exit(1);\n});\n\nprocess.on("unhandledRejection", (reason, promise) => {\n  logger.error({ reason }, "Unhandled rejection");\n});\n\n// 4. Debugger как инструмент\n// Вместо: добавить console.log, запустить, убрать\n// Лучше: поставить breakpoint, изучить state, продолжить\n\n// 5. Изоляция в REPL\n// node — запустить Node REPL\n// .load file.js — загрузить файл\n// require("./module").functionName(...)\n\n// 6. Binary search для поиска бага\n// Большой код -> закомментировать половину\n// Если работает -> баг в закомментированной части\n// Если не работает -> баг в оставшейся части\n// Повторять до нахождения' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Отладка кода',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найдите и исправьте ошибки в предоставленном коде, используя console.table, debugger и анализ stack trace.',
      requirements: [
        'Функция groupByCategory содержит баг — найдите с console.table',
        'Добавьте логирование времени выполнения через console.time',
        'Напишите обработчик для unhandledRejection',
        'Добавьте условный debugger: срабатывает только если count > 100',
        'Используйте console.assert для проверки инвариантов'
      ],
      hint: 'Для поиска ошибок используйте console.table() для вывода массивов, console.trace() для стека вызовов. В Node.js отлаживайте через node --inspect. Внимательно читайте stack trace — первая строка указывает место ошибки.',
      expectedOutput: 'Ошибка найдена: TypeError в строке 15 — обращение к свойству null\nconsole.table(users) -> таблица с данными пользователей\nИсправленный код выводит правильный результат\nВсе 5 проблем найдены и задокументированы',
      solution: '// Код с багами\nfunction groupByCategory(items) {\n  const result = {};\n  for (const item of items) {\n    const cat = item.category;\n    if (!result[cat]) result[cat] = [];\n    result[cat].push(item);\n  }\n  return result;\n}\n\n// Отладка\nconst items = [\n  { name: "Яблоко", category: "Фрукт" },\n  { name: "Морковь", category: "Овощ" },\n  { name: "Банан", category: "Фрукт" }\n];\n\nconsole.time("groupByCategory");\nconst grouped = groupByCategory(items);\nconsole.timeEnd("groupByCategory");\n\nconsole.table(Object.entries(grouped).map(([cat, arr]) => ({\n  Категория: cat,\n  Количество: arr.length,\n  Названия: arr.map(i => i.name).join(", ")\n})));\n\nconsole.assert(\n  Object.keys(grouped).length === 2,\n  "Ожидается 2 категории, получено:",\n  Object.keys(grouped).length\n);\n\n// Условный debugger\nconst processItems = (count) => {\n  if (count > 100) debugger;\n  return count * 2;\n};\n\n// Глобальный обработчик\nprocess.on("unhandledRejection", (reason) => {\n  console.error("Unhandled Promise Rejection:", reason);\n  // В production: логировать и завершить процесс\n  process.exit(1);\n});\n\nconsole.log("Готово");',
      explanation: 'console.time/timeEnd создаёт именованный таймер — имена должны совпадать. console.table принимает массив объектов и выводит их как таблицу с именованными столбцами. console.assert не выводит ничего если условие true — выводит ошибку только при false, что удобно для проверки инвариантов без засорения вывода. Условный debugger срабатывает только при count > 100 — не мешает при нормальных значениях. unhandledRejection перехватывает Promise без .catch() — без обработчика Node.js завершится с ошибкой.'
    }
  ]
};
