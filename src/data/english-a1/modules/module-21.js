export default {
  id: 21,
  title: 'Чтение: простые IT-тексты',
  description: 'Как читать и понимать простые англоязычные IT-тексты',
  lessons: [
    {
      id: 1,
      title: 'Стратегии чтения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Чтение технических текстов на английском требует особого подхода. Не нужно понимать каждое слово — важно понять общий смысл и ключевую информацию.' },
        { type: 'code', language: 'text', value: 'Три стратегии чтения:\n1. Skimming (скимминг) — быстрое чтение для общего понимания\n   - Читайте заголовки и первые предложения\n   - Смотрите на структуру текста\n   - Цель: понять тему\n\n2. Scanning (сканирование) — поиск конкретной информации\n   - Ищете конкретное слово или факт\n   - Не читаете весь текст\n   - Цель: найти нужную информацию\n\n3. Intensive reading (детальное чтение)\n   - Читаете внимательно, понимаете каждую часть\n   - Используете словарь\n   - Цель: полное понимание' },
        { type: 'tip', value: 'Для чтения документации: сначала skim (понять структуру), потом scan (найти нужное), потом read внимательно только нужную часть.' }
      ]
    },
    {
      id: 2,
      title: 'Чтение описания проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Прочитайте типичное описание IT-проекта и разберём каждую часть.' },
        { type: 'code', language: 'text', value: 'Пример текста:\n"TaskTracker is a simple web application for\nteam task management. It allows users to\ncreate, assign, and track tasks in real time.\nThe app is built with React and Node.js.\nIt supports multiple users and roles."\n\nПеревод:\nTaskTracker — это простое веб-приложение\nдля управления задачами команды. Оно позволяет\nпользователям создавать, назначать и отслеживать\nзадачи в реальном времени. Приложение создано\nна React и Node.js. Оно поддерживает\nнескольких пользователей и роли.' },
        { type: 'code', language: 'text', value: 'Ключевые слова в описании проекта:\nallows         - позволяет\nsupports       - поддерживает\nbuilt with     - создан с помощью\ndesigned for   - разработан для\nprovides       - предоставляет\nenables        - включает / позволяет\nmanages        - управляет\nintegrates     - интегрируется\nuses           - использует' }
      ]
    },
    {
      id: 3,
      title: 'Чтение сообщений об ошибках',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сообщения об ошибках (error messages) — один из главных текстов для программиста. Нужно научиться быстро понимать их структуру.' },
        { type: 'code', language: 'text', value: 'Типичные сообщения об ошибках:\nTypeError: Cannot read property \'length\' of undefined\n→ Ошибка типа: не могу прочитать свойство \'length\' у undefined\n\nSyntaxError: Unexpected token \'}\' at line 42\n→ Синтаксическая ошибка: неожиданный токен \'}\' на строке 42\n\nReferenceError: variable is not defined\n→ Ошибка ссылки: переменная не определена\n\nError: Connection refused at port 5432\n→ Ошибка: соединение отклонено на порту 5432\n\nFailed to fetch: Network request failed\n→ Не удалось получить данные: сетевой запрос не удался' },
        { type: 'code', language: 'text', value: 'Слова в сообщениях об ошибках:\ncannot / can\'t  - не может\nunexpected      - неожиданный\nundefined       - неопределённый\nfailed          - не удалось\nrefused         - отклонено\ndenied          - отказано\ntimeout         - превышено время ожидания\nconnection      - соединение\nmissing         - отсутствует\nrequired        - обязательный\ninvalid         - неверный' }
      ]
    },
    {
      id: 4,
      title: 'Чтение технических требований',
      type: 'theory',
      content: [
        { type: 'text', value: 'Технические требования (requirements / specs) — важный тип текста для разработчика. Нужно понимать ключевые слова.' },
        { type: 'code', language: 'text', value: 'Пример требований:\n"The user registration form must:\n- Accept email and password\n- Validate email format\n- Require password minimum 8 characters\n- Send a confirmation email\n- Redirect to the dashboard after success"\n\nПеревод:\n"Форма регистрации пользователя должна:\n- Принимать email и пароль\n- Проверять формат email\n- Требовать минимум 8 символов в пароле\n- Отправлять письмо подтверждения\n- Перенаправлять на dashboard после успеха"' },
        { type: 'code', language: 'text', value: 'Слова-обязательства в requirements:\nmust           - должен (обязательно)\nshould         - должен (рекомендуется)\ncan / may      - может (опционально)\nshall          - должен (формальный)\nrequired       - обязательный\noptional       - опциональный\nmandatory      - обязательный\naccepted       - принятый\nvalid          - допустимый' }
      ]
    },
    {
      id: 5,
      title: 'Чтение документации библиотек',
      type: 'theory',
      content: [
        { type: 'text', value: 'Документация библиотек — главный источник информации для разработчика. Важно понимать структуру типичной документации.' },
        { type: 'code', language: 'text', value: 'Типичная структура документации:\nInstallation      - Установка\nGetting Started   - Начало работы\nConfiguration     - Конфигурация\nAPI Reference     - Справочник API\nExamples          - Примеры\nTroubleshooting   - Устранение проблем\nChangelog         - История изменений\nContributing      - Как внести вклад\nLicense           - Лицензия' },
        { type: 'code', language: 'text', value: 'Пример из документации:\n"Installation:\nTo install the package, run:\nnpm install express\n\nBasic Usage:\nCreate a file app.js and add:\nconst express = require(\'express\')\nconst app = express()\n\nThe server listens on port 3000 by default.\nYou can change this in the configuration."\n\nКлючевые слова:\nrun             - запустите\nadd             - добавьте\ncreate          - создайте\nby default      - по умолчанию\nyou can         - вы можете\nfor more info   - для получения подробной информации' }
      ]
    },
    {
      id: 6,
      title: 'Практика чтения: описание проекта',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: 'ChatBot Pro is an AI-powered customer support tool. It handles common questions automatically. The bot supports English and Spanish. It integrates with Slack and Telegram. The system processes up to 1000 messages per hour.',
          question: 'На каких языках работает бот?',
          solution: 'На английском и испанском (English and Spanish)',
          explanation: '"It supports English and Spanish." — поддерживает английский и испанский.'
        },
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: 'ChatBot Pro is an AI-powered customer support tool. It handles common questions automatically. The bot supports English and Spanish. It integrates with Slack and Telegram. The system processes up to 1000 messages per hour.',
          question: 'Сколько сообщений в час обрабатывает система?',
          solution: 'До 1000 сообщений в час',
          explanation: '"processes up to 1000 messages per hour" — обрабатывает до 1000 сообщений в час.'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика чтения: ошибки',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите сообщение об ошибке: "TypeError: Cannot read property \'id\' of null"',
          solution: 'Ошибка типа: Не могу прочитать свойство \'id\' у null',
          explanation: 'TypeError = ошибка типа, Cannot read = не могу прочитать, property = свойство, of null = у null.'
        },
        {
          type: 'task',
          taskType: 'multiple_choice',
          question: 'Что означает "Connection timeout"?',
          options: ['Превышено время ожидания подключения', 'Соединение отказано', 'Нет сети', 'Неверный адрес'],
          correct: 0,
          explanation: '"Connection timeout" = превышено время ожидания соединения. Сервер не ответил в установленный лимит времени.'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика чтения: требования',
      type: 'practice',
      content: [
        {
          type: 'task',
          taskType: 'read_and_answer',
          text: 'The login page must:\n- Accept username and password\n- Show an error for invalid credentials\n- Lock the account after 5 failed attempts\n- Redirect to the home page on success',
          question: 'Что происходит после 5 неудачных попыток?',
          solution: 'Аккаунт блокируется (the account is locked)',
          explanation: '"Lock the account after 5 failed attempts" — заблокировать аккаунт после 5 неудачных попыток.'
        },
        {
          type: 'task',
          taskType: 'translate',
          question: 'Переведите: "The password must be at least 8 characters long."',
          solution: 'Пароль должен быть не менее 8 символов.',
          explanation: 'must be = должен быть, at least = не менее / минимум, characters = символы, long = длиной.'
        }
      ]
    }
  ]
}
