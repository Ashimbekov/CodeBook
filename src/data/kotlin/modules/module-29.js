export default {
  id: 29,
  title: 'Практикум: Основы',
  description: 'Практические задачи по основам Kotlin: переменные, типы, условия, циклы, функции, null safety.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Температурный конвертер',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напишите функцию celsiusToFahrenheit, которая конвертирует градусы Цельсия в Фаренгейт по формуле: F = C * 9/5 + 32.',
      requirements: [
        'Функция принимает Double и возвращает Double',
        '0°C = 32°F',
        '100°C = 212°F',
        '-40°C = -40°F'
      ],
      expectedOutput: '32.0\n212.0\n-40.0',
      hint: 'Формула: fahrenheit = celsius * 9.0 / 5.0 + 32',
      solution: 'fun celsiusToFahrenheit(c: Double): Double = c * 9.0 / 5.0 + 32\n\nfun main() {\n    println(celsiusToFahrenheit(0.0))\n    println(celsiusToFahrenheit(100.0))\n    println(celsiusToFahrenheit(-40.0))\n}',
      explanation: 'Формула конвертации применяется напрямую. Деление 9.0/5.0 важно как Double, иначе целочисленное деление даст 1.'
    },
    {
      id: 2,
      title: 'Задача: Калькулятор BMI',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напишите функцию bmiCategory(weight: Double, height: Double): String. Возвращает "Недовес" (<18.5), "Норма" (18.5-24.9), "Избыточный вес" (25-29.9), "Ожирение" (>=30).',
      requirements: [
        'BMI = weight / (height * height)',
        'Четыре категории по формуле',
        'bmiCategory(70.0, 1.75) -> "Норма"',
        'bmiCategory(50.0, 1.80) -> "Недовес"'
      ],
      expectedOutput: 'Норма\nНедовес',
      hint: 'Вычислите bmi = weight / (height * height), затем используйте when с условиями.',
      solution: 'fun bmiCategory(weight: Double, height: Double): String {\n    val bmi = weight / (height * height)\n    return when {\n        bmi < 18.5 -> "Недовес"\n        bmi < 25.0 -> "Норма"\n        bmi < 30.0 -> "Избыточный вес"\n        else       -> "Ожирение"\n    }\n}\n\nfun main() {\n    println(bmiCategory(70.0, 1.75))\n    println(bmiCategory(50.0, 1.80))\n}',
      explanation: 'when без аргумента работает как цепочка if-else. Условия проверяются сверху вниз, выполняется первое совпавшее.'
    },
    {
      id: 3,
      title: 'Задача: FizzBuzz',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напечатайте числа от 1 до 100. Вместо кратных 3 — "Fizz", кратных 5 — "Buzz", кратных 15 — "FizzBuzz".',
      requirements: [
        'Числа от 1 до 100',
        'Кратные 15: "FizzBuzz"',
        'Кратные 3 (не 15): "Fizz"',
        'Кратные 5 (не 15): "Buzz"',
        'Остальные: само число'
      ],
      expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n...',
      hint: 'Проверяйте кратность 15 первым в when. Порядок важен!',
      solution: 'fun main() {\n    for (i in 1..100) {\n        println(when {\n            i % 15 == 0 -> "FizzBuzz"\n            i % 3  == 0 -> "Fizz"\n            i % 5  == 0 -> "Buzz"\n            else         -> i.toString()\n        })\n    }\n}',
      explanation: 'when без аргумента — элегантный способ решения FizzBuzz. Kotlin позволяет использовать when как выражение прямо в println.'
    },
    {
      id: 4,
      title: 'Задача: Числа Фибоначчи',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите функцию fibonacci(n: Int): List<Long>, возвращающую первые n чисел Фибоначчи.',
      requirements: [
        'fibonacci(1) = [0]',
        'fibonacci(2) = [0, 1]',
        'fibonacci(7) = [0, 1, 1, 2, 3, 5, 8]',
        'Используйте итеративный подход (не рекурсию)'
      ],
      expectedOutput: '[0, 1, 1, 2, 3, 5, 8]',
      hint: 'Создайте список, начните с [0L, 1L] и добавляйте сумму двух последних элементов.',
      solution: 'fun fibonacci(n: Int): List<Long> {\n    if (n <= 0) return emptyList()\n    if (n == 1) return listOf(0L)\n    val result = mutableListOf(0L, 1L)\n    while (result.size < n) {\n        result.add(result[result.size - 1] + result[result.size - 2])\n    }\n    return result\n}\n\nfun main() {\n    println(fibonacci(7))\n}',
      explanation: 'Итеративный подход эффективнее рекурсивного — нет накладных расходов на стек вызовов. result.size - 1 и size - 2 — индексы двух последних элементов.'
    },
    {
      id: 5,
      title: 'Задача: Палиндром',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напишите функцию isPalindrome(s: String): Boolean. Строка — палиндром, если читается одинаково слева и справа (игнорируя регистр и пробелы).',
      requirements: [
        'isPalindrome("racecar") = true',
        'isPalindrome("A man a plan a canal Panama") = true',
        'isPalindrome("hello") = false',
        'Игнорируйте пробелы и регистр'
      ],
      expectedOutput: 'true\ntrue\nfalse',
      hint: 'Отфильтруйте не-буквы, приведите к нижнему регистру, сравните с reversed().',
      solution: 'fun isPalindrome(s: String): Boolean {\n    val clean = s.filter { it.isLetter() }.lowercase()\n    return clean == clean.reversed()\n}\n\nfun main() {\n    println(isPalindrome("racecar"))\n    println(isPalindrome("A man a plan a canal Panama"))\n    println(isPalindrome("hello"))\n}',
      explanation: 'filter { it.isLetter() } оставляет только буквы. reversed() возвращает строку задом наперёд. Сравнение строк в Kotlin — по значению.'
    },
    {
      id: 6,
      title: 'Задача: Анаграмма',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите функцию isAnagram(a: String, b: String): Boolean — являются ли строки анаграммами (содержат одинаковые буквы в любом порядке, без учёта регистра).',
      requirements: [
        'isAnagram("listen", "silent") = true',
        'isAnagram("hello", "world") = false',
        'isAnagram("Astronomer", "Moon starer") = true (пробелы игнорируются)'
      ],
      expectedOutput: 'true\nfalse\ntrue',
      hint: 'Отсортируйте символы обеих строк и сравните. sorted() работает с CharArray.',
      solution: 'fun isAnagram(a: String, b: String): Boolean {\n    val clean = { s: String -> s.filter { it.isLetter() }.lowercase().toCharArray().also { it.sort() } }\n    return clean(a).contentEquals(clean(b))\n}\n\nfun main() {\n    println(isAnagram("listen", "silent"))\n    println(isAnagram("hello", "world"))\n    println(isAnagram("Astronomer", "Moon starer"))\n}',
      explanation: 'Анаграмма — отсортированные символы совпадают. contentEquals сравнивает массивы по содержимому, а не по ссылке.'
    },
    {
      id: 7,
      title: 'Задача: Подсчёт слов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите функцию wordCount(text: String): Map<String, Int>, возвращающую частоту каждого слова в тексте (без учёта регистра).',
      requirements: [
        'Разбить текст по пробелам',
        'Привести к нижнему регистру',
        'wordCount("one two one") = {"one": 2, "two": 1}'
      ],
      expectedOutput: '{one=2, two=1}',
      hint: 'split(" ") разбивает строку. groupingBy { it }.eachCount() считает частоту.',
      solution: 'fun wordCount(text: String): Map<String, Int> {\n    return text.trim().split("\\s+".toRegex())\n        .filter { it.isNotEmpty() }\n        .map { it.lowercase() }\n        .groupingBy { it }\n        .eachCount()\n}\n\nfun main() {\n    println(wordCount("one two one"))\n}',
      explanation: 'groupingBy + eachCount — идиоматический способ подсчёта частоты в Kotlin. split с regex разбивает по любому количеству пробелов.'
    },
    {
      id: 8,
      title: 'Задача: Null-цепочки',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан класс City(val name: String), Address(val city: City?), User(val address: Address?). Напишите функцию getCityName(user: User?): String — вернуть название города или "Неизвестно".',
      requirements: [
        'getCityName(null) = "Неизвестно"',
        'getCityName(User(null)) = "Неизвестно"',
        'getCityName(User(Address(City("Алматы")))) = "Алматы"',
        'Используйте только ?. и ?: без if'
      ],
      expectedOutput: 'Неизвестно\nАлматы',
      hint: 'Цепочка: user?.address?.city?.name ?: "Неизвестно"',
      solution: 'data class City(val name: String)\ndata class Address(val city: City?)\ndata class User(val address: Address?)\n\nfun getCityName(user: User?): String =\n    user?.address?.city?.name ?: "Неизвестно"\n\nfun main() {\n    println(getCityName(null))\n    println(getCityName(User(Address(City("Алматы")))))\n}',
      explanation: '?. возвращает null если левая часть null, не выбрасывая исключение. ?: — оператор Elvis, возвращает правое значение если левое null.'
    },
    {
      id: 9,
      title: 'Задача: Простые числа',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите функцию primesUpTo(n: Int): List<Int>, возвращающую все простые числа до n включительно с помощью решета Эратосфена.',
      requirements: [
        'primesUpTo(10) = [2, 3, 5, 7]',
        'primesUpTo(2) = [2]',
        'primesUpTo(1) = []'
      ],
      expectedOutput: '[2, 3, 5, 7]',
      hint: 'Создайте BooleanArray размером n+1, все true. Начните с 2, зачеркните кратные. Оставшиеся true — простые.',
      solution: 'fun primesUpTo(n: Int): List<Int> {\n    if (n < 2) return emptyList()\n    val sieve = BooleanArray(n + 1) { true }\n    sieve[0] = false; sieve[1] = false\n    for (i in 2..Math.sqrt(n.toDouble()).toInt()) {\n        if (sieve[i]) for (j in i * i..n step i) sieve[j] = false\n    }\n    return (2..n).filter { sieve[it] }\n}\n\nfun main() {\n    println(primesUpTo(10))\n}',
      explanation: 'Решето Эратосфена — классический алгоритм. Оптимизация: начинаем с i*i (меньшие кратные уже зачеркнуты) и проверяем только до sqrt(n).'
    },
    {
      id: 10,
      title: 'Задача: Калькулятор выражений',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте функцию calculate(a: Double, op: String, b: Double): Result<Double>, возвращающую результат операции (+, -, *, /) или ошибку.',
      requirements: [
        'calculate(10.0, "+", 5.0) = Success(15.0)',
        'calculate(10.0, "/", 0.0) = Failure("Деление на ноль")',
        'calculate(10.0, "%", 3.0) = Failure("Неизвестная операция: %")',
        'Используйте sealed class Result'
      ],
      expectedOutput: 'Success(15.0)\nFailure(Деление на ноль)',
      hint: 'Создайте sealed class Result<T> с подклассами Success<T> и Failure.',
      solution: 'sealed class Result<out T> {\n    data class Success<T>(val value: T) : Result<T>()\n    data class Failure(val error: String) : Result<Nothing>()\n}\n\nfun calculate(a: Double, op: String, b: Double): Result<Double> = when (op) {\n    "+" -> Result.Success(a + b)\n    "-" -> Result.Success(a - b)\n    "*" -> Result.Success(a * b)\n    "/" -> if (b == 0.0) Result.Failure("Деление на ноль") else Result.Success(a / b)\n    else -> Result.Failure("Неизвестная операция: $op")\n}\n\nfun main() {\n    println(calculate(10.0, "+", 5.0))\n    println(calculate(10.0, "/", 0.0))\n}',
      explanation: 'sealed class Result — типобезопасная альтернатива исключениям. Компилятор гарантирует полное покрытие всех случаев в when-выражении.'
    }
  ]
}
