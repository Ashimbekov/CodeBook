export default {
  id: 32,
  title: 'Лямбда-выражения',
  description: 'Изучаем лямбда-выражения — компактный способ передавать поведение как параметр в Java 8+',
  lessons: [
    {
      id: 1, title: 'Функциональные интерфейсы', type: 'theory',
      content: [
        { type: 'text', value: 'Функциональный интерфейс — это интерфейс с ровно одним абстрактным методом. Именно такие интерфейсы можно заменять лямбда-выражениями.' },
        { type: 'tip', value: 'Представь, что тебе нужно передать "инструкцию" другу: "Когда придёт посылка — позвони мне". Раньше для этого нужно было создать целый класс с методом. Лямбда — это как передать записку с инструкцией напрямую, без лишней бумаги.' },
        { type: 'heading', value: 'Создание функционального интерфейса' },
        { type: 'code', language: 'java', value: '// @FunctionalInterface — аннотация (необязательная, но полезная)\n// Компилятор проверит, что метод ровно один\n@FunctionalInterface\ninterface Greeter {\n    void greet(String name); // единственный абстрактный метод\n}\n\n@FunctionalInterface\ninterface Calculator {\n    int calculate(int a, int b);\n}\n\n@FunctionalInterface\ninterface Checker {\n    boolean check(int number);\n}' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        // Старый способ: анонимный класс\n        Greeter oldGreeter = new Greeter() {\n            @Override\n            public void greet(String name) {\n                System.out.println("Привет, " + name + "!");\n            }\n        };\n\n        // Новый способ: лямбда\n        Greeter newGreeter = name -> System.out.println("Привет, " + name + "!");\n\n        oldGreeter.greet("Иван"); // Привет, Иван!\n        newGreeter.greet("Иван"); // Привет, Иван!\n        // Результат одинаковый, но лямбда в 5 раз короче!\n    }\n}' },
        { type: 'note', value: 'В Java есть готовые функциональные интерфейсы в пакете java.util.function: Predicate, Function, Consumer, Supplier и другие. Тебе не нужно создавать свои для большинства задач.' }
      ]
    },
    {
      id: 2, title: 'Синтаксис лямбда-выражений', type: 'theory',
      content: [
        { type: 'text', value: 'Лямбда-выражение — это анонимная функция. Она состоит из параметров, стрелки -> и тела.' },
        { type: 'heading', value: 'Варианты синтаксиса' },
        { type: 'code', language: 'java', value: '// Базовый синтаксис:\n// (параметры) -> тело\n\n// 1. Без параметров:\nRunnable r = () -> System.out.println("Запущено!");\n\n// 2. Один параметр (скобки необязательны):\nGreeter g1 = (name) -> System.out.println("Привет, " + name);\nGreeter g2 = name -> System.out.println("Привет, " + name); // короче\n\n// 3. Несколько параметров:\nCalculator add = (a, b) -> a + b;\n\n// 4. Тело из нескольких строк — нужны фигурные скобки и return:\nCalculator multiply = (a, b) -> {\n    System.out.println("Умножаем " + a + " на " + b);\n    return a * b;\n};\n\n// 5. Один оператор — return не нужен (неявный return):\nCalculator subtract = (a, b) -> a - b;\n\nSystem.out.println(add.calculate(5, 3));      // 8\nSystem.out.println(multiply.calculate(4, 6)); // 24\nSystem.out.println(subtract.calculate(10, 4)); // 6' },
        { type: 'heading', value: 'Лямбды в коллекциях' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\n\nArrayList<String> names = new ArrayList<>();\nnames.add("Анна"); names.add("Борис"); names.add("Виктор");\n\n// forEach принимает Consumer<T> — лямбду с одним параметром\nnames.forEach(name -> System.out.println("Имя: " + name));\n\n// Сортировка через лямбду-компаратор\nnames.sort((a, b) -> a.compareTo(b)); // по алфавиту\nnames.sort((a, b) -> b.compareTo(a)); // в обратном порядке\n\nSystem.out.println(names);' }
      ]
    },
    {
      id: 3, title: 'Predicate — проверка условия', type: 'theory',
      content: [
        { type: 'text', value: 'Predicate<T> — функциональный интерфейс, который принимает объект типа T и возвращает boolean. Используется для фильтрации и проверок.' },
        { type: 'code', language: 'java', value: 'import java.util.function.Predicate;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Predicate: принимает T, возвращает boolean\n        Predicate<Integer> isEven = n -> n % 2 == 0;\n        Predicate<String> isLong = s -> s.length() > 5;\n        Predicate<Integer> isPositive = n -> n > 0;\n\n        System.out.println(isEven.test(4));    // true\n        System.out.println(isEven.test(7));    // false\n        System.out.println(isLong.test("Привет"));   // false (6 букв — нет, ровно 6)\n        System.out.println(isLong.test("Программирование")); // true\n    }\n}' },
        { type: 'heading', value: 'Комбинирование Predicate' },
        { type: 'code', language: 'java', value: 'Predicate<Integer> isEven = n -> n % 2 == 0;\nPredicate<Integer> isPositive = n -> n > 0;\n\n// and: оба условия должны выполняться\nPredicate<Integer> isEvenAndPositive = isEven.and(isPositive);\nSystem.out.println(isEvenAndPositive.test(4));  // true\nSystem.out.println(isEvenAndPositive.test(-4)); // false\n\n// or: хотя бы одно условие\nPredicate<Integer> isEvenOrPositive = isEven.or(isPositive);\nSystem.out.println(isEvenOrPositive.test(3));  // true (положительное)\n\n// negate: обратное условие\nPredicate<Integer> isOdd = isEven.negate();\nSystem.out.println(isOdd.test(3)); // true' },
        { type: 'heading', value: 'Фильтрация списка через Predicate' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\nimport java.util.List;\nimport java.util.function.Predicate;\n\npublic static List<Integer> filter(List<Integer> list, Predicate<Integer> pred) {\n    List<Integer> result = new ArrayList<>();\n    for (int n : list) {\n        if (pred.test(n)) result.add(n);\n    }\n    return result;\n}\n\nList<Integer> numbers = new ArrayList<>();\nnumbers.add(1); numbers.add(2); numbers.add(3); numbers.add(4); numbers.add(5); numbers.add(6);\n\nList<Integer> evens = filter(numbers, n -> n % 2 == 0);\nList<Integer> bigOnes = filter(numbers, n -> n > 3);\n\nSystem.out.println("Чётные: " + evens);    // [2, 4, 6]\nSystem.out.println("Большие: " + bigOnes); // [4, 5, 6]' }
      ]
    },
    {
      id: 4, title: 'Function, Consumer, Supplier', type: 'theory',
      content: [
        { type: 'text', value: 'Java предоставляет набор готовых функциональных интерфейсов для разных сценариев.' },
        { type: 'heading', value: 'Function<T, R> — преобразование' },
        { type: 'code', language: 'java', value: 'import java.util.function.Function;\n\n// Function<T, R>: принимает T, возвращает R\nFunction<String, Integer> length = s -> s.length();\nFunction<Integer, String> toStr = n -> "Число: " + n;\nFunction<String, String> toUpper = s -> s.toUpperCase();\n\nSystem.out.println(length.apply("Привет"));  // 6\nSystem.out.println(toStr.apply(42));          // Число: 42\nSystem.out.println(toUpper.apply("java"));    // JAVA\n\n// Цепочка функций через andThen\nFunction<String, String> process = toUpper.andThen(s -> s + "!");\nSystem.out.println(process.apply("java")); // JAVA!' },
        { type: 'heading', value: 'Consumer<T> — потребитель (без возврата)' },
        { type: 'code', language: 'java', value: 'import java.util.function.Consumer;\n\n// Consumer<T>: принимает T, ничего не возвращает\nConsumer<String> print = s -> System.out.println("Вывод: " + s);\nConsumer<Integer> printSquare = n -> System.out.println(n + "^2 = " + (n * n));\n\nprint.accept("Привет");   // Вывод: Привет\nprintSquare.accept(5);    // 5^2 = 25\n\n// forEach использует Consumer!\nimport java.util.List;\nList.of("Java", "Python", "Go").forEach(print);' },
        { type: 'heading', value: 'Supplier<T> — поставщик (без параметров)' },
        { type: 'code', language: 'java', value: 'import java.util.function.Supplier;\nimport java.util.Random;\n\n// Supplier<T>: не принимает ничего, возвращает T\nSupplier<String> greeting = () -> "Привет, мир!";\nSupplier<Double> randomNum = () -> Math.random();\nSupplier<Integer> diceRoll = () -> new Random().nextInt(6) + 1;\n\nSystem.out.println(greeting.get());   // Привет, мир!\nSystem.out.println(randomNum.get());  // случайное число\nSystem.out.println(diceRoll.get());   // 1-6\nSystem.out.println(diceRoll.get());   // снова 1-6' },
        { type: 'note', value: 'Запомни: Consumer "потребляет" (принимает, не возвращает), Supplier "поставляет" (не принимает, возвращает), Function "преобразует" (принимает и возвращает).' }
      ]
    },
    {
      id: 5, title: 'Ссылки на методы', type: 'theory',
      content: [
        { type: 'text', value: 'Ссылки на методы (method references) — ещё более короткий способ написать лямбду, когда она просто вызывает существующий метод.' },
        { type: 'tip', value: 'Если лямбда просто вызывает один метод — можно написать ссылку на него через ::. Это как сказать "используй этот метод" вместо "вызови этот метод с этим параметром".' },
        { type: 'heading', value: 'Виды ссылок на методы' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\nimport java.util.function.*;\n\npublic class Main {\n    // Статический метод\n    public static int doubleIt(int n) { return n * 2; }\n\n    // Метод экземпляра\n    public void printItem(String s) { System.out.println("-> " + s); }\n\n    public static void main(String[] args) {\n        // 1. Ссылка на статический метод: ClassName::methodName\n        Function<Integer, Integer> f1 = n -> doubleIt(n);\n        Function<Integer, Integer> f2 = Main::doubleIt; // то же самое!\n\n        System.out.println(f2.apply(5)); // 10\n\n        // 2. Ссылка на метод экземпляра через объект\n        Main obj = new Main();\n        Consumer<String> c1 = s -> obj.printItem(s);\n        Consumer<String> c2 = obj::printItem; // то же самое!\n\n        c2.accept("Тест"); // -> Тест\n\n        // 3. Ссылка на метод экземпляра через класс\n        Function<String, String> upper = s -> s.toUpperCase();\n        Function<String, String> upper2 = String::toUpperCase; // то же самое!\n\n        System.out.println(upper2.apply("java")); // JAVA\n\n        // 4. Ссылка на конструктор\n        Supplier<ArrayList> listFactory = () -> new ArrayList();\n        Supplier<ArrayList> listFactory2 = ArrayList::new; // то же самое!\n    }\n}' },
        { type: 'heading', value: 'Практические примеры' },
        { type: 'code', language: 'java', value: 'import java.util.Arrays;\nimport java.util.List;\n\nList<String> names = Arrays.asList("Анна", "Борис", "Виктор");\n\n// Вместо: names.forEach(n -> System.out.println(n))\nnames.forEach(System.out::println);\n\nList<String> words = Arrays.asList("банан", "яблоко", "ёж");\n// Вместо: words.sort((a, b) -> a.compareTo(b))\nwords.sort(String::compareTo);\nSystem.out.println(words);' }
      ]
    },
    {
      id: 6, title: 'Практика: Фильтр и преобразование', type: 'practice', difficulty: 'medium',
      description: 'Используй лямбды и функциональные интерфейсы для обработки списка продуктов.',
      requirements: [
        'Создай список продуктов с именем и ценой',
        'Используй Predicate для фильтрации продуктов дороже 100р',
        'Используй Function для получения списка только названий',
        'Используй Consumer для красивого вывода каждого продукта',
        'Найди самый дорогой продукт используя Comparator-лямбду'
      ],
      expectedOutput: 'Все продукты:\n  Молоко - 80.0р\n  Хлеб - 50.0р\n  Сыр - 250.0р\n  Кефир - 90.0р\n  Масло - 180.0р\n\nДороже 100р:\n  Сыр - 250.0р\n  Масло - 180.0р\n\nНазвания всех продуктов: [Молоко, Хлеб, Сыр, Кефир, Масло]\nСамый дорогой: Сыр - 250.0р',
      hint: 'Создай вспомогательный метод filter(list, predicate). Для получения имён используй цикл с Function.apply().',
      solution: 'import java.util.ArrayList;\nimport java.util.List;\nimport java.util.function.Consumer;\nimport java.util.function.Function;\nimport java.util.function.Predicate;\n\nclass Product {\n    String name;\n    double price;\n    Product(String name, double price) {\n        this.name = name;\n        this.price = price;\n    }\n    public String toString() { return name + " - " + price + "р"; }\n}\n\npublic class Main {\n    static List<Product> filter(List<Product> list, Predicate<Product> pred) {\n        List<Product> result = new ArrayList<>();\n        for (Product p : list) {\n            if (pred.test(p)) result.add(p);\n        }\n        return result;\n    }\n\n    static List<String> transform(List<Product> list, Function<Product, String> func) {\n        List<String> result = new ArrayList<>();\n        for (Product p : list) result.add(func.apply(p));\n        return result;\n    }\n\n    public static void main(String[] args) {\n        List<Product> products = new ArrayList<>();\n        products.add(new Product("Молоко", 80.0));\n        products.add(new Product("Хлеб", 50.0));\n        products.add(new Product("Сыр", 250.0));\n        products.add(new Product("Кефир", 90.0));\n        products.add(new Product("Масло", 180.0));\n\n        Consumer<Product> printer = p -> System.out.println("  " + p);\n\n        System.out.println("Все продукты:");\n        products.forEach(printer);\n\n        Predicate<Product> expensive = p -> p.price > 100;\n        List<Product> expensiveProducts = filter(products, expensive);\n        System.out.println("\\nДороже 100р:");\n        expensiveProducts.forEach(printer);\n\n        Function<Product, String> getName = p -> p.name;\n        List<String> names = transform(products, getName);\n        System.out.println("\\nНазвания всех продуктов: " + names);\n\n        Product mostExpensive = products.get(0);\n        for (Product p : products) {\n            if (p.price > mostExpensive.price) mostExpensive = p;\n        }\n        System.out.println("Самый дорогой: " + mostExpensive);\n    }\n}',
      explanation: 'Функциональные интерфейсы делают код гибким: метод filter() работает с любым Predicate<Product>, а transform() — с любой Function<Product, String>. Это принцип "передачи поведения как параметра" — одна из ключевых идей функционального программирования.'
    },
    {
      id: 7, title: 'Практика: Обработчик событий', type: 'practice', difficulty: 'hard',
      description: 'Создай систему обработки событий, где обработчики задаются через лямбды и ссылки на методы.',
      requirements: [
        'Создай функциональный интерфейс EventHandler с методом handle(String event)',
        'Создай класс EventBus с методами: subscribe(eventType, handler) и publish(eventType, data)',
        'Зарегистрируй несколько обработчиков через лямбды и ссылки на методы',
        'Опубликуй несколько событий и убедись, что обработчики вызываются',
        'Один тип события может иметь несколько обработчиков'
      ],
      expectedOutput: 'Подписались на события...\nПубликуем события:\n[LOGIN] Пользователь вошёл: ivan\n[LOGIN] Логируем: LOGIN -> ivan\n[PURCHASE] Обработка покупки: Ноутбук\n[PURCHASE] Логируем: PURCHASE -> Ноутбук\n[LOGOUT] Пользователь вышел: ivan\n[LOGOUT] Логируем: LOGOUT -> ivan',
      hint: 'EventBus хранит HashMap<String, List<EventHandler>>. subscribe() добавляет обработчик в список, publish() вызывает все обработчики для данного типа.',
      solution: 'import java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.List;\n\n@FunctionalInterface\ninterface EventHandler {\n    void handle(String event);\n}\n\nclass EventBus {\n    private HashMap<String, List<EventHandler>> handlers = new HashMap<>();\n\n    public void subscribe(String eventType, EventHandler handler) {\n        handlers.computeIfAbsent(eventType, k -> new ArrayList<>()).add(handler);\n    }\n\n    public void publish(String eventType, String data) {\n        List<EventHandler> list = handlers.getOrDefault(eventType, new ArrayList<>());\n        for (EventHandler h : list) {\n            System.out.print("[" + eventType + "] ");\n            h.handle(data);\n        }\n    }\n}\n\npublic class Main {\n    static void logEvent(String data) {\n        // этот метод будет использован как ссылка на метод\n        // но нам нужен eventType тоже, поэтому используем лямбду\n    }\n\n    public static void main(String[] args) {\n        EventBus bus = new EventBus();\n\n        System.out.println("Подписались на события...");\n\n        // Лямбды как обработчики\n        bus.subscribe("LOGIN", data -> System.out.println("Пользователь вошёл: " + data));\n        bus.subscribe("LOGIN", data -> System.out.println("Логируем: LOGIN -> " + data));\n\n        bus.subscribe("PURCHASE", data -> System.out.println("Обработка покупки: " + data));\n        bus.subscribe("PURCHASE", data -> System.out.println("Логируем: PURCHASE -> " + data));\n\n        bus.subscribe("LOGOUT", data -> System.out.println("Пользователь вышел: " + data));\n        bus.subscribe("LOGOUT", data -> System.out.println("Логируем: LOGOUT -> " + data));\n\n        System.out.println("Публикуем события:");\n        bus.publish("LOGIN", "ivan");\n        bus.publish("PURCHASE", "Ноутбук");\n        bus.publish("LOGOUT", "ivan");\n    }\n}',
      explanation: 'Система событий — классический паттерн Observer. Лямбды идеально подходят как обработчики: они компактны и могут быть заданы прямо при подписке. computeIfAbsent() создаёт список если его ещё нет. Каждый тип события может иметь сколько угодно обработчиков.'
    }
  ]
}
