export default {
  id: 36,
  title: 'Горутины (goroutines)',
  description: 'Что такое горутины, ключевое слово go, отличие от потоков, планировщик, WaitGroup, гонки данных',
  lessons: [
    {
      id: 1,
      title: 'Что такое горутина?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Горутина — это лёгкий поток выполнения, управляемый средой исполнения Go (runtime). Это основная единица конкурентности в Go. Представьте ресторан: шеф-повар одновременно управляет несколькими блюдами — это и есть конкурентность. Каждое блюдо — горутина.' },
        { type: 'heading', value: 'Запуск горутины' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc sayHello(name string) {\n    fmt.Printf("Привет, %s!\\n", name)\n}\n\nfunc main() {\n    // Обычный вызов — выполняется СЕЙЧАС, блокирует программу\n    sayHello("Алия")\n\n    // go — запускает функцию как горутину КОНКУРЕНТНО\n    go sayHello("Нурдаулет") // запустили, но не ждём\n    go sayHello("Айгерим")   // ещё одна горутина\n\n    // Проблема: main() завершится раньше, чем горутины выполнятся\n    // Временное решение (плохое): просто подождать\n    time.Sleep(100 * time.Millisecond)\n    fmt.Println("main завершается")\n}' },
        { type: 'text', value: 'Ключевое слово go запускает функцию в новой горутине. Выполнение текущего кода продолжается немедленно, не дожидаясь результата горутины. Это как отправить письмо: бросил в ящик и пошёл дальше, не ждёшь ответа на месте.' },
        { type: 'warning', value: 'Когда main() завершается — все горутины немедленно убиваются, независимо от того, закончили они работу или нет. time.Sleep — плохое решение для ожидания. Правильное решение — sync.WaitGroup или каналы.' },
        { type: 'note', value: 'Горутина — это не системный поток ОС. Go runtime управляет горутинами самостоятельно, мультиплексируя их на системные потоки. Это даёт огромную эффективность.' }
      ]
    },
    {
      id: 2,
      title: 'Горутины vs потоки ОС',
      type: 'theory',
      content: [
        { type: 'text', value: 'Горутины принципиально отличаются от системных потоков (threads). Понимание этого важно для эффективного написания конкурентных программ на Go.' },
        { type: 'heading', value: 'Сравнение' },
        { type: 'list', items: [
          'Размер стека: поток ОС — 1-8 МБ фиксированно; горутина — начинает с 2-4 КБ, растёт по необходимости',
          'Создание: поток ОС — десятки микросекунд; горутина — несколько микросекунд',
          'Одновременно: потоков обычно сотни-тысячи; горутин — легко миллионы',
          'Управление: потоки — ОС (вытесняющая многозадачность); горутины — Go runtime (кооперативная + вытесняющая)',
          'Переключение контекста: потоки — дорого (сохраняем регистры ядра); горутины — дёшево (только пользовательский контекст)'
        ]},
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "runtime"\n    "sync"\n)\n\nfunc main() {\n    // Создадим 100 000 горутин — в реальном приложении это нормально!\n    var wg sync.WaitGroup\n    count := 100_000\n\n    wg.Add(count)\n    for i := 0; i < count; i++ {\n        go func(n int) {\n            defer wg.Done()\n            // Каждая горутина делает минимальную работу\n            _ = n * n\n        }(i)\n    }\n\n    wg.Wait()\n    fmt.Println("все горутины завершены")\n    fmt.Println("количество CPU:", runtime.NumCPU())\n    fmt.Println("потоков OS:", runtime.NumCPU()) // Go использует NumCPU потоков\n}' },
        { type: 'tip', value: 'runtime.GOMAXPROCS(n) задаёт сколько OS-потоков используются параллельно. По умолчанию = runtime.NumCPU() — количество логических процессоров. Не путайте ПАРАЛЛЕЛЬНОСТЬ (физически одновременно) с КОНКУРЕНТНОСТЬЮ (структурно одновременно).' }
      ]
    },
    {
      id: 3,
      title: 'Планировщик Go — как работают горутины',
      type: 'theory',
      content: [
        { type: 'text', value: 'Go использует модель M:N — M горутин мультиплексируются на N системных потоков. Планировщик Go (GMP: Goroutine, Machine, Processor) распределяет горутины по потокам автоматически.' },
        { type: 'heading', value: 'Модель GMP' },
        { type: 'list', items: [
          'G (Goroutine) — горутина, единица работы',
          'M (Machine) — OS-поток, выполняет горутины',
          'P (Processor) — виртуальный процессор, содержит очередь горутин (обычно NumCPU штук)'
        ]},
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "runtime"\n    "time"\n)\n\nfunc worker(id int) {\n    // runtime.Gosched() добровольно отдаёт управление планировщику\n    // Другие горутины получат шанс выполниться\n    for i := 0; i < 3; i++ {\n        fmt.Printf("Горутина %d: шаг %d\\n", id, i)\n        runtime.Gosched() // "я готов уступить место"\n    }\n}\n\nfunc main() {\n    // Ограничим до одного потока для наглядности\n    runtime.GOMAXPROCS(1)\n\n    go worker(1)\n    go worker(2)\n\n    time.Sleep(time.Millisecond)\n    // Горутины чередуются:\n    // Горутина 1: шаг 0\n    // Горутина 2: шаг 0\n    // Горутина 1: шаг 1 ...\n}' },
        { type: 'heading', value: 'Когда планировщик переключает горутины' },
        { type: 'list', items: [
          'Системный вызов (чтение файла, сетевой запрос)',
          'Вызов runtime.Gosched()',
          'Операция с каналом (send/receive)',
          'Выделение памяти (в некоторых случаях)',
          'Начиная с Go 1.14: принудительное вытеснение каждые 10 мс'
        ]},
        { type: 'note', value: 'До Go 1.14 горутины использовали кооперативную многозадачность — горутина должна была явно отдать управление. Это могло приводить к "зависанию" при tight loop. С 1.14 runtime принудительно вытесняет горутины.' }
      ]
    },
    {
      id: 4,
      title: 'sync.WaitGroup — ожидание горутин',
      type: 'theory',
      content: [
        { type: 'text', value: 'WaitGroup — это счётчик горутин. Главная горутина может дождаться завершения всех дочерних горутин через WaitGroup.Wait(). Это как преподаватель, который ждёт пока все студенты сдадут контрольную.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "time"\n)\n\nfunc downloadFile(wg *sync.WaitGroup, url string) {\n    defer wg.Done() // уменьшаем счётчик когда функция завершается\n\n    fmt.Printf("Скачиваем %s...\\n", url)\n    time.Sleep(100 * time.Millisecond) // симуляция загрузки\n    fmt.Printf("Скачан %s\\n", url)\n}\n\nfunc main() {\n    urls := []string{\n        "https://example.com/file1.pdf",\n        "https://example.com/file2.pdf",\n        "https://example.com/file3.pdf",\n    }\n\n    var wg sync.WaitGroup\n\n    for _, url := range urls {\n        wg.Add(1) // увеличиваем счётчик ПЕРЕД запуском горутины\n        go downloadFile(&wg, url) // передаём указатель!\n    }\n\n    wg.Wait() // блокируемся пока счётчик не станет 0\n    fmt.Println("все файлы скачаны")\n}' },
        { type: 'heading', value: 'Правила использования WaitGroup' },
        { type: 'list', items: [
          'wg.Add(1) вызывайте ДО запуска горутины, не внутри неё',
          'Передавайте WaitGroup через указатель (*sync.WaitGroup)',
          'wg.Done() лучше всего вызывать через defer — гарантия вызова при любом исходе',
          'Не копируйте WaitGroup после первого использования'
        ]},
        { type: 'warning', value: 'Вызов wg.Add(1) ВНУТРИ горутины — классическая ошибка. Если main() успеет вызвать wg.Wait() до wg.Add(1), программа завершится раньше времени.' }
      ]
    },
    {
      id: 5,
      title: 'Анонимные горутины',
      type: 'theory',
      content: [
        { type: 'text', value: 'Горутины часто запускают анонимные функции (замыкания) прямо на месте, без объявления именованной функции. Это удобно для небольших задач.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\nfunc main() {\n    var wg sync.WaitGroup\n\n    // Анонимная горутина — удобно для небольших задач\n    wg.Add(1)\n    go func() {\n        defer wg.Done()\n        fmt.Println("выполняется анонимная горутина")\n    }()\n\n    // С параметрами — передаём переменные как аргументы\n    messages := []string{"hello", "world", "goroutine"}\n    for _, msg := range messages {\n        wg.Add(1)\n        go func(m string) { // m — копия msg, не ссылка!\n            defer wg.Done()\n            fmt.Println(m)\n        }(msg) // передаём msg как аргумент\n    }\n\n    wg.Wait()\n}' },
        { type: 'heading', value: 'Классическая ловушка с замыканием в цикле' },
        { type: 'code', language: 'go', value: '// НЕПРАВИЛЬНО: все горутины используют одну переменную i\nfor i := 0; i < 5; i++ {\n    go func() {\n        fmt.Println(i) // замыкание на i — все увидят финальное значение!\n    }()\n}\n// Скорее всего выведет: 5 5 5 5 5\n\n// ПРАВИЛЬНО: передаём i как аргумент (копируем)\nfor i := 0; i < 5; i++ {\n    go func(n int) { // n — копия значения i на этой итерации\n        fmt.Println(n)\n    }(i)\n}\n// Выведет: 0 1 2 3 4 (в произвольном порядке)\n\n// Также правильно: объявляем новую переменную на каждой итерации\nfor i := 0; i < 5; i++ {\n    i := i // новая переменная i в текущем scope\n    go func() {\n        fmt.Println(i)\n    }()\n}' },
        { type: 'warning', value: 'Замыкание в цикле — одна из самых частых ошибок с горутинами в Go. Переменная цикла захватывается по ссылке, поэтому все горутины увидят её финальное значение. Всегда передавайте значение как аргумент.' }
      ]
    },
    {
      id: 6,
      title: 'Утечки горутин — goroutine leaks',
      type: 'theory',
      content: [
        { type: 'text', value: 'Утечка горутины происходит когда горутина запущена, но никогда не завершится. Она продолжает занимать память и ресурсы. Это как включённый кран: маленький поток воды кажется безвредным, но со временем затопит квартиру.' },
        { type: 'code', language: 'go', value: '// УТЕЧКА: горутина блокируется навечно на чтении из канала\nfunc leak() {\n    ch := make(chan int)\n    go func() {\n        val := <-ch // блокируется вечно — никто не пишет в ch!\n        fmt.Println(val)\n    }()\n    // ch выходит из scope, горутина зависает навечно\n}\n\n// УТЕЧКА: бесконечный цикл без возможности остановки\nfunc leakLoop() {\n    go func() {\n        for {\n            // работаем вечно, нет способа остановить\n            processNextItem()\n        }\n    }()\n}\n\n// ПРАВИЛЬНО: используем done-канал для остановки\nfunc noLeak(done <-chan struct{}) {\n    go func() {\n        for {\n            select {\n            case <-done: // сигнал на остановку\n                return\n            default:\n                processNextItem()\n            }\n        }\n    }()\n}' },
        { type: 'heading', value: 'Обнаружение утечек' },
        { type: 'code', language: 'go', value: 'import "runtime"\n\n// Количество горутин в любой момент\nfunc goroutineCount() int {\n    return runtime.NumGoroutine()\n}\n\n// В тестах можно проверять что горутины не утекают:\nfunc TestNoLeak(t *testing.T) {\n    before := runtime.NumGoroutine()\n    runSomeCode()\n    // Небольшая пауза — горутины должны завершиться\n    time.Sleep(10 * time.Millisecond)\n    after := runtime.NumGoroutine()\n    if after > before {\n        t.Errorf("горутин: было %d, стало %d — утечка!", before, after)\n    }\n}' },
        { type: 'tip', value: 'Библиотека goleak (go.uber.org/goleak) автоматически обнаруживает утечки горутин в тестах. Добавьте goleak.VerifyNone(t) в конец каждого теста.' }
      ]
    },
    {
      id: 7,
      title: 'Гонки данных — race conditions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Гонка данных (race condition) возникает когда две горутины одновременно читают и пишут одну переменную, и хотя бы одна из них пишет. Результат непредсказуем. Это как когда два человека одновременно редактируют один документ без блокировок — данные будут повреждены.' },
        { type: 'code', language: 'go', value: '// ОПАСНО: race condition!\npackage main\n\nimport (\n    "fmt"\n    "sync"\n)\n\nvar counter int // общая переменная\n\nfunc increment(wg *sync.WaitGroup) {\n    defer wg.Done()\n    counter++ // НЕ АТОМАРНО! Читаем, прибавляем, пишем — три операции\n}\n\nfunc main() {\n    var wg sync.WaitGroup\n    for i := 0; i < 1000; i++ {\n        wg.Add(1)\n        go increment(&wg)\n    }\n    wg.Wait()\n    fmt.Println(counter) // может быть 998, 735, 1000 — непредсказуемо!\n}' },
        { type: 'heading', value: 'Детектор гонок' },
        { type: 'code', language: 'bash', value: '# Go имеет встроенный детектор гонок данных!\ngo run -race main.go\ngo test -race ./...\ngo build -race -o myapp .  # сборка с детектором для тестирования\n\n# При обнаружении гонки:\n# WARNING: DATA RACE\n# Write at 0x... by goroutine 7:\n#   main.increment()\n#       /main.go:13 +0x44\n# Previous read at 0x... by goroutine 6:\n#   main.increment()\n#       /main.go:13 +0x34' },
        { type: 'text', value: 'Флаг -race инструментирует код для обнаружения гонок. Всегда запускайте тесты с -race! Решения гонок: sync.Mutex, sync/atomic, или каналы — это темы следующих модулей.' },
        { type: 'warning', value: '-race добавляет ~20% overhead по CPU и ~10x по памяти. Используйте в тестах и стейджинге, не в production.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: параллельный обход URL',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите программу, которая параллельно проверяет доступность списка URL. Используйте горутины и WaitGroup. Соберите результаты безопасно.',
      requirements: [
        'Функция checkURL(url string) (bool, error) — проверяет доступность URL (HEAD-запрос)',
        'Запустите проверку всех URL параллельно через горутины',
        'Используйте sync.WaitGroup для ожидания',
        'Результаты сохраняйте в map[string]bool — используйте sync.Mutex для безопасной записи',
        'Выведите итоговый отчёт: сколько доступных, сколько недоступных'
      ],
      expectedOutput: 'https://google.com: доступен\nhttps://example.com: доступен\nhttps://invalid.example: недоступен\nИтого: 2 доступных, 1 недоступных',
      hint: 'Для HEAD-запроса используйте http.Head(url). Для безопасной записи в map используйте sync.Mutex: mu.Lock() перед записью, mu.Unlock() (или defer mu.Unlock()) после. Таймаут задайте через http.Client{Timeout: 5*time.Second}.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "net/http"\n    "sync"\n    "time"\n)\n\ntype Result struct {\n    URL       string\n    Available bool\n    Err       error\n}\n\nfunc checkURL(url string) (bool, error) {\n    client := &http.Client{\n        Timeout: 5 * time.Second,\n    }\n    resp, err := client.Head(url)\n    if err != nil {\n        return false, err\n    }\n    defer resp.Body.Close()\n    return resp.StatusCode < 400, nil\n}\n\nfunc checkURLsConcurrently(urls []string) map[string]Result {\n    results := make(map[string]Result)\n    var mu sync.Mutex\n    var wg sync.WaitGroup\n\n    for _, url := range urls {\n        wg.Add(1)\n        go func(u string) {\n            defer wg.Done()\n            available, err := checkURL(u)\n\n            mu.Lock()\n            results[u] = Result{URL: u, Available: available, Err: err}\n            mu.Unlock()\n        }(url) // передаём url как аргумент!\n    }\n\n    wg.Wait()\n    return results\n}\n\nfunc main() {\n    urls := []string{\n        "https://google.com",\n        "https://example.com",\n        "https://invalid.nonexistent.example",\n    }\n\n    results := checkURLsConcurrently(urls)\n\n    available, unavailable := 0, 0\n    for url, r := range results {\n        if r.Available {\n            fmt.Printf("%s: доступен\\n", url)\n            available++\n        } else {\n            fmt.Printf("%s: недоступен (%v)\\n", url, r.Err)\n            unavailable++\n        }\n    }\n    fmt.Printf("Итого: %d доступных, %d недоступных\\n", available, unavailable)\n}',
      explanation: 'Каждый URL проверяется в отдельной горутине — все запросы идут параллельно, не ждут друг друга. sync.WaitGroup позволяет main дождаться всех горутин. sync.Mutex защищает map от одновременной записи (map в Go не потокобезопасна). URL передаётся как аргумент функции-горутины, а не захватывается замыканием — это предотвращает классическую race condition с переменной цикла.'
    }
  ]
}
