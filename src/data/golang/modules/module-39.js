export default {
  id: 39,
  title: 'Select',
  description: 'Оператор select, неблокирующий select с default, таймауты через time.After, паттерн done-канала, мультиплексирование',
  lessons: [
    {
      id: 1,
      title: 'Select — ожидание нескольких каналов',
      type: 'theory',
      content: [
        { type: 'text', value: 'select — это как switch для каналов. Он ожидает одновременно несколько операций с каналами и выполняет ту ветку, которая стала готова первой. Это кассир на ресепшне: слушает несколько телефонов сразу и отвечает на тот, который позвонил первым.' },
        { type: 'heading', value: 'Базовый синтаксис' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc main() {\n    ch1 := make(chan string)\n    ch2 := make(chan string)\n\n    go func() {\n        time.Sleep(1 * time.Second)\n        ch1 <- "один"\n    }()\n\n    go func() {\n        time.Sleep(2 * time.Second)\n        ch2 <- "два"\n    }()\n\n    // Ждём ПЕРВЫЙ готовый канал\n    select {\n    case msg1 := <-ch1:\n        fmt.Println("получили из ch1:", msg1)\n    case msg2 := <-ch2:\n        fmt.Println("получили из ch2:", msg2)\n    }\n    // Выведет: "получили из ch1: один" (ch1 готов через 1 сек)\n}' },
        { type: 'heading', value: 'Select в цикле — мультиплексирование' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc merge(ch1, ch2 <-chan int) <-chan int {\n    out := make(chan int)\n    go func() {\n        defer close(out)\n        for {\n            select {\n            case v, ok := <-ch1:\n                if !ok { ch1 = nil; continue } // канал закрыт — "выключаем" его\n                out <- v\n            case v, ok := <-ch2:\n                if !ok { ch2 = nil; continue }\n                out <- v\n            }\n            if ch1 == nil && ch2 == nil {\n                return // оба канала закрыты\n            }\n        }\n    }()\n    return out\n}' },
        { type: 'note', value: 'Когда несколько каналов готовы одновременно — select выбирает СЛУЧАЙНЫЙ. Это намеренное решение дизайна Go: предотвращает "голодание" (starvation) каналов.' }
      ]
    },
    {
      id: 2,
      title: 'Неблокирующий select — ветка default',
      type: 'theory',
      content: [
        { type: 'text', value: 'Select с веткой default никогда не блокируется: если ни один канал не готов, немедленно выполняется default. Это как "попробовать получить сообщение — если нет, продолжить работу".' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    ch := make(chan int, 1)\n\n    // Неблокирующая отправка\n    select {\n    case ch <- 42:\n        fmt.Println("значение отправлено")\n    default:\n        fmt.Println("канал занят, пропускаем")\n    }\n\n    // Неблокирующее получение\n    select {\n    case val := <-ch:\n        fmt.Println("получили:", val)\n    default:\n        fmt.Println("канал пуст")\n    }\n\n    // Второй раз — канал пуст\n    select {\n    case val := <-ch:\n        fmt.Println("получили:", val)\n    default:\n        fmt.Println("канал пуст") // выполнится это\n    }\n}' },
        { type: 'heading', value: 'Проверка статуса без блокировки' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\ntype Cache struct {\n    updated chan struct{}\n}\n\nfunc (c *Cache) IsUpdated() bool {\n    select {\n    case <-c.updated:\n        return true\n    default:\n        return false\n    }\n}\n\nfunc (c *Cache) TryProcess(ch <-chan int) (int, bool) {\n    select {\n    case val := <-ch:\n        return val, true // данные готовы\n    default:\n        return 0, false // нет данных прямо сейчас\n    }\n}\n\nfunc main() {\n    ch := make(chan int, 1)\n    ch <- 99\n\n    if val, ok := (&Cache{}).TryProcess(ch); ok {\n        fmt.Println("получили:", val)\n    } else {\n        fmt.Println("данных нет")\n    }\n}' },
        { type: 'tip', value: 'Неблокирующий select (с default) — это основа для реализации try-lock паттернов, неблокирующих очередей и polling без спин-лупа.' }
      ]
    },
    {
      id: 3,
      title: 'Таймаут через time.After',
      type: 'theory',
      content: [
        { type: 'text', value: 'time.After(d) возвращает канал, в который придёт значение через duration d. Это идеально для реализации таймаутов в select — если операция не завершилась за отведённое время, выполняем ветку таймаута.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc fetchData(url string) (string, error) {\n    result := make(chan string, 1)\n    errCh  := make(chan error, 1)\n\n    go func() {\n        // Симуляция медленного запроса\n        time.Sleep(2 * time.Second)\n        result <- "данные от " + url\n    }()\n\n    select {\n    case data := <-result:\n        return data, nil\n    case err := <-errCh:\n        return "", err\n    case <-time.After(1 * time.Second): // таймаут 1 секунда\n        return "", fmt.Errorf("таймаут: %s не ответил за 1 секунду", url)\n    }\n}\n\nfunc main() {\n    data, err := fetchData("https://slow-api.example.com")\n    if err != nil {\n        fmt.Println("ошибка:", err)\n        return\n    }\n    fmt.Println(data)\n}' },
        { type: 'heading', value: 'Повторные попытки с таймаутом' },
        { type: 'code', language: 'go', value: 'func withRetry(fn func() error, maxAttempts int, timeout time.Duration) error {\n    for attempt := 1; attempt <= maxAttempts; attempt++ {\n        done := make(chan error, 1)\n        go func() {\n            done <- fn()\n        }()\n\n        select {\n        case err := <-done:\n            if err == nil {\n                return nil // успех!\n            }\n            fmt.Printf("попытка %d неудачна: %v\\n", attempt, err)\n        case <-time.After(timeout):\n            fmt.Printf("попытка %d: таймаут\\n", attempt)\n        }\n    }\n    return fmt.Errorf("все %d попытки исчерпаны", maxAttempts)\n}' },
        { type: 'warning', value: 'time.After создаёт новый таймер при каждом вызове. В tight loop это может привести к утечке памяти — таймеры не будут собраны GC пока не истекут. Используйте time.NewTimer с defer t.Stop() в критических путях.' }
      ]
    },
    {
      id: 4,
      title: 'Done-канал — отмена операций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Паттерн done-канала позволяет внешнему коду сигнализировать горутинам о завершении работы. Горутина проверяет done-канал в своём цикле и завершается при получении сигнала. Это как кнопка "Стоп" на пульте управления.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\n// generator генерирует числа пока не получит сигнал done\nfunc generator(done <-chan struct{}) <-chan int {\n    out := make(chan int)\n    go func() {\n        defer close(out)\n        for i := 0; ; i++ {\n            select {\n            case <-done:\n                fmt.Println("generator: получен сигнал остановки")\n                return\n            case out <- i:\n                // продолжаем генерацию\n            }\n        }\n    }()\n    return out\n}\n\nfunc main() {\n    done := make(chan struct{})\n\n    numbers := generator(done)\n\n    // Читаем первые 5 чисел\n    for i := 0; i < 5; i++ {\n        fmt.Println(<-numbers)\n    }\n\n    // Останавливаем генератор\n    close(done) // закрытие done разбудит все горутины, ждущие <-done\n    time.Sleep(10 * time.Millisecond)\n    fmt.Println("всё завершено")\n}' },
        { type: 'heading', value: 'Закрытие vs отправка в done-канал' },
        { type: 'code', language: 'go', value: '// ЗАКРЫТИЕ канала — правильно для оповещения МНОГИХ горутин\n// close(done) разбудит ВСЕХ, кто ждёт <-done\ndone := make(chan struct{})\nclose(done)     // все горутины получат нулевое значение\n\n// ОТПРАВКА — для оповещения ОДНОЙ горутины\ndone <- struct{}{} // разбудит только одного получателя' }
      ]
    },
    {
      id: 5,
      title: 'Мультиплексирование — объединение каналов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мультиплексирование (multiplexing) — это объединение нескольких каналов в один. select позволяет читать из нескольких источников данных, отправляя всё в один выходной канал. Это как коммутатор телефонной станции: много входящих линий, одна общая шина.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "time"\n)\n\n// fanIn объединяет несколько каналов в один\nfunc fanIn(done <-chan struct{}, channels ...<-chan string) <-chan string {\n    out := make(chan string)\n    var wg sync.WaitGroup\n\n    // Для каждого входного канала запускаем форвардер\n    forward := func(ch <-chan string) {\n        defer wg.Done()\n        for {\n            select {\n            case val, ok := <-ch:\n                if !ok {\n                    return\n                }\n                select {\n                case out <- val:\n                case <-done:\n                    return\n                }\n            case <-done:\n                return\n            }\n        }\n    }\n\n    wg.Add(len(channels))\n    for _, ch := range channels {\n        go forward(ch)\n    }\n\n    // Закрываем out когда все форвардеры завершились\n    go func() {\n        wg.Wait()\n        close(out)\n    }()\n\n    return out\n}\n\nfunc genStrings(s string, count int) <-chan string {\n    ch := make(chan string)\n    go func() {\n        for i := 0; i < count; i++ {\n            time.Sleep(100 * time.Millisecond)\n            ch <- fmt.Sprintf("%s-%d", s, i)\n        }\n        close(ch)\n    }()\n    return ch\n}\n\nfunc main() {\n    done := make(chan struct{})\n    defer close(done)\n\n    ch1 := genStrings("alpha", 3)\n    ch2 := genStrings("beta",  3)\n    ch3 := genStrings("gamma", 3)\n\n    merged := fanIn(done, ch1, ch2, ch3)\n    for msg := range merged {\n        fmt.Println(msg)\n    }\n}' }
      ]
    },
    {
      id: 6,
      title: 'Heartbeat — периодические сигналы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Паттерн heartbeat позволяет горутине периодически сигнализировать что она жива и работает. Это как пульс: регулярные сигналы говорят что система в порядке. Если сигналов нет — что-то пошло не так.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc workerWithHeartbeat(\n    done      <-chan struct{},\n    heartbeat  chan<- struct{},\n    work       <-chan int,\n) <-chan int {\n    results := make(chan int)\n\n    go func() {\n        defer close(results)\n        sendHeartbeat := func() {\n            select {\n            case heartbeat <- struct{}{}:\n            default: // не блокируемся если получатель не читает heartbeat\n            }\n        }\n\n        for {\n            select {\n            case <-done:\n                return\n            case job, ok := <-work:\n                if !ok {\n                    return\n                }\n                sendHeartbeat()\n                results <- job * 2\n            case <-time.After(500 * time.Millisecond):\n                // Нет работы давно — всё равно шлём heartbeat\n                sendHeartbeat()\n            }\n        }\n    }()\n\n    return results\n}\n\nfunc main() {\n    done      := make(chan struct{})\n    heartbeat := make(chan struct{}, 1)\n    work      := make(chan int, 5)\n\n    results := workerWithHeartbeat(done, heartbeat, work)\n\n    // Монитор heartbeat\n    go func() {\n        for {\n            select {\n            case <-heartbeat:\n                fmt.Println("heartbeat: воркер жив")\n            case <-time.After(1 * time.Second):\n                fmt.Println("ПРЕДУПРЕЖДЕНИЕ: воркер не отвечает!")\n            case <-done:\n                return\n            }\n        }\n    }()\n\n    for i := 1; i <= 3; i++ {\n        work <- i\n    }\n    close(work)\n\n    for r := range results {\n        fmt.Println("результат:", r)\n    }\n    close(done)\n}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: система мониторинга с таймаутом',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте систему мониторинга сервисов. Каждый сервис опрашивается в отдельной горутине. Результаты собираются через select. Система должна поддерживать таймаут на каждый запрос и общую остановку.',
      requirements: [
        'Структура ServiceStatus { Name string, Up bool, ResponseTime time.Duration, Error error }',
        'Функция checkService(name string, timeout time.Duration) ServiceStatus',
        'Функция monitorAll(services []string, pollInterval, timeout time.Duration, done <-chan struct{}) <-chan ServiceStatus',
        'Использовать select с time.After для таймаута каждой проверки',
        'Использовать done-канал для остановки мониторинга',
        'В main: запустить мониторинг на 500мс, затем остановить'
      ],
      expectedOutput: 'api: UP (12ms)\ndb: UP (8ms)\ncache: TIMEOUT\nОстановка мониторинга...',
      hint: 'checkService должна запускать "проверку" в горутине и использовать select с time.After для таймаута. monitorAll запускает горутину для каждого сервиса в цикле с pollInterval, и пересылает результаты в общий канал. Не забудьте про done-канал в каждом select.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "math/rand"\n    "time"\n)\n\ntype ServiceStatus struct {\n    Name         string\n    Up           bool\n    ResponseTime time.Duration\n    Error        error\n}\n\nfunc checkService(name string, timeout time.Duration) ServiceStatus {\n    result := make(chan ServiceStatus, 1)\n\n    go func() {\n        start := time.Now()\n        // Симуляция запроса: случайное время ответа\n        delay := time.Duration(rand.Intn(300)) * time.Millisecond\n        time.Sleep(delay)\n\n        result <- ServiceStatus{\n            Name:         name,\n            Up:           rand.Float32() > 0.2, // 80% шанс что сервис UP\n            ResponseTime: time.Since(start),\n        }\n    }()\n\n    select {\n    case status := <-result:\n        return status\n    case <-time.After(timeout):\n        return ServiceStatus{\n            Name:  name,\n            Up:    false,\n            Error: fmt.Errorf("таймаут (%v)", timeout),\n        }\n    }\n}\n\nfunc monitorAll(services []string, pollInterval, timeout time.Duration, done <-chan struct{}) <-chan ServiceStatus {\n    out := make(chan ServiceStatus, len(services))\n\n    go func() {\n        defer close(out)\n        ticker := time.NewTicker(pollInterval)\n        defer ticker.Stop()\n\n        for {\n            select {\n            case <-done:\n                fmt.Println("Остановка мониторинга...")\n                return\n            case <-ticker.C:\n                for _, svc := range services {\n                    go func(name string) {\n                        status := checkService(name, timeout)\n                        select {\n                        case out <- status:\n                        case <-done:\n                        }\n                    }(svc)\n                }\n            }\n        }\n    }()\n\n    return out\n}\n\nfunc main() {\n    services := []string{"api", "db", "cache", "queue"}\n    done := make(chan struct{})\n\n    statuses := monitorAll(services, 200*time.Millisecond, 150*time.Millisecond, done)\n\n    // Останавливаем через 600мс (3 опроса)\n    time.AfterFunc(600*time.Millisecond, func() {\n        close(done)\n    })\n\n    for status := range statuses {\n        if status.Error != nil {\n            fmt.Printf("%s: %s\\n", status.Name, strings.ToUpper(status.Error.Error()))\n        } else if status.Up {\n            fmt.Printf("%s: UP (%v)\\n", status.Name, status.ResponseTime.Round(time.Millisecond))\n        } else {\n            fmt.Printf("%s: DOWN\\n", status.Name)\n        }\n    }\n}',
      explanation: 'checkService использует select с time.After — классический паттерн таймаута. Горутина выполняет реальную работу и отправляет в буферизованный канал result. monitorAll содержит главный цикл: ticker периодически запускает проверки всех сервисов, done-канал останавливает весь мониторинг. Каждая горутина-проверщик также уважает done-канал — не блокируется если мониторинг остановили.'
    }
  ]
}
