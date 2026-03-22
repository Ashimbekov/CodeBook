export default {
  id: 11,
  title: 'Микросервисы vs Монолит',
  description: 'Монолитная и микросервисная архитектуры: trade-offs, паттерны Saga и CQRS, Event Sourcing, Service Mesh, когда переходить на микросервисы.',
  lessons: [
    {
      id: 1,
      title: 'Монолитная архитектура: плюсы и минусы',
      type: 'theory',
      description: 'Монолит: один деплой, одна БД. Модульный монолит vs Big Ball of Mud. Плюсы: скорость разработки, ACID, простота. Минусы при росте: масштабирование целиком, рискованный деплой.',
      solution: 'Монолит плюсы: один деплой, вызов функции (~1нс vs сеть ~1мс), ACID транзакции, простая отладка, дешевле инфра. Минусы при 50+ разработчиках: масштабировать только всё целиком, деплой рискован для всего, команды мешают друг другу. Правило: Monolith-first (Фаулер). Amazon/Netflix/Uber — начинали с монолита.',
      content: [
        { type: 'text', value: 'Монолит — приложение, где все компоненты развёртываются вместе как единый артефакт. Это не "плохо" — это первый правильный шаг для большинства систем.' },
        { type: 'heading', value: 'Типы монолитов' },
        { type: 'text', value: 'Традиционный монолит (Big Ball of Mud):\n  Всё перемешано, зависимости везде, невозможно менять без страха.\n\nМодульный монолит (правильный подход):\n  Один деплой, но чёткие внутренние модули с явными интерфейсами:\n  [OrderModule] [UserModule] [PaymentModule] [NotificationModule]\n  Модули общаются через интерфейсы, не напрямую через БД.' },
        { type: 'heading', value: 'Плюсы монолита' },
        { type: 'list', value: [
          'Просто: один деплой, одна БД, один процесс',
          'Быстрая разработка на старте',
          'Нет сетевых вызовов между компонентами (вызов функции = 1 нс vs 1 мс по сети)',
          'Транзакции: ACID между всеми компонентами',
          'Отладка проще: один стектрейс',
          'Инфраструктура проще и дешевле'
        ]},
        { type: 'heading', value: 'Минусы монолита при росте' },
        { type: 'list', value: [
          'Масштабировать можно только всё целиком (нельзя только один компонент)',
          'Деплой рискован: изменение в одном модуле может сломать всё',
          'Команды мешают друг другу в общем коде',
          'Технологический стек один для всего',
          'Сборка и тесты замедляются с ростом кода'
        ]},
        { type: 'tip', value: 'Amazon, Netflix, Uber — все начали с монолита. Переходить на микросервисы до появления реальных проблем — преждевременная оптимизация. Правило: "Monolith-first" (Мартин Фаулер).' }
      ]
    },
    {
      id: 2,
      title: 'Микросервисная архитектура',
      type: 'theory',
      description: 'Микросервисы: Single Responsibility, Independent deployment, Database per Service, Loose coupling. Плюсы: независимое масштабирование и деплой. Минусы: distributed systems сложность.',
      solution: 'Принципы: каждый сервис — своя БД (нет shared DB), деплоится независимо. Плюсы: масштабировать видео отдельно от профилей, технологический выбор, 2-pizza team. Минусы: latency сетевых вызовов, сложная отладка (10 сервисов), операционный overhead, ACID невозможен. Применять при: команда > 15–20 человек, разные нагрузки на компоненты.',
      content: [
        { type: 'text', value: 'Микросервисы — архитектурный стиль: приложение разбито на небольшие, независимо развёртываемые сервисы, каждый отвечает за одну бизнес-функцию.' },
        { type: 'heading', value: 'Принципы микросервисов' },
        { type: 'list', value: [
          'Single Responsibility: каждый сервис делает одно дело хорошо',
          'Independent deployment: каждый сервис деплоится независимо',
          'Own data store: каждый сервис имеет свою БД (нет shared DB)',
          'Loose coupling: минимальные зависимости между сервисами',
          'High cohesion: связанная функциональность в одном сервисе'
        ]},
        { type: 'heading', value: 'Плюсы микросервисов' },
        { type: 'list', value: [
          'Независимое масштабирование: видео-сервис масштабировать отдельно от профилей',
          'Независимый деплой: команды деплоят без координации',
          'Изоляция отказов: падение одного сервиса не роняет всё',
          'Технологический выбор: разные сервисы на разных языках/БД',
          'Маленькие команды: 2 pizza rule (Amazon)'
        ]},
        { type: 'heading', value: 'Минусы и сложности' },
        { type: 'list', value: [
          'Distributed systems: latency, partial failures, eventual consistency',
          'Сложная отладка: трассировка запроса через 10 сервисов',
          'Операционная сложность: тысячи контейнеров, service discovery',
          'Распределённые транзакции: ACID невозможны',
          'Тестирование: сложнее интеграционное тестирование',
          'Overhead: сетевые вызовы вместо вызовов функций'
        ]}
      ]
    },
    {
      id: 3,
      title: 'Паттерн Saga: распределённые транзакции',
      type: 'theory',
      description: 'Saga: серия компенсирующих транзакций вместо distributed ACID. Choreography (события, нет координатора) vs Orchestration (центральный Orchestrator управляет шагами).',
      solution: 'Saga шаги: Order→Payment→Inventory→Delivery. При сбое Inventory: компенсация → Payment refund → Order CANCELLED. Choreography: каждый сервис реагирует на события, слабая связь, сложно отследить весь поток. Orchestration: Saga Orchestrator управляет явно, легче мониторить. Netflix Conductor, Uber Cadence.',
      content: [
        { type: 'text', value: 'В микросервисах нельзя использовать ACID транзакции между сервисами. Saga — паттерн для обеспечения согласованности через серию компенсирующих транзакций.' },
        { type: 'heading', value: 'Пример: оформление заказа' },
        { type: 'text', value: 'Шаги:\n1. Order Service: создать заказ (status=PENDING)\n2. Payment Service: списать деньги\n3. Inventory Service: зарезервировать товар\n4. Delivery Service: создать заявку на доставку\n5. Order Service: обновить статус (status=CONFIRMED)\n\nЕсли шаг 3 (резервирование) провалился:\nКомпенсирующие транзакции (rollback в обратном порядке):\n- Payment Service: вернуть деньги (reverse payment)\n- Order Service: отменить заказ (status=CANCELLED)' },
        { type: 'heading', value: 'Два подхода к Saga' },
        { type: 'text', value: 'Choreography (хореография):\n  Каждый сервис реагирует на события. Нет центрального координатора.\n  Event: order_created → Payment Service обрабатывает\n  Event: payment_done → Inventory Service обрабатывает\n  Плюс: простота, слабая связанность\n  Минус: сложно отслеживать весь поток, риск циклических зависимостей\n\nOrchestration (оркестрация):\n  Центральный Saga Orchestrator управляет шагами.\n  Orchestrator → "reserve inventory" → Inventory Service\n  Orchestrator ← "reserved" ← Inventory Service\n  Orchestrator → "charge payment" → Payment Service\n  Плюс: явный контроль, легко отслеживать состояние\n  Минус: Orchestrator = central point of logic' },
        { type: 'note', value: 'Netflix использует Conductor (orchestration framework) для Saga паттерна. Uber использует Cadence. Это сложная но решённая задача — используйте готовые фреймворки.' }
      ]
    },
    {
      id: 4,
      title: 'CQRS: разделение чтения и записи',
      type: 'theory',
      description: 'CQRS: Write Model (нормализованная БД) + Read Model (денормализованный документ без JOIN). Event Sourcing: хранить историю событий вместо текущего состояния + replay.',
      solution: 'CQRS: Write → PostgreSQL (нормализованно), событие → Read DB (Elasticsearch/Redis/Cassandra денормализованно). Чтение без JOIN → быстро. Event Sourcing: [account_opened:1000, withdrawal:200, deposit:100] → replay = баланс 900. Плюсы: полная история, time-travel, debug. Минус: сложность, нужны snapshots.',
      content: [
        { type: 'text', value: 'CQRS (Command Query Responsibility Segregation) — паттерн: разделить операции изменения данных (Commands) и операции чтения (Queries) на разные модели/сервисы.' },
        { type: 'heading', value: 'Почему разделять' },
        { type: 'text', value: 'Проблема: модель данных, оптимальная для записи, часто неоптимальна для чтения.\n\nПример: социальная сеть\n  Запись (Write Model): нормализованная реляционная схема, ACID\n  Чтение (Read Model): денормализованный документ с постом, автором, лайками, топ-комментариями — всё в одном документе\n\nЗапись происходит в Write DB (PostgreSQL).\nСобытие обновления реплицируется в Read DB (Elasticsearch, Cassandra, Redis).\nЧтение — из Read DB: быстро, без JOIN.' },
        { type: 'heading', value: 'CQRS + Event Sourcing' },
        { type: 'text', value: 'Event Sourcing: хранить не текущее состояние, а историю всех событий.\n\nОбычно: { id: 1, balance: 500 }\nEvent Sourcing: [\n  { event: "account_opened", amount: 1000 },\n  { event: "withdrawal", amount: 200 },\n  { event: "deposit", amount: 100 },\n  { event: "withdrawal", amount: 400 }\n]\n\nТекущий баланс = replay всех событий = 1000 - 200 + 100 - 400 = 500\n\nПлюсы: полная история, debug, time-travel (посмотреть состояние в любой момент)\nМинусы: сложность, медленное чтение текущего состояния (нужны snapshots)' },
        { type: 'tip', value: 'CQRS не обязательно требует Event Sourcing — это два независимых паттерна, которые хорошо работают вместе. Начните с CQRS (разные модели чтения/записи), Event Sourcing добавляйте только при необходимости.' }
      ]
    },
    {
      id: 5,
      title: 'Service Mesh и API Gateway',
      type: 'theory',
      description: 'API Gateway: единая точка входа, роутинг, JWT проверка, rate limiting, SSL termination. Service Mesh (Istio): Sidecar Envoy прокси, mTLS, distributed tracing, circuit breaker.',
      solution: 'API Gateway (Kong/Nginx): /users/* → User Service, проверить JWT → X-User-ID. Service Mesh: [Service]+[Envoy Sidecar] ↔ [Envoy]+[Service] → mTLS + tracing + metrics + CB автоматически. Service Mesh: только при 50+ микросервисов. До этого — library в каждом сервисе.',
      content: [
        { type: 'text', value: 'При десятках микросервисов cross-cutting concerns (аутентификация, логирование, трассировка) нельзя дублировать в каждом сервисе.' },
        { type: 'heading', value: 'API Gateway' },
        { type: 'text', value: 'API Gateway — единая точка входа для внешних запросов.\n\nФункции API Gateway:\n- Роутинг: /api/users/* → User Service, /api/orders/* → Order Service\n- Аутентификация: проверить JWT один раз, пробросить user_id\n- Rate Limiting: защита от перегрузки\n- SSL Termination\n- Request/Response трансформация\n- API Composition: объединить ответы нескольких сервисов\n\nПримеры: AWS API Gateway, Kong, Nginx, Envoy' },
        { type: 'heading', value: 'Service Mesh (Istio, Linkerd)' },
        { type: 'text', value: 'Service Mesh — инфраструктурный слой для управления service-to-service коммуникацией.\n\nSidecar Pattern: рядом с каждым сервисом деплоится прокси (Envoy):\n  [Service A] + [Envoy Proxy A] ↔ [Envoy Proxy B] + [Service B]\n\nEnvoy перехватывает весь трафик и обеспечивает:\n- Mutual TLS (шифрование между сервисами)\n- Трассировка запросов (distributed tracing)\n- Метрики (латентность, ошибки)\n- Circuit Breaker\n- Load Balancing' },
        { type: 'note', value: 'Service Mesh — сложная технология. Используйте только если у вас много микросервисов (50+) и реальные потребности в cross-cutting concerns. Для начала достаточно хорошей библиотеки (circuit breaker, retry) в каждом сервисе.' }
      ]
    },
    {
      id: 6,
      title: 'Когда переходить от монолита к микросервисам',
      type: 'theory',
      description: 'Признаки пора переходить: деплой часами, команды > 15–20 чел, разные ресурсы. Рано: < 10 чел, нет CI/CD, нет тестов. Стратегия Strangler Fig: постепенное выделение сервисов.',
      solution: 'Переходить при: деплой часы, команды > 15-20 мешают, нужно масштабировать части отдельно. НЕ переходить: < 10 чел, нет CI/CD, нет тестов, нет product-market fit, "потому что модно". Strangler Fig: новый функционал → сразу микросервис, постепенно выделять из монолита, монолит "усыхает" за 1–2 года.',
      content: [
        { type: 'text', value: 'Переход на микросервисы — большое решение. Не делайте это без реальных причин.' },
        { type: 'heading', value: 'Признаки, что пора переходить' },
        { type: 'list', value: [
          'Деплой занимает часы и требует координации всей команды',
          'Разные компоненты требуют кардинально разных ресурсов (CPU vs RAM)',
          'Команды > 15–20 человек мешают друг другу',
          'Один компонент тормозит весь монолит (нужно масштабировать отдельно)',
          'Части системы требуют разных технологий',
          'Хотите независимые релизные циклы для разных частей'
        ]},
        { type: 'heading', value: 'Признаки, что рано переходить' },
        { type: 'list', value: [
          'Команда < 10 человек',
          'Продукт ещё не нашёл product-market fit',
          'Нет автоматизированных тестов',
          'Нет CI/CD пайплайна',
          'Нет опыта эксплуатации distributed систем',
          '"Потому что модно" или "Google так делает"'
        ]},
        { type: 'heading', value: 'Стратегия Strangler Fig' },
        { type: 'text', value: 'Не переписывайте монолит с нуля! Используйте Strangler Fig:\n1. Новый функционал — сразу в новый микросервис\n2. Постепенно выделяйте модули из монолита в сервисы\n3. Монолит "усыхает" со временем\n4. Через год-два монолит исчез\n\nТак переходили Amazon, eBay, Netflix.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: декомпозиция монолита',
      type: 'practice',
      description: 'Практика декомпозиции e-commerce монолита (50 разработчиков) на 6 микросервисов с Strangler Fig: порядок выделения, Database per Service, gRPC+Kafka, API Gateway.',
      requirements: [
        'Определить сервисы по бизнес-доменам',
        'Назначить каждому сервису собственную базу данных',
        'Описать синхронное и асинхронное взаимодействие между сервисами',
        'Предложить порядок выделения сервисов (от независимых к зависимым)',
        'Описать роль API Gateway в архитектуре'
      ],
      hint: 'Начни с наиболее независимых сервисов — тех, которые только потребляют события и ни от кого не требуют данных в реальном времени. Применяй Strangler Fig: выделяй сервисы постепенно, не переписывай всё сразу.',
      expectedOutput: 'Монолит декомпозирован: выделены 5–7 сервисов с чёткими бизнес-доменами. Каждый сервис имеет свою БД. Описана коммуникация (gRPC синхронно, Kafka асинхронно). Предложен порядок выделения сервисов. API Gateway централизует аутентификацию.',
      solution: 'Декомпозиция e-commerce монолита на микросервисы (Strangler Fig pattern):\n\nВыделяемые сервисы:\n- User Service: аутентификация, профили → PostgreSQL (users)\n- Product Catalog Service: каталог, поиск → PostgreSQL + Elasticsearch\n- Order Service: заказы, история → PostgreSQL (orders)\n- Payment Service: платежи → PostgreSQL (строгий ACID)\n- Notification Service: email/SMS/push → stateless, Kafka consumer\n- Analytics Service: события, статистика → ClickHouse (OLAP)\n\nКоммуникация:\n- Синхронная (gRPC): User Service → получить профиль (< 5 мс)\n- Асинхронная (Kafka): "order_created" → Payment + Notification + Analytics\n\nAPI Gateway (Kong): внешний трафик → роутинг + JWT проверка → X-User-ID в заголовке\n\nПорядок выделения: сначала Notification и Analytics (независимы, только читают события), затем Product Catalog (read-heavy, отдельно масштабируется), затем Payment (изоляция финансов).',
      explanation: 'Strangler Fig: не переписывать с нуля, а постепенно выделять сервисы из монолита. Сначала — наименее связанные. Notification Service идеален: только потребляет события, ничего не требует от других сервисов. Каждый сервис — своя БД (Database per Service). API Gateway централизует аутентификацию — сервисы доверяют заголовку от Gateway.',
      content: [
        { type: 'text', value: 'Разберём, как декомпозировать монолит e-commerce на микросервисы.' },
        { type: 'heading', value: 'Исходный монолит' },
        { type: 'text', value: 'Один большой сервис: Auth + Users + Products + Orders + Payments + Notifications + Analytics\nОдна БД PostgreSQL\n50 разработчиков в команде\nПроблемы: деплой 3 часа, мешают друг другу, не можем масштабировать отдельно' },
        { type: 'heading', value: 'Шаг 1: Выделить по бизнес-доменам' },
        { type: 'text', value: 'User Service: регистрация, аутентификация, профиль\n  БД: PostgreSQL (users)\n\nProduct Catalog Service: каталог товаров, поиск\n  БД: PostgreSQL + Elasticsearch для поиска\n\nOrder Service: заказы, история\n  БД: PostgreSQL (orders)\n\nPayment Service: обработка платежей\n  БД: PostgreSQL (payments) — строгий ACID\n\nNotification Service: email, SMS, push\n  Очередь: Kafka consumer\n  БД: не нужна постоянная (stateless)\n\nAnalytics Service: события, статистика\n  БД: ClickHouse или BigQuery (OLAP)' },
        { type: 'heading', value: 'Коммуникация между сервисами' },
        { type: 'text', value: 'Синхронная (gRPC): User Service → Get user profile\nАсинхронная (Kafka events): Order created → Payment Service, Notification Service\n\nAPI Gateway (Kong): внешний трафик → роутинг по сервисам\nAuth в API Gateway: проверить JWT → добавить user_id в заголовок\nСервисы доверяют заголовку X-User-ID от Gateway' },
        { type: 'tip', value: 'Первым делом выделите те сервисы, которые наиболее независимы и наименее связаны с остальными. Notification Service и Analytics Service — идеальные кандидаты: они только читают события, ничего не требуют от других сервисов.' }
      ]
    }
  ]
}
