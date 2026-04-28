export default {
  id: 23,
  title: 'Документирование архитектуры',
  description: 'Architecture Decision Records (ADR), модель C4, arc42, документация как код и визуализация архитектуры.',
  lessons: [
    {
      id: 1,
      title: 'Зачем документировать архитектуру',
      type: 'theory',
      content: [
        { type: 'text', value: 'Архитектурная документация фиксирует ключевые решения, их обоснование и контекст. Без неё новый разработчик не понимает, ПОЧЕМУ система устроена именно так.' },
        { type: 'heading', value: 'Проблемы без документации' },
        { type: 'list', value: [
          'Новый разработчик тратит недели на понимание архитектуры',
          'Решения переизобретаются — никто не помнит, почему выбрали PostgreSQL',
          'Нет общего понимания — каждый видит систему по-своему',
          'Архитектурные правила нарушаются — никто не знает о них'
        ]},
        { type: 'heading', value: 'Что документировать' },
        { type: 'list', value: [
          'Архитектурные решения (ADR) — какие решения приняты и почему',
          'Высокоуровневый дизайн (C4) — как устроена система визуально',
          'Принципы и правила — конвенции и ограничения',
          'Глоссарий — ubiquitous language',
          'Контексты и границы — bounded contexts'
        ]},
        { type: 'tip', value: 'Документация должна быть живой: рядом с кодом (в репозитории), актуальной (обновляется с кодом) и минимальной (только важное). Устаревшая документация хуже, чем отсутствующая.' }
      ]
    },
    {
      id: 2,
      title: 'Architecture Decision Records (ADR)',
      type: 'theory',
      content: [
        { type: 'text', value: 'ADR (Architecture Decision Record) — документ, фиксирующий одно архитектурное решение: контекст, решение, последствия. ADR хранятся в репозитории рядом с кодом.' },
        { type: 'heading', value: 'Формат ADR' },
        { type: 'code', language: 'java', value: '# ADR-001: Использование PostgreSQL в качестве основной БД\n\n## Статус\nПринято (2025-01-15)\n\n## Контекст\nНам нужна реляционная БД для хранения заказов, пользователей и продуктов.\nТребования: ACID-транзакции, полнотекстовый поиск, JSON-поддержка.\nРассмотрены: PostgreSQL, MySQL, MongoDB.\n\n## Решение\nВыбираем PostgreSQL.\n- JSONB для гибких структур (атрибуты продуктов)\n- Полнотекстовый поиск из коробки\n- Лучшая поддержка сложных запросов\n- Зрелая экосистема и комьюнити\n\n## Последствия\n- (+) Мощные аналитические запросы\n- (+) Не нужен отдельный Elasticsearch для простого поиска\n- (-) Сложнее горизонтальное масштабирование, чем у MongoDB\n- (-) Команда имеет больше опыта с MySQL (нужно обучение)\n\n## Альтернативы\n- MySQL: проще, но нет JSONB и полнотекстового поиска\n- MongoDB: гибкая схема, но нет ACID и JOIN' },
        { type: 'heading', value: 'Структура ADR в проекте' },
        { type: 'code', language: 'java', value: 'docs/\n└── adr/\n    ├── ADR-001-postgresql-as-main-db.md\n    ├── ADR-002-clean-architecture.md\n    ├── ADR-003-kafka-for-events.md\n    ├── ADR-004-modular-monolith.md\n    └── ADR-005-jwt-authentication.md' },
        { type: 'note', value: 'ADR — один из самых ценных типов документации. Через год вы не вспомните, почему выбрали Kafka вместо RabbitMQ. ADR сохраняет контекст решения навсегда.' }
      ]
    },
    {
      id: 3,
      title: 'Модель C4: визуализация архитектуры',
      type: 'theory',
      content: [
        { type: 'text', value: 'C4 Model (Саймон Браун) — способ визуализации архитектуры на 4 уровнях детализации: Context → Container → Component → Code.' },
        { type: 'heading', value: '4 уровня C4' },
        { type: 'list', value: [
          'Level 1: System Context — система в окружении пользователей и внешних систем',
          'Level 2: Container — технические "контейнеры" внутри системы (веб-приложение, БД, API)',
          'Level 3: Component — компоненты внутри контейнера (модули, слои)',
          'Level 4: Code — классы и интерфейсы (обычно автогенерируемые, редко рисуют вручную)'
        ]},
        { type: 'heading', value: 'Пример Level 1: System Context' },
        { type: 'code', language: 'java', value: '// System Context диаграмма (текстовое описание)\n//\n// [Покупатель] ---(использует)---> [Интернет-магазин]\n// [Менеджер]   ---(управляет)---> [Интернет-магазин]\n// [Интернет-магазин] ---(отправляет email)---> [Email-сервис (SendGrid)]\n// [Интернет-магазин] ---(принимает платежи)---> [Платёжная система (Stripe)]\n// [Интернет-магазин] ---(доставка)---> [Служба доставки (СДЭК API)]' },
        { type: 'heading', value: 'Пример Level 2: Container' },
        { type: 'code', language: 'java', value: '// Container диаграмма\n//\n// [SPA (React)] ---(API calls)---> [API Server (Spring Boot)]\n// [Admin Panel (React)] ---(API calls)---> [API Server]\n// [API Server] ---(reads/writes)---> [PostgreSQL]\n// [API Server] ---(publishes events)---> [Kafka]\n// [Background Worker (Java)] ---(consumes events)---> [Kafka]\n// [Background Worker] ---(sends email)---> [SendGrid]' },
        { type: 'heading', value: 'Пример Level 3: Component' },
        { type: 'code', language: 'java', value: '// Component диаграмма (внутри API Server)\n//\n// [OrderController] ---> [PlaceOrderUseCase]\n// [PlaceOrderUseCase] ---> [OrderRepository] (interface)\n// [PlaceOrderUseCase] ---> [PaymentGateway] (interface)\n// [JpaOrderRepository] ---|> [OrderRepository]\n// [StripeGateway] ---|> [PaymentGateway]' },
        { type: 'tip', value: 'C4 — это не UML! Это простые box-and-arrow диаграммы, понятные даже нетехническим людям. Инструменты: draw.io, Mermaid, PlantUML, Structurizr.' }
      ]
    },
    {
      id: 4,
      title: 'arc42: шаблон документации',
      type: 'theory',
      content: [
        { type: 'text', value: 'arc42 — шаблон для документирования архитектуры ПО. Содержит 12 разделов, покрывающих все аспекты архитектуры.' },
        { type: 'heading', value: '12 разделов arc42' },
        { type: 'list', value: [
          '1. Introduction and Goals — цели, стейкхолдеры, качественные требования',
          '2. Constraints — технические и организационные ограничения',
          '3. Context and Scope — границы системы, внешние системы',
          '4. Solution Strategy — ключевые архитектурные решения',
          '5. Building Block View — структура модулей/компонентов',
          '6. Runtime View — сценарии взаимодействия (sequence diagrams)',
          '7. Deployment View — инфраструктура, серверы, контейнеры',
          '8. Cross-cutting Concepts — общие концепции (безопасность, логирование)',
          '9. Architecture Decisions — ADR',
          '10. Quality Requirements — нефункциональные требования',
          '11. Risks and Technical Debt — известные риски',
          '12. Glossary — глоссарий терминов'
        ]},
        { type: 'heading', value: 'Не обязательно заполнять всё' },
        { type: 'text', value: 'arc42 — это шаблон, не чеклист. Заполняйте только актуальные разделы. Для маленького проекта достаточно: Goals, Context, Solution Strategy, ADR, Glossary.' },
        { type: 'note', value: 'arc42 и C4 отлично дополняют друг друга: arc42 — текстовая структура, C4 — визуальные диаграммы. Используйте C4-диаграммы внутри разделов arc42.' }
      ]
    },
    {
      id: 5,
      title: 'Документация как код',
      type: 'theory',
      content: [
        { type: 'text', value: 'Documentation as Code — подход, при котором документация хранится в репозитории, версионируется вместе с кодом и генерируется автоматически.' },
        { type: 'heading', value: 'Инструменты' },
        { type: 'list', value: [
          'Markdown — простой формат для ADR и текстов',
          'Mermaid — диаграммы в коде (поддерживается GitHub, GitLab)',
          'PlantUML — UML-диаграммы из текстового описания',
          'Structurizr — C4-диаграммы как код (DSL)',
          'OpenAPI/Swagger — документация REST API из аннотаций кода',
          'TypeDoc/JavaDoc — документация API из комментариев'
        ]},
        { type: 'code', language: 'java', value: '// Mermaid: диаграмма последовательности (прямо в Markdown)\n// ```mermaid\n// sequenceDiagram\n//     participant Client\n//     participant Controller\n//     participant UseCase\n//     participant Repository\n//     participant DB\n//     \n//     Client->>Controller: POST /api/orders\n//     Controller->>UseCase: execute(command)\n//     UseCase->>Repository: save(order)\n//     Repository->>DB: INSERT INTO orders\n//     DB-->>Repository: OK\n//     Repository-->>UseCase: saved\n//     UseCase-->>Controller: OrderDto\n//     Controller-->>Client: 201 Created\n// ```' },
        { type: 'code', language: 'java', value: '// Structurizr DSL: C4 как код\nworkspace {\n    model {\n        customer = person "Покупатель"\n        shop = softwareSystem "Интернет-магазин" {\n            spa = container "SPA" "React" "Web Browser"\n            api = container "API" "Spring Boot" "Java"\n            db = container "Database" "PostgreSQL"\n        }\n        stripe = softwareSystem "Stripe" "Платёжная система"\n        \n        customer -> spa "Использует"\n        spa -> api "REST API"\n        api -> db "Reads/Writes"\n        api -> stripe "Платежи"\n    }\n    views {\n        systemContext shop {\n            include *\n            autolayout lr\n        }\n    }\n}' },
        { type: 'tip', value: 'Документация рядом с кодом обновляется чаще. ADR в docs/adr/, OpenAPI генерируется из аннотаций, Mermaid-диаграммы в README. Всё проверяется на PR.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: документирование архитектуры',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте архитектурную документацию для системы доставки еды: ADR, C4-диаграммы, глоссарий.',
      requirements: [
        'Написать 3 ADR: выбор БД, выбор архитектуры, выбор message broker',
        'Создать C4 Level 1 (System Context) диаграмму',
        'Создать C4 Level 2 (Container) диаграмму',
        'Написать глоссарий (минимум 10 терминов)',
        'Определить качественные требования (availability, latency)'
      ],
      hint: 'System Context: Клиент, Ресторан, Курьер → Система доставки → Платёжная система, Геосервис. Containers: Mobile App, API, Order Service, Delivery Service, PostgreSQL, Redis, Kafka.',
      expectedOutput: 'Полная документация: 3 ADR с обоснованием решений, C4 Level 1 и 2 диаграммы, глоссарий, требования к качеству.',
      solution: '// ADR-001: PostgreSQL для основного хранилища\n// Статус: Принято\n// Контекст: Нужна ACID-совместимая БД для заказов и финансовых транзакций.\n// Решение: PostgreSQL — ACID, PostGIS для геолокации, JSONB.\n// Последствия: (+) PostGIS для расчёта расстояний, (-) сложнее масштабирование.\n\n// ADR-002: Модульный монолит\n// Контекст: Команда из 5 человек, MVP за 3 месяца.\n// Решение: Модульный монолит с модулями Ordering, Delivery, Payment.\n// Последствия: (+) быстрый старт, (-) масштабирование модулей вместе.\n\n// ADR-003: Kafka для событий\n// Контекст: Заказ проходит через 5+ этапов, нужна асинхронная координация.\n// Решение: Apache Kafka для Domain Events между модулями.\n// Последствия: (+) масштабируемость, replay, (-) сложность ops.\n\n// C4 Level 1: System Context\n// [Клиент] → [Система доставки]\n// [Ресторан] → [Система доставки]\n// [Курьер] → [Система доставки]\n// [Система доставки] → [Stripe] (платежи)\n// [Система доставки] → [Google Maps API] (маршруты)\n// [Система доставки] → [Firebase] (push-уведомления)\n\n// C4 Level 2: Containers\n// [Mobile App (React Native)] → [API Gateway (Nginx)]\n// [Restaurant App (React)] → [API Gateway]\n// [API Gateway] → [Order Service (Spring Boot)]\n// [API Gateway] → [Delivery Service (Spring Boot)]\n// [Order Service] → [PostgreSQL]\n// [Order Service] → [Kafka]\n// [Delivery Service] → [Kafka]\n// [Delivery Service] → [Redis] (кеш локаций курьеров)\n// [Notification Worker] → [Kafka] (consumer)\n// [Notification Worker] → [Firebase]\n\n// Глоссарий:\n// Заказ (Order) — запрос клиента на доставку блюд\n// Ресторан (Restaurant) — точка приготовления еды\n// Курьер (Courier) — исполнитель доставки\n// Маршрут (Route) — путь от ресторана до клиента\n// ETA — Estimated Time of Arrival, расчётное время доставки\n// Зона доставки (Delivery Zone) — область, обслуживаемая рестораном\n// Рейтинг (Rating) — оценка заказа клиентом (1-5)\n// Промокод (Promo Code) — код для скидки\n// Чаевые (Tips) — добровольная доплата курьеру\n// Статус заказа (Order Status) — этап выполнения заказа\n\n// Качественные требования:\n// Availability: 99.9% (< 9 часов простоя в год)\n// Latency: API ответ < 200ms (p95)\n// Throughput: 1000 заказов/мин в пиковые часы\n// Delivery ETA accuracy: ±5 минут',
      explanation: 'ADR фиксируют ключевые решения с контекстом и обоснованием. C4 Level 1 показывает систему в окружении (кто использует, с чем интегрируется). C4 Level 2 показывает внутреннюю структуру (какие сервисы, БД, очереди). Глоссарий определяет ubiquitous language. Качественные требования задают SLA.'
    }
  ]
}
