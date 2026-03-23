export default {
  id: 3,
  title: 'Present Perfect Continuous',
  description: 'Present Perfect Continuous: подчёркиваем продолжительность действия, которое началось в прошлом и продолжается сейчас.',
  lessons: [
    {
      id: 1,
      title: 'Образование и основное значение',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Present Perfect Continuous образуется: have/has + been + V-ing\n\nI/You/We/They have been working\nHe/She/It has been running\n\nОтрицание: haven\'t/hasn\'t been + V-ing\nВопрос: Have/Has + подлежащее + been + V-ing?\n\nОсновные значения:\n1. Действие началось в прошлом и ВСЁ ЕЩЁ ПРОДОЛЖАЕТСЯ сейчас\n2. Действие продолжалось долго и только что завершилось (виден результат)\n3. Подчёркивается ПРОДОЛЖИТЕЛЬНОСТЬ, а не результат'
        },
        {
          type: 'text',
          value: 'Примеры (действие ещё продолжается):\n1. I have been working on this bug for three hours and still can\'t fix it.\n2. We have been migrating the database since last Monday.\n3. She has been learning Rust for the past six months.\n4. The team has been using Jira for task management since 2020.\n5. The server has been processing that request for too long — something is wrong.\n6. They have been rewriting the backend in Go for a year now.\n\nПримеры (только что завершилось, виден результат):\n1. I\'m exhausted — I have been debugging all night.\n2. The server is warm because it has been running heavy computations.\n3. She knows the codebase well because she has been reviewing it all week.'
        },
        {
          type: 'tip',
          value: 'Ключевые слова-маркеры: for (+ период), since (+ момент), all day/week/morning, how long, lately, recently. Вопрос "How long have you been...?" почти всегда требует Present Perfect Continuous.'
        }
      ]
    },
    {
      id: 2,
      title: 'PPC vs Present Perfect: продолжительность vs результат',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Это ключевое различие:\n\nPresent Perfect (have + V3) акцентирует РЕЗУЛЬТАТ или ФАКТ завершения.\nPresent Perfect Continuous (have been + V-ing) акцентирует ПРОДОЛЖИТЕЛЬНОСТЬ процесса.\n\nОба могут иногда использоваться взаимозаменяемо с for/since, но смысловой акцент разный.'
        },
        {
          type: 'text',
          value: 'Сравнение пар:\n\n1. "I have written 500 lines of code today."\n   (акцент: результат — 500 строк написано)\n   "I have been writing code all day."\n   (акцент: процесс — весь день занимался этим)\n\n2. "She has reviewed 10 pull requests."\n   (акцент: количество — конкретная цифра)\n   "She has been reviewing pull requests all morning."\n   (акцент: занятость — чем занималась)\n\n3. "We have deployed three times today."\n   (акцент: количество деплоев)\n   "We have been deploying updates all day."\n   (акцент: продолжительный процесс деплоя)\n\n4. "He has fixed the bug."\n   (акцент: баг исправлен — завершено)\n   "He has been trying to fix the bug for hours."\n   (акцент: процесс всё ещё идёт, безуспешно или с трудом)'
        },
        {
          type: 'note',
          value: 'С некоторыми глаголами (live, work, study, wait) оба времени взаимозаменяемы с for/since: "I have lived in London for 5 years" = "I have been living in London for 5 years". Но в IT-контексте лучше использовать Continuous для процессов: "We have been building this feature for 2 sprints."'
        }
      ]
    },
    {
      id: 3,
      title: 'PPC vs Past Continuous',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Past Continuous (was/were doing) — действие происходило в КОНКРЕТНЫЙ МОМЕНТ В ПРОШЛОМ.\nPresent Perfect Continuous (have been doing) — действие продолжается ДО СЕЙЧАС.\n\nГлавный вопрос: действие завершилось в прошлом или связано с настоящим?'
        },
        {
          type: 'text',
          value: 'Past Continuous (завершилось в прошлом):\n1. At midnight, the team was still working on the deployment.\n2. When you called, I was reviewing the logs.\n3. The server was processing requests when the power went out.\n4. She was writing documentation when the bug was reported.\n\nPresent Perfect Continuous (связано с настоящим):\n1. The team has been working on the deployment all night — they\'re still at it.\n2. I have been reviewing the logs since you called.\n3. The server has been processing this request for 10 minutes — check what\'s wrong.\n4. She has been writing documentation all day — it should be ready soon.'
        },
        {
          type: 'text',
          value: 'Диалог для сравнения:\n\n"What were you doing at 2 AM?" (Past Continuous — конкретный момент)\n— "I was debugging the production issue."\n\n"Why are you so tired this morning?"\n— "I have been debugging a production issue all night." (PPC — объясняет текущее состояние)'
        }
      ]
    },
    {
      id: 4,
      title: 'Глаголы, не используемые в Continuous',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Stative verbs (глаголы состояния) НЕ используются в любых Continuous формах, включая Present Perfect Continuous.\n\nГлаголы мышления: know, understand, believe, think (= считать), remember, forget, realise, mean\n\nГлаголы чувств: like, love, hate, prefer, want, need, wish\n\nГлаголы обладания: have (= владеть), own, belong, contain, consist\n\nГлаголы восприятия: see, hear, smell, taste, notice\n\nДругие: be, seem, appear, matter, depend, weigh, cost, include'
        },
        {
          type: 'text',
          value: 'Примеры ошибок и исправлений:\n\nНЕВЕРНО: I have been knowing this algorithm for years.\nВЕРНО: I have known this algorithm for years.\n\nНЕВЕРНО: She has been understanding the requirements since Monday.\nВЕРНО: She has understood the requirements since Monday.\n\nНЕВЕРНО: We have been needing a DevOps engineer for months.\nВЕРНО: We have needed a DevOps engineer for months.\n\nНЕВЕРНО: The app has been containing a security flaw since launch.\nВЕРНО: The app has contained a security flaw since launch.\n\nНЕВЕРНО: He has been believing this approach is wrong.\nВЕРНО: He has believed this approach is wrong for a long time.'
        },
        {
          type: 'note',
          value: 'Некоторые глаголы могут быть и stative, и active: "think" как состояние (= считать): "I have always thought this was wrong." "think" как действие (= думать над чем-то): "I have been thinking about the architecture all week." Аналогично: have (владеть) vs have (проводить): "We\'ve been having meetings every day."'
        }
      ]
    },
    {
      id: 5,
      title: 'IT-контекст: проекты и процессы',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Present Perfect Continuous особенно полезен в IT для описания текущих задач, долгосрочных процессов и объяснения текущего состояния системы.\n\nОписание текущих задач (standup):\n1. I have been implementing the new caching layer since Tuesday.\n2. We have been investigating the performance degradation all week.\n3. The QA team has been running regression tests since yesterday.\n4. I have been refactoring the legacy payment module for two sprints.\n5. She has been learning the new tech stack for the past month.\n\nСостояние системы:\n1. The server has been experiencing high CPU usage for the past hour.\n2. The pipeline has been failing intermittently since last deployment.\n3. Users have been reporting slow response times since the update.\n4. Memory consumption has been increasing gradually — possible memory leak.\n5. The monitoring system has been sending false alerts all morning.'
        },
        {
          type: 'text',
          value: 'Объяснение текущего состояния:\n\n"Why is the codebase so messy?"\n— "Multiple teams have been working on it without coordination for years."\n\n"Why are you so stressed?"\n— "I have been dealing with production incidents since Monday."\n\n"Why is the feature taking so long?"\n— "We have been waiting for the API from the third-party provider."\n\n"Why does this service use so much memory?"\n— "It has been accumulating cached objects since the last restart."'
        }
      ]
    },
    {
      id: 6,
      title: 'How long...? Вопросы о продолжительности',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Вопрос "How long...?" почти всегда требует Present Perfect или Present Perfect Continuous.\n\nФормы вопроса:\n- How long have you been working on this?\n- How long has the server been running?\n- How long have they been using this tool?\n- How long has this bug existed?\n\nОтвет с for/since:\n- I have been working on this for three days.\n- The server has been running since last Monday.\n- They have been using this tool for two years.\n- This bug has existed since version 1.3.'
        },
        {
          type: 'text',
          value: 'Практические IT-примеры:\n\nA: "How long have you been learning Kubernetes?"\nB: "I have been studying it for about four months. I got my CKA certification last week."\n\nA: "How long has this service been down?"\nB: "It has been down for about 20 minutes. We are investigating."\n\nA: "How long have you been waiting for the code review?"\nB: "I submitted the PR two days ago, so I\'ve been waiting for 48 hours."\n\nA: "How long has your team been using React?"\nB: "We have been using React since 2018, but we started migrating to Next.js this year."'
        },
        {
          type: 'tip',
          value: 'На техническом интервью вопрос "How long have you been programming?" ожидает ответ с Present Perfect Continuous: "I have been coding professionally for 5 years, though I started learning as a hobby in university."'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: исправление ошибок и составление предложений',
      type: 'practice',
      description: 'Исправь ошибки в использовании Present Perfect Continuous и составь предложения по подсказкам.',
      solution: 'Правильные ответы (исправление ошибок):\n1. We have been working on this feature for two weeks.\n2. She has been debugging the issue all morning.\n3. I have been working here since January.\n4. How long has the server been down?\n5. They have been testing the application for three days and are still finding bugs.\n6. We have been having this issue since the last update.\n\nПравильные ответы (составление предложений):\n1. The team has been working on the migration for two months.\n2. I have been trying to reach the client since yesterday morning.\n3. The application has been using too much RAM for the past hour.\n4. She has been learning DevOps practices since she joined the team.\n5. They have been interviewing candidates all week.',
      content: [
        {
          type: 'text',
          value: 'Исправьте ошибки:\n\n1. We are working on this feature since two weeks.\n→ We have been working on this feature for two weeks.\n\n2. She is debugging the issue all morning.\n→ She has been debugging the issue all morning.\n\n3. I worked here since January.\n→ I have been working here since January.\n\n4. How long is the server down?\n→ How long has the server been down?\n\n5. They test the application for three days and still finding bugs.\n→ They have been testing the application for three days and are still finding bugs.\n\n6. I know this problem — we are having this issue since the last update.\n→ I know this problem — we have been having this issue since the last update.'
        },
        {
          type: 'text',
          value: 'Составьте предложения, используя Present Perfect Continuous:\n\n1. the team / work / on the migration / for two months\n→ The team has been working on the migration for two months.\n\n2. I / try / to reach the client / since yesterday morning\n→ I have been trying to reach the client since yesterday morning.\n\n3. the application / use / too much RAM / for the past hour\n→ The application has been using too much RAM for the past hour.\n\n4. she / learn / DevOps practices / since she joined the team\n→ She has been learning DevOps practices since she joined the team.\n\n5. they / interview / candidates / all week\n→ They have been interviewing candidates all week.'
        },
        {
          type: 'text',
          value: 'Напишите свой standup, используя Present Perfect Continuous:\n\nШаблон:\n"I have been working on [task] since [когда / how long].\nI have been [процесс] and [результат/статус].\nToday I will continue [что продолжите] and start [что начнёте]."\n\nПример:\n"I have been working on the payment integration since Monday. I have been collaborating with the backend team to define the API contract. I have also been writing unit tests for the existing modules. Today I will continue implementing the checkout flow and start reviewing the security requirements."'
        }
      ]
    }
  ]
}
