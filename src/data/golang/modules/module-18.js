export default {
  id: 18,
  title: 'Методы',
  description: 'Методы в Go — это функции, связанные с типом. Они позволяют добавлять поведение к любому типу, не только структурам. Ключевой выбор: value receiver или pointer receiver.',
  lessons: [
    {
      id: 1,
      title: 'Методы на структурах',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Что такое метод?'
        },
        {
          type: 'text',
          value: 'Метод — это функция с получателем (receiver). Получатель — это переменная типа, к которому привязан метод. Аналогия: если структура — это существительное (собака), то методы — это глаголы (собака.Лаять(), собака.Бежать()).'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "math"\n)\n\ntype Circle struct {\n    Radius float64\n}\n\n// Метод: func (получатель ТипПолучателя) ИмяМетода(параметры) возврат\nfunc (c Circle) Area() float64 {\n    return math.Pi * c.Radius * c.Radius\n}\n\nfunc (c Circle) Perimeter() float64 {\n    return 2 * math.Pi * c.Radius\n}\n\nfunc (c Circle) String() string {\n    return fmt.Sprintf("Круг(r=%.2f)", c.Radius)\n}\n\nfunc main() {\n    c := Circle{Radius: 5}\n    \n    fmt.Println(c.String())                    // Круг(r=5.00)\n    fmt.Printf("Площадь: %.2f\\n", c.Area())   // 78.54\n    fmt.Printf("Периметр: %.2f\\n", c.Perimeter()) // 31.42\n    \n    // Метод можно вызвать и через указатель\n    p := &c\n    fmt.Printf("Через указатель: %.2f\\n", p.Area()) // 78.54\n}'
        },
        {
          type: 'note',
          value: 'Метод — это просто функция с первым аргументом-получателем. (c Circle) Area() — то же самое что CircleArea(c Circle). Это синтаксический сахар, но он улучшает читаемость и позволяет реализовывать интерфейсы.'
        }
      ]
    },
    {
      id: 2,
      title: 'Value receiver vs Pointer receiver',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Два вида получателей'
        },
        {
          type: 'text',
          value: 'Value receiver (c Circle) получает копию структуры. Pointer receiver (*c Circle) получает указатель на оригинал. Аналогия: value receiver — читать книгу в библиотеке (только читаем, не пишем), pointer receiver — взять книгу домой (можем делать заметки).'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Counter struct {\n    count int\n}\n\n// Value receiver — получает КОПИЮ, не изменяет оригинал\nfunc (c Counter) Value() int {\n    return c.count\n}\n\n// Pointer receiver — получает УКАЗАТЕЛЬ, изменяет оригинал\nfunc (c *Counter) Increment() {\n    c.count++ // изменяем оригинал через указатель\n}\n\nfunc (c *Counter) Reset() {\n    c.count = 0\n}\n\nfunc (c *Counter) Add(n int) {\n    c.count += n\n}\n\nfunc main() {\n    c := Counter{}\n    \n    c.Increment() // Go автоматически берёт &c\n    c.Increment()\n    c.Increment()\n    fmt.Println(c.Value()) // 3\n    \n    c.Add(10)\n    fmt.Println(c.Value()) // 13\n    \n    c.Reset()\n    fmt.Println(c.Value()) // 0\n}'
        },
        {
          type: 'text',
          value: 'Go автоматически берёт адрес или разыменовывает переменную при вызове метода, если это необходимо. Это называется автоматическое взятие адреса (automatic address taking).'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Point struct{ X, Y float64 }\n\nfunc (p *Point) Scale(factor float64) {\n    p.X *= factor\n    p.Y *= factor\n}\n\nfunc (p Point) String() string {\n    return fmt.Sprintf("(%.1f, %.1f)", p.X, p.Y)\n}\n\nfunc main() {\n    p := Point{X: 3, Y: 4}\n    fmt.Println(p)        // (3.0, 4.0)\n    \n    p.Scale(2)            // Go: (&p).Scale(2) автоматически\n    fmt.Println(p)        // (6.0, 8.0)\n    \n    // Но только если переменная адресуема!\n    // Point{3, 4}.Scale(2) // ОШИБКА! Временное значение не адресуемо\n    \n    ptr := &Point{1, 2}\n    ptr.Scale(3)          // уже указатель\n    fmt.Println(*ptr)     // (3.0, 6.0)\n}'
        }
      ]
    },
    {
      id: 3,
      title: 'Когда использовать какой receiver',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Правила выбора получателя'
        },
        {
          type: 'text',
          value: 'Выбор типа получателя — один из важнейших решений при проектировании типа в Go. Есть чёткие правила.'
        },
        {
          type: 'list',
          value: 'Используйте POINTER receiver когда:\n1. Метод изменяет состояние получателя\n2. Структура большая (копирование дорого)\n3. Нужна согласованность с другими методами типа (если есть хоть один pointer receiver — делайте все pointer)\n\nИспользуйте VALUE receiver когда:\n1. Метод не изменяет состояние\n2. Структура маленькая и дешева для копирования\n3. Нужна семантика "только для чтения"'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Temperature struct {\n    celsius float64\n}\n\n// VALUE receiver — читаем данные, не меняем\nfunc (t Temperature) Celsius() float64    { return t.celsius }\nfunc (t Temperature) Fahrenheit() float64 { return t.celsius*9/5 + 32 }\nfunc (t Temperature) Kelvin() float64     { return t.celsius + 273.15 }\nfunc (t Temperature) IsBoiling() bool     { return t.celsius >= 100 }\n\n// POINTER receiver — изменяем данные\nfunc (t *Temperature) SetCelsius(c float64) { t.celsius = c }\nfunc (t *Temperature) SetFahrenheit(f float64) { t.celsius = (f - 32) * 5 / 9 }\n\nfunc main() {\n    t := Temperature{celsius: 20}\n    fmt.Printf("%.1f°C = %.1f°F = %.2fK\\n",\n        t.Celsius(), t.Fahrenheit(), t.Kelvin())\n    // 20.0°C = 68.0°F = 293.15K\n    \n    t.SetFahrenheit(212)\n    fmt.Println("Кипит?", t.IsBoiling()) // true\n}'
        },
        {
          type: 'tip',
          value: 'Если в типе есть хоть один pointer receiver, лучше сделать все методы pointer receiver для согласованности. Иначе могут возникнуть неожиданности при работе с интерфейсами.'
        }
      ]
    },
    {
      id: 4,
      title: 'Методы на пользовательских типах',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Методы не только для структур'
        },
        {
          type: 'text',
          value: 'В Go методы можно добавлять к любому именованному типу, не только к структурам. Это позволяет добавлять поведение к базовым типам: строкам, числам, срезам.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\n// Именованный тип на основе string\ntype Greeting string\n\nfunc (g Greeting) Shout() string {\n    return strings.ToUpper(string(g)) + "!!!"\n}\n\nfunc (g Greeting) Whisper() string {\n    return strings.ToLower(string(g)) + "..."\n}\n\n// Именованный тип на основе среза\ntype IntSlice []int\n\nfunc (s IntSlice) Sum() int {\n    total := 0\n    for _, v := range s {\n        total += v\n    }\n    return total\n}\n\nfunc (s IntSlice) Max() int {\n    if len(s) == 0 {\n        return 0\n    }\n    max := s[0]\n    for _, v := range s[1:] {\n        if v > max {\n            max = v\n        }\n    }\n    return max\n}\n\nfunc main() {\n    g := Greeting("Привет, мир")\n    fmt.Println(g.Shout())   // ПРИВЕТ, МИР!!!\n    fmt.Println(g.Whisper()) // привет, мир...\n    \n    s := IntSlice{3, 1, 4, 1, 5, 9, 2, 6}\n    fmt.Println("Сумма:", s.Sum()) // 31\n    fmt.Println("Макс:", s.Max())  // 9\n}'
        },
        {
          type: 'note',
          value: 'Нельзя добавлять методы к чужим типам (из других пакетов). Нельзя написать func (s string) Shout() — только к своим именованным типам. Для расширения поведения чужих типов создайте обёртку.'
        }
      ]
    },
    {
      id: 5,
      title: 'Наборы методов (Method Sets)',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Что входит в method set?'
        },
        {
          type: 'text',
          value: 'Набор методов (method set) типа определяет, какие интерфейсы он реализует. Value type T имеет методы с value receiver. Pointer type *T имеет методы и с value, и с pointer receiver.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Dog struct {\n    Name string\n}\n\nfunc (d Dog) Speak() string {   // value receiver\n    return d.Name + " говорит: Гав!"\n}\n\nfunc (d *Dog) Rename(name string) { // pointer receiver\n    d.Name = name\n}\n\nfunc main() {\n    // Значение типа Dog\n    dog := Dog{Name: "Рекс"}\n    fmt.Println(dog.Speak())  // Рекс говорит: Гав!\n    dog.Rename("Шарик")       // Go автоматически: (&dog).Rename\n    fmt.Println(dog.Speak())  // Шарик говорит: Гав!\n    \n    // Указатель *Dog имеет ОБА метода\n    pdog := &Dog{Name: "Бобик"}\n    fmt.Println(pdog.Speak()) // Бобик говорит: Гав!\n    pdog.Rename("Белка")\n    fmt.Println(pdog.Speak()) // Белка говорит: Гав!\n}'
        },
        {
          type: 'warning',
          value: 'Method set важен для интерфейсов: если метод объявлен с pointer receiver, то только *T удовлетворяет интерфейсу, а не T. Это частая причина ошибок компиляции при работе с интерфейсами.'
        }
      ]
    },
    {
      id: 6,
      title: 'Цепочки методов (Method Chaining)',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Fluent interface через методы'
        },
        {
          type: 'text',
          value: 'Метод может возвращать сам получатель (указатель на него), что позволяет вызывать методы в цепочке. Аналогия: конвейер сборки — каждый шаг передаёт деталь следующему.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype QueryBuilder struct {\n    table  string\n    where  string\n    limit  int\n    offset int\n}\n\nfunc NewQuery(table string) *QueryBuilder {\n    return &QueryBuilder{table: table, limit: -1}\n}\n\nfunc (q *QueryBuilder) Where(condition string) *QueryBuilder {\n    q.where = condition\n    return q // возвращаем себя для цепочки\n}\n\nfunc (q *QueryBuilder) Limit(n int) *QueryBuilder {\n    q.limit = n\n    return q\n}\n\nfunc (q *QueryBuilder) Offset(n int) *QueryBuilder {\n    q.offset = n\n    return q\n}\n\nfunc (q *QueryBuilder) Build() string {\n    sql := "SELECT * FROM " + q.table\n    if q.where != "" {\n        sql += " WHERE " + q.where\n    }\n    if q.limit > 0 {\n        sql += fmt.Sprintf(" LIMIT %d", q.limit)\n    }\n    if q.offset > 0 {\n        sql += fmt.Sprintf(" OFFSET %d", q.offset)\n    }\n    return sql\n}\n\nfunc main() {\n    query := NewQuery("users").\n        Where("age > 18").\n        Limit(10).\n        Offset(20).\n        Build()\n    \n    fmt.Println(query)\n    // SELECT * FROM users WHERE age > 18 LIMIT 10 OFFSET 20\n}'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Стек с методами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте обобщённый стек целых чисел (Stack) с методами Push, Pop, Peek, IsEmpty и Size. Используйте pointer receiver для методов, изменяющих состояние.',
      requirements: [
        'Структура Stack со скрытым полем items []int',
        'Push(val int) — добавить на вершину',
        'Pop() (int, bool) — снять с вершины, вернуть значение и успех',
        'Peek() (int, bool) — посмотреть вершину без снятия',
        'IsEmpty() bool — пуст ли стек',
        'Size() int — количество элементов'
      ],
      expectedOutput: 'Size: 3\nPeek: 30\nPop: 30\nPop: 20\nSize: 1',
      hint: 'Стек работает по принципу LIFO (последним пришёл — первым ушёл). Используйте срез: Push — append, Pop — последний элемент среза, уменьшение длины на 1.',
      solution: 'package main\n\nimport "fmt"\n\ntype Stack struct {\n    items []int\n}\n\nfunc (s *Stack) Push(val int) {\n    s.items = append(s.items, val)\n}\n\nfunc (s *Stack) Pop() (int, bool) {\n    if len(s.items) == 0 {\n        return 0, false\n    }\n    n := len(s.items)\n    val := s.items[n-1]\n    s.items = s.items[:n-1]\n    return val, true\n}\n\nfunc (s *Stack) Peek() (int, bool) {\n    if len(s.items) == 0 {\n        return 0, false\n    }\n    return s.items[len(s.items)-1], true\n}\n\nfunc (s *Stack) IsEmpty() bool {\n    return len(s.items) == 0\n}\n\nfunc (s *Stack) Size() int {\n    return len(s.items)\n}\n\nfunc main() {\n    s := &Stack{}\n    \n    s.Push(10)\n    s.Push(20)\n    s.Push(30)\n    \n    fmt.Println("Size:", s.Size()) // 3\n    \n    if top, ok := s.Peek(); ok {\n        fmt.Println("Peek:", top) // 30\n    }\n    \n    if val, ok := s.Pop(); ok {\n        fmt.Println("Pop:", val) // 30\n    }\n    if val, ok := s.Pop(); ok {\n        fmt.Println("Pop:", val) // 20\n    }\n    \n    fmt.Println("Size:", s.Size()) // 1\n    fmt.Println("Empty?", s.IsEmpty()) // false\n}',
      explanation: 'Стек — классическая структура данных LIFO. Pointer receivers используются для Push и Pop, так как они изменяют слайс items. Peek и Size только читают данные, но для согласованности тоже используем pointer receiver. Возврат (int, bool) — типичный ok-паттерн для обработки пустого стека.'
    }
  ]
}
