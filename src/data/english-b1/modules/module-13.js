export default {
  id: 13,
  title: 'IT: архитектура и паттерны',
  description: 'Ключевые термины IT-архитектуры: microservices, monolith, load balancer, cache, queue, middleware, endpoint, payload и другие.',
  lessons: [
    {
      id: 1,
      title: 'Monolith vs Microservices',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'MONOLITH (монолит) — архитектура, в которой всё приложение развёрнуто как единое целое.\n\nКлючевые слова и фразы:\n- monolithic application/architecture\n- tightly coupled (плотно связанный)\n- single deployable unit (единица деплоя)\n- to maintain a monolith (поддерживать монолит)\n- monolithic codebase (монолитная кодовая база)\n\nPrimers:\n1. "Our legacy system is a monolith — any change requires a full deployment."\n2. "The monolithic architecture made it difficult to scale individual components."\n3. "We started as a monolith, which was fine for early-stage development."\n4. "Maintaining a monolith becomes challenging as the team grows."\n\nMICROSERVICES (микросервисы) — архитектура из независимых небольших сервисов.\n\nКлючевые слова:\n- microservices architecture\n- independently deployable (независимо разворачиваемый)\n- loosely coupled (слабо связанный)\n- service mesh (сеть сервисов)\n- distributed system (распределённая система)\n\nExamples:\n1. "We migrated to microservices to allow teams to deploy independently."\n2. "Each microservice owns its own data and exposes an API."\n3. "Microservices are loosely coupled, unlike the monolith we replaced."\n4. "With microservices, a failure in one service doesn\'t bring down the entire system."'
        },
        {
          type: 'text',
          value: 'Trade-offs (компромиссы) — важная тема для архитектурных дискуссий:\n\n"Microservices offer better scalability, but they introduce operational complexity."\n"A monolith is simpler to develop initially, whereas microservices are easier to scale."\n"Despite the overhead, microservices allow teams to work independently."\n"Although microservices are more complex to orchestrate, they provide better fault isolation."'
        },
        {
          type: 'tip',
          value: 'На собеседовании ключевые слова для ответа об архитектуре: trade-off, scalability, maintainability, fault isolation, independent deployment, team autonomy.'
        }
      ]
    },
    {
      id: 2,
      title: 'Load Balancer, Cache, CDN',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'LOAD BALANCER (балансировщик нагрузки) — распределяет трафик между серверами.\n\nФразы и употребление:\n- to distribute traffic (распределять трафик)\n- round-robin algorithm (алгоритм "по кругу")\n- health check (проверка доступности)\n- sticky sessions (привязка сессии к серверу)\n- to sit behind a load balancer (стоять за балансировщиком)\n\nExamples:\n1. "All requests go through the load balancer before reaching our servers."\n2. "The load balancer detected that one server was unhealthy and stopped sending traffic to it."\n3. "We added a load balancer to handle the increased traffic."\n4. "The application sits behind an AWS Application Load Balancer."\n\nCACHE (кэш) — временное хранилище данных для ускорения доступа.\n\nФразы:\n- to cache data / to store in cache\n- cache hit / cache miss (попадание/промах кэша)\n- cache invalidation (инвалидация кэша)\n- TTL (Time To Live) — время жизни кэша\n- stale data (устаревшие данные в кэше)\n- to warm up the cache (прогреть кэш)\n\nExamples:\n1. "We added a Redis cache to reduce database load."\n2. "The cache TTL is set to 5 minutes to prevent stale data."\n3. "Cache invalidation is one of the hardest problems in computer science."\n4. "On a cache miss, the application fetches data from the database."'
        },
        {
          type: 'text',
          value: 'CDN (Content Delivery Network) — сеть доставки контента.\n\nФразы:\n- to serve static assets via CDN\n- edge location / edge server\n- to cache at the edge\n- origin server vs edge server\n- to purge the CDN cache\n\nExamples:\n1. "Static files like images and CSS are served via CDN."\n2. "The CDN caches content at edge locations closest to the user."\n3. "After updating the logo, we had to purge the CDN cache."\n4. "Using a CDN reduced page load time for our international users by 60%."'
        }
      ]
    },
    {
      id: 3,
      title: 'Queue, Event-Driven Architecture',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'QUEUE (очередь) — структура данных / компонент архитектуры для асинхронной обработки.\n\nВиды очередей: message queue, task queue, priority queue\nИнструменты: RabbitMQ, Kafka, AWS SQS, Redis Queue\n\nКлючевые фразы:\n- to add to the queue / to enqueue\n- to process messages from the queue\n- producer and consumer (производитель и потребитель)\n- dead letter queue (очередь неудачных сообщений)\n- queue depth / backlog (глубина очереди)\n- to scale consumers (масштабировать потребителей)\n\nExamples:\n1. "Email notifications are sent asynchronously via a message queue."\n2. "When the order is placed, it is added to the processing queue."\n3. "We use Kafka as our message queue for event streaming."\n4. "The queue consumer processes 1000 messages per second."\n5. "Failed messages are moved to the dead letter queue for investigation."\n6. "We scaled up the consumers because the queue depth was growing."'
        },
        {
          type: 'text',
          value: 'EVENT-DRIVEN ARCHITECTURE (событийно-ориентированная архитектура):\n\nКлючевые слова:\n- event (событие)\n- event producer / event publisher\n- event consumer / event subscriber\n- event bus / event broker\n- publish-subscribe pattern (pub/sub)\n- event stream\n- to emit an event\n- to listen for / subscribe to an event\n\nExamples:\n1. "When a user registers, we emit a \'user_created\' event."\n2. "Multiple services subscribe to the \'payment_completed\' event."\n3. "Our event-driven architecture decouples the order service from the inventory service."\n4. "The email service listens for user registration events and sends a welcome email."\n5. "We use an event bus to route messages between microservices."\n6. "Event sourcing lets us replay events to reconstruct the application state."'
        }
      ]
    },
    {
      id: 4,
      title: 'Middleware, Gateway, Proxy',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'MIDDLEWARE (промежуточное ПО) — программный слой между компонентами системы.\n\nВ веб-разработке: код, выполняющийся между запросом и обработчиком.\nВ архитектуре: программное обеспечение, связывающее разные системы.\n\nФразы:\n- to add middleware to the pipeline\n- middleware chain / middleware stack\n- request middleware / response middleware\n- authentication middleware\n- logging middleware\n- to inject into the middleware pipeline\n\nExamples:\n1. "The authentication middleware checks the JWT token on every request."\n2. "We added logging middleware to track all incoming requests."\n3. "The rate-limiting middleware prevents API abuse."\n4. "Middleware in Express.js processes requests in the order they are defined."\n\nAPI GATEWAY (шлюз API) — единая точка входа для всех клиентских запросов.\n\nФразы:\n- single entry point (единая точка входа)\n- to route requests\n- to aggregate responses\n- API gateway pattern\n\nExamples:\n1. "All client requests pass through the API gateway before reaching microservices."\n2. "The API gateway handles authentication, rate limiting, and request routing."\n3. "We use Kong as our API gateway."\n4. "The gateway aggregates responses from multiple microservices into a single response."'
        },
        {
          type: 'text',
          value: 'PROXY (прокси) — посредник между клиентом и сервером.\n\nForward proxy (прямой прокси) — скрывает клиента от сервера.\nReverse proxy (обратный прокси) — скрывает сервер от клиента.\n\nФразы:\n- reverse proxy server\n- to proxy requests to the backend\n- SSL termination (завершение SSL на прокси)\n- to sit in front of the application server\n\nExamples:\n1. "Nginx is configured as a reverse proxy in front of our Node.js application."\n2. "The reverse proxy handles SSL termination and forwards plain HTTP to the backend."\n3. "We use Nginx as a reverse proxy to serve multiple applications on one server."\n4. "The forward proxy allows employees to access the internet through the corporate network."'
        }
      ]
    },
    {
      id: 5,
      title: 'Endpoint, Payload, Request/Response',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'ENDPOINT (эндпоинт) — конкретный URL или точка доступа к API.\n\nФразы:\n- to expose an endpoint (открыть эндпоинт)\n- REST endpoint\n- to hit an endpoint (обратиться к эндпоинту)\n- to call an endpoint\n- deprecated endpoint (устаревший эндпоинт)\n- protected endpoint (защищённый)\n\nExamples:\n1. "The /users endpoint returns a list of all registered users."\n2. "We added a new endpoint to handle file uploads."\n3. "This endpoint requires authentication via a Bearer token."\n4. "The /health endpoint is used by the load balancer for health checks."\n5. "We deprecated the v1 endpoint and replaced it with v2."\n\nPAYLOAD (полезная нагрузка) — тело запроса или ответа, содержащее данные.\n\nФразы:\n- request payload / response payload\n- to parse the payload\n- to validate the payload\n- JSON payload\n- payload size (размер полезной нагрузки)\n\nExamples:\n1. "The request payload contains the user\'s registration data in JSON format."\n2. "We validate the payload against the JSON schema before processing."\n3. "The response payload includes the created resource with its ID."\n4. "Large payloads can slow down API responses — consider pagination."\n5. "The webhook payload contains information about the event that triggered it."'
        },
        {
          type: 'text',
          value: 'Связанные термины для полноты картины:\n\nSCHEMA (схема) — структура данных или база данных:\n1. "The JSON schema defines the expected structure of the request payload."\n2. "The database schema was updated to support multi-tenancy."\n\nCONTRACT (контракт) — соглашение об интерфейсе:\n1. "We use contract testing to verify that our services integrate correctly."\n2. "Breaking changes to the API contract require a version bump."\n\nSERIALIZATION / DESERIALIZATION:\n1. "The object is serialized to JSON before being sent over the network."\n2. "The response is deserialized into a User object."\n\nIDEMPOTENT (идемпотентный) — повторный запрос даёт тот же результат:\n1. "GET and PUT requests should be idempotent."\n2. "We made the payment API idempotent to handle network retries safely."'
        }
      ]
    },
    {
      id: 6,
      title: 'Scalability, Availability, Reliability',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'SCALABILITY (масштабируемость) — способность системы расти с нагрузкой.\n\nHorizontal scaling (горизонтальное масштабирование) — добавить больше серверов.\nVertical scaling (вертикальное масштабирование) — добавить ресурсы одному серверу.\n\nФразы:\n- to scale horizontally / vertically\n- to handle increased load\n- elastic scaling (автоматическое масштабирование)\n- to scale out / scale in\n- bottleneck (узкое место)\n\nExamples:\n1. "We scale horizontally by adding more application server instances."\n2. "The database became a bottleneck — we need to shard it."\n3. "AWS Auto Scaling handles elastic scaling based on CPU usage."\n4. "Vertical scaling has limits; horizontal scaling is theoretically unlimited."\n\nAVAILABILITY (доступность) — насколько часто система работает.\nReliability (надёжность) — насколько корректно система выполняет функции.\n\nФразы:\n- uptime / downtime\n- SLA (Service Level Agreement) — соглашение об уровне сервиса\n- 99.9% availability = "three nines"\n- fault tolerance (отказоустойчивость)\n- single point of failure (единая точка отказа)\n\nExamples:\n1. "Our SLA guarantees 99.95% uptime."\n2. "The system has no single point of failure — it is fully redundant."\n3. "We achieved fault tolerance by running three replicas of each service."\n4. "Last month\'s downtime cost us $50,000 in SLA penalties."'
        }
      ]
    },
    {
      id: 7,
      title: 'Talking about Architecture: фразы для собеседования',
      type: 'practice',
      content: [
        {
          type: 'text',
          value: 'Ключевые фразы для архитектурных дискуссий:\n\n"The architecture consists of..." — Архитектура состоит из...\n"The system is designed to..." — Система разработана для...\n"Each service is responsible for..." — Каждый сервис отвечает за...\n"Communication between services happens via..." — Взаимодействие между сервисами происходит через...\n"Data flows from... to..." — Данные передаются из... в...\n"In case of failure, the system..." — В случае сбоя система...\n"The bottleneck in this design is..." — Узкое место в этом дизайне — ...\n"The main trade-off here is..." — Основной компромисс здесь — ...\n"We chose this approach because..." — Мы выбрали этот подход, потому что...'
        },
        {
          type: 'text',
          value: 'Опишите архитектуру системы, используя термины из этого модуля:\n\nПример описания системы для e-commerce:\n\n"Our e-commerce platform uses a microservices architecture. The system consists of several independently deployable services: the user service, product catalog, order service, and payment service.\n\nAll client requests first hit the API gateway, which handles authentication and routes requests to the appropriate microservice. Static assets like images are served via a CDN to reduce latency.\n\nThe services communicate asynchronously using a message queue. For example, when an order is placed, the order service publishes an event to the queue. The payment service and notification service both consume this event.\n\nWe use Redis as a cache layer to reduce database load. A load balancer distributes traffic across multiple instances of each service, ensuring high availability. The entire system is designed with no single point of failure and achieves 99.95% uptime as per our SLA."'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: технические определения',
      type: 'practice',
      content: [
        {
          type: 'text',
          value: 'Определите термин по описанию:\n\n1. "A component that distributes incoming network traffic across multiple servers."\n→ Load balancer\n\n2. "A software layer that stores frequently accessed data to reduce response time."\n→ Cache\n\n3. "A specific URL path that a client can call to interact with an API."\n→ Endpoint\n\n4. "The data contained in the body of an HTTP request or response."\n→ Payload\n\n5. "An architectural style where an application is built as a collection of small, independent services."\n→ Microservices (architecture)\n\n6. "Software that acts as an intermediary between different applications or components."\n→ Middleware\n\n7. "An architectural pattern where services communicate by producing and consuming events."\n→ Event-driven architecture\n\n8. "The ability of a system to handle increased load by adding more resources."\n→ Scalability'
        },
        {
          type: 'text',
          value: 'Заполните пропуски в техническом тексте:\n\n"Our system uses a _____ (1) to distribute traffic across ten application servers. User sessions are stored in a _____ (2) to reduce database queries. When a user places an order, the request is validated by the _____ (3) before being processed. The order data is then added to a message _____ (4) for asynchronous processing. Our _____ (5) architecture allows each team to deploy their service independently."\n\n→ 1: load balancer\n→ 2: cache (Redis)\n→ 3: middleware\n→ 4: queue\n→ 5: microservices'
        }
      ]
    }
  ]
}
