export default {
  id: 35,
  title: 'Практикум: Перевод и локализация',
  description: 'Практика перевода технических текстов: документация, интерфейсы, сообщения об ошибках',
  lessons: [
    {
      id: 1,
      title: 'Практика: Перевод технической документации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Переведите технический текст с сохранением смысла и стиля.',
      requirements: ['Сохраните технические термины', 'Адаптируйте стиль к целевой аудитории', 'Не переводите дословно'],
      questions: [
        { text: 'Translate this technical requirement into clear Russian for a business stakeholder:\n"The system MUST implement rate limiting on all public API endpoints. Requests exceeding the limit will receive a 429 Too Many Requests response with a Retry-After header indicating when the client may retry."', answer: 'Система должна ограничивать количество запросов ко всем публичным API-эндпоинтам. Если клиент превысит разрешённое количество запросов, сервер вернёт ответ об ошибке (код 429 — "Слишком много запросов"), в котором будет указано, через какое время можно повторить попытку.\n\nЭто защищает систему от перегрузки и обеспечивает равномерное распределение нагрузки между всеми пользователями.', explanation: 'Technical translation for business: preserve meaning, explain "why" that was implicit in the original, avoid raw HTTP codes without explanation.' }
      ],
      hint: 'For business stakeholders: explain what happens in user-facing terms, add the "why" if not stated, avoid unexplained technical acronyms.',
      solution: 'Правильные ответы:\n1. Ключевые элементы: объяснение rate limiting простыми словами, код 429 с расшифровкой, RetryAfter переведён как "через какое время повторить", добавлено зачем (защита от перегрузки).',
      explanation: 'Technical translation for non-technical stakeholders requires explaining the "why" and avoiding unexplained jargon while preserving the essential meaning.'
    },
    {
      id: 2,
      title: 'Практика: Локализация UI-текстов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Локализуйте UI-сообщения для русскоязычной аудитории.',
      requirements: ['Естественный русский язык', 'Соответствующий тон (формальный/неформальный)', 'Учёт ограничений длины'],
      questions: [
        { text: 'Localise these UI strings from English to Russian. Consider tone (the app is a B2B SaaS platform):\n1. "Your account has been suspended. Contact support."\n2. "Great job! You\'ve completed all tasks for today."\n3. "Are you sure you want to delete this project? This action cannot be undone."', answer: '1. "Ваш аккаунт заблокирован. Обратитесь в службу поддержки." (нейтральный тон, без обвинений)\n\n2. "Отлично! Вы выполнили все задачи на сегодня." (сохраняем позитивный тон, естественный русский)\n\n3. "Вы уверены, что хотите удалить этот проект? Это действие нельзя отменить." (прямой перевод, сохраняем предупреждающий характер)', explanation: 'UI localisation: match the tone of the original (formal B2B), keep strings concise, ensure the meaning is unambiguous.' }
      ],
      hint: 'B2B SaaS: formal "Вы/Ваш" (not "ты"). Preserve warning tone for destructive actions. Error messages: neutral, not blaming.',
      solution: 'Правильные ответы:\n1. "Ваш аккаунт заблокирован. Обратитесь в службу поддержки."\n2. "Отлично! Вы выполнили все задачи на сегодня."\n3. "Вы уверены, что хотите удалить этот проект? Это действие нельзя отменить."',
      explanation: 'UI localisation preserves tone and meaning. B2B platforms use formal "Вы". Warning messages must retain their cautionary emphasis in translation.'
    },
    {
      id: 3,
      title: 'Практика: Перевод сообщений об ошибках',
      type: 'practice',
      difficulty: 'medium',
      description: 'Переведите и улучшите сообщения об ошибках.',
      requirements: ['Ясный, неагрессивный тон', 'Объясните что случилось', 'Предложите следующий шаг'],
      questions: [
        { text: 'Improve and translate these error messages:\n1. "Error 500: Internal server error"\n2. "Invalid credentials"\n3. "Request timeout"', answer: '1. Original (bad): "Error 500: Internal server error"\nImproved English: "Something went wrong on our end. We\'ve been notified and are working on it. Please try again in a few minutes."\nRussian: "На нашей стороне произошла ошибка. Мы уже работаем над её устранением. Пожалуйста, попробуйте ещё раз через несколько минут."\n\n2. Original (bad): "Invalid credentials"\nImproved English: "The email address or password you entered is incorrect. Please check and try again."\nRussian: "Введённый адрес электронной почты или пароль неверны. Проверьте данные и попробуйте снова."\n\n3. Original (bad): "Request timeout"\nImproved English: "The operation took too long to complete. Please check your connection and try again."\nRussian: "Операция заняла слишком много времени. Проверьте подключение к интернету и попробуйте снова."', explanation: 'Good error messages: explain what happened in plain language, avoid technical codes, suggest the next action, use non-blaming tone.' }
      ],
      hint: 'Error message formula: 1) What happened (plain language). 2) Why (if helpful). 3) What to do next. Avoid blaming the user.',
      solution: 'Правильные ответы:\n1. 500 → "На нашей стороне произошла ошибка. Попробуйте через несколько минут."\n2. Invalid credentials → "Неверный email или пароль. Проверьте и попробуйте снова."\n3. Timeout → "Операция заняла слишком много времени. Проверьте подключение."',
      explanation: 'Error messages are a critical UX touch point. Good ones reduce support tickets; bad ones frustrate users and erode trust.'
    },
    {
      id: 4,
      title: 'Практика: Адаптация технического контента для разных аудиторий',
      type: 'practice',
      difficulty: 'hard',
      description: 'Адаптируйте один технический текст для трёх разных аудиторий.',
      requirements: ['Одна тема, три версии', 'Разный уровень технических деталей', 'Соответствующий тон и словарь'],
      questions: [
        { text: 'Write three versions of an explanation of "database indexing" for:\n1. A junior developer\n2. A non-technical product manager\n3. An experienced DBA reviewing your design', answer: '1. JUNIOR DEVELOPER: "A database index is like the index at the back of a book. Without it, the database scans every row to find your data (full table scan). With an index, it goes directly to the right rows. Always add indexes on columns you filter on frequently (WHERE clause) or join on. Trade-off: indexes speed up reads but slow down writes slightly because the index must be updated."\\n\\n2. NON-TECHNICAL PM: "An index makes database searches much faster — like having a well-organised filing system versus searching through every document. When users search or filter data in the app, indexes let us find results in milliseconds instead of seconds. The cost is a small amount of extra storage and slightly slower data updates — usually a worthwhile trade-off."\\n\\n3. EXPERIENCED DBA: "I\'ve added a composite index on (user_id, created_at DESC) on the events table to support the primary query pattern. Considered a partial index filtering on status=\'active\', but given the high cardinality (~85% active records), the full composite index has better all-round selectivity. Watch for index bloat on the high-write events table — may need periodic REINDEX."', explanation: 'Audience adaptation: junior needs concept + rule; PM needs business impact + trade-off; DBA needs technical specifics + reasoning.' }
      ],
      hint: 'For each audience ask: What do they already know? What decision do they need to make? What level of detail serves them?',
      solution: 'Правильные ответы:\n1. Junior dev: book index analogy + WHERE/JOIN rule + write trade-off.\n2. PM: filing system analogy + business impact (ms vs seconds) + storage/write trade-off.\n3. DBA: specific index type, columns, alternatives considered, maintenance concern.',
      explanation: 'Adapting technical communication to the audience is a core professional skill. The same information means different things to different people.'
    },
    {
      id: 5,
      title: 'Практика: Перевод commit messages и PR-описаний',
      type: 'practice',
      difficulty: 'easy',
      description: 'Переведите технические git-сообщения и создайте их на английском.',
      requirements: ['Следуйте Conventional Commits формату', 'Описательные, конкретные сообщения', 'Правильный английский'],
      questions: [
        { text: 'Translate these Russian commit messages to professional English using Conventional Commits format:\n1. "починил баг с авторизацией"\n2. "добавил кэширование для запросов к бд"\n3. "рефакторинг модуля платежей"', answer: '1. fix(auth): resolve token validation failure on concurrent requests\n\n2. perf(database): add Redis caching layer to reduce query latency\n  - Caches user profile queries with 5-minute TTL\n  - Reduces average DB query time from 120ms to 8ms\n\n3. refactor(payments): extract payment processor into dedicated service\n  - Separate PaymentService class with single responsibility\n  - No functional changes, improves testability', explanation: 'Conventional Commits: type(scope): description. Body explains what and why, not how. Use imperative mood ("add" not "added").' }
      ],
      hint: 'Conventional Commits format: type(scope): short description. Types: feat, fix, docs, style, refactor, perf, test, chore. Imperative mood.',
      solution: 'Правильные ответы:\n1. fix(auth): resolve token validation failure on concurrent requests\n2. perf(database): add Redis caching layer to reduce query latency\n3. refactor(payments): extract payment processor into dedicated service',
      explanation: 'Professional commit messages tell the story of your codebase. They are valuable documentation and improve collaboration in international teams.'
    },
    {
      id: 6,
      title: 'Практика: Технический глоссарий',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте двуязычный глоссарий терминов для проекта.',
      requirements: ['Краткое определение на English', 'Русский термин/эквивалент', 'Пример использования'],
      questions: [
        { text: 'Create glossary entries for these terms used in your project:\n1. Idempotent\n2. Backpressure\n3. Circuit breaker\n4. Canary deployment', answer: '1. IDEMPOTENT (идемпотентный)\nDefinition: An operation that produces the same result regardless of how many times it is executed.\nExample: "Making the delete endpoint idempotent means calling it multiple times won\'t cause errors — if the resource is already gone, return 200 or 204, not 404."\n\n2. BACKPRESSURE (противодавление)\nDefinition: A mechanism where a downstream consumer signals to an upstream producer to slow down when it cannot keep up.\nExample: "We implemented backpressure in the Kafka consumer — when the processing queue exceeds 1,000 items, it pauses consumption to avoid OOM."\n\n3. CIRCUIT BREAKER (автоматический выключатель)\nDefinition: A pattern that detects failures and prevents an application from repeatedly trying to execute an operation that is likely to fail.\nExample: "The circuit breaker opens after 5 consecutive failures and stops forwarding requests for 30 seconds."\n\n4. CANARY DEPLOYMENT (канареечный деплой)\nDefinition: A technique of rolling out changes to a small subset of users before releasing to everyone.\nExample: "We roll out to 5% of users as a canary — if error rates stay below 0.1%, we proceed to full rollout."', explanation: 'A team glossary ensures consistent terminology and helps onboard new engineers faster.' }
      ],
      hint: 'Glossary entry: term + Russian equivalent + one-sentence definition + usage example in context.',
      solution: 'Правильные ответы:\n1. Idempotent: same result regardless of repetition. Example: DELETE is idempotent.\n2. Backpressure: downstream signals upstream to slow. Example: Kafka consumer pauses at 1,000 items.\n3. Circuit breaker: stops requests to failing service. Opens after 5 failures, reset after 30s.\n4. Canary deployment: roll out to 5% first, check errors, then full rollout.',
      explanation: 'Shared glossaries prevent miscommunication between engineers who may have different backgrounds and native languages.'
    },
    {
      id: 7,
      title: 'Практика: Перевод README на английский',
      type: 'practice',
      difficulty: 'medium',
      description: 'Переведите русскоязычный README на профессиональный английский.',
      requirements: ['Сохраните всю техническую информацию', 'Используйте стандартный README формат', 'Естественный английский, не дословный перевод'],
      questions: [
        { text: 'Translate this README section to professional English:\n\n"## Установка\nТребования: Node.js 18+ и PostgreSQL 14+.\nКлонируйте репозиторий, запустите npm install для установки зависимостей.\nСкопируйте файл .env.example в .env и заполните переменные окружения.\nЗапустите npm run db:migrate для применения миграций базы данных.\nПосле этого запустите npm start для старта сервера."', answer: '## Installation\n\n**Requirements**: Node.js 18 or higher and PostgreSQL 14 or higher.\n\n1. Clone the repository\n2. Install dependencies: `npm install`\n3. Copy the environment configuration: `cp .env.example .env` and fill in the required values\n4. Apply database migrations: `npm run db:migrate`\n5. Start the server: `npm start`', explanation: 'README translation: use numbered steps for sequences, add actual commands in code format, restructure for clarity if needed.' }
      ],
      hint: 'README conventions: numbered steps for sequential actions, code blocks for commands, bold for requirements.',
      solution: 'Правильные ответы:\n1. Professional English README with: numbered steps, inline commands in backticks, bold requirements, cp command made explicit.',
      explanation: 'A well-written English README makes your project accessible to the global developer community. Code in backticks and numbered steps are standard conventions.'
    },
    {
      id: 8,
      title: 'Практика: Локализация email-шаблонов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Переведите и адаптируйте системные email для русскоязычных пользователей.',
      requirements: ['Подходящий уровень формальности', 'Сохранение переменных шаблона', 'Культурно адаптированный тон'],
      questions: [
        { text: 'Translate and improve this transactional email:\n"Hi {{user_name}},\n\nYour password was reset. If you didn\'t request this, contact us immediately.\n\nThe {{app_name}} Team"', answer: 'Тема: Ваш пароль был изменён — {{app_name}}\n\nЗдравствуйте, {{user_name}},\n\nВаш пароль в сервисе {{app_name}} был успешно изменён {{reset_date}} в {{reset_time}} UTC.\n\nЕсли вы не запрашивали изменение пароля, немедленно заблокируйте аккаунт и обратитесь в нашу службу поддержки по адресу support@{{app_domain}}.\n\nС уважением,\nКоманда {{app_name}}', explanation: 'Transactional email improvements: add subject line, include timestamp (when?), provide specific contact channel, use appropriate formal greeting and closing.' }
      ],
      hint: 'Transactional emails: add subject line (critical for open rates), include relevant timestamp, give specific action steps, use "Здравствуйте" not "Привет" for formal services.',
      solution: 'Правильные ответы:\n1. Improved elements: subject line added, timestamp included, specific support email provided, formal greeting "Здравствуйте", professional closing "С уважением".',
      explanation: 'Transactional emails are security-critical. Always include: what changed, when, and what to do if it wasn\'t you. This reduces both fraud risk and support tickets.'
    },
    {
      id: 9,
      title: 'Практика: Перевод технического блог-поста',
      type: 'practice',
      difficulty: 'hard',
      description: 'Переведите введение технической статьи, сохранив стиль и смысл.',
      requirements: ['Сохраните авторский голос', 'Адаптируйте идиомы (не дословно)', 'Технические термины оставьте на English'],
      questions: [
        { text: 'Translate to Russian, preserving style and readability:\n"Three months ago, our on-call rotation was a nightmare. Every Friday deployment would trigger a wave of alerts. The team was burning out. Something had to change.\n\nThis post is about how we went from 47 incidents per month to 3, using observability tooling that took us less than a sprint to implement."', answer: 'Три месяца назад дежурство в нашей команде было настоящим кошмаром. Каждый деплой по пятницам вызывал шквал алертов. Команда выгорала. Что-то нужно было менять.\n\nЭта статья о том, как мы сократили количество инцидентов с 47 в месяц до 3 — с помощью инструментов observability, на внедрение которых у нас ушло меньше одного спринта.', explanation: 'Good translation preserves the conversational tone, doesn\'t translate "sprint", "observability", "on-call rotation" literally, and maintains the narrative tension.' }
      ],
      hint: 'Don\'t translate tech terms (sprint, deployment, alert, observability). Adapt idioms naturally ("nightmare" → "кошмар" works here). Preserve the punchy, direct writing style.',
      solution: 'Правильные ответы:\n1. Key choices: "nightmare" → "кошмар" (natural Russian equivalent), "on-call rotation" → "дежурство", tech terms kept (observability, deployment, sprint, алертов). Tone preserved: direct, personal, narrative.',
      explanation: 'Technical blog translation preserves author voice and technical vocabulary. Adapt idioms naturally rather than literally — what matters is the effect, not the words.'
    },
    {
      id: 10,
      title: 'Финальная практика: Комплексная локализация',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте полный пакет локализации для нового feature release.',
      requirements: [
        'Release notes (100 words)',
        'In-app notification (50 words)',
        'Email announcement (150 words)',
        'Три разных tone and audience'
      ],
      hint: 'Release notes: neutral, factual. In-app: brief, benefit-focused. Email: engaging, more detail.',
      solution: 'RELEASE NOTES:\n## v2.5.0 — Two-Factor Authentication\nTwo-factor authentication (2FA) is now available for all accounts. When enabled, users must verify their identity with a one-time code in addition to their password.\nChanges:\n- New "Security" section in account settings\n- Support for authenticator apps (TOTP) and SMS\n- Recovery codes generated on 2FA setup\n- Admin can enforce 2FA for all team members\n\nIN-APP NOTIFICATION:\nNew: Two-Factor Authentication is now available! Enable it in Settings → Security to add an extra layer of protection to your account. Takes 2 minutes to set up. [Enable 2FA →]\n\nEMAIL ANNOUNCEMENT:\nSubject: Protect your account with Two-Factor Authentication\n\nHi {{name}},\n\nWe\'ve just launched two-factor authentication (2FA) to help keep your {{app_name}} account secure.\n\nWith 2FA enabled, even if your password is compromised, your account remains protected by a second verification step.\n\nSetting it up takes under 2 minutes:\n1. Go to Settings → Security\n2. Click "Enable Two-Factor Authentication"\n3. Scan the QR code with your authenticator app\n\nWe strongly recommend enabling it today.\n\n[Enable 2FA →]\n\nThe {{app_name}} Team',
      explanation: 'Three formats, three tones: release notes (technical, neutral), notification (brief, action-focused), email (persuasive, benefit-first). The same feature communicated differently for each context.'
    }
  ]
}
