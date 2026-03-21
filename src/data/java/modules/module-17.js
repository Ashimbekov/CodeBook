export default {
  id: 17,
  title: 'Полиморфизм',
  description: 'Один интерфейс — много реализаций. Перегрузка и переопределение методов, динамическая диспетчеризация',
  lessons: [
    {
      id: 1,
      title: 'Что такое полиморфизм?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Полиморфизм (от греч. "много форм") — это возможность использовать один и тот же код для работы с объектами разных типов. Одно действие — разные результаты в зависимости от типа объекта.' },
        { type: 'tip', value: 'Полиморфизм — как кнопка "воспроизвести". На телефоне она играет музыку, на пульте TV — включает фильм, в плеере — запускает трек. Одна кнопка, одно название, но разное поведение в зависимости от устройства!' },
        { type: 'heading', value: 'Два вида полиморфизма в Java' },
        { type: 'list', items: [
          'Полиморфизм времени компиляции (compile-time) — перегрузка методов (overloading)',
          'Полиморфизм времени выполнения (runtime) — переопределение методов (overriding)'
        ]},
        { type: 'code', language: 'java', value: '// Простой пример: разные животные, один вызов\npublic class Animal {\n    String name;\n    public Animal(String name) { this.name = name; }\n    void makeSound() { System.out.println("..."); }\n}\n\npublic class Cat extends Animal {\n    public Cat(String name) { super(name); }\n    @Override void makeSound() { System.out.println(name + ": Мяу!"); }\n}\n\npublic class Dog extends Animal {\n    public Dog(String name) { super(name); }\n    @Override void makeSound() { System.out.println(name + ": Гав!"); }\n}\n\npublic class Cow extends Animal {\n    public Cow(String name) { super(name); }\n    @Override void makeSound() { System.out.println(name + ": Муу!"); }\n}\n\n// ПОЛИМОРФИЗМ: один метод makeSound() — разное поведение!\nAnimal[] animals = { new Cat("Мурзик"), new Dog("Рекс"), new Cow("Зорька") };\nfor (Animal a : animals) {\n    a.makeSound(); // Каждый кричит по-своему!\n}\n// Мурзик: Мяу!\n// Рекс: Гав!\n// Зорька: Муу!' },
        { type: 'note', value: 'Полиморфизм позволяет писать код, который работает с абстракцией (Animal), не зная конкретного типа. Это делает код гибким и расширяемым.' }
      ]
    },
    {
      id: 2,
      title: 'Перегрузка методов (Compile-time полиморфизм)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Перегрузка (overloading) — несколько методов с одинаковым именем, но разными параметрами. Java выбирает нужный метод во время компиляции.' },
        { type: 'heading', value: 'Правила перегрузки' },
        { type: 'list', items: [
          'Методы должны иметь разные параметры (количество или типы)',
          'Возвращаемый тип не влияет на перегрузку',
          'Модификатор доступа не влияет на перегрузку',
          'Java выбирает метод по типам аргументов при вызове'
        ]},
        { type: 'code', language: 'java', value: 'public class Printer {\n    // Один метод — много версий!\n    void print(String text) {\n        System.out.println("Текст: " + text);\n    }\n\n    void print(int number) {\n        System.out.println("Число: " + number);\n    }\n\n    void print(double number) {\n        System.out.println("Дробное: " + number);\n    }\n\n    void print(String text, int times) {\n        for (int i = 0; i < times; i++) {\n            System.out.println(text);\n        }\n    }\n\n    void print(int a, int b) {\n        System.out.println("Сумма: " + (a + b));\n    }\n}\n\nPrinter p = new Printer();\np.print("Привет");       // Текст: Привет\np.print(42);             // Число: 42\np.print(3.14);           // Дробное: 3.14\np.print("Java", 3);      // Java (три раза)\np.print(10, 20);         // Сумма: 30' },
        { type: 'heading', value: 'Перегрузка конструкторов — это тоже перегрузка!' },
        { type: 'code', language: 'java', value: 'public class Pizza {\n    String size;\n    String crust;\n    String[] toppings;\n\n    public Pizza(String size) {\n        this(size, "Тонкое");\n    }\n\n    public Pizza(String size, String crust) {\n        this.size = size;\n        this.crust = crust;\n        this.toppings = new String[0];\n    }\n\n    // Перегрузка метода addTopping\n    void addTopping(String topping) {\n        System.out.println("Добавляем " + topping + " на пиццу " + size);\n    }\n\n    void addTopping(String t1, String t2) {\n        System.out.println("Добавляем " + t1 + " и " + t2);\n    }\n}\n\nPizza p1 = new Pizza("Большая");\np1.addTopping("Пепперони");\np1.addTopping("Грибы", "Оливки");' },
        { type: 'tip', value: 'Перегрузку называют "compile-time полиморфизмом" потому что Java видит типы аргументов ещё при компиляции и знает, какой метод вызвать.' }
      ]
    },
    {
      id: 3,
      title: 'Приведение типов: upcasting',
      type: 'theory',
      content: [
        { type: 'text', value: 'Upcasting (приведение вверх) — это когда объект подкласса присваивается переменной родительского класса. Это безопасно и происходит автоматически.' },
        { type: 'tip', value: 'Upcasting — как положить кошку в корзину для животных. Кошка IS-A животное, поэтому это работает. Но когда она лежит в корзине "для животных", ты не можешь вызвать методы специфичные для кошек — только общие методы животных.' },
        { type: 'code', language: 'java', value: 'public class Animal {\n    String name;\n    public Animal(String name) { this.name = name; }\n    void eat() { System.out.println(name + " ест"); }\n}\n\npublic class Cat extends Animal {\n    public Cat(String name) { super(name); }\n    void eat() { System.out.println(name + " ест рыбу"); }\n    void purr() { System.out.println(name + " мурчит"); }\n}\n\n// Upcasting — автоматическое приведение\nCat cat = new Cat("Мурзик");\nAnimal animal = cat; // Upcasting! Неявное, автоматическое\n\n// или явно\nAnimal animal2 = (Animal) new Cat("Пушок");\n\nanimal.eat();   // "Мурзик ест рыбу" — работает! (runtime полиморфизм)\n// animal.purr(); // ОШИБКА! Animal не знает про purr()\n\n// Но cat знает!\ncat.purr(); // Мурзик мурчит' },
        { type: 'heading', value: 'Зачем нужен upcasting?' },
        { type: 'code', language: 'java', value: '// Один массив для разных подтипов!\nAnimal[] animals = new Animal[4];\nanimals[0] = new Cat("Мурзик"); // Upcasting!\nanimals[1] = new Dog("Шарик");  // Upcasting!\nanimals[2] = new Cat("Кися");   // Upcasting!\nanimals[3] = new Dog("Тузик");  // Upcasting!\n\n// Один метод для всех:\nvoid makeAllEat(Animal[] animals) {\n    for (Animal a : animals) {\n        a.eat(); // Полиморфизм!\n    }\n}' }
      ]
    },
    {
      id: 4,
      title: 'Приведение типов: downcasting',
      type: 'theory',
      content: [
        { type: 'text', value: 'Downcasting (приведение вниз) — это когда переменная родительского класса приводится к типу подкласса. Это опасно и требует явного приведения.' },
        { type: 'tip', value: 'Downcasting — как достать кошку из корзины "для животных". Ты знаешь, что там кошка, но система — нет. Ты говоришь: "Я уверен, что это кошка!" и достаёшь как кошку. Если там оказалась собака — ClassCastException!' },
        { type: 'code', language: 'java', value: 'Animal animal = new Cat("Мурзик"); // Upcasting (кошка -> животное)\n\n// Downcasting — явно!\nCat cat = (Cat) animal; // Я говорю компилятору: "Это точно Cat!"\ncat.purr(); // Теперь можем вызвать метод кошки!\n\n// Опасный downcasting:\nAnimal dog = new Dog("Шарик");\n// Cat wrongCast = (Cat) dog; // ClassCastException в runtime!' },
        { type: 'heading', value: 'Безопасный downcasting с instanceof' },
        { type: 'code', language: 'java', value: 'Animal[] animals = { new Cat("Мурзик"), new Dog("Шарик"), new Cat("Пушок") };\n\nfor (Animal a : animals) {\n    a.eat(); // Общий метод\n\n    // Сначала проверяем тип, потом приводим!\n    if (a instanceof Cat) {\n        Cat cat = (Cat) a; // Безопасно!\n        cat.purr();\n    } else if (a instanceof Dog) {\n        Dog dog = (Dog) a;\n        dog.bark();\n    }\n}\n\n// Современный синтаксис Java 16+ (pattern matching)\nfor (Animal a : animals) {\n    if (a instanceof Cat cat) { // Проверяет И приводит!\n        cat.purr();\n    }\n}' },
        { type: 'warning', value: 'Частый downcasting — признак плохой архитектуры. Если ты постоянно проверяешь instanceof и приводишь типы, лучше пересмотреть дизайн классов.' }
      ]
    },
    {
      id: 5,
      title: 'Динамическая диспетчеризация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Динамическая диспетчеризация (dynamic dispatch) — это механизм, при котором Java определяет, какой метод вызвать, в RUNTIME (во время выполнения), а не при компиляции. Это основа runtime полиморфизма.' },
        { type: 'tip', value: 'Представь: у тебя конверт, на котором написано "Животное". Внутри — кошка. Ты говоришь "сыграй звук" — и кошка говорит "Мяу". Java открывает конверт в момент выполнения и смотрит: кто там? Кошка? Тогда вызываем метод кошки!' },
        { type: 'code', language: 'java', value: 'public class Shape {\n    double area() { return 0; }\n    String describe() {\n        return "Фигура с площадью " + area();\n    }\n}\n\npublic class Circle extends Shape {\n    double radius;\n    Circle(double r) { this.radius = r; }\n\n    @Override\n    double area() { return Math.PI * radius * radius; }\n}\n\npublic class Square extends Shape {\n    double side;\n    Square(double s) { this.side = s; }\n\n    @Override\n    double area() { return side * side; }\n}\n\n// describe() вызывает area() — какую версию?\nShape s1 = new Circle(5);\nShape s2 = new Square(4);\n\n// describe() определён в Shape, но area() вызывается ДИНАМИЧЕСКИ!\nSystem.out.println(s1.describe()); // Фигура с площадью 78.539...\nSystem.out.println(s2.describe()); // Фигура с площадью 16.0\n\n// Java смотрит на реальный тип объекта в runtime!' },
        { type: 'heading', value: 'Таблица виртуальных методов (vtable)' },
        { type: 'text', value: 'Под капотом Java использует таблицу виртуальных методов (vtable). Каждый класс имеет свою таблицу, где для каждого метода указан адрес его реализации. При вызове метода Java смотрит в таблицу реального объекта.' },
        { type: 'note', value: 'final методы и static методы не участвуют в динамической диспетчеризации — их вызов определяется при компиляции.' }
      ]
    },
    {
      id: 6,
      title: 'Полиморфизм в практике',
      type: 'theory',
      content: [
        { type: 'text', value: 'Полиморфизм позволяет писать очень гибкий код. Рассмотрим реальный пример — система оплаты с разными методами.' },
        { type: 'code', language: 'java', value: '// Абстракция — общий тип оплаты\npublic class Payment {\n    String owner;\n    double amount;\n\n    public Payment(String owner, double amount) {\n        this.owner = owner;\n        this.amount = amount;\n    }\n\n    void process() {\n        System.out.println("Обработка платежа " + amount + " тг");\n    }\n\n    boolean validate() {\n        return amount > 0;\n    }\n}\n\n// Разные способы оплаты\npublic class CashPayment extends Payment {\n    public CashPayment(String owner, double amount) {\n        super(owner, amount);\n    }\n\n    @Override\n    void process() {\n        System.out.println("Наличные: " + owner + " платит " + amount + " тг");\n    }\n}\n\npublic class CardPayment extends Payment {\n    String cardNumber;\n\n    public CardPayment(String owner, double amount, String cardNumber) {\n        super(owner, amount);\n        this.cardNumber = cardNumber;\n    }\n\n    @Override\n    void process() {\n        String masked = "**** **** **** " + cardNumber.substring(cardNumber.length() - 4);\n        System.out.println("Карта " + masked + ": " + owner + " платит " + amount + " тг");\n    }\n\n    @Override\n    boolean validate() {\n        return super.validate() && cardNumber.length() == 16;\n    }\n}\n\npublic class CryptoPayment extends Payment {\n    String walletAddress;\n\n    public CryptoPayment(String owner, double amount, String walletAddress) {\n        super(owner, amount);\n        this.walletAddress = walletAddress;\n    }\n\n    @Override\n    void process() {\n        System.out.println("Крипто: " + owner + " отправляет " + amount + " USDT на " + walletAddress.substring(0, 8) + "...");\n    }\n}' },
        { type: 'code', language: 'java', value: '// Полиморфная обработка — один код для всех типов!\npublic class PaymentProcessor {\n    void processAll(Payment[] payments) {\n        for (Payment p : payments) {\n            if (p.validate()) {\n                p.process(); // Полиморфизм! Нужный метод вызывается автоматически\n            } else {\n                System.out.println("Платёж " + p.owner + " не прошёл валидацию");\n            }\n        }\n    }\n}\n\nPayment[] payments = {\n    new CashPayment("Нурдаулет", 5000),\n    new CardPayment("Айгерим", 15000, "1234567890123456"),\n    new CryptoPayment("Берик", 100, "0xABCDEF1234567890"),\n    new CardPayment("Дана", 0, "1234") // Невалидный!\n};\n\nPaymentProcessor processor = new PaymentProcessor();\nprocessor.processAll(payments);' },
        { type: 'tip', value: 'Заметь: PaymentProcessor не знает о конкретных типах платежей. Его метод processAll() работает с любым Payment — существующим и будущим. Это и есть сила полиморфизма!' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Полиморфная фигура',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай иерархию геометрических фигур с полиморфными методами вычисления.',
      requirements: [
        'Базовый класс Shape: поле color, метод area() возвращает 0.0, метод perimeter() возвращает 0.0, метод describe() использует area() и perimeter()',
        'Circle extends Shape: поле radius, переопределить area() и perimeter()',
        'Rectangle extends Shape: поля width и height, переопределить area() и perimeter()',
        'Triangle extends Shape: поля a, b, c (стороны), переопределить perimeter(), для area() используй формулу Герона',
        'Создай массив Shape[] с разными фигурами и выведи describe() для каждой',
        'Найди и выведи фигуру с наибольшей площадью'
      ],
      expectedOutput: 'Синий Круг: площадь=78.54, периметр=31.42\nКрасный Прямоугольник: площадь=24.00, периметр=20.00\nЗелёный Треугольник: площадь=6.00, периметр=12.00\nНаибольшая площадь: Синий Круг (78.54)',
      hint: 'Формула Герона: s = (a+b+c)/2; area = sqrt(s*(s-a)*(s-b)*(s-c)). Для поиска максимума пройди по массиву сохраняя maxShape.',
      solution: 'public class Shape {\n    String color;\n    public Shape(String color) { this.color = color; }\n    double area() { return 0; }\n    double perimeter() { return 0; }\n    void describe() {\n        System.out.printf("%s %s: площадь=%.2f, периметр=%.2f%n",\n            color, getClass().getSimpleName(), area(), perimeter());\n    }\n}\n\npublic class Circle extends Shape {\n    double radius;\n    public Circle(String color, double radius) {\n        super(color); this.radius = radius;\n    }\n    @Override double area() { return Math.PI * radius * radius; }\n    @Override double perimeter() { return 2 * Math.PI * radius; }\n}\n\npublic class Rectangle extends Shape {\n    double width, height;\n    public Rectangle(String color, double width, double height) {\n        super(color); this.width = width; this.height = height;\n    }\n    @Override double area() { return width * height; }\n    @Override double perimeter() { return 2 * (width + height); }\n}\n\npublic class Triangle extends Shape {\n    double a, b, c;\n    public Triangle(String color, double a, double b, double c) {\n        super(color); this.a = a; this.b = b; this.c = c;\n    }\n    @Override double perimeter() { return a + b + c; }\n    @Override double area() {\n        double s = (a + b + c) / 2;\n        return Math.sqrt(s * (s-a) * (s-b) * (s-c));\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Shape[] shapes = {\n            new Circle("Синий", 5),\n            new Rectangle("Красный", 4, 6),\n            new Triangle("Зелёный", 3, 4, 5)\n        };\n        for (Shape s : shapes) s.describe();\n\n        Shape maxShape = shapes[0];\n        for (Shape s : shapes) {\n            if (s.area() > maxShape.area()) maxShape = s;\n        }\n        System.out.printf("Наибольшая площадь: %s %s (%.2f)%n",\n            maxShape.color, maxShape.getClass().getSimpleName(), maxShape.area());\n    }\n}',
      explanation: 'Полиморфизм позволяет хранить разные фигуры в массиве Shape[] и вызывать describe() единообразно. describe() в родительском классе вызывает area() и perimeter() полиморфно — получая правильные значения для каждой фигуры.'
    }
  ]
}
