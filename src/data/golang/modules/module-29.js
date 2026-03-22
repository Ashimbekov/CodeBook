export default {
  id: 29,
  title: 'Регулярные выражения',
  description: 'Пакет regexp реализует регулярные выражения в синтаксисе RE2. Регулярки — мощный инструмент для поиска, извлечения и замены текста по шаблону.',
  lessons: [
    {
      id: 1,
      title: 'regexp.Compile и базовые методы',
      content: [
        {
          type: 'text',
          value: 'Регулярные выражения (regexp) — язык описания шаблонов для поиска в тексте. Представьте лупу с особой формой: она находит только текст, совпадающий с заданным узором. Go использует синтаксис RE2 (без lookahead, но зато гарантированное линейное время).'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "regexp"\n)\n\nfunc main() {\n    // Compile — компилирует паттерн, возвращает ошибку\n    re, err := regexp.Compile(`\\d+`)\n    if err != nil {\n        fmt.Println("Ошибка в паттерне:", err)\n        return\n    }\n    \n    // MustCompile — паникует при ошибке, удобно для констант\n    reEmail := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`)\n    rePhone := regexp.MustCompile(`^\\+?[0-9]{10,15}$`)\n    \n    // MatchString — есть ли совпадение\n    fmt.Println(re.MatchString("цена: 42 тг"))     // true\n    fmt.Println(re.MatchString("нет цифр здесь"))  // false\n    \n    fmt.Println(reEmail.MatchString("user@example.com")) // true\n    fmt.Println(reEmail.MatchString("не-email"))          // false\n    fmt.Println(rePhone.MatchString("+77771234567"))      // true\n    \n    // Быстрая проверка (без предварительной компиляции)\n    matched, err := regexp.MatchString(`go+gle`, "gooogle")\n    fmt.Println(matched, err) // true <nil>\n}'
        },
        {
          type: 'warning',
          value: 'regexp.MustCompile паникует если паттерн некорректен. Используйте его только для литеральных паттернов (константы в коде). Для пользовательского ввода всегда используйте Compile с проверкой ошибки.'
        }
      ]
    },
    {
      id: 2,
      title: 'FindString и FindAllString',
      content: [
        {
          type: 'text',
          value: 'Find-функции ищут совпадения в тексте и возвращают их. Find — первое совпадение, FindAll — все совпадения. Суффикс String означает работу со строками, без него — с байтами.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "regexp"\n)\n\nfunc main() {\n    text := "Цены: 100 тг, 250 тг, 999 тг, скидка 15%"\n    \n    re := regexp.MustCompile(`\\d+`)\n    \n    // FindString — первое совпадение (пустая строка если не найдено)\n    first := re.FindString(text)\n    fmt.Println("Первое число:", first) // 100\n    \n    // FindAllString — все совпадения\n    // -1 означает все; n > 0 — максимум n совпадений\n    all := re.FindAllString(text, -1)\n    fmt.Println("Все числа:", all) // [100 250 999 15]\n    \n    // Только 2 первых совпадения\n    first2 := re.FindAllString(text, 2)\n    fmt.Println("Первые 2:", first2) // [100 250]\n    \n    // FindStringIndex — возвращает [начало, конец]\n    idx := re.FindStringIndex(text)\n    if idx != nil {\n        fmt.Printf("Позиция: [%d, %d], значение: %q\\n",\n            idx[0], idx[1], text[idx[0]:idx[1]])\n    }\n    \n    // FindAllStringIndex — индексы всех совпадений\n    allIdx := re.FindAllStringIndex(text, -1)\n    fmt.Println("Индексы:", allIdx)\n    \n    // Примеры полезных паттернов\n    htmlRe := regexp.MustCompile(`<[^>]+>`)\n    html := "<h1>Заголовок</h1><p>Параграф</p>"\n    tags := htmlRe.FindAllString(html, -1)\n    fmt.Println("HTML теги:", tags) // [<h1> </h1> <p> </p>]\n    \n    // Извлечение email из текста\n    emailRe := regexp.MustCompile(`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}`)\n    textWithEmails := "Контакты: ivan@mail.ru, support@company.com, test@example.org"\n    emails := emailRe.FindAllString(textWithEmails, -1)\n    fmt.Println("Email:", emails)\n}'
        }
      ]
    },
    {
      id: 3,
      title: 'ReplaceAll и ReplaceAllFunc',
      content: [
        {
          type: 'text',
          value: 'ReplaceAll заменяет все совпадения на новый текст. ReplaceAllFunc применяет функцию к каждому совпадению — это открывает возможность динамической замены.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "regexp"\n    "strings"\n)\n\nfunc main() {\n    // ReplaceAllString — простая замена\n    re := regexp.MustCompile(`\\d+`)\n    result := re.ReplaceAllString("Цена: 100 тг, скидка 20%", "XXX")\n    fmt.Println(result) // Цена: XXX тг, скидка XXX%\n    \n    // Замена с использованием захваченных групп\n    dateRe := regexp.MustCompile(`(\\d{4})-(\\d{2})-(\\d{2})`)\n    dates := "Дата: 2024-01-15, дедлайн: 2024-03-31"\n    \n    // $1, $2, $3 — ссылки на захваченные группы\n    reformatted := dateRe.ReplaceAllString(dates, "$3.$2.$1")\n    fmt.Println(reformatted) // Дата: 15.01.2024, дедлайн: 31.03.2024\n    \n    // ReplaceAllStringFunc — динамическая замена\n    priceRe := regexp.MustCompile(`\\d+(\\.\\d+)?`)\n    prices := "Товар: 100 тг, доставка: 500 тг, итого: 600 тг"\n    \n    // Удваиваем все цены\n    doubled := priceRe.ReplaceAllStringFunc(prices, func(match string) string {\n        // Здесь можно делать любые преобразования\n        var n float64\n        fmt.Sscanf(match, "%f", &n)\n        return fmt.Sprintf("%.0f", n*2)\n    })\n    fmt.Println(doubled) // Товар: 200 тг, доставка: 1000 тг, итого: 1200 тг\n    \n    // Маскирование email\n    emailRe := regexp.MustCompile(`([a-z0-9.]+)@([a-z0-9.]+)`)\n    text := "Email: user@example.com и admin@company.org"\n    masked := emailRe.ReplaceAllStringFunc(text, func(match string) string {\n        parts := strings.SplitN(match, "@", 2)\n        masked := parts[0][:2] + strings.Repeat("*", len(parts[0])-2)\n        return masked + "@" + parts[1]\n    })\n    fmt.Println(masked)\n}'
        }
      ]
    },
    {
      id: 4,
      title: 'Подгруппы (submatches)',
      content: [
        {
          type: 'text',
          value: 'Подгруппы (capturing groups) — скобки () в паттерне, которые захватывают части совпадения. Как несколько лупSomething сразу: одна находит всё совпадение, другие — его части.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "regexp"\n)\n\nfunc main() {\n    // FindStringSubmatch — первое совпадение + группы\n    re := regexp.MustCompile(`(\\w+)@(\\w+)\\.(\\w+)`)\n    match := re.FindStringSubmatch("user@example.com")\n    \n    if match != nil {\n        fmt.Println("Всё совпадение:", match[0]) // user@example.com\n        fmt.Println("Пользователь:", match[1])   // user\n        fmt.Println("Домен:       ", match[2])   // example\n        fmt.Println("TLD:         ", match[3])   // com\n    }\n    \n    // FindAllStringSubmatch — все совпадения + группы\n    emails := "ivan@mail.ru, anna@gmail.com, bot@test.org"\n    allMatches := re.FindAllStringSubmatch(emails, -1)\n    \n    for _, m := range allMatches {\n        fmt.Printf("Email: %-25s | user: %-10s | domain: %s.%s\\n",\n            m[0], m[1], m[2], m[3])\n    }\n    \n    // Именованные группы (?P<name>...)\n    logRe := regexp.MustCompile(\n        `(?P<date>\\d{4}-\\d{2}-\\d{2}) (?P<time>\\d{2}:\\d{2}:\\d{2}) \\[(?P<level>\\w+)\\] (?P<msg>.+)`,\n    )\n    \n    logLine := "2024-01-15 14:30:00 [ERROR] подключение к базе данных потеряно"\n    m := logRe.FindStringSubmatch(logLine)\n    \n    if m != nil {\n        // Доступ по именам групп\n        names := logRe.SubexpNames()\n        for i, name := range names {\n            if i != 0 && name != "" && i < len(m) {\n                fmt.Printf("  %s: %s\\n", name, m[i])\n            }\n        }\n    }\n}'
        },
        {
          type: 'tip',
          value: 'Именованные группы (?P<name>...) делают код самодокументирующим. SubexpNames() возвращает имена всех групп (первый элемент — "" для группы 0).'
        }
      ]
    },
    {
      id: 5,
      title: 'Флаги и синтаксис RE2',
      content: [
        {
          type: 'text',
          value: 'Флаги изменяют поведение регулярного выражения. Синтаксис RE2 отличается от PCRE — нет lookahead/lookbehind, но зато линейная сложность и безопасность.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "regexp"\n)\n\nfunc main() {\n    // Флаги в начале паттерна:\n    // (?i) — нечувствительность к регистру\n    // (?m) — многострочный режим (^ и $ для каждой строки)\n    // (?s) — . совпадает с \\n\n    // (?U) — ленивые квантификаторы по умолчанию\n    \n    // Case-insensitive\n    re := regexp.MustCompile(`(?i)hello`)\n    fmt.Println(re.MatchString("Hello World")) // true\n    fmt.Println(re.MatchString("HELLO"))       // true\n    fmt.Println(re.MatchString("hElLo"))       // true\n    \n    // Многострочный режим\n    multiRe := regexp.MustCompile(`(?m)^\\w+`)\n    text := "первое\\nвторое\\nтретье"\n    words := multiRe.FindAllString(text, -1)\n    fmt.Println(words) // [первое второе третье]\n    \n    // Основные паттерны RE2\n    examples := map[string]string{\n        "Цифра":            `\\d`,       // [0-9]\n        "Не цифра":         `\\D`,       // [^0-9]\n        "Слово":            `\\w`,       // [a-zA-Z0-9_]\n        "Не слово":         `\\W`,       // [^a-zA-Z0-9_]\n        "Пробел":           `\\s`,       // пробел, таб, newline\n        "Не пробел":        `\\S`,\n        "Начало строки":    `^`,\n        "Конец строки":     `$`,\n        "Любой символ":     `.`,        // кроме \\n\n        "0 или больше":     `*`,\n        "1 или больше":     `+`,\n        "0 или 1":          `?`,\n        "Точное кол-во":    `{3}`,\n        "Диапазон":         `{2,5}`,\n        "Класс":            `[abc]`,\n        "Диапазон класс":   `[a-z]`,\n        "Отрицание класс":  `[^abc]`,\n        "Группа":           `(abc)`,\n        "Или":              `a|b`,\n        "Не захват группа": `(?:abc)`,\n    }\n    \n    _ = examples // документирование\n    \n    // Примеры полезных паттернов\n    patterns := map[string]*regexp.Regexp{\n        "ИИН (Казахстан)":   regexp.MustCompile(`^\\d{12}$`),\n        "Телефон KZ":        regexp.MustCompile(`^(\\+7|8)\\d{10}$`),\n        "Дата ДД.ММ.ГГГГ":   regexp.MustCompile(`^(0[1-9]|[12]\\d|3[01])\\.(0[1-9]|1[012])\\.(19|20)\\d{2}$`),\n        "IPv4":              regexp.MustCompile(`^(\\d{1,3}\\.){3}\\d{1,3}$`),\n        "URL":               regexp.MustCompile(`^https?://[^\\s]+$`),\n    }\n    \n    tests := map[string][]string{\n        "ИИН (Казахстан)":   {"921015350123", "12345", "abcdefghijkl"},\n        "Телефон KZ":        {"+77771234567", "87771234567", "7771234567"},\n        "Дата ДД.ММ.ГГГГ":   {"15.01.2024", "31.12.2023", "32.01.2024"},\n    }\n    \n    for name, re := range patterns {\n        if testCases, ok := tests[name]; ok {\n            fmt.Printf("\\n%s:\\n", name)\n            for _, tc := range testCases {\n                fmt.Printf("  %q -> %v\\n", tc, re.MatchString(tc))\n            }\n        }\n    }\n}'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Парсер логов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте парсер лог-файлов с использованием регулярных выражений.',
      requirements: [
        'Определить структуру LogEntry с полями: Timestamp time.Time, Level string, Message string, Extra map[string]string',
        'Написать функцию ParseLogLine(line string) (*LogEntry, error) которая парсит строку вида: "2024-01-15 14:30:00 [ERROR] user=123 action=login message=некорректный пароль"',
        'Извлекать timestamp, уровень (INFO/WARN/ERROR/DEBUG), пары key=value через regex',
        'Функция ParseLog(text string) []LogEntry — парсит многострочный лог',
        'Функция FilterByLevel(entries []LogEntry, level string) []LogEntry — фильтрация по уровню',
        'Функция CountByLevel(entries []LogEntry) map[string]int — подсчёт по уровням'
      ],
      expectedOutput: 'Всего записей: 4\nПо уровням: map[DEBUG:1 ERROR:2 INFO:1]\nОшибки:\n  2024-01-15 14:30:00: некорректный пароль\n  2024-01-15 14:35:00: превышен лимит запросов',
      hint: 'Используйте именованные группы (?P<name>...) для захвата частей строки. SubexpNames() поможет сопоставить индексы с именами. Для парсинга key=value используйте FindAllStringSubmatch с паттерном (\\w+)=(\\S+).',
      solution: 'package main\n\nimport (\n    "fmt"\n    "regexp"\n    "strings"\n    "time"\n)\n\ntype LogEntry struct {\n    Timestamp time.Time\n    Level     string\n    Message   string\n    Extra     map[string]string\n}\n\nvar (\n    logRe = regexp.MustCompile(\n        `(?P<date>\\d{4}-\\d{2}-\\d{2}) (?P<time>\\d{2}:\\d{2}:\\d{2}) \\[(?P<level>\\w+)\\] (?P<rest>.+)`,\n    )\n    kvRe = regexp.MustCompile(`(\\w+)=([^\\s]+)`)\n)\n\nfunc ParseLogLine(line string) (*LogEntry, error) {\n    line = strings.TrimSpace(line)\n    if line == "" {\n        return nil, fmt.Errorf("пустая строка")\n    }\n    \n    m := logRe.FindStringSubmatch(line)\n    if m == nil {\n        return nil, fmt.Errorf("не удалось распарсить: %q", line)\n    }\n    \n    // Сопоставляем имена групп\n    names := logRe.SubexpNames()\n    groups := make(map[string]string)\n    for i, name := range names {\n        if i != 0 && name != "" && i < len(m) {\n            groups[name] = m[i]\n        }\n    }\n    \n    // Парсим timestamp\n    tsStr := groups["date"] + " " + groups["time"]\n    ts, err := time.Parse("2006-01-02 15:04:05", tsStr)\n    if err != nil {\n        return nil, fmt.Errorf("парсинг времени: %w", err)\n    }\n    \n    // Разбираем rest на key=value пары и message\n    rest := groups["rest"]\n    extra := make(map[string]string)\n    kvMatches := kvRe.FindAllStringSubmatch(rest, -1)\n    \n    var messageParts []string\n    for _, kv := range kvMatches {\n        if kv[1] == "message" {\n            messageParts = append(messageParts, kv[2])\n        } else {\n            extra[kv[1]] = kv[2]\n        }\n    }\n    \n    // Если message не в key=value формате, берём всё что не является парами\n    msg := strings.Join(messageParts, " ")\n    if msg == "" {\n        // Удаляем все key=value из rest\n        msg = strings.TrimSpace(kvRe.ReplaceAllString(rest, ""))\n    }\n    \n    return &LogEntry{\n        Timestamp: ts,\n        Level:     groups["level"],\n        Message:   msg,\n        Extra:     extra,\n    }, nil\n}\n\nfunc ParseLog(text string) []LogEntry {\n    var entries []LogEntry\n    for _, line := range strings.Split(text, "\\n") {\n        entry, err := ParseLogLine(line)\n        if err == nil {\n            entries = append(entries, *entry)\n        }\n    }\n    return entries\n}\n\nfunc FilterByLevel(entries []LogEntry, level string) []LogEntry {\n    var result []LogEntry\n    for _, e := range entries {\n        if strings.EqualFold(e.Level, level) {\n            result = append(result, e)\n        }\n    }\n    return result\n}\n\nfunc CountByLevel(entries []LogEntry) map[string]int {\n    counts := make(map[string]int)\n    for _, e := range entries {\n        counts[e.Level]++\n    }\n    return counts\n}\n\nfunc main() {\n    logs := `2024-01-15 14:30:00 [ERROR] user=123 action=login message=некорректный_пароль\n2024-01-15 14:31:00 [INFO] user=456 action=view message=просмотр_профиля\n2024-01-15 14:35:00 [ERROR] user=789 action=api message=превышен_лимит_запросов\n2024-01-15 14:40:00 [DEBUG] goroutines=42 heap=1024`\n    \n    entries := ParseLog(logs)\n    fmt.Printf("Всего записей: %d\\n", len(entries))\n    fmt.Printf("По уровням: %v\\n", CountByLevel(entries))\n    \n    errors := FilterByLevel(entries, "ERROR")\n    fmt.Println("Ошибки:")\n    for _, e := range errors {\n        msg := e.Message\n        if msg == "" {\n            msg = e.Extra["message"]\n        }\n        fmt.Printf("  %s: %s\\n", e.Timestamp.Format("2006-01-02 15:04:05"), msg)\n    }\n}',
      explanation: 'regexp с именованными группами упрощает извлечение данных. SubexpNames() сопоставляет индексы с именами. FindAllStringSubmatch находит все key=value пары. ReplaceAllString помогает очистить строку от найденных паттернов.'
    }
  ]
}
