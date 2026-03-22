export default {
  id: 26,
  title: 'Работа со строками (strings, strconv)',
  description: 'Пакеты strings и strconv — незаменимые инструменты для обработки текста. Поиск, замена, разделение, конвертация типов — всё это в стандартной библиотеке Go.',
  lessons: [
    {
      id: 1,
      title: 'Основные функции пакета strings',
      content: [
        {
          type: 'text',
          value: 'Пакет strings содержит более 40 функций для работы со строками. Рассмотрим самые используемые. Строки в Go — неизменяемые последовательности байт, поэтому все функции возвращают новые строки.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\nfunc main() {\n    s := "  Привет, Мир! Добро пожаловать в Go!  "\n    \n    // Проверка содержимого\n    fmt.Println(strings.Contains(s, "Мир"))          // true\n    fmt.Println(strings.Contains(s, "Python"))       // false\n    fmt.Println(strings.ContainsAny(s, "МП"))        // true (любой символ из набора)\n    fmt.Println(strings.ContainsRune(s, \'М\'))        // true\n    \n    // Подсчёт вхождений\n    fmt.Println(strings.Count(s, "о"))               // 3\n    \n    // Проверка начала и конца\n    fmt.Println(strings.HasPrefix(s, "  Привет"))    // true\n    fmt.Println(strings.HasSuffix(s, "Go!  "))       // true\n    \n    // Поиск позиции\n    fmt.Println(strings.Index(s, "Мир"))             // 10 (байтовая позиция)\n    fmt.Println(strings.LastIndex(s, "о"))           // ...\n    fmt.Println(strings.IndexRune(s, \'М\'))           // позиция руны\n    \n    // Регистр\n    fmt.Println(strings.ToUpper("hello"))            // HELLO\n    fmt.Println(strings.ToLower("WORLD"))            // world\n    fmt.Println(strings.Title("hello world"))        // Hello World (устарел, используй golang.org/x/text)\n    \n    // Обрезка пробелов\n    fmt.Println(strings.TrimSpace(s))                // Привет, Мир! Добро пожаловать в Go!\n    fmt.Println(strings.Trim("***hello***", "*"))    // hello\n    fmt.Println(strings.TrimLeft("###abc", "#"))     // abc\n    fmt.Println(strings.TrimRight("abc###", "#"))    // abc\n    fmt.Println(strings.TrimPrefix("Hello, Go", "Hello, ")) // Go\n    fmt.Println(strings.TrimSuffix("file.txt", ".txt"))     // file\n}'
        }
      ]
    },
    {
      id: 2,
      title: 'Split, Join, Replace',
      content: [
        {
          type: 'text',
          value: 'Разделение и объединение строк — одни из самых частых операций. Split разрезает строку по разделителю, Join склеивает слайс строк. Как ножницы и клей для текста.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\nfunc main() {\n    // Split — разделение по разделителю\n    csv := "яблоко,банан,вишня,груша"\n    fruits := strings.Split(csv, ",")\n    fmt.Println(fruits)           // [яблоко банан вишня груша]\n    fmt.Println(len(fruits))      // 4\n    \n    // SplitN — ограниченное количество частей\n    parts := strings.SplitN("a:b:c:d", ":", 3)\n    fmt.Println(parts)            // [a b c:d]\n    \n    // SplitAfter — разделитель остаётся в частях\n    parts2 := strings.SplitAfter("a,b,c", ",")\n    fmt.Println(parts2)           // [a, b, c]\n    \n    // Fields — разделение по пробелам (сжимает несколько)\n    words := strings.Fields("  привет   мир  го  ")\n    fmt.Println(words)            // [привет мир го]\n    \n    // Join — объединение\n    joined := strings.Join(fruits, " | ")\n    fmt.Println(joined)           // яблоко | банан | вишня | груша\n    \n    fmt.Println(strings.Join([]string{"2024", "01", "15"}, "-")) // 2024-01-15\n    \n    // Replace\n    fmt.Println(strings.Replace("aaa", "a", "b", 2))    // bba (только 2 замены)\n    fmt.Println(strings.ReplaceAll("aaa", "a", "b"))    // bbb (все)\n    \n    // NewReplacer — множественная замена эффективно\n    r := strings.NewReplacer(\n        "&", "&amp;",\n        "<", "&lt;",\n        ">", "&gt;",\n        "\"", "&quot;",\n    )\n    html := r.Replace("<div class=\\"test\\">Hello & World</div>")\n    fmt.Println(html)\n    // &lt;div class=&quot;test&quot;&gt;Hello &amp; World&lt;/div&gt;\n}'
        },
        {
          type: 'heading',
          value: 'Практические примеры'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\n// Парсинг строки key=value\nfunc parseKV(s string) (string, string, bool) {\n    parts := strings.SplitN(s, "=", 2)\n    if len(parts) != 2 {\n        return "", "", false\n    }\n    return strings.TrimSpace(parts[0]), strings.TrimSpace(parts[1]), true\n}\n\n// Нормализация email\nfunc normalizeEmail(email string) string {\n    return strings.ToLower(strings.TrimSpace(email))\n}\n\n// Подсчёт слов\nfunc wordCount(text string) int {\n    return len(strings.Fields(text))\n}\n\nfunc main() {\n    key, val, ok := parseKV("  host = localhost  ")\n    fmt.Printf("key=%q val=%q ok=%v\\n", key, val, ok)\n    // key="host" val="localhost" ok=true\n    \n    fmt.Println(normalizeEmail("  User@MAIL.RU  "))\n    // user@mail.ru\n    \n    fmt.Println(wordCount("Привет  мир,  как   дела?"))\n    // 4\n}'
        }
      ]
    },
    {
      id: 3,
      title: 'strings.Builder — эффективная конкатенация',
      content: [
        {
          type: 'text',
          value: 'Конкатенация строк через + в цикле неэффективна: каждый раз создаётся новая строка. strings.Builder решает эту проблему — он накапливает части в буфер и создаёт строку один раз. Как строить дом из кирпичей, а не переделывать заново каждый раз.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\nfunc buildHTMLTable(headers []string, rows [][]string) string {\n    var sb strings.Builder\n    \n    sb.WriteString("<table>\\n")\n    \n    // Заголовок\n    sb.WriteString("  <tr>\\n")\n    for _, h := range headers {\n        sb.WriteString("    <th>")\n        sb.WriteString(h)\n        sb.WriteString("</th>\\n")\n    }\n    sb.WriteString("  </tr>\\n")\n    \n    // Строки данных\n    for _, row := range rows {\n        sb.WriteString("  <tr>\\n")\n        for _, cell := range row {\n            fmt.Fprintf(&sb, "    <td>%s</td>\\n", cell)\n        }\n        sb.WriteString("  </tr>\\n")\n    }\n    \n    sb.WriteString("</table>")\n    \n    return sb.String()\n}\n\nfunc repeat(s string, n int, sep string) string {\n    var sb strings.Builder\n    for i := 0; i < n; i++ {\n        if i > 0 {\n            sb.WriteString(sep)\n        }\n        sb.WriteString(s)\n    }\n    return sb.String()\n}\n\nfunc main() {\n    headers := []string{"Имя", "Возраст", "Город"}\n    rows := [][]string{\n        {"Айжан", "25", "Алматы"},\n        {"Нурик", "30", "Астана"},\n        {"Болат", "28", "Шымкент"},\n    }\n    \n    table := buildHTMLTable(headers, rows)\n    fmt.Println(table)\n    \n    fmt.Println(repeat("Go", 5, "-"))\n    // Go-Go-Go-Go-Go\n    \n    // Методы Builder:\n    var sb strings.Builder\n    sb.WriteByte(\'G\')\n    sb.WriteRune(\'о\')\n    sb.WriteString("lang")\n    fmt.Println(sb.String())  // Голang\n    fmt.Println(sb.Len())     // длина в байтах\n    sb.Reset()                // очистить\n    fmt.Println(sb.Len())     // 0\n}'
        },
        {
          type: 'tip',
          value: 'strings.Builder — предпочтительный способ построения строк в цикле или из многих частей. Используйте sb.Grow(n) перед циклом, если знаете примерный размер — это избегает переаллокаций.'
        }
      ]
    },
    {
      id: 4,
      title: 'strconv — конвертация типов',
      content: [
        {
          type: 'text',
          value: 'Пакет strconv преобразует строки в числа и обратно, а также работает с булевыми значениями и символами. Как переводчик между миром строк и миром чисел.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strconv"\n)\n\nfunc main() {\n    // Строка -> int\n    n, err := strconv.Atoi("42")\n    fmt.Println(n, err)    // 42 <nil>\n    \n    n, err = strconv.Atoi("abc")\n    fmt.Println(n, err)    // 0 strconv.Atoi: parsing "abc": invalid syntax\n    \n    // int -> строка\n    s := strconv.Itoa(12345)\n    fmt.Println(s)         // "12345"\n    \n    // Строка -> float\n    f, err := strconv.ParseFloat("3.14159", 64)\n    fmt.Println(f, err)    // 3.14159 <nil>\n    \n    // float -> строка\n    fs := strconv.FormatFloat(3.14159, \'f\', 2, 64)\n    fmt.Println(fs)        // "3.14"\n    // Форматы: \'f\' — без экспоненты, \'e\' — с экспонентой, \'g\' — краткий\n    \n    // Строка -> bool\n    b, _ := strconv.ParseBool("true")\n    fmt.Println(b)         // true\n    b, _ = strconv.ParseBool("1")\n    fmt.Println(b)         // true\n    b, _ = strconv.ParseBool("false")\n    fmt.Println(b)         // false\n    \n    // bool -> строка\n    fmt.Println(strconv.FormatBool(true))  // "true"\n    \n    // Строка -> int с указанием основания (2, 8, 10, 16)\n    n64, _ := strconv.ParseInt("FF", 16, 64)  // шестнадцатеричный\n    fmt.Println(n64)       // 255\n    \n    n64, _ = strconv.ParseInt("1010", 2, 64)  // двоичный\n    fmt.Println(n64)       // 10\n    \n    // int -> строка в нужной системе счисления\n    fmt.Println(strconv.FormatInt(255, 16))   // "ff"\n    fmt.Println(strconv.FormatInt(255, 2))    // "11111111"\n    fmt.Println(strconv.FormatInt(255, 8))    // "377"\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strconv"\n)\n\n// Quote и Unquote — экранирование строк\nfunc main() {\n    // Quote добавляет кавычки и экранирует спецсимволы\n    quoted := strconv.Quote("Привет\\nМир\\t!")\n    fmt.Println(quoted)  // "Привет\\nМир\\t!"\n    \n    // Unquote убирает кавычки и разворачивает escape-последовательности\n    unquoted, _ := strconv.Unquote(`"Hello\\nWorld"`)\n    fmt.Println(unquoted) // Hello\n                          // World\n    \n    // AppendInt — эффективное добавление числа в байтовый слайс\n    buf := []byte("ID: ")\n    buf = strconv.AppendInt(buf, 12345, 10)\n    fmt.Println(string(buf)) // "ID: 12345"\n}'
        }
      ]
    },
    {
      id: 5,
      title: 'strings.Reader и strings.Map',
      content: [
        {
          type: 'text',
          value: 'strings.NewReader позволяет работать со строкой как с io.Reader — удобно для функций, ожидающих поток данных. strings.Map применяет функцию к каждой руне строки.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n    "unicode"\n)\n\nfunc main() {\n    // strings.Map — трансформация каждой руны\n    rot13 := func(r rune) rune {\n        switch {\n        case r >= \'A\' && r <= \'Z\':\n            return \'A\' + (r-\'A\'+13)%26\n        case r >= \'a\' && r <= \'z\':\n            return \'a\' + (r-\'a\'+13)%26\n        }\n        return r\n    }\n    \n    fmt.Println(strings.Map(rot13, "Hello, World!"))\n    // Uryyb, Jbeyq!\n    \n    // Удаление не-буквенных символов\n    lettersOnly := strings.Map(func(r rune) rune {\n        if unicode.IsLetter(r) {\n            return r\n        }\n        return -1 // -1 означает удалить руну\n    }, "H3ll0 W0rld!")\n    fmt.Println(lettersOnly) // HllWrld\n    \n    // Подсчёт функцией\n    digits := strings.Map(func(r rune) rune {\n        if unicode.IsDigit(r) {\n            return r\n        }\n        return -1\n    }, "abc123def456")\n    fmt.Println(digits) // 123456\n    \n    // strings.IndexFunc, strings.TrimFunc\n    s := "  \\t\\n  Привет  \\n\\t  "\n    trimmed := strings.TrimFunc(s, unicode.IsSpace)\n    fmt.Println(trimmed) // Привет\n    \n    // EqualFold — сравнение без учёта регистра (Unicode-aware)\n    fmt.Println(strings.EqualFold("Go", "go"))     // true\n    fmt.Println(strings.EqualFold("ФОН", "фон"))   // true\n    fmt.Println(strings.EqualFold("Go", "Java"))   // false\n    \n    // Cut — удобная замена SplitN для разделителя\n    before, after, found := strings.Cut("user@example.com", "@")\n    fmt.Printf("before=%q after=%q found=%v\\n", before, after, found)\n    // before="user" after="example.com" found=true\n}'
        }
      ]
    },
    {
      id: 6,
      title: 'Паттерны работы со строками',
      content: [
        {
          type: 'text',
          value: 'Рассмотрим практические паттерны: парсинг CSV, обработка шаблонов, sanitize входных данных.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n    "unicode"\n)\n\n// Простой парсер CSV\nfunc parseCSVLine(line string) []string {\n    fields := strings.Split(line, ",")\n    for i, f := range fields {\n        fields[i] = strings.TrimSpace(f)\n    }\n    return fields\n}\n\n// Простой шаблонизатор {key} -> value\nfunc renderTemplate(tmpl string, vars map[string]string) string {\n    r := strings.NewReplacer()\n    pairs := make([]string, 0, len(vars)*2)\n    for k, v := range vars {\n        pairs = append(pairs, "{"+k+"}", v)\n    }\n    return strings.NewReplacer(pairs...).Replace(tmpl)\n}\n\n// Slugify — строка для URL\nfunc slugify(s string) string {\n    s = strings.ToLower(s)\n    var sb strings.Builder\n    prevHyphen := false\n    for _, r := range s {\n        if unicode.IsLetter(r) || unicode.IsDigit(r) {\n            sb.WriteRune(r)\n            prevHyphen = false\n        } else if !prevHyphen && sb.Len() > 0 {\n            sb.WriteByte(\'-\')\n            prevHyphen = true\n        }\n    }\n    result := sb.String()\n    return strings.TrimRight(result, "-")\n}\n\n// Truncate — обрезка строки с многоточием\nfunc truncate(s string, maxLen int) string {\n    runes := []rune(s)\n    if len(runes) <= maxLen {\n        return s\n    }\n    return string(runes[:maxLen-3]) + "..."\n}\n\nfunc main() {\n    // Парсинг CSV\n    line := "Нурик, 30, Алматы, разработчик"\n    fields := parseCSVLine(line)\n    for i, f := range fields {\n        fmt.Printf("  [%d]: %q\\n", i, f)\n    }\n    \n    // Шаблонизатор\n    tmpl := "Привет, {name}! Ваш заказ #{order} готов.\"\n    vars := map[string]string{"name": "Айжан", "order": "12345"}\n    fmt.Println(renderTemplate(tmpl, vars))\n    \n    // Slugify\n    titles := []string{\n        "Как выучить Go за 21 день!\",\n        "REST API на Go: полное руководство",\n        "Go & Concurrency -- Горутины\",\n    }\n    for _, t := range titles {\n        fmt.Printf("%q -> %q\\n", t, slugify(t))\n    }\n    \n    // Truncate\n    long := "Очень длинный текст который нужно обрезать"\n    fmt.Println(truncate(long, 20))\n}'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Обработчик текста',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте набор функций для обработки текстовых данных.',
      requirements: [
        'WordFrequency(text string) map[string]int — подсчёт частоты слов (нечувствительно к регистру, игнорировать пунктуацию)',
        'TopNWords(freq map[string]int, n int) []string — возвращает n самых частых слов в порядке убывания',
        'CamelToSnake(s string) string — конвертирует camelCase в snake_case (например "myVariableName" -> "my_variable_name")',
        'SnakeToCamel(s string) string — конвертирует snake_case в camelCase (например "my_variable_name" -> "myVariableName")',
        'WrapText(text string, lineWidth int) string — переносит текст по словам с максимальной шириной строки',
        'В main() продемонстрировать каждую функцию'
      ],
      expectedOutput: 'Топ-3 слов: [go the in]\nCamelToSnake: my_variable_name\nSnakeToCamel: myVariableName\nПеренос текста по 20 символов:\nПривет как дела\nу меня всё хорошо',
      hint: 'Для WordFrequency используйте strings.Fields и strings.ToLower, удаляйте пунктуацию через strings.Trim. CamelToSnake: проходите по рунам, вставляйте _ перед заглавными. SnakeToCamel: Split по _, capitalize первую букву каждого слова кроме первого.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sort"\n    "strings"\n    "unicode"\n)\n\nfunc WordFrequency(text string) map[string]int {\n    freq := make(map[string]int)\n    words := strings.Fields(text)\n    for _, w := range words {\n        // Удаляем пунктуацию с краёв\n        cleaned := strings.TrimFunc(strings.ToLower(w), func(r rune) bool {\n            return !unicode.IsLetter(r) && !unicode.IsDigit(r)\n        })\n        if cleaned != "" {\n            freq[cleaned]++\n        }\n    }\n    return freq\n}\n\nfunc TopNWords(freq map[string]int, n int) []string {\n    type wordCount struct {\n        word  string\n        count int\n    }\n    pairs := make([]wordCount, 0, len(freq))\n    for w, c := range freq {\n        pairs = append(pairs, wordCount{w, c})\n    }\n    sort.Slice(pairs, func(i, j int) bool {\n        if pairs[i].count != pairs[j].count {\n            return pairs[i].count > pairs[j].count\n        }\n        return pairs[i].word < pairs[j].word\n    })\n    result := make([]string, 0, n)\n    for i := 0; i < n && i < len(pairs); i++ {\n        result = append(result, pairs[i].word)\n    }\n    return result\n}\n\nfunc CamelToSnake(s string) string {\n    var sb strings.Builder\n    for i, r := range s {\n        if unicode.IsUpper(r) && i > 0 {\n            sb.WriteByte(\'_\')\n        }\n        sb.WriteRune(unicode.ToLower(r))\n    }\n    return sb.String()\n}\n\nfunc SnakeToCamel(s string) string {\n    parts := strings.Split(s, "_")\n    var sb strings.Builder\n    for i, part := range parts {\n        if i == 0 {\n            sb.WriteString(part)\n        } else if len(part) > 0 {\n            runes := []rune(part)\n            sb.WriteRune(unicode.ToUpper(runes[0]))\n            sb.WriteString(string(runes[1:]))\n        }\n    }\n    return sb.String()\n}\n\nfunc WrapText(text string, lineWidth int) string {\n    words := strings.Fields(text)\n    var lines []string\n    var current strings.Builder\n    \n    for _, word := range words {\n        if current.Len() == 0 {\n            current.WriteString(word)\n        } else if current.Len()+1+len([]rune(word)) <= lineWidth {\n            current.WriteByte(\' \')\n            current.WriteString(word)\n        } else {\n            lines = append(lines, current.String())\n            current.Reset()\n            current.WriteString(word)\n        }\n    }\n    if current.Len() > 0 {\n        lines = append(lines, current.String())\n    }\n    return strings.Join(lines, "\\n")\n}\n\nfunc main() {\n    text := "Go is an open source programming language that makes it easy to build simple reliable and efficient software Go is great"\n    freq := WordFrequency(text)\n    top := TopNWords(freq, 3)\n    fmt.Println("Топ-3 слов:", top)\n    \n    fmt.Println("CamelToSnake:", CamelToSnake("myVariableName"))\n    fmt.Println("SnakeToCamel:", SnakeToCamel("my_variable_name"))\n    \n    wrapped := WrapText("Привет как дела у меня всё хорошо", 20)\n    fmt.Println("Перенос текста по 20 символов:")\n    fmt.Println(wrapped)\n}',
      explanation: 'WordFrequency использует strings.Fields для разбивки по словам и strings.TrimFunc для удаления пунктуации. TopNWords сортирует по убыванию количества. CamelToSnake проходит по рунам и вставляет подчёркивание перед заглавными. WrapText считает длину с учётом Unicode через []rune.'
    }
  ]
}
