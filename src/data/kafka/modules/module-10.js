export default {
  id: 10,
  title: 'Гарантии доставки',
  description: 'Семантики доставки: at-most-once, at-least-once, exactly-once. Идемпотентность, транзакции, offset management.',
  lessons: [
    {
      id: 1,
      title: 'Три семантики доставки',
      type: 'theory',
      content: [
        { type: 'text', value: 'В распределённых системах сообщение может быть потеряно, доставлено один раз или доставлено повторно. Существует три семантики доставки: at-most-once, at-least-once и exactly-once. Выбор семантики — один из важнейших архитектурных решений.' },
        { type: 'heading', value: 'At-Most-Once (не более одного раза)' },
        { type: 'code', language: 'java', value: '// At-Most-Once: сообщение может быть ПОТЕРЯНО, но НЕ дублировано\n//\n// Producer отправил -> Broker упал -> Сообщение ПОТЕРЯНО\n// Producer НЕ retry-ит. "Отправил и забыл"\n//\n// Когда использовать:\n// - Метрики, логи (потеря одной точки данных не критична)\n// - Сенсоры IoT (следующее значение придёт через секунду)\n// - Аналитика (статистическая погрешность допустима)\n//\n// Kafka настройка:\n// acks=0        — producer не ждёт подтверждения от broker\n// retries=0     — без повторных попыток\n// enable.auto.commit=true — offset коммитится ДО обработки\n//\n// Плюсы: максимальная производительность\n// Минусы: данные могут теряться' },
        { type: 'heading', value: 'At-Least-Once (хотя бы один раз)' },
        { type: 'code', language: 'java', value: '// At-Least-Once: сообщение НЕ потеряется, но может ДУБЛИРОВАТЬСЯ\n//\n// Producer отправил -> Broker получил -> ACK потерялся\n// Producer retry-ит -> Broker получает ДУБЛЬ\n//\n// Consumer обработал -> Commit offset упал -> Consumer перечитывает\n// Consumer обрабатывает ТО ЖЕ сообщение ПОВТОРНО\n//\n// Когда использовать:\n// - Если обработка идемпотентна (дубль не страшен)\n// - Email уведомления (два email лучше, чем ноль)\n// - Обновление кэша (повторное обновление безвредно)\n//\n// Kafka настройка:\n// acks=all       — ждём подтверждение от ВСЕХ реплик\n// retries=MAX    — повторяем при ошибке\n// enable.auto.commit=false — коммитим offset ПОСЛЕ обработки\n//\n// Плюсы: данные не теряются\n// Минусы: дубликаты (consumer должен быть идемпотентным)' },
        { type: 'heading', value: 'Exactly-Once (ровно один раз)' },
        { type: 'code', language: 'java', value: '// Exactly-Once: сообщение доставлено и обработано РОВНО ОДИН раз\n//\n// Это "святой Грааль" distributed messaging\n// Kafka 0.11+ поддерживает EOS (Exactly-Once Semantics)\n//\n// Механизм:\n// 1. Idempotent Producer: каждое сообщение имеет sequence number\n//    Broker отклоняет дубликаты по (ProducerID, SequenceNumber)\n//\n// 2. Transactional Producer: атомарная запись в несколько партиций\n//    Все сообщения транзакции коммитятся или откатываются\n//\n// 3. Consumer read_committed: видит только закоммиченные сообщения\n//\n// Kafka настройка:\n// enable.idempotence=true\n// transactional.id="my-producer-1"\n// isolation.level=read_committed\n//\n// Когда использовать:\n// - Финансовые транзакции (НЕЛЬЗЯ списать дважды)\n// - Kafka Streams (stream processing pipeline)\n// - Любая операция где дубль = проблема' },
        { type: 'list', value: [
          'At-Most-Once: быстро, но может потерять данные. Метрики, логи.',
          'At-Least-Once: надёжно, но возможны дубли. Уведомления, кэш.',
          'Exactly-Once: идеально, но сложно и медленнее. Финансы, критичные данные.',
          'В реальности 99% систем используют At-Least-Once + идемпотентность'
        ] },
        { type: 'warning', value: 'Exactly-Once в Kafka работает ТОЛЬКО внутри Kafka (producer -> topic -> consumer -> topic). Если consumer пишет во внешнюю систему (БД, HTTP), exactly-once НЕ гарантируется — нужна идемпотентность на стороне consumer.' }
      ]
    },
    {
      id: 2,
      title: 'Идемпотентность',
      type: 'theory',
      content: [
        { type: 'text', value: 'Идемпотентность — свойство операции давать один и тот же результат при повторном выполнении. Это ключевой паттерн для at-least-once доставки: если consumer получит дубль — результат не изменится.' },
        { type: 'heading', value: 'Идемпотентные vs Не-идемпотентные операции' },
        { type: 'code', language: 'java', value: '// Идемпотентные операции (дубль безвреден):\n// SET balance = 100        -> повтор OK: баланс всё ещё 100\n// DELETE FROM orders WHERE id = 5 -> повтор OK: уже удалено\n// PUT /users/123 {name: "Иван"} -> повтор OK: те же данные\n// INSERT ... ON CONFLICT DO NOTHING -> повтор OK: запись уже есть\n\n// НЕ-идемпотентные операции (дубль ЛОМАЕТ):\n// balance += 100           -> повтор: +200 вместо +100!\n// INSERT INTO orders (...)  -> повтор: два одинаковых заказа!\n// POST /payments {amount: 50} -> повтор: двойное списание!\n// counter++                -> повтор: счётчик +2 вместо +1!' },
        { type: 'heading', value: 'Паттерн: Idempotency Key' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class IdempotentProcessor {\n    // Хранилище обработанных ключей\n    static Set<String> processedKeys = new HashSet<>();\n\n    static boolean processPayment(String idempotencyKey, String orderId,\n                                   double amount) {\n        // Проверяем: обрабатывали ли уже этот ключ?\n        if (processedKeys.contains(idempotencyKey)) {\n            System.out.println("  [SKIP] Ключ " + idempotencyKey\n                + " уже обработан. Дубль проигнорирован.");\n            return false;\n        }\n\n        // Обрабатываем\n        System.out.println("  [OK] Оплата заказа " + orderId\n            + ": $" + amount);\n\n        // Сохраняем ключ ПОСЛЕ успешной обработки\n        processedKeys.add(idempotencyKey);\n        return true;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Попытка 1:");\n        processPayment("pay-1001-abc", "ORD-1001", 99.99);\n\n        System.out.println("Попытка 2 (дубль):");\n        processPayment("pay-1001-abc", "ORD-1001", 99.99);\n\n        System.out.println("Другой платёж:");\n        processPayment("pay-1002-xyz", "ORD-1002", 49.99);\n    }\n}' },
        { type: 'heading', value: 'Стратегии дедупликации' },
        { type: 'list', value: [
          'Idempotency Key: уникальный ключ в каждом сообщении (UUID)',
          'Database Constraint: UNIQUE INDEX на business key (order_id + action)',
          'Kafka Producer ID + Sequence: автоматическая дедупликация в Kafka',
          'Conditional Update: UPDATE SET x=100 WHERE x != 100',
          'Версионирование: UPDATE SET version=2 WHERE version=1'
        ] },
        { type: 'tip', value: 'В реальных системах idempotency key хранится в Redis (с TTL) или в таблице БД. Redis быстрее, но может потерять ключ при перезагрузке. БД надёжнее, но медленнее. Компромисс: Redis как кэш + БД как backup.' }
      ]
    },
    {
      id: 3,
      title: 'Offset Management в Kafka',
      type: 'theory',
      content: [
        { type: 'text', value: 'Offset — позиция сообщения в партиции Kafka. Consumer отслеживает offset, чтобы знать, какие сообщения уже обработаны. Управление offset-ом определяет семантику доставки: потеря данных или дублирование.' },
        { type: 'heading', value: 'Как работает Offset' },
        { type: 'code', language: 'java', value: '// Партиция — упорядоченный журнал сообщений:\n// Offset:  0   1   2   3   4   5   6   7   8   9\n// Данные: [A] [B] [C] [D] [E] [F] [G] [H] [I] [J]\n//                          ^\n//                     committed offset = 4\n//                     (сообщения 0-3 обработаны)\n//\n// Consumer Group хранит committed offset в __consumer_offsets topic\n// При перезапуске consumer начинает с committed offset + 1\n//\n// Если committed = 4, consumer начнёт с сообщения [E] (offset 5)\n// Сообщения [A]-[D] НЕ перечитываются (уже обработаны)' },
        { type: 'heading', value: 'Auto Commit vs Manual Commit' },
        { type: 'code', language: 'java', value: '// Auto Commit (enable.auto.commit=true):\n// Offset коммитится АВТОМАТИЧЕСКИ каждые 5 секунд\n//\n// Проблема 1 — потеря данных (at-most-once):\n// t=0: consumer получил сообщения offset 5-10\n// t=3: auto commit -> offset=10 (ещё НЕ обработаны!)\n// t=4: consumer упал\n// t=5: consumer перезапустился -> начинает с 11\n// Сообщения 5-10 ПОТЕРЯНЫ (committed, но не обработаны)\n\n// Manual Commit (enable.auto.commit=false):\n// Consumer САМИ решают когда коммитить offset\n//\n// commitSync():\n// Блокирующий вызов. Ждёт подтверждения от broker.\n// Медленнее, но гарантирует запись offset.\n//\n// commitAsync():\n// Неблокирующий. Может потеряться если consumer упадёт.\n// Быстрее, но менее надёжно.\n//\n// Рекомендация: commitSync() в блоке finally или при shutdown' },
        { type: 'heading', value: 'Стратегии Commit' },
        { type: 'code', language: 'java', value: '// 1. Commit после каждого сообщения (самый надёжный, самый медленный):\n// for (Record r : records) {\n//     process(r);\n//     consumer.commitSync(Map.of(tp, new OffsetAndMetadata(r.offset()+1)));\n// }\n//\n// 2. Commit после batch (компромисс):\n// for (Record r : records) {\n//     process(r);\n// }\n// consumer.commitSync(); // коммитим после batch\n// Проблема: если упали в середине batch — перечитаем весь batch\n//\n// 3. Commit каждые N сообщений:\n// int count = 0;\n// for (Record r : records) {\n//     process(r);\n//     if (++count % 100 == 0) consumer.commitSync();\n// }\n// consumer.commitSync(); // финальный commit\n//\n// Правило:\n// Критичные данные: commit после каждого сообщения\n// Высокий throughput: commit после batch\n// Компромисс: commit каждые N сообщений' },
        { type: 'warning', value: 'НИКОГДА не коммитьте offset ДО обработки сообщения. Это приводит к потере данных. Всегда: получить -> обработать -> коммитить. Если обработка упала — сообщение перечитается при следующем poll().' }
      ]
    },
    {
      id: 4,
      title: 'Транзакции в Kafka',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kafka Transactions (с версии 0.11) обеспечивают атомарную запись в несколько партиций и топиков. Либо ВСЕ сообщения транзакции записываются, либо НИ ОДНО. Это основа для exactly-once семантики.' },
        { type: 'heading', value: 'Transactional Producer' },
        { type: 'code', language: 'java', value: '// Transactional Producer:\n//\n// Properties props = new Properties();\n// props.put("transactional.id", "order-processor-1");\n// props.put("enable.idempotence", "true"); // обязательно!\n//\n// producer.initTransactions();\n//\n// try {\n//     producer.beginTransaction();\n//\n//     // Все эти записи атомарны:\n//     producer.send(new ProducerRecord<>("orders", key, orderEvent));\n//     producer.send(new ProducerRecord<>("payments", key, paymentEvent));\n//     producer.send(new ProducerRecord<>("audit-log", key, auditEvent));\n//\n//     // Коммитим offset consumed сообщения в ту же транзакцию:\n//     producer.sendOffsetsToTransaction(offsets, groupMetadata);\n//\n//     producer.commitTransaction();\n// } catch (Exception e) {\n//     producer.abortTransaction();\n// }\n//\n// Если commitTransaction() не вызван — ВСЕ записи откатываются!\n// Consumer с isolation.level=read_committed не увидит откаченные данные' },
        { type: 'heading', value: 'Read-Process-Write Pattern' },
        { type: 'code', language: 'java', value: '// Паттерн Read-Process-Write (основа Kafka Streams):\n//\n// 1. Consumer читает из input-topic\n// 2. Обрабатывает (transform, filter, aggregate)\n// 3. Producer пишет в output-topic\n// 4. Offset и output в ОДНОЙ транзакции\n//\n// consumer.poll() -> records\n// for (Record r : records) {\n//     producer.beginTransaction();\n//\n//     // Process & Write\n//     Result result = transform(r.value());\n//     producer.send(new ProducerRecord<>("output-topic", result));\n//\n//     // Commit offset в ту же транзакцию\n//     Map<TopicPartition, OffsetAndMetadata> offsets = Map.of(\n//         new TopicPartition(r.topic(), r.partition()),\n//         new OffsetAndMetadata(r.offset() + 1)\n//     );\n//     producer.sendOffsetsToTransaction(offsets, groupMetadata);\n//\n//     producer.commitTransaction();\n// }\n//\n// Результат: exactly-once от input-topic до output-topic' },
        { type: 'heading', value: 'Ограничения транзакций' },
        { type: 'list', value: [
          'Транзакции работают ТОЛЬКО внутри Kafka (topic -> topic)',
          'Если consumer пишет в БД — нужна идемпотентность или outbox pattern',
          'Transactional.id должен быть УНИКАЛЬНЫМ для каждого producer instance',
          'Overhead ~10-20% по throughput (координация транзакций)',
          'Не используйте для простых сценариев — at-least-once + идемпотентность проще'
        ] },
        { type: 'note', value: 'Kafka Streams использует транзакции по умолчанию (processing.guarantee=exactly_once_v2). Для обычных producer/consumer нужна ручная настройка. В большинстве случаев at-least-once + idempotent consumer достаточно.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Идемпотентный процессор',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте идемпотентный процессор сообщений с дедупликацией по ключу и commit offset-ов.',
      requirements: [
        'Класс KafkaPartition — хранит сообщения с offset-ами',
        'Класс IdempotentConsumer — обрабатывает сообщения с дедупликацией',
        'Каждое сообщение имеет idempotencyKey для дедупликации',
        'Consumer коммитит offset после успешной обработки',
        'При "перезапуске" consumer начинает с последнего committed offset',
        'Показать: обработка, дубль (skip), перезапуск и продолжение'
      ],
      hint: 'KafkaPartition хранит List<Message> и committedOffset. Consumer хранит Set<String> обработанных ключей. При poll() возвращает сообщения начиная с committedOffset.',
      expectedOutput: '=== Идемпотентный Consumer ===\n\nОтправка сообщений в партицию...\n  offset=0: key=PAY-001, payload="Оплата $100"\n  offset=1: key=PAY-002, payload="Оплата $200"\n  offset=2: key=PAY-001, payload="Оплата $100 (дубль)"\n  offset=3: key=PAY-003, payload="Оплата $300"\n\nОбработка:\n  [offset=0] Обработано: PAY-001 -> Оплата $100\n  [offset=1] Обработано: PAY-002 -> Оплата $200\n  [offset=2] SKIP дубль: PAY-001 (уже обработано)\n  [offset=3] Обработано: PAY-003 -> Оплата $300\n  Commit offset: 4\n\nСтатистика:\n  Обработано: 3\n  Дубликатов пропущено: 1\n  Committed offset: 4',
      solution: `import java.util.*;

public class Main {
    static class Message {
        int offset;
        String key;
        String payload;
        Message(int offset, String key, String payload) {
            this.offset = offset;
            this.key = key;
            this.payload = payload;
        }
    }

    static class KafkaPartition {
        List<Message> log = new ArrayList<>();
        int committedOffset = 0;

        int append(String key, String payload) {
            int offset = log.size();
            log.add(new Message(offset, key, payload));
            return offset;
        }

        List<Message> poll(int fromOffset) {
            if (fromOffset >= log.size()) return Collections.emptyList();
            return log.subList(fromOffset, log.size());
        }

        void commitOffset(int offset) {
            committedOffset = offset;
        }
    }

    static class IdempotentConsumer {
        Set<String> processedKeys = new HashSet<>();
        int processed = 0;
        int duplicates = 0;

        void consume(KafkaPartition partition) {
            List<Message> messages = partition.poll(partition.committedOffset);

            System.out.println("Обработка:");
            for (Message msg : messages) {
                if (processedKeys.contains(msg.key)) {
                    duplicates++;
                    System.out.println("  [offset=" + msg.offset
                        + "] SKIP дубль: " + msg.key + " (уже обработано)");
                } else {
                    processedKeys.add(msg.key);
                    processed++;
                    System.out.println("  [offset=" + msg.offset
                        + "] Обработано: " + msg.key + " -> " + msg.payload);
                }
            }

            int newOffset = partition.committedOffset + messages.size();
            partition.commitOffset(newOffset);
            System.out.println("  Commit offset: " + newOffset);
        }

        void printStats(KafkaPartition partition) {
            System.out.println("\\nСтатистика:");
            System.out.println("  Обработано: " + processed);
            System.out.println("  Дубликатов пропущено: " + duplicates);
            System.out.println("  Committed offset: " + partition.committedOffset);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Идемпотентный Consumer ===\\n");

        KafkaPartition partition = new KafkaPartition();

        System.out.println("Отправка сообщений в партицию...");
        int o1 = partition.append("PAY-001", "Оплата $100");
        System.out.println("  offset=" + o1 + ": key=PAY-001, payload=\\"Оплата $100\\"");
        int o2 = partition.append("PAY-002", "Оплата $200");
        System.out.println("  offset=" + o2 + ": key=PAY-002, payload=\\"Оплата $200\\"");
        int o3 = partition.append("PAY-001", "Оплата $100 (дубль)");
        System.out.println("  offset=" + o3 + ": key=PAY-001, payload=\\"Оплата $100 (дубль)\\"");
        int o4 = partition.append("PAY-003", "Оплата $300");
        System.out.println("  offset=" + o4 + ": key=PAY-003, payload=\\"Оплата $300\\"");

        System.out.println();

        IdempotentConsumer consumer = new IdempotentConsumer();
        consumer.consume(partition);
        consumer.printStats(partition);
    }
}`,
      explanation: 'Идемпотентный consumer хранит Set обработанных ключей и пропускает дубликаты. Offset коммитится ПОСЛЕ обработки всего batch. При перезапуске consumer начинает с committed offset, а idempotency key защищает от повторной обработки. Это стандартный паттерн для at-least-once + дедупликация в Kafka.'
    },
    {
      id: 6,
      title: 'Практика: Транзакционная обработка',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте транзакционный процессор Read-Process-Write: атомарное чтение из input-топика, обработка и запись в output-топик с exactly-once семантикой.',
      requirements: [
        'Класс KafkaTopic с партицией и offset management',
        'Класс TransactionalProcessor с beginTransaction/commit/abort',
        'Read-Process-Write: читаем из input, трансформируем, пишем в output',
        'При commit: записи в output + offset commit атомарны',
        'При abort: ни записи, ни offset не сохраняются',
        'Показать успешную транзакцию и откат при ошибке'
      ],
      hint: 'Транзакция — это буфер записей. При commit — переносим из буфера в output topic и коммитим offset. При abort — очищаем буфер.',
      expectedOutput: '=== Транзакционная обработка ===\n\nInput topic: [Заказ-1, Заказ-2, ERROR-3, Заказ-4]\n\n--- Транзакция 1 ---\n  BEGIN\n  Read: offset=0, "Заказ-1"\n  Process: "Заказ-1" -> "PROCESSED: Заказ-1"\n  Write to output: "PROCESSED: Заказ-1"\n  Read: offset=1, "Заказ-2"\n  Process: "Заказ-2" -> "PROCESSED: Заказ-2"\n  Write to output: "PROCESSED: Заказ-2"\n  COMMIT (offset=2, записей: 2)\n\n--- Транзакция 2 ---\n  BEGIN\n  Read: offset=2, "ERROR-3"\n  Process: ОШИБКА при обработке "ERROR-3"\n  ABORT (откат всех записей)\n\n--- Транзакция 3 (retry) ---\n  BEGIN\n  Read: offset=2, "ERROR-3" (перечитываем!)\n  Process: skip ошибочное, "ERROR-3" -> DLQ\n  Read: offset=3, "Заказ-4"\n  Process: "Заказ-4" -> "PROCESSED: Заказ-4"\n  Write to output: "PROCESSED: Заказ-4"\n  COMMIT (offset=4, записей: 1)\n\nOutput topic: [PROCESSED: Заказ-1, PROCESSED: Заказ-2, PROCESSED: Заказ-4]\nDLQ: [ERROR-3]\nFinal committed offset: 4',
      solution: `import java.util.*;

public class Main {
    static class KafkaTopic {
        String name;
        List<String> messages = new ArrayList<>();
        int committedOffset = 0;

        KafkaTopic(String name) { this.name = name; }

        void produce(String msg) { messages.add(msg); }

        List<String> poll(int from, int count) {
            List<String> result = new ArrayList<>();
            for (int i = from; i < Math.min(from + count, messages.size()); i++) {
                result.add(messages.get(i));
            }
            return result;
        }
    }

    static class TransactionalProcessor {
        KafkaTopic input;
        KafkaTopic output;
        List<String> dlq = new ArrayList<>();
        List<String> txBuffer = new ArrayList<>();
        int txOffset;
        boolean inTransaction = false;

        TransactionalProcessor(KafkaTopic input, KafkaTopic output) {
            this.input = input;
            this.output = output;
        }

        void beginTransaction() {
            inTransaction = true;
            txBuffer.clear();
            txOffset = input.committedOffset;
            System.out.println("  BEGIN");
        }

        void commit() {
            for (String msg : txBuffer) {
                output.produce(msg);
            }
            input.committedOffset = txOffset;
            System.out.println("  COMMIT (offset=" + txOffset
                + ", записей: " + txBuffer.size() + ")");
            txBuffer.clear();
            inTransaction = false;
        }

        void abort() {
            txBuffer.clear();
            inTransaction = false;
            System.out.println("  ABORT (откат всех записей)");
        }

        void writeToOutput(String msg) {
            txBuffer.add(msg);
            System.out.println("  Write to output: \\"" + msg + "\\"");
        }

        // Транзакция 1: обработка первых двух
        void processTransaction1() {
            System.out.println("--- Транзакция 1 ---");
            beginTransaction();
            List<String> records = input.poll(txOffset, 2);
            for (String rec : records) {
                System.out.println("  Read: offset=" + txOffset + ", \\"" + rec + "\\"");
                String result = "PROCESSED: " + rec;
                System.out.println("  Process: \\"" + rec + "\\" -> \\"" + result + "\\"");
                writeToOutput(result);
                txOffset++;
            }
            commit();
        }

        // Транзакция 2: ошибка на ERROR
        void processTransaction2() {
            System.out.println("\\n--- Транзакция 2 ---");
            beginTransaction();
            List<String> records = input.poll(txOffset, 1);
            String rec = records.get(0);
            System.out.println("  Read: offset=" + txOffset + ", \\"" + rec + "\\"");
            System.out.println("  Process: ОШИБКА при обработке \\"" + rec + "\\"");
            abort();
        }

        // Транзакция 3: retry с пропуском ошибочного
        void processTransaction3() {
            System.out.println("\\n--- Транзакция 3 (retry) ---");
            beginTransaction();
            List<String> records = input.poll(txOffset, 2);
            for (String rec : records) {
                System.out.println("  Read: offset=" + txOffset + ", \\"" + rec
                    + "\\"" + (rec.startsWith("ERROR") ? " (перечитываем!)" : ""));
                if (rec.startsWith("ERROR")) {
                    System.out.println("  Process: skip ошибочное, \\"" + rec + "\\" -> DLQ");
                    dlq.add(rec);
                } else {
                    String result = "PROCESSED: " + rec;
                    System.out.println("  Process: \\"" + rec + "\\" -> \\"" + result + "\\"");
                    writeToOutput(result);
                }
                txOffset++;
            }
            commit();
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Транзакционная обработка ===\\n");

        KafkaTopic input = new KafkaTopic("input");
        KafkaTopic output = new KafkaTopic("output");

        input.produce("Заказ-1");
        input.produce("Заказ-2");
        input.produce("ERROR-3");
        input.produce("Заказ-4");

        System.out.println("Input topic: " + input.messages + "\\n");

        TransactionalProcessor processor = new TransactionalProcessor(input, output);
        processor.processTransaction1();
        processor.processTransaction2();
        processor.processTransaction3();

        System.out.println("\\nOutput topic: " + output.messages);
        System.out.println("DLQ: " + processor.dlq);
        System.out.println("Final committed offset: " + input.committedOffset);
    }
}`,
      explanation: 'Транзакционная обработка гарантирует атомарность: запись в output topic и commit offset происходят вместе. При abort — ни записи, ни offset не сохраняются. Consumer перечитывает с последнего committed offset. Ошибочные сообщения отправляются в DLQ. Это реализация exactly-once Read-Process-Write паттерна из Kafka Streams.'
    }
  ]
}
