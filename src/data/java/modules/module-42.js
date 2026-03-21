export default {
  id: 42,
  title: 'Аннотации',
  description: 'Что такое аннотации, встроенные аннотации Java, создание собственных аннотаций и политики хранения',
  lessons: [
    {
      id: 1,
      title: 'Что такое аннотации?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Аннотация — это специальный тег, который можно прикрепить к классу, методу, полю или параметру. Аннотация добавляет метаданные — дополнительную информацию о коде.' },
        { type: 'tip', value: 'Представь книгу. Аннотация — как стикер на странице: "ВАЖНО!", "Проверить", "Устарело". Стикер не меняет текст страницы, но несёт дополнительную информацию. Программист или инструмент могут прочитать стикер и что-то сделать.' },
        { type: 'code', language: 'java', value: '// Аннотации начинаются с @\n@Override        // говорит: "этот метод переопределяет метод родителя"\npublic String toString() {\n    return "Мой объект";\n}\n\n@Deprecated      // говорит: "этот метод устарел, не используй"\npublic void oldMethod() { }\n\n@SuppressWarnings("unchecked") // говорит: "не показывай предупреждения"\npublic void myMethod() { }' },
        { type: 'heading', value: 'Для чего используются аннотации?' },
        { type: 'list', items: [
          'Инструкции компилятору (@Override проверяет корректность переопределения)',
          'Документирование (@Deprecated помечает устаревший код)',
          'Генерация кода (Lombok использует аннотации для генерации getters/setters)',
          'Фреймворки (Spring, JUnit, Jakarta EE — всё строится на аннотациях)',
          'Валидация (@NotNull, @Size — проверка данных)'
        ]},
        { type: 'code', language: 'java', value: '// Spring Boot — весь фреймворк на аннотациях\n@RestController\n@RequestMapping("/api")\npublic class UserController {\n\n    @GetMapping("/users/{id}")\n    public User getUser(@PathVariable int id) {\n        return userService.findById(id);\n    }\n}\n\n// JUnit тесты\npublic class CalculatorTest {\n    @Test\n    public void testAdd() {\n        assertEquals(5, calculator.add(2, 3));\n    }\n}' },
        { type: 'note', value: 'Аннотации сами по себе ничего не делают — они только хранят информацию. Что-то делает код, который читает эти аннотации: компилятор, фреймворк или твой собственный код через рефлексию.' }
      ]
    },
    {
      id: 2,
      title: '@Override, @Deprecated, @SuppressWarnings',
      type: 'theory',
      content: [
        { type: 'text', value: 'Java имеет несколько встроенных аннотаций, которые работают прямо "из коробки". Рассмотрим самые важные.' },
        { type: 'heading', value: '@Override — переопределение метода' },
        { type: 'code', language: 'java', value: 'class Animal {\n    public String sound() { return "..."; }\n}\n\nclass Dog extends Animal {\n    @Override\n    public String sound() { return "Гав!"; } // OK\n}\n\nclass Cat extends Animal {\n    @Override\n    public String soudn() { // ОШИБКА КОМПИЛЯЦИИ! Опечатка в имени\n        return "Мяу!";       // Без @Override это просто новый метод\n    }                        // С @Override — компилятор поймает ошибку!\n}' },
        { type: 'heading', value: '@Deprecated — устаревший код' },
        { type: 'code', language: 'java', value: 'class StringUtils {\n    // Старый метод — помечаем как устаревший\n    @Deprecated(since = "2.0", forRemoval = true)\n    public String reverse(String s) {\n        return new StringBuilder(s).reverse().toString();\n    }\n\n    // Новый метод\n    public String reverseString(String s) {\n        return new StringBuilder(s).reverse().toString();\n    }\n}\n\n// При использовании устаревшего метода IDE выдаст предупреждение\nStringUtils utils = new StringUtils();\nString r = utils.reverse("Java"); // IDE подчеркнёт!' },
        { type: 'heading', value: '@SuppressWarnings — подавить предупреждения' },
        { type: 'code', language: 'java', value: 'class Example {\n    @SuppressWarnings("unchecked")\n    public void riskyMethod() {\n        // Приведение типа без проверки — обычно предупреждение\n        List list = new ArrayList();\n        list.add("String"); // предупреждение suppressed\n    }\n\n    @SuppressWarnings({"unchecked", "deprecation"})\n    public void multipleWarnings() {\n        // подавляем несколько видов предупреждений\n    }\n\n    @SuppressWarnings("all")\n    public void suppressAll() {\n        // подавляем все предупреждения — используй с осторожностью!\n    }\n}' },
        { type: 'warning', value: '@SuppressWarnings не убирает реальные проблемы — только скрывает предупреждения. Используй его только когда уверен что знаешь что делаешь, и предупреждение действительно не важно.' }
      ]
    },
    {
      id: 3,
      title: '@FunctionalInterface, @SafeVarargs и другие',
      type: 'theory',
      content: [
        { type: 'text', value: 'Java содержит ещё несколько полезных встроенных аннотаций.' },
        { type: 'heading', value: '@FunctionalInterface — функциональный интерфейс' },
        { type: 'code', language: 'java', value: '// Проверяет что интерфейс имеет ровно один абстрактный метод\n@FunctionalInterface\ninterface Calculator {\n    int calculate(int a, int b);\n    // int anotherMethod(int x); // ОШИБКА! Нарушает FunctionalInterface\n\n    // default и static методы разрешены\n    default String describe() { return "Калькулятор"; }\n    static Calculator add() { return (a, b) -> a + b; }\n}\n\n// Использование с лямбдой\nCalculator sum = (a, b) -> a + b;\nCalculator multiply = (a, b) -> a * b;\nSystem.out.println(sum.calculate(3, 4));      // 7\nSystem.out.println(multiply.calculate(3, 4)); // 12' },
        { type: 'heading', value: '@SafeVarargs — безопасные varargs' },
        { type: 'code', language: 'java', value: '// Используется для методов с varargs и generics\n@SafeVarargs\npublic static <T> List<T> listOf(T... items) {\n    return Arrays.asList(items);\n}\n\n// Без @SafeVarargs — предупреждение компилятора\nList<String> words = listOf("один", "два", "три");' },
        { type: 'heading', value: '@Inherited — наследование аннотаций' },
        { type: 'code', language: 'java', value: 'import java.lang.annotation.*;\n\n// Аннотация будет наследоваться подклассами\n@Inherited\n@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.TYPE)\n@interface Category {\n    String value();\n}\n\n@Category("Animal")\nclass Animal { }\n\nclass Dog extends Animal { }\n\n// Dog тоже будет иметь @Category("Animal") — унаследовал\nCategory cat = Dog.class.getAnnotation(Category.class);\nSystem.out.println(cat.value()); // Animal' },
        { type: 'note', value: '@FunctionalInterface особенно полезна — она явно документирует намерение и защищает от случайного добавления второго абстрактного метода.' }
      ]
    },
    {
      id: 4,
      title: 'Создание собственных аннотаций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ты можешь создавать свои аннотации с помощью @interface. Аннотация может иметь элементы (как параметры) со значениями по умолчанию.' },
        { type: 'code', language: 'java', value: 'import java.lang.annotation.*;\n\n// Создаём свою аннотацию\n@Target(ElementType.METHOD)       // куда можно применять\n@Retention(RetentionPolicy.RUNTIME) // когда доступна\n@interface Todo {\n    String author();                  // обязательный элемент\n    String task() default "TODO";     // необязательный (есть default)\n    int priority() default 3;         // приоритет 1-5\n}\n\n// Используем\nclass Service {\n    @Todo(author = "Алина", task = "Добавить валидацию", priority = 1)\n    public void processPayment(double amount) {\n        System.out.println("Обработка платежа: " + amount);\n    }\n\n    @Todo(author = "Борис")  // task и priority используют default\n    public void sendEmail(String to) {\n        System.out.println("Отправка на: " + to);\n    }\n}' },
        { type: 'heading', value: 'Правила создания аннотаций' },
        { type: 'list', items: [
          'Аннотация объявляется через @interface',
          'Элементы выглядят как методы без тела',
          'Элементы могут иметь значение по умолчанию (default)',
          'Типы элементов: примитивы, String, Class, enum, другие аннотации, массивы из них',
          'Если один элемент без default — он обязателен при использовании'
        ]},
        { type: 'code', language: 'java', value: '// Аннотация с разными типами элементов\n@interface Config {\n    String name();                    // String\n    int timeout() default 30;         // int\n    boolean enabled() default true;   // boolean\n    String[] tags() default {};       // массив String\n    Class<?> handler() default Object.class; // Class\n}\n\n// Специальный случай: если один элемент называется value\n@interface Label {\n    String value(); // называется value — можно без имени\n}\n\n@Label("admin") // сокращение для @Label(value = "admin")\nclass AdminService { }' }
      ]
    },
    {
      id: 5,
      title: 'Retention, Target — мета-аннотации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мета-аннотации — это аннотации над аннотациями. Они определяют как и где можно использовать нашу аннотацию.' },
        { type: 'heading', value: '@Retention — когда аннотация доступна' },
        { type: 'list', items: [
          'RetentionPolicy.SOURCE — только в исходном коде, компилятор удаляет. @Override, @SuppressWarnings',
          'RetentionPolicy.CLASS — в .class файле, но JVM не загружает. По умолчанию',
          'RetentionPolicy.RUNTIME — доступна во время выполнения через рефлексию. Нужна для большинства фреймворков'
        ]},
        { type: 'code', language: 'java', value: 'import java.lang.annotation.*;\n\n// SOURCE: только для проверок компилятором\n@Retention(RetentionPolicy.SOURCE)\n@interface SourceOnly { }\n\n// RUNTIME: для фреймворков и рефлексии\n@Retention(RetentionPolicy.RUNTIME)\n@interface RuntimeVisible {\n    String value();\n}' },
        { type: 'heading', value: '@Target — куда можно применять' },
        { type: 'code', language: 'java', value: 'import java.lang.annotation.ElementType;\n\n// ElementType.TYPE — на классы, интерфейсы, enum\n// ElementType.METHOD — на методы\n// ElementType.FIELD — на поля\n// ElementType.PARAMETER — на параметры методов\n// ElementType.CONSTRUCTOR — на конструкторы\n// ElementType.LOCAL_VARIABLE — на локальные переменные\n// ElementType.ANNOTATION_TYPE — на другие аннотации (мета-аннотации)\n// ElementType.PACKAGE — на пакеты\n\n@Target({ElementType.FIELD, ElementType.METHOD})\n@Retention(RetentionPolicy.RUNTIME)\n@interface Validate {\n    int min() default 0;\n    int max() default Integer.MAX_VALUE;\n    boolean notNull() default false;\n}' },
        { type: 'heading', value: 'Чтение аннотаций через Reflection' },
        { type: 'code', language: 'java', value: '@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.METHOD)\n@interface Description {\n    String value();\n}\n\nclass MyClass {\n    @Description("Метод приветствия")\n    public void hello() { System.out.println("Привет!"); }\n}\n\n// Читаем аннотацию через рефлексию\njava.lang.reflect.Method method = MyClass.class.getMethod("hello");\nDescription desc = method.getAnnotation(Description.class);\nif (desc != null) {\n    System.out.println("Описание метода: " + desc.value());\n    // Описание метода: Метод приветствия\n}' }
      ]
    },
    {
      id: 6,
      title: 'Практика: создание и использование аннотаций',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай систему валидации на основе аннотаций.',
      requirements: [
        'Создай аннотацию @NotEmpty с Retention RUNTIME и Target FIELD',
        'Создай аннотацию @MinLength(int value) с Retention RUNTIME и Target FIELD',
        'Создай класс User с полями String name и String password',
        'Пометь name аннотацией @NotEmpty, password — @NotEmpty и @MinLength(8)',
        'Создай метод static List<String> validate(Object obj) — проходит по всем полям через рефлексию, проверяет аннотации и собирает ошибки',
        'Проверь User("", "qwerty") и выведи ошибки, проверь User("Алина", "SecurePass123") и выведи "OK"'
      ],
      expectedOutput: 'Ошибки для пустого пользователя:\n- name: не должно быть пустым\n- password: не должно быть пустым\n- password: минимальная длина 8\nПроверка корректного пользователя: OK',
      hint: 'Для рефлексии: obj.getClass().getDeclaredFields() — получить поля. field.setAccessible(true); String value = (String) field.get(obj); — прочитать значение. field.isAnnotationPresent(NotEmpty.class) — проверить аннотацию. field.getAnnotation(MinLength.class).value() — получить значение аннотации.',
      solution: 'import java.lang.annotation.*;\nimport java.lang.reflect.*;\nimport java.util.*;\n\n@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.FIELD)\n@interface NotEmpty {}\n\n@Retention(RetentionPolicy.RUNTIME)\n@Target(ElementType.FIELD)\n@interface MinLength {\n    int value();\n}\n\nclass User {\n    @NotEmpty\n    String name;\n\n    @NotEmpty\n    @MinLength(8)\n    String password;\n\n    User(String name, String password) {\n        this.name = name;\n        this.password = password;\n    }\n}\n\npublic class Main {\n    static List<String> validate(Object obj) throws IllegalAccessException {\n        List<String> errors = new ArrayList<>();\n        for (Field field : obj.getClass().getDeclaredFields()) {\n            field.setAccessible(true);\n            String value = (String) field.get(obj);\n            String fieldName = field.getName();\n\n            if (field.isAnnotationPresent(NotEmpty.class)) {\n                if (value == null || value.isEmpty()) {\n                    errors.add("- " + fieldName + ": не должно быть пустым");\n                }\n            }\n\n            if (field.isAnnotationPresent(MinLength.class)) {\n                int min = field.getAnnotation(MinLength.class).value();\n                if (value == null || value.length() < min) {\n                    errors.add("- " + fieldName + ": минимальная длина " + min);\n                }\n            }\n        }\n        return errors;\n    }\n\n    public static void main(String[] args) throws Exception {\n        User bad = new User("", "qwerty");\n        List<String> errors = validate(bad);\n        System.out.println("Ошибки для пустого пользователя:");\n        errors.forEach(System.out::println);\n\n        User good = new User("Алина", "SecurePass123");\n        List<String> errors2 = validate(good);\n        System.out.println("Проверка корректного пользователя: " +\n            (errors2.isEmpty() ? "OK" : errors2));\n    }\n}',
      explanation: 'Это мини-версия того, как работает Bean Validation (Hibernate Validator) в реальных Java-приложениях. getDeclaredFields() возвращает все поля класса. setAccessible(true) позволяет читать private поля. getAnnotation() возвращает null если аннотации нет — поэтому сначала проверяем isAnnotationPresent(). Именно так работают фреймворки: они читают аннотации и выполняют логику на их основе.'
    }
  ]
}
