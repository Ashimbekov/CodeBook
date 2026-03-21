export default {
  id: 46,
  title: 'Работа с JSON',
  description: 'Научимся работать с форматом JSON — читать его, создавать, конвертировать объекты Java в JSON и обратно с помощью библиотеки Jackson',
  lessons: [
    {
      id: 1, title: 'Что такое JSON?', type: 'theory',
      content: [
        { type: 'text', value: 'JSON (JavaScript Object Notation) — это текстовый формат для хранения и передачи данных. Несмотря на "JavaScript" в названии, используется везде: в API, конфигурациях, базах данных.' },
        { type: 'tip', value: 'JSON — это как анкета на бумаге. Есть поле "имя" и рядом написано значение. Есть поле "возраст" и рядом число. Компьютеры легко читают такой формат, и люди тоже могут его прочитать.' },
        { type: 'heading', value: 'Синтаксис JSON' },
        { type: 'code', language: 'json', value: '{\n  "name": "Иван",\n  "age": 25,\n  "isStudent": true,\n  "salary": null,\n  "courses": ["Java", "Python", "SQL"],\n  "address": {\n    "city": "Астана",\n    "street": "Абая 10"\n  }\n}' },
        { type: 'heading', value: 'Типы данных в JSON' },
        { type: 'list', items: [
          'Строка (String): "текст в двойных кавычках"',
          'Число (Number): 42 или 3.14 (без кавычек)',
          'Булево (Boolean): true или false',
          'Null: null (отсутствие значения)',
          'Массив (Array): [1, 2, 3] или ["a", "b"]',
          'Объект (Object): {"ключ": "значение"}'
        ]},
        { type: 'heading', value: 'JSON в HTTP API' },
        { type: 'code', language: 'json', value: '// Запрос к API: POST /api/users\n{\n  "username": "ivan123",\n  "password": "secret",\n  "email": "ivan@example.com"\n}\n\n// Ответ API:\n{\n  "success": true,\n  "userId": 42,\n  "message": "Пользователь создан"\n}' },
        { type: 'note', value: 'JSON — самый популярный формат для REST API. Когда твоё Java-приложение общается с сервером или другими сервисами, данные передаются чаще всего в JSON.' }
      ]
    },
    {
      id: 2, title: 'Библиотека Jackson', type: 'theory',
      content: [
        { type: 'text', value: 'Jackson — самая популярная Java-библиотека для работы с JSON. Она умеет превращать Java-объекты в JSON (сериализация) и JSON в Java-объекты (десериализация).' },
        { type: 'heading', value: 'Добавление Jackson в проект' },
        { type: 'code', language: 'xml', value: '<!-- Maven pom.xml -->\n<dependency>\n    <groupId>com.fasterxml.jackson.core</groupId>\n    <artifactId>jackson-databind</artifactId>\n    <version>2.15.2</version>\n</dependency>' },
        { type: 'code', language: 'groovy', value: '// Gradle build.gradle\nimplementation "com.fasterxml.jackson.core:jackson-databind:2.15.2"' },
        { type: 'heading', value: 'ObjectMapper — главный класс Jackson' },
        { type: 'code', language: 'java', value: 'import com.fasterxml.jackson.databind.ObjectMapper;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        // ObjectMapper — сердце Jackson\n        ObjectMapper mapper = new ObjectMapper();\n\n        // Создаём один экземпляр и переиспользуем\n        // ObjectMapper потокобезопасен после настройки\n    }\n}' },
        { type: 'heading', value: 'Класс для работы с JSON' },
        { type: 'code', language: 'java', value: '// Для Jackson нужны: публичные поля ИЛИ геттеры/сеттеры\npublic class User {\n    private String name;\n    private int age;\n    private String email;\n\n    // Обязательно! Jackson нужен конструктор без параметров\n    public User() {}\n\n    public User(String name, int age, String email) {\n        this.name = name;\n        this.age = age;\n        this.email = email;\n    }\n\n    // Геттеры и сеттеры\n    public String getName() { return name; }\n    public void setName(String name) { this.name = name; }\n\n    public int getAge() { return age; }\n    public void setAge(int age) { this.age = age; }\n\n    public String getEmail() { return email; }\n    public void setEmail(String email) { this.email = email; }\n}' },
        { type: 'warning', value: 'Jackson требует конструктор без параметров (no-args constructor) для десериализации! Если у тебя только конструктор с параметрами — добавь пустой конструктор, иначе получишь ошибку.' }
      ]
    },
    {
      id: 3, title: 'Сериализация: объект → JSON', type: 'theory',
      content: [
        { type: 'text', value: 'Сериализация — превращение Java-объекта в JSON-строку. Это нужно когда нужно отправить данные по сети, сохранить в файл или передать в API.' },
        { type: 'code', language: 'java', value: 'import com.fasterxml.jackson.databind.ObjectMapper;\nimport com.fasterxml.jackson.databind.SerializationFeature;\n\npublic class User {\n    private String name;\n    private int age;\n    private String email;\n\n    public User() {}\n    public User(String name, int age, String email) {\n        this.name = name; this.age = age; this.email = email;\n    }\n    // геттеры...\n    public String getName() { return name; }\n    public int getAge() { return age; }\n    public String getEmail() { return email; }\n}\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        ObjectMapper mapper = new ObjectMapper();\n\n        User user = new User("Иван", 25, "ivan@mail.ru");\n\n        // В одну строку\n        String json = mapper.writeValueAsString(user);\n        System.out.println(json);\n        // {"name":"Иван","age":25,"email":"ivan@mail.ru"}\n\n        // Красивый JSON (с отступами)\n        mapper.enable(SerializationFeature.INDENT_OUTPUT);\n        String prettyJson = mapper.writeValueAsString(user);\n        System.out.println(prettyJson);\n        // {\n        //   "name" : "Иван",\n        //   "age" : 25,\n        //   "email" : "ivan@mail.ru"\n        // }\n    }\n}' },
        { type: 'heading', value: 'Запись в файл' },
        { type: 'code', language: 'java', value: 'import com.fasterxml.jackson.databind.ObjectMapper;\nimport java.io.File;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        ObjectMapper mapper = new ObjectMapper();\n        User user = new User("Мария", 30, "maria@mail.ru");\n\n        // Запись в файл\n        mapper.writeValue(new File("user.json"), user);\n        System.out.println("Файл сохранён!");\n\n        // Запись в байты\n        byte[] bytes = mapper.writeValueAsBytes(user);\n        System.out.println("Размер: " + bytes.length + " байт");\n    }\n}' },
        { type: 'heading', value: 'Аннотации для управления сериализацией' },
        { type: 'code', language: 'java', value: 'import com.fasterxml.jackson.annotation.*;\n\npublic class Product {\n    @JsonProperty("product_name")  // другое имя в JSON\n    private String name;\n\n    private double price;\n\n    @JsonIgnore  // не включать в JSON\n    private String internalCode;\n\n    // геттеры/сеттеры...\n    public String getName() { return name; }\n    public double getPrice() { return price; }\n    public String getInternalCode() { return internalCode; }\n}\n\n// Результат: {"product_name":"...", "price":...}\n// internalCode не попадёт в JSON!' },
        { type: 'tip', value: 'Используй @JsonIgnore для паролей, токенов и других секретных данных — они не попадут в JSON ответ. Используй @JsonProperty когда имя поля в Java отличается от ожидаемого в JSON.' }
      ]
    },
    {
      id: 4, title: 'Десериализация: JSON → объект', type: 'theory',
      content: [
        { type: 'text', value: 'Десериализация — обратный процесс: из JSON-строки создаём Java-объект. Это нужно когда получаем данные от API или читаем JSON из файла.' },
        { type: 'code', language: 'java', value: 'import com.fasterxml.jackson.databind.ObjectMapper;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        ObjectMapper mapper = new ObjectMapper();\n\n        String json = "{\\"name\\":\\"Иван\\",\\"age\\":25,\\"email\\":\\"ivan@mail.ru\\"}";\n\n        // JSON -> объект\n        User user = mapper.readValue(json, User.class);\n\n        System.out.println("Имя: " + user.getName());\n        System.out.println("Возраст: " + user.getAge());\n        System.out.println("Email: " + user.getEmail());\n    }\n}' },
        { type: 'heading', value: 'Чтение из файла' },
        { type: 'code', language: 'java', value: 'import com.fasterxml.jackson.databind.ObjectMapper;\nimport java.io.File;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        ObjectMapper mapper = new ObjectMapper();\n\n        // Читаем из файла\n        User user = mapper.readValue(new File("user.json"), User.class);\n        System.out.println("Загружен: " + user.getName());\n    }\n}' },
        { type: 'heading', value: 'Обработка неизвестных полей' },
        { type: 'code', language: 'java', value: 'import com.fasterxml.jackson.databind.ObjectMapper;\nimport com.fasterxml.jackson.databind.DeserializationFeature;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        ObjectMapper mapper = new ObjectMapper();\n\n        // Игнорировать поля которых нет в классе\n        mapper.configure(\n            DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false\n        );\n\n        // JSON содержит "role" которого нет в классе User\n        String json = "{\\"name\\":\\"Иван\\",\\"age\\":25,\\"role\\":\\"admin\\"}";\n\n        User user = mapper.readValue(json, User.class);\n        // Не упадёт! "role" будет проигнорировано\n        System.out.println(user.getName());\n    }\n}' },
        { type: 'heading', value: 'Или аннотация на классе' },
        { type: 'code', language: 'java', value: 'import com.fasterxml.jackson.annotation.JsonIgnoreProperties;\n\n@JsonIgnoreProperties(ignoreUnknown = true)\npublic class User {\n    private String name;\n    private int age;\n    // ...\n}' },
        { type: 'warning', value: 'По умолчанию Jackson выбрасывает исключение если в JSON есть поля которых нет в классе. Всегда используй ignoreUnknown = true при работе с внешними API — они могут добавить новые поля в ответ.' }
      ]
    },
    {
      id: 5, title: 'Работа с коллекциями в JSON', type: 'theory',
      content: [
        { type: 'text', value: 'В реальных проектах данные чаще приходят не как одиночный объект, а как массив объектов. Jackson отлично умеет работать с коллекциями.' },
        { type: 'heading', value: 'Список объектов: List<User>' },
        { type: 'code', language: 'java', value: 'import com.fasterxml.jackson.databind.ObjectMapper;\nimport com.fasterxml.jackson.core.type.TypeReference;\nimport java.util.List;\nimport java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        ObjectMapper mapper = new ObjectMapper();\n\n        // Список в JSON\n        List<User> users = new ArrayList<>();\n        users.add(new User("Иван", 25, "ivan@mail.ru"));\n        users.add(new User("Мария", 30, "maria@mail.ru"));\n        users.add(new User("Алексей", 28, "alex@mail.ru"));\n\n        // Сериализация списка\n        String json = mapper.writeValueAsString(users);\n        System.out.println(json);\n        // [{"name":"Иван","age":25,...},{"name":"Мария",...},...]\n\n        // Десериализация в список\n        // Нужен TypeReference из-за erasure типов в Java\n        List<User> loadedUsers = mapper.readValue(\n            json,\n            new TypeReference<List<User>>() {}\n        );\n\n        System.out.println("Загружено пользователей: " + loadedUsers.size());\n        for (User u : loadedUsers) {\n            System.out.println("  - " + u.getName() + ", " + u.getAge());\n        }\n    }\n}' },
        { type: 'heading', value: 'Вложенные объекты' },
        { type: 'code', language: 'java', value: 'import com.fasterxml.jackson.databind.ObjectMapper;\n\nclass Address {\n    private String city;\n    private String street;\n\n    public Address() {}\n    public Address(String city, String street) {\n        this.city = city; this.street = street;\n    }\n    public String getCity() { return city; }\n    public String getStreet() { return street; }\n}\n\nclass Person {\n    private String name;\n    private Address address; // вложенный объект\n\n    public Person() {}\n    public Person(String name, Address address) {\n        this.name = name; this.address = address;\n    }\n    public String getName() { return name; }\n    public Address getAddress() { return address; }\n}\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        ObjectMapper mapper = new ObjectMapper();\n\n        Person person = new Person("Иван",\n            new Address("Астана", "Абая 10"));\n\n        String json = mapper.writeValueAsString(person);\n        System.out.println(json);\n        // {"name":"Иван","address":{"city":"Астана","street":"Абая 10"}}\n\n        Person loaded = mapper.readValue(json, Person.class);\n        System.out.println(loaded.getAddress().getCity()); // Астана\n    }\n}' },
        { type: 'heading', value: 'JsonNode — работа с JSON без класса' },
        { type: 'code', language: 'java', value: 'import com.fasterxml.jackson.databind.JsonNode;\nimport com.fasterxml.jackson.databind.ObjectMapper;\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        ObjectMapper mapper = new ObjectMapper();\n        String json = "{\\"name\\":\\"Иван\\",\\"age\\":25,\\"scores\\":[90,85,92]}";\n\n        JsonNode root = mapper.readTree(json);\n\n        // Доступ к полям\n        String name = root.get("name").asText();\n        int age = root.get("age").asInt();\n        System.out.println(name + ", " + age);\n\n        // Массив\n        JsonNode scores = root.get("scores");\n        for (JsonNode score : scores) {\n            System.out.print(score.asInt() + " ");\n        }\n    }\n}' },
        { type: 'tip', value: 'JsonNode полезен когда структура JSON заранее неизвестна или часто меняется. Но для стабильного API лучше использовать конкретные классы — это безопаснее и удобнее.' }
      ]
    },
    {
      id: 6, title: 'Практика: Конвертер данных', type: 'practice', difficulty: 'medium',
      description: 'Создай программу для работы с каталогом продуктов. Программа должна уметь создавать список продуктов, сериализовать его в JSON, десериализовать обратно и вывести статистику.',
      requirements: [
        'Создай класс Product с полями: String name, String category, double price, int stock',
        'Добавь аннотацию @JsonIgnoreProperties(ignoreUnknown = true)',
        'Создай список из 3 продуктов разных категорий',
        'Сериализуй список в JSON и выведи его на экран',
        'Десериализуй JSON обратно в список',
        'Выведи статистику: количество товаров, средняя цена, самый дорогой товар'
      ],
      expectedOutput: 'JSON каталог:\n[{"name":"Ноутбук","category":"Электроника","price":75000.0,"stock":10},{"name":"Кресло","category":"Мебель","price":15000.0,"stock":25},{"name":"Кофе","category":"Продукты","price":500.0,"stock":100}]\n\nСтатистика:\nВсего товаров: 3\nСредняя цена: 30166.67 руб\nСамый дорогой: Ноутбук (75000.0 руб)',
      hint: 'Используй mapper.writeValueAsString(list) для сериализации. Для десериализации: new TypeReference<List<Product>>(){}. Для средней цены суммируй prices и дели на количество. Для самого дорогого — проходи по списку.',
      solution: 'import com.fasterxml.jackson.annotation.JsonIgnoreProperties;\nimport com.fasterxml.jackson.core.type.TypeReference;\nimport com.fasterxml.jackson.databind.ObjectMapper;\nimport java.util.ArrayList;\nimport java.util.List;\n\n@JsonIgnoreProperties(ignoreUnknown = true)\nclass Product {\n    private String name;\n    private String category;\n    private double price;\n    private int stock;\n\n    public Product() {}\n    public Product(String name, String category, double price, int stock) {\n        this.name = name;\n        this.category = category;\n        this.price = price;\n        this.stock = stock;\n    }\n\n    public String getName() { return name; }\n    public String getCategory() { return category; }\n    public double getPrice() { return price; }\n    public int getStock() { return stock; }\n}\n\npublic class Main {\n    public static void main(String[] args) throws Exception {\n        ObjectMapper mapper = new ObjectMapper();\n\n        List<Product> catalog = new ArrayList<>();\n        catalog.add(new Product("Ноутбук", "Электроника", 75000.0, 10));\n        catalog.add(new Product("Кресло", "Мебель", 15000.0, 25));\n        catalog.add(new Product("Кофе", "Продукты", 500.0, 100));\n\n        String json = mapper.writeValueAsString(catalog);\n        System.out.println("JSON каталог:");\n        System.out.println(json);\n\n        List<Product> loaded = mapper.readValue(\n            json, new TypeReference<List<Product>>() {}\n        );\n\n        double total = 0;\n        Product mostExpensive = loaded.get(0);\n        for (Product p : loaded) {\n            total += p.getPrice();\n            if (p.getPrice() > mostExpensive.getPrice()) {\n                mostExpensive = p;\n            }\n        }\n        double avg = total / loaded.size();\n\n        System.out.println();\n        System.out.println("Статистика:");\n        System.out.println("Всего товаров: " + loaded.size());\n        System.out.printf("Средняя цена: %.2f руб%n", avg);\n        System.out.println("Самый дорогой: " + mostExpensive.getName() +\n            " (" + mostExpensive.getPrice() + " руб)");\n    }\n}',
      explanation: 'ObjectMapper.writeValueAsString() конвертирует весь список в JSON-строку. TypeReference нужен потому что Java при компиляции "стирает" информацию о типе дженерика (type erasure), и без TypeReference Jackson не знал бы в какой именно List конвертировать.'
    }
  ]
}
