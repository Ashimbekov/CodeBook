export default {
  id: 15,
  title: 'Инкапсуляция',
  description: 'Модификаторы доступа, геттеры и сеттеры, защита данных объекта',
  lessons: [
    {
      id: 1,
      title: 'Что такое инкапсуляция?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Инкапсуляция — это принцип ООП, который означает "скрытие деталей". Мы прячем внутренние данные объекта и разрешаем доступ к ним только через специальные методы.' },
        { type: 'tip', value: 'Представь банкомат. Внутри него — деньги, сложная механика, компьютер. Но ты не лезешь внутрь руками — ты пользуешься кнопками. Кнопки — это и есть "методы доступа". Инкапсуляция означает: прячь внутренности, показывай только кнопки!' },
        { type: 'heading', value: 'Проблема без инкапсуляции' },
        { type: 'code', language: 'java', value: '// Без инкапсуляции — поля открыты, это опасно!\npublic class Person {\n    public int age; // Любой может изменить напрямую!\n}\n\nPerson p = new Person();\np.age = -500; // Отрицательный возраст — это ошибка, но никто не проверяет!\np.age = 9999; // Нереальный возраст — тоже никто не остановит' },
        { type: 'heading', value: 'Решение — инкапсуляция' },
        { type: 'code', language: 'java', value: '// С инкапсуляцией — поля защищены!\npublic class Person {\n    private int age; // Скрыто! Нельзя обратиться извне напрямую\n\n    // Только через метод с проверкой\n    public void setAge(int age) {\n        if (age >= 0 && age <= 150) {\n            this.age = age;\n        } else {\n            System.out.println("Недопустимый возраст!");\n        }\n    }\n\n    public int getAge() {\n        return age;\n    }\n}\n\nPerson p = new Person();\n// p.age = -500; // ОШИБКА! age — private\np.setAge(-500); // "Недопустимый возраст!" — защита сработала!\np.setAge(25);   // Всё отлично\nSystem.out.println(p.getAge()); // 25' },
        { type: 'note', value: 'Инкапсуляция — это не просто сделать поля private. Это целая идея: объект сам контролирует своё состояние, никто снаружи не может сломать его данные.' }
      ]
    },
    {
      id: 2,
      title: 'Модификаторы доступа',
      type: 'theory',
      content: [
        { type: 'text', value: 'Java имеет 4 модификатора доступа, которые контролируют кто может обращаться к классу, полю или методу.' },
        { type: 'heading', value: 'public — доступен всем' },
        { type: 'code', language: 'java', value: 'public class Animal {\n    public String name; // Доступно из любого места в программе\n\n    public void speak() { // Тоже доступно везде\n        System.out.println(name + " говорит что-то");\n    }\n}' },
        { type: 'heading', value: 'private — доступен только внутри класса' },
        { type: 'code', language: 'java', value: 'public class SafeBox {\n    private String secretCode; // Только этот класс может читать/менять!\n    private double amount;\n\n    public void setCode(String code) {\n        if (code.length() >= 4) {\n            this.secretCode = code; // Внутри класса — можно\n        }\n    }\n\n    // secretCode недоступен снаружи:\n    // SafeBox box = new SafeBox();\n    // box.secretCode = "1234"; // ОШИБКА КОМПИЛЯЦИИ!' },
        { type: 'heading', value: 'protected — для класса и наследников' },
        { type: 'code', language: 'java', value: 'public class Vehicle {\n    protected int speed; // Доступно в этом классе и в подклассах\n    protected String brand;\n\n    protected void accelerate() {\n        speed += 10;\n    }\n}\n\n// В подклассе (наследнике) — можно использовать protected\npublic class Car extends Vehicle {\n    void race() {\n        accelerate(); // OK — protected доступен в наследнике\n        System.out.println("Скорость: " + speed);\n    }\n}' },
        { type: 'heading', value: 'default (package-private) — для пакета' },
        { type: 'code', language: 'java', value: 'public class Helper {\n    // Нет модификатора = package-private\n    int value; // Доступно только внутри того же пакета\n\n    void doSomething() { // Тоже доступно только в пакете\n        System.out.println("Помогаю в пакете");\n    }\n}' },
        { type: 'list', items: [
          'public — все (любой класс, любой пакет)',
          'protected — этот класс + подклассы + тот же пакет',
          'default — только тот же пакет',
          'private — только этот класс'
        ]},
        { type: 'tip', value: 'Золотое правило: делай поля private, методы public. Исключения бывают, но это хорошая стартовая точка.' }
      ]
    },
    {
      id: 3,
      title: 'Геттеры и сеттеры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Геттер (getter) — метод для получения значения поля. Сеттер (setter) — метод для установки значения. Их называют методами доступа (accessor methods).' },
        { type: 'heading', value: 'Стандартные соглашения' },
        { type: 'code', language: 'java', value: 'public class Student {\n    private String name;    // приватное поле\n    private int age;\n    private double gpa;\n\n    // ГЕТТЕРЫ — начинаются с get\n    public String getName() {\n        return name;\n    }\n\n    public int getAge() {\n        return age;\n    }\n\n    public double getGpa() {\n        return gpa;\n    }\n\n    // СЕТТЕРЫ — начинаются с set\n    public void setName(String name) {\n        if (name != null && !name.isEmpty()) {\n            this.name = name;\n        }\n    }\n\n    public void setAge(int age) {\n        if (age >= 16 && age <= 100) {\n            this.age = age;\n        } else {\n            System.out.println("Некорректный возраст студента");\n        }\n    }\n\n    public void setGpa(double gpa) {\n        if (gpa >= 0.0 && gpa <= 5.0) {\n            this.gpa = gpa;\n        } else {\n            System.out.println("GPA должен быть от 0 до 5");\n        }\n    }\n}' },
        { type: 'code', language: 'java', value: '// Использование геттеров и сеттеров\nStudent student = new Student();\nstudent.setName("Нурдаулет");\nstudent.setAge(20);\nstudent.setGpa(4.8);\n\nSystem.out.println(student.getName()); // Нурдаулет\nSystem.out.println(student.getAge());  // 20\nSystem.out.println(student.getGpa());  // 4.8\n\nstudent.setAge(-5);    // "Некорректный возраст студента"\nstudent.setGpa(10.0);  // "GPA должен быть от 0 до 5"' },
        { type: 'heading', value: 'Геттер для boolean — isXxx' },
        { type: 'code', language: 'java', value: 'public class LightBulb {\n    private boolean isOn;\n\n    // Для boolean геттер называется isXxx, а не getXxx\n    public boolean isOn() {\n        return isOn;\n    }\n\n    public void setOn(boolean on) {\n        isOn = on;\n    }\n\n    public void toggle() {\n        isOn = !isOn;\n    }\n}\n\nLightBulb bulb = new LightBulb();\nbulb.setOn(true);\nSystem.out.println("Лампочка горит: " + bulb.isOn()); // true\nbulb.toggle();\nSystem.out.println("Лампочка горит: " + bulb.isOn()); // false' },
        { type: 'note', value: 'IDE (IntelliJ IDEA) умеет автоматически генерировать геттеры и сеттеры. Нажми Alt+Insert → Getter and Setter.' }
      ]
    },
    {
      id: 4,
      title: 'Зачем нужна инкапсуляция',
      type: 'theory',
      content: [
        { type: 'text', value: 'Инкапсуляция даёт несколько важных преимуществ: защита данных, возможность изменить реализацию, уменьшение ошибок.' },
        { type: 'heading', value: 'Преимущество 1: Валидация данных' },
        { type: 'code', language: 'java', value: 'public class Temperature {\n    private double celsius;\n\n    // Абсолютный ноль — -273.15°C\n    private static final double ABSOLUTE_ZERO = -273.15;\n\n    public void setCelsius(double celsius) {\n        if (celsius < ABSOLUTE_ZERO) {\n            throw new IllegalArgumentException("Температура ниже абсолютного нуля невозможна!");\n        }\n        this.celsius = celsius;\n    }\n\n    public double getCelsius() { return celsius; }\n\n    // Дополнительные вычисления в геттере!\n    public double getFahrenheit() {\n        return celsius * 9 / 5 + 32;\n    }\n\n    public double getKelvin() {\n        return celsius - ABSOLUTE_ZERO;\n    }\n}\n\nTemperature t = new Temperature();\nt.setCelsius(100);\nSystem.out.println(t.getCelsius() + "°C");\nSystem.out.println(t.getFahrenheit() + "°F"); // 212.0°F\nSystem.out.println(t.getKelvin() + "K");      // 373.15K' },
        { type: 'heading', value: 'Преимущество 2: Можно изменить реализацию' },
        { type: 'code', language: 'java', value: '// Версия 1: храним как строку\npublic class PhoneNumber {\n    private String number;\n\n    public void setNumber(String number) {\n        // Убираем все не-цифры\n        this.number = number.replaceAll("[^0-9]", "");\n    }\n\n    public String getNumber() {\n        return number;\n    }\n\n    // Версия 2 (позже): решили хранить как long\n    // Снаружи ничего не изменится — только внутренности!\n}' },
        { type: 'heading', value: 'Преимущество 3: Read-only и Write-only поля' },
        { type: 'code', language: 'java', value: 'public class Order {\n    private String orderId;\n    private String status;\n\n    public Order(String orderId) {\n        this.orderId = orderId;\n        this.status = "NEW";\n    }\n\n    // Только геттер — поле только для чтения!\n    public String getOrderId() {\n        return orderId;\n    }\n\n    public String getStatus() { return status; }\n    public void setStatus(String status) { this.status = status; }\n\n    // orderId нельзя изменить после создания!\n}' },
        { type: 'tip', value: 'Не создавай геттер и сеттер для каждого поля автоматически — подумай, нужны ли они. Иногда поле вообще не должно быть доступно снаружи!' }
      ]
    },
    {
      id: 5,
      title: 'Неизменяемые объекты (Immutable)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Неизменяемый (immutable) объект — это объект, который нельзя изменить после создания. Все поля устанавливаются в конструкторе и потом не меняются.' },
        { type: 'tip', value: 'Неизменяемый объект — как паспорт. Один раз выдан с данными, и изменить его нельзя (только получить новый). String в Java — неизменяемый объект! Каждый раз когда ты "изменяешь" строку — создаётся новая.' },
        { type: 'heading', value: 'Как сделать класс неизменяемым' },
        { type: 'list', items: [
          'Объявить класс final (нельзя наследовать)',
          'Все поля — private final',
          'Нет сеттеров',
          'Только конструктор для установки значений',
          'Если поле — объект, возвращай копию в геттере'
        ]},
        { type: 'code', language: 'java', value: 'public final class Point {\n    private final double x;\n    private final double y;\n\n    // Только конструктор — больше нельзя изменить\n    public Point(double x, double y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    public double getX() { return x; }\n    public double getY() { return y; }\n\n    // Вместо изменения — создаём новый объект!\n    public Point translate(double dx, double dy) {\n        return new Point(x + dx, y + dy);\n    }\n\n    public double distanceTo(Point other) {\n        double dx = this.x - other.x;\n        double dy = this.y - other.y;\n        return Math.sqrt(dx * dx + dy * dy);\n    }\n\n    public String toString() {\n        return "(" + x + ", " + y + ")";\n    }\n}\n\nPoint p1 = new Point(0, 0);\nPoint p2 = new Point(3, 4);\nPoint p3 = p1.translate(1, 1); // Создаётся новая точка!\n\nSystem.out.println(p1); // (0.0, 0.0) — не изменился!\nSystem.out.println(p3); // (1.0, 1.0)\nSystem.out.println(p1.distanceTo(p2)); // 5.0' },
        { type: 'note', value: 'Неизменяемые объекты очень удобны при многопоточном программировании — их можно безопасно использовать из разных потоков без синхронизации.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Класс с инкапсуляцией',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай класс Product (Товар) с приватными полями и публичными геттерами/сеттерами с валидацией.',
      requirements: [
        'Приватные поля: name, price, quantity',
        'Конструктор со всеми параметрами',
        'Геттеры для всех полей',
        'Сеттер для price — цена не может быть отрицательной',
        'Сеттер для quantity — количество от 0 до 10000',
        'Метод getTotalValue() — возвращает price * quantity',
        'toString() с информацией о товаре'
      ],
      expectedOutput: 'Товар: Ноутбук, цена: 250000.0, кол-во: 10\nОбщая стоимость: 2500000.0\nНекорректная цена!\nНекорректное количество!\nНоутбук: 250000.0 тг',
      hint: 'В сеттере проверяй условие и выводи сообщение об ошибке если оно нарушено. Используй this.price = price только если цена >= 0.',
      solution: 'public class Product {\n    private String name;\n    private double price;\n    private int quantity;\n\n    public Product(String name, double price, int quantity) {\n        this.name = name;\n        setPrice(price);\n        setQuantity(quantity);\n    }\n\n    public String getName() { return name; }\n    public double getPrice() { return price; }\n    public int getQuantity() { return quantity; }\n\n    public void setPrice(double price) {\n        if (price >= 0) {\n            this.price = price;\n        } else {\n            System.out.println("Некорректная цена!");\n        }\n    }\n\n    public void setQuantity(int quantity) {\n        if (quantity >= 0 && quantity <= 10000) {\n            this.quantity = quantity;\n        } else {\n            System.out.println("Некорректное количество!");\n        }\n    }\n\n    public double getTotalValue() {\n        return price * quantity;\n    }\n\n    public String toString() {\n        return name + ": " + price + " тг";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Product p = new Product("Ноутбук", 250000, 10);\n        System.out.println("Товар: " + p.getName() + ", цена: " + p.getPrice() + ", кол-во: " + p.getQuantity());\n        System.out.println("Общая стоимость: " + p.getTotalValue());\n        p.setPrice(-100);\n        p.setQuantity(20000);\n        System.out.println(p);\n    }\n}',
      explanation: 'Инкапсуляция защищает данные от некорректных значений. Конструктор использует сеттеры для валидации даже при создании объекта. getTotalValue() — вычисляемое свойство, нет смысла хранить его как поле.'
    },
    {
      id: 7,
      title: 'Практика: Неизменяемый класс',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай неизменяемый класс Money (Деньги) с суммой и валютой.',
      requirements: [
        'Класс final, поля private final: amount (double), currency (String)',
        'Только конструктор — без сеттеров',
        'Метод add(Money other) — создаёт новый объект с суммой (валюты должны совпадать)',
        'Метод multiply(double factor) — создаёт новый объект с умноженной суммой',
        'toString() — например "1500.0 KZT"',
        'Продемонстрируй что исходные объекты не меняются'
      ],
      expectedOutput: '1000.0 KZT\n500.0 KZT\n1500.0 KZT\n2000.0 KZT\n1000.0 KZT',
      hint: 'В методе add() проверяй currency.equals(other.currency). Создавай новый объект: return new Money(this.amount + other.amount, this.currency)',
      solution: 'public final class Money {\n    private final double amount;\n    private final String currency;\n\n    public Money(double amount, String currency) {\n        this.amount = amount;\n        this.currency = currency;\n    }\n\n    public double getAmount() { return amount; }\n    public String getCurrency() { return currency; }\n\n    public Money add(Money other) {\n        if (!this.currency.equals(other.currency)) {\n            throw new IllegalArgumentException("Нельзя складывать разные валюты!");\n        }\n        return new Money(this.amount + other.amount, this.currency);\n    }\n\n    public Money multiply(double factor) {\n        return new Money(this.amount * factor, this.currency);\n    }\n\n    public String toString() {\n        return amount + " " + currency;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Money m1 = new Money(1000, "KZT");\n        Money m2 = new Money(500, "KZT");\n        System.out.println(m1);\n        System.out.println(m2);\n        Money m3 = m1.add(m2);\n        System.out.println(m3);\n        Money m4 = m1.multiply(2);\n        System.out.println(m4);\n        System.out.println(m1); // Исходный не изменился!\n    }\n}',
      explanation: 'Неизменяемый класс final с private final полями гарантирует что объект не изменится. Операции add и multiply создают новые объекты вместо модификации текущего. Это делает код предсказуемым и безопасным.'
    }
  ]
}
