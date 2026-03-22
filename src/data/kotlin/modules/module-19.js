export default {
  id: 19,
  title: 'Scope функции (let, run, apply, also, with)',
  description: 'Пять scope-функций Kotlin: let, run, apply, also, with — контекст вызова, возвращаемое значение и когда использовать каждую из них',
  lessons: [
    {
      id: 1,
      title: 'Обзор scope-функций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Scope-функции — это функции стандартной библиотеки, которые выполняют блок кода в контексте объекта. Они отличаются двумя параметрами: как обращаться к объекту (this или it) и что возвращают (объект или результат блока).' },
        { type: 'list', items: [
          'let — объект через it, возвращает результат блока. Для преобразований и null-проверок',
          'run — объект через this, возвращает результат блока. Для инициализации + вычисление',
          'apply — объект через this, возвращает сам объект. Для конфигурации объекта',
          'also — объект через it, возвращает сам объект. Для побочных эффектов (логирование)',
          'with — объект через this, возвращает результат блока. Для группировки операций над объектом'
        ]},
        { type: 'code', language: 'kotlin', value: 'data class Person(var name: String, var age: Int, var email: String = "")\n\nfun main() {\n    val person = Person("Анна", 25)\n\n    // apply — конфигурация, возвращает объект\n    val configured = person.apply {\n        email = "anna@mail.ru"  // this.email\n        age = 26\n    }\n    println(configured)  // Person(name=Анна, age=26, email=anna@mail.ru)\n    println(person === configured)  // true — тот же объект\n\n    // let — преобразование, возвращает результат\n    val greeting = person.let {\n        "Привет, ${it.name}! Тебе ${it.age} лет."  // it — Person\n    }\n    println(greeting)  // Привет, Анна! Тебе 26 лет.\n\n    // run — как let но this\n    val info = person.run {\n        "$name: $age лет, $email"  // this — Person\n    }\n    println(info)  // Анна: 26 лет, anna@mail.ru\n}' },
        { type: 'tip', value: 'Выбор между this и it зависит от читаемости: this позволяет опустить ссылку на объект внутри блока (как в методе класса), it явно показывает, что это внешний объект.' }
      ]
    },
    {
      id: 2,
      title: 'let — преобразование и null-проверка',
      type: 'theory',
      content: [
        { type: 'text', value: 'let — наиболее универсальная scope-функция. Главное применение: безопасная работа с nullable значениями через ?.let {}.' },
        { type: 'code', language: 'kotlin', value: 'fun findUser(id: Int): String? = if (id > 0) "Пользователь_$id" else null\n\nfun main() {\n    // let для null-безопасности\n    val userId = 5\n    findUser(userId)?.let { user ->\n        println("Найден: $user")  // Найден: Пользователь_5\n        // Блок выполнится только если user != null\n    } ?: println("Пользователь не найден")\n\n    findUser(-1)?.let { user ->\n        println("Найден: $user")\n    } ?: println("Пользователь не найден")  // Пользователь не найден\n\n    // let для преобразования цепочек\n    val result = "  42  "\n        .trim()\n        .let { it.toIntOrNull() }\n        ?.let { it * 2 }\n        ?: 0\n    println(result)  // 84\n\n    // let для ограничения области видимости\n    val processedName = "  анна иванова  ".let { raw ->\n        val trimmed = raw.trim()\n        val words = trimmed.split(" ")\n        words.joinToString(" ") { it.replaceFirstChar { c -> c.uppercase() } }\n    }\n    println(processedName)  // Анна Иванова\n}' },
        { type: 'tip', value: 'obj?.let { } — идиоматический способ выполнить действие только если объект не null. Это элегантнее чем if (obj != null) { ... }.' }
      ]
    },
    {
      id: 3,
      title: 'apply — конфигурация объекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'apply идеально подходит для конфигурации объектов. Внутри блока this — сам объект, можно обращаться к его членам без явного имени. Возвращает сам объект.' },
        { type: 'code', language: 'kotlin', value: 'data class ServerConfig(\n    var host: String = "localhost",\n    var port: Int = 8080,\n    var ssl: Boolean = false,\n    var timeout: Int = 5000,\n    var maxConnections: Int = 100\n)\n\nfun createProductionConfig() = ServerConfig().apply {\n    host = "prod.example.com"\n    port = 443\n    ssl = true\n    timeout = 30000\n    maxConnections = 1000\n}\n\n// apply в цепочке\nfun main() {\n    val config = createProductionConfig()\n    println("${ config.host }:${ config.port } SSL=${ config.ssl }")\n\n    // apply с mutableListOf\n    val list = mutableListOf<String>().apply {\n        add("Kotlin")\n        add("Java")\n        add("Python")\n        removeIf { it.length < 5 }\n    }\n    println(list)  // [Kotlin, Python]\n\n    // apply для StringBuilder\n    val text = StringBuilder().apply {\n        append("Уважаемый ")\n        append("пользователь")\n        append(",\\n")\n        append("добро пожаловать!")\n    }.toString()\n    println(text)\n}' },
        { type: 'note', value: 'apply используется чаще всего при создании и конфигурации объектов. Паттерн Builder в Kotlin часто реализуется через apply.' }
      ]
    },
    {
      id: 4,
      title: 'also — побочные эффекты',
      type: 'theory',
      content: [
        { type: 'text', value: 'also похож на apply, но объект передаётся как it, а не this. Используется для побочных эффектов (логирование, отладка) без нарушения цепочки.' },
        { type: 'code', language: 'kotlin', value: 'data class Order(val id: Int, val items: MutableList<String> = mutableListOf()) {\n    fun addItem(item: String) = apply { items.add(item) }\n}\n\nfun log(message: String) = println("[LOG] $message")\n\nfun main() {\n    // also для логирования в цепочке\n    val numbers = mutableListOf(3, 1, 4, 1, 5, 9, 2, 6)\n        .also { log("Исходный список: $it") }\n        .sorted()\n        .also { log("После сортировки: $it") }\n        .filter { it > 3 }\n        .also { log("После фильтрации: $it") }\n\n    println("Результат: $numbers")\n\n    // also для добавления побочного эффекта без изменения цепочки\n    val order = Order(1)\n        .addItem("Ноутбук")\n        .addItem("Мышь")\n        .also { log("Заказ ${it.id} создан с ${it.items.size} товарами") }\n\n    println("Товары в заказе: ${order.items}")\n\n    // also для проверки\n    fun createUser(name: String) = mapOf("name" to name, "id" to "gen_id")\n        .also { require(name.isNotBlank()) { "Имя не может быть пустым" } }\n\n    println(createUser("Анна"))\n}' },
        { type: 'tip', value: 'also — идеальное место для println или log при отладке: вставляй в цепочку, не нарушая её логику. Когда отладка не нужна — просто удаляешь .also { }.' }
      ]
    },
    {
      id: 5,
      title: 'run и with',
      type: 'theory',
      content: [
        { type: 'text', value: 'run и with похожи по поведению (this + возвращают результат блока), но синтаксис вызова отличается: run вызывается как extension, with принимает объект как аргумент.' },
        { type: 'code', language: 'kotlin', value: 'data class Rectangle(val width: Double, val height: Double)\n\nfun main() {\n    val rect = Rectangle(4.0, 6.0)\n\n    // run — extension на объекте\n    val area = rect.run {\n        println("Считаем площадь $width x $height")\n        width * height  // возвращаемое значение\n    }\n    println("Площадь: $area")  // 24.0\n\n    // with — объект как аргумент\n    val description = with(rect) {\n        "Прямоугольник: ширина=$width, высота=$height, площадь=${width * height}"\n    }\n    println(description)\n\n    // run без объекта — просто блок кода, возвращающий значение\n    val config = run {\n        val host = "localhost"\n        val port = 8080\n        "$host:$port"\n    }\n    println("Сервер: $config")  // localhost:8080\n\n    // with для группировки операций\n    val sb = StringBuilder("Список: ")\n    with(sb) {\n        append("kotlin, ")\n        append("java, ")\n        append("python")\n    }\n    println(sb)  // Список: kotlin, java, python\n}' },
        { type: 'code', language: 'kotlin', value: '// Сравнение всех пяти\ndata class Config(var url: String = "", var timeout: Int = 0)\n\nfun main() {\n    val config = Config()\n\n    config.let { c -> c.url = "url1"; "let: ${c.url}" }.also { println(it) }\n    config.run { url = "run_url"; "run: $url" }.also { println(it) }\n    config.apply { url = "apply_url" }.also { println("apply: ${it.url}") }\n    config.also { it.url = "also_url"; println("also: ${it.url}") }\n    with(config) { url = "with_url"; "with: $url" }.also { println(it) }\n}' }
      ]
    },
    {
      id: 6,
      title: 'Когда какую использовать',
      type: 'theory',
      content: [
        { type: 'text', value: 'Выбор scope-функции — вопрос читаемости кода. Следуй практическим правилам Kotlin-идиоматики.' },
        { type: 'list', items: [
          'apply: конфигурация объекта при создании — val config = Config().apply { ... }',
          'let: nullable-безопасность — obj?.let { use(it) }; преобразование значения',
          'run: вычисление на основе объекта — val area = rect.run { width * height }',
          'also: побочные эффекты (логирование, проверки) в цепочке — .also { log(it) }',
          'with: группировка операций над одним объектом — with(user) { ... }'
        ]},
        { type: 'code', language: 'kotlin', value: 'data class User(var name: String, var email: String, var age: Int)\n\nfun processUser(raw: Map<String, String>): User? {\n    // apply — конфигурация при создании\n    val user = User("", "", 0).apply {\n        name = raw["name"] ?: return null\n        email = raw["email"] ?: return null\n        age = raw["age"]?.toIntOrNull() ?: return null\n    }\n\n    // also — логирование\n    return user.also { println("Создан пользователь: ${it.name}") }\n}\n\nfun formatUser(user: User?): String {\n    // let — null-безопасность и преобразование\n    return user?.let { u ->\n        // with — группировка\n        with(u) {\n            "$name ($age лет) — $email"\n        }\n    } ?: "Пользователь не найден"\n}\n\nfun main() {\n    val data1 = mapOf("name" to "Анна", "email" to "anna@mail.ru", "age" to "25")\n    val data2 = mapOf("name" to "Борис")  // неполные данные\n\n    val user1 = processUser(data1)\n    val user2 = processUser(data2)\n\n    println(formatUser(user1))  // Анна (25 лет) — anna@mail.ru\n    println(formatUser(user2))  // Пользователь не найден\n}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Конфигурация через scope-функции',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай систему конфигурации HTTP-клиента. Используй apply для создания HttpClient, let для безопасной обработки ответа, also для логирования, run для вычисления URL. Data классы: HttpConfig(host, port, timeout, headers), HttpResponse(status, body, headers). Функция buildClient(block) принимает конфигурацию через apply-подобный DSL.',
      requirements: [
        'data class HttpConfig с полями host, port, timeout: Int = 5000, headers: MutableMap',
        'data class HttpResponse(status: Int, body: String?, headers: Map<String, String>)',
        'fun buildConfig(block: HttpConfig.() -> Unit): HttpConfig использует apply',
        'fun simulateRequest(config: HttpConfig, path: String): HttpResponse',
        'simulateRequest возвращает 200 для "/" и 404 для остального',
        'Обработать ответ через let, логировать через also'
      ],
      expectedOutput: '[LOG] Отправляем запрос к localhost:8080/\n[LOG] Получен ответ: 200\nОтвет: Добро пожаловать!\n[LOG] Отправляем запрос к localhost:8080/missing\n[LOG] Получен ответ: 404\nОшибка 404: Страница не найдена',
      hint: 'buildConfig создаёт HttpConfig() и вызывает block() через apply. simulateRequest использует run { } для построения URL. Обработка ответа через also { log } .let { if 200 OK else error }.',
      solution: 'data class HttpConfig(\n    var host: String = "localhost",\n    var port: Int = 8080,\n    var timeout: Int = 5000,\n    val headers: MutableMap<String, String> = mutableMapOf()\n)\n\ndata class HttpResponse(\n    val status: Int,\n    val body: String?,\n    val headers: Map<String, String> = emptyMap()\n)\n\nfun buildConfig(block: HttpConfig.() -> Unit): HttpConfig {\n    return HttpConfig().apply(block)\n}\n\nfun simulateRequest(config: HttpConfig, path: String): HttpResponse {\n    val url = config.run { "$host:$port$path" }\n    println("[LOG] Отправляем запрос к $url")\n    return if (path == "/") {\n        HttpResponse(200, "Добро пожаловать!")\n    } else {\n        HttpResponse(404, null)\n    }\n}\n\nfun handleResponse(response: HttpResponse) {\n    response\n        .also { println("[LOG] Получен ответ: ${it.status}") }\n        .let { resp ->\n            if (resp.status == 200) {\n                println("Ответ: ${resp.body}")\n            } else {\n                println("Ошибка ${resp.status}: Страница не найдена")\n            }\n        }\n}\n\nfun main() {\n    val config = buildConfig {\n        host = "localhost"\n        port = 8080\n        headers["Accept"] = "application/json"\n    }\n\n    handleResponse(simulateRequest(config, "/"))\n    handleResponse(simulateRequest(config, "/missing"))\n}',
      explanation: 'apply в buildConfig создаёт паттерн DSL-конфигурации — внутри блока this — HttpConfig, поэтому можно писать host = "..." без явного указания объекта. run { } для вычисления URL удобен тем, что возвращает результат блока. also перехватывает значение для логирования, не разрывая цепочку. let обрабатывает результат разными путями в зависимости от статуса.'
    }
  ]
}
