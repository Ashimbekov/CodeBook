export default {
  id: 30,
  title: 'Практикум: ООП и коллекции',
  description: 'Практические задачи по объектно-ориентированному программированию, классам, интерфейсам и работе с коллекциями в Kotlin.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Библиотека книг',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте data class Book(title, author, year) и класс Library с методами addBook, removeBook, findByAuthor(author): List<Book>.',
      requirements: [
        'data class Book(val title: String, val author: String, val year: Int)',
        'Library хранит список книг',
        'addBook добавляет книгу',
        'findByAuthor возвращает все книги автора'
      ],
      expectedOutput: '[Book(title=Война и мир, author=Толстой, year=1869)]',
      hint: 'findByAuthor использует filter { it.author == author }.',
      solution: 'data class Book(val title: String, val author: String, val year: Int)\n\nclass Library {\n    private val books = mutableListOf<Book>()\n    fun addBook(book: Book) { books.add(book) }\n    fun removeBook(book: Book) { books.remove(book) }\n    fun findByAuthor(author: String) = books.filter { it.author == author }\n}\n\nfun main() {\n    val lib = Library()\n    lib.addBook(Book("Война и мир", "Толстой", 1869))\n    lib.addBook(Book("Анна Каренина", "Толстой", 1878))\n    lib.addBook(Book("Преступление и наказание", "Достоевский", 1866))\n    println(lib.findByAuthor("Толстой").first())\n}',
      explanation: 'data class автоматически генерирует equals, hashCode, toString и copy. filter возвращает новый список с элементами, удовлетворяющими условию.'
    },
    {
      id: 2,
      title: 'Задача: Иерархия фигур',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте sealed class Shape с подклассами Circle, Rectangle, Triangle. Реализуйте функцию area(): Double для каждой фигуры.',
      requirements: [
        'sealed class Shape',
        'Circle(radius: Double): area = PI * r²',
        'Rectangle(width, height): area = w * h',
        'Triangle(base, height): area = 0.5 * b * h',
        'Функция totalArea(shapes: List<Shape>): Double'
      ],
      expectedOutput: '28.274333882308138\n12.0\n6.0\n46.274333882308138',
      hint: 'when(shape) { is Circle -> ... } — Kotlin автоматически делает smart cast.',
      solution: 'import kotlin.math.PI\n\nsealed class Shape {\n    abstract fun area(): Double\n    data class Circle(val radius: Double) : Shape() {\n        override fun area() = PI * radius * radius\n    }\n    data class Rectangle(val width: Double, val height: Double) : Shape() {\n        override fun area() = width * height\n    }\n    data class Triangle(val base: Double, val height: Double) : Shape() {\n        override fun area() = 0.5 * base * height\n    }\n}\n\nfun totalArea(shapes: List<Shape>) = shapes.sumOf { it.area() }\n\nfun main() {\n    val shapes = listOf(Shape.Circle(3.0), Shape.Rectangle(3.0, 4.0), Shape.Triangle(3.0, 4.0))\n    shapes.forEach { println(it.area()) }\n    println(totalArea(shapes))\n}',
      explanation: 'sealed class с abstract fun area() — паттерн "полиморфизм через sealed". sumOf аккумулирует Double из каждого элемента.'
    },
    {
      id: 3,
      title: 'Задача: Стек на обобщённом классе',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте обобщённый класс Stack<T> с операциями push, pop, peek, isEmpty, size.',
      requirements: [
        'push(item: T) добавляет элемент',
        'pop(): T удаляет и возвращает верхний элемент',
        'peek(): T возвращает без удаления',
        'pop/peek из пустого — NoSuchElementException',
        'Протестируйте с Int и String'
      ],
      expectedOutput: '3\n3\n2\ntrue',
      hint: 'Используйте внутренний mutableListOf<T>(). removeLast() удаляет последний элемент.',
      solution: 'class Stack<T> {\n    private val data = mutableListOf<T>()\n    fun push(item: T) { data.add(item) }\n    fun pop(): T = data.removeLastOrNull() ?: throw NoSuchElementException("Стек пуст")\n    fun peek(): T = data.lastOrNull() ?: throw NoSuchElementException("Стек пуст")\n    val isEmpty get() = data.isEmpty()\n    val size get() = data.size\n}\n\nfun main() {\n    val stack = Stack<Int>()\n    stack.push(1); stack.push(2); stack.push(3)\n    println(stack.peek())\n    println(stack.pop())\n    println(stack.peek())\n    println(stack.isEmpty)\n}',
      explanation: 'removeLastOrNull возвращает null для пустого списка — используем ?: для выброса исключения. Generics делают Stack переиспользуемым для любого типа.'
    },
    {
      id: 4,
      title: 'Задача: Компаратор сотрудников',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте data class Employee(name, department, salary). Отсортируйте список сначала по отделу (по алфавиту), затем по зарплате (по убыванию).',
      requirements: [
        'Список из 5+ сотрудников разных отделов',
        'Сортировка: отдел ascending, зарплата descending',
        'Используйте sortedWith и compareBy/thenByDescending'
      ],
      expectedOutput: 'Список отсортирован: сначала по department, внутри — по убыванию salary',
      hint: 'compareBy { it.department }.thenByDescending { it.salary }',
      solution: 'data class Employee(val name: String, val department: String, val salary: Int)\n\nfun main() {\n    val employees = listOf(\n        Employee("Ахмет", "IT", 350000),\n        Employee("Жанар", "HR", 280000),\n        Employee("Дамир", "IT", 420000),\n        Employee("Айша", "HR", 310000),\n        Employee("Берик", "IT", 390000)\n    )\n    val sorted = employees.sortedWith(\n        compareBy<Employee> { it.department }.thenByDescending { it.salary }\n    )\n    sorted.forEach { println("${it.department} | ${it.name} | ${it.salary}") }\n}',
      explanation: 'compareBy создаёт Comparator по первому критерию. thenByDescending добавляет вторичную сортировку по убыванию. sortedWith возвращает новый отсортированный список.'
    },
    {
      id: 5,
      title: 'Задача: Группировка и статистика',
      type: 'practice',
      difficulty: 'medium',
      description: 'По списку Employee найдите для каждого отдела: количество сотрудников, среднюю зарплату, максимальную зарплату.',
      requirements: [
        'groupBy { it.department } для группировки',
        'Для каждого отдела: count, average salary, max salary',
        'Вывести в виде "IT: count=3, avg=386666, max=420000"'
      ],
      expectedOutput: 'IT: count=3, avg=386666, max=420000\nHR: count=2, avg=295000, max=310000',
      hint: 'groupBy возвращает Map<String, List<Employee>>. Итерируйте по entries.',
      solution: 'data class Employee(val name: String, val department: String, val salary: Int)\n\nfun main() {\n    val employees = listOf(\n        Employee("Дамир", "IT", 420000), Employee("Берик", "IT", 390000),\n        Employee("Ахмет", "IT", 350000), Employee("Айша", "HR", 310000),\n        Employee("Жанар", "HR", 280000)\n    )\n    val stats = employees.groupBy { it.department }\n    stats.forEach { (dept, list) ->\n        val avg = list.map { it.salary }.average().toInt()\n        val max = list.maxOf { it.salary }\n        println("$dept: count=${list.size}, avg=$avg, max=$max")\n    }\n}',
      explanation: 'groupBy группирует элементы по ключу. average() из стандартной библиотеки считает среднее. maxOf — максимум по критерию.'
    },
    {
      id: 6,
      title: 'Задача: Наблюдатель (Observer)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте паттерн Observer: класс EventBus с подпиской/отпиской и рассылкой событий подписчикам.',
      requirements: [
        'interface EventListener<T> с методом onEvent(event: T)',
        'class EventBus<T> с subscribe, unsubscribe, emit',
        'emit рассылает событие всем подписчикам',
        'После unsubscribe — подписчик не получает события'
      ],
      expectedOutput: 'Подписчик 1: Привет\nПодписчик 2: Привет\nПодписчик 1: Пока',
      hint: 'Храните подписчиков в mutableListOf. emit итерирует по копии списка.',
      solution: 'interface EventListener<T> { fun onEvent(event: T) }\n\nclass EventBus<T> {\n    private val listeners = mutableListOf<EventListener<T>>()\n    fun subscribe(l: EventListener<T>) { listeners.add(l) }\n    fun unsubscribe(l: EventListener<T>) { listeners.remove(l) }\n    fun emit(event: T) { listeners.toList().forEach { it.onEvent(event) } }\n}\n\nfun main() {\n    val bus = EventBus<String>()\n    val l1 = object : EventListener<String> { override fun onEvent(e: String) = println("Подписчик 1: $e") }\n    val l2 = object : EventListener<String> { override fun onEvent(e: String) = println("Подписчик 2: $e") }\n    bus.subscribe(l1); bus.subscribe(l2)\n    bus.emit("Привет")\n    bus.unsubscribe(l2)\n    bus.emit("Пока")\n}',
      explanation: 'listeners.toList() создаёт копию перед итерацией — защита от ConcurrentModificationException если подписчик отпишется в onEvent.'
    },
    {
      id: 7,
      title: 'Задача: LRU кэш',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте LRU-кэш (Least Recently Used) с использованием LinkedHashMap. Кэш имеет максимальный размер; при переполнении вытесняет самый давно использованный элемент.',
      requirements: [
        'class LRUCache<K, V>(val capacity: Int)',
        'get(key): V? — возвращает значение или null, обновляет порядок',
        'put(key, value) — добавляет; при переполнении удаляет LRU-элемент',
        'Протестируйте с capacity=2'
      ],
      expectedOutput: 'Значение A\nnull\nЗначение C',
      hint: 'LinkedHashMap(capacity, 0.75f, true) с accessOrder=true отслеживает порядок доступа. removeEldestEntry переопределяется для автоудаления.',
      solution: 'class LRUCache<K, V>(private val capacity: Int) {\n    private val map = object : LinkedHashMap<K, V>(capacity, 0.75f, true) {\n        override fun removeEldestEntry(eldest: MutableMap.MutableEntry<K, V>?) = size > capacity\n    }\n    fun get(key: K): V? = map[key]\n    fun put(key: K, value: V) { map[key] = value }\n}\n\nfun main() {\n    val cache = LRUCache<String, String>(2)\n    cache.put("a", "Значение A")\n    cache.put("b", "Значение B")\n    println(cache.get("a")) // Значение A, a становится свежим\n    cache.put("c", "Значение C") // b вытесняется (давно не использовался)\n    println(cache.get("b")) // null\n    println(cache.get("c")) // Значение C\n}',
      explanation: 'LinkedHashMap с accessOrder=true отслеживает порядок доступа. removeEldestEntry вызывается после каждой вставки — если size > capacity, LinkedHashMap сам удалит LRU-элемент.'
    },
    {
      id: 8,
      title: 'Задача: Чейнинг методов (Fluent API)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте QueryBuilder для построения SQL-подобных запросов цепочкой методов: from, where, orderBy, limit.',
      requirements: [
        'from(table: String): QueryBuilder',
        'where(condition: String): QueryBuilder',
        'orderBy(column: String, desc: Boolean = false): QueryBuilder',
        'limit(n: Int): QueryBuilder',
        'build(): String — возвращает SQL-строку'
      ],
      expectedOutput: 'SELECT * FROM users WHERE age > 18 ORDER BY name ASC LIMIT 10',
      hint: 'Каждый метод изменяет внутреннее состояние и возвращает this.',
      solution: 'class QueryBuilder {\n    private var table = ""\n    private var condition = ""\n    private var order = ""\n    private var limitVal = -1\n\n    fun from(t: String) = apply { table = t }\n    fun where(c: String) = apply { condition = c }\n    fun orderBy(col: String, desc: Boolean = false) = apply { order = "$col ${if (desc) "DESC" else "ASC"}" }\n    fun limit(n: Int) = apply { limitVal = n }\n\n    fun build(): String {\n        var query = "SELECT * FROM $table"\n        if (condition.isNotEmpty()) query += " WHERE $condition"\n        if (order.isNotEmpty()) query += " ORDER BY $order"\n        if (limitVal > 0) query += " LIMIT $limitVal"\n        return query\n    }\n}\n\nfun main() {\n    val query = QueryBuilder()\n        .from("users")\n        .where("age > 18")\n        .orderBy("name")\n        .limit(10)\n        .build()\n    println(query)\n}',
      explanation: 'apply { ... } выполняет блок с this и возвращает this — идеален для Fluent API. Каждый метод возвращает сам объект, что позволяет цепочку вызовов.'
    },
    {
      id: 9,
      title: 'Задача: Делегирование свойств',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте делегат свойства Validated<T>, который проверяет значение при установке и выбрасывает IllegalArgumentException если условие не выполнено.',
      requirements: [
        'class Validated<T>(private val validator: (T) -> Boolean, private val message: String)',
        'Реализует ReadWriteProperty<Any?, T>',
        'class User с полем name (не пустое) и age (0-150)',
        'Установка некорректного значения бросает IllegalArgumentException'
      ],
      expectedOutput: 'Айгерим, 25\nИсключение: Возраст должен быть от 0 до 150',
      hint: 'Реализуйте getValue и setValue. В setValue вызовите require(validator(value)) { message }.',
      solution: 'import kotlin.properties.ReadWriteProperty\nimport kotlin.reflect.KProperty\n\nclass Validated<T>(private val validator: (T) -> Boolean, private val message: String) : ReadWriteProperty<Any?, T> {\n    private lateinit var _value: Any\n    @Suppress("UNCHECKED_CAST")\n    override fun getValue(thisRef: Any?, property: KProperty<*>): T = _value as T\n    override fun setValue(thisRef: Any?, property: KProperty<*>, value: T) {\n        require(validator(value)) { message }\n        _value = value as Any\n    }\n}\n\nclass User {\n    var name: String by Validated({ it.isNotBlank() }, "Имя не может быть пустым")\n    var age: Int by Validated({ it in 0..150 }, "Возраст должен быть от 0 до 150")\n}\n\nfun main() {\n    val user = User()\n    user.name = "Айгерим"\n    user.age = 25\n    println("${user.name}, ${user.age}")\n    try { user.age = 200 } catch (e: IllegalArgumentException) { println("Исключение: ${e.message}") }\n}',
      explanation: 'ReadWriteProperty — интерфейс для делегатов свойств. getValue/setValue вызываются при чтении/записи. require выбрасывает IllegalArgumentException если условие false.'
    },
    {
      id: 10,
      title: 'Задача: Реализация графа',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте неориентированный граф с BFS-обходом. Найдите кратчайший путь между двумя вершинами.',
      requirements: [
        'class Graph<T> с методом addEdge(from: T, to: T)',
        'bfs(start: T, end: T): List<T>? — кратчайший путь или null',
        'Граф: 1-2, 2-3, 1-4, 4-3',
        'bfs(1, 3) = [1, 2, 3] или [1, 4, 3]'
      ],
      expectedOutput: '[1, 2, 3]',
      hint: 'BFS использует очередь (ArrayDeque). Храните предыдущие вершины в Map для восстановления пути.',
      solution: 'class Graph<T> {\n    private val adj = mutableMapOf<T, MutableList<T>>()\n    fun addEdge(from: T, to: T) {\n        adj.getOrPut(from) { mutableListOf() }.add(to)\n        adj.getOrPut(to) { mutableListOf() }.add(from)\n    }\n    fun bfs(start: T, end: T): List<T>? {\n        val prev = mutableMapOf<T, T?>(start to null)\n        val queue = ArrayDeque<T>().also { it.add(start) }\n        while (queue.isNotEmpty()) {\n            val cur = queue.removeFirst()\n            if (cur == end) {\n                val path = mutableListOf<T>()\n                var node: T? = end\n                while (node != null) { path.add(0, node); node = prev[node] }\n                return path\n            }\n            adj[cur]?.forEach { nb -> if (nb !in prev) { prev[nb] = cur; queue.add(nb) } }\n        }\n        return null\n    }\n}\n\nfun main() {\n    val g = Graph<Int>()\n    g.addEdge(1, 2); g.addEdge(2, 3); g.addEdge(1, 4); g.addEdge(4, 3)\n    println(g.bfs(1, 3))\n}',
      explanation: 'BFS гарантирует кратчайший путь в невзвешенном графе. Словарь prev хранит откуда пришли в каждую вершину — это позволяет восстановить путь от конца к началу.'
    }
  ]
}
