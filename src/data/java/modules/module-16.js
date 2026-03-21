export default {
  id: 16,
  title: 'Наследование',
  description: 'Как классы наследуют свойства и методы друг от друга с помощью extends',
  lessons: [
    {
      id: 1,
      title: 'Что такое наследование?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Наследование — это механизм, при котором один класс (дочерний) получает все поля и методы другого класса (родительского). Это позволяет переиспользовать код и выражать отношение "является" (is-a).' },
        { type: 'tip', value: 'Наследование — как в жизни: кошка ЯВЛЯЕТСЯ животным. У неё есть всё что есть у любого животного (имя, возраст, умение есть), плюс своё кошачье (мурчание, игра с клубком). Кошка наследует от животного!' },
        { type: 'heading', value: 'Пример из жизни' },
        { type: 'list', items: [
          'Animal (Животное) — базовый класс',
          'Cat (Кошка) extends Animal — наследует от Animal',
          'Dog (Собака) extends Animal — тоже наследует от Animal',
          'GoldenRetriever extends Dog — наследует от Dog'
        ]},
        { type: 'code', language: 'java', value: '// Родительский класс (суперкласс)\npublic class Animal {\n    String name;\n    int age;\n\n    public Animal(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n\n    void eat() {\n        System.out.println(name + " кушает");\n    }\n\n    void sleep() {\n        System.out.println(name + " спит");\n    }\n\n    public String toString() {\n        return "Животное: " + name + ", возраст: " + age;\n    }\n}\n\n// Дочерний класс (подкласс)\npublic class Cat extends Animal {\n    String color;\n\n    public Cat(String name, int age, String color) {\n        super(name, age); // вызываем конструктор родителя!\n        this.color = color;\n    }\n\n    // Свой метод, которого нет у Animal\n    void purr() {\n        System.out.println(name + " мурчит: Муррр...");\n    }\n}\n\n// Cat наследует eat() и sleep() от Animal!\nCat cat = new Cat("Мурзик", 3, "Рыжий");\ncat.eat();   // Мурзик кушает (унаследовано!)\ncat.sleep(); // Мурзик спит (унаследовано!)\ncat.purr();  // Мурзик мурчит: Муррр... (своё)' },
        { type: 'note', value: 'Дочерний класс "is-a" родительский. Cat is-a Animal — кошка является животным. Это ключевое отношение для наследования.' }
      ]
    },
    {
      id: 2,
      title: 'Ключевое слово extends',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ключевое слово extends используется для создания дочернего класса. В Java класс может наследовать только от одного класса (одиночное наследование).' },
        { type: 'code', language: 'java', value: '// Базовый класс\npublic class Shape {\n    String color;\n    boolean filled;\n\n    public Shape(String color, boolean filled) {\n        this.color = color;\n        this.filled = filled;\n    }\n\n    double area() {\n        return 0; // Базовая реализация\n    }\n\n    double perimeter() {\n        return 0;\n    }\n\n    public String toString() {\n        return "Фигура: " + color + (filled ? " (закрашена)" : " (контур)");\n    }\n}\n\n// Подкласс Circle\npublic class Circle extends Shape {\n    double radius;\n\n    public Circle(String color, boolean filled, double radius) {\n        super(color, filled); // Сначала инициализируем родителя!\n        this.radius = radius;\n    }\n\n    // Переопределяем метод родителя\n    double area() {\n        return Math.PI * radius * radius;\n    }\n\n    double perimeter() {\n        return 2 * Math.PI * radius;\n    }\n\n    public String toString() {\n        return "Круг r=" + radius + " " + color;\n    }\n}\n\n// Подкласс Rectangle\npublic class Rectangle extends Shape {\n    double width, height;\n\n    public Rectangle(String color, boolean filled, double width, double height) {\n        super(color, filled);\n        this.width = width;\n        this.height = height;\n    }\n\n    double area() {\n        return width * height;\n    }\n\n    double perimeter() {\n        return 2 * (width + height);\n    }\n}\n\nCircle c = new Circle("Синий", true, 5.0);\nSystem.out.println(c);\nSystem.out.println("Площадь: " + c.area());\n\nRectangle r = new Rectangle("Красный", false, 4.0, 6.0);\nSystem.out.println("Площадь: " + r.area());' },
        { type: 'warning', value: 'Java не поддерживает множественное наследование классов — нельзя написать class A extends B, C. Для этого используются интерфейсы (модуль 19).' }
      ]
    },
    {
      id: 3,
      title: 'Ключевое слово super',
      type: 'theory',
      content: [
        { type: 'text', value: 'super — это ссылка на родительский класс. Используется для вызова конструктора родителя (super()) и методов родителя (super.метод()).' },
        { type: 'tip', value: 'super — это как обращение к папе. "Папа (super), ты умеешь готовить суп — можешь приготовить? А я добавлю свои специи сверху." Дочерний класс использует методы родителя и дополняет их.' },
        { type: 'heading', value: 'super() — вызов конструктора родителя' },
        { type: 'code', language: 'java', value: 'public class Vehicle {\n    String brand;\n    int year;\n    double price;\n\n    public Vehicle(String brand, int year, double price) {\n        this.brand = brand;\n        this.year = year;\n        this.price = price;\n    }\n\n    void displayInfo() {\n        System.out.println(brand + " (" + year + ") — " + price + " тг");\n    }\n}\n\npublic class Car extends Vehicle {\n    int doors;\n    boolean isAutomatic;\n\n    public Car(String brand, int year, double price, int doors, boolean isAutomatic) {\n        super(brand, year, price); // ОБЯЗАТЕЛЬНО первой строкой!\n        this.doors = doors;\n        this.isAutomatic = isAutomatic;\n    }\n\n    void displayInfo() {\n        super.displayInfo(); // Вызываем метод родителя!\n        System.out.println("Дверей: " + doors + ", Автомат: " + isAutomatic);\n    }\n}\n\nCar car = new Car("Toyota", 2023, 12000000, 4, true);\ncar.displayInfo();\n// Toyota (2023) — 1.2E7 тг\n// Дверей: 4, Автомат: true' },
        { type: 'heading', value: 'super.метод() — вызов метода родителя' },
        { type: 'code', language: 'java', value: 'public class Employee {\n    String name;\n    double baseSalary;\n\n    public Employee(String name, double baseSalary) {\n        this.name = name;\n        this.baseSalary = baseSalary;\n    }\n\n    double calculateSalary() {\n        return baseSalary;\n    }\n\n    public String toString() {\n        return name + " — " + calculateSalary() + " тг";\n    }\n}\n\npublic class Manager extends Employee {\n    double bonus;\n\n    public Manager(String name, double baseSalary, double bonus) {\n        super(name, baseSalary);\n        this.bonus = bonus;\n    }\n\n    double calculateSalary() {\n        // Базовая зарплата + бонус\n        return super.calculateSalary() + bonus;\n    }\n}\n\nManager mgr = new Manager("Нурдаулет", 300000, 100000);\nSystem.out.println(mgr); // Нурдаулет — 400000.0 тг' },
        { type: 'warning', value: 'super() должен быть ПЕРВОЙ строкой конструктора. Если ты не написал super() явно, Java автоматически добавит super() без параметров.' }
      ]
    },
    {
      id: 4,
      title: 'Переопределение методов (@Override)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Переопределение (Override) — это когда дочерний класс создаёт свою версию метода родителя. Метод должен иметь то же имя, параметры и возвращаемый тип.' },
        { type: 'tip', value: 'Переопределение — как фирменный рецепт семьи. Бабушка готовит борщ по-своему, мама взяла её рецепт и добавила свой секрет. Метод называется одинаково "приготовитьБорщ()", но работает немного по-своему у каждого.' },
        { type: 'heading', value: 'Аннотация @Override' },
        { type: 'code', language: 'java', value: 'public class Animal {\n    String name;\n\n    public Animal(String name) {\n        this.name = name;\n    }\n\n    void makeSound() {\n        System.out.println("Животное издаёт звук");\n    }\n}\n\npublic class Cat extends Animal {\n    public Cat(String name) {\n        super(name);\n    }\n\n    @Override // Аннотация говорит: "Я переопределяю метод родителя"\n    void makeSound() {\n        System.out.println(name + " говорит: Мяу!");\n    }\n}\n\npublic class Dog extends Animal {\n    public Dog(String name) {\n        super(name);\n    }\n\n    @Override\n    void makeSound() {\n        System.out.println(name + " говорит: Гав!");\n    }\n}\n\npublic class Duck extends Animal {\n    public Duck(String name) {\n        super(name);\n    }\n\n    @Override\n    void makeSound() {\n        System.out.println(name + " говорит: Кря!");\n    }\n}\n\n// Каждый по-своему!\nAnimal[] animals = {\n    new Cat("Мурзик"),\n    new Dog("Шарик"),\n    new Duck("Утёнок")\n};\n\nfor (Animal a : animals) {\n    a.makeSound(); // Вызывается НУЖНАЯ версия метода!\n}\n// Мурзик говорит: Мяу!\n// Шарик говорит: Гав!\n// Утёнок говорит: Кря!' },
        { type: 'list', items: [
          '@Override — аннотация для проверки: если метода нет в родителе, компилятор выдаст ошибку',
          'Переопределённый метод не может быть менее доступным (private нельзя заменить public)',
          'Можно вызвать оригинальный метод через super.makeSound()'
        ]},
        { type: 'note', value: '@Override — хорошая практика. Она защищает от опечаток: если ты написал makesoind() вместо makeSound(), @Override укажет на ошибку.' }
      ]
    },
    {
      id: 5,
      title: 'Класс Object',
      type: 'theory',
      content: [
        { type: 'text', value: 'Все классы в Java неявно наследуют от класса Object. Object — это самый базовый класс, "прародитель" всех классов. Он находится в пакете java.lang.' },
        { type: 'heading', value: 'Методы класса Object' },
        { type: 'code', language: 'java', value: '// Класс Object имеет важные методы:\n\n// toString() — строковое представление\n// equals() — проверка на равенство\n// hashCode() — хэш-код объекта\n// getClass() — класс объекта\n\npublic class Point {\n    double x, y;\n\n    public Point(double x, double y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    // Переопределяем equals из Object\n    @Override\n    public boolean equals(Object obj) {\n        if (this == obj) return true;\n        if (obj == null || getClass() != obj.getClass()) return false;\n        Point other = (Point) obj;\n        return x == other.x && y == other.y;\n    }\n\n    @Override\n    public String toString() {\n        return "(" + x + ", " + y + ")";\n    }\n}\n\nPoint p1 = new Point(1, 2);\nPoint p2 = new Point(1, 2);\nPoint p3 = new Point(3, 4);\n\nSystem.out.println(p1);             // (1.0, 2.0)\nSystem.out.println(p1.equals(p2)); // true\nSystem.out.println(p1.equals(p3)); // false\nSystem.out.println(p1.getClass().getSimpleName()); // Point' },
        { type: 'heading', value: 'equals() vs ==' },
        { type: 'code', language: 'java', value: 'String s1 = new String("Java");\nString s2 = new String("Java");\n\n// == сравнивает ССЫЛКИ (адреса в памяти)\nSystem.out.println(s1 == s2);     // false! Разные объекты\n\n// equals() сравнивает СОДЕРЖИМОЕ\nSystem.out.println(s1.equals(s2)); // true! Одинаковое содержимое' },
        { type: 'tip', value: 'Для строк и объектов всегда используй equals() для сравнения содержимого. == для объектов — только для сравнения ссылок (тот же самый объект в памяти).' }
      ]
    },
    {
      id: 6,
      title: 'Оператор instanceof',
      type: 'theory',
      content: [
        { type: 'text', value: 'instanceof — это оператор, который проверяет, является ли объект экземпляром определённого класса или его подкласса.' },
        { type: 'code', language: 'java', value: 'public class Animal { }\npublic class Cat extends Animal { }\npublic class Dog extends Animal { }\n\nCat cat = new Cat();\nDog dog = new Dog();\n\nSystem.out.println(cat instanceof Cat);    // true\nSystem.out.println(cat instanceof Animal); // true (Cat IS-A Animal)\nSystem.out.println(cat instanceof Dog);    // false\nSystem.out.println(dog instanceof Animal); // true' },
        { type: 'heading', value: 'Практическое использование' },
        { type: 'code', language: 'java', value: 'public class Animal {\n    String name;\n    public Animal(String name) { this.name = name; }\n    void makeSound() { System.out.println("..."); }\n}\n\npublic class Cat extends Animal {\n    public Cat(String name) { super(name); }\n    void makeSound() { System.out.println(name + ": Мяу!"); }\n    void purr() { System.out.println(name + ": Мурр..."); }\n}\n\npublic class Dog extends Animal {\n    public Dog(String name) { super(name); }\n    void makeSound() { System.out.println(name + ": Гав!"); }\n    void fetch() { System.out.println(name + " приносит мяч!"); }\n}\n\n// Разные типы в одном массиве\nAnimal[] animals = { new Cat("Мурзик"), new Dog("Шарик"), new Cat("Пушок") };\n\nfor (Animal a : animals) {\n    a.makeSound(); // Общий метод\n\n    // Проверяем тип и вызываем специфичный метод\n    if (a instanceof Cat) {\n        Cat cat = (Cat) a; // приведение типа\n        cat.purr();\n    } else if (a instanceof Dog) {\n        Dog dog = (Dog) a;\n        dog.fetch();\n    }\n}' },
        { type: 'heading', value: 'Новый синтаксис Java 16+' },
        { type: 'code', language: 'java', value: '// Современный синтаксис — pattern matching\nfor (Animal a : animals) {\n    if (a instanceof Cat cat) { // Проверяет И приводит тип сразу!\n        cat.purr();\n    } else if (a instanceof Dog dog) {\n        dog.fetch();\n    }\n}' }
      ]
    },
    {
      id: 7,
      title: 'Иерархия наследования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Наследование может быть многоуровневым — класс C наследует от B, который наследует от A. Это образует иерархию (дерево) классов.' },
        { type: 'code', language: 'java', value: '// Уровень 1 — самый общий\npublic class LivingBeing {\n    boolean isAlive = true;\n    void breathe() { System.out.println("Дышит"); }\n}\n\n// Уровень 2\npublic class Animal extends LivingBeing {\n    String name;\n    public Animal(String name) { this.name = name; }\n    void eat() { System.out.println(name + " ест"); }\n}\n\n// Уровень 3\npublic class Mammal extends Animal {\n    boolean warmBlooded = true;\n    public Mammal(String name) { super(name); }\n    void feedYoung() { System.out.println(name + " кормит детёнышей"); }\n}\n\n// Уровень 4 — самый конкретный\npublic class Dog extends Mammal {\n    String breed;\n    public Dog(String name, String breed) {\n        super(name);\n        this.breed = breed;\n    }\n    void bark() { System.out.println(name + " (" + breed + "): Гав!"); }\n}\n\n// Dog наследует ВСЁ от всех уровней!\nDog rex = new Dog("Рекс", "Немецкая овчарка");\nrex.breathe();    // От LivingBeing\nrex.eat();        // От Animal\nrex.feedYoung();  // От Mammal\nrex.bark();       // Своё' },
        { type: 'tip', value: 'Глубокая иерархия — 5+ уровней — обычно плохой знак. Код становится сложным. Лучше использовать более плоскую иерархию (2-3 уровня) и дополнять интерфейсами.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Иерархия транспорта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай иерархию классов транспортных средств с наследованием.',
      requirements: [
        'Класс Vehicle: поля brand, speed, maxSpeed; методы accelerate(int), brake(int), toString()',
        'Класс Car extends Vehicle: поля doors, fuelType; метод refuel()',
        'Класс Truck extends Vehicle: поле cargoCapacity; метод loadCargo(double)',
        'Car и Truck переопределяют toString()',
        'Создай по одному объекту каждого класса и вызови их методы',
        'Используй super() в конструкторах'
      ],
      expectedOutput: 'Toyota Camry (4 дв., Бензин) — 0 км/ч\nRазгон! Скорость: 40 км/ч\nЗаправляемся бензином!\nKamaz 5320 (грузоподъёмность: 10.0т) — 0 км/ч\nЗагружаем 5.5т груза. Осталось: 4.5т',
      hint: 'В конструкторе Car вызови super(brand, maxSpeed), затем инициализируй doors и fuelType. Метод accelerate увеличивает speed, но не больше maxSpeed.',
      solution: 'public class Vehicle {\n    String brand;\n    int speed;\n    int maxSpeed;\n\n    public Vehicle(String brand, int maxSpeed) {\n        this.brand = brand;\n        this.maxSpeed = maxSpeed;\n        this.speed = 0;\n    }\n\n    void accelerate(int amount) {\n        speed = Math.min(speed + amount, maxSpeed);\n        System.out.println("Разгон! Скорость: " + speed + " км/ч");\n    }\n\n    void brake(int amount) {\n        speed = Math.max(speed - amount, 0);\n        System.out.println("Торможение! Скорость: " + speed + " км/ч");\n    }\n\n    public String toString() {\n        return brand + " — " + speed + " км/ч";\n    }\n}\n\npublic class Car extends Vehicle {\n    int doors;\n    String fuelType;\n\n    public Car(String brand, int maxSpeed, int doors, String fuelType) {\n        super(brand, maxSpeed);\n        this.doors = doors;\n        this.fuelType = fuelType;\n    }\n\n    void refuel() {\n        System.out.println("Заправляемся " + fuelType.toLowerCase() + "ом!");\n    }\n\n    public String toString() {\n        return brand + " (" + doors + " дв., " + fuelType + ") — " + speed + " км/ч";\n    }\n}\n\npublic class Truck extends Vehicle {\n    double cargoCapacity;\n    double currentLoad;\n\n    public Truck(String brand, int maxSpeed, double cargoCapacity) {\n        super(brand, maxSpeed);\n        this.cargoCapacity = cargoCapacity;\n        this.currentLoad = 0;\n    }\n\n    void loadCargo(double weight) {\n        double remaining = cargoCapacity - currentLoad;\n        if (weight <= remaining) {\n            currentLoad += weight;\n            System.out.println("Загружаем " + weight + "т груза. Осталось: " + (cargoCapacity - currentLoad) + "т");\n        } else {\n            System.out.println("Перегруз! Можно загрузить ещё " + remaining + "т");\n        }\n    }\n\n    public String toString() {\n        return brand + " (грузоподъёмность: " + cargoCapacity + "т) — " + speed + " км/ч";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Car car = new Car("Toyota Camry", 200, 4, "Бензин");\n        System.out.println(car);\n        car.accelerate(40);\n        car.refuel();\n\n        Truck truck = new Truck("Kamaz 5320", 120, 10);\n        System.out.println(truck);\n        truck.loadCargo(5.5);\n    }\n}',
      explanation: 'Иерархия Vehicle -> Car/Truck позволяет переиспользовать код (accelerate, brake). Каждый подкласс добавляет свою специфику и переопределяет toString(). super() гарантирует инициализацию родительских полей.'
    }
  ]
}
