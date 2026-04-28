export default {
  id: 4,
  title: 'Consumers: чтение сообщений',
  description: 'Kafka Consumer: consumer groups, rebalancing, offset commit, poll loop, at-least-once и at-most-once обработка.',
  lessons: [
    {
      id: 1,
      title: 'Как работает Kafka Consumer',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kafka Consumer — компонент, который читает сообщения из топиков. Consumer использует pull-модель: он сам запрашивает данные у брокера через метод poll(). Это даёт consumer контроль над скоростью обработки.' },
        { type: 'heading', value: 'Pull vs Push модель' },
        { type: 'code', language: 'java', value: '// Push (RabbitMQ): Broker отправляет сообщения consumer-у\n// + Consumer получает сообщения мгновенно\n// - Broker может перегрузить медленного consumer-а\n// - Нужен механизм backpressure (prefetch count)\n\n// Pull (Kafka): Consumer сам запрашивает данные\n// + Consumer контролирует скорость\n// + Можно batch-обработку (fetch 500 msg за раз)\n// + Consumer может "перемотать" на старый offset\n// - Возможна задержка, если poll() вызывается редко\n\n// Kafka Consumer poll loop:\n// while (true) {\n//     ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));\n//     for (ConsumerRecord<String, String> record : records) {\n//         processRecord(record); // обработка\n//     }\n//     consumer.commitSync(); // подтверждение\n// }' },
        { type: 'heading', value: 'Основные настройки Consumer' },
        { type: 'list', value: [
          'bootstrap.servers — адреса брокеров для подключения',
          'group.id — имя consumer group (обязательно)',
          'key.deserializer — десериализатор ключа',
          'value.deserializer — десериализатор значения',
          'auto.offset.reset=latest|earliest — откуда читать новому consumer-у',
          'enable.auto.commit=true — автоматический commit offset каждые 5 сек',
          'max.poll.records=500 — максимум записей за один poll()',
          'max.poll.interval.ms=300000 — максимальное время между poll() вызовами'
        ] },
        { type: 'tip', value: 'auto.offset.reset=earliest — consumer прочитает ВСЕ сообщения с начала топика. Это полезно при первом запуске. auto.offset.reset=latest — читает только новые сообщения. Для production обычно используют earliest при первом запуске, чтобы не потерять данные.' }
      ]
    },
    {
      id: 2,
      title: 'Consumer Groups',
      type: 'theory',
      content: [
        { type: 'text', value: 'Consumer Group — это группа consumer-ов, которые совместно читают топик. Каждая партиция назначается ровно одному consumer-у в группе. Это обеспечивает параллельную обработку без дубликатов.' },
        { type: 'heading', value: 'Как работают Consumer Groups' },
        { type: 'code', language: 'java', value: '// Topic "orders" с 4 партициями\n// Consumer Group "order-processing"\n//\n// Сценарий 1: 2 consumers в группе\n// Consumer-1: P0, P1  (обрабатывает 2 партиции)\n// Consumer-2: P2, P3  (обрабатывает 2 партиции)\n//\n// Сценарий 2: 4 consumers в группе\n// Consumer-1: P0\n// Consumer-2: P1\n// Consumer-3: P2\n// Consumer-4: P3\n// Идеально: каждый consumer — одна партиция\n//\n// Сценарий 3: 6 consumers в группе (больше чем партиций!)\n// Consumer-1: P0\n// Consumer-2: P1\n// Consumer-3: P2\n// Consumer-4: P3\n// Consumer-5: IDLE (нет партиций)\n// Consumer-6: IDLE (нет партиций)\n// Лишние consumers простаивают! Нет смысла.' },
        { type: 'heading', value: 'Несколько Consumer Groups' },
        { type: 'code', language: 'java', value: '// Один топик — несколько групп\n// Каждая группа получает ВСЕ сообщения (как Pub/Sub)\n//\n// Topic "orders"\n//\n// Group "order-processing":    (обрабатывает заказы)\n//   Consumer-1: P0, P1\n//   Consumer-2: P2, P3\n//\n// Group "analytics":           (считает статистику)\n//   Consumer-1: P0, P1, P2, P3\n//\n// Group "notification":        (отправляет уведомления)\n//   Consumer-1: P0, P1\n//   Consumer-2: P2, P3\n//\n// Каждая группа независимо читает ВСЕ сообщения!\n// Это и есть Pub/Sub в Kafka через consumer groups' },
        { type: 'heading', value: 'Правила Consumer Groups' },
        { type: 'list', value: [
          'Одна партиция — ровно один consumer в группе',
          'Один consumer может читать несколько партиций',
          'Максимум полезных consumers = количество партиций',
          'Разные группы читают данные независимо',
          'Каждая группа имеет свой committed offset',
          'Consumer без group.id не может commit offset'
        ] },
        { type: 'warning', value: 'Если consumers в группе больше, чем партиций — лишние будут простаивать. Это пустая трата ресурсов. Правило: количество consumers <= количество партиций. Планируйте партиции заранее.' }
      ]
    },
    {
      id: 3,
      title: 'Rebalancing',
      type: 'theory',
      content: [
        { type: 'text', value: 'Rebalancing — процесс перераспределения партиций между consumer-ами в группе. Происходит при добавлении/удалении consumer-а, при crash consumer-а или при изменении количества партиций.' },
        { type: 'heading', value: 'Когда происходит Rebalancing?' },
        { type: 'code', language: 'java', value: '// Ситуации, вызывающие rebalancing:\n//\n// 1. Новый consumer присоединился к группе\n//    До: C1[P0,P1,P2,P3]\n//    После: C1[P0,P1] C2[P2,P3]\n//\n// 2. Consumer вышел из группы (graceful shutdown)\n//    До: C1[P0,P1] C2[P2,P3]\n//    После: C1[P0,P1,P2,P3]\n//\n// 3. Consumer упал (heartbeat timeout)\n//    session.timeout.ms = 45000 (45 сек)\n//    Если нет heartbeat 45 секунд -> consumer считается мёртвым\n//\n// 4. Consumer не вызвал poll() вовремя\n//    max.poll.interval.ms = 300000 (5 минут)\n//    Если обработка записей > 5 минут -> rebalancing!' },
        { type: 'heading', value: 'Стратегии назначения партиций' },
        { type: 'code', language: 'java', value: '// RangeAssignor (по умолчанию):\n// Партиции 0-5, Consumers C1, C2\n// C1: [P0, P1, P2]  (первая половина)\n// C2: [P3, P4, P5]  (вторая половина)\n\n// RoundRobinAssignor:\n// C1: [P0, P2, P4]  (чётные)\n// C2: [P1, P3, P5]  (нечётные)\n\n// StickyAssignor (рекомендуется):\n// Минимизирует перемещение партиций при rebalancing\n// До:    C1[P0,P1,P2] C2[P3,P4,P5]\n// C3 присоединился:\n// После: C1[P0,P1] C2[P3,P4] C3[P2,P5]\n// Только P2 и P5 перемещены!\n\n// CooperativeStickyAssignor (Kafka 2.4+):\n// Incremental rebalancing — НЕ останавливает всех consumers\n// Только затронутые партиции переназначаются' },
        { type: 'heading', value: 'Проблема Stop-the-World Rebalancing' },
        { type: 'text', value: 'При Eager rebalancing ВСЕ consumers останавливаются, отдают все партиции, и получают новое назначение. На это время обработка сообщений прекращается. С CooperativeStickyAssignor (incremental) только затронутые партиции переназначаются.' },
        { type: 'list', value: [
          'session.timeout.ms=45000 — время обнаружения мёртвого consumer',
          'heartbeat.interval.ms=3000 — частота heartbeat (должно быть < session.timeout/3)',
          'max.poll.interval.ms=300000 — макс. время между poll() вызовами',
          'partition.assignment.strategy — стратегия назначения партиций',
          'CooperativeStickyAssignor — лучший выбор для production'
        ] },
        { type: 'tip', value: 'Частые rebalancing — признак проблемы. Обычно это значит, что consumer тратит слишком много времени на обработку записей (> max.poll.interval.ms). Решение: уменьшите max.poll.records или оптимизируйте обработку.' }
      ]
    },
    {
      id: 4,
      title: 'Offset Commit: стратегии',
      type: 'theory',
      content: [
        { type: 'text', value: 'Offset commit — подтверждение consumer-ом того, что сообщение обработано. Committed offset хранится в специальном топике __consumer_offsets. При рестарте consumer продолжит с committed offset. Неправильный commit приводит к потере или дублированию сообщений.' },
        { type: 'heading', value: 'Auto Commit' },
        { type: 'code', language: 'java', value: '// Auto commit (по умолчанию):\n// enable.auto.commit = true\n// auto.commit.interval.ms = 5000 (каждые 5 секунд)\n//\n// Проблема: commit происходит ПО ВРЕМЕНИ, а не по обработке\n//\n// t=0:  poll() -> получили msg 1,2,3\n// t=1:  обработали msg 1\n// t=2:  обработали msg 2\n// t=3:  CRASH!\n// t=5:  auto.commit НЕ случился (упали раньше)\n// t=10: consumer рестарт -> читает с последнего committed offset\n//       msg 1, 2 обработаны ПОВТОРНО (дубликаты)\n//\n// Другой сценарий:\n// t=0:  poll() -> получили msg 1,2,3\n// t=1:  обработали msg 1\n// t=5:  AUTO COMMIT offset=3 (все 3 подтверждены!)\n// t=6:  начали обрабатывать msg 2\n// t=7:  CRASH!\n// t=10: consumer рестарт -> читает с offset=3\n//       msg 2, 3 ПОТЕРЯНЫ (committed, но не обработаны)' },
        { type: 'heading', value: 'Manual Commit: commitSync()' },
        { type: 'code', language: 'java', value: '// Manual commit — полный контроль\n// enable.auto.commit = false\n//\n// while (true) {\n//     ConsumerRecords records = consumer.poll(Duration.ofMillis(100));\n//     for (ConsumerRecord record : records) {\n//         process(record); // обработка\n//     }\n//     consumer.commitSync(); // commit ПОСЛЕ обработки всех записей\n// }\n//\n// commitSync() — блокирующий, ждёт подтверждения\n// commitAsync() — неблокирующий, с callback\n//\n// Лучший паттерн — commit после каждого batch:\n// while (true) {\n//     ConsumerRecords records = consumer.poll(Duration.ofMillis(100));\n//     for (ConsumerRecord record : records) {\n//         process(record);\n//     }\n//     consumer.commitAsync(); // обычно async\n// }\n// // При shutdown:\n// consumer.commitSync(); // последний commit — sync для надёжности' },
        { type: 'heading', value: 'Commit конкретного offset' },
        { type: 'code', language: 'java', value: '// Commit конкретного offset — максимальный контроль\n//\n// Map<TopicPartition, OffsetAndMetadata> offsets = new HashMap<>();\n// for (ConsumerRecord record : records) {\n//     process(record);\n//     offsets.put(\n//         new TopicPartition(record.topic(), record.partition()),\n//         new OffsetAndMetadata(record.offset() + 1) // +1 важно!\n//     );\n//     // Commit после каждого сообщения (медленно, но безопасно)\n//     consumer.commitSync(offsets);\n// }\n//\n// ВАЖНО: commit offset+1, потому что committed offset =\n// "следующий offset для чтения", а не "последний прочитанный"' },
        { type: 'warning', value: 'Committed offset — это СЛЕДУЮЩИЙ offset для чтения, а не последний обработанный. Если обработали offset=5, коммитим offset=6. Это частая ошибка. consumer.commitSync(offset+1).' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Consumer Group',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте модель Consumer Group с назначением партиций, обработкой сообщений и rebalancing.',
      requirements: [
        'Класс ConsumerGroup с именем и списком consumers',
        'Метод addConsumer() — добавляет consumer и вызывает rebalancing',
        'Метод removeConsumer() — удаляет consumer и вызывает rebalancing',
        'Rebalancing распределяет партиции по RoundRobin',
        'Каждый consumer обрабатывает только свои партиции',
        'Покажите три сценария: 1 consumer, 3 consumers, удаление consumer'
      ],
      hint: 'Храните Map<String, List<Integer>> для назначения партиций consumer-ам. При rebalancing пересоздайте назначение.',
      expectedOutput: '=== Сценарий 1: 1 consumer ===\nConsumer-1: [P0, P1, P2, P3, P4, P5]\n\n=== Сценарий 2: добавлен Consumer-2 ===\nRebalancing...\nConsumer-1: [P0, P2, P4]\nConsumer-2: [P1, P3, P5]\n\n=== Сценарий 3: добавлен Consumer-3 ===\nRebalancing...\nConsumer-1: [P0, P3]\nConsumer-2: [P1, P4]\nConsumer-3: [P2, P5]\n\n=== Сценарий 4: Consumer-2 упал ===\nRebalancing...\nConsumer-1: [P0, P2, P4]\nConsumer-3: [P1, P3, P5]\n\nОбработка сообщений:\nConsumer-1 читает P0: [Msg-0, Msg-6]\nConsumer-1 читает P2: [Msg-2, Msg-8]\nConsumer-1 читает P4: [Msg-4]\nConsumer-3 читает P1: [Msg-1, Msg-7]\nConsumer-3 читает P3: [Msg-3, Msg-9]\nConsumer-3 читает P5: [Msg-5]',
      solution: `import java.util.*;

public class Main {
    static class Partition {
        int id;
        List<String> messages = new ArrayList<>();
        Partition(int id) { this.id = id; }
    }

    static class ConsumerGroup {
        String groupName;
        List<String> consumers = new ArrayList<>();
        Map<String, List<Integer>> assignment = new LinkedHashMap<>();
        int numPartitions;

        ConsumerGroup(String groupName, int numPartitions) {
            this.groupName = groupName;
            this.numPartitions = numPartitions;
        }

        void addConsumer(String name) {
            consumers.add(name);
            rebalance();
        }

        void removeConsumer(String name) {
            consumers.remove(name);
            rebalance();
        }

        void rebalance() {
            System.out.println("Rebalancing...");
            assignment.clear();
            for (String c : consumers) {
                assignment.put(c, new ArrayList<>());
            }
            // RoundRobin назначение
            for (int p = 0; p < numPartitions; p++) {
                String consumer = consumers.get(p % consumers.size());
                assignment.get(consumer).add(p);
            }
            printAssignment();
        }

        void printAssignment() {
            for (Map.Entry<String, List<Integer>> entry : assignment.entrySet()) {
                List<String> partNames = new ArrayList<>();
                for (int p : entry.getValue()) {
                    partNames.add("P" + p);
                }
                System.out.println(entry.getKey() + ": " + partNames);
            }
        }

        void processMessages(Partition[] partitions) {
            System.out.println("\\nОбработка сообщений:");
            for (Map.Entry<String, List<Integer>> entry : assignment.entrySet()) {
                String consumer = entry.getKey();
                for (int pId : entry.getValue()) {
                    if (!partitions[pId].messages.isEmpty()) {
                        System.out.println(consumer + " читает P" + pId + ": "
                            + partitions[pId].messages);
                    }
                }
            }
        }
    }

    public static void main(String[] args) {
        int numPartitions = 6;
        Partition[] partitions = new Partition[numPartitions];
        for (int i = 0; i < numPartitions; i++) {
            partitions[i] = new Partition(i);
        }

        // Добавляем сообщения
        for (int i = 0; i < 10; i++) {
            int p = i % numPartitions;
            partitions[p].messages.add("Msg-" + i);
        }

        ConsumerGroup group = new ConsumerGroup("order-processing", numPartitions);

        System.out.println("=== Сценарий 1: 1 consumer ===");
        group.addConsumer("Consumer-1");

        System.out.println("\\n=== Сценарий 2: добавлен Consumer-2 ===");
        group.addConsumer("Consumer-2");

        System.out.println("\\n=== Сценарий 3: добавлен Consumer-3 ===");
        group.addConsumer("Consumer-3");

        System.out.println("\\n=== Сценарий 4: Consumer-2 упал ===");
        group.removeConsumer("Consumer-2");

        group.processMessages(partitions);
    }
}`,
      explanation: 'Consumer Group распределяет партиции между consumer-ами. RoundRobin обеспечивает равномерное распределение. При добавлении или удалении consumer происходит rebalancing — перераспределение всех партиций. В Kafka это координируется через Group Coordinator на одном из брокеров.'
    },
    {
      id: 6,
      title: 'Практика: Offset Management',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему управления offset-ами с автоматическим и ручным commit, демонстрируя проблемы каждого подхода.',
      requirements: [
        'Класс OffsetManager — хранит committed offsets для каждой партиции',
        'Метод autoCommit() — коммитит текущую позицию по таймеру',
        'Метод manualCommit(partition, offset) — коммитит конкретный offset',
        'Симулируйте crash consumer-а и покажите потерю/дубликаты',
        'Сценарий 1: auto commit -> crash -> потеря данных',
        'Сценарий 2: manual commit -> crash -> дубликат, но без потери'
      ],
      hint: 'Auto commit коммитит ВСЕ полученные сообщения, даже необработанные. Manual commit коммитит только обработанные. При crash auto commit может потерять данные, manual commit — только дублировать.',
      expectedOutput: '=== Сценарий 1: Auto Commit (потеря данных) ===\nPoll: получены сообщения offset 0-4\nОбработано: offset 0\nОбработано: offset 1\n[AUTO COMMIT] committed offset = 5 (все 5 подтверждены!)\nОбработано: offset 2\n--- CRASH! ---\nConsumer рестарт. Committed offset = 5\nПродолжаем с offset 5.\nСообщения offset 3, 4 ПОТЕРЯНЫ (committed, но не обработаны)\n\n=== Сценарий 2: Manual Commit (дубликаты, но без потери) ===\nPoll: получены сообщения offset 0-4\nОбработано: offset 0 -> commit(1)\nОбработано: offset 1 -> commit(2)\nОбработано: offset 2 -> commit(3)\n--- CRASH! ---\nConsumer рестарт. Committed offset = 3\nПродолжаем с offset 3.\nСообщения offset 3, 4 будут обработаны повторно (дубликаты возможны)',
      solution: `import java.util.*;

public class Main {
    static class OffsetManager {
        Map<Integer, Long> committedOffsets = new HashMap<>();

        void commit(int partition, long offset) {
            committedOffsets.put(partition, offset);
        }

        long getCommittedOffset(int partition) {
            return committedOffsets.getOrDefault(partition, 0L);
        }
    }

    static void simulateAutoCommit() {
        System.out.println("=== Сценарий 1: Auto Commit (потеря данных) ===");
        OffsetManager offsetManager = new OffsetManager();
        int partition = 0;

        // Poll вернул 5 сообщений
        int pollSize = 5;
        long startOffset = 0;
        System.out.println("Poll: получены сообщения offset " + startOffset + "-" + (startOffset + pollSize - 1));

        // Обрабатываем первые 2
        System.out.println("Обработано: offset 0");
        System.out.println("Обработано: offset 1");

        // Auto commit по таймеру — коммитит ВСЁ что получено poll()
        long autoCommitOffset = startOffset + pollSize;
        offsetManager.commit(partition, autoCommitOffset);
        System.out.println("[AUTO COMMIT] committed offset = " + autoCommitOffset
            + " (все " + pollSize + " подтверждены!)");

        System.out.println("Обработано: offset 2");

        // CRASH
        System.out.println("--- CRASH! ---");
        long committed = offsetManager.getCommittedOffset(partition);
        System.out.println("Consumer рестарт. Committed offset = " + committed);
        System.out.println("Продолжаем с offset " + committed + ".");
        System.out.println("Сообщения offset 3, 4 ПОТЕРЯНЫ (committed, но не обработаны)");
    }

    static void simulateManualCommit() {
        System.out.println("\\n=== Сценарий 2: Manual Commit (дубликаты, но без потери) ===");
        OffsetManager offsetManager = new OffsetManager();
        int partition = 0;

        // Poll вернул 5 сообщений
        int pollSize = 5;
        long startOffset = 0;
        System.out.println("Poll: получены сообщения offset " + startOffset + "-" + (startOffset + pollSize - 1));

        // Обрабатываем и коммитим по одному
        for (long offset = 0; offset < 3; offset++) {
            System.out.println("Обработано: offset " + offset + " -> commit(" + (offset + 1) + ")");
            offsetManager.commit(partition, offset + 1); // commit ПОСЛЕ обработки
        }

        // CRASH после offset 2
        System.out.println("--- CRASH! ---");
        long committed = offsetManager.getCommittedOffset(partition);
        System.out.println("Consumer рестарт. Committed offset = " + committed);
        System.out.println("Продолжаем с offset " + committed + ".");
        System.out.println("Сообщения offset 3, 4 будут обработаны повторно (дубликаты возможны)");
    }

    public static void main(String[] args) {
        simulateAutoCommit();
        simulateManualCommit();
    }
}`,
      explanation: 'Auto commit подтверждает все полученные сообщения по таймеру, что может привести к потере данных при crash. Manual commit подтверждает только обработанные, но при crash возможны дубликаты (at-least-once). Для exactly-once нужны Kafka transactions.'
    },
    {
      id: 7,
      title: 'Практика: Poll Loop с обработкой ошибок',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте полноценный consumer poll loop с обработкой ошибок, retry для неудачных сообщений и dead letter queue.',
      requirements: [
        'Класс Consumer с poll loop, manual commit',
        'Обработка сообщений с возможностью ошибки',
        'При ошибке — retry до 3 раз',
        'После 3 неудачных попыток — отправка в Dead Letter Queue',
        'DLQ — отдельная очередь для проблемных сообщений',
        'Покажите обработку 5 сообщений, где 1 постоянно падает'
      ],
      hint: 'Используйте Map<String, Integer> для подсчёта retries. При превышении maxRetries отправляйте в DLQ и переходите к следующему сообщению.',
      expectedOutput: '=== Consumer Poll Loop ===\n\n[Poll] Получено 5 сообщений\n\n[Process] offset=0, value="Заказ-1" -> OK\n[Commit] offset=1\n\n[Process] offset=1, value="Заказ-2" -> OK\n[Commit] offset=2\n\n[Process] offset=2, value="BAD-DATA" -> ОШИБКА: Invalid format\n[Retry 1/3] offset=2, value="BAD-DATA" -> ОШИБКА\n[Retry 2/3] offset=2, value="BAD-DATA" -> ОШИБКА\n[Retry 3/3] offset=2, value="BAD-DATA" -> ОШИБКА\n[DLQ] Сообщение отправлено в Dead Letter Queue: offset=2, value="BAD-DATA", error=Invalid format\n[Commit] offset=3\n\n[Process] offset=3, value="Заказ-4" -> OK\n[Commit] offset=4\n\n[Process] offset=4, value="Заказ-5" -> OK\n[Commit] offset=5\n\nОбработано успешно: 4\nОтправлено в DLQ: 1\nDLQ содержит: [{offset=2, value=BAD-DATA, error=Invalid format}]',
      solution: `import java.util.*;

public class Main {
    static class Message {
        long offset;
        String value;
        Message(long offset, String value) {
            this.offset = offset;
            this.value = value;
        }
    }

    static class DeadLetterQueue {
        List<Map<String, String>> messages = new ArrayList<>();

        void send(Message msg, String error) {
            Map<String, String> dlqMsg = new LinkedHashMap<>();
            dlqMsg.put("offset", String.valueOf(msg.offset));
            dlqMsg.put("value", msg.value);
            dlqMsg.put("error", error);
            messages.add(dlqMsg);
            System.out.println("[DLQ] Сообщение отправлено в Dead Letter Queue: offset="
                + msg.offset + ", value=\\"" + msg.value + "\\", error=" + error);
        }
    }

    static class Consumer {
        long committedOffset = 0;
        int maxRetries = 3;
        DeadLetterQueue dlq = new DeadLetterQueue();
        int successCount = 0;
        int dlqCount = 0;

        String processMessage(Message msg) throws Exception {
            if (msg.value.equals("BAD-DATA")) {
                throw new Exception("Invalid format");
            }
            return "OK";
        }

        void pollAndProcess(List<Message> messages) {
            System.out.println("[Poll] Получено " + messages.size() + " сообщений\\n");

            for (Message msg : messages) {
                boolean processed = false;
                String lastError = "";

                // Первая попытка
                try {
                    System.out.print("[Process] offset=" + msg.offset
                        + ", value=\\"" + msg.value + "\\" -> ");
                    processMessage(msg);
                    System.out.println("OK");
                    processed = true;
                } catch (Exception e) {
                    lastError = e.getMessage();
                    System.out.println("ОШИБКА: " + lastError);

                    // Retry
                    for (int retry = 1; retry <= maxRetries; retry++) {
                        try {
                            System.out.print("[Retry " + retry + "/" + maxRetries
                                + "] offset=" + msg.offset
                                + ", value=\\"" + msg.value + "\\" -> ");
                            processMessage(msg);
                            System.out.println("OK");
                            processed = true;
                            break;
                        } catch (Exception ex) {
                            lastError = ex.getMessage();
                            System.out.println("ОШИБКА");
                        }
                    }
                }

                if (!processed) {
                    dlq.send(msg, lastError);
                    dlqCount++;
                } else {
                    successCount++;
                }

                committedOffset = msg.offset + 1;
                System.out.println("[Commit] offset=" + committedOffset + "\\n");
            }

            System.out.println("Обработано успешно: " + successCount);
            System.out.println("Отправлено в DLQ: " + dlqCount);
            System.out.println("DLQ содержит: " + dlq.messages);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Consumer Poll Loop ===\\n");

        List<Message> messages = List.of(
            new Message(0, "Заказ-1"),
            new Message(1, "Заказ-2"),
            new Message(2, "BAD-DATA"),
            new Message(3, "Заказ-4"),
            new Message(4, "Заказ-5")
        );

        Consumer consumer = new Consumer();
        consumer.pollAndProcess(messages);
    }
}`,
      explanation: 'Poll loop с retry и DLQ — стандартный паттерн обработки Kafka сообщений. При ошибке сообщение повторяется до maxRetries раз. Если все попытки неудачны, сообщение отправляется в Dead Letter Queue для ручного анализа. Commit происходит только после обработки или отправки в DLQ, что гарантирует at-least-once доставку.'
    }
  ]
}
