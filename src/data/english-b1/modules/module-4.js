export default {
  id: 4,
  title: 'Past Perfect',
  description: 'Past Perfect: действие, завершившееся ДО другого момента в прошлом. "Прошедшее в прошедшем".',
  lessons: [
    {
      id: 1,
      title: 'Образование и основное значение',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Past Perfect (прошедшее совершённое) образуется: had + V3 (третья форма глагола)\n\nВсе лица: I/You/He/She/It/We/They + had + V3\n\nОтрицание: hadn\'t + V3\nВопрос: Had + подлежащее + V3?\n\nОсновное значение: действие ЗАВЕРШИЛОСЬ ДО определённого момента в прошлом или ДО другого прошедшего действия.\n\nВремена на линии времени:\n[Past Perfect] → [Past Simple / другой момент в прошлом] → [СЕЙЧАС]\n\nПравило: когда два действия произошли в прошлом, то действие, которое произошло РАНЬШЕ = Past Perfect. Действие, которое произошло ПОЗЖЕ = Past Simple.'
        },
        {
          type: 'text',
          value: 'Примеры:\n1. By the time we found the bug, it had already caused data loss.\n   (сначала: caused data loss — PP; потом: found the bug — PS)\n\n2. When I arrived at the office, the standup had already started.\n   (сначала: standup started — PP; потом: I arrived — PS)\n\n3. The deploy failed because someone had pushed broken code.\n   (сначала: pushed broken code — PP; потом: deploy failed — PS)\n\n4. She couldn\'t log in because she had forgotten her password.\n   (сначала: forgotten her password — PP; потом: couldn\'t log in — PS)\n\n5. The client was upset because we hadn\'t met the deadline.\n   (сначала: hadn\'t met the deadline — PP; потом: client was upset — PS)'
        },
        {
          type: 'tip',
          value: 'Слова-маркеры Past Perfect: by the time, before, after, when (для последовательности), already, just, yet, never (в прошедшем контексте), by + time expression in past (by 5 PM, by Monday).'
        }
      ]
    },
    {
      id: 2,
      title: 'Past Perfect с before, after, when, by the time',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Союзы и предлоги, указывающие на последовательность прошлых событий:\n\nBY THE TIME (к тому времени как) — самый сильный маркер Past Perfect:\n1. By the time the team arrived, the server had crashed twice.\n2. By the time we finished debugging, it had been 6 hours.\n3. By midnight, the team had deployed all three services.\n\nBEFORE (до того как):\n1. We had reviewed the code before we merged it.\n2. She had never used AWS before she joined the company.\n3. I had already submitted the report before the meeting started.'
        },
        {
          type: 'text',
          value: 'AFTER (после того как) — Past Perfect обычно в придаточном after:\n1. After we had fixed the bug, we ran the tests again.\n2. After the team had completed the migration, they monitored the system.\n3. After she had reviewed the requirements, she started the implementation.\n\nWHEN (когда) — если действия НЕ одновременные:\n1. When I checked the logs, the problem had already been resolved.\n2. When she arrived, the meeting had already started.\n3. When the client called, we had already submitted the proposal.\n\nПримечание: если действия происходят одновременно или сразу друг за другом, используем Past Simple + Past Simple:\n"When the alarm triggered, the team responded immediately." (PS + PS, одновременно)'
        },
        {
          type: 'note',
          value: 'После "after" Past Perfect не всегда обязателен, т.к. "after" само указывает последовательность. Но с "when" и "by the time" Past Perfect необходим для ясности последовательности.'
        }
      ]
    },
    {
      id: 3,
      title: 'Past Perfect в IT-ситуациях',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Постмортем (incident postmortem) — классический контекст для Past Perfect:\n\n"When the monitoring alert fired at 2:47 AM, the database had already been unavailable for 8 minutes. The backup system had failed to kick in automatically because someone had misconfigured it during the last maintenance window. By the time the on-call engineer woke up, the service had been down for 15 minutes. Fortunately, the engineer had prepared a runbook for exactly this scenario, so recovery was quick."\n\nПереключение на новую технологию:\n"Before we migrated to Kubernetes, we had been managing servers manually for years. We had never used container orchestration before. By the time we finished the migration, we had containerized over 50 services."'
        },
        {
          type: 'text',
          value: 'Код ревью и история изменений:\n1. The PR failed CI because the developer hadn\'t run tests locally.\n2. The feature couldn\'t be deployed because no one had written the database migration.\n3. When we reviewed the code, we noticed someone had introduced a security vulnerability.\n4. The tests passed because the developer had mocked all external dependencies.\n5. We couldn\'t reproduce the bug because the developer had already fixed it in a hotfix.\n6. By the time the sprint ended, the team had completed 18 out of 20 story points.'
        },
        {
          type: 'text',
          value: 'Рассказ о проекте:\n"The project was in terrible shape when I joined. The previous team had left without proper documentation. Nobody had written tests, so we had no idea what was working and what wasn\'t. The architecture had grown organically over 5 years and had become a monolithic nightmare. By the time we finished the first assessment, we had identified over 200 technical debt items."\n\n— Какие события произошли сначала? Всё в Past Perfect — это "история до моего прихода".'
        }
      ]
    },
    {
      id: 4,
      title: 'Past Perfect Continuous',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Past Perfect Continuous: had been + V-ing\n\nПодчёркивает ПРОДОЛЖИТЕЛЬНОСТЬ действия, которое происходило до определённого момента в прошлом.\n\nРазница:\n- Past Perfect: had fixed (акцент на завершении)\n- Past Perfect Continuous: had been working (акцент на продолжительности процесса)'
        },
        {
          type: 'text',
          value: 'Примеры Past Perfect Continuous:\n1. We had been looking for a senior developer for three months when we finally found the right candidate.\n2. The server had been running slowly for days before it finally crashed.\n3. She had been trying to reproduce the bug for hours before she realised it was environment-specific.\n4. The team had been working overtime for weeks when the project was suddenly cancelled.\n5. I had been debugging the same issue for two days when a colleague spotted the obvious typo.\n6. The memory leak had been growing for weeks before the monitoring caught it.\n\nВ контексте объяснения причин:\n"The developer was exhausted because he had been working on the production issue all night."\n"The codebase was messy because the team had been cutting corners for years."'
        },
        {
          type: 'tip',
          value: 'Past Perfect Continuous объясняет ПРИЧИНУ состояния в прошлом. Если человек был уставшим — что-то долго делал (Past Perfect Continuous). Если результат готов — Past Perfect. Если состояние — Past Simple/Continuous.'
        }
      ]
    },
    {
      id: 5,
      title: 'Reported Speech и Past Perfect',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Past Perfect часто появляется в Reported Speech (косвенная речь), когда мы пересказываем слова из прошлого. При переносе прямой речи в косвенную Present Perfect → Past Perfect.\n\nПрямая речь → Косвенная речь:\n"I have fixed the bug." → He said he had fixed the bug.\n"We have deployed the update." → She told me they had deployed the update.\n"I have never seen this error before." → He said he had never seen that error before.\n"The tests have passed." → She reported that the tests had passed.\n\nПаттерн в IT-переписке:\n"The client said they had already paid for the subscription."\n"The engineer reported that the service had been restored."\n"She mentioned that the team had discussed this in the last sprint."'
        },
        {
          type: 'text',
          value: 'Ещё примеры из IT-жизни:\n\n"John told me he had reviewed the code, but hadn\'t left any comments yet."\n"The PM said she had spoken to the client and they had approved the new timeline."\n"The DevOps engineer reported that the server had been rebooted successfully."\n"She explained that she had encountered the same issue in her previous job and had found a workaround."\n"The CTO mentioned that the company had been considering a cloud migration for two years."'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: последовательность событий',
      type: 'practice',
      content: [
        {
          type: 'text',
          value: 'Восстановите правильную последовательность событий, используя Past Perfect и Past Simple:\n\nСобытие A → Событие B (B произошло после A)\n\n1. A: push broken code → B: CI pipeline fail\n→ The CI pipeline failed because someone had pushed broken code.\n\n2. A: write migration → B: deploy succeed\n→ The deploy succeeded because the developer had written the migration script.\n\n3. A: team not test the API → B: client find bugs in production\n→ The client found bugs in production because the team hadn\'t tested the API.\n\n4. A: architect design the schema → B: developers start building\n→ By the time the developers started building, the architect had designed the database schema.\n\n5. A: engineer configure the firewall wrong → B: security breach happen\n→ The security breach happened because an engineer had configured the firewall incorrectly.'
        },
        {
          type: 'text',
          value: 'Перепишите постмортем, добавив правильные времена:\n\nОригинал: "The server crash at 3 AM. Before that, it run for 30 days. Someone push a bad config. The alert not trigger because no one set it up. By the time the engineer wake up, the data lose for 200 users."\n\nИсправленная версия:\n"The server crashed at 3 AM. Before that, it had been running for 30 days. Someone had pushed a bad config. The alert hadn\'t triggered because no one had set it up. By the time the engineer woke up, the data had been lost for 200 users."'
        },
        {
          type: 'text',
          value: 'Составьте предложения с Past Perfect по ситуации:\n\nСитуация: You came to work late and missed the standup. Explain what had happened:\n1. I missed the standup because...\n→ I missed the standup because I had overslept / because my alarm had not gone off.\n\n2. When I arrived, the team...\n→ When I arrived, the team had already started the sprint planning.\n\n3. By the time I sat down...\n→ By the time I sat down, my colleagues had already assigned all the tasks.'
        }
      ]
    }
  ]
}
