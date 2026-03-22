export default {
  id: 31,
  title: 'Введение в Node.js',
  description: 'Node.js — JavaScript на сервере: среда выполнения, npm, package.json, структура проекта, встроенные модули и первый сервер.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Node.js',
      type: 'theory',
      content: [
        { type: 'text', value: 'Node.js — среда выполнения JavaScript вне браузера, построенная на движке V8 (Chrome). Позволяет запускать JS на сервере, создавать CLI-инструменты, API, обрабатывать файлы. Асинхронный, неблокирующий I/O.' },
        { type: 'code', language: 'javascript', value: '// Первая программа Node.js\nconsole.log("Привет от Node.js!");\nconsole.log("Node версия:", process.version); // v20.x.x\nconsole.log("Платформа:", process.platform);  // linux, win32, darwin\n\n// Node.js предоставляет глобальные объекты:\n// process   — информация о процессе\n// __dirname — директория текущего файла (CommonJS)\n// __filename — путь к текущему файлу (CommonJS)\n// global    — глобальный объект (как window в браузере)\n// Buffer    — работа с бинарными данными\n\n// Аргументы командной строки\n// node script.js arg1 arg2\nconsole.log(process.argv);\n// ["/path/to/node", "/path/to/script.js", "arg1", "arg2"]\n\nconst args = process.argv.slice(2);\nconsole.log("Аргументы:", args);' },
        { type: 'heading', value: 'Node.js vs Браузер' },
        { type: 'code', language: 'javascript', value: '// В браузере есть: window, document, DOM API, Web APIs\n// В Node.js нет window/document, но есть:\n// - Файловая система (fs)\n// - Сеть (http, https, net)\n// - Процессы (child_process, cluster)\n// - Потоки (stream)\n// - Криптография (crypto)\n// - Путь (path)\n// - ОС (os)\n\n// Проверка среды выполнения:\nconst isNode    = typeof process !== "undefined" && process.versions?.node;\nconst isBrowser = typeof window !== "undefined";\n\nconsole.log("Node.js:", isNode);    // true\nconsole.log("Browser:", isBrowser); // false' },
        { type: 'tip', value: 'Node.js использует тот же V8 движок что и Chrome, поэтому весь ES6+ синтаксис доступен. Но браузерные API (fetch, localStorage, DOM) по умолчанию нет. В Node.js 18+ fetch доступен нативно.' }
      ]
    },
    {
      id: 2,
      title: 'npm и управление пакетами',
      type: 'theory',
      content: [
        { type: 'text', value: 'npm (Node Package Manager) — менеджер пакетов JavaScript. Входит в поставку Node.js. Позволяет устанавливать зависимости, запускать скрипты, публиковать пакеты.' },
        { type: 'code', language: 'javascript', value: '// Основные команды npm:\n\n// Инициализация проекта\n// npm init           -- интерактивное создание package.json\n// npm init -y        -- создать с умолчаниями\n\n// Установка пакетов\n// npm install axios          -- добавить в dependencies\n// npm install --save-dev jest -- добавить в devDependencies\n// npm install -g typescript   -- глобальная установка\n// npm install                 -- установить все из package.json\n\n// Удаление\n// npm uninstall axios\n\n// Скрипты\n// npm run start\n// npm run test\n// npm run build\n\n// Информация\n// npm list           -- список установленных\n// npm outdated       -- устаревшие пакеты\n// npm update         -- обновить пакеты\n// npm audit          -- проверить уязвимости' },
        { type: 'heading', value: 'Альтернативы npm' },
        { type: 'code', language: 'javascript', value: '// yarn — Facebook\n// yarn add axios\n// yarn install\n// yarn run test\n\n// pnpm — быстрый, экономит место\n// pnpm add axios\n// pnpm install\n\n// bun — новый ultra-fast runtime\n// bun add axios\n// bun install\n\n// npx — запуск пакетов без установки\n// npx create-react-app my-app\n// npx jest --watch' },
        { type: 'note', value: 'npm версии: "^1.2.3" — совместимые обновления (minor/patch), "~1.2.3" — только patch обновления, "1.2.3" — точная версия. package-lock.json фиксирует ТОЧНЫЕ версии всего дерева зависимостей.' }
      ]
    },
    {
      id: 3,
      title: 'package.json — конфигурация проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'package.json — главный файл конфигурации Node.js проекта. Описывает метаданные, зависимости, скрипты, точку входа и многое другое.' },
        { type: 'code', language: 'javascript', value: '// package.json — пример для реального проекта\n{\n  "name": "my-api",\n  "version": "1.0.0",\n  "description": "REST API сервер",\n  "type": "module",       // "module" = ESM, убрать = CommonJS\n  "main": "src/index.js", // точка входа\n  "engines": {\n    "node": ">=18.0.0"\n  },\n  "scripts": {\n    "start":   "node src/index.js",\n    "dev":     "nodemon src/index.js",\n    "test":    "jest",\n    "build":   "tsc",\n    "lint":    "eslint src/**/*.js"\n  },\n  "dependencies": {\n    "express":  "^4.18.0",\n    "axios":    "^1.4.0",\n    "dotenv":   "^16.0.0"\n  },\n  "devDependencies": {\n    "jest":     "^29.0.0",\n    "nodemon":  "^3.0.0",\n    "eslint":   "^8.0.0"\n  },\n  "keywords": ["api", "express"],\n  "author": "Нурдаулет <n@example.com>",\n  "license": "MIT",\n  "private": true\n}' },
        { type: 'tip', value: '"type": "module" в package.json делает все .js файлы ES Modules (import/export). Без этого — CommonJS (require). Расширение .mjs всегда ESM, .cjs всегда CommonJS, независимо от "type".' }
      ]
    },
    {
      id: 4,
      title: 'Встроенные модули Node.js',
      type: 'theory',
      content: [
        { type: 'text', value: 'Node.js поставляется с богатой стандартной библиотекой. Основные модули: fs (файлы), http/https (сеть), path (пути), os (система), crypto (шифрование), events (события).' },
        { type: 'code', language: 'javascript', value: '// Импорт встроенных модулей (CommonJS)\nconst fs     = require("fs");\nconst path   = require("path");\nconst os     = require("os");\nconst http   = require("http");\nconst crypto = require("crypto");\n\n// Импорт встроенных модулей (ESM) — рекомендуемый способ\nimport fs     from "node:fs";\nimport path   from "node:path";\nimport os     from "node:os";\nimport http   from "node:http";\n\n// Префикс "node:" — явно указывает что это встроенный модуль\n// Предотвращает конфликты с npm пакетами с похожими именами\n\n// Примеры использования\nimport { hostname, platform, cpus, totalmem, freemem } from "node:os";\n\nconsole.log("Хост:", hostname());\nconsole.log("ОС:", platform());\nconsole.log("Ядра CPU:", cpus().length);\nconsole.log("Память:", Math.round(totalmem() / 1024 / 1024 / 1024), "ГБ");' }
      ]
    },
    {
      id: 5,
      title: 'process объект',
      type: 'theory',
      content: [
        { type: 'text', value: 'process — глобальный объект Node.js с информацией о текущем процессе и методами управления им. Переменные окружения, аргументы, потоки ввода/вывода.' },
        { type: 'code', language: 'javascript', value: '// process.env — переменные окружения\nconsole.log(process.env.NODE_ENV);  // "development", "production"\nconsole.log(process.env.PORT);      // "3000"\nconsole.log(process.env.DB_URL);    // строка подключения\n\n// Читать .env файл через dotenv\n// require("dotenv").config();\n// process.env.MY_SECRET теперь доступна\n\n// process.argv — аргументы командной строки\n// node app.js --port 3000 --debug\nconsole.log(process.argv);\n// ["/usr/bin/node", "/app.js", "--port", "3000", "--debug"]\n\n// process.exit() — завершить процесс\nif (!process.env.API_KEY) {\n  console.error("API_KEY обязателен!");\n  process.exit(1); // 1 = код ошибки\n}\n\n// process.stdout / process.stderr — потоки вывода\nprocess.stdout.write("Прогресс: 50%\\r");\nprocess.stderr.write("ОШИБКА: что-то пошло не так\\n");\n\n// process.on — события процесса\nprocess.on("exit", (code) => {\n  console.log(`Завершение с кодом: ${code}`);\n});\n\nprocess.on("uncaughtException", (err) => {\n  console.error("Необработанная ошибка:", err);\n  process.exit(1);\n});' },
        { type: 'tip', value: '.env файл хранит секреты (API ключи, пароли БД) вне кода. Добавь .env в .gitignore! Используй dotenv пакет для автоматической загрузки. Никогда не коммить .env в репозиторий!' }
      ]
    },
    {
      id: 6,
      title: 'Первый HTTP сервер',
      type: 'theory',
      content: [
        { type: 'text', value: 'Создадим простой HTTP сервер на чистом Node.js без фреймворков. Модуль http предоставляет всё необходимое.' },
        { type: 'code', language: 'javascript', value: 'import http from "node:http";\n\nconst PORT = process.env.PORT || 3000;\n\nconst server = http.createServer((req, res) => {\n  // req — IncomingMessage (запрос)\n  // res — ServerResponse (ответ)\n\n  console.log(`${req.method} ${req.url}`);\n\n  // Заголовок ответа\n  res.setHeader("Content-Type", "application/json");\n  res.setHeader("X-Powered-By", "Node.js");\n\n  // Маршрутизация\n  if (req.url === "/" && req.method === "GET") {\n    res.statusCode = 200;\n    res.end(JSON.stringify({ message: "Привет от Node.js!" }));\n\n  } else if (req.url === "/health" && req.method === "GET") {\n    res.statusCode = 200;\n    res.end(JSON.stringify({ status: "ok", uptime: process.uptime() }));\n\n  } else {\n    res.statusCode = 404;\n    res.end(JSON.stringify({ error: "Не найдено" }));\n  }\n});\n\nserver.listen(PORT, () => {\n  console.log(`Сервер запущен на http://localhost:${PORT}`);\n});\n\nserver.on("error", (err) => {\n  console.error("Ошибка сервера:", err);\n});' }
      ]
    },
    {
      id: 7,
      title: 'Практика: CLI инструмент',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай простой CLI инструмент для работы с аргументами командной строки.',
      requirements: [
        'parseArgs(argv) — парсит массив аргументов в объект { flags, args }',
        'Флаги начинаются с -- (например --verbose, --output=file.txt)',
        'Короткие флаги с - (например -v, -o file.txt)',
        'Вывести help если передан --help или -h флаг'
      ],
      hint: 'Пройди по argv.slice(2). Если начинается с -- это флаг. Если содержит = значит --key=value. Иначе следующий аргумент — значение.',
      solution: 'function parseArgs(argv = process.argv) {\n  const args = argv.slice(2);\n  const flags = {};\n  const positional = [];\n\n  for (let i = 0; i < args.length; i++) {\n    const arg = args[i];\n\n    if (arg.startsWith("--")) {\n      if (arg.includes("=")) {\n        const [key, value] = arg.slice(2).split("=");\n        flags[key] = value;\n      } else {\n        const key = arg.slice(2);\n        const next = args[i + 1];\n        if (next && !next.startsWith("-")) {\n          flags[key] = next;\n          i++;\n        } else {\n          flags[key] = true;\n        }\n      }\n    } else if (arg.startsWith("-")) {\n      const key = arg.slice(1);\n      const next = args[i + 1];\n      if (next && !next.startsWith("-")) {\n        flags[key] = next;\n        i++;\n      } else {\n        flags[key] = true;\n      }\n    } else {\n      positional.push(arg);\n    }\n  }\n\n  return { flags, args: positional };\n}\n\nconst { flags, args } = parseArgs();\n\nif (flags.help || flags.h) {\n  console.log("Использование: node cli.js [options] [args]");\n  console.log("  --help, -h     Справка");\n  console.log("  --verbose, -v  Подробный вывод");\n  console.log("  --output=FILE  Файл вывода");\n  process.exit(0);\n}\n\nif (flags.verbose || flags.v) {\n  console.log("Режим: подробный вывод");\n}\n\nif (flags.output) {\n  console.log("Вывод в файл:", flags.output);\n}\n\nconsole.log("Аргументы:", args);',
      explanation: 'parseArgs обходит argv массив и различает флаги (--key, -k, --key=val) и позиционные аргументы. Для --key без = проверяет следующий элемент: если не флаг — считает его значением. Это упрощённая версия популярных пакетов commander или yargs.'
    }
  ]
}
