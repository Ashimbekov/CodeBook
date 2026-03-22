export default {
  id: 15,
  title: 'Замыкания и анонимные функции',
  description: 'Замыкания — мощная концепция функционального программирования в Go. Анонимные функции захватывают переменные из окружающего контекста, создавая "замкнутое" пространство.',
  lessons: [
    {
      id: 1,
      title: 'Анонимные функции',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Функции без имени'
        },
        {
          type: 'text',
          value: 'Анонимная функция — это функция без имени, объявленная прямо в месте использования. Это как одноразовый инструмент: если гаечный ключ нужен только один раз, зачем хранить его в ящике?'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Анонимная функция, присвоенная переменной\n    greet := func(name string) string {\n        return "Привет, " + name + "!"\n    }\n    fmt.Println(greet("Go")) // Привет, Go!\n    \n    // Немедленный вызов (IIFE — Immediately Invoked Function Expression)\n    result := func(a, b int) int {\n        return a + b\n    }(3, 4) // () в конце — немедленный вызов\n    fmt.Println(result) // 7\n    \n    // Использование как аргумента\n    nums := []int{1, 2, 3, 4, 5}\n    doubled := mapSlice(nums, func(n int) int {\n        return n * 2\n    })\n    fmt.Println(doubled) // [2 4 6 8 10]\n}\n\nfunc mapSlice(nums []int, fn func(int) int) []int {\n    result := make([]int, len(nums))\n    for i, n := range nums {\n        result[i] = fn(n)\n    }\n    return result\n}'
        },
        {
          type: 'tip',
          value: 'IIFE (немедленно вызываемые функции) полезны для инициализации сложных значений или для создания изолированного блока кода с локальными переменными.'
        }
      ]
    },
    {
      id: 2,
      title: 'Что такое замыкание?',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Функция + переменные из контекста = замыкание'
        },
        {
          type: 'text',
          value: 'Замыкание — это функция, которая "захватывает" переменные из своего окружения. Аналогия: это рюкзак с вещами из дома. Вы выходите из дома (покидаете область видимости), но рюкзак (замыкание) несёт все нужные вещи (переменные) с собой.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    x := 10\n    \n    // Анонимная функция захватывает x из окружения\n    addX := func(n int) int {\n        return n + x // x — из внешней области видимости\n    }\n    \n    fmt.Println(addX(5))  // 15\n    \n    x = 20 // меняем x\n    fmt.Println(addX(5))  // 25 — замыкание видит ТЕКУЩЕЕ значение x!\n    \n    // Замыкание может ИЗМЕНЯТЬ захваченную переменную\n    counter := 0\n    increment := func() {\n        counter++ // изменяем counter из внешней области\n    }\n    \n    increment()\n    increment()\n    increment()\n    fmt.Println("Counter:", counter) // Counter: 3\n}'
        },
        {
          type: 'note',
          value: 'Замыкание захватывает ССЫЛКУ на переменную, а не её копию. Поэтому если переменная изменится после создания замыкания, замыкание увидит новое значение.'
        }
      ]
    },
    {
      id: 3,
      title: 'Замыкание в цикле — классическая ловушка',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Ловушка: замыкание и переменная цикла'
        },
        {
          type: 'text',
          value: 'Классическая ошибка: несколько замыканий в цикле захватывают одну переменную цикла по ссылке. К моменту вызова цикл уже завершён, и все замыкания "видят" финальное значение переменной.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // ЛОВУШКА: все замыкания захватывают одну переменную i\n    funcs := make([]func(), 5)\n    for i := 0; i < 5; i++ {\n        funcs[i] = func() {\n            fmt.Println(i) // все напечатают 5!\n        }\n    }\n    \n    // Вызываем после завершения цикла\n    for _, f := range funcs {\n        f()\n    }\n    // Вывод: 5 5 5 5 5 (не 0 1 2 3 4!)\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    funcs := make([]func(), 5)\n    \n    // РЕШЕНИЕ 1: Передать i как параметр (копирование)\n    for i := 0; i < 5; i++ {\n        i := i // создаём новую переменную в каждой итерации!\n        funcs[i] = func() {\n            fmt.Println(i)\n        }\n    }\n    for _, f := range funcs {\n        f()\n    }\n    // Вывод: 0 1 2 3 4\n    \n    fmt.Println("---")\n    \n    // РЕШЕНИЕ 2: Обернуть в функцию\n    funcs2 := make([]func(), 5)\n    for i := 0; i < 5; i++ {\n        funcs2[i] = func(n int) func() {\n            return func() { fmt.Println(n) }\n        }(i) // передаём i как аргумент\n    }\n    for _, f := range funcs2 {\n        f()\n    }\n}'
        },
        {
          type: 'warning',
          value: 'В Go 1.22+ поведение изменилось: переменная цикла for range создаётся заново в каждой итерации. Но для классического for i := 0; i < n; i++ ловушка сохраняется в старых версиях.'
        }
      ]
    },
    {
      id: 4,
      title: 'Генераторы функций',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Функции, возвращающие функции'
        },
        {
          type: 'text',
          value: 'Замыкания позволяют создавать "генераторы" — функции, которые возвращают другие функции с сохранённым состоянием. Это как фабрика: задаёте параметры (множитель, начальное значение) и получаете готовую к работе функцию.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Генератор счётчика\nfunc makeCounter() func() int {\n    count := 0\n    return func() int {\n        count++\n        return count\n    }\n}\n\n// Генератор прибавления\nfunc makeAdder(x int) func(int) int {\n    return func(y int) int {\n        return x + y\n    }\n}\n\nfunc main() {\n    // Два независимых счётчика\n    counter1 := makeCounter()\n    counter2 := makeCounter()\n    \n    fmt.Println(counter1()) // 1\n    fmt.Println(counter1()) // 2\n    fmt.Println(counter1()) // 3\n    fmt.Println(counter2()) // 1 (независимый!)\n    fmt.Println(counter2()) // 2\n    \n    add5 := makeAdder(5)\n    add10 := makeAdder(10)\n    \n    fmt.Println(add5(3))  // 8\n    fmt.Println(add10(3)) // 13\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Фибоначчи через замыкание\nfunc fibonacci() func() int {\n    a, b := 0, 1\n    return func() int {\n        result := a\n        a, b = b, a+b\n        return result\n    }\n}\n\nfunc main() {\n    fib := fibonacci()\n    for i := 0; i < 10; i++ {\n        fmt.Printf("%d ", fib())\n    }\n    fmt.Println() // 0 1 1 2 3 5 8 13 21 34\n}'
        }
      ]
    },
    {
      id: 5,
      title: 'Паттерн middleware',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Middleware через замыкания'
        },
        {
          type: 'text',
          value: 'Middleware — это функция-обёртка, которая добавляет поведение до/после основной функции. Замыкания делают это элегантным. Аналогия: это как слои луковицы — каждый слой добавляет поведение, но сердцевина остаётся неизменной.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\n// Тип обработчика (обработчик принимает строку и возвращает строку)\ntype Handler func(string) string\n\n// Middleware для логирования\nfunc withLogging(h Handler) Handler {\n    return func(input string) string {\n        fmt.Printf("[LOG] Вызов с: %q\\n", input)\n        result := h(input)\n        fmt.Printf("[LOG] Результат: %q\\n", result)\n        return result\n    }\n}\n\n// Middleware для измерения времени\nfunc withTiming(h Handler) Handler {\n    return func(input string) string {\n        start := time.Now()\n        result := h(input)\n        fmt.Printf("[TIME] Выполнение заняло: %v\\n", time.Since(start))\n        return result\n    }\n}\n\nfunc main() {\n    // Основная функция\n    process := func(s string) string {\n        return "Обработано: " + s\n    }\n    \n    // Оборачиваем в middleware\n    logged := withLogging(process)\n    timedAndLogged := withTiming(withLogging(process))\n    \n    logged("привет")\n    fmt.Println("---")\n    timedAndLogged("мир")\n}'
        },
        {
          type: 'note',
          value: 'Паттерн middleware широко используется в HTTP серверах Go. Функция net/http.HandlerFunc — это именно такой тип функции, а middleware-цепочки строятся именно через замыкания.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Мемоизация',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте функцию memoize(fn func(int) int) func(int) int, которая принимает функцию и возвращает её мемоизированную версию. Мемоизированная версия кэширует результаты вычислений.',
      requirements: [
        'Функция memoize принимает функцию int -> int',
        'Возвращает новую функцию с тем же сигнатуром',
        'При повторном вызове с тем же аргументом — возвращать кэшированный результат',
        'Продемонстрировать ускорение на примере рекурсивного Фибоначчи',
        'Использовать карту как кэш внутри замыкания'
      ],
      expectedOutput: 'fib(10) = 55\nfib(10) = 55 (из кэша)',
      hint: 'Внутри memoize создайте карту cache := make(map[int]int). Возвращаемое замыкание проверяет карту перед вычислением.',
      solution: 'package main\n\nimport "fmt"\n\nfunc memoize(fn func(int) int) func(int) int {\n    cache := make(map[int]int)\n    return func(n int) int {\n        if val, ok := cache[n]; ok {\n            fmt.Printf("Из кэша для %d\\n", n)\n            return val\n        }\n        result := fn(n)\n        cache[n] = result\n        return result\n    }\n}\n\nfunc main() {\n    // Медленный Фибоначчи\n    calls := 0\n    var fib func(int) int\n    fib = func(n int) int {\n        calls++\n        if n <= 1 {\n            return n\n        }\n        return fib(n-1) + fib(n-2)\n    }\n    \n    // Итеративный Фибоначчи для мемоизации\n    fibIter := func(n int) int {\n        if n <= 1 {\n            return n\n        }\n        a, b := 0, 1\n        for i := 2; i <= n; i++ {\n            a, b = b, a+b\n        }\n        return b\n    }\n    \n    memoFib := memoize(fibIter)\n    \n    fmt.Println("fib(10) =", memoFib(10)) // вычисляем\n    fmt.Println("fib(10) =", memoFib(10)) // из кэша\n    fmt.Println("fib(20) =", memoFib(20)) // вычисляем\n    fmt.Println("fib(20) =", memoFib(20)) // из кэша\n    \n    _ = calls\n}',
      explanation: 'Мемоизация — это оптимизация, при которой результаты дорогих вычислений кэшируются. Замыкание идеально подходит для этого: карта-кэш существует всё время жизни мемоизированной функции, но скрыта от внешнего кода. Это пример инкапсуляции через замыкания.'
    }
  ]
}
