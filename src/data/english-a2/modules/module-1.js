export default {
  id: 1,
  title: 'Present Simple vs Present Continuous',
  description: 'Настоящее простое и настоящее продолженное время: правила употребления, IT-примеры, отличия.',
  lessons: [
    {
      id: 1,
      title: 'Present Simple: факты и привычки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Present Simple (настоящее простое) используется для:\n- Постоянных фактов и истин\n- Привычных действий и рутины\n- Расписаний и графиков\n\nФорма: I/You/We/They + глагол. He/She/It + глагол + -s/-es.' },
        { type: 'heading', value: 'Структура предложений' },
        { type: 'text', value: 'Утвердительные:\nI work as a developer. (Я работаю разработчиком.)\nShe writes code every day. (Она пишет код каждый день.)\nThe server starts at 8 AM. (Сервер запускается в 8 утра.)\n\nОтрицательные: do not (don\'t) / does not (doesn\'t) + глагол\nI don\'t use Windows. (Я не использую Windows.)\nHe doesn\'t write tests. (Он не пишет тесты.)\n\nВопросительные: Do/Does + подлежащее + глагол?\nDo you use Python? (Ты используешь Python?)\nDoes the app work? (Приложение работает?)' },
        { type: 'heading', value: 'IT-примеры' },
        { type: 'text', value: 'The function returns a boolean value. (Функция возвращает булево значение.)\nWe deploy updates every Friday. (Мы деплоим обновления каждую пятницу.)\nThe database stores user data. (База данных хранит данные пользователей.)\nOur team uses Agile methodology. (Наша команда использует методологию Agile.)\nThis class inherits from BaseModel. (Этот класс наследуется от BaseModel.)\nThe API returns JSON. (API возвращает JSON.)\nHe reviews pull requests daily. (Он проверяет pull requests ежедневно.)\nThe bug appears in production only. (Баг появляется только на продакшне.)' },
        { type: 'heading', value: 'Наречия частотности' },
        { type: 'text', value: 'always (всегда), usually (обычно), often (часто), sometimes (иногда), rarely (редко), never (никогда)\n\nI always commit my code before lunch. (Я всегда коммичу код перед обедом.)\nShe sometimes works from home. (Она иногда работает из дома.)\nWe never push to main directly. (Мы никогда не пушим прямо в main.)' }
      ]
    },
    {
      id: 2,
      title: 'Present Continuous: действия прямо сейчас',
      type: 'theory',
      content: [
        { type: 'text', value: 'Present Continuous (настоящее продолженное) используется для:\n- Действий, происходящих прямо сейчас\n- Временных ситуаций\n- Запланированных действий в будущем\n- Раздражающих привычек (с always)\n\nФорма: am/is/are + глагол + -ing' },
        { type: 'heading', value: 'Структура предложений' },
        { type: 'text', value: 'Утвердительные:\nI am debugging the code right now. (Я сейчас отлаживаю код.)\nShe is working on a new feature. (Она работает над новой функцией.)\nWe are reviewing the PR. (Мы проверяем PR.)\n\nОтрицательные: am not / is not (isn\'t) / are not (aren\'t) + -ing\nI\'m not attending the meeting today. (Я сегодня не участвую в митинге.)\nThe service isn\'t responding. (Сервис не отвечает.)\n\nВопросительные: Am/Is/Are + подлежащее + -ing?\nAre you testing the new version? (Ты тестируешь новую версию?)\nIs the build running? (Билд запущен/идёт?)' },
        { type: 'heading', value: 'IT-примеры' },
        { type: 'text', value: 'I am currently fixing a critical bug. (Я сейчас исправляю критический баг.)\nThe team is migrating to a new framework. (Команда мигрирует на новый фреймворк.)\nThey are setting up the CI/CD pipeline. (Они настраивают CI/CD пайплайн.)\nShe is learning Docker this month. (В этом месяце она изучает Docker.)\nWe are refactoring the authentication module. (Мы рефакторим модуль аутентификации.)\nThe server is handling too many requests. (Сервер обрабатывает слишком много запросов.)' }
      ]
    },
    {
      id: 3,
      title: 'Ключевые различия: Simple vs Continuous',
      type: 'theory',
      content: [
        { type: 'text', value: 'Главное правило: Present Simple = регулярно/всегда. Present Continuous = прямо сейчас/временно.\n\nСравни:\nI work with Python. (Я работаю с Python — это моя специализация.)\nI am working on a Python project. (Я работаю над Python-проектом — прямо сейчас.)\n\nShe writes unit tests. (Она пишет юнит-тесты — это её обязанность.)\nShe is writing a unit test. (Она пишет юнит-тест — в данный момент.)' },
        { type: 'heading', value: 'Глаголы-состояния (Stative Verbs)' },
        { type: 'text', value: 'Некоторые глаголы НЕ употребляются в Continuous!\nknow (знать), understand (понимать), believe (верить), want (хотеть), need (нуждаться), have (иметь), like (нравиться), see (видеть), hear (слышать)\n\nПравильно:\nI know the answer. (Я знаю ответ.)\nI understand the requirements. (Я понимаю требования.)\nI need more time. (Мне нужно больше времени.)\n\nНЕправильно: I am knowing / I am understanding / I am needing' },
        { type: 'heading', value: 'Сигнальные слова' },
        { type: 'text', value: 'Present Simple: always, usually, often, sometimes, never, every day/week, on Mondays, at 9 AM\n\nPresent Continuous: now, right now, at the moment, currently, today, this week, this month, still' },
        { type: 'heading', value: 'Больше IT-примеров' },
        { type: 'text', value: 'Present Simple:\nThe CI pipeline runs tests on every commit. (CI пайплайн запускает тесты на каждый коммит.)\nOur API accepts POST requests. (Наш API принимает POST запросы.)\nDevelopers use Git for version control. (Разработчики используют Git для контроля версий.)\n\nPresent Continuous:\nWe are currently redesigning the database schema. (Мы сейчас перепроектируем схему базы данных.)\nThe QA team is testing the new release. (Команда QA тестирует новый релиз.)\nI\'m still waiting for code review feedback. (Я всё ещё жду фидбека по код-ревью.)' }
      ]
    },
    {
      id: 4,
      title: 'Диалоги и живые примеры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Диалог 1: На стендапе\n\nManager: What do you usually work on? (Над чем ты обычно работаешь?)\nDev: I work on the backend API. (Я работаю над backend API.)\nManager: What are you working on today? (Над чем ты работаешь сегодня?)\nDev: Today I am fixing a bug in the authentication service. (Сегодня я исправляю баг в сервисе аутентификации.)\n\nДиалог 2: В команде\n\nAlice: Does the new feature work? (Новая функция работает?)\nBob: It works in staging, but I\'m still testing it. (В staging работает, но я ещё тестирую.)\nAlice: Do you need help? (Тебе нужна помощь?)\nBob: No, I\'m good. I just need an hour. (Нет, всё хорошо. Мне нужен всего час.)' },
        { type: 'heading', value: 'Полезные фразы для работы' },
        { type: 'text', value: 'I\'m currently working on... (Я сейчас работаю над...)\nI usually finish tasks by... (Я обычно заканчиваю задачи к...)\nThe system supports... (Система поддерживает...)\nWe are migrating our infrastructure to... (Мы мигрируем нашу инфраструктуру на...)\nThis module handles... (Этот модуль обрабатывает...)\nI\'m not sure I understand the requirement. (Я не уверен, что понимаю требование.)' }
      ]
    },
    {
      id: 5,
      title: 'Словарный запас: IT-глаголы в Simple и Continuous',
      type: 'theory',
      content: [
        { type: 'text', value: 'Глаголы, часто используемые в IT:\n\ndeploy (деплоить) — We deploy on Fridays. / We are deploying now.\ntest (тестировать) — She tests new features. / She is testing a bug fix.\nreview (проверять) — He reviews PRs daily. / He is reviewing my code.\nbuild (собирать/строить) — The pipeline builds the app. / The pipeline is building.\nrun (запускать) — The script runs every hour. / The server is running.\nfix (исправлять) — I fix bugs every sprint. / I am fixing a critical bug.\nupdate (обновлять) — We update dependencies monthly. / We are updating the database.\nmonitor (мониторить) — They monitor the servers. / They are monitoring the traffic.\nrefactor (рефакторить) — We refactor old code. / We are refactoring the module.\noptimize (оптимизировать) — She optimizes queries. / She is optimizing the search function.' },
        { type: 'heading', value: 'Существительные для контекста' },
        { type: 'text', value: 'feature (функция/фича), bug (баг), deployment (деплой), release (релиз), sprint (спринт), pipeline (пайплайн), repository (репозиторий), branch (ветка), commit (коммит), review (ревью), server (сервер), database (база данных), API (интерфейс программирования), service (сервис)' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Перевод предложений',
      type: 'practice',
            description: 'Переведите на английский язык. Определите, какое время использовать.',
      solution: 'Правильные ответы:\\n1. He usually works on the backend.\\n2. She is fixing a bug right now.\\n3. We deploy every Thursday.\\n4. The team is migrating the database.\\n5. The API returns JSON.\\n6. I am learning Kubernetes now.\\n7. The CI pipeline runs tests on every push.\\n8. They are doing a code review.',
content: [
        { type: 'text', value: 'Переведите на английский язык. Определите, какое время использовать.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Он обычно работает над backend.', answer: 'He usually works on the backend.' },
            { id: 2, question: 'Сейчас она исправляет баг.', answer: 'She is fixing a bug right now.' },
            { id: 3, question: 'Мы деплоим каждый четверг.', answer: 'We deploy every Thursday.' },
            { id: 4, question: 'Команда сейчас мигрирует базу данных.', answer: 'The team is migrating the database.' },
            { id: 5, question: 'API возвращает JSON.', answer: 'The API returns JSON.' },
            { id: 6, question: 'Я сейчас изучаю Kubernetes.', answer: 'I am learning Kubernetes now.' },
            { id: 7, question: 'CI пайплайн запускает тесты на каждый пуш.', answer: 'The CI pipeline runs tests on every push.' },
            { id: 8, question: 'Они сейчас проводят код-ревью.', answer: 'They are doing a code review.' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Выбор правильной формы',
      type: 'practice',
            description: 'Выберите правильную форму глагола — Present Simple или Present Continuous.',
      solution: 'Правильные ответы:\\n1. is working\\n2. processes\\n3. don\'t understand\\n4. is migrating\\n5. reviews\\n6. is crashing\\n7. push\\n8. am currently fixing',
content: [
        { type: 'text', value: 'Выберите правильную форму глагола — Present Simple или Present Continuous.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'She ___ (work/is working) from home today because the office is closed.', answer: 'is working' },
            { id: 2, question: 'Our system ___ (process/is processing) thousands of requests per second.', answer: 'processes' },
            { id: 3, question: 'I ___ (not understand/am not understanding) this error message.', answer: 'don\'t understand' },
            { id: 4, question: 'The team ___ (migrate/is migrating) to microservices this quarter.', answer: 'is migrating' },
            { id: 5, question: 'He ___ (review/is reviewing) pull requests every morning.', answer: 'reviews' },
            { id: 6, question: 'Look! The server ___ (crash/is crashing)!', answer: 'is crashing' },
            { id: 7, question: 'We never ___ (push/are pushing) to main without a review.', answer: 'push' },
            { id: 8, question: 'I ___ (currently fix/am currently fixing) a critical security vulnerability.', answer: 'am currently fixing' }
          ]
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Исправление ошибок',
      type: 'practice',
            description: 'Найдите и исправьте ошибки в предложениях.',
      solution: 'Правильные ответы:\\n1. She knows the answer to this bug.\\n2. I work on the backend every day.\\n3. The function does not return the correct value.\\n4. We deploy the app every Friday.\\n5. Is the build finished? / Has the build finished?\\n6. He is working from home at the moment.',
content: [
        { type: 'text', value: 'Найдите и исправьте ошибки в предложениях.' },
        {
          type: 'exercise',
          subtype: 'error_correction',
          items: [
            { id: 1, question: 'She is knowing the answer to this bug.', answer: 'She knows the answer to this bug.' },
            { id: 2, question: 'I am working on backend every day.', answer: 'I work on the backend every day.' },
            { id: 3, question: 'The function not return the correct value.', answer: 'The function does not return the correct value.' },
            { id: 4, question: 'We are deploy the app every Friday.', answer: 'We deploy the app every Friday.' },
            { id: 5, question: 'Is the build finish?', answer: 'Is the build finished? / Has the build finished?' },
            { id: 6, question: 'He work from home at the moment.', answer: 'He is working from home at the moment.' }
          ]
        }
      ]
    }
  ]
}
