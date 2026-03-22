export default {
  id: 12,
  title: 'Наследование и интерфейсы',
  description: 'Наследование классов в Kotlin, ключевое слово open, переопределение методов, абстрактные классы и интерфейсы — строим иерархии типов',
  lessons: [
    {
      id: 1,
      title: 'Наследование: ключевое слово open',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Kotlin все классы по умолчанию закрыты для наследования (final). Чтобы разрешить наследование, класс нужно пометить ключевым словом open. Это осознанное решение — оно защищает от случайного наследования.' },
        { type: 'heading', value: 'Базовый синтаксис наследования' },
        { type: 'code', language: 'kotlin', value: '// Базовый класс — открываем для наследования\nopen class Animal(val name: String) {\n    open fun speak() {\n        println("$name издаёт звук")\n    }\n\n    fun breathe() {\n        println("$name дышит")\n    }\n}\n\n// Наследник — после двоеточия вызываем конструктор родителя\nclass Dog(name: String) : Animal(name) {\n    override fun speak() {\n        println("$name лает: Гав!")\n    }\n}\n\nclass Cat(name: String) : Animal(name) {\n    override fun speak() {\n        println("$name мяукает: Мяу!")\n    }\n}\n\nfun main() {\n    val dog = Dog("Шарик")\n    val cat = Cat("Мурка")\n    dog.speak()   // Шарик лает: Гав!\n    cat.speak()   // Мурка мяукает: Мяу!\n    dog.breathe() // Шарик дышит\n}' },
        { type: 'tip', value: 'Если метод в базовом классе не помечен open, наследник не сможет его переопределить. Это заставляет явно думать, какие методы предназначены для переопределения.' },
        { type: 'heading', value: 'final — запрет дальнейшего переопределения' },
        { type: 'code', language: 'kotlin', value: 'open class Base {\n    open fun method() = println("Base")\n}\n\nopen class Middle : Base() {\n    final override fun method() = println("Middle") // нельзя переопределить дальше\n}\n\nclass Child : Middle() {\n    // Ошибка компиляции: override fun method() — нельзя!\n}' },
        { type: 'note', value: 'Переопределённый метод сам по себе становится open. Чтобы закрыть цепочку переопределений, пиши final override.' }
      ]
    },
    {
      id: 2,
      title: 'super и конструкторы при наследовании',
      type: 'theory',
      content: [
        { type: 'text', value: 'При создании объекта-наследника сначала вызывается конструктор родителя. Через ключевое слово super можно обратиться к реализации родительского класса.' },
        { type: 'heading', value: 'Вызов конструктора родителя' },
        { type: 'code', language: 'kotlin', value: 'open class Person(val name: String, val age: Int) {\n    init {\n        println("Person создан: $name")\n    }\n\n    open fun introduce() {\n        println("Я $name, мне $age лет")\n    }\n}\n\nclass Employee(\n    name: String,\n    age: Int,\n    val company: String\n) : Person(name, age) {  // передаём параметры в родительский конструктор\n    init {\n        println("Employee создан: $name, компания $company")\n    }\n\n    override fun introduce() {\n        super.introduce()  // вызываем метод родителя\n        println("Работаю в $company")\n    }\n}\n\nfun main() {\n    val emp = Employee("Алексей", 30, "Яндекс")\n    // Person создан: Алексей\n    // Employee создан: Алексей, компания Яндекс\n    emp.introduce()\n    // Я Алексей, мне 30 лет\n    // Работаю в Яндекс\n}' },
        { type: 'heading', value: 'Вторичные конструкторы и super' },
        { type: 'code', language: 'kotlin', value: 'open class Shape(val color: String)\n\nclass Rectangle : Shape {\n    val width: Int\n    val height: Int\n\n    constructor(color: String, width: Int, height: Int) : super(color) {\n        this.width = width\n        this.height = height\n    }\n\n    fun area() = width * height\n}\n\nfun main() {\n    val rect = Rectangle("Красный", 4, 5)\n    println("${rect.color}: ${rect.area()}")  // Красный: 20\n}' },
        { type: 'warning', value: 'Конструктор родителя всегда вызывается первым — либо через двоеточие в основном конструкторе, либо через super() во вторичном. Без этого код не скомпилируется.' }
      ]
    },
    {
      id: 3,
      title: 'Абстрактные классы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Абстрактный класс — класс, который нельзя инстанцировать напрямую. Он служит шаблоном для наследников. Абстрактные методы не имеют реализации — наследники обязаны их реализовать.' },
        { type: 'code', language: 'kotlin', value: 'abstract class Shape {\n    abstract val name: String  // абстрактное свойство\n    abstract fun area(): Double  // абстрактный метод — без тела\n    abstract fun perimeter(): Double\n\n    // Обычный метод — есть реализация\n    fun describe() {\n        println("$name: площадь=${area()}, периметр=${perimeter()}")\n    }\n}\n\nclass Circle(val radius: Double) : Shape() {\n    override val name = "Круг"\n    override fun area() = Math.PI * radius * radius\n    override fun perimeter() = 2 * Math.PI * radius\n}\n\nclass Rectangle(val width: Double, val height: Double) : Shape() {\n    override val name = "Прямоугольник"\n    override fun area() = width * height\n    override fun perimeter() = 2 * (width + height)\n}\n\nfun main() {\n    val shapes: List<Shape> = listOf(\n        Circle(5.0),\n        Rectangle(4.0, 6.0)\n    )\n    for (shape in shapes) {\n        shape.describe()\n    }\n    // Круг: площадь=78.54, периметр=31.42\n    // Прямоугольник: площадь=24.0, периметр=20.0\n}' },
        { type: 'tip', value: 'Абстрактный класс — это контракт + частичная реализация. Используй его, когда у классов-наследников есть общая логика, но конкретные детали различаются.' },
        { type: 'note', value: 'Абстрактные классы автоматически open — не нужно писать open abstract class. Абстрактные члены тоже автоматически open.' }
      ]
    },
    {
      id: 4,
      title: 'Интерфейсы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Интерфейс в Kotlin — это контракт, который класс обязуется выполнить. В отличие от абстрактных классов, интерфейсы не хранят состояние (нет полей с инициализацией), но могут иметь реализации методов по умолчанию.' },
        { type: 'code', language: 'kotlin', value: 'interface Drawable {\n    fun draw()  // абстрактный метод\n    fun erase() = println("Стираем объект")  // метод с реализацией по умолчанию\n}\n\ninterface Resizable {\n    fun resize(factor: Double)\n}\n\n// Класс может реализовывать несколько интерфейсов\nclass Circle(var radius: Double) : Drawable, Resizable {\n    override fun draw() {\n        println("Рисуем круг с радиусом $radius")\n    }\n\n    override fun resize(factor: Double) {\n        radius *= factor\n    }\n}\n\nfun main() {\n    val c = Circle(5.0)\n    c.draw()          // Рисуем круг с радиусом 5.0\n    c.resize(2.0)\n    c.draw()          // Рисуем круг с радиусом 10.0\n    c.erase()         // Стираем объект\n}' },
        { type: 'heading', value: 'Интерфейс с свойствами' },
        { type: 'code', language: 'kotlin', value: 'interface Named {\n    val name: String  // абстрактное свойство\n    val greeting: String  // свойство с реализацией через геттер\n        get() = "Привет, я $name"\n}\n\nclass User(override val name: String) : Named\n\nfun main() {\n    val user = User("Анна")\n    println(user.greeting)  // Привет, я Анна\n}' },
        { type: 'tip', value: 'Главное отличие интерфейса от абстрактного класса: класс может реализовывать несколько интерфейсов, но наследовать только один класс. Интерфейсы — инструмент множественного поведения.' }
      ]
    },
    {
      id: 5,
      title: 'Полиморфизм',
      type: 'theory',
      content: [
        { type: 'text', value: 'Полиморфизм — возможность работать с объектами разных классов через единый интерфейс. В Kotlin это достигается через наследование и интерфейсы.' },
        { type: 'code', language: 'kotlin', value: 'interface Sound {\n    fun makeSound(): String\n}\n\nclass Dog : Sound {\n    override fun makeSound() = "Гав!"\n}\n\nclass Cat : Sound {\n    override fun makeSound() = "Мяу!"\n}\n\nclass Duck : Sound {\n    override fun makeSound() = "Кря!"\n}\n\nfun makeNoise(sounds: List<Sound>) {\n    for (s in sounds) {\n        println(s.makeSound())\n    }\n}\n\nfun main() {\n    val animals: List<Sound> = listOf(Dog(), Cat(), Duck(), Dog())\n    makeNoise(animals)\n    // Гав!\n    // Мяу!\n    // Кря!\n    // Гав!\n}' },
        { type: 'heading', value: 'is и as — проверка и приведение типов' },
        { type: 'code', language: 'kotlin', value: 'open class Animal(val name: String)\nclass Dog(name: String) : Animal(name) {\n    fun fetch() = println("$name приносит мяч")\n}\nclass Cat(name: String) : Animal(name) {\n    fun purr() = println("$name мурлычет")\n}\n\nfun interact(animal: Animal) {\n    when (animal) {\n        is Dog -> animal.fetch()  // умное приведение (smart cast)\n        is Cat -> animal.purr()\n        else -> println("${animal.name} делает что-то своё")\n    }\n}\n\nfun main() {\n    val animals = listOf(Dog("Рекс"), Cat("Барсик"), Dog("Тузик"))\n    animals.forEach { interact(it) }\n    // Рекс приносит мяч\n    // Барсик мурлычет\n    // Тузик приносит мяч\n}' },
        { type: 'note', value: 'Kotlin поддерживает умное приведение типов (smart cast): если проверил is Dog, то внутри блока переменная автоматически имеет тип Dog — не нужно явно приводить через as.' }
      ]
    },
    {
      id: 6,
      title: 'Интерфейс vs абстрактный класс',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда использовать интерфейс, а когда абстрактный класс — частый вопрос на собеседованиях. Рассмотрим ключевые различия и правила выбора.' },
        { type: 'list', items: [
          'Интерфейс — контракт поведения (что объект умеет делать). Класс может реализовывать множество интерфейсов',
          'Абстрактный класс — общий шаблон с состоянием. Класс может наследовать только один абстрактный класс',
          'Интерфейс не хранит состояние (var-поля без инициализации недопустимы)',
          'Абстрактный класс может иметь конструктор с параметрами и обычные поля',
          'Интерфейс — для моделирования ролей (Printable, Serializable), абстрактный класс — для иерархий (Vehicle -> Car, Truck)'
        ]},
        { type: 'code', language: 'kotlin', value: '// Интерфейс — роль/возможность\ninterface Flyable {\n    fun fly()\n}\n\ninterface Swimmable {\n    fun swim()\n}\n\n// Абстрактный класс — общая природа\nabstract class Bird(val name: String) {\n    abstract fun sing()\n    fun eat() = println("$name ест зёрна")\n}\n\n// Утка: и птица, и плавает, и летает\nclass Duck(name: String) : Bird(name), Flyable, Swimmable {\n    override fun sing() = println("$name: Кря!")\n    override fun fly() = println("$name взлетает")\n    override fun swim() = println("$name плывёт")\n}\n\n// Страус: птица, но не летает\nclass Ostrich(name: String) : Bird(name) {\n    override fun sing() = println("$name: Бум!")\n}\n\nfun main() {\n    val duck = Duck("Дональд")\n    duck.eat()   // Дональд ест зёрна\n    duck.fly()   // Дональд взлетает\n    duck.swim()  // Дональд плывёт\n    duck.sing()  // Дональд: Кря!\n}' },
        { type: 'tip', value: 'Правило: если несколько несвязанных классов должны вести себя похоже — используй интерфейс. Если они образуют иерархию "является" (собака является животным) — используй наследование.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Зоопарк с иерархией',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай систему зоопарка. Реализуй абстрактный класс Animal с полями name и age, абстрактным методом sound(), обычным методом info(). Создай классы Lion, Parrot, Dolphin. Интерфейс Trainable с методом train(). Parrot и Dolphin реализуют Trainable. Выведи информацию о всех животных и проведи тренировку тренируемых.',
      requirements: [
        'Абстрактный класс Animal(name: String, age: Int) с абстрактным sound() и обычным info()',
        'Lion наследует Animal, реализует sound() как "Рррр!"',
        'Parrot наследует Animal, реализует Trainable, sound() = "Попка дурак"',
        'Dolphin наследует Animal, реализует Trainable, sound() = "Ии-ии!"',
        'info() выводит "name (age лет): sound"',
        'train() у Parrot — "Попугай повторяет слова", у Dolphin — "Дельфин прыгает через кольцо"'
      ],
      expectedOutput: 'Симба (5 лет): Рррр!\nКеша (3 лет): Попка дурак\nФлипер (7 лет): Ии-ии!\n--- Тренировка ---\nПопугай повторяет слова\nДельфин прыгает через кольцо',
      hint: 'Список животных храни как List<Animal>. Для тренировки отфильтруй через filterIsInstance<Trainable>(). Не забудь вызвать super или напрямую реализовать info() в базовом классе.',
      solution: 'abstract class Animal(val name: String, val age: Int) {\n    abstract fun sound(): String\n    fun info() = println("$name ($age лет): ${sound()}")\n}\n\ninterface Trainable {\n    fun train()\n}\n\nclass Lion(name: String, age: Int) : Animal(name, age) {\n    override fun sound() = "Рррр!"\n}\n\nclass Parrot(name: String, age: Int) : Animal(name, age), Trainable {\n    override fun sound() = "Попка дурак"\n    override fun train() = println("Попугай повторяет слова")\n}\n\nclass Dolphin(name: String, age: Int) : Animal(name, age), Trainable {\n    override fun sound() = "Ии-ии!"\n    override fun train() = println("Дельфин прыгает через кольцо")\n}\n\nfun main() {\n    val animals: List<Animal> = listOf(\n        Lion("Симба", 5),\n        Parrot("Кеша", 3),\n        Dolphin("Флипер", 7)\n    )\n    animals.forEach { it.info() }\n    println("--- Тренировка ---")\n    animals.filterIsInstance<Trainable>().forEach { it.train() }\n}',
      explanation: 'filterIsInstance<Trainable>() — умный фильтр, который оставляет только объекты, реализующие Trainable, и автоматически приводит их к этому типу. Это пример полиморфизма: список Animal содержит разные виды, но мы можем работать с ними единообразно.'
    }
  ]
}
