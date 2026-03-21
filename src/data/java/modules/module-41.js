export default {
  id: 41,
  title: 'Внутренние и анонимные классы',
  description: 'Inner classes, static nested classes, local classes и anonymous classes — когда и зачем использовать классы внутри классов',
  lessons: [
    {
      id: 1,
      title: 'Внутренние классы (Inner Classes)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Внутренний класс (inner class) — это класс, объявленный внутри другого класса. Он имеет доступ ко всем полям и методам внешнего класса, даже к private.' },
        { type: 'tip', value: 'Представь автомобиль. Внутри автомобиля есть двигатель. Двигатель — это "внутренний класс" автомобиля. Двигатель знает, что он в автомобиле, и может использовать его систему охлаждения, топливо и т.д. Снаружи автомобиля двигатель не существует сам по себе — он привязан к автомобилю.' },
        { type: 'code', language: 'java', value: 'class Outer {\n    private String name = "Внешний";\n    private int value = 42;\n\n    class Inner {\n        void show() {\n            // Inner видит private поля Outer!\n            System.out.println("Я внутренний, внешний: " + name);\n            System.out.println("Значение: " + value);\n        }\n    }\n\n    void createInner() {\n        Inner inner = new Inner(); // создаём внутри внешнего\n        inner.show();\n    }\n}\n\n// Создание внутреннего класса снаружи:\nOuter outer = new Outer();\nOuter.Inner inner = outer.new Inner(); // нужен экземпляр Outer!\ninner.show();' },
        { type: 'heading', value: 'Доступ к внешнему классу' },
        { type: 'code', language: 'java', value: 'class Counter {\n    private int count = 0;\n\n    class Incrementor {\n        void increment(int by) {\n            count += by; // изменяем поле внешнего класса\n        }\n\n        void reset() {\n            count = 0;\n        }\n    }\n\n    class Reporter {\n        void report() {\n            System.out.println("Текущий счёт: " + count);\n        }\n    }\n}\n\nCounter c = new Counter();\nCounter.Incrementor inc = c.new Incrementor();\nCounter.Reporter rep = c.new Reporter();\n\ninc.increment(5);\ninc.increment(3);\nrep.report(); // Текущий счёт: 8' },
        { type: 'warning', value: 'Внутренний класс (не static) требует экземпляра внешнего класса. Нельзя создать Outer.Inner без Outer. Это иногда неудобно.' }
      ]
    },
    {
      id: 2,
      title: 'Статические вложенные классы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Статический вложенный класс (static nested class) объявляется с ключевым словом static. Он НЕ привязан к экземпляру внешнего класса и не имеет доступа к нестатическим полям.' },
        { type: 'tip', value: 'Если обычный inner class — это двигатель в конкретном автомобиле, то static nested class — это чертёж двигателя в технической документации автомобиля. Чертёж принадлежит марке, а не конкретной машине.' },
        { type: 'code', language: 'java', value: 'class University {\n    private static String country = "Казахстан"; // статическое поле\n    private String name;\n\n    University(String name) { this.name = name; }\n\n    // Статический вложенный класс\n    static class Department {\n        String deptName;\n\n        Department(String name) { this.deptName = name; }\n\n        void info() {\n            System.out.println("Кафедра: " + deptName);\n            System.out.println("Страна: " + country); // статическое — можно!\n            // System.out.println(name); // ОШИБКА — нет доступа к нестатическому!\n        }\n    }\n}\n\n// Создаём БЕЗ экземпляра внешнего класса\nUniversity.Department dept = new University.Department("Информатика");\ndept.info();' },
        { type: 'heading', value: 'Паттерн Builder — классический пример' },
        { type: 'code', language: 'java', value: 'class Person {\n    private final String name;\n    private final int age;\n    private final String email;\n\n    private Person(Builder builder) {\n        this.name = builder.name;\n        this.age = builder.age;\n        this.email = builder.email;\n    }\n\n    // Builder — статический вложенный класс\n    static class Builder {\n        private String name;\n        private int age;\n        private String email;\n\n        Builder name(String name) { this.name = name; return this; }\n        Builder age(int age) { this.age = age; return this; }\n        Builder email(String email) { this.email = email; return this; }\n        Person build() { return new Person(this); }\n    }\n\n    public String toString() { return name + ", " + age + ", " + email; }\n}\n\nPerson person = new Person.Builder()\n    .name("Алина")\n    .age(25)\n    .email("alina@example.com")\n    .build();\nSystem.out.println(person); // Алина, 25, alina@example.com' },
        { type: 'note', value: 'static nested class — наиболее часто используемый вид вложенных классов. Паттерн Builder, Entry в HashMap — всё это static nested классы.' }
      ]
    },
    {
      id: 3,
      title: 'Локальные классы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Локальный класс объявляется внутри метода. Он существует только в рамках этого метода и имеет доступ к локальным переменным метода (если они effectively final).' },
        { type: 'code', language: 'java', value: 'class Main {\n    static void greet(String prefix) {\n        // Локальный класс внутри метода\n        class Greeter {\n            void sayHello(String name) {\n                // prefix — effectively final (не меняется после объявления)\n                System.out.println(prefix + ", " + name + "!");\n            }\n        }\n\n        Greeter g = new Greeter();\n        g.sayHello("Алина");\n        g.sayHello("Борис");\n    }\n\n    public static void main(String[] args) {\n        greet("Привет");\n        // Greeter g = new Greeter(); // ОШИБКА — класс недоступен снаружи метода!\n    }\n}' },
        { type: 'heading', value: 'Effectively final' },
        { type: 'code', language: 'java', value: 'void process(int multiplier) {\n    // multiplier не изменяется — effectively final\n    class Processor {\n        int apply(int value) {\n            return value * multiplier; // OK\n        }\n    }\n\n    // multiplier++; // Если добавить это — код выше перестанет компилироваться!\n\n    Processor p = new Processor();\n    System.out.println(p.apply(10)); // 10 * multiplier\n}' },
        { type: 'tip', value: 'Локальные классы редко используются на практике. Обычно анонимный класс или лямбда делают то же самое короче. Локальный класс полезен когда нужно создать несколько объектов одного типа внутри метода.' }
      ]
    },
    {
      id: 4,
      title: 'Анонимные классы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Анонимный класс — это класс без имени, который создаётся и используется в одном месте. Часто используется для реализации интерфейсов или переопределения методов "на месте".' },
        { type: 'tip', value: 'Анонимный класс — как разовый бланк. Вместо того чтобы печатать целый документ с названием, ты пишешь нужное прямо на клочке бумаги. Использовал — выбросил. Имя не нужно, потому что он нужен только здесь и сейчас.' },
        { type: 'code', language: 'java', value: 'interface Greeting {\n    void greet(String name);\n}\n\n// Анонимный класс реализует интерфейс\nGreeting formal = new Greeting() {\n    @Override\n    public void greet(String name) {\n        System.out.println("Добрый день, " + name + "!");\n    }\n};\n\nGreeting casual = new Greeting() {\n    @Override\n    public void greet(String name) {\n        System.out.println("Привет, " + name + "!");\n    }\n};\n\nformal.greet("Нурдаулет");  // Добрый день, Нурдаулет!\ncasual.greet("Нурдаулет");  // Привет, Нурдаулет!' },
        { type: 'heading', value: 'Анонимный класс vs лямбда' },
        { type: 'code', language: 'java', value: '// Сортировка с анонимным классом (старый стиль)\nList<String> names = Arrays.asList("Виктор", "Алина", "Борис");\nCollections.sort(names, new Comparator<String>() {\n    @Override\n    public int compare(String a, String b) {\n        return a.compareTo(b);\n    }\n});\n\n// То же самое с лямбдой (Java 8+)\nCollections.sort(names, (a, b) -> a.compareTo(b));\n\n// Или ещё короче\nnames.sort(String::compareTo);' },
        { type: 'heading', value: 'Анонимный класс расширяет другой класс' },
        { type: 'code', language: 'java', value: 'abstract class Shape {\n    abstract double area();\n    void describe() {\n        System.out.println("Площадь: " + area());\n    }\n}\n\n// Анонимный класс расширяет абстрактный класс\nShape circle = new Shape() {\n    double radius = 5.0;\n\n    @Override\n    double area() {\n        return Math.PI * radius * radius;\n    }\n};\n\ncircle.describe(); // Площадь: 78.53...' },
        { type: 'note', value: 'Анонимный класс может иметь поля и методы, но доступ к ним снаружи ограничен (только через тип родителя). Лямбда-выражения заменяют анонимные классы для функциональных интерфейсов (с одним методом).' }
      ]
    },
    {
      id: 5,
      title: 'Когда использовать каждый вид',
      type: 'theory',
      content: [
        { type: 'text', value: 'У каждого вида вложенных классов есть своя область применения. Выбор правильного вида делает код понятнее.' },
        { type: 'heading', value: 'Когда какой использовать' },
        { type: 'list', items: [
          'static nested class — когда класс логически связан с внешним, но не нуждается в доступе к его экземпляру. Builder, Entry, Node — типичные примеры',
          'inner class (нестатический) — когда класс должен работать с конкретным экземпляром внешнего. Редко нужен в современном коде',
          'local class — крайне редко. Когда нужен именованный класс только внутри метода',
          'anonymous class — для единственной реализации интерфейса/абстрактного класса. В современном Java часто заменяется лямбдой',
          'lambda — для функциональных интерфейсов (один метод). Самый компактный вариант'
        ]},
        { type: 'code', language: 'java', value: '// Пример: реализация Runnable\n\n// 1. Отдельный класс (если используется в нескольких местах)\nclass MyTask implements Runnable {\n    public void run() { System.out.println("Задача"); }\n}\n\n// 2. Анонимный класс (Java 7 и старше)\nnew Thread(new Runnable() {\n    public void run() { System.out.println("Задача"); }\n}).start();\n\n// 3. Лямбда (Java 8+) — предпочтительно\nnew Thread(() -> System.out.println("Задача")).start();' },
        { type: 'heading', value: 'Реальный пример: LinkedList с Node' },
        { type: 'code', language: 'java', value: 'class SimpleLinkedList<T> {\n    // Node — статический вложенный класс\n    // Логически принадлежит LinkedList, но не нужен экземпляр\n    private static class Node<T> {\n        T data;\n        Node<T> next;\n\n        Node(T data) { this.data = data; }\n    }\n\n    private Node<T> head;\n    private int size;\n\n    public void add(T item) {\n        Node<T> newNode = new Node<>(item);\n        if (head == null) {\n            head = newNode;\n        } else {\n            Node<T> current = head;\n            while (current.next != null) current = current.next;\n            current.next = newNode;\n        }\n        size++;\n    }\n\n    public int size() { return size; }\n}' },
        { type: 'tip', value: 'В современном Java (8+) большинство анонимных классов можно заменить лямбдами. Если видишь new Interface() { public ReturnType method(...) {...} } — это кандидат на замену лямбдой.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: вложенные классы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй систему уведомлений с использованием анонимных классов и static nested классов.',
      requirements: [
        'Создай интерфейс Notification с методом send(String message)',
        'Создай класс NotificationService со static nested классом Config (хранит String type и boolean enabled)',
        'Создай метод sendAll(List<Notification> notifications, String message) — вызывает send() у каждого',
        'В main создай Config config = new NotificationService.Config("email", true)',
        'Создай два анонимных класса Notification: Email (выводит "Email: " + message) и SMS (выводит "SMS: " + message)',
        'Вызови sendAll с обоими уведомлениями'
      ],
      expectedOutput: 'Конфиг: email, включён: true\nEmail: Добро пожаловать!\nSMS: Добро пожаловать!',
      hint: 'interface Notification { void send(String message); }. class NotificationService { static class Config { String type; boolean enabled; Config(String t, boolean e){...} } void sendAll(List<Notification> list, String msg){ for(Notification n : list) n.send(msg); } }',
      solution: 'import java.util.*;\n\npublic class Main {\n    interface Notification {\n        void send(String message);\n    }\n\n    static class NotificationService {\n        static class Config {\n            String type;\n            boolean enabled;\n            Config(String type, boolean enabled) {\n                this.type = type;\n                this.enabled = enabled;\n            }\n        }\n\n        void sendAll(List<Notification> notifications, String message) {\n            for (Notification n : notifications) {\n                n.send(message);\n            }\n        }\n    }\n\n    public static void main(String[] args) {\n        NotificationService.Config config = new NotificationService.Config("email", true);\n        System.out.println("Конфиг: " + config.type + ", включён: " + config.enabled);\n\n        Notification email = new Notification() {\n            @Override\n            public void send(String message) {\n                System.out.println("Email: " + message);\n            }\n        };\n\n        Notification sms = new Notification() {\n            @Override\n            public void send(String message) {\n                System.out.println("SMS: " + message);\n            }\n        };\n\n        NotificationService service = new NotificationService();\n        service.sendAll(Arrays.asList(email, sms), "Добро пожаловать!");\n    }\n}',
      explanation: 'Config — static nested, поэтому создаётся как new NotificationService.Config(...) без экземпляра NotificationService. Email и SMS — анонимные классы, реализующие интерфейс Notification. В реальном Java 8+ коде вместо анонимных классов здесь были бы лямбды: Notification email = message -> System.out.println("Email: " + message);'
    }
  ]
}
