export default {
  id: 44,
  title: 'Паттерны: Singleton, Factory, Builder',
  description: 'Изучим три самых популярных паттерна проектирования: Синглтон для единственного объекта, Фабрику для создания объектов, и Строитель для сложных объектов',
  lessons: [
    {
      id: 1, title: 'Что такое паттерны проектирования?', type: 'theory',
      content: [
        { type: 'text', value: 'Паттерн проектирования (Design Pattern) — это проверенное решение для часто встречающейся задачи в программировании. Это не готовый код, а скорее рецепт или схема, которую можно адаптировать под свои нужды.' },
        { type: 'tip', value: 'Представь что ты строитель. Когда нужно сделать дверь — ты не придумываешь как это сделать с нуля каждый раз. Ты используешь проверенную схему: петли + дверное полотно + ручка. Паттерны — это такие проверенные схемы для программистов.' },
        { type: 'heading', value: 'Классификация паттернов' },
        { type: 'list', items: [
          'Порождающие (Creational) — отвечают за создание объектов: Singleton, Factory, Builder, Prototype',
          'Структурные (Structural) — определяют структуру классов: Adapter, Decorator, Facade, Proxy',
          'Поведенческие (Behavioral) — управляют взаимодействием: Observer, Strategy, Command, Iterator'
        ]},
        { type: 'heading', value: 'Почему важно знать паттерны?' },
        { type: 'list', items: [
          'Не нужно изобретать велосипед — решения уже придуманы',
          'Общий язык: "применим Singleton" — все программисты поймут',
          'Проверены временем — их использовали в тысячах проектов',
          'Спрашивают на собеседованиях — это must-know'
        ]},
        { type: 'code', language: 'java', value: '// Без паттерна: каждый раз по-разному создаём подключение\nDatabaseConnection conn1 = new DatabaseConnection("localhost", 5432);\nDatabaseConnection conn2 = new DatabaseConnection("localhost", 5432);\n// Опасно! Создали 2 подключения — лишняя нагрузка на БД\n\n// С паттерном Singleton: всегда одно подключение\nDatabaseConnection conn = DatabaseConnection.getInstance();\n// Гарантированно один объект на всё приложение' },
        { type: 'note', value: 'В этом модуле изучим три порождающих паттерна: Singleton, Factory и Builder. Они входят в "банду четырёх" (Gang of Four) — классическую книгу о паттернах 1994 года, которую читают программисты до сих пор.' }
      ]
    },
    {
      id: 2, title: 'Паттерн Singleton', type: 'theory',
      content: [
        { type: 'text', value: 'Singleton (Одиночка) — гарантирует что класс имеет только один экземпляр и предоставляет глобальную точку доступа к нему.' },
        { type: 'tip', value: 'Представь президента страны: он один! Нельзя создать двух президентов одновременно. Так и Singleton — объект создаётся только один раз, и все кто хочет с ним работать получают один и тот же объект.' },
        { type: 'heading', value: 'Eager Singleton (жадная инициализация)' },
        { type: 'code', language: 'java', value: 'public class EagerSingleton {\n    // Объект создаётся сразу при загрузке класса\n    private static final EagerSingleton INSTANCE = new EagerSingleton();\n\n    // Приватный конструктор — никто снаружи не может вызвать new\n    private EagerSingleton() {\n        System.out.println("Singleton создан!");\n    }\n\n    // Единственный способ получить объект\n    public static EagerSingleton getInstance() {\n        return INSTANCE;\n    }\n\n    public void doWork() {\n        System.out.println("Работаю...");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        EagerSingleton s1 = EagerSingleton.getInstance();\n        EagerSingleton s2 = EagerSingleton.getInstance();\n\n        System.out.println(s1 == s2); // true — это один и тот же объект!\n        s1.doWork();\n    }\n}' },
        { type: 'heading', value: 'Lazy Singleton (ленивая инициализация)' },
        { type: 'code', language: 'java', value: 'public class LazySingleton {\n    // Сначала null — объект не создан\n    private static LazySingleton instance = null;\n\n    private LazySingleton() {}\n\n    public static LazySingleton getInstance() {\n        // Создаём объект только при первом вызове\n        if (instance == null) {\n            instance = new LazySingleton();\n        }\n        return instance;\n    }\n}' },
        { type: 'heading', value: 'Thread-safe Singleton (для многопоточности)' },
        { type: 'code', language: 'java', value: 'public class ThreadSafeSingleton {\n    private static volatile ThreadSafeSingleton instance;\n\n    private ThreadSafeSingleton() {}\n\n    public static ThreadSafeSingleton getInstance() {\n        if (instance == null) {\n            synchronized (ThreadSafeSingleton.class) {\n                if (instance == null) { // двойная проверка!\n                    instance = new ThreadSafeSingleton();\n                }\n            }\n        }\n        return instance;\n    }\n}' },
        { type: 'warning', value: 'В многопоточном коде используй double-checked locking (как выше) или просто enum-синглтон. Lazy Singleton без синхронизации может создать два объекта если два потока вызовут getInstance() одновременно.' },
        { type: 'heading', value: 'Enum Singleton — самый надёжный способ' },
        { type: 'code', language: 'java', value: 'public enum EnumSingleton {\n    INSTANCE;\n\n    public void doWork() {\n        System.out.println("Работаю как enum singleton!");\n    }\n}\n\n// Использование:\nEnumSingleton.INSTANCE.doWork();\n// Enum в Java всегда создаётся один раз и потокобезопасен!' }
      ]
    },
    {
      id: 3, title: 'Паттерн Factory Method', type: 'theory',
      content: [
        { type: 'text', value: 'Factory Method (Фабричный метод) — паттерн, который выносит создание объектов в отдельный метод. Вместо того чтобы писать new Cat() или new Dog() везде, ты говоришь фабрике: "дай мне животное типа Кошка".' },
        { type: 'tip', value: 'Представь ресторан. Ты не идёшь на кухню и не готовишь сам. Ты говоришь официанту: "Хочу пиццу" — и получаешь пиццу. Как именно она приготовлена — тебя не волнует. Factory — это такой официант для объектов.' },
        { type: 'heading', value: 'Простая фабрика' },
        { type: 'code', language: 'java', value: 'abstract class Shape {\n    abstract void draw();\n}\n\nclass Circle extends Shape {\n    public void draw() { System.out.println("Рисую круг ○"); }\n}\n\nclass Rectangle extends Shape {\n    public void draw() { System.out.println("Рисую прямоугольник □"); }\n}\n\nclass Triangle extends Shape {\n    public void draw() { System.out.println("Рисую треугольник △"); }\n}\n\n// Фабрика — знает как создавать фигуры\nclass ShapeFactory {\n    public static Shape create(String type) {\n        switch (type.toLowerCase()) {\n            case "circle":    return new Circle();\n            case "rectangle": return new Rectangle();\n            case "triangle":  return new Triangle();\n            default: throw new IllegalArgumentException("Неизвестная фигура: " + type);\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Shape s1 = ShapeFactory.create("circle");\n        Shape s2 = ShapeFactory.create("rectangle");\n\n        s1.draw(); // Рисую круг ○\n        s2.draw(); // Рисую прямоугольник □\n    }\n}' },
        { type: 'heading', value: 'Factory Method с подклассами' },
        { type: 'code', language: 'java', value: 'interface Button {\n    void click();\n    void render();\n}\n\nclass WindowsButton implements Button {\n    public void click() { System.out.println("[Windows] Клик!"); }\n    public void render() { System.out.println("[Windows] Рендер кнопки"); }\n}\n\nclass MacButton implements Button {\n    public void click() { System.out.println("[Mac] Клик!"); }\n    public void render() { System.out.println("[Mac] Рендер кнопки"); }\n}\n\n// Абстрактная фабрика\nabstract class Dialog {\n    // Фабричный метод — подклассы определяют ЧТО создавать\n    public abstract Button createButton();\n\n    // Использует фабричный метод\n    public void render() {\n        Button btn = createButton();\n        btn.render();\n    }\n}\n\nclass WindowsDialog extends Dialog {\n    public Button createButton() { return new WindowsButton(); }\n}\n\nclass MacDialog extends Dialog {\n    public Button createButton() { return new MacButton(); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Dialog dialog;\n        String os = "windows"; // можно читать из конфига\n\n        if (os.equals("windows")) {\n            dialog = new WindowsDialog();\n        } else {\n            dialog = new MacDialog();\n        }\n\n        dialog.render();\n    }\n}' },
        { type: 'note', value: 'Фабрика хороша тем, что при добавлении нового типа (например, LinuxButton) нужно изменить только фабрику — весь остальной код остаётся нетронутым.' }
      ]
    },
    {
      id: 4, title: 'Абстрактная фабрика', type: 'theory',
      content: [
        { type: 'text', value: 'Abstract Factory (Абстрактная фабрика) — это фабрика фабрик. Она создаёт не один тип объектов, а целое семейство связанных объектов.' },
        { type: 'tip', value: 'Если Factory Method — это завод по производству стульев, то Abstract Factory — это мебельный салон, который делает сразу диван + кресло + стол в одном стиле. Ты выбираешь стиль (Современный или Викторианский), а фабрика создаёт всю мебель в этом стиле.' },
        { type: 'code', language: 'java', value: '// Семейство продуктов\ninterface Button {\n    void render();\n}\n\ninterface Checkbox {\n    void render();\n}\n\n// Windows семейство\nclass WinButton implements Button {\n    public void render() { System.out.println("[Win] Кнопка"); }\n}\n\nclass WinCheckbox implements Checkbox {\n    public void render() { System.out.println("[Win] Чекбокс"); }\n}\n\n// Mac семейство\nclass MacButton implements Button {\n    public void render() { System.out.println("[Mac] Кнопка"); }\n}\n\nclass MacCheckbox implements Checkbox {\n    public void render() { System.out.println("[Mac] Чекбокс"); }\n}\n\n// Абстрактная фабрика\ninterface GUIFactory {\n    Button createButton();\n    Checkbox createCheckbox();\n}\n\n// Конкретные фабрики\nclass WinFactory implements GUIFactory {\n    public Button createButton() { return new WinButton(); }\n    public Checkbox createCheckbox() { return new WinCheckbox(); }\n}\n\nclass MacFactory implements GUIFactory {\n    public Button createButton() { return new MacButton(); }\n    public Checkbox createCheckbox() { return new MacCheckbox(); }\n}\n\n// Клиент работает только с интерфейсами\nclass Application {\n    private Button button;\n    private Checkbox checkbox;\n\n    public Application(GUIFactory factory) {\n        this.button = factory.createButton();\n        this.checkbox = factory.createCheckbox();\n    }\n\n    public void render() {\n        button.render();\n        checkbox.render();\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        GUIFactory factory = new WinFactory();\n        Application app = new Application(factory);\n        app.render();\n        // [Win] Кнопка\n        // [Win] Чекбокс\n    }\n}' },
        { type: 'note', value: 'Ключевое преимущество: если завтра нужна поддержка Linux — создаём LinuxFactory, и больше ничего не меняем. Весь код Application остаётся прежним.' }
      ]
    },
    {
      id: 5, title: 'Паттерн Builder', type: 'theory',
      content: [
        { type: 'text', value: 'Builder (Строитель) — паттерн для пошагового создания сложных объектов. Особенно полезен когда объект имеет много параметров, часть из которых необязательны.' },
        { type: 'tip', value: 'Представь как делают бургер в ресторане. Ты не говоришь всё сразу, а выбираешь: булочка → котлета → сыр (да/нет) → соус (какой) → овощи (что хочешь). Каждый шаг необязателен. В конце говоришь "готово" — и получаешь свой уникальный бургер. Builder работает точно так же.' },
        { type: 'heading', value: 'Проблема без Builder' },
        { type: 'code', language: 'java', value: '// Ужасно! Телескопический конструктор\nclass Person {\n    // Нужно передавать nulls для необязательных полей\n    public Person(String name, int age, String email, String phone,\n                  String address, String website, boolean vip) {\n        // ...\n    }\n}\n\n// Не понятно что означает каждый параметр!\nPerson p = new Person("Иван", 25, null, "+7...", null, null, false);\n//                                ^^^ email=null, address=null, website=null — путаница!' },
        { type: 'heading', value: 'Решение с Builder' },
        { type: 'code', language: 'java', value: 'class Person {\n    // Все поля финальные — объект неизменяемый (immutable)\n    private final String name;     // обязательное\n    private final int age;         // обязательное\n    private final String email;    // необязательное\n    private final String phone;    // необязательное\n    private final String address;  // необязательное\n\n    // Приватный конструктор — только Builder может создавать\n    private Person(Builder builder) {\n        this.name = builder.name;\n        this.age = builder.age;\n        this.email = builder.email;\n        this.phone = builder.phone;\n        this.address = builder.address;\n    }\n\n    @Override\n    public String toString() {\n        return "Person{name=" + name + ", age=" + age +\n               ", email=" + email + ", phone=" + phone + "}";\n    }\n\n    // Вложенный класс Builder\n    public static class Builder {\n        // Обязательные поля\n        private final String name;\n        private final int age;\n\n        // Необязательные поля с дефолтными значениями\n        private String email = null;\n        private String phone = null;\n        private String address = null;\n\n        // Конструктор Builder принимает только обязательные поля\n        public Builder(String name, int age) {\n            this.name = name;\n            this.age = age;\n        }\n\n        // Каждый метод возвращает this — для цепочки вызовов\n        public Builder email(String email) {\n            this.email = email;\n            return this;\n        }\n\n        public Builder phone(String phone) {\n            this.phone = phone;\n            return this;\n        }\n\n        public Builder address(String address) {\n            this.address = address;\n            return this;\n        }\n\n        // Финальный метод — создаёт объект\n        public Person build() {\n            return new Person(this);\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Читаемо! Сразу понятно что задаём\n        Person person = new Person.Builder("Иван", 25)\n            .email("ivan@example.com")\n            .phone("+7 777 123-45-67")\n            .build();\n\n        System.out.println(person);\n\n        // Минимальный вариант — только обязательные поля\n        Person minimal = new Person.Builder("Мария", 30).build();\n        System.out.println(minimal);\n    }\n}' },
        { type: 'heading', value: 'Builder с валидацией' },
        { type: 'code', language: 'java', value: 'public Builder build() {\n    // Валидация перед созданием объекта\n    if (name == null || name.isEmpty()) {\n        throw new IllegalStateException("Имя не может быть пустым");\n    }\n    if (age < 0 || age > 150) {\n        throw new IllegalStateException("Некорректный возраст: " + age);\n    }\n    return new Person(this);\n}' },
        { type: 'tip', value: 'Builder — один из самых полезных паттернов в Java. Библиотека Lombok позволяет создавать Builder автоматически через аннотацию @Builder — не нужно писать весь этот код вручную!' }
      ]
    },
    {
      id: 6, title: 'Практика: Паттерны Singleton и Factory', type: 'practice', difficulty: 'medium',
      description: 'Создай систему логирования используя паттерны Singleton и Factory. Logger должен существовать в единственном экземпляре, а LoggerFactory создаёт логгеры разных типов (CONSOLE, FILE).',
      requirements: [
        'Создай enum LogLevel с уровнями: INFO, WARNING, ERROR',
        'Создай абстрактный класс Logger с методом log(LogLevel level, String message)',
        'Создай ConsoleLogger который выводит в консоль с префиксом уровня',
        'Создай класс LoggerFactory (Singleton) с методом getLogger(String type)',
        'Метод getLogger возвращает ConsoleLogger для типа "CONSOLE"',
        'Проверь что getInstance() возвращает один и тот же объект'
      ],
      expectedOutput: '[INFO] Приложение запущено\n[WARNING] Мало памяти\n[ERROR] База данных недоступна\nОдин экземпляр фабрики: true',
      hint: 'LoggerFactory — Singleton с private конструктором и static getInstance(). Метод getLogger использует switch по type. ConsoleLogger.log форматирует как "[" + level + "] " + message.',
      solution: 'enum LogLevel { INFO, WARNING, ERROR }\n\nabstract class Logger {\n    public abstract void log(LogLevel level, String message);\n}\n\nclass ConsoleLogger extends Logger {\n    public void log(LogLevel level, String message) {\n        System.out.println("[" + level + "] " + message);\n    }\n}\n\nclass LoggerFactory {\n    private static LoggerFactory instance;\n\n    private LoggerFactory() {}\n\n    public static LoggerFactory getInstance() {\n        if (instance == null) {\n            instance = new LoggerFactory();\n        }\n        return instance;\n    }\n\n    public Logger getLogger(String type) {\n        switch (type.toUpperCase()) {\n            case "CONSOLE": return new ConsoleLogger();\n            default: throw new IllegalArgumentException("Неизвестный тип: " + type);\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        LoggerFactory factory1 = LoggerFactory.getInstance();\n        LoggerFactory factory2 = LoggerFactory.getInstance();\n\n        Logger logger = factory1.getLogger("CONSOLE");\n        logger.log(LogLevel.INFO, "Приложение запущено");\n        logger.log(LogLevel.WARNING, "Мало памяти");\n        logger.log(LogLevel.ERROR, "База данных недоступна");\n\n        System.out.println("Один экземпляр фабрики: " + (factory1 == factory2));\n    }\n}',
      explanation: 'Singleton гарантирует что LoggerFactory создаётся один раз. Factory инкапсулирует логику создания разных логгеров. Если добавить FileLogger — нужно изменить только фабрику, а код main останется прежним.'
    },
    {
      id: 7, title: 'Практика: Паттерн Builder', type: 'practice', difficulty: 'hard',
      description: 'Реализуй паттерн Builder для создания HTTP-запроса. Класс HttpRequest должен иметь обязательные поля (url, method) и необязательные (headers, body, timeout).',
      requirements: [
        'Создай класс HttpRequest с полями: String url, String method, String body, int timeout (default 30)',
        'Реализуй вложенный класс Builder',
        'Обязательные поля url и method передаются в конструктор Builder',
        'Необязательные поля задаются через методы body(), timeout()',
        'В методе build() валидируй: url не должен быть пустым, method должен быть GET/POST/PUT/DELETE',
        'Выведи информацию о запросе'
      ],
      expectedOutput: 'HttpRequest{method=POST, url=https://api.example.com/users, body={"name":"Иван"}, timeout=30}\nHttpRequest{method=GET, url=https://api.example.com/users/1, body=null, timeout=10}',
      hint: 'В конструкторе Builder(String url, String method) сохраняй url и method. Метод build() бросает IllegalStateException если валидация не прошла. Используй Arrays.asList() для списка допустимых методов.',
      solution: 'import java.util.Arrays;\nimport java.util.List;\n\nclass HttpRequest {\n    private final String url;\n    private final String method;\n    private final String body;\n    private final int timeout;\n\n    private HttpRequest(Builder builder) {\n        this.url = builder.url;\n        this.method = builder.method;\n        this.body = builder.body;\n        this.timeout = builder.timeout;\n    }\n\n    @Override\n    public String toString() {\n        return "HttpRequest{method=" + method +\n               ", url=" + url +\n               ", body=" + body +\n               ", timeout=" + timeout + "}";\n    }\n\n    public static class Builder {\n        private final String url;\n        private final String method;\n        private String body = null;\n        private int timeout = 30;\n\n        public Builder(String url, String method) {\n            this.url = url;\n            this.method = method;\n        }\n\n        public Builder body(String body) {\n            this.body = body;\n            return this;\n        }\n\n        public Builder timeout(int timeout) {\n            this.timeout = timeout;\n            return this;\n        }\n\n        public HttpRequest build() {\n            if (url == null || url.isEmpty()) {\n                throw new IllegalStateException("URL не может быть пустым");\n            }\n            List<String> validMethods = Arrays.asList("GET", "POST", "PUT", "DELETE");\n            if (!validMethods.contains(method.toUpperCase())) {\n                throw new IllegalStateException("Недопустимый метод: " + method);\n            }\n            return new HttpRequest(this);\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        HttpRequest postRequest = new HttpRequest.Builder(\n            "https://api.example.com/users", "POST")\n            .body("{\\"name\\":\\"Иван\\"}")\n            .build();\n\n        HttpRequest getRequest = new HttpRequest.Builder(\n            "https://api.example.com/users/1", "GET")\n            .timeout(10)\n            .build();\n\n        System.out.println(postRequest);\n        System.out.println(getRequest);\n    }\n}',
      explanation: 'Builder позволяет создавать HttpRequest с разными комбинациями параметров, не создавая множество перегруженных конструкторов. Валидация в build() гарантирует что объект всегда корректен. Цепочка вызовов (method chaining) делает код очень читаемым.'
    }
  ]
}
