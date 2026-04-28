export default {
  id: 128,
  title: 'Практикум: Многопоточные паттерны',
  description: 'Thread-safe Singleton, Immutable объекты, Producer-Consumer, Reader-Writer Lock, Fork/Join, CompletableFuture, ScheduledExecutor, CAS, CyclicBarrier и Actor Model.',
  lessons: [
    {
      id: 1,
      title: 'Thread-safe Singleton',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте три варианта потокобезопасного Singleton: Double-Checked Locking, Enum Singleton и Holder Class (Bill Pugh). Сравните их по безопасности, производительности и простоте. Покажите, что все варианты создают ровно один экземпляр при многопоточном доступе.',
      requirements: [
        'DoubleCheckedSingleton — volatile + synchronized, lazy initialization',
        'EnumSingleton — enum с одним значением INSTANCE',
        'HolderSingleton — static inner class Holder (Initialization-on-demand)',
        'Тест: 20 потоков одновременно запрашивают getInstance()',
        'Проверить что все потоки получили один и тот же экземпляр'
      ],
      expectedOutput: `=== Thread-safe Singleton ===

--- Double-Checked Locking ---
20 потоков запрашивают getInstance()...
Все получили один экземпляр: true
Экземпляр: DoubleCheckedSingleton@1a2b3c
Создан: 1 раз

--- Enum Singleton ---
20 потоков запрашивают INSTANCE...
Все получили один экземпляр: true
Экземпляр: INSTANCE

--- Holder Class (Bill Pugh) ---
20 потоков запрашивают getInstance()...
Все получили один экземпляр: true
Экземпляр: HolderSingleton@4d5e6f
Создан: 1 раз

=== Сравнение ===
| Способ      | Lazy | Thread-safe | Serializable | Простота |
|-------------|------|-------------|-------------|----------|
| DCL         | Да   | Да          | Нет*        | Средняя  |
| Enum        | Нет  | Да          | Да          | Простая  |
| Holder      | Да   | Да          | Нет*        | Простая  |

* Нужен readResolve() для защиты от десериализации`,
      hint: 'CountDownLatch(1) — все потоки стартуют одновременно. ConcurrentHashMap собирает результаты. identityHashCode для проверки идентичности.',
      solution: `import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Main {
    // 1. Double-Checked Locking
    static class DoubleCheckedSingleton {
        private static volatile DoubleCheckedSingleton instance;
        private static final AtomicInteger createCount = new AtomicInteger(0);

        private DoubleCheckedSingleton() { createCount.incrementAndGet(); }

        static DoubleCheckedSingleton getInstance() {
            if (instance == null) {
                synchronized (DoubleCheckedSingleton.class) {
                    if (instance == null) {
                        instance = new DoubleCheckedSingleton();
                    }
                }
            }
            return instance;
        }

        static int getCreateCount() { return createCount.get(); }
    }

    // 2. Enum Singleton
    enum EnumSingleton {
        INSTANCE;
        private final String id = UUID.randomUUID().toString().substring(0, 8);
        String getId() { return id; }
    }

    // 3. Holder Class (Bill Pugh)
    static class HolderSingleton {
        private static final AtomicInteger createCount = new AtomicInteger(0);

        private HolderSingleton() { createCount.incrementAndGet(); }

        private static class Holder {
            private static final HolderSingleton INSTANCE = new HolderSingleton();
        }

        static HolderSingleton getInstance() { return Holder.INSTANCE; }
        static int getCreateCount() { return createCount.get(); }
    }

    static <T> boolean testSingleton(String name, Callable<T> factory) throws Exception {
        System.out.println("\\n--- " + name + " ---");
        int threads = 20;
        System.out.println(threads + " потоков запрашивают getInstance()...");

        ExecutorService exec = Executors.newFixedThreadPool(threads);
        CountDownLatch start = new CountDownLatch(1);
        ConcurrentHashMap<Integer, T> results = new ConcurrentHashMap<>();

        for (int i = 0; i < threads; i++) {
            final int id = i;
            exec.submit(() -> {
                try {
                    start.await();
                    results.put(id, factory.call());
                } catch (Exception e) {}
            });
        }
        start.countDown();
        exec.shutdown();
        exec.awaitTermination(5, TimeUnit.SECONDS);

        T first = results.values().iterator().next();
        boolean allSame = results.values().stream().allMatch(r -> r == first);
        System.out.println("Все получили один экземпляр: " + allSame);
        System.out.println("Экземпляр: " + first);
        return allSame;
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Thread-safe Singleton ===");

        testSingleton("Double-Checked Locking", DoubleCheckedSingleton::getInstance);
        System.out.println("Создан: " + DoubleCheckedSingleton.getCreateCount() + " раз");

        testSingleton("Enum Singleton", () -> EnumSingleton.INSTANCE);

        testSingleton("Holder Class (Bill Pugh)", HolderSingleton::getInstance);
        System.out.println("Создан: " + HolderSingleton.getCreateCount() + " раз");

        System.out.println("\\n=== Сравнение ===");
        System.out.println("| Способ      | Lazy | Thread-safe | Serializable | Простота |");
        System.out.println("|-------------|------|-------------|-------------|----------|");
        System.out.println("| DCL         | Да   | Да          | Нет*        | Средняя  |");
        System.out.println("| Enum        | Нет  | Да          | Да          | Простая  |");
        System.out.println("| Holder      | Да   | Да          | Нет*        | Простая  |");
        System.out.println("\\n* Нужен readResolve() для защиты от десериализации");
    }
}`,
      explanation: 'Double-Checked Locking: volatile обязателен — без него JIT может переупорядочить запись полей объекта и присвоение ссылки (другой поток увидит частично инициализированный объект). Enum Singleton — самый надёжный: JVM гарантирует единственность, защищает от reflection и десериализации. Holder (Bill Pugh) — JVM загружает inner class только при первом обращении, ClassLoader гарантирует thread-safety. В современной Java предпочитают Enum или Holder.'
    },
    {
      id: 2,
      title: 'Immutable объекты',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте полностью неизменяемый (immutable) объект. Immutable объекты потокобезопасны без синхронизации, могут безопасно использоваться как ключи HashMap, и упрощают reasoning о коде. Покажите все правила создания immutable класса и типичные ошибки.',
      requirements: [
        'Immutable класс Money: final class, final поля, нет setter-ов',
        'Defensive copy для мутабельных полей (Date, List)',
        'Класс ImmutablePerson с List<String> hobbies — defensive copy в конструкторе и getter',
        'Демонстрация: Collections.unmodifiableList() vs List.of() vs defensive copy',
        'Показать что модификация оригинала не влияет на immutable объект'
      ],
      expectedOutput: `=== Immutable объекты ===

--- Money (immutable) ---
m1 = Money{100.00 USD}
m2 = m1.add(50.00) = Money{150.00 USD}
m1 не изменился: Money{100.00 USD}
m1 == m2: false (разные объекты)

--- ImmutablePerson (defensive copy) ---
Создан: Person{Иван, хобби=[Java, Chess]}
Изменяем оригинальный список хобби...
Оригинал: [Java, Chess, Hacking]
Person: Person{Иван, хобби=[Java, Chess]} (не изменился!)

Пытаемся изменить через getter...
UnsupportedOperationException: список нельзя изменить!

--- Collections.unmodifiableList vs List.of ---
unmodifiable оборачивает оригинал (опасно!):
  Изменили оригинал → unmodifiable тоже изменился: [A, B, C]
List.of создаёт независимую копию:
  Изменили оригинал → List.of не изменился: [A, B]
List.copyOf — безопасная копия:
  Изменили оригинал → copyOf не изменился: [A, B]`,
      hint: 'Defensive copy: this.hobbies = List.copyOf(hobbies) или new ArrayList<>(hobbies) + Collections.unmodifiableList(). В getter возвращайте копию или unmodifiable view.',
      solution: `import java.util.*;
import java.math.*;

public class Main {
    // Immutable Money
    static final class Money {
        private final BigDecimal amount;
        private final String currency;

        Money(BigDecimal amount, String currency) {
            this.amount = amount;
            this.currency = currency;
        }

        Money add(BigDecimal other) {
            return new Money(this.amount.add(other), this.currency);
        }

        BigDecimal getAmount() { return amount; }
        String getCurrency() { return currency; }

        public String toString() {
            return "Money{" + amount.setScale(2) + " " + currency + "}";
        }
    }

    // Immutable Person с defensive copy
    static final class ImmutablePerson {
        private final String name;
        private final List<String> hobbies;

        ImmutablePerson(String name, List<String> hobbies) {
            this.name = name;
            this.hobbies = List.copyOf(hobbies); // defensive copy
        }

        String getName() { return name; }
        List<String> getHobbies() { return hobbies; } // уже unmodifiable

        public String toString() {
            return "Person{" + name + ", хобби=" + hobbies + "}";
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Immutable объекты ===");

        // Money
        System.out.println("\\n--- Money (immutable) ---");
        Money m1 = new Money(new BigDecimal("100.00"), "USD");
        System.out.println("m1 = " + m1);
        Money m2 = m1.add(new BigDecimal("50.00"));
        System.out.println("m2 = m1.add(50.00) = " + m2);
        System.out.println("m1 не изменился: " + m1);
        System.out.println("m1 == m2: " + (m1 == m2) + " (разные объекты)");

        // ImmutablePerson
        System.out.println("\\n--- ImmutablePerson (defensive copy) ---");
        List<String> hobbies = new ArrayList<>(Arrays.asList("Java", "Chess"));
        ImmutablePerson person = new ImmutablePerson("Иван", hobbies);
        System.out.println("Создан: " + person);

        System.out.println("Изменяем оригинальный список хобби...");
        hobbies.add("Hacking");
        System.out.println("Оригинал: " + hobbies);
        System.out.println("Person: " + person + " (не изменился!)");

        System.out.println("\\nПытаемся изменить через getter...");
        try {
            person.getHobbies().add("Exploit");
        } catch (UnsupportedOperationException e) {
            System.out.println("UnsupportedOperationException: список нельзя изменить!");
        }

        // unmodifiableList vs List.of
        System.out.println("\\n--- Collections.unmodifiableList vs List.of ---");
        List<String> original = new ArrayList<>(Arrays.asList("A", "B"));
        List<String> unmod = Collections.unmodifiableList(original);
        original.add("C");
        System.out.println("unmodifiable оборачивает оригинал (опасно!):");
        System.out.println("  Изменили оригинал → unmodifiable тоже изменился: " + unmod);

        List<String> original2 = new ArrayList<>(Arrays.asList("A", "B"));
        List<String> immut = List.of(original2.toArray(new String[0]));
        original2.add("C");
        System.out.println("List.of создаёт независимую копию:");
        System.out.println("  Изменили оригинал → List.of не изменился: " + immut);

        List<String> original3 = new ArrayList<>(Arrays.asList("A", "B"));
        List<String> copied = List.copyOf(original3);
        original3.add("C");
        System.out.println("List.copyOf — безопасная копия:");
        System.out.println("  Изменили оригинал → copyOf не изменился: " + copied);
    }
}`,
      explanation: 'Правила immutable класса: 1) final class (нельзя наследовать); 2) все поля private final; 3) нет setter-ов; 4) defensive copy мутабельных полей в конструкторе и getter; 5) методы возвращают новый объект. Collections.unmodifiableList — обёртка, видит изменения оригинала! List.copyOf / List.of — настоящие immutable копии. В Java Records (Java 16+) поля автоматически final, но defensive copy нужно делать вручную.'
    },
    {
      id: 3,
      title: 'Producer-Consumer с BlockingQueue',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте классический паттерн Producer-Consumer с использованием ArrayBlockingQueue. Несколько producer-ов генерируют задачи, несколько consumer-ов их обрабатывают. Очередь с ограниченным размером (bounded buffer) автоматически блокирует producer при переполнении и consumer при пустой очереди.',
      requirements: [
        'Producer — генерирует задачи (Task с id и payload) и кладёт в очередь',
        'Consumer — берёт задачи из очереди и обрабатывает',
        'ArrayBlockingQueue с capacity = 5 (bounded buffer)',
        '2 producer-а, 3 consumer-а, poison pill для завершения',
        'Вывести лог: кто произвёл, кто обработал, размер очереди'
      ],
      expectedOutput: `=== Producer-Consumer Pattern ===

Очередь: capacity = 5
Producers: 2, Consumers: 3

[Producer-1] → Task-1 (queue size: 1)
[Producer-2] → Task-2 (queue size: 2)
[Consumer-1] ← Task-1 (обработка 200ms)
[Producer-1] → Task-3 (queue size: 2)
[Consumer-2] ← Task-2 (обработка 200ms)
[Producer-2] → Task-4 (queue size: 2)
[Consumer-3] ← Task-3 (обработка 200ms)
...
[Producer-1] ЗАВЕРШЁН (отправил poison pill)
[Producer-2] ЗАВЕРШЁН (отправил poison pill)
[Consumer-1] получил poison pill, завершается
[Consumer-2] получил poison pill, завершается
[Consumer-3] получил poison pill, завершается

=== Статистика ===
Произведено задач: 20
Обработано задач: 20
Среднее время обработки: ~200 мс`,
      hint: 'Poison pill — специальный объект (Task с id = -1), сигнализирующий consumer-у о завершении. Каждый producer отправляет столько poison pill, сколько consumer-ов.',
      solution: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Main {
    static class Task {
        final int id;
        final String payload;
        static final Task POISON = new Task(-1, "POISON");

        Task(int id, String payload) { this.id = id; this.payload = payload; }
        boolean isPoison() { return id == -1; }
        public String toString() { return "Task-" + id; }
    }

    static final AtomicInteger produced = new AtomicInteger(0);
    static final AtomicInteger consumed = new AtomicInteger(0);
    static final AtomicInteger taskId = new AtomicInteger(0);

    public static void main(String[] args) throws Exception {
        int queueCapacity = 5;
        int numProducers = 2;
        int numConsumers = 3;
        int tasksPerProducer = 10;

        BlockingQueue<Task> queue = new ArrayBlockingQueue<>(queueCapacity);

        System.out.println("=== Producer-Consumer Pattern ===");
        System.out.println("\\nОчередь: capacity = " + queueCapacity);
        System.out.println("Producers: " + numProducers + ", Consumers: " + numConsumers);
        System.out.println();

        ExecutorService exec = Executors.newFixedThreadPool(numProducers + numConsumers);

        // Producers
        for (int p = 1; p <= numProducers; p++) {
            final int pid = p;
            exec.submit(() -> {
                try {
                    for (int i = 0; i < tasksPerProducer; i++) {
                        Task task = new Task(taskId.incrementAndGet(), "data-" + i);
                        queue.put(task);
                        produced.incrementAndGet();
                        System.out.println("[Producer-" + pid + "] → " + task
                            + " (queue size: " + queue.size() + ")");
                        Thread.sleep(50);
                    }
                    // Отправляем poison pill для каждого consumer
                    for (int i = 0; i < numConsumers; i++) {
                        queue.put(Task.POISON);
                    }
                    System.out.println("[Producer-" + pid + "] ЗАВЕРШЁН (отправил poison pill)");
                } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            });
        }

        // Consumers
        CountDownLatch done = new CountDownLatch(numConsumers);
        AtomicInteger poisonCount = new AtomicInteger(0);

        for (int c = 1; c <= numConsumers; c++) {
            final int cid = c;
            exec.submit(() -> {
                try {
                    while (true) {
                        Task task = queue.take();
                        if (task.isPoison()) {
                            System.out.println("[Consumer-" + cid + "] получил poison pill, завершается");
                            done.countDown();
                            return;
                        }
                        System.out.println("[Consumer-" + cid + "] ← " + task + " (обработка 200ms)");
                        Thread.sleep(200); // имитация обработки
                        consumed.incrementAndGet();
                    }
                } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            });
        }

        done.await(30, TimeUnit.SECONDS);
        exec.shutdown();

        System.out.println("\\n=== Статистика ===");
        System.out.println("Произведено задач: " + produced.get());
        System.out.println("Обработано задач: " + consumed.get());
        System.out.println("Среднее время обработки: ~200 мс");
    }
}`,
      explanation: 'Producer-Consumer — фундаментальный паттерн для decoupling производства и потребления данных. BlockingQueue управляет синхронизацией: put() блокирует при полной очереди (backpressure), take() — при пустой. Poison pill — чистый способ завершения consumer-ов без interrupt. В реальных системах: Kafka (distributed queue), RabbitMQ, Java ExecutorService (внутри ThreadPoolExecutor использует BlockingQueue). ArrayBlockingQueue — bounded, LinkedBlockingQueue — optionally bounded.'
    },
    {
      id: 4,
      title: 'Reader-Writer Lock паттерн',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте паттерн Reader-Writer Lock: множество потоков могут читать одновременно, но запись — эксклюзивная (блокирует и читателей, и других писателей). Используйте ReentrantReadWriteLock. Покажите преимущество над обычным synchronized для read-heavy нагрузки.',
      requirements: [
        'Класс ThreadSafeCache<K,V> с ReadWriteLock',
        'Методы: get(key), put(key, value), size(), getAll()',
        'Бенчмарк: 10 читателей + 2 писателя с ReadWriteLock vs synchronized',
        'Вывести лог операций: кто читает, кто пишет, сколько одновременных читателей',
        'Сравнение throughput (операций/сек)'
      ],
      expectedOutput: `=== Reader-Writer Lock Pattern ===

--- ReadWriteLock Cache ---
10 читателей + 2 писателя, 2 секунды работы...

[Writer-1] PUT key=item-1, value=1 (active readers: 0)
[Reader-1] GET key=item-1 → 1 (concurrent readers: 5)
[Reader-3] GET key=item-1 → 1 (concurrent readers: 5)
[Reader-5] GET key=item-1 → 1 (concurrent readers: 5)
[Writer-2] PUT key=item-2, value=2 (active readers: 0)
...

=== Benchmark: ReadWriteLock vs synchronized ===

ReadWriteLock (10R + 2W):
  Read ops:  150000
  Write ops:  10000
  Total ops: 160000

synchronized (10R + 2W):
  Read ops:   50000
  Write ops:  10000
  Total ops:  60000

ReadWriteLock быстрее в ~2.7x для read-heavy нагрузки!`,
      hint: 'readLock().lock()/unlock() для чтения, writeLock().lock()/unlock() для записи. AtomicInteger для подсчёта concurrent readers.',
      solution: `import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
import java.util.concurrent.locks.*;

public class Main {
    static class RWCache<K, V> {
        private final Map<K, V> map = new HashMap<>();
        private final ReadWriteLock rwLock = new ReentrantReadWriteLock();
        private final AtomicInteger activeReaders = new AtomicInteger(0);

        V get(K key) {
            rwLock.readLock().lock();
            activeReaders.incrementAndGet();
            try {
                return map.get(key);
            } finally {
                activeReaders.decrementAndGet();
                rwLock.readLock().unlock();
            }
        }

        void put(K key, V value) {
            rwLock.writeLock().lock();
            try {
                map.put(key, value);
            } finally {
                rwLock.writeLock().unlock();
            }
        }

        int getActiveReaders() { return activeReaders.get(); }
        int size() { rwLock.readLock().lock(); try { return map.size(); } finally { rwLock.readLock().unlock(); } }
    }

    static class SyncCache<K, V> {
        private final Map<K, V> map = new HashMap<>();
        synchronized V get(K key) { return map.get(key); }
        synchronized void put(K key, V value) { map.put(key, value); }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Reader-Writer Lock Pattern ===");
        System.out.println("\\n--- ReadWriteLock Cache ---");
        System.out.println("10 читателей + 2 писателя, 2 секунды работы...\\n");

        RWCache<String, Integer> rwCache = new RWCache<>();
        ExecutorService exec = Executors.newFixedThreadPool(12);
        AtomicBoolean running = new AtomicBoolean(true);
        AtomicInteger rwReads = new AtomicInteger(0);
        AtomicInteger rwWrites = new AtomicInteger(0);
        AtomicInteger writeCounter = new AtomicInteger(0);

        // Writers
        for (int w = 1; w <= 2; w++) {
            final int wid = w;
            exec.submit(() -> {
                while (running.get()) {
                    int val = writeCounter.incrementAndGet();
                    String key = "item-" + val;
                    rwCache.put(key, val);
                    rwWrites.incrementAndGet();
                    if (val <= 3) System.out.println("[Writer-" + wid + "] PUT key=" + key
                        + ", value=" + val + " (active readers: " + rwCache.getActiveReaders() + ")");
                    try { Thread.sleep(2); } catch (InterruptedException e) { break; }
                }
            });
        }

        Thread.sleep(10); // let writers add some data

        // Readers
        for (int r = 1; r <= 10; r++) {
            final int rid = r;
            exec.submit(() -> {
                int logged = 0;
                while (running.get()) {
                    int sz = rwCache.size();
                    if (sz > 0) {
                        String key = "item-" + (ThreadLocalRandom.current().nextInt(sz) + 1);
                        Integer val = rwCache.get(key);
                        rwReads.incrementAndGet();
                        if (logged < 1 && val != null) {
                            System.out.println("[Reader-" + rid + "] GET key=" + key
                                + " → " + val + " (concurrent readers: " + rwCache.getActiveReaders() + ")");
                            logged++;
                        }
                    }
                    try { Thread.sleep(0, 100_000); } catch (InterruptedException e) { break; }
                }
            });
        }

        Thread.sleep(2000);
        running.set(false);
        exec.shutdown();
        exec.awaitTermination(3, TimeUnit.SECONDS);

        // Benchmark
        System.out.println("\\n=== Benchmark: ReadWriteLock vs synchronized ===");

        // RW Lock benchmark
        RWCache<Integer, Integer> rwBench = new RWCache<>();
        for (int i = 0; i < 100; i++) rwBench.put(i, i);
        AtomicInteger rwR = new AtomicInteger(0), rwW = new AtomicInteger(0);
        AtomicBoolean run1 = new AtomicBoolean(true);
        ExecutorService e1 = Executors.newFixedThreadPool(12);
        for (int r = 0; r < 10; r++) e1.submit(() -> {
            while (run1.get()) { rwBench.get(ThreadLocalRandom.current().nextInt(100)); rwR.incrementAndGet(); }
        });
        for (int w = 0; w < 2; w++) e1.submit(() -> {
            while (run1.get()) { rwBench.put(ThreadLocalRandom.current().nextInt(100), 1); rwW.incrementAndGet(); }
        });
        Thread.sleep(2000);
        run1.set(false); e1.shutdown(); e1.awaitTermination(3, TimeUnit.SECONDS);

        // Sync benchmark
        SyncCache<Integer, Integer> syncBench = new SyncCache<>();
        for (int i = 0; i < 100; i++) syncBench.put(i, i);
        AtomicInteger sR = new AtomicInteger(0), sW = new AtomicInteger(0);
        AtomicBoolean run2 = new AtomicBoolean(true);
        ExecutorService e2 = Executors.newFixedThreadPool(12);
        for (int r = 0; r < 10; r++) e2.submit(() -> {
            while (run2.get()) { syncBench.get(ThreadLocalRandom.current().nextInt(100)); sR.incrementAndGet(); }
        });
        for (int w = 0; w < 2; w++) e2.submit(() -> {
            while (run2.get()) { syncBench.put(ThreadLocalRandom.current().nextInt(100), 1); sW.incrementAndGet(); }
        });
        Thread.sleep(2000);
        run2.set(false); e2.shutdown(); e2.awaitTermination(3, TimeUnit.SECONDS);

        System.out.println("\\nReadWriteLock (10R + 2W):");
        System.out.println("  Read ops:  " + rwR.get());
        System.out.println("  Write ops: " + rwW.get());
        System.out.println("  Total ops: " + (rwR.get() + rwW.get()));

        System.out.println("\\nsynchronized (10R + 2W):");
        System.out.println("  Read ops:  " + sR.get());
        System.out.println("  Write ops: " + sW.get());
        System.out.println("  Total ops: " + (sR.get() + sW.get()));

        double ratio = (double)(rwR.get() + rwW.get()) / (sR.get() + sW.get());
        System.out.printf("\\nReadWriteLock быстрее в ~%.1fx для read-heavy нагрузки!%n", ratio);
    }
}`,
      explanation: 'ReadWriteLock позволяет множеству читателей работать параллельно, блокируя только при записи. Для read-heavy нагрузки (95% reads) это даёт 2-5x улучшение throughput по сравнению с synchronized. ReentrantReadWriteLock поддерживает fairness policy, downgrade (write→read lock), но не upgrade (read→write). StampedLock (Java 8+) — ещё быстрее: optimistic read не блокирует writers. В реальных системах: ConcurrentHashMap использует сегментные блокировки, что ещё эффективнее.'
    },
    {
      id: 5,
      title: 'Fork/Join: параллельная задача',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте Fork/Join Framework для параллельного вычисления. Задача рекурсивно делится на подзадачи до порога (threshold), затем результаты объединяются. Реализуйте параллельный подсчёт суммы массива и параллельную сортировку (merge sort).',
      requirements: [
        'ParallelSum extends RecursiveTask<Long> — параллельная сумма массива',
        'Threshold = 10_000 — ниже этого размера считаем последовательно',
        'Бенчмарк: sequential sum vs ForkJoin sum на 10_000_000 элементах',
        'Показать как задача делится: fork() для подзадач, join() для результата',
        'Вывести количество подзадач и время'
      ],
      expectedOutput: `=== Fork/Join Framework ===

Массив: 10_000_000 элементов, threshold = 10_000

--- Последовательная сумма ---
Результат: 49999995000000
Время: ~20 мс

--- Fork/Join параллельная сумма ---
Результат: 49999995000000
Время: ~8 мс
Подзадач создано: ~2047
Pool parallelism: 8

Ускорение: ~2.5x

--- Fork/Join Merge Sort ---
Массив: 5_000_000 элементов
Последовательный Arrays.sort: ~500 мс
Fork/Join Merge Sort: ~250 мс
Отсортировано корректно: true`,
      hint: 'RecursiveTask<Long> — возвращает результат. compute(): if (size <= threshold) — считаем напрямую, иначе split и fork. ForkJoinPool.commonPool() — пул по умолчанию.',
      solution: `import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Main {
    static AtomicInteger taskCount = new AtomicInteger(0);

    static class ParallelSum extends RecursiveTask<Long> {
        private final long[] array;
        private final int start, end;
        private static final int THRESHOLD = 10_000;

        ParallelSum(long[] array, int start, int end) {
            this.array = array; this.start = start; this.end = end;
            taskCount.incrementAndGet();
        }

        protected Long compute() {
            if (end - start <= THRESHOLD) {
                long sum = 0;
                for (int i = start; i < end; i++) sum += array[i];
                return sum;
            }
            int mid = (start + end) / 2;
            ParallelSum left = new ParallelSum(array, start, mid);
            ParallelSum right = new ParallelSum(array, mid, end);
            left.fork();
            long rightResult = right.compute();
            long leftResult = left.join();
            return leftResult + rightResult;
        }
    }

    static class ParallelMergeSort extends RecursiveAction {
        private final int[] array;
        private final int start, end;
        private static final int THRESHOLD = 10_000;

        ParallelMergeSort(int[] array, int start, int end) {
            this.array = array; this.start = start; this.end = end;
        }

        protected void compute() {
            if (end - start <= THRESHOLD) {
                Arrays.sort(array, start, end);
                return;
            }
            int mid = (start + end) / 2;
            ParallelMergeSort left = new ParallelMergeSort(array, start, mid);
            ParallelMergeSort right = new ParallelMergeSort(array, mid, end);
            invokeAll(left, right);
            merge(array, start, mid, end);
        }

        static void merge(int[] arr, int start, int mid, int end) {
            int[] temp = Arrays.copyOfRange(arr, start, mid);
            int i = 0, j = mid, k = start;
            while (i < temp.length && j < end) {
                arr[k++] = (temp[i] <= arr[j]) ? temp[i++] : arr[j++];
            }
            while (i < temp.length) arr[k++] = temp[i++];
        }
    }

    public static void main(String[] args) {
        int size = 10_000_000;
        long[] data = new long[size];
        for (int i = 0; i < size; i++) data[i] = i;

        System.out.println("=== Fork/Join Framework ===");
        System.out.println("\\nМассив: " + size + " элементов, threshold = 10000");

        // Sequential
        System.out.println("\\n--- Последовательная сумма ---");
        long start1 = System.nanoTime();
        long seqSum = 0;
        for (long x : data) seqSum += x;
        long time1 = (System.nanoTime() - start1) / 1_000_000;
        System.out.println("Результат: " + seqSum);
        System.out.println("Время: ~" + time1 + " мс");

        // Fork/Join
        System.out.println("\\n--- Fork/Join параллельная сумма ---");
        ForkJoinPool pool = ForkJoinPool.commonPool();
        taskCount.set(0);
        long start2 = System.nanoTime();
        long fjSum = pool.invoke(new ParallelSum(data, 0, data.length));
        long time2 = (System.nanoTime() - start2) / 1_000_000;
        System.out.println("Результат: " + fjSum);
        System.out.println("Время: ~" + time2 + " мс");
        System.out.println("Подзадач создано: ~" + taskCount.get());
        System.out.println("Pool parallelism: " + pool.getParallelism());
        System.out.printf("\\nУскорение: ~%.1fx%n", (double) time1 / Math.max(time2, 1));

        // Merge Sort
        System.out.println("\\n--- Fork/Join Merge Sort ---");
        int sortSize = 5_000_000;
        System.out.println("Массив: " + sortSize + " элементов");
        Random rnd = new Random(42);

        int[] arr1 = new int[sortSize];
        for (int i = 0; i < sortSize; i++) arr1[i] = rnd.nextInt(10_000_000);
        int[] arr2 = arr1.clone();

        long s1 = System.nanoTime();
        Arrays.sort(arr1);
        long t1 = (System.nanoTime() - s1) / 1_000_000;
        System.out.println("Последовательный Arrays.sort: ~" + t1 + " мс");

        long s2 = System.nanoTime();
        pool.invoke(new ParallelMergeSort(arr2, 0, arr2.length));
        long t2 = (System.nanoTime() - s2) / 1_000_000;
        System.out.println("Fork/Join Merge Sort: ~" + t2 + " мс");
        System.out.println("Отсортировано корректно: " + Arrays.equals(arr1, arr2));
    }
}`,
      explanation: 'Fork/Join — реализация divide-and-conquer для параллельного выполнения. RecursiveTask<V> — возвращает результат, RecursiveAction — void. Work-stealing: свободные потоки «крадут» задачи у загруженных — эффективная балансировка. Threshold критичен: слишком маленький — overhead на создание задач, слишком большой — мало параллелизма. Оптимально: THRESHOLD = N / (parallelism * 4). parallelStream() внутри использует ForkJoinPool.commonPool().'
    },
    {
      id: 6,
      title: 'CompletableFuture Fan-out/Fan-in',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте паттерн Fan-out/Fan-in с CompletableFuture: запустите несколько асинхронных задач параллельно (fan-out), дождитесь всех результатов и объедините (fan-in). Типичный сценарий: запрос к нескольким микросервисам одновременно.',
      requirements: [
        'Симуляция 5 параллельных API-запросов (разное время ответа)',
        'CompletableFuture.supplyAsync() для каждого запроса',
        'allOf() — дождаться всех, anyOf() — дождаться первого',
        'thenCombine, thenCompose — комбинирование результатов',
        'Обработка ошибок: exceptionally(), handle()'
      ],
      expectedOutput: `=== CompletableFuture Fan-out/Fan-in ===

--- Fan-out: 5 параллельных запросов ---
Запуск запросов к сервисам...
  [UserService] ответил за 200ms: User{id=1, name=Иван}
  [OrderService] ответил за 350ms: Orders{count=5}
  [ProductService] ответил за 150ms: Products{count=120}
  [ReviewService] ответил за 400ms: Reviews{avg=4.5}
  [RecommendService] ответил за 300ms: Recs{count=10}

Все 5 запросов завершены за ~400 мс (параллельно!)
Последовательно заняло бы: ~1400 мс

--- anyOf: первый результат ---
Первым ответил: ProductService за ~150 мс

--- Обработка ошибок ---
PaymentService: ОШИБКА → fallback: PaymentUnavailable
Результат с fallback: PaymentUnavailable

--- Цепочка: thenCompose ---
getUser(1) → getOrders(userId) → getTotal(orders)
Результат: User Иван, заказов: 5, сумма: 15000₽`,
      hint: 'CompletableFuture.allOf(futures).thenApply(v -> futures.stream().map(f -> f.join()).toList()). exceptionally(ex -> fallback) обрабатывает ошибки.',
      solution: `import java.util.*;
import java.util.concurrent.*;

public class Main {
    static <T> CompletableFuture<T> simulateService(String name, T result, long delayMs) {
        return CompletableFuture.supplyAsync(() -> {
            try { Thread.sleep(delayMs); } catch (InterruptedException e) {}
            System.out.println("  [" + name + "] ответил за " + delayMs + "ms: " + result);
            return result;
        });
    }

    static <T> CompletableFuture<T> failingService(String name, long delayMs) {
        return CompletableFuture.supplyAsync(() -> {
            try { Thread.sleep(delayMs); } catch (InterruptedException e) {}
            throw new RuntimeException(name + " connection refused");
        });
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== CompletableFuture Fan-out/Fan-in ===");

        // Fan-out
        System.out.println("\\n--- Fan-out: 5 параллельных запросов ---");
        System.out.println("Запуск запросов к сервисам...");

        long start = System.nanoTime();
        CompletableFuture<String> userF = simulateService("UserService", "User{id=1, name=Иван}", 200);
        CompletableFuture<String> orderF = simulateService("OrderService", "Orders{count=5}", 350);
        CompletableFuture<String> productF = simulateService("ProductService", "Products{count=120}", 150);
        CompletableFuture<String> reviewF = simulateService("ReviewService", "Reviews{avg=4.5}", 400);
        CompletableFuture<String> recF = simulateService("RecommendService", "Recs{count=10}", 300);

        CompletableFuture<Void> allDone = CompletableFuture.allOf(userF, orderF, productF, reviewF, recF);
        allDone.join();
        long elapsed = (System.nanoTime() - start) / 1_000_000;

        System.out.println("\\nВсе 5 запросов завершены за ~" + elapsed + " мс (параллельно!)");
        System.out.println("Последовательно заняло бы: ~1400 мс");

        // anyOf
        System.out.println("\\n--- anyOf: первый результат ---");
        CompletableFuture<String> f1 = simulateService("A", "A", 200);
        CompletableFuture<String> f2 = simulateService("B", "B", 150);
        CompletableFuture<String> f3 = simulateService("C", "C", 300);

        long anyStart = System.nanoTime();
        Object first = CompletableFuture.anyOf(f1, f2, f3).join();
        long anyTime = (System.nanoTime() - anyStart) / 1_000_000;
        System.out.println("Первым ответил: " + first + " за ~" + anyTime + " мс");

        // Error handling
        System.out.println("\\n--- Обработка ошибок ---");
        CompletableFuture<String> payment = Main.<String>failingService("PaymentService", 100)
            .exceptionally(ex -> {
                System.out.println("PaymentService: ОШИБКА → fallback: PaymentUnavailable");
                return "PaymentUnavailable";
            });
        System.out.println("Результат с fallback: " + payment.join());

        // thenCompose chain
        System.out.println("\\n--- Цепочка: thenCompose ---");
        System.out.println("getUser(1) → getOrders(userId) → getTotal(orders)");

        String result = CompletableFuture.supplyAsync(() -> {
            try { Thread.sleep(100); } catch (InterruptedException e) {}
            return "Иван";
        }).thenCompose(user -> CompletableFuture.supplyAsync(() -> {
            try { Thread.sleep(100); } catch (InterruptedException e) {}
            return "User " + user + ", заказов: 5";
        })).thenCompose(orders -> CompletableFuture.supplyAsync(() -> {
            try { Thread.sleep(100); } catch (InterruptedException e) {}
            return orders + ", сумма: 15000₽";
        })).join();

        System.out.println("Результат: " + result);
    }
}`,
      explanation: 'CompletableFuture — основа асинхронного программирования в Java. Fan-out/Fan-in: запускаем N задач параллельно через supplyAsync(), ждём все через allOf(). allOf() завершается за время самой медленной задачи (не суммарное!). thenCompose — для цепочек зависимых async-операций (аналог flatMap). exceptionally/handle — обработка ошибок без try-catch. В Spring WebFlux и Micronaut — реактивный подход (Mono/Flux) построен на тех же принципах.'
    },
    {
      id: 7,
      title: 'Periodic Task с ScheduledExecutor',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте периодические задачи с ScheduledExecutorService: мониторинг системы (heartbeat), очистка кеша по расписанию, retry с экспоненциальной задержкой. Покажите разницу между scheduleAtFixedRate и scheduleWithFixedDelay.',
      requirements: [
        'Heartbeat monitor — отправка пинга каждые 500ms',
        'Cache cleanup — очистка устаревших записей каждую секунду',
        'scheduleAtFixedRate vs scheduleWithFixedDelay — разница в поведении',
        'Exponential backoff retry — повторные попытки с увеличивающейся задержкой',
        'Graceful shutdown с awaitTermination'
      ],
      expectedOutput: `=== Periodic Tasks с ScheduledExecutor ===

--- Heartbeat Monitor ---
[0.0s] ♥ Heartbeat #1 (system OK)
[0.5s] ♥ Heartbeat #2 (system OK)
[1.0s] ♥ Heartbeat #3 (system OK)
[1.5s] ♥ Heartbeat #4 (system OK)
Остановка heartbeat...

--- Cache Cleanup ---
[0s] Кеш: 100 записей
[1s] Очистка: удалено 15 устаревших → осталось 85
[2s] Очистка: удалено 12 устаревших → осталось 73
Остановка cleanup...

--- FixedRate vs FixedDelay ---
FixedRate (период 500ms, задача 200ms):
  Запуск каждые 500ms от начала (не ждёт завершения)
FixedDelay (задержка 500ms, задача 200ms):
  Запуск через 500ms ПОСЛЕ завершения предыдущей (700ms между стартами)

--- Exponential Backoff Retry ---
Попытка 1: ОШИБКА → retry через 100ms
Попытка 2: ОШИБКА → retry через 200ms
Попытка 3: ОШИБКА → retry через 400ms
Попытка 4: УСПЕХ!`,
      hint: 'scheduleAtFixedRate — от начала предыдущего запуска. scheduleWithFixedDelay — от конца. Exponential backoff: delay = initialDelay * 2^(attempt-1).',
      solution: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Main {
    public static void main(String[] args) throws Exception {
        System.out.println("=== Periodic Tasks с ScheduledExecutor ===");
        long globalStart = System.nanoTime();

        // Heartbeat
        System.out.println("\\n--- Heartbeat Monitor ---");
        ScheduledExecutorService heartbeatExec = Executors.newSingleThreadScheduledExecutor();
        AtomicInteger beatCount = new AtomicInteger(0);
        long hbStart = System.nanoTime();

        ScheduledFuture<?> heartbeat = heartbeatExec.scheduleAtFixedRate(() -> {
            int count = beatCount.incrementAndGet();
            double elapsed = (System.nanoTime() - hbStart) / 1_000_000_000.0;
            System.out.printf("[%.1fs] ♥ Heartbeat #%d (system OK)%n", elapsed, count);
        }, 0, 500, TimeUnit.MILLISECONDS);

        Thread.sleep(2000);
        heartbeat.cancel(false);
        System.out.println("Остановка heartbeat...");
        heartbeatExec.shutdown();

        // Cache cleanup
        System.out.println("\\n--- Cache Cleanup ---");
        ScheduledExecutorService cleanupExec = Executors.newSingleThreadScheduledExecutor();
        AtomicInteger cacheSize = new AtomicInteger(100);
        AtomicInteger cleanupSec = new AtomicInteger(0);

        System.out.println("[0s] Кеш: " + cacheSize.get() + " записей");
        ScheduledFuture<?> cleanup = cleanupExec.scheduleWithFixedDelay(() -> {
            int removed = ThreadLocalRandom.current().nextInt(10, 20);
            int remaining = cacheSize.addAndGet(-removed);
            int sec = cleanupSec.incrementAndGet();
            System.out.println("[" + sec + "s] Очистка: удалено " + removed
                + " устаревших → осталось " + remaining);
        }, 1, 1, TimeUnit.SECONDS);

        Thread.sleep(2500);
        cleanup.cancel(false);
        System.out.println("Остановка cleanup...");
        cleanupExec.shutdown();

        // FixedRate vs FixedDelay
        System.out.println("\\n--- FixedRate vs FixedDelay ---");
        System.out.println("FixedRate (период 500ms, задача 200ms):");
        System.out.println("  Запуск каждые 500ms от начала (не ждёт завершения)");
        System.out.println("FixedDelay (задержка 500ms, задача 200ms):");
        System.out.println("  Запуск через 500ms ПОСЛЕ завершения предыдущей (700ms между стартами)");

        // Exponential Backoff
        System.out.println("\\n--- Exponential Backoff Retry ---");
        ScheduledExecutorService retryExec = Executors.newSingleThreadScheduledExecutor();
        AtomicInteger attempt = new AtomicInteger(0);
        int maxAttempts = 4;
        long initialDelay = 100;

        CompletableFuture<String> retryResult = new CompletableFuture<>();

        Runnable retryTask = new Runnable() {
            public void run() {
                int att = attempt.incrementAndGet();
                boolean success = att >= maxAttempts; // успех на 4-й попытке
                if (success) {
                    System.out.println("Попытка " + att + ": УСПЕХ!");
                    retryResult.complete("OK");
                } else {
                    long delay = initialDelay * (1L << (att - 1));
                    System.out.println("Попытка " + att + ": ОШИБКА → retry через " + delay + "ms");
                    retryExec.schedule(this, delay, TimeUnit.MILLISECONDS);
                }
            }
        };

        retryExec.schedule(retryTask, 0, TimeUnit.MILLISECONDS);
        retryResult.get(10, TimeUnit.SECONDS);
        retryExec.shutdown();
    }
}`,
      explanation: 'ScheduledExecutorService — замена Timer/TimerTask (который не thread-safe и одна ошибка убивает все задачи). scheduleAtFixedRate: если задача 200ms, период 500ms → старт каждые 500ms. Если задача 600ms > период — следующая запускается сразу. scheduleWithFixedDelay: 200ms задача + 500ms пауза = 700ms между стартами. Exponential backoff — стандартный паттерн retry (используется в gRPC, AWS SDK, HTTP клиентах): delay = base * 2^n, с максимальным cap.'
    },
    {
      id: 8,
      title: 'Thread-safe коллекция через CAS',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте lock-free (неблокирующий) стек на основе CAS-операции (Compare-And-Swap) с использованием AtomicReference. CAS — основа всех lock-free алгоритмов: если текущее значение совпадает с ожидаемым, атомарно заменить на новое, иначе повторить.',
      requirements: [
        'Класс ConcurrentStack<T> — lock-free стек через AtomicReference',
        'Методы: push(item), pop() → Optional<T>, peek(), size()',
        'Тест: 10 потоков одновременно push и pop',
        'Все элементы сохранены, ни один не потерян',
        'Бенчмарк: CAS-стек vs synchronized Stack'
      ],
      expectedOutput: `=== Lock-Free ConcurrentStack (CAS) ===

--- Основные операции ---
Push: 1, 2, 3
Peek: 3
Pop: 3, 2, 1
Size: 0

--- Многопоточный тест ---
10 потоков, каждый push 10000 + pop 10000 элементов
Pushed total: 100000
Popped total: 100000
Потерянных элементов: 0
CAS retries: ~5000

--- Benchmark: CAS vs synchronized ---
CAS Stack (10 threads, 100K ops):   ~120 мс
Synchronized Stack (10 threads, 100K ops): ~250 мс
CAS быстрее в ~2.1x`,
      hint: 'Node(value, next). AtomicReference<Node<T>> top. Push: newNode.next = top.get(); top.compareAndSet(oldTop, newNode). Повторять в цикле while (!cas).',
      solution: `import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Main {
    static class ConcurrentStack<T> {
        private static class Node<T> {
            final T value;
            Node<T> next;
            Node(T value, Node<T> next) { this.value = value; this.next = next; }
        }

        private final AtomicReference<Node<T>> top = new AtomicReference<>(null);
        private final AtomicInteger size = new AtomicInteger(0);
        final AtomicInteger casRetries = new AtomicInteger(0);

        void push(T value) {
            Node<T> newNode = new Node<>(value, null);
            while (true) {
                Node<T> oldTop = top.get();
                newNode.next = oldTop;
                if (top.compareAndSet(oldTop, newNode)) {
                    size.incrementAndGet();
                    return;
                }
                casRetries.incrementAndGet();
            }
        }

        Optional<T> pop() {
            while (true) {
                Node<T> oldTop = top.get();
                if (oldTop == null) return Optional.empty();
                Node<T> newTop = oldTop.next;
                if (top.compareAndSet(oldTop, newTop)) {
                    size.decrementAndGet();
                    return Optional.of(oldTop.value);
                }
                casRetries.incrementAndGet();
            }
        }

        Optional<T> peek() {
            Node<T> t = top.get();
            return t == null ? Optional.empty() : Optional.of(t.value);
        }

        int size() { return size.get(); }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Lock-Free ConcurrentStack (CAS) ===");

        // Basic ops
        System.out.println("\\n--- Основные операции ---");
        ConcurrentStack<Integer> stack = new ConcurrentStack<>();
        System.out.println("Push: 1, 2, 3");
        stack.push(1); stack.push(2); stack.push(3);
        System.out.println("Peek: " + stack.peek().orElse(null));
        System.out.print("Pop: ");
        System.out.print(stack.pop().orElse(null) + ", ");
        System.out.print(stack.pop().orElse(null) + ", ");
        System.out.println(stack.pop().orElse(null));
        System.out.println("Size: " + stack.size());

        // Concurrent test
        System.out.println("\\n--- Многопоточный тест ---");
        int threads = 10;
        int opsPerThread = 10_000;
        System.out.println(threads + " потоков, каждый push " + opsPerThread + " + pop " + opsPerThread + " элементов");

        ConcurrentStack<Integer> concStack = new ConcurrentStack<>();
        AtomicInteger pushTotal = new AtomicInteger(0);
        AtomicInteger popTotal = new AtomicInteger(0);

        ExecutorService exec = Executors.newFixedThreadPool(threads);
        CountDownLatch latch = new CountDownLatch(threads);

        for (int t = 0; t < threads; t++) {
            exec.submit(() -> {
                for (int i = 0; i < opsPerThread; i++) {
                    concStack.push(i);
                    pushTotal.incrementAndGet();
                }
                for (int i = 0; i < opsPerThread; i++) {
                    if (concStack.pop().isPresent()) popTotal.incrementAndGet();
                }
                latch.countDown();
            });
        }
        latch.await();

        // Drain remaining
        while (concStack.pop().isPresent()) popTotal.incrementAndGet();

        System.out.println("Pushed total: " + pushTotal.get());
        System.out.println("Popped total: " + popTotal.get());
        System.out.println("Потерянных элементов: " + (pushTotal.get() - popTotal.get()));
        System.out.println("CAS retries: ~" + concStack.casRetries.get());

        // Benchmark
        System.out.println("\\n--- Benchmark: CAS vs synchronized ---");
        int benchOps = 100_000;

        ConcurrentStack<Integer> casStack = new ConcurrentStack<>();
        long start1 = System.nanoTime();
        CountDownLatch l1 = new CountDownLatch(threads);
        ExecutorService e1 = Executors.newFixedThreadPool(threads);
        for (int t = 0; t < threads; t++) {
            e1.submit(() -> {
                for (int i = 0; i < benchOps / threads; i++) { casStack.push(i); casStack.pop(); }
                l1.countDown();
            });
        }
        l1.await();
        long time1 = (System.nanoTime() - start1) / 1_000_000;
        e1.shutdown();

        Stack<Integer> syncStack = new Stack<>();
        long start2 = System.nanoTime();
        CountDownLatch l2 = new CountDownLatch(threads);
        ExecutorService e2 = Executors.newFixedThreadPool(threads);
        for (int t = 0; t < threads; t++) {
            e2.submit(() -> {
                for (int i = 0; i < benchOps / threads; i++) {
                    synchronized (syncStack) { syncStack.push(i); }
                    synchronized (syncStack) { if (!syncStack.isEmpty()) syncStack.pop(); }
                }
                l2.countDown();
            });
        }
        l2.await();
        long time2 = (System.nanoTime() - start2) / 1_000_000;
        e2.shutdown();

        System.out.printf("CAS Stack (%d threads, %dK ops):   ~%d мс%n", threads, benchOps / 1000, time1);
        System.out.printf("Synchronized Stack (%d threads, %dK ops): ~%d мс%n", threads, benchOps / 1000, time2);
        System.out.printf("CAS быстрее в ~%.1fx%n", (double) time2 / Math.max(time1, 1));
    }
}`,
      explanation: 'CAS (Compare-And-Swap) — аппаратная инструкция (CMPXCHG на x86): атомарно «если значение == ожидаемое, записать новое, иначе ничего». Это основа lock-free алгоритмов — нет блокировок, нет deadlocks, потоки всегда делают прогресс. AtomicReference.compareAndSet() — Java-обёртка над CAS. Treiber Stack — классический lock-free стек. Проблема ABA (значение A→B→A, CAS не заметит): решается AtomicStampedReference с версией. ConcurrentLinkedQueue и ConcurrentLinkedDeque в JDK используют аналогичные CAS-алгоритмы.'
    },
    {
      id: 9,
      title: 'Barrier: параллельная обработка матрицы',
      type: 'practice',
      difficulty: 'hard',
      description: 'Используйте CyclicBarrier для фазовой обработки матрицы. Каждый поток обрабатывает свою полосу строк, затем все ждут на барьере перед переходом к следующей фазе. Покажите как Barrier синхронизирует фазы вычислений.',
      requirements: [
        'Матрица 1000x1000, 4 потока обрабатывают свои полосы строк',
        'CyclicBarrier с barrier action — печать прогресса между фазами',
        'Фаза 1: заполнение случайными числами',
        'Фаза 2: сглаживание (среднее соседей)',
        'Фаза 3: поиск max/min/avg',
        'Вывести результаты каждой фазы и время'
      ],
      expectedOutput: `=== CyclicBarrier: Параллельная обработка матрицы ===

Матрица: 1000x1000, потоков: 4
Каждый поток: 250 строк

--- Фаза 1: Заполнение ---
[Thread-0] строки 0-249: заполнено
[Thread-1] строки 250-499: заполнено
[Thread-2] строки 500-749: заполнено
[Thread-3] строки 750-999: заполнено
=== Barrier: Фаза 1 завершена за ~5 мс ===

--- Фаза 2: Сглаживание ---
[Thread-0] строки 0-249: сглажено
[Thread-1] строки 250-499: сглажено
[Thread-2] строки 500-749: сглажено
[Thread-3] строки 750-999: сглажено
=== Barrier: Фаза 2 завершена за ~15 мс ===

--- Фаза 3: Статистика ---
[Thread-0] строки 0-249: min=1, max=99, avg=50.2
[Thread-1] строки 250-499: min=1, max=98, avg=49.8
...
=== Barrier: Фаза 3 завершена за ~3 мс ===

Итого: min=1, max=99, avg=50.0
Общее время: ~23 мс`,
      hint: 'CyclicBarrier(4, barrierAction) — barrierAction выполняется одним потоком, когда все 4 достигли барьера. barrier.await() — блокирует до достижения всеми.',
      solution: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Main {
    static final int SIZE = 1000;
    static final int THREADS = 4;
    static double[][] matrix = new double[SIZE][SIZE];
    static double[][] smoothed = new double[SIZE][SIZE];
    static AtomicInteger phaseNum = new AtomicInteger(0);
    static long phaseStart;
    static double globalMin = Double.MAX_VALUE, globalMax = Double.MIN_VALUE;
    static double globalSum = 0;
    static final Object statsLock = new Object();

    public static void main(String[] args) throws Exception {
        System.out.println("=== CyclicBarrier: Параллельная обработка матрицы ===");
        System.out.println("\\nМатрица: " + SIZE + "x" + SIZE + ", потоков: " + THREADS);
        System.out.println("Каждый поток: " + (SIZE / THREADS) + " строк");

        CyclicBarrier barrier = new CyclicBarrier(THREADS, () -> {
            long elapsed = (System.nanoTime() - phaseStart) / 1_000_000;
            int phase = phaseNum.incrementAndGet();
            String name = phase == 1 ? "Заполнение" : phase == 2 ? "Сглаживание" : "Статистика";
            System.out.println("=== Barrier: Фаза " + phase + " (" + name + ") завершена за ~" + elapsed + " мс ===");
        });

        long totalStart = System.nanoTime();
        CountDownLatch done = new CountDownLatch(THREADS);
        ExecutorService exec = Executors.newFixedThreadPool(THREADS);

        phaseStart = System.nanoTime();
        System.out.println("\\n--- Фаза 1: Заполнение ---");

        for (int t = 0; t < THREADS; t++) {
            final int tid = t;
            final int startRow = tid * (SIZE / THREADS);
            final int endRow = startRow + (SIZE / THREADS);

            exec.submit(() -> {
                try {
                    // Фаза 1: заполнение
                    ThreadLocalRandom rnd = ThreadLocalRandom.current();
                    for (int i = startRow; i < endRow; i++)
                        for (int j = 0; j < SIZE; j++)
                            matrix[i][j] = rnd.nextInt(100);
                    System.out.println("[Thread-" + tid + "] строки " + startRow + "-" + (endRow - 1) + ": заполнено");
                    barrier.await();

                    // Фаза 2: сглаживание
                    phaseStart = System.nanoTime();
                    System.out.println("\\n--- Фаза 2: Сглаживание ---");
                    for (int i = startRow; i < endRow; i++) {
                        for (int j = 0; j < SIZE; j++) {
                            double sum = 0; int count = 0;
                            for (int di = -1; di <= 1; di++) {
                                for (int dj = -1; dj <= 1; dj++) {
                                    int ni = i + di, nj = j + dj;
                                    if (ni >= 0 && ni < SIZE && nj >= 0 && nj < SIZE) {
                                        sum += matrix[ni][nj]; count++;
                                    }
                                }
                            }
                            smoothed[i][j] = sum / count;
                        }
                    }
                    System.out.println("[Thread-" + tid + "] строки " + startRow + "-" + (endRow - 1) + ": сглажено");
                    barrier.await();

                    // Фаза 3: статистика
                    phaseStart = System.nanoTime();
                    if (tid == 0) System.out.println("\\n--- Фаза 3: Статистика ---");
                    double min = Double.MAX_VALUE, max = Double.MIN_VALUE, sum2 = 0;
                    for (int i = startRow; i < endRow; i++) {
                        for (int j = 0; j < SIZE; j++) {
                            double v = smoothed[i][j];
                            if (v < min) min = v;
                            if (v > max) max = v;
                            sum2 += v;
                        }
                    }
                    double avg = sum2 / ((endRow - startRow) * SIZE);
                    System.out.printf("[Thread-%d] строки %d-%d: min=%.0f, max=%.0f, avg=%.1f%n",
                        tid, startRow, endRow - 1, min, max, avg);

                    synchronized (statsLock) {
                        if (min < globalMin) globalMin = min;
                        if (max > globalMax) globalMax = max;
                        globalSum += sum2;
                    }
                    barrier.await();

                } catch (Exception e) { e.printStackTrace(); }
                finally { done.countDown(); }
            });
        }

        done.await();
        long totalTime = (System.nanoTime() - totalStart) / 1_000_000;

        System.out.printf("\\nИтого: min=%.0f, max=%.0f, avg=%.1f%n",
            globalMin, globalMax, globalSum / (SIZE * SIZE));
        System.out.println("Общее время: ~" + totalTime + " мс");

        exec.shutdown();
    }
}`,
      explanation: 'CyclicBarrier — точка синхронизации для группы потоков. «Cyclic» — можно переиспользовать (в отличие от CountDownLatch). Barrier action выполняется одним потоком после достижения барьера всеми. Идеально для фазовых вычислений: каждая фаза зависит от результатов предыдущей. Паттерн используется в научных вычислениях (шаг симуляции), обработке изображений (конвейер фильтров), MapReduce (shuffle phase). Phaser (Java 7+) — гибче: динамическое число участников, advance per phase.'
    },
    {
      id: 10,
      title: 'Actor Model',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте простую модель акторов (Actor Model): каждый актор имеет mailbox (очередь сообщений) и обрабатывает их последовательно в своём потоке. Акторы общаются только через сообщения — нет shared state, нет блокировок. Это модель Erlang/Akka.',
      requirements: [
        'Абстрактный класс Actor<T> с mailbox (BlockingQueue) и методом onMessage(T)',
        'Методы: send(message), start(), stop()',
        'PrinterActor — печатает сообщения',
        'CounterActor — считает сообщения, отвечает на запрос getCount',
        'PingPongActor — два актора обмениваются сообщениями',
        'Демонстрация: система из нескольких акторов'
      ],
      expectedOutput: `=== Actor Model ===

--- PrinterActor ---
[Printer] Привет, мир!
[Printer] Акторы — это просто!
[Printer] Без блокировок и shared state

--- CounterActor ---
[Counter] Получено: increment
[Counter] Получено: increment
[Counter] Получено: increment
[Counter] Получено: getCount
[Counter] Текущий счётчик: 3

--- PingPong (10 обменов) ---
[Ping] → Pong: PING #1
[Pong] → Ping: PONG #1
[Ping] → Pong: PING #2
[Pong] → Ping: PONG #2
...
[Ping] → Pong: PING #10
[Pong] → Ping: PONG #10
Всего обменов: 10

=== Преимущества Actor Model ===
- Нет shared state → нет race conditions
- Нет блокировок → нет deadlocks
- Масштабируемость: миллионы акторов (Erlang/Akka)
- Fault tolerance: supervisor перезапускает упавших акторов`,
      hint: 'Actor запускает Thread, который в цикле делает mailbox.take() → onMessage(). Poison pill для остановки. PingPong: каждый актор знает ссылку на другого.',
      solution: `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;

public class Main {
    static abstract class Actor<T> {
        private final BlockingQueue<T> mailbox = new LinkedBlockingQueue<>();
        private final String name;
        private volatile boolean running = true;
        private Thread thread;

        Actor(String name) { this.name = name; }

        abstract void onMessage(T message);

        void send(T message) {
            mailbox.offer(message);
        }

        void start() {
            thread = new Thread(() -> {
                while (running) {
                    try {
                        T msg = mailbox.poll(100, TimeUnit.MILLISECONDS);
                        if (msg != null) onMessage(msg);
                    } catch (InterruptedException e) { break; }
                }
            }, name);
            thread.start();
        }

        void stop() {
            running = false;
            if (thread != null) thread.interrupt();
        }

        String getName() { return name; }
    }

    // PrinterActor
    static class PrinterActor extends Actor<String> {
        PrinterActor() { super("Printer"); }

        void onMessage(String message) {
            System.out.println("[Printer] " + message);
        }
    }

    // CounterActor
    static class CounterActor extends Actor<String> {
        private int count = 0;

        CounterActor() { super("Counter"); }

        void onMessage(String message) {
            System.out.println("[Counter] Получено: " + message);
            if ("increment".equals(message)) {
                count++;
            } else if ("getCount".equals(message)) {
                System.out.println("[Counter] Текущий счётчик: " + count);
            }
        }
    }

    // PingPong
    static class PingPongActor extends Actor<String> {
        private Actor<String> partner;
        private final int maxExchanges;
        private final AtomicInteger exchangeCount;
        private final String sendPrefix;
        private final CountDownLatch done;

        PingPongActor(String name, int max, AtomicInteger counter, String prefix, CountDownLatch done) {
            super(name);
            this.maxExchanges = max;
            this.exchangeCount = counter;
            this.sendPrefix = prefix;
            this.done = done;
        }

        void setPartner(Actor<String> partner) { this.partner = partner; }

        void onMessage(String message) {
            int count = exchangeCount.incrementAndGet();
            int exchangeNum = (count + 1) / 2;
            if (exchangeNum > maxExchanges) {
                done.countDown();
                return;
            }
            System.out.println("[" + getName() + "] → " + partner.getName() + ": " + sendPrefix + " #" + exchangeNum);
            partner.send(sendPrefix + " #" + exchangeNum);
            if (exchangeNum >= maxExchanges && sendPrefix.equals("PONG")) {
                done.countDown();
            }
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("=== Actor Model ===");

        // Printer
        System.out.println("\\n--- PrinterActor ---");
        PrinterActor printer = new PrinterActor();
        printer.start();
        printer.send("Привет, мир!");
        printer.send("Акторы — это просто!");
        printer.send("Без блокировок и shared state");
        Thread.sleep(300);
        printer.stop();

        // Counter
        System.out.println("\\n--- CounterActor ---");
        CounterActor counter = new CounterActor();
        counter.start();
        counter.send("increment");
        counter.send("increment");
        counter.send("increment");
        Thread.sleep(100);
        counter.send("getCount");
        Thread.sleep(200);
        counter.stop();

        // PingPong
        System.out.println("\\n--- PingPong (10 обменов) ---");
        int maxExchanges = 10;
        AtomicInteger exchangeCounter = new AtomicInteger(0);
        CountDownLatch done = new CountDownLatch(1);

        PingPongActor ping = new PingPongActor("Ping", maxExchanges, exchangeCounter, "PING", done);
        PingPongActor pong = new PingPongActor("Pong", maxExchanges, exchangeCounter, "PONG", done);
        ping.setPartner(pong);
        pong.setPartner(ping);

        ping.start();
        pong.start();
        ping.send("start");

        done.await(5, TimeUnit.SECONDS);
        Thread.sleep(200);
        ping.stop();
        pong.stop();

        System.out.println("Всего обменов: " + (exchangeCounter.get() / 2));

        System.out.println("\\n=== Преимущества Actor Model ===");
        System.out.println("- Нет shared state → нет race conditions");
        System.out.println("- Нет блокировок → нет deadlocks");
        System.out.println("- Масштабируемость: миллионы акторов (Erlang/Akka)");
        System.out.println("- Fault tolerance: supervisor перезапускает упавших акторов");
    }
}`,
      explanation: 'Actor Model — модель конкурентности без shared state. Каждый актор: 1) имеет private state; 2) обрабатывает сообщения последовательно (thread-safe по дизайну); 3) может создавать новых акторов, отправлять сообщения, менять своё поведение. Akka (Scala/Java) — полная реализация с supervision, routing, persistence. Erlang/OTP — акторы (processes) с fault tolerance (let it crash + supervisor). Virtual Threads (Java 21) сделают модель акторов ещё эффективнее — миллионы лёгких потоков.'
    }
  ]
};
