export default {
  id: 12,
  title: 'Мониторинг и операции',
  description: 'Мониторинг Kafka и RabbitMQ: метрики, алерты, consumer lag, операции кластера, troubleshooting, production best practices.',
  lessons: [
    {
      id: 1,
      title: 'Ключевые метрики Kafka',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мониторинг Kafka — критическая часть production operations. Без правильных метрик вы не узнаете о проблемах, пока они не станут аварией. Основные метрики делятся на: broker, producer, consumer и topic уровни.' },
        { type: 'heading', value: 'Broker метрики' },
        { type: 'code', language: 'java', value: '// Ключевые метрики Kafka Broker:\n//\n// 1. UnderReplicatedPartitions\n//    Партиции, где количество ISR < replication.factor\n//    Нормально: 0. Если > 0 — проблема с репликацией!\n//    Алерт: > 0 более 5 минут\n//\n// 2. ActiveControllerCount\n//    Количество контроллеров в кластере\n//    Нормально: 1. Если 0 — кластер без лидера!\n//    Алерт: != 1\n//\n// 3. OfflinePartitionsCount\n//    Партиции без лидера (недоступны для записи/чтения)\n//    Нормально: 0. Если > 0 — данные недоступны!\n//    Алерт: > 0 (КРИТИЧЕСКАЯ)\n//\n// 4. RequestsPerSec (ProduceRequests, FetchRequests)\n//    Количество запросов в секунду\n//    Тренд: рост = больше нагрузки\n//\n// 5. BytesInPerSec / BytesOutPerSec\n//    Пропускная способность в байтах\n//    Алерт: приближение к пропускной способности сети/диска' },
        { type: 'heading', value: 'Метрики диска и JVM' },
        { type: 'code', language: 'java', value: '// Метрики диска:\n//\n// LogFlushRateAndTimeMs\n//   Время записи на диск. Рост = диск перегружен\n//   Алерт: p99 > 100ms\n//\n// LogSegmentCount\n//   Количество сегментов лога\n//   Мониторинг: чрезмерный рост = проблемы с retention\n//\n// DiskUtilization\n//   Процент использования диска\n//   Алерт: > 80% (срочно), > 90% (критично!)\n//\n// JVM метрики:\n//\n// GC паузы (G1GC):\n//   g1_young_generation_time, g1_old_generation_time\n//   Алерт: GC пауза > 500ms\n//\n// Heap usage:\n//   Нормально: 50-70%. Если > 85% — risk of OOM\n//   Алерт: > 80% heap used\n//\n// Рекомендация: Kafka broker 6-8 GB heap (не больше!)' },
        { type: 'heading', value: 'Важные метрики для алертов' },
        { type: 'list', value: [
          'КРИТИЧНО: OfflinePartitionsCount > 0 (данные недоступны)',
          'КРИТИЧНО: ActiveControllerCount = 0 (кластер без лидера)',
          'ВЫСОКИЙ: UnderReplicatedPartitions > 0 (проблемы репликации)',
          'ВЫСОКИЙ: ConsumerLag растёт (consumer не успевает)',
          'СРЕДНИЙ: RequestLatency p99 > 100ms (замедление)',
          'СРЕДНИЙ: DiskUsage > 80% (заканчивается место)',
          'НИЗКИЙ: BytesInPerSec тренд вверх (растёт нагрузка)'
        ] },
        { type: 'tip', value: 'Для мониторинга Kafka используйте: JMX Exporter + Prometheus + Grafana — стандартный стек. Confluent Control Center — коммерческое решение с UI. Burrow — open source мониторинг consumer lag от LinkedIn.' }
      ]
    },
    {
      id: 2,
      title: 'Consumer Lag',
      type: 'theory',
      content: [
        { type: 'text', value: 'Consumer Lag — это разница между последним записанным offset в партиции (log-end-offset) и последним прочитанным offset consumer-ом (committed offset). Это самая важная метрика consumer-а. Растущий lag = consumer не успевает обрабатывать сообщения.' },
        { type: 'heading', value: 'Что такое Consumer Lag' },
        { type: 'code', language: 'java', value: '// Consumer Lag = Log End Offset - Consumer Committed Offset\n//\n// Партиция:\n// Offset: 0  1  2  3  4  5  6  7  8  9  10 11 12\n// Данные: [A][B][C][D][E][F][G][H][I][J][K][L][M]\n//                            ^                    ^\n//                    committed=5           log-end=12\n//                            |<--- LAG = 7 --->|\n//\n// Consumer обработал до offset 5\n// Producer записал до offset 12\n// Lag = 12 - 5 = 7 сообщений\n//\n// Если lag РАСТЁТ: consumer медленнее producer\n// Если lag СТАБИЛЬНЫЙ: consumer успевает (возможно с задержкой)\n// Если lag = 0: consumer в реальном времени\n// Если lag УМЕНЬШАЕТСЯ: consumer догоняет' },
        { type: 'heading', value: 'Причины растущего lag' },
        { type: 'code', language: 'java', value: '// Причины роста Consumer Lag:\n//\n// 1. Медленная обработка:\n//    - Тяжёлые вычисления в consumer\n//    - Медленные внешние вызовы (HTTP, DB)\n//    - Решение: оптимизация кода, кэширование, async I/O\n//\n// 2. Недостаточно consumers:\n//    - Producer: 10K msg/s\n//    - Consumer: 2K msg/s\n//    - Решение: добавить consumers в consumer group\n//\n// 3. Неравномерное распределение:\n//    - Одна партиция перегружена (hot partition)\n//    - Решение: лучший partitioning key\n//\n// 4. Consumer rebalancing:\n//    - Перераспределение партиций занимает время\n//    - Решение: session.timeout, static membership\n//\n// 5. GC паузы:\n//    - Длинные GC паузы = consumer не poll()-ит\n//    - Решение: настройка JVM, уменьшение heap' },
        { type: 'heading', value: 'Мониторинг Lag' },
        { type: 'code', language: 'java', value: '// Способы мониторинга Consumer Lag:\n//\n// 1. kafka-consumer-groups.sh (CLI):\n//    kafka-consumer-groups.sh --bootstrap-server localhost:9092 \\\n//      --group my-group --describe\n//\n//    GROUP    TOPIC    PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG\n//    my-group orders   0          1000            1500            500\n//    my-group orders   1          2000            2100            100\n//    my-group orders   2          3000            3000            0\n//\n// 2. Burrow (LinkedIn):\n//    Автоматически определяет статус consumer:\n//    - OK: lag стабильный или уменьшается\n//    - WARNING: lag медленно растёт\n//    - ERROR: lag быстро растёт\n//    - STALLED: consumer остановился\n//\n// 3. Prometheus + kafka-lag-exporter:\n//    kafka_consumer_group_lag{group="my-group", topic="orders"}\n//    Алерт: rate(lag[5m]) > 0 в течение 10 минут' },
        { type: 'warning', value: 'Consumer Lag может быть обманчив: lag=1000 для topic с 1M msg/s — это 1 секунда задержки (нормально). Lag=1000 для topic с 10 msg/s — это 100 секунд (проблема). Всегда оценивайте lag ОТНОСИТЕЛЬНО throughput.' }
      ]
    },
    {
      id: 3,
      title: 'Операции с кластером Kafka',
      type: 'theory',
      content: [
        { type: 'text', value: 'Операции с кластером Kafka — ежедневная задача ops-команды. Добавление брокеров, перебалансировка партиций, изменение retention, rolling upgrades — всё это нужно делать без даунтайма.' },
        { type: 'heading', value: 'Topic Management' },
        { type: 'code', language: 'java', value: '// Создание топика:\n// kafka-topics.sh --create --topic orders \\\n//   --bootstrap-server localhost:9092 \\\n//   --partitions 12 \\\n//   --replication-factor 3 \\\n//   --config retention.ms=604800000 \\\n//   --config min.insync.replicas=2\n//\n// Изменение конфигурации:\n// kafka-configs.sh --alter --topic orders \\\n//   --bootstrap-server localhost:9092 \\\n//   --add-config retention.ms=259200000  // 3 дня\n//\n// Увеличение партиций:\n// kafka-topics.sh --alter --topic orders \\\n//   --bootstrap-server localhost:9092 \\\n//   --partitions 24  // было 12, стало 24\n//\n// ⚠️ НЕЛЬЗЯ уменьшить количество партиций!\n// ⚠️ Увеличение партиций ЛОМАЕТ ordering по ключу\n// (сообщения с тем же ключом попадут в другую партицию)' },
        { type: 'heading', value: 'Partition Reassignment' },
        { type: 'code', language: 'java', value: '// Когда нужна перебалансировка партиций:\n// 1. Добавлен новый брокер — он пустой\n// 2. Убран брокер из кластера\n// 3. Неравномерная нагрузка (hot broker)\n// 4. Rack-aware replication\n//\n// kafka-reassign-partitions.sh:\n//\n// Шаг 1: Сгенерировать план\n// kafka-reassign-partitions.sh --generate \\\n//   --topics-to-move-json-file topics.json \\\n//   --broker-list "1,2,3,4" \\\n//   --bootstrap-server localhost:9092\n//\n// Шаг 2: Применить план\n// kafka-reassign-partitions.sh --execute \\\n//   --reassignment-json-file plan.json\n//\n// Шаг 3: Проверить прогресс\n// kafka-reassign-partitions.sh --verify \\\n//   --reassignment-json-file plan.json\n//\n// ⚠️ Перебалансировка — тяжёлая операция!\n// Копирует данные между брокерами. Ограничьте скорость:\n// --throttle 50000000  // 50 MB/s' },
        { type: 'heading', value: 'Rolling Upgrade' },
        { type: 'list', value: [
          'Обновляйте брокеры по одному (rolling upgrade)',
          'Убедитесь min.insync.replicas < replication.factor (чтобы один брокер мог быть выключен)',
          'Шаг 1: остановите брокер N',
          'Шаг 2: обновите бинарники/конфигурацию',
          'Шаг 3: запустите брокер N, подождите пока ISR восстановится',
          'Шаг 4: повторите для следующего брокера',
          'Сначала обновите inter.broker.protocol.version, затем log.message.format.version'
        ] },
        { type: 'warning', value: 'НИКОГДА не останавливайте все брокеры одновременно. НИКОГДА не уменьшайте партиции. ВСЕГДА проверяйте UnderReplicatedPartitions=0 перед обновлением следующего брокера. Используйте Controlled Shutdown (kill -TERM, не kill -9).' }
      ]
    },
    {
      id: 4,
      title: 'Production Best Practices',
      type: 'theory',
      content: [
        { type: 'text', value: 'Production deployment Kafka требует тщательной настройки. Ошибки в конфигурации приводят к потере данных, даунтайму или деградации производительности. Эти best practices основаны на опыте крупных компаний.' },
        { type: 'heading', value: 'Конфигурация Broker' },
        { type: 'code', language: 'java', value: '// Production конфигурация Kafka Broker:\n//\n// Надёжность:\n// default.replication.factor=3       // минимум 3 реплики\n// min.insync.replicas=2              // минимум 2 ISR для подтверждения\n// unclean.leader.election.enable=false // НЕ выбирать out-of-sync реплику\n//\n// Производительность:\n// num.io.threads=16                  // threads для I/O (= кол-во дисков * 2)\n// num.network.threads=8              // threads для сети\n// socket.send.buffer.bytes=1048576   // 1MB send buffer\n// socket.receive.buffer.bytes=1048576 // 1MB receive buffer\n// num.partitions=12                  // default партиции для нового topic\n//\n// Хранение:\n// log.retention.hours=168            // 7 дней retention\n// log.segment.bytes=1073741824       // 1GB segment\n// log.retention.check.interval.ms=300000 // проверка каждые 5 мин\n// log.dirs=/data/kafka1,/data/kafka2  // JBOD (несколько дисков)' },
        { type: 'heading', value: 'Конфигурация Producer/Consumer' },
        { type: 'code', language: 'java', value: '// Producer (надёжный):\n// acks=all                    // ждём подтверждение от всех ISR\n// retries=Integer.MAX_VALUE   // бесконечные retry\n// max.in.flight.requests.per.connection=5 // с idempotence\n// enable.idempotence=true     // дедупликация на broker\n// compression.type=lz4        // компрессия (экономия сети и диска)\n// linger.ms=5                 // batch-ить 5ms (throughput vs latency)\n// batch.size=65536            // 64KB batch\n\n// Consumer (надёжный):\n// enable.auto.commit=false    // manual commit!\n// auto.offset.reset=earliest  // читать с начала при первом запуске\n// max.poll.records=500        // максимум за один poll()\n// max.poll.interval.ms=300000 // 5 мин на обработку batch\n// session.timeout.ms=45000    // таймаут heartbeat\n// heartbeat.interval.ms=15000 // heartbeat каждые 15 сек\n// isolation.level=read_committed // если используются транзакции' },
        { type: 'heading', value: 'Sizing и Hardware' },
        { type: 'list', value: [
          'Партиции: начните с partitions = throughput / consumer_throughput',
          'Правило: до 4000 партиций на брокер, до 200K на кластер',
          'Реплики: ВСЕГДА 3 (replication.factor=3, min.insync.replicas=2)',
          'Диски: SSD для production (HDD только для cold storage)',
          'RAM: 64GB+ (OS page cache — главный фактор производительности)',
          'Heap: 6-8GB для брокера (больше = длинные GC паузы)',
          'Сеть: 10 Gbps между брокерами (replication трафик)'
        ] },
        { type: 'tip', value: 'Kafka хранит данные на диске и использует OS page cache для чтения. Чем больше RAM — тем больше данных в кэше — тем быстрее чтение. 64GB RAM с 6GB heap = 58GB page cache. Это важнее, чем мощный CPU.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Мониторинг Consumer Lag',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему мониторинга Consumer Lag: отслеживание offset-ов, расчёт lag, определение статуса consumer (OK/WARNING/ERROR), алерты.',
      requirements: [
        'Класс TopicPartition с log-end-offset (записи producer)',
        'Класс ConsumerGroup с committed offsets',
        'Расчёт lag для каждой партиции и суммарный lag',
        'Определение статуса: OK (lag=0), WARNING (lag < 1000), ERROR (lag >= 1000)',
        'Симуляция: producer пишет быстрее, чем consumer читает',
        'Вывести dashboard со всеми метриками'
      ],
      hint: 'TopicPartition хранит logEndOffset. ConsumerGroup хранит Map<Integer, Long> committedOffsets. Lag = logEndOffset - committedOffset.',
      expectedOutput: '=== Consumer Lag Monitor ===\n\nТопик: orders (3 партиции)\n\nProducer записал:\n  partition-0: 5000 сообщений\n  partition-1: 3000 сообщений\n  partition-2: 7000 сообщений\n\nConsumer Group "order-processor":\n  partition-0: committed=4500, lag=500  [WARNING]\n  partition-1: committed=3000, lag=0    [OK]\n  partition-2: committed=5000, lag=2000 [ERROR]\n\nСуммарный lag: 2500\nОбщий статус: ERROR\n\nАлерт: partition-2 lag=2000 превышает порог 1000!\nРекомендация: Добавьте consumer в группу или оптимизируйте обработку.',
      solution: `import java.util.*;

public class Main {
    static class TopicPartition {
        int id;
        long logEndOffset;

        TopicPartition(int id, long logEndOffset) {
            this.id = id;
            this.logEndOffset = logEndOffset;
        }
    }

    static class ConsumerGroup {
        String name;
        Map<Integer, Long> committedOffsets = new LinkedHashMap<>();

        ConsumerGroup(String name) {
            this.name = name;
        }

        void commitOffset(int partition, long offset) {
            committedOffsets.put(partition, offset);
        }
    }

    static String getStatus(long lag) {
        if (lag == 0) return "OK";
        if (lag < 1000) return "WARNING";
        return "ERROR";
    }

    public static void main(String[] args) {
        System.out.println("=== Consumer Lag Monitor ===\\n");

        String topicName = "orders";
        List<TopicPartition> partitions = List.of(
            new TopicPartition(0, 5000),
            new TopicPartition(1, 3000),
            new TopicPartition(2, 7000)
        );

        ConsumerGroup group = new ConsumerGroup("order-processor");
        group.commitOffset(0, 4500);
        group.commitOffset(1, 3000);
        group.commitOffset(2, 5000);

        System.out.println("Топик: " + topicName + " (" + partitions.size() + " партиции)\\n");

        System.out.println("Producer записал:");
        for (TopicPartition tp : partitions) {
            System.out.println("  partition-" + tp.id + ": " + tp.logEndOffset + " сообщений");
        }

        System.out.println("\\nConsumer Group \\"" + group.name + "\\":");
        long totalLag = 0;
        String worstStatus = "OK";
        List<String> alerts = new ArrayList<>();

        for (TopicPartition tp : partitions) {
            long committed = group.committedOffsets.getOrDefault(tp.id, 0L);
            long lag = tp.logEndOffset - committed;
            totalLag += lag;
            String status = getStatus(lag);

            if (status.equals("ERROR")) worstStatus = "ERROR";
            else if (status.equals("WARNING") && !worstStatus.equals("ERROR"))
                worstStatus = "WARNING";

            System.out.println("  partition-" + tp.id + ": committed=" + committed
                + ", lag=" + lag + "  [" + status + "]");

            if (lag >= 1000) {
                alerts.add("partition-" + tp.id + " lag=" + lag + " превышает порог 1000!");
            }
        }

        System.out.println("\\nСуммарный lag: " + totalLag);
        System.out.println("Общий статус: " + worstStatus);

        if (!alerts.isEmpty()) {
            System.out.println();
            for (String alert : alerts) {
                System.out.println("Алерт: " + alert);
            }
            System.out.println("Рекомендация: Добавьте consumer в группу или оптимизируйте обработку.");
        }
    }
}`,
      explanation: 'Consumer Lag = logEndOffset - committedOffset для каждой партиции. Статус определяется пороговыми значениями: OK (0), WARNING (<1000), ERROR (>=1000). В production используйте Burrow или kafka-lag-exporter для автоматического мониторинга. Алерты по lag — первый сигнал о проблемах с обработкой. Решения: добавить consumers, оптимизировать обработку, увеличить партиции.'
    },
    {
      id: 6,
      title: 'Практика: Health Check система',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему Health Check для кластера Kafka: проверка состояния брокеров, партиций, consumer groups и генерация отчёта.',
      requirements: [
        'Класс KafkaBroker с метриками (cpu, memory, disk, status)',
        'Класс ClusterHealth — проверяет здоровье всего кластера',
        'Проверки: offline брокеры, under-replicated партиции, consumer lag',
        'Статус: HEALTHY, DEGRADED, CRITICAL',
        'Генерация отчёта с рекомендациями',
        'Показать здоровый и деградированный кластер'
      ],
      hint: 'Каждый KafkaBroker имеет status (online/offline), метрики (cpu%, disk%, memory%). ClusterHealth проверяет все брокеры и партиции, определяет наихудший статус.',
      expectedOutput: '=== Kafka Cluster Health Check ===\n\n--- Кластер: production ---\nБрокеры: 3\n\nBroker-1: ONLINE  cpu=45% mem=62% disk=55%\nBroker-2: ONLINE  cpu=38% mem=58% disk=60%\nBroker-3: ONLINE  cpu=50% mem=70% disk=72%\n\nПартиции:\n  Всего: 36\n  Online: 36\n  Under-replicated: 0\n  Offline: 0\n\nКластер: HEALTHY\n\n--- Кластер: staging (проблемы) ---\nБрокеры: 3\n\nBroker-1: ONLINE  cpu=85% mem=90% disk=88%  [!CPU] [!MEM] [!DISK]\nBroker-2: OFFLINE\nBroker-3: ONLINE  cpu=60% mem=65% disk=70%\n\nПартиции:\n  Всего: 24\n  Online: 20\n  Under-replicated: 4\n  Offline: 0\n\nКластер: CRITICAL\n\nПроблемы:\n  [CRITICAL] Broker-2 OFFLINE\n  [WARNING] Broker-1 CPU=85% (порог: 80%)\n  [WARNING] Broker-1 Memory=90% (порог: 85%)\n  [WARNING] Broker-1 Disk=88% (порог: 80%)\n  [WARNING] 4 under-replicated партиций\n\nРекомендации:\n  - Восстановите Broker-2 (OFFLINE)\n  - Проверьте нагрузку на Broker-1\n  - Проверьте дисковое пространство на Broker-1',
      solution: `import java.util.*;

public class Main {
    static class KafkaBroker {
        String name;
        boolean online;
        int cpu, memory, disk;

        KafkaBroker(String name, boolean online, int cpu, int memory, int disk) {
            this.name = name;
            this.online = online;
            this.cpu = cpu;
            this.memory = memory;
            this.disk = disk;
        }
    }

    static void checkCluster(String clusterName, List<KafkaBroker> brokers,
                              int totalPartitions, int underReplicated, int offline) {
        System.out.println("--- Кластер: " + clusterName + " ---");
        System.out.println("Брокеры: " + brokers.size() + "\\n");

        List<String> problems = new ArrayList<>();
        List<String> recommendations = new ArrayList<>();

        for (KafkaBroker b : brokers) {
            if (!b.online) {
                System.out.println(b.name + ": OFFLINE");
                problems.add("[CRITICAL] " + b.name + " OFFLINE");
                recommendations.add("Восстановите " + b.name + " (OFFLINE)");
            } else {
                StringBuilder flags = new StringBuilder();
                if (b.cpu > 80) {
                    flags.append("  [!CPU]");
                    problems.add("[WARNING] " + b.name + " CPU=" + b.cpu + "% (порог: 80%)");
                }
                if (b.memory > 85) {
                    flags.append("  [!MEM]");
                    problems.add("[WARNING] " + b.name + " Memory=" + b.memory + "% (порог: 85%)");
                }
                if (b.disk > 80) {
                    flags.append("  [!DISK]");
                    problems.add("[WARNING] " + b.name + " Disk=" + b.disk + "% (порог: 80%)");
                }
                System.out.println(b.name + ": ONLINE  cpu=" + b.cpu + "% mem="
                    + b.memory + "% disk=" + b.disk + "%" + flags);
                if (b.cpu > 80 || b.memory > 85)
                    recommendations.add("Проверьте нагрузку на " + b.name);
                if (b.disk > 80)
                    recommendations.add("Проверьте дисковое пространство на " + b.name);
            }
        }

        if (underReplicated > 0) {
            problems.add("[WARNING] " + underReplicated + " under-replicated партиций");
        }

        int onlinePartitions = totalPartitions - offline;
        System.out.println("\\nПартиции:");
        System.out.println("  Всего: " + totalPartitions);
        System.out.println("  Online: " + onlinePartitions);
        System.out.println("  Under-replicated: " + underReplicated);
        System.out.println("  Offline: " + offline);

        String status;
        boolean hasOfflineBroker = brokers.stream().anyMatch(b -> !b.online);
        if (hasOfflineBroker || offline > 0) status = "CRITICAL";
        else if (underReplicated > 0 || !problems.isEmpty()) status = "DEGRADED";
        else status = "HEALTHY";

        // Fix: if there's an offline broker, it's CRITICAL even if no offline partitions
        if (hasOfflineBroker) status = "CRITICAL";

        System.out.println("\\nКластер: " + status);

        if (!problems.isEmpty()) {
            System.out.println("\\nПроблемы:");
            for (String p : problems) System.out.println("  " + p);

            System.out.println("\\nРекомендации:");
            for (String r : recommendations) System.out.println("  - " + r);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Kafka Cluster Health Check ===\\n");

        // Здоровый кластер
        checkCluster("production", List.of(
            new KafkaBroker("Broker-1", true, 45, 62, 55),
            new KafkaBroker("Broker-2", true, 38, 58, 60),
            new KafkaBroker("Broker-3", true, 50, 70, 72)
        ), 36, 0, 0);

        System.out.println();

        // Проблемный кластер
        checkCluster("staging (проблемы)", List.of(
            new KafkaBroker("Broker-1", true, 85, 90, 88),
            new KafkaBroker("Broker-2", false, 0, 0, 0),
            new KafkaBroker("Broker-3", true, 60, 65, 70)
        ), 24, 4, 0);
    }
}`,
      explanation: 'Health Check система проверяет все компоненты кластера: статус брокеров, метрики ресурсов (CPU, memory, disk), состояние партиций (online, under-replicated, offline). Статус определяется по наихудшему показателю: HEALTHY -> DEGRADED -> CRITICAL. В production используйте Prometheus + Grafana для визуализации и PagerDuty/OpsGenie для алертов.'
    }
  ]
}
