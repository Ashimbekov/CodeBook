export default {
  id: 1,
  title: 'Все времена: система и сравнение',
  description: 'Полная система английских времён: Present, Past, Future в Simple, Continuous, Perfect и Perfect Continuous формах.',
  lessons: [
    {
      id: 1,
      title: 'Обзор системы времён',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'В английском языке существует 12 основных времён, сгруппированных в 4 группы: Simple (простые), Continuous (длительные), Perfect (завершённые) и Perfect Continuous (завершённо-длительные). Каждая группа делится на Present, Past и Future.'
        },
        {
          type: 'table',
          value: 'Группа | Present | Past | Future\nSimple | do/does | did | will do\nContinuous | am/is/are doing | was/were doing | will be doing\nPerfect | have/has done | had done | will have done\nPerfect Continuous | have/has been doing | had been doing | will have been doing'
        },
        {
          type: 'text',
          value: 'Ключевое правило выбора времени: спросите себя — КОГДА произошло действие (Present/Past/Future), и КАК оно происходило (Simple/Continuous/Perfect/Perfect Continuous).'
        },
        {
          type: 'tip',
          value: 'Simple = факт или привычка. Continuous = процесс в момент. Perfect = связь с другим моментом. Perfect Continuous = продолжительность до определённого момента.'
        }
      ]
    },
    {
      id: 2,
      title: 'Present Simple и Present Continuous',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Present Simple (настоящее простое) используется для постоянных фактов, привычек и расписаний. Образование: I/you/we/they + V1, he/she/it + V1+s.\n\nPresent Continuous (настоящее длительное) используется для действий, происходящих прямо сейчас или временных ситуаций. Образование: am/is/are + V-ing.'
        },
        {
          type: 'text',
          value: 'Примеры Present Simple:\n1. The server processes 1000 requests per second.\n2. Our team uses Git for version control.\n3. She reviews pull requests every morning.\n4. The database stores user credentials.\n5. We deploy code every Friday.\n6. The app crashes when memory exceeds 2GB.\n7. He writes unit tests for every feature.\n\nПримеры Present Continuous:\n1. The build is currently running — don\'t push new commits.\n2. We are migrating the database to PostgreSQL this week.\n3. She is debugging the payment module right now.\n4. The DevOps team is setting up a new Kubernetes cluster.\n5. I am working on the authentication service.\n6. They are reviewing our proposal at the moment.'
        },
        {
          type: 'note',
          value: 'Глаголы состояния (stative verbs) не употребляются в Continuous: know, understand, believe, want, need, have (= владеть), contain, belong. Нельзя: "I am knowing this". Правильно: "I know this".'
        },
        {
          type: 'text',
          value: 'Типичные ошибки:\n- НЕВЕРНО: We are using Python for data science (постоянный факт). ВЕРНО: We use Python for data science.\n- НЕВЕРНО: The server contain 500GB. ВЕРНО: The server contains 500GB.\n- НЕВЕРНО: I am knowing the answer. ВЕРНО: I know the answer.'
        }
      ]
    },
    {
      id: 3,
      title: 'Past Simple и Past Continuous',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Past Simple (прошедшее простое) — завершённое действие в прошлом в конкретный момент. Образование: V2 (правильные: +ed, неправильные: 2-я форма).\n\nPast Continuous (прошедшее длительное) — действие, происходившее в определённый момент в прошлом. Образование: was/were + V-ing.'
        },
        {
          type: 'text',
          value: 'Примеры Past Simple:\n1. The production server went down last night at 2 AM.\n2. We released version 2.0 in March.\n3. The bug caused data loss for 50 users.\n4. She joined the company three years ago.\n5. They migrated to microservices last year.\n6. The CI/CD pipeline failed on Tuesday.\n\nПримеры Past Continuous:\n1. The server was handling 500 requests when it crashed.\n2. We were deploying the update when the power outage happened.\n3. I was writing the documentation when she called.\n4. They were running load tests all day yesterday.\n5. The team was working on the new feature when the bug was discovered.'
        },
        {
          type: 'text',
          value: 'Комбинация Past Simple + Past Continuous:\nWhen I was debugging the code (Continuous — фоновое действие), I found (Simple — прерывающее действие) a critical security flaw.\n\nWhile the deployment was running (Continuous), the monitoring system detected (Simple) unusual CPU usage.'
        },
        {
          type: 'note',
          value: 'Past Simple отвечает на вопрос "Когда именно?" — нужен конкретный момент или период в прошлом. Слова-маркеры: yesterday, last week, ago, in 2020, at 3 PM.'
        }
      ]
    },
    {
      id: 4,
      title: 'Future: will, going to, Present Continuous',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'В английском есть три основных способа выражения будущего:\n\n1. Will + V1 — спонтанное решение, предсказание, обещание\n2. Going to + V1 — запланированное намерение, предсказание на основе очевидных признаков\n3. Present Continuous — заранее договорённая встреча или расписание'
        },
        {
          type: 'text',
          value: 'Примеры с will:\n1. The app will be released next quarter.\n2. I\'ll fix that bug right now — give me a moment.\n3. This approach will cause performance issues in the future.\n4. Don\'t worry, I\'ll review your pull request today.\n\nПримеры с going to:\n1. We are going to switch to microservices architecture.\n2. The team is going to demo the product to stakeholders next week.\n3. Look at these error logs — the server is going to crash soon.\n4. I\'m going to refactor this module this sprint.\n\nПримеры с Present Continuous (договорённости):\n1. We are meeting with the client tomorrow at 10 AM.\n2. The team is presenting the MVP on Friday.\n3. She is starting as a senior developer next Monday.'
        },
        {
          type: 'tip',
          value: 'Правило выбора: услышал новость и реагируешь = will. Уже планировал = going to. Договорился о конкретном времени = Present Continuous.'
        },
        {
          type: 'text',
          value: 'Типичные ошибки:\n- НЕВЕРНО: I am going to call you right now (= немедленная реакция). ВЕРНО: I will call you right now.\n- НЕВЕРНО: The meeting will be tomorrow at 3 (уже договорились). ВЕРНО: The meeting is tomorrow at 3.'
        }
      ]
    },
    {
      id: 5,
      title: 'Perfect времена: ключевые различия',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Present Perfect (have/has + V3) связывает прошлое с настоящим. Используется когда результат важен сейчас, или когда точное время не указано/не важно.\n\nPast Perfect (had + V3) — действие, завершившееся ДО другого момента в прошлом. "Прошедшее в прошедшем".\n\nFuture Perfect (will have + V3) — действие, которое завершится ДО определённого момента в будущем.'
        },
        {
          type: 'text',
          value: 'Present Perfect:\n1. We have deployed the new version to production.\n2. The team has fixed all critical bugs.\n3. She has worked at this company for five years.\n4. I have never used Kubernetes before.\n5. The client has approved the design.\n\nPast Perfect:\n1. By the time we found the bug, it had already caused data corruption.\n2. The server had been running for 200 days before the update.\n3. She had already pushed the code when we reviewed the requirements.\n4. We had finished the sprint when the client changed requirements.\n\nFuture Perfect:\n1. By the end of the sprint, we will have completed 15 story points.\n2. The system will have processed all requests before midnight.\n3. By 2027, AI will have replaced many routine coding tasks.'
        },
        {
          type: 'note',
          value: 'Ключевые слова-маркеры: Present Perfect — already, just, yet, ever, never, recently, so far, for, since. Past Perfect — by the time, before, after, when (в контексте последовательности). Future Perfect — by (the time), before.'
        }
      ]
    },
    {
      id: 6,
      title: 'Continuous Perfect времена',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Perfect Continuous времена подчёркивают ПРОДОЛЖИТЕЛЬНОСТЬ действия до определённого момента.\n\nPresent Perfect Continuous (have/has been + V-ing) — действие началось в прошлом и всё ещё продолжается, или только что завершилось.\n\nPast Perfect Continuous (had been + V-ing) — действие продолжалось до определённого момента в прошлом.\n\nFuture Perfect Continuous (will have been + V-ing) — действие будет продолжаться до определённого момента в будущем.'
        },
        {
          type: 'text',
          value: 'Present Perfect Continuous:\n1. We have been working on this feature for three weeks.\n2. The server has been running without downtime for 100 days.\n3. She has been learning TypeScript since January.\n4. I have been trying to reproduce this bug all morning.\n5. The team has been using Agile methodology for two years.\n\nPast Perfect Continuous:\n1. We had been debugging the issue for hours before we found the root cause.\n2. The process had been consuming too much memory before we optimized it.\n3. She had been waiting for the code review when her laptop crashed.\n\nFuture Perfect Continuous:\n1. By next year, we will have been using this framework for five years.\n2. When the project ends, the team will have been working together for six months.'
        },
        {
          type: 'tip',
          value: 'Present Perfect Continuous vs Present Perfect: "I have written 500 lines of code" (результат — важны строки), "I have been writing code for 5 hours" (продолжительность — важно время).'
        }
      ]
    },
    {
      id: 7,
      title: 'Маркеры времён: слова-подсказки',
      type: 'practice',
      description: 'Определи правильное время глагола по словам-маркерам в предложении.',
      solution: 'Правильные ответы:\n1. released (Past Simple — yesterday)\n2. has worked (Present Perfect — for two years)\n3. deploy (Present Simple — every Friday)\n4. am fixing (Present Continuous — right now)\n5. will have finished (Future Perfect — by tomorrow)\n6. had been coding (Past Perfect Continuous — for 5 hours when...)',
      content: [
        {
          type: 'text',
          value: 'Слова-маркеры помогают быстро определить нужное время. Запомните эти ключевые сигналы:\n\nPresent Simple: always, usually, often, sometimes, every day/week, never, on Mondays\n\nPresent Continuous: now, at the moment, currently, at present, right now, today\n\nPast Simple: yesterday, last week/month/year, ago, in 2020, at 3 PM, on Monday\n\nPast Continuous: while, when (+ Simple), at that time, all day yesterday\n\nPresent Perfect: just, already, yet, ever, never, recently, lately, so far, up to now, since, for\n\nPast Perfect: by the time, before, after, already (в прошлом), by + time in past\n\nFuture Simple (will): tomorrow, next week, soon, in the future, probably\n\nFuture (going to): plan to, intend to, about to'
        },
        {
          type: 'text',
          value: 'Практика — определите время:\n1. We _____ (release) the update yesterday. → Past Simple: released\n2. She _____ (work) here for two years. → Present Perfect: has worked\n3. They _____ (deploy) code every Friday. → Present Simple: deploy\n4. I _____ (fix) the bug right now. → Present Continuous: am fixing\n5. By tomorrow, we _____ (finish) the tests. → Future Perfect: will have finished\n6. He _____ (code) for 5 hours when the server crashed. → Past Perfect Continuous: had been coding'
        },
        {
          type: 'note',
          value: 'Частые ошибки русскоязычных: путают Present Perfect и Past Simple (в русском оба переводятся прошедшим). Правило: если есть конкретное время в прошлом — Past Simple. Если время не важно или результат важен сейчас — Present Perfect.'
        }
      ]
    },
    {
      id: 8,
      title: 'Времена в IT-контексте: практика',
      type: 'practice',
      description: 'Исправь ошибки в употреблении времён в IT-предложениях.',
      solution: 'Правильные ответы:\n1. She has been working here since 2019. (Present Perfect Continuous + since)\n2. I have already sent the report. (Present Perfect с already)\n3. We haven\'t deployed the new version yet. (Present Perfect с yet)\n4. When did you work on this project? (Past Simple в вопросе)\n5. By tomorrow I will have finished the task. (Future Perfect)',
      content: [
        {
          type: 'text',
          value: 'Реальные IT-ситуации с разными временами:\n\nStandup meeting (ежедневная встреча):\n"Yesterday I worked on the authentication module. Today I am implementing the password reset feature. I will be reviewing John\'s pull request this afternoon. I have already fixed the bug from last sprint. I\'ve been working on the API documentation all week."\n\nIncident report (отчёт об инциденте):\n"At 2:47 AM, the database server went down. The on-call engineer was sleeping when the alert triggered. By the time the team responded, the service had been down for 12 minutes. We have since restored the service and will implement better monitoring."\n\nCode review comment:\n"I noticed you have been using a deprecated API. We switched to the new version last month. This will cause issues in future releases. Can you update it before we merge?"\n\nProject status update:\n"We are currently building the payment integration. We have completed the UI design and the backend API. We have been testing the third-party service since Monday. We will release the feature by end of next week."'
        },
        {
          type: 'text',
          value: 'Упражнение — исправьте ошибки в этих предложениях:\n1. She is working here since 2019. → She has been working here since 2019.\n2. I already sent the report. → I have already sent the report.\n3. We didn\'t deployed the new version yet. → We haven\'t deployed the new version yet.\n4. When did you worked on this project? → When did you work on this project?\n5. By tomorrow I finish the task. → By tomorrow I will have finished the task.'
        },
        {
          type: 'tip',
          value: 'Совет: читайте английские tech-блоги и обращайте внимание на времена глаголов. GitHub Issues, Stack Overflow, Medium — отличные источники живого IT-английского.'
        }
      ]
    }
  ]
}
