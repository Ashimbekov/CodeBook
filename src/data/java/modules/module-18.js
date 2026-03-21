export default {
  id: 18,
  title: 'Абстрактные классы',
  description: 'Классы с абстрактными методами — шаблоны для подклассов',
  lessons: [
    {
      id: 1,
      title: 'Что такое абстрактный класс?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Абстрактный класс — это класс, который нельзя создать напрямую (нельзя написать new AbstactClass()). Он служит только как основа для подклассов. Ключевое слово — abstract.' },
        { type: 'tip', value: 'Абстрактный класс — как чертёж без конкретного заполнения. "Транспортное средство" — абстрактное понятие. Ты не можешь купить просто "транспортное средство" — ты покупаешь конкретный автомобиль, мотоцикл, велосипед. Но у всех них есть общие характеристики!' },
        { type: 'heading', value: 'Синтаксис абстрактного класса' },
        { type: 'code', language: 'java', value: '// abstract — нельзя создать экземпляр!\npublic abstract class Animal {\n    String name;\n    int age;\n\n    public Animal(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n\n    // Обычный метод — есть реализация\n    void breathe() {\n        System.out.println(name + " дышит");\n    }\n\n    void sleep() {\n        System.out.println(name + " спит");\n    }\n\n    // Абстрактный метод — НЕТ реализации, только объявление!\n    abstract void makeSound(); // Подклассы ОБЯЗАНЫ реализовать!\n    abstract void move();      // Тоже обязателен!\n}\n\n// Animal animal = new Animal("Кто-то", 5); // ОШИБКА!\n\n// Нужно создать конкретный подкласс\npublic class Cat extends Animal {\n    public Cat(String name, int age) {\n        super(name, age);\n    }\n\n    // ОБЯЗАНЫ реализовать все абстрактные методы!\n    @Override\n    void makeSound() {\n        System.out.println(name + ": Мяу!");\n    }\n\n    @Override\n    void move() {\n        System.out.println(name + " мягко ступает");\n    }\n}' },
        { type: 'code', language: 'java', value: 'Cat cat = new Cat("Мурзик", 3);\ncat.breathe();   // Мурзик дышит (унаследовано)\ncat.makeSound(); // Мурзик: Мяу! (реализовано в Cat)\ncat.move();      // Мурзик мягко ступает\n\n// Полиморфизм работает!\nAnimal a = new Cat("Пушок", 2); // Upcasting\na.makeSound(); // Пушок: Мяу!' },
        { type: 'warning', value: 'Если подкласс не реализует все абстрактные методы родителя, он тоже должен быть объявлен abstract!' }
      ]
    },
    {
      id: 2,
      title: 'Абстрактные методы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Абстрактный метод — это метод без тела (без реализации). Он задаёт "контракт" — каждый подкласс обязан предоставить свою реализацию.' },
        { type: 'tip', value: 'Абстрактный метод — как пустая строка в анкете: "Напишите своё достижение". Родительский класс говорит: "У тебя должно быть достижение" — но каждый пишет своё. Форма одна, содержание разное.' },
        { type: 'code', language: 'java', value: 'public abstract class Shape {\n    String color;\n\n    public Shape(String color) {\n        this.color = color;\n    }\n\n    // Абстрактные методы — подклассы ОБЯЗАНЫ реализовать\n    public abstract double area();\n    public abstract double perimeter();\n    public abstract String getType();\n\n    // Конкретный метод — использует абстрактные\n    public void printInfo() {\n        System.out.println("=== " + getType() + " ===");\n        System.out.println("Цвет: " + color);\n        System.out.printf("Площадь: %.2f%n", area());\n        System.out.printf("Периметр: %.2f%n", perimeter());\n    }\n}\n\n// Конкретный класс — реализует все абстрактные методы\npublic class Circle extends Shape {\n    double radius;\n\n    public Circle(String color, double radius) {\n        super(color);\n        this.radius = radius;\n    }\n\n    @Override public double area() { return Math.PI * radius * radius; }\n    @Override public double perimeter() { return 2 * Math.PI * radius; }\n    @Override public String getType() { return "Круг (r=" + radius + ")"; }\n}\n\npublic class Square extends Shape {\n    double side;\n\n    public Square(String color, double side) {\n        super(color);\n        this.side = side;\n    }\n\n    @Override public double area() { return side * side; }\n    @Override public double perimeter() { return 4 * side; }\n    @Override public String getType() { return "Квадрат (s=" + side + ")"; }\n}\n\nCircle c = new Circle("Синий", 5);\nc.printInfo(); // Использует area() и perimeter() полиморфно!\n\nSquare s = new Square("Красный", 4);\ns.printInfo();' }
      ]
    },
    {
      id: 3,
      title: 'Конкретные vs абстрактные классы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Разница между конкретным и абстрактным классом: конкретный можно создать (new), абстрактный — нет. Абстрактный может иметь как обычные методы, так и абстрактные.' },
        { type: 'heading', value: 'Сравнение' },
        { type: 'code', language: 'java', value: '// КОНКРЕТНЫЙ класс — можно создать\npublic class Dog {\n    String name;\n    public Dog(String name) { this.name = name; }\n    void bark() { System.out.println(name + ": Гав!"); }\n}\nDog dog = new Dog("Шарик"); // OK!\n\n// АБСТРАКТНЫЙ класс — нельзя создать напрямую\npublic abstract class Pet {\n    String name;\n    public Pet(String name) { this.name = name; }\n\n    // Конкретный метод\n    void greetOwner() {\n        System.out.println(name + " приветствует хозяина: " + getGreeting());\n    }\n\n    // Абстрактный — каждый питомец здоровается по-своему\n    abstract String getGreeting();\n}\n\n// Pet pet = new Pet("Кто-то"); // ОШИБКА!\n\n// Но ссылка типа Pet — ОК!\nPet pet; // Ссылка (указатель) - можно\npet = new Dog2("Мурзик"); // Если Dog2 extends Pet' },
        { type: 'heading', value: 'Частично абстрактный класс' },
        { type: 'code', language: 'java', value: 'public abstract class Vehicle {\n    String brand;\n    int speed;\n\n    public Vehicle(String brand) {\n        this.brand = brand;\n        this.speed = 0;\n    }\n\n    // Конкретные методы (есть реализация)\n    void accelerate(int amount) {\n        speed += amount;\n        System.out.println(brand + " разгоняется до " + speed + " км/ч");\n    }\n\n    void stop() {\n        speed = 0;\n        System.out.println(brand + " остановился");\n    }\n\n    // Абстрактный — каждое ТС заправляется по-своему\n    abstract void refuel();\n\n    // Абстрактный — каждое ТС имеет свой тип\n    abstract String getVehicleType();\n}\n\npublic class GasCar extends Vehicle {\n    double fuelLevel;\n\n    public GasCar(String brand) {\n        super(brand);\n        this.fuelLevel = 0;\n    }\n\n    @Override void refuel() {\n        fuelLevel = 100;\n        System.out.println(brand + ": заправляем бензин. Уровень: " + fuelLevel + "%");\n    }\n\n    @Override String getVehicleType() { return "Бензиновый автомобиль"; }\n}\n\npublic class ElectricCar extends Vehicle {\n    double batteryLevel;\n\n    public ElectricCar(String brand) {\n        super(brand);\n        this.batteryLevel = 0;\n    }\n\n    @Override void refuel() {\n        batteryLevel = 100;\n        System.out.println(brand + ": заряжаем батарею. Уровень: " + batteryLevel + "%");\n    }\n\n    @Override String getVehicleType() { return "Электромобиль"; }\n}' }
      ]
    },
    {
      id: 4,
      title: 'Когда использовать абстрактные классы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Абстрактный класс — правильный выбор когда: есть общая реализация для всех подклассов, классы связаны иерархией "является", нужен общий конструктор или состояние (поля).' },
        { type: 'heading', value: 'Шаблонный метод (Template Method)' },
        { type: 'text', value: 'Один из самых популярных паттернов с абстрактными классами — "Шаблонный метод". Родитель задаёт алгоритм (шаблон), а подклассы реализуют отдельные шаги.' },
        { type: 'code', language: 'java', value: 'public abstract class Game {\n    String name;\n    int players;\n\n    public Game(String name, int players) {\n        this.name = name;\n        this.players = players;\n    }\n\n    // Шаблонный метод — определяет алгоритм\n    final void play() {\n        System.out.println("=== Игра: " + name + " ===");\n        initialize();  // Шаг 1 — переопределяем\n        while (!isOver()) { // Шаг 2\n            takeTurn(); // Шаг 3 — переопределяем\n        }\n        printWinner(); // Шаг 4 — переопределяем\n    }\n\n    // Подклассы реализуют эти шаги\n    abstract void initialize();\n    abstract void takeTurn();\n    abstract boolean isOver();\n    abstract void printWinner();\n}\n\npublic class Chess extends Game {\n    int moveCount = 0;\n\n    public Chess() { super("Шахматы", 2); }\n\n    @Override void initialize() {\n        System.out.println("Расставляем фигуры...");\n    }\n\n    @Override void takeTurn() {\n        moveCount++;\n        System.out.println("Ход #" + moveCount);\n    }\n\n    @Override boolean isOver() {\n        return moveCount >= 3; // Для примера — 3 хода\n    }\n\n    @Override void printWinner() {\n        System.out.println("Игра завершена после " + moveCount + " ходов!");\n    }\n}\n\nGame game = new Chess();\ngame.play();' },
        { type: 'tip', value: 'final перед методом play() означает: подклассы не могут переопределить сам алгоритм, только его шаги. Это гарантирует правильный порядок выполнения.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Абстрактный класс Employee',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай абстрактный класс Employee с разными типами сотрудников.',
      requirements: [
        'Абстрактный класс Employee: поля name, id; абстрактный метод calculateSalary(); конкретный метод printPaySlip()',
        'FullTimeEmployee extends Employee: поле monthlySalary, реализовать calculateSalary()',
        'PartTimeEmployee extends Employee: поля hourlyRate и hoursWorked, реализовать calculateSalary()',
        'FreelanceEmployee extends Employee: поля projectRate и projectsCompleted, реализовать calculateSalary()',
        'printPaySlip() должен использовать calculateSalary() — полиморфно',
        'Создай по одному объекту каждого типа'
      ],
      expectedOutput: '--- Расчётный лист ---\nСотрудник: Алия (ID: E001)\nЗарплата: 200000.0 тг\n--- Расчётный лист ---\nСотрудник: Берик (ID: E002)\nЗарплата: 75000.0 тг\n--- Расчётный лист ---\nСотрудник: Дана (ID: E003)\nЗарплата: 150000.0 тг',
      hint: 'printPaySlip() просто вызывает calculateSalary() — подумай как это будет работать полиморфно. PartTimeEmployee: hourlyRate * hoursWorked.',
      solution: 'public abstract class Employee {\n    String name;\n    String id;\n\n    public Employee(String name, String id) {\n        this.name = name;\n        this.id = id;\n    }\n\n    public abstract double calculateSalary();\n\n    public void printPaySlip() {\n        System.out.println("--- Расчётный лист ---");\n        System.out.println("Сотрудник: " + name + " (ID: " + id + ")");\n        System.out.println("Зарплата: " + calculateSalary() + " тг");\n    }\n}\n\npublic class FullTimeEmployee extends Employee {\n    double monthlySalary;\n\n    public FullTimeEmployee(String name, String id, double monthlySalary) {\n        super(name, id);\n        this.monthlySalary = monthlySalary;\n    }\n\n    @Override\n    public double calculateSalary() {\n        return monthlySalary;\n    }\n}\n\npublic class PartTimeEmployee extends Employee {\n    double hourlyRate;\n    int hoursWorked;\n\n    public PartTimeEmployee(String name, String id, double hourlyRate, int hoursWorked) {\n        super(name, id);\n        this.hourlyRate = hourlyRate;\n        this.hoursWorked = hoursWorked;\n    }\n\n    @Override\n    public double calculateSalary() {\n        return hourlyRate * hoursWorked;\n    }\n}\n\npublic class FreelanceEmployee extends Employee {\n    double projectRate;\n    int projectsCompleted;\n\n    public FreelanceEmployee(String name, String id, double projectRate, int projectsCompleted) {\n        super(name, id);\n        this.projectRate = projectRate;\n        this.projectsCompleted = projectsCompleted;\n    }\n\n    @Override\n    public double calculateSalary() {\n        return projectRate * projectsCompleted;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Employee[] employees = {\n            new FullTimeEmployee("Алия", "E001", 200000),\n            new PartTimeEmployee("Берик", "E002", 1500, 50),\n            new FreelanceEmployee("Дана", "E003", 50000, 3)\n        };\n        for (Employee e : employees) {\n            e.printPaySlip();\n        }\n    }\n}',
      explanation: 'Абстрактный класс Employee задаёт контракт: каждый сотрудник умеет calculateSalary(). Метод printPaySlip() написан один раз в Employee, но работает правильно для всех типов — это полиморфизм через абстрактные методы.'
    },
    {
      id: 6,
      title: 'Практика: Шаблон напитка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй шаблонный метод для приготовления горячих напитков.',
      requirements: [
        'Абстрактный класс HotDrink: шаблонный метод prepare() (final)',
        'prepare() вызывает по порядку: boilWater(), brew(), pourInCup(), addExtras()',
        'boilWater() и pourInCup() — конкретные методы (одинаковые для всех)',
        'brew() и addExtras() — абстрактные',
        'Класс Tea extends HotDrink: brew() — заваривает чай, addExtras() — добавляет лимон',
        'Класс Coffee extends HotDrink: brew() — заваривает кофе, addExtras() — добавляет молоко'
      ],
      expectedOutput: '-- Приготовление напитка --\nКипятим воду...\nЗавариваем чайный пакетик\nНаливаем в чашку\nДобавляем дольку лимона\n-- Приготовление напитка --\nКипятим воду...\nПропускаем воду через кофе\nНаливаем в чашку\nДобавляем молоко',
      hint: 'final void prepare() вызывает четыре метода по порядку. boilWater() и pourInCup() имеют реализацию в HotDrink. brew() и addExtras() — abstract.',
      solution: 'public abstract class HotDrink {\n    public final void prepare() {\n        System.out.println("-- Приготовление напитка --");\n        boilWater();\n        brew();\n        pourInCup();\n        addExtras();\n    }\n\n    void boilWater() {\n        System.out.println("Кипятим воду...");\n    }\n\n    void pourInCup() {\n        System.out.println("Наливаем в чашку");\n    }\n\n    abstract void brew();\n    abstract void addExtras();\n}\n\npublic class Tea extends HotDrink {\n    @Override\n    void brew() {\n        System.out.println("Завариваем чайный пакетик");\n    }\n\n    @Override\n    void addExtras() {\n        System.out.println("Добавляем дольку лимона");\n    }\n}\n\npublic class Coffee extends HotDrink {\n    @Override\n    void brew() {\n        System.out.println("Пропускаем воду через кофе");\n    }\n\n    @Override\n    void addExtras() {\n        System.out.println("Добавляем молоко");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        HotDrink tea = new Tea();\n        tea.prepare();\n        HotDrink coffee = new Coffee();\n        coffee.prepare();\n    }\n}',
      explanation: 'Шаблонный метод — мощный паттерн. prepare() определяет алгоритм, а подклассы заполняют "пробелы". final предотвращает переопределение самого алгоритма. Это обеспечивает консистентность при гибкости.'
    }
  ]
}
