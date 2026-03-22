export default {
  id: 22,
  title: 'Корутины: Flow',
  description: 'Kotlin Flow — холодные потоки данных, операторы преобразования, StateFlow и SharedFlow, обработка ошибок и отмена в реактивном программировании',
  lessons: [
    {
      id: 1,
      title: 'Что такое Flow',
      type: 'theory',
      content: [
        { type: 'text', value: 'Flow — асинхронный поток данных в Kotlin. В отличие от suspend-функции, которая возвращает одно значение, Flow может эмитировать множество значений во времени. Flow холодный — начинает работу только при сборе (collect).' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.flow.*\n\n// Создание Flow через builder\nfun numbersFlow(): Flow<Int> = flow {\n    println("Flow начался")  // выполняется при каждом collect\n    for (i in 1..5) {\n        delay(300)  // suspend внутри flow\n        emit(i)    // испускаем значение\n    }\n    println("Flow завершён")\n}\n\nfun main() = runBlocking {\n    val numFlow = numbersFlow()\n\n    println("Перед первым collect")\n    numFlow.collect { value ->\n        println("Получено: $value")\n    }\n\n    println("\\nВторой collect:")\n    numFlow.collect { value ->\n        print("$value ")\n    }\n    println()\n}' },
        { type: 'tip', value: 'Flow холодный: код внутри flow { } не выполняется до вызова collect(). При каждом новом collect() поток запускается заново — в отличие от горячих потоков (SharedFlow/StateFlow).' },
        { type: 'heading', value: 'Быстрые способы создать Flow' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.flow.*\n\nfun main() = runBlocking {\n    // flowOf — из конкретных значений\n    flowOf(1, 2, 3).collect { print("$it ") }  // 1 2 3\n    println()\n\n    // asFlow — из коллекции\n    listOf("a", "b", "c").asFlow().collect { print("$it ") }  // a b c\n    println()\n\n    // (1..5).asFlow()\n    (1..5).asFlow().collect { print("$it ") }  // 1 2 3 4 5\n    println()\n\n    // flow { } с emit — полный контроль\n    val ticker = flow {\n        var tick = 0\n        repeat(3) {\n            delay(200)\n            emit("Тик ${++tick}")\n        }\n    }\n    ticker.collect { println(it) }\n}' }
      ]
    },
    {
      id: 2,
      title: 'Операторы преобразования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Flow поддерживает те же операторы, что и коллекции (map, filter, take и др.), но они выполняются лениво и асинхронно. Это "конвейер" преобразований.' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.flow.*\n\nfun main() = runBlocking {\n    val numbers = (1..10).asFlow()\n\n    // map — преобразование\n    numbers\n        .map { it * it }\n        .collect { print("$it ") }  // 1 4 9 16 25 36 49 64 81 100\n    println()\n\n    // filter — отбор\n    numbers\n        .filter { it % 2 == 0 }\n        .collect { print("$it ") }  // 2 4 6 8 10\n    println()\n\n    // take — первые N элементов\n    numbers\n        .take(3)\n        .collect { print("$it ") }  // 1 2 3\n    println()\n\n    // Цепочка операторов\n    numbers\n        .filter { it % 2 != 0 }   // нечётные: 1,3,5,7,9\n        .map { it * it }           // квадраты: 1,9,25,49,81\n        .take(3)                   // первые 3: 1,9,25\n        .collect { print("$it ") }\n    println()\n\n    // transform — гибкое преобразование (может emit 0 или N значений)\n    numbers.take(3).transform { n ->\n        emit("num $n")\n        if (n % 2 == 0) emit("чётное: $n")\n    }.collect { println(it) }\n}' },
        { type: 'heading', value: 'Терминальные операторы' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.flow.*\n\nfun main() = runBlocking {\n    val nums = (1..5).asFlow()\n\n    // collect — базовый терминальный оператор\n    // toList, toSet — собирают в коллекцию\n    println(nums.toList())  // [1, 2, 3, 4, 5]\n    println(nums.toSet())   // [1, 2, 3, 4, 5]\n\n    // reduce, fold — агрегация\n    println(nums.reduce { acc, n -> acc + n })  // 15\n    println(nums.fold(10) { acc, n -> acc + n }) // 25\n\n    // first, last, single\n    println(nums.first())  // 1\n    println(nums.last())   // 5\n\n    // count\n    println(nums.filter { it > 3 }.count())  // 2\n}' }
      ]
    },
    {
      id: 3,
      title: 'flatMapConcat и flatMapMerge',
      type: 'theory',
      content: [
        { type: 'text', value: 'flatMap-операторы позволяют для каждого элемента потока создать вложенный поток. Отличие: concat — последовательно, merge — параллельно.' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.flow.*\n\nfun requestFlow(id: Int): Flow<String> = flow {\n    emit("Запрос $id начат")\n    delay(200)\n    emit("Запрос $id завершён")\n}\n\nfun main() = runBlocking {\n    // flatMapConcat — ждёт завершения каждого вложенного Flow\n    println("--- flatMapConcat ---")\n    (1..3).asFlow()\n        .flatMapConcat { requestFlow(it) }\n        .collect { println(it) }\n    // Запрос 1 начат -> Запрос 1 завершён -> Запрос 2 начат -> ...\n\n    println("\\n--- flatMapMerge ---")\n    // flatMapMerge — запускает все Flow параллельно\n    (1..3).asFlow()\n        .flatMapMerge { requestFlow(it) }\n        .collect { println(it) }\n    // Все "начат" сразу, потом "завершён" в порядке завершения\n\n    println("\\n--- zip ---")\n    // zip — объединяет два Flow попарно\n    val names = flowOf("Анна", "Борис", "Вера")\n    val ages = flowOf(25, 30, 28)\n    names.zip(ages) { name, age -> "$name: $age лет" }\n        .collect { println(it) }\n}' },
        { type: 'tip', value: 'flatMapConcat для последовательной обработки (порядок важен), flatMapMerge для параллельной (скорость важнее порядка). zip синхронизирует два потока попарно.' }
      ]
    },
    {
      id: 4,
      title: 'StateFlow и SharedFlow',
      type: 'theory',
      content: [
        { type: 'text', value: 'StateFlow и SharedFlow — горячие потоки: они активны независимо от наличия подписчиков. StateFlow хранит последнее значение, SharedFlow может конфигурировать replay-кэш.' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.flow.*\n\n// StateFlow — хранит текущее состояние\nclass Counter {\n    private val _count = MutableStateFlow(0)\n    val count: StateFlow<Int> = _count.asStateFlow()\n\n    fun increment() { _count.value++ }\n    fun decrement() { _count.value-- }\n    fun reset() { _count.value = 0 }\n}\n\nfun main() = runBlocking {\n    val counter = Counter()\n\n    // Подписчик\n    val job = launch {\n        counter.count.collect { value ->\n            println("Счётчик: $value")\n        }\n    }\n\n    delay(100)\n    counter.increment()  // 1\n    counter.increment()  // 2\n    counter.increment()  // 3\n    counter.decrement()  // 2\n    counter.reset()      // 0\n    delay(100)\n    job.cancel()\n}' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.flow.*\n\n// SharedFlow — горячий поток для событий\nclass EventBus {\n    private val _events = MutableSharedFlow<String>(\n        replay = 0,       // не хранить старые события\n        extraBufferCapacity = 64  // буфер для медленных подписчиков\n    )\n    val events: SharedFlow<String> = _events.asSharedFlow()\n\n    suspend fun emit(event: String) = _events.emit(event)\n}\n\nfun main() = runBlocking {\n    val bus = EventBus()\n\n    // Два подписчика\n    val job1 = launch {\n        bus.events.collect { println("Subscriber1: $it") }\n    }\n    val job2 = launch {\n        bus.events.collect { println("Subscriber2: $it") }\n    }\n\n    delay(100)\n    bus.emit("Событие А")\n    bus.emit("Событие Б")\n    bus.emit("Событие В")\n    delay(100)\n    job1.cancel()\n    job2.cancel()\n}' },
        { type: 'note', value: 'StateFlow: подписчик сразу получает текущее значение. SharedFlow: подписчик получает только новые события (если replay = 0). StateFlow — для состояния UI, SharedFlow — для событий.' }
      ]
    },
    {
      id: 5,
      title: 'Обработка ошибок и отмена в Flow',
      type: 'theory',
      content: [
        { type: 'text', value: 'Flow предоставляет операторы catch и onCompletion для обработки ошибок и завершения. Отмена Flow происходит автоматически при отмене корутины-коллектора.' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.flow.*\n\nfun riskyFlow(): Flow<Int> = flow {\n    emit(1)\n    emit(2)\n    throw RuntimeException("Ошибка в потоке!")\n    emit(3)  // не выполнится\n}\n\nfun main() = runBlocking {\n    // catch — перехват ошибок\n    riskyFlow()\n        .catch { e -> emit(-1)  // вместо ошибки — -1\n                  println("Поймано: ${e.message}") }\n        .collect { println("Значение: $it") }\n\n    println()\n\n    // onEach + catch + collect\n    (1..5).asFlow()\n        .onEach { if (it == 3) throw IllegalStateException("Стоп на 3") }\n        .catch { e -> println("catch: ${e.message}") }\n        .onCompletion { cause ->\n            if (cause == null) println("Flow завершён успешно")\n            else println("Flow завершён с ошибкой: ${cause.message}")\n        }\n        .collect { println("Элемент: $it") }\n\n    println()\n\n    // Отмена через collectLatest — отменяет предыдущий collect при новом значении\n    flow {\n        emit(1)\n        delay(100)\n        emit(2)\n        delay(100)\n        emit(3)\n    }.collectLatest { value ->\n        println("Начало обработки $value")\n        delay(150)  // дольше интервала между emit\n        println("Конец обработки $value")  // только последнее доберётся\n    }\n}' },
        { type: 'tip', value: 'collectLatest отменяет обработку предыдущего значения если пришло новое. Идеально для поиска с debounce — не нужно обрабатывать промежуточные результаты.' }
      ]
    },
    {
      id: 6,
      title: 'buffer, conflate и debounce',
      type: 'theory',
      content: [
        { type: 'text', value: 'Операторы управления потоком данных: buffer позволяет producer и consumer работать параллельно, conflate пропускает промежуточные значения, debounce ждёт паузы.' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.flow.*\n\nfun fastProducer(): Flow<Int> = flow {\n    repeat(5) {\n        emit(it)\n        delay(100)\n    }\n}\n\nfun main() = runBlocking {\n    // Без buffer — producer ждёт consumer\n    println("Без buffer:")\n    var start = System.currentTimeMillis()\n    fastProducer().collect {\n        delay(300)  // медленный consumer\n        print("$it ")\n    }\n    println("(${System.currentTimeMillis() - start}мс)")\n\n    // buffer — producer и consumer работают независимо\n    println("\\nС buffer:")\n    start = System.currentTimeMillis()\n    fastProducer()\n        .buffer()\n        .collect {\n            delay(300)\n            print("$it ")\n        }\n    println("(${System.currentTimeMillis() - start}мс)")\n\n    // conflate — пропускает промежуточные значения\n    println("\\nConflate:")\n    fastProducer()\n        .conflate()\n        .collect {\n            delay(300)\n            print("$it ")  // пропустит промежуточные значения\n        }\n    println()\n\n    // debounce — ждёт паузы (для поиска, ввода)\n    println("Debounce (200мс):")\n    flow {\n        emit("к")\n        delay(50)\n        emit("ко")\n        delay(50)\n        emit("код")\n        delay(50)\n        emit("котл")\n        delay(300)  // пауза > 200мс — emit\n        emit("котли")\n        delay(300)\n        emit("kotlin")\n    }\n    .debounce(200)\n    .collect { println("Поиск: $it") }\n}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Поиск с Flow',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй систему поиска товаров с использованием Flow. Создай ProductRepository с методом search(query: Flow<String>): Flow<List<Product>>. Используй debounce(300мс) для избежания лишних запросов, distinctUntilChanged для фильтрации одинаковых запросов, flatMapLatest для отмены предыдущего поиска, onEach для логирования. Протестируй с имитацией ввода пользователя.',
      requirements: [
        'data class Product(id, name, price)',
        'ProductRepository.search принимает Flow<String> поисковых запросов',
        'debounce(300) отсекает быстрые последовательные запросы',
        'distinctUntilChanged не повторяет одинаковые запросы',
        'flatMapLatest отменяет предыдущий поиск при новом запросе',
        'searchProducts(query) — suspend-функция с delay(200) имитации запроса',
        'Вывести найденные товары и количество'
      ],
      expectedOutput: '[LOG] Поиск: "ноут"\nНайдено 1 товаров по запросу "ноут": [Ноутбук]\n[LOG] Поиск: "телеф"\nНайдено 1 товаров по запросу "телеф": [Телефон]\n[LOG] Поиск: ""\nНайдено 5 товаров по запросу "": [Ноутбук, Телефон, Планшет, Мышь, Клавиатура]',
      hint: 'Flow<String> для запросов создай через MutableSharedFlow<String>(). Используй queryFlow.debounce(300).distinctUntilChanged().flatMapLatest { query -> flow { emit(searchProducts(query)) } }. Для теста emit запросы с разными задержками.',
      solution: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.flow.*\n\ndata class Product(val id: Int, val name: String, val price: Double)\n\nval allProducts = listOf(\n    Product(1, "Ноутбук", 75000.0),\n    Product(2, "Телефон", 45000.0),\n    Product(3, "Планшет", 30000.0),\n    Product(4, "Мышь", 1200.0),\n    Product(5, "Клавиатура", 3500.0)\n)\n\nsuspend fun searchProducts(query: String): List<Product> {\n    delay(200)  // имитация сетевого запроса\n    return if (query.isEmpty()) allProducts\n    else allProducts.filter { it.name.lowercase().contains(query.lowercase()) }\n}\n\nfun buildSearchFlow(queryFlow: Flow<String>): Flow<Pair<String, List<Product>>> {\n    return queryFlow\n        .debounce(300)\n        .distinctUntilChanged()\n        .onEach { println("[LOG] Поиск: \\"$it\\"") }\n        .flatMapLatest { query ->\n            flow { emit(query to searchProducts(query)) }\n        }\n}\n\nfun main() = runBlocking {\n    val queryChannel = MutableSharedFlow<String>()\n\n    val searchJob = launch {\n        buildSearchFlow(queryChannel)\n            .collect { (query, results) ->\n                println("Найдено ${results.size} товаров по запросу \\"$query\\": ${results.map { it.name }}")\n            }\n    }\n\n    // Симуляция ввода пользователя\n    launch {\n        // Быстрый ввод — debounce отфильтрует промежуточные\n        queryChannel.emit("н")\n        delay(50)\n        queryChannel.emit("но")\n        delay(50)\n        queryChannel.emit("ноу")\n        delay(50)\n        queryChannel.emit("ноут")\n        delay(600)  // пауза > 300мс\n\n        queryChannel.emit("т")\n        delay(50)\n        queryChannel.emit("те")\n        delay(50)\n        queryChannel.emit("тел")\n        delay(50)\n        queryChannel.emit("телеф")\n        delay(600)\n\n        queryChannel.emit("")\n        delay(600)\n\n        searchJob.cancel()\n    }.join()\n}',
      explanation: 'debounce(300) ждёт 300мс тишины перед обработкой — при быстром вводе "н","но","ноу","ноут" обработается только "ноут". distinctUntilChanged пропускает повторы одного и того же запроса. flatMapLatest отменяет предыдущий поиск если пришёл новый запрос — не тратим ресурсы на устаревшие запросы. Это классический паттерн для поиска с типом-по-типу.'
    }
  ]
}
