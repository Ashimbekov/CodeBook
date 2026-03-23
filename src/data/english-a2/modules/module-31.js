export default {
  id: 31,
  title: 'Practice: Phrasal Verbs',
  description: 'Практикум по фразовым глаголам в IT-контексте: полный тест с переводами и упражнениями.',
  lessons: [
    {
      id: 1,
      title: 'Set up, Log in/out — тест',
      type: 'practice',
      content: [
        { type: 'text', value: 'Вставьте правильный фразовый глагол.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'Can you help me ___ the Docker environment?', answer: 'set up' },
            { id: 2, question: 'I can\'t ___ to the system — my account is locked.', answer: 'log in' },
            { id: 3, question: 'Always ___ after using a shared computer.', answer: 'log out' },
            { id: 4, question: 'We need to ___ the CI/CD pipeline for the new project.', answer: 'set up' },
            { id: 5, question: 'She ___ of the system before leaving.', answer: 'logged out' },
            { id: 6, question: 'The ___ page is not loading correctly.', answer: 'login' },
            { id: 7, question: 'The setup ___ takes about 30 minutes.', answer: 'process' },
            { id: 8, question: 'Users are ___ automatically after 30 minutes of inactivity.', answer: 'logged out' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Roll back, Break down — тест',
      type: 'practice',
      content: [
        { type: 'text', value: 'Переведите на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Деплой сломал продакшн. Нам нужно откатиться.', answer: 'The deployment broke production. We need to roll back.' },
            { id: 2, question: 'Я откатился к версии 2.1 из-за бага.', answer: 'I rolled back to version 2.1 because of the bug.' },
            { id: 3, question: 'Давайте разобьём эту задачу на более мелкие части.', answer: 'Let\'s break down this task into smaller parts.' },
            { id: 4, question: 'Сервер сломался во время пиковой нагрузки.', answer: 'The server broke down during peak hours.' },
            { id: 5, question: 'Откат прошёл успешно.', answer: 'The rollback was successful.' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Look up, Figure out, Find out — тест',
      type: 'practice',
      content: [
        { type: 'text', value: 'Вставьте: look up, figure out, find out.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'Let me ___ this error code in the documentation.', answer: 'look up' },
            { id: 2, question: 'I\'m trying to ___ why the build keeps failing.', answer: 'figure out' },
            { id: 3, question: 'Did you ___ when the feature will be ready?', answer: 'find out' },
            { id: 4, question: 'I can\'t ___ this complex algorithm.', answer: 'figure out' },
            { id: 5, question: 'You can ___ any function in the API reference.', answer: 'look up' },
            { id: 6, question: 'Let\'s ___ the root cause of the issue.', answer: 'find out / figure out' },
            { id: 7, question: 'I ___ the problem — it was a misconfiguration.', answer: 'figured out' }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Turn on/off, Shut down, Spin up — тест',
      type: 'practice',
      content: [
        { type: 'text', value: 'Переведите на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Включи режим отладки.', answer: 'Turn on debug mode.' },
            { id: 2, question: 'Выключи feature flag перед деплоем.', answer: 'Turn off the feature flag before deploying.' },
            { id: 3, question: 'Выключи все процессы перед обслуживанием.', answer: 'Shut down all processes before maintenance.' },
            { id: 4, question: 'Запусти новый контейнер для тестирования.', answer: 'Spin up a new container for testing.' },
            { id: 5, question: 'Серверу нужно 2 минуты для загрузки.', answer: 'The server takes 2 minutes to start up / boot up.' }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Run into, Scale up/down — тест',
      type: 'practice',
      content: [
        { type: 'text', value: 'Вставьте правильный фразовый глагол.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'I ___ a strange error while testing.', answer: 'ran into' },
            { id: 2, question: 'We ___ the service during peak hours.', answer: 'scale up' },
            { id: 3, question: '___ the number of containers when traffic drops.', answer: 'Scale down' },
            { id: 4, question: 'They ___ network issues during deployment.', answer: 'ran into' },
            { id: 5, question: 'We need to ___ after adding 10 new servers.', answer: 'clean up (unused resources)' }
          ]
        }
      ]
    },
    {
      id: 6,
      title: 'Sign up, Plug in, Write up — тест',
      type: 'practice',
      content: [
        { type: 'text', value: 'Переведите на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Зарегистрируйся для бесплатного аккаунта.', answer: 'Sign up for a free account.' },
            { id: 2, question: 'Напиши отчёт об инциденте.', answer: 'Write up the incident report.' },
            { id: 3, question: 'Устройство не подключено к сети.', answer: 'The device is not plugged in.' },
            { id: 4, question: 'Подключи сервис к очереди сообщений.', answer: 'Hook up the service to the message queue.' },
            { id: 5, question: 'Зарегистрируйся на конференцию до пятницы.', answer: 'Sign up for the conference before Friday.' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Mixed Phrasal Verbs — перевод',
      type: 'practice',
      content: [
        { type: 'text', value: 'Переведите предложения с фразовыми глаголами.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Настройка новой среды разработки заняла 2 часа.', answer: 'Setting up the new development environment took 2 hours.' },
            { id: 2, question: 'Мы столкнулись с проблемами сети во время деплоя.', answer: 'We ran into network issues during deployment.' },
            { id: 3, question: 'Я не могу разобраться почему этот тест падает.', answer: 'I can\'t figure out why this test is failing.' },
            { id: 4, question: 'Масштабируй сервис вниз после спада трафика.', answer: 'Scale down the service after the traffic drops.' },
            { id: 5, question: 'Если основное API не работает, используй запасной вариант.', answer: 'If the primary API is down, fall back to the backup.' }
          ]
        }
      ]
    },
    {
      id: 8,
      title: 'Фразовые глаголы в контексте — рассказ',
      type: 'practice',
      content: [
        { type: 'text', value: 'Вставьте правильные фразовые глаголы в текст.\n\n"Yesterday we had a major incident. First, the server ___ (1) due to high traffic. We ___ (2) into the admin panel to investigate. We ___ (3) that the database was running out of memory. We tried to ___ (4) the service — adding more RAM. But first, we had to ___ (5) the feature that was causing the memory spike. Then we ___ (6) additional containers to handle the load. After 2 hours, we ___ (7) a full incident report."' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: '(1) The server ___', answer: 'broke down' },
            { id: 2, question: '(2) We ___ into the admin panel', answer: 'logged in' },
            { id: 3, question: '(3) We ___ that the database...', answer: 'found out' },
            { id: 4, question: '(4) we tried to ___ the service', answer: 'scale up' },
            { id: 5, question: '(5) we had to ___ the feature', answer: 'turn off / disable' },
            { id: 6, question: '(6) we ___ additional containers', answer: 'spun up' },
            { id: 7, question: '(7) we ___ a full incident report', answer: 'wrote up' }
          ]
        }
      ]
    },
    {
      id: 9,
      title: 'Исправление ошибок — фразовые глаголы',
      type: 'practice',
      content: [
        { type: 'text', value: 'Найдите и исправьте ошибки с фразовыми глаголами.' },
        {
          type: 'exercise',
          subtype: 'error_correction',
          items: [
            { id: 1, question: 'I need to set the development environment up right now.', answer: 'I need to set up the development environment right now. (OK также: set it up)' },
            { id: 2, question: 'We logged out from the system.', answer: 'We logged out of the system.' },
            { id: 3, question: 'Let\'s figure the bug out.', answer: 'Let\'s figure out the bug. (OK также: figure it out)' },
            { id: 4, question: 'The server broke up during maintenance.', answer: 'The server broke down during maintenance.' },
            { id: 5, question: 'Can you lookup this error in the docs?', answer: 'Can you look up this error in the docs? (два слова)' }
          ]
        }
      ]
    },
    {
      id: 10,
      title: 'Написание с фразовыми глаголами',
      type: 'practice',
      content: [
        { type: 'text', value: 'Напишите предложения, используя данные фразовые глаголы.' },
        {
          type: 'exercise',
          subtype: 'writing',
          items: [
            { id: 1, question: 'Используйте set up, log in, figure out в одном коротком рассказе (3 предложения) об инциденте.', answer: 'Пример: I logged in to the server at 2 AM when the alert triggered. I needed to figure out why the service was down. After checking the logs, I set up a new container to restore the service.' },
            { id: 2, question: 'Опишите процесс деплоя, используя: spin up, roll back, break down, scale up.', answer: 'Пример: We spun up a new container for testing. After deployment, the service broke down due to a memory issue. We had to roll back to the previous version. Later, we scaled up the infrastructure to prevent the issue.' }
          ]
        }
      ]
    }
  ]
}
