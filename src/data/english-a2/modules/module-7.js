export default {
  id: 7,
  title: 'First Conditional',
  description: 'Первый условный тип: реальные условия и последствия, IT-сценарии, if + will.',
  lessons: [
    {
      id: 1,
      title: 'Структура First Conditional',
      type: 'theory',
      content: [
        { type: 'text', value: 'First Conditional (первый тип условного) используется для:\n- Реальных или возможных условий в настоящем/будущем\n- Последствий, которые вероятно произойдут\n\nСтруктура:\nIf + Present Simple, will + инфинитив\n\nВажно:\n- В придаточном предложении (if-clause) используем Present Simple\n- В главном предложении используем will\n- Порядок частей можно менять:\n  "If A, will B" или "Will B if A"' },
        { type: 'heading', value: 'Примеры' },
        { type: 'text', value: 'If you run the tests, you will find the bug. (Если ты запустишь тесты, ты найдёшь баг.)\nIf the build fails, we will not deploy. (Если билд упадёт, мы не будем деплоить.)\nIf you push to main directly, the CI pipeline will reject it. (Если ты запушишь прямо в main, CI пайплайн отклонит это.)\nThe app will crash if you don\'t handle the null value. (Приложение упадёт, если ты не обработаешь null значение.)\nIf we add a cache layer, the API will respond faster. (Если мы добавим слой кэша, API будет отвечать быстрее.)' },
        { type: 'heading', value: 'Больше IT-примеров' },
        { type: 'text', value: 'If the server doesn\'t restart, call DevOps immediately. (Если сервер не перезапустится, позвони в DevOps немедленно.)\nIf you refactor this module, the code will be much cleaner. (Если ты отрефакторишь этот модуль, код станет намного чище.)\nWe won\'t meet the deadline if we don\'t start now. (Мы не уложимся в дедлайн, если не начнём сейчас.)\nIf the user doesn\'t log in, the system will redirect to the login page. (Если пользователь не войдёт в систему, система перенаправит на страницу входа.)' }
      ]
    },
    {
      id: 2,
      title: 'Unless: если не',
      type: 'theory',
      content: [
        { type: 'text', value: 'UNLESS = if not (если не)\n\nUnless you test the code, you will introduce bugs.\n= If you don\'t test the code, you will introduce bugs.\n(Если ты не протестируешь код, ты добавишь баги.)\n\nUnless the server has enough RAM, it will crash.\n= If the server doesn\'t have enough RAM, it will crash.\n(Если у сервера не хватает RAM, он упадёт.)' },
        { type: 'heading', value: 'IT-примеры с unless' },
        { type: 'text', value: 'Unless you add authentication, the API will be vulnerable. (Если ты не добавишь аутентификацию, API будет уязвимым.)\nThe deployment will fail unless the tests pass. (Деплой провалится, если тесты не пройдут.)\nUnless you document this function, others won\'t understand it. (Если ты не задокументируешь эту функцию, другие не поймут её.)\nUnless we scale the database, we won\'t handle the load. (Если мы не масштабируем базу данных, мы не справимся с нагрузкой.)' }
      ]
    },
    {
      id: 3,
      title: 'When vs If: когда vs если',
      type: 'theory',
      content: [
        { type: 'text', value: 'IF — условие: может произойти или нет (неопределённость)\nWHEN — когда это точно произойдёт (уверенность)\n\nОба используются с Present Simple, за которым следует will.\n\nIF (неопределённость):\nIf the tests pass, we will deploy. (Если тесты пройдут — может, пройдут, может, нет)\nIf you find a bug, report it immediately. (Если найдёшь баг — может, найдёшь, может, нет)\n\nWHEN (уверенность):\nWhen the build finishes, I will check the results. (Когда билд завершится — это точно произойдёт)\nWhen you finish the task, update the Jira ticket. (Когда закончишь задачу — это должно произойти)' },
        { type: 'heading', value: 'IT-примеры' },
        { type: 'text', value: 'IF — условие:\nIf the memory usage exceeds 90%, the alert will trigger. (Если использование памяти превысит 90%, сработает оповещение.)\nIf we use a CDN, the page load time will improve. (Если мы используем CDN, время загрузки страницы улучшится.)\n\nWHEN — уверенное событие:\nWhen the sprint ends, we will have a retrospective. (Когда спринт закончится, мы проведём ретроспективу.)\nWhen the new developer joins, we will update the onboarding docs. (Когда придёт новый разработчик, мы обновим документы по онбордингу.)' }
      ]
    },
    {
      id: 4,
      title: 'Другие вспомогательные слова вместо will',
      type: 'theory',
      content: [
        { type: 'text', value: 'В главном предложении вместо will можно использовать:\n\ncan (возможность):\nIf you set up Docker, you can run the app locally. (Если ты настроишь Docker, ты сможешь запустить приложение локально.)\n\nshould (рекомендация):\nIf you see this error, you should restart the service. (Если ты видишь эту ошибку, тебе следует перезапустить сервис.)\n\nmay/might (возможность/вероятность):\nIf we update the library, it might break some features. (Если мы обновим библиотеку, это может сломать некоторые функции.)\n\nimperative (команда/инструкция):\nIf the server doesn\'t respond, check the logs. (Если сервер не отвечает, проверь логи.)\nIf you find a bug, create a ticket immediately. (Если найдёшь баг, сразу создай тикет.)' },
        { type: 'heading', value: 'Диалог: планирование сценариев' },
        { type: 'text', value: 'DevOps: What will happen if the deployment fails? (Что произойдёт, если деплой упадёт?)\nDev: If it fails, we will automatically roll back to the previous version. (Если упадёт, мы автоматически откатимся к предыдущей версии.)\nDevOps: And if the rollback doesn\'t work? (А если откат не сработает?)\nDev: If the rollback fails, we should call the on-call engineer immediately. (Если откат не сработает, нам следует немедленно позвонить дежурному инженеру.)\nDevOps: Good. And when will we know if everything is OK? (Хорошо. И когда мы узнаем, всё ли в порядке?)\nDev: When the health checks pass and error rate drops to zero. (Когда проверки работоспособности пройдут и частота ошибок снизится до нуля.)' }
      ]
    },
    {
      id: 5,
      title: 'Словарный запас: условия и результаты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ключевые слова для условных предложений:\n\nif (если), unless (если не), when (когда), provided that (при условии, что), as long as (пока, при условии что), in case (на случай если)\n\nGlossary условий в IT:\ncondition (условие): If the condition is met...\nresult (результат): The result will be...\nconsequence (последствие): As a consequence...\nscenario (сценарий): In this scenario...\ncase (случай): In case of failure...\nerror handling (обработка ошибок): If an error occurs, the system will...\nfallback (запасной вариант): If the primary fails, we will use the fallback.\nrollback (откат): If the deployment fails, we will rollback.\nretry (повторная попытка): If the request fails, we will retry.\nalert (оповещение): If the threshold is reached, an alert will trigger.' },
        { type: 'heading', value: 'Выражения для IT-документации' },
        { type: 'text', value: 'If the request fails, the system will return a 500 error. (Если запрос не удался, система вернёт ошибку 500.)\nIf the user is not authenticated, redirect to login. (Если пользователь не аутентифицирован, перенаправьте на логин.)\nIf no data is found, return an empty array. (Если данные не найдены, верните пустой массив.)\nIf the response time exceeds 3 seconds, log a warning. (Если время ответа превышает 3 секунды, запишите предупреждение в лог.)' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Составление условных предложений',
      type: 'practice',
            description: 'Соедините части, чтобы создать правильные условные предложения.',
      solution: 'Правильные ответы:\\n1. fail / will not deploy\\n2. add / will crash\\n3. use / will improve\\n4. will succeed / fix\\n5. have / will refactor\\n6. will miss / start\\n7. doesn\'t respond / restart',
content: [
        { type: 'text', value: 'Соедините части, чтобы создать правильные условные предложения.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'If the tests ___ (fail), we ___ (not deploy) to production.', answer: 'fail / will not deploy' },
            { id: 2, question: 'Unless you ___ (add) error handling, the app ___ (crash).', answer: 'add / will crash' },
            { id: 3, question: 'If we ___ (use) a CDN, the load time ___ (improve).', answer: 'use / will improve' },
            { id: 4, question: 'The build ___ (succeed) if you ___ (fix) this compile error.', answer: 'will succeed / fix' },
            { id: 5, question: 'If I ___ (have) time, I ___ (refactor) this module.', answer: 'have / will refactor' },
            { id: 6, question: 'We ___ (miss) the deadline unless we ___ (start) now.', answer: 'will miss / start' },
            { id: 7, question: 'If the server ___ (not respond), check the logs and ___ (restart) it.', answer: 'doesn\'t respond / restart' }
          ]
        }
      ]
    }
  ]
}
