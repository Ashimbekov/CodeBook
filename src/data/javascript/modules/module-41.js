export default {
  id: 41,
  title: 'Streams в Node.js',
  description: 'Потоки данных в Node.js: Readable, Writable, Transform, Duplex, метод pipe и обработка больших файлов без загрузки в память',
  lessons: [
    {
      id: 1,
      title: 'Что такое Streams',
      type: 'theory',
      content: [
        { type: 'text', value: 'Streams — абстракция для работы с последовательностью данных. Вместо загрузки всего файла в память, данные обрабатываются частями (chunks). Идеально для больших файлов, HTTP, stdin/stdout.' },
        { type: 'heading', value: 'Типы потоков' },
        { type: 'code', language: 'javascript', value: 'const fs = require("fs");\n\n// БЕЗ streams — всё в памяти\nconst data = fs.readFileSync("large-file.txt", "utf8"); // Загружает весь файл!\nconsole.log(data);\n// Проблема: для файла 1GB нужно 1GB RAM\n\n// СО streams — чанки\nconst stream = fs.createReadStream("large-file.txt", { encoding: "utf8" });\nstream.on("data", (chunk) => {\n  console.log("Получен чанк:", chunk.length, "байт");\n  // Обрабатываем по 64KB за раз\n});\nstream.on("end", () => console.log("Файл прочитан"));\nstream.on("error", (err) => console.error("Ошибка:", err));\n\n// Четыре типа потоков:\n// Readable — источник данных (fs.createReadStream, http.IncomingMessage)\n// Writable — приёмник данных (fs.createWriteStream, http.ServerResponse)\n// Duplex — и чтение и запись (net.Socket, TCP соединение)\n// Transform — преобразование данных (zlib.createGzip, crypto.createCipher)' },
        { type: 'tip', value: 'Streams реализуют EventEmitter. Основные события: "data" (чанк), "end" (завершение), "error" (ошибка), "close" (поток закрыт), "drain" (буфер освободился).' }
      ]
    },
    {
      id: 2,
      title: 'Readable Streams',
      type: 'theory',
      content: [
        { type: 'text', value: 'Readable stream — источник данных. Два режима: paused (данные накапливаются в буфере, читаем явно) и flowing (данные автоматически испускаются через событие "data").' },
        { type: 'heading', value: 'Создание и чтение потока' },
        { type: 'code', language: 'javascript', value: 'const { Readable } = require("stream");\nconst fs = require("fs");\n\n// Чтение файла\nconst readable = fs.createReadStream("data.txt", {\n  encoding: "utf8",\n  highWaterMark: 64 * 1024 // Размер чанка: 64KB\n});\n\n// Режим flowing — события data\nreadable.on("data", (chunk) => process.stdout.write(chunk));\nreadable.on("end", () => console.log("\\nГотово"));\n\n// Режим paused — явное чтение\nreadable.pause();\nreadable.on("readable", () => {\n  let chunk;\n  while ((chunk = readable.read(1024)) !== null) {\n    process.stdout.write(chunk);\n  }\n});\n\n// Создание кастомного Readable\nconst { Readable } = require("stream");\n\nclass NumberStream extends Readable {\n  constructor(max) {\n    super({ objectMode: true }); // objectMode — любые объекты, не только Buffer/string\n    this.current = 1;\n    this.max = max;\n  }\n\n  _read() {\n    if (this.current <= this.max) {\n      this.push(this.current++); // Передаём данные\n    } else {\n      this.push(null); // null — конец потока\n    }\n  }\n}\n\n// Использование\nconst nums = new NumberStream(5);\nnums.on("data", n => console.log(n)); // 1, 2, 3, 4, 5\n\n// Readable из массива\nconst from = Readable.from([1, 2, 3, 4, 5]);\nfor await (const item of from) {\n  console.log(item);\n}' }
      ]
    },
    {
      id: 3,
      title: 'Writable Streams',
      type: 'theory',
      content: [
        { type: 'text', value: 'Writable stream — приёмник данных. Метод write() записывает чанк, end() сигнализирует о конце. Если буфер полон (backpressure), write() возвращает false.' },
        { type: 'heading', value: 'Запись в поток' },
        { type: 'code', language: 'javascript', value: 'const { Writable } = require("stream");\nconst fs = require("fs");\n\n// Запись в файл\nconst writable = fs.createWriteStream("output.txt");\nwritable.write("Первая строка\\n");\nwritable.write("Вторая строка\\n");\nwritable.end("Последняя строка\\n", () => {\n  console.log("Запись завершена");\n});\nwritable.on("finish", () => console.log("Поток закрыт"));\n\n// Backpressure — управление потоком\nconst source = fs.createReadStream("large.txt");\nconst dest = fs.createWriteStream("copy.txt");\n\nsource.on("data", (chunk) => {\n  const canContinue = dest.write(chunk);\n  if (!canContinue) {\n    source.pause(); // Останавливаем чтение\n    dest.once("drain", () => source.resume()); // Возобновляем когда буфер опустел\n  }\n});\nsource.on("end", () => dest.end());\n\n// Кастомный Writable\nclass LogStream extends Writable {\n  constructor() {\n    super({ decodeStrings: false }); // Не декодировать Buffer в string\n  }\n\n  _write(chunk, encoding, callback) {\n    // Здесь обрабатываем чанк\n    console.log(`[${new Date().toISOString()}] ${chunk}`);\n    callback(); // ОБЯЗАТЕЛЬНО вызвать callback!\n    // callback(new Error("...")) — для передачи ошибки\n  }\n}\n\nconst logger = new LogStream();\nlogger.write("Событие 1");\nlogger.write("Событие 2");' }
      ]
    },
    {
      id: 4,
      title: 'Transform Streams',
      type: 'theory',
      content: [
        { type: 'text', value: 'Transform stream — одновременно Readable и Writable. Принимает данные, преобразует их и выдаёт. Примеры: сжатие, шифрование, парсинг CSV, преобразование регистра.' },
        { type: 'heading', value: 'Создание Transform потока' },
        { type: 'code', language: 'javascript', value: 'const { Transform } = require("stream");\nconst zlib = require("zlib");\nconst crypto = require("crypto");\nconst fs = require("fs");\n\n// Кастомный Transform — преобразование в верхний регистр\nclass UpperCaseTransform extends Transform {\n  _transform(chunk, encoding, callback) {\n    this.push(chunk.toString().toUpperCase()); // Передаём преобразованные данные\n    callback();\n  }\n}\n\nconst upper = new UpperCaseTransform();\nupper.write("hello world");\nupper.on("data", d => console.log(d.toString())); // "HELLO WORLD"\n\n// Transform для CSV парсинга\nclass CSVParser extends Transform {\n  constructor() {\n    super({ objectMode: true });\n    this.buffer = "";\n    this.headers = null;\n  }\n\n  _transform(chunk, encoding, callback) {\n    this.buffer += chunk.toString();\n    const lines = this.buffer.split("\\n");\n    this.buffer = lines.pop(); // Неполная строка\n\n    lines.forEach(line => {\n      if (!this.headers) {\n        this.headers = line.split(",").map(h => h.trim());\n      } else if (line) {\n        const values = line.split(",").map(v => v.trim());\n        const obj = {};\n        this.headers.forEach((h, i) => obj[h] = values[i]);\n        this.push(obj); // Испускаем объект\n      }\n    });\n    callback();\n  }\n}\n\n// Встроенные Transform: zlib для сжатия\n// Сжать файл\nfs.createReadStream("data.txt")\n  .pipe(zlib.createGzip())\n  .pipe(fs.createWriteStream("data.txt.gz"));' }
      ]
    },
    {
      id: 5,
      title: 'pipe и pipeline',
      type: 'theory',
      content: [
        { type: 'text', value: 'pipe() соединяет потоки в цепочку, автоматически обрабатывая backpressure. pipeline() (Node 10+) — улучшенная версия с обработкой ошибок и промисами.' },
        { type: 'heading', value: 'Цепочки потоков' },
        { type: 'code', language: 'javascript', value: 'const fs = require("fs");\nconst zlib = require("zlib");\nconst crypto = require("crypto");\nconst { pipeline } = require("stream/promises");\n\n// pipe — базовый способ\nfs.createReadStream("input.txt")\n  .pipe(zlib.createGzip())       // Сжатие\n  .pipe(fs.createWriteStream("output.txt.gz"));\n\n// Проблема pipe: ошибки не распространяются автоматически\n// Если gzip бросит ошибку, writeStream останется открытым!\n\n// pipeline — безопасный способ (Node 10+)\nasync function compressFile(input, output) {\n  await pipeline(\n    fs.createReadStream(input),\n    zlib.createGzip(),\n    fs.createWriteStream(output)\n  );\n  console.log("Сжатие завершено");\n}\n\n// Сжатие + шифрование\nasync function encryptCompress(input, output, password) {\n  const key = crypto.scryptSync(password, "salt", 32);\n  const iv = crypto.randomBytes(16);\n\n  await pipeline(\n    fs.createReadStream(input),\n    zlib.createGzip(),\n    crypto.createCipheriv("aes-256-cbc", key, iv),\n    fs.createWriteStream(output)\n  );\n}\n\n// pipeline с async generator\nasync function* processLines(source) {\n  let buffer = "";\n  for await (const chunk of source) {\n    buffer += chunk;\n    const lines = buffer.split("\\n");\n    buffer = lines.pop();\n    for (const line of lines) {\n      yield line.toUpperCase() + "\\n";\n    }\n  }\n  if (buffer) yield buffer.toUpperCase();\n}\n\nawait pipeline(\n  fs.createReadStream("input.txt"),\n  processLines,\n  fs.createWriteStream("output.txt")\n);' },
        { type: 'tip', value: 'Всегда используйте pipeline() вместо pipe() для продакшн кода. Он правильно обрабатывает ошибки и закрывает все потоки в цепочке при ошибке.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Обработчик файлов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте утилиту для обработки больших CSV файлов с использованием Transform streams: парсинг, фильтрация и запись результата.',
      requirements: [
        'Читайте CSV файл строками через Readable stream',
        'Создайте CSVParserTransform — парсит строки в объекты',
        'Создайте FilterTransform — фильтрует записи по условию',
        'Создайте CSVStringifyTransform — объекты обратно в CSV строки',
        'Запишите результат в новый файл через Writable stream',
        'Используйте pipeline() для безопасного соединения'
      ],
      solution: {
        code: 'const { Transform } = require("stream");\nconst { pipeline } = require("stream/promises");\nconst fs = require("fs");\n\nclass CSVParser extends Transform {\n  constructor() {\n    super({ objectMode: true });\n    this.buffer = "";\n    this.headers = null;\n  }\n  _transform(chunk, enc, cb) {\n    this.buffer += chunk.toString();\n    const lines = this.buffer.split("\\n");\n    this.buffer = lines.pop();\n    for (const line of lines) {\n      if (!this.headers) { this.headers = line.split(",").map(h => h.trim()); }\n      else if (line.trim()) {\n        const vals = line.split(",").map(v => v.trim());\n        const obj = {};\n        this.headers.forEach((h, i) => obj[h] = vals[i]);\n        this.push(obj);\n      }\n    }\n    cb();\n  }\n  _flush(cb) {\n    if (this.buffer.trim() && this.headers) {\n      const vals = this.buffer.split(",").map(v => v.trim());\n      const obj = {};\n      this.headers.forEach((h, i) => obj[h] = vals[i]);\n      this.push(obj);\n    }\n    cb();\n  }\n}\n\nclass FilterTransform extends Transform {\n  constructor(predicate) {\n    super({ objectMode: true });\n    this.predicate = predicate;\n  }\n  _transform(obj, enc, cb) {\n    if (this.predicate(obj)) this.push(obj);\n    cb();\n  }\n}\n\nclass CSVStringify extends Transform {\n  constructor() {\n    super({ objectMode: true });\n    this.firstRow = true;\n  }\n  _transform(obj, enc, cb) {\n    if (this.firstRow) {\n      this.push(Object.keys(obj).join(",") + "\\n");\n      this.firstRow = false;\n    }\n    this.push(Object.values(obj).join(",") + "\\n");\n    cb();\n  }\n}\n\nasync function processCSV(input, output, filter) {\n  await pipeline(\n    fs.createReadStream(input),\n    new CSVParser(),\n    new FilterTransform(filter),\n    new CSVStringify(),\n    fs.createWriteStream(output)\n  );\n  console.log("Обработка завершена");\n}\n\n// Использование: фильтровать строки где age > 18\nprocessCSV("users.csv", "adults.csv", row => parseInt(row.age) > 18);',
        language: 'javascript'
      }
    }
  ]
};
