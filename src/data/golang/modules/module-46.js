export default {
  id: 46,
  title: 'HTTP сервер (net/http)',
  description: 'Создание HTTP серверов на чистом Go: ListenAndServe, обработчики, работа с запросами и ответами, статические файлы, параметры запроса, формы и HTTP методы.',
  lessons: [
    {
      id: 1,
      title: 'Первый HTTP сервер',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пакет net/http — встроенный инструмент Go для создания HTTP серверов. За несколько строк кода можно поднять полноценный веб-сервер.' },
        { type: 'heading', value: 'Минимальный HTTP сервер' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "net/http"\n)\n\nfunc main() {\n    // http.HandleFunc регистрирует обработчик для пути\n    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {\n        fmt.Fprintln(w, "Привет, мир!")\n    })\n\n    http.HandleFunc("/about", func(w http.ResponseWriter, r *http.Request) {\n        fmt.Fprintln(w, "О нас")\n    })\n\n    // http.ListenAndServe запускает сервер\n    // Первый аргумент: адрес (host:port)\n    // Второй аргумент: обработчик (nil = DefaultServeMux)\n    fmt.Println("Сервер запущен на http://localhost:8080")\n    err := http.ListenAndServe(":8080", nil)\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n    }\n}' },
        { type: 'tip', value: 'ListenAndServe блокирует выполнение — сервер работает до остановки. Возвращает ошибку только при проблемах запуска (занятый порт, недостаточно прав).' },
        { type: 'heading', value: 'Структура запроса и ответа' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "net/http"\n)\n\nfunc infoHandler(w http.ResponseWriter, r *http.Request) {\n    // http.Request — входящий запрос\n    fmt.Fprintf(w, "Метод: %s\\n", r.Method)   // GET, POST, ...\n    fmt.Fprintf(w, "URL: %s\\n", r.URL.Path)   // /info\n    fmt.Fprintf(w, "Host: %s\\n", r.Host)       // localhost:8080\n    fmt.Fprintf(w, "UserAgent: %s\\n", r.UserAgent())\n\n    // http.ResponseWriter — исходящий ответ\n    // Устанавливаем заголовки ДО записи тела!\n    w.Header().Set("Content-Type", "text/plain; charset=utf-8")\n    w.Header().Set("X-Custom-Header", "my-value")\n\n    // WriteHeader устанавливает статус-код\n    // Вызывается один раз, ДО Write\n    w.WriteHeader(http.StatusOK) // 200 (по умолчанию)\n\n    fmt.Fprintln(w, "Запрос успешно обработан")\n}\n\nfunc main() {\n    http.HandleFunc("/info", infoHandler)\n    http.ListenAndServe(":8080", nil)\n}' }
      ]
    },
    {
      id: 2,
      title: 'HandleFunc и обработчики',
      type: 'theory',
      content: [
        { type: 'text', value: 'Go предоставляет несколько способов регистрации обработчиков. Кроме HandleFunc есть интерфейс http.Handler для объектно-ориентированного подхода.' },
        { type: 'heading', value: 'http.Handler интерфейс' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "net/http"\n)\n\n// Кастомный обработчик через интерфейс http.Handler\ntype GreetHandler struct {\n    Name string\n}\n\n// Реализуем интерфейс: ServeHTTP(ResponseWriter, *Request)\nfunc (h *GreetHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {\n    fmt.Fprintf(w, "Привет, %s!\\n", h.Name)\n}\n\n// ServeMux — мультиплексор (маршрутизатор)\nfunc main() {\n    mux := http.NewServeMux()\n\n    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {\n        fmt.Fprintln(w, "Главная страница")\n    })\n\n    mux.Handle("/greet", &GreetHandler{Name: "Нурдаулет"})\n\n    mux.HandleFunc("/api/ping", func(w http.ResponseWriter, r *http.Request) {\n        w.Header().Set("Content-Type", "application/json")\n        fmt.Fprintln(w, `{"status":"ok"}`)\n    })\n\n    server := &http.Server{\n        Addr:    ":8080",\n        Handler: mux,\n    }\n\n    fmt.Println("Сервер на :8080")\n    server.ListenAndServe()\n}' },
        { type: 'heading', value: 'Настройка сервера через http.Server' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "net/http"\n    "time"\n)\n\nfunc main() {\n    mux := http.NewServeMux()\n    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {\n        fmt.Fprintln(w, "OK")\n    })\n\n    // http.Server с тонкой настройкой\n    server := &http.Server{\n        Addr:         ":8080",\n        Handler:      mux,\n        ReadTimeout:  10 * time.Second, // таймаут чтения запроса\n        WriteTimeout: 10 * time.Second, // таймаут записи ответа\n        IdleTimeout:  60 * time.Second, // таймаут keep-alive соединения\n    }\n\n    fmt.Println("Сервер запущен с настройками безопасности")\n    if err := server.ListenAndServe(); err != nil {\n        fmt.Println("Ошибка:", err)\n    }\n}' },
        { type: 'warning', value: 'Никогда не используй http.ListenAndServe(addr, nil) в продакшне без таймаутов — это открывает сервер для Slowloris и других атак. Всегда настраивай ReadTimeout и WriteTimeout.' }
      ]
    },
    {
      id: 3,
      title: 'Request и ResponseWriter',
      type: 'theory',
      content: [
        { type: 'text', value: 'Глубокое понимание http.Request и http.ResponseWriter — основа работы с HTTP в Go.' },
        { type: 'heading', value: 'Работа с http.Request' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "io"\n    "net/http"\n)\n\nfunc requestHandler(w http.ResponseWriter, r *http.Request) {\n    // Метод запроса\n    fmt.Fprintf(w, "Метод: %s\\n", r.Method)\n\n    // URL и его части\n    fmt.Fprintf(w, "Path: %s\\n", r.URL.Path)\n    fmt.Fprintf(w, "RawQuery: %s\\n", r.URL.RawQuery)\n    fmt.Fprintf(w, "Fragment: %s\\n", r.URL.Fragment)\n\n    // Заголовки запроса\n    fmt.Fprintf(w, "Content-Type: %s\\n", r.Header.Get("Content-Type"))\n    fmt.Fprintf(w, "Authorization: %s\\n", r.Header.Get("Authorization"))\n\n    // Тело запроса (для POST/PUT)\n    if r.Method == http.MethodPost {\n        body, err := io.ReadAll(r.Body)\n        defer r.Body.Close()\n        if err != nil {\n            http.Error(w, "Ошибка чтения тела", http.StatusBadRequest)\n            return\n        }\n        fmt.Fprintf(w, "Тело: %s\\n", string(body))\n    }\n\n    // Куки\n    if cookie, err := r.Cookie("session"); err == nil {\n        fmt.Fprintf(w, "Cookie session: %s\\n", cookie.Value)\n    }\n\n    // IP клиента\n    fmt.Fprintf(w, "RemoteAddr: %s\\n", r.RemoteAddr)\n}\n\nfunc main() {\n    http.HandleFunc("/request", requestHandler)\n    http.ListenAndServe(":8080", nil)\n}' },
        { type: 'heading', value: 'Работа с ResponseWriter' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "encoding/json"\n    "net/http"\n)\n\ntype Response struct {\n    Status  string      `json:"status"`\n    Message string      `json:"message"`\n    Data    interface{} `json:"data,omitempty"`\n}\n\nfunc jsonHandler(w http.ResponseWriter, r *http.Request) {\n    // Устанавливаем заголовки ПЕРЕД WriteHeader и Write\n    w.Header().Set("Content-Type", "application/json")\n    w.Header().Set("X-Request-ID", "req-123")\n\n    // Устанавливаем статус\n    w.WriteHeader(http.StatusOK)\n\n    // Отправляем JSON\n    resp := Response{\n        Status:  "success",\n        Message: "Данные получены",\n        Data:    map[string]int{"count": 42},\n    }\n    json.NewEncoder(w).Encode(resp)\n}\n\nfunc errorHandler(w http.ResponseWriter, r *http.Request) {\n    // http.Error устанавливает статус и тело одновременно\n    http.Error(w, "Ресурс не найден", http.StatusNotFound)\n}\n\nfunc redirectHandler(w http.ResponseWriter, r *http.Request) {\n    http.Redirect(w, r, "/new-path", http.StatusMovedPermanently)\n}\n\nfunc main() {\n    http.HandleFunc("/json", jsonHandler)\n    http.HandleFunc("/error", errorHandler)\n    http.HandleFunc("/old", redirectHandler)\n    http.ListenAndServe(":8080", nil)\n}' }
      ]
    },
    {
      id: 4,
      title: 'Параметры запроса (query parameters)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Query параметры — это данные в URL после знака ?: /search?q=golang&page=2. Go предоставляет удобный API для работы с ними.' },
        { type: 'heading', value: 'Чтение query параметров' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "net/http"\n    "strconv"\n)\n\nfunc searchHandler(w http.ResponseWriter, r *http.Request) {\n    // r.URL.Query() возвращает url.Values (map[string][]string)\n    query := r.URL.Query()\n\n    // Get возвращает первое значение параметра (или "")\n    q := query.Get("q")\n    if q == "" {\n        http.Error(w, "Параметр q обязателен", http.StatusBadRequest)\n        return\n    }\n\n    // Параметр с дефолтным значением\n    pageStr := query.Get("page")\n    page := 1\n    if pageStr != "" {\n        var err error\n        page, err = strconv.Atoi(pageStr)\n        if err != nil || page < 1 {\n            http.Error(w, "Некорректный номер страницы", http.StatusBadRequest)\n            return\n        }\n    }\n\n    // Многозначный параметр: /search?tag=go&tag=api&tag=http\n    tags := query["tag"] // []string\n\n    w.Header().Set("Content-Type", "application/json")\n    fmt.Fprintf(w, `{"query":%q,"page":%d,"tags":%q}`, q, page, tags)\n}\n\nfunc main() {\n    // Тест: curl "http://localhost:8080/search?q=golang&page=2&tag=go&tag=api"\n    http.HandleFunc("/search", searchHandler)\n    http.ListenAndServe(":8080", nil)\n}' },
        { type: 'tip', value: 'Всегда валидируй и приводи типы query параметров. Они всегда строки — нужно явно конвертировать в int, float и т.д. Используй strconv.Atoi() для чисел.' }
      ]
    },
    {
      id: 5,
      title: 'Обработка форм',
      type: 'theory',
      content: [
        { type: 'text', value: 'HTML-формы отправляют данные через POST запрос в формате application/x-www-form-urlencoded или multipart/form-data (для загрузки файлов).' },
        { type: 'heading', value: 'ParseForm и FormValue' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "net/http"\n)\n\nfunc formHandler(w http.ResponseWriter, r *http.Request) {\n    if r.Method == http.MethodGet {\n        // Возвращаем HTML форму\n        w.Header().Set("Content-Type", "text/html")\n        fmt.Fprintln(w, `<form method="POST" action="/form">`)\n        fmt.Fprintln(w, `  <input name="name" placeholder="Имя">`)\n        fmt.Fprintln(w, `  <input name="email" placeholder="Email">`)\n        fmt.Fprintln(w, `  <button type="submit">Отправить</button>`)\n        fmt.Fprintln(w, `</form>`)\n        return\n    }\n\n    // ParseForm парсит тело запроса\n    if err := r.ParseForm(); err != nil {\n        http.Error(w, "Ошибка парсинга формы", http.StatusBadRequest)\n        return\n    }\n\n    // FormValue читает из тела И из query\n    name := r.FormValue("name")\n    email := r.FormValue("email")\n\n    if name == "" || email == "" {\n        http.Error(w, "Имя и Email обязательны", http.StatusBadRequest)\n        return\n    }\n\n    fmt.Fprintf(w, "Получено: имя=%s, email=%s\\n", name, email)\n}\n\nfunc main() {\n    http.HandleFunc("/form", formHandler)\n    http.ListenAndServe(":8080", nil)\n}' },
        { type: 'heading', value: 'Загрузка файлов (multipart)' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "io"\n    "net/http"\n    "os"\n)\n\nfunc uploadHandler(w http.ResponseWriter, r *http.Request) {\n    if r.Method != http.MethodPost {\n        http.Error(w, "Только POST", http.StatusMethodNotAllowed)\n        return\n    }\n\n    // Лимит 10 МБ в памяти\n    r.ParseMultipartForm(10 << 20)\n\n    file, header, err := r.FormFile("file")\n    if err != nil {\n        http.Error(w, "Файл не найден", http.StatusBadRequest)\n        return\n    }\n    defer file.Close()\n\n    // Сохраняем файл\n    dst, err := os.Create("uploads/" + header.Filename)\n    if err != nil {\n        http.Error(w, "Ошибка сохранения", http.StatusInternalServerError)\n        return\n    }\n    defer dst.Close()\n\n    written, err := io.Copy(dst, file)\n    if err != nil {\n        http.Error(w, "Ошибка копирования", http.StatusInternalServerError)\n        return\n    }\n\n    fmt.Fprintf(w, "Сохранён файл: %s (%d байт)\\n", header.Filename, written)\n}\n\nfunc main() {\n    os.MkdirAll("uploads", 0755)\n    http.HandleFunc("/upload", uploadHandler)\n    http.ListenAndServe(":8080", nil)\n}' }
      ]
    },
    {
      id: 6,
      title: 'HTTP методы и маршрутизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'HTTP методы (GET, POST, PUT, DELETE, PATCH) определяют тип операции. Стандартный ServeMux не различает методы — это нужно делать вручную.' },
        { type: 'heading', value: 'Ручная маршрутизация по методам' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n    "net/http"\n    "strings"\n)\n\ntype User struct {\n    ID   int    `json:"id"`\n    Name string `json:"name"`\n}\n\nvar users = []User{\n    {ID: 1, Name: "Нурдаулет"},\n    {ID: 2, Name: "Айгерим"},\n}\n\nfunc usersHandler(w http.ResponseWriter, r *http.Request) {\n    w.Header().Set("Content-Type", "application/json")\n\n    switch r.Method {\n    case http.MethodGet:\n        // GET /users — получить список\n        json.NewEncoder(w).Encode(users)\n\n    case http.MethodPost:\n        // POST /users — создать пользователя\n        var u User\n        if err := json.NewDecoder(r.Body).Decode(&u); err != nil {\n            http.Error(w, "Неверный формат JSON", http.StatusBadRequest)\n            return\n        }\n        u.ID = len(users) + 1\n        users = append(users, u)\n        w.WriteHeader(http.StatusCreated)\n        json.NewEncoder(w).Encode(u)\n\n    default:\n        http.Error(w, "Метод не поддерживается", http.StatusMethodNotAllowed)\n    }\n}\n\nfunc main() {\n    http.HandleFunc("/users", usersHandler)\n    fmt.Println("API сервер на :8080")\n    // GET  /users          — список пользователей\n    // POST /users + JSON   — создание пользователя\n    _ = strings.ToLower // заглушка импорта\n    http.ListenAndServe(":8080", nil)\n}' },
        { type: 'tip', value: 'Для серьёзного REST API с параметрами в URL (/users/{id}) стандартный ServeMux неудобен — используй chi или gorilla/mux (модуль 50).' }
      ]
    },
    {
      id: 7,
      title: 'Статические файлы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Go может раздавать статические файлы (HTML, CSS, JS, изображения) через встроенный FileServer.' },
        { type: 'heading', value: 'http.FileServer' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "net/http"\n)\n\nfunc main() {\n    mux := http.NewServeMux()\n\n    // Раздаём статические файлы из папки ./static\n    // /static/style.css -> ./static/style.css\n    fs := http.FileServer(http.Dir("./static"))\n    mux.Handle("/static/", http.StripPrefix("/static/", fs))\n\n    // API маршруты\n    mux.HandleFunc("/api/data", func(w http.ResponseWriter, r *http.Request) {\n        w.Header().Set("Content-Type", "application/json")\n        fmt.Fprintln(w, `{"data":"test"}`)\n    })\n\n    // Главная страница\n    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {\n        if r.URL.Path != "/" {\n            http.NotFound(w, r)\n            return\n        }\n        http.ServeFile(w, r, "./static/index.html")\n    })\n\n    fmt.Println("Сервер на :8080")\n    fmt.Println("Статика: http://localhost:8080/static/file.txt")\n    http.ListenAndServe(":8080", mux)\n}' },
        { type: 'note', value: 'http.StripPrefix удаляет префикс URL перед передачей в FileServer. Без него сервер искал бы файл по пути /static/file.txt в директории ./static, а нашёл бы только ./static/static/file.txt.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: мини HTTP сервер',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай HTTP сервер с несколькими маршрутами: главная страница, JSON API endpoint, echo-сервис (возвращает то, что получил) и обработчик 404.',
      requirements: [
        'GET / — возвращает HTML: <h1>Добро пожаловать!</h1>',
        'GET /api/status — возвращает JSON: {"status":"ok","version":"1.0"}',
        'POST /api/echo — читает тело запроса и возвращает его обратно с заголовком X-Echo: true',
        'Любой другой путь — 404 с сообщением "Страница не найдена"',
        'Используй http.NewServeMux() и http.Server с ReadTimeout: 10s'
      ],
      expectedOutput: 'GET / -> 200 <h1>Добро пожаловать!</h1>\nGET /api/status -> 200 {"status":"ok","version":"1.0"}\nPOST /api/echo "hello" -> 200 hello (X-Echo: true)\nGET /unknown -> 404 Страница не найдена',
      hint: 'Для echo: io.ReadAll(r.Body) читает всё тело. w.Header().Set("X-Echo", "true") устанавливает заголовок. Для 404 используй http.NotFound(w, r) или http.Error(w, "...", 404).',
      solution: 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n    "io"\n    "net/http"\n    "time"\n)\n\nfunc main() {\n    mux := http.NewServeMux()\n\n    // GET /\n    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {\n        if r.URL.Path != "/" {\n            w.WriteHeader(http.StatusNotFound)\n            fmt.Fprintln(w, "Страница не найдена")\n            return\n        }\n        w.Header().Set("Content-Type", "text/html")\n        fmt.Fprintln(w, "<h1>Добро пожаловать!</h1>")\n    })\n\n    // GET /api/status\n    mux.HandleFunc("/api/status", func(w http.ResponseWriter, r *http.Request) {\n        if r.Method != http.MethodGet {\n            http.Error(w, "Только GET", http.StatusMethodNotAllowed)\n            return\n        }\n        w.Header().Set("Content-Type", "application/json")\n        json.NewEncoder(w).Encode(map[string]string{"status": "ok", "version": "1.0"})\n    })\n\n    // POST /api/echo\n    mux.HandleFunc("/api/echo", func(w http.ResponseWriter, r *http.Request) {\n        if r.Method != http.MethodPost {\n            http.Error(w, "Только POST", http.StatusMethodNotAllowed)\n            return\n        }\n        body, err := io.ReadAll(r.Body)\n        defer r.Body.Close()\n        if err != nil {\n            http.Error(w, "Ошибка чтения", http.StatusInternalServerError)\n            return\n        }\n        w.Header().Set("X-Echo", "true")\n        w.Write(body)\n    })\n\n    server := &http.Server{\n        Addr:        ":8080",\n        Handler:     mux,\n        ReadTimeout: 10 * time.Second,\n    }\n\n    fmt.Println("Сервер на :8080")\n    server.ListenAndServe()\n}',
      explanation: 'Ключевой момент: в обработчике "/" мы проверяем r.URL.Path != "/" — стандартный ServeMux матчит "/" для всех неизвестных путей. Без этой проверки все несуществующие маршруты вернут 200. Порядок установки заголовков важен: Header().Set() должен вызываться до WriteHeader() и Write() — после первой записи тела заголовки отправлены и изменить их нельзя.'
    }
  ]
}
