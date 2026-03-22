export default {
  id: 8,
  title: 'Циклы (for)',
  description: 'Единственный цикл Go — for — который заменяет while, do-while и foreach. Изучаем все его формы: классический, while-стиль, бесконечный, for range, break и continue.',
  lessons: [
    {
      id: 1,
      title: 'Базовый for',
      content: [
        {
          type: 'heading',
          value: 'Единственный цикл в Go'
        },
        {
          type: 'text',
          value: 'В Go есть только один цикл — for. Но он достаточно гибкий, чтобы заменить все виды циклов из других языков: while, do-while, foreach. Это пример философии Go: меньше конструкций, но каждая — универсальная.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Классический for: инициализация; условие; шаг\n    for i := 0; i < 5; i++ {\n        fmt.Println(i)\n    }\n    // 0, 1, 2, 3, 4\n\n    // Несколько переменных в for\n    for i, j := 0, 10; i < 5; i, j = i+1, j-2 {\n        fmt.Printf("i=%d, j=%d\\n", i, j)\n    }\n    // i=0, j=10\n    // i=1, j=8\n    // i=2, j=6\n    // i=3, j=4\n    // i=4, j=2\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Обратный порядок\n    for i := 5; i > 0; i-- {\n        fmt.Printf("Обратный отсчёт: %d\\n", i)\n    }\n    fmt.Println("Пуск!")\n\n    // Шаг 2\n    fmt.Println("Чётные числа от 0 до 10:")\n    for i := 0; i <= 10; i += 2 {\n        fmt.Print(i, " ")\n    }\n    fmt.Println()\n    // 0 2 4 6 8 10\n\n    // Вычисление суммы\n    sum := 0\n    for i := 1; i <= 100; i++ {\n        sum += i\n    }\n    fmt.Println("Сумма 1..100 =", sum) // 5050\n}'
        },
        {
          type: 'note',
          value: 'Переменная i, объявленная в for, доступна только внутри цикла. После его завершения она уже не существует. Это помогает избежать случайного использования "счётчика цикла" вне цикла.'
        }
      ]
    },
    {
      id: 2,
      title: 'While-стиль for',
      content: [
        {
          type: 'heading',
          value: 'for как while'
        },
        {
          type: 'text',
          value: 'В Go нет ключевого слова while. Вместо него используется for только с условием (без инициализации и шага). Это делает его аналогом while из других языков.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // for как while\n    count := 0\n    for count < 5 {\n        fmt.Println("count =", count)\n        count++\n    }\n\n    // Ожидание условия (симуляция)\n    energy := 100\n    for energy > 0 {\n        fmt.Printf("Энергия: %d\\n", energy)\n        energy -= 25\n    }\n    fmt.Println("Энергия исчерпана!")\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "math"\n)\n\nfunc main() {\n    // Нахождение числа методом бинарного поиска\n    target := 64.0\n    guess := 1.0\n    iterations := 0\n\n    for math.Abs(guess*guess-target) > 0.0001 {\n        guess = (guess + target/guess) / 2 // метод Ньютона\n        iterations++\n    }\n\n    fmt.Printf("Квадратный корень из %.0f ≈ %.6f\\n", target, guess)\n    fmt.Printf("Итераций: %d\\n", iterations)\n\n    // Накопление строки\n    result := ""\n    words := []string{"Привет", " ", "мир", "!"}\n    i := 0\n    for i < len(words) {\n        result += words[i]\n        i++\n    }\n    fmt.Println(result) // Привет мир!\n}'
        },
        {
          type: 'tip',
          value: 'Используйте while-стиль for (только с условием) когда количество итераций заранее неизвестно. Используйте классический for (с i := 0; i < n; i++) когда итерируетесь по индексам.'
        }
      ]
    },
    {
      id: 3,
      title: 'Бесконечный цикл',
      content: [
        {
          type: 'heading',
          value: 'for без условия'
        },
        {
          type: 'text',
          value: 'for без любых частей создаёт бесконечный цикл. Это эквивалент while(true) в других языках. Используется для серверов, игровых петель и других случаев, когда цикл должен работать всегда.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc main() {\n    // Бесконечный цикл - нужен явный break для выхода!\n    counter := 0\n    for {\n        if counter >= 5 {\n            break // Выход из цикла\n        }\n        fmt.Println("Итерация:", counter)\n        counter++\n    }\n\n    // Симуляция работы сервера (3 "запроса")\n    requestCount := 0\n    for {\n        requestCount++\n        fmt.Printf("Обрабатываем запрос #%d\\n", requestCount)\n        time.Sleep(10 * time.Millisecond) // имитация работы\n        if requestCount >= 3 {\n            fmt.Println("Сервер остановлен")\n            break\n        }\n    }\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "math/rand"\n)\n\nfunc main() {\n    // Угадай число (симуляция)\n    secret := rand.Intn(10) + 1 // 1-10\n    attempts := 0\n    maxAttempts := 5\n\n    fmt.Printf("Загадано число от 1 до 10\\n")\n\n    for {\n        attempts++\n        guess := rand.Intn(10) + 1 // Случайная догадка\n        fmt.Printf("Попытка %d: %d", attempts, guess)\n\n        if guess == secret {\n            fmt.Printf(" - Правильно! Загадано было %d\\n", secret)\n            break\n        } else if guess < secret {\n            fmt.Println(" - Больше!")\n        } else {\n            fmt.Println(" - Меньше!")\n        }\n\n        if attempts >= maxAttempts {\n            fmt.Printf("Попытки исчерпаны! Было загадано: %d\\n", secret)\n            break\n        }\n    }\n}'
        },
        {
          type: 'warning',
          value: 'Бесконечный цикл без break приведёт к зависанию программы! Всегда предусматривайте условие выхода. Исключение — намеренно работающие вечно серверы, которые завершаются через системные сигналы.'
        }
      ]
    },
    {
      id: 4,
      title: 'for range',
      content: [
        {
          type: 'heading',
          value: 'Итерация по коллекциям'
        },
        {
          type: 'text',
          value: 'Конструкция for range — это идиоматичный способ итерации в Go. Она работает со срезами, массивами, строками, map и каналами. Range возвращает индекс и значение каждого элемента.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Итерация по срезу\n    fruits := []string{"Яблоко", "Банан", "Вишня"}\n\n    // Индекс и значение\n    for i, fruit := range fruits {\n        fmt.Printf("%d: %s\\n", i, fruit)\n    }\n    // 0: Яблоко\n    // 1: Банан\n    // 2: Вишня\n\n    // Только значения (игнорируем индекс)\n    for _, fruit := range fruits {\n        fmt.Println(fruit)\n    }\n\n    // Только индексы (игнорируем значение)\n    for i := range fruits {\n        fmt.Println("Индекс:", i)\n    }\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Итерация по map\n    capitals := map[string]string{\n        "Россия":    "Москва",\n        "Германия":  "Берлин",\n        "Франция":   "Париж",\n    }\n\n    for country, capital := range capitals {\n        fmt.Printf("Столица %s: %s\\n", country, capital)\n    }\n    // Порядок не гарантирован для map!\n\n    // Итерация по строке (рунам)\n    word := "Привет"\n    fmt.Println("Символы:")\n    for i, r := range word {\n        fmt.Printf("  [%d] %c (U+%04X)\\n", i, r, r)\n    }\n\n    // Итерация по числовому диапазону (Go 1.22+)\n    // for i := range 5 {\n    //     fmt.Println(i)\n    // }\n}'
        },
        {
          type: 'note',
          value: 'При итерации по строке через range, вы получаете руны (Unicode символы), а не байты. Это важно для строк с кириллицей и другими многобайтовыми символами. Индекс — это позиция в байтах, не в рунах!'
        }
      ]
    },
    {
      id: 5,
      title: 'break и continue',
      content: [
        {
          type: 'heading',
          value: 'Управление потоком в циклах'
        },
        {
          type: 'text',
          value: 'break и continue — ключевые слова для управления выполнением цикла. break немедленно выходит из цикла, continue пропускает текущую итерацию и переходит к следующей.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // break - выход из цикла\n    fmt.Println("break пример:")\n    for i := 0; i < 10; i++ {\n        if i == 5 {\n            fmt.Println("Нашли 5, выходим!")\n            break\n        }\n        fmt.Print(i, " ")\n    }\n    fmt.Println()\n    // 0 1 2 3 4 Нашли 5, выходим!\n\n    // continue - пропуск итерации\n    fmt.Println("continue пример:")\n    for i := 0; i < 10; i++ {\n        if i%2 == 0 {\n            continue // пропускаем чётные\n        }\n        fmt.Print(i, " ")\n    }\n    fmt.Println()\n    // 1 3 5 7 9\n}'
        },
        {
          type: 'heading',
          value: 'Метки (labels) для вложенных циклов'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // break выходит только из ближайшего цикла\n    // Для вложенных циклов используем метки\n\nOuter: // метка для внешнего цикла\n    for i := 0; i < 3; i++ {\n        for j := 0; j < 3; j++ {\n            if i == 1 && j == 1 {\n                fmt.Println("Выходим из обоих циклов!")\n                break Outer // выход из внешнего цикла\n            }\n            fmt.Printf("i=%d, j=%d\\n", i, j)\n        }\n    }\n    fmt.Println("После цикла")\n\n    // continue с меткой\nLoop:\n    for i := 0; i < 3; i++ {\n        for j := 0; j < 3; j++ {\n            if j == 1 {\n                continue Loop // следующая итерация внешнего\n            }\n            fmt.Printf("[%d,%d] ", i, j)\n        }\n    }\n    fmt.Println()\n    // [0,0] [1,0] [2,0]\n}'
        },
        {
          type: 'tip',
          value: 'Метки в Go — это законный способ управлять вложенными циклами. В других языках для этого часто используют флаги-переменные или функции. Метки делают намерение явным, но не злоупотребляйте ими.'
        }
      ]
    },
    {
      id: 6,
      title: 'Вложенные циклы',
      content: [
        {
          type: 'heading',
          value: 'Циклы внутри циклов'
        },
        {
          type: 'text',
          value: 'Вложенные циклы используются для работы с двумерными структурами данных, генерации таблиц и поиска всех пар элементов. Внутренний цикл выполняется полностью для каждой итерации внешнего.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Таблица умножения\n    fmt.Println("Таблица умножения 3x3:")\n    for i := 1; i <= 3; i++ {\n        for j := 1; j <= 3; j++ {\n            fmt.Printf("%3d", i*j)\n        }\n        fmt.Println()\n    }\n    //   1  2  3\n    //   2  4  6\n    //   3  6  9\n\n    // Треугольник звёздочек\n    fmt.Println("Треугольник:")\n    for i := 1; i <= 5; i++ {\n        for j := 0; j < i; j++ {\n            fmt.Print("*")\n        }\n        fmt.Println()\n    }\n    // *\n    // **\n    // ***\n    // ****\n    // *****\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Поиск всех пар, дающих нужную сумму\nfunc findPairs(numbers []int, target int) {\n    fmt.Printf("Пары с суммой %d:\\n", target)\n    for i := 0; i < len(numbers); i++ {\n        for j := i + 1; j < len(numbers); j++ {\n            if numbers[i]+numbers[j] == target {\n                fmt.Printf("  %d + %d = %d\\n", numbers[i], numbers[j], target)\n            }\n        }\n    }\n}\n\nfunc main() {\n    nums := []int{1, 2, 3, 4, 5, 6, 7, 8, 9}\n    findPairs(nums, 10)\n    // Пары с суммой 10:\n    //   1 + 9 = 10\n    //   2 + 8 = 10\n    //   3 + 7 = 10\n    //   4 + 6 = 10\n}'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Числа Фибоначчи и простые числа',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Напишите две функции: одна генерирует числа Фибоначчи до заданного предела, другая находит все простые числа до N методом решета Эратосфена.',
      requirements: [
        'Функция fibonacci(limit int) []int — возвращает числа Фибоначчи, не превышающие limit',
        'Функция primes(n int) []int — возвращает все простые числа от 2 до n',
        'В main вызовите fibonacci(100) и выведите результат',
        'В main вызовите primes(50) и выведите результат',
        'Используйте for без range для fibonacci и вложенные циклы для primes'
      ],
      expectedOutput: 'Числа Фибоначчи до 100: [1 1 2 3 5 8 13 21 34 55 89]\nПростые числа до 50: [2 3 5 7 11 13 17 19 23 29 31 37 41 43 47]',
      hint: 'Для Фибоначчи: начните с a=1, b=1 и в цикле: a, b = b, a+b, пока a <= limit. Для простых чисел: создайте срез булевых значений, отметьте составные числа и соберите оставшиеся.',
      solution: 'package main\n\nimport "fmt"\n\nfunc fibonacci(limit int) []int {\n    result := []int{}\n    a, b := 1, 1\n    for a <= limit {\n        result = append(result, a)\n        a, b = b, a+b\n    }\n    return result\n}\n\nfunc primes(n int) []int {\n    // Решето Эратосфена\n    isComposite := make([]bool, n+1)\n    for i := 2; i*i <= n; i++ {\n        if !isComposite[i] {\n            for j := i * i; j <= n; j += i {\n                isComposite[j] = true\n            }\n        }\n    }\n\n    result := []int{}\n    for i := 2; i <= n; i++ {\n        if !isComposite[i] {\n            result = append(result, i)\n        }\n    }\n    return result\n}\n\nfunc main() {\n    fibs := fibonacci(100)\n    fmt.Println("Числа Фибоначчи до 100:", fibs)\n\n    ps := primes(50)\n    fmt.Println("Простые числа до 50:", ps)\n}',
      explanation: 'Функция fibonacci использует два "бегущих" значения a и b. На каждом шаге: a становится b, а b становится a+b. Это классический алгоритм без рекурсии. Решето Эратосфена — эффективный алгоритм для нахождения простых чисел. Для каждого найденного простого p отмечаем все его кратные как составные. Вложенный цикл j := i*i оптимален: меньшие кратные уже были отмечены.'
    }
  ]
}
