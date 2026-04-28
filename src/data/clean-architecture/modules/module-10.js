export default {
  id: 10,
  title: 'CQRS с Event Sourcing',
  description: 'Event Sourcing: хранение событий вместо состояния, восстановление агрегатов, проекции, snapshots и связь с CQRS.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Event Sourcing',
      type: 'theory',
      content: [
        { type: 'text', value: 'Event Sourcing (ES) — паттерн хранения данных, при котором состояние объекта сохраняется не как текущий snapshot, а как последовательность событий, которые привели к этому состоянию.' },
        { type: 'heading', value: 'Традиционный подход vs Event Sourcing' },
        { type: 'text', value: 'Традиционный подход: сохраняем текущее состояние. Баланс счёта = 1000 руб. Мы не знаем, как он стал 1000.\n\nEvent Sourcing: сохраняем все события. AccountOpened(0) → Deposited(500) → Deposited(800) → Withdrawn(300) = баланс 1000. Полная история!' },
        { type: 'heading', value: 'Преимущества Event Sourcing' },
        { type: 'list', value: [
          'Полный аудит — вся история изменений сохранена навсегда',
          'Воспроизводимость — можно восстановить состояние на любой момент времени',
          'Отладка — можно "перемотать" состояние и найти ошибку',
          'Новые проекции — можно создать новое представление данных из старых событий',
          'Temporal queries — запросы к прошлым состояниям'
        ]},
        { type: 'heading', value: 'Недостатки' },
        { type: 'list', value: [
          'Сложность реализации и поддержки',
          'Eventual consistency — данные не сразу согласованы',
          'Миграция схемы событий — старые события нельзя изменить',
          'Производительность — восстановление из длинной цепочки событий'
        ]},
        { type: 'tip', value: 'Event Sourcing и CQRS отлично дополняют друг друга. ES хранит события (Write Model), CQRS строит проекции для чтения (Read Model) из этих событий.' }
      ]
    },
    {
      id: 2,
      title: 'Event Store',
      type: 'theory',
      content: [
        { type: 'text', value: 'Event Store — хранилище событий. Каждый агрегат имеет свой поток событий (event stream), идентифицируемый по ID агрегата.' },
        { type: 'code', language: 'java', value: '// Структура события в хранилище\npublic record StoredEvent(\n    UUID eventId,          // уникальный ID события\n    String aggregateId,    // ID агрегата\n    String aggregateType,  // тип агрегата (Order, Account)\n    int version,           // версия (порядковый номер)\n    String eventType,      // тип события (OrderPlaced)\n    String payload,        // JSON-данные события\n    Instant occurredAt     // время события\n) {}\n\n// Интерфейс Event Store\npublic interface EventStore {\n    // Сохранить новые события для агрегата\n    void append(String aggregateId, List<DomainEvent> events, int expectedVersion);\n    \n    // Загрузить все события агрегата\n    List<StoredEvent> loadStream(String aggregateId);\n    \n    // Загрузить события с определённой версии\n    List<StoredEvent> loadStream(String aggregateId, int fromVersion);\n}' },
        { type: 'heading', value: 'Оптимистичная конкурентность' },
        { type: 'code', language: 'java', value: '// При сохранении проверяем версию (защита от конкурентных изменений)\npublic class PostgresEventStore implements EventStore {\n    @Override\n    public void append(String aggregateId, List<DomainEvent> events, int expectedVersion) {\n        // Проверяем, что никто не изменил агрегат с момента чтения\n        int currentVersion = getCurrentVersion(aggregateId);\n        if (currentVersion != expectedVersion) {\n            throw new ConcurrencyException(\n                "Агрегат %s был изменён: ожидали версию %d, текущая %d"\n                    .formatted(aggregateId, expectedVersion, currentVersion)\n            );\n        }\n        \n        int version = expectedVersion;\n        for (DomainEvent event : events) {\n            version++;\n            jdbc.update(\n                "INSERT INTO event_store (event_id, aggregate_id, version, event_type, payload, occurred_at) VALUES (?, ?, ?, ?, ?, ?)",\n                UUID.randomUUID(), aggregateId, version,\n                event.getClass().getSimpleName(),\n                serialize(event), Instant.now()\n            );\n        }\n    }\n}' },
        { type: 'note', value: 'Event Store — append-only. События никогда не удаляются и не изменяются. Это гарантирует целостность истории. Если нужно отменить действие — создаётся компенсирующее событие.' }
      ]
    },
    {
      id: 3,
      title: 'Восстановление агрегатов из событий',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Event Sourcing агрегат восстанавливается путём последовательного применения всех событий из его потока. Метод apply() обновляет состояние агрегата для каждого типа события.' },
        { type: 'code', language: 'java', value: '// Event-Sourced агрегат\npublic class BankAccount extends EventSourcedAggregate {\n    private String accountId;\n    private BigDecimal balance;\n    private AccountStatus status;\n    private String ownerName;\n    \n    // Конструктор для восстановления из событий\n    public static BankAccount fromEvents(List<DomainEvent> events) {\n        BankAccount account = new BankAccount();\n        for (DomainEvent event : events) {\n            account.apply(event); // применяем каждое событие\n            account.incrementVersion();\n        }\n        return account;\n    }\n    \n    // Команда: открыть счёт\n    public static BankAccount open(String accountId, String ownerName) {\n        BankAccount account = new BankAccount();\n        account.raise(new AccountOpenedEvent(accountId, ownerName, Instant.now()));\n        return account;\n    }\n    \n    // Команда: внести деньги\n    public void deposit(BigDecimal amount) {\n        if (status != AccountStatus.ACTIVE) throw new AccountClosedException();\n        if (amount.compareTo(BigDecimal.ZERO) <= 0) throw new InvalidAmountException();\n        raise(new MoneyDepositedEvent(accountId, amount, Instant.now()));\n    }\n    \n    // Команда: снять деньги\n    public void withdraw(BigDecimal amount) {\n        if (status != AccountStatus.ACTIVE) throw new AccountClosedException();\n        if (amount.compareTo(balance) > 0) throw new InsufficientFundsException();\n        raise(new MoneyWithdrawnEvent(accountId, amount, Instant.now()));\n    }\n    \n    // Apply: обновляет состояние (без побочных эффектов!)\n    @Override\n    protected void apply(DomainEvent event) {\n        switch (event) {\n            case AccountOpenedEvent e -> {\n                this.accountId = e.accountId();\n                this.ownerName = e.ownerName();\n                this.balance = BigDecimal.ZERO;\n                this.status = AccountStatus.ACTIVE;\n            }\n            case MoneyDepositedEvent e -> {\n                this.balance = this.balance.add(e.amount());\n            }\n            case MoneyWithdrawnEvent e -> {\n                this.balance = this.balance.subtract(e.amount());\n            }\n            case AccountClosedEvent e -> {\n                this.status = AccountStatus.CLOSED;\n            }\n            default -> throw new UnknownEventException(event);\n        }\n    }\n}' },
        { type: 'warning', value: 'Метод apply() должен быть детерминированным и без побочных эффектов. Он только обновляет поля агрегата. Никаких вызовов внешних сервисов, отправки email и т.д.!' }
      ]
    },
    {
      id: 4,
      title: 'Проекции (Read Models)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Проекция — Read Model, которая строится из потока событий. Проекции оптимизированы для конкретных запросов чтения. Из одного потока событий можно построить множество разных проекций.' },
        { type: 'code', language: 'typescript', value: '// Проекция: баланс счёта (для быстрого чтения)\nclass AccountBalanceProjection {\n  constructor(private db: Database) {}\n\n  async handle(event: DomainEvent): Promise<void> {\n    if (event instanceof AccountOpenedEvent) {\n      await this.db.execute(\n        "INSERT INTO account_balances (account_id, owner_name, balance, status) VALUES ($1, $2, 0, \'active\')",\n        [event.accountId, event.ownerName]\n      );\n    }\n    \n    if (event instanceof MoneyDepositedEvent) {\n      await this.db.execute(\n        "UPDATE account_balances SET balance = balance + $1 WHERE account_id = $2",\n        [event.amount, event.accountId]\n      );\n    }\n    \n    if (event instanceof MoneyWithdrawnEvent) {\n      await this.db.execute(\n        "UPDATE account_balances SET balance = balance - $1 WHERE account_id = $2",\n        [event.amount, event.accountId]\n      );\n    }\n  }\n}\n\n// Проекция: история транзакций (для отчётов)\nclass TransactionHistoryProjection {\n  constructor(private db: Database) {}\n\n  async handle(event: DomainEvent): Promise<void> {\n    if (event instanceof MoneyDepositedEvent) {\n      await this.db.execute(\n        "INSERT INTO transactions (account_id, type, amount, occurred_at) VALUES ($1, \'deposit\', $2, $3)",\n        [event.accountId, event.amount, event.occurredAt]\n      );\n    }\n    \n    if (event instanceof MoneyWithdrawnEvent) {\n      await this.db.execute(\n        "INSERT INTO transactions (account_id, type, amount, occurred_at) VALUES ($1, \'withdrawal\', $2, $3)",\n        [event.accountId, event.amount, event.occurredAt]\n      );\n    }\n  }\n}\n\n// Можно добавить новую проекцию и перестроить из истории!\nclass MonthlyReportProjection { ... }' },
        { type: 'heading', value: 'Перестройка проекций' },
        { type: 'text', value: 'Уникальное преимущество ES: если нужна новая проекция (или старая сломалась), можно пересоздать её, "проиграв" все события с начала. Это как replay видеозаписи.' },
        { type: 'tip', value: 'Проекции можно хранить в разных хранилищах: SQL для транзакций, Elasticsearch для поиска, Redis для кеша, ClickHouse для аналитики. Одни события — множество представлений.' }
      ]
    },
    {
      id: 5,
      title: 'Snapshots и оптимизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'При большом количестве событий восстановление агрегата из всей истории становится медленным. Snapshot — периодический слепок состояния, от которого начинается восстановление.' },
        { type: 'code', language: 'java', value: '// Event-Sourced Repository со Snapshot\npublic class EventSourcedAccountRepository {\n    private final EventStore eventStore;\n    private final SnapshotStore snapshotStore;\n    private static final int SNAPSHOT_THRESHOLD = 50; // каждые 50 событий\n    \n    public BankAccount findById(String accountId) {\n        // 1. Пробуем загрузить snapshot\n        Optional<Snapshot> snapshot = snapshotStore.load(accountId);\n        \n        BankAccount account;\n        int fromVersion;\n        \n        if (snapshot.isPresent()) {\n            // 2a. Восстанавливаем из snapshot\n            account = deserialize(snapshot.get().data());\n            fromVersion = snapshot.get().version();\n        } else {\n            // 2b. Создаём пустой агрегат\n            account = new BankAccount();\n            fromVersion = 0;\n        }\n        \n        // 3. Применяем события ПОСЛЕ snapshot\n        List<StoredEvent> events = eventStore.loadStream(accountId, fromVersion);\n        for (StoredEvent event : events) {\n            account.apply(deserializeEvent(event));\n        }\n        \n        return account;\n    }\n    \n    public void save(BankAccount account) {\n        eventStore.append(\n            account.id(),\n            account.uncommittedEvents(),\n            account.version()\n        );\n        \n        // Создаём snapshot, если накопилось много событий\n        if (account.version() % SNAPSHOT_THRESHOLD == 0) {\n            snapshotStore.save(new Snapshot(\n                account.id(),\n                account.version(),\n                serialize(account)\n            ));\n        }\n        \n        account.markEventsAsCommitted();\n    }\n}' },
        { type: 'heading', value: 'Другие оптимизации' },
        { type: 'list', value: [
          'Кеширование агрегатов в памяти',
          'Batch-обработка событий для проекций',
          'Async-проекции — обновление Read Model в фоне',
          'Partitioning Event Store по aggregate ID'
        ]},
        { type: 'note', value: 'Snapshot — это кеш, а не источник правды. Источник правды — всегда события. Snapshot можно удалить и пересоздать из событий.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Event Sourcing для банковского счёта',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Event Sourcing для банковского счёта с операциями deposit, withdraw и проекцией баланса.',
      requirements: [
        'Создать события: AccountOpened, MoneyDeposited, MoneyWithdrawn',
        'Реализовать Event-Sourced агрегат BankAccount с apply()',
        'Создать EventStore с append() и loadStream()',
        'Реализовать проекцию AccountBalanceProjection',
        'Восстановить агрегат из потока событий'
      ],
      hint: 'Агрегат хранит список новых событий (uncommitted). При save() они записываются в EventStore. При load() — события читаются и применяются через apply(). Проекция подписана на события и обновляет Read Model.',
      expectedOutput: 'BankAccount восстанавливается из событий: open → deposit(500) → deposit(300) → withdraw(200) = баланс 600. Проекция AccountBalance показывает текущий баланс без загрузки агрегата.',
      solution: '// Events\nclass AccountOpenedEvent {\n  constructor(public accountId: string, public ownerName: string, public occurredAt = new Date()) {}\n}\nclass MoneyDepositedEvent {\n  constructor(public accountId: string, public amount: number, public occurredAt = new Date()) {}\n}\nclass MoneyWithdrawnEvent {\n  constructor(public accountId: string, public amount: number, public occurredAt = new Date()) {}\n}\n\n// Event-Sourced Aggregate\nclass BankAccount {\n  private _id: string = "";\n  private _balance: number = 0;\n  private _status: string = "";\n  private _version: number = 0;\n  private uncommittedEvents: any[] = [];\n\n  static open(accountId: string, owner: string): BankAccount {\n    const account = new BankAccount();\n    account.raise(new AccountOpenedEvent(accountId, owner));\n    return account;\n  }\n\n  deposit(amount: number): void {\n    if (amount <= 0) throw new Error("Сумма должна быть положительной");\n    this.raise(new MoneyDepositedEvent(this._id, amount));\n  }\n\n  withdraw(amount: number): void {\n    if (amount > this._balance) throw new Error("Недостаточно средств");\n    this.raise(new MoneyWithdrawnEvent(this._id, amount));\n  }\n\n  get balance() { return this._balance; }\n  get id() { return this._id; }\n  get version() { return this._version; }\n\n  private raise(event: any): void {\n    this.apply(event);\n    this.uncommittedEvents.push(event);\n  }\n\n  apply(event: any): void {\n    if (event instanceof AccountOpenedEvent) {\n      this._id = event.accountId;\n      this._balance = 0;\n      this._status = "active";\n    } else if (event instanceof MoneyDepositedEvent) {\n      this._balance += event.amount;\n    } else if (event instanceof MoneyWithdrawnEvent) {\n      this._balance -= event.amount;\n    }\n    this._version++;\n  }\n\n  pullUncommittedEvents(): any[] {\n    const events = [...this.uncommittedEvents];\n    this.uncommittedEvents = [];\n    return events;\n  }\n\n  static fromEvents(events: any[]): BankAccount {\n    const account = new BankAccount();\n    events.forEach(e => account.apply(e));\n    return account;\n  }\n}\n\n// Event Store\nclass InMemoryEventStore {\n  private streams: Map<string, any[]> = new Map();\n\n  append(aggregateId: string, events: any[]): void {\n    const stream = this.streams.get(aggregateId) || [];\n    stream.push(...events);\n    this.streams.set(aggregateId, stream);\n  }\n\n  loadStream(aggregateId: string): any[] {\n    return this.streams.get(aggregateId) || [];\n  }\n}\n\n// Projection\nclass AccountBalanceProjection {\n  private balances: Map<string, number> = new Map();\n\n  handle(event: any): void {\n    if (event instanceof AccountOpenedEvent) {\n      this.balances.set(event.accountId, 0);\n    } else if (event instanceof MoneyDepositedEvent) {\n      const current = this.balances.get(event.accountId) || 0;\n      this.balances.set(event.accountId, current + event.amount);\n    } else if (event instanceof MoneyWithdrawnEvent) {\n      const current = this.balances.get(event.accountId) || 0;\n      this.balances.set(event.accountId, current - event.amount);\n    }\n  }\n\n  getBalance(accountId: string): number {\n    return this.balances.get(accountId) || 0;\n  }\n}',
      explanation: 'BankAccount — event-sourced агрегат. При deposit/withdraw он генерирует событие и обновляет состояние через apply(). EventStore хранит последовательность событий. BankAccount.fromEvents() восстанавливает агрегат из истории. AccountBalanceProjection — проекция, обновляющая текущий баланс по мере поступления событий. Для чтения баланса не нужно загружать агрегат — достаточно прочитать проекцию.'
    }
  ]
}
