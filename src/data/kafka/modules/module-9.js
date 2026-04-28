export default {
  id: 9,
  title: 'Сериализация сообщений',
  description: 'Форматы сериализации: JSON, Avro, Protobuf. Schema Registry, эволюция схем, совместимость версий, выбор формата.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужна сериализация?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сериализация — преобразование объекта в поток байтов для передачи через сеть или хранения. В Kafka и RabbitMQ сообщения хранятся как byte[], поэтому producer должен сериализовать объект, а consumer — десериализовать обратно.' },
        { type: 'heading', value: 'Проблема без стандартизации' },
        { type: 'code', language: 'java', value: '// Без сериализации — каждый делает как хочет\n// Producer 1: JSON\n// {"userId": 123, "name": "Иван"}\n\n// Producer 2: CSV\n// 123,Иван\n\n// Producer 3: собственный формат\n// USER|123|Иван\n\n// Consumer должен угадать формат!\n// А если producer изменит формат?\n// А если добавит новое поле?\n// А если переименует поле?\n\n// Результат: ХАОС. Сервисы ломаются при каждом изменении.' },
        { type: 'heading', value: 'Основные форматы' },
        { type: 'list', value: [
          'JSON — текстовый, читаемый, без схемы, большой размер',
          'Apache Avro — бинарный, со схемой, компактный, эволюция схем',
          'Protocol Buffers (Protobuf) — бинарный, от Google, строго типизированный',
          'MessagePack — бинарный JSON, компактный, без схемы',
          'Java Serialization — НЕ используйте (медленно, небезопасно, Java-only)'
        ] },
        { type: 'code', language: 'java', value: '// Сравнение размеров одного и того же объекта:\n//\n// Объект: {userId: 123, name: "Иван Петров", email: "ivan@mail.ru", age: 30}\n//\n// JSON:     ~70 байт (текст, ключи повторяются в каждом сообщении)\n// Avro:     ~25 байт (бинарный, схема хранится отдельно)\n// Protobuf: ~30 байт (бинарный, теги вместо имён полей)\n//\n// При 1 млн сообщений/сек:\n// JSON:     70 MB/s\n// Avro:     25 MB/s (экономия 64%!)\n// Protobuf: 30 MB/s (экономия 57%)\n//\n// На масштабе LinkedIn/Netflix это ТЕРАБАЙТЫ в день' },
        { type: 'tip', value: 'Для Kafka рекомендуется Avro + Schema Registry — это стандарт индустрии. Для gRPC — Protobuf. Для REST API и простых систем — JSON. Никогда не используйте Java Serialization для messaging.' }
      ]
    },
    {
      id: 2,
      title: 'JSON сериализация',
      type: 'theory',
      content: [
        { type: 'text', value: 'JSON (JavaScript Object Notation) — самый популярный текстовый формат. Человекочитаемый, поддерживается всеми языками, не требует предварительного описания схемы. Но у него есть недостатки: большой размер, нет типизации, нет встроенной эволюции схем.' },
        { type: 'heading', value: 'Ручная JSON сериализация' },
        { type: 'code', language: 'java', value: '// Простая JSON сериализация без библиотек\nimport java.util.*;\n\npublic class JsonSerializer {\n    // Сериализация Map в JSON строку\n    static String toJson(Map<String, Object> obj) {\n        StringBuilder sb = new StringBuilder("{");\n        int i = 0;\n        for (Map.Entry<String, Object> entry : obj.entrySet()) {\n            if (i++ > 0) sb.append(", ");\n            sb.append("\\"").append(entry.getKey()).append("\\": ");\n            Object val = entry.getValue();\n            if (val instanceof String) {\n                sb.append("\\"").append(val).append("\\"");\n            } else if (val instanceof List) {\n                sb.append(listToJson((List<?>) val));\n            } else {\n                sb.append(val);\n            }\n        }\n        sb.append("}");\n        return sb.toString();\n    }\n\n    static String listToJson(List<?> list) {\n        StringBuilder sb = new StringBuilder("[");\n        for (int i = 0; i < list.size(); i++) {\n            if (i > 0) sb.append(", ");\n            Object val = list.get(i);\n            if (val instanceof String) sb.append("\\"").append(val).append("\\"");\n            else sb.append(val);\n        }\n        sb.append("]");\n        return sb.toString();\n    }\n\n    // Десериализация (упрощённая)\n    static Map<String, String> fromJson(String json) {\n        Map<String, String> result = new LinkedHashMap<>();\n        json = json.trim();\n        if (json.startsWith("{")) json = json.substring(1);\n        if (json.endsWith("}")) json = json.substring(0, json.length() - 1);\n        String[] pairs = json.split(",\\\\s*(?=\\")");\n        for (String pair : pairs) {\n            String[] kv = pair.split(":\\\\s*", 2);\n            String key = kv[0].trim().replace("\\"", "");\n            String value = kv[1].trim().replace("\\"", "");\n            result.put(key, value);\n        }\n        return result;\n    }\n}' },
        { type: 'heading', value: 'Проблемы JSON' },
        { type: 'list', value: [
          'Размер: ключи повторяются в каждом сообщении ("userId" x 1 млн раз)',
          'Нет типизации: число 123 или строка "123"? null или отсутствие поля?',
          'Нет схемы: producer может отправить что угодно, ошибки на стороне consumer',
          'Нет эволюции: добавление/удаление поля может сломать consumer-ов',
          'Парсинг медленный: текстовый формат — нужно разбирать символ за символом'
        ] },
        { type: 'warning', value: 'JSON подходит для REST API и простых систем. Для high-throughput Kafka (>10K msg/s) используйте Avro или Protobuf — экономия трафика и CPU на порядок.' }
      ]
    },
    {
      id: 3,
      title: 'Apache Avro',
      type: 'theory',
      content: [
        { type: 'text', value: 'Apache Avro — бинарный формат сериализации, созданный для Hadoop и Kafka. Ключевая особенность: схема хранится ОТДЕЛЬНО от данных. Данные без схемы — просто байты. Это даёт максимальную компактность и поддержку эволюции схем.' },
        { type: 'heading', value: 'Avro Schema' },
        { type: 'code', language: 'java', value: '// Avro Schema (JSON формат):\n// {\n//   "type": "record",\n//   "name": "User",\n//   "namespace": "com.example",\n//   "fields": [\n//     {"name": "userId", "type": "long"},\n//     {"name": "name",   "type": "string"},\n//     {"name": "email",  "type": ["null", "string"], "default": null},\n//     {"name": "age",    "type": "int", "default": 0},\n//     {"name": "role",   "type": {\n//       "type": "enum",\n//       "name": "Role",\n//       "symbols": ["USER", "ADMIN", "MODERATOR"]\n//     }}\n//   ]\n// }\n//\n// Типы: null, boolean, int, long, float, double, bytes, string\n// Сложные: record, enum, array, map, union, fixed\n// Union: ["null", "string"] — nullable string' },
        { type: 'heading', value: 'Принцип работы Avro' },
        { type: 'code', language: 'java', value: '// Как Avro сериализует данные:\n//\n// JSON (70 байт):\n// {"userId": 123, "name": "Иван", "email": "ivan@mail.ru", "age": 30}\n//  ^^^^^^^^        ^^^^^^          ^^^^^^^                  ^^^^^\n//  ключи занимают ~40% объёма!\n//\n// Avro (25 байт):\n// [F6 01] [08 И в а н] [02 18 ivan@mail.ru] [3C]\n//  ^^^      ^^^          ^^^                  ^^^\n//  userId   name         email(union+string)   age\n//\n// Ключей НЕТ! Avro знает порядок полей из схемы.\n// Числа закодированы ZigZag Variable-Length encoding.\n// Строки: длина + байты (без кавычек).\n//\n// Для чтения нужна СХЕМА. Без неё байты бессмысленны.' },
        { type: 'heading', value: 'Writer Schema vs Reader Schema' },
        { type: 'text', value: 'Avro поддерживает Schema Evolution: данные, записанные со старой схемой (Writer Schema), можно прочитать с новой (Reader Schema). Avro автоматически конвертирует: добавляет default для новых полей, игнорирует удалённые.' },
        { type: 'code', language: 'java', value: '// Schema Evolution:\n//\n// Writer Schema v1: {userId, name}\n// Writer Schema v2: {userId, name, email (default=null)}\n// Reader Schema v3: {userId, name, email, role (default="USER")}\n//\n// Чтение данных v1 через Reader v3:\n// - userId: читается из данных\n// - name: читается из данных\n// - email: НЕТ в данных -> используется default (null)\n// - role: НЕТ в данных -> используется default ("USER")\n//\n// Чтение данных v2 через Reader v3:\n// - userId: читается из данных\n// - name: читается из данных\n// - email: читается из данных\n// - role: НЕТ в данных -> используется default ("USER")\n//\n// Avro делает это АВТОМАТИЧЕСКИ!' },
        { type: 'tip', value: 'Avro + Schema Registry = стандарт для Kafka в production. Schema Registry хранит все версии схем и проверяет совместимость при регистрации новой версии. Это предотвращает поломку consumer-ов.' }
      ]
    },
    {
      id: 4,
      title: 'Protocol Buffers (Protobuf)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Protocol Buffers (Protobuf) — бинарный формат сериализации от Google. Каждое поле имеет числовой тег вместо имени. Используется в gRPC, Google Cloud и многих высоконагруженных системах. Строго типизированный с генерацией кода.' },
        { type: 'heading', value: 'Proto файл' },
        { type: 'code', language: 'java', value: '// Определение схемы в .proto файле:\n//\n// syntax = "proto3";\n// package com.example;\n//\n// message User {\n//   int64  user_id = 1;   // тег 1\n//   string name    = 2;   // тег 2\n//   string email   = 3;   // тег 3\n//   int32  age     = 4;   // тег 4\n//   Role   role    = 5;   // тег 5\n// }\n//\n// enum Role {\n//   USER      = 0;\n//   ADMIN     = 1;\n//   MODERATOR = 2;\n// }\n//\n// message OrderEvent {\n//   string order_id   = 1;\n//   User   customer   = 2; // вложенный message\n//   repeated Item items = 3; // массив\n//   google.protobuf.Timestamp created_at = 4;\n// }\n//\n// Теги (1, 2, 3...) НИКОГДА не меняются!\n// Это ключ к обратной совместимости.' },
        { type: 'heading', value: 'Как Protobuf кодирует данные' },
        { type: 'code', language: 'java', value: '// Protobuf Wire Format:\n// Каждое поле: [tag + wire_type] [length?] [value]\n//\n// User {userId=123, name="Иван", email="ivan@mail.ru", age=30}\n//\n// Байты:\n// [08] [7B]                        -> field 1 (userId), varint 123\n// [12] [08] [И в а н]              -> field 2 (name), len=8, UTF-8\n// [1A] [0C] [ivan@mail.ru]         -> field 3 (email), len=12\n// [20] [1E]                        -> field 4 (age), varint 30\n//\n// Wire types:\n// 0 = Varint (int32, int64, bool, enum)\n// 1 = 64-bit (fixed64, double)\n// 2 = Length-delimited (string, bytes, embedded messages)\n// 5 = 32-bit (fixed32, float)\n//\n// Нет имён полей — только числовые теги!\n// Это компактнее JSON, но нужна .proto схема для чтения.' },
        { type: 'heading', value: 'Avro vs Protobuf' },
        { type: 'list', value: [
          'Avro: схема в JSON, нет генерации кода, идеален для Kafka + Schema Registry',
          'Protobuf: схема в .proto, генерация кода, идеален для gRPC и Google-стек',
          'Avro: writer/reader schema resolution (динамическая)',
          'Protobuf: добавляй поля с новыми тегами (обратная совместимость через теги)',
          'Avro: немного компактнее (нет тегов в данных)',
          'Protobuf: быстрее сериализация/десериализация (сгенерированный код)',
          'Оба: бинарные, компактные, с эволюцией схем'
        ] },
        { type: 'warning', value: 'В Protobuf НИКОГДА не меняйте тег поля (число после =). Тег 1 — это навсегда user_id. Можно добавлять новые поля с новыми тегами, можно удалять поля (тег резервируется), но нельзя переиспользовать старые теги.' }
      ]
    },
    {
      id: 5,
      title: 'Schema Registry и эволюция схем',
      type: 'theory',
      content: [
        { type: 'text', value: 'Schema Registry — центральный сервис для хранения и управления схемами сообщений. Confluent Schema Registry — стандартное решение для Kafka. Он хранит все версии схем и проверяет совместимость при регистрации новой версии.' },
        { type: 'heading', value: 'Как работает Schema Registry' },
        { type: 'code', language: 'java', value: '// Schema Registry Flow:\n//\n// 1. Producer регистрирует схему:\n//    POST /subjects/users-value/versions\n//    Body: {"schema": "{...avro schema...}"}\n//    Response: {"id": 1}\n//\n// 2. Producer сериализует сообщение:\n//    [Magic Byte][Schema ID (4 bytes)][Avro Data]\n//    [0x00]      [00 00 00 01]        [F6 01 08 ...]\n//\n// 3. Consumer читает Schema ID из сообщения\n// 4. Consumer запрашивает схему из Registry:\n//    GET /schemas/ids/1\n//    Response: {"schema": "{...avro schema...}"}\n// 5. Consumer десериализует данные по схеме\n//\n// Схема кэшируется — запрос в Registry только один раз!\n// Каждое сообщение имеет overhead всего 5 байт (magic + schema ID)' },
        { type: 'heading', value: 'Типы совместимости' },
        { type: 'code', language: 'java', value: '// Типы совместимости в Schema Registry:\n//\n// BACKWARD (по умолчанию):\n//   Новый consumer может читать данные старого producer\n//   Можно: добавлять поля с default, удалять поля\n//   Нельзя: добавлять поля без default\n//\n// FORWARD:\n//   Старый consumer может читать данные нового producer\n//   Можно: добавлять поля, удалять поля с default\n//   Нельзя: удалять поля без default\n//\n// FULL:\n//   BACKWARD + FORWARD\n//   Можно: добавлять/удалять поля с default\n//   Самый строгий и безопасный режим\n//\n// NONE:\n//   Без проверки (опасно!)\n//\n// Пример BACKWARD совместимости:\n// v1: {userId, name}\n// v2: {userId, name, email (default=null)}  // OK: новое поле с default\n// v3: {userId, name, email, phone}          // ОШИБКА: phone без default!\n//     Registry отклонит v3!' },
        { type: 'heading', value: 'Правила эволюции схем' },
        { type: 'list', value: [
          'ВСЕГДА добавляйте default для новых полей',
          'НИКОГДА не удаляйте поле без default в FORWARD режиме',
          'НИКОГДА не меняйте тип поля (int -> string)',
          'НИКОГДА не переименовывайте поля (это удаление + добавление)',
          'Используйте FULL совместимость для максимальной безопасности',
          'Каждый subject (topic) имеет свою историю версий схем'
        ] },
        { type: 'tip', value: 'Naming Strategy определяет как топики маппятся на subjects в Registry. TopicNameStrategy (по умолчанию): topic-name-key / topic-name-value. RecordNameStrategy: полное имя record. TopicRecordNameStrategy: topic + record name.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Сериализатор сообщений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему сериализации с поддержкой JSON и бинарного формата (упрощённый Avro). Сравните размеры сериализованных данных.',
      requirements: [
        'Класс Message с полями: id (int), type (String), payload (String), timestamp (long)',
        'JsonSerializer: сериализация/десериализация в JSON строку',
        'BinarySerializer: сериализация/десериализация в компактный бинарный формат',
        'SchemaRegistry: хранение и получение схем по ID',
        'Сравнение размеров JSON vs Binary для одного и того же сообщения',
        'Показать десериализацию обратно в объект'
      ],
      hint: 'Для BinarySerializer запишите int как 4 байта, String как длина (4 байта) + символы, long как 8 байт. Используйте ByteArrayOutputStream.',
      expectedOutput: '=== Сериализация сообщений ===\n\nОригинал: Message{id=1, type="order.created", payload="Заказ #1001", timestamp=1700000000}\n\nJSON:\n  Данные: {"id":1,"type":"order.created","payload":"Заказ #1001","timestamp":1700000000}\n  Размер: 78 байт\n\nBinary:\n  Данные: [00 00 00 01 0D 6F 72 64 65 72 ...] (hex)\n  Размер: 41 байт\n  Экономия: 47%\n\nSchemaRegistry:\n  Зарегистрирована схема id=1: [id:int, type:string, payload:string, timestamp:long]\n\nДесериализация JSON: Message{id=1, type="order.created", payload="Заказ #1001", timestamp=1700000000}\nДесериализация Binary: Message{id=1, type="order.created", payload="Заказ #1001", timestamp=1700000000}\n\nПроверка: JSON == Binary -> true',
      solution: `import java.io.*;
import java.util.*;

public class Main {
    static class Message {
        int id;
        String type;
        String payload;
        long timestamp;

        Message(int id, String type, String payload, long timestamp) {
            this.id = id;
            this.type = type;
            this.payload = payload;
            this.timestamp = timestamp;
        }

        public String toString() {
            return "Message{id=" + id + ", type=\\"" + type
                + "\\", payload=\\"" + payload
                + "\\", timestamp=" + timestamp + "}";
        }

        public boolean equals(Object o) {
            if (!(o instanceof Message)) return false;
            Message m = (Message) o;
            return id == m.id && timestamp == m.timestamp
                && type.equals(m.type) && payload.equals(m.payload);
        }
    }

    // JSON Serializer
    static String toJson(Message msg) {
        return "{\\"id\\":" + msg.id
            + ",\\"type\\":\\"" + msg.type + "\\""
            + ",\\"payload\\":\\"" + msg.payload + "\\""
            + ",\\"timestamp\\":" + msg.timestamp + "}";
    }

    static Message fromJson(String json) {
        json = json.substring(1, json.length() - 1);
        Map<String, String> map = new LinkedHashMap<>();
        String[] parts = json.split(",(?=\\"\\\\w)");
        for (String part : parts) {
            String[] kv = part.split(":", 2);
            String key = kv[0].replace("\\"", "");
            String val = kv[1].replace("\\"", "");
            map.put(key, val);
        }
        return new Message(
            Integer.parseInt(map.get("id")),
            map.get("type"),
            map.get("payload"),
            Long.parseLong(map.get("timestamp"))
        );
    }

    // Binary Serializer
    static byte[] toBinary(Message msg) throws IOException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        DataOutputStream dos = new DataOutputStream(bos);
        dos.writeInt(msg.id);
        dos.writeUTF(msg.type);
        dos.writeUTF(msg.payload);
        dos.writeLong(msg.timestamp);
        dos.flush();
        return bos.toByteArray();
    }

    static Message fromBinary(byte[] data) throws IOException {
        DataInputStream dis = new DataInputStream(new ByteArrayInputStream(data));
        int id = dis.readInt();
        String type = dis.readUTF();
        String payload = dis.readUTF();
        long timestamp = dis.readLong();
        return new Message(id, type, payload, timestamp);
    }

    static String toHex(byte[] bytes, int limit) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < Math.min(bytes.length, limit); i++) {
            if (i > 0) sb.append(" ");
            sb.append(String.format("%02X", bytes[i]));
        }
        if (bytes.length > limit) sb.append(" ...");
        return sb.toString();
    }

    // Schema Registry
    static Map<Integer, String> schemas = new HashMap<>();

    static int registerSchema(String schema) {
        int id = schemas.size() + 1;
        schemas.put(id, schema);
        return id;
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Сериализация сообщений ===\\n");

        Message msg = new Message(1, "order.created", "Заказ #1001", 1700000000L);
        System.out.println("Оригинал: " + msg);

        // JSON
        String json = toJson(msg);
        System.out.println("\\nJSON:");
        System.out.println("  Данные: " + json);
        System.out.println("  Размер: " + json.getBytes().length + " байт");

        // Binary
        byte[] binary = toBinary(msg);
        System.out.println("\\nBinary:");
        System.out.println("  Данные: [" + toHex(binary, 10) + "] (hex)");
        System.out.println("  Размер: " + binary.length + " байт");
        int savings = 100 - (binary.length * 100 / json.getBytes().length);
        System.out.println("  Экономия: " + savings + "%");

        // Schema Registry
        int schemaId = registerSchema("[id:int, type:string, payload:string, timestamp:long]");
        System.out.println("\\nSchemaRegistry:");
        System.out.println("  Зарегистрирована схема id=" + schemaId + ": " + schemas.get(schemaId));

        // Deserialization
        Message fromJ = fromJson(json);
        Message fromB = fromBinary(binary);
        System.out.println("\\nДесериализация JSON: " + fromJ);
        System.out.println("Десериализация Binary: " + fromB);

        System.out.println("\\nПроверка: JSON == Binary -> " + fromJ.equals(fromB));
    }
}`,
      explanation: 'JSON — текстовый и читаемый, но избыточен из-за повторения ключей. Бинарный формат (аналог Avro) убирает ключи и использует компактное кодирование чисел, экономя ~50% объёма. Schema Registry хранит схемы централизованно, позволяя consumer-ам знать структуру данных. В production Kafka используйте Avro + Confluent Schema Registry.'
    }
  ]
}
