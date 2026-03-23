export default {
  id: 1,
  title: 'Все времена: нюансы и исключения',
  description: 'Тонкости использования всех английских времён с акцентом на IT-контекст',
  lessons: [
    {
      id: 1,
      title: 'Present Simple vs Present Continuous: нюансы',
      type: 'theory',
      content: [
        { type: 'text', value: 'На уровне B2 важно понимать тонкие различия между временами, а не просто знать базовые правила.' },
        { type: 'heading', value: 'Present Simple для постоянных истин и расписаний' },
        { type: 'text', value: 'Используем для фактов, которые всегда истинны, и официальных расписаний:\n"The server returns a 404 error when the resource is not found."\n"The deployment pipeline runs every night at 2 AM."' },
        { type: 'heading', value: 'Present Continuous для временных ситуаций и раздражения' },
        { type: 'text', value: 'Для временных процессов и (с always) для выражения раздражения:\n"We are currently migrating to microservices." (временный процесс)\n"He is always pushing broken code!" (раздражение)' },
        { type: 'tip', value: 'В IT-документации почти всегда используется Present Simple: "The function returns...", "The API accepts...", "The service handles..."' },
        { type: 'heading', value: 'Stative verbs — глаголы состояния' },
        { type: 'text', value: 'Эти глаголы обычно не используются в Continuous: know, understand, believe, contain, mean, seem.\nНЕПРАВИЛЬНО: "I am knowing the answer."\nПРАВИЛЬНО: "I know the answer."' },
        { type: 'warning', value: 'Некоторые глаголы могут быть как stative, так и dynamic:\n"I think this approach is wrong." (мнение — stative)\n"I am thinking about the solution." (активный процесс — dynamic)' },
        { type: 'note', value: 'В технических статьях и документации авторы часто используют Present Simple даже для описания действий: "The algorithm sorts the array in O(n log n) time."' }
      ]
    },
    {
      id: 2,
      title: 'Past Simple vs Present Perfect: ключевые отличия',
      type: 'theory',
      content: [
        { type: 'text', value: 'Это одно из самых частых источников ошибок для русскоговорящих. В русском языке нет Present Perfect, поэтому мозг автоматически тянется к прошедшему времени.' },
        { type: 'heading', value: 'Past Simple — конкретное завершённое действие' },
        { type: 'text', value: 'Используется, когда время действия известно или указано:\n"We deployed the fix yesterday at 3 PM."\n"The server crashed last Friday."\n"I learned Python in 2019."' },
        { type: 'heading', value: 'Present Perfect — связь с настоящим' },
        { type: 'text', value: 'Используется, когда действие имеет отношение к настоящему моменту:\n"We have just deployed the fix." (только что, эффект виден сейчас)\n"Have you ever worked with Kubernetes?" (опыт в жизни)\n"The server has been down since morning." (началось в прошлом, продолжается)' },
        { type: 'tip', value: 'Маркеры времени помогают выбрать правильное время:\nPast Simple: yesterday, last week, in 2020, ago, when\nPresent Perfect: just, already, yet, ever, never, recently, since, for' },
        { type: 'code', language: 'text', value: 'IT-пример:\n"Did you fix the bug?" (Past Simple — интересует факт)\n"Have you fixed the bug?" (Present Perfect — важен результат сейчас)' },
        { type: 'note', value: 'В американском английском часто используют Past Simple там, где британский вариант требует Present Perfect: "Did you eat already?" (AmE) vs "Have you eaten already?" (BrE)' }
      ]
    },
    {
      id: 3,
      title: 'Past Perfect и Past Perfect Continuous',
      type: 'theory',
      content: [
        { type: 'text', value: 'Past Perfect используется для действий, которые произошли ДО другого действия в прошлом. Это "прошлое прошлого".' },
        { type: 'heading', value: 'Past Perfect — действие до другого прошлого' },
        { type: 'text', value: '"By the time the team noticed the bug, it had already corrupted half the data."\n"The deployment had failed because someone had forgotten to update the config."\n"I realized I had pushed to the wrong branch."' },
        { type: 'heading', value: 'Past Perfect Continuous — длительность до прошлого момента' },
        { type: 'text', value: 'Акцент на продолжительности действия, которое шло до определённого момента в прошлом:\n"The service had been running without issues for three months before the outage."\n"We had been working on the feature for two weeks when the requirements changed."' },
        { type: 'tip', value: 'Past Perfect часто используется при описании инцидентов и постмортемов:\n"At the time of the outage, the team had already been debugging the issue for 4 hours.\nThe problem had started with a misconfigured load balancer."' },
        { type: 'warning', value: 'Не злоупотребляйте Past Perfect. Если последовательность действий очевидна из контекста (особенно с before/after), можно использовать Past Simple:\n"After we fixed the bug, we deployed the update." (без Past Perfect — порядок ясен)' }
      ]
    },
    {
      id: 4,
      title: 'Future tenses: нюансы выбора',
      type: 'theory',
      content: [
        { type: 'text', value: 'В английском языке несколько способов выразить будущее, и выбор зависит от контекста и намерения говорящего.' },
        { type: 'heading', value: 'Will — решения в момент речи, предсказания' },
        { type: 'text', value: '"I will help you debug this." (решение принято прямо сейчас)\n"This approach will scale well." (предсказание, уверенность)\n"The service will be unavailable from 2 to 4 AM." (официальное уведомление)' },
        { type: 'heading', value: 'Going to — намерения и очевидные прогнозы' },
        { type: 'text', value: '"We are going to refactor the authentication module next sprint." (уже запланировано)\n"Look at the memory usage — the server is going to crash." (очевидно из текущей ситуации)' },
        { type: 'heading', value: 'Present Continuous — личные договорённости' },
        { type: 'text', value: '"We are meeting with the client on Thursday." (встреча уже назначена)\n"I am presenting the architecture at 10 AM." (договорённость существует)' },
        { type: 'heading', value: 'Future Perfect и Future Continuous' },
        { type: 'text', value: '"By next Monday, we will have migrated all services to Kubernetes." (будет завершено к сроку)\n"This time next week, we will be running the load tests." (будет в процессе в конкретный момент)' },
        { type: 'tip', value: 'В IT-планировании:\n- Roadmap: "We will release v2.0 in Q3."\n- Sprint planning: "We are implementing the login feature this sprint."\n- Deadlines: "The API will be ready by the end of the week."' }
      ]
    },
    {
      id: 5,
      title: 'Continuous tenses: акцент на длительности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Все Continuous времена объединяет одно: акцент на процессе, длительности, временном характере действия.' },
        { type: 'heading', value: 'Когда НЕ используется Continuous' },
        { type: 'list', items: [
          'Stative verbs: know, understand, believe, prefer, hate, love, contain, mean',
          'Математические и научные факты: "Two plus two equals four."',
          'Официальные объявления: "The conference starts at 9 AM."',
          'Повторяющиеся действия с always (без эмоции): "She always arrives on time."'
        ]},
        { type: 'heading', value: 'Present Perfect Continuous — важность длительности' },
        { type: 'text', value: '"I have been coding for 8 hours." (акцент на продолжительности, я устал)\n"We have been experiencing performance issues." (проблема продолжается, последствия видны)\n"How long have you been working on this ticket?" (вопрос о длительности)' },
        { type: 'tip', value: 'Разница между Present Perfect и Present Perfect Continuous:\n"I have written the documentation." (готово, результат важен)\n"I have been writing the documentation." (процесс занял время, может быть незавершён)' },
        { type: 'note', value: 'В технических отчётах Present Perfect Continuous часто передаёт ongoing проблемы:\n"Users have been reporting slow response times since the last deployment."' }
      ]
    },
    {
      id: 6,
      title: 'Практика: выбор времён в IT-контексте',
      type: 'practice',
      difficulty: 'medium',
      description: 'Выберите правильное время глагола в предложениях на IT-тематику.',
      requirements: [
        'Определите правильное время для каждого предложения',
        'Объясните свой выбор',
        'Обратите внимание на маркеры времени'
      ],
      questions: [
        { text: 'By the time you read this email, we ___ (deploy) the hotfix.', answer: 'will have deployed', explanation: 'Future Perfect — действие завершится к моменту в будущем' },
        { text: 'The team ___ (work) on this feature for three weeks when the client changed the requirements.', answer: 'had been working', explanation: 'Past Perfect Continuous — длительный процесс до прошлого момента' },
        { text: 'I just ___ (push) the latest changes to the repository.', answer: 'have pushed', explanation: 'Present Perfect с "just" — недавнее действие с текущей релевантностью' }
      ],
      solution: 'Правильные ответы:\n1. will have deployed\n2. had been working\n3. have pushed',
      hint: 'Обратите внимание на временные маркеры: "by the time" (Future/Past Perfect), "when" с прошедшим (Past Perfect), "just" (Present Perfect).',
      explanation: 'Выбор времени зависит от: 1) когда происходит действие, 2) завершено ли оно, 3) важна ли продолжительность, 4) есть ли связь с другим временным планом.'
    },
    {
      id: 7,
      title: 'Практика: нарратив об инциденте',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите короткий постмортем инцидента, используя разные прошедшие времена.',
      requirements: [
        'Используйте минимум 3 разных прошедших времени',
        'Опишите последовательность событий чётко',
        'Включите фразы: "by the time", "had already", "had been running"'
      ],
      hint: 'Структура постмортема: что случилось, когда обнаружили, что предшествовало инциденту, как исправили.',
      solution: 'On March 15, the payment service went down at 14:32 UTC. By the time the on-call engineer noticed the alerts, the service had been down for 12 minutes. Investigation revealed that a misconfigured load balancer had been routing all traffic to a single instance. The instance had already exhausted its memory by 14:28. The team restored service by 14:55 by reverting the load balancer configuration.',
      explanation: 'В постмортемах используется смесь времён: Past Simple для конкретных событий с временными метками, Past Perfect для событий, предшествующих основному инциденту, Past Perfect Continuous для длительных процессов до момента инцидента.'
    },
    {
      id: 8,
      title: 'Практика: тест на все времена',
      type: 'practice',
      difficulty: 'hard',
      description: 'Комплексный тест на знание всех английских времён в IT-контексте.',
      requirements: [
        'Заполните пропуски в диалоге',
        'Каждый ответ объясните',
        'Проверьте согласование времён'
      ],
      questions: [
        { text: 'A: "How long ___ you ___ (use) TypeScript?"\nB: "I ___ (start) using it in 2021, so I ___ (use) it for about 4 years."', answer: 'have you been using / started / have been using', explanation: 'Вопрос о длительности — Present Perfect Continuous; конкретное прошлое — Past Simple; длительность до сих пор — Present Perfect Continuous' }
      ],
      solution: 'Правильные ответы:\n1. have you been using / started / have been using',
      hint: 'Обратите внимание на вопрос "How long" — он почти всегда требует Present Perfect или Present Perfect Continuous.',
      explanation: 'Владение временами позволяет точно передавать информацию о событиях. В IT-общении точность формулировок критически важна — особенно при описании инцидентов, планировании и отчётности.'
    }
  ]
}
