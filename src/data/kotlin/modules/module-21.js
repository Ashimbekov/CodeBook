export default {
  id: 21,
  title: 'Корутины: основы',
  description: 'Введение в корутины Kotlin: suspend-функции, CoroutineScope, launch, async/await, Dispatchers, обработка ошибок и структурированный параллелизм',
  lessons: [
    {
      id: 1,
      title: 'Что такое корутины',
      type: 'theory',
      content: [
        { type: 'text', value: 'Корутина — лёгкая единица конкурентного выполнения. В отличие от потоков, тысячи корутин могут работать на небольшом пуле потоков. Корутины можно приостанавливать (suspend) без блокировки потока.' },
        { type: 'code', language: 'kotlin', value: '// Добавить в build.gradle:\n// implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")\n\nimport kotlinx.coroutines.*\n\nfun main() = runBlocking {  // блокирующий запуск корутины\n    println("Начало: ${Thread.currentThread().name}")\n\n    // launch — запускает корутину, не ожидает результата\n    val job = launch {\n        delay(1000)  // suspend-функция, не блокирует поток\n        println("Корутина завершена: ${Thread.currentThread().name}")\n    }\n\n    println("После launch — выполняется сразу")\n    job.join()  // ждём завершения корутины\n    println("Всё готово")\n}\n// Начало: main\n// После launch — выполняется сразу\n// (через ~1 секунду)\n// Корутина завершена: main\n// Всё готово' },
        { type: 'tip', value: 'delay() — это suspend-функция. Она приостанавливает корутину, освобождает поток для других задач, и возобновляет корутину через указанное время. В отличие от Thread.sleep() — не блокирует поток.' },
        { type: 'heading', value: 'Корутины vs потоки' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\n\nfun main() = runBlocking {\n    // Запускаем 100 000 корутин — легко!\n    val jobs = (1..100_000).map {\n        launch {\n            delay(1000)\n        }\n    }\n    jobs.forEach { it.join() }\n    println("100 000 корутин завершены за ~1 секунду")\n    // 100 000 потоков — OutOfMemoryError!\n}' },
        { type: 'note', value: 'runBlocking блокирует текущий поток до завершения всех корутин внутри. Используется для входной точки (main) или в тестах. В реальном коде лучше использовать CoroutineScope.' }
      ]
    },
    {
      id: 2,
      title: 'suspend-функции',
      type: 'theory',
      content: [
        { type: 'text', value: 'suspend — ключевое слово, которое помечает функцию как "приостанавливаемую". Suspend-функция может вызывать другие suspend-функции и содержать точки приостановки.' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\n\n// suspend-функция — может быть приостановлена\nsuspend fun fetchUserName(id: Int): String {\n    delay(500)  // симуляция сетевого запроса\n    return "Пользователь_$id"\n}\n\nsuspend fun fetchUserEmail(name: String): String {\n    delay(300)  // симуляция запроса\n    return "${name.lowercase().replace(" ", "_")}@mail.ru"\n}\n\nsuspend fun loadUserProfile(id: Int): String {\n    val name = fetchUserName(id)    // последовательно\n    val email = fetchUserEmail(name) // ждёт завершения fetchUserName\n    return "Профиль: $name ($email)"\n}\n\nfun main() = runBlocking {\n    val start = System.currentTimeMillis()\n    val profile = loadUserProfile(42)\n    val elapsed = System.currentTimeMillis() - start\n    println(profile)  // Профиль: Пользователь_42 (пользователь_42@mail.ru)\n    println("Время: ~${elapsed}мс")  // ~800мс (500+300)\n}' },
        { type: 'warning', value: 'suspend-функцию можно вызывать только из другой suspend-функции или корутины. Попытка вызвать напрямую из обычного кода — ошибка компиляции.' },
        { type: 'code', language: 'kotlin', value: '// suspend-функции как обычные функции — нет асинхронности по умолчанию\n// Они просто могут содержать точки приостановки\n\nsuspend fun computeSum(list: List<Int>): Int {\n    var sum = 0\n    for (item in list) {\n        sum += item\n        // yield() — явная точка приостановки, позволяет другим корутинам поработать\n        if (item % 100 == 0) yield()\n    }\n    return sum\n}' }
      ]
    },
    {
      id: 3,
      title: 'launch и Job',
      type: 'theory',
      content: [
        { type: 'text', value: 'launch запускает корутину и возвращает Job — объект для управления жизненным циклом корутины. Job можно ждать, отменять, проверять его состояние.' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\n\nfun main() = runBlocking {\n    // Простой launch\n    val job1 = launch {\n        repeat(5) { i ->\n            println("Корутина: шаг $i")\n            delay(200)\n        }\n    }\n\n    delay(500)  // даём поработать немного\n    println("job1 активен: ${job1.isActive}")\n    job1.cancel()  // отменяем\n    println("job1 отменён: ${job1.isCancelled}")\n\n    // join — ожидание завершения\n    val job2 = launch {\n        delay(300)\n        println("job2 завершена")\n    }\n    job2.join()  // ждём\n    println("После join")\n\n    // Несколько корутин параллельно\n    val jobs = List(3) { i ->\n        launch {\n            delay((i + 1) * 100L)\n            println("Задача $i завершена")\n        }\n    }\n    jobs.joinAll()  // ждём все\n    println("Все задачи завершены")\n}' },
        { type: 'heading', value: 'Отмена корутин' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\n\nsuspend fun longTask(name: String) {\n    try {\n        repeat(10) { i ->\n            println("$name: шаг $i")\n            delay(100)  // точка отмены — delay проверяет CancellationException\n        }\n    } finally {\n        println("$name: очистка ресурсов")  // выполнится при отмене\n    }\n}\n\nfun main() = runBlocking {\n    val job = launch { longTask("Задача") }\n    delay(350)\n    job.cancel()\n    job.join()\n    println("Главная корутина завершена")\n}' }
      ]
    },
    {
      id: 4,
      title: 'async и Deferred',
      type: 'theory',
      content: [
        { type: 'text', value: 'async запускает корутину и возвращает Deferred<T> — отложенное значение. await() приостанавливает корутину до получения результата. Главное преимущество — параллельное выполнение нескольких задач.' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\n\nsuspend fun fetchPrice(product: String): Double {\n    delay(500)  // запрос к API\n    return when (product) {\n        "Ноутбук" -> 75000.0\n        "Телефон" -> 45000.0\n        else -> 0.0\n    }\n}\n\nsuspend fun fetchStock(product: String): Int {\n    delay(400)  // другой запрос\n    return when (product) {\n        "Ноутбук" -> 5\n        "Телефон" -> 12\n        else -> 0\n    }\n}\n\nfun main() = runBlocking {\n    val product = "Ноутбук"\n\n    // Последовательно — медленно (900мс)\n    val start1 = System.currentTimeMillis()\n    val price1 = fetchPrice(product)\n    val stock1 = fetchStock(product)\n    println("Последовательно: ${System.currentTimeMillis() - start1}мс")\n\n    // Параллельно через async — быстро (~500мс)\n    val start2 = System.currentTimeMillis()\n    val priceDeferred = async { fetchPrice(product) }\n    val stockDeferred = async { fetchStock(product) }\n    val price2 = priceDeferred.await()\n    val stock2 = stockDeferred.await()\n    println("Параллельно: ${System.currentTimeMillis() - start2}мс")\n    println("$product: $price2 руб., $stock2 шт.")\n\n    // coroutineScope + async — структурированный параллелизм\n    suspend fun getProductInfo(name: String): String = coroutineScope {\n        val price = async { fetchPrice(name) }\n        val stock = async { fetchStock(name) }\n        "$name: ${price.await()} руб., ${stock.await()} шт."\n    }\n    println(getProductInfo("Телефон"))\n}' },
        { type: 'tip', value: 'Используй async { }.await() для параллельного выполнения нескольких независимых задач. Это один из самых мощных паттернов корутин.' }
      ]
    },
    {
      id: 5,
      title: 'Dispatchers и контекст',
      type: 'theory',
      content: [
        { type: 'text', value: 'Dispatcher определяет, в каком потоке или пуле потоков выполняется корутина. CoroutineContext включает Dispatcher, Job и другие элементы.' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\n\nfun main() = runBlocking {\n    // Dispatchers.Default — пул потоков для CPU-интенсивных задач\n    launch(Dispatchers.Default) {\n        println("Default: ${Thread.currentThread().name}")\n    }\n\n    // Dispatchers.IO — пул для IO-операций (файлы, сеть)\n    launch(Dispatchers.IO) {\n        println("IO: ${Thread.currentThread().name}")\n    }\n\n    // Dispatchers.Unconfined — запускается в текущем потоке\n    launch(Dispatchers.Unconfined) {\n        println("Unconfined начало: ${Thread.currentThread().name}")\n        delay(100)\n        println("Unconfined после delay: ${Thread.currentThread().name}")\n    }\n\n    // withContext — переключение потока внутри корутины\n    launch {\n        val result = withContext(Dispatchers.Default) {\n            // Тяжёлые вычисления\n            (1..1_000_000).sum()\n        }\n        println("Вычислено: $result")  // вернулись в исходный контекст\n    }\n\n    delay(500)\n}' },
        { type: 'list', items: [
          'Dispatchers.Main — главный поток (Android/UI). Недоступен без зависимостей на JVM',
          'Dispatchers.Default — пул по количеству CPU ядер. Для вычислений',
          'Dispatchers.IO — большой пул (до 64 потоков). Для блокирующих IO-операций',
          'Dispatchers.Unconfined — не ограничен конкретным потоком'
        ]}
      ]
    },
    {
      id: 6,
      title: 'Обработка ошибок в корутинах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Исключения в корутинах распространяются по иерархии корутин. launch использует CoroutineExceptionHandler, async — исключение при вызове await().' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\n\nfun main() = runBlocking {\n    // try-catch в корутине\n    launch {\n        try {\n            delay(100)\n            throw RuntimeException("Ошибка в корутине")\n        } catch (e: RuntimeException) {\n            println("Поймано: ${e.message}")\n        }\n    }.join()\n\n    // CoroutineExceptionHandler — для launch\n    val handler = CoroutineExceptionHandler { _, exception ->\n        println("Handler: ${exception.message}")\n    }\n    launch(handler) {\n        throw IllegalStateException("Необработанная ошибка")\n    }.join()\n\n    // async — исключение при await()\n    val deferred = async {\n        delay(100)\n        throw RuntimeException("Ошибка в async")\n        "результат"\n    }\n    try {\n        deferred.await()\n    } catch (e: RuntimeException) {\n        println("Async ошибка: ${e.message}")\n    }\n\n    // supervisorScope — дочерние корутины изолированы\n    supervisorScope {\n        val child1 = launch {\n            throw RuntimeException("child1 упал")\n        }\n        val child2 = launch {\n            delay(200)\n            println("child2 завершён успешно")  // выполнится несмотря на падение child1\n        }\n        child1.join()\n        child2.join()\n    }\n}' },
        { type: 'note', value: 'supervisorScope — дочерние корутины независимы: падение одной не отменяет остальные. В обычном coroutineScope падение одной дочерней отменяет все остальные и родительскую.' }
      ]
    },
    {
      id: 7,
      title: 'CoroutineScope и структурированный параллелизм',
      type: 'theory',
      content: [
        { type: 'text', value: 'Структурированный параллелизм — корутины организованы в иерархию. Родитель не завершится, пока не завершатся все дочерние. Если родитель отменён — отменяются все дочерние.' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\n\nclass UserRepository {\n    // Создаём свой scope для управления жизненным циклом\n    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())\n\n    fun loadUserAsync(id: Int, onResult: (String) -> Unit) {\n        scope.launch {\n            delay(200)  // имитация IO\n            onResult("Пользователь_$id")\n        }\n    }\n\n    fun cancel() {\n        scope.cancel()  // отменяет все корутины в scope\n    }\n}\n\nfun main() = runBlocking {\n    // coroutineScope — ждёт всех дочерних\n    coroutineScope {\n        val task1 = launch {\n            delay(200)\n            println("task1 завершена")\n        }\n        val task2 = launch {\n            delay(100)\n            println("task2 завершена")\n        }\n        // Обе task выполняются параллельно\n    }  // выходим только когда обе завершены\n    println("Все задачи завершены")\n\n    // withTimeout — таймаут\n    try {\n        withTimeout(300) {\n            delay(500)  // превышает таймаут\n            println("Это не выполнится")\n        }\n    } catch (e: TimeoutCancellationException) {\n        println("Таймаут!")  // TimeoutCancellationException\n    }\n\n    // withTimeoutOrNull — без исключения\n    val result = withTimeoutOrNull(300) {\n        delay(100)\n        "Результат получен вовремя"\n    }\n    println(result ?: "Таймаут")  // Результат получен вовремя\n}' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Параллельная загрузка данных',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй систему загрузки данных с несколькими источниками. Suspend-функции: loadUser(id), loadOrders(userId), loadRecommendations(userId) — каждая с разной задержкой. Загрузи данные параллельно через async, обработай ошибки, добавь таймаут 2 секунды. Выведи полный профиль пользователя.',
      requirements: [
        'data class UserProfile(user, orders, recommendations)',
        'loadUser задержка 300мс, loadOrders 400мс, loadRecommendations 200мс',
        'loadUser бросает исключение для id < 0',
        'Параллельная загрузка через async/await',
        'Общий таймаут 2 секунды через withTimeoutOrNull',
        'Обработка ошибок через try-catch или runCatching'
      ],
      expectedOutput: 'Загружаем профиль для ID=1...\nЗагрузка заняла ~400мс\nПользователь: Анна (id=1)\nЗаказы: [Заказ_1, Заказ_2, Заказ_3]\nРекомендации: [Товар_A, Товар_B]\n---\nОшибка для ID=-1: Пользователь не найден',
      hint: 'Используй coroutineScope { } внутри suspend-функции loadProfile чтобы запустить все три async параллельно. Оберни в withTimeoutOrNull(2000) снаружи. Для ошибок — try-catch вокруг await().',
      solution: 'import kotlinx.coroutines.*\n\ndata class UserProfile(\n    val user: String,\n    val orders: List<String>,\n    val recommendations: List<String>\n)\n\nsuspend fun loadUser(id: Int): String {\n    delay(300)\n    if (id < 0) throw IllegalArgumentException("Пользователь не найден")\n    return "Анна (id=$id)"\n}\n\nsuspend fun loadOrders(userId: Int): List<String> {\n    delay(400)\n    return listOf("Заказ_1", "Заказ_2", "Заказ_3")\n}\n\nsuspend fun loadRecommendations(userId: Int): List<String> {\n    delay(200)\n    return listOf("Товар_A", "Товар_B")\n}\n\nsuspend fun loadProfile(id: Int): UserProfile = coroutineScope {\n    val userDeferred = async { loadUser(id) }\n    val ordersDeferred = async { loadOrders(id) }\n    val recsDeferred = async { loadRecommendations(id) }\n    UserProfile(\n        user = userDeferred.await(),\n        orders = ordersDeferred.await(),\n        recommendations = recsDeferred.await()\n    )\n}\n\nfun main() = runBlocking {\n    println("Загружаем профиль для ID=1...")\n    val start = System.currentTimeMillis()\n    val profile = withTimeoutOrNull(2000) {\n        loadProfile(1)\n    }\n    println("Загрузка заняла ~${System.currentTimeMillis() - start}мс")\n    if (profile != null) {\n        println("Пользователь: ${profile.user}")\n        println("Заказы: ${profile.orders}")\n        println("Рекомендации: ${profile.recommendations}")\n    } else {\n        println("Таймаут!")\n    }\n\n    println("---")\n    try {\n        loadProfile(-1)\n    } catch (e: IllegalArgumentException) {\n        println("Ошибка для ID=-1: ${e.message}")\n    }\n}',
      explanation: 'coroutineScope { } запускает дочерние корутины и ждёт их все. Три async запускаются параллельно, суммарное время ~400мс (максимум из 300, 400, 200). withTimeoutOrNull возвращает null вместо исключения при таймауте. Исключение в одном async при .await() распространяется в родительский scope — поэтому try-catch снаружи loadProfile поймает ошибку из loadUser.'
    }
  ]
}
