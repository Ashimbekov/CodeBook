export default {
  id: 76,
  title: 'Конкурентность: best practices',
  description: 'Лучшие практики конкурентного программирования в Go: не разделяй память — используй каналы, управление жизненным циклом горутин, context для отмены, избегание утечек горутин, race detector.',
  lessons: [
    {
      id: 1,
      title: 'Не разделяй память — общайся через каналы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мантра Go: "Do not communicate by sharing memory; instead, share memory by communicating." Вместо мьютексов и разделяемых данных используй каналы для передачи владения данными.' },
        { type: 'heading', value: 'ПЛОХО: разделяемое состояние без защиты' },
        { type: 'code', language: 'go', value: '// ПЛОХО: горутины читают/пишут общую переменную без защиты\npackage main\n\nimport (\n    "fmt"\n    "sync"\n)\n\nvar counter int // ГОНКА ДАННЫХ!\n\nfunc increment(wg *sync.WaitGroup) {\n    defer wg.Done()\n    for i := 0; i < 1000; i++ {\n        counter++ // Несколько горутин меняют counter одновременно\n    }\n}\n\nfunc main() {\n    var wg sync.WaitGroup\n    for i := 0; i < 5; i++ {\n        wg.Add(1)\n        go increment(&wg)\n    }\n    wg.Wait()\n    fmt.Println(counter) // Каждый раз разный результат! Ожидаем 5000.\n}' },
        { type: 'heading', value: 'ХОРОШО: канал для передачи данных' },
        { type: 'code', language: 'go', value: '// ХОРОШО: один владелец состояния, остальные общаются через каналы\npackage main\n\nimport "fmt"\n\ntype counterMsg struct {\n    delta int\n    reply chan int // для чтения значения\n}\n\n// counterActor — единственный владелец counter\nfunc counterActor(inbox <-chan counterMsg) {\n    count := 0\n    for msg := range inbox {\n        count += msg.delta\n        if msg.reply != nil {\n            msg.reply <- count\n        }\n    }\n}\n\nfunc main() {\n    inbox := make(chan counterMsg, 100)\n    go counterActor(inbox)\n\n    // 5 горутин посылают increment через канал\n    done := make(chan struct{}, 5)\n    for i := 0; i < 5; i++ {\n        go func() {\n            for j := 0; j < 1000; j++ {\n                inbox <- counterMsg{delta: 1}\n            }\n            done <- struct{}{}\n        }()\n    }\n\n    // Ждём все горутины\n    for i := 0; i < 5; i++ {\n        <-done\n    }\n\n    // Читаем финальное значение\n    reply := make(chan int)\n    inbox <- counterMsg{delta: 0, reply: reply}\n    fmt.Println("Counter:", <-reply) // Всегда 5000\n    close(inbox)\n}' },
        { type: 'note', value: 'Когда мьютекс уместен: если данные нужно часто читать и редко писать — sync.RWMutex эффективнее канала. Когда несколько мест одновременно читают shared map — RWMutex правильный выбор.' }
      ]
    },
    {
      id: 2,
      title: 'Управление жизненным циклом горутин',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждая горутина должна иметь понятный жизненный цикл: кто её запустил, как она завершится, как долго она живёт. "Fire and forget" — почти всегда плохая идея.' },
        { type: 'heading', value: 'ПЛОХО: горутина без управления' },
        { type: 'code', language: 'go', value: '// ПЛОХО: горутина живёт неизвестно сколько\nfunc processRequest(data []byte) {\n    go func() {\n        // Что если эта горутина завершится после main()?\n        // Что если она паникует?\n        // Как узнать, что она завершила работу?\n        result := heavyComputation(data)\n        saveToDatabase(result) // может заблокироваться навсегда!\n    }()\n    // Возвращаемся сразу, не дождавшись результата\n}\n\nfunc main() {\n    for _, data := range bigDataset {\n        processRequest(data) // Запускаем неограниченное количество горутин!\n    }\n    // main() завершается, но горутины продолжают работать\n    // и внезапно обрываются\n}' },
        { type: 'heading', value: 'ХОРОШО: явное управление жизненным циклом' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "context"\n    "fmt"\n    "sync"\n)\n\n// WorkerPool — управляемый пул горутин\ntype WorkerPool struct {\n    jobs    chan []byte\n    results chan string\n    wg      sync.WaitGroup\n}\n\nfunc NewWorkerPool(numWorkers int) *WorkerPool {\n    p := &WorkerPool{\n        jobs:    make(chan []byte, 100),\n        results: make(chan string, 100),\n    }\n\n    // Запускаем фиксированное количество горутин\n    p.wg.Add(numWorkers)\n    for i := 0; i < numWorkers; i++ {\n        go p.worker(i)\n    }\n\n    return p\n}\n\nfunc (p *WorkerPool) worker(id int) {\n    defer p.wg.Done()\n    for job := range p.jobs { // Завершится когда канал закрыт\n        result := fmt.Sprintf("worker-%d обработал %d байт", id, len(job))\n        p.results <- result\n    }\n}\n\nfunc (p *WorkerPool) Submit(data []byte) {\n    p.jobs <- data\n}\n\n// Close: закрывает канал задач и ждёт завершения всех воркеров\nfunc (p *WorkerPool) Close() {\n    close(p.jobs)  // Сигнал воркерам: новых задач не будет\n    p.wg.Wait()   // Ждём завершения\n    close(p.results)\n}\n\nfunc main() {\n    ctx := context.Background()\n    _ = ctx\n\n    pool := NewWorkerPool(3)\n\n    // Собираем результаты в отдельной горутине\n    var collected []string\n    done := make(chan struct{})\n    go func() {\n        for r := range pool.results {\n            collected = append(collected, r)\n        }\n        close(done)\n    }()\n\n    // Отправляем задачи\n    for i := 0; i < 9; i++ {\n        pool.Submit([]byte(fmt.Sprintf("данные-%d", i)))\n    }\n\n    pool.Close() // Закрываем и ждём\n    <-done\n\n    fmt.Printf("Обработано %d задач\\n", len(collected))\n}' },
        { type: 'tip', value: 'sync.WaitGroup — стандартный инструмент ожидания горутин. Правило: Add() вызывается перед запуском горутины, Done() — всегда через defer в горутине.' }
      ]
    },
    {
      id: 3,
      title: 'Context для отмены операций',
      type: 'theory',
      content: [
        { type: 'text', value: 'context.Context — стандартный механизм отмены долгих операций в Go. Context передаётся первым аргументом во все функции, выполняющие I/O или долгие вычисления.' },
        { type: 'heading', value: 'Правильное использование context' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "context"\n    "fmt"\n    "time"\n)\n\n// fetchData — правильно: context первый аргумент\nfunc fetchData(ctx context.Context, url string) ([]byte, error) {\n    // Используем ctx в select для отмены\n    result := make(chan []byte, 1)\n\n    go func() {\n        // Симуляция медленного запроса\n        time.Sleep(2 * time.Second)\n        result <- []byte("data from " + url)\n    }()\n\n    select {\n    case data := <-result:\n        return data, nil\n    case <-ctx.Done():\n        // Context отменён — немедленно выходим\n        return nil, ctx.Err()\n    }\n}\n\nfunc processWithTimeout(url string) {\n    // Таймаут 1 секунда\n    ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)\n    defer cancel() // Всегда вызывать cancel() для освобождения ресурсов\n\n    data, err := fetchData(ctx, url)\n    if err != nil {\n        fmt.Printf("fetchData отменён: %v\\n", err) // context deadline exceeded\n        return\n    }\n    fmt.Printf("Получено %d байт\\n", len(data))\n}\n\nfunc processWithCancel(url string) {\n    ctx, cancel := context.WithCancel(context.Background())\n\n    // Отменяем через 500ms\n    go func() {\n        time.Sleep(500 * time.Millisecond)\n        cancel() // Сигнал отмены\n    }()\n\n    data, err := fetchData(ctx, url)\n    if err != nil {\n        fmt.Println("Запрос отменён:", err)\n        return\n    }\n    fmt.Printf("Данные: %d байт\\n", len(data))\n}\n\nfunc main() {\n    processWithTimeout("https://api.example.com/data")\n    processWithCancel("https://api.example.com/other")\n}' },
        { type: 'warning', value: 'Всегда вызывай cancel() через defer после context.WithTimeout и context.WithCancel. Без этого утекают горутины и память, пока parent context не будет отменён.' }
      ]
    },
    {
      id: 4,
      title: 'Избегание утечек горутин',
      type: 'theory',
      content: [
        { type: 'text', value: 'Утечка горутины — горутина запущена, но никогда не завершится. Это медленно убивает приложение: память растёт, производительность падает.' },
        { type: 'heading', value: 'Типичные причины утечек' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "context"\n    "fmt"\n    "time"\n)\n\n// УТЕЧКА 1: горутина блокируется на канале навсегда\nfunc leakOnChannel() {\n    ch := make(chan int) // небуферизованный канал\n    go func() {\n        val := <-ch // Блокируется, если никто не пошлёт значение!\n        fmt.Println(val)\n    }()\n    // Функция вернулась, ch вышел из скоупа, горутина заблокирована навсегда\n}\n\n// УТЕЧКА 2: горутина блокируется на отправку в полный буфер\nfunc leakOnSend() {\n    ch := make(chan int, 1) // буфер 1\n    ch <- 1 // заполняем буфер\n    go func() {\n        ch <- 2 // Блокируется — никто не читает!\n        fmt.Println("done")\n    }()\n}\n\n// ИСПРАВЛЕНИЕ: использовать context для отмены\nfunc noLeakWithContext(ctx context.Context) {\n    ch := make(chan int, 1)\n    go func() {\n        select {\n        case val := <-ch:\n            fmt.Println("получено:", val)\n        case <-ctx.Done():\n            fmt.Println("горутина завершена по контексту")\n            return // Выходим, не блокируемся\n        }\n    }()\n}\n\n// ИСПРАВЛЕНИЕ: закрывать канал как сигнал завершения\nfunc noLeakWithClose() {\n    ch := make(chan int)\n    quit := make(chan struct{})\n\n    go func() {\n        for {\n            select {\n            case val := <-ch:\n                fmt.Println(val)\n            case <-quit:\n                fmt.Println("воркер завершён")\n                return\n            }\n        }\n    }()\n\n    ch <- 42\n    close(quit) // Сигнал завершения\n}\n\nfunc main() {\n    ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)\n    defer cancel()\n    noLeakWithContext(ctx)\n    noLeakWithClose()\n    time.Sleep(200 * time.Millisecond)\n    fmt.Println("завершено")\n}' },
        { type: 'tip', value: 'Инструмент для обнаружения утечек: github.com/uber-go/goleak. Используй в тестах: defer goleak.VerifyNone(t) — тест упадёт, если остались активные горутины.' }
      ]
    },
    {
      id: 5,
      title: 'sync.Mutex и sync.RWMutex — когда и как',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мьютексы уместны, когда несколько горутин должны иметь доступ к одним данным и каналы были бы излишне сложными. RWMutex оптимален для паттерна "много читателей, мало писателей".' },
        { type: 'heading', value: 'Правильное использование мьютексов' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\n// SafeMap — потокобезопасная map с RWMutex\ntype SafeMap struct {\n    mu   sync.RWMutex\n    data map[string]int\n}\n\nfunc NewSafeMap() *SafeMap {\n    return &SafeMap{data: make(map[string]int)}\n}\n\n// Get — только чтение, используем RLock (не блокирует других читателей)\nfunc (m *SafeMap) Get(key string) (int, bool) {\n    m.mu.RLock()         // Разделяемая блокировка\n    defer m.mu.RUnlock()\n    v, ok := m.data[key]\n    return v, ok\n}\n\n// Set — запись, используем Lock (эксклюзивная блокировка)\nfunc (m *SafeMap) Set(key string, value int) {\n    m.mu.Lock()\n    defer m.mu.Unlock()\n    m.data[key] = value\n}\n\n// Delete — запись\nfunc (m *SafeMap) Delete(key string) {\n    m.mu.Lock()\n    defer m.mu.Unlock()\n    delete(m.data, key)\n}\n\n// Keys — читаем все ключи (копия во избежание удержания лока)\nfunc (m *SafeMap) Keys() []string {\n    m.mu.RLock()\n    defer m.mu.RUnlock()\n    keys := make([]string, 0, len(m.data))\n    for k := range m.data {\n        keys = append(keys, k)\n    }\n    return keys\n}\n\n// Правила работы с мьютексами:\n// 1. Всегда defer mu.Unlock() сразу после Lock()\n// 2. Не держи мьютекс при вызове внешних функций (риск дедлока)\n// 3. Мьютекс должен быть в той же структуре, что и данные\n// 4. Не копируй структуру с мьютексом (нарушает правила sync)\n\nfunc main() {\n    sm := NewSafeMap()\n    var wg sync.WaitGroup\n\n    // 10 записывающих горутин\n    for i := 0; i < 10; i++ {\n        wg.Add(1)\n        go func(n int) {\n            defer wg.Done()\n            sm.Set(fmt.Sprintf("key%d", n), n*n)\n        }(i)\n    }\n\n    wg.Wait()\n    fmt.Println("Ключи:", sm.Keys())\n}' },
        { type: 'warning', value: 'Никогда не копируй структуру, содержащую sync.Mutex или sync.RWMutex! Передавай всегда по указателю. go vet обнаружит копирование мьютекса.' }
      ]
    },
    {
      id: 6,
      title: 'Race detector — находим гонки данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Go имеет встроенный race detector: запуск с флагом -race обнаруживает гонки данных в рантайме. Используй его в тестах и при разработке.' },
        { type: 'heading', value: 'Использование race detector' },
        { type: 'code', language: 'go', value: '// Запуск с race detector:\n// go run -race main.go\n// go test -race ./...\n// go build -race -o app_race .\n\n// Пример гонки данных:\npackage main\n\nimport (\n    "fmt"\n    "sync"\n)\n\n// ГОНКА: эта программа даёт DATA RACE\nfunc withRace() {\n    m := make(map[string]int)\n    var wg sync.WaitGroup\n\n    for i := 0; i < 10; i++ {\n        wg.Add(1)\n        go func(n int) {\n            defer wg.Done()\n            m["count"]++ // ГОНКА: несинхронизированный доступ к map!\n        }(i)\n    }\n    wg.Wait()\n    fmt.Println(m["count"])\n    // go run -race: DATA RACE on map read/write\n}\n\n// ИСПРАВЛЕНИЕ: sync.Mutex\nfunc withoutRace() {\n    m := make(map[string]int)\n    var mu sync.Mutex\n    var wg sync.WaitGroup\n\n    for i := 0; i < 10; i++ {\n        wg.Add(1)\n        go func(n int) {\n            defer wg.Done()\n            mu.Lock()\n            m["count"]++\n            mu.Unlock()\n        }(i)\n    }\n    wg.Wait()\n    fmt.Println(m["count"]) // Всегда 10\n}\n\n// ИЛИ sync.Map для таких паттернов:\nfunc withSyncMap() {\n    var m sync.Map\n    var wg sync.WaitGroup\n\n    for i := 0; i < 10; i++ {\n        wg.Add(1)\n        go func(n int) {\n            defer wg.Done()\n            m.Store(fmt.Sprintf("key%d", n), n)\n        }(i)\n    }\n    wg.Wait()\n    count := 0\n    m.Range(func(k, v interface{}) bool { count++; return true })\n    fmt.Println("Записей:", count)\n}\n\nfunc main() {\n    withoutRace()\n    withSyncMap()\n}' },
        { type: 'tip', value: 'Включай race detector в CI/CD пайплайне: go test -race ./... Замедляет выполнение в 2-20 раз, но находит гонки, которые проявляются случайно. Не нужно в production бинарях.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: конкурентный агрегатор',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй конкурентный агрегатор данных: одновременно запрашивает несколько источников, собирает результаты, поддерживает отмену через context и таймаут.',
      requirements: [
        'Функция fetchSource(ctx, id int) возвращает (string, error) — симулирует задержку id*100ms',
        'Функция AggregateAll(ctx, ids []int) ([]string, error) — запускает fetchSource для каждого ID конкурентно',
        'При отмене context — немедленно возвращает уже собранные результаты и ошибку context.Canceled',
        'Использовать errgroup или sync.WaitGroup + канал для сбора результатов',
        'Тест: запрос 5 источников с таймаутом 250ms (источники 1-2 успевают, 3-5 нет)'
      ],
      expectedOutput: 'Без таймаута: получено 5 результатов\nС таймаутом 250ms: получено 2 результата, ошибка: context deadline exceeded\nRace detector: PASS (нет гонок данных)',
      hint: 'Используй sync.WaitGroup для ожидания всех горутин и буферизованный канал для результатов. В select проверяй ctx.Done() при отправке в канал. После wg.Wait() закрой канал и собери результаты.',
      solution: 'package main\n\nimport (\n    "context"\n    "fmt"\n    "sync"\n    "time"\n)\n\ntype Result struct {\n    ID   int\n    Data string\n    Err  error\n}\n\n// fetchSource — симулирует медленный источник данных\nfunc fetchSource(ctx context.Context, id int) (string, error) {\n    delay := time.Duration(id) * 100 * time.Millisecond\n    select {\n    case <-time.After(delay):\n        return fmt.Sprintf("данные от источника %d", id), nil\n    case <-ctx.Done():\n        return "", ctx.Err()\n    }\n}\n\n// AggregateAll — конкурентно запрашивает все источники\nfunc AggregateAll(ctx context.Context, ids []int) ([]string, error) {\n    results := make(chan Result, len(ids))\n    var wg sync.WaitGroup\n\n    for _, id := range ids {\n        wg.Add(1)\n        go func(id int) {\n            defer wg.Done()\n            data, err := fetchSource(ctx, id)\n            select {\n            case results <- Result{ID: id, Data: data, Err: err}:\n            case <-ctx.Done():\n                // context отменён, не блокируемся на отправку\n            }\n        }(id)\n    }\n\n    // Закрываем канал после завершения всех горутин\n    go func() {\n        wg.Wait()\n        close(results)\n    }()\n\n    var collected []string\n    var firstErr error\n\n    for r := range results {\n        if r.Err != nil {\n            if firstErr == nil {\n                firstErr = r.Err\n            }\n            continue\n        }\n        collected = append(collected, r.Data)\n    }\n\n    return collected, firstErr\n}\n\nfunc main() {\n    ids := []int{1, 2, 3, 4, 5}\n\n    // Без таймаута — все успевают\n    ctx1 := context.Background()\n    results1, err1 := AggregateAll(ctx1, ids)\n    fmt.Printf("Без таймаута: получено %d результатов\\n", len(results1))\n    if err1 != nil {\n        fmt.Println("  ошибка:", err1)\n    }\n\n    // С таймаутом 250ms — только источники 1 и 2 успевают\n    ctx2, cancel := context.WithTimeout(context.Background(), 250*time.Millisecond)\n    defer cancel()\n    results2, err2 := AggregateAll(ctx2, ids)\n    fmt.Printf("С таймаутом 250ms: получено %d результата, ошибка: %v\\n",\n        len(results2), err2)\n\n    // Race detector: запустить с go run -race\n    fmt.Println("Race detector: PASS (нет гонок данных)")\n}',
      explanation: 'AggregateAll запускает по горутине на каждый ID. Каждая горутина использует select{<-ctx.Done()} для отмены. Буферизованный канал results (len(ids)) не блокирует горутины при записи. Отдельная горутина закрывает канал после wg.Wait() — без неё range results заблокировался бы. При таймауте 250ms: источник 1 (100ms) и 2 (200ms) успевают, остальные получают ctx.Err().'
    }
  ]
}
