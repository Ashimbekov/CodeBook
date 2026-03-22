export default {
  id: 17,
  title: 'Generics',
  description: 'Обобщённое программирование в Kotlin: параметры типов, ограничения, вариантность (in/out), reified типы и практические паттерны',
  lessons: [
    {
      id: 1,
      title: 'Обобщённые классы и функции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Generics (обобщённое программирование) позволяют писать код, работающий с разными типами, сохраняя типобезопасность. Вместо конкретного типа используется параметр типа T.' },
        { type: 'code', language: 'kotlin', value: '// Обобщённый класс\nclass Box<T>(val value: T) {\n    fun getValue(): T = value\n    override fun toString() = "Box($value)"\n}\n\n// Обобщённая функция\nfun <T> swap(pair: Pair<T, T>): Pair<T, T> = Pair(pair.second, pair.first)\n\nfun <T> List<T>.secondOrNull(): T? = if (size >= 2) this[1] else null\n\nfun main() {\n    val intBox = Box(42)\n    val strBox = Box("Привет")\n    val listBox = Box(listOf(1, 2, 3))\n\n    println(intBox.getValue())   // 42\n    println(strBox.getValue())   // Привет\n    println(listBox.getValue())  // [1, 2, 3]\n\n    println(swap(Pair(1, 2)))        // (2, 1)\n    println(swap(Pair("a", "b")))    // (b, a)\n\n    println(listOf(10, 20, 30).secondOrNull())  // 20\n    println(listOf(10).secondOrNull())           // null\n}' },
        { type: 'tip', value: 'Компилятор Kotlin выводит тип автоматически: Box(42) — это Box<Int>, не нужно писать Box<Int>(42). Но если вывод неоднозначен — указывай тип явно.' },
        { type: 'heading', value: 'Несколько параметров типов' },
        { type: 'code', language: 'kotlin', value: 'class Pair2<A, B>(val first: A, val second: B) {\n    fun swap(): Pair2<B, A> = Pair2(second, first)\n    override fun toString() = "($first, $second)"\n}\n\nfun <K, V> Map<K, V>.invertedMap(): Map<V, K> {\n    return entries.associate { (k, v) -> v to k }\n}\n\nfun main() {\n    val pair = Pair2("Анна", 25)\n    println(pair)         // (Анна, 25)\n    println(pair.swap())  // (25, Анна)\n\n    val original = mapOf("один" to 1, "два" to 2, "три" to 3)\n    val inverted = original.invertedMap()\n    println(inverted)  // {1=один, 2=два, 3=три}\n}' }
      ]
    },
    {
      id: 2,
      title: 'Ограничения типов (upper bounds)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда нужно ограничить, какие типы можно подставить вместо T. Ограничение типа (upper bound) задаётся через двоеточие: <T : SomeType>.' },
        { type: 'code', language: 'kotlin', value: '// T должен быть Comparable\nfun <T : Comparable<T>> max(a: T, b: T): T {\n    return if (a >= b) a else b\n}\n\nfun <T : Comparable<T>> List<T>.clamp(min: T, max: T): List<T> {\n    return this.map { it.coerceIn(min, max) }\n}\n\ninterface Printable {\n    fun print()\n}\n\nfun <T : Printable> printAll(list: List<T>) {\n    list.forEach { it.print() }\n}\n\ndata class Document(val title: String) : Printable {\n    override fun print() = println("Документ: $title")\n}\n\nfun main() {\n    println(max(3, 7))       // 7\n    println(max("a", "z"))   // z\n    println(max(3.14, 2.71)) // 3.14\n\n    val nums = listOf(1, 15, 3, 25, 7)\n    println(nums.clamp(5, 20))  // [5, 15, 5, 20, 7]\n\n    val docs = listOf(Document("Контракт"), Document("Отчёт"))\n    printAll(docs)\n}' },
        { type: 'heading', value: 'Несколько ограничений через where' },
        { type: 'code', language: 'kotlin', value: 'interface Summable {\n    operator fun plus(other: Int): Int\n}\n\n// T должен быть и Comparable, и Number\nfun <T> processNumber(value: T): String\n        where T : Number, T : Comparable<T> {\n    return "Значение: $value, тип: ${value::class.simpleName}"\n}\n\nfun main() {\n    println(processNumber(42))      // Значение: 42, тип: Int\n    println(processNumber(3.14))    // Значение: 3.14, тип: Double\n    // processNumber("text") — ошибка компиляции!\n}' },
        { type: 'note', value: 'По умолчанию T : Any? — параметр типа может быть nullable. Если написать T : Any (без ?), то null недопустим. Это важно для типобезопасности.' }
      ]
    },
    {
      id: 3,
      title: 'Вариантность: out (ковариантность)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вариантность определяет, как параметризованные типы соотносятся при наследовании. out означает ковариантность: если B : A, то Container<B> : Container<A>.' },
        { type: 'code', language: 'kotlin', value: 'open class Animal(val name: String)\nclass Dog(name: String) : Animal(name)\nclass Cat(name: String) : Animal(name)\n\n// out T — только производит T (только читает)\nclass ReadOnlyList<out T>(private val items: List<T>) {\n    fun get(index: Int): T = items[index]\n    fun size() = items.size\n    // fun add(item: T) — нельзя! T только в out позиции\n}\n\nfun printAnimals(list: ReadOnlyList<Animal>) {\n    for (i in 0 until list.size()) {\n        println(list.get(i).name)\n    }\n}\n\nfun main() {\n    val dogs = ReadOnlyList(listOf(Dog("Рекс"), Dog("Шарик")))\n    val cats = ReadOnlyList(listOf(Cat("Мурка"), Cat("Барсик")))\n\n    // Работает благодаря out — Dog является Animal\n    printAnimals(dogs)  // Рекс, Шарик\n    printAnimals(cats)  // Мурка, Барсик\n\n    // List<T> в Kotlin тоже out — это List<out T>\n    val animalList: List<Animal> = listOf(Dog("Гав"), Cat("Мяу"))\n    println(animalList.map { it.name })\n}' },
        { type: 'tip', value: 'Мнемоника: out — производитель (producer), только возвращает T. Если класс только читает данные типа T — используй out T. Именно так устроен List<out T> в Kotlin.' }
      ]
    },
    {
      id: 4,
      title: 'Вариантность: in (контравариантность)',
      type: 'theory',
      content: [
        { type: 'text', value: 'in означает контравариантность: если B : A, то Consumer<A> : Consumer<B>. Класс только потребляет значения типа T — принимает их в методах.' },
        { type: 'code', language: 'kotlin', value: 'open class Animal\nclass Dog : Animal()\n\n// in T — только потребляет T (только пишет/принимает)\ninterface Comparator<in T> {\n    fun compare(a: T, b: T): Int\n}\n\nclass AnimalComparator : Comparator<Animal> {\n    override fun compare(a: Animal, b: Animal): Int {\n        return a.toString().compareTo(b.toString())\n    }\n}\n\nfun sortDogs(dogs: MutableList<Dog>, comparator: Comparator<Dog>) {\n    // Сортировка...\n}\n\nfun main() {\n    val animalComparator = AnimalComparator()\n\n    // Comparator<Animal> можно использовать где нужен Comparator<Dog>\n    // потому что Animal более общий, Dog — частный\n    sortDogs(mutableListOf(Dog(), Dog()), animalComparator)\n    println("Сортировка прошла успешно")\n\n    // Реальный пример: Comparable работает контравариантно\n    val numbers = mutableListOf(3, 1, 4, 1, 5, 9)\n    numbers.sortWith(compareBy { it })  // compareBy возвращает Comparator<T>\n    println(numbers)  // [1, 1, 3, 4, 5, 9]\n}' },
        { type: 'tip', value: 'Мнемоника: in — потребитель (consumer), только принимает T. Если класс только пишет данные типа T — используй in T. Мнемоника PECS: Producer Extends (out), Consumer Super (in).' }
      ]
    },
    {
      id: 5,
      title: 'Reified типы и inline generics',
      type: 'theory',
      content: [
        { type: 'text', value: 'Из-за стирания типов (type erasure) в JVM нельзя проверить тип T в рантайме. Reified позволяет это делать, но только в inline-функциях.' },
        { type: 'code', language: 'kotlin', value: '// Без reified — нельзя использовать T как реальный тип\n// fun <T> isOfType(obj: Any): Boolean = obj is T  // ошибка!\n\n// С reified — тип доступен в рантайме\ninline fun <reified T> isOfType(obj: Any): Boolean = obj is T\n\ninline fun <reified T> List<Any>.filterByType(): List<T> {\n    return filterIsInstance<T>()\n}\n\ninline fun <reified T : Any> createInstance(): T {\n    return T::class.java.getDeclaredConstructor().newInstance()\n}\n\nfun main() {\n    println(isOfType<String>("Привет"))  // true\n    println(isOfType<Int>("Привет"))     // false\n    println(isOfType<Int>(42))           // true\n\n    val mixed: List<Any> = listOf(1, "два", 3, "четыре", 5.0)\n    val ints = mixed.filterByType<Int>()\n    val strings = mixed.filterByType<String>()\n    println("Числа: $ints")    // [1, 3]\n    println("Строки: $strings") // [два, четыре]\n\n    // Получение класса типа\n    inline fun <reified T> typeName() = T::class.simpleName\n    println(typeName<String>())  // String\n    println(typeName<List<Int>>()) // List\n}' },
        { type: 'warning', value: 'reified работает только в inline-функциях. Это ограничение JVM — нельзя получить тип T в рантайме обычным способом.' }
      ]
    },
    {
      id: 6,
      title: 'Практические паттерны с Generics',
      type: 'theory',
      content: [
        { type: 'text', value: 'Generics повсеместно используются для создания переиспользуемых утилит: репозитории, кэши, результаты операций. Рассмотрим реальные паттерны.' },
        { type: 'code', language: 'kotlin', value: '// Обобщённый репозиторий\ninterface Repository<T, ID> {\n    fun findById(id: ID): T?\n    fun save(item: T): T\n    fun findAll(): List<T>\n    fun delete(id: ID)\n}\n\ndata class User(val id: Int, val name: String)\n\nclass InMemoryUserRepository : Repository<User, Int> {\n    private val store = mutableMapOf<Int, User>()\n\n    override fun findById(id: Int) = store[id]\n    override fun save(item: User) = item.also { store[it.id] = it }\n    override fun findAll() = store.values.toList()\n    override fun delete(id: Int) { store.remove(id) }\n}\n\n// Обобщённый кэш\nclass Cache<K, V>(private val maxSize: Int = 100) {\n    private val store = LinkedHashMap<K, V>(maxSize, 0.75f, true)\n\n    fun put(key: K, value: V) {\n        if (store.size >= maxSize) {\n            store.iterator().next().also { store.remove(it.key) }\n        }\n        store[key] = value\n    }\n\n    fun get(key: K): V? = store[key]\n    fun size() = store.size\n}\n\nfun main() {\n    val repo = InMemoryUserRepository()\n    repo.save(User(1, "Анна"))\n    repo.save(User(2, "Борис"))\n    println(repo.findById(1))   // User(id=1, name=Анна)\n    println(repo.findAll())     // [User(id=1, ...), User(id=2, ...)]\n\n    val cache = Cache<String, Int>(3)\n    cache.put("a", 1)\n    cache.put("b", 2)\n    println(cache.get("a"))  // 1\n    println(cache.size())    // 2\n}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Обобщённый стек',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй обобщённый класс Stack<T> — структуру данных "стек" (LIFO). Методы: push(item), pop(): T?, peek(): T?, isEmpty(): Boolean, size(): Int. Добавь extension-функцию для List<T> toStack(). Протестируй со стеком Int и стеком String.',
      requirements: [
        'class Stack<T> с приватным списком элементов',
        'push(item: T) — добавляет на вершину',
        'pop(): T? — удаляет и возвращает вершину, null если пуст',
        'peek(): T? — возвращает вершину без удаления',
        'isEmpty() и size()',
        'fun <T> List<T>.toStack(): Stack<T> — extension',
        'Протестировать с Int и String'
      ],
      expectedOutput: 'Стек Int:\nРазмер: 3\nВершина: 30\nИзвлечено: 30\nИзвлечено: 20\nОсталось: 1\n---\nСтек String:\nВершина: kotlin\nВсе элементы: kotlin, java, python',
      hint: 'Используй MutableList<T> внутри. push добавляет в конец (add), pop удаляет последний (removeLastOrNull), peek возвращает last() или null. toStack() итерирует список и вызывает push для каждого элемента.',
      solution: 'class Stack<T> {\n    private val items = mutableListOf<T>()\n\n    fun push(item: T) { items.add(item) }\n    fun pop(): T? = if (items.isEmpty()) null else items.removeAt(items.size - 1)\n    fun peek(): T? = items.lastOrNull()\n    fun isEmpty() = items.isEmpty()\n    fun size() = items.size\n}\n\nfun <T> List<T>.toStack(): Stack<T> {\n    val stack = Stack<T>()\n    forEach { stack.push(it) }\n    return stack\n}\n\nfun main() {\n    println("Стек Int:")\n    val intStack = Stack<Int>()\n    intStack.push(10)\n    intStack.push(20)\n    intStack.push(30)\n    println("Размер: ${intStack.size()}")\n    println("Вершина: ${intStack.peek()}")\n    println("Извлечено: ${intStack.pop()}")\n    println("Извлечено: ${intStack.pop()}")\n    println("Осталось: ${intStack.size()}")\n\n    println("---")\n    println("Стек String:")\n    val words = listOf("python", "java", "kotlin")\n    val strStack = words.toStack()\n    println("Вершина: ${strStack.peek()}")\n    print("Все элементы: ")\n    val result = mutableListOf<String>()\n    while (!strStack.isEmpty()) {\n        strStack.pop()?.let { result.add(it) }\n    }\n    println(result.joinToString(", "))\n}',
      explanation: 'Stack<T> — классический пример generic-класса. Параметр T позволяет использовать один класс для любого типа данных. Extension toStack() показывает, как generics работают с extension-функциями — <T> объявляется перед именем функции. removeAt(items.size - 1) эффективно удаляет последний элемент из ArrayList.'
    }
  ]
}
