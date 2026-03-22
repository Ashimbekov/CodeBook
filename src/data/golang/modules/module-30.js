export default {
  id: 30,
  title: 'JSON',
  description: 'JSON — самый популярный формат обмена данными в веб-разработке. Пакет encoding/json предоставляет всё необходимое для маршалинга и анмаршалинга Go-структур в JSON и обратно.',
  lessons: [
    {
      id: 1,
      title: 'json.Marshal — Go в JSON',
      content: [
        {
          type: 'text',
          value: 'Маршалинг (marshaling) — преобразование Go-значений в JSON. json.Marshal принимает любое значение и возвращает []byte с JSON. Как перевод с русского на английский: структуры Go превращаются в JSON-объекты.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n)\n\ntype User struct {\n    ID       int    `json:"id"`\n    Name     string `json:"name"`\n    Email    string `json:"email"`\n    Password string `json:"-"`         // НЕ включать в JSON\n    Age      int    `json:"age"`\n}\n\nfunc main() {\n    u := User{\n        ID:       1,\n        Name:     "Нурик",\n        Email:    "nurik@example.com",\n        Password: "secret123",         // не попадёт в JSON\n        Age:      30,\n    }\n    \n    // Маршалинг\n    data, err := json.Marshal(u)\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    fmt.Println(string(data))\n    // {\"id\":1,\"name\":\"Нурик\",\"email\":\"nurik@example.com\",\"age\":30}\n    \n    // json.MarshalIndent — красивый вывод\n    pretty, _ := json.MarshalIndent(u, "", "  ")\n    fmt.Println(string(pretty))\n    \n    // Маршалинг слайсов и карт\n    items := []string{"яблоко", "банан", "вишня"}\n    itemsJSON, _ := json.Marshal(items)\n    fmt.Println(string(itemsJSON)) // [\"яблоко\",\"банан\",\"вишня\"]\n    \n    scores := map[string]int{"Нурик": 95, "Айжан": 87}\n    scoresJSON, _ := json.Marshal(scores)\n    fmt.Println(string(scoresJSON)) // {\"Айжан\":87,\"Нурик\":95}\n    \n    // Примитивные типы\n    numJSON, _ := json.Marshal(42)\n    fmt.Println(string(numJSON)) // 42\n    \n    boolJSON, _ := json.Marshal(true)\n    fmt.Println(string(boolJSON)) // true\n}'
        },
        {
          type: 'note',
          value: 'json.Marshal работает только с экспортируемыми полями (с заглавной буквы). Тег json:"-" полностью исключает поле из JSON. Это важно для паролей, токенов и внутренних данных.'
        }
      ]
    },
    {
      id: 2,
      title: 'json.Unmarshal — JSON в Go',
      content: [
        {
          type: 'text',
          value: 'Анмаршалинг (unmarshaling) — преобразование JSON в Go-значения. json.Unmarshal заполняет переменную данными из JSON. Принимает []byte и указатель на целевую переменную.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n)\n\ntype Product struct {\n    ID       int      `json:"id"`\n    Name     string   `json:"name"`\n    Price    float64  `json:"price"`\n    InStock  bool     `json:"in_stock"`\n    Tags     []string `json:"tags"`\n}\n\nfunc main() {\n    // JSON-строка -> структура\n    data := []byte(`{\n        "id": 42,\n        "name": "Ноутбук Pro",\n        "price": 249999.99,\n        "in_stock": true,\n        "tags": ["электроника", "компьютеры", "популярное"]\n    }`)\n    \n    var p Product\n    err := json.Unmarshal(data, &p)\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    \n    fmt.Printf("ID:     %d\\n", p.ID)\n    fmt.Printf("Имя:    %s\\n", p.Name)\n    fmt.Printf("Цена:   %.2f тг\\n", p.Price)\n    fmt.Printf("В наличии: %v\\n", p.InStock)\n    fmt.Printf("Теги:   %v\\n", p.Tags)\n    \n    // JSON-массив -> слайс структур\n    arrayData := []byte(`[\n        {"id":1,"name":"Мышь","price":4999.50,"in_stock":true,"tags":["аксессуар"]},\n        {"id":2,"name":"Клавиатура","price":12500,"in_stock":false,"tags":["аксессуар","офис"]}\n    ]`)\n    \n    var products []Product\n    err = json.Unmarshal(arrayData, &products)\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    \n    for _, prod := range products {\n        status := "есть"\n        if !prod.InStock {\n            status = "нет"\n        }\n        fmt.Printf("  %s — %.0f тг (%s)\\n", prod.Name, prod.Price, status)\n    }\n    \n    // Неизвестные поля игнорируются\n    extra := []byte(`{"id":99,"name":"Тест","unknown_field":"игнорируется","price":100}`)\n    var p2 Product\n    json.Unmarshal(extra, &p2)\n    fmt.Println("Имя:", p2.Name) // Тест\n}'
        }
      ]
    },
    {
      id: 3,
      title: 'Struct tags — теги структур',
      content: [
        {
          type: 'text',
          value: 'Теги структур управляют сериализацией JSON. Они позволяют: задавать имена полей в JSON, пропускать нулевые значения (omitempty), полностью исключать поля. Как метки на почтовых конвертах — указывают куда и как доставить.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n)\n\ntype Article struct {\n    ID          int     `json:"id"`\n    Title       string  `json:"title"`\n    Content     string  `json:"content"`\n    \n    // omitempty — пропускать если нулевое значение (0, "", false, nil)\n    Author      string  `json:"author,omitempty"`\n    ViewCount   int     `json:"view_count,omitempty"`\n    IsPublished bool    `json:"is_published,omitempty"`\n    \n    // - — полностью исключить\n    InternalID  string  `json:"-"`\n    \n    // Без тега — имя поля используется как есть\n    Priority    int\n    \n    // string — принудительно в строку\n    Score       float64 `json:"score,string"`\n}\n\nfunc main() {\n    // Статья с заполненными полями\n    a1 := Article{\n        ID:          1,\n        Title:       "Go для начинающих",\n        Content:     "Введение в язык Go...",\n        Author:      "Нурик",\n        ViewCount:   1500,\n        IsPublished: true,\n        InternalID:  "int-001",\n        Priority:    1,\n        Score:       4.8,\n    }\n    \n    data1, _ := json.MarshalIndent(a1, "", "  ")\n    fmt.Println("Полная статья:")\n    fmt.Println(string(data1))\n    // InternalID не попадёт в JSON\n    \n    // Статья с пустыми полями (omitempty)\n    a2 := Article{\n        ID:    2,\n        Title: "Статья без автора",\n    }\n    \n    data2, _ := json.MarshalIndent(a2, "", "  ")\n    fmt.Println("\\nСтатья без необязательных полей:")\n    fmt.Println(string(data2))\n    // author, view_count, is_published не будут включены\n}'
        },
        {
          type: 'tip',
          value: 'omitempty полезен для API-ответов: не отправляйте null-поля, которые клиент не ожидает. Но будьте осторожны: для bool false тоже опускается с omitempty! Для явного false используйте *bool.'
        }
      ]
    },
    {
      id: 4,
      title: 'Вложенный JSON',
      content: [
        {
          type: 'text',
          value: 'Реальные JSON-структуры часто бывают глубоко вложенными. Go структуры с вложенными структурами естественно отображаются на вложенный JSON.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n)\n\ntype Address struct {\n    Street  string `json:"street"`\n    City    string `json:"city"`\n    Country string `json:"country"`\n    Zip     string `json:"zip,omitempty"`\n}\n\ntype Contact struct {\n    Email string `json:"email"`\n    Phone string `json:"phone,omitempty"`\n}\n\ntype Company struct {\n    Name     string   `json:"name"`\n    Address  Address  `json:"address"` // вложенная структура\n    Contacts []Contact `json:"contacts"` // массив структур\n    Metadata map[string]interface{} `json:"metadata,omitempty"` // произвольные данные\n}\n\nfunc main() {\n    company := Company{\n        Name: "Tech Corp",\n        Address: Address{\n            Street:  "ул. Достык 5",\n            City:    "Алматы",\n            Country: "Казахстан",\n            Zip:     "050010",\n        },\n        Contacts: []Contact{\n            {Email: "info@techcorp.kz", Phone: "+77771234567"},\n            {Email: "support@techcorp.kz"},\n        },\n        Metadata: map[string]interface{}{\n            "founded": 2015,\n            "employees": 50,\n            "verified": true,\n        },\n    }\n    \n    data, _ := json.MarshalIndent(company, "", "  ")\n    fmt.Println(string(data))\n    \n    // Анмаршалинг вложенного JSON\n    jsonStr := `{\n        "name": "StartupXYZ",\n        "address": {"city": "Астана", "country": "Казахстан"},\n        "contacts": [{"email": "hello@startup.kz"}]\n    }`\n    \n    var c Company\n    json.Unmarshal([]byte(jsonStr), &c)\n    fmt.Printf("\\nКомпания: %s, город: %s\\n", c.Name, c.Address.City)\n    fmt.Printf("Контактов: %d\\n", len(c.Contacts))\n    \n    // interface{} для произвольных структур\n    var raw interface{}\n    json.Unmarshal([]byte(`{"key": "value", "num": 42, "arr": [1,2,3]}`), &raw)\n    \n    // raw становится map[string]interface{}\n    m := raw.(map[string]interface{})\n    fmt.Println("key:", m["key"])\n    fmt.Printf("num type: %T, value: %v\\n", m["num"], m["num"])\n}'
        }
      ]
    },
    {
      id: 5,
      title: 'json.Encoder и json.Decoder — потоковая обработка',
      content: [
        {
          type: 'text',
          value: 'json.Encoder и json.Decoder работают с потоками (io.Writer/io.Reader). Это эффективнее для больших данных или при работе с HTTP — не нужно читать всё в память. Как конвейер на заводе: обрабатываем данные по ходу поступления.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "bytes"\n    "encoding/json"\n    "fmt"\n    "strings"\n)\n\ntype Record struct {\n    ID   int    `json:"id"`\n    Name string `json:"name"`\n    Value float64 `json:"value"`\n}\n\nfunc main() {\n    // json.Encoder — запись в io.Writer\n    var buf bytes.Buffer\n    enc := json.NewEncoder(&buf)\n    enc.SetIndent("", "  ") // красивый вывод\n    \n    records := []Record{\n        {ID: 1, Name: "Первый", Value: 100.5},\n        {ID: 2, Name: "Второй", Value: 200.0},\n    }\n    \n    for _, r := range records {\n        enc.Encode(r) // каждый объект на новой строке\n    }\n    \n    fmt.Println("Закодировано:")\n    fmt.Println(buf.String())\n    \n    // json.Decoder — чтение из io.Reader\n    // Несколько JSON объектов подряд\n    multiJSON := `{\"id\":10,\"name\":\"A\",\"value\":1.1}\n{\"id\":20,\"name\":\"B\",\"value\":2.2}\n{\"id\":30,\"name\":\"C\",\"value\":3.3}`\n    \n    dec := json.NewDecoder(strings.NewReader(multiJSON))\n    \n    fmt.Println("Декодировано:")\n    for dec.More() {\n        var r Record\n        if err := dec.Decode(&r); err != nil {\n            fmt.Println("Ошибка:", err)\n            break\n        }\n        fmt.Printf("  id=%d name=%s value=%.1f\\n", r.ID, r.Name, r.Value)\n    }\n    \n    // Decoder.Token — токен за токеном (для больших файлов)\n    simpleJSON := `{\"name\":\"test\",\"count\":42}`\n    dec2 := json.NewDecoder(strings.NewReader(simpleJSON))\n    for {\n        t, err := dec2.Token()\n        if err != nil {\n            break\n        }\n        fmt.Printf("Токен: %T = %v\\n", t, t)\n    }\n}'
        }
      ]
    },
    {
      id: 6,
      title: 'Кастомный маршалинг',
      content: [
        {
          type: 'text',
          value: 'Иногда стандартного маршалинга недостаточно. Реализуйте интерфейсы json.Marshaler и json.Unmarshaler для полного контроля над форматом JSON.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n    "strings"\n    "time"\n)\n\n// Кастомный тип времени — формат DD.MM.YYYY\ntype Date struct {\n    time.Time\n}\n\nfunc (d Date) MarshalJSON() ([]byte, error) {\n    formatted := d.Time.Format("02.01.2006")\n    return []byte(`"` + formatted + `"`), nil\n}\n\nfunc (d *Date) UnmarshalJSON(data []byte) error {\n    s := strings.Trim(string(data), `"`)\n    t, err := time.Parse("02.01.2006", s)\n    if err != nil {\n        return fmt.Errorf("Date.UnmarshalJSON: %w", err)\n    }\n    d.Time = t\n    return nil\n}\n\n// Тип суммы — хранится в копейках, но JSON в тенге\ntype Money struct {\n    Cents int64\n}\n\nfunc (m Money) MarshalJSON() ([]byte, error) {\n    tenge := float64(m.Cents) / 100\n    return []byte(fmt.Sprintf("%.2f", tenge)), nil\n}\n\nfunc (m *Money) UnmarshalJSON(data []byte) error {\n    var tenge float64\n    if err := json.Unmarshal(data, &tenge); err != nil {\n        return err\n    }\n    m.Cents = int64(tenge * 100)\n    return nil\n}\n\ntype Invoice struct {\n    ID        int    `json:"id"`\n    Date      Date   `json:"date"`\n    Total     Money  `json:"total"`\n    ItemCount int    `json:"item_count"`\n}\n\nfunc main() {\n    inv := Invoice{\n        ID:        1001,\n        Date:      Date{time.Date(2024, 3, 15, 0, 0, 0, 0, time.UTC)},\n        Total:     Money{Cents: 2499999}, // 24999.99 тг\n        ItemCount: 3,\n    }\n    \n    data, _ := json.MarshalIndent(inv, "", "  ")\n    fmt.Println("JSON:")\n    fmt.Println(string(data))\n    \n    // Обратное преобразование\n    jsonStr := `{\"id\":1002,\"date\":\"20.06.2024\",\"total\":15000.50,\"item_count\":5}`\n    var inv2 Invoice\n    err := json.Unmarshal([]byte(jsonStr), &inv2)\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    fmt.Printf("\\nID: %d, Дата: %s, Сумма: %d коп.\\n",\n        inv2.ID, inv2.Date.Format("02.01.2006"), inv2.Total.Cents)\n}'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: REST API клиент',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте клиент для работы с JSONPlaceholder API с полноценной обработкой JSON.',
      requirements: [
        'Определить структуры: Post (id, userId, title, body), Comment (id, postId, name, email, body), APIError (code int, message string)',
        'APIError должна реализовывать интерфейс error',
        'Функция parsePost(data []byte) (*Post, error) — десериализация одного поста',
        'Функция parsePosts(data []byte) ([]Post, error) — десериализация массива постов',
        'Функция filterPostsByUser(posts []Post, userID int) []Post — фильтрация по автору',
        'Функция postsToJSON(posts []Post) (string, error) — сериализация с отступами',
        'Функция summarize(posts []Post) map[string]interface{} — возвращает статистику: total, users, avgBodyLength',
        'В main() использовать все функции с тестовыми данными'
      ],
      expectedOutput: 'Постов всего: 3\nПосты пользователя 1: 2\nСтатистика: total=3 users=2\nJSON поста:\n{"id":1,"userId":1,...}',
      hint: 'map[string]interface{} хорошо маршалится в JSON. Для подсчёта уникальных пользователей используйте map[int]bool. avgBodyLength считайте через sum/count.',
      solution: 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n)\n\ntype Post struct {\n    ID     int    `json:"id"`\n    UserID int    `json:"userId"`\n    Title  string `json:"title"`\n    Body   string `json:"body"`\n}\n\ntype Comment struct {\n    ID     int    `json:"id"`\n    PostID int    `json:"postId"`\n    Name   string `json:"name"`\n    Email  string `json:"email"`\n    Body   string `json:"body"`\n}\n\ntype APIError struct {\n    Code    int    `json:"code"`\n    Message string `json:"message"`\n}\n\nfunc (e *APIError) Error() string {\n    return fmt.Sprintf("API ошибка %d: %s", e.Code, e.Message)\n}\n\nfunc parsePost(data []byte) (*Post, error) {\n    var p Post\n    if err := json.Unmarshal(data, &p); err != nil {\n        return nil, fmt.Errorf("parsePost: %w", err)\n    }\n    if p.ID == 0 {\n        return nil, &APIError{Code: 400, Message: "неверный пост: ID = 0"}\n    }\n    return &p, nil\n}\n\nfunc parsePosts(data []byte) ([]Post, error) {\n    var posts []Post\n    if err := json.Unmarshal(data, &posts); err != nil {\n        return nil, fmt.Errorf("parsePosts: %w", err)\n    }\n    return posts, nil\n}\n\nfunc filterPostsByUser(posts []Post, userID int) []Post {\n    var result []Post\n    for _, p := range posts {\n        if p.UserID == userID {\n            result = append(result, p)\n        }\n    }\n    return result\n}\n\nfunc postsToJSON(posts []Post) (string, error) {\n    data, err := json.MarshalIndent(posts, "", "  ")\n    if err != nil {\n        return "", fmt.Errorf("postsToJSON: %w", err)\n    }\n    return string(data), nil\n}\n\nfunc summarize(posts []Post) map[string]interface{} {\n    users := make(map[int]bool)\n    totalBodyLen := 0\n    for _, p := range posts {\n        users[p.UserID] = true\n        totalBodyLen += len([]rune(p.Body))\n    }\n    avg := 0.0\n    if len(posts) > 0 {\n        avg = float64(totalBodyLen) / float64(len(posts))\n    }\n    return map[string]interface{}{\n        "total":         len(posts),\n        "users":         len(users),\n        "avgBodyLength": fmt.Sprintf("%.1f", avg),\n    }\n}\n\nfunc main() {\n    // Тестовые данные (имитация API-ответа)\n    postsJSON := `[\n        {\"id\":1,\"userId\":1,\"title\":\"Первый пост\",\"body\":\"Содержимое первого поста для тестирования API\"},\n        {\"id\":2,\"userId\":1,\"title\":\"Второй пост\",\"body\":\"Содержимое второго поста немного длиннее первого\"},\n        {\"id\":3,\"userId\":2,\"title\":\"Пост другого автора\",\"body\":\"Это пост от пользователя два\"}\n    ]`\n    \n    posts, err := parsePosts([]byte(postsJSON))\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    fmt.Printf("Постов всего: %d\\n", len(posts))\n    \n    user1Posts := filterPostsByUser(posts, 1)\n    fmt.Printf("Посты пользователя 1: %d\\n", len(user1Posts))\n    \n    stats := summarize(posts)\n    fmt.Printf("Статистика: total=%v users=%v avgBodyLength=%v\\n",\n        stats["total"], stats["users"], stats["avgBodyLength"])\n    \n    // Сериализация одного поста\n    singlePost := Post{ID: 1, UserID: 1, Title: "Тест", Body: "Тело поста"}\n    singleData, _ := json.MarshalIndent(singlePost, "", "  ")\n    fmt.Println("\\nJSON поста:")\n    fmt.Println(string(singleData))\n    \n    // Парсинг одного поста\n    postData := `{\"id\":99,\"userId\":5,\"title\":\"Новый\",\"body\":\"Текст\"}`\n    p, err := parsePost([]byte(postData))\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n    } else {\n        fmt.Printf("\\nРаспарсен пост: id=%d, автор=%d\\n", p.ID, p.UserID)\n    }\n    \n    // Тест APIError\n    _, err = parsePost([]byte(`{\"id\":0,\"userId\":1,\"title\":\"bad\"}`))\n    if err != nil {\n        fmt.Println("Ожидаемая ошибка:", err)\n    }\n    \n    // Статистика в JSON\n    statsJSON, _ := json.MarshalIndent(stats, "", "  ")\n    fmt.Println("\\nСтатистика JSON:")\n    fmt.Println(string(statsJSON))\n}',
      explanation: 'json.Unmarshal заполняет Go-структуры из JSON. Теги json:"fieldName" управляют именами полей. map[string]interface{} позволяет создавать динамические JSON-объекты. APIError реализует error через Error() string. json.MarshalIndent создаёт читаемый JSON.'
    }
  ]
}
