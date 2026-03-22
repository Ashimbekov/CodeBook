export default {
  id: 34,
  title: 'Path и OS',
  description: 'Модули path и os Node.js: работа с путями файловой системы (join, resolve, dirname, basename), информация об операционной системе (cpus, memory, hostname).',
  lessons: [
    {
      id: 1,
      title: 'Модуль path — работа с путями',
      type: 'theory',
      content: [
        { type: 'text', value: 'Модуль path предоставляет утилиты для работы с путями файловой системы. Он обрабатывает различия между Windows (\\) и Unix (/) автоматически.' },
        { type: 'code', language: 'javascript', value: 'import path from "node:path";\n\n// path.join — объединить части пути (нормализует разделители)\nconsole.log(path.join("/home", "user", "docs", "file.txt"));\n// /home/user/docs/file.txt\n\nconsole.log(path.join(__dirname, "config", "app.json"));\n// /current/dir/config/app.json\n\n// .. и . обрабатываются корректно\nconsole.log(path.join("/home/user", "../another", "./file.txt"));\n// /home/another/file.txt\n\n// path.resolve — абсолютный путь (от CWD или переданного базового)\nconsole.log(path.resolve("src", "index.js"));\n// /current/working/directory/src/index.js\n\nconsole.log(path.resolve("/etc", "nginx", "nginx.conf"));\n// /etc/nginx/nginx.conf\n\n// join vs resolve:\n// join: просто объединяет с нормализацией\n// resolve: строит абсолютный путь, обрабатывает / как корень\nconsole.log(path.join("/a", "/b"));\n// /a/b (просто объединил)\nconsole.log(path.resolve("/a", "/b"));\n// /b (/b — абсолютный, сбросил /a!)' },
        { type: 'tip', value: 'Всегда используй path.join для объединения путей, никогда не конкатенируй строки вручную ("dir" + "/" + "file.txt"). path.join корректно работает на Windows (обратные слеши) и Unix (прямые).' }
      ]
    },
    {
      id: 2,
      title: 'Разбор путей: dirname, basename, extname, parse',
      type: 'theory',
      content: [
        { type: 'text', value: 'path предоставляет методы для разбора компонентов пути: директория, имя файла, расширение, полный разбор и сборка.' },
        { type: 'code', language: 'javascript', value: 'import path from "node:path";\n\nconst filePath = "/home/user/projects/app/src/index.js";\n\n// dirname — директория\nconsole.log(path.dirname(filePath));\n// "/home/user/projects/app/src"\n\n// basename — имя файла (с расширением)\nconsole.log(path.basename(filePath));\n// "index.js"\n\n// basename с удалением расширения\nconsole.log(path.basename(filePath, ".js"));\n// "index"\n\n// extname — расширение (с точкой)\nconsole.log(path.extname(filePath));  // ".js"\nconsole.log(path.extname("image.png")); // ".png"\nconsole.log(path.extname("README"));    // "" (нет расширения)\n\n// parse — полный разбор\nconsole.log(path.parse(filePath));\n// {\n//   root: "/",\n//   dir:  "/home/user/projects/app/src",\n//   base: "index.js",\n//   ext:  ".js",\n//   name: "index"\n// }\n\n// format — обратная операция (сборка из частей)\nconsole.log(path.format({\n  dir:  "/home/user/projects",\n  name: "config",\n  ext:  ".json"\n}));\n// "/home/user/projects/config.json"' },
        { type: 'code', language: 'javascript', value: '// Практические применения\nimport { fileURLToPath } from "node:url";\n\n// ESM: получить __dirname\nconst __filename = fileURLToPath(import.meta.url);\nconst __dirname  = path.dirname(__filename);\n\n// Построение путей к ресурсам\nconst publicDir   = path.join(__dirname, "..", "public");\nconst uploadsDir  = path.join(__dirname, "..", "uploads");\nconst configPath  = path.join(__dirname, "..", "config", "app.json");\n\n// Смена расширения файла\nfunction changeExtension(filePath, newExt) {\n  const parsed = path.parse(filePath);\n  return path.format({ ...parsed, ext: newExt, base: "" });\n  // base нужно очистить чтобы ext был использован\n}\n\nconsole.log(changeExtension("./src/app.ts", ".js"));\n// "./src/app.js"' }
      ]
    },
    {
      id: 3,
      title: 'path.relative, normalize и разделители',
      type: 'theory',
      content: [
        { type: 'text', value: 'path.relative вычисляет относительный путь между двумя абсолютными. normalize убирает лишние ../ и //. sep и delimiter — платформенные разделители.' },
        { type: 'code', language: 'javascript', value: 'import path from "node:path";\n\n// relative — относительный путь между двумя абсолютными\nconst from = "/home/user/projects/app";\nconst to   = "/home/user/projects/shared/utils.js";\nconsole.log(path.relative(from, to));\n// "../shared/utils.js"\n\nconsole.log(path.relative("/a/b/c", "/a/d/e"));\n// "../../d/e"\n\n// normalize — убирает лишние . и ..\nconsole.log(path.normalize("/home//user/../user/./docs"));\n// "/home/user/docs"\n\nconsole.log(path.normalize("./src//../utils/./logger.js"));\n// "utils/logger.js"\n\n// Платформенные разделители\nconsole.log(path.sep);\n// Unix: "/",  Windows: "\\\\"\n\nconsole.log(path.delimiter);\n// Unix: ":",  Windows: ";"\n// Используется в PATH переменной окружения\n\nconsole.log(path.posix.join("/a", "b")); // всегда Unix стиль\nconsole.log(path.win32.join("C:\\\\a", "b")); // всегда Windows стиль' },
        { type: 'tip', value: 'path.relative используется в build-инструментах для генерации import путей, source maps, и относительных URL. Например: из "src/utils/a.js" до "src/lib/b.js" = "../lib/b.js".' }
      ]
    },
    {
      id: 4,
      title: 'Модуль os — информация об ОС',
      type: 'theory',
      content: [
        { type: 'text', value: 'Модуль os предоставляет информацию об операционной системе: платформа, архитектура, память, CPU, пользователь, временная директория.' },
        { type: 'code', language: 'javascript', value: 'import os from "node:os";\n\n// Базовая информация\nconsole.log(os.platform());    // "linux", "darwin", "win32"\nconsole.log(os.arch());        // "x64", "arm64", "ia32"\nconsole.log(os.release());     // "6.8.0-106-generic"\nconsole.log(os.type());        // "Linux", "Darwin", "Windows_NT"\nconsole.log(os.version());     // "#106-Ubuntu SMP..."\n\n// Хостнейм\nconsole.log(os.hostname());    // "my-server"\n\n// Временная директория (для temp файлов)\nconsole.log(os.tmpdir());      // "/tmp" или "C:\\Users\\User\\AppData\\Local\\Temp"\n\n// Домашняя директория текущего пользователя\nconsole.log(os.homedir());     // "/home/user" или "C:\\Users\\User"\n\n// Разделитель EOL (конец строки)\nconsole.log(os.EOL === "\\n"); // Linux/Mac\nconsole.log(os.EOL === "\\r\\n"); // Windows' },
        { type: 'code', language: 'javascript', value: '// Память\nconsole.log("Всего RAM:", Math.round(os.totalmem() / 1024**3), "ГБ");\nconsole.log("Свободно:", Math.round(os.freemem() / 1024**3), "ГБ");\nconsole.log("Занято:", Math.round((os.totalmem()-os.freemem()) / 1024**3), "ГБ");\n\n// CPU информация\nconst cpus = os.cpus();\nconsole.log("Ядер CPU:", cpus.length);\nconsole.log("Модель CPU:", cpus[0].model);\nconsole.log("Частота:", cpus[0].speed, "МГц");\n\n// Загрузка CPU (нормализованная)\nfunction getCPULoad() {\n  return os.loadavg(); // [1мин, 5мин, 15мин]\n}\nconsole.log("Load average:", getCPULoad()); // [0.5, 0.3, 0.2]\n\n// Сетевые интерфейсы\nconst interfaces = os.networkInterfaces();\nfor (const [name, addrs] of Object.entries(interfaces)) {\n  for (const addr of addrs) {\n    if (addr.family === "IPv4" && !addr.internal) {\n      console.log(`${name}: ${addr.address}`);\n    }\n  }\n}' },
        { type: 'note', value: 'os.cpus() возвращает массив с информацией о каждом логическом ядре. cpus.length — количество потоков (не физических ядер). На 4-ядерном процессоре с HT — вернёт 8.' }
      ]
    },
    {
      id: 5,
      title: 'Переменные окружения и конфигурация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Конфигурация через переменные окружения — стандарт для production приложений (12-factor app). dotenv загружает их из .env файла.' },
        { type: 'code', language: 'javascript', value: '// .env файл (НЕ коммитить в Git!)\n// PORT=3000\n// DB_URL=mongodb://localhost:27017/myapp\n// JWT_SECRET=super-secret-key\n// NODE_ENV=development\n\n// Загрузка .env\nimport "dotenv/config"; // автоматически читает .env\n// или: import dotenv from "dotenv"; dotenv.config();\n\n// Доступ к переменным\nconst PORT    = parseInt(process.env.PORT)    || 3000;\nconst DB_URL  = process.env.DB_URL            || "mongodb://localhost/dev";\nconst JWT_SEC = process.env.JWT_SECRET;\nconst IS_PROD = process.env.NODE_ENV === "production";\n\n// Проверка обязательных переменных\nfunction requireEnv(name) {\n  const value = process.env[name];\n  if (!value) {\n    console.error(`Переменная ${name} не установлена!`);\n    process.exit(1);\n  }\n  return value;\n}\n\nconst secret = requireEnv("JWT_SECRET");\nconst dbUrl  = requireEnv("DATABASE_URL");' },
        { type: 'code', language: 'javascript', value: '// Типизированный конфиг модуль\nconst config = {\n  server: {\n    port:    parseInt(process.env.PORT)    || 3000,\n    host:    process.env.HOST              || "0.0.0.0"\n  },\n  database: {\n    url:     process.env.DATABASE_URL      || "sqlite::memory:",\n    pool:    parseInt(process.env.DB_POOL) || 10\n  },\n  auth: {\n    secret:  process.env.JWT_SECRET        || "dev-only-secret",\n    expires: process.env.JWT_EXPIRES       || "7d"\n  },\n  app: {\n    env:     process.env.NODE_ENV          || "development",\n    debug:   process.env.DEBUG === "true"\n  }\n};\n\nexport default config;' },
        { type: 'tip', value: '.env.example (без секретов, с комментариями) коммится в Git — это документация для других разработчиков. Они копируют в .env и заполняют своими значениями. Это стандартная практика.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: системная утилита',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай утилиту для мониторинга системы и работы с путями.',
      requirements: [
        'getSystemInfo() — вернуть объект с информацией о системе (OS, CPU, RAM, hostname)',
        'normalizePath(p) — нормализовать путь: убрать ../, расширить ~ до homedir',
        'findProjectRoot(startDir) — найти корень проекта (директорию с package.json)',
        'createTempFile(prefix, content) — создать временный файл в os.tmpdir()'
      ],
      hint: 'normalizePath: заменить ~ на os.homedir(), затем path.normalize(). findProjectRoot: идти вверх по директориям пока не найдёшь package.json или не дойдёшь до корня. createTempFile: path.join(os.tmpdir(), prefix + Date.now()).',
      expectedOutput: 'process.platform -> "linux" / "win32" / "darwin"\nprocess.memoryUsage().heapUsed -> число байт\npath.join("a", "b", "c") -> "a/b/c" (или "a\\b\\c" на Windows)\nos.cpus().length -> количество ядер процессора',
      solution: 'import os from "node:os";\nimport path from "node:path";\nimport { access, writeFile, readdir } from "node:fs/promises";\nimport { constants } from "node:fs";\n\nfunction getSystemInfo() {\n  const cpus = os.cpus();\n  const totalMem = os.totalmem();\n  const freeMem  = os.freemem();\n\n  return {\n    os: {\n      type:     os.type(),\n      platform: os.platform(),\n      release:  os.release(),\n      arch:     os.arch()\n    },\n    cpu: {\n      model: cpus[0]?.model.trim(),\n      cores: cpus.length,\n      speed: cpus[0]?.speed\n    },\n    memory: {\n      total:     Math.round(totalMem / 1024**3 * 100) / 100,\n      free:      Math.round(freeMem  / 1024**3 * 100) / 100,\n      usedPercent: Math.round((1 - freeMem/totalMem) * 100)\n    },\n    network: {\n      hostname: os.hostname()\n    },\n    process: {\n      pid:     process.pid,\n      uptime:  Math.round(process.uptime()),\n      version: process.version\n    }\n  };\n}\n\nfunction normalizePath(p) {\n  if (p.startsWith("~/")) {\n    p = path.join(os.homedir(), p.slice(2));\n  } else if (p === "~") {\n    p = os.homedir();\n  }\n  return path.normalize(p);\n}\n\nasync function findProjectRoot(startDir = process.cwd()) {\n  let current = path.resolve(startDir);\n  const root = path.parse(current).root;\n\n  while (current !== root) {\n    try {\n      await access(path.join(current, "package.json"), constants.F_OK);\n      return current;\n    } catch {\n      current = path.dirname(current);\n    }\n  }\n  return null;\n}\n\nasync function createTempFile(prefix = "tmp", content = "") {\n  const filename = path.join(\n    os.tmpdir(),\n    `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}.tmp`\n  );\n  await writeFile(filename, content, "utf-8");\n  return filename;\n}\n\nconst info = getSystemInfo();\nconsole.log(`${info.os.platform} | ${info.cpu.cores} ядер | ${info.memory.total}ГБ RAM`);\n\nconst root = await findProjectRoot();\nconsole.log("Корень проекта:", root);\n\nconst tmpFile = await createTempFile("test", "Временные данные");\nconsole.log("Создан файл:", tmpFile);',
      explanation: 'getSystemInfo собирает информацию из os модуля в структурированный объект. normalizePath обрабатывает ~ (тильда) через os.homedir(). findProjectRoot рекурсивно поднимается по директориям пока не найдёт package.json или не достигнет корня диска. createTempFile создаёт уникальное имя через Date.now() + random.'
    }
  ]
}
