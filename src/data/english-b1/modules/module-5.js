export default {
  id: 5,
  title: 'Условные: Second Conditional (would)',
  description: 'Second Conditional: нереальные или маловероятные условия в настоящем и будущем. If + Past Simple, would + V1.',
  lessons: [
    {
      id: 1,
      title: 'Структура и основное значение',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Second Conditional (второй условный) используется для:\n1. Нереальных или маловероятных ситуаций в настоящем/будущем\n2. Воображаемых сценариев ("а что если бы...")\n3. Советов (If I were you, I would...)\n\nСтруктура:\nIF + Past Simple, would + V1 (инфинитив без to)\n\nИли в обратном порядке:\nWould + V1 + if + Past Simple\n\nВажно: "were" используется для всех лиц в формальном/литературном языке.\nIf I were → формально (не "was")\nIf he were → формально\nIf I was → разговорный английский'
        },
        {
          type: 'text',
          value: 'Примеры:\n1. If I knew the solution, I would share it with you. (но я не знаю)\n2. If we had more developers, we would ship features faster. (у нас нет)\n3. If the server were faster, the response time would improve significantly. (он не быстрее)\n4. I would migrate to the cloud if it didn\'t cost so much. (но дорого)\n5. What would you do if the production database crashed right now?\n6. If I were the CTO, I would invest in better monitoring tools.\n7. We would use a different architecture if we were starting from scratch.\n8. If she had more experience, she would be a great tech lead.\n9. The app would work better if we optimised the database queries.\n10. If I were you, I would refactor this module before it gets worse.'
        },
        {
          type: 'tip',
          value: 'Second Conditional = нереально СЕЙЧАС или маловероятно. First Conditional = реально и возможно: "If you fix this bug, the tests will pass." Second Conditional: "If I fixed this bug (but I probably won\'t), the tests would pass."'
        }
      ]
    },
    {
      id: 2,
      title: 'First vs Second Conditional',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Различие в степени вероятности:\n\nFirst Conditional (If + Present Simple, will + V1):\n= Реально возможная ситуация\n= Если это произойдёт, то...\n= Вероятность: 50%+\n\nSecond Conditional (If + Past Simple, would + V1):\n= Нереальная или маловероятная ситуация\n= Если бы это было так (но это не так)...\n= Вероятность: мало или нереально'
        },
        {
          type: 'text',
          value: 'Сравнение пар:\n\n1. "If we fix the bug, the client will be happy." (реально — мы планируем исправить)\n   "If we fixed the bug in one hour, the client would be impressed." (маловероятно — сложный баг)\n\n2. "If you use caching, performance will improve." (совет о реальном действии)\n   "If we used caching everywhere, our servers would handle 10x more traffic." (теоретически)\n\n3. "If the CI pipeline passes, we will deploy today." (план — реально)\n   "If we had infinite computing resources, we would never worry about scaling." (фантазия)\n\n4. "If you have any questions, I will help." (предложение — реально)\n   "If I were you, I would ask the senior developer." (совет с воображаемой позиции)'
        },
        {
          type: 'note',
          value: 'Разговорная речь: иногда трудно определить, насколько ситуация реальна. Говорящий сам выбирает: First = "я верю, что это возможно", Second = "я считаю это маловероятным или нереальным".'
        }
      ]
    },
    {
      id: 3,
      title: 'If I were you: советы',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Одно из самых частых использований Second Conditional — советы с позиции "если бы я был на твоём месте".\n\nФормула: If I were you, I would + V1\nСокращённо: If I were you, I\'d + V1\n\nАналоги:\n- In your position, I would...\n- If I were in your shoes, I would...\n- If it were up to me, I would...'
        },
        {
          type: 'text',
          value: 'IT-советы с If I were you:\n\n1. If I were you, I would add more unit tests before refactoring.\n2. If I were you, I\'d read the documentation first.\n3. In your position, I would discuss this with the architect before starting.\n4. If I were in your shoes, I would raise this issue at the next sprint planning.\n5. If I were you, I would back up the database before running that migration.\n6. If it were up to me, I would switch to TypeScript — it prevents so many runtime errors.\n7. If I were you, I\'d document this workaround so the team understands it later.\n8. I wouldn\'t deploy on Friday if I were you — weekends are the worst time for incidents.\n9. If I were you, I would ask for a code review before merging to main.\n10. If it were my decision, I would invest in better observability tooling.'
        },
        {
          type: 'text',
          value: 'Типичные ошибки с советами:\n\nНЕВЕРНО: If I was you, I would... (разговорное, но не для официальных контекстов)\nВЕРНО (формальный): If I were you, I would...\n\nНЕВЕРНО: If I were you, I will...\nВЕРНО: If I were you, I would...\n\nНЕВЕРНО: If I were you, I would to check the logs.\nВЕРНО: If I were you, I would check the logs.'
        }
      ]
    },
    {
      id: 4,
      title: 'Would: другие модальные значения',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'В Second Conditional вместо "would" можно использовать другие модальные глаголы:\n\nCOULD (возможность, способность):\nIf we had more time, we could refactor the entire codebase.\nIf the server were more powerful, it could handle 10x the traffic.\n\nMIGHT (меньшая вероятность):\nIf we added caching, response times might improve.\nIf we hired more QA engineers, we might have fewer bugs in production.\n\nSHOULD (рекомендация):\nIf there were a performance issue, you should check the database queries first.\n\nMIGHT/COULD указывают на меньшую уверенность, чем WOULD:\n"It would work" = я уверен, что сработает\n"It might work" = возможно, сработает\n"It could work" = в принципе возможно'
        },
        {
          type: 'text',
          value: 'Сравнение:\n1. "If we switched to microservices, deployment would be easier." (уверен)\n2. "If we switched to microservices, deployment might be easier." (возможно)\n3. "If we switched to microservices, we could deploy services independently." (это стало бы возможным)\n\nIT-примеры с разными модальными:\n1. If we had a CI/CD pipeline, we could deploy dozens of times per day.\n2. If the team used pair programming, they might catch more bugs earlier.\n3. If we documented the API properly, new developers could onboard faster.\n4. If we had better test coverage, we could refactor without fear.\n5. If the codebase were cleaner, onboarding might take half the time.'
        }
      ]
    },
    {
      id: 5,
      title: 'Second Conditional в IT-дискуссиях',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Second Conditional часто используется в технических дискуссиях для обсуждения гипотетических архитектурных решений.\n\nОбсуждение архитектуры:\n1. If we used GraphQL instead of REST, clients could request exactly the data they need.\n2. If we deployed on-premises, we would have more control but higher maintenance costs.\n3. If we split this monolith into microservices, each team could deploy independently.\n4. If we added a CDN, static assets would load much faster for international users.\n5. If we implemented event sourcing, we would have a complete audit trail of all changes.\n\nТехнические компромиссы (trade-offs):\n1. If we chose consistency over availability, the system would be more reliable but slower.\n2. If we prioritized speed over code quality, we would ship faster but accumulate technical debt.\n3. If we used NoSQL, the schema would be more flexible but queries would be less powerful.\n4. If we went serverless, we wouldn\'t need to manage infrastructure, but costs could be unpredictable.'
        },
        {
          type: 'text',
          value: 'Hypothetical product decisions:\n1. If we had launched six months earlier, we would have captured the market before competitors.\n2. If we charged a monthly subscription, revenue would be more predictable.\n3. If we had a mobile app, we would reach a much larger audience.\n4. If we supported offline mode, the app would be useful in low-connectivity areas.\n5. If we integrated with Slack, adoption would increase significantly.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: условные в реальных ситуациях',
      type: 'practice',
      description: 'Завершите условные предложения Second Conditional и найдите ошибки.',
      solution: 'Правильные ответы (завершение предложений):\n1. would refactor (If I had more time...)\n2. would load / optimised\n3. were / would introduce\n4. wouldn\'t have / wrote\n5. would you do / crashed\n\nИсправление ошибок:\n1. If I had time, I would help. (не would have)\n2. If the server were faster, we would be happy. (не would be)\n3. I would help if I could. (не would to help)\n4. If I were you, I would refactor this. (не will)',
      content: [
        {
          type: 'text',
          value: 'Завершите предложения:\n\n1. If I had more time, I _____ (refactor) this module.\n→ would refactor\n\n2. The app _____ (load) faster if we _____ (optimise) the images.\n→ would load / optimised\n\n3. If I _____ (be) the tech lead, I _____ (introduce) code review standards.\n→ were / would introduce\n\n4. We _____ (not / have) so many bugs if we _____ (write) more tests.\n→ wouldn\'t have / wrote\n\n5. What _____ you _____ (do) if the production database _____ (crash) right now?\n→ would you do / crashed'
        },
        {
          type: 'text',
          value: 'Дискуссия "What would you do if...?" — IT-сценарии:\n\n1. What would you do if you found a critical security vulnerability in production?\n→ If I found a critical vulnerability, I would immediately alert the security team and temporarily disable the affected feature.\n\n2. What would you do if your manager asked you to deploy untested code?\n→ If my manager asked me to deploy untested code, I would explain the risks and suggest a quick smoke test first.\n\n3. What would you do if the database went down during peak hours?\n→ If the database went down during peak hours, I would switch to the read replica and start investigating the primary.\n\n4. What would you say if a client asked for an impossible deadline?\n→ If a client asked for an impossible deadline, I would explain what\'s realistically achievable and propose phased delivery.'
        },
        {
          type: 'text',
          value: 'Типичные ошибки и исправления:\n\n1. НЕВЕРНО: If I would have time, I would help.\n   ВЕРНО: If I had time, I would help.\n\n2. НЕВЕРНО: If the server would be faster, we would be happy.\n   ВЕРНО: If the server were faster, we would be happy.\n\n3. НЕВЕРНО: I would to help if I could.\n   ВЕРНО: I would help if I could.\n\n4. НЕВЕРНО: If I were you, I will refactor this.\n   ВЕРНО: If I were you, I would refactor this.'
        }
      ]
    },
    {
      id: 7,
      title: 'Mixed Conditionals: Second + реальность',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Иногда условная часть относится к настоящему, а результат — тоже к настоящему. Это классический Second Conditional.\n\nНо важно понимать Mixed Conditionals (смешанные условные), где части разных условных смешиваются:\n\nМодель: If + Past Perfect (Third), would + V1 (Second)\n= Если бы в прошлом (Third), сейчас (Second)\n\n"If we had chosen microservices from the beginning, our system would be much more scalable now."\n(если бы выбрали тогда — сейчас было бы лучше)\n\n"If she had joined the company earlier, she would probably be a senior engineer by now."\n(если бы пришла раньше — сейчас была бы senior)'
        },
        {
          type: 'text',
          value: 'Практические IT-примеры Mixed Conditionals:\n\n1. If we had written tests from day one, we wouldn\'t be so afraid to refactor now.\n2. If the company had invested in DevOps earlier, deployment would be automatic today.\n3. If we had documented the legacy code, new developers would be able to understand it now.\n4. If she had attended more conferences, she would have a stronger network now.\n5. If we hadn\'t accumulated so much technical debt, the codebase would be easier to maintain.\n\nПримечание: Mixed Conditionals — продвинутая тема, встречается в B2+, но понимать её важно для чтения технических текстов.'
        }
      ]
    }
  ]
}
