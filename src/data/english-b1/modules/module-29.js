export default {
  id: 29,
  title: 'Practice: B1 Grammar Exercises',
  description: 'Практические упражнения на грамматику уровня B1. Present Perfect, условные предложения, пассивный залог, reported speech и другие темы.',
  lessons: [
    {
      id: 1,
      title: 'Present Perfect vs Past Simple',
      type: 'practice',
      description: 'Выбери правильное время: Present Perfect или Past Simple.',
      solution: 'Правильные ответы:\n1. deployed (Past Simple — yesterday)\n2. have never used (Present Perfect с never)\n3. has just pushed (Present Perfect с just)\n4. went down (Past Simple — last week)\n5. have already reviewed (Present Perfect с already)\n6. was founded (Passive Past Simple — конкретная дата)',
      content: [
        { type: 'text', value: 'Выбери правильное время: Present Perfect (have/has + V3) или Past Simple (V2). Это одна из самых частых ошибок.' },
        { type: 'heading', value: 'Key rules' },
        { type: 'list', items: [
          'Past Simple — конкретное время в прошлом: "I fixed the bug yesterday."',
          'Present Perfect — результат важен сейчас, время не указано: "I have fixed the bug."',
          'С "just, already, yet, ever, never, recently" — Present Perfect',
          'С "yesterday, last week, in 2020, ago" — Past Simple'
        ]}
      ],
      tasks: [
        {
          sentence: 'The team _____ (deploy) the new version yesterday.',
          answer: 'deployed',
          rule: 'Past Simple — "yesterday" указывает на конкретное время в прошлом.'
        },
        {
          sentence: 'We _____ (never / use) this framework before.',
          answer: 'have never used',
          rule: 'Present Perfect с "never" — опыт без конкретного времени.'
        },
        {
          sentence: 'She _____ (just / push) her changes to the repository.',
          answer: 'has just pushed',
          rule: 'Present Perfect с "just" — действие только что произошло.'
        },
        {
          sentence: 'The API _____ (go down) three times last week.',
          answer: 'went down',
          rule: 'Past Simple — "last week" — конкретный период в прошлом.'
        },
        {
          sentence: 'I _____ (already / review) your pull request. Check the comments.',
          answer: 'have already reviewed',
          rule: 'Present Perfect с "already" — действие завершено, результат актуален.'
        },
        {
          sentence: 'The company _____ (found) in 2015 by two engineers.',
          answer: 'was founded',
          rule: 'Passive Past Simple — конкретная дата основания.'
        }
      ]
    },
    {
      id: 2,
      title: 'Present Perfect Continuous',
      type: 'practice',
      description: 'Вставь правильную форму Present Perfect Continuous (have/has been + V-ing).',
      solution: 'Правильные ответы:\n1. have been working (for three hours — продолжается)\n2. has been running (since this morning — с конкретного момента)\n3. have been trying (for a week — длительный процесс)\n4. have been refactoring (since Q1 — продолжается)',
      content: [
        { type: 'text', value: 'Present Perfect Continuous (have/has been + V-ing) выражает действие, которое началось в прошлом и продолжается сейчас или только что завершилось.' }
      ],
      tasks: [
        {
          sentence: 'I _____ (work) on this bug for three hours.',
          answer: 'have been working',
          rule: 'Perfect Continuous — действие продолжается: "for three hours".'
        },
        {
          sentence: 'The server _____ (run) at 90% CPU since this morning.',
          answer: 'has been running',
          rule: 'Perfect Continuous — с "since" — с конкретного момента.'
        },
        {
          sentence: 'We _____ (try) to fix this performance issue for a week.',
          answer: 'have been trying',
          rule: 'Perfect Continuous — длительный процесс, начавшийся в прошлом.'
        },
        {
          sentence: 'The developers _____ (refactor) the legacy code since Q1.',
          answer: 'have been refactoring',
          rule: 'Perfect Continuous — процесс рефакторинга продолжается.'
        }
      ]
    },
    {
      id: 3,
      title: 'Conditional sentences',
      type: 'practice',
      description: 'Заполни пропуски правильной формой условных предложений (Zero, First, Second, Third Conditional).',
      solution: 'Правильные ответы:\n1. run / will be (First Conditional)\n2. were / would choose (Second Conditional)\n3. had written / would have caught (Third Conditional)\n4. expires / queries (Zero Conditional)',
      content: [
        { type: 'text', value: 'Условные предложения в IT-контексте используются часто. Zero, First, Second и Third Conditional.' },
        { type: 'list', items: [
          'Zero: If + Present, Present — всегда истинно ("If you reboot, it clears the cache")',
          'First: If + Present, will — реальное будущее ("If we fix this, performance will improve")',
          'Second: If + Past, would — нереальное настоящее ("If I had more time, I would refactor")',
          'Third: If + Past Perfect, would have — нереальное прошлое ("If we had tested it, we would have caught the bug")'
        ]}
      ],
      tasks: [
        {
          sentence: 'If you _____ (run) npm install, the dependencies _____ (be) up to date.',
          answer: 'run / will be',
          rule: 'First Conditional — реальное условие с реальным результатом.'
        },
        {
          sentence: 'If I _____ (be) the tech lead, I _____ (choose) a different architecture.',
          answer: 'were / would choose',
          rule: 'Second Conditional — нереальная ситуация в настоящем.'
        },
        {
          sentence: 'If we _____ (write) tests earlier, we _____ (catch) this bug.',
          answer: 'had written / would have caught',
          rule: 'Third Conditional — нереальная ситуация в прошлом.'
        },
        {
          sentence: 'If the cache _____ (expire), the system _____ (query) the database.',
          answer: 'expires / queries',
          rule: 'Zero Conditional — всегда истинное условие (системное поведение).'
        }
      ]
    },
    {
      id: 4,
      title: 'Passive Voice in IT context',
      type: 'practice',
      description: 'Вставь правильную форму пассивного залога.',
      solution: 'Правильные ответы:\n1. is encrypted / is transmitted (Present Passive)\n2. was fixed (Past Passive)\n3. are logged (Present Passive — постоянный процесс)\n4. will be released (Future Passive)\n5. should be automated (Modal Passive)',
      content: [
        { type: 'text', value: 'Пассивный залог широко используется в технической документации и описаниях процессов.' }
      ],
      tasks: [
        {
          sentence: 'The data _____ (encrypt) before it _____ (transmit) over the network.',
          answer: 'is encrypted / is transmitted',
          rule: 'Present Passive — описание текущего процесса.'
        },
        {
          sentence: 'The bug _____ (fix) in version 2.3.1.',
          answer: 'was fixed',
          rule: 'Past Passive — конкретная версия, конкретное прошлое действие.'
        },
        {
          sentence: 'All requests _____ (log) to the centralized monitoring system.',
          answer: 'are logged',
          rule: 'Present Passive — постоянный процесс без указания исполнителя.'
        },
        {
          sentence: 'The feature _____ (will / release) next sprint.',
          answer: 'will be released',
          rule: 'Future Passive — запланированное будущее действие.'
        },
        {
          sentence: 'The deployment _____ (should / automate) to avoid human error.',
          answer: 'should be automated',
          rule: 'Modal Passive — рекомендация или необходимость.'
        }
      ]
    },
    {
      id: 5,
      title: 'Reported Speech in IT',
      type: 'practice',
      description: 'Передай прямую речь в косвенную, соблюдая согласование времён.',
      solution: 'Правильные ответы:\n1. The on-call engineer said that the API was down.\n2. The PM told the client that they would deploy the fix the next day.\n3. She asked if I could review her PR.',
      content: [
        { type: 'text', value: 'Reported Speech (косвенная речь) используется для пересказа того, что сказали на митинге или в переписке.' },
        { type: 'list', items: [
          'say/tell: "I will fix it" → He said he would fix it.',
          'Время сдвигается назад: will → would, can → could, is → was',
          'Место и время: now → then, today → that day, here → there'
        ]}
      ],
      tasks: [
        {
          direct: '"The API is down," said the on-call engineer.',
          question: 'Передай в косвенной речи.',
          answer: 'The on-call engineer said that the API was down.',
          rule: 'is → was в reported speech.'
        },
        {
          direct: '"We will deploy the fix tomorrow," the PM told the client.',
          question: 'Передай в косвенной речи.',
          answer: 'The PM told the client that they would deploy the fix the next day.',
          rule: 'will → would, tomorrow → the next day.'
        },
        {
          direct: '"Can you review my PR?" she asked.',
          question: 'Передай в косвенной речи.',
          answer: 'She asked if I could review her PR.',
          rule: 'Вопрос в косвенной речи: asked if/whether + утвердительный порядок слов.'
        }
      ]
    },
    {
      id: 6,
      title: 'Relative Clauses',
      type: 'practice',
      description: 'Заполни пропуски подходящим относительным местоимением (who, which, that, where, whose).',
      solution: 'Правильные ответы:\n1. who (для людей)\n2. that / which (для вещей)\n3. where (для мест/систем)\n4. whose (притяжательное)',
      content: [
        { type: 'text', value: 'Relative clauses (определительные придаточные) используют who, which, that, where, whose для описания существительных.' }
      ],
      tasks: [
        {
          sentence: 'The developer _____ wrote this code has left the company.',
          answer: 'who',
          rule: 'who — для людей.'
        },
        {
          sentence: 'The library _____ we used last year is now deprecated.',
          answer: 'that / which',
          rule: 'that/which — для вещей.'
        },
        {
          sentence: 'This is the database _____ all user data is stored.',
          answer: 'where',
          rule: 'where — для мест/систем.'
        },
        {
          sentence: 'The engineer _____ PR was merged first wins the sprint.',
          answer: 'whose',
          rule: 'whose — притяжательное значение.'
        }
      ]
    },
    {
      id: 7,
      title: 'Modal verbs in IT',
      type: 'practice',
      description: 'Выбери подходящий модальный глагол (can, must, should, could, might, would).',
      solution: 'Правильные ответы:\n1. must / should (строгое требование / рекомендация)\n2. can (способность системы)\n3. could / might (неопределённость, предположение)\n4. would have (нереальное прошлое, Third Conditional)',
      content: [
        { type: 'text', value: 'Модальные глаголы (can, could, must, should, might, would) часто встречаются в технических текстах и общении.' }
      ],
      tasks: [
        {
          sentence: 'You _____ always validate user input. It\'s a security requirement.',
          answer: 'must / should',
          rule: 'Must — строгое требование. Should — рекомендация.'
        },
        {
          sentence: 'The system _____ handle up to 10,000 concurrent connections.',
          answer: 'can',
          rule: 'Can — способность/возможность системы.'
        },
        {
          sentence: 'This error _____ be caused by a network timeout.',
          answer: 'could / might',
          rule: 'Could/might — неопределённость, предположение.'
        },
        {
          sentence: 'If you had used an index, the query _____ run faster.',
          answer: 'would have',
          rule: 'Would have — нереальное прошлое (Third Conditional).'
        }
      ]
    },
    {
      id: 8,
      title: 'Linking words and connectors',
      type: 'practice',
      description: 'Заполни пропуски подходящим связующим словом (however, therefore, although, moreover, as a result).',
      solution: 'Правильные ответы:\n1. However (противопоставление)\n2. As a result / Therefore (причинно-следственная связь)\n3. Although / Even though (уступка)',
      content: [
        { type: 'text', value: 'Связующие слова объединяют идеи в техническом письме и речи.' },
        { type: 'list', items: [
          'however / nevertheless — однако, тем не менее (противопоставление)',
          'therefore / thus / hence — следовательно (вывод)',
          'although / even though / while — хотя (уступка)',
          'moreover / furthermore / in addition — более того (добавление)',
          'as a result / consequently — в результате (следствие)',
          'for example / for instance — например',
          'in contrast / on the other hand — напротив'
        ]}
      ],
      tasks: [
        {
          sentence: 'The library is fast. _____, it lacks good documentation.',
          answer: 'However',
          rule: 'However — противопоставление: быстрая НО плохая документация.'
        },
        {
          sentence: 'We cached the results. _____, the response time improved significantly.',
          answer: 'As a result / Therefore',
          rule: 'As a result/Therefore — причинно-следственная связь.'
        },
        {
          sentence: '_____ it uses more memory, the algorithm is much faster.',
          answer: 'Although / Even though',
          rule: 'Although — уступительная связь.'
        }
      ]
    },
    {
      id: 9,
      title: 'Mixed grammar test',
      type: 'practice',
      description: 'Смешанный тест на все грамматические темы модуля. Выбери правильный вариант.',
      solution: 'Правильные ответы:\n1. "I have worked here since 2020." (Present Perfect с since)\n2. "is tested" (Present Simple Passive)\n3. "If we had deployed earlier, we would have avoided the issue." (Third Conditional)',
      content: [
        { type: 'text', value: 'Смешанный тест на все грамматические темы модуля. Выбери правильный вариант.' }
      ],
      tasks: [
        {
          question: 'Which is correct?',
          options: [
            'I have worked here since 2020.',
            'I work here since 2020.',
            'I worked here since 2020.'
          ],
          correct: 0,
          explanation: 'Present Perfect с "since" — действие началось в 2020 и продолжается сейчас.'
        },
        {
          question: 'Complete: "The code _____ by the CI pipeline before merging."',
          options: ['tests', 'is tested', 'was testing'],
          correct: 1,
          explanation: 'Present Simple Passive — описание постоянного процесса.'
        },
        {
          question: 'Which conditional is correct for an unreal past situation?',
          options: [
            'If we deploy now, we will have issues.',
            'If we had deployed earlier, we would have avoided the issue.',
            'If we deployed earlier, we would avoid the issue.'
          ],
          correct: 1,
          explanation: 'Third Conditional: If + Past Perfect, would have + V3 — нереальная ситуация в прошлом.'
        }
      ]
    },
    {
      id: 10,
      title: 'Error correction',
      type: 'practice',
      description: 'Найди и исправь грамматическую ошибку в каждом предложении.',
      solution: 'Правильные ответы:\n1. The bug was fixed yesterday and everything has been working fine since then. (с "since then" — Perfect)\n2. If I have more time, I will refactor this code. (First Conditional: Present Simple в if-клаузе)\n3. She suggested using Redis for caching. (suggest + V-ing, не to-infinitive)\n4. The developer who wrote this is no longer on the team. (who — для людей)',
      content: [
        { type: 'text', value: 'Найди и исправь грамматическую ошибку в каждом предложении.' }
      ],
      tasks: [
        {
          incorrect: 'The bug was fixed yesterday and now everything works since then.',
          correct: 'The bug was fixed yesterday and everything has been working fine since then.',
          explanation: 'С "since then" используем Perfect, не Past Simple.'
        },
        {
          incorrect: 'If I will have more time, I will refactor this code.',
          correct: 'If I have more time, I will refactor this code.',
          explanation: 'First Conditional: в if-клаузе Present Simple, не Future.'
        },
        {
          incorrect: 'She suggested to use Redis for caching.',
          correct: 'She suggested using Redis for caching.',
          explanation: 'Suggest + V-ing (не to-infinitive).'
        },
        {
          incorrect: 'The developer which wrote this is no longer on the team.',
          correct: 'The developer who wrote this is no longer on the team.',
          explanation: 'Who — для людей, which — для вещей.'
        }
      ]
    }
  ]
}
