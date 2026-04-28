export default {
  id: 11,
  title: 'Event-Driven Architecture',
  description: 'Event-Driven Architecture: события, команды, Event Sourcing, CQRS, Saga, Outbox Pattern, хореография vs оркестрация.',
  lessons: [
    {
      id: 1,
      title: 'Событие vs Команда',
      type: 'theory',
      content: [
        { type: 'text', value: 'Event-Driven Architecture (EDA) строится на двух типах сообщений: событиях (events) и командах (commands). Понимание разницы — основа правильного проектирования асинхронных систем.' },
        { type: 'heading', value: 'Event (Событие)' },
        { type: 'code', language: 'java', value: '// Event — факт, который УЖЕ произошёл.\n// Прошедшее время: OrderCreated, PaymentCompleted, UserRegistered.\n// Producer НЕ знает и НЕ контролирует, кто обработает событие.\n// Событие НЕЛЬЗЯ отменить — оно уже случилось.\n\npublic class OrderCreatedEvent {\n    String eventId;        // уникальный ID события\n    String orderId;        // бизнес-данные\n    String customerId;\n    double totalAmount;\n    long timestamp;        // когда произошло\n\n    // Event immutable — только чтение\n}\n\n// Кто слушает OrderCreated:\n// - EmailService: отправит подтверждение\n// - InventoryService: зарезервирует товары\n// - AnalyticsService: обновит статистику\n// - BonusService: начислит баллы\n// OrderService НЕ ЗНАЕТ об этих подписчиках!' },
        { type: 'heading', value: 'Command (Команда)' },
        { type: 'code', language: 'java', value: '// Command — запрос на выполнение действия.\n// Повелительное наклонение: CreateOrder, ProcessPayment, SendEmail.\n// Отправитель ЗНАЕТ получателя и ОЖИДАЕТ выполнения.\n// Команда может быть отклонена.\n\npublic class ProcessPaymentCommand {\n    String commandId;\n    String orderId;\n    double amount;\n    String paymentMethod;\n\n    // Отправляется КОНКРЕТНОМУ сервису (PaymentService)\n}\n\n// Ключевые отличия:\n// Event:   "Заказ создан" (факт, прошлое, broadcast)\n// Command: "Создай заказ" (запрос, будущее, unicast)\n//\n// Event:   0..N подписчиков\n// Command: ровно 1 обработчик\n//\n// Event:   нельзя отклонить (уже произошло)\n// Command: можно отклонить (валидация, бизнес-правила)' },
        { type: 'heading', value: 'Паттерны в EDA' },
        { type: 'list', value: [
          'Event Notification: сервис публикует событие, подписчики реагируют',
          'Event-Carried State Transfer: событие содержит все данные (не нужен запрос обратно)',
          'Event Sourcing: хранение всех событий как источник истины',
          'CQRS: разделение операций чтения и записи',
          'Saga: координация распределённых транзакций через события'
        ] },
        { type: 'tip', value: 'Правило: если сервис A говорит сервису B "сделай X" — это команда. Если сервис A говорит всем "X произошло" — это событие. События обеспечивают слабую связанность, команды — контроль.' }
      ]
    },
    {
      id: 2,
      title: 'Event Sourcing',
      type: 'theory',
      content: [
        { type: 'text', value: 'Event Sourcing — паттерн, при котором состояние объекта хранится не как текущий снимок, а как последовательность событий. Текущее состояние вычисляется путём последовательного применения всех событий. Это как банковская выписка: баланс = сумма всех операций.' },
        { type: 'heading', value: 'Традиционный подход vs Event Sourcing' },
        { type: 'code', language: 'java', value: '// Традиционный подход (State-based):\n// Таблица orders: | id | status  | amount | updated_at |\n//                 | 1  | shipped | 100.00 | 2024-01-15 |\n// Мы видим ТЕКУЩЕЕ состояние. Почему заказ shipped? Когда оплачен?\n// История ПОТЕРЯНА.\n\n// Event Sourcing:\n// Event Store:\n// | seq | aggregate_id | event_type       | data           | timestamp  |\n// | 1   | order-1      | OrderCreated     | {amount: 100}  | 2024-01-10 |\n// | 2   | order-1      | PaymentReceived  | {method: card} | 2024-01-11 |\n// | 3   | order-1      | OrderConfirmed   | {}             | 2024-01-12 |\n// | 4   | order-1      | OrderShipped     | {tracking: X}  | 2024-01-15 |\n//\n// Текущее состояние = apply(event1, event2, event3, event4)\n// ПОЛНАЯ ИСТОРИЯ! Можно "отмотать" на любой момент времени.' },
        { type: 'heading', value: 'Реализация Event Sourcing' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class EventSourcingDemo {\n    // Событие\n    static class Event {\n        String type;\n        Map<String, Object> data;\n        long timestamp;\n\n        Event(String type, Map<String, Object> data) {\n            this.type = type;\n            this.data = data;\n            this.timestamp = System.currentTimeMillis();\n        }\n    }\n\n    // Агрегат: Order\n    static class Order {\n        String id;\n        String status = "new";\n        double amount = 0;\n        String tracking = null;\n\n        // Применение события к состоянию\n        void apply(Event event) {\n            switch (event.type) {\n                case "OrderCreated":\n                    this.id = (String) event.data.get("orderId");\n                    this.amount = (Double) event.data.get("amount");\n                    this.status = "created";\n                    break;\n                case "PaymentReceived":\n                    this.status = "paid";\n                    break;\n                case "OrderShipped":\n                    this.status = "shipped";\n                    this.tracking = (String) event.data.get("tracking");\n                    break;\n                case "OrderCancelled":\n                    this.status = "cancelled";\n                    break;\n            }\n        }\n\n        // Восстановление из событий\n        static Order fromEvents(List<Event> events) {\n            Order order = new Order();\n            for (Event e : events) order.apply(e);\n            return order;\n        }\n    }\n}' },
        { type: 'heading', value: 'Преимущества и недостатки' },
        { type: 'list', value: [
          'Плюс: полная история изменений (аудит, debugging, compliance)',
          'Плюс: можно восстановить состояние на любой момент времени',
          'Плюс: естественная интеграция с Kafka (append-only log)',
          'Плюс: temporal queries — "какой был баланс 3 месяца назад?"',
          'Минус: сложность запросов (нужны проекции/read models)',
          'Минус: eventual consistency (проекции обновляются асинхронно)',
          'Минус: миграция схем событий — нельзя изменить прошлые события'
        ] },
        { type: 'warning', value: 'Event Sourcing подходит НЕ для всего. Используйте для: финансовых систем, аудит-логов, систем с complex domain logic. НЕ используйте для: простого CRUD, когда история не нужна, когда запросы по текущему состоянию критичны по latency.' }
      ]
    },
    {
      id: 3,
      title: 'CQRS',
      type: 'theory',
      content: [
        { type: 'text', value: 'CQRS (Command Query Responsibility Segregation) — паттерн разделения операций записи (commands) и чтения (queries) на разные модели. Часто используется вместе с Event Sourcing: запись через events, чтение через оптимизированные проекции.' },
        { type: 'heading', value: 'Зачем разделять чтение и запись?' },
        { type: 'code', language: 'java', value: '// Проблема: одна модель для записи И чтения\n//\n// class Order {\n//   String id;\n//   List<OrderItem> items;       // для записи — нужна вся детализация\n//   Customer customer;           // для записи — нужна валидация\n//   PaymentInfo payment;         // для записи — нужна обработка\n//   List<StatusHistory> history; // для записи — нужна история\n// }\n//\n// Запрос на запись: "Добавь товар в заказ"\n//   -> нужна валидация, бизнес-правила, запись в Event Store\n//   -> нормализованная модель, целостность данных\n//\n// Запрос на чтение: "Покажи список заказов"\n//   -> нужна денормализованная модель, JOIN-ы дорогие\n//   -> другие поля (summary), другой формат (DTO)\n//\n// CQRS: две РАЗНЫЕ модели для РАЗНЫХ задач' },
        { type: 'heading', value: 'CQRS Architecture' },
        { type: 'code', language: 'java', value: '// CQRS Architecture:\n//\n// [Client]\n//    |\n//    |-- Command (запись) --> [Command Service]\n//    |                          |\n//    |                          v\n//    |                      [Event Store]\n//    |                          |\n//    |                          v (events)\n//    |                      [Projection Service]\n//    |                          |\n//    |                          v\n//    |-- Query (чтение) --> [Read Database] <-- оптимизированная для чтения\n//\n// Command Side:\n//   - Валидация и бизнес-логика\n//   - Пишет события в Event Store (Kafka topic)\n//   - Нормализованная модель\n//\n// Query Side:\n//   - Projection Service слушает события\n//   - Обновляет Read Database (денормализованная)\n//   - Оптимизированная для конкретных запросов\n//   - Можно иметь НЕСКОЛЬКО read databases для разных запросов' },
        { type: 'heading', value: 'Пример: Order Read Model' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class CqrsDemo {\n    // Write Model: events\n    static List<Map<String, Object>> eventStore = new ArrayList<>();\n\n    // Read Model: оптимизирована для запросов\n    static Map<String, Map<String, Object>> orderSummaries = new LinkedHashMap<>();\n\n    // Command: создать заказ\n    static void createOrder(String orderId, String customer, double amount) {\n        Map<String, Object> event = new HashMap<>();\n        event.put("type", "OrderCreated");\n        event.put("orderId", orderId);\n        event.put("customer", customer);\n        event.put("amount", amount);\n        eventStore.add(event);\n        updateProjection(event);\n    }\n\n    // Projection: обновляет read model\n    static void updateProjection(Map<String, Object> event) {\n        String orderId = (String) event.get("orderId");\n        switch ((String) event.get("type")) {\n            case "OrderCreated":\n                Map<String, Object> summary = new HashMap<>();\n                summary.put("customer", event.get("customer"));\n                summary.put("amount", event.get("amount"));\n                summary.put("status", "created");\n                orderSummaries.put(orderId, summary);\n                break;\n            case "OrderShipped":\n                orderSummaries.get(orderId).put("status", "shipped");\n                break;\n        }\n    }\n\n    // Query: чтение из оптимизированной модели\n    static Map<String, Object> getOrderSummary(String orderId) {\n        return orderSummaries.get(orderId);\n    }\n}' },
        { type: 'note', value: 'CQRS + Event Sourcing — мощная комбинация, но добавляет сложность: eventual consistency, синхронизация моделей, управление проекциями. Используйте когда профили чтения и записи СУЩЕСТВЕННО различаются.' }
      ]
    },
    {
      id: 4,
      title: 'Saga Pattern',
      type: 'theory',
      content: [
        { type: 'text', value: 'Saga — паттерн для управления распределёнными транзакциями, которые охватывают несколько сервисов. Вместо одной большой транзакции (2PC) Saga разбивает её на серию локальных транзакций с компенсирующими действиями при ошибке.' },
        { type: 'heading', value: 'Проблема распределённых транзакций' },
        { type: 'code', language: 'java', value: '// Оформление заказа затрагивает 4 сервиса:\n// 1. OrderService: создать заказ\n// 2. PaymentService: списать деньги\n// 3. InventoryService: зарезервировать товары\n// 4. DeliveryService: создать доставку\n//\n// Проблема: если шаг 3 (резерв) провалился, нужно:\n// - Отменить оплату (шаг 2) — компенсирующая транзакция\n// - Отменить заказ (шаг 1) — компенсирующая транзакция\n//\n// 2PC (Two-Phase Commit) — плохо для микросервисов:\n// - Блокирует ресурсы на время всей транзакции\n// - Координатор — single point of failure\n// - Не масштабируется\n//\n// Saga — альтернатива:\n// Каждый шаг — локальная транзакция + событие\n// Если шаг провалился — выполняются компенсирующие действия' },
        { type: 'heading', value: 'Хореография vs Оркестрация' },
        { type: 'code', language: 'java', value: '// ХОРЕОГРАФИЯ: сервисы сами решают что делать по событиям\n//\n// OrderService --OrderCreated--> PaymentService\n// PaymentService --PaymentCompleted--> InventoryService\n// InventoryService --InventoryReserved--> DeliveryService\n//\n// Плюсы: простота, слабая связанность, нет единой точки отказа\n// Минусы: сложно отследить flow, неявные зависимости\n\n// ОРКЕСТРАЦИЯ: центральный координатор управляет шагами\n//\n// OrderSaga (orchestrator):\n//   1. -> PaymentService:  "Спиши деньги"\n//   2. <- PaymentService:  "Деньги списаны"\n//   3. -> InventoryService: "Зарезервируй товары"\n//   4. <- InventoryService: "ОШИБКА: нет на складе"\n//   5. -> PaymentService:  "ВЕРНИ деньги" (компенсация)\n//\n// Плюсы: явный flow, легко отслеживать, простая отладка\n// Минусы: оркестратор — потенциальная единая точка отказа' },
        { type: 'heading', value: 'Компенсирующие транзакции' },
        { type: 'code', language: 'java', value: '// Каждый шаг Saga имеет компенсирующее действие:\n//\n// Шаг                    | Компенсация\n// -----------------------------------------------\n// CreateOrder            | CancelOrder\n// ChargePayment          | RefundPayment\n// ReserveInventory       | ReleaseInventory\n// CreateShipment          | CancelShipment\n//\n// Успешная Saga:\n// CreateOrder -> ChargePayment -> ReserveInventory -> CreateShipment -> DONE\n//\n// Провальная Saga (ошибка на шаге 3):\n// CreateOrder -> ChargePayment -> ReserveInventory(FAIL)\n//                                        |\n// CancelOrder <- RefundPayment <---------+\n// (компенсации выполняются в обратном порядке)' },
        { type: 'list', value: [
          'Saga состоит из серии локальных транзакций',
          'Каждая транзакция имеет компенсирующее действие',
          'При ошибке компенсации выполняются в обратном порядке',
          'Хореография: децентрализованная, через события',
          'Оркестрация: централизованная, через координатор',
          'Saga обеспечивает eventual consistency, НЕ ACID'
        ] },
        { type: 'warning', value: 'Компенсирующие транзакции могут тоже провалиться! Нужен retry + идемпотентность для компенсаций. Также Saga не изолирует данные: другие транзакции могут видеть промежуточные состояния (lack of isolation).' }
      ]
    },
    {
      id: 5,
      title: 'Outbox Pattern',
      type: 'theory',
      content: [
        { type: 'text', value: 'Outbox Pattern решает проблему двойной записи (dual write): когда нужно атомарно обновить БД И отправить событие в Kafka. Без этого паттерна возможны потеря событий или рассинхронизация.' },
        { type: 'heading', value: 'Проблема двойной записи' },
        { type: 'code', language: 'java', value: '// Проблема Dual Write:\n//\n// void createOrder(Order order) {\n//     database.save(order);           // Шаг 1: запись в БД\n//     kafka.send("orders", order);    // Шаг 2: отправка в Kafka\n// }\n//\n// Что может пойти не так?\n//\n// Сценарий 1: БД записала, Kafka упала\n//   -> Заказ в БД есть, событие в Kafka НЕТ\n//   -> Consumer-ы не узнают о заказе\n//\n// Сценарий 2: БД записала, сервис упал ДО отправки в Kafka\n//   -> Тот же результат: данные рассинхронизированы\n//\n// Сценарий 3: Kafka записала, БД откатила транзакцию\n//   -> Событие в Kafka ЕСТЬ, заказа в БД НЕТ\n//   -> Consumer-ы обрабатывают несуществующий заказ\n//\n// Нет способа сделать атомарно БД + Kafka (разные системы)!' },
        { type: 'heading', value: 'Решение: Outbox Pattern' },
        { type: 'code', language: 'java', value: '// Outbox Pattern:\n// 1. В ОДНОЙ БД-транзакции:\n//    - Сохраняем order в таблицу orders\n//    - Сохраняем event в таблицу outbox\n// 2. Отдельный процесс (CDC/poller) читает outbox и отправляет в Kafka\n// 3. После успешной отправки — помечает запись как отправленную\n//\n// @Transactional  // одна БД-транзакция!\n// void createOrder(Order order) {\n//     orderRepo.save(order);  // таблица orders\n//     outboxRepo.save(new OutboxEvent(\n//         "OrderCreated",\n//         order.getId(),\n//         toJson(order)\n//     ));  // таблица outbox\n// }\n//\n// Таблица outbox:\n// | id | aggregate_type | aggregate_id | event_type     | payload    | sent |\n// | 1  | Order          | ORD-001      | OrderCreated   | {...}      | false|\n// | 2  | Order          | ORD-002      | OrderCreated   | {...}      | true |\n//\n// CDC (Change Data Capture) — Debezium читает WAL/binlog и пишет в Kafka\n// Polling — cron job каждые N секунд читает WHERE sent=false' },
        { type: 'heading', value: 'Варианты доставки из Outbox' },
        { type: 'list', value: [
          'Polling: SELECT * FROM outbox WHERE sent=false — простой, но с задержкой',
          'CDC (Debezium): читает WAL базы данных — мгновенно, без нагрузки на БД',
          'Transaction Log Tailing: аналог CDC для custom реализации',
          'Debezium + Kafka Connect — наиболее зрелое production решение',
          'При polling важно: идемпотентные consumers (возможны дубликаты при crash)'
        ] },
        { type: 'tip', value: 'Debezium + Kafka Connect — стандартное решение для Outbox Pattern. Debezium читает WAL PostgreSQL/MySQL и отправляет изменения в Kafka topic. Это самый надёжный и низкоlatency вариант доставки событий из БД в Kafka.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Event Sourcing система',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Event Sourcing для банковского счёта: все операции хранятся как события, баланс вычисляется из истории событий.',
      requirements: [
        'Event Store: хранит все события по aggregate ID',
        'BankAccount aggregate: apply-ит события для вычисления состояния',
        'Поддержка событий: AccountOpened, MoneyDeposited, MoneyWithdrawn',
        'Восстановление состояния из списка событий',
        'Projection: текущий баланс всех счетов',
        'Показать полную историю событий и итоговое состояние'
      ],
      hint: 'EventStore — Map<String, List<Event>>. BankAccount.fromEvents() последовательно применяет все события. Projection — отдельный Map с балансами.',
      expectedOutput: '=== Event Sourcing: Банковский счёт ===\n\nСобытия:\n  1. AccountOpened(ACC-001, owner="Иван")\n  2. MoneyDeposited(ACC-001, amount=1000)\n  3. MoneyDeposited(ACC-001, amount=500)\n  4. MoneyWithdrawn(ACC-001, amount=200)\n  5. AccountOpened(ACC-002, owner="Мария")\n  6. MoneyDeposited(ACC-002, amount=2000)\n\nВосстановление ACC-001 из событий:\n  apply AccountOpened -> balance=0, owner="Иван"\n  apply MoneyDeposited -> balance=1000\n  apply MoneyDeposited -> balance=1500\n  apply MoneyWithdrawn -> balance=1300\n  Итого: {id=ACC-001, owner="Иван", balance=1300, status=active}\n\nВосстановление ACC-002 из событий:\n  apply AccountOpened -> balance=0, owner="Мария"\n  apply MoneyDeposited -> balance=2000\n  Итого: {id=ACC-002, owner="Мария", balance=2000, status=active}\n\nProjection (все балансы):\n  ACC-001: 1300.0\n  ACC-002: 2000.0',
      solution: `import java.util.*;

public class Main {
    static class Event {
        String type;
        String aggregateId;
        Map<String, Object> data;

        Event(String type, String aggregateId, Map<String, Object> data) {
            this.type = type;
            this.aggregateId = aggregateId;
            this.data = data;
        }

        public String toString() {
            switch (type) {
                case "AccountOpened":
                    return type + "(" + aggregateId + ", owner=\\"" + data.get("owner") + "\\")";
                case "MoneyDeposited":
                case "MoneyWithdrawn":
                    return type + "(" + aggregateId + ", amount=" + data.get("amount") + ")";
                default:
                    return type + "(" + aggregateId + ")";
            }
        }
    }

    // Event Store
    static Map<String, List<Event>> eventStore = new LinkedHashMap<>();
    static List<Event> allEvents = new ArrayList<>();

    static void appendEvent(Event event) {
        allEvents.add(event);
        eventStore.computeIfAbsent(event.aggregateId, k -> new ArrayList<>()).add(event);
    }

    // Aggregate: BankAccount
    static class BankAccount {
        String id;
        String owner;
        double balance;
        String status;

        void apply(Event event) {
            switch (event.type) {
                case "AccountOpened":
                    this.id = event.aggregateId;
                    this.owner = (String) event.data.get("owner");
                    this.balance = 0;
                    this.status = "active";
                    System.out.println("  apply AccountOpened -> balance=0, owner=\\"" + owner + "\\"");
                    break;
                case "MoneyDeposited":
                    double deposit = (Double) event.data.get("amount");
                    this.balance += deposit;
                    System.out.println("  apply MoneyDeposited -> balance=" + (int) balance);
                    break;
                case "MoneyWithdrawn":
                    double withdrawal = (Double) event.data.get("amount");
                    this.balance -= withdrawal;
                    System.out.println("  apply MoneyWithdrawn -> balance=" + (int) balance);
                    break;
            }
        }

        static BankAccount fromEvents(String accountId, List<Event> events) {
            BankAccount account = new BankAccount();
            for (Event e : events) {
                account.apply(e);
            }
            return account;
        }

        public String toString() {
            return "{id=" + id + ", owner=\\"" + owner + "\\", balance="
                + (int) balance + ", status=" + status + "}";
        }
    }

    // Projection: балансы
    static Map<String, Double> balanceProjection = new LinkedHashMap<>();

    static void updateProjection(Event event) {
        String id = event.aggregateId;
        switch (event.type) {
            case "AccountOpened":
                balanceProjection.put(id, 0.0);
                break;
            case "MoneyDeposited":
                balanceProjection.merge(id, (Double) event.data.get("amount"), Double::sum);
                break;
            case "MoneyWithdrawn":
                balanceProjection.merge(id, -(Double) event.data.get("amount"), Double::sum);
                break;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Event Sourcing: Банковский счёт ===\\n");

        // Создаём события
        Event e1 = new Event("AccountOpened", "ACC-001", Map.of("owner", "Иван"));
        Event e2 = new Event("MoneyDeposited", "ACC-001", Map.of("amount", 1000.0));
        Event e3 = new Event("MoneyDeposited", "ACC-001", Map.of("amount", 500.0));
        Event e4 = new Event("MoneyWithdrawn", "ACC-001", Map.of("amount", 200.0));
        Event e5 = new Event("AccountOpened", "ACC-002", Map.of("owner", "Мария"));
        Event e6 = new Event("MoneyDeposited", "ACC-002", Map.of("amount", 2000.0));

        Event[] events = {e1, e2, e3, e4, e5, e6};

        System.out.println("События:");
        for (int i = 0; i < events.length; i++) {
            appendEvent(events[i]);
            updateProjection(events[i]);
            System.out.println("  " + (i + 1) + ". " + events[i]);
        }

        // Восстановление из событий
        System.out.println("\\nВосстановление ACC-001 из событий:");
        BankAccount acc1 = BankAccount.fromEvents("ACC-001", eventStore.get("ACC-001"));
        System.out.println("  Итого: " + acc1);

        System.out.println("\\nВосстановление ACC-002 из событий:");
        BankAccount acc2 = BankAccount.fromEvents("ACC-002", eventStore.get("ACC-002"));
        System.out.println("  Итого: " + acc2);

        // Projection
        System.out.println("\\nProjection (все балансы):");
        for (Map.Entry<String, Double> entry : balanceProjection.entrySet()) {
            System.out.println("  " + entry.getKey() + ": " + entry.getValue());
        }
    }
}`,
      explanation: 'Event Sourcing хранит ВСЕ события в Event Store. Состояние агрегата (BankAccount) восстанавливается путём последовательного apply событий. Projection — отдельная оптимизированная модель для чтения (балансы). Это даёт полный аудит, возможность отмотки и replay. Kafka идеально подходит как Event Store благодаря append-only log и retention.'
    },
    {
      id: 7,
      title: 'Практика: Saga оркестратор',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Saga оркестратор для процесса оформления заказа: OrderService -> PaymentService -> InventoryService с компенсирующими транзакциями при ошибке.',
      requirements: [
        'SagaOrchestrator с определением шагов и компенсаций',
        'Каждый шаг: action + compensation (компенсирующее действие)',
        'Успешная Saga: все 3 шага выполнены',
        'Провальная Saga: InventoryService отказывает, компенсации в обратном порядке',
        'Логирование каждого шага и компенсации',
        'Финальный статус: COMPLETED или COMPENSATED'
      ],
      hint: 'SagaStep — пара (action, compensation). execute() выполняет шаги последовательно. При ошибке — compensate() в обратном порядке начиная с предыдущего успешного шага.',
      expectedOutput: '=== Saga: Оформление заказа ===\n\n--- Saga 1: Успешный заказ ---\n  [Step 1] CreateOrder: Заказ ORD-001 создан\n  [Step 2] ProcessPayment: Оплата $500 списана\n  [Step 3] ReserveInventory: Товары зарезервированы\n  Saga ORD-001: COMPLETED ✓\n\n--- Saga 2: Ошибка на складе ---\n  [Step 1] CreateOrder: Заказ ORD-002 создан\n  [Step 2] ProcessPayment: Оплата $300 списана\n  [Step 3] ReserveInventory: ОШИБКА — нет на складе!\n  Начинаем компенсацию...\n  [Compensate 2] RefundPayment: Возврат $300\n  [Compensate 1] CancelOrder: Заказ ORD-002 отменён\n  Saga ORD-002: COMPENSATED (откат)\n\nЖурнал:\n  ORD-001: COMPLETED (3 шага)\n  ORD-002: COMPENSATED (2 шага + 2 компенсации)',
      solution: `import java.util.*;
import java.util.function.*;

public class Main {
    static class SagaStep {
        String name;
        Supplier<Boolean> action;
        Runnable compensation;

        SagaStep(String name, Supplier<Boolean> action, Runnable compensation) {
            this.name = name;
            this.action = action;
            this.compensation = compensation;
        }
    }

    static class SagaResult {
        String sagaId;
        String status;
        int stepsCompleted;
        int compensations;

        SagaResult(String sagaId, String status, int steps, int comps) {
            this.sagaId = sagaId;
            this.status = status;
            this.stepsCompleted = steps;
            this.compensations = comps;
        }
    }

    static SagaResult executeSaga(String sagaId, List<SagaStep> steps) {
        List<SagaStep> completedSteps = new ArrayList<>();

        for (int i = 0; i < steps.size(); i++) {
            SagaStep step = steps.get(i);
            boolean success = step.action.get();

            if (!success) {
                System.out.println("  Начинаем компенсацию...");
                int compensations = 0;
                for (int j = completedSteps.size() - 1; j >= 0; j--) {
                    completedSteps.get(j).compensation.run();
                    compensations++;
                }
                System.out.println("  Saga " + sagaId + ": COMPENSATED (откат)");
                return new SagaResult(sagaId, "COMPENSATED",
                    completedSteps.size(), compensations);
            }
            completedSteps.add(step);
        }

        System.out.println("  Saga " + sagaId + ": COMPLETED \\u2713");
        return new SagaResult(sagaId, "COMPLETED", completedSteps.size(), 0);
    }

    public static void main(String[] args) {
        System.out.println("=== Saga: Оформление заказа ===\\n");
        List<SagaResult> journal = new ArrayList<>();

        // Saga 1: успешная
        System.out.println("--- Saga 1: Успешный заказ ---");
        List<SagaStep> steps1 = List.of(
            new SagaStep("CreateOrder",
                () -> { System.out.println("  [Step 1] CreateOrder: Заказ ORD-001 создан"); return true; },
                () -> System.out.println("  [Compensate 1] CancelOrder: Заказ ORD-001 отменён")),
            new SagaStep("ProcessPayment",
                () -> { System.out.println("  [Step 2] ProcessPayment: Оплата $500 списана"); return true; },
                () -> System.out.println("  [Compensate 2] RefundPayment: Возврат $500")),
            new SagaStep("ReserveInventory",
                () -> { System.out.println("  [Step 3] ReserveInventory: Товары зарезервированы"); return true; },
                () -> System.out.println("  [Compensate 3] ReleaseInventory: Резерв отменён"))
        );
        journal.add(executeSaga("ORD-001", steps1));

        // Saga 2: ошибка на шаге 3
        System.out.println("\\n--- Saga 2: Ошибка на складе ---");
        List<SagaStep> steps2 = List.of(
            new SagaStep("CreateOrder",
                () -> { System.out.println("  [Step 1] CreateOrder: Заказ ORD-002 создан"); return true; },
                () -> System.out.println("  [Compensate 1] CancelOrder: Заказ ORD-002 отменён")),
            new SagaStep("ProcessPayment",
                () -> { System.out.println("  [Step 2] ProcessPayment: Оплата $300 списана"); return true; },
                () -> System.out.println("  [Compensate 2] RefundPayment: Возврат $300")),
            new SagaStep("ReserveInventory",
                () -> {
                    System.out.println("  [Step 3] ReserveInventory: ОШИБКА — нет на складе!");
                    return false;
                },
                () -> System.out.println("  [Compensate 3] ReleaseInventory: Резерв отменён"))
        );
        journal.add(executeSaga("ORD-002", steps2));

        // Журнал
        System.out.println("\\nЖурнал:");
        for (SagaResult r : journal) {
            String detail = r.status.equals("COMPLETED")
                ? r.stepsCompleted + " шага"
                : r.stepsCompleted + " шага + " + r.compensations + " компенсации";
            System.out.println("  " + r.sagaId + ": " + r.status + " (" + detail + ")");
        }
    }
}`,
      explanation: 'Saga оркестратор выполняет шаги последовательно. Каждый шаг имеет action и compensation. При успехе всех шагов — Saga COMPLETED. При ошибке — компенсации выполняются в ОБРАТНОМ порядке для всех ранее успешных шагов. Это обеспечивает eventual consistency в распределённых системах без 2PC. В production используйте с Kafka: каждый шаг — отправка команды, результат — событие.'
    }
  ]
}
