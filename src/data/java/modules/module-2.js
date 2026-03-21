export default {
  id: 2,
  title: 'Переменные и типы данных',
  description: 'Научимся хранить данные в переменных и узнаем какие типы данных есть в Java',
  lessons: [
    {
      id: 1, title: 'Что такое переменные?', type: 'theory',
      content: [
        { type: 'text', value: 'Переменная — это именованное место в памяти компьютера, где хранится какое-то значение. Ты даёшь ей имя и кладёшь туда данные.' },
        { type: 'tip', value: 'Представь переменную как коробку с наклейкой. На наклейке написано название (имя переменной), а внутри лежит что-то (значение). Ты можешь положить что-то в коробку, достать или заменить содержимое.' },
        { type: 'heading', value: 'Как создать переменную' },
        { type: 'text', value: 'В Java, чтобы создать переменную, нужно указать её тип, дать имя и (необязательно) присвоить значение:' },
        { type: 'code', language: 'java', value: '// Создаём переменную и сразу даём значение\nint age = 25;\n\n// Или сначала создаём, потом даём значение\nint height;\nheight = 180;' },
        { type: 'heading', value: 'Правила именования' },
        { type: 'list', items: ['Имя начинается с буквы, _ или $ (но не с цифры)', 'Может содержать буквы, цифры, _ и $', 'Нельзя использовать пробелы', 'Нельзя использовать зарезервированные слова (int, class, public и т.д.)', 'Java различает регистр: age и Age — разные переменные', 'Принято использовать camelCase: myFirstName, totalPrice'] },
        { type: 'code', language: 'java', value: '// Правильно:\nint myAge = 25;\nString firstName = "Нурдаулет";\ndouble totalPrice = 99.99;\n\n// Неправильно:\n// int 1stPlace = 1;     // начинается с цифры\n// int my age = 25;      // пробел в имени\n// int class = 5;        // зарезервированное слово' },
        { type: 'warning', value: 'Java строго типизированный язык — тип переменной нельзя изменить после создания. Если ты создал int age, туда нельзя положить текст.' }
      ]
    },
    {
      id: 2, title: 'Целые числа: int и long', type: 'theory',
      content: [
        { type: 'text', value: 'Для хранения целых чисел (без дробной части) в Java есть несколько типов. Два самых важных: int и long.' },
        { type: 'heading', value: 'int — основной тип для целых чисел' },
        { type: 'text', value: 'int хранит числа от -2 147 483 648 до 2 147 483 647 (примерно ±2 миллиарда). Этого хватает для большинства задач.' },
        { type: 'code', language: 'java', value: 'int age = 25;\nint year = 2024;\nint temperature = -15;\nint population = 2000000000;\n\nSystem.out.println("Возраст: " + age);\nSystem.out.println("Год: " + year);' },
        { type: 'heading', value: 'long — для очень больших чисел' },
        { type: 'text', value: 'Если числа больше 2 миллиардов — используй long. Например, население Земли или расстояние до звёзд.' },
        { type: 'code', language: 'java', value: 'long worldPopulation = 8000000000L;\nlong distanceToSun = 149600000000L;\n\nSystem.out.println("Население Земли: " + worldPopulation);' },
        { type: 'warning', value: 'Число типа long нужно писать с буквой L на конце! Без неё Java подумает, что это int, и выдаст ошибку если число слишком большое.' },
        { type: 'heading', value: 'Арифметические операции' },
        { type: 'code', language: 'java', value: 'int a = 10;\nint b = 3;\n\nSystem.out.println(a + b);  // 13 (сложение)\nSystem.out.println(a - b);  // 7  (вычитание)\nSystem.out.println(a * b);  // 30 (умножение)\nSystem.out.println(a / b);  // 3  (деление — целая часть!)\nSystem.out.println(a % b);  // 1  (остаток от деления)' },
        { type: 'note', value: 'При делении int на int результат тоже int — дробная часть отбрасывается! 10 / 3 = 3, а не 3.33. Если нужна дробная часть — используй double.' }
      ]
    },
    {
      id: 3, title: 'Дробные числа: double', type: 'theory',
      content: [
        { type: 'text', value: 'Для чисел с дробной частью (десятичных) используется тип double.' },
        { type: 'code', language: 'java', value: 'double price = 99.99;\ndouble pi = 3.14159;\ndouble temperature = -12.5;\n\nSystem.out.println("Цена: " + price);\nSystem.out.println("Пи: " + pi);' },
        { type: 'tip', value: 'double — это как калькулятор: он умеет работать с десятичными дробями. int — как счёт на пальцах: только целые числа.' },
        { type: 'heading', value: 'Арифметика с double' },
        { type: 'code', language: 'java', value: 'double a = 10.0;\ndouble b = 3.0;\n\nSystem.out.println(a / b);  // 3.3333333333333335\nSystem.out.println(a + 0.5); // 10.5' },
        { type: 'heading', value: 'Смешанные вычисления' },
        { type: 'text', value: 'Если в выражении есть хотя бы один double, результат будет double:' },
        { type: 'code', language: 'java', value: 'int x = 10;\ndouble y = 3.0;\n\nSystem.out.println(x / y); // 3.3333... — double!\nSystem.out.println(x / 3); // 3 — оба int, результат int' },
        { type: 'warning', value: 'Будь осторожен с точностью! double хранит приближённые значения. Например: 0.1 + 0.2 = 0.30000000000000004. Для финансовых расчётов используют BigDecimal (узнаешь позже).' }
      ]
    },
    {
      id: 4, title: 'Текст: String и char', type: 'theory',
      content: [
        { type: 'text', value: 'Программы работают не только с числами — им нужно работать с текстом! Для этого в Java есть String и char.' },
        { type: 'tip', value: 'Представь что String — это целое предложение на бумаге, а char — одна единственная буква. В коробку String помещается сколько угодно букв, а в коробку char — только одна.' },
        { type: 'heading', value: 'String — текстовые строки' },
        { type: 'text', value: 'String хранит текст. Текст всегда оборачивается в двойные кавычки:' },
        { type: 'code', language: 'java', value: 'String name = "Нурдаулет";\nString greeting = "Привет, мир!";\nString empty = "";\n\nSystem.out.println(name);\nSystem.out.println(greeting);' },
        { type: 'note', value: 'String пишется с большой буквы — это не примитивный тип, а класс. Об этом подробнее узнаем в модуле про ООП.' },
        { type: 'heading', value: 'Склейка строк (конкатенация)' },
        { type: 'code', language: 'java', value: 'String first = "Привет";\nString second = "мир";\nString result = first + ", " + second + "!";\n\nSystem.out.println(result); // Привет, мир!\n\nint age = 25;\nSystem.out.println("Мне " + age + " лет"); // Мне 25 лет' },
        { type: 'heading', value: 'char — один символ' },
        { type: 'code', language: 'java', value: "char letter = 'A';\nchar digit = '5';\nchar symbol = '@';\n\nSystem.out.println(letter); // A" },
        { type: 'warning', value: 'Не путай двойные и одинарные кавычки! "Текст" — это String, а \'A\' — это char. Одинарные кавычки только для одного символа.' }
      ]
    },
    {
      id: 5, title: 'Логический тип: boolean', type: 'theory',
      content: [
        { type: 'text', value: 'boolean — это самый простой тип данных. Он хранит только два возможных значения: true (правда) или false (ложь).' },
        { type: 'tip', value: 'boolean — как выключатель: вкл (true) или выкл (false). Или как ответ на вопрос "да или нет?".' },
        { type: 'code', language: 'java', value: 'boolean isStudent = true;\nboolean isRaining = false;\nboolean hasLicense = true;\n\nSystem.out.println("Студент: " + isStudent);\nSystem.out.println("Дождь: " + isRaining);' },
        { type: 'heading', value: 'Операции сравнения' },
        { type: 'text', value: 'boolean часто получается в результате сравнений:' },
        { type: 'code', language: 'java', value: 'int age = 25;\n\nboolean isAdult = age >= 18;\nboolean isTeenager = age < 18;\nboolean isExactly25 = age == 25;\nboolean isNot25 = age != 25;\n\nSystem.out.println("Взрослый: " + isAdult);' },
        { type: 'warning', value: 'Для сравнения используй == (два знака равно), а не = (один). Один знак = — это присваивание (положить значение в переменную), два == — это сравнение (проверить равны ли значения).' },
        { type: 'note', value: 'boolean будет очень важен когда мы дойдём до условий (if/else) и циклов. Именно он решает, какой код выполнять.' }
      ]
    },
    {
      id: 6, title: 'Практика: Переменные', type: 'practice', difficulty: 'easy',
      description: 'Создай программу "Визитная карточка", которая выводит информацию о человеке используя переменные разных типов.',
      requirements: ['Создай переменную String для имени', 'Создай переменную int для возраста', 'Создай переменную String для города', 'Создай переменную boolean для статуса студента', 'Выведи всё в формате из примера'],
      expectedOutput: '=== Визитная карточка ===\nИмя: Нурдаулет\nВозраст: 25\nГород: Астана\nСтудент: true\n========================',
      hint: 'Объяви каждую переменную на отдельной строке, а потом используй System.out.println() для каждой строки вывода. Склеивай текст и переменные через +',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        String name = "Нурдаулет";\n        int age = 25;\n        String city = "Астана";\n        boolean isStudent = true;\n\n        System.out.println("=== Визитная карточка ===");\n        System.out.println("Имя: " + name);\n        System.out.println("Возраст: " + age);\n        System.out.println("Город: " + city);\n        System.out.println("Студент: " + isStudent);\n        System.out.println("========================");\n    }\n}',
      explanation: 'Мы создали 4 переменные разных типов и вывели их, склеивая текст с переменными через +. Java автоматически превращает числа и boolean в текст при склейке со String.'
    },
    {
      id: 7, title: 'Практика: Калькулятор', type: 'practice', difficulty: 'medium',
      description: 'Напиши программу-калькулятор, которая берёт два числа и показывает результат всех арифметических операций.',
      requirements: ['Создай две переменные int с любыми значениями', 'Выведи результат сложения, вычитания, умножения, деления и остатка от деления', 'Каждый результат на отдельной строке с подписью'],
      expectedOutput: 'a = 17, b = 5\nСложение: 22\nВычитание: 12\nУмножение: 85\nДеление: 3\nОстаток: 2',
      hint: 'Используй операторы +, -, *, /, %. Не забудь, что деление int на int даёт целый результат.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int a = 17;\n        int b = 5;\n\n        System.out.println("a = " + a + ", b = " + b);\n        System.out.println("Сложение: " + (a + b));\n        System.out.println("Вычитание: " + (a - b));\n        System.out.println("Умножение: " + (a * b));\n        System.out.println("Деление: " + (a / b));\n        System.out.println("Остаток: " + (a % b));\n    }\n}',
      explanation: 'Обрати внимание на скобки вокруг арифметических выражений: (a + b). Без скобок Java сначала склеит "Сложение: " с a (получится строка), а потом приклеит b — результат будет неправильным. Скобки заставляют Java сначала посчитать, а потом склеить.'
    },
    {
      id: 8, title: 'Практика: Обмен значений', type: 'practice', difficulty: 'medium',
      description: 'Напиши программу, которая меняет значения двух переменных местами.',
      requirements: ['Создай две переменные int: a = 10, b = 20', 'Выведи их значения до обмена', 'Поменяй значения местами (a должна стать 20, b должна стать 10)', 'Выведи значения после обмена', 'Подсказка: понадобится третья переменная'],
      expectedOutput: 'До обмена: a = 10, b = 20\nПосле обмена: a = 20, b = 10',
      hint: 'Создай временную переменную temp. Положи туда значение a, потом в a положи значение b, потом в b положи значение из temp.',
      solution: 'public class Main {\n    public static void main(String[] args) {\n        int a = 10;\n        int b = 20;\n\n        System.out.println("До обмена: a = " + a + ", b = " + b);\n\n        int temp = a;\n        a = b;\n        b = temp;\n\n        System.out.println("После обмена: a = " + a + ", b = " + b);\n    }\n}',
      explanation: 'Мы использовали временную переменную temp как "третью руку". Без неё при a = b мы потеряли бы старое значение a. Это классическая задача, которую часто спрашивают на собеседованиях!'
    }
  ]
}
