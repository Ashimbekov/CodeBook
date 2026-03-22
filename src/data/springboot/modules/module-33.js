export default {
  id: 33,
  title: 'Практикум: полное приложение — E-commerce API',
  description: 'Финальный практикум: построение полноценного E-commerce REST API с нуля — каталог, корзина, заказы, платежи, уведомления и деплой в Docker',
  lessons: [
    {
      id: 1,
      title: 'Задача: доменная модель и архитектура',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спроектируйте доменную модель E-commerce приложения: Entity классы, связи, перечисления и репозитории.',
      requirements: [
        'Product: id, name, description, price, stockQuantity, categoryId, imageUrl, active',
        'Category: id, name, parentId (для подкатегорий)',
        'Cart: id, userId, items (List<CartItem>), createdAt',
        'CartItem: id, cartId, productId, quantity, priceAtTime',
        'Order: id, userId, items, totalAmount, status, shippingAddress, createdAt',
        'OrderStatus enum: PENDING, CONFIRMED, PAID, SHIPPED, DELIVERED, CANCELLED',
        'Payment: id, orderId, amount, status, provider, transactionId',
        'Настрой все связи (@OneToMany, @ManyToOne) с правильными fetch стратегиями'
      ],
      hint: 'CartItem.priceAtTime — важное поле: цена может измениться, но в заказе должна быть цена на момент покупки. FetchType.LAZY по умолчанию для коллекций.',
      solution: '@Entity\npublic class Order {\n    @Id @GeneratedValue private Long id;\n    private Long userId;\n    @OneToMany(mappedBy = "order", cascade = ALL, orphanRemoval = true)\n    private List<OrderItem> items = new ArrayList<>();\n    private BigDecimal totalAmount;\n    @Enumerated(EnumType.STRING) private OrderStatus status = OrderStatus.PENDING;\n    @Embedded private ShippingAddress shippingAddress;\n    @CreationTimestamp private LocalDateTime createdAt;\n}\n\n@Embeddable\npublic class ShippingAddress {\n    private String city;\n    private String street;\n    private String apartment;\n    private String postalCode;\n    private String phone;\n}\n\n@Entity\npublic class Product {\n    @Id @GeneratedValue private Long id;\n    @NotBlank private String name;\n    @Column(columnDefinition = "TEXT") private String description;\n    @DecimalMin("0.01") private BigDecimal price;\n    private Integer stockQuantity = 0;\n    private Long categoryId;\n    private String imageUrl;\n    private boolean active = true;\n}',
      explanation: 'BigDecimal для денежных значений — никогда double. @Embedded для ShippingAddress — хранится в той же таблице Orders. priceAtTime в CartItem фиксирует цену на момент добавления.'
    },
    {
      id: 2,
      title: 'Задача: каталог товаров с фильтрацией',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте API каталога: поиск по названию, фильтрация по категории и цене, сортировка, пагинация.',
      requirements: [
        'GET /api/products?category=1&minPrice=1000&maxPrice=50000&q=ноутбук&sort=price&page=0',
        'Использовать Spring Data JPA Specifications для динамических фильтров',
        'ProductSpecification класс с отдельными предикатами',
        'GET /api/products/{id} — детальная информация',
        'GET /api/categories — дерево категорий',
        'GET /api/products/{id}/related — похожие товары (одна категория)',
        'Кешировать список категорий через @Cacheable'
      ],
      hint: 'JPA Specification<T>: (root, query, cb) -> cb.equal(root.get("category"), categoryId). Комбинируй через Specification.where(spec1).and(spec2).',
      solution: 'public class ProductSpec {\n    public static Specification<Product> hasCategory(Long catId) {\n        return (root, q, cb) -> catId == null ? null : cb.equal(root.get("categoryId"), catId);\n    }\n    public static Specification<Product> priceBetween(BigDecimal min, BigDecimal max) {\n        return (root, q, cb) -> {\n            if (min == null && max == null) return null;\n            if (min == null) return cb.lessThanOrEqualTo(root.get("price"), max);\n            if (max == null) return cb.greaterThanOrEqualTo(root.get("price"), min);\n            return cb.between(root.get("price"), min, max);\n        };\n    }\n    public static Specification<Product> nameContains(String q) {\n        return (root, query, cb) -> q == null ? null :\n            cb.like(cb.lower(root.get("name")), "%" + q.toLowerCase() + "%");\n    }\n    public static Specification<Product> isActive() {\n        return (root, q, cb) -> cb.isTrue(root.get("active"));\n    }\n}\n\n// В сервисе\npublic Page<Product> findProducts(ProductFilter filter, Pageable pageable) {\n    Specification<Product> spec = Specification\n        .where(isActive())\n        .and(hasCategory(filter.getCategoryId()))\n        .and(priceBetween(filter.getMinPrice(), filter.getMaxPrice()))\n        .and(nameContains(filter.getQ()));\n    return repo.findAll(spec, pageable);\n}',
      explanation: 'JPA Specifications позволяют динамически комбинировать фильтры без JPQL строк. null predicates автоматически игнорируются. Repository extends JpaSpecificationExecutor для поддержки Specification.'
    },
    {
      id: 3,
      title: 'Задача: корзина покупок',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте корзину покупок: добавление/удаление товаров, изменение количества, подсчёт итоговой суммы, проверка остатков.',
      requirements: [
        'GET /api/cart — текущая корзина пользователя',
        'POST /api/cart/items — добавить товар в корзину',
        'PUT /api/cart/items/{productId} — изменить количество',
        'DELETE /api/cart/items/{productId} — удалить позицию',
        'DELETE /api/cart — очистить корзину',
        'При добавлении — проверять что товар активен и есть на складе',
        'CartResponse включает: items с актуальными ценами, totalAmount, totalItems',
        'Один пользователь — одна корзина (создавать при первом добавлении)'
      ],
      hint: 'CartService.getOrCreate() — найти корзину пользователя или создать новую. При изменении цены товара CartItem.priceAtTime должен обновляться при просмотре корзины.',
      solution: '@Service @Transactional\npublic class CartService {\n    @Autowired CartRepository cartRepo;\n    @Autowired ProductRepository productRepo;\n\n    public Cart getOrCreate(Long userId) {\n        return cartRepo.findByUserId(userId)\n            .orElseGet(() -> cartRepo.save(new Cart(userId)));\n    }\n\n    public Cart addItem(Long userId, Long productId, int quantity) {\n        Product product = productRepo.findById(productId)\n            .filter(Product::isActive)\n            .orElseThrow(() -> new ProductNotFoundException(productId));\n\n        if (product.getStockQuantity() < quantity)\n            throw new InsufficientStockException(product.getName());\n\n        Cart cart = getOrCreate(userId);\n        cart.getItems().stream()\n            .filter(i -> i.getProductId().equals(productId))\n            .findFirst()\n            .ifPresentOrElse(\n                item -> item.setQuantity(item.getQuantity() + quantity),\n                () -> cart.getItems().add(new CartItem(productId, quantity, product.getPrice()))\n            );\n        return cartRepo.save(cart);\n    }\n\n    public CartResponse toResponse(Cart cart) {\n        BigDecimal total = cart.getItems().stream()\n            .map(i -> i.getPriceAtTime().multiply(BigDecimal.valueOf(i.getQuantity())))\n            .reduce(BigDecimal.ZERO, BigDecimal::add);\n        return new CartResponse(cart.getItems(), total);\n    }\n}',
      explanation: 'ifPresentOrElse обновляет существующую позицию или добавляет новую. Проверка склада предотвращает добавление недоступных товаров. totalAmount считается в памяти без лишнего SQL.'
    },
    {
      id: 4,
      title: 'Задача: создание и управление заказами',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте flow оформления заказа: из корзины в заказ, уменьшение остатков, история заказов, отмена.',
      requirements: [
        'POST /api/orders — оформить заказ из текущей корзины',
        'Транзакционно: создать Order, уменьшить stock для каждого товара, очистить корзину',
        'GET /api/orders — история заказов пользователя с пагинацией',
        'GET /api/orders/{id} — детали заказа',
        'POST /api/orders/{id}/cancel — отменить заказ (только PENDING или CONFIRMED)',
        'При отмене — возвращать товары на склад',
        'GET /admin/orders — все заказы (только ADMIN), с фильтром по статусу',
        'Публиковать OrderCreatedEvent в Kafka после создания заказа'
      ],
      hint: '@Transactional в createOrder критически важен — если stock уменьшится но Order не сохранится, будет несоответствие данных. SELECT FOR UPDATE для stock.',
      solution: '@Service @Transactional\npublic class OrderService {\n    @Autowired OrderRepository orderRepo;\n    @Autowired ProductRepository productRepo;\n    @Autowired CartService cartService;\n    @Autowired KafkaTemplate<String, OrderCreatedEvent> kafka;\n\n    public Order createFromCart(Long userId, ShippingAddress address) {\n        Cart cart = cartService.getOrCreate(userId);\n        if (cart.getItems().isEmpty()) throw new EmptyCartException();\n\n        Order order = new Order();\n        order.setUserId(userId);\n        order.setShippingAddress(address);\n\n        BigDecimal total = BigDecimal.ZERO;\n        for (CartItem item : cart.getItems()) {\n            // SELECT FOR UPDATE — блокируем строку\n            Product product = productRepo.findByIdForUpdate(item.getProductId())\n                .orElseThrow();\n            if (product.getStockQuantity() < item.getQuantity())\n                throw new InsufficientStockException(product.getName());\n\n            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());\n            productRepo.save(product);\n\n            order.getItems().add(new OrderItem(product.getId(), item.getQuantity(),\n                item.getPriceAtTime()));\n            total = total.add(item.getPriceAtTime().multiply(BigDecimal.valueOf(item.getQuantity())));\n        }\n        order.setTotalAmount(total);\n        Order saved = orderRepo.save(order);\n\n        cartService.clear(userId);\n        kafka.send("orders", new OrderCreatedEvent(saved.getId(), userId, total));\n        return saved;\n    }\n}',
      explanation: 'SELECT FOR UPDATE предотвращает race condition при одновременном оформлении заказов. Транзакция гарантирует атомарность: либо всё сохраняется, либо ничего. Kafka публикуется после commit транзакции.'
    },
    {
      id: 5,
      title: 'Задача: интеграция платёжной системы',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте интеграцию с платёжным шлюзом: инициация платежа, обработка webhook, обновление статуса заказа.',
      requirements: [
        'POST /api/payments/initiate — создать платёж, вернуть URL для редиректа',
        'POST /api/payments/webhook — обработать callback от платёжной системы',
        'Проверка подписи webhook через HMAC-SHA256',
        'При PAYMENT_SUCCESS — изменить статус заказа на PAID, отправить email',
        'При PAYMENT_FAILED — уведомить пользователя, статус PENDING остаётся',
        'Payment сохраняется до получения финального статуса',
        'Идемпотентность: повторный webhook с тем же transactionId игнорируется'
      ],
      hint: 'HMAC проверка: HmacUtils.hmacSha256Hex(secret, payload). Сохраняй transactionId для идемпотентности. @TransactionalEventListener для обработки после commit.',
      solution: '@RestController @RequestMapping("/api/payments")\npublic class PaymentController {\n    @Autowired PaymentService paymentService;\n\n    @PostMapping("/initiate")\n    public PaymentInitResponse initiate(@RequestBody PaymentRequest req, Principal p) {\n        return paymentService.initiate(req.getOrderId(), p.getName());\n    }\n\n    @PostMapping("/webhook")\n    public ResponseEntity<Void> webhook(\n        @RequestBody String payload,\n        @RequestHeader("X-Signature") String signature) {\n        if (!paymentService.verifySignature(payload, signature)) {\n            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();\n        }\n        paymentService.processWebhook(payload);\n        return ResponseEntity.ok().build();\n    }\n}\n\n@Service @Transactional\npublic class PaymentService {\n    public void processWebhook(String payload) {\n        WebhookEvent event = parseEvent(payload);\n        if (paymentRepo.existsByTransactionId(event.getTransactionId())) return; // идемпотентность\n\n        Payment payment = paymentRepo.findByOrderId(event.getOrderId()).orElseThrow();\n        payment.setTransactionId(event.getTransactionId());\n        payment.setStatus(event.getStatus());\n        paymentRepo.save(payment);\n\n        if (PaymentStatus.SUCCESS.equals(event.getStatus())) {\n            orderService.markPaid(event.getOrderId());\n            eventPublisher.publishEvent(new PaymentSuccessEvent(event.getOrderId()));\n        }\n    }\n}',
      explanation: 'Проверка HMAC подписи предотвращает поддельные webhook. Идемпотентность по transactionId — повторные вызовы безопасны. @TransactionalEventListener гарантирует отправку email только после успешного commit.'
    },
    {
      id: 6,
      title: 'Задача: Admin Dashboard API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте API для административной панели: статистика продаж, управление товарами и заказами, бан пользователей.',
      requirements: [
        'GET /admin/stats — статистика: заказов за день/неделю/месяц, выручка, топ товары',
        'GET /admin/orders?status=PENDING&page=0 — заказы с фильтрацией',
        'PUT /admin/orders/{id}/status — изменить статус заказа',
        'POST /admin/products — создать товар',
        'PUT /admin/products/{id} — обновить товар и кеш',
        'DELETE /admin/products/{id} — soft delete (active = false)',
        'PUT /admin/users/{id}/ban — заблокировать пользователя',
        'Все /admin/** эндпоинты — только ROLE_ADMIN через @PreAuthorize'
      ],
      hint: 'Для статистики используй @Query с GROUP BY date и SUM. Stats DTO лучше сделать record. Soft delete: product.setActive(false) без физического удаления.',
      solution: '@RestController @RequestMapping("/admin")\n@PreAuthorize("hasRole(\'ADMIN\')")\npublic class AdminController {\n    @Autowired OrderRepository orderRepo;\n    @Autowired ProductService productService;\n    @Autowired UserService userService;\n\n    @GetMapping("/stats")\n    public AdminStats getStats() {\n        LocalDateTime today = LocalDate.now().atStartOfDay();\n        return new AdminStats(\n            orderRepo.countByCreatedAtAfter(today),\n            orderRepo.sumTotalByCreatedAtAfter(today),\n            orderRepo.findTopProducts(PageRequest.of(0, 5)),\n            orderRepo.countByCreatedAtAfter(today.minusDays(7))\n        );\n    }\n\n    @PutMapping("/orders/{id}/status")\n    public OrderResponse updateStatus(@PathVariable Long id,\n                                       @RequestBody UpdateStatusRequest req) {\n        return OrderResponse.from(orderService.updateStatus(id, req.getStatus()));\n    }\n\n    @PutMapping("/users/{id}/ban")\n    public void banUser(@PathVariable Long id) { userService.ban(id); }\n\n    @DeleteMapping("/products/{id}")\n    @ResponseStatus(HttpStatus.NO_CONTENT)\n    public void softDelete(@PathVariable Long id) {\n        productService.deactivate(id);  // active = false, не удаляет\n    }\n}',
      explanation: '@PreAuthorize на уровне класса применяется ко всем методам. Soft delete сохраняет историческую ссылочную целостность — заказы с этим товаром продолжают работать.'
    },
    {
      id: 7,
      title: 'Задача: полный деплой и мониторинг',
      type: 'practice',
      difficulty: 'hard',
      description: 'Финальное задание: упакуйте приложение в Docker, настройте мониторинг и напишите интеграционные тесты для основных flow.',
      requirements: [
        'Многоэтапный Dockerfile с layered JAR',
        'docker-compose.yml: app, postgres, redis, kafka, zookeeper, prometheus, grafana',
        'application-prod.properties с production настройками',
        'Spring Boot Actuator: health, prometheus endpoints',
        'Кастомный HealthIndicator для Kafka',
        'Кастомные метрики: orders.created counter, payment.processing timer',
        'OrderFlowIT: тест полного flow заказа от добавления в корзину до оплаты',
        'GitHub Actions workflow для CI'
      ],
      hint: 'Kafka HealthIndicator: попробуй listTopics() — если timeout, статус DOWN. Для IntegrationTest используй Testcontainers с KafkaContainer.',
      solution: '# docker-compose.yml\nversion: "3.8"\nservices:\n  app:\n    build: .\n    environment:\n      SPRING_PROFILES_ACTIVE: prod\n      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/shop\n      SPRING_KAFKA_BOOTSTRAP_SERVERS: kafka:9092\n    depends_on: [postgres, redis, kafka]\n\n  kafka:\n    image: confluentinc/cp-kafka:7.4.0\n    environment:\n      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181\n      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092\n\n# KafkaHealthIndicator\n@Component("kafka")\npublic class KafkaHealthIndicator implements HealthIndicator {\n    @Autowired KafkaAdmin admin;\n    public Health health() {\n        try {\n            admin.describeTopics("orders");\n            return Health.up().withDetail("broker", "kafka:9092").build();\n        } catch (Exception e) {\n            return Health.down().withDetail("error", e.getMessage()).build();\n        }\n    }\n}\n\n// OrderFlowIT\n@SpringBootTest(webEnvironment = RANDOM_PORT) @Testcontainers\nclass OrderFlowIT extends AbstractIT {\n    @Test\n    void fullOrderFlow() {\n        // 1. Добавить товар в корзину\n        // 2. Оформить заказ\n        // 3. Проверить статус PENDING\n        // 4. Симулировать webhook SUCCESS\n        // 5. Проверить статус PAID\n    }\n}',
      explanation: 'KafkaHealthIndicator проверяет реальное подключение к брокеру. Полный integration test воспроизводит реальный пользовательский flow. docker-compose объединяет всю инфраструктуру для воспроизводимого запуска.'
    },
    {
      id: 8,
      title: 'Задача: финальная оптимизация и code review',
      type: 'practice',
      difficulty: 'hard',
      description: 'Проведите полный анализ приложения: найдите и исправьте N+1 проблемы, добавьте индексы, оптимизируйте запросы, проверьте безопасность.',
      requirements: [
        'Включи Hibernate show_sql и найди N+1 запросы в OrderController',
        'Добавь @EntityGraph для Order с items и products',
        'Создай индексы на: Product.categoryId, Order.userId, Order.status, Order.createdAt',
        'Добавь составной индекс на (userId, createdAt) для истории заказов',
        'Проверь что нигде не возвращаются Entity напрямую (только DTO)',
        'Проверь что пароли хешируются BCrypt с cost 12',
        'Добавь rate limiting на /auth/login (5 попыток с IP)',
        'Напиши нагрузочный тест с Apache JMeter или k6 на GET /api/products'
      ],
      hint: 'Hibernate Statistics Bean позволяет программно считать количество запросов. В тестах можно проверить что запрос выполнен один раз.',
      solution: '// Индексы через аннотацию\n@Entity\n@Table(name = "orders", indexes = {\n    @Index(name = "idx_orders_user_id", columnList = "user_id"),\n    @Index(name = "idx_orders_status", columnList = "status"),\n    @Index(name = "idx_orders_user_created", columnList = "user_id, created_at")\n})\npublic class Order { ... }\n\n// EntityGraph для избежания N+1\npublic interface OrderRepository extends JpaRepository<Order, Long> {\n    @EntityGraph(attributePaths = {"items", "items.product"})\n    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);\n}\n\n// Hibernate statistics в тестах\n@Test\nvoid findOrdersShouldUseOneQuery() {\n    Statistics stats = sessionFactory.getStatistics();\n    stats.setStatisticsEnabled(true);\n    stats.clear();\n\n    orderService.findByUser(1L, PageRequest.of(0, 10));\n\n    assertThat(stats.getQueryExecutionCount()).isEqualTo(1);\n}',
      explanation: 'Составной индекс (userId, createdAt) оптимизирует самый частый запрос — история заказов пользователя. @EntityGraph с attributePaths загружает все нужные данные одним JOIN запросом. Statistics API позволяет тестировать количество SQL запросов.'
    }
  ]
}
