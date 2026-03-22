export default {
  id: 31,
  title: 'Тестирование (testing)',
  description: 'Пакет testing, написание и запуск тестов, subtests, хелперы и библиотека testify',
  lessons: [
    {
      id: 1,
      title: 'Пакет testing — зачем писать тесты?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тест — это код, который проверяет, что ваш код работает правильно. Представьте, что вы строите мост: прежде чем пустить по нему машины, инженеры нагружают его и проверяют, выдержит ли он. Тесты делают то же самое для программы.' },
        { type: 'heading', value: 'Зачем писать тесты?' },
        { type: 'list', items: [
          'Уверенность — вы знаете, что код работает корректно',
          'Безопасный рефакторинг — изменяйте код, не боясь что-то сломать',
          'Документация — тесты показывают, как использовать функцию',
          'Быстрое обнаружение регрессий — если что-то сломалось, вы узнаете сразу'
        ]},
        { type: 'heading', value: 'Встроенный пакет testing' },
        { type: 'text', value: 'В Go тестирование встроено в язык. Не нужно устанавливать сторонние фреймворки — достаточно импортировать стандартный пакет "testing". Это как аптечка первой помощи, которая уже лежит в каждом доме.' },
        { type: 'code', language: 'go', value: 'package math\n\n// Sum складывает два числа\nfunc Sum(a, b int) int {\n    return a + b\n}' },
        { type: 'code', language: 'go', value: '// Файл: math_test.go\npackage math\n\nimport "testing"\n\nfunc TestSum(t *testing.T) {\n    result := Sum(2, 3)\n    if result != 5 {\n        t.Errorf("Sum(2, 3) = %d, хотели 5", result)\n    }\n}' },
        { type: 'note', value: 'Файл с тестами ОБЯЗАТЕЛЬНО должен заканчиваться на _test.go. Это соглашение Go — так компилятор знает, что эти файлы нужно включать только при запуске тестов.' },
        { type: 'tip', value: 'Тесты живут рядом с кодом, который они проверяют. Файл sum.go и sum_test.go находятся в одной папке. Это удобно — тесты всегда под рукой.' }
      ]
    },
    {
      id: 2,
      title: 'Именование тестовых функций',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Go есть строгое правило: тестовая функция должна начинаться с Test, принимать *testing.T и не возвращать значений. Это не рекомендация — это требование. Нарушите правило — тест просто не запустится.' },
        { type: 'heading', value: 'Правила именования' },
        { type: 'code', language: 'go', value: '// ПРАВИЛЬНО\nfunc TestAdd(t *testing.T) {}\nfunc TestAdd_WithNegativeNumbers(t *testing.T) {}\nfunc TestAdd_WhenOverflow(t *testing.T) {}\n\n// НЕПРАВИЛЬНО — не запустится как тест\nfunc testAdd(t *testing.T) {}   // строчная буква после Test\nfunc AddTest(t *testing.T) {}   // Test не в начале\nfunc TestAdd() {}               // нет параметра *testing.T' },
        { type: 'heading', value: 'Соглашение о структуре имени' },
        { type: 'text', value: 'Хорошая практика — именовать тесты по схеме: TestФункция_Сценарий. Например: TestDivide_ByZero (деление на ноль), TestLogin_WithWrongPassword (логин с неверным паролем). Это как описание на этикетке — сразу понятно, что проверяется.' },
        { type: 'code', language: 'go', value: 'package calculator\n\nimport "testing"\n\nfunc TestDivide_Normal(t *testing.T) {\n    result, err := Divide(10, 2)\n    if err != nil {\n        t.Fatalf("не ожидали ошибку: %v", err)\n    }\n    if result != 5 {\n        t.Errorf("Divide(10, 2) = %v, хотели 5", result)\n    }\n}\n\nfunc TestDivide_ByZero(t *testing.T) {\n    _, err := Divide(10, 0)\n    if err == nil {\n        t.Error("ожидали ошибку при делении на ноль")\n    }\n}' },
        { type: 'note', value: 'Пакет тестового файла может быть либо таким же (package math), либо с суффиксом _test (package math_test). Пакет с суффиксом _test используется для тестирования публичного API, как внешний пользователь.' }
      ]
    },
    {
      id: 3,
      title: 'Запуск тестов — go test',
      type: 'theory',
      content: [
        { type: 'text', value: 'Запуск тестов в Go — это одна команда: go test. Просто и элегантно, как кнопка "Старт" на пульте. Но у этой кнопки есть множество режимов.' },
        { type: 'heading', value: 'Основные команды' },
        { type: 'code', language: 'bash', value: '# Запустить тесты в текущем пакете\ngo test\n\n# Запустить тесты с подробным выводом\ngo test -v\n\n# Запустить тесты во всех пакетах проекта\ngo test ./...\n\n# Запустить конкретный тест по имени\ngo test -run TestSum\n\n# Запустить тесты, имя которых содержит "Divide"\ngo test -run TestDivide\n\n# Запустить с таймаутом (по умолчанию 10 минут)\ngo test -timeout 30s' },
        { type: 'heading', value: 'Вывод результатов' },
        { type: 'code', language: 'bash', value: '$ go test -v\n=== RUN   TestSum\n--- PASS: TestSum (0.00s)\n=== RUN   TestDivide_Normal\n--- PASS: TestDivide_Normal (0.00s)\n=== RUN   TestDivide_ByZero\n--- PASS: TestDivide_ByZero (0.00s)\nPASS\nok      myproject/calculator    0.003s' },
        { type: 'text', value: 'PASS означает, что все тесты прошли. FAIL — хотя бы один тест провалился. Это как светофор: зелёный — едем, красный — стоп, надо разбираться.' },
        { type: 'code', language: 'bash', value: '$ go test -v\n=== RUN   TestSum\n--- FAIL: TestSum (0.00s)\n    math_test.go:8: Sum(2, 3) = 6, хотели 5\nFAIL\nFAIL    myproject/math    0.002s' },
        { type: 'tip', value: 'Флаг -v (verbose) очень полезен — он показывает название каждого теста и время его выполнения. Без -v вы видите только итоговый PASS или FAIL.' }
      ]
    },
    {
      id: 4,
      title: 't.Error, t.Fatal, t.Log — методы тестирования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Параметр t *testing.T — это ваш инструмент для управления тестом. С его помощью вы сообщаете о провалах, логируете информацию и останавливаете тест. Это как пульт управления полётом: каждая кнопка делает своё дело.' },
        { type: 'heading', value: 'Методы *testing.T' },
        { type: 'code', language: 'go', value: 'func TestExample(t *testing.T) {\n    // t.Log — вывести сообщение (только при -v или при провале)\n    t.Log("начинаем тест")\n\n    // t.Error — зафиксировать провал, но ПРОДОЛЖИТЬ выполнение теста\n    result := Add(2, 2)\n    if result != 4 {\n        t.Errorf("Add(2,2) = %d, хотели 4", result)\n    }\n\n    // t.Fatal — зафиксировать провал и НЕМЕДЛЕННО остановить тест\n    conn := connectDB()\n    if conn == nil {\n        t.Fatal("не удалось подключиться к БД, дальнейшие проверки бессмысленны")\n    }\n    // если conn == nil, сюда мы не попадём\n    rows := conn.Query("SELECT 1")\n    _ = rows\n}' },
        { type: 'heading', value: 'Разница между Error и Fatal' },
        { type: 'text', value: 'Error и Fatal — это как предупреждение и аварийная остановка. t.Error говорит "здесь проблема, но давай проверим остальное". t.Fatal говорит "дальше нет смысла идти, стоп".' },
        { type: 'list', items: [
          't.Error(msg) — провал без остановки теста',
          't.Errorf(format, args) — провал с форматированным сообщением',
          't.Fatal(msg) — провал + немедленная остановка (вызывает runtime.Goexit)',
          't.Fatalf(format, args) — то же самое с форматированием',
          't.Log(msg) — лог (виден только при -v или при провале)',
          't.Logf(format, args) — форматированный лог',
          't.Skip(msg) — пропустить тест',
          't.Helper() — пометить функцию как вспомогательную (ошибка покажет строку вызывающего)'
        ]},
        { type: 'warning', value: 'НЕ используйте os.Exit() или panic() в тестах — это оставит тестовый процесс в неопределённом состоянии. Для экстренной остановки используйте t.Fatal().' }
      ]
    },
    {
      id: 5,
      title: 'Подтесты — t.Run',
      type: 'theory',
      content: [
        { type: 'text', value: 'Подтесты (subtests) позволяют разбить один большой тест на маленькие именованные части. Это как папки в файловой системе: вместо одного огромного файла — структурированное дерево.' },
        { type: 'heading', value: 'Синтаксис t.Run' },
        { type: 'code', language: 'go', value: 'package math\n\nimport "testing"\n\nfunc TestMultiply(t *testing.T) {\n    t.Run("положительные числа", func(t *testing.T) {\n        result := Multiply(3, 4)\n        if result != 12 {\n            t.Errorf("3*4 = %d, хотели 12", result)\n        }\n    })\n\n    t.Run("умножение на ноль", func(t *testing.T) {\n        result := Multiply(5, 0)\n        if result != 0 {\n            t.Errorf("5*0 = %d, хотели 0", result)\n        }\n    })\n\n    t.Run("отрицательные числа", func(t *testing.T) {\n        result := Multiply(-2, 3)\n        if result != -6 {\n            t.Errorf("-2*3 = %d, хотели -6", result)\n        }\n    })\n}' },
        { type: 'heading', value: 'Запуск конкретного подтеста' },
        { type: 'code', language: 'bash', value: '# Запустить только подтест с "ноль" в имени\ngo test -run TestMultiply/ноль\n\n# Вывод:\n=== RUN   TestMultiply\n=== RUN   TestMultiply/умножение_на_ноль\n--- PASS: TestMultiply (0.00s)\n    --- PASS: TestMultiply/умножение_на_ноль (0.00s)\nPASS' },
        { type: 'text', value: 'Пробелы в имени подтеста заменяются на подчёркивание при фильтрации. Подтест "умножение на ноль" в фильтре будет "умножение_на_ноль".' },
        { type: 'tip', value: 'Подтесты можно вкладывать друг в друга! Это позволяет создавать иерархию тестов: TestUser/Create/WithValidData, TestUser/Create/WithEmptyEmail и т.д.' }
      ]
    },
    {
      id: 6,
      title: 'Тестовые хелперы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тестовые хелперы — это вспомогательные функции, которые повторяют общую логику проверки. Как шаблон договора: не пишете каждый раз заново, а заполняете готовую форму.' },
        { type: 'heading', value: 'Проблема без хелперов' },
        { type: 'code', language: 'go', value: '// Повторяющийся код — плохо\nfunc TestAdd(t *testing.T) {\n    result := Add(2, 3)\n    if result != 5 {\n        t.Errorf("Add(2,3) = %d, хотели 5", result)\n    }\n    result = Add(0, 0)\n    if result != 0 {\n        t.Errorf("Add(0,0) = %d, хотели 0", result)\n    }\n    result = Add(-1, 1)\n    if result != 0 {\n        t.Errorf("Add(-1,1) = %d, хотели 0", result)\n    }\n}' },
        { type: 'heading', value: 'Решение с хелпером' },
        { type: 'code', language: 'go', value: 'package math\n\nimport "testing"\n\n// assertEqual — хелпер для сравнения целых чисел\nfunc assertEqual(t *testing.T, got, want int) {\n    t.Helper() // говорит Go: ошибка произошла в вызывающей функции, не здесь\n    if got != want {\n        t.Errorf("получили %d, хотели %d", got, want)\n    }\n}\n\nfunc TestAdd(t *testing.T) {\n    assertEqual(t, Add(2, 3), 5)\n    assertEqual(t, Add(0, 0), 0)\n    assertEqual(t, Add(-1, 1), 0)\n    assertEqual(t, Add(-5, -3), -8)\n}' },
        { type: 'text', value: 'Ключевое здесь — вызов t.Helper(). Без него сообщение об ошибке покажет строку внутри assertEqual, а не строку в TestAdd, где произошёл вызов. С t.Helper() ошибка правильно указывает на вызывающий код.' },
        { type: 'heading', value: 'Хелпер для создания тестовых данных' },
        { type: 'code', language: 'go', value: 'func newTestUser(t *testing.T, name string) *User {\n    t.Helper()\n    u, err := NewUser(name, name+"@test.com")\n    if err != nil {\n        t.Fatalf("не удалось создать тестового пользователя: %v", err)\n    }\n    return u\n}\n\nfunc TestUserUpdate(t *testing.T) {\n    u := newTestUser(t, "Алия")\n    err := u.UpdateName("Алия Беков")\n    if err != nil {\n        t.Errorf("UpdateName вернула ошибку: %v", err)\n    }\n}' },
        { type: 'note', value: 'Хелперы должны принимать *testing.T как первый аргумент и вызывать t.Helper(). Это стандартное соглашение в Go.' }
      ]
    },
    {
      id: 7,
      title: 'Testify — удобные утверждения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пакет testify — это самая популярная библиотека для тестирования в Go. Она добавляет удобные функции assert и require. Это как перейти с ручного инструмента на электрический — всё то же самое, но быстрее и удобнее.' },
        { type: 'heading', value: 'Установка' },
        { type: 'code', language: 'bash', value: 'go get github.com/stretchr/testify' },
        { type: 'heading', value: 'assert vs require' },
        { type: 'text', value: 'В testify два основных пакета: assert (продолжает тест при провале) и require (останавливает тест при провале). Это аналог t.Error и t.Fatal.' },
        { type: 'code', language: 'go', value: 'package calculator\n\nimport (\n    "testing"\n    "github.com/stretchr/testify/assert"\n    "github.com/stretchr/testify/require"\n)\n\nfunc TestDivide(t *testing.T) {\n    // require.NoError останавливает тест если err != nil\n    result, err := Divide(10, 2)\n    require.NoError(t, err, "деление 10/2 не должно давать ошибку")\n\n    // assert.Equal продолжает тест даже при провале\n    assert.Equal(t, 5.0, result, "10/2 должно быть 5")\n}\n\nfunc TestDivide_ByZero(t *testing.T) {\n    _, err := Divide(10, 0)\n    assert.Error(t, err, "ожидали ошибку при делении на ноль")\n    assert.EqualError(t, err, "деление на ноль невозможно")\n}' },
        { type: 'heading', value: 'Часто используемые функции testify' },
        { type: 'list', items: [
          'assert.Equal(t, expected, actual) — проверка равенства',
          'assert.NotEqual(t, a, b) — проверка неравенства',
          'assert.Nil(t, val) — проверка что значение nil',
          'assert.NotNil(t, val) — проверка что значение не nil',
          'assert.True(t, condition) — проверка истинности',
          'assert.False(t, condition) — проверка ложности',
          'assert.Error(t, err) — проверка что ошибка не nil',
          'assert.NoError(t, err) — проверка что ошибки нет',
          'assert.Contains(t, str, substr) — проверка вхождения подстроки',
          'assert.Len(t, slice, length) — проверка длины'
        ]},
        { type: 'tip', value: 'Используйте testify в командных проектах — он делает тесты более читаемыми. В небольших проектах стандартного пакета testing вполне достаточно.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: пишем тесты для калькулятора',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите полный набор тестов для функций простого калькулятора. Используйте t.Run для подтестов и t.Helper для вспомогательных функций.',
      requirements: [
        'Протестируйте функцию Add(a, b int) int',
        'Протестируйте функцию Subtract(a, b int) int',
        'Протестируйте функцию Multiply(a, b int) int',
        'Протестируйте функцию Divide(a, b float64) (float64, error)',
        'Для Divide проверьте случай деления на ноль',
        'Используйте t.Run для группировки сценариев',
        'Создайте хелпер assertInt(t, got, want int)'
      ],
      expectedOutput: 'PASS\nok  \tcalculator\t0.001s',
      hint: 'Начните с хелпера assertInt, затем используйте его в тестах Add, Subtract, Multiply. Для Divide нужно проверить две ветки: нормальное деление и деление на ноль.',
      solution: 'package calculator\n\nimport (\n    "testing"\n    "math"\n)\n\nfunc assertInt(t *testing.T, got, want int) {\n    t.Helper()\n    if got != want {\n        t.Errorf("получили %d, хотели %d", got, want)\n    }\n}\n\nfunc assertFloat(t *testing.T, got, want float64) {\n    t.Helper()\n    if math.Abs(got-want) > 1e-9 {\n        t.Errorf("получили %f, хотели %f", got, want)\n    }\n}\n\nfunc TestAdd(t *testing.T) {\n    t.Run("положительные", func(t *testing.T) {\n        assertInt(t, Add(2, 3), 5)\n    })\n    t.Run("с нулём", func(t *testing.T) {\n        assertInt(t, Add(0, 5), 5)\n    })\n    t.Run("отрицательные", func(t *testing.T) {\n        assertInt(t, Add(-2, -3), -5)\n    })\n}\n\nfunc TestSubtract(t *testing.T) {\n    assertInt(t, Subtract(10, 3), 7)\n    assertInt(t, Subtract(0, 5), -5)\n    assertInt(t, Subtract(-1, -1), 0)\n}\n\nfunc TestMultiply(t *testing.T) {\n    assertInt(t, Multiply(3, 4), 12)\n    assertInt(t, Multiply(0, 100), 0)\n    assertInt(t, Multiply(-2, 3), -6)\n}\n\nfunc TestDivide(t *testing.T) {\n    t.Run("нормальное деление", func(t *testing.T) {\n        result, err := Divide(10, 2)\n        if err != nil {\n            t.Fatalf("не ожидали ошибку: %v", err)\n        }\n        assertFloat(t, result, 5.0)\n    })\n    t.Run("деление на ноль", func(t *testing.T) {\n        _, err := Divide(10, 0)\n        if err == nil {\n            t.Error("ожидали ошибку при делении на ноль")\n        }\n    })\n}',
      explanation: 'Хелперы assertInt и assertFloat с t.Helper() делают ошибки читаемыми — они указывают на строку в тесте, а не внутри хелпера. t.Run создаёт подтесты, которые можно запускать независимо. t.Fatalf останавливает тест если err != nil — нет смысла проверять result когда уже есть ошибка.'
    }
  ]
}
