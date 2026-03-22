export default {
  id: 3,
  title: 'Переменные и типы данных',
  description: 'Изучаем способы объявления переменных, основные типы данных в Go, нулевые значения, преобразование типов и форматированный вывод.',
  lessons: [
    {
      id: 1,
      title: 'Объявление переменных: var',
      content: [
        {
          type: 'heading',
          value: 'Ключевое слово var'
        },
        {
          type: 'text',
          value: 'В Go переменные объявляются явно с указанием типа. Ключевое слово var — это классический способ объявления. Аналогия: объявление переменной — это как подписать ящик, прежде чем что-то в него положить. Вы указываете имя и что там будет храниться.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Объявление с типом\n    var name string\n    var age int\n    var price float64\n    var isActive bool\n\n    // Присвоение значений\n    name = "Алексей"\n    age = 25\n    price = 99.99\n    isActive = true\n\n    fmt.Println(name, age, price, isActive)\n    // Алексей 25 99.99 true\n}'
        },
        {
          type: 'heading',
          value: 'Объявление с инициализацией'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Объявление и инициализация одновременно\n    var name string = "Мария"\n    var age int = 30\n    var score float64 = 9.5\n\n    fmt.Println(name, age, score)\n    // Мария 30 9.5\n\n    // Блочное объявление\n    var (\n        city    string  = "Москва"\n        country string  = "Россия"\n        temp    float64 = -5.0\n    )\n\n    fmt.Println(city, country, temp)\n    // Москва Россия -5\n}'
        },
        {
          type: 'tip',
          value: 'Используйте блочное объявление var (...) когда нужно объявить несколько переменных сразу — это делает код более читаемым.'
        }
      ]
    },
    {
      id: 2,
      title: 'Краткое объявление :=',
      content: [
        {
          type: 'heading',
          value: 'Оператор := (walrus operator)'
        },
        {
          type: 'text',
          value: 'Оператор := — это сокращённая форма объявления переменной. Его ещё называют "walrus operator" (оператор моржа) из-за схожести с клыками моржа. Он объявляет переменную и присваивает значение, тип определяется автоматически.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Краткое объявление - тип определяется автоматически\n    name := "Иван"      // string\n    age := 28            // int\n    score := 8.5         // float64\n    isGrad := true       // bool\n\n    fmt.Println(name, age, score, isGrad)\n    // Иван 28 8.5 true\n\n    // Можно объявить несколько переменных сразу\n    x, y := 10, 20\n    fmt.Println(x, y) // 10 20\n\n    // Полезный приём: обмен значений\n    x, y = y, x\n    fmt.Println(x, y) // 20 10\n}'
        },
        {
          type: 'heading',
          value: 'Когда использовать var, а когда :='
        },
        {
          type: 'list',
          value: 'Используйте := внутри функций — это идиоматический Go-код\nИспользуйте var для переменных уровня пакета (вне функций)\nИспользуйте var когда нужно явно указать тип или создать нулевую переменную\nvar нужен для объявления без инициализации на уровне пакета'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Переменные уровня пакета - только var\nvar globalCounter int = 0\nvar appName string = "MyApp"\n\nfunc main() {\n    // Внутри функции - предпочтительно :=\n    localVar := "локальная переменная"\n    fmt.Println(localVar)\n    fmt.Println(globalCounter, appName)\n}'
        },
        {
          type: 'warning',
          value: 'Оператор := работает только внутри функций! На уровне пакета (вне функций) нужно использовать ключевое слово var. Попытка использовать := вне функции вызовет ошибку компиляции.'
        }
      ]
    },
    {
      id: 3,
      title: 'Числовые типы: int и float64',
      content: [
        {
          type: 'heading',
          value: 'Целочисленные типы'
        },
        {
          type: 'text',
          value: 'Go предоставляет несколько целочисленных типов. Они отличаются размером (количеством бит) и тем, могут ли хранить отрицательные числа.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Знаковые целые (могут быть отрицательными)\n    var i8 int8 = 127          // -128 до 127\n    var i16 int16 = 32767      // -32768 до 32767\n    var i32 int32 = 2147483647 // ~2 миллиарда\n    var i64 int64 = 9223372036854775807 // огромное число\n\n    // int - размер зависит от платформы (32 или 64 бита)\n    var i int = 42\n\n    // Беззнаковые (только положительные)\n    var u8 uint8 = 255     // 0 до 255\n    var u16 uint16 = 65535 // 0 до 65535\n\n    fmt.Println(i8, i16, i32, i64)\n    fmt.Println(i)\n    fmt.Println(u8, u16)\n\n    // Специальные типы\n    var b byte = 65    // byte = uint8, для байтов данных\n    var r rune = \'А\'   // rune = int32, для Unicode символов\n    fmt.Printf("byte: %c, rune: %c\\n", b, r)\n    // byte: A, rune: А\n}'
        },
        {
          type: 'heading',
          value: 'Типы с плавающей точкой'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "math"\n)\n\nfunc main() {\n    // float32 - 32-битное, менее точное\n    var f32 float32 = 3.14\n\n    // float64 - 64-битное, более точное (по умолчанию)\n    var f64 float64 = 3.141592653589793\n\n    fmt.Println(f32) // 3.14\n    fmt.Println(f64) // 3.141592653589793\n\n    // Математические операции\n    radius := 5.0\n    area := math.Pi * radius * radius\n    fmt.Printf("Площадь круга: %.2f\\n", area)\n    // Площадь круга: 78.54\n\n    // Деление целых чисел!\n    x := 7\n    y := 2\n    fmt.Println(x / y)  // 3, не 3.5!\n\n    // Для дробного результата нужен float64\n    fmt.Println(float64(x) / float64(y)) // 3.5\n}'
        },
        {
          type: 'note',
          value: 'По умолчанию используйте int для целых чисел и float64 для дробных. Специализированные типы (int8, float32) нужны только при работе с памятью или совместимости с другими системами.'
        }
      ]
    },
    {
      id: 4,
      title: 'Строки и булевы значения',
      content: [
        {
          type: 'heading',
          value: 'Строки (string)'
        },
        {
          type: 'text',
          value: 'Строки в Go — это неизменяемая последовательность байтов в кодировке UTF-8. Это означает, что строки поддерживают любые Unicode символы, включая русский язык, эмодзи и т.д.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\nfunc main() {\n    // Объявление строк\n    greeting := "Привет, мир!"\n    name := "Го"\n\n    // Конкатенация строк\n    message := greeting + " Меня зовут " + name\n    fmt.Println(message)\n    // Привет, мир! Меня зовут Го\n\n    // Длина строки (в байтах!)\n    fmt.Println(len("hello"))   // 5\n    fmt.Println(len("Привет"))  // 12, а не 6! (UTF-8)\n\n    // Базовые операции со строками\n    s := "Hello, Go!"\n    fmt.Println(strings.ToUpper(s))    // HELLO, GO!\n    fmt.Println(strings.ToLower(s))    // hello, go!\n    fmt.Println(strings.Contains(s, "Go"))  // true\n    fmt.Println(strings.Replace(s, "Go", "World", 1)) // Hello, World!\n    fmt.Println(strings.Split("a,b,c", ",")) // [a b c]\n}'
        },
        {
          type: 'heading',
          value: 'Многострочные строки'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Многострочная строка с обратными кавычками\n    poem := `Горные вершины\nСпят во тьме ночной;\nТихие долины\nПолны свежей мглой`\n\n    fmt.Println(poem)\n\n    // Специальные символы в строках\n    tab := "Колонка 1\\tКолонка 2"\n    newline := "Строка 1\\nСтрока 2"\n    quote := "Он сказал: \\"Привет!\\""\n\n    fmt.Println(tab)\n    fmt.Println(newline)\n    fmt.Println(quote)\n}'
        },
        {
          type: 'heading',
          value: 'Булевы значения (bool)'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Булевы значения - только true или false\n    isReady := true\n    isFinished := false\n\n    fmt.Println(isReady)    // true\n    fmt.Println(isFinished) // false\n\n    // Логические операции\n    fmt.Println(true && false)  // false (И)\n    fmt.Println(true || false)  // true  (ИЛИ)\n    fmt.Println(!true)          // false (НЕ)\n\n    // Из сравнений\n    age := 18\n    isAdult := age >= 18\n    fmt.Println("Взрослый:", isAdult) // Взрослый: true\n}'
        }
      ]
    },
    {
      id: 5,
      title: 'Нулевые значения',
      content: [
        {
          type: 'heading',
          value: 'Что такое нулевые значения?'
        },
        {
          type: 'text',
          value: 'В Go каждый тип имеет нулевое значение (zero value) — значение по умолчанию при объявлении переменной без инициализации. Это ключевое отличие Go от многих языков, где переменные могут содержать "мусор".'
        },
        {
          type: 'text',
          value: 'Аналогия: Нулевые значения — это как новая тетрадь. Вы достали её из упаковки, и в ней уже есть что-то: чистые страницы (nil), нули на полях (0), пустые строки ("").'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Объявление без инициализации - получаем нулевые значения\n    var i int\n    var f float64\n    var s string\n    var b bool\n\n    fmt.Printf("int: %d\\n", i)       // int: 0\n    fmt.Printf("float64: %f\\n", f)   // float64: 0.000000\n    fmt.Printf("string: %q\\n", s)    // string: ""\n    fmt.Printf("bool: %t\\n", b)      // bool: false\n\n    // Нулевые значения для составных типов\n    var slice []int       // nil\n    var m map[string]int  // nil\n    var p *int            // nil (указатель)\n\n    fmt.Println(slice == nil) // true\n    fmt.Println(m == nil)     // true\n    fmt.Println(p == nil)     // true\n}'
        },
        {
          type: 'heading',
          value: 'Практическое применение нулевых значений'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Счётчик - нулевое значение 0 удобно\n    var counter int\n    counter++\n    counter++\n    fmt.Println("Счётчик:", counter) // Счётчик: 2\n\n    // Флаг - нулевое значение false удобно\n    var isError bool\n    if !isError {\n        fmt.Println("Ошибок нет")\n    }\n\n    // Строка - нулевое значение "" удобно для накопления\n    var result string\n    result += "Привет"\n    result += ", "\n    result += "мир!"\n    fmt.Println(result) // Привет, мир!\n}'
        },
        {
          type: 'tip',
          value: 'Нулевые значения — это особенность Go, которая делает код безопасным. Вы никогда не получите "случайные" данные в новой переменной, как это бывает в C/C++.'
        }
      ]
    },
    {
      id: 6,
      title: 'Преобразование типов',
      content: [
        {
          type: 'heading',
          value: 'Явное преобразование типов'
        },
        {
          type: 'text',
          value: 'В Go нет неявного преобразования типов. Это важное отличие от многих других языков. Вы не можете сложить int и float64 — нужно явно привести один тип к другому.'
        },
        {
          type: 'text',
          value: 'Аналогия: Представьте, что у вас есть рубли и доллары. В Go нельзя просто сложить их — нужно сначала конвертировать в одну валюту. Это защищает от случайных ошибок.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Преобразование числовых типов\n    var i int = 42\n    var f float64 = float64(i)  // int -> float64\n    var u uint = uint(f)        // float64 -> uint\n\n    fmt.Println(i, f, u) // 42 42 42\n\n    // Потеря данных при преобразовании!\n    big := 1000\n    small := int8(big)  // int8 может хранить только до 127!\n    fmt.Println(big, small) // 1000 -24 (переполнение!)\n\n    // Дробное -> целое: дробная часть отбрасывается\n    pi := 3.14\n    intPi := int(pi)\n    fmt.Println(pi, intPi) // 3.14 3\n\n    // Нельзя сложить разные числовые типы!\n    // x := i + f  // ОШИБКА: mismatched types int and float64\n    x := float64(i) + f  // Правильно\n    fmt.Println(x) // 84\n}'
        },
        {
          type: 'heading',
          value: 'Преобразование строк и чисел'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strconv"\n)\n\nfunc main() {\n    // Число в строку\n    num := 42\n    str := strconv.Itoa(num) // Int to ASCII\n    fmt.Println(str, fmt.Sprintf("%T", str)) // 42 string\n\n    // Строку в число\n    s := "123"\n    n, err := strconv.Atoi(s) // ASCII to Int\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n    } else {\n        fmt.Println(n + 1) // 124\n    }\n\n    // Строку в float\n    f, err := strconv.ParseFloat("3.14", 64)\n    if err == nil {\n        fmt.Println(f * 2) // 6.28\n    }\n\n    // Число в строку через fmt.Sprintf\n    result := fmt.Sprintf("Число: %d, Дробное: %.2f", 42, 3.14)\n    fmt.Println(result) // Число: 42, Дробное: 3.14\n}'
        },
        {
          type: 'warning',
          value: 'При преобразовании строки в число всегда проверяйте ошибку! Если строка содержит не-числовые символы, strconv.Atoi вернёт ошибку.'
        }
      ]
    },
    {
      id: 7,
      title: 'Вывод типа (type inference)',
      content: [
        {
          type: 'heading',
          value: 'Автоматическое определение типов'
        },
        {
          type: 'text',
          value: 'Go может автоматически определять тип переменной из её значения. Это называется выводом типа (type inference). При использовании := компилятор смотрит на правую часть и определяет тип.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Компилятор сам определяет типы\n    a := 42         // int\n    b := 3.14       // float64\n    c := "hello"    // string\n    d := true       // bool\n\n    // Проверим типы\n    fmt.Printf("%v имеет тип %T\\n", a, a) // 42 имеет тип int\n    fmt.Printf("%v имеет тип %T\\n", b, b) // 3.14 имеет тип float64\n    fmt.Printf("%v имеет тип %T\\n", c, c) // hello имеет тип string\n    fmt.Printf("%v имеет тип %T\\n", d, d) // true имеет тип bool\n}'
        },
        {
          type: 'heading',
          value: 'Когда вывод типа может удивить'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Целое число по умолчанию - int (не int32, не int64)\n    x := 42\n    fmt.Printf("%T\\n", x) // int\n\n    // Дробное число по умолчанию - float64 (не float32)\n    y := 3.14\n    fmt.Printf("%T\\n", y) // float64\n\n    // Если нужен другой тип - укажите явно\n    var z float32 = 3.14\n    fmt.Printf("%T\\n", z) // float32\n\n    // Или через явное преобразование\n    w := float32(3.14)\n    fmt.Printf("%T\\n", w) // float32\n\n    // Из результата функции\n    sum := 10 + 20 // int\n    ratio := 10.0 / 3 // float64\n    fmt.Println(sum, ratio) // 30 3.3333333333333335\n}'
        },
        {
          type: 'note',
          value: 'Go — статически типизированный язык. Хотя := выглядит как динамическая типизация, тип определяется один раз при компиляции и не меняется. Это отличает Go от Python или JavaScript.'
        }
      ]
    },
    {
      id: 8,
      title: 'Форматирование вывода: fmt.Printf',
      content: [
        {
          type: 'heading',
          value: 'Форматные спецификаторы'
        },
        {
          type: 'text',
          value: 'Функция fmt.Printf позволяет форматировать вывод. Форматные спецификаторы начинаются с % и определяют, как вывести значение. Это как шаблон, в который подставляются значения.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    name := "Алиса"\n    age := 25\n    height := 1.65\n    isStudent := true\n\n    // %s - строка\n    fmt.Printf("Имя: %s\\n", name)\n    // %d - целое число\n    fmt.Printf("Возраст: %d лет\\n", age)\n    // %f - дробное число\n    fmt.Printf("Рост: %f м\\n", height)\n    // %.2f - дробное с 2 знаками после запятой\n    fmt.Printf("Рост: %.2f м\\n", height)\n    // %t - булево значение\n    fmt.Printf("Студент: %t\\n", isStudent)\n    // %v - универсальный (любой тип)\n    fmt.Printf("Всё вместе: %v %v %v %v\\n", name, age, height, isStudent)\n    // %T - тип переменной\n    fmt.Printf("Тип age: %T\\n", age)\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Выравнивание и ширина поля\n    fmt.Printf("|%10s|\\n", "right")    // |     right|\n    fmt.Printf("|%-10s|\\n", "left")    // |left      |\n    fmt.Printf("|%10d|\\n", 42)         // |        42|\n    fmt.Printf("|%-10d|\\n", 42)        // |42        |\n\n    // Шестнадцатеричные числа\n    fmt.Printf("%x\\n", 255)   // ff\n    fmt.Printf("%X\\n", 255)   // FF\n    fmt.Printf("%#x\\n", 255)  // 0xff\n\n    // Бинарное представление\n    fmt.Printf("%b\\n", 10)    // 1010\n\n    // fmt.Sprintf - форматирование в строку\n    result := fmt.Sprintf("Привет, %s! Вам %d лет.", "Боб", 30)\n    fmt.Println(result) // Привет, Боб! Вам 30 лет.\n\n    // fmt.Println vs Printf\n    fmt.Println("a", "b", "c")   // a b c (с пробелами)\n    fmt.Print("a", "b", "c\\n")  // abc (без пробелов, без переноса)\n}'
        },
        {
          type: 'tip',
          value: 'Запомните самые частые спецификаторы: %s (строка), %d (целое), %f (дробное), %v (любой тип), %T (тип). Этого хватит для большинства задач.'
        }
      ]
    },
    {
      id: 9,
      title: 'Практика: Калькулятор площадей',
      type: 'practice',
      difficulty: 'beginner',
      description: 'Напишите программу-калькулятор, которая вычисляет площадь прямоугольника и круга. Программа должна использовать переменные разных типов и форматированный вывод.',
      requirements: [
        'Создайте переменные для прямоугольника: ширина (width = 10.5) и высота (height = 5.0)',
        'Вычислите площадь прямоугольника: area = width * height',
        'Создайте переменную радиуса для круга: radius = 7.0',
        'Используйте math.Pi для числа Пи',
        'Вычислите площадь круга: area = Pi * radius * radius',
        'Выведите результаты с двумя знаками после запятой',
        'Используйте fmt.Printf для форматирования'
      ],
      expectedOutput: 'Прямоугольник:\n  Ширина: 10.50\n  Высота: 5.00\n  Площадь: 52.50\n\nКруг:\n  Радиус: 7.00\n  Площадь: 153.94',
      hint: 'Импортируйте пакет "math" для использования math.Pi. Формула площади круга: Pi * r * r. Используйте %.2f для вывода с двумя знаками после запятой.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "math"\n)\n\nfunc main() {\n    // Прямоугольник\n    width := 10.5\n    height := 5.0\n    rectArea := width * height\n\n    fmt.Println("Прямоугольник:")\n    fmt.Printf("  Ширина: %.2f\\n", width)\n    fmt.Printf("  Высота: %.2f\\n", height)\n    fmt.Printf("  Площадь: %.2f\\n", rectArea)\n\n    fmt.Println()\n\n    // Круг\n    radius := 7.0\n    circleArea := math.Pi * radius * radius\n\n    fmt.Println("Круг:")\n    fmt.Printf("  Радиус: %.2f\\n", radius)\n    fmt.Printf("  Площадь: %.2f\\n", circleArea)\n}',
      explanation: 'Программа демонстрирует работу с переменными типа float64 и форматированный вывод. math.Pi — это предопределённая константа в стандартной библиотеке Go. Спецификатор %.2f выводит число с плавающей точкой с ровно двумя знаками после запятой. Пустой fmt.Println() выводит пустую строку для разделения блоков вывода.'
    }
  ]
}
