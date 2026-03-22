export default {
  id: 23,
  title: 'Корутины: каналы',
  description: 'Каналы (Channel) в Kotlin — механизм передачи данных между корутинами. Изучаем типы каналов, операции send/receive, fan-out и fan-in паттерны.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Channel?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Channel — это примитив взаимодействия между корутинами, аналог BlockingQueue, но для асинхронного кода. Он позволяет одной корутине отправлять данные, а другой — получать их.' },
        { type: 'heading', value: 'Аналогия с трубой' },
        { type: 'text', value: 'Представьте канал как трубу: одна сторона вливает воду (send), другая получает её (receive). Данные текут строго в одну сторону.' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.channels.*\n\nfun main() = runBlocking {\n    val channel = Channel<Int>()\n    launch {\n        for (x in 1..5) channel.send(x * x)\n        channel.close()\n    }\n    for (y in channel) println(y)\n}' },
        { type: 'note', value: 'channel.close() сигнализирует получателю, что данные закончились. Итерация for (y in channel) автоматически завершается при закрытии канала.' }
      ]
    },
    {
      id: 2,
      title: 'Типы каналов по буферу',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Четыре варианта ёмкости канала' },
        { type: 'text', value: 'Канал создаётся с помощью Channel<T>(capacity), где capacity определяет поведение при переполнении.' },
        { type: 'list', value: 'Channel.RENDEZVOUS (0) — отправитель ждёт получателя, нет буфера\nChannel.BUFFERED (64) — буфер на 64 элемента по умолчанию\nChannel.UNLIMITED — неограниченный буфер (осторожно с памятью!)\nChannel.CONFLATED — хранит только последний элемент' },
        { type: 'code', language: 'kotlin', value: 'val rendezvous = Channel<Int>()            // RENDEZVOUS\nval buffered  = Channel<Int>(10)            // буфер 10\nval unlimited = Channel<Int>(Channel.UNLIMITED)\nval conflated = Channel<Int>(Channel.CONFLATED)' },
        { type: 'tip', value: 'CONFLATED полезен для состояния UI: если UI не успевает обрабатывать обновления, промежуточные значения теряются, остаётся только самое свежее.' }
      ]
    },
    {
      id: 3,
      title: 'Produce и consumeEach',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функция produce — удобный строитель (builder) для создания канала-источника. consumeEach — помощник для потребления всех элементов.' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.channels.*\n\nfun CoroutineScope.produceSquares(): ReceiveChannel<Int> = produce {\n    for (x in 1..5) send(x * x)\n}\n\nfun main() = runBlocking {\n    val squares = produceSquares()\n    squares.consumeEach { println(it) }\n}' },
        { type: 'note', value: 'produce автоматически закрывает канал, когда блок завершается — не нужно вызывать close() вручную.' },
        { type: 'text', value: 'ReceiveChannel — интерфейс только для чтения. SendChannel — только для записи. Это позволяет ограничивать доступ к каналу по роли.' }
      ]
    },
    {
      id: 4,
      title: 'Fan-out и Fan-in',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Fan-out: один производитель, несколько потребителей' },
        { type: 'text', value: 'Несколько корутин могут читать из одного канала. Каждый элемент достанется ровно одному потребителю — это удобно для балансировки нагрузки.' },
        { type: 'code', language: 'kotlin', value: 'fun main() = runBlocking {\n    val producer = produce { for (i in 1..10) send(i) }\n    repeat(3) { id ->\n        launch {\n            for (msg in producer) println("Worker $id: $msg")\n        }\n    }\n    delay(1000)\n}' },
        { type: 'heading', value: 'Fan-in: несколько производителей, один потребитель' },
        { type: 'code', language: 'kotlin', value: 'fun main() = runBlocking {\n    val channel = Channel<String>()\n    launch { channel.send("от корутины 1") }\n    launch { channel.send("от корутины 2") }\n    repeat(2) { println(channel.receive()) }\n}' },
        { type: 'tip', value: 'Fan-out хорош для параллельной обработки задач (worker pool). Fan-in — для слияния результатов нескольких источников.' }
      ]
    },
    {
      id: 5,
      title: 'select и каналы',
      type: 'theory',
      content: [
        { type: 'text', value: 'select позволяет ожидать сразу несколько каналов и обработать тот, который первым предоставит данные — аналог select в Go или switch в многопоточном программировании.' },
        { type: 'code', language: 'kotlin', value: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.channels.*\nimport kotlinx.coroutines.selects.*\n\nfun main() = runBlocking {\n    val a = produce { delay(100); send("A") }\n    val b = produce { delay(50);  send("B") }\n    val result = select<String> {\n        a.onReceive { "Получено из A: $it" }\n        b.onReceive { "Получено из B: $it" }\n    }\n    println(result) // Получено из B: B\n}' },
        { type: 'warning', value: 'select выбирает первый готовый канал. Если оба готовы одновременно, выбор случаен. Не используйте select для строгой очерёдности.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: конвейер корутин',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте конвейер (pipeline) из трёх шагов: генератор чисел → фильтр чётных → вывод удвоенных.',
      requirements: [
        'Функция numbers() — produce чисел от 1 до 10',
        'Функция filterEven(input) — produce только чётных чисел из входного канала',
        'В main: получить результат и распечатать каждый элемент * 2'
      ],
      expectedOutput: '4\n8\n12\n16\n20',
      hint: 'Каждый шаг конвейера принимает ReceiveChannel и возвращает ReceiveChannel через produce.',
      solution: 'import kotlinx.coroutines.*\nimport kotlinx.coroutines.channels.*\n\nfun CoroutineScope.numbers() = produce { for (i in 1..10) send(i) }\nfun CoroutineScope.filterEven(src: ReceiveChannel<Int>) = produce {\n    for (x in src) if (x % 2 == 0) send(x)\n}\n\nfun main() = runBlocking {\n    val nums = numbers()\n    val evens = filterEven(nums)\n    evens.consumeEach { println(it * 2) }\n}',
      explanation: 'Каждый шаг конвейера читает из предыдущего канала и пишет в следующий. produce автоматически закрывает канал при выходе из блока.'
    }
  ]
}
