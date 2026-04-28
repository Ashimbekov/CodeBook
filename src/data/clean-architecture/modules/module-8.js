export default {
  id: 8,
  title: 'DDD: Domain Events и интеграция',
  description: 'Domain Events для коммуникации между агрегатами и контекстами, паттерны публикации и подписки, eventual consistency.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Domain Events',
      type: 'theory',
      content: [
        { type: 'text', value: 'Domain Event (доменное событие) — факт, произошедший в предметной области, который важен для бизнеса. Событие описывает то, что УЖЕ произошло, поэтому именуется в прошедшем времени.' },
        { type: 'heading', value: 'Примеры Domain Events' },
        { type: 'list', value: [
          'OrderPlaced — заказ оформлен',
          'PaymentReceived — платёж получен',
          'UserRegistered — пользователь зарегистрирован',
          'InventoryDepleted — склад опустел',
          'ShipmentDelivered — посылка доставлена'
        ]},
        { type: 'heading', value: 'Зачем Domain Events?' },
        { type: 'list', value: [
          'Декуплинг между агрегатами и контекстами',
          'Eventual consistency — согласованность без распределённых транзакций',
          'Аудит — события создают историю изменений',
          'Интеграция — другие системы реагируют на события',
          'CQRS — обновление проекций чтения'
        ]},
        { type: 'code', language: 'java', value: '// Структура Domain Event\npublic record OrderPlacedEvent(\n    OrderId orderId,\n    CustomerId customerId,\n    List<OrderLineDto> items,\n    Money totalAmount,\n    Instant occurredAt\n) implements DomainEvent {\n    \n    public OrderPlacedEvent(OrderId orderId, CustomerId customerId,\n                            List<OrderLineDto> items, Money totalAmount) {\n        this(orderId, customerId, items, totalAmount, Instant.now());\n    }\n}' },
        { type: 'warning', value: 'Domain Event — это НЕ техническое событие (DBChanged, CacheInvalidated). Это бизнес-событие, понятное эксперту домена. Если бизнес-эксперт не понимает событие — это не Domain Event.' }
      ]
    },
    {
      id: 2,
      title: 'Генерация событий в агрегатах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Агрегаты генерируют события при изменении состояния. События накапливаются внутри агрегата и публикуются после сохранения.' },
        { type: 'code', language: 'java', value: '// Базовый класс для агрегатов с поддержкой событий\npublic abstract class AggregateRoot {\n    private final List<DomainEvent> domainEvents = new ArrayList<>();\n    \n    protected void raise(DomainEvent event) {\n        this.domainEvents.add(event);\n    }\n    \n    public List<DomainEvent> domainEvents() {\n        return Collections.unmodifiableList(domainEvents);\n    }\n    \n    public void clearDomainEvents() {\n        domainEvents.clear();\n    }\n}\n\n// Агрегат генерирует события\npublic class Order extends AggregateRoot {\n    private OrderId id;\n    private OrderStatus status;\n    \n    public static Order place(CustomerId customerId, List<CartItem> items) {\n        Order order = new Order();\n        order.id = OrderId.generate();\n        order.status = OrderStatus.PLACED;\n        // ... инициализация\n        \n        // Генерируем событие\n        order.raise(new OrderPlacedEvent(order.id, customerId, order.totalAmount()));\n        return order;\n    }\n    \n    public void cancel(String reason) {\n        if (this.status == OrderStatus.SHIPPED) {\n            throw new CannotCancelShippedException();\n        }\n        this.status = OrderStatus.CANCELLED;\n        raise(new OrderCancelledEvent(this.id, reason, Instant.now()));\n    }\n    \n    public void ship(TrackingNumber trackingNumber) {\n        if (this.status != OrderStatus.PAID) {\n            throw new OrderNotPaidException();\n        }\n        this.status = OrderStatus.SHIPPED;\n        raise(new OrderShippedEvent(this.id, trackingNumber));\n    }\n}' },
        { type: 'note', value: 'Событие создаётся внутри агрегата, но НЕ публикуется сразу. Оно накапливается и публикуется после успешного сохранения агрегата. Это гарантирует, что событие публикуется только если данные сохранены.' }
      ]
    },
    {
      id: 3,
      title: 'Паттерны публикации событий',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существует несколько способов публикации доменных событий. Каждый имеет свои trade-offs.' },
        { type: 'heading', value: '1. Публикация через Repository' },
        { type: 'code', language: 'java', value: '// Repository извлекает и публикует события после сохранения\npublic class JpaOrderRepository implements OrderRepository {\n    private final EntityManager em;\n    private final DomainEventPublisher eventPublisher;\n    \n    @Override\n    public void save(Order order) {\n        em.merge(toJpaEntity(order));\n        em.flush(); // сначала сохраняем\n        \n        // Затем публикуем события\n        order.domainEvents().forEach(eventPublisher::publish);\n        order.clearDomainEvents();\n    }\n}' },
        { type: 'heading', value: '2. Публикация через Application Service' },
        { type: 'code', language: 'java', value: '// Application Service извлекает события\npublic class PlaceOrderUseCase {\n    private final OrderRepository repo;\n    private final DomainEventPublisher publisher;\n    \n    public void execute(PlaceOrderCommand cmd) {\n        Order order = Order.place(cmd.customerId(), cmd.items());\n        repo.save(order);\n        \n        // Публикуем после сохранения\n        order.domainEvents().forEach(publisher::publish);\n        order.clearDomainEvents();\n    }\n}' },
        { type: 'heading', value: '3. Outbox Pattern (наиболее надёжный)' },
        { type: 'code', language: 'java', value: '// Outbox Pattern: события сохраняются в ту же транзакцию\npublic class JpaOrderRepository implements OrderRepository {\n    private final EntityManager em;\n    \n    @Override\n    @Transactional\n    public void save(Order order) {\n        em.merge(toJpaEntity(order));\n        \n        // Сохраняем события в таблицу outbox В ТОЙ ЖЕ транзакции\n        for (DomainEvent event : order.domainEvents()) {\n            OutboxMessage message = new OutboxMessage(\n                event.getClass().getSimpleName(),\n                serialize(event)\n            );\n            em.persist(message);\n        }\n        order.clearDomainEvents();\n    }\n}\n// Отдельный процесс читает outbox и публикует в Kafka/RabbitMQ' },
        { type: 'tip', value: 'Outbox Pattern гарантирует: если данные сохранены — событие тоже сохранено (одна транзакция). Отдельный компонент (CDC или polling) читает outbox и публикует события. Это самый надёжный способ.' }
      ]
    },
    {
      id: 4,
      title: 'Обработка событий',
      type: 'theory',
      content: [
        { type: 'text', value: 'Обработчики событий (Event Handlers) реагируют на Domain Events. Они могут быть синхронными (в той же транзакции) или асинхронными (в другом процессе).' },
        { type: 'heading', value: 'Синхронные обработчики' },
        { type: 'code', language: 'typescript', value: '// Синхронный обработчик — выполняется в той же транзакции\nclass UpdateInventoryOnOrderPlaced implements EventHandler<OrderPlacedEvent> {\n  constructor(private inventoryService: InventoryService) {}\n\n  handle(event: OrderPlacedEvent): void {\n    for (const item of event.items) {\n      this.inventoryService.reserve(item.productId, item.quantity);\n    }\n  }\n}' },
        { type: 'heading', value: 'Асинхронные обработчики' },
        { type: 'code', language: 'typescript', value: '// Асинхронный обработчик — выполняется отдельно\nclass SendConfirmationEmailOnOrderPlaced implements EventHandler<OrderPlacedEvent> {\n  constructor(private emailService: EmailService) {}\n\n  async handle(event: OrderPlacedEvent): Promise<void> {\n    await this.emailService.sendOrderConfirmation(\n      event.customerId,\n      event.orderId,\n      event.totalAmount\n    );\n  }\n}\n\n// Event Dispatcher\nclass DomainEventDispatcher {\n  private handlers: Map<string, EventHandler<any>[]> = new Map();\n\n  register<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): void {\n    const existing = this.handlers.get(eventType) || [];\n    this.handlers.set(eventType, [...existing, handler]);\n  }\n\n  async dispatch(event: DomainEvent): Promise<void> {\n    const eventType = event.constructor.name;\n    const handlers = this.handlers.get(eventType) || [];\n    await Promise.all(handlers.map(h => h.handle(event)));\n  }\n}' },
        { type: 'heading', value: 'Синхронные vs Асинхронные' },
        { type: 'list', value: [
          'Синхронные: strong consistency, проще отладка, но высокий coupling',
          'Асинхронные: eventual consistency, слабый coupling, масштабируемость, но сложность отладки',
          'Практика: side-effects (email, уведомления) — асинхронно; инварианты домена — синхронно'
        ]},
        { type: 'note', value: 'Обработчик события должен быть идемпотентным: повторная обработка того же события не должна ломать систему. Это важно, потому что события могут доставляться повторно.' }
      ]
    },
    {
      id: 5,
      title: 'Integration Events: связь между контекстами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Domain Events — внутренние события контекста. Integration Events — события для коммуникации между bounded contexts. Они могут передаваться через message broker (Kafka, RabbitMQ).' },
        { type: 'heading', value: 'Domain Event vs Integration Event' },
        { type: 'list', value: [
          'Domain Event: внутренний, содержит доменные объекты, синхронный или асинхронный',
          'Integration Event: внешний, содержит примитивные типы (JSON), всегда асинхронный',
          'Domain Event: изменяется свободно (внутренний контракт)',
          'Integration Event: требует версионирования (внешний контракт)'
        ]},
        { type: 'code', language: 'java', value: '// Domain Event (внутренний — используется внутри Order context)\npublic record OrderPlacedEvent(\n    OrderId orderId,\n    CustomerId customerId,\n    Money totalAmount\n) implements DomainEvent {}\n\n// Integration Event (внешний — отправляется в другие контексты)\n// Содержит только примитивные типы, версионируется\npublic record OrderPlacedIntegrationEvent(\n    String orderId,\n    String customerId,\n    double totalAmount,\n    String currency,\n    String occurredAt,\n    int version  // версия схемы\n) implements IntegrationEvent {\n    public static final int CURRENT_VERSION = 1;\n}\n\n// Маппер: Domain Event → Integration Event\npublic class OrderEventMapper {\n    public OrderPlacedIntegrationEvent toIntegration(OrderPlacedEvent event) {\n        return new OrderPlacedIntegrationEvent(\n            event.orderId().value().toString(),\n            event.customerId().value().toString(),\n            event.totalAmount().amount().doubleValue(),\n            event.totalAmount().currency().code(),\n            Instant.now().toString(),\n            OrderPlacedIntegrationEvent.CURRENT_VERSION\n        );\n    }\n}' },
        { type: 'tip', value: 'Разделяйте Domain Events и Integration Events. Domain Event — для внутреннего использования, может содержать доменные объекты. Integration Event — публичный контракт, должен содержать только примитивы и быть стабильным.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: реализация Domain Events',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте систему Domain Events для e-commerce: при оформлении заказа генерируются события, обработчики отправляют email и обновляют склад.',
      requirements: [
        'Создать Domain Events: OrderPlaced, OrderCancelled, PaymentReceived',
        'Реализовать генерацию событий в агрегате Order',
        'Создать EventDispatcher для маршрутизации событий к обработчикам',
        'Реализовать обработчики: SendEmailHandler, UpdateInventoryHandler',
        'Реализовать маппинг Domain Event → Integration Event'
      ],
      hint: 'Агрегат накапливает события в списке. После save() Application Service извлекает события и передаёт Dispatcher. Dispatcher вызывает зарегистрированные обработчики.',
      expectedOutput: 'Полный цикл: Order.place() → OrderPlacedEvent → EventDispatcher → SendEmailHandler + UpdateInventoryHandler. Integration Event отправляется в другие контексты.',
      solution: '// Domain Events\ninterface DomainEvent {\n  occurredAt: Date;\n}\n\nclass OrderPlacedEvent implements DomainEvent {\n  constructor(\n    public readonly orderId: string,\n    public readonly customerId: string,\n    public readonly items: { productId: string; quantity: number }[],\n    public readonly totalAmount: number,\n    public readonly occurredAt: Date = new Date()\n  ) {}\n}\n\nclass OrderCancelledEvent implements DomainEvent {\n  constructor(\n    public readonly orderId: string,\n    public readonly reason: string,\n    public readonly occurredAt: Date = new Date()\n  ) {}\n}\n\n// Aggregate с событиями\nclass Order {\n  private events: DomainEvent[] = [];\n  \n  static place(customerId: string, items: CartItem[]): Order {\n    const order = new Order();\n    order.id = generateId();\n    order.status = "placed";\n    order.events.push(new OrderPlacedEvent(\n      order.id, customerId,\n      items.map(i => ({ productId: i.productId, quantity: i.quantity })),\n      items.reduce((sum, i) => sum + i.price * i.quantity, 0)\n    ));\n    return order;\n  }\n  \n  pullEvents(): DomainEvent[] {\n    const events = [...this.events];\n    this.events = [];\n    return events;\n  }\n}\n\n// Event Dispatcher\nclass EventDispatcher {\n  private handlers = new Map<string, Function[]>();\n  \n  on(eventType: string, handler: Function) {\n    const list = this.handlers.get(eventType) || [];\n    list.push(handler);\n    this.handlers.set(eventType, list);\n  }\n  \n  async dispatch(event: DomainEvent) {\n    const type = event.constructor.name;\n    const handlers = this.handlers.get(type) || [];\n    await Promise.all(handlers.map(h => h(event)));\n  }\n}\n\n// Handlers\nclass SendEmailHandler {\n  async handle(event: OrderPlacedEvent) {\n    console.log(`Email: заказ ${event.orderId} оформлен`);\n  }\n}\n\nclass UpdateInventoryHandler {\n  async handle(event: OrderPlacedEvent) {\n    for (const item of event.items) {\n      console.log(`Склад: резерв ${item.quantity} шт. товара ${item.productId}`);\n    }\n  }\n}\n\n// Application Service\nclass PlaceOrderUseCase {\n  constructor(private repo: OrderRepository, private dispatcher: EventDispatcher) {}\n  \n  async execute(cmd: PlaceOrderCommand) {\n    const order = Order.place(cmd.customerId, cmd.items);\n    await this.repo.save(order);\n    const events = order.pullEvents();\n    for (const event of events) {\n      await this.dispatcher.dispatch(event);\n    }\n  }\n}',
      explanation: 'Order.place() создаёт заказ и генерирует OrderPlacedEvent. Application Service сохраняет агрегат, затем извлекает события через pullEvents() и передаёт EventDispatcher. Dispatcher вызывает все зарегистрированные обработчики. Обработчики отправляют email и резервируют товар на складе — каждый отвечает за свою задачу.'
    }
  ]
}
