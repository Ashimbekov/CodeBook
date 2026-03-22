export default {
  id: 14,
  title: 'Множественные возвращаемые значения',
  description: 'Одна из главных особенностей Go — функции могут возвращать несколько значений. Это основа обработки ошибок и паттерна "comma ok" в Go.',
  lessons: [
    {
      id: 1,
      title: 'Множественные возвращаемые значения',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Go функции могут возвращать несколько значений'
        },
        {
          type: 'text',
          value: 'В большинстве языков функция возвращает одно значение. В Go функция может вернуть несколько значений одновременно. Это как курьер, который может доставить несколько посылок за один рейс, а не делать несколько поездок.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Возврат двух значений\nfunc swap(a, b int) (int, int) {\n    return b, a\n}\n\n// Возврат трёх значений\nfunc minMaxSum(nums []int) (int, int, int) {\n    if len(nums) == 0 {\n        return 0, 0, 0\n    }\n    min, max, sum := nums[0], nums[0], 0\n    for _, n := range nums {\n        if n < min { min = n }\n        if n > max { max = n }\n        sum += n\n    }\n    return min, max, sum\n}\n\nfunc main() {\n    a, b := swap(1, 2)\n    fmt.Println(a, b) // 2 1\n    \n    nums := []int{5, 2, 8, 1, 9, 3}\n    min, max, sum := minMaxSum(nums)\n    fmt.Printf("Мин=%d, Макс=%d, Сумма=%d\\n", min, max, sum)\n    // Мин=1, Макс=9, Сумма=28\n}'
        },
        {
          type: 'text',
          value: 'Множественные возвращаемые значения в скобках образуют "кортеж возврата". В отличие от Python, этот кортеж не является самостоятельным типом — его нельзя хранить в переменной напрямую.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc getCoords() (int, int) {\n    return 10, 20\n}\n\nfunc main() {\n    x, y := getCoords()\n    fmt.Println(x, y) // 10 20\n    \n    // Нельзя сделать: coords := getCoords() (если только не один возврат)\n    // Но можно игнорировать значения через _\n    _, y2 := getCoords()\n    fmt.Println("Только Y:", y2) // Только Y: 20\n}'
        }
      ]
    },
    {
      id: 2,
      title: 'Ошибка как второй возвращаемый тип',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Идиома Go: (значение, error)'
        },
        {
          type: 'text',
          value: 'В Go нет исключений (exceptions). Ошибки — это обычные значения, которые функция возвращает в качестве второго (или последнего) возвращаемого значения. Это как квитанция в магазине: продавец даёт вам и товар, и чек. Если что-то пошло не так — чек содержит описание проблемы, а товар — пустой.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "errors"\n    "fmt"\n    "strconv"\n)\n\n// Стандартный паттерн: (результат, error)\nfunc parseInt(s string) (int, error) {\n    n, err := strconv.Atoi(s)\n    if err != nil {\n        return 0, fmt.Errorf("не удалось преобразовать %q: %w", s, err)\n    }\n    return n, nil\n}\n\nfunc divide(a, b float64) (float64, error) {\n    if b == 0 {\n        return 0, errors.New("деление на ноль недопустимо")\n    }\n    return a / b, nil\n}\n\nfunc main() {\n    // Успешное выполнение\n    n, err := parseInt("42")\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n    } else {\n        fmt.Println("Число:", n) // Число: 42\n    }\n    \n    // Ошибка\n    _, err = parseInt("не число")\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n    }\n}'
        },
        {
          type: 'note',
          value: 'По соглашению: если функция возвращает ошибку, она всегда идёт последней. При ошибке остальные возвращаемые значения обычно нулевые (nil, 0, "", false).'
        },
        {
          type: 'tip',
          value: 'fmt.Errorf с %w (Go 1.13+) оборачивает ошибку и сохраняет оригинальную ошибку для последующей проверки через errors.Is() и errors.As().'
        }
      ]
    },
    {
      id: 3,
      title: 'Пустой идентификатор _',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Игнорирование значений через _'
        },
        {
          type: 'text',
          value: 'Пустой идентификатор _ — это мусорная корзина Go. Когда функция возвращает несколько значений, но некоторые из них вам не нужны, используйте _ чтобы "выбросить" их. Go не позволяет объявлять переменные без использования, поэтому _ необходим.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\nfunc getUserInfo() (string, int, string) {\n    return "Алиса", 30, "алиса@пример.ру"\n}\n\nfunc main() {\n    // Используем все значения\n    name, age, email := getUserInfo()\n    fmt.Println(name, age, email)\n    \n    // Нужно только имя и email\n    name, _, email = getUserInfo()\n    fmt.Println(name, email)\n    \n    // Нужен только возраст\n    _, age, _ = getUserInfo()\n    fmt.Println("Возраст:", age)\n    \n    // Игнорирование ошибки (ПЛОХАЯ практика, но иногда уместна)\n    parts := strings.Split("a:b:c", ":")\n    _ = parts // если parts нам не нужны\n}'
        },
        {
          type: 'warning',
          value: 'Игнорировать ошибки через _ — плохая практика! Если функция возвращает error, почти всегда нужно её проверить. Исключение: когда вы 100% уверены, что ошибка невозможна в данном контексте.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // _ используется также при range\n    nums := []int{10, 20, 30}\n    \n    // Только значения\n    for _, v := range nums {\n        fmt.Println(v)\n    }\n    \n    // Только индексы\n    for i := range nums {\n        fmt.Println(i)\n    }\n    \n    // _ позволяет импортировать пакет только для side-эффектов\n    // import _ "image/png" // регистрирует PNG декодер\n}'
        }
      ]
    },
    {
      id: 4,
      title: 'Обмен значений',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Элегантный swap через множественный возврат'
        },
        {
          type: 'text',
          value: 'Множественное присваивание — мощная особенность Go. Правая часть вычисляется полностью до присваивания левой. Это позволяет менять значения переменных без временной переменной.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // В других языках нужна временная переменная:\n    // temp := a; a = b; b = temp\n    \n    // В Go всё просто!\n    a, b := 1, 2\n    fmt.Println(a, b) // 1 2\n    \n    a, b = b, a       // обмен значений без temp!\n    fmt.Println(a, b) // 2 1\n    \n    // Множественное присваивание\n    x, y, z := 10, 20, 30\n    x, y, z = y, z, x // ротация значений\n    fmt.Println(x, y, z) // 20 30 10\n    \n    // Объявление нескольких переменных\n    name, age, active := "Боб", 25, true\n    fmt.Println(name, age, active)\n}'
        },
        {
          type: 'text',
          value: 'Это особенно полезно в алгоритмах сортировки, реверса и других операциях, где нужно менять элементы местами.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Реверс среза через обмен\nfunc reverse(s []int) {\n    for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {\n        s[i], s[j] = s[j], s[i] // обмен\n    }\n}\n\nfunc main() {\n    nums := []int{1, 2, 3, 4, 5}\n    reverse(nums)\n    fmt.Println(nums) // [5 4 3 2 1]\n}'
        }
      ]
    },
    {
      id: 5,
      title: 'Паттерн "ok"',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Унифицированный паттерн проверки'
        },
        {
          type: 'text',
          value: 'Паттерн "comma ok" (v, ok := ...) — это унифицированный способ проверки успешности операции в Go. Он используется в трёх ключевых контекстах: чтение из карты, получение из канала, и type assertion.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // 1. Карты\n    m := map[string]int{"a": 1, "b": 0}\n    \n    v, ok := m["a"]\n    fmt.Printf("a: %d, exists: %v\\n", v, ok) // 1, true\n    \n    v, ok = m["b"]\n    fmt.Printf("b: %d, exists: %v\\n", v, ok) // 0, true\n    \n    v, ok = m["c"]\n    fmt.Printf("c: %d, exists: %v\\n", v, ok) // 0, false\n    \n    // 2. Type assertion\n    var i interface{} = "hello"\n    \n    s, ok := i.(string)\n    fmt.Printf("string: %q, ok: %v\\n", s, ok) // "hello", true\n    \n    n, ok := i.(int)\n    fmt.Printf("int: %d, ok: %v\\n", n, ok)    // 0, false\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Собственная функция с ok-паттерном\nfunc safeDivide(a, b int) (int, bool) {\n    if b == 0 {\n        return 0, false\n    }\n    return a / b, true\n}\n\nfunc findFirst(nums []int, predicate func(int) bool) (int, bool) {\n    for _, n := range nums {\n        if predicate(n) {\n            return n, true\n        }\n    }\n    return 0, false\n}\n\nfunc main() {\n    if result, ok := safeDivide(10, 3); ok {\n        fmt.Println("Результат:", result) // 3\n    }\n    \n    if _, ok := safeDivide(10, 0); !ok {\n        fmt.Println("Деление на ноль!")\n    }\n    \n    nums := []int{1, 5, 3, 8, 2}\n    if n, ok := findFirst(nums, func(x int) bool { return x > 4 }); ok {\n        fmt.Println("Первый > 4:", n) // 5\n    }\n}'
        },
        {
          type: 'tip',
          value: 'Паттерн "ok" лучше возврата -1, null или специального значения. Он явный, типобезопасный и не может быть случайно проигнорирован (в отличие от ошибки -1).'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Цепочка операций с ошибками',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите функцию parseAndCalculate(input string) (float64, error), которая: 1) разбирает строку формата "число1 оператор число2", 2) выполняет операцию (+, -, *, /), 3) возвращает результат или ошибку. Используйте множественные возвращаемые значения на каждом шаге.',
      requirements: [
        'Парсить строку вида "10 + 5", "3.14 * 2", "10 / 0"',
        'Поддерживать операторы: +, -, *, /',
        'Возвращать ошибку при делении на ноль',
        'Возвращать ошибку при неверном формате',
        'Каждая подфункция возвращает (значение, error)'
      ],
      expectedOutput: '15\n6.28\nошибка: деление на ноль',
      hint: 'Используйте strings.Fields для разбора строки, strconv.ParseFloat для преобразования чисел. Создайте отдельные функции для каждого шага, каждая возвращает (результат, error).',
      solution: 'package main\n\nimport (\n    "fmt"\n    "strconv"\n    "strings"\n)\n\nfunc parseFloat(s string) (float64, error) {\n    n, err := strconv.ParseFloat(strings.TrimSpace(s), 64)\n    if err != nil {\n        return 0, fmt.Errorf("неверное число %q", s)\n    }\n    return n, nil\n}\n\nfunc calculate(a, b float64, op string) (float64, error) {\n    switch op {\n    case "+":\n        return a + b, nil\n    case "-":\n        return a - b, nil\n    case "*":\n        return a * b, nil\n    case "/":\n        if b == 0 {\n            return 0, fmt.Errorf("деление на ноль")\n        }\n        return a / b, nil\n    default:\n        return 0, fmt.Errorf("неизвестный оператор %q", op)\n    }\n}\n\nfunc parseAndCalculate(input string) (float64, error) {\n    parts := strings.Fields(input)\n    if len(parts) != 3 {\n        return 0, fmt.Errorf("неверный формат, ожидается: число оператор число")\n    }\n    a, err := parseFloat(parts[0])\n    if err != nil {\n        return 0, err\n    }\n    b, err := parseFloat(parts[2])\n    if err != nil {\n        return 0, err\n    }\n    return calculate(a, b, parts[1])\n}\n\nfunc main() {\n    tests := []string{\n        "10 + 5",\n        "3.14 * 2",\n        "10 / 0",\n        "abc + 5",\n    }\n    for _, t := range tests {\n        result, err := parseAndCalculate(t)\n        if err != nil {\n            fmt.Printf("Ошибка (%s): %v\\n", t, err)\n        } else {\n            fmt.Printf("%s = %g\\n", t, result)\n        }\n    }\n}',
      explanation: 'Каждый шаг обработки возвращает (результат, error). Это позволяет чётко обрабатывать ошибки на каждом уровне. Паттерн "if err != nil { return 0, err }" — стандартный способ распространения ошибок вверх по стеку вызовов в Go.'
    }
  ]
}
