export default {
  id: 5,
  title: 'Kafka Streams: обработка потоков',
  description: 'Потоковая обработка данных: KStream, KTable, filter, map, aggregate, windowing, joins — все концепции Kafka Streams.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Kafka Streams?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kafka Streams — библиотека для потоковой обработки данных, встроенная в Apache Kafka. В отличие от Apache Flink или Spark Streaming, Kafka Streams — это просто Java-библиотека. Не нужен отдельный кластер — приложение запускается как обычный Java-процесс.' },
        { type: 'heading', value: 'Зачем нужна потоковая обработка?' },
        { type: 'code', language: 'java', value: '// Batch обработка: собираем данные -> обрабатываем пакетом\n// "Посчитать продажи за вчера" — раз в сутки\n//\n// Stream обработка: обрабатываем данные по мере поступления\n// "Посчитать продажи за последние 5 минут" — в реальном времени\n//\n// Примеры потоковой обработки:\n// 1. Fraud Detection — обнаружение подозрительных транзакций в реальном времени\n// 2. Real-time Analytics — дашборды с обновлением каждую секунду\n// 3. ETL — преобразование данных из одного топика в другой\n// 4. Alerting — уведомления при превышении порогов\n// 5. Enrichment — обогащение данных из разных источников\n\n// Kafka Streams vs другие:\n// Kafka Streams: Java библиотека, нет кластера, простой деплой\n// Apache Flink: отдельный кластер, мощнее, сложнее\n// Spark Streaming: micro-batch, нужен Spark кластер\n// ksqlDB: SQL поверх Kafka Streams' },
        { type: 'heading', value: 'KStream и KTable' },
        { type: 'text', value: 'Kafka Streams оперирует двумя абстракциями: KStream (поток событий) и KTable (таблица-снимок). KStream — это бесконечная последовательность событий. KTable — текущее состояние для каждого ключа (последнее значение).' },
        { type: 'code', language: 'java', value: '// KStream — поток событий (каждая запись — новое событие)\n// Пример: поток заказов\n// key=user1, value=Order{item="книга", amount=500}\n// key=user1, value=Order{item="ноутбук", amount=50000}\n// key=user2, value=Order{item="мышь", amount=1500}\n// Все записи сохраняются. user1 имеет 2 заказа.\n\n// KTable — таблица состояния (последнее значение для ключа)\n// Пример: баланс пользователей\n// key=user1, value=Balance{amount=10000}\n// key=user1, value=Balance{amount=9500}  <- обновляет предыдущее!\n// key=user2, value=Balance{amount=5000}\n// user1 имеет ТОЛЬКО последний баланс 9500.\n\n// Аналогия из SQL:\n// KStream ~ INSERT (добавляет новую строку)\n// KTable  ~ UPSERT (обновляет или вставляет)' },
        { type: 'tip', value: 'Выбор между KStream и KTable зависит от природы данных. События (заказы, клики, логи) — KStream. Состояние (баланс, профиль, конфигурация) — KTable. Часто они комбинируются: обогащение потока заказов данными из таблицы клиентов.' }
      ]
    },
    {
      id: 2,
      title: 'Filter, Map, FlatMap',
      type: 'theory',
      content: [
        { type: 'text', value: 'Базовые операции потоковой обработки: filter (фильтрация), map (преобразование), flatMap (преобразование с развёртыванием). Эти операции создают новый поток, не изменяя исходный.' },
        { type: 'heading', value: 'Filter — фильтрация сообщений' },
        { type: 'code', language: 'java', value: '// Filter: оставляем только сообщения, удовлетворяющие условию\n//\n// KStream<String, Order> orders = builder.stream("orders");\n//\n// // Только заказы дороже 1000 рублей\n// KStream<String, Order> expensiveOrders = orders\n//     .filter((key, order) -> order.getAmount() > 1000);\n//\n// // Только заказы из Москвы\n// KStream<String, Order> moscowOrders = orders\n//     .filter((key, order) -> "Moscow".equals(order.getCity()));\n//\n// // Исключить тестовые заказы\n// KStream<String, Order> realOrders = orders\n//     .filterNot((key, order) -> order.isTest());\n//\n// Вход:  [Order{500}, Order{2000}, Order{300}, Order{5000}]\n// Filter(>1000): [Order{2000}, Order{5000}]' },
        { type: 'heading', value: 'Map — преобразование' },
        { type: 'code', language: 'java', value: '// Map: преобразование каждого сообщения\n//\n// // Изменить value: добавить поле статус\n// KStream<String, EnrichedOrder> enriched = orders\n//     .mapValues(order -> new EnrichedOrder(order, "NEW"));\n//\n// // Изменить key и value: ключ = город заказа\n// KStream<String, Order> byCity = orders\n//     .map((key, order) -> KeyValue.pair(order.getCity(), order));\n//\n// // Вход:  key="user1", value=Order{city="Moscow", item="книга"}\n// // Выход: key="Moscow", value=Order{city="Moscow", item="книга"}\n//\n// ВАЖНО: mapValues() не меняет ключ -> не вызывает repartitioning\n// map() меняет ключ -> вызывает repartitioning (дорого!)' },
        { type: 'heading', value: 'FlatMap — развёртывание' },
        { type: 'code', language: 'java', value: '// FlatMap: одно сообщение -> несколько сообщений\n//\n// // Заказ с несколькими товарами -> отдельное событие на каждый товар\n// KStream<String, OrderItem> items = orders\n//     .flatMapValues(order -> order.getItems());\n//\n// Вход:  Order{items=[книга, ручка, тетрадь]}\n// Выход: [OrderItem{книга}, OrderItem{ручка}, OrderItem{тетрадь}]\n//\n// Пример: разбить текст на слова (word count)\n// KStream<String, String> words = lines\n//     .flatMapValues(line -> Arrays.asList(line.split("\\\\s+")));\n//\n// Вход:  "hello world foo"\n// Выход: ["hello", "world", "foo"]' },
        { type: 'note', value: 'Все операции (filter, map, flatMap) создают НОВЫЙ поток. Исходный поток не изменяется. Это функциональный подход. Результат можно записать в другой топик через метод to("topic-name").' }
      ]
    },
    {
      id: 3,
      title: 'Aggregate и Count',
      type: 'theory',
      content: [
        { type: 'text', value: 'Агрегация — ключевая операция потоковой обработки. Она позволяет считать суммы, средние значения, количество и другие метрики по мере поступления данных. Результат агрегации — KTable (текущее состояние).' },
        { type: 'heading', value: 'GroupByKey и Count' },
        { type: 'code', language: 'java', value: '// Подсчёт количества заказов по пользователям\n//\n// KStream<String, Order> orders = builder.stream("orders");\n//\n// KTable<String, Long> orderCounts = orders\n//     .groupByKey()  // группировка по ключу (userId)\n//     .count();      // подсчёт количества\n//\n// Вход (поток):\n// key=user1, value=Order1\n// key=user2, value=Order2\n// key=user1, value=Order3\n// key=user1, value=Order4\n//\n// Результат (KTable — обновляется в реальном времени):\n// user1 -> 3\n// user2 -> 1\n//\n// GroupBy: группировка по другому ключу\n// KTable<String, Long> ordersByCity = orders\n//     .groupBy((key, order) -> KeyValue.pair(order.getCity(), order))\n//     .count();' },
        { type: 'heading', value: 'Aggregate — произвольная агрегация' },
        { type: 'code', language: 'java', value: '// Aggregate: суммирование продаж по пользователю\n//\n// KTable<String, Double> totalSales = orders\n//     .groupByKey()\n//     .aggregate(\n//         () -> 0.0,              // initializer: начальное значение\n//         (key, order, total) ->  // aggregator: как обновлять\n//             total + order.getAmount(),\n//         Materialized.with(Serdes.String(), Serdes.Double())\n//     );\n//\n// Вход:\n// key=user1, Order{amount=500}   -> total: 500\n// key=user1, Order{amount=2000}  -> total: 2500\n// key=user2, Order{amount=1000}  -> total: 1000\n// key=user1, Order{amount=300}   -> total: 2800\n//\n// Результат KTable:\n// user1 -> 2800\n// user2 -> 1000\n\n// Reduce: упрощённая агрегация (без initializer)\n// KTable<String, Order> latestOrder = orders\n//     .groupByKey()\n//     .reduce((prev, current) -> current); // оставить последний' },
        { type: 'heading', value: 'Windowed Aggregation' },
        { type: 'text', value: 'Окна (windows) позволяют агрегировать данные за определённый период: последние 5 минут, каждый час, за сегодня. Это основа real-time analytics.' },
        { type: 'code', language: 'java', value: '// Tumbling Window: фиксированные окна без перекрытия\n// |--5min--|--5min--|--5min--|\n//\n// KTable<Windowed<String>, Long> ordersPerWindow = orders\n//     .groupByKey()\n//     .windowedBy(TimeWindows.ofSizeWithNoGrace(Duration.ofMinutes(5)))\n//     .count();\n//\n// Hopping Window: скользящие окна с перекрытием\n// |--10min--|\n//     |--10min--|\n//         |--10min--|\n//\n// Session Window: окна по активности пользователя\n// |--user activity--|  gap  |--user activity--|' },
        { type: 'tip', value: 'Агрегация в Kafka Streams stateful — состояние хранится локально в RocksDB и бэкапится в changelog топик Kafka. При рестарте состояние восстанавливается автоматически. Это обеспечивает fault-tolerance без внешних баз данных.' }
      ]
    },
    {
      id: 4,
      title: 'Joins: объединение потоков',
      type: 'theory',
      content: [
        { type: 'text', value: 'Joins позволяют объединять данные из разных потоков и таблиц. Kafka Streams поддерживает три вида joins: KStream-KStream, KStream-KTable и KTable-KTable.' },
        { type: 'heading', value: 'KStream-KTable Join (обогащение)' },
        { type: 'code', language: 'java', value: '// KStream-KTable Join: обогащение потока данными из таблицы\n// Самый частый случай: обогатить заказ данными о клиенте\n//\n// KStream<String, Order> orders = builder.stream("orders");\n// KTable<String, Customer> customers = builder.table("customers");\n//\n// KStream<String, EnrichedOrder> enriched = orders.join(\n//     customers,\n//     (order, customer) -> new EnrichedOrder(\n//         order.getId(),\n//         order.getAmount(),\n//         customer.getName(),\n//         customer.getEmail()\n//     )\n// );\n//\n// Поток заказов:\n// key=user1, Order{item="книга", amount=500}\n// Таблица клиентов:\n// key=user1, Customer{name="Иван", email="ivan@mail.ru"}\n//\n// Результат:\n// key=user1, EnrichedOrder{item="книга", amount=500,\n//                          customer="Иван", email="ivan@mail.ru"}\n//\n// ВАЖНО: join по ключу! Ключи должны совпадать.' },
        { type: 'heading', value: 'KStream-KStream Join (корреляция)' },
        { type: 'code', language: 'java', value: '// KStream-KStream Join: объединение двух потоков в окне\n// Пример: объединить заказ с платежом\n//\n// KStream<String, Order> orders = builder.stream("orders");\n// KStream<String, Payment> payments = builder.stream("payments");\n//\n// KStream<String, OrderWithPayment> joined = orders.join(\n//     payments,\n//     (order, payment) -> new OrderWithPayment(order, payment),\n//     JoinWindows.ofTimeDifferenceWithNoGrace(Duration.ofMinutes(5))\n//     // Ищем совпадение в окне 5 минут\n// );\n//\n// Заказ key=order1 в 10:00\n// Платёж key=order1 в 10:02 -> JOIN! (в пределах 5 минут)\n// Платёж key=order1 в 10:10 -> NO JOIN (прошло > 5 минут)\n\n// Типы joins:\n// inner join — только если есть данные в обоих потоках\n// left join  — все из левого + совпадения из правого\n// outer join — все из обоих потоков' },
        { type: 'heading', value: 'Требования к Joins' },
        { type: 'list', value: [
          'Оба потока/таблицы должны иметь одинаковый тип ключа',
          'KStream-KStream join требует окно (JoinWindows)',
          'KStream-KTable join НЕ требует окно (таблица всегда актуальна)',
          'Если ключи разные — нужен repartitioning через selectKey()',
          'Joins co-partitioned — потоки должны иметь одинаковое количество партиций',
          'GlobalKTable — не требует co-partitioning (broadcast join)'
        ] },
        { type: 'warning', value: 'Joins требуют co-partitioning: оба топика должны иметь одинаковое количество партиций и одинаковый partitioner. Иначе join не найдёт совпадения, потому что записи с одним ключом окажутся в разных партициях. Используйте GlobalKTable, если co-partitioning невозможен.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Stream Processing Pipeline',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте потоковую обработку: фильтрация, преобразование, группировка и подсчёт заказов.',
      requirements: [
        'Класс Order с полями: userId, item, amount, city',
        'Filter: оставить заказы с amount > 500',
        'Map: преобразовать в OrderSummary(userId, amount, city)',
        'GroupBy: сгруппировать по city',
        'Count: подсчитать заказы по городам',
        'Aggregate: суммировать amount по городам'
      ],
      hint: 'Используйте Stream API Java для моделирования Kafka Streams операций. Collectors.groupingBy для группировки.',
      expectedOutput: '=== Входные данные (8 заказов) ===\nuser1: книга, 500р, Москва\nuser2: ноутбук, 50000р, Москва\nuser3: мышь, 300р, Питер\nuser1: наушники, 3000р, Москва\nuser4: клавиатура, 2000р, Питер\nuser2: монитор, 15000р, Казань\nuser3: коврик, 200р, Питер\nuser1: стол, 8000р, Москва\n\n=== После filter (amount > 500) ===\n[ноутбук:50000, наушники:3000, клавиатура:2000, монитор:15000, стол:8000]\n\n=== Количество заказов по городам ===\nМосква: 3\nПитер: 1\nКазань: 1\n\n=== Сумма продаж по городам ===\nМосква: 61000р\nПитер: 2000р\nКазань: 15000р\n\n=== Общий оборот: 78000р ===',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    static class Order {
        String userId;
        String item;
        int amount;
        String city;

        Order(String userId, String item, int amount, String city) {
            this.userId = userId;
            this.item = item;
            this.amount = amount;
            this.city = city;
        }

        public String toString() {
            return userId + ": " + item + ", " + amount + "р, " + city;
        }
    }

    public static void main(String[] args) {
        List<Order> orders = List.of(
            new Order("user1", "книга", 500, "Москва"),
            new Order("user2", "ноутбук", 50000, "Москва"),
            new Order("user3", "мышь", 300, "Питер"),
            new Order("user1", "наушники", 3000, "Москва"),
            new Order("user4", "клавиатура", 2000, "Питер"),
            new Order("user2", "монитор", 15000, "Казань"),
            new Order("user3", "коврик", 200, "Питер"),
            new Order("user1", "стол", 8000, "Москва")
        );

        System.out.println("=== Входные данные (" + orders.size() + " заказов) ===");
        orders.forEach(System.out::println);

        // Filter: amount > 500
        List<Order> filtered = orders.stream()
            .filter(o -> o.amount > 500)
            .collect(Collectors.toList());

        System.out.println("\\n=== После filter (amount > 500) ===");
        System.out.println("[" + filtered.stream()
            .map(o -> o.item + ":" + o.amount)
            .collect(Collectors.joining(", ")) + "]");

        // GroupBy city + Count
        Map<String, Long> countByCity = filtered.stream()
            .collect(Collectors.groupingBy(o -> o.city, Collectors.counting()));

        System.out.println("\\n=== Количество заказов по городам ===");
        countByCity.forEach((city, count) ->
            System.out.println(city + ": " + count));

        // GroupBy city + Sum
        Map<String, Integer> sumByCity = filtered.stream()
            .collect(Collectors.groupingBy(o -> o.city,
                Collectors.summingInt(o -> o.amount)));

        System.out.println("\\n=== Сумма продаж по городам ===");
        sumByCity.forEach((city, sum) ->
            System.out.println(city + ": " + sum + "р"));

        int total = sumByCity.values().stream().mapToInt(Integer::intValue).sum();
        System.out.println("\\n=== Общий оборот: " + total + "р ===");
    }
}`,
      explanation: 'Мы смоделировали pipeline обработки потока: filter -> map -> groupBy -> aggregate. В Kafka Streams эти операции выполняются непрерывно по мере поступления данных, а результат хранится в KTable. Java Stream API демонстрирует те же концепции в batch-режиме.'
    },
    {
      id: 6,
      title: 'Практика: Windowed Aggregation',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте агрегацию с временными окнами: подсчёт событий за последние N секунд.',
      requirements: [
        'Класс Event с полями: key, value, timestamp',
        'Класс TumblingWindow с размером окна в секундах',
        'Метод add(event) — добавляет событие в нужное окно',
        'Метод getWindowCounts() — возвращает счётчики по окнам',
        'Покажите 10 событий, распределённых по 3 окнам по 5 секунд',
        'Покажите агрегацию (count и sum) для каждого окна'
      ],
      hint: 'Определите окно по формуле: windowStart = (timestamp / windowSizeMs) * windowSizeMs. Это даст начало окна для каждого события.',
      expectedOutput: '=== Tumbling Window: 5 секунд ===\n\nСобытия:\nt=1s:  user1, amount=100\nt=2s:  user2, amount=200\nt=3s:  user1, amount=150\nt=6s:  user3, amount=300\nt=7s:  user1, amount=400\nt=8s:  user2, amount=250\nt=9s:  user3, amount=100\nt=11s: user1, amount=500\nt=13s: user2, amount=350\nt=14s: user1, amount=200\n\n=== Результаты по окнам ===\nОкно [0s - 5s]: events=3, total=450\n  user1: count=2, sum=250\n  user2: count=1, sum=200\nОкно [5s - 10s]: events=4, total=1050\n  user1: count=1, sum=400\n  user2: count=1, sum=250\n  user3: count=2, sum=400\nОкно [10s - 15s]: events=3, total=1050\n  user1: count=2, sum=700\n  user2: count=1, sum=350',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    static class Event {
        String key;
        int amount;
        long timestampSec;

        Event(String key, int amount, long timestampSec) {
            this.key = key;
            this.amount = amount;
            this.timestampSec = timestampSec;
        }
    }

    static class WindowResult {
        long windowStart;
        long windowEnd;
        Map<String, List<Event>> eventsByKey = new LinkedHashMap<>();

        WindowResult(long start, long end) {
            this.windowStart = start;
            this.windowEnd = end;
        }

        void addEvent(Event e) {
            eventsByKey.computeIfAbsent(e.key, k -> new ArrayList<>()).add(e);
        }

        int totalEvents() {
            return eventsByKey.values().stream().mapToInt(List::size).sum();
        }

        int totalAmount() {
            return eventsByKey.values().stream()
                .flatMap(List::stream)
                .mapToInt(e -> e.amount).sum();
        }
    }

    static class TumblingWindow {
        long windowSizeSec;
        Map<Long, WindowResult> windows = new TreeMap<>();

        TumblingWindow(long windowSizeSec) {
            this.windowSizeSec = windowSizeSec;
        }

        void add(Event event) {
            long windowStart = (event.timestampSec / windowSizeSec) * windowSizeSec;
            long windowEnd = windowStart + windowSizeSec;
            windows.computeIfAbsent(windowStart,
                k -> new WindowResult(windowStart, windowEnd))
                .addEvent(event);
        }

        void printResults() {
            System.out.println("\\n=== Результаты по окнам ===");
            for (WindowResult w : windows.values()) {
                System.out.println("Окно [" + w.windowStart + "s - " + w.windowEnd + "s]: "
                    + "events=" + w.totalEvents() + ", total=" + w.totalAmount());
                for (Map.Entry<String, List<Event>> entry : w.eventsByKey.entrySet()) {
                    String key = entry.getKey();
                    List<Event> events = entry.getValue();
                    int sum = events.stream().mapToInt(e -> e.amount).sum();
                    System.out.println("  " + key + ": count=" + events.size()
                        + ", sum=" + sum);
                }
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Tumbling Window: 5 секунд ===\\n");

        List<Event> events = List.of(
            new Event("user1", 100, 1),
            new Event("user2", 200, 2),
            new Event("user1", 150, 3),
            new Event("user3", 300, 6),
            new Event("user1", 400, 7),
            new Event("user2", 250, 8),
            new Event("user3", 100, 9),
            new Event("user1", 500, 11),
            new Event("user2", 350, 13),
            new Event("user1", 200, 14)
        );

        System.out.println("События:");
        for (Event e : events) {
            System.out.println("t=" + e.timestampSec + "s:  " + e.key
                + ", amount=" + e.amount);
        }

        TumblingWindow window = new TumblingWindow(5);
        for (Event e : events) {
            window.add(e);
        }
        window.printResults();
    }
}`,
      explanation: 'Tumbling Windows делят время на фиксированные непересекающиеся интервалы. Каждое событие попадает ровно в одно окно. В Kafka Streams окна хранятся в RocksDB и автоматически истекают. Windowed aggregation — основа real-time dashboards и alerting систем.'
    }
  ]
}
