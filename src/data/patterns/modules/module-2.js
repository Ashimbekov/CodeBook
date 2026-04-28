export default {
  id: 2,
  title: 'Принципы SOLID подробно',
  description: 'Пять принципов объектно-ориентированного проектирования: SRP, OCP, LSP, ISP, DIP',
  lessons: [
    {
      id: 1,
      title: 'Single Responsibility Principle (SRP)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Принцип единственной ответственности гласит: «Класс должен иметь только одну причину для изменения». Другими словами, каждый класс должен отвечать только за одну функциональность.' },
        { type: 'heading', value: 'Нарушение SRP' },
        { type: 'code', language: 'java', value: '// ❌ Класс делает слишком много\nclass UserService {\n    public void registerUser(String name, String email) {\n        // Валидация\n        if (!email.contains("@")) throw new RuntimeException("Неверный email");\n        // Сохранение в БД\n        database.save(new User(name, email));\n        // Отправка email\n        sendWelcomeEmail(email);\n        // Логирование\n        logger.info("Зарегистрирован пользователь: " + name);\n    }\n}' },
        { type: 'heading', value: 'Соблюдение SRP' },
        { type: 'code', language: 'java', value: '// ✅ Каждый класс — одна ответственность\nclass UserValidator {\n    public void validate(String email) {\n        if (!email.contains("@")) throw new RuntimeException("Неверный email");\n    }\n}\n\nclass UserRepository {\n    public void save(User user) {\n        database.save(user);\n    }\n}\n\nclass EmailService {\n    public void sendWelcomeEmail(String email) {\n        // Отправка email\n    }\n}\n\nclass UserService {\n    private final UserValidator validator;\n    private final UserRepository repository;\n    private final EmailService emailService;\n\n    public void registerUser(String name, String email) {\n        validator.validate(email);\n        repository.save(new User(name, email));\n        emailService.sendWelcomeEmail(email);\n    }\n}' },
        { type: 'tip', value: 'Хороший тест на SRP: попробуйте описать, что делает класс, одним предложением без союза «и». Если не получается — у класса слишком много обязанностей.' },
        { type: 'note', value: 'SRP не означает, что в классе должен быть один метод. У класса может быть много методов, если они все относятся к одной ответственности.' }
      ]
    },
    {
      id: 2,
      title: 'Open/Closed Principle (OCP)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Принцип открытости/закрытости: «Программные сущности должны быть открыты для расширения, но закрыты для модификации». То есть, поведение можно расширять без изменения существующего кода.' },
        { type: 'heading', value: 'Нарушение OCP' },
        { type: 'code', language: 'java', value: '// ❌ Нужно менять класс при добавлении новой фигуры\nclass AreaCalculator {\n    public double calculate(Object shape) {\n        if (shape instanceof Circle c) {\n            return Math.PI * c.radius * c.radius;\n        } else if (shape instanceof Rectangle r) {\n            return r.width * r.height;\n        }\n        // Для треугольника придётся менять этот метод!\n        throw new UnsupportedOperationException();\n    }\n}' },
        { type: 'heading', value: 'Соблюдение OCP' },
        { type: 'code', language: 'java', value: '// ✅ Расширяем поведение через новые классы\ninterface Shape {\n    double area();\n}\n\nclass Circle implements Shape {\n    double radius;\n    \n    public double area() {\n        return Math.PI * radius * radius;\n    }\n}\n\nclass Rectangle implements Shape {\n    double width, height;\n    \n    public double area() {\n        return width * height;\n    }\n}\n\n// Новая фигура — просто новый класс!\nclass Triangle implements Shape {\n    double base, height;\n    \n    public double area() {\n        return 0.5 * base * height;\n    }\n}\n\nclass AreaCalculator {\n    public double calculate(Shape shape) {\n        return shape.area(); // Никаких if/else!\n    }\n}' },
        { type: 'heading', value: 'OCP в TypeScript' },
        { type: 'code', language: 'typescript', value: 'interface Shape {\n    area(): number;\n}\n\nclass Circle implements Shape {\n    constructor(private radius: number) {}\n    \n    area(): number {\n        return Math.PI * this.radius ** 2;\n    }\n}\n\nclass Rectangle implements Shape {\n    constructor(private width: number, private height: number) {}\n    \n    area(): number {\n        return this.width * this.height;\n    }\n}\n\n// Калькулятор не нужно менять!\nfunction totalArea(shapes: Shape[]): number {\n    return shapes.reduce((sum, s) => sum + s.area(), 0);\n}' },
        { type: 'tip', value: 'OCP — один из главных принципов для понимания паттернов. Почти все паттерны GoF так или иначе помогают соблюдать этот принцип.' }
      ]
    },
    {
      id: 3,
      title: 'Liskov Substitution Principle (LSP)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Принцип подстановки Лисков: «Объекты базового класса должны быть заменяемы объектами его подклассов без нарушения корректности программы». Если класс B наследуется от A, то везде, где используется A, можно подставить B, и всё будет работать правильно.' },
        { type: 'heading', value: 'Классический пример нарушения: прямоугольник и квадрат' },
        { type: 'code', language: 'java', value: '// ❌ Нарушение LSP\nclass Rectangle {\n    protected int width;\n    protected int height;\n\n    public void setWidth(int width) { this.width = width; }\n    public void setHeight(int height) { this.height = height; }\n    public int area() { return width * height; }\n}\n\nclass Square extends Rectangle {\n    @Override\n    public void setWidth(int width) {\n        this.width = width;\n        this.height = width; // Неожиданное поведение!\n    }\n\n    @Override\n    public void setHeight(int height) {\n        this.width = height;\n        this.height = height;\n    }\n}\n\n// Тест, который ломается для Square:\nvoid testRectangle(Rectangle r) {\n    r.setWidth(5);\n    r.setHeight(4);\n    assert r.area() == 20; // Для Square будет 16!' },
        { type: 'heading', value: 'Правильный подход' },
        { type: 'code', language: 'java', value: '// ✅ Соблюдение LSP через общий интерфейс\ninterface Shape {\n    int area();\n}\n\nclass Rectangle implements Shape {\n    private final int width;\n    private final int height;\n\n    Rectangle(int width, int height) {\n        this.width = width;\n        this.height = height;\n    }\n\n    public int area() { return width * height; }\n}\n\nclass Square implements Shape {\n    private final int side;\n\n    Square(int side) {\n        this.side = side;\n    }\n\n    public int area() { return side * side; }\n}' },
        { type: 'warning', value: 'LSP не запрещает наследование. Он говорит о том, что подклассы не должны нарушать контракт (ожидания) базового класса. Если квадрат «сюрпризом» меняет обе стороны — это нарушение контракта.' },
        { type: 'note', value: 'Признаки нарушения LSP: подкласс переопределяет метод и выбрасывает исключение вместо нормальной работы; подкласс игнорирует или изменяет поведение базового класса неожиданным образом.' }
      ]
    },
    {
      id: 4,
      title: 'Interface Segregation и Dependency Inversion',
      type: 'theory',
      content: [
        { type: 'text', value: 'Последние два принципа SOLID: ISP (Interface Segregation Principle) и DIP (Dependency Inversion Principle).' },
        { type: 'heading', value: 'ISP: Принцип разделения интерфейсов' },
        { type: 'text', value: '«Клиенты не должны зависеть от интерфейсов, которые они не используют». Лучше несколько маленьких, специализированных интерфейсов, чем один большой.' },
        { type: 'code', language: 'java', value: '// ❌ Нарушение ISP: «толстый» интерфейс\ninterface Worker {\n    void work();\n    void eat();\n    void sleep();\n}\n\nclass Robot implements Worker {\n    public void work() { /* ... */ }\n    public void eat() { /* Роботы не едят! */ }\n    public void sleep() { /* Роботы не спят! */ }\n}\n\n// ✅ Соблюдение ISP: узкие интерфейсы\ninterface Workable {\n    void work();\n}\n\ninterface Eatable {\n    void eat();\n}\n\ninterface Sleepable {\n    void sleep();\n}\n\nclass Human implements Workable, Eatable, Sleepable {\n    public void work() { /* ... */ }\n    public void eat() { /* ... */ }\n    public void sleep() { /* ... */ }\n}\n\nclass Robot implements Workable {\n    public void work() { /* ... */ }\n}' },
        { type: 'heading', value: 'DIP: Принцип инверсии зависимостей' },
        { type: 'text', value: '«Модули верхнего уровня не должны зависеть от модулей нижнего уровня. Оба должны зависеть от абстракций.»' },
        { type: 'code', language: 'typescript', value: '// ❌ Нарушение DIP: зависимость от конкретики\nclass MySQLDatabase {\n    save(data: string): void {\n        console.log("Сохранение в MySQL: " + data);\n    }\n}\n\nclass UserService {\n    private db = new MySQLDatabase(); // Жёсткая привязка!\n    \n    saveUser(name: string): void {\n        this.db.save(name);\n    }\n}\n\n// ✅ Соблюдение DIP: зависимость от абстракции\ninterface Database {\n    save(data: string): void;\n}\n\nclass MySQLDatabase implements Database {\n    save(data: string): void {\n        console.log("Сохранение в MySQL: " + data);\n    }\n}\n\nclass PostgresDatabase implements Database {\n    save(data: string): void {\n        console.log("Сохранение в PostgreSQL: " + data);\n    }\n}\n\nclass UserService {\n    constructor(private db: Database) {} // Инъекция зависимости!\n    \n    saveUser(name: string): void {\n        this.db.save(name);\n    }\n}' },
        { type: 'tip', value: 'DIP — фундамент Dependency Injection (DI). Все современные фреймворки (Spring, Angular, NestJS) строятся на этом принципе.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: рефакторинг по SRP',
      type: 'practice',
      difficulty: 'medium',
      description: 'Разбейте монолитный класс OrderProcessor на несколько классов, каждый с единственной ответственностью.',
      requirements: [
        'Создайте интерфейс OrderValidator и реализацию SimpleOrderValidator',
        'Создайте интерфейс PriceCalculator и реализацию DefaultPriceCalculator (с учётом скидок)',
        'Создайте интерфейс OrderRepository для сохранения заказов',
        'Создайте интерфейс NotificationSender для отправки уведомлений',
        'Класс OrderProcessor должен принимать все зависимости через конструктор'
      ],
      hint: 'Каждая ответственность — валидация, расчёт цены, сохранение, уведомление — должна быть в отдельном классе.',
      expectedOutput: 'Заказ валиден\nИтого: 900.0 (скидка 10%)\nЗаказ сохранён: ORD-001\nУведомление отправлено: user@test.com',
      solution: 'interface OrderValidator {\n    boolean validate(Order order);\n}\n\ninterface PriceCalculator {\n    double calculate(Order order);\n}\n\ninterface OrderRepository {\n    void save(Order order);\n}\n\ninterface NotificationSender {\n    void send(String recipient, String message);\n}\n\nclass SimpleOrderValidator implements OrderValidator {\n    public boolean validate(Order order) {\n        if (order.getItems().isEmpty()) return false;\n        if (order.getCustomerEmail() == null) return false;\n        System.out.println("Заказ валиден");\n        return true;\n    }\n}\n\nclass DefaultPriceCalculator implements PriceCalculator {\n    public double calculate(Order order) {\n        double total = order.getItems().stream()\n            .mapToDouble(Item::getPrice)\n            .sum();\n        if (total > 500) {\n            total *= 0.9; // Скидка 10%\n            System.out.println("Итого: " + total + " (скидка 10%)");\n        }\n        return total;\n    }\n}\n\nclass OrderProcessor {\n    private final OrderValidator validator;\n    private final PriceCalculator calculator;\n    private final OrderRepository repository;\n    private final NotificationSender notifier;\n\n    public OrderProcessor(OrderValidator validator,\n                          PriceCalculator calculator,\n                          OrderRepository repository,\n                          NotificationSender notifier) {\n        this.validator = validator;\n        this.calculator = calculator;\n        this.repository = repository;\n        this.notifier = notifier;\n    }\n\n    public void process(Order order) {\n        if (!validator.validate(order)) {\n            throw new RuntimeException("Заказ невалиден");\n        }\n        double total = calculator.calculate(order);\n        order.setTotal(total);\n        repository.save(order);\n        notifier.send(order.getCustomerEmail(), "Заказ оформлен!");\n    }\n}',
      explanation: 'Мы разделили монолитный класс на 4 отдельных ответственности, каждая за своим интерфейсом. OrderProcessor теперь является координатором, который делегирует работу специализированным компонентам. Это соответствует SRP и DIP одновременно.'
    },
    {
      id: 6,
      title: 'Практика: применение OCP и DIP',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему скидок для интернет-магазина, соблюдая принципы OCP и DIP.',
      requirements: [
        'Создайте интерфейс DiscountStrategy с методом apply(double price)',
        'Реализуйте PercentageDiscount (процент от цены)',
        'Реализуйте FixedDiscount (фиксированная сумма)',
        'Реализуйте CompositeDiscount (комбинация нескольких скидок)',
        'Создайте PriceService, который принимает DiscountStrategy через конструктор'
      ],
      hint: 'CompositeDiscount — это список стратегий, которые применяются последовательно. Используйте паттерн Composite для комбинации скидок.',
      expectedOutput: 'Цена: 1000.0, Скидка 10%: 900.0\nЦена: 1000.0, Скидка 200: 800.0\nЦена: 1000.0, Комбо скидка: 700.0',
      solution: 'interface DiscountStrategy {\n    double apply(double price);\n}\n\nclass PercentageDiscount implements DiscountStrategy {\n    private final double percent;\n\n    PercentageDiscount(double percent) {\n        this.percent = percent;\n    }\n\n    public double apply(double price) {\n        return price * (1 - percent / 100);\n    }\n}\n\nclass FixedDiscount implements DiscountStrategy {\n    private final double amount;\n\n    FixedDiscount(double amount) {\n        this.amount = amount;\n    }\n\n    public double apply(double price) {\n        return Math.max(0, price - amount);\n    }\n}\n\nclass CompositeDiscount implements DiscountStrategy {\n    private final List<DiscountStrategy> discounts;\n\n    CompositeDiscount(List<DiscountStrategy> discounts) {\n        this.discounts = discounts;\n    }\n\n    public double apply(double price) {\n        double result = price;\n        for (DiscountStrategy d : discounts) {\n            result = d.apply(result);\n        }\n        return result;\n    }\n}\n\nclass PriceService {\n    private final DiscountStrategy discount;\n\n    PriceService(DiscountStrategy discount) {\n        this.discount = discount;\n    }\n\n    public double finalPrice(double price) {\n        return discount.apply(price);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        double price = 1000.0;\n\n        PriceService s1 = new PriceService(new PercentageDiscount(10));\n        System.out.println("Цена: " + price + ", Скидка 10%: " + s1.finalPrice(price));\n\n        PriceService s2 = new PriceService(new FixedDiscount(200));\n        System.out.println("Цена: " + price + ", Скидка 200: " + s2.finalPrice(price));\n\n        PriceService s3 = new PriceService(new CompositeDiscount(\n            List.of(new PercentageDiscount(10), new FixedDiscount(200))));\n        System.out.println("Цена: " + price + ", Комбо скидка: " + s3.finalPrice(price));\n    }\n}',
      explanation: 'Код соблюдает OCP — для добавления новой скидки достаточно создать новый класс, не меняя существующие. DIP соблюдается через зависимость от абстракции DiscountStrategy. CompositeDiscount показывает, как комбинировать стратегии.'
    },
    {
      id: 7,
      title: 'Практика: LSP и ISP на TypeScript',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спроектируйте иерархию для системы хранения файлов, соблюдая LSP и ISP.',
      requirements: [
        'Создайте интерфейс Readable с методом read(): string',
        'Создайте интерфейс Writable с методом write(data: string): void',
        'Создайте интерфейс Deletable с методом delete(): void',
        'LocalFile реализует Readable, Writable, Deletable',
        'ReadOnlyFile реализует только Readable',
        'Создайте функцию processFiles, которая работает с Readable[] (LSP)'
      ],
      hint: 'Вместо одного «жирного» интерфейса FileStorage с read, write, delete используйте три маленьких. Так ReadOnlyFile не будет вынужден реализовывать ненужные методы.',
      expectedOutput: 'Чтение local.txt: содержимое файла\nЧтение readme.md: только для чтения\nОбработано файлов: 2',
      solution: 'interface Readable {\n    read(): string;\n    getName(): string;\n}\n\ninterface Writable {\n    write(data: string): void;\n}\n\ninterface Deletable {\n    delete(): void;\n}\n\nclass LocalFile implements Readable, Writable, Deletable {\n    private content: string = "";\n\n    constructor(private name: string) {}\n\n    getName(): string { return this.name; }\n\n    read(): string {\n        console.log(`Чтение ${this.name}: ${this.content}`);\n        return this.content;\n    }\n\n    write(data: string): void {\n        this.content = data;\n    }\n\n    delete(): void {\n        this.content = "";\n        console.log(`${this.name} удалён`);\n    }\n}\n\nclass ReadOnlyFile implements Readable {\n    constructor(private name: string, private content: string) {}\n\n    getName(): string { return this.name; }\n\n    read(): string {\n        console.log(`Чтение ${this.name}: ${this.content}`);\n        return this.content;\n    }\n}\n\nfunction processFiles(files: Readable[]): void {\n    for (const file of files) {\n        file.read(); // LSP: все Readable работают одинаково\n    }\n    console.log(`Обработано файлов: ${files.length}`);\n}\n\nconst local = new LocalFile("local.txt");\nlocal.write("содержимое файла");\n\nconst readme = new ReadOnlyFile("readme.md", "только для чтения");\n\nprocessFiles([local, readme]);',
      explanation: 'ISP: вместо одного большого интерфейса мы разделили на Readable, Writable, Deletable. LSP: processFiles принимает Readable[] — любой объект, реализующий Readable, корректно работает в этой функции, будь то LocalFile или ReadOnlyFile.'
    }
  ]
}
