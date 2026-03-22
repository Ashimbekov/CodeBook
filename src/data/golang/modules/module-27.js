export default {
  id: 27,
  title: 'Форматирование (fmt)',
  description: 'Пакет fmt — один из самых используемых в Go. Printf, Sprintf, Fprintf, Scanf — мощные инструменты форматирования вывода и чтения ввода. Изучите все глаголы форматирования.',
  lessons: [
    {
      id: 1,
      title: 'Глаголы форматирования %d %s %f %v',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Глаголы форматирования (format verbs) — это шаблоны вида %что, которые заменяются конкретными значениями при форматировании. Как бланк с пустыми полями: вы заполняете их нужными данными.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Числа\n    n := 42\n    f := 3.14159\n    \n    fmt.Printf("%d\\n", n)        // 42 (десятичное целое)\n    fmt.Printf("%5d\\n", n)       //    42 (ширина 5, выравнивание вправо)\n    fmt.Printf("%-5d|\\n", n)     // 42    | (выравнивание влево)\n    fmt.Printf("%05d\\n", n)      // 00042 (дополнение нулями)\n    fmt.Printf("%+d\\n", n)       // +42 (знак)\n    \n    fmt.Printf("%b\\n", n)        // 101010 (двоичный)\n    fmt.Printf("%o\\n", n)        // 52 (восьмеричный)\n    fmt.Printf("%x\\n", n)        // 2a (шестнадцатеричный, нижний)\n    fmt.Printf("%X\\n", n)        // 2A (шестнадцатеричный, верхний)\n    fmt.Printf("%#x\\n", n)       // 0x2a (с префиксом)\n    \n    fmt.Printf("%f\\n", f)        // 3.141590 (с плавающей точкой)\n    fmt.Printf("%.2f\\n", f)      // 3.14 (2 знака после точки)\n    fmt.Printf("%8.2f\\n", f)     //     3.14 (ширина 8, 2 знака)\n    fmt.Printf("%e\\n", f)        // 3.141590e+00 (экспоненциальный)\n    fmt.Printf("%g\\n", f)        // 3.14159 (краткий)\n    \n    // Строки\n    s := "Привет"\n    fmt.Printf("%s\\n", s)        // Привет\n    fmt.Printf("%10s\\n", s)      //     Привет (ширина 10)\n    fmt.Printf("%-10s|\\n", s)    // Привет     | (влево)\n    fmt.Printf("%q\\n", s)        // "Привет" (с кавычками)\n    \n    // Символ\n    fmt.Printf("%c\\n", 65)       // A (как символ)\n    fmt.Printf("%U\\n", \'А\')     // U+0410 (Unicode)\n}'
        }
      ]
    },
    {
      id: 2,
      title: 'Глаголы %v, %+v, %#v, %T',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Универсальные глаголы %v, %+v, %#v особенно полезны при отладке. %T показывает тип значения. Это как рентген для данных: видно всё внутреннее устройство.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Address struct {\n    Street string\n    City   string\n}\n\ntype Person struct {\n    Name    string\n    Age     int\n    Address Address\n    Hobbies []string\n}\n\nfunc main() {\n    p := Person{\n        Name: "Нурик",\n        Age:  30,\n        Address: Address{\n            Street: "ул. Абая 5",\n            City:   "Алматы",\n        },\n        Hobbies: []string{"Go", "читать", "готовить"},\n    }\n    \n    // %v — значение по умолчанию\n    fmt.Printf("%v\\n", p)\n    // {Нурик 30 {ул. Абая 5 Алматы} [Go читать готовить]}\n    \n    // %+v — с именами полей (очень полезно!)\n    fmt.Printf("%+v\\n", p)\n    // {Name:Нурик Age:30 Address:{Street:ул. Абая 5 City:Алматы} Hobbies:[Go читать готовить]}\n    \n    // %#v — синтаксис Go (можно скопировать в код!)\n    fmt.Printf("%#v\\n", p)\n    // main.Person{Name:"Нурик", Age:30, Address:main.Address{...}}\n    \n    // %T — тип значения\n    fmt.Printf("%T\\n", p)              // main.Person\n    fmt.Printf("%T\\n", 42)             // int\n    fmt.Printf("%T\\n", 3.14)           // float64\n    fmt.Printf("%T\\n", []int{1,2,3})  // []int\n    fmt.Printf("%T\\n", map[string]int{}) // map[string]int\n    \n    // %v для разных типов\n    fmt.Printf("%v\\n", true)           // true\n    fmt.Printf("%v\\n", []int{1,2,3})  // [1 2 3]\n    fmt.Printf("%v\\n", map[string]int{"a": 1}) // map[a:1]\n    \n    // Указатели\n    ptr := &p\n    fmt.Printf("%v\\n", ptr)    // &{Нурик 30 ...}\n    fmt.Printf("%p\\n", ptr)    // 0xc000... (адрес)\n}'
        },
        {
          type: 'tip',
          value: '%+v — ваш лучший друг при отладке структур. %#v — когда нужно видеть синтаксис Go. %T — когда не уверены в типе переменной.'
        }
      ]
    },
    {
      id: 3,
      title: 'Sprintf — форматирование в строку',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Sprintf форматирует строку, но не выводит её — возвращает как значение. Sprint и Sprintln — аналоги без форматирования. Используйте Sprintf для подготовки строк к дальнейшему использованию.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Product struct {\n    Name  string\n    Price float64\n    Stock int\n}\n\nfunc (p Product) String() string {\n    return fmt.Sprintf("Product{%s: %.2f тг, %d шт.}", p.Name, p.Price, p.Stock)\n}\n\nfunc formatTable(products []Product) string {\n    var result string\n    header := fmt.Sprintf("%-20s %10s %10s\\n", "Название", "Цена", "Остаток")\n    separator := fmt.Sprintf("%s\\n", fmt.Sprintf("%.*s", 42, "=========================================="))\n    \n    result += header + separator\n    for _, p := range products {\n        result += fmt.Sprintf("%-20s %10.2f %10d\\n", p.Name, p.Price, p.Stock)\n    }\n    return result\n}\n\nfunc main() {\n    // Sprintf — строка без вывода\n    name := "Нурик"\n    age := 30\n    greeting := fmt.Sprintf("Привет, %s! Тебе %d лет.", name, age)\n    fmt.Println(greeting)\n    \n    // Подготовка сообщений для логирования\n    level := "ERROR"\n    msg := "соединение потеряно"\n    logEntry := fmt.Sprintf("[%s] %s", level, msg)\n    fmt.Println(logEntry) // [ERROR] соединение потеряно\n    \n    // Sprint — конкатенация без разделителя\n    s1 := fmt.Sprint("Привет", " ", "мир")\n    fmt.Println(s1) // Привет мир\n    \n    // Sprint добавляет пробелы между операндами если оба не строки\n    s2 := fmt.Sprint(1, 2, 3)\n    fmt.Println(s2) // 1 2 3\n    \n    // Sprintln всегда добавляет пробелы и перевод строки\n    s3 := fmt.Sprintln("Hello", "World")\n    fmt.Print(s3) // Hello World\\n\n    \n    // Форматирование таблицы\n    products := []Product{\n        {"Ноутбук", 249999.99, 5},\n        {"Мышь", 4999.50, 42},\n        {"Клавиатура", 12500.00, 18},\n    }\n    fmt.Println(formatTable(products))\n}'
        }
      ]
    },
    {
      id: 4,
      title: 'Fprintf — вывод в io.Writer',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Fprintf пишет в любой io.Writer: файл, HTTP-ответ, буфер, os.Stderr. Это делает код гибким — одна функция работает с любым назначением вывода.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "os"\n    "strings"\n)\n\nfunc logMessage(w fmt.Stringer, level, msg string) {\n    // Стандартный вывод\n    fmt.Fprintf(os.Stdout, "[%s] %s\\n", level, msg)\n}\n\nfunc generateReport(w fmt.Stringer, data map[string]int) {\n    // В реальном коде w было бы io.Writer, упрощаем для примера\n}\n\nfunc main() {\n    // Fprintf в os.Stdout (то же что fmt.Printf)\n    fmt.Fprintf(os.Stdout, "Версия: %s\\n", "1.0.0")\n    \n    // Fprintf в os.Stderr (для ошибок)\n    fmt.Fprintf(os.Stderr, "WARN: %s\\n", "что-то пошло не так")\n    \n    // Fprintf в strings.Builder\n    var sb strings.Builder\n    items := []string{"яблоко", "банан", "вишня"}\n    for i, item := range items {\n        fmt.Fprintf(&sb, "%d. %s\\n", i+1, item)\n    }\n    fmt.Println(sb.String())\n    \n    // Fprintf в файл\n    f, err := os.CreateTemp("", "report*.txt")\n    if err == nil {\n        defer f.Close()\n        defer os.Remove(f.Name())\n        \n        fmt.Fprintf(f, "=== Отчёт ===\\n")\n        fmt.Fprintf(f, "Дата: 2024-01-15\\n")\n        fmt.Fprintf(f, "Итого: %d записей\\n", 42)\n        \n        // Читаем обратно\n        f.Seek(0, 0)\n        buf := make([]byte, 100)\n        n, _ := f.Read(buf)\n        fmt.Printf("Содержимое файла:\\n%s", buf[:n])\n    }\n    \n    // Errorf — создание ошибки через форматирование\n    err = fmt.Errorf("ошибка в строке %d: %s", 42, "неожиданный символ")\n    fmt.Println(err)\n}'
        }
      ]
    },
    {
      id: 5,
      title: 'fmt.Stringer — пользовательское форматирование',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Интерфейс fmt.Stringer позволяет типам определять своё строковое представление. Если тип реализует String() string, пакет fmt будет использовать его при выводе через %v, %s или Println.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Направление как iota\ntype Direction int\n\nconst (\n    North Direction = iota\n    South\n    East\n    West\n)\n\n// Stringer для Direction\nfunc (d Direction) String() string {\n    switch d {\n    case North:\n        return "Север"\n    case South:\n        return "Юг"\n    case East:\n        return "Восток"\n    case West:\n        return "Запад"\n    }\n    return fmt.Sprintf("Direction(%d)", int(d))\n}\n\n// Статус HTTP\ntype HTTPStatus struct {\n    Code    int\n    Message string\n}\n\nfunc (s HTTPStatus) String() string {\n    return fmt.Sprintf("%d %s", s.Code, s.Message)\n}\n\n// Цвет в RGB\ntype Color struct {\n    R, G, B uint8\n}\n\nfunc (c Color) String() string {\n    return fmt.Sprintf("#%02X%02X%02X", c.R, c.G, c.B)\n}\n\n// GoStringer — для %#v\nfunc (c Color) GoString() string {\n    return fmt.Sprintf("Color{R:%d, G:%d, B:%d}", c.R, c.G, c.B)\n}\n\nfunc main() {\n    dir := North\n    fmt.Println(dir)           // Север (использует String())\n    fmt.Printf("%v\\n", dir)    // Север\n    fmt.Printf("%s\\n", dir)    // Север\n    fmt.Printf("%d\\n", dir)    // 0 (игнорирует String()!)\n    \n    status := HTTPStatus{Code: 404, Message: "Not Found"}\n    fmt.Println(status)        // 404 Not Found\n    \n    color := Color{R: 255, G: 128, B: 0}\n    fmt.Println(color)         // #FF8000\n    fmt.Printf("%v\\n", color)  // #FF8000\n    fmt.Printf("%#v\\n", color) // Color{R:255, G:128, B:0} (GoString)\n    \n    // Stringer с указателем\n    dirs := []Direction{North, East, South, West}\n    fmt.Println(dirs) // [Север Восток Юг Запад]\n}'
        },
        {
          type: 'note',
          value: 'fmt.Formatter — более мощный интерфейс для кастомного форматирования с поддержкой всех глаголов и флагов. Реализуйте Format(f fmt.State, verb rune) для полного контроля.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Форматированный отчёт',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте систему форматированного вывода для отчёта о продажах.',
      requirements: [
        'Создать тип Sale с полями Product string, Quantity int, Price float64, Date string',
        'Реализовать String() string для Sale — одна строка: "2024-01-15 | Ноутбук | 2 шт. | 499999.98 тг"',
        'Функция FormatReport(sales []Sale) string возвращает отформатированную таблицу с заголовком, разделителем и строками данных',
        'Функция FormatSummary(sales []Sale) string возвращает итоги: количество продаж, общая сумма, средний чек',
        'Использовать Sprintf для форматирования чисел с разделителем тысяч (функция formatNumber(n float64) string)',
        'В main() создать слайс продаж и вывести полный отчёт'
      ],
      expectedOutput: '=== Отчёт о продажах ===\nДата       | Товар           | Кол-во | Сумма\n-----------+-----------------+--------+----------\n2024-01-15 | Ноутбук         |      2 | 499999.98\n...\n=== Итоги ===\nПродаж: 3 | Итого: 524 998.48 тг | Средний чек: 174 999.49 тг',
      hint: 'Используйте fmt.Sprintf с %-ширина для выравнивания по левому краю, %ширина для правого. strings.Repeat("=", n) для разделителей.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\ntype Sale struct {\n    Product  string\n    Quantity int\n    Price    float64\n    Date     string\n}\n\nfunc (s Sale) Total() float64 {\n    return float64(s.Quantity) * s.Price\n}\n\nfunc (s Sale) String() string {\n    return fmt.Sprintf("%s | %-20s | %d шт. | %.2f тг",\n        s.Date, s.Product, s.Quantity, s.Total())\n}\n\nfunc FormatReport(sales []Sale) string {\n    var sb strings.Builder\n    \n    header := fmt.Sprintf("%-10s | %-20s | %6s | %12s\\n",\n        "Дата", "Товар", "Кол-во", "Сумма")\n    sep := strings.Repeat("-", 57) + "\\n"\n    \n    sb.WriteString("=== Отчёт о продажах ===\\n")\n    sb.WriteString(header)\n    sb.WriteString(sep)\n    \n    for _, s := range sales {\n        sb.WriteString(fmt.Sprintf("%-10s | %-20s | %6d | %12.2f\\n",\n            s.Date, s.Product, s.Quantity, s.Total()))\n    }\n    \n    return sb.String()\n}\n\nfunc FormatSummary(sales []Sale) string {\n    var total float64\n    for _, s := range sales {\n        total += s.Total()\n    }\n    avg := 0.0\n    if len(sales) > 0 {\n        avg = total / float64(len(sales))\n    }\n    return fmt.Sprintf("=== Итоги ===\\nПродаж: %d | Итого: %.2f тг | Средний чек: %.2f тг",\n        len(sales), total, avg)\n}\n\nfunc main() {\n    sales := []Sale{\n        {Product: "Ноутбук", Quantity: 2, Price: 249999.99, Date: "2024-01-15"},\n        {Product: "Мышь беспроводная", Quantity: 5, Price: 4999.50, Date: "2024-01-16"},\n        {Product: "Клавиатура", Quantity: 1, Price: 12500.00, Date: "2024-01-17"},\n    }\n    \n    fmt.Println(FormatReport(sales))\n    fmt.Println(FormatSummary(sales))\n    \n    fmt.Println("\\nКаждая продажа:")\n    for _, s := range sales {\n        fmt.Println(" ", s)\n    }\n}',
      explanation: 'fmt.Sprintf с форматными глаголами %-20s и %6d обеспечивает выравнивание колонок таблицы. Метод String() реализует интерфейс Stringer для вывода через Println. strings.Builder эффективно собирает многострочный отчёт.'
    }
  ]
}
