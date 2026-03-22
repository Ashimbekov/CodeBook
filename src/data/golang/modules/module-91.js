export default {
  id: 91,
  title: 'Практикум: Работа с данными',
  description: 'Практические задачи на работу с данными в Go: чтение и запись CSV, парсинг JSON конфигов, анализ лог-файлов, агрегация данных, key-value хранилище, валидация, статистические вычисления и конвейер трансформации данных.',
  lessons: [
    {
      id: 1,
      title: 'CSV Reader/Writer',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй утилиту для чтения и записи CSV файлов. Программа должна читать CSV с заголовками, фильтровать строки по условию и записывать результат в новый файл.',
      requirements: [
        'Создай структуру Employee: Name string, Department string, Salary int',
        'Функция readCSV(filename string) ([]Employee, error) — читает CSV файл',
        'CSV имеет заголовок: name,department,salary',
        'Функция writeCSV(filename string, employees []Employee) error — пишет CSV с заголовком',
        'Функция filterByDepartment(employees []Employee, dept string) []Employee',
        'В main: создай тестовые данные, запиши в CSV, прочитай обратно, отфильтруй по отделу и запиши результат',
        'Выведи количество записей до и после фильтрации'
      ],
      expectedOutput: 'Записано сотрудников: 5\nПрочитано сотрудников: 5\nСотрудников в отделе Engineering: 2\nФайл filtered.csv создан',
      hint: 'Используй пакет encoding/csv. csv.NewReader(file).ReadAll() читает все строки. csv.NewWriter(file) создаёт writer, вызывай Flush() после записи.',
      solution: 'package main\n\nimport (\n    "encoding/csv"\n    "fmt"\n    "os"\n    "strconv"\n)\n\ntype Employee struct {\n    Name       string\n    Department string\n    Salary     int\n}\n\nfunc writeCSV(filename string, employees []Employee) error {\n    f, err := os.Create(filename)\n    if err != nil {\n        return err\n    }\n    defer f.Close()\n    w := csv.NewWriter(f)\n    w.Write([]string{"name", "department", "salary"})\n    for _, e := range employees {\n        w.Write([]string{e.Name, e.Department, strconv.Itoa(e.Salary)})\n    }\n    w.Flush()\n    return w.Error()\n}\n\nfunc readCSV(filename string) ([]Employee, error) {\n    f, err := os.Open(filename)\n    if err != nil {\n        return nil, err\n    }\n    defer f.Close()\n    rows, err := csv.NewReader(f).ReadAll()\n    if err != nil {\n        return nil, err\n    }\n    var employees []Employee\n    for _, row := range rows[1:] {\n        salary, _ := strconv.Atoi(row[2])\n        employees = append(employees, Employee{Name: row[0], Department: row[1], Salary: salary})\n    }\n    return employees, nil\n}\n\nfunc filterByDepartment(employees []Employee, dept string) []Employee {\n    var result []Employee\n    for _, e := range employees {\n        if e.Department == dept {\n            result = append(result, e)\n        }\n    }\n    return result\n}\n\nfunc main() {\n    employees := []Employee{\n        {"Алексей", "Engineering", 120000},\n        {"Мария", "Marketing", 90000},\n        {"Иван", "Engineering", 130000},\n        {"Анна", "HR", 80000},\n        {"Дмитрий", "Marketing", 95000},\n    }\n    writeCSV("employees.csv", employees)\n    fmt.Printf("Записано сотрудников: %d\\n", len(employees))\n    read, _ := readCSV("employees.csv")\n    fmt.Printf("Прочитано сотрудников: %d\\n", len(read))\n    filtered := filterByDepartment(read, "Engineering")\n    fmt.Printf("Сотрудников в отделе Engineering: %d\\n", len(filtered))\n    writeCSV("filtered.csv", filtered)\n    fmt.Println("Файл filtered.csv создан")\n}',
      explanation: 'encoding/csv обеспечивает стандартное чтение и запись CSV. ReadAll() возвращает [][]string, где первая строка — заголовок (пропускаем через rows[1:]). csv.NewWriter требует вызова Flush() для сброса буфера на диск. Проверка w.Error() после Flush выявляет отложенные ошибки записи.'
    },
    {
      id: 2,
      title: 'JSON Config Parser',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай систему парсинга конфигурационных файлов JSON с поддержкой значений по умолчанию и валидации обязательных полей.',
      requirements: [
        'Структура Config: Host string, Port int, Database string, MaxConns int, Debug bool, Tags []string',
        'Функция LoadConfig(filename string) (*Config, error) — загружает JSON конфиг',
        'Функция (c *Config) Validate() error — проверяет: Host не пустой, Port в диапазоне 1-65535, Database не пустой',
        'Функция (c *Config) ApplyDefaults() — устанавливает MaxConns=10 если 0, Port=5432 если 0',
        'В main: создай тестовый JSON файл, загрузи, примени defaults, валидируй и выведи итоговую конфигурацию',
        'Обработай случай отсутствия файла'
      ],
      expectedOutput: 'Конфиг загружен: host=localhost port=5432\nМакс. соединений (default): 10\nВалидация пройдена\nТеги: [production web]',
      hint: 'Используй os.WriteFile для создания тестового файла, json.Unmarshal для парсинга. Метод Validate возвращает первую найденную ошибку через fmt.Errorf.',
      solution: 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n    "os"\n)\n\ntype Config struct {\n    Host     string   `json:"host"`\n    Port     int      `json:"port"`\n    Database string   `json:"database"`\n    MaxConns int      `json:"max_conns"`\n    Debug    bool     `json:"debug"`\n    Tags     []string `json:"tags"`\n}\n\nfunc LoadConfig(filename string) (*Config, error) {\n    data, err := os.ReadFile(filename)\n    if err != nil {\n        return nil, fmt.Errorf("не удалось прочитать файл: %w", err)\n    }\n    var cfg Config\n    if err := json.Unmarshal(data, &cfg); err != nil {\n        return nil, fmt.Errorf("ошибка парсинга JSON: %w", err)\n    }\n    return &cfg, nil\n}\n\nfunc (c *Config) Validate() error {\n    if c.Host == "" {\n        return fmt.Errorf("host не может быть пустым")\n    }\n    if c.Port < 1 || c.Port > 65535 {\n        return fmt.Errorf("port должен быть в диапазоне 1-65535")\n    }\n    if c.Database == "" {\n        return fmt.Errorf("database не может быть пустым")\n    }\n    return nil\n}\n\nfunc (c *Config) ApplyDefaults() {\n    if c.MaxConns == 0 {\n        c.MaxConns = 10\n    }\n    if c.Port == 0 {\n        c.Port = 5432\n    }\n}\n\nfunc main() {\n    raw := `{"host":"localhost","database":"mydb","debug":true,"tags":["production","web"]}`\n    os.WriteFile("config.json", []byte(raw), 0644)\n    cfg, err := LoadConfig("config.json")\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    cfg.ApplyDefaults()\n    fmt.Printf("Конфиг загружен: host=%s port=%d\\n", cfg.Host, cfg.Port)\n    fmt.Printf("Макс. соединений (default): %d\\n", cfg.MaxConns)\n    if err := cfg.Validate(); err != nil {\n        fmt.Println("Ошибка валидации:", err)\n        return\n    }\n    fmt.Println("Валидация пройдена")\n    fmt.Printf("Теги: %v\\n", cfg.Tags)\n}',
      explanation: 'json.Unmarshal заполняет структуру из байтов JSON. Теги json:"..." задают соответствие полей. ApplyDefaults применяется до Validate — так умолчания учитываются при проверке. fmt.Errorf с %w создаёт обёрнутые ошибки, которые можно проверить через errors.Is/errors.As.'
    },
    {
      id: 3,
      title: 'Анализатор лог-файлов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай анализатор лог-файлов, который парсит строки лога, подсчитывает статистику по уровням и находит наиболее частые ошибки.',
      requirements: [
        'Формат строки лога: 2024-01-15 10:30:00 [ERROR] сообщение об ошибке',
        'Структура LogEntry: Timestamp string, Level string, Message string',
        'Функция parseLog(line string) (LogEntry, error) — парсит одну строку',
        'Функция analyzeLogs(entries []LogEntry) map[string]int — подсчёт по уровням (INFO/WARN/ERROR)',
        'Функция topErrors(entries []LogEntry, n int) []string — топ N уникальных сообщений ERROR по частоте',
        'В main: создай тестовый лог-файл с 10+ строками, проанализируй и выведи статистику'
      ],
      expectedOutput: 'Всего строк: 12\nINFO: 5\nWARN: 3\nERROR: 4\nТоп ошибок:\n  database connection failed (2)\n  timeout exceeded (1)',
      hint: 'Используй strings.SplitN(line, " ", 4) для разбивки строки на части. Для подсчёта частот ошибок используй map[string]int. Для сортировки по частоте — sort.Slice.',
      solution: 'package main\n\nimport (\n    "bufio"\n    "fmt"\n    "os"\n    "sort"\n    "strings"\n)\n\ntype LogEntry struct {\n    Timestamp string\n    Level     string\n    Message   string\n}\n\nfunc parseLog(line string) (LogEntry, error) {\n    parts := strings.SplitN(line, " ", 4)\n    if len(parts) < 4 {\n        return LogEntry{}, fmt.Errorf("неверный формат: %s", line)\n    }\n    level := strings.Trim(parts[2], "[]")\n    return LogEntry{Timestamp: parts[0] + " " + parts[1], Level: level, Message: parts[3]}, nil\n}\n\nfunc analyzeLogs(entries []LogEntry) map[string]int {\n    counts := make(map[string]int)\n    for _, e := range entries {\n        counts[e.Level]++\n    }\n    return counts\n}\n\nfunc topErrors(entries []LogEntry, n int) []string {\n    freq := make(map[string]int)\n    for _, e := range entries {\n        if e.Level == "ERROR" {\n            freq[e.Message]++\n        }\n    }\n    type kv struct{ k string; v int }\n    var sorted []kv\n    for k, v := range freq {\n        sorted = append(sorted, kv{k, v})\n    }\n    sort.Slice(sorted, func(i, j int) bool { return sorted[i].v > sorted[j].v })\n    var result []string\n    for i := 0; i < n && i < len(sorted); i++ {\n        result = append(result, fmt.Sprintf("%s (%d)", sorted[i].k, sorted[i].v))\n    }\n    return result\n}\n\nfunc main() {\n    logData := "2024-01-15 10:00:00 [INFO] server started\\n" +\n        "2024-01-15 10:01:00 [INFO] listening on :8080\\n" +\n        "2024-01-15 10:02:00 [ERROR] database connection failed\\n" +\n        "2024-01-15 10:03:00 [WARN] high memory usage\\n" +\n        "2024-01-15 10:04:00 [ERROR] database connection failed\\n" +\n        "2024-01-15 10:05:00 [INFO] request handled\\n" +\n        "2024-01-15 10:06:00 [ERROR] timeout exceeded\\n" +\n        "2024-01-15 10:07:00 [WARN] slow query detected\\n" +\n        "2024-01-15 10:08:00 [INFO] cache hit\\n" +\n        "2024-01-15 10:09:00 [ERROR] nil pointer dereference\\n" +\n        "2024-01-15 10:10:00 [WARN] deprecated endpoint\\n" +\n        "2024-01-15 10:11:00 [INFO] request handled\\n"\n    os.WriteFile("app.log", []byte(logData), 0644)\n    f, _ := os.Open("app.log")\n    defer f.Close()\n    var entries []LogEntry\n    scanner := bufio.NewScanner(f)\n    for scanner.Scan() {\n        if e, err := parseLog(scanner.Text()); err == nil {\n            entries = append(entries, e)\n        }\n    }\n    fmt.Printf("Всего строк: %d\\n", len(entries))\n    stats := analyzeLogs(entries)\n    for _, level := range []string{"INFO", "WARN", "ERROR"} {\n        fmt.Printf("%s: %d\\n", level, stats[level])\n    }\n    fmt.Println("Топ ошибок:")\n    for _, e := range topErrors(entries, 3) {\n        fmt.Printf("  %s\\n", e)\n    }\n}',
      explanation: 'bufio.Scanner читает файл построчно без загрузки в память — эффективно для больших логов. strings.SplitN с n=4 разбивает строку на максимум 4 части, оставляя сообщение целым. sort.Slice с замыканием сортирует срез произвольных структур по любому полю.'
    },
    {
      id: 4,
      title: 'Агрегатор данных (группировка и суммирование)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй агрегатор продаж: группировка по категории, суммирование выручки, вычисление средних значений и нахождение топовых категорий.',
      requirements: [
        'Структура Sale: Product string, Category string, Amount float64, Quantity int',
        'Функция groupByCategory(sales []Sale) map[string][]Sale',
        'Функция sumByCategory(sales []Sale) map[string]float64 — суммарная выручка по категориям',
        'Функция avgByCategory(sales []Sale) map[string]float64 — средний чек по категориям',
        'Функция topCategories(sales []Sale, n int) []string — топ N категорий по выручке',
        'В main: создай 15+ тестовых продаж минимум из 4 категорий, выведи полный отчёт'
      ],
      expectedOutput: 'Всего продаж: 15\nКатегории:\n  Electronics: выручка=45000.00 средний чек=9000.00\n  Clothing: выручка=12000.00 средний чек=2400.00\nТоп-2 категории: [Electronics Clothing]',
      hint: 'Для topCategories создай срез пар {категория, сумма}, отсортируй по убыванию суммы через sort.Slice и возьми первые n элементов.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sort"\n)\n\ntype Sale struct {\n    Product  string\n    Category string\n    Amount   float64\n    Quantity int\n}\n\nfunc groupByCategory(sales []Sale) map[string][]Sale {\n    result := make(map[string][]Sale)\n    for _, s := range sales {\n        result[s.Category] = append(result[s.Category], s)\n    }\n    return result\n}\n\nfunc sumByCategory(sales []Sale) map[string]float64 {\n    result := make(map[string]float64)\n    for _, s := range sales {\n        result[s.Category] += s.Amount\n    }\n    return result\n}\n\nfunc avgByCategory(sales []Sale) map[string]float64 {\n    sums := sumByCategory(sales)\n    counts := make(map[string]int)\n    for _, s := range sales {\n        counts[s.Category]++\n    }\n    result := make(map[string]float64)\n    for cat, sum := range sums {\n        result[cat] = sum / float64(counts[cat])\n    }\n    return result\n}\n\nfunc topCategories(sales []Sale, n int) []string {\n    sums := sumByCategory(sales)\n    type kv struct{ k string; v float64 }\n    var sorted []kv\n    for k, v := range sums {\n        sorted = append(sorted, kv{k, v})\n    }\n    sort.Slice(sorted, func(i, j int) bool { return sorted[i].v > sorted[j].v })\n    var result []string\n    for i := 0; i < n && i < len(sorted); i++ {\n        result = append(result, sorted[i].k)\n    }\n    return result\n}\n\nfunc main() {\n    sales := []Sale{\n        {"Ноутбук", "Electronics", 80000, 1},\n        {"Телефон", "Electronics", 50000, 1},\n        {"Наушники", "Electronics", 15000, 2},\n        {"Футболка", "Clothing", 2000, 3},\n        {"Джинсы", "Clothing", 5000, 1},\n        {"Куртка", "Clothing", 12000, 1},\n        {"Книга по Go", "Books", 1500, 2},\n        {"Книга по алгоритмам", "Books", 2000, 1},\n        {"Стул", "Furniture", 8000, 1},\n        {"Стол", "Furniture", 15000, 1},\n        {"Планшет", "Electronics", 30000, 1},\n        {"Кроссовки", "Clothing", 6000, 1},\n        {"Словарь", "Books", 800, 1},\n        {"Лампа", "Furniture", 2500, 2},\n        {"Монитор", "Electronics", 25000, 1},\n    }\n    fmt.Printf("Всего продаж: %d\\n", len(sales))\n    sums := sumByCategory(sales)\n    avgs := avgByCategory(sales)\n    cats := topCategories(sales, 10)\n    fmt.Println("Категории:")\n    for _, cat := range cats {\n        fmt.Printf("  %s: выручка=%.2f средний чек=%.2f\\n", cat, sums[cat], avgs[cat])\n    }\n    fmt.Printf("Топ-2 категории: %v\\n", topCategories(sales, 2))\n}',
      explanation: 'Группировка через map[string][]Sale — стандартный паттерн в Go. Функции разделены по ответственности: groupBy, sumBy, avgBy — каждая делает одно. topCategories использует временный срез структур для сортировки по значению map, так как map в Go не упорядочена.'
    },
    {
      id: 5,
      title: 'Симулятор наблюдателя за файлом',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй симулятор наблюдателя за файлом (file watcher): программа периодически проверяет изменения файла и уведомляет об изменениях размера и времени модификации.',
      requirements: [
        'Структура FileInfo: Path string, Size int64, ModTime time.Time',
        'Функция getFileInfo(path string) (FileInfo, error)',
        'Функция Watch(path string, interval time.Duration, changes chan<- string, done <-chan struct{})',
        'Watch запускается в горутине, каждые interval проверяет файл',
        'При изменении размера или времени модификации отправляет сообщение в канал',
        'При получении сигнала из done — завершает работу',
        'В main: запусти watcher, измени файл трижды с паузами, останови через 5 итераций'
      ],
      expectedOutput: 'Наблюдение за файлом: test.txt\nИзменение обнаружено: размер изменился (0 -> 13 байт)\nИзменение обнаружено: размер изменился (13 -> 26 байт)\nНаблюдение завершено',
      hint: 'Храни предыдущее состояние FileInfo и сравнивай с текущим. Канал done типа chan struct{} — стандартный паттерн отмены в Go. Используй select с done и time.After для периодической проверки.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "os"\n    "time"\n)\n\ntype FileInfo struct {\n    Path    string\n    Size    int64\n    ModTime time.Time\n}\n\nfunc getFileInfo(path string) (FileInfo, error) {\n    info, err := os.Stat(path)\n    if err != nil {\n        return FileInfo{}, err\n    }\n    return FileInfo{Path: path, Size: info.Size(), ModTime: info.ModTime()}, nil\n}\n\nfunc Watch(path string, interval time.Duration, changes chan<- string, done <-chan struct{}) {\n    prev, err := getFileInfo(path)\n    if err != nil {\n        changes <- fmt.Sprintf("Ошибка начального чтения: %v", err)\n        return\n    }\n    ticker := time.NewTicker(interval)\n    defer ticker.Stop()\n    for {\n        select {\n        case <-done:\n            return\n        case <-ticker.C:\n            curr, err := getFileInfo(path)\n            if err != nil {\n                changes <- fmt.Sprintf("Ошибка чтения: %v", err)\n                continue\n            }\n            if curr.Size != prev.Size {\n                changes <- fmt.Sprintf("Изменение обнаружено: размер изменился (%d -> %d байт)", prev.Size, curr.Size)\n            } else if !curr.ModTime.Equal(prev.ModTime) {\n                changes <- "Изменение обнаружено: файл изменён"\n            }\n            prev = curr\n        }\n    }\n}\n\nfunc main() {\n    path := "test.txt"\n    os.WriteFile(path, []byte(""), 0644)\n    changes := make(chan string, 10)\n    done := make(chan struct{})\n    fmt.Printf("Наблюдение за файлом: %s\\n", path)\n    go Watch(path, 200*time.Millisecond, changes, done)\n    go func() {\n        time.Sleep(300 * time.Millisecond)\n        os.WriteFile(path, []byte("Hello, World!"), 0644)\n        time.Sleep(300 * time.Millisecond)\n        f, _ := os.OpenFile(path, os.O_APPEND|os.O_WRONLY, 0644)\n        f.WriteString("\\nДобавлено!")\n        f.Close()\n        time.Sleep(300 * time.Millisecond)\n        close(done)\n    }()\n    for msg := range changes {\n        fmt.Println(msg)\n    }\n    time.Sleep(100 * time.Millisecond)\n    fmt.Println("Наблюдение завершено")\n}',
      explanation: 'Паттерн done-канала (chan struct{}) — идиоматический способ отмены горутин в Go. select между ticker.C и done позволяет реагировать на оба события без блокировки. Буферизованный канал changes предотвращает блокировку горутины-наблюдателя при медленной обработке событий.'
    },
    {
      id: 6,
      title: 'Key-Value хранилище',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй потокобезопасное key-value хранилище с персистентностью на диске, поддержкой TTL (время жизни записи) и базовыми операциями.',
      requirements: [
        'Структура KVStore с полями: mu sync.RWMutex, data map[string]entry, filename string',
        'Структура entry: Value string, ExpiresAt time.Time (нулевое значение = бессрочно)',
        'Методы: Set(key, value string, ttl time.Duration), Get(key string) (string, bool), Delete(key string), Keys() []string',
        'Set с ttl=0 сохраняет бессрочно; Get возвращает false для истёкших ключей',
        'Метод Save(filename string) error — сохраняет в JSON на диск',
        'Метод Load(filename string) error — загружает из JSON файла',
        'В main: создай хранилище, добавь 5 записей (2 с TTL 1 секунда), подожди 1.5 сек, проверь что истекли'
      ],
      expectedOutput: 'Установлено 5 ключей\nЗначение name: Alice\nПосле ожидания 1.5 сек:\n  temp1 истёк: true\n  temp2 истёк: true\n  name жив: true\nХранилище сохранено\nКлючи в хранилище: [name city score]',
      hint: 'entry.ExpiresAt.IsZero() означает бессрочное хранение. В Get проверяй: если не IsZero и время.Now().After(ExpiresAt) — запись истекла, удали её и верни false.',
      solution: 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n    "os"\n    "sync"\n    "time"\n)\n\ntype entry struct {\n    Value     string    `json:"value"`\n    ExpiresAt time.Time `json:"expires_at"`\n}\n\ntype KVStore struct {\n    mu       sync.RWMutex\n    data     map[string]entry\n    filename string\n}\n\nfunc NewKVStore() *KVStore {\n    return &KVStore{data: make(map[string]entry)}\n}\n\nfunc (s *KVStore) Set(key, value string, ttl time.Duration) {\n    s.mu.Lock()\n    defer s.mu.Unlock()\n    e := entry{Value: value}\n    if ttl > 0 {\n        e.ExpiresAt = time.Now().Add(ttl)\n    }\n    s.data[key] = e\n}\n\nfunc (s *KVStore) Get(key string) (string, bool) {\n    s.mu.Lock()\n    defer s.mu.Unlock()\n    e, ok := s.data[key]\n    if !ok {\n        return "", false\n    }\n    if !e.ExpiresAt.IsZero() && time.Now().After(e.ExpiresAt) {\n        delete(s.data, key)\n        return "", false\n    }\n    return e.Value, true\n}\n\nfunc (s *KVStore) Delete(key string) {\n    s.mu.Lock()\n    defer s.mu.Unlock()\n    delete(s.data, key)\n}\n\nfunc (s *KVStore) Keys() []string {\n    s.mu.RLock()\n    defer s.mu.RUnlock()\n    keys := make([]string, 0, len(s.data))\n    for k := range s.data {\n        keys = append(keys, k)\n    }\n    return keys\n}\n\nfunc (s *KVStore) Save(filename string) error {\n    s.mu.RLock()\n    defer s.mu.RUnlock()\n    data, err := json.MarshalIndent(s.data, "", "  ")\n    if err != nil {\n        return err\n    }\n    return os.WriteFile(filename, data, 0644)\n}\n\nfunc (s *KVStore) Load(filename string) error {\n    data, err := os.ReadFile(filename)\n    if err != nil {\n        return err\n    }\n    s.mu.Lock()\n    defer s.mu.Unlock()\n    return json.Unmarshal(data, &s.data)\n}\n\nfunc main() {\n    store := NewKVStore()\n    store.Set("name", "Alice", 0)\n    store.Set("city", "Алматы", 0)\n    store.Set("score", "100", 0)\n    store.Set("temp1", "временное1", time.Second)\n    store.Set("temp2", "временное2", time.Second)\n    fmt.Printf("Установлено 5 ключей\\n")\n    if v, ok := store.Get("name"); ok {\n        fmt.Printf("Значение name: %s\\n", v)\n    }\n    time.Sleep(1500 * time.Millisecond)\n    fmt.Println("После ожидания 1.5 сек:")\n    _, ok1 := store.Get("temp1")\n    _, ok2 := store.Get("temp2")\n    _, ok3 := store.Get("name")\n    fmt.Printf("  temp1 истёк: %v\\n", !ok1)\n    fmt.Printf("  temp2 истёк: %v\\n", !ok2)\n    fmt.Printf("  name жив: %v\\n", ok3)\n    store.Save("store.json")\n    fmt.Println("Хранилище сохранено")\n    fmt.Printf("Ключи в хранилище: %v\\n", store.Keys())\n}',
      explanation: 'TTL реализован через поле ExpiresAt: ленивое удаление происходит при обращении Get. Мьютекс защищает от гонок данных при конкурентных операциях. В Get используем полный Lock (не RLock), поскольку может потребоваться удаление истёкшей записи. Персистентность через JSON позволяет сохранять и восстанавливать состояние между запусками.'
    },
    {
      id: 7,
      title: 'Валидатор данных',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай универсальный валидатор данных с поддержкой правил для разных типов полей: строки, числа, email, URL.',
      requirements: [
        'Тип ValidationError struct: Field string, Message string',
        'Интерфейс Validator: Validate(value interface{}) error',
        'Реализуй: RequiredValidator, MinLengthValidator(min int), MaxLengthValidator(max int), RangeValidator(min, max float64), EmailValidator, RegexValidator(pattern string)',
        'Функция ValidateStruct(rules map[string][]Validator, data map[string]interface{}) []ValidationError',
        'В main: создай правила для формы регистрации (username, email, age, password) и проверь корректные и некорректные данные'
      ],
      expectedOutput: 'Валидация корректных данных:\n  Ошибок: 0 — OK\nВалидация некорректных данных:\n  username: минимальная длина 3 символа\n  email: некорректный формат email\n  age: значение должно быть от 18 до 120',
      hint: 'EmailValidator может использовать regexp.MustCompile для паттерна email. Каждый Validator — структура, реализующая метод Validate(value interface{}) error. interface{} приводи к string через value.(string).',
      solution: 'package main\n\nimport (\n    "fmt"\n    "regexp"\n    "strings"\n)\n\ntype ValidationError struct {\n    Field   string\n    Message string\n}\n\ntype Validator interface {\n    Validate(value interface{}) error\n}\n\ntype RequiredValidator struct{}\nfunc (v RequiredValidator) Validate(value interface{}) error {\n    s, ok := value.(string)\n    if !ok || strings.TrimSpace(s) == "" {\n        return fmt.Errorf("поле обязательно для заполнения")\n    }\n    return nil\n}\n\ntype MinLengthValidator struct{ Min int }\nfunc (v MinLengthValidator) Validate(value interface{}) error {\n    s, _ := value.(string)\n    if len(s) < v.Min {\n        return fmt.Errorf("минимальная длина %d символа", v.Min)\n    }\n    return nil\n}\n\ntype MaxLengthValidator struct{ Max int }\nfunc (v MaxLengthValidator) Validate(value interface{}) error {\n    s, _ := value.(string)\n    if len(s) > v.Max {\n        return fmt.Errorf("максимальная длина %d символов", v.Max)\n    }\n    return nil\n}\n\ntype RangeValidator struct{ Min, Max float64 }\nfunc (v RangeValidator) Validate(value interface{}) error {\n    var num float64\n    switch val := value.(type) {\n    case int:\n        num = float64(val)\n    case float64:\n        num = val\n    default:\n        return fmt.Errorf("ожидается числовое значение")\n    }\n    if num < v.Min || num > v.Max {\n        return fmt.Errorf("значение должно быть от %.0f до %.0f", v.Min, v.Max)\n    }\n    return nil\n}\n\ntype EmailValidator struct{}\nvar emailRe = regexp.MustCompile(`^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$`)\nfunc (v EmailValidator) Validate(value interface{}) error {\n    s, _ := value.(string)\n    if !emailRe.MatchString(s) {\n        return fmt.Errorf("некорректный формат email")\n    }\n    return nil\n}\n\nfunc ValidateStruct(rules map[string][]Validator, data map[string]interface{}) []ValidationError {\n    var errors []ValidationError\n    for field, validators := range rules {\n        val := data[field]\n        for _, v := range validators {\n            if err := v.Validate(val); err != nil {\n                errors = append(errors, ValidationError{Field: field, Message: err.Error()})\n                break\n            }\n        }\n    }\n    return errors\n}\n\nfunc main() {\n    rules := map[string][]Validator{\n        "username": {RequiredValidator{}, MinLengthValidator{3}, MaxLengthValidator{20}},\n        "email":    {RequiredValidator{}, EmailValidator{}},\n        "age":      {RequiredValidator{}, RangeValidator{18, 120}},\n        "password": {RequiredValidator{}, MinLengthValidator{8}},\n    }\n    good := map[string]interface{}{"username": "alice123", "email": "alice@example.com", "age": 25, "password": "securepass"}\n    bad := map[string]interface{}{"username": "ab", "email": "не_email", "age": 15, "password": "ok12345678"}\n    fmt.Println("Валидация корректных данных:")\n    errs := ValidateStruct(rules, good)\n    if len(errs) == 0 {\n        fmt.Println("  Ошибок: 0 — OK")\n    }\n    fmt.Println("Валидация некорректных данных:")\n    for _, e := range ValidateStruct(rules, bad) {\n        fmt.Printf("  %s: %s\\n", e.Field, e.Message)\n    }\n}',
      explanation: 'Интерфейс Validator обеспечивает полиморфизм: любая структура с методом Validate становится валидатором. Type switch (switch val := value.(type)) позволяет обрабатывать разные числовые типы. Паттерн "стоп при первой ошибке" (break) предотвращает дублирование сообщений для одного поля.'
    },
    {
      id: 8,
      title: 'Слияние JSON файлов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй утилиту слияния нескольких JSON файлов в один. Поддержи стратегии слияния: merge (объединение), override (перезапись) и append (объединение массивов).',
      requirements: [
        'Функция loadJSON(filename string) (map[string]interface{}, error)',
        'Функция mergeJSON(base, override map[string]interface{}) map[string]interface{} — рекурсивное слияние',
        'При слиянии: значения из override перезаписывают base; если оба значения map — рекурсивно сливаем; если оба массива — добавляем элементы override к base',
        'Функция saveJSON(filename string, data map[string]interface{}) error — сохраняет с отступами',
        'В main: создай 3 JSON файла (base config, env override, feature flags), слей их и сохрани результат',
        'Выведи ключи итогового файла и 3 конкретных значения'
      ],
      expectedOutput: 'Создано файлов: 3\nОбъединено успешно\nИтоговые ключи: [database features flags server]\ndatabase.host: prod-server\nfeatures: [auth api reports]\nserver.port: 9090',
      hint: 'Для рекурсивного слияния: проверь типы значений через type assertion map[string]interface{}. Если оба значения — map, рекурсивно вызывай mergeJSON. Используй encoding/json с json.MarshalIndent.',
      solution: 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n    "os"\n    "sort"\n)\n\nfunc loadJSON(filename string) (map[string]interface{}, error) {\n    data, err := os.ReadFile(filename)\n    if err != nil {\n        return nil, err\n    }\n    var result map[string]interface{}\n    return result, json.Unmarshal(data, &result)\n}\n\nfunc mergeJSON(base, override map[string]interface{}) map[string]interface{} {\n    result := make(map[string]interface{})\n    for k, v := range base {\n        result[k] = v\n    }\n    for k, v := range override {\n        if baseVal, ok := result[k]; ok {\n            baseMap, baseIsMap := baseVal.(map[string]interface{})\n            overMap, overIsMap := v.(map[string]interface{})\n            if baseIsMap && overIsMap {\n                result[k] = mergeJSON(baseMap, overMap)\n                continue\n            }\n            baseArr, baseIsArr := baseVal.([]interface{})\n            overArr, overIsArr := v.([]interface{})\n            if baseIsArr && overIsArr {\n                result[k] = append(baseArr, overArr...)\n                continue\n            }\n        }\n        result[k] = v\n    }\n    return result\n}\n\nfunc saveJSON(filename string, data map[string]interface{}) error {\n    bytes, err := json.MarshalIndent(data, "", "  ")\n    if err != nil {\n        return err\n    }\n    return os.WriteFile(filename, bytes, 0644)\n}\n\nfunc main() {\n    base := map[string]interface{}{\n        "server":   map[string]interface{}{"host": "localhost", "port": 8080},\n        "database": map[string]interface{}{"host": "localhost", "name": "mydb"},\n        "features": []interface{}{"auth", "api"},\n    }\n    envOverride := map[string]interface{}{\n        "server":   map[string]interface{}{"host": "prod-server", "port": 9090},\n        "database": map[string]interface{}{"host": "prod-server"},\n        "features": []interface{}{"reports"},\n    }\n    featureFlags := map[string]interface{}{\n        "flags": map[string]interface{}{"darkMode": true, "betaFeature": false},\n    }\n    saveJSON("base.json", base)\n    saveJSON("env.json", envOverride)\n    saveJSON("flags.json", featureFlags)\n    fmt.Println("Создано файлов: 3")\n    merged := mergeJSON(base, envOverride)\n    merged = mergeJSON(merged, featureFlags)\n    saveJSON("merged.json", merged)\n    fmt.Println("Объединено успешно")\n    keys := make([]string, 0)\n    for k := range merged {\n        keys = append(keys, k)\n    }\n    sort.Strings(keys)\n    fmt.Printf("Итоговые ключи: %v\\n", keys)\n    db := merged["database"].(map[string]interface{})\n    fmt.Printf("database.host: %v\\n", db["host"])\n    fmt.Printf("features: %v\\n", merged["features"])\n    srv := merged["server"].(map[string]interface{})\n    fmt.Printf("server.port: %v\\n", srv["port"])\n}',
      explanation: 'Рекурсивное слияние JSON позволяет частично переопределять вложенные объекты без полной перезаписи. Type assertion с запятой (v.(T), ok) — безопасный способ проверки типа. append(baseArr, overArr...) объединяет два среза; оператор ... разворачивает срез в аргументы.'
    },
    {
      id: 9,
      title: 'Калькулятор статистики (среднее, медиана, мода)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй полноценный статистический калькулятор для числовых данных с вычислением основных метрик.',
      requirements: [
        'Функция Mean(data []float64) float64 — среднее арифметическое',
        'Функция Median(data []float64) float64 — медиана (не изменяй исходный срез)',
        'Функция Mode(data []float64) []float64 — мода (может быть несколько значений)',
        'Функция StdDev(data []float64) float64 — стандартное отклонение',
        'Функция Percentile(data []float64, p float64) float64 — p-й перцентиль (0-100)',
        'Функция Summary(data []float64) — выводит все метрики',
        'В main: примени калькулятор к двум наборам данных: оценки студентов и зарплаты сотрудников'
      ],
      expectedOutput: 'Оценки студентов:\n  Среднее: 7.50\n  Медиана: 7.50\n  Мода: [8]\n  Стд. отклонение: 1.80\n  90-й перцентиль: 9.70',
      hint: 'Для Median: скопируй срез через make+copy, отсортируй, верни средний элемент (или среднее двух средних для чётного числа элементов). Mode: найди максимальную частоту, собери все значения с этой частотой.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "math"\n    "sort"\n)\n\nfunc Mean(data []float64) float64 {\n    if len(data) == 0 {\n        return 0\n    }\n    sum := 0.0\n    for _, v := range data {\n        sum += v\n    }\n    return sum / float64(len(data))\n}\n\nfunc Median(data []float64) float64 {\n    if len(data) == 0 {\n        return 0\n    }\n    cp := make([]float64, len(data))\n    copy(cp, data)\n    sort.Float64s(cp)\n    n := len(cp)\n    if n%2 == 0 {\n        return (cp[n/2-1] + cp[n/2]) / 2\n    }\n    return cp[n/2]\n}\n\nfunc Mode(data []float64) []float64 {\n    freq := make(map[float64]int)\n    for _, v := range data {\n        freq[v]++\n    }\n    maxFreq := 0\n    for _, f := range freq {\n        if f > maxFreq {\n            maxFreq = f\n        }\n    }\n    var modes []float64\n    for v, f := range freq {\n        if f == maxFreq {\n            modes = append(modes, v)\n        }\n    }\n    sort.Float64s(modes)\n    return modes\n}\n\nfunc StdDev(data []float64) float64 {\n    if len(data) == 0 {\n        return 0\n    }\n    mean := Mean(data)\n    variance := 0.0\n    for _, v := range data {\n        d := v - mean\n        variance += d * d\n    }\n    return math.Sqrt(variance / float64(len(data)))\n}\n\nfunc Percentile(data []float64, p float64) float64 {\n    if len(data) == 0 {\n        return 0\n    }\n    cp := make([]float64, len(data))\n    copy(cp, data)\n    sort.Float64s(cp)\n    idx := p / 100 * float64(len(cp)-1)\n    lower := int(idx)\n    upper := lower + 1\n    if upper >= len(cp) {\n        return cp[len(cp)-1]\n    }\n    return cp[lower] + (idx-float64(lower))*(cp[upper]-cp[lower])\n}\n\nfunc Summary(label string, data []float64) {\n    fmt.Printf("%s:\\n", label)\n    fmt.Printf("  Среднее: %.2f\\n", Mean(data))\n    fmt.Printf("  Медиана: %.2f\\n", Median(data))\n    fmt.Printf("  Мода: %v\\n", Mode(data))\n    fmt.Printf("  Стд. отклонение: %.2f\\n", StdDev(data))\n    fmt.Printf("  90-й перцентиль: %.2f\\n", Percentile(data, 90))\n}\n\nfunc main() {\n    grades := []float64{5, 6, 7, 7, 8, 8, 8, 9, 9, 10}\n    Summary("Оценки студентов", grades)\n    salaries := []float64{80000, 95000, 120000, 150000, 85000, 200000, 110000, 95000}\n    Summary("Зарплаты сотрудников", salaries)\n}',
      explanation: 'Функция Median копирует данные перед сортировкой — побочный эффект изменения исходного среза нарушил бы принцип чистой функции. Для медианы чётного количества элементов берётся среднее двух центральных. Перцентиль вычисляется через линейную интерполяцию между соседними значениями — стандартный метод R7.'
    },
    {
      id: 10,
      title: 'Конвейер трансформации данных',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй функциональный конвейер (pipeline) для трансформации данных с поддержкой цепочки операций: map, filter, reduce, sort, take, skip.',
      requirements: [
        'Тип Pipeline struct, хранящий []float64',
        'Конструктор NewPipeline(data []float64) *Pipeline',
        'Методы возвращают *Pipeline для цепочки вызовов (method chaining):',
        'Map(fn func(float64) float64) *Pipeline',
        'Filter(fn func(float64) bool) *Pipeline',
        'Sort(asc bool) *Pipeline — сортировка по возрастанию/убыванию',
        'Take(n int) *Pipeline — первые n элементов',
        'Skip(n int) *Pipeline — пропустить первые n элементов',
        'Reduce(initial float64, fn func(acc, v float64) float64) float64 — терминальная операция',
        'Result() []float64 — получить результат',
        'В main: демонстрация 3 цепочек обработки'
      ],
      expectedOutput: 'Чётные числа * 2 (топ 5): [2 4 6 8 10]\nСумма квадратов > 10: 3740\nОтфильтровано и отсортировано: [4.2 8.1 9.3 15.7 22.4]',
      hint: 'Каждый метод создаёт новый срез, не изменяя исходный. Для Method Chaining каждый метод возвращает *Pipeline (указатель на себя). Reduce — единственная операция, возвращающая значение, а не *Pipeline.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sort"\n)\n\ntype Pipeline struct {\n    data []float64\n}\n\nfunc NewPipeline(data []float64) *Pipeline {\n    cp := make([]float64, len(data))\n    copy(cp, data)\n    return &Pipeline{data: cp}\n}\n\nfunc (p *Pipeline) Map(fn func(float64) float64) *Pipeline {\n    result := make([]float64, len(p.data))\n    for i, v := range p.data {\n        result[i] = fn(v)\n    }\n    return &Pipeline{data: result}\n}\n\nfunc (p *Pipeline) Filter(fn func(float64) bool) *Pipeline {\n    var result []float64\n    for _, v := range p.data {\n        if fn(v) {\n            result = append(result, v)\n        }\n    }\n    return &Pipeline{data: result}\n}\n\nfunc (p *Pipeline) Sort(asc bool) *Pipeline {\n    cp := make([]float64, len(p.data))\n    copy(cp, p.data)\n    sort.Float64s(cp)\n    if !asc {\n        for i, j := 0, len(cp)-1; i < j; i, j = i+1, j-1 {\n            cp[i], cp[j] = cp[j], cp[i]\n        }\n    }\n    return &Pipeline{data: cp}\n}\n\nfunc (p *Pipeline) Take(n int) *Pipeline {\n    if n > len(p.data) {\n        n = len(p.data)\n    }\n    return &Pipeline{data: p.data[:n]}\n}\n\nfunc (p *Pipeline) Skip(n int) *Pipeline {\n    if n > len(p.data) {\n        n = len(p.data)\n    }\n    return &Pipeline{data: p.data[n:]}\n}\n\nfunc (p *Pipeline) Reduce(initial float64, fn func(acc, v float64) float64) float64 {\n    acc := initial\n    for _, v := range p.data {\n        acc = fn(acc, v)\n    }\n    return acc\n}\n\nfunc (p *Pipeline) Result() []float64 {\n    return p.data\n}\n\nfunc main() {\n    numbers := []float64{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15}\n    result1 := NewPipeline(numbers).\n        Filter(func(v float64) bool { return int(v)%2 == 0 }).\n        Map(func(v float64) float64 { return v * 2 }).\n        Take(5).\n        Result()\n    fmt.Printf("Чётные числа * 2 (топ 5): %v\\n", result1)\n    sum := NewPipeline(numbers).\n        Map(func(v float64) float64 { return v * v }).\n        Filter(func(v float64) bool { return v > 10 }).\n        Reduce(0, func(acc, v float64) float64 { return acc + v })\n    fmt.Printf("Сумма квадратов > 10: %.0f\\n", sum)\n    mixed := []float64{22.4, 4.2, 15.7, 1.1, 8.1, 9.3, 0.5}\n    result3 := NewPipeline(mixed).\n        Filter(func(v float64) bool { return v > 3.0 }).\n        Sort(true).\n        Result()\n    fmt.Printf("Отфильтровано и отсортировано: %v\\n", result3)\n}',
      explanation: 'Method chaining (цепочки методов) достигается возвратом *Pipeline из каждого промежуточного метода. Каждый шаг создаёт новый срез — иммутабельность предотвращает неожиданные побочные эффекты. Паттерн Builder/Fluent Interface широко применяется в Go для построения запросов, конфигураций и именно таких конвейеров обработки данных.'
    }
  ]
}
