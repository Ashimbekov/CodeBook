export default {
  id: 27,
  title: 'Введение в микросервисы',
  description: 'Архитектура микросервисов: декомпозиция монолита, паттерны взаимодействия сервисов, синхронная и асинхронная коммуникация, проблемы и решения',
  lessons: [
    {
      id: 1,
      title: 'Монолит vs Микросервисы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Монолит — одно большое приложение, где все модули работают в одном процессе. Микросервисы — набор небольших независимых сервисов, каждый отвечает за одну бизнес-область и работает в отдельном процессе.' },
        { type: 'heading', value: 'Сравнение подходов' },
        { type: 'code', language: 'java', value: '// Монолит: один процесс, прямые вызовы методов\nOrderService -> UserService -> NotificationService\n// Быстро, просто, легко отлаживать\n\n// Микросервисы: отдельные сервисы, сетевые вызовы\nOrderService -> (HTTP/gRPC) -> UserService\nOrderService -> (Kafka) -> NotificationService\n// Медленнее, сложнее, но: независимый деплой, масштабирование, разные технологии' },
        { type: 'heading', value: 'Когда выбирать микросервисы' },
        { type: 'text', value: 'Микросервисы подходят когда: большая команда (10+ разработчиков), разные части требуют разного масштабирования, нужен независимый деплой модулей, уже есть опыт с распределёнными системами.' },
        { type: 'warning', value: 'Не начинай с микросервисов! Сначала реализуй монолит, найди естественные границы между модулями, потом выделяй сервисы. "Распределённый монолит" — худший вариант.' }
      ]
    },
    {
      id: 2,
      title: 'Декомпозиция: как разбивать на сервисы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ключевой вопрос: где границы сервисов? Плохая декомпозиция — главная причина проблем с микросервисами. Основной принцип — Bounded Context из DDD (Domain-Driven Design).' },
        { type: 'heading', value: 'Пример декомпозиции e-commerce' },
        { type: 'code', language: 'java', value: '// Хорошая декомпозиция по бизнес-доменам:\n\nUser Service     — регистрация, аутентификация, профили\nProduct Service  — каталог товаров, поиск, категории\nOrder Service    — создание заказов, история заказов\nPayment Service  — платежи, транзакции\nInventory Service — остатки на складе\nNotification Service — email, SMS, push уведомления\nShipping Service — доставка, отслеживание\n\n// Плохая декомпозиция (по техническому слою):\nController Service — все контроллеры\nDatabase Service  — все репозитории\n// Это просто монолит разбитый на части без смысла!' },
        { type: 'tip', value: 'Каждый сервис должен иметь свою базу данных! Если два сервиса используют одну БД — они не настоящие микросервисы, а просто две части монолита.' }
      ]
    },
    {
      id: 3,
      title: 'Синхронная коммуникация: REST и OpenFeign',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сервисы общаются синхронно через HTTP REST. OpenFeign — декларативный HTTP клиент Spring Cloud: описываешь интерфейс, Spring сам делает запросы.' },
        { type: 'heading', value: 'OpenFeign клиент' },
        { type: 'code', language: 'xml', value: '<dependency>\n    <groupId>org.springframework.cloud</groupId>\n    <artifactId>spring-cloud-starter-openfeign</artifactId>\n</dependency>' },
        { type: 'code', language: 'java', value: '// Включить Feign\n@SpringBootApplication\n@EnableFeignClients\npublic class OrderServiceApplication { ... }\n\n// Описать клиент как интерфейс\n@FeignClient(name = "user-service", url = "${services.user.url}")\npublic interface UserServiceClient {\n\n    @GetMapping("/api/users/{id}")\n    UserDto getUserById(@PathVariable Long id);\n\n    @GetMapping("/api/users/{id}/address")\n    AddressDto getUserAddress(@PathVariable Long id);\n}\n\n// Использовать как обычный сервис\n@Service\npublic class OrderService {\n\n    @Autowired\n    private UserServiceClient userClient;\n\n    public Order createOrder(Long userId, OrderRequest request) {\n        UserDto user = userClient.getUserById(userId);\n        // user.getName(), user.getEmail() — данные из другого сервиса!\n        return orderRepository.save(new Order(userId, user.getAddress()));\n    }\n}' }
      ]
    },
    {
      id: 4,
      title: 'Асинхронная коммуникация: Apache Kafka',
      type: 'theory',
      content: [
        { type: 'text', value: 'Синхронная коммуникация имеет недостатки: если User Service недоступен — Order Service тоже падает. Kafka решает это: сервисы общаются через события, не зависят друг от друга напрямую.' },
        { type: 'heading', value: 'Продюсер (Order Service)' },
        { type: 'code', language: 'xml', value: '<dependency>\n    <groupId>org.springframework.kafka</groupId>\n    <artifactId>spring-kafka</artifactId>\n</dependency>' },
        { type: 'code', language: 'java', value: '// Order Service — публикует событие\n@Service\npublic class OrderService {\n\n    @Autowired\n    private KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate;\n\n    public Order createOrder(OrderRequest request) {\n        Order order = orderRepository.save(new Order(request));\n\n        // Асинхронно уведомляем другие сервисы\n        kafkaTemplate.send("order.created",\n            new OrderCreatedEvent(order.getId(), order.getUserId(), order.getTotal()));\n\n        return order;\n    }\n}' },
        { type: 'code', language: 'java', value: '// Notification Service — подписывается на событие\n@Component\npublic class OrderEventConsumer {\n\n    @KafkaListener(topics = "order.created", groupId = "notification-group")\n    public void handleOrderCreated(OrderCreatedEvent event) {\n        emailService.sendOrderConfirmation(event.getUserId(), event.getOrderId());\n        smsService.sendOrderSms(event.getUserId());\n    }\n}' },
        { type: 'tip', value: 'Kafka гарантирует доставку события: даже если Notification Service был недоступен, он получит все события после восстановления.' }
      ]
    },
    {
      id: 5,
      title: 'Паттерны: Saga и Circuit Breaker',
      type: 'theory',
      content: [
        { type: 'text', value: 'Распределённые транзакции — главная сложность микросервисов. Паттерн Saga решает это через цепочку локальных транзакций с компенсирующими действиями. Circuit Breaker предотвращает каскадные сбои.' },
        { type: 'heading', value: 'Circuit Breaker с Resilience4j' },
        { type: 'code', language: 'xml', value: '<dependency>\n    <groupId>io.github.resilience4j</groupId>\n    <artifactId>resilience4j-spring-boot3</artifactId>\n</dependency>' },
        { type: 'code', language: 'java', value: '@Service\npublic class OrderService {\n\n    @CircuitBreaker(name = "userService", fallbackMethod = "getUserFallback")\n    @TimeLimiter(name = "userService")\n    public CompletableFuture<UserDto> getUser(Long userId) {\n        return CompletableFuture.supplyAsync(\n            () -> userServiceClient.getUserById(userId)\n        );\n    }\n\n    // Fallback — вызывается когда Circuit Breaker открыт\n    public CompletableFuture<UserDto> getUserFallback(Long userId, Exception e) {\n        log.warn("User Service недоступен, используем кешированные данные");\n        return CompletableFuture.completedFuture(\n            userCacheService.getCachedUser(userId)\n        );\n    }\n}' },
        { type: 'code', language: 'java', value: '# application.properties\nresilience4j.circuitbreaker.instances.userService.sliding-window-size=10\nresilience4j.circuitbreaker.instances.userService.failure-rate-threshold=50\nresilience4j.circuitbreaker.instances.userService.wait-duration-in-open-state=10s' }
      ]
    },
    {
      id: 6,
      title: 'Observability: трассировка запросов',
      type: 'theory',
      content: [
        { type: 'text', value: 'В микросервисах один запрос проходит через несколько сервисов. Distributed Tracing позволяет отследить путь запроса через все сервисы с временными метками.' },
        { type: 'heading', value: 'Micrometer Tracing и Zipkin' },
        { type: 'code', language: 'xml', value: '<dependency>\n    <groupId>io.micrometer</groupId>\n    <artifactId>micrometer-tracing-bridge-brave</artifactId>\n</dependency>\n<dependency>\n    <groupId>io.zipkin.reporter2</groupId>\n    <artifactId>zipkin-reporter-brave</artifactId>\n</dependency>' },
        { type: 'code', language: 'java', value: '# application.properties\nmanagement.tracing.sampling.probability=1.0\nmanagement.zipkin.tracing.endpoint=http://zipkin:9411/api/v2/spans\n\n# Логи автоматически включают traceId\n# [traceId=abc123, spanId=def456] Запрос к UserService\n# [traceId=abc123, spanId=ghi789] Запрос к OrderService' },
        { type: 'tip', value: 'traceId остаётся одним на весь путь запроса. spanId уникален для каждого сервиса. Так ты видишь весь путь запроса в Zipkin UI.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: три взаимодействующих сервиса',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте взаимодействие трёх микросервисов: Order Service создаёт заказ, получает данные пользователя через OpenFeign из User Service, публикует событие в Kafka для Notification Service.',
      requirements: [
        'Order Service: POST /api/orders — создать заказ',
        'Использовать @FeignClient для получения UserDto из User Service',
        'После сохранения заказа — публиковать OrderCreatedEvent в Kafka топик "orders"',
        'Notification Service: подписаться на "orders" и логировать событие',
        'Order Service: добавить Circuit Breaker для FeignClient',
        'Fallback: вернуть заказ без данных пользователя, если User Service недоступен',
        'Добавить traceId в логи через Micrometer'
      ],
      hint: 'FeignClient url берётся из application.properties. @KafkaListener в Notification Service должен быть в отдельном приложении Spring Boot.',
      solution: '// OrderService (applications order-service)\n@FeignClient(name = "user-service", url = "${services.user.url}",\n    fallbackFactory = UserClientFallback.class)\npublic interface UserClient {\n    @GetMapping("/api/users/{id}")\n    UserDto getUser(@PathVariable Long id);\n}\n\n@Service\npublic class OrderService {\n    @Autowired UserClient userClient;\n    @Autowired KafkaTemplate<String, OrderCreatedEvent> kafka;\n    @Autowired OrderRepository repo;\n\n    @CircuitBreaker(name = "userService")\n    public Order createOrder(Long userId, OrderRequest req) {\n        UserDto user = userClient.getUser(userId);\n        Order order = repo.save(new Order(userId, user.getAddress(), req.getItems()));\n        kafka.send("orders", new OrderCreatedEvent(order.getId(), userId));\n        return order;\n    }\n}\n\n// NotificationService (отдельное приложение)\n@Component @Slf4j\npublic class OrderConsumer {\n    @KafkaListener(topics = "orders", groupId = "notification")\n    public void onOrder(OrderCreatedEvent event) {\n        log.info("Новый заказ: orderId={}, userId={}", event.getOrderId(), event.getUserId());\n        // emailService.send(...);\n    }\n}',
      explanation: 'OpenFeign абстрагирует HTTP вызовы до уровня метода интерфейса. Circuit Breaker предотвращает зависание при недоступном сервисе. Kafka обеспечивает асинхронную доставку событий без тесной связи сервисов.'
    }
  ]
}
