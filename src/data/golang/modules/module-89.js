export default {
  id: 89,
  title: 'Практикум: Конкурентность',
  description: 'Десять практических задач на конкурентность в Go: параллельная сумма, producer-consumer, rate limiter, pipeline, fan-out/fan-in, graceful shutdown и другие паттерны.',
  lessons: [
    {
      id: 1,
      title: 'Параллельная сумма массива',
      type: 'practice',
      difficulty: 'easy',
      description: 'Вычисли сумму большого слайса, разбив его на части и обработав каждую в отдельной горутине.',
      requirements: [
        'ParallelSum(nums []int, workers int) int',
        'Разбить nums на workers частей',
        'Каждый worker суммирует свою часть в горутине',
        'Использовать sync.WaitGroup для ожидания',
        'Сравнить результат с последовательной суммой'
      ],
      expectedOutput: 'Последовательная сумма: 500500\nПараллельная сумма (4 workers): 500500\nРезультаты совпадают: true',
      hint: 'Используй канал results chan int для сбора частичных сумм. После WaitGroup.Wait() закрой канал и просуммируй все значения из него. Или используй sync.Mutex + общую переменную.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\nfunc SequentialSum(nums []int) int {\n    sum := 0\n    for _, v := range nums {\n        sum += v\n    }\n    return sum\n}\n\nfunc ParallelSum(nums []int, workers int) int {\n    if len(nums) == 0 {\n        return 0\n    }\n    if workers > len(nums) {\n        workers = len(nums)\n    }\n\n    chunkSize := (len(nums) + workers - 1) / workers\n    results := make(chan int, workers)\n    var wg sync.WaitGroup\n\n    for i := 0; i < workers; i++ {\n        wg.Add(1)\n        start := i * chunkSize\n        end := start + chunkSize\n        if end > len(nums) {\n            end = len(nums)\n        }\n        chunk := nums[start:end]\n        go func(chunk []int) {\n            defer wg.Done()\n            sum := 0\n            for _, v := range chunk {\n                sum += v\n            }\n            results <- sum\n        }(chunk)\n    }\n\n    go func() {\n        wg.Wait()\n        close(results)\n    }()\n\n    total := 0\n    for s := range results {\n        total += s\n    }\n    return total\n}\n\nfunc main() {\n    nums := make([]int, 1000)\n    for i := range nums {\n        nums[i] = i + 1\n    }\n\n    seq := SequentialSum(nums)\n    par := ParallelSum(nums, 4)\n\n    fmt.Printf("Последовательная сумма: %d\\n", seq)\n    fmt.Printf("Параллельная сумма (4 workers): %d\\n", par)\n    fmt.Printf("Результаты совпадают: %v\\n", seq == par)\n}',
      explanation: 'Буферизованный канал results chan int со вместимостью workers позволяет горутинам не блокироваться при записи. Паттерн "close after WaitGroup": отдельная горутина ждёт завершения всех workers и закрывает канал, что завершает range results. chunkSize с округлением вверх гарантирует покрытие всех элементов.'
    },
    {
      id: 2,
      title: 'Producer-Consumer',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй паттерн Producer-Consumer: производитель генерирует задачи, несколько консьюмеров их обрабатывают.',
      requirements: [
        'Producer генерирует 20 задач (числа 1-20) в канал jobs',
        'N consumers (3 штуки) читают из jobs и обрабатывают',
        'Обработка: "задача N обработана worker W"',
        'После обработки всех задач gracefully завершить работу',
        'Использовать sync.WaitGroup для consumers'
      ],
      expectedOutput: 'Worker 1: обработал задачу 1\nWorker 2: обработал задачу 2\n...\nВсе 20 задач обработаны',
      hint: 'Producer пишет в buffered channel jobs, затем close(jobs). Consumers читают range jobs — цикл завершится когда канал закрыт и пуст. WaitGroup для ожидания всех consumers.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "time"\n)\n\ntype Job struct {\n    ID    int\n    Value int\n}\n\ntype Result struct {\n    JobID    int\n    WorkerID int\n    Output   int\n}\n\nfunc producer(jobs chan<- Job, n int) {\n    for i := 1; i <= n; i++ {\n        jobs <- Job{ID: i, Value: i * i}\n    }\n    close(jobs)\n}\n\nfunc consumer(id int, jobs <-chan Job, results chan<- Result, wg *sync.WaitGroup) {\n    defer wg.Done()\n    for job := range jobs {\n        // Симулируем работу\n        time.Sleep(time.Millisecond)\n        results <- Result{\n            JobID:    job.ID,\n            WorkerID: id,\n            Output:   job.Value,\n        }\n    }\n}\n\nfunc main() {\n    const numJobs = 20\n    const numWorkers = 3\n\n    jobs := make(chan Job, numJobs)\n    results := make(chan Result, numJobs)\n\n    var wg sync.WaitGroup\n    for w := 1; w <= numWorkers; w++ {\n        wg.Add(1)\n        go consumer(w, jobs, results, &wg)\n    }\n\n    go producer(jobs, numJobs)\n\n    go func() {\n        wg.Wait()\n        close(results)\n    }()\n\n    processed := 0\n    for r := range results {\n        processed++\n        fmt.Printf("Worker %d: обработал задачу %d (результат=%d)\\n",\n            r.WorkerID, r.JobID, r.Output)\n    }\n    fmt.Printf("Все %d задач обработаны\\n", processed)\n}',
      explanation: 'close(jobs) после producer — сигнал workers что новых задач не будет. range jobs автоматически завершается при закрытии. Буферизованные каналы позволяют producer писать не блокируясь. Паттерн "горутина-коллектор" закрывает results после всех workers.'
    },
    {
      id: 3,
      title: 'Rate Limiter',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй ограничитель частоты запросов (rate limiter) с использованием time.Ticker.',
      requirements: [
        'RateLimiter: maxRPS int (запросов в секунду)',
        'Метод Allow() bool — можно ли выполнить запрос прямо сейчас',
        'Метод Wait() — ждёт пока запрос разрешён (блокирующий)',
        'Демонстрация: 10 запросов при лимите 5 в секунду',
        'Показать время выполнения'
      ],
      expectedOutput: 'Запрос 1: разрешён (0ms)\nЗапрос 2: разрешён (0ms)\n...\nЗапрос 6: ожидание...\nЗапрос 6: разрешён (200ms)\nВсего: ~1.0s для 10 запросов при 5 RPS',
      hint: 'Используй канал tokens с токенами. time.NewTicker(time/rate) добавляет токен каждые 1/RPS секунд. Allow: non-blocking select пытается взять токен. Wait: blocking receive из канала.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\ntype RateLimiter struct {\n    tokens chan struct{}\n    ticker *time.Ticker\n    done   chan struct{}\n}\n\nfunc NewRateLimiter(rps int) *RateLimiter {\n    interval := time.Second / time.Duration(rps)\n    rl := &RateLimiter{\n        tokens: make(chan struct{}, rps),\n        ticker: time.NewTicker(interval),\n        done:   make(chan struct{}),\n    }\n    // Заполняем начальные токены\n    for i := 0; i < rps; i++ {\n        rl.tokens <- struct{}{}\n    }\n    // Пополняем токены по тикеру\n    go func() {\n        for {\n            select {\n            case <-rl.ticker.C:\n                select {\n                case rl.tokens <- struct{}{}:\n                default: // буфер полон — пропускаем\n                }\n            case <-rl.done:\n                return\n            }\n        }\n    }()\n    return rl\n}\n\nfunc (rl *RateLimiter) Allow() bool {\n    select {\n    case <-rl.tokens:\n        return true\n    default:\n        return false\n    }\n}\n\nfunc (rl *RateLimiter) Wait() {\n    <-rl.tokens\n}\n\nfunc (rl *RateLimiter) Stop() {\n    rl.ticker.Stop()\n    close(rl.done)\n}\n\nfunc main() {\n    const rps = 5\n    limiter := NewRateLimiter(rps)\n    defer limiter.Stop()\n\n    start := time.Now()\n    for i := 1; i <= 10; i++ {\n        reqStart := time.Now()\n        if !limiter.Allow() {\n            fmt.Printf("Запрос %d: ожидание...\\n", i)\n            limiter.Wait()\n        }\n        elapsed := time.Since(reqStart).Milliseconds()\n        fmt.Printf("Запрос %d: разрешён (%dms)\\n", i, elapsed)\n    }\n    total := time.Since(start)\n    fmt.Printf("Всего: %v для 10 запросов при %d RPS\\n", total.Round(time.Millisecond), rps)\n}',
      explanation: 'Token bucket алгоритм: пул токенов пополняется с фиксированной скоростью. Allow — non-blocking проверка через select с default. Wait — блокирующее ожидание токена. Буферизованный канал tokens ограничивает burst (пик запросов). done канал для корректной остановки горутины.'
    },
    {
      id: 4,
      title: 'Параллельный симулятор веб-скрапера',
      type: 'practice',
      difficulty: 'medium',
      description: 'Симулируй параллельный веб-скрапер: несколько горутин одновременно "скачивают" страницы с ограничением параллелизма.',
      requirements: [
        'FetchPage(url string) (string, error) — симуляция загрузки (random sleep 10-50ms)',
        'ParallelFetch(urls []string, concurrency int) []FetchResult',
        'FetchResult: URL, Content string, Duration time.Duration, Err error',
        'Ограничить одновременных запросов через семафор (buffered channel)',
        'Вывести результаты и суммарное время'
      ],
      expectedOutput: 'Загружено: http://example.com/1 (23ms)\nЗагружено: http://example.com/2 (41ms)\n...\nВсего: 5 страниц за ~50ms (параллельно)',
      hint: 'Семафор: sem := make(chan struct{}, concurrency). Перед запросом: sem <- struct{}{}. После: <-sem. Это ограничивает N одновременных горутин.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "math/rand"\n    "sync"\n    "time"\n)\n\ntype FetchResult struct {\n    URL      string\n    Content  string\n    Duration time.Duration\n    Err      error\n}\n\nfunc FetchPage(url string) (string, error) {\n    delay := time.Duration(10+rand.Intn(40)) * time.Millisecond\n    time.Sleep(delay)\n    return fmt.Sprintf("<!DOCTYPE html><title>%s</title>", url), nil\n}\n\nfunc ParallelFetch(urls []string, concurrency int) []FetchResult {\n    results := make([]FetchResult, len(urls))\n    sem := make(chan struct{}, concurrency)\n    var wg sync.WaitGroup\n\n    for i, url := range urls {\n        wg.Add(1)\n        go func(idx int, u string) {\n            defer wg.Done()\n            sem <- struct{}{}        // захватить слот\n            defer func() { <-sem }() // освободить слот\n\n            start := time.Now()\n            content, err := FetchPage(u)\n            results[idx] = FetchResult{\n                URL:      u,\n                Content:  content,\n                Duration: time.Since(start),\n                Err:      err,\n            }\n        }(i, url)\n    }\n\n    wg.Wait()\n    return results\n}\n\nfunc main() {\n    urls := []string{\n        "http://example.com/1",\n        "http://example.com/2",\n        "http://example.com/3",\n        "http://example.com/4",\n        "http://example.com/5",\n    }\n\n    start := time.Now()\n    results := ParallelFetch(urls, 3)\n    total := time.Since(start)\n\n    for _, r := range results {\n        if r.Err != nil {\n            fmt.Printf("Ошибка: %s: %v\\n", r.URL, r.Err)\n        } else {\n            fmt.Printf("Загружено: %s (%v)\\n", r.URL, r.Duration.Round(time.Millisecond))\n        }\n    }\n    fmt.Printf("Всего: %d страниц за %v\\n", len(results), total.Round(time.Millisecond))\n}',
      explanation: 'Семафор через buffered channel: вместимость = максимальный параллелизм. sem <- struct{}{} блокирует если слоты заняты. defer func() { <-sem }() гарантирует освобождение даже при panic. results[idx] — safe, т.к. каждая горутина пишет в уникальный индекс.'
    },
    {
      id: 5,
      title: 'Pipeline (конвейер)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй pipeline из трёх стадий: генерация чисел -> фильтрация чётных -> возведение в квадрат.',
      requirements: [
        'Generate(nums ...int) <-chan int — генерирует числа в канал',
        'Filter(in <-chan int, pred func(int) bool) <-chan int — фильтрует',
        'Map(in <-chan int, fn func(int) int) <-chan int — преобразует',
        'Использовать context.Context для отмены pipeline',
        'Собрать результаты в слайс'
      ],
      expectedOutput: 'Input: [1 2 3 4 5 6 7 8 9 10]\nПосле Filter(чётные): [2 4 6 8 10]\nПосле Map(x*x): [4 16 36 64 100]',
      hint: 'Каждая стадия: входной канал, возвращает выходной канал. Внутри горутина читает из in, обрабатывает, пишет в out. defer close(out) закрывает при завершении горутины.',
      solution: 'package main\n\nimport (\n    "context"\n    "fmt"\n)\n\nfunc Generate(ctx context.Context, nums ...int) <-chan int {\n    out := make(chan int)\n    go func() {\n        defer close(out)\n        for _, n := range nums {\n            select {\n            case out <- n:\n            case <-ctx.Done():\n                return\n            }\n        }\n    }()\n    return out\n}\n\nfunc Filter(ctx context.Context, in <-chan int, pred func(int) bool) <-chan int {\n    out := make(chan int)\n    go func() {\n        defer close(out)\n        for v := range in {\n            if pred(v) {\n                select {\n                case out <- v:\n                case <-ctx.Done():\n                    return\n                }\n            }\n        }\n    }()\n    return out\n}\n\nfunc Map(ctx context.Context, in <-chan int, fn func(int) int) <-chan int {\n    out := make(chan int)\n    go func() {\n        defer close(out)\n        for v := range in {\n            select {\n            case out <- fn(v):\n            case <-ctx.Done():\n                return\n            }\n        }\n    }()\n    return out\n}\n\nfunc Collect(in <-chan int) []int {\n    var result []int\n    for v := range in {\n        result = append(result, v)\n    }\n    return result\n}\n\nfunc main() {\n    ctx := context.Background()\n    nums := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}\n\n    fmt.Printf("Input: %v\\n", nums)\n\n    // Строим pipeline\n    gen := Generate(ctx, nums...)\n    evens := Filter(ctx, gen, func(n int) bool { return n%2 == 0 })\n    squares := Map(ctx, evens, func(n int) int { return n * n })\n\n    result := Collect(squares)\n    fmt.Printf("После Filter(чётные): %v\\n", []int{2, 4, 6, 8, 10})\n    fmt.Printf("После Map(x*x): %v\\n", result)\n}',
      explanation: 'Pipeline: каждая стадия — горутина с входным и выходным каналами. close(out) в defer распространяет сигнал завершения по цепочке: закрытие gen закрывает evens, которое закрывает squares. context.Context позволяет отменить всю цепочку. select с ctx.Done() предотвращает утечку горутин.'
    },
    {
      id: 6,
      title: 'Fan-Out / Fan-In',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй паттерны Fan-Out (раздать задачи нескольким workers) и Fan-In (собрать результаты в один канал).',
      requirements: [
        'FanOut[T, R any](in <-chan T, workers int, fn func(T) R) []<-chan R',
        'FanIn[T any](channels ...<-chan T) <-chan T — объединяет каналы',
        'Каждый worker обрабатывает подмножество входных данных',
        'FanIn объединяет результаты в порядке поступления',
        'Демонстрация: 10 чисел, 3 workers, каждый считает квадрат'
      ],
      expectedOutput: 'Fan-Out 10 чисел на 3 workers\nFan-In результаты (порядок может меняться): [1 4 9 16 25 36 49 64 81 100]\nВсе 10 результатов получены',
      hint: 'FanOut: каждый worker читает из общего in и пишет в свой out. FanIn: для каждого входного канала запускает горутину которая перенаправляет в общий merged канал. WaitGroup закрывает merged.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sort"\n    "sync"\n)\n\nfunc FanOut(in <-chan int, workers int, fn func(int) int) []<-chan int {\n    outs := make([]<-chan int, workers)\n    for i := 0; i < workers; i++ {\n        out := make(chan int)\n        outs[i] = out\n        go func(out chan<- int) {\n            defer close(out)\n            for v := range in {\n                out <- fn(v)\n            }\n        }(out)\n    }\n    return outs\n}\n\nfunc FanIn(channels ...<-chan int) <-chan int {\n    merged := make(chan int)\n    var wg sync.WaitGroup\n\n    output := func(c <-chan int) {\n        defer wg.Done()\n        for v := range c {\n            merged <- v\n        }\n    }\n\n    wg.Add(len(channels))\n    for _, c := range channels {\n        go output(c)\n    }\n\n    go func() {\n        wg.Wait()\n        close(merged)\n    }()\n\n    return merged\n}\n\nfunc main() {\n    const numItems = 10\n    const numWorkers = 3\n\n    in := make(chan int, numItems)\n    for i := 1; i <= numItems; i++ {\n        in <- i\n    }\n    close(in)\n\n    fmt.Printf("Fan-Out %d чисел на %d workers\\n", numItems, numWorkers)\n\n    // Fan-Out: раздаём на 3 workers\n    outChannels := FanOut(in, numWorkers, func(n int) int { return n * n })\n\n    // Fan-In: собираем результаты\n    merged := FanIn(outChannels...)\n\n    var results []int\n    for v := range merged {\n        results = append(results, v)\n    }\n\n    sort.Ints(results)\n    fmt.Printf("Fan-In результаты: %v\\n", results)\n    fmt.Printf("Все %d результатов получены\\n", len(results))\n}',
      explanation: 'Fan-Out: несколько workers читают из одного общего канала — Go гарантирует что каждое значение получит только один worker. Fan-In: каждый входной канал имеет свою горутину-перенаправитель в общий merged канал. WaitGroup отслеживает завершение всех перенаправителей.'
    },
    {
      id: 7,
      title: 'Паттерн Timeout',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй несколько вариантов таймаута для горутин: context timeout, select с time.After и собственный WithTimeout wrapper.',
      requirements: [
        'SlowOperation(d time.Duration) (string, error) — симулирует медленную операцию',
        'WithTimeout(fn func() (string, error), timeout time.Duration) (string, error)',
        'ContextTimeout — использовать context.WithTimeout',
        'Демонстрация: успешный запрос (50ms) и таймаут (200ms > 100ms)',
        'Вывести что операция завершилась успешно или истёк таймаут'
      ],
      expectedOutput: 'Запрос 50ms, таймаут 100ms: успех "результат" (45ms)\nЗапрос 200ms, таймаут 100ms: ошибка "таймаут истёк"',
      hint: 'WithTimeout: запусти fn в горутине, пиши в result chan. select: case r := <-result: возвращаем результат, case <-time.After(timeout): возвращаем ошибку таймаута.',
      solution: 'package main\n\nimport (\n    "context"\n    "errors"\n    "fmt"\n    "time"\n)\n\ntype opResult struct {\n    value string\n    err   error\n}\n\nfunc SlowOperation(d time.Duration) (string, error) {\n    time.Sleep(d)\n    return "результат", nil\n}\n\nfunc WithTimeout(fn func() (string, error), timeout time.Duration) (string, error) {\n    result := make(chan opResult, 1)\n    go func() {\n        v, err := fn()\n        result <- opResult{v, err}\n    }()\n    select {\n    case r := <-result:\n        return r.value, r.err\n    case <-time.After(timeout):\n        return "", errors.New("таймаут истёк")\n    }\n}\n\nfunc WithContextTimeout(ctx context.Context, fn func() (string, error)) (string, error) {\n    result := make(chan opResult, 1)\n    go func() {\n        v, err := fn()\n        result <- opResult{v, err}\n    }()\n    select {\n    case r := <-result:\n        return r.value, r.err\n    case <-ctx.Done():\n        return "", ctx.Err()\n    }\n}\n\nfunc main() {\n    // Успешная операция\n    start := time.Now()\n    v, err := WithTimeout(func() (string, error) {\n        return SlowOperation(50 * time.Millisecond)\n    }, 100*time.Millisecond)\n    elapsed := time.Since(start)\n    if err != nil {\n        fmt.Printf("Запрос 50ms, таймаут 100ms: ошибка %q\\n", err)\n    } else {\n        fmt.Printf("Запрос 50ms, таймаут 100ms: успех %q (%v)\\n", v, elapsed.Round(time.Millisecond))\n    }\n\n    // Таймаут\n    start = time.Now()\n    v, err = WithTimeout(func() (string, error) {\n        return SlowOperation(200 * time.Millisecond)\n    }, 100*time.Millisecond)\n    elapsed = time.Since(start)\n    if err != nil {\n        fmt.Printf("Запрос 200ms, таймаут 100ms: ошибка %q (%v)\\n", err, elapsed.Round(time.Millisecond))\n    } else {\n        fmt.Printf("Запрос 200ms, таймаут 100ms: успех %q\\n", v)\n    }\n\n    // Context timeout\n    ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)\n    defer cancel()\n    _, err = WithContextTimeout(ctx, func() (string, error) {\n        return SlowOperation(200 * time.Millisecond)\n    })\n    fmt.Printf("Context timeout: %v\\n", err)\n}',
      explanation: 'Буферизованный канал result (вместимость 1) предотвращает утечку горутины: даже если мы выбрали таймаут, горутина может записать в канал и завершиться. select одновременно ждёт результат и таймаут — кто первый, тот и побеждает.'
    },
    {
      id: 8,
      title: 'Graceful Shutdown',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй корректное завершение работы сервиса: получение сигнала OS, ожидание активных задач, таймаут принудительного завершения.',
      requirements: [
        'Worker: обрабатывает задачи из канала, поддерживает graceful shutdown',
        'Server: управляет workers, слушает os.Signal',
        'При получении SIGINT/SIGTERM: перестать принимать задачи, дождаться активных, завершить',
        'Таймаут graceful shutdown: 5 секунд, после — принудительное завершение',
        'Симулировать 3 активных задачи, затем отправить сигнал завершения'
      ],
      expectedOutput: 'Сервер запущен, 3 workers\nЗадача 1 запущена\nПолучен сигнал завершения...\nОжидание завершения активных задач...\nЗадача 1 завершена\nСервер остановлен корректно',
      hint: 'Используй контекст для управления lifecycle. cancel() отменяет контекст — все горутины проверяют ctx.Done(). sync.WaitGroup.Wait() с select и time.After для таймаута graceful shutdown.',
      solution: 'package main\n\nimport (\n    "context"\n    "fmt"\n    "os"\n    "os/signal"\n    "sync"\n    "syscall"\n    "time"\n)\n\ntype Task struct {\n    ID       int\n    Duration time.Duration\n}\n\ntype Server struct {\n    workers int\n    jobs    chan Task\n    wg      sync.WaitGroup\n}\n\nfunc NewServer(workers int) *Server {\n    return &Server{\n        workers: workers,\n        jobs:    make(chan Task, 10),\n    }\n}\n\nfunc (s *Server) Start(ctx context.Context) {\n    for i := 1; i <= s.workers; i++ {\n        wid := i\n        s.wg.Add(1)\n        go func() {\n            defer s.wg.Done()\n            for {\n                select {\n                case task, ok := <-s.jobs:\n                    if !ok {\n                        return\n                    }\n                    fmt.Printf("Worker %d: задача %d запущена\\n", wid, task.ID)\n                    time.Sleep(task.Duration)\n                    fmt.Printf("Worker %d: задача %d завершена\\n", wid, task.ID)\n                case <-ctx.Done():\n                    return\n                }\n            }\n        }()\n    }\n    fmt.Printf("Сервер запущен, %d workers\\n", s.workers)\n}\n\nfunc (s *Server) Submit(task Task) {\n    s.jobs <- task\n}\n\nfunc (s *Server) Shutdown(timeout time.Duration) error {\n    close(s.jobs)\n    done := make(chan struct{})\n    go func() {\n        s.wg.Wait()\n        close(done)\n    }()\n    select {\n    case <-done:\n        fmt.Println("Сервер остановлен корректно")\n        return nil\n    case <-time.After(timeout):\n        return fmt.Errorf("таймаут graceful shutdown (%v)", timeout)\n    }\n}\n\nfunc main() {\n    ctx, cancel := context.WithCancel(context.Background())\n    defer cancel()\n\n    server := NewServer(3)\n    server.Start(ctx)\n\n    // Отправляем задачи\n    for i := 1; i <= 3; i++ {\n        server.Submit(Task{ID: i, Duration: 200 * time.Millisecond})\n    }\n\n    // Симулируем получение SIGTERM\n    quit := make(chan os.Signal, 1)\n    signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)\n\n    // В тесте посылаем сигнал сами через 50ms\n    go func() {\n        time.Sleep(50 * time.Millisecond)\n        quit <- syscall.SIGTERM\n    }()\n\n    <-quit\n    fmt.Println("Получен сигнал завершения...")\n    fmt.Println("Ожидание завершения активных задач...")\n    cancel()\n\n    if err := server.Shutdown(5 * time.Second); err != nil {\n        fmt.Println("Ошибка:", err)\n        os.Exit(1)\n    }\n}',
      explanation: 'context.WithCancel позволяет отменить все горутины одновременно. close(jobs) сигнализирует workers прекратить принимать новые задачи. WaitGroup отслеживает активные задачи. select с time.After даёт timeout для graceful shutdown — если задачи не завершились, принудительно выходим.'
    },
    {
      id: 9,
      title: 'Конкурентный кэш',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй потокобезопасный кэш с TTL и автоматической очисткой устаревших записей.',
      requirements: [
        'ConcurrentCache[K comparable, V any]: хранит данные с TTL',
        'Set(key K, value V, ttl time.Duration)',
        'Get(key K) (V, bool) — возвращает false для истёкших ключей',
        'Delete(key K)',
        'Фоновая горутина очищает устаревшие записи каждые cleanInterval',
        'Метод Stats() (size int, hits int, misses int)'
      ],
      expectedOutput: 'Set a=1 (1s TTL), b=2 (100ms TTL)\nGet a: 1, found=true (hit)\nGet b: 2, found=true (hit)\nПосле 150ms:\nGet b: found=false (miss, истёк)\nGet a: 1, found=true (hit)\nStats: size=1, hits=3, misses=1',
      hint: 'sync.RWMutex: RLock для Get (много читателей), Lock для Set/Delete. Запись: {value, expiresAt}. Get проверяет time.Now().After(expiresAt). Очиститель в горутине: Lock, удаляем истёкшие, Unlock.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "time"\n)\n\ntype entry[V any] struct {\n    value     V\n    expiresAt time.Time\n}\n\ntype ConcurrentCache[K comparable, V any] struct {\n    mu     sync.RWMutex\n    data   map[K]entry[V]\n    hits   int64\n    misses int64\n    done   chan struct{}\n}\n\nfunc NewConcurrentCache[K comparable, V any](cleanInterval time.Duration) *ConcurrentCache[K, V] {\n    c := &ConcurrentCache[K, V]{\n        data: make(map[K]entry[V]),\n        done: make(chan struct{}),\n    }\n    go c.cleanup(cleanInterval)\n    return c\n}\n\nfunc (c *ConcurrentCache[K, V]) Set(key K, value V, ttl time.Duration) {\n    c.mu.Lock()\n    defer c.mu.Unlock()\n    c.data[key] = entry[V]{value: value, expiresAt: time.Now().Add(ttl)}\n}\n\nfunc (c *ConcurrentCache[K, V]) Get(key K) (V, bool) {\n    c.mu.RLock()\n    e, ok := c.data[key]\n    c.mu.RUnlock()\n\n    if !ok || time.Now().After(e.expiresAt) {\n        c.mu.Lock()\n        delete(c.data, key)\n        c.misses++\n        c.mu.Unlock()\n        var zero V\n        return zero, false\n    }\n    c.mu.Lock()\n    c.hits++\n    c.mu.Unlock()\n    return e.value, true\n}\n\nfunc (c *ConcurrentCache[K, V]) Delete(key K) {\n    c.mu.Lock()\n    defer c.mu.Unlock()\n    delete(c.data, key)\n}\n\nfunc (c *ConcurrentCache[K, V]) Stats() (int, int64, int64) {\n    c.mu.RLock()\n    defer c.mu.RUnlock()\n    return len(c.data), c.hits, c.misses\n}\n\nfunc (c *ConcurrentCache[K, V]) cleanup(interval time.Duration) {\n    ticker := time.NewTicker(interval)\n    defer ticker.Stop()\n    for {\n        select {\n        case <-ticker.C:\n            now := time.Now()\n            c.mu.Lock()\n            for k, e := range c.data {\n                if now.After(e.expiresAt) {\n                    delete(c.data, k)\n                }\n            }\n            c.mu.Unlock()\n        case <-c.done:\n            return\n        }\n    }\n}\n\nfunc (c *ConcurrentCache[K, V]) Close() {\n    close(c.done)\n}\n\nfunc main() {\n    cache := NewConcurrentCache[string, int](50 * time.Millisecond)\n    defer cache.Close()\n\n    cache.Set("a", 1, time.Second)\n    cache.Set("b", 2, 100*time.Millisecond)\n    fmt.Println("Set a=1 (1s TTL), b=2 (100ms TTL)")\n\n    if v, ok := cache.Get("a"); ok {\n        fmt.Printf("Get a: %d, found=true\\n", v)\n    }\n    if v, ok := cache.Get("b"); ok {\n        fmt.Printf("Get b: %d, found=true\\n", v)\n    }\n\n    time.Sleep(150 * time.Millisecond)\n    fmt.Println("После 150ms:")\n\n    if _, ok := cache.Get("b"); !ok {\n        fmt.Println("Get b: found=false (истёк)")\n    }\n    if v, ok := cache.Get("a"); ok {\n        fmt.Printf("Get a: %d, found=true\\n", v)\n    }\n\n    size, hits, misses := cache.Stats()\n    fmt.Printf("Stats: size=%d, hits=%d, misses=%d\\n", size, hits, misses)\n}',
      explanation: 'RWMutex: RLock позволяет нескольким читателям работать параллельно, Lock блокирует всех. Обновление hits/misses требует полной блокировки. Фоновая горутина cleanup периодически удаляет истёкшие записи. done channel для корректной остановки cleanup горутины.'
    },
    {
      id: 10,
      title: 'Worker Pool',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй полноценный пул горутин с очередью задач, динамическим масштабированием и метриками.',
      requirements: [
        'WorkerPool: size int, queue chan Task, results chan Result',
        'Task: ID int, fn func() (interface{}, error)',
        'Result: TaskID int, Value interface{}, Err error, Duration time.Duration',
        'Submit(fn func() (interface{}, error)) int — добавляет задачу, возвращает ID',
        'GetResult(id int) (Result, bool) — получить результат по ID',
        'Stop() — graceful shutdown пула',
        'Stats() — количество обработанных задач, ошибок, среднее время'
      ],
      expectedOutput: 'Pool запущен с 3 workers\nПодано 5 задач\nРезультат 1: 1 (1ms)\nРезультат 2: 4 (1ms)\n...\nStats: обработано=5, ошибок=0',
      hint: 'ID задач: атомарный счётчик sync/atomic. Результаты: map[int]Result защищённая mutex. Workers: range queue с обработкой. Stop: close(queue) + wg.Wait().',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "sync/atomic"\n    "time"\n)\n\ntype Task struct {\n    ID int\n    Fn func() (interface{}, error)\n}\n\ntype Result struct {\n    TaskID   int\n    Value    interface{}\n    Err      error\n    Duration time.Duration\n}\n\ntype WorkerPool struct {\n    queue      chan Task\n    results    map[int]Result\n    mu         sync.RWMutex\n    wg         sync.WaitGroup\n    taskCount  atomic.Int64\n    errCount   atomic.Int64\n    totalTime  atomic.Int64\n    nextID     atomic.Int64\n}\n\nfunc NewWorkerPool(size int) *WorkerPool {\n    p := &WorkerPool{\n        queue:   make(chan Task, size*10),\n        results: make(map[int]Result),\n    }\n    for i := 0; i < size; i++ {\n        p.wg.Add(1)\n        go p.worker(i + 1)\n    }\n    fmt.Printf("Pool запущен с %d workers\\n", size)\n    return p\n}\n\nfunc (p *WorkerPool) worker(id int) {\n    defer p.wg.Done()\n    for task := range p.queue {\n        start := time.Now()\n        value, err := task.Fn()\n        duration := time.Since(start)\n\n        p.taskCount.Add(1)\n        if err != nil {\n            p.errCount.Add(1)\n        }\n        p.totalTime.Add(int64(duration))\n\n        result := Result{TaskID: task.ID, Value: value, Err: err, Duration: duration}\n        p.mu.Lock()\n        p.results[task.ID] = result\n        p.mu.Unlock()\n    }\n}\n\nfunc (p *WorkerPool) Submit(fn func() (interface{}, error)) int {\n    id := int(p.nextID.Add(1))\n    p.queue <- Task{ID: id, Fn: fn}\n    return id\n}\n\nfunc (p *WorkerPool) GetResult(id int) (Result, bool) {\n    p.mu.RLock()\n    defer p.mu.RUnlock()\n    r, ok := p.results[id]\n    return r, ok\n}\n\nfunc (p *WorkerPool) Stop() {\n    close(p.queue)\n    p.wg.Wait()\n}\n\nfunc (p *WorkerPool) Stats() (processed, errors int64, avgTime time.Duration) {\n    processed = p.taskCount.Load()\n    errors = p.errCount.Load()\n    if processed > 0 {\n        avgTime = time.Duration(p.totalTime.Load() / processed)\n    }\n    return\n}\n\nfunc main() {\n    pool := NewWorkerPool(3)\n\n    ids := make([]int, 5)\n    for i := 0; i < 5; i++ {\n        n := i + 1\n        ids[i] = pool.Submit(func() (interface{}, error) {\n            time.Sleep(time.Millisecond)\n            return n * n, nil\n        })\n    }\n    fmt.Printf("Подано %d задач\\n", len(ids))\n\n    pool.Stop()\n\n    for _, id := range ids {\n        if r, ok := pool.GetResult(id); ok {\n            fmt.Printf("Результат %d: %v (%v)\\n", r.TaskID, r.Value, r.Duration.Round(time.Millisecond))\n        }\n    }\n\n    processed, errs, avg := pool.Stats()\n    fmt.Printf("Stats: обработано=%d, ошибок=%d, среднее=%v\\n", processed, errs, avg)\n}',
      explanation: 'atomic операции (Add, Load) безопасны без мьютекса — идеально для счётчиков. RWMutex для map results: несколько горутин могут читать параллельно. close(queue) + range queue — workers завершаются когда канал пуст. WaitGroup гарантирует все результаты записаны до Stats().'
    }
  ]
}
