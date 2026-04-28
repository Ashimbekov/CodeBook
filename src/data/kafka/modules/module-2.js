export default {
  id: 2,
  title: 'Apache Kafka: основы',
  description: 'Архитектура Kafka: брокеры, топики, партиции, offset, ZooKeeper/KRaft, запись и чтение данных.',
  lessons: [
    {
      id: 1,
      title: 'Архитектура Apache Kafka',
      type: 'theory',
      content: [
        { type: 'text', value: 'Apache Kafka — распределённая платформа потоковой обработки данных. Создана в LinkedIn в 2011 году для обработки триллионов сообщений в день. Kafka — не просто очередь, а распределённый лог (commit log).' },
        { type: 'heading', value: 'Основные компоненты Kafka' },
        { type: 'code', language: 'java', value: '// Архитектура Kafka кластера:\n//\n// Producer ---> [Kafka Cluster] ---> Consumer\n//               ┌─────────────┐\n//               │  Broker 1    │\n//               │  Topic A: P0 │\n//               │  Topic B: P1 │\n//               ├─────────────┤\n//               │  Broker 2    │\n//               │  Topic A: P1 │\n//               │  Topic B: P0 │\n//               ├─────────────┤\n//               │  Broker 3    │\n//               │  Topic A: P2 │\n//               │  Topic B: P2 │\n//               └─────────────┘\n//               │  ZooKeeper / KRaft  │\n//               └─────────────────────┘\n\n// Kafka Broker — сервер, который хранит данные\n// Topic — именованный поток сообщений (аналог таблицы в БД)\n// Partition — часть топика (для параллелизма)\n// Offset — порядковый номер сообщения в партиции\n// Consumer Group — группа consumers для параллельной обработки' },
        { type: 'heading', value: 'Kafka Broker' },
        { type: 'text', value: 'Broker — это сервер Kafka. Кластер обычно состоит из 3-5 брокеров. Каждый брокер хранит часть данных (партиции). Если один брокер падает, остальные продолжают работу благодаря репликации.' },
        { type: 'heading', value: 'ZooKeeper vs KRaft' },
        { type: 'text', value: 'Исторически Kafka использовала ZooKeeper для координации брокеров. С версии 3.3 ZooKeeper заменяется на KRaft (Kafka Raft) — встроенный механизм координации. KRaft упрощает эксплуатацию и уменьшает количество компонентов.' },
        { type: 'list', value: [
          'Broker — сервер Kafka, хранит данные, обрабатывает запросы',
          'Cluster — группа из нескольких брокеров для отказоустойчивости',
          'Controller — один из брокеров, отвечает за назначение leader-ов',
          'ZooKeeper (legacy) — внешний сервис координации кластера',
          'KRaft (новый) — встроенный consensus, заменяет ZooKeeper'
        ] },
        { type: 'tip', value: 'Для production рекомендуется минимум 3 брокера с replication factor 3. Это позволяет потерять 1 брокер без потери данных. Netflix использует кластеры из сотен брокеров.' }
      ]
    },
    {
      id: 2,
      title: 'Topics и Partitions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Topic (топик) — это именованный канал для сообщений, аналог таблицы в базе данных. Partition (партиция) — это часть топика, обеспечивающая параллелизм. Каждая партиция — это упорядоченная последовательность сообщений.' },
        { type: 'heading', value: 'Что такое Topic?' },
        { type: 'text', value: 'Топик группирует связанные сообщения. Например: orders — для событий заказов, payments — для платежей, user-events — для действий пользователей. Имя топика — строка, по которой producer и consumer находят друг друга.' },
        { type: 'heading', value: 'Что такое Partition?' },
        { type: 'code', language: 'java', value: '// Topic "orders" с 3 партициями:\n//\n// Partition 0: [msg0, msg3, msg6, msg9 ...]  -> Consumer 1\n// Partition 1: [msg1, msg4, msg7, msg10...]  -> Consumer 2\n// Partition 2: [msg2, msg5, msg8, msg11...]  -> Consumer 3\n//\n// Каждая партиция:\n// 1. Хранится на одном брокере (+ реплики на других)\n// 2. Имеет строгий порядок сообщений\n// 3. Обрабатывается ровно одним consumer в группе\n// 4. Является единицей параллелизма\n\n// Сколько партиций создавать?\n// Правило: partitions >= max consumers в группе\n// 3 партиции = максимум 3 consumer-а параллельно\n// 12 партиций = можно масштабировать до 12 consumer-ов' },
        { type: 'heading', value: 'Распределение сообщений по партициям' },
        { type: 'code', language: 'java', value: '// Как Kafka распределяет сообщения по партициям:\n\n// 1. Без ключа — Round Robin (по очереди)\n// send("orders", null, "Заказ 1") -> Partition 0\n// send("orders", null, "Заказ 2") -> Partition 1\n// send("orders", null, "Заказ 3") -> Partition 2\n// send("orders", null, "Заказ 4") -> Partition 0\n\n// 2. С ключом — hash(key) % numPartitions\n// send("orders", "user-1", "Заказ A") -> hash("user-1") % 3 = 1 -> Partition 1\n// send("orders", "user-1", "Заказ B") -> hash("user-1") % 3 = 1 -> Partition 1\n// send("orders", "user-2", "Заказ C") -> hash("user-2") % 3 = 0 -> Partition 0\n\n// Все сообщения с одним ключом ВСЕГДА попадают в одну партицию!\n// Это гарантирует порядок для конкретного пользователя/заказа' },
        { type: 'warning', value: 'Kafka гарантирует порядок сообщений ТОЛЬКО в рамках одной партиции. Если нужен глобальный порядок — создайте топик с 1 партицией (но потеряете параллелизм). Для большинства задач порядок по ключу (userId, orderId) достаточен.' },
        { type: 'tip', value: 'Количество партиций можно увеличить, но нельзя уменьшить! Начинайте с разумного числа (6-12 для средней нагрузки). Uber использует топики с сотнями партиций для обработки поездок.' }
      ]
    },
    {
      id: 3,
      title: 'Offset и хранение сообщений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Offset — это уникальный порядковый номер сообщения в партиции. Каждое новое сообщение получает следующий offset. Offset — ключевая концепция Kafka, позволяющая consumer-ам отслеживать прогресс чтения.' },
        { type: 'heading', value: 'Как работает Offset' },
        { type: 'code', language: 'java', value: '// Партиция — это append-only лог (журнал)\n// Новые сообщения добавляются в конец\n//\n// Partition 0:\n// Offset: 0    1    2    3    4    5    6    7\n// Data:  [A]  [B]  [C]  [D]  [E]  [F]  [G]  [H]\n//                        ^\n//                   current offset consumer-а\n//\n// Consumer читает с offset 3 (сообщение D)\n// После обработки D — commit offset 4\n// При рестарте — продолжит с offset 4 (сообщение E)\n\n// Три важных offset-а:\n// 1. Log End Offset — номер следующего сообщения (сколько всего записано)\n// 2. Current Offset — текущая позиция consumer-а\n// 3. Committed Offset — последний подтверждённый offset (сохранён в Kafka)' },
        { type: 'heading', value: 'Consumer Lag' },
        { type: 'text', value: 'Consumer Lag — разница между Log End Offset и Current Offset. Если lag растёт, consumer не успевает обрабатывать сообщения. Это главная метрика для мониторинга.' },
        { type: 'code', language: 'java', value: '// Consumer Lag — индикатор отставания\n//\n// Log End Offset:    1000  (записано 1000 сообщений)\n// Current Offset:     950  (consumer прочитал 950)\n// Committed Offset:   940  (подтверждено 940)\n// Consumer Lag:        50  (отстаёт на 50 сообщений)\n//\n// Lag = 0    -> consumer успевает, всё хорошо\n// Lag = 100  -> небольшое отставание, норма при пиках\n// Lag = 10K  -> проблема! Consumer не справляется\n// Lag растёт -> нужно добавлять consumers или оптимизировать обработку' },
        { type: 'heading', value: 'Retention — хранение сообщений' },
        { type: 'text', value: 'В отличие от RabbitMQ, Kafka НЕ удаляет сообщения после прочтения. Сообщения хранятся в соответствии с retention policy: по времени (7 дней по умолчанию) или по размеру (например, 100 GB).' },
        { type: 'list', value: [
          'retention.ms — время хранения (по умолчанию 7 дней = 604800000 ms)',
          'retention.bytes — максимальный размер партиции',
          'cleanup.policy=delete — удаление старых сегментов',
          'cleanup.policy=compact — хранение только последнего значения для каждого ключа',
          'Compacted топики идеальны для хранения состояния (таблица пользователей)'
        ] },
        { type: 'tip', value: 'Log compaction — мощная фича Kafka. Для топика user-profiles с compact policy Kafka хранит ТОЛЬКО последнюю версию профиля каждого пользователя. Это работает как key-value store на базе лога.' }
      ]
    },
    {
      id: 4,
      title: 'Репликация и отказоустойчивость',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kafka обеспечивает отказоустойчивость через репликацию. Каждая партиция имеет leader (обрабатывает все операции чтения/записи) и несколько follower-ов (хранят копии данных). Если leader падает, один из follower-ов автоматически становится новым leader-ом.' },
        { type: 'heading', value: 'Leader и Followers' },
        { type: 'code', language: 'java', value: '// Топик "orders" с 3 партициями и replication factor = 3\n// Каждая партиция имеет 1 leader и 2 followers\n//\n// Broker 1:    Broker 2:    Broker 3:\n// P0 (leader)  P0 (follower) P0 (follower)\n// P1 (follower) P1 (leader)  P1 (follower)\n// P2 (follower) P2 (follower) P2 (leader)\n//\n// Все операции чтения/записи идут через leader!\n// Followers только копируют данные от leader-а\n//\n// Если Broker 2 упал:\n// P1: follower на Broker 1 или Broker 3 становится leader-ом\n// Кластер продолжает работу!' },
        { type: 'heading', value: 'ISR — In-Sync Replicas' },
        { type: 'text', value: 'ISR — набор реплик, которые синхронизированы с leader-ом. Если follower отстаёт слишком сильно, он исключается из ISR. Новый leader выбирается только из ISR — это гарантирует, что данные не потеряются.' },
        { type: 'code', language: 'java', value: '// ISR (In-Sync Replicas) — ключ к надёжности\n//\n// Partition 0: Leader=Broker1, ISR=[Broker1, Broker2, Broker3]\n//\n// Сценарий: Broker3 отстал (сетевые проблемы)\n// ISR = [Broker1, Broker2]  (Broker3 исключён из ISR)\n//\n// Сценарий: Broker1 (leader) упал\n// Новый leader выбирается из ISR = [Broker2]\n// Broker2 становится leader-ом\n// Ни одно сообщение не потеряно (Broker2 был в синхронизации)\n//\n// min.insync.replicas = 2\n// Kafka принимает запись только если в ISR >= 2 реплики\n// Это защищает от потери данных при сбоях' },
        { type: 'heading', value: 'Настройки репликации' },
        { type: 'list', value: [
          'replication.factor=3 — 3 копии каждой партиции (стандарт для production)',
          'min.insync.replicas=2 — запись принимается только если 2+ реплики синхронизированы',
          'unclean.leader.election.enable=false — запрет выбора не синхронизированного leader-а',
          'acks=all (producer) — ждать подтверждения от всех ISR реплик',
          'При replication.factor=3 и min.insync.replicas=2 можно потерять 1 брокер'
        ] },
        { type: 'warning', value: 'Если min.insync.replicas=2 и в ISR осталась только 1 реплика — Kafka перестанет принимать записи (NotEnoughReplicasException). Это лучше, чем потеря данных! Для критичных данных (финансы) всегда используйте replication.factor=3 и min.insync.replicas=2.' }
      ]
    },
    {
      id: 5,
      title: 'Запись и чтение данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Понимание того, как Kafka записывает и читает данные на низком уровне, помогает оптимизировать производительность. Kafka достигает миллионов операций в секунду благодаря последовательной записи на диск и zero-copy передаче данных.' },
        { type: 'heading', value: 'Процесс записи (Produce)' },
        { type: 'code', language: 'java', value: '// Шаги записи сообщения в Kafka:\n//\n// 1. Producer определяет партицию\n//    - Если есть key: partition = hash(key) % numPartitions\n//    - Без key: Round Robin / Sticky Partitioner\n//\n// 2. Producer отправляет batch сообщений лидеру партиции\n//    - Сообщения группируются в batch для эффективности\n//    - linger.ms — ждать до N мс для заполнения batch\n//    - batch.size — максимальный размер batch\n//\n// 3. Leader записывает batch в commit log (файл на диске)\n//    - Последовательная запись — быстрее random I/O в 100 раз!\n//    - Страничный кэш ОС — данные сначала в памяти\n//\n// 4. Followers копируют данные от Leader-а\n//\n// 5. Leader отправляет ACK producer-у\n//    - acks=0: без ожидания (может потерять данные)\n//    - acks=1: ждёт только leader (может потерять при crash)\n//    - acks=all: ждёт все ISR (максимальная надёжность)' },
        { type: 'heading', value: 'Процесс чтения (Consume)' },
        { type: 'code', language: 'java', value: '// Шаги чтения сообщений из Kafka:\n//\n// 1. Consumer подключается к кластеру и присоединяется к группе\n//    - Consumer group coordinator назначает партиции\n//\n// 2. Consumer отправляет fetch запрос leader-у партиции\n//    - fetch.min.bytes — минимальный размер ответа\n//    - fetch.max.wait.ms — максимальное ожидание\n//    - max.poll.records — макс. записей за один poll\n//\n// 3. Leader отдаёт данные через zero-copy\n//    - sendfile() — данные идут с диска прямо в сеть\n//    - Не копируются в память JVM!\n//\n// 4. Consumer обрабатывает сообщения\n//\n// 5. Consumer коммитит offset\n//    - auto.commit — каждые 5 секунд (по умолчанию)\n//    - manual commit — после успешной обработки\n//    - Offset хранится в специальном топике __consumer_offsets' },
        { type: 'heading', value: 'Почему Kafka такая быстрая?' },
        { type: 'list', value: [
          'Sequential I/O — последовательная запись на диск (600 MB/s vs 100 KB/s random)',
          'Page Cache — используется кэш операционной системы вместо JVM heap',
          'Zero-Copy — данные передаются с диска в сеть без копирования в память',
          'Batching — сообщения группируются для уменьшения overhead-а',
          'Compression — gzip, snappy, lz4, zstd сжимают batches',
          'Partitioning — параллельная обработка через партиции'
        ] },
        { type: 'note', value: 'LinkedIn обрабатывает 7 триллионов сообщений в день через Kafka. Это возможно благодаря архитектуре: append-only лог + sequential I/O + zero-copy + batching. Даже обычный SSD сервер может обрабатывать 500K+ сообщений в секунду.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Модель Kafka топика',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте модель Kafka топика с партициями, offset-ами и распределением сообщений по ключу.',
      requirements: [
        'Класс KafkaTopic с именем и массивом партиций',
        'Класс Partition — хранит список сообщений и текущий offset',
        'Класс Message — key, value, offset, timestamp',
        'Метод send(key, value) — отправляет сообщение в партицию по hash(key)',
        'Если key=null, используйте Round Robin',
        'Выведите содержимое каждой партиции с offset-ами'
      ],
      hint: 'Для выбора партиции по ключу: Math.abs(key.hashCode()) % numPartitions. Храните roundRobinCounter для сообщений без ключа.',
      expectedOutput: 'Создан топик "orders" с 3 партициями\n\nОтправка сообщений:\nsend(key="user-1", value="Заказ A") -> Partition 1, Offset 0\nsend(key="user-1", value="Заказ B") -> Partition 1, Offset 1\nsend(key="user-2", value="Заказ C") -> Partition 0, Offset 0\nsend(key=null, value="Заказ D")     -> Partition 0, Offset 1\nsend(key=null, value="Заказ E")     -> Partition 1, Offset 2\nsend(key="user-3", value="Заказ F") -> Partition 2, Offset 0\n\nСодержимое топика:\n--- Partition 0 ---\n  Offset 0: key=user-2, value=Заказ C\n  Offset 1: key=null, value=Заказ D\n--- Partition 1 ---\n  Offset 0: key=user-1, value=Заказ A\n  Offset 1: key=user-1, value=Заказ B\n  Offset 2: key=null, value=Заказ E\n--- Partition 2 ---\n  Offset 0: key=user-3, value=Заказ F',
      solution: `import java.util.*;

public class Main {
    static class Message {
        String key;
        String value;
        long offset;
        long timestamp;

        Message(String key, String value, long offset) {
            this.key = key;
            this.value = value;
            this.offset = offset;
            this.timestamp = System.currentTimeMillis();
        }
    }

    static class Partition {
        int id;
        List<Message> messages = new ArrayList<>();
        long nextOffset = 0;

        Partition(int id) { this.id = id; }

        long append(String key, String value) {
            long offset = nextOffset++;
            messages.add(new Message(key, value, offset));
            return offset;
        }
    }

    static class KafkaTopic {
        String name;
        Partition[] partitions;
        int roundRobin = 0;

        KafkaTopic(String name, int numPartitions) {
            this.name = name;
            this.partitions = new Partition[numPartitions];
            for (int i = 0; i < numPartitions; i++) {
                partitions[i] = new Partition(i);
            }
        }

        void send(String key, String value) {
            int partitionId;
            if (key != null) {
                partitionId = Math.abs(key.hashCode()) % partitions.length;
            } else {
                partitionId = roundRobin++ % partitions.length;
            }
            long offset = partitions[partitionId].append(key, value);
            System.out.println("send(key=\\"" + key + "\\", value=\\"" + value
                + "\\") -> Partition " + partitionId + ", Offset " + offset);
        }

        void printContents() {
            System.out.println("\\nСодержимое топика:");
            for (Partition p : partitions) {
                System.out.println("--- Partition " + p.id + " ---");
                for (Message m : p.messages) {
                    System.out.println("  Offset " + m.offset
                        + ": key=" + m.key + ", value=" + m.value);
                }
            }
        }
    }

    public static void main(String[] args) {
        KafkaTopic topic = new KafkaTopic("orders", 3);
        System.out.println("Создан топик \\"orders\\" с 3 партициями\\n");
        System.out.println("Отправка сообщений:");

        topic.send("user-1", "Заказ A");
        topic.send("user-1", "Заказ B");
        topic.send("user-2", "Заказ C");
        topic.send(null, "Заказ D");
        topic.send(null, "Заказ E");
        topic.send("user-3", "Заказ F");

        topic.printContents();
    }
}`,
      explanation: 'Мы воспроизвели ключевые механизмы Kafka: партиционирование по hash(key), Round Robin для сообщений без ключа, offset как порядковый номер. Все сообщения с одним ключом попадают в одну партицию — это гарантирует порядок для конкретного ключа.'
    },
    {
      id: 7,
      title: 'Практика: Репликация партиций',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте механизм репликации партиций с leader/follower и автоматическим failover.',
      requirements: [
        'Класс ReplicatedPartition с leader и списком followers',
        'Метод write(message) — записывает в leader, затем реплицирует в followers',
        'Метод failover() — при падении leader-а выбирает нового из ISR',
        'ISR — список синхронизированных реплик',
        'Покажите сценарий: запись -> failover -> продолжение записи'
      ],
      hint: 'Каждый follower хранит свой набор данных. ISR — followers, у которых данные совпадают с leader. При failover первый follower из ISR становится leader.',
      expectedOutput: 'Создана партиция с replication factor = 3\nLeader: Broker-1, Followers: [Broker-2, Broker-3]\nISR: [Broker-1, Broker-2, Broker-3]\n\nЗапись "Сообщение A" -> Leader(Broker-1) OK\n  Реплицировано в Broker-2 OK\n  Реплицировано в Broker-3 OK\n\nЗапись "Сообщение B" -> Leader(Broker-1) OK\n  Реплицировано в Broker-2 OK\n  Реплицировано в Broker-3 OK\n\n--- Broker-1 (leader) упал! ---\nISR до failover: [Broker-1, Broker-2, Broker-3]\nНовый leader: Broker-2\nISR после failover: [Broker-2, Broker-3]\n\nЗапись "Сообщение C" -> Leader(Broker-2) OK\n  Реплицировано в Broker-3 OK\n\nДанные Leader (Broker-2): [Сообщение A, Сообщение B, Сообщение C]\nДанные Follower (Broker-3): [Сообщение A, Сообщение B, Сообщение C]',
      solution: `import java.util.*;

public class Main {
    static class Broker {
        String name;
        List<String> data = new ArrayList<>();
        boolean alive = true;

        Broker(String name) { this.name = name; }

        boolean write(String message) {
            if (!alive) return false;
            data.add(message);
            return true;
        }
    }

    static class ReplicatedPartition {
        Broker leader;
        List<Broker> followers;
        List<Broker> isr; // In-Sync Replicas

        ReplicatedPartition(Broker leader, List<Broker> followers) {
            this.leader = leader;
            this.followers = new ArrayList<>(followers);
            this.isr = new ArrayList<>();
            this.isr.add(leader);
            this.isr.addAll(followers);
        }

        boolean write(String message) {
            if (!leader.alive) {
                System.out.println("ОШИБКА: Leader " + leader.name + " недоступен!");
                return false;
            }
            leader.write(message);
            System.out.println("Запись \\"" + message + "\\" -> Leader(" + leader.name + ") OK");

            for (Broker follower : followers) {
                if (follower.alive) {
                    follower.write(message);
                    System.out.println("  Реплицировано в " + follower.name + " OK");
                } else {
                    isr.remove(follower);
                    System.out.println("  " + follower.name + " недоступен, исключён из ISR");
                }
            }
            return true;
        }

        void failover() {
            System.out.println("\\n--- " + leader.name + " (leader) упал! ---");
            leader.alive = false;
            System.out.print("ISR до failover: [");
            System.out.print(String.join(", ", isr.stream().map(b -> b.name).toArray(String[]::new)));
            System.out.println("]");

            isr.remove(leader);
            followers.remove(leader);

            if (!isr.isEmpty()) {
                leader = isr.get(0);
                followers = new ArrayList<>(isr.subList(1, isr.size()));
                System.out.println("Новый leader: " + leader.name);
            } else {
                System.out.println("КРИТИЧЕСКАЯ ОШИБКА: нет доступных реплик!");
            }

            System.out.print("ISR после failover: [");
            System.out.print(String.join(", ", isr.stream().map(b -> b.name).toArray(String[]::new)));
            System.out.println("]");
        }

        void printState() {
            System.out.println("\\nДанные Leader (" + leader.name + "): " + leader.data);
            for (Broker f : followers) {
                if (f.alive) {
                    System.out.println("Данные Follower (" + f.name + "): " + f.data);
                }
            }
        }
    }

    public static void main(String[] args) {
        Broker b1 = new Broker("Broker-1");
        Broker b2 = new Broker("Broker-2");
        Broker b3 = new Broker("Broker-3");

        ReplicatedPartition partition = new ReplicatedPartition(b1, Arrays.asList(b2, b3));
        System.out.println("Создана партиция с replication factor = 3");
        System.out.println("Leader: " + b1.name + ", Followers: [" + b2.name + ", " + b3.name + "]");
        System.out.print("ISR: [");
        System.out.print(String.join(", ", partition.isr.stream().map(b -> b.name).toArray(String[]::new)));
        System.out.println("]\\n");

        partition.write("Сообщение A");
        System.out.println();
        partition.write("Сообщение B");

        partition.failover();
        System.out.println();
        partition.write("Сообщение C");

        partition.printState();
    }
}`,
      explanation: 'Мы смоделировали репликацию Kafka: leader принимает записи, followers копируют данные. При сбое leader автоматический failover выбирает нового leader из ISR. Данные не теряются, потому что follower был синхронизирован. В production Kafka делает это автоматически через controller broker.'
    }
  ]
}
