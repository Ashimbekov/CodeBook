export default {
  id: 37,
  title: 'Каналы (channels)',
  description: 'Концепция каналов, создание, отправка и получение, направления каналов, закрытие, range, дедлоки',
  lessons: [
    {
      id: 1,
      title: 'Что такое канал?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Канал (channel) — это типизированный конвейер, через который горутины могут отправлять и получать значения. Философия Go: "Не общайтесь через разделяемую память — разделяйте память через общение." Каналы — это и есть то самое "общение".' },
        { type: 'text', value: 'Представьте трубу между двумя людьми. Один кладёт сообщение в трубу, другой берёт из неё. Они не видят друг друга, не блокируют друг друга — просто обмениваются через трубу.' },
        { type: 'heading', value: 'Создание канала' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // make(chan ТИП) — создаёт небуферизованный канал\n    ch := make(chan int)     // канал целых чисел\n    done := make(chan bool)  // канал булевых значений\n    messages := make(chan string) // канал строк\n\n    // Нулевое значение канала — nil\n    var nilChan chan int // nil\n    fmt.Println(nilChan == nil) // true\n    // Отправка/получение из nil канала блокируется вечно!\n\n    // Закрытие канала (подробнее позже)\n    close(ch)\n    _ = done\n    _ = messages\n}' },
        { type: 'note', value: 'Каналы — это ссылочный тип, как maps и slices. Передача канала в функцию не копирует его — функция работает с тем же каналом.' }
      ]
    },
    {
      id: 2,
      title: 'Отправка и получение — операторы <- ',
      type: 'theory',
      content: [
        { type: 'text', value: 'Оператор <- используется для отправки и получения значений. Направление стрелки показывает направление потока данных: ch <- val отправляет в канал, val <- ch получает из канала.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\nfunc producer(ch chan<- int) {\n    for i := 1; i <= 5; i++ {\n        ch <- i // отправка значения в канал\n        fmt.Println("отправлено:", i)\n    }\n    close(ch) // сигнализируем что данные закончились\n}\n\nfunc main() {\n    ch := make(chan int)\n\n    go producer(ch) // запускаем производителя в горутине\n\n    // Получение значений из канала\n    for {\n        val, ok := <-ch // ok=false если канал закрыт и пуст\n        if !ok {\n            break\n        }\n        fmt.Println("получено:", val)\n    }\n}' },
        { type: 'heading', value: 'Блокирующая природа небуферизованного канала' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    ch := make(chan string)\n\n    // Отправитель блокируется пока получатель не готов принять\n    go func() {\n        fmt.Println("горутина: готовлю сообщение")\n        ch <- "привет" // блокируется до тех пор пока main не прочитает\n        fmt.Println("горутина: сообщение доставлено")\n    }()\n\n    fmt.Println("main: жду сообщение")\n    msg := <-ch // блокируется пока горутина не отправит\n    fmt.Println("main: получено:", msg)\n\n    // Вывод:\n    // main: жду сообщение\n    // горутина: готовлю сообщение\n    // горутина: сообщение доставлено\n    // main: получено: привет\n}' },
        { type: 'text', value: 'Небуферизованный канал — это рандеву: отправитель и получатель должны встретиться одновременно. Отправитель ждёт получателя, получатель ждёт отправителя. Это фундаментальный механизм синхронизации.' }
      ]
    },
    {
      id: 3,
      title: 'Направленные каналы — chan<- и <-chan',
      type: 'theory',
      content: [
        { type: 'text', value: 'Go позволяет указывать направление канала в сигнатуре функции. Это делает код самодокументирующимся и позволяет компилятору поймать ошибки. Это как разметка дороги: стрелка показывает кому и в каком направлении двигаться.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\n// chan<- int — только для отправки (send-only)\nfunc send(ch chan<- int, value int) {\n    ch <- value\n    // val := <-ch // ОШИБКА КОМПИЛЯЦИИ: invalid operation\n}\n\n// <-chan int — только для получения (receive-only)\nfunc receive(ch <-chan int) int {\n    return <-ch\n    // ch <- 42 // ОШИБКА КОМПИЛЯЦИИ: invalid operation\n}\n\n// chan int — двунаправленный (в main обычно создаём такой)\nfunc main() {\n    ch := make(chan int) // двунаправленный\n\n    // Двунаправленный можно передать куда угодно\n    go send(ch, 42)     // ch автоматически конвертируется в chan<-\n    val := receive(ch)  // и в <-chan\n\n    fmt.Println(val) // 42\n}' },
        { type: 'heading', value: 'Практическое применение направлений' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\n// generator возвращает канал только для чтения\n// Вызывающий код не может ни закрыть канал, ни записать в него\nfunc generateNumbers(max int) <-chan int {\n    ch := make(chan int)\n    go func() {\n        for i := 1; i <= max; i++ {\n            ch <- i\n        }\n        close(ch) // закрываем внутри — снаружи это невозможно\n    }()\n    return ch // возвращаем как <-chan\n}\n\nfunc main() {\n    numbers := generateNumbers(5)\n    // numbers — только для чтения, случайно не закроешь\n    for n := range numbers {\n        fmt.Println(n)\n    }\n}' },
        { type: 'tip', value: 'Используйте направленные каналы в сигнатурах функций — это API-документация. Если функция только читает, тип параметра <-chan. Если только пишет — chan<-. Компилятор проверит корректность использования.' }
      ]
    },
    {
      id: 4,
      title: 'Закрытие канала — close()',
      type: 'theory',
      content: [
        { type: 'text', value: 'close(ch) закрывает канал, сигнализируя получателям что данные закончились. Это как последнее письмо: получателю известно, что новых писем не будет.' },
        { type: 'heading', value: 'Правила закрытия каналов' },
        { type: 'list', items: [
          'Закрывает ОТПРАВИТЕЛЬ, не получатель',
          'Закрывать можно только один раз (повторное закрытие — panic)',
          'Отправка в закрытый канал — panic',
          'Получение из закрытого канала немедленно возвращает нулевое значение + false',
          'Закрытый канал можно читать — получите нулевые значения с ok=false'
        ]},
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    ch := make(chan int, 3)\n    ch <- 1\n    ch <- 2\n    ch <- 3\n    close(ch)\n\n    // Читаем до исчерпания канала\n    for {\n        val, ok := <-ch\n        if !ok {\n            fmt.Println("канал закрыт")\n            break\n        }\n        fmt.Println(val) // 1, 2, 3\n    }\n\n    // После закрытия: получаем нулевое значение и ok=false\n    val, ok := <-ch\n    fmt.Println(val, ok) // 0 false\n\n    // Отправка в закрытый канал — PANIC!\n    // ch <- 4 // panic: send on closed channel\n}' },
        { type: 'heading', value: 'Проверка без паники' },
        { type: 'code', language: 'go', value: '// НЕ СУЩЕСТВУЕТ безопасного способа проверить, закрыт ли канал\n// до попытки отправки. Единственный безопасный способ:\n\n// defer recover() при отправке в потенциально закрытый канал\nfunc safeSend(ch chan<- int, val int) (closed bool) {\n    defer func() {\n        if r := recover(); r != nil {\n            closed = true\n        }\n    }()\n    ch <- val\n    return false\n}' }
      ]
    },
    {
      id: 5,
      title: 'Range по каналу',
      type: 'theory',
      content: [
        { type: 'text', value: 'for range по каналу автоматически читает значения пока канал не закрыт и не опустеет. Это элегантный способ обработки потока данных — не нужно вручную проверять ok.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc ticker(interval time.Duration, count int) <-chan time.Time {\n    ch := make(chan time.Time)\n    go func() {\n        for i := 0; i < count; i++ {\n            time.Sleep(interval)\n            ch <- time.Now()\n        }\n        close(ch) // ВАЖНО: без close range будет ждать вечно!\n    }()\n    return ch\n}\n\nfunc main() {\n    // range по каналу — читает до закрытия\n    for t := range ticker(100*time.Millisecond, 3) {\n        fmt.Println("тик:", t.Format("15:04:05.000"))\n    }\n    fmt.Println("ticker завершён")\n}' },
        { type: 'heading', value: 'Pipeline через range' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\n// Генератор чисел\nfunc generate(nums ...int) <-chan int {\n    out := make(chan int)\n    go func() {\n        for _, n := range nums {\n            out <- n\n        }\n        close(out)\n    }()\n    return out\n}\n\n// Квадрат каждого числа\nfunc square(in <-chan int) <-chan int {\n    out := make(chan int)\n    go func() {\n        for n := range in { // читаем пока не закроют\n            out <- n * n\n        }\n        close(out) // закрываем когда входной закрыт\n    }()\n    return out\n}\n\nfunc main() {\n    // Пайплайн: generate -> square -> print\n    nums := generate(2, 3, 4, 5)\n    squares := square(nums)\n\n    for sq := range squares {\n        fmt.Println(sq) // 4, 9, 16, 25\n    }\n}' },
        { type: 'warning', value: 'for range по каналу блокируется вечно если канал никогда не закрывается! Всегда закрывайте канал в горутине-отправителе после отправки всех данных.' }
      ]
    },
    {
      id: 6,
      title: 'Дедлоки — взаимная блокировка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Дедлок (deadlock) — ситуация когда все горутины заблокированы и не могут продолжить работу. Go runtime обнаруживает полные дедлоки и завершает программу с сообщением об ошибке. Это как дорожная пробка: каждая машина ждёт чтобы двинулась другая.' },
        { type: 'heading', value: 'Классические дедлоки' },
        { type: 'code', language: 'go', value: '// ДЕДЛОК 1: отправка без получателя\nfunc deadlock1() {\n    ch := make(chan int)\n    ch <- 1 // блокируется вечно — нет получателя\n    // fatal error: all goroutines are asleep - deadlock!\n}\n\n// ДЕДЛОК 2: получение без отправителя\nfunc deadlock2() {\n    ch := make(chan int)\n    val := <-ch // блокируется вечно — нет отправителя\n    fmt.Println(val)\n}\n\n// ДЕДЛОК 3: горутины ждут друг друга\nfunc deadlock3() {\n    ch1 := make(chan int)\n    ch2 := make(chan int)\n\n    go func() {\n        ch1 <- 1 // ждёт пока main прочитает из ch1\n        <-ch2   // потом ждёт ch2\n    }()\n\n    val := <-ch2  // ждёт пока горутина напишет в ch2 — но горутина ждёт ch1!\n    ch1 <- val    // никогда не дойдёт сюда\n}\n\n// РЕШЕНИЕ: поменять порядок\nfunc noDeadlock() {\n    ch1 := make(chan int)\n    ch2 := make(chan int)\n\n    go func() {\n        <-ch1   // сначала ждём ch1\n        ch2 <- 1 // потом пишем в ch2\n    }()\n\n    ch1 <- 1  // пишем в ch1\n    <-ch2     // потом читаем ch2\n}' },
        { type: 'code', language: 'bash', value: '# Сообщение о дедлоке от Go runtime:\n# goroutine 1 [chan receive]:\n# main.main()\n#         /tmp/deadlock.go:5 +0x28\n# exit status 2' },
        { type: 'note', value: 'Go runtime обнаруживает только ПОЛНЫЕ дедлоки (все горутины заблокированы). Частичный дедлок (зависла одна горутина из нескольких) не обнаруживается автоматически.' }
      ]
    },
    {
      id: 7,
      title: 'Небуферизованные каналы — синхронизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Небуферизованный канал (make(chan T)) — это точка синхронизации. Отправитель и получатель должны встретиться одновременно. Это обеспечивает гарантию: после ch <- val можно быть уверен, что получатель уже прочитал значение.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc main() {\n    done := make(chan struct{}) // канал-сигнал (struct{} не занимает памяти)\n\n    go func() {\n        fmt.Println("горутина: начинаю работу")\n        time.Sleep(500 * time.Millisecond)\n        fmt.Println("горутина: работа завершена")\n        done <- struct{}{} // сигнализируем завершение\n    }()\n\n    fmt.Println("main: жду горутину")\n    <-done // блокируемся до получения сигнала\n    fmt.Println("main: горутина завершила работу")\n}' },
        { type: 'heading', value: 'chan struct{} — сигнальный канал' },
        { type: 'text', value: 'Тип struct{} занимает 0 байт — это пустая структура. Канал chan struct{} используется как сигнал "что-то произошло", когда само значение не важно — важен только факт получения. Это экономит память по сравнению с chan bool.' },
        { type: 'code', language: 'go', value: '// Паттерн "done channel" — сигнал завершения\nfunc worker(done <-chan struct{}) {\n    for {\n        select {\n        case <-done:\n            fmt.Println("получен сигнал завершения")\n            return\n        default:\n            // делаем работу\n            fmt.Println("работаем...")\n            time.Sleep(100 * time.Millisecond)\n        }\n    }\n}\n\nfunc main() {\n    done := make(chan struct{})\n    go worker(done)\n\n    time.Sleep(350 * time.Millisecond)\n    close(done) // закрытие канала разбудит всех ждущих получателей\n    time.Sleep(100 * time.Millisecond)\n}' }
      ]
    },
    {
      id: 8,
      title: 'Практика: канал событий',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте простую систему событий на основе каналов. Производитель (producer) генерирует события с числами, потребитель (consumer) их обрабатывает и вычисляет сумму. Используйте канал для передачи данных и done-канал для завершения.',
      requirements: [
        'Функция producer(out chan<- int, count int) — отправляет числа от 1 до count, затем закрывает канал',
        'Функция consumer(in <-chan int, results chan<- int) — читает числа, вычисляет сумму через range, отправляет результат',
        'Используйте два канала: один для чисел, второй для результата',
        'Запустите producer и consumer как горутины',
        'Выведите итоговую сумму'
      ],
      expectedOutput: 'Запускаем producer (count=10)\nПолучено чисел: 10\nСумма: 55',
      hint: 'Producer должен закрыть канал после отправки всех чисел — это позволит consumer выйти из range. Consumer отправляет результат в отдельный канал results и завершается. Main читает из results для получения суммы.',
      solution: 'package main\n\nimport "fmt"\n\nfunc producer(out chan<- int, count int) {\n    fmt.Printf("Запускаем producer (count=%d)\\n", count)\n    for i := 1; i <= count; i++ {\n        out <- i\n    }\n    close(out) // сигнализируем что данные закончились\n}\n\nfunc consumer(in <-chan int, results chan<- int) {\n    sum := 0\n    receivedCount := 0\n    for n := range in { // читаем пока producer не закроет канал\n        sum += n\n        receivedCount++\n    }\n    fmt.Printf("Получено чисел: %d\\n", receivedCount)\n    results <- sum // отправляем результат\n}\n\nfunc main() {\n    numbers := make(chan int)\n    results := make(chan int)\n\n    go producer(numbers, 10)\n    go consumer(numbers, results)\n\n    // Ждём результат от consumer\n    sum := <-results\n    fmt.Printf("Сумма: %d\\n", sum)\n}',
      explanation: 'Два канала создают явный однонаправленный поток данных: producer->numbers->consumer->results->main. Закрытие numbers позволяет consumer выйти из цикла range. Небуферизованный канал results синхронизирует main и consumer — main блокируется пока consumer не вычислит сумму. Все горутины завершаются естественно без дополнительной синхронизации.'
    }
  ]
}
