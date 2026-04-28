export default {
  id: 50,
  title: 'Практикум: Микросервисный проект',
  description: 'Финальный практикум: построение e-commerce микросервисной архитектуры с API Gateway, Service Discovery, Kafka, мониторингом и distributed tracing.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Service Discovery и API Gateway',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте инфраструктуру микросервисов: Eureka Service Discovery и Spring Cloud Gateway для маршрутизации запросов.',
      requirements: [
        'Eureka Server: отдельный Spring Boot проект (порт 8761)',
        'API Gateway: Spring Cloud Gateway (порт 8080)',
        'Маршруты: /api/products/** -> product-service, /api/orders/** -> order-service, /api/users/** -> user-service',
        'Eureka Client в каждом сервисе',
        'Gateway фильтры: Rate Limiter, Circuit Breaker, JWT Authentication',
        'Load Balancing через Spring Cloud LoadBalancer',
        'Fallback endpoints для Circuit Breaker',
        'Health check через Actuator'
      ],
      hint: 'Spring Cloud Gateway использует RouteLocator или application.yml для маршрутов. lb:// префикс для load balancing через Eureka. ReactiveCircuitBreaker для Gateway фильтров.',
      expectedOutput: 'Eureka Dashboard: http://localhost:8761\nЗарегистрированные сервисы:\n  PRODUCT-SERVICE: 2 instances (8081, 8082)\n  ORDER-SERVICE: 1 instance (8083)\n  USER-SERVICE: 1 instance (8084)\n  API-GATEWAY: 1 instance (8080)\n\nGET http://localhost:8080/api/products -> product-service (load balanced)\nGET http://localhost:8080/api/orders -> order-service\nGET http://localhost:8080/api/users -> user-service\n\nProduct-service падает:\nGET /api/products -> Circuit Breaker -> fallback: {"message":"Сервис временно недоступен"}\n\nRate Limiter: 101-й запрос -> 429 Too Many Requests',
      solution: '// Eureka Server\n@SpringBootApplication\n@EnableEurekaServer\npublic class EurekaServerApp { }\n\n// application.yml (eureka-server)\n// server.port: 8761\n// eureka.client.register-with-eureka: false\n// eureka.client.fetch-registry: false\n\n// API Gateway\n@SpringBootApplication\npublic class GatewayApp { }\n\n// application.yml (gateway)\n// spring.cloud.gateway.routes:\n//   - id: product-service\n//     uri: lb://PRODUCT-SERVICE\n//     predicates: [Path=/api/products/**]\n//     filters:\n//       - name: CircuitBreaker\n//         args:\n//           name: productCB\n//           fallbackUri: forward:/fallback/products\n//       - name: RequestRateLimiter\n//         args:\n//           redis-rate-limiter.replenishRate: 10\n//           redis-rate-limiter.burstCapacity: 20\n//   - id: order-service\n//     uri: lb://ORDER-SERVICE\n//     predicates: [Path=/api/orders/**]\n\n@RestController\npublic class FallbackController {\n    @GetMapping("/fallback/products")\n    public Map<String, String> productFallback() {\n        return Map.of("message", "Сервис продуктов временно недоступен");\n    }\n\n    @GetMapping("/fallback/orders")\n    public Map<String, String> orderFallback() {\n        return Map.of("message", "Сервис заказов временно недоступен");\n    }\n}\n\n// Product Service (eureka client)\n// spring.application.name: product-service\n// eureka.client.service-url.defaultZone: http://localhost:8761/eureka/',
      explanation: 'Eureka Server — реестр сервисов. Каждый сервис регистрируется при старте. API Gateway маршрутизирует запросы через lb:// (load balanced). Circuit Breaker защищает от каскадных сбоев на уровне Gateway.'
    },
    {
      id: 2,
      title: 'Задача: Product Service',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте микросервис для управления каталогом товаров с REST API, JPA и Kafka event publishing.',
      requirements: [
        'CRUD API: GET/POST/PUT/DELETE /api/products',
        'JPA Entity: Product (id, name, description, price, stock, categoryId, active)',
        'Поиск: GET /api/products?category=X&minPrice=Y&q=Z с Specification',
        'Пагинация и сортировка',
        'Публикация событий в Kafka: ProductCreated, ProductUpdated, StockChanged',
        'Эндпоинт уменьшения stock: POST /api/products/{id}/decrease-stock',
        'Оптимистическая блокировка (@Version) для stock',
        'Регистрация в Eureka'
      ],
      hint: 'Используйте @Version для оптимистической блокировки stock. При конфликте Spring Data бросает OptimisticLockingFailureException — обработайте через @ControllerAdvice.',
      expectedOutput: 'Product Service запущен на порту 8081\nЗарегистрирован в Eureka: PRODUCT-SERVICE\n\nPOST /api/products {"name":"Ноутбук","price":89000,"stock":10}:\n{"id":1,"name":"Ноутбук","price":89000,"stock":10}\nKafka: ProductCreated {id:1, name:"Ноутбук"}\n\nPOST /api/products/1/decrease-stock {"quantity":3}:\n{"id":1,"stock":7}\nKafka: StockChanged {productId:1, oldStock:10, newStock:7}\n\nPOST /api/products/1/decrease-stock {"quantity":100}:\nHTTP 400: "Недостаточно товара: осталось 7"\n\nGET /api/products?category=1&minPrice=50000&sort=price,desc&page=0&size=10:\n{"content":[...],"totalElements":15}',
      solution: '@Entity\npublic class Product {\n    @Id @GeneratedValue private Long id;\n    private String name;\n    @Column(columnDefinition = "TEXT") private String description;\n    private BigDecimal price;\n    private Integer stock;\n    private Long categoryId;\n    private boolean active = true;\n    @Version private Long version;\n}\n\n@Service @Transactional\npublic class ProductService {\n    private final ProductRepository repo;\n    private final KafkaTemplate<String, Object> kafka;\n\n    public Product create(CreateProductRequest req) {\n        Product product = repo.save(toEntity(req));\n        kafka.send("products", product.getId().toString(),\n            new ProductCreatedEvent(product.getId(), product.getName(), product.getPrice()));\n        return product;\n    }\n\n    public Product decreaseStock(Long id, int quantity) {\n        Product product = repo.findById(id).orElseThrow();\n        if (product.getStock() < quantity) {\n            throw new InsufficientStockException("Недостаточно: осталось " + product.getStock());\n        }\n        int oldStock = product.getStock();\n        product.setStock(oldStock - quantity);\n        Product saved = repo.save(product);\n        kafka.send("products", id.toString(),\n            new StockChangedEvent(id, oldStock, saved.getStock()));\n        return saved;\n    }\n}',
      explanation: '@Version обеспечивает оптимистическую блокировку: если два потока одновременно меняют stock, один получит OptimisticLockingFailureException. Kafka события позволяют другим сервисам реагировать на изменения каталога.'
    },
    {
      id: 3,
      title: 'Задача: Order Service с Kafka',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте микросервис заказов с Saga-паттерном: координация между order-service и product-service через Kafka.',
      requirements: [
        'POST /api/orders — создать заказ (статус PENDING)',
        'Saga: создание заказа -> резервирование stock -> подтверждение/откат',
        'Kafka producer: OrderCreatedEvent в топик "orders"',
        'Kafka consumer: слушает "stock-reserved" и "stock-reservation-failed"',
        'При stock-reserved -> статус CONFIRMED',
        'При stock-reservation-failed -> статус CANCELLED, уведомление пользователю',
        'GET /api/orders/{id} — статус заказа',
        'GET /api/orders/my — заказы текущего пользователя',
        'Межсервисная коммуникация через WebClient + Eureka'
      ],
      hint: 'Saga Choreography: каждый сервис слушает события и реагирует. Order Service публикует OrderCreated, Product Service слушает и публикует StockReserved/Failed, Order Service слушает и обновляет статус.',
      expectedOutput: 'POST /api/orders {"items": [{"productId":1,"quantity":2}]}:\n{"id":42,"status":"PENDING","totalAmount":178000}\n\nSaga flow:\n1. Order Service -> Kafka "orders": OrderCreated{orderId:42}\n2. Product Service (consumer) -> проверяет stock -> OK\n3. Product Service -> Kafka "stock-events": StockReserved{orderId:42}\n4. Order Service (consumer) -> обновляет статус CONFIRMED\n\nGET /api/orders/42:\n{"id":42,"status":"CONFIRMED"}\n\nПри нехватке stock:\n1. Order Service -> OrderCreated{orderId:43}\n2. Product Service -> stock недостаточен\n3. Product Service -> Kafka: StockReservationFailed{orderId:43,reason:"Нет в наличии"}\n4. Order Service -> статус CANCELLED\n\nGET /api/orders/43:\n{"id":43,"status":"CANCELLED","cancelReason":"Нет в наличии"}',
      solution: '// Order Service\n@Service @Transactional\npublic class OrderService {\n    private final OrderRepository orderRepo;\n    private final KafkaTemplate<String, Object> kafka;\n    private final WebClient.Builder webClientBuilder;\n\n    public Order createOrder(Long userId, List<OrderItemRequest> items) {\n        // Получить цены из Product Service\n        BigDecimal total = items.stream()\n            .map(item -> {\n                ProductDto product = webClientBuilder.build().get()\n                    .uri("http://PRODUCT-SERVICE/api/products/" + item.getProductId())\n                    .retrieve().bodyToMono(ProductDto.class).block();\n                return product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));\n            })\n            .reduce(BigDecimal.ZERO, BigDecimal::add);\n\n        Order order = new Order();\n        order.setUserId(userId);\n        order.setTotalAmount(total);\n        order.setStatus(OrderStatus.PENDING);\n        order.setItems(items.stream().map(this::toOrderItem).toList());\n        Order saved = orderRepo.save(order);\n\n        kafka.send("orders", saved.getId().toString(),\n            new OrderCreatedEvent(saved.getId(), items));\n        return saved;\n    }\n}\n\n// Kafka Consumer — обработка ответов от Product Service\n@Service\npublic class StockEventConsumer {\n    private final OrderRepository orderRepo;\n\n    @KafkaListener(topics = "stock-events", groupId = "order-service")\n    public void handleStockEvent(ConsumerRecord<String, Object> record) {\n        if (record.value() instanceof StockReservedEvent event) {\n            Order order = orderRepo.findById(event.orderId()).orElseThrow();\n            order.setStatus(OrderStatus.CONFIRMED);\n            orderRepo.save(order);\n        } else if (record.value() instanceof StockReservationFailedEvent event) {\n            Order order = orderRepo.findById(event.orderId()).orElseThrow();\n            order.setStatus(OrderStatus.CANCELLED);\n            order.setCancelReason(event.reason());\n            orderRepo.save(order);\n        }\n    }\n}\n\n// Product Service — слушает заказы и резервирует stock\n@Service\npublic class OrderEventConsumer {\n    @KafkaListener(topics = "orders", groupId = "product-service")\n    public void handleOrderCreated(OrderCreatedEvent event) {\n        try {\n            event.items().forEach(item ->\n                productService.decreaseStock(item.productId(), item.quantity()));\n            kafka.send("stock-events", new StockReservedEvent(event.orderId()));\n        } catch (InsufficientStockException e) {\n            kafka.send("stock-events",\n                new StockReservationFailedEvent(event.orderId(), e.getMessage()));\n        }\n    }\n}',
      explanation: 'Saga Choreography координирует распределённую транзакцию через события. Order Service не вызывает Product Service напрямую — он публикует событие. Product Service реагирует и публикует результат. Это обеспечивает слабую связанность сервисов.'
    },
    {
      id: 4,
      title: 'Задача: Distributed Tracing и логирование',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте Micrometer Tracing для отслеживания запросов через все микросервисы и централизованное логирование.',
      requirements: [
        'Micrometer Tracing с Zipkin для distributed tracing',
        'TraceId/SpanId в логах каждого сервиса',
        'Correlation ID для Kafka сообщений',
        'Centralized logging: все логи в один Loki/ELK',
        'Custom span для бизнес-операций',
        'Tracing через WebClient (межсервисные вызовы)',
        'Tracing через Kafka (передача traceId в headers)',
        'Zipkin UI для визуализации trace'
      ],
      hint: 'spring-boot-starter-actuator + micrometer-tracing-bridge-brave + zipkin-reporter-brave. TraceId автоматически передаётся через HTTP headers. Для Kafka — кастомный TracingProducerInterceptor.',
      expectedOutput: 'POST /api/orders (через Gateway):\n\nZipkin UI показывает trace:\n├── api-gateway: POST /api/orders (150ms)\n│   ├── order-service: createOrder (120ms)\n│   │   ├── product-service: GET /products/1 (25ms)\n│   │   ├── product-service: GET /products/2 (22ms)\n│   │   └── kafka: send orders topic (5ms)\n│   └── response: 201 Created\n\nTraceId: abc123 прослеживается через все сервисы\n\nЛоги каждого сервиса:\n[gateway]    [abc123-span1] POST /api/orders\n[order-svc]  [abc123-span2] Creating order for user 1\n[product-svc][abc123-span3] GET /api/products/1\n[order-svc]  [abc123-span4] Kafka send: OrderCreated',
      solution: '<!-- pom.xml (все сервисы) -->\n<!-- <dependency>\n    <groupId>io.micrometer</groupId>\n    <artifactId>micrometer-tracing-bridge-brave</artifactId>\n</dependency>\n<dependency>\n    <groupId>io.zipkin.reporter2</groupId>\n    <artifactId>zipkin-reporter-brave</artifactId>\n</dependency> -->\n\n// application.yml\n// management.tracing.sampling.probability: 1.0\n// management.zipkin.tracing.endpoint: http://zipkin:9411/api/v2/spans\n// logging.pattern.level: "%5p [${spring.application.name},%X{traceId},%X{spanId}]"\n\n// Кастомный span для бизнес-операций\n@Service\npublic class OrderService {\n    private final Tracer tracer;\n\n    public Order createOrder(CreateOrderRequest req) {\n        Span span = tracer.nextSpan().name("create-order").start();\n        try (Tracer.SpanInScope ws = tracer.withSpan(span)) {\n            span.tag("userId", req.getUserId().toString());\n            span.tag("itemCount", String.valueOf(req.getItems().size()));\n\n            Order order = processOrder(req);\n\n            span.tag("orderId", order.getId().toString());\n            span.tag("totalAmount", order.getTotalAmount().toString());\n            return order;\n        } catch (Exception e) {\n            span.error(e);\n            throw e;\n        } finally {\n            span.end();\n        }\n    }\n}\n\n// Kafka tracing — передача traceId\n// spring-kafka автоматически передаёт tracing headers через KafkaTemplate\n// Потребитель автоматически подхватывает traceId',
      explanation: 'Micrometer Tracing автоматически генерирует traceId для каждого запроса и передаёт через HTTP headers. Все сервисы в цепочке используют один traceId. Zipkin визуализирует полный путь запроса. MDC добавляет traceId в каждую строку лога.'
    },
    {
      id: 5,
      title: 'Задача: мониторинг с Prometheus и Grafana',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте полный мониторинг микросервисной архитектуры: метрики, дашборды, алерты.',
      requirements: [
        'Spring Boot Actuator + Micrometer Prometheus в каждом сервисе',
        'Prometheus: scrape метрик со всех сервисов',
        'Grafana dashboard: RPS, latency, error rate, JVM метрики',
        'Кастомные метрики: orders.created, orders.total_amount, products.stock_low',
        'Алерт: error rate > 5% за 5 минут',
        'Алерт: P99 latency > 2 секунды',
        'Health check endpoint для каждого сервиса',
        'docker-compose для всего стека мониторинга'
      ],
      hint: 'MeterRegistry.counter() и Timer.builder() для кастомных метрик. Prometheus /actuator/prometheus endpoint. Grafana datasource = Prometheus URL.',
      expectedOutput: 'docker compose up:\n  prometheus: http://localhost:9090 (scraping 4 services)\n  grafana: http://localhost:3000 (dashboard imported)\n  zipkin: http://localhost:9411\n\nGrafana Dashboard "E-Commerce Services":\n  ┌─────────────────────────────────┐\n  │ RPS: 150 req/s   Errors: 0.2%  │\n  │ P50: 12ms  P99: 85ms           │\n  │ Orders/min: 25   Revenue: 1.2M │\n  │ Low Stock Alerts: 3 products   │\n  └─────────────────────────────────┘\n\nPrometheus Targets:\n  product-service:8081 UP\n  order-service:8083 UP\n  user-service:8084 UP\n  api-gateway:8080 UP\n\nАлерт: "High Error Rate" fires when error_rate > 5%',
      solution: '// Кастомные метрики\n@Service\npublic class OrderMetrics {\n    private final Counter ordersCreated;\n    private final Counter ordersCancelled;\n    private final DistributionSummary orderAmount;\n    private final AtomicInteger activeOrders;\n\n    public OrderMetrics(MeterRegistry registry) {\n        ordersCreated = Counter.builder("orders.created")\n            .description("Количество созданных заказов")\n            .register(registry);\n        ordersCancelled = Counter.builder("orders.cancelled")\n            .register(registry);\n        orderAmount = DistributionSummary.builder("orders.amount")\n            .description("Суммы заказов")\n            .baseUnit("KZT")\n            .register(registry);\n        activeOrders = registry.gauge("orders.active", new AtomicInteger(0));\n    }\n\n    public void recordOrderCreated(BigDecimal amount) {\n        ordersCreated.increment();\n        orderAmount.record(amount.doubleValue());\n        activeOrders.incrementAndGet();\n    }\n}\n\n// docker-compose.yml\n// services:\n//   prometheus:\n//     image: prom/prometheus\n//     volumes: [./prometheus.yml:/etc/prometheus/prometheus.yml]\n//     ports: ["9090:9090"]\n//   grafana:\n//     image: grafana/grafana\n//     ports: ["3000:3000"]\n//     environment:\n//       GF_SECURITY_ADMIN_PASSWORD: admin\n//   zipkin:\n//     image: openzipkin/zipkin\n//     ports: ["9411:9411"]\n\n// prometheus.yml\n// scrape_configs:\n//   - job_name: spring-services\n//     metrics_path: /actuator/prometheus\n//     static_configs:\n//       - targets:\n//         - product-service:8081\n//         - order-service:8083\n//         - api-gateway:8080',
      explanation: 'Каждый сервис экспортирует метрики через /actuator/prometheus. Prometheus scrapes метрики по расписанию. Grafana визуализирует данные из Prometheus. Кастомные метрики (orders.created, orders.amount) дают бизнес-аналитику в реальном времени.'
    },
    {
      id: 6,
      title: 'Задача: финальный деплой и интеграционные тесты',
      type: 'practice',
      difficulty: 'hard',
      description: 'Финальное задание: полный E2E тест микросервисной архитектуры и деплой всей системы в Docker.',
      requirements: [
        'docker-compose.yml: gateway, eureka, product-service, order-service, postgres, kafka, zookeeper, redis, prometheus, grafana, zipkin',
        'E2E тест: создание продукта -> создание заказа -> Saga -> подтверждение',
        'Testcontainers для E2E с KafkaContainer, PostgreSQLContainer',
        'Health check для всех сервисов: GET /actuator/health',
        'Нагрузочный тест: 100 concurrent users',
        'GitHub Actions CI/CD pipeline'
      ],
      hint: 'Используйте docker-compose с healthcheck для зависимостей. E2E тест ждёт Saga completion через polling (Awaitility). GitHub Actions: build -> test -> docker build -> push.',
      expectedOutput: 'docker compose up -d:\n[+] Running 11/11\n  eureka-server   Started (8761)\n  postgres        Started (5432)\n  kafka           Started (9092)\n  redis           Started (6379)\n  product-service Started (8081)\n  order-service   Started (8083)\n  api-gateway     Started (8080)\n  prometheus      Started (9090)\n  grafana         Started (3000)\n  zipkin          Started (9411)\n\nHealth Check:\n  GET :8080/actuator/health -> UP\n  GET :8081/actuator/health -> UP (db: UP, kafka: UP)\n  GET :8083/actuator/health -> UP (db: UP, kafka: UP)\n\nE2E Test (Testcontainers):\n  1. Create product -> 201\n  2. Create order -> 201 (PENDING)\n  3. Wait for Saga...\n  4. Get order -> CONFIRMED (stock reserved)\n  5. Check product stock decreased\n  Test PASSED in 12.5 seconds\n\nLoad Test (100 concurrent):\n  RPS: 850, P50: 35ms, P99: 180ms, Errors: 0%\n\nGitHub Actions: Build -> Test -> Docker Build -> Push -> Deploy\n  Status: All checks passed',
      solution: '# docker-compose.yml\nversion: "3.8"\nservices:\n  eureka:\n    build: ./eureka-server\n    ports: ["8761:8761"]\n    healthcheck:\n      test: curl -f http://localhost:8761/actuator/health || exit 1\n      interval: 10s\n      timeout: 5s\n      retries: 5\n\n  postgres:\n    image: postgres:16\n    environment:\n      POSTGRES_DB: ecommerce\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: password\n    ports: ["5432:5432"]\n\n  kafka:\n    image: confluentinc/cp-kafka:7.5.0\n    depends_on: [zookeeper]\n    environment:\n      KAFKA_BROKER_ID: 1\n      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181\n      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092\n\n  product-service:\n    build: ./product-service\n    depends_on:\n      eureka: { condition: service_healthy }\n      postgres: { condition: service_started }\n      kafka: { condition: service_started }\n    environment:\n      EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://eureka:8761/eureka/\n      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/ecommerce\n      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092\n\n  order-service:\n    build: ./order-service\n    depends_on:\n      eureka: { condition: service_healthy }\n      postgres: { condition: service_started }\n      kafka: { condition: service_started }\n\n  api-gateway:\n    build: ./api-gateway\n    ports: ["8080:8080"]\n    depends_on:\n      eureka: { condition: service_healthy }\n\n  prometheus:\n    image: prom/prometheus\n    volumes: [./prometheus.yml:/etc/prometheus/prometheus.yml]\n    ports: ["9090:9090"]\n\n  grafana:\n    image: grafana/grafana\n    ports: ["3000:3000"]\n\n  zipkin:\n    image: openzipkin/zipkin\n    ports: ["9411:9411"]\n\n// E2E Test\n@SpringBootTest\n@Testcontainers\nclass EcommerceE2ETest {\n    @Container static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>("postgres:16");\n    @Container static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.5.0"));\n\n    @Test\n    void fullOrderFlow() {\n        // 1. Create product\n        ProductDto product = webClient.post().uri("/api/products")\n            .bodyValue(new CreateProductRequest("Laptop", BigDecimal.valueOf(89000), 10))\n            .exchange().expectStatus().isCreated().returnResult(ProductDto.class).getResponseBody().blockFirst();\n\n        // 2. Create order\n        OrderDto order = webClient.post().uri("/api/orders")\n            .bodyValue(new CreateOrderRequest(List.of(new OrderItem(product.getId(), 2))))\n            .exchange().expectStatus().isCreated().returnResult(OrderDto.class).getResponseBody().blockFirst();\n        assertEquals("PENDING", order.getStatus());\n\n        // 3. Wait for Saga\n        await().atMost(10, SECONDS).until(() -> {\n            OrderDto updated = webClient.get().uri("/api/orders/" + order.getId())\n                .exchange().returnResult(OrderDto.class).getResponseBody().blockFirst();\n            return "CONFIRMED".equals(updated.getStatus());\n        });\n\n        // 4. Verify stock decreased\n        ProductDto updated = webClient.get().uri("/api/products/" + product.getId())\n            .exchange().returnResult(ProductDto.class).getResponseBody().blockFirst();\n        assertEquals(8, updated.getStock());\n    }\n}',
      explanation: 'Docker Compose с healthcheck обеспечивает правильный порядок запуска. E2E тест проверяет полный flow: создание продукта -> создание заказа -> Saga (Kafka) -> подтверждение -> проверка stock. Awaitility ждёт асинхронного результата Saga. Это финальная проверка что все микросервисы работают вместе.'
    }
  ]
}
