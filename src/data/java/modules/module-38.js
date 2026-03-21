export default {
  id: 38,
  title: 'ExecutorService и пулы потоков',
  description: 'Как правильно управлять потоками с помощью ExecutorService, Callable, Future и паттернов пулов потоков',
  lessons: [
    {
      id: 1,
      title: 'ExecutorService — пул потоков',
      type: 'theory',
      content: [
        { type: 'text', value: 'Создавать новый Thread для каждой задачи — дорогостоящая операция. ExecutorService — это "пул" (команда) из нескольких заранее созданных потоков, которые берут задачи из очереди и выполняют их.' },
        { type: 'tip', value: 'ExecutorService — как ресторан с официантами. Официанты (потоки) уже на работе. Приходят заказы (задачи), официант берёт заказ, несёт, возвращается, берёт следующий. Не нужно нанимать нового официанта для каждого гостя.' },
        { type: 'code', language: 'java', value: 'import java.util.concurrent.*;\n\n// Создаём пул из 3 потоков\nExecutorService executor = Executors.newFixedThreadPool(3);\n\n// Отправляем 5 задач\nfor (int i = 1; i <= 5; i++) {\n    final int taskNum = i;\n    executor.submit(() -> {\n        System.out.println("Задача " + taskNum + " выполняется потоком: "\n            + Thread.currentThread().getName());\n        try { Thread.sleep(500); } catch (InterruptedException e) {}\n        System.out.println("Задача " + taskNum + " завершена");\n    });\n}\n\n// Останавливаем — новые задачи не принимаются\nexecutor.shutdown();\n// Ждём завершения всех задач (максимум 10 секунд)\nexecutor.awaitTermination(10, TimeUnit.SECONDS);' },
        { type: 'heading', value: 'Почему ExecutorService лучше Thread напрямую?' },
        { type: 'list', items: [
          'Потоки переиспользуются — не тратим время на создание/уничтожение',
          'Контролируем количество параллельных потоков',
          'Удобное управление задачами (Future, Callable)',
          'Простое завершение работы (shutdown)',
          'Встроенная очередь задач'
        ]},
        { type: 'warning', value: 'Всегда вызывай executor.shutdown() когда работа завершена! Иначе JVM не завершится — потоки в пуле продолжают ждать новых задач.' }
      ]
    },
    {
      id: 2,
      title: 'Executors — фабрика пулов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Класс Executors содержит статические методы для создания разных видов пулов потоков под разные задачи.' },
        { type: 'heading', value: 'newFixedThreadPool(n) — фиксированный пул' },
        { type: 'code', language: 'java', value: '// Пул из N потоков — хорошо когда знаешь нагрузку\nExecutorService fixed = Executors.newFixedThreadPool(4);\n// Всегда ровно 4 потока. Лишние задачи ждут в очереди.\n// Обычно N = количество ядер процессора\nint cores = Runtime.getRuntime().availableProcessors();\nExecutorService optimal = Executors.newFixedThreadPool(cores);\nSystem.out.println("Ядер: " + cores);' },
        { type: 'heading', value: 'newSingleThreadExecutor() — один поток' },
        { type: 'code', language: 'java', value: '// Один поток — задачи выполняются строго по очереди\nExecutorService single = Executors.newSingleThreadExecutor();\n\nsingle.submit(() -> System.out.println("Задача 1"));\nsingle.submit(() -> System.out.println("Задача 2"));\nsingle.submit(() -> System.out.println("Задача 3"));\n// Всегда: Задача 1, потом 2, потом 3\nsingle.shutdown();' },
        { type: 'heading', value: 'newCachedThreadPool() — динамический пул' },
        { type: 'code', language: 'java', value: '// Создаёт потоки по мере необходимости\n// Потоки простаивающие 60 сек — удаляются\nExecutorService cached = Executors.newCachedThreadPool();\n// Хорошо для кратких задач с переменной нагрузкой\n// ОПАСНО при большом количестве задач — создаст тысячи потоков!' },
        { type: 'heading', value: 'newScheduledThreadPool() — с расписанием' },
        { type: 'code', language: 'java', value: 'ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);\n\n// Выполнить один раз через 2 секунды\nscheduler.schedule(\n    () -> System.out.println("Отложенная задача!"),\n    2, TimeUnit.SECONDS\n);\n\n// Выполнять каждые 3 секунды, первый раз через 1 секунду\nscheduler.scheduleAtFixedRate(\n    () -> System.out.println("Периодическая задача: " + System.currentTimeMillis()),\n    1, 3, TimeUnit.SECONDS\n);\n\nThread.sleep(10000);\nscheduler.shutdown();' },
        { type: 'tip', value: 'Для большинства приложений newFixedThreadPool(N) — лучший выбор. N = количество ядер процессора для CPU-интенсивных задач, или N = 2-4 * cores для I/O задач (сеть, файлы).' }
      ]
    },
    {
      id: 3,
      title: 'Future — результат асинхронной задачи',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда ты отправляешь задачу в ExecutorService, получаешь обратно Future — "обещание" результата. Future позволяет узнать когда задача завершилась и получить её результат.' },
        { type: 'tip', value: 'Future — как квиток в химчистке. Ты сдаёшь одежду (отправляешь задачу) и получаешь квиток (Future). Позже приходишь с квитком и забираешь готовую одежду (вызываешь future.get()). Можно проверить готово ли (isDone()) не ходя в химчистку.' },
        { type: 'code', language: 'java', value: 'ExecutorService executor = Executors.newFixedThreadPool(2);\n\n// submit() возвращает Future\nFuture<String> future = executor.submit(() -> {\n    Thread.sleep(2000); // симулируем долгую работу\n    return "Результат вычисления";\n});\n\nSystem.out.println("Задача отправлена, делаем что-то пока ждём...");\n\n// get() блокирует пока результат не будет готов\nString result = future.get(); // ждём до 5 секунд\nSystem.out.println("Получено: " + result);\n\nexecutor.shutdown();' },
        { type: 'heading', value: 'Методы Future' },
        { type: 'code', language: 'java', value: 'Future<Integer> future = executor.submit(() -> heavyComputation());\n\n// Проверить завершена ли задача (без блокировки)\nif (future.isDone()) {\n    System.out.println("Готово!");\n}\n\n// Получить результат с таймаутом\ntry {\n    Integer result = future.get(3, TimeUnit.SECONDS);\n} catch (TimeoutException e) {\n    System.out.println("Таймаут — отменяем задачу");\n    future.cancel(true); // отменить задачу\n}\n\n// Проверить отменена ли\nSystem.out.println("Отменена: " + future.isCancelled());' },
        { type: 'heading', value: 'Несколько Future параллельно' },
        { type: 'code', language: 'java', value: 'ExecutorService executor = Executors.newFixedThreadPool(3);\n\n// Запускаем 3 задачи параллельно\nFuture<Integer> f1 = executor.submit(() -> { Thread.sleep(1000); return 10; });\nFuture<Integer> f2 = executor.submit(() -> { Thread.sleep(500);  return 20; });\nFuture<Integer> f3 = executor.submit(() -> { Thread.sleep(1500); return 30; });\n\n// Ждём все три и суммируем\nint total = f1.get() + f2.get() + f3.get();\nSystem.out.println("Сумма: " + total); // 60\nexecutor.shutdown();' },
        { type: 'note', value: 'future.get() может бросить ExecutionException если задача завершилась с исключением. Всегда обрабатывай это.' }
      ]
    },
    {
      id: 4,
      title: 'Callable — задача с результатом',
      type: 'theory',
      content: [
        { type: 'text', value: 'Callable — это как Runnable, но может возвращать результат и бросать проверяемые исключения. Используется вместе с Future.' },
        { type: 'code', language: 'java', value: 'import java.util.concurrent.Callable;\n\n// Callable<V> — V это тип возвращаемого значения\nCallable<Integer> sumTask = () -> {\n    int sum = 0;\n    for (int i = 1; i <= 100; i++) sum += i;\n    return sum; // 5050\n};\n\nExecutorService executor = Executors.newSingleThreadExecutor();\nFuture<Integer> future = executor.submit(sumTask);\n\nInteger result = future.get();\nSystem.out.println("Сумма 1..100 = " + result); // 5050\nexecutor.shutdown();' },
        { type: 'heading', value: 'Callable vs Runnable' },
        { type: 'code', language: 'java', value: '// Runnable — не возвращает результат, не бросает исключения\nRunnable r = () -> System.out.println("Готово");\n\n// Callable — возвращает результат и может бросить Exception\nCallable<String> c = () -> {\n    if (Math.random() > 0.5) throw new Exception("Ошибка!");\n    return "Успех";\n};' },
        { type: 'heading', value: 'invokeAll — запустить все и дождаться' },
        { type: 'code', language: 'java', value: 'ExecutorService executor = Executors.newFixedThreadPool(3);\n\nList<Callable<String>> tasks = Arrays.asList(\n    () -> { Thread.sleep(1000); return "Задача 1"; },\n    () -> { Thread.sleep(500);  return "Задача 2"; },\n    () -> { Thread.sleep(800);  return "Задача 3"; }\n);\n\n// invokeAll ждёт завершения ВСЕХ задач\nList<Future<String>> futures = executor.invokeAll(tasks);\n\nfor (Future<String> f : futures) {\n    System.out.println(f.get()); // Задача 1, Задача 2, Задача 3\n}\nexecutor.shutdown();' },
        { type: 'heading', value: 'invokeAny — вернуть первый результат' },
        { type: 'code', language: 'java', value: 'List<Callable<String>> searchTasks = Arrays.asList(\n    () -> { Thread.sleep(3000); return "Результат от сервера А"; },\n    () -> { Thread.sleep(1000); return "Результат от сервера Б"; },\n    () -> { Thread.sleep(2000); return "Результат от сервера В"; }\n);\n\n// invokeAny возвращает результат самой быстрой задачи\nString fastest = executor.invokeAny(searchTasks);\nSystem.out.println(fastest); // Результат от сервера Б (пришёл первым)\nexecutor.shutdown();' },
        { type: 'tip', value: 'invokeAll — когда нужны результаты всех задач. invokeAny — когда нужен первый готовый результат (например, запрос к нескольким серверам).' }
      ]
    },
    {
      id: 5,
      title: 'Паттерны использования пула потоков',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим практические паттерны использования ExecutorService в реальных приложениях.' },
        { type: 'heading', value: 'Паттерн: правильное завершение' },
        { type: 'code', language: 'java', value: 'ExecutorService executor = Executors.newFixedThreadPool(4);\n\ntry {\n    // отправляем задачи\n    executor.submit(() -> doWork());\n} finally {\n    executor.shutdown(); // больше не принимаем задачи\n    try {\n        // ждём 60 секунд\n        if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {\n            executor.shutdownNow(); // принудительно\n            if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {\n                System.err.println("Пул не завершился!");\n            }\n        }\n    } catch (InterruptedException e) {\n        executor.shutdownNow();\n        Thread.currentThread().interrupt();\n    }\n}' },
        { type: 'heading', value: 'Паттерн: обработка пачки задач' },
        { type: 'code', language: 'java', value: 'List<String> urls = Arrays.asList(\n    "http://site1.com", "http://site2.com", "http://site3.com"\n);\n\nExecutorService executor = Executors.newFixedThreadPool(3);\n\n// Преобразуем список URL в список задач\nList<Future<String>> futures = urls.stream()\n    .map(url -> executor.submit(() -> downloadContent(url)))\n    .collect(Collectors.toList());\n\n// Собираем результаты\nList<String> results = new ArrayList<>();\nfor (Future<String> f : futures) {\n    try {\n        results.add(f.get());\n    } catch (ExecutionException e) {\n        System.err.println("Ошибка загрузки: " + e.getCause().getMessage());\n    }\n}\nexecutor.shutdown();' },
        { type: 'heading', value: 'shutdown vs shutdownNow' },
        { type: 'code', language: 'java', value: '// shutdown() — мягкое завершение\n// Перестаёт принимать новые задачи\n// Ждёт пока выполнятся уже запущенные\nexecutor.shutdown();\n\n// shutdownNow() — жёсткое завершение\n// Пытается прервать выполняющиеся задачи (interrupt)\n// Возвращает список незапущенных задач\nList<Runnable> notStarted = executor.shutdownNow();\nSystem.out.println("Не успели запустить: " + notStarted.size());' },
        { type: 'note', value: 'В реальных приложениях ExecutorService часто создаётся один раз при старте приложения и уничтожается при его остановке, а не для каждой операции отдельно.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: параллельная обработка данных',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реши задачу параллельного вычисления с использованием ExecutorService и Future.',
      requirements: [
        'Создай метод long sumRange(int from, int to) — считает сумму чисел от from до to включительно',
        'Используй ExecutorService с 4 потоками',
        'Разбей диапазон 1..1_000_000 на 4 части: [1..250000], [250001..500000], [500001..750000], [750001..1000000]',
        'Запусти каждую часть как Callable<Long> в отдельном потоке',
        'Собери результаты через Future.get() и сложи',
        'Выведи итоговую сумму (должна быть 500000500000)'
      ],
      expectedOutput: 'Часть 1 (1..250000): 31250125000\nЧасть 2 (250001..500000): 93750375000\nЧасть 3 (500001..750000): 156250625000\nЧасть 4 (750001..1000000): 218750875000\nИтоговая сумма: 500000500000',
      hint: 'sumRange можно написать как: long sum=0; for(int i=from;i<=to;i++) sum+=i; return sum;  Callable<Long> task1 = () -> sumRange(1, 250000); Потом executor.submit(task1) даёт Future<Long>. Важно: в конце executor.shutdown().',
      solution: 'import java.util.concurrent.*;\nimport java.util.*;\n\npublic class Main {\n    static long sumRange(int from, int to) {\n        long sum = 0;\n        for (int i = from; i <= to; i++) sum += i;\n        return sum;\n    }\n\n    public static void main(String[] args) throws Exception {\n        ExecutorService executor = Executors.newFixedThreadPool(4);\n\n        Future<Long> f1 = executor.submit(() -> sumRange(1, 250_000));\n        Future<Long> f2 = executor.submit(() -> sumRange(250_001, 500_000));\n        Future<Long> f3 = executor.submit(() -> sumRange(500_001, 750_000));\n        Future<Long> f4 = executor.submit(() -> sumRange(750_001, 1_000_000));\n\n        long r1 = f1.get();\n        long r2 = f2.get();\n        long r3 = f3.get();\n        long r4 = f4.get();\n\n        System.out.println("Часть 1 (1..250000): " + r1);\n        System.out.println("Часть 2 (250001..500000): " + r2);\n        System.out.println("Часть 3 (500001..750000): " + r3);\n        System.out.println("Часть 4 (750001..1000000): " + r4);\n        System.out.println("Итоговая сумма: " + (r1 + r2 + r3 + r4));\n\n        executor.shutdown();\n    }\n}',
      explanation: 'Это классический паттерн "разделяй и властвуй" (divide and conquer). Задача разбивается на независимые части, каждая часть вычисляется параллельно, потом результаты объединяются. Сумма 1..N = N*(N+1)/2 = 1000000*1000001/2 = 500000500000. Обрати внимание на тип long — int не хватит для такого числа!'
    }
  ]
}
