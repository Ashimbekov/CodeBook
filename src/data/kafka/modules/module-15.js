export default {
  id: 15,
  title: 'Практикум: Реальные сценарии',
  description: 'Реальные production сценарии: уведомления, аналитика в реальном времени, распределённый кэш, rate limiting, audit log.',
  lessons: [
    {
      id: 1,
      title: 'Система уведомлений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему уведомлений через Kafka: отправка email, SMS, push-уведомлений по разным каналам в зависимости от типа события и настроек пользователя.',
      requirements: [
        'Класс NotificationRouter — маршрутизация по каналам',
        'Настройки пользователя: какие каналы включены (email, sms, push)',
        'Типы уведомлений: ORDER_CREATED, PAYMENT_RECEIVED, ORDER_SHIPPED',
        'Каждый тип уведомления имеет свой шаблон для каждого канала',
        'Показать обработку 3 событий с разными настройками пользователей',
        'Статистика: сколько уведомлений отправлено по каждому каналу'
      ],
      hint: 'UserPreferences: Map<String, Set<String>> (userId -> Set(email,sms,push)). Templates: Map<String, Map<String, String>> (eventType -> channel -> template). Router проверяет preferences и отправляет по включённым каналам.',
      expectedOutput: '=== Система уведомлений ===\n\nНастройки пользователей:\n  user-1 (Иван): [email, push]\n  user-2 (Мария): [email, sms, push]\n  user-3 (Алексей): [email]\n\nОбработка событий:\n  OrderCreated(user-1, ORD-001):\n    [email] -> Иван, ваш заказ ORD-001 создан!\n    [push]  -> Новый заказ ORD-001\n  PaymentReceived(user-2, ORD-002):\n    [email] -> Мария, оплата за ORD-002 получена!\n    [sms]   -> Оплата ORD-002 подтверждена\n    [push]  -> Оплата получена\n  OrderShipped(user-3, ORD-003):\n    [email] -> Алексей, заказ ORD-003 отправлен!\n\nСтатистика:\n  email: 3 уведомлений\n  sms: 1 уведомлений\n  push: 2 уведомлений\n  Всего: 6',
      solution: `import java.util.*;

public class Main {
    static Map<String, String> userNames = new LinkedHashMap<>();
    static Map<String, Set<String>> userPrefs = new LinkedHashMap<>();
    static Map<String, Integer> channelStats = new LinkedHashMap<>();

    static void addUser(String id, String name, String... channels) {
        userNames.put(id, name);
        userPrefs.put(id, new LinkedHashSet<>(Arrays.asList(channels)));
    }

    static String getTemplate(String eventType, String channel, String userName,
                               String orderId) {
        switch (eventType + ":" + channel) {
            case "OrderCreated:email":
                return userName + ", ваш заказ " + orderId + " создан!";
            case "OrderCreated:push":
                return "Новый заказ " + orderId;
            case "OrderCreated:sms":
                return "Заказ " + orderId + " создан";
            case "PaymentReceived:email":
                return userName + ", оплата за " + orderId + " получена!";
            case "PaymentReceived:sms":
                return "Оплата " + orderId + " подтверждена";
            case "PaymentReceived:push":
                return "Оплата получена";
            case "OrderShipped:email":
                return userName + ", заказ " + orderId + " отправлен!";
            case "OrderShipped:sms":
                return "Заказ " + orderId + " в пути";
            case "OrderShipped:push":
                return "Заказ отправлен";
            default:
                return "Уведомление";
        }
    }

    static void processEvent(String eventType, String userId, String orderId) {
        String name = userNames.get(userId);
        Set<String> channels = userPrefs.get(userId);
        System.out.println("  " + eventType + "(" + userId + ", " + orderId + "):");
        for (String channel : channels) {
            String msg = getTemplate(eventType, channel, name, orderId);
            String pad = channel.length() < 4 ? " " : "";
            System.out.println("    [" + channel + "]" + pad + " -> " + msg);
            channelStats.merge(channel, 1, Integer::sum);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Система уведомлений ===\\n");

        addUser("user-1", "Иван", "email", "push");
        addUser("user-2", "Мария", "email", "sms", "push");
        addUser("user-3", "Алексей", "email");

        System.out.println("Настройки пользователей:");
        for (Map.Entry<String, Set<String>> e : userPrefs.entrySet()) {
            System.out.println("  " + e.getKey() + " (" + userNames.get(e.getKey())
                + "): " + new ArrayList<>(e.getValue()));
        }

        channelStats.put("email", 0);
        channelStats.put("sms", 0);
        channelStats.put("push", 0);

        System.out.println("\\nОбработка событий:");
        processEvent("OrderCreated", "user-1", "ORD-001");
        processEvent("PaymentReceived", "user-2", "ORD-002");
        processEvent("OrderShipped", "user-3", "ORD-003");

        int total = channelStats.values().stream().mapToInt(Integer::intValue).sum();
        System.out.println("\\nСтатистика:");
        for (Map.Entry<String, Integer> e : channelStats.entrySet()) {
            System.out.println("  " + e.getKey() + ": " + e.getValue() + " уведомлений");
        }
        System.out.println("  Всего: " + total);
    }
}`,
      explanation: 'Система уведомлений через Kafka: каждый тип события публикуется в topic. NotificationService подписывается, проверяет настройки пользователя и маршрутизирует по каналам. В production: отдельные Kafka topics для каждого канала (email-notifications, sms-notifications), отдельные consumer groups с разными SLA.'
    },
    {
      id: 2,
      title: 'Аналитика в реальном времени',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте real-time аналитику: подсчёт метрик из потока событий с окнами времени (tumbling windows).',
      requirements: [
        'Поток событий: покупки с timestamp, amount, category',
        'Tumbling Window: агрегация по фиксированным интервалам (10 секунд)',
        'Метрики в окне: count, sum, avg, max по категориям',
        'Показать результаты для 3 окон',
        'Итоговая статистика по всем окнам',
        'Визуализация: простая ASCII гистограмма'
      ],
      hint: 'Window = timestamp / windowSizeMs. Для каждого окна храните: count, sum, max. GroupBy category внутри каждого окна.',
      expectedOutput: '=== Real-time Аналитика ===\n\nПоток покупок:\n  t=1000  category=electronics  amount=$500\n  t=3000  category=books        amount=$30\n  t=5000  category=electronics  amount=$1200\n  t=8000  category=food         amount=$50\n  t=12000 category=electronics  amount=$300\n  t=15000 category=books        amount=$45\n  t=18000 category=food         amount=$80\n  t=22000 category=electronics  amount=$800\n\nОкно [0-10s]:\n  electronics: count=2, sum=$1700, avg=$850\n  books:       count=1, sum=$30, avg=$30\n  food:        count=1, sum=$50, avg=$50\n\nОкно [10-20s]:\n  electronics: count=1, sum=$300, avg=$300\n  books:       count=1, sum=$45, avg=$45\n  food:        count=1, sum=$80, avg=$80\n\nОкно [20-30s]:\n  electronics: count=1, sum=$800, avg=$800\n\nИтого по категориям:\n  electronics: $3300 ████████████████\n  food:        $130  █\n  books:       $75   █',
      solution: `import java.util.*;

public class Main {
    static class Purchase {
        long timestamp;
        String category;
        int amount;

        Purchase(long ts, String cat, int amount) {
            this.timestamp = ts;
            this.category = cat;
            this.amount = amount;
        }
    }

    static long windowSize = 10000; // 10 seconds

    static Map<Long, Map<String, int[]>> windows = new TreeMap<>();
    // int[] = {count, sum}

    static void addToWindow(Purchase p) {
        long windowStart = (p.timestamp / windowSize) * windowSize;
        windows.computeIfAbsent(windowStart, k -> new LinkedHashMap<>());
        Map<String, int[]> window = windows.get(windowStart);
        int[] stats = window.computeIfAbsent(p.category, k -> new int[]{0, 0});
        stats[0]++; // count
        stats[1] += p.amount; // sum
    }

    public static void main(String[] args) {
        System.out.println("=== Real-time Аналитика ===\\n");

        List<Purchase> stream = List.of(
            new Purchase(1000, "electronics", 500),
            new Purchase(3000, "books", 30),
            new Purchase(5000, "electronics", 1200),
            new Purchase(8000, "food", 50),
            new Purchase(12000, "electronics", 300),
            new Purchase(15000, "books", 45),
            new Purchase(18000, "food", 80),
            new Purchase(22000, "electronics", 800)
        );

        System.out.println("Поток покупок:");
        for (Purchase p : stream) {
            System.out.printf("  t=%-5d category=%-12s amount=$%d%n",
                p.timestamp, p.category, p.amount);
            addToWindow(p);
        }

        Map<String, Integer> totalByCategory = new LinkedHashMap<>();

        for (Map.Entry<Long, Map<String, int[]>> wEntry : windows.entrySet()) {
            long wStart = wEntry.getKey();
            long wEnd = wStart + windowSize;
            System.out.println("\\nОкно [" + (wStart / 1000) + "-" + (wEnd / 1000) + "s]:");

            for (Map.Entry<String, int[]> cEntry : wEntry.getValue().entrySet()) {
                String cat = cEntry.getKey();
                int count = cEntry.getValue()[0];
                int sum = cEntry.getValue()[1];
                int avg = sum / count;
                String pad = " ".repeat(Math.max(0, 13 - cat.length()));
                System.out.println("  " + cat + ":" + pad + "count=" + count
                    + ", sum=$" + sum + ", avg=$" + avg);

                totalByCategory.merge(cat, sum, Integer::sum);
            }
        }

        // Histogram
        int maxTotal = totalByCategory.values().stream()
            .mapToInt(Integer::intValue).max().orElse(1);

        System.out.println("\\nИтого по категориям:");
        for (Map.Entry<String, Integer> e : totalByCategory.entrySet()) {
            String cat = e.getKey();
            int total = e.getValue();
            int bars = Math.max(1, (total * 16) / maxTotal);
            String pad = " ".repeat(Math.max(0, 13 - cat.length()));
            System.out.println("  " + cat + ":" + pad + "$" + total + " "
                + "█".repeat(bars));
        }
    }
}`,
      explanation: 'Tumbling Windows — фиксированные неперекрывающиеся окна времени для агрегации потока данных. Каждое событие попадает ровно в одно окно. В Kafka Streams: KStream.groupByKey().windowedBy(TimeWindows.of(Duration.ofSeconds(10))).count(). Используется для: real-time dashboards, аномалии detection, billing, rate counting.'
    },
    {
      id: 3,
      title: 'Распределённый кэш через события',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте распределённый кэш, который синхронизируется через Kafka events. Все ноды получают одинаковые обновления.',
      requirements: [
        'Класс CacheNode — локальный кэш на каждой ноде',
        'Kafka topic "cache-updates" — канал синхронизации',
        'Операции: put, delete, invalidate',
        'Каждая нода подписана на cache-updates и обновляет свой кэш',
        'Показать: обновление на node-1 -> синхронизация на node-2, node-3',
        'Проверить: все ноды имеют одинаковые данные'
      ],
      hint: 'При put/delete нода публикует событие CacheUpdated в topic. Все ноды (включая отправителя) применяют обновление из topic. Это обеспечивает одинаковый порядок операций.',
      expectedOutput: '=== Распределённый кэш ===\n\nНоды: [node-1, node-2, node-3]\n\nОперации:\n  [node-1] PUT user:1 = "Иван"\n  -> cache-updates: {op=PUT, key=user:1, value="Иван"}\n  [node-1] cache updated: user:1 = "Иван"\n  [node-2] cache updated: user:1 = "Иван"\n  [node-3] cache updated: user:1 = "Иван"\n\n  [node-2] PUT user:2 = "Мария"\n  -> cache-updates: {op=PUT, key=user:2, value="Мария"}\n  [node-1] cache updated: user:2 = "Мария"\n  [node-2] cache updated: user:2 = "Мария"\n  [node-3] cache updated: user:2 = "Мария"\n\n  [node-3] DELETE user:1\n  -> cache-updates: {op=DELETE, key=user:1}\n  [node-1] cache deleted: user:1\n  [node-2] cache deleted: user:1\n  [node-3] cache deleted: user:1\n\nСостояние кэшей:\n  node-1: {user:2=Мария}\n  node-2: {user:2=Мария}\n  node-3: {user:2=Мария}\n  Синхронизация: OK',
      solution: `import java.util.*;

public class Main {
    static class CacheNode {
        String name;
        Map<String, String> cache = new LinkedHashMap<>();

        CacheNode(String name) { this.name = name; }

        void applyPut(String key, String value) {
            cache.put(key, value);
            System.out.println("  [" + name + "] cache updated: " + key + " = \\"" + value + "\\"");
        }

        void applyDelete(String key) {
            cache.remove(key);
            System.out.println("  [" + name + "] cache deleted: " + key);
        }
    }

    static List<CacheNode> nodes = new ArrayList<>();

    static void broadcast(String op, String key, String value) {
        if (op.equals("PUT")) {
            System.out.println("  -> cache-updates: {op=PUT, key=" + key
                + ", value=\\"" + value + "\\"}");
            for (CacheNode node : nodes) {
                node.applyPut(key, value);
            }
        } else {
            System.out.println("  -> cache-updates: {op=DELETE, key=" + key + "}");
            for (CacheNode node : nodes) {
                node.applyDelete(key);
            }
        }
    }

    static void put(String nodeName, String key, String value) {
        System.out.println("  [" + nodeName + "] PUT " + key + " = \\"" + value + "\\"");
        broadcast("PUT", key, value);
    }

    static void delete(String nodeName, String key) {
        System.out.println("  [" + nodeName + "] DELETE " + key);
        broadcast("DELETE", key, null);
    }

    public static void main(String[] args) {
        System.out.println("=== Распределённый кэш ===\\n");

        nodes.add(new CacheNode("node-1"));
        nodes.add(new CacheNode("node-2"));
        nodes.add(new CacheNode("node-3"));

        List<String> nodeNames = new ArrayList<>();
        for (CacheNode n : nodes) nodeNames.add(n.name);
        System.out.println("Ноды: " + nodeNames + "\\n");

        System.out.println("Операции:");
        put("node-1", "user:1", "Иван");
        System.out.println();
        put("node-2", "user:2", "Мария");
        System.out.println();
        delete("node-3", "user:1");

        System.out.println("\\nСостояние кэшей:");
        boolean synced = true;
        Map<String, String> first = nodes.get(0).cache;
        for (CacheNode node : nodes) {
            System.out.println("  " + node.name + ": " + node.cache);
            if (!node.cache.equals(first)) synced = false;
        }
        System.out.println("  Синхронизация: " + (synced ? "OK" : "FAIL"));
    }
}`,
      explanation: 'Распределённый кэш через Kafka: все изменения публикуются в compacted topic. Каждая нода подписана и применяет обновления. Compacted topic гарантирует, что при перезапуске нода восстановит полное состояние кэша. В production: Kafka Streams KTable для автоматического управления state. Redis используйте для hot cache, Kafka — для синхронизации.'
    },
    {
      id: 4,
      title: 'Rate Limiter через Kafka',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте распределённый Rate Limiter: подсчёт запросов через Kafka для ограничения частоты вызовов API.',
      requirements: [
        'Класс RateLimiter с окном времени и максимальным количеством запросов',
        'Sliding Window: подсчёт запросов за последние N секунд',
        'Каждый запрос записывается в Kafka topic',
        'Consumer подсчитывает запросы по пользователю',
        'Отклонение запросов при превышении лимита',
        'Показать: нормальные запросы и отклонённые'
      ],
      hint: 'Sliding window: храните timestamps запросов по userId. checkLimit() удаляет старые (> windowMs) и проверяет count < maxRequests.',
      expectedOutput: '=== Rate Limiter ===\n\nНастройки: max 3 запроса за 10 секунд\n\nЗапросы:\n  t=1000  user-1 GET /api/data  -> ALLOWED (1/3)\n  t=2000  user-1 GET /api/data  -> ALLOWED (2/3)\n  t=3000  user-2 GET /api/data  -> ALLOWED (1/3)\n  t=4000  user-1 GET /api/data  -> ALLOWED (3/3)\n  t=5000  user-1 GET /api/data  -> REJECTED (лимит 3/3)\n  t=6000  user-2 GET /api/data  -> ALLOWED (2/3)\n  t=7000  user-1 GET /api/data  -> REJECTED (лимит 3/3)\n  t=12000 user-1 GET /api/data  -> ALLOWED (1/3) (окно сдвинулось)\n\nСтатистика:\n  user-1: 4 allowed, 2 rejected\n  user-2: 2 allowed, 0 rejected',
      solution: `import java.util.*;

public class Main {
    static long windowMs = 10000;
    static int maxRequests = 3;
    static Map<String, List<Long>> requestLog = new LinkedHashMap<>();
    static Map<String, int[]> stats = new LinkedHashMap<>(); // [allowed, rejected]

    static boolean checkLimit(String userId, long timestamp) {
        List<Long> timestamps = requestLog.computeIfAbsent(userId, k -> new ArrayList<>());

        // Remove expired
        timestamps.removeIf(ts -> timestamp - ts > windowMs);

        if (timestamps.size() < maxRequests) {
            timestamps.add(timestamp);
            stats.computeIfAbsent(userId, k -> new int[]{0, 0})[0]++;
            int count = timestamps.size();
            System.out.printf("  t=%-5d %s GET /api/data  -> ALLOWED (%d/%d)%s%n",
                timestamp, userId, count, maxRequests,
                count == 1 && timestamp > windowMs ? " (окно сдвинулось)" : "");
            return true;
        } else {
            stats.computeIfAbsent(userId, k -> new int[]{0, 0})[1]++;
            System.out.printf("  t=%-5d %s GET /api/data  -> REJECTED (лимит %d/%d)%n",
                timestamp, userId, maxRequests, maxRequests);
            return false;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Rate Limiter ===\\n");
        System.out.println("Настройки: max " + maxRequests + " запроса за "
            + (windowMs / 1000) + " секунд\\n");

        System.out.println("Запросы:");
        checkLimit("user-1", 1000);
        checkLimit("user-1", 2000);
        checkLimit("user-2", 3000);
        checkLimit("user-1", 4000);
        checkLimit("user-1", 5000);
        checkLimit("user-2", 6000);
        checkLimit("user-1", 7000);
        checkLimit("user-1", 12000);

        System.out.println("\\nСтатистика:");
        for (Map.Entry<String, int[]> e : stats.entrySet()) {
            System.out.println("  " + e.getKey() + ": " + e.getValue()[0]
                + " allowed, " + e.getValue()[1] + " rejected");
        }
    }
}`,
      explanation: 'Rate Limiter через Kafka: каждый API запрос публикуется в topic. Consumer подсчитывает запросы по пользователю в sliding window. При превышении лимита — запрос отклоняется. В production: Redis для fast path (in-memory check), Kafka для persist и distributed counting. Sliding window через sorted set в Redis или Kafka Streams windowed aggregation.'
    },
    {
      id: 5,
      title: 'Audit Log',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему Audit Log: все действия пользователей записываются в неизменяемый журнал через Kafka. Поддержка поиска и фильтрации.',
      requirements: [
        'Класс AuditEntry с полями: timestamp, userId, action, resource, details',
        'Запись audit events через Kafka topic',
        'Поиск: по userId, по action, по временному диапазону',
        'Неизменяемый журнал: записи нельзя удалить или изменить',
        'Compliance report: кто что делал за период',
        'Показать аудит для нескольких пользователей и действий'
      ],
      hint: 'AuditLog — append-only List<AuditEntry>. Методы search: stream().filter() по различным критериям. Kafka compacted topic НЕ подходит для аудита — нужен обычный retention.',
      expectedOutput: '=== Audit Log ===\n\nЗаписи аудита:\n  [10:00:01] admin   | LOGIN      | system    | IP: 192.168.1.1\n  [10:00:05] admin   | CREATE     | user:ivan | role=editor\n  [10:00:10] ivan    | LOGIN      | system    | IP: 192.168.1.50\n  [10:00:15] ivan    | UPDATE     | doc:123   | title changed\n  [10:00:20] admin   | DELETE     | user:test | cleanup\n  [10:00:25] ivan    | DOWNLOAD   | doc:123   | format=pdf\n  [10:00:30] admin   | LOGOUT     | system    |\n\nПоиск по userId="ivan":\n  [10:00:10] LOGIN    | system  | IP: 192.168.1.50\n  [10:00:15] UPDATE   | doc:123 | title changed\n  [10:00:25] DOWNLOAD | doc:123 | format=pdf\n\nПоиск по action="LOGIN":\n  [10:00:01] admin | system | IP: 192.168.1.1\n  [10:00:10] ivan  | system | IP: 192.168.1.50\n\nCompliance Report:\n  admin: 4 действия (LOGIN, CREATE, DELETE, LOGOUT)\n  ivan: 3 действия (LOGIN, UPDATE, DOWNLOAD)',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    static class AuditEntry {
        String timestamp;
        String userId;
        String action;
        String resource;
        String details;

        AuditEntry(String ts, String userId, String action, String resource, String details) {
            this.timestamp = ts;
            this.userId = userId;
            this.action = action;
            this.resource = resource;
            this.details = details;
        }
    }

    static List<AuditEntry> auditLog = new ArrayList<>();

    static void log(String ts, String userId, String action, String resource, String details) {
        auditLog.add(new AuditEntry(ts, userId, action, resource, details));
    }

    static void printEntry(AuditEntry e, boolean showUser) {
        String user = showUser ? String.format("%-6s| ", e.userId) : "";
        String det = e.details.isEmpty() ? "" : " | " + e.details;
        System.out.println("  [" + e.timestamp + "] " + user
            + String.format("%-9s", e.action) + "| " + e.resource + det);
    }

    public static void main(String[] args) {
        System.out.println("=== Audit Log ===\\n");

        log("10:00:01", "admin", "LOGIN",    "system",    "IP: 192.168.1.1");
        log("10:00:05", "admin", "CREATE",   "user:ivan", "role=editor");
        log("10:00:10", "ivan",  "LOGIN",    "system",    "IP: 192.168.1.50");
        log("10:00:15", "ivan",  "UPDATE",   "doc:123",   "title changed");
        log("10:00:20", "admin", "DELETE",   "user:test", "cleanup");
        log("10:00:25", "ivan",  "DOWNLOAD", "doc:123",   "format=pdf");
        log("10:00:30", "admin", "LOGOUT",   "system",    "");

        System.out.println("Записи аудита:");
        for (AuditEntry e : auditLog) {
            printEntry(e, true);
        }

        // Search by userId
        System.out.println("\\nПоиск по userId=\\"ivan\\":");
        auditLog.stream()
            .filter(e -> e.userId.equals("ivan"))
            .forEach(e -> printEntry(e, false));

        // Search by action
        System.out.println("\\nПоиск по action=\\"LOGIN\\":");
        auditLog.stream()
            .filter(e -> e.action.equals("LOGIN"))
            .forEach(e -> {
                String det = e.details.isEmpty() ? "" : " | " + e.details;
                System.out.println("  [" + e.timestamp + "] "
                    + String.format("%-6s", e.userId) + "| " + e.resource + det);
            });

        // Compliance Report
        System.out.println("\\nCompliance Report:");
        Map<String, List<String>> userActions = new LinkedHashMap<>();
        for (AuditEntry e : auditLog) {
            userActions.computeIfAbsent(e.userId, k -> new ArrayList<>()).add(e.action);
        }
        for (Map.Entry<String, List<String>> e : userActions.entrySet()) {
            System.out.println("  " + e.getKey() + ": " + e.getValue().size()
                + " действия (" + String.join(", ", e.getValue()) + ")");
        }
    }
}`,
      explanation: 'Audit Log через Kafka: все действия пользователей записываются в append-only topic. Записи нельзя удалить (retention настраивается на годы). Для поиска используются проекции в Elasticsearch. Kafka обеспечивает: порядок, durability, immutability. Compliance требования (SOX, GDPR, PCI DSS) часто требуют immutable audit log.'
    },
    {
      id: 6,
      title: 'Order Processing Pipeline',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте полный pipeline обработки заказов: приём -> валидация -> обогащение -> обработка -> уведомление. Каждый этап — отдельный consumer.',
      requirements: [
        'Pipeline из 5 этапов, каждый читает из input topic и пишет в output topic',
        'Этап 1: Ingestion — приём raw заказов',
        'Этап 2: Validation — проверка полей, отклонение невалидных',
        'Этап 3: Enrichment — обогащение данными (цены, инфо о клиенте)',
        'Этап 4: Processing — бизнес-логика (скидки, налоги)',
        'Этап 5: Notification — отправка уведомления',
        'Показать прохождение заказа через все этапы и отклонение невалидного'
      ],
      hint: 'Каждый этап: читает из input-topic, обрабатывает, пишет в output-topic. Невалидные попадают в error-topic. Цепочка topics: raw -> validated -> enriched -> processed -> notifications.',
      expectedOutput: '=== Order Processing Pipeline ===\n\nPipeline: Ingestion -> Validation -> Enrichment -> Processing -> Notification\n\n--- Заказ 1: ORD-001 ---\n  [Ingestion]    Принят: {customer="Иван", item="Ноутбук"}\n  [Validation]   OK: все поля валидны\n  [Enrichment]   Обогащён: price=80000, loyalty=GOLD\n  [Processing]   Скидка GOLD 10%: 80000 -> 72000, налог: +14400 = 86400\n  [Notification] Email: "Иван, заказ ORD-001 на 86400 руб. принят!"\n  Результат: COMPLETED\n\n--- Заказ 2: ORD-002 (невалидный) ---\n  [Ingestion]    Принят: {customer="", item="Мышь"}\n  [Validation]   REJECTED: поле customer пустое\n  -> error-topic: {orderId=ORD-002, error="validation failed"}\n  Результат: REJECTED\n\n--- Заказ 3: ORD-003 ---\n  [Ingestion]    Принят: {customer="Мария", item="Клавиатура"}\n  [Validation]   OK: все поля валидны\n  [Enrichment]   Обогащён: price=5000, loyalty=SILVER\n  [Processing]   Скидка SILVER 5%: 5000 -> 4750, налог: +950 = 5700\n  [Notification] Email: "Мария, заказ ORD-003 на 5700 руб. принят!"\n  Результат: COMPLETED\n\nСтатистика pipeline:\n  Принято: 3\n  Обработано: 2\n  Отклонено: 1',
      solution: `import java.util.*;

public class Main {
    static Map<String, Integer> prices = Map.of(
        "Ноутбук", 80000, "Мышь", 3000, "Клавиатура", 5000);
    static Map<String, String> loyalty = Map.of(
        "Иван", "GOLD", "Мария", "SILVER", "Алексей", "BRONZE");
    static Map<String, Integer> discounts = Map.of(
        "GOLD", 10, "SILVER", 5, "BRONZE", 2);

    static int accepted = 0, processed = 0, rejected = 0;

    static boolean processOrder(String orderId, String customer, String item) {
        System.out.println("--- Заказ " + (accepted + rejected + 1) + ": " + orderId + " ---");

        // Stage 1: Ingestion
        if (customer.isEmpty()) {
            System.out.println("  [Ingestion]    Принят: {customer=\\"\\", item=\\"" + item + "\\"}");
        } else {
            System.out.println("  [Ingestion]    Принят: {customer=\\"" + customer
                + "\\", item=\\"" + item + "\\"}");
        }
        accepted++;

        // Stage 2: Validation
        if (customer == null || customer.isEmpty()) {
            System.out.println("  [Validation]   REJECTED: поле customer пустое");
            System.out.println("  -> error-topic: {orderId=" + orderId
                + ", error=\\"validation failed\\"}");
            System.out.println("  Результат: REJECTED");
            rejected++;
            return false;
        }
        System.out.println("  [Validation]   OK: все поля валидны");

        // Stage 3: Enrichment
        int price = prices.getOrDefault(item, 0);
        String tier = loyalty.getOrDefault(customer, "BRONZE");
        System.out.println("  [Enrichment]   Обогащён: price=" + price
            + ", loyalty=" + tier);

        // Stage 4: Processing
        int discount = discounts.getOrDefault(tier, 0);
        int discountedPrice = price - (price * discount / 100);
        int tax = discountedPrice * 20 / 100;
        int total = discountedPrice + tax;
        System.out.println("  [Processing]   Скидка " + tier + " " + discount
            + "%: " + price + " -> " + discountedPrice
            + ", налог: +" + tax + " = " + total);

        // Stage 5: Notification
        System.out.println("  [Notification] Email: \\"" + customer
            + ", заказ " + orderId + " на " + total + " руб. принят!\\"");
        System.out.println("  Результат: COMPLETED");
        processed++;
        return true;
    }

    public static void main(String[] args) {
        System.out.println("=== Order Processing Pipeline ===\\n");
        System.out.println("Pipeline: Ingestion -> Validation -> Enrichment"
            + " -> Processing -> Notification\\n");

        processOrder("ORD-001", "Иван", "Ноутбук");
        System.out.println();
        processOrder("ORD-002", "", "Мышь");
        System.out.println();
        processOrder("ORD-003", "Мария", "Клавиатура");

        System.out.println("\\nСтатистика pipeline:");
        System.out.println("  Принято: " + accepted);
        System.out.println("  Обработано: " + processed);
        System.out.println("  Отклонено: " + rejected);
    }
}`,
      explanation: 'Processing Pipeline через Kafka: каждый этап — отдельный consumer group, читающий из input topic и пишущий в output topic. Невалидные сообщения направляются в error topic. Это обеспечивает: масштабирование каждого этапа независимо, retry на каждом этапе, мониторинг lag каждого этапа. В production: Kafka Streams или Kafka Connect для построения pipelines.'
    },
    {
      id: 7,
      title: 'Распределённые транзакции (Saga)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте полную Saga для бронирования путешествия: бронирование рейса, отеля и аренда авто. При ошибке — полная отмена всех бронирований.',
      requirements: [
        'TravelBookingSaga с 3 шагами: рейс, отель, авто',
        'Каждый сервис может принять или отклонить бронирование',
        'При отклонении — компенсация всех предыдущих шагов',
        'Логирование всех шагов и компенсаций',
        'Показать 3 сценария: полный успех, ошибка на отеле, ошибка на авто',
        'Финальный статус каждого бронирования'
      ],
      hint: 'Saga шаги выполняются последовательно. При ошибке: compensate в обратном порядке. Каждый шаг возвращает booking ID для компенсации.',
      expectedOutput: '=== Travel Booking Saga ===\n\n--- Бронирование 1: Москва -> Париж ---\n  [Flight]  Бронь рейса SU-123: OK (booking=FL-001)\n  [Hotel]   Бронь отеля "Paris Inn": OK (booking=HT-001)\n  [Car]     Аренда авто "Renault": OK (booking=CR-001)\n  Результат: CONFIRMED\n\n--- Бронирование 2: Москва -> Лондон ---\n  [Flight]  Бронь рейса BA-456: OK (booking=FL-002)\n  [Hotel]   Бронь отеля "London Stay": REJECTED (нет мест)\n  Компенсация:\n  [Flight]  Отмена FL-002: возврат\n  Результат: CANCELLED (ошибка на этапе Hotel)\n\n--- Бронирование 3: Москва -> Токио ---\n  [Flight]  Бронь рейса JL-789: OK (booking=FL-003)\n  [Hotel]   Бронь отеля "Tokyo Tower": OK (booking=HT-003)\n  [Car]     Аренда авто "Toyota": REJECTED (нет в наличии)\n  Компенсация:\n  [Hotel]   Отмена HT-003: возврат\n  [Flight]  Отмена FL-003: возврат\n  Результат: CANCELLED (ошибка на этапе Car)\n\nИтого: 1 confirmed, 2 cancelled',
      solution: `import java.util.*;

public class Main {
    static int confirmed = 0, cancelled = 0;

    static class BookingResult {
        boolean success;
        String bookingId;
        String serviceName;
        String error;

        BookingResult(boolean success, String bookingId, String service, String error) {
            this.success = success;
            this.bookingId = bookingId;
            this.serviceName = service;
            this.error = error;
        }
    }

    static BookingResult bookFlight(String flight, String bookingId, boolean shouldFail) {
        if (shouldFail) {
            System.out.println("  [Flight]  Бронь рейса " + flight + ": REJECTED (нет мест)");
            return new BookingResult(false, null, "Flight", "нет мест");
        }
        System.out.println("  [Flight]  Бронь рейса " + flight + ": OK (booking=" + bookingId + ")");
        return new BookingResult(true, bookingId, "Flight", null);
    }

    static BookingResult bookHotel(String hotel, String bookingId, boolean shouldFail) {
        if (shouldFail) {
            System.out.println("  [Hotel]   Бронь отеля \\"" + hotel + "\\": REJECTED (нет мест)");
            return new BookingResult(false, null, "Hotel", "нет мест");
        }
        System.out.println("  [Hotel]   Бронь отеля \\"" + hotel + "\\": OK (booking=" + bookingId + ")");
        return new BookingResult(true, bookingId, "Hotel", null);
    }

    static BookingResult bookCar(String car, String bookingId, boolean shouldFail) {
        if (shouldFail) {
            System.out.println("  [Car]     Аренда авто \\"" + car + "\\": REJECTED (нет в наличии)");
            return new BookingResult(false, null, "Car", "нет в наличии");
        }
        System.out.println("  [Car]     Аренда авто \\"" + car + "\\": OK (booking=" + bookingId + ")");
        return new BookingResult(true, bookingId, "Car", null);
    }

    static void compensate(List<BookingResult> completed) {
        System.out.println("  Компенсация:");
        for (int i = completed.size() - 1; i >= 0; i--) {
            BookingResult r = completed.get(i);
            System.out.println("  [" + r.serviceName + "]  Отмена " + r.bookingId + ": возврат");
        }
    }

    static void bookTrip(String title, String flight, String hotel, String car,
                          String flId, String htId, String crId,
                          boolean flightFail, boolean hotelFail, boolean carFail) {
        System.out.println("--- " + title + " ---");
        List<BookingResult> completed = new ArrayList<>();

        // Step 1: Flight
        BookingResult flResult = bookFlight(flight, flId, flightFail);
        if (!flResult.success) {
            cancelled++;
            System.out.println("  Результат: CANCELLED (ошибка на этапе Flight)");
            return;
        }
        completed.add(flResult);

        // Step 2: Hotel
        BookingResult htResult = bookHotel(hotel, htId, hotelFail);
        if (!htResult.success) {
            compensate(completed);
            cancelled++;
            System.out.println("  Результат: CANCELLED (ошибка на этапе Hotel)");
            return;
        }
        completed.add(htResult);

        // Step 3: Car
        BookingResult crResult = bookCar(car, crId, carFail);
        if (!crResult.success) {
            compensate(completed);
            cancelled++;
            System.out.println("  Результат: CANCELLED (ошибка на этапе Car)");
            return;
        }
        completed.add(crResult);

        confirmed++;
        System.out.println("  Результат: CONFIRMED");
    }

    public static void main(String[] args) {
        System.out.println("=== Travel Booking Saga ===\\n");

        bookTrip("Бронирование 1: Москва -> Париж",
            "SU-123", "Paris Inn", "Renault",
            "FL-001", "HT-001", "CR-001",
            false, false, false);

        System.out.println();
        bookTrip("Бронирование 2: Москва -> Лондон",
            "BA-456", "London Stay", "BMW",
            "FL-002", "HT-002", "CR-002",
            false, true, false);

        System.out.println();
        bookTrip("Бронирование 3: Москва -> Токио",
            "JL-789", "Tokyo Tower", "Toyota",
            "FL-003", "HT-003", "CR-003",
            false, false, true);

        System.out.println("\\nИтого: " + confirmed + " confirmed, " + cancelled + " cancelled");
    }
}`,
      explanation: 'Travel Booking Saga координирует 3 независимых сервиса. Каждый шаг может быть отклонён. При ошибке — компенсации всех предыдущих шагов в обратном порядке. Это реальный production паттерн для travel industry (Booking.com, Expedia). В Kafka: каждый шаг — отправка команды в topic сервиса, ответ — событие с результатом.'
    },
    {
      id: 8,
      title: 'CDC (Change Data Capture)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Change Data Capture: отслеживание изменений в базе данных и публикация их в Kafka для синхронизации с другими системами.',
      requirements: [
        'Класс Database с таблицей и WAL (Write-Ahead Log)',
        'Каждая операция (INSERT, UPDATE, DELETE) записывается в WAL',
        'CDC Reader: читает WAL и публикует изменения в Kafka topic',
        'Downstream Consumer: обновляет search index из CDC событий',
        'Показать: изменения в БД -> WAL -> CDC -> Kafka -> Search Index',
        'Поддержка: before/after values для UPDATE'
      ],
      hint: 'WAL entry: {operation, table, key, before, after, timestamp}. CDC Reader читает WAL с последней позиции. Downstream consumer применяет изменения к search index.',
      expectedOutput: '=== Change Data Capture ===\n\nОперации с БД:\n  INSERT users: {id=1, name="Иван", email="ivan@mail.ru"}\n  INSERT users: {id=2, name="Мария", email="maria@mail.ru"}\n  UPDATE users: {id=1, name="Иван Петров"}\n  DELETE users: {id=2}\n\nWAL (Write-Ahead Log):\n  1. INSERT users.1: after={name=Иван, email=ivan@mail.ru}\n  2. INSERT users.2: after={name=Мария, email=maria@mail.ru}\n  3. UPDATE users.1: before={name=Иван}, after={name=Иван Петров}\n  4. DELETE users.2: before={name=Мария, email=maria@mail.ru}\n\nCDC -> Kafka topic "db.users":\n  offset=0: INSERT {id=1, name="Иван", email="ivan@mail.ru"}\n  offset=1: INSERT {id=2, name="Мария", email="maria@mail.ru"}\n  offset=2: UPDATE {id=1, name="Иван Петров"}\n  offset=3: DELETE {id=2}\n\nSearch Index (после применения CDC):\n  1: {name=Иван Петров, email=ivan@mail.ru}\n  (id=2 удалён)',
      solution: `import java.util.*;

public class Main {
    static class WalEntry {
        int seq;
        String operation;
        String table;
        int key;
        Map<String, String> before;
        Map<String, String> after;

        WalEntry(int seq, String op, String table, int key,
                 Map<String, String> before, Map<String, String> after) {
            this.seq = seq;
            this.operation = op;
            this.table = table;
            this.key = key;
            this.before = before;
            this.after = after;
        }
    }

    // Database
    static Map<Integer, Map<String, String>> dbTable = new LinkedHashMap<>();
    static List<WalEntry> wal = new ArrayList<>();
    static int walSeq = 1;

    static void insert(int id, Map<String, String> data) {
        dbTable.put(id, new LinkedHashMap<>(data));
        wal.add(new WalEntry(walSeq++, "INSERT", "users", id, null, new LinkedHashMap<>(data)));
        System.out.println("  INSERT users: {id=" + id + ", name=\\"" + data.get("name")
            + "\\", email=\\"" + data.get("email") + "\\"}");
    }

    static void update(int id, String field, String value) {
        Map<String, String> row = dbTable.get(id);
        Map<String, String> before = Map.of(field, row.get(field));
        row.put(field, value);
        Map<String, String> after = Map.of(field, value);
        wal.add(new WalEntry(walSeq++, "UPDATE", "users", id, before, after));
        System.out.println("  UPDATE users: {id=" + id + ", " + field + "=\\"" + value + "\\"}");
    }

    static void delete(int id) {
        Map<String, String> before = new LinkedHashMap<>(dbTable.get(id));
        dbTable.remove(id);
        wal.add(new WalEntry(walSeq++, "DELETE", "users", id, before, null));
        System.out.println("  DELETE users: {id=" + id + "}");
    }

    // Search Index (downstream)
    static Map<Integer, Map<String, String>> searchIndex = new LinkedHashMap<>();

    public static void main(String[] args) {
        System.out.println("=== Change Data Capture ===\\n");

        System.out.println("Операции с БД:");
        insert(1, new LinkedHashMap<>(Map.of("name", "Иван", "email", "ivan@mail.ru")));
        insert(2, new LinkedHashMap<>(Map.of("name", "Мария", "email", "maria@mail.ru")));
        update(1, "name", "Иван Петров");
        delete(2);

        // Print WAL
        System.out.println("\\nWAL (Write-Ahead Log):");
        for (WalEntry e : wal) {
            StringBuilder sb = new StringBuilder("  " + e.seq + ". " + e.operation
                + " " + e.table + "." + e.key + ": ");
            if (e.before != null) sb.append("before=" + e.before);
            if (e.before != null && e.after != null) sb.append(", ");
            if (e.after != null) sb.append("after=" + e.after);
            System.out.println(sb);
        }

        // CDC -> Kafka
        System.out.println("\\nCDC -> Kafka topic \\"db.users\\":");
        int offset = 0;
        for (WalEntry e : wal) {
            StringBuilder sb = new StringBuilder("  offset=" + offset++ + ": " + e.operation + " ");
            switch (e.operation) {
                case "INSERT":
                    sb.append("{id=" + e.key);
                    for (Map.Entry<String, String> f : e.after.entrySet()) {
                        sb.append(", " + f.getKey() + "=\\"" + f.getValue() + "\\"");
                    }
                    sb.append("}");
                    // Apply to search index
                    searchIndex.put(e.key, new LinkedHashMap<>(e.after));
                    break;
                case "UPDATE":
                    sb.append("{id=" + e.key);
                    for (Map.Entry<String, String> f : e.after.entrySet()) {
                        sb.append(", " + f.getKey() + "=\\"" + f.getValue() + "\\"");
                    }
                    sb.append("}");
                    searchIndex.get(e.key).putAll(e.after);
                    break;
                case "DELETE":
                    sb.append("{id=" + e.key + "}");
                    searchIndex.remove(e.key);
                    break;
            }
            System.out.println(sb);
        }

        // Search Index
        System.out.println("\\nSearch Index (после применения CDC):");
        for (Map.Entry<Integer, Map<String, String>> e : searchIndex.entrySet()) {
            System.out.println("  " + e.getKey() + ": " + e.getValue());
        }
        System.out.println("  (id=2 удалён)");
    }
}`,
      explanation: 'CDC (Change Data Capture) отслеживает изменения в БД через WAL (Write-Ahead Log) и публикует их в Kafka. Downstream consumers (search index, analytics, cache) обновляются из CDC событий. Debezium — стандартный CDC connector для Kafka Connect. Поддерживает PostgreSQL, MySQL, MongoDB. CDC решает проблему dual write и обеспечивает eventual consistency между системами.'
    },
    {
      id: 9,
      title: 'Graceful Shutdown',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Graceful Shutdown для Kafka Consumer: корректное завершение работы с сохранением прогресса, без потери и дублирования сообщений.',
      requirements: [
        'Consumer с обработкой сообщений и commit offset',
        'Shutdown Hook: перехват SIGTERM/SIGINT',
        'При shutdown: завершить текущий batch, commit offset, закрыть consumer',
        'Показать: нормальная обработка -> shutdown signal -> graceful stop',
        'Проверить: все обработанные сообщения committed',
        'Лог: что происходит на каждом этапе shutdown'
      ],
      hint: 'Используйте volatile boolean running = true. Shutdown hook: running = false. Main loop: while(running) { poll(); process(); commit(); }. После цикла: final commit + close.',
      expectedOutput: '=== Graceful Shutdown ===\n\nConsumer запущен (poll loop)...\n\n  [Poll] Batch 1: [msg-0, msg-1, msg-2]\n  [Process] msg-0: OK\n  [Process] msg-1: OK\n  [Process] msg-2: OK\n  [Commit] offset=3\n\n  [Poll] Batch 2: [msg-3, msg-4, msg-5]\n  [Process] msg-3: OK\n  [Process] msg-4: OK\n\n>>> SHUTDOWN SIGNAL RECEIVED <<<\n\n  [Shutdown] Завершаем текущий batch...\n  [Process] msg-5: OK\n  [Commit] offset=6 (финальный commit)\n  [Shutdown] Consumer закрыт\n  [Shutdown] Обработано: 6 сообщений\n  [Shutdown] Committed offset: 6\n  [Shutdown] Потеряно: 0\n\nGraceful Shutdown завершён.',
      solution: `import java.util.*;

public class Main {
    static List<String> topic = new ArrayList<>();
    static int committedOffset = 0;
    static int processedCount = 0;
    static volatile boolean running = true;

    static void init() {
        for (int i = 0; i < 9; i++) {
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

    public static void main(String[] args) {
        System.out.println("=== Graceful Shutdown ===\\n");
        init();

        System.out.println("Consumer запущен (poll loop)...\\n");

        int batchNum = 0;
        int currentOffset = 0;

        while (running && currentOffset < topic.size()) {
            batchNum++;
            List<String> batch = poll(currentOffset, 3);
            if (batch.isEmpty()) break;

            System.out.println("  [Poll] Batch " + batchNum + ": " + batch);

            for (int i = 0; i < batch.size(); i++) {
                String msg = batch.get(i);

                // Simulate shutdown signal during batch 2 after msg-4
                if (batchNum == 2 && i == 2) {
                    System.out.println("\\n>>> SHUTDOWN SIGNAL RECEIVED <<<\\n");
                    running = false;
                    System.out.println("  [Shutdown] Завершаем текущий batch...");
                }

                System.out.println("  [Process] " + msg + ": OK");
                processedCount++;
                currentOffset++;
            }

            committedOffset = currentOffset;
            if (running) {
                System.out.println("  [Commit] offset=" + committedOffset + "\\n");
            } else {
                System.out.println("  [Commit] offset=" + committedOffset + " (финальный commit)");
            }
        }

        // Shutdown sequence
        System.out.println("  [Shutdown] Consumer закрыт");
        System.out.println("  [Shutdown] Обработано: " + processedCount + " сообщений");
        System.out.println("  [Shutdown] Committed offset: " + committedOffset);
        System.out.println("  [Shutdown] Потеряно: " + (processedCount - committedOffset));
        System.out.println("\\nGraceful Shutdown завершён.");
    }
}`,
      explanation: 'Graceful Shutdown критичен для production Kafka consumer. При получении SIGTERM: 1) прекращаем poll(), 2) дообрабатываем текущий batch, 3) commit final offset, 4) close consumer. Без graceful shutdown: потеря uncommitted данных или дублирование при перезапуске. В Java: Runtime.getRuntime().addShutdownHook(). В Spring: @PreDestroy. Consumer.wakeup() прерывает poll() из другого потока.'
    },
    {
      id: 10,
      title: 'Полная система: E-Commerce через Kafka',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте полную e-commerce систему на Kafka: приём заказов, оплата, склад, доставка, уведомления. Все сервисы коммуницируют только через Kafka topics.',
      requirements: [
        'OrderService: создание заказа -> topic "orders"',
        'PaymentService: обработка оплаты -> topic "payments"',
        'InventoryService: резервирование товаров -> topic "inventory"',
        'ShippingService: создание доставки -> topic "shipping"',
        'NotificationService: email уведомления (подписан на все topics)',
        'Event Store: полная история для audit',
        'Показать lifecycle 2 заказов: успешный и с ошибкой оплаты'
      ],
      hint: 'Каждый сервис: consumer одного topic + producer в следующий. Цепочка: orders -> payments -> inventory -> shipping. NotificationService подписан на все.',
      expectedOutput: '=== E-Commerce через Kafka ===\n\n--- Заказ ORD-001 (Ноутбук, $1200) ---\n  [OrderService]        -> topic "orders": OrderCreated(ORD-001)\n  [PaymentService]      <- topic "orders": обработка оплаты... OK\n  [PaymentService]      -> topic "payments": PaymentCompleted(ORD-001)\n  [NotificationService] Email: "Оплата $1200 получена"\n  [InventoryService]    <- topic "payments": резерв Ноутбук... OK\n  [InventoryService]    -> topic "inventory": ItemReserved(ORD-001)\n  [ShippingService]     <- topic "inventory": создание доставки... OK\n  [ShippingService]     -> topic "shipping": ShipmentCreated(ORD-001, track=TRK-001)\n  [NotificationService] Email: "Заказ ORD-001 отправлен (TRK-001)"\n  Статус: SHIPPED\n\n--- Заказ ORD-002 (Телефон, $800) ---\n  [OrderService]        -> topic "orders": OrderCreated(ORD-002)\n  [PaymentService]      <- topic "orders": обработка оплаты... REJECTED\n  [PaymentService]      -> topic "payments": PaymentFailed(ORD-002)\n  [NotificationService] Email: "Оплата $800 отклонена"\n  [OrderService]        <- topic "payments": отмена заказа\n  Статус: CANCELLED\n\nEvent Store (8 событий):\n  1. OrderCreated(ORD-001)\n  2. PaymentCompleted(ORD-001)\n  3. ItemReserved(ORD-001)\n  4. ShipmentCreated(ORD-001)\n  5. OrderCreated(ORD-002)\n  6. PaymentFailed(ORD-002)\n  7. OrderCancelled(ORD-002)',
      solution: `import java.util.*;

public class Main {
    static List<String> eventStore = new ArrayList<>();
    static Map<String, String> orderStatuses = new LinkedHashMap<>();
    static int trackingSeq = 1;

    static void event(String eventName) {
        eventStore.add(eventName);
    }

    static void processOrder(String orderId, String item, int amount,
                              boolean paymentSuccess) {
        System.out.println("--- Заказ " + orderId + " (" + item + ", $" + amount + ") ---");

        // OrderService creates order
        System.out.println("  [OrderService]        -> topic \\"orders\\": OrderCreated("
            + orderId + ")");
        event("OrderCreated(" + orderId + ")");
        orderStatuses.put(orderId, "CREATED");

        // PaymentService processes
        System.out.print("  [PaymentService]      <- topic \\"orders\\": обработка оплаты... ");
        if (paymentSuccess) {
            System.out.println("OK");
            System.out.println("  [PaymentService]      -> topic \\"payments\\": PaymentCompleted("
                + orderId + ")");
            event("PaymentCompleted(" + orderId + ")");
            System.out.println("  [NotificationService] Email: \\"Оплата $" + amount + " получена\\"");

            // InventoryService
            System.out.println("  [InventoryService]    <- topic \\"payments\\": резерв "
                + item + "... OK");
            System.out.println("  [InventoryService]    -> topic \\"inventory\\": ItemReserved("
                + orderId + ")");
            event("ItemReserved(" + orderId + ")");

            // ShippingService
            String tracking = "TRK-" + String.format("%03d", trackingSeq++);
            System.out.println("  [ShippingService]     <- topic \\"inventory\\": создание доставки... OK");
            System.out.println("  [ShippingService]     -> topic \\"shipping\\": ShipmentCreated("
                + orderId + ", track=" + tracking + ")");
            event("ShipmentCreated(" + orderId + ")");

            System.out.println("  [NotificationService] Email: \\"Заказ " + orderId
                + " отправлен (" + tracking + ")\\"");
            orderStatuses.put(orderId, "SHIPPED");
        } else {
            System.out.println("REJECTED");
            System.out.println("  [PaymentService]      -> topic \\"payments\\": PaymentFailed("
                + orderId + ")");
            event("PaymentFailed(" + orderId + ")");
            System.out.println("  [NotificationService] Email: \\"Оплата $" + amount + " отклонена\\"");
            System.out.println("  [OrderService]        <- topic \\"payments\\": отмена заказа");
            event("OrderCancelled(" + orderId + ")");
            orderStatuses.put(orderId, "CANCELLED");
        }

        System.out.println("  Статус: " + orderStatuses.get(orderId));
    }

    public static void main(String[] args) {
        System.out.println("=== E-Commerce через Kafka ===\\n");

        processOrder("ORD-001", "Ноутбук", 1200, true);
        System.out.println();
        processOrder("ORD-002", "Телефон", 800, false);

        System.out.println("\\nEvent Store (" + eventStore.size() + " событий):");
        for (int i = 0; i < eventStore.size(); i++) {
            System.out.println("  " + (i + 1) + ". " + eventStore.get(i));
        }
    }
}`,
      explanation: 'Полная e-commerce система на Kafka: каждый сервис — независимый consumer/producer. Коммуникация только через topics: orders, payments, inventory, shipping. NotificationService подписан на все topics. Event Store хранит полную историю для audit и replay. При ошибке оплаты — цепочка прерывается, заказ отменяется. В production: каждый сервис — отдельный микросервис с собственной БД, Kafka обеспечивает eventual consistency.'
    }
  ]
}
