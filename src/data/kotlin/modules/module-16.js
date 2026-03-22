export default {
  id: 16,
  title: 'Расширения (extensions)',
  description: 'Extension-функции и свойства позволяют добавлять новые методы к существующим классам без наследования — мощный инструмент выразительного Kotlin-кода',
  lessons: [
    {
      id: 1,
      title: 'Extension-функции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Extension-функция позволяет добавить метод к существующему классу, не изменяя его исходный код. Синтаксис: fun ClassName.methodName(params). Это не изменяет класс — компилятор просто вставляет ссылку на объект.' },
        { type: 'code', language: 'kotlin', value: '// Добавляем метод к String\nfun String.isPalindrome(): Boolean {\n    val cleaned = this.lowercase().filter { it.isLetter() }\n    return cleaned == cleaned.reversed()\n}\n\nfun String.capitalizeWords(): String {\n    return this.split(" ").joinToString(" ") { word ->\n        word.replaceFirstChar { it.uppercase() }\n    }\n}\n\n// Добавляем метод к Int\nfun Int.factorial(): Long {\n    if (this < 0) throw IllegalArgumentException("Отрицательный факториал")\n    var result = 1L\n    for (i in 2..this) result *= i\n    return result\n}\n\nfun Int.isPrime(): Boolean {\n    if (this < 2) return false\n    for (i in 2..Math.sqrt(this.toDouble()).toInt()) {\n        if (this % i == 0) return false\n    }\n    return true\n}\n\nfun main() {\n    println("level".isPalindrome())    // true\n    println("hello".isPalindrome())    // false\n    println("hello world".capitalizeWords())  // Hello World\n    println(5.factorial())   // 120\n    println(7.isPrime())     // true\n    println(10.isPrime())    // false\n}' },
        { type: 'tip', value: 'this внутри extension-функции ссылается на объект-получатель (receiver). Extension-функции не нарушают инкапсуляцию — они не видят private/protected членов класса.' },
        { type: 'warning', value: 'Extension-функция не переопределяет метод класса. Если класс уже имеет метод с такой же сигнатурой, всегда вызовется метод класса, а не extension.' }
      ]
    },
    {
      id: 2,
      title: 'Extension-свойства',
      type: 'theory',
      content: [
        { type: 'text', value: 'Extension-свойства работают аналогично extension-функциям, но имеют синтаксис свойств. Они не хранят состояние — только вычисляемые геттеры (и иногда сеттеры).' },
        { type: 'code', language: 'kotlin', value: 'val String.wordCount: Int\n    get() = if (this.isBlank()) 0 else this.trim().split("\\s+".toRegex()).size\n\nval String.firstWord: String\n    get() = this.trim().split(" ").firstOrNull() ?: ""\n\nval Int.isEven: Boolean\n    get() = this % 2 == 0\n\nval Int.digits: List<Int>\n    get() = this.toString().map { it.digitToInt() }\n\n// Extension с сеттером\nvar StringBuilder.lastChar: Char\n    get() = this[length - 1]\n    set(value) {\n        this.setCharAt(length - 1, value)\n    }\n\nfun main() {\n    println("kotlin is great".wordCount)  // 3\n    println("  hello world".firstWord)    // hello\n    println(4.isEven)    // true\n    println(12345.digits)  // [1, 2, 3, 4, 5]\n\n    val sb = StringBuilder("Привет")\n    sb.lastChar = \'!\'\n    println(sb)  // Привет!\n}' },
        { type: 'note', value: 'Extension-свойства не могут иметь backing field — они не хранят состояние в объекте. Поэтому нельзя написать var String.myProperty = "значение".' }
      ]
    },
    {
      id: 3,
      title: 'Extensions для коллекций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стандартная библиотека Kotlin сама построена на extension-функциях. map, filter, forEach — всё это extensions для Iterable. Мы можем добавлять свои.' },
        { type: 'code', language: 'kotlin', value: '// Extension для List\nfun <T> List<T>.second(): T? = if (size >= 2) this[1] else null\nfun <T> List<T>.penultimate(): T? = if (size >= 2) this[size - 2] else null\n\nfun List<Int>.median(): Double {\n    if (isEmpty()) return 0.0\n    val sorted = sorted()\n    return if (sorted.size % 2 == 0) {\n        (sorted[sorted.size / 2 - 1] + sorted[sorted.size / 2]) / 2.0\n    } else {\n        sorted[sorted.size / 2].toDouble()\n    }\n}\n\n// Extension для Map\nfun <K, V> Map<K, V>.getOrDefault(key: K, default: () -> V): V {\n    return this[key] ?: default()\n}\n\n// Extension для Iterable\nfun <T> Iterable<T>.forEachIndexedFrom(\n    startIndex: Int,\n    action: (index: Int, T) -> Unit\n) {\n    var index = startIndex\n    for (item in this) action(index++, item)\n}\n\nfun main() {\n    val list = listOf(3, 1, 4, 1, 5, 9, 2, 6)\n    println(list.second())       // 1\n    println(list.penultimate())  // 2\n    println(list.median())       // 3.5\n\n    val map = mapOf("a" to 1)\n    println(map.getOrDefault("b") { 42 })  // 42\n\n    listOf("a", "b", "c").forEachIndexedFrom(10) { i, v ->\n        println("$i: $v")\n    }\n    // 10: a, 11: b, 12: c\n}' }
      ]
    },
    {
      id: 4,
      title: 'Extensions с receiver — функциональный стиль',
      type: 'theory',
      content: [
        { type: 'text', value: 'Function type with receiver — тип функции, у которого есть receiver. Записывается как ReceiverType.() -> ReturnType. Это основа для создания DSL в Kotlin.' },
        { type: 'code', language: 'kotlin', value: '// Функция с receiver как параметр\nfun buildString(block: StringBuilder.() -> Unit): String {\n    val sb = StringBuilder()\n    sb.block()  // вызываем как метод StringBuilder\n    return sb.toString()\n}\n\nfun main() {\n    val result = buildString {\n        append("Привет, ")  // this — StringBuilder\n        append("мир")\n        append("!")\n        insert(0, ">>> ")\n    }\n    println(result)  // >>> Привет, мир!\n}' },
        { type: 'code', language: 'kotlin', value: '// Простой HTML DSL\nclass HtmlBuilder {\n    private val content = StringBuilder()\n\n    fun tag(name: String, block: HtmlBuilder.() -> Unit): HtmlBuilder {\n        content.append("<$name>")\n        this.block()\n        content.append("</$name>")\n        return this\n    }\n\n    fun text(value: String): HtmlBuilder {\n        content.append(value)\n        return this\n    }\n\n    fun build() = content.toString()\n}\n\nfun html(block: HtmlBuilder.() -> Unit): String {\n    return HtmlBuilder().apply(block).build()\n}\n\nfun main() {\n    val page = html {\n        tag("h1") { text("Заголовок") }\n        tag("p") { text("Параграф текста") }\n        tag("ul") {\n            tag("li") { text("Пункт 1") }\n            tag("li") { text("Пункт 2") }\n        }\n    }\n    println(page)\n    // <h1>Заголовок</h1><p>Параграф текста</p><ul><li>Пункт 1</li><li>Пункт 2</li></ul>\n}' },
        { type: 'tip', value: 'Function type with receiver — это основа scope-функций (apply, run, with) и Kotlin DSL. Именно поэтому внутри apply { } можно обращаться к членам объекта напрямую.' }
      ]
    },
    {
      id: 5,
      title: 'Где определять extensions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Extension-функции можно объявлять на верхнем уровне файла, внутри класса или объекта. От места объявления зависит область видимости.' },
        { type: 'code', language: 'kotlin', value: '// Верхний уровень файла — доступна везде в модуле\nfun String.shout() = this.uppercase() + "!!!"\n\nclass StringUtils {\n    // Extension внутри класса — доступна только через StringUtils\n    fun String.quote() = "\"$this\""\n\n    fun demo() {\n        println("hello".shout())  // HELLO!!!\n        println("world".quote())  // "world"\n    }\n}\n\n// Extensions в companion object\nclass MathHelper {\n    companion object {\n        fun Int.squared() = this * this\n        fun Double.rounded(decimals: Int): Double {\n            val factor = Math.pow(10.0, decimals.toDouble())\n            return Math.round(this * factor) / factor\n        }\n    }\n}\n\nfun main() {\n    println("привет".shout())  // ПРИВЕТ!!!\n\n    // Через экземпляр StringUtils\n    with(StringUtils()) {\n        "kotlin".quote().let { println(it) }  // "kotlin"\n    }\n\n    with(MathHelper) {\n        println(5.squared())    // 25\n        println(3.14159.rounded(2))  // 3.14\n    }\n}' },
        { type: 'list', items: [
          'Верхний уровень файла: наиболее распространённый вариант, доступна везде где импортирован файл',
          'Внутри класса/объекта: доступна только в этом контексте через with() или внутри методов',
          'В companion object: вызывается через имя класса',
          'Extensions из другого пакета нужно явно импортировать'
        ]}
      ]
    },
    {
      id: 6,
      title: 'Практика: Extension-библиотека',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай набор полезных extension-функций. 1) String.toSlug() — преобразует строку в URL-slug (нижний регистр, пробелы в дефисы, только буквы/цифры/дефисы). 2) List<Int>.stats() — возвращает строку с мин, макс, средним. 3) Int.toRoman() — конвертирует в римские цифры (1-3999). Протестируй все три.',
      requirements: [
        'String.toSlug(): lowercase, trim, пробелы -> дефисы, убрать не-буквы-цифры-дефисы',
        'List<Int>.stats() возвращает "min=X, max=Y, avg=Z"',
        'Int.toRoman() для чисел 1..3999',
        'toRoman() работает через таблицу значений: 1000->M, 900->CM, 500->D, и т.д.',
        'Протестировать: "Hello World!" -> "hello-world", список [3,1,4,1,5,9], числа 14, 1994, 3999'
      ],
      expectedOutput: '"Hello World!" -> hello-world\n"  Kotlin  IS  Great!  " -> kotlin-is-great\nСтатистика [3,1,4,1,5,9]: min=1, max=9, avg=3\n14 -> XIV\n1994 -> MCMXCIV\n3999 -> MMMCMXCIX',
      hint: 'Для toSlug: используй replace("\\\\s+".toRegex(), "-") и replace("[^a-z0-9-]".toRegex(), ""). Для toRoman: создай список пар (значение, символ) в порядке убывания, вычитай значения пока возможно.',
      solution: 'fun String.toSlug(): String {\n    return this\n        .trim()\n        .lowercase()\n        .replace("\\\\s+".toRegex(), "-")\n        .replace("[^a-z0-9-]".toRegex(), "")\n        .replace("-+".toRegex(), "-")\n}\n\nfun List<Int>.stats(): String {\n    if (isEmpty()) return "пусто"\n    return "min=${min()}, max=${max()}, avg=${average().toInt()}"\n}\n\nfun Int.toRoman(): String {\n    val values = listOf(\n        1000 to "M", 900 to "CM", 500 to "D", 400 to "CD",\n        100 to "C", 90 to "XC", 50 to "L", 40 to "XL",\n        10 to "X", 9 to "IX", 5 to "V", 4 to "IV", 1 to "I"\n    )\n    var num = this\n    val result = StringBuilder()\n    for ((value, symbol) in values) {\n        while (num >= value) {\n            result.append(symbol)\n            num -= value\n        }\n    }\n    return result.toString()\n}\n\nfun main() {\n    println(\'"\' + "Hello World!" + \'"\' + " -> " + "Hello World!".toSlug())\n    println(\'"\' + "  Kotlin  IS  Great!  " + \'"\' + " -> " + "  Kotlin  IS  Great!  ".toSlug())\n    val nums = listOf(3, 1, 4, 1, 5, 9)\n    println("Статистика $nums: ${nums.stats()}")\n    println("14 -> ${14.toRoman()}")\n    println("1994 -> ${1994.toRoman()}")\n    println("3999 -> ${3999.toRoman()}")\n}',
      explanation: 'Extension-функции позволяют писать nums.stats() вместо stats(nums) — код читается слева направо, как предложение. toRoman использует жадный алгоритм: берём наибольшее возможное значение, вычитаем его, добавляем символ, повторяем. Регулярные выражения в toSlug обрабатывают последовательности пробелов и нежелательных символов.'
    }
  ]
}
