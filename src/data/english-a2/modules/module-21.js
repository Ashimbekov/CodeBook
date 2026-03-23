export default {
  id: 21,
  title: 'Describing Problems and Solutions',
  description: 'Описание IT-проблем и решений: "The app crashes when...", "It doesn\'t work because..."',
  lessons: [
    {
      id: 1,
      title: 'Описание проблем: структура',
      type: 'theory',
      content: [
        { type: 'text', value: 'Базовые шаблоны для описания проблем:\n\nТип 1: "The [thing] [problem]"\nThe server is down. (Сервер недоступен.)\nThe API is not responding. (API не отвечает.)\nThe app is crashing. (Приложение падает.)\nThe build is failing. (Билд падает.)\nThe database is slow. (База данных работает медленно.)\n\nТип 2: "There is/are a [problem] with [component]"\nThere is a bug in the login module. (В модуле входа есть баг.)\nThere are connection issues with the database. (Есть проблемы с подключением к базе данных.)\nThere is a memory leak in this service. (В этом сервисе есть утечка памяти.)\n\nТип 3: "I am having trouble/difficulty with [thing]"\nI\'m having trouble deploying to production. (У меня проблемы с деплоем в продакшн.)\nWe\'re having difficulty reproducing the bug. (Нам сложно воспроизвести баг.)' }
      ]
    },
    {
      id: 2,
      title: 'When и After: триггеры проблем',
      type: 'theory',
      content: [
        { type: 'text', value: 'Описание когда происходит проблема:\n\nThe app crashes when [trigger]. (Приложение падает когда [триггер].)\nThe app crashes when the user logs in. (Приложение падает когда пользователь входит.)\nThe server crashes when traffic exceeds 1000 RPS. (Сервер падает когда трафик превышает 1000 запросов в секунду.)\nThe API returns an error when the request body is empty. (API возвращает ошибку когда тело запроса пустое.)\nThe page freezes when you scroll down. (Страница зависает при прокрутке вниз.)\n\nПосле определённых действий:\nThe error occurs after deployment. (Ошибка появляется после деплоя.)\nThe app crashes after running for 2 hours. (Приложение падает после работы в течение 2 часов.)\nThe issue appeared after the last update. (Проблема появилась после последнего обновления.)' }
      ]
    },
    {
      id: 3,
      title: 'Because и Due to: причины проблем',
      type: 'theory',
      content: [
        { type: 'text', value: 'Объяснение причин проблем:\n\nIt doesn\'t work because [reason]. (Это не работает потому что [причина].)\nThe app is slow because it makes too many database queries. (Приложение медленное, потому что делает слишком много запросов к БД.)\nThe build fails because of a syntax error in config.js. (Билд падает из-за синтаксической ошибки в config.js.)\nThe service is down because the server ran out of memory. (Сервис недоступен, потому что у сервера закончилась память.)\n\nDUE TO (из-за, вследствие) — более формально\nThe outage was due to a failed database migration. (Отключение было вызвано неудачной миграцией базы данных.)\nThe delay is due to unexpected complexity. (Задержка вызвана неожиданной сложностью.)\nThe bug is due to a race condition. (Баг вызван состоянием гонки.)\n\nCAUSED BY (вызвано)\nThe crash was caused by a null pointer exception. (Сбой был вызван исключением null pointer.)\nThe outage was caused by a misconfiguration. (Отключение было вызвано неверной конфигурацией.)' }
      ]
    },
    {
      id: 4,
      title: 'Предложение решений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Шаблоны для предложения решений:\n\nWe can fix this by [solution]. (Мы можем исправить это путём [решение].)\nWe can fix this by adding input validation. (Мы можем исправить это, добавив валидацию ввода.)\nWe can fix this by restarting the service. (Мы можем исправить это, перезапустив сервис.)\nWe can fix this by increasing the timeout. (Мы можем исправить это, увеличив таймаут.)\n\nOne solution is to [action]. (Одно из решений — [действие].)\nThe solution is to add caching. (Решение — добавить кэширование.)\nA possible fix is to update the library. (Возможное исправление — обновить библиотеку.)\n\nWe need to [action] to resolve this. (Нам нужно [действие], чтобы решить это.)\nWe need to scale the database to resolve this. (Нам нужно масштабировать БД, чтобы решить это.)' },
        { type: 'heading', value: 'Предложение альтернатив' },
        { type: 'text', value: 'We have two options: [option 1] or [option 2]. (У нас два варианта: [вариант 1] или [вариант 2].)\nWe could either fix the bug or roll back. (Мы могли бы либо исправить баг, либо откатиться.)\nAlternatively, we can use a workaround. (В качестве альтернативы, мы можем использовать временное решение.)\nI suggest we [action] instead of [action]. (Я предлагаю мы [действие] вместо [действия].)' }
      ]
    },
    {
      id: 5,
      title: 'Диалоги: обсуждение проблем',
      type: 'theory',
      content: [
        { type: 'text', value: 'Диалог 1: Отчёт об инциденте\n\nDev: We have a problem. The production server is down.\nManager: What happened?\nDev: The database crashed due to a disk space issue. It ran out of disk space at 3 AM.\nManager: How long has it been down?\nDev: About 30 minutes. I\'m working on it now.\nManager: What\'s the solution?\nDev: We can fix it by cleaning up old logs and expanding the disk. I\'m doing that now.\nManager: How long will it take?\nDev: About 20 more minutes.\n\nДиалог 2: Технический разговор\n\nAlice: The API is returning 500 errors. Do you know why?\nBob: Yes, it\'s because we updated the database schema but forgot to update the queries.\nAlice: How can we fix it?\nBob: We need to update the SQL queries in the UserService. It should take about an hour.\nAlice: OK. Can we roll back in the meantime?\nBob: Yes, we can. I\'ll do that now to restore service.' }
      ]
    },
    {
      id: 6,
      title: 'Словарный запас: IT-проблемы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Описание типов проблем:\noutage (отключение) — The service had a 2-hour outage.\ndowntime (время простоя) — We need to minimize downtime.\nlatency (задержка) — High latency is affecting the user experience.\nbottleneck (узкое место) — The database is the bottleneck.\ndegradation (деградация) — We\'re experiencing performance degradation.\nincident (инцидент) — We had a major incident last night.\nregression (регрессия) — The new update caused a regression.\nworkaround (временное решение) — Here\'s a workaround for now.\nroot cause (первопричина) — We found the root cause.\npostmortem (постмортем) — We\'ll do a postmortem tomorrow.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Описание проблем',
      type: 'practice',
      content: [
        { type: 'text', value: 'Переведите на английский язык.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Приложение падает когда пользователь загружает файл.', answer: 'The app crashes when the user uploads a file.' },
            { id: 2, question: 'Сервис недоступен из-за проблем с базой данных.', answer: 'The service is down due to database issues.' },
            { id: 3, question: 'Мы можем исправить это, добавив обработку ошибок.', answer: 'We can fix this by adding error handling.' },
            { id: 4, question: 'Проблема появилась после последнего обновления зависимостей.', answer: 'The issue appeared after the last dependency update.' },
            { id: 5, question: 'Первопричина — состояние гонки в коде.', answer: 'The root cause is a race condition in the code.' },
            { id: 6, question: 'Нам нужно либо исправить баг, либо откатить деплой.', answer: 'We need to either fix the bug or roll back the deployment.' },
            { id: 7, question: 'Высокая задержка влияет на опыт пользователей.', answer: 'High latency is affecting the user experience.' }
          ]
        }
      ]
    }
  ]
}
