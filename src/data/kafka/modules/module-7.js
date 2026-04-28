export default {
  id: 7,
  title: 'RabbitMQ: основы',
  description: 'Архитектура RabbitMQ: exchanges, queues, bindings, routing keys, AMQP протокол, виртуальные хосты.',
  lessons: [
    {
      id: 1,
      title: 'Архитектура RabbitMQ',
      type: 'theory',
      content: [
        { type: 'text', value: 'RabbitMQ — классический брокер сообщений, реализующий протокол AMQP (Advanced Message Queuing Protocol). В отличие от Kafka, RabbitMQ использует модель "умный брокер, простой consumer": брокер управляет маршрутизацией и доставкой сообщений.' },
        { type: 'heading', value: 'Компоненты RabbitMQ' },
        { type: 'code', language: 'java', value: '// Архитектура RabbitMQ:\n//\n// Producer --> [Exchange] --> Binding --> [Queue] --> Consumer\n//\n// Producer: отправляет сообщение в Exchange (НЕ напрямую в очередь!)\n// Exchange: маршрутизатор. Определяет, в какую очередь попадёт сообщение\n// Binding: правило связи между Exchange и Queue\n// Queue: буфер, хранит сообщения до обработки consumer-ом\n// Consumer: читает и обрабатывает сообщения из Queue\n//\n// Ключевое отличие от Kafka:\n// Kafka:    Producer -> Topic -> Consumer (простая модель)\n// RabbitMQ: Producer -> Exchange -> Queue -> Consumer (гибкая маршрутизация)\n//\n// В Kafka consumer сам решает что читать (pull)\n// В RabbitMQ брокер отправляет сообщения consumer-у (push)' },
        { type: 'heading', value: 'AMQP протокол' },
        { type: 'list', value: [
          'AMQP 0.9.1 — стандартный протокол RabbitMQ',
          'Connection — TCP соединение с брокером',
          'Channel — виртуальное соединение внутри Connection (легковесное)',
          'Virtual Host — изоляция ресурсов (как namespace)',
          'Exchange — маршрутизатор сообщений',
          'Queue — очередь для хранения сообщений',
          'Binding — правило связи Exchange-Queue с routing key'
        ] },
        { type: 'tip', value: 'Один Connection может иметь множество Channel-ов. Это эффективнее, чем создавать отдельное TCP соединение для каждого потока. Правило: один Channel на один поток (thread). Не используйте один Channel из нескольких потоков — это не thread-safe.' }
      ]
    },
    {
      id: 2,
      title: 'Exchanges: типы и маршрутизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Exchange — центральный элемент маршрутизации в RabbitMQ. Producer отправляет сообщение в Exchange с routing key. Exchange определяет, в какие очереди направить сообщение, на основе своего типа и binding rules.' },
        { type: 'heading', value: 'Direct Exchange' },
        { type: 'code', language: 'java', value: '// Direct Exchange: точное совпадение routing key\n// Сообщение попадает в очередь, если routing key == binding key\n//\n// Exchange "orders" (type: direct)\n//   |-- binding key="new"     --> Queue "new-orders"\n//   |-- binding key="paid"    --> Queue "paid-orders"\n//   |-- binding key="shipped" --> Queue "shipped-orders"\n//\n// publish(exchange="orders", routingKey="new",  msg) -> Queue "new-orders"\n// publish(exchange="orders", routingKey="paid", msg) -> Queue "paid-orders"\n// publish(exchange="orders", routingKey="cancelled", msg) -> НИКУДА (нет binding)' },
        { type: 'heading', value: 'Fanout Exchange' },
        { type: 'code', language: 'java', value: '// Fanout Exchange: отправляет во ВСЕ привязанные очереди\n// Routing key ИГНОРИРУЕТСЯ\n//\n// Exchange "notifications" (type: fanout)\n//   |-- Queue "email-queue"     (получает ВСЕ сообщения)\n//   |-- Queue "sms-queue"       (получает ВСЕ сообщения)\n//   |-- Queue "push-queue"      (получает ВСЕ сообщения)\n//\n// publish(exchange="notifications", routingKey="", msg)\n// -> email-queue, sms-queue, push-queue (ВСЕ получат!)\n//\n// Аналог Kafka consumer groups из разных групп\n// Или Kafka topic с 3 consumer groups' },
        { type: 'heading', value: 'Topic Exchange' },
        { type: 'code', language: 'java', value: '// Topic Exchange: паттерн-matching с wildcards\n// Routing key: "order.new.moscow"\n// Binding key: "order.*.moscow" или "order.#"\n//\n// * — ровно одно слово\n// # — ноль или более слов\n//\n// Exchange "events" (type: topic)\n//   |-- "order.new.*"     --> Queue "new-orders"\n//   |-- "order.*.moscow"  --> Queue "moscow-orders"\n//   |-- "order.#"         --> Queue "all-orders"\n//   |-- "payment.#"       --> Queue "payments"\n//\n// publish(routingKey="order.new.moscow")\n//   -> new-orders (order.new.* совпал)\n//   -> moscow-orders (order.*.moscow совпал)\n//   -> all-orders (order.# совпал)\n//   -> payments НЕ совпал\n//\n// publish(routingKey="order.paid.spb")\n//   -> all-orders (order.# совпал)\n//   -> Остальные НЕ совпали' },
        { type: 'heading', value: 'Headers Exchange' },
        { type: 'text', value: 'Headers Exchange маршрутизирует по заголовкам сообщения, а не по routing key. Позволяет маршрутизацию по нескольким критериям (x-match=all для AND, x-match=any для OR).' },
        { type: 'warning', value: 'Default Exchange ("") — безымянный direct exchange. Каждая очередь автоматически привязана к нему с binding key = имя очереди. Это позволяет отправлять напрямую в очередь: publish(exchange="", routingKey="queue-name", msg).' }
      ]
    },
    {
      id: 3,
      title: 'Queues: настройки и свойства',
      type: 'theory',
      content: [
        { type: 'text', value: 'Queue (очередь) — это буфер, который хранит сообщения до их обработки consumer-ом. В RabbitMQ очередь — основной механизм хранения, в отличие от Kafka, где данные хранятся в партициях топика.' },
        { type: 'heading', value: 'Свойства очереди' },
        { type: 'code', language: 'java', value: '// Объявление очереди:\n// channel.queueDeclare("orders", durable, exclusive, autoDelete, arguments)\n//\n// durable = true:     очередь выживает при рестарте RabbitMQ\n// durable = false:    очередь удаляется при рестарте\n//\n// exclusive = true:   очередь доступна только одному connection\n//                     удаляется при закрытии connection\n//\n// autoDelete = true:  очередь удаляется когда последний consumer отключился\n//\n// arguments:\n//   x-message-ttl: 60000        // сообщения живут 60 секунд\n//   x-max-length: 10000         // максимум 10K сообщений\n//   x-max-length-bytes: 1048576 // максимум 1MB\n//   x-dead-letter-exchange: "dlx"  // куда отправлять rejected сообщения\n//   x-max-priority: 10          // поддержка приоритетов (0-10)' },
        { type: 'heading', value: 'Durability и Persistence' },
        { type: 'code', language: 'java', value: '// Для надёжного хранения нужно ДВА условия:\n//\n// 1. Очередь durable (выживает рестарт):\n// channel.queueDeclare("orders", true, false, false, null);\n//\n// 2. Сообщение persistent (записывается на диск):\n// AMQP.BasicProperties props = new AMQP.BasicProperties.Builder()\n//     .deliveryMode(2) // persistent\n//     .build();\n// channel.basicPublish("", "orders", props, message.getBytes());\n//\n// Только если ОБА условия выполнены:\n// ✅ durable queue + persistent message = данные не потеряются\n// ❌ durable queue + transient message = сообщения потеряются\n// ❌ non-durable queue + persistent message = очередь потеряется' },
        { type: 'heading', value: 'Lazy Queues и Quorum Queues' },
        { type: 'list', value: [
          'Classic Queue — хранит сообщения в памяти (по возможности)',
          'Lazy Queue — хранит сообщения на диске (для больших очередей)',
          'Quorum Queue — реплицированная очередь с Raft consensus (рекомендуется для production)',
          'Stream — новый тип с Kafka-like семантикой (append-only log)',
          'Quorum Queues заменяют mirrored queues начиная с RabbitMQ 3.8'
        ] },
        { type: 'tip', value: 'Для production ВСЕГДА используйте Quorum Queues. Они реплицируются через Raft consensus на несколько нод, обеспечивая отказоустойчивость. Classic mirrored queues deprecated и не гарантируют consistency.' }
      ]
    },
    {
      id: 4,
      title: 'Acknowledgments и Prefetch',
      type: 'theory',
      content: [
        { type: 'text', value: 'Acknowledgment (ACK) — подтверждение consumer-ом того, что сообщение обработано. Пока consumer не отправит ACK, RabbitMQ не удаляет сообщение из очереди. Prefetch ограничивает количество неподтверждённых сообщений.' },
        { type: 'heading', value: 'Типы Acknowledgment' },
        { type: 'code', language: 'java', value: '// 1. Auto ACK (autoAck=true) — опасно!\n// channel.basicConsume("orders", true, consumer);\n// Сообщение подтверждается СРАЗУ после отправки consumer-у\n// Если consumer упадёт во время обработки — сообщение ПОТЕРЯНО\n\n// 2. Manual ACK (autoAck=false) — рекомендуется\n// channel.basicConsume("orders", false, consumer);\n// ...\n// // После успешной обработки:\n// channel.basicAck(deliveryTag, false);\n//\n// // Если обработка неудачна — вернуть в очередь:\n// channel.basicNack(deliveryTag, false, true); // requeue=true\n//\n// // Или отклонить без повторной доставки:\n// channel.basicReject(deliveryTag, false); // requeue=false -> DLQ' },
        { type: 'heading', value: 'Prefetch Count' },
        { type: 'code', language: 'java', value: '// Prefetch Count — сколько сообщений отправить consumer-у до ACK\n// channel.basicQos(10); // максимум 10 неподтверждённых\n//\n// prefetch=1:  отправить 1 сообщение, ждать ACK, отправить следующее\n//              Медленно, но справедливое распределение нагрузки\n//              Подходит для тяжёлых задач (обработка видео)\n//\n// prefetch=10: отправить 10 сообщений сразу\n//              Быстрее, но медленный consumer может накопить backlog\n//              Подходит для лёгких задач (отправка email)\n//\n// prefetch=0:  без ограничений — RabbitMQ отправит ВСЁ\n//              НИКОГДА не используйте! Consumer утонет в сообщениях\n\n// Правило:\n// Тяжёлые задачи (>1 сек): prefetch = 1-5\n// Лёгкие задачи (<100 мс): prefetch = 10-50\n// Мониторьте consumer utilization в Management UI' },
        { type: 'heading', value: 'Dead Letter Exchange (DLX)' },
        { type: 'text', value: 'Когда сообщение отклонено (nack/reject с requeue=false), истёк TTL, или очередь переполнена — сообщение отправляется в Dead Letter Exchange. Это очередь для проблемных сообщений.' },
        { type: 'code', language: 'java', value: '// Настройка DLX:\n// Map<String, Object> args = new HashMap<>();\n// args.put("x-dead-letter-exchange", "dlx");\n// args.put("x-dead-letter-routing-key", "dead-orders");\n// channel.queueDeclare("orders", true, false, false, args);\n//\n// Сценарий:\n// 1. Consumer получает сообщение из "orders"\n// 2. Обработка неудачна 3 раза\n// 3. channel.basicReject(tag, false) // requeue=false\n// 4. Сообщение попадает в exchange "dlx" с key "dead-orders"\n// 5. DLX queue привязана к "dlx" exchange\n// 6. Ops-команда анализирует проблемные сообщения' },
        { type: 'warning', value: 'НИКОГДА не используйте autoAck=true для важных данных. Если consumer упадёт между получением и обработкой — сообщение потеряно навсегда. Всегда manual ACK + prefetch для production.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Exchange Router',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте модель RabbitMQ Exchange с поддержкой Direct, Fanout и Topic маршрутизации.',
      requirements: [
        'Интерфейс Exchange с методом route(routingKey, message)',
        'DirectExchange — точное совпадение routing key',
        'FanoutExchange — отправка во все привязанные очереди',
        'TopicExchange — pattern matching с * и #',
        'Метод bind(queue, bindingKey) — привязка очереди',
        'Покажите работу каждого типа exchange'
      ],
      hint: 'Для TopicExchange замените * на [^.]+  и # на .* в регулярных выражениях. Затем используйте Pattern.matches() для проверки.',
      expectedOutput: '=== Direct Exchange ===\npublish(key="error", msg="Disk full") -> [alerts]\npublish(key="info", msg="Started") -> [logs]\npublish(key="debug", msg="x=5") -> [] (нет binding)\n\n=== Fanout Exchange ===\npublish(msg="Заказ создан") -> [email, sms, push] (все очереди)\n\n=== Topic Exchange ===\npublish(key="order.new.moscow") -> [new-orders, moscow-orders, all-orders]\npublish(key="order.paid.spb") -> [all-orders]\npublish(key="payment.completed.moscow") -> [payments]',
      solution: `import java.util.*;
import java.util.regex.*;

public class Main {
    static class Queue {
        String name;
        List<String> messages = new ArrayList<>();
        Queue(String name) { this.name = name; }
    }

    // Direct Exchange
    static class DirectExchange {
        Map<String, List<Queue>> bindings = new HashMap<>();

        void bind(Queue queue, String bindingKey) {
            bindings.computeIfAbsent(bindingKey, k -> new ArrayList<>()).add(queue);
        }

        List<String> publish(String routingKey, String message) {
            List<Queue> targets = bindings.getOrDefault(routingKey, Collections.emptyList());
            List<String> routed = new ArrayList<>();
            for (Queue q : targets) {
                q.messages.add(message);
                routed.add(q.name);
            }
            return routed;
        }
    }

    // Fanout Exchange
    static class FanoutExchange {
        List<Queue> queues = new ArrayList<>();

        void bind(Queue queue, String ignored) {
            queues.add(queue);
        }

        List<String> publish(String routingKey, String message) {
            List<String> routed = new ArrayList<>();
            for (Queue q : queues) {
                q.messages.add(message);
                routed.add(q.name);
            }
            return routed;
        }
    }

    // Topic Exchange
    static class TopicExchange {
        Map<String, Queue> bindings = new LinkedHashMap<>();

        void bind(Queue queue, String bindingKey) {
            bindings.put(bindingKey, queue);
        }

        boolean matches(String routingKey, String bindingKey) {
            String regex = bindingKey
                .replace(".", "\\\\.")
                .replace("*", "[^.]+")
                .replace("#", ".*");
            // Handle the special case where # should match empty string too
            regex = regex.replace("\\\\..*", "(\\\\..*)?");
            return routingKey.matches(regex.replace("\\\\\\\\.", "\\\\."));
        }

        List<String> publish(String routingKey, String message) {
            List<String> routed = new ArrayList<>();
            for (Map.Entry<String, Queue> entry : bindings.entrySet()) {
                String pattern = entry.getKey();
                Queue queue = entry.getValue();
                if (topicMatch(routingKey, pattern)) {
                    queue.messages.add(message);
                    routed.add(queue.name);
                }
            }
            return routed;
        }

        boolean topicMatch(String routingKey, String pattern) {
            String regex = pattern
                .replace(".", "\\\\.")
                .replace("*", "[^.]+")
                .replace("#", "(.+)?");
            regex = "^" + regex + "$";
            // Fix escaped dots
            regex = regex.replace("\\\\\\\\.", "\\\\.");
            try {
                return Pattern.matches(regex.replace("\\\\.", "\\."), routingKey);
            } catch (Exception e) {
                return false;
            }
        }
    }

    public static void main(String[] args) {
        // Direct Exchange
        System.out.println("=== Direct Exchange ===");
        DirectExchange direct = new DirectExchange();
        Queue alerts = new Queue("alerts");
        Queue logs = new Queue("logs");
        direct.bind(alerts, "error");
        direct.bind(logs, "info");

        System.out.println("publish(key=\\"error\\", msg=\\"Disk full\\") -> " + direct.publish("error", "Disk full"));
        System.out.println("publish(key=\\"info\\", msg=\\"Started\\") -> " + direct.publish("info", "Started"));
        System.out.println("publish(key=\\"debug\\", msg=\\"x=5\\") -> " + direct.publish("debug", "x=5") + " (нет binding)");

        // Fanout Exchange
        System.out.println("\\n=== Fanout Exchange ===");
        FanoutExchange fanout = new FanoutExchange();
        fanout.bind(new Queue("email"), "");
        fanout.bind(new Queue("sms"), "");
        fanout.bind(new Queue("push"), "");
        System.out.println("publish(msg=\\"Заказ создан\\") -> " + fanout.publish("", "Заказ создан") + " (все очереди)");

        // Topic Exchange
        System.out.println("\\n=== Topic Exchange ===");
        TopicExchange topic = new TopicExchange();
        Queue newOrders = new Queue("new-orders");
        Queue moscowOrders = new Queue("moscow-orders");
        Queue allOrders = new Queue("all-orders");
        Queue payments = new Queue("payments");

        topic.bind(newOrders, "order.new.*");
        topic.bind(moscowOrders, "order.*.moscow");
        topic.bind(allOrders, "order.#");
        topic.bind(payments, "payment.#");

        System.out.println("publish(key=\\"order.new.moscow\\") -> "
            + topic.publish("order.new.moscow", "Новый заказ Москва"));
        System.out.println("publish(key=\\"order.paid.spb\\") -> "
            + topic.publish("order.paid.spb", "Оплачен Питер"));
        System.out.println("publish(key=\\"payment.completed.moscow\\") -> "
            + topic.publish("payment.completed.moscow", "Платёж"));
    }
}`,
      explanation: 'Direct Exchange маршрутизирует по точному совпадению routing key. Fanout отправляет во все привязанные очереди. Topic Exchange поддерживает wildcards: * для одного слова и # для любого количества слов. Это даёт RabbitMQ гибкость маршрутизации, недоступную в Kafka.'
    },
    {
      id: 6,
      title: 'Практика: ACK и Prefetch',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте модель consumer-а RabbitMQ с manual ACK, prefetch count и Dead Letter Queue.',
      requirements: [
        'Класс RabbitQueue с очередью сообщений и DLQ',
        'Consumer с manual ACK и prefetch count',
        'Метод ack(deliveryTag) — подтвердить обработку',
        'Метод nack(deliveryTag, requeue) — отклонить',
        'При requeue=false сообщение попадает в DLQ',
        'Покажите сценарий: 3 сообщения, 1 отклонено в DLQ'
      ],
      hint: 'Храните unackedMessages как Map<Integer, String>. prefetch ограничивает размер unacked. При nack(requeue=false) перемещайте в DLQ.',
      expectedOutput: '=== RabbitMQ: Manual ACK + Prefetch ===\nPrefetch count: 2\n\nОчередь: [Заказ-1, Заказ-2, Заказ-3, BAD-MSG, Заказ-5]\n\n[Deliver] tag=1, msg="Заказ-1" (unacked: 1/2)\n[Deliver] tag=2, msg="Заказ-2" (unacked: 2/2)\n[Prefetch limit] Ожидание ACK...\n[ACK] tag=1 -> "Заказ-1" подтверждён, удалён из очереди\n[ACK] tag=2 -> "Заказ-2" подтверждён, удалён из очереди\n\n[Deliver] tag=3, msg="Заказ-3" (unacked: 1/2)\n[Deliver] tag=4, msg="BAD-MSG" (unacked: 2/2)\n[ACK] tag=3 -> "Заказ-3" подтверждён\n[NACK] tag=4 -> "BAD-MSG" отклонён, requeue=false -> DLQ\n\n[Deliver] tag=5, msg="Заказ-5" (unacked: 1/2)\n[ACK] tag=5 -> "Заказ-5" подтверждён\n\nОбработано: 4\nDead Letter Queue: [BAD-MSG]',
      solution: `import java.util.*;

public class Main {
    static class RabbitQueue {
        String name;
        LinkedList<String> messages = new LinkedList<>();
        List<String> dlq = new ArrayList<>();
        Map<Integer, String> unacked = new LinkedHashMap<>();
        int nextTag = 1;
        int prefetch;
        int processedCount = 0;

        RabbitQueue(String name, int prefetch) {
            this.name = name;
            this.prefetch = prefetch;
        }

        void enqueue(String... msgs) {
            for (String msg : msgs) messages.add(msg);
        }

        String deliver() {
            if (unacked.size() >= prefetch) {
                System.out.println("[Prefetch limit] Ожидание ACK...");
                return null;
            }
            if (messages.isEmpty()) return null;

            String msg = messages.poll();
            int tag = nextTag++;
            unacked.put(tag, msg);
            System.out.println("[Deliver] tag=" + tag + ", msg=\\"" + msg
                + "\\" (unacked: " + unacked.size() + "/" + prefetch + ")");
            return msg;
        }

        void ack(int tag) {
            String msg = unacked.remove(tag);
            if (msg != null) {
                processedCount++;
                System.out.println("[ACK] tag=" + tag + " -> \\"" + msg + "\\" подтверждён"
                    + (messages.isEmpty() ? "" : ", удалён из очереди"));
            }
        }

        void nack(int tag, boolean requeue) {
            String msg = unacked.remove(tag);
            if (msg != null) {
                if (requeue) {
                    messages.addFirst(msg);
                    System.out.println("[NACK] tag=" + tag + " -> \\"" + msg
                        + "\\" возвращён в очередь");
                } else {
                    dlq.add(msg);
                    processedCount++;
                    System.out.println("[NACK] tag=" + tag + " -> \\"" + msg
                        + "\\" отклонён, requeue=false -> DLQ");
                }
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== RabbitMQ: Manual ACK + Prefetch ===");
        System.out.println("Prefetch count: 2\\n");

        RabbitQueue queue = new RabbitQueue("orders", 2);
        queue.enqueue("Заказ-1", "Заказ-2", "Заказ-3", "BAD-MSG", "Заказ-5");

        System.out.println("Очередь: [Заказ-1, Заказ-2, Заказ-3, BAD-MSG, Заказ-5]\\n");

        // Deliver 2 (prefetch=2)
        queue.deliver(); // tag=1
        queue.deliver(); // tag=2
        queue.deliver(); // null - prefetch limit

        // ACK both
        queue.ack(1);
        queue.ack(2);
        System.out.println();

        // Deliver next 2
        queue.deliver(); // tag=3
        queue.deliver(); // tag=4

        // ACK good, NACK bad
        queue.ack(3);
        queue.nack(4, false); // BAD-MSG -> DLQ
        System.out.println();

        // Deliver last
        queue.deliver(); // tag=5
        queue.ack(5);

        System.out.println("\\nОбработано: " + queue.processedCount);
        System.out.println("Dead Letter Queue: " + queue.dlq);
    }
}`,
      explanation: 'Manual ACK даёт consumer контроль над подтверждением. Prefetch count ограничивает количество неподтверждённых сообщений, защищая consumer от перегрузки. NACK с requeue=false отправляет сообщение в Dead Letter Queue для ручного анализа. Это стандартная модель надёжной обработки в RabbitMQ.'
    },
    {
      id: 7,
      title: 'Практика: Полная модель RabbitMQ',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте полную модель RabbitMQ: Connection, Channel, Exchange, Queue, Producer, Consumer — весь AMQP flow.',
      requirements: [
        'Класс RabbitBroker — центральный компонент',
        'Метод declareExchange(name, type) — объявить exchange',
        'Метод declareQueue(name) — объявить очередь',
        'Метод bind(queue, exchange, routingKey) — привязать',
        'Метод publish(exchange, routingKey, message) — опубликовать',
        'Метод consume(queue) — читать из очереди',
        'Покажите полный цикл: объявление, публикация, потребление'
      ],
      hint: 'Broker хранит Map<String, Exchange> и Map<String, Queue>. Exchange хранит Map<String, List<Queue>> bindings. При publish Exchange маршрутизирует в нужные очереди.',
      expectedOutput: '=== RabbitMQ Broker ===\n\nDeclare exchange "orders-exchange" (type=direct)\nDeclare exchange "notifications" (type=fanout)\nDeclare queue "new-orders"\nDeclare queue "email-notifications"\nDeclare queue "sms-notifications"\n\nBind "new-orders" to "orders-exchange" with key "order.new"\nBind "email-notifications" to "notifications"\nBind "sms-notifications" to "notifications"\n\nPublish to "orders-exchange" key="order.new": "Заказ #1001"\n  -> routed to: [new-orders]\n\nPublish to "notifications" key="": "Оплата получена"\n  -> routed to: [email-notifications, sms-notifications]\n\nConsume from "new-orders": "Заказ #1001"\nConsume from "email-notifications": "Оплата получена"\nConsume from "sms-notifications": "Оплата получена"',
      solution: `import java.util.*;

public class Main {
    static class MessageQueue {
        String name;
        LinkedList<String> messages = new LinkedList<>();
        MessageQueue(String name) { this.name = name; }
    }

    interface Exchange {
        String getName();
        String getType();
        void bind(MessageQueue queue, String routingKey);
        List<String> route(String routingKey, String message);
    }

    static class DirectExchange implements Exchange {
        String name;
        Map<String, List<MessageQueue>> bindings = new HashMap<>();

        DirectExchange(String name) { this.name = name; }
        public String getName() { return name; }
        public String getType() { return "direct"; }

        public void bind(MessageQueue queue, String routingKey) {
            bindings.computeIfAbsent(routingKey, k -> new ArrayList<>()).add(queue);
        }

        public List<String> route(String routingKey, String message) {
            List<String> targets = new ArrayList<>();
            for (MessageQueue q : bindings.getOrDefault(routingKey, Collections.emptyList())) {
                q.messages.add(message);
                targets.add(q.name);
            }
            return targets;
        }
    }

    static class FanoutExchange implements Exchange {
        String name;
        List<MessageQueue> queues = new ArrayList<>();

        FanoutExchange(String name) { this.name = name; }
        public String getName() { return name; }
        public String getType() { return "fanout"; }

        public void bind(MessageQueue queue, String routingKey) {
            queues.add(queue);
        }

        public List<String> route(String routingKey, String message) {
            List<String> targets = new ArrayList<>();
            for (MessageQueue q : queues) {
                q.messages.add(message);
                targets.add(q.name);
            }
            return targets;
        }
    }

    static class RabbitBroker {
        Map<String, Exchange> exchanges = new LinkedHashMap<>();
        Map<String, MessageQueue> queues = new LinkedHashMap<>();

        Exchange declareExchange(String name, String type) {
            Exchange ex;
            switch (type) {
                case "fanout": ex = new FanoutExchange(name); break;
                default: ex = new DirectExchange(name); break;
            }
            exchanges.put(name, ex);
            System.out.println("Declare exchange \\"" + name + "\\" (type=" + type + ")");
            return ex;
        }

        MessageQueue declareQueue(String name) {
            MessageQueue q = new MessageQueue(name);
            queues.put(name, q);
            System.out.println("Declare queue \\"" + name + "\\"");
            return q;
        }

        void bind(String queueName, String exchangeName, String routingKey) {
            Exchange ex = exchanges.get(exchangeName);
            MessageQueue q = queues.get(queueName);
            ex.bind(q, routingKey);
            String keyInfo = routingKey.isEmpty() ? "" : " with key \\"" + routingKey + "\\"";
            System.out.println("Bind \\"" + queueName + "\\" to \\"" + exchangeName + "\\"" + keyInfo);
        }

        void publish(String exchangeName, String routingKey, String message) {
            Exchange ex = exchanges.get(exchangeName);
            System.out.print("\\nPublish to \\"" + exchangeName + "\\"");
            if (!routingKey.isEmpty()) System.out.print(" key=\\"" + routingKey + "\\"");
            System.out.println(": \\"" + message + "\\"");

            List<String> targets = ex.route(routingKey, message);
            System.out.println("  -> routed to: " + targets);
        }

        String consume(String queueName) {
            MessageQueue q = queues.get(queueName);
            String msg = q.messages.poll();
            if (msg != null) {
                System.out.println("Consume from \\"" + queueName + "\\": \\"" + msg + "\\"");
            }
            return msg;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== RabbitMQ Broker ===\\n");

        RabbitBroker broker = new RabbitBroker();

        // Declare
        broker.declareExchange("orders-exchange", "direct");
        broker.declareExchange("notifications", "fanout");
        broker.declareQueue("new-orders");
        broker.declareQueue("email-notifications");
        broker.declareQueue("sms-notifications");

        System.out.println();

        // Bind
        broker.bind("new-orders", "orders-exchange", "order.new");
        broker.bind("email-notifications", "notifications", "");
        broker.bind("sms-notifications", "notifications", "");

        // Publish
        broker.publish("orders-exchange", "order.new", "Заказ #1001");
        broker.publish("notifications", "", "Оплата получена");

        // Consume
        System.out.println();
        broker.consume("new-orders");
        broker.consume("email-notifications");
        broker.consume("sms-notifications");
    }
}`,
      explanation: 'Мы реализовали полный AMQP flow: объявление exchanges и queues, binding, publish через exchange, consume из queue. Direct Exchange маршрутизирует по точному ключу, Fanout — во все привязанные очереди. Это основа работы RabbitMQ. В production добавляются ACK, prefetch, DLQ, persistence и кластеризация.'
    }
  ]
}
