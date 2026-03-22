export default {
  id: 41,
  title: 'sync.WaitGroup',
  description: 'Синхронизация горутин с помощью sync.WaitGroup: как дождаться завершения всех задач, паттерны параллельной обработки, типичные ошибки и лучшие практики.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужен WaitGroup',
      type: 'theory',
      content: [
        { type: 'text', value: 'Представь, что ты менеджер, который раздал задания пяти сотрудникам и хочешь дождаться, пока все закончат. Без инструмента синхронизации ты не знаешь, когда можно собирать результаты. sync.WaitGroup — это именно такой инструмент.' },
        { type: 'heading', value: 'Проблема: горутины живут независимо' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc worker(id int) {\n    fmt.Printf("Работник %d начал работу\\n", id)\n    time.Sleep(100 * time.Millisecond)\n    fmt.Printf("Работник %d закончил\\n", id)\n}\n\nfunc main() {\n    for i := 1; i <= 3; i++ {\n        go worker(i)\n    }\n    // main завершается раньше горутин!\n    fmt.Println("main завершился")\n    // Вывод: скорее всего только "main завершился"\n}' },
        { type: 'warning', value: 'Когда функция main() завершается, все горутины принудительно останавливаются — даже если они ещё не закончили свою работу. Это главная ловушка для новичков.' },
        { type: 'text', value: 'Старый способ — time.Sleep() — ненадёжен: непонятно, сколько ждать. WaitGroup решает задачу элегантно и корректно.' },
        { type: 'tip', value: 'WaitGroup — как счётчик задач. Добавляешь задачу — счётчик увеличивается. Задача завершена — счётчик уменьшается. Wait() блокирует выполнение, пока счётчик не станет равен нулю.' }
      ]
    },
    {
      id: 2,
      title: 'Add, Done, Wait — три метода WaitGroup',
      type: 'theory',
      content: [
        { type: 'text', value: 'sync.WaitGroup имеет три метода: Add(n) — добавляет n к счётчику, Done() — уменьшает счётчик на 1, Wait() — блокируется пока счётчик не равен 0.' },
        { type: 'heading', value: 'Базовое использование' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "time"\n)\n\nfunc worker(id int, wg *sync.WaitGroup) {\n    defer wg.Done() // уменьшить счётчик при завершении\n    fmt.Printf("Работник %d начал\\n", id)\n    time.Sleep(100 * time.Millisecond)\n    fmt.Printf("Работник %d завершил\\n", id)\n}\n\nfunc main() {\n    var wg sync.WaitGroup\n\n    for i := 1; i <= 5; i++ {\n        wg.Add(1)       // увеличиваем счётчик перед запуском горутины\n        go worker(i, &wg) // передаём указатель!\n    }\n\n    wg.Wait() // ждём пока все 5 горутин не вызовут Done()\n    fmt.Println("Все работники завершили работу")\n}' },
        { type: 'heading', value: 'Как это работает изнутри' },
        { type: 'list', value: '1. wg.Add(1) — счётчик становится 1\n2. go worker(i, &wg) — горутина запускается\n3. Повторяем 5 раз — счётчик достигает 5\n4. wg.Wait() — main блокируется, ждёт счётчик = 0\n5. Каждый worker вызывает wg.Done() — счётчик уменьшается\n6. Когда счётчик = 0 — Wait() разблокируется' },
        { type: 'warning', value: 'Всегда передавай WaitGroup по указателю (&wg), не по значению! Копирование WaitGroup нарушает синхронизацию и может привести к панике.' }
      ]
    },
    {
      id: 3,
      title: 'defer wg.Done() — лучшая практика',
      type: 'theory',
      content: [
        { type: 'text', value: 'Использование defer wg.Done() гарантирует, что Done() будет вызван даже если функция завершится из-за паники или досрочного return.' },
        { type: 'heading', value: 'Без defer — опасность утечки' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\n// ПЛОХО: wg.Done() может не выполниться при ошибке\nfunc riskyWorker(id int, wg *sync.WaitGroup) {\n    if id == 3 {\n        fmt.Println("Ошибка! Пропускаем wg.Done()")\n        return // wg.Done() НЕ ВЫЗВАН — Wait() будет висеть вечно!\n    }\n    fmt.Printf("Работник %d завершил\\n", id)\n    wg.Done()\n}\n\n// ХОРОШО: defer гарантирует вызов Done()\nfunc safeWorker(id int, wg *sync.WaitGroup) {\n    defer wg.Done() // выполнится при любом завершении функции\n    if id == 3 {\n        fmt.Println("Ошибка, но Done() всё равно вызван")\n        return // Done() будет вызван через defer!\n    }\n    fmt.Printf("Работник %d завершил\\n", id)\n}\n\nfunc main() {\n    var wg sync.WaitGroup\n    for i := 1; i <= 5; i++ {\n        wg.Add(1)\n        go safeWorker(i, &wg)\n    }\n    wg.Wait()\n    fmt.Println("Все завершили работу")\n}' },
        { type: 'tip', value: 'Правило: defer wg.Done() всегда должен быть первой строкой в горутине — сразу после объявления функции. Это стандартная идиома Go.' },
        { type: 'heading', value: 'Add() до или после go?' },
        { type: 'code', language: 'go', value: 'var wg sync.WaitGroup\n\n// ПРАВИЛЬНО: Add перед запуском горутины\nwg.Add(1)\ngo func() {\n    defer wg.Done()\n    // работа...\n}()\n\n// НЕПРАВИЛЬНО: Add внутри горутины\ngo func() {\n    wg.Add(1) // горутина может не успеть выполнить Add\n    defer wg.Done()\n    // работа...\n}()\n// если Wait() вызвать сразу, счётчик может быть ещё 0!' }
      ]
    },
    {
      id: 4,
      title: 'Типичные ошибки с WaitGroup',
      type: 'theory',
      content: [
        { type: 'text', value: 'WaitGroup прост в использовании, но есть несколько распространённых ошибок, которые приводят к гонкам данных, дедлокам или панике.' },
        { type: 'heading', value: 'Ошибка 1: копирование WaitGroup' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "sync"\n\nfunc badFunc(wg sync.WaitGroup) { // ОШИБКА: копия!\n    defer wg.Done()\n    // работает с копией, оригинальный wg не изменяется\n}\n\nfunc goodFunc(wg *sync.WaitGroup) { // ПРАВИЛЬНО: указатель\n    defer wg.Done()\n}\n\nfunc main() {\n    var wg sync.WaitGroup\n    wg.Add(1)\n    go goodFunc(&wg) // передаём адрес\n    wg.Wait()\n}' },
        { type: 'heading', value: 'Ошибка 2: отрицательный счётчик' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "sync"\n\nfunc main() {\n    var wg sync.WaitGroup\n\n    wg.Add(1)\n    wg.Done()\n    wg.Done() // ПАНИКА: sync: negative WaitGroup counter\n    // счётчик стал -1 — это недопустимо!\n}' },
        { type: 'heading', value: 'Ошибка 3: повторное использование до Wait()' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "time"\n)\n\nfunc main() {\n    var wg sync.WaitGroup\n\n    // Первая волна\n    wg.Add(3)\n    for i := 0; i < 3; i++ {\n        go func(n int) {\n            defer wg.Done()\n            time.Sleep(10 * time.Millisecond)\n            // ОПАСНО: если здесь вызвать wg.Add() для второй волны\n            // пока первая волна ещё не завершилась — возможна паника\n        }(i)\n    }\n    wg.Wait()\n    fmt.Println("Первая волна завершена")\n\n    // Только после Wait() безопасно использовать wg повторно\n    wg.Add(2)\n    for i := 0; i < 2; i++ {\n        go func(n int) {\n            defer wg.Done()\n            fmt.Printf("Вторая волна: горутина %d\\n", n)\n        }(i)\n    }\n    wg.Wait()\n    fmt.Println("Вторая волна завершена")\n}' },
        { type: 'warning', value: 'WaitGroup можно использовать повторно, но только после того, как Wait() вернул управление. Добавлять новые задачи (Add) пока ещё выполняются предыдущие горутины — опасно.' }
      ]
    },
    {
      id: 5,
      title: 'Паттерн параллельной обработки',
      type: 'theory',
      content: [
        { type: 'text', value: 'WaitGroup идеально подходит для паттерна "разделяй и властвуй" — когда нужно обработать набор данных параллельно.' },
        { type: 'heading', value: 'Параллельное скачивание файлов' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "time"\n)\n\ntype Result struct {\n    URL  string\n    Size int\n    Err  error\n}\n\nfunc downloadFile(url string, results chan<- Result, wg *sync.WaitGroup) {\n    defer wg.Done()\n    // Имитация скачивания\n    time.Sleep(50 * time.Millisecond)\n    results <- Result{URL: url, Size: len(url) * 100}\n}\n\nfunc main() {\n    urls := []string{\n        "https://example.com/file1.zip",\n        "https://example.com/file2.zip",\n        "https://example.com/file3.zip",\n    }\n\n    results := make(chan Result, len(urls))\n    var wg sync.WaitGroup\n\n    start := time.Now()\n\n    // Запускаем все скачивания параллельно\n    for _, url := range urls {\n        wg.Add(1)\n        go downloadFile(url, results, &wg)\n    }\n\n    // Ждём завершения и закрываем канал\n    go func() {\n        wg.Wait()\n        close(results)\n    }()\n\n    // Собираем результаты\n    totalSize := 0\n    for r := range results {\n        fmt.Printf("Скачан: %s (%d байт)\\n", r.URL, r.Size)\n        totalSize += r.Size\n    }\n\n    fmt.Printf("Всего: %d байт за %v\\n", totalSize, time.Since(start))\n}' },
        { type: 'heading', value: 'Параллельная обработка с ограничением' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "sync"\n    "time"\n)\n\nfunc processWithLimit(items []int, maxWorkers int) {\n    var wg sync.WaitGroup\n    sem := make(chan struct{}, maxWorkers) // семафор\n\n    for _, item := range items {\n        wg.Add(1)\n        go func(val int) {\n            defer wg.Done()\n            sem <- struct{}{}   // захватить слот\n            defer func() { <-sem }() // освободить слот\n\n            // Обработка\n            time.Sleep(100 * time.Millisecond)\n            fmt.Printf("Обработан элемент: %d\\n", val)\n        }(item)\n    }\n\n    wg.Wait()\n    fmt.Println("Все элементы обработаны")\n}\n\nfunc main() {\n    items := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}\n    processWithLimit(items, 3) // не более 3 горутин одновременно\n}' },
        { type: 'tip', value: 'Комбинация WaitGroup + буферизованный канал как семафор — популярный паттерн для ограничения параллелизма. Размер буфера определяет максимальное количество одновременных горутин.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: параллельная обработка задач',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая параллельно вычисляет квадрат каждого числа из списка, используя sync.WaitGroup. Результаты собери в слайс и выведи итог.',
      requirements: [
        'Создай слайс чисел: []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}',
        'Запусти горутину для каждого числа, которая вычисляет его квадрат',
        'Используй sync.WaitGroup для ожидания всех горутин',
        'Сохрани результаты в слайс results []int с правильным индексом',
        'Выведи все результаты и их сумму'
      ],
      expectedOutput: 'Квадраты: [1 4 9 16 25 36 49 64 81 100]\nСумма квадратов: 385',
      hint: 'Создай results := make([]int, len(numbers)). В горутине используй индекс для записи results[i] = numbers[i] * numbers[i]. Для записи по индексу мьютекс не нужен — каждая горутина пишет в свою ячейку.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sync"\n)\n\nfunc main() {\n    numbers := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}\n    results := make([]int, len(numbers))\n\n    var wg sync.WaitGroup\n\n    for i, n := range numbers {\n        wg.Add(1)\n        go func(idx, val int) {\n            defer wg.Done()\n            results[idx] = val * val\n        }(i, n)\n    }\n\n    wg.Wait()\n\n    sum := 0\n    for _, v := range results {\n        sum += v\n    }\n\n    fmt.Printf("Квадраты: %v\\n", results)\n    fmt.Printf("Сумма квадратов: %d\\n", sum)\n}',
      explanation: 'Ключевой момент: каждая горутина работает со своим индексом results[idx], поэтому нет гонки данных и мьютекс не нужен. Передаём i и n как параметры горутины (idx, val), чтобы избежать классической ловушки замыкания в цикле. WaitGroup гарантирует, что к моменту чтения results все горутины уже завершили запись.'
    }
  ]
}
