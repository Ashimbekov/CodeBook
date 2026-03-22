export default {
  id: 73,
  title: 'Лучшие практики: SOLID принципы',
  description: 'Пять фундаментальных принципов объектно-ориентированного дизайна: единственная ответственность, открытость/закрытость, подстановка Лисков, разделение интерфейсов, инверсия зависимостей',
  lessons: [
    {
      id: 1,
      title: 'S — Single Responsibility Principle (SRP)',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'SRP: класс должен иметь только одну причину для изменения. Это значит, что класс отвечает за одну конкретную задачу. Если класс меняется по двум разным причинам — он делает слишком много.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — класс с несколькими ответственностями'
        },
        {
          type: 'code',
          code: '// ПЛОХО: класс Employee делает три разных вещи\n// Причина изменения 1: бизнес-правила расчёта зарплаты\n// Причина изменения 2: формат отчёта\n// Причина изменения 3: правила работы с базой данных\npublic class Employee {\n    private String name;\n    private double salary;\n\n    // Бизнес-логика\n    public double calculateBonus() {\n        return salary * 0.1;\n    }\n\n    // Форматирование отчёта\n    public String generateReport() {\n        return "Сотрудник: " + name + ", Зарплата: " + salary;\n    }\n\n    // Работа с базой данных\n    public void saveToDatabase() {\n        System.out.println("INSERT INTO employees VALUES (\'" + name + "\', " + salary + ")");\n    }\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — каждый класс отвечает за одно'
        },
        {
          type: 'code',
          code: '// ХОРОШО: три класса с чёткой ответственностью\npublic class Employee {\n    private String name;\n    private double salary;\n\n    public Employee(String name, double salary) {\n        this.name = name;\n        this.salary = salary;\n    }\n\n    public String getName() { return name; }\n    public double getSalary() { return salary; }\n}\n\n// Только бизнес-логика\npublic class SalaryCalculator {\n    public double calculateBonus(Employee employee) {\n        return employee.getSalary() * 0.1;\n    }\n}\n\n// Только форматирование\npublic class EmployeeReport {\n    public String generate(Employee employee) {\n        return "Сотрудник: " + employee.getName() + ", Зарплата: " + employee.getSalary();\n    }\n}\n\n// Только работа с БД\npublic class EmployeeRepository {\n    public void save(Employee employee) {\n        System.out.println("INSERT INTO employees VALUES (\'" + employee.getName() + "\', " + employee.getSalary() + ")");\n    }\n}'
        },
        {
          type: 'tip',
          text: 'Как понять, нарушен ли SRP? Спроси себя: "По каким разным причинам мне может понадобиться изменить этот класс?" Если причин больше одной — класс делает слишком много.'
        }
      ]
    },
    {
      id: 2,
      title: 'O — Open/Closed Principle (OCP)',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'OCP: программные сущности должны быть открыты для расширения, но закрыты для модификации. Добавление нового функционала не должно требовать изменения уже работающего кода.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — добавление нового типа требует изменения существующего кода'
        },
        {
          type: 'code',
          code: '// ПЛОХО: при добавлении нового типа скидки нужно менять calculateDiscount\npublic class DiscountCalculator {\n    public double calculateDiscount(Order order, String discountType) {\n        if (discountType.equals("STUDENT")) {\n            return order.getTotal() * 0.10;\n        } else if (discountType.equals("SENIOR")) {\n            return order.getTotal() * 0.15;\n        } else if (discountType.equals("VIP")) {\n            return order.getTotal() * 0.20;\n        }\n        // Чтобы добавить "EMPLOYEE" — придётся редактировать этот метод!\n        return 0;\n    }\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — расширение через новые классы, без изменения старых'
        },
        {
          type: 'code',
          code: '// ХОРОШО: новый тип скидки = новый класс, существующий код не трогаем\npublic interface DiscountStrategy {\n    double calculate(double orderTotal);\n}\n\npublic class StudentDiscount implements DiscountStrategy {\n    public double calculate(double orderTotal) { return orderTotal * 0.10; }\n}\n\npublic class SeniorDiscount implements DiscountStrategy {\n    public double calculate(double orderTotal) { return orderTotal * 0.15; }\n}\n\npublic class VipDiscount implements DiscountStrategy {\n    public double calculate(double orderTotal) { return orderTotal * 0.20; }\n}\n\n// Новый тип — просто новый класс, старый код не меняем:\npublic class EmployeeDiscount implements DiscountStrategy {\n    public double calculate(double orderTotal) { return orderTotal * 0.30; }\n}\n\npublic class DiscountCalculator {\n    public double calculateDiscount(double orderTotal, DiscountStrategy strategy) {\n        return strategy.calculate(orderTotal);\n    }\n}'
        },
        {
          type: 'note',
          text: 'OCP тесно связан с паттернами Стратегия (Strategy) и Декоратор (Decorator). Интерфейсы — главный инструмент реализации OCP в Java.'
        }
      ]
    },
    {
      id: 3,
      title: 'L — Liskov Substitution Principle (LSP)',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'LSP: объекты подкласса должны быть взаимозаменяемы с объектами базового класса, не нарушая корректности программы. Если подкласс "сужает" поведение — он нарушает LSP.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — подкласс нарушает контракт базового класса'
        },
        {
          type: 'code',
          code: '// ПЛОХО: ReadOnlyList нарушает контракт List — метод add выбрасывает исключение\n// там, где базовый класс гарантирует успешное добавление\npublic class ReadOnlyList extends ArrayList<String> {\n    @Override\n    public boolean add(String element) {\n        throw new UnsupportedOperationException("Список только для чтения!");\n    }\n}\n\n// Этот код падает с исключением при замене ArrayList на ReadOnlyList\npublic void addUserName(List<String> list, String name) {\n    list.add(name); // ожидается, что это всегда работает!\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — подтип не сужает поведение родителя'
        },
        {
          type: 'code',
          code: '// ХОРОШО: отдельная иерархия для изменяемых и неизменяемых списков\npublic interface ReadableList<T> {\n    T get(int index);\n    int size();\n    boolean contains(T element);\n}\n\npublic interface MutableList<T> extends ReadableList<T> {\n    boolean add(T element);\n    boolean remove(T element);\n}\n\n// Код, которому нужен только чтение, принимает ReadableList\npublic int countMatches(ReadableList<String> list, String pattern) {\n    int count = 0;\n    for (int i = 0; i < list.size(); i++) {\n        if (list.get(i).contains(pattern)) count++;\n    }\n    return count;\n}\n\n// Код, которому нужна запись, принимает MutableList\npublic void addUserName(MutableList<String> list, String name) {\n    list.add(name);\n}'
        },
        {
          type: 'warning',
          text: 'Классический антипример LSP — квадрат наследует прямоугольник. Квадрат не может независимо менять ширину и высоту, нарушая контракт Rectangle. Предпочитай композицию, когда наследование ломает LSP.'
        }
      ]
    },
    {
      id: 4,
      title: 'I — Interface Segregation Principle (ISP)',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'ISP: клиент не должен зависеть от методов, которые он не использует. Большой интерфейс лучше разбить на несколько маленьких и специализированных. Классу не нужно реализовывать то, что ему не нужно.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — "жирный" интерфейс заставляет реализовывать лишнее'
        },
        {
          type: 'code',
          code: '// ПЛОХО: один огромный интерфейс для всех\npublic interface Animal {\n    void eat();\n    void sleep();\n    void fly();    // рыбы и собаки не летают!\n    void swim();   // орлы не плавают!\n    void bark();   // кошки не лают!\n}\n\n// Класс Dog вынужден реализовывать fly() и swim()\npublic class Dog implements Animal {\n    public void eat()   { System.out.println("Собака ест"); }\n    public void sleep() { System.out.println("Собака спит"); }\n    public void bark()  { System.out.println("Гав!"); }\n    public void fly()   { throw new UnsupportedOperationException("Собаки не летают"); }\n    public void swim()  { throw new UnsupportedOperationException("Эта собака не плавает"); }\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — маленькие специализированные интерфейсы'
        },
        {
          type: 'code',
          code: '// ХОРОШО: каждый интерфейс — отдельная способность\npublic interface Eatable  { void eat(); }\npublic interface Sleepable { void sleep(); }\npublic interface Flyable  { void fly(); }\npublic interface Swimmable { void swim(); }\npublic interface Barkable  { void bark(); }\n\n// Каждый класс реализует только то, что умеет\npublic class Dog implements Eatable, Sleepable, Barkable {\n    public void eat()   { System.out.println("Собака ест"); }\n    public void sleep() { System.out.println("Собака спит"); }\n    public void bark()  { System.out.println("Гав!"); }\n}\n\npublic class Eagle implements Eatable, Sleepable, Flyable {\n    public void eat()   { System.out.println("Орёл ест"); }\n    public void sleep() { System.out.println("Орёл спит"); }\n    public void fly()   { System.out.println("Орёл летит"); }\n}\n\npublic class Duck implements Eatable, Sleepable, Flyable, Swimmable {\n    public void eat()   { System.out.println("Утка ест"); }\n    public void sleep() { System.out.println("Утка спит"); }\n    public void fly()   { System.out.println("Утка летит"); }\n    public void swim()  { System.out.println("Утка плывёт"); }\n}'
        },
        {
          type: 'tip',
          text: 'Правило: если в реализации интерфейса встречается throw new UnsupportedOperationException() — это сигнал нарушения ISP. Нужно разбить интерфейс.'
        }
      ]
    },
    {
      id: 5,
      title: 'D — Dependency Inversion Principle (DIP)',
      type: 'theory',
      content: [
        {
          type: 'text',
          text: 'DIP: модули высокого уровня не должны зависеть от модулей низкого уровня. Оба должны зависеть от абстракций. Конкретные реализации должны зависеть от абстракций, а не наоборот.'
        },
        {
          type: 'heading',
          text: 'Плохой пример — высокоуровневый класс зависит от конкретной реализации'
        },
        {
          type: 'code',
          code: '// ПЛОХО: OrderService жёстко привязан к MySQLDatabase\n// Поменять БД = переписать OrderService\npublic class MySQLDatabase {\n    public void save(String data) {\n        System.out.println("MySQL: сохраняем " + data);\n    }\n}\n\npublic class OrderService {\n    private MySQLDatabase database = new MySQLDatabase(); // жёсткая зависимость!\n\n    public void placeOrder(String orderData) {\n        // бизнес-логика...\n        database.save(orderData); // привязан к MySQL навсегда\n    }\n}'
        },
        {
          type: 'heading',
          text: 'Хороший пример — зависимость через абстракцию (интерфейс)'
        },
        {
          type: 'code',
          code: '// ХОРОШО: OrderService зависит от интерфейса, а не от конкретного класса\npublic interface DataStorage {\n    void save(String data);\n}\n\npublic class MySQLDatabase implements DataStorage {\n    public void save(String data) {\n        System.out.println("MySQL: сохраняем " + data);\n    }\n}\n\npublic class PostgreSQLDatabase implements DataStorage {\n    public void save(String data) {\n        System.out.println("PostgreSQL: сохраняем " + data);\n    }\n}\n\npublic class InMemoryStorage implements DataStorage {\n    public void save(String data) {\n        System.out.println("In-Memory: сохраняем " + data);\n    }\n}\n\n// OrderService не знает, что именно использует — MySQL, Postgres или что-то ещё\npublic class OrderService {\n    private final DataStorage storage;\n\n    // Зависимость передаётся снаружи (Dependency Injection)\n    public OrderService(DataStorage storage) {\n        this.storage = storage;\n    }\n\n    public void placeOrder(String orderData) {\n        // бизнес-логика...\n        storage.save(orderData);\n    }\n}\n\n// Использование\nOrderService service = new OrderService(new MySQLDatabase());\n// Переключить на другую БД — одна строка:\nOrderService testService = new OrderService(new InMemoryStorage());'
        },
        {
          type: 'note',
          text: 'DIP — основа паттерна Dependency Injection (DI). Фреймворки Spring, Dagger, Guice автоматически управляют зависимостями именно по этому принципу.'
        }
      ]
    },
    {
      id: 6,
      title: 'Задача: Исправить нарушение SRP',
      type: 'practice',
      difficulty: 'easy',
      description: 'Класс UserManager нарушает SRP: он и парсит данные, и валидирует, и сохраняет, и отправляет письма. Разбей его на классы с единственной ответственностью.',
      requirements: [
        'Класс User — только данные (name, email, age)',
        'Класс UserValidator — только метод validate(User user), бросает IllegalArgumentException при ошибке',
        'Класс UserRepository — только метод save(User user), выводит подтверждение',
        'Класс EmailService — только метод sendWelcomeEmail(User user), выводит текст письма',
        'Класс UserRegistrationService — оркестрирует: validate → save → sendWelcomeEmail'
      ],
      expectedOutput: 'Пользователь сохранён: Алия (aliya@example.com)\nОтправлено приветственное письмо для: aliya@example.com\nРегистрация завершена: Алия\nОшибка регистрации: Email должен содержать @',
      hint: 'UserRegistrationService принимает UserValidator, UserRepository и EmailService через конструктор (DIP). Метод register(String name, String email, int age) создаёт User и вызывает остальные сервисы.',
      solution: 'public class UserRegistrationExample {\n\n    static class User {\n        String name;\n        String email;\n        int age;\n\n        User(String name, String email, int age) {\n            this.name = name;\n            this.email = email;\n            this.age = age;\n        }\n    }\n\n    static class UserValidator {\n        public void validate(User user) {\n            if (user.name == null || user.name.trim().isEmpty()) {\n                throw new IllegalArgumentException("Имя не может быть пустым");\n            }\n            if (user.email == null || !user.email.contains("@")) {\n                throw new IllegalArgumentException("Email должен содержать @");\n            }\n            if (user.age < 0 || user.age > 150) {\n                throw new IllegalArgumentException("Некорректный возраст: " + user.age);\n            }\n        }\n    }\n\n    static class UserRepository {\n        public void save(User user) {\n            System.out.printf("Пользователь сохранён: %s (%s)%n", user.name, user.email);\n        }\n    }\n\n    static class EmailService {\n        public void sendWelcomeEmail(User user) {\n            System.out.println("Отправлено приветственное письмо для: " + user.email);\n        }\n    }\n\n    static class UserRegistrationService {\n        private final UserValidator validator;\n        private final UserRepository repository;\n        private final EmailService emailService;\n\n        UserRegistrationService(UserValidator validator, UserRepository repository, EmailService emailService) {\n            this.validator    = validator;\n            this.repository   = repository;\n            this.emailService = emailService;\n        }\n\n        public void register(String name, String email, int age) {\n            try {\n                User user = new User(name, email, age);\n                validator.validate(user);\n                repository.save(user);\n                emailService.sendWelcomeEmail(user);\n                System.out.println("Регистрация завершена: " + name);\n            } catch (IllegalArgumentException e) {\n                System.out.println("Ошибка регистрации: " + e.getMessage());\n            }\n        }\n    }\n\n    public static void main(String[] args) {\n        UserRegistrationService service = new UserRegistrationService(\n            new UserValidator(),\n            new UserRepository(),\n            new EmailService()\n        );\n\n        service.register("Алия", "aliya@example.com", 25);\n        service.register("Бот", "невалидный-email", 20);\n    }\n}',
      explanation: 'Теперь каждый класс меняется по своей причине: UserValidator — при изменении правил валидации, UserRepository — при смене хранилища, EmailService — при изменении содержания письма. UserRegistrationService меняется только если изменится последовательность действий при регистрации. Это и есть SRP в действии. Плюс бонус: DIP через конструктор — легко подменить EmailService на StubEmailService в тестах.'
    },
    {
      id: 7,
      title: 'Задача: Применить OCP через паттерн Стратегия',
      type: 'practice',
      difficulty: 'medium',
      description: 'Система расчёта зарплаты использует if-else для разных типов сотрудников. Каждый новый тип требует изменения основного класса. Примени OCP: создай интерфейс SalaryStrategy и реализации для каждого типа.',
      requirements: [
        'Интерфейс SalaryStrategy с методом double calculateSalary(double baseSalary)',
        'Класс FullTimeSalary: базовая ставка × 1.0',
        'Класс PartTimeSalary: базовая ставка × 0.5',
        'Класс ContractorSalary: базовая ставка × 1.2 (наценка за отсутствие льгот)',
        'Класс FreelancerSalary: базовая ставка × 0.8 (вычет налога)',
        'Класс PayrollCalculator с методом process(String name, double base, SalaryStrategy strategy)'
      ],
      expectedOutput: 'Алия (штатный): 80000.00 руб.\nБекзат (полставки): 40000.00 руб.\nДана (подрядчик): 96000.00 руб.\nЕрлан (фриланс): 64000.00 руб.',
      hint: 'PayrollCalculator.process() не содержит if-else — он просто вызывает strategy.calculateSalary(baseSalary). Новый тип сотрудника = новый класс-стратегия, основной код не трогаем.',
      solution: 'public class PayrollSystem {\n\n    interface SalaryStrategy {\n        double calculateSalary(double baseSalary);\n    }\n\n    static class FullTimeSalary implements SalaryStrategy {\n        public double calculateSalary(double baseSalary) { return baseSalary * 1.0; }\n    }\n\n    static class PartTimeSalary implements SalaryStrategy {\n        public double calculateSalary(double baseSalary) { return baseSalary * 0.5; }\n    }\n\n    static class ContractorSalary implements SalaryStrategy {\n        public double calculateSalary(double baseSalary) { return baseSalary * 1.2; }\n    }\n\n    static class FreelancerSalary implements SalaryStrategy {\n        public double calculateSalary(double baseSalary) { return baseSalary * 0.8; }\n    }\n\n    static class PayrollCalculator {\n        public void process(String name, double baseSalary, SalaryStrategy strategy) {\n            double salary = strategy.calculateSalary(baseSalary);\n            System.out.printf("%s: %.2f руб.%n", name, salary);\n        }\n    }\n\n    public static void main(String[] args) {\n        PayrollCalculator calculator = new PayrollCalculator();\n        calculator.process("Алия (штатный)",   80000, new FullTimeSalary());\n        calculator.process("Бекзат (полставки)", 80000, new PartTimeSalary());\n        calculator.process("Дана (подрядчик)",  80000, new ContractorSalary());\n        calculator.process("Ерлан (фриланс)",   80000, new FreelancerSalary());\n    }\n}',
      explanation: 'PayrollCalculator закрыт для модификации — его код не нужно трогать при добавлении нового типа сотрудника. Он открыт для расширения — добавляем новую стратегию (например, InternSalary) без изменения существующих классов. Это и есть принцип Open/Closed. Паттерн Стратегия — классический способ реализации OCP: поведение вынесено в отдельные классы, а не зашито в условия.'
    },
    {
      id: 8,
      title: 'Задача: Исправить нарушение ISP',
      type: 'practice',
      difficulty: 'medium',
      description: 'Интерфейс Machine заставляет принтер реализовывать метод scan(), а сканер — print(). Это нарушение ISP. Разбей интерфейс на специализированные и создай реализации.',
      requirements: [
        'Интерфейс Printable с методом void print(String document)',
        'Интерфейс Scannable с методом String scan()',
        'Интерфейс Faxable с методом void sendFax(String document, String number)',
        'Класс SimplePrinter реализует только Printable',
        'Класс SimpleScanner реализует только Scannable',
        'Класс MultifunctionDevice реализует Printable, Scannable и Faxable'
      ],
      expectedOutput: 'Печать: Договор №1\nСканирование завершено: [отсканированный документ]\nMFU — Печать: Отчёт\nMFU — Сканирование завершено: [отсканированный документ]\nMFU — Факс отправлен: Счёт → +7-777-123-45-67',
      hint: 'Каждый класс реализует только нужные интерфейсы через implements. MultifunctionDevice объединяет все три. Методы сканирования возвращают строку-заглушку.',
      solution: 'public class OfficeDevices {\n\n    interface Printable {\n        void print(String document);\n    }\n\n    interface Scannable {\n        String scan();\n    }\n\n    interface Faxable {\n        void sendFax(String document, String number);\n    }\n\n    static class SimplePrinter implements Printable {\n        public void print(String document) {\n            System.out.println("Печать: " + document);\n        }\n    }\n\n    static class SimpleScanner implements Scannable {\n        public String scan() {\n            System.out.println("Сканирование завершено: [отсканированный документ]");\n            return "[отсканированный документ]";\n        }\n    }\n\n    static class MultifunctionDevice implements Printable, Scannable, Faxable {\n        public void print(String document) {\n            System.out.println("MFU — Печать: " + document);\n        }\n        public String scan() {\n            System.out.println("MFU — Сканирование завершено: [отсканированный документ]");\n            return "[отсканированный документ]";\n        }\n        public void sendFax(String document, String number) {\n            System.out.printf("MFU — Факс отправлен: %s → %s%n", document, number);\n        }\n    }\n\n    public static void main(String[] args) {\n        Printable printer = new SimplePrinter();\n        printer.print("Договор №1");\n\n        Scannable scanner = new SimpleScanner();\n        scanner.scan();\n\n        MultifunctionDevice mfu = new MultifunctionDevice();\n        mfu.print("Отчёт");\n        mfu.scan();\n        mfu.sendFax("Счёт", "+7-777-123-45-67");\n    }\n}',
      explanation: 'После рефакторинга SimplePrinter не знает о методе scan() — он его просто не реализует. Это значит, что изменение интерфейса Scannable не затронет SimplePrinter. MultifunctionDevice — реальное устройство, умеющее всё. ISP уменьшает связность (coupling): изменение одного интерфейса не распространяется на классы, которым этот интерфейс не нужен.'
    }
  ]
}
