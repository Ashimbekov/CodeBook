export default {
  id: 19,
  title: 'Интерфейсы',
  description: 'Интерфейсы в Go — это контракты поведения. Неявная реализация, утиная типизация, пустой интерфейс any — всё это делает интерфейсы Go уникально мощным инструментом.',
  lessons: [
    {
      id: 1,
      title: 'Определение интерфейсов',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Интерфейс — контракт без реализации'
        },
        {
          type: 'text',
          value: 'Интерфейс в Go — это набор сигнатур методов. Он описывает, ЧТО умеет делать тип, без указания КАК. Аналогия: интерфейс — это должностная инструкция. "Водитель должен уметь: завести машину, ехать прямо, поворачивать". Как именно — не важно.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "math"\n)\n\n// Интерфейс — только сигнатуры методов\ntype Shape interface {\n    Area() float64\n    Perimeter() float64\n}\n\n// Circle реализует Shape\ntype Circle struct{ Radius float64 }\nfunc (c Circle) Area() float64      { return math.Pi * c.Radius * c.Radius }\nfunc (c Circle) Perimeter() float64 { return 2 * math.Pi * c.Radius }\n\n// Rectangle реализует Shape\ntype Rectangle struct{ Width, Height float64 }\nfunc (r Rectangle) Area() float64      { return r.Width * r.Height }\nfunc (r Rectangle) Perimeter() float64 { return 2 * (r.Width + r.Height) }\n\n// Функция принимает интерфейс Shape — работает с ЛЮБЫМ Shape\nfunc printShapeInfo(s Shape) {\n    fmt.Printf("Площадь: %.2f, Периметр: %.2f\\n", s.Area(), s.Perimeter())\n}\n\nfunc main() {\n    c := Circle{Radius: 5}\n    r := Rectangle{Width: 4, Height: 6}\n    \n    printShapeInfo(c) // Площадь: 78.54, Периметр: 31.42\n    printShapeInfo(r) // Площадь: 24.00, Периметр: 20.00\n    \n    // Интерфейс — тип: можно хранить в переменной\n    var s Shape = c\n    fmt.Println(s.Area())\n}'
        },
        {
          type: 'note',
          value: 'Ключевое отличие Go от Java/C#: для реализации интерфейса НЕ нужно явно писать "implements Shape". Go проверяет реализацию автоматически по наличию нужных методов.'
        }
      ]
    },
    {
      id: 2,
      title: 'Неявная реализация',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Утиная типизация: "если крякает — значит утка"'
        },
        {
          type: 'text',
          value: 'В Go тип реализует интерфейс автоматически, если у него есть все нужные методы. Не нужно объявлять "implements". Это называется "утиная типизация": если у типа есть методы интерфейса — он его реализует, неважно, как тип называется.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Stringer interface {\n    String() string\n}\n\ntype Dog struct {\n    Name string\n    Age  int\n}\n\n// Dog реализует Stringer, не объявляя это явно!\nfunc (d Dog) String() string {\n    return fmt.Sprintf("Собака %s, %d лет", d.Name, d.Age)\n}\n\ntype Car struct {\n    Brand string\n    Model string\n}\n\n// Car тоже реализует Stringer\nfunc (c Car) String() string {\n    return fmt.Sprintf("%s %s", c.Brand, c.Model)\n}\n\nfunc printAll(items []Stringer) {\n    for _, item := range items {\n        fmt.Println(item.String())\n    }\n}\n\nfunc main() {\n    items := []Stringer{\n        Dog{Name: "Рекс", Age: 3},\n        Car{Brand: "Toyota", Model: "Camry"},\n        Dog{Name: "Шарик", Age: 5},\n    }\n    printAll(items)\n}'
        },
        {
          type: 'tip',
          value: 'Небольшие интерфейсы — идиома Go. Пакет fmt.Stringer содержит только String() string. io.Reader — только Read(). Маленький интерфейс проще реализовать и легче понять.'
        }
      ]
    },
    {
      id: 3,
      title: 'Пустой интерфейс (any)',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'interface{} и any — принимает любой тип'
        },
        {
          type: 'text',
          value: 'Пустой интерфейс interface{} (или any в Go 1.18+) не требует никаких методов — его реализует любой тип. Это как универсальная коробка: в неё можно положить что угодно. Но чтобы достать и использовать содержимое — нужно знать, что внутри.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc printAnything(v any) { // или interface{}\n    fmt.Printf("Тип: %T, Значение: %v\\n", v, v)\n}\n\nfunc main() {\n    printAnything(42)           // Тип: int, Значение: 42\n    printAnything("hello")      // Тип: string, Значение: hello\n    printAnything(3.14)         // Тип: float64, Значение: 3.14\n    printAnything(true)         // Тип: bool, Значение: true\n    printAnything([]int{1,2,3}) // Тип: []int, Значение: [1 2 3]\n    printAnything(nil)          // Тип: <nil>, Значение: <nil>\n    \n    // Хранение разных типов\n    var items []any\n    items = append(items, 1, "два", 3.0, true)\n    fmt.Println(items) // [1 два 3 true]\n    \n    // Пустой интерфейс в карте (как JSON объект)\n    data := map[string]any{\n        "name": "Алиса",\n        "age":  30,\n        "active": true,\n    }\n    fmt.Println(data)\n}'
        },
        {
          type: 'warning',
          value: 'Избегайте злоупотребления any. Теряется типобезопасность, нужны type assertions. Используйте any только когда тип действительно неизвестен заранее (например, JSON с произвольными полями).'
        }
      ]
    },
    {
      id: 4,
      title: 'Type assertion',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Извлечение конкретного типа из интерфейса'
        },
        {
          type: 'text',
          value: 'Type assertion (утверждение типа) позволяет извлечь конкретное значение из интерфейса. Это как открыть универсальную коробку и проверить, что внутри. Без проверки (ok) рискуете паникой, с проверкой — безопасно.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    var i interface{} = "hello"\n    \n    // Без проверки — паника если тип неверный\n    s := i.(string)\n    fmt.Println(s) // hello\n    \n    // n := i.(int) // ПАНИКА! interface {} is string, not int\n    \n    // С проверкой (comma ok) — безопасно\n    s2, ok := i.(string)\n    fmt.Println(s2, ok) // hello true\n    \n    n, ok := i.(int)\n    fmt.Println(n, ok) // 0 false (не паника!)\n    \n    // Практичный пример\n    values := []interface{}{42, "hello", 3.14, true}\n    for _, v := range values {\n        if s, ok := v.(string); ok {\n            fmt.Println("Строка:", s)\n        } else if n, ok := v.(int); ok {\n            fmt.Println("Число:", n)\n        } else {\n            fmt.Println("Другой тип:", v)\n        }\n    }\n}'
        }
      ]
    },
    {
      id: 5,
      title: 'Type switch',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Переключение по типу'
        },
        {
          type: 'text',
          value: 'Type switch — это удобный способ обработать несколько возможных типов интерфейса. Это как сортировочный конвейер: каждый тип идёт в свой "ящик".'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc describe(i interface{}) string {\n    switch v := i.(type) { // v принимает тип соответствующей ветки\n    case int:\n        return fmt.Sprintf("int: %d (удвоенное: %d)", v, v*2)\n    case string:\n        return fmt.Sprintf("string: %q (длина: %d)", v, len(v))\n    case bool:\n        if v {\n            return "bool: истина"\n        }\n        return "bool: ложь"\n    case []int:\n        return fmt.Sprintf("[]int с %d элементами", len(v))\n    case nil:\n        return "nil значение"\n    default:\n        return fmt.Sprintf("неизвестный тип: %T", v)\n    }\n}\n\nfunc main() {\n    values := []interface{}{42, "hello", true, []int{1,2,3}, nil, 3.14}\n    for _, v := range values {\n        fmt.Println(describe(v))\n    }\n}'
        },
        {
          type: 'tip',
          value: 'В type switch переменная v в каждой ветке case имеет конкретный тип, а не interface{}. Это главное удобство type switch по сравнению с цепочкой type assertions.'
        }
      ]
    },
    {
      id: 6,
      title: 'Композиция интерфейсов',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Встраивание интерфейсов'
        },
        {
          type: 'text',
          value: 'Интерфейсы в Go можно встраивать друг в друга, создавая более широкие контракты. Это как профессиональные сертификаты: ReadWriter = Reader + Writer. Хочешь ReadWriter — должен уметь и читать, и писать.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Reader interface {\n    Read() string\n}\n\ntype Writer interface {\n    Write(s string)\n}\n\n// ReadWriter = Reader + Writer (встраивание)\ntype ReadWriter interface {\n    Reader\n    Writer\n}\n\ntype Buffer struct {\n    data string\n}\n\nfunc (b *Buffer) Read() string    { return b.data }\nfunc (b *Buffer) Write(s string)  { b.data += s }\n\nfunc process(rw ReadWriter) {\n    rw.Write("Hello, ")\n    rw.Write("World!")\n    fmt.Println(rw.Read())\n}\n\nfunc main() {\n    buf := &Buffer{}\n    process(buf) // Hello, World!\n    \n    // Стандартная библиотека активно использует композицию:\n    // io.ReadWriter = io.Reader + io.Writer\n    // io.ReadWriteCloser = io.Reader + io.Writer + io.Closer\n    fmt.Println("Buffer реализует Reader, Writer и ReadWriter")\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\n// Стандартные интерфейсы Go\n// fmt.Stringer — для строкового представления\ntype Celsius float64\n\nfunc (c Celsius) String() string {\n    return fmt.Sprintf("%.1f°C", float64(c))\n}\n\n// fmt.GoStringer — для отладочного представления (%#v)\nfunc (c Celsius) GoString() string {\n    return fmt.Sprintf("Celsius(%.1f)", float64(c))\n}\n\nfunc main() {\n    temp := Celsius(36.6)\n    fmt.Println(temp)            // 36.6°C (через Stringer)\n    fmt.Printf("%v\\n", temp)    // 36.6°C\n    fmt.Printf("%#v\\n", temp)   // Celsius(36.6) (через GoStringer)\n    \n    // strings.Builder реализует io.Writer\n    var sb strings.Builder\n    fmt.Fprint(&sb, "Hello from Fprint!")\n    fmt.Println(sb.String())\n}'
        }
      ]
    },
    {
      id: 7,
      title: 'Интерфейсы Stringer, Reader, Writer',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Ключевые интерфейсы стандартной библиотеки'
        },
        {
          type: 'text',
          value: 'Go стандартная библиотека построена на небольших интерфейсах. io.Reader и io.Writer — самые важные из них. Всё, что умеет читать/писать байты, реализует эти интерфейсы.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n    "io"\n    "os"\n)\n\n// io.Reader: Read(p []byte) (n int, err error)\n// io.Writer: Write(p []byte) (n int, err error)\n\n// Своя реализация io.Reader\ntype StringReader struct {\n    data string\n    pos  int\n}\n\nfunc (r *StringReader) Read(p []byte) (int, error) {\n    if r.pos >= len(r.data) {\n        return 0, io.EOF\n    }\n    n := copy(p, r.data[r.pos:])\n    r.pos += n\n    return n, nil\n}\n\nfunc main() {\n    // strings.NewReader реализует io.Reader\n    reader := strings.NewReader("Hello, io.Reader!")\n    \n    // io.Copy принимает Writer и Reader — не знает конкретные типы!\n    io.Copy(os.Stdout, reader)\n    fmt.Println()\n    \n    // Своя реализация\n    sr := &StringReader{data: "Custom reader works!"}\n    io.Copy(os.Stdout, sr)\n    fmt.Println()\n}'
        },
        {
          type: 'note',
          value: 'io.Reader и io.Writer — это не "абстрактные классы", это просто контракты. Файл, сетевое соединение, буфер памяти, HTTP тело — все реализуют эти интерфейсы. Функции, принимающие io.Reader, работают со всеми ними.'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Интерфейс Shape',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему геометрических фигур. Определите интерфейс Shape и несколько типов (Circle, Rectangle, Triangle). Напишите функцию TotalArea(shapes []Shape) float64.',
      requirements: [
        'Интерфейс Shape: Area() float64, Perimeter() float64, String() string',
        'Тип Circle (Radius), Rectangle (Width, Height), Triangle (A, B, C — стороны)',
        'Все типы реализуют Shape',
        'Функция TotalArea([]Shape) float64',
        'Функция LargestShape([]Shape) Shape',
        'Красивый вывод через String()'
      ],
      expectedOutput: 'Circle(r=5.00): площадь=78.54\nRectangle(4.00x6.00): площадь=24.00\nТотальная площадь: 102.54\nСамая большая: Circle(r=5.00)',
      hint: 'Для треугольника используйте формулу Герона: s=(a+b+c)/2, area=sqrt(s*(s-a)*(s-b)*(s-c)). fmt.Stringer реализуется через метод String() string.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "math"\n)\n\ntype Shape interface {\n    Area() float64\n    Perimeter() float64\n    String() string\n}\n\ntype Circle struct{ Radius float64 }\n\nfunc (c Circle) Area() float64      { return math.Pi * c.Radius * c.Radius }\nfunc (c Circle) Perimeter() float64 { return 2 * math.Pi * c.Radius }\nfunc (c Circle) String() string {\n    return fmt.Sprintf("Circle(r=%.2f)", c.Radius)\n}\n\ntype Rectangle struct{ Width, Height float64 }\n\nfunc (r Rectangle) Area() float64      { return r.Width * r.Height }\nfunc (r Rectangle) Perimeter() float64 { return 2 * (r.Width + r.Height) }\nfunc (r Rectangle) String() string {\n    return fmt.Sprintf("Rectangle(%.2fx%.2f)", r.Width, r.Height)\n}\n\ntype Triangle struct{ A, B, C float64 }\n\nfunc (t Triangle) Area() float64 {\n    s := (t.A + t.B + t.C) / 2\n    return math.Sqrt(s * (s - t.A) * (s - t.B) * (s - t.C))\n}\nfunc (t Triangle) Perimeter() float64 { return t.A + t.B + t.C }\nfunc (t Triangle) String() string {\n    return fmt.Sprintf("Triangle(%.2f,%.2f,%.2f)", t.A, t.B, t.C)\n}\n\nfunc TotalArea(shapes []Shape) float64 {\n    total := 0.0\n    for _, s := range shapes {\n        total += s.Area()\n    }\n    return total\n}\n\nfunc LargestShape(shapes []Shape) Shape {\n    if len(shapes) == 0 {\n        return nil\n    }\n    largest := shapes[0]\n    for _, s := range shapes[1:] {\n        if s.Area() > largest.Area() {\n            largest = s\n        }\n    }\n    return largest\n}\n\nfunc main() {\n    shapes := []Shape{\n        Circle{Radius: 5},\n        Rectangle{Width: 4, Height: 6},\n        Triangle{A: 3, B: 4, C: 5},\n    }\n    for _, s := range shapes {\n        fmt.Printf("%s: площадь=%.2f\\n", s.String(), s.Area())\n    }\n    fmt.Printf("Тотальная площадь: %.2f\\n", TotalArea(shapes))\n    fmt.Printf("Самая большая: %s\\n", LargestShape(shapes).String())\n}',
      explanation: 'Интерфейс Shape позволяет работать с разными геометрическими фигурами через единый интерфейс. TotalArea и LargestShape не знают о конкретных типах — только о Shape. Это и есть полиморфизм: один код работает с множеством типов.'
    }
  ]
}
