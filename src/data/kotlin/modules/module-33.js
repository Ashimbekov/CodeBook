export default {
  id: 33,
  title: 'Практикум: Мини-проекты',
  description: 'Мини-проекты на Kotlin, объединяющие несколько тем курса: ООП, корутины, коллекции, тестирование.',
  lessons: [
    {
      id: 1,
      title: 'Проект: Менеджер задач (To-Do List)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте консольный менеджер задач с CRUD-операциями: добавление, просмотр, выполнение и удаление задач.',
      requirements: [
        'data class Task(val id: Int, val title: String, var isDone: Boolean = false)',
        'class TaskManager: add, complete(id), delete(id), listAll(), listPending()',
        'Вывести список задач с статусом [x]/[ ]',
        'complete помечает задачу выполненной'
      ],
      expectedOutput: '[ ] 1: Написать тесты\n[ ] 2: Задокументировать API\n[x] 1: Написать тесты\n[ ] 2: Задокументировать API',
      hint: 'Используйте mutableListOf<Task>() и автоинкремент id.',
      solution: 'data class Task(val id: Int, val title: String, var isDone: Boolean = false)\n\nclass TaskManager {\n    private val tasks = mutableListOf<Task>()\n    private var nextId = 1\n    fun add(title: String): Task = Task(nextId++, title).also { tasks.add(it) }\n    fun complete(id: Int) { tasks.find { it.id == id }?.isDone = true }\n    fun delete(id: Int) { tasks.removeIf { it.id == id } }\n    fun listAll() = tasks.toList()\n    fun listPending() = tasks.filter { !it.isDone }\n    fun printAll() = listAll().forEach { println("[${if (it.isDone) "x" else " "}] ${it.id}: ${it.title}") }\n}\n\nfun main() {\n    val manager = TaskManager()\n    manager.add("Написать тесты")\n    manager.add("Задокументировать API")\n    manager.printAll()\n    println("---")\n    manager.complete(1)\n    manager.printAll()\n}',
      explanation: 'also возвращает объект после выполнения блока — удобно для "создай и добавь". removeIf удаляет все элементы, удовлетворяющие условию.'
    },
    {
      id: 2,
      title: 'Проект: Телефонная книга',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте телефонную книгу с поиском по имени и номеру. Поддержите несколько номеров на контакт.',
      requirements: [
        'data class Contact(val name: String, val phones: MutableList<String>)',
        'class PhoneBook: addContact, addPhone, findByName, findByPhone, deleteContact',
        'findByPhone возвращает Contact? по частичному совпадению номера',
        'Вывести все контакты отсортированными по имени'
      ],
      expectedOutput: 'Айгерим: [+7-777-111-2233]\nБерик: [+7-701-555-6677, +7-727-888-9900]\nПоиск по номеру 555: Берик',
      hint: 'contacts.values.find { c -> c.phones.any { it.contains(query) } }',
      solution: 'data class Contact(val name: String, val phones: MutableList<String> = mutableListOf())\n\nclass PhoneBook {\n    private val contacts = mutableMapOf<String, Contact>()\n    fun addContact(name: String) { contacts[name] = Contact(name) }\n    fun addPhone(name: String, phone: String) { contacts[name]?.phones?.add(phone) }\n    fun findByName(name: String) = contacts[name]\n    fun findByPhone(query: String) = contacts.values.find { c -> c.phones.any { it.contains(query) } }\n    fun deleteContact(name: String) { contacts.remove(name) }\n    fun printAll() = contacts.values.sortedBy { it.name }.forEach { println("${it.name}: ${it.phones}") }\n}\n\nfun main() {\n    val book = PhoneBook()\n    book.addContact("Айгерим"); book.addPhone("Айгерим", "+7-777-111-2233")\n    book.addContact("Берик"); book.addPhone("Берик", "+7-701-555-6677"); book.addPhone("Берик", "+7-727-888-9900")\n    book.printAll()\n    println("Поиск по номеру 555: ${book.findByPhone("555")?.name}")\n}',
      explanation: 'Map<String, Contact> с именем как ключом обеспечивает поиск за O(1). any { it.contains(query) } проверяет наличие подстроки в любом номере контакта.'
    },
    {
      id: 3,
      title: 'Проект: Банковский счёт',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте класс BankAccount с транзакциями, историей и балансом. Поддержите перевод между счетами.',
      requirements: [
        'data class Transaction(val type: String, val amount: Double, val timestamp: Long)',
        'class BankAccount(val owner: String, initialBalance: Double)',
        'deposit, withdraw (с проверкой), transfer(to, amount), history, balance',
        'withdraw при недостатке средств — IllegalStateException'
      ],
      expectedOutput: 'Баланс Ахмет: 700.0\nБаланс Жанар: 1300.0\nИстория: [DEPOSIT 1000.0, TRANSFER_OUT 300.0]',
      hint: 'transfer вызывает this.withdraw и to.deposit — атомарно в идеале, но для простоты последовательно.',
      solution: 'import java.time.Instant\n\ndata class Transaction(val type: String, val amount: Double, val timestamp: Long = Instant.now().epochSecond)\n\nclass BankAccount(val owner: String, initialBalance: Double) {\n    private var _balance = initialBalance\n    private val _history = mutableListOf<Transaction>()\n    val balance get() = _balance\n    val history: List<Transaction> get() = _history.toList()\n\n    fun deposit(amount: Double) {\n        require(amount > 0) { "Сумма должна быть положительной" }\n        _balance += amount\n        _history.add(Transaction("DEPOSIT", amount))\n    }\n    fun withdraw(amount: Double) {\n        require(amount > 0) { "Сумма должна быть положительной" }\n        check(_balance >= amount) { "Недостаточно средств" }\n        _balance -= amount\n        _history.add(Transaction("WITHDRAW", amount))\n    }\n    fun transfer(to: BankAccount, amount: Double) {\n        withdraw(amount)\n        to.deposit(amount)\n        _history.last().let { _history[_history.lastIndex] = it.copy(type = "TRANSFER_OUT") }\n    }\n}\n\nfun main() {\n    val akhmet = BankAccount("Ахмет", 1000.0)\n    val zhanar = BankAccount("Жанар", 1000.0)\n    akhmet.transfer(zhanar, 300.0)\n    println("Баланс ${akhmet.owner}: ${akhmet.balance}")\n    println("Баланс ${zhanar.owner}: ${zhanar.balance}")\n}',
      explanation: 'require проверяет предусловия (входные данные), check — инварианты состояния. Оба бросают исключение с сообщением. copy для data class создаёт копию с изменёнными полями.'
    },
    {
      id: 4,
      title: 'Проект: Система оценок студентов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте систему для хранения и анализа оценок студентов по предметам.',
      requirements: [
        'data class Student(val name: String, val grades: MutableMap<String, List<Int>> = mutableMapOf())',
        'Методы: addGrade(subject, grade), average(subject), gpa() — средний балл по всем предметам',
        'GradeBook: topStudents(n: Int), subjectAverage(subject: String)',
        'Вывести топ-3 студента по GPA'
      ],
      expectedOutput: 'Топ студенты:\n1. Дамир (GPA: 4.83)\n2. Айгерим (GPA: 4.50)\n3. Берик (GPA: 4.17)',
      hint: 'gpa() = grades.values.flatMap { it }.average()',
      solution: 'data class Student(val name: String, val grades: MutableMap<String, MutableList<Int>> = mutableMapOf()) {\n    fun addGrade(subject: String, grade: Int) { grades.getOrPut(subject) { mutableListOf() }.add(grade) }\n    fun average(subject: String) = grades[subject]?.average() ?: 0.0\n    fun gpa() = grades.values.flatten().average()\n}\n\nclass GradeBook {\n    private val students = mutableListOf<Student>()\n    fun addStudent(s: Student) { students.add(s) }\n    fun topStudents(n: Int) = students.sortedByDescending { it.gpa() }.take(n)\n    fun subjectAverage(subject: String) = students.mapNotNull { it.grades[subject] }.flatten().average()\n}\n\nfun main() {\n    val book = GradeBook()\n    val s1 = Student("Айгерим").apply { addGrade("Математика", 5); addGrade("Математика", 4); addGrade("Физика", 5) }\n    val s2 = Student("Берик").apply { addGrade("Математика", 4); addGrade("Математика", 4); addGrade("Физика", 5) }\n    val s3 = Student("Дамир").apply { addGrade("Математика", 5); addGrade("Математика", 5); addGrade("Физика", 5) }\n    listOf(s1, s2, s3).forEach { book.addStudent(it) }\n    println("Топ студенты:")\n    book.topStudents(3).forEachIndexed { i, s -> println("${i+1}. ${s.name} (GPA: ${"%.2f".format(s.gpa())})") }\n}',
      explanation: 'flatten() разворачивает List<List<Int>> в List<Int>. getOrPut создаёт значение по умолчанию если ключ отсутствует. sortedByDescending создаёт новый отсортированный список.'
    },
    {
      id: 5,
      title: 'Проект: Асинхронный загрузчик данных',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте DataLoader, который загружает данные из нескольких источников параллельно, кэширует результаты и поддерживает таймаут.',
      requirements: [
        'class DataLoader с кэшем (Map<String, String>)',
        'suspend fun load(url: String): String — симулирует загрузку (delay)',
        'suspend fun loadAll(urls: List<String>): Map<String, String> — параллельно',
        'Повторный запрос возвращает кэшированный результат мгновенно',
        'withTimeoutOrNull(3000) для каждой загрузки'
      ],
      expectedOutput: 'Загружено за ~1000ms: {url1=data1, url2=data2, url3=data3}\nИз кэша мгновенно: data1',
      hint: 'coroutineScope { urls.map { url -> async { load(url) } }.awaitAll() }',
      solution: 'import kotlinx.coroutines.*\n\nclass DataLoader {\n    private val cache = mutableMapOf<String, String>()\n\n    suspend fun load(url: String): String {\n        cache[url]?.let { return it }\n        val data = withTimeoutOrNull(3000) {\n            delay(1000)\n            "data_${url.takeLast(4)}"\n        } ?: "timeout_$url"\n        cache[url] = data\n        return data\n    }\n\n    suspend fun loadAll(urls: List<String>): Map<String, String> = coroutineScope {\n        urls.map { url -> url to async { load(url) } }\n            .associate { (url, deferred) -> url to deferred.await() }\n    }\n}\n\nfun main() = runBlocking {\n    val loader = DataLoader()\n    val start = System.currentTimeMillis()\n    val results = loader.loadAll(listOf("url1", "url2", "url3"))\n    println("Загружено за ${System.currentTimeMillis()-start}ms: $results")\n    val cached = loader.load("url1")\n    println("Из кэша: $cached")\n}',
      explanation: 'coroutineScope ждёт все дочерние корутины. associate создаёт Map из List<Pair>. Кэш проверяется перед запросом — повторный load возвращает мгновенно.'
    },
    {
      id: 6,
      title: 'Проект: Парсер CSV',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте парсер CSV-строк с поддержкой заголовков и типизированным доступом к данным.',
      requirements: [
        'CsvParser.parse(csv: String): List<Map<String, String>>',
        'Первая строка — заголовки',
        'Каждая запись — Map<header, value>',
        'Поддержать запятую как разделитель'
      ],
      expectedOutput: '[{name=Ахмет, age=25, city=Алматы}, {name=Жанар, age=30, city=Астана}]',
      hint: 'lines().first().split(",") — заголовки. Остальные строки mapIndexed с zip.',
      solution: 'object CsvParser {\n    fun parse(csv: String): List<Map<String, String>> {\n        val lines = csv.trim().lines()\n        if (lines.isEmpty()) return emptyList()\n        val headers = lines[0].split(",")\n        return lines.drop(1).map { line ->\n            val values = line.split(",")\n            headers.zip(values).toMap()\n        }\n    }\n}\n\nfun main() {\n    val csv = """\n        name,age,city\n        Ахмет,25,Алматы\n        Жанар,30,Астана\n    """.trimIndent()\n    val records = CsvParser.parse(csv)\n    println(records)\n    println("Первый пользователь: ${records[0]["name"]}, ${records[0]["age"]} лет")\n}',
      explanation: 'zip объединяет два списка в список пар. toMap конвертирует список пар в Map. object — одиночка (singleton) без явного companion.'
    },
    {
      id: 7,
      title: 'Проект: Система плагинов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте систему плагинов с регистрацией, приоритетами и цепочкой обработки запросов.',
      requirements: [
        'interface Plugin { val name: String; val priority: Int; fun process(input: String): String }',
        'class PluginSystem: register, process(input) — применяет плагины в порядке приоритета',
        'Три плагина: UpperCase (приоритет 1), Trim (приоритет 2), Exclaim (приоритет 3)',
        'process("  hello  ") -> "  HELLO  !" -> вывести промежуточные шаги'
      ],
      expectedOutput: 'После Trim: "hello"\nПосле UpperCase: "HELLO"\nПосле Exclaim: "HELLO!"',
      hint: 'sortedBy { it.priority }.fold(input) { acc, plugin -> plugin.process(acc) }',
      solution: 'interface Plugin {\n    val name: String\n    val priority: Int\n    fun process(input: String): String\n}\n\nclass PluginSystem {\n    private val plugins = mutableListOf<Plugin>()\n    fun register(plugin: Plugin) { plugins.add(plugin) }\n    fun process(input: String): String {\n        return plugins.sortedBy { it.priority }.fold(input) { acc, plugin ->\n            val result = plugin.process(acc)\n            println("После ${plugin.name}: \\"$result\\"")\n            result\n        }\n    }\n}\n\nobject TrimPlugin : Plugin {\n    override val name = "Trim"\n    override val priority = 1\n    override fun process(input: String) = input.trim()\n}\nobject UpperCasePlugin : Plugin {\n    override val name = "UpperCase"\n    override val priority = 2\n    override fun process(input: String) = input.uppercase()\n}\nobject ExclaimPlugin : Plugin {\n    override val name = "Exclaim"\n    override val priority = 3\n    override fun process(input: String) = "$input!"\n}\n\nfun main() {\n    val system = PluginSystem()\n    system.register(UpperCasePlugin)\n    system.register(TrimPlugin)\n    system.register(ExclaimPlugin)\n    system.process("  hello  ")\n}',
      explanation: 'fold аккумулирует результат, применяя функцию к каждому элементу. Это реализует паттерн Chain of Responsibility. sortedBy гарантирует порядок независимо от порядка регистрации.'
    },
    {
      id: 8,
      title: 'Проект: Мини-тестовый фреймворк',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте мини-фреймворк для тестирования с DSL-синтаксисом, группировкой тестов и подсчётом результатов.',
      requirements: [
        'fun describe(name: String, block: TestSuite.() -> Unit) создаёт группу тестов',
        'fun it(name: String, block: () -> Unit) в TestSuite описывает тест',
        'Зелёный вывод для прошедших, красный для упавших (используйте символы ✓/✗)',
        'Итоговая статистика: "N passed, M failed"'
      ],
      expectedOutput: 'Тесты Math:\n  PASS: складывает числа\n  PASS: делит без остатка\n  FAIL: бросает исключение\nРезультат: 2 passed, 1 failed',
      hint: 'class TestSuite с mutableListOf тестов. describe создаёт TestSuite.apply(block) и запускает тесты.',
      solution: 'class TestSuite(val name: String) {\n    private val tests = mutableListOf<Pair<String, () -> Unit>>()\n    var passed = 0; var failed = 0\n\n    fun it(description: String, block: () -> Unit) {\n        tests.add(description to block)\n    }\n\n    fun run() {\n        println("Тесты $name:")\n        for ((desc, block) in tests) {\n            try {\n                block()\n                passed++\n                println("  PASS: $desc")\n            } catch (e: Throwable) {\n                failed++\n                println("  FAIL: $desc — ${e.message}")\n            }\n        }\n    }\n}\n\nfun describe(name: String, block: TestSuite.() -> Unit): TestSuite {\n    val suite = TestSuite(name).apply(block)\n    suite.run()\n    return suite\n}\n\nfun main() {\n    val suite = describe("Math") {\n        it("складывает числа") { assert(2 + 3 == 5) }\n        it("делит без остатка") { assert(10 / 2 == 5) }\n        it("бросает исключение") { assert(1 / 0 == 0) }\n    }\n    println("Результат: ${suite.passed} passed, ${suite.failed} failed")\n}',
      explanation: 'DSL через лямбду с получателем: block: TestSuite.() -> Unit позволяет вызывать it { } напрямую внутри describe. try-catch ловит любые Throwable включая AssertionError.'
    }
  ]
}
