export default {
  id: 6,
  title: 'Функции',
  description: 'Объявление функций, параметры по умолчанию, именованные аргументы, функции-выражения',
  lessons: [
    {
      id: 1,
      title: 'Объявление и вызов функций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функция — именованный блок кода, который можно вызвать в любом месте программы. В Kotlin функции объявляются ключевым словом fun.' },
        { type: 'code', language: 'kotlin', value: '// Функция без параметров и возвращаемого значения\nfun sayHello() {\n    println("Привет!")\n}\n\n// Функция с параметрами\nfun greet(name: String) {\n    println("Привет, $name!")\n}\n\n// Функция с возвращаемым значением\nfun add(a: Int, b: Int): Int {\n    return a + b\n}\n\nfun main() {\n    sayHello()           // Привет!\n    greet("Нурдаулет")  // Привет, Нурдаулет!\n    println(add(3, 5))  // 8\n}' },
        { type: 'tip', value: 'Функция как рецепт блюда: название (greet), ингредиенты (name: String), результат (что получится). Написал рецепт один раз — готовишь сколько угодно.' },
        { type: 'note', value: 'Если функция не возвращает значение, тип возврата — Unit. Писать ": Unit" необязательно — это тип по умолчанию. Unit — аналог void в Java.' }
      ]
    },
    {
      id: 2,
      title: 'Параметры по умолчанию',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Kotlin параметры функции могут иметь значения по умолчанию. Это одна из самых удобных фич — не нужно создавать множество перегрузок функции.' },
        { type: 'code', language: 'kotlin', value: 'fun greet(name: String, greeting: String = "Привет") {\n    println("$greeting, $name!")\n}\n\nfun main() {\n    greet("Нурдаулет")              // Привет, Нурдаулет!\n    greet("Нурдаулет", "Здравствуй") // Здравствуй, Нурдаулет!\n    greet("Мир", "Привет")          // Привет, Мир!\n}' },
        { type: 'heading', value: 'Несколько параметров с дефолтными значениями' },
        { type: 'code', language: 'kotlin', value: 'fun createUser(\n    name: String,\n    age: Int = 18,\n    isAdmin: Boolean = false,\n    role: String = "user"\n) {\n    println("Создан пользователь: $name, возраст: $age, роль: $role, admin: $isAdmin")\n}\n\nfun main() {\n    createUser("Нурдаулет")\n    // Создан пользователь: Нурдаулет, возраст: 18, роль: user, admin: false\n    \n    createUser("Админ", isAdmin = true, role = "admin")\n    // Создан пользователь: Админ, возраст: 18, роль: admin, admin: true\n}' },
        { type: 'tip', value: 'Сравни с Java: для таких же вариантов вызова пришлось бы создать 4 перегрузки метода. В Kotlin одна функция с дефолтными параметрами заменяет всё это.' }
      ]
    },
    {
      id: 3,
      title: 'Именованные аргументы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Именованные аргументы позволяют передавать аргументы в любом порядке, явно указывая имя параметра. Это делает код самодокументируемым.' },
        { type: 'code', language: 'kotlin', value: 'fun sendEmail(to: String, subject: String, body: String, isHtml: Boolean = false) {\n    println("Кому: $to")\n    println("Тема: $subject")\n    println("Тело: $body")\n    println("HTML: $isHtml")\n}\n\nfun main() {\n    // Позиционный вызов — нужно помнить порядок параметров\n    sendEmail("user@mail.ru", "Привет", "Как дела?", true)\n    \n    // Именованный вызов — всё понятно!\n    sendEmail(\n        to = "user@mail.ru",\n        subject = "Привет",\n        body = "Как дела?",\n        isHtml = true\n    )\n    \n    // Можно менять порядок\n    sendEmail(\n        body = "Как дела?",\n        to = "user@mail.ru",\n        subject = "Привет"\n    )\n}' },
        { type: 'note', value: 'Именованные аргументы особенно полезны для Boolean параметров. sendEmail(..., true) — непонятно что true. sendEmail(..., isHtml = true) — всё ясно.' }
      ]
    },
    {
      id: 4,
      title: 'Функции-выражения (Single-expression functions)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Если функция состоит из одного выражения, можно записать её в одну строку через =. Kotlin сам выведет тип возврата.' },
        { type: 'code', language: 'kotlin', value: '// Обычная функция\nfun add(a: Int, b: Int): Int {\n    return a + b\n}\n\n// Функция-выражение — то же самое, одной строкой!\nfun add2(a: Int, b: Int) = a + b\n\n// Другие примеры:\nfun square(x: Int) = x * x\nfun isEven(n: Int) = n % 2 == 0\nfun max(a: Int, b: Int) = if (a > b) a else b\nfun greet(name: String) = "Привет, $name!"\n\nfun main() {\n    println(add2(3, 4))    // 7\n    println(square(5))     // 25\n    println(isEven(10))    // true\n    println(max(7, 3))     // 7\n    println(greet("Kotlin")) // Привет, Kotlin!\n}' },
        { type: 'tip', value: 'Функция-выражение как математическая формула: f(x) = x * x. Видишь = — значит функция просто вычисляет одно выражение. Очень читаемо.' },
        { type: 'warning', value: 'Не злоупотребляй функциями-выражениями для сложной логики! Они хороши для простых вычислений. Если тело функции требует нескольких шагов — используй обычную форму с {}.' }
      ]
    },
    {
      id: 5,
      title: 'Возврат нескольких значений и Unit',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функция может возвращать только одно значение. Но через Pair или тройку Triple можно "вернуть" несколько значений.' },
        { type: 'code', language: 'kotlin', value: '// Пара значений\nfun minMax(list: List<Int>): Pair<Int, Int> {\n    return Pair(list.min(), list.max())\n}\n\nfun main() {\n    val (min, max) = minMax(listOf(3, 1, 7, 2, 9, 4))\n    println("Мин: $min, Макс: $max")  // Мин: 1, Макс: 9\n}' },
        { type: 'heading', value: 'Unit — функция без результата' },
        { type: 'code', language: 'kotlin', value: '// Обе записи эквивалентны:\nfun printInfo(name: String): Unit {\n    println("Имя: $name")\n}\n\nfun printInfo2(name: String) {  // Unit не пишем\n    println("Имя: $name")\n}' },
        { type: 'tip', value: 'Pair — как контейнер для двух вещей. Деструктуризация val (min, max) = ... — распаковываем пару в две отдельные переменные. Очень удобно!' },
        { type: 'note', value: 'В Kotlin функции — это объекты первого класса. Их можно хранить в переменных, передавать как параметры. Подробнее об этом в модуле про лямбды и функции высшего порядка.' }
      ]
    },
    {
      id: 6,
      title: 'Область видимости и локальные функции',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Kotlin функции можно объявлять внутри других функций — это локальные функции. Они видны только внутри содержащей функции.' },
        { type: 'code', language: 'kotlin', value: 'fun processData(data: List<Int>): Int {\n    // Локальная функция — видна только здесь\n    fun isValid(n: Int) = n > 0 && n < 1000\n    \n    return data.filter { isValid(it) }.sum()\n}\n\nfun main() {\n    println(processData(listOf(10, -5, 500, 2000, 100)))\n    // 610 (10 + 500 + 100)\n    \n    // isValid(5)  // ОШИБКА! isValid не видна здесь\n}' },
        { type: 'tip', value: 'Локальные функции — как внутренний помощник. Он помогает только своему "хозяину" и не доступен снаружи. Это помогает организовать код и скрыть детали реализации.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Функции расчётов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай набор функций для расчёта площадей геометрических фигур.',
      requirements: [
        'Функция circleArea(radius: Double): Double — площадь круга (π * r²)',
        'Функция rectangleArea(width: Double, height: Double = width): Double — площадь прямоугольника (по умолчанию квадрат)',
        'Функция triangleArea(base: Double, height: Double): Double — площадь треугольника',
        'Вызови все три функции и выведи результаты'
      ],
      expectedOutput: 'Площадь круга (r=5): 78.53981633974483\nПлощадь прямоугольника (4x6): 24.0\nПлощадь квадрата (5x5): 25.0\nПлощадь треугольника (основание=6, высота=4): 12.0',
      hint: 'Используй Math.PI для числа π. Функция-выражение: fun circleArea(r: Double) = Math.PI * r * r.',
      solution: 'fun circleArea(radius: Double) = Math.PI * radius * radius\nfun rectangleArea(width: Double, height: Double = width) = width * height\nfun triangleArea(base: Double, height: Double) = base * height / 2\n\nfun main() {\n    println("Площадь круга (r=5): ${circleArea(5.0)}")\n    println("Площадь прямоугольника (4x6): ${rectangleArea(4.0, 6.0)}")\n    println("Площадь квадрата (5x5): ${rectangleArea(5.0)}")\n    println("Площадь треугольника (основание=6, высота=4): ${triangleArea(6.0, 4.0)}")\n}',
      explanation: 'circleArea — функция-выражение с одним параметром. rectangleArea использует параметр по умолчанию height = width — вызов с одним аргументом создаёт квадрат. triangleArea = base * height / 2.'
    },
    {
      id: 8,
      title: 'Практика: Конвертер температур',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай функции конвертации температур с именованными аргументами.',
      requirements: [
        'Функция celsiusToFahrenheit(celsius: Double): Double — формула: C * 9/5 + 32',
        'Функция fahrenheitToCelsius(fahrenheit: Double): Double — формула: (F - 32) * 5/9',
        'Функция convertTemp(value: Double, from: String = "celsius", to: String = "fahrenheit"): Double',
        'Вызови convertTemp с именованными аргументами для разных комбинаций'
      ],
      expectedOutput: '100°C = 212.0°F\n32°F = 0.0°C\nКонвертация 37°C -> °F: 98.6',
      hint: 'В convertTemp используй when для выбора формулы по параметрам from и to. Именованные аргументы: convertTemp(value = 37.0, from = "celsius").',
      solution: 'fun celsiusToFahrenheit(celsius: Double) = celsius * 9.0 / 5.0 + 32.0\nfun fahrenheitToCelsius(fahrenheit: Double) = (fahrenheit - 32.0) * 5.0 / 9.0\n\nfun convertTemp(value: Double, from: String = "celsius", to: String = "fahrenheit"): Double {\n    return when {\n        from == "celsius" && to == "fahrenheit" -> celsiusToFahrenheit(value)\n        from == "fahrenheit" && to == "celsius" -> fahrenheitToCelsius(value)\n        else -> value\n    }\n}\n\nfun main() {\n    println("100\u00b0C = ${celsiusToFahrenheit(100.0)}\u00b0F")\n    println("32\u00b0F = ${fahrenheitToCelsius(32.0)}\u00b0C")\n    println("Конвертация 37\u00b0C -> \u00b0F: ${convertTemp(value = 37.0, from = "celsius")}")\n}',
      explanation: 'celsiusToFahrenheit и fahrenheitToCelsius — простые функции-выражения. convertTemp использует when без аргумента для гибкого выбора конвертации. Именованные аргументы делают вызов понятным.'
    }
  ]
}
