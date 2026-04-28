export default {
  id: 11,
  title: 'Безопасность веб-приложений',
  description: 'CORS, CSP, security headers, cookie security, subresource integrity и комплексная защита веб-приложений.',
  lessons: [
    {
      id: 1,
      title: 'CORS: Cross-Origin Resource Sharing',
      type: 'theory',
      content: [
        { type: 'text', value: 'CORS — механизм браузера, контролирующий доступ к ресурсам с другого домена (origin). Неправильная настройка CORS — распространённая уязвимость, позволяющая злоумышленным сайтам отправлять запросы от имени пользователя.' },
        { type: 'code', language: 'javascript', value: '// === Как работает CORS ===\n// Origin = scheme + hostname + port\n// https://app.example.com:443\n\n// Браузер блокирует cross-origin запросы по умолчанию\n// fetch("https://api.other.com/data") — заблокирован без CORS!\n\n// === ОПАСНЫЕ конфигурации ===\n\n// ПЛОХО: разрешить всем\napp.use(cors({ origin: "*" }));\n// Любой сайт может отправлять запросы к вашему API!\n\n// ЕЩЁ ХУЖЕ: отражение Origin заголовка\napp.use((req, res, next) => {\n  res.setHeader("Access-Control-Allow-Origin", req.headers.origin);\n  res.setHeader("Access-Control-Allow-Credentials", "true");\n  // Любой сайт получает доступ + cookies отправляются!\n});\n\n// === БЕЗОПАСНАЯ конфигурация ===\nconst allowedOrigins = [\n  "https://app.example.com",\n  "https://admin.example.com"\n];\n\napp.use(cors({\n  origin: (origin, callback) => {\n    // Разрешаем запросы без Origin (server-to-server)\n    if (!origin) return callback(null, true);\n    if (allowedOrigins.includes(origin)) {\n      callback(null, true);\n    } else {\n      callback(new Error("Not allowed by CORS"));\n    }\n  },\n  credentials: true,\n  methods: ["GET", "POST", "PUT", "DELETE"],\n  allowedHeaders: ["Content-Type", "Authorization"],\n  maxAge: 86400  // Кэш preflight на 24 часа\n}));' },
        { type: 'warning', value: 'Никогда не используйте Access-Control-Allow-Origin: * с Access-Control-Allow-Credentials: true. Это позволяет любому сайту отправлять авторизованные запросы. Всегда используйте whitelist конкретных origins.' }
      ]
    },
    {
      id: 2,
      title: 'Cookie Security',
      type: 'theory',
      content: [
        { type: 'text', value: 'Cookies — основной механизм хранения сессий и токенов в браузере. Неправильная настройка cookie приводит к краже сессий, CSRF, XSS. Каждый флаг cookie защищает от определённого класса атак.' },
        { type: 'code', language: 'javascript', value: '// === Безопасные cookie ===\nres.cookie("session", sessionId, {\n  httpOnly: true,      // Недоступна из JavaScript (защита от XSS)\n  secure: true,        // Только через HTTPS\n  sameSite: "Lax",     // Защита от CSRF\n  maxAge: 30 * 60 * 1000,  // 30 минут\n  path: "/",           // Доступна на всём сайте\n  domain: ".example.com",  // Включая поддомены\n});\n\n// === Флаги cookie ===\n// HttpOnly  — cookie недоступна через document.cookie\n//   Защита от: XSS кража cookies\n//   document.cookie НЕ покажет HttpOnly cookies\n\n// Secure    — cookie отправляется только по HTTPS\n//   Защита от: перехват через HTTP (MITM)\n\n// SameSite  — контроль отправки при cross-site запросах\n//   Strict: не отправлять при переходе с другого сайта\n//   Lax: отправлять при GET навигации, не при POST\n//   None: отправлять всегда (требует Secure)\n//   Защита от: CSRF\n\n// === Cookie Prefix (дополнительная защита) ===\n// __Host-   — Secure + Path=/ + без Domain (самый строгий)\nres.cookie("__Host-session", value, {\n  secure: true, path: "/", httpOnly: true, sameSite: "Lax"\n});\n\n// __Secure- — требует Secure флаг\nres.cookie("__Secure-token", value, {\n  secure: true, httpOnly: true\n});' },
        { type: 'tip', value: 'Используйте __Host- префикс для session cookies — он гарантирует Secure + Path=/ и не может быть установлен с поддомена. Это самый строгий вариант cookie.' }
      ]
    },
    {
      id: 3,
      title: 'Subresource Integrity (SRI)',
      type: 'theory',
      content: [
        { type: 'text', value: 'SRI позволяет браузеру проверять, что загруженный с CDN ресурс (скрипт, стиль) не был изменён. Если хэш не совпадает — ресурс не выполняется. Защита от компрометации CDN.' },
        { type: 'code', language: 'bash', value: '# Генерация SRI хэша\nopenssl dgst -sha384 -binary jquery-3.7.1.min.js | openssl base64 -A\n# sha384-abc123def456...\n\n# Или с помощью shasum\ncat jquery-3.7.1.min.js | openssl dgst -sha384 -binary | base64' },
        { type: 'code', language: 'javascript', value: '// === SRI в HTML ===\n// <script\n//   src="https://cdn.example.com/jquery-3.7.1.min.js"\n//   integrity="sha384-abc123def456ghi789..."\n//   crossorigin="anonymous"\n// ></script>\n\n// Если CDN скомпрометирован и файл изменён — браузер\n// НЕ выполнит скрипт, потому что хэш не совпадёт!\n\n// === SRI для CSS ===\n// <link\n//   rel="stylesheet"\n//   href="https://cdn.example.com/bootstrap.min.css"\n//   integrity="sha384-xyz789..."\n//   crossorigin="anonymous"\n// />\n\n// === Автоматизация SRI в webpack ===\n// npm install webpack-subresource-integrity\nconst SriPlugin = require("webpack-subresource-integrity");\nmodule.exports = {\n  output: { crossOriginLoading: "anonymous" },\n  plugins: [\n    new SriPlugin({\n      hashFuncNames: ["sha384"],\n      enabled: process.env.NODE_ENV === "production"\n    })\n  ]\n};\n\n// === Пример атаки Polyfill.io (2024) ===\n// Миллионы сайтов использовали:\n// <script src="https://cdn.polyfill.io/v3/polyfill.min.js"></script>\n// Новый владелец домена подменил скрипт на вредоносный!\n// SRI предотвратил бы эту атаку для сайтов, где он был настроен.' },
        { type: 'tip', value: 'Используйте SRI для всех внешних скриптов и стилей (CDN). Лучше: self-host критичные библиотеки. Генерируйте SRI автоматически в процессе сборки (webpack, vite plugins).' }
      ]
    },
    {
      id: 4,
      title: 'Безопасность форм и загрузки файлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Загрузка файлов — частый вектор атак. Уязвимости: загрузка веб-шеллов, path traversal, MIME-type confusion, oversized files, zip bombs. Каждый загруженный файл — потенциальная угроза.' },
        { type: 'code', language: 'python', value: 'import os\nimport uuid\nimport magic  # python-magic для определения типа файла\nfrom pathlib import Path\n\n# === Безопасная загрузка файлов ===\n\nALLOWED_EXTENSIONS = {\".jpg\", \".jpeg\", \".png\", \".gif\", \".pdf\"}\nALLOWED_MIMES = {\"image/jpeg\", \"image/png\", \"image/gif\", \"application/pdf\"}\nMAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB\nUPLOAD_DIR = Path(\"/var/uploads\")\n\ndef validate_and_save_upload(file) -> str:\n    """Безопасная валидация и сохранение загруженного файла"""\n    \n    # 1. Проверка размера\n    file.seek(0, os.SEEK_END)\n    size = file.tell()\n    file.seek(0)\n    if size > MAX_FILE_SIZE:\n        raise ValueError(f\"Файл слишком большой: {size} > {MAX_FILE_SIZE}\")\n    \n    # 2. Проверка расширения\n    original_name = file.filename\n    ext = Path(original_name).suffix.lower()\n    if ext not in ALLOWED_EXTENSIONS:\n        raise ValueError(f\"Недопустимое расширение: {ext}\")\n    \n    # 3. Проверка MIME-типа по содержимому (НЕ по заголовку!)\n    content = file.read(2048)\n    file.seek(0)\n    mime_type = magic.from_buffer(content, mime=True)\n    if mime_type not in ALLOWED_MIMES:\n        raise ValueError(f\"Недопустимый тип файла: {mime_type}\")\n    \n    # 4. Генерация безопасного имени (НЕ используем оригинальное!)\n    safe_name = f\"{uuid.uuid4().hex}{ext}\"\n    \n    # 5. Защита от path traversal\n    save_path = UPLOAD_DIR / safe_name\n    if not save_path.resolve().is_relative_to(UPLOAD_DIR.resolve()):\n        raise ValueError(\"Path traversal detected!\")\n    \n    # 6. Сохранение\n    with open(save_path, \"wb\") as f:\n        while chunk := file.read(8192):\n            f.write(chunk)\n    \n    return safe_name\n\n# 7. Отдача файлов: НИКОГДА не выполнять загруженные файлы!\n# Nginx: location /uploads/ { internal; }  # Нет прямого доступа\n# Используйте X-Accel-Redirect через приложение' },
        { type: 'warning', value: 'Никогда не доверяйте Content-Type заголовку — он легко подделывается. Проверяйте MIME по содержимому файла (magic bytes). Не храните файлы в webroot. Генерируйте случайные имена. Для изображений — пережимайте через Pillow/Sharp (удаляет вредоносные метаданные).' }
      ]
    },
    {
      id: 5,
      title: 'Защита от DoS и ресурсоёмких операций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Веб-приложения уязвимы к DoS через ресурсоёмкие операции: сложные regex (ReDoS), большие JSON payload, тяжёлые SQL запросы, загрузка огромных файлов, zip bombs.' },
        { type: 'code', language: 'javascript', value: '// === ReDoS (Regular Expression DoS) ===\n// Некоторые regex имеют экспоненциальную сложность!\n\n// ОПАСНО: катастрофический backtracking\nconst badRegex = /^(a+)+$/;\n// "aaaaaaaaaaaaaaaaaaaaaaaaaaaaab".match(badRegex)\n// Выполнение: МИЛЛИОНЫ шагов (зависание сервера!)\n\n// БЕЗОПАСНО: используйте safe-regex или re2\nconst safeRegex = /^a+$/;\n// Или используйте RE2 (без backtracking)\nconst RE2 = require("re2");\nconst pattern = new RE2("^(a+)+$");\n\n// === Защита от больших payload ===\nconst express = require("express");\nconst app = express();\n\n// Ограничение размера JSON body\napp.use(express.json({ limit: "10kb" })); // Максимум 10 КБ!\n\n// Ограничение URL-encoded\napp.use(express.urlencoded({ limit: "10kb\", extended: false }));\n\n// === Timeout для запросов ===\nconst timeout = require("connect-timeout");\napp.use(timeout("10s\")); // 10 секунд максимум\napp.use((req, res, next) => {\n  if (!req.timedout) next();\n});\n\n// === Защита от zip bombs ===\nconst yauzl = require("yauzl");\n\nfunction safeUnzip(zipPath, maxSize = 100 * 1024 * 1024) {\n  let totalSize = 0;\n  yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {\n    zipfile.readEntry();\n    zipfile.on(\"entry\", (entry) => {\n      totalSize += entry.uncompressedSize;\n      if (totalSize > maxSize) {\n        throw new Error(\"Zip bomb detected!\");\n      }\n      // Обработка файла...\n      zipfile.readEntry();\n    });\n  });\n}' },
        { type: 'tip', value: 'Основные защиты от DoS: ограничение размера payload (10KB для JSON), timeout запросов (10-30 сек), rate limiting, безопасные regex (RE2), ограничение размера распакованных файлов.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Комплексная защита веб-приложения',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте полную защиту веб-приложения: CORS, cookie security, SRI, upload validation, CSP и DoS protection.',
      requirements: [
        'Настройте CORS с whitelist origins и credentials',
        'Настройте безопасные cookie с HttpOnly, Secure, SameSite, __Host- prefix',
        'Добавьте SRI для внешних скриптов и стилей',
        'Реализуйте безопасную загрузку файлов с проверкой MIME и размера',
        'Добавьте защиту от DoS: body limit, timeout, ReDoS prevention'
      ],
      hint: 'Используйте cors middleware с whitelist, cookie flags, webpack SRI plugin, python-magic для MIME, express json limit.',
      expectedOutput: 'CORS: только https://app.example.com разрешён, credentials: true\nCookies: __Host-session, HttpOnly, Secure, SameSite=Lax\nSRI: все CDN скрипты с integrity атрибутом\nUpload: .jpg/.png до 5MB, MIME проверка по содержимому, UUID имена\nDoS: JSON limit 10KB, timeout 10s, RE2 для regex',
      solution: 'const express = require("express");\nconst helmet = require("helmet");\nconst cors = require("cors");\nconst timeout = require("connect-timeout");\n\nconst app = express();\n\n// Security headers\napp.use(helmet());\n\n// CORS whitelist\napp.use(cors({\n  origin: ["https://app.example.com"],\n  credentials: true,\n  methods: ["GET", "POST", "PUT", "DELETE"]\n}));\n\n// Body limits\napp.use(express.json({ limit: "10kb" }));\napp.use(express.urlencoded({ limit: "10kb", extended: false }));\n\n// Request timeout\napp.use(timeout("10s"));\n\n// Secure cookie\napp.post("/login", (req, res) => {\n  res.cookie("__Host-session", sessionId, {\n    httpOnly: true,\n    secure: true,\n    sameSite: "Lax\",\n    maxAge: 30 * 60 * 1000,\n    path: "/\"\n  });\n});\n\n// File upload validation\nconst multer = require("multer");\nconst upload = multer({\n  limits: { fileSize: 5 * 1024 * 1024 },\n  fileFilter: (req, file, cb) => {\n    const allowed = ["image/jpeg", "image/png", "image/gif"];\n    if (allowed.includes(file.mimetype)) cb(null, true);\n    else cb(new Error("Invalid file type"));\n  }\n});\n\napp.post("/upload", upload.single("file"), (req, res) => {\n  // Additional MIME check with file-type library\n  res.json({ filename: req.file.filename });\n});\n\napp.listen(3000);',
      explanation: 'Комплексная защита веб-приложения — это набор настроек, работающих вместе: CORS ограничивает cross-origin доступ, cookie flags защищают сессии, SRI проверяет целостность внешних ресурсов, upload validation блокирует вредоносные файлы, body/timeout limits предотвращают DoS.'
    }
  ]
}
