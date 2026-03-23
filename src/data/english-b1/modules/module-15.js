export default {
  id: 15,
  title: 'IT: API, REST, HTTP',
  description: 'Словарь API разработки: request, response, HTTP methods, status codes, authentication, rate limiting, REST principles.',
  lessons: [
    {
      id: 1,
      title: 'HTTP: request и response',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'HTTP (HyperText Transfer Protocol) — протокол передачи данных в вебе.\n\nREQUEST (запрос) — сообщение, отправляемое клиентом серверу.\nRESPONSE (ответ) — сообщение, отправляемое сервером клиенту.\n\nСтруктура HTTP Request:\n1. Method (метод/глагол): GET, POST, PUT, PATCH, DELETE\n2. URL / Path: /api/users/123\n3. Headers: Authorization, Content-Type, Accept\n4. Body / Payload: данные запроса (для POST, PUT, PATCH)\n\nСтруктура HTTP Response:\n1. Status code (код ответа): 200, 404, 500...\n2. Headers: Content-Type, Cache-Control\n3. Body: данные ответа (JSON, HTML...)\n\nКлючевые фразы:\n- to send / make a request\n- to receive a response\n- to process a request\n- to return a response\n- request/response cycle\n- to handle a request\n\nExamples:\n1. "The client sends a GET request to /api/products to retrieve the product list."\n2. "The server returns a 200 OK response with the product data in JSON format."\n3. "The request includes an Authorization header with a Bearer token."\n4. "We log all incoming requests and outgoing responses for debugging."'
        },
        {
          type: 'text',
          value: 'HTTP Methods (HTTP Методы) и их значения:\n\nGET — получить ресурс (безопасный, идемпотентный):\n"GET /api/users — returns the list of users"\n"GET /api/users/42 — returns user with ID 42"\n\nPOST — создать ресурс:\n"POST /api/users — creates a new user"\n"POST /api/orders — places a new order"\n\nPUT — полностью обновить ресурс (идемпотентный):\n"PUT /api/users/42 — replaces the entire user record"\n\nPATCH — частично обновить ресурс:\n"PATCH /api/users/42 — updates only specified fields"\n\nDELETE — удалить ресурс:\n"DELETE /api/users/42 — deletes the user"\n\nExamples:\n1. "Use PATCH instead of PUT when you only want to update the email field."\n2. "GET requests should never modify server-side data."\n3. "The API accepts POST requests for creating resources and PUT for replacing them."'
        }
      ]
    },
    {
      id: 2,
      title: 'HTTP Status Codes',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'HTTP Status Codes (коды состояния) — трёхзначные числа, описывающие результат запроса.\n\n2xx — Успех (Success):\n200 OK — запрос выполнен успешно\n201 Created — ресурс создан\n204 No Content — успех, тела ответа нет\n\n3xx — Перенаправление (Redirection):\n301 Moved Permanently — постоянный редирект\n302 Found — временный редирект\n304 Not Modified — кэшированная версия актуальна\n\n4xx — Ошибки клиента (Client Errors):\n400 Bad Request — неверный запрос\n401 Unauthorized — нет аутентификации\n403 Forbidden — нет прав доступа\n404 Not Found — ресурс не найден\n409 Conflict — конфликт состояния ресурса\n422 Unprocessable Entity — ошибка валидации\n429 Too Many Requests — превышен лимит запросов\n\n5xx — Ошибки сервера (Server Errors):\n500 Internal Server Error — внутренняя ошибка\n502 Bad Gateway — ошибка шлюза\n503 Service Unavailable — сервис недоступен\n504 Gateway Timeout — таймаут шлюза'
        },
        {
          type: 'text',
          value: 'Ключевые фразы для работы со статус-кодами:\n- "The API returns 404 if the resource is not found."\n- "A 401 response means the user is not authenticated."\n- "Return 403 when the user is authenticated but lacks permission."\n- "We get a 429 error when we exceed the rate limit."\n- "A 500 error indicates a server-side bug — we need to investigate."\n- "The API responds with 201 Created after successfully creating a resource."\n- "Always return 400 with a descriptive error message for invalid input."\n- "503 means the service is temporarily unavailable, often during maintenance."\n\nРазница между 401 и 403:\n"401 Unauthorized: you haven\'t provided credentials (or they are invalid)."\n"403 Forbidden: you are authenticated, but you don\'t have permission for this action."\n\nPractice — match status code to situation:\n1. User tries to access another user\'s data → 403\n2. User tries to log in with wrong password → 401\n3. Client sends malformed JSON → 400\n4. Resource successfully created → 201\n5. Server crashes during processing → 500'
        }
      ]
    },
    {
      id: 3,
      title: 'Headers: Authorization, Content-Type и другие',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'HTTP Headers (заголовки) — метаданные запроса/ответа.\n\nКлючевые заголовки запроса:\n\nAuthorization — аутентификационные данные:\n"Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."\n"Authorization: Basic base64encodedCredentials"\n\nContent-Type — тип данных в теле запроса:\n"Content-Type: application/json" — JSON данные\n"Content-Type: multipart/form-data" — файлы\n"Content-Type: application/x-www-form-urlencoded" — форма\n\nAccept — ожидаемый тип ответа:\n"Accept: application/json"\n\nX-API-Key — API ключ:\n"X-API-Key: your-api-key-here"\n\nUser-Agent — информация о клиенте:\n"User-Agent: Mozilla/5.0..."\n\nCORS заголовки:\n"Access-Control-Allow-Origin: *"\n"Access-Control-Allow-Methods: GET, POST, PUT"\n\nКлючевые фразы:\n- "Include the Authorization header in every request."\n- "Set Content-Type to application/json when sending JSON data."\n- "The server returns a 415 error if the Content-Type is not supported."\n- "CORS headers must be configured to allow cross-origin requests."'
        },
        {
          type: 'text',
          value: 'Заголовки ответа:\n\nContent-Type — тип данных в ответе:\n"Content-Type: application/json; charset=utf-8"\n\nCache-Control — политика кэширования:\n"Cache-Control: no-cache, no-store"\n"Cache-Control: max-age=3600" — кэшировать 1 час\n\nX-RateLimit — информация о лимитах:\n"X-RateLimit-Limit: 1000"\n"X-RateLimit-Remaining: 999"\n"X-RateLimit-Reset: 1609459200"\n\nLocation — URL созданного ресурса (с 201):\n"Location: /api/users/123"\n\nExamples в контексте:\n1. "The response includes a Location header pointing to the newly created resource."\n2. "We set Cache-Control: no-cache for sensitive data to prevent caching."\n3. "The rate limit headers tell clients how many requests they have left."\n4. "Always check the Content-Type of the response before parsing it."'
        }
      ]
    },
    {
      id: 4,
      title: 'Authentication: JWT, OAuth, API Keys',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'AUTHENTICATION (аутентификация) — проверка личности пользователя. КТО вы?\nAUTHORIZATION (авторизация) — проверка прав. ЧТО вам можно делать?\n\nТри основных метода аутентификации API:\n\n1. API KEY (API ключ) — простой статический токен:\n"The client includes the API key in the header or query parameter."\n"API keys are simple but don\'t support user-level permissions."\n"We rotate API keys regularly to maintain security."\n\n2. JWT (JSON Web Token) — самодостаточный токен с данными:\n"JWT consists of three parts: header, payload, and signature."\n"The server signs the JWT with a secret key."\n"The client sends the JWT in the Authorization header."\n"JWT is stateless — the server doesn\'t need to store session data."\n"Access tokens are short-lived (15 minutes), refresh tokens last longer."\n\n3. OAuth 2.0 — протокол делегированного доступа:\n"OAuth allows users to grant third-party apps access to their data."\n"The authorization code flow is the most secure for web applications."\n"Access tokens are issued by the authorization server."\n"Scopes define what the application is allowed to access."'
        },
        {
          type: 'text',
          value: 'Ключевые фразы для аутентификации:\n- "Authenticate the user using OAuth 2.0."\n- "Include a valid Bearer token in the Authorization header."\n- "The token has expired — the client needs to refresh it."\n- "We use short-lived access tokens for security."\n- "The refresh token can be used to obtain a new access token."\n- "Two-factor authentication adds an extra layer of security."\n- "Invalidate all tokens when a user changes their password."\n- "We implement role-based access control (RBAC)."\n\nExamples:\n1. "If the JWT signature is invalid, return 401 Unauthorized."\n2. "We store the refresh token in an HttpOnly cookie to prevent XSS attacks."\n3. "The API uses OAuth 2.0 with the client credentials flow for service-to-service auth."\n4. "We rotate API keys every 90 days as per our security policy."\n5. "Multi-tenant applications use separate API keys for each client."'
        }
      ]
    },
    {
      id: 5,
      title: 'Rate Limiting, Throttling, Pagination',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'RATE LIMITING (ограничение частоты запросов) — защита API от злоупотреблений.\nTHROTTLING (дросселирование) — замедление при превышении лимита.\n\nФразы:\n- rate limit (лимит запросов)\n- to exceed the rate limit\n- requests per minute/hour (RPM/RPH)\n- per-user / per-IP rate limiting\n- to throttle a request\n- rate limit window (окно ограничения)\n- to backoff and retry (ждать и повторить)\n- exponential backoff\n\nExamples:\n1. "The API allows 1000 requests per minute per API key."\n2. "When you exceed the rate limit, the API returns 429 Too Many Requests."\n3. "We implement per-user rate limiting to prevent abuse."\n4. "The client should implement exponential backoff when receiving 429 responses."\n5. "Rate limiting protects our infrastructure from DDoS and API abuse."\n6. "The X-RateLimit-Reset header tells clients when the window resets."'
        },
        {
          type: 'text',
          value: 'PAGINATION (пагинация) — разбивка больших результатов на страницы.\n\nТипы пагинации:\n1. Offset-based: page=2&per_page=20\n2. Cursor-based: cursor=eyJsYXN0SWQiOjEwMH0=\n3. Keyset-based: after_id=100\n\nФразы:\n- to paginate results\n- page size / page limit\n- to navigate through pages\n- total count / total pages\n- first/last/next/previous page\n- cursor-based pagination\n\nExamples:\n1. "Always paginate large dataset responses to avoid performance issues."\n2. "The API returns 20 items per page by default, maximum 100."\n3. "Use cursor-based pagination for real-time feeds to avoid duplicate data."\n4. "The response includes metadata: total count, current page, and next page URL."\n5. "Offset-based pagination can return duplicate items if data changes between pages."\n\nVERSIONING (версионирование API):\n"We version our API using URL paths: /api/v1, /api/v2."\n"Version the API when introducing breaking changes."\n"Deprecated versions are supported for at least 12 months."\n"We use semantic versioning for API releases."'
        }
      ]
    },
    {
      id: 6,
      title: 'REST principles и GraphQL',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'REST (Representational State Transfer) — архитектурный стиль для API.\n\n6 принципов REST:\n1. Stateless (без состояния) — каждый запрос независим.\n2. Client-Server — разделение клиента и сервера.\n3. Cacheable — ответы можно кэшировать.\n4. Uniform Interface — единообразный интерфейс.\n5. Layered System — слоистая архитектура.\n6. Code on Demand (необязательно) — сервер отправляет исполняемый код.\n\nРесурсы в REST:\n"In REST, everything is a resource identified by a URL."\n"Resources are manipulated using HTTP methods."\n"Resource URLs should be nouns, not verbs: /users, not /getUsers."\n"Use plural nouns for collections: /products, not /product."\n\nExamples:\n1. "Our REST API follows resource-based URL design."\n2. "The API is stateless — the server stores no session data."\n3. "We use standard HTTP methods instead of custom actions."\n4. "RESTful APIs are easy to understand because they follow conventions."'
        },
        {
          type: 'text',
          value: 'GraphQL — альтернатива REST:\n\nОтличия GraphQL от REST:\n- "GraphQL uses a single endpoint, whereas REST has multiple endpoints."\n- "Clients specify exactly what data they need, avoiding over-fetching."\n- "GraphQL eliminates under-fetching — clients can get all needed data in one request."\n- "The schema defines available queries and mutations."\n\nКлючевые термины GraphQL:\n- query (запрос данных)\n- mutation (изменение данных)\n- subscription (подписка на обновления)\n- schema (схема API)\n- resolver (функция, возвращающая данные)\n- introspection (изучение схемы)\n\nExamples:\n1. "We use GraphQL to let mobile clients request only the fields they display."\n2. "The GraphQL schema acts as the contract between frontend and backend."\n3. "GraphQL subscriptions allow real-time data updates via WebSocket."\n4. "REST is simpler for basic CRUD; GraphQL shines for complex, nested data requirements."'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: API документация и обсуждение',
      type: 'practice',
      description: 'Переведи API-фразы на английский и опиши endpoint.',
      solution: 'Правильные ответы (перевод):\n1. The API returns 404 if the user is not found.\n2. The token has expired — the client needs to use the refresh token.\n3. We use JWT to authenticate API requests.\n4. Don\'t forget to include the Authorization header in every request.\n5. The client exceeded the rate limit and received a 429 status.\n6. Add pagination to this endpoint — it returns too much data.',
      content: [
        {
          type: 'text',
          value: 'Опишите API endpoint на английском:\n\nПример описания endpoint:\n"POST /api/v1/users/login\n\nDescription: Authenticates a user and returns a JWT access token.\n\nRequest:\n- Content-Type: application/json\n- Body: { email: string, password: string }\n\nResponse:\n- 200 OK: { access_token: string, expires_in: 3600 }\n- 401 Unauthorized: { error: \'Invalid credentials\' }\n- 429 Too Many Requests: { error: \'Rate limit exceeded\', retry_after: 60 }\n\nThe endpoint is rate-limited to 10 requests per minute per IP address. The access token expires after 1 hour. A refresh token is set in an HttpOnly cookie for obtaining new access tokens."'
        },
        {
          type: 'text',
          value: 'Переведите на английский:\n\n1. API возвращает 404, если пользователь не найден.\n→ The API returns 404 if the user is not found.\n\n2. Токен истёк — клиенту нужно использовать токен обновления.\n→ The token has expired — the client needs to use the refresh token.\n\n3. Мы используем JWT для аутентификации запросов к API.\n→ We use JWT to authenticate API requests.\n\n4. Не забудьте включить заголовок Authorization в каждый запрос.\n→ Don\'t forget to include the Authorization header in every request.\n\n5. Клиент превысил лимит запросов и получил 429 статус.\n→ The client exceeded the rate limit and received a 429 status.\n\n6. Добавьте пагинацию к этому эндпоинту — он возвращает слишком много данных.\n→ Add pagination to this endpoint — it returns too much data.'
        }
      ]
    }
  ]
}
