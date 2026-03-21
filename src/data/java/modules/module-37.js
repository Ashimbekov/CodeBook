export default {
  id: 37,
  title: 'Синхронизация потоков',
  description: 'Race conditions, synchronized, volatile, AtomicInteger — инструменты для безопасной работы нескольких потоков с общими данными',
  lessons: [
    {
      id: 1,
      title: 'Race conditions — состояние гонки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Race condition (состояние гонки) — это ошибка, которая возникает когда несколько потоков обращаются к одним данным одновременно, и итог зависит от того, кто "успел первым".' },
        { type: 'tip', value: 'Два человека одновременно снимают деньги с одного банковского счёта. На счету 1000р. Первый проверяет баланс (1000р ≥ 500р — можно). Второй проверяет баланс (1000р ≥ 700р — можно). Первый снимает 500р, второй снимает 700р. В итоге на счету -200р! Это классическое состояние гонки.' },
        { type: 'code', language: 'java', value: '// Демонстрация race condition\nclass BankAccount {\n    private int balance = 1000;\n\n    public void withdraw(int amount) {\n        if (balance >= amount) {\n            // ОПАСНО: между проверкой и снятием другой поток может тоже пройти проверку\n            try { Thread.sleep(10); } catch (InterruptedException e) {}\n            balance -= amount;\n            System.out.println("Снято: " + amount + ", Остаток: " + balance);\n        } else {\n            System.out.println("Недостаточно средств для снятия " + amount);\n        }\n    }\n}\n\nBankAccount account = new BankAccount();\n\n// Два потока одновременно снимают деньги\nnew Thread(() -> account.withdraw(700)).start();\nnew Thread(() -> account.withdraw(500)).start();\n// Может вывести:\n// Снято: 700, Остаток: 300\n// Снято: 500, Остаток: -200  <-- катастрофа!' },
        { type: 'heading', value: 'Почему count++ не атомарна?' },
        { type: 'code', language: 'java', value: '// count++ на самом деле три операции:\n// 1. READ: temp = count     (читаем значение в регистр)\n// 2. ADD:  temp = temp + 1  (прибавляем 1)\n// 3. WRITE: count = temp    (записываем обратно)\n\n// Поток А читает count = 5\n// Поток Б читает count = 5 (тот же!)\n// Поток А записывает count = 6\n// Поток Б записывает count = 6\n// Итог: count = 6, а должно быть 7!' },
        { type: 'warning', value: 'Race conditions — одни из самых коварных ошибок в программировании. Они проявляются непредсказуемо, редко воспроизводятся на тестах и могут не проявиться годами, а потом сломать систему в самый неподходящий момент.' }
      ]
    },
    {
      id: 2,
      title: 'synchronized метод',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ключевое слово synchronized позволяет только одному потоку одновременно выполнять помеченный метод или блок. Остальные потоки ждут своей очереди.' },
        { type: 'tip', value: 'synchronized — как туалетная кабинка с замком. Когда один человек заходит — он закрывает дверь на замок. Все остальные ждут снаружи. Когда он выходит — дверь открывается, следующий заходит.' },
        { type: 'code', language: 'java', value: 'class SafeCounter {\n    private int count = 0;\n\n    // synchronized — только один поток выполняет этот метод одновременно\n    public synchronized void increment() {\n        count++; // теперь атомарно с точки зрения многопоточности\n    }\n\n    public synchronized int getCount() {\n        return count;\n    }\n}\n\nSafeCounter counter = new SafeCounter();\n\n// 10 потоков увеличивают счётчик по 100 раз каждый\nThread[] threads = new Thread[10];\nfor (int i = 0; i < 10; i++) {\n    threads[i] = new Thread(() -> {\n        for (int j = 0; j < 100; j++) counter.increment();\n    });\n    threads[i].start();\n}\n\nfor (Thread t : threads) t.join();\nSystem.out.println(counter.getCount()); // ВСЕГДА 1000, не меньше!' },
        { type: 'heading', value: 'Исправляем банковский счёт' },
        { type: 'code', language: 'java', value: 'class SafeBankAccount {\n    private int balance = 1000;\n\n    public synchronized void withdraw(int amount) {\n        if (balance >= amount) {\n            balance -= amount;\n            System.out.println("Снято: " + amount + ", Остаток: " + balance);\n        } else {\n            System.out.println("Недостаточно средств. Баланс: " + balance);\n        }\n    }\n\n    public synchronized int getBalance() {\n        return balance;\n    }\n}' },
        { type: 'note', value: 'synchronized метод использует монитор объекта (this) как замок. Если метод static — используется монитор класса. Два разных synchronized метода одного объекта тоже не могут работать одновременно — у них один замок.' }
      ]
    },
    {
      id: 3,
      title: 'synchronized блоки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда не нужно блокировать весь метод — достаточно защитить только критический участок кода. Для этого используют synchronized блоки.' },
        { type: 'code', language: 'java', value: 'class DataProcessor {\n    private List<String> results = new ArrayList<>();\n    private final Object lock = new Object(); // объект для синхронизации\n\n    public void processItem(String item) {\n        // Этот код выполняется параллельно — быстрая часть\n        String processed = item.toUpperCase().trim();\n\n        // Только этот блок — под замком\n        synchronized (lock) {\n            results.add(processed); // защищённое добавление\n        }\n        // Этот код снова параллельно\n        System.out.println("Обработано: " + processed);\n    }\n}' },
        { type: 'heading', value: 'Синхронизация на this vs на объекте' },
        { type: 'code', language: 'java', value: 'class Example {\n    private final Object lockA = new Object();\n    private final Object lockB = new Object();\n    private int a = 0;\n    private int b = 0;\n\n    // Два метода могут работать параллельно — разные замки!\n    public void updateA() {\n        synchronized (lockA) {\n            a++;\n        }\n    }\n\n    public void updateB() {\n        synchronized (lockB) {\n            b++;\n        }\n    }\n\n    // Если бы оба были synchronized (this) — блокировали бы друг друга\n}' },
        { type: 'heading', value: 'Синхронизация с классом' },
        { type: 'code', language: 'java', value: 'class Config {\n    private static int instanceCount = 0;\n\n    public static void registerInstance() {\n        // static synchronized или synchronized (Config.class)\n        synchronized (Config.class) {\n            instanceCount++;\n        }\n    }\n}' },
        { type: 'tip', value: 'Чем меньше кода под замком — тем лучше производительность. Блокируй только то, что действительно нужно защитить. Долгие операции (например, работа с файлом) вне synchronized блока!' }
      ]
    },
    {
      id: 4,
      title: 'volatile — видимость изменений',
      type: 'theory',
      content: [
        { type: 'text', value: 'volatile — ключевое слово, которое гарантирует что все потоки видят актуальное значение переменной. Без него поток может работать со старой копией значения из своего кэша.' },
        { type: 'tip', value: 'Представь: у каждого работника есть личная записная книжка (кэш). Без volatile работник может смотреть в свою книжку, а не в общую доску. volatile говорит: "всегда смотри на общую доску, не в свою книжку".' },
        { type: 'code', language: 'java', value: '// Проблема без volatile\nclass Worker {\n    private boolean running = true; // потоки могут кэшировать это значение!\n\n    public void run() {\n        while (running) { // может крутиться вечно — видит старое значение из кэша\n            doWork();\n        }\n    }\n\n    public void stop() {\n        running = false; // изменение может не дойти до другого потока!\n    }\n}\n\n// Решение с volatile\nclass SafeWorker {\n    private volatile boolean running = true;\n\n    public void run() {\n        while (running) { // ВСЕГДА читает актуальное значение\n            doWork();\n        }\n    }\n\n    public void stop() {\n        running = false; // СРАЗУ видно всем потокам\n    }\n}' },
        { type: 'heading', value: 'volatile vs synchronized' },
        { type: 'list', items: [
          'volatile гарантирует видимость изменений, но НЕ атомарность',
          'synchronized гарантирует и видимость, и атомарность',
          'volatile подходит для флагов (boolean), счётчиков прочитанных один раз',
          'volatile НЕ подходит для count++ (это не атомарная операция!)',
          'volatile работает только с одной переменной, synchronized — с блоком кода'
        ]},
        { type: 'code', language: 'java', value: 'class Example {\n    private volatile int value = 0;\n\n    // БЕЗОПАСНО с volatile (просто присваивание — атомарно для int/long/ссылок)\n    public void setValue(int v) { value = v; }\n    public int getValue() { return value; }\n\n    // НЕБЕЗОПАСНО даже с volatile (несколько операций)\n    public void increment() { value++; } // READ-MODIFY-WRITE — не атомарно!\n}' },
        { type: 'note', value: 'volatile — это облегчённая синхронизация. Используй его когда: (1) только одни поток пишет, остальные читают, или (2) когда операции с переменной атомарны (простые присваивания).' }
      ]
    },
    {
      id: 5,
      title: 'AtomicInteger и атомарные классы',
      type: 'theory',
      content: [
        { type: 'text', value: 'java.util.concurrent.atomic содержит классы, которые выполняют операции атомарно без synchronized. Они быстрее synchronized и удобнее для простых операций.' },
        { type: 'code', language: 'java', value: 'import java.util.concurrent.atomic.AtomicInteger;\n\nAtomicInteger counter = new AtomicInteger(0);\n\n// Все эти операции атомарны!\ncounter.get();            // читаем значение\ncounter.set(10);          // устанавливаем значение\ncounter.incrementAndGet(); // ++counter (возвращает новое значение)\ncounter.getAndIncrement(); // counter++ (возвращает старое значение)\ncounter.addAndGet(5);     // counter += 5 (возвращает новое)\ncounter.decrementAndGet(); // --counter\n\nSystem.out.println(counter.get()); // текущее значение' },
        { type: 'heading', value: 'AtomicInteger vs synchronized' },
        { type: 'code', language: 'java', value: '// С AtomicInteger — быстро и без блокировок\nAtomicInteger atomicCounter = new AtomicInteger(0);\n\nfor (int i = 0; i < 1000; i++) {\n    new Thread(() -> atomicCounter.incrementAndGet()).start();\n}\n\nThread.sleep(1000);\nSystem.out.println(atomicCounter.get()); // ВСЕГДА 1000!\n\n// С synchronized — чуть медленнее, но тоже правильно\nclass SyncCounter {\n    int count = 0;\n    synchronized void inc() { count++; }\n}' },
        { type: 'heading', value: 'Другие атомарные классы' },
        { type: 'code', language: 'java', value: 'import java.util.concurrent.atomic.*;\n\nAtomicLong bigCounter = new AtomicLong(0L);\nbigCounter.incrementAndGet();\n\nAtomicBoolean flag = new AtomicBoolean(false);\nflag.compareAndSet(false, true); // если false — устанавливаем true, атомарно\n\nAtomicReference<String> ref = new AtomicReference<>("начало");\nref.set("новое значение");\nSystem.out.println(ref.get());\n\n// compareAndSet — основа lock-free алгоритмов\nAtomicInteger val = new AtomicInteger(5);\nboolean success = val.compareAndSet(5, 10); // если 5 — устанавливаем 10\nSystem.out.println(success); // true\nSystem.out.println(val.get()); // 10' },
        { type: 'tip', value: 'Для простых счётчиков — используй AtomicInteger вместо synchronized. Для сложных операций с несколькими переменными — synchronized блок надёжнее.' }
      ]
    },
    {
      id: 6,
      title: 'Дедлоки (Deadlock)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Дедлок (deadlock) — ситуация когда два или более потоков бесконечно ждут друг друга, и никто не может продолжить работу.' },
        { type: 'tip', value: 'Два водителя на узкой дороге едут навстречу. Ни один не хочет сдавать назад — оба ждут что другой уступит. Никто не едет. Это дедлок. В программировании — два потока держат один ресурс и ждут другой, который держит второй поток.' },
        { type: 'code', language: 'java', value: '// Классический дедлок\nObject lockA = new Object();\nObject lockB = new Object();\n\nThread t1 = new Thread(() -> {\n    synchronized (lockA) {          // Поток 1 захватил lockA\n        System.out.println("T1: захватил lockA");\n        try { Thread.sleep(100); } catch (InterruptedException e) {}\n        synchronized (lockB) {      // Поток 1 ждёт lockB (который держит T2)\n            System.out.println("T1: захватил lockB");\n        }\n    }\n});\n\nThread t2 = new Thread(() -> {\n    synchronized (lockB) {          // Поток 2 захватил lockB\n        System.out.println("T2: захватил lockB");\n        try { Thread.sleep(100); } catch (InterruptedException e) {}\n        synchronized (lockA) {      // Поток 2 ждёт lockA (который держит T1)\n            System.out.println("T2: захватил lockA");\n        }\n    }\n});\n\nt1.start();\nt2.start();\n// Программа зависнет навсегда!' },
        { type: 'heading', value: 'Как избежать дедлоков' },
        { type: 'list', items: [
          'Всегда захватывай замки в одном порядке (оба потока сначала lockA, потом lockB)',
          'Используй tryLock() с таймаутом (ReentrantLock)',
          'Минимизируй количество замков',
          'Используй высокоуровневые примитивы (java.util.concurrent)'
        ]},
        { type: 'code', language: 'java', value: '// Решение: всегда захватывать в одном порядке\nThread t1Fixed = new Thread(() -> {\n    synchronized (lockA) {  // сначала A\n        synchronized (lockB) { // потом B\n            System.out.println("T1: работает");\n        }\n    }\n});\n\nThread t2Fixed = new Thread(() -> {\n    synchronized (lockA) {  // тоже сначала A!\n        synchronized (lockB) { // потом B\n            System.out.println("T2: работает");\n        }\n    }\n});\n// Теперь дедлока нет — оба ждут lockA, потом оба берут lockB' },
        { type: 'warning', value: 'Дедлок — это зависание программы, которое очень сложно диагностировать. В production-системах дедлок может означать что весь сервер перестал обрабатывать запросы. Предотвращай дедлоки на этапе проектирования.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: потокобезопасный счётчик',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реши задачу потокобезопасного счётчика посещений сайта тремя способами.',
      requirements: [
        'Создай класс VisitCounter с методами increment() и getCount()',
        'Реализуй версию 1: с использованием synchronized метода',
        'Реализуй версию 2: с использованием AtomicInteger',
        'Запусти 5 потоков, каждый увеличивает счётчик 200 раз',
        'Выведи финальные значения обоих счётчиков — оба должны быть 1000'
      ],
      expectedOutput: 'Synchronized счётчик: 1000\nAtomicInteger счётчик: 1000\nОба работают правильно!',
      hint: 'В классе хранишь int count и делаешь synchronized void increment() { count++; } и synchronized int getCount(). Для AtomicInteger: private AtomicInteger atomic = new AtomicInteger(0); метод increment() вызывает atomic.incrementAndGet(). Потоки создавай в цикле for(int i=0;i<5;i++) и все join() в следующем цикле.',
      solution: 'import java.util.concurrent.atomic.AtomicInteger;\n\npublic class Main {\n\n    static class SyncCounter {\n        private int count = 0;\n        public synchronized void increment() { count++; }\n        public synchronized int getCount() { return count; }\n    }\n\n    static class AtomicCounter {\n        private AtomicInteger count = new AtomicInteger(0);\n        public void increment() { count.incrementAndGet(); }\n        public int getCount() { return count.get(); }\n    }\n\n    public static void main(String[] args) throws InterruptedException {\n        SyncCounter syncC = new SyncCounter();\n        AtomicCounter atomicC = new AtomicCounter();\n\n        Thread[] threads1 = new Thread[5];\n        Thread[] threads2 = new Thread[5];\n\n        for (int i = 0; i < 5; i++) {\n            threads1[i] = new Thread(() -> { for (int j = 0; j < 200; j++) syncC.increment(); });\n            threads2[i] = new Thread(() -> { for (int j = 0; j < 200; j++) atomicC.increment(); });\n            threads1[i].start();\n            threads2[i].start();\n        }\n\n        for (int i = 0; i < 5; i++) {\n            threads1[i].join();\n            threads2[i].join();\n        }\n\n        System.out.println("Synchronized счётчик: " + syncC.getCount());\n        System.out.println("AtomicInteger счётчик: " + atomicC.getCount());\n        System.out.println("Оба работают правильно!");\n    }\n}',
      explanation: 'Оба подхода дают правильный результат 1000. AtomicInteger обычно быстрее synchronized при высокой конкуренции, потому что не блокирует поток а использует CAS (Compare-And-Swap) — аппаратную инструкцию процессора. Synchronized блокирует поток — он засыпает и ждёт пока замок освободится, что дороже.'
    }
  ]
}
