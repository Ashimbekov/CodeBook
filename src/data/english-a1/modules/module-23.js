export default {
  id: 23,
  title: 'Письмо: простые email',
  description: 'Как писать деловые email: о баге, запросе, отчёте о прогрессе',
  lessons: [
    {
      id: 1,
      title: 'Структура делового email',
      type: 'theory',
      content: [
        { type: 'text', value: 'Деловой email в IT имеет стандартную структуру. Знание этой структуры поможет писать чёткие и профессиональные письма.' },
        { type: 'code', language: 'text', value: 'Структура email:\n1. Subject (Тема) — краткая суть письма\n2. Greeting (Приветствие) — Hi / Hello / Dear\n3. Opening (Вступление) — зачем пишете\n4. Body (Основная часть) — детали\n5. Action (Призыв к действию) — что нужно сделать\n6. Closing (Прощание) — Thanks / Best regards\n7. Signature (Подпись) — имя и должность' },
        { type: 'code', language: 'text', value: 'Примеры приветствий:\nHi [Name],          - неформальное (коллеги)\nHello [Name],       - нейтральное\nDear [Name],        - формальное (клиент/начальник)\nHi team,            - всей команде\nHi all,             - всем\n\nПрощания:\nBest regards,       - с уважением (формально)\nBest,               - с уважением (нейтрально)\nThanks,             - спасибо\nKind regards,       - с уважением\nCheers,             - пока (неформально)' },
        { type: 'tip', value: 'Золотое правило делового email: Subject должна ясно объяснять суть. "Question" — плохая тема. "Question about API authentication in module 3" — хорошая. В IT принято писать тему в формате: "[тип]: [суть]", например "Bug: Login fails on Safari" или "Question: How to configure Redis?"' }
      ]
    },
    {
      id: 2,
      title: 'Email о баге',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сообщение о баге (bug report) — один из самых частых типов писем в IT. Важно чётко описать проблему.' },
        { type: 'code', language: 'text', value: 'Пример email о баге:\nSubject: Bug Report: Login fails on mobile\n\nHi team,\n\nI found a bug in the login form.\n\nSteps to reproduce:\n1. Open the app on mobile\n2. Enter your credentials\n3. Click "Login"\n\nExpected behavior:\nThe user should be redirected to the dashboard.\n\nActual behavior:\nThe page shows a blank screen.\n\nEnvironment:\n- Device: iPhone 14\n- OS: iOS 17\n- Browser: Safari\n- App version: 2.3.1\n\nI attached a screenshot.\n\nPlease let me know if you need more information.\n\nBest regards,\n[Your name]' },
        { type: 'code', language: 'text', value: 'Ключевые фразы для bug report:\nI found a bug       - Я нашёл баг\nSteps to reproduce  - Шаги воспроизведения\nExpected behavior   - Ожидаемое поведение\nActual behavior     - Фактическое поведение\nI attached          - Я прикрепил\nPlease let me know  - Пожалуйста, дайте знать\nmore information    - больше информации\nto reproduce        - воспроизвести' },
        { type: 'tip', value: 'Идеальный Subject для bug report: "[Bug] Feature name: Brief description". Пример: "[Bug] Login: Form submits on Enter key". Включайте затронутую функцию и краткое описание.' },
      ]
    },
    {
      id: 3,
      title: 'Email с запросом помощи',
      type: 'theory',
      content: [
        { type: 'text', value: 'Запрос помощи или информации — ещё один частый тип email. Важно быть вежливым и конкретным.' },
        { type: 'code', language: 'text', value: 'Пример email с запросом:\nSubject: Question about API authentication\n\nHi John,\n\nI hope you are well.\n\nI am working on the user authentication module and\nI have a question about the API.\n\nHow should I pass the API key? In the header\nor as a query parameter?\n\nI checked the documentation but I couldn\'t\nfind a clear answer.\n\nCould you help me with this?\n\nThank you in advance.\n\nBest regards,\n[Your name]' },
        { type: 'code', language: 'text', value: 'Фразы для запроса помощи:\nI hope you are well.     - Надеюсь, у вас всё хорошо.\nI am working on...       - Я работаю над...\nI have a question about  - У меня вопрос о...\nCould you help me?       - Вы могли бы мне помочь?\nThank you in advance.    - Заранее спасибо.\nI checked...             - Я проверил...\nI couldn\'t find...       - Я не смог найти...\nplease let me know       - пожалуйста, дайте знать\nfeel free to ask         - не стесняйтесь спрашивать' },
        { type: 'note', value: 'Прежде чем просить о помощи, покажите что уже пробовали: "I checked the docs but couldn\'t find..." "I tried X and Y, but the issue persists." Это ускоряет получение ответа и показывает вашу инициативу.' },
      ]
    },
    {
      id: 4,
      title: 'Email о прогрессе',
      type: 'theory',
      content: [
        { type: 'text', value: 'Отчёт о прогрессе (progress report / status update) — регулярный тип коммуникации с руководством.' },
        { type: 'code', language: 'text', value: 'Пример status update email:\nSubject: Sprint 12 - Progress Update\n\nHi [Manager],\n\nHere is the weekly progress update.\n\nCompleted this week:\n- Fixed 5 bugs from backlog\n- Implemented user profile page\n- Added unit tests for auth module\n\nIn progress:\n- Working on payment integration\n- Estimated completion: by Friday\n\nNext week:\n- Start on the notification system\n- Code review for the mobile team\n\nBlockers:\n- Waiting for design mockups for the settings page\n\nPlease let me know if you have any questions.\n\nBest,\n[Your name]' },
        { type: 'code', language: 'text', value: 'Фразы для status update:\nHere is the update     - Вот обновление\nCompleted              - Завершено\nIn progress            - В процессе\nNext week / next steps - На следующей неделе / дальнейшие шаги\nBlockers               - Блокеры\nEstimated completion   - Ожидаемое завершение\nWaiting for           - Ожидаю' },
        { type: 'tip', value: 'Структура status update: "Completed" (завершено), "In progress" (в работе), "Blocked" (заблокировано), "Next steps" (следующие шаги). Будьте конкретны: "Completed: User auth module (90%)" вместо просто "Working on auth".' },
      ]
    },
    {
      id: 5,
      title: 'Шаблоны полезных фраз',
      type: 'theory',
      content: [
        { type: 'text', value: 'Шаблонные фразы помогают быстро написать профессиональный email, даже если ваш английский ещё слабый.' },
        { type: 'code', language: 'text', value: 'Начало письма:\nI am writing to...            - Пишу, чтобы...\nI wanted to let you know...   - Хотел сообщить вам...\nI hope this email finds you well. - Надеюсь, у вас всё хорошо.\nFollowing up on our meeting...- В продолжение нашей встречи...\nAs requested,...              - Как было запрошено,...\n\nЗапрос:\nCould you please...?          - Не могли бы вы...?\nWould it be possible to...?   - Было бы возможно...?\nI would appreciate it if...   - Я был бы признателен...\nPlease let me know...         - Пожалуйста, сообщите...\nCould you clarify...?         - Могли бы вы уточнить...?' },
        { type: 'code', language: 'text', value: 'Конец письма:\nThank you for your help.      - Спасибо за вашу помощь.\nI look forward to your reply. - Жду вашего ответа.\nPlease don\'t hesitate to ask. - Не стесняйтесь спрашивать.\nLet me know if you need anything. - Дайте знать, если нужно что-то.\nHave a great day!             - Хорошего дня!\nThanks in advance.            - Заранее спасибо.' },
        { type: 'note', value: 'Избегайте пассивного залога без необходимости. Вместо "The task was completed by me" напишите "I completed the task." (активный залог — прямее и профессиональнее). В bug reports пассивный залог нормален.' },
      ]
    },
    {
      id: 6,
      title: 'Тема письма (Subject line)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тема письма (Subject) — первое, что видит получатель. Она должна быть краткой и информативной.' },
        { type: 'code', language: 'text', value: 'Шаблоны тем письма:\n[Bug] Login fails on mobile      - [Баг] Логин не работает на мобильном\n[Question] API authentication    - [Вопрос] Аутентификация API\n[Update] Sprint 12 status        - [Обновление] Статус спринта 12\n[Urgent] Production is down      - [Срочно] Продакшен упал\n[Request] Code review            - [Запрос] Code review\n[Action Required] Server upgrade - [Требуется действие] Апгрейд сервера\nRe: Your question about...       - Отв: Ваш вопрос о... (Reply)' },
        { type: 'tip', value: 'Хорошая тема письма: конкретная, краткая, с ключевым словом в начале. Плохая тема: "Question" (слишком общая), "Help!" (непонятно о чём), "FYI" (аббревиатура — For Your Information).' },
        { type: 'tip', value: 'Лучшие практики Subject line: Начинайте с типа: "[Action Required]", "[FYI]", "[Bug]", "[Question]". Будьте конкретны: "Question about Redis configuration" лучше чем "Question". Указывайте дедлайн если срочно: "[Urgent] Response needed by EOD".' },
      ]
    },
    {
      id: 7,
      title: 'Практика: Написание email',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'write',
          question: 'Напишите тему (subject) email: вы нашли баг в форме регистрации.',
          solution: '[Bug] Registration form validation error',
          explanation: 'Тема должна быть короткой. [Bug] — метка типа, Registration form — место бага, validation error — тип проблемы.'
        },
        {
          type: 'task',
          taskType: 'fill_blank',
          question: 'Завершите фразу: "I found a bug ___." (в модуле авторизации)',
          solution: 'in the authentication module',
          explanation: '"I found a bug in the authentication module." — Я нашёл баг в модуле аутентификации. in = в.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите на английский: "Ожидаемое поведение: пользователь перенаправляется на главную страницу."',
          solution: 'Expected behavior: the user is redirected to the home page.',
          explanation: 'Expected behavior = ожидаемое поведение, is redirected = перенаправляется (пассивный залог), to the home page = на главную страницу.'
        }
      ]
    }
  ]
}
