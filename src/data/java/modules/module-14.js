export default {
  id: 14,
  title: 'Конструкторы и this',
  description: 'Конструкторы для инициализации объектов, ключевое слово this, перегрузка конструкторов',
  lessons: [
    {
      id: 1,
      title: 'Конструктор по умолчанию',
      type: 'theory',
      content: [
        { type: 'text', value: 'Конструктор — это специальный метод, который вызывается при создании объекта (new). Он инициализирует объект — задаёт начальные значения полям.' },
        { type: 'tip', value: 'Конструктор — это как анкета при регистрации. Когда ты "создаёшь" нового пользователя в системе, тебя просят заполнить имя, email, пароль. Конструктор делает то же самое — заполняет поля объекта при его рождении.' },
        { type: 'heading', value: 'Конструктор по умолчанию' },
        { type: 'text', value: 'Если ты не написал ни одного конструктора, Java автоматически добавляет конструктор по умолчанию — без параметров, который ничего не делает.' },
        { type: 'code', language: 'java', value: 'public class Cat {\n    String name;\n    int age;\n    // Java автоматически добавляет:\n    // public Cat() { }  — пустой конструктор\n}\n\n// Поэтому мы можем писать:\nCat cat = new Cat(); // работает!\ncat.name = "Мурзик";\ncat.age = 3;' },
        { type: 'heading', value: 'Напишем свой конструктор по умолчанию' },
        { type: 'code', language: 'java', value: 'public class Cat {\n    String name;\n    int age;\n    boolean isHungry;\n\n    // Наш конструктор по умолчанию\n    public Cat() {\n        name = "Безымянный";\n        age = 0;\n        isHungry = true;\n        System.out.println("Создан новый котик!");\n    }\n}\n\nCat cat = new Cat(); // Создан новый котик!\nSystem.out.println(cat.name);     // Безымянный\nSystem.out.println(cat.isHungry); // true' },
        { type: 'list', items: [
          'Конструктор имеет то же имя, что и класс',
          'У конструктора нет возвращаемого типа (даже void!)',
          'Конструктор вызывается автоматически при new',
          'В одном классе может быть несколько конструкторов'
        ]},
        { type: 'warning', value: 'Если ты написал хотя бы один конструктор с параметрами, Java НЕ добавляет конструктор по умолчанию автоматически! Его нужно написать вручную.' }
      ]
    },
    {
      id: 2,
      title: 'Параметризованный конструктор',
      type: 'theory',
      content: [
        { type: 'text', value: 'Параметризованный конструктор принимает аргументы и сразу инициализирует поля. Это удобнее, чем устанавливать поля по одному после создания.' },
        { type: 'tip', value: 'Без параметризованного конструктора: сначала "рождаешь" пустого человека, потом дописываешь ему имя, возраст... Это как получить посылку пустой и класть вещи потом. С параметризованным конструктором — посылка уже приходит заполненной!' },
        { type: 'heading', value: 'Пример параметризованного конструктора' },
        { type: 'code', language: 'java', value: 'public class Person {\n    String name;\n    int age;\n    String city;\n\n    // Параметризованный конструктор\n    public Person(String name, int age, String city) {\n        // this.name — поле класса, name — параметр конструктора\n        this.name = name;\n        this.age = age;\n        this.city = city;\n    }\n\n    public String toString() {\n        return name + " (" + age + " лет) из " + city;\n    }\n}\n\n// Теперь объект создаётся уже с данными!\nPerson p1 = new Person("Нурдаулет", 25, "Астана");\nPerson p2 = new Person("Айгерим", 22, "Алматы");\n\nSystem.out.println(p1); // Нурдаулет (25 лет) из Астана\nSystem.out.println(p2); // Айгерим (22 лет) из Алматы' },
        { type: 'heading', value: 'Сравнение: с конструктором и без' },
        { type: 'code', language: 'java', value: '// Без конструктора — долго и можно забыть поле\nPerson p = new Person();\np.name = "Нурдаулет";\np.age = 25;\n// Ой, забыл город!\n\n// С конструктором — быстро и надёжно\nPerson p = new Person("Нурдаулет", 25, "Астана");\n// Все поля заполнены сразу!' },
        { type: 'code', language: 'java', value: '// Ещё один пример — класс Rectangle\npublic class Rectangle {\n    double width;\n    double height;\n\n    public Rectangle(double width, double height) {\n        this.width = width;\n        this.height = height;\n    }\n\n    double area() {\n        return width * height;\n    }\n\n    double perimeter() {\n        return 2 * (width + height);\n    }\n}\n\nRectangle r = new Rectangle(5.0, 3.0);\nSystem.out.println("Площадь: " + r.area());      // Площадь: 15.0\nSystem.out.println("Периметр: " + r.perimeter()); // Периметр: 16.0' }
      ]
    },
    {
      id: 3,
      title: 'Ключевое слово this',
      type: 'theory',
      content: [
        { type: 'text', value: 'this — это ссылка на текущий объект. Используется когда имена параметров совпадают с именами полей, или когда нужно передать текущий объект куда-то.' },
        { type: 'tip', value: 'this — это как слово "я" для объекта. Когда в конструкторе написано this.name = name, объект говорит: "МОЁ имя (this.name) = имя из параметра (name)".' },
        { type: 'heading', value: 'this для разграничения полей и параметров' },
        { type: 'code', language: 'java', value: 'public class Dog {\n    String name;  // поле класса\n    int age;      // поле класса\n\n    public Dog(String name, int age) {\n        // Без this: name = name; — это значит параметр = параметр (ничего не делает!)\n        // С this: this.name = name; — это значит ПОЛЕ = ПАРАМЕТР\n        this.name = name; // поле получает значение параметра\n        this.age = age;\n    }\n\n    void bark() {\n        // Здесь this необязателен, но можно написать для ясности\n        System.out.println(this.name + " говорит Гав!");\n        // То же самое что:\n        System.out.println(name + " говорит Гав!");\n    }\n}' },
        { type: 'heading', value: 'this в методах' },
        { type: 'code', language: 'java', value: 'public class Counter {\n    int count;\n\n    public Counter(int count) {\n        this.count = count;\n    }\n\n    // this возвращает текущий объект — удобно для цепочки вызовов!\n    Counter increment() {\n        this.count++;\n        return this; // возвращаем сам объект!\n    }\n\n    Counter add(int n) {\n        this.count += n;\n        return this;\n    }\n\n    void print() {\n        System.out.println("Счётчик: " + count);\n    }\n}\n\n// Цепочка вызовов (method chaining)\nCounter c = new Counter(0);\nc.increment().increment().add(5).add(3).print();\n// Счётчик: 10' },
        { type: 'note', value: 'Возвращать this из методов — это паттерн "строитель" (Builder). Он позволяет писать красивые цепочки вызовов.' }
      ]
    },
    {
      id: 4,
      title: 'Перегрузка конструкторов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Перегрузка (overloading) — это когда у класса несколько конструкторов с разными параметрами. Java выбирает нужный конструктор по количеству и типу аргументов.' },
        { type: 'tip', value: 'Это как в кофейне: можно заказать "кофе" (без параметров — дадут стандартный), "кофе с молоком" (один параметр), или "кофе с молоком и сахаром" (два параметра). Разные варианты для разных нужд!' },
        { type: 'heading', value: 'Класс с несколькими конструкторами' },
        { type: 'code', language: 'java', value: 'public class Circle {\n    double radius;\n    String color;\n\n    // Конструктор 1: без параметров\n    public Circle() {\n        this.radius = 1.0;\n        this.color = "Чёрный";\n    }\n\n    // Конструктор 2: только радиус\n    public Circle(double radius) {\n        this.radius = radius;\n        this.color = "Чёрный";\n    }\n\n    // Конструктор 3: радиус и цвет\n    public Circle(double radius, String color) {\n        this.radius = radius;\n        this.color = color;\n    }\n\n    double area() {\n        return Math.PI * radius * radius;\n    }\n\n    public String toString() {\n        return "Круг r=" + radius + " (" + color + ")";\n    }\n}\n\n// Выбираем нужный конструктор!\nCircle c1 = new Circle();           // радиус=1, цвет=Чёрный\nCircle c2 = new Circle(5.0);        // радиус=5, цвет=Чёрный\nCircle c3 = new Circle(3.0, "Синий"); // радиус=3, цвет=Синий\n\nSystem.out.println(c1); // Круг r=1.0 (Чёрный)\nSystem.out.println(c2); // Круг r=5.0 (Чёрный)\nSystem.out.println(c3); // Круг r=3.0 (Синий)' },
        { type: 'warning', value: 'Два конструктора не могут иметь одинаковые списки параметров (одинаковые типы в одинаковом порядке). Это вызовет ошибку компиляции.' }
      ]
    },
    {
      id: 5,
      title: 'Вызов конструктора из конструктора: this()',
      type: 'theory',
      content: [
        { type: 'text', value: 'Конструктор может вызвать другой конструктор того же класса через this(). Это называется "цепочка конструкторов" (constructor chaining) и помогает избежать дублирования кода.' },
        { type: 'tip', value: 'Представь, что у тебя три конструктора и в каждом нужно написать одинаковый код. Это неудобно. Вместо этого один "главный" конструктор выполняет всю работу, а остальные просто вызывают его через this() с нужными аргументами.' },
        { type: 'code', language: 'java', value: 'public class Employee {\n    String name;\n    String department;\n    double salary;\n    boolean isActive;\n\n    // Главный конструктор — делает всю работу\n    public Employee(String name, String department, double salary, boolean isActive) {\n        this.name = name;\n        this.department = department;\n        this.salary = salary;\n        this.isActive = isActive;\n        System.out.println("Сотрудник создан: " + name);\n    }\n\n    // Делегирует в главный конструктор\n    public Employee(String name, String department, double salary) {\n        this(name, department, salary, true); // по умолчанию активен\n    }\n\n    // Делегирует дальше\n    public Employee(String name, String department) {\n        this(name, department, 50000); // зарплата по умолчанию\n    }\n\n    // Только имя\n    public Employee(String name) {\n        this(name, "Общий отдел"); // отдел по умолчанию\n    }\n\n    public String toString() {\n        return name + " | " + department + " | " + salary + " | " + (isActive ? "Активен" : "Уволен");\n    }\n}\n\nEmployee e1 = new Employee("Нурдаулет", "IT", 200000, true);\nEmployee e2 = new Employee("Айгерим", "HR", 150000);\nEmployee e3 = new Employee("Берик", "Финансы");\nEmployee e4 = new Employee("Дана");\n\nSystem.out.println(e1);\nSystem.out.println(e2);\nSystem.out.println(e3);\nSystem.out.println(e4);' },
        { type: 'warning', value: 'Вызов this() должен быть ПЕРВОЙ строкой в конструкторе! Иначе будет ошибка компиляции.' },
        { type: 'note', value: 'this() для конструктора — аналогично super() для вызова конструктора родительского класса (об этом — в модуле про наследование).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Класс с конструктором',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай класс Book с параметризованным конструктором и методами.',
      requirements: [
        'Создай класс Book с полями: title, author, price, pages',
        'Добавь параметризованный конструктор для всех полей',
        'Добавь конструктор только с title и author (price=0, pages=0 по умолчанию)',
        'Добавь метод isExpensive() — возвращает true если цена > 3000',
        'Переопредели toString()',
        'Создай 2 объекта разными конструкторами'
      ],
      expectedOutput: '"Властелин колец" — Толкин, 5500 тг, 1200 стр.\nДорогая книга: true\n"Чистый код" — Мартин, 0 тг, 0 стр.\nДорогая книга: false',
      hint: 'Для второго конструктора вызови первый через this(title, author, 0, 0)',
      solution: 'public class Book {\n    String title;\n    String author;\n    double price;\n    int pages;\n\n    public Book(String title, String author, double price, int pages) {\n        this.title = title;\n        this.author = author;\n        this.price = price;\n        this.pages = pages;\n    }\n\n    public Book(String title, String author) {\n        this(title, author, 0, 0);\n    }\n\n    boolean isExpensive() {\n        return price > 3000;\n    }\n\n    public String toString() {\n        return "\\"" + title + "\\" — " + author + ", " + price + " тг, " + pages + " стр.";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Book b1 = new Book("Властелин колец", "Толкин", 5500, 1200);\n        System.out.println(b1);\n        System.out.println("Дорогая книга: " + b1.isExpensive());\n\n        Book b2 = new Book("Чистый код", "Мартин");\n        System.out.println(b2);\n        System.out.println("Дорогая книга: " + b2.isExpensive());\n    }\n}',
      explanation: 'Параметризованный конструктор позволяет создавать полностью инициализированные объекты в одну строку. Конструктор с двумя параметрами делегирует в главный через this(), избегая дублирования кода.'
    },
    {
      id: 7,
      title: 'Практика: Банковский счёт',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай класс BankAccount с несколькими конструкторами и операциями.',
      requirements: [
        'Поля: accountNumber, ownerName, balance',
        'Конструктор с тремя параметрами',
        'Конструктор только с accountNumber и ownerName (начальный баланс 0)',
        'Методы: deposit(double), withdraw(double), getBalance()',
        'withdraw должен выдать ошибку если средств недостаточно',
        'toString() должен показывать номер счёта, владельца и баланс'
      ],
      expectedOutput: 'Счёт: 001-Нурдаулет, баланс: 50000.0\nПополнено: 10000.0. Баланс: 60000.0\nСнято: 15000.0. Баланс: 45000.0\nНедостаточно средств!\nСчёт: 002-Айгерим, баланс: 0.0',
      hint: 'В методе withdraw используй условие: if (amount > balance) { ... } else { balance -= amount; }',
      solution: 'public class BankAccount {\n    String accountNumber;\n    String ownerName;\n    double balance;\n\n    public BankAccount(String accountNumber, String ownerName, double balance) {\n        this.accountNumber = accountNumber;\n        this.ownerName = ownerName;\n        this.balance = balance;\n    }\n\n    public BankAccount(String accountNumber, String ownerName) {\n        this(accountNumber, ownerName, 0);\n    }\n\n    void deposit(double amount) {\n        balance += amount;\n        System.out.println("Пополнено: " + amount + ". Баланс: " + balance);\n    }\n\n    void withdraw(double amount) {\n        if (amount > balance) {\n            System.out.println("Недостаточно средств!");\n        } else {\n            balance -= amount;\n            System.out.println("Снято: " + amount + ". Баланс: " + balance);\n        }\n    }\n\n    double getBalance() {\n        return balance;\n    }\n\n    public String toString() {\n        return "Счёт: " + accountNumber + "-" + ownerName + ", баланс: " + balance;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        BankAccount acc1 = new BankAccount("001", "Нурдаулет", 50000);\n        System.out.println(acc1);\n        acc1.deposit(10000);\n        acc1.withdraw(15000);\n        acc1.withdraw(100000);\n\n        BankAccount acc2 = new BankAccount("002", "Айгерим");\n        System.out.println(acc2);\n    }\n}',
      explanation: 'Банковский счёт — классический пример класса с конструкторами. Перегрузка конструкторов позволяет создавать счёт как с начальным балансом, так и без него. Метод withdraw защищает от ухода в минус.'
    }
  ]
}
