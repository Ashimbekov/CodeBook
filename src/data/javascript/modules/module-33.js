export default {
  id: 33,
  title: 'File System (fs)',
  description: 'Модуль fs Node.js: чтение и запись файлов, синхронный и асинхронный API, промисы (fs.promises), директории и потоки (streams).',
  lessons: [
    {
      id: 1,
      title: 'Чтение файлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Модуль fs предоставляет три варианта API: синхронный (блокирует поток), асинхронный через callback, и Promise-based (fs.promises или fs/promises). Для серверного кода — всегда async!' },
        { type: 'code', language: 'javascript', value: 'import fs from "node:fs";\nimport { readFile, writeFile } from "node:fs/promises";\nimport { createReadStream } from "node:fs";\n\n// 1. Синхронный (блокирует!) — только для скриптов\ntry {\n  const data = fs.readFileSync("./data.txt", "utf-8");\n  console.log(data);\n} catch (err) {\n  console.error("Ошибка:", err.message);\n}\n\n// 2. Callback-based (устаревший стиль)\nfs.readFile("./data.txt", "utf-8", (err, data) => {\n  if (err) {\n    console.error("Ошибка:", err.message);\n    return;\n  }\n  console.log(data);\n});\n\n// 3. Promise-based (современный, рекомендуемый!)\nasync function readConfig() {\n  try {\n    const content = await readFile("./config.json", "utf-8");\n    return JSON.parse(content);\n  } catch (err) {\n    console.error("Не удалось прочитать конфиг:", err.message);\n    return null;\n  }\n}\n\nconst config = await readConfig();\nconsole.log(config?.name);' },
        { type: 'tip', value: 'fs.readFile загружает весь файл в память. Для больших файлов (>100МБ) используй потоки (createReadStream). Buffer — если файл бинарный (изображения, PDF). Строка с кодировкой — для текстовых файлов.' }
      ]
    },
    {
      id: 2,
      title: 'Запись файлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'writeFile перезаписывает файл, appendFile добавляет в конец. При записи директория должна существовать иначе ошибка. mkdir создаёт директории.' },
        { type: 'code', language: 'javascript', value: 'import { writeFile, appendFile, mkdir, unlink, rename } from "node:fs/promises";\n\n// Запись файла (перезаписывает если существует)\nawait writeFile("./output.txt", "Привет, мир!\\n", "utf-8");\n\n// Запись объекта как JSON\nconst data = { name: "Алия", age: 25, active: true };\nawait writeFile("./user.json", JSON.stringify(data, null, 2));\n\n// Добавление в конец файла\nawait appendFile("./log.txt", `[${new Date().toISOString()}] Событие\\n`);\n\n// Создание директории\nawait mkdir("./uploads", { recursive: true });\n// recursive: true — не ошибка если уже существует, создаёт вложенные\n\n// Переименование / перемещение\nawait rename("./old-name.txt", "./new-name.txt");\nawait rename("./file.txt", "./archive/file.txt"); // перемещение\n\n// Удаление файла\nawait unlink("./temp.txt");\n\n// Удаление директории\nimport { rm } from "node:fs/promises";\nawait rm("./old-folder", { recursive: true, force: true });\n// force: true — не ошибка если не существует' },
        { type: 'note', value: 'writeFile создаёт файл если не существует, но НЕ создаёт директории. Если директория ./logs не существует — writeFile("./logs/app.log", ...) выбросит ошибку ENOENT. Сначала mkdir с recursive.' }
      ]
    },
    {
      id: 3,
      title: 'Работа с директориями и статистика',
      type: 'theory',
      content: [
        { type: 'text', value: 'readdir читает содержимое директории, stat/lstat возвращают информацию о файле (размер, дата изменения, тип), access проверяет существование/права доступа.' },
        { type: 'code', language: 'javascript', value: 'import { readdir, stat, access } from "node:fs/promises";\nimport { constants } from "node:fs";\nimport path from "node:path";\n\n// Список файлов в директории\nconst files = await readdir("./src");\nconsole.log(files); // ["index.js", "utils.js", "config.json"]\n\n// С опцией withFileTypes — объекты Dirent\nconst entries = await readdir("./src", { withFileTypes: true });\nfor (const entry of entries) {\n  const type = entry.isFile()      ? "файл"\n             : entry.isDirectory() ? "папка"\n             : "другое";\n  console.log(`${type}: ${entry.name}`);\n}\n\n// Статистика файла\nconst stats = await stat("./package.json");\nconsole.log("Размер:", stats.size, "байт");\nconsole.log("Изменён:", stats.mtime.toLocaleString());\nconsole.log("Файл?", stats.isFile());\nconsole.log("Папка?", stats.isDirectory());\n\n// Проверка существования\ntry {\n  await access("./config.json", constants.R_OK);\n  console.log("Файл существует и читаем");\n} catch {\n  console.log("Файл недоступен");\n}' },
        { type: 'code', language: 'javascript', value: '// Рекурсивное получение файлов\nasync function* walkDir(dir) {\n  const entries = await readdir(dir, { withFileTypes: true });\n  for (const entry of entries) {\n    const fullPath = path.join(dir, entry.name);\n    if (entry.isDirectory()) {\n      yield* walkDir(fullPath); // рекурсия!\n    } else {\n      yield fullPath;\n    }\n  }\n}\n\nfor await (const file of walkDir("./src")) {\n  console.log(file);\n}\n// /src/index.js\n// /src/utils/logger.js\n// /src/utils/validator.js' }
      ]
    },
    {
      id: 4,
      title: 'Потоки (Streams)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Потоки (Streams) — чтение/запись больших файлов по чанкам. Не загружают весь файл в память. Типы: Readable, Writable, Transform, Duplex.' },
        { type: 'code', language: 'javascript', value: 'import { createReadStream, createWriteStream } from "node:fs";\nimport { pipeline } from "node:stream/promises";\nimport { createGzip } from "node:zlib";\n\n// Чтение большого файла по чанкам\nconst readStream = createReadStream("./large-file.csv", {\n  encoding: "utf-8",\n  highWaterMark: 64 * 1024 // чанки по 64KB\n});\n\nreadStream.on("data", (chunk) => {\n  console.log("Получили чанк:", chunk.length, "байт");\n});\n\nreadStream.on("end",   () => console.log("Чтение завершено"));\nreadStream.on("error", err => console.error("Ошибка:", err));\n\n// Запись потоком\nconst writeStream = createWriteStream("./output.txt");\nwriteStream.write("Строка 1\\n");\nwriteStream.write("Строка 2\\n");\nwriteStream.end(); // завершить запись\n\n// pipeline — подключение потоков\n// Копирование файла:\nawait pipeline(\n  createReadStream("./input.txt"),\n  createWriteStream("./output.txt")\n);\nconsole.log("Скопировано!");\n\n// Сжатие файла (gzip):\nawait pipeline(\n  createReadStream("./data.csv"),\n  createGzip(),              // Transform поток — сжимает\n  createWriteStream("./data.csv.gz")\n);\nconsole.log("Файл сжат!");' },
        { type: 'tip', value: 'Всегда используй pipeline вместо pipe(). pipeline автоматически обрабатывает ошибки и закрывает потоки при ошибке. pipe() может оставить потоки открытыми при ошибке (утечка ресурсов).' }
      ]
    },
    {
      id: 5,
      title: 'fs.watch — наблюдение за файлами',
      type: 'theory',
      content: [
        { type: 'text', value: 'fs.watch наблюдает за изменениями файлов или директорий. Используется в dev-инструментах (nodemon, hot reload). Нативная реализация от ОС.' },
        { type: 'code', language: 'javascript', value: 'import { watch } from "node:fs";\nimport { watch as watchAsync } from "node:fs/promises";\n\n// Классический API\nconst watcher = watch("./src", { recursive: true }, (event, filename) => {\n  console.log(`Событие: ${event}, файл: ${filename}`);\n  // event: "change" или "rename"\n});\n\n// Остановить наблюдение через 10 секунд\nsetTimeout(() => watcher.close(), 10000);\n\n// Async/await API (Node.js 18+)\nasync function watchDirectory(dir) {\n  const watcher = watchAsync(dir, { recursive: true });\n  console.log(`Наблюдаем за ${dir}...`);\n\n  for await (const event of watcher) {\n    console.log(`${event.eventType}: ${event.filename}`);\n    // Реагируем на изменения\n    if (event.filename.endsWith(".js")) {\n      console.log("JS файл изменился, перезагружаем...");\n    }\n  }\n}\n\nwatchDirectory("./src").catch(console.error);' },
        { type: 'note', value: 'fs.watch работает по-разному на разных ОС: Linux (inotify), macOS (FSEvents), Windows (ReadDirectoryChangesW). Для production использования рекомендуют пакет chokidar — он нивелирует различия.' }
      ]
    },
    {
      id: 6,
      title: 'Практические утилиты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Распространённые задачи при работе с файловой системой: копирование директорий, поиск файлов, чтение конфигов, обработка CSV.' },
        { type: 'code', language: 'javascript', value: 'import { readFile, writeFile, readdir, mkdir, copyFile } from "node:fs/promises";\nimport { join, extname } from "node:path";\n\n// Безопасное чтение JSON конфига\nasync function readJSON(filePath, fallback = {}) {\n  try {\n    const content = await readFile(filePath, "utf-8");\n    return JSON.parse(content);\n  } catch {\n    return fallback;\n  }\n}\n\n// Сохранение JSON\nasync function writeJSON(filePath, data, indent = 2) {\n  await writeFile(filePath, JSON.stringify(data, null, indent), "utf-8");\n}\n\n// Копирование директории\nasync function copyDir(src, dest) {\n  await mkdir(dest, { recursive: true });\n  const entries = await readdir(src, { withFileTypes: true });\n\n  for (const entry of entries) {\n    const srcPath  = join(src, entry.name);\n    const destPath = join(dest, entry.name);\n    if (entry.isDirectory()) {\n      await copyDir(srcPath, destPath);\n    } else {\n      await copyFile(srcPath, destPath);\n    }\n  }\n}\n\n// Поиск файлов по расширению\nasync function findFiles(dir, ext) {\n  const results = [];\n  const entries = await readdir(dir, { withFileTypes: true });\n  for (const entry of entries) {\n    const fullPath = join(dir, entry.name);\n    if (entry.isDirectory()) {\n      results.push(...await findFiles(fullPath, ext));\n    } else if (extname(entry.name) === ext) {\n      results.push(fullPath);\n    }\n  }\n  return results;\n}\n\nconst jsFiles = await findFiles("./src", ".js");\nconsole.log("JS файлы:", jsFiles);' }
      ]
    },
    {
      id: 7,
      title: 'Практика: файловый менеджер',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй набор файловых утилит.',
      requirements: [
        'ensureDir(path) — создать директорию и все промежуточные (аналог mkdir -p)',
        'moveFile(src, dest) — переместить файл создав директорию назначения если нужно',
        'readLines(filePath) — async генератор читающий файл построчно',
        'countWords(filePath) — подсчитать количество слов в текстовом файле'
      ],
      hint: 'readLines: используй readline.createInterface с createReadStream. for await...of по rl получит строки. countWords: split(/\\s+/).filter(Boolean).length.',
      solution: 'import { mkdir, rename, readFile, stat } from "node:fs/promises";\nimport { createReadStream } from "node:fs";\nimport { createInterface } from "node:readline";\nimport { dirname, resolve } from "node:path";\n\nasync function ensureDir(dirPath) {\n  await mkdir(dirPath, { recursive: true });\n  return dirPath;\n}\n\nasync function moveFile(src, dest) {\n  await ensureDir(dirname(dest));\n  try {\n    await rename(src, dest);\n  } catch (err) {\n    if (err.code === "EXDEV") {\n      // Разные файловые системы — копируем + удаляем\n      const { copyFile, unlink } = await import("node:fs/promises");\n      await copyFile(src, dest);\n      await unlink(src);\n    } else {\n      throw err;\n    }\n  }\n}\n\nasync function* readLines(filePath) {\n  const rl = createInterface({\n    input: createReadStream(filePath, { encoding: "utf-8" }),\n    crlfDelay: Infinity\n  });\n  for await (const line of rl) {\n    yield line;\n  }\n}\n\nasync function countWords(filePath) {\n  let wordCount = 0;\n  for await (const line of readLines(filePath)) {\n    const words = line.split(/\\s+/).filter(Boolean);\n    wordCount += words.length;\n  }\n  return wordCount;\n}\n\n// Тест\nawait ensureDir("./test/nested/dir");\nconsole.log("Директория создана");\n\nconst count = await countWords("./README.md").catch(() => 0);\nconsole.log("Слов:", count);\n\nfor await (const line of readLines("./package.json")) {\n  if (line.includes("name")) { console.log(line); break; }\n}',
      explanation: 'ensureDir использует mkdir с recursive:true. moveFile обрабатывает случай EXDEV (cross-device link) — когда src и dest на разных дисках rename не работает, нужно копировать. readLines — async генератор через readline.Interface. countWords использует readLines и считает слова через regex split.'
    }
  ]
}
