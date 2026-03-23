export default {
  id: 6,
  title: 'Modal Verbs: must, should, have to',
  description: 'Модальные глаголы: обязательство, советы, необходимость в IT-контексте.',
  lessons: [
    {
      id: 1,
      title: 'Must: сильное обязательство',
      type: 'theory',
      content: [
        { type: 'text', value: 'MUST используется для:\n1. Сильного обязательства или необходимости (исходит от говорящего)\n2. Логического вывода (почти уверен в чём-то)\n\nФорма: must + инфинитив (без to)\nОтрицание: must not (mustn\'t) — нельзя, запрещено!\n\nВажно: Must не имеет формы прошедшего или будущего времени.\nДля прошедшего используем: had to\nДля будущего: will have to' },
        { type: 'heading', value: 'Must: обязательство' },
        { type: 'text', value: 'You must write unit tests for your code. (Ты должен писать юнит-тесты для своего кода.)\nAll developers must follow the coding standards. (Все разработчики должны следовать стандартам кодирования.)\nYou must not push to main without a code review. (Нельзя пушить в main без код-ревью.)\nPasswords must be at least 12 characters long. (Пароли должны содержать не менее 12 символов.)\nSensitive data must be encrypted. (Конфиденциальные данные должны быть зашифрованы.)' },
        { type: 'heading', value: 'Must: логический вывод' },
        { type: 'text', value: 'The server is very slow — there must be a memory leak. (Сервер очень медленный — должно быть, утечка памяти.)\nThe build passed — the fix must be correct. (Билд прошёл — исправление должно быть верным.)\nHe hasn\'t responded in 3 hours — he must be in a meeting. (Он не отвечал 3 часа — должно быть, он на митинге.)' }
      ]
    },
    {
      id: 2,
      title: 'Should: совет и рекомендация',
      type: 'theory',
      content: [
        { type: 'text', value: 'SHOULD используется для:\n1. Советов и рекомендаций\n2. Мнения о правильных действиях\n3. Ожиданий (что-то должно произойти)\n\nФорма: should + инфинитив (без to)\nОтрицание: should not (shouldn\'t)\n\nShould мягче, чем must — это совет, а не строгое обязательство.' },
        { type: 'heading', value: 'IT-примеры: советы и рекомендации' },
        { type: 'text', value: 'You should write documentation for your code. (Тебе следует писать документацию к коду.)\nWe should refactor this module — it\'s getting too complex. (Нам следует отрефакторить этот модуль — он становится слишком сложным.)\nYou shouldn\'t use global variables. (Не следует использовать глобальные переменные.)\nThe team should do code reviews more carefully. (Команде следует проводить код-ревью более тщательно.)\nYou should update your dependencies regularly. (Следует регулярно обновлять зависимости.)\nWe should consider using a caching layer. (Нам следует рассмотреть использование слоя кэширования.)\nYou shouldn\'t ignore linting warnings. (Не следует игнорировать предупреждения линтера.)\nThe deployment should take about 10 minutes. (Деплой должен занять около 10 минут.)' }
      ]
    },
    {
      id: 3,
      title: 'Have to: внешняя необходимость',
      type: 'theory',
      content: [
        { type: 'text', value: 'HAVE TO используется для:\n1. Обязательства, исходящего извне (правила, требования, обстоятельства)\n2. В отличие от must (личное ощущение необходимости), have to — внешние требования\n\nФорма: have to/has to + инфинитив\nОтрицание: don\'t have to / doesn\'t have to — НЕТ обязательства (не нужно)\n\nВажно: don\'t have to ≠ mustn\'t!\ndon\'t have to = не нужно (свобода выбора)\nmustn\'t = нельзя (запрет)' },
        { type: 'heading', value: 'IT-примеры' },
        { type: 'text', value: 'We have to use the company\'s coding standards. (Мы должны использовать стандарты кодирования компании. — это требование компании)\nShe has to attend the daily standup every morning. (Ей нужно присутствовать на ежедневном стендапе каждое утро.)\nYou don\'t have to use this library — it\'s optional. (Тебе не нужно использовать эту библиотеку — это необязательно.)\nDo I have to write tests for this feature? (Мне нужно писать тесты для этой функции?)\nDevelopers have to get approval before merging to main. (Разработчики должны получить одобрение перед слиянием в main.)\nYou don\'t have to comment every line, just the complex ones. (Не нужно комментировать каждую строку, только сложные.)' },
        { type: 'heading', value: 'Must vs Have to' },
        { type: 'text', value: 'Must — личное ощущение обязательства:\nI must fix this bug today. (Я должен исправить этот баг сегодня. — сам так считаю)\n\nHave to — внешнее требование:\nI have to fix this bug today. (Мне нужно исправить этот баг сегодня. — клиент требует / дедлайн)' }
      ]
    },
    {
      id: 4,
      title: 'Need to: необходимость',
      type: 'theory',
      content: [
        { type: 'text', value: 'NEED TO — дополнительный способ выразить необходимость, близок к have to.\n\nФорма: need to + инфинитив\nОтрицание: don\'t need to / doesn\'t need to (не нужно)\n\nWe need to optimize the database queries. (Нам нужно оптимизировать запросы к БД.)\nYou need to restart the service after this change. (Тебе нужно перезапустить сервис после этого изменения.)\nShe doesn\'t need to attend every meeting. (Ей не нужно присутствовать на каждом митинге.)\nDo you need to have admin access for this? (Тебе нужен доступ администратора для этого?)' },
        { type: 'heading', value: 'Сравнительная таблица' },
        { type: 'text', value: 'Сила обязательства от большего к меньшему:\n\n1. must / mustn\'t — строгое обязательство/запрет\nYou must not share your password. (Категорически нельзя!)\n\n2. have to / need to — необходимость (внешняя)\nYou have to submit the report by Friday. (Требование)\n\n3. should — совет, рекомендация\nYou should add error handling. (Рекомендация)\n\n4. don\'t have to / don\'t need to — нет обязательства\nYou don\'t have to use this approach. (Свобода выбора)' },
        { type: 'heading', value: 'Диалог' },
        { type: 'text', value: 'New Developer: Do I have to use the company\'s IDE? (Мне нужно использовать IDE компании?)\nSenior Dev: No, you don\'t have to. You can use any editor. But you must install our linting tools. (Нет, не обязательно. Можешь использовать любой редактор. Но ты должен установить наши инструменты линтинга.)\nNew Developer: Should I also read the architecture docs? (Мне также следует прочитать архитектурную документацию?)\nSenior Dev: Yes, you should definitely read them before starting. (Да, тебе определённо следует прочитать их перед началом.)' }
      ]
    },
    {
      id: 5,
      title: 'Словарный запас: правила и рекомендации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Глаголы и фразы:\nrequire (требовать) — This process requires admin rights.\nrecommend (рекомендовать) — I recommend using PostgreSQL.\nadvise (советовать) — I advise you to test this thoroughly.\nwarn (предупреждать) — I warn you not to delete this file.\nallow (разрешать) — We allow remote deployments on Fridays.\nforbid/prohibit (запрещать) — We prohibit committing secrets.\n\nПолезные существительные:\nrule (правило), policy (политика/правила), guideline (руководство), requirement (требование), recommendation (рекомендация), best practice (лучшая практика), standard (стандарт), convention (соглашение)' },
        { type: 'heading', value: 'Фразы для советов в IT' },
        { type: 'text', value: 'You should always use version control. (Всегда следует использовать систему контроля версий.)\nIt\'s best practice to write tests. (Лучшая практика — писать тесты.)\nI recommend using Docker for local development. (Рекомендую использовать Docker для локальной разработки.)\nMake sure you back up the database before migration. (Убедитесь, что делаете бэкап базы данных перед миграцией.)\nAlways validate user input on the server side. (Всегда проверяйте ввод пользователя на стороне сервера.)' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Выбор модального глагола',
      type: 'practice',
      content: [
        { type: 'text', value: 'Выберите правильный модальный глагол: must, should, have to, don\'t have to, mustn\'t.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'You ___ commit secrets to the repository. It\'s a security violation!', answer: 'mustn\'t' },
            { id: 2, question: 'You ___ write documentation, but it\'s highly recommended.', answer: 'don\'t have to' },
            { id: 3, question: 'The server ___ be restarted — the memory usage is at 100%.', answer: 'must' },
            { id: 4, question: 'All new features ___ have unit tests. It\'s our company policy.', answer: 'must / have to' },
            { id: 5, question: 'You ___ use this library — there are better alternatives.', answer: 'shouldn\'t' },
            { id: 6, question: 'I ___ submit this by Friday — the client is waiting.', answer: 'have to' },
            { id: 7, question: 'There ___ be a bug here — the tests are all passing.', answer: 'must' },
            { id: 8, question: 'You ___ attend the optional workshop, but it would be useful.', answer: 'don\'t have to' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Перевод и написание правил',
      type: 'practice',
      content: [
        { type: 'text', value: 'Часть 1: Переведите на английский.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Ты должен протестировать это перед деплоем.', answer: 'You must test this before deploying.' },
            { id: 2, question: 'Тебе следует использовать более описательные имена переменных.', answer: 'You should use more descriptive variable names.' },
            { id: 3, question: 'Нам не нужно использовать этот фреймворк — это опционально.', answer: 'We don\'t have to use this framework — it\'s optional.' },
            { id: 4, question: 'Все API-эндпоинты должны иметь аутентификацию.', answer: 'All API endpoints must have authentication.' },
            { id: 5, question: 'Тебе следует прочитать документацию перед установкой.', answer: 'You should read the documentation before installation.' }
          ]
        },
        { type: 'text', value: 'Часть 2: Напишите 3 правила для разработчиков в вашей команде, используя must/should/have to.' },
        {
          type: 'exercise',
          subtype: 'writing',
          items: [
            { id: 1, question: 'Напишите 3 правила команды с must/should/have to', answer: 'Пример: Developers must write unit tests. You should review at least 2 PRs per week. Every developer has to attend the weekly sync.' }
          ]
        }
      ]
    }
  ]
}
