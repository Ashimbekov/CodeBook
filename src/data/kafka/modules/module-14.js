export default {
  id: 14,
  title: 'Практикум: Event-Driven задачи',
  description: 'Практические задачи по Event-Driven Architecture: события, CQRS, Saga, Outbox Pattern, Event Sourcing.',
  lessons: [
    {
      id: 1,
      title: 'Event Bus: публикация и подписка',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте Event Bus — центральный компонент для публикации событий и подписки на них. Любой сервис может подписаться на любой тип события.',
      requirements: [
        'Класс EventBus с методами subscribe(eventType, handler) и publish(event)',
        'Поддержка нескольких подписчиков на один тип события',
        'Класс Event с полями: type, source, data, timestamp',
        'Подписать 3 сервиса на разные события',
        'Опубликовать события и показать кто получил',
        'Показать подсчёт обработанных событий по каждому сервису'
      ],
      hint: 'EventBus хранит Map<String, List<Consumer<Event>>>. publish() вызывает всех подписчиков данного типа.',
      expectedOutput: '=== Event Bus ===\n\nПодписки:\n  OrderCreated -> [EmailService, InventoryService, AnalyticsService]\n  PaymentCompleted -> [OrderService, AnalyticsService]\n  OrderShipped -> [EmailService, AnalyticsService]\n\nСобытия:\n  publish OrderCreated(order=ORD-001)\n    -> EmailService: отправить подтверждение\n    -> InventoryService: зарезервировать товары\n    -> AnalyticsService: записать событие\n  publish PaymentCompleted(order=ORD-001)\n    -> OrderService: обновить статус\n    -> AnalyticsService: записать событие\n  publish OrderShipped(order=ORD-001)\n    -> EmailService: отправить трекинг\n    -> AnalyticsService: записать событие\n\nСтатистика:\n  EmailService: 2 события\n  InventoryService: 1 событие\n  AnalyticsService: 3 события\n  OrderService: 1 событие',
      solution: `import java.util.*;
import java.util.function.Consumer;

public class Main {
    static class Event {
        String type;
        String source;
        Map<String, String> data;
        Event(String type, String source, Map<String, String> data) {
            this.type = type;
            this.source = source;
            this.data = data;
        }
    }

    static Map<String, List<String>> subscriptionNames = new LinkedHashMap<>();
    static Map<String, List<Consumer<Event>>> handlers = new LinkedHashMap<>();
    static Map<String, Integer> stats = new LinkedHashMap<>();

    static void subscribe(String eventType, String serviceName, Consumer<Event> handler) {
        subscriptionNames.computeIfAbsent(eventType, k -> new ArrayList<>()).add(serviceName);
        handlers.computeIfAbsent(eventType, k -> new ArrayList<>()).add(event -> {
            handler.accept(event);
            stats.merge(serviceName, 1, Integer::sum);
        });
    }

    static void publish(Event event) {
        System.out.println("  publish " + event.type + "(order=" + event.data.get("order") + ")");
        List<Consumer<Event>> list = handlers.getOrDefault(event.type, Collections.emptyList());
        for (Consumer<Event> h : list) {
            h.accept(event);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Event Bus ===\\n");

        subscribe("OrderCreated", "EmailService",
            e -> System.out.println("    -> EmailService: отправить подтверждение"));
        subscribe("OrderCreated", "InventoryService",
            e -> System.out.println("    -> InventoryService: зарезервировать товары"));
        subscribe("OrderCreated", "AnalyticsService",
            e -> System.out.println("    -> AnalyticsService: записать событие"));

        subscribe("PaymentCompleted", "OrderService",
            e -> System.out.println("    -> OrderService: обновить статус"));
        subscribe("PaymentCompleted", "AnalyticsService",
            e -> System.out.println("    -> AnalyticsService: записать событие"));

        subscribe("OrderShipped", "EmailService",
            e -> System.out.println("    -> EmailService: отправить трекинг"));
        subscribe("OrderShipped", "AnalyticsService",
            e -> System.out.println("    -> AnalyticsService: записать событие"));

        System.out.println("Подписки:");
        for (Map.Entry<String, List<String>> e : subscriptionNames.entrySet()) {
            System.out.println("  " + e.getKey() + " -> " + e.getValue());
        }

        System.out.println("\\nСобытия:");
        publish(new Event("OrderCreated", "OrderService", Map.of("order", "ORD-001")));
        publish(new Event("PaymentCompleted", "PaymentService", Map.of("order", "ORD-001")));
        publish(new Event("OrderShipped", "ShippingService", Map.of("order", "ORD-001")));

        System.out.println("\\nСтатистика:");
        for (Map.Entry<String, Integer> e : stats.entrySet()) {
            String word = e.getValue() == 1 ? "событие" : "события";
            System.out.println("  " + e.getKey() + ": " + e.getValue() + " " + word);
        }
    }
}`,
      explanation: 'Event Bus — центральный маршрутизатор событий. Сервисы подписываются на интересующие типы событий, не зная об отправителях. Это обеспечивает слабую связанность: OrderService не знает о EmailService. В production используйте Kafka topics как Event Bus: каждый тип события — отдельный topic.'
    },
    {
      id: 2,
      title: 'Domain Events: агрегат с событиями',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте агрегат Order, который генерирует domain events при изменении состояния. События собираются и публикуются после сохранения.',
      requirements: [
        'Класс Order (агрегат) с состоянием и списком pending events',
        'Методы: create(), pay(), ship() — каждый генерирует событие',
        'События: OrderCreated, OrderPaid, OrderShipped',
        'Метод getDomainEvents() — возвращает накопленные события',
        'Метод clearDomainEvents() — очищает после публикации',
        'Показать lifecycle заказа с генерацией событий'
      ],
      hint: 'Order хранит List<DomainEvent> uncommittedEvents. Каждый метод (create/pay/ship) добавляет событие в список. После save() события публикуются и очищаются.',
      expectedOutput: '=== Domain Events ===\n\nСоздание заказа:\n  Order.create(ORD-001, amount=500)\n  Статус: CREATED\n  Pending events: [OrderCreated(ORD-001)]\n\nОплата заказа:\n  Order.pay(method=card)\n  Статус: PAID\n  Pending events: [OrderCreated(ORD-001), OrderPaid(ORD-001)]\n\nПубликация событий (после save):\n  -> OrderCreated{orderId=ORD-001, amount=500.0}\n  -> OrderPaid{orderId=ORD-001, method=card}\n  Events cleared.\n\nДоставка заказа:\n  Order.ship(tracking=TRACK-123)\n  Статус: SHIPPED\n  Pending events: [OrderShipped(ORD-001)]\n\nПубликация событий:\n  -> OrderShipped{orderId=ORD-001, tracking=TRACK-123}\n  Events cleared.\n\nИтого событий опубликовано: 3',
      solution: `import java.util.*;

public class Main {
    static class DomainEvent {
        String type;
        Map<String, Object> data;
        long timestamp;

        DomainEvent(String type, Map<String, Object> data) {
            this.type = type;
            this.data = data;
            this.timestamp = System.currentTimeMillis();
        }

        public String toString() {
            return type + "{" + formatData() + "}";
        }

        String formatData() {
            StringBuilder sb = new StringBuilder();
            int i = 0;
            for (Map.Entry<String, Object> e : data.entrySet()) {
                if (i++ > 0) sb.append(", ");
                sb.append(e.getKey()).append("=").append(e.getValue());
            }
            return sb.toString();
        }

        String shortName() {
            return type + "(" + data.get("orderId") + ")";
        }
    }

    static class Order {
        String id;
        String status;
        double amount;
        String paymentMethod;
        String tracking;
        List<DomainEvent> pendingEvents = new ArrayList<>();

        static Order create(String id, double amount) {
            Order order = new Order();
            order.id = id;
            order.amount = amount;
            order.status = "CREATED";

            Map<String, Object> data = new LinkedHashMap<>();
            data.put("orderId", id);
            data.put("amount", amount);
            order.pendingEvents.add(new DomainEvent("OrderCreated", data));

            return order;
        }

        void pay(String method) {
            this.paymentMethod = method;
            this.status = "PAID";

            Map<String, Object> data = new LinkedHashMap<>();
            data.put("orderId", id);
            data.put("method", method);
            pendingEvents.add(new DomainEvent("OrderPaid", data));
        }

        void ship(String tracking) {
            this.tracking = tracking;
            this.status = "SHIPPED";

            Map<String, Object> data = new LinkedHashMap<>();
            data.put("orderId", id);
            data.put("tracking", tracking);
            pendingEvents.add(new DomainEvent("OrderShipped", data));
        }

        List<String> getEventNames() {
            List<String> names = new ArrayList<>();
            for (DomainEvent e : pendingEvents) names.add(e.shortName());
            return names;
        }
    }

    static int totalPublished = 0;

    static void publishEvents(Order order) {
        System.out.println("Публикация событий" +
            (totalPublished > 0 ? ":" : " (после save):"));
        for (DomainEvent event : order.pendingEvents) {
            System.out.println("  -> " + event);
            totalPublished++;
        }
        order.pendingEvents.clear();
        System.out.println("  Events cleared.");
    }

    public static void main(String[] args) {
        System.out.println("=== Domain Events ===\\n");

        // Create
        System.out.println("Создание заказа:");
        Order order = Order.create("ORD-001", 500.0);
        System.out.println("  Order.create(ORD-001, amount=500)");
        System.out.println("  Статус: " + order.status);
        System.out.println("  Pending events: " + order.getEventNames());

        // Pay
        System.out.println("\\nОплата заказа:");
        order.pay("card");
        System.out.println("  Order.pay(method=card)");
        System.out.println("  Статус: " + order.status);
        System.out.println("  Pending events: " + order.getEventNames());

        // Publish
        System.out.println();
        publishEvents(order);

        // Ship
        System.out.println("\\nДоставка заказа:");
        order.ship("TRACK-123");
        System.out.println("  Order.ship(tracking=TRACK-123)");
        System.out.println("  Статус: " + order.status);
        System.out.println("  Pending events: " + order.getEventNames());

        System.out.println();
        publishEvents(order);

        System.out.println("\\nИтого событий опубликовано: " + totalPublished);
    }
}`,
      explanation: 'Domain Events — события, генерируемые агрегатом при изменении состояния. Они накапливаются в pendingEvents и публикуются ПОСЛЕ успешного сохранения агрегата в БД. Это гарантирует, что события соответствуют реальному состоянию. В production: сохранение + публикация через Outbox Pattern для атомарности.'
    },
    {
      id: 3,
      title: 'CQRS: разделение чтения и записи',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте CQRS для интернет-магазина: команды изменяют состояние (write model), запросы читают из проекции (read model). Синхронизация через события.',
      requirements: [
        'Write Model: обработка команд CreateOrder, UpdateStatus',
        'Event Store: хранение всех событий',
        'Read Model: денормализованная проекция для быстрых запросов',
        'Проекция обновляется при получении событий',
        'Показать команды, события, обновление проекции',
        'Запросы к Read Model: список заказов, фильтр по статусу'
      ],
      hint: 'Write side генерирует события. Projection handler обновляет Read Model (Map<String, OrderView>). Query side читает из Read Model.',
      expectedOutput: '=== CQRS: Интернет-магазин ===\n\n--- Write Side (Команды) ---\nCommand: CreateOrder(ORD-001, customer="Иван", amount=500)\n  -> Event: OrderCreated\nCommand: CreateOrder(ORD-002, customer="Мария", amount=300)\n  -> Event: OrderCreated\nCommand: UpdateStatus(ORD-001, status=PAID)\n  -> Event: StatusChanged\nCommand: UpdateStatus(ORD-001, status=SHIPPED)\n  -> Event: StatusChanged\n\n--- Event Store ---\n  1. OrderCreated(ORD-001)\n  2. OrderCreated(ORD-002)\n  3. StatusChanged(ORD-001, PAID)\n  4. StatusChanged(ORD-001, SHIPPED)\n\n--- Read Side (Проекции) ---\nВсе заказы:\n  ORD-001: customer="Иван", amount=500.0, status=SHIPPED\n  ORD-002: customer="Мария", amount=300.0, status=CREATED\n\nФильтр status=SHIPPED:\n  ORD-001: customer="Иван", amount=500.0, status=SHIPPED',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    static class Event {
        String type;
        Map<String, Object> data;
        Event(String type, Map<String, Object> data) {
            this.type = type;
            this.data = data;
        }
    }

    // Event Store
    static List<Event> eventStore = new ArrayList<>();

    // Read Model
    static Map<String, Map<String, Object>> readModel = new LinkedHashMap<>();

    // Write Side: handle commands
    static void createOrder(String orderId, String customer, double amount) {
        System.out.println("Command: CreateOrder(" + orderId
            + ", customer=\\"" + customer + "\\", amount=" + (int) amount + ")");

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("orderId", orderId);
        data.put("customer", customer);
        data.put("amount", amount);
        Event event = new Event("OrderCreated", data);
        eventStore.add(event);
        applyToProjection(event);
        System.out.println("  -> Event: OrderCreated");
    }

    static void updateStatus(String orderId, String status) {
        System.out.println("Command: UpdateStatus(" + orderId + ", status=" + status + ")");

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("orderId", orderId);
        data.put("status", status);
        Event event = new Event("StatusChanged", data);
        eventStore.add(event);
        applyToProjection(event);
        System.out.println("  -> Event: StatusChanged");
    }

    // Projection: update read model from events
    static void applyToProjection(Event event) {
        String orderId = (String) event.data.get("orderId");
        switch (event.type) {
            case "OrderCreated":
                Map<String, Object> view = new LinkedHashMap<>();
                view.put("customer", event.data.get("customer"));
                view.put("amount", event.data.get("amount"));
                view.put("status", "CREATED");
                readModel.put(orderId, view);
                break;
            case "StatusChanged":
                readModel.get(orderId).put("status", event.data.get("status"));
                break;
        }
    }

    // Query Side
    static void queryAll() {
        System.out.println("Все заказы:");
        for (Map.Entry<String, Map<String, Object>> e : readModel.entrySet()) {
            Map<String, Object> v = e.getValue();
            System.out.println("  " + e.getKey() + ": customer=\\"" + v.get("customer")
                + "\\", amount=" + v.get("amount") + ", status=" + v.get("status"));
        }
    }

    static void queryByStatus(String status) {
        System.out.println("\\nФильтр status=" + status + ":");
        for (Map.Entry<String, Map<String, Object>> e : readModel.entrySet()) {
            if (status.equals(e.getValue().get("status"))) {
                Map<String, Object> v = e.getValue();
                System.out.println("  " + e.getKey() + ": customer=\\"" + v.get("customer")
                    + "\\", amount=" + v.get("amount") + ", status=" + v.get("status"));
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== CQRS: Интернет-магазин ===\\n");

        System.out.println("--- Write Side (Команды) ---");
        createOrder("ORD-001", "Иван", 500);
        createOrder("ORD-002", "Мария", 300);
        updateStatus("ORD-001", "PAID");
        updateStatus("ORD-001", "SHIPPED");

        System.out.println("\\n--- Event Store ---");
        int seq = 1;
        for (Event e : eventStore) {
            String detail = e.type.equals("OrderCreated")
                ? "(" + e.data.get("orderId") + ")"
                : "(" + e.data.get("orderId") + ", " + e.data.get("status") + ")";
            System.out.println("  " + seq++ + ". " + e.type + detail);
        }

        System.out.println("\\n--- Read Side (Проекции) ---");
        queryAll();
        queryByStatus("SHIPPED");
    }
}`,
      explanation: 'CQRS разделяет модели записи и чтения. Write Side обрабатывает команды и генерирует события. Read Side (Projection) обновляется из событий и оптимизирована для конкретных запросов. Это позволяет масштабировать чтение и запись независимо. В production: команды через Kafka, проекции в Elasticsearch/Redis для быстрых запросов.'
    },
    {
      id: 4,
      title: 'Outbox Pattern',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Outbox Pattern: атомарная запись в БД и таблицу outbox в одной транзакции, затем polling outbox и публикация событий в Kafka.',
      requirements: [
        'Таблица orders: хранение заказов',
        'Таблица outbox: хранение событий для отправки',
        'Метод createOrder(): атомарная запись в orders + outbox',
        'Метод pollOutbox(): читает неотправленные события',
        'Метод publishAndMark(): отправляет в "Kafka" и помечает как sent',
        'Показать полный цикл: создание -> outbox -> publish'
      ],
      hint: 'Outbox — List<OutboxEntry> с полем sent (boolean). createOrder() добавляет в orders И outbox атомарно. pollOutbox() возвращает WHERE sent=false.',
      expectedOutput: '=== Outbox Pattern ===\n\n--- Создание заказов (в транзакции) ---\n  [TX] INSERT orders: ORD-001\n  [TX] INSERT outbox: OrderCreated(ORD-001)\n  [TX] COMMIT\n  [TX] INSERT orders: ORD-002\n  [TX] INSERT outbox: OrderCreated(ORD-002)\n  [TX] COMMIT\n\n--- Outbox (до polling) ---\n  id=1: OrderCreated(ORD-001) sent=false\n  id=2: OrderCreated(ORD-002) sent=false\n\n--- Outbox Poller ---\n  Polling... найдено 2 записей\n  [Kafka] Отправлено: OrderCreated(ORD-001)\n  [Outbox] id=1 помечен как sent=true\n  [Kafka] Отправлено: OrderCreated(ORD-002)\n  [Outbox] id=2 помечен как sent=true\n\n--- Outbox (после polling) ---\n  id=1: OrderCreated(ORD-001) sent=true\n  id=2: OrderCreated(ORD-002) sent=true\n\n--- Повторный polling ---\n  Polling... найдено 0 записей (всё отправлено)',
      solution: `import java.util.*;

public class Main {
    static class Order {
        String id;
        double amount;
        Order(String id, double amount) { this.id = id; this.amount = amount; }
    }

    static class OutboxEntry {
        int id;
        String eventType;
        String aggregateId;
        String payload;
        boolean sent;

        OutboxEntry(int id, String eventType, String aggregateId, String payload) {
            this.id = id;
            this.eventType = eventType;
            this.aggregateId = aggregateId;
            this.payload = payload;
            this.sent = false;
        }
    }

    static List<Order> ordersTable = new ArrayList<>();
    static List<OutboxEntry> outboxTable = new ArrayList<>();
    static List<String> kafkaTopic = new ArrayList<>();
    static int outboxSeq = 1;

    static void createOrder(String orderId, double amount) {
        // Одна транзакция: orders + outbox
        System.out.println("  [TX] INSERT orders: " + orderId);
        ordersTable.add(new Order(orderId, amount));

        String eventType = "OrderCreated";
        System.out.println("  [TX] INSERT outbox: " + eventType + "(" + orderId + ")");
        outboxTable.add(new OutboxEntry(outboxSeq++, eventType, orderId,
            "{\\"orderId\\":\\"" + orderId + "\\",\\"amount\\":" + amount + "}"));

        System.out.println("  [TX] COMMIT");
    }

    static List<OutboxEntry> pollOutbox() {
        List<OutboxEntry> unsent = new ArrayList<>();
        for (OutboxEntry e : outboxTable) {
            if (!e.sent) unsent.add(e);
        }
        return unsent;
    }

    static void printOutbox(String label) {
        System.out.println("--- Outbox (" + label + ") ---");
        for (OutboxEntry e : outboxTable) {
            System.out.println("  id=" + e.id + ": " + e.eventType
                + "(" + e.aggregateId + ") sent=" + e.sent);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Outbox Pattern ===\\n");

        System.out.println("--- Создание заказов (в транзакции) ---");
        createOrder("ORD-001", 500);
        createOrder("ORD-002", 300);

        System.out.println();
        printOutbox("до polling");

        System.out.println("\\n--- Outbox Poller ---");
        List<OutboxEntry> unsent = pollOutbox();
        System.out.println("  Polling... найдено " + unsent.size() + " записей");

        for (OutboxEntry e : unsent) {
            kafkaTopic.add(e.payload);
            System.out.println("  [Kafka] Отправлено: " + e.eventType
                + "(" + e.aggregateId + ")");
            e.sent = true;
            System.out.println("  [Outbox] id=" + e.id + " помечен как sent=true");
        }

        System.out.println();
        printOutbox("после polling");

        System.out.println("\\n--- Повторный polling ---");
        List<OutboxEntry> unsent2 = pollOutbox();
        System.out.println("  Polling... найдено " + unsent2.size()
            + " записей (всё отправлено)");
    }
}`,
      explanation: 'Outbox Pattern решает проблему двойной записи: БД и Kafka обновляются не атомарно. Решение: пишем event в таблицу outbox в той же БД-транзакции, что и бизнес-данные. Отдельный процесс (poller/CDC) читает outbox и публикует в Kafka. Это гарантирует: если заказ сохранён — событие БУДЕТ опубликовано. В production используйте Debezium CDC вместо polling.'
    },
    {
      id: 5,
      title: 'Saga: хореография через события',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Saga с хореографией: сервисы координируются через события без центрального оркестратора. Каждый сервис слушает события и реагирует.',
      requirements: [
        'Event Bus для обмена событиями между сервисами',
        'OrderService: создаёт заказ, слушает PaymentCompleted/PaymentFailed',
        'PaymentService: слушает OrderCreated, обрабатывает оплату',
        'InventoryService: слушает PaymentCompleted, резервирует товары',
        'Компенсация: если InventoryFailed -> PaymentService refund',
        'Показать успешный и провальный сценарий'
      ],
      hint: 'Каждый сервис подписывается на события и публикует свои. Цепочка: OrderCreated -> PaymentCompleted -> InventoryReserved. При ошибке: InventoryFailed -> PaymentRefunded -> OrderCancelled.',
      expectedOutput: '=== Saga: Хореография ===\n\n--- Сценарий 1: Успешный заказ ---\n  [OrderService] Создан заказ ORD-001\n  -> publish: OrderCreated(ORD-001)\n  [PaymentService] Получил OrderCreated -> списание $500... OK\n  -> publish: PaymentCompleted(ORD-001)\n  [InventoryService] Получил PaymentCompleted -> резерв... OK\n  -> publish: InventoryReserved(ORD-001)\n  [OrderService] Получил InventoryReserved -> статус: CONFIRMED\n  Результат: ORD-001 = CONFIRMED\n\n--- Сценарий 2: Ошибка на складе ---\n  [OrderService] Создан заказ ORD-002\n  -> publish: OrderCreated(ORD-002)\n  [PaymentService] Получил OrderCreated -> списание $300... OK\n  -> publish: PaymentCompleted(ORD-002)\n  [InventoryService] Получил PaymentCompleted -> резерв... ОШИБКА!\n  -> publish: InventoryFailed(ORD-002)\n  [PaymentService] Получил InventoryFailed -> возврат $300\n  -> publish: PaymentRefunded(ORD-002)\n  [OrderService] Получил PaymentRefunded -> статус: CANCELLED\n  Результат: ORD-002 = CANCELLED',
      solution: `import java.util.*;
import java.util.function.Consumer;

public class Main {
    static Map<String, List<Consumer<Map<String, Object>>>> bus = new LinkedHashMap<>();
    static Map<String, String> orderStatuses = new LinkedHashMap<>();
    static Map<String, Double> orderAmounts = new LinkedHashMap<>();

    static void subscribe(String eventType, Consumer<Map<String, Object>> handler) {
        bus.computeIfAbsent(eventType, k -> new ArrayList<>()).add(handler);
    }

    static void publish(String eventType, Map<String, Object> data) {
        System.out.println("  -> publish: " + eventType + "(" + data.get("orderId") + ")");
        List<Consumer<Map<String, Object>>> handlers = bus.getOrDefault(eventType, Collections.emptyList());
        for (Consumer<Map<String, Object>> h : handlers) {
            h.accept(data);
        }
    }

    static void setupServices(boolean inventoryFails) {
        bus.clear();

        // PaymentService: listens to OrderCreated
        subscribe("OrderCreated", data -> {
            String orderId = (String) data.get("orderId");
            double amount = (Double) data.get("amount");
            System.out.println("  [PaymentService] Получил OrderCreated -> списание $"
                + (int) amount + "... OK");
            publish("PaymentCompleted", Map.of("orderId", orderId, "amount", amount));
        });

        // InventoryService: listens to PaymentCompleted
        subscribe("PaymentCompleted", data -> {
            String orderId = (String) data.get("orderId");
            if (inventoryFails && orderId.equals("ORD-002")) {
                System.out.println("  [InventoryService] Получил PaymentCompleted -> резерв... ОШИБКА!");
                publish("InventoryFailed", data);
            } else {
                System.out.println("  [InventoryService] Получил PaymentCompleted -> резерв... OK");
                publish("InventoryReserved", data);
            }
        });

        // OrderService: listens to InventoryReserved
        subscribe("InventoryReserved", data -> {
            String orderId = (String) data.get("orderId");
            orderStatuses.put(orderId, "CONFIRMED");
            System.out.println("  [OrderService] Получил InventoryReserved -> статус: CONFIRMED");
        });

        // Compensation: PaymentService listens to InventoryFailed
        subscribe("InventoryFailed", data -> {
            String orderId = (String) data.get("orderId");
            double amount = (Double) data.get("amount");
            System.out.println("  [PaymentService] Получил InventoryFailed -> возврат $"
                + (int) amount);
            publish("PaymentRefunded", data);
        });

        // Compensation: OrderService listens to PaymentRefunded
        subscribe("PaymentRefunded", data -> {
            String orderId = (String) data.get("orderId");
            orderStatuses.put(orderId, "CANCELLED");
            System.out.println("  [OrderService] Получил PaymentRefunded -> статус: CANCELLED");
        });
    }

    static void createOrder(String orderId, double amount) {
        orderAmounts.put(orderId, amount);
        orderStatuses.put(orderId, "CREATED");
        System.out.println("  [OrderService] Создан заказ " + orderId);
        publish("OrderCreated", Map.of("orderId", orderId, "amount", amount));
    }

    public static void main(String[] args) {
        System.out.println("=== Saga: Хореография ===\\n");

        // Successful scenario
        System.out.println("--- Сценарий 1: Успешный заказ ---");
        setupServices(false);
        createOrder("ORD-001", 500.0);
        System.out.println("  Результат: ORD-001 = " + orderStatuses.get("ORD-001"));

        // Failed scenario
        System.out.println("\\n--- Сценарий 2: Ошибка на складе ---");
        setupServices(true);
        createOrder("ORD-002", 300.0);
        System.out.println("  Результат: ORD-002 = " + orderStatuses.get("ORD-002"));
    }
}`,
      explanation: 'Хореография — децентрализованная координация через события. Каждый сервис подписывается на интересующие события и публикует свои. Цепочка: OrderCreated -> PaymentCompleted -> InventoryReserved. При ошибке: InventoryFailed запускает компенсацию (refund). Плюсы: нет единой точки отказа, слабая связанность. Минусы: сложно отследить flow, неявные зависимости.'
    },
    {
      id: 6,
      title: 'Event Store с Snapshots',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Event Store с механизмом снимков (snapshots): периодически сохраняется текущее состояние для ускорения восстановления.',
      requirements: [
        'Event Store: хранит все события для агрегата',
        'Snapshot Store: хранит снимки состояния каждые N событий',
        'Восстановление: snapshot + события после snapshot (быстрее, чем все события)',
        'Агрегат: ShoppingCart с добавлением/удалением товаров',
        'Показать: полное восстановление vs восстановление с snapshot',
        'Сравнить количество применённых событий'
      ],
      hint: 'Snapshot — копия состояния после N событий. Для восстановления: загрузи snapshot, затем примени только события ПОСЛЕ snapshot. Это O(k) вместо O(n).',
      expectedOutput: '=== Event Store с Snapshots ===\n\nДобавление товаров в корзину:\n  1. AddItem(Ноутбук, qty=1, price=1000)\n  2. AddItem(Мышь, qty=2, price=50)\n  3. AddItem(Клавиатура, qty=1, price=80)\n  --- Snapshot создан (после 3 событий) ---\n  4. RemoveItem(Мышь, qty=1)\n  5. AddItem(Монитор, qty=1, price=500)\n\nВосстановление БЕЗ snapshot:\n  apply event 1: AddItem(Ноутбук)\n  apply event 2: AddItem(Мышь)\n  apply event 3: AddItem(Клавиатура)\n  apply event 4: RemoveItem(Мышь)\n  apply event 5: AddItem(Монитор)\n  Событий применено: 5\n  Корзина: {Ноутбук=1, Мышь=1, Клавиатура=1, Монитор=1}, total=1630\n\nВосстановление С snapshot:\n  load snapshot (v3): {Ноутбук=1, Мышь=2, Клавиатура=1}\n  apply event 4: RemoveItem(Мышь)\n  apply event 5: AddItem(Монитор)\n  Событий применено: 2 (экономия: 3 события)\n  Корзина: {Ноутбук=1, Мышь=1, Клавиатура=1, Монитор=1}, total=1630',
      solution: `import java.util.*;

public class Main {
    static class Event {
        int version;
        String type;
        String item;
        int qty;
        double price;

        Event(int version, String type, String item, int qty, double price) {
            this.version = version;
            this.type = type;
            this.item = item;
            this.qty = qty;
            this.price = price;
        }
    }

    static class CartSnapshot {
        int version;
        Map<String, Integer> items;
        Map<String, Double> prices;

        CartSnapshot(int version, Map<String, Integer> items, Map<String, Double> prices) {
            this.version = version;
            this.items = new LinkedHashMap<>(items);
            this.prices = new LinkedHashMap<>(prices);
        }
    }

    static class ShoppingCart {
        Map<String, Integer> items = new LinkedHashMap<>();
        Map<String, Double> prices = new LinkedHashMap<>();

        void apply(Event event) {
            switch (event.type) {
                case "AddItem":
                    items.merge(event.item, event.qty, Integer::sum);
                    prices.put(event.item, event.price);
                    break;
                case "RemoveItem":
                    if (items.containsKey(event.item)) {
                        int newQty = items.get(event.item) - event.qty;
                        if (newQty <= 0) {
                            items.remove(event.item);
                            prices.remove(event.item);
                        } else {
                            items.put(event.item, newQty);
                        }
                    }
                    break;
            }
        }

        void loadSnapshot(CartSnapshot snapshot) {
            items = new LinkedHashMap<>(snapshot.items);
            prices = new LinkedHashMap<>(snapshot.prices);
        }

        double getTotal() {
            double total = 0;
            for (Map.Entry<String, Integer> e : items.entrySet()) {
                total += e.getValue() * prices.getOrDefault(e.getKey(), 0.0);
            }
            return total;
        }

        public String toString() {
            return items + ", total=" + (int) getTotal();
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Event Store с Snapshots ===\\n");

        List<Event> eventStore = new ArrayList<>();
        eventStore.add(new Event(1, "AddItem", "Ноутбук", 1, 1000));
        eventStore.add(new Event(2, "AddItem", "Мышь", 2, 50));
        eventStore.add(new Event(3, "AddItem", "Клавиатура", 1, 80));
        eventStore.add(new Event(4, "RemoveItem", "Мышь", 1, 0));
        eventStore.add(new Event(5, "AddItem", "Монитор", 1, 500));

        // Create snapshot after event 3
        ShoppingCart tempCart = new ShoppingCart();
        for (int i = 0; i < 3; i++) tempCart.apply(eventStore.get(i));
        CartSnapshot snapshot = new CartSnapshot(3, tempCart.items, tempCart.prices);

        System.out.println("Добавление товаров в корзину:");
        for (Event e : eventStore) {
            String desc = e.type + "(" + e.item;
            if (e.type.equals("AddItem")) desc += ", qty=" + e.qty + ", price=" + (int) e.price;
            else desc += ", qty=" + e.qty;
            desc += ")";
            System.out.println("  " + e.version + ". " + desc);
            if (e.version == 3) {
                System.out.println("  --- Snapshot создан (после 3 событий) ---");
            }
        }

        // Restore WITHOUT snapshot
        System.out.println("\\nВосстановление БЕЗ snapshot:");
        ShoppingCart cart1 = new ShoppingCart();
        int applied1 = 0;
        for (Event e : eventStore) {
            cart1.apply(e);
            applied1++;
            System.out.println("  apply event " + e.version + ": " + e.type + "(" + e.item + ")");
        }
        System.out.println("  Событий применено: " + applied1);
        System.out.println("  Корзина: " + cart1);

        // Restore WITH snapshot
        System.out.println("\\nВосстановление С snapshot:");
        ShoppingCart cart2 = new ShoppingCart();
        cart2.loadSnapshot(snapshot);
        System.out.println("  load snapshot (v" + snapshot.version + "): " + snapshot.items);
        int applied2 = 0;
        for (Event e : eventStore) {
            if (e.version > snapshot.version) {
                cart2.apply(e);
                applied2++;
                System.out.println("  apply event " + e.version + ": " + e.type + "(" + e.item + ")");
            }
        }
        int saved = applied1 - applied2;
        System.out.println("  Событий применено: " + applied2 + " (экономия: " + saved + " события)");
        System.out.println("  Корзина: " + cart2);
    }
}`,
      explanation: 'Snapshots ускоряют восстановление агрегата в Event Sourcing. Без snapshot: применяем ВСЕ события (O(n)). С snapshot: загружаем снимок + применяем только новые события (O(k), где k << n). Снимки создаются каждые N событий (например, 100). В production: snapshot в Redis/DB, события в Kafka. Axon Framework и EventStoreDB поддерживают snapshots из коробки.'
    },
    {
      id: 7,
      title: 'Event-Carried State Transfer',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте паттерн Event-Carried State Transfer: событие содержит все данные, чтобы consumer не делал обратный запрос к producer.',
      requirements: [
        'Thin Event: содержит только ID (consumer должен запрашивать данные)',
        'Fat Event: содержит все данные (consumer самодостаточен)',
        'Показать проблему с Thin Events: запрос обратно к сервису',
        'Показать решение с Fat Events: локальный кэш consumer-а',
        'Consumer поддерживает локальную копию данных',
        'Сравнить количество network calls'
      ],
      hint: 'Thin Event: {type: "OrderCreated", orderId: "123"}. Fat Event: {type: "OrderCreated", orderId: "123", customer: "Иван", amount: 500, items: [...]}. Consumer с Fat Events не делает HTTP запросы.',
      expectedOutput: '=== Event-Carried State Transfer ===\n\n--- Thin Events (проблема) ---\n  Event: OrderCreated{orderId=ORD-001}\n  [EmailService] Получил OrderCreated, но нужны данные...\n  [EmailService] HTTP GET /orders/ORD-001 -> {customer, amount}\n  [EmailService] Отправил email Ивану на $500\n  Network calls: 1 (запрос обратно к OrderService)\n\n--- Fat Events (решение) ---\n  Event: OrderCreated{orderId=ORD-001, customer="Иван", amount=500, items=[Ноутбук]}\n  [EmailService] Получил OrderCreated с ПОЛНЫМИ данными\n  [EmailService] Отправил email Ивану на $500\n  Network calls: 0 (всё в событии!)\n\n--- Локальный кэш с Fat Events ---\n  Event: CustomerUpdated{id=C-001, name="Иван", email="ivan@mail.ru"}\n  [ShippingService] Обновил локальный кэш: C-001\n  Event: OrderCreated{orderId=ORD-001, customerId=C-001}\n  [ShippingService] Клиент из кэша: Иван (ivan@mail.ru)\n  Network calls: 0',
      solution: `import java.util.*;

public class Main {
    // Thin Events
    static int thinNetworkCalls = 0;

    static void thinEventDemo() {
        System.out.println("--- Thin Events (проблема) ---");
        Map<String, Object> thinEvent = new LinkedHashMap<>();
        thinEvent.put("orderId", "ORD-001");

        System.out.println("  Event: OrderCreated{orderId=" + thinEvent.get("orderId") + "}");
        System.out.println("  [EmailService] Получил OrderCreated, но нужны данные...");

        // Need to call back to OrderService
        thinNetworkCalls++;
        System.out.println("  [EmailService] HTTP GET /orders/" + thinEvent.get("orderId")
            + " -> {customer, amount}");
        System.out.println("  [EmailService] Отправил email Ивану на $500");
        System.out.println("  Network calls: " + thinNetworkCalls
            + " (запрос обратно к OrderService)");
    }

    // Fat Events
    static int fatNetworkCalls = 0;

    static void fatEventDemo() {
        System.out.println("\\n--- Fat Events (решение) ---");
        Map<String, Object> fatEvent = new LinkedHashMap<>();
        fatEvent.put("orderId", "ORD-001");
        fatEvent.put("customer", "Иван");
        fatEvent.put("amount", 500);
        fatEvent.put("items", List.of("Ноутбук"));

        System.out.println("  Event: OrderCreated{orderId=" + fatEvent.get("orderId")
            + ", customer=\"" + fatEvent.get("customer")
            + "\", amount=" + fatEvent.get("amount")
            + ", items=" + fatEvent.get("items") + "}");
        System.out.println("  [EmailService] Получил OrderCreated с ПОЛНЫМИ данными");
        System.out.println("  [EmailService] Отправил email "
            + fatEvent.get("customer") + " на $" + fatEvent.get("amount"));
        System.out.println("  Network calls: " + fatNetworkCalls + " (всё в событии!)");
    }

    // Local cache with fat events
    static Map<String, Map<String, String>> localCache = new LinkedHashMap<>();

    static void localCacheDemo() {
        System.out.println("\\n--- Локальный кэш с Fat Events ---");

        // Customer update event
        Map<String, String> customerEvent = new LinkedHashMap<>();
        customerEvent.put("id", "C-001");
        customerEvent.put("name", "Иван");
        customerEvent.put("email", "ivan@mail.ru");

        System.out.println("  Event: CustomerUpdated{id=" + customerEvent.get("id")
            + ", name=\"" + customerEvent.get("name")
            + "\", email=\"" + customerEvent.get("email") + "\"}");

        localCache.put(customerEvent.get("id"), customerEvent);
        System.out.println("  [ShippingService] Обновил локальный кэш: "
            + customerEvent.get("id"));

        // Order event with just customerId
        System.out.println("  Event: OrderCreated{orderId=ORD-001, customerId=C-001}");
        Map<String, String> cached = localCache.get("C-001");
        System.out.println("  [ShippingService] Клиент из кэша: "
            + cached.get("name") + " (" + cached.get("email") + ")");
        System.out.println("  Network calls: 0");
    }

    public static void main(String[] args) {
        System.out.println("=== Event-Carried State Transfer ===\\n");
        thinEventDemo();
        fatEventDemo();
        localCacheDemo();
    }
}`,
      explanation: 'Event-Carried State Transfer — паттерн, при котором событие содержит все данные для обработки. Thin Events требуют обратных запросов (связанность, latency). Fat Events содержат полные данные (автономность). Локальный кэш: consumer поддерживает копию данных через события об изменениях. Компромисс: Fat Events больше по размеру, но устраняют зависимость между сервисами.'
    },
    {
      id: 8,
      title: 'Dead Letter Queue',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Dead Letter Queue (DLQ) — очередь для сообщений, которые не удалось обработать после нескольких попыток.',
      requirements: [
        'Основная очередь с consumer-ом',
        'Retry logic: до 3 попыток с backoff',
        'DLQ: хранит провальные сообщения с метаданными',
        'Метаданные DLQ: оригинальное сообщение, причина ошибки, количество попыток',
        'DLQ Consumer: ручная обработка/resubmit провальных сообщений',
        'Показать: успешная обработка, retry, отправка в DLQ, resubmit'
      ],
      hint: 'DLQ Entry: {originalMessage, errorReason, retryCount, timestamp}. При ошибке: если retries < max -> retry, иначе -> DLQ. DLQ consumer может resubmit обратно в основную очередь.',
      expectedOutput: '=== Dead Letter Queue ===\n\nОбработка основной очереди:\n  msg="Заказ-1": OK\n  msg="BAD-DATA": ошибка! Попытка 1/3\n  msg="BAD-DATA": ошибка! Попытка 2/3\n  msg="BAD-DATA": ошибка! Попытка 3/3 -> DLQ\n  msg="Заказ-2": OK\n  msg="INVALID": ошибка! Попытка 1/3\n  msg="INVALID": ошибка! Попытка 2/3\n  msg="INVALID": ошибка! Попытка 3/3 -> DLQ\n  msg="Заказ-3": OK\n\nОбработано успешно: 3\n\nDead Letter Queue:\n  1. msg="BAD-DATA", error="Невалидные данные", retries=3\n  2. msg="INVALID", error="Невалидные данные", retries=3\n\nResubmit из DLQ (после исправления):\n  Resubmit: "BAD-DATA-FIXED" -> основная очередь\n  msg="BAD-DATA-FIXED": OK',
      solution: `import java.util.*;

public class Main {
    static LinkedList<String> mainQueue = new LinkedList<>();
    static List<Map<String, Object>> dlq = new ArrayList<>();
    static Map<String, Integer> retryCount = new HashMap<>();
    static int maxRetries = 3;
    static int processed = 0;

    static boolean process(String msg) {
        return !msg.startsWith("BAD") && !msg.startsWith("INVALID");
    }

    static void handleMessage(String msg) {
        if (process(msg)) {
            processed++;
            System.out.println("  msg=\\"" + msg + "\\": OK");
        } else {
            int attempt = retryCount.getOrDefault(msg, 0) + 1;
            retryCount.put(msg, attempt);

            if (attempt >= maxRetries) {
                System.out.println("  msg=\\"" + msg + "\\": ошибка! Попытка "
                    + attempt + "/" + maxRetries + " -> DLQ");
                Map<String, Object> dlqEntry = new LinkedHashMap<>();
                dlqEntry.put("message", msg);
                dlqEntry.put("error", "Невалидные данные");
                dlqEntry.put("retries", attempt);
                dlq.add(dlqEntry);
            } else {
                System.out.println("  msg=\\"" + msg + "\\": ошибка! Попытка "
                    + attempt + "/" + maxRetries);
                mainQueue.addFirst(msg);
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Dead Letter Queue ===\\n");

        mainQueue.add("Заказ-1");
        mainQueue.add("BAD-DATA");
        mainQueue.add("Заказ-2");
        mainQueue.add("INVALID");
        mainQueue.add("Заказ-3");

        System.out.println("Обработка основной очереди:");
        while (!mainQueue.isEmpty()) {
            String msg = mainQueue.poll();
            handleMessage(msg);
        }

        System.out.println("\\nОбработано успешно: " + processed);

        System.out.println("\\nDead Letter Queue:");
        int idx = 1;
        for (Map<String, Object> entry : dlq) {
            System.out.println("  " + idx++ + ". msg=\\"" + entry.get("message")
                + "\\", error=\\"" + entry.get("error")
                + "\\", retries=" + entry.get("retries"));
        }

        // Resubmit
        System.out.println("\\nResubmit из DLQ (после исправления):");
        String fixed = "BAD-DATA-FIXED";
        mainQueue.add(fixed);
        System.out.println("  Resubmit: \\"" + fixed + "\\" -> основная очередь");
        while (!mainQueue.isEmpty()) {
            String msg = mainQueue.poll();
            handleMessage(msg);
        }
    }
}`,
      explanation: 'Dead Letter Queue собирает сообщения, которые не удалось обработать после всех retry. Метаданные (причина ошибки, количество попыток) помогают при анализе. DLQ consumer может: проигнорировать, исправить и resubmit, или отправить alert. В Kafka DLQ — отдельный topic. В RabbitMQ — Dead Letter Exchange + очередь. Всегда настраивайте DLQ в production!'
    },
    {
      id: 9,
      title: 'Event Replay: перестроение проекции',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Event Replay — перестроение read model путём повторного применения всех событий из Event Store. Показать добавление нового типа проекции без изменения producer-а.',
      requirements: [
        'Event Store с историей событий',
        'Проекция 1: OrderSummary (существующая)',
        'Проекция 2: RevenueReport (новая, добавленная позже)',
        'Replay: пропустить ВСЕ события через новую проекцию',
        'Проекция 2 получает полную историю без изменения producer-а',
        'Показать: существующие данные, replay, результат новой проекции'
      ],
      hint: 'Event Store хранит все события. Новая проекция стартует replay() — проигрывает ВСЕ события с начала. Это уникальная возможность Kafka (replay от любого offset).',
      expectedOutput: '=== Event Replay ===\n\nEvent Store (9 событий):\n  1. OrderCreated(ORD-001, amount=500)\n  2. OrderCreated(ORD-002, amount=300)\n  3. PaymentReceived(ORD-001)\n  4. OrderCreated(ORD-003, amount=800)\n  5. PaymentReceived(ORD-002)\n  6. OrderShipped(ORD-001)\n  7. PaymentReceived(ORD-003)\n  8. OrderShipped(ORD-002)\n  9. OrderCancelled(ORD-003)\n\nПроекция 1 (OrderSummary) — обновлялась в реальном времени:\n  ORD-001: status=SHIPPED, amount=500\n  ORD-002: status=SHIPPED, amount=300\n  ORD-003: status=CANCELLED, amount=800\n\n--- Добавляем Проекцию 2 (RevenueReport) ---\nReplay: применяем 9 событий...\n  Replayed: OrderCreated -> revenue tracking\n  Replayed: PaymentReceived -> +$500\n  Replayed: PaymentReceived -> +$300\n  Replayed: PaymentReceived -> +$800\n  Replayed: OrderCancelled -> -$800 (refund)\n\nRevenueReport:\n  Всего заказов: 3\n  Оплачено: 3\n  Отменено: 1\n  Выручка: $800\n  Refund: $800\n  Итого: $800',
      solution: `import java.util.*;

public class Main {
    static class Event {
        int seq;
        String type;
        String orderId;
        double amount;

        Event(int seq, String type, String orderId, double amount) {
            this.seq = seq;
            this.type = type;
            this.orderId = orderId;
            this.amount = amount;
        }

        public String toString() {
            if (type.equals("OrderCreated"))
                return type + "(" + orderId + ", amount=" + (int) amount + ")";
            return type + "(" + orderId + ")";
        }
    }

    static List<Event> eventStore = new ArrayList<>();

    // Projection 1: Order Summary (real-time)
    static Map<String, Map<String, Object>> orderSummary = new LinkedHashMap<>();

    static void updateOrderSummary(Event e) {
        switch (e.type) {
            case "OrderCreated":
                Map<String, Object> order = new LinkedHashMap<>();
                order.put("status", "CREATED");
                order.put("amount", e.amount);
                orderSummary.put(e.orderId, order);
                break;
            case "PaymentReceived":
                orderSummary.get(e.orderId).put("status", "PAID");
                break;
            case "OrderShipped":
                orderSummary.get(e.orderId).put("status", "SHIPPED");
                break;
            case "OrderCancelled":
                orderSummary.get(e.orderId).put("status", "CANCELLED");
                break;
        }
    }

    // Projection 2: Revenue Report (added later via replay)
    static int totalOrders = 0, totalPaid = 0, totalCancelled = 0;
    static double revenue = 0, refunded = 0;
    static Map<String, Double> paidAmounts = new HashMap<>();

    static void updateRevenueReport(Event e) {
        switch (e.type) {
            case "OrderCreated":
                totalOrders++;
                System.out.println("  Replayed: OrderCreated -> revenue tracking");
                break;
            case "PaymentReceived":
                totalPaid++;
                double amount = (Double) orderSummary.get(e.orderId).get("amount");
                revenue += amount;
                paidAmounts.put(e.orderId, amount);
                System.out.println("  Replayed: PaymentReceived -> +$" + (int) amount);
                break;
            case "OrderCancelled":
                totalCancelled++;
                double refund = paidAmounts.getOrDefault(e.orderId, 0.0);
                if (refund > 0) {
                    refunded += refund;
                    System.out.println("  Replayed: OrderCancelled -> -$" + (int) refund + " (refund)");
                }
                break;
            default:
                // OrderShipped: no revenue impact
                break;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Event Replay ===\\n");

        // Build event store
        eventStore.add(new Event(1, "OrderCreated", "ORD-001", 500));
        eventStore.add(new Event(2, "OrderCreated", "ORD-002", 300));
        eventStore.add(new Event(3, "PaymentReceived", "ORD-001", 0));
        eventStore.add(new Event(4, "OrderCreated", "ORD-003", 800));
        eventStore.add(new Event(5, "PaymentReceived", "ORD-002", 0));
        eventStore.add(new Event(6, "OrderShipped", "ORD-001", 0));
        eventStore.add(new Event(7, "PaymentReceived", "ORD-003", 0));
        eventStore.add(new Event(8, "OrderShipped", "ORD-002", 0));
        eventStore.add(new Event(9, "OrderCancelled", "ORD-003", 0));

        // Apply to projection 1 in real-time
        System.out.println("Event Store (" + eventStore.size() + " событий):");
        for (Event e : eventStore) {
            System.out.println("  " + e.seq + ". " + e);
            updateOrderSummary(e);
        }

        System.out.println("\\nПроекция 1 (OrderSummary) — обновлялась в реальном времени:");
        for (Map.Entry<String, Map<String, Object>> entry : orderSummary.entrySet()) {
            Map<String, Object> v = entry.getValue();
            System.out.println("  " + entry.getKey() + ": status=" + v.get("status")
                + ", amount=" + ((Double) v.get("amount")).intValue());
        }

        // Replay for projection 2
        System.out.println("\\n--- Добавляем Проекцию 2 (RevenueReport) ---");
        System.out.println("Replay: применяем " + eventStore.size() + " событий...");
        for (Event e : eventStore) {
            updateRevenueReport(e);
        }

        System.out.println("\\nRevenueReport:");
        System.out.println("  Всего заказов: " + totalOrders);
        System.out.println("  Оплачено: " + totalPaid);
        System.out.println("  Отменено: " + totalCancelled);
        System.out.println("  Выручка: $" + (int) revenue);
        System.out.println("  Refund: $" + (int) refunded);
        System.out.println("  Итого: $" + (int) (revenue - refunded));
    }
}`,
      explanation: 'Event Replay — ключевое преимущество Event Sourcing и Kafka. Все события сохранены, поэтому можно перестроить любую проекцию с нуля. Новая бизнес-потребность (RevenueReport)? Просто создайте новую проекцию и прогоните через неё все исторические события. В Kafka: новый consumer group с auto.offset.reset=earliest перечитает весь topic.'
    },
    {
      id: 10,
      title: 'Полная Event-Driven система',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте полную Event-Driven систему для интернет-магазина: OrderService, PaymentService, NotificationService. Все коммуникации через события.',
      requirements: [
        'Event Bus с типизированными событиями',
        'OrderService: создание заказа, управление статусами',
        'PaymentService: обработка оплаты',
        'NotificationService: отправка уведомлений',
        'Event Store: полная история событий',
        'Timeline: хронология обработки заказа с timestamps',
        'Показать полный lifecycle заказа от создания до доставки'
      ],
      hint: 'Каждый сервис подписывается на события и публикует свои. Event Store записывает ВСЕ события. Timeline собирает хронологию для каждого заказа.',
      expectedOutput: '=== Event-Driven E-Commerce ===\n\nЗаказ ORD-001 (Ноутбук, $1200):\n\n  [OrderService] Заказ ORD-001 создан\n  -> OrderCreated(ORD-001, amount=1200)\n  [PaymentService] Обработка оплаты ORD-001...\n  -> PaymentProcessed(ORD-001, status=SUCCESS)\n  [NotificationService] Email: "Оплата получена" -> ivan@mail.ru\n  [OrderService] Заказ ORD-001 -> PAID\n  -> OrderStatusChanged(ORD-001, PAID)\n  [NotificationService] Email: "Заказ подтверждён" -> ivan@mail.ru\n  [OrderService] Заказ ORD-001 -> SHIPPED\n  -> OrderStatusChanged(ORD-001, SHIPPED)\n  [NotificationService] Email: "Заказ отправлен" -> ivan@mail.ru\n\nEvent Store: 6 событий\nTimeline ORD-001:\n  1. OrderCreated\n  2. PaymentProcessed (SUCCESS)\n  3. OrderStatusChanged (PAID)\n  4. OrderStatusChanged (SHIPPED)\n\nСтатус: ORD-001 = SHIPPED',
      solution: `import java.util.*;
import java.util.function.Consumer;

public class Main {
    // Event
    static class Event {
        String type;
        Map<String, Object> data;
        Event(String type, Map<String, Object> data) {
            this.type = type;
            this.data = data;
        }
    }

    // Event Bus
    static Map<String, List<Consumer<Event>>> subscribers = new LinkedHashMap<>();
    static List<Event> eventStore = new ArrayList<>();

    static void on(String type, Consumer<Event> handler) {
        subscribers.computeIfAbsent(type, k -> new ArrayList<>()).add(handler);
    }

    static void emit(String type, Map<String, Object> data) {
        Event event = new Event(type, data);
        eventStore.add(event);
        String orderId = (String) data.get("orderId");
        String detail = "";
        if (data.containsKey("amount")) detail = ", amount=" + ((Double) data.get("amount")).intValue();
        if (data.containsKey("status")) detail = ", " + data.get("status");
        if (data.containsKey("paymentStatus")) detail = ", status=" + data.get("paymentStatus");
        System.out.println("  -> " + type + "(" + orderId + detail + ")");

        for (Consumer<Event> handler : subscribers.getOrDefault(type, Collections.emptyList())) {
            handler.accept(event);
        }
    }

    // Order status
    static Map<String, String> orderStatuses = new LinkedHashMap<>();

    public static void main(String[] args) {
        System.out.println("=== Event-Driven E-Commerce ===\\n");

        // Setup PaymentService
        on("OrderCreated", event -> {
            String orderId = (String) event.data.get("orderId");
            System.out.println("  [PaymentService] Обработка оплаты " + orderId + "...");
            emit("PaymentProcessed", Map.of("orderId", orderId,
                "paymentStatus", "SUCCESS"));
        });

        // Setup NotificationService
        on("PaymentProcessed", event -> {
            System.out.println("  [NotificationService] Email: \\"Оплата получена\\" -> ivan@mail.ru");
        });

        on("OrderStatusChanged", event -> {
            String status = (String) event.data.get("status");
            String msg = status.equals("PAID") ? "Заказ подтверждён" : "Заказ отправлен";
            System.out.println("  [NotificationService] Email: \\"" + msg + "\\" -> ivan@mail.ru");
        });

        // Setup OrderService response to payment
        on("PaymentProcessed", event -> {
            String orderId = (String) event.data.get("orderId");
            orderStatuses.put(orderId, "PAID");
            System.out.println("  [OrderService] Заказ " + orderId + " -> PAID");
            emit("OrderStatusChanged", Map.of("orderId", orderId, "status", "PAID"));
        });

        // Create and process order
        String orderId = "ORD-001";
        System.out.println("Заказ " + orderId + " (Ноутбук, $1200):\\n");
        System.out.println("  [OrderService] Заказ " + orderId + " создан");
        orderStatuses.put(orderId, "CREATED");
        emit("OrderCreated", Map.of("orderId", orderId, "amount", 1200.0));

        // Ship order
        orderStatuses.put(orderId, "SHIPPED");
        System.out.println("  [OrderService] Заказ " + orderId + " -> SHIPPED");
        emit("OrderStatusChanged", Map.of("orderId", orderId, "status", "SHIPPED"));

        // Summary
        System.out.println("\\nEvent Store: " + eventStore.size() + " событий");
        System.out.println("Timeline " + orderId + ":");
        int seq = 1;
        for (Event e : eventStore) {
            String detail = "";
            if (e.data.containsKey("paymentStatus"))
                detail = " (" + e.data.get("paymentStatus") + ")";
            if (e.data.containsKey("status"))
                detail = " (" + e.data.get("status") + ")";
            System.out.println("  " + seq++ + ". " + e.type + detail);
        }
        System.out.println("\\nСтатус: " + orderId + " = " + orderStatuses.get(orderId));
    }
}`,
      explanation: 'Полная Event-Driven система: OrderService создаёт заказ и публикует OrderCreated. PaymentService обрабатывает оплату. NotificationService отправляет уведомления. Все коммуникации через события — сервисы не зависят друг от друга. Event Store хранит полную историю для аудита и replay. В production: Kafka topics для каждого типа событий, consumer groups для каждого сервиса.'
    }
  ]
}
