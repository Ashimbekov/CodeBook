export default {
  id: 25,
  title: 'Работа с файлами',
  description: 'Чтение, запись, обход директорий — базовые операции с файловой системой. Go предоставляет удобные пакеты os, bufio, io и path/filepath для работы с файлами.',
  lessons: [
    {
      id: 1,
      title: 'os.Open и os.Create — открытие файлов',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Работа с файлами в Go начинается с открытия или создания. os.Open открывает для чтения, os.Create создаёт (или перезаписывает) для записи. Всегда используйте defer для закрытия файла.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "os"\n)\n\nfunc main() {\n    // os.Open — только чтение\n    f, err := os.Open("file.txt")\n    if err != nil {\n        fmt.Println("Ошибка открытия:", err)\n        return\n    }\n    defer f.Close() // ВСЕГДА закрывайте файл!\n    \n    fmt.Println("Файл открыт:", f.Name())\n    \n    // os.Create — создание/перезапись, чтение+запись\n    out, err := os.Create("output.txt")\n    if err != nil {\n        fmt.Println("Ошибка создания:", err)\n        return\n    }\n    defer out.Close()\n    \n    out.WriteString("Привет, файл!\\n")\n    fmt.Fprintf(out, "Строка %d\\n", 42)\n}'
        },
        {
          type: 'heading',
          value: 'os.OpenFile — полный контроль'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "os"\n)\n\nfunc main() {\n    // os.OpenFile даёт полный контроль над режимом открытия\n    \n    // Дозапись в конец файла (append)\n    f, err := os.OpenFile("log.txt",\n        os.O_APPEND|os.O_CREATE|os.O_WRONLY,\n        0644, // права: владелец rw, группа r, остальные r\n    )\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    defer f.Close()\n    \n    fmt.Fprintln(f, "Новая строка лога")\n    \n    // Флаги os.OpenFile:\n    // os.O_RDONLY — только чтение\n    // os.O_WRONLY — только запись\n    // os.O_RDWR   — чтение и запись\n    // os.O_APPEND — дозапись в конец\n    // os.O_CREATE — создать если не существует\n    // os.O_TRUNC  — обрезать файл до нуля\n    // os.O_EXCL   — ошибка если уже существует\n    \n    fmt.Println("Запись выполнена")\n}'
        },
        {
          type: 'warning',
          value: 'Всегда проверяйте ошибку от file.Close()! Данные могут не записаться до закрытия. При использовании defer f.Close() ошибка теряется — для критичных данных используйте явное закрытие с проверкой ошибки.'
        }
      ]
    },
    {
      id: 2,
      title: 'Чтение файлов — bufio.Scanner и io.ReadAll',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Есть несколько способов читать файлы в Go. bufio.Scanner — построчное чтение (как читать книгу страница за страницей). io.ReadAll — прочитать весь файл сразу (как сфотографировать всю книгу).'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "bufio"\n    "fmt"\n    "io"\n    "os"\n    "strings"\n)\n\n// Способ 1: bufio.Scanner — построчное чтение\nfunc readLines(filename string) ([]string, error) {\n    f, err := os.Open(filename)\n    if err != nil {\n        return nil, fmt.Errorf("readLines: %w", err)\n    }\n    defer f.Close()\n    \n    var lines []string\n    scanner := bufio.NewScanner(f)\n    \n    for scanner.Scan() {\n        lines = append(lines, scanner.Text())\n    }\n    \n    if err := scanner.Err(); err != nil {\n        return nil, fmt.Errorf("readLines scanner: %w", err)\n    }\n    \n    return lines, nil\n}\n\n// Способ 2: io.ReadAll — читаем весь файл сразу\nfunc readAll(filename string) (string, error) {\n    f, err := os.Open(filename)\n    if err != nil {\n        return "", fmt.Errorf("readAll: %w", err)\n    }\n    defer f.Close()\n    \n    data, err := io.ReadAll(f)\n    if err != nil {\n        return "", fmt.Errorf("readAll read: %w", err)\n    }\n    \n    return string(data), nil\n}\n\n// Способ 3: os.ReadFile — самый краткий (Go 1.16+)\nfunc readFile(filename string) (string, error) {\n    data, err := os.ReadFile(filename)\n    if err != nil {\n        return "", err\n    }\n    return string(data), nil\n}\n\nfunc main() {\n    // Создаём тестовый файл в памяти\n    content := "Строка 1\\nСтрока 2\\nСтрока 3\\n"\n    reader := strings.NewReader(content)\n    \n    // Демонстрация Scanner\n    scanner := bufio.NewScanner(reader)\n    lineNum := 0\n    for scanner.Scan() {\n        lineNum++\n        fmt.Printf("Строка %d: %s\\n", lineNum, scanner.Text())\n    }\n    \n    fmt.Println("Прочитано строк:", lineNum)\n}'
        },
        {
          type: 'heading',
          value: 'Чтение по токенам'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "bufio"\n    "fmt"\n    "strings"\n)\n\nfunc main() {\n    content := "яблоко банан вишня\\nгруша слива персик"\n    reader := strings.NewReader(content)\n    \n    scanner := bufio.NewScanner(reader)\n    \n    // Разбивка по словам вместо строк\n    scanner.Split(bufio.ScanWords)\n    \n    var words []string\n    for scanner.Scan() {\n        words = append(words, scanner.Text())\n    }\n    \n    fmt.Printf("Слова: %v\\n", words)\n    fmt.Printf("Количество: %d\\n", len(words))\n    \n    // Разбивка по байтам\n    reader2 := strings.NewReader("Hello")\n    scanner2 := bufio.NewScanner(reader2)\n    scanner2.Split(bufio.ScanBytes)\n    for scanner2.Scan() {\n        fmt.Printf("%c ", scanner2.Bytes()[0])\n    }\n    fmt.Println()\n}'
        }
      ]
    },
    {
      id: 3,
      title: 'Запись в файлы',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Запись в файлы — обратная операция чтению. bufio.Writer добавляет буферизацию, что ускоряет запись (особенно множества маленьких записей). Как писать черновик, а потом отправить одним письмом, а не по букве.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "bufio"\n    "fmt"\n    "os"\n)\n\nfunc writeLines(filename string, lines []string) error {\n    // Создаём файл\n    f, err := os.Create(filename)\n    if err != nil {\n        return fmt.Errorf("writeLines create: %w", err)\n    }\n    defer f.Close()\n    \n    // Буферизованная запись — быстрее для многих маленьких операций\n    w := bufio.NewWriter(f)\n    \n    for i, line := range lines {\n        _, err := fmt.Fprintf(w, "%d: %s\\n", i+1, line)\n        if err != nil {\n            return fmt.Errorf("writeLines write: %w", err)\n        }\n    }\n    \n    // ВАЖНО: не забыть Flush() при использовании буфера!\n    if err := w.Flush(); err != nil {\n        return fmt.Errorf("writeLines flush: %w", err)\n    }\n    \n    return nil\n}\n\nfunc appendToFile(filename, content string) error {\n    // Открываем в режиме дозаписи\n    f, err := os.OpenFile(filename, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)\n    if err != nil {\n        return err\n    }\n    defer f.Close()\n    \n    _, err = fmt.Fprintln(f, content)\n    return err\n}\n\nfunc main() {\n    // os.WriteFile — запись одним вызовом (Go 1.16+)\n    data := []byte("Содержимое файла\\nВторая строка\\n")\n    err := os.WriteFile("example.txt", data, 0644)\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    fmt.Println("Файл записан")\n    \n    // Добавляем строки\n    appendToFile("example.txt", "Дополнительная строка")\n    \n    // Читаем обратно\n    result, _ := os.ReadFile("example.txt")\n    fmt.Printf("Содержимое:\\n%s", result)\n    \n    // Удаляем тестовый файл\n    os.Remove("example.txt")\n}'
        },
        {
          type: 'tip',
          value: 'os.WriteFile (Go 1.16+) — самый простой способ записать всё содержимое за один вызов. Для больших файлов или потоковой записи используйте bufio.Writer.'
        }
      ]
    },
    {
      id: 4,
      title: 'Информация о файле — os.Stat',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'os.Stat возвращает информацию о файле или директории: размер, права доступа, время изменения, тип. Как паспорт файла — все данные о нём.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "os"\n)\n\nfunc fileInfo(path string) {\n    info, err := os.Stat(path)\n    if err != nil {\n        if os.IsNotExist(err) {\n            fmt.Printf("%s: файл не существует\\n", path)\n        } else {\n            fmt.Printf("Ошибка: %v\\n", err)\n        }\n        return\n    }\n    \n    fmt.Printf("Имя:      %s\\n", info.Name())\n    fmt.Printf("Размер:   %d байт\\n", info.Size())\n    fmt.Printf("Режим:    %s\\n", info.Mode())\n    fmt.Printf("Изменён:  %s\\n", info.ModTime().Format("02.01.2006 15:04:05"))\n    fmt.Printf("Папка:    %v\\n", info.IsDir())\n}\n\nfunc exists(path string) bool {\n    _, err := os.Stat(path)\n    return !os.IsNotExist(err)\n}\n\nfunc main() {\n    // Создаём тестовый файл\n    os.WriteFile("test.txt", []byte("Тестовое содержимое\\nВторая строка"), 0644)\n    defer os.Remove("test.txt")\n    \n    fileInfo("test.txt")\n    fmt.Println()\n    fileInfo("/tmp") // Директория\n    fmt.Println()\n    fileInfo("несуществующий.txt")\n    \n    fmt.Println("\\nexists test.txt:", exists("test.txt"))\n    fmt.Println("exists other.txt:", exists("other.txt"))\n}'
        },
        {
          type: 'note',
          value: 'os.Lstat — как os.Stat, но для символических ссылок возвращает информацию о самой ссылке, а не о целевом файле.'
        }
      ]
    },
    {
      id: 5,
      title: 'Обход директорий',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Для обхода директорий Go предоставляет несколько инструментов. os.ReadDir — содержимое директории. filepath.Walk — рекурсивный обход дерева директорий.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "os"\n    "path/filepath"\n)\n\n// Чтение содержимого директории\nfunc listDir(dir string) error {\n    entries, err := os.ReadDir(dir)\n    if err != nil {\n        return fmt.Errorf("listDir: %w", err)\n    }\n    \n    fmt.Printf("Содержимое %s:\\n", dir)\n    for _, entry := range entries {\n        info, _ := entry.Info()\n        if entry.IsDir() {\n            fmt.Printf("  [DIR]  %s/\\n", entry.Name())\n        } else {\n            fmt.Printf("  [FILE] %-30s %d байт\\n",\n                entry.Name(), info.Size())\n        }\n    }\n    return nil\n}\n\n// Рекурсивный обход дерева\nfunc walkTree(root string) error {\n    return filepath.Walk(root, func(path string, info os.FileInfo, err error) error {\n        if err != nil {\n            return err // передаём ошибку выше\n        }\n        \n        // Вычисляем глубину вложенности\n        rel, _ := filepath.Rel(root, path)\n        depth := len(filepath.SplitList(rel))\n        indent := ""\n        for i := 0; i < depth-1; i++ {\n            indent += "  "\n        }\n        \n        if info.IsDir() {\n            fmt.Printf("%s[%s/]\\n", indent, info.Name())\n        } else {\n            fmt.Printf("%s%s (%d байт)\\n", indent, info.Name(), info.Size())\n        }\n        \n        return nil\n    })\n}\n\nfunc main() {\n    // Создаём тестовую структуру\n    os.MkdirAll("testdir/subdir", 0755)\n    os.WriteFile("testdir/file1.txt", []byte("содержимое 1"), 0644)\n    os.WriteFile("testdir/file2.txt", []byte("содержимое 2 длиннее"), 0644)\n    os.WriteFile("testdir/subdir/nested.txt", []byte("вложенный"), 0644)\n    defer os.RemoveAll("testdir")\n    \n    listDir("testdir")\n    fmt.Println()\n    fmt.Println("Рекурсивный обход:")\n    walkTree("testdir")\n}'
        },
        {
          type: 'heading',
          value: 'filepath.WalkDir — эффективнее filepath.Walk'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "os"\n    "path/filepath"\n    "strings"\n)\n\nfunc findGoFiles(root string) ([]string, error) {\n    var files []string\n    \n    err := filepath.WalkDir(root, func(path string, d os.DirEntry, err error) error {\n        if err != nil {\n            return err\n        }\n        \n        // Пропускаем скрытые директории\n        if d.IsDir() && strings.HasPrefix(d.Name(), ".") {\n            return filepath.SkipDir\n        }\n        \n        // Собираем .go файлы\n        if !d.IsDir() && strings.HasSuffix(d.Name(), ".go") {\n            files = append(files, path)\n        }\n        \n        return nil\n    })\n    \n    return files, err\n}\n\nfunc main() {\n    os.MkdirAll("project/.git", 0755)\n    os.WriteFile("project/main.go", []byte("package main"), 0644)\n    os.WriteFile("project/utils.go", []byte("package main"), 0644)\n    os.WriteFile("project/.git/config", []byte(""), 0644)\n    defer os.RemoveAll("project")\n    \n    files, err := findGoFiles("project")\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    fmt.Printf("Найдено Go файлов: %d\\n", len(files))\n    for _, f := range files {\n        fmt.Println(" ", f)\n    }\n}'
        }
      ]
    },
    {
      id: 6,
      title: 'Пакет filepath — работа с путями',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'path/filepath предоставляет функции для работы с путями файловой системы. Важно: filepath учитывает особенности ОС (/ в Unix, \\ в Windows), path — только прямые слеши.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "path/filepath"\n)\n\nfunc main() {\n    path := "/home/user/documents/report.pdf"\n    \n    // Компоненты пути\n    fmt.Println(filepath.Dir(path))      // /home/user/documents\n    fmt.Println(filepath.Base(path))     // report.pdf\n    fmt.Println(filepath.Ext(path))      // .pdf\n    \n    // Имя без расширения\n    base := filepath.Base(path)\n    ext := filepath.Ext(base)\n    name := base[:len(base)-len(ext)]\n    fmt.Println(name)                    // report\n    \n    // Объединение путей\n    joined := filepath.Join("/home", "user", "documents", "file.txt")\n    fmt.Println(joined)  // /home/user/documents/file.txt\n    \n    // Нормализация\n    fmt.Println(filepath.Clean("/home/user/../user/./file.txt"))\n    // /home/user/file.txt\n    \n    // Абсолютный путь\n    abs, _ := filepath.Abs("relative/path.txt")\n    fmt.Println(abs) // /текущая/директория/relative/path.txt\n    \n    // Относительный путь\n    rel, _ := filepath.Rel("/home/user", "/home/user/docs/file.txt")\n    fmt.Println(rel) // docs/file.txt\n    \n    // Разделение директории и файла\n    dir, file := filepath.Split("/home/user/doc.txt")\n    fmt.Printf("dir=%q, file=%q\\n", dir, file)\n    // dir="/home/user/", file="doc.txt"\n    \n    // Паттерн совпадения\n    matched, _ := filepath.Match("*.go", "main.go")\n    fmt.Println("*.go совпадает с main.go:", matched) // true\n    \n    // Glob — поиск по паттерну\n    // files, _ := filepath.Glob("/home/user/*.txt")\n}'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Утилита анализа директории',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте утилиту, которая анализирует директорию и выводит статистику.',
      requirements: [
        'Функция AnalyzeDir(path string) (*DirStats, error) обходит директорию рекурсивно',
        'Структура DirStats содержит: TotalFiles int, TotalDirs int, TotalSize int64, LargestFile string, LargestSize int64, ExtensionCount map[string]int',
        'Пропускать скрытые файлы и директории (начинающиеся с точки)',
        'Заполнять ExtensionCount — количество файлов каждого расширения',
        'Находить самый большой файл (LargestFile)',
        'Функция PrintStats(*DirStats) выводит статистику в читаемом формате'
      ],
      expectedOutput: '=== Статистика директории ===\nФайлов: 5\nДиректорий: 2\nОбщий размер: 1234 байт\nСамый большой: project/data.json (512 байт)\nРасширения:\n  .go: 3 файлов\n  .json: 1 файлов\n  .txt: 1 файлов',
      hint: 'Используйте filepath.WalkDir. Для расширения используйте filepath.Ext(). Скрытые файлы проверяйте через strings.HasPrefix(d.Name(), ".").',
      solution: 'package main\n\nimport (\n    "fmt"\n    "os"\n    "path/filepath"\n    "sort"\n    "strings"\n)\n\ntype DirStats struct {\n    TotalFiles     int\n    TotalDirs      int\n    TotalSize      int64\n    LargestFile    string\n    LargestSize    int64\n    ExtensionCount map[string]int\n}\n\nfunc AnalyzeDir(path string) (*DirStats, error) {\n    stats := &DirStats{\n        ExtensionCount: make(map[string]int),\n    }\n    \n    err := filepath.WalkDir(path, func(p string, d os.DirEntry, err error) error {\n        if err != nil {\n            return err\n        }\n        \n        // Пропускаем скрытые\n        if strings.HasPrefix(d.Name(), ".") {\n            if d.IsDir() {\n                return filepath.SkipDir\n            }\n            return nil\n        }\n        \n        // Пропускаем корневую директорию\n        if p == path {\n            return nil\n        }\n        \n        if d.IsDir() {\n            stats.TotalDirs++\n            return nil\n        }\n        \n        info, err := d.Info()\n        if err != nil {\n            return err\n        }\n        \n        stats.TotalFiles++\n        stats.TotalSize += info.Size()\n        \n        if info.Size() > stats.LargestSize {\n            stats.LargestSize = info.Size()\n            stats.LargestFile = p\n        }\n        \n        ext := strings.ToLower(filepath.Ext(d.Name()))\n        if ext == "" {\n            ext = "(без расширения)"\n        }\n        stats.ExtensionCount[ext]++\n        \n        return nil\n    })\n    \n    return stats, err\n}\n\nfunc PrintStats(stats *DirStats) {\n    fmt.Println("=== Статистика директории ===")\n    fmt.Printf("Файлов:       %d\\n", stats.TotalFiles)\n    fmt.Printf("Директорий:   %d\\n", stats.TotalDirs)\n    fmt.Printf("Общий размер: %d байт\\n", stats.TotalSize)\n    \n    if stats.LargestFile != "" {\n        fmt.Printf("Самый большой: %s (%d байт)\\n", stats.LargestFile, stats.LargestSize)\n    }\n    \n    if len(stats.ExtensionCount) > 0 {\n        fmt.Println("Расширения:")\n        // Сортируем расширения для стабильного вывода\n        exts := make([]string, 0, len(stats.ExtensionCount))\n        for ext := range stats.ExtensionCount {\n            exts = append(exts, ext)\n        }\n        sort.Strings(exts)\n        for _, ext := range exts {\n            fmt.Printf("  %s: %d файлов\\n", ext, stats.ExtensionCount[ext])\n        }\n    }\n}\n\nfunc main() {\n    // Создаём тестовую структуру\n    os.MkdirAll("testproject/cmd", 0755)\n    os.MkdirAll("testproject/.git", 0755)\n    os.WriteFile("testproject/main.go", []byte("package main\\n\\nfunc main() {}"), 0644)\n    os.WriteFile("testproject/utils.go", []byte("package main\\n\\nfunc helper() {}"), 0644)\n    os.WriteFile("testproject/cmd/server.go", []byte("package cmd\\n\\nfunc Run() {}"), 0644)\n    os.WriteFile("testproject/README.txt", []byte("Это README файл"), 0644)\n    os.WriteFile("testproject/config.json", []byte(`{"port": 8080}`), 0644)\n    os.WriteFile("testproject/.git/config", []byte("[core]\\n"), 0644)\n    defer os.RemoveAll("testproject")\n    \n    stats, err := AnalyzeDir("testproject")\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    PrintStats(stats)\n}',
      explanation: 'filepath.WalkDir эффективнее filepath.Walk так как не читает метаданные файла если не запрошено. filepath.SkipDir позволяет пропустить целую поддиректорию. Скрытые файлы фильтруются по первому символу имени.'
    }
  ]
}
