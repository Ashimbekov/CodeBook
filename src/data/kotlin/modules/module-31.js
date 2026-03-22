export default {
  id: 31,
  title: 'Практикум: Корутины',
  description: 'Практические задачи по корутинам Kotlin: launch, async, Flow, Channel, обработка ошибок и отмена.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Параллельные запросы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Загрузите данные двух пользователей параллельно с помощью async/await. Каждый запрос занимает 1 секунду, суммарное время должно быть ~1 секунду.',
      requirements: [
        'suspend fun loadUser(id: Int): String — задержка 1000ms, возвращает "Пользователь $id"',
        'Запустить два запроса параллельно через async',
        'Вывести оба результата',
        'Время выполнения ~1 секунда, не ~2'
      ],
      expectedOutput: 'Пользователь 1\nПользователь 2\nВремя: ~1000ms',
      hint: 'val d1 = async { loadUser(1) }; val d2 = async { loadUser(2) }; затем d1.await() и d2.await().',
      solution: 'import kotlinx.coroutines.*\n\nsuspend fun loadUser(id: Int): String {\n    delay(1000)\n    return "Пользователь $id"\n}\n\nfun main() = runBlocking {\n    val start = System.currentTimeMillis()\n    val d1 = async { loadUser(1) }\n    val d2 = async { loadUser(2) }\n    println(d1.await())\n    println(d2.await())\n    println("Время: ${System.currentTimeMillis() - start}ms")\n}',
      explanation: 'async запускает корутину и возвращает Deferred. await() ожидает результат. Оба async запускаются до первого await, поэтому выполняются параллельно.'
    },
    {
      id: 2,
      title: 'Задача: Таймаут запроса',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте функцию загрузки с таймаутом: если suspend-функция не завершилась за 2 секунды — вернуть "Таймаут".',
      requirements: [
        'suspend fun slowOperation(): String — задержка 5 секунд',
        'withTimeoutOrNull(2000) { slowOperation() } — таймаут 2 секунды',
        'Вывести результат или "Таймаут" если null'
      ],
      expectedOutput: 'Таймаут',
      hint: 'withTimeoutOrNull возвращает null при превышении таймаута. ?: "Таймаут" даёт дефолтное значение.',
      solution: 'import kotlinx.coroutines.*\n\nsuspend fun slowOperation(): String {\n    delay(5000)\n    return "Данные получены"\n}\n\nfun main() = runBlocking {\n    val result = withTimeoutOrNull(2000) {\n        slowOperation()\n    } ?: "Таймаут"\n    println(result)\n}',
      explanation: 'withTimeoutOrNull отменяет корутину по истечении времени и возвращает null. withTimeout (без OrNull) бросает TimeoutCancellationException.'
    },
    {
      id: 3,
      title: 'Задача: Flow с трансформацией',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Flow, который генерирует числа 1-10, фильтрует чётные, умножает на 10 и собирает в список.',
      requirements: [
        'flow { } генерирует числа 1..10 с emit',
        '.filter { it % 2 == 0 }',
        '.map { it * 10 }',
        '.toList() собирает результат',
        'Результат: [20, 40, 60, 80, 100]'
      ],
      expectedOutput: '[20, 40, 60, 80, 100]',
      hint: 'Цепочка: flow { for (i in 1..10) emit(i) }.filter { }.map { }.toList()',
      solution: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.flow.*\n\nfun main() = runBlocking {\n    val result = flow {\n        for (i in 1..10) emit(i)\n    }\n    .filter { it % 2 == 0 }\n    .map { it * 10 }\n    .toList()\n    println(result)\n}',
      explanation: 'Flow — холодный поток: начинает выдавать элементы только при подписке (collect/toList). Операторы filter и map ленивы — обрабатывают элемент за элементом.'
    },
    {
      id: 4,
      title: 'Задача: StateFlow для UI',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте ViewModel-подобный класс с MutableStateFlow. Поток счётчика должен обновляться при вызове increment() и быть доступен как StateFlow.',
      requirements: [
        'private val _count = MutableStateFlow(0)',
        'val count: StateFlow<Int> = _count.asStateFlow()',
        'suspend fun increment() увеличивает значение',
        'Собрать первые 4 значения через take(4).collect'
      ],
      expectedOutput: '0\n1\n2\n3',
      hint: 'launch { repeat(3) { counterVm.increment(); delay(100) } }',
      solution: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.flow.*\n\nclass CounterViewModel {\n    private val _count = MutableStateFlow(0)\n    val count: StateFlow<Int> = _count.asStateFlow()\n    fun increment() { _count.value++ }\n}\n\nfun main() = runBlocking {\n    val vm = CounterViewModel()\n    launch {\n        repeat(3) { vm.increment(); delay(50) }\n    }\n    vm.count.take(4).collect { println(it) }\n}',
      explanation: 'StateFlow хранит последнее значение и сразу выдаёт его новым подписчикам (replay=1). asStateFlow() делает поток read-only. take(4) завершает коллекцию после 4 элементов.'
    },
    {
      id: 5,
      title: 'Задача: Обработка ошибок в корутинах',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите программу, где одна из трёх параллельных корутин выбрасывает исключение. Используйте SupervisorScope чтобы остальные не упали.',
      requirements: [
        'supervisorScope { } вместо coroutineScope',
        'Три async-корутины: первая — OK, вторая — Exception, третья — OK',
        'Обработать исключение второй через try-catch на await()',
        'Вывести результаты первой и третьей'
      ],
      expectedOutput: 'Результат 1\nОшибка: Что-то пошло не так\nРезультат 3',
      hint: 'Оберните d2.await() в try { } catch (e: Exception) { println("Ошибка: ${e.message}") }',
      solution: 'import kotlinx.coroutines.*\n\nfun main() = runBlocking {\n    supervisorScope {\n        val d1 = async { delay(100); "Результат 1" }\n        val d2 = async { delay(100); throw RuntimeException("Что-то пошло не так") }\n        val d3 = async { delay(100); "Результат 3" }\n        println(d1.await())\n        try { println(d2.await()) } catch (e: Exception) { println("Ошибка: ${e.message}") }\n        println(d3.await())\n    }\n}',
      explanation: 'В supervisorScope падение одной дочерней корутины не отменяет остальных (в отличие от coroutineScope). Исключение "поглощается" при await() в try-catch.'
    },
    {
      id: 6,
      title: 'Задача: Канал-производитель',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте producer корутину, генерирующую квадраты чисел, и три consumer корутины, обрабатывающие их параллельно (fan-out).',
      requirements: [
        'produce { for (i in 1..9) send(i * i) } генерирует 9 квадратов',
        'Три launch-корутины читают из одного канала',
        'Каждый consumer печатает: "Worker X получил: Y"',
        'Все 9 элементов распределяются между тремя workers'
      ],
      expectedOutput: 'Worker 0 получил: 1\nWorker 1 получил: 4\n... (9 строк суммарно)',
      hint: 'for (item in channel) в каждом launch. Канал distribute между корутинами автоматически.',
      solution: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.channels.*\n\nfun main() = runBlocking {\n    val channel = produce { for (i in 1..9) send(i * i) }\n    val jobs = List(3) { id ->\n        launch {\n            for (item in channel) println("Worker $id получил: $item")\n        }\n    }\n    jobs.forEach { it.join() }\n}',
      explanation: 'produce — удобный строитель канала. Fan-out: несколько корутин читают из одного канала. Каждый send доставляется ровно одному reader.'
    },
    {
      id: 7,
      title: 'Задача: Retry с экспоненциальным откатом',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите suspend-функцию retryWithBackoff, которая повторяет операцию до maxRetries раз с задержкой, удваивающейся на каждой попытке.',
      requirements: [
        'retryWithBackoff(maxRetries: Int, initialDelay: Long, block: suspend () -> T): T',
        'Начальная задержка initialDelay ms, каждый раз умножать на 2',
        'Если все попытки неудачны — выбросить последнее исключение',
        'Протестировать: функция падает 2 раза, потом успешно'
      ],
      expectedOutput: 'Попытка 1 (задержка 100ms)\nПопытка 2 (задержка 200ms)\nПопытка 3 — успех: Готово',
      hint: 'var delay = initialDelay. В цикле repeat(maxRetries): try { return block() } catch (e) { delay(delay); delay *= 2 }',
      solution: 'import kotlinx.coroutines.*\n\nsuspend fun <T> retryWithBackoff(maxRetries: Int, initialDelay: Long, block: suspend () -> T): T {\n    var currentDelay = initialDelay\n    var lastException: Exception? = null\n    repeat(maxRetries) { attempt ->\n        try {\n            return block()\n        } catch (e: Exception) {\n            lastException = e\n            println("Попытка ${attempt + 1} неудачна, ждём ${currentDelay}ms")\n            delay(currentDelay)\n            currentDelay *= 2\n        }\n    }\n    throw lastException!!\n}\n\nfun main() = runBlocking {\n    var attempts = 0\n    val result = retryWithBackoff(3, 100) {\n        attempts++\n        if (attempts < 3) throw RuntimeException("Ошибка")\n        "Готово"\n    }\n    println("Успех: $result")\n}',
      explanation: 'Экспоненциальный откат снижает нагрузку на сервер при повторных запросах. delay(currentDelay) — suspend, не блокирует поток. return в блоке try завершает функцию немедленно при успехе.'
    },
    {
      id: 8,
      title: 'Задача: Отмена корутины',
      type: 'practice',
      difficulty: 'medium',
      description: 'Запустите корутину с бесконечным циклом и отмените её через 500ms. Убедитесь, что CancellationException обрабатывается корректно в finally.',
      requirements: [
        'launch { while(true) { delay(100); println("tick") } }',
        'delay(500) в основной корутине',
        'job.cancel() отменяет корутину',
        'job.join() ждёт завершения',
        'Использовать try-finally для cleanup'
      ],
      expectedOutput: 'tick\ntick\ntick\ntick\nКорутина завершена (cleanup)',
      hint: 'try { while(true) { delay(100); println("tick") } } finally { println("Корутина завершена (cleanup)") }',
      solution: 'import kotlinx.coroutines.*\n\nfun main() = runBlocking {\n    val job = launch {\n        try {\n            while (true) {\n                delay(100)\n                println("tick")\n            }\n        } finally {\n            println("Корутина завершена (cleanup)")\n        }\n    }\n    delay(500)\n    job.cancel()\n    job.join()\n}',
      explanation: 'delay() — точка отмены (cancellation point). При cancel() в следующем delay() будет выброшен CancellationException. finally выполнится даже при отмене — там освобождайте ресурсы.'
    },
    {
      id: 9,
      title: 'Задача: Flow.combine',
      type: 'practice',
      difficulty: 'hard',
      description: 'Объедините два Flow — имени и возраста пользователя — в один Flow<String> вида "Имя, возраст лет" с помощью combine.',
      requirements: [
        'nameFlow: Flow<String> — выдаёт "Алибек", "Жанар", "Дамир" с задержками',
        'ageFlow: Flow<Int> — выдаёт 25, 30, 22 с задержками',
        'combine(nameFlow, ageFlow) { name, age -> "$name, $age лет" }',
        'Собрать и вывести результаты'
      ],
      expectedOutput: 'Алибек, 25 лет\nЖанар, 30 лет\nДамир, 22 лет (порядок может отличаться)',
      hint: 'combine выдаёт новое значение при обновлении любого из потоков, используя последнее значение другого.',
      solution: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.flow.*\n\nfun main() = runBlocking {\n    val nameFlow = flow {\n        listOf("Алибек" to 0L, "Жанар" to 200L, "Дамир" to 100L).forEach { (name, d) ->\n            delay(d); emit(name)\n        }\n    }\n    val ageFlow = flow {\n        listOf(25 to 100L, 30 to 200L, 22 to 50L).forEach { (age, d) ->\n            delay(d); emit(age)\n        }\n    }\n    combine(nameFlow, ageFlow) { name, age -> "$name, $age лет" }\n        .collect { println(it) }\n}',
      explanation: 'combine выдаёт значение при каждом обновлении любого из потоков, комбинируя с последним значением другого. Это отличает его от zip, который ждёт пары.'
    },
    {
      id: 10,
      title: 'Задача: Семафор для ограничения параллелизма',
      type: 'practice',
      difficulty: 'hard',
      description: 'Используйте Semaphore для ограничения одновременно выполняющихся корутин. Запустите 10 задач, но не более 3 одновременно.',
      requirements: [
        'val semaphore = Semaphore(3)',
        '10 корутин через launch',
        'Каждая: semaphore.withPermit { delay(200); println("Задача $id завершена") }',
        'Первые 3 стартуют сразу, остальные ждут'
      ],
      expectedOutput: 'Задачи 0,1,2 стартуют одновременно, затем следующие порциями по 3',
      hint: 'import kotlinx.coroutines.sync.Semaphore. withPermit — acquire + use + release.',
      solution: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.sync.Semaphore\nimport kotlinx.coroutines.sync.withPermit\n\nfun main() = runBlocking {\n    val semaphore = Semaphore(3)\n    val jobs = (0 until 10).map { id ->\n        launch {\n            semaphore.withPermit {\n                println("Задача $id начата")\n                delay(200)\n                println("Задача $id завершена")\n            }\n        }\n    }\n    jobs.forEach { it.join() }\n}',
      explanation: 'Semaphore(3) разрешает не более 3 одновременных владельцев разрешения. withPermit атомарно захватывает разрешение, выполняет блок и освобождает — даже если блок выбрасывает исключение.'
    }
  ]
}
