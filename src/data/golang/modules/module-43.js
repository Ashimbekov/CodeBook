export default {
  id: 43,
  title: 'sync.Once, Pool, Map',
  description: 'Три специализированных примитива пакета sync: Once для гарантированной однократной инициализации, Pool для переиспользования объектов, Map для безопасных конкурентных карт.',
  lessons: [
    {
      id: 1,
      title: 'sync.Once — однократная инициализация',
      type: 'theory',
      content: [
        { type: 'text', value: 'sync.Once гарантирует, что функция будет выполнена ровно один раз, даже если её вызывают несколько горутин одновременно. Это идеальный инструмент для паттерна Singleton.' },
        { type: 'tip', value: 'sync.Once как кнопка старта на ракете: сколько бы людей ни нажимали её одновременно — запуск произойдёт только один раз. Все остальные нажатия просто игнорируются.' },
        { type: 'heading', value: 'Базовый пример: синглтон' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\ntype Database struct {\n    connection string\n}\n\nvar (\n    instance *Database\n    once     sync.Once\n)\n\nfunc GetDatabase() *Database {\n    once.Do(func() {\n        // Этот код выполнится ТОЛЬКО ОДИН РАЗ\n        fmt.Println("Инициализация подключения к БД...")\n        instance = &Database{connection: "postgres://localhost/mydb"}\n    })\n    return instance\n}\n\nfunc main() {\n    var wg sync.WaitGroup\n\n    // 10 горутин пытаются получить экземпляр\n    for i := 0; i < 10; i++ {\n        wg.Add(1)\n        go func(n int) {\n            defer wg.Done()\n            db := GetDatabase()\n            fmt.Printf("Горутина %d получила БД: %s\\n", n, db.connection)\n        }(i)\n    }\n\n    wg.Wait()\n    // "Инициализация..." выведется только один раз!\n}' },
        { type: 'heading', value: 'Почему не использовать init()?' },
        { type: 'code', language: 'go', value: '// init() выполняется при загрузке пакета — даже если объект не нужен\n// Once.Do() создаёт объект лениво — только при первом обращении\n\n// Без Once: не потокобезопасно!\nvar lazyInstance *Database\n\nfunc GetDBUnsafe() *Database {\n    if lazyInstance == nil {     // Гонка данных!\n        lazyInstance = &Database{} // Несколько горутин создадут объект\n    }\n    return lazyInstance\n}\n\n// С Once: потокобезопасно и лениво\nfunc GetDBSafe() *Database {\n    once.Do(func() {\n        lazyInstance = &Database{connection: "safe"}\n    })\n    return lazyInstance\n}' },
        { type: 'warning', value: 'sync.Once нельзя сбросить или использовать повторно. Если нужна перезагружаемая инициализация — используй атомарные операции или Mutex вместо Once.' }
      ]
    },
    {
      id: 2,
      title: 'sync.Pool — переиспользование объектов',
      type: 'theory',
      content: [
        { type: 'text', value: 'sync.Pool — временный пул объектов для переиспользования. Он снижает нагрузку на сборщик мусора, позволяя повторно использовать уже созданные объекты.' },
        { type: 'tip', value: 'sync.Pool как прокат велосипедов: вернул велосипед — его заберёт следующий клиент. Не нужно строить новый велосипед (выделять память) для каждого клиента. Но пул не гарантирует сохранность объектов между циклами GC.' },
        { type: 'heading', value: 'Пул байтовых буферов' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "bytes"\n    "fmt"\n    "sync"\n)\n\nvar bufPool = sync.Pool{\n    New: func() interface{} {\n        // Вызывается когда в пуле нет свободных объектов\n        fmt.Println("Создаём новый буфер")\n        return new(bytes.Buffer)\n    },\n}\n\nfunc processData(data string) string {\n    // Берём буфер из пула\n    buf := bufPool.Get().(*bytes.Buffer)\n    defer func() {\n        buf.Reset()      // очищаем перед возвратом\n        bufPool.Put(buf) // возвращаем в пул\n    }()\n\n    buf.WriteString("Обработано: ")\n    buf.WriteString(data)\n    return buf.String()\n}\n\nfunc main() {\n    var wg sync.WaitGroup\n\n    for i := 0; i < 5; i++ {\n        wg.Add(1)\n        go func(n int) {\n            defer wg.Done()\n            result := processData(fmt.Sprintf("данные_%d", n))\n            fmt.Println(result)\n        }(i)\n    }\n\n    wg.Wait()\n}' },
        { type: 'heading', value: 'Когда использовать sync.Pool' },
        { type: 'list', value: 'Используй Pool когда: объекты дорого создавать (большие буферы, структуры); объекты создаются и уничтожаются очень часто; высокая нагрузка на GC из-за аллокаций.\nНе используй Pool для: постоянного хранения (GC может очистить пул в любой момент); объектов с состоянием, которое нельзя сбросить; простых значений (int, bool — накладные расходы выше пользы).' },
        { type: 'warning', value: 'После Get() объект может быть в любом состоянии. Всегда сбрасывай объект перед использованием (buf.Reset()). После Put() объект не принадлежит тебе — не используй его!' }
      ]
    },
    {
      id: 3,
      title: 'sync.Map — конкурентная карта',
      type: 'theory',
      content: [
        { type: 'text', value: 'sync.Map — специализированная карта, оптимизированная для двух сценариев: запись один раз — чтение много раз, и когда разные горутины работают с разными ключами.' },
        { type: 'heading', value: 'API sync.Map' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\nfunc main() {\n    var sm sync.Map\n\n    // Store: запись\n    sm.Store("name", "Нурдаулет")\n    sm.Store("age", 25)\n    sm.Store("city", "Алматы")\n\n    // Load: чтение\n    if val, ok := sm.Load("name"); ok {\n        fmt.Println("Имя:", val.(string))\n    }\n\n    // LoadOrStore: атомарно загрузить или сохранить\n    actual, loaded := sm.LoadOrStore("name", "Другое имя")\n    fmt.Printf("Загружено: %v, Существовало: %v\\n", actual, loaded)\n    // loaded = true — значит ключ уже был\n\n    // Delete: удаление\n    sm.Delete("city")\n\n    // Range: перебор всех элементов\n    sm.Range(func(key, value interface{}) bool {\n        fmt.Printf("  %v: %v\\n", key, value)\n        return true // вернуть false — прервать итерацию\n    })\n\n    // LoadAndDelete: атомарно загрузить и удалить\n    if val, ok := sm.LoadAndDelete("age"); ok {\n        fmt.Println("Удалено значение:", val)\n    }\n}' },
        { type: 'heading', value: 'Конкурентное использование' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "strconv"\n)\n\nfunc main() {\n    var sm sync.Map\n    var wg sync.WaitGroup\n\n    // 100 горутин параллельно пишут\n    for i := 0; i < 100; i++ {\n        wg.Add(1)\n        go func(n int) {\n            defer wg.Done()\n            key := "key" + strconv.Itoa(n)\n            sm.Store(key, n*n)\n        }(i)\n    }\n\n    // 100 горутин параллельно читают\n    for i := 0; i < 100; i++ {\n        wg.Add(1)\n        go func(n int) {\n            defer wg.Done()\n            key := "key" + strconv.Itoa(n)\n            sm.Load(key) // может не найти — это нормально\n        }(i)\n    }\n\n    wg.Wait()\n\n    count := 0\n    sm.Range(func(k, v interface{}) bool {\n        count++\n        return true\n    })\n    fmt.Printf("Итоговых элементов: %d\\n", count)\n}' },
        { type: 'warning', value: 'sync.Map не подходит для всех случаев. Если нужен len(map) или частые обновления существующих ключей — обычная map с RWMutex эффективнее. sync.Map оптимизирован для специфических паттернов доступа.' }
      ]
    },
    {
      id: 4,
      title: 'sync.Map vs map+RWMutex',
      type: 'theory',
      content: [
        { type: 'text', value: 'sync.Map и map+RWMutex решают одну задачу, но оптимизированы для разных сценариев. Важно понимать, когда использовать каждый вариант.' },
        { type: 'heading', value: 'Сравнение производительности' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "testing"\n)\n\n// Вариант 1: map + RWMutex\ntype RWMap struct {\n    mu   sync.RWMutex\n    data map[string]int\n}\n\nfunc (m *RWMap) Load(key string) (int, bool) {\n    m.mu.RLock()\n    defer m.mu.RUnlock()\n    v, ok := m.data[key]\n    return v, ok\n}\n\nfunc (m *RWMap) Store(key string, val int) {\n    m.mu.Lock()\n    defer m.mu.Unlock()\n    m.data[key] = val\n}\n\nfunc (m *RWMap) Len() int {\n    m.mu.RLock()\n    defer m.mu.RUnlock()\n    return len(m.data) // sync.Map не имеет Len()!\n}\n\nfunc main() {\n    _ = testing.Benchmark // упоминание для контекста\n\n    rwMap := &RWMap{data: make(map[string]int)}\n    var syncMap sync.Map\n\n    // Одновременное использование\n    rwMap.Store("key", 42)\n    syncMap.Store("key", 42)\n\n    v1, _ := rwMap.Load("key")\n    v2, _ := syncMap.Load("key")\n\n    fmt.Printf("RWMap: %d, SyncMap: %d\\n", v1, v2.(int))\n    fmt.Printf("RWMap Len: %d (sync.Map не имеет Len)\\n", rwMap.Len())\n}' },
        { type: 'heading', value: 'Таблица выбора' },
        { type: 'list', value: 'sync.Map лучше когда: записи редки, чтений много; ключи стабильны (пишутся один раз); разные горутины работают с разными ключами (sharded access).\nmap+RWMutex лучше когда: нужен len(map); частые обновления; сложная логика (несколько операций атомарно); нужны типизированные ключи без interface{}.' },
        { type: 'tip', value: 'По умолчанию начинай с map+RWMutex — это понятнее и гибче. Переходи к sync.Map только если профилировщик показывает, что это узкое место.' }
      ]
    },
    {
      id: 5,
      title: 'Паттерн: ленивая инициализация с Once',
      type: 'theory',
      content: [
        { type: 'text', value: 'sync.Once особенно полезен для ленивой инициализации — когда создание объекта дорого и нужно выполнить его только при первом обращении.' },
        { type: 'heading', value: 'Сервис с ленивой конфигурацией' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\ntype AppConfig struct {\n    DBHost   string\n    DBPort   int\n    LogLevel string\n}\n\ntype App struct {\n    configOnce sync.Once\n    config     *AppConfig\n    dbOnce     sync.Once\n    db         *Database\n}\n\ntype Database struct{ host string }\n\nfunc (a *App) Config() *AppConfig {\n    a.configOnce.Do(func() {\n        fmt.Println("Загрузка конфигурации...")\n        // В реальности: чтение из файла, переменных окружения\n        a.config = &AppConfig{\n            DBHost:   "localhost",\n            DBPort:   5432,\n            LogLevel: "info",\n        }\n    })\n    return a.config\n}\n\nfunc (a *App) DB() *Database {\n    a.dbOnce.Do(func() {\n        cfg := a.Config() // Config тоже инициализируется лениво\n        fmt.Printf("Подключение к БД %s:%d...\\n", cfg.DBHost, cfg.DBPort)\n        a.db = &Database{host: cfg.DBHost}\n    })\n    return a.db\n}\n\nfunc main() {\n    app := &App{}\n\n    var wg sync.WaitGroup\n    for i := 0; i < 5; i++ {\n        wg.Add(1)\n        go func() {\n            defer wg.Done()\n            db := app.DB() // первый вызов инициализирует\n            fmt.Printf("Использую БД: %s\\n", db.host)\n        }()\n    }\n    wg.Wait()\n    // "Загрузка конфигурации..." — один раз\n    // "Подключение к БД..." — один раз\n}' }
      ]
    },
    {
      id: 6,
      title: 'Практика: пул воркеров с sync.Pool',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай систему обработки HTTP-запросов, которая использует sync.Pool для повторного использования буферов ответа, и sync.Once для инициализации сервиса.',
      requirements: [
        'Создай ResponseBuffer с полем bytes.Buffer и методом Reset()',
        'Создай sync.Pool для ResponseBuffer с функцией New',
        'Создай Service с sync.Once для инициализации конфигурации',
        'Метод HandleRequest(id int) должен: взять буфер из пула, записать ответ, вывести, вернуть буфер в пул',
        'Запусти 10 параллельных "запросов" через горутины'
      ],
      expectedOutput: 'Сервис инициализирован (один раз)\nОбрабатываю запрос 1: OK\nОбрабатываю запрос 2: OK\n... (10 запросов)',
      hint: 'В Pool.New создай new(ResponseBuffer). В HandleRequest: buf := pool.Get().(*ResponseBuffer), defer pool.Put(buf). Сбрасывай буфер через buf.Reset() перед использованием.',
      solution: 'package main\n\nimport (\n    "bytes"\n    "fmt"\n    "sync"\n)\n\ntype ResponseBuffer struct {\n    bytes.Buffer\n}\n\nfunc (r *ResponseBuffer) Reset() {\n    r.Buffer.Reset()\n}\n\ntype Service struct {\n    once   sync.Once\n    config string\n    pool   sync.Pool\n}\n\nfunc NewService() *Service {\n    s := &Service{}\n    s.pool = sync.Pool{\n        New: func() interface{} {\n            return new(ResponseBuffer)\n        },\n    }\n    return s\n}\n\nfunc (s *Service) init() {\n    s.once.Do(func() {\n        s.config = "v1.0"\n        fmt.Println("Сервис инициализирован (один раз)")\n    })\n}\n\nfunc (s *Service) HandleRequest(id int) {\n    s.init()\n    buf := s.pool.Get().(*ResponseBuffer)\n    buf.Reset()\n    defer s.pool.Put(buf)\n\n    fmt.Fprintf(buf, "Запрос %d обработан версией %s", id, s.config)\n    fmt.Printf("Обрабатываю запрос %d: OK\\n", id)\n}\n\nfunc main() {\n    svc := NewService()\n    var wg sync.WaitGroup\n\n    for i := 1; i <= 10; i++ {\n        wg.Add(1)\n        go func(reqID int) {\n            defer wg.Done()\n            svc.HandleRequest(reqID)\n        }(i)\n    }\n    wg.Wait()\n}',
      explanation: 'sync.Pool устраняет лишние аллокации: буферы создаются редко (только при пустом пуле), а переиспользуются часто. sync.Once гарантирует однократную инициализацию конфигурации. Ключевое: всегда сбрасывать объект (buf.Reset()) перед использованием — объект из пула может содержать данные от предыдущего использования.'
    }
  ]
}
