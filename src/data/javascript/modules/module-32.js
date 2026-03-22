export default {
  id: 32,
  title: 'Модули Node.js (CommonJS/ESM)',
  description: 'CommonJS require/module.exports и ES Modules import/export в Node.js: различия, совместимость, __dirname, import.meta, переход с CJS на ESM.',
  lessons: [
    {
      id: 1,
      title: 'CommonJS — require и module.exports',
      type: 'theory',
      content: [
        { type: 'text', value: 'CommonJS — оригинальная система модулей Node.js. require() загружает модуль синхронно, module.exports экспортирует значения. До сих пор широко используется.' },
        { type: 'code', language: 'javascript', value: '// === math.js ===\n// Экспорт 1: через module.exports (объект)\nfunction add(a, b) { return a + b; }\nfunction sub(a, b) { return a - b; }\nconst PI = 3.14159;\n\nmodule.exports = { add, sub, PI };\n\n// Экспорт 2: через exports (ссылка на module.exports)\nexports.multiply = (a, b) => a * b;\nexports.divide   = (a, b) => a / b;\n\n// ВАЖНО: нельзя переприсваивать exports\n// exports = { add }; // ОШИБКА — разрывает связь с module.exports!\n// Правильно: module.exports = { add };\n\n// Экспорт 3: одна функция/класс\n// module.exports = function calculator(a, op, b) { ... }\n\n// === main.js ===\nconst math = require("./math");       // расширение .js необязательно\nconsole.log(math.add(2, 3));          // 5\nconsole.log(math.PI);                 // 3.14159\n\n// Деструктурирование\nconst { add, sub, PI } = require("./math");\nconsole.log(add(10, 5)); // 15' },
        { type: 'tip', value: 'require() кэширует модули! Второй вызов require("./math") вернёт тот же объект, не загрузит файл заново. Это экономит ресурсы, но означает что изменение экспортируемого объекта видно везде.' }
      ]
    },
    {
      id: 2,
      title: 'Разрешение путей в require',
      type: 'theory',
      content: [
        { type: 'text', value: 'require() ищет модули по определённому алгоритму: встроенные, node_modules, файлы. Важно понимать как строятся пути.' },
        { type: 'code', language: 'javascript', value: '// Встроенные модули (приоритет 1)\nconst fs   = require("fs");       // встроенный\nconst path = require("path");     // встроенный\nconst http = require("http");     // встроенный\n\n// node_modules (приоритет 2)\nconst express = require("express"); // npm пакет\nconst _       = require("lodash");  // npm пакет\n\n// Локальные файлы — ВСЕГДА с ./ или ../\nconst utils  = require("./utils");           // utils.js или utils/index.js\nconst config = require("../config/settings"); // относительный путь\nconst db     = require("/absolute/path/db"); // абсолютный путь\n\n// Алгоритм поиска ./utils:\n// 1. ./utils.js\n// 2. ./utils.json\n// 3. ./utils.node\n// 4. ./utils/index.js\n// 5. ./utils/package.json (поле "main")\n\n// __dirname и __filename (только CJS)\nconsole.log(__dirname);  // /home/user/project/src\nconsole.log(__filename); // /home/user/project/src/main.js\n\nconst configPath = require("path").join(__dirname, "../config/app.json");' },
        { type: 'note', value: 'В ESM нет __dirname и __filename. Для получения пути используй: import { fileURLToPath } from "url"; const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);' }
      ]
    },
    {
      id: 3,
      title: 'ES Modules в Node.js',
      type: 'theory',
      content: [
        { type: 'text', value: 'Node.js поддерживает ES Modules с версии 12+. Нужно: расширение .mjs или "type": "module" в package.json. ESM — современный стандарт, используй его в новых проектах.' },
        { type: 'code', language: 'javascript', value: '// === package.json ===\n// { "type": "module" }\n// Теперь все .js файлы — ESM\n\n// === math.mjs (или math.js при "type":"module") ===\nexport const PI = 3.14159;\nexport function add(a, b) { return a + b; }\n\nexport default class Calculator {\n  add(a, b) { return a + b; }\n  multiply(a, b) { return a * b; }\n}\n\n// === main.mjs ===\nimport Calculator, { add, PI } from "./math.mjs"; // ОБЯЗАТЕЛЬНО с расширением!\nimport fs   from "node:fs";        // встроенные — с node:\nimport path from "node:path";\n\n// В ESM __dirname не существует!\n// Эмуляция:\nimport { fileURLToPath } from "node:url";\nimport { dirname }       from "node:path";\n\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname  = dirname(__filename);\n\nconsole.log(import.meta.url);     // file:///path/to/main.mjs\nconsole.log(import.meta.dirname); // /path/to (Node.js 21+)' },
        { type: 'tip', value: 'В ESM расширение файла ОБЯЗАТЕЛЬНО в импортах (./utils.js, не ./utils). Это отличие от CJS где .js можно опустить. Забыть расширение — частая ошибка при переходе на ESM.' }
      ]
    },
    {
      id: 4,
      title: 'Совместимость CJS и ESM',
      type: 'theory',
      content: [
        { type: 'text', value: 'Смешивать CJS и ESM непросто. ESM может импортировать CJS. CJS не может напрямую require() ESM. Есть паттерны для совместимости.' },
        { type: 'code', language: 'javascript', value: '// ESM может импортировать CJS пакеты\n// import express from "express"; // express — CJS, но ESM может его импортировать\n\n// CJS НЕ МОЖЕТ напрямую require() ESM:\n// const mod = require("./esm-module.mjs"); // ERR_REQUIRE_ESM\n\n// CJS может использовать ESM через динамический import():\nasync function loadESM() {\n  const { add } = await import("./utils.mjs");\n  console.log(add(1, 2));\n}\nloadESM();\n\n// Dual package: поддержка обоих форматов\n// package.json:\n// {\n//   "main": "./dist/index.cjs",     // для CJS\n//   "module": "./dist/index.mjs",   // для ESM (bundler)\n//   "exports": {\n//     "import": "./dist/index.mjs",\n//     "require": "./dist/index.cjs"\n//   }\n// }' },
        { type: 'code', language: 'javascript', value: '// Написать универсальный код\n// Определение CJS или ESM:\nconst isCJS = typeof module !== "undefined" && typeof require !== "undefined";\nconst isESM = typeof import.meta !== "undefined";\n\n// Условный экспорт\nif (isCJS) {\n  // Это не сработает в ESM файле (SyntaxError при парсинге)\n  // module.exports = ...\n} else {\n  // export default ...\n}' },
        { type: 'note', value: 'В 2024 году рекомендую: новые проекты — ESM (type: module). Библиотеки — dual package. Существующие CJS проекты — мигрировать постепенно или использовать .mjs для новых ESM файлов.' }
      ]
    },
    {
      id: 5,
      title: 'require.cache и динамическая загрузка',
      type: 'theory',
      content: [
        { type: 'text', value: 'require кэширует модули в require.cache. Можно очистить кэш для "горячей перезагрузки". Динамические пути позволяют загружать модули по условию.' },
        { type: 'code', language: 'javascript', value: '// Кэш модулей\nconsole.log(Object.keys(require.cache).length); // сколько загружено\n\n// Очистить кэш (для hot reload в разработке)\nfunction clearCache(modulePath) {\n  const resolved = require.resolve(modulePath);\n  delete require.cache[resolved];\n}\n\n// После этого require() загрузит файл заново\nclearCache("./config");\nconst freshConfig = require("./config");\n\n// Динамические пути\nconst env = process.env.NODE_ENV || "development";\nconst config = require(`./config/${env}`);\n// Загрузит ./config/development.js или ./config/production.js\n\n// Список загруженных модулей\nObject.keys(require.cache).forEach(key => {\n  if (!key.includes("node_modules")) {\n    console.log(key); // только наши модули\n  }\n});\n\n// require.resolve — только разрешение пути без загрузки\nconst absPath = require.resolve("./utils");\nconsole.log(absPath); // /absolute/path/to/utils.js' },
        { type: 'tip', value: 'nodemon — инструмент разработки, автоматически перезапускает Node.js при изменении файлов. Устанавливается как devDependency: npm install --save-dev nodemon. В package.json: "dev": "nodemon src/index.js".' }
      ]
    },
    {
      id: 6,
      title: 'Практика: создание модульной структуры',
      type: 'practice',
      difficulty: 'medium',
      description: 'Организуй код в модульную структуру Node.js проекта.',
      requirements: [
        'Создай структуру: src/utils/logger.js, src/utils/validator.js, src/utils/index.js',
        'logger.js: экспортируй функции log(level, msg), info(), warn(), error() через module.exports',
        'validator.js: ESM экспорт validateEmail(), validateAge()',
        'index.js (barrel): реэкспортирует всё через смешанный подход'
      ],
      hint: 'Для logger.js (CJS): const LEVELS = {...}; module.exports = { log, info, warn, error }. Для validator.js (ESM): export function validateEmail(). index.js: поскольку ESM, импортируй CJS через default import.',
      expectedOutput: 'Структура проекта создана корректно\nmodule.exports / export default работают правильно\nindex.js реэкспортирует все модули\nimport { fn } from "./utils" возвращает ожидаемый результат',
      solution: '// === src/utils/logger.js (CommonJS) ===\nconst LEVELS = { INFO: "INFO", WARN: "WARN", ERROR: "ERROR" };\n\nfunction log(level, message, data = null) {\n  const ts = new Date().toISOString();\n  const entry = `[${ts}] [${level}] ${message}`;\n  if (data) {\n    const out = level === LEVELS.ERROR ? console.error : console.log;\n    out(entry, data);\n  } else {\n    const out = level === LEVELS.ERROR ? console.error : console.log;\n    out(entry);\n  }\n}\n\nmodule.exports = {\n  log,\n  info:  (msg, data) => log(LEVELS.INFO, msg, data),\n  warn:  (msg, data) => log(LEVELS.WARN, msg, data),\n  error: (msg, data) => log(LEVELS.ERROR, msg, data)\n};\n\n// === src/utils/validator.js (ESM) ===\nexport function validateEmail(email) {\n  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);\n}\n\nexport function validateAge(age) {\n  return Number.isInteger(age) && age >= 0 && age <= 150;\n}\n\nexport function validateName(name) {\n  return typeof name === "string" && name.trim().length >= 2;\n}\n\n// === src/utils/index.js (ESM, barrel) ===\nexport { validateEmail, validateAge, validateName } from "./validator.js";\n\n// CJS модуль как ESM default\nimport logger from "./logger.js"; // CJS импортируется как default\nexport { logger };\n\n// === src/app.js ===\nimport { validateEmail, logger } from "./utils/index.js";\n\nlogger.info("Приложение запущено");\nconsole.log(validateEmail("test@mail.kz")); // true',
      explanation: 'CJS module.exports совместим с ESM default import. Barrel файл реэкспортирует ESM через {} и CJS через default. Структура разделяет логику: logger — для логирования, validator — для валидации. Каждый модуль имеет одну ответственность.'
    }
  ]
}
