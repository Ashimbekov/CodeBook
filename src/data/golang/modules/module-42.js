export default {
  id: 42,
  title: 'sync.Mutex и RWMutex',
  description: 'Защита разделяемых данных от гонок данных: Mutex, RWMutex, паттерн defer Unlock, избегание дедлоков и лучшие практики безопасной конкурентности.',
  lessons: [
    {
      id: 1,
      title: 'Гонки данных (race conditions)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Гонка данных — это когда две или более горутины одновременно обращаются к одной переменной, и хотя бы одна из них производит запись. Результат становится непредсказуемым.' },
        { type: 'tip', value: 'Представь двух кассиров в банке, работающих с одним счётом без координации. Оба видят баланс 1000 тг, оба снимают 500 тг — в итоге баланс 500 тг вместо 0. Это классическая гонка данных.' },
        { type: 'heading', value: 'Пример гонки данных' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\nfunc main() {\n    counter := 0\n    var wg sync.WaitGroup\n\n    for i := 0; i < 1000; i++ {\n        wg.Add(1)\n        go func() {\n            defer wg.Done()\n            counter++ // ГОНКА ДАННЫХ!\n            // Это не атомарная операция, а три шага:\n            // 1. Прочитать значение counter\n            // 2. Добавить 1\n            // 3. Записать обратно\n        }()\n    }\n\n    wg.Wait()\n    fmt.Println(counter) // Ожидаем 1000, получаем меньше!\n}' },
        { type: 'heading', value: 'Обнаружение гонок: -race флаг' },
        { type: 'code', language: 'go', value: '// Запуск с детектором гонок:\n// go run -race main.go\n// go test -race ./...\n\n// Вывод детектора:\n// ==================\n// WARNING: DATA RACE\n// Write at 0x00c0000b4010 by goroutine 7:\n//   main.main.func1()\n//   Read at 0x00c0000b4010 by goroutine 8:\n//   main.main.func1()\n// ==================' },
        { type: 'warning', value: 'Всегда запускай тесты с флагом -race во время разработки. Гонки данных — коварные баги: они могут проявляться редко и только под нагрузкой.' }
      ]
    },
    {
      id: 2,
      title: 'sync.Mutex — эксклюзивная блокировка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Mutex (Mutual Exclusion — взаимное исключение) — примитив синхронизации, который позволяет только одной горутине в каждый момент времени выполнять критическую секцию кода.' },
        { type: 'heading', value: 'Mutex защищает счётчик' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\nfunc main() {\n    var mu sync.Mutex\n    counter := 0\n    var wg sync.WaitGroup\n\n    for i := 0; i < 1000; i++ {\n        wg.Add(1)\n        go func() {\n            defer wg.Done()\n\n            mu.Lock()   // захватить мьютекс — только одна горутина здесь\n            counter++   // критическая секция\n            mu.Unlock() // освободить мьютекс\n        }()\n    }\n\n    wg.Wait()\n    fmt.Println(counter) // Всегда 1000!\n}' },
        { type: 'heading', value: 'Инкапсуляция мьютекса в структуре' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\n// SafeCounter — потокобезопасный счётчик\ntype SafeCounter struct {\n    mu    sync.Mutex\n    value int\n}\n\nfunc (c *SafeCounter) Increment() {\n    c.mu.Lock()\n    defer c.mu.Unlock()\n    c.value++\n}\n\nfunc (c *SafeCounter) Value() int {\n    c.mu.Lock()\n    defer c.mu.Unlock()\n    return c.value\n}\n\nfunc main() {\n    counter := &SafeCounter{}\n    var wg sync.WaitGroup\n\n    for i := 0; i < 500; i++ {\n        wg.Add(1)\n        go func() {\n            defer wg.Done()\n            counter.Increment()\n        }()\n    }\n\n    wg.Wait()\n    fmt.Println("Итог:", counter.Value()) // 500\n}' },
        { type: 'tip', value: 'Хорошая практика — хранить мьютекс и данные, которые он защищает, в одной структуре. Это явно показывает, что именно защищается.' }
      ]
    },
    {
      id: 3,
      title: 'defer mu.Unlock() — безопасное освобождение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Использование defer mu.Unlock() сразу после Lock() — стандартная идиома в Go. Это гарантирует освобождение блокировки даже при панике или досрочном return.' },
        { type: 'heading', value: 'Почему defer важен' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\ntype Cache struct {\n    mu   sync.Mutex\n    data map[string]string\n}\n\n// Без defer — опасно\nfunc (c *Cache) GetUnsafe(key string) (string, bool) {\n    c.mu.Lock()\n    val, ok := c.data[key]\n    if !ok {\n        c.mu.Unlock() // не забыть разблокировать!\n        return "", false\n    }\n    // Если появится новый return — легко забыть Unlock\n    result := processValue(val)\n    c.mu.Unlock()\n    return result, true\n}\n\n// С defer — надёжно и чисто\nfunc (c *Cache) Get(key string) (string, bool) {\n    c.mu.Lock()\n    defer c.mu.Unlock() // выполнится при ЛЮБОМ выходе из функции\n\n    val, ok := c.data[key]\n    if !ok {\n        return "", false // Unlock вызовется автоматически!\n    }\n    return processValue(val), true\n}\n\nfunc processValue(s string) string { return s + "_processed" }\n\nfunc main() {\n    c := &Cache{data: map[string]string{"key1": "value1"}}\n    if v, ok := c.Get("key1"); ok {\n        fmt.Println("Найдено:", v)\n    }\n}' },
        { type: 'heading', value: 'Минимизация критической секции' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "time"\n)\n\ntype Store struct {\n    mu   sync.Mutex\n    data map[string]int\n}\n\n// ПЛОХО: долгая операция внутри блокировки\nfunc (s *Store) UpdateSlow(key string) {\n    s.mu.Lock()\n    defer s.mu.Unlock()\n\n    time.Sleep(100 * time.Millisecond) // блокируем всех на 100мс!\n    s.data[key]++\n}\n\n// ХОРОШО: блокировка только для записи\nfunc (s *Store) UpdateFast(key string) {\n    newValue := computeValue(key) // вычисление вне блокировки\n\n    s.mu.Lock()\n    s.data[key] = newValue // только запись под блокировкой\n    s.mu.Unlock()\n}\n\nfunc computeValue(key string) int {\n    // дорогое вычисление без блокировки\n    time.Sleep(100 * time.Millisecond)\n    return len(key) * 42\n}\n\nfunc main() {\n    s := &Store{data: make(map[string]int)}\n    s.UpdateFast("hello")\n    fmt.Println(s.data)\n}' },
        { type: 'tip', value: 'Держи критическую секцию (код между Lock и Unlock) как можно короче. Только операции с разделяемыми данными — внутри. Вычисления, I/O, сеть — вне блокировки.' }
      ]
    },
    {
      id: 4,
      title: 'sync.RWMutex — раздельные блокировки',
      type: 'theory',
      content: [
        { type: 'text', value: 'RWMutex (Read-Write Mutex) позволяет множеству горутин одновременно читать данные, но при записи требует эксклюзивного доступа. Это повышает производительность при частых чтениях.' },
        { type: 'tip', value: 'RWMutex как библиотека: читать книги могут многие посетители одновременно. Но если библиотекарь переставляет книги (запись) — все ждут снаружи.' },
        { type: 'heading', value: 'RLock/RUnlock для чтения, Lock/Unlock для записи' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "time"\n)\n\ntype Config struct {\n    mu   sync.RWMutex\n    data map[string]string\n}\n\n// Чтение — разрешено нескольким горутинам одновременно\nfunc (c *Config) Get(key string) string {\n    c.mu.RLock()         // блокировка на чтение\n    defer c.mu.RUnlock() // разблокировка чтения\n    return c.data[key]\n}\n\n// Запись — эксклюзивный доступ\nfunc (c *Config) Set(key, value string) {\n    c.mu.Lock()         // полная блокировка\n    defer c.mu.Unlock()\n    c.data[key] = value\n}\n\nfunc main() {\n    cfg := &Config{data: make(map[string]string)}\n    cfg.Set("host", "localhost")\n    cfg.Set("port", "8080")\n\n    var wg sync.WaitGroup\n\n    // 10 горутин читают одновременно — без блокировки друг друга\n    for i := 0; i < 10; i++ {\n        wg.Add(1)\n        go func(n int) {\n            defer wg.Done()\n            host := cfg.Get("host")\n            time.Sleep(10 * time.Millisecond)\n            fmt.Printf("Горутина %d читает: %s\\n", n, host)\n        }(i)\n    }\n\n    wg.Wait()\n    fmt.Println("Все прочитали конфигурацию")\n}' },
        { type: 'heading', value: 'Когда использовать RWMutex vs Mutex' },
        { type: 'list', value: 'RWMutex выгоден когда: чтений намного больше, чем записей; операции чтения занимают время (вычисления); несколько горутин часто читают одновременно.\nMutex достаточен когда: операции быстрые (счётчики, флаги); примерно одинаковое количество чтений и записей.\nRWMutex имеет небольшие накладные расходы — для простых случаев Mutex может быть быстрее.' }
      ]
    },
    {
      id: 5,
      title: 'Защита разделяемого состояния',
      type: 'theory',
      content: [
        { type: 'text', value: 'На практике чаще всего нужно защищать структуры данных: карты, слайсы, счётчики. Рассмотрим реальные паттерны.' },
        { type: 'heading', value: 'Потокобезопасная карта' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\ntype SafeMap struct {\n    mu   sync.RWMutex\n    data map[string]interface{}\n}\n\nfunc NewSafeMap() *SafeMap {\n    return &SafeMap{\n        data: make(map[string]interface{}),\n    }\n}\n\nfunc (m *SafeMap) Set(key string, value interface{}) {\n    m.mu.Lock()\n    defer m.mu.Unlock()\n    m.data[key] = value\n}\n\nfunc (m *SafeMap) Get(key string) (interface{}, bool) {\n    m.mu.RLock()\n    defer m.mu.RUnlock()\n    v, ok := m.data[key]\n    return v, ok\n}\n\nfunc (m *SafeMap) Delete(key string) {\n    m.mu.Lock()\n    defer m.mu.Unlock()\n    delete(m.data, key)\n}\n\nfunc (m *SafeMap) Len() int {\n    m.mu.RLock()\n    defer m.mu.RUnlock()\n    return len(m.data)\n}\n\nfunc main() {\n    sm := NewSafeMap()\n    var wg sync.WaitGroup\n\n    // Параллельная запись\n    for i := 0; i < 100; i++ {\n        wg.Add(1)\n        go func(n int) {\n            defer wg.Done()\n            key := fmt.Sprintf("key%d", n)\n            sm.Set(key, n*n)\n        }(i)\n    }\n\n    wg.Wait()\n    fmt.Printf("Элементов в карте: %d\\n", sm.Len())\n}' },
        { type: 'heading', value: 'Паттерн: Copy-on-read для атомарного снимка' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\ntype Metrics struct {\n    mu   sync.RWMutex\n    data map[string]int\n}\n\n// Получить снимок данных (копию)\nfunc (m *Metrics) Snapshot() map[string]int {\n    m.mu.RLock()\n    defer m.mu.RUnlock()\n\n    // Создаём копию, чтобы вернуть без блокировки\n    copy := make(map[string]int, len(m.data))\n    for k, v := range m.data {\n        copy[k] = v\n    }\n    return copy\n}\n\nfunc main() {\n    m := &Metrics{data: map[string]int{"requests": 42, "errors": 3}}\n    snapshot := m.Snapshot()\n    fmt.Println("Снимок метрик:", snapshot)\n}' }
      ]
    },
    {
      id: 6,
      title: 'Избегание дедлоков',
      type: 'theory',
      content: [
        { type: 'text', value: 'Дедлок — это ситуация, когда две или более горутины бесконечно ждут друг друга. Программа зависает без ошибки.' },
        { type: 'heading', value: 'Классический дедлок' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "sync"\n\nfunc main() {\n    var mu sync.Mutex\n\n    mu.Lock()\n    mu.Lock() // ДЕДЛОК! Первая блокировка не освобождена,\n              // вторая ждёт вечно\n    mu.Unlock()\n    mu.Unlock()\n}' },
        { type: 'heading', value: 'Дедлок между двумя мьютексами' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "time"\n)\n\nvar muA, muB sync.Mutex\n\n// Горутина 1: захватывает A, потом B\nfunc goroutine1() {\n    muA.Lock()\n    fmt.Println("G1 захватила A")\n    time.Sleep(10 * time.Millisecond) // даём G2 захватить B\n    muB.Lock() // G1 ждёт B — но B захвачена G2!\n    fmt.Println("G1 захватила B")\n    muB.Unlock()\n    muA.Unlock()\n}\n\n// Горутина 2: захватывает B, потом A\nfunc goroutine2() {\n    muB.Lock()\n    fmt.Println("G2 захватила B")\n    time.Sleep(10 * time.Millisecond) // даём G1 захватить A\n    muA.Lock() // G2 ждёт A — но A захвачена G1! ДЕДЛОК\n    fmt.Println("G2 захватила A")\n    muA.Unlock()\n    muB.Unlock()\n}\n\n// РЕШЕНИЕ: всегда захватывать мьютексы в одном порядке\nfunc safeGoroutine() {\n    muA.Lock()         // всегда сначала A\n    defer muA.Unlock()\n    muB.Lock()         // потом B\n    defer muB.Unlock()\n    fmt.Println("Безопасный захват")\n}' },
        { type: 'warning', value: 'Правила избегания дедлоков: 1) захватывай мьютексы всегда в одном и том же порядке; 2) держи критические секции короткими; 3) не вызывай чужой код (особенно callback-и) под блокировкой.' },
        { type: 'tip', value: 'Если архитектура требует нескольких мьютексов — рассмотри переход к каналам или sync.Map. Чем меньше мьютексов, тем меньше риск дедлоков.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: потокобезопасный кэш',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй потокобезопасный кэш с TTL (временем жизни). Кэш должен поддерживать операции Set, Get и автоматически инвалидировать устаревшие записи.',
      requirements: [
        'Создай структуру Cache с полями: mu sync.RWMutex, items map[string]Item',
        'Структура Item: value interface{}, expiry time.Time',
        'Метод Set(key string, value interface{}, duration time.Duration)',
        'Метод Get(key string) (interface{}, bool) — возвращает false если ключа нет или истёк TTL',
        'В main: запусти 5 горутин, каждая пишет 10 значений, потом читает их'
      ],
      expectedOutput: 'Set: key_0_0 = 0\nGet: key_0_0 = 0 (найдено)\n... (операции)\nВсего успешных чтений: 50',
      hint: 'В методе Get проверяй item.expiry.After(time.Now()) — если expiry в прошлом, то запись устарела. Используй RLock для Get и Lock для Set.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "time"\n)\n\ntype Item struct {\n    value  interface{}\n    expiry time.Time\n}\n\ntype Cache struct {\n    mu    sync.RWMutex\n    items map[string]Item\n}\n\nfunc NewCache() *Cache {\n    return &Cache{items: make(map[string]Item)}\n}\n\nfunc (c *Cache) Set(key string, value interface{}, duration time.Duration) {\n    c.mu.Lock()\n    defer c.mu.Unlock()\n    c.items[key] = Item{\n        value:  value,\n        expiry: time.Now().Add(duration),\n    }\n}\n\nfunc (c *Cache) Get(key string) (interface{}, bool) {\n    c.mu.RLock()\n    defer c.mu.RUnlock()\n    item, ok := c.items[key]\n    if !ok || time.Now().After(item.expiry) {\n        return nil, false\n    }\n    return item.value, true\n}\n\nfunc main() {\n    cache := NewCache()\n    var wg sync.WaitGroup\n    var mu sync.Mutex\n    successCount := 0\n\n    for g := 0; g < 5; g++ {\n        wg.Add(1)\n        go func(gid int) {\n            defer wg.Done()\n            for i := 0; i < 10; i++ {\n                key := fmt.Sprintf("key_%d_%d", gid, i)\n                cache.Set(key, i, time.Second)\n                if val, ok := cache.Get(key); ok {\n                    fmt.Printf("Get: %s = %v (найдено)\\n", key, val)\n                    mu.Lock()\n                    successCount++\n                    mu.Unlock()\n                }\n            }\n        }(g)\n    }\n\n    wg.Wait()\n    fmt.Printf("Всего успешных чтений: %d\\n", successCount)\n}',
      explanation: 'RWMutex оптимален для кэша: операции чтения (Get) происходят намного чаще записи (Set). RLock позволяет нескольким горутинам читать одновременно, что повышает производительность. Проверка TTL внутри критической секции чтения гарантирует корректность — между проверкой и возвратом значения никто не изменит запись.'
    }
  ]
}
