export default {
  id: 44,
  title: 'Context',
  description: 'Управление жизненным циклом операций через context: отмена, таймауты, дедлайны, передача значений. Правильное использование контекста в HTTP и конкурентном коде.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Context и зачем он нужен',
      type: 'theory',
      content: [
        { type: 'text', value: 'Context в Go — это механизм передачи сигналов отмены, дедлайнов и значений через цепочку вызовов функций. Он решает проблему "как остановить работу, которую уже начали".' },
        { type: 'tip', value: 'Context как пульт управления для операции. Пользователь нажал "отмена" в браузере — HTTP сервер получает сигнал, передаёт его в сервис, тот — в базу данных. Все части цепочки корректно останавливаются вместо того, чтобы продолжать бесполезную работу.' },
        { type: 'heading', value: 'Проблема без контекста' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\n// Без контекста: как остановить долгую операцию?\nfunc fetchData() string {\n    time.Sleep(10 * time.Second) // долгая операция\n    return "данные"\n}\n\n// Если пользователь отменил запрос через 2 секунды\n// — fetchData() продолжает работать ещё 8 секунд напрасно\nfunc main() {\n    // Нет способа отменить fetchData() изнутри main()\n    result := fetchData()\n    fmt.Println(result)\n}' },
        { type: 'heading', value: 'Context в стандартной библиотеке' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "context"\n    "fmt"\n    "net/http"\n)\n\n// context.Context — интерфейс с 4 методами:\n// Deadline() (deadline time.Time, ok bool)\n// Done() <-chan struct{}\n// Err() error\n// Value(key any) any\n\nfunc handler(w http.ResponseWriter, r *http.Request) {\n    ctx := r.Context() // контекст запроса\n    // Если клиент закрыл соединение — ctx.Done() закроется\n    select {\n    case <-ctx.Done():\n        fmt.Println("Клиент отменил запрос:", ctx.Err())\n        return\n    default:\n        fmt.Fprintln(w, "OK")\n    }\n}' }
      ]
    },
    {
      id: 2,
      title: 'context.Background и context.TODO',
      type: 'theory',
      content: [
        { type: 'text', value: 'context.Background() и context.TODO() — два пустых контекста, которые служат корневыми узлами для дерева контекстов. Они никогда не отменяются.' },
        { type: 'heading', value: 'Background и TODO' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "context"\n    "fmt"\n)\n\nfunc main() {\n    // Background: корневой контекст программы\n    // Используется в main(), при инициализации, в тестах\n    bgCtx := context.Background()\n    fmt.Println("Background:", bgCtx)\n\n    // TODO: "заглушка" когда ещё не решили какой контекст использовать\n    // Сигнализирует: "здесь должен быть контекст, но я его ещё не добавил"\n    todoCtx := context.TODO()\n    fmt.Println("TODO:", todoCtx)\n\n    // Оба пусты — не отменяются, нет дедлайна\n    _, ok := bgCtx.Deadline()\n    fmt.Println("Background имеет дедлайн:", ok) // false\n\n    select {\n    case <-bgCtx.Done():\n        fmt.Println("Отменён")\n    default:\n        fmt.Println("Не отменён (ожидаемо)")\n    }\n}' },
        { type: 'tip', value: 'Правило: функция main() и запуск горутин используют context.Background(). context.TODO() используй как временную заглушку — linter напомнит заменить его.' },
        { type: 'heading', value: 'Контекст — первый параметр функции' },
        { type: 'code', language: 'go', value: '// Конвенция Go: ctx всегда первый параметр, называется ctx\nfunc QueryUser(ctx context.Context, id int) (*User, error) {\n    // ...\n    return nil, nil\n}\n\nfunc ProcessOrder(ctx context.Context, order Order) error {\n    // ...\n    return nil\n}\n\ntype User struct{ ID int }\ntype Order struct{ ID int }\n\n// НЕ хранить контекст в структуре!\n// ПЛОХО:\ntype Service struct {\n    ctx context.Context // ПЛОХО: контекст должен передаваться в вызовы\n}\n\n// ХОРОШО:\ntype GoodService struct{}\nfunc (s *GoodService) Do(ctx context.Context) error {\n    return nil\n}' }
      ]
    },
    {
      id: 3,
      title: 'context.WithCancel — ручная отмена',
      type: 'theory',
      content: [
        { type: 'text', value: 'context.WithCancel создаёт дочерний контекст с функцией отмены. Вызов cancel() сигнализирует всем, кто слушает ctx.Done(), что нужно прекратить работу.' },
        { type: 'heading', value: 'Базовое использование' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "context"\n    "fmt"\n    "time"\n)\n\nfunc longOperation(ctx context.Context, name string) {\n    for i := 0; ; i++ {\n        select {\n        case <-ctx.Done():\n            fmt.Printf("%s остановлена на итерации %d: %v\\n", name, i, ctx.Err())\n            return\n        default:\n            fmt.Printf("%s: итерация %d\\n", name, i)\n            time.Sleep(200 * time.Millisecond)\n        }\n    }\n}\n\nfunc main() {\n    ctx, cancel := context.WithCancel(context.Background())\n    defer cancel() // всегда вызывай cancel — иначе утечка ресурсов!\n\n    go longOperation(ctx, "Воркер-1")\n    go longOperation(ctx, "Воркер-2")\n\n    time.Sleep(600 * time.Millisecond)\n    fmt.Println("Отменяем все операции...")\n    cancel() // оба воркера получат сигнал\n\n    time.Sleep(100 * time.Millisecond)\n    fmt.Println("Готово")\n}' },
        { type: 'heading', value: 'Каскадная отмена' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "context"\n    "fmt"\n    "time"\n)\n\nfunc main() {\n    // Дерево контекстов: отмена родителя отменяет все дочерние\n    rootCtx, rootCancel := context.WithCancel(context.Background())\n    defer rootCancel()\n\n    child1Ctx, child1Cancel := context.WithCancel(rootCtx)\n    defer child1Cancel()\n\n    child2Ctx, _ := context.WithCancel(rootCtx) //nolint\n\n    go func() {\n        <-child1Ctx.Done()\n        fmt.Println("child1 отменён:", child1Ctx.Err())\n    }()\n\n    go func() {\n        <-child2Ctx.Done()\n        fmt.Println("child2 отменён:", child2Ctx.Err())\n    }()\n\n    time.Sleep(100 * time.Millisecond)\n    fmt.Println("Отменяем корневой контекст...")\n    rootCancel() // отменяет root, child1 И child2!\n\n    time.Sleep(100 * time.Millisecond)\n}' },
        { type: 'warning', value: 'Всегда вызывай cancel() — иначе утечка контекста и связанных ресурсов. Используй defer cancel() сразу после создания контекста.' }
      ]
    },
    {
      id: 4,
      title: 'context.WithTimeout и WithDeadline',
      type: 'theory',
      content: [
        { type: 'text', value: 'WithTimeout и WithDeadline автоматически отменяют контекст по истечении времени. WithTimeout задаёт длительность, WithDeadline — конкретный момент времени.' },
        { type: 'heading', value: 'WithTimeout — относительное время' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "context"\n    "fmt"\n    "time"\n)\n\nfunc callExternalAPI(ctx context.Context) (string, error) {\n    // Имитируем долгий API вызов\n    select {\n    case <-time.After(2 * time.Second):\n        return "результат API", nil\n    case <-ctx.Done():\n        return "", ctx.Err()\n    }\n}\n\nfunc main() {\n    // Таймаут 1 секунда — API отвечает за 2 секунды\n    ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)\n    defer cancel()\n\n    fmt.Println("Вызываем API...")\n    result, err := callExternalAPI(ctx)\n    if err != nil {\n        fmt.Println("Ошибка:", err) // context deadline exceeded\n        return\n    }\n    fmt.Println("Результат:", result)\n}' },
        { type: 'heading', value: 'WithDeadline — абсолютное время' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "context"\n    "fmt"\n    "time"\n)\n\nfunc main() {\n    // Дедлайн: ровно в 15:00 сегодня\n    deadline := time.Now().Add(500 * time.Millisecond)\n    ctx, cancel := context.WithDeadline(context.Background(), deadline)\n    defer cancel()\n\n    d, ok := ctx.Deadline()\n    fmt.Printf("Дедлайн установлен: %v, время до него: %v\\n", ok, time.Until(d))\n\n    select {\n    case <-time.After(1 * time.Second):\n        fmt.Println("Операция завершена")\n    case <-ctx.Done():\n        fmt.Println("Дедлайн истёк:", ctx.Err())\n    }\n}' },
        { type: 'heading', value: 'Цепочка таймаутов' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "context"\n    "fmt"\n    "time"\n)\n\nfunc queryDB(ctx context.Context) error {\n    select {\n    case <-time.After(300 * time.Millisecond):\n        return nil\n    case <-ctx.Done():\n        return ctx.Err()\n    }\n}\n\nfunc serveRequest(ctx context.Context) error {\n    // Запрос имеет таймаут 1 сек, но запрос к БД — только 200мс\n    dbCtx, cancel := context.WithTimeout(ctx, 200*time.Millisecond)\n    defer cancel()\n    return queryDB(dbCtx) // БД не успеет ответить за 200мс (нужно 300мс)\n}\n\nfunc main() {\n    ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)\n    defer cancel()\n\n    err := serveRequest(ctx)\n    fmt.Println("Результат:", err) // context deadline exceeded\n}' },
        { type: 'tip', value: 'Используй чёткие таймауты для каждого внешнего вызова (БД, API, кэш). Дочерний контекст никогда не живёт дольше родительского — если родитель истёк, дочерний тоже истечёт.' }
      ]
    },
    {
      id: 5,
      title: 'context.WithValue — передача значений',
      type: 'theory',
      content: [
        { type: 'text', value: 'context.WithValue позволяет прикрепить к контексту значение, которое будет доступно во всей цепочке вызовов. Типичные использования: request ID, userID, трассировка.' },
        { type: 'heading', value: 'Передача request ID' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "context"\n    "fmt"\n)\n\n// Используй приватный тип ключа — избегает конфликтов\ntype contextKey string\n\nconst (\n    RequestIDKey contextKey = "requestID"\n    UserIDKey    contextKey = "userID"\n)\n\nfunc middleware(ctx context.Context, requestID string) context.Context {\n    return context.WithValue(ctx, RequestIDKey, requestID)\n}\n\nfunc handler(ctx context.Context) {\n    reqID, ok := ctx.Value(RequestIDKey).(string)\n    if !ok {\n        fmt.Println("Request ID не найден")\n        return\n    }\n    fmt.Println("Обрабатываю запрос:", reqID)\n    processData(ctx)\n}\n\nfunc processData(ctx context.Context) {\n    // Контекст передаётся дальше — reqID доступен везде\n    reqID := ctx.Value(RequestIDKey).(string)\n    fmt.Println("Обрабатываю данные для запроса:", reqID)\n}\n\nfunc main() {\n    ctx := context.Background()\n    ctx = middleware(ctx, "req-12345")\n    ctx = context.WithValue(ctx, UserIDKey, 42)\n\n    handler(ctx)\n}' },
        { type: 'warning', value: 'context.WithValue — не замена параметрам функций! Используй его только для данных, относящихся к запросу (requestID, traceID, userID), а не для бизнес-логики. Значения из контекста не типизированы — нужно приведение типов с проверкой.' },
        { type: 'tip', value: 'Всегда используй приватный тип для ключей контекста (type contextKey string). Это предотвращает конфликты с другими пакетами, которые могут использовать строку "userID" как ключ.' }
      ]
    },
    {
      id: 6,
      title: 'Контекст в HTTP сервере',
      type: 'theory',
      content: [
        { type: 'text', value: 'HTTP сервер в Go автоматически создаёт контекст для каждого запроса. Когда клиент закрывает соединение — контекст отменяется, что позволяет освободить ресурсы.' },
        { type: 'heading', value: 'Реакция на отмену клиентом' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "context"\n    "fmt"\n    "net/http"\n    "time"\n)\n\nfunc slowHandler(w http.ResponseWriter, r *http.Request) {\n    ctx := r.Context()\n    fmt.Println("Начинаю обработку запроса")\n\n    // Долгая операция с уважением к контексту\n    select {\n    case <-time.After(5 * time.Second):\n        fmt.Fprintln(w, "Готово!")\n    case <-ctx.Done():\n        // Клиент закрыл соединение или таймаут\n        fmt.Println("Клиент отменил запрос:", ctx.Err())\n        http.Error(w, "Запрос отменён", http.StatusRequestTimeout)\n        return\n    }\n}\n\nfunc dbQuery(ctx context.Context, query string) ([]string, error) {\n    // Передаём контекст в запрос к БД\n    // В реальности: db.QueryContext(ctx, query)\n    select {\n    case <-time.After(100 * time.Millisecond):\n        return []string{"row1", "row2"}, nil\n    case <-ctx.Done():\n        return nil, fmt.Errorf("запрос отменён: %w", ctx.Err())\n    }\n}\n\nfunc apiHandler(w http.ResponseWriter, r *http.Request) {\n    ctx := r.Context()\n\n    // Устанавливаем таймаут для запроса к БД\n    dbCtx, cancel := context.WithTimeout(ctx, 200*time.Millisecond)\n    defer cancel()\n\n    rows, err := dbQuery(dbCtx, "SELECT * FROM users")\n    if err != nil {\n        http.Error(w, err.Error(), http.StatusInternalServerError)\n        return\n    }\n    fmt.Fprintf(w, "Строк: %d\\n", len(rows))\n}\n\nfunc main() {\n    http.HandleFunc("/slow", slowHandler)\n    http.HandleFunc("/api", apiHandler)\n    fmt.Println("Сервер на :8080")\n    http.ListenAndServe(":8080", nil)\n}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: обработка с таймаутом',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй функцию FetchAll, которая параллельно "загружает" данные из нескольких источников с общим таймаутом. Если таймаут истекает — возвращаются только успевшие результаты.',
      requirements: [
        'Функция FetchAll(ctx context.Context, sources []string) []string',
        'Каждый источник обрабатывается в отдельной горутине',
        'Задержка для каждого источника: i*100 миллисекунд (source[0]=0мс, source[1]=100мс...)',
        'Общий таймаут через context.WithTimeout — 350 миллисекунд',
        'Верни только те результаты, которые успели загрузиться до таймаута'
      ],
      expectedOutput: 'Загружено источников: 4\nРезультаты: [source_0 source_1 source_2 source_3]\n(source_4 не успел)',
      hint: 'Используй буферизованный канал results := make(chan string, len(sources)). В горутине: select { case results <- val; case <-ctx.Done(): return }. После WaitGroup.Wait() читай из канала.',
      solution: 'package main\n\nimport (\n    "context"\n    "fmt"\n    "sync"\n    "time"\n)\n\nfunc fetchSource(ctx context.Context, source string, delay time.Duration, results chan<- string, wg *sync.WaitGroup) {\n    defer wg.Done()\n    select {\n    case <-time.After(delay):\n        select {\n        case results <- source:\n        case <-ctx.Done():\n        }\n    case <-ctx.Done():\n        return\n    }\n}\n\nfunc FetchAll(ctx context.Context, sources []string) []string {\n    results := make(chan string, len(sources))\n    var wg sync.WaitGroup\n\n    for i, source := range sources {\n        wg.Add(1)\n        go fetchSource(ctx, source, time.Duration(i)*100*time.Millisecond, results, &wg)\n    }\n\n    go func() {\n        wg.Wait()\n        close(results)\n    }()\n\n    var out []string\n    for r := range results {\n        out = append(out, r)\n    }\n    return out\n}\n\nfunc main() {\n    sources := []string{"source_0", "source_1", "source_2", "source_3", "source_4"}\n    // source_0: 0мс, source_1: 100мс, source_2: 200мс, source_3: 300мс, source_4: 400мс\n    // Таймаут 350мс — успеют source_0..3\n\n    ctx, cancel := context.WithTimeout(context.Background(), 350*time.Millisecond)\n    defer cancel()\n\n    results := FetchAll(ctx, sources)\n    fmt.Printf("Загружено источников: %d\\n", len(results))\n    fmt.Printf("Результаты: %v\\n", results)\n    fmt.Println("(source_4 не успел)")\n}',
      explanation: 'Двойной select в fetchSource: первый ждёт либо таймера, либо отмены контекста. Если таймер сработал — второй select пытается отправить в канал (или молча завершается если контекст уже отменён). Горутина-закрыватель ждёт всех воркеров через WaitGroup, затем закрывает канал. Чтение range results заканчивается при закрытии канала — собираем только успевшие результаты.'
    }
  ]
}
