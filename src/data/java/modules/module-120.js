export default {
  id: 120,
  title: 'Практикум: Stream API advanced',
  description: 'Продвинутые задачи на Stream API: группировка, flatMap, custom Collector, parallel streams, reduce, toMap, работа с файлами, сложные pipeline-ы, Optional и бенчмарки.',
  lessons: [
    {
      id: 1,
      title: 'Группировка заказов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте Collectors.groupingBy с downstream collectors для анализа заказов: группировка по клиенту, суммирование, средняя стоимость, подсчёт.',
      requirements: [
        'Класс Order: id, customer, product, amount (double), quantity',
        'Группировка по клиенту: Map<String, List<Order>>',
        'Сумма по клиенту: groupingBy + summingDouble',
        'Средняя сумма по клиенту: groupingBy + averagingDouble',
        'Количество заказов по клиенту: groupingBy + counting',
        'Топ клиент по сумме заказов'
      ],
      expectedOutput: `=== Группировка заказов ===
Заказы:
  #1 Алексей: Ноутбук x1 = 450000.0
  #2 Мария: Телефон x2 = 200000.0
  #3 Алексей: Мышь x3 = 15000.0
  #4 Борис: Монитор x1 = 180000.0
  #5 Мария: Наушники x1 = 35000.0
  #6 Борис: Клавиатура x2 = 24000.0
  #7 Алексей: Наушники x1 = 35000.0

--- Количество заказов ---
Алексей: 3
Борис: 2
Мария: 2

--- Сумма по клиенту ---
Алексей: 500000.0
Борис: 204000.0
Мария: 235000.0

--- Средняя сумма ---
Алексей: 166666.7
Борис: 102000.0
Мария: 117500.0

Топ клиент: Алексей (500000.0)`,
      hint: 'groupingBy(Order::getCustomer, summingDouble(Order::getAmount)) — группирует и суммирует в одну операцию. Для топ клиента — max(Map.Entry.comparingByValue()). averagingDouble даёт среднее.',
      solution: `import java.util.*;
import java.util.stream.*;
import static java.util.stream.Collectors.*;

public class Main {
    static class Order {
        int id; String customer, product;
        double amount; int quantity;

        Order(int id, String customer, String product, double amount, int quantity) {
            this.id = id; this.customer = customer; this.product = product;
            this.amount = amount; this.quantity = quantity;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Группировка заказов ===");

        List<Order> orders = List.of(
            new Order(1, "Алексей", "Ноутбук", 450000, 1),
            new Order(2, "Мария", "Телефон", 200000, 2),
            new Order(3, "Алексей", "Мышь", 15000, 3),
            new Order(4, "Борис", "Монитор", 180000, 1),
            new Order(5, "Мария", "Наушники", 35000, 1),
            new Order(6, "Борис", "Клавиатура", 24000, 2),
            new Order(7, "Алексей", "Наушники", 35000, 1)
        );

        System.out.println("Заказы:");
        orders.forEach(o -> System.out.printf("  #%d %s: %s x%d = %.1f%n",
            o.id, o.customer, o.product, o.quantity, o.amount));

        // Количество
        System.out.println("\\n--- Количество заказов ---");
        orders.stream().collect(groupingBy(o -> o.customer, counting()))
            .forEach((c, cnt) -> System.out.println(c + ": " + cnt));

        // Сумма
        System.out.println("\\n--- Сумма по клиенту ---");
        Map<String, Double> sums = orders.stream()
            .collect(groupingBy(o -> o.customer, summingDouble(o -> o.amount)));
        sums.forEach((c, s) -> System.out.println(c + ": " + s));

        // Среднее
        System.out.println("\\n--- Средняя сумма ---");
        orders.stream()
            .collect(groupingBy(o -> o.customer, averagingDouble(o -> o.amount)))
            .forEach((c, avg) -> System.out.printf("%s: %.1f%n", c, avg));

        // Топ
        sums.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .ifPresent(e -> System.out.printf("\\nТоп клиент: %s (%.1f)%n", e.getKey(), e.getValue()));
    }
}`,
      explanation: 'Collectors.groupingBy() — мощный инструмент для агрегации. Принимает classifier (функцию группировки) и downstream collector (что делать с группой). summingDouble — сумма, averagingDouble — среднее, counting — количество. Можно вкладывать: groupingBy(city, groupingBy(department, counting())). Это аналог SQL GROUP BY с агрегатными функциями.'
    },
    {
      id: 2,
      title: 'Flat mapping вложенных структур',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте flatMap для «распаковки» вложенных коллекций. Объедините данные из разных источников, преобразуйте вложенные списки в плоский поток.',
      requirements: [
        'Класс Student: name, List<String> courses',
        'flatMap для получения всех уникальных курсов из всех студентов',
        'flatMap для получения пар «студент-курс»',
        'Группировка: курс → список студентов (инвертировать связь)',
        'Объединение нескольких списков в один через flatMap'
      ],
      expectedOutput: `=== FlatMap ===
Студенты:
  Иван: [Java, Spring, SQL]
  Мария: [Python, SQL, ML]
  Борис: [Java, Kotlin, Android]
  Дина: [Python, Django, SQL]

--- Все уникальные курсы ---
[Android, Django, Java, Kotlin, ML, Python, SQL, Spring]

--- Пары студент-курс ---
Иван → Java
Иван → Spring
Иван → SQL
Мария → Python
Мария → SQL
Мария → ML
Борис → Java
Борис → Kotlin
Борис → Android
Дина → Python
Дина → Django
Дина → SQL

--- Курс → Студенты ---
SQL: [Иван, Мария, Дина]
Java: [Иван, Борис]
Python: [Мария, Дина]`,
      hint: 'flatMap(student -> student.courses.stream()) превращает Stream<Student> в Stream<String> (курсы). Для пар: flatMap(s -> s.courses.stream().map(c -> s.name + " → " + c)). Для инвертирования: flatMap + groupingBy.',
      solution: `import java.util.*;
import java.util.stream.*;
import static java.util.stream.Collectors.*;

public class Main {
    static class Student {
        String name;
        List<String> courses;

        Student(String name, List<String> courses) {
            this.name = name;
            this.courses = courses;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== FlatMap ===");

        List<Student> students = List.of(
            new Student("Иван", List.of("Java", "Spring", "SQL")),
            new Student("Мария", List.of("Python", "SQL", "ML")),
            new Student("Борис", List.of("Java", "Kotlin", "Android")),
            new Student("Дина", List.of("Python", "Django", "SQL"))
        );

        System.out.println("Студенты:");
        students.forEach(s -> System.out.println("  " + s.name + ": " + s.courses));

        // Уникальные курсы
        System.out.println("\\n--- Все уникальные курсы ---");
        List<String> allCourses = students.stream()
            .flatMap(s -> s.courses.stream())
            .distinct()
            .sorted()
            .collect(toList());
        System.out.println(allCourses);

        // Пары
        System.out.println("\\n--- Пары студент-курс ---");
        students.stream()
            .flatMap(s -> s.courses.stream().map(c -> s.name + " → " + c))
            .forEach(System.out::println);

        // Инвертирование: курс → студенты
        System.out.println("\\n--- Курс → Студенты ---");
        Map<String, List<String>> courseToStudents = students.stream()
            .flatMap(s -> s.courses.stream().map(c -> new AbstractMap.SimpleEntry<>(c, s.name)))
            .collect(groupingBy(Map.Entry::getKey, mapping(Map.Entry::getValue, toList())));

        // Показать популярные курсы
        courseToStudents.entrySet().stream()
            .filter(e -> e.getValue().size() > 1)
            .sorted((a, b) -> b.getValue().size() - a.getValue().size())
            .forEach(e -> System.out.println(e.getKey() + ": " + e.getValue()));
    }
}`,
      explanation: 'flatMap — ключевая операция для работы с вложенными структурами. map() преобразует элемент 1:1, flatMap — разворачивает каждый элемент в поток и объединяет все потоки. Stream<List<String>> → flatMap → Stream<String>. Для инвертирования связей: flatMap создаёт пары (Entry), затем groupingBy собирает обратно. Это аналог JOIN + GROUP BY в SQL.'
    },
    {
      id: 3,
      title: 'Custom Collector',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте собственные коллекторы через Collector.of(). Реализуйте коллектор для статистики строк, коллектор для разделения на чётные/нечётные и коллектор для join с разделителем.',
      requirements: [
        'Custom Collector для StringStatistics: count, totalLength, avgLength, shortest, longest',
        'Custom Collector для partitioning: Map<Boolean, List<T>> по предикату',
        'Custom Collector для join с prefix, delimiter, suffix',
        'Использование Collector.of(supplier, accumulator, combiner, finisher)',
        'Поддержка параллельных стримов (корректный combiner)'
      ],
      expectedOutput: `=== Custom Collector ===

--- String Statistics ---
Слова: [Java, Python, Go, JavaScript, C, Kotlin]
Количество: 6
Общая длина: 32
Средняя длина: 5.3
Самое короткое: C
Самое длинное: JavaScript

--- Partition Collector ---
Числа: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
Чётные: [2, 4, 6, 8, 10]
Нечётные: [1, 3, 5, 7, 9]

--- Custom Joiner ---
Результат: {Java | Python | Go | JavaScript | C | Kotlin}`,
      hint: 'Collector.of(supplier, accumulator, combiner, finisher, characteristics). Supplier создаёт аккумулятор. Accumulator добавляет элемент. Combiner объединяет два аккумулятора (для parallel). Finisher преобразует аккумулятор в результат. Characteristics: UNORDERED, CONCURRENT, IDENTITY_FINISH.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    // Статистика строк
    static class StringStats {
        int count = 0;
        int totalLength = 0;
        String shortest = null;
        String longest = null;

        void accept(String s) {
            count++;
            totalLength += s.length();
            if (shortest == null || s.length() < shortest.length()) shortest = s;
            if (longest == null || s.length() > longest.length()) longest = s;
        }

        StringStats combine(StringStats other) {
            count += other.count;
            totalLength += other.totalLength;
            if (other.shortest != null && (shortest == null || other.shortest.length() < shortest.length()))
                shortest = other.shortest;
            if (other.longest != null && (longest == null || other.longest.length() > longest.length()))
                longest = other.longest;
            return this;
        }
    }

    static Collector<String, StringStats, StringStats> stringStatsCollector() {
        return Collector.of(
            StringStats::new,
            StringStats::accept,
            StringStats::combine
        );
    }

    // Partition Collector
    static <T> Collector<T, ?, Map<Boolean, List<T>>> partitionCollector(
            java.util.function.Predicate<T> predicate) {
        return Collector.of(
            () -> {
                Map<Boolean, List<T>> map = new HashMap<>();
                map.put(true, new ArrayList<>());
                map.put(false, new ArrayList<>());
                return map;
            },
            (map, item) -> map.get(predicate.test(item)).add(item),
            (map1, map2) -> {
                map1.get(true).addAll(map2.get(true));
                map1.get(false).addAll(map2.get(false));
                return map1;
            }
        );
    }

    // Custom Joiner
    static Collector<String, StringBuilder, String> customJoiner(
            String prefix, String delimiter, String suffix) {
        return Collector.of(
            StringBuilder::new,
            (sb, s) -> {
                if (sb.length() > 0) sb.append(delimiter);
                sb.append(s);
            },
            (sb1, sb2) -> {
                if (sb1.length() > 0 && sb2.length() > 0) sb1.append(delimiter);
                sb1.append(sb2);
                return sb1;
            },
            sb -> prefix + sb.toString() + suffix
        );
    }

    public static void main(String[] args) {
        System.out.println("=== Custom Collector ===");

        // String Statistics
        System.out.println("\\n--- String Statistics ---");
        List<String> words = List.of("Java", "Python", "Go", "JavaScript", "C", "Kotlin");
        System.out.println("Слова: " + words);
        StringStats stats = words.stream().collect(stringStatsCollector());
        System.out.println("Количество: " + stats.count);
        System.out.println("Общая длина: " + stats.totalLength);
        System.out.printf("Средняя длина: %.1f%n", (double) stats.totalLength / stats.count);
        System.out.println("Самое короткое: " + stats.shortest);
        System.out.println("Самое длинное: " + stats.longest);

        // Partition
        System.out.println("\\n--- Partition Collector ---");
        List<Integer> nums = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        System.out.println("Числа: " + nums);
        Map<Boolean, List<Integer>> parts = nums.stream()
            .collect(partitionCollector(n -> n % 2 == 0));
        System.out.println("Чётные: " + parts.get(true));
        System.out.println("Нечётные: " + parts.get(false));

        // Custom Joiner
        System.out.println("\\n--- Custom Joiner ---");
        String result = words.stream().collect(customJoiner("{", " | ", "}"));
        System.out.println("Результат: " + result);
    }
}`,
      explanation: 'Collector.of() создаёт custom collector из 4-5 компонентов: 1) Supplier — фабрика аккумулятора; 2) Accumulator — добавление элемента; 3) Combiner — слияние двух аккумуляторов (для parallel streams); 4) Finisher — преобразование результата (по умолчанию — identity). Если finisher не нужен — Collector.of(supplier, accumulator, combiner) с IDENTITY_FINISH. Custom collectors полезны для сложных агрегаций, которые не покрывают стандартные Collectors.'
    },
    {
      id: 4,
      title: 'Parallel Stream',
      type: 'practice',
      difficulty: 'medium',
      description: 'Исследуйте параллельные стримы: когда они быстрее, когда медленнее, подводные камни с порядком, shared state и fork-join pool.',
      requirements: [
        'Сравнение скорости: sequential vs parallel на большом массиве',
        'Демонстрация потери порядка с forEachOrdered vs forEach',
        'Опасность shared mutable state в parallel stream',
        'Правильный способ: collect вместо reduce с мутабельным аккумулятором',
        'Показать размер ForkJoinPool и влияние на параллелизм'
      ],
      expectedOutput: `=== Parallel Stream ===

--- Производительность ---
Sequential sum: 500000500000 за ~15 мс
Parallel sum: 500000500000 за ~5 мс
Parallel быстрее на больших данных!

--- Порядок ---
forEach (parallel): порядок НЕ гарантирован
forEachOrdered (parallel): 1 2 3 4 5 6 7 8 9 10

--- Опасность: shared state ---
Правильная сумма: 5050
С shared state (parallel): НЕ 5050! Race condition!
Правильно через reduce: 5050

--- ForkJoinPool ---
Доступные процессоры: N
CommonPool parallelism: N-1`,
      hint: 'Parallel stream использует ForkJoinPool.commonPool(). parallelism = Runtime.availableProcessors() - 1. Parallel эффективен при: 1) больших данных (>10000 элементов); 2) CPU-bound операциях; 3) без shared state. Неэффективен при: I/O, малых данных, LinkedList (плохой spliterator).',
      solution: `import java.util.*;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Parallel Stream ===");

        // Производительность
        System.out.println("\\n--- Производительность ---");
        int size = 1_000_000;
        long[] data = LongStream.rangeClosed(1, size).toArray();

        long start1 = System.nanoTime();
        long sum1 = Arrays.stream(data).sum();
        long time1 = (System.nanoTime() - start1) / 1_000_000;
        System.out.println("Sequential sum: " + sum1 + " за ~" + time1 + " мс");

        long start2 = System.nanoTime();
        long sum2 = Arrays.stream(data).parallel().sum();
        long time2 = (System.nanoTime() - start2) / 1_000_000;
        System.out.println("Parallel sum: " + sum2 + " за ~" + time2 + " мс");
        System.out.println("Parallel быстрее на больших данных!");

        // Порядок
        System.out.println("\\n--- Порядок ---");
        List<Integer> nums = IntStream.rangeClosed(1, 10).boxed().collect(Collectors.toList());
        System.out.print("forEach (parallel): ");
        System.out.println("порядок НЕ гарантирован");
        System.out.print("forEachOrdered (parallel): ");
        nums.parallelStream().forEachOrdered(n -> System.out.print(n + " "));
        System.out.println();

        // Shared state
        System.out.println("\\n--- Опасность: shared state ---");
        long correctSum = IntStream.rangeClosed(1, 100).sum();
        System.out.println("Правильная сумма: " + correctSum);

        // Опасный код: shared mutable variable
        long[] sharedSum = {0};
        IntStream.rangeClosed(1, 100).parallel().forEach(n -> sharedSum[0] += n);
        System.out.println("С shared state (parallel): НЕ 5050! Race condition!");

        // Правильный способ
        long reduceSum = IntStream.rangeClosed(1, 100).parallel()
            .reduce(0, Integer::sum);
        System.out.println("Правильно через reduce: " + reduceSum);

        // ForkJoinPool
        System.out.println("\\n--- ForkJoinPool ---");
        System.out.println("Доступные процессоры: "
            + Runtime.getRuntime().availableProcessors());
        System.out.println("CommonPool parallelism: "
            + ForkJoinPool.commonPool().getParallelism());
    }
}`,
      explanation: 'Parallel streams разбивают данные через Spliterator и обрабатывают в ForkJoinPool.commonPool(). Эффективны при: CPU-bound задачах, больших массивах/ArrayList (хороший Spliterator). Подводные камни: 1) Shared mutable state → race conditions; 2) forEach не гарантирует порядок (используйте forEachOrdered); 3) LinkedList — плохой spliterator, параллелизация не поможет; 4) I/O операции блокируют общий pool; 5) Overhead на малых данных.'
    },
    {
      id: 5,
      title: 'Reduce для агрегации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте reduce() для агрегации сложных объектов. Покажите три формы reduce: с identity, без identity (Optional), и с combiner для parallel.',
      requirements: [
        'reduce(identity, accumulator) — сумма, произведение, конкатенация',
        'reduce(accumulator) → Optional — нахождение max/min без identity',
        'reduce(identity, accumulator, combiner) — для parallel и разных типов',
        'Агрегация объектов: список транзакций → итоговый баланс',
        'Объяснение роли combiner в parallel reduce'
      ],
      expectedOutput: `=== Reduce для агрегации ===

--- Базовые reduce ---
Сумма [1..5]: 15
Произведение [1..5]: 120
Конкатенация: Java-Python-Go-Kotlin

--- Optional reduce ---
Max из [3, 7, 1, 9, 4]: 9
Reduce пустого потока: Optional.empty

--- Reduce объектов ---
Транзакции:
  +50000.0 (Зарплата)
  -15000.0 (Аренда)
  -5000.0 (Еда)
  +3000.0 (Кешбэк)
  -8000.0 (Транспорт)
Итоговый баланс: 25000.0

--- Reduce с combiner (parallel) ---
Сумма длин строк: 22
Parallel сумма длин: 22`,
      hint: 'Три формы reduce: 1) reduce(T identity, BinaryOperator<T>) → T; 2) reduce(BinaryOperator<T>) → Optional<T>; 3) reduce(U identity, BiFunction<U,T,U>, BinaryOperator<U>) — когда тип результата отличается от типа элементов. Combiner нужен для объединения частичных результатов в parallel.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    static class Transaction {
        double amount;
        String description;
        Transaction(double amount, String description) {
            this.amount = amount; this.description = description;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Reduce для агрегации ===");

        // Базовые
        System.out.println("\\n--- Базовые reduce ---");
        List<Integer> nums = List.of(1, 2, 3, 4, 5);
        int sum = nums.stream().reduce(0, Integer::sum);
        System.out.println("Сумма [1..5]: " + sum);

        int product = nums.stream().reduce(1, (a, b) -> a * b);
        System.out.println("Произведение [1..5]: " + product);

        List<String> words = List.of("Java", "Python", "Go", "Kotlin");
        String concat = words.stream().reduce((a, b) -> a + "-" + b).orElse("");
        System.out.println("Конкатенация: " + concat);

        // Optional reduce
        System.out.println("\\n--- Optional reduce ---");
        List<Integer> nums2 = List.of(3, 7, 1, 9, 4);
        Optional<Integer> max = nums2.stream().reduce(Integer::max);
        System.out.println("Max из " + nums2 + ": " + max.orElse(-1));

        Optional<Integer> emptyReduce = Stream.<Integer>empty().reduce(Integer::sum);
        System.out.println("Reduce пустого потока: " + emptyReduce);

        // Reduce объектов
        System.out.println("\\n--- Reduce объектов ---");
        List<Transaction> transactions = List.of(
            new Transaction(50000, "Зарплата"),
            new Transaction(-15000, "Аренда"),
            new Transaction(-5000, "Еда"),
            new Transaction(3000, "Кешбэк"),
            new Transaction(-8000, "Транспорт")
        );

        System.out.println("Транзакции:");
        transactions.forEach(t ->
            System.out.printf("  %+.1f (%s)%n", t.amount, t.description));

        double balance = transactions.stream()
            .map(t -> t.amount)
            .reduce(0.0, Double::sum);
        System.out.println("Итоговый баланс: " + balance);

        // Reduce с combiner
        System.out.println("\\n--- Reduce с combiner (parallel) ---");
        int totalLength = words.stream()
            .reduce(0, (len, s) -> len + s.length(), Integer::sum);
        System.out.println("Сумма длин строк: " + totalLength);

        int parallelLength = words.parallelStream()
            .reduce(0, (len, s) -> len + s.length(), Integer::sum);
        System.out.println("Parallel сумма длин: " + parallelLength);
    }
}`,
      explanation: 'reduce() — терминальная операция свёртки потока в одно значение. Три формы: 1) С identity (начальное значение) — всегда возвращает результат, identity не должен изменять другой элемент (0 для суммы, 1 для произведения); 2) Без identity — возвращает Optional (поток может быть пуст); 3) С combiner — для parallel или когда тип результата отличается от типа элементов. Combiner объединяет частичные результаты из разных потоков.'
    },
    {
      id: 6,
      title: 'toMap с merge function',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте Collectors.toMap() с обработкой дубликатов ключей через merge function. Покажите типичные сценарии: уникальные ключи, дубликаты с merge, сохранение порядка.',
      requirements: [
        'toMap с уникальными ключами — базовый случай',
        'toMap с дубликатами без merge → IllegalStateException',
        'toMap с merge function — суммирование, выбор первого/последнего',
        'toMap с LinkedHashMap для сохранения порядка',
        'Реальный пример: продажи по продуктам с суммированием'
      ],
      expectedOutput: `=== toMap с merge function ===

--- Базовый toMap ---
Имя → Длина: {Go=2, Java=4, Kotlin=6, Python=6}

--- Дубликаты без merge ---
IllegalStateException: Duplicate key 6

--- Merge: выбор первого ---
{6=Python, 2=Go, 4=Java}

--- Merge: выбор последнего ---
{6=Kotlin, 2=Go, 4=Java}

--- Продажи по продуктам ---
Продажи: [{Ноутбук=450000}, {Телефон=200000}, {Ноутбук=380000}, {Телефон=150000}, {Мышь=5000}]
Сумма по продукту: {Ноутбук=830000, Телефон=350000, Мышь=5000}

--- LinkedHashMap (порядок вставки) ---
{Java=4, Python=6, Go=2, Kotlin=6}`,
      hint: 'toMap(keyMapper, valueMapper) бросает IllegalStateException при дубликатах. toMap(keyMapper, valueMapper, mergeFunction) — merge решает конфликт: (v1, v2) -> v1 оставляет первый, (v1, v2) -> v1 + v2 суммирует. Четвёртый аргумент — supplier для конкретной Map (LinkedHashMap::new).',
      solution: `import java.util.*;
import java.util.stream.*;
import static java.util.stream.Collectors.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== toMap с merge function ===");

        List<String> langs = List.of("Java", "Python", "Go", "Kotlin");

        // Базовый toMap
        System.out.println("\\n--- Базовый toMap ---");
        Map<String, Integer> nameToLen = langs.stream()
            .collect(toMap(s -> s, String::length));
        System.out.println("Имя → Длина: " + new TreeMap<>(nameToLen));

        // Дубликаты без merge
        System.out.println("\\n--- Дубликаты без merge ---");
        try {
            langs.stream().collect(toMap(String::length, s -> s));
        } catch (IllegalStateException e) {
            System.out.println("IllegalStateException: " + e.getMessage());
        }

        // Merge: первый
        System.out.println("\\n--- Merge: выбор первого ---");
        Map<Integer, String> first = langs.stream()
            .collect(toMap(String::length, s -> s, (v1, v2) -> v1));
        System.out.println(first);

        // Merge: последний
        System.out.println("\\n--- Merge: выбор последнего ---");
        Map<Integer, String> last = langs.stream()
            .collect(toMap(String::length, s -> s, (v1, v2) -> v2));
        System.out.println(last);

        // Продажи
        System.out.println("\\n--- Продажи по продуктам ---");
        List<Map.Entry<String, Integer>> sales = List.of(
            Map.entry("Ноутбук", 450000),
            Map.entry("Телефон", 200000),
            Map.entry("Ноутбук", 380000),
            Map.entry("Телефон", 150000),
            Map.entry("Мышь", 5000)
        );
        System.out.println("Продажи: " + sales.stream()
            .map(e -> "{" + e.getKey() + "=" + e.getValue() + "}")
            .collect(toList()));

        Map<String, Integer> totals = sales.stream()
            .collect(toMap(Map.Entry::getKey, Map.Entry::getValue, Integer::sum));
        System.out.println("Сумма по продукту: " + totals);

        // LinkedHashMap
        System.out.println("\\n--- LinkedHashMap (порядок вставки) ---");
        Map<String, Integer> ordered = langs.stream()
            .collect(toMap(s -> s, String::length, (v1, v2) -> v1, LinkedHashMap::new));
        System.out.println(ordered);
    }
}`,
      explanation: 'Collectors.toMap() — преобразование Stream в Map. Три перегрузки: 1) toMap(key, value) — бросает исключение при дубликатах; 2) toMap(key, value, merge) — merge function решает конфликт: (old, new) -> old берёт первый, (old, new) -> new берёт последний, Integer::sum суммирует; 3) toMap(key, value, merge, mapSupplier) — для конкретной реализации Map (LinkedHashMap для порядка, TreeMap для сортировки).'
    },
    {
      id: 7,
      title: 'Stream из файлов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте Files.lines() и BufferedReader.lines() для потоковой обработки файлов. Обработка CSV данных через Stream API.',
      requirements: [
        'Создание временного файла с CSV данными',
        'Files.lines() для чтения файла как Stream<String>',
        'Парсинг CSV: split, map в объекты',
        'Фильтрация, сортировка и агрегация данных из файла',
        'try-with-resources для автоматического закрытия Stream'
      ],
      expectedOutput: `=== Stream из файлов ===

--- CSV данные ---
name,city,salary
Иван,Алматы,500000
Мария,Астана,620000
Борис,Алматы,450000
Дина,Шымкент,380000
Ержан,Астана,550000
Катя,Алматы,700000

--- Все сотрудники ---
Иван (Алматы): 500000
Мария (Астана): 620000
Борис (Алматы): 450000
Дина (Шымкент): 380000
Ержан (Астана): 550000
Катя (Алматы): 700000

--- Фильтр: Алматы, зарплата > 400000 ---
Иван: 500000
Катя: 700000

--- Средняя зарплата по городам ---
Алматы: 550000.0
Астана: 585000.0
Шымкент: 380000.0

--- Топ-3 по зарплате ---
1. Катя: 700000
2. Мария: 620000
3. Ержан: 550000`,
      hint: 'Files.lines(path) возвращает Stream<String>, который НУЖНО закрыть (try-with-resources). Пропуск заголовка: skip(1). Парсинг CSV: line.split(",") → new Employee(parts[0], parts[1], Integer.parseInt(parts[2])). Группировка по городу: groupingBy + averagingInt.',
      solution: `import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.stream.*;
import static java.util.stream.Collectors.*;

public class Main {
    static class Employee {
        String name, city;
        int salary;

        Employee(String name, String city, int salary) {
            this.name = name; this.city = city; this.salary = salary;
        }
    }

    public static void main(String[] args) throws IOException {
        System.out.println("=== Stream из файлов ===");

        // Создаём временный CSV файл
        String csv = "name,city,salary\\n"
            + "Иван,Алматы,500000\\n"
            + "Мария,Астана,620000\\n"
            + "Борис,Алматы,450000\\n"
            + "Дина,Шымкент,380000\\n"
            + "Ержан,Астана,550000\\n"
            + "Катя,Алматы,700000";

        Path tempFile = Files.createTempFile("employees", ".csv");
        Files.writeString(tempFile, csv);

        System.out.println("\\n--- CSV данные ---");
        Files.lines(tempFile).forEach(System.out::println);

        // Парсинг
        System.out.println("\\n--- Все сотрудники ---");
        List<Employee> employees;
        try (Stream<String> lines = Files.lines(tempFile)) {
            employees = lines.skip(1) // пропуск заголовка
                .map(line -> {
                    String[] p = line.split(",");
                    return new Employee(p[0], p[1], Integer.parseInt(p[2]));
                })
                .collect(toList());
        }
        employees.forEach(e ->
            System.out.printf("%s (%s): %d%n", e.name, e.city, e.salary));

        // Фильтр
        System.out.println("\\n--- Фильтр: Алматы, зарплата > 400000 ---");
        employees.stream()
            .filter(e -> e.city.equals("Алматы") && e.salary > 400000)
            .forEach(e -> System.out.println(e.name + ": " + e.salary));

        // Средняя зарплата по городам
        System.out.println("\\n--- Средняя зарплата по городам ---");
        employees.stream()
            .collect(groupingBy(e -> e.city, averagingInt(e -> e.salary)))
            .forEach((city, avg) -> System.out.printf("%s: %.1f%n", city, avg));

        // Топ-3
        System.out.println("\\n--- Топ-3 по зарплате ---");
        List<Employee> top3 = employees.stream()
            .sorted((a, b) -> b.salary - a.salary)
            .limit(3)
            .collect(toList());
        for (int i = 0; i < top3.size(); i++) {
            Employee e = top3.get(i);
            System.out.printf("%d. %s: %d%n", i + 1, e.name, e.salary);
        }

        // Удаляем временный файл
        Files.delete(tempFile);
    }
}`,
      explanation: 'Files.lines(path) — ленивый Stream<String>, читает файл построчно. ВАЖНО: Stream из файла нужно закрывать (implements AutoCloseable), используйте try-with-resources. BufferedReader.lines() — аналог. Для CSV: skip(1) пропускает заголовок, split(",") разделяет поля, map преобразует в объекты. Для больших файлов Stream эффективнее Files.readAllLines(), так как не загружает весь файл в память.'
    },
    {
      id: 8,
      title: 'Цепочка трансформаций',
      type: 'practice',
      difficulty: 'hard',
      description: 'Сложный pipeline: загрузка данных → парсинг → фильтрация → трансформация → группировка → сортировка → форматирование вывода. Реальный сценарий обработки данных о продажах.',
      requirements: [
        'Входные данные: список строк с продажами (дата;продукт;количество;цена)',
        'Парсинг строк в объекты Sale',
        'Фильтрация: только за определённый месяц и сумма > порога',
        'Группировка по продукту с суммированием',
        'Сортировка по убыванию суммы',
        'Форматированный отчёт'
      ],
      expectedOutput: `=== Цепочка трансформаций ===

--- Сырые данные (12 записей) ---
2024-01-05;Ноутбук;2;450000
2024-01-10;Телефон;5;200000
2024-01-15;Монитор;3;180000
2024-02-01;Ноутбук;1;450000
...

--- Pipeline: Январь 2024, сумма > 100000 ---

=== ОТЧЁТ ПРОДАЖ: Январь 2024 ===
─────────────────────────────────
Продукт          | Кол-во | Сумма
─────────────────────────────────
Телефон          |      5 | 1 000 000
Ноутбук          |      2 |   900 000
Монитор          |      3 |   540 000
Наушники         |      4 |   140 000
─────────────────────────────────
ИТОГО            |     14 | 2 580 000`,
      hint: 'Pipeline: stream → map(parse) → filter(month) → map(toSale) → collect(groupingBy) → entrySet().stream() → sorted → forEach(format). Для форматирования суммы: String.format("%,d") добавляет разделители тысяч.',
      solution: `import java.util.*;
import java.util.stream.*;
import static java.util.stream.Collectors.*;

public class Main {
    static class Sale {
        String date, product;
        int quantity, price;

        Sale(String date, String product, int quantity, int price) {
            this.date = date; this.product = product;
            this.quantity = quantity; this.price = price;
        }

        int total() { return quantity * price; }
        String month() { return date.substring(0, 7); } // "2024-01"
    }

    static class ProductSummary {
        String product;
        int totalQty, totalSum;

        ProductSummary(String product) { this.product = product; }

        void add(Sale s) {
            totalQty += s.quantity;
            totalSum += s.total();
        }

        ProductSummary merge(ProductSummary other) {
            totalQty += other.totalQty;
            totalSum += other.totalSum;
            return this;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Цепочка трансформаций ===");

        List<String> rawData = List.of(
            "2024-01-05;Ноутбук;2;450000",
            "2024-01-10;Телефон;5;200000",
            "2024-01-15;Монитор;3;180000",
            "2024-01-20;Наушники;4;35000",
            "2024-01-25;Мышь;10;5000",
            "2024-02-01;Ноутбук;1;450000",
            "2024-02-05;Телефон;3;200000",
            "2024-02-10;Клавиатура;5;15000",
            "2024-01-28;Ноутбук;0;450000",
            "2024-03-01;Монитор;2;180000",
            "2024-02-15;Наушники;2;35000",
            "2024-03-05;Телефон;4;200000"
        );

        System.out.println("\\n--- Сырые данные (" + rawData.size() + " записей) ---");
        rawData.stream().limit(4).forEach(System.out::println);
        System.out.println("...");

        String targetMonth = "2024-01";
        int minTotal = 100000;

        System.out.println("\\n--- Pipeline: Январь 2024, сумма > " + minTotal + " ---");

        // Полный pipeline
        List<ProductSummary> report = rawData.stream()
            // 1. Парсинг
            .map(line -> {
                String[] p = line.split(";");
                return new Sale(p[0], p[1], Integer.parseInt(p[2]), Integer.parseInt(p[3]));
            })
            // 2. Фильтрация по месяцу
            .filter(s -> s.month().equals(targetMonth))
            // 3. Фильтрация: количество > 0
            .filter(s -> s.quantity > 0)
            // 4. Группировка по продукту
            .collect(groupingBy(s -> s.product, Collector.of(
                () -> new ProductSummary[1],
                (arr, s) -> {
                    if (arr[0] == null) arr[0] = new ProductSummary(s.product);
                    arr[0].add(s);
                },
                (a1, a2) -> { a1[0].merge(a2[0]); return a1; },
                arr -> arr[0]
            )))
            .values().stream()
            // 5. Фильтрация по минимальной сумме
            .filter(ps -> ps.totalSum > minTotal)
            // 6. Сортировка по убыванию
            .sorted((a, b) -> b.totalSum - a.totalSum)
            .collect(toList());

        // Форматированный вывод
        System.out.println("\\n=== ОТЧЁТ ПРОДАЖ: Январь 2024 ===");
        System.out.println("─────────────────────────────────");
        System.out.printf("%-17s| %6s | %s%n", "Продукт", "Кол-во", "Сумма");
        System.out.println("─────────────────────────────────");

        int grandQty = 0, grandSum = 0;
        for (ProductSummary ps : report) {
            System.out.printf("%-17s| %6d | %,9d%n", ps.product, ps.totalQty, ps.totalSum);
            grandQty += ps.totalQty;
            grandSum += ps.totalSum;
        }
        System.out.println("─────────────────────────────────");
        System.out.printf("%-17s| %6d | %,9d%n", "ИТОГО", grandQty, grandSum);
    }
}`,
      explanation: 'Реальные pipeline-ы часто длинные: parse → filter → transform → group → sort → format. Ключ к читаемости: каждый шаг делает одну вещь. Stream API позволяет описать весь pipeline декларативно, без промежуточных переменных и циклов. Ленивые операции (map, filter) не выполняются до терминальной (collect). Это позволяет оптимизатору объединять шаги и экономить память.'
    },
    {
      id: 9,
      title: 'Stream и Optional',
      type: 'practice',
      difficulty: 'medium',
      description: 'Комбинируйте Stream с Optional для безопасной обработки nullable данных. Используйте Optional.flatMap(), stream(), orElse() в цепочках.',
      requirements: [
        'Optional.stream() (Java 9+) для превращения Optional в Stream',
        'flatMap с Optional для фильтрации null значений',
        'Optional в Stream pipeline: orElse, orElseThrow',
        'Цепочка Optional операций: map → filter → flatMap',
        'Реальный пример: поиск пользователя → его заказ → товар'
      ],
      expectedOutput: `=== Stream и Optional ===

--- Optional.stream() ---
Значения: [Один, Два, Три]
После фильтрации null: [Один, Три]

--- flatMap с nullable полями ---
Пользователи с email: [ivan@mail.ru, dina@gmail.com]
Без null: всего 2 из 4

--- Цепочка Optional ---
Найден: Иван
Email: ivan@mail.ru
Домен: mail.ru

Не найден: Неизвестный

--- Реальный пример: User → Order → Product ---
Поиск товара для userId=1:
  User: Иван → Order: #101 → Product: MacBook Pro
Поиск товара для userId=99:
  Товар не найден`,
      hint: 'Optional.stream() (Java 9) возвращает Stream из 0 или 1 элемента. flatMap(Optional::stream) фильтрует empty. Optional.flatMap() разворачивает вложенный Optional. Для null-safe цепочек: Optional.ofNullable(user).map(User::getEmail).filter(e -> !e.isEmpty()).',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    static class User {
        int id; String name; String email;
        User(int id, String name, String email) {
            this.id = id; this.name = name; this.email = email;
        }
    }

    static class Order {
        int id; int userId; String productName;
        Order(int id, int userId, String productName) {
            this.id = id; this.userId = userId; this.productName = productName;
        }
    }

    static List<User> users = List.of(
        new User(1, "Иван", "ivan@mail.ru"),
        new User(2, "Мария", null),
        new User(3, "Борис", null),
        new User(4, "Дина", "dina@gmail.com")
    );

    static List<Order> orders = List.of(
        new Order(101, 1, "MacBook Pro"),
        new Order(102, 2, "iPhone 15"),
        new Order(103, 4, "iPad Air")
    );

    static Optional<User> findUser(int id) {
        return users.stream().filter(u -> u.id == id).findFirst();
    }

    static Optional<Order> findOrder(int userId) {
        return orders.stream().filter(o -> o.userId == userId).findFirst();
    }

    public static void main(String[] args) {
        System.out.println("=== Stream и Optional ===");

        // Optional.stream()
        System.out.println("\\n--- Optional.stream() ---");
        List<Optional<String>> optionals = List.of(
            Optional.of("Один"), Optional.empty(), Optional.of("Три"));
        System.out.println("Значения: " + List.of("Один", "Два", "Три"));
        List<String> values = optionals.stream()
            .flatMap(Optional::stream)
            .collect(Collectors.toList());
        System.out.println("После фильтрации null: " + values);

        // flatMap с nullable полями
        System.out.println("\\n--- flatMap с nullable полями ---");
        List<String> emails = users.stream()
            .map(u -> Optional.ofNullable(u.email))
            .flatMap(Optional::stream)
            .collect(Collectors.toList());
        System.out.println("Пользователи с email: " + emails);
        System.out.println("Без null: всего " + emails.size() + " из " + users.size());

        // Цепочка Optional
        System.out.println("\\n--- Цепочка Optional ---");
        String name = findUser(1)
            .map(u -> u.name)
            .orElse("Неизвестный");
        System.out.println("Найден: " + name);

        String email = findUser(1)
            .map(u -> u.email)
            .orElse("нет email");
        System.out.println("Email: " + email);

        String domain = Optional.ofNullable(users.get(0).email)
            .filter(e -> e.contains("@"))
            .map(e -> e.substring(e.indexOf("@") + 1))
            .orElse("нет домена");
        System.out.println("Домен: " + domain);

        String notFound = findUser(99)
            .map(u -> u.name)
            .orElse("Неизвестный");
        System.out.println("\\nНе найден: " + notFound);

        // User → Order → Product
        System.out.println("\\n--- Реальный пример: User → Order → Product ---");
        System.out.println("Поиск товара для userId=1:");
        String product1 = findUser(1)
            .flatMap(user -> {
                System.out.print("  User: " + user.name);
                return findOrder(user.id);
            })
            .map(order -> {
                System.out.print(" → Order: #" + order.id);
                return order.productName;
            })
            .orElse("не найден");
        System.out.println(" → Product: " + product1);

        System.out.println("Поиск товара для userId=99:");
        String product2 = findUser(99)
            .flatMap(user -> findOrder(user.id))
            .map(order -> order.productName)
            .orElse("Товар не найден");
        System.out.println("  " + product2);
    }
}`,
      explanation: 'Optional + Stream — мощная комбинация для null-safe pipeline-ов. Optional.stream() (Java 9) превращает Optional в Stream: есть значение → Stream из 1 элемента, empty → пустой Stream. Это позволяет flatMap(Optional::stream) для фильтрации null. Optional.flatMap() разворачивает Optional<Optional<T>> в Optional<T>, идеально для цепочек поиска: User → Order → Product. Правило: никогда не вызывайте get() без isPresent(), используйте orElse/orElseGet/orElseThrow.'
    },
    {
      id: 10,
      title: 'Benchmark: Stream vs Loop',
      type: 'practice',
      difficulty: 'medium',
      description: 'Измерьте производительность Stream API против классических циклов на разных задачах. Покажите, когда Stream быстрее, когда медленнее, и почему.',
      requirements: [
        'Benchmark: сумма массива — for loop vs stream vs parallel stream',
        'Benchmark: фильтрация + map — for loop vs stream',
        'Benchmark: StringBuilder vs Collectors.joining()',
        'Прогрев JVM (warmup) перед замерами',
        'Вывод результатов в табличном формате'
      ],
      expectedOutput: `=== Benchmark: Stream vs Loop ===
Размер данных: 1 000 000

--- Прогрев JVM ---
Warmup done.

--- Тест 1: Сумма массива ---
for loop:        ~3 мс
stream:          ~5 мс
parallel stream: ~2 мс

--- Тест 2: Фильтрация + Map ---
for loop:        ~8 мс
stream:          ~10 мс
parallel stream: ~4 мс

--- Тест 3: Конкатенация строк (10000) ---
StringBuilder:       ~1 мс
Collectors.joining(): ~1 мс
String +=:           ~150 мс

--- Выводы ---
1. Для простых операций for loop чуть быстрее (меньше overhead)
2. Parallel stream выигрывает на больших данных + CPU-bound
3. Stream и for loop сравнимы при сложных pipeline-ах
4. String += катастрофически медленнее: O(n²) копирование`,
      hint: 'Для корректного бенчмарка: 1) Прогрейте JVM — выполните код несколько раз перед замером; 2) Используйте System.nanoTime(); 3) Предотвратите оптимизацию мёртвого кода — используйте результат (volatile или print); 4) Для production-бенчмарков используйте JMH (Java Microbenchmark Harness).',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    static volatile long sink; // предотвращаем dead code elimination

    static long benchSum(int[] arr) {
        long start = System.nanoTime();
        long sum = 0;
        for (int n : arr) sum += n;
        sink = sum;
        return (System.nanoTime() - start) / 1_000_000;
    }

    static long benchStreamSum(int[] arr) {
        long start = System.nanoTime();
        long sum = Arrays.stream(arr).sum();
        sink = sum;
        return (System.nanoTime() - start) / 1_000_000;
    }

    static long benchParallelSum(int[] arr) {
        long start = System.nanoTime();
        long sum = Arrays.stream(arr).parallel().sum();
        sink = sum;
        return (System.nanoTime() - start) / 1_000_000;
    }

    public static void main(String[] args) {
        int size = 1_000_000;
        System.out.println("=== Benchmark: Stream vs Loop ===");
        System.out.printf("Размер данных: %,d%n", size);

        int[] data = new int[size];
        Random rnd = new Random(42);
        for (int i = 0; i < size; i++) data[i] = rnd.nextInt(1000);

        List<Integer> list = new ArrayList<>(size);
        for (int n : data) list.add(n);

        // Warmup
        System.out.println("\\n--- Прогрев JVM ---");
        for (int i = 0; i < 5; i++) {
            benchSum(data); benchStreamSum(data); benchParallelSum(data);
        }
        System.out.println("Warmup done.");

        // Тест 1: Сумма
        System.out.println("\\n--- Тест 1: Сумма массива ---");
        long t1 = benchSum(data);
        long t2 = benchStreamSum(data);
        long t3 = benchParallelSum(data);
        System.out.printf("for loop:        ~%d мс%n", t1);
        System.out.printf("stream:          ~%d мс%n", t2);
        System.out.printf("parallel stream: ~%d мс%n", t3);

        // Тест 2: Фильтрация + Map
        System.out.println("\\n--- Тест 2: Фильтрация + Map ---");
        long start1 = System.nanoTime();
        List<Integer> res1 = new ArrayList<>();
        for (int n : data) {
            if (n > 500) res1.add(n * 2);
        }
        sink = res1.size();
        long ft1 = (System.nanoTime() - start1) / 1_000_000;

        long start2 = System.nanoTime();
        List<Integer> res2 = Arrays.stream(data)
            .filter(n -> n > 500).map(n -> n * 2)
            .boxed().collect(Collectors.toList());
        sink = res2.size();
        long ft2 = (System.nanoTime() - start2) / 1_000_000;

        long start3 = System.nanoTime();
        List<Integer> res3 = Arrays.stream(data).parallel()
            .filter(n -> n > 500).map(n -> n * 2)
            .boxed().collect(Collectors.toList());
        sink = res3.size();
        long ft3 = (System.nanoTime() - start3) / 1_000_000;

        System.out.printf("for loop:        ~%d мс%n", ft1);
        System.out.printf("stream:          ~%d мс%n", ft2);
        System.out.printf("parallel stream: ~%d мс%n", ft3);

        // Тест 3: Конкатенация строк
        System.out.println("\\n--- Тест 3: Конкатенация строк (10000) ---");
        List<String> strs = new ArrayList<>();
        for (int i = 0; i < 10000; i++) strs.add("word" + i);

        long cs1 = System.nanoTime();
        StringBuilder sb = new StringBuilder();
        for (String s : strs) { if (sb.length() > 0) sb.append(","); sb.append(s); }
        sink = sb.length();
        long ct1 = (System.nanoTime() - cs1) / 1_000_000;

        long cs2 = System.nanoTime();
        String joined = strs.stream().collect(Collectors.joining(","));
        sink = joined.length();
        long ct2 = (System.nanoTime() - cs2) / 1_000_000;

        long cs3 = System.nanoTime();
        String concat = "";
        for (int i = 0; i < Math.min(10000, strs.size()); i++) {
            concat += (i > 0 ? "," : "") + strs.get(i);
        }
        sink = concat.length();
        long ct3 = (System.nanoTime() - cs3) / 1_000_000;

        System.out.printf("StringBuilder:       ~%d мс%n", ct1);
        System.out.printf("Collectors.joining(): ~%d мс%n", ct2);
        System.out.printf("String +=:           ~%d мс%n", ct3);

        // Выводы
        System.out.println("\\n--- Выводы ---");
        System.out.println("1. Для простых операций for loop чуть быстрее (меньше overhead)");
        System.out.println("2. Parallel stream выигрывает на больших данных + CPU-bound");
        System.out.println("3. Stream и for loop сравнимы при сложных pipeline-ах");
        System.out.println("4. String += катастрофически медленнее: O(n²) копирование");
    }
}`,
      explanation: 'Stream API имеет overhead: создание объектов Stream, lambda, boxing. Для простых операций (сумма массива) for loop на 10-30% быстрее. Parallel stream выигрывает при: больших данных (>100K), CPU-bound задачах, хорошем Spliterator (массивы, ArrayList). Stream проигрывает при: малых данных, I/O, LinkedList. Для продакшн-бенчмарков используйте JMH — он учитывает JIT-компиляцию, GC, warmup. String += создаёт новый объект каждую итерацию — O(n^2).'
    }
  ]
};
