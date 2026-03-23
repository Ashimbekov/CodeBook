export default {
  id: 20,
  title: 'Collocations: make/do/take/give in IT',
  description: 'Коллокации — устойчивые словосочетания с глаголами make, do, take, give. В IT-английском они встречаются повсюду.',
  lessons: [
    {
      id: 1,
      title: 'What are collocations?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Коллокация — это пара или группа слов, которые естественно сочетаются вместе. Например, мы говорим "make a decision" (не "do a decision") или "take a break" (не "make a break"). Знание коллокаций делает речь естественной.' },
        { type: 'heading', value: 'Why collocations matter in IT' },
        { type: 'text', value: 'В IT-общении ошибки в коллокациях сразу слышны носителям языка. Говоря правильно "make a request" вместо "do a request", ты звучишь профессионально.' },
        { type: 'heading', value: 'MAKE collocations in IT' },
        { type: 'list', items: [
          'make a request — отправить запрос ("The client makes an API request")',
          'make a commit — сделать коммит ("Make a commit before the end of the day")',
          'make a decision — принять решение ("We need to make a decision about the architecture")',
          'make a change — внести изменение ("Make a change to the config file")',
          'make an assumption — сделать предположение ("Don\'t make assumptions about the input data")',
          'make progress — делать прогресс ("We\'re making good progress on the migration")',
          'make a mistake — сделать ошибку ("Everyone makes mistakes in code")',
          'make a backup — сделать резервную копию ("Always make a backup before deploying")'
        ]},
        { type: 'tip', value: 'MAKE обычно используется, когда что-то создаётся или производится. Представь, что ты "создаёшь" запрос, коммит, резервную копию.' }
      ]
    },
    {
      id: 2,
      title: 'DO collocations in IT',
      type: 'theory',
      content: [
        { type: 'text', value: 'DO используется для обозначения действий, задач, работы — того, что выполняется как процесс.' },
        { type: 'heading', value: 'DO collocations' },
        { type: 'list', items: [
          'do a code review — провести код-ревью ("Can you do a code review on my PR?")',
          'do testing — проводить тестирование ("QA is doing testing on the new build")',
          'do research — проводить исследование ("I need to do some research on this library")',
          'do refactoring — проводить рефакторинг ("Let\'s do some refactoring this sprint")',
          'do a demo — сделать демонстрацию ("We\'ll do a demo for the stakeholders")',
          'do debugging — проводить отладку ("I\'ve been doing debugging all morning")',
          'do an update — выполнить обновление ("Do an update on all dependencies")',
          'do your best — стараться ("Just do your best with the given time")'
        ]},
        { type: 'note', value: 'DO часто используется с существительными, обозначающими процессы или задачи: research, testing, debugging, refactoring.' }
      ]
    },
    {
      id: 3,
      title: 'TAKE collocations in IT',
      type: 'theory',
      content: [
        { type: 'text', value: 'TAKE передаёт идею "взять", "воспользоваться", "занять время".' },
        { type: 'heading', value: 'TAKE collocations' },
        { type: 'list', items: [
          'take a break — сделать перерыв ("Let\'s take a break and come back to this bug")',
          'take responsibility — взять ответственность ("Take responsibility for your code")',
          'take into account — принять во внимание ("Take performance into account when designing")',
          'take a look — посмотреть ("Can you take a look at this error?")',
          'take time — занимать время ("This migration will take time")',
          'take notes — делать заметки ("Take notes during the architecture meeting")',
          'take action — предпринять действие ("We need to take action on this vulnerability")',
          'take ownership — взять владение, ответственность ("Take ownership of this microservice")'
        ]},
        { type: 'tip', value: '"Take ownership" — очень популярное выражение в IT-компаниях. Означает принять полную ответственность за какой-то компонент или задачу.' }
      ]
    },
    {
      id: 4,
      title: 'GIVE collocations in IT',
      type: 'theory',
      content: [
        { type: 'text', value: 'GIVE означает передачу чего-то — информации, возможности, обратной связи.' },
        { type: 'heading', value: 'GIVE collocations' },
        { type: 'list', items: [
          'give feedback — дать обратную связь ("Give feedback on the pull request")',
          'give an example — привести пример ("Give an example of when you\'d use this pattern")',
          'give access — предоставить доступ ("Give the new developer access to the repository")',
          'give a presentation — сделать презентацию ("She will give a presentation on microservices")',
          'give a warning — предупредить ("The linter gives a warning on this line")',
          'give priority — приоритизировать ("Give priority to critical bugs")',
          'give a try — попробовать ("Give the new framework a try")',
          'give an update — дать обновление, рассказать о статусе ("Give an update at the standup")'
        ]},
        { type: 'note', value: '"Give feedback" и "give an update" — обязательные выражения для стендапов и ревью. Используй их ежедневно.' }
      ]
    },
    {
      id: 5,
      title: 'Mixed collocations: common mistakes',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим типичные ошибки, которые делают русскоязычные разработчики при использовании коллокаций.' },
        { type: 'heading', value: 'Common mistakes' },
        { type: 'list', items: [
          'WRONG: "do a request" / RIGHT: "make a request"',
          'WRONG: "make testing" / RIGHT: "do testing"',
          'WRONG: "do a mistake" / RIGHT: "make a mistake"',
          'WRONG: "make a break" / RIGHT: "take a break"',
          'WRONG: "do a decision" / RIGHT: "make a decision"',
          'WRONG: "take a look on" / RIGHT: "take a look at"',
          'WRONG: "give a commit" / RIGHT: "make a commit"',
          'WRONG: "do a backup" / RIGHT: "make a backup"'
        ]},
        { type: 'heading', value: 'More collocations to know' },
        { type: 'list', items: [
          'run tests — запустить тесты (не "do tests")',
          'write code — писать код (не "make code")',
          'fix a bug — исправить баг (не "make a bug fix")',
          'deploy code — деплоить код',
          'raise an issue — поднять вопрос/проблему',
          'submit a PR — отправить пулл-реквест'
        ]},
        { type: 'tip', value: 'Когда сомневаешься, используй Google или Grammarly для проверки коллокации. Со временем правильные сочетания станут интуитивными.' }
      ]
    },
    {
      id: 6,
      title: 'Practice: Choose make/do/take/give',
      type: 'practice',
      difficulty: 'medium',
      description: 'Выбери правильный глагол для каждой коллокации.',
      solution: 'Правильные ответы:\n1. Do (do a code review — ревью это процесс/задача)\n2. Make (make a backup — бэкап создаётся)\n3. Take (take your time — устойчивая фраза)\n4. Give (give feedback — обратная связь передаётся)\n5. Make (make a decision — принять решение)',
      tasks: [
        {
          question: '_____ a code review on this pull request.',
          options: ['Make', 'Do', 'Take', 'Give'],
          correct: 1,
          explanation: '"Do a code review" — правильная коллокация. Код-ревью — это процесс/задача, поэтому используем DO.'
        },
        {
          question: 'Always _____ a backup before running migrations.',
          options: ['Make', 'Do', 'Take', 'Give'],
          correct: 0,
          explanation: '"Make a backup" — бэкап — это то, что создаётся, поэтому MAKE.'
        },
        {
          question: '_____ your time, there\'s no rush with this refactoring.',
          options: ['Make', 'Do', 'Take', 'Give'],
          correct: 2,
          explanation: '"Take your time" — не торопись. TAKE используется в этой устойчивой фразе.'
        },
        {
          question: 'Can you _____ feedback on my design proposal?',
          options: ['Make', 'Do', 'Take', 'Give'],
          correct: 3,
          explanation: '"Give feedback" — дать обратную связь. Обратная связь передаётся, поэтому GIVE.'
        },
        {
          question: 'We need to _____ a decision about the database before Friday.',
          options: ['Make', 'Do', 'Take', 'Give'],
          correct: 0,
          explanation: '"Make a decision" — принять решение. Это устойчивая коллокация с MAKE.'
        }
      ]
    },
    {
      id: 7,
      title: 'Practice: Collocations in sentences',
      type: 'practice',
      difficulty: 'hard',
      description: 'Заполни пропуски, используя правильную коллокацию из этого модуля.',
      solution: 'Правильные ответы:\n1. hit the ground running (начать работу сразу с отдачей)\n2. take a look (TAKE + a look = посмотреть)\n3. give feedback (GIVE + feedback = дать обратную связь)\n4. take into account (TAKE + into account = принять во внимание)',
      tasks: [
        {
          sentence: 'The new developer will _____ on his first day without any hand-holding.',
          expectedPhrase: 'hit the ground running',
          hint: 'Идиома из предыдущего модуля: начать работу сразу с отдачей'
        },
        {
          sentence: 'I\'ll _____ at the logs and see what caused the crash.',
          expectedPhrase: 'take a look',
          hint: 'TAKE + a look = посмотреть'
        },
        {
          sentence: 'Before we merge, can someone _____ on my changes?',
          expectedPhrase: 'give feedback',
          hint: 'GIVE + feedback = дать обратную связь'
        },
        {
          sentence: 'We must _____ security when designing the new authentication flow.',
          expectedPhrase: 'take into account',
          hint: 'TAKE + into account = принять во внимание'
        }
      ]
    }
  ]
}
