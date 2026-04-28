export default {
  id: 19,
  title: 'Event-Driven Architecture',
  description: 'Событийно-ориентированная архитектура: события, команды, запросы, брокеры сообщений, паттерны Saga и Choreography.',
  lessons: [
    {
      id: 1,
      title: 'Основы Event-Driven Architecture',
      type: 'theory',
      content: [
        { type: 'text', value: 'Event-Driven Architecture (EDA) — архитектурный стиль, где компоненты взаимодействуют через события. Компонент-отправитель не знает, кто обработает событие. Это обеспечивает максимальный декуплинг.' },
        { type: 'heading', value: 'Три типа сообщений' },
        { type: 'list', value: [
          'Event (Событие) — факт, который произошёл. "OrderPlaced". Может иметь 0 или много подписчиков.',
          'Command (Команда) — запрос на выполнение действия. "ProcessPayment". Ровно один обработчик.',
          'Query (Запрос) — запрос данных. "GetOrderDetails". Ровно один обработчик, возвращает данные.'
        ]},
        { type: 'heading', value: 'Преимущества EDA' },
        { type: 'list', value: [
          'Слабый coupling — отправитель не знает о получателях',
          'Масштабируемость — можно добавить подписчиков без изменения отправителя',
          'Отказоустойчивость — если подписчик упал, событие сохраняется в очереди',
          'Асинхронность — отправитель не ждёт обработки'
        ]},
        { type: 'tip', value: 'EDA — не silver bullet. Добавляет сложность: eventual consistency, дублирование событий, сложная отладка. Используйте для реально асинхронных процессов, не для всего подряд.' }
      ]
    },
    {
      id: 2,
      title: 'Message Broker: Kafka vs RabbitMQ',
      type: 'theory',
      content: [
        { type: 'text', value: 'Message Broker — промежуточное ПО для передачи сообщений между сервисами. Два самых популярных: Apache Kafka (лог событий) и RabbitMQ (очередь сообщений).' },
        { type: 'heading', value: 'Apache Kafka' },
        { type: 'list', value: [
          'Лог событий — события хранятся на диске, можно перечитать',
          'Высокая пропускная способность — миллионы сообщений/сек',
          'Consumer Groups — несколько потребителей читают параллельно',
          'Идеален для Event Sourcing и потоковой обработки',
          'Гарантия порядка внутри партиции'
        ]},
        { type: 'heading', value: 'RabbitMQ' },
        { type: 'list', value: [
          'Классическая очередь сообщений — сообщение удаляется после обработки',
          'Гибкая маршрутизация — exchanges, routing keys, bindings',
          'Подтверждение доставки — ack/nack',
          'Проще в настройке для небольших систем',
          'Лучше для задач типа "команда → обработчик"'
        ]},
        { type: 'code', language: 'java', value: '// Публикация события в Kafka\npublic class KafkaEventPublisher implements EventPublisher {\n    private final KafkaTemplate<String, String> kafka;\n    private final ObjectMapper mapper;\n    \n    @Override\n    public void publish(DomainEvent event) {\n        String topic = event.getClass().getSimpleName(); // "OrderPlacedEvent"\n        String key = event.aggregateId(); // для порядка в партиции\n        String payload = mapper.writeValueAsString(event);\n        \n        kafka.send(topic, key, payload);\n    }\n}\n\n// Подписка на событие в Kafka\n@KafkaListener(topics = "OrderPlacedEvent", groupId = "payment-service")\npublic void handleOrderPlaced(String payload) {\n    OrderPlacedEvent event = mapper.readValue(payload, OrderPlacedEvent.class);\n    paymentService.initiatePayment(event.orderId(), event.totalAmount());\n}' },
        { type: 'note', value: 'Kafka — для потоков событий (аналитика, Event Sourcing, логи). RabbitMQ — для задач и команд (отправка email, обработка заказа). Многие системы используют оба.' }
      ]
    },
    {
      id: 3,
      title: 'Паттерн Saga: распределённые транзакции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Saga — паттерн для управления распределёнными транзакциями через последовательность локальных транзакций и компенсирующих действий.' },
        { type: 'heading', value: 'Зачем Saga?' },
        { type: 'text', value: 'В микросервисах нет общей транзакции. Если Payment упал после того, как Order создан — нужно откатить Order. Saga координирует этот процесс.' },
        { type: 'heading', value: 'Choreography vs Orchestration' },
        { type: 'text', value: 'Choreography: каждый сервис слушает события и решает сам, что делать. Нет центрального координатора.\nOrchestration: центральный оркестратор (Saga Manager) командует сервисами.' },
        { type: 'code', language: 'java', value: '// Orchestration Saga: оркестратор управляет процессом\npublic class PlaceOrderSaga {\n    private final OrderService orderService;\n    private final PaymentService paymentService;\n    private final InventoryService inventoryService;\n    \n    public void execute(PlaceOrderCommand cmd) {\n        // Шаг 1: Создать заказ\n        OrderId orderId = orderService.createOrder(cmd);\n        \n        try {\n            // Шаг 2: Зарезервировать товар\n            inventoryService.reserve(orderId, cmd.items());\n            \n            try {\n                // Шаг 3: Провести оплату\n                paymentService.charge(orderId, cmd.totalAmount());\n            } catch (PaymentFailedException e) {\n                // Компенсация шага 2\n                inventoryService.cancelReservation(orderId);\n                // Компенсация шага 1\n                orderService.cancelOrder(orderId, "Оплата не прошла");\n                throw e;\n            }\n        } catch (InsufficientStockException e) {\n            // Компенсация шага 1\n            orderService.cancelOrder(orderId, "Товара нет на складе");\n            throw e;\n        }\n    }\n}' },
        { type: 'code', language: 'typescript', value: '// Choreography Saga: через события\n// Order Service\nclass OrderService {\n  async createOrder(cmd: CreateOrderCommand): Promise<void> {\n    const order = Order.create(cmd);\n    await this.orderRepo.save(order);\n    await this.eventBus.publish(new OrderCreatedEvent(order.id, order.items));\n  }\n\n  @OnEvent("PaymentFailed")\n  async handlePaymentFailed(event: PaymentFailedEvent): Promise<void> {\n    await this.cancelOrder(event.orderId, "Payment failed");\n  }\n}\n\n// Inventory Service\nclass InventoryService {\n  @OnEvent("OrderCreated")\n  async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {\n    try {\n      await this.reserve(event.orderId, event.items);\n      await this.eventBus.publish(new InventoryReservedEvent(event.orderId));\n    } catch (e) {\n      await this.eventBus.publish(new InventoryReservationFailedEvent(event.orderId));\n    }\n  }\n}\n\n// Payment Service\nclass PaymentService {\n  @OnEvent("InventoryReserved")\n  async handleInventoryReserved(event: InventoryReservedEvent): Promise<void> {\n    try {\n      await this.charge(event.orderId);\n      await this.eventBus.publish(new PaymentCompletedEvent(event.orderId));\n    } catch (e) {\n      await this.eventBus.publish(new PaymentFailedEvent(event.orderId));\n    }\n  }\n}' },
        { type: 'warning', value: 'Choreography проще для 2-3 шагов, но быстро становится хаосом при 5+ шагах — сложно отследить полный процесс. Orchestration проще поддерживать, но оркестратор становится единой точкой отказа.' }
      ]
    },
    {
      id: 4,
      title: 'Идемпотентность и exactly-once',
      type: 'theory',
      content: [
        { type: 'text', value: 'В EDA события могут доставляться повторно (at-least-once delivery). Обработчик должен быть идемпотентным: повторная обработка того же события не должна ломать систему.' },
        { type: 'code', language: 'java', value: '// Идемпотентный обработчик с дедупликацией\npublic class PaymentEventHandler {\n    private final ProcessedEventStore processedEvents;\n    private final PaymentService paymentService;\n    \n    public void handle(OrderPlacedEvent event) {\n        // Проверяем, не обрабатывали ли мы это событие\n        if (processedEvents.isProcessed(event.eventId())) {\n            log.info("Событие {} уже обработано, пропускаем", event.eventId());\n            return;\n        }\n        \n        // Обрабатываем\n        paymentService.initiatePayment(event.orderId(), event.totalAmount());\n        \n        // Помечаем как обработанное\n        processedEvents.markProcessed(event.eventId());\n    }\n}\n\n// Таблица обработанных событий\n// CREATE TABLE processed_events (\n//     event_id UUID PRIMARY KEY,\n//     processed_at TIMESTAMP DEFAULT NOW()\n// );' },
        { type: 'heading', value: 'Стратегии идемпотентности' },
        { type: 'list', value: [
          'Дедупликация по event_id — хранить ID обработанных событий',
          'Естественная идемпотентность — "установить статус = paid" (не "увеличить баланс")',
          'Conditional update — WHERE version = expected_version',
          'Unique constraint — БД не позволит создать дубликат'
        ]},
        { type: 'note', value: 'Exactly-once delivery невозможна в распределённых системах (теоретически доказано). Вместо этого используют at-least-once delivery + идемпотентность обработки = effectively-once.' }
      ]
    },
    {
      id: 5,
      title: 'Dead Letter Queue и обработка ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Что делать, если обработка события постоянно падает? Dead Letter Queue (DLQ) — специальная очередь для "мёртвых" сообщений, которые не удалось обработать после нескольких попыток.' },
        { type: 'heading', value: 'Стратегия обработки ошибок' },
        { type: 'list', value: [
          'Retry с exponential backoff — повторить через 1с, 2с, 4с, 8с...',
          'Dead Letter Queue — после N попыток переместить в DLQ',
          'Alerting — уведомить команду о событиях в DLQ',
          'Manual retry — после исправления бага повторить обработку из DLQ'
        ]},
        { type: 'code', language: 'typescript', value: '// Retry с exponential backoff\nclass RetryableEventHandler {\n  private maxRetries = 3;\n\n  async handleWithRetry(event: DomainEvent, handler: EventHandler): Promise<void> {\n    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {\n      try {\n        await handler.handle(event);\n        return; // успех\n      } catch (error) {\n        if (attempt === this.maxRetries) {\n          // Все попытки исчерпаны — в DLQ\n          await this.sendToDeadLetterQueue(event, error);\n          return;\n        }\n        // Exponential backoff: 1с, 2с, 4с\n        const delay = Math.pow(2, attempt - 1) * 1000;\n        await new Promise(resolve => setTimeout(resolve, delay));\n      }\n    }\n  }\n\n  private async sendToDeadLetterQueue(event: DomainEvent, error: Error): Promise<void> {\n    await this.dlqStore.save({\n      eventId: event.id,\n      eventType: event.constructor.name,\n      payload: JSON.stringify(event),\n      error: error.message,\n      failedAt: new Date(),\n    });\n    console.error(`Событие ${event.id} отправлено в DLQ: ${error.message}`);\n  }\n}' },
        { type: 'tip', value: 'DLQ — обязательный элемент EDA. Без неё "мёртвые" события блокируют очередь или теряются. Мониторинг DLQ — одна из ключевых метрик здоровья системы.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Event-Driven система',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Event-Driven систему оформления заказа с Saga, идемпотентностью и обработкой ошибок.',
      requirements: [
        'Реализовать Choreography Saga: Order → Inventory → Payment',
        'Обеспечить идемпотентность обработчиков через event_id',
        'Реализовать компенсирующие действия при ошибках',
        'Добавить Dead Letter Queue для необработанных событий',
        'Обеспечить eventual consistency между сервисами'
      ],
      hint: 'Order публикует OrderCreated. Inventory слушает и резервирует товар, публикует InventoryReserved. Payment слушает и проводит оплату. При ошибке — компенсирующие события.',
      expectedOutput: 'Полный цикл: OrderCreated → InventoryReserved → PaymentCompleted → OrderConfirmed. При ошибке оплаты: PaymentFailed → InventoryReleased → OrderCancelled.',
      solution: '// Типы событий\ninterface OrderCreatedEvent { orderId: string; items: Item[]; total: number; eventId: string; }\ninterface InventoryReservedEvent { orderId: string; eventId: string; }\ninterface PaymentCompletedEvent { orderId: string; transactionId: string; eventId: string; }\ninterface PaymentFailedEvent { orderId: string; reason: string; eventId: string; }\ninterface InventoryReleasedEvent { orderId: string; eventId: string; }\n\n// Idempotent Handler Base\nclass IdempotentHandler {\n  private processed = new Set<string>();\n  \n  isProcessed(eventId: string): boolean {\n    return this.processed.has(eventId);\n  }\n  markProcessed(eventId: string): void {\n    this.processed.add(eventId);\n  }\n}\n\n// Order Service\nclass OrderEventHandler extends IdempotentHandler {\n  async handlePaymentCompleted(event: PaymentCompletedEvent): Promise<void> {\n    if (this.isProcessed(event.eventId)) return;\n    const order = await this.orderRepo.findById(event.orderId);\n    order.confirm();\n    await this.orderRepo.save(order);\n    this.markProcessed(event.eventId);\n  }\n  \n  async handlePaymentFailed(event: PaymentFailedEvent): Promise<void> {\n    if (this.isProcessed(event.eventId)) return;\n    const order = await this.orderRepo.findById(event.orderId);\n    order.cancel(event.reason);\n    await this.orderRepo.save(order);\n    await this.eventBus.publish({ type: "OrderCancelled", orderId: event.orderId });\n    this.markProcessed(event.eventId);\n  }\n}\n\n// Inventory Service\nclass InventoryEventHandler extends IdempotentHandler {\n  async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {\n    if (this.isProcessed(event.eventId)) return;\n    try {\n      for (const item of event.items) {\n        await this.inventoryRepo.reserve(item.productId, item.quantity);\n      }\n      await this.eventBus.publish({\n        type: "InventoryReserved", orderId: event.orderId, eventId: uuid()\n      });\n    } catch (e) {\n      await this.eventBus.publish({\n        type: "InventoryReservationFailed", orderId: event.orderId, eventId: uuid()\n      });\n    }\n    this.markProcessed(event.eventId);\n  }\n  \n  async handlePaymentFailed(event: PaymentFailedEvent): Promise<void> {\n    if (this.isProcessed(event.eventId)) return;\n    await this.inventoryRepo.release(event.orderId);\n    this.markProcessed(event.eventId);\n  }\n}\n\n// Payment Service\nclass PaymentEventHandler extends IdempotentHandler {\n  async handleInventoryReserved(event: InventoryReservedEvent): Promise<void> {\n    if (this.isProcessed(event.eventId)) return;\n    try {\n      const txn = await this.paymentGateway.charge(event.orderId);\n      await this.eventBus.publish({\n        type: "PaymentCompleted", orderId: event.orderId, transactionId: txn.id, eventId: uuid()\n      });\n    } catch (e) {\n      await this.eventBus.publish({\n        type: "PaymentFailed", orderId: event.orderId, reason: e.message, eventId: uuid()\n      });\n    }\n    this.markProcessed(event.eventId);\n  }\n}',
      explanation: 'Choreography Saga: OrderCreated → Inventory резервирует → InventoryReserved → Payment списывает → PaymentCompleted → Order подтверждён. При ошибке: PaymentFailed → Inventory освобождает, Order отменяется. Каждый обработчик идемпотентен через проверку eventId. Это eventual consistency — промежуточные состояния видны, но система в итоге приходит к согласованному состоянию.'
    }
  ]
}
