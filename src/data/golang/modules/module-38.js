export default {
  id: 38,
  title: 'Буферизованные каналы',
  description: 'Буферизованные vs небуферизованные каналы, ёмкость, паттерн семафора, пул воркеров',
  lessons: [
    {
      id: 1,
      title: 'Буферизованные каналы — make(chan, N)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Буферизованный канал имеет внутреннюю очередь фиксированного размера. Отправитель не блокируется пока буфер не заполнен. Это как почтовый ящик: можно бросить несколько писем не дожидаясь почтальона — он заберёт их позже.' },
        { type: 'heading', value: 'Создание и поведение' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Буферизованный канал: второй аргумент = размер буфера\n    ch := make(chan int, 3) // буфер на 3 элемента\n\n    // Отправка НЕ блокируется (пока буфер не полон)\n    ch <- 1 // буфер: [1]\n    ch <- 2 // буфер: [1, 2]\n    ch <- 3 // буфер: [1, 2, 3]\n    // ch <- 4 // ЗАБЛОКИРУЕТСЯ: буфер полон!\n\n    fmt.Println("отправлено 3 значения, продолжаем без блокировки")\n\n    // Получение\n    fmt.Println(<-ch) // 1 (FIFO: первый вошёл, первый вышел)\n    fmt.Println(<-ch) // 2\n    fmt.Println(<-ch) // 3\n\n    // Информация о канале\n    ch <- 10\n    ch <- 20\n    fmt.Println("len:", len(ch)) // 2 — элементов в буфере\n    fmt.Println("cap:", cap(ch)) // 3 — ёмкость буфера\n}' },
        { type: 'heading', value: 'Небуферизованный vs буферизованный' },
        { type: 'list', items: [
          'Небуферизованный: make(chan T) — синхронная точка встречи, оба блокируются',
          'Буферизованный: make(chan T, N) — асинхронная очередь размером N',
          'Оба: FIFO-порядок, типобезопасность, потокобезопасность',
          'Буферизованный не устраняет синхронизацию — только откладывает её'
        ]},
        { type: 'note', value: 'Буферизованные каналы могут скрывать ошибки проектирования. Если без буфера программа дедлочится, это сигнал о проблеме в архитектуре. Не всегда правильно "просто добавить буфер".' }
      ]
    },
    {
      id: 2,
      title: 'Когда использовать буферизованные каналы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Буферизованные каналы нужны когда производитель и потребитель работают с разной скоростью, и мы хотим сгладить эту разницу. Также они нужны когда одна горутина должна отправить несколько значений без блокировки.' },
        { type: 'heading', value: 'Когда нужен буфер' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\n// БЕЗ буфера: producer ждёт каждого consumer\nfunc withoutBuffer() {\n    ch := make(chan int)\n    go func() {\n        for i := 0; i < 5; i++ {\n            fmt.Println("producer: отправляю", i)\n            ch <- i // блокируется на каждой итерации\n        }\n        close(ch)\n    }()\n\n    for v := range ch {\n        time.Sleep(100 * time.Millisecond) // consumer медленный\n        fmt.Println("consumer: получил", v)\n    }\n}\n\n// С БУФЕРОМ: producer может забежать вперёд\nfunc withBuffer() {\n    ch := make(chan int, 5) // буфер = размер партии\n    go func() {\n        for i := 0; i < 5; i++ {\n            fmt.Println("producer: отправляю", i)\n            ch <- i // не блокируется пока буфер не полон\n        }\n        close(ch)\n    }()\n\n    for v := range ch {\n        time.Sleep(100 * time.Millisecond)\n        fmt.Println("consumer: получил", v)\n    }\n}' },
        { type: 'heading', value: 'Канал как коллектор результатов' },
        { type: 'code', language: 'go', value: 'func collectResults(n int) []int {\n    results := make(chan int, n) // буфер = количество горутин\n\n    for i := 0; i < n; i++ {\n        go func(id int) {\n            results <- id * id // не блокируется — буфер достаточно большой\n        }(i)\n    }\n\n    // Собираем все результаты\n    out := make([]int, n)\n    for i := 0; i < n; i++ {\n        out[i] = <-results\n    }\n    return out\n}' }
      ]
    },
    {
      id: 3,
      title: 'Паттерн семафора — ограничение параллелизма',
      type: 'theory',
      content: [
        { type: 'text', value: 'Семафор — это механизм ограничения количества одновременно выполняющихся операций. Например, если мы делаем 1000 HTTP-запросов параллельно — сервер может отказать в доступе или наш компьютер не справится. Буферизованный канал легко реализует семафор.' },
        { type: 'text', value: 'Представьте парковку на 10 мест. Машины могут въезжать только если есть свободное место. Буферизованный канал — это парковка: место = слот в буфере.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "time"\n)\n\n// Semaphore ограничивает количество одновременных операций\ntype Semaphore chan struct{}\n\nfunc NewSemaphore(capacity int) Semaphore {\n    return make(chan struct{}, capacity)\n}\n\nfunc (s Semaphore) Acquire() {\n    s <- struct{}{} // занимаем слот (блокируемся если нет места)\n}\n\nfunc (s Semaphore) Release() {\n    <-s // освобождаем слот\n}\n\nfunc processURLs(urls []string, maxConcurrent int) {\n    sem := NewSemaphore(maxConcurrent)\n    var wg sync.WaitGroup\n\n    for _, url := range urls {\n        wg.Add(1)\n        sem.Acquire() // ждём пока освободится слот\n\n        go func(u string) {\n            defer wg.Done()\n            defer sem.Release() // освобождаем слот при завершении\n\n            // Симуляция HTTP-запроса\n            fmt.Printf("обрабатываем %s\\n", u)\n            time.Sleep(100 * time.Millisecond)\n        }(url)\n    }\n\n    wg.Wait()\n}\n\nfunc main() {\n    urls := make([]string, 20)\n    for i := range urls {\n        urls[i] = fmt.Sprintf("https://api.example.com/item/%d", i)\n    }\n\n    // Не более 3 одновременных запросов\n    processURLs(urls, 3)\n    fmt.Println("все запросы выполнены")\n}' },
        { type: 'tip', value: 'Паттерн семафора — один из самых полезных в Go. Он защищает от перегрузки баз данных, внешних API, файловых систем. Всегда ограничивайте параллелизм при работе с внешними ресурсами.' }
      ]
    },
    {
      id: 4,
      title: 'Пул воркеров — worker pool',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пул воркеров — это фиксированное количество горутин-воркеров, которые берут задачи из общей очереди. Это как конвейер на заводе: работники стоят на местах, задачи приходят на ленту. Не нужно создавать новую горутину на каждую задачу.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "time"\n)\n\ntype Job struct {\n    ID   int\n    Data string\n}\n\ntype Result struct {\n    JobID  int\n    Output string\n}\n\n// worker берёт задачи из jobs и кладёт результаты в results\nfunc worker(id int, jobs <-chan Job, results chan<- Result, wg *sync.WaitGroup) {\n    defer wg.Done()\n    for job := range jobs { // читает пока jobs не закроют\n        fmt.Printf("воркер %d: обрабатываю задачу %d\\n", id, job.ID)\n        time.Sleep(50 * time.Millisecond) // симуляция работы\n        results <- Result{\n            JobID:  job.ID,\n            Output: fmt.Sprintf("результат(%s)", job.Data),\n        }\n    }\n    fmt.Printf("воркер %d: задач больше нет, завершаюсь\\n", id)\n}\n\nfunc main() {\n    numWorkers := 3\n    numJobs := 10\n\n    jobs    := make(chan Job, numJobs)\n    results := make(chan Result, numJobs)\n\n    // Запускаем пул воркеров\n    var wg sync.WaitGroup\n    for i := 1; i <= numWorkers; i++ {\n        wg.Add(1)\n        go worker(i, jobs, results, &wg)\n    }\n\n    // Отправляем задачи\n    for i := 1; i <= numJobs; i++ {\n        jobs <- Job{ID: i, Data: fmt.Sprintf("данные-%d", i)}\n    }\n    close(jobs) // сигнализируем воркерам что задач больше нет\n\n    // Ждём завершения воркеров в отдельной горутине\n    go func() {\n        wg.Wait()\n        close(results) // когда все воркеры завершились — закрываем results\n    }()\n\n    // Собираем результаты\n    for result := range results {\n        fmt.Printf("задача %d: %s\\n", result.JobID, result.Output)\n    }\n}' },
        { type: 'heading', value: 'Почему пул воркеров лучше одной горутины на задачу' },
        { type: 'list', items: [
          'Контролируемое потребление памяти — N воркеров, не N*количество_задач горутин',
          'Нет накладных расходов на создание горутины для каждой задачи',
          'Легко настраивать параллелизм: поменяй numWorkers',
          'Предсказуемая нагрузка на внешние системы'
        ]}
      ]
    },
    {
      id: 5,
      title: 'Burstable rate limiting — ограничение скорости',
      type: 'theory',
      content: [
        { type: 'text', value: 'Буферизованный канал можно использовать для ограничения скорости запросов (rate limiting) с допустимыми всплесками (burst). Это как ведро с водой: ведро накапливает "разрешения", вы используете их для запросов.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc main() {\n    // Канал-"ведро токенов" (token bucket)\n    // Ёмкость 3 — допускаем burst до 3 запросов\n    tokens := make(chan struct{}, 3)\n\n    // Заполняем начальный burst\n    for i := 0; i < 3; i++ {\n        tokens <- struct{}{}\n    }\n\n    // Каждые 200мс добавляем токен (5 запросов/сек)\n    go func() {\n        ticker := time.NewTicker(200 * time.Millisecond)\n        for range ticker.C {\n            select {\n            case tokens <- struct{}{}: // добавляем токен если есть место\n            default: // буфер полон — токен теряется (ведро переполнено)\n            }\n        }\n    }()\n\n    // Выполняем 10 запросов\n    for i := 1; i <= 10; i++ {\n        <-tokens // ждём токен\n        fmt.Printf("запрос %d: %s\\n", i, time.Now().Format("15:04:05.000"))\n    }\n}' },
        { type: 'note', value: 'Для production rate limiting используйте пакет golang.org/x/time/rate — он реализует правильный алгоритм token bucket и поддерживает контекст для отмены ожидания.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: пул воркеров для обработки изображений',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте пул воркеров для "обработки изображений" (симуляция). Система должна принимать задачи, обрабатывать их параллельно ограниченным числом воркеров и собирать результаты.',
      requirements: [
        'Структура ImageJob { ID int, Filename string, Width, Height int }',
        'Структура ImageResult { JobID int, ProcessedName string, Duration time.Duration, Err error }',
        'Функция processImage(job ImageJob) ImageResult — симулирует обработку (Sleep пропорционально размеру)',
        'WorkerPool(numWorkers int, jobs []ImageJob) []ImageResult — запускает пул воркеров',
        'Результаты должны вернуться в порядке завершения (не обязательно в порядке задач)',
        'Добавьте семафор для ограничения до numWorkers одновременных операций'
      ],
      expectedOutput: 'Запущено воркеров: 3\nЗадача 1 (small.jpg): 10ms\nЗадача 2 (medium.jpg): 20ms\n...\nВсего обработано: 5, ошибок: 0',
      hint: 'Создайте канал jobs с буфером = len(jobs), заполните его заданиями, закройте. Каждый воркер читает из jobs через range. results-канал с буфером = len(jobs) позволит воркерам не блокироваться при записи результатов.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "time"\n)\n\ntype ImageJob struct {\n    ID       int\n    Filename string\n    Width    int\n    Height   int\n}\n\ntype ImageResult struct {\n    JobID         int\n    ProcessedName string\n    Duration      time.Duration\n    Err           error\n}\n\nfunc processImage(job ImageJob) ImageResult {\n    start := time.Now()\n    // Симуляция: большие изображения обрабатываются дольше\n    pixels := job.Width * job.Height\n    sleepTime := time.Duration(pixels/10000) * time.Millisecond\n    if sleepTime < 10*time.Millisecond {\n        sleepTime = 10 * time.Millisecond\n    }\n    time.Sleep(sleepTime)\n\n    return ImageResult{\n        JobID:         job.ID,\n        ProcessedName: "processed_" + job.Filename,\n        Duration:      time.Since(start),\n    }\n}\n\nfunc WorkerPool(numWorkers int, jobs []ImageJob) []ImageResult {\n    jobCh    := make(chan ImageJob, len(jobs))\n    resultCh := make(chan ImageResult, len(jobs))\n\n    // Заполняем канал задач\n    for _, job := range jobs {\n        jobCh <- job\n    }\n    close(jobCh)\n\n    // Запускаем воркеры\n    var wg sync.WaitGroup\n    fmt.Printf("Запущено воркеров: %d\\n", numWorkers)\n    for i := 1; i <= numWorkers; i++ {\n        wg.Add(1)\n        go func(workerID int) {\n            defer wg.Done()\n            for job := range jobCh {\n                result := processImage(job)\n                resultCh <- result\n            }\n        }(i)\n    }\n\n    // Закрываем resultCh когда все воркеры завершились\n    go func() {\n        wg.Wait()\n        close(resultCh)\n    }()\n\n    // Собираем результаты\n    var results []ImageResult\n    errors := 0\n    for r := range resultCh {\n        results = append(results, r)\n        if r.Err != nil {\n            errors++\n        }\n        fmt.Printf("Задача %d (%s): %v\\n", r.JobID, r.ProcessedName, r.Duration.Round(time.Millisecond))\n    }\n    fmt.Printf("Всего обработано: %d, ошибок: %d\\n", len(results), errors)\n    return results\n}\n\nfunc main() {\n    jobs := []ImageJob{\n        {ID: 1, Filename: "small.jpg",  Width: 100,  Height: 100},\n        {ID: 2, Filename: "medium.jpg", Width: 500,  Height: 500},\n        {ID: 3, Filename: "large.jpg",  Width: 1920, Height: 1080},\n        {ID: 4, Filename: "thumb.jpg",  Width: 50,   Height: 50},\n        {ID: 5, Filename: "hd.jpg",     Width: 1280, Height: 720},\n    }\n\n    results := WorkerPool(3, jobs)\n    _ = results\n}',
      explanation: 'Буферизованный канал jobCh заполняется заданиями и сразу закрывается — воркеры читают из него через range и автоматически завершаются когда задачи кончаются. Буферизованный resultCh позволяет воркерам не блокироваться при записи результатов. WaitGroup отслеживает когда все воркеры завершились — тогда закрывается resultCh, что позволяет основному циклу for range завершиться.'
    }
  ]
}
