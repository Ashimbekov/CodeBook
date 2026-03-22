export default {
  id: 10,
  title: 'API Design',
  description: 'Проектирование API: REST, GraphQL, gRPC. Версионирование, пагинация, аутентификация. Best practices и типичные ошибки.',
  lessons: [
    {
      id: 1,
      title: 'REST API: принципы и best practices',
      type: 'theory',
      description: 'REST: ресурсы (существительные в URL), HTTP методы (GET/POST/PUT/PATCH/DELETE), статус-коды. Хорошие vs плохие URL. Ключевые коды: 201, 204, 401, 403, 429.',
      solution: 'Ресурсы: /users/123, /users/123/orders. Методы: GET-читать, POST-создать, PUT-заменить, PATCH-обновить, DELETE-удалить. Коды: 200 OK, 201 Created (POST), 204 No Content (DELETE), 400 Bad Request, 401 Unauthenticated, 403 Forbidden, 404 Not Found, 429 Rate Limit. 401 = не залогинен, 403 = нет прав.',
      content: [
        { type: 'text', value: 'REST (Representational State Transfer) — архитектурный стиль для создания веб-API. Основан на ресурсах, HTTP методах и статус-кодах.' },
        { type: 'heading', value: 'Принципы REST' },
        { type: 'list', value: [
          'Ресурсы: существительные (не глаголы): /users, /orders, /products',
          'HTTP методы: GET (читать), POST (создать), PUT (заменить), PATCH (обновить), DELETE (удалить)',
          'Stateless: каждый запрос содержит всё необходимое (токен, данные)',
          'Единый интерфейс: предсказуемая структура URL',
          'Коды ответа: 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Internal Error'
        ]},
        { type: 'heading', value: 'Хорошие и плохие URL' },
        { type: 'text', value: 'Плохо (глаголы в URL):\n  GET /getUser?id=123\n  POST /createOrder\n  DELETE /deleteProduct?id=5\n\nХорошо (ресурсы + HTTP методы):\n  GET /users/123\n  POST /orders\n  DELETE /products/5\n  GET /users/123/orders          → заказы пользователя\n  GET /users/123/orders/456      → конкретный заказ' },
        { type: 'heading', value: 'HTTP статус-коды: важные' },
        { type: 'text', value: '200 OK: успешный GET/PUT/PATCH\n201 Created: успешный POST (создание)\n204 No Content: успешный DELETE\n400 Bad Request: невалидные данные от клиента\n401 Unauthorized: не аутентифицирован\n403 Forbidden: нет прав\n404 Not Found: ресурс не найден\n409 Conflict: конфликт (дублирование)\n429 Too Many Requests: rate limit\n500 Internal Server Error: ошибка сервера' },
        { type: 'tip', value: 'Используйте 401 когда пользователь не залогинен, 403 когда залогинен, но нет прав. Это разные ситуации и клиент должен их различать.' }
      ]
    },
    {
      id: 2,
      title: 'GraphQL: гибкие запросы данных',
      type: 'theory',
      description: 'GraphQL решает over-fetching и under-fetching REST. Клиент указывает нужные поля. REST vs GraphQL: когда что выбирать (мобильные клиенты, BFF, сложные вложенные данные).',
      solution: 'REST проблемы: over-fetching (20 полей, нужны 2), under-fetching (3 запроса вместо 1). GraphQL: один запрос → ровно нужные данные. GraphQL лучше: мобилка (трафик), вложенные данные, несколько клиентов, BFF. REST лучше: простое CRUD, публичное API, CDN кеш, файловые операции.',
      content: [
        { type: 'text', value: 'GraphQL — язык запросов для API, где клиент сам указывает, какие данные ему нужны. Разработан в Facebook.' },
        { type: 'heading', value: 'Проблема REST, которую решает GraphQL' },
        { type: 'text', value: 'Over-fetching: REST возвращает все поля объекта, даже если нужны 2 из 20.\n  GET /users/123 → возвращает {id, name, email, phone, address, avatar, bio, created_at, ...}\n  Клиент использует только name и avatar\n\nUnder-fetching: нужно несколько запросов для получения связанных данных.\n  GET /users/123 → получить user\n  GET /users/123/posts → получить посты\n  GET /posts/1/comments → получить комментарии\n  3 запроса вместо 1!' },
        { type: 'heading', value: 'GraphQL: один запрос — нужные данные' },
        { type: 'text', value: 'Запрос (клиент указывает что хочет):\n  query {\n    user(id: "123") {\n      name\n      avatar\n      posts(limit: 5) {\n        title\n        comments(limit: 3) {\n          text\n          author { name }\n        }\n      }\n    }\n  }\n\nОдин запрос → получаем ровно то, что нужно, без лишних полей.' },
        { type: 'heading', value: 'REST vs GraphQL: когда что' },
        { type: 'text', value: 'REST лучше когда:\n- Простые CRUD операции\n- Публичное API (легче документировать)\n- Файловые операции (GraphQL плохо работает с бинарными данными)\n- Кеширование на CDN-уровне (GraphQL запросы — POST)\n\nGraphQL лучше когда:\n- Мобильные клиенты (важна экономия трафика)\n- Сложные вложенные данные\n- Несколько клиентов с разными потребностями\n- BFF (Backend for Frontend) паттерн' }
      ]
    },
    {
      id: 3,
      title: 'gRPC: высокопроизводительный RPC',
      type: 'theory',
      description: 'gRPC: Protocol Buffers (бинарный, 3–10x компактнее JSON) + HTTP/2 (мультиплексирование, streaming). .proto-файл → генерация кода. Применение: внутренние микросервисы.',
      solution: 'gRPC: .proto → код → вызов как функции. Протоколы: Protobuf (бинарный) + HTTP/2. Быстрее REST/JSON: сжатие 3–10x, мультиплексирование, server streaming. Типичная архитектура: [Браузер] → REST/GraphQL → [API Gateway] → gRPC → [Microservices]. Браузеры не поддерживают gRPC напрямую → gRPC-Web.',
      content: [
        { type: 'text', value: 'gRPC — RPC фреймворк от Google. Использует Protocol Buffers для сериализации и HTTP/2 для транспорта. Идеален для внутреннего inter-service взаимодействия.' },
        { type: 'heading', value: 'Как работает gRPC' },
        { type: 'text', value: '1. Определяем интерфейс в .proto файле:\n  service UserService {\n    rpc GetUser (GetUserRequest) returns (User)\n    rpc ListUsers (ListUsersRequest) returns (stream User)  // streaming\n  }\n  message User { string id = 1; string name = 2; }\n\n2. Генерируем код для нужного языка (Java, Go, Python, ...)\n3. Сервер реализует интерфейс\n4. Клиент вызывает методы как обычные функции' },
        { type: 'heading', value: 'Почему gRPC быстрее REST/JSON' },
        { type: 'list', value: [
          'Protocol Buffers: бинарный формат, в 3–10 раз компактнее JSON',
          'HTTP/2: мультиплексирование, server push, сжатие заголовков',
          'Streaming: server/client/bidirectional streaming из коробки',
          'Строгая типизация: ошибки типов на уровне генерации кода'
        ]},
        { type: 'heading', value: 'REST vs GraphQL vs gRPC' },
        { type: 'text', value: 'REST: публичное API, простота, браузеры, CDN кеш\nGraphQL: гибкие запросы, мобильные клиенты, BFF\ngRPC: внутренние микросервисы, высокий throughput, low latency, streaming\n\nТипичная архитектура:\n  [Браузер/Мобилка] → REST/GraphQL → [API Gateway] → gRPC → [Microservices]' },
        { type: 'note', value: 'gRPC плохо работает в браузерах (нет поддержки HTTP/2 trailers). Для браузеров используют gRPC-Web или grpc-gateway (конвертирует REST → gRPC). Это нормально: браузер → REST → API Gateway → gRPC → сервисы.' }
      ]
    },
    {
      id: 4,
      title: 'Версионирование API',
      type: 'theory',
      description: 'Три стратегии: URL (/api/v1/, популярно), Header (Accept: vnd.v2+json), Query param (?version=2). Breaking changes требуют новой версии. Sunsetting: 6–12 месяцев на миграцию.',
      solution: 'Breaking change → новая версия: удаление поля, изменение типа, изменение семантики, удаление endpoint. Не breaking: добавить необязательное поле/параметр/endpoint. URL версионирование /api/v1/ — популярно и просто. Sunsetting: добавить Deprecation + Sunset заголовки, дать 6–12 месяцев, отключить.',
      content: [
        { type: 'text', value: 'API живёт долго. Клиенты не обновляются мгновенно. Нужно поддерживать обратную совместимость и версионирование.' },
        { type: 'heading', value: 'Стратегии версионирования' },
        { type: 'text', value: 'URL версионирование (наиболее популярное):\n  /api/v1/users\n  /api/v2/users\n  Плюс: явно, просто для понимания\n  Минус: URL меняется, нужно поддерживать несколько версий\n\nHeader версионирование:\n  GET /api/users\n  Accept: application/vnd.myapp.v2+json\n  Плюс: URL чистый\n  Минус: сложнее тестировать, не видно в браузере\n\nQuery Parameter:\n  GET /api/users?version=2\n  Плюс: просто\n  Минус: сложнее кешировать (CDN кешируется по URL)' },
        { type: 'heading', value: 'Когда делать новую версию' },
        { type: 'list', value: [
          'Удаление поля из ответа (breaking change)',
          'Изменение типа поля (string → int)',
          'Изменение семантики поля',
          'Удаление endpoint'
        ]},
        { type: 'text', value: 'НЕ breaking changes (можно без новой версии):\n- Добавление нового необязательного поля в ответ\n- Добавление нового необязательного параметра запроса\n- Добавление нового endpoint' },
        { type: 'tip', value: 'Sunsettig (устаревание): при выпуске v2 объявите v1 deprecated. Добавьте заголовок Deprecation: "2025-06-01" и Sunset: "2026-01-01". Дайте клиентам 6–12 месяцев на миграцию, затем отключайте.' }
      ]
    },
    {
      id: 5,
      title: 'Пагинация: cursor, offset, keyset',
      type: 'theory',
      description: 'Offset/Limit: просто, но медленно на больших offset и race condition при вставках. Cursor-based: быстро даже на млрд записей, нет race condition, но нельзя прыгать на страницу.',
      solution: 'Offset: GET /posts?offset=0&limit=20 → медленно при offset=10M. Cursor: GET /posts?limit=20&cursor=eyJpZCI6MTAwfQ → SQL: WHERE id > 100 LIMIT 20. Cursor = base64(last_id). Ответ: {data, next_cursor}. Twitter/Instagram/Facebook используют cursor для бесконечного скролла. Offset → только для маленьких наборов данных.',
      content: [
        { type: 'text', value: 'Когда данных много (миллионы записей), отдавать всё сразу нельзя. Пагинация — разбивка на страницы.' },
        { type: 'heading', value: 'Offset/Limit пагинация' },
        { type: 'text', value: 'GET /posts?offset=0&limit=20    → записи 1–20\nGET /posts?offset=20&limit=20   → записи 21–40\nGET /posts?offset=40&limit=20   → записи 41–60\n\nПлюсы: просто, можно перейти на любую страницу\nМинусы:\n- При большом offset медленно: БД должна отсчитать N строк\n- Race condition: если пока пользователь читал страницы была вставлена запись — сдвиг, дубликаты' },
        { type: 'heading', value: 'Cursor-based пагинация (рекомендуется)' },
        { type: 'text', value: 'Вместо номера страницы — cursor (указатель на последний элемент).\n\nПервый запрос:\n  GET /posts?limit=20\n  Ответ: { data: [...], next_cursor: "eyJpZCI6MTAwfQ" }\n\nСледующий запрос:\n  GET /posts?limit=20&cursor=eyJpZCI6MTAwfQ\n  Ответ: { data: [...], next_cursor: "eyJpZCI6MTIwfQ" }\n\nCursor = base64({"id": 100, "created_at": "2024-01-15"})\n\nSQL: SELECT * FROM posts WHERE id > 100 ORDER BY id LIMIT 20\n\nПлюсы: быстро даже на больших данных, нет race condition\nМинусы: нельзя перейти на произвольную страницу' },
        { type: 'note', value: 'Twitter, Instagram, Facebook используют cursor-based пагинацию для лент. Это единственный практичный вариант для бесконечного скролла с миллиардами записей.' }
      ]
    },
    {
      id: 6,
      title: 'Аутентификация и авторизация API',
      type: 'theory',
      description: 'JWT: Header.Payload.Signature, stateless проверка, отзыв через Redis blacklist. OAuth 2.0 flows: Authorization Code (web), PKCE (mobile/SPA), Client Credentials (server-to-server).',
      solution: 'JWT: декодировать Payload → проверить Signature → проверить exp → проверить role. Stateless (не нужна БД). Отзыв: Redis blacklist до истечения. OAuth: Authorization Code + PKCE для SPA/mobile (нет client secret), Client Credentials для M2M. Публичное API: API Keys проще JWT.',
      content: [
        { type: 'text', value: 'Безопасность API: аутентификация (кто ты?) и авторизация (что тебе разрешено?).' },
        { type: 'heading', value: 'JWT (JSON Web Token)' },
        { type: 'text', value: 'JWT = Header.Payload.Signature\n\nHeader: {"alg": "HS256", "typ": "JWT"}\nPayload: {"user_id": "123", "role": "admin", "exp": 1700000000}\nSignature: HMAC-SHA256(header + payload, secret)\n\nПроверка токена:\n1. Декодировать Payload (base64)\n2. Проверить Signature (не подделан ли?)\n3. Проверить exp (не истёк ли?)\n4. Проверить role/permissions\n\nПлюс: stateless (не нужна БД для проверки)\nМинус: нельзя "отозвать" до истечения (нужен blacklist в Redis)' },
        { type: 'heading', value: 'OAuth 2.0 и OIDC' },
        { type: 'text', value: 'OAuth 2.0: "Войти через Google/GitHub". Пользователь даёт доступ к своим данным стороннему приложению без передачи пароля.\n\nFlows:\n- Authorization Code (для web apps): самый безопасный\n- PKCE (для mobile/SPA): без client secret\n- Client Credentials (для server-to-server): service accounts' },
        { type: 'tip', value: 'Для публичного API (внешние разработчики): API Keys проще чем OAuth. Ключ = рандомная строка в заголовке Authorization: Bearer <api_key>. Rate limiting по ключу, отзыв мгновенный.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: спроектируй API для Twitter',
      type: 'practice',
      description: 'Практика проектирования REST API для Twitter: tweets CRUD, лайки, лента с cursor-based пагинацией, социальный граф (follow/unfollow/followers), поиск.',
      requirements: [
        'Спроектировать RESTful эндпоинты для твитов (CRUD)',
        'Реализовать API для социального графа (follow/unfollow/followers)',
        'Добавить API для ленты с cursor-based пагинацией',
        'Использовать правильные HTTP методы и статус-коды',
        'Описать API для лайков и поиска'
      ],
      hint: 'Используй существительные в URL (не глаголы), HTTP методы для действий. Для лент и списков обязательна cursor-based пагинация — offset-based ломается при большом количестве записей. Вложенные ресурсы: /users/{id}/followers.',
      expectedOutput: 'REST API спроектирован: эндпоинты для твитов, лайков, ленты, социального графа и поиска. URL используют существительные. HTTP методы правильные. Статус-коды корректны (201 для создания, 204 для удаления). Лента использует cursor-based пагинацию.',
      solution: 'REST API для Twitter-подобного сервиса:\n\nTweets:\n- POST /api/v1/tweets → 201 Created {tweet_id, text, author, created_at}\n- GET /api/v1/tweets/{tweet_id} → 200 {tweet_id, text, author, likes, retweets}\n- DELETE /api/v1/tweets/{tweet_id} → 204\n- POST /api/v1/tweets/{tweet_id}/likes → 201 {liked: true}\n- DELETE /api/v1/tweets/{tweet_id}/likes → 204\n\nFeed (cursor-based пагинация):\n- GET /api/v1/timeline/home?limit=20&cursor={cursor} → {tweets: [...], next_cursor: "..."}\n- GET /api/v1/timeline/user/{user_id}?limit=20&cursor={cursor}\n\nUsers и Social Graph:\n- GET /api/v1/users/{username} → {id, name, bio, followers_count}\n- POST /api/v1/users/{username}/follow → 201\n- DELETE /api/v1/users/{username}/follow → 204\n- GET /api/v1/users/{username}/followers?limit=20&cursor={cursor}\n\nПоиск:\n- GET /api/v1/search/tweets?q=openai&limit=20&cursor={cursor}',
      explanation: 'Ключевые принципы: ресурсы (существительные), HTTP методы (GET/POST/DELETE), правильные статус-коды (201 для создания, 204 для удаления без тела). Cursor-based пагинация вместо offset — обязательна для лент с миллиардами записей. Вложенные ресурсы (/users/{id}/followers) для связанных данных.',
      content: [
        { type: 'text', value: 'Спроектируем ключевые REST API эндпоинты для Twitter-подобного сервиса.' },
        { type: 'heading', value: 'Tweets (Твиты)' },
        { type: 'text', value: 'Создать твит:\n  POST /tweets\n  Body: { "text": "Hello World!", "media_ids": ["img123"] }\n  Response 201: { "id": "tweet_001", "text": "...", "author": {...}, "created_at": "..." }\n\nПолучить твит:\n  GET /tweets/{tweet_id}\n  Response 200: { "id": "...", "text": "...", "author": {...}, "likes": 42, ... }\n\nУдалить твит:\n  DELETE /tweets/{tweet_id}\n  Response 204: (пусто)\n\nЛента:\n  GET /timeline/home?limit=20&cursor={cursor}\n  Response: { "tweets": [...], "next_cursor": "..." }' },
        { type: 'heading', value: 'Users (Пользователи)' },
        { type: 'text', value: 'Профиль:\n  GET /users/{username}\n  Response: { "id": "...", "name": "...", "bio": "...", "followers_count": 1000 }\n\nПодписаться:\n  POST /users/{username}/follow\n  Response 201: { "following": true }\n\nОтписаться:\n  DELETE /users/{username}/follow\n  Response 204\n\nСписок подписчиков:\n  GET /users/{username}/followers?limit=20&cursor={cursor}' },
        { type: 'heading', value: 'Likes (Лайки)' },
        { type: 'text', value: 'Лайкнуть:\n  POST /tweets/{tweet_id}/likes\n  Response 201: { "liked": true }\n\nУбрать лайк:\n  DELETE /tweets/{tweet_id}/likes\n  Response 204\n\nСписок тех, кто лайкнул:\n  GET /tweets/{tweet_id}/likes?limit=20&cursor={cursor}' },
        { type: 'heading', value: 'Поиск' },
        { type: 'text', value: 'Поиск твитов:\n  GET /search/tweets?q=хабр&limit=20&cursor={cursor}\n  Response: { "tweets": [...], "next_cursor": "..." }' },
        { type: 'note', value: 'На интервью не нужно описывать все эндпоинты детально. Достаточно показать: понимание RESTful дизайна, правильные HTTP методы, понимание пагинации и статус-кодов.' }
      ]
    }
  ]
}
