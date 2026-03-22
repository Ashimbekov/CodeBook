export default {
  id: 8,
  title: 'Строки и шаблоны',
  description: 'Строковые шаблоны, многострочные строки, основные методы работы со строками',
  lessons: [
    {
      id: 1,
      title: 'Строковые шаблоны (String Templates)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Строковые шаблоны — одна из самых удобных возможностей Kotlin. Они позволяют встраивать переменные и выражения прямо в строку через символ $.' },
        { type: 'code', language: 'kotlin', value: 'val name = "Нурдаулет"\nval age = 25\n\n// Простое встраивание переменной\nprintln("Меня зовут $name")        // Меня зовут Нурдаулет\nprintln("Мне $age лет")             // Мне 25 лет\n\n// Выражение в ${...}\nprintln("Через год мне будет ${age + 1} лет")  // Через год мне будет 26 лет\nprintln("Имя в верхнем регистре: ${name.uppercase()}")' },
        { type: 'tip', value: 'Строковые шаблоны как именные бирки. Ты пишешь шаблон "Меня зовут $name" и Kotlin сам вставляет нужное значение. Гораздо удобнее чем конкатенация через +.' },
        { type: 'heading', value: 'Когда нужны ${ } скобки?' },
        { type: 'code', language: 'kotlin', value: 'val items = listOf("a", "b", "c")\n\n// Простое свойство — без скобок:\nprintln("В списке $items элементов")  // не то что хотим\nprintln("В списке ${items.size} элементов")  // В списке 3 элементов\n\n// Вычисление:\nprintln("2 + 2 = ${2 + 2}")   // 2 + 2 = 4\nprintln("Первый: ${items[0]}") // Первый: a' },
        { type: 'note', value: '$переменная — для простого имени переменной. ${выражение} — для любого выражения: вызова метода, вычисления, обращения к элементу.' }
      ]
    },
    {
      id: 2,
      title: 'Многострочные строки (trimIndent)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kotlin поддерживает многострочные строки через тройные кавычки """. Внутри можно писать текст на нескольких строках без символов \\n.' },
        { type: 'code', language: 'kotlin', value: 'val message = """\n    Уважаемый пользователь!\n    \n    Ваш заказ принят.\n    Спасибо за покупку!\n    \n    С уважением,\n    Служба поддержки\n""".trimIndent()\n\nprintln(message)' },
        { type: 'heading', value: 'trimIndent и trimMargin' },
        { type: 'code', language: 'kotlin', value: '// trimIndent() убирает общий отступ\nval html = """\n    <html>\n        <body>\n            <p>Hello!</p>\n        </body>\n    </html>\n""".trimIndent()\n\n// trimMargin() убирает пробелы до символа |\nval sql = """\n    |SELECT *\n    |FROM users\n    |WHERE age > 18\n""".trimMargin()\n\nprintln(sql)' },
        { type: 'tip', value: 'trimIndent() как "выравнивание по левому краю": убирает одинаковый отступ со всех строк. Остаётся чистый текст без лишних пробелов.' },
        { type: 'note', value: 'Внутри многострочных строк тоже работают строковые шаблоны: val name = "Kotlin"; val text = """Привет, $name!"""' }
      ]
    },
    {
      id: 3,
      title: 'Методы строк: поиск и проверка',
      type: 'theory',
      content: [
        { type: 'text', value: 'String в Kotlin содержит огромное количество полезных методов. Рассмотрим самые важные — для поиска и проверки.' },
        { type: 'code', language: 'kotlin', value: 'val text = "Hello, Kotlin World!"\n\n// Проверки\nprintln(text.isEmpty())         // false\nprintln(text.isNotEmpty())      // true\nprintln(text.contains("Kotlin")) // true\nprintln(text.startsWith("Hello")) // true\nprintln(text.endsWith("!"))     // true\n\n// Поиск\nprintln(text.indexOf("Kotlin"))  // 7 — позиция\nprintln(text.length)             // 20' },
        { type: 'heading', value: 'Проверка содержимого' },
        { type: 'code', language: 'kotlin', value: 'val num = "12345"\nval word = "hello"\nval blank = "   "\n\nprintln(num.all { it.isDigit() })   // true — все цифры\nprintln(word.all { it.isLetter() }) // true — все буквы\nprintln(blank.isBlank())            // true — пусто или пробелы\nprintln(blank.isEmpty())            // false — есть пробелы' },
        { type: 'tip', value: 'isBlank() и isEmpty() — важное различие. isEmpty() — строго пустая строка "". isBlank() — пустая или только пробелы "   ". Для проверки что пользователь ввёл что-то — используй isNotBlank().' }
      ]
    },
    {
      id: 4,
      title: 'Методы строк: преобразование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kotlin предоставляет богатый набор методов для преобразования строк: обрезка, разбиение, замена, изменение регистра.' },
        { type: 'code', language: 'kotlin', value: 'val text = "  Hello, Kotlin!  "\n\n// Обрезка пробелов\nprintln(text.trim())       // "Hello, Kotlin!"\nprintln(text.trimStart())  // "Hello, Kotlin!  "\nprintln(text.trimEnd())    // "  Hello, Kotlin!"\n\n// Регистр\nprintln(text.trim().uppercase())   // HELLO, KOTLIN!\nprintln(text.trim().lowercase())   // hello, kotlin!\nprintln("hello world".capitalize()) // Hello world (первая буква)' },
        { type: 'heading', value: 'Разбиение и замена' },
        { type: 'code', language: 'kotlin', value: 'val csv = "яблоко,банан,вишня,дыня"\n\n// Разбивка по разделителю\nval fruits = csv.split(",")\nprintln(fruits)  // [яблоко, банан, вишня, дыня]\nprintln(fruits.size)  // 4\n\n// Замена\nval original = "Hello World"\nprintln(original.replace("Hello", "Привет"))  // Привет World\nprintln(original.replace("l", "L"))           // HeLLo WorLd\n\n// Подстрока\nprintln(original.substring(6))      // World\nprintln(original.substring(0, 5))   // Hello' },
        { type: 'note', value: 'split() возвращает List<String> — список строк. Это очень удобно для парсинга данных: CSV, конфигурационные файлы, пользовательский ввод.' }
      ]
    },
    {
      id: 5,
      title: 'Символы строки и StringBuilder',
      type: 'theory',
      content: [
        { type: 'text', value: 'Строку можно обходить посимвольно, обращаться к символам по индексу. Для эффективного создания строк используется StringBuilder.' },
        { type: 'code', language: 'kotlin', value: 'val word = "Kotlin"\n\n// Доступ к символам\nprintln(word[0])      // K\nprintln(word[5])      // n\nprintln(word.first()) // K\nprintln(word.last())  // n\n\n// Перебор\nfor (ch in word) {\n    print("$ch ")  // K o t l i n\n}' },
        { type: 'heading', value: 'StringBuilder — эффективное создание строк' },
        { type: 'code', language: 'kotlin', value: 'val sb = StringBuilder()\nsb.append("Kotlin")\nsb.append(" — ")\nsb.append("лучший язык")\nsb.append("!")\n\nval result = sb.toString()\nprintln(result)  // Kotlin — лучший язык!\n\n// Или через buildString:\nval text = buildString {\n    append("Hello")\n    append(", ")\n    append("World")\n    append("!")\n}\nprintln(text)  // Hello, World!' },
        { type: 'tip', value: 'String в Kotlin — неизменяема. Каждая конкатенация + создаёт новую строку. В цикле это очень медленно. StringBuilder изменяемый — он копит текст и создаёт строку один раз в конце.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Форматирование строк',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай функцию форматирования профиля пользователя в красивый вид.',
      requirements: [
        'Функция formatProfile(name: String, age: Int, city: String, bio: String?): String',
        'Используй многострочную строку с trimIndent()',
        'Если bio не указан — выведи "Нет информации"',
        'Используй строковые шаблоны для подстановки значений',
        'Вызови функцию и выведи результат'
      ],
      expectedOutput: '=== Профиль ===\nИмя: Нурдаулет\nВозраст: 25\nГород: Астана\nО себе: Kotlin разработчик\n===============',
      hint: 'val bioText = bio ?: "Нет информации". Затем используй многострочную строку с переменными внутри.',
      solution: 'fun formatProfile(name: String, age: Int, city: String, bio: String?): String {\n    val bioText = bio ?: "Нет информации"\n    return """\n        === Профиль ===\n        Имя: $name\n        Возраст: $age\n        Город: $city\n        О себе: $bioText\n        ===============\n    """.trimIndent()\n}\n\nfun main() {\n    println(formatProfile("Нурдаулет", 25, "Астана", "Kotlin разработчик"))\n}',
      explanation: 'trimIndent() убирает одинаковый отступ со всех строк многострочной строки. ?:  обрабатывает null для bio. Строковые шаблоны $name, $age подставляют значения. Результат — чистое форматирование.'
    }
  ]
}
