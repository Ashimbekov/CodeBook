export default {
  id: 13,
  title: 'Основы ООП: Классы и объекты',
  description: 'Что такое объектно-ориентированное программирование, как создавать классы и объекты в Java',
  lessons: [
    {
      id: 1,
      title: 'Что такое ООП?',
      type: 'theory',
      content: [
        { type: 'text', value: 'ООП (Объектно-ориентированное программирование) — это способ писать программы, при котором мы думаем не командами, а объектами реального мира.' },
        { type: 'tip', value: 'Представь, что ты играешь в игру с машинками. У каждой машинки есть свойства: цвет, марка, скорость. И у каждой машинки есть действия: ехать, тормозить, сигналить. В ООП машинка — это объект, её свойства — это поля, а действия — методы!' },
        { type: 'heading', value: 'Почему ООП удобно?' },
        { type: 'list', items: [
          'Код похож на реальный мир — легче думать и проектировать',
          'Можно переиспользовать код — написал класс один раз, используй везде',
          'Легче поддерживать — изменения в одном классе не ломают весь код',
          'Большие программы становятся управляемыми'
        ]},
        { type: 'heading', value: 'Четыре принципа ООП' },
        { type: 'list', items: [
          'Инкапсуляция — прячем детали внутри объекта',
          'Наследование — один класс может быть похож на другой',
          'Полиморфизм — разные объекты могут делать одно действие по-своему',
          'Абстракция — показываем только важное, скрываем сложное'
        ]},
        { type: 'text', value: 'В этом и следующих модулях мы разберём каждый принцип с примерами. Начнём с основ — классов и объектов.' },
        { type: 'note', value: 'До Java большинство программ писались процедурно — как список команд сверху вниз. ООП изменило подход: теперь программа — это набор взаимодействующих объектов.' }
      ]
    },
    {
      id: 2,
      title: 'Класс — это чертёж',
      type: 'theory',
      content: [
        { type: 'text', value: 'Класс — это шаблон или чертёж, по которому создаются объекты. Сам класс — это не объект, это только описание того, каким объект должен быть.' },
        { type: 'tip', value: 'Класс — это как рецепт торта. Рецепт сам по себе не торт — это просто инструкция. Но по одному рецепту можно испечь много одинаковых тортов. Каждый испечённый торт — это отдельный объект (экземпляр класса).' },
        { type: 'heading', value: 'Как выглядит класс' },
        { type: 'code', language: 'java', value: '// Класс — это чертёж машины\npublic class Car {\n    // Поля (свойства) — что есть у каждой машины\n    String brand;    // марка\n    String color;    // цвет\n    int speed;       // скорость\n    int year;        // год выпуска\n\n    // Методы (действия) — что машина умеет делать\n    void accelerate() {\n        speed += 10;\n        System.out.println("Машина разгоняется! Скорость: " + speed);\n    }\n\n    void brake() {\n        speed -= 10;\n        System.out.println("Машина тормозит! Скорость: " + speed);\n    }\n\n    void honk() {\n        System.out.println(brand + " сигналит: Бип-бип!");\n    }\n}' },
        { type: 'heading', value: 'Структура класса' },
        { type: 'list', items: [
          'public class ИмяКласса — объявление класса',
          'Имя класса всегда пишется с большой буквы (Car, Person, BankAccount)',
          'Внутри фигурных скобок {} — всё содержимое класса',
          'Поля — переменные класса (описывают состояние)',
          'Методы — функции класса (описывают поведение)'
        ]},
        { type: 'note', value: 'Имя файла должно совпадать с именем public класса. Класс Car — файл Car.java.' }
      ]
    },
    {
      id: 3,
      title: 'Создание объектов с new',
      type: 'theory',
      content: [
        { type: 'text', value: 'Объект — это конкретный экземпляр класса. Чтобы создать объект, используется ключевое слово new.' },
        { type: 'tip', value: 'Если класс Car — это чертёж, то new Car() — это строительство конкретной машины по этому чертежу. После этого у тебя есть настоящая машина, с которой можно работать.' },
        { type: 'heading', value: 'Синтаксис создания объекта' },
        { type: 'code', language: 'java', value: '// Создаём объект (экземпляр класса Car)\nCar myCar = new Car();\n\n// Что здесь происходит:\n// Car    — тип переменной (класс)\n// myCar  — имя переменной\n// new    — ключевое слово для создания объекта\n// Car()  — вызов конструктора (создание объекта в памяти)' },
        { type: 'heading', value: 'Полный пример' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        // Создаём объект типа Car\n        Car myCar = new Car();\n\n        // Устанавливаем значения полей\n        myCar.brand = "Toyota";\n        myCar.color = "Красный";\n        myCar.speed = 0;\n        myCar.year = 2023;\n\n        // Вызываем методы\n        System.out.println("Марка: " + myCar.brand);\n        System.out.println("Цвет: " + myCar.color);\n        myCar.honk();\n        myCar.accelerate();\n        myCar.accelerate();\n    }\n}\n\n// Вывод:\n// Марка: Toyota\n// Цвет: Красный\n// Toyota сигналит: Бип-бип!\n// Машина разгоняется! Скорость: 10\n// Машина разгоняется! Скорость: 20' },
        { type: 'heading', value: 'Доступ к полям и методам' },
        { type: 'text', value: 'Для доступа к полям и методам объекта используется точка (.)' },
        { type: 'code', language: 'java', value: 'Car car = new Car();\n\n// Доступ к полю через точку\ncar.color = "Синий";\nSystem.out.println(car.color);\n\n// Вызов метода через точку\ncar.honk();\ncar.accelerate();' },
        { type: 'warning', value: 'Если ты не присвоишь значение полю, у него будет значение по умолчанию: числа = 0, boolean = false, String и объекты = null.' }
      ]
    },
    {
      id: 4,
      title: 'Поля класса',
      type: 'theory',
      content: [
        { type: 'text', value: 'Поля класса (Fields) — это переменные, которые описывают состояние объекта. Каждый объект имеет свою собственную копию полей.' },
        { type: 'tip', value: 'У двух машин Toyota одинаковый чертёж (класс), но они отдельные машины с разными номерами и цветами. Так и два объекта одного класса — у каждого свои поля.' },
        { type: 'heading', value: 'Пример с несколькими объектами' },
        { type: 'code', language: 'java', value: 'public class Person {\n    String name;\n    int age;\n    String city;\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Создаём первого человека\n        Person person1 = new Person();\n        person1.name = "Нурдаулет";\n        person1.age = 25;\n        person1.city = "Астана";\n\n        // Создаём второго человека\n        Person person2 = new Person();\n        person2.name = "Айгерим";\n        person2.age = 22;\n        person2.city = "Алматы";\n\n        // Каждый объект хранит свои данные!\n        System.out.println(person1.name + " из " + person1.city);\n        System.out.println(person2.name + " из " + person2.city);\n    }\n}\n\n// Нурдаулет из Астана\n// Айгерим из Алматы' },
        { type: 'heading', value: 'Значения по умолчанию' },
        { type: 'code', language: 'java', value: 'public class Student {\n    String name;    // null по умолчанию\n    int grade;      // 0 по умолчанию\n    double gpa;     // 0.0 по умолчанию\n    boolean active; // false по умолчанию\n}\n\nStudent s = new Student();\nSystem.out.println(s.name);   // null\nSystem.out.println(s.grade);  // 0\nSystem.out.println(s.active); // false' },
        { type: 'note', value: 'Хорошей практикой считается инициализировать поля сразу при объявлении или в конструкторе (о конструкторах — в следующем модуле).' }
      ]
    },
    {
      id: 5,
      title: 'Методы класса',
      type: 'theory',
      content: [
        { type: 'text', value: 'Методы — это действия, которые умеет выполнять объект. Они работают с полями объекта и могут принимать параметры и возвращать результат.' },
        { type: 'heading', value: 'Метод без параметров и возврата' },
        { type: 'code', language: 'java', value: 'public class Dog {\n    String name;\n    String breed;\n    int age;\n\n    // Метод без параметров, ничего не возвращает\n    void bark() {\n        System.out.println(name + " говорит: Гав-гав!");\n    }\n\n    void introduce() {\n        System.out.println("Я " + name + ", порода: " + breed + ", возраст: " + age);\n    }\n}' },
        { type: 'heading', value: 'Метод с параметрами' },
        { type: 'code', language: 'java', value: 'public class Calculator {\n    double result;\n\n    // Метод с параметрами\n    void add(double a, double b) {\n        result = a + b;\n        System.out.println(a + " + " + b + " = " + result);\n    }\n\n    // Метод возвращает значение\n    double multiply(double a, double b) {\n        return a * b;\n    }\n}\n\n// Использование:\nCalculator calc = new Calculator();\ncalc.add(5.0, 3.0);       // 5.0 + 3.0 = 8.0\ndouble r = calc.multiply(4.0, 7.0);\nSystem.out.println("4 * 7 = " + r); // 4 * 7 = 28.0' },
        { type: 'heading', value: 'Методы могут менять поля объекта' },
        { type: 'code', language: 'java', value: 'public class BankAccount {\n    String owner;\n    double balance;\n\n    void deposit(double amount) {\n        balance += amount;\n        System.out.println("Пополнено на " + amount + ". Баланс: " + balance);\n    }\n\n    void withdraw(double amount) {\n        if (amount <= balance) {\n            balance -= amount;\n            System.out.println("Снято " + amount + ". Баланс: " + balance);\n        } else {\n            System.out.println("Недостаточно средств!");\n        }\n    }\n}\n\nBankAccount account = new BankAccount();\naccount.owner = "Нурдаулет";\naccount.balance = 1000;\naccount.deposit(500);   // Пополнено на 500.0. Баланс: 1500.0\naccount.withdraw(200);  // Снято 200.0. Баланс: 1300.0\naccount.withdraw(2000); // Недостаточно средств!' },
        { type: 'tip', value: 'Методы — это "глаголы" объекта. Если поля описывают что объект ЕСТЬ, то методы описывают что объект УМЕЕТ ДЕЛАТЬ.' }
      ]
    },
    {
      id: 6,
      title: 'Несколько объектов одного класса',
      type: 'theory',
      content: [
        { type: 'text', value: 'Одним из главных преимуществ классов является то, что можно создать сколько угодно объектов. Каждый объект независим — изменение одного не влияет на другой.' },
        { type: 'code', language: 'java', value: 'public class Phone {\n    String brand;\n    String model;\n    int battery; // процент заряда\n    boolean isOn;\n\n    void turnOn() {\n        isOn = true;\n        System.out.println(brand + " " + model + " включён");\n    }\n\n    void charge(int percent) {\n        battery = Math.min(100, battery + percent);\n        System.out.println("Заряд: " + battery + "%");\n    }\n\n    void call(String number) {\n        if (isOn) {\n            System.out.println("Звонок на " + number + " с " + brand);\n        } else {\n            System.out.println("Телефон выключен!");\n        }\n    }\n}' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        // Создаём три телефона\n        Phone phone1 = new Phone();\n        phone1.brand = "Samsung";\n        phone1.model = "Galaxy S23";\n        phone1.battery = 50;\n\n        Phone phone2 = new Phone();\n        phone2.brand = "Apple";\n        phone2.model = "iPhone 15";\n        phone2.battery = 80;\n\n        Phone phone3 = new Phone();\n        phone3.brand = "Xiaomi";\n        phone3.model = "13 Pro";\n        phone3.battery = 20;\n\n        // Каждый работает независимо\n        phone1.turnOn();\n        phone2.turnOn();\n        phone1.call("+7 777 123 45 67");\n        phone3.charge(50);\n\n        // Изменение phone1 не влияет на phone2!\n        phone1.battery = 100;\n        System.out.println("Samsung: " + phone1.battery + "%");\n        System.out.println("Apple: " + phone2.battery + "%"); // 80, не изменился\n    }\n}' },
        { type: 'tip', value: 'Массив объектов — очень удобная вещь! Можно создать 100 объектов Person и хранить их в массиве Person[] students = new Person[100];' },
        { type: 'code', language: 'java', value: '// Массив объектов\nPhone[] phones = new Phone[3];\nphones[0] = new Phone();\nphones[0].brand = "Samsung";\nphones[1] = new Phone();\nphones[1].brand = "Apple";\nphones[2] = new Phone();\nphones[2].brand = "Xiaomi";\n\n// Перебор в цикле\nfor (Phone p : phones) {\n    System.out.println("Телефон: " + p.brand);\n}' }
      ]
    },
    {
      id: 7,
      title: 'Метод toString()',
      type: 'theory',
      content: [
        { type: 'text', value: 'toString() — это специальный метод, который возвращает строковое представление объекта. Когда ты пытаешься напечатать объект через println, Java автоматически вызывает toString().' },
        { type: 'heading', value: 'Без toString() — некрасиво' },
        { type: 'code', language: 'java', value: 'public class Cat {\n    String name;\n    int age;\n}\n\nCat cat = new Cat();\ncat.name = "Мурзик";\ncat.age = 3;\n\n// Без toString() выводится что-то вроде:\nSystem.out.println(cat); // Cat@7852e922 — адрес в памяти!' },
        { type: 'heading', value: 'Добавляем toString()' },
        { type: 'code', language: 'java', value: 'public class Cat {\n    String name;\n    int age;\n    String color;\n\n    // Переопределяем toString()\n    public String toString() {\n        return "Кот " + name + ", возраст: " + age + ", цвет: " + color;\n    }\n}\n\nCat cat = new Cat();\ncat.name = "Мурзик";\ncat.age = 3;\ncat.color = "Рыжий";\n\nSystem.out.println(cat); // Кот Мурзик, возраст: 3, цвет: Рыжий\n\n// Java автоматически вызывает toString() при конкатенации!\nString info = "Мой питомец: " + cat;\nSystem.out.println(info); // Мой питомец: Кот Мурзик, возраст: 3, цвет: Рыжий' },
        { type: 'heading', value: 'Пример с несколькими классами' },
        { type: 'code', language: 'java', value: 'public class Book {\n    String title;\n    String author;\n    int year;\n    double price;\n\n    public String toString() {\n        return "\"" + title + "\" (" + author + ", " + year + ") — " + price + " тг";\n    }\n}\n\nBook book1 = new Book();\nbook1.title = "Гарри Поттер";\nbook1.author = "Дж. Роулинг";\nbook1.year = 1997;\nbook1.price = 2500;\n\nBook book2 = new Book();\nbook2.title = "Чистый код";\nbook2.author = "Р. Мартин";\nbook2.year = 2008;\nbook2.price = 4900;\n\nSystem.out.println(book1); // "Гарри Поттер" (Дж. Роулинг, 1997) — 2500.0 тг\nSystem.out.println(book2); // "Чистый код" (Р. Мартин, 2008) — 4900.0 тг' },
        { type: 'tip', value: 'Всегда добавляй toString() в свои классы — это хорошая привычка. Она поможет при отладке и выводе информации.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Создай класс и объекты',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай класс Student с полями и методами, затем создай несколько объектов и выведи информацию.',
      requirements: [
        'Создай класс Student с полями: name (String), age (int), gpa (double)',
        'Добавь метод printInfo() который выводит всю информацию о студенте',
        'Добавь метод isExcellent() который возвращает true если gpa >= 4.5',
        'Переопредели toString()',
        'Создай минимум 2 объекта Student и вызови их методы'
      ],
      expectedOutput: 'Студент: Алия, возраст: 20, GPA: 4.8\nОтличник: true\nСтудент: Берик, возраст: 21, GPA: 3.5\nОтличник: false',
      hint: 'Начни с объявления класса Student с тремя полями. Метод isExcellent() должен вернуть boolean: return gpa >= 4.5;',
      solution: 'public class Student {\n    String name;\n    int age;\n    double gpa;\n\n    void printInfo() {\n        System.out.println("Студент: " + name + ", возраст: " + age + ", GPA: " + gpa);\n    }\n\n    boolean isExcellent() {\n        return gpa >= 4.5;\n    }\n\n    public String toString() {\n        return "Student{" + name + ", " + age + ", " + gpa + "}";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Student s1 = new Student();\n        s1.name = "Алия";\n        s1.age = 20;\n        s1.gpa = 4.8;\n        s1.printInfo();\n        System.out.println("Отличник: " + s1.isExcellent());\n\n        Student s2 = new Student();\n        s2.name = "Берик";\n        s2.age = 21;\n        s2.gpa = 3.5;\n        s2.printInfo();\n        System.out.println("Отличник: " + s2.isExcellent());\n    }\n}',
      explanation: 'Мы создали класс Student с тремя полями. Метод printInfo() выводит данные объекта, используя поля через this (неявно). Метод isExcellent() возвращает boolean результат сравнения. Два объекта созданы с new Student() и имеют независимые данные.'
    }
  ]
}
