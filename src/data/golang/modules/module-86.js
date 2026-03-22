export default {
  id: 86,
  title: 'Практикум: Основы Go',
  description: 'Десять практических задач на основы языка Go: от конвертации температур до простого калькулятора. Задачи расположены по возрастанию сложности.',
  lessons: [
    {
      id: 1,
      title: 'Конвертер температур',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши функции конвертации температур между шкалами Цельсия, Фаренгейта и Кельвина.',
      requirements: [
        'Функция CelsiusToFahrenheit(c float64) float64',
        'Функция FahrenheitToCelsius(f float64) float64',
        'Функция CelsiusToKelvin(c float64) float64',
        'Функция KelvinToCelsius(k float64) float64',
        'В main: конвертировать 0°C, 100°C, -40°C, 37°C и 300K'
      ],
      expectedOutput: '0°C = 32.00°F = 273.15K\n100°C = 212.00°F = 373.15K\n-40°C = -40.00°F = 233.15K\n37°C = 98.60°F = 310.15K\n300K = 26.85°C',
      hint: 'Формулы: F = C * 9/5 + 32, K = C + 273.15. Используй fmt.Printf с форматом %.2f для округления до двух знаков.',
      solution: 'package main\n\nimport "fmt"\n\nfunc CelsiusToFahrenheit(c float64) float64 {\n    return c*9.0/5.0 + 32\n}\n\nfunc FahrenheitToCelsius(f float64) float64 {\n    return (f - 32) * 5.0 / 9.0\n}\n\nfunc CelsiusToKelvin(c float64) float64 {\n    return c + 273.15\n}\n\nfunc KelvinToCelsius(k float64) float64 {\n    return k - 273.15\n}\n\nfunc main() {\n    temps := []float64{0, 100, -40, 37}\n    for _, c := range temps {\n        fmt.Printf("%.0f°C = %.2f°F = %.2fK\\n",\n            c, CelsiusToFahrenheit(c), CelsiusToKelvin(c))\n    }\n    fmt.Printf("300K = %.2f°C\\n", KelvinToCelsius(300))\n}',
      explanation: 'Базовые арифметические операции. Важно использовать float64 для точности вычислений. fmt.Printf с форматом %.2f округляет вывод до двух знаков после запятой.'
    },
    {
      id: 2,
      title: 'FizzBuzz',
      type: 'practice',
      difficulty: 'easy',
      description: 'Классическая задача FizzBuzz: для чисел 1-30 вывести Fizz (кратно 3), Buzz (кратно 5), FizzBuzz (кратно 15) или само число.',
      requirements: [
        'Функция FizzBuzz(n int) string — возвращает строку для числа n',
        'Вывести результаты для чисел 1-30',
        'Кратно 15 -> "FizzBuzz", кратно 3 -> "Fizz", кратно 5 -> "Buzz", иначе -> число'
      ],
      expectedOutput: '1 2 Fizz 4 Buzz Fizz 7 8 Fizz Buzz 11 Fizz 13 14 FizzBuzz 16 17 Fizz 19 Buzz Fizz 22 23 Fizz Buzz 26 Fizz 28 29 FizzBuzz',
      hint: 'Порядок проверок важен: сначала проверяй делимость на 15 (или на 3 И на 5), затем на 3, затем на 5. Оператор % даёт остаток от деления.',
      solution: 'package main\n\nimport "fmt"\n\nfunc FizzBuzz(n int) string {\n    switch {\n    case n%15 == 0:\n        return "FizzBuzz"\n    case n%3 == 0:\n        return "Fizz"\n    case n%5 == 0:\n        return "Buzz"\n    default:\n        return fmt.Sprintf("%d", n)\n    }\n}\n\nfunc main() {\n    for i := 1; i <= 30; i++ {\n        if i > 1 {\n            fmt.Print(" ")\n        }\n        fmt.Print(FizzBuzz(i))\n    }\n    fmt.Println()\n}',
      explanation: 'switch без условия работает как цепочка if-else. Порядок case важен: n%15 должен быть первым, иначе числа кратные 15 попадут в Fizz или Buzz. fmt.Sprintf("%d", n) конвертирует int в строку.'
    },
    {
      id: 3,
      title: 'Проверка палиндрома',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши функцию, проверяющую является ли строка палиндромом (читается одинаково слева и справа). Поддержи кириллицу.',
      requirements: [
        'Функция IsPalindrome(s string) bool',
        'Игнорировать регистр (приводить к нижнему)',
        'Работать с Unicode (кириллица)',
        'Проверить: "racecar", "Мадам", "hello", "А роза упала на лапу Азора", "Go"'
      ],
      expectedOutput: '"racecar" - палиндром: true\n"Мадам" - палиндром: true\n"hello" - палиндром: false\n"А роза упала на лапу Азора" - палиндром: false\n"Go" - палиндром: false',
      hint: 'Для Unicode используй []rune, а не []byte. strings.ToLower работает с кириллицей. Для фразы с пробелами нужно их убирать — используй strings.ReplaceAll.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "strings"\n    "unicode"\n)\n\nfunc IsPalindrome(s string) bool {\n    // Оставляем только буквы и цифры, приводим к нижнему регистру\n    var runes []rune\n    for _, r := range strings.ToLower(s) {\n        if unicode.IsLetter(r) || unicode.IsDigit(r) {\n            runes = append(runes, r)\n        }\n    }\n    n := len(runes)\n    for i := 0; i < n/2; i++ {\n        if runes[i] != runes[n-1-i] {\n            return false\n        }\n    }\n    return true\n}\n\nfunc main() {\n    words := []string{"racecar", "Мадам", "hello", "А роза упала на лапу Азора", "Go"}\n    for _, w := range words {\n        fmt.Printf("%q - палиндром: %v\\n", w, IsPalindrome(w))\n    }\n}',
      explanation: 'Ключевой момент — работа с Unicode через []rune. Байтовый доступ к кириллическим строкам даст неверный результат, так как каждый кириллический символ занимает 2 байта. unicode.IsLetter фильтрует только буквы, unicode.IsDigit — цифры. Алгоритм сравнивает с двух концов до середины.'
    },
    {
      id: 4,
      title: 'Числа Фибоначчи',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй несколько способов вычисления чисел Фибоначчи: рекурсивный, итеративный и с мемоизацией.',
      requirements: [
        'FibRecursive(n int) int — рекурсивная реализация',
        'FibIterative(n int) int — итеративная реализация',
        'FibMemo(n int) int — с мемоизацией через map',
        'Вывести первые 10 чисел Фибоначчи тремя способами',
        'Сравнить скорость для n=35 (только итеративный и мемо)'
      ],
      expectedOutput: 'Рекурсивный: 0 1 1 2 3 5 8 13 21 34\nИтеративный: 0 1 1 2 3 5 8 13 21 34\nМемоизация:  0 1 1 2 3 5 8 13 21 34\nFib(35) итерат = 9227465\nFib(35) мемо   = 9227465',
      hint: 'Мемоизация: храни вычисленные значения в map[int]int. Перед вычислением проверяй наличие в кэше. Рекурсивный без мемоизации очень медленный для n>35.',
      solution: 'package main\n\nimport "fmt"\n\nfunc FibRecursive(n int) int {\n    if n <= 1 {\n        return n\n    }\n    return FibRecursive(n-1) + FibRecursive(n-2)\n}\n\nfunc FibIterative(n int) int {\n    if n <= 1 {\n        return n\n    }\n    a, b := 0, 1\n    for i := 2; i <= n; i++ {\n        a, b = b, a+b\n    }\n    return b\n}\n\nvar memo = map[int]int{}\n\nfunc FibMemo(n int) int {\n    if n <= 1 {\n        return n\n    }\n    if v, ok := memo[n]; ok {\n        return v\n    }\n    result := FibMemo(n-1) + FibMemo(n-2)\n    memo[n] = result\n    return result\n}\n\nfunc main() {\n    fmt.Print("Рекурсивный: ")\n    for i := 0; i < 10; i++ {\n        if i > 0 {\n            fmt.Print(" ")\n        }\n        fmt.Print(FibRecursive(i))\n    }\n    fmt.Println()\n\n    fmt.Print("Итеративный: ")\n    for i := 0; i < 10; i++ {\n        if i > 0 {\n            fmt.Print(" ")\n        }\n        fmt.Print(FibIterative(i))\n    }\n    fmt.Println()\n\n    fmt.Print("Мемоизация:  ")\n    for i := 0; i < 10; i++ {\n        if i > 0 {\n            fmt.Print(" ")\n        }\n        fmt.Print(FibMemo(i))\n    }\n    fmt.Println()\n\n    fmt.Printf("Fib(35) итерат = %d\\n", FibIterative(35))\n    fmt.Printf("Fib(35) мемо   = %d\\n", FibMemo(35))\n}',
      explanation: 'Три подхода имеют разную сложность: рекурсивный O(2^n), итеративный O(n) время O(1) память, мемоизация O(n) время и память. Одновременное присваивание a, b = b, a+b в Go атомарно — значения не перезаписываются до завершения правой части.'
    },
    {
      id: 5,
      title: 'Факториал с защитой от переполнения',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй вычисление факториала итеративно и рекурсивно. Обработай граничные случаи и переполнение для больших чисел.',
      requirements: [
        'FactorialIterative(n int) (int64, error) — итеративный, возвращает ошибку для n < 0',
        'FactorialRecursive(n int) (int64, error) — рекурсивный с защитой',
        'Вернуть ошибку если n < 0',
        'Вернуть ошибку если n > 20 (переполнение int64)',
        'Вывести 0! до 10! и проверить граничные случаи'
      ],
      expectedOutput: '0! = 1\n1! = 1\n5! = 120\n10! = 3628800\n20! = 2432902008176640000\nОшибка: n=-1: факториал не определён\nОшибка: n=21: переполнение int64',
      hint: 'Факториал: 0! = 1, n! = n * (n-1)!. Максимальный факториал для int64 — это 20! = 2432902008176640000. 21! уже переполняет int64.',
      solution: 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\nfunc FactorialIterative(n int) (int64, error) {\n    if n < 0 {\n        return 0, fmt.Errorf("n=%d: факториал не определён", n)\n    }\n    if n > 20 {\n        return 0, fmt.Errorf("n=%d: переполнение int64", n)\n    }\n    result := int64(1)\n    for i := 2; i <= n; i++ {\n        result *= int64(i)\n    }\n    return result, nil\n}\n\nfunc FactorialRecursive(n int) (int64, error) {\n    if n < 0 {\n        return 0, fmt.Errorf("n=%d: факториал не определён", n)\n    }\n    if n > 20 {\n        return 0, fmt.Errorf("n=%d: переполнение int64", n)\n    }\n    if n <= 1 {\n        return 1, nil\n    }\n    prev, err := FactorialRecursive(n - 1)\n    if err != nil {\n        return 0, err\n    }\n    return int64(n) * prev, nil\n}\n\nfunc main() {\n    for _, n := range []int{0, 1, 5, 10, 20} {\n        v, _ := FactorialIterative(n)\n        fmt.Printf("%d! = %d\\n", n, v)\n    }\n\n    for _, n := range []int{-1, 21} {\n        _, err := FactorialIterative(n)\n        if errors.Is(err, nil) {\n            continue\n        }\n        fmt.Printf("Ошибка: %v\\n", err)\n    }\n}',
      explanation: 'int64 максимум ~9.2 * 10^18, а 21! ≈ 5.1 * 10^19, поэтому ограничение n <= 20. В рекурсивной версии ошибка передаётся вверх по стеку вызовов. Важно проверять граничные условия до вычислений.'
    },
    {
      id: 6,
      title: 'Переворот строки',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши функцию переворота строки с корректной поддержкой Unicode (кириллица, эмодзи).',
      requirements: [
        'ReverseString(s string) string — переворачивает строку',
        'Корректно работать с многобайтовыми символами Unicode',
        'Проверить: "hello", "Привет", "racecar", "Go!", "🎉🎊🎈"'
      ],
      expectedOutput: '"hello" -> "olleh"\n"Привет" -> "тевирП"\n"racecar" -> "racecar"\n"Go!" -> "!oG"\n"🎉🎊🎈" -> "🎈🎊🎉"',
      hint: 'Конвертируй в []rune для Unicode-корректности. Переворачивай слайс rune, потом конвертируй обратно в string. Обмен элементов: runes[i], runes[j] = runes[j], runes[i].',
      solution: 'package main\n\nimport "fmt"\n\nfunc ReverseString(s string) string {\n    runes := []rune(s)\n    for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {\n        runes[i], runes[j] = runes[j], runes[i]\n    }\n    return string(runes)\n}\n\nfunc main() {\n    words := []string{"hello", "Привет", "racecar", "Go!", "🎉🎊🎈"}\n    for _, w := range words {\n        fmt.Printf("%q -> %q\\n", w, ReverseString(w))\n    }\n}',
      explanation: 'Ключевая идея: []rune хранит Unicode code points (каждый символ — один rune), в отличие от []byte. Кириллический символ занимает 2 байта, эмодзи — 4, поэтому переворот байтов даст неверный результат. Обмен через одну строку a, b = b, a — идиоматичный Go.'
    },
    {
      id: 7,
      title: 'Подсчёт гласных',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши функцию подсчёта гласных букв в строке. Поддержи русские и английские гласные, игнорируй регистр.',
      requirements: [
        'CountVowels(s string) int — подсчёт гласных',
        'Английские гласные: a, e, i, o, u',
        'Русские гласные: а, е, ё, и, о, у, ы, э, ю, я',
        'Игнорировать регистр',
        'Проверить на нескольких строках, включая смешанный текст'
      ],
      expectedOutput: '"Hello, World!" -> 3 гласных\n"Привет, мир!" -> 4 гласных\n"Go language" -> 4 гласных\n"" -> 0 гласных\n"bcdfg" -> 0 гласных',
      hint: 'Создай map[rune]bool или строку всех гласных. strings.ContainsRune проверяет наличие символа в строке. Не забудь привести строку к нижнему регистру перед проверкой.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\nfunc CountVowels(s string) int {\n    const vowels = "aeiouаеёиоуыэюя"\n    count := 0\n    for _, r := range strings.ToLower(s) {\n        if strings.ContainsRune(vowels, r) {\n            count++\n        }\n    }\n    return count\n}\n\nfunc main() {\n    tests := []string{"Hello, World!", "Привет, мир!", "Go language", "", "bcdfg"}\n    for _, s := range tests {\n        fmt.Printf("%q -> %d гласных\\n", s, CountVowels(s))\n    }\n}',
      explanation: 'strings.ContainsRune эффективно проверяет наличие rune в строке. Константа vowels содержит все гласные в нижнем регистре, что вместе с ToLower делает проверку регистронезависимой. Перебор строки через range автоматически декодирует UTF-8 в rune.'
    },
    {
      id: 8,
      title: 'Сумма цифр числа',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй функцию, вычисляющую сумму цифр целого числа. Поддержи отрицательные числа и вычисление цифрового корня.',
      requirements: [
        'SumOfDigits(n int) int — сумма цифр (работает с отрицательными)',
        'DigitalRoot(n int) int — цифровой корень (повторяем до однозначного числа)',
        'Проверить: 12345, -678, 0, 9999, 999'
      ],
      expectedOutput: 'SumOfDigits(12345) = 15\nSumOfDigits(-678) = 21\nSumOfDigits(0) = 0\nDigitalRoot(12345) = 6\nDigitalRoot(9999) = 9\nDigitalRoot(999) = 9',
      hint: 'Для отрицательных: работай с абсолютным значением. Извлекай цифры через % 10 и делай n /= 10. DigitalRoot: повторяй SumOfDigits пока результат > 9.',
      solution: 'package main\n\nimport "fmt"\n\nfunc SumOfDigits(n int) int {\n    if n < 0 {\n        n = -n\n    }\n    sum := 0\n    for n > 0 {\n        sum += n % 10\n        n /= 10\n    }\n    return sum\n}\n\nfunc DigitalRoot(n int) int {\n    if n < 0 {\n        n = -n\n    }\n    for n >= 10 {\n        n = SumOfDigits(n)\n    }\n    return n\n}\n\nfunc main() {\n    fmt.Printf("SumOfDigits(12345) = %d\\n", SumOfDigits(12345))\n    fmt.Printf("SumOfDigits(-678) = %d\\n", SumOfDigits(-678))\n    fmt.Printf("SumOfDigits(0) = %d\\n", SumOfDigits(0))\n    fmt.Printf("DigitalRoot(12345) = %d\\n", DigitalRoot(12345))\n    fmt.Printf("DigitalRoot(9999) = %d\\n", DigitalRoot(9999))\n    fmt.Printf("DigitalRoot(999) = %d\\n", DigitalRoot(999))\n}',
      explanation: 'n % 10 даёт последнюю цифру, n /= 10 убирает её. Цикл продолжается пока n > 0. Для нуля цикл не выполняется и сумма равна 0. DigitalRoot — классическая задача: сумму цифр применяем рекурсивно до однозначного результата.'
    },
    {
      id: 9,
      title: 'Проверка степени двойки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши несколько способов проверки, является ли число степенью двойки. Включи битовую операцию и цикл деления.',
      requirements: [
        'IsPowerOfTwo(n int) bool — через битовую операцию n & (n-1) == 0',
        'IsPowerOfTwoLoop(n int) bool — через деление в цикле',
        'NextPowerOfTwo(n int) int — ближайшая степень двойки >= n',
        'Проверить: 0, 1, 2, 4, 6, 8, 16, 1024, 1023'
      ],
      expectedOutput: 'IsPowerOfTwo(0) = false\nIsPowerOfTwo(1) = true\nIsPowerOfTwo(4) = true\nIsPowerOfTwo(6) = false\nIsPowerOfTwo(1024) = true\nNextPowerOfTwo(6) = 8\nNextPowerOfTwo(8) = 8\nNextPowerOfTwo(1000) = 1024',
      hint: 'Битовый трюк: число N — степень двойки если N > 0 и N & (N-1) == 0. Объяснение: у степени двойки только один бит установлен. N-1 инвертирует все биты начиная с младшего установленного. AND даёт 0.',
      solution: 'package main\n\nimport "fmt"\n\nfunc IsPowerOfTwo(n int) bool {\n    return n > 0 && (n&(n-1)) == 0\n}\n\nfunc IsPowerOfTwoLoop(n int) bool {\n    if n <= 0 {\n        return false\n    }\n    for n > 1 {\n        if n%2 != 0 {\n            return false\n        }\n        n /= 2\n    }\n    return true\n}\n\nfunc NextPowerOfTwo(n int) int {\n    if n <= 1 {\n        return 1\n    }\n    p := 1\n    for p < n {\n        p <<= 1\n    }\n    return p\n}\n\nfunc main() {\n    for _, n := range []int{0, 1, 2, 4, 6, 8, 16, 1024, 1023} {\n        fmt.Printf("IsPowerOfTwo(%d) = %v\\n", n, IsPowerOfTwo(n))\n    }\n    for _, n := range []int{6, 8, 1000} {\n        fmt.Printf("NextPowerOfTwo(%d) = %d\\n", n, NextPowerOfTwo(n))\n    }\n}',
      explanation: 'Битовый трюк n & (n-1) == 0 работает потому что у степени двойки ровно один бит установлен. Например: 8 = 1000, 7 = 0111, 8&7 = 0. NextPowerOfTwo использует сдвиг влево p <<= 1 что эквивалентно умножению на 2, но быстрее.'
    },
    {
      id: 10,
      title: 'Простой калькулятор',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй калькулятор, поддерживающий основные операции, историю вычислений и обработку ошибок (деление на ноль).',
      requirements: [
        'Функция Calculate(a float64, op string, b float64) (float64, error)',
        'Поддержать операции: +, -, *, /, % (остаток), ^ (степень)',
        'Ошибки: деление на ноль, неизвестная операция',
        'Структура Calculator с историей операций History []string',
        'Метод Calc(a float64, op string, b float64) (float64, error) — обёртка с записью в историю',
        'Метод PrintHistory() — вывод истории вычислений'
      ],
      expectedOutput: '10 + 3 = 13.00\n10 - 3 = 7.00\n10 * 3 = 30.00\n10 / 3 = 3.33\n10 % 3 = 1.00\n2 ^ 10 = 1024.00\nОшибка: деление на ноль\nИстория: 6 операций',
      hint: 'Для оператора ^ используй math.Pow(a, b). Для % с float64: math.Mod(a, b). Запись в историю: fmt.Sprintf("%g %s %g = %g", a, op, b, result).',
      solution: 'package main\n\nimport (\n    "errors"\n    "fmt"\n    "math"\n)\n\nfunc Calculate(a float64, op string, b float64) (float64, error) {\n    switch op {\n    case "+":\n        return a + b, nil\n    case "-":\n        return a - b, nil\n    case "*":\n        return a * b, nil\n    case "/":\n        if b == 0 {\n            return 0, errors.New("деление на ноль")\n        }\n        return a / b, nil\n    case "%":\n        if b == 0 {\n            return 0, errors.New("деление на ноль")\n        }\n        return math.Mod(a, b), nil\n    case "^":\n        return math.Pow(a, b), nil\n    default:\n        return 0, fmt.Errorf("неизвестная операция: %q", op)\n    }\n}\n\ntype Calculator struct {\n    History []string\n}\n\nfunc (c *Calculator) Calc(a float64, op string, b float64) (float64, error) {\n    result, err := Calculate(a, op, b)\n    if err != nil {\n        c.History = append(c.History, fmt.Sprintf("%g %s %g = ERROR: %v", a, op, b, err))\n        return 0, err\n    }\n    c.History = append(c.History, fmt.Sprintf("%g %s %g = %g", a, op, b, result))\n    return result, nil\n}\n\nfunc (c *Calculator) PrintHistory() {\n    fmt.Printf("История: %d операций\\n", len(c.History))\n    for i, entry := range c.History {\n        fmt.Printf("  %d: %s\\n", i+1, entry)\n    }\n}\n\nfunc main() {\n    calc := &Calculator{}\n    ops := []struct{ a float64; op string; b float64 }{\n        {10, "+", 3},\n        {10, "-", 3},\n        {10, "*", 3},\n        {10, "/", 3},\n        {10, "%", 3},\n        {2, "^", 10},\n        {5, "/", 0},\n    }\n    for _, o := range ops {\n        result, err := calc.Calc(o.a, o.op, o.b)\n        if err != nil {\n            fmt.Printf("Ошибка: %v\\n", err)\n        } else {\n            fmt.Printf("%.0f %s %.0f = %.2f\\n", o.a, o.op, o.b, result)\n        }\n    }\n    fmt.Printf("История: %d операций\\n", len(calc.History))\n}',
      explanation: 'switch по строковому оператору — чистый Go-код. errors.New для известных ошибок (деление на ноль), fmt.Errorf для форматированных. Запись ошибок в историю позволяет отлаживать. math.Mod для float64 остатка, math.Pow для возведения в степень.'
    }
  ]
}
