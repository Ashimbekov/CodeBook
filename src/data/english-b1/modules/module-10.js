export default {
  id: 10,
  title: 'Модальные: might, could, would, shall',
  description: 'Продвинутые модальные глаголы: оттенки вероятности, возможности, советы, гипотезы. Might, could, would, shall и их различия.',
  lessons: [
    {
      id: 1,
      title: 'Обзор модальных глаголов',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Модальные глаголы (Modal Verbs) не изменяются по лицам, не имеют формы -s в 3-м лице, требуют инфинитив без "to" после себя.\n\nПолный список: can, could, may, might, will, would, shall, should, must, need, dare, ought to\n\nГруппы по значению:\n1. Возможность: can, could, may, might\n2. Необходимость/обязанность: must, have to, should, ought to, need to\n3. Вероятность/предположение: will, would, should, must, might, could\n4. Разрешение: can, could, may\n5. Вежливость/формальность: could, would, might, shall\n\nПравила:\n- Modal + V1 (инфинитив без to): "She might know."\n- Modal + have + V3 (о прошлом): "She might have known."'
        },
        {
          type: 'text',
          value: 'Степени вероятности (от большей к меньшей):\n\n100%: will / won\'t (уверенность)\n"The tests will fail if you don\'t fix this."\n\n95%+: must (логическое заключение)\n"The server must be overloaded — look at the CPU usage."\n\n70-80%: should (предположение, что всё правильно)\n"The deployment should be done by 5 PM."\n\n50%: may (формальная возможность)\n"The issue may be related to the cache."\n\n40-50%: might (меньшая уверенность)\n"The bug might appear only under heavy load."\n\n30-50%: could (теоретическая возможность)\n"The problem could be in the network layer."'
        }
      ]
    },
    {
      id: 2,
      title: 'Might: слабая вероятность и предположения',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'MIGHT — слабая вероятность (40-50%), осторожное предположение.\n\nPresent/Future: might + V1\nПрошлое: might have + V3\n\nОсновные значения:\n1. Слабое предположение ("возможно, но не уверен")\n2. Вежливая просьба/разрешение (очень формально)\n3. Упрёк (might have + V3 = мог бы, но не сделал)'
        },
        {
          type: 'text',
          value: 'Might для предположений:\n1. The performance issue might be caused by N+1 queries.\n2. The server might need a restart — I\'m not sure.\n3. This approach might introduce security vulnerabilities.\n4. The test might pass if you mock the external dependency.\n5. The update might break backward compatibility.\n6. There might be a race condition in the async code.\n\nMight have (прошлое — предположение о прошедших событиях):\n1. The data might have been corrupted during the migration.\n2. The developer might have forgotten to commit the migration file.\n3. The service might have been down for longer than we thought.\n4. The memory leak might have existed since the initial release.\n\nMight have (упрёк — "мог бы, но не сделал"):\n1. You might have mentioned the breaking change in the PR description.\n2. Someone might have warned us about the API rate limits.\n3. The architect might have considered scalability when designing this.'
        },
        {
          type: 'tip',
          value: 'Might vs May: might — чуть менее вероятно, более осторожно. May — чуть более формально, чуть более вероятно. В разговорном английском разница минимальна, используйте might.'
        }
      ]
    },
    {
      id: 3,
      title: 'Could: возможность и способность в прошлом',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'COULD — множество значений:\n1. Прошедшая способность (прошедшее от can)\n2. Теоретическая возможность\n3. Вежливая просьба\n4. Предположение (= might, чуть менее уверенно)\n5. Условное значение (в условных предложениях)\n\nCould для прошедшей способности:\n"When I was a junior, I could only write Python." (тогда умел)\n"The old server could handle 1000 requests per second." (была такая способность)\n\nNOTE: Для конкретного единичного действия в прошлом используем "managed to" вместо "could":\nНЕВЕРНО: "I could fix the production bug in 10 minutes."\nВЕРНО: "I managed to fix the production bug in 10 minutes."'
        },
        {
          type: 'text',
          value: 'Could для теоретической возможности:\n1. This could be a caching issue — let me check.\n2. The problem could be in the configuration file.\n3. This approach could work, but it might have performance implications.\n4. There could be an issue with the database connection pool.\n\nCould have (прошлое — что было возможно, но не произошло):\n1. We could have prevented the outage with better monitoring.\n2. The migration could have been smoother if we had tested it first.\n3. You could have used an existing library instead of writing your own.\n\nCould для вежливых просьб:\n1. Could you review my pull request when you have a moment?\n2. Could someone help me with this infrastructure issue?\n3. Could we schedule a call to discuss the architecture?\n4. Could you explain why you chose this approach?'
        }
      ]
    },
    {
      id: 4,
      title: 'Would: условное, вежливость, привычки прошлого',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'WOULD — четыре основных значения:\n\n1. Условное (в Second/Third Conditional):\n"If we had more servers, we would handle more traffic."\n"If we had tested it, the bug would have been caught."\n\n2. Вежливые просьбы и предложения:\n"Would you like me to review that for you?"\n"Would you mind explaining your approach?"\n"Would it be possible to extend the deadline?"\n\n3. Привычки в прошлом (= used to, но более нарративный):\n"In the early days, we would deploy manually every Friday."\n"The old system would crash regularly under heavy load."\n"The team would have weekly meetings to review architecture decisions."\n\n4. Вежливое нежелание/отказ:\n"The tests wouldn\'t pass no matter what I tried."\n"The server just wouldn\'t start after the update."'
        },
        {
          type: 'text',
          value: 'Would vs Used to:\n\nUsed to — прошлые привычки или состояния, которые больше не существуют:\n"I used to write PHP before switching to Go." (больше не пишу PHP)\n"We used to have daily standups." (теперь нет)\n\nWould — только прошлые действия (привычки), НЕ состояния:\n"Every sprint, we would review the backlog on Mondays." (привычное действие)\nНЕВЕРНО: "I would know PHP." (состояние — нельзя)\nВЕРНО: "I used to know PHP."\n\nIT-примеры с would (привычки прошлого):\n1. "When the team was small, we would all sit together and pair-program."\n2. "In the early startup days, the founder would write code alongside the engineers."\n3. "Before CI/CD, we would spend entire Fridays on manual deployment."\n4. "The legacy system would generate reports only once a day."'
        }
      ]
    },
    {
      id: 5,
      title: 'Shall: предложения и формальность',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'SHALL — в современном английском используется в ограниченных контекстах:\n\n1. Предложения (только с I/We):\n"Shall I help you with the deployment?"\n"Shall we start the code review?"\n"Shall we schedule a meeting to discuss this?"\n\n2. Формальные обязательства (юридический язык, SLA, договоры):\n"The service shall maintain 99.9% uptime."\n"The vendor shall provide technical support within 24 hours."\n"All data shall be encrypted during transmission."\n"The contractor shall deliver the MVP by the agreed date."\n\n3. Риторические вопросы (формально):\n"Who shall be responsible for the on-call rotation?"\n"Where shall we host the staging environment?"'
        },
        {
          type: 'text',
          value: 'Shall vs Will:\n\nWill — стандартное будущее, обещания, предсказания:\n"I will help you with the deployment."\n"The feature will be ready by Friday."\n\nShall — предложения, формальные обязательства, некоторые вопросы о решениях:\n"Shall I help you?" (= Мне помочь вам? — предложение помощи)\n"Will you help me?" (= Ты поможешь мне? — просьба)\n\nIT-примеры Shall в договорах/SLA:\n1. "The system shall respond to 99% of requests within 200ms."\n2. "Backups shall be created daily and retained for 30 days."\n3. "Access to production systems shall require two-factor authentication."\n4. "The development team shall follow the agreed coding standards."\n5. "All incidents shall be reported within one hour of detection."'
        },
        {
          type: 'note',
          value: 'Shall почти вышел из повседневного употребления в американском английском. В техническом контексте используется в SLA и контрактах. В разговоре для предложений чаще говорят "Should I...?" или "Do you want me to...?"'
        }
      ]
    },
    {
      id: 6,
      title: 'Модальные глаголы для предположений о прошлом',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Модальные + have + V3 = предположения/выводы о прошлом:\n\nMUST HAVE + V3 = очень вероятно (логическое заключение):\n"The server must have run out of memory — look at these logs."\n"Someone must have deleted the file accidentally."\n"The developer must have forgotten to commit the migration."\n\nCAN\'T HAVE / COULDN\'T HAVE + V3 = невозможно, что это произошло:\n"The update can\'t have caused this — it was deployed after the issue started."\n"She couldn\'t have introduced this bug — she hasn\'t touched that module."\n\nMAY HAVE + V3 = возможно произошло:\n"The cache may have stored stale data."\n"The issue may have been present before the last release."\n\nMIGHT HAVE + V3 = слабая вероятность:\n"The race condition might have been triggered by high concurrency."\n"The data might have been corrupted during the migration."\n\nSHOULD HAVE + V3 = должно было произойти (критика/сожаление):\n"We should have written more tests."\n"The team should have tested the rollback procedure."\n"Someone should have caught this in code review."'
        },
        {
          type: 'text',
          value: 'Сравнение в контексте incident investigation:\n\n"The server crashed at 3 AM. Let\'s figure out what happened."\n\n"The cache must have been corrupted." (высокая вероятность — есть улики)\n"The deployment might have introduced a bug." (возможно — недостаточно улик)\n"The issue can\'t have been there for long." (невозможно — были проверки)\n"The engineer on call should have responded faster." (критика — не сделал должное)\n"The monitoring could have alerted us earlier." (была возможность — но не сработало)\n"Someone may have accidentally changed the configuration." (неуверенное предположение)'
        }
      ]
    }
  ]
}
