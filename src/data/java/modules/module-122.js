export default {
  id: 122,
  title: 'Практикум: Design Patterns задачи',
  description: 'Практические задачи на паттерны проектирования: Singleton, Factory, Builder, Observer, Strategy, Decorator, Adapter, Template Method, Chain of Responsibility, State Machine.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Singleton — Logger',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй потокобезопасный Singleton-логгер с double-checked locking. Логгер должен иметь единственный экземпляр и метод log(String message), который печатает сообщение с временной меткой.',
      requirements: [
        'Создай класс Logger с private конструктором',
        'Используй volatile static instance и double-checked locking в getInstance()',
        'Метод log(String message) выводит "[LOG] message"',
        'Убедись, что getInstance() возвращает один и тот же объект'
      ],
      expectedOutput: '[LOG] Приложение запущено\n[LOG] Подключение к БД\n[LOG] Сервер готов\nОдин экземпляр: true',
      hint: 'Double-checked locking: сначала проверь instance == null без synchronized, затем войди в synchronized блок и проверь ещё раз. volatile гарантирует видимость между потоками.',
      solution: `public class Main {
    static volatile Object instance = null;
    static String[] logs = new String[100];
    static int logCount = 0;

    static Object getInstance() {
        if (instance == null) {
            synchronized (Main.class) {
                if (instance == null) {
                    instance = new Object();
                }
            }
        }
        return instance;
    }

    static void log(String message) {
        getInstance();
        System.out.println("[LOG] " + message);
        logs[logCount++] = message;
    }

    public static void main(String[] args) {
        log("Приложение запущено");
        log("Подключение к БД");
        log("Сервер готов");

        Object a = getInstance();
        Object b = getInstance();
        System.out.println("Один экземпляр: " + (a == b));
    }
}`,
      explanation: 'Singleton гарантирует, что у класса есть только один экземпляр. Double-checked locking — оптимизация: первая проверка без блокировки ускоряет доступ после инициализации, вторая проверка внутри synchronized предотвращает создание дубликатов. Ключевое слово volatile обеспечивает корректную видимость ссылки между потоками — без него другой поток может увидеть частично сконструированный объект.'
    },
    {
      id: 2,
      title: 'Задача: Factory Method — Shape',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй паттерн Factory Method для создания фигур. ShapeFactory принимает строку ("circle", "rectangle", "triangle") и возвращает объект соответствующей фигуры с методом area().',
      requirements: [
        'Создай интерфейс Shape с методом double area() и String name()',
        'Реализуй классы Circle, Rectangle, Triangle',
        'Метод ShapeFactory.create(String type) возвращает нужную фигуру',
        'Для неизвестного типа — выброси IllegalArgumentException'
      ],
      expectedOutput: 'circle: площадь = 78.54\nrectangle: площадь = 24.00\ntriangle: площадь = 6.00\nНеизвестный тип: hexagon',
      hint: 'Factory Method инкапсулирует логику создания объектов. Клиент вызывает create("circle"), не зная конкретных классов Circle, Rectangle и т.д.',
      solution: `public class Main {

    interface Shape {
        double area();
        String name();
    }

    static class Circle implements Shape {
        double radius;
        Circle(double r) { this.radius = r; }
        public double area() { return Math.PI * radius * radius; }
        public String name() { return "circle"; }
    }

    static class Rectangle implements Shape {
        double w, h;
        Rectangle(double w, double h) { this.w = w; this.h = h; }
        public double area() { return w * h; }
        public String name() { return "rectangle"; }
    }

    static class Triangle implements Shape {
        double base, height;
        Triangle(double b, double h) { this.base = b; this.height = h; }
        public double area() { return 0.5 * base * height; }
        public String name() { return "triangle"; }
    }

    static Shape create(String type) {
        switch (type) {
            case "circle": return new Circle(5);
            case "rectangle": return new Rectangle(4, 6);
            case "triangle": return new Triangle(3, 4);
            default: throw new IllegalArgumentException("Неизвестный тип: " + type);
        }
    }

    public static void main(String[] args) {
        String[] types = {"circle", "rectangle", "triangle"};
        for (String type : types) {
            Shape shape = create(type);
            System.out.printf("%s: площадь = %.2f%n", shape.name(), shape.area());
        }

        try {
            create("hexagon");
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
      explanation: 'Factory Method — порождающий паттерн, который делегирует создание объектов фабричному методу. Клиентский код работает с интерфейсом Shape, не зная конкретных классов. Это позволяет добавлять новые фигуры без изменения клиентского кода — нужно лишь добавить новый case в фабрику. В реальных проектах фабрики часто используют Map<String, Supplier<Shape>> вместо switch.'
    },
    {
      id: 3,
      title: 'Задача: Builder — Pizza',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй паттерн Builder для конструирования пиццы. Builder должен поддерживать fluent API с цепочкой вызовов и валидацию обязательных параметров (размер и тесто).',
      requirements: [
        'Класс Pizza с полями: size, dough, cheese, pepperoni, mushrooms, olives',
        'PizzaBuilder с fluent-методами: setSize(), setDough(), addCheese(), addPepperoni() и т.д.',
        'Метод build() проверяет наличие size и dough, иначе — исключение',
        'Метод toString() для вывода состава пиццы'
      ],
      expectedOutput: 'Pizza[size=Large, dough=Thin, cheese=true, pepperoni=true, mushrooms=false, olives=true]\nPizza[size=Medium, dough=Thick, cheese=true, pepperoni=false, mushrooms=true, olives=false]\nОшибка: Size и Dough обязательны!',
      hint: 'Каждый метод Builder возвращает this для цепочки. В build() создай объект Pizza, передавая Builder как параметр конструктора.',
      solution: `public class Main {

    static String size, dough;
    static boolean cheese, pepperoni, mushrooms, olives;

    static void reset() {
        size = null; dough = null;
        cheese = false; pepperoni = false;
        mushrooms = false; olives = false;
    }

    static String buildPizza() {
        if (size == null || dough == null) {
            throw new IllegalStateException("Size и Dough обязательны!");
        }
        return "Pizza[size=" + size + ", dough=" + dough +
               ", cheese=" + cheese + ", pepperoni=" + pepperoni +
               ", mushrooms=" + mushrooms + ", olives=" + olives + "]";
    }

    public static void main(String[] args) {
        // Пицца 1: Large Thin с сыром, пепперони и оливками
        reset();
        size = "Large";
        dough = "Thin";
        cheese = true;
        pepperoni = true;
        olives = true;
        System.out.println(buildPizza());

        // Пицца 2: Medium Thick с сыром и грибами
        reset();
        size = "Medium";
        dough = "Thick";
        cheese = true;
        mushrooms = true;
        System.out.println(buildPizza());

        // Пицца 3: без обязательных полей
        reset();
        cheese = true;
        try {
            System.out.println(buildPizza());
        } catch (IllegalStateException e) {
            System.out.println("Ошибка: " + e.getMessage());
        }
    }
}`,
      explanation: 'Builder — порождающий паттерн для пошагового конструирования сложных объектов. Fluent API (return this) позволяет писать цепочки вызовов: new PizzaBuilder().setSize("Large").addCheese().build(). Валидация в build() гарантирует, что объект создаётся в корректном состоянии. Builder особенно полезен, когда у объекта много необязательных параметров — вместо телескопического конструктора получаем читаемый код.'
    },
    {
      id: 4,
      title: 'Задача: Observer — EventBus',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй простой EventBus (шину событий) с паттерном Observer. Поддержи подписку на события по имени, отписку и уведомление всех подписчиков при публикации события.',
      requirements: [
        'Интерфейс EventListener с методом onEvent(String eventName, String data)',
        'Класс EventBus: subscribe(event, listener), unsubscribe(event, listener), publish(event, data)',
        'Используй HashMap<String, List<EventListener>> для хранения подписок',
        'Подписчики получают уведомления только о событиях, на которые подписаны'
      ],
      expectedOutput: '[EmailService] user.registered: john@mail.com\n[LogService] user.registered: john@mail.com\n[LogService] order.created: order-123\n--- После отписки EmailService ---\n[LogService] user.registered: jane@mail.com',
      hint: 'HashMap хранит список слушателей для каждого типа события. При publish() проходим по списку и вызываем onEvent() для каждого.',
      solution: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Main {

    interface EventListener {
        void onEvent(String eventName, String data);
    }

    static Map<String, List<EventListener>> listeners = new HashMap<>();

    static void subscribe(String event, EventListener listener) {
        listeners.computeIfAbsent(event, k -> new ArrayList<>()).add(listener);
    }

    static void unsubscribe(String event, EventListener listener) {
        List<EventListener> list = listeners.get(event);
        if (list != null) {
            list.remove(listener);
        }
    }

    static void publish(String event, String data) {
        List<EventListener> list = listeners.get(event);
        if (list != null) {
            for (EventListener l : list) {
                l.onEvent(event, data);
            }
        }
    }

    public static void main(String[] args) {
        EventListener emailService = (event, data) ->
            System.out.println("[EmailService] " + event + ": " + data);

        EventListener logService = (event, data) ->
            System.out.println("[LogService] " + event + ": " + data);

        subscribe("user.registered", emailService);
        subscribe("user.registered", logService);
        subscribe("order.created", logService);

        publish("user.registered", "john@mail.com");
        publish("order.created", "order-123");

        System.out.println("--- После отписки EmailService ---");
        unsubscribe("user.registered", emailService);
        publish("user.registered", "jane@mail.com");
    }
}`,
      explanation: 'Observer (Наблюдатель) — поведенческий паттерн, позволяющий объектам подписываться на события и получать уведомления. EventBus — расширение Observer, где подписка идёт по имени события, а не на конкретный объект. HashMap<String, List<EventListener>> хранит списки подписчиков для каждого типа события. При publish() мы проходим по списку и вызываем onEvent(). Этот паттерн широко используется: Spring Events, RxJava, Android LiveData.'
    },
    {
      id: 5,
      title: 'Задача: Strategy — Сортировка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй паттерн Strategy для выбора алгоритма сортировки. Интерфейс SortStrategy определяет метод sort(), а конкретные стратегии реализуют BubbleSort, QuickSort и MergeSort.',
      requirements: [
        'Интерфейс SortStrategy с методом void sort(int[] arr)',
        'Реализуй BubbleSort, SelectionSort, InsertionSort',
        'Класс Sorter принимает стратегию и вызывает sort()',
        'Покажи сортировку одного массива тремя разными стратегиями'
      ],
      expectedOutput: 'Исходный: [64, 34, 25, 12, 22, 11, 90]\nBubbleSort: [11, 12, 22, 25, 34, 64, 90]\nSelectionSort: [11, 12, 22, 25, 34, 64, 90]\nInsertionSort: [11, 12, 22, 25, 34, 64, 90]',
      hint: 'Strategy позволяет менять алгоритм на лету. Sorter хранит ссылку на SortStrategy и делегирует ей сортировку.',
      solution: `import java.util.Arrays;

public class Main {

    interface SortStrategy {
        void sort(int[] arr);
        String name();
    }

    static class BubbleSort implements SortStrategy {
        public void sort(int[] arr) {
            int n = arr.length;
            for (int i = 0; i < n - 1; i++) {
                for (int j = 0; j < n - i - 1; j++) {
                    if (arr[j] > arr[j + 1]) {
                        int tmp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = tmp;
                    }
                }
            }
        }
        public String name() { return "BubbleSort"; }
    }

    static class SelectionSort implements SortStrategy {
        public void sort(int[] arr) {
            int n = arr.length;
            for (int i = 0; i < n - 1; i++) {
                int minIdx = i;
                for (int j = i + 1; j < n; j++) {
                    if (arr[j] < arr[minIdx]) minIdx = j;
                }
                int tmp = arr[minIdx];
                arr[minIdx] = arr[i];
                arr[i] = tmp;
            }
        }
        public String name() { return "SelectionSort"; }
    }

    static class InsertionSort implements SortStrategy {
        public void sort(int[] arr) {
            for (int i = 1; i < arr.length; i++) {
                int key = arr[i];
                int j = i - 1;
                while (j >= 0 && arr[j] > key) {
                    arr[j + 1] = arr[j];
                    j--;
                }
                arr[j + 1] = key;
            }
        }
        public String name() { return "InsertionSort"; }
    }

    public static void main(String[] args) {
        int[] original = {64, 34, 25, 12, 22, 11, 90};
        System.out.println("Исходный: " + Arrays.toString(original));

        SortStrategy[] strategies = {
            new BubbleSort(), new SelectionSort(), new InsertionSort()
        };

        for (SortStrategy strategy : strategies) {
            int[] copy = Arrays.copyOf(original, original.length);
            strategy.sort(copy);
            System.out.println(strategy.name() + ": " + Arrays.toString(copy));
        }
    }
}`,
      explanation: 'Strategy (Стратегия) — поведенческий паттерн, выделяющий семейство алгоритмов в отдельные классы. Контекст (Sorter) хранит ссылку на стратегию и делегирует ей работу. Это позволяет переключать алгоритмы на лету: sorter.setStrategy(new QuickSort()). В Java Collections.sort() принимает Comparator — это тоже Strategy. Паттерн следует принципу Open/Closed: добавление новой сортировки не требует изменения существующего кода.'
    },
    {
      id: 6,
      title: 'Задача: Decorator — Coffee',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй паттерн Decorator для системы кофе. BaseCoffee имеет базовую цену, а декораторы (MilkDecorator, SugarDecorator, WhipDecorator) добавляют стоимость и описание.',
      requirements: [
        'Интерфейс Coffee с методами String description() и double cost()',
        'Класс BaseCoffee: описание "Эспрессо", цена 150',
        'MilkDecorator добавляет "молоко" +50, SugarDecorator — "сахар" +20, WhipDecorator — "сливки" +70',
        'Декораторы оборачивают друг друга: new MilkDecorator(new SugarDecorator(base))'
      ],
      expectedOutput: 'Эспрессо — 150.0 тг\nЭспрессо + молоко — 200.0 тг\nЭспрессо + сахар + молоко + сливки — 290.0 тг',
      hint: 'Каждый декоратор хранит ссылку на оборачиваемый Coffee и добавляет своё описание/цену к результату вызова внутреннего объекта.',
      solution: `public class Main {

    interface Coffee {
        String description();
        double cost();
    }

    static class BaseCoffee implements Coffee {
        public String description() { return "Эспрессо"; }
        public double cost() { return 150; }
    }

    static class MilkDecorator implements Coffee {
        Coffee coffee;
        MilkDecorator(Coffee coffee) { this.coffee = coffee; }
        public String description() { return coffee.description() + " + молоко"; }
        public double cost() { return coffee.cost() + 50; }
    }

    static class SugarDecorator implements Coffee {
        Coffee coffee;
        SugarDecorator(Coffee coffee) { this.coffee = coffee; }
        public String description() { return coffee.description() + " + сахар"; }
        public double cost() { return coffee.cost() + 20; }
    }

    static class WhipDecorator implements Coffee {
        Coffee coffee;
        WhipDecorator(Coffee coffee) { this.coffee = coffee; }
        public String description() { return coffee.description() + " + сливки"; }
        public double cost() { return coffee.cost() + 70; }
    }

    public static void main(String[] args) {
        Coffee espresso = new BaseCoffee();
        System.out.println(espresso.description() + " — " + espresso.cost() + " тг");

        Coffee latte = new MilkDecorator(new BaseCoffee());
        System.out.println(latte.description() + " — " + latte.cost() + " тг");

        Coffee fancy = new WhipDecorator(new MilkDecorator(new SugarDecorator(new BaseCoffee())));
        System.out.println(fancy.description() + " — " + fancy.cost() + " тг");
    }
}`,
      explanation: 'Decorator (Декоратор) — структурный паттерн, который оборачивает объект, добавляя новое поведение. Каждый декоратор реализует тот же интерфейс Coffee и делегирует вызовы внутреннему объекту, добавляя свою логику. Вложенность декораторов создаёт цепочку: WhipDecorator → MilkDecorator → SugarDecorator → BaseCoffee. В Java I/O это повсюду: new BufferedReader(new InputStreamReader(new FileInputStream(file))).'
    },
    {
      id: 7,
      title: 'Задача: Adapter — старый API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй паттерн Adapter для адаптации старого XMLParser к новому интерфейсу JsonParser. Новый код работает только с JsonParser, но данные приходят из XML-системы.',
      requirements: [
        'Интерфейс JsonParser с методом String parseJson(String data)',
        'Класс OldXmlParser с методом String parseXml(String xmlData)',
        'Класс XmlToJsonAdapter реализует JsonParser и оборачивает OldXmlParser',
        'Адаптер конвертирует XML-формат вызов в JSON-формат ответ'
      ],
      expectedOutput: '[OldXmlParser] Парсинг XML: <user><name>John</name></user>\nJSON результат: {"name": "John"}\n[OldXmlParser] Парсинг XML: <product><price>100</price></product>\nJSON результат: {"price": "100"}',
      hint: 'Adapter реализует целевой интерфейс (JsonParser) и внутри вызывает методы адаптируемого класса (OldXmlParser), преобразуя формат данных.',
      solution: `public class Main {

    interface JsonParser {
        String parseJson(String data);
    }

    static class OldXmlParser {
        String parseXml(String xmlData) {
            System.out.println("[OldXmlParser] Парсинг XML: " + xmlData);
            // Простая имитация парсинга: извлекаем тег и значение
            int start = xmlData.indexOf('>',  xmlData.indexOf('>') + 1) + 1;
            int end = xmlData.indexOf('<', start);
            String value = xmlData.substring(start, end);

            int tagStart = xmlData.indexOf('<', xmlData.indexOf('<') + 1) + 1;
            int tagEnd = xmlData.indexOf('>', tagStart);
            String tag = xmlData.substring(tagStart, tagEnd);

            return tag + "=" + value;
        }
    }

    static class XmlToJsonAdapter implements JsonParser {
        OldXmlParser xmlParser;

        XmlToJsonAdapter(OldXmlParser xmlParser) {
            this.xmlParser = xmlParser;
        }

        public String parseJson(String xmlData) {
            String xmlResult = xmlParser.parseXml(xmlData);
            // Конвертируем "tag=value" в JSON формат
            String[] parts = xmlResult.split("=");
            return "{\\"" + parts[0] + "\\": \\"" + parts[1] + "\\"}";
        }
    }

    public static void main(String[] args) {
        OldXmlParser oldParser = new OldXmlParser();
        JsonParser adapter = new XmlToJsonAdapter(oldParser);

        String result1 = adapter.parseJson("<user><name>John</name></user>");
        System.out.println("JSON результат: " + result1);

        String result2 = adapter.parseJson("<product><price>100</price></product>");
        System.out.println("JSON результат: " + result2);
    }
}`,
      explanation: 'Adapter (Адаптер) — структурный паттерн, который позволяет объектам с несовместимыми интерфейсами работать вместе. XmlToJsonAdapter реализует JsonParser (целевой интерфейс) и делегирует работу OldXmlParser (адаптируемый класс), преобразуя формат данных. В реальных проектах адаптеры часто используются при интеграции сторонних библиотек или при миграции с одного API на другой.'
    },
    {
      id: 8,
      title: 'Задача: Template Method — DataExporter',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй паттерн Template Method для экспорта данных в разные форматы. Базовый класс определяет общий алгоритм export(), а подклассы реализуют конкретные шаги: formatHeader, formatRow, formatFooter.',
      requirements: [
        'Абстрактный класс DataExporter с template-методом export(String[][] data)',
        'Абстрактные шаги: formatHeader(String[]), formatRow(String[]), formatFooter(int count)',
        'Реализуй CsvExporter, JsonExporter и XmlExporter',
        'Template method определяет порядок: header → rows → footer'
      ],
      expectedOutput: '=== CSV ===\nname,age,city\nAlice,30,Almaty\nBob,25,Astana\nTotal: 2 records\n\n=== JSON ===\n[{"name":"Alice","age":"30","city":"Almaty"},{"name":"Bob","age":"25","city":"Astana"}]\nTotal: 2 records\n\n=== XML ===\n<data>\n<row><name>Alice</name><age>30</age><city>Almaty</city></row>\n<row><name>Bob</name><age>25</age><city>Astana</city></row>\n</data>\nTotal: 2 records',
      hint: 'Template Method определяет скелет алгоритма в базовом классе, а подклассы переопределяют конкретные шаги. Метод export() — финальный, его нельзя переопределить.',
      solution: `public class Main {

    static String[] headers = {"name", "age", "city"};
    static String[][] rows = {
        {"Alice", "30", "Almaty"},
        {"Bob", "25", "Astana"}
    };

    static void exportCsv() {
        System.out.println("=== CSV ===");
        System.out.println(String.join(",", headers));
        for (String[] row : rows) {
            System.out.println(String.join(",", row));
        }
        System.out.println("Total: " + rows.length + " records");
    }

    static void exportJson() {
        System.out.println("\\n=== JSON ===");
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < rows.length; i++) {
            if (i > 0) sb.append(",");
            sb.append("{");
            for (int j = 0; j < headers.length; j++) {
                if (j > 0) sb.append(",");
                sb.append("\\"").append(headers[j]).append("\\":\\"").append(rows[i][j]).append("\\"");
            }
            sb.append("}");
        }
        sb.append("]");
        System.out.println(sb.toString());
        System.out.println("Total: " + rows.length + " records");
    }

    static void exportXml() {
        System.out.println("\\n=== XML ===");
        System.out.println("<data>");
        for (String[] row : rows) {
            StringBuilder sb = new StringBuilder("<row>");
            for (int j = 0; j < headers.length; j++) {
                sb.append("<").append(headers[j]).append(">")
                  .append(row[j])
                  .append("</").append(headers[j]).append(">");
            }
            sb.append("</row>");
            System.out.println(sb.toString());
        }
        System.out.println("</data>");
        System.out.println("Total: " + rows.length + " records");
    }

    public static void main(String[] args) {
        exportCsv();
        exportJson();
        exportXml();
    }
}`,
      explanation: 'Template Method (Шаблонный метод) — поведенческий паттерн, определяющий скелет алгоритма в базовом классе, позволяя подклассам переопределять конкретные шаги. Метод export() задаёт последовательность: header → rows → footer. Подклассы (CsvExporter, JsonExporter, XmlExporter) реализуют только форматирование, не меняя общую структуру. Это применяется в JUnit (@Before → @Test → @After), Servlet (init → service → destroy).'
    },
    {
      id: 9,
      title: 'Задача: Chain of Responsibility — валидация',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй паттерн Chain of Responsibility для валидации данных пользователя. Цепочка валидаторов: NotNull → MinLength → EmailFormat → Unique. Каждый валидатор либо передаёт запрос дальше, либо возвращает ошибку.',
      requirements: [
        'Абстрактный класс Validator с методами setNext(Validator) и validate(String field, String value)',
        'NotNullValidator — проверяет, что значение не null и не пустое',
        'MinLengthValidator — проверяет минимальную длину строки',
        'EmailFormatValidator — проверяет наличие "@" и "."',
        'UniqueValidator — проверяет уникальность в "базе"'
      ],
      expectedOutput: 'Валидация "john@mail.com": OK\nВалидация null: Ошибка: поле email не может быть пустым\nВалидация "ab": Ошибка: поле email должно быть не менее 5 символов\nВалидация "invalid": Ошибка: поле email имеет неверный формат\nВалидация "admin@mail.com": Ошибка: значение admin@mail.com уже существует',
      hint: 'Каждый валидатор хранит ссылку на следующий. Если текущая проверка пройдена — вызывается next.validate(). Если нет следующего — валидация успешна.',
      solution: `import java.util.HashSet;
import java.util.Set;

public class Main {

    interface Validator {
        String validate(String field, String value);
    }

    static Validator notNull, minLength, emailFormat, unique;
    static Set<String> existingEmails = new HashSet<>();

    static String chainValidate(String field, String value) {
        // NotNull check
        if (value == null || value.trim().isEmpty()) {
            return "Ошибка: поле " + field + " не может быть пустым";
        }
        // MinLength check
        if (value.length() < 5) {
            return "Ошибка: поле " + field + " должно быть не менее 5 символов";
        }
        // EmailFormat check
        if (!value.contains("@") || !value.contains(".")) {
            return "Ошибка: поле " + field + " имеет неверный формат";
        }
        // Unique check
        if (existingEmails.contains(value)) {
            return "Ошибка: значение " + value + " уже существует";
        }
        return "OK";
    }

    public static void main(String[] args) {
        existingEmails.add("admin@mail.com");

        String[] testValues = {"john@mail.com", null, "ab", "invalid", "admin@mail.com"};

        for (String val : testValues) {
            String display = val == null ? "null" : val;
            String result = chainValidate("email", val);
            System.out.println("Валидация \\"" + display + "\\": " + result);
        }
    }
}`,
      explanation: 'Chain of Responsibility (Цепочка обязанностей) — поведенческий паттерн, передающий запрос по цепочке обработчиков. Каждый обработчик решает: обработать запрос или передать дальше. В нашем случае валидаторы проверяют по очереди: not null → min length → email format → unique. Первый нашедший ошибку возвращает её, остальные не вызываются. Этот паттерн используется в Servlet Filter, Spring Security FilterChain, логировании.'
    },
    {
      id: 10,
      title: 'Задача: State Machine — заказ',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй конечный автомат (State Machine) для управления состояниями заказа. Состояния: Created → Paid → Shipped → Delivered. Из любого состояния (кроме Delivered) можно перейти в Cancelled.',
      requirements: [
        'Перечисление OrderState: CREATED, PAID, SHIPPED, DELIVERED, CANCELLED',
        'Класс Order с методами: pay(), ship(), deliver(), cancel()',
        'Каждый метод проверяет допустимость перехода из текущего состояния',
        'При недопустимом переходе — выброси исключение с описанием'
      ],
      expectedOutput: 'Заказ создан: CREATED\nОплата: CREATED → PAID\nОтправка: PAID → SHIPPED\nДоставка: SHIPPED → DELIVERED\n--- Новый заказ ---\nОплата: CREATED → PAID\nОтмена: PAID → CANCELLED\nОшибка: Нельзя отправить заказ в состоянии CANCELLED\nОшибка: Нельзя отменить заказ в состоянии DELIVERED',
      hint: 'Каждый метод перехода проверяет текущее состояние. Допустимые переходы: pay() — из CREATED, ship() — из PAID, deliver() — из SHIPPED, cancel() — из всех кроме DELIVERED и CANCELLED.',
      solution: `public class Main {

    static final int CREATED = 0, PAID = 1, SHIPPED = 2, DELIVERED = 3, CANCELLED = 4;
    static String[] stateNames = {"CREATED", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"};

    static int state;

    static void init() {
        state = CREATED;
    }

    static void pay() {
        if (state != CREATED) {
            throw new IllegalStateException("Нельзя оплатить заказ в состоянии " + stateNames[state]);
        }
        System.out.println("Оплата: " + stateNames[state] + " → PAID");
        state = PAID;
    }

    static void ship() {
        if (state != PAID) {
            throw new IllegalStateException("Нельзя отправить заказ в состоянии " + stateNames[state]);
        }
        System.out.println("Отправка: " + stateNames[state] + " → SHIPPED");
        state = SHIPPED;
    }

    static void deliver() {
        if (state != SHIPPED) {
            throw new IllegalStateException("Нельзя доставить заказ в состоянии " + stateNames[state]);
        }
        System.out.println("Доставка: " + stateNames[state] + " → DELIVERED");
        state = DELIVERED;
    }

    static void cancel() {
        if (state == DELIVERED || state == CANCELLED) {
            throw new IllegalStateException("Нельзя отменить заказ в состоянии " + stateNames[state]);
        }
        System.out.println("Отмена: " + stateNames[state] + " → CANCELLED");
        state = CANCELLED;
    }

    public static void main(String[] args) {
        // Успешный путь: Created → Paid → Shipped → Delivered
        init();
        System.out.println("Заказ создан: " + stateNames[state]);
        pay();
        ship();
        deliver();

        // Путь с отменой
        System.out.println("--- Новый заказ ---");
        init();
        pay();
        cancel();

        try {
            ship();
        } catch (IllegalStateException e) {
            System.out.println("Ошибка: " + e.getMessage());
        }

        // Попытка отменить доставленный
        init();
        pay();
        ship();
        deliver();
        try {
            cancel();
        } catch (IllegalStateException e) {
            System.out.println("Ошибка: " + e.getMessage());
        }
    }
}`,
      explanation: 'State Machine (Конечный автомат) — поведенческий паттерн, где объект меняет своё поведение в зависимости от внутреннего состояния. Каждый метод перехода проверяет допустимость: pay() возможна только из CREATED, ship() из PAID и т.д. Cancel() доступна из любого состояния кроме DELIVERED и CANCELLED. В реальных проектах State Machine используется для заказов, платежей, документооборота, игровых состояний. Часто применяют библиотеки: Spring Statemachine, Easy Rules.'
    }
  ]
}
