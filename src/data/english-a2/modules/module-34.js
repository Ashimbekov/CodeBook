export default {
  id: 34,
  title: 'Practice: Translating IT Texts',
  description: 'Практикум по переводу IT-текстов: с английского на русский и обратно, технические тексты.',
  lessons: [
    {
      id: 1,
      title: 'Перевод EN→RU: документация',
      type: 'practice',
            description: 'Переведите фрагменты документации с английского на русский.',
      solution: 'Правильные ответы:\\n1. Эта библиотека предоставляет простой интерфейс для выполнения HTTP-запросов. Она поддерживает async/await и автоматически обрабатывает JSON-сериализацию.\\n2. Аутентификация требуется для всех эндпоинтов, кроме /api/health. Включите Bearer-токен в заголовок Authorization.\\n3. Функция возвращает null, если запись не найдена. Всегда проверяйте на null перед доступом к свойствам, чтобы избежать NullPointerException.\\n4. Ограничение скорости включено по умолчанию. Каждый API-ключ ограничен 100 запросами в минуту.\\n5. Устарело: Этот метод будет удалён в версии 3.0. Используйте вместо него getUserById().',
content: [
        { type: 'text', value: 'Переведите фрагменты документации с английского на русский.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'This library provides a simple interface for making HTTP requests. It supports async/await and automatically handles JSON serialization.', answer: 'Эта библиотека предоставляет простой интерфейс для выполнения HTTP-запросов. Она поддерживает async/await и автоматически обрабатывает JSON-сериализацию.' },
            { id: 2, question: 'Authentication is required for all endpoints except /api/health. Include the Bearer token in the Authorization header.', answer: 'Аутентификация требуется для всех эндпоинтов, кроме /api/health. Включите Bearer-токен в заголовок Authorization.' },
            { id: 3, question: 'The function returns null if no record is found. Always check for null before accessing properties to avoid NullPointerException.', answer: 'Функция возвращает null, если запись не найдена. Всегда проверяйте на null перед доступом к свойствам, чтобы избежать NullPointerException.' },
            { id: 4, question: 'Rate limiting is enabled by default. Each API key is limited to 100 requests per minute.', answer: 'Ограничение скорости включено по умолчанию. Каждый API-ключ ограничен 100 запросами в минуту.' },
            { id: 5, question: 'Deprecated: This method will be removed in v3.0. Use getUserById() instead.', answer: 'Устарело: Этот метод будет удалён в версии 3.0. Используйте вместо него getUserById().' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Перевод EN→RU: баг-репорты',
      type: 'practice',
            description: 'Переведите баг-репорты с английского на русский.',
      solution: 'Правильные ответы:\\n1. Приложение падает когда пользователь пытается загрузить файл больше 10 МБ. Сообщение об ошибке говорит: "Размер файла превышает максимально допустимый предел."\\n2. Шаги для воспроизведения: 1. Войдите с аккаунтом администратора. 2. Перейдите в Управление пользователями. 3. Нажмите "Удалить пользователя". Ожидаемое: Диалог подтверждения. Фактическое: Страница перезагружается без удаления пользователя.\\n3. Эта проблема появилась в версии 2.3.0 и отсутствовала в 2.2.x. По всей видимости, она связана с новым middleware аутентификации.',
content: [
        { type: 'text', value: 'Переведите баг-репорты с английского на русский.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'The app crashes when a user tries to upload a file larger than 10MB. The error message says "File size exceeds the maximum allowed limit."', answer: 'Приложение падает когда пользователь пытается загрузить файл больше 10 МБ. Сообщение об ошибке говорит: "Размер файла превышает максимально допустимый предел."' },
            { id: 2, question: 'Steps to reproduce: 1. Log in with admin account. 2. Navigate to User Management. 3. Click "Delete User". Expected: Confirmation dialog. Actual: Page reloads without deleting the user.', answer: 'Шаги для воспроизведения: 1. Войдите с аккаунтом администратора. 2. Перейдите в Управление пользователями. 3. Нажмите "Удалить пользователя". Ожидаемое: Диалог подтверждения. Фактическое: Страница перезагружается без удаления пользователя.' },
            { id: 3, question: 'This issue was introduced in version 2.3.0 and was not present in 2.2.x. It appears to be related to the new authentication middleware.', answer: 'Эта проблема появилась в версии 2.3.0 и отсутствовала в 2.2.x. По всей видимости, она связана с новым middleware аутентификации.' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Перевод EN→RU: commit messages и PR',
      type: 'practice',
            description: 'Переведите commit messages и PR descriptions.',
      solution: 'Правильные ответы:\\n1. feat: реализована поддержка WebSocket для уведомлений в реальном времени\\n2. fix: исправлено состояние гонки при обработке платежей, вызывавшее дублирование списаний\\n3. Этот PR добавляет кэширование Redis для снижения нагрузки на базу данных. Время ответа улучшилось на 40%.\\n4. Критическое изменение: Функция getUserById() теперь возвращает Promise вместо callback.\\n5. chore: обновлены все зависимости для устранения уязвимостей безопасности',
content: [
        { type: 'text', value: 'Переведите commit messages и PR descriptions.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'feat: implement WebSocket support for real-time notifications', answer: 'feat: реализована поддержка WebSocket для уведомлений в реальном времени' },
            { id: 2, question: 'fix: resolve race condition in payment processing that caused duplicate charges', answer: 'fix: исправлено состояние гонки при обработке платежей, вызывавшее дублирование списаний' },
            { id: 3, question: 'This PR adds Redis caching to reduce database load. Response times improved by 40%.', answer: 'Этот PR добавляет кэширование Redis для снижения нагрузки на базу данных. Время ответа улучшилось на 40%.' },
            { id: 4, question: 'Breaking change: The getUserById() function now returns a Promise instead of a callback.', answer: 'Критическое изменение: Функция getUserById() теперь возвращает Promise вместо callback.' },
            { id: 5, question: 'chore: update all dependencies to address security vulnerabilities', answer: 'chore: обновлены все зависимости для устранения уязвимостей безопасности' }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Перевод RU→EN: технические описания',
      type: 'practice',
            description: 'Переведите технические описания с русского на английский.',
      solution: 'Правильные ответы:\\n1. The system authenticates users using JWT tokens. The token expires after 24 hours.\\n2. Microservices architecture allows each component to be scaled independently.\\n3. User data is encrypted using the AES-256 algorithm before being stored in the database.\\n4. The service handles up to 10,000 requests per second thanks to horizontal scaling.\\n5. If a request fails, the system automatically retries up to three times with exponential backoff.',
content: [
        { type: 'text', value: 'Переведите технические описания с русского на английский.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Система аутентифицирует пользователей с помощью JWT-токенов. Токен истекает через 24 часа.', answer: 'The system authenticates users using JWT tokens. The token expires after 24 hours.' },
            { id: 2, question: 'Микросервисная архитектура позволяет масштабировать каждый компонент независимо.', answer: 'Microservices architecture allows each component to be scaled independently.' },
            { id: 3, question: 'Данные пользователей шифруются с использованием алгоритма AES-256 перед сохранением в базу данных.', answer: 'User data is encrypted using the AES-256 algorithm before being stored in the database.' },
            { id: 4, question: 'Сервис обрабатывает до 10,000 запросов в секунду благодаря горизонтальному масштабированию.', answer: 'The service handles up to 10,000 requests per second thanks to horizontal scaling.' },
            { id: 5, question: 'Если запрос не удаётся, система автоматически повторяет попытку до трёх раз с экспоненциальной задержкой.', answer: 'If a request fails, the system automatically retries up to three times with exponential backoff.' }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Перевод RU→EN: описание архитектуры',
      type: 'practice',
            description: 'Переведите описание архитектуры системы.',
      solution: 'Правильные ответы:\\n1. The application consists of three layers: presentation, business logic, and data access.\\n2. The load balancer distributes requests between multiple instances of the service.\\n3. A message queue is used for asynchronous task processing.\\n4. The database is replicated across three nodes to ensure high availability.\\n5. Redis cache stores frequently requested data to reduce the database load.',
content: [
        { type: 'text', value: 'Переведите описание архитектуры системы.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Приложение состоит из трёх уровней: презентационного, бизнес-логики и доступа к данным.', answer: 'The application consists of three layers: presentation, business logic, and data access.' },
            { id: 2, question: 'Балансировщик нагрузки распределяет запросы между несколькими экземплярами сервиса.', answer: 'The load balancer distributes requests between multiple instances of the service.' },
            { id: 3, question: 'Очередь сообщений используется для асинхронной обработки задач.', answer: 'A message queue is used for asynchronous task processing.' },
            { id: 4, question: 'База данных реплицируется на трёх узлах для обеспечения высокой доступности.', answer: 'The database is replicated across three nodes to ensure high availability.' },
            { id: 5, question: 'Кэш Redis хранит часто запрашиваемые данные для снижения нагрузки на базу.', answer: 'Redis cache stores frequently requested data to reduce the database load.' }
          ]
        }
      ]
    },
    {
      id: 6,
      title: 'Перевод Stack Overflow ответов',
      type: 'practice',
            description: 'Переведите ключевые части ответов Stack Overflow.',
      solution: 'Правильные ответы:\\n1. Причина этого в том, что JavaScript однопоточный. Асинхронные операции выполняются в цикле событий.\\n2. Лучший подход — использовать переменные окружения вместо жёсткого кодирования API-ключа.\\n3. Убедитесь, что вы обрабатываете случай, когда ответ пустой или JSON некорректный.\\n4. Обратите внимание, что этот метод устарел в Python 3.10 и будет удалён в 3.12.\\n5. Имейте в виду, что это работает только если у вас установлен Node.js версии 16 или выше.',
content: [
        { type: 'text', value: 'Переведите ключевые части ответов Stack Overflow.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'The reason this happens is that JavaScript is single-threaded. Async operations are executed in the event loop.', answer: 'Причина этого в том, что JavaScript однопоточный. Асинхронные операции выполняются в цикле событий.' },
            { id: 2, question: 'A better approach would be to use environment variables instead of hardcoding the API key.', answer: 'Лучший подход — использовать переменные окружения вместо жёсткого кодирования API-ключа.' },
            { id: 3, question: 'Make sure you handle the case where the response is empty or the JSON is malformed.', answer: 'Убедитесь, что вы обрабатываете случай, когда ответ пустой или JSON некорректный.' },
            { id: 4, question: 'Note that this method is deprecated in Python 3.10 and will be removed in 3.12.', answer: 'Обратите внимание, что этот метод устарел в Python 3.10 и будет удалён в 3.12.' },
            { id: 5, question: 'Keep in mind that this will only work if you have Node.js version 16 or higher installed.', answer: 'Имейте в виду, что это работает только если у вас установлен Node.js версии 16 или выше.' }
          ]
        }
      ]
    },
    {
      id: 7,
      title: 'Перевод технических терминов',
      type: 'practice',
            description: 'Переведите термины и их определения с английского.',
      solution: 'Правильные ответы:\\n1. Идемпотентность: Операция является идемпотентной, если её многократное выполнение даёт тот же результат, что и однократное.\\n2. Технический долг: Код, который работает, но написан плохо и будет дорогостоящим для поддержки или изменения в будущем.\\n3. Состояние гонки: Баг, возникающий когда два процесса пытаются получить доступ к одному ресурсу одновременно, и результат зависит от того, который завершится первым.',
content: [
        { type: 'text', value: 'Переведите термины и их определения с английского.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Idempotency: An operation is idempotent if performing it multiple times produces the same result as performing it once.', answer: 'Идемпотентность: Операция является идемпотентной, если её многократное выполнение даёт тот же результат, что и однократное.' },
            { id: 2, question: 'Technical debt: Code that works but is poorly written and will be costly to maintain or change in the future.', answer: 'Технический долг: Код, который работает, но написан плохо и будет дорогостоящим для поддержки или изменения в будущем.' },
            { id: 3, question: 'Race condition: A bug that occurs when two processes try to access the same resource simultaneously, and the outcome depends on which one finishes first.', answer: 'Состояние гонки: Баг, возникающий когда два процесса пытаются получить доступ к одному ресурсу одновременно, и результат зависит от того, который завершится первым.' }
          ]
        }
      ]
    },
    {
      id: 8,
      title: 'Перевод error messages',
      type: 'practice',
            description: 'Переведите сообщения об ошибках и объясните их.',
      solution: 'Правильные ответы:\\n1. Ошибка типа: Невозможно установить свойство \'name\' для null. Объект равен null.\\n2. 404 Не найдено: Запрошенный ресурс не существует.\\n3. Ошибка CORS: Межсайтовый запрос заблокирован. Сервер не разрешает запросы с этого источника.\\n4. Таймаут подключения к базе данных: Не удалось подключиться к базе данных после 30000 мс (30 секунд).',
content: [
        { type: 'text', value: 'Переведите сообщения об ошибках и объясните их.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: '"TypeError: Cannot set property \'name\' of null"', answer: 'Ошибка типа: Невозможно установить свойство \'name\' для null. Объект равен null.' },
            { id: 2, question: '"404 Not Found: The requested resource does not exist."', answer: '404 Не найдено: Запрошенный ресурс не существует.' },
            { id: 3, question: '"CORS Error: Cross-origin request blocked. The server does not allow requests from this origin."', answer: 'Ошибка CORS: Межсайтовый запрос заблокирован. Сервер не разрешает запросы с этого источника.' },
            { id: 4, question: '"Database connection timeout: Unable to connect to database after 30000ms"', answer: 'Таймаут подключения к базе данных: Не удалось подключиться к базе данных после 30000 мс (30 секунд).' }
          ]
        }
      ]
    },
    {
      id: 9,
      title: 'Перевод технической статьи',
      type: 'practice',
            description: 'Переведите фрагмент технической статьи на русский.',
      solution: 'Правильные ответы:\\n1. Docker-контейнеры используют общее ядро операционной системы хоста, что делает их значительно легче виртуальных машин. Контейнер обычно запускается за миллисекунды, тогда как ВМ может загружаться несколько минут.\\n2. Непрерывная интеграция означает автоматическую сборку и тестирование кода каждый раз, когда разработчик вносит изменения. Это помогает обнаруживать баги на ранних этапах и гарантирует, что основная ветка всегда готова к деплою.',
content: [
        { type: 'text', value: 'Переведите фрагмент технической статьи на русский.' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: '"Docker containers share the host operating system kernel, making them much lighter than virtual machines. A container typically starts in milliseconds, while a VM can take minutes to boot."', answer: 'Docker-контейнеры используют общее ядро операционной системы хоста, что делает их значительно легче виртуальных машин. Контейнер обычно запускается за миллисекунды, тогда как ВМ может загружаться несколько минут.' },
            { id: 2, question: '"Continuous Integration means automatically building and testing code every time a developer commits changes. This helps catch bugs early and ensures the main branch is always deployable."', answer: 'Непрерывная интеграция означает автоматическую сборку и тестирование кода каждый раз, когда разработчик вносит изменения. Это помогает обнаруживать баги на ранних этапах и гарантирует, что основная ветка всегда готова к деплою.' }
          ]
        }
      ]
    },
    {
      id: 10,
      title: 'Полный перевод IT-текста',
      type: 'practice',
            description: 'Переведите полный технический текст.',
      solution: 'Правильные ответы:\\n1. Наша команда недавно перешла с монолитной архитектуры на микросервисы. Миграция заняла 6 месяцев и включала разделение нашего приложения на 8 отдельных сервисов: аутентификация, пользователи, продукты, заказы, платежи, уведомления, поиск и аналитика.\\n\\nГлавное преимущество в том, что теперь каждый сервис можно деплоить и масштабировать независимо. До миграции деплой любого изменения требовал остановки всего приложения. Теперь мы можем деплоить отдельные сервисы без простоя.\\n\\nОднако микросервисы принесли новые трудности. Нам пришлось реализовать обнаружение сервисов, распределённую трассировку и управлять несколькими базами данных. Операционная сложность значительно возросла.\\n\\nПорекомендовали бы мы это? Да, но только если ваша команда готова к дополнительной сложности.',
content: [
        { type: 'text', value: 'Переведите полный технический текст.\n\n"Our team recently migrated from a monolithic architecture to microservices. The migration took 6 months and involved splitting our application into 8 separate services: authentication, users, products, orders, payments, notifications, search, and analytics.\n\nThe main benefit is that each service can now be deployed and scaled independently. Before the migration, deploying any change required taking down the entire application. Now, we can deploy individual services with zero downtime.\n\nHowever, microservices introduced new challenges. We needed to implement service discovery, distributed tracing, and manage multiple databases. The operational complexity increased significantly.\n\nWould we recommend it? Yes, but only if your team is ready for the additional complexity."' },
        {
          type: 'exercise',
          subtype: 'translation',
          items: [
            { id: 1, question: 'Переведите весь текст на русский язык.', answer: 'Наша команда недавно перешла с монолитной архитектуры на микросервисы. Миграция заняла 6 месяцев и включала разделение нашего приложения на 8 отдельных сервисов: аутентификация, пользователи, продукты, заказы, платежи, уведомления, поиск и аналитика.\n\nГлавное преимущество в том, что теперь каждый сервис можно деплоить и масштабировать независимо. До миграции деплой любого изменения требовал остановки всего приложения. Теперь мы можем деплоить отдельные сервисы без простоя.\n\nОднако микросервисы принесли новые трудности. Нам пришлось реализовать обнаружение сервисов, распределённую трассировку и управлять несколькими базами данных. Операционная сложность значительно возросла.\n\nПорекомендовали бы мы это? Да, но только если ваша команда готова к дополнительной сложности.' }
          ]
        }
      ]
    }
  ]
}
