export default {
  id: 6,
  title: 'Условные: Third Conditional (would have)',
  description: 'Third Conditional: нереальные ситуации в ПРОШЛОМ — сожаление, критика, воображаемые альтернативы. If + Past Perfect, would have + V3.',
  lessons: [
    {
      id: 1,
      title: 'Структура и основное значение',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Third Conditional (третий условный) описывает ситуации, которые МОГЛИ произойти в прошлом, но НЕ ПРОИЗОШЛИ. Это нереальные прошедшие условия.\n\nСтруктура:\nIF + Past Perfect (had + V3), WOULD HAVE + V3\n\nИли в обратном порядке:\nWOULD HAVE + V3 + IF + Past Perfect\n\nОсновные значения:\n1. Сожаление о прошлом ("жаль, что не сделал")\n2. Критика прошлых решений ("надо было сделать иначе")\n3. Воображаемые альтернативы ("а что если бы...")\n4. Объяснение последствий прошлых событий'
        },
        {
          type: 'text',
          value: 'Примеры:\n1. If we had written tests, we would have caught that bug earlier.\n   (но тестов не писали → баг не поймали)\n\n2. If the developer had reviewed the code carefully, he would have noticed the SQL injection.\n   (но не проверил → не заметил)\n\n3. We would have deployed faster if we had had a CI/CD pipeline.\n   (пайплайна не было → деплой был медленным)\n\n4. If she had documented the API, the integration would have been easier.\n   (не документировала → интеграция была сложной)\n\n5. The project would have succeeded if we had communicated better.\n   (общение было плохим → проект провалился)\n\n6. If I had known about this library, I wouldn\'t have written everything from scratch.\n   (не знал → написал с нуля)\n\n7. Would you have taken the job if they had offered more equity?\n   (воображаемый вопрос о прошлом)'
        },
        {
          type: 'tip',
          value: 'Third Conditional = прошлое, нереальное. Second Conditional = настоящее/будущее, нереальное. Если можете изменить ситуацию сейчас = Second. Если уже не изменить = Third.'
        }
      ]
    },
    {
      id: 2,
      title: 'Second vs Third Conditional: сравнение',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Ключевое различие:\n\nSecond Conditional → нереально СЕЙЧАС / в будущем\n"If I had more time NOW, I would refactor this."\n(сейчас у меня нет времени)\n\nThird Conditional → нереально в ПРОШЛОМ (уже произошло)\n"If I had had more time THEN, I would have refactored this."\n(тогда у меня не было времени, теперь уже поздно)'
        },
        {
          type: 'text',
          value: 'Сравнение пар:\n\n1. "If we hired a DevOps engineer now, deployment would be easier." (Second — можно нанять)\n   "If we had hired a DevOps engineer last year, deployment would have been easier." (Third — не наняли)\n\n2. "If I were you, I would write more tests." (Second — совет на сейчас)\n   "If I had been you, I would have written more tests." (Third — критика прошлого решения)\n\n3. "If we used TypeScript, we would catch type errors at compile time." (Second — можно перейти)\n   "If we had used TypeScript from the start, we would have caught so many bugs." (Third — не перешли тогда)\n\n4. "If the API were better documented, integration would be easy." (Second — сейчас плохо)\n   "If the API had been documented, the integration would have taken one day." (Third — тогда не документировали)'
        }
      ]
    },
    {
      id: 3,
      title: 'Сожаление и критика в IT',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Third Conditional часто используется в постмортемах, ретроспективах и код-ревью для анализа того, что пошло не так.\n\nПостмортем (incident review):\n1. If we had monitored the disk space, we would have prevented the outage.\n2. If the deployment had been done during off-peak hours, fewer users would have been affected.\n3. We would have recovered faster if we had had a proper runbook.\n4. If someone had reviewed the configuration change, the error would have been caught.\n5. If we had tested the rollback procedure, it would have been faster.\n\nРетроспектива (Sprint retrospective):\n1. If we had clarified requirements earlier, we wouldn\'t have wasted two days on rework.\n2. The sprint would have gone better if we hadn\'t taken on too many story points.\n3. If we had communicated blockers sooner, we could have resolved them faster.\n4. We would have delivered more value if we had focused on fewer features.'
        },
        {
          type: 'text',
          value: 'Код ревью и технические решения:\n1. If you had used an index here, this query would have run 100x faster.\n2. The app would have been more secure if we had validated user input properly.\n3. If we hadn\'t ignored the code smell, we wouldn\'t have this bug now.\n4. If she had read the existing code first, she wouldn\'t have reimplemented it.\n5. The merge would have been cleaner if we had rebased the branch.\n6. If we had broken this into smaller functions, it would have been easier to test.\n7. We would have saved a week if we had used an existing library instead of building from scratch.'
        }
      ]
    },
    {
      id: 4,
      title: 'Модальные глаголы в Third Conditional',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Вместо "would have" можно использовать другие модальные глаголы:\n\nCOULD HAVE + V3 (могло бы):\nIf we had had more time, we could have refactored the entire module.\n(возможность, которую упустили)\n\nMIGHT HAVE + V3 (возможно, произошло бы):\nIf we had tested more thoroughly, we might have found the bug.\n(меньшая уверенность, чем would have)\n\nSHOULD HAVE + V3 (должны были / надо было):\nYou should have written tests. (критика, сожаление — не если, а прямо)\n\nMAY HAVE + V3 (возможно, произошло):\nIf the update had been rolled back immediately, some data may have been saved.'
        },
        {
          type: 'text',
          value: 'Примеры с разными модальными:\n\n1. "If we had optimised the queries, the app could have handled the load."\n   (возможность была упущена)\n\n2. "If she had been more careful, she might have noticed the bug."\n   (возможно заметила бы — неуверенность)\n\n3. "You should have backed up the database before running the migration."\n   (критика прошлого действия)\n\n4. "We could have avoided this incident if we had updated the dependencies.\"\n   (возможность предотвратить)\n\n5. "If the team had communicated better, the deadline might not have been missed."\n   (возможно не пропустили бы)'
        },
        {
          type: 'note',
          value: 'SHOULD HAVE + V3 — это не Third Conditional, а отдельная конструкция для критики/сожаления: "You should have tested it" = "Тебе надо было протестировать это". Используется без "if".'
        }
      ]
    },
    {
      id: 5,
      title: 'Сокращения в разговорной речи',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'В разговорной речи Third Conditional часто сокращается:\n\nПолная форма → Сокращённая форма:\nI would have → I\'d have / I\'d\'ve (разговорное)\nIf I had → If I\'d\nHe would have → He\'d have\nWe would have → We\'d have\n\nПримеры сокращений:\n1. "If we\'d written tests, we\'d have caught it." (= If we had written... we would have caught)\n2. "She\'d have noticed if she\'d reviewed it carefully."\n3. "I\'d\'ve helped if you\'d asked earlier."\n\nВ письменной речи (email, документация) используйте полные формы.\nВ Slack, устной речи — сокращения естественны.'
        },
        {
          type: 'text',
          value: 'Типичные ошибки в Third Conditional:\n\n1. НЕВЕРНО: If I would have known, I would have helped.\n   ВЕРНО: If I had known, I would have helped.\n   (нельзя "would" в части с if)\n\n2. НЕВЕРНО: If we had fixed the bug, we would helped the users.\n   ВЕРНО: If we had fixed the bug, we would have helped the users.\n   (нужно "have" в результирующей части)\n\n3. НЕВЕРНО: If she has read the docs, she would have understood.\n   ВЕРНО: If she had read the docs, she would have understood.\n   (нужно Past Perfect, не Present Perfect)\n\n4. НЕВЕРНО: The deploy would have succeeded if we test it.\n   ВЕРНО: The deploy would have succeeded if we had tested it.'
        }
      ]
    },
    {
      id: 6,
      title: 'Zero, First, Second, Third: полный обзор',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Все четыре условных в сравнении:\n\nZero Conditional: If + Present Simple, Present Simple\n= Всегда истинно, научные факты, общие истины\nПример: "If memory is full, the process crashes."\n\nFirst Conditional: If + Present Simple, will + V1\n= Реально возможно в настоящем/будущем\nПример: "If we deploy today, the feature will be live tomorrow."\n\nSecond Conditional: If + Past Simple, would + V1\n= Нереально или маловероятно в настоящем/будущем\nПример: "If we had unlimited budget, we would use the latest hardware."\n\nThird Conditional: If + Past Perfect, would have + V3\n= Нереально в прошлом — событие не произошло\nПример: "If we had tested the migration, we would have prevented the data loss."'
        },
        {
          type: 'text',
          value: 'IT-примеры всех четырёх:\n\nZero: If you push to main, the CI pipeline runs automatically.\nFirst: If we fix this bug today, the client will be satisfied.\nSecond: If we rewrote the app in Rust, it would be 10x faster.\nThird: If we had used load testing, we would have anticipated the bottleneck.\n\nZero: If a server receives too many requests, it returns 503.\nFirst: If the build passes, I will merge the PR.\nSecond: If I were the architect, I would redesign the data layer.\nThird: If the team had followed the coding standards, the codebase would have been consistent.'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: постмортем и ретроспектива',
      type: 'practice',
      description: 'Завершите предложения Third Conditional и напишите постмортем с использованием нереальных условий прошлого.',
      solution: 'Правильные ответы:\n1. If we had backed up the data, we would not have lost 3 hours of user activity.\n2. The service would have stayed online if someone had monitored the disk usage.\n3. If she had read the changelog, she would have known about the breaking change.\n4. We would have finished the sprint if we had not added new tickets mid-sprint.\n5. If the team had written better documentation, onboarding would have taken half the time.',
      content: [
        {
          type: 'text',
          value: 'Завершите предложения Third Conditional:\n\n1. If we _____ (back up) the data, we _____ (not / lose) 3 hours of user activity.\n→ If we had backed up the data, we would not have lost 3 hours of user activity.\n\n2. The service _____ (stay) online if someone _____ (monitor) the disk usage.\n→ The service would have stayed online if someone had monitored the disk usage.\n\n3. If she _____ (read) the changelog, she _____ (know) about the breaking change.\n→ If she had read the changelog, she would have known about the breaking change.\n\n4. We _____ (finish) the sprint if we _____ (not / add) new tickets mid-sprint.\n→ We would have finished the sprint if we had not added new tickets mid-sprint.\n\n5. If the team _____ (write) better documentation, onboarding _____ (take) half the time.\n→ If the team had written better documentation, onboarding would have taken half the time.'
        },
        {
          type: 'text',
          value: 'Напишите постмортем, используя Third Conditional:\n\nСитуация: Production incident — database went down for 2 hours.\n\nФакты:\n- No automated backups were configured\n- No runbook existed for this scenario\n- Monitoring alert was misconfigured\n- Senior engineer was on vacation\n- Recovery took 2 hours instead of 30 minutes\n\nПример ответа:\n"If automated backups had been configured, we would have restored data faster.\nIf we had written a runbook for this scenario, the team would have known what to do.\nIf the monitoring alerts had been set up correctly, we would have detected the issue 30 minutes earlier.\nIf a senior engineer had been available, recovery might have taken only 30 minutes.\nOverall, if we had followed the operational best practices, the incident would have been much less severe."'
        }
      ]
    }
  ]
}
