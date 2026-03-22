export default {
  id: 20,
  title: 'Полиморфизм через интерфейсы',
  description: 'Полиморфизм в Go реализуется исключительно через интерфейсы. Изучим как использовать интерфейсы для инъекции зависимостей, тестирования и реализации классических паттернов.',
  lessons: [
    {
      id: 1,
      title: 'Полиморфизм в Go',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Один код — много типов'
        },
        {
          type: 'text',
          value: 'Полиморфизм означает "много форм": один и тот же код работает с разными типами данных. В Go это достигается ТОЛЬКО через интерфейсы (в отличие от Java/C++, где есть и наследование). Аналогия: электрическая розетка — один интерфейс, но к ней можно подключить телевизор, холодильник, компьютер.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Animal interface {\n    Sound() string\n    Name() string\n}\n\ntype Dog struct{ name string }\ntype Cat struct{ name string }\ntype Cow struct{ name string }\n\nfunc (d Dog) Sound() string { return "Гав" }\nfunc (d Dog) Name() string  { return d.name }\n\nfunc (c Cat) Sound() string { return "Мяу" }\nfunc (c Cat) Name() string  { return c.name }\n\nfunc (c Cow) Sound() string { return "Му" }\nfunc (c Cow) Name() string  { return c.name }\n\n// ОДИН код работает со ВСЕМИ животными\nfunc makeNoise(animals []Animal) {\n    for _, a := range animals {\n        fmt.Printf("%s говорит: %s!\\n", a.Name(), a.Sound())\n    }\n}\n\nfunc main() {\n    farm := []Animal{\n        Dog{name: "Рекс"},\n        Cat{name: "Мурка"},\n        Cow{name: "Бурёнка"},\n        Dog{name: "Бобик"},\n    }\n    makeNoise(farm)\n}'
        },
        {
          type: 'note',
          value: 'В Go нет наследования классов. Полиморфизм реализуется исключительно через интерфейсы. Это делает код более явным и простым — нет запутанных иерархий наследования.'
        }
      ]
    },
    {
      id: 2,
      title: 'Интерфейс как контракт',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Проектирование через контракты'
        },
        {
          type: 'text',
          value: 'Интерфейс — это юридический контракт между пользователем и реализацией. Пользователь знает только контракт (что умеет тип), реализация выполняет его. Это разделение позволяет менять реализацию без изменения пользователя.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\n// Контракт: всё, что умеет отправлять сообщения\ntype MessageSender interface {\n    Send(to, message string) error\n    Name() string\n}\n\n// Реализация 1: Email\ntype EmailSender struct {\n    SMTPHost string\n}\n\nfunc (e EmailSender) Send(to, message string) error {\n    fmt.Printf("[EMAIL via %s] Кому: %s | %s\\n", e.SMTPHost, to, message)\n    return nil\n}\nfunc (e EmailSender) Name() string { return "Email" }\n\n// Реализация 2: SMS\ntype SMSSender struct {\n    APIKey string\n}\n\nfunc (s SMSSender) Send(to, message string) error {\n    if len(message) > 160 {\n        return fmt.Errorf("SMS слишком длинный: %d символов", len(message))\n    }\n    fmt.Printf("[SMS] Кому: %s | %s\\n", to, message)\n    return nil\n}\nfunc (s SMSSender) Name() string { return "SMS" }\n\n// Бизнес-логика работает с КОНТРАКТОМ, не с реализацией\nfunc notifyUser(sender MessageSender, user, message string) {\n    fmt.Printf("Отправка через %s...\\n", sender.Name())\n    if err := sender.Send(user, message); err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    fmt.Println("Успешно!")\n}\n\nfunc main() {\n    email := EmailSender{SMTPHost: "smtp.example.com"}\n    sms := SMSSender{APIKey: "secret"}\n    \n    notifyUser(email, "alice@example.com", "Привет, Алиса!")\n    notifyUser(sms, "+7999123456", "Код: 1234")\n    \n    long := strings.Repeat("x", 200)\n    notifyUser(sms, "+7999123456", long) // ошибка!\n}'
        }
      ]
    },
    {
      id: 3,
      title: 'Инъекция зависимостей через интерфейсы',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Dependency Injection — гибкость через интерфейсы'
        },
        {
          type: 'text',
          value: 'Инъекция зависимостей (DI) означает, что зависимости передаются в объект снаружи, а не создаются внутри. Интерфейсы делают DI элегантным в Go. Аналогия: повар (сервис) не выращивает свои продукты — их поставляет поставщик (интерфейс).'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Интерфейс репозитория\ntype UserRepository interface {\n    GetUser(id int) (string, error)\n    SaveUser(id int, name string) error\n}\n\n// Реальная реализация (например, работает с базой данных)\ntype DBUserRepository struct {\n    users map[int]string\n}\n\nfunc NewDBUserRepository() *DBUserRepository {\n    return &DBUserRepository{users: make(map[int]string)}\n}\n\nfunc (r *DBUserRepository) GetUser(id int) (string, error) {\n    name, ok := r.users[id]\n    if !ok {\n        return "", fmt.Errorf("пользователь %d не найден", id)\n    }\n    return name, nil\n}\n\nfunc (r *DBUserRepository) SaveUser(id int, name string) error {\n    r.users[id] = name\n    return nil\n}\n\n// UserService зависит от ИНТЕРФЕЙСА, не от конкретной реализации\ntype UserService struct {\n    repo UserRepository // интерфейс!\n}\n\nfunc NewUserService(repo UserRepository) *UserService {\n    return &UserService{repo: repo}\n}\n\nfunc (s *UserService) Register(id int, name string) error {\n    return s.repo.SaveUser(id, name)\n}\n\nfunc (s *UserService) Greet(id int) (string, error) {\n    name, err := s.repo.GetUser(id)\n    if err != nil {\n        return "", err\n    }\n    return "Привет, " + name + "!", nil\n}\n\nfunc main() {\n    repo := NewDBUserRepository()\n    service := NewUserService(repo) // внедряем зависимость\n    \n    service.Register(1, "Алиса")\n    service.Register(2, "Боб")\n    \n    msg, _ := service.Greet(1)\n    fmt.Println(msg) // Привет, Алиса!\n    \n    _, err := service.Greet(99)\n    fmt.Println(err) // пользователь 99 не найден\n}'
        }
      ]
    },
    {
      id: 4,
      title: 'Тестирование с интерфейсами (mock)',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Mock-объекты через интерфейсы'
        },
        {
          type: 'text',
          value: 'Интерфейсы делают код тестируемым. Вместо реальной базы данных или внешнего API можно создать mock-объект, который реализует тот же интерфейс, но работает предсказуемо в тестах.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "errors"\n)\n\ntype UserRepository interface {\n    GetUser(id int) (string, error)\n    SaveUser(id int, name string) error\n}\n\n// Mock для тестирования — реализует тот же интерфейс!\ntype MockUserRepository struct {\n    users     map[int]string\n    saveCalls int\n    getCalls  int\n    shouldFail bool // для тестирования ошибок\n}\n\nfunc NewMock() *MockUserRepository {\n    return &MockUserRepository{users: make(map[int]string)}\n}\n\nfunc (m *MockUserRepository) GetUser(id int) (string, error) {\n    m.getCalls++\n    if m.shouldFail {\n        return "", errors.New("симулированная ошибка")\n    }\n    name, ok := m.users[id]\n    if !ok {\n        return "", fmt.Errorf("не найден: %d", id)\n    }\n    return name, nil\n}\n\nfunc (m *MockUserRepository) SaveUser(id int, name string) error {\n    m.saveCalls++\n    m.users[id] = name\n    return nil\n}\n\ntype UserService struct{ repo UserRepository }\n\nfunc (s *UserService) Greet(id int) (string, error) {\n    name, err := s.repo.GetUser(id)\n    if err != nil { return "", err }\n    return "Привет, " + name + "!", nil\n}\n\nfunc main() {\n    // В тесте используем mock\n    mock := NewMock()\n    mock.users[1] = "Алиса"\n    \n    service := &UserService{repo: mock}\n    \n    msg, err := service.Greet(1)\n    fmt.Println(msg, err) // Привет, Алиса! <nil>\n    \n    // Тест с ошибкой\n    mock.shouldFail = true\n    _, err = service.Greet(1)\n    fmt.Println("Ошибка:", err) // Ошибка: симулированная ошибка\n    \n    fmt.Println("Вызовов GetUser:", mock.getCalls) // 2\n}'
        },
        {
          type: 'tip',
          value: 'Это ключевое преимущество интерфейсов для тестирования. Тесты с mock-объектами работают быстро, предсказуемо и не требуют реальных зависимостей (БД, сеть, файловая система).'
        }
      ]
    },
    {
      id: 5,
      title: 'sort.Interface',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Сортировка через интерфейс'
        },
        {
          type: 'text',
          value: 'Пакет sort предоставляет sort.Interface — классический пример интерфейса в стандартной библиотеке. Реализуй три метода и получи бесплатную сортировку. Это не наследование — это контракт.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "sort"\n)\n\ntype Person struct {\n    Name string\n    Age  int\n}\n\n// ByAge реализует sort.Interface для []Person по возрасту\ntype ByAge []Person\n\nfunc (a ByAge) Len() int           { return len(a) }\nfunc (a ByAge) Less(i, j int) bool { return a[i].Age < a[j].Age }\nfunc (a ByAge) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }\n\n// ByName реализует sort.Interface по имени\ntype ByName []Person\n\nfunc (n ByName) Len() int           { return len(n) }\nfunc (n ByName) Less(i, j int) bool { return n[i].Name < n[j].Name }\nfunc (n ByName) Swap(i, j int)      { n[i], n[j] = n[j], n[i] }\n\nfunc main() {\n    people := []Person{\n        {"Боб", 31},\n        {"Алиса", 25},\n        {"Кэрол", 28},\n        {"Дэн", 22},\n    }\n    \n    sort.Sort(ByAge(people))\n    fmt.Println("По возрасту:")\n    for _, p := range people {\n        fmt.Printf("  %s (%d)\\n", p.Name, p.Age)\n    }\n    \n    sort.Sort(ByName(people))\n    fmt.Println("По имени:")\n    for _, p := range people {\n        fmt.Printf("  %s (%d)\\n", p.Name, p.Age)\n    }\n    \n    // Удобнее через sort.Slice (Go 1.8+)\n    sort.Slice(people, func(i, j int) bool {\n        return people[i].Age < people[j].Age\n    })\n    fmt.Println("Снова по возрасту (slice):")\n    for _, p := range people {\n        fmt.Printf("  %s (%d)\\n", p.Name, p.Age)\n    }\n}'
        }
      ]
    },
    {
      id: 6,
      title: 'Интерфейс error',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'error — самый маленький интерфейс Go'
        },
        {
          type: 'text',
          value: 'Тип error — это встроенный интерфейс с единственным методом Error() string. Любой тип с методом Error() string реализует error. Это позволяет создавать богатые типы ошибок с дополнительными данными.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Интерфейс error определён как:\n// type error interface {\n//     Error() string\n// }\n\n// Создаём свой тип ошибки\ntype ValidationError struct {\n    Field   string\n    Message string\n    Value   interface{}\n}\n\nfunc (e *ValidationError) Error() string {\n    return fmt.Sprintf("валидация поля %s: %s (значение: %v)", e.Field, e.Message, e.Value)\n}\n\ntype NotFoundError struct {\n    ID   int\n    Type string\n}\n\nfunc (e *NotFoundError) Error() string {\n    return fmt.Sprintf("%s с ID=%d не найден", e.Type, e.ID)\n}\n\nfunc validateAge(age int) error {\n    if age < 0 || age > 150 {\n        return &ValidationError{\n            Field:   "age",\n            Message: "должно быть от 0 до 150",\n            Value:   age,\n        }\n    }\n    return nil\n}\n\nfunc findUser(id int) (string, error) {\n    users := map[int]string{1: "Алиса", 2: "Боб"}\n    if name, ok := users[id]; ok {\n        return name, nil\n    }\n    return "", &NotFoundError{ID: id, Type: "Пользователь"}\n}\n\nfunc main() {\n    // Использование типовых ошибок\n    if err := validateAge(-5); err != nil {\n        fmt.Println(err)\n        // Приведение к конкретному типу\n        if ve, ok := err.(*ValidationError); ok {\n            fmt.Println("Поле:", ve.Field)\n        }\n    }\n    \n    _, err := findUser(99)\n    fmt.Println(err) // Пользователь с ID=99 не найден\n}'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Платёжная система',
      type: 'practice',
      difficulty: 'hard',
      description: 'Разработайте систему обработки платежей с интерфейсом PaymentProcessor. Реализуйте несколько процессоров (CreditCard, Crypto, BankTransfer) и функцию ProcessPayment, которая работает с любым процессором.',
      requirements: [
        'Интерфейс PaymentProcessor с методами Charge(amount float64) error, Name() string, IsAvailable() bool',
        'Реализации: CreditCardProcessor, CryptoProcessor, BankTransferProcessor',
        'Функция ProcessPayment(processor PaymentProcessor, amount float64) error',
        'Функция FindAvailable(processors []PaymentProcessor) PaymentProcessor',
        'Демонстрация полиморфизма: один код работает со всеми процессорами'
      ],
      expectedOutput: 'Оплата через Credit Card: 100.00\nОплата через Crypto: 100.00\nNot Available недоступен\nДоступный процессор: Credit Card',
      hint: 'Каждый процессор имеет свои условия доступности (например, CreditCard всегда доступен, Crypto — только если курс нормальный). FindAvailable итерируется по списку и возвращает первый доступный.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "errors"\n)\n\ntype PaymentProcessor interface {\n    Charge(amount float64) error\n    Name() string\n    IsAvailable() bool\n}\n\ntype CreditCardProcessor struct {\n    CardNumber string\n    Limit      float64\n    Balance    float64\n}\n\nfunc (c *CreditCardProcessor) Charge(amount float64) error {\n    if amount > c.Limit-c.Balance {\n        return fmt.Errorf("превышен лимит карты: доступно %.2f", c.Limit-c.Balance)\n    }\n    c.Balance += amount\n    fmt.Printf("[CreditCard] Списано %.2f. Баланс: %.2f/%.2f\\n", amount, c.Balance, c.Limit)\n    return nil\n}\nfunc (c *CreditCardProcessor) Name() string        { return "Credit Card" }\nfunc (c *CreditCardProcessor) IsAvailable() bool   { return true }\n\ntype CryptoProcessor struct {\n    Wallet    string\n    Available bool\n}\n\nfunc (c *CryptoProcessor) Charge(amount float64) error {\n    if !c.Available {\n        return errors.New("крипто-шлюз недоступен")\n    }\n    fmt.Printf("[Crypto] Переводим %.2f на кошелёк %s\\n", amount, c.Wallet)\n    return nil\n}\nfunc (c *CryptoProcessor) Name() string      { return "Crypto" }\nfunc (c *CryptoProcessor) IsAvailable() bool { return c.Available }\n\ntype BankTransferProcessor struct {\n    BankCode  string\n    available bool\n}\n\nfunc (b *BankTransferProcessor) Charge(amount float64) error {\n    fmt.Printf("[Bank] Банковский перевод %.2f (код: %s)\\n", amount, b.BankCode)\n    return nil\n}\nfunc (b *BankTransferProcessor) Name() string      { return "Bank Transfer" }\nfunc (b *BankTransferProcessor) IsAvailable() bool { return b.available }\n\nfunc ProcessPayment(processor PaymentProcessor, amount float64) error {\n    if !processor.IsAvailable() {\n        return fmt.Errorf("%s недоступен", processor.Name())\n    }\n    fmt.Printf("Оплата через %s: %.2f\\n", processor.Name(), amount)\n    return processor.Charge(amount)\n}\n\nfunc FindAvailable(processors []PaymentProcessor) PaymentProcessor {\n    for _, p := range processors {\n        if p.IsAvailable() {\n            return p\n        }\n    }\n    return nil\n}\n\nfunc main() {\n    cc := &CreditCardProcessor{CardNumber: "4111-1111", Limit: 1000}\n    crypto := &CryptoProcessor{Wallet: "0xABC123", Available: true}\n    notAvail := &BankTransferProcessor{BankCode: "RU123", available: false}\n    \n    ProcessPayment(cc, 100)\n    ProcessPayment(crypto, 100)\n    \n    err := ProcessPayment(notAvail, 100)\n    fmt.Println(err)\n    \n    processors := []PaymentProcessor{notAvail, cc, crypto}\n    available := FindAvailable(processors)\n    if available != nil {\n        fmt.Println("Доступный процессор:", available.Name())\n    }\n}',
      explanation: 'Интерфейс PaymentProcessor позволяет ProcessPayment и FindAvailable работать с любым типом платежа без знания деталей реализации. Это и есть полиморфизм: один код, много поведений. Добавление нового процессора (PayPal, Stripe) не требует изменения существующего кода — только реализации интерфейса.'
    }
  ]
}
