export default {
  id: 11,
  title: 'Prepositions: in/on/at/by/with',
  description: 'Предлоги места, времени и способа в IT-контексте: работа с серверами, временные рамки, инструменты.',
  lessons: [
    {
      id: 1,
      title: 'Предлоги времени: in, on, at',
      type: 'theory',
      content: [
        { type: 'text', value: 'AT — точное время:\nat 9 AM, at midnight, at noon, at 3:30 PM\n\nThe standup is at 10 AM. (Стендап в 10 утра.)\nThe server crashed at midnight. (Сервер упал в полночь.)\nThe release is scheduled at 2 PM. (Релиз запланирован на 14:00.)\n\nON — дни:\non Monday, on Tuesday, on weekdays, on the weekend\non March 15, on my birthday\n\nWe deploy on Fridays. (Мы деплоим по пятницам.)\nThe sprint starts on Monday. (Спринт начинается в понедельник.)\nThe incident occurred on December 3rd. (Инцидент произошёл 3 декабря.)\n\nIN — более длинные периоды:\nin the morning, in the evening, in March, in 2023, in Q4\n\nWe released the app in 2023. (Мы выпустили приложение в 2023 году.)\nI will finish this in the evening. (Я закончу это вечером.)\nThe project will be completed in Q2. (Проект будет завершён во втором квартале.)' }
      ]
    },
    {
      id: 2,
      title: 'Предлоги места: in, on, at',
      type: 'theory',
      content: [
        { type: 'text', value: 'IN — внутри (пространство/область):\nin the database, in production, in staging, in the file, in the code, in the cloud\n\nThe data is in the database. (Данные в базе данных.)\nThe bug is in production. (Баг в продакшне.)\nThe error is in line 42. (Ошибка в строке 42.)\nThe app runs in the cloud. (Приложение работает в облаке.)\nThe variable is defined in the constructor. (Переменная определена в конструкторе.)\n\nON — на поверхности / платформе:\non the server, on the website, on GitHub, on the dashboard\n\nThe app is on the server. (Приложение на сервере.)\nThe project is on GitHub. (Проект на GitHub.)\nThe metrics are on the dashboard. (Метрики на дашборде.)\n\nAT — в конкретном месте/адресе:\nat the office, at localhost:3000, at the URL\n\nThe API is available at /api/v1. (API доступен по пути /api/v1.)\nThe app runs at localhost:8080. (Приложение запускается на localhost:8080.)' }
      ]
    },
    {
      id: 3,
      title: 'By: способ, агент, дедлайн',
      type: 'theory',
      content: [
        { type: 'text', value: 'BY используется для:\n1. Способа/метода выполнения\n2. Агента в пассивном залоге\n3. Дедлайна (к определённому времени)\n\nСпособ:\nThe bug was fixed by restarting the service. (Баг был исправлен перезапуском сервиса.)\nYou can authenticate by using an API key. (Вы можете аутентифицироваться, используя API ключ.)\nCommunicate by email or Slack. (Общайтесь по электронной почте или в Slack.)\n\nАгент в пассивном залоге:\nThe code was written by the backend team. (Код был написан командой backend.)\nThe bug was discovered by the QA engineer. (Баг был обнаружен инженером QA.)\n\nДедлайн (к определённому времени):\nFinish this by Friday. (Заверши это к пятнице.)\nThe PR must be reviewed by tomorrow. (PR должен быть проверен к завтрашнему дню.)\nWe need to deploy by midnight. (Нам нужно задеплоить к полуночи.)' }
      ]
    },
    {
      id: 4,
      title: 'With: вместе с, с помощью',
      type: 'theory',
      content: [
        { type: 'text', value: 'WITH используется для:\n1. Совместного использования инструментов\n2. Соединения/связи\n3. Описания характеристик\n\nИнструменты и технологии:\nWe build the app with React. (Мы создаём приложение с React.)\nShe works with Python and Django. (Она работает с Python и Django.)\nThe image was created with Docker. (Образ был создан с помощью Docker.)\nTest with Jest and Cypress. (Тестируй с Jest и Cypress.)\n\nПроблемы:\nThere is a problem with the database connection. (Есть проблема с подключением к базе данных.)\nWe have an issue with the authentication service. (У нас проблема с сервисом аутентификации.)\n\nСвязь:\nConnect with SSH. (Подключись через SSH.)\nIntegrate with third-party APIs. (Интегрируйся со сторонними API.)' },
        { type: 'heading', value: 'For: назначение и продолжительность' },
        { type: 'text', value: 'FOR — для чего-то / в течение какого времени\n\nНазначение:\nThis tool is used for monitoring. (Этот инструмент используется для мониторинга.)\nJest is a framework for testing. (Jest — это фреймворк для тестирования.)\nGit is a system for version control. (Git — это система контроля версий.)\n\nПродолжительность:\nI have worked here for 3 years. (Я работаю здесь 3 года.)\nThe deployment took for 30 minutes. (Деплой занял 30 минут.)\nWe have been using this framework for 2 years. (Мы используем этот фреймворк 2 года.)' }
      ]
    },
    {
      id: 5,
      title: 'Другие важные предлоги в IT',
      type: 'theory',
      content: [
        { type: 'text', value: 'FROM...TO — с...до (диапазон):\nMigrate from MySQL to PostgreSQL. (Мигрировать с MySQL на PostgreSQL.)\nSwitch from monolith to microservices. (Перейти с монолита на микросервисы.)\nUpdate from version 1.0 to 2.0. (Обновить с версии 1.0 до 2.0.)\n\nOF — принадлежность, часть:\nthe name of the variable (имя переменной)\nthe result of the function (результат функции)\npart of the system (часть системы)\na list of endpoints (список эндпоинтов)\n\nABOUT — о чём-то:\nWe talked about the new architecture. (Мы говорили о новой архитектуре.)\nThe docs explain more about the API. (Документация рассказывает больше об API.)\n\nUNDER — под / в состоянии:\nThe system is under maintenance. (Система находится на техническом обслуживании.)\nThe feature is under development. (Функция находится в разработке.)\nThe project is under review. (Проект находится на рассмотрении.)' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Выбор предлога',
      type: 'practice',
            description: 'Вставьте правильный предлог.',
      solution: 'Правильные ответы:\\n1. at / on\\n2. in / in\\n3. by\\n4. with\\n5. by\\n6. on / in\\n7. with / via / by using\\n8. under / for',
content: [
        { type: 'text', value: 'Вставьте правильный предлог.' },
        {
          type: 'exercise',
          subtype: 'fill_blank',
          items: [
            { id: 1, question: 'The standup meeting is ___ 9 AM ___ Monday.', answer: 'at / on' },
            { id: 2, question: 'The bug is ___ production — it was not found ___ staging.', answer: 'in / in' },
            { id: 3, question: 'Please finish the code review ___ tomorrow morning.', answer: 'by' },
            { id: 4, question: 'We build our API ___ Node.js and Express.', answer: 'with' },
            { id: 5, question: 'The code was written ___ the frontend team.', answer: 'by' },
            { id: 6, question: 'The app is deployed ___ AWS ___ the us-east-1 region.', answer: 'on / in' },
            { id: 7, question: 'Connect to the server ___ SSH.', answer: 'with / via / by using' },
            { id: 8, question: 'The project has been ___ development ___ three months.', answer: 'under / for' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Перевод',
      type: 'practice',
            description: 'Переведите предложения на английский язык.',
      solution: 'Правильные ответы:\\n1. The data is stored in the PostgreSQL database.\\n2. Please finish the task by Friday.\\n3. We migrated from REST API to GraphQL.\\n4. The app runs on port 8080.\\n5. This tool is used for performance monitoring.\\n6. The standup is held every morning at 10.',
content: [
        { type: 'text', value: 'Переведите предложения на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Данные хранятся в базе данных PostgreSQL.', answer: 'The data is stored in the PostgreSQL database.' },
            { id: 2, question: 'Пожалуйста, заверши задачу к пятнице.', answer: 'Please finish the task by Friday.' },
            { id: 3, question: 'Мы мигрировали с REST API на GraphQL.', answer: 'We migrated from REST API to GraphQL.' },
            { id: 4, question: 'Приложение работает на порту 8080.', answer: 'The app runs on port 8080.' },
            { id: 5, question: 'Этот инструмент используется для мониторинга производительности.', answer: 'This tool is used for performance monitoring.' },
            { id: 6, question: 'Стендап проводится каждое утро в 10.', answer: 'The standup is held every morning at 10.' }
          ]
        }
      ]
    }
  ]
}
