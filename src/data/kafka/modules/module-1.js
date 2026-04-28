export default {
  id: 1,
  title: 'Введение в Message Queues',
  description: 'Что такое очереди сообщений, зачем они нужны, паттерны Point-to-Point и Publish/Subscribe, сравнение брокеров.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Message Queue?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Message Queue (очередь сообщений) — это механизм асинхронной коммуникации между компонентами системы. Один компонент отправляет сообщение в очередь, другой забирает и обрабатывает его. Отправитель и получатель не знают друг о друге и не должны быть доступны одновременно.' },
        { type: 'heading', value: 'Зачем нужны очереди сообщений?' },
        { type: 'text', value: 'Представьте интернет-магазин. Пользователь оформляет заказ. Нужно: списать деньги, отправить email, обновить склад, начислить бонусы. Если всё делать синхронно — пользователь ждёт 5-10 секунд. Если одна из систем недоступна — заказ не оформляется.' },
        { type: 'code', language: 'java', value: '// Синхронный подход — все вызовы последовательно\npublic class OrderService {\n    public void placeOrder(Order order) {\n        paymentService.charge(order);      // 500ms\n        emailService.sendConfirmation(order); // 300ms — а если email упал?\n        inventoryService.reserve(order);    // 200ms\n        bonusService.addPoints(order);      // 100ms\n        // Итого: 1100ms+ и любой сбой ломает весь процесс\n    }\n}\n\n// Асинхронный подход с очередью сообщений\npublic class OrderService {\n    public void placeOrder(Order order) {\n        paymentService.charge(order);       // Только критичная операция синхронно\n        messageQueue.send("order.created", order); // Остальное — через очередь\n        // Итого: 500ms. Email, склад, бонусы обработаются асинхронно\n    }\n}' },
        { type: 'tip', value: 'Очередь сообщений — это как почтовый ящик. Вы бросаете письмо, а адресат забирает его когда будет готов. Вам не нужно ждать, пока он дома, и не нужно знать его расписание.' },
        { type: 'heading', value: 'Ключевые термины' },
        { type: 'list', value: [
          'Producer (издатель) — компонент, который отправляет сообщения',
          'Consumer (подписчик) — компонент, который получает и обрабатывает сообщения',
          'Message (сообщение) — единица данных, передаваемая через очередь',
          'Queue (очередь) — буфер, в котором хранятся сообщения',
          'Broker (брокер) — сервер, который управляет очередями (Kafka, RabbitMQ)',
          'Topic (топик) — именованный канал для группировки сообщений'
        ] },
        { type: 'note', value: 'Message Queue — это общий термин. Конкретные реализации: Apache Kafka, RabbitMQ, Amazon SQS, Apache ActiveMQ, Redis Streams. Каждая имеет свои особенности, но основные концепции одинаковы.' }
      ]
    },
    {
      id: 2,
      title: 'Point-to-Point vs Publish/Subscribe',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существуют два основных паттерна обмена сообщениями: Point-to-Point (точка-точка) и Publish/Subscribe (издатель-подписчик). Понимание разницы критично для правильного выбора архитектуры.' },
        { type: 'heading', value: 'Point-to-Point (Очередь)' },
        { type: 'text', value: 'В паттерне Point-to-Point каждое сообщение обрабатывается ровно одним получателем. Если есть несколько consumers, они конкурируют за сообщения — каждое сообщение достаётся только одному. Это как очередь в банке: каждого клиента обслуживает один кассир.' },
        { type: 'code', language: 'java', value: '// Point-to-Point: каждое сообщение обрабатывается ОДНИМ consumer-ом\n// Пример: обработка заказов — каждый заказ обрабатывается один раз\n\nimport java.util.concurrent.*;\n\npublic class PointToPointDemo {\n    // Очередь — общий буфер между producer и consumers\n    static BlockingQueue<String> queue = new LinkedBlockingQueue<>();\n\n    public static void main(String[] args) throws Exception {\n        // Producer отправляет заказы\n        Thread producer = new Thread(() -> {\n            for (int i = 1; i <= 5; i++) {\n                String order = "Заказ-" + i;\n                queue.offer(order);\n                System.out.println("[Producer] Отправил: " + order);\n            }\n        });\n\n        // Consumer 1 — обрабатывает заказы\n        Thread consumer1 = new Thread(() -> {\n            while (true) {\n                try {\n                    String msg = queue.poll(2, TimeUnit.SECONDS);\n                    if (msg == null) break;\n                    System.out.println("[Consumer-1] Обработал: " + msg);\n                } catch (InterruptedException e) { break; }\n            }\n        });\n\n        // Consumer 2 — тоже обрабатывает заказы (конкурирует)\n        Thread consumer2 = new Thread(() -> {\n            while (true) {\n                try {\n                    String msg = queue.poll(2, TimeUnit.SECONDS);\n                    if (msg == null) break;\n                    System.out.println("[Consumer-2] Обработал: " + msg);\n                } catch (InterruptedException e) { break; }\n            }\n        });\n\n        producer.start();\n        producer.join();\n        consumer1.start();\n        consumer2.start();\n    }\n}\n// Каждый заказ обработан РОВНО ОДНИМ consumer-ом!' },
        { type: 'heading', value: 'Publish/Subscribe (Топик)' },
        { type: 'text', value: 'В паттерне Pub/Sub каждое сообщение доставляется ВСЕМ подписчикам. Если есть 3 подписчика — каждый получит копию сообщения. Это как радиостанция: все слушатели слышат одну и ту же передачу.' },
        { type: 'code', language: 'java', value: '// Publish/Subscribe: сообщение получают ВСЕ подписчики\n// Пример: уведомление о новом заказе — email, SMS, аналитика\n\nimport java.util.*;\nimport java.util.concurrent.*;\nimport java.util.function.Consumer;\n\npublic class PubSubDemo {\n    // Топик хранит список подписчиков\n    static List<Consumer<String>> subscribers = new CopyOnWriteArrayList<>();\n\n    static void subscribe(String name, Consumer<String> handler) {\n        subscribers.add(msg -> {\n            System.out.println("[" + name + "] Получил: " + msg);\n            handler.accept(msg);\n        });\n    }\n\n    static void publish(String message) {\n        System.out.println("[Publisher] Отправил: " + message);\n        // Сообщение доставляется ВСЕМ подписчикам\n        for (Consumer<String> sub : subscribers) {\n            sub.accept(message);\n        }\n    }\n\n    public static void main(String[] args) {\n        // Три подписчика — каждый получит каждое сообщение\n        subscribe("Email", msg -> {}); // отправить email\n        subscribe("SMS",   msg -> {}); // отправить SMS\n        subscribe("Analytics", msg -> {}); // записать в аналитику\n\n        publish("Заказ #1001 создан");\n        publish("Заказ #1002 создан");\n    }\n}\n// Выход: каждый подписчик получил ОБА сообщения' },
        { type: 'warning', value: 'Point-to-Point используется когда задачу нужно выполнить один раз (обработка заказа, отправка email). Pub/Sub — когда множество систем должны узнать о событии (аналитика + уведомления + аудит). Kafka поддерживает оба паттерна через consumer groups.' }
      ]
    },
    {
      id: 3,
      title: 'Преимущества очередей сообщений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Очереди сообщений решают фундаментальные проблемы распределённых систем. Они обеспечивают слабую связанность, буферизацию нагрузки и отказоустойчивость. Компании уровня Netflix, Uber, LinkedIn обрабатывают миллиарды сообщений в день.' },
        { type: 'heading', value: '1. Слабая связанность (Decoupling)' },
        { type: 'text', value: 'Сервисы не знают друг о друге. Producer отправляет сообщение в топик и не знает, кто его прочитает. Consumer подписывается на топик и не знает, кто туда пишет. Можно добавлять и убирать consumers без изменения producer.' },
        { type: 'code', language: 'java', value: '// БЕЗ очереди — жёсткая связь\npublic class OrderService {\n    private EmailService emailService;     // прямая зависимость\n    private SmsService smsService;         // прямая зависимость\n    private AnalyticsService analytics;    // прямая зависимость\n\n    public void placeOrder(Order order) {\n        // Если добавить новый сервис — нужно менять OrderService!\n        emailService.send(order);\n        smsService.send(order);\n        analytics.track(order);\n    }\n}\n\n// С очередью — слабая связь\npublic class OrderService {\n    private MessageBroker broker; // единственная зависимость\n\n    public void placeOrder(Order order) {\n        broker.publish("orders", order); // не знает кто слушает\n        // Можно добавить 10 новых consumer-ов без изменений тут\n    }\n}' },
        { type: 'heading', value: '2. Буферизация нагрузки (Load Leveling)' },
        { type: 'text', value: 'Очередь работает как буфер. Если producer отправляет 10 000 сообщений в секунду, а consumer обрабатывает 1 000 — очередь накапливает сообщения. Consumer обработает их в своём темпе. Без очереди система бы упала.' },
        { type: 'heading', value: '3. Отказоустойчивость (Resilience)' },
        { type: 'text', value: 'Если consumer упал — сообщения не теряются. Они ждут в очереди. Когда consumer поднимется, он продолжит обработку с того места, где остановился. Это критично для финансовых операций.' },
        { type: 'heading', value: '4. Масштабируемость (Scalability)' },
        { type: 'code', language: 'java', value: '// Масштабирование через несколько consumers\n// Kafka: добавляем consumer-ов в consumer group\n// Каждый consumer обрабатывает свою часть данных (партицию)\n\n// 1 consumer:  10 000 msg/s — не хватает\n// 2 consumers: 20 000 msg/s — добавили ещё одного\n// 5 consumers: 50 000 msg/s — горизонтальное масштабирование\n\n// Пример: Black Friday в интернет-магазине\n// Обычный день: 2 consumers обрабатывают заказы\n// Black Friday: поднимаем 20 consumers\n// После распродажи: возвращаемся к 2 consumers\n\n// Это невозможно с синхронными вызовами!' },
        { type: 'list', value: [
          'Decoupling — сервисы не зависят друг от друга напрямую',
          'Load Leveling — очередь сглаживает пики нагрузки',
          'Resilience — сообщения не теряются при сбоях',
          'Scalability — добавляем consumers для увеличения throughput',
          'Ordering — Kafka гарантирует порядок в рамках партиции',
          'Replay — Kafka позволяет перечитать старые сообщения'
        ] },
        { type: 'tip', value: 'LinkedIn создал Apache Kafka именно для решения проблемы масштабируемости. У них были десятки систем, которые должны были обмениваться данными, и прямые вызовы между ними стали неуправляемыми.' }
      ]
    },
    {
      id: 4,
      title: 'Сравнение: Kafka vs RabbitMQ vs SQS',
      type: 'theory',
      content: [
        { type: 'text', value: 'На рынке существует множество брокеров сообщений. Три самых популярных: Apache Kafka, RabbitMQ и Amazon SQS. Каждый имеет свои сильные стороны и подходит для разных задач.' },
        { type: 'heading', value: 'Apache Kafka' },
        { type: 'text', value: 'Kafka — это распределённая платформа для потоковой обработки данных. Создана в LinkedIn в 2011 году. Основные особенности: высокая пропускная способность (миллионы сообщений в секунду), хранение истории, replay сообщений, exactly-once семантика.' },
        { type: 'code', language: 'java', value: '// Kafka — лучший выбор когда:\n// 1. Нужна высокая пропускная способность (>100K msg/s)\n// 2. Нужно хранить историю сообщений (дни, недели)\n// 3. Нужен replay — перечитать старые сообщения\n// 4. Event Sourcing / Event-Driven Architecture\n// 5. Потоковая обработка (Kafka Streams)\n\n// Характеристики:\n// Модель: Log (append-only журнал)\n// Протокол: собственный бинарный TCP\n// Хранение: на диске, сохраняет ВСЕ сообщения (настраиваемый retention)\n// Пропускная: миллионы msg/s\n// Порядок: гарантирован в рамках партиции\n// Consumer groups: да (параллельная обработка)\n\n// Кто использует: LinkedIn, Netflix, Uber, Airbnb, Twitter' },
        { type: 'heading', value: 'RabbitMQ' },
        { type: 'text', value: 'RabbitMQ — классический брокер сообщений на основе протокола AMQP. Поддерживает сложную маршрутизацию сообщений через exchanges и binding keys. Отлично подходит для задач с гибкой маршрутизацией.' },
        { type: 'code', language: 'java', value: '// RabbitMQ — лучший выбор когда:\n// 1. Нужна сложная маршрутизация (routing, topics, headers)\n// 2. Нужны приоритеты сообщений\n// 3. Нужен RPC через очереди\n// 4. Нужен dead letter queue из коробки\n// 5. Простые задачи с умеренной нагрузкой\n\n// Характеристики:\n// Модель: Queue (традиционная очередь)\n// Протокол: AMQP 0.9.1\n// Хранение: в памяти + диск (сообщения удаляются после ACK)\n// Пропускная: десятки тысяч msg/s\n// Маршрутизация: гибкая (direct, topic, fanout, headers exchanges)\n// Приоритеты: да\n\n// Кто использует: Instagram (раньше), Mozilla, VMware' },
        { type: 'heading', value: 'Когда что выбрать?' },
        { type: 'list', value: [
          'Kafka: event streaming, аналитика, высокая нагрузка, хранение истории',
          'RabbitMQ: task queues, сложная маршрутизация, RPC, умеренная нагрузка',
          'SQS: если всё в AWS и не хотите управлять инфраструктурой',
          'Redis Streams: лёгкое решение, если Redis уже в стеке',
          'Не выбирайте Kafka для простых задач — это overkill',
          'Не выбирайте RabbitMQ для event streaming с replay — нет хранения истории'
        ] },
        { type: 'warning', value: 'Ключевая разница: Kafka ХРАНИТ сообщения после прочтения (настраиваемый retention period). RabbitMQ УДАЛЯЕТ сообщения после ACK от consumer. Это определяет сценарии использования: Kafka для event log, RabbitMQ для task processing.' }
      ]
    },
    {
      id: 5,
      title: 'Архитектура обмена сообщениями',
      type: 'theory',
      content: [
        { type: 'text', value: 'Прежде чем изучать конкретные брокеры, важно понять общие архитектурные паттерны обмена сообщениями. Эти паттерны работают одинаково в любом брокере и формируют фундамент event-driven систем.' },
        { type: 'heading', value: 'Fire-and-Forget' },
        { type: 'text', value: 'Самый простой паттерн. Producer отправляет сообщение и не ждёт ответа. Используется когда результат обработки не важен для отправителя (логирование, аналитика, уведомления).' },
        { type: 'code', language: 'java', value: '// Паттерн Fire-and-Forget\nimport java.util.concurrent.*;\nimport java.util.*;\n\npublic class FireAndForget {\n    static BlockingQueue<Map<String, String>> auditQueue = new LinkedBlockingQueue<>();\n\n    // Producer: отправил и забыл\n    static void logAction(String userId, String action) {\n        Map<String, String> event = new HashMap<>();\n        event.put("userId", userId);\n        event.put("action", action);\n        event.put("timestamp", String.valueOf(System.currentTimeMillis()));\n        auditQueue.offer(event); // неблокирующая отправка\n        // Не ждём подтверждения обработки!\n    }\n\n    // Consumer: обрабатывает в фоне\n    static void startAuditConsumer() {\n        new Thread(() -> {\n            while (true) {\n                try {\n                    Map<String, String> event = auditQueue.take();\n                    System.out.println("[Audit] " + event);\n                    // Записываем в БД аудита\n                } catch (InterruptedException e) { break; }\n            }\n        }).start();\n    }\n}' },
        { type: 'heading', value: 'Request-Reply через очередь' },
        { type: 'text', value: 'Иногда producer должен получить ответ от consumer. Для этого используется паттерн Request-Reply: producer отправляет запрос в одну очередь и ждёт ответа в другой.' },
        { type: 'code', language: 'java', value: '// Паттерн Request-Reply\nimport java.util.concurrent.*;\nimport java.util.*;\n\npublic class RequestReply {\n    static BlockingQueue<Map<String, Object>> requestQueue = new LinkedBlockingQueue<>();\n    static BlockingQueue<Map<String, Object>> replyQueue = new LinkedBlockingQueue<>();\n\n    // Producer: отправляет запрос и ЖДЁТ ответ\n    static String sendAndWait(String request) throws Exception {\n        String correlationId = UUID.randomUUID().toString();\n        Map<String, Object> msg = new HashMap<>();\n        msg.put("correlationId", correlationId);\n        msg.put("body", request);\n        requestQueue.offer(msg);\n\n        // Ждём ответ с тем же correlationId\n        while (true) {\n            Map<String, Object> reply = replyQueue.poll(5, TimeUnit.SECONDS);\n            if (reply != null && correlationId.equals(reply.get("correlationId"))) {\n                return (String) reply.get("body");\n            }\n        }\n    }\n\n    // Consumer: обрабатывает и отправляет ответ\n    static void startWorker() {\n        new Thread(() -> {\n            while (true) {\n                try {\n                    Map<String, Object> req = requestQueue.take();\n                    String result = "Обработано: " + req.get("body");\n                    Map<String, Object> reply = new HashMap<>();\n                    reply.put("correlationId", req.get("correlationId"));\n                    reply.put("body", result);\n                    replyQueue.offer(reply);\n                } catch (InterruptedException e) { break; }\n            }\n        }).start();\n    }\n}' },
        { type: 'heading', value: 'Event Notification' },
        { type: 'text', value: 'Самый мощный паттерн. Сервис публикует событие (факт, что что-то произошло), и любой заинтересованный сервис может подписаться. Producer не знает и не должен знать, кто слушает.' },
        { type: 'note', value: 'В реальных системах часто комбинируют паттерны. Оплата — Request-Reply (нужен результат), уведомления — Fire-and-Forget, а аналитика, аудит, синхронизация данных — Event Notification.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Простой брокер сообщений',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте простой брокер сообщений на Java, поддерживающий создание топиков, публикацию сообщений и подписку consumers.',
      requirements: [
        'Класс SimpleBroker с методами: createTopic, publish, subscribe',
        'Метод createTopic(String topicName) — создаёт новый топик',
        'Метод publish(String topic, String message) — отправляет сообщение в топик',
        'Метод subscribe(String topic, String consumerName) — подписывает consumer на топик',
        'Каждый consumer получает копию каждого сообщения (Pub/Sub)',
        'Выведите все сообщения, полученные каждым consumer-ом'
      ],
      hint: 'Используйте Map<String, List<BlockingQueue<String>>> — для каждого топика храните список очередей (по одной на каждого consumer). При publish кладите сообщение во ВСЕ очереди топика.',
      expectedOutput: '[Broker] Топик "orders" создан\n[Broker] Топик "payments" создан\n[Broker] Consumer "EmailService" подписан на "orders"\n[Broker] Consumer "Analytics" подписан на "orders"\n[Broker] Consumer "Accounting" подписан на "payments"\n[Broker] Опубликовано в "orders": Заказ #1\n[EmailService] Получил из "orders": Заказ #1\n[Analytics] Получил из "orders": Заказ #1\n[Broker] Опубликовано в "payments": Оплата $100\n[Accounting] Получил из "payments": Оплата $100',
      solution: `import java.util.*;
import java.util.concurrent.*;

public class Main {
    // Топик -> список очередей consumers
    static Map<String, List<BlockingQueue<String>>> topics = new ConcurrentHashMap<>();
    // Топик -> список имён consumers (для вывода)
    static Map<String, List<String>> consumerNames = new ConcurrentHashMap<>();

    static void createTopic(String topicName) {
        topics.put(topicName, new CopyOnWriteArrayList<>());
        consumerNames.put(topicName, new CopyOnWriteArrayList<>());
        System.out.println("[Broker] Топик \\"" + topicName + "\\" создан");
    }

    static BlockingQueue<String> subscribe(String topic, String name) {
        BlockingQueue<String> queue = new LinkedBlockingQueue<>();
        topics.get(topic).add(queue);
        consumerNames.get(topic).add(name);
        System.out.println("[Broker] Consumer \\"" + name + "\\" подписан на \\"" + topic + "\\"");
        return queue;
    }

    static void publish(String topic, String message) {
        System.out.println("[Broker] Опубликовано в \\"" + topic + "\\": " + message);
        List<BlockingQueue<String>> queues = topics.get(topic);
        for (BlockingQueue<String> q : queues) {
            q.offer(message);
        }
    }

    static void consumeAll(String topic, String name, BlockingQueue<String> queue) {
        while (true) {
            try {
                String msg = queue.poll(500, TimeUnit.MILLISECONDS);
                if (msg == null) break;
                System.out.println("[" + name + "] Получил из \\"" + topic + "\\": " + msg);
            } catch (InterruptedException e) {
                break;
            }
        }
    }

    public static void main(String[] args) throws Exception {
        createTopic("orders");
        createTopic("payments");

        BlockingQueue<String> emailQueue = subscribe("orders", "EmailService");
        BlockingQueue<String> analyticsQueue = subscribe("orders", "Analytics");
        BlockingQueue<String> accountingQueue = subscribe("payments", "Accounting");

        publish("orders", "Заказ #1");
        publish("payments", "Оплата $100");

        consumeAll("orders", "EmailService", emailQueue);
        consumeAll("orders", "Analytics", analyticsQueue);
        consumeAll("payments", "Accounting", accountingQueue);
    }
}`,
      explanation: 'Мы реализовали паттерн Pub/Sub. Каждый consumer получает собственную очередь (BlockingQueue). При publish сообщение копируется во ВСЕ очереди топика. Это базовый механизм, который лежит в основе Apache Kafka и RabbitMQ fanout exchange.'
    }
  ]
}
