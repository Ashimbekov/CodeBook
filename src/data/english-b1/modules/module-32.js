export default {
  id: 32,
  title: 'Practice: Reading Technical Documentation',
  description: 'Практические упражнения на чтение технической документации. Реальные тексты из API-документации, README и технических гайдов.',
  lessons: [
    {
      id: 1,
      title: 'Reading: HTTP status codes reference',
      type: 'practice',
      description: 'Прочитай справочник HTTP-кодов и ответь на вопросы.',
      solution: 'Правильные ответы:\n1. 201 Created — запрос выполнен и создан новый ресурс.\n2. 429 Too Many Requests.\n3. 401 — нет аутентификации; 403 — аутентификация прошла, но нет прав.\n4. 304 — для кэширования: ресурс не изменился.\n5. 503 — сервер перегружен или на техобслуживании.',
      text: 'HTTP Response Status Codes\n\nHTTP response status codes indicate whether a specific HTTP request has been successfully completed. Responses are grouped in five classes:\n\n1xx Informational: The request was received, continuing process.\n2xx Successful: The request was successfully received, understood, and accepted.\n  - 200 OK: Standard response for successful HTTP requests.\n  - 201 Created: The request has been fulfilled, resulting in the creation of a new resource.\n  - 204 No Content: The server successfully processed the request, but is not returning any content.\n3xx Redirection: Further action must be taken to complete the request.\n  - 301 Moved Permanently: The URL has been permanently moved.\n  - 304 Not Modified: The resource has not been modified since the last request (used for caching).\n4xx Client errors: The request contains bad syntax or cannot be fulfilled.\n  - 400 Bad Request: The server cannot process the request due to client error.\n  - 401 Unauthorized: Authentication is required.\n  - 403 Forbidden: The client does not have permission.\n  - 404 Not Found: The requested resource could not be found.\n  - 409 Conflict: The request conflicts with the current state of the resource.\n  - 429 Too Many Requests: Rate limit exceeded.\n5xx Server errors: The server failed to fulfill a valid request.\n  - 500 Internal Server Error: A generic server error.\n  - 503 Service Unavailable: The server is not ready to handle the request (overloaded or down for maintenance).',
      tasks: [
        { question: 'Что означает 201 Created?', answer: 'Запрос выполнен и в результате был создан новый ресурс.' },
        { question: 'Какой код возвращается при превышении rate limit?', answer: '429 Too Many Requests.' },
        { question: 'Чем отличается 401 от 403?', answer: '401 — не прошла аутентификация (нет токена или неверный). 403 — аутентификация прошла, но нет прав доступа.' },
        { question: 'Для чего используется 304 Not Modified?', answer: 'Для кэширования: ресурс не изменился с последнего запроса, клиент может использовать кэшированную версию.' },
        { question: 'Когда сервер вернёт 503?', answer: 'Когда сервер перегружен или находится на техническом обслуживании.' }
      ]
    },
    {
      id: 2,
      title: 'Reading: npm package documentation',
      type: 'practice',
      description: 'Прочитай документацию npm-пакета dotenv и ответь на вопросы.',
      solution: 'Правильные ответы:\n1. npm install dotenv\n2. Модуль без внешних зависимостей.\n3. В .env хранятся чувствительные данные — пароли, ключи API.\n4. override: true — переменные из .env перезапишут уже установленные.\n5. Нет, strongly recommend against иметь несколько .env файлов.',
      text: 'dotenv\n\nA zero-dependency module that loads environment variables from a .env file into process.env.\n\nInstall\nnpm install dotenv\n\nUsage\nAs early as possible in your application, require and configure dotenv:\nrequire(\'dotenv\').config()\n\nCreate a .env file in the root of your project:\nDB_HOST=localhost\nDB_USER=root\nDB_PASS=s1mpl3\n\nWarning: Never commit your .env file to version control. Add it to your .gitignore.\n\nOptions:\npath - Path to your .env file. Default: path.resolve(process.cwd(), \'.env\')\nencoding - Encoding of your .env file. Default: utf8\noverride - Override any environment variables that have already been set. Default: false\ndebug - Turn on logging to help debug why certain keys or values are not being set. Default: false\n\nFAQ:\nShould I have multiple .env files? - We strongly recommend against having a "main" .env file and an "environment" .env file like .env.test. Your config should vary between environments, and you should not be sharing values between environments.',
      tasks: [
        { question: 'Как установить dotenv?', answer: 'npm install dotenv' },
        { question: 'Что означает "zero-dependency module"?', answer: 'Модуль без внешних зависимостей — он работает самостоятельно, без установки дополнительных пакетов.' },
        { question: 'Почему нельзя коммитить .env в git?', answer: 'В .env хранятся чувствительные данные (пароли, ключи API). Коммит в публичный репозиторий раскроет их.' },
        { question: 'Что делает опция override?', answer: 'Если override: true — переменные из .env перезапишут уже установленные переменные окружения. По умолчанию false (не перезаписывает).' },
        { question: 'Рекомендует ли документация иметь несколько .env файлов?', answer: 'Нет, strongly recommend against — настоятельно не рекомендует.' }
      ]
    },
    {
      id: 3,
      title: 'Reading: Git documentation excerpt',
      type: 'practice',
      description: 'Прочитай документацию git rebase и ответь на вопросы.',
      solution: 'Правильные ответы:\n1. git rebase переносит коммиты поверх другой базовой ветки.\n2. Переписывает историю — может вызвать проблемы у других разработчиков.\n3. Использовать git merge для общих веток.\n4. Rebase прерывается, если upstream не настроен.',
      text: 'git rebase\n\nReapply commits on top of another base tip.\n\nSynopsis\ngit rebase [-i | --interactive] [--onto <newbase>] [<upstream>] [<branch>]\n\nDescription\nIf <branch> is specified, git rebase will perform an automatic git switch <branch> before doing anything else. Otherwise it remains on the current branch.\n\nIf <upstream> is not specified, the upstream configured in branch.<name>.remote and branch.<name>.merge options will be used; if the current branch does not have an upstream defined, the rebase will abort.\n\nAll changes made by commits in the current branch but that are not in <upstream> are saved to a temporary area. This is the same set of commits that would be shown by git log <upstream>..HEAD.\n\nWARNING: Using git rebase on commits already pushed to a shared repository can cause problems for other contributors. It rewrites commit history, which can cause confusion and merge conflicts. Always prefer git merge for shared branches.',
      tasks: [
        { question: 'Что делает git rebase?', answer: 'Переносит (переприменяет) коммиты поверх другой базовой ветки.' },
        { question: 'О какой опасности предупреждает документация?', answer: 'Использование git rebase на коммитах, уже запушенных в общий репозиторий, переписывает историю и может вызвать проблемы у других разработчиков.' },
        { question: 'Что рекомендует документация для общих веток?', answer: 'Использовать git merge вместо git rebase для общих (shared) веток.' },
        { question: 'Что происходит, если не указать upstream?', answer: 'Rebase прерывается (will abort), если upstream не настроен для текущей ветки.' }
      ]
    },
    {
      id: 4,
      title: 'Reading: Docker documentation',
      type: 'practice',
      description: 'Прочитай документацию Docker (ENTRYPOINT vs CMD) и ответь на вопросы.',
      solution: 'Правильные ответы:\n1. CMD — легко переопределить; ENTRYPOINT — исполняемый файл, сложнее переопределить.\n2. Сработает только последняя инструкция CMD.\n3. ENTRYPOINT = исполняемый файл, CMD = аргументы по умолчанию.\n4. Когда контейнер должен всегда запускать одну команду.',
      text: 'ENTRYPOINT vs CMD in Dockerfile\n\nBoth ENTRYPOINT and CMD define what should be executed when running a container. There are some subtle differences:\n\nCMD\n- Provides defaults for an executing container\n- If multiple CMD instructions are written, only the last one takes effect\n- CMD can be easily overridden when running the container: docker run myimage /bin/bash\n\nENTRYPOINT\n- Configures the container to run as an executable\n- Cannot be overridden using standard docker run command (only with --entrypoint flag)\n- Best for containers designed to run a specific command\n\nWhen to use what:\nUse ENTRYPOINT when you have a container that should always run the same command.\nUse CMD when you want to provide a default that can be easily changed.\nYou can also combine them: ENTRYPOINT sets the executable, CMD provides default arguments.\n\nExample:\nENTRYPOINT ["node"]\nCMD ["server.js"]\n\nThis will run "node server.js" by default, but you can override the script: docker run myimage app.js',
      tasks: [
        { question: 'Чем CMD отличается от ENTRYPOINT?', answer: 'CMD задаёт дефолтную команду, которую легко переопределить. ENTRYPOINT задаёт исполняемый файл контейнера, который сложнее переопределить (только через --entrypoint).' },
        { question: 'Что произойдёт, если написать несколько CMD в Dockerfile?', answer: 'Сработает только последняя инструкция CMD.' },
        { question: 'Как можно комбинировать ENTRYPOINT и CMD?', answer: 'ENTRYPOINT задаёт исполняемый файл (например, node), CMD задаёт аргументы по умолчанию (например, server.js). Можно переопределить аргументы, не меняя исполняемый файл.' },
        { question: 'Когда стоит использовать ENTRYPOINT?', answer: 'Когда контейнер должен всегда запускать одну и ту же команду — например, контейнер, предназначенный только для запуска определённого приложения.' }
      ]
    },
    {
      id: 5,
      title: 'Reading: REST API design guide excerpt',
      type: 'practice',
      description: 'Прочитай гайд по REST API design и ответь на вопросы.',
      solution: 'Ключевые принципы REST API:\n- Версионирование: /api/v1/users\n- Существительные для endpoint: /users (не /getUsers)\n- Множественное число: /users (не /user)\n- GET — idempotent; POST — не idempotent; PUT — idempotent; DELETE — idempotent\n- Консистентный формат ошибок с code, message, field',
      text: 'REST API Design Best Practices\n\nVersioning\nAlways version your API. This allows you to evolve the API without breaking existing clients. Common approaches:\n- URI versioning: /api/v1/users (most common, highly visible)\n- Header versioning: Accept: application/vnd.myapi.v1+json (cleaner URLs, less discoverable)\n\nResource Naming\nUse nouns, not verbs, for endpoints:\n- Good: GET /users, POST /users, GET /users/{id}\n- Bad: GET /getUsers, POST /createUser\n\nUse plural nouns: /users not /user\n\nHTTP Methods\n- GET: Retrieve a resource (safe, idempotent)\n- POST: Create a resource (not idempotent)\n- PUT: Replace a resource completely (idempotent)\n- PATCH: Partially update a resource\n- DELETE: Remove a resource (idempotent)\n\nError Responses\nAlways return a consistent error format:\n{\n  "error": {\n    "code": "VALIDATION_ERROR",\n    "message": "The email field is required.",\n    "field": "email"\n  }\n}',
      tasks: [
        { question: 'Какие два подхода к версионированию API описываются?', answer: 'URI versioning (/api/v1/users) и Header versioning (через заголовок Accept).' },
        { question: 'Почему рекомендуется использовать существительные в эндпоинтах?', answer: 'REST-ресурсы — это существительные (users, orders). HTTP-методы (GET, POST, DELETE) уже выражают действие, поэтому глаголы в URL избыточны.' },
        { question: 'Чем PUT отличается от PATCH?', answer: 'PUT заменяет ресурс полностью. PATCH обновляет только указанные поля (частичное обновление).' },
        { question: 'Что такое idempotent операция?', answer: 'Операция, повторное выполнение которой даёт тот же результат. GET, PUT, DELETE — idempotent. POST — нет (каждый раз создаёт новый ресурс).' }
      ]
    },
    {
      id: 6,
      title: 'Reading: Kubernetes concepts',
      type: 'practice',
      description: 'Прочитай документацию Kubernetes и ответь на вопросы.',
      solution: 'Ключевые концепции Kubernetes:\nPod — минимальная единица развёртывания\nDeployment — управление набором Pod\nService — постоянный сетевой адрес для Pods\nIngress — маршрутизация HTTP-трафика\nNamespace — изоляция ресурсов',
      text: 'Kubernetes Pods\n\nA Pod is the smallest deployable unit in Kubernetes. A Pod represents a single instance of a running process in your cluster.\n\nPods contain one or more containers, such as Docker containers. When a Pod runs multiple containers, the containers are managed as a single entity and share the Pod\'s resources, including:\n- Network namespace (they can communicate via localhost)\n- Storage volumes\n- An IP address\n\nPods are ephemeral by nature. They are not designed to run forever. If a Pod (or the Node it runs on) fails, Kubernetes can automatically create a new Pod to replace it.\n\nNote: You should rarely create individual Pods directly. Instead, use higher-level objects like Deployments, which manage Pod replicas and restarts automatically.\n\nPod lifecycle:\n1. Pending: The Pod has been accepted but containers are not yet running\n2. Running: At least one container is running\n3. Succeeded: All containers completed successfully\n4. Failed: At least one container terminated with failure\n5. Unknown: State cannot be determined',
      tasks: [
        { question: 'Что такое Pod в Kubernetes?', answer: 'Наименьшая единица деплоя в Kubernetes — представляет один экземпляр запущенного процесса в кластере.' },
        { question: 'Что разделяют контейнеры внутри одного Pod?', answer: 'Сетевое пространство имён (могут общаться через localhost), storage volumes, IP-адрес.' },
        { question: 'Почему Pod считается ephemeral?', answer: 'Pod не предназначен для вечной работы — если он упадёт, Kubernetes автоматически создаст новый.' },
        { question: 'Что рекомендует документация вместо создания Pod напрямую?', answer: 'Использовать Deployments или другие высокоуровневые объекты, которые управляют репликами и автоматическим перезапуском Pod.' }
      ]
    },
    {
      id: 7,
      title: 'Vocabulary extraction exercise',
      type: 'practice',
      description: 'Извлеки и запиши ключевые технические слова из текста документации.',
      solution: 'Стратегия извлечения словаря:\n1. Найди незнакомые термины.\n2. Запиши их с определением из контекста.\n3. Добавь пример использования.\n4. Проверь перевод в документации или словаре.\n5. Используй в собственном предложении.',
      content: [
        { type: 'text', value: 'Из следующего текста выпиши все технические термины и дай их определения.' }
      ],
      text: 'When a microservice fails, the circuit breaker pattern prevents cascade failures by temporarily stopping requests to the failing service. After a cooldown period, it allows a probe request through. If the probe succeeds, the circuit closes and normal traffic resumes. If it fails, the circuit remains open, protecting the rest of the system from being overwhelmed.',
      terms: [
        { term: 'microservice', definition: 'Независимый небольшой сервис, часть микросервисной архитектуры.' },
        { term: 'circuit breaker pattern', definition: 'Паттерн проектирования, предотвращающий каскадные сбои путём отключения запросов к недоступному сервису.' },
        { term: 'cascade failures', definition: 'Каскадные сбои — когда отказ одного компонента вызывает отказ других.' },
        { term: 'cooldown period', definition: 'Период ожидания перед повторной попыткой после сбоя.' },
        { term: 'probe request', definition: 'Тестовый запрос для проверки, восстановился ли сервис.' }
      ]
    },
    {
      id: 8,
      title: 'True/False comprehension',
      type: 'practice',
      description: 'Прочитай технический текст и определи: утверждение верно или неверно.',
      solution: 'Стратегия ответов True/False:\n1. Найди ключевое слово из утверждения в тексте.\n2. Прочитай контекст вокруг него (2-3 предложения).\n3. Сравни с утверждением.\n4. Будь внимателен к словам "always", "never", "only" — они часто делают утверждение ложным.',
      text: 'CORS (Cross-Origin Resource Sharing)\n\nCORS is a browser security feature that restricts web pages from making requests to a domain different from the one that served the web page.\n\nBy default, browsers block cross-origin requests for security reasons (Same-Origin Policy). CORS provides a way for servers to indicate which origins are allowed to access their resources.\n\nHow it works:\nWhen a browser makes a cross-origin request, it first sends a "preflight" OPTIONS request to check if the server allows it. The server responds with CORS headers indicating what is allowed:\n- Access-Control-Allow-Origin: https://example.com (or * for all origins)\n- Access-Control-Allow-Methods: GET, POST, PUT\n- Access-Control-Allow-Headers: Content-Type, Authorization\n\nNote: CORS is a browser restriction, not a server restriction. API clients (like curl or Postman) are not subject to CORS.',
      tasks: [
        { statement: 'CORS ограничивает запросы на уровне сервера.', answer: false, explanation: 'CORS — это браузерное ограничение. curl и Postman не подчиняются CORS.' },
        { statement: 'Preflight request использует метод OPTIONS.', answer: true, explanation: 'Браузер сначала отправляет OPTIONS-запрос для проверки разрешений.' },
        { statement: '* в Access-Control-Allow-Origin означает, что разрешены все источники.', answer: true, explanation: '"*" — wildcard, разрешающий любой origin.' },
        { statement: 'CORS является функцией безопасности для защиты серверов.', answer: false, explanation: 'CORS защищает пользователей браузера, а не серверы напрямую. Это браузерная политика Same-Origin.' }
      ]
    },
    {
      id: 9,
      title: 'Inference questions',
      type: 'practice',
      description: 'Ответь на вопросы, ответы на которые не указаны прямо в тексте (inference).',
      solution: 'Стратегия выводов (inference):\nВывод = информация из текста + логический вывод.\nНикогда не выноси за рамки текста — используй только то, что написано.\nЛучший ответ подкреплён конкретной фразой из текста.',
      text: 'Semantic Versioning (SemVer)\n\nGiven a version number MAJOR.MINOR.PATCH, increment the:\n\nMAJOR version when you make incompatible API changes\nMINOR version when you add functionality in a backward compatible manner\nPATCH version when you make backward compatible bug fixes\n\nAdditional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.\n\nExamples:\n1.0.0 → 2.0.0: Breaking change introduced\n1.0.0 → 1.1.0: New feature added, backward compatible\n1.0.0 → 1.0.1: Bug fix, backward compatible\n\nWhen should you be cautious about upgrading? Any time the MAJOR version changes, as this indicates breaking changes.',
      tasks: [
        { question: 'Если ты обновляешь библиотеку с 2.3.4 до 3.0.0 — что ожидать?', answer: 'Breaking changes — изменения, ломающие обратную совместимость. Код, написанный для версии 2.x, может не работать с 3.0.0.' },
        { question: 'Безопасно ли обновляться с 1.2.0 до 1.3.0?', answer: 'Да, MINOR версия — добавлены новые фичи с обратной совместимостью. Существующий код продолжит работать.' },
        { question: 'Что означает версия 1.0.0-beta.1?', answer: 'Pre-release версия (дополнительный лейбл "beta.1"). Это нестабильная предрелизная версия.' }
      ]
    },
    {
      id: 10,
      title: 'Summary writing',
      type: 'practice',
      description: 'Напиши краткое резюме технического текста (3-5 предложений).',
      solution: 'Структура хорошего резюме:\n1. Тема/главная идея (1 предложение).\n2. Ключевые детали или аргументы (2-3 предложения).\n3. Вывод или рекомендация автора (1 предложение).\nНе копируй предложения — перефразируй своими словами.',
      content: [
        { type: 'text', value: 'Прочитай текст и напиши краткое резюме (3-4 предложения) на английском.' }
      ],
      text: 'GraphQL vs REST\n\nREST (Representational State Transfer) is the traditional approach to building APIs. Each endpoint represents a specific resource, and clients must know which endpoints to call. A common problem is over-fetching (receiving more data than needed) or under-fetching (requiring multiple requests to get all needed data).\n\nGraphQL, developed by Facebook, solves these problems by providing a single endpoint where clients specify exactly what data they need in a query. This eliminates over-fetching and under-fetching. However, GraphQL introduces complexity: caching is harder, query costs can be unpredictable, and there is a steeper learning curve.\n\nNeither is universally better. REST is simpler and well-understood; GraphQL is more flexible but more complex. The right choice depends on your specific use case.',
      sampleSummary: 'REST uses multiple endpoints where each represents a resource, which can lead to over-fetching or under-fetching. GraphQL solves this with a single endpoint where clients request exactly what they need. However, GraphQL adds complexity in caching and has a steeper learning curve. The choice between them depends on the specific requirements of the project.'
    }
  ]
}
