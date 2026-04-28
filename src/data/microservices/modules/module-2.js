export default {
  id: 2,
  title: 'Декомпозиция монолита',
  description: 'Domain-Driven Design, bounded contexts, стратегии разбиения монолита, определение границ сервисов, агрегаты и доменные события.',
  lessons: [
    {
      id: 1,
      title: 'Domain-Driven Design (DDD) основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'DDD — методология проектирования ПО, основанная на моделировании предметной области. Для микросервисов DDD даёт инструменты определения границ сервисов: Bounded Context, Aggregate, Domain Event.' },
        { type: 'heading', value: 'Основные концепции DDD' },
        { type: 'list', value: [
          'Domain — предметная область (интернет-магазин, банк, логистика)',
          'Ubiquitous Language — единый язык между разработчиками и бизнесом',
          'Bounded Context — ограниченный контекст, граница модели',
          'Aggregate — кластер связанных объектов с корневой сущностью',
          'Domain Event — событие, значимое для бизнеса',
          'Entity — объект с уникальным идентификатором',
          'Value Object — объект без идентификатора, определяется значениями'
        ] },
        { type: 'code', language: 'java', value: '// Entity — имеет уникальный ID\n@Entity\npublic class Order {\n    @Id\n    private UUID id;           // Уникальный идентификатор\n    private UUID customerId;\n    private OrderStatus status;\n    private List<OrderItem> items;\n    private Money totalAmount; // Value Object\n\n    // Бизнес-логика внутри Entity\n    public void addItem(Product product, int quantity) {\n        items.add(new OrderItem(product.getId(), product.getPrice(), quantity));\n        recalculateTotal();\n    }\n\n    public void confirm() {\n        if (items.isEmpty()) throw new IllegalStateException("Пустой заказ");\n        this.status = OrderStatus.CONFIRMED;\n    }\n}\n\n// Value Object — определяется значениями, immutable\npublic record Money(BigDecimal amount, Currency currency) {\n    public Money add(Money other) {\n        if (!currency.equals(other.currency))\n            throw new IllegalArgumentException("Разные валюты");\n        return new Money(amount.add(other.amount), currency);\n    }\n}' },
        { type: 'tip', value: 'В DDD слово "Order" в контексте интернет-магазина и в контексте ресторана — разные модели. Bounded Context определяет где заканчивается одно значение и начинается другое.' }
      ]
    },
    {
      id: 2,
      title: 'Bounded Context и границы сервисов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Bounded Context — ключевой паттерн DDD для определения границ микросервисов. Каждый Bounded Context имеет свою модель, свой язык и свои правила. Один микросервис = один Bounded Context.' },
        { type: 'heading', value: 'Как определить Bounded Context' },
        { type: 'code', language: 'java', value: '// Пример: слово "Product" в разных контекстах\n\n// Catalog Context — полная информация о товаре\npublic class Product {\n    private UUID id;\n    private String name;\n    private String description;\n    private List<Image> images;\n    private Category category;\n    private BigDecimal price;\n    private List<Review> reviews;\n    private Map<String, String> specifications;\n}\n\n// Order Context — только то, что нужно для заказа\npublic class OrderProduct {\n    private UUID productId;  // Ссылка на Product\n    private String name;     // Копия названия (денормализация)\n    private BigDecimal price; // Цена на момент заказа\n}\n\n// Shipping Context — только то, что нужно для доставки\npublic class ShippingItem {\n    private UUID productId;\n    private String name;\n    private double weight;\n    private Dimensions dimensions;\n}\n\n// Каждый контекст видит Product по-своему!\n// Это НЕ дублирование — это разные модели одной сущности' },
        { type: 'heading', value: 'Context Map — связи между контекстами' },
        { type: 'list', value: [
          'Shared Kernel — контексты разделяют часть модели (опасно!)',
          'Customer-Supplier — один контекст поставляет данные другому',
          'Conformist — потребитель принимает модель поставщика как есть',
          'Anti-Corruption Layer — адаптер между моделями контекстов',
          'Published Language — общий формат обмена (JSON schema, protobuf)'
        ] },
        { type: 'warning', value: 'Не делайте "nano-сервисы" — слишком мелкое дробление приводит к взрыву сетевых вызовов и сложности. Если два сервиса всегда деплоятся вместе и активно обмениваются данными — объедините их.' }
      ]
    },
    {
      id: 3,
      title: 'Агрегаты и доменные события',
      type: 'theory',
      content: [
        { type: 'text', value: 'Aggregate — кластер доменных объектов, которые обрабатываются как единое целое. Aggregate Root — главная сущность, через которую происходит доступ. Domain Event — уведомление о важном изменении в домене.' },
        { type: 'code', language: 'java', value: '// Aggregate Root: Order\n// Aggregate: Order + OrderItems\n// Правило: изменения только через Aggregate Root\n\n@Aggregate\npublic class Order {\n    @AggregateIdentifier\n    private UUID orderId;\n    private UUID customerId;\n    private List<OrderItem> items = new ArrayList<>();\n    private OrderStatus status;\n    private Money totalAmount;\n\n    // Команда -> изменение состояния -> событие\n    public OrderCreatedEvent create(UUID customerId, List<OrderItemDto> items) {\n        this.orderId = UUID.randomUUID();\n        this.customerId = customerId;\n        this.status = OrderStatus.CREATED;\n        items.forEach(item -> this.items.add(\n            new OrderItem(item.productId(), item.price(), item.quantity())\n        ));\n        recalculateTotal();\n\n        // Генерируем доменное событие\n        return new OrderCreatedEvent(orderId, customerId, totalAmount);\n    }\n\n    public OrderConfirmedEvent confirm() {\n        if (status != OrderStatus.CREATED)\n            throw new IllegalStateException("Заказ не в статусе CREATED");\n        this.status = OrderStatus.CONFIRMED;\n        return new OrderConfirmedEvent(orderId, customerId, totalAmount);\n    }\n}\n\n// Domain Events — неизменяемые записи о произошедшем\npublic record OrderCreatedEvent(\n    UUID orderId,\n    UUID customerId,\n    Money totalAmount,\n    Instant occurredAt\n) {\n    public OrderCreatedEvent(UUID orderId, UUID customerId, Money totalAmount) {\n        this(orderId, customerId, totalAmount, Instant.now());\n    }\n}\n\npublic record OrderConfirmedEvent(UUID orderId, UUID customerId, Money totalAmount) {}' },
        { type: 'note', value: 'Правило: транзакция не должна пересекать границы агрегата. Один агрегат = одна транзакция. Между агрегатами — eventual consistency через события.' }
      ]
    },
    {
      id: 4,
      title: 'Стратегии разбиения монолита',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существует несколько подходов к декомпозиции монолита: по бизнес-возможностям, по поддоменам DDD, по организационной структуре. Каждый подход имеет свои критерии определения границ.' },
        { type: 'heading', value: 'Подходы к декомпозиции' },
        { type: 'code', language: 'java', value: '// Подход 1: Decompose by Business Capability\n// Бизнес-возможности интернет-магазина:\n// - Управление каталогом товаров -> Catalog Service\n// - Управление заказами          -> Order Service\n// - Обработка платежей            -> Payment Service\n// - Доставка                      -> Shipping Service\n// - Уведомления                   -> Notification Service\n\n// Подход 2: Decompose by Subdomain (DDD)\n// Core Domain (ядро бизнеса):     Order Service, Pricing Service\n// Supporting Domain (поддержка):  User Service, Catalog Service\n// Generic Domain (общее):         Notification Service, Auth Service\n\n// Подход 3: Strangler Fig Pattern (постепенный)\n// Шаг 1: Перехват запросов через API Gateway\n@Configuration\npublic class GatewayConfig {\n    @Bean\n    public RouteLocator routes(RouteLocatorBuilder builder) {\n        return builder.routes()\n            // Новый сервис обрабатывает /api/users\n            .route("user-service", r -> r\n                .path("/api/users/**")\n                .uri("http://user-service:8081"))\n            // Остальное идёт в монолит\n            .route("monolith", r -> r\n                .path("/api/**")\n                .uri("http://monolith:8080"))\n            .build();\n    }\n}' },
        { type: 'list', value: [
          'По бизнес-возможностям — самый распространённый, основан на функциях бизнеса',
          'По поддоменам DDD — глубокий анализ домена с Event Storming',
          'Strangler Fig — постепенная замена частей монолита новыми сервисами',
          'По изменениям — части которые чаще меняются выделяются первыми',
          'По нагрузке — нагруженные модули выделяются для независимого масштабирования'
        ] },
        { type: 'tip', value: 'Event Storming — воркшоп с участием разработчиков и бизнеса. На стикерах описывают события домена (OrderCreated, PaymentProcessed), группируют их — каждая группа становится Bounded Context.' }
      ]
    },
    {
      id: 5,
      title: 'Anti-Corruption Layer',
      type: 'theory',
      content: [
        { type: 'text', value: 'Anti-Corruption Layer (ACL) — паттерн DDD, изолирующий модель одного контекста от другого. При декомпозиции монолита ACL помогает новому сервису не зависеть от устаревшей модели монолита.' },
        { type: 'code', language: 'java', value: '// Anti-Corruption Layer между Order Service и Legacy Monolith\n\n// Модель старого монолита (legacy)\npublic class LegacyOrderResponse {\n    private int order_id;       // int вместо UUID\n    private String cust_name;   // полное имя одной строкой\n    private String status_code; // "A" = active, "C" = completed\n    private double total_amt;   // double вместо BigDecimal\n}\n\n// Наша чистая модель\npublic record Order(\n    UUID id,\n    String customerFirstName,\n    String customerLastName,\n    OrderStatus status,\n    Money totalAmount\n) {}\n\n// ACL — трансляция между моделями\n@Component\npublic class OrderAntiCorruptionLayer {\n\n    private final LegacyMonolithClient legacyClient;\n\n    public Order getOrder(UUID orderId) {\n        // Вызываем legacy API\n        LegacyOrderResponse legacy = legacyClient\n            .getOrder(orderId.hashCode()); // legacy ожидает int\n\n        // Транслируем в нашу модель\n        String[] nameParts = legacy.getCust_name().split(" ");\n        return new Order(\n            orderId,\n            nameParts[0],\n            nameParts.length > 1 ? nameParts[1] : "",\n            mapStatus(legacy.getStatus_code()),\n            new Money(BigDecimal.valueOf(legacy.getTotal_amt()), Currency.USD)\n        );\n    }\n\n    private OrderStatus mapStatus(String legacyCode) {\n        return switch (legacyCode) {\n            case "A" -> OrderStatus.ACTIVE;\n            case "C" -> OrderStatus.COMPLETED;\n            case "X" -> OrderStatus.CANCELLED;\n            default -> throw new IllegalArgumentException("Unknown: " + legacyCode);\n        };\n    }\n}' },
        { type: 'note', value: 'ACL — это адаптер между двумя моделями. Он защищает вашу чистую модель от "загрязнения" чужими терминами и структурами. При миграции с монолита ACL — обязательный паттерн.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Event Storming и декомпозиция',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проведите Event Storming для системы онлайн-обучения и определите микросервисы.',
      requirements: [
        'Определите доменные события системы онлайн-обучения (минимум 15 событий)',
        'Сгруппируйте события по Bounded Contexts',
        'Определите агрегаты для каждого контекста',
        'Нарисуйте Context Map — связи между контекстами',
        'Определите тип связи: синхронный или асинхронный',
        'Создайте Anti-Corruption Layer для интеграции со старым LMS'
      ],
      hint: 'События системы обучения: UserRegistered, CourseCreated, StudentEnrolled, LessonCompleted, QuizSubmitted, CertificateIssued, PaymentProcessed, ReviewPosted и т.д.',
      expectedOutput: 'Bounded Contexts:\n1. User Context: UserRegistered, ProfileUpdated, UserDeactivated\n2. Course Context: CourseCreated, CoursePublished, LessonAdded\n3. Enrollment Context: StudentEnrolled, CourseStarted, LessonCompleted\n4. Assessment Context: QuizCreated, QuizSubmitted, QuizGraded\n5. Payment Context: PaymentProcessed, RefundIssued\n6. Certificate Context: CertificateIssued, CertificateVerified\n7. Notification Context: подписка на все события\n\nContext Map:\n- Enrollment -> Course: Customer-Supplier (sync REST)\n- Enrollment -> Payment: Customer-Supplier (sync REST)\n- Assessment -> Enrollment: Domain Events (async Kafka)\n- Certificate -> Assessment: Domain Events (async Kafka)\n- Notification -> All: Published Language (async Kafka)',
      solution: '// Event Storming результат\n\n// Доменные события:\n// UserRegistered, ProfileUpdated, UserDeactivated\n// CourseCreated, CoursePublished, LessonAdded, CourseArchived\n// StudentEnrolled, CourseStarted, LessonCompleted, CourseCompleted\n// QuizCreated, QuizSubmitted, QuizGraded, QuizRetried\n// PaymentProcessed, RefundIssued, SubscriptionRenewed\n// CertificateIssued, CertificateVerified\n\n// Агрегаты:\n// User Context: User (root), Profile\n// Course Context: Course (root), Lesson, Module\n// Enrollment Context: Enrollment (root), Progress\n// Assessment Context: Quiz (root), Submission, Grade\n// Payment Context: Payment (root), Invoice, Subscription\n// Certificate Context: Certificate (root)\n\n// Anti-Corruption Layer для интеграции со старым LMS\n@Component\npublic class LegacyLmsAntiCorruptionLayer {\n    \n    private final LegacyLmsClient legacyLms;\n    \n    public Course importCourse(String legacyCourseId) {\n        LegacyCourse legacy = legacyLms.getCourse(legacyCourseId);\n        return Course.builder()\n            .title(legacy.getTitle())\n            .description(sanitizeHtml(legacy.getDesc()))\n            .modules(legacy.getChapters().stream()\n                .map(this::mapChapterToModule)\n                .toList())\n            .build();\n    }\n    \n    private Module mapChapterToModule(LegacyChapter chapter) {\n        return Module.builder()\n            .title(chapter.getName())\n            .lessons(chapter.getTopics().stream()\n                .map(t -> new Lesson(t.getTitle(), t.getContent()))\n                .toList())\n            .build();\n    }\n}',
      explanation: 'Event Storming начинается с определения доменных событий (оранжевые стикеры), затем группировка в контексты, определение агрегатов и команд. Context Map показывает как контексты связаны. ACL защищает новую модель от особенностей legacy-системы.'
    }
  ]
}
