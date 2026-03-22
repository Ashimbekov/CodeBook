export default {
  id: 13,
  title: 'Data классы и sealed классы',
  description: 'Data классы для хранения данных, автогенерация equals/hashCode/copy/toString, деструктуризация, sealed классы для моделирования состояний',
  lessons: [
    {
      id: 1,
      title: 'Data классы: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Data класс — специальный вид класса в Kotlin, предназначенный для хранения данных. Компилятор автоматически генерирует equals(), hashCode(), toString(), copy() и componentN() функции.' },
        { type: 'code', language: 'kotlin', value: 'data class User(val name: String, val age: Int, val email: String)\n\nfun main() {\n    val user1 = User("Анна", 25, "anna@mail.ru")\n    val user2 = User("Анна", 25, "anna@mail.ru")\n    val user3 = User("Борис", 30, "boris@mail.ru")\n\n    // toString() — автоматически\n    println(user1)  // User(name=Анна, age=25, email=anna@mail.ru)\n\n    // equals() сравнивает по содержимому\n    println(user1 == user2)  // true\n    println(user1 == user3)  // false\n\n    // hashCode() согласован с equals()\n    println(user1.hashCode() == user2.hashCode())  // true\n}' },
        { type: 'tip', value: 'Без data у обычного класса user1 == user2 вернёт false, даже если поля одинаковые — сравниваются ссылки. Data класс сравнивает значения полей из конструктора.' },
        { type: 'heading', value: 'Только параметры конструктора участвуют в equals/hashCode' },
        { type: 'code', language: 'kotlin', value: 'data class Point(val x: Int, val y: Int) {\n    var label: String = ""  // НЕ участвует в equals/hashCode\n}\n\nfun main() {\n    val p1 = Point(1, 2)\n    val p2 = Point(1, 2)\n    p1.label = "A"\n    p2.label = "B"\n    println(p1 == p2)  // true — label не учитывается\n    println(p1)        // Point(x=1, y=2) — label тоже не в toString\n}' },
        { type: 'warning', value: 'В toString() и equals() участвуют только свойства из основного конструктора. Свойства, объявленные в теле класса, игнорируются.' }
      ]
    },
    {
      id: 2,
      title: 'copy() и деструктуризация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функция copy() создаёт новый объект с изменёнными указанными полями. Деструктуризация позволяет "распаковать" объект на отдельные переменные.' },
        { type: 'heading', value: 'copy() — удобное создание изменённых копий' },
        { type: 'code', language: 'kotlin', value: 'data class Config(\n    val host: String,\n    val port: Int,\n    val ssl: Boolean = false,\n    val timeout: Int = 5000\n)\n\nfun main() {\n    val defaultConfig = Config("localhost", 8080)\n    println(defaultConfig)  // Config(host=localhost, port=8080, ssl=false, timeout=5000)\n\n    // Меняем только нужные поля\n    val prodConfig = defaultConfig.copy(host = "prod.example.com", ssl = true)\n    println(prodConfig)  // Config(host=prod.example.com, port=8080, ssl=true, timeout=5000)\n\n    val testConfig = prodConfig.copy(host = "test.example.com", port = 9090)\n    println(testConfig)  // Config(host=test.example.com, port=9090, ssl=true, timeout=5000)\n}' },
        { type: 'heading', value: 'Деструктуризация' },
        { type: 'code', language: 'kotlin', value: 'data class Point(val x: Int, val y: Int)\ndata class Person(val name: String, val age: Int, val city: String)\n\nfun main() {\n    val point = Point(3, 7)\n    val (x, y) = point  // деструктуризация\n    println("x=$x, y=$y")  // x=3, y=7\n\n    val person = Person("Иван", 28, "Москва")\n    val (name, age, city) = person\n    println("$name, $age лет, $city")\n\n    // В циклах\n    val points = listOf(Point(1, 2), Point(3, 4), Point(5, 6))\n    for ((px, py) in points) {\n        println("($px, $py)")\n    }\n\n    // _ пропуск ненужных\n    val (pname, _, pcity) = person\n    println("$pname живёт в $pcity")\n}' },
        { type: 'tip', value: 'Деструктуризация работает через функции component1(), component2() и т.д., которые компилятор автоматически создаёт для data классов. Порядок соответствует порядку параметров конструктора.' }
      ]
    },
    {
      id: 3,
      title: 'Sealed классы: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Sealed класс — ограниченная иерархия классов. Все подклассы должны быть объявлены в том же файле. Это позволяет компилятору знать все возможные подтипы — when-выражение будет исчерпывающим.' },
        { type: 'code', language: 'kotlin', value: 'sealed class Result<out T> {\n    data class Success<T>(val data: T) : Result<T>()\n    data class Error(val message: String, val code: Int) : Result<Nothing>()\n    object Loading : Result<Nothing>()\n}\n\nfun fetchUser(id: Int): Result<String> {\n    return when (id) {\n        1 -> Result.Success("Анна")\n        0 -> Result.Loading\n        else -> Result.Error("Пользователь не найден", 404)\n    }\n}\n\nfun handleResult(result: Result<String>) {\n    when (result) {\n        is Result.Success -> println("Успех: ${result.data}")\n        is Result.Error -> println("Ошибка ${result.code}: ${result.message}")\n        is Result.Loading -> println("Загрузка...")\n        // else не нужен — компилятор знает все варианты!\n    }\n}\n\nfun main() {\n    handleResult(fetchUser(1))   // Успех: Анна\n    handleResult(fetchUser(0))   // Загрузка...\n    handleResult(fetchUser(99))  // Ошибка 404: Пользователь не найден\n}' },
        { type: 'tip', value: 'Главное преимущество sealed классов в when: если ты добавишь новый подкласс, компилятор укажет на все места, где when не обработан исчерпывающе. Это предотвращает ошибки.' },
        { type: 'note', value: 'Sealed класс сам по себе абстрактный — его нельзя инстанцировать напрямую. Подклассы могут быть data классами, object или обычными классами.' }
      ]
    },
    {
      id: 4,
      title: 'Sealed классы для состояний UI',
      type: 'theory',
      content: [
        { type: 'text', value: 'Sealed классы идеально подходят для моделирования состояний. В Android/Kotlin разработке это стандартный паттерн для UI State и результатов операций.' },
        { type: 'code', language: 'kotlin', value: 'sealed class UiState<out T> {\n    object Idle : UiState<Nothing>()\n    object Loading : UiState<Nothing>()\n    data class Success<T>(val data: T) : UiState<T>()\n    data class Error(val message: String) : UiState<Nothing>()\n}\n\ndata class Product(val id: Int, val name: String, val price: Double)\n\nfun loadProducts(): UiState<List<Product>> {\n    // Симуляция загрузки\n    val products = listOf(\n        Product(1, "Ноутбук", 45000.0),\n        Product(2, "Мышь", 1200.0)\n    )\n    return UiState.Success(products)\n}\n\nfun render(state: UiState<List<Product>>) {\n    when (state) {\n        is UiState.Idle -> println("Ожидание...")\n        is UiState.Loading -> println("Загружаем товары...")\n        is UiState.Success -> {\n            println("Товары загружены: ${state.data.size} шт.")\n            state.data.forEach { println("  ${it.name}: ${it.price} руб.") }\n        }\n        is UiState.Error -> println("Ошибка: ${state.message}")\n    }\n}\n\nfun main() {\n    render(UiState.Loading)\n    render(loadProducts())\n    render(UiState.Error("Нет интернета"))\n}' },
        { type: 'heading', value: 'Sealed interface — ещё гибче' },
        { type: 'code', language: 'kotlin', value: '// Начиная с Kotlin 1.5 sealed interface\nsealed interface Shape {\n    data class Circle(val radius: Double) : Shape\n    data class Rectangle(val w: Double, val h: Double) : Shape\n    data class Triangle(val a: Double, val b: Double, val c: Double) : Shape\n}\n\nfun area(shape: Shape): Double = when (shape) {\n    is Shape.Circle -> Math.PI * shape.radius * shape.radius\n    is Shape.Rectangle -> shape.w * shape.h\n    is Shape.Triangle -> {\n        val s = (shape.a + shape.b + shape.c) / 2\n        Math.sqrt(s * (s - shape.a) * (s - shape.b) * (s - shape.c))\n    }\n}\n\nfun main() {\n    println(area(Shape.Circle(5.0)))          // 78.54\n    println(area(Shape.Rectangle(4.0, 6.0)))  // 24.0\n}' }
      ]
    },
    {
      id: 5,
      title: 'Enum классы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Enum класс — набор именованных констант. Каждая константа — экземпляр enum класса. Подходит для небольшого фиксированного набора значений.' },
        { type: 'code', language: 'kotlin', value: 'enum class Direction {\n    NORTH, SOUTH, EAST, WEST\n}\n\nenum class Color(val hex: String) {\n    RED("#FF0000"),\n    GREEN("#00FF00"),\n    BLUE("#0000FF"),\n    WHITE("#FFFFFF");\n\n    fun isDark(): Boolean = hex != "#FFFFFF"\n}\n\nfun main() {\n    val dir = Direction.NORTH\n    println(dir)         // NORTH\n    println(dir.name)    // NORTH\n    println(dir.ordinal) // 0\n\n    val color = Color.RED\n    println(color.hex)      // #FF0000\n    println(color.isDark()) // true\n\n    // when с enum — компилятор проверяет исчерпываемость\n    val move = when (dir) {\n        Direction.NORTH -> "Двигаемся на север"\n        Direction.SOUTH -> "Двигаемся на юг"\n        Direction.EAST  -> "Двигаемся на восток"\n        Direction.WEST  -> "Двигаемся на запад"\n    }\n    println(move)\n\n    // Итерация по всем значениям\n    Color.values().forEach { println("${it.name}: ${it.hex}") }\n}' },
        { type: 'heading', value: 'Enum vs Sealed class' },
        { type: 'list', items: [
          'Enum: каждое значение — единственный экземпляр, все значения одного типа. Используй для простых перечислений (дни недели, направления)',
          'Sealed: каждый подкласс может иметь разные поля и быть разного типа. Используй когда состояния несут разные данные',
          'Enum имеет values() и valueOf() из коробки',
          'Sealed гибче — подклассы могут быть data class, object, обычным классом'
        ]}
      ]
    },
    {
      id: 6,
      title: 'Вложенные и внутренние классы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kotlin поддерживает вложенные классы (nested) и внутренние классы (inner). Разница в том, имеет ли вложенный класс доступ к внешнему классу.' },
        { type: 'code', language: 'kotlin', value: '// Nested class — НЕТ доступа к внешнему классу (по умолчанию)\nclass Outer {\n    private val secret = "Секрет"\n\n    class Nested {\n        fun greet() = "Привет из вложенного класса"\n        // secret недоступен!\n    }\n\n    // Inner class — ЕСТЬ доступ к внешнему классу\n    inner class Inner {\n        fun revealSecret() = "Секрет внешнего: $secret"  // OK\n    }\n}\n\nfun main() {\n    // Nested — создаётся без экземпляра внешнего\n    val nested = Outer.Nested()\n    println(nested.greet())\n\n    // Inner — нужен экземпляр внешнего\n    val outer = Outer()\n    val inner = outer.Inner()\n    println(inner.revealSecret())\n}' },
        { type: 'tip', value: 'В Java вложенные классы по умолчанию inner (имеют ссылку на внешний). В Kotlin наоборот: по умолчанию nested (без ссылки). Добавь inner явно, если нужен доступ к внешнему.' },
        { type: 'code', language: 'kotlin', value: '// Практический пример — Builder паттерн\nclass Pizza private constructor(\n    val size: String,\n    val toppings: List<String>\n) {\n    class Builder {\n        private var size: String = "средняя"\n        private val toppings = mutableListOf<String>()\n\n        fun size(s: String) = apply { size = s }\n        fun addTopping(t: String) = apply { toppings.add(t) }\n\n        fun build() = Pizza(size, toppings.toList())\n    }\n\n    override fun toString() = "Пицца ($size): ${toppings.joinToString(", ")}"\n}\n\nfun main() {\n    val pizza = Pizza.Builder()\n        .size("большая")\n        .addTopping("сыр")\n        .addTopping("ветчина")\n        .build()\n    println(pizza)  // Пицца (большая): сыр, ветчина\n}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Sealed класс для результата',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй sealed класс NetworkResult<T> с тремя состояниями: Success(data: T), Failure(error: String, code: Int), Loading. Напиши функцию getWeather(city: String): NetworkResult<String>, которая возвращает Success для "Москва", Loading для "...", Failure для остальных. Обработай все случаи через when.',
      requirements: [
        'sealed class NetworkResult<out T> с тремя подклассами',
        'Success — data class с полем data: T',
        'Failure — data class с полями error: String и code: Int',
        'Loading — object',
        'getWeather возвращает Success("Солнечно, +20") для "Москва"',
        'getWeather возвращает Loading для "..."',
        'getWeather возвращает Failure("Город не найден", 404) для остального',
        'when без else, используя все ветви'
      ],
      expectedOutput: 'Погода: Солнечно, +20\nЗагрузка...\nОшибка 404: Город не найден',
      hint: 'Используй out T (ковариантность) чтобы Success<String> был совместим с NetworkResult<String>. Nothing совместим с любым типом, поэтому Loading : NetworkResult<Nothing>() работает.',
      solution: 'sealed class NetworkResult<out T> {\n    data class Success<T>(val data: T) : NetworkResult<T>()\n    data class Failure(val error: String, val code: Int) : NetworkResult<Nothing>()\n    object Loading : NetworkResult<Nothing>()\n}\n\nfun getWeather(city: String): NetworkResult<String> = when (city) {\n    "Москва" -> NetworkResult.Success("Солнечно, +20")\n    "..." -> NetworkResult.Loading\n    else -> NetworkResult.Failure("Город не найден", 404)\n}\n\nfun printResult(result: NetworkResult<String>) {\n    when (result) {\n        is NetworkResult.Success -> println("Погода: ${result.data}")\n        is NetworkResult.Loading -> println("Загрузка...")\n        is NetworkResult.Failure -> println("Ошибка ${result.code}: ${result.error}")\n    }\n}\n\nfun main() {\n    printResult(getWeather("Москва"))\n    printResult(getWeather("..."))\n    printResult(getWeather("Антарктида"))\n}',
      explanation: 'Sealed классы делают when исчерпывающим — компилятор знает все возможные подтипы. Smart cast внутри is-ветвей даёт доступ к специфичным полям (result.data, result.code). out T означает ковариантность — это позволяет использовать NetworkResult<String> там, где ожидается NetworkResult<Any>.'
    }
  ]
}
