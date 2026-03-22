export default {
  id: 5,
  title: 'Циклы',
  description: 'for, while, do-while, диапазоны (ranges) и управление потоком: break и continue',
  lessons: [
    {
      id: 1,
      title: 'for цикл и диапазоны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Цикл for в Kotlin работает с любым итерируемым объектом — диапазонами, списками, строками. Он гораздо мощнее и гибче, чем классический for в Java.' },
        { type: 'code', language: 'kotlin', value: '// Диапазон от 1 до 5 включительно\nfor (i in 1..5) {\n    println(i)  // 1, 2, 3, 4, 5\n}\n\n// Диапазон до 5 не включая (until)\nfor (i in 1 until 5) {\n    println(i)  // 1, 2, 3, 4\n}' },
        { type: 'tip', value: 'Диапазон 1..5 — как отрезок на числовой прямой от 1 до 5 включительно. 1 until 5 — как полуоткрытый отрезок: 1 включён, 5 нет. Запомни: .. включает правый конец, until не включает.' },
        { type: 'heading', value: 'Шаг (step) и обратный порядок' },
        { type: 'code', language: 'kotlin', value: '// Шаг 2 — каждое второе число\nfor (i in 0..10 step 2) {\n    print("$i ")   // 0 2 4 6 8 10\n}\n\n// Обратный порядок\nfor (i in 5 downTo 1) {\n    print("$i ")   // 5 4 3 2 1\n}\n\n// Обратный с шагом\nfor (i in 10 downTo 0 step 3) {\n    print("$i ")   // 10 7 4 1\n}' },
        { type: 'note', value: 'downTo — идём в обратном направлении. step — задаём шаг. Можно комбинировать: 10 downTo 0 step 2 пойдёт 10, 8, 6, 4, 2, 0.' }
      ]
    },
    {
      id: 2,
      title: 'for по коллекции и строке',
      type: 'theory',
      content: [
        { type: 'text', value: 'for в Kotlin может перебирать не только числа, но и элементы любой коллекции, символы строки, а также пары индекс-значение.' },
        { type: 'code', language: 'kotlin', value: '// Перебор элементов списка\nval fruits = listOf("яблоко", "банан", "вишня")\nfor (fruit in fruits) {\n    println(fruit)\n}' },
        { type: 'heading', value: 'Перебор с индексом' },
        { type: 'code', language: 'kotlin', value: '// withIndex() даёт пары (индекс, значение)\nfor ((index, fruit) in fruits.withIndex()) {\n    println("$index: $fruit")\n}\n// 0: яблоко\n// 1: банан\n// 2: вишня' },
        { type: 'heading', value: 'Перебор символов строки' },
        { type: 'code', language: 'kotlin', value: 'val word = "Kotlin"\nfor (char in word) {\n    print("$char-")  // K-o-t-l-i-n-\n}' },
        { type: 'tip', value: 'for (item in collection) — читается почти как по-русски: "для каждого элемента в коллекции". Это гораздо нагляднее чем классический for с индексом.' }
      ]
    },
    {
      id: 3,
      title: 'while и do-while',
      type: 'theory',
      content: [
        { type: 'text', value: 'while выполняет блок кода пока условие истинно. Используй его когда заранее не знаешь сколько итераций будет.' },
        { type: 'code', language: 'kotlin', value: 'var count = 1\n\nwhile (count <= 5) {\n    println("Итерация: $count")\n    count++\n}\n// Итерация: 1\n// Итерация: 2\n// ...\n// Итерация: 5' },
        { type: 'tip', value: 'while как охранник у входа: сначала проверяет условие, потом пускает. Если условие сразу ложно — вообще не войдёт.' },
        { type: 'heading', value: 'do-while — минимум одна итерация' },
        { type: 'code', language: 'kotlin', value: 'var number = 10\n\ndo {\n    println("Число: $number")\n    number--\n} while (number > 5)\n// Число: 10\n// Число: 9\n// ...\n// Число: 6' },
        { type: 'note', value: 'do-while — сначала выполни, потом проверь. Блок кода выполнится хотя бы один раз, даже если условие сразу ложно. Пример из жизни: "съешь ужин, потом посмотришь — нужна ли добавка".' },
        { type: 'warning', value: 'Следи за тем, чтобы условие while рано или поздно стало ложным! Иначе получишь бесконечный цикл, который "зависит" программу.' }
      ]
    },
    {
      id: 4,
      title: 'break и continue',
      type: 'theory',
      content: [
        { type: 'text', value: 'break и continue управляют выполнением цикла. break — полностью прерывает цикл, continue — пропускает текущую итерацию.' },
        { type: 'code', language: 'kotlin', value: '// break — выйти из цикла\nfor (i in 1..10) {\n    if (i == 5) break\n    print("$i ")   // 1 2 3 4\n}\n\n// continue — пропустить итерацию\nfor (i in 1..10) {\n    if (i % 2 == 0) continue  // пропускаем чётные\n    print("$i ")   // 1 3 5 7 9\n}' },
        { type: 'tip', value: 'break — как аварийный выход из здания. continue — как пропуск одного этажа: лифт едет дальше, но этот этаж проигнорировали.' },
        { type: 'heading', value: 'Метки для вложенных циклов' },
        { type: 'code', language: 'kotlin', value: 'outer@ for (i in 1..3) {\n    for (j in 1..3) {\n        if (j == 2) break@outer  // выходим из ВНЕШНЕГО цикла!\n        println("i=$i, j=$j")\n    }\n}\n// i=1, j=1' },
        { type: 'note', value: 'Метки (outer@) — уникальная особенность Kotlin. Они позволяют указать из КАКОГО цикла выходить при break/continue. В Java для этого нужны хитрые флаги.' }
      ]
    },
    {
      id: 5,
      title: 'repeat — простое повторение',
      type: 'theory',
      content: [
        { type: 'text', value: 'repeat(n) — удобная функция для повторения блока кода n раз. Короче чем for (i in 0 until n).' },
        { type: 'code', language: 'kotlin', value: '// Повторить 5 раз\nrepeat(5) {\n    println("Kotlin — лучший язык!")\n}\n\n// С индексом текущей итерации (начинается с 0)\nrepeat(3) { index ->\n    println("Попытка ${index + 1}")\n}\n// Попытка 1\n// Попытка 2\n// Попытка 3' },
        { type: 'tip', value: 'repeat(n) как будильник, которому сказали "позвони 5 раз". Чисто и просто. Используй когда нужно просто повторить действие N раз без сложной логики.' },
        { type: 'heading', value: 'Сравнение циклов' },
        { type: 'list', items: [
          'for (i in 1..n) — когда нужен счётчик или перебор элементов',
          'while (condition) — когда не знаешь сколько раз повторять',
          'do-while — когда нужно выполнить хотя бы один раз',
          'repeat(n) — когда просто нужно повторить N раз'
        ]}
      ]
    },
    {
      id: 6,
      title: 'Практика: Таблица умножения',
      type: 'practice',
      difficulty: 'medium',
      description: 'Выведи таблицу умножения для числа 7 от 1 до 10 используя цикл for.',
      requirements: [
        'Используй цикл for с диапазоном 1..10',
        'Для каждого числа выведи строку формата "7 x 1 = 7"',
        'Используй строковые шаблоны для форматирования'
      ],
      expectedOutput: '7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70',
      hint: 'for (i in 1..10) { println("7 x $i = ${7 * i}") }. Выражение внутри ${} вычисляется и подставляется в строку.',
      solution: 'fun main() {\n    for (i in 1..10) {\n        println("7 x $i = ${7 * i}")\n    }\n}',
      explanation: '${7 * i} — строковый шаблон с выражением. Фигурные скобки нужны когда вставляем не просто переменную, а вычисление. Диапазон 1..10 — оба конца включены.'
    },
    {
      id: 7,
      title: 'Практика: Сумма чисел',
      type: 'practice',
      difficulty: 'medium',
      description: 'Вычисли сумму всех чисел от 1 до 100 и сумму только чётных чисел используя циклы.',
      requirements: [
        'Используй цикл for с диапазоном 1..100',
        'Посчитай сумму всех чисел',
        'В отдельном цикле посчитай сумму чётных чисел (используй step 2 или continue)',
        'Выведи оба результата'
      ],
      expectedOutput: 'Сумма 1..100 = 5050\nСумма чётных = 2550',
      hint: 'var sum = 0, затем sum += i в цикле. Для чётных: for (i in 2..100 step 2) или if (i % 2 != 0) continue.',
      solution: 'fun main() {\n    var sum = 0\n    for (i in 1..100) {\n        sum += i\n    }\n    var evenSum = 0\n    for (i in 2..100 step 2) {\n        evenSum += i\n    }\n    println("Сумма 1..100 = $sum")\n    println("Сумма чётных = $evenSum")\n}',
      explanation: 'Сумма 1..100 = 5050 (формула Гаусса: n*(n+1)/2 = 100*101/2). Чётные числа: 2, 4, 6...100 — step 2 элегантнее чем проверка остатка. Сумма чётных = 2550 = 5050/2 * (чётных ровно половина).'
    }
  ]
}
