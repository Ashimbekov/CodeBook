export default {
  id: 1,
  title: 'Введение в микросервисы',
  description: 'Что такое микросервисная архитектура, сравнение с монолитом, преимущества и недостатки, когда применять микросервисы, принципы проектирования.',
  lessons: [
    {
      id: 1,
      title: 'Что такое микросервисы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Микросервисная архитектура — подход к разработке, при котором приложение разбивается на набор небольших, независимых сервисов. Каждый сервис решает одну бизнес-задачу, имеет собственную базу данных и может развёртываться независимо от остальных.' },
        { type: 'heading', value: 'Ключевые характеристики микросервисов' },
        { type: 'list', value: [
          'Независимый деплой — каждый сервис развёртывается отдельно',
          'Собственная база данных — нет разделяемого хранилища',
          'Единственная ответственность — один сервис решает одну задачу',
          'Слабая связанность (loose coupling) — изменения в одном сервисе не ломают другие',
          'Автономные команды — каждая команда владеет своим сервисом полностью'
        ] },
        { type: 'code', language: 'bash', value: '# Монолит: один процесс, одна кодовая база\n# [Frontend + Backend + DB] — всё в одном приложении\n\n# Микросервисы: набор независимых процессов\n# [User Service]   -> [Users DB]\n# [Order Service]  -> [Orders DB]\n# [Payment Service] -> [Payments DB]\n# [Notification Service] -> [Redis]\n#\n# Каждый сервис:\n# - Запускается отдельным процессом\n# - Имеет своё хранилище\n# - Общается через API (REST/gRPC/Events)' },
        { type: 'tip', value: 'Микросервисы — не серебряная пуля. Netflix, Amazon, Uber используют их потому что у них сотни команд и тысячи разработчиков. Для стартапа с командой из 3 человек монолит — правильный выбор на старте.' }
      ]
    },
    {
      id: 2,
      title: 'Монолит vs Микросервисы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Монолитная архитектура — приложение как единый развёртываемый артефакт. Все модули работают в одном процессе, используют общую базу данных. Микросервисы — противоположный подход, но оба имеют свои преимущества.' },
        { type: 'heading', value: 'Сравнение подходов' },
        { type: 'code', language: 'java', value: '// Монолит: все модули в одном Spring Boot приложении\n@SpringBootApplication\npublic class MonolithApplication {\n    // UserController, OrderController, PaymentController\n    // UserService, OrderService, PaymentService\n    // UserRepository, OrderRepository, PaymentRepository\n    // Общая база данных: одна схема, один datasource\n}\n\n// Микросервисы: каждый модуль — отдельное приложение\n// user-service/\n@SpringBootApplication\npublic class UserServiceApplication {\n    // Только UserController, UserService, UserRepository\n    // Своя база данных: users_db\n}\n\n// order-service/\n@SpringBootApplication\npublic class OrderServiceApplication {\n    // Только OrderController, OrderService, OrderRepository\n    // Своя база данных: orders_db\n    // Вызывает User Service через REST/gRPC\n}' },
        { type: 'list', value: [
          'Монолит: простая разработка, отладка, тестирование. Сложно масштабировать отдельные части',
          'Монолит: одна кодовая база растёт, изменения рискованны, долгий CI/CD',
          'Микросервисы: независимый деплой, масштабирование, выбор технологий',
          'Микросервисы: сложность распределённой системы, сетевые задержки, eventual consistency'
        ] },
        { type: 'warning', value: 'Переход на микросервисы увеличивает операционную сложность в 5-10 раз. Вам нужны: Service Discovery, API Gateway, Distributed Tracing, Centralized Logging, CI/CD для каждого сервиса, оркестрация (Kubernetes). Не переходите пока у вас нет этих навыков и инфраструктуры.' }
      ]
    },
    {
      id: 3,
      title: 'Преимущества и недостатки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Микросервисы решают проблемы масштабирования команд и нагрузки, но создают новые проблемы: распределённые транзакции, сетевые сбои, сложность отладки. Важно понимать trade-offs перед принятием решения.' },
        { type: 'heading', value: 'Преимущества микросервисов' },
        { type: 'list', value: [
          'Независимый деплой — обновление одного сервиса без риска для остальных',
          'Масштабирование — масштабируем только нагруженные сервисы (Order Service x10 реплик)',
          'Технологическая свобода — User Service на Java, Recommendation на Python ML',
          'Отказоустойчивость — падение одного сервиса не роняет всё приложение',
          'Автономность команд — каждая команда полностью владеет своим сервисом',
          'Быстрая доставка — маленький сервис быстрее тестировать и деплоить'
        ] },
        { type: 'heading', value: 'Недостатки микросервисов' },
        { type: 'list', value: [
          'Распределённые транзакции — нет простого ACID между сервисами',
          'Сетевые задержки — каждый вызов между сервисами это сеть',
          'Сложность отладки — запрос проходит через 5-10 сервисов',
          'Дублирование данных — каждый сервис хранит копию нужных данных',
          'Операционная сложность — нужен Kubernetes, мониторинг, Service Mesh',
          'Тестирование — интеграционные тесты между сервисами сложнее'
        ] },
        { type: 'note', value: 'Закон Конвея: структура системы повторяет структуру организации. Если у вас 3 команды — вы получите 3 больших сервиса. Микросервисы работают лучше всего когда у каждого сервиса есть отдельная команда-владелец.' }
      ]
    },
    {
      id: 4,
      title: 'Принципы проектирования микросервисов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильное проектирование микросервисов определяет успех архитектуры. Существуют проверенные принципы, которые помогают избежать распространённых ошибок.' },
        { type: 'heading', value: '12-Factor App и микросервисы' },
        { type: 'code', language: 'yaml', value: '# 12-Factor App принципы для микросервисов:\n\n# 1. Codebase — один репо на сервис (или mono-repo)\n# 2. Dependencies — явно объявлены в pom.xml/package.json\n# 3. Config — через переменные окружения\n# 4. Backing Services — БД, очереди как внешние ресурсы\n# 5. Build/Release/Run — разделение этапов\n# 6. Processes — stateless процессы\n# 7. Port Binding — сервис слушает порт\n# 8. Concurrency — масштабирование через процессы\n# 9. Disposability — быстрый старт/стоп\n# 10. Dev/Prod Parity — одинаковое окружение\n# 11. Logs — stdout/stderr, собираются централизованно\n# 12. Admin Processes — одноразовые задачи как процессы\n\n# Пример: конфигурация через env variables\n# application.yml для Spring Boot\nspring:\n  datasource:\n    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/users}\n    username: ${DB_USERNAME:postgres}\n    password: ${DB_PASSWORD:secret}\n\nserver:\n  port: ${PORT:8080}\n\nservices:\n  order-service:\n    url: ${ORDER_SERVICE_URL:http://localhost:8081}' },
        { type: 'list', value: [
          'Single Responsibility — один сервис = одна бизнес-функция',
          'Stateless — состояние в БД/кэше, не в памяти процесса',
          'API-First — сначала контракт API, потом реализация',
          'Database per Service — у каждого сервиса своя БД',
          'Smart endpoints, dumb pipes — логика в сервисах, не в шине',
          'Design for Failure — каждый вызов может упасть, нужны fallback-и'
        ] },
        { type: 'tip', value: 'Правило двух пицц Amazon: команда, которая владеет сервисом, должна быть такой маленькой, чтобы её можно было накормить двумя пиццами (5-8 человек).' }
      ]
    },
    {
      id: 5,
      title: 'Когда использовать микросервисы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Решение о переходе на микросервисы должно быть осознанным. Существуют чёткие критерии, когда микросервисы оправданы, и когда лучше остаться с монолитом.' },
        { type: 'heading', value: 'Критерии выбора архитектуры' },
        { type: 'code', language: 'bash', value: '# КОГДА МИКРОСЕРВИСЫ ОПРАВДАНЫ:\n# ✓ Команда > 20 разработчиков\n# ✓ Разные части системы имеют разную нагрузку\n# ✓ Необходим независимый деплой (10+ деплоев в день)\n# ✓ Разные технологические требования (ML на Python, API на Java)\n# ✓ Система достаточно зрелая — домен хорошо понятен\n# ✓ Есть DevOps культура и инфраструктура\n\n# КОГДА МОНОЛИТ ЛУЧШЕ:\n# ✓ Стартап — домен ещё не определён\n# ✓ Маленькая команда (1-10 человек)\n# ✓ Простая бизнес-логика\n# ✓ Нет опыта с распределёнными системами\n# ✓ Бюджет ограничен (K8s кластер стоит денег)\n# ✓ Time-to-market критичен\n\n# ПУТЬ ЭВОЛЮЦИИ:\n# 1. Modular Monolith — монолит с чёткими модулями\n# 2. Выделяем самый нагруженный модуль в сервис\n# 3. Постепенно выделяем остальные модули\n# 4. Полноценная микросервисная архитектура\n\n# "Если не можете построить модульный монолит,\n#  вы не сможете построить микросервисы" — Simon Brown' },
        { type: 'warning', value: 'Distributed Monolith — худший из двух миров. Это когда сервисы разделены, но сильно связаны: деплоятся вместе, разделяют базу данных, изменение в одном ломает другой. Это анти-паттерн, который даёт все недостатки микросервисов без их преимуществ.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Анализ архитектуры',
      type: 'practice',
      difficulty: 'easy',
      description: 'Проанализируйте монолитное приложение и предложите микросервисную декомпозицию.',
      requirements: [
        'Изучите структуру монолитного e-commerce приложения',
        'Определите bounded contexts (ограниченные контексты)',
        'Предложите разбиение на микросервисы',
        'Определите взаимодействие между сервисами',
        'Укажите какие данные будут дублироваться',
        'Обоснуйте выбор технологий для каждого сервиса'
      ],
      hint: 'Начните с определения основных бизнес-доменов: пользователи, каталог товаров, заказы, оплата, доставка, уведомления. Каждый домен — кандидат на отдельный сервис.',
      expectedOutput: 'Bounded Contexts:\n1. User Context — регистрация, профиль, аутентификация\n2. Catalog Context — товары, категории, поиск\n3. Order Context — корзина, заказы, статус\n4. Payment Context — оплата, возвраты, счета\n5. Shipping Context — доставка, трекинг\n6. Notification Context — email, SMS, push\n\nМикросервисы:\n- User Service (Java/Spring Boot) -> PostgreSQL\n- Catalog Service (Java/Spring Boot) -> PostgreSQL + Elasticsearch\n- Order Service (Java/Spring Boot) -> PostgreSQL\n- Payment Service (Java/Spring Boot) -> PostgreSQL\n- Shipping Service (Go) -> PostgreSQL\n- Notification Service (Node.js) -> Redis\n\nВзаимодействия:\n- Order -> Payment: синхронный REST (нужен ответ сразу)\n- Order -> Shipping: асинхронный Kafka (fire-and-forget)\n- Payment -> Notification: асинхронный Kafka (отправить чек)',
      solution: '// Анализ монолита и декомпозиция\n\n// Шаг 1: Определяем модули монолита\n// src/main/java/com/shop/\n//   users/      -> UserController, UserService, UserRepository\n//   catalog/    -> ProductController, ProductService, ProductRepository\n//   orders/     -> OrderController, OrderService, OrderRepository\n//   payments/   -> PaymentController, PaymentService, PaymentRepository\n//   shipping/   -> ShippingController, ShippingService, ShippingRepository\n//   notifications/ -> NotificationService, EmailSender, SmsSender\n\n// Шаг 2: Определяем зависимости\n// OrderService зависит от: UserService, ProductService, PaymentService\n// PaymentService зависит от: OrderService\n// ShippingService зависит от: OrderService\n// NotificationService зависит от: всех (отправка уведомлений)\n\n// Шаг 3: Микросервисная декомпозиция\n// user-service:         POST /api/users, GET /api/users/{id}\n// catalog-service:      GET /api/products, GET /api/products/{id}\n// order-service:        POST /api/orders, GET /api/orders/{id}\n// payment-service:      POST /api/payments, GET /api/payments/{id}\n// shipping-service:     POST /api/shipments, GET /api/shipments/{id}\n// notification-service: подписка на события из Kafka\n\n// Шаг 4: Дублирование данных\n// Order Service хранит копию имени и email пользователя\n// Order Service хранит копию названия и цены товара\n// Синхронизация через события: UserUpdated, ProductPriceChanged',
      explanation: 'Декомпозиция монолита начинается с определения bounded contexts по DDD. Каждый контекст — кандидат на микросервис. Важно определить тип взаимодействия: синхронный (REST/gRPC) для запросов требующих немедленного ответа, асинхронный (Kafka) для событий и уведомлений.'
    }
  ]
}
