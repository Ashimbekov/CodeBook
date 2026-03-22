export default {
  id: 15,
  title: 'Лямбды и ФВП',
  description: 'Лямбда-выражения, функции высшего порядка, типы функций, встроенные функции map/filter/reduce, замыкания и функциональное программирование в Kotlin',
  lessons: [
    {
      id: 1,
      title: 'Лямбда-выражения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Лямбда-выражение — анонимная функция, которую можно хранить в переменной и передавать как аргумент. Синтаксис: { параметры -> тело }.' },
        { type: 'code', language: 'kotlin', value: 'fun main() {\n    // Простая лямбда\n    val greet = { name: String -> "Привет, $name!" }\n    println(greet("Аня"))  // Привет, Аня!\n\n    // Лямбда с несколькими параметрами\n    val add = { a: Int, b: Int -> a + b }\n    println(add(3, 5))  // 8\n\n    // Лямбда без параметров\n    val sayHello = { println("Привет!") }\n    sayHello()  // Привет!\n\n    // it — неявное имя единственного параметра\n    val double = { x: Int -> x * 2 }\n    val doubleShort: (Int) -> Int = { it * 2 }  // то же самое\n    println(double(5))      // 10\n    println(doubleShort(5)) // 10\n}' },
        { type: 'heading', value: 'Типы функций' },
        { type: 'code', language: 'kotlin', value: 'fun main() {\n    // (InputType) -> OutputType\n    val isEven: (Int) -> Boolean = { it % 2 == 0 }\n    val square: (Int) -> Int = { it * it }\n    val greet: (String) -> String = { "Привет, $it!" }\n\n    // () -> Unit — без параметров, без возврата\n    val action: () -> Unit = { println("Действие!") }\n\n    // (Int, Int) -> Int — два параметра\n    val multiply: (Int, Int) -> Int = { a, b -> a * b }\n\n    println(isEven(4))      // true\n    println(square(7))      // 49\n    println(greet("Иван"))  // Привет, Иван!\n    action()                // Действие!\n    println(multiply(3, 4)) // 12\n}' },
        { type: 'tip', value: 'Тип (Int) -> Boolean читается как "функция, принимающая Int и возвращающая Boolean". Это полноценный тип в Kotlin, как Int или String.' }
      ]
    },
    {
      id: 2,
      title: 'Функции высшего порядка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функция высшего порядка (ФВП) — функция, которая принимает другую функцию как параметр или возвращает функцию. Это основа функционального программирования.' },
        { type: 'code', language: 'kotlin', value: '// Функция принимает другую функцию как параметр\nfun applyTwice(x: Int, f: (Int) -> Int): Int {\n    return f(f(x))\n}\n\n// Функция возвращает функцию\nfun multiplier(factor: Int): (Int) -> Int {\n    return { number -> number * factor }\n}\n\nfun main() {\n    println(applyTwice(3, { it + 1 }))  // (3+1)+1 = 5\n    println(applyTwice(2, { it * 2 }))  // (2*2)*2 = 8\n\n    val triple = multiplier(3)\n    val quadruple = multiplier(4)\n    println(triple(5))    // 15\n    println(quadruple(5)) // 20\n\n    // Trailing lambda — лямбда вне скобок\n    println(applyTwice(10) { it - 3 })  // (10-3)-3 = 4\n}' },
        { type: 'heading', value: 'Trailing lambda' },
        { type: 'code', language: 'kotlin', value: '// Если последний параметр — функция, лямбду можно вынести за скобки\nfun repeat(times: Int, action: () -> Unit) {\n    for (i in 1..times) action()\n}\n\nfun transform(list: List<Int>, op: (Int) -> Int): List<Int> {\n    return list.map { op(it) }\n}\n\nfun main() {\n    // Обычный вызов\n    repeat(3, { println("Привет!") })\n\n    // Trailing lambda — чище\n    repeat(3) {\n        println("Привет!")\n    }\n\n    val nums = listOf(1, 2, 3, 4, 5)\n    val doubled = transform(nums) { it * 2 }\n    println(doubled)  // [2, 4, 6, 8, 10]\n}' },
        { type: 'tip', value: 'Trailing lambda — стандартный идиоматический стиль Kotlin. Именно поэтому блоки кода вроде repeat(3) { } выглядят как встроенные конструкции языка.' }
      ]
    },
    {
      id: 3,
      title: 'map, filter, reduce',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стандартная библиотека Kotlin предоставляет мощные ФВП для работы с коллекциями: map преобразует, filter отбирает, reduce/fold агрегирует.' },
        { type: 'code', language: 'kotlin', value: 'fun main() {\n    val numbers = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)\n\n    // map — преобразование каждого элемента\n    val squared = numbers.map { it * it }\n    println("Квадраты: $squared")  // [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]\n\n    // filter — отбор по условию\n    val evens = numbers.filter { it % 2 == 0 }\n    println("Чётные: $evens")  // [2, 4, 6, 8, 10]\n\n    // reduce — свёртка в одно значение\n    val sum = numbers.reduce { acc, n -> acc + n }\n    println("Сумма: $sum")  // 55\n\n    // fold — reduce с начальным значением\n    val product = numbers.fold(1L) { acc, n -> acc * n }\n    println("Произведение: $product")  // 3628800\n\n    // Цепочка операций\n    val result = numbers\n        .filter { it % 2 == 0 }\n        .map { it * it }\n        .reduce { acc, n -> acc + n }\n    println("Сумма квадратов чётных: $result")  // 220\n}' },
        { type: 'heading', value: 'Другие полезные функции' },
        { type: 'code', language: 'kotlin', value: 'fun main() {\n    val words = listOf("kotlin", "java", "python", "swift", "go")\n\n    // any — есть ли хоть один подходящий\n    println(words.any { it.length > 5 })   // true\n\n    // all — все ли подходят\n    println(words.all { it.length > 2 })   // true\n\n    // none — ни один не подходит\n    println(words.none { it.length > 10 }) // true\n\n    // count — сколько подходят\n    println(words.count { it.length == 4 }) // 2 (java, swift нет, go нет... kotlin=6, java=4, python=6, swift=5, go=2)\n\n    // find — первый подходящий или null\n    println(words.find { it.startsWith("k") })  // kotlin\n\n    // groupBy — разбить на группы\n    val byLength = words.groupBy { it.length }\n    byLength.forEach { (len, ws) -> println("Длина $len: $ws") }\n\n    // sortedBy — сортировка\n    println(words.sortedBy { it.length })\n}' }
      ]
    },
    {
      id: 4,
      title: 'Замыкания',
      type: 'theory',
      content: [
        { type: 'text', value: 'Замыкание — лямбда, которая захватывает переменные из окружающего контекста. В Kotlin лямбды могут захватывать и изменять var-переменные — это отличие от Java.' },
        { type: 'code', language: 'kotlin', value: 'fun makeCounter(start: Int = 0): () -> Int {\n    var count = start  // захватывается лямбдой\n    return {\n        count++  // изменяем захваченную переменную\n        count\n    }\n}\n\nfun main() {\n    val counter1 = makeCounter()\n    val counter2 = makeCounter(10)\n\n    println(counter1())  // 1\n    println(counter1())  // 2\n    println(counter1())  // 3\n    println(counter2())  // 11\n    println(counter2())  // 12\n\n    // Две переменные — два независимых замыкания\n    println("counter1 снова: ${counter1()}")  // 4\n}' },
        { type: 'code', language: 'kotlin', value: '// Захват изменяемого состояния\nfun buildAdder(base: Int): (Int) -> Int {\n    return { x -> base + x }\n}\n\nfun main() {\n    val add5 = buildAdder(5)\n    val add10 = buildAdder(10)\n\n    println(add5(3))   // 8\n    println(add10(3))  // 13\n    println(add5(7))   // 12\n\n    // Мемоизация через замыкание\n    fun memoize(f: (Int) -> Int): (Int) -> Int {\n        val cache = mutableMapOf<Int, Int>()\n        return { n ->\n            cache.getOrPut(n) { f(n) }\n        }\n    }\n\n    var callCount = 0\n    val slowSquare: (Int) -> Int = { n ->\n        callCount++\n        n * n\n    }\n    val fastSquare = memoize(slowSquare)\n\n    println(fastSquare(5))  // 25 (вычислено)\n    println(fastSquare(5))  // 25 (из кэша)\n    println(fastSquare(3))  // 9 (вычислено)\n    println("Вызовов: $callCount")  // 2\n}' },
        { type: 'warning', value: 'Будь осторожен с захватом большого объёма данных в замыкании — это может привести к утечкам памяти, если лямбда хранится долго.' }
      ]
    },
    {
      id: 5,
      title: 'Inline функции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функции высшего порядка создают объекты-лямбды и могут влиять на производительность. Inline-функция подставляет своё тело прямо в место вызова — нет накладных расходов на создание объекта.' },
        { type: 'code', language: 'kotlin', value: '// Без inline — создаётся объект лямбды\nfun <T> measureTime(block: () -> T): T {\n    val start = System.currentTimeMillis()\n    val result = block()\n    println("Время: ${System.currentTimeMillis() - start} мс")\n    return result\n}\n\n// С inline — код лямбды вставляется в место вызова\ninline fun <T> measureTimeInline(block: () -> T): T {\n    val start = System.currentTimeMillis()\n    val result = block()\n    println("Время: ${System.currentTimeMillis() - start} мс")\n    return result\n}\n\nfun main() {\n    val result = measureTimeInline {\n        (1..1_000_000).sum()\n    }\n    println("Результат: $result")\n}' },
        { type: 'tip', value: 'Стандартная библиотека Kotlin (map, filter, forEach и т.д.) использует inline — поэтому работа с коллекциями через лямбды не медленнее явных циклов.' },
        { type: 'code', language: 'kotlin', value: '// noinline — конкретный параметр не встраивается\ninline fun process(action: () -> Unit, noinline callback: () -> Unit) {\n    action()          // встроится в место вызова\n    storeCallback(callback)  // можно сохранить в переменную\n}\n\nvar storedCallback: (() -> Unit)? = null\nfun storeCallback(cb: () -> Unit) { storedCallback = cb }\n\nfun main() {\n    process(\n        action = { println("Действие выполнено") },\n        callback = { println("Коллбэк вызван") }\n    )\n    storedCallback?.invoke()\n}' },
        { type: 'note', value: 'inline применяй для функций высшего порядка, которые вызываются часто. Для редко вызываемых функций inline даёт увеличение размера кода без значимой пользы.' }
      ]
    },
    {
      id: 6,
      title: 'Ссылки на функции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ссылка на функцию (function reference) позволяет передавать существующую функцию туда, где ожидается лямбда. Синтаксис: ::functionName.' },
        { type: 'code', language: 'kotlin', value: 'fun isEven(n: Int) = n % 2 == 0\nfun double(n: Int) = n * 2\nfun printItem(s: String) = println("-> $s")\n\nfun main() {\n    val numbers = listOf(1, 2, 3, 4, 5, 6)\n\n    // ::isEven вместо { it % 2 == 0 }\n    val evens = numbers.filter(::isEven)\n    println(evens)  // [2, 4, 6]\n\n    // ::double вместо { it * 2 }\n    val doubled = evens.map(::double)\n    println(doubled)  // [4, 8, 12]\n\n    // Ссылка на метод класса\n    val words = listOf("kotlin", "java", "go")\n    words.forEach(::printItem)\n    // -> kotlin\n    // -> java\n    // -> go\n\n    // Ссылка на метод экземпляра\n    val strings = listOf("  kotlin  ", " java ", "go")\n    val trimmed = strings.map(String::trim)\n    println(trimmed)  // [kotlin, java, go]\n\n    // Ссылка на конструктор\n    val names = listOf("Анна", "Борис", "Вера")\n    // data class User(val name: String)\n    // val users = names.map(::User)\n}' },
        { type: 'tip', value: 'Ссылки на функции делают код лаконичнее, когда логика уже вынесена в отдельную функцию. Используй их вместо { x -> myFunction(x) }.' }
      ]
    },
    {
      id: 7,
      title: 'Функциональные интерфейсы (SAM)',
      type: 'theory',
      content: [
        { type: 'text', value: 'SAM (Single Abstract Method) — интерфейс с одним абстрактным методом. Kotlin позволяет передавать лямбду вместо реализации такого интерфейса. Для своих интерфейсов используй fun interface.' },
        { type: 'code', language: 'kotlin', value: '// fun interface — SAM в Kotlin\nfun interface Validator<T> {\n    fun validate(value: T): Boolean\n}\n\nfun interface Transformer<T, R> {\n    fun transform(value: T): R\n}\n\nfun <T> filter(list: List<T>, validator: Validator<T>): List<T> {\n    return list.filter { validator.validate(it) }\n}\n\nfun main() {\n    // Передаём лямбду напрямую\n    val numbers = listOf(1, -2, 3, -4, 5)\n    val positives = filter(numbers, Validator { it > 0 })\n    println(positives)  // [1, 3, 5]\n\n    // Или без явного имени типа — SAM conversion\n    val evenValidator: Validator<Int> = Validator { it % 2 == 0 }\n    val evens = filter(numbers, evenValidator)\n    println(evens)  // [-2, -4]\n\n    // Transformer\n    val toString: Transformer<Int, String> = Transformer { "Число: $it" }\n    println(toString.transform(42))  // Число: 42\n}' },
        { type: 'note', value: 'fun interface — нововведение Kotlin 1.4. До этого SAM conversion работала только с Java-интерфейсами. Теперь можно использовать и для Kotlin-интерфейсов с пометкой fun.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Конвейер обработки данных',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай конвейер обработки списка сотрудников. Data class Employee(name, department, salary). Список из 8 сотрудников из разных отделов. Используя map/filter/groupBy/sortedBy найди: 1) всех из IT с зарплатой > 80000, 2) среднюю зарплату по отделам, 3) топ-3 самых высокооплачиваемых.',
      requirements: [
        'data class Employee(val name: String, val department: String, val salary: Int)',
        'Минимум 8 сотрудников: IT, HR, Finance отделы',
        'Фильтр IT с зарплатой > 80000 через filter',
        'Средняя зарплата по отделам через groupBy + mapValues',
        'Топ-3 через sortedByDescending + take(3)',
        'Вывод в читаемом формате'
      ],
      expectedOutput: 'IT с зарплатой > 80000:\n  Алексей: 95000\n  Мария: 110000\nСредняя зарплата по отделам:\n  Finance: 72500\n  HR: 65000\n  IT: 91667\nТоп-3 по зарплате:\n  1. Мария (IT): 110000\n  2. Алексей (IT): 95000\n  3. Дмитрий (IT): 85000',
      hint: 'groupBy возвращает Map<String, List<Employee>>. Применив mapValues к нему, можно преобразовать каждый список — например вычислить среднее через map { it.salary }.average().toInt().',
      solution: 'data class Employee(val name: String, val department: String, val salary: Int)\n\nfun main() {\n    val employees = listOf(\n        Employee("Алексей", "IT", 95000),\n        Employee("Мария", "IT", 110000),\n        Employee("Дмитрий", "IT", 85000),\n        Employee("Ольга", "IT", 76000),\n        Employee("Наталья", "HR", 65000),\n        Employee("Сергей", "HR", 65000),\n        Employee("Ирина", "Finance", 70000),\n        Employee("Павел", "Finance", 75000)\n    )\n\n    val itHighPaid = employees.filter { it.department == "IT" && it.salary > 80000 }\n    println("IT с зарплатой > 80000:")\n    itHighPaid.forEach { println("  ${it.name}: ${it.salary}") }\n\n    val avgByDept = employees\n        .groupBy { it.department }\n        .mapValues { (_, emps) -> emps.map { it.salary }.average().toInt() }\n        .toSortedMap()\n    println("Средняя зарплата по отделам:")\n    avgByDept.forEach { (dept, avg) -> println("  $dept: $avg") }\n\n    val top3 = employees.sortedByDescending { it.salary }.take(3)\n    println("Топ-3 по зарплате:")\n    top3.forEachIndexed { i, emp -> println("  ${i + 1}. ${emp.name} (${emp.department}): ${emp.salary}") }\n}',
      explanation: 'groupBy разбивает список на карту по ключу. mapValues применяет функцию к каждому значению карты, сохраняя ключи. toSortedMap() сортирует по ключу. sortedByDescending сортирует по убыванию. take(n) берёт первые n элементов. Цепочка этих операций — мощный функциональный конвейер.'
    }
  ]
}
