export default {
  id: 20,
  title: 'Работа с файлами',
  description: 'Чтение и запись файлов через java.io и kotlin.io, работа с путями, обработка текстовых и бинарных файлов, буферизация и кодировки',
  lessons: [
    {
      id: 1,
      title: 'Чтение файлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kotlin предоставляет удобные extension-функции для File из java.io. Они проще Java-аналогов и автоматически управляют ресурсами.' },
        { type: 'code', language: 'kotlin', value: 'import java.io.File\n\nfun main() {\n    // Создаём тестовый файл\n    val file = File("test.txt")\n    file.writeText("Строка 1\\nСтрока 2\\nСтрока 3\\nСтрока 4")\n\n    // readText() — весь файл как строка\n    val allText = file.readText()\n    println("Весь текст:\\n$allText")\n\n    // readLines() — список строк\n    val lines = file.readLines()\n    println("Строк: ${lines.size}")\n    lines.forEachIndexed { i, line -> println("${i + 1}: $line") }\n\n    // forEachLine() — обработка построчно (экономно по памяти)\n    println("\\nПострочно:")\n    file.forEachLine { line ->\n        println("  [$line]")\n    }\n\n    // bufferedReader() — буферизованное чтение\n    file.bufferedReader().use { reader ->\n        println("\\nЧерез bufferedReader:")\n        println(reader.readLine())  // только первая строка\n    }\n}' },
        { type: 'tip', value: 'Для маленьких файлов используй readText() или readLines(). Для больших — forEachLine() или bufferedReader(), чтобы не загружать весь файл в память.' },
        { type: 'warning', value: 'use { } автоматически закрывает поток после выполнения блока — даже если бросится исключение. Всегда используй use при работе с потоками.' }
      ]
    },
    {
      id: 2,
      title: 'Запись файлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Kotlin предоставляет несколько способов записи в файл: writeText перезаписывает, appendText добавляет в конец, printWriter даёт больший контроль.' },
        { type: 'code', language: 'kotlin', value: 'import java.io.File\n\nfun main() {\n    val file = File("output.txt")\n\n    // writeText — перезапись всего содержимого\n    file.writeText("Первая строка\\n")\n    println("Записано: ${file.readText()}")\n\n    // appendText — добавление в конец\n    file.appendText("Вторая строка\\n")\n    file.appendText("Третья строка\\n")\n    println("После добавления:\\n${file.readText()}")\n\n    // writeLines — список строк\n    file.writeText("")  // очистка\n    file.bufferedWriter().use { writer ->\n        listOf("Kotlin", "Java", "Python").forEach { lang ->\n            writer.write(lang)\n            writer.newLine()\n        }\n    }\n    println("Языки:\\n${file.readText()}")\n\n    // printWriter — форматированный вывод\n    File("report.txt").printWriter().use { pw ->\n        pw.println("=== Отчёт ===")\n        pw.printf("Дата: %s%n", java.time.LocalDate.now())\n        for (i in 1..3) {\n            pw.println("Запись $i: значение ${i * 100}")\n        }\n    }\n    println(File("report.txt").readText())\n\n    // Удаляем тестовые файлы\n    file.delete()\n    File("report.txt").delete()\n}' }
      ]
    },
    {
      id: 3,
      title: 'Работа с путями и директориями',
      type: 'theory',
      content: [
        { type: 'text', value: 'File работает не только с файлами, но и с директориями. Kotlin добавляет удобные extension-функции для навигации по файловой системе.' },
        { type: 'code', language: 'kotlin', value: 'import java.io.File\n\nfun main() {\n    // Создание директорий\n    val dir = File("test_dir")\n    dir.mkdirs()  // создаёт директорию и все родительские\n    println("Создана: ${dir.absolutePath}")\n\n    // Создание файлов в директории\n    File(dir, "file1.txt").writeText("Содержимое 1")\n    File(dir, "file2.txt").writeText("Содержимое 2")\n    val subDir = File(dir, "subdir")\n    subDir.mkdir()\n    File(subDir, "nested.txt").writeText("Вложенный файл")\n\n    // listFiles() — список файлов в директории\n    println("\\nСодержимое ${dir.name}:")\n    dir.listFiles()?.forEach { f ->\n        println("  ${if (f.isDirectory) "[DIR]" else "[FILE]"} ${f.name}")\n    }\n\n    // walkTopDown() — рекурсивный обход\n    println("\\nВсе файлы (рекурсивно):")\n    dir.walkTopDown()\n        .filter { it.isFile }\n        .forEach { println("  ${it.path}") }\n\n    // Информация о файле\n    val testFile = File(dir, "file1.txt")\n    println("\\nИнформация о file1.txt:")\n    println("  Существует: ${testFile.exists()}")\n    println("  Размер: ${testFile.length()} байт")\n    println("  Расширение: ${testFile.extension}")\n    println("  Имя без расширения: ${testFile.nameWithoutExtension}")\n\n    // Очистка\n    dir.deleteRecursively()\n    println("\\nУдалено: ${!dir.exists()}")\n}' },
        { type: 'note', value: 'walkTopDown() — мощный инструмент для рекурсивного обхода. С filter и другими операциями коллекций он позволяет гибко искать файлы.' }
      ]
    },
    {
      id: 4,
      title: 'Бинарные файлы и кодировки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Не все файлы текстовые. Kotlin/Java позволяет работать с бинарными данными через readBytes/writeBytes, а также явно управлять кодировками текстовых файлов.' },
        { type: 'code', language: 'kotlin', value: 'import java.io.File\nimport java.nio.charset.Charset\n\nfun main() {\n    // Бинарные файлы\n    val binaryFile = File("data.bin")\n    val bytes = byteArrayOf(72, 101, 108, 108, 111)  // "Hello" в ASCII\n    binaryFile.writeBytes(bytes)\n\n    val readBytes = binaryFile.readBytes()\n    println("Байты: ${readBytes.toList()}")  // [72, 101, 108, 108, 111]\n    println("Как строка: ${String(readBytes)}")  // Hello\n    binaryFile.delete()\n\n    // Кодировки\n    val utf8File = File("utf8.txt")\n    utf8File.writeText("Привет, мир! 🌍", Charsets.UTF_8)\n\n    // Чтение с явной кодировкой\n    val content = utf8File.readText(Charsets.UTF_8)\n    println("UTF-8: $content")\n    utf8File.delete()\n\n    // Работа с Properties\n    val propsFile = File("config.properties")\n    propsFile.writeText("host=localhost\\nport=8080\\nssl=false")\n    val props = java.util.Properties()\n    propsFile.inputStream().use { props.load(it) }\n    println("host=${props.getProperty("host")}")\n    println("port=${props.getProperty("port")}")\n    propsFile.delete()\n}' },
        { type: 'tip', value: 'Всегда явно указывай кодировку при работе с текстовыми файлами, особенно если файл будет читаться на других системах. UTF-8 — стандарт де-факто.' }
      ]
    },
    {
      id: 5,
      title: 'useLines и обработка больших файлов',
      type: 'theory',
      content: [
        { type: 'text', value: 'useLines предоставляет последовательность строк через Sequence — ленивые вычисления. Это позволяет обрабатывать файлы любого размера без загрузки в память.' },
        { type: 'code', language: 'kotlin', value: 'import java.io.File\n\nfun main() {\n    // Создаём тестовый файл с числами\n    val dataFile = File("numbers.txt")\n    dataFile.writeText((1..1000).joinToString("\\n"))\n\n    // useLines — ленивая обработка\n    val sum = dataFile.useLines { lines ->\n        lines\n            .map { it.toInt() }\n            .filter { it % 2 == 0 }  // только чётные\n            .sumOf { it.toLong() }\n    }\n    println("Сумма чётных от 1 до 1000: $sum")  // 250500\n\n    // Статистика без загрузки всего файла\n    val stats = dataFile.useLines { lines ->\n        var count = 0\n        var sum2 = 0L\n        lines.forEach { line ->\n            val n = line.toIntOrNull() ?: return@forEach\n            count++\n            sum2 += n\n        }\n        "Строк: $count, Сумма: $sum2, Среднее: ${if (count > 0) sum2 / count else 0}"\n    }\n    println(stats)\n\n    // Поиск в большом файле\n    val found = dataFile.useLines { lines ->\n        lines.filter { it.contains("42") }.toList()\n    }\n    println("Числа содержащие 42: $found")\n\n    dataFile.delete()\n}' },
        { type: 'note', value: 'useLines принимает блок, внутри которого доступна Sequence<String>. После завершения блока файл автоматически закрывается. Sequence ленива — обработка идёт строка за строкой без буферизации всего файла.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: CSV-обработчик',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай CSV-обработчик. Запиши файл products.csv с заголовком и 5 записями (name,price,category). Прочитай его, распарси в data class Product. Выведи товары по категориям, найди самый дорогой, посчитай среднюю цену. Запиши результаты в summary.txt.',
      requirements: [
        'Записать CSV: заголовок "name,price,category" и 5 строк',
        'data class Product(name, price: Double, category)',
        'Парсинг через readLines().drop(1).map { parseProduct(it) }',
        'Группировка по категории через groupBy',
        'Самый дорогой: maxByOrNull { it.price }',
        'Средняя цена: average()',
        'Запись summary.txt с итогами через printWriter'
      ],
      expectedOutput: '=== Товары по категориям ===\nЭлектроника:\n  Ноутбук: 75000.0 руб.\n  Телефон: 45000.0 руб.\nМебель:\n  Стол: 12000.0 руб.\n  Кресло: 15000.0 руб.\nКниги:\n  Kotlin в действии: 1500.0 руб.\n=== Статистика ===\nСамый дорогой: Ноутбук (75000.0 руб.)\nСредняя цена: 29700.0 руб.\nSummary записан в summary.txt',
      hint: 'parseProduct: split(",") даёт [name, price, category]. Price через toDouble(). groupBy { it.category }.forEach { (cat, products) -> } для вывода по группам. summary.txt через printWriter().use { pw -> pw.println(...) }.',
      solution: 'import java.io.File\n\ndata class Product(val name: String, val price: Double, val category: String)\n\nfun parseProduct(line: String): Product {\n    val parts = line.split(",")\n    return Product(parts[0].trim(), parts[1].trim().toDouble(), parts[2].trim())\n}\n\nfun main() {\n    val csvFile = File("products.csv")\n    csvFile.writeText(\n        "name,price,category\\n" +\n        "Ноутбук,75000.0,Электроника\\n" +\n        "Телефон,45000.0,Электроника\\n" +\n        "Стол,12000.0,Мебель\\n" +\n        "Кресло,15000.0,Мебель\\n" +\n        "Kotlin в действии,1500.0,Книги"\n    )\n\n    val products = csvFile.readLines().drop(1).map { parseProduct(it) }\n\n    println("=== Товары по категориям ===")\n    val byCategory = products.groupBy { it.category }.toSortedMap()\n    byCategory.forEach { (cat, prods) ->\n        println("$cat:")\n        prods.forEach { println("  ${it.name}: ${it.price} руб.") }\n    }\n\n    println("=== Статистика ===")\n    val mostExpensive = products.maxByOrNull { it.price }\n    val avgPrice = products.map { it.price }.average()\n    println("Самый дорогой: ${mostExpensive?.name} (${mostExpensive?.price} руб.)")\n    println("Средняя цена: $avgPrice руб.")\n\n    File("summary.txt").printWriter().use { pw ->\n        pw.println("Отчёт о товарах")\n        pw.println("Всего товаров: ${products.size}")\n        pw.println("Самый дорогой: ${mostExpensive?.name}")\n        pw.println("Средняя цена: $avgPrice")\n        byCategory.forEach { (cat, prods) ->\n            pw.println("$cat: ${prods.size} товаров")\n        }\n    }\n    println("Summary записан в summary.txt")\n\n    csvFile.delete()\n    File("summary.txt").delete()\n}',
      explanation: 'drop(1) пропускает заголовок CSV. groupBy создаёт Map<String, List<Product>>. toSortedMap() сортирует категории по алфавиту. maxByOrNull безопасно находит максимум (возвращает null для пустого списка). printWriter().use {} гарантирует закрытие файла через try-finally под капотом.'
    }
  ]
}
