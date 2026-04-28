export default {
  id: 6,
  title: 'Kafka Connect: интеграция',
  description: 'Kafka Connect: source и sink connectors, JDBC connector, S3 connector, Single Message Transforms, масштабирование.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Kafka Connect?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kafka Connect — фреймворк для интеграции Kafka с внешними системами (базы данных, файловые системы, облачные хранилища). Вместо написания producer/consumer кода вы настраиваете коннекторы через JSON конфигурацию.' },
        { type: 'heading', value: 'Source и Sink Connectors' },
        { type: 'code', language: 'java', value: '// Source Connector: внешняя система -> Kafka\n// Читает данные из источника и записывает в Kafka топик\n//\n// Примеры Source Connectors:\n// JDBC Source -> читает таблицы PostgreSQL, записывает в Kafka\n// Debezium CDC -> отслеживает изменения в БД (INSERT/UPDATE/DELETE)\n// File Source -> читает файлы и записывает строки в Kafka\n// MongoDB Source -> отслеживает коллекции MongoDB\n//\n// PostgreSQL [users] --Source Connector--> Kafka [db.users]\n\n// Sink Connector: Kafka -> внешняя система\n// Читает данные из Kafka топика и записывает во внешнюю систему\n//\n// Примеры Sink Connectors:\n// JDBC Sink -> записывает из Kafka в PostgreSQL\n// S3 Sink -> сохраняет сообщения в Amazon S3 (Parquet, JSON)\n// Elasticsearch Sink -> индексирует данные для поиска\n// HDFS Sink -> записывает в Hadoop для аналитики\n//\n// Kafka [orders] --Sink Connector--> Elasticsearch [orders-index]' },
        { type: 'heading', value: 'Зачем Connect, если есть Producer/Consumer?' },
        { type: 'list', value: [
          'Не нужно писать код — конфигурация через JSON',
          'Масштабирование — запуск нескольких workers',
          'Отказоустойчивость — автоматический restart при сбоях',
          'Offset management — Connect сам отслеживает прогресс',
          'Готовые коннекторы — 200+ коннекторов в Confluent Hub',
          'CDC (Change Data Capture) — отслеживание изменений в БД'
        ] },
        { type: 'tip', value: 'Kafka Connect особенно полезен для CDC (Change Data Capture). Debezium connector отслеживает WAL (Write-Ahead Log) PostgreSQL и публикует каждое INSERT/UPDATE/DELETE как событие в Kafka. Это основа event-driven архитектуры без изменения существующего кода.' }
      ]
    },
    {
      id: 2,
      title: 'JDBC Source Connector',
      type: 'theory',
      content: [
        { type: 'text', value: 'JDBC Source Connector читает данные из реляционной базы данных и записывает их в Kafka топики. Поддерживает два режима: bulk (полная копия таблицы) и incrementing/timestamp (только новые и изменённые записи).' },
        { type: 'heading', value: 'Конфигурация JDBC Source' },
        { type: 'code', language: 'java', value: '// Конфигурация JDBC Source Connector:\n// POST /connectors\n// {\n//   "name": "postgres-source",\n//   "config": {\n//     "connector.class": "io.confluent.connect.jdbc.JdbcSourceConnector",\n//     "connection.url": "jdbc:postgresql://localhost:5432/mydb",\n//     "connection.user": "postgres",\n//     "connection.password": "secret",\n//     "table.whitelist": "users,orders",\n//     "mode": "incrementing",\n//     "incrementing.column.name": "id",\n//     "topic.prefix": "db.",\n//     "poll.interval.ms": "5000"\n//   }\n// }\n//\n// Результат:\n// Таблица users -> Kafka топик db.users\n// Таблица orders -> Kafka топик db.orders\n// Каждые 5 секунд проверяет новые записи по id' },
        { type: 'heading', value: 'Режимы отслеживания' },
        { type: 'code', language: 'java', value: '// mode: "bulk"\n// Полная копия таблицы каждый poll\n// Подходит для маленьких справочников\n// SELECT * FROM categories\n\n// mode: "incrementing"\n// Только новые записи (по auto-increment id)\n// SELECT * FROM users WHERE id > last_max_id\n// НЕ ловит UPDATE!\n\n// mode: "timestamp"\n// Записи изменённые после последнего poll\n// SELECT * FROM users WHERE updated_at > last_timestamp\n// Ловит UPDATE, но нужна колонка updated_at\n\n// mode: "timestamp+incrementing" (рекомендуется)\n// Комбинация: новые записи по id, изменённые по timestamp\n// SELECT * FROM users WHERE id > last_id OR updated_at > last_ts\n// Ловит и INSERT и UPDATE' },
        { type: 'warning', value: 'JDBC Source НЕ отслеживает DELETE! Для полноценного CDC (включая удаления) используйте Debezium. Debezium читает WAL базы данных и публикует ВСЕ изменения, включая DELETE, в Kafka.' }
      ]
    },
    {
      id: 3,
      title: 'Sink Connectors и SMT',
      type: 'theory',
      content: [
        { type: 'text', value: 'Sink Connectors записывают данные из Kafka во внешние системы. Single Message Transforms (SMT) позволяют модифицировать сообщения на лету: переименовать поля, изменить тип, добавить timestamp.' },
        { type: 'heading', value: 'JDBC Sink Connector' },
        { type: 'code', language: 'java', value: '// JDBC Sink: Kafka -> PostgreSQL\n// {\n//   "name": "postgres-sink",\n//   "config": {\n//     "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",\n//     "connection.url": "jdbc:postgresql://localhost:5432/analytics",\n//     "topics": "db.orders",\n//     "insert.mode": "upsert",\n//     "pk.mode": "record_value",\n//     "pk.fields": "id",\n//     "auto.create": "true",\n//     "auto.evolve": "true"\n//   }\n// }\n//\n// insert.mode:\n// "insert" — только INSERT (дубликаты вызывают ошибку)\n// "upsert" — INSERT или UPDATE по primary key\n// "update" — только UPDATE существующих записей\n//\n// auto.create: автоматически создать таблицу\n// auto.evolve: автоматически добавить новые колонки' },
        { type: 'heading', value: 'S3 Sink Connector' },
        { type: 'code', language: 'java', value: '// S3 Sink: Kafka -> Amazon S3\n// {\n//   "name": "s3-sink",\n//   "config": {\n//     "connector.class": "io.confluent.connect.s3.S3SinkConnector",\n//     "s3.bucket.name": "my-data-lake",\n//     "s3.region": "us-east-1",\n//     "topics": "events",\n//     "format.class": "io.confluent.connect.s3.format.parquet.ParquetFormat",\n//     "flush.size": "1000",\n//     "rotate.interval.ms": "3600000",\n//     "partitioner.class": "io.confluent.connect.storage.partitioner.TimeBasedPartitioner",\n//     "path.format": "year=YYYY/month=MM/day=dd/hour=HH"\n//   }\n// }\n//\n// Результат: s3://my-data-lake/events/year=2024/month=01/day=15/hour=10/\n// Файлы в формате Parquet, по 1000 записей или каждый час' },
        { type: 'heading', value: 'Single Message Transforms (SMT)' },
        { type: 'code', language: 'java', value: '// SMT — трансформация сообщений на лету\n// Применяются в конфигурации коннектора\n//\n// "transforms": "addTimestamp,maskPassword,renameField",\n//\n// "transforms.addTimestamp.type": "org.apache.kafka.connect.transforms.InsertField$Value",\n// "transforms.addTimestamp.timestamp.field": "processed_at",\n//\n// "transforms.maskPassword.type": "org.apache.kafka.connect.transforms.MaskField$Value",\n// "transforms.maskPassword.fields": "password,ssn",\n//\n// "transforms.renameField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",\n// "transforms.renameField.renames": "userName:user_name,firstName:first_name"\n//\n// Популярные SMT:\n// InsertField — добавить поле (timestamp, static value)\n// MaskField — замаскировать чувствительные данные\n// ReplaceField — переименовать/удалить поля\n// TimestampConverter — преобразовать формат даты\n// ValueToKey — использовать значение поля как ключ' },
        { type: 'note', value: 'SMT выполняются на стороне Connect worker, до записи в Kafka (source) или после чтения из Kafka (sink). Они легковесные и не требуют отдельного stream processing. Для сложной логики используйте Kafka Streams.' }
      ]
    },
    {
      id: 4,
      title: 'Debezium CDC',
      type: 'theory',
      content: [
        { type: 'text', value: 'Debezium — open-source платформа для Change Data Capture (CDC). Она отслеживает изменения в базе данных (INSERT, UPDATE, DELETE) и публикует их как события в Kafka. Debezium читает WAL (Write-Ahead Log) базы данных, не нагружая её дополнительными запросами.' },
        { type: 'heading', value: 'Как работает CDC?' },
        { type: 'code', language: 'java', value: '// Традиционный подход (polling):\n// SELECT * FROM orders WHERE updated_at > :lastCheck\n// Проблемы: нагрузка на БД, не ловит DELETE, задержка\n\n// CDC через WAL:\n// PostgreSQL пишет каждое изменение в WAL (Write-Ahead Log)\n// Debezium подключается к WAL как replica\n// Каждый INSERT/UPDATE/DELETE -> событие в Kafka\n//\n// PostgreSQL WAL --> Debezium --> Kafka\n//\n// Преимущества:\n// 1. Нет нагрузки на БД (читает WAL, не таблицы)\n// 2. Ловит ВСЕ изменения (INSERT, UPDATE, DELETE)\n// 3. Минимальная задержка (миллисекунды)\n// 4. Не нужно менять код приложения\n// 5. Полная история изменений' },
        { type: 'heading', value: 'Формат событий Debezium' },
        { type: 'code', language: 'java', value: '// Событие Debezium содержит before и after состояния:\n//\n// INSERT:\n// {\n//   "op": "c",  // create\n//   "before": null,\n//   "after": {"id": 1, "name": "Иван", "email": "ivan@mail.ru"},\n//   "source": {"table": "users", "lsn": 12345}\n// }\n//\n// UPDATE:\n// {\n//   "op": "u",  // update\n//   "before": {"id": 1, "name": "Иван", "email": "ivan@mail.ru"},\n//   "after":  {"id": 1, "name": "Иван", "email": "ivan@gmail.com"},\n//   "source": {"table": "users", "lsn": 12346}\n// }\n//\n// DELETE:\n// {\n//   "op": "d",  // delete\n//   "before": {"id": 1, "name": "Иван", "email": "ivan@gmail.com"},\n//   "after": null,\n//   "source": {"table": "users", "lsn": 12347}\n// }\n//\n// "op" значения: c=create, u=update, d=delete, r=read (snapshot)' },
        { type: 'tip', value: 'Debezium + Kafka — стандарт для микросервисной архитектуры. Вместо распределённых транзакций сервисы подписываются на CDC-события друг друга. Order Service пишет в свою БД, а Payment Service узнаёт о новом заказе через Debezium CDC топик.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Source Connector симулятор',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте симулятор JDBC Source Connector: периодическое чтение из базы данных и публикация в топик Kafka.',
      requirements: [
        'Класс Database — имитация таблицы с auto-increment id и updated_at',
        'Класс JdbcSourceConnector с настройками mode: incrementing/timestamp',
        'Метод poll() — читает новые/изменённые записи из БД',
        'Метод publishToKafka() — публикует записи в топик',
        'Покажите три poll цикла: вставка, обновление, ещё вставка',
        'Покажите разницу между режимами incrementing и timestamp'
      ],
      hint: 'В режиме incrementing храните lastMaxId. В режиме timestamp храните lastTimestamp. При каждом poll выбирайте записи с id > lastMaxId или updatedAt > lastTimestamp.',
      expectedOutput: '=== JDBC Source Connector (mode: incrementing) ===\n\n--- Poll 1: после INSERT записей ---\nНовые записи (id > 0):\n  id=1, name=Иван, updated_at=100\n  id=2, name=Мария, updated_at=100\n  id=3, name=Пётр, updated_at=100\nОпубликовано в Kafka: 3 записи. lastMaxId=3\n\n--- UPDATE: Иван сменил имя ---\n\n--- Poll 2: после UPDATE ---\nНовые записи (id > 3): нет\nINCREMENTING режим НЕ увидел UPDATE!\n\n=== JDBC Source Connector (mode: timestamp) ===\n\n--- Poll 1: ---\nИзменённые записи (updated_at > 0):\n  id=1, name=Иван, updated_at=100\n  id=2, name=Мария, updated_at=100\n  id=3, name=Пётр, updated_at=100\nОпубликовано: 3 записи. lastTimestamp=100\n\n--- Poll 2: после UPDATE ---\nИзменённые записи (updated_at > 100):\n  id=1, name=Иван Петров, updated_at=200\nTIMESTAMP режим увидел UPDATE!',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    static class Row {
        int id;
        String name;
        long updatedAt;

        Row(int id, String name, long updatedAt) {
            this.id = id;
            this.name = name;
            this.updatedAt = updatedAt;
        }

        public String toString() {
            return "id=" + id + ", name=" + name + ", updated_at=" + updatedAt;
        }
    }

    static class Database {
        List<Row> rows = new ArrayList<>();
        int nextId = 1;

        void insert(String name, long timestamp) {
            rows.add(new Row(nextId++, name, timestamp));
        }

        void update(int id, String newName, long timestamp) {
            for (Row r : rows) {
                if (r.id == id) {
                    r.name = newName;
                    r.updatedAt = timestamp;
                }
            }
        }

        List<Row> selectWhereIdGreaterThan(int lastId) {
            return rows.stream().filter(r -> r.id > lastId).collect(Collectors.toList());
        }

        List<Row> selectWhereUpdatedAfter(long lastTs) {
            return rows.stream().filter(r -> r.updatedAt > lastTs).collect(Collectors.toList());
        }
    }

    static void demoIncrementing() {
        System.out.println("=== JDBC Source Connector (mode: incrementing) ===\\n");
        Database db = new Database();
        int lastMaxId = 0;

        // Insert
        db.insert("Иван", 100);
        db.insert("Мария", 100);
        db.insert("Пётр", 100);

        // Poll 1
        System.out.println("--- Poll 1: после INSERT записей ---");
        List<Row> newRows = db.selectWhereIdGreaterThan(lastMaxId);
        System.out.println("Новые записи (id > " + lastMaxId + "):");
        for (Row r : newRows) {
            System.out.println("  " + r);
            lastMaxId = Math.max(lastMaxId, r.id);
        }
        System.out.println("Опубликовано в Kafka: " + newRows.size()
            + " записи. lastMaxId=" + lastMaxId);

        // Update
        System.out.println("\\n--- UPDATE: Иван сменил имя ---");
        db.update(1, "Иван Петров", 200);

        // Poll 2
        System.out.println("\\n--- Poll 2: после UPDATE ---");
        newRows = db.selectWhereIdGreaterThan(lastMaxId);
        if (newRows.isEmpty()) {
            System.out.println("Новые записи (id > " + lastMaxId + "): нет");
            System.out.println("INCREMENTING режим НЕ увидел UPDATE!");
        }
    }

    static void demoTimestamp() {
        System.out.println("\\n=== JDBC Source Connector (mode: timestamp) ===\\n");
        Database db = new Database();
        long lastTimestamp = 0;

        db.insert("Иван", 100);
        db.insert("Мария", 100);
        db.insert("Пётр", 100);

        // Poll 1
        System.out.println("--- Poll 1: ---");
        List<Row> changed = db.selectWhereUpdatedAfter(lastTimestamp);
        System.out.println("Изменённые записи (updated_at > " + lastTimestamp + "):");
        for (Row r : changed) {
            System.out.println("  " + r);
            lastTimestamp = Math.max(lastTimestamp, r.updatedAt);
        }
        System.out.println("Опубликовано: " + changed.size()
            + " записи. lastTimestamp=" + lastTimestamp);

        // Update
        db.update(1, "Иван Петров", 200);

        // Poll 2
        System.out.println("\\n--- Poll 2: после UPDATE ---");
        changed = db.selectWhereUpdatedAfter(lastTimestamp);
        System.out.println("Изменённые записи (updated_at > " + lastTimestamp + "):");
        for (Row r : changed) {
            System.out.println("  " + r);
        }
        System.out.println("TIMESTAMP режим увидел UPDATE!");
    }

    public static void main(String[] args) {
        demoIncrementing();
        demoTimestamp();
    }
}`,
      explanation: 'JDBC Source Connector в режиме incrementing отслеживает только новые записи по auto-increment ID и пропускает UPDATE. Режим timestamp отслеживает любые изменения по колонке updated_at. Рекомендуется mode=timestamp+incrementing для полного покрытия. Для отслеживания DELETE нужен Debezium CDC.'
    },
    {
      id: 6,
      title: 'Практика: ETL Pipeline',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте ETL pipeline: извлечение данных из источника, трансформация через SMT, загрузка в целевую систему.',
      requirements: [
        'Source: чтение заказов из "базы данных"',
        'Transform: маскировка персональных данных, переименование полей, добавление timestamp',
        'Sink: запись в "аналитическое хранилище"',
        'Класс Transform с цепочкой SMT (chain of transforms)',
        'Минимум 3 трансформации',
        'Покажите данные до и после трансформации'
      ],
      hint: 'Используйте паттерн Chain of Responsibility для SMT. Каждый Transform принимает Map и возвращает модифицированный Map.',
      expectedOutput: '=== ETL Pipeline: Orders -> Analytics ===\n\n--- Source: Raw Data ---\n{id=1, customer_name=Иван Петров, email=ivan@mail.ru, amount=5000, card=4111111111111111}\n{id=2, customer_name=Мария Сидорова, email=maria@gmail.com, amount=15000, card=5500000000000004}\n\n--- Transforms Applied ---\n[1] MaskField: card -> ****1111\n[2] RenameField: customer_name -> customerName\n[3] InsertField: processed_at -> 2024-01-15T10:00:00\n[4] FilterField: удалено поле email\n\n--- Sink: Transformed Data ---\n{id=1, customerName=Иван Петров, amount=5000, card=****1111, processed_at=2024-01-15T10:00:00}\n{id=2, customerName=Мария Сидорова, amount=15000, card=****0004, processed_at=2024-01-15T10:00:00}\n\nETL завершён: 2 записи обработаны',
      solution: `import java.util.*;
import java.util.function.Function;

public class Main {
    // SMT интерфейс
    interface Transform extends Function<Map<String, String>, Map<String, String>> {
        String describe();
    }

    // Маскировка полей
    static class MaskField implements Transform {
        String field;
        MaskField(String field) { this.field = field; }

        public Map<String, String> apply(Map<String, String> record) {
            Map<String, String> result = new LinkedHashMap<>(record);
            if (result.containsKey(field)) {
                String value = result.get(field);
                String masked = "****" + value.substring(value.length() - 4);
                result.put(field, masked);
            }
            return result;
        }

        public String describe() {
            return "MaskField: " + field + " -> ****";
        }
    }

    // Переименование полей
    static class RenameField implements Transform {
        String oldName, newName;
        RenameField(String oldName, String newName) {
            this.oldName = oldName;
            this.newName = newName;
        }

        public Map<String, String> apply(Map<String, String> record) {
            Map<String, String> result = new LinkedHashMap<>();
            for (Map.Entry<String, String> e : record.entrySet()) {
                String key = e.getKey().equals(oldName) ? newName : e.getKey();
                result.put(key, e.getValue());
            }
            return result;
        }

        public String describe() {
            return "RenameField: " + oldName + " -> " + newName;
        }
    }

    // Добавление поля
    static class InsertField implements Transform {
        String field, value;
        InsertField(String field, String value) {
            this.field = field;
            this.value = value;
        }

        public Map<String, String> apply(Map<String, String> record) {
            Map<String, String> result = new LinkedHashMap<>(record);
            result.put(field, value);
            return result;
        }

        public String describe() {
            return "InsertField: " + field + " -> " + value;
        }
    }

    // Удаление поля
    static class FilterField implements Transform {
        String field;
        FilterField(String field) { this.field = field; }

        public Map<String, String> apply(Map<String, String> record) {
            Map<String, String> result = new LinkedHashMap<>(record);
            result.remove(field);
            return result;
        }

        public String describe() {
            return "FilterField: удалено поле " + field;
        }
    }

    static class ETLPipeline {
        List<Transform> transforms = new ArrayList<>();
        List<Map<String, String>> sink = new ArrayList<>();

        void addTransform(Transform t) { transforms.add(t); }

        void process(List<Map<String, String>> sourceData) {
            System.out.println("--- Source: Raw Data ---");
            sourceData.forEach(System.out::println);

            System.out.println("\\n--- Transforms Applied ---");
            for (int i = 0; i < transforms.size(); i++) {
                System.out.println("[" + (i + 1) + "] " + transforms.get(i).describe());
            }

            System.out.println("\\n--- Sink: Transformed Data ---");
            for (Map<String, String> record : sourceData) {
                Map<String, String> transformed = record;
                for (Transform t : transforms) {
                    transformed = t.apply(transformed);
                }
                sink.add(transformed);
                System.out.println(transformed);
            }

            System.out.println("\\nETL завершён: " + sink.size() + " записи обработаны");
        }
    }

    public static void main(String[] args) {
        System.out.println("=== ETL Pipeline: Orders -> Analytics ===\\n");

        // Source data
        List<Map<String, String>> sourceData = new ArrayList<>();

        Map<String, String> row1 = new LinkedHashMap<>();
        row1.put("id", "1");
        row1.put("customer_name", "Иван Петров");
        row1.put("email", "ivan@mail.ru");
        row1.put("amount", "5000");
        row1.put("card", "4111111111111111");
        sourceData.add(row1);

        Map<String, String> row2 = new LinkedHashMap<>();
        row2.put("id", "2");
        row2.put("customer_name", "Мария Сидорова");
        row2.put("email", "maria@gmail.com");
        row2.put("amount", "15000");
        row2.put("card", "5500000000000004");
        sourceData.add(row2);

        // Pipeline
        ETLPipeline pipeline = new ETLPipeline();
        pipeline.addTransform(new MaskField("card"));
        pipeline.addTransform(new RenameField("customer_name", "customerName"));
        pipeline.addTransform(new InsertField("processed_at", "2024-01-15T10:00:00"));
        pipeline.addTransform(new FilterField("email"));

        pipeline.process(sourceData);
    }
}`,
      explanation: 'ETL pipeline моделирует работу Kafka Connect с SMT. Source Connector читает данные, цепочка Transform обрабатывает каждую запись (маскировка, переименование, добавление полей), Sink Connector записывает результат. В Kafka Connect это конфигурируется через JSON без написания кода.'
    }
  ]
}
