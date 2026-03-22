export default {
  id: 9,
  title: 'Массивы',
  description: 'Массивы в Go — фиксированные по размеру, передаются по значению. Изучаем объявление, инициализацию, доступ к элементам, итерацию и сравнение массивов.',
  lessons: [
    {
      id: 1,
      title: 'Объявление массивов',
      content: [
        {
          type: 'heading',
          value: 'Что такое массив?'
        },
        {
          type: 'text',
          value: 'Массив — это коллекция элементов одного типа фиксированного размера. Размер массива — это часть его типа! [3]int и [5]int — это разные типы. Аналогия: массив — это как полка с ячейками в библиотеке. Полка создаётся с фиксированным числом ячеек, и это число нельзя изменить.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Объявление массива из 5 целых чисел\n    var numbers [5]int\n    fmt.Println(numbers) // [0 0 0 0 0] - нулевые значения!\n\n    // Объявление с инициализацией\n    var fruits [3]string\n    fruits[0] = "Яблоко"\n    fruits[1] = "Банан"\n    fruits[2] = "Вишня"\n    fmt.Println(fruits) // [Яблоко Банан Вишня]\n\n    // Длина массива\n    fmt.Println("Длина:", len(fruits)) // 3\n\n    // Разные типы массивов\n    var bytes [4]byte\n    var flags [3]bool\n    var prices [2]float64\n\n    fmt.Printf("bytes: %v\\n", bytes)   // [0 0 0 0]\n    fmt.Printf("flags: %v\\n", flags)   // [false false false]\n    fmt.Printf("prices: %v\\n", prices) // [0 0]\n}'
        },
        {
          type: 'warning',
          value: 'Размер массива в Go должен быть известен во время компиляции — это константа или числовой литерал. Нельзя создать массив с размером, определяемым в рантайме: var arr [n]int (где n — переменная) не скомпилируется. Для динамических коллекций используйте срезы (следующий модуль).'
        }
      ]
    },
    {
      id: 2,
      title: 'Инициализация массивов',
      content: [
        {
          type: 'heading',
          value: 'Способы инициализации'
        },
        {
          type: 'text',
          value: 'Go предоставляет несколько синтаксических форм для инициализации массивов. Выбирайте ту, что лучше читается в вашем контексте.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Литерал массива\n    primes := [5]int{2, 3, 5, 7, 11}\n    fmt.Println(primes) // [2 3 5 7 11]\n\n    // Автоматический размер с ...\n    colors := [...]string{"Красный", "Зелёный", "Синий"}\n    fmt.Println(colors)      // [Красный Зелёный Синий]\n    fmt.Println(len(colors)) // 3\n\n    // Частичная инициализация (остальные = нулевые)\n    sparse := [5]int{0: 10, 2: 30, 4: 50}\n    fmt.Println(sparse) // [10 0 30 0 50]\n\n    // Последний элемент по индексу\n    last := [5]int{4: 99}\n    fmt.Println(last) // [0 0 0 0 99]\n\n    // Двумерный массив (матрица)\n    matrix := [3][3]int{\n        {1, 2, 3},\n        {4, 5, 6},\n        {7, 8, 9},\n    }\n    fmt.Println(matrix)\n    // [[1 2 3] [4 5 6] [7 8 9]]\n}'
        },
        {
          type: 'tip',
          value: 'Синтаксис [...] для автоопределения размера — удобен при ручном задании значений. Компилятор сам посчитает количество элементов. Это удобно, когда вы добавляете или убираете элементы.'
        }
      ]
    },
    {
      id: 3,
      title: 'Доступ к элементам',
      content: [
        {
          type: 'heading',
          value: 'Индексирование массива'
        },
        {
          type: 'text',
          value: 'Доступ к элементам массива осуществляется по индексу в квадратных скобках. Индексы начинаются с 0. Go проверяет выход за границы массива во время выполнения — это безопасно.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    days := [7]string{\n        "Понедельник", "Вторник", "Среда",\n        "Четверг", "Пятница", "Суббота", "Воскресенье",\n    }\n\n    // Доступ по индексу\n    fmt.Println(days[0]) // Понедельник\n    fmt.Println(days[4]) // Пятница\n    fmt.Println(days[6]) // Воскресенье\n\n    // Последний элемент\n    last := days[len(days)-1]\n    fmt.Println("Последний:", last) // Воскресенье\n\n    // Изменение элемента\n    days[5] = "Сб"\n    fmt.Println(days[5]) // Сб\n\n    // Выход за границы - паника!\n    // fmt.Println(days[7]) // runtime panic: index out of range [7] with length 7\n}'
        },
        {
          type: 'heading',
          value: 'Работа с двумерными массивами'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Игровое поле крестики-нолики\n    var board [3][3]string\n\n    board[0][0] = "X"\n    board[1][1] = "O"\n    board[2][2] = "X"\n    board[0][2] = "O"\n\n    // Вывод доски\n    fmt.Println("Игровое поле:")\n    for i := 0; i < 3; i++ {\n        for j := 0; j < 3; j++ {\n            if board[i][j] == "" {\n                fmt.Print(". ")\n            } else {\n                fmt.Print(board[i][j], " ")\n            }\n        }\n        fmt.Println()\n    }\n    // X . O\n    // . O .\n    // . . X\n}'
        },
        {
          type: 'note',
          value: 'Если вы обращаетесь к элементу с индексом, выходящим за пределы массива, программа завершится с паникой (panic: runtime error: index out of range). Это лучше, чем тихое чтение случайной памяти, как в C.'
        }
      ]
    },
    {
      id: 4,
      title: 'Итерация по массиву',
      content: [
        {
          type: 'heading',
          value: 'Обход элементов'
        },
        {
          type: 'text',
          value: 'Для итерации по массиву в Go используется for с индексом или for range. Range-форма предпочтительнее в большинстве случаев — она безопаснее и читабельнее.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    temperatures := [7]float64{-5, 0, 3, 8, 12, 7, 2}\n    days := [7]string{"Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"}\n\n    // Метод 1: по индексу\n    fmt.Println("Температуры недели:")\n    for i := 0; i < len(temperatures); i++ {\n        fmt.Printf("  %s: %.1f°C\\n", days[i], temperatures[i])\n    }\n\n    // Метод 2: for range (предпочтительно)\n    fmt.Println("\\nАнализ:")\n    sum := 0.0\n    min, max := temperatures[0], temperatures[0]\n\n    for i, temp := range temperatures {\n        sum += temp\n        if temp < min {\n            min = temp\n        }\n        if temp > max {\n            max = temp\n        }\n        _ = i // используем i чтобы не было ошибки\n    }\n\n    avg := sum / float64(len(temperatures))\n    fmt.Printf("  Среднее: %.1f°C\\n", avg)\n    fmt.Printf("  Минимум: %.1f°C\\n", min)\n    fmt.Printf("  Максимум: %.1f°C\\n", max)\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Итерация по двумерному массиву\n    matrix := [3][4]int{\n        {1, 2, 3, 4},\n        {5, 6, 7, 8},\n        {9, 10, 11, 12},\n    }\n\n    fmt.Println("Матрица:")\n    for _, row := range matrix {\n        for j, val := range row {\n            if j > 0 {\n                fmt.Print(" ")\n            }\n            fmt.Printf("%2d", val)\n        }\n        fmt.Println()\n    }\n\n    // Сумма всех элементов\n    total := 0\n    for _, row := range matrix {\n        for _, val := range row {\n            total += val\n        }\n    }\n    fmt.Println("Сумма всех элементов:", total) // 78\n}'
        }
      ]
    },
    {
      id: 5,
      title: 'Сравнение массивов',
      content: [
        {
          type: 'heading',
          value: 'Массивы можно сравнивать!'
        },
        {
          type: 'text',
          value: 'В Go массивы одного типа и размера можно сравнивать оператором ==. Это отличие от многих других языков (в Python и Java нельзя сравнить массивы через ==, нужен специальный метод).'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    a := [3]int{1, 2, 3}\n    b := [3]int{1, 2, 3}\n    c := [3]int{1, 2, 4}\n\n    fmt.Println(a == b)  // true - все элементы совпадают\n    fmt.Println(a == c)  // false - последний элемент разный\n    fmt.Println(a != c)  // true\n\n    // Нельзя сравнивать массивы разного размера!\n    // d := [4]int{1, 2, 3, 4}\n    // fmt.Println(a == d)  // ОШИБКА компиляции!\n\n    // Полезно для проверки результатов\n    expected := [3]int{10, 20, 30}\n    result := [3]int{10, 20, 30}\n    if result == expected {\n        fmt.Println("Тест пройден!")\n    } else {\n        fmt.Println("Тест провален!")\n    }\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Поворот массива на 90 градусов\nfunc rotate90(m [3][3]int) [3][3]int {\n    var result [3][3]int\n    for i := 0; i < 3; i++ {\n        for j := 0; j < 3; j++ {\n            result[j][2-i] = m[i][j]\n        }\n    }\n    return result\n}\n\nfunc printMatrix(m [3][3]int) {\n    for _, row := range m {\n        fmt.Println(row)\n    }\n}\n\nfunc main() {\n    original := [3][3]int{\n        {1, 2, 3},\n        {4, 5, 6},\n        {7, 8, 9},\n    }\n\n    rotated := rotate90(original)\n\n    fmt.Println("Оригинал:")\n    printMatrix(original)\n    fmt.Println("\\nПовёрнуто на 90°:")\n    printMatrix(rotated)\n}'
        },
        {
          type: 'note',
          value: 'Сравнение массивов работает потому, что массивы — это типы-значения. При сравнении Go сравнивает каждый элемент по очереди. Это требует, чтобы тип элементов тоже был сравниваемым.'
        }
      ]
    },
    {
      id: 6,
      title: 'Массивы как типы-значения',
      content: [
        {
          type: 'heading',
          value: 'Копирование при присваивании'
        },
        {
          type: 'text',
          value: 'Массивы в Go — это типы-значения (value types). При присваивании или передаче в функцию создаётся КОПИЯ массива. Изменения копии не влияют на оригинал. Это отличие от многих языков, где массивы передаются по ссылке.'
        },
        {
          type: 'text',
          value: 'Аналогия: Массив в Go — как распечатанный документ. Если вы дали кому-то копию и он её исправил — ваш оригинал не изменился.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    original := [3]int{1, 2, 3}\n    copy := original // создаётся полная копия!\n\n    copy[0] = 999 // изменяем копию\n\n    fmt.Println("Оригинал:", original) // [1 2 3] - не изменился!\n    fmt.Println("Копия:", copy)        // [999 2 3]\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Функция получает КОПИЮ массива\nfunc doubleAll(arr [5]int) [5]int {\n    for i := range arr {\n        arr[i] *= 2 // изменяем копию\n    }\n    return arr // возвращаем изменённую копию\n}\n\n// Чтобы изменить оригинал - нужен указатель\nfunc tripleAll(arr *[5]int) {\n    for i := range arr {\n        arr[i] *= 3 // изменяем оригинал через указатель\n    }\n}\n\nfunc main() {\n    numbers := [5]int{1, 2, 3, 4, 5}\n\n    doubled := doubleAll(numbers)\n    fmt.Println("Оригинал:", numbers)  // [1 2 3 4 5] - не изменился\n    fmt.Println("Удвоенный:", doubled) // [2 4 6 8 10]\n\n    tripleAll(&numbers) // передаём указатель\n    fmt.Println("Утроенный:", numbers) // [3 6 9 12 15]\n}'
        },
        {
          type: 'warning',
          value: 'Копирование больших массивов при каждом вызове функции неэффективно! Если массив большой (тысячи элементов), передавайте указатель или лучше используйте срезы (slices). Срезы всегда передаются по ссылке.'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Статистика оценок',
      type: 'practice',
      difficulty: 'beginner',
      description: 'Напишите программу для анализа оценок студентов. Используйте массив для хранения оценок и вычислите статистику.',
      requirements: [
        'Создайте массив из 10 оценок: [8, 5, 9, 7, 6, 10, 4, 8, 7, 9]',
        'Напишите функцию average(grades [10]int) float64 — среднее значение',
        'Напишите функцию findMinMax(grades [10]int) (int, int) — минимум и максимум',
        'Напишите функцию countAbove(grades [10]int, threshold int) int — количество оценок выше порога',
        'Выведите все статистические показатели'
      ],
      expectedOutput: 'Оценки: [8 5 9 7 6 10 4 8 7 9]\nСредняя оценка: 7.30\nМинимум: 4, Максимум: 10\nОценок выше 7: 5',
      hint: 'Для среднего: сложите все элементы и разделите на float64(len(grades)). Для минмакс: начните с первого элемента и обходите остальные. Для подсчёта выше порога: считайте элементы больше threshold.',
      solution: 'package main\n\nimport "fmt"\n\nfunc average(grades [10]int) float64 {\n    sum := 0\n    for _, g := range grades {\n        sum += g\n    }\n    return float64(sum) / float64(len(grades))\n}\n\nfunc findMinMax(grades [10]int) (int, int) {\n    min, max := grades[0], grades[0]\n    for _, g := range grades[1:] {\n        if g < min {\n            min = g\n        }\n        if g > max {\n            max = g\n        }\n    }\n    return min, max\n}\n\nfunc countAbove(grades [10]int, threshold int) int {\n    count := 0\n    for _, g := range grades {\n        if g > threshold {\n            count++\n        }\n    }\n    return count\n}\n\nfunc main() {\n    grades := [10]int{8, 5, 9, 7, 6, 10, 4, 8, 7, 9}\n\n    fmt.Println("Оценки:", grades)\n    fmt.Printf("Средняя оценка: %.2f\\n", average(grades))\n\n    min, max := findMinMax(grades)\n    fmt.Printf("Минимум: %d, Максимум: %d\\n", min, max)\n\n    fmt.Printf("Оценок выше 7: %d\\n", countAbove(grades, 7))\n}',
      explanation: 'Программа демонстрирует передачу массивов в функции по значению. Каждая функция получает копию массива — безопасно и предсказуемо. Функция findMinMax возвращает два значения через множественный возврат. Выражение grades[1:] создаёт срез с элементами от индекса 1 до конца — это "среза массива" (подробнее в следующем модуле).'
    }
  ]
}
