export default {
  id: 32,
  title: 'Табличные тесты и бенчмарки',
  description: 'Table-driven tests, бенчмарки, профилирование и покрытие кода тестами',
  lessons: [
    {
      id: 1,
      title: 'Табличные тесты — паттерн table-driven tests',
      type: 'theory',
      content: [
        { type: 'text', value: 'Табличные тесты — это идиоматический Go-паттерн для тестирования одной функции на множестве входных данных. Вместо того чтобы писать десять почти одинаковых тестовых функций, вы создаёте таблицу (slice) с тест-кейсами и проходите по ней в цикле.' },
        { type: 'text', value: 'Представьте таблицу умножения: вместо записи "2*1=2, 2*2=4, 2*3=6..." отдельными строками, вы создаёте таблицу и обрабатываете её алгоритмически. Вот именно так работают табличные тесты.' },
        { type: 'heading', value: 'Базовый пример' },
        { type: 'code', language: 'go', value: 'package math\n\nimport "testing"\n\nfunc TestAdd_TableDriven(t *testing.T) {\n    tests := []struct {\n        name string\n        a, b int\n        want int\n    }{\n        {"оба положительных", 2, 3, 5},\n        {"с нулём", 0, 5, 5},\n        {"оба отрицательных", -2, -3, -5},\n        {"разные знаки", -2, 3, 1},\n        {"большие числа", 1000000, 2000000, 3000000},\n    }\n\n    for _, tt := range tests {\n        t.Run(tt.name, func(t *testing.T) {\n            got := Add(tt.a, tt.b)\n            if got != tt.want {\n                t.Errorf("Add(%d, %d) = %d, хотели %d",\n                    tt.a, tt.b, got, tt.want)\n            }\n        })\n    }\n}' },
        { type: 'heading', value: 'Преимущества подхода' },
        { type: 'list', items: [
          'Добавить новый тест-кейс = добавить одну строку в таблицу',
          'Все случаи видны как единое целое',
          'Нет дублирования кода',
          'Каждый тест-кейс имеет имя — понятно что именно упало'
        ]},
        { type: 'tip', value: 'Переменная в range называется tt (test table entry) по распространённому соглашению. Но это лишь договорённость, можно использовать любое имя.' }
      ]
    },
    {
      id: 2,
      title: 'Таблицы с ошибками и сложными типами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Табличные тесты отлично работают и для функций, возвращающих ошибки. Структура тест-кейса может содержать поле wantErr для проверки наличия ошибки, или wantErrMsg для проверки её сообщения.' },
        { type: 'code', language: 'go', value: 'package validator\n\nimport (\n    "errors"\n    "testing"\n)\n\nfunc TestValidateAge(t *testing.T) {\n    tests := []struct {\n        name    string\n        age     int\n        wantErr bool\n        errMsg  string\n    }{\n        {\n            name:    "корректный возраст",\n            age:     25,\n            wantErr: false,\n        },\n        {\n            name:    "минимальный возраст",\n            age:     0,\n            wantErr: false,\n        },\n        {\n            name:    "отрицательный возраст",\n            age:     -1,\n            wantErr: true,\n            errMsg:  "возраст не может быть отрицательным",\n        },\n        {\n            name:    "слишком большой возраст",\n            age:     150,\n            wantErr: true,\n            errMsg:  "возраст не может быть больше 130",\n        },\n    }\n\n    for _, tt := range tests {\n        t.Run(tt.name, func(t *testing.T) {\n            err := ValidateAge(tt.age)\n\n            if tt.wantErr {\n                if err == nil {\n                    t.Fatal("ожидали ошибку, но её нет")\n                }\n                if tt.errMsg != "" && err.Error() != tt.errMsg {\n                    t.Errorf("сообщение ошибки: %q, хотели: %q",\n                        err.Error(), tt.errMsg)\n                }\n                return\n            }\n\n            if err != nil {\n                t.Errorf("не ожидали ошибку, получили: %v", err)\n            }\n        })\n    }\n}' },
        { type: 'note', value: 'Используйте return после проверки ошибки когда wantErr == true. Это предотвращает ложные провалы от последующих проверок, которые не имеют смысла при наличии ошибки.' }
      ]
    },
    {
      id: 3,
      title: 'Бенчмарки — измерение производительности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Бенчмарк (benchmark) — это специальный вид теста, который измеряет производительность кода. Это как секундомер для вашего кода: запустил, засёк время, сравнил варианты.' },
        { type: 'heading', value: 'Правила написания бенчмарков' },
        { type: 'list', items: [
          'Функция начинается с Benchmark (не Test)',
          'Принимает *testing.B (не *testing.T)',
          'Код для измерения находится внутри цикла for i := 0; i < b.N; i++',
          'b.N — количество итераций, Go сам подбирает его для получения стабильного результата'
        ]},
        { type: 'code', language: 'go', value: 'package math\n\nimport "testing"\n\n// Бенчмарк для функции Sum\nfunc BenchmarkSum(b *testing.B) {\n    // Код вне цикла выполняется один раз (подготовка)\n    a, c := 12345, 67890\n\n    // Сам цикл — именно этот код измеряется\n    for i := 0; i < b.N; i++ {\n        Sum(a, c)\n    }\n}\n\n// Сравниваем два алгоритма конкатенации строк\nfunc BenchmarkConcatPlus(b *testing.B) {\n    for i := 0; i < b.N; i++ {\n        result := ""\n        for j := 0; j < 100; j++ {\n            result += "a"\n        }\n        _ = result // предотвращаем оптимизацию компилятора\n    }\n}\n\nfunc BenchmarkConcatBuilder(b *testing.B) {\n    for i := 0; i < b.N; i++ {\n        var sb strings.Builder\n        for j := 0; j < 100; j++ {\n            sb.WriteString("a")\n        }\n        _ = sb.String()\n    }\n}' },
        { type: 'heading', value: 'Запуск бенчмарков' },
        { type: 'code', language: 'bash', value: '# -bench запускает бенчмарки (регулярное выражение)\ngo test -bench=.\n\n# Запустить конкретный бенчмарк\ngo test -bench=BenchmarkSum\n\n# С выводом использования памяти\ngo test -bench=. -benchmem\n\n# Результат:\n# BenchmarkConcatPlus-8      200000    7823 ns/op    5296 B/op   99 allocs/op\n# BenchmarkConcatBuilder-8  5000000     312 ns/op      16 B/op    2 allocs/op' },
        { type: 'text', value: 'Результат читается так: BenchmarkConcatPlus-8 означает 8 CPU. 200000 — количество итераций. 7823 ns/op — наносекунд на операцию. Strings.Builder примерно в 25 раз быстрее!' },
        { type: 'warning', value: 'Бенчмарки НЕ запускаются при обычном go test. Для их запуска обязателен флаг -bench. Это защищает от случайного замедления CI/CD.' }
      ]
    },
    {
      id: 4,
      title: 'b.ResetTimer и управление таймером',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда перед измерением нужно выполнить затратную подготовку — подключиться к БД, загрузить файл, создать сложный объект. Если это происходит внутри цикла b.N, результаты будут неточными. b.ResetTimer сбрасывает таймер после подготовки.' },
        { type: 'code', language: 'go', value: 'package search\n\nimport (\n    "testing"\n)\n\nfunc BenchmarkSearch(b *testing.B) {\n    // Подготовка: создаём большой slice (дорогая операция)\n    data := make([]int, 1000000)\n    for i := range data {\n        data[i] = i\n    }\n\n    // Сбрасываем таймер — время подготовки не учитывается\n    b.ResetTimer()\n\n    // Теперь измеряем только поиск\n    for i := 0; i < b.N; i++ {\n        _ = BinarySearch(data, 500000)\n    }\n}\n\n// Остановка и возобновление таймера\nfunc BenchmarkWithSetup(b *testing.B) {\n    for i := 0; i < b.N; i++ {\n        b.StopTimer()  // пауза таймера — выполняем подготовку\n        data := createTestData()\n        b.StartTimer() // возобновляем таймер — измеряем работу\n\n        ProcessData(data)\n    }\n}' },
        { type: 'heading', value: 'Параллельные бенчмарки' },
        { type: 'code', language: 'go', value: 'func BenchmarkSumParallel(b *testing.B) {\n    b.RunParallel(func(pb *testing.PB) {\n        for pb.Next() {\n            Sum(12345, 67890)\n        }\n    })\n}\n\n// Запуск: go test -bench=BenchmarkSumParallel -cpu=1,2,4,8' },
        { type: 'tip', value: 'b.RunParallel запускает бенчмарк в нескольких горутинах одновременно. Это важно для проверки потокобезопасности и поведения под нагрузкой.' }
      ]
    },
    {
      id: 5,
      title: 'Покрытие кода — go test -cover',
      type: 'theory',
      content: [
        { type: 'text', value: 'Покрытие кода (code coverage) показывает, какой процент строк кода выполняется во время тестов. Это как карта дорог: зелёным закрашены дороги, по которым вы проехали, красным — те, где ещё не были.' },
        { type: 'heading', value: 'Команды для покрытия' },
        { type: 'code', language: 'bash', value: '# Показать процент покрытия\ngo test -cover\n\n# Вывод:\n# PASS\n# coverage: 87.5% of statements\n# ok  mypackage  0.003s\n\n# Сохранить детальный отчёт в файл\ngo test -coverprofile=coverage.out\n\n# Открыть визуальный HTML-отчёт в браузере\ngo tool cover -html=coverage.out\n\n# Показать покрытие по функциям\ngo tool cover -func=coverage.out' },
        { type: 'heading', value: 'Режимы подсчёта покрытия' },
        { type: 'code', language: 'bash', value: '# set — каждая строка была выполнена хотя бы раз (по умолчанию)\ngo test -covermode=set -coverprofile=coverage.out\n\n# count — сколько раз выполнялась каждая строка\ngo test -covermode=count -coverprofile=coverage.out\n\n# atomic — то же что count, но потокобезопасно (для параллельных тестов)\ngo test -covermode=atomic -coverprofile=coverage.out' },
        { type: 'text', value: 'HTML-отчёт окрашивает код: зелёный — выполнялся, красный — не выполнялся. Это мгновенно показывает, какие ветки кода не покрыты тестами.' },
        { type: 'warning', value: '100% покрытие — не всегда цель. Важно покрывать критическую бизнес-логику, граничные случаи и пути с ошибками. Гоняться за 100% ради цифры контрпродуктивно.' },
        { type: 'note', value: 'Хорошим показателем считается 70-80% покрытие для большинства проектов. Критические компоненты (парсеры, финансовые расчёты) стоит покрывать на 90%+.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: табличные тесты и бенчмарки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите табличные тесты и бенчмарк для функции проверки палиндрома. Палиндром — строка, которая читается одинаково в обоих направлениях (например, "level", "madam").',
      requirements: [
        'Реализуйте функцию IsPalindrome(s string) bool',
        'Напишите табличный тест с минимум 6 тест-кейсами (пустая строка, один символ, палиндром, не палиндром, с пробелами, регистр)',
        'Напишите бенчмарк BenchmarkIsPalindrome',
        'Запустите тесты с флагом -cover и убедитесь в высоком покрытии'
      ],
      expectedOutput: 'PASS\ncoverage: 100.0% of statements',
      hint: 'Для проверки палиндрома сравните строку с её реверсом. Для таблицы создайте slice из struct с полями name, input, want. В бенчмарке протестируйте длинную строку.',
      solution: 'package strings\n\nimport (\n    "strings"\n    "testing"\n    "unicode"\n)\n\n// IsPalindrome проверяет является ли строка палиндромом\n// Игнорирует регистр и пробелы\nfunc IsPalindrome(s string) bool {\n    // Приводим к нижнему регистру и убираем не-буквы\n    var runes []rune\n    for _, r := range strings.ToLower(s) {\n        if unicode.IsLetter(r) || unicode.IsDigit(r) {\n            runes = append(runes, r)\n        }\n    }\n    n := len(runes)\n    for i := 0; i < n/2; i++ {\n        if runes[i] != runes[n-1-i] {\n            return false\n        }\n    }\n    return true\n}\n\nfunc TestIsPalindrome(t *testing.T) {\n    tests := []struct {\n        name  string\n        input string\n        want  bool\n    }{\n        {"пустая строка", "", true},\n        {"один символ", "a", true},\n        {"простой палиндром", "level", true},\n        {"не палиндром", "hello", false},\n        {"с пробелами", "a man a plan a canal panama", true},\n        {"разный регистр", "Madam", true},\n        {"цифры", "12321", true},\n        {"цифры не палиндром", "12345", false},\n    }\n\n    for _, tt := range tests {\n        t.Run(tt.name, func(t *testing.T) {\n            got := IsPalindrome(tt.input)\n            if got != tt.want {\n                t.Errorf("IsPalindrome(%q) = %v, хотели %v",\n                    tt.input, got, tt.want)\n            }\n        })\n    }\n}\n\nfunc BenchmarkIsPalindrome(b *testing.B) {\n    s := "a man a plan a canal panama"\n    for i := 0; i < b.N; i++ {\n        IsPalindrome(s)\n    }\n}',
      explanation: 'Табличный тест покрывает все граничные случаи (пустая строка, регистр, пробелы) без дублирования кода. Бенчмарк тестирует реальную строку, что даёт репрезентативный результат. Команда go test -cover покажет 100% если все ветки кода (return false и return true) выполняются в тестах.'
    }
  ]
}
