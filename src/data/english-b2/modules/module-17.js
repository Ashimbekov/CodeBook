export default {
  id: 17,
  title: 'Идиомы и сленг в IT-команде',
  description: '"LGTM", "PTAL", "WIP", "TL;DR", "YAGNI", "DRY" и другой IT-слэнг и идиомы',
  lessons: [
    {
      id: 1,
      title: 'Code review аббревиатуры и выражения',
      type: 'theory',
      content: [
        { type: 'text', value: 'В международных командах code review наполнен аббревиатурами и выражениями, незнание которых создаёт неловкость и замедляет работу.' },
        { type: 'heading', value: 'Основные аббревиатуры PR/CR' },
        { type: 'text', value: '"LGTM — Looks Good To Me: стандартное одобрение PR"\n"PTAL — Please Take A Look: просьба проверить код или документ"\n"WIP — Work In Progress: PR ещё не готов к ревью"\n"RFC — Request for Comments: документ или PR, открытый для обсуждения и предложений"\n"AFAICT — As Far As I Can Tell: насколько я могу судить"' },
        { type: 'heading', value: 'Нюансы LGTM' },
        { type: 'text', value: '"LGTM" — иногда поверхностное одобрение\n"LGTM!" — с восклицательным знаком, искреннее одобрение\n"LGTM, but PTAL at my last comment" — одобряю в целом, но посмотри на мой комментарий\n"Nitpick: LGTM overall" — мелкие замечания, но в целом ок\n"nit: ..." — нитпик, незначительное замечание' },
        { type: 'heading', value: 'Review terms' },
        { type: 'text', value: '"Blocking comment: замечание, которое нужно исправить перед мержем"\n"Non-blocking / nit: незначительное замечание, можно проигнорировать"\n"Suggestion: предложение, можно принять или отклонить"\n"LGTM pending: одобряю, как только исправишь X"\n"NACKed — Not Acknowledged/Accepted: официальный отказ (редко)"' }
      ]
    },
    {
      id: 2,
      title: 'Engineering principles: YAGNI, DRY, KISS, SOLID',
      type: 'theory',
      content: [
        { type: 'text', value: 'Аббревиатуры принципов разработки используются в code review, архитектурных обсуждениях и технических беседах.' },
        { type: 'heading', value: 'YAGNI — You Ain\'t Gonna Need It' },
        { type: 'text', value: '"YAGNI: don\'t implement something until it is actually needed."\n"This abstraction is premature — YAGNI. Let\'s add it when we actually have the second use case."\n"Over-engineering is the enemy of simplicity. YAGNI reminds us to resist the urge."' },
        { type: 'heading', value: 'DRY — Don\'t Repeat Yourself' },
        { type: 'text', value: '"DRY: every piece of knowledge should have a single, authoritative representation."\n"This logic is duplicated in three places — violates DRY. Let\'s extract it into a helper function."\n"However, don\'t DRY too aggressively — sometimes duplication is cheaper than the wrong abstraction."' },
        { type: 'heading', value: 'KISS — Keep It Simple, Stupid' },
        { type: 'text', value: '"KISS: prefer the simplest solution that works."\n"This solution is overly complex. KISS — let\'s use a simple hash map instead."' },
        { type: 'heading', value: 'AHA — Avoid Hasty Abstractions' },
        { type: 'text', value: '"AHA principle: prefer duplication over the wrong abstraction."\n"Reach for abstraction only when the pattern is clear — not before."' }
      ]
    },
    {
      id: 3,
      title: 'Communication abbreviations: TL;DR, ETA, FWIW, IMO',
      type: 'theory',
      content: [
        { type: 'text', value: 'Эти аббревиатуры используются в Slack, email и comments каждый день.' },
        { type: 'heading', value: 'Повседневные аббревиатуры' },
        { type: 'text', value: '"TL;DR — Too Long; Didn\'t Read: краткое резюме длинного текста"\n"ETA — Estimated Time of Arrival: когда ожидается готовность"\n"FWIW — For What It\'s Worth: к сведению (вводная фраза)"\n"IMO / IMHO — In My (Humble) Opinion: по моему (скромному) мнению"\n"IIRC — If I Recall Correctly: если я правильно помню"\n"AFAIK — As Far As I Know: насколько мне известно"' },
        { type: 'heading', value: 'Примеры использования' },
        { type: 'text', value: '"TL;DR: the new API is backwards-compatible but requires migration for batch operations."\n"ETA on the fix? The client is asking."\n"FWIW, I\'ve seen this pattern cause issues in high-concurrency scenarios."\n"IMO, we should address the technical debt before adding new features."\n"IIRC, we had a similar issue last year — let me find the postmortem."' },
        { type: 'tip', value: 'TL;DR — золото технического письма. В любом длинном документе или Slack-сообщении добавляйте TL;DR в начале. Это уважение к времени читателя.' }
      ]
    },
    {
      id: 4,
      title: 'IT-идиомы и метафоры',
      type: 'theory',
      content: [
        { type: 'text', value: 'В IT-культуре много идиом и метафор из разных областей. Знание их позволяет понимать коллег-носителей языка.' },
        { type: 'heading', value: 'Технический долг и код' },
        { type: 'text', value: '"Spaghetti code: запутанный, трудно читаемый код — как тарелка спагетти"\n"Duct tape solution / band-aid fix: временное решение, которое \'держится на скотче\'"\n"Magic number: хардкоженное число без объяснения"\n"Code smell: признак потенциальной проблемы в коде"\n"Rubber duck debugging: объяснять код резиновой уточке (или кому угодно) для нахождения багов"' },
        { type: 'heading', value: 'Процессы и команда' },
        { type: 'text', value: '"Bikeshedding / Parkinson\'s Law of Triviality: тратить время на обсуждение незначительных деталей (покраска велопарковки), игнорируя важное"\n"Yak shaving: выполнять бесконечные подготовительные задачи вместо основной"\n"Boiling the ocean: пытаться сделать слишком многое за раз"\n"Eating your own dog food (dogfooding): использовать собственный продукт"' },
        { type: 'heading', value: 'Системы и архитектура' },
        { type: 'text', value: '"Snowflake server: сервер, настроенный вручную и незаменимый — нельзя воспроизвести"\n"Phoenix server: сервер, который можно уничтожить и воссоздать из кода"\n"Big Ball of Mud: архитектура без видимой структуры"\n"Silver bullet: мифическое решение всех проблем"' }
      ]
    },
    {
      id: 5,
      title: 'Slang и неформальные выражения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Разговорный IT-английский насыщен сленгом. Понимать его важно, но использовать — только в подходящем контексте.' },
        { type: 'heading', value: 'Про код и разработку' },
        { type: 'text', value: '"Greenfield project: новый проект с нуля, без легаси"\n"Brownfield project: развитие существующей, часто легаси-системы"\n"Dog fooding: команда использует собственный продукт"\n"Dogpile: внезапный выброс трафика, когда все одновременно делают один запрос"\n"Thundering herd problem: многие клиенты одновременно атакуют сервер после восстановления"' },
        { type: 'heading', value: 'Про производительность и статус' },
        { type: 'text', value: '"In the weeds: погружён в детали, потерял общую картину"\n"In the zone: в состоянии потока, глубокой концентрации"\n"Technical bankruptcy: система настолько запущена, что проще переписать"\n"Scrappy: быстрый и pragmatic подход, не обязательно красивый"\n"Shipping: выпускать продукт; \'ship it!\' — деплоить, не перфекционировать"' },
        { type: 'heading', value: 'Ситуационные выражения' },
        { type: 'text', value: '"That\'s above my pay grade: это выше моего уровня принятия решений"\n"Bike-shedding again: опять обсуждаем мелочи"\n"We\'re gold-plating this: добавляем ненужные \'украшения\' вместо того, чтобы шипить"\n"Premature optimisation is the root of all evil: классическая цитата Кнута — не оптимизируй раньше времени"' }
      ]
    },
    {
      id: 6,
      title: 'Практика: понимание IT-диалога',
      type: 'practice',
      difficulty: 'medium',
      description: 'Расшифруйте и объясните IT-сленг в контексте реального диалога.',
      requirements: [
        'Объясните все аббревиатуры и сленговые выражения',
        'Переведите диалог на "обычный" английский',
        'Определите тип каждого выражения (abbr/idiom/slang)'
      ],
      questions: [
        { text: 'Slack conversation:\nAlex: "PTAL at my PR, it\'s WIP but wanted early feedback. TL;DR: refactoring the auth module, DRY violation fix."\nSam: "LGTM so far, but nit: I\'d rename this method. Also FWIW, we had similar yak shaving in the payment service last month. IIRC, we ended up bikeshedding for hours."\nAlex: "IMO we should just ship it. YAGNI — we can improve later."', answer: 'Alex: "Please take a look at my pull request, it is still work in progress but I wanted early feedback. Too long; didn\'t read summary: I\'m refactoring the authentication module to fix a Don\'t Repeat Yourself violation."\nSam: "Looks good to me so far, but minor nitpick: I\'d rename this method. Also, for what it\'s worth, we had a similar situation where we were doing endless preparatory tasks in the payment service last month. If I recall correctly, we ended up discussing trivial details for hours instead of the real problem."\nAlex: "In my opinion we should just release it. You Ain\'t Gonna Need It — we can improve it later."', explanation: 'PTAL (Please Take A Look), WIP (Work In Progress), TL;DR (Too Long; Didn\'t Read), DRY (Don\'t Repeat Yourself), LGTM (Looks Good To Me), nit (nitpick), FWIW (For What It\'s Worth), yak shaving (endless prep tasks), IIRC (If I Recall Correctly), bikeshedding (debating trivialities), IMO (In My Opinion), YAGNI (You Ain\'t Gonna Need It)' }
      ],
      solution: 'Правильные ответы:\n1. Alex: "Please take a look at my pull request, it is still work in progress but I wanted early feedback. Too long; didn\\\'t read summary: I\\\'m refactoring the authentication module to fix a Don\\\'t Repeat Y...',
      hint: 'Разберите каждую аббревиатуру отдельно, затем соберите полный смысл предложения с учётом контекста.',
      explanation: 'IT-сленг и аббревиатуры — часть культуры команды. Их знание помогает быстро интегрироваться в международную команду и понимать code review без постоянных уточнений.'
    },
    {
      id: 7,
      title: 'Практика: написание Slack-сообщений с IT-сленгом',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напишите Slack-сообщения, используя уместный IT-сленг и аббревиатуры.',
      requirements: [
        'Используйте минимум 5 аббревиатур или сленговых выражений',
        'Сохраните уместность в рабочем контексте',
        'Напишите 3 разных сообщения для разных ситуаций'
      ],
      hint: '1. Попросите ревью PR. 2. Поделитесь мнением об архитектурном решении. 3. Объясните статус задачи.',
      solution: '1. PR review request:\n"Hey @team, PTAL at #1247. WIP, but the core logic is done. TL;DR: moved the rate limiting from the API gateway to the service layer. FWIW, this fixes the YAGNI violation from last sprint — we were prematurely optimising something we didn\'t need yet. IMO LGTM but would love a second set of eyes."\n\n2. Architecture opinion:\n"IIRC, we already tried this approach in v1 and it was basically spaghetti code. AFAIK the DRY solution is to extract a shared library. IMHO we\'re bikeshedding on the naming — let\'s ship it and iterate."\n\n3. Status update:\n"Quick update: still in the weeds on this one. ETA ~3h. Hit a classic yak shaving situation — had to fix the test environment before I could even start. Should be cutting the feature branch by EOD."',
      explanation: 'Слишком много сленга делает сообщения нечитаемыми. Оптимальный подход: использовать устойчивые аббревиатуры (LGTM, TL;DR, IMO, IIRC) и избегать редкого сленга, который может быть непонятен части команды.'
    }
  ]
}
