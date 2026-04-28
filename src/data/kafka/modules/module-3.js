export default {
  id: 3,
  title: 'Producers: отправка сообщений',
  description: 'Настройка Kafka Producer: acks, retries, idempotent producer, batch sending, сериализация ключей и значений.',
  lessons: [
    {
      id: 1,
      title: 'Как работает Kafka Producer',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kafka Producer — компонент, который отправляет сообщения в топики Kafka. Producer определяет, в какую партицию попадёт сообщение, группирует сообщения в batches, обрабатывает ошибки и повторные отправки.' },
        { type: 'heading', value: 'Жизненный цикл сообщения в Producer' },
        { type: 'code', language: 'java', value: '// Путь сообщения от вызова send() до записи в Kafka:\n//\n// 1. Сериализация key и value (StringSerializer, JsonSerializer)\n// 2. Partitioner — определение целевой партиции\n//    - key != null: hash(key) % numPartitions\n//    - key == null: Round Robin / Sticky Partitioner\n// 3. Record Accumulator — буферизация в batch\n//    - batch.size (16KB по умолчанию) — размер batch\n//    - linger.ms (0 по умолчанию) — ожидание заполнения\n// 4. Sender Thread — отправка batch на broker\n//    - max.in.flight.requests.per.connection (5)\n// 5. Broker записывает в лог\n// 6. Producer получает ACK или ошибку\n//    - acks=0: не ждёт\n//    - acks=1: ждёт leader\n//    - acks=all: ждёт все ISR\n\n// Основные настройки Producer:\n// bootstrap.servers = "broker1:9092,broker2:9092"\n// key.serializer = StringSerializer.class\n// value.serializer = StringSerializer.class\n// acks = "all"\n// retries = Integer.MAX_VALUE\n// enable.idempotence = true' },
        { type: 'heading', value: 'Batching — группировка сообщений' },
        { type: 'text', value: 'Producer не отправляет каждое сообщение отдельно. Он собирает сообщения в batch (пакет) и отправляет их одним запросом. Это значительно повышает throughput за счёт уменьшения network overhead.' },
        { type: 'code', language: 'java', value: '// Настройки batching:\n// batch.size = 16384      (16KB) — макс. размер batch\n// linger.ms = 0           — ожидание заполнения batch\n//\n// linger.ms = 0: отправка сразу (низкая latency, малый throughput)\n// linger.ms = 5: ждём 5ms для заполнения batch\n// linger.ms = 20: ждём 20ms (высокий throughput, выше latency)\n//\n// Пример:\n// linger.ms=0, 1000 msg/s: 1000 запросов к брокеру\n// linger.ms=5, 1000 msg/s: ~200 запросов (по 5 msg в batch)\n// linger.ms=20, 1000 msg/s: ~50 запросов (по 20 msg в batch)' },
        { type: 'tip', value: 'Для high-throughput систем установите linger.ms=5-20 и batch.size=32768-65536. Для low-latency (финансовые транзакции) оставьте linger.ms=0. Это trade-off между latency и throughput.' }
      ]
    },
    {
      id: 2,
      title: 'ACKs: гарантии записи',
      type: 'theory',
      content: [
        { type: 'text', value: 'Параметр acks определяет, сколько реплик должны подтвердить запись, прежде чем producer получит ACK. Это главный trade-off между надёжностью и производительностью.' },
        { type: 'heading', value: 'acks=0 — Fire and Forget' },
        { type: 'text', value: 'Producer не ждёт подтверждения. Отправил и забыл. Максимальная скорость, но сообщения могут потеряться если broker недоступен. Подходит для метрик и логов, где потеря допустима.' },
        { type: 'heading', value: 'acks=1 — Leader Only' },
        { type: 'text', value: 'Producer ждёт подтверждения от leader-а партиции. Если leader записал — ACK отправляется. Но если leader упал ДО репликации на followers — сообщение потеряется.' },
        { type: 'heading', value: 'acks=all (-1) — Все ISR реплики' },
        { type: 'text', value: 'Producer ждёт подтверждения от ВСЕХ реплик в ISR. Максимальная надёжность. Сообщение не потеряется даже при падении leader-а, потому что followers уже имеют копию.' },
        { type: 'code', language: 'java', value: '// Сравнение acks настроек:\n//\n// acks=0:\n//   Producer --> Broker (не ждёт ответа)\n//   Latency: ~0.5ms\n//   Потеря данных: возможна\n//   Кейс: метрики, логирование\n//\n// acks=1:\n//   Producer --> Leader --> ACK\n//                |-> Follower1 (асинхронно)\n//                |-> Follower2 (асинхронно)\n//   Latency: ~2-5ms\n//   Потеря данных: при падении leader-а до репликации\n//   Кейс: обычные события, не критичные данные\n//\n// acks=all (min.insync.replicas=2):\n//   Producer --> Leader --> Follower1 --> ACK\n//                |-> Follower2 (тоже ждём)\n//   Latency: ~10-20ms\n//   Потеря данных: невозможна (при RF=3, ISR>=2)\n//   Кейс: финансы, заказы, критичные данные' },
        { type: 'warning', value: 'acks=all БЕЗ min.insync.replicas бесполезен! Если ISR = [leader], то acks=all == acks=1. Всегда ставьте min.insync.replicas=2 для production. Формула надёжности: replication.factor=3 + acks=all + min.insync.replicas=2.' }
      ]
    },
    {
      id: 3,
      title: 'Retries и Idempotent Producer',
      type: 'theory',
      content: [
        { type: 'text', value: 'При сетевых сбоях producer может не получить ACK, хотя сообщение было записано. Если producer повторит отправку — сообщение задублируется. Idempotent Producer решает эту проблему через Producer ID и Sequence Number.' },
        { type: 'heading', value: 'Проблема дубликатов' },
        { type: 'code', language: 'java', value: '// Сценарий дублирования БЕЗ idempotent producer:\n//\n// 1. Producer отправляет "Заказ #100" в Kafka\n// 2. Leader записывает сообщение (offset=5)\n// 3. Сеть обрывается ДО получения ACK\n// 4. Producer не получил ACK -> retry!\n// 5. Producer отправляет "Заказ #100" повторно\n// 6. Leader записывает ДУБЛИКАТ (offset=6)\n// 7. В логе два одинаковых "Заказ #100"!\n//\n// Результат: заказ обработан ДВАЖДЫ — деньги списаны 2 раза\n\n// С Idempotent Producer:\n// 1. Producer отправляет PID=1, Seq=0, "Заказ #100"\n// 2. Leader записывает (offset=5), помнит: PID=1, lastSeq=0\n// 3. Сеть обрывается, ACK не получен\n// 4. Producer retry: PID=1, Seq=0, "Заказ #100"\n// 5. Leader видит: PID=1, Seq=0 уже была! -> ОТКЛОНЯЕТ дубликат\n// 6. Producer получает ACK без дубликата!' },
        { type: 'heading', value: 'Настройка Idempotent Producer' },
        { type: 'code', language: 'java', value: '// Включение idempotent producer:\n// enable.idempotence = true  (по умолчанию с Kafka 3.0)\n//\n// Автоматически устанавливает:\n// acks = all\n// retries = Integer.MAX_VALUE\n// max.in.flight.requests.per.connection = 5\n//\n// Как это работает:\n// Producer получает уникальный PID (Producer ID) от брокера\n// Каждое сообщение имеет Sequence Number (для каждой партиции)\n// Broker отслеживает последний seq для каждого PID\n// Дубликаты отклоняются по (PID, Seq)\n\n// ВАЖНО: Idempotent producer гарантирует:\n// 1. Нет дубликатов в рамках одной партиции\n// 2. Порядок сообщений сохраняется\n// 3. Работает прозрачно — не нужно менять код producer-а\n\n// НЕ гарантирует:\n// 1. Exactly-once между разными топиками (нужны транзакции)\n// 2. Idempotence на стороне consumer-а' },
        { type: 'heading', value: 'Настройка Retries' },
        { type: 'list', value: [
          'retries — количество повторных попыток (Integer.MAX_VALUE с idempotent)',
          'retry.backoff.ms=100 — задержка между попытками',
          'delivery.timeout.ms=120000 — максимальное время доставки (2 минуты)',
          'max.in.flight.requests.per.connection=5 — параллельные запросы',
          'С idempotent producer можно безопасно использовать retries без дубликатов'
        ] },
        { type: 'tip', value: 'Начиная с Kafka 3.0 idempotent producer включён по умолчанию. Для старых версий явно укажите enable.idempotence=true. Это бесплатная страховка от дубликатов без потери производительности.' }
      ]
    },
    {
      id: 4,
      title: 'Partitioner и выбор партиции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Partitioner определяет, в какую партицию попадёт сообщение. Правильный выбор партиции критичен: он влияет на порядок сообщений, распределение нагрузки и возможность параллельной обработки.' },
        { type: 'heading', value: 'Default Partitioner' },
        { type: 'code', language: 'java', value: '// Default Partitioner в Kafka:\n//\n// 1. key != null:\n//    partition = Math.abs(murmur2(key)) % numPartitions\n//    Одинаковый key -> одинаковая партиция ВСЕГДА\n//\n// 2. key == null (Kafka < 2.4):\n//    Round Robin — каждое сообщение в следующую партицию\n//\n// 3. key == null (Kafka >= 2.4):\n//    Sticky Partitioner — все сообщения batch идут в одну партицию\n//    Следующий batch — в другую\n//    Это уменьшает количество запросов к брокерам' },
        { type: 'heading', value: 'Выбор ключа сообщения' },
        { type: 'code', language: 'java', value: '// Правила выбора ключа:\n//\n// 1. Заказы: key = orderId\n//    Все события одного заказа в одной партиции -> порядок!\n//    OrderCreated -> OrderPaid -> OrderShipped (порядок гарантирован)\n//\n// 2. Пользователи: key = userId\n//    Все действия пользователя в одной партиции\n//    Login -> Browse -> AddToCart -> Checkout\n//\n// 3. Логи: key = null\n//    Равномерное распределение, порядок не важен\n//\n// 4. Финансовые транзакции: key = accountId\n//    Все операции по счёту в порядке\n//    Debit -> Credit -> Debit\n\n// АНТИПАТТЕРН: один ключ для всех сообщений\n// key = "orders" -> ВСЕ заказы в одну партицию\n// Результат: одна партиция перегружена, остальные пусты\n// Это называется Hot Partition!' },
        { type: 'heading', value: 'Custom Partitioner' },
        { type: 'text', value: 'Иногда default partitioner не подходит. Например, VIP-клиенты должны попадать в выделенную партицию для приоритетной обработки.' },
        { type: 'code', language: 'java', value: '// Custom Partitioner — VIP клиенты в отдельную партицию\n// Реализация интерфейса Partitioner:\n//\n// public class VipPartitioner implements Partitioner {\n//     @Override\n//     public int partition(String topic, Object key, byte[] keyBytes,\n//                          Object value, byte[] valueBytes, Cluster cluster) {\n//         int numPartitions = cluster.partitionCountForTopic(topic);\n//         if (key != null && key.toString().startsWith("VIP-")) {\n//             return 0; // VIP всегда в партицию 0\n//         }\n//         // Остальные распределяются по партициям 1..N\n//         return 1 + (Math.abs(key.hashCode()) % (numPartitions - 1));\n//     }\n// }' },
        { type: 'warning', value: 'Изменение количества партиций ломает распределение по ключам! hash("user-1") % 3 != hash("user-1") % 5. Если увеличите партиции с 3 до 5, сообщения user-1 начнут попадать в другую партицию. Планируйте количество партиций заранее.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Producer с ACKs и Retry',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте модель Kafka Producer с поддержкой acks, retry и idempotent отправки.',
      requirements: [
        'Класс KafkaProducer с настройками acks, retries, enableIdempotence',
        'Класс Broker с методом receive() — может случайно "падать"',
        'При acks=0 — не ждать ответа, при acks=1 — ждать leader, при acks=all — ждать всех',
        'Retry при ошибке (до maxRetries попыток)',
        'Idempotent режим — отклонять дубликаты по (producerId, seqNumber)',
        'Покажите сценарий с дубликатами без idempotence и без — с idempotence'
      ],
      hint: 'Для симуляции сбоя используйте Random с вероятностью 30%. Для idempotent producer храните Set<String> из "pid-seq" на стороне broker.',
      expectedOutput: '=== Без Idempotent Producer ===\nacks=1, retries=3\n\nПопытка 1: send("Заказ-1") -> Broker записал, но ACK потерян\nПопытка 2 (retry): send("Заказ-1") -> Broker записал ДУБЛИКАТ, ACK OK\nБрокер содержит: [Заказ-1, Заказ-1] <- ДУБЛИКАТ!\n\n=== С Idempotent Producer ===\nacks=all, retries=3, idempotent=true\n\nПопытка 1: send("Заказ-2") PID=1,Seq=0 -> Broker записал, ACK потерян\nПопытка 2 (retry): send("Заказ-2") PID=1,Seq=0 -> Дубликат отклонён, ACK OK\nБрокер содержит: [Заказ-2] <- Нет дубликата!',
      solution: `import java.util.*;

public class Main {
    static class Broker {
        List<String> log = new ArrayList<>();
        Set<String> seenIds = new HashSet<>(); // для idempotent
        Random random = new Random(42);
        boolean simulateAckLoss = false;
        int ackLossCount = 0;

        // Запись без idempotent
        boolean write(String message) {
            log.add(message);
            if (simulateAckLoss && ackLossCount == 0) {
                ackLossCount++;
                return false; // ACK потерян, но данные записаны!
            }
            return true;
        }

        // Запись с idempotent
        boolean writeIdempotent(String message, int pid, int seq) {
            String idKey = pid + "-" + seq;
            if (seenIds.contains(idKey)) {
                System.out.println("  Дубликат отклонён (PID=" + pid + ",Seq=" + seq + "), ACK OK");
                return true; // Дубликат — возвращаем ACK без записи
            }
            seenIds.add(idKey);
            log.add(message);
            if (simulateAckLoss && ackLossCount == 0) {
                ackLossCount++;
                return false; // ACK потерян
            }
            return true;
        }
    }

    static class KafkaProducer {
        int acks; // 0, 1
        int maxRetries;
        boolean idempotent;
        int producerId;
        int seqNumber = 0;

        KafkaProducer(int acks, int maxRetries, boolean idempotent) {
            this.acks = acks;
            this.maxRetries = maxRetries;
            this.idempotent = idempotent;
            this.producerId = idempotent ? 1 : 0;
        }

        boolean send(Broker broker, String message) {
            for (int attempt = 1; attempt <= maxRetries; attempt++) {
                boolean ackReceived;
                if (idempotent) {
                    System.out.print("Попытка " + attempt + ": send(\\"" + message
                        + "\\") PID=" + producerId + ",Seq=" + seqNumber + " -> ");
                    ackReceived = broker.writeIdempotent(message, producerId, seqNumber);
                } else {
                    System.out.print("Попытка " + attempt + ": send(\\"" + message + "\\") -> ");
                    ackReceived = broker.write(message);
                }

                if (acks == 0) {
                    System.out.println("Отправлено (acks=0, без подтверждения)");
                    seqNumber++;
                    return true;
                }

                if (ackReceived) {
                    if (!idempotent || attempt == 1) {
                        System.out.println("Broker записал, ACK OK");
                    }
                    seqNumber++;
                    return true;
                } else {
                    System.out.println("Broker записал, но ACK потерян");
                    if (attempt < maxRetries) {
                        System.out.print("Попытка " + (attempt + 1) + " (retry): send(\\"" + message + "\\")");
                        if (idempotent) {
                            System.out.print(" PID=" + producerId + ",Seq=" + seqNumber);
                        }
                        System.out.print(" -> ");
                        if (idempotent) {
                            ackReceived = broker.writeIdempotent(message, producerId, seqNumber);
                        } else {
                            ackReceived = broker.write(message);
                            System.out.println("Broker записал ДУБЛИКАТ, ACK OK");
                        }
                        seqNumber++;
                        return true;
                    }
                }
            }
            return false;
        }
    }

    public static void main(String[] args) {
        // Сценарий 1: без idempotent
        System.out.println("=== Без Idempotent Producer ===");
        System.out.println("acks=1, retries=3\\n");

        Broker broker1 = new Broker();
        broker1.simulateAckLoss = true;
        KafkaProducer producer1 = new KafkaProducer(1, 3, false);
        producer1.send(broker1, "Заказ-1");
        System.out.println("Брокер содержит: " + broker1.log + " <- ДУБЛИКАТ!");

        // Сценарий 2: с idempotent
        System.out.println("\\n=== С Idempotent Producer ===");
        System.out.println("acks=all, retries=3, idempotent=true\\n");

        Broker broker2 = new Broker();
        broker2.simulateAckLoss = true;
        KafkaProducer producer2 = new KafkaProducer(1, 3, true);
        producer2.send(broker2, "Заказ-2");
        System.out.println("Брокер содержит: " + broker2.log + " <- Нет дубликата!");
    }
}`,
      explanation: 'Idempotent producer использует PID (Producer ID) и Sequence Number для каждого сообщения. Broker хранит последний seq для каждого PID и отклоняет повторные сообщения с тем же seq. Это обеспечивает exactly-once семантику на уровне партиции без потери производительности.'
    },
    {
      id: 6,
      title: 'Практика: Custom Partitioner',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте custom partitioner, который распределяет VIP-клиентов в выделенную партицию, а обычных — по hash(key).',
      requirements: [
        'Интерфейс Partitioner с методом partition(key, numPartitions)',
        'DefaultPartitioner — hash(key) % numPartitions',
        'VipPartitioner — VIP ключи в партицию 0, остальные по hash в 1..N',
        'Класс Topic с настраиваемым partitioner',
        'Отправьте 8 сообщений от VIP и обычных клиентов',
        'Покажите распределение по партициям'
      ],
      hint: 'VIP ключи начинаются с "VIP-". Обычные ключи распределяются по партициям 1..numPartitions-1 через hash.',
      expectedOutput: '=== Default Partitioner ===\nkey="user-1" -> Partition 1\nkey="user-2" -> Partition 0\nkey="VIP-1"  -> Partition 2\nkey="user-3" -> Partition 1\n\n=== VIP Partitioner ===\nkey="user-1" -> Partition 2 (обычный)\nkey="VIP-1"  -> Partition 0 (VIP)\nkey="VIP-2"  -> Partition 0 (VIP)\nkey="user-2" -> Partition 1 (обычный)\nkey="VIP-3"  -> Partition 0 (VIP)\nkey="user-3" -> Partition 2 (обычный)\n\nPartition 0 (VIP): [VIP-1:Заказ VIP, VIP-2:Премиум, VIP-3:Экспресс]\nPartition 1: [user-2:Заказ стандарт]\nPartition 2: [user-1:Обычный заказ, user-3:Ещё заказ]',
      solution: `import java.util.*;

public class Main {
    interface Partitioner {
        int partition(String key, int numPartitions);
    }

    static class DefaultPartitioner implements Partitioner {
        public int partition(String key, int numPartitions) {
            return Math.abs(key.hashCode()) % numPartitions;
        }
    }

    static class VipPartitioner implements Partitioner {
        public int partition(String key, int numPartitions) {
            if (key.startsWith("VIP-")) {
                return 0; // VIP всегда в партицию 0
            }
            // Обычные клиенты в партиции 1..N-1
            return 1 + (Math.abs(key.hashCode()) % (numPartitions - 1));
        }
    }

    static class Topic {
        String name;
        int numPartitions;
        List<List<String>> partitions;
        Partitioner partitioner;

        Topic(String name, int numPartitions, Partitioner partitioner) {
            this.name = name;
            this.numPartitions = numPartitions;
            this.partitioner = partitioner;
            this.partitions = new ArrayList<>();
            for (int i = 0; i < numPartitions; i++) {
                partitions.add(new ArrayList<>());
            }
        }

        void send(String key, String value) {
            int p = partitioner.partition(key, numPartitions);
            partitions.get(p).add(key + ":" + value);
            String label = (partitioner instanceof VipPartitioner)
                ? (key.startsWith("VIP-") ? " (VIP)" : " (обычный)")
                : "";
            System.out.println("key=\\"" + key + "\\" -> Partition " + p + label);
        }

        void printPartitions() {
            for (int i = 0; i < numPartitions; i++) {
                String label = (partitioner instanceof VipPartitioner && i == 0)
                    ? " (VIP)" : "";
                System.out.println("Partition " + i + label + ": " + partitions.get(i));
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Default Partitioner ===");
        Topic topic1 = new Topic("orders", 3, new DefaultPartitioner());
        topic1.send("user-1", "Обычный заказ");
        topic1.send("user-2", "Заказ стандарт");
        topic1.send("VIP-1", "Заказ VIP");
        topic1.send("user-3", "Ещё заказ");

        System.out.println("\\n=== VIP Partitioner ===");
        Topic topic2 = new Topic("orders", 3, new VipPartitioner());
        topic2.send("user-1", "Обычный заказ");
        topic2.send("VIP-1", "Заказ VIP");
        topic2.send("VIP-2", "Премиум");
        topic2.send("user-2", "Заказ стандарт");
        topic2.send("VIP-3", "Экспресс");
        topic2.send("user-3", "Ещё заказ");

        System.out.println();
        topic2.printPartitions();
    }
}`,
      explanation: 'Custom Partitioner позволяет контролировать распределение сообщений. VIP-клиенты попадают в выделенную партицию 0, которую можно обрабатывать приоритетным consumer-ом. В production это используется для приоритетной обработки, geo-routing или изоляции клиентов.'
    }
  ]
}
