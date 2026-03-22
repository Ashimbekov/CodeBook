export default {
  id: 56,
  title: 'Практикум — Node.js',
  description: 'Практические задачи по Node.js: файловая система, HTTP сервер, CLI инструменты, потоки и работа с процессами',
  lessons: [
    {
      id: 1,
      title: 'Утилита поиска файлов',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте CLI утилиту searchFiles(dir, pattern): рекурсивно ищет файлы по паттерну (glob или regex). Выводит пути и размеры найденных файлов.',
      requirements: [
        'searchFiles("./src", ".js") — найти все .js файлы',
        'Рекурсивный обход директорий',
        'Вывести: путь, размер, дата изменения',
        'Игнорировать node_modules'
      ],
      hint: 'Используйте fs.readdirSync с { withFileTypes: true } для получения типа файла. Рекурсивно обходите подпапки через dirent.isDirectory(). Для сравнения с паттерном используйте micromatch или regexp.',
      expectedOutput: 'searchFiles("./src", "*.js") -> ["src/index.js", "src/utils.js", ...]\nsearchFiles(".", "**/*.test.js") -> все тестовые файлы рекурсивно\nДля каждого файла: путь, размер в байтах\nПустой результат если совпадений нет',
      solution: {
        code: 'const fs = require("fs");\nconst path = require("path");\n\nasync function searchFiles(dir, pattern, ignore = ["node_modules", ".git"]) {\n  const results = [];\n\n  async function traverse(currentDir) {\n    let entries;\n    try {\n      entries = await fs.promises.readdir(currentDir, { withFileTypes: true });\n    } catch {\n      return; // Нет доступа — пропускаем\n    }\n\n    for (const entry of entries) {\n      if (ignore.includes(entry.name)) continue;\n\n      const fullPath = path.join(currentDir, entry.name);\n\n      if (entry.isDirectory()) {\n        await traverse(fullPath);\n      } else if (entry.isFile()) {\n        const matches = pattern instanceof RegExp\n          ? pattern.test(entry.name)\n          : entry.name.endsWith(pattern);\n\n        if (matches) {\n          const stats = await fs.promises.stat(fullPath);\n          results.push({\n            path: fullPath,\n            name: entry.name,\n            size: stats.size,\n            modified: stats.mtime.toLocaleDateString("ru-RU")\n          });\n        }\n      }\n    }\n  }\n\n  await traverse(dir);\n  return results;\n}\n\n// Использование\nconst files = await searchFiles("./src", ".js");\nconsole.log(`Найдено ${files.length} файлов:`);\nfiles.forEach(f => {\n  console.log(`  ${f.path} (${(f.size / 1024).toFixed(1)} KB) — ${f.modified}`);\n});\n\nconst totalSize = files.reduce((sum, f) => sum + f.size, 0);\nconsole.log(`Общий размер: ${(totalSize / 1024).toFixed(1)} KB`);',
        language: 'javascript'
      },
      explanation: 'fs.promises.readdir с опцией { withFileTypes: true } возвращает Dirent объекты с методами isDirectory() и isFile() — без отдельного stat вызова для каждого файла. Рекурсивный обход реализован через внутреннюю функцию traverse. Try/catch вокруг readdir обрабатывает папки без прав доступа — continue вместо падения. Проверка pattern instanceof RegExp позволяет принимать как строки расширений так и регулярные выражения.'
    },
    {
      id: 2,
      title: 'HTTP сервер без Express',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте HTTP сервер на нативном Node.js http модуле. Реализуйте простой роутер и JSON API для списка задач (todo).',
      requirements: [
        'GET /tasks — список задач (JSON)',
        'POST /tasks — создать задачу из тела запроса',
        'DELETE /tasks/:id — удалить задачу',
        'Без Express! Только http модуль',
        'Content-Type: application/json'
      ],
      hint: 'В http.createServer разберите req.url и req.method для роутинга. Для чтения тела POST запроса: собирайте chunks через "data" событие, парсьте в "end". Всегда устанавливайте Content-Type заголовок в ответе.',
      expectedOutput: 'GET /todos -> 200 []\nPOST /todos с body {"title":"Задача"} -> 201 { id: 1, title: "Задача" }\nGET /todos/1 -> 200 { id: 1, title: "Задача" }\nGET /unknown -> 404 { error: "Не найдено" }\nСервер слушает на порту 3000',
      solution: {
        code: 'const http = require("http");\nconst { URL } = require("url");\n\nlet tasks = [\n  { id: 1, title: "Изучить Node.js", done: false }\n];\nlet nextId = 2;\n\nasync function parseBody(req) {\n  return new Promise((resolve, reject) => {\n    let data = "";\n    req.on("data", chunk => data += chunk);\n    req.on("end", () => {\n      try { resolve(JSON.parse(data || "{}")); }\n      catch { reject(new Error("Невалидный JSON")); }\n    });\n  });\n}\n\nfunction sendJSON(res, data, status = 200) {\n  res.writeHead(status, { "Content-Type": "application/json" });\n  res.end(JSON.stringify(data));\n}\n\nconst server = http.createServer(async (req, res) => {\n  const url = new URL(req.url, `http://localhost`);\n  const pathname = url.pathname;\n\n  try {\n    if (req.method === "GET" && pathname === "/tasks") {\n      return sendJSON(res, { data: tasks });\n    }\n\n    if (req.method === "POST" && pathname === "/tasks") {\n      const body = await parseBody(req);\n      if (!body.title) return sendJSON(res, { error: "title обязателен" }, 400);\n      const task = { id: nextId++, title: body.title, done: false };\n      tasks.push(task);\n      return sendJSON(res, task, 201);\n    }\n\n    const deleteMatch = pathname.match(/^\\/tasks\\/(\\d+)$/);\n    if (req.method === "DELETE" && deleteMatch) {\n      const id = parseInt(deleteMatch[1]);\n      const idx = tasks.findIndex(t => t.id === id);\n      if (idx === -1) return sendJSON(res, { error: "Не найдено" }, 404);\n      tasks.splice(idx, 1);\n      res.writeHead(204); res.end();\n      return;\n    }\n\n    sendJSON(res, { error: "Не найдено" }, 404);\n  } catch (err) {\n    sendJSON(res, { error: err.message }, 500);\n  }\n});\n\nserver.listen(3000, () => console.log("Сервер на :3000"));',
        language: 'javascript'
      },
      explanation: 'Нативный http модуль: каждый запрос — поток данных (stream). parseBody собирает чанки через события "data" и "end". new URL() безопасно парсит URL включая query-параметры. sendJSON — вспомогательная функция исключает дублирование заголовков. Роутинг вручную: проверяем method и pathname. Regex для DELETE/:id извлекает числовой ID из пути. Это понимание помогает оценить что делает Express "под капотом".'
    },
    {
      id: 3,
      title: 'Обработчик CSV файлов',
      type: 'practice',
      difficulty: 'medium',
      description: 'CLI инструмент для анализа CSV файлов. Читает файл построчно через streams, вычисляет статистику по числовым колонкам.',
      requirements: [
        'Читать большой CSV через stream (не fs.readFileSync)',
        'Парсинг заголовков из первой строки',
        'Статистика: min, max, avg, count для числовых колонок',
        'Результат вывести как таблицу',
        'node analyze.js data.csv'
      ],
      hint: 'readline.createInterface({ input: fs.createReadStream(file) }) читает файл построчно. Первую строку используйте как заголовки. Для числовых колонок вычислите min, max, avg через накопление значений.',
      expectedOutput: 'Обработан файл: data.csv (50000 строк)\nКолонка "age": min=18, max=80, avg=34.5\nКолонка "salary": min=50000, max=500000, avg=125000\nОбработка без загрузки всего файла в память',
      solution: {
        code: 'const fs = require("fs");\nconst readline = require("readline");\nconst path = require("path");\n\nasync function analyzeCSV(filePath) {\n  const rl = readline.createInterface({\n    input: fs.createReadStream(filePath),\n    crlfDelay: Infinity\n  });\n\n  let headers = null;\n  const stats = {};\n\n  for await (const line of rl) {\n    if (!line.trim()) continue;\n    const values = line.split(",").map(v => v.trim());\n\n    if (!headers) {\n      headers = values;\n      headers.forEach(h => {\n        stats[h] = { count: 0, sum: 0, min: Infinity, max: -Infinity, isNumeric: true };\n      });\n      continue;\n    }\n\n    values.forEach((val, i) => {\n      const col = headers[i];\n      if (!col) return;\n      const num = parseFloat(val);\n      if (isNaN(num)) {\n        stats[col].isNumeric = false;\n      } else {\n        stats[col].count++;\n        stats[col].sum += num;\n        stats[col].min = Math.min(stats[col].min, num);\n        stats[col].max = Math.max(stats[col].max, num);\n      }\n    });\n  }\n\n  console.log("\\nСтатистика CSV:", path.basename(filePath));\n  console.log("-".repeat(60));\n  for (const [col, s] of Object.entries(stats)) {\n    if (s.isNumeric && s.count > 0) {\n      console.log(`${col.padEnd(20)} min:${s.min} max:${s.max} avg:${(s.sum/s.count).toFixed(2)} count:${s.count}`);\n    } else {\n      console.log(`${col.padEnd(20)} [строковая колонка]`);\n    }\n  }\n}\n\n// node analyze.js data.csv\nconst file = process.argv[2] || "data.csv";\nanalyzeCSV(file).catch(console.error);',
        language: 'javascript'
      },
      explanation: 'readline.createInterface с fs.createReadStream читает файл построчно — не загружает весь файл в память. Это критично для больших файлов (гигабайты). crlfDelay: Infinity корректно обрабатывает Windows line endings (CRLF). for await...of по rl — асинхронный итератор строк. Первая строка — заголовки, создаём stats объект. isNumeric флаг: если хоть одно значение не число — колонка строковая. avg вычисляется как sum/count в конце.'
    },
    {
      id: 4,
      title: 'Мини веб-скрейпер',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте инструмент для скачивания страниц и извлечения данных. Скачать страницу через https, парсинг заголовков и ссылок.',
      requirements: [
        'fetchPage(url) — скачать HTML через https модуль',
        'parseTitle(html) — извлечь title через regex',
        'parseLinks(html, baseUrl) — извлечь все ссылки',
        'Следовать редиректам (301, 302)',
        'User-Agent заголовок'
      ],
      hint: 'Используйте https.get() с callback. Собирайте chunks в массив, в end событии объедините через Buffer.concat(). Для парсинга заголовков используйте регулярное выражение /<h[1-6][^>]*>([^<]+)<\/h/g.',
      expectedOutput: 'scrape("https://example.com") -> { title: "Example Domain", headings: [...], links: [...] }\nСкачано 1256 байт\nНайдено заголовков: 3\nНайдено ссылок: 5',
      solution: {
        code: 'const https = require("https");\nconst http = require("http");\nconst { URL } = require("url");\n\nfunction fetchPage(url, maxRedirects = 5) {\n  return new Promise((resolve, reject) => {\n    if (maxRedirects <= 0) return reject(new Error("Слишком много редиректов"));\n\n    const parsedUrl = new URL(url);\n    const lib = parsedUrl.protocol === "https:" ? https : http;\n\n    const options = {\n      hostname: parsedUrl.hostname,\n      path: parsedUrl.pathname + parsedUrl.search,\n      headers: { "User-Agent": "Mozilla/5.0 (NodeJS Scraper)" }\n    };\n\n    lib.get(options, (res) => {\n      if (res.statusCode === 301 || res.statusCode === 302) {\n        return resolve(fetchPage(res.headers.location, maxRedirects - 1));\n      }\n\n      let data = "";\n      res.on("data", chunk => data += chunk);\n      res.on("end", () => resolve(data));\n    }).on("error", reject);\n  });\n}\n\nconst parseTitle = (html) => {\n  const match = html.match(/<title[^>]*>([^<]+)<\\/title>/i);\n  return match ? match[1].trim() : "Нет заголовка";\n};\n\nconst parseLinks = (html, baseUrl) => {\n  const regex = /href=[\\"\'](https?:\\/\\/[^\\"\'>]+)[\\"\']/gi;\n  const links = new Set();\n  let match;\n  while ((match = regex.exec(html)) !== null) {\n    try { links.add(new URL(match[1]).href); } catch {}\n  }\n  return [...links];\n};\n\nasync function scrape(url) {\n  console.log("Загружаю:", url);\n  const html = await fetchPage(url);\n  const title = parseTitle(html);\n  const links = parseLinks(html, url);\n  console.log("Заголовок:", title);\n  console.log(`Найдено ${links.length} ссылок`);\n  return { url, title, links: links.slice(0, 10) };\n}\n\n// Тест\nscrape("https://example.com").then(console.log).catch(console.error);',
        language: 'javascript'
      },
      explanation: 'https/http модули в Node.js — низкоуровневые, работают со стримами. lib.get выбирается динамически по протоколу URL. Рекурсия для редиректов: 301/302 ответ содержит Location заголовок — вызываем fetchPage повторно с уменьшенным счётчиком. maxRedirects предотвращает бесконечные редиректы. Регекс для ссылок с Set — дедупликация. try/catch внутри while — невалидные URL молча пропускаются. User-Agent важен — многие сайты блокируют запросы без него.'
    },
    {
      id: 5,
      title: 'CLI инструмент',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте CLI инструмент todo-cli: управление задачами из командной строки с хранением в JSON файле.',
      requirements: [
        'node todo.js add "Изучить Node.js"',
        'node todo.js list — показать все задачи',
        'node todo.js done 1 — отметить как выполненную',
        'node todo.js delete 1 — удалить задачу',
        'Хранить в ~/.todo.json'
      ],
      hint: 'process.argv[2] — первый аргумент команды. Храните задачи в JSON файле через fs.readFileSync/writeFileSync. При отсутствии файла создавайте с пустым массивом. Форматируйте вывод таблицей через padEnd.',
      expectedOutput: 'node todo.js add "Купить молоко" -> Добавлено: "Купить молоко" [id: 1]\nnode todo.js list -> [ ] 1. Купить молоко\nnode todo.js done 1 -> [x] 1. Купить молоко\nnode todo.js remove 1 -> Удалено: "Купить молоко"',
      solution: {
        code: '#!/usr/bin/env node\nconst fs = require("fs");\nconst path = require("path");\nconst os = require("os");\n\nconst FILE = path.join(os.homedir(), ".todo.json");\n\nfunction load() {\n  try {\n    return JSON.parse(fs.readFileSync(FILE, "utf8"));\n  } catch {\n    return [];\n  }\n}\n\nfunction save(todos) {\n  fs.writeFileSync(FILE, JSON.stringify(todos, null, 2));\n}\n\nconst [,, cmd, ...args] = process.argv;\n\nswitch (cmd) {\n  case "add": {\n    const todos = load();\n    const title = args.join(" ");\n    if (!title) { console.error("Укажите название задачи"); process.exit(1); }\n    const todo = { id: Date.now(), title, done: false, createdAt: new Date().toISOString() };\n    todos.push(todo);\n    save(todos);\n    console.log(`Добавлено: [${todo.id}] ${todo.title}`);\n    break;\n  }\n\n  case "list": {\n    const todos = load();\n    if (!todos.length) { console.log("Задач нет!"); break; }\n    todos.forEach(t => {\n      console.log(`${t.done ? "\\u2713" : "\\u25CB"} [${t.id}] ${t.title}`);\n    });\n    console.log(`\\nВсего: ${todos.length}, выполнено: ${todos.filter(t => t.done).length}`);\n    break;\n  }\n\n  case "done": {\n    const todos = load();\n    const id = Number(args[0]);\n    const todo = todos.find(t => t.id === id);\n    if (!todo) { console.error(`Задача ${id} не найдена`); process.exit(1); }\n    todo.done = true;\n    save(todos);\n    console.log(`Выполнено: ${todo.title}`);\n    break;\n  }\n\n  case "delete": {\n    const todos = load();\n    const id = Number(args[0]);\n    const idx = todos.findIndex(t => t.id === id);\n    if (idx === -1) { console.error(`Задача ${id} не найдена`); process.exit(1); }\n    const [deleted] = todos.splice(idx, 1);\n    save(todos);\n    console.log(`Удалено: ${deleted.title}`);\n    break;\n  }\n\n  default:\n    console.log("Использование: todo.js <add|list|done|delete> [args]");\n}',
        language: 'javascript'
      },
      explanation: 'process.argv содержит аргументы командной строки: [0] — node, [1] — файл скрипта, [2+] — пользовательские аргументы. Деструктуризация [,, cmd, ...args] пропускает первые два. os.homedir() + path.join — кросс-платформенный путь к домашней директории. Date.now() как ID — простой уникальный числовой идентификатор. args.join(" ") собирает аргументы в строку — поддерживает названия с пробелами. process.exit(1) — выход с кодом ошибки, что важно для скриптов в CI/CD.'
    },
    {
      id: 6,
      title: 'Наблюдатель за файлами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте FileWatcher: следит за папкой и выполняет действия при изменениях. Debounce для группировки множественных изменений.',
      requirements: [
        'watch(dir, callback) — следить за изменениями рекурсивно',
        'Событие: { type: "created"|"modified"|"deleted", path }',
        'Debounce: группировать события за 300ms',
        'Игнорировать node_modules и .git',
        'Остановить через watcher.close()'
      ],
      hint: 'fs.watch() или fs.watchFile() для слежения. Debounce: при каждом событии сбрасывайте setTimeout и устанавливайте новый. Определите тип события: renamed (добавлен/удалён) или changed (изменён).',
      expectedOutput: 'FileWatcher запущен для папки "./src"\nИзменён: src/index.js -> вызван callback\nДобавлен: src/new.js -> вызван callback\nУдалён: src/old.js -> вызван callback\nМножественные изменения за 100мс группируются в одно событие',
      solution: {
        code: 'const fs = require("fs");\nconst path = require("path");\n\nfunction debounce(fn, delay) {\n  const timers = new Map();\n  return function(key, ...args) {\n    clearTimeout(timers.get(key));\n    timers.set(key, setTimeout(() => {\n      fn(key, ...args);\n      timers.delete(key);\n    }, delay));\n  };\n}\n\nfunction watch(dir, callback, ignore = ["node_modules", ".git"]) {\n  const watchers = [];\n  const fileStates = new Map();\n\n  const debouncedCallback = debounce((filePath, event) => {\n    callback(event);\n  }, 300);\n\n  function watchDir(currentDir) {\n    const watcher = fs.watch(currentDir, { recursive: false }, (event, filename) => {\n      if (!filename) return;\n      if (ignore.some(i => filename.includes(i))) return;\n\n      const fullPath = path.join(currentDir, filename);\n\n      fs.stat(fullPath, (err, stats) => {\n        if (err) {\n          // Файл удалён\n          debouncedCallback(fullPath, { type: "deleted", path: fullPath });\n          fileStates.delete(fullPath);\n        } else {\n          const prevMtime = fileStates.get(fullPath);\n          const type = prevMtime ? "modified" : "created";\n          fileStates.set(fullPath, stats.mtimeMs);\n          debouncedCallback(fullPath, { type, path: fullPath, size: stats.size });\n        }\n      });\n    });\n    watchers.push(watcher);\n  }\n\n  watchDir(dir);\n\n  console.log(`Слежу за: ${dir}`);\n  return {\n    close: () => {\n      watchers.forEach(w => w.close());\n      console.log("Остановлено");\n    }\n  };\n}\n\n// Использование\nconst watcher = watch("./src", (event) => {\n  console.log(`[${event.type.toUpperCase()}] ${event.path}`);\n});\n\nprocess.on("SIGINT", () => { watcher.close(); process.exit(0); });',
        language: 'javascript'
      },
      explanation: 'fs.watch уведомляет об изменениях в директории, но имеет проблему: одно реальное изменение может вызвать несколько событий подряд. Debounce с Map по ключу файла группирует события за 300ms. Обнаружение типа изменения: если после события fs.stat возвращает ошибку — файл удалён; если файл уже был в fileStates — модифицирован; иначе — создан. SIGINT обработчик — graceful shutdown при Ctrl+C. Паттерн "возвращать объект с close()" — стандарт для ресурсов требующих очистки.'
    },
    {
      id: 7,
      title: 'Простой прокси сервер',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте HTTP прокси сервер: принимает запросы, проксирует их на target сервер, добавляет заголовки и логирует.',
      requirements: [
        'Проксирует все HTTP методы',
        'Добавляет заголовки: X-Forwarded-For, X-Proxy-Time',
        'Логирует: метод, URL, статус, время',
        'Поддержка query параметров и тела запроса'
      ],
      hint: 'В http.createServer используйте http.request() для проксирования. Скопируйте headers из входящего запроса. Добавьте заголовки X-Forwarded-For и X-Proxy-Time. Передавайте тело через pipe.',
      expectedOutput: 'Прокси запущен на порту 8080\nGET http://localhost:8080/api/data -> проксируется на http://target:3000/api/data\nДобавлен заголовок X-Forwarded-For\nВремя проксирования: ~5мс\nОтвет от target сервера передан клиенту',
      solution: {
        code: 'const http = require("http");\nconst https = require("https");\nconst { URL } = require("url");\n\nfunction createProxy(targetUrl) {\n  const target = new URL(targetUrl);\n  const lib = target.protocol === "https:" ? https : http;\n\n  return http.createServer((req, res) => {\n    const startTime = Date.now();\n\n    const options = {\n      hostname: target.hostname,\n      port: target.port || (target.protocol === "https:" ? 443 : 80),\n      path: req.url,\n      method: req.method,\n      headers: {\n        ...req.headers,\n        host: target.hostname,\n        "x-forwarded-for": req.socket.remoteAddress,\n        "x-forwarded-proto": "http"\n      }\n    };\n\n    const proxyReq = lib.request(options, (proxyRes) => {\n      const duration = Date.now() - startTime;\n      console.log(`${req.method} ${req.url} -> ${proxyRes.statusCode} (${duration}ms)`);\n\n      res.writeHead(proxyRes.statusCode, {\n        ...proxyRes.headers,\n        "x-proxy-time": `${duration}ms`\n      });\n\n      proxyRes.pipe(res);\n    });\n\n    proxyReq.on("error", (err) => {\n      console.error("Ошибка проксирования:", err.message);\n      res.writeHead(502);\n      res.end("Bad Gateway");\n    });\n\n    req.pipe(proxyReq);\n  });\n}\n\nconst proxy = createProxy("http://httpbin.org");\nproxy.listen(8080, () => console.log("Прокси на :8080 -> httpbin.org"));',
        language: 'javascript'
      },
      explanation: 'Прокси сервер: получает запрос, пересылает его на target, возвращает ответ клиенту. Ключевой момент — req.pipe(proxyReq) и proxyRes.pipe(res): стримы передают данные без буферизации всего тела в памяти. X-Forwarded-For заголовок передаёт оригинальный IP клиента. host заголовок переопределяется на целевой хост — иначе сервер не поймёт для кого запрос. 502 Bad Gateway — стандартный HTTP статус для ошибок прокси.'
    },
    {
      id: 8,
      title: 'Конфигурационный загрузчик',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте ConfigLoader: загружает конфигурацию из нескольких источников с приоритетом: defaults < config.json < .env < process.env.',
      requirements: [
        'Загрузка из файла config.json',
        'Загрузка из .env файла (вручную без dotenv)',
        'Переменные окружения имеют наибольший приоритет',
        'Типизация: булевы, числа, строки',
        'config.get("database.host") — путь через точку'
      ],
      hint: 'Загружайте источники в порядке приоритета: defaults -> config.json -> .env -> process.env. Каждый следующий перезаписывает предыдущий через Object.assign. Для .env парсьте формат KEY=VALUE построчно.',
      expectedOutput: 'ConfigLoader.load() -> { PORT: "4000", DB_URL: "mongodb://...", DEBUG: "true" }\nprocess.env.PORT="4000" перезаписывает config.json PORT="3000"\nОтсутствующий config.json -> предупреждение, продолжение\nВалидация: обязательные поля DB_URL, PORT присутствуют',
      solution: {
        code: 'const fs = require("fs");\nconst path = require("path");\n\nclass ConfigLoader {\n  constructor(defaults = {}) {\n    this.config = {};\n    this.load(defaults);\n  }\n\n  load(values) {\n    this._merge(this.config, values);\n    return this;\n  }\n\n  loadFile(filePath) {\n    try {\n      const content = fs.readFileSync(filePath, "utf8");\n      const data = filePath.endsWith(".env") ? this._parseEnv(content) : JSON.parse(content);\n      this._merge(this.config, data);\n    } catch (err) {\n      if (err.code !== "ENOENT") console.warn(`Не удалось загрузить ${filePath}:`, err.message);\n    }\n    return this;\n  }\n\n  loadEnv(prefix = "") {\n    const envVars = {};\n    Object.keys(process.env).forEach(key => {\n      if (!prefix || key.startsWith(prefix)) {\n        const configKey = (prefix ? key.slice(prefix.length + 1) : key).toLowerCase();\n        envVars[configKey] = this._castValue(process.env[key]);\n      }\n    });\n    this._merge(this.config, envVars);\n    return this;\n  }\n\n  get(keyPath, defaultVal = null) {\n    const keys = keyPath.split(".");\n    let current = this.config;\n    for (const key of keys) {\n      if (current == null || typeof current !== "object") return defaultVal;\n      current = current[key];\n    }\n    return current ?? defaultVal;\n  }\n\n  _parseEnv(content) {\n    return Object.fromEntries(\n      content.split("\\n")\n        .filter(line => line && !line.startsWith("#"))\n        .map(line => line.split("=").map(s => s.trim()))\n        .filter(([k]) => k)\n        .map(([k, v]) => [k.toLowerCase(), this._castValue(v)])\n    );\n  }\n\n  _castValue(v) {\n    if (v === "true") return true;\n    if (v === "false") return false;\n    if (!isNaN(v) && v !== "") return Number(v);\n    return v;\n  }\n\n  _merge(target, source) {\n    Object.assign(target, source);\n  }\n}\n\nconst config = new ConfigLoader({ port: 3000, debug: false })\n  .loadFile("config.json")\n  .loadFile(".env")\n  .loadEnv("APP");\n\nconsole.log("Порт:", config.get("port"));\nconsole.log("Debug:", config.get("debug"));\nconsole.log("DB:", config.get("database.host", "localhost"));',
        language: 'javascript'
      },
      explanation: 'Каскадная конфигурация: каждый следующий источник перезаписывает предыдущий. Приоритет: defaults < файл < env. Чейн методов (return this) — fluent API, делает код читаемым. ENOENT — код ошибки "файл не найден", это нормально — просто нет файла. _castValue типизирует строки из env: "true" -> true, "42" -> 42. get() с путём через точку позволяет читать вложенные конфиги. ?? defaultVal использует nullish coalescing — возвращает дефолт только для null/undefined, не для 0 или "".'
    },
    {
      id: 9,
      title: 'WebSocket сервер',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте минимальный WebSocket сервер на нативном Node.js (без ws библиотеки). Реализуйте handshake и framing протокол.',
      requirements: [
        'TCP сервер через net модуль',
        'HTTP Upgrade handshake с SHA-1 + base64',
        'Парсинг WebSocket frame (opcode, payload)',
        'Отправка и получение текстовых сообщений',
        'Ping/Pong для keepalive'
      ],
      hint: 'WebSocket handshake: прочитайте Sec-WebSocket-Key, добавьте "258EAFA5-E914-47DA-95CA-C5AB0DC85B11", sha1 хэш, base64 encode. Фреймы: первый байт — opcode, второй байт — mask+length.',
      expectedOutput: 'WebSocket сервер запущен на порту 8080\nКлиент подключился -> handshake выполнен\nКлиент отправил "ping" -> сервер ответил "pong"\nСервер broadcast "hello" -> получено всеми подключёнными клиентами\nКлиент отключился -> соединение закрыто',
      solution: {
        code: 'const net = require("net");\nconst crypto = require("crypto");\n\nconst WS_MAGIC = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";\n\nfunction createWsHandshake(key) {\n  const accept = crypto.createHash("sha1")\n    .update(key + WS_MAGIC)\n    .digest("base64");\n  return [\n    "HTTP/1.1 101 Switching Protocols",\n    "Upgrade: websocket",\n    "Connection: Upgrade",\n    `Sec-WebSocket-Accept: ${accept}`,\n    "", ""\n  ].join("\\r\\n");\n}\n\nfunction parseFrame(buffer) {\n  const firstByte = buffer[0];\n  const opcode = firstByte & 0x0f;\n  const masked = !!(buffer[1] & 0x80);\n  let payloadLen = buffer[1] & 0x7f;\n  let offset = 2;\n  if (payloadLen === 126) { payloadLen = buffer.readUInt16BE(2); offset = 4; }\n  const maskStart = offset;\n  const payloadStart = masked ? offset + 4 : offset;\n  const payload = buffer.slice(payloadStart, payloadStart + payloadLen);\n  if (masked) {\n    const mask = buffer.slice(maskStart, maskStart + 4);\n    for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i % 4];\n  }\n  return { opcode, payload };\n}\n\nfunction buildFrame(text) {\n  const payload = Buffer.from(text);\n  const header = payload.length < 126\n    ? Buffer.from([0x81, payload.length])\n    : Buffer.from([0x81, 126, payload.length >> 8, payload.length & 255]);\n  return Buffer.concat([header, payload]);\n}\n\nconst server = net.createServer(socket => {\n  let upgraded = false;\n\n  socket.on("data", data => {\n    if (!upgraded) {\n      const headers = data.toString();\n      const keyMatch = headers.match(/Sec-WebSocket-Key: (.+)/);\n      if (!keyMatch) return socket.destroy();\n      socket.write(createWsHandshake(keyMatch[1].trim()));\n      upgraded = true;\n      console.log("WebSocket подключён");\n      socket.write(buildFrame("Привет от WebSocket сервера!"));\n      return;\n    }\n    const { opcode, payload } = parseFrame(data);\n    if (opcode === 1) { // Text\n      const message = payload.toString();\n      console.log("Получено:", message);\n      socket.write(buildFrame(`Echo: ${message}`));\n    }\n    if (opcode === 8) socket.destroy(); // Close\n  });\n\n  socket.on("close", () => console.log("Отключился"));\n});\n\nserver.listen(8080, () => console.log("WS сервер на :8080"));',
        language: 'javascript'
      },
      explanation: 'WebSocket — бинарный протокол поверх TCP. Handshake: клиент шлёт HTTP Upgrade запрос с Sec-WebSocket-Key. Сервер вычисляет SHA-1 хэш от key + magic string и возвращает base64 в Sec-WebSocket-Accept. Это предотвращает случайные WebSocket подключения. Framing: каждый фрейм имеет заголовок с opcode (1=text, 8=close), маской и длиной. Клиентские фреймы всегда маскированы — XOR с 4-байтной маской. Сервер отвечает немаскированными фреймами.'
    },
    {
      id: 10,
      title: 'Планировщик задач',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте Scheduler: запускает задачи по расписанию (cron-like). Поддерживает интервалы в секундах, минутах, конкретное время.',
      requirements: [
        'scheduler.every("5m", taskFn) — каждые 5 минут',
        'scheduler.at("14:30", taskFn) — в конкретное время',
        'scheduler.cron("0 * * * *", taskFn) — базовый cron',
        'Логирование выполнения',
        'Graceful shutdown: дождаться текущих задач'
      ],
      hint: 'Используйте setInterval для периодических задач. Храните задачи в массиве с nextRun временем. Главный цикл каждую секунду проверяет какие задачи пора запустить. Cron-подобный синтаксис: парсьте строку "*/5 * * * *".',
      expectedOutput: 'scheduler.every(5, "seconds", () => console.log("tick")) -> запускается каждые 5с\nscheduler.at("09:00", dailyReport) -> запускается в 9:00 каждый день\nscheduler.cron("0 * * * *", hourlyTask) -> каждый час\nscheduler.stop() -> все задачи остановлены',
      solution: {
        code: 'class Scheduler {\n  constructor() {\n    this.jobs = [];\n    this.timers = new Set();\n    this.running = new Set();\n  }\n\n  every(interval, fn, name = "job") {\n    const ms = this._parseInterval(interval);\n    const timer = setInterval(async () => {\n      console.log(`[${new Date().toISOString()}] Запуск: ${name}`);\n      const promise = Promise.resolve(fn()).catch(err =>\n        console.error(`Ошибка в ${name}:`, err.message)\n      );\n      this.running.add(promise);\n      promise.finally(() => this.running.delete(promise));\n    }, ms);\n    this.timers.add(timer);\n    this.jobs.push({ type: "interval", interval, name });\n    console.log(`Задача "${name}" каждые ${interval}`);\n    return this;\n  }\n\n  at(time, fn, name = "job") {\n    const schedule = () => {\n      const now = new Date();\n      const [hours, minutes] = time.split(":").map(Number);\n      const next = new Date();\n      next.setHours(hours, minutes, 0, 0);\n      if (next <= now) next.setDate(next.getDate() + 1);\n      const delay = next - now;\n      const timer = setTimeout(async () => {\n        console.log(`[${new Date().toISOString()}] Запуск по расписанию: ${name}`);\n        await fn();\n        schedule(); // Перепланировать на завтра\n      }, delay);\n      this.timers.add(timer);\n    };\n    schedule();\n    console.log(`Задача "${name}" в ${time}`);\n    return this;\n  }\n\n  _parseInterval(str) {\n    const units = { s: 1000, m: 60000, h: 3600000 };\n    const match = str.match(/(\\d+)([smh])/);\n    if (!match) throw new Error(`Неверный интервал: ${str}`);\n    return parseInt(match[1]) * units[match[2]];\n  }\n\n  async stop() {\n    this.timers.forEach(t => clearTimeout(t) || clearInterval(t));\n    await Promise.allSettled([...this.running]);\n    console.log("Планировщик остановлен");\n  }\n}\n\nconst scheduler = new Scheduler();\nscheduler.every("2s", () => console.log("Пинг!"), "ping");\nscheduler.every("10s", async () => { await cleanupOldRecords(); }, "cleanup");\n\nprocess.on("SIGINT", async () => { await scheduler.stop(); process.exit(0); });',
        language: 'javascript'
      },
      explanation: 'every() использует setInterval с парсингом человекочитаемых интервалов ("5m" -> 300000ms). Хранение промисов в this.running позволяет graceful shutdown: stop() ждёт завершения всех текущих задач. at() вычисляет миллисекунды до следующего запуска и рекурсивно перепланирует после выполнения — имитирует daily cron. clearTimeout и clearInterval взаимозаменяемы для timers — Set хранит все. Promise.allSettled в stop() — не падает если задача завершилась с ошибкой.'
    }
  ]
};
