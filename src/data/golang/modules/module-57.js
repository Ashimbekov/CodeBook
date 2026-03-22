export default {
  id: 57,
  title: 'Инструменты Go',
  description: 'Встроенные и сторонние инструменты Go-разработчика: форматирование кода, статический анализ, линтеры, документация и генерация кода. Автоматизация качества кода.',
  lessons: [
    {
      id: 1,
      title: 'go fmt — форматирование кода',
      type: 'theory',
      content: [
        { type: 'text', value: 'go fmt — обязательный инструмент Go-разработчика. В отличие от Python или JavaScript, в Go нет споров о стиле кода: gofmt определяет единственный правильный формат. Весь Go-код в мире выглядит одинаково.' },
        { type: 'heading', value: 'go fmt и gofmt' },
        { type: 'code', language: 'go', value: '// ДО go fmt (неотформатированный код):\npackage main\nimport "fmt"\nfunc   main()   {\nfmt.Println(  "Привет"  )\n        x:=1+2\n    if x>0{fmt.Println(x)}\n}\n\n// ПОСЛЕ go fmt:\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Привет")\n    x := 1 + 2\n    if x > 0 {\n        fmt.Println(x)\n    }\n}\n\n// Команды:\n// gofmt -w file.go          -> форматировать файл (перезаписать)\n// gofmt -l .                -> список неотформатированных файлов\n// gofmt -d file.go          -> показать diff без изменений\n// go fmt ./...              -> форматировать весь модуль\n\n// goimports — расширенная версия gofmt:\n// go install golang.org/x/tools/cmd/goimports@latest\n// goimports -w file.go      -> форматирует И добавляет/удаляет импорты\n\n// Пример что goimports умеет:\n// Добавляет недостающие import "fmt"\n// Удаляет неиспользуемые импорты\n// Сортирует импорты по группам:\n//   1. Стандартная библиотека\n//   2. Внешние пакеты\n//   3. Внутренние пакеты\n\n// Настройка автоформатирования в VS Code (settings.json):\n// {\n//   "[go]": {\n//     "editor.formatOnSave": true,\n//     "editor.defaultFormatter": "golang.go"\n//   },\n//   "go.formatTool": "goimports"\n// }' },
        { type: 'tip', value: 'Добавьте go fmt ./... в pre-commit хуки или CI/CD. Если код не отформатирован — билд падает. Команда: gofmt -l . && test -z "$(gofmt -l .)" — выходит с ошибкой если есть неотформатированные файлы.' }
      ]
    },
    {
      id: 2,
      title: 'go vet — анализ кода',
      type: 'theory',
      content: [
        { type: 'text', value: 'go vet — встроенный статический анализатор. Он находит реальные баги: неправильные форматные строки, race conditions, бесполезные присвоения. Это не стиль — это настоящие ошибки.' },
        { type: 'heading', value: 'Что находит go vet' },
        { type: 'code', language: 'go', value: 'package main\n\nimport "fmt"\n\nfunc badCode() {\n    // BUG 1: неправильный форматный спецификатор\n    x := 42\n    fmt.Printf("Значение: %s\\n", x) // %s для int -> vet предупредит\n\n    // BUG 2: бесполезное присвоение\n    err := doSomething()\n    err = doSomethingElse() // предыдущая err никогда не проверяется\n    _ = err\n\n    // BUG 3: unreachable code (анализируется другими инструментами)\n    return\n    fmt.Println("это никогда не выполнится") //nolint\n\n    // BUG 4: блокировка мьютекса по значению (а не указателю)\n    // copyMutex(sync.Mutex{}) -> vet: sync.Mutex should not be copied\n\n    // BUG 5: неверное использование atomic\n    // var i int64\n    // atomic.AddInt64((*int64)(unsafe.Pointer(&i)), 1) // OK\n\n    // BUG 6: goroutine с замкнутой переменной цикла (исправлено в Go 1.22)\n    // for i := 0; i < 5; i++ {\n    //     go func() { fmt.Println(i) }() // Go < 1.22: все печатают 5\n    // }\n}\n\nfunc doSomething() error    { return nil }\nfunc doSomethingElse() error { return nil }\n\nfunc main() {\n    // Запуск:\n    // go vet ./...\n    //\n    // Вывод при ошибке:\n    // ./main.go:8:14: Printf format %s has arg x of wrong type int\n    //\n    // go vet включён в go test автоматически!\n    fmt.Println("go vet проверяет код")\n}' },
        { type: 'heading', value: 'Анализаторы go vet' },
        { type: 'list', value: 'printf: проверяет форматные строки fmt.Printf, fmt.Sprintf\nassign: бесполезные присвоения\nbools: неверные логические операции (x == true вместо x)\ncopylocks: копирование мьютексов\nhttpresponse: неправильная работа с http.Response\nunreachable: недостижимый код\nunsafeptr: опасные преобразования указателей\nnilfunc: сравнение функций с nil\nshadow: затенение переменных (через go vet -shadow)' }
      ]
    },
    {
      id: 3,
      title: 'staticcheck — продвинутый анализ',
      type: 'theory',
      content: [
        { type: 'text', value: 'staticcheck — мощный статический анализатор, который идёт гораздо дальше go vet. Он находит устаревший код, неэффективные паттерны, дорогостоящие операции и потенциальные баги.' },
        { type: 'heading', value: 'Установка и использование' },
        { type: 'code', language: 'go', value: '// Установка:\n// go install honnef.co/go/tools/cmd/staticcheck@latest\n\n// Запуск:\n// staticcheck ./...\n// staticcheck -checks=all ./...\n\n// Примеры находок staticcheck:\npackage main\n\nimport (\n    "fmt"\n    "regexp"\n    "strings"\n)\n\nfunc inefficientCode() {\n    s := "Привет Мир"\n\n    // SA4017: функция не имеет эффекта (результат не используется)\n    strings.ToUpper(s) // SA4017: strings.ToUpper is a pure function\n    // Правильно:\n    upper := strings.ToUpper(s)\n    fmt.Println(upper)\n\n    // SA1000: неверное регулярное выражение (проверяется статически!)\n    // regexp.MustCompile("[invalid") // SA1000: invalid regex\n    re := regexp.MustCompile(`\\d+`)\n    fmt.Println(re.FindString(s))\n\n    // S1039: ненужный Sprintf\n    // fmt.Println(fmt.Sprintf("Привет")) // S1039: unnecessary use of fmt.Sprintf\n    fmt.Println("Привет") // правильно\n\n    // S1023: ненужный return в конце функции\n    // S1000: использование select с одним case вместо простого вызова\n    // S1001: range с ручным индексом вместо range по значению\n\n    // ST1006: имя получателя не соответствует соглашениям\n    // (не использует первую букву типа)\n\n    // QF1001: неидиоматичный if/else\n    x := 5\n    var result string\n    if x > 0 {\n        result = "положительное"\n    } else {\n        result = "отрицательное"\n    }\n    // QF1001 предложит:\n    // result := func() string {\n    //     if x > 0 { return "положительное" }\n    //     return "отрицательное"\n    // }()\n    fmt.Println(result)\n}\n\nfunc main() {\n    inefficientCode()\n\n    // Игнорирование конкретной проверки:\n    // //nolint:SA4017\n    // strings.ToUpper(s)\n    //\n    // Конфигурация в .staticcheck.conf:\n    // checks = ["all", "-ST1000", "-ST1003"]\n}' },
        { type: 'note', value: 'staticcheck содержит более 100 проверок. Код S* — стилевые улучшения. SA* — реальные баги и неверное использование API. ST* — соглашения о стиле. QF* — быстрые исправления.' }
      ]
    },
    {
      id: 4,
      title: 'golangci-lint — мегалинтер',
      type: 'theory',
      content: [
        { type: 'text', value: 'golangci-lint запускает десятки линтеров параллельно. Это как нанять целую команду проверяющих: один проверяет стиль, другой — безопасность, третий — производительность.' },
        { type: 'heading', value: 'Установка и настройка' },
        { type: 'code', language: 'go', value: '// Установка:\n// curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(go env GOPATH)/bin\n// или:\n// go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest\n\n// Запуск:\n// golangci-lint run\n// golangci-lint run ./...\n// golangci-lint run --fix    <- автоисправление где возможно\n\n// Конфигурация в .golangci.yml:\n// linters-settings:\n//   errcheck:\n//     check-type-assertions: true\n//   gocyclo:\n//     min-complexity: 15\n//   govet:\n//     enable-all: true\n//\n// linters:\n//   enable:\n//     - errcheck      # проверка необработанных ошибок\n//     - govet         # go vet\n//     - staticcheck   # staticcheck\n//     - ineffassign   # бесполезные присвоения\n//     - gosimple      # упрощения кода\n//     - unused        # неиспользуемый код\n//     - gofmt         # форматирование\n//     - goimports     # сортировка импортов\n//     - gocritic      # критические замечания\n//     - gosec         # безопасность\n//     - misspell      # опечатки в комментариях\n//     - revive        # замена golint\n//     - bodyclose     # закрытие http.Response.Body\n//     - noctx         # нет context в http запросах\n//   disable:\n//     - deadcode      # устарел\n//\n// run:\n//   timeout: 5m\n//   tests: true\n//\n// issues:\n//   exclude-rules:\n//     - path: _test.go\n//       linters:\n//         - errcheck  # в тестах можно не проверять все ошибки\n\npackage main\n\nimport (\n    "fmt"\n    "net/http"\n)\n\n// errcheck поймает это:\nfunc noErrorCheck() {\n    resp, _ := http.Get("https://example.com") // игнорируем ошибку\n    fmt.Println(resp.StatusCode)               // resp может быть nil!\n    // bodyclose поймает: resp.Body не закрыт\n}\n\nfunc correct() error {\n    resp, err := http.Get("https://example.com")\n    if err != nil {\n        return fmt.Errorf("get: %w", err)\n    }\n    defer resp.Body.Close() // bodyclose доволен\n    fmt.Println(resp.StatusCode)\n    return nil\n}\n\nfunc main() {\n    correct()\n}' },
        { type: 'tip', value: 'Добавьте golangci-lint в CI/CD GitHub Actions: используйте golangci-lint-action. Запуск занимает 1-2 минуты и находит проблемы до code review. Начните с небольшого набора линтеров и расширяйте постепенно.' }
      ]
    },
    {
      id: 5,
      title: 'go doc — документация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Go имеет встроенную систему документации: комментарии перед функциями/типами становятся документацией. go doc и pkg.go.dev автоматически рендерят её в красивый HTML.' },
        { type: 'heading', value: 'Написание документации' },
        { type: 'code', language: 'go', value: '// Package calculator предоставляет базовые математические операции.\n// Все функции безопасны для использования из нескольких горутин.\n//\n// Пример использования:\n//\n//  c := calculator.New()\n//  result := c.Add(2, 3) // 5\n//  result = c.Divide(10, 0) // вернёт ошибку ErrDivisionByZero\npackage calculator\n\nimport "errors"\n\n// ErrDivisionByZero возвращается при делении на ноль.\nvar ErrDivisionByZero = errors.New("деление на ноль")\n\n// Calculator выполняет математические операции.\n// Нулевое значение готово к использованию.\ntype Calculator struct {\n    precision int // количество знаков после запятой\n}\n\n// New создаёт Calculator с точностью по умолчанию (2 знака).\nfunc New() *Calculator {\n    return &Calculator{precision: 2}\n}\n\n// WithPrecision создаёт Calculator с указанной точностью.\n// precision должен быть от 0 до 10.\nfunc WithPrecision(precision int) *Calculator {\n    if precision < 0 || precision > 10 {\n        precision = 2\n    }\n    return &Calculator{precision: precision}\n}\n\n// Add складывает два числа и возвращает результат.\nfunc (c *Calculator) Add(a, b float64) float64 {\n    return a + b\n}\n\n// Divide делит a на b.\n// Возвращает ErrDivisionByZero если b == 0.\nfunc (c *Calculator) Divide(a, b float64) (float64, error) {\n    if b == 0 {\n        return 0, ErrDivisionByZero\n    }\n    return a / b, nil\n}\n\n// Команды go doc:\n// go doc             -> документация текущего пакета\n// go doc fmt         -> документация пакета fmt\n// go doc fmt.Printf  -> документация функции\n// go doc -all fmt    -> полная документация пакета\n// go doc -src fmt.Printf -> с исходным кодом\n\n// godoc — web-сервер документации:\n// go install golang.org/x/tools/cmd/godoc@latest\n// godoc -http=:6060\n// Открыть: http://localhost:6060/pkg/github.com/you/myapp/' },
        { type: 'tip', value: 'Комментарий к пакету должен начинаться с "Package имя" — это конвенция. Примеры кода в комментариях начинаются с // и табуляции, они автоматически тестируются командой go test (Example функции).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: настройка инструментов для проекта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай Go проект со всеми инструментами качества кода: go vet, staticcheck, golangci-lint конфигурация и правильная документация. Исправь найденные проблемы.',
      requirements: [
        'Создай пакет stringutils с функциями: Reverse(s string) string, IsPalindrome(s string) bool, WordCount(s string) map[string]int',
        'Намеренно добавь несколько проблем: неиспользуемую переменную, неправильный fmt.Printf формат',
        'Запусти go vet ./... и исправь найденные проблемы',
        'Добавь документацию к каждой экспортируемой функции согласно Go-конвенции',
        'Создай .golangci.yml с включёнными линтерами: govet, errcheck, staticcheck, gocritic',
        'Создай Example-функции для документации (ExampleReverse, ExampleIsPalindrome)',
        'Напиши main.go использующий все три функции с цветным выводом через fmt'
      ],
      expectedOutput: 'go vet ./... -> нет ошибок\ngo test ./... -> PASS (включая Example тесты)\nReverse("Нурдаулет") = "телуадруН"\nIsPalindrome("казак") = true\nWordCount("go go go") = map[go:3]',
      hint: 'Example функции пишутся в _test.go файле: func ExampleReverse() { fmt.Println(Reverse("abc")) // Output: cba }. Комментарий // Output: определяет ожидаемый вывод и тестируется автоматически.',
      solution: '// stringutils/stringutils.go\npackage stringutils\n\nimport (\n    "strings"\n    "unicode"\n)\n\n// Reverse возвращает строку s в обратном порядке символов.\n// Корректно работает с Unicode (многобайтовыми символами).\n//\n// Пример:\n//\n//  Reverse("Привет") // "тевирП"\nfunc Reverse(s string) string {\n    runes := []rune(s)\n    for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {\n        runes[i], runes[j] = runes[j], runes[i]\n    }\n    return string(runes)\n}\n\n// IsPalindrome проверяет является ли строка палиндромом.\n// Регистр и знаки препинания игнорируются.\n//\n// Пример:\n//\n//  IsPalindrome("казак") // true\n//  IsPalindrome("Go")    // false\nfunc IsPalindrome(s string) bool {\n    var letters []rune\n    for _, r := range strings.ToLower(s) {\n        if unicode.IsLetter(r) {\n            letters = append(letters, r)\n        }\n    }\n    for i, j := 0, len(letters)-1; i < j; i, j = i+1, j-1 {\n        if letters[i] != letters[j] {\n            return false\n        }\n    }\n    return true\n}\n\n// WordCount подсчитывает количество вхождений каждого слова в строке.\n// Слова разделяются пробельными символами, регистр игнорируется.\n//\n// Пример:\n//\n//  WordCount("go go Go") // map[go:3]\nfunc WordCount(s string) map[string]int {\n    counts := make(map[string]int)\n    for _, word := range strings.Fields(s) {\n        counts[strings.ToLower(word)]++\n    }\n    return counts\n}\n\n// === stringutils/stringutils_test.go ===\n// package stringutils_test\n// import (\n//     "fmt"\n//     "testing"\n//     "myapp/stringutils"\n// )\n// func ExampleReverse() {\n//     fmt.Println(stringutils.Reverse("Нурдаулет"))\n//     // Output: телуадруН\n// }\n// func ExampleIsPalindrome() {\n//     fmt.Println(stringutils.IsPalindrome("казак"))\n//     // Output: true\n// }\n\n// === main.go ===\npackage main\n\nimport (\n    "fmt"\n    "myapp/stringutils"\n)\n\nfunc main() {\n    s := "Нурдаулет"\n    fmt.Printf("Reverse(%q) = %q\\n", s, stringutils.Reverse(s))\n\n    words := []string{"казак", "Go", "Anna", "рояль"}\n    for _, w := range words {\n        fmt.Printf("IsPalindrome(%q) = %v\\n", w, stringutils.IsPalindrome(w))\n    }\n\n    text := "go go go язык go"\n    fmt.Printf("WordCount(%q) = %v\\n", text, stringutils.WordCount(text))\n}',
      explanation: 'Документационные комментарии в Go — это обычные комментарии перед объявлениями. Example-функции в _test.go файлах тестируются автоматически по комментарию // Output:. golangci-lint объединяет десятки линтеров в один запуск. go vet встроен и запускается автоматически при go test — не нужно явно вызывать в CI для базовых проверок.'
    }
  ]
}
