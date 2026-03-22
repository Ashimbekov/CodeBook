export default {
  id: 11,
  title: 'Классы и объекты',
  description: 'Создание классов, первичный конструктор, init, свойства, методы и объекты',
  lessons: [
    {
      id: 1,
      title: 'Что такое класс?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Класс — это шаблон (чертёж) для создания объектов. Он описывает какие данные хранит объект (свойства) и что умеет делать (методы). Объект — это конкретный экземпляр класса, созданный по этому шаблону.' },
        { type: 'tip', value: 'Класс — это чертёж дома. По одному чертежу можно построить много одинаковых домов. Каждый дом (объект) — отдельный, со своим адресом, но построен по тому же плану.' },
        { type: 'code', language: 'kotlin', value: '// Простой класс\nclass Dog {\n    var name = "Шарик"\n    var age = 3\n    \n    fun bark() {\n        println("Гав! Меня зовут $name")\n    }\n    \n    fun info() {\n        println("Собака $name, возраст: $age")\n    }\n}\n\nfun main() {\n    val dog1 = Dog()   // создаём объект\n    dog1.name = "Бобик"\n    dog1.bark()        // Гав! Меня зовут Бобик\n    \n    val dog2 = Dog()   // другой объект\n    dog2.name = "Рекс"\n    dog2.age = 5\n    dog2.info()        // Собака Рекс, возраст: 5\n}' },
        { type: 'note', value: 'В Kotlin класс создаётся без ключевого слова new! Просто Dog() — вызов конструктора. Это одно из отличий от Java.' }
      ]
    },
    {
      id: 2,
      title: 'Первичный конструктор',
      type: 'theory',
      content: [
        { type: 'text', value: 'Первичный конструктор в Kotlin пишется прямо в заголовке класса. Это делает код гораздо компактнее по сравнению с Java.' },
        { type: 'code', language: 'kotlin', value: '// Первичный конструктор — параметры в скобках после имени класса\nclass Person(val name: String, var age: Int) {\n    \n    fun greet() {\n        println("Привет! Я $name, мне $age лет.")\n    }\n}\n\nfun main() {\n    val person = Person("Нурдаулет", 25)\n    person.greet()   // Привет! Я Нурдаулет, мне 25 лет.\n    \n    person.age = 26  // var — можно изменить\n    // person.name = "Другое"  // val — нельзя!\n    \n    println(person.name)  // Нурдаулет\n    println(person.age)   // 26\n}' },
        { type: 'tip', value: 'val/var в конструкторе — это сразу и параметр, и свойство класса. Написал class Person(val name: String) — получил и конструктор, и свойство name, которое можно читать через person.name.' },
        { type: 'heading', value: 'Сравни с Java' },
        { type: 'code', language: 'kotlin', value: '// Java — 15+ строк:\n// public class Person {\n//     private final String name;\n//     private int age;\n//     public Person(String name, int age) {\n//         this.name = name;\n//         this.age = age;\n//     }\n//     public String getName() { return name; }\n//     public int getAge() { return age; }\n//     public void setAge(int age) { this.age = age; }\n// }\n\n// Kotlin — 1 строка:\nclass Person(val name: String, var age: Int)' }
      ]
    },
    {
      id: 3,
      title: 'Блок init — инициализация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Блок init выполняется при создании объекта, сразу после конструктора. Используется для дополнительной инициализации и проверок.' },
        { type: 'code', language: 'kotlin', value: 'class BankAccount(val owner: String, initialBalance: Double) {\n    var balance: Double\n    \n    init {\n        require(initialBalance >= 0) { "Баланс не может быть отрицательным!" }\n        balance = initialBalance\n        println("Счёт создан для $owner с балансом $balance")\n    }\n    \n    fun deposit(amount: Double) {\n        require(amount > 0) { "Сумма пополнения должна быть положительной" }\n        balance += amount\n        println("Пополнено на $amount. Новый баланс: $balance")\n    }\n}\n\nfun main() {\n    val account = BankAccount("Нурдаулет", 1000.0)\n    // Счёт создан для Нурдаулет с балансом 1000.0\n    \n    account.deposit(500.0)\n    // Пополнено на 500.0. Новый баланс: 1500.0\n}' },
        { type: 'tip', value: 'require() — встроенная функция Kotlin для проверки условий. Если условие ложное — бросает IllegalArgumentException с твоим сообщением. Удобная замена if + throw.' },
        { type: 'note', value: 'В классе можно иметь несколько блоков init — они выполняются по порядку. Параметры конструктора (без val/var) доступны внутри init, но не становятся свойствами класса.' }
      ]
    },
    {
      id: 4,
      title: 'Свойства: геттеры и сеттеры',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Kotlin свойства (properties) — это не просто поля. У них могут быть кастомные геттеры и сеттеры, позволяющие добавить логику при чтении или записи.' },
        { type: 'code', language: 'kotlin', value: 'class Temperature(var celsius: Double) {\n    \n    // Вычисляемое свойство — нет backing field\n    val fahrenheit: Double\n        get() = celsius * 9.0 / 5.0 + 32.0\n    \n    val description: String\n        get() = when {\n            celsius < 0  -> "Мороз"\n            celsius < 15 -> "Прохладно"\n            celsius < 25 -> "Тепло"\n            else         -> "Жарко"\n        }\n}\n\nfun main() {\n    val temp = Temperature(20.0)\n    println("${temp.celsius}°C = ${temp.fahrenheit}°F")  // 20.0°C = 68.0°F\n    println(temp.description)  // Тепло\n    \n    temp.celsius = -5.0\n    println(temp.description)  // Мороз\n}' },
        { type: 'tip', value: 'Геттер без сеттера — свойство только для чтения. fahrenheit вычисляется каждый раз при обращении — никакого хранения, только формула. Это "живое" значение.' },
        { type: 'heading', value: 'Кастомный сеттер' },
        { type: 'code', language: 'kotlin', value: 'class User(name: String) {\n    var name: String = name\n        set(value) {\n            require(value.isNotBlank()) { "Имя не может быть пустым" }\n            field = value.trim()  // field — backing field (реальное хранилище)\n        }\n}' }
      ]
    },
    {
      id: 5,
      title: 'Методы класса',
      type: 'theory',
      content: [
        { type: 'text', value: 'Методы — функции внутри класса. Они имеют доступ ко всем свойствам и могут вызывать другие методы класса.' },
        { type: 'code', language: 'kotlin', value: 'class Calculator {\n    private var result: Double = 0.0\n    private val history = mutableListOf<String>()\n    \n    fun add(n: Double): Calculator {\n        history.add("+ $n")\n        result += n\n        return this  // возвращаем this для цепочки вызовов\n    }\n    \n    fun subtract(n: Double): Calculator {\n        history.add("- $n")\n        result -= n\n        return this\n    }\n    \n    fun getResult() = result\n    \n    fun showHistory() {\n        println("История: ${history.joinToString(", ")}")\n        println("Результат: $result")\n    }\n}\n\nfun main() {\n    val calc = Calculator()\n    calc.add(10.0).add(5.0).subtract(3.0)\n    calc.showHistory()\n    // История: + 10.0, + 5.0, - 3.0\n    // Результат: 12.0\n}' },
        { type: 'tip', value: 'return this — паттерн "текущий объект". Позволяет вызывать методы цепочкой: calc.add(10).add(5).subtract(3). Это называется Fluent Interface или Builder Pattern.' }
      ]
    },
    {
      id: 6,
      title: 'toString, equals и hashCode',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Kotlin (как и в Java) каждый класс наследует методы toString(), equals() и hashCode() от Any (аналог Object). Их можно переопределить.' },
        { type: 'code', language: 'kotlin', value: 'class Point(val x: Int, val y: Int) {\n    \n    override fun toString(): String {\n        return "Point($x, $y)"\n    }\n    \n    override fun equals(other: Any?): Boolean {\n        if (this === other) return true\n        if (other !is Point) return false\n        return x == other.x && y == other.y\n    }\n    \n    override fun hashCode(): Int {\n        return 31 * x + y\n    }\n}\n\nfun main() {\n    val p1 = Point(3, 4)\n    val p2 = Point(3, 4)\n    val p3 = Point(1, 2)\n    \n    println(p1)           // Point(3, 4) — toString\n    println(p1 == p2)     // true — equals\n    println(p1 == p3)     // false\n    println(p1 === p2)    // false — разные объекты в памяти\n}' },
        { type: 'note', value: 'В модуле про data классы узнаешь что data class автоматически генерирует toString, equals, hashCode, copy. Для большинства случаев data class удобнее чем вручную переопределять эти методы.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Класс Student',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай класс Student с конструктором, init-блоком, свойствами и методами.',
      requirements: [
        'Класс Student с конструктором: name: String, age: Int, gpa: Double',
        'В init проверь: age >= 16, gpa в диапазоне 0.0..4.0',
        'Вычисляемое свойство status: "Отличник" если gpa >= 3.5, "Хорошист" если >= 2.5, иначе "Троечник"',
        'Метод introduce() — выводит "Я студент {name}, средний балл {gpa} — {status}"',
        'Переопредели toString()',
        'Создай 2 объекта и вызови методы'
      ],
      expectedOutput: 'Я студент Нурдаулет, средний балл 3.8 — Отличник\nЯ студент Айгерим, средний балл 2.9 — Хорошист\nStudent(Нурдаулет, 20, 3.8)\nStudent(Айгерим, 19, 2.9)',
      hint: 'require(age >= 16) { "..." }. Вычисляемое свойство: val status: String get() = when { gpa >= 3.5 -> "Отличник" ... }',
      solution: 'class Student(val name: String, val age: Int, val gpa: Double) {\n    init {\n        require(age >= 16) { "Возраст студента должен быть не менее 16 лет" }\n        require(gpa in 0.0..4.0) { "GPA должен быть от 0.0 до 4.0" }\n    }\n    \n    val status: String\n        get() = when {\n            gpa >= 3.5 -> "Отличник"\n            gpa >= 2.5 -> "Хорошист"\n            else -> "Троечник"\n        }\n    \n    fun introduce() {\n        println("Я студент $name, средний балл $gpa — $status")\n    }\n    \n    override fun toString() = "Student($name, $age, $gpa)"\n}\n\nfun main() {\n    val s1 = Student("Нурдаулет", 20, 3.8)\n    val s2 = Student("Айгерим", 19, 2.9)\n    s1.introduce()\n    s2.introduce()\n    println(s1)\n    println(s2)\n}',
      explanation: 'require в init проверяет данные при создании — лучше упасть с ошибкой сразу, чем работать с некорректными данными. Вычисляемое свойство status не хранится, а вычисляется каждый раз. toString() позволяет println(student) вывести нужное.'
    },
    {
      id: 8,
      title: 'Практика: Класс ShoppingCart',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай класс корзины покупок с полным управлением товарами.',
      requirements: [
        'Класс Product(val name: String, val price: Double)',
        'Класс ShoppingCart с mutableListOf для товаров',
        'Метод addItem(product: Product) — добавляет товар',
        'Метод removeItem(name: String) — удаляет по имени',
        'Вычисляемое свойство total: Double — сумма всех цен',
        'Метод showCart() — выводит все товары и итог'
      ],
      expectedOutput: '=== Корзина ===\nНоутбук — 150000.0 тг\nМышь — 5000.0 тг\nКлавиатура — 8000.0 тг\nИтого: 163000.0 тг\n=== После удаления ===\nНоутбук — 150000.0 тг\nКлавиатура — 8000.0 тг\nИтого: 158000.0 тг',
      hint: 'total: Double get() = items.sumOf { it.price }. removeItem: items.removeIf { it.name == name }.',
      solution: 'class Product(val name: String, val price: Double)\n\nclass ShoppingCart {\n    private val items = mutableListOf<Product>()\n    \n    val total: Double\n        get() = items.sumOf { it.price }\n    \n    fun addItem(product: Product) {\n        items.add(product)\n    }\n    \n    fun removeItem(name: String) {\n        items.removeIf { it.name == name }\n    }\n    \n    fun showCart() {\n        println("=== Корзина ===")\n        for (item in items) {\n            println("${item.name} — ${item.price} тг")\n        }\n        println("Итого: $total тг")\n    }\n}\n\nfun main() {\n    val cart = ShoppingCart()\n    cart.addItem(Product("Ноутбук", 150000.0))\n    cart.addItem(Product("Мышь", 5000.0))\n    cart.addItem(Product("Клавиатура", 8000.0))\n    cart.showCart()\n    println("=== После удаления ===")\n    cart.removeItem("Мышь")\n    cart.showCart()\n}',
      explanation: 'private val items скрывает список от внешнего кода — только методы класса управляют им. sumOf { it.price } суммирует prices всех товаров. removeIf удаляет все элементы удовлетворяющие условию. total — вычисляемое свойство, всегда актуально.'
    }
  ]
}
