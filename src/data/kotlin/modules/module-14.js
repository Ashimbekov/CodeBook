export default {
  id: 14,
  title: 'Object и companion object',
  description: 'Синглтоны через object, companion object для статических членов, object expressions как анонимные объекты',
  lessons: [
    {
      id: 1,
      title: 'Object declaration — синглтон',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ключевое слово object создаёт синглтон — класс, у которого ровно один экземпляр. Это потокобезопасный синглтон, инициализируемый при первом обращении.' },
        { type: 'code', language: 'kotlin', value: 'object AppConfig {\n    val appName = "MyApp"\n    val version = "1.0.0"\n    var debugMode = false\n\n    fun printInfo() {\n        println("$appName v$version (debug: $debugMode)")\n    }\n}\n\nfun main() {\n    AppConfig.printInfo()   // MyApp v1.0.0 (debug: false)\n    AppConfig.debugMode = true\n    AppConfig.printInfo()   // MyApp v1.0.0 (debug: true)\n\n    // Всегда один и тот же объект\n    val ref1 = AppConfig\n    val ref2 = AppConfig\n    println(ref1 === ref2)  // true\n}' },
        { type: 'tip', value: 'Object в Kotlin — это идиоматический способ создать синглтон. Не нужно писать pattern Singleton вручную — компилятор сделает это правильно и потокобезопасно.' },
        { type: 'heading', value: 'Object с наследованием' },
        { type: 'code', language: 'kotlin', value: 'interface Logger {\n    fun log(message: String)\n}\n\nobject ConsoleLogger : Logger {\n    override fun log(message: String) {\n        println("[LOG] $message")\n    }\n}\n\nobject FileLogger : Logger {\n    private val logs = mutableListOf<String>()\n\n    override fun log(message: String) {\n        logs.add(message)\n        println("[FILE] $message сохранён")\n    }\n\n    fun getLogs() = logs.toList()\n}\n\nfun doWork(logger: Logger) {\n    logger.log("Начало работы")\n    logger.log("Работа завершена")\n}\n\nfun main() {\n    doWork(ConsoleLogger)\n    doWork(FileLogger)\n    println("Все логи: ${FileLogger.getLogs()}")\n}' }
      ]
    },
    {
      id: 2,
      title: 'companion object',
      type: 'theory',
      content: [
        { type: 'text', value: 'companion object — объект-компаньон, привязанный к классу. Его члены вызываются через имя класса — как статические методы в Java. Но это полноценный объект, который может реализовывать интерфейсы.' },
        { type: 'code', language: 'kotlin', value: 'class User private constructor(\n    val id: Int,\n    val name: String,\n    val email: String\n) {\n    companion object {\n        private var nextId = 1\n\n        // Фабричный метод\n        fun create(name: String, email: String): User {\n            return User(nextId++, name, email)\n        }\n\n        fun fromString(data: String): User {\n            val parts = data.split(",")\n            return User(nextId++, parts[0].trim(), parts[1].trim())\n        }\n\n        const val MAX_NAME_LENGTH = 50\n    }\n\n    override fun toString() = "User(id=$id, name=$name, email=$email)"\n}\n\nfun main() {\n    val user1 = User.create("Анна", "anna@mail.ru")\n    val user2 = User.create("Борис", "boris@mail.ru")\n    val user3 = User.fromString("Вера, vera@mail.ru")\n\n    println(user1)  // User(id=1, name=Анна, email=anna@mail.ru)\n    println(user2)  // User(id=2, name=Борис, email=boris@mail.ru)\n    println(user3)  // User(id=3, name=Вера, email=vera@mail.ru)\n\n    println("Макс длина имени: ${User.MAX_NAME_LENGTH}")\n}' },
        { type: 'heading', value: 'companion с именем и интерфейсом' },
        { type: 'code', language: 'kotlin', value: 'interface Factory<T> {\n    fun create(): T\n}\n\nclass Button(val label: String) {\n    companion object Creator : Factory<Button> {\n        override fun create() = Button("OK")\n    }\n}\n\nfun main() {\n    val btn1 = Button.create()       // через имя класса\n    val btn2 = Button.Creator.create() // через имя companion\n    println(btn1.label)  // OK\n\n    // companion как объект\n    val factory: Factory<Button> = Button.Creator\n    println(factory.create().label)  // OK\n}' },
        { type: 'note', value: 'const val работает только в companion object или на верхнем уровне файла. Это константы времени компиляции — они эффективнее обычных val.' }
      ]
    },
    {
      id: 3,
      title: 'Object expressions — анонимные объекты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Object expression создаёт анонимный объект "на лету". Это аналог анонимных классов Java — удобно для одноразовых реализаций интерфейсов.' },
        { type: 'code', language: 'kotlin', value: 'interface ClickListener {\n    fun onClick()\n    fun onLongClick(): Boolean\n}\n\nfun setListener(listener: ClickListener) {\n    println("Клик!")\n    listener.onClick()\n    if (listener.onLongClick()) {\n        println("Долгий клик обработан")\n    }\n}\n\nfun main() {\n    // Анонимный объект\n    setListener(object : ClickListener {\n        override fun onClick() {\n            println("Нажата кнопка")\n        }\n\n        override fun onLongClick(): Boolean {\n            println("Долгое нажатие")\n            return true\n        }\n    })\n\n    // Анонимный объект без базового типа\n    val point = object {\n        val x = 10\n        val y = 20\n        override fun toString() = "($x, $y)"\n    }\n    println(point)  // (10, 20)\n}' },
        { type: 'tip', value: 'В Kotlin анонимные объекты захватывают переменные из окружающего контекста (замыкание). В отличие от Java, захваченные переменные не обязаны быть final.' },
        { type: 'code', language: 'kotlin', value: 'fun createCounter(start: Int): () -> Int {\n    var count = start\n    return object : () -> Int {\n        override fun invoke(): Int = count++\n    }\n}\n\nfun main() {\n    val counter = createCounter(5)\n    println(counter())  // 5\n    println(counter())  // 6\n    println(counter())  // 7\n}' }
      ]
    },
    {
      id: 4,
      title: 'Паттерн Singleton и Registry',
      type: 'theory',
      content: [
        { type: 'text', value: 'Object отлично подходит для реализации классических паттернов: Singleton, Registry, Service Locator. Рассмотрим практические примеры.' },
        { type: 'code', language: 'kotlin', value: '// Registry — хранилище сервисов\nobject ServiceRegistry {\n    private val services = mutableMapOf<String, Any>()\n\n    fun <T : Any> register(key: String, service: T) {\n        services[key] = service\n        println("Сервис зарегистрирован: $key")\n    }\n\n    @Suppress("UNCHECKED_CAST")\n    fun <T : Any> get(key: String): T? = services[key] as? T\n\n    fun isRegistered(key: String) = services.containsKey(key)\n}\n\nclass EmailService {\n    fun send(to: String, msg: String) = println("Email к $to: $msg")\n}\n\nclass SmsService {\n    fun send(to: String, msg: String) = println("SMS к $to: $msg")\n}\n\nfun main() {\n    ServiceRegistry.register("email", EmailService())\n    ServiceRegistry.register("sms", SmsService())\n\n    val email = ServiceRegistry.get<EmailService>("email")\n    email?.send("user@mail.ru", "Привет!")\n\n    val sms = ServiceRegistry.get<SmsService>("sms")\n    sms?.send("+7999", "Код: 1234")\n\n    println("SMS зарегистрирован: ${ServiceRegistry.isRegistered("sms")}")\n}' },
        { type: 'note', value: 'Object инициализируется лениво при первом обращении. Это потокобезопасно — JVM гарантирует, что статический инициализатор вызывается один раз.' }
      ]
    },
    {
      id: 5,
      title: 'Разница object, companion, class',
      type: 'theory',
      content: [
        { type: 'text', value: 'Важно чётко понимать, когда использовать каждый из инструментов: обычный класс, object declaration или companion object.' },
        { type: 'list', items: [
          'class — когда нужно создавать множество экземпляров с разным состоянием',
          'object declaration — когда нужен ровно один экземпляр (синглтон, утилиты, кэш)',
          'companion object — когда нужны методы/константы, относящиеся к классу, но не к конкретному экземпляру (фабричные методы, константы)',
          'object expression — когда нужна одноразовая реализация интерфейса или класса'
        ]},
        { type: 'code', language: 'kotlin', value: '// class — много экземпляров\nclass BankAccount(val owner: String) {\n    private var balance = 0.0\n\n    fun deposit(amount: Double) { balance += amount }\n    fun getBalance() = balance\n\n    companion object {\n        // companion — относится к концепции BankAccount\n        const val INTEREST_RATE = 0.05\n        var totalAccounts = 0\n            private set\n\n        fun openAccount(owner: String): BankAccount {\n            totalAccounts++\n            return BankAccount(owner)\n        }\n    }\n}\n\n// object — один экземпляр банка\nobject Bank {\n    val name = "КотлинБанк"\n    private val accounts = mutableListOf<BankAccount>()\n\n    fun addAccount(acc: BankAccount) = accounts.add(acc)\n    fun totalMoney() = accounts.sumOf { it.getBalance() }\n}\n\nfun main() {\n    val acc1 = BankAccount.openAccount("Анна")\n    val acc2 = BankAccount.openAccount("Борис")\n    acc1.deposit(50000.0)\n    acc2.deposit(30000.0)\n\n    Bank.addAccount(acc1)\n    Bank.addAccount(acc2)\n\n    println("Счетов открыто: ${BankAccount.totalAccounts}")\n    println("Всего денег в ${Bank.name}: ${Bank.totalMoney()}")\n    println("Ставка: ${BankAccount.INTEREST_RATE}")\n}' }
      ]
    },
    {
      id: 6,
      title: 'Практика: EventBus через object',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй простую систему событий (EventBus) через object. EventBus хранит подписчиков для каждого типа события (строка-ключ). Методы: subscribe(event, handler), publish(event, data), unsubscribe(event). Типы событий: "login", "logout", "purchase". Протестируй подписку и публикацию.',
      requirements: [
        'object EventBus с картой subscribers: MutableMap<String, MutableList<(String) -> Unit>>',
        'subscribe(event: String, handler: (String) -> Unit) добавляет обработчик',
        'publish(event: String, data: String) вызывает все обработчики события',
        'unsubscribe(event: String) очищает все обработчики события',
        'Подпишись на "login" и "purchase", опубликуй события, затем отпишись и проверь'
      ],
      expectedOutput: '[Login] Пользователь вошёл: Анна\n[Audit] Вход: Анна\n[Purchase] Покупка: Ноутбук\nПосле отписки от login:\n(нет обработчиков login)',
      hint: 'subscribers.getOrPut(event) { mutableListOf() } вернёт существующий список или создаст новый. При публикации итерируй по handlers и вызывай каждый handler(data).',
      solution: 'object EventBus {\n    private val subscribers = mutableMapOf<String, MutableList<(String) -> Unit>>()\n\n    fun subscribe(event: String, handler: (String) -> Unit) {\n        subscribers.getOrPut(event) { mutableListOf() }.add(handler)\n    }\n\n    fun publish(event: String, data: String) {\n        subscribers[event]?.forEach { it(data) }\n    }\n\n    fun unsubscribe(event: String) {\n        subscribers.remove(event)\n    }\n}\n\nfun main() {\n    EventBus.subscribe("login") { user -> println("[Login] Пользователь вошёл: $user") }\n    EventBus.subscribe("login") { user -> println("[Audit] Вход: $user") }\n    EventBus.subscribe("purchase") { item -> println("[Purchase] Покупка: $item") }\n\n    EventBus.publish("login", "Анна")\n    EventBus.publish("purchase", "Ноутбук")\n\n    EventBus.unsubscribe("login")\n    println("После отписки от login:")\n    EventBus.publish("login", "Борис")\n    println("(нет обработчиков login)")\n}',
      explanation: 'EventBus — классический паттерн Pub/Sub. Object гарантирует единственность экземпляра — один шина событий на всё приложение. getOrPut — удобный способ получить значение или создать его, если ключа нет. Лямбды как обработчики событий — это функции высшего порядка.'
    }
  ]
}
