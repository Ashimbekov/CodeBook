export default {
  id: 43,
  title: 'Рефлексия (Reflection)',
  description: 'Узнаем как Java может изучать сама себя во время работы программы — получать информацию о классах, полях и методах прямо в коде',
  lessons: [
    {
      id: 1, title: 'Что такое рефлексия?', type: 'theory',
      content: [
        { type: 'text', value: 'Рефлексия (Reflection) — это способность программы изучать саму себя во время работы. Представь что у тебя есть зеркало: ты смотришь в него и видишь себя. Так и программа с помощью рефлексии может "посмотреть" на любой класс и узнать, какие у него поля, методы, конструкторы.' },
        { type: 'tip', value: 'Представь что у тебя есть закрытая коробка с подарком. Обычно ты просто знаешь что внутри (если сам положил). Но рефлексия — это как рентген: ты можешь просветить коробку и увидеть что там внутри, даже не открывая её.' },
        { type: 'heading', value: 'Зачем нужна рефлексия?' },
        { type: 'list', items: [
          'Фреймворки (Spring, Hibernate) используют её для автоматической настройки',
          'Сериализация объектов в JSON/XML',
          'Тестовые фреймворки (JUnit) находят тесты по аннотациям',
          'IDE показывает подсказки о методах класса',
          'Загрузка плагинов во время работы программы'
        ]},
        { type: 'heading', value: 'Главный класс: Class<T>' },
        { type: 'text', value: 'Всё начинается с объекта Class. Каждый класс в Java имеет объект Class, который описывает его структуру. Это как паспорт класса.' },
        { type: 'code', language: 'java', value: '// Три способа получить объект Class\n\n// Способ 1: через .class\nClass<String> c1 = String.class;\n\n// Способ 2: через объект\nString str = "Привет";\nClass<?> c2 = str.getClass();\n\n// Способ 3: через имя класса (строку)\ntry {\n    Class<?> c3 = Class.forName("java.lang.String");\n    System.out.println(c3.getName()); // java.lang.String\n} catch (ClassNotFoundException e) {\n    e.printStackTrace();\n}' },
        { type: 'warning', value: 'Class.forName() бросает ClassNotFoundException — всегда оборачивай в try-catch. Этот способ полезен когда имя класса хранится в строке (например, читается из файла конфигурации).' }
      ]
    },
    {
      id: 2, title: 'Получение информации о классе', type: 'theory',
      content: [
        { type: 'text', value: 'С помощью объекта Class можно узнать всё о классе: его имя, суперкласс, интерфейсы, поля и методы.' },
        { type: 'heading', value: 'Базовая информация' },
        { type: 'code', language: 'java', value: 'Class<?> clazz = String.class;\n\n// Имя класса\nSystem.out.println(clazz.getName());        // java.lang.String\nSystem.out.println(clazz.getSimpleName());  // String\n\n// Суперкласс\nClass<?> superClass = clazz.getSuperclass();\nSystem.out.println(superClass.getName());   // java.lang.Object\n\n// Интерфейсы\nClass<?>[] interfaces = clazz.getInterfaces();\nfor (Class<?> iface : interfaces) {\n    System.out.println(iface.getName());\n    // java.io.Serializable\n    // java.lang.Comparable\n    // java.lang.CharSequence\n}' },
        { type: 'heading', value: 'Проверка типа класса' },
        { type: 'code', language: 'java', value: 'Class<?> clazz = String.class;\n\nSystem.out.println(clazz.isInterface());  // false\nSystem.out.println(clazz.isEnum());      // false\nSystem.out.println(clazz.isArray());     // false\nSystem.out.println(clazz.isPrimitive()); // false\n\nClass<?> intClass = int.class;\nSystem.out.println(intClass.isPrimitive()); // true' },
        { type: 'heading', value: 'Пример: анализ своего класса' },
        { type: 'code', language: 'java', value: 'class Animal {\n    private String name;\n    public int age;\n\n    public Animal(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n\n    public void makeSound() {\n        System.out.println("Звук!");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Class<?> clazz = Animal.class;\n\n        System.out.println("Класс: " + clazz.getSimpleName());\n        System.out.println("Пакет: " + clazz.getPackageName());\n        System.out.println("Суперкласс: " + clazz.getSuperclass().getSimpleName());\n    }\n}' },
        { type: 'note', value: 'getSimpleName() возвращает только короткое имя (например, "String"), а getName() — полное с пакетом ("java.lang.String"). Используй getSimpleName() для читаемых сообщений.' }
      ]
    },
    {
      id: 3, title: 'Доступ к полям и методам', type: 'theory',
      content: [
        { type: 'text', value: 'С помощью рефлексии можно получить список всех полей и методов класса — даже приватных!' },
        { type: 'tip', value: 'Это как X-ray для класса: обычно private поля скрыты, но рефлексия позволяет их увидеть и даже изменить. Это мощно, но опасно — используй осторожно!' },
        { type: 'heading', value: 'Работа с полями (Field)' },
        { type: 'code', language: 'java', value: 'import java.lang.reflect.Field;\n\nclass Person {\n    public String name = "Иван";\n    private int age = 30;\n    protected double salary = 50000.0;\n}\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Person person = new Person();\n        Class<?> clazz = person.getClass();\n\n        // getFields() — только публичные поля (включая унаследованные)\n        Field[] publicFields = clazz.getFields();\n        System.out.println("Публичные поля:");\n        for (Field f : publicFields) {\n            System.out.println("  " + f.getName() + " = " + f.get(person));\n        }\n\n        // getDeclaredFields() — ВСЕ поля этого класса (включая private)\n        Field[] allFields = clazz.getDeclaredFields();\n        System.out.println("Все поля:");\n        for (Field f : allFields) {\n            f.setAccessible(true); // разрешаем доступ к private\n            System.out.println("  " + f.getName() + " = " + f.get(person));\n        }\n    }\n}' },
        { type: 'heading', value: 'Изменение значения поля' },
        { type: 'code', language: 'java', value: 'import java.lang.reflect.Field;\n\nclass Secret {\n    private String password = "qwerty123";\n}\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Secret obj = new Secret();\n        Field field = obj.getClass().getDeclaredField("password");\n        field.setAccessible(true);\n\n        System.out.println("До: " + field.get(obj));\n        field.set(obj, "newPassword!"); // меняем значение\n        System.out.println("После: " + field.get(obj));\n    }\n}' },
        { type: 'heading', value: 'Работа с методами (Method)' },
        { type: 'code', language: 'java', value: 'import java.lang.reflect.Method;\n\nclass Calculator {\n    public int add(int a, int b) { return a + b; }\n    private int multiply(int a, int b) { return a * b; }\n}\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        Calculator calc = new Calculator();\n        Class<?> clazz = calc.getClass();\n\n        // Получаем все объявленные методы\n        Method[] methods = clazz.getDeclaredMethods();\n        for (Method m : methods) {\n            System.out.println(m.getName() + " (параметров: " + m.getParameterCount() + ")");\n        }\n\n        // Вызываем метод по имени\n        Method addMethod = clazz.getMethod("add", int.class, int.class);\n        int result = (int) addMethod.invoke(calc, 5, 3);\n        System.out.println("5 + 3 = " + result);\n    }\n}' },
        { type: 'warning', value: 'setAccessible(true) — опасная операция! Она нарушает инкапсуляцию. В Java 17+ есть ограничения на доступ к полям чужих модулей. Используй только когда действительно необходимо.' }
      ]
    },
    {
      id: 4, title: 'Создание объектов через рефлексию', type: 'theory',
      content: [
        { type: 'text', value: 'Рефлексия позволяет создавать объекты не зная заранее тип класса — имя класса может быть строкой, прочитанной из файла или базы данных.' },
        { type: 'tip', value: 'Представь фабрику игрушек. Обычно фабрика знает какую игрушку делать. Но с рефлексией — ты пишешь на бумажке "Робот" или "Машинка", кидаешь в машину, и она сама создаёт нужную игрушку, прочитав инструкцию.' },
        { type: 'heading', value: 'Создание через конструктор без параметров' },
        { type: 'code', language: 'java', value: 'class Dog {\n    private String name;\n\n    public Dog() {\n        this.name = "Безымянный";\n    }\n\n    public String getName() { return name; }\n}\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        // Обычный способ\n        Dog dog1 = new Dog();\n\n        // Через рефлексию\n        Class<?> clazz = Class.forName("Dog"); // или Dog.class\n        Dog dog2 = (Dog) clazz.getDeclaredConstructor().newInstance();\n\n        System.out.println(dog2.getName()); // Безымянный\n    }\n}' },
        { type: 'heading', value: 'Создание с параметрами' },
        { type: 'code', language: 'java', value: 'import java.lang.reflect.Constructor;\n\nclass Cat {\n    private String name;\n    private int age;\n\n    public Cat(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n\n    @Override\n    public String toString() {\n        return "Cat{name=" + name + ", age=" + age + "}";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        // Находим конструктор с параметрами String и int\n        Constructor<?> constructor = Cat.class.getDeclaredConstructor(\n            String.class, int.class\n        );\n\n        // Создаём объект передавая аргументы\n        Cat cat = (Cat) constructor.newInstance("Мурка", 3);\n        System.out.println(cat); // Cat{name=Мурка, age=3}\n    }\n}' },
        { type: 'heading', value: 'Практический пример: универсальный загрузчик' },
        { type: 'code', language: 'java', value: 'interface Greeting {\n    void greet();\n}\n\nclass RussianGreeting implements Greeting {\n    public void greet() { System.out.println("Привет!"); }\n}\n\nclass EnglishGreeting implements Greeting {\n    public void greet() { System.out.println("Hello!"); }\n}\n\npublic class Main {\n    public static Greeting loadGreeting(String className) throws Exception {\n        Class<?> clazz = Class.forName(className);\n        return (Greeting) clazz.getDeclaredConstructor().newInstance();\n    }\n\n    public static void main(String[] args) throws Exception {\n        // Язык берётся из настроек — можно менять без перекомпиляции!\n        String lang = "RussianGreeting";\n        Greeting greeting = loadGreeting(lang);\n        greeting.greet(); // Привет!\n    }\n}' },
        { type: 'note', value: 'newInstance() бросает несколько исключений: InstantiationException (класс абстрактный), IllegalAccessException (нет прав), InvocationTargetException (конструктор бросил исключение). Используй общий Exception или ловли каждый.' }
      ]
    },
    {
      id: 5, title: 'Применение и опасности рефлексии', type: 'theory',
      content: [
        { type: 'text', value: 'Рефлексия — мощный инструмент, но как любой мощный инструмент, ею легко порезаться. Давай разберём где её используют и чего нужно избегать.' },
        { type: 'heading', value: 'Где рефлексия применяется в реальных проектах' },
        { type: 'list', items: [
          'Spring Framework: находит @Component классы и создаёт их автоматически',
          'JUnit: находит методы с @Test и запускает их как тесты',
          'Jackson/Gson: читает поля объекта и конвертирует в JSON',
          'Hibernate: маппит поля класса на колонки в базе данных',
          'Lombok: генерирует методы getters/setters во время компиляции'
        ]},
        { type: 'heading', value: 'Пример: простой JSON-сериализатор' },
        { type: 'code', language: 'java', value: 'import java.lang.reflect.Field;\n\nclass User {\n    public String username = "admin";\n    public int age = 25;\n    public boolean active = true;\n}\n\npublic class SimpleJsonSerializer {\n    public static String toJson(Object obj) throws Exception {\n        Class<?> clazz = obj.getClass();\n        Field[] fields = clazz.getDeclaredFields();\n\n        StringBuilder json = new StringBuilder("{");\n        for (int i = 0; i < fields.length; i++) {\n            fields[i].setAccessible(true);\n            String name = fields[i].getName();\n            Object value = fields[i].get(obj);\n\n            json.append("\\"").append(name).append("\\": ");\n            if (value instanceof String) {\n                json.append("\\"").append(value).append("\\"");\n            } else {\n                json.append(value);\n            }\n            if (i < fields.length - 1) json.append(", ");\n        }\n        json.append("}");\n        return json.toString();\n    }\n\n    public static void main(String[] args) throws Exception {\n        User user = new User();\n        System.out.println(toJson(user));\n        // {"username": "admin", "age": 25, "active": true}\n    }\n}' },
        { type: 'heading', value: 'Опасности рефлексии' },
        { type: 'warning', value: 'Производительность: рефлексия в 10-50 раз медленнее обычного вызова. Безопасность: можно изменить private поля и нарушить инварианты класса. Хрупкость: код завязан на имена полей/методов — при рефакторинге сломается.' },
        { type: 'code', language: 'java', value: '// Плохо: не используй рефлексию там где можно без неё\npublic class BadExample {\n    public static void main(String[] args) throws Exception {\n        String str = "Привет";\n        // Это ужасно — вызывать length() через рефлексию!\n        Method m = str.getClass().getMethod("length");\n        int len = (int) m.invoke(str);\n        System.out.println(len);\n    }\n}\n\n// Хорошо: обычный вызов\npublic class GoodExample {\n    public static void main(String[] args) {\n        String str = "Привет";\n        System.out.println(str.length()); // Просто и быстро!\n    }\n}' },
        { type: 'tip', value: 'Правило: если можешь решить задачу без рефлексии — реши без неё. Рефлексия — это инструмент для фреймворков и библиотек, а не для бизнес-логики.' }
      ]
    },
    {
      id: 6, title: 'Практика: Инспектор классов', type: 'practice', difficulty: 'medium',
      description: 'Напиши программу ClassInspector, которая принимает любой объект и выводит полную информацию о его классе: имя класса, все поля с их значениями, все публичные методы.',
      requirements: [
        'Создай класс Product с полями: String name, double price, int quantity (private)',
        'Напиши метод inspect(Object obj) который выводит имя класса',
        'Метод должен выводить все поля через getDeclaredFields() с их значениями',
        'Метод должен выводить все публичные методы через getMethods()',
        'Используй setAccessible(true) для доступа к private полям'
      ],
      expectedOutput: '=== Инспекция класса: Product ===\n--- Поля ---\nname (String) = Ноутбук\nprice (double) = 75000.0\nquantity (int) = 5\n--- Методы ---\ngetName\ngetPrice\ngetQuantity\ntoString',
      hint: 'Используй field.getType().getSimpleName() чтобы получить тип поля. Для методов — clazz.getMethods() возвращает публичные методы включая унаследованные от Object, отфильтруй методы объявленные в самом классе через clazz.getDeclaredMethods().',
      solution: 'import java.lang.reflect.Field;\nimport java.lang.reflect.Method;\n\nclass Product {\n    private String name;\n    private double price;\n    private int quantity;\n\n    public Product(String name, double price, int quantity) {\n        this.name = name;\n        this.price = price;\n        this.quantity = quantity;\n    }\n\n    public String getName() { return name; }\n    public double getPrice() { return price; }\n    public int getQuantity() { return quantity; }\n\n    @Override\n    public String toString() {\n        return "Product{name=" + name + ", price=" + price + "}";\n    }\n}\n\npublic class ClassInspector {\n    public static void inspect(Object obj) throws Exception {\n        Class<?> clazz = obj.getClass();\n        System.out.println("=== Инспекция класса: " + clazz.getSimpleName() + " ===");\n\n        System.out.println("--- Поля ---");\n        for (Field field : clazz.getDeclaredFields()) {\n            field.setAccessible(true);\n            System.out.println(field.getName() +\n                " (" + field.getType().getSimpleName() + ")" +\n                " = " + field.get(obj));\n        }\n\n        System.out.println("--- Методы ---");\n        for (Method method : clazz.getDeclaredMethods()) {\n            System.out.println(method.getName());\n        }\n    }\n\n    public static void main(String[] args) throws Exception {\n        Product product = new Product("Ноутбук", 75000.0, 5);\n        inspect(product);\n    }\n}',
      explanation: 'getDeclaredFields() возвращает поля объявленные именно в этом классе (не унаследованные). setAccessible(true) позволяет читать private поля. getDeclaredMethods() возвращает методы этого класса без унаследованных от Object, что даёт чистый вывод.'
    }
  ]
}
