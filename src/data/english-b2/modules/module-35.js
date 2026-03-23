export default {
  id: 35,
  title: 'Практикум: Перевод и локализация',
  description: 'Практика перевода технических текстов и локализации IT-продуктов',
  lessons: [
    {
      id: 1,
      title: 'Практика: перевод технического сленга',
      type: 'practice',
      difficulty: 'medium',
      description: 'Переведите IT-сленг на профессиональный английский.',
      requirements: ['Переведите с сленга на формальный английский', 'Объясните контекст использования'],
      questions: [
        { text: 'Translate these informal/slang phrases into professional English suitable for a client email:\n1. "The app was totally FUBAR after the deploy."\n2. "We need to nuke the DB and start fresh."\n3. "The code is spaghetti — no one can grok it."\n4. "We yolo\'d the release without tests."\n5. "The feature is half-baked — it\\'s gonna blow up in prod."', answer: '1. "The application entered an unrecoverable state following the deployment."\n2. "We recommend reinitialising the database from scratch."\n3. "The codebase has become difficult to maintain due to its highly coupled architecture."\n4. "The release was deployed without adequate test coverage."\n5. "The feature is not yet production-ready — there is a significant risk of failure under real-world conditions."', explanation: 'Translation from IT slang to professional English requires understanding the precise technical meaning, not just swapping individual words. The register must match the audience.' }
      ],
      hint: 'FUBAR = completely broken; nuke DB = wipe and recreate; spaghetti/grok = unmaintainable/understand; yolo = without safeguards; half-baked = incomplete.',
      solution: 'Правильные ответы:\n1. "The application entered an unrecoverable state following the deployment."\n2. "We recommend reinitialising the database from scratch."\n3. "The codebase has become difficult to maintain due to its highly coupled architecture."\n4. "The release was deployed without adequate test coverage."\n5. "The feature is not yet production-ready — there is a significant risk of failure under real-world conditions."',
      explanation: 'IT slang translation is a key professional skill. Internal teams use slang for speed; external communication requires precise, professional language that conveys the same meaning without jargon.'
    },
    {
      id: 2,
      title: 'Практика: перевод UI-текстов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Переведите элементы пользовательского интерфейса с учётом локализации.',
      requirements: ['Переведите UI-строки с английского', 'Учитывайте длину строки и контекст', 'Избегайте дословного перевода'],
      questions: [
        { text: 'You are localising a project management SaaS for Russian-speaking users. Translate these UI strings, keeping them concise (similar character count where possible):\n1. "Mark as done" (button)\n2. "You have unsaved changes. Are you sure you want to leave?" (dialog)\n3. "Drag to reorder" (tooltip)\n4. "Something went wrong. Please try again." (error)\n5. "No results found for \'{{query}}\'" (empty state)\n6. "Invite team members" (CTA button)', answer: '1. "Отметить как выполненное" (or shortened: "Выполнено")\n2. "Есть несохранённые изменения. Покинуть страницу?"\n3. "Перетащите для сортировки" (or: "Для изменения порядка перетащите элемент")\n4. "Произошла ошибка. Попробуйте ещё раз."\n5. "По запросу \'{{query}}\' ничего не найдено"\n6. "Пригласить участников"', explanation: 'UI localisation requires balancing accuracy, brevity, and naturalness. Russian strings are often 1.3-1.5x longer than English. Buttons should use infinitive or shortened imperative forms.' }
      ],
      hint: 'UI translation tips: buttons use imperative/infinitive; error messages are polite and action-focused; Russian text expands ~30-40% vs English — plan for truncation.',
      solution: 'Правильные ответы:\n1. "Отметить как выполненное"\n2. "Есть несохранённые изменения. Покинуть страницу?"\n3. "Перетащите для сортировки"\n4. "Произошла ошибка. Попробуйте ещё раз."\n5. "По запросу \'{{query}}\' ничего не найдено"\n6. "Пригласить участников"',
      explanation: 'UI string translation requires knowledge of platform conventions (mobile vs web), typical string lengths, and the tone of the product. Over-literal translation often sounds unnatural in Russian UI contexts.'
    },
    {
      id: 3,
      title: 'Практика: перевод документации API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Переведите описание API-эндпоинта на профессиональный русский.',
      requirements: ['Сохраните технические термины на английском', 'Переведите описательный текст на русский', 'Сохраните структуру документа'],
      questions: [
        { text: 'Translate this API endpoint documentation into Russian, keeping technical terms (HTTP methods, field names, status codes) in English:\n\n"POST /api/v1/users\n\nCreates a new user account. Requires authentication with an API key that has the write:users scope.\n\nRequest Body:\n- email (string, required): The user\'s email address. Must be unique.\n- role (string, optional): User role. Accepted values: admin, editor, viewer. Defaults to viewer.\n- notify (boolean, optional): If true, sends a welcome email. Defaults to false.\n\nReturns 201 Created on success with the new user object. Returns 409 Conflict if the email already exists."', answer: 'POST /api/v1/users\n\nСоздаёт новую учётную запись пользователя. Требует аутентификации с API-ключом, у которого есть scope write:users.\n\nТело запроса:\n- email (string, обязательный): Адрес электронной почты пользователя. Должен быть уникальным.\n- role (string, необязательный): Роль пользователя. Допустимые значения: admin, editor, viewer. По умолчанию: viewer.\n- notify (boolean, необязательный): Если true, отправляет приветственное письмо. По умолчанию: false.\n\nПри успешном выполнении возвращает 201 Created с объектом нового пользователя. Возвращает 409 Conflict, если пользователь с таким email уже существует.', explanation: 'API documentation translation keeps all technical terms (field names, HTTP methods, status codes, data types) in English, while translating all natural language descriptions into clear Russian.' }
      ],
      hint: 'В технической документации оставляйте на английском: HTTP-методы, имена полей, типы данных, HTTP-статусы, scope-строки. Переводите только описательный текст.',
      solution: 'Правильные ответы:\n1. POST /api/v1/users — создаёт новую учётную запись пользователя. Требует аутентификации с API-ключом, у которого есть scope write:users.',
      explanation: 'Bilingual technical documentation requires clear decisions about what stays in English (technical identifiers) and what gets translated (human-readable descriptions). Inconsistency creates confusion for readers.'
    },
    {
      id: 4,
      title: 'Практика: локализация сообщений об ошибках',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите локализованные сообщения об ошибках для разных аудиторий.',
      requirements: ['Напишите сообщение об ошибке для конечного пользователя', 'Напишите то же сообщение для разработчика (лог)', 'Сохраните полезность и уважение к пользователю'],
      questions: [
        { text: 'Write two versions of error messages for each scenario — one for the end user (Russian, friendly and actionable), one for the developer log (English, technical and precise):\n\n1. Scenario: Payment gateway timeout after 30 seconds\n2. Scenario: File upload rejected because it exceeds the 10MB limit\n3. Scenario: JWT token has expired', answer: 'Scenario 1:\nUser (RU): "Платёж не прошёл из-за технического сбоя. Попробуйте ещё раз или используйте другой способ оплаты."\nDev log (EN): "PaymentGatewayTimeoutError: Request to Stripe /v1/charges timed out after 30000ms. Request ID: req_abc123. Retry count: 0."\n\nScenario 2:\nUser (RU): "Файл слишком большой. Максимальный размер — 10 МБ. Попробуйте загрузить файл меньшего размера."\nDev log (EN): "FileSizeLimitExceededError: Upload rejected. File size: 14.3MB. Limit: 10MB. User ID: usr_789. Endpoint: POST /api/uploads"\n\nScenario 3:\nUser (RU): "Ваш сеанс истёк. Пожалуйста, войдите снова."\nDev log (EN): "JWTExpiredError: Token expired at 2024-01-15T14:23:11Z. Current time: 2024-01-15T15:01:47Z. Token age: 38m36s. User ID: usr_456."', explanation: 'User-facing errors should be written in the user\'s language, be non-technical, explain what happened, and tell the user what to do next. Dev logs should be in English, precise, and include all context needed for debugging.' }
      ],
      hint: 'Правила хороших error messages: для пользователя — не вините, объясните что произошло, скажите что делать. Для разработчика — ID, timestamps, размеры, состояние.',
      solution: 'Правильные ответы:\nScenario 1 User: "Платёж не прошёл из-за технического сбоя. Попробуйте ещё раз или используйте другой способ оплаты."\nDev log: "PaymentGatewayTimeoutError: Request to Stripe /v1/charges timed out after 30000ms."',
      explanation: 'The gap between user-facing and developer error messages reflects a fundamental UX principle: users need to understand what happened and what to do; developers need enough context to diagnose and fix the problem.'
    },
    {
      id: 5,
      title: 'Практика: перевод технических требований',
      type: 'practice',
      difficulty: 'hard',
      description: 'Переведите технические требования из русского в профессиональный английский.',
      requirements: ['Переведите требования на английский', 'Используйте RFC 2119 модальные глаголы (MUST, SHOULD, MAY)', 'Сохраните точность и однозначность'],
      questions: [
        { text: 'Translate these technical requirements from Russian into formal English specification language using RFC 2119 keywords (MUST, MUST NOT, SHOULD, MAY):\n\n1. "Пароль должен содержать минимум 12 символов."\n2. "Система не должна хранить пароли в открытом виде."\n3. "Рекомендуется использовать HTTPS для всех эндпоинтов."\n4. "Токен может иметь срок действия до 30 дней."\n5. "После 5 неудачных попыток входа аккаунт должен быть заблокирован."', answer: '1. "The password MUST contain a minimum of 12 characters."\n2. "The system MUST NOT store passwords in plaintext."\n3. "All endpoints SHOULD use HTTPS."\n4. "A token MAY have a maximum validity period of 30 days."\n5. "After 5 consecutive failed login attempts, the account MUST be locked."', explanation: 'RFC 2119 keywords: MUST/MUST NOT = mandatory requirement; SHOULD/SHOULD NOT = recommended but exceptions possible; MAY = optional. Using them correctly eliminates ambiguity in specifications.' }
      ],
      hint: 'Должен → MUST; не должен → MUST NOT; рекомендуется → SHOULD; не рекомендуется → SHOULD NOT; может/допускается → MAY.',
      solution: 'Правильные ответы:\n1. "The password MUST contain a minimum of 12 characters."\n2. "The system MUST NOT store passwords in plaintext."\n3. "All endpoints SHOULD use HTTPS."\n4. "A token MAY have a maximum validity period of 30 days."\n5. "After 5 consecutive failed login attempts, the account MUST be locked."',
      explanation: 'Translating requirements into RFC 2119 language is a core skill for engineers working on international or distributed teams. Precise specification language prevents misunderstandings during implementation.'
    },
    {
      id: 6,
      title: 'Практика: локализация даты, числа, валюты',
      type: 'practice',
      difficulty: 'easy',
      description: 'Форматирование дат, чисел и валют для разных локалей.',
      requirements: ['Определите правильный формат для каждой локали', 'Учитывайте контекст отображения', 'Используйте правильные разделители'],
      questions: [
        { text: 'Format the following values correctly for each locale. The source value is ISO/neutral format:\n\nSource: Date 2024-03-15, Time 14:30:00\nSource: Number 1234567.89\nSource: Currency USD 9999.99\n\nProvide the correctly formatted value for:\n1. en-US (American English)\n2. en-GB (British English)\n3. ru-RU (Russian)\n4. de-DE (German)\n5. What JavaScript Intl API call would you use to format the date for ru-RU?', answer: '1. en-US: March 15, 2024, 2:30 PM / 1,234,567.89 / $9,999.99\n2. en-GB: 15 March 2024, 14:30 / 1,234,567.89 / $9,999.99 (USD)\n3. ru-RU: 15 марта 2024 г., 14:30 / 1 234 567,89 / 9 999,99 $\n4. de-DE: 15. März 2024, 14:30 Uhr / 1.234.567,89 / 9.999,99 $\n5. new Intl.DateTimeFormat(\'ru-RU\', { year: \'numeric\', month: \'long\', day: \'numeric\' }).format(new Date(\'2024-03-15\'))', explanation: 'Locale-aware formatting: en-US uses 12h clock and comma thousands; en-GB uses 24h and comma thousands; ru-RU uses non-breaking space thousands and comma decimal; de-DE uses period thousands and comma decimal.' }
      ],
      hint: 'Ключевые различия: разделитель тысяч (запятая/точка/пробел), разделитель дробной части (точка/запятая), порядок дата-месяц-год, 12/24-часовой формат.',
      solution: 'Правильные ответы:\nen-US: March 15, 2024, 2:30 PM / 1,234,567.89 / $9,999.99\nru-RU: 15 марта 2024 г., 14:30 / 1 234 567,89 / 9 999,99 $',
      explanation: 'Localisation of numbers, dates, and currencies is a common source of bugs in international software. The JavaScript Intl API handles most of this automatically when given the correct locale code.'
    },
    {
      id: 7,
      title: 'Практика: перевод commit messages и PR descriptions',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите правильные commit messages и PR descriptions на английском.',
      requirements: ['Переведите описания на английский', 'Следуйте Conventional Commits формату', 'Используйте imperative mood'],
      questions: [
        { text: 'Translate these Russian commit/PR descriptions into proper English following Conventional Commits format (type(scope): description):\n\n1. "Добавил валидацию email на форме регистрации"\n2. "Исправил баг: корзина обнулялась при обновлении страницы"\n3. "Рефакторинг: вынес логику авторизации в отдельный middleware"\n4. "Обновил зависимости до последних версий"\n5. "ЛОМАЮЩЕЕ ИЗМЕНЕНИЕ: изменил формат ответа API /users — убрал поле username, добавил firstName и lastName"', answer: '1. feat(auth): add email validation to registration form\n2. fix(cart): prevent cart from resetting on page refresh\n3. refactor(auth): extract authorization logic into dedicated middleware\n4. chore(deps): update dependencies to latest versions\n5. feat(api)!: change /users response format\n\nBREAKING CHANGE: removed `username` field; added `firstName` and `lastName` fields to user response object', explanation: 'Conventional Commits: feat (new feature), fix (bug fix), refactor (code change without new feature/fix), chore (maintenance), docs, test. Imperative mood: "add", not "added". Breaking changes use ! or BREAKING CHANGE footer.' }
      ],
      hint: 'Imperative mood в коммитах: "add" не "added", "fix" не "fixed", "update" не "updated". Conventional Commits: feat/fix/refactor/chore/docs/test.',
      solution: 'Правильные ответы:\n1. feat(auth): add email validation to registration form\n2. fix(cart): prevent cart from resetting on page refresh\n3. refactor(auth): extract authorization logic into dedicated middleware\n4. chore(deps): update dependencies to latest versions\n5. feat(api)!: change /users response format',
      explanation: 'Writing clear, conventional commit messages is a professional skill that enables automated changelogs, better code review, and clearer project history for international teams.'
    },
    {
      id: 8,
      title: 'Практика: локализация README файла',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите секцию README на профессиональном техническом английском.',
      requirements: ['Переведите технический README на английский', 'Сохраните структуру и технические детали', 'Используйте профессиональный стиль open-source документации'],
      questions: [
        { text: 'Translate this Russian README section into professional English README format:\n\n"## Установка\n\nДля установки проекта вам нужен Node.js версии 18 или выше и npm версии 9 или выше.\n\nСклонируйте репозиторий и установите зависимости:\n\n1. Скопируйте файл .env.example в .env и заполните нужные переменные\n2. Установите зависимости командой npm install\n3. Запустите миграции базы данных\n4. Запустите сервер для разработки\n\nПосле запуска приложение будет доступно по адресу http://localhost:3000"', answer: '## Installation\n\n**Prerequisites:** Node.js >= 18.0.0 and npm >= 9.0.0\n\nClone the repository and follow these steps:\n\n1. Copy the environment file and configure your variables:\n   cp .env.example .env\n\n2. Install dependencies:\n   npm install\n\n3. Run database migrations:\n   npm run db:migrate\n\n4. Start the development server:\n   npm run dev\n\nThe application will be available at http://localhost:3000', explanation: 'README translation tips: use Prerequisites instead of "you need"; use code blocks for commands; use >= for version requirements; be concise and action-oriented; show the actual commands, not just describe them.' }
      ],
      hint: 'Open-source README conventions: Prerequisites section for requirements, code blocks for all commands, brief and scannable, active voice, present tense for descriptions.',
      solution: 'Правильные ответы:\n## Installation\n\n**Prerequisites:** Node.js >= 18.0.0 and npm >= 9.0.0\n\nClone the repository and follow these steps:\n1. cp .env.example .env\n2. npm install\n3. npm run db:migrate\n4. npm run dev',
      explanation: 'README files are often the first thing contributors see. Good English README writing is about removing friction: every step should be executable without ambiguity, and readers should be able to scan rather than read carefully.'
    },
    {
      id: 9,
      title: 'Практика: интернационализация (i18n) текстов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите i18n-дружественные строки и избегайте common pitfalls.',
      requirements: ['Определите проблемы в строках', 'Перепишите для корректной локализации', 'Объясните принцип каждого исправления'],
      questions: [
        { text: 'Identify the i18n problems in these strings and rewrite them to be localisation-friendly:\n\n1. "You have " + count + " new messages"\n2. "Click here to continue"\n3. "Enter your credit card number (16 digits, no spaces)"\n4. "Error on line " + lineNum + " of file " + fileName\n5. "Last updated: " + month + "/" + day + "/" + year', answer: '1. Problem: String concatenation breaks in languages with different word order.\n   Fix: Use a template key with count parameter.\n   i18n key: "inbox.newMessages" = { en: "You have {{count}} new message", en_plural: "You have {{count}} new messages", ru: "{{count}} новое сообщение" (1), ru_plural: "{{count}} новых сообщения" (2-4), etc. }\n\n2. Problem: "here" is non-descriptive and inaccessible; translation context is unclear.\n   Fix: "Continue to the next step" — describe the action fully.\n\n3. Problem: Card format varies by country (not all cards are 16 digits).\n   Fix: "Enter your card number" — let the payment library handle format hints.\n\n4. Problem: "of file" may need different word order in some languages.\n   Fix: Use a single key with named parameters: "error.location" = "Error on line {{line}} of {{file}}" — named params allow reordering.\n\n5. Problem: Hard-coded date format is locale-specific (MM/DD/YYYY is US only).\n   Fix: Pass an ISO date and format using Intl.DateTimeFormat with the user\'s locale.', explanation: 'i18n best practices: use named parameters (not positional); support pluralisation via ICU MessageFormat or i18next; never concatenate strings; use locale-aware date/number formatting; provide context for translators.' }
      ],
      hint: 'Common i18n mistakes: строковая конкатенация, позиционные плейсхолдеры вместо именованных, хардкод форматов дат/чисел, отсутствие plural forms, бессмысленные "click here".',
      solution: 'Правильные ответы:\n1. Use template key with count parameter for pluralisation support\n2. "Continue to the next step" — full description of action\n3. "Enter your card number" — remove format assumption\n4. "Error on line {{line}} of {{file}}" — named parameters\n5. Use Intl.DateTimeFormat with user locale',
      explanation: 'Internationalisation is much easier to do right from the start than to retrofit. The key insight is that natural language does not work like code — word order, pluralisation rules, and format conventions vary significantly across languages.'
    },
    {
      id: 10,
      title: 'Финальная практика: полный перевод технического поста',
      type: 'practice',
      difficulty: 'hard',
      description: 'Переведите технический блог-пост с русского на профессиональный английский.',
      requirements: [
        'Переведите текст полностью на английский',
        'Сохраните технические термины',
        'Адаптируйте стиль для международной аудитории',
        'Длина перевода: соответствует оригиналу'
      ],
      hint: 'Не переводите дословно — адаптируйте. Заголовок должен быть цепляющим для anglophone аудитории. Технические термины остаются на английском.',
      solution: 'Why We Migrated from REST to GraphQL (and What We Learned)\n\nFor three years, our mobile app communicated with the backend exclusively via REST. This worked fine at first, but as the number of screens grew, we started running into a classic problem: over-fetching.\n\nThe profile screen was making seven separate API calls just to display basic user information. Each call returned far more data than we needed, and our mobile clients were burning battery and bandwidth for no reason.\n\nWe evaluated GraphQL as a solution. The core appeal was simple: the client requests exactly the fields it needs, and the server returns exactly that — nothing more, nothing less.\n\nThe migration took one quarter. We ran GraphQL alongside REST using a strangler fig pattern, gradually moving endpoints. The result: the profile screen now makes a single query. Data transfer dropped by 60%. The mobile team stopped asking backend engineers to create custom endpoints for specific screens.\n\nThe downsides are real too. Caching becomes more complex. N+1 query problems require DataLoader. Schema design requires upfront thought. But for our use case — a complex mobile app with many different screens and data requirements — the tradeoffs were clearly worth it.\n\nIf you\'re evaluating GraphQL, the honest advice is: start with the problem, not the technology. REST is simpler and easier to cache. GraphQL shines when your clients have diverse, complex data needs that REST endpoints can\'t efficiently serve.',
      explanation: 'Technical blog post translation requires balancing literal accuracy with natural English flow. The best translated posts read as if they were originally written in English — they adapt idioms, restructure sentences for English rhythm, and use natural technical vocabulary rather than literal equivalents.'
    }
  ]
}
