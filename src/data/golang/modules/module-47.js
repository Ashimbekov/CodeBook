export default {
  id: 47,
  title: 'HTTP клиент',
  description: 'Выполнение HTTP запросов из Go: http.Get, http.Post, настройка клиента, заголовки, таймауты, чтение тела ответа, обработка ошибок и лучшие практики.',
  lessons: [
    {
      id: 1,
      title: 'http.Get — простой GET запрос',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пакет net/http предоставляет удобные функции для выполнения HTTP запросов. Начнём с самого простого — http.Get().' },
        { type: 'heading', value: 'Базовый GET запрос' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "io"\n    "net/http"\n)\n\nfunc main() {\n    // http.Get выполняет GET запрос\n    resp, err := http.Get("https://api.github.com/users/golang")\n    if err != nil {\n        fmt.Println("Ошибка запроса:", err)\n        return\n    }\n    defer resp.Body.Close() // ВСЕГДА закрывай тело ответа!\n\n    // Проверяем статус ответа\n    fmt.Println("Статус:", resp.Status)       // "200 OK"\n    fmt.Println("Код:", resp.StatusCode)       // 200\n    fmt.Println("Тип:", resp.Header.Get("Content-Type"))\n\n    // Читаем тело ответа\n    body, err := io.ReadAll(resp.Body)\n    if err != nil {\n        fmt.Println("Ошибка чтения:", err)\n        return\n    }\n\n    fmt.Printf("Тело (%d байт):\\n%s\\n", len(body), string(body[:200]))\n}' },
        { type: 'warning', value: 'Всегда вызывай defer resp.Body.Close()! Незакрытое тело ответа приводит к утечке соединений. Даже если тело не читаешь — закрой его.' },
        { type: 'heading', value: 'Правильная обработка статуса' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "io"\n    "net/http"\n)\n\nfunc fetchURL(url string) ([]byte, error) {\n    resp, err := http.Get(url)\n    if err != nil {\n        return nil, fmt.Errorf("запрос не выполнен: %w", err)\n    }\n    defer resp.Body.Close()\n\n    // http.Get не считает 4xx и 5xx ошибками!\n    // Нужно проверять StatusCode вручную\n    if resp.StatusCode != http.StatusOK {\n        return nil, fmt.Errorf("сервер вернул: %d %s", resp.StatusCode, resp.Status)\n    }\n\n    return io.ReadAll(resp.Body)\n}\n\nfunc main() {\n    data, err := fetchURL("https://jsonplaceholder.typicode.com/posts/1")\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    fmt.Println(string(data))\n}' }
      ]
    },
    {
      id: 2,
      title: 'http.Post — POST запрос с телом',
      type: 'theory',
      content: [
        { type: 'text', value: 'http.Post() отправляет POST запрос с указанным типом содержимого и телом. Для более сложных запросов используй http.NewRequest.' },
        { type: 'heading', value: 'POST с JSON' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "bytes"\n    "encoding/json"\n    "fmt"\n    "io"\n    "net/http"\n)\n\ntype Post struct {\n    Title  string `json:"title"`\n    Body   string `json:"body"`\n    UserID int    `json:"userId"`\n}\n\nfunc createPost(post Post) (*Post, error) {\n    // Сериализуем в JSON\n    data, err := json.Marshal(post)\n    if err != nil {\n        return nil, err\n    }\n\n    // http.Post(url, contentType, body)\n    resp, err := http.Post(\n        "https://jsonplaceholder.typicode.com/posts",\n        "application/json",\n        bytes.NewBuffer(data),\n    )\n    if err != nil {\n        return nil, err\n    }\n    defer resp.Body.Close()\n\n    if resp.StatusCode != http.StatusCreated {\n        body, _ := io.ReadAll(resp.Body)\n        return nil, fmt.Errorf("ошибка: %d, тело: %s", resp.StatusCode, body)\n    }\n\n    var result Post\n    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {\n        return nil, err\n    }\n    return &result, nil\n}\n\nfunc main() {\n    post, err := createPost(Post{\n        Title:  "Тест",\n        Body:   "Содержимое",\n        UserID: 1,\n    })\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    fmt.Printf("Создан пост с ID: %d\\n", post.UserID)\n}' },
        { type: 'tip', value: 'bytes.NewBuffer(data) создаёт io.Reader из байтов. Это то, что ожидает http.Post в качестве тела. Альтернатива — strings.NewReader(jsonString) для строкового JSON.' }
      ]
    },
    {
      id: 3,
      title: 'Кастомный клиент с таймаутом',
      type: 'theory',
      content: [
        { type: 'text', value: 'http.DefaultClient не имеет таймаута — запрос может висеть вечно. В продакшне всегда используй кастомный клиент с настройками.' },
        { type: 'heading', value: 'Создание клиента с таймаутом' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "io"\n    "net/http"\n    "time"\n)\n\n// Создаём клиент один раз на всё приложение\nvar httpClient = &http.Client{\n    Timeout: 30 * time.Second, // общий таймаут запроса\n    Transport: &http.Transport{\n        MaxIdleConns:        100,              // макс. idle соединений\n        MaxIdleConnsPerHost: 10,               // макс. idle на хост\n        IdleConnTimeout:     90 * time.Second, // таймаут idle соединения\n        DisableKeepAlives:   false,            // keep-alive включён\n    },\n}\n\nfunc fetch(url string) ([]byte, error) {\n    resp, err := httpClient.Get(url)\n    if err != nil {\n        return nil, fmt.Errorf("GET %s: %w", url, err)\n    }\n    defer resp.Body.Close()\n\n    if resp.StatusCode >= 400 {\n        return nil, fmt.Errorf("HTTP %d для %s", resp.StatusCode, url)\n    }\n\n    return io.ReadAll(resp.Body)\n}\n\nfunc main() {\n    data, err := fetch("https://httpbin.org/get")\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    fmt.Printf("Получено %d байт\\n", len(data))\n}' },
        { type: 'warning', value: 'Не создавай новый http.Client для каждого запроса! Клиент управляет пулом TCP соединений — создание нового клиента каждый раз убивает переиспользование и производительность.' }
      ]
    },
    {
      id: 4,
      title: 'http.NewRequest — полный контроль',
      type: 'theory',
      content: [
        { type: 'text', value: 'http.NewRequest позволяет создать запрос с любыми заголовками, методом и телом. Это основной инструмент для сложных HTTP взаимодействий.' },
        { type: 'heading', value: 'Запрос с заголовками авторизации' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "bytes"\n    "context"\n    "encoding/json"\n    "fmt"\n    "io"\n    "net/http"\n    "time"\n)\n\ntype APIClient struct {\n    baseURL string\n    token   string\n    client  *http.Client\n}\n\nfunc NewAPIClient(baseURL, token string) *APIClient {\n    return &APIClient{\n        baseURL: baseURL,\n        token:   token,\n        client: &http.Client{Timeout: 15 * time.Second},\n    }\n}\n\nfunc (c *APIClient) do(ctx context.Context, method, path string, body interface{}) (*http.Response, error) {\n    var bodyReader io.Reader\n    if body != nil {\n        data, err := json.Marshal(body)\n        if err != nil {\n            return nil, err\n        }\n        bodyReader = bytes.NewBuffer(data)\n    }\n\n    req, err := http.NewRequestWithContext(ctx, method, c.baseURL+path, bodyReader)\n    if err != nil {\n        return nil, err\n    }\n\n    // Устанавливаем заголовки\n    req.Header.Set("Content-Type", "application/json")\n    req.Header.Set("Accept", "application/json")\n    req.Header.Set("Authorization", "Bearer "+c.token)\n    req.Header.Set("User-Agent", "MyApp/1.0")\n\n    return c.client.Do(req)\n}\n\nfunc (c *APIClient) GetUser(ctx context.Context, id int) (map[string]interface{}, error) {\n    resp, err := c.do(ctx, http.MethodGet, fmt.Sprintf("/users/%d", id), nil)\n    if err != nil {\n        return nil, err\n    }\n    defer resp.Body.Close()\n\n    var result map[string]interface{}\n    json.NewDecoder(resp.Body).Decode(&result)\n    return result, nil\n}\n\nfunc main() {\n    client := NewAPIClient("https://jsonplaceholder.typicode.com", "my-token")\n    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)\n    defer cancel()\n\n    user, err := client.GetUser(ctx, 1)\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    fmt.Println("Пользователь:", user["name"])\n}' }
      ]
    },
    {
      id: 5,
      title: 'Декодирование JSON ответа',
      type: 'theory',
      content: [
        { type: 'text', value: 'Большинство современных API возвращают JSON. Go предоставляет удобный способ декодировать JSON прямо из тела ответа без промежуточного буфера.' },
        { type: 'heading', value: 'Декодирование в структуру' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "encoding/json"\n    "fmt"\n    "net/http"\n    "time"\n)\n\ntype GitHubUser struct {\n    Login     string `json:"login"`\n    Name      string `json:"name"`\n    PublicRepos int  `json:"public_repos"`\n    Followers int    `json:"followers"`\n    CreatedAt string `json:"created_at"`\n}\n\ntype GitHubError struct {\n    Message string `json:"message"`\n}\n\nvar client = &http.Client{Timeout: 10 * time.Second}\n\nfunc getGitHubUser(username string) (*GitHubUser, error) {\n    resp, err := client.Get("https://api.github.com/users/" + username)\n    if err != nil {\n        return nil, err\n    }\n    defer resp.Body.Close()\n\n    if resp.StatusCode == http.StatusNotFound {\n        var apiErr GitHubError\n        json.NewDecoder(resp.Body).Decode(&apiErr)\n        return nil, fmt.Errorf("пользователь не найден: %s", apiErr.Message)\n    }\n\n    if resp.StatusCode != http.StatusOK {\n        return nil, fmt.Errorf("API ошибка: %d", resp.StatusCode)\n    }\n\n    var user GitHubUser\n    if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {\n        return nil, fmt.Errorf("ошибка декодирования: %w", err)\n    }\n    return &user, nil\n}\n\nfunc main() {\n    user, err := getGitHubUser("golang")\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    fmt.Printf("Логин: %s\\nИмя: %s\\nРепозиториев: %d\\nПодписчиков: %d\\n",\n        user.Login, user.Name, user.PublicRepos, user.Followers)\n}' },
        { type: 'tip', value: 'json.NewDecoder(resp.Body).Decode(&v) эффективнее, чем io.ReadAll + json.Unmarshal. Декодер читает стримом без загрузки всего тела в память.' }
      ]
    },
    {
      id: 6,
      title: 'Обработка ошибок и повторные попытки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Надёжный HTTP клиент должен корректно обрабатывать сетевые ошибки и реализовывать retry с экспоненциальной задержкой.' },
        { type: 'heading', value: 'Клиент с retry логикой' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "fmt"\n    "io"\n    "math"\n    "net/http"\n    "time"\n)\n\nfunc fetchWithRetry(url string, maxRetries int) ([]byte, error) {\n    var lastErr error\n\n    for attempt := 0; attempt < maxRetries; attempt++ {\n        if attempt > 0 {\n            // Экспоненциальная задержка: 1с, 2с, 4с...\n            delay := time.Duration(math.Pow(2, float64(attempt))) * time.Second\n            fmt.Printf("Попытка %d после %v...\\n", attempt+1, delay)\n            time.Sleep(delay)\n        }\n\n        resp, err := http.Get(url)\n        if err != nil {\n            lastErr = err\n            continue // сетевая ошибка — повторяем\n        }\n        defer resp.Body.Close()\n\n        // 5xx — ошибка сервера — повторяем\n        if resp.StatusCode >= 500 {\n            lastErr = fmt.Errorf("сервер вернул %d", resp.StatusCode)\n            continue\n        }\n\n        // 4xx — ошибка клиента — не повторяем\n        if resp.StatusCode >= 400 {\n            return nil, fmt.Errorf("ошибка клиента: %d", resp.StatusCode)\n        }\n\n        return io.ReadAll(resp.Body)\n    }\n\n    return nil, fmt.Errorf("все попытки исчерпаны, последняя ошибка: %w", lastErr)\n}\n\nfunc main() {\n    data, err := fetchWithRetry("https://httpbin.org/get", 3)\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    fmt.Printf("Успешно получено %d байт\\n", len(data))\n}' }
      ]
    },
    {
      id: 7,
      title: 'Практика: HTTP клиент для REST API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай HTTP клиент для JSONPlaceholder API (https://jsonplaceholder.typicode.com). Реализуй получение списка постов, создание нового поста и получение конкретного поста.',
      requirements: [
        'Создай структуры Post {ID, Title, Body, UserID}',
        'Функция GetPosts(ctx) ([]Post, error) — GET /posts',
        'Функция GetPost(ctx, id int) (*Post, error) — GET /posts/{id}',
        'Функция CreatePost(ctx, post Post) (*Post, error) — POST /posts с JSON',
        'Общий HTTP клиент с таймаутом 10 секунд',
        'Проверяй статус ответа — возвращай ошибку при != 200/201'
      ],
      expectedOutput: 'Постов получено: 100\nПост #1: sunt aut facere repellat provident occaecati excepturi\nСоздан пост с ID: 101',
      hint: 'Для GetPosts используй json.NewDecoder(resp.Body).Decode(&posts). Для CreatePost: json.Marshal(post) -> bytes.NewBuffer -> http.Post. Проверяй resp.StatusCode после каждого запроса.',
      solution: 'package main\n\nimport (\n    "bytes"\n    "context"\n    "encoding/json"\n    "fmt"\n    "net/http"\n    "time"\n)\n\ntype Post struct {\n    ID     int    `json:"id,omitempty"`\n    Title  string `json:"title"`\n    Body   string `json:"body"`\n    UserID int    `json:"userId"`\n}\n\nvar client = &http.Client{Timeout: 10 * time.Second}\n\nconst baseURL = "https://jsonplaceholder.typicode.com"\n\nfunc GetPosts(ctx context.Context) ([]Post, error) {\n    req, _ := http.NewRequestWithContext(ctx, http.MethodGet, baseURL+"/posts", nil)\n    resp, err := client.Do(req)\n    if err != nil {\n        return nil, err\n    }\n    defer resp.Body.Close()\n    if resp.StatusCode != http.StatusOK {\n        return nil, fmt.Errorf("HTTP %d", resp.StatusCode)\n    }\n    var posts []Post\n    return posts, json.NewDecoder(resp.Body).Decode(&posts)\n}\n\nfunc GetPost(ctx context.Context, id int) (*Post, error) {\n    req, _ := http.NewRequestWithContext(ctx, http.MethodGet,\n        fmt.Sprintf("%s/posts/%d", baseURL, id), nil)\n    resp, err := client.Do(req)\n    if err != nil {\n        return nil, err\n    }\n    defer resp.Body.Close()\n    if resp.StatusCode != http.StatusOK {\n        return nil, fmt.Errorf("HTTP %d", resp.StatusCode)\n    }\n    var post Post\n    return &post, json.NewDecoder(resp.Body).Decode(&post)\n}\n\nfunc CreatePost(ctx context.Context, post Post) (*Post, error) {\n    data, err := json.Marshal(post)\n    if err != nil {\n        return nil, err\n    }\n    req, _ := http.NewRequestWithContext(ctx, http.MethodPost, baseURL+"/posts",\n        bytes.NewBuffer(data))\n    req.Header.Set("Content-Type", "application/json")\n    resp, err := client.Do(req)\n    if err != nil {\n        return nil, err\n    }\n    defer resp.Body.Close()\n    if resp.StatusCode != http.StatusCreated {\n        return nil, fmt.Errorf("HTTP %d", resp.StatusCode)\n    }\n    var result Post\n    return &result, json.NewDecoder(resp.Body).Decode(&result)\n}\n\nfunc main() {\n    ctx := context.Background()\n\n    posts, err := GetPosts(ctx)\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    fmt.Printf("Постов получено: %d\\n", len(posts))\n\n    post, err := GetPost(ctx, 1)\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    fmt.Printf("Пост #1: %s\\n", post.Title)\n\n    newPost, err := CreatePost(ctx, Post{Title: "Новый пост", Body: "Содержимое", UserID: 1})\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n        return\n    }\n    fmt.Printf("Создан пост с ID: %d\\n", newPost.ID)\n}',
      explanation: 'http.NewRequestWithContext позволяет передать контекст с таймаутом — если контекст отменится, запрос прервётся. Один клиент используется для всех запросов — переиспользование TCP соединений через keep-alive. json.NewDecoder(resp.Body).Decode() стримит декодирование без загрузки всего тела в память. Каждый метод проверяет статус и возвращает типизированную ошибку.'
    }
  ]
}
