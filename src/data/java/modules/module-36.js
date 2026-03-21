export default {
  id: 36,
  title: 'Многопоточность: основы',
  description: 'Что такое потоки выполнения, как создавать и запускать Thread, жизненный цикл потока и базовые операции',
  lessons: [
    {
      id: 1,
      title: 'Что такое потоки выполнения?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Поток выполнения (Thread) — это отдельная последовательность команд, которую процессор может выполнять. В одной программе может работать сразу несколько потоков — одновременно.' },
        { type: 'tip', value: 'Представь ресторан. Один повар готовит суп, другой — второе, третий — десерт. Все работают одновременно, и блюда появляются быстрее. Потоки в программе — как повара в ресторане. Каждый делает свою работу параллельно.' },
        { type: 'heading', value: 'Однопоточность vs Многопоточность' },
        { type: 'code', language: 'java', value: '// Однопоточная программа: задачи выполняются по очереди\npublic class Main {\n    public static void main(String[] args) {\n        downloadFile();    // ждём пока загрузится файл (3 секунды)\n        showAnimation();   // только потом показываем анимацию\n        // Пользователь видит зависший экран!\n    }\n}\n\n// Многопоточная: задачи выполняются параллельно\npublic class Main {\n    public static void main(String[] args) {\n        // Запускаем загрузку в отдельном потоке\n        new Thread(() -> downloadFile()).start();\n        // Основной поток сразу показывает анимацию\n        showAnimation(); // Пользователь видит прогресс!\n    }\n}' },
        { type: 'heading', value: 'Где нужна многопоточность?' },
        { type: 'list', items: [
          'Загрузка данных из интернета пока приложение работает',
          'Обработка нескольких запросов на сервере одновременно',
          'Игры: одновременно рисуем картинку, обрабатываем ввод, играем звук',
          'Сложные вычисления — разделить задачу между ядрами процессора'
        ]},
        { type: 'note', value: 'В Java любая программа уже многопоточная! Например, сборщик мусора (GC) работает в отдельном потоке. main() — это главный поток программы.' }
      ]
    },
    {
      id: 2,
      title: 'Класс Thread',
      type: 'theory',
      content: [
        { type: 'text', value: 'Первый способ создать поток — унаследоваться от класса Thread и переопределить метод run().' },
        { type: 'code', language: 'java', value: '// Создаём свой поток — наследуемся от Thread\nclass MyThread extends Thread {\n    private String name;\n\n    MyThread(String name) {\n        this.name = name;\n    }\n\n    @Override\n    public void run() {\n        // Этот код выполняется в отдельном потоке\n        for (int i = 1; i <= 5; i++) {\n            System.out.println(name + " считает: " + i);\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        MyThread t1 = new MyThread("Поток-1");\n        MyThread t2 = new MyThread("Поток-2");\n\n        t1.start(); // запускаем первый поток\n        t2.start(); // запускаем второй поток\n        // Оба работают одновременно!\n    }\n}' },
        { type: 'heading', value: 'Важно: start() vs run()' },
        { type: 'code', language: 'java', value: 'MyThread t = new MyThread("Тест");\n\nt.run();   // НЕПРАВИЛЬНО! Просто вызовет метод в текущем потоке, без параллельности\nt.start(); // ПРАВИЛЬНО! Создаёт новый поток и запускает в нём run()' },
        { type: 'heading', value: 'Методы класса Thread' },
        { type: 'code', language: 'java', value: 'Thread t = new MyThread("Мой");\n\nt.start();                     // запустить поток\nt.getName();                   // получить имя потока\nt.setName("НовоеИмя");        // задать имя\nt.getPriority();               // приоритет (1-10, по умолчанию 5)\nt.isAlive();                   // работает ли поток прямо сейчас?\n\n// Текущий поток\nThread current = Thread.currentThread();\nSystem.out.println("Текущий поток: " + current.getName());\n// В методе main: Текущий поток: main' },
        { type: 'warning', value: 'Класс Thread можно наследовать, но это не всегда хорошая идея — Java не поддерживает множественное наследование. Если твой класс уже наследует что-то другое, используй Runnable (следующий урок).' }
      ]
    },
    {
      id: 3,
      title: 'Интерфейс Runnable',
      type: 'theory',
      content: [
        { type: 'text', value: 'Второй (и предпочтительный) способ создать поток — реализовать интерфейс Runnable. Это просто интерфейс с одним методом run().' },
        { type: 'tip', value: 'Runnable — как инструкция для работника. Thread — как сам работник. Ты пишешь инструкцию (Runnable) отдельно, потом даёшь её работнику (Thread) — он берёт инструкцию и выполняет её.' },
        { type: 'code', language: 'java', value: '// Реализуем Runnable\nclass Counter implements Runnable {\n    private String name;\n\n    Counter(String name) {\n        this.name = name;\n    }\n\n    @Override\n    public void run() {\n        for (int i = 1; i <= 5; i++) {\n            System.out.println(name + ": " + i);\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Runnable task1 = new Counter("Задача 1");\n        Runnable task2 = new Counter("Задача 2");\n\n        Thread t1 = new Thread(task1); // передаём задачу в поток\n        Thread t2 = new Thread(task2);\n\n        t1.start();\n        t2.start();\n    }\n}' },
        { type: 'heading', value: 'Лямбда-выражение для Runnable' },
        { type: 'code', language: 'java', value: '// Самый короткий способ создать поток\nThread t = new Thread(() -> {\n    System.out.println("Привет из нового потока!");\n    for (int i = 0; i < 3; i++) {\n        System.out.println("i = " + i);\n    }\n});\nt.start();' },
        { type: 'heading', value: 'Почему Runnable лучше Thread?' },
        { type: 'list', items: [
          'Отделяет задачу (что делать) от механизма выполнения (как запускать)',
          'Можно наследовать от другого класса и при этом реализовывать Runnable',
          'Один объект Runnable можно запустить в нескольких потоках',
          'Работает с ExecutorService (пул потоков — изучим позже)'
        ]},
        { type: 'note', value: 'Runnable — функциональный интерфейс (один абстрактный метод). Поэтому можно использовать лямбда-выражения и method references.' }
      ]
    },
    {
      id: 4,
      title: 'Жизненный цикл потока',
      type: 'theory',
      content: [
        { type: 'text', value: 'Поток проходит через несколько состояний за время своей жизни. Понимание жизненного цикла помогает писать правильный многопоточный код.' },
        { type: 'heading', value: 'Состояния потока' },
        { type: 'list', items: [
          'NEW — поток создан, но ещё не запущен (Thread t = new Thread(...))',
          'RUNNABLE — поток запущен и готов выполняться (t.start())',
          'BLOCKED — поток ждёт монитора (synchronized блок занят)',
          'WAITING — поток ждёт indefinitely (wait(), join())',
          'TIMED_WAITING — поток ждёт заданное время (sleep(n))',
          'TERMINATED — поток завершил работу'
        ]},
        { type: 'code', language: 'java', value: 'Thread t = new Thread(() -> {\n    try {\n        Thread.sleep(1000);\n    } catch (InterruptedException e) {\n        e.printStackTrace();\n    }\n});\n\nSystem.out.println(t.getState()); // NEW\n\nt.start();\nSystem.out.println(t.getState()); // RUNNABLE или TIMED_WAITING\n\ntry {\n    t.join(); // ждём завершения потока\n} catch (InterruptedException e) {\n    e.printStackTrace();\n}\n\nSystem.out.println(t.getState()); // TERMINATED' },
        { type: 'heading', value: 'Thread.State — перечисление' },
        { type: 'code', language: 'java', value: 'Thread worker = new Thread(() -> doWork());\nworker.start();\n\nThread.State state = worker.getState();\nswitch (state) {\n    case NEW: System.out.println("Ещё не запущен"); break;\n    case RUNNABLE: System.out.println("Работает"); break;\n    case TERMINATED: System.out.println("Завершён"); break;\n    default: System.out.println("Другое состояние: " + state);\n}' },
        { type: 'tip', value: 'Поток нельзя запустить дважды! Если вызвать start() на завершённом потоке — IllegalThreadStateException. Если нужно выполнить задачу ещё раз — создай новый поток.' }
      ]
    },
    {
      id: 5,
      title: 'sleep и join — управление потоками',
      type: 'theory',
      content: [
        { type: 'text', value: 'sleep() и join() — два важных инструмента для управления выполнением потоков.' },
        { type: 'heading', value: 'Thread.sleep() — пауза' },
        { type: 'tip', value: 'sleep() — как будильник. Поток засыпает на заданное время (в миллисекундах), потом просыпается и продолжает работу.' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Начало");\n\n        try {\n            Thread.sleep(2000); // пауза 2 секунды\n        } catch (InterruptedException e) {\n            System.out.println("Поток прервали!");\n        }\n\n        System.out.println("Прошло 2 секунды");\n    }\n}' },
        { type: 'heading', value: 'join() — дождаться другого потока' },
        { type: 'code', language: 'java', value: 'Thread downloader = new Thread(() -> {\n    System.out.println("Скачиваю файл...");\n    try { Thread.sleep(3000); } catch (InterruptedException e) {}\n    System.out.println("Файл скачан!");\n});\n\ndownloader.start();\n\nSystem.out.println("Жду завершения загрузки...");\ntry {\n    downloader.join(); // главный поток ждёт downloader\n} catch (InterruptedException e) {\n    e.printStackTrace();\n}\nSystem.out.println("Теперь обрабатываю файл");\n// Вывод:\n// Жду завершения загрузки...\n// Скачиваю файл...\n// Файл скачан!\n// Теперь обрабатываю файл' },
        { type: 'heading', value: 'join с таймаутом' },
        { type: 'code', language: 'java', value: 'Thread worker = new Thread(() -> {\n    try { Thread.sleep(10000); } catch (InterruptedException e) {}\n});\nworker.start();\n\n// Ждём максимум 2 секунды\ntry {\n    worker.join(2000);\n} catch (InterruptedException e) {}\n\nif (worker.isAlive()) {\n    System.out.println("Поток всё ещё работает, не будем ждать!");\n} else {\n    System.out.println("Поток завершился вовремя");\n}' },
        { type: 'warning', value: 'InterruptedException нельзя игнорировать! Оно сигнализирует о том, что кто-то попросил поток остановиться. Минимум — логируй. Лучше — устанавливай interrupt флаг: Thread.currentThread().interrupt().' }
      ]
    },
    {
      id: 6,
      title: 'Введение в thread safety',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда несколько потоков работают с общими данными одновременно, возникают проблемы. Это называется "состояние гонки" (race condition). Понимание этого — первый шаг к написанию надёжного многопоточного кода.' },
        { type: 'tip', value: 'Представь: два человека одновременно пишут в один документ. Один добавляет слово "привет", другой добавляет "пока". В итоге может получиться "припока" или "ветпри" — что-то непредсказуемое. Это и есть race condition.' },
        { type: 'code', language: 'java', value: '// Опасный код — несколько потоков меняют одну переменную\nclass Counter {\n    int count = 0; // общая переменная!\n\n    void increment() {\n        count++; // НЕ атомарная операция! На самом деле: read -> add 1 -> write\n    }\n}\n\nCounter counter = new Counter();\n\n// Запускаем 1000 потоков, каждый увеличивает на 1\nfor (int i = 0; i < 1000; i++) {\n    new Thread(counter::increment).start();\n}\n\nThread.sleep(1000); // ждём\nSystem.out.println(counter.count);\n// Должно быть 1000, но выведет меньше! (например 987)' },
        { type: 'heading', value: 'Почему это происходит?' },
        { type: 'text', value: 'Операция count++ состоит из трёх шагов: (1) прочитать значение, (2) добавить 1, (3) записать. Два потока могут одновременно прочитать одно значение, оба добавят 1, оба запишут — и мы потеряем одно увеличение.' },
        { type: 'code', language: 'java', value: '// Простое решение — сделать метод synchronized (подробнее в следующем модуле)\nclass SafeCounter {\n    int count = 0;\n\n    synchronized void increment() {\n        count++; // теперь безопасно\n    }\n}' },
        { type: 'list', items: [
          'Thread safety — потокобезопасность — свойство кода работать правильно при выполнении несколькими потоками',
          'Race condition — "состояние гонки" — ошибка, зависящая от порядка выполнения потоков',
          'Atomic operation — атомарная операция — неделимая, выполняется целиком или не выполняется вообще',
          'synchronized, volatile, Atomic-классы — инструменты для обеспечения thread safety'
        ]},
        { type: 'note', value: 'Многопоточные ошибки очень сложно воспроизвести и найти — они проявляются редко и непредсказуемо. Поэтому важно писать правильный код сразу.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: создание и запуск потоков',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай программу с несколькими потоками, работающими параллельно.',
      requirements: [
        'Создай поток с помощью Thread (наследование), который выводит "Поток А: 1", "Поток А: 2", "Поток А: 3" с паузой 100мс между выводами',
        'Создай поток с помощью Runnable (лямбда), который выводит "Поток Б: 1", "Поток Б: 2", "Поток Б: 3" с паузой 100мс',
        'Запусти оба потока и дождись их завершения через join()',
        'После завершения выведи "Оба потока завершены"'
      ],
      expectedOutput: 'Поток А: 1\nПоток Б: 1\nПоток А: 2\nПоток Б: 2\nПоток А: 3\nПоток Б: 3\nОба потока завершены',
      hint: 'Порядок строк может отличаться из-за параллельного выполнения — это нормально! Главное — оба потока вывели все 3 числа. Не забудь try/catch для sleep() и join().',
      solution: 'public class Main {\n\n    static class ThreadA extends Thread {\n        @Override\n        public void run() {\n            for (int i = 1; i <= 3; i++) {\n                System.out.println("Поток А: " + i);\n                try { Thread.sleep(100); } catch (InterruptedException e) { break; }\n            }\n        }\n    }\n\n    public static void main(String[] args) throws InterruptedException {\n        Thread ta = new ThreadA();\n\n        Thread tb = new Thread(() -> {\n            for (int i = 1; i <= 3; i++) {\n                System.out.println("Поток Б: " + i);\n                try { Thread.sleep(100); } catch (InterruptedException e) { break; }\n            }\n        });\n\n        ta.start();\n        tb.start();\n\n        ta.join();\n        tb.join();\n\n        System.out.println("Оба потока завершены");\n    }\n}',
      explanation: 'Обрати внимание: порядок вывода может быть другим каждый раз — это нормальное поведение потоков. join() гарантирует, что "Оба потока завершены" выведется только после завершения обоих потоков. В throws InterruptedException можно не добавлять если обернуть join() в try/catch.'
    },
    {
      id: 8,
      title: 'Практика: загрузчик данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Симулируй параллельную загрузку трёх файлов с отображением прогресса.',
      requirements: [
        'Создай метод simulateDownload(String fileName, int seconds), который выводит "Начало загрузки: fileName", спит seconds*200мс, потом выводит "Загрузка завершена: fileName"',
        'Запусти три потока: "file1.txt" (1 шаг), "photo.jpg" (3 шага), "video.mp4" (2 шага)',
        'Дождись завершения всех трёх через join()',
        'Выведи "Все файлы загружены!"'
      ],
      expectedOutput: 'Начало загрузки: file1.txt\nНачало загрузки: photo.jpg\nНачало загрузки: video.mp4\nЗагрузка завершена: file1.txt\nЗагрузка завершена: video.mp4\nЗагрузка завершена: photo.jpg\nВсе файлы загружены!',
      hint: 'Метод simulateDownload принимает параметры и делает sleep(seconds * 200). Создай Thread с лямбдой: new Thread(() -> simulateDownload("file1.txt", 1)). Храни все потоки в переменных чтобы потом сделать join().',
      solution: 'public class Main {\n    static void simulateDownload(String fileName, int steps) {\n        System.out.println("Начало загрузки: " + fileName);\n        try {\n            Thread.sleep(steps * 200L);\n        } catch (InterruptedException e) {\n            Thread.currentThread().interrupt();\n        }\n        System.out.println("Загрузка завершена: " + fileName);\n    }\n\n    public static void main(String[] args) throws InterruptedException {\n        Thread t1 = new Thread(() -> simulateDownload("file1.txt", 1));\n        Thread t2 = new Thread(() -> simulateDownload("photo.jpg", 3));\n        Thread t3 = new Thread(() -> simulateDownload("video.mp4", 2));\n\n        t1.start();\n        t2.start();\n        t3.start();\n\n        t1.join();\n        t2.join();\n        t3.join();\n\n        System.out.println("Все файлы загружены!");\n    }\n}',
      explanation: 'Все три потока стартуют почти одновременно. Завершаются в порядке времени загрузки: file1.txt (1*200=200мс), video.mp4 (2*200=400мс), photo.jpg (3*200=600мс). join() на каждом потоке гарантирует что финальная строка появится последней. Thread.currentThread().interrupt() — правильная обработка InterruptedException в производственном коде.'
    }
  ]
}
