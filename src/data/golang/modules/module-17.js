export default {
  id: 17,
  title: 'Структуры (struct)',
  description: 'Структуры в Go — основной способ группировки связанных данных. Go использует структуры вместо классов, это основа объектно-ориентированного программирования в Go.',
  lessons: [
    {
      id: 1,
      title: 'Определение структур',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'struct — пользовательский тип данных'
        },
        {
          type: 'text',
          value: 'Структура в Go — это способ объединить несколько полей разных типов в одну единицу. Аналогия: анкета человека содержит имя (строка), возраст (число), адрес (строка). Это и есть структура: несколько разных данных об одном объекте.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Определение структуры\ntype Person struct {\n    Name    string\n    Age     int\n    Email   string\n    IsAdmin bool\n}\n\n// Вложенная структура\ntype Address struct {\n    City    string\n    Country string\n    ZipCode string\n}\n\ntype Employee struct {\n    Person  // встроенная структура (embedding)\n    Company string\n    Salary  float64\n    Address Address // вложенная (не встроенная)\n}\n\nfunc main() {\n    // Просто объявить тип\n    var p Person\n    fmt.Printf("%+v\\n", p) // {Name: Age:0 Email: IsAdmin:false}\n}'
        },
        {
          type: 'note',
          value: 'По соглашению, экспортируемые типы (видимые за пределами пакета) начинаются с заглавной буквы. Поля тоже: Name — экспортировано, name — нет. Это единственный механизм инкапсуляции в Go.'
        }
      ]
    },
    {
      id: 2,
      title: 'Создание экземпляров',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Способы создания структур'
        },
        {
          type: 'text',
          value: 'Существует несколько способов создать экземпляр структуры. Как собрать конструктор Лего: можно положить детали по одной или создать всё сразу по инструкции.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Point struct {\n    X, Y float64\n}\n\ntype Person struct {\n    Name string\n    Age  int\n}\n\nfunc main() {\n    // Способ 1: нулевые значения\n    var p1 Person\n    fmt.Println(p1) // { 0}\n    \n    // Способ 2: с указанием имён полей (рекомендуется)\n    p2 := Person{Name: "Алиса", Age: 30}\n    fmt.Println(p2) // {Алиса 30}\n    \n    // Способ 3: позиционный (не рекомендуется для > 2 полей)\n    p3 := Person{"Боб", 25}\n    fmt.Println(p3) // {Боб 25}\n    \n    // Способ 4: указатель на структуру\n    p4 := &Person{Name: "Кэрол", Age: 35}\n    fmt.Println(p4)  // &{Кэрол 35}\n    fmt.Println(*p4) // {Кэрол 35}\n    \n    // Способ 5: new()\n    p5 := new(Person)\n    p5.Name = "Дэн"\n    p5.Age = 28\n    fmt.Println(*p5) // {Дэн 28}\n    \n    pt := Point{X: 1.5, Y: 2.5}\n    fmt.Println(pt) // {1.5 2.5}\n}'
        },
        {
          type: 'tip',
          value: 'Всегда используйте именованные поля при создании структур (Person{Name: "Алиса", Age: 30}). Это защищает код от ошибок при добавлении новых полей в структуру.'
        }
      ]
    },
    {
      id: 3,
      title: 'Доступ к полям',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Чтение и запись полей'
        },
        {
          type: 'text',
          value: 'Доступ к полям структуры осуществляется через точку (.). Для указателей на структуры Go автоматически разыменовывает — не нужно писать (*p).Name.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Rectangle struct {\n    Width  float64\n    Height float64\n}\n\nfunc (r Rectangle) Area() float64 {\n    return r.Width * r.Height\n}\n\nfunc (r Rectangle) Perimeter() float64 {\n    return 2 * (r.Width + r.Height)\n}\n\nfunc main() {\n    rect := Rectangle{Width: 10, Height: 5}\n    \n    // Доступ к полям\n    fmt.Println("Ширина:", rect.Width)    // 10\n    fmt.Println("Высота:", rect.Height)   // 5\n    \n    // Изменение полей\n    rect.Width = 20\n    fmt.Println("Новая ширина:", rect.Width) // 20\n    \n    // Поля в вычислениях\n    fmt.Printf("Площадь: %.2f\\n", rect.Area())      // 100.00\n    fmt.Printf("Периметр: %.2f\\n", rect.Perimeter()) // 50.00\n    \n    // Указатель: автоматическое разыменование\n    p := &rect\n    p.Width = 30 // то же что (*p).Width = 30\n    fmt.Println("rect.Width:", rect.Width) // 30\n}'
        }
      ]
    },
    {
      id: 4,
      title: 'Анонимные структуры',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Структуры без имени'
        },
        {
          type: 'text',
          value: 'Анонимные структуры определяются и используются без присвоения типу имени. Удобны для разовых конфигураций, тестовых данных, локальных группировок.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Анонимная структура как переменная\n    user := struct {\n        Name  string\n        Email string\n        Age   int\n    }{\n        Name:  "Алиса",\n        Email: "alice@example.com",\n        Age:   30,\n    }\n    fmt.Println(user.Name) // Алиса\n    \n    // Слайс анонимных структур — удобно для тестовых данных\n    tests := []struct {\n        input    int\n        expected int\n    }{\n        {2, 4},\n        {3, 9},\n        {4, 16},\n    }\n    \n    for _, tt := range tests {\n        result := tt.input * tt.input\n        if result != tt.expected {\n            fmt.Printf("FAIL: %d^2 = %d, хотели %d\\n", tt.input, result, tt.expected)\n        } else {\n            fmt.Printf("OK: %d^2 = %d\\n", tt.input, result)\n        }\n    }\n}'
        },
        {
          type: 'tip',
          value: 'Слайс анонимных структур — стандартный паттерн для табличных тестов в Go. Каждый элемент описывает один тестовый случай с входными данными и ожидаемым результатом.'
        }
      ]
    },
    {
      id: 5,
      title: 'Сравнение структур',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Когда структуры можно сравнивать?'
        },
        {
          type: 'text',
          value: 'Структуры можно сравнивать через == если все их поля сравнимы. Нельзя сравнивать структуры, содержащие слайсы, карты или функции — для них нужно использовать reflect.DeepEqual или написать метод Equal().'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "reflect"\n)\n\ntype Point struct {\n    X, Y int\n}\n\ntype Complex struct {\n    Name  string\n    Items []int // слайс нельзя сравнивать через ==\n}\n\nfunc main() {\n    p1 := Point{1, 2}\n    p2 := Point{1, 2}\n    p3 := Point{3, 4}\n    \n    fmt.Println(p1 == p2) // true — все поля равны\n    fmt.Println(p1 == p3) // false — поля различаются\n    fmt.Println(p1 != p3) // true\n    \n    // Структуры со слайсами нельзя сравнивать через ==\n    c1 := Complex{Name: "test", Items: []int{1, 2, 3}}\n    c2 := Complex{Name: "test", Items: []int{1, 2, 3}}\n    \n    // c1 == c2 // ОШИБКА КОМПИЛЯЦИИ!\n    \n    // Используйте reflect.DeepEqual\n    fmt.Println(reflect.DeepEqual(c1, c2)) // true\n}'
        }
      ]
    },
    {
      id: 6,
      title: 'Теги структур',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Метаданные для полей — struct tags'
        },
        {
          type: 'text',
          value: 'Теги структур — это метаданные в обратных кавычках после типа поля. Они используются пакетами для сериализации (JSON, XML, YAML, DB). Это как стикеры на коробках: сами не содержат данных, но говорят системе, как с ними работать.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n)\n\ntype User struct {\n    ID       int    `json:"id"`\n    Name     string `json:"name"`\n    Email    string `json:"email,omitempty"` // omitempty: пропустить если пустое\n    Password string `json:"-"`               // - : никогда не сериализовать\n    Age      int    `json:"age,string"`      // string: сериализовать как строку\n}\n\nfunc main() {\n    user := User{\n        ID:       1,\n        Name:     "Алиса",\n        Email:    "alice@example.com",\n        Password: "секрет",\n        Age:      30,\n    }\n    \n    // Сериализация в JSON\n    data, err := json.MarshalIndent(user, "", "  ")\n    if err != nil {\n        panic(err)\n    }\n    fmt.Println(string(data))\n    // {\n    //   "id": 1,\n    //   "name": "Алиса",\n    //   "email": "alice@example.com",\n    //   "age": "30"\n    // }\n    // Заметьте: Password отсутствует!\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n)\n\ntype Product struct {\n    ID    int     `json:"id"`\n    Name  string  `json:"name"`\n    Price float64 `json:"price"`\n    Stock int     `json:"stock,omitempty"`\n}\n\nfunc main() {\n    // Десериализация из JSON\n    jsonStr := `{"id": 1, "name": "Ноутбук", "price": 999.99}`\n    \n    var p Product\n    err := json.Unmarshal([]byte(jsonStr), &p)\n    if err != nil {\n        panic(err)\n    }\n    fmt.Printf("%+v\\n", p) // {ID:1 Name:Ноутбук Price:999.99 Stock:0}\n}'
        }
      ]
    },
    {
      id: 7,
      title: 'Конструкторы и функции создания',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Паттерн конструктора в Go'
        },
        {
          type: 'text',
          value: 'В Go нет встроенных конструкторов. Вместо этого используется соглашение: функция NewТип() *Тип. Это обычная функция, которая создаёт и инициализирует структуру. Аналогия: заводская линия — все экземпляры создаются по единому стандарту.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "errors"\n)\n\ntype BankAccount struct {\n    owner   string // приватные поля!\n    balance float64\n}\n\n// Конструктор — единственный способ создать правильный счёт\nfunc NewBankAccount(owner string, initialBalance float64) (*BankAccount, error) {\n    if owner == "" {\n        return nil, errors.New("имя владельца не может быть пустым")\n    }\n    if initialBalance < 0 {\n        return nil, errors.New("начальный баланс не может быть отрицательным")\n    }\n    return &BankAccount{\n        owner:   owner,\n        balance: initialBalance,\n    }, nil\n}\n\nfunc (a *BankAccount) Deposit(amount float64) error {\n    if amount <= 0 {\n        return errors.New("сумма должна быть положительной")\n    }\n    a.balance += amount\n    return nil\n}\n\nfunc (a *BankAccount) Balance() float64 {\n    return a.balance\n}\n\nfunc (a *BankAccount) String() string {\n    return fmt.Sprintf("Счёт[%s]: %.2f", a.owner, a.balance)\n}\n\nfunc main() {\n    acc, err := NewBankAccount("Алиса", 1000)\n    if err != nil {\n        panic(err)\n    }\n    fmt.Println(acc)            // Счёт[Алиса]: 1000.00\n    acc.Deposit(500)\n    fmt.Println(acc.Balance())  // 1500\n    \n    _, err = NewBankAccount("", 100)\n    fmt.Println(err) // имя владельца не может быть пустым\n}'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Библиотека книг',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте систему управления библиотекой книг. Реализуйте структуру Book и Library с методами добавления, поиска и вывода книг.',
      requirements: [
        'Структура Book: ID int, Title string, Author string, Year int, Available bool',
        'Структура Library со слайсом книг',
        'Конструктор NewLibrary() *Library',
        'Метод AddBook(book Book) добавляет книгу',
        'Метод FindByAuthor(author string) []Book возвращает книги автора',
        'Метод Available() []Book возвращает доступные книги'
      ],
      expectedOutput: 'Книг в библиотеке: 3\nКниги Толстого: 2\nДоступных книг: 2',
      hint: 'Используйте append для добавления книг. В FindByAuthor итерируйтесь по всем книгам и проверяйте поле Author.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\ntype Book struct {\n    ID        int\n    Title     string\n    Author    string\n    Year      int\n    Available bool\n}\n\ntype Library struct {\n    books  []Book\n    nextID int\n}\n\nfunc NewLibrary() *Library {\n    return &Library{nextID: 1}\n}\n\nfunc (l *Library) AddBook(title, author string, year int) {\n    l.books = append(l.books, Book{\n        ID:        l.nextID,\n        Title:     title,\n        Author:    author,\n        Year:      year,\n        Available: true,\n    })\n    l.nextID++\n}\n\nfunc (l *Library) FindByAuthor(author string) []Book {\n    var result []Book\n    for _, b := range l.books {\n        if strings.EqualFold(b.Author, author) {\n            result = append(result, b)\n        }\n    }\n    return result\n}\n\nfunc (l *Library) Available() []Book {\n    var result []Book\n    for _, b := range l.books {\n        if b.Available {\n            result = append(result, b)\n        }\n    }\n    return result\n}\n\nfunc (l *Library) Count() int {\n    return len(l.books)\n}\n\nfunc main() {\n    lib := NewLibrary()\n    lib.AddBook("Война и мир", "Толстой", 1869)\n    lib.AddBook("Анна Каренина", "Толстой", 1877)\n    lib.AddBook("Преступление и наказание", "Достоевский", 1866)\n    \n    // Выдать книгу\n    lib.books[2].Available = false\n    \n    fmt.Println("Книг в библиотеке:", lib.Count())\n    \n    tolstoy := lib.FindByAuthor("Толстой")\n    fmt.Println("Книги Толстого:", len(tolstoy))\n    \n    avail := lib.Available()\n    fmt.Println("Доступных книг:", len(avail))\n    \n    for _, b := range avail {\n        fmt.Printf("  - %s (%s, %d)\\n", b.Title, b.Author, b.Year)\n    }\n}',
      explanation: 'Конструктор NewLibrary() обеспечивает правильную инициализацию структуры. Приватные поля books и nextID защищены от прямого доступа снаружи пакета. Методы предоставляют контролируемый интерфейс для работы с данными — это основы инкапсуляции в Go.'
    }
  ]
}
