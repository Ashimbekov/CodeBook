export default {
  id: 19,
  title: 'Интерфейсы',
  description: 'Интерфейсы как контракты — множественная реализация и гибкий дизайн',
  lessons: [
    {
      id: 1,
      title: 'Что такое интерфейс?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Интерфейс — это контракт. Он описывает, ЧТО должен уметь делать класс, но не КАК. Класс, который "подписывает контракт" (implements), обязан реализовать все методы интерфейса.' },
        { type: 'tip', value: 'Интерфейс — как сертификат. "Сертификат пловца" говорит: ты умеешь плавать. Как именно ты плаваешь (кролем, брассом) — не важно. Главное — умеешь. Класс с implements Swimmer "имеет сертификат" и обязан реализовать метод swim().' },
        { type: 'heading', value: 'Объявление интерфейса' },
        { type: 'code', language: 'java', value: '// Ключевое слово interface\npublic interface Drawable {\n    // Методы интерфейса — автоматически public abstract\n    void draw();\n    void resize(double factor);\n\n    // Константы — автоматически public static final\n    int MAX_SIZE = 1000;\n}\n\n// Класс реализует интерфейс через implements\npublic class Circle implements Drawable {\n    double radius;\n    String color;\n\n    public Circle(double radius, String color) {\n        this.radius = radius;\n        this.color = color;\n    }\n\n    @Override\n    public void draw() {\n        System.out.println("Рисую " + color + " круг радиуса " + radius);\n    }\n\n    @Override\n    public void resize(double factor) {\n        radius *= factor;\n        System.out.println("Новый радиус: " + radius);\n    }\n}\n\npublic class Square implements Drawable {\n    double side;\n\n    public Square(double side) { this.side = side; }\n\n    @Override\n    public void draw() {\n        System.out.println("Рисую квадрат со стороной " + side);\n    }\n\n    @Override\n    public void resize(double factor) {\n        side *= factor;\n        System.out.println("Новая сторона: " + side);\n    }\n}\n\n// Полиморфизм через интерфейс!\nDrawable[] shapes = { new Circle(5, "Синий"), new Square(4) };\nfor (Drawable d : shapes) {\n    d.draw();\n    d.resize(2.0);\n}' },
        { type: 'note', value: 'Интерфейс не может иметь конструктор и не может хранить состояние (обычные поля). Только методы и константы (в классическом понимании).' }
      ]
    },
    {
      id: 2,
      title: 'Реализация нескольких интерфейсов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Java не поддерживает множественное наследование классов, но класс может реализовывать сколько угодно интерфейсов! Это даёт гибкость.' },
        { type: 'tip', value: 'Утка умеет летать, плавать и ходить. Три "сертификата" — три интерфейса: Flyable, Swimmable, Walkable. Утка реализует все три! Один класс, много интерфейсов.' },
        { type: 'code', language: 'java', value: 'public interface Flyable {\n    void fly();\n    default String getTransportType() { return "Воздушный"; }\n}\n\npublic interface Swimmable {\n    void swim();\n}\n\npublic interface Walkable {\n    void walk();\n}\n\n// Duck реализует ТРИ интерфейса!\npublic class Duck implements Flyable, Swimmable, Walkable {\n    String name;\n\n    public Duck(String name) { this.name = name; }\n\n    @Override public void fly() {\n        System.out.println(name + " летит!");\n    }\n\n    @Override public void swim() {\n        System.out.println(name + " плывёт!");\n    }\n\n    @Override public void walk() {\n        System.out.println(name + " ходит вперевалочку");\n    }\n\n    void quack() {\n        System.out.println(name + ": Кря-кря!");\n    }\n}\n\n// Robot реализует два интерфейса\npublic class Robot implements Flyable, Walkable {\n    String model;\n\n    public Robot(String model) { this.model = model; }\n\n    @Override public void fly() {\n        System.out.println("Робот " + model + " активирует ракетный двигатель!");\n    }\n\n    @Override public void walk() {\n        System.out.println("Робот " + model + " шагает на двух ногах");\n    }\n}' },
        { type: 'code', language: 'java', value: 'Duck duck = new Duck("Дональд");\nduck.fly();\nduck.swim();\nduck.walk();\nduck.quack();\n\n// Переменная типа интерфейса!\nFlyable flyer = duck;\nflyer.fly(); // Только методы интерфейса!\n\nSwimmable swimmer = duck;\nswimmer.swim();\n\n// Массив из разных типов, которые умеют летать\nFlyable[] flyers = { duck, new Robot("R2D2") };\nfor (Flyable f : flyers) {\n    f.fly();\n    System.out.println("Тип: " + f.getTransportType());\n}' },
        { type: 'warning', value: 'Если два интерфейса имеют метод с одинаковым именем и сигнатурой, класс должен реализовать его один раз. Если у обоих есть default-метод с одним именем — нужно явно переопределить его в классе.' }
      ]
    },
    {
      id: 3,
      title: 'Default методы в интерфейсах',
      type: 'theory',
      content: [
        { type: 'text', value: 'С Java 8 интерфейсы могут иметь default методы — методы с реализацией. Это позволяет добавлять новые методы в интерфейс без изменения всех классов, которые его реализуют.' },
        { type: 'tip', value: 'Default метод — как дополнение к контракту: "По умолчанию делай вот так, но при желании можешь переопределить". Это как стандартные условия договора — можно оставить как есть или согласовать другие.' },
        { type: 'code', language: 'java', value: 'public interface Logger {\n    // Абстрактный метод — обязателен к реализации\n    void log(String message);\n\n    // Default методы — уже есть реализация!\n    default void logInfo(String message) {\n        log("[INFO] " + message);\n    }\n\n    default void logWarning(String message) {\n        log("[WARNING] " + message);\n    }\n\n    default void logError(String message) {\n        log("[ERROR] " + message);\n    }\n\n    // Static метод в интерфейсе (Java 8+)\n    static Logger createConsoleLogger() {\n        return message -> System.out.println(message); // лямбда\n    }\n}\n\n// Простой класс реализует только log()\npublic class ConsoleLogger implements Logger {\n    @Override\n    public void log(String message) {\n        System.out.println(message);\n    }\n    // logInfo, logWarning, logError достались бесплатно!\n}\n\n// Класс переопределяет один из default методов\npublic class FileLogger implements Logger {\n    String filename;\n\n    public FileLogger(String filename) { this.filename = filename; }\n\n    @Override\n    public void log(String message) {\n        System.out.println("[" + filename + "] " + message);\n    }\n\n    @Override\n    public void logError(String message) {\n        // Своя реализация для ошибок\n        System.out.println("[" + filename + "] !!! ERROR !!! " + message);\n    }\n}\n\nLogger console = new ConsoleLogger();\nconsole.logInfo("Программа запущена");\nconsole.logWarning("Мало памяти");\nconsole.logError("Файл не найден");\n\nLogger file = new FileLogger("app.log");\nfile.logInfo("Запись в файл");\nfile.logError("Критическая ошибка");' }
      ]
    },
    {
      id: 4,
      title: 'Интерфейс vs Абстрактный класс',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда использовать интерфейс, а когда абстрактный класс? Это частый вопрос. Ключевое отличие: абстрактный класс — это "является" (is-a), интерфейс — "умеет" (can-do).' },
        { type: 'heading', value: 'Главные различия' },
        { type: 'list', items: [
          'Класс может implements много интерфейсов, но extends только один класс',
          'Абстрактный класс может иметь поля и конструктор, интерфейс — нет',
          'Методы абстрактного класса могут быть любого доступа, в интерфейсе — public',
          'Абстрактный класс — "является" (Cat is-a Animal), интерфейс — "умеет" (Duck can Fly)'
        ]},
        { type: 'code', language: 'java', value: '// Абстрактный класс — общая природа/тип\npublic abstract class Animal {\n    String name;\n    // Общее поведение + общее состояние\n    public Animal(String name) { this.name = name; }\n    abstract void makeSound();\n    void breathe() { System.out.println(name + " дышит"); }\n}\n\n// Интерфейсы — дополнительные способности\npublic interface Swimmable {\n    void swim();\n}\n\npublic interface Trainable {\n    void learn(String command);\n    void perform(String command);\n}\n\n// Комбинируем!\npublic class Dog extends Animal implements Swimmable, Trainable {\n    public Dog(String name) { super(name); }\n\n    @Override void makeSound() { System.out.println(name + ": Гав!"); }\n    @Override public void swim() { System.out.println(name + " плывёт"); }\n    @Override public void learn(String cmd) { System.out.println(name + " учит: " + cmd); }\n    @Override public void perform(String cmd) { System.out.println(name + " выполняет: " + cmd); }\n}\n\n// Рыба — животное, умеет плавать, но не тренируемая\npublic class Fish extends Animal implements Swimmable {\n    public Fish(String name) { super(name); }\n    @Override void makeSound() { System.out.println(name + ": ..."); }\n    @Override public void swim() { System.out.println(name + " плывёт в воде"); }\n}' },
        { type: 'tip', value: 'Простое правило: если классы имеют общую природу/состояние → абстрактный класс. Если нужно "добавить способность" к разным классам → интерфейс.' }
      ]
    },
    {
      id: 5,
      title: 'Функциональные интерфейсы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функциональный интерфейс — интерфейс с ровно одним абстрактным методом. Они важны для лямбда-выражений (Java 8+). Аннотация @FunctionalInterface проверяет это.' },
        { type: 'code', language: 'java', value: '@FunctionalInterface\npublic interface Calculator {\n    double calculate(double a, double b);\n}\n\n@FunctionalInterface\npublic interface StringProcessor {\n    String process(String input);\n}\n\n@FunctionalInterface\npublic interface Validator<T> {\n    boolean validate(T value);\n}\n\n// Использование с лямбда-выражениями\nCalculator add = (a, b) -> a + b;\nCalculator multiply = (a, b) -> a * b;\nCalculator power = (a, b) -> Math.pow(a, b);\n\nSystem.out.println(add.calculate(5, 3));      // 8.0\nSystem.out.println(multiply.calculate(4, 6));  // 24.0\nSystem.out.println(power.calculate(2, 10));    // 1024.0\n\nStringProcessor upper = s -> s.toUpperCase();\nStringProcessor reverse = s -> new StringBuilder(s).reverse().toString();\n\nSystem.out.println(upper.process("hello"));    // HELLO\nSystem.out.println(reverse.process("Java"));  // avaJ\n\nValidator<Integer> positive = n -> n > 0;\nValidator<String> notEmpty = s -> s != null && !s.isEmpty();\n\nSystem.out.println(positive.validate(5));      // true\nSystem.out.println(positive.validate(-3));     // false\nSystem.out.println(notEmpty.validate("Java")); // true' },
        { type: 'heading', value: 'Встроенные функциональные интерфейсы Java' },
        { type: 'code', language: 'java', value: 'import java.util.function.*;\n\n// Runnable — действие без параметров и результата\nRunnable greet = () -> System.out.println("Привет!");\ngreet.run();\n\n// Predicate<T> — проверяет условие\nPredicate<Integer> isEven = n -> n % 2 == 0;\nSystem.out.println(isEven.test(4)); // true\nSystem.out.println(isEven.test(7)); // false\n\n// Function<T, R> — принимает T, возвращает R\nFunction<String, Integer> strLen = s -> s.length();\nSystem.out.println(strLen.apply("Java")); // 4\n\n// Consumer<T> — принимает T, ничего не возвращает\nConsumer<String> print = s -> System.out.println(">> " + s);\nprint.accept("Привет!"); // >> Привет!' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Интерфейсы животных',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай систему интерфейсов для описания способностей животных.',
      requirements: [
        'Интерфейс Flyable: метод fly()',
        'Интерфейс Swimmable: метод swim()',
        'Интерфейс Runnable: метод run()',
        'Класс Eagle (Орёл): implements Flyable, Runnable',
        'Класс Dolphin (Дельфин): implements Swimmable',
        'Класс Dog: implements Swimmable, Runnable',
        'Метод demonstrateAbilities() принимает Object и проверяет через instanceof'
      ],
      expectedOutput: 'Орёл летит высоко!\nОрёл бежит по земле\nДельфин плывёт в море\nСобака плывёт!\nСобака бежит!',
      hint: 'В demonstrateAbilities() проверяй if (animal instanceof Flyable) { ((Flyable)animal).fly(); } для каждого интерфейса.',
      solution: 'public interface Flyable { void fly(); }\npublic interface Swimmable { void swim(); }\npublic interface Runnable { void run(); }\n\npublic class Eagle implements Flyable, Runnable {\n    @Override public void fly() { System.out.println("Орёл летит высоко!"); }\n    @Override public void run() { System.out.println("Орёл бежит по земле"); }\n}\n\npublic class Dolphin implements Swimmable {\n    @Override public void swim() { System.out.println("Дельфин плывёт в море"); }\n}\n\npublic class Dog implements Swimmable, Runnable {\n    @Override public void swim() { System.out.println("Собака плывёт!"); }\n    @Override public void run() { System.out.println("Собака бежит!"); }\n}\n\npublic class Main {\n    static void demonstrateAbilities(Object animal) {\n        if (animal instanceof Flyable) ((Flyable)animal).fly();\n        if (animal instanceof Swimmable) ((Swimmable)animal).swim();\n        if (animal instanceof Runnable) ((Runnable)animal).run();\n    }\n\n    public static void main(String[] args) {\n        demonstrateAbilities(new Eagle());\n        demonstrateAbilities(new Dolphin());\n        demonstrateAbilities(new Dog());\n    }\n}',
      explanation: 'Интерфейсы позволяют описывать способности независимо от иерархии классов. Орёл, Дельфин и Собака — не связаны иерархией, но у них есть общие способности через интерфейсы. demonstrateAbilities() работает с любым объектом через instanceof.'
    },
    {
      id: 7,
      title: 'Практика: Система сортировки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай интерфейс Sortable и реализуй разные алгоритмы сортировки.',
      requirements: [
        'Интерфейс Sorter с методом sort(int[] array)',
        'Default метод printArray(int[] array) для вывода массива',
        'BubbleSorter implements Sorter — пузырьковая сортировка',
        'SelectionSorter implements Sorter — сортировка выбором',
        'Метод в Main принимает Sorter и массив — сортирует и выводит',
        'Протестируй оба алгоритма'
      ],
      expectedOutput: 'Пузырьковая сортировка:\nДо: [5, 2, 8, 1, 9, 3]\nПосле: [1, 2, 3, 5, 8, 9]\nСортировка выбором:\nДо: [5, 2, 8, 1, 9, 3]\nПосле: [1, 2, 3, 5, 8, 9]',
      hint: 'Пузырьковая: вложенные циклы, меняй соседние элементы если левый > правый. Сортировка выбором: ищи минимум, ставь на нужную позицию.',
      solution: 'public interface Sorter {\n    void sort(int[] array);\n\n    default void printArray(int[] array) {\n        System.out.print("[");\n        for (int i = 0; i < array.length; i++) {\n            System.out.print(array[i]);\n            if (i < array.length - 1) System.out.print(", ");\n        }\n        System.out.println("]");\n    }\n}\n\npublic class BubbleSorter implements Sorter {\n    @Override\n    public void sort(int[] array) {\n        int n = array.length;\n        for (int i = 0; i < n - 1; i++) {\n            for (int j = 0; j < n - i - 1; j++) {\n                if (array[j] > array[j + 1]) {\n                    int temp = array[j];\n                    array[j] = array[j + 1];\n                    array[j + 1] = temp;\n                }\n            }\n        }\n    }\n}\n\npublic class SelectionSorter implements Sorter {\n    @Override\n    public void sort(int[] array) {\n        int n = array.length;\n        for (int i = 0; i < n - 1; i++) {\n            int minIdx = i;\n            for (int j = i + 1; j < n; j++) {\n                if (array[j] < array[minIdx]) minIdx = j;\n            }\n            int temp = array[minIdx];\n            array[minIdx] = array[i];\n            array[i] = temp;\n        }\n    }\n}\n\npublic class Main {\n    static void sortAndPrint(Sorter sorter, int[] data, String name) {\n        System.out.println(name + ":");\n        System.out.print("До: ");\n        sorter.printArray(data);\n        sorter.sort(data);\n        System.out.print("После: ");\n        sorter.printArray(data);\n    }\n\n    public static void main(String[] args) {\n        sortAndPrint(new BubbleSorter(), new int[]{5,2,8,1,9,3}, "Пузырьковая сортировка");\n        sortAndPrint(new SelectionSorter(), new int[]{5,2,8,1,9,3}, "Сортировка выбором");\n    }\n}',
      explanation: 'Интерфейс Sorter — абстракция для любого алгоритма сортировки. Метод sortAndPrint работает с любым объектом Sorter — можно добавить новый алгоритм не меняя этот метод. Default метод printArray переиспользуется обоими классами.'
    }
  ]
}
