export default {
  id: 5,
  title: 'Операторы',
  description: 'Арифметические, сравнения, логические, присваивания и битовые операторы в Go. Приоритет операторов и практические примеры.',
  lessons: [
    {
      id: 1,
      title: 'Арифметические операторы',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Основные арифметические операторы'
        },
        {
          type: 'text',
          value: 'Арифметические операторы в Go работают привычным образом. Важно помнить: операции применяются к значениям одного типа — Go не делает неявных преобразований.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    a := 10\n    b := 3\n\n    fmt.Println(a + b)  // 13 - сложение\n    fmt.Println(a - b)  // 7  - вычитание\n    fmt.Println(a * b)  // 30 - умножение\n    fmt.Println(a / b)  // 3  - деление (целочисленное!)\n    fmt.Println(a % b)  // 1  - остаток от деления\n\n    // Для дробного деления нужен float64\n    fa := float64(a)\n    fb := float64(b)\n    fmt.Printf("%.4f\\n", fa/fb) // 3.3333\n\n    // Унарные операторы\n    x := 5\n    fmt.Println(-x)  // -5 (отрицание)\n    fmt.Println(+x)  //  5 (унарный плюс, редко используется)\n}'
        },
        {
          type: 'heading',
          value: 'Инкремент и декремент'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    counter := 0\n    counter++  // увеличить на 1\n    counter++\n    fmt.Println(counter) // 2\n\n    counter--  // уменьшить на 1\n    fmt.Println(counter) // 1\n\n    // ВАЖНО: в Go ++ и -- это операторы-выражения, не возвращают значение!\n    // Нельзя: x := counter++  (это ошибка в Go!)\n    // Нельзя: if counter++ > 0 (тоже ошибка)\n    // Только: counter++ как отдельная инструкция\n\n    // Типичное использование в цикле\n    for i := 0; i < 3; i++ {\n        fmt.Println(i) // 0, 1, 2\n    }\n}'
        },
        {
          type: 'warning',
          value: 'В Go нет преинкремента (++x) и нет декремента/инкремента как выражения. Только постфиксные операторы x++ и x-- как самостоятельные инструкции. Это сделано намеренно для избежания запутанного кода.'
        }
      ]
    },
    {
      id: 2,
      title: 'Операторы сравнения',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Сравнение значений'
        },
        {
          type: 'text',
          value: 'Операторы сравнения возвращают булево значение (true или false). Они используются в условиях if, for и других конструкциях. Как и арифметические операторы, операторы сравнения работают с одинаковыми типами.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    a, b := 10, 20\n\n    fmt.Println(a == b)  // false - равно\n    fmt.Println(a != b)  // true  - не равно\n    fmt.Println(a < b)   // true  - меньше\n    fmt.Println(a > b)   // false - больше\n    fmt.Println(a <= b)  // true  - меньше или равно\n    fmt.Println(a >= b)  // false - больше или равно\n\n    // Сравнение строк\n    s1 := "apple"\n    s2 := "banana"\n    fmt.Println(s1 == s2)  // false\n    fmt.Println(s1 < s2)   // true (лексикографически)\n\n    // Сравнение булевых значений\n    x := true\n    y := false\n    fmt.Println(x == y)  // false\n    fmt.Println(x != y)  // true\n}'
        },
        {
          type: 'heading',
          value: 'Нельзя сравнивать разные типы'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    var i int = 42\n    var f float64 = 42.0\n\n    // Нельзя напрямую сравнивать int и float64\n    // fmt.Println(i == f)  // ОШИБКА!\n\n    // Нужно привести типы\n    fmt.Println(float64(i) == f)  // true\n    fmt.Println(i == int(f))      // true\n\n    // Сравнение с nil\n    var s *string = nil\n    fmt.Println(s == nil) // true\n}'
        },
        {
          type: 'note',
          value: 'Строки в Go сравниваются лексикографически (как в словаре). "apple" < "banana" потому что "a" < "b". Это работает корректно для ASCII, но будьте осторожны с Unicode-строками.'
        }
      ]
    },
    {
      id: 3,
      title: 'Логические операторы',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'AND, OR, NOT'
        },
        {
          type: 'text',
          value: 'Логические операторы работают с булевыми значениями и используются для составления сложных условий. Аналогия: && (И) — оба условия должны быть правдой; || (ИЛИ) — хотя бы одно должно быть правдой; ! (НЕ) — переворачивает значение.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    age := 25\n    hasLicense := true\n    hasInsurance := true\n\n    // && (И) - оба должны быть true\n    canDrive := hasLicense && hasInsurance\n    fmt.Println("Может ездить:", canDrive) // true\n\n    // || (ИЛИ) - хотя бы одно true\n    isAdult := age >= 18\n    isStudent := false\n    canGetDiscount := isAdult || isStudent\n    fmt.Println("Скидка:", canGetDiscount) // true\n\n    // ! (НЕ) - инверсия\n    isBusy := false\n    fmt.Println("Свободен:", !isBusy) // true\n\n    // Комбинирование\n    score := 75\n    passed := score >= 60 && score <= 100\n    fmt.Println("Зачёт:", passed) // true\n}'
        },
        {
          type: 'heading',
          value: 'Короткое замыкание (Short-circuit evaluation)'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc isPositive(n int) bool {\n    fmt.Printf("Проверяем %d...\\n", n)\n    return n > 0\n}\n\nfunc main() {\n    // && останавливается, если первое false\n    // Второй вызов не происходит!\n    result := isPositive(-1) && isPositive(5)\n    fmt.Println("Результат:", result)\n    // Выведет:\n    // Проверяем -1...\n    // Результат: false  (isPositive(5) не вызывается!)\n\n    fmt.Println("---")\n\n    // || останавливается, если первое true\n    result2 := isPositive(1) || isPositive(-5)\n    fmt.Println("Результат:", result2)\n    // Выведет:\n    // Проверяем 1...\n    // Результат: true  (isPositive(-5) не вызывается!)\n}'
        },
        {
          type: 'tip',
          value: 'Используйте короткое замыкание в свою пользу! Ставьте более дешёвую проверку первой. Например: if ptr != nil && ptr.value > 0 — сначала проверяем на nil (дёшево), потом обращаемся к значению (только если ptr не nil).'
        }
      ]
    },
    {
      id: 4,
      title: 'Операторы присваивания',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Составные операторы присваивания'
        },
        {
          type: 'text',
          value: 'Go поддерживает составные операторы присваивания, которые совмещают арифметическую операцию с присваиванием. Они делают код короче и читаемее.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    x := 10\n\n    x += 5   // x = x + 5  ->  15\n    fmt.Println(x) // 15\n\n    x -= 3   // x = x - 3  ->  12\n    fmt.Println(x) // 12\n\n    x *= 2   // x = x * 2  ->  24\n    fmt.Println(x) // 24\n\n    x /= 4   // x = x / 4  ->  6\n    fmt.Println(x) // 6\n\n    x %= 4   // x = x % 4  ->  2\n    fmt.Println(x) // 2\n\n    // Составные операторы для строк\n    greeting := "Привет"\n    greeting += ", мир!"  // конкатенация\n    fmt.Println(greeting) // Привет, мир!\n}'
        },
        {
          type: 'heading',
          value: 'Множественное присваивание'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc minMax(a, b int) (int, int) {\n    if a < b {\n        return a, b\n    }\n    return b, a\n}\n\nfunc main() {\n    // Множественное присваивание\n    a, b := 5, 10\n    fmt.Println(a, b) // 5 10\n\n    // Обмен переменных без временной\n    a, b = b, a\n    fmt.Println(a, b) // 10 5\n\n    // Получение нескольких значений из функции\n    min, max := minMax(7, 3)\n    fmt.Println(min, max) // 3 7\n\n    // Игнорирование возвращаемого значения с _\n    _, max2 := minMax(15, 8)\n    fmt.Println(max2) // 15\n}'
        },
        {
          type: 'note',
          value: 'Множественное присваивание a, b = b, a — это идиоматичный способ обмена значений в Go. Временная переменная не нужна! Правая часть вычисляется полностью до присваивания.'
        }
      ]
    },
    {
      id: 5,
      title: 'Битовые операторы',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Работа с битами'
        },
        {
          type: 'text',
          value: 'Битовые операторы работают с числами на уровне отдельных битов. Это мощный инструмент для оптимизации, работы с флагами и низкоуровневого программирования.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    a := 0b1010  // 10 в десятичной\n    b := 0b1100  // 12 в десятичной\n\n    // & - побитовое И\n    fmt.Printf("%b & %b = %b (%d)\\n", a, b, a&b, a&b)   // 1000 (8)\n\n    // | - побитовое ИЛИ\n    fmt.Printf("%b | %b = %b (%d)\\n", a, b, a|b, a|b)   // 1110 (14)\n\n    // ^ - побитовое исключающее ИЛИ (XOR)\n    fmt.Printf("%b ^ %b = %b (%d)\\n", a, b, a^b, a^b)   // 0110 (6)\n\n    // ^ - побитовое НЕ (унарный)\n    fmt.Printf("^%d = %d\\n", a, ^a)  // -11\n\n    // &^ - побитовое AND NOT (очистка бита)\n    fmt.Printf("%b &^ %b = %b (%d)\\n", a, b, a&^b, a&^b) // 0010 (2)\n}'
        },
        {
          type: 'heading',
          value: 'Операторы сдвига'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    x := 1\n\n    // << - сдвиг влево (умножение на степень 2)\n    fmt.Println(x << 1) // 2  (1 * 2^1)\n    fmt.Println(x << 2) // 4  (1 * 2^2)\n    fmt.Println(x << 3) // 8  (1 * 2^3)\n    fmt.Println(x << 4) // 16 (1 * 2^4)\n\n    // >> - сдвиг вправо (деление на степень 2)\n    y := 16\n    fmt.Println(y >> 1) // 8\n    fmt.Println(y >> 2) // 4\n    fmt.Println(y >> 3) // 2\n    fmt.Println(y >> 4) // 1\n\n    // Практическое применение: проверка чётности\n    for n := 0; n <= 5; n++ {\n        if n&1 == 0 {\n            fmt.Printf("%d - чётное\\n", n)\n        } else {\n            fmt.Printf("%d - нечётное\\n", n)\n        }\n    }\n}'
        },
        {
          type: 'tip',
          value: 'Сдвиг влево на N позиций равен умножению на 2^N, а сдвиг вправо — делению на 2^N. Эти операции быстрее умножения и деления на большинстве процессоров.'
        }
      ]
    },
    {
      id: 6,
      title: 'Приоритет операторов',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Порядок выполнения операций'
        },
        {
          type: 'text',
          value: 'Когда в выражении несколько операторов, они выполняются в порядке приоритета. Операторы с высшим приоритетом выполняются первыми. Это как в математике: умножение раньше сложения.'
        },
        {
          type: 'list',
          value: 'Приоритет 5 (высший): * / % << >> & &^\nПриоритет 4: + - | ^\nПриоритет 3: == != < <= > >=\nПриоритет 2: &&\nПриоритет 1 (низший): ||'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Умножение раньше сложения\n    fmt.Println(2 + 3*4)   // 14, не 20\n    fmt.Println((2+3) * 4) // 20\n\n    // Сравнение раньше &&\n    a, b, c := 5, 10, 15\n    result := a < b && b < c  // (a < b) && (b < c)\n    fmt.Println(result) // true\n\n    // && раньше ||\n    x := true\n    y := false\n    z := true\n    // x || y && z = x || (y && z) = true || false = true\n    fmt.Println(x || y && z) // true\n    // (x || y) && z = true && true = true\n    fmt.Println((x || y) && z) // true тоже, но по-другому\n\n    // Пример, где порядок важен\n    p := false\n    q := false\n    r := true\n    fmt.Println(p || q && r)   // false || (false && true) = false || false = false\n    fmt.Println((p || q) && r) // (false || false) && true = false && true = false\n    // В этом случае одинаково, но не всегда!\n}'
        },
        {
          type: 'tip',
          value: 'Совет: не запоминайте приоритеты наизусть. Используйте круглые скобки для явного указания порядка. Это делает код понятнее для читателей.'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Финансовые вычисления',
      type: 'practice',
      difficulty: 'beginner',
      description: 'Напишите программу для расчёта стоимости покупки со скидкой и налогом. Используйте арифметические операторы и операторы присваивания.',
      requirements: [
        'Задайте начальную цену товара: price = 1000.0',
        'Задайте скидку в процентах: discount = 15.0',
        'Вычислите сумму скидки и итоговую цену после скидки',
        'Задайте налог НДС: vat = 20.0 процентов',
        'Вычислите налог от цены после скидки и итоговую цену с налогом',
        'Выведите все промежуточные значения с двумя знаками после запятой'
      ],
      expectedOutput: 'Начальная цена: 1000.00 руб.\nСкидка (15%): 150.00 руб.\nЦена со скидкой: 850.00 руб.\nНДС (20%): 170.00 руб.\nИтого с налогом: 1020.00 руб.',
      hint: 'Скидка = price * discount / 100. Цена после скидки = price - скидка. НДС = цена_со_скидкой * vat / 100. Итого = цена_со_скидкой + НДС.',
      solution: 'package main\n\nimport "fmt"\n\nfunc main() {\n    price := 1000.0\n    discount := 15.0\n    vat := 20.0\n\n    discountAmount := price * discount / 100\n    priceAfterDiscount := price - discountAmount\n\n    vatAmount := priceAfterDiscount * vat / 100\n    finalPrice := priceAfterDiscount + vatAmount\n\n    fmt.Printf("Начальная цена: %.2f руб.\\n", price)\n    fmt.Printf("Скидка (%.0f%%): %.2f руб.\\n", discount, discountAmount)\n    fmt.Printf("Цена со скидкой: %.2f руб.\\n", priceAfterDiscount)\n    fmt.Printf("НДС (%.0f%%): %.2f руб.\\n", vat, vatAmount)\n    fmt.Printf("Итого с налогом: %.2f руб.\\n", finalPrice)\n}',
      explanation: 'Программа выполняет последовательные вычисления, сохраняя промежуточные результаты в переменные. Спецификатор %.0f выводит число без знаков после запятой (для процентов). Двойной %% в строке формата выводит символ %. Важно сохранять промежуточные результаты — это делает код понятным и упрощает отладку.'
    }
  ]
}
