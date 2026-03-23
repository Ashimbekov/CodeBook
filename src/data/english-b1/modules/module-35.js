export default {
  id: 35,
  title: 'Practice: Translating Complex Texts',
  description: 'Практика перевода сложных технических текстов с английского на русский и с русского на английский. Стратегии перевода и типичные ошибки.',
  lessons: [
    {
      id: 1,
      title: 'Translation strategies overview',
      type: 'practice',
      description: 'Изучи стратегии технического перевода и типичные ошибки.',
      solution: 'Ключевые стратегии:\n1. Читай весь текст перед переводом\n2. False friends: "library" = библиотека, не стандарт\n3. Технические термины — оставляй или используй принятый перевод\n4. Пассив в техтексте уместен, но не злоупотребляй\n5. Порядок слов в русском передаёт определённость (нет артиклей)',
      content: [
        { type: 'text', value: 'Технический перевод — особое искусство. Главные принципы: точность важнее буквальности, сохраняй терминологию, читай весь текст перед переводом.' },
        { type: 'heading', value: 'Common translation pitfalls' },
        { type: 'list', items: [
          'False friends: "library" — библиотека (не "стандарт"), "implementation" — реализация (не "внедрение" в разработке)',
          'Кальки: не "деплоировать" — говори "развёртывать" или оставляй "deploy"',
          'Артикли: в русском нет артиклей, но порядок слов передаёт определённость',
          'Пассив: в русском техтексте пассив тоже уместен, но не злоупотребляй'
        ]}
      ]
    },
    {
      id: 2,
      title: 'Translate: API error handling',
      type: 'practice',
      description: 'Переведи текст об обработке ошибок API с английского на русский.',
      solution: 'Образец перевода:\n"Когда API возвращает ошибку 4xx, клиент не должен автоматически повторять запрос, поскольку такие ошибки указывают на проблемы на стороне клиента. Однако для ошибок 5xx рекомендуется экспоненциальная задержка: начните с 1 секунды, удваивая при каждой попытке — максимум 5 попыток или 32 секунды."\n\nКлючи: 4xx/5xx оставляй, "exponential backoff" = "экспоненциальная задержка".',
      sourceLanguage: 'English',
      targetLanguage: 'Russian',
      text: 'When the API returns a 4xx error, the client should not automatically retry the request, as these errors indicate client-side issues that will not resolve themselves without intervention. However, for 5xx errors (server-side failures), implementing an exponential backoff strategy is recommended. Start with a 1-second delay, doubling it on each subsequent retry, up to a maximum of 5 retries or 32 seconds, whichever comes first.',
      sampleTranslation: 'Когда API возвращает ошибку 4xx, клиент не должен автоматически повторять запрос, поскольку такие ошибки указывают на проблемы на стороне клиента, которые не устранятся сами по себе без вмешательства. Однако для ошибок 5xx (сбои на стороне сервера) рекомендуется использовать стратегию экспоненциальной задержки. Начните с задержки в 1 секунду, удваивая её при каждой последующей попытке — максимум 5 попыток или 32 секунды, в зависимости от того, что наступит раньше.',
      notes: ['4xx/5xx — оставляй как есть, это технические обозначения', '"exponential backoff" можно оставить как есть или перевести как "экспоненциальная задержка"', '"client-side" — "на стороне клиента", "server-side" — "на стороне сервера"']
    },
    {
      id: 3,
      title: 'Translate: Microservices description',
      type: 'practice',
      description: 'Переведи описание микросервисной архитектуры с английского на русский.',
      solution: 'Ключи перевода:\n"decomposes" = разбивает/декомпозирует\n"suite of" = набор/комплекс\n"lightweight mechanisms" = лёгкие механизмы взаимодействия\n"service discovery" = обнаружение сервисов\n"data consistency" = согласованность данных\n\nСравни с образцом перевода в уроке.',
      sourceLanguage: 'English',
      targetLanguage: 'Russian',
      text: 'Microservices architecture decomposes a monolithic application into a suite of small, independently deployable services, each running in its own process and communicating via lightweight mechanisms, typically HTTP-based REST APIs or message queues. Each service is responsible for a specific business capability and can be developed, deployed, and scaled independently. While this approach offers significant benefits in terms of scalability and team autonomy, it also introduces substantial complexity in areas such as distributed tracing, service discovery, and data consistency across service boundaries.',
      sampleTranslation: 'Архитектура микросервисов разбивает монолитное приложение на набор небольших независимо развёртываемых сервисов, каждый из которых работает в своём процессе и взаимодействует посредством легковесных механизмов — как правило, REST API на основе HTTP или очередей сообщений. Каждый сервис отвечает за конкретную бизнес-функцию и может разрабатываться, развёртываться и масштабироваться независимо. Несмотря на то что такой подход даёт существенные преимущества с точки зрения масштабируемости и автономии команд, он также привносит значительную сложность в таких областях, как распределённая трассировка, обнаружение сервисов и согласованность данных между границами сервисов.',
      notes: ['"decomposes" — разбивает/декомпозирует', '"suite of" — набор/комплекс', '"service discovery" — можно перевести как "обнаружение сервисов" или оставить термин']
    },
    {
      id: 4,
      title: 'Translate Russian to English: architecture decision',
      type: 'practice',
      description: 'Переведи технический текст с русского на английский.',
      solution: 'Критерии хорошего перевода RU→EN:\n✓ Технические термины на английском\n✓ Правильные артикли (the/a/an)\n✓ Правильные времена глаголов\n✓ Профессиональная лексика\n✓ Естественный порядок слов\n\nСравни с эталонным переводом из урока.',
      sourceLanguage: 'Russian',
      targetLanguage: 'English',
      text: 'Мы приняли решение перейти с синхронного взаимодействия между сервисами на асинхронное с использованием очередей сообщений. Основная причина — устранение сильной связанности: в текущей архитектуре сбой одного сервиса каскадно распространяется на все зависимые сервисы. Кроме того, это позволит нам обрабатывать всплески нагрузки более равномерно, поскольку сообщения будут накапливаться в очереди во время пиковых периодов и обрабатываться по мере доступности.',
      sampleTranslation: 'We have decided to migrate from synchronous inter-service communication to asynchronous messaging using message queues. The primary reason is to eliminate tight coupling: in the current architecture, a failure in one service cascades to all dependent services. Additionally, this will allow us to handle load spikes more gracefully, as messages will accumulate in the queue during peak periods and be processed as capacity becomes available.',
      notes: ['"сильная связанность" — "tight coupling"', '"каскадно распространяется" — "cascades"', '"всплески нагрузки" — "load spikes"', '"по мере доступности" — "as capacity becomes available"']
    },
    {
      id: 5,
      title: 'Translate: Security vulnerability disclosure',
      type: 'practice',
      description: 'Переведи описание уязвимости безопасности с английского на русский.',
      solution: 'Ключи перевода для security текстов:\n"vulnerability" = уязвимость\n"disclosed" = раскрыта/обнаружена\n"patch" = патч/исправление\n"severity" = серьёзность/критичность\n"exploit" = эксплойт/использование уязвимости\n\nСравни с образцом перевода в уроке.',
      sourceLanguage: 'English',
      targetLanguage: 'Russian',
      text: 'A critical security vulnerability has been identified in versions 2.1.0 through 2.3.4 of the library. The vulnerability allows an authenticated attacker to escalate privileges by exploiting an improper access control check in the administration module. Specifically, any user with the "editor" role can access API endpoints intended exclusively for administrators by crafting a malformed JWT token.\n\nAll users are strongly advised to upgrade to version 2.3.5, which contains a patch for this vulnerability. If an immediate upgrade is not possible, a workaround is available: disable the administration API endpoints and restrict access to them via network-level controls.',
      sampleTranslation: 'В версиях 2.1.0–2.3.4 библиотеки выявлена критическая уязвимость безопасности. Уязвимость позволяет аутентифицированному злоумышленнику повысить привилегии, воспользовавшись некорректной проверкой управления доступом в модуле администрирования. В частности, любой пользователь с ролью "editor" может обращаться к API-эндпоинтам, предназначенным исключительно для администраторов, путём создания некорректно сформированного JWT-токена.\n\nВсем пользователям настоятельно рекомендуется обновиться до версии 2.3.5, содержащей исправление данной уязвимости. Если немедленное обновление невозможно, существует временное решение: отключить API-эндпоинты администрирования и ограничить доступ к ним средствами сетевого уровня.'
    },
    {
      id: 6,
      title: 'Translate Russian to English: bug report',
      type: 'practice',
      description: 'Переведи bug report с русского на английский.',
      solution: 'Ключи перевода bug report:\nВоспроизведение: "Steps to reproduce:"\nОжидаемое: "Expected behavior:"\nФактическое: "Actual behavior:"\nСреда: "Environment:"\nПриоритет: "Priority: Critical/High/Medium/Low"\n\nСравни с образцом перевода в уроке.',
      sourceLanguage: 'Russian',
      targetLanguage: 'English',
      text: 'При попытке загрузить файл размером более 10 МБ через форму загрузки пользователь получает сообщение об ошибке "Internal Server Error" вместо информативного сообщения об ограничении размера файла. Проблема воспроизводится стабильно во всех браузерах. Судя по логам сервера, Nginx возвращает 413 "Request Entity Too Large", однако это не обрабатывается должным образом на уровне приложения.',
      sampleTranslation: 'When attempting to upload a file larger than 10 MB through the upload form, the user receives a generic "Internal Server Error" message instead of an informative message about the file size limit. The issue reproduces consistently across all browsers. Based on server logs, Nginx returns 413 "Request Entity Too Large", however this is not properly handled at the application level.',
      notes: ['"стабильно воспроизводится" — "reproduces consistently"', '"судя по логам" — "based on (server) logs"', '"не обрабатывается должным образом" — "is not properly handled"', '"на уровне приложения" — "at the application level"']
    },
    {
      id: 7,
      title: 'Translate: Database indexing explanation',
      type: 'practice',
      description: 'Переведи объяснение индексирования базы данных с английского на русский.',
      solution: 'Ключи перевода для database текстов:\n"index" = индекс\n"composite index" = составной индекс\n"query optimizer" = оптимизатор запросов\n"full table scan" = полный перебор таблицы\n"lookup" = поиск/обращение\n\nСравни с образцом перевода в уроке.',
      sourceLanguage: 'English',
      targetLanguage: 'Russian',
      text: 'An index in a database is a data structure that improves the speed of data retrieval operations at the cost of additional storage space and slower write operations. Without an index, the database must scan the entire table to find the relevant rows — an operation with O(n) time complexity. With a B-tree index (the most common type), lookups are reduced to O(log n) operations.\n\nHowever, indexes come with trade-offs. Each index must be updated whenever data in the indexed column changes, which slows down INSERT, UPDATE, and DELETE operations. Therefore, you should index columns that are frequently used in WHERE clauses, JOIN conditions, or ORDER BY expressions, and avoid over-indexing tables that have high write volumes.',
      sampleTranslation: 'Индекс в базе данных — это структура данных, которая ускоряет операции извлечения данных ценой дополнительного дискового пространства и более медленных операций записи. Без индекса СУБД вынуждена сканировать всю таблицу для поиска нужных строк — операция со сложностью O(n). При наличии B-дерева (наиболее распространённый тип индекса) поиск сводится к операциям O(log n).\n\nОднако индексы сопряжены с определёнными компромиссами. Каждый индекс необходимо обновлять при каждом изменении данных в индексируемом столбце, что замедляет операции INSERT, UPDATE и DELETE. Поэтому индексировать следует столбцы, часто используемые в условиях WHERE, JOIN или выражениях ORDER BY, и избегать избыточного индексирования таблиц с высокой интенсивностью записи.'
    },
    {
      id: 8,
      title: 'Spot translation errors',
      type: 'practice',
      description: 'Найди ошибки в переводе и исправь их.',
      solution: 'Типичные ошибки перевода:\n1. Ложные друзья (false friends)\n2. Буквальный перевод идиом\n3. Неправильный порядок слов\n4. Неверный перевод технических терминов\n5. Пропуск важных деталей\n6. Изменение смысла оригинала\n\nСравни каждый вариант с оригиналом и исправленным переводом.',
      content: [
        { type: 'text', value: 'Найди и исправь ошибки в следующих переводах.' }
      ],
      tasks: [
        {
          original: 'The library is deprecated and will be removed in the next major release.',
          badTranslation: 'Библиотека устарела и будет удалена в следующем крупном освобождении.',
          issues: ['"освобождение" — неверный перевод слова "release" в контексте ПО'],
          goodTranslation: 'Библиотека устарела и будет удалена в следующем мажорном релизе.'
        },
        {
          original: 'The implementation uses a lazy loading pattern to defer object initialization until first use.',
          badTranslation: 'Воплощение использует ленивый паттерн загрузки для откладывания инициализации объекта.',
          issues: ['"воплощение" — неточно. "implementation" в контексте кода — "реализация"', '"откладывания" — лучше "отложить" или "перенести"'],
          goodTranslation: 'Реализация использует паттерн ленивой загрузки для отложенной инициализации объекта до первого обращения к нему.'
        },
        {
          original: 'We need to address the race condition in the thread pool.',
          badTranslation: 'Нам нужно провести гонку условий в пуле потоков.',
          issues: ['"address" здесь не "провести", а "устранить" или "разобраться с"', '"race condition" — "состояние гонки", не "гонка условий"'],
          goodTranslation: 'Нам нужно устранить состояние гонки в пуле потоков.'
        }
      ]
    },
    {
      id: 9,
      title: 'Translate: Agile ceremonies',
      type: 'practice',
      description: 'Переведи описание Agile-церемоний с английского на русский.',
      solution: 'Ключи перевода Agile терминов:\n"sprint planning" = планирование спринта\n"daily standup" = ежедневный стендап\n"sprint review" = обзор спринта\n"retrospective" = ретроспектива\n"backlog refinement" = уточнение бэклога\n"velocity" = скорость/производительность команды',
      sourceLanguage: 'English',
      targetLanguage: 'Russian',
      text: 'Scrum defines four ceremonies that structure the sprint cycle. The Sprint Planning meeting begins each sprint, where the team selects items from the product backlog and commits to completing them within the sprint. The Daily Standup is a brief 15-minute synchronization meeting where each team member answers three questions: what did I accomplish yesterday, what am I working on today, and are there any impediments blocking my progress? The Sprint Review is a demonstration of completed work to stakeholders at the end of the sprint. Finally, the Sprint Retrospective is a team reflection session focused on improving the process for the next sprint.',
      sampleTranslation: 'Scrum определяет четыре церемонии, структурирующие спринт. Планирование спринта открывает каждый спринт: команда отбирает задачи из бэклога продукта и берёт обязательство выполнить их в рамках спринта. Ежедневный стендап — короткое 15-минутное совещание для синхронизации, на котором каждый участник команды отвечает на три вопроса: что сделал вчера, над чем работаю сегодня и есть ли препятствия, блокирующие мою работу? Обзор спринта — демонстрация выполненной работы заинтересованным сторонам в конце спринта. Наконец, ретроспектива спринта — это сессия рефлексии команды, направленная на улучшение процессов в следующем спринте.'
    },
    {
      id: 10,
      title: 'Translate: Tech leadership excerpt',
      type: 'practice',
      description: 'Переведи отрывок о технологическом лидерстве с английского на русский.',
      solution: 'Ключи перевода для leadership текстов:\n"technical lead" = технический руководитель\n"stakeholder" = заинтересованная сторона\n"cross-functional" = межфункциональный\n"align" = согласовать/выравнивать\n"ownership" = ответственность/владение\n\nСравни с образцом перевода в уроке.',
      sourceLanguage: 'Russian',
      targetLanguage: 'English',
      text: 'Хороший технический руководитель знает, когда нужно принять решение самостоятельно, а когда вынести его на обсуждение команды. Решения, связанные с архитектурой системы или выбором технологий, как правило, требуют коллективного обсуждения — слишком высоки ставки и слишком широки долгосрочные последствия, чтобы один человек мог учесть все аспекты. Тактические же решения, такие как выбор имени переменной или структуры конкретного класса, должны оставаться в компетенции разработчика, непосредственно работающего над задачей.',
      sampleTranslation: 'A good technical leader knows when to make a decision independently and when to bring it to the team for discussion. Decisions related to system architecture or technology selection typically require collective discussion — the stakes are too high and the long-term consequences too wide-reaching for a single person to consider all aspects. Tactical decisions, however, such as naming a variable or structuring a specific class, should remain within the discretion of the developer working directly on the task.',
      notes: ['"слишком высоки ставки" — "the stakes are too high"', '"в компетенции" — "within the discretion of" или "up to"', '"непосредственно работающего" — "working directly on"']
    }
  ]
}
