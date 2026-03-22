export default {
  id: 34,
  title: 'Работа с командной строкой',
  description: 'os.Args, пакет flag, флаги, подкоманды, переменные окружения os.Getenv',
  lessons: [
    {
      id: 1,
      title: 'os.Args — аргументы командной строки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда вы запускаете программу с аргументами (например, ./myapp --name Алия --count 5), эти аргументы доступны через os.Args. Это срез строк, первый элемент которого — путь к исполняемому файлу.' },
        { type: 'text', value: 'Представьте, что os.Args — это список команд официанту: первое слово — название ресторана, остальные — ваш заказ.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "os"\n    "strconv"\n)\n\nfunc main() {\n    // os.Args[0] — путь к программе\n    // os.Args[1:] — все аргументы\n    fmt.Println("Программа:", os.Args[0])\n    fmt.Println("Аргументы:", os.Args[1:])\n    fmt.Println("Количество аргументов:", len(os.Args)-1)\n\n    // Простейший парсинг аргументов вручную\n    if len(os.Args) < 3 {\n        fmt.Fprintf(os.Stderr, "Использование: %s <имя> <возраст>\\n", os.Args[0])\n        os.Exit(1)\n    }\n\n    name := os.Args[1]\n    age, err := strconv.Atoi(os.Args[2])\n    if err != nil {\n        fmt.Fprintf(os.Stderr, "Ошибка: возраст должен быть числом\\n")\n        os.Exit(1)\n    }\n\n    fmt.Printf("Привет, %s! Тебе %d лет.\\n", name, age)\n}' },
        { type: 'code', language: 'bash', value: '$ go run main.go Алия 25\nПрограмма: /tmp/go-build.../main\nАргументы: [Алия 25]\nКоличество аргументов: 2\nПривет, Алия! Тебе 25 лет.' },
        { type: 'note', value: 'Прямой парсинг os.Args подходит только для простейших программ. Для флагов вида --name=Алия -n 5 используйте пакет flag.' }
      ]
    },
    {
      id: 2,
      title: 'Пакет flag — флаги командной строки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пакет flag позволяет легко определять именованные флаги для вашей программы. Флаги — это параметры вида -name Алия или -count=5. Пакет автоматически парсит их, генерирует справку и обрабатывает ошибки.' },
        { type: 'heading', value: 'Базовые типы флагов' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "flag"\n    "fmt"\n)\n\nfunc main() {\n    // Определяем флаги: flag.Тип(имя, значение_по_умолчанию, описание)\n    name    := flag.String("name", "Мир", "имя для приветствия")\n    count   := flag.Int("count", 1, "сколько раз приветствовать")\n    verbose := flag.Bool("verbose", false, "подробный вывод")\n    price   := flag.Float64("price", 0.0, "цена товара")\n\n    // ОБЯЗАТЕЛЬНО вызвать Parse() перед использованием флагов\n    flag.Parse()\n\n    // Флаги — это указатели, разыменовываем их через *\n    if *verbose {\n        fmt.Printf("Запуск с флагами: name=%s count=%d\\n", *name, *count)\n    }\n\n    for i := 0; i < *count; i++ {\n        fmt.Printf("Привет, %s!\\n", *name)\n    }\n\n    if *price > 0 {\n        fmt.Printf("Цена: %.2f₽\\n", *price)\n    }\n}' },
        { type: 'code', language: 'bash', value: '$ go run main.go -name Алия -count 3 -verbose\nЗапуск с флагами: name=Алия count=3\nПривет, Алия!\nПривет, Алия!\nПривет, Алия!\n\n# Автоматическая справка через -h или -help\n$ go run main.go -help\nUsage of /tmp/...:\n  -count int\n        сколько раз приветствовать (default 1)\n  -name string\n        имя для приветствия (default "Мир")\n  -price float\n        цена товара (default 0)\n  -verbose\n        подробный вывод' },
        { type: 'tip', value: 'Флаги можно задавать несколькими способами: -flag, -flag=value, -flag value, --flag, --flag=value. Go принимает все варианты.' }
      ]
    },
    {
      id: 3,
      title: 'flag.Var — пользовательские типы флагов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда встроенных типов (String, Int, Bool) недостаточно. Что если флаг должен принимать список значений или специальный формат? flag.Var позволяет создавать флаги любых типов.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "flag"\n    "fmt"\n    "strings"\n)\n\n// stringSlice — флаг для списка строк: -tag go -tag web -tag api\ntype stringSlice []string\n\nfunc (s *stringSlice) String() string {\n    return strings.Join(*s, ", ")\n}\n\nfunc (s *stringSlice) Set(value string) error {\n    *s = append(*s, value)\n    return nil\n}\n\nfunc main() {\n    var tags stringSlice\n    flag.Var(&tags, "tag", "тег (можно указать несколько раз)")\n\n    host := flag.String("host", "localhost", "хост сервера")\n    port := flag.Int("port", 8080, "порт сервера")\n\n    flag.Parse()\n\n    fmt.Printf("Сервер: %s:%d\\n", *host, *port)\n    fmt.Printf("Теги: %v\\n", tags)\n}\n\n// Запуск:\n// ./app -host example.com -port 443 -tag go -tag web -tag api\n// Сервер: example.com:443\n// Теги: [go web api]' },
        { type: 'heading', value: 'Флаги с привязкой к существующей переменной' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "flag"\n    "fmt"\n)\n\nfunc main() {\n    var name string\n    var count int\n\n    // Вариант с привязкой к существующей переменной\n    flag.StringVar(&name, "name", "Мир", "имя")\n    flag.IntVar(&count, "count", 1, "количество")\n\n    flag.Parse()\n\n    // Теперь name и count — не указатели, используем напрямую\n    for i := 0; i < count; i++ {\n        fmt.Printf("Привет, %s!\\n", name)\n    }\n}' },
        { type: 'note', value: 'flag.StringVar (с Var на конце) работает со ссылкой на существующую переменную — не нужно разыменовывать указатель. Это удобнее когда переменная уже объявлена в структуре конфига.' }
      ]
    },
    {
      id: 4,
      title: 'Подкоманды — FlagSet',
      type: 'theory',
      content: [
        { type: 'text', value: 'Многие CLI-инструменты поддерживают подкоманды: git commit, git push, docker run, docker build. В Go подкоманды реализуются через flag.NewFlagSet — отдельный набор флагов для каждой подкоманды.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "flag"\n    "fmt"\n    "os"\n)\n\nfunc main() {\n    // Создаём FlagSet для каждой подкоманды\n    addCmd := flag.NewFlagSet("add", flag.ExitOnError)\n    listCmd := flag.NewFlagSet("list", flag.ExitOnError)\n\n    // Флаги для подкоманды "add"\n    addName := addCmd.String("name", "", "название задачи")\n    addPrio := addCmd.Int("priority", 1, "приоритет (1-5)")\n\n    // Флаги для подкоманды "list"\n    listAll := listCmd.Bool("all", false, "показать выполненные задачи")\n    listLimit := listCmd.Int("limit", 10, "максимум задач")\n\n    if len(os.Args) < 2 {\n        fmt.Println("Использование: todo <подкоманда> [флаги]")\n        fmt.Println("Подкоманды: add, list")\n        os.Exit(1)\n    }\n\n    switch os.Args[1] {\n    case "add":\n        addCmd.Parse(os.Args[2:])\n        if *addName == "" {\n            fmt.Fprintln(os.Stderr, "ошибка: -name обязателен")\n            addCmd.Usage()\n            os.Exit(1)\n        }\n        fmt.Printf("Добавлена задача: %q (приоритет %d)\\n", *addName, *addPrio)\n\n    case "list":\n        listCmd.Parse(os.Args[2:])\n        fmt.Printf("Список задач (лимит: %d, все: %v)\\n", *listLimit, *listAll)\n\n    default:\n        fmt.Fprintf(os.Stderr, "неизвестная подкоманда: %s\\n", os.Args[1])\n        os.Exit(1)\n    }\n}' },
        { type: 'code', language: 'bash', value: '$ ./todo add -name "Написать тесты" -priority 3\nДобавлена задача: "Написать тесты" (приоритет 3)\n\n$ ./todo list -all -limit 20\nСписок задач (лимит: 20, все: true)\n\n$ ./todo add -help\nUsage of add:\n  -name string\n        название задачи\n  -priority int\n        приоритет (1-5) (default 1)' }
      ]
    },
    {
      id: 5,
      title: 'Переменные окружения — os.Getenv',
      type: 'theory',
      content: [
        { type: 'text', value: 'Переменные окружения (environment variables) — это настройки, передаваемые программе через операционную систему. Они часто используются для конфигурации в Docker-контейнерах, Kubernetes и CI/CD. Это как параметры, прошитые в саму среду выполнения, а не переданные через командную строку.' },
        { type: 'heading', value: 'Чтение переменных окружения' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "os"\n    "strconv"\n)\n\ntype Config struct {\n    DBHost     string\n    DBPort     int\n    DBPassword string\n    Debug      bool\n}\n\nfunc loadConfig() Config {\n    cfg := Config{\n        // Значения по умолчанию\n        DBHost: "localhost",\n        DBPort: 5432,\n        Debug:  false,\n    }\n\n    // os.Getenv возвращает "" если переменная не установлена\n    if host := os.Getenv("DB_HOST"); host != "" {\n        cfg.DBHost = host\n    }\n\n    if portStr := os.Getenv("DB_PORT"); portStr != "" {\n        port, err := strconv.Atoi(portStr)\n        if err != nil {\n            fmt.Fprintf(os.Stderr, "DB_PORT должен быть числом: %v\\n", err)\n            os.Exit(1)\n        }\n        cfg.DBPort = port\n    }\n\n    // Обязательная переменная — падаем если не задана\n    cfg.DBPassword = os.Getenv("DB_PASSWORD")\n    if cfg.DBPassword == "" {\n        fmt.Fprintln(os.Stderr, "DB_PASSWORD обязателен")\n        os.Exit(1)\n    }\n\n    cfg.Debug = os.Getenv("DEBUG") == "true"\n\n    return cfg\n}\n\nfunc main() {\n    cfg := loadConfig()\n    fmt.Printf("Подключаемся к %s:%d (debug=%v)\\n",\n        cfg.DBHost, cfg.DBPort, cfg.Debug)\n}' },
        { type: 'heading', value: 'os.LookupEnv — различие между пустой строкой и отсутствием' },
        { type: 'code', language: 'go', value: '// os.Getenv вернёт "" и если переменная не задана, и если задана пустой строкой\n// os.LookupEnv позволяет отличить эти случаи\nvalue, ok := os.LookupEnv("MY_VAR")\nif !ok {\n    fmt.Println("MY_VAR не задана")\n} else {\n    fmt.Printf("MY_VAR = %q\\n", value) // выведет "" если задана пустой строкой\n}' },
        { type: 'heading', value: 'Установка переменных окружения' },
        { type: 'code', language: 'bash', value: '# Запуск с переменными окружения\nDB_HOST=db.example.com DB_PASSWORD=secret ./myapp\n\n# Или через export\nexport DB_HOST=db.example.com\nexport DB_PASSWORD=secret\n./myapp\n\n# В Docker\ndocker run -e DB_HOST=db.example.com -e DB_PASSWORD=secret myapp' },
        { type: 'tip', value: 'Для сложной конфигурации используйте библиотеку github.com/kelseyhightower/envconfig или github.com/caarlos0/env — они автоматически заполняют struct из переменных окружения.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: CLI утилита для конвертации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите CLI утилиту для конвертации температур. Программа должна принимать значение и единицы измерения через флаги и выводить результат.',
      requirements: [
        'Флаг -value float64 — значение температуры (обязателен)',
        'Флаг -from string — исходная единица: c, f, k (по умолчанию "c")',
        'Флаг -to string — целевая единица: c, f, k (по умолчанию "f")',
        'Переменная окружения TEMP_PRECISION (int) задаёт количество знаков после запятой (по умолчанию 2)',
        'При неверных флагах вывести понятное сообщение об ошибке в stderr'
      ],
      expectedOutput: '25.00°C = 77.00°F',
      hint: 'Конвертируйте через Кельвин как промежуточный шаг: C→K (+273.15), F→K ((F-32)*5/9+273.15), K→C (-273.15), K→F ((K-273.15)*9/5+32). Читайте TEMP_PRECISION через os.Getenv + strconv.Atoi.',
      solution: 'package main\n\nimport (\n    "flag"\n    "fmt"\n    "math"\n    "os"\n    "strconv"\n    "strings"\n)\n\nfunc toKelvin(value float64, unit string) (float64, error) {\n    switch strings.ToLower(unit) {\n    case "c":\n        return value + 273.15, nil\n    case "f":\n        return (value-32)*5/9 + 273.15, nil\n    case "k":\n        return value, nil\n    }\n    return 0, fmt.Errorf("неизвестная единица: %s (используйте c, f, k)", unit)\n}\n\nfunc fromKelvin(kelvin float64, unit string) (float64, error) {\n    switch strings.ToLower(unit) {\n    case "c":\n        return kelvin - 273.15, nil\n    case "f":\n        return (kelvin-273.15)*9/5 + 32, nil\n    case "k":\n        return kelvin, nil\n    }\n    return 0, fmt.Errorf("неизвестная единица: %s (используйте c, f, k)", unit)\n}\n\nfunc unitSymbol(unit string) string {\n    switch strings.ToLower(unit) {\n    case "c": return "°C"\n    case "f": return "°F"\n    case "k": return "K"\n    }\n    return unit\n}\n\nfunc main() {\n    var value float64\n    from := flag.String("from", "c", "исходная единица (c, f, k)")\n    to   := flag.String("to",   "f", "целевая единица (c, f, k)")\n    flag.Float64Var(&value, "value", math.NaN(), "значение температуры")\n    flag.Parse()\n\n    if math.IsNaN(value) {\n        fmt.Fprintln(os.Stderr, "ошибка: флаг -value обязателен")\n        flag.Usage()\n        os.Exit(1)\n    }\n\n    precision := 2\n    if p := os.Getenv("TEMP_PRECISION"); p != "" {\n        if n, err := strconv.Atoi(p); err == nil && n >= 0 {\n            precision = n\n        }\n    }\n\n    kelvin, err := toKelvin(value, *from)\n    if err != nil {\n        fmt.Fprintln(os.Stderr, "ошибка:", err)\n        os.Exit(1)\n    }\n\n    result, err := fromKelvin(kelvin, *to)\n    if err != nil {\n        fmt.Fprintln(os.Stderr, "ошибка:", err)\n        os.Exit(1)\n    }\n\n    format := fmt.Sprintf("%%.%df%%s = %%.%df%%s\\n", precision, precision)\n    fmt.Printf(format, value, unitSymbol(*from), result, unitSymbol(*to))\n}',
      explanation: 'Программа использует промежуточную конвертацию через Кельвин — это универсальный подход для работы с температурными единицами. math.NaN() как значение по умолчанию позволяет определить, был ли флаг -value задан пользователем. TEMP_PRECISION читается из окружения с безопасным дефолтом. Код ошибок выводится в stderr, результат — в stdout.'
    }
  ]
}
