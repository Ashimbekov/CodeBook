export default {
  id: 60,
  title: 'Практикум: Kafka и события',
  description: 'Практические задачи по Apache Kafka в Spring Boot: продюсеры, консьюмеры, JSON сериализация, Dead Letter Queue, Event-Driven архитектура, Saga паттерн и Event Sourcing.',
  lessons: [
    {
      id: 1,
      title: 'Задача: KafkaTemplate продюсер',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте Kafka-продюсер с использованием KafkaTemplate для отправки сообщений в топик.',
      requirements: [
        'Конфигурация ProducerConfig с StringSerializer для ключа и значения',
        'Сервис OrderEventProducer с методом sendMessage(String topic, String key, String message)',
        'Обработка результата отправки через CompletableFuture (success/failure callbacks)',
        'REST endpoint POST /api/messages для отправки сообщения в Kafka'
      ],
      expectedOutput: 'POST /api/messages { "topic":"orders", "key":"order-1", "message":"Order created" }\n→ 200 { "status":"sent", "topic":"orders", "partition":0, "offset":42 }\n\nЛоги: "Сообщение отправлено в topic=orders, partition=0, offset=42"',
      hint: 'KafkaTemplate.send() возвращает CompletableFuture<SendResult>. Используйте whenComplete() для обработки результата.',
      solution: `// --- application.yml ---
// spring:
//   kafka:
//     bootstrap-servers: localhost:9092
//     producer:
//       key-serializer: org.apache.kafka.common.serialization.StringSerializer
//       value-serializer: org.apache.kafka.common.serialization.StringSerializer

// --- ProducerConfig ---
@Configuration
public class KafkaProducerConfig {

    @Value("\${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ProducerFactory<String, String> producerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.ACKS_CONFIG, "all");
        props.put(ProducerConfig.RETRIES_CONFIG, 3);
        return new DefaultKafkaProducerFactory<>(props);
    }

    @Bean
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}

// --- Producer Service ---
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderEventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public CompletableFuture<SendResult<String, String>> sendMessage(
            String topic, String key, String message) {

        CompletableFuture<SendResult<String, String>> future =
                kafkaTemplate.send(topic, key, message);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("Сообщение отправлено в topic={}, partition={}, offset={}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            } else {
                log.error("Ошибка отправки сообщения в topic={}: {}",
                        topic, ex.getMessage());
            }
        });

        return future;
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final OrderEventProducer producer;

    @PostMapping
    public ResponseEntity<Map<String, Object>> sendMessage(
            @RequestBody MessageRequest request) throws Exception {

        SendResult<String, String> result = producer
                .sendMessage(request.getTopic(), request.getKey(), request.getMessage())
                .get(5, TimeUnit.SECONDS);

        return ResponseEntity.ok(Map.of(
                "status", "sent",
                "topic", result.getRecordMetadata().topic(),
                "partition", result.getRecordMetadata().partition(),
                "offset", result.getRecordMetadata().offset()));
    }
}`,
      explanation: 'KafkaTemplate — основной инструмент для отправки сообщений в Kafka. ProducerConfig настраивает сериализаторы, подтверждения (acks=all для надёжности) и ретраи. CompletableFuture позволяет асинхронно обработать результат отправки. Метод send() принимает topic, key (для партиционирования) и value.'
    },
    {
      id: 2,
      title: 'Задача: @KafkaListener консьюмер',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте Kafka-консьюмер с использованием @KafkaListener для обработки сообщений из топика.',
      requirements: [
        'Конфигурация ConsumerConfig с group-id и auto-offset-reset',
        'Консьюмер с @KafkaListener для топика "orders"',
        'Обработка метаданных: partition, offset, timestamp из ConsumerRecord',
        'Обработка ошибок с логированием при неудачной обработке сообщения'
      ],
      expectedOutput: 'Kafka message received: topic=orders, partition=0, offset=42\nKey: order-1\nValue: {"orderId":1, "status":"CREATED"}\nTimestamp: 2024-03-10T12:00:00',
      hint: 'Используйте @KafkaListener(topics = "orders", groupId = "order-service"). Для доступа к метаданным принимайте ConsumerRecord<String, String> или используйте @Header аннотации.',
      solution: `// --- ConsumerConfig ---
@Configuration
public class KafkaConsumerConfig {

    @Value("\${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "order-service");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
        return new DefaultKafkaConsumerFactory<>(props);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL);
        return factory;
    }
}

// --- Consumer Service ---
@Service
@Slf4j
public class OrderEventConsumer {

    @KafkaListener(topics = "orders", groupId = "order-service")
    public void listen(ConsumerRecord<String, String> record, Acknowledgment ack) {
        try {
            log.info("Kafka message received: topic={}, partition={}, offset={}",
                    record.topic(), record.partition(), record.offset());
            log.info("Key: {}", record.key());
            log.info("Value: {}", record.value());
            log.info("Timestamp: {}",
                    Instant.ofEpochMilli(record.timestamp()).atZone(ZoneId.systemDefault()));

            processOrder(record.value());
            ack.acknowledge();

        } catch (Exception e) {
            log.error("Ошибка обработки сообщения: partition={}, offset={}, error={}",
                    record.partition(), record.offset(), e.getMessage());
            // не подтверждаем — сообщение будет повторно обработано
        }
    }

    @KafkaListener(topics = "notifications", groupId = "notification-service",
            containerFactory = "kafkaListenerContainerFactory")
    public void listenNotifications(
            @Payload String message,
            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset) {

        log.info("Notification: topic={}, partition={}, offset={}, message={}",
                topic, partition, offset, message);
    }

    private void processOrder(String orderJson) {
        // бизнес-логика обработки заказа
        log.info("Обработка заказа: {}", orderJson);
    }
}`,
      explanation: '@KafkaListener автоматически слушает указанный топик. ConsumerRecord содержит все метаданные сообщения. AckMode.MANUAL требует явного вызова ack.acknowledge() — если обработка упала, сообщение будет обработано повторно. auto-offset-reset=earliest означает чтение с начала топика при первом подключении.'
    },
    {
      id: 3,
      title: 'Задача: JSON сериализация для Kafka',
      type: 'practice',
      difficulty: 'easy',
      description: 'Настройте JSON сериализацию и десериализацию для отправки и получения Java-объектов через Kafka.',
      requirements: [
        'JsonSerializer для продюсера и JsonDeserializer для консьюмера',
        'Настройка trusted packages для десериализации',
        'Отправка DTO-объекта OrderEvent как JSON в Kafka',
        'Получение и автоматическая десериализация OrderEvent из Kafka'
      ],
      expectedOutput: 'Отправлено: OrderEvent{orderId=1, userId=42, items=["item1","item2"], total=99.99, status="CREATED"}\n→ Kafka JSON: {"orderId":1,"userId":42,"items":["item1","item2"],"total":99.99,"status":"CREATED"}\n\nПолучено: OrderEvent{orderId=1, userId=42, items=["item1","item2"], total=99.99, status="CREATED"}',
      hint: 'Для JsonDeserializer установите trusted packages: props.put(JsonDeserializer.TRUSTED_PACKAGES, "com.example.dto"). Или используйте factory.setValueDeserializer(new JsonDeserializer<>(OrderEvent.class)).',
      solution: `// --- OrderEvent DTO ---
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderEvent {
    private Long orderId;
    private Long userId;
    private List<String> items;
    private BigDecimal total;
    private String status;
    private LocalDateTime createdAt;
}

// --- JSON Producer Config ---
@Configuration
public class KafkaJsonProducerConfig {

    @Value("\${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ProducerFactory<String, OrderEvent> jsonProducerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return new DefaultKafkaProducerFactory<>(props);
    }

    @Bean
    public KafkaTemplate<String, OrderEvent> jsonKafkaTemplate() {
        return new KafkaTemplate<>(jsonProducerFactory());
    }
}

// --- JSON Consumer Config ---
@Configuration
public class KafkaJsonConsumerConfig {

    @Value("\${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public ConsumerFactory<String, OrderEvent> jsonConsumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "order-json-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "com.example.dto,com.example.event");
        props.put(JsonDeserializer.VALUE_DEFAULT_TYPE, OrderEvent.class.getName());
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        return new DefaultKafkaConsumerFactory<>(props);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, OrderEvent>
            jsonKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, OrderEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(jsonConsumerFactory());
        return factory;
    }
}

// --- JSON Producer ---
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderJsonProducer {

    private final KafkaTemplate<String, OrderEvent> jsonKafkaTemplate;

    public void sendOrderEvent(OrderEvent event) {
        jsonKafkaTemplate.send("order-events", event.getOrderId().toString(), event)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("OrderEvent отправлен: orderId={}, offset={}",
                                event.getOrderId(), result.getRecordMetadata().offset());
                    } else {
                        log.error("Ошибка отправки OrderEvent: {}", ex.getMessage());
                    }
                });
    }
}

// --- JSON Consumer ---
@Service
@Slf4j
public class OrderJsonConsumer {

    @KafkaListener(topics = "order-events", groupId = "order-json-group",
            containerFactory = "jsonKafkaListenerContainerFactory")
    public void handleOrderEvent(OrderEvent event) {
        log.info("Получен OrderEvent: orderId={}, status={}, total={}",
                event.getOrderId(), event.getStatus(), event.getTotal());
    }
}`,
      explanation: 'JsonSerializer автоматически конвертирует Java-объект в JSON при отправке. JsonDeserializer парсит JSON обратно в Java-объект при получении. TRUSTED_PACKAGES определяет пакеты, из которых разрешена десериализация — защита от атак через десериализацию. VALUE_DEFAULT_TYPE задаёт тип по умолчанию.'
    },
    {
      id: 4,
      title: 'Задача: Dead Letter Queue (DLQ)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Dead Letter Queue для обработки сообщений, которые не удалось обработать после нескольких попыток.',
      requirements: [
        'Настройка DefaultErrorHandler с BackOff стратегией',
        'DeadLetterPublishingRecoverer для отправки в DLQ топик',
        'Консьюмер для DLQ топика с логированием и алертингом',
        'Ручной retry: endpoint для повторной обработки сообщений из DLQ'
      ],
      expectedOutput: 'Сообщение в "orders" → ошибка обработки → retry 1 (через 1с) → retry 2 (через 2с) → retry 3 (через 4с) → DLQ\n\nDLQ consumer: "Сообщение перемещено в DLQ: topic=orders.DLT, key=order-1, error=NullPointerException"\n\nPOST /api/dlq/retry/orders.DLT → 200 { "reprocessed": 5 }',
      hint: 'Используйте DeadLetterPublishingRecoverer с KafkaTemplate. DefaultErrorHandler заменяет устаревший SeekToCurrentErrorHandler.',
      solution: `// --- DLQ Configuration ---
@Configuration
@RequiredArgsConstructor
public class KafkaDlqConfig {

    private final KafkaTemplate<String, String> kafkaTemplate;

    @Bean
    public DefaultErrorHandler errorHandler() {
        DeadLetterPublishingRecoverer recoverer =
                new DeadLetterPublishingRecoverer(kafkaTemplate,
                        (record, ex) -> new TopicPartition(
                                record.topic() + ".DLT", record.partition()));

        FixedBackOff backOff = new FixedBackOff(1000L, 3); // 1 секунда, 3 попытки

        DefaultErrorHandler errorHandler = new DefaultErrorHandler(recoverer, backOff);

        // Не ретраить для определённых исключений
        errorHandler.addNotRetryableExceptions(
                JsonParseException.class,
                DeserializationException.class);

        return errorHandler;
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String>
            kafkaListenerContainerFactory(ConsumerFactory<String, String> consumerFactory) {
        ConcurrentKafkaListenerContainerFactory<String, String> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        factory.setCommonErrorHandler(errorHandler());
        return factory;
    }
}

// --- Основной Consumer (может упасть) ---
@Service
@Slf4j
public class OrderConsumer {

    @KafkaListener(topics = "orders", groupId = "order-service")
    public void processOrder(ConsumerRecord<String, String> record) {
        log.info("Обработка заказа: key={}", record.key());

        OrderEvent event = parseOrder(record.value());

        if (event.getTotal() == null) {
            throw new RuntimeException("Сумма заказа не указана");
        }

        // бизнес-логика
        log.info("Заказ успешно обработан: {}", event.getOrderId());
    }
}

// --- DLQ Consumer ---
@Service
@Slf4j
@RequiredArgsConstructor
public class DlqConsumer {

    private final DlqMessageRepository dlqMessageRepository;

    @KafkaListener(topics = "orders.DLT", groupId = "dlq-handler")
    public void handleDlq(ConsumerRecord<String, String> record,
                           @Header(KafkaHeaders.EXCEPTION_MESSAGE) String errorMessage,
                           @Header(KafkaHeaders.ORIGINAL_TOPIC) String originalTopic) {

        log.error("Сообщение в DLQ: originalTopic={}, key={}, error={}",
                originalTopic, record.key(), errorMessage);

        DlqMessage dlqMessage = DlqMessage.builder()
                .originalTopic(originalTopic)
                .messageKey(record.key())
                .messageValue(record.value())
                .errorMessage(errorMessage)
                .createdAt(LocalDateTime.now())
                .retried(false)
                .build();

        dlqMessageRepository.save(dlqMessage);
    }
}

// --- DLQ Retry Controller ---
@RestController
@RequestMapping("/api/dlq")
@RequiredArgsConstructor
public class DlqController {

    private final DlqMessageRepository dlqMessageRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @PostMapping("/retry/{topic}")
    public ResponseEntity<Map<String, Integer>> retryDlqMessages(@PathVariable String topic) {
        List<DlqMessage> messages = dlqMessageRepository
                .findByOriginalTopicAndRetriedFalse(topic.replace(".DLT", ""));

        for (DlqMessage msg : messages) {
            kafkaTemplate.send(msg.getOriginalTopic(), msg.getMessageKey(), msg.getMessageValue());
            msg.setRetried(true);
            dlqMessageRepository.save(msg);
        }

        return ResponseEntity.ok(Map.of("reprocessed", messages.size()));
    }
}`,
      explanation: 'Dead Letter Queue (DLQ) — топик для сообщений, которые не удалось обработать. DefaultErrorHandler ретраит сообщение с backoff стратегией. После исчерпания попыток DeadLetterPublishingRecoverer отправляет сообщение в топик .DLT. DLQ consumer сохраняет проблемные сообщения в БД для анализа и ручного retry.'
    },
    {
      id: 5,
      title: 'Задача: Event-Driven обработка заказов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте event-driven систему обработки заказов с несколькими микросервисами, общающимися через Kafka.',
      requirements: [
        'OrderCreatedEvent → OrderPaidEvent → OrderShippedEvent цепочка событий',
        'OrderService: создание заказа, публикация OrderCreatedEvent',
        'PaymentService: слушает OrderCreated, обрабатывает оплату, публикует OrderPaidEvent',
        'ShippingService: слушает OrderPaid, создаёт отправление, публикует OrderShippedEvent'
      ],
      expectedOutput: 'POST /api/orders → OrderCreatedEvent{orderId=1, status=CREATED}\n→ PaymentService: "Оплата заказа #1 на сумму 99.99" → OrderPaidEvent{orderId=1, status=PAID}\n→ ShippingService: "Отправление заказа #1" → OrderShippedEvent{orderId=1, trackingNumber="TRK-001"}\n→ Финальный статус: Order #1 = SHIPPED',
      hint: 'Каждый сервис слушает свой топик и публикует в следующий. Используйте общий базовый класс для всех событий.',
      solution: `// --- Base Event ---
@Data @NoArgsConstructor @AllArgsConstructor
public abstract class OrderBaseEvent {
    private Long orderId;
    private String eventType;
    private LocalDateTime timestamp;
}

@Data @EqualsAndHashCode(callSuper = true)
public class OrderCreatedEvent extends OrderBaseEvent {
    private Long userId;
    private List<OrderItem> items;
    private BigDecimal total;

    public OrderCreatedEvent(Long orderId, Long userId, List<OrderItem> items, BigDecimal total) {
        super(orderId, "ORDER_CREATED", LocalDateTime.now());
        this.userId = userId;
        this.items = items;
        this.total = total;
    }
}

@Data @EqualsAndHashCode(callSuper = true)
public class OrderPaidEvent extends OrderBaseEvent {
    private String paymentId;
    private BigDecimal amount;

    public OrderPaidEvent(Long orderId, String paymentId, BigDecimal amount) {
        super(orderId, "ORDER_PAID", LocalDateTime.now());
        this.paymentId = paymentId;
        this.amount = amount;
    }
}

@Data @EqualsAndHashCode(callSuper = true)
public class OrderShippedEvent extends OrderBaseEvent {
    private String trackingNumber;

    public OrderShippedEvent(Long orderId, String trackingNumber) {
        super(orderId, "ORDER_SHIPPED", LocalDateTime.now());
        this.trackingNumber = trackingNumber;
    }
}

// --- OrderService ---
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        Order order = Order.builder()
                .userId(request.getUserId())
                .items(request.getItems())
                .total(request.getTotal())
                .status(OrderStatus.CREATED)
                .build();
        order = orderRepository.save(order);

        OrderCreatedEvent event = new OrderCreatedEvent(
                order.getId(), order.getUserId(), order.getItems(), order.getTotal());
        kafkaTemplate.send("order-created", order.getId().toString(), event);
        log.info("OrderCreatedEvent опубликован: orderId={}", order.getId());

        return order;
    }
}

// --- PaymentService ---
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "order-created", groupId = "payment-service")
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Оплата заказа #{} на сумму {}", event.getOrderId(), event.getTotal());

        String paymentId = "PAY-" + UUID.randomUUID().toString().substring(0, 8);

        OrderPaidEvent paidEvent = new OrderPaidEvent(
                event.getOrderId(), paymentId, event.getTotal());
        kafkaTemplate.send("order-paid", event.getOrderId().toString(), paidEvent);
        log.info("OrderPaidEvent опубликован: orderId={}, paymentId={}",
                event.getOrderId(), paymentId);
    }
}

// --- ShippingService ---
@Service
@RequiredArgsConstructor
@Slf4j
public class ShippingService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "order-paid", groupId = "shipping-service")
    public void handleOrderPaid(OrderPaidEvent event) {
        log.info("Отправление заказа #{}", event.getOrderId());

        String trackingNumber = "TRK-" + String.format("%06d", event.getOrderId());

        OrderShippedEvent shippedEvent = new OrderShippedEvent(
                event.getOrderId(), trackingNumber);
        kafkaTemplate.send("order-shipped", event.getOrderId().toString(), shippedEvent);
        log.info("OrderShippedEvent опубликован: orderId={}, tracking={}",
                event.getOrderId(), trackingNumber);
    }
}`,
      explanation: 'Event-Driven архитектура позволяет сервисам общаться асинхронно через события. Каждый сервис слушает свой топик и публикует результат в следующий. OrderService → order-created → PaymentService → order-paid → ShippingService → order-shipped. Сервисы независимы и могут масштабироваться отдельно.'
    },
    {
      id: 6,
      title: 'Задача: Saga паттерн',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Saga паттерн для координации распределённой транзакции: создание заказа → резервирование товара → списание оплаты → подтверждение.',
      requirements: [
        'OrderSaga: состояния CREATED → STOCK_RESERVED → PAYMENT_CHARGED → CONFIRMED',
        'Компенсирующие действия при ошибке: отмена резервирования, возврат оплаты',
        'SagaStep entity для отслеживания прогресса каждого шага',
        'Обработка ошибок на каждом этапе с откатом предыдущих шагов'
      ],
      expectedOutput: 'Успешный сценарий:\nOrderSaga[orderId=1]: CREATED → STOCK_RESERVED → PAYMENT_CHARGED → CONFIRMED\n\nСценарий с ошибкой оплаты:\nOrderSaga[orderId=2]: CREATED → STOCK_RESERVED → PAYMENT_FAILED\n→ Компенсация: отмена резервирования → ORDER_CANCELLED',
      hint: 'Каждый шаг саги публикует событие успеха или ошибки. При ошибке запускаются компенсирующие действия в обратном порядке.',
      solution: `// --- Saga States ---
public enum SagaStatus {
    CREATED, STOCK_RESERVED, STOCK_RESERVE_FAILED,
    PAYMENT_CHARGED, PAYMENT_FAILED, CONFIRMED, CANCELLED
}

// --- SagaStep Entity ---
@Entity
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SagaStep {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long orderId;
    private String stepName;
    private String status; // SUCCESS, FAILED, COMPENSATED
    private String details;
    private LocalDateTime executedAt;
}

// --- OrderSaga Orchestrator ---
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderSagaOrchestrator {

    private final OrderRepository orderRepository;
    private final SagaStepRepository sagaStepRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @KafkaListener(topics = "order-saga-start", groupId = "saga-orchestrator")
    public void startSaga(OrderCreatedEvent event) {
        log.info("Saga started for order #{}", event.getOrderId());
        saveSagaStep(event.getOrderId(), "ORDER_CREATED", "SUCCESS", "Заказ создан");

        // Шаг 1: Резервирование товара
        kafkaTemplate.send("stock-reserve-request",
                event.getOrderId().toString(), event);
    }

    @KafkaListener(topics = "stock-reserve-response", groupId = "saga-orchestrator")
    public void handleStockResponse(StockResponseEvent event) {
        if (event.isSuccess()) {
            log.info("Stock reserved for order #{}", event.getOrderId());
            saveSagaStep(event.getOrderId(), "STOCK_RESERVED", "SUCCESS", "Товар зарезервирован");

            // Шаг 2: Списание оплаты
            kafkaTemplate.send("payment-charge-request",
                    event.getOrderId().toString(), event);
        } else {
            log.error("Stock reservation failed for order #{}", event.getOrderId());
            saveSagaStep(event.getOrderId(), "STOCK_RESERVED", "FAILED", event.getReason());
            cancelOrder(event.getOrderId());
        }
    }

    @KafkaListener(topics = "payment-charge-response", groupId = "saga-orchestrator")
    public void handlePaymentResponse(PaymentResponseEvent event) {
        if (event.isSuccess()) {
            log.info("Payment charged for order #{}", event.getOrderId());
            saveSagaStep(event.getOrderId(), "PAYMENT_CHARGED", "SUCCESS", "Оплата списана");
            confirmOrder(event.getOrderId());
        } else {
            log.error("Payment failed for order #{}", event.getOrderId());
            saveSagaStep(event.getOrderId(), "PAYMENT_CHARGED", "FAILED", event.getReason());

            // Компенсация: отмена резервирования
            kafkaTemplate.send("stock-compensate",
                    event.getOrderId().toString(), event);
            saveSagaStep(event.getOrderId(), "STOCK_COMPENSATED", "SUCCESS", "Резервирование отменено");
            cancelOrder(event.getOrderId());
        }
    }

    private void confirmOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);
        saveSagaStep(orderId, "ORDER_CONFIRMED", "SUCCESS", "Заказ подтверждён");
        log.info("Saga completed successfully for order #{}", orderId);
    }

    private void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        saveSagaStep(orderId, "ORDER_CANCELLED", "SUCCESS", "Заказ отменён");
        log.info("Saga cancelled for order #{}", orderId);
    }

    private void saveSagaStep(Long orderId, String step, String status, String details) {
        sagaStepRepository.save(SagaStep.builder()
                .orderId(orderId).stepName(step).status(status)
                .details(details).executedAt(LocalDateTime.now()).build());
    }
}`,
      explanation: 'Saga паттерн координирует распределённую транзакцию через последовательность локальных транзакций. Orchestrator управляет порядком шагов. При ошибке на любом этапе запускаются компенсирующие действия в обратном порядке. SagaStep сохраняет историю выполнения для отладки и мониторинга.'
    },
    {
      id: 7,
      title: 'Задача: Kafka headers и метаданные',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте работу с Kafka headers: добавление метаданных к сообщениям, tracing, маршрутизация по заголовкам.',
      requirements: [
        'Добавление custom headers при отправке: correlationId, source, eventType',
        'Чтение headers в консьюмере через @Header аннотации',
        'Interceptor для автоматического добавления tracing headers',
        'Маршрутизация сообщений по заголовку eventType'
      ],
      expectedOutput: 'Отправлено: message="Order created", headers={correlationId:"uuid-123", source:"order-service", eventType:"ORDER_CREATED", traceId:"trace-456"}\n\nПолучено: "Обработка ORDER_CREATED с correlationId=uuid-123, traceId=trace-456"',
      hint: 'Используйте ProducerRecord с Headers для добавления заголовков. RecordHeaders().add(new RecordHeader("key", "value".getBytes())).',
      solution: `// --- Producer с Headers ---
@Service
@RequiredArgsConstructor
@Slf4j
public class HeaderAwareProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public void sendWithHeaders(String topic, String key, String value,
                                 Map<String, String> headers) {
        RecordHeaders recordHeaders = new RecordHeaders();
        headers.forEach((k, v) ->
                recordHeaders.add(new RecordHeader(k, v.getBytes(StandardCharsets.UTF_8))));

        // Добавляем correlationId
        String correlationId = UUID.randomUUID().toString();
        recordHeaders.add(new RecordHeader("correlationId",
                correlationId.getBytes(StandardCharsets.UTF_8)));

        ProducerRecord<String, String> record =
                new ProducerRecord<>(topic, null, key, value, recordHeaders);

        kafkaTemplate.send(record).whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("Sent with correlationId={}: topic={}, offset={}",
                        correlationId, topic, result.getRecordMetadata().offset());
            }
        });
    }
}

// --- Tracing Interceptor ---
public class TracingProducerInterceptor implements ProducerInterceptor<String, String> {

    @Override
    public ProducerRecord<String, String> onSend(ProducerRecord<String, String> record) {
        record.headers().add("traceId",
                UUID.randomUUID().toString().getBytes(StandardCharsets.UTF_8));
        record.headers().add("timestamp",
                Instant.now().toString().getBytes(StandardCharsets.UTF_8));
        record.headers().add("source",
                "order-service".getBytes(StandardCharsets.UTF_8));
        return record;
    }

    @Override
    public void onAcknowledgement(RecordMetadata metadata, Exception exception) {}
    @Override
    public void close() {}
    @Override
    public void configure(Map<String, ?> configs) {}
}

// --- Consumer с Headers ---
@Service
@Slf4j
public class HeaderAwareConsumer {

    @KafkaListener(topics = "order-events", groupId = "header-consumer")
    public void consume(
            @Payload String message,
            @Header("correlationId") String correlationId,
            @Header("eventType") String eventType,
            @Header(name = "traceId", required = false) String traceId) {

        log.info("Обработка {} с correlationId={}, traceId={}",
                eventType, correlationId, traceId);

        switch (eventType) {
            case "ORDER_CREATED" -> handleOrderCreated(message);
            case "ORDER_PAID" -> handleOrderPaid(message);
            case "ORDER_SHIPPED" -> handleOrderShipped(message);
            default -> log.warn("Неизвестный тип события: {}", eventType);
        }
    }

    private void handleOrderCreated(String message) {
        log.info("Обработка создания заказа: {}", message);
    }
    private void handleOrderPaid(String message) {
        log.info("Обработка оплаты: {}", message);
    }
    private void handleOrderShipped(String message) {
        log.info("Обработка отправки: {}", message);
    }
}

// --- Config с Interceptor ---
@Configuration
public class KafkaInterceptorConfig {

    @Bean
    public ProducerFactory<String, String> producerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.INTERCEPTOR_CLASSES_CONFIG,
                TracingProducerInterceptor.class.getName());
        return new DefaultKafkaProducerFactory<>(props);
    }
}`,
      explanation: 'Kafka headers позволяют передавать метаданные без изменения тела сообщения. CorrelationId связывает запрос-ответ в распределённой системе. TraceId используется для распределённого трacing. ProducerInterceptor автоматически добавляет заголовки ко всем сообщениям. В консьюмере @Header извлекает значения заголовков.'
    },
    {
      id: 8,
      title: 'Задача: Consumer groups и партиции',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте consumer groups и работу с партициями для параллельной обработки сообщений.',
      requirements: [
        'Настройка топика с 3 партициями через NewTopic bean',
        'ConcurrentKafkaListenerContainerFactory с concurrency=3',
        'Мониторинг partition assignment через ConsumerRebalanceListener',
        'Ручное назначение партиций через @TopicPartition'
      ],
      expectedOutput: 'Topic "orders" создан с 3 партициями\n\nConsumer[0] assigned: partition 0\nConsumer[1] assigned: partition 1\nConsumer[2] assigned: partition 2\n\nMessage on partition 0: key=order-1 (hash mod 3 = 0)\nMessage on partition 1: key=order-2 (hash mod 3 = 1)',
      hint: 'Создайте NewTopic bean с numPartitions=3. Установите concurrency в ConcurrentKafkaListenerContainerFactory равным количеству партиций.',
      solution: `// --- Topic Configuration ---
@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic ordersTopic() {
        return TopicBuilder.name("orders")
                .partitions(3)
                .replicas(1)
                .config(TopicConfig.RETENTION_MS_CONFIG, "604800000") // 7 дней
                .build();
    }

    @Bean
    public NewTopic priorityOrdersTopic() {
        return TopicBuilder.name("priority-orders")
                .partitions(1)
                .replicas(1)
                .build();
    }
}

// --- Concurrent Consumer Config ---
@Configuration
public class KafkaConcurrentConsumerConfig {

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String>
            concurrentFactory(ConsumerFactory<String, String> consumerFactory) {

        ConcurrentKafkaListenerContainerFactory<String, String> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        factory.setConcurrency(3); // 3 потока = 3 партиции
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.BATCH);
        return factory;
    }
}

// --- Consumer с мониторингом партиций ---
@Service
@Slf4j
public class PartitionAwareConsumer {

    @KafkaListener(topics = "orders", groupId = "order-group",
            containerFactory = "concurrentFactory")
    public void consume(ConsumerRecord<String, String> record) {
        log.info("Thread={}, partition={}, offset={}, key={}, value={}",
                Thread.currentThread().getName(),
                record.partition(), record.offset(),
                record.key(), record.value());
    }

    // Ручное назначение конкретных партиций
    @KafkaListener(groupId = "priority-group",
            topicPartitions = @TopicPartition(
                    topic = "orders",
                    partitions = {"0"},
                    partitionOffsets = @PartitionOffset(partition = "1", initialOffset = "0")))
    public void consumePartition0And1(ConsumerRecord<String, String> record) {
        log.info("Priority consumer: partition={}, key={}", record.partition(), record.key());
    }
}

// --- Rebalance Listener ---
@Component
@Slf4j
public class CustomRebalanceListener implements ConsumerAwareRebalanceListener {

    @Override
    public void onPartitionsAssigned(Consumer<?, ?> consumer,
                                      Collection<TopicPartition> partitions) {
        partitions.forEach(p ->
                log.info("Partition assigned: topic={}, partition={}",
                        p.topic(), p.partition()));
    }

    @Override
    public void onPartitionsRevoked(Consumer<?, ?> consumer,
                                     Collection<TopicPartition> partitions) {
        partitions.forEach(p ->
                log.info("Partition revoked: topic={}, partition={}",
                        p.topic(), p.partition()));
    }

    @Override
    public void onPartitionsLost(Consumer<?, ?> consumer,
                                  Collection<TopicPartition> partitions) {
        partitions.forEach(p ->
                log.warn("Partition lost: topic={}, partition={}",
                        p.topic(), p.partition()));
    }
}`,
      explanation: 'Партиции позволяют параллельно обрабатывать сообщения. Каждый consumer в группе получает уникальный набор партиций. concurrency=3 создаёт 3 потока, каждый обрабатывает свою партицию. Ключ сообщения определяет партицию (hash mod numPartitions). RebalanceListener отслеживает перераспределение при добавлении/удалении консьюмеров.'
    },
    {
      id: 9,
      title: 'Задача: Retry механизм с @RetryableTopic',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте автоматический retry механизм с экспоненциальным backoff через @RetryableTopic.',
      requirements: [
        '@RetryableTopic с настройкой maxAttempts и backoff',
        'Экспоненциальный backoff: 1s → 2s → 4s → 8s',
        'Отдельные retry топики для каждой попытки',
        '@DltHandler для обработки сообщений после исчерпания попыток'
      ],
      expectedOutput: 'Попытка 1: orders → ошибка → retry через 1с\nПопытка 2: orders-retry-0 → ошибка → retry через 2с\nПопытка 3: orders-retry-1 → ошибка → retry через 4с\nПопытка 4: orders-retry-2 → ошибка → DLT\n\n@DltHandler: "Все попытки исчерпаны для order-1, сохранено в DLQ"',
      hint: 'Используйте @RetryableTopic(attempts = "4", backoff = @Backoff(delay = 1000, multiplier = 2)). Spring создаст retry топики автоматически.',
      solution: `// --- Retryable Consumer ---
@Service
@Slf4j
@RequiredArgsConstructor
public class RetryableOrderConsumer {

    private final OrderRepository orderRepository;
    private final DlqAlertService dlqAlertService;

    @RetryableTopic(
            attempts = "4",
            backoff = @Backoff(delay = 1000, multiplier = 2, maxDelay = 10000),
            autoCreateTopics = "true",
            topicSuffixingStrategy = TopicSuffixingStrategy.SUFFIX_WITH_INDEX_VALUE,
            dltStrategy = DltStrategy.FAIL_ON_ERROR,
            include = {RuntimeException.class, TimeoutException.class},
            exclude = {DeserializationException.class}
    )
    @KafkaListener(topics = "orders", groupId = "retryable-order-service")
    public void processOrder(ConsumerRecord<String, String> record) {
        log.info("Попытка обработки: key={}, topic={}", record.key(), record.topic());

        OrderEvent event = parseEvent(record.value());

        if (event.getTotal() == null) {
            throw new RuntimeException("Сумма заказа не указана — retry");
        }

        // Вызов внешнего сервиса (может упасть)
        boolean success = callExternalPaymentService(event);
        if (!success) {
            throw new TimeoutException("Payment service timeout");
        }

        Order order = Order.builder()
                .orderId(event.getOrderId())
                .status(OrderStatus.PROCESSED)
                .build();
        orderRepository.save(order);
        log.info("Заказ успешно обработан: {}", event.getOrderId());
    }

    @DltHandler
    public void handleDlt(ConsumerRecord<String, String> record,
                           @Header(KafkaHeaders.EXCEPTION_MESSAGE) String error) {
        log.error("Все попытки исчерпаны: key={}, error={}", record.key(), error);

        dlqAlertService.sendAlert(
                "Заказ не обработан после 4 попыток",
                record.key(),
                error);
    }

    private OrderEvent parseEvent(String json) {
        try {
            return new ObjectMapper().readValue(json, OrderEvent.class);
        } catch (Exception e) {
            throw new DeserializationException("Parse error", null, false, e);
        }
    }

    private boolean callExternalPaymentService(OrderEvent event) {
        // симуляция вызова внешнего сервиса
        return Math.random() > 0.3;
    }
}

// --- Alert Service ---
@Service
@Slf4j
public class DlqAlertService {

    public void sendAlert(String message, String key, String error) {
        log.error("DLQ ALERT: {} | key={} | error={}", message, key, error);
        // отправка уведомления (email, Slack, PagerDuty и т.д.)
    }
}`,
      explanation: '@RetryableTopic автоматически создаёт retry-топики (orders-retry-0, orders-retry-1, orders-retry-2) и DLT-топик. Экспоненциальный backoff увеличивает задержку между попытками: 1s, 2s, 4s. include/exclude определяют какие исключения ретраить. @DltHandler обрабатывает сообщения после исчерпания всех попыток.'
    },
    {
      id: 10,
      title: 'Задача: Event Sourcing с Kafka',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Event Sourcing паттерн с Kafka как event store: восстановление состояния из последовательности событий.',
      requirements: [
        'Event Store: все изменения сохраняются как события в Kafka топик',
        'Восстановление состояния аккаунта из последовательности событий (replay)',
        'Snapshot механизм для оптимизации восстановления',
        'Проекция (materialized view) для чтения текущего состояния'
      ],
      expectedOutput: 'Events для account-1:\n1. AccountCreated{balance=0}\n2. MoneyDeposited{amount=1000}\n3. MoneyWithdrawn{amount=200}\n4. MoneyDeposited{amount=500}\n\nReplay → Account{id=1, balance=1300}\n\nSnapshot[version=100] + events[101..105] → быстрое восстановление',
      hint: 'Используйте compacted Kafka topic для хранения последнего состояния (snapshot). Для replay читайте все события для конкретного ключа.',
      solution: `// --- Domain Events ---
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = AccountCreatedEvent.class, name = "ACCOUNT_CREATED"),
    @JsonSubTypes.Type(value = MoneyDepositedEvent.class, name = "MONEY_DEPOSITED"),
    @JsonSubTypes.Type(value = MoneyWithdrawnEvent.class, name = "MONEY_WITHDRAWN")
})
@Data
public abstract class AccountEvent {
    private String accountId;
    private long version;
    private LocalDateTime timestamp;
}

@Data @EqualsAndHashCode(callSuper = true)
public class AccountCreatedEvent extends AccountEvent {
    private String ownerName;
    private BigDecimal initialBalance;
}

@Data @EqualsAndHashCode(callSuper = true)
public class MoneyDepositedEvent extends AccountEvent {
    private BigDecimal amount;
    private String description;
}

@Data @EqualsAndHashCode(callSuper = true)
public class MoneyWithdrawnEvent extends AccountEvent {
    private BigDecimal amount;
    private String description;
}

// --- Aggregate ---
@Data
public class AccountAggregate {
    private String accountId;
    private String ownerName;
    private BigDecimal balance = BigDecimal.ZERO;
    private long version = 0;

    public void apply(AccountEvent event) {
        if (event instanceof AccountCreatedEvent e) {
            this.accountId = e.getAccountId();
            this.ownerName = e.getOwnerName();
            this.balance = e.getInitialBalance();
        } else if (event instanceof MoneyDepositedEvent e) {
            this.balance = this.balance.add(e.getAmount());
        } else if (event instanceof MoneyWithdrawnEvent e) {
            if (this.balance.compareTo(e.getAmount()) < 0) {
                throw new InsufficientFundsException("Недостаточно средств");
            }
            this.balance = this.balance.subtract(e.getAmount());
        }
        this.version = event.getVersion();
    }
}

// --- Event Store ---
@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaEventStore {

    private final KafkaTemplate<String, AccountEvent> kafkaTemplate;
    private final EventRepository eventRepository;

    private static final String EVENTS_TOPIC = "account-events";

    public void appendEvent(AccountEvent event) {
        // Сохраняем в БД для быстрого replay
        EventRecord record = EventRecord.builder()
                .aggregateId(event.getAccountId())
                .eventType(event.getClass().getSimpleName())
                .payload(serialize(event))
                .version(event.getVersion())
                .timestamp(event.getTimestamp())
                .build();
        eventRepository.save(record);

        // Публикуем в Kafka для проекций
        kafkaTemplate.send(EVENTS_TOPIC, event.getAccountId(), event);
        log.info("Event appended: type={}, accountId={}, version={}",
                event.getClass().getSimpleName(), event.getAccountId(), event.getVersion());
    }

    public AccountAggregate loadAggregate(String accountId) {
        AccountAggregate aggregate = new AccountAggregate();

        // Проверяем snapshot
        Optional<Snapshot> snapshot = snapshotRepository.findLatestByAccountId(accountId);
        if (snapshot.isPresent()) {
            aggregate = deserialize(snapshot.get().getData());
            log.info("Loaded snapshot: accountId={}, version={}", accountId, aggregate.getVersion());
        }

        // Replay событий после snapshot
        List<EventRecord> events = eventRepository
                .findByAggregateIdAndVersionGreaterThanOrderByVersion(
                        accountId, aggregate.getVersion());

        for (EventRecord record : events) {
            AccountEvent event = deserializeEvent(record);
            aggregate.apply(event);
        }

        log.info("Aggregate restored: accountId={}, balance={}, version={}",
                accountId, aggregate.getBalance(), aggregate.getVersion());
        return aggregate;
    }

    public void saveSnapshot(String accountId) {
        AccountAggregate aggregate = loadAggregate(accountId);
        Snapshot snapshot = Snapshot.builder()
                .aggregateId(accountId)
                .data(serialize(aggregate))
                .version(aggregate.getVersion())
                .createdAt(LocalDateTime.now())
                .build();
        snapshotRepository.save(snapshot);
        log.info("Snapshot saved: accountId={}, version={}", accountId, aggregate.getVersion());
    }
}

// --- Projection (Read Model) ---
@Service
@Slf4j
public class AccountProjection {

    @Autowired
    private AccountReadRepository accountReadRepository;

    @KafkaListener(topics = "account-events", groupId = "account-projection")
    public void onEvent(AccountEvent event) {
        AccountReadModel model = accountReadRepository.findById(event.getAccountId())
                .orElse(new AccountReadModel(event.getAccountId()));

        if (event instanceof AccountCreatedEvent e) {
            model.setOwnerName(e.getOwnerName());
            model.setBalance(e.getInitialBalance());
        } else if (event instanceof MoneyDepositedEvent e) {
            model.setBalance(model.getBalance().add(e.getAmount()));
        } else if (event instanceof MoneyWithdrawnEvent e) {
            model.setBalance(model.getBalance().subtract(e.getAmount()));
        }

        model.setLastUpdated(event.getTimestamp());
        accountReadRepository.save(model);
        log.info("Projection updated: accountId={}, balance={}",
                event.getAccountId(), model.getBalance());
    }
}`,
      explanation: 'Event Sourcing хранит все изменения как неизменяемые события. Состояние восстанавливается путём последовательного применения событий (replay). Snapshot сохраняет состояние на определённой версии для ускорения replay. Проекция (read model) обновляется при каждом событии и используется для чтения — это разделение CQRS (Command Query Responsibility Segregation).'
    }
  ]
}
