export default {
  id: 31,
  title: 'Practice: Phrasal Verbs and Idioms',
  description: 'Практические упражнения на фразовые глаголы и идиомы в IT-контексте. Значения, примеры и упражнения на заполнение пропусков.',
  lessons: [
    {
      id: 1,
      title: 'Phrasal verbs: set up, set out, set back',
      type: 'practice',
      description: 'Изучи фразовые глаголы с SET и выполни упражнения.',
      solution: 'Правильные ответы к упражнениям:\n1. set up (настроить staging environment)\n2. set back (задержало release на неделю)',
      tasks: [
        { verb: 'set up', meaning: 'настроить, организовать', example: '"Set up the development environment before the team arrives."', itContext: 'Set up a CI/CD pipeline, set up a server, set up a meeting.' },
        { verb: 'set out', meaning: 'изложить, описать; отправиться', example: '"The spec sets out the requirements clearly."', itContext: 'Set out the architecture, set out the goals in a document.' },
        { verb: 'set back', meaning: 'задержать, откатить назад', example: '"The dependency issue set our deployment back by two days."', itContext: 'Bugs that set back the release schedule.' },
        { verb: 'set aside', meaning: 'отложить в сторону', example: '"Let\'s set aside the performance issues for now and focus on correctness."', itContext: 'Set aside technical debt for later.' }
      ],
      exercises: [
        {
          sentence: 'We need to _____ a staging environment before the demo.',
          answer: 'set up',
          hint: 'Настроить/создать среду'
        },
        {
          sentence: 'The unexpected security audit _____ our release by a week.',
          answer: 'set back',
          hint: 'Задержало выпуск'
        }
      ]
    },
    {
      id: 2,
      title: 'Phrasal verbs: break down, break through, break out',
      type: 'practice',
      description: 'Изучи фразовые глаголы с BREAK и выполни упражнения.',
      solution: 'Правильные ответы к упражнениям:\n1. break down (разбить epic на user stories)\n2. break out (выделить payment logic в отдельный микросервис)',
      tasks: [
        { verb: 'break down', meaning: 'разобрать на части; сломаться', example: '"Let me break down the problem into smaller tasks."', itContext: 'Break down a user story, the server broke down.' },
        { verb: 'break through', meaning: 'прорваться, преодолеть', example: '"We finally broke through the performance barrier."', itContext: 'Breaking through a scalability limit.' },
        { verb: 'break out', meaning: 'выделить в отдельное; вырваться', example: '"We should break out the auth logic into a separate service."', itContext: 'Breaking out a module into a microservice.' },
        { verb: 'break in', meaning: 'взломать; прервать', example: '"An attacker tried to break in to our system."', itContext: 'Security breach, break into a conversation.' }
      ],
      exercises: [
        {
          sentence: 'Please _____ the epic into individual user stories we can estimate.',
          answer: 'break down',
          hint: 'Разбить на части'
        },
        {
          sentence: 'We decided to _____ the payment logic into its own microservice.',
          answer: 'break out',
          hint: 'Выделить отдельно'
        }
      ]
    },
    {
      id: 3,
      title: 'Phrasal verbs: roll out, roll back, roll up',
      type: 'practice',
      description: 'Изучи фразовые глаголы с ROLL и выполни упражнения.',
      solution: 'Правильные ответы к упражнениям:\nroll out — постепенно выпускать\nroll back — откатить к предыдущей версии\nroll up — свернуть/объединить',
      tasks: [
        { verb: 'roll out', meaning: 'постепенно развернуть, выпустить', example: '"We\'ll roll out the feature to 10% of users first."', itContext: 'Canary deployment, gradual rollout.' },
        { verb: 'roll back', meaning: 'откатить изменения', example: '"The deployment failed, so we had to roll back to version 2.1."', itContext: 'Database rollback, deployment rollback.' },
        { verb: 'roll up', meaning: 'агрегировать, свернуть', example: '"Roll up the individual metrics into a dashboard summary."', itContext: 'Aggregating data, summarizing.' }
      ],
      exercises: [
        {
          sentence: 'After the production incident, we immediately _____ to the previous stable version.',
          answer: 'rolled back',
          hint: 'Вернули предыдущую версию'
        },
        {
          sentence: 'We\'ll _____ the new feature gradually, starting with internal users.',
          answer: 'roll out',
          hint: 'Постепенный выпуск'
        }
      ]
    },
    {
      id: 4,
      title: 'Phrasal verbs: look into, look up, look over',
      type: 'practice',
      description: 'Изучи фразовые глаголы с LOOK и выполни упражнения.',
      solution: 'Правильные ответы к упражнениям:\nlook into — исследовать проблему\nlook up — найти информацию\nlook over — просмотреть, проверить',
      tasks: [
        { verb: 'look into', meaning: 'исследовать, изучить', example: '"I\'ll look into why the tests are failing."', itContext: 'Investigating bugs, researching solutions.' },
        { verb: 'look up', meaning: 'найти информацию; улучшаться', example: '"Look up the function signature in the documentation."', itContext: 'Looking up docs, looking up error codes.' },
        { verb: 'look over', meaning: 'просмотреть, проверить', example: '"Can you look over my code before I submit the PR?"', itContext: 'Reviewing code, checking documents.' },
        { verb: 'look ahead', meaning: 'смотреть вперёд, планировать', example: '"Looking ahead to Q3, we need to plan the migration."', itContext: 'Sprint planning, roadmap discussions.' }
      ],
      exercises: [
        {
          sentence: 'I\'ll _____ the performance issue and get back to you by end of day.',
          answer: 'look into',
          hint: 'Изучить/исследовать проблему'
        },
        {
          sentence: 'Could you _____ my PR description before I share it with the team?',
          answer: 'look over',
          hint: 'Проверить/просмотреть'
        }
      ]
    },
    {
      id: 5,
      title: 'IT idioms: time and work',
      type: 'practice',
      description: 'Изучи IT-идиомы о времени и работе.',
      solution: 'Ключевые идиомы:\nhit the ground running — начать продуктивно сразу\nworking against the clock — работа в условиях острой нехватки времени\nin the home stretch — на финишной прямой\nbuy time — выиграть время\non the same page — одно понимание ситуации',
      tasks: [
        { idiom: 'on the clock', meaning: 'считая рабочее время, когда таймер идёт', example: '"We\'re on the clock — the client needs this in 2 hours."' },
        { idiom: 'against the clock', meaning: 'в гонке со временем', example: '"The team worked against the clock to fix the production bug."' },
        { idiom: 'buy time', meaning: 'выиграть время', example: '"We deployed a hotfix to buy time while we work on the proper solution."' },
        { idiom: 'race to the finish', meaning: 'гонка к финишу, финальный рывок', example: '"It\'s a race to the finish — the release is tomorrow."' },
        { idiom: 'in the home stretch', meaning: 'на финишной прямой', example: '"We\'re in the home stretch — just three bugs left before release."' },
        { idiom: 'miss a deadline', meaning: 'пропустить дедлайн', example: '"If we miss the deadline, we lose the client."' }
      ]
    },
    {
      id: 6,
      title: 'IT idioms: problems and solutions',
      type: 'practice',
      description: 'Изучи IT-идиомы о проблемах и решениях.',
      solution: 'Ключевые идиомы:\nput out fires — тушить пожары (решать срочные проблемы)\nbandaid fix — временное решение\nkick the can down the road — откладывать неизбежное\nover-engineer — усложнить сверх необходимости\na can of worms — ящик Пандоры',
      tasks: [
        { idiom: 'throw under the bus', meaning: 'подставить коллегу, переложить вину', example: '"Don\'t throw your teammate under the bus — we\'re responsible as a team."' },
        { idiom: 'put out fires', meaning: 'тушить пожары — решать срочные проблемы', example: '"The senior engineer spent all day putting out fires instead of coding new features."' },
        { idiom: 'kick the can down the road', meaning: 'откладывать решение проблемы', example: '"We can\'t just kick the tech debt can down the road — it will catch up with us."' },
        { idiom: 'not rocket science', meaning: 'несложно, не высшая математика', example: '"Fixing this CSS bug is not rocket science — it\'s just a missing padding."' },
        { idiom: 'over-engineer', meaning: 'усложнить сверх необходимости', example: '"Don\'t over-engineer this feature — a simple if-else is enough."' }
      ]
    },
    {
      id: 7,
      title: 'Choose the correct idiom',
      type: 'practice',
      description: 'Выбери подходящую идиому для каждой ситуации.',
      solution: 'Правильные ответы:\n1. "They were working against the clock." (острая нехватка времени перед релизом)\n2. "He over-engineered it." (слишком сложное решение)\n3. "They were kicking the can down the road." (откладывали рефакторинг 3 квартала)',
      content: [
        { type: 'text', value: 'Выбери подходящую идиому для каждой ситуации.' }
      ],
      tasks: [
        {
          situation: 'Команда работала всю ночь, чтобы исправить критический баг перед релизом.',
          options: ['They were hitting the ground running.', 'They were working against the clock.', 'They were kicking the can down the road.'],
          correct: 1,
          explanation: '"Working against the clock" — работа в условиях острой нехватки времени.'
        },
        {
          situation: 'Разработчик добавил очень сложное решение для простой задачи.',
          options: ['He put out fires.', 'He over-engineered it.', 'He missed the deadline.'],
          correct: 1,
          explanation: '"Over-engineered" — сделал решение излишне сложным.'
        },
        {
          situation: 'Команда откладывала рефакторинг уже три квартала.',
          options: ['They were buying time.', 'They were kicking the can down the road.', 'They were in the home stretch.'],
          correct: 1,
          explanation: '"Kicking the can down the road" — постоянно откладывать неизбежное решение.'
        }
      ]
    },
    {
      id: 8,
      title: 'Phrasal verbs in conversation',
      type: 'practice',
      description: 'Заполни пропуски в диалоге подходящими фразовыми глаголами.',
      solution: 'Правильные ответы:\n1. down (broke down — сломалось)\n2. into (looking into — изучаю)\n3. down (break down — разобрать)\n4. over (look over — просмотреть)\n5. back (roll back — откатить)\n6. up (set up — настроить)',
      content: [
        { type: 'text', value: 'Заполни пропуски в диалоге подходящими фразовыми глаголами.' }
      ],
      dialogue: {
        text: 'Alex: "The deployment pipeline broke _____ yesterday. I\'ve been looking _____ the issue all morning."\nSam: "Any idea what caused it?"\nAlex: "Not yet. I\'ll break _____ the logs step by step. Can you look _____ the configuration file in the meantime?"\nSam: "Sure. Should we roll _____ to the previous config while we investigate?"\nAlex: "Let\'s set _____ a test environment first to reproduce the issue safely."',
        answers: ['down', 'into', 'down', 'over', 'back', 'up'],
        explanation: 'broke down (сломалось), looking into (изучаю), break down (разобрать), look over (просмотреть), roll back (откатить), set up (настроить)'
      }
    },
    {
      id: 9,
      title: 'Phrasal verbs: bring, take, run',
      type: 'practice',
      description: 'Изучи фразовые глаголы с BRING, TAKE, RUN и выполни упражнения.',
      solution: 'Правильные ответы к упражнениям:\n1. ran into (столкнулись с конфликтом зависимостей)\n2. ran out of (база данных исчерпала connections)',
      tasks: [
        { verb: 'bring up', meaning: 'поднять вопрос, упомянуть', example: '"I\'d like to bring up the performance issues in the retrospective."' },
        { verb: 'bring in', meaning: 'привлечь, задействовать', example: '"We should bring in a security consultant to review the code."' },
        { verb: 'take on', meaning: 'взять на себя задачу/ответственность', example: '"I can take on the database optimization task this sprint."' },
        { verb: 'take off', meaning: 'взлететь, резко вырасти', example: '"After the Product Hunt launch, our signups really took off."' },
        { verb: 'run into', meaning: 'столкнуться с (проблемой)', example: '"We ran into an issue with the third-party API rate limits."' },
        { verb: 'run out of', meaning: 'израсходовать, закончиться', example: '"The server ran out of disk space during the backup."' }
      ],
      exercises: [
        {
          sentence: 'We _____ a conflict between two dependencies during the upgrade.',
          answer: 'ran into',
          hint: 'Столкнуться с проблемой'
        },
        {
          sentence: 'The database _____ connections — we need to increase the pool size.',
          answer: 'ran out of',
          hint: 'Закончился ресурс'
        }
      ]
    },
    {
      id: 10,
      title: 'Final phrasal verbs and idioms test',
      type: 'practice',
      description: 'Финальный тест: определи значение выделенных фразовых глаголов и идиом.',
      solution: 'Правильные ответы:\n1. spin up — запустить, поднять новый сервер\n2. boil the ocean — пытаться сделать слишком много сразу\n3. sunset — прекратить поддержку, вывести из эксплуатации\n4. pick up — взять задачу, которую начал кто-то другой',
      content: [
        { type: 'text', value: 'Финальный тест: определи значение выделенных фразовых глаголов и идиом.' }
      ],
      tasks: [
        {
          sentence: '"We need to **spin up** a new server for the load tests."',
          question: 'Что означает "spin up"?',
          answer: 'Запустить, поднять (новый сервер или экземпляр).',
          explanation: '"Spin up a server/instance" — очень частое выражение в cloud computing.'
        },
        {
          sentence: '"Let\'s not **boil the ocean** — focus on the MVP first."',
          question: 'Что означает "boil the ocean"?',
          answer: 'Пытаться сделать слишком много сразу, неосуществимая задача.',
          explanation: 'Буквально: "кипятить океан" — бессмысленная затея. В контексте: не пытаться решить всё сразу.'
        },
        {
          sentence: '"We\'re going to **sunset** the v1 API next quarter."',
          question: 'Что означает "sunset" как глагол?',
          answer: 'Прекратить поддержку, вывести из эксплуатации.',
          explanation: '"Sunset a product/API" — завершить его жизненный цикл. "The service will be sunset in March."'
        },
        {
          sentence: '"Can you **pick up** the task that John left?"',
          question: 'Что означает "pick up" в этом контексте?',
          answer: 'Взять задачу, которую начал кто-то другой.',
          explanation: '"Pick up where someone left off" — продолжить с того места, где остановился другой.'
        }
      ]
    }
  ]
}
