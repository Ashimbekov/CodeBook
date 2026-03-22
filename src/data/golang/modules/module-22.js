export default {
  id: 22,
  title: 'Обработка ошибок',
  description: 'В Go ошибки — это обычные значения, а не исключения. Этот подход делает код явным и предсказуемым. Научитесь правильно создавать, оборачивать и проверять ошибки.',
  lessons: [
    {
      id: 1,
      title: 'Интерфейс error',
      content: [
        {
          type: 'text',
          value: 'В Go ошибка — это просто значение, реализующее интерфейс error. В других языках ошибки "бросаются" (throw) и "ловятся" (catch), создавая невидимые пути выполнения. В Go ошибки возвращаются явно, как обычные значения.'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Интерфейс error из стандартной библиотеки Go\ntype error interface {\n    Error() string\n}'
        },
        {
          type: 'text',
          value: 'Это весь интерфейс — одна строка! Любой тип, у которого есть метод Error() string, является ошибкой. Как конверт с надписью "Ошибка": внутри может быть что угодно, но снаружи — всегда читаемое сообщение.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\nfunc divide(a, b float64) (float64, error) {\n    if b == 0 {\n        return 0, errors.New("деление на ноль")\n    }\n    return a / b, nil\n}\n\nfunc main() {\n    // Успешный случай\n    result, err := divide(10, 2)\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    fmt.Println("Результат:", result) // 5\n    \n    // Ошибочный случай\n    result, err = divide(10, 0)\n    if err != nil {\n        fmt.Println("Ошибка:", err) // деление на ноль\n        return\n    }\n    fmt.Println("Результат:", result)\n}'
        },
        {
          type: 'note',
          value: 'В Go принято всегда проверять ошибки сразу после вызова функции. Паттерн "if err != nil" встречается в Go-коде очень часто — это не недостаток языка, а явность обработки ошибок.'
        },
        {
          type: 'tip',
          value: 'nil — нулевое значение для интерфейса error. Когда функция возвращает nil в качестве ошибки, значит всё прошло успешно.'
        }
      ]
    },
    {
      id: 2,
      title: 'errors.New и базовое создание ошибок',
      content: [
        {
          type: 'text',
          value: 'Пакет errors предоставляет простую функцию New для создания ошибок. Это самый базовый способ создания ошибок в Go.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\n// Создание ошибок\nvar (\n    ErrNotFound   = errors.New("объект не найден")\n    ErrPermission = errors.New("нет прав доступа")\n    ErrTimeout    = errors.New("превышено время ожидания")\n)\n\nfunc getUser(id int) (string, error) {\n    users := map[int]string{\n        1: "Айжан",\n        2: "Нурик",\n        3: "Болат",\n    }\n    \n    user, ok := users[id]\n    if !ok {\n        return "", ErrNotFound\n    }\n    return user, nil\n}\n\nfunc main() {\n    // Успех\n    name, err := getUser(1)\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n    } else {\n        fmt.Println("Пользователь:", name) // Айжан\n    }\n    \n    // Ошибка\n    name, err = getUser(99)\n    if err != nil {\n        fmt.Println("Ошибка:", err) // объект не найден\n        \n        // Сравнение ошибок\n        if err == ErrNotFound {\n            fmt.Println("Можно создать нового пользователя")\n        }\n    }\n}'
        },
        {
          type: 'warning',
          value: 'errors.New создаёт новый уникальный объект при каждом вызове! Два вызова errors.New("то же сообщение") создадут разные объекты. Поэтому сентинельные ошибки (ErrNotFound и т.п.) объявляют как переменные пакетного уровня.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\nfunc main() {\n    // Разные объекты — одинаковое сообщение\n    e1 := errors.New("ошибка")\n    e2 := errors.New("ошибка")\n    \n    fmt.Println(e1 == e2)          // false! разные объекты\n    fmt.Println(e1.Error() == e2.Error()) // true — одинаковый текст\n    \n    // Одна и та же переменная — один объект\n    var ErrCustom = errors.New("моя ошибка")\n    err := ErrCustom\n    fmt.Println(err == ErrCustom)  // true\n}'
        }
      ]
    },
    {
      id: 3,
      title: 'fmt.Errorf с %w — оборачивание ошибок',
      content: [
        {
          type: 'text',
          value: 'Часто нужно добавить контекст к ошибке: где она произошла, при каких условиях. Используйте fmt.Errorf с глаголом %w для оборачивания оригинальной ошибки. Это как матрёшка: внешняя ошибка содержит внутреннюю.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\nvar ErrNotFound = errors.New("не найден")\n\nfunc findUser(id int) (string, error) {\n    if id <= 0 {\n        return "", fmt.Errorf("findUser: неверный ID %d", id)\n    }\n    if id > 100 {\n        // Оборачиваем ErrNotFound с контекстом\n        return "", fmt.Errorf("findUser: пользователь %d: %w", id, ErrNotFound)\n    }\n    return "Пользователь", nil\n}\n\nfunc getProfile(userID int) (string, error) {\n    user, err := findUser(userID)\n    if err != nil {\n        // Добавляем ещё один уровень контекста\n        return "", fmt.Errorf("getProfile: %w", err)\n    }\n    return "Профиль: " + user, nil\n}\n\nfunc handleRequest(userID int) error {\n    _, err := getProfile(userID)\n    if err != nil {\n        return fmt.Errorf("handleRequest: %w", err)\n    }\n    return nil\n}\n\nfunc main() {\n    err := handleRequest(999)\n    if err != nil {\n        // Полная цепочка ошибок\n        fmt.Println(err)\n        // handleRequest: getProfile: findUser: пользователь 999: не найден\n        \n        // Проверяем самую глубокую ошибку\n        if errors.Is(err, ErrNotFound) {\n            fmt.Println("Пользователь не найден в системе")\n        }\n    }\n}'
        },
        {
          type: 'heading',
          value: 'Разница между %v и %w'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\nvar ErrBase = errors.New("базовая ошибка")\n\nfunc main() {\n    // %v — просто форматирует текст, НЕ оборачивает\n    errV := fmt.Errorf("обёртка: %v", ErrBase)\n    fmt.Println(errors.Is(errV, ErrBase)) // false! связь потеряна\n    \n    // %w — оборачивает, сохраняет цепочку\n    errW := fmt.Errorf("обёртка: %w", ErrBase)\n    fmt.Println(errors.Is(errW, ErrBase)) // true! цепочка сохранена\n    \n    fmt.Println(errV) // обёртка: базовая ошибка\n    fmt.Println(errW) // обёртка: базовая ошибка (текст одинаковый!)\n}'
        },
        {
          type: 'note',
          value: 'Используйте %w когда хотите, чтобы вызывающий код мог проверить тип исходной ошибки через errors.Is или errors.As. Используйте %v когда вам нужен только текст ошибки.'
        }
      ]
    },
    {
      id: 4,
      title: 'errors.Is и errors.As',
      content: [
        {
          type: 'text',
          value: 'errors.Is и errors.As позволяют проверять и извлекать ошибки из цепочки обёрток. Как рентген — видят сквозь все слои обёрток до самой сути.'
        },
        {
          type: 'heading',
          value: 'errors.Is — проверка идентичности'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\nvar (\n    ErrNotFound   = errors.New("не найден")\n    ErrPermission = errors.New("нет прав")\n)\n\nfunc fetchData(id int, adminOnly bool) error {\n    if id > 1000 {\n        return fmt.Errorf("fetchData id=%d: %w", id, ErrNotFound)\n    }\n    if adminOnly {\n        return fmt.Errorf("fetchData: доступ ограничен: %w", ErrPermission)\n    }\n    return nil\n}\n\nfunc processRequest(id int) error {\n    err := fetchData(id, true)\n    if err != nil {\n        return fmt.Errorf("processRequest: %w", err)\n    }\n    return nil\n}\n\nfunc main() {\n    err := processRequest(5)\n    \n    // errors.Is проходит всю цепочку обёрток\n    fmt.Println(errors.Is(err, ErrPermission)) // true\n    fmt.Println(errors.Is(err, ErrNotFound))   // false\n    \n    // Обработка конкретных случаев\n    switch {\n    case errors.Is(err, ErrNotFound):\n        fmt.Println("Ресурс не найден, показываем 404")\n    case errors.Is(err, ErrPermission):\n        fmt.Println("Нет прав, перенаправляем на логин") // <- это выполнится\n    default:\n        fmt.Println("Неизвестная ошибка:", err)\n    }\n}'
        },
        {
          type: 'heading',
          value: 'errors.As — извлечение типа ошибки'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\n// Ошибка с дополнительными данными\ntype ValidationError struct {\n    Field   string\n    Message string\n}\n\nfunc (e *ValidationError) Error() string {\n    return fmt.Sprintf("валидация поля %s: %s", e.Field, e.Message)\n}\n\nfunc validateAge(age int) error {\n    if age < 0 || age > 150 {\n        return &ValidationError{\n            Field:   "age",\n            Message: fmt.Sprintf("значение %d вне допустимого диапазона [0, 150]", age),\n        }\n    }\n    return nil\n}\n\nfunc createUser(name string, age int) error {\n    if err := validateAge(age); err != nil {\n        return fmt.Errorf("createUser %s: %w", name, err)\n    }\n    return nil\n}\n\nfunc main() {\n    err := createUser("Нурик", -5)\n    \n    // errors.As — извлекаем конкретный тип из цепочки\n    var validErr *ValidationError\n    if errors.As(err, &validErr) {\n        fmt.Printf("Поле: %s\\n", validErr.Field)     // age\n        fmt.Printf("Причина: %s\\n", validErr.Message) // значение -5 вне...\n    }\n    \n    fmt.Println(err) // createUser Нурик: валидация поля age: значение -5...\n}'
        },
        {
          type: 'tip',
          value: 'errors.Is — для проверки конкретных ошибок-значений (sentinel errors). errors.As — для извлечения ошибок-типов (custom error types). Оба работают через всю цепочку обёрток.'
        }
      ]
    },
    {
      id: 5,
      title: 'Сентинельные ошибки (sentinel errors)',
      content: [
        {
          type: 'text',
          value: 'Сентинельные ошибки — это заранее объявленные переменные-ошибки пакетного уровня. Как маяки в море: заметные, неизменные, служат ориентирами. Вызывающий код может сравнивать полученную ошибку с сентинелями.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "errors"\n    "fmt"\n    "strconv"\n)\n\n// Сентинельные ошибки пакета\nvar (\n    ErrInvalidInput = errors.New("неверные входные данные")\n    ErrOverflow     = errors.New("переполнение")\n    ErrUnderflow    = errors.New("отрицательное значение")\n)\n\nfunc parsePositiveInt(s string) (int, error) {\n    if s == "" {\n        return 0, fmt.Errorf("parsePositiveInt: %w", ErrInvalidInput)\n    }\n    \n    n, err := strconv.Atoi(s)\n    if err != nil {\n        return 0, fmt.Errorf("parsePositiveInt %q: %w", s, ErrInvalidInput)\n    }\n    \n    if n < 0 {\n        return 0, fmt.Errorf("parsePositiveInt: %d: %w", n, ErrUnderflow)\n    }\n    \n    if n > 1000000 {\n        return 0, fmt.Errorf("parsePositiveInt: %d: %w", n, ErrOverflow)\n    }\n    \n    return n, nil\n}\n\nfunc main() {\n    testCases := []string{"42", "-5", "abc", "", "9999999"}\n    \n    for _, tc := range testCases {\n        n, err := parsePositiveInt(tc)\n        if err != nil {\n            switch {\n            case errors.Is(err, ErrInvalidInput):\n                fmt.Printf("  [НЕКОРРЕКТНЫЙ ВВОД] %q -> %v\\n", tc, err)\n            case errors.Is(err, ErrUnderflow):\n                fmt.Printf("  [ОТРИЦАТЕЛЬНОЕ] %q -> %v\\n", tc, err)\n            case errors.Is(err, ErrOverflow):\n                fmt.Printf("  [ПЕРЕПОЛНЕНИЕ] %q -> %v\\n", tc, err)\n            }\n        } else {\n            fmt.Printf("  [OK] %q -> %d\\n", tc, n)\n        }\n    }\n}'
        },
        {
          type: 'note',
          value: 'Соглашение: сентинельные ошибки именуются с префиксом Err (ErrNotFound, ErrTimeout). Их объявляют в начале файла или в отдельном файле errors.go пакета.'
        },
        {
          type: 'heading',
          value: 'Сентинельные ошибки из стандартной библиотеки'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "errors"\n    "fmt"\n    "io"\n    "strings"\n)\n\nfunc main() {\n    // io.EOF — знаменитая сентинельная ошибка\n    r := strings.NewReader("Hello")\n    buf := make([]byte, 3)\n    \n    for {\n        n, err := r.Read(buf)\n        if err != nil {\n            if errors.Is(err, io.EOF) {\n                fmt.Println("Конец файла достигнут")\n                break\n            }\n            fmt.Println("Ошибка чтения:", err)\n            break\n        }\n        fmt.Printf("Прочитано %d байт: %s\\n", n, buf[:n])\n    }\n}'
        }
      ]
    },
    {
      id: 6,
      title: 'Оборачивание ошибок (error wrapping)',
      content: [
        {
          type: 'text',
          value: 'Оборачивание ошибок позволяет строить "стек" контекста, подобно трассировке стека в исключениях. Каждый слой добавляет информацию о том, что делал этот уровень программы.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\nvar ErrDatabase = errors.New("ошибка базы данных")\n\n// Нижний уровень: работа с БД\nfunc queryDB(query string) error {\n    // Симулируем ошибку подключения\n    return fmt.Errorf("queryDB %q: соединение отклонено: %w", query, ErrDatabase)\n}\n\n// Средний уровень: репозиторий\nfunc findUserByID(id int) (string, error) {\n    err := queryDB(fmt.Sprintf("SELECT * FROM users WHERE id = %d", id))\n    if err != nil {\n        return "", fmt.Errorf("findUserByID(%d): %w", id, err)\n    }\n    return "user", nil\n}\n\n// Верхний уровень: сервис\nfunc getUserInfo(id int) (string, error) {\n    user, err := findUserByID(id)\n    if err != nil {\n        return "", fmt.Errorf("getUserInfo: %w", err)\n    }\n    return user, nil\n}\n\nfunc main() {\n    _, err := getUserInfo(42)\n    if err != nil {\n        // Полная цепочка\n        fmt.Println("Ошибка:", err)\n        fmt.Println()\n        \n        // Разворачиваем ошибку вручную\n        fmt.Println("=== Цепочка ошибок ===")\n        for e := err; e != nil; e = errors.Unwrap(e) {\n            fmt.Printf("  -> %v\\n", e)\n        }\n        \n        // Проверяем корневую причину\n        if errors.Is(err, ErrDatabase) {\n            fmt.Println("\\nКорневая причина: проблема с базой данных")\n        }\n    }\n}'
        },
        {
          type: 'heading',
          value: 'errors.Unwrap — ручное разворачивание'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\ntype MyError struct {\n    Code    int\n    Message string\n    Wrapped error\n}\n\nfunc (e *MyError) Error() string {\n    return fmt.Sprintf("[%d] %s", e.Code, e.Message)\n}\n\n// Реализуем Unwrap чтобы поддержать цепочку\nfunc (e *MyError) Unwrap() error {\n    return e.Wrapped\n}\n\nfunc main() {\n    base := errors.New("база")\n    mid := &MyError{Code: 500, Message: "средний", Wrapped: base}\n    top := fmt.Errorf("верхний: %w", mid)\n    \n    fmt.Println(top)                      // верхний: [500] средний\n    fmt.Println(errors.Is(top, base))     // true\n    fmt.Println(errors.Unwrap(top))       // [500] средний\n    fmt.Println(errors.Unwrap(errors.Unwrap(top))) // база\n}'
        }
      ]
    },
    {
      id: 7,
      title: 'Паттерны обработки ошибок',
      content: [
        {
          type: 'text',
          value: 'Рассмотрим устоявшиеся паттерны работы с ошибками в Go-коде.'
        },
        {
          type: 'heading',
          value: 'Паттерн: ранний возврат'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\nfunc processUser(name, email string, age int) error {\n    // Ранний возврат при ошибке — код не вложен\n    if name == "" {\n        return fmt.Errorf("имя не может быть пустым")\n    }\n    if len(name) < 2 {\n        return fmt.Errorf("имя слишком короткое: %q", name)\n    }\n    if !strings.Contains(email, "@") {\n        return fmt.Errorf("неверный email: %q", email)\n    }\n    if age < 0 || age > 150 {\n        return fmt.Errorf("неверный возраст: %d", age)\n    }\n    \n    // Основная логика только здесь — не в else-ветках\n    fmt.Printf("Создаём пользователя: %s (%s), %d лет\\n", name, email, age)\n    return nil\n}\n\nfunc main() {\n    cases := []struct{ name, email string; age int }{\n        {"", "a@b.com", 25},\n        {"А", "a@b.com", 25},\n        {"Нурик", "нет-собаки", 25},\n        {"Нурик", "nk@mail.ru", -1},\n        {"Нурик", "nk@mail.ru", 25},\n    }\n    for _, c := range cases {\n        if err := processUser(c.name, c.email, c.age); err != nil {\n            fmt.Println("Ошибка:", err)\n        }\n    }\n}'
        },
        {
          type: 'heading',
          value: 'Паттерн: errWriter (избегаем повторения if err != nil)'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\n// errWriter — паттерн для последовательных операций\ntype errWriter struct {\n    sb  strings.Builder\n    err error\n}\n\nfunc (ew *errWriter) write(s string) {\n    if ew.err != nil {\n        return // если уже есть ошибка — пропускаем\n    }\n    if s == "" {\n        ew.err = fmt.Errorf("пустая строка не разрешена")\n        return\n    }\n    ew.sb.WriteString(s)\n}\n\nfunc buildDocument(parts []string) (string, error) {\n    ew := &errWriter{}\n    \n    ew.write("<html>\\n")\n    for _, part := range parts {\n        ew.write(part)\n        ew.write("\\n")\n    }\n    ew.write("</html>")\n    \n    if ew.err != nil {\n        return "", fmt.Errorf("buildDocument: %w", ew.err)\n    }\n    return ew.sb.String(), nil\n}\n\nfunc main() {\n    doc, err := buildDocument([]string{"<head></head>", "<body>Hello</body>"})\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n    } else {\n        fmt.Println(doc)\n    }\n    \n    _, err = buildDocument([]string{"<head></head>", "", "<body></body>"})\n    fmt.Println("Ошибка:", err)\n}'
        },
        {
          type: 'tip',
          value: 'Паттерн errWriter используется в стандартной библиотеке Go (например, encoding/binary). Он исключает повторение "if err != nil" для цепочки операций, где важна только первая ошибка.'
        }
      ]
    },
    {
      id: 8,
      title: 'Практика: Парсер конфигурации с обработкой ошибок',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте парсер конфигурационного файла с полноценной обработкой ошибок.',
      requirements: [
        'Объявить сентинельные ошибки: ErrKeyNotFound, ErrInvalidValue, ErrMissingRequired',
        'Создать тип Config (map[string]string) с методами Get(key string) (string, error) и GetInt(key string) (int, error)',
        'Get возвращает ErrKeyNotFound если ключ отсутствует',
        'GetInt возвращает ErrInvalidValue если значение не является числом (оборачивать через %w)',
        'Создать функцию ParseConfig(data string) (*Config, error) которая парсит строки вида "key=value" (по одной на строку)',
        'ParseConfig должна пропускать пустые строки и строки начинающиеся с #',
        'Создать функцию ValidateConfig(c *Config, required []string) error которая проверяет наличие обязательных ключей, возвращает ErrMissingRequired с именем отсутствующего ключа'
      ],
      expectedOutput: 'Хост: localhost\nПорт: 5432\nОшибка: ключ "password" не найден\nОшибка: значение "abc" для ключа "timeout" не является числом',
      hint: 'Используйте strings.Split(line, "=") для разбора строк. В GetInt используйте strconv.Atoi и оборачивайте ошибку через fmt.Errorf с %w.',
      solution: 'package main\n\nimport (\n    "errors"\n    "fmt"\n    "strconv"\n    "strings"\n)\n\nvar (\n    ErrKeyNotFound    = errors.New("ключ не найден")\n    ErrInvalidValue   = errors.New("неверное значение")\n    ErrMissingRequired = errors.New("обязательный ключ отсутствует")\n)\n\ntype Config map[string]string\n\nfunc (c Config) Get(key string) (string, error) {\n    val, ok := c[key]\n    if !ok {\n        return "", fmt.Errorf("ключ %q: %w", key, ErrKeyNotFound)\n    }\n    return val, nil\n}\n\nfunc (c Config) GetInt(key string) (int, error) {\n    val, err := c.Get(key)\n    if err != nil {\n        return 0, err\n    }\n    n, err := strconv.Atoi(val)\n    if err != nil {\n        return 0, fmt.Errorf("значение %q для ключа %q: %w", val, key, ErrInvalidValue)\n    }\n    return n, nil\n}\n\nfunc ParseConfig(data string) (Config, error) {\n    cfg := make(Config)\n    lines := strings.Split(data, "\\n")\n    for i, line := range lines {\n        line = strings.TrimSpace(line)\n        if line == "" || strings.HasPrefix(line, "#") {\n            continue\n        }\n        parts := strings.SplitN(line, "=", 2)\n        if len(parts) != 2 {\n            return nil, fmt.Errorf("строка %d: неверный формат %q", i+1, line)\n        }\n        key := strings.TrimSpace(parts[0])\n        value := strings.TrimSpace(parts[1])\n        cfg[key] = value\n    }\n    return cfg, nil\n}\n\nfunc ValidateConfig(c Config, required []string) error {\n    for _, key := range required {\n        if _, ok := c[key]; !ok {\n            return fmt.Errorf("ключ %q: %w", key, ErrMissingRequired)\n        }\n    }\n    return nil\n}\n\nfunc main() {\n    data := `# База данных\nhost=localhost\nport=5432\ntimeout=abc\n\n# Пустые строки игнорируются`\n    \n    cfg, err := ParseConfig(data)\n    if err != nil {\n        fmt.Println("Ошибка парсинга:", err)\n        return\n    }\n    \n    if host, err := cfg.Get("host"); err == nil {\n        fmt.Println("Хост:", host)\n    }\n    \n    if port, err := cfg.GetInt("port"); err == nil {\n        fmt.Println("Порт:", port)\n    }\n    \n    _, err = cfg.Get("password")\n    if errors.Is(err, ErrKeyNotFound) {\n        fmt.Println("Ошибка:", err)\n    }\n    \n    _, err = cfg.GetInt("timeout")\n    if errors.Is(err, ErrInvalidValue) {\n        fmt.Println("Ошибка:", err)\n    }\n    \n    err = ValidateConfig(cfg, []string{"host", "port", "password"})\n    if errors.Is(err, ErrMissingRequired) {\n        fmt.Println("Валидация:", err)\n    }\n}',
      explanation: 'Config является псевдонимом типа map[string]string с методами. Get возвращает ErrKeyNotFound, GetInt парсит число и оборачивает ошибки strconv. ParseConfig использует strings.Split для разбора конфига. ValidateConfig проверяет обязательные ключи через errors.Is.'
    }
  ]
}
