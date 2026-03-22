export default {
  id: 3,
  title: 'Операторы и выражения',
  description: 'Арифметические, сравнения, логические операторы и побитовые операции в Kotlin',
  lessons: [
    {
      id: 1,
      title: 'Арифметические операторы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Арифметические операторы позволяют выполнять математические вычисления. В Kotlin они такие же, как в большинстве языков программирования.' },
        { type: 'code', language: 'kotlin', value: 'val a = 10\nval b = 3\n\nprintln(a + b)   // 13 — сложение\nprintln(a - b)   // 7  — вычитание\nprintln(a * b)   // 30 — умножение\nprintln(a / b)   // 3  — деление (целочисленное!)\nprintln(a % b)   // 1  — остаток от деления' },
        { type: 'warning', value: 'Деление Int на Int даёт Int — дробная часть отбрасывается! 10 / 3 = 3, а не 3.333. Чтобы получить дробный результат, хотя бы одно число должно быть Double: 10.0 / 3 = 3.333.' },
        { type: 'heading', value: 'Операторы присваивания' },
        { type: 'code', language: 'kotlin', value: 'var x = 10\nx += 5    // x = x + 5  => 15\nx -= 3    // x = x - 3  => 12\nx *= 2    // x = x * 2  => 24\nx /= 4    // x = x / 4  => 6\nx %= 4    // x = x % 4  => 2\nprintln(x)  // 2' },
        { type: 'tip', value: 'Операторы +=, -=, *=, /= — это сокращения. x += 5 — это то же самое, что x = x + 5. Короче писать, легче читать.' }
      ]
    },
    {
      id: 2,
      title: 'Операторы сравнения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Операторы сравнения сравнивают два значения и возвращают Boolean (true или false). Они используются в условиях и циклах.' },
        { type: 'code', language: 'kotlin', value: 'val a = 10\nval b = 20\n\nprintln(a == b)   // false — равно\nprintln(a != b)   // true  — не равно\nprintln(a > b)    // false — больше\nprintln(a < b)    // true  — меньше\nprintln(a >= b)   // false — больше или равно\nprintln(a <= b)   // true  — меньше или равно' },
        { type: 'heading', value: 'Сравнение строк' },
        { type: 'code', language: 'kotlin', value: 'val str1 = "Kotlin"\nval str2 = "Kotlin"\nval str3 = "Java"\n\nprintln(str1 == str2)    // true  — содержимое одинаковое\nprintln(str1 == str3)    // false\nprintln(str1 === str2)   // true  — один и тот же объект (обычно true для строк-литералов)' },
        { type: 'note', value: 'В Kotlin == сравнивает содержимое (как equals() в Java). === сравнивает ссылки — один ли это объект в памяти. Для строк обычно используй ==.' },
        { type: 'tip', value: 'Представь сравнение строк: две коробки с надписью "Kotlin". == спрашивает "написано ли одинаково?". === спрашивает "это одна и та же коробка?".' }
      ]
    },
    {
      id: 3,
      title: 'Логические операторы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Логические операторы позволяют комбинировать несколько условий. Они работают с Boolean значениями.' },
        { type: 'code', language: 'kotlin', value: 'val isAdult = true\nval hasTicket = true\nval isBanned = false\n\n// && (И) — оба должны быть true\nprintln(isAdult && hasTicket)    // true — взрослый И есть билет\nprintln(isAdult && isBanned)     // false — взрослый, НО забанен\n\n// || (ИЛИ) — хотя бы одно должно быть true\nprintln(isAdult || hasTicket)    // true\nprintln(isBanned || !hasTicket)  // false\n\n// ! (НЕ) — инвертирует значение\nprintln(!isAdult)    // false\nprintln(!isBanned)   // true' },
        { type: 'tip', value: 'Логика как в жизни: && (И) — нужно чтобы всё сошлось (взрослый И есть деньги). || (ИЛИ) — достаточно одного (наличные ИЛИ карта). ! (НЕ) — противоположное (не занят = свободен).' },
        { type: 'heading', value: 'Ленивые вычисления (Short-circuit)' },
        { type: 'code', language: 'kotlin', value: '// При && если первое false — второе не проверяется\n// При || если первое true — второе не проверяется\nval result = false && expensiveCalculation()  // expensiveCalculation() не вызовется!\nval result2 = true || expensiveCalculation()  // тоже не вызовется' },
        { type: 'note', value: 'Это не просто оптимизация — это защита от ошибок. Например: if (list != null && list.size > 0) — если list == null, второе условие не проверяется и не падает с ошибкой.' }
      ]
    },
    {
      id: 4,
      title: 'Инкремент, декремент и операции над строками',
      type: 'theory',
      content: [
        { type: 'text', value: 'Инкремент (++) и декремент (--) — удобные операторы для увеличения и уменьшения числа на 1. Часто используются в циклах.' },
        { type: 'code', language: 'kotlin', value: 'var counter = 0\ncounter++   // counter = counter + 1 => 1\ncounter++   // => 2\ncounter--   // => 1\nprintln(counter)  // 1' },
        { type: 'heading', value: 'Префиксный vs постфиксный' },
        { type: 'code', language: 'kotlin', value: 'var a = 5\nval b = a++   // b = 5, потом a становится 6\nprintln("a=$a, b=$b")  // a=6, b=5\n\nvar c = 5\nval d = ++c   // c становится 6, потом d = 6\nprintln("c=$c, d=$d")  // c=6, d=6' },
        { type: 'heading', value: 'Конкатенация строк' },
        { type: 'code', language: 'kotlin', value: 'val hello = "Привет"\nval name = "Kotlin"\nval message = hello + ", " + name + "!"\nprintln(message)  // Привет, Kotlin!\n\nvar log = ""\nlog += "Запуск "\nlog += "приложения"\nprintln(log)  // Запуск приложения' },
        { type: 'tip', value: 'Конкатенация строк через + удобна, но для сложного форматирования лучше использовать строковые шаблоны ($переменная). Об этом в модуле про строки.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Калькулятор',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши программу, которая вычисляет основные арифметические операции над двумя числами.',
      requirements: [
        'Объяви два числа: a = 17, b = 5',
        'Выведи результат сложения',
        'Выведи результат вычитания',
        'Выведи результат умножения',
        'Выведи результат деления (с дробью)',
        'Выведи остаток от деления'
      ],
      expectedOutput: '17 + 5 = 22\n17 - 5 = 12\n17 * 5 = 85\n17 / 5 = 3.4\n17 % 5 = 2',
      hint: 'Для дробного деления преобразуй одно из чисел в Double через .toDouble(). Используй конкатенацию строк для формирования вывода.',
      solution: 'fun main() {\n    val a = 17\n    val b = 5\n    println("$a + $b = " + (a + b))\n    println("$a - $b = " + (a - b))\n    println("$a * $b = " + (a * b))\n    println("$a / $b = " + (a.toDouble() / b))\n    println("$a % $b = " + (a % b))\n}',
      explanation: 'Для дробного деления нужен Double. a.toDouble() / b даёт 3.4. Остаток % возвращает 2 (17 = 5*3 + 2). Строковые шаблоны $a, $b подставляют значения переменных прямо в строку.'
    },
    {
      id: 6,
      title: 'Практика: Проверка условий',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая проверяет несколько условий и выводит результаты сравнений.',
      requirements: [
        'Объяви age = 20, minAge = 18, maxAge = 65',
        'Проверь: age >= minAge (можно голосовать)',
        'Проверь: age >= minAge && age <= maxAge (рабочий возраст)',
        'Проверь: age < minAge || age > maxAge (не рабочий возраст)',
        'Выведи все три результата'
      ],
      expectedOutput: 'Может голосовать: true\nРабочий возраст: true\nНе рабочий возраст: false',
      hint: 'Результат сравнения — это Boolean (true/false). Можно сохранить в val и вывести через println.',
      solution: 'fun main() {\n    val age = 20\n    val minAge = 18\n    val maxAge = 65\n    val canVote = age >= minAge\n    val isWorkingAge = age >= minAge && age <= maxAge\n    val notWorkingAge = age < minAge || age > maxAge\n    println("Может голосовать: " + canVote)\n    println("Рабочий возраст: " + isWorkingAge)\n    println("Не рабочий возраст: " + notWorkingAge)\n}',
      explanation: 'Логические операторы && и || комбинируют условия. 20 >= 18 && 20 <= 65 — оба true, результат true. 20 < 18 || 20 > 65 — оба false, результат false.'
    }
  ]
}
