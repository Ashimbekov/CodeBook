export default {
  id: 18,
  title: 'Обработка исключений',
  description: 'try-catch-finally, иерархия исключений Kotlin, создание собственных исключений, runCatching и функциональный стиль обработки ошибок',
  lessons: [
    {
      id: 1,
      title: 'try-catch-finally',
      type: 'theory',
      content: [
        { type: 'text', value: 'Исключение — сигнал об ошибке во время выполнения программы. В Kotlin все исключения непроверяемые (unchecked) — не нужно объявлять throws в сигнатуре метода.' },
        { type: 'code', language: 'kotlin', value: 'fun divide(a: Int, b: Int): Int {\n    return a / b  // бросит ArithmeticException если b == 0\n}\n\nfun main() {\n    // Базовый try-catch\n    try {\n        println(divide(10, 2))  // 5\n        println(divide(10, 0))  // ArithmeticException!\n    } catch (e: ArithmeticException) {\n        println("Ошибка: ${e.message}")  // / by zero\n    }\n\n    // Несколько catch\n    try {\n        val numbers = listOf(1, 2, 3)\n        val str = "не число"\n        println(numbers[10])       // IndexOutOfBoundsException\n        println(str.toInt())       // NumberFormatException\n    } catch (e: IndexOutOfBoundsException) {\n        println("Выход за пределы: ${e.message}")\n    } catch (e: NumberFormatException) {\n        println("Неверный формат: ${e.message}")\n    } catch (e: Exception) {\n        println("Общая ошибка: ${e.message}")\n    } finally {\n        println("finally выполняется всегда")\n    }\n}' },
        { type: 'heading', value: 'try как выражение' },
        { type: 'code', language: 'kotlin', value: 'fun main() {\n    // try-catch возвращает значение!\n    val number = try {\n        "42".toInt()\n    } catch (e: NumberFormatException) {\n        -1\n    }\n    println(number)  // 42\n\n    val invalid = try {\n        "abc".toInt()\n    } catch (e: NumberFormatException) {\n        -1\n    }\n    println(invalid)  // -1\n\n    // Краткая запись с Elvis\n    fun parseInt(s: String): Int? = s.toIntOrNull()\n    val result = parseInt("123") ?: 0\n    println(result)  // 123\n}' },
        { type: 'tip', value: 'В Kotlin try — выражение (expression), оно возвращает значение. Это позволяет писать val x = try { ... } catch { ... } без лишних переменных.' }
      ]
    },
    {
      id: 2,
      title: 'Иерархия исключений',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Kotlin/JVM иерархия исключений унаследована от Java. Throwable -> Error | Exception -> RuntimeException. Kotlin добавляет свои исключения.' },
        { type: 'list', items: [
          'Throwable — корень иерархии',
          'Error — серьёзные ошибки JVM (OutOfMemoryError, StackOverflowError) — обычно не перехватываются',
          'Exception — обычные исключения приложения',
          'RuntimeException — непроверяемые исключения: NullPointerException, IllegalArgumentException, IndexOutOfBoundsException',
          'IOException — проверяемые исключения ввода-вывода (в Kotlin можно не объявлять)'
        ]},
        { type: 'code', language: 'kotlin', value: 'fun main() {\n    // Часто встречаемые исключения\n    try {\n        val list = mutableListOf<Int>()\n        list[0]  // IndexOutOfBoundsException\n    } catch (e: IndexOutOfBoundsException) {\n        println("1. Список пуст: ${e.javaClass.simpleName}")\n    }\n\n    try {\n        val map = mapOf("a" to 1)\n        checkNotNull(map["b"]) { "Ключ не найден" }\n    } catch (e: IllegalStateException) {\n        println("2. ${e.message}")  // Ключ не найден\n    }\n\n    try {\n        require(false) { "Условие нарушено" }\n    } catch (e: IllegalArgumentException) {\n        println("3. ${e.message}")  // Условие нарушено\n    }\n\n    try {\n        error("Критическая ошибка")\n    } catch (e: IllegalStateException) {\n        println("4. ${e.message}")  // Критическая ошибка\n    }\n\n    // check и require — встроенные проверки\n    fun setAge(age: Int) {\n        require(age >= 0) { "Возраст не может быть отрицательным: $age" }\n        require(age <= 150) { "Нереальный возраст: $age" }\n        println("Возраст установлен: $age")\n    }\n    setAge(25)\n    try { setAge(-5) } catch (e: IllegalArgumentException) { println("5. ${e.message}") }\n}' }
      ]
    },
    {
      id: 3,
      title: 'Собственные исключения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Создание собственных исключений делает код выразительнее — ошибки имеют осмысленные имена и могут нести дополнительную информацию.' },
        { type: 'code', language: 'kotlin', value: '// Базовое пользовательское исключение\nclass ValidationException(message: String) : Exception(message)\n\n// С дополнительными полями\nclass InsufficientFundsException(\n    val available: Double,\n    val required: Double\n) : Exception("Недостаточно средств: нужно $required, доступно $available")\n\n// Иерархия пользовательских исключений\nopen class AppException(message: String, cause: Throwable? = null) : Exception(message, cause)\nclass DatabaseException(message: String, cause: Throwable? = null) : AppException(message, cause)\nclass NetworkException(val code: Int, message: String) : AppException("HTTP $code: $message")\nclass AuthException(val userId: Int) : AppException("Пользователь $userId не авторизован")\n\nfun main() {\n    try {\n        throw ValidationException("Email не может быть пустым")\n    } catch (e: ValidationException) {\n        println("Ошибка валидации: ${e.message}")\n    }\n\n    try {\n        throw InsufficientFundsException(500.0, 1000.0)\n    } catch (e: InsufficientFundsException) {\n        println("${e.message}")\n        println("Не хватает: ${e.required - e.available} руб.")\n    }\n\n    // Перехват по иерархии\n    fun riskyOperation(type: String): Unit = when (type) {\n        "db" -> throw DatabaseException("Соединение разорвано")\n        "net" -> throw NetworkException(503, "Сервис недоступен")\n        "auth" -> throw AuthException(42)\n        else -> println("OK")\n    }\n\n    listOf("db", "net", "auth", "ok").forEach { type ->\n        try { riskyOperation(type) }\n        catch (e: AppException) { println("AppException: ${e.message}") }\n    }\n}' },
        { type: 'tip', value: 'Называй исключения так, чтобы было понятно, что пошло не так: InsufficientFundsException лучше чем MyException. Добавляй поля с деталями ошибки.' }
      ]
    },
    {
      id: 4,
      title: 'runCatching и Result',
      type: 'theory',
      content: [
        { type: 'text', value: 'runCatching — функциональный способ обработки исключений. Возвращает Result<T> — либо успех со значением, либо неудачу с исключением.' },
        { type: 'code', language: 'kotlin', value: 'fun riskyParse(input: String): Int = input.toInt()\n\nfun main() {\n    // runCatching перехватывает исключения\n    val result1 = runCatching { riskyParse("42") }\n    val result2 = runCatching { riskyParse("abc") }\n\n    println(result1.isSuccess)  // true\n    println(result2.isFailure)  // true\n    println(result1.getOrNull())  // 42\n    println(result2.getOrNull())  // null\n    println(result2.getOrDefault(-1))  // -1\n    println(result1.getOrElse { 0 })   // 42\n\n    // Обработка через fold\n    result1.fold(\n        onSuccess = { println("Успех: $it") },\n        onFailure = { println("Ошибка: ${it.message}") }\n    )\n\n    // Цепочка операций\n    val processed = runCatching { "  123  ".trim().toInt() }\n        .map { it * 2 }           // преобразуем успех\n        .recover { 0 }            // восстановление при ошибке\n        .getOrDefault(0)\n    println("Обработано: $processed")  // 246\n}' },
        { type: 'code', language: 'kotlin', value: '// Практический пример — сетевой запрос\ndata class ApiResponse(val data: String, val status: Int)\n\nfun fetchData(url: String): ApiResponse {\n    if (url.isEmpty()) throw IllegalArgumentException("URL пуст")\n    if (url.contains("error")) throw RuntimeException("Сервер вернул ошибку")\n    return ApiResponse("Данные успешно получены", 200)\n}\n\nfun safeRequest(url: String): String {\n    return runCatching { fetchData(url) }\n        .fold(\n            onSuccess = { "OK: ${it.data}" },\n            onFailure = { "FAIL: ${it.message}" }\n        )\n}\n\nfun main() {\n    println(safeRequest("https://api.example.com"))       // OK: Данные успешно получены\n    println(safeRequest(""))                               // FAIL: URL пуст\n    println(safeRequest("https://error.example.com"))     // FAIL: Сервер вернул ошибку\n}' },
        { type: 'tip', value: 'runCatching + fold — идиоматический функциональный стиль обработки ошибок в Kotlin. Особенно удобен при работе с корутинами.' }
      ]
    },
    {
      id: 5,
      title: 'throw как выражение и nothing',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Kotlin throw — выражение типа Nothing. Nothing — тип без значений, подтип любого типа. Это позволяет использовать throw в любом месте, где ожидается значение.' },
        { type: 'code', language: 'kotlin', value: 'fun fail(message: String): Nothing {\n    throw IllegalStateException(message)\n}\n\nfun main() {\n    // throw в Elvis-операторе\n    val name: String? = null\n    val safeName = name ?: throw IllegalArgumentException("Имя не может быть null")\n\n    // throw в when\n    fun dayName(day: Int): String = when (day) {\n        1 -> "Понедельник"\n        2 -> "Вторник"\n        3 -> "Среда"\n        4 -> "Четверг"\n        5 -> "Пятница"\n        6 -> "Суббота"\n        7 -> "Воскресенье"\n        else -> throw IllegalArgumentException("Неверный день: $day")\n    }\n\n    println(dayName(3))  // Среда\n    try { println(dayName(8)) } catch (e: IllegalArgumentException) { println(e.message) }\n\n    // TODO() и error() тоже возвращают Nothing\n    fun notImplemented(): String = TODO("Реализация в следующей версии")\n    try { notImplemented() } catch (e: NotImplementedError) { println("Не реализовано") }\n\n    // error() — бросает IllegalStateException\n    fun assertPositive(n: Int) = if (n > 0) n else error("Ожидалось положительное число")\n    println(assertPositive(5))  // 5\n    try { assertPositive(-1) } catch (e: IllegalStateException) { println(e.message) }\n}' },
        { type: 'note', value: 'Nothing — тип, у которого нет значений. Функция с возвращаемым типом Nothing гарантированно не возвращает управление нормально — она либо бросает исключение, либо зависает. Компилятор использует это для анализа кода.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Безопасный парсер',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай класс SafeParser с методами parseDate(s: String): LocalDate? и parseJson(s: String): Map<String, String>. parseDate парсит строку формата "YYYY-MM-DD", parseJson парсит простой JSON вида {"key": "value"}. Оба метода используют runCatching и не бросают исключений. Добавь метод validate(data: Map<String, String>, required: List<String>): Result<Map<String, String>>.',
      requirements: [
        'parseDate возвращает null при ошибке, использует runCatching',
        'parseJson парсит {"name": "Анна", "age": "25"} формат через split/trim',
        'validate проверяет наличие обязательных ключей, возвращает Result',
        'При отсутствии ключа — Failure с ValidationException',
        'Протестировать корректные и некорректные входные данные'
      ],
      expectedOutput: '2024-03-15: верно\nнекорректная дата: null\nПарсинг JSON: {name=Анна, age=25, city=Москва}\nВалидация успешна: {name=Анна, age=25, city=Москва}\nВалидация провалена: Отсутствует обязательное поле: email',
      hint: 'Для parseDate используй runCatching { java.time.LocalDate.parse(s) }.getOrNull(). Для parseJson: убери { }, split по ",", каждую пару split по ":", убери кавычки через replace.',
      solution: 'class ValidationException(message: String) : Exception(message)\n\nobject SafeParser {\n    fun parseDate(s: String): java.time.LocalDate? {\n        return runCatching { java.time.LocalDate.parse(s) }.getOrNull()\n    }\n\n    fun parseJson(s: String): Map<String, String> {\n        return runCatching {\n            s.trim()\n             .removePrefix("{")\n             .removeSuffix("}")\n             .split(",")\n             .associate { pair ->\n                 val (key, value) = pair.split(":")\n                 key.trim().trim(\'"\') to value.trim().trim(\'"\')\n             }\n        }.getOrDefault(emptyMap())\n    }\n\n    fun validate(\n        data: Map<String, String>,\n        required: List<String>\n    ): Result<Map<String, String>> {\n        val missing = required.firstOrNull { it !in data }\n        return if (missing != null) {\n            Result.failure(ValidationException("Отсутствует обязательное поле: $missing"))\n        } else {\n            Result.success(data)\n        }\n    }\n}\n\nfun main() {\n    println("2024-03-15: ${if (SafeParser.parseDate("2024-03-15") != null) "верно" else "null"}")\n    println("некорректная дата: ${SafeParser.parseDate("не дата")}")\n\n    val json = SafeParser.parseJson(\'{"name": "Анна", "age": "25", "city": "Москва"}\')\n    println("Парсинг JSON: $json")\n\n    SafeParser.validate(json, listOf("name", "age", "city")).fold(\n        onSuccess = { println("Валидация успешна: $it") },\n        onFailure = { println("Валидация провалена: ${it.message}") }\n    )\n\n    SafeParser.validate(json, listOf("name", "email")).fold(\n        onSuccess = { println("Успех: $it") },\n        onFailure = { println("Валидация провалена: ${it.message}") }\n    )\n}',
      explanation: 'runCatching обёртывает потенциально опасный код и возвращает Result. getOrNull() и getOrDefault() — удобные методы для извлечения значения без бросания исключений. Result.success() и Result.failure() создают объекты результата напрямую. fold() обрабатывает оба случая в одном месте.'
    }
  ]
}
