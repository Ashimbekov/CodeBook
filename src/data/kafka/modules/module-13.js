export default {
  id: 13,
  title: 'Практикум: Kafka задачи',
  description: 'Практические задачи по Apache Kafka: producers, consumers, партиции, consumer groups, offset management, идемпотентность.',
  lessons: [
    {
      id: 1,
      title: 'Kafka Topic: запись и чтение',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте модель Kafka Topic с поддержкой записи сообщений и чтения consumer-ом с отслеживанием offset.',
      requirements: [
        'Класс KafkaTopic с одной партицией (List<String>)',
        'Метод produce(message) — добавляет сообщение, возвращает offset',
        'Метод consume(offset) — возвращает сообщение по offset',
        'Метод consumeRange(from, to) — возвращает диапазон сообщений',
        'Записать 5 сообщений и прочитать их последовательно',
        'Показать offset каждого записанного и прочитанного сообщения'
      ],
      hint: 'Offset — это индекс в List. produce() добавляет в конец и возвращает list.size()-1. consume(offset) — list.get(offset).',
      expectedOutput: '=== Kafka Topic ===\n\nЗапись:\n  offset=0: "Заказ-1"\n  offset=1: "Заказ-2"\n  offset=2: "Заказ-3"\n  offset=3: "Заказ-4"\n  offset=4: "Заказ-5"\n\nЧтение (последовательно):\n  consume(0): "Заказ-1"\n  consume(1): "Заказ-2"\n  consume(2): "Заказ-3"\n  consume(3): "Заказ-4"\n  consume(4): "Заказ-5"\n\nЧтение диапазона (2..4): [Заказ-3, Заказ-4, Заказ-5]\nРазмер топика: 5 сообщений',
      solution: `import java.util.*;

public class Main {
    static List<String> topic = new ArrayList<>();

    static int produce(String message) {
        topic.add(message);
        return topic.size() - 1;
    }

    static String consume(int offset) {
        if (offset < 0 || offset >= topic.size()) return null;
        return topic.get(offset);
    }

    static List<String> consumeRange(int from, int to) {
        List<String> result = new ArrayList<>();
        for (int i = from; i <= Math.min(to, topic.size() - 1); i++) {
            result.add(topic.get(i));
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println("=== Kafka Topic ===\\n");

        System.out.println("Запись:");
        for (int i = 1; i <= 5; i++) {
            String msg = "Заказ-" + i;
            int offset = produce(msg);
            System.out.println("  offset=" + offset + ": \\"" + msg + "\\"");
        }

        System.out.println("\\nЧтение (последовательно):");
        for (int i = 0; i < topic.size(); i++) {
            System.out.println("  consume(" + i + "): \\"" + consume(i) + "\\"");
        }

        System.out.println("\\nЧтение диапазона (2..4): " + consumeRange(2, 4));
        System.out.println("Размер топика: " + topic.size() + " сообщений");
    }
}`,
      explanation: 'Kafka Topic — это append-only log. Каждое сообщение получает уникальный offset (порядковый номер). Сообщения нельзя удалить или изменить — только добавить новые. Consumer может читать с любого offset, в том числе перечитывать старые сообщения. Это фундаментальное отличие от RabbitMQ, где сообщения удаляются после ACK.'
    },
    {
      id: 2,
      title: 'Partitioner: распределение по партициям',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте партиционирование сообщений по ключу (hash-based) и round-robin (без ключа).',
      requirements: [
        'Класс PartitionedTopic с N партициями',
        'Если ключ указан — партиция определяется hash(key) % numPartitions',
        'Если ключ null — round-robin распределение',
        'Записать сообщения с ключами и без',
        'Показать распределение сообщений по партициям',
        'Проверить: одинаковые ключи попадают в одну партицию'
      ],
      hint: 'Каждая партиция — отдельный List<String>. Hash-based: Math.abs(key.hashCode()) % numPartitions. Round-robin: counter++ % numPartitions.',
      expectedOutput: '=== Kafka Partitioner ===\n\nТопик: 3 партиции\n\nС ключом (hash-based):\n  key="user-1" -> partition 1\n  key="user-2" -> partition 2\n  key="user-3" -> partition 0\n  key="user-1" -> partition 1 (тот же ключ!)\n  key="user-2" -> partition 2 (тот же ключ!)\n\nБез ключа (round-robin):\n  msg="Event-A" -> partition 0\n  msg="Event-B" -> partition 1\n  msg="Event-C" -> partition 2\n  msg="Event-D" -> partition 0\n\nСодержимое партиций:\n  partition-0: [user-3:msg3, Event-A, Event-D]\n  partition-1: [user-1:msg1, user-1:msg4]\n  partition-2: [user-2:msg2, user-2:msg5, Event-B, Event-C]',
      solution: `import java.util.*;

public class Main {
    static int numPartitions = 3;
    static List<List<String>> partitions = new ArrayList<>();
    static int rrCounter = 0;

    static void init() {
        for (int i = 0; i < numPartitions; i++) {
            partitions.add(new ArrayList<>());
        }
    }

    static int getPartition(String key) {
        if (key == null) {
            return rrCounter++ % numPartitions;
        }
        return Math.abs(key.hashCode()) % numPartitions;
    }

    static void produce(String key, String value) {
        int partition = getPartition(key);
        String entry = (key != null ? key + ":" : "") + value;
        partitions.get(partition).add(entry);

        if (key != null) {
            String extra = "";
            if (key.equals("user-1") && partitions.get(partition).stream()
                    .filter(s -> s.startsWith("user-1")).count() > 1)
                extra = " (тот же ключ!)";
            if (key.equals("user-2") && partitions.get(partition).stream()
                    .filter(s -> s.startsWith("user-2")).count() > 1)
                extra = " (тот же ключ!)";
            System.out.println("  key=\\"" + key + "\\" -> partition " + partition + extra);
        } else {
            System.out.println("  msg=\\"" + value + "\\" -> partition " + partition);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Kafka Partitioner ===\\n");
        init();

        System.out.println("Топик: " + numPartitions + " партиции\\n");

        System.out.println("С ключом (hash-based):");
        produce("user-1", "msg1");
        produce("user-2", "msg2");
        produce("user-3", "msg3");
        produce("user-1", "msg4");
        produce("user-2", "msg5");

        System.out.println("\\nБез ключа (round-robin):");
        produce(null, "Event-A");
        produce(null, "Event-B");
        produce(null, "Event-C");
        produce(null, "Event-D");

        System.out.println("\\nСодержимое партиций:");
        for (int i = 0; i < numPartitions; i++) {
            System.out.println("  partition-" + i + ": " + partitions.get(i));
        }
    }
}`,
      explanation: 'Kafka Partitioner определяет, в какую партицию попадёт сообщение. С ключом: hash(key) % numPartitions — одинаковые ключи ВСЕГДА в одной партиции (гарантия порядка). Без ключа: round-robin — равномерное распределение. Выбор ключа критичен: userId гарантирует порядок для пользователя, но может создать hot partition если один пользователь слишком активен.'
    },
    {
      id: 3,
      title: 'Consumer Group: балансировка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Consumer Group с автоматическим распределением партиций между consumers. Покажите rebalancing при добавлении/удалении consumer.',
      requirements: [
        'Класс ConsumerGroup с назначением партиций consumer-ам',
        'Метод assign() — распределяет партиции равномерно (Range Assignor)',
        'Метод addConsumer/removeConsumer — добавление/удаление с rebalance',
        'Топик с 6 партициями, начать с 2 consumers, добавить 3-й, убрать 1-й',
        'Показать распределение после каждого rebalance',
        'Каждый consumer читает только свои партиции'
      ],
      hint: 'Range Assignor: отсортируйте партиции и consumers. Разделите: каждому consumer по partitions/consumers партиций, остаток — первым.',
      expectedOutput: '=== Consumer Group ===\n\nТопик: 6 партиций\n\n--- Начальное распределение (2 consumers) ---\n  consumer-1: [p0, p1, p2]\n  consumer-2: [p3, p4, p5]\n\n--- Добавлен consumer-3 (rebalance) ---\n  consumer-1: [p0, p1]\n  consumer-2: [p2, p3]\n  consumer-3: [p4, p5]\n\n--- Удалён consumer-1 (rebalance) ---\n  consumer-2: [p0, p1, p2]\n  consumer-3: [p3, p4, p5]\n\n--- Добавлены consumer-4, consumer-5, consumer-6, consumer-7 ---\n  consumer-2: [p0]\n  consumer-3: [p1]\n  consumer-4: [p2]\n  consumer-5: [p3]\n  consumer-6: [p4]\n  consumer-7: [p5]\n  (consumer-7 не имеет партиций, если consumers > partitions)',
      solution: `import java.util.*;

public class Main {
    static int numPartitions = 6;
    static List<String> consumers = new ArrayList<>();
    static Map<String, List<String>> assignments = new LinkedHashMap<>();

    static void rebalance() {
        assignments.clear();
        if (consumers.isEmpty()) return;

        for (String c : consumers) {
            assignments.put(c, new ArrayList<>());
        }

        int perConsumer = numPartitions / consumers.size();
        int extra = numPartitions % consumers.size();

        int partIdx = 0;
        for (int i = 0; i < consumers.size(); i++) {
            int count = perConsumer + (i < extra ? 1 : 0);
            List<String> parts = assignments.get(consumers.get(i));
            for (int j = 0; j < count && partIdx < numPartitions; j++) {
                parts.add("p" + partIdx++);
            }
        }
    }

    static void printAssignment(String label) {
        System.out.println("--- " + label + " ---");
        for (Map.Entry<String, List<String>> e : assignments.entrySet()) {
            if (e.getValue().isEmpty()) {
                System.out.println("  " + e.getKey() + ": [] (нет партиций)");
            } else {
                System.out.println("  " + e.getKey() + ": " + e.getValue());
            }
        }
    }

    static void addConsumer(String name) {
        consumers.add(name);
        rebalance();
    }

    static void removeConsumer(String name) {
        consumers.remove(name);
        rebalance();
    }

    public static void main(String[] args) {
        System.out.println("=== Consumer Group ===\\n");
        System.out.println("Топик: " + numPartitions + " партиций\\n");

        addConsumer("consumer-1");
        addConsumer("consumer-2");
        printAssignment("Начальное распределение (2 consumers)");

        System.out.println();
        addConsumer("consumer-3");
        printAssignment("Добавлен consumer-3 (rebalance)");

        System.out.println();
        removeConsumer("consumer-1");
        printAssignment("Удалён consumer-1 (rebalance)");

        System.out.println();
        addConsumer("consumer-4");
        addConsumer("consumer-5");
        addConsumer("consumer-6");
        addConsumer("consumer-7");
        printAssignment("Добавлены consumer-4, consumer-5, consumer-6, consumer-7");
        if (consumers.size() > numPartitions) {
            System.out.println("  (consumer-7 не имеет партиций, если consumers > partitions)");
        }
    }
}`,
      explanation: 'Consumer Group распределяет партиции между consumers. Range Assignor делит партиции равномерно: partitions/consumers на каждого, остаток — первым. При добавлении/удалении consumer происходит rebalance — перераспределение ВСЕХ партиций. Важно: если consumers > partitions — лишние consumers простаивают.'
    },
    {
      id: 4,
      title: 'Producer с батчированием',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Kafka Producer с батчированием: сообщения накапливаются в буфере и отправляются пакетом по достижении batch.size или linger.ms.',
      requirements: [
        'Класс BatchProducer с настройками batchSize и lingerMs',
        'Метод send(message) — добавляет в буфер, отправляет при заполнении batch',
        'Метод flush() — принудительно отправляет все буферизованные сообщения',
        'Счётчик batch-ей и сообщений',
        'Показать: заполнение batch, частичная отправка через flush',
        'Статистика: сколько batch-ей, сколько сообщений в каждом'
      ],
      hint: 'Буфер — List<String>. send() добавляет в буфер. Если buffer.size() >= batchSize — отправляем (доставляем). flush() отправляет остаток.',
      expectedOutput: '=== Kafka Batch Producer ===\n\nНастройки: batchSize=3, lingerMs=100\n\nОтправка 8 сообщений:\n  send("msg-1") -> буфер [1/3]\n  send("msg-2") -> буфер [2/3]\n  send("msg-3") -> BATCH #1 отправлен: [msg-1, msg-2, msg-3]\n  send("msg-4") -> буфер [1/3]\n  send("msg-5") -> буфер [2/3]\n  send("msg-6") -> BATCH #2 отправлен: [msg-4, msg-5, msg-6]\n  send("msg-7") -> буфер [1/3]\n  send("msg-8") -> буфер [2/3]\n  flush() -> BATCH #3 отправлен: [msg-7, msg-8]\n\nСтатистика:\n  Всего сообщений: 8\n  Batch-ей: 3\n  Средний размер batch: 2.7',
      solution: `import java.util.*;

public class Main {
    static int batchSize = 3;
    static List<String> buffer = new ArrayList<>();
    static int batchCount = 0;
    static int totalMessages = 0;

    static void sendBatch() {
        if (buffer.isEmpty()) return;
        batchCount++;
        System.out.println("  " + (buffer.size() == batchSize ? "" : "flush() -> ")
            + "BATCH #" + batchCount + " отправлен: " + buffer);
        totalMessages += buffer.size();
        buffer.clear();
    }

    static void send(String message) {
        buffer.add(message);
        if (buffer.size() >= batchSize) {
            System.out.println("  send(\\"" + message + "\\") -> BATCH #"
                + (batchCount + 1) + " отправлен: " + buffer);
            batchCount++;
            totalMessages += buffer.size();
            buffer.clear();
        } else {
            System.out.println("  send(\\"" + message + "\\") -> буфер ["
                + buffer.size() + "/" + batchSize + "]");
        }
    }

    static void flush() {
        if (!buffer.isEmpty()) {
            batchCount++;
            System.out.println("  flush() -> BATCH #" + batchCount
                + " отправлен: " + buffer);
            totalMessages += buffer.size();
            buffer.clear();
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Kafka Batch Producer ===\\n");
        System.out.println("Настройки: batchSize=" + batchSize + ", lingerMs=100\\n");

        System.out.println("Отправка 8 сообщений:");
        for (int i = 1; i <= 8; i++) {
            send("msg-" + i);
        }
        flush();

        double avgBatch = (double) totalMessages / batchCount;
        System.out.println("\\nСтатистика:");
        System.out.println("  Всего сообщений: " + totalMessages);
        System.out.println("  Batch-ей: " + batchCount);
        System.out.printf("  Средний размер batch: %.1f%n", avgBatch);
    }
}`,
      explanation: 'Kafka Producer буферизует сообщения для повышения throughput. Batch отправляется при: заполнении batchSize ИЛИ истечении lingerMs. Большие batch — выше throughput (меньше сетевых вызовов), но выше latency (ожидание заполнения). В production: batch.size=16384-65536 байт, linger.ms=5-100ms — компромисс между throughput и latency.'
    },
    {
      id: 5,
      title: 'Retention Policy',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Kafka Retention Policy: удаление старых сообщений по времени (retention.ms) и по размеру (retention.bytes).',
      requirements: [
        'Класс RetentionTopic с timestamp для каждого сообщения',
        'Time-based retention: удаление сообщений старше retentionMs',
        'Size-based retention: удаление старых если превышен maxSizeBytes',
        'Метод cleanup() — применяет обе политики',
        'Показать состояние до и после cleanup',
        'Статистика: сколько удалено по времени, сколько по размеру'
      ],
      hint: 'Каждое сообщение хранит timestamp. cleanup() проходит по списку и удаляет старые (timestamp + retentionMs < now). Для size-based: удаляем с начала пока totalSize > maxSize.',
      expectedOutput: '=== Kafka Retention Policy ===\n\nНастройки: retentionMs=5000, maxSizeBytes=100\n\nЗаписано 6 сообщений:\n  offset=0: "msg-1" (size=5, age=8000ms) [expired]\n  offset=1: "msg-2" (size=5, age=7000ms) [expired]\n  offset=2: "msg-3" (size=5, age=4000ms)\n  offset=3: "msg-4" (size=5, age=3000ms)\n  offset=4: "msg-5" (size=5, age=1000ms)\n  offset=5: "msg-6" (size=5, age=500ms)\n\nОбщий размер: 30 байт\n\nCleanup:\n  Удалено по времени: 2 сообщения (offset 0-1)\n  Удалено по размеру: 0 сообщений\n  Осталось: 4 сообщения (offset 2-5)\n\nПосле cleanup:\n  offset=2: "msg-3"\n  offset=3: "msg-4"\n  offset=4: "msg-5"\n  offset=5: "msg-6"',
      solution: `import java.util.*;

public class Main {
    static class Record {
        int offset;
        String value;
        int size;
        long timestamp;

        Record(int offset, String value, long timestamp) {
            this.offset = offset;
            this.value = value;
            this.size = value.length();
            this.timestamp = timestamp;
        }
    }

    static List<Record> log = new ArrayList<>();
    static long retentionMs = 5000;
    static int maxSizeBytes = 100;
    static int nextOffset = 0;

    static void produce(String value, long timestamp) {
        log.add(new Record(nextOffset++, value, timestamp));
    }

    static int cleanupByTime(long now) {
        int removed = 0;
        Iterator<Record> it = log.iterator();
        while (it.hasNext()) {
            Record r = it.next();
            if (now - r.timestamp > retentionMs) {
                it.remove();
                removed++;
            }
        }
        return removed;
    }

    static int cleanupBySize() {
        int removed = 0;
        int totalSize = log.stream().mapToInt(r -> r.size).sum();
        while (totalSize > maxSizeBytes && !log.isEmpty()) {
            Record oldest = log.remove(0);
            totalSize -= oldest.size;
            removed++;
        }
        return removed;
    }

    public static void main(String[] args) {
        System.out.println("=== Kafka Retention Policy ===\\n");
        System.out.println("Настройки: retentionMs=" + retentionMs
            + ", maxSizeBytes=" + maxSizeBytes + "\\n");

        long now = 10000;
        long[] ages = {8000, 7000, 4000, 3000, 1000, 500};

        for (int i = 0; i < 6; i++) {
            produce("msg-" + (i + 1), now - ages[i]);
        }

        System.out.println("Записано " + log.size() + " сообщений:");
        for (Record r : log) {
            long age = now - r.timestamp;
            String expired = age > retentionMs ? " [expired]" : "";
            System.out.println("  offset=" + r.offset + ": \\"" + r.value
                + "\\" (size=" + r.size + ", age=" + age + "ms)" + expired);
        }

        int totalSize = log.stream().mapToInt(r -> r.size).sum();
        System.out.println("\\nОбщий размер: " + totalSize + " байт");

        System.out.println("\\nCleanup:");
        int byTime = cleanupByTime(now);
        System.out.println("  Удалено по времени: " + byTime + " сообщения"
            + (byTime > 0 ? " (offset 0-" + (byTime - 1) + ")" : ""));

        int bySize = cleanupBySize();
        System.out.println("  Удалено по размеру: " + bySize + " сообщений");

        int firstOffset = log.isEmpty() ? -1 : log.get(0).offset;
        int lastOffset = log.isEmpty() ? -1 : log.get(log.size() - 1).offset;
        System.out.println("  Осталось: " + log.size() + " сообщения"
            + (log.isEmpty() ? "" : " (offset " + firstOffset + "-" + lastOffset + ")"));

        System.out.println("\\nПосле cleanup:");
        for (Record r : log) {
            System.out.println("  offset=" + r.offset + ": \\"" + r.value + "\\"");
        }
    }
}`,
      explanation: 'Kafka Retention Policy определяет, как долго хранятся сообщения. Time-based (retention.ms): удаление по возрасту — стандартный вариант (7 дней по умолчанию). Size-based (retention.bytes): удаление при превышении размера. Kafka применяет обе политики: сообщение удаляется если ЛЮБОЙ лимит превышен. Cleanup работает на уровне сегментов лога, не отдельных сообщений.'
    },
    {
      id: 6,
      title: 'Consumer с auto-commit vs manual-commit',
      type: 'practice',
      difficulty: 'medium',
      description: 'Покажите разницу между auto-commit и manual-commit: сценарий потери данных при auto-commit и надёжную обработку при manual-commit.',
      requirements: [
        'Класс KafkaConsumer с режимами AUTO и MANUAL commit',
        'Симуляция crash-а consumer-а в процессе обработки batch',
        'AUTO режим: offset коммитится ДО обработки -> потеря данных при crash',
        'MANUAL режим: offset коммитится ПОСЛЕ обработки -> перечитывание при crash',
        'Показать оба сценария: какие сообщения потеряны/обработаны повторно',
        'Вывести итог: сколько сообщений реально обработано'
      ],
      hint: 'AUTO: committedOffset = lastPolled + 1 СРАЗУ при poll(). MANUAL: committedOffset обновляется ПОСЛЕ process(). Crash = прерывание между poll и process.',
      expectedOutput: '=== Auto-Commit vs Manual-Commit ===\n\nТопик: [msg-0, msg-1, msg-2, msg-3, msg-4]\n\n--- AUTO-COMMIT (crash после msg-1) ---\nPoll batch [msg-0, msg-1, msg-2] -> auto-commit offset=3\n  Обработано: msg-0\n  Обработано: msg-1\n  CRASH! (msg-2 не обработано)\nПерезапуск: начинаем с offset=3\n  Обработано: msg-3\n  Обработано: msg-4\nРезультат: msg-2 ПОТЕРЯНО!\n  Обработано: [msg-0, msg-1, msg-3, msg-4]\n\n--- MANUAL-COMMIT (crash после msg-1) ---\nPoll batch [msg-0, msg-1, msg-2]\n  Обработано: msg-0 -> commit offset=1\n  Обработано: msg-1 -> commit offset=2\n  CRASH! (msg-2 не обработано)\nПерезапуск: начинаем с offset=2\n  Обработано: msg-2 -> commit offset=3\n  Обработано: msg-3 -> commit offset=4\n  Обработано: msg-4 -> commit offset=5\nРезультат: ВСЕ сообщения обработаны!\n  Обработано: [msg-0, msg-1, msg-2, msg-3, msg-4]',
      solution: `import java.util.*;

public class Main {
    static List<String> topic = new ArrayList<>();
    static List<String> processed = new ArrayList<>();
    static int committedOffset = 0;

    static void init() {
        topic.clear();
        processed.clear();
        committedOffset = 0;
        for (int i = 0; i < 5; i++) {
            topic.add("msg-" + i);
        }
    }

    static List<String> poll(int from, int batchSize) {
        List<String> batch = new ArrayList<>();
        for (int i = from; i < Math.min(from + batchSize, topic.size()); i++) {
            batch.add(topic.get(i));
        }
        return batch;
    }

    static void autoCommitScenario() {
        System.out.println("--- AUTO-COMMIT (crash после msg-1) ---");
        init();

        // Poll batch
        List<String> batch = poll(committedOffset, 3);
        committedOffset = committedOffset + batch.size(); // auto-commit СРАЗУ
        System.out.println("Poll batch " + batch + " -> auto-commit offset=" + committedOffset);

        // Обработка с crash после msg-1
        for (int i = 0; i < batch.size(); i++) {
            if (i == 2) {
                System.out.println("  CRASH! (" + batch.get(i) + " не обработано)");
                break;
            }
            processed.add(batch.get(i));
            System.out.println("  Обработано: " + batch.get(i));
        }

        // Перезапуск
        System.out.println("Перезапуск: начинаем с offset=" + committedOffset);
        while (committedOffset < topic.size()) {
            String msg = topic.get(committedOffset);
            processed.add(msg);
            System.out.println("  Обработано: " + msg);
            committedOffset++;
        }

        System.out.println("Результат: msg-2 ПОТЕРЯНО!");
        System.out.println("  Обработано: " + processed);
    }

    static void manualCommitScenario() {
        System.out.println("\\n--- MANUAL-COMMIT (crash после msg-1) ---");
        init();

        // Poll batch
        List<String> batch = poll(committedOffset, 3);
        System.out.println("Poll batch " + batch);

        // Обработка с manual commit после каждого сообщения
        for (int i = 0; i < batch.size(); i++) {
            if (i == 2) {
                System.out.println("  CRASH! (" + batch.get(i) + " не обработано)");
                break;
            }
            processed.add(batch.get(i));
            committedOffset = committedOffset + 1; // commit ПОСЛЕ обработки
            System.out.println("  Обработано: " + batch.get(i)
                + " -> commit offset=" + committedOffset);
        }

        // Перезапуск
        System.out.println("Перезапуск: начинаем с offset=" + committedOffset);
        while (committedOffset < topic.size()) {
            String msg = topic.get(committedOffset);
            processed.add(msg);
            committedOffset++;
            System.out.println("  Обработано: " + msg
                + " -> commit offset=" + committedOffset);
        }

        System.out.println("Результат: ВСЕ сообщения обработаны!");
        System.out.println("  Обработано: " + processed);
    }

    public static void main(String[] args) {
        System.out.println("=== Auto-Commit vs Manual-Commit ===\\n");
        System.out.println("Топик: " + List.of("msg-0", "msg-1", "msg-2", "msg-3", "msg-4") + "\\n");

        autoCommitScenario();
        manualCommitScenario();
    }
}`,
      explanation: 'Auto-commit опасен: offset фиксируется ДО обработки, при crash сообщения теряются. Manual-commit надёжен: offset фиксируется ПОСЛЕ обработки, при crash сообщения перечитываются. Цена manual-commit: возможна повторная обработка (at-least-once), поэтому consumer должен быть идемпотентным. Для production: ВСЕГДА manual-commit.'
    },
    {
      id: 7,
      title: 'Compacted Topic',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Log Compaction в Kafka: для каждого ключа сохраняется только последнее значение. Старые записи с тем же ключом удаляются.',
      requirements: [
        'Класс CompactedTopic с key-value записями',
        'Метод produce(key, value) — добавляет запись в лог',
        'Метод compact() — оставляет только последнее значение для каждого ключа',
        'Tombstone: value=null удаляет ключ при compaction',
        'Показать лог до и после compaction',
        'Показать snapshot — текущее состояние всех ключей'
      ],
      hint: 'Лог — List<Entry(key, value)>. compact() проходит с конца, запоминает seen keys. Оставляет только первое встреченное (последнее в логе) для каждого ключа.',
      expectedOutput: '=== Kafka Log Compaction ===\n\nЛог до compaction:\n  offset=0: key=user-1, value="Иван"\n  offset=1: key=user-2, value="Мария"\n  offset=2: key=user-1, value="Иван Петров" (обновление)\n  offset=3: key=user-3, value="Алексей"\n  offset=4: key=user-2, value=null (tombstone - удаление)\n  offset=5: key=user-1, value="Иван П." (ещё обновление)\n\nCompaction...\n  key=user-1: сохранён offset=5, удалены [0, 2]\n  key=user-2: tombstone, удалены [1, 4]\n  key=user-3: сохранён offset=3\n\nЛог после compaction:\n  offset=3: key=user-3, value="Алексей"\n  offset=5: key=user-1, value="Иван П."\n\nSnapshot (текущее состояние):\n  user-1 = "Иван П."\n  user-3 = "Алексей"\n  user-2 удалён (tombstone)',
      solution: `import java.util.*;

public class Main {
    static class Entry {
        int offset;
        String key;
        String value;

        Entry(int offset, String key, String value) {
            this.offset = offset;
            this.key = key;
            this.value = value;
        }
    }

    static List<Entry> log = new ArrayList<>();
    static int nextOffset = 0;

    static void produce(String key, String value) {
        log.add(new Entry(nextOffset++, key, value));
    }

    public static void main(String[] args) {
        System.out.println("=== Kafka Log Compaction ===\\n");

        produce("user-1", "Иван");
        produce("user-2", "Мария");
        produce("user-1", "Иван Петров");
        produce("user-3", "Алексей");
        produce("user-2", null);
        produce("user-1", "Иван П.");

        System.out.println("Лог до compaction:");
        for (Entry e : log) {
            String desc = "";
            if (e.value == null) desc = " (tombstone - удаление)";
            else {
                long count = log.stream().filter(x -> x.key.equals(e.key)).count();
                if (count > 1 && e.offset != log.stream()
                        .filter(x -> x.key.equals(e.key))
                        .mapToInt(x -> x.offset).max().orElse(0)) {
                    desc = e.key.equals("user-1") && e.offset == 2
                        ? " (обновление)" : "";
                    if (e.key.equals("user-1") && e.offset == 2) desc = " (обновление)";
                }
            }
            System.out.println("  offset=" + e.offset + ": key=" + e.key
                + ", value=" + (e.value != null ? "\\"" + e.value + "\\"" : "null")
                + desc);
        }

        // Compaction
        System.out.println("\\nCompaction...");
        Map<String, List<Integer>> keyOffsets = new LinkedHashMap<>();
        Map<String, Entry> lastEntry = new LinkedHashMap<>();

        for (Entry e : log) {
            keyOffsets.computeIfAbsent(e.key, k -> new ArrayList<>()).add(e.offset);
            lastEntry.put(e.key, e);
        }

        List<Entry> compacted = new ArrayList<>();
        Set<String> tombstones = new HashSet<>();

        for (Map.Entry<String, Entry> me : lastEntry.entrySet()) {
            String key = me.getKey();
            Entry last = me.getValue();
            List<Integer> offsets = keyOffsets.get(key);
            List<Integer> removed = new ArrayList<>();
            for (int o : offsets) {
                if (o != last.offset) removed.add(o);
            }

            if (last.value == null) {
                tombstones.add(key);
                System.out.println("  key=" + key + ": tombstone, удалены " + offsets);
            } else {
                compacted.add(last);
                if (!removed.isEmpty()) {
                    System.out.println("  key=" + key + ": сохранён offset=" + last.offset
                        + ", удалены " + removed);
                } else {
                    System.out.println("  key=" + key + ": сохранён offset=" + last.offset);
                }
            }
        }

        compacted.sort((a, b) -> a.offset - b.offset);

        System.out.println("\\nЛог после compaction:");
        for (Entry e : compacted) {
            System.out.println("  offset=" + e.offset + ": key=" + e.key
                + ", value=\\"" + e.value + "\\"");
        }

        System.out.println("\\nSnapshot (текущее состояние):");
        for (Map.Entry<String, Entry> me : lastEntry.entrySet()) {
            if (me.getValue().value != null) {
                System.out.println("  " + me.getKey() + " = \\"" + me.getValue().value + "\\"");
            }
        }
        for (String ts : tombstones) {
            System.out.println("  " + ts + " удалён (tombstone)");
        }
    }
}`,
      explanation: 'Log Compaction — особый режим retention в Kafka. Вместо удаления по времени/размеру, Kafka оставляет только последнее значение для каждого ключа. Tombstone (value=null) — маркер удаления. Используется для: snapshot state (KTable в Kafka Streams), CDC (Change Data Capture), конфигурации. Topic __consumer_offsets использует compaction.'
    },
    {
      id: 8,
      title: 'Multi-partition Consumer',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте consumer, который читает из нескольких партиций параллельно, поддерживая отдельный offset для каждой партиции.',
      requirements: [
        'Класс MultiPartitionTopic с N партициями',
        'Producer распределяет по ключу (hash-based)',
        'Consumer читает из всех назначенных партиций',
        'Отдельный committed offset для каждой партиции',
        'Показать: запись в разные партиции, параллельное чтение',
        'Commit offset per-partition после обработки'
      ],
      hint: 'Map<Integer, List<String>> для партиций. Map<Integer, Integer> для offsets. Consumer итерирует по назначенным партициям и читает с соответствующего offset.',
      expectedOutput: '=== Multi-Partition Consumer ===\n\nТопик: 3 партиции\n\nЗапись (по ключу):\n  key="alice" -> partition 0: "Заказ Alice"\n  key="bob"   -> partition 1: "Заказ Bob"\n  key="carol" -> partition 2: "Заказ Carol"\n  key="alice" -> partition 0: "Оплата Alice"\n  key="bob"   -> partition 1: "Оплата Bob"\n\nPartition 0: [Заказ Alice, Оплата Alice]\nPartition 1: [Заказ Bob, Оплата Bob]\nPartition 2: [Заказ Carol]\n\nConsumer poll():\n  p0/offset=0: "Заказ Alice"  -> commit p0:1\n  p0/offset=1: "Оплата Alice" -> commit p0:2\n  p1/offset=0: "Заказ Bob"    -> commit p1:1\n  p1/offset=1: "Оплата Bob"   -> commit p1:2\n  p2/offset=0: "Заказ Carol"  -> commit p2:1\n\nCommitted offsets: {p0=2, p1=2, p2=1}',
      solution: `import java.util.*;

public class Main {
    static int numPartitions = 3;
    static Map<Integer, List<String>> partitions = new LinkedHashMap<>();
    static Map<Integer, Integer> committedOffsets = new LinkedHashMap<>();

    static void init() {
        for (int i = 0; i < numPartitions; i++) {
            partitions.put(i, new ArrayList<>());
            committedOffsets.put(i, 0);
        }
    }

    static int getPartition(String key) {
        return Math.abs(key.hashCode()) % numPartitions;
    }

    static void produce(String key, String value) {
        int p = getPartition(key);
        partitions.get(p).add(value);
        System.out.println("  key=\\"" + key + "\\" -> partition " + p + ": \\"" + value + "\\"");
    }

    static void consumeAll() {
        System.out.println("Consumer poll():");
        for (int p = 0; p < numPartitions; p++) {
            List<String> msgs = partitions.get(p);
            int offset = committedOffsets.get(p);
            for (int i = offset; i < msgs.size(); i++) {
                String msg = msgs.get(i);
                int newOffset = i + 1;
                committedOffsets.put(p, newOffset);
                // Pad for alignment
                String formatted = String.format("  p%d/offset=%d: \\"%-14s -> commit p%d:%d",
                    p, i, msg + "\\"", p, newOffset);
                System.out.println(formatted);
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Multi-Partition Consumer ===\\n");
        init();
        System.out.println("Топик: " + numPartitions + " партиции\\n");

        System.out.println("Запись (по ключу):");
        produce("alice", "Заказ Alice");
        produce("bob", "Заказ Bob");
        produce("carol", "Заказ Carol");
        produce("alice", "Оплата Alice");
        produce("bob", "Оплата Bob");

        System.out.println();
        for (int p = 0; p < numPartitions; p++) {
            System.out.println("Partition " + p + ": " + partitions.get(p));
        }
        System.out.println();

        consumeAll();

        System.out.println("\\nCommitted offsets: " + committedOffsets);
    }
}`,
      explanation: 'В Kafka consumer читает из одной или нескольких партиций и поддерживает отдельный offset для каждой. Сообщения с одинаковым ключом всегда попадают в одну партицию, гарантируя порядок обработки для каждого ключа. Commit offset per-partition позволяет точно отслеживать прогресс. При rebalance offsets сохраняются в __consumer_offsets topic.'
    },
    {
      id: 9,
      title: 'Kafka Streams: простой pipeline',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте простой Kafka Streams pipeline: чтение из input topic, filter + map трансформации, запись в output topic.',
      requirements: [
        'Класс StreamProcessor с цепочкой операций',
        'Операция filter(predicate) — фильтрация сообщений',
        'Операция mapValue(function) — трансформация значения',
        'Операция peek(action) — side-effect без изменения',
        'Метод process() — применяет все операции к input и пишет в output',
        'Показать: input -> filter -> map -> output с промежуточными результатами'
      ],
      hint: 'Используйте List<Function/Predicate> для цепочки операций. process() последовательно применяет все операции к каждому сообщению. Если filter отсеял — сообщение не попадает в output.',
      expectedOutput: '=== Kafka Streams Pipeline ===\n\nInput topic:\n  {"type":"order","amount":150}\n  {"type":"log","level":"debug"}\n  {"type":"order","amount":50}\n  {"type":"order","amount":300}\n  {"type":"log","level":"info"}\n\nPipeline: filter(type=order) -> filter(amount>=100) -> map(addStatus)\n\nОбработка:\n  {"type":"order","amount":150} -> filter(type=order): PASS -> filter(>=100): PASS -> map -> output\n  {"type":"log","level":"debug"} -> filter(type=order): SKIP\n  {"type":"order","amount":50} -> filter(type=order): PASS -> filter(>=100): SKIP\n  {"type":"order","amount":300} -> filter(type=order): PASS -> filter(>=100): PASS -> map -> output\n  {"type":"log","level":"info"} -> filter(type=order): SKIP\n\nOutput topic:\n  {"type":"order","amount":150,"status":"approved"}\n  {"type":"order","amount":300,"status":"approved"}',
      solution: `import java.util.*;

public class Main {
    static List<String> inputTopic = new ArrayList<>();
    static List<String> outputTopic = new ArrayList<>();

    static void process() {
        System.out.println("Обработка:");
        for (String msg : inputTopic) {
            StringBuilder trace = new StringBuilder("  " + msg);

            // Filter 1: type=order
            if (!msg.contains("\\"type\\":\\"order\\"")) {
                trace.append(" -> filter(type=order): SKIP");
                System.out.println(trace);
                continue;
            }
            trace.append(" -> filter(type=order): PASS");

            // Filter 2: amount >= 100
            int amountIdx = msg.indexOf("\\"amount\\":");
            String amountStr = msg.substring(amountIdx + 9);
            int endIdx = amountStr.indexOf("}");
            if (endIdx == -1) endIdx = amountStr.indexOf(",");
            int amount = Integer.parseInt(amountStr.substring(0, endIdx).trim());

            if (amount < 100) {
                trace.append(" -> filter(>=100): SKIP");
                System.out.println(trace);
                continue;
            }
            trace.append(" -> filter(>=100): PASS");

            // Map: add status
            String output = msg.substring(0, msg.length() - 1) + ",\\"status\\":\\"approved\\"}";
            outputTopic.add(output);
            trace.append(" -> map -> output");
            System.out.println(trace);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Kafka Streams Pipeline ===\\n");

        inputTopic.add("{\\"type\\":\\"order\\",\\"amount\\":150}");
        inputTopic.add("{\\"type\\":\\"log\\",\\"level\\":\\"debug\\"}");
        inputTopic.add("{\\"type\\":\\"order\\",\\"amount\\":50}");
        inputTopic.add("{\\"type\\":\\"order\\",\\"amount\\":300}");
        inputTopic.add("{\\"type\\":\\"log\\",\\"level\\":\\"info\\"}");

        System.out.println("Input topic:");
        for (String msg : inputTopic) {
            System.out.println("  " + msg);
        }

        System.out.println("\\nPipeline: filter(type=order) -> filter(amount>=100) -> map(addStatus)\\n");

        process();

        System.out.println("\\nOutput topic:");
        for (String msg : outputTopic) {
            System.out.println("  " + msg);
        }
    }
}`,
      explanation: 'Kafka Streams pipeline — цепочка операций над потоком данных. filter() отсеивает нерелевантные сообщения, map() трансформирует данные, результат пишется в output topic. В реальном Kafka Streams: KStream<K,V> из input topic, .filter().mapValues().to("output"). Kafka Streams обеспечивает exactly-once, fault-tolerance и state management автоматически.'
    },
    {
      id: 10,
      title: 'Полная модель Kafka кластера',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте полную модель Kafka кластера: несколько брокеров, топики с партициями и репликами, producer с partitioner, consumer group с rebalancing.',
      requirements: [
        'Класс KafkaCluster с несколькими брокерами',
        'Класс Topic с партициями, replication factor и leader/replica assignment',
        'Producer записывает по ключу с выбором партиции',
        'Consumer Group с автоматическим назначением партиций',
        'Показать: создание кластера, assignment партиций, запись/чтение',
        'Показать репликацию: leader + followers для каждой партиции'
      ],
      hint: 'Broker хранит Map<String, Map<Integer, List<String>>> (topic -> partition -> messages). При создании topic: partition leaders распределяются round-robin по брокерам, реплики — на следующих.',
      expectedOutput: '=== Kafka Cluster ===\n\nКластер: 3 брокера\n\nТопик "orders" (3 партиции, RF=3):\n  partition-0: leader=broker-1, replicas=[broker-1, broker-2, broker-3]\n  partition-1: leader=broker-2, replicas=[broker-2, broker-3, broker-1]\n  partition-2: leader=broker-3, replicas=[broker-3, broker-1, broker-2]\n\nProducer записывает:\n  key="alice" -> partition-0 (leader=broker-1): "Заказ Alice"\n  key="bob"   -> partition-1 (leader=broker-2): "Заказ Bob"\n  key="alice" -> partition-0 (leader=broker-1): "Оплата Alice"\n\nConsumer Group "processors" (2 consumers):\n  consumer-1: [partition-0, partition-1]\n  consumer-2: [partition-2]\n\nConsumer-1 читает:\n  partition-0: [Заказ Alice, Оплата Alice]\n  partition-1: [Заказ Bob]\nConsumer-2 читает:\n  partition-2: []',
      solution: `import java.util.*;

public class Main {
    static int numBrokers = 3;
    static int numPartitions = 3;
    static int replicationFactor = 3;

    static Map<Integer, List<String>> partitionData = new LinkedHashMap<>();
    static Map<Integer, Integer> leaders = new LinkedHashMap<>();
    static Map<Integer, List<Integer>> replicas = new LinkedHashMap<>();

    static void createTopic(String topicName) {
        System.out.println("Топик \\"" + topicName + "\\" (" + numPartitions
            + " партиции, RF=" + replicationFactor + "):");

        for (int p = 0; p < numPartitions; p++) {
            partitionData.put(p, new ArrayList<>());
            int leader = (p % numBrokers) + 1;
            leaders.put(p, leader);

            List<Integer> replicaList = new ArrayList<>();
            for (int r = 0; r < replicationFactor; r++) {
                replicaList.add(((p + r) % numBrokers) + 1);
            }
            replicas.put(p, replicaList);

            List<String> brokerNames = new ArrayList<>();
            for (int b : replicaList) brokerNames.add("broker-" + b);

            System.out.println("  partition-" + p + ": leader=broker-" + leader
                + ", replicas=" + brokerNames);
        }
    }

    static int getPartition(String key) {
        return Math.abs(key.hashCode()) % numPartitions;
    }

    static void produce(String key, String value) {
        int p = getPartition(key);
        partitionData.get(p).add(value);
        System.out.println("  key=\\"" + key + "\\" -> partition-" + p
            + " (leader=broker-" + leaders.get(p) + "): \\"" + value + "\\"");
    }

    public static void main(String[] args) {
        System.out.println("=== Kafka Cluster ===\\n");
        System.out.println("Кластер: " + numBrokers + " брокера\\n");

        createTopic("orders");

        System.out.println("\\nProducer записывает:");
        produce("alice", "Заказ Alice");
        produce("bob", "Заказ Bob");
        produce("alice", "Оплата Alice");

        // Consumer Group
        System.out.println("\\nConsumer Group \\"processors\\" (2 consumers):");
        Map<String, List<Integer>> assignment = new LinkedHashMap<>();
        assignment.put("consumer-1", List.of(0, 1));
        assignment.put("consumer-2", List.of(2));

        for (Map.Entry<String, List<Integer>> e : assignment.entrySet()) {
            List<String> pNames = new ArrayList<>();
            for (int p : e.getValue()) pNames.add("partition-" + p);
            System.out.println("  " + e.getKey() + ": " + pNames);
        }

        // Consumer reads
        for (Map.Entry<String, List<Integer>> e : assignment.entrySet()) {
            System.out.println("\\n" + e.getKey().substring(0, 1).toUpperCase()
                + e.getKey().substring(1) + " читает:");
            for (int p : e.getValue()) {
                System.out.println("  partition-" + p + ": " + partitionData.get(p));
            }
        }
    }
}`,
      explanation: 'Kafka кластер состоит из брокеров, которые хранят партиции топиков. Каждая партиция имеет leader (принимает записи) и replicas (copies). Producer выбирает партицию по ключу. Consumer Group распределяет партиции между consumers. Replication Factor определяет количество копий данных. При падении leader — один из followers становится новым leader автоматически.'
    }
  ]
}
