export default {
  id: 35,
  title: 'Defer, Panic, Recover',
  description: 'Отложенные вызовы defer, стек LIFO, паника, восстановление recover и паттерны их применения',
  lessons: [
    {
      id: 1,
      title: 'Defer — отложенный вызов функции',
      type: 'theory',
      content: [
        { type: 'text', value: 'defer — ключевое слово Go, которое откладывает выполнение функции до момента возврата из окружающей функции. Это как записка "напоминание", которую вы оставляете себе: "Когда буду уходить — выключить свет".' },
        { type: 'heading', value: 'Основное применение — освобождение ресурсов' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "os"\n)\n\nfunc readFile(filename string) (string, error) {\n    f, err := os.Open(filename)\n    if err != nil {\n        return "", err\n    }\n    // defer гарантирует закрытие файла при любом исходе функции\n    // Неважно: нормальный return, return с ошибкой или panic\n    defer f.Close()\n\n    // ... читаем файл ...\n    buf := make([]byte, 100)\n    n, err := f.Read(buf)\n    if err != nil {\n        return "", err // f.Close() всё равно будет вызван!\n    }\n\n    return string(buf[:n]), nil\n    // f.Close() вызывается здесь, перед реальным возвратом\n}' },
        { type: 'heading', value: 'Аргументы вычисляются СРАЗУ' },
        { type: 'code', language: 'go', value: 'func main() {\n    x := 10\n    defer fmt.Println("defer значение x:", x) // x вычисляется СЕЙЧАС = 10\n    x = 20\n    fmt.Println("текущий x:", x) // 20\n    // При выходе: "defer значение x: 10" (не 20!)\n}\n\n// Вывод:\n// текущий x: 20\n// defer значение x: 10' },
        { type: 'text', value: 'Это тонкий момент: аргументы defer-функции вычисляются в момент объявления defer, а не в момент его выполнения. Сама функция выполнится позже, но с теми значениями, которые были на момент defer.' },
        { type: 'tip', value: 'Типичные случаи для defer: закрытие файлов (f.Close()), освобождение mutex (mu.Unlock()), закрытие соединений с БД (db.Close()), закрытие HTTP-ответов (resp.Body.Close()).' }
      ]
    },
    {
      id: 2,
      title: 'Стек defer — порядок LIFO',
      type: 'theory',
      content: [
        { type: 'text', value: 'Если в функции несколько defer, они выполняются в обратном порядке — последний вошёл, первый вышел (LIFO: Last In, First Out). Как стопка тарелок: кладёте снизу вверх, берёте сверху вниз.' },
        { type: 'code', language: 'go', value: 'func main() {\n    fmt.Println("начало")\n\n    defer fmt.Println("первый defer")   // выполнится третьим\n    defer fmt.Println("второй defer")   // выполнится вторым\n    defer fmt.Println("третий defer")   // выполнится первым\n\n    fmt.Println("конец функции")\n}\n\n// Вывод:\n// начало\n// конец функции\n// третий defer\n// второй defer\n// первый defer' },
        { type: 'heading', value: 'Практический пример LIFO' },
        { type: 'code', language: 'go', value: 'func acquireResources() {\n    // Ресурсы захватываются в порядке зависимостей\n    db := connectDB()\n    defer db.Close()        // закрывается последним\n\n    cache := connectCache()\n    defer cache.Close()     // закрывается вторым\n\n    session := openSession(db)\n    defer session.Close()   // закрывается первым\n\n    // Использование ресурсов...\n    // При выходе: session -> cache -> db\n    // Это правильный порядок: сначала зависимые, потом базовые\n}' },
        { type: 'code', language: 'go', value: '// defer внутри цикла — ОСТОРОЖНО!\nfunc processFiles(files []string) error {\n    for _, f := range files {\n        file, err := os.Open(f)\n        if err != nil {\n            return err\n        }\n        defer file.Close() // ПРОБЛЕМА: все defer выполнятся только после processFiles!\n        // Если файлов 1000 — держим 1000 открытых файлов одновременно\n    }\n    return nil\n}\n\n// ПРАВИЛЬНО: выносим в отдельную функцию или используем немедленный вызов\nfunc processFiles_correct(files []string) error {\n    for _, f := range files {\n        if err := processOneFile(f); err != nil {\n            return err\n        }\n    }\n    return nil\n}\n\nfunc processOneFile(filename string) error {\n    file, err := os.Open(filename)\n    if err != nil {\n        return err\n    }\n    defer file.Close() // теперь файл закрывается после каждой итерации\n    // ... работа с файлом ...\n    return nil\n}' },
        { type: 'warning', value: 'Не используйте defer внутри длинных циклов с большим числом итераций — все отложенные вызовы накапливаются в памяти и выполнятся только после завершения функции, не после каждой итерации.' }
      ]
    },
    {
      id: 3,
      title: 'Defer с замыканиями — изменение именованных возвращаемых значений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Defer использует замыкание (closure) — функция может обращаться к переменным окружающей функции. Это открывает мощный паттерн: изменение именованных возвращаемых значений.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\n// Именованное возвращаемое значение позволяет defer изменить его\nfunc divide(a, b float64) (result float64, err error) {\n    defer func() {\n        if err != nil {\n            // Оборачиваем ошибку через defer!\n            err = fmt.Errorf("divide(%v, %v): %w", a, b, err)\n        }\n    }()\n\n    if b == 0 {\n        err = errors.New("деление на ноль")\n        return\n    }\n    result = a / b\n    return\n}\n\nfunc main() {\n    result, err := divide(10, 0)\n    fmt.Println(result, err)\n    // 0 divide(10, 0): деление на ноль\n}' },
        { type: 'heading', value: 'Измерение времени выполнения' },
        { type: 'code', language: 'go', value: 'import (\n    "fmt"\n    "time"\n)\n\n// Паттерн: измерение времени через defer\nfunc timeIt(name string) func() {\n    start := time.Now()\n    return func() {\n        fmt.Printf("%s заняло %v\\n", name, time.Since(start))\n    }\n}\n\nfunc expensiveOperation() {\n    defer timeIt("expensiveOperation")()\n    // Обратите внимание на двойные скобки!\n    // timeIt("expensiveOperation") возвращает функцию\n    // которая сразу вызывается через ()\n    // и её результат defer-ится\n\n    time.Sleep(100 * time.Millisecond)\n    // ... работа ...\n}\n\n// Вывод: expensiveOperation заняло 100.123ms' },
        { type: 'note', value: 'Двойные скобки defer f()() — это не опечатка. Первый () вызывает f и получает функцию, второй () это функция которую мы defer-им. Этот паттерн часто используется для создания "до/после" операций.' }
      ]
    },
    {
      id: 4,
      title: 'Panic — неожиданная ошибка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Паника (panic) — это механизм аварийной остановки программы при критической ошибке. Это как пожарная сигнализация: в нормальной работе не используется, но если что-то пошло очень плохо — включается и всё останавливается.' },
        { type: 'heading', value: 'Что такое panic' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("до паники")\n    panic("что-то пошло ужасно не так")\n    fmt.Println("эта строка никогда не выполнится")\n}\n\n// Вывод:\n// до паники\n// goroutine 1 [running]:\n// main.main()\n//         /tmp/main.go:7 +0x5b\n// exit status 2' },
        { type: 'heading', value: 'Что вызывает panic автоматически' },
        { type: 'code', language: 'go', value: '// 1. Выход за границы массива/слайса\nslice := []int{1, 2, 3}\nfmt.Println(slice[10]) // panic: runtime error: index out of range [10] with length 3\n\n// 2. Разыменование nil-указателя\nvar p *int\nfmt.Println(*p) // panic: runtime error: invalid memory address or nil pointer dereference\n\n// 3. Деление на ноль для целых чисел\na, b := 10, 0\nfmt.Println(a / b) // panic: runtime error: integer divide by zero\n\n// 4. Приведение интерфейса к неверному типу\nvar i interface{} = "строка"\nn := i.(int) // panic: interface conversion: interface {} is string, not int\n_ = n' },
        { type: 'heading', value: 'Когда вызывать panic вручную' },
        { type: 'list', items: [
          'Нарушение инвариантов программы (состояние которое никогда не должно наступить)',
          'Ошибки программирования (неверное использование API)',
          'Инициализация: если программа не может стартовать без обязательного ресурса',
          'НЕ используйте panic для обычной обработки ошибок — для этого есть return error'
        ]},
        { type: 'code', language: 'go', value: '// ХОРОШЕЕ применение panic: нарушение контракта функции\nfunc mustPositive(n int) int {\n    if n <= 0 {\n        panic(fmt.Sprintf("mustPositive: получено %d, ожидалось > 0", n))\n    }\n    return n\n}\n\n// ХОРОШЕЕ применение: инициализация (Must-паттерн)\nfunc mustCompile(pattern string) *regexp.Regexp {\n    re, err := regexp.Compile(pattern)\n    if err != nil {\n        panic(err) // паттерн неверный — это ошибка программирования\n    }\n    return re\n}\n\nvar emailRegex = mustCompile(`^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$`)' },
        { type: 'warning', value: 'Функции Must* (mustCompile, regexp.MustCompile, template.Must) — стандартный Go-паттерн для инициализации, которая не должна провалиться. Если провалилась — это баг, не runtime-ошибка.' }
      ]
    },
    {
      id: 5,
      title: 'Recover — перехват паники',
      type: 'theory',
      content: [
        { type: 'text', value: 'recover() позволяет "поймать" панику и восстановить нормальную работу программы. Это как ремни безопасности в машине: паника происходит, но вместо вылета в окно — мягкая остановка.' },
        { type: 'heading', value: 'Правила recover' },
        { type: 'list', items: [
          'recover() работает ТОЛЬКО внутри функции вызванной через defer',
          'Если паники нет, recover() возвращает nil',
          'После recover() выполнение продолжается не с места паники, а после defer-функции'
        ]},
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\nfunc safeDiv(a, b int) (result int, err error) {\n    defer func() {\n        if r := recover(); r != nil {\n            // r содержит значение переданное в panic()\n            err = fmt.Errorf("перехвачена паника: %v", r)\n        }\n    }()\n\n    // Если b == 0 — panic: integer divide by zero\n    result = a / b\n    return\n}\n\nfunc main() {\n    result, err := safeDiv(10, 2)\n    fmt.Println(result, err) // 5 <nil>\n\n    result, err = safeDiv(10, 0)\n    fmt.Println(result, err) // 0 перехвачена паника: runtime error: integer divide by zero\n}' },
        { type: 'heading', value: 'Почему recover только в defer' },
        { type: 'code', language: 'go', value: 'func bad() {\n    // НЕ РАБОТАЕТ: recover не в defer\n    if r := recover(); r != nil {\n        fmt.Println("это никогда не сработает")\n    }\n    panic("помогите!")\n}\n\nfunc good() {\n    // РАБОТАЕТ: recover в defer\n    defer func() {\n        if r := recover(); r != nil {\n            fmt.Println("поймали панику:", r)\n        }\n    }()\n    panic("помогите!")\n}' },
        { type: 'note', value: 'recover() возвращает interface{} — то самое значение, которое было передано в panic(). Это может быть строка, error, или любой другой тип.' }
      ]
    },
    {
      id: 6,
      title: 'Паттерн defer+recover — безопасный middleware',
      type: 'theory',
      content: [
        { type: 'text', value: 'Комбинация defer+recover — стандартный паттерн для создания "защитного слоя" вокруг кода, который может паниковать. Классический пример — HTTP middleware, который защищает сервер от вылета при панике в одном из обработчиков.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "log"\n    "net/http"\n    "runtime/debug"\n)\n\n// recoveryMiddleware перехватывает паники в HTTP-хендлерах\nfunc recoveryMiddleware(next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        defer func() {\n            if err := recover(); err != nil {\n                // Логируем панику со stack trace\n                log.Printf("ПАНИКА в %s %s: %v\\n%s",\n                    r.Method, r.URL.Path, err,\n                    debug.Stack(),\n                )\n                // Возвращаем 500 клиенту\n                http.Error(w, "Внутренняя ошибка сервера", http.StatusInternalServerError)\n            }\n        }()\n        next.ServeHTTP(w, r)\n    })\n}\n\nfunc badHandler(w http.ResponseWriter, r *http.Request) {\n    // Симулируем панику\n    var s []int\n    fmt.Println(s[0]) // panic: index out of range\n}\n\nfunc main() {\n    mux := http.NewServeMux()\n    mux.HandleFunc("/bad", badHandler)\n    // Оборачиваем весь роутер в защиту от паник\n    http.ListenAndServe(":8080", recoveryMiddleware(mux))\n}' },
        { type: 'heading', value: 'Безопасный запуск горутин' },
        { type: 'code', language: 'go', value: '// safego запускает горутину с защитой от паники\nfunc safego(fn func()) {\n    go func() {\n        defer func() {\n            if r := recover(); r != nil {\n                log.Printf("паника в горутине: %v\\n%s", r, debug.Stack())\n            }\n        }()\n        fn()\n    }()\n}\n\n// Использование:\nsafego(func() {\n    // этот код защищён — паника не убьёт весь сервер\n    processWebhook(data)\n})' },
        { type: 'warning', value: 'Не глотайте паники молча! Всегда логируйте их с stack trace (debug.Stack()). Паника означает неожиданное состояние — вы должны знать о ней, чтобы исправить.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: безопасный парсер',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте функцию SafeParse, которая безопасно парсит JSON из []byte в map[string]interface{}. Функция должна перехватывать панику и возвращать её как ошибку. Также реализуйте defer-based очиститель ресурсов.',
      requirements: [
        'Функция SafeParse(data []byte) (result map[string]interface{}, err error)',
        'Использует defer+recover для перехвата паник',
        'Функция WithTempDir(fn func(dir string)) error создаёт временную директорию, выполняет fn и всегда удаляет директорию через defer',
        'Напишите тесты для обоих случаев: успешный парсинг и паника'
      ],
      expectedOutput: 'Результат: map[age:30 name:Алия]\nОшибка: перехвачена паника: ...',
      hint: 'В SafeParse используйте named return values (err error) — это позволит defer изменить возвращаемую ошибку. os.MkdirTemp создаёт временную директорию, os.RemoveAll удаляет её рекурсивно.',
      solution: 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n    "os"\n)\n\n// SafeParse безопасно парсит JSON, перехватывая паники\nfunc SafeParse(data []byte) (result map[string]interface{}, err error) {\n    defer func() {\n        if r := recover(); r != nil {\n            err = fmt.Errorf("перехвачена паника: %v", r)\n        }\n    }()\n\n    result = make(map[string]interface{})\n    if err = json.Unmarshal(data, &result); err != nil {\n        return nil, err\n    }\n    return result, nil\n}\n\n// WithTempDir создаёт временную директорию, выполняет fn и удаляет её\nfunc WithTempDir(fn func(dir string)) error {\n    dir, err := os.MkdirTemp("", "tempdir-*")\n    if err != nil {\n        return fmt.Errorf("создание временной директории: %w", err)\n    }\n    defer func() {\n        os.RemoveAll(dir) // всегда удаляем, даже если fn паникует\n    }()\n\n    fn(dir)\n    return nil\n}\n\nfunc main() {\n    // Успешный парсинг\n    data := []byte(`{"name": "Алия", "age": 30}`)\n    result, err := SafeParse(data)\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n    } else {\n        fmt.Println("Результат:", result)\n    }\n\n    // Неверный JSON\n    bad := []byte(`{не валидный json}`)\n    result, err = SafeParse(bad)\n    fmt.Printf("result=%v, err=%v\\n", result, err)\n\n    // Используем временную директорию\n    err = WithTempDir(func(dir string) {\n        fmt.Println("Работаем в:", dir)\n        // создаём файл в временной директории\n        os.WriteFile(dir+"/test.txt", []byte("hello"), 0644)\n    })\n    fmt.Println("WithTempDir err:", err)\n}',
      explanation: 'SafeParse использует именованное возвращаемое значение err — это позволяет defer-функции изменить его при перехвате паники. defer func(){if r:=recover()...} — это канонический паттерн перехвата паники в Go. WithTempDir демонстрирует паттерн cleanup через defer: ресурс создаётся, сразу следует defer для его освобождения. Порядок гарантирован — удаление всегда произойдёт.'
    }
  ]
}
