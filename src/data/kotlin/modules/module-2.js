export default {
  id: 2,
  title: 'Переменные и типы данных',
  description: 'val и var, основные типы данных, вывод типов — как Kotlin хранит и управляет данными',
  lessons: [
    {
      id: 1,
      title: 'val и var: неизменяемые и изменяемые переменные',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Kotlin есть два ключевых слова для объявления переменных: val и var. Это главное отличие от Java, где все переменные изменяемы по умолчанию.' },
        { type: 'tip', value: 'Представь val как сейф с замком: положил деньги — обратно не вытащишь (не изменишь). А var — это обычный кошелёк: деньги можно класть и вынимать когда угодно.' },
        { type: 'heading', value: 'val — неизменяемая переменная' },
        { type: 'code', language: 'kotlin', value: 'val name = "Нурдаулет"  // создали — всё, изменить нельзя\nval pi = 3.14159\n\n// name = "Другое имя"  // ОШИБКА! val нельзя переприсвоить\nprintln(name)  // Нурдаулет' },
        { type: 'heading', value: 'var — изменяемая переменная' },
        { type: 'code', language: 'kotlin', value: 'var score = 0        // начальное значение\nscore = 10           // изменяем — всё ок!\nscore = score + 5    // прибавляем 5\nprintln(score)       // 15' },
        { type: 'note', value: 'Правило хорошего тона в Kotlin: используй val везде, где только можно. Переходи на var только когда значение действительно должно меняться. Это делает код надёжнее и понятнее.' },
        { type: 'warning', value: 'val — это не константа в полном смысле! Для объектов val означает, что переменная не может указывать на другой объект, но содержимое объекта может меняться. Подробнее об этом в модуле про классы.' }
      ]
    },
    {
      id: 2,
      title: 'Числовые типы: Int, Long, Double, Float',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kotlin наследует числовые типы от Java, но работать с ними гораздо приятнее. Основные числовые типы: Int, Long, Double, Float.' },
        { type: 'heading', value: 'Int — целые числа' },
        { type: 'code', language: 'kotlin', value: 'val age: Int = 25\nval year = 2024        // Kotlin сам выводит тип Int\nval temperature = -15\n\nprintln(age + year)    // 2049' },
        { type: 'heading', value: 'Long — большие целые числа' },
        { type: 'code', language: 'kotlin', value: 'val worldPopulation: Long = 8_000_000_000L\nval distanceToMoon = 384_400_000L\n\nprintln(worldPopulation)  // 8000000000' },
        { type: 'tip', value: 'Подчёркивания в числах — это как разделители тысяч. 1_000_000 читается как 1 миллион. Это просто украшение для читаемости, на значение не влияет.' },
        { type: 'heading', value: 'Double и Float — дробные числа' },
        { type: 'code', language: 'kotlin', value: 'val price: Double = 99.99\nval discount = 0.15         // Double по умолчанию\nval weight: Float = 72.5f   // Float нужна буква f\n\nprintln(price * (1 - discount))  // 84.9915' },
        { type: 'note', value: 'Double — 64-битное число с точностью ~15 знаков. Float — 32-битное, точность ~7 знаков. Используй Double везде, где важна точность. Float только для экономии памяти (например, в графике).' }
      ]
    },
    {
      id: 3,
      title: 'String, Char и Boolean',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо числовых типов, в Kotlin часто используются String (строки), Char (символы) и Boolean (логические значения).' },
        { type: 'heading', value: 'String — строки' },
        { type: 'code', language: 'kotlin', value: 'val greeting = "Привет, Kotlin!"\nval empty = ""\nval multiword = "Меня зовут Нурдаулет"\n\nprintln(greeting.length)      // 15 — длина строки\nprintln(greeting.uppercase()) // ПРИВЕТ, KOTLIN!' },
        { type: 'heading', value: 'Char — одиночный символ' },
        { type: 'code', language: 'kotlin', value: 'val letter: Char = \'K\'    // одинарные кавычки!\nval digit: Char = \'7\'\nval space: Char = \' \'\n\nprintln(letter)            // K\nprintln(letter.code)       // 75 — код символа в Unicode' },
        { type: 'warning', value: 'Char пишется в одинарных кавычках \'K\', а String — в двойных "Kotlin". Это важно! \'К\' — это символ, "К" — это строка из одного символа.' },
        { type: 'heading', value: 'Boolean — истина и ложь' },
        { type: 'code', language: 'kotlin', value: 'val isKotlinCool = true\nval isJavaOld = false\n\nprintln(isKotlinCool)           // true\nprintln(!isKotlinCool)          // false (отрицание)\nprintln(isKotlinCool && !isJavaOld)  // true (И)' },
        { type: 'tip', value: 'Boolean — это как выключатель: либо включён (true), либо выключен (false). Используется в условиях: "если задача выполнена (true) — похвали себя".' }
      ]
    },
    {
      id: 4,
      title: 'Вывод типов (Type Inference)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Одна из приятных особенностей Kotlin — вывод типов. Компилятор сам определяет тип переменной по присвоенному значению, и тебе не нужно писать его явно.' },
        { type: 'code', language: 'kotlin', value: '// Явное указание типа:\nval name: String = "Нурдаулет"\nval age: Int = 25\nval price: Double = 99.99\n\n// Вывод типов — Kotlin сам разберётся:\nval name2 = "Нурдаулет"    // String\nval age2 = 25               // Int\nval price2 = 99.99          // Double\nval isAdmin = true          // Boolean' },
        { type: 'tip', value: 'Kotlin как опытный повар — видит ингредиенты и сразу понимает что готовится. Видит "Нурдаулет" — строка. Видит 25 — число. Видит 3.14 — дробное число.' },
        { type: 'heading', value: 'Когда указывать тип явно?' },
        { type: 'list', items: [
          'Когда хочешь убедиться, что тип именно тот, что нужен',
          'Когда переменная объявляется без значения: var score: Int',
          'Когда вывод типа может быть неочевидным для читателя',
          'При работе с числами: val x: Long = 100 (иначе будет Int)'
        ]},
        { type: 'code', language: 'kotlin', value: '// Объявление без значения — тип нужен обязательно:\nvar result: Int\nresult = 42\n\n// Или сразу с значением — тип необязателен:\nvar result2 = 42' },
        { type: 'note', value: 'В Kotlin строгая статическая типизация — несмотря на то, что тип можно не писать, он всё равно есть и определяется на этапе компиляции. Нельзя присвоить строку в переменную типа Int.' }
      ]
    },
    {
      id: 5,
      title: 'Преобразование типов',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Kotlin нет неявного преобразования типов — нельзя присвоить Int в Long без явного преобразования. Это защищает от скрытых ошибок.' },
        { type: 'code', language: 'kotlin', value: 'val intNum: Int = 42\nval longNum: Long = intNum.toLong()   // явное преобразование\nval doubleNum: Double = intNum.toDouble()\nval strNum: String = intNum.toString()\n\nprintln(longNum)   // 42\nprintln(doubleNum) // 42.0\nprintln(strNum)    // "42"' },
        { type: 'heading', value: 'Методы преобразования' },
        { type: 'list', items: [
          'toInt() — преобразовать в Int',
          'toLong() — преобразовать в Long',
          'toDouble() — преобразовать в Double',
          'toFloat() — преобразовать в Float',
          'toString() — преобразовать в String',
          'toBoolean() — "true"/"false" строку в Boolean'
        ]},
        { type: 'code', language: 'kotlin', value: 'val text = "123"\nval number = text.toInt()    // строку "123" в число 123\nprintln(number + 1)          // 124\n\nval badText = "abc"\n// badText.toInt()  // выбросит NumberFormatException!\nval safe = badText.toIntOrNull()  // вернёт null вместо ошибки\nprintln(safe)  // null' },
        { type: 'tip', value: 'Методы toIntOrNull(), toDoubleOrNull() — безопасный вариант преобразования. Если строка не является числом, вернут null, а не упадут с ошибкой. Используй их при работе с пользовательским вводом.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Переменные и типы',
      type: 'practice',
      difficulty: 'easy',
      description: 'Объяви переменные разных типов и выведи информацию о товаре в интернет-магазине.',
      requirements: [
        'Объяви val name типа String с названием товара',
        'Объяви val price типа Double с ценой',
        'Объяви var quantity типа Int с количеством',
        'Измени quantity на новое значение',
        'Выведи все три переменные в читаемом формате'
      ],
      expectedOutput: 'Товар: Ноутбук\nЦена: 150000.0\nКоличество: 5',
      hint: 'Помни: val нельзя переприсвоить, а var можно. Для вывода используй println() с конкатенацией через +.',
      solution: 'fun main() {\n    val name = "Ноутбук"\n    val price = 150000.0\n    var quantity = 10\n    quantity = 5\n    println("Товар: " + name)\n    println("Цена: " + price)\n    println("Количество: " + quantity)\n}',
      explanation: 'val используется для name и price — они не изменятся. var для quantity — товар могут докупить или продать. Kotlin вывел типы автоматически: String, Double, Int.'
    },
    {
      id: 7,
      title: 'Практика: Преобразование типов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая работает с числами разных типов и выполняет преобразования.',
      requirements: [
        'Объяви Int переменную с количеством дней: 365',
        'Преобразуй в Long и умножь на 24 (часов в году)',
        'Преобразуй исходное число в Double и раздели на 7.0 (недель)',
        'Выведи: количество часов в году и количество недель (с дробью)'
      ],
      expectedOutput: 'Часов в году: 8760\nНедель в году: 52.142857142857146',
      hint: 'Используй .toLong() и .toDouble() для преобразования. Результат умножения Long на Int будет Long.',
      solution: 'fun main() {\n    val days = 365\n    val hours = days.toLong() * 24\n    val weeks = days.toDouble() / 7.0\n    println("Часов в году: " + hours)\n    println("Недель в году: " + weeks)\n}',
      explanation: 'toLong() превращает Int в Long — нужно когда результат может не влезть в Int. toDouble() даёт дробный результат при делении. Без .toDouble() деление 365/7 дало бы 52 (целая часть).'
    }
  ]
}
