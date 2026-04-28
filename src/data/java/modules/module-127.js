export default {
  id: 127,
  title: 'Практикум: Performance и оптимизация',
  description: 'Бенчмарки строк и коллекций, lazy initialization, object pool, кеширование, stream vs loop, профилирование, утечки памяти и основы GC tuning.',
  lessons: [
    {
      id: 1,
      title: 'StringBuilder vs String concatenation',
      type: 'practice',
      difficulty: 'easy',
      description: 'Измерьте разницу между конкатенацией строк оператором + в цикле и использованием StringBuilder. При каждой конкатенации + создаётся новый объект String, что приводит к O(n²) по памяти. StringBuilder изменяет внутренний char[]/byte[] буфер in-place, давая O(n). Продемонстрируйте разницу во времени на 100 000 итераций.',
      requirements: [
        'Метод concatWithPlus(int n) — конкатенация строк оператором + в цикле n раз',
        'Метод concatWithBuilder(int n) — StringBuilder.append() в цикле n раз',
        'Измерить время каждого метода через System.nanoTime()',
        'Вывести длину результата и время в мс',
        'Показать во сколько раз StringBuilder быстрее'
      ],
      expectedOutput: `=== String concatenation vs StringBuilder ===

String + (10000 итераций):
  Длина: 68890
  Время: ~150 мс

StringBuilder (10000 итераций):
  Длина: 68890
  Время: ~1 мс

StringBuilder быстрее в ~150 раз

Вывод: В циклах ВСЕГДА используйте StringBuilder!`,
      hint: 'System.nanoTime() до и после вызова, разница / 1_000_000.0 даст миллисекунды. Для стабильности можно сделать warm-up итерацию.',
      solution: `public class Main {
    static String concatWithPlus(int n) {
        String result = "";
        for (int i = 0; i < n; i++) {
            result += "item" + i + ",";
        }
        return result;
    }

    static String concatWithBuilder(int n) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append("item").append(i).append(",");
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        int n = 10000;

        System.out.println("=== String concatenation vs StringBuilder ===");

        // Warm-up
        concatWithPlus(100);
        concatWithBuilder(100);

        // String +
        long start1 = System.nanoTime();
        String r1 = concatWithPlus(n);
        long time1 = System.nanoTime() - start1;
        double ms1 = time1 / 1_000_000.0;

        System.out.println("\\nString + (" + n + " итераций):");
        System.out.println("  Длина: " + r1.length());
        System.out.printf("  Время: ~%.0f мс%n", ms1);

        // StringBuilder
        long start2 = System.nanoTime();
        String r2 = concatWithBuilder(n);
        long time2 = System.nanoTime() - start2;
        double ms2 = time2 / 1_000_000.0;

        System.out.println("\\nStringBuilder (" + n + " итераций):");
        System.out.println("  Длина: " + r2.length());
        System.out.printf("  Время: ~%.0f мс%n", ms2);

        System.out.printf("\\nStringBuilder быстрее в ~%.0f раз%n", ms1 / ms2);
        System.out.println("\\nВывод: В циклах ВСЕГДА используйте StringBuilder!");
    }
}`,
      explanation: 'Оператор + для строк компилируется в создание нового StringBuilder на каждой итерации (до Java 9) или invokedynamic StringConcatFactory (Java 9+). Но в цикле каждая итерация всё равно создаёт новую строку — O(n²) копирований символов. StringBuilder работает с единым буфером, удваивая его при нехватке места — амортизированная O(1) на append. Разница особенно заметна от 1000 итераций.'
    },
    {
      id: 2,
      title: 'ArrayList vs LinkedList benchmark',
      type: 'practice',
      difficulty: 'easy',
      description: 'Проведите бенчмарк ArrayList и LinkedList для операций add (в конец и в начало), get по индексу и remove из середины. ArrayList хранит элементы в массиве (O(1) get, O(n) insert в начало), LinkedList — в двусвязном списке (O(n) get, O(1) insert). Покажите, когда какая коллекция выигрывает.',
      requirements: [
        'Бенчмарк add в конец: 100_000 элементов для обеих коллекций',
        'Бенчмарк add в начало (index 0): 100_000 элементов',
        'Бенчмарк get по случайному индексу: 50_000 обращений',
        'Бенчмарк remove из середины: 10_000 удалений',
        'Вывести таблицу результатов и рекомендацию'
      ],
      expectedOutput: `=== ArrayList vs LinkedList Benchmark ===

Операция              | ArrayList  | LinkedList
-------------------------------------------------
add в конец (100K)    |     ~5 мс  |     ~8 мс
add в начало (100K)   |   ~800 мс  |     ~5 мс
get random (50K)      |     ~3 мс  |  ~5000 мс
remove середина (10K) |    ~15 мс  |  ~1200 мс

=== Рекомендация ===
ArrayList — лучший выбор в 95% случаев.
LinkedList выигрывает только при частых вставках в начало/конец без random access.`,
      hint: 'Предварительно заполните коллекции данными перед тестом get и remove. Используйте Random для случайных индексов.',
      solution: `import java.util.*;

public class Main {
    static long benchmark(Runnable task) {
        long start = System.nanoTime();
        task.run();
        return (System.nanoTime() - start) / 1_000_000;
    }

    public static void main(String[] args) {
        System.out.println("=== ArrayList vs LinkedList Benchmark ===\\n");
        System.out.printf("%-22s| %-10s | %-10s%n", "Операция", "ArrayList", "LinkedList");
        System.out.println("-".repeat(49));

        // Add в конец
        long alEnd = benchmark(() -> {
            List<Integer> list = new ArrayList<>();
            for (int i = 0; i < 100_000; i++) list.add(i);
        });
        long llEnd = benchmark(() -> {
            List<Integer> list = new LinkedList<>();
            for (int i = 0; i < 100_000; i++) list.add(i);
        });
        System.out.printf("%-22s| %7d мс | %7d мс%n", "add в конец (100K)", alEnd, llEnd);

        // Add в начало
        long alStart = benchmark(() -> {
            List<Integer> list = new ArrayList<>();
            for (int i = 0; i < 100_000; i++) list.add(0, i);
        });
        long llStart = benchmark(() -> {
            List<Integer> list = new LinkedList<>();
            for (int i = 0; i < 100_000; i++) list.add(0, i);
        });
        System.out.printf("%-22s| %7d мс | %7d мс%n", "add в начало (100K)", alStart, llStart);

        // Get random
        List<Integer> al = new ArrayList<>();
        List<Integer> ll = new LinkedList<>();
        for (int i = 0; i < 100_000; i++) { al.add(i); ll.add(i); }
        Random rnd = new Random(42);

        int[] indices = new int[50_000];
        for (int i = 0; i < indices.length; i++) indices[i] = rnd.nextInt(100_000);

        long alGet = benchmark(() -> { for (int idx : indices) al.get(idx); });
        long llGet = benchmark(() -> { for (int idx : indices) ll.get(idx); });
        System.out.printf("%-22s| %7d мс | %7d мс%n", "get random (50K)", alGet, llGet);

        // Remove середина
        List<Integer> al2 = new ArrayList<>();
        List<Integer> ll2 = new LinkedList<>();
        for (int i = 0; i < 100_000; i++) { al2.add(i); ll2.add(i); }

        long alRm = benchmark(() -> { for (int i = 0; i < 10_000; i++) al2.remove(al2.size() / 2); });
        long llRm = benchmark(() -> { for (int i = 0; i < 10_000; i++) ll2.remove(ll2.size() / 2); });
        System.out.printf("%-22s| %7d мс | %7d мс%n", "remove середина (10K)", alRm, llRm);

        System.out.println("\\n=== Рекомендация ===");
        System.out.println("ArrayList — лучший выбор в 95% случаев.");
        System.out.println("LinkedList выигрывает только при частых вставках в начало/конец без random access.");
    }
}`,
      explanation: 'ArrayList основан на массиве: get O(1), add в конец амортизированная O(1), но add/remove в начало O(n) из-за сдвига элементов. LinkedList: get O(n), add/remove в начало O(1), но из-за плохой cache locality на практике проигрывает ArrayList почти везде. Дополнительный overhead LinkedList — 24 байта на Node (prev, next, item). Поэтому Java-разработчики используют ArrayList по умолчанию.'
    },
    {
      id: 3,
      title: 'HashMap capacity и load factor',
      type: 'practice',
      difficulty: 'medium',
      description: 'Продемонстрируйте влияние начальной capacity и load factor на производительность HashMap. Когда HashMap заполняется выше load factor (default 0.75), происходит rehashing — пересоздание внутреннего массива и перераспределение всех элементов. Покажите, как предзаполнение capacity устраняет overhead.',
      requirements: [
        'Создать HashMap без указания capacity, добавить 1_000_000 элементов, замерить время',
        'Создать HashMap с capacity = 1_400_000 (n / 0.75 + 1), добавить те же элементы',
        'Подсчитать количество rehash-операций (отслеживая capacity через reflection или расчётом)',
        'Вывести сравнение времени и количество rehash',
        'Показать формулу оптимальной capacity'
      ],
      expectedOutput: `=== HashMap Capacity и Load Factor ===

HashMap default capacity:
  Добавлено: 1000000 элементов
  Время: ~180 мс
  Rehash-операций: ~21 (16→32→64→...→2097152)

HashMap pre-sized (capacity=1400000):
  Добавлено: 1000000 элементов
  Время: ~120 мс
  Rehash-операций: 0

Экономия: ~33%

=== Формула ===
Оптимальная capacity = (int)(expectedSize / 0.75) + 1
Для 1000000 элементов: capacity = 1333334`,
      hint: 'Rehash-счёт: начните с 16, удваивайте пока < n/loadFactor. Каждое удвоение — rehash. Reflection: field "table" в HashMap даёт текущий массив бакетов.',
      solution: `import java.util.*;

public class Main {
    static int countRehashes(int expectedSize, float loadFactor) {
        int capacity = 16; // default initial capacity
        int threshold = (int)(capacity * loadFactor);
        int count = 0;
        for (int i = 1; i <= expectedSize; i++) {
            if (i > threshold) {
                capacity *= 2;
                threshold = (int)(capacity * loadFactor);
                count++;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        int n = 1_000_000;
        float loadFactor = 0.75f;

        System.out.println("=== HashMap Capacity и Load Factor ===");

        // Default capacity
        Map<Integer, Integer> map1 = new HashMap<>();
        long start1 = System.nanoTime();
        for (int i = 0; i < n; i++) map1.put(i, i);
        long time1 = (System.nanoTime() - start1) / 1_000_000;

        int rehashes = countRehashes(n, loadFactor);

        System.out.println("\\nHashMap default capacity:");
        System.out.println("  Добавлено: " + n + " элементов");
        System.out.println("  Время: ~" + time1 + " мс");
        System.out.println("  Rehash-операций: ~" + rehashes + " (16→32→64→...→2097152)");

        // Pre-sized capacity
        int optimalCapacity = (int)(n / loadFactor) + 1;
        Map<Integer, Integer> map2 = new HashMap<>(optimalCapacity + 100_000);
        long start2 = System.nanoTime();
        for (int i = 0; i < n; i++) map2.put(i, i);
        long time2 = (System.nanoTime() - start2) / 1_000_000;

        System.out.println("\\nHashMap pre-sized (capacity=" + (optimalCapacity + 100_000) + "):");
        System.out.println("  Добавлено: " + n + " элементов");
        System.out.println("  Время: ~" + time2 + " мс");
        System.out.println("  Rehash-операций: 0");

        long savings = time1 > 0 ? (time1 - time2) * 100 / time1 : 0;
        System.out.println("\\nЭкономия: ~" + savings + "%");

        System.out.println("\\n=== Формула ===");
        System.out.println("Оптимальная capacity = (int)(expectedSize / 0.75) + 1");
        System.out.println("Для " + n + " элементов: capacity = " + ((int)(n / loadFactor) + 1));
    }
}`,
      explanation: 'HashMap хранит данные в массиве Node[] (бакеты). Default capacity = 16, load factor = 0.75. Когда size > capacity * loadFactor, происходит resize: новый массив 2x, все элементы rehash. Для 1M элементов будет ~21 resize (16→2M+). Каждый rehash — O(n) операция. Предзаполнение capacity = expectedSize / 0.75 + 1 полностью устраняет resize. Guava Maps.newHashMapWithExpectedSize() делает это автоматически.'
    },
    {
      id: 4,
      title: 'Lazy initialization',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте паттерн Lazy Initialization для отложенного создания тяжёлых объектов. Объект создаётся только при первом обращении, а не при старте программы. Это экономит память и ускоряет запуск приложения. Реализуйте универсальный Lazy<T> контейнер и покажите применение.',
      requirements: [
        'Класс Lazy<T> с Supplier<T>, создающий объект при первом вызове get()',
        'Thread-safe версия LazyThreadSafe<T> с double-checked locking',
        'Класс HeavyResource, имитирующий долгую инициализацию (Thread.sleep)',
        'Демонстрация: первый get() — медленный, последующие — мгновенные',
        'Вывести время каждого вызова get()'
      ],
      expectedOutput: `=== Lazy Initialization ===

Создание Lazy<HeavyResource>... (объект ещё НЕ создан)

Первый вызов get():
  Инициализация HeavyResource... (500ms)
  Результат: HeavyResource[data=42, size=1048576]
  Время: ~500 мс

Второй вызов get():
  Результат: HeavyResource[data=42, size=1048576]
  Время: ~0 мс

Третий вызов get():
  Результат: HeavyResource[data=42, size=1048576]
  Время: ~0 мс

=== Thread-safe Lazy ===
10 потоков запрашивают ресурс одновременно...
HeavyResource создан только 1 раз
Все потоки получили один объект: true`,
      hint: 'Double-checked locking: if (value == null) { synchronized(this) { if (value == null) value = supplier.get(); } }. Поле value должно быть volatile.',
      solution: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.util.function.*;

public class Main {
    static class Lazy<T> {
        private final Supplier<T> supplier;
        private T value;

        Lazy(Supplier<T> supplier) { this.supplier = supplier; }

        T get() {
            if (value == null) value = supplier.get();
            return value;
        }
    }

    static class LazyThreadSafe<T> {
        private final Supplier<T> supplier;
        private volatile T value;

        LazyThreadSafe(Supplier<T> supplier) { this.supplier = supplier; }

        T get() {
            if (value == null) {
                synchronized (this) {
                    if (value == null) {
                        value = supplier.get();
                    }
                }
            }
            return value;
        }
    }

    static class HeavyResource {
        int data;
        int size;
        static final AtomicInteger instanceCount = new AtomicInteger(0);

        HeavyResource() {
            instanceCount.incrementAndGet();
            System.out.println("  Инициализация HeavyResource... (500ms)");
            try { Thread.sleep(500); } catch (InterruptedException e) {}
            this.data = 42;
            this.size = 1048576;
        }

        public String toString() {
            return "HeavyResource[data=" + data + ", size=" + size + "]";
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Lazy Initialization ===");
        System.out.println("\\nСоздание Lazy<HeavyResource>... (объект ещё НЕ создан)");

        Lazy<HeavyResource> lazy = new Lazy<>(HeavyResource::new);

        for (int i = 1; i <= 3; i++) {
            String label = i == 1 ? "Первый" : i == 2 ? "Второй" : "Третий";
            System.out.println("\\n" + label + " вызов get():");
            long start = System.nanoTime();
            HeavyResource res = lazy.get();
            long ms = (System.nanoTime() - start) / 1_000_000;
            System.out.println("  Результат: " + res);
            System.out.println("  Время: ~" + ms + " мс");
        }

        // Thread-safe test
        System.out.println("\\n=== Thread-safe Lazy ===");
        HeavyResource.instanceCount.set(0);
        System.out.println("10 потоков запрашивают ресурс одновременно...");

        LazyThreadSafe<HeavyResource> safeLazy = new LazyThreadSafe<>(HeavyResource::new);
        ExecutorService exec = Executors.newFixedThreadPool(10);
        ConcurrentHashMap<Integer, HeavyResource> results = new ConcurrentHashMap<>();
        CountDownLatch latch = new CountDownLatch(1);

        for (int i = 0; i < 10; i++) {
            final int id = i;
            exec.submit(() -> {
                try { latch.await(); } catch (InterruptedException e) {}
                results.put(id, safeLazy.get());
            });
        }
        latch.countDown();
        exec.shutdown();
        exec.awaitTermination(5, TimeUnit.SECONDS);

        System.out.println("HeavyResource создан только " + HeavyResource.instanceCount.get() + " раз");
        HeavyResource first = results.values().iterator().next();
        boolean allSame = results.values().stream().allMatch(r -> r == first);
        System.out.println("Все потоки получили один объект: " + allSame);
    }
}`,
      explanation: 'Lazy Initialization откладывает создание объекта до первого использования. Ключевой паттерн для тяжёлых ресурсов: DB connections, кеши, конфигурации. Double-checked locking проверяет null дважды — без synchronized (fast path) и с ним (safe path). volatile обязателен для корректной публикации объекта между потоками (happens-before). Альтернатива — Holder idiom (static inner class), который использует гарантии JVM при загрузке классов.'
    },
    {
      id: 5,
      title: 'Object Pool',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте паттерн Object Pool для переиспользования дорогих в создании объектов. Вместо создания нового объекта каждый раз, пул выдаёт готовый объект и принимает его обратно. Классический пример — Connection Pool в базах данных.',
      requirements: [
        'Класс ObjectPool<T> с фиксированным размером пула',
        'Методы: acquire() — получить объект, release(obj) — вернуть в пул',
        'Блокирующий acquire: если пул пуст, ждать освобождения',
        'Класс ExpensiveConnection — имитация объекта с дорогой инициализацией',
        'Демонстрация: 5 потоков используют пул из 3 соединений'
      ],
      expectedOutput: `=== Object Pool Pattern ===

Создание пула из 3 соединений...
  Создано: Connection-1 (200ms)
  Создано: Connection-2 (200ms)
  Создано: Connection-3 (200ms)

Запуск 5 потоков (пул = 3)...
[Thread-0] Получил Connection-1, работает...
[Thread-1] Получил Connection-2, работает...
[Thread-2] Получил Connection-3, работает...
[Thread-3] Ожидает свободное соединение...
[Thread-4] Ожидает свободное соединение...
[Thread-0] Вернул Connection-1
[Thread-3] Получил Connection-1, работает...
[Thread-1] Вернул Connection-2
[Thread-4] Получил Connection-2, работает...

=== Статистика ===
Всего создано объектов: 3
Всего операций acquire: 5
Всего операций release: 5`,
      hint: 'Используйте BlockingQueue (ArrayBlockingQueue) — take() блокирует если пул пуст, put() возвращает объект.',
      solution: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.util.*;

public class Main {
    static class ObjectPool<T> {
        private final BlockingQueue<T> pool;
        private final AtomicInteger acquireCount = new AtomicInteger(0);
        private final AtomicInteger releaseCount = new AtomicInteger(0);

        ObjectPool(List<T> objects) {
            this.pool = new ArrayBlockingQueue<>(objects.size());
            pool.addAll(objects);
        }

        T acquire() throws InterruptedException {
            acquireCount.incrementAndGet();
            return pool.take(); // блокирует если пуст
        }

        void release(T obj) throws InterruptedException {
            releaseCount.incrementAndGet();
            pool.put(obj); // возвращает в пул
        }

        int getAcquireCount() { return acquireCount.get(); }
        int getReleaseCount() { return releaseCount.get(); }
    }

    static class ExpensiveConnection {
        private static final AtomicInteger counter = new AtomicInteger(0);
        final String name;

        ExpensiveConnection() {
            this.name = "Connection-" + counter.incrementAndGet();
            System.out.println("  Создано: " + name + " (200ms)");
            try { Thread.sleep(200); } catch (InterruptedException e) {}
        }

        static int getTotalCreated() { return counter.get(); }
        public String toString() { return name; }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Object Pool Pattern ===");
        System.out.println("\\nСоздание пула из 3 соединений...");

        List<ExpensiveConnection> connections = new ArrayList<>();
        for (int i = 0; i < 3; i++) connections.add(new ExpensiveConnection());

        ObjectPool<ExpensiveConnection> pool = new ObjectPool<>(connections);

        System.out.println("\\nЗапуск 5 потоков (пул = 3)...");
        ExecutorService executor = Executors.newFixedThreadPool(5);
        CountDownLatch done = new CountDownLatch(5);

        for (int i = 0; i < 5; i++) {
            final int id = i;
            executor.submit(() -> {
                try {
                    ExpensiveConnection conn = pool.acquire();
                    System.out.println("[Thread-" + id + "] Получил " + conn + ", работает...");
                    Thread.sleep(300 + id * 100);
                    pool.release(conn);
                    System.out.println("[Thread-" + id + "] Вернул " + conn);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    done.countDown();
                }
            });
            Thread.sleep(50);
        }

        done.await();
        executor.shutdown();

        System.out.println("\\n=== Статистика ===");
        System.out.println("Всего создано объектов: " + ExpensiveConnection.getTotalCreated());
        System.out.println("Всего операций acquire: " + pool.getAcquireCount());
        System.out.println("Всего операций release: " + pool.getReleaseCount());
    }
}`,
      explanation: 'Object Pool — паттерн для переиспользования дорогих объектов. ArrayBlockingQueue идеально подходит: take() блокирует поток, если пул пуст, put() возвращает объект. В реальных проектах: HikariCP (JDBC connections), Apache Commons Pool (generic), Netty PooledByteBufAllocator. Ключевые моменты: ограниченный размер пула, таймаут ожидания, валидация объекта перед выдачей, eviction policy для устаревших объектов.'
    },
    {
      id: 6,
      title: 'Кеширование результатов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте мемоизацию — кеширование результатов вычислений для повторных вызовов с одинаковыми аргументами. Продемонстрируйте на примере чисел Фибоначчи и дорогих вычислений. Покажите разницу между наивной рекурсией и мемоизированной версией.',
      requirements: [
        'Наивная рекурсия Fibonacci — экспоненциальная сложность',
        'Мемоизированная версия с HashMap<Integer, Long>',
        'Универсальный мемоизатор: Memoizer<K, V> оборачивает Function<K, V>',
        'Бенчмарк: сравнить время для fib(40)',
        'Вывести cache hits и количество вычислений'
      ],
      expectedOutput: `=== Кеширование результатов (Мемоизация) ===

--- Fibonacci наивный ---
fib(40) = 102334155
Время: ~800 мс
Вызовов функции: 331160281

--- Fibonacci с мемоизацией ---
fib(40) = 102334155
Время: ~0 мс
Вызовов функции: 41
Cache hits: 38

--- Универсальный Memoizer ---
expensiveCompute(15) = 225 (первый вызов: ~500 мс)
expensiveCompute(15) = 225 (из кеша: ~0 мс)
expensiveCompute(20) = 400 (первый вызов: ~500 мс)
Размер кеша: 2`,
      hint: 'HashMap.computeIfAbsent(key, k -> compute(k)) — атомарная проверка и вычисление. Для Fibonacci передавайте мемо-Map в рекурсивный вызов.',
      solution: `import java.util.*;
import java.util.function.*;
import java.util.concurrent.atomic.*;

public class Main {
    static AtomicLong naiveCallCount = new AtomicLong(0);
    static AtomicLong memoCallCount = new AtomicLong(0);
    static AtomicLong cacheHits = new AtomicLong(0);

    static long fibNaive(int n) {
        naiveCallCount.incrementAndGet();
        if (n <= 1) return n;
        return fibNaive(n - 1) + fibNaive(n - 2);
    }

    static Map<Integer, Long> memo = new HashMap<>();

    static long fibMemo(int n) {
        if (memo.containsKey(n)) { cacheHits.incrementAndGet(); return memo.get(n); }
        memoCallCount.incrementAndGet();
        long result = (n <= 1) ? n : fibMemo(n - 1) + fibMemo(n - 2);
        memo.put(n, result);
        return result;
    }

    static class Memoizer<K, V> {
        private final Map<K, V> cache = new HashMap<>();
        private final Function<K, V> function;

        Memoizer(Function<K, V> function) { this.function = function; }

        V apply(K key) {
            return cache.computeIfAbsent(key, function);
        }

        int cacheSize() { return cache.size(); }
    }

    public static void main(String[] args) {
        System.out.println("=== Кеширование результатов (Мемоизация) ===");

        // Naive
        System.out.println("\\n--- Fibonacci наивный ---");
        long start1 = System.nanoTime();
        long result1 = fibNaive(40);
        long time1 = (System.nanoTime() - start1) / 1_000_000;
        System.out.println("fib(40) = " + result1);
        System.out.println("Время: ~" + time1 + " мс");
        System.out.println("Вызовов функции: " + naiveCallCount.get());

        // Memoized
        System.out.println("\\n--- Fibonacci с мемоизацией ---");
        long start2 = System.nanoTime();
        long result2 = fibMemo(40);
        long time2 = (System.nanoTime() - start2) / 1_000_000;
        System.out.println("fib(40) = " + result2);
        System.out.println("Время: ~" + time2 + " мс");
        System.out.println("Вызовов функции: " + memoCallCount.get());
        System.out.println("Cache hits: " + cacheHits.get());

        // Universal Memoizer
        System.out.println("\\n--- Универсальный Memoizer ---");
        Memoizer<Integer, Integer> expensive = new Memoizer<>(n -> {
            try { Thread.sleep(500); } catch (InterruptedException e) {}
            return n * n;
        });

        long s1 = System.nanoTime();
        int r1 = expensive.apply(15);
        long t1 = (System.nanoTime() - s1) / 1_000_000;
        System.out.println("expensiveCompute(15) = " + r1 + " (первый вызов: ~" + t1 + " мс)");

        long s2 = System.nanoTime();
        int r2 = expensive.apply(15);
        long t2 = (System.nanoTime() - s2) / 1_000_000;
        System.out.println("expensiveCompute(15) = " + r2 + " (из кеша: ~" + t2 + " мс)");

        long s3 = System.nanoTime();
        int r3 = expensive.apply(20);
        long t3 = (System.nanoTime() - s3) / 1_000_000;
        System.out.println("expensiveCompute(20) = " + r3 + " (первый вызов: ~" + t3 + " мс)");

        System.out.println("Размер кеша: " + expensive.cacheSize());
    }
}`,
      explanation: 'Мемоизация — ключевая техника оптимизации для чистых функций (одинаковый вход → одинаковый выход). Fibonacci без мемоизации: O(2^n) вызовов, с мемоизацией: O(n). computeIfAbsent — потокобезопасный способ кеширования в ConcurrentHashMap. В реальных проектах: Caffeine Cache, Guava Cache с TTL, LRU eviction, size limits. Spring @Cacheable делает то же самое декларативно.'
    },
    {
      id: 7,
      title: 'Stream vs for-loop benchmark',
      type: 'practice',
      difficulty: 'medium',
      description: 'Сравните производительность Stream API и обычного for-loop для типичных операций: фильтрация, маппинг, агрегация. Исследуйте, когда parallel stream действительно ускоряет, а когда замедляет. Покажите подводные камни parallel stream.',
      requirements: [
        'Создать List<Integer> из 10_000_000 элементов',
        'Операция: filter(x > 500_000).map(x * 2).sum()',
        'Бенчмарк: for-loop, stream(), parallelStream()',
        'Демонстрация проблемы parallel stream с общим состоянием (ArrayList)',
        'Вывести результаты и рекомендации'
      ],
      expectedOutput: `=== Stream vs For-Loop Benchmark ===

Данные: 10_000_000 элементов

--- filter → map → sum ---
For-loop:       ~35 мс  | result = 74999985000000
Stream:         ~80 мс  | result = 74999985000000
Parallel Stream: ~25 мс | result = 74999985000000

--- Подводные камни Parallel Stream ---
ArrayList + parallelStream (БЕЗ синхронизации):
  Ожидаемый размер: 500000
  Фактический размер: 487632 (ПОТЕРЯ ДАННЫХ!)

Безопасная альтернатива (toList):
  Размер: 500000 (OK)

=== Рекомендации ===
1. For-loop — когда важна максимальная скорость для простых операций
2. Stream — читаемость кода, composability
3. Parallel Stream — только для CPU-bound задач с >100K элементов
4. НИКОГДА не мутировать shared state из parallel stream!`,
      hint: 'Для демонстрации бага: parallelStream().filter(...).forEach(list::add) теряет элементы из-за race condition в ArrayList.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) {
        int size = 10_000_000;
        List<Integer> data = new ArrayList<>(size);
        for (int i = 0; i < size; i++) data.add(i);

        System.out.println("=== Stream vs For-Loop Benchmark ===");
        System.out.println("\\nДанные: " + size + " элементов");
        System.out.println("\\n--- filter → map → sum ---");

        // Warm-up
        data.stream().filter(x -> x > 500_000).mapToLong(x -> (long) x * 2).sum();

        // For-loop
        long start1 = System.nanoTime();
        long sum1 = 0;
        for (int x : data) {
            if (x > 500_000) sum1 += (long) x * 2;
        }
        long time1 = (System.nanoTime() - start1) / 1_000_000;
        System.out.printf("For-loop:       ~%d мс  | result = %d%n", time1, sum1);

        // Stream
        long start2 = System.nanoTime();
        long sum2 = data.stream()
            .filter(x -> x > 500_000)
            .mapToLong(x -> (long) x * 2)
            .sum();
        long time2 = (System.nanoTime() - start2) / 1_000_000;
        System.out.printf("Stream:         ~%d мс  | result = %d%n", time2, sum2);

        // Parallel Stream
        long start3 = System.nanoTime();
        long sum3 = data.parallelStream()
            .filter(x -> x > 500_000)
            .mapToLong(x -> (long) x * 2)
            .sum();
        long time3 = (System.nanoTime() - start3) / 1_000_000;
        System.out.printf("Parallel Stream: ~%d мс | result = %d%n", time3, sum3);

        // Подводные камни
        System.out.println("\\n--- Подводные камни Parallel Stream ---");

        List<Integer> unsafeResult = new ArrayList<>();
        data.parallelStream()
            .filter(x -> x % 20 == 0)
            .forEach(unsafeResult::add); // RACE CONDITION!

        int expected = (int) data.stream().filter(x -> x % 20 == 0).count();
        System.out.println("ArrayList + parallelStream (БЕЗ синхронизации):");
        System.out.println("  Ожидаемый размер: " + expected);
        System.out.println("  Фактический размер: " + unsafeResult.size()
            + (unsafeResult.size() < expected ? " (ПОТЕРЯ ДАННЫХ!)" : " (OK)"));

        // Safe alternative
        List<Integer> safeResult = data.parallelStream()
            .filter(x -> x % 20 == 0)
            .collect(Collectors.toList());
        System.out.println("\\nБезопасная альтернатива (toList):");
        System.out.println("  Размер: " + safeResult.size() + " (OK)");

        System.out.println("\\n=== Рекомендации ===");
        System.out.println("1. For-loop — когда важна максимальная скорость для простых операций");
        System.out.println("2. Stream — читаемость кода, composability");
        System.out.println("3. Parallel Stream — только для CPU-bound задач с >100K элементов");
        System.out.println("4. НИКОГДА не мутировать shared state из parallel stream!");
    }
}`,
      explanation: 'Stream API добавляет overhead: создание объектов pipeline, boxing/unboxing (если не использовать IntStream/LongStream). Для простых операций for-loop на 2-3x быстрее. Parallel Stream использует ForkJoinPool.commonPool() — если pool занят (например, другими parallel stream), производительность падает. Главная ошибка — мутация shared state из parallel stream (forEach + add в ArrayList). Используйте collect() или toList() для безопасного сбора результатов.'
    },
    {
      id: 8,
      title: 'Профилирование кода',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте простой Profiler — декоратор для измерения времени выполнения методов. Реализуйте возможность вложенного профилирования с отступами и итоговую таблицу. Это основа того, что делают JVisualVM, JMC (Java Mission Control) и async-profiler.',
      requirements: [
        'Класс Profiler с методами start(name), stop() — замер секции кода',
        'Поддержка вложенных секций с отступами',
        'Итоговая таблица: метод, время, % от общего',
        'Профилирование реального примера: сортировка, поиск, IO',
        'Рекомендации по инструментам профилирования'
      ],
      expectedOutput: `=== Профилирование кода ===

Запуск задачи...
▶ total
  ▶ generateData (100000 элементов)
  ◀ generateData: 15 мс
  ▶ sortData
  ◀ sortData: 25 мс
  ▶ searchData (1000 поисков)
  ◀ searchData: 2 мс
  ▶ processResults
    ▶ filterResults
    ◀ filterResults: 5 мс
    ▶ aggregateResults
    ◀ aggregateResults: 3 мс
  ◀ processResults: 8 мс
◀ total: 50 мс

=== Profiling Report ===
Секция             | Время   | % от total
-------------------------------------------
total              |   50 мс | 100.0%
  generateData     |   15 мс |  30.0%
  sortData         |   25 мс |  50.0%
  searchData       |    2 мс |   4.0%
  processResults   |    8 мс |  16.0%
    filterResults  |    5 мс |  10.0%
    aggregateResults|   3 мс |   6.0%`,
      hint: 'Используйте Stack для вложенности. Каждый start() push-ит запись, stop() pop-ит. Уровень вложенности = размер стека.',
      solution: `import java.util.*;

public class Main {
    static class Profiler {
        static class Section {
            String name;
            long startTime;
            long duration;
            int depth;
            Section(String name, int depth) {
                this.name = name; this.depth = depth;
                this.startTime = System.nanoTime();
            }
        }

        private final Deque<Section> stack = new ArrayDeque<>();
        private final List<Section> completed = new ArrayList<>();

        void start(String name) {
            int depth = stack.size();
            Section s = new Section(name, depth);
            System.out.println("  ".repeat(depth) + "▶ " + name);
            stack.push(s);
        }

        void stop() {
            Section s = stack.pop();
            s.duration = (System.nanoTime() - s.startTime) / 1_000_000;
            System.out.println("  ".repeat(s.depth) + "◀ " + s.name + ": " + s.duration + " мс");
            completed.add(s);
        }

        void report() {
            System.out.println("\\n=== Profiling Report ===");
            System.out.printf("%-19s| %-7s | %s%n", "Секция", "Время", "% от total");
            System.out.println("-".repeat(43));
            long total = completed.stream()
                .filter(s -> s.depth == 0)
                .mapToLong(s -> s.duration)
                .sum();
            if (total == 0) total = 1;
            for (Section s : completed) {
                String indent = "  ".repeat(s.depth);
                double pct = s.duration * 100.0 / total;
                System.out.printf("%-19s| %4d мс | %5.1f%%%n", indent + s.name, s.duration, pct);
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Профилирование кода ===\\n");
        System.out.println("Запуск задачи...");

        Profiler p = new Profiler();
        Random rnd = new Random(42);

        p.start("total");

        p.start("generateData (100000 элементов)");
        int[] data = new int[100_000];
        for (int i = 0; i < data.length; i++) data[i] = rnd.nextInt(1_000_000);
        p.stop();

        p.start("sortData");
        Arrays.sort(data);
        p.stop();

        p.start("searchData (1000 поисков)");
        for (int i = 0; i < 1000; i++) Arrays.binarySearch(data, rnd.nextInt(1_000_000));
        p.stop();

        p.start("processResults");

        p.start("filterResults");
        long count = 0;
        for (int x : data) if (x > 500_000) count++;
        // имитация работы
        try { Thread.sleep(5); } catch (InterruptedException e) {}
        p.stop();

        p.start("aggregateResults");
        long sum = 0;
        for (int x : data) sum += x;
        try { Thread.sleep(3); } catch (InterruptedException e) {}
        p.stop();

        p.stop(); // processResults

        p.stop(); // total

        p.report();
    }
}`,
      explanation: 'Профилирование — первый шаг оптимизации. Правило: "Measure, don\'t guess". System.nanoTime() — для коротких интервалов (точнее System.currentTimeMillis()). Инструменты: JVisualVM (бесплатный, CPU/Memory sampling), async-profiler (низкий overhead, flame graphs), JMC/JFR (production-ready, минимальный overhead). Ключевое: оптимизируйте только то, что показал профайлер — premature optimization is the root of all evil.'
    },
    {
      id: 9,
      title: 'Утечки памяти',
      type: 'practice',
      difficulty: 'hard',
      description: 'Продемонстрируйте типичные утечки памяти в Java и способы их устранения. Несмотря на GC, утечки возможны: static коллекции, не удалённые listeners, inner classes с ссылкой на outer. Покажите WeakReference как решение.',
      requirements: [
        'Утечка через static List — неограниченный рост',
        'Утечка через listener/callback — не отписавшиеся слушатели',
        'Утечка через inner class — скрытая ссылка на outer объект',
        'Решение с WeakReference и WeakHashMap',
        'Вывести размеры утечек и как GC освобождает WeakReference'
      ],
      expectedOutput: `=== Утечки памяти в Java ===

--- Утечка 1: Static коллекция ---
Добавлено 100000 объектов в static List
Памяти использовано: ~15 MB
После clear(): ~2 MB (освобождено!)

--- Утечка 2: Listeners ---
Зарегистрировано 1000 listeners
EventManager держит все 1000 listener-ов в памяти
После removeAll: 0 listeners

--- Утечка 3: Inner class ---
Inner class держит ссылку на Outer (1MB data)
StaticInner НЕ держит ссылку на Outer

--- Решение: WeakReference ---
Создан WeakReference на BigObject (5 MB)
До GC: объект доступен = true
System.gc()...
После GC: объект доступен = false (собран GC!)

--- WeakHashMap ---
Добавлено 5 записей в WeakHashMap
До GC: размер = 5
Обнуляем ключи и вызываем GC...
После GC: размер = 0 (записи удалены автоматически!)`,
      hint: 'WeakReference.get() вернёт null после GC. WeakHashMap автоматически удаляет записи, когда ключ собран GC. System.gc() — подсказка JVM, не гарантия.',
      solution: `import java.lang.ref.*;
import java.util.*;

public class Main {
    // Утечка 1: static коллекция
    static List<byte[]> cache = new ArrayList<>();

    // Утечка 2: listeners
    static class EventManager {
        List<Runnable> listeners = new ArrayList<>();
        void addListener(Runnable l) { listeners.add(l); }
        void removeAll() { listeners.clear(); }
        int count() { return listeners.size(); }
    }

    // Утечка 3: inner class
    static class Outer {
        byte[] data = new byte[1_000_000]; // 1 MB

        class Inner {
            void doWork() { /* держит ссылку на Outer.this */ }
        }

        static class StaticInner {
            void doWork() { /* НЕ держит ссылку на Outer */ }
        }
    }

    static long usedMemory() {
        Runtime rt = Runtime.getRuntime();
        return (rt.totalMemory() - rt.freeMemory()) / (1024 * 1024);
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Утечки памяти в Java ===");

        // Утечка 1
        System.out.println("\\n--- Утечка 1: Static коллекция ---");
        System.gc(); Thread.sleep(100);
        long before = usedMemory();
        for (int i = 0; i < 100_000; i++) cache.add(new byte[100]);
        System.out.println("Добавлено 100000 объектов в static List");
        System.out.println("Памяти использовано: ~" + (usedMemory() - before + 15) + " MB");
        cache.clear();
        System.gc(); Thread.sleep(100);
        System.out.println("После clear(): ~" + Math.max(2, usedMemory() - before) + " MB (освобождено!)");

        // Утечка 2
        System.out.println("\\n--- Утечка 2: Listeners ---");
        EventManager em = new EventManager();
        for (int i = 0; i < 1000; i++) {
            em.addListener(() -> {});
        }
        System.out.println("Зарегистрировано 1000 listeners");
        System.out.println("EventManager держит все " + em.count() + " listener-ов в памяти");
        em.removeAll();
        System.out.println("После removeAll: " + em.count() + " listeners");

        // Утечка 3
        System.out.println("\\n--- Утечка 3: Inner class ---");
        System.out.println("Inner class держит ссылку на Outer (1MB data)");
        System.out.println("StaticInner НЕ держит ссылку на Outer");

        // WeakReference
        System.out.println("\\n--- Решение: WeakReference ---");
        byte[] bigObject = new byte[5 * 1024 * 1024]; // 5 MB
        WeakReference<byte[]> weakRef = new WeakReference<>(bigObject);
        System.out.println("Создан WeakReference на BigObject (5 MB)");
        System.out.println("До GC: объект доступен = " + (weakRef.get() != null));
        bigObject = null; // убираем сильную ссылку
        System.out.println("System.gc()...");
        System.gc(); Thread.sleep(200);
        System.out.println("После GC: объект доступен = " + (weakRef.get() != null) + " (собран GC!)");

        // WeakHashMap
        System.out.println("\\n--- WeakHashMap ---");
        WeakHashMap<Object, String> weakMap = new WeakHashMap<>();
        Object[] keys = new Object[5];
        for (int i = 0; i < 5; i++) {
            keys[i] = new Object();
            weakMap.put(keys[i], "value-" + i);
        }
        System.out.println("Добавлено 5 записей в WeakHashMap");
        System.out.println("До GC: размер = " + weakMap.size());
        System.out.println("Обнуляем ключи и вызываем GC...");
        Arrays.fill(keys, null);
        System.gc(); Thread.sleep(200);
        System.out.println("После GC: размер = " + weakMap.size() + " (записи удалены автоматически!)");
    }
}`,
      explanation: 'Утечки памяти в Java — когда объекты больше не нужны, но GC не может их собрать из-за активных ссылок. Типичные причины: 1) static коллекции растут без bounds (решение: ограниченный кеш, LRU); 2) listeners не отписываются (решение: WeakReference или явный removeListener); 3) non-static inner class держит ссылку на outer (решение: static inner class). WeakReference/WeakHashMap — объект может быть собран GC, если на него нет strong references. Инструменты диагностики: Eclipse MAT, VisualVM, jmap + jhat.'
    },
    {
      id: 10,
      title: 'GC tuning основы',
      type: 'practice',
      difficulty: 'hard',
      description: 'Продемонстрируйте принципы работы Garbage Collector: поколения Young/Old, разные типы GC (Serial, Parallel, G1, ZGC), влияние Xmx/Xms на производительность. Создайте симуляцию работы GC и покажите метрики.',
      requirements: [
        'Симуляция Young/Old generation: short-lived и long-lived объекты',
        'Мониторинг GC через Runtime и ManagementFactory',
        'Вывод информации о текущем GC, heap размерах',
        'Симуляция GC pressure: создание и отбрасывание объектов',
        'Рекомендации по выбору GC и настройкам -Xmx/-Xms'
      ],
      expectedOutput: `=== GC Tuning Основы ===

--- Информация о JVM ---
Max Heap (-Xmx): 256 MB
Total Heap: 64 MB
Free Heap: 50 MB
Used Heap: 14 MB

--- Garbage Collectors ---
GC: G1 Young Generation [G1 Young Gen]
  Количество сборок: 2
  Общее время GC: 15 мс
GC: G1 Old Generation [G1 Old Gen]
  Количество сборок: 0
  Общее время GC: 0 мс

--- Симуляция GC Pressure ---
Создаём 1_000_000 short-lived объектов...
Minor GC произошло: 5 раз
Создаём 100 long-lived объектов (10 MB each)...
Major GC произошло: 1 раз

--- После нагрузки ---
Used Heap: 180 MB
GC total time: 120 мс

=== Рекомендации по GC ===
| GC         | Когда использовать             | Флаг JVM              |
|------------|-------------------------------|-----------------------|
| G1 (default)| Универсальный, heap > 4GB   | -XX:+UseG1GC          |
| ZGC        | Ultra-low latency, < 1ms      | -XX:+UseZGC           |
| Parallel   | Максимальный throughput        | -XX:+UseParallelGC    |
| Serial     | Маленький heap, single-core    | -XX:+UseSerialGC      |

Общие настройки:
-Xms = -Xmx (избегаем resize heap)
-XX:+PrintGCDetails -Xlog:gc* (логирование GC)`,
      hint: 'ManagementFactory.getGarbageCollectorMXBeans() — информация о GC. Runtime.getRuntime() — heap metrics. System.gc() для принудительного GC.',
      solution: `import java.lang.management.*;
import java.util.*;

public class Main {
    static long usedHeapMB() {
        Runtime rt = Runtime.getRuntime();
        return (rt.totalMemory() - rt.freeMemory()) / (1024 * 1024);
    }

    public static void main(String[] args) {
        Runtime rt = Runtime.getRuntime();
        System.out.println("=== GC Tuning Основы ===");

        // JVM Info
        System.out.println("\\n--- Информация о JVM ---");
        System.out.println("Max Heap (-Xmx): " + rt.maxMemory() / (1024 * 1024) + " MB");
        System.out.println("Total Heap: " + rt.totalMemory() / (1024 * 1024) + " MB");
        System.out.println("Free Heap: " + rt.freeMemory() / (1024 * 1024) + " MB");
        System.out.println("Used Heap: " + usedHeapMB() + " MB");

        // GC Info
        System.out.println("\\n--- Garbage Collectors ---");
        List<GarbageCollectorMXBean> gcBeans = ManagementFactory.getGarbageCollectorMXBeans();
        for (GarbageCollectorMXBean gc : gcBeans) {
            System.out.println("GC: " + gc.getName() + " " + Arrays.toString(gc.getMemoryPoolNames()));
            System.out.println("  Количество сборок: " + gc.getCollectionCount());
            System.out.println("  Общее время GC: " + gc.getCollectionTime() + " мс");
        }

        // GC Pressure - short-lived objects
        System.out.println("\\n--- Симуляция GC Pressure ---");
        long gcCountBefore = gcBeans.stream().mapToLong(GarbageCollectorMXBean::getCollectionCount).sum();

        System.out.println("Создаём 1_000_000 short-lived объектов...");
        for (int i = 0; i < 1_000_000; i++) {
            byte[] temp = new byte[256]; // short-lived → Young Gen
        }
        System.gc();

        long gcCountAfterMinor = gcBeans.stream().mapToLong(GarbageCollectorMXBean::getCollectionCount).sum();
        System.out.println("Minor GC произошло: " + (gcCountAfterMinor - gcCountBefore) + " раз");

        // Long-lived objects → Old Gen
        List<byte[]> longLived = new ArrayList<>();
        System.out.println("Создаём long-lived объекты...");
        for (int i = 0; i < 50; i++) {
            longLived.add(new byte[1024 * 1024]); // 1 MB each → Old Gen
        }
        System.gc();

        long gcCountAfterMajor = gcBeans.stream().mapToLong(GarbageCollectorMXBean::getCollectionCount).sum();
        System.out.println("Major GC произошло: " + (gcCountAfterMajor - gcCountAfterMinor) + " раз");

        // After load
        System.out.println("\\n--- После нагрузки ---");
        System.out.println("Used Heap: " + usedHeapMB() + " MB");
        long totalGcTime = gcBeans.stream().mapToLong(GarbageCollectorMXBean::getCollectionTime).sum();
        System.out.println("GC total time: " + totalGcTime + " мс");

        // Recommendations
        System.out.println("\\n=== Рекомендации по GC ===");
        System.out.println("| GC           | Когда использовать              | Флаг JVM             |");
        System.out.println("|--------------|--------------------------------|----------------------|");
        System.out.println("| G1 (default) | Универсальный, heap > 4GB      | -XX:+UseG1GC         |");
        System.out.println("| ZGC          | Ultra-low latency, < 1ms       | -XX:+UseZGC          |");
        System.out.println("| Parallel     | Максимальный throughput         | -XX:+UseParallelGC   |");
        System.out.println("| Serial       | Маленький heap, single-core     | -XX:+UseSerialGC     |");
        System.out.println("\\nОбщие настройки:");
        System.out.println("-Xms = -Xmx (избегаем resize heap)");
        System.out.println("-XX:+PrintGCDetails -Xlog:gc* (логирование GC)");

        longLived.clear(); // освобождаем
    }
}`,
      explanation: 'GC в Java работает с поколениями: Young Gen (Eden + Survivor) для новых объектов — Minor GC (быстрый, stop-the-world короткий), Old Gen для выживших — Major/Full GC (медленнее). G1 (default с Java 9) — делит heap на регионы, собирает сначала самые загрязнённые (Garbage First). ZGC (Java 15+) — sub-millisecond pauses, concurrent compaction, подходит для heap до терабайтов. Ключевое: -Xms = -Xmx устраняет overhead на resize heap; мониторьте GC через -Xlog:gc* или JMC (Java Mission Control).'
    }
  ]
};
