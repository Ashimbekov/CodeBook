export default {
  id: 13,
  title: 'Функции',
  description: 'Функции — строительные блоки Go программ. Изучим объявление, параметры, возвращаемые значения, вариадические функции и функции как объекты первого класса.',
  lessons: [
    {
      id: 1,
      title: 'Объявление функций',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Синтаксис функций в Go'
        },
        {
          type: 'text',
          value: 'Функция в Go — это именованный блок кода, который выполняет определённую задачу. Представьте функцию как рецепт: у неё есть название, список ингредиентов (параметры) и то, что она производит (возвращаемые значения).'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Базовый синтаксис: func имя(параметры) типВозврата { тело }\nfunc greet(name string) string {\n    return "Привет, " + name + "!"\n}\n\n// Функция без параметров и возвращаемого значения\nfunc sayHello() {\n    fmt.Println("Hello!")\n}\n\n// Функция с несколькими параметрами\nfunc add(a int, b int) int {\n    return a + b\n}\n\n// Если параметры одного типа, тип можно писать один раз\nfunc multiply(a, b int) int {\n    return a * b\n}\n\nfunc main() {\n    fmt.Println(greet("Го"))   // Привет, Го!\n    sayHello()                 // Hello!\n    fmt.Println(add(3, 4))     // 7\n    fmt.Println(multiply(3, 4)) // 12\n}'
        },
        {
          type: 'note',
          value: 'В Go тип параметра идёт ПОСЛЕ имени (a int, не int a). Это отличие от C/Java, но такой синтаксис делает сложные типы более читаемыми.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "math"\n)\n\n// Функция может принимать и возвращать разные типы\nfunc circleArea(radius float64) float64 {\n    return math.Pi * radius * radius\n}\n\nfunc isAdult(age int) bool {\n    return age >= 18\n}\n\n// Функции в Go — полноправные элементы программы\n// Они могут быть в любом порядке в файле\nfunc main() {\n    fmt.Printf("Площадь круга r=5: %.2f\\n", circleArea(5)) // 78.54\n    fmt.Println("Совершеннолетний?", isAdult(20))           // true\n    fmt.Println("Совершеннолетний?", isAdult(16))           // false\n}'
        }
      ]
    },
    {
      id: 2,
      title: 'Параметры функций',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Передача параметров по значению'
        },
        {
          type: 'text',
          value: 'В Go все параметры передаются по значению (copy). Это как ксерокопия документа: функция получает копию, а оригинал не меняется. Чтобы изменить оригинал, нужно передавать указатель.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Передача по значению — оригинал не меняется\nfunc double(n int) int {\n    n = n * 2 // меняем копию\n    return n\n}\n\n// Слайсы передаются "по ссылке" на заголовок\n// но append может создать новый слайс!\nfunc addElement(s []int, elem int) []int {\n    return append(s, elem)\n}\n\nfunc main() {\n    x := 5\n    result := double(x)\n    fmt.Println("x:", x)        // 5 (не изменился!)\n    fmt.Println("result:", result) // 10\n    \n    nums := []int{1, 2, 3}\n    newNums := addElement(nums, 4)\n    fmt.Println("nums:", nums)       // [1 2 3] (оригинал)\n    fmt.Println("newNums:", newNums) // [1 2 3 4]\n}'
        },
        {
          type: 'tip',
          value: 'Слайсы, карты и каналы содержат указатель на данные внутри. Поэтому изменение элементов слайса внутри функции видно снаружи. Но append может создать новый слайс!'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Модификация элементов слайса видна снаружи\nfunc doubleAll(nums []int) {\n    for i := range nums {\n        nums[i] *= 2 // изменяем элементы через общий заголовок\n    }\n}\n\nfunc main() {\n    nums := []int{1, 2, 3, 4, 5}\n    doubleAll(nums)\n    fmt.Println(nums) // [2 4 6 8 10] — изменилось!\n    \n    // Несколько параметров одного типа\n    // func sum(a, b, c int) int {\n    //     return a + b + c\n    // }\n}'
        }
      ]
    },
    {
      id: 3,
      title: 'Возвращаемые значения',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Возврат значений из функций'
        },
        {
          type: 'text',
          value: 'Go позволяет возвращать несколько значений из функции (подробнее в модуле 14). Сейчас рассмотрим базовые возвраты.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "errors"\n)\n\n// Одно возвращаемое значение\nfunc square(n int) int {\n    return n * n\n}\n\n// Два возвращаемых значения (значение и ошибка — идиома Go)\nfunc divide(a, b float64) (float64, error) {\n    if b == 0 {\n        return 0, errors.New("деление на ноль")\n    }\n    return a / b, nil\n}\n\nfunc main() {\n    fmt.Println(square(5)) // 25\n    \n    result, err := divide(10, 2)\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n    } else {\n        fmt.Println("10 / 2 =", result) // 5\n    }\n    \n    _, err = divide(5, 0)\n    if err != nil {\n        fmt.Println("Ошибка:", err) // Ошибка: деление на ноль\n    }\n}'
        },
        {
          type: 'note',
          value: 'Функция без явного return в конце не является ошибкой только если возвращаемый тип — ничего (пустая функция). Иначе компилятор потребует return.'
        }
      ]
    },
    {
      id: 4,
      title: 'Именованные возвращаемые значения',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Named return values'
        },
        {
          type: 'text',
          value: 'В Go можно дать имена возвращаемым значениям. Тогда они становятся переменными внутри функции, и можно использовать "голый return" (naked return). Это удобно для коротких функций и улучшает читаемость кода.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Именованные возвращаемые значения\nfunc minMax(nums []int) (min, max int) {\n    if len(nums) == 0 {\n        return // min=0, max=0 (нулевые значения)\n    }\n    min, max = nums[0], nums[0]\n    for _, n := range nums[1:] {\n        if n < min {\n            min = n\n        }\n        if n > max {\n            max = n\n        }\n    }\n    return // "голый return" — возвращает min и max\n}\n\nfunc main() {\n    nums := []int{5, 2, 8, 1, 9, 3}\n    min, max := minMax(nums)\n    fmt.Printf("Мин: %d, Макс: %d\\n", min, max) // Мин: 1, Макс: 9\n}'
        },
        {
          type: 'warning',
          value: 'Будьте осторожны с "голыми return" в длинных функциях — они снижают читаемость. Используйте именованные возвраты только в коротких функциях или для документирования смысла возвращаемых значений.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\n// Именованные возвраты как документация\nfunc parseFullName(fullName string) (firstName, lastName string) {\n    parts := strings.SplitN(fullName, " ", 2)\n    if len(parts) == 2 {\n        firstName = parts[0]\n        lastName = parts[1]\n    } else {\n        firstName = fullName\n        lastName = ""\n    }\n    return\n}\n\nfunc main() {\n    first, last := parseFullName("Нурдаулет Асылбеков")\n    fmt.Println("Имя:", first)   // Нурдаулет\n    fmt.Println("Фамилия:", last) // Асылбеков\n}'
        }
      ]
    },
    {
      id: 5,
      title: 'Вариадические функции (...)',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Функции с переменным числом аргументов'
        },
        {
          type: 'text',
          value: 'Вариадическая функция принимает произвольное количество аргументов. Это как шведский стол: вы берёте столько блюд, сколько хотите. Внутри функции аргументы доступны как срез.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// ... означает "ноль или более аргументов типа int"\nfunc sum(nums ...int) int {\n    total := 0\n    for _, n := range nums {\n        total += n\n    }\n    return total\n}\n\nfunc main() {\n    fmt.Println(sum())          // 0\n    fmt.Println(sum(1))         // 1\n    fmt.Println(sum(1, 2))      // 3\n    fmt.Println(sum(1, 2, 3))   // 6\n    fmt.Println(sum(1, 2, 3, 4, 5)) // 15\n    \n    // Передача среза как вариадических аргументов\n    nums := []int{1, 2, 3, 4, 5}\n    fmt.Println(sum(nums...)) // 15 (обратите внимание на ...)\n}'
        },
        {
          type: 'note',
          value: 'Вариадический параметр должен быть последним в списке параметров. Нельзя иметь два вариадических параметра в одной функции.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Вариадическая с обычными параметрами\nfunc printWithPrefix(prefix string, items ...string) {\n    for _, item := range items {\n        fmt.Printf("%s: %s\\n", prefix, item)\n    }\n}\n\n// Классический пример: fmt.Println сам вариадический!\n// func Println(a ...interface{}) (n int, err error)\n\nfunc main() {\n    printWithPrefix("Товар", "яблоко", "банан", "вишня")\n    // Товар: яблоко\n    // Товар: банан\n    // Товар: вишня\n    \n    langs := []string{"Go", "Rust", "Python"}\n    printWithPrefix("Язык", langs...) // распаковка среза\n    // Язык: Go\n    // Язык: Rust\n    // Язык: Python\n}'
        }
      ]
    },
    {
      id: 6,
      title: 'Функции как объекты первого класса',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Функции — это значения'
        },
        {
          type: 'text',
          value: 'В Go функции являются "объектами первого класса" (first-class citizens). Это значит, что функцию можно присвоить переменной, передать как аргумент или вернуть из другой функции. Функция — это просто значение, как число или строка.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc add(a, b int) int { return a + b }\nfunc mul(a, b int) int { return a * b }\n\nfunc main() {\n    // Присваивание функции переменной\n    var op func(int, int) int\n    \n    op = add\n    fmt.Println(op(3, 4)) // 7\n    \n    op = mul\n    fmt.Println(op(3, 4)) // 12\n    \n    // Карта операций — диспетчеризация\n    operations := map[string]func(int, int) int{\n        "+": add,\n        "*": mul,\n    }\n    \n    for sym, fn := range operations {\n        fmt.Printf("3 %s 4 = %d\\n", sym, fn(3, 4))\n    }\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Тип функции можно определить через type\ntype MathFunc func(int, int) int\n\nfunc apply(a, b int, f MathFunc) int {\n    return f(a, b)\n}\n\nfunc main() {\n    add := func(a, b int) int { return a + b }\n    sub := func(a, b int) int { return a - b }\n    \n    fmt.Println(apply(10, 3, add)) // 13\n    fmt.Println(apply(10, 3, sub)) // 7\n}'
        }
      ]
    },
    {
      id: 7,
      title: 'Передача функций как аргументов',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Функции высшего порядка'
        },
        {
          type: 'text',
          value: 'Функции высшего порядка принимают функции как аргументы или возвращают функции. Это мощный инструмент для абстракции и переиспользования кода. Аналогия: вы даёте подрядчику (функция высшего порядка) набор инструментов (переданные функции), и он выполняет работу.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// filter возвращает элементы, для которых predicate == true\nfunc filter(nums []int, predicate func(int) bool) []int {\n    result := []int{}\n    for _, n := range nums {\n        if predicate(n) {\n            result = append(result, n)\n        }\n    }\n    return result\n}\n\n// mapInts применяет transform к каждому элементу\nfunc mapInts(nums []int, transform func(int) int) []int {\n    result := make([]int, len(nums))\n    for i, n := range nums {\n        result[i] = transform(n)\n    }\n    return result\n}\n\nfunc main() {\n    nums := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}\n    \n    // Только чётные\n    even := filter(nums, func(n int) bool { return n%2 == 0 })\n    fmt.Println("Чётные:", even) // [2 4 6 8 10]\n    \n    // Умножить каждый на 2\n    doubled := mapInts(nums[:5], func(n int) int { return n * 2 })\n    fmt.Println("Удвоенные:", doubled) // [2 4 6 8 10]\n}'
        },
        {
          type: 'text',
          value: 'Функции reduce позволяют "свернуть" срез в одно значение. Это фундаментальные операции функционального программирования.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc reduce(nums []int, initial int, fn func(int, int) int) int {\n    result := initial\n    for _, n := range nums {\n        result = fn(result, n)\n    }\n    return result\n}\n\nfunc main() {\n    nums := []int{1, 2, 3, 4, 5}\n    \n    sum := reduce(nums, 0, func(acc, n int) int { return acc + n })\n    fmt.Println("Сумма:", sum) // 15\n    \n    product := reduce(nums, 1, func(acc, n int) int { return acc * n })\n    fmt.Println("Произведение:", product) // 120\n}'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Функции высшего порядка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте функцию pipeline(nums []int, fns ...func([]int) []int) []int, которая применяет последовательно цепочку функций к срезу чисел. Каждая функция в цепочке принимает и возвращает []int.',
      requirements: [
        'Функция принимает срез чисел и вариадический список функций-преобразований',
        'Каждая функция в цепочке применяется к результату предыдущей',
        'Если список функций пуст — вернуть исходный срез',
        'Продемонстрировать работу с filter и map функциями'
      ],
      expectedOutput: '[4 8 12]',
      hint: 'Итерируйтесь по срезу функций и каждый раз применяйте текущую функцию к накопленному результату.',
      solution: 'package main\n\nimport "fmt"\n\nfunc pipeline(nums []int, fns ...func([]int) []int) []int {\n    result := nums\n    for _, fn := range fns {\n        result = fn(result)\n    }\n    return result\n}\n\nfunc filterEven(nums []int) []int {\n    result := []int{}\n    for _, n := range nums {\n        if n%2 == 0 {\n            result = append(result, n)\n        }\n    }\n    return result\n}\n\nfunc doubleAll(nums []int) []int {\n    result := make([]int, len(nums))\n    for i, n := range nums {\n        result[i] = n * 2\n    }\n    return result\n}\n\nfunc main() {\n    nums := []int{1, 2, 3, 4, 5, 6}\n    \n    // Оставить чётные, затем умножить на 2\n    result := pipeline(nums, filterEven, doubleAll)\n    fmt.Println(result) // [4 8 12]\n    \n    // Только фильтр\n    result2 := pipeline(nums, filterEven)\n    fmt.Println(result2) // [2 4 6]\n    \n    // Без преобразований\n    result3 := pipeline(nums)\n    fmt.Println(result3) // [1 2 3 4 5 6]\n}',
      explanation: 'Pipeline (конвейер) — классический паттерн функционального программирования. Каждая функция берёт результат предыдущей, обрабатывает и передаёт дальше. Вариадические аргументы делают функцию гибкой: можно передать любое количество шагов обработки.'
    }
  ]
}
