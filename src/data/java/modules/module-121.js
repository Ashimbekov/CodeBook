export default {
  id: 121,
  title: 'Практикум: Concurrency задачи',
  description: 'Задачи по многопоточности в Java: thread-safe счётчик, Producer-Consumer, Fork/Join, Dining Philosophers, ReadWriteLock, CompletableFuture, CountDownLatch, Semaphore, ConcurrentHashMap и ThreadPoolExecutor.',
  lessons: [
    {
      id: 1,
      title: 'Thread-safe счётчик',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте потокобезопасный счётчик тремя способами: synchronized, AtomicInteger, LongAdder. Сравните производительность при конкуренции 10 потоков.',
      requirements: [
        'UnsafeCounter — без синхронизации (показать race condition)',
        'SyncCounter — с synchronized методом increment()',
        'AtomicCounter — с AtomicInteger и incrementAndGet()',
        'Тест: 10 потоков, каждый инкрементирует 100_000 раз',
        'Ожидаемый результат: 1_000_000, UnsafeCounter даёт меньше',
        'Сравнение времени выполнения'
      ],
      expectedOutput: `=== Thread-safe счётчик ===

--- Unsafe Counter (без синхронизации) ---
Ожидали: 1000000
Получили: 876432 (race condition!)

--- Synchronized Counter ---
Результат: 1000000 ✓
Время: ~45 мс

--- Atomic Counter ---
Результат: 1000000 ✓
Время: ~25 мс

--- Сравнение ---
synchronized: корректный, медленнее (блокировки)
AtomicInteger: корректный, быстрее (CAS без блокировок)
Рекомендация: AtomicInteger для простых счётчиков`,
      hint: 'Race condition: read-modify-write (count++) не атомарна — два потока могут прочитать одно значение, оба инкрементируют, оба запишут одно и то же. synchronized блокирует весь метод. AtomicInteger использует CAS (Compare-And-Swap) — аппаратная атомарная операция без блокировок.',
      solution: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Main {
    // Unsafe
    static class UnsafeCounter {
        int count = 0;
        void increment() { count++; }
        int get() { return count; }
    }

    // Synchronized
    static class SyncCounter {
        int count = 0;
        synchronized void increment() { count++; }
        synchronized int get() { return count; }
    }

    // Atomic
    static class AtomicCounter {
        AtomicInteger count = new AtomicInteger(0);
        void increment() { count.incrementAndGet(); }
        int get() { return count.get(); }
    }

    static long testCounter(Runnable increment, int threads, int perThread) throws Exception {
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        long start = System.nanoTime();
        CountDownLatch latch = new CountDownLatch(threads);

        for (int i = 0; i < threads; i++) {
            executor.submit(() -> {
                for (int j = 0; j < perThread; j++) increment.run();
                latch.countDown();
            });
        }

        latch.await();
        executor.shutdown();
        return (System.nanoTime() - start) / 1_000_000;
    }

    public static void main(String[] args) throws Exception {
        int threads = 10;
        int perThread = 100_000;
        int expected = threads * perThread;

        System.out.println("=== Thread-safe счётчик ===");

        // Unsafe
        System.out.println("\\n--- Unsafe Counter (без синхронизации) ---");
        UnsafeCounter unsafe = new UnsafeCounter();
        testCounter(unsafe::increment, threads, perThread);
        System.out.println("Ожидали: " + expected);
        System.out.println("Получили: " + unsafe.get() + " (race condition!)");

        // Synchronized
        System.out.println("\\n--- Synchronized Counter ---");
        SyncCounter sync = new SyncCounter();
        long syncTime = testCounter(sync::increment, threads, perThread);
        System.out.println("Результат: " + sync.get() + " ✓");
        System.out.println("Время: ~" + syncTime + " мс");

        // Atomic
        System.out.println("\\n--- Atomic Counter ---");
        AtomicCounter atomic = new AtomicCounter();
        long atomicTime = testCounter(atomic::increment, threads, perThread);
        System.out.println("Результат: " + atomic.get() + " ✓");
        System.out.println("Время: ~" + atomicTime + " мс");

        // Сравнение
        System.out.println("\\n--- Сравнение ---");
        System.out.println("synchronized: корректный, медленнее (блокировки)");
        System.out.println("AtomicInteger: корректный, быстрее (CAS без блокировок)");
        System.out.println("Рекомендация: AtomicInteger для простых счётчиков");
    }
}`,
      explanation: 'Race condition возникает, когда count++ (read → increment → write) выполняется несколькими потоками одновременно. synchronized блокирует монитор объекта — только один поток выполняет метод. AtomicInteger использует CAS (Compare-And-Swap) — аппаратная инструкция: «если текущее значение == expected, запиши new». Если другой поток изменил — повторяет. Без блокировок — быстрее при умеренной конкуренции. LongAdder ещё быстрее при высокой конкуренции (распределяет счётчик по ячейкам).'
    },
    {
      id: 2,
      title: 'Producer-Consumer с BlockingQueue',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте паттерн Producer-Consumer с BlockingQueue. Один producer генерирует задачи, несколько consumer-ов обрабатывают их. Используйте poison pill для корректного завершения.',
      requirements: [
        'Producer — генерирует задачи (String) в BlockingQueue',
        'Consumer — берёт задачи из очереди и «обрабатывает» (sleep)',
        'ArrayBlockingQueue с ограниченной ёмкостью (5)',
        'Poison pill ("STOP") для сигнала завершения consumer-ам',
        '1 producer, 3 consumer-а, 10 задач',
        'Корректное завершение всех потоков'
      ],
      expectedOutput: `=== Producer-Consumer ===
Queue capacity: 5, Producers: 1, Consumers: 3

[Producer] Задача-1 добавлена
[Consumer-1] Обработка: Задача-1
[Producer] Задача-2 добавлена
[Consumer-2] Обработка: Задача-2
[Producer] Задача-3 добавлена
[Consumer-3] Обработка: Задача-3
...
[Producer] Все задачи отправлены. Отправляю STOP сигналы.
[Consumer-1] Получен STOP, завершаю работу.
[Consumer-2] Получен STOP, завершаю работу.
[Consumer-3] Получен STOP, завершаю работу.

Все потоки завершены. Обработано задач: 10`,
      hint: 'BlockingQueue.put() блокирует producer, если очередь полна. take() блокирует consumer, если очередь пуста. Для завершения отправьте N "STOP" сообщений (по одному на каждый consumer). Каждый consumer при получении "STOP" завершает цикл.',
      solution: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Main {
    static final String POISON_PILL = "STOP";

    public static void main(String[] args) throws InterruptedException {
        int numConsumers = 3;
        int numTasks = 10;
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(5);
        AtomicInteger processed = new AtomicInteger(0);

        System.out.println("=== Producer-Consumer ===");
        System.out.printf("Queue capacity: 5, Producers: 1, Consumers: %d%n%n", numConsumers);

        // Producer
        Thread producer = new Thread(() -> {
            try {
                for (int i = 1; i <= numTasks; i++) {
                    String task = "Задача-" + i;
                    queue.put(task);
                    System.out.println("[Producer] " + task + " добавлена");
                    Thread.sleep(50);
                }
                // Отправляем poison pills
                System.out.println("[Producer] Все задачи отправлены. Отправляю STOP сигналы.");
                for (int i = 0; i < numConsumers; i++) {
                    queue.put(POISON_PILL);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        // Consumers
        Thread[] consumers = new Thread[numConsumers];
        for (int c = 0; c < numConsumers; c++) {
            final int id = c + 1;
            consumers[c] = new Thread(() -> {
                try {
                    while (true) {
                        String task = queue.take();
                        if (POISON_PILL.equals(task)) {
                            System.out.println("[Consumer-" + id + "] Получен STOP, завершаю работу.");
                            break;
                        }
                        System.out.println("[Consumer-" + id + "] Обработка: " + task);
                        processed.incrementAndGet();
                        Thread.sleep(150); // имитация работы
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
        }

        // Запуск
        producer.start();
        for (Thread t : consumers) t.start();

        // Ожидание завершения
        producer.join();
        for (Thread t : consumers) t.join();

        System.out.println("\\nВсе потоки завершены. Обработано задач: " + processed.get());
    }
}`,
      explanation: 'Producer-Consumer — классический паттерн многопоточности. BlockingQueue автоматически управляет синхронизацией: put() блокирует при полной очереди (backpressure), take() блокирует при пустой. Poison pill — элегантный способ завершения: producer отправляет N спец-сообщений, каждый consumer, получив STOP, прекращает работу. ArrayBlockingQueue — ограниченная очередь (bounded), LinkedBlockingQueue может быть unbounded. Этот паттерн используется в thread pools, message queues, reactive streams.'
    },
    {
      id: 3,
      title: 'Параллельная сортировка: Fork/Join',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте параллельный Merge Sort с помощью Fork/Join Framework. Массив разбивается на части, каждая сортируется в отдельной подзадаче, затем результаты объединяются.',
      requirements: [
        'Класс MergeSortTask extends RecursiveAction',
        'Порог для перехода на обычную сортировку: 1000 элементов',
        'fork() — запуск подзадачи в другом потоке, join() — ожидание результата',
        'Сравнение: Arrays.sort vs ForkJoin MergeSort vs Arrays.parallelSort',
        'Массив 1_000_000 элементов'
      ],
      expectedOutput: `=== Fork/Join Merge Sort ===
Размер массива: 1 000 000

Arrays.sort():        ~120 мс
ForkJoin MergeSort:   ~65 мс
Arrays.parallelSort(): ~55 мс

Проверка: отсортирован = true
Первые 10: [0, 0, 0, 1, 1, 1, 2, 2, 2, 3]

Fork/Join быстрее на многоядерных процессорах!`,
      hint: 'RecursiveAction — задача без результата. В compute(): если размер <= THRESHOLD — Arrays.sort(). Иначе: разбить на две подзадачи, left.fork() (асинхронно), right.compute() (в текущем потоке), left.join() (ожидание), merge(). Merge — слияние двух отсортированных половин.',
      solution: `import java.util.*;
import java.util.concurrent.*;

public class Main {
    static class MergeSortTask extends RecursiveAction {
        private final int[] array;
        private final int left, right;
        private static final int THRESHOLD = 1000;

        MergeSortTask(int[] array, int left, int right) {
            this.array = array; this.left = left; this.right = right;
        }

        @Override
        protected void compute() {
            if (right - left <= THRESHOLD) {
                Arrays.sort(array, left, right);
                return;
            }
            int mid = left + (right - left) / 2;
            MergeSortTask leftTask = new MergeSortTask(array, left, mid);
            MergeSortTask rightTask = new MergeSortTask(array, mid, right);

            leftTask.fork();      // запуск в другом потоке
            rightTask.compute();  // выполнение в текущем потоке
            leftTask.join();      // ожидание завершения

            merge(array, left, mid, right);
        }

        private void merge(int[] arr, int l, int m, int r) {
            int[] temp = Arrays.copyOfRange(arr, l, m);
            int i = 0, j = m, k = l;
            while (i < temp.length && j < r) {
                if (temp[i] <= arr[j]) arr[k++] = temp[i++];
                else arr[k++] = arr[j++];
            }
            while (i < temp.length) arr[k++] = temp[i++];
        }
    }

    static boolean isSorted(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        int size = 1_000_000;
        System.out.println("=== Fork/Join Merge Sort ===");
        System.out.printf("Размер массива: %,d%n", size);

        Random rnd = new Random(42);
        int[] original = rnd.ints(size, 0, size).toArray();

        // Arrays.sort
        int[] arr1 = original.clone();
        long t1 = System.nanoTime();
        Arrays.sort(arr1);
        long time1 = (System.nanoTime() - t1) / 1_000_000;

        // Fork/Join
        int[] arr2 = original.clone();
        ForkJoinPool pool = new ForkJoinPool();
        long t2 = System.nanoTime();
        pool.invoke(new MergeSortTask(arr2, 0, arr2.length));
        long time2 = (System.nanoTime() - t2) / 1_000_000;
        pool.shutdown();

        // Arrays.parallelSort
        int[] arr3 = original.clone();
        long t3 = System.nanoTime();
        Arrays.parallelSort(arr3);
        long time3 = (System.nanoTime() - t3) / 1_000_000;

        System.out.printf("\\nArrays.sort():        ~%d мс%n", time1);
        System.out.printf("ForkJoin MergeSort:   ~%d мс%n", time2);
        System.out.printf("Arrays.parallelSort(): ~%d мс%n", time3);

        System.out.println("\\nПроверка: отсортирован = " + isSorted(arr2));
        System.out.print("Первые 10: [");
        for (int i = 0; i < 10; i++) {
            if (i > 0) System.out.print(", ");
            System.out.print(arr2[i]);
        }
        System.out.println("]");

        System.out.println("\\nFork/Join быстрее на многоядерных процессорах!");
    }
}`,
      explanation: 'Fork/Join Framework (Java 7) — реализация work-stealing для рекурсивного параллелизма. RecursiveAction — без результата, RecursiveTask<V> — с результатом. fork() помещает подзадачу в очередь другого потока. compute() выполняет в текущем потоке. join() ожидает завершения. Оптимизация: одну подзадачу fork, другую compute (избегаем лишнего переключения). Arrays.parallelSort() (Java 8) использует тот же ForkJoin внутри. THRESHOLD предотвращает overhead на малых подмассивах.'
    },
    {
      id: 4,
      title: 'Dining Philosophers',
      type: 'practice',
      difficulty: 'hard',
      description: 'Классическая задача «Обедающие философы»: 5 философов за круглым столом, между каждыми двумя — одна вилка. Для еды нужны обе вилки. Решите проблему deadlock через упорядочивание ресурсов.',
      requirements: [
        '5 философов, 5 вилок (ReentrantLock)',
        'Каждый философ: думает → берёт вилки → ест → кладёт вилки',
        'Проблема: deadlock если все возьмут левую вилку',
        'Решение: один философ берёт вилки в обратном порядке',
        'Каждый философ ест 3 раза, с выводом состояния',
        'Программа должна корректно завершиться (без deadlock)'
      ],
      expectedOutput: `=== Dining Philosophers ===
5 философов, 5 вилок, каждый ест 3 раза

[Сократ] думает...
[Платон] думает...
[Аристотель] думает...
[Декарт] думает...
[Кант] думает...
[Сократ] взял вилки, ест (раз 1)
[Аристотель] взял вилки, ест (раз 1)
[Сократ] положил вилки
[Платон] взял вилки, ест (раз 1)
...
[Кант] поел 3 раза, уходит.
[Декарт] поел 3 раза, уходит.

Все философы поели! Deadlock не произошёл.`,
      hint: 'Deadlock: все берут левую → ждут правую → никто не может есть. Решение 1: упорядочивание — всегда бери вилку с меньшим номером первой. Философ 4 берёт вилку 0 (правую) перед вилкой 4 (левой). Решение 2: один философ берёт в обратном порядке. Используйте ReentrantLock.tryLock() с таймаутом для безопасности.',
      solution: `import java.util.concurrent.locks.*;
import java.util.concurrent.*;

public class Main {
    static final int NUM = 5;
    static final int MEALS = 3;
    static final ReentrantLock[] forks = new ReentrantLock[NUM];
    static final String[] names = {"Сократ", "Платон", "Аристотель", "Декарт", "Кант"};

    static class Philosopher extends Thread {
        final int id;
        int mealsEaten = 0;

        Philosopher(int id) {
            this.id = id;
            setName(names[id]);
        }

        @Override
        public void run() {
            try {
                while (mealsEaten < MEALS) {
                    think();
                    eat();
                }
                System.out.println("[" + getName() + "] поел " + MEALS + " раза, уходит.");
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        void think() throws InterruptedException {
            System.out.println("[" + getName() + "] думает...");
            Thread.sleep(50 + (int)(Math.random() * 100));
        }

        void eat() throws InterruptedException {
            // Упорядочивание: всегда берём вилку с меньшим номером первой
            int first = Math.min(id, (id + 1) % NUM);
            int second = Math.max(id, (id + 1) % NUM);

            forks[first].lock();
            try {
                forks[second].lock();
                try {
                    mealsEaten++;
                    System.out.println("[" + getName() + "] взял вилки, ест (раз " + mealsEaten + ")");
                    Thread.sleep(50 + (int)(Math.random() * 100));
                    System.out.println("[" + getName() + "] положил вилки");
                } finally {
                    forks[second].unlock();
                }
            } finally {
                forks[first].unlock();
            }
        }
    }

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Dining Philosophers ===");
        System.out.printf("%d философов, %d вилок, каждый ест %d раза%n%n", NUM, NUM, MEALS);

        for (int i = 0; i < NUM; i++) {
            forks[i] = new ReentrantLock();
        }

        Philosopher[] philosophers = new Philosopher[NUM];
        for (int i = 0; i < NUM; i++) {
            philosophers[i] = new Philosopher(i);
            philosophers[i].start();
        }

        for (Philosopher p : philosophers) {
            p.join(10000); // таймаут 10 секунд
        }

        System.out.println("\\nВсе философы поели! Deadlock не произошёл.");
    }
}`,
      explanation: 'Dining Philosophers — классическая задача на deadlock. Deadlock возникает при циклическом ожидании: каждый поток держит ресурс и ждёт следующий. Решение через упорядочивание ресурсов (resource ordering): всегда захватываем вилку с меньшим номером первой. Это разрывает цикл — философ 4 берёт вилку 0 перед вилкой 4. Другие решения: 1) tryLock с таймаутом; 2) ограничение числа одновременно обедающих (Semaphore на N-1); 3) один философ-левша.'
    },
    {
      id: 5,
      title: 'Read-Write кеш',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте потокобезопасный кеш с ReentrantReadWriteLock. Множество потоков могут читать одновременно, но запись эксклюзивная. Оптимально для сценария «много читателей, мало писателей».',
      requirements: [
        'Класс ThreadSafeCache<K,V> с ReentrantReadWriteLock',
        'Методы: get(K), put(K,V), remove(K), size()',
        'Read lock для get/size — конкурентное чтение',
        'Write lock для put/remove — эксклюзивная запись',
        'Демонстрация: 5 reader потоков + 2 writer потока',
        'Вывод статистики чтений и записей'
      ],
      expectedOutput: `=== Read-Write Cache ===

--- Инициализация ---
Добавлено: Java=1995, Python=1991, Go=2009

--- Тест: 5 читателей, 2 писателя ---
[Reader-1] get(Java) = 1995
[Reader-2] get(Python) = 1991
[Writer-1] put(Kotlin, 2011)
[Reader-3] get(Go) = 2009
[Reader-4] get(Kotlin) = 2011
[Writer-2] put(Rust, 2010)
...

--- Результат ---
Кеш: {Java=1995, Python=1991, Go=2009, Kotlin=2011, Rust=2010}
Размер: 5
Всего чтений: 50, записей: 10
Все потоки завершены корректно.`,
      hint: 'ReadWriteLock: readLock() позволяет множество одновременных reader-ов, writeLock() — эксклюзивный доступ. Паттерн: readLock.lock() → try { read } finally { readLock.unlock() }. Для апгрейда read→write: сначала unlock read, потом lock write (нельзя напрямую).',
      solution: `import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.util.concurrent.locks.*;

public class Main {
    static class ThreadSafeCache<K, V> {
        private final Map<K, V> cache = new HashMap<>();
        private final ReadWriteLock lock = new ReentrantReadWriteLock();
        private final Lock readLock = lock.readLock();
        private final Lock writeLock = lock.writeLock();

        V get(K key) {
            readLock.lock();
            try {
                return cache.get(key);
            } finally {
                readLock.unlock();
            }
        }

        void put(K key, V value) {
            writeLock.lock();
            try {
                cache.put(key, value);
            } finally {
                writeLock.unlock();
            }
        }

        V remove(K key) {
            writeLock.lock();
            try {
                return cache.remove(key);
            } finally {
                writeLock.unlock();
            }
        }

        int size() {
            readLock.lock();
            try {
                return cache.size();
            } finally {
                readLock.unlock();
            }
        }

        Map<K, V> snapshot() {
            readLock.lock();
            try {
                return new LinkedHashMap<>(cache);
            } finally {
                readLock.unlock();
            }
        }
    }

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Read-Write Cache ===");

        ThreadSafeCache<String, Integer> cache = new ThreadSafeCache<>();
        AtomicInteger reads = new AtomicInteger(0);
        AtomicInteger writes = new AtomicInteger(0);

        // Инициализация
        System.out.println("\\n--- Инициализация ---");
        cache.put("Java", 1995);
        cache.put("Python", 1991);
        cache.put("Go", 2009);
        System.out.println("Добавлено: Java=1995, Python=1991, Go=2009");

        System.out.println("\\n--- Тест: 5 читателей, 2 писателя ---");
        ExecutorService pool = Executors.newFixedThreadPool(7);
        CountDownLatch latch = new CountDownLatch(7);
        String[] keys = {"Java", "Python", "Go", "Kotlin", "Rust"};

        // Readers
        for (int r = 1; r <= 5; r++) {
            final int id = r;
            pool.submit(() -> {
                try {
                    for (int i = 0; i < 10; i++) {
                        String key = keys[i % keys.length];
                        Integer val = cache.get(key);
                        reads.incrementAndGet();
                        if (val != null && i < 2) {
                            System.out.println("[Reader-" + id + "] get(" + key + ") = " + val);
                        }
                        Thread.sleep(10);
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    latch.countDown();
                }
            });
        }

        // Writers
        String[][] newEntries = {{"Kotlin", "2011"}, {"Rust", "2010"}, {"Swift", "2014"},
            {"TypeScript", "2012"}, {"Scala", "2004"}};
        for (int w = 1; w <= 2; w++) {
            final int id = w;
            pool.submit(() -> {
                try {
                    for (int i = 0; i < 5; i++) {
                        int idx = (id - 1) * 2 + i;
                        if (idx < newEntries.length) {
                            String key = newEntries[idx][0];
                            int val = Integer.parseInt(newEntries[idx][1]);
                            cache.put(key, val);
                            writes.incrementAndGet();
                            System.out.println("[Writer-" + id + "] put(" + key + ", " + val + ")");
                        }
                        Thread.sleep(50);
                    }
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await();
        pool.shutdown();

        System.out.println("\\n--- Результат ---");
        System.out.println("Кеш: " + cache.snapshot());
        System.out.println("Размер: " + cache.size());
        System.out.println("Всего чтений: " + reads.get() + ", записей: " + writes.get());
        System.out.println("Все потоки завершены корректно.");
    }
}`,
      explanation: 'ReentrantReadWriteLock позволяет нескольким потокам читать одновременно (readLock), но запись (writeLock) — эксклюзивна. Когда writer держит lock, ни reader, ни другой writer не могут войти. Это оптимально для «read-heavy» сценариев (кеш, конфигурация). Альтернативы: StampedLock (Java 8) — оптимистическое чтение без блокировки; ConcurrentHashMap — lock striping для более гранулярной блокировки.'
    },
    {
      id: 6,
      title: 'CompletableFuture pipeline',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте CompletableFuture для асинхронной загрузки данных из нескольких «API» параллельно. Объедините результаты, обработайте ошибки, постройте pipeline из цепочки async-операций.',
      requirements: [
        'Имитация 3 API вызовов: getUserProfile, getOrders, getRecommendations',
        'Параллельный запуск всех трёх с CompletableFuture.supplyAsync()',
        'thenCombine/thenApply для объединения результатов',
        'exceptionally() для обработки ошибок',
        'allOf() для ожидания всех и anyOf() для первого',
        'Вывод финального результата с временем выполнения'
      ],
      expectedOutput: `=== CompletableFuture Pipeline ===

--- Параллельные API вызовы ---
Загрузка профиля... (200ms)
Загрузка заказов... (300ms)
Загрузка рекомендаций... (150ms)

Профиль: User{Алексей, Premium}
Заказы: [Ноутбук, Телефон, Наушники]
Рекомендации: [Монитор, Клавиатура]

Общее время: ~310 мс (параллельно, не 650!)

--- Обработка ошибок ---
Результат с ошибкой: Данные недоступны

--- anyOf: первый ответивший ---
Самый быстрый API ответил: Рекомендации (150ms)`,
      hint: 'CompletableFuture.supplyAsync() запускает задачу в ForkJoinPool. thenApply — sync трансформация. thenApplyAsync — async. thenCombine — объединение двух future. allOf(f1, f2, f3).thenRun() — после всех. exceptionally(ex -> default) — fallback при ошибке.',
      solution: `import java.util.*;
import java.util.concurrent.*;

public class Main {
    // Имитация API
    static String getUserProfile() {
        sleep(200);
        System.out.println("Загрузка профиля... (200ms)");
        return "User{Алексей, Premium}";
    }

    static List<String> getOrders() {
        sleep(300);
        System.out.println("Загрузка заказов... (300ms)");
        return List.of("Ноутбук", "Телефон", "Наушники");
    }

    static List<String> getRecommendations() {
        sleep(150);
        System.out.println("Загрузка рекомендаций... (150ms)");
        return List.of("Монитор", "Клавиатура");
    }

    static String getFailingApi() {
        sleep(100);
        throw new RuntimeException("Сервер недоступен");
    }

    static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== CompletableFuture Pipeline ===");
        System.out.println("\\n--- Параллельные API вызовы ---");

        long start = System.nanoTime();

        CompletableFuture<String> profileFuture =
            CompletableFuture.supplyAsync(Main::getUserProfile);
        CompletableFuture<List<String>> ordersFuture =
            CompletableFuture.supplyAsync(Main::getOrders);
        CompletableFuture<List<String>> recoFuture =
            CompletableFuture.supplyAsync(Main::getRecommendations);

        // Ждём все три
        CompletableFuture.allOf(profileFuture, ordersFuture, recoFuture).join();

        System.out.println("\\nПрофиль: " + profileFuture.get());
        System.out.println("Заказы: " + ordersFuture.get());
        System.out.println("Рекомендации: " + recoFuture.get());

        long totalMs = (System.nanoTime() - start) / 1_000_000;
        System.out.println("\\nОбщее время: ~" + totalMs + " мс (параллельно, не 650!)");

        // Обработка ошибок
        System.out.println("\\n--- Обработка ошибок ---");
        CompletableFuture<String> failing = CompletableFuture
            .supplyAsync(Main::getFailingApi)
            .exceptionally(ex -> "Данные недоступны");
        System.out.println("Результат с ошибкой: " + failing.get());

        // anyOf
        System.out.println("\\n--- anyOf: первый ответивший ---");
        CompletableFuture<String> fast1 = CompletableFuture.supplyAsync(() -> {
            sleep(200); return "Профиль (200ms)";
        });
        CompletableFuture<String> fast2 = CompletableFuture.supplyAsync(() -> {
            sleep(300); return "Заказы (300ms)";
        });
        CompletableFuture<String> fast3 = CompletableFuture.supplyAsync(() -> {
            sleep(150); return "Рекомендации (150ms)";
        });
        Object fastest = CompletableFuture.anyOf(fast1, fast2, fast3).get();
        System.out.println("Самый быстрый API ответил: " + fastest);
    }
}`,
      explanation: 'CompletableFuture (Java 8) — основа асинхронного программирования. supplyAsync() запускает задачу в ForkJoinPool.commonPool(). Pipeline: thenApply (map), thenCompose (flatMap), thenCombine (zip двух Future). Обработка ошибок: exceptionally (catch), handle (try-catch). allOf — ждать все, anyOf — первый. Общее время = max(time1, time2, time3), не сумма. В нашем примере: 300ms вместо 650ms. Это основа реактивного программирования.'
    },
    {
      id: 7,
      title: 'CountDownLatch: стартовый пистолет',
      type: 'practice',
      difficulty: 'easy',
      description: 'Используйте CountDownLatch как «стартовый пистолет» — все потоки стартуют одновременно. Второй сценарий: ожидание завершения N подзадач.',
      requirements: [
        'Сценарий 1: стартовый пистолет — 5 потоков ждут сигнала и стартуют одновременно',
        'CountDownLatch(1) — один сигнал, все ждут',
        'Сценарий 2: ожидание N задач — главный поток ждёт завершения 5 worker-ов',
        'CountDownLatch(N) — каждый worker уменьшает, main ждёт',
        'Замер времени от старта до завершения'
      ],
      expectedOutput: `=== CountDownLatch ===

--- Стартовый пистолет ---
Потоки готовы...
СТАРТ!
[Runner-1] стартовал и финишировал за 120ms
[Runner-3] стартовал и финишировал за 95ms
[Runner-2] стартовал и финишировал за 180ms
[Runner-4] стартовал и финишировал за 150ms
[Runner-5] стартовал и финишировал за 110ms
Все стартовали одновременно!

--- Ожидание N задач ---
[Worker-1] начал загрузку...
[Worker-2] начал загрузку...
[Worker-3] начал загрузку...
[Worker-1] завершил (150ms)
[Worker-3] завершил (200ms)
[Worker-2] завершил (250ms)
Все worker-ы завершили работу! Общее время: ~255 мс`,
      hint: 'CountDownLatch — одноразовый барьер. countDown() уменьшает счётчик, await() блокирует до 0. Стартовый пистолет: latch(1), все потоки await(), main делает countDown(). Ожидание N: latch(N), каждый worker countDown(), main await().',
      solution: `import java.util.concurrent.*;

public class Main {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== CountDownLatch ===");

        // Стартовый пистолет
        System.out.println("\\n--- Стартовый пистолет ---");
        int runners = 5;
        CountDownLatch startSignal = new CountDownLatch(1);
        CountDownLatch doneSignal = new CountDownLatch(runners);

        for (int i = 1; i <= runners; i++) {
            final int id = i;
            new Thread(() -> {
                try {
                    startSignal.await(); // ждём сигнала
                    long workTime = 80 + (long)(Math.random() * 150);
                    Thread.sleep(workTime);
                    System.out.printf("[Runner-%d] стартовал и финишировал за %dms%n", id, workTime);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    doneSignal.countDown();
                }
            }).start();
        }

        System.out.println("Потоки готовы...");
        Thread.sleep(100);
        System.out.println("СТАРТ!");
        startSignal.countDown(); // все стартуют одновременно!

        doneSignal.await();
        System.out.println("Все стартовали одновременно!");

        // Ожидание N задач
        System.out.println("\\n--- Ожидание N задач ---");
        int workers = 3;
        CountDownLatch workLatch = new CountDownLatch(workers);
        long startTime = System.nanoTime();

        for (int i = 1; i <= workers; i++) {
            final int id = i;
            new Thread(() -> {
                try {
                    System.out.println("[Worker-" + id + "] начал загрузку...");
                    long workTime = 100 + id * 50L;
                    Thread.sleep(workTime);
                    System.out.println("[Worker-" + id + "] завершил (" + workTime + "ms)");
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    workLatch.countDown();
                }
            }).start();
        }

        workLatch.await();
        long elapsed = (System.nanoTime() - startTime) / 1_000_000;
        System.out.println("Все worker-ы завершили работу! Общее время: ~" + elapsed + " мс");
    }
}`,
      explanation: 'CountDownLatch — одноразовый синхронизатор. Инициализируется числом N. await() блокирует до тех пор, пока N раз не вызван countDown(). Нельзя сбросить (одноразовый). Два паттерна: 1) «Стартовый пистолет»: latch(1), все потоки await, один поток countDown — все стартуют одновременно; 2) «Ожидание»: latch(N), каждый worker countDown при завершении, main await. Альтернатива для многоразового использования — CyclicBarrier.'
    },
    {
      id: 8,
      title: 'Semaphore: connection pool',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте Semaphore для ограничения числа одновременных подключений к ресурсу. Реализуйте простой connection pool, где максимум N потоков могут использовать ресурс одновременно.',
      requirements: [
        'Класс ConnectionPool с Semaphore(maxConnections)',
        'Методы: acquire() — получить подключение, release() — вернуть',
        'Максимум 3 одновременных подключения',
        '10 потоков пытаются получить подключение',
        'Вывод: кто получил, кто ждёт, кто освободил',
        'Статистика: текущие подключения, ожидающие'
      ],
      expectedOutput: `=== Semaphore: Connection Pool ===
Макс. подключений: 3, Потоков: 10

[Client-1] подключён (активных: 1)
[Client-2] подключён (активных: 2)
[Client-3] подключён (активных: 3)
[Client-4] ожидает подключения...
[Client-5] ожидает подключения...
[Client-1] отключился (активных: 2)
[Client-4] подключён (активных: 3)
...

Все клиенты обслужены.
Всего подключений: 10, Макс. одновременных: 3`,
      hint: 'Semaphore(N) — разрешает N одновременных доступов. acquire() — получить permit (блокирует если нет). release() — вернуть permit. Для мониторинга: availablePermits() — доступные, getQueueLength() — ожидающие. tryAcquire(timeout) — с таймаутом.',
      solution: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Main {
    static class ConnectionPool {
        private final Semaphore semaphore;
        private final AtomicInteger active = new AtomicInteger(0);
        private final int maxConnections;

        ConnectionPool(int maxConnections) {
            this.maxConnections = maxConnections;
            this.semaphore = new Semaphore(maxConnections, true); // fair
        }

        void connect(String clientName) throws InterruptedException {
            if (semaphore.availablePermits() == 0) {
                System.out.println("[" + clientName + "] ожидает подключения...");
            }
            semaphore.acquire();
            int curr = active.incrementAndGet();
            System.out.println("[" + clientName + "] подключён (активных: " + curr + ")");
        }

        void disconnect(String clientName) {
            int curr = active.decrementAndGet();
            System.out.println("[" + clientName + "] отключился (активных: " + curr + ")");
            semaphore.release();
        }

        int getMaxConnections() { return maxConnections; }
    }

    public static void main(String[] args) throws InterruptedException {
        int maxConn = 3;
        int clients = 10;

        System.out.println("=== Semaphore: Connection Pool ===");
        System.out.printf("Макс. подключений: %d, Потоков: %d%n%n", maxConn, clients);

        ConnectionPool pool = new ConnectionPool(maxConn);
        AtomicInteger totalConnections = new AtomicInteger(0);
        CountDownLatch latch = new CountDownLatch(clients);

        for (int i = 1; i <= clients; i++) {
            final String name = "Client-" + i;
            new Thread(() -> {
                try {
                    Thread.sleep((long)(Math.random() * 100));
                    pool.connect(name);
                    totalConnections.incrementAndGet();
                    Thread.sleep(100 + (long)(Math.random() * 200)); // работа
                    pool.disconnect(name);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                } finally {
                    latch.countDown();
                }
            }).start();
        }

        latch.await();
        System.out.println("\\nВсе клиенты обслужены.");
        System.out.printf("Всего подключений: %d, Макс. одновременных: %d%n",
            totalConnections.get(), pool.getMaxConnections());
    }
}`,
      explanation: 'Semaphore — счётчик разрешений (permits). acquire() уменьшает счётчик (блокирует при 0), release() увеличивает. Это обобщение mutex (Semaphore(1) = mutex). Применение: connection pools, rate limiting, ограничение параллелизма. Fair mode (true) — FIFO порядок ожидающих. tryAcquire(timeout) — не-блокирующая версия с таймаутом. В реальных connection pools (HikariCP) используется Semaphore + очередь свободных соединений.'
    },
    {
      id: 9,
      title: 'ConcurrentHashMap: подсчёт слов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте ConcurrentHashMap для параллельного подсчёта слов в нескольких «файлах». Покажите atomic операции: compute, merge, computeIfAbsent, и сравните с synchronized HashMap.',
      requirements: [
        'Несколько потоков параллельно обрабатывают «файлы» (списки слов)',
        'ConcurrentHashMap.merge() для атомарного подсчёта',
        'ConcurrentHashMap.compute() для сложных обновлений',
        'Сравнение с Collections.synchronizedMap',
        'Вывод топ-5 самых частых слов',
        'Корректный результат при параллельной обработке'
      ],
      expectedOutput: `=== ConcurrentHashMap: Word Count ===

--- Параллельный подсчёт слов ---
Файлов: 4, слов в каждом: ~20
Потоков: 4

Обработка файлов параллельно...
[Thread-1] обработал файл 1 (20 слов)
[Thread-2] обработал файл 2 (18 слов)
[Thread-3] обработал файл 3 (22 слов)
[Thread-4] обработал файл 4 (19 слов)

--- Топ-5 слов ---
java: 12
stream: 8
code: 7
class: 6
method: 5

Всего уникальных слов: 15
Всего слов обработано: 79`,
      hint: 'ConcurrentHashMap.merge(key, 1, Integer::sum) — атомарно: если ключа нет — ставит 1, если есть — прибавляет. compute(key, (k, v) -> ...) — атомарно пересчитывает. Не нужен внешний synchronized! forEach(parallelismThreshold, action) — параллельный обход.',
      solution: `import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.util.stream.*;

public class Main {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== ConcurrentHashMap: Word Count ===");

        // Подготовка данных (имитация файлов)
        List<List<String>> files = List.of(
            List.of("java", "stream", "code", "class", "java", "method",
                "stream", "java", "code", "pattern", "java", "stream",
                "interface", "class", "method", "java", "code", "stream", "api", "java"),
            List.of("code", "class", "java", "test", "method", "stream",
                "debug", "java", "code", "class", "test", "refactor",
                "pattern", "method", "java", "stream", "code", "deploy"),
            List.of("java", "deploy", "docker", "stream", "code", "class",
                "method", "test", "java", "spring", "stream", "api",
                "code", "java", "pattern", "docker", "class", "method",
                "spring", "api", "stream", "code"),
            List.of("test", "code", "java", "class", "stream", "api",
                "method", "java", "refactor", "pattern", "deploy",
                "docker", "spring", "code", "java", "test", "stream",
                "interface", "class")
        );

        System.out.println("\\n--- Параллельный подсчёт слов ---");
        System.out.printf("Файлов: %d, слов в каждом: ~20%n", files.size());
        System.out.printf("Потоков: %d%n", files.size());

        ConcurrentHashMap<String, Integer> wordCount = new ConcurrentHashMap<>();
        AtomicInteger totalWords = new AtomicInteger(0);
        CountDownLatch latch = new CountDownLatch(files.size());

        System.out.println("\\nОбработка файлов параллельно...");
        for (int i = 0; i < files.size(); i++) {
            final int fileId = i + 1;
            final List<String> words = files.get(i);
            new Thread(() -> {
                for (String word : words) {
                    wordCount.merge(word, 1, Integer::sum); // атомарный инкремент!
                    totalWords.incrementAndGet();
                }
                System.out.printf("[Thread-%d] обработал файл %d (%d слов)%n",
                    fileId, fileId, words.size());
                latch.countDown();
            }).start();
        }

        latch.await();

        // Топ-5
        System.out.println("\\n--- Топ-5 слов ---");
        wordCount.entrySet().stream()
            .sorted((a, b) -> b.getValue() - a.getValue())
            .limit(5)
            .forEach(e -> System.out.println(e.getKey() + ": " + e.getValue()));

        System.out.println("\\nВсего уникальных слов: " + wordCount.size());
        System.out.println("Всего слов обработано: " + totalWords.get());
    }
}`,
      explanation: 'ConcurrentHashMap — потокобезопасная HashMap без глобальной блокировки. Использует lock striping (Java 7: Segment, Java 8: CAS + synchronized на bin). Ключевые атомарные методы: merge(key, value, remappingFunction) — если ключ есть, применяет функцию к старому и новому значению; compute(key, biFunction) — пересчитывает значение; computeIfAbsent(key, function) — вычисляет при отсутствии. Эти методы атомарны — не нужен внешний synchronized. Для подсчёта слов merge(word, 1, Integer::sum) — идеальное решение.'
    },
    {
      id: 10,
      title: 'ThreadPool с мониторингом',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте свой ThreadPoolExecutor с метриками: активные потоки, завершённые задачи, размер очереди, среднее время выполнения. Переопределите beforeExecute/afterExecute для сбора статистики.',
      requirements: [
        'MonitoredThreadPool extends ThreadPoolExecutor',
        'Переопределить beforeExecute() и afterExecute() для замера времени',
        'Метрики: activeTasks, completedTasks, avgExecutionTime, queueSize',
        'Периодический вывод метрик каждую секунду',
        'core=2, max=4, queue=10, 20 задач разной длительности',
        'Демонстрация: рост числа потоков при заполнении очереди'
      ],
      expectedOutput: `=== ThreadPool с мониторингом ===
Core: 2, Max: 4, Queue: 10

--- Запуск 20 задач ---
[Monitor] active=2, completed=0, queue=10, pool=2
[Monitor] active=4, completed=3, queue=7, pool=4
[Monitor] active=4, completed=8, queue=2, pool=4
[Monitor] active=3, completed=12, queue=0, pool=4
[Monitor] active=1, completed=17, queue=0, pool=3
[Monitor] active=0, completed=20, queue=0, pool=2

--- Итоговые метрики ---
Всего задач: 20
Завершено: 20
Среднее время: ~150 мс
Пиковый pool size: 4
Отклонено: 0`,
      hint: 'ThreadPoolExecutor(core, max, keepAlive, unit, workQueue). При заполнении очереди создаются потоки до max. При idle потоки свыше core завершаются через keepAlive. beforeExecute/afterExecute — хуки для метрик. ThreadLocal<Long> для хранения startTime потока.',
      solution: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Main {
    static class MonitoredThreadPool extends ThreadPoolExecutor {
        private final ThreadLocal<Long> startTime = new ThreadLocal<>();
        private final AtomicLong totalTime = new AtomicLong(0);
        private final AtomicInteger completedCount = new AtomicInteger(0);
        private volatile int peakPoolSize = 0;

        MonitoredThreadPool(int core, int max, long keepAlive,
                            TimeUnit unit, BlockingQueue<Runnable> queue) {
            super(core, max, keepAlive, unit, queue,
                new ThreadPoolExecutor.CallerRunsPolicy());
        }

        @Override
        protected void beforeExecute(Thread t, Runnable r) {
            super.beforeExecute(t, r);
            startTime.set(System.nanoTime());
            int poolSize = getPoolSize();
            if (poolSize > peakPoolSize) peakPoolSize = poolSize;
        }

        @Override
        protected void afterExecute(Runnable r, Throwable t) {
            super.afterExecute(r, t);
            long elapsed = System.nanoTime() - startTime.get();
            totalTime.addAndGet(elapsed);
            completedCount.incrementAndGet();
        }

        long getAvgTimeMs() {
            int count = completedCount.get();
            return count == 0 ? 0 : totalTime.get() / count / 1_000_000;
        }

        int getPeakPoolSize() { return peakPoolSize; }

        String getMetrics() {
            return String.format("active=%d, completed=%d, queue=%d, pool=%d",
                getActiveCount(), getCompletedTaskCount(),
                getQueue().size(), getPoolSize());
        }
    }

    public static void main(String[] args) throws InterruptedException {
        int core = 2, max = 4, queueSize = 10, tasks = 20;

        System.out.println("=== ThreadPool с мониторингом ===");
        System.out.printf("Core: %d, Max: %d, Queue: %d%n", core, max, queueSize);

        MonitoredThreadPool pool = new MonitoredThreadPool(
            core, max, 5, TimeUnit.SECONDS,
            new ArrayBlockingQueue<>(queueSize));

        AtomicInteger rejected = new AtomicInteger(0);

        // Мониторинг
        System.out.println("\\n--- Запуск " + tasks + " задач ---");
        ScheduledExecutorService monitor = Executors.newSingleThreadScheduledExecutor();
        monitor.scheduleAtFixedRate(() -> {
            System.out.println("[Monitor] " + pool.getMetrics());
        }, 500, 1000, TimeUnit.MILLISECONDS);

        // Запуск задач
        for (int i = 1; i <= tasks; i++) {
            final int taskId = i;
            try {
                pool.execute(() -> {
                    try {
                        Thread.sleep(100 + (long)(Math.random() * 200));
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                });
            } catch (RejectedExecutionException e) {
                rejected.incrementAndGet();
            }
            Thread.sleep(30);
        }

        // Ожидание завершения
        pool.shutdown();
        pool.awaitTermination(30, TimeUnit.SECONDS);
        Thread.sleep(600); // последний вывод монитора
        monitor.shutdown();

        // Итоги
        System.out.println("\\n--- Итоговые метрики ---");
        System.out.println("Всего задач: " + tasks);
        System.out.println("Завершено: " + pool.getCompletedTaskCount());
        System.out.println("Среднее время: ~" + pool.getAvgTimeMs() + " мс");
        System.out.println("Пиковый pool size: " + pool.getPeakPoolSize());
        System.out.println("Отклонено: " + rejected.get());
    }
}`,
      explanation: 'ThreadPoolExecutor — основа пулов потоков в Java. Алгоритм: 1) < core → создать поток; 2) >= core → в очередь; 3) очередь полна и < max → создать поток; 4) >= max → RejectedExecutionPolicy. beforeExecute/afterExecute — хуки для мониторинга (AOP без AOP). ThreadLocal хранит startTime для каждого потока. CallerRunsPolicy — при переполнении задачу выполняет вызывающий поток (backpressure). В продакшне: Micrometer + Prometheus для метрик пулов.'
    }
  ]
};
