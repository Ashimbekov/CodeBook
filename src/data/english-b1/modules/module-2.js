export default {
  id: 2,
  title: 'Present Perfect vs Past Simple',
  description: 'Самое частое грамматическое различие для русскоязычных: когда использовать Present Perfect, а когда Past Simple.',
  lessons: [
    {
      id: 1,
      title: 'Главное правило различия',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Это самая распространённая ошибка русскоязычных, потому что в русском оба времени переводятся одинаково — прошедшим временем.\n\nPast Simple = конкретное завершённое действие в конкретное время в прошлом. Время ИЗВЕСТНО и УКАЗАНО (или подразумевается).\n\nPresent Perfect = действие в прошлом, связанное с НАСТОЯЩИМ: либо результат важен сейчас, либо время не указано / не важно.'
        },
        {
          type: 'text',
          value: 'Сравнение:\n\nPast Simple (когда именно — важно):\n1. I fixed the bug at 3 PM yesterday.\n2. We released version 2.0 in March 2023.\n3. She joined the company in 2021.\n4. The server crashed last night.\n5. They deployed the update on Monday.\n\nPresent Perfect (результат сейчас важен):\n1. I have fixed the bug. (= теперь он не мешает, результат есть)\n2. We have released a new version. (= она доступна прямо сейчас)\n3. She has joined the company. (= она уже здесь)\n4. The server has crashed. (= сейчас проблема)\n5. They have deployed the update. (= обновление уже на сервере)'
        },
        {
          type: 'note',
          value: 'Ключевое слово "yet" в вопросах и отрицаниях требует Present Perfect: "Have you tested it yet?" "We haven\'t merged it yet." В Past Simple "yet" не используется.'
        }
      ]
    },
    {
      id: 2,
      title: 'Слова-маркеры каждого времени',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Present Perfect используется со словами:\n- just (только что): I have just pushed the code.\n- already (уже): She has already reviewed the PR.\n- yet (ещё/уже в вопросах): Have you finished the tests yet?\n- ever (когда-либо): Have you ever used Docker?\n- never (никогда): I have never deployed to AWS before.\n- recently / lately (недавно / в последнее время): We have recently switched to TypeScript.\n- so far (до сих пор, пока что): We have fixed 12 bugs so far.\n- since (с какого момента): She has been here since Monday.\n- for (в течение): He has worked here for three years.\n- today / this week / this month (незавершённый период): I have written 200 lines today.'
        },
        {
          type: 'text',
          value: 'Past Simple используется со словами:\n- yesterday: The system went down yesterday.\n- last week/month/year: We launched the product last year.\n- ago: She wrote this code two months ago.\n- in + год: The company was founded in 2015.\n- at + время: The deploy finished at 11:45 PM.\n- on + день: The incident occurred on Friday.\n- when (с конкретным событием): When she was a junior, she used PHP.'
        },
        {
          type: 'text',
          value: 'Примеры противопоставления с IT-контекстом:\n1. "We fixed the critical bug yesterday." vs "We have fixed the critical bug." (можно продолжать работу)\n2. "She left the company last month." vs "She has left the company." (её уже нет)\n3. "Did you deploy the code?" vs "Have you deployed the code yet?"\n4. "We launched the product in 2022." vs "We have recently launched a new product."'
        }
      ]
    },
    {
      id: 3,
      title: 'Present Perfect: опыт и достижения',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Present Perfect часто используется для описания жизненного опыта (без указания времени) и достижений компании или проекта.'
        },
        {
          type: 'text',
          value: 'Личный опыт (на собеседовании):\n1. I have worked with Python for 5 years.\n2. I have built several REST APIs using FastAPI.\n3. I have never worked with legacy COBOL code.\n4. Have you ever led a team of developers?\n5. I have completed three AWS certifications.\n6. She has contributed to several open-source projects.\n7. We have implemented CI/CD pipelines for over 20 projects.\n\nДостижения компании/продукта:\n1. Our platform has served over 1 million users.\n2. We have raised $10 million in Series A funding.\n3. The team has shipped 50 features this year.\n4. Our API has processed 500 million requests.\n5. We have grown from 5 to 50 engineers.'
        },
        {
          type: 'note',
          value: 'На job interview: вопрос "Have you ever used Kubernetes?" — отвечайте Present Perfect, если время не важно. "I have used Kubernetes in my previous job." Но если продолжаете рассказ — переключайтесь на Past Simple: "I used it mainly for container orchestration. We had 15 microservices."'
        }
      ]
    },
    {
      id: 4,
      title: 'Британский и американский английский',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Важное различие: в американском английском (AmE) Past Simple часто используется там, где в британском (BrE) требуется Present Perfect.\n\nBrE (стандартная грамматика):\n1. I have just finished the task.\n2. Did you eat yet? (AmE) / Have you eaten yet? (BrE)\n3. She already sent the report. (AmE) / She has already sent the report. (BrE)\n\nIT-компании (часто AmE):\n- "I just pushed the code." (AmE, но понятно везде)\n- "Did you merge the PR yet?" (AmE)\n- "We already fixed that." (AmE)'
        },
        {
          type: 'text',
          value: 'Практические примеры с "just", "already", "yet":\n\nС "just" (только что):\n1. I have just deployed to production. (BrE formal)\n2. I just deployed to production. (AmE/informal)\n3. She has just found a memory leak.\n\nС "already" (уже):\n1. We have already reviewed the code.\n2. The pipeline has already failed twice today.\n\nС "yet" (ещё/уже — в вопросе):\n1. Have you written the tests yet?\n2. Hasn\'t the client approved the design yet?\n3. We haven\'t merged the feature branch yet.'
        },
        {
          type: 'tip',
          value: 'В профессиональной переписке (email, документация) придерживайтесь классических правил BrE — Present Perfect с just/already/yet. В Slack/Teams допустимо AmE.'
        }
      ]
    },
    {
      id: 5,
      title: 'Переключение: Perfect в Past Simple',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Частая ситуация в разговоре: начинаем с Present Perfect (новость), затем переходим к Past Simple (детали).\n\nПример — сообщение об инциденте:\n"The production server has crashed." (новость — Present Perfect)\n"It crashed at 2:47 AM." (когда — Past Simple)\n"The monitoring system detected an issue 10 minutes before." (детали — Past Simple)\n"The on-call engineer responded immediately." (что произошло — Past Simple)\n"We have since restored the service." (результат сейчас — Present Perfect again)'
        },
        {
          type: 'text',
          value: 'Пример — рассказ о карьере (interview):\n"I have worked as a backend developer for 5 years." (общий опыт — PP)\n"I started my career at a startup in 2019." (конкретный факт — PS)\n"We built a fintech platform from scratch." (что делали — PS)\n"I have since moved to larger companies." (изменение до сейчас — PP)\n"In my current role, I have been leading a team of 4 developers." (PP Continuous)'
        },
        {
          type: 'text',
          value: 'Пример — обсуждение проекта:\n"Have you looked at the requirements yet?" — "Yes, I have." (Present Perfect)\n"When did you read them?" — "I read them this morning." (Past Simple)\n"What did you think?" — "I noticed several ambiguities." (Past Simple)\n"Have you already talked to the product manager?" — "Not yet." (Present Perfect)'
        }
      ]
    },
    {
      id: 6,
      title: 'For vs Since',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'For и since — самые частые предлоги с Present Perfect.\n\nFOR + ПРОДОЛЖИТЕЛЬНОСТЬ (период времени):\nfor 5 years, for three months, for a long time, for ages, for two hours\n\nSINCE + НАЧАЛЬНЫЙ МОМЕНТ (точка отсчёта):\nsince 2020, since Monday, since the last update, since we started, since she joined'
        },
        {
          type: 'text',
          value: 'Примеры с FOR:\n1. We have been using this framework for four years.\n2. The server has been running for 200 days without downtime.\n3. She has worked as a tech lead for six months.\n4. I have been learning Go for the past year.\n5. The bug has existed for at least two releases.\n\nПримеры с SINCE:\n1. We have been using microservices since 2021.\n2. The team has grown from 5 to 20 people since the last funding round.\n3. I have not committed to main since the branching policy changed.\n4. The application has been stable since we fixed the memory leak.\n5. Performance has improved significantly since we added caching.'
        },
        {
          type: 'text',
          value: 'Типичные ошибки:\n- НЕВЕРНО: I have worked here since 3 years. ВЕРНО: I have worked here for 3 years.\n- НЕВЕРНО: She has been in IT for 2019. ВЕРНО: She has been in IT since 2019.\n- НЕВЕРНО: We use this tool since last year. ВЕРНО: We have been using this tool since last year.\n- НЕВЕРНО: The server runs for Monday. ВЕРНО: The server has been running since Monday.'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: IT диалоги и тексты',
      type: 'practice',
      description: 'Выбери правильную форму глагола: Present Perfect или Past Simple.',
      solution: 'Правильные ответы:\n1. have just finished (Present Perfect с just)\n2. Have you ever deployed (Present Perfect с ever)\n3. joined (Past Simple — last week)\n4. has failed (Present Perfect — three times today, незавершённый период)\n5. did you write (Past Simple в вопросе)\n6. haven\'t merged (Present Perfect с yet)',
      content: [
        {
          type: 'text',
          value: 'Диалог 1 — Code Review:\n\nA: "Have you reviewed the pull request I submitted yesterday?"\nB: "I started looking at it, but I haven\'t finished yet."\nA: "When did you start?"\nB: "I started an hour ago. I\'ve already checked the main logic, but I haven\'t looked at the tests yet."\nA: "Did you notice anything critical?"\nB: "Yes, I found a potential SQL injection vulnerability."\nA: "Oh no. Has anyone else seen it?"\nB: "Not yet. I\'ve just found it."'
        },
        {
          type: 'text',
          value: 'Диалог 2 — Sprint Standup:\n\n"Yesterday I worked on the user authentication module. I have completed the login and registration endpoints. I haven\'t finished the password reset flow yet — I\'ll do that today. I also fixed a bug that caused tokens to expire too early. This week I have merged three pull requests. No blockers, but I\'ve noticed that our test coverage has dropped below 80%."'
        },
        {
          type: 'text',
          value: 'Диалог 3 — Incident Postmortem:\n\n"Last Tuesday, our API experienced significant downtime. The outage started at 14:23 UTC and lasted for 47 minutes. A configuration change that was deployed at 14:15 caused the issue. We have since rolled back the change and restored service. Since the incident, we have implemented additional deployment checks. We have not experienced any similar issues so far."'
        },
        {
          type: 'text',
          value: 'Упражнение — выберите правильную форму:\n1. We _____ (just / finish) the code review. → have just finished\n2. _____ you _____ (ever / deploy) to AWS? → Have you ever deployed\n3. She _____ (join) the team last week. → joined\n4. The build _____ (fail) three times today. → has failed\n5. When _____ you _____ (write) this function? → did you write\n6. I _____ (not / merge) the PR yet. → haven\'t merged'
        }
      ]
    }
  ]
}
