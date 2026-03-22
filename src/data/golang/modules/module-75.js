export default {
  id: 75,
  title: 'Обработка ошибок: best practices',
  description: 'Лучшие практики обработки ошибок в Go: оборачивание с контекстом, sentinel errors, типизированные ошибки, errors.Is/As, почему не нужен panic, логирование ошибок, обработка в HTTP хендлерах.',
  lessons: [
    {
      id: 1,
      title: 'Оборачивание ошибок с контекстом',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда ошибка передаётся вверх по стеку вызовов, она должна обогащаться контекстом. fmt.Errorf с %w — стандартный способ оборачивания ошибок в Go 1.13+.' },
        { type: 'heading', value: 'ПЛОХО: потеря контекста' },
        { type: 'code', language: 'go', value: '// ПЛОХО: ошибки передаются без контекста\nfunc GetUserByEmail(db *sql.DB, email string) (*User, error) {\n    row := db.QueryRow("SELECT id, name FROM users WHERE email=$1", email)\n    var u User\n    err := row.Scan(&u.ID, &u.Name)\n    if err != nil {\n        return nil, err // Просто "sql: no rows in result set" — непонятно где\n    }\n    return &u, nil\n}\n\nfunc RegisterUser(db *sql.DB, email, password string) error {\n    user, err := GetUserByEmail(db, email)\n    if err != nil {\n        return err // Снова без контекста\n    }\n    if user != nil {\n        return errors.New("email занят") // Нет деталей\n    }\n    return nil\n}\n// Лог: "sql: no rows in result set" — где? почему? при каком email?' },
        { type: 'heading', value: 'ХОРОШО: контекст на каждом уровне' },
        { type: 'code', language: 'go', value: 'package repository\n\nimport (\n    "database/sql"\n    "errors"\n    "fmt"\n)\n\nvar ErrNotFound = errors.New("не найдено")\n\nfunc GetUserByEmail(db *sql.DB, email string) (*User, error) {\n    row := db.QueryRow("SELECT id, name FROM users WHERE email=$1", email)\n    var u User\n    err := row.Scan(&u.ID, &u.Name)\n    if errors.Is(err, sql.ErrNoRows) {\n        // Преобразуем техническую ошибку в доменную\n        return nil, ErrNotFound\n    }\n    if err != nil {\n        // Оборачиваем с контекстом: что делали и с какими данными\n        return nil, fmt.Errorf("GetUserByEmail(%q): %w", email, err)\n    }\n    return &u, nil\n}\n\nfunc RegisterUser(db *sql.DB, email, password string) error {\n    user, err := GetUserByEmail(db, email)\n    if err != nil && !errors.Is(err, ErrNotFound) {\n        // Неожиданная ошибка — добавляем контекст\n        return fmt.Errorf("RegisterUser: проверка email %q: %w", email, err)\n    }\n    if user != nil {\n        return fmt.Errorf("RegisterUser: email %q уже занят", email)\n    }\n    return nil\n}\n// Лог: "RegisterUser: проверка email \"user@test.com\": GetUserByEmail(\"user@test.com\"): ..."\n// Теперь понятна цепочка: RegisterUser -> GetUserByEmail -> конкретная причина' },
        { type: 'tip', value: 'Правило большого пальца: оборачивай ошибку, если можешь добавить полезный контекст. Не оборачивай, если контекст уже есть или ошибка поднимается без изменений через несколько уровней.' }
      ]
    },
    {
      id: 2,
      title: 'Sentinel errors — ошибки-маяки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Sentinel errors — предопределённые переменные-ошибки, по которым можно делать сравнение. В Go 1.13+ проверяем через errors.Is(), не через ==.' },
        { type: 'heading', value: 'Определение и использование sentinel errors' },
        { type: 'code', language: 'go', value: 'package domain\n\nimport "errors"\n\n// Sentinel errors — именованные ошибки пакета\n// Называем с префиксом Err по соглашению Go\nvar (\n    ErrUserNotFound    = errors.New("пользователь не найден")\n    ErrEmailDuplicate  = errors.New("email уже используется")\n    ErrInvalidPassword = errors.New("неверный пароль")\n    ErrPermissionDenied = errors.New("доступ запрещён")\n    ErrTokenExpired    = errors.New("токен истёк")\n)\n\n// Использование с errors.Is — даже через обёртки\nfunc handleError(err error) {\n    switch {\n    case errors.Is(err, ErrUserNotFound):\n        fmt.Println("404: пользователь не найден")\n    case errors.Is(err, ErrEmailDuplicate):\n        fmt.Println("409: email занят")\n    case errors.Is(err, ErrPermissionDenied):\n        fmt.Println("403: нет доступа")\n    default:\n        fmt.Println("500: внутренняя ошибка:", err)\n    }\n}\n\n// errors.Is проверяет ВСЮ цепочку обёрток:\nfunc example() {\n    wrapped := fmt.Errorf("repository.GetUser: %w", ErrUserNotFound)\n    fmt.Println(errors.Is(wrapped, ErrUserNotFound)) // true!\n\n    doubleWrapped := fmt.Errorf("service.GetProfile: %w", wrapped)\n    fmt.Println(errors.Is(doubleWrapped, ErrUserNotFound)) // тоже true!\n}' },
        { type: 'warning', value: 'Не сравнивай ошибки через == после Go 1.13. Используй errors.Is(). Сравнение == не работает через цепочку обёрток fmt.Errorf("%w", err).' }
      ]
    },
    {
      id: 3,
      title: 'Типизированные ошибки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда ошибка должна нести дополнительные данные: HTTP-код, поле с ошибкой, ID ресурса. Для этого используют типизированные ошибки — структуры, реализующие интерфейс error.' },
        { type: 'heading', value: 'Структуры-ошибки и errors.As' },
        { type: 'code', language: 'go', value: 'package apierror\n\nimport "fmt"\n\n// ValidationError — ошибка валидации с деталями поля\ntype ValidationError struct {\n    Field   string\n    Message string\n}\n\nfunc (e *ValidationError) Error() string {\n    return fmt.Sprintf("поле %q: %s", e.Field, e.Message)\n}\n\n// NotFoundError — ошибка с типом ресурса и ID\ntype NotFoundError struct {\n    Resource string\n    ID       interface{}\n}\n\nfunc (e *NotFoundError) Error() string {\n    return fmt.Sprintf("%s с ID=%v не найден", e.Resource, e.ID)\n}\n\n// HTTPError — ошибка с HTTP кодом\ntype HTTPError struct {\n    Code    int\n    Message string\n    Cause   error\n}\n\nfunc (e *HTTPError) Error() string {\n    return fmt.Sprintf("HTTP %d: %s", e.Code, e.Message)\n}\nfunc (e *HTTPError) Unwrap() error { return e.Cause }\n\n// Использование errors.As для извлечения типа\nfunc handleTypedError(err error) {\n    var validErr *ValidationError\n    if errors.As(err, &validErr) {\n        fmt.Printf("Ошибка валидации поля %q: %s\\n", validErr.Field, validErr.Message)\n        return\n    }\n\n    var notFoundErr *NotFoundError\n    if errors.As(err, &notFoundErr) {\n        fmt.Printf("Ресурс %q с ID=%v не найден\\n", notFoundErr.Resource, notFoundErr.ID)\n        return\n    }\n\n    fmt.Println("Неизвестная ошибка:", err)\n}\n\n// Пример:\nfunc validateEmail(email string) error {\n    if email == "" {\n        return &ValidationError{Field: "email", Message: "обязательное поле"}\n    }\n    return nil\n}\n\nfunc getUser(id int) error {\n    // Пользователь не найден\n    return fmt.Errorf("getUser: %w", &NotFoundError{Resource: "User", ID: id})\n}' },
        { type: 'tip', value: 'errors.As(err, &target) проверяет цепочку обёрток и помещает первую найденную ошибку нужного типа в target. Если Unwrap() реализован, ищет рекурсивно.' }
      ]
    },
    {
      id: 4,
      title: 'errors.Is и errors.As — правильное использование',
      type: 'theory',
      content: [
        { type: 'text', value: 'errors.Is и errors.As — основные инструменты работы с ошибками в Go 1.13+. Важно понимать разницу: Is проверяет равенство, As извлекает тип.' },
        { type: 'heading', value: 'errors.Is vs errors.As' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "database/sql"\n    "errors"\n    "fmt"\n)\n\ntype DBError struct {\n    Query string\n    Cause error\n}\n\nfunc (e *DBError) Error() string { return fmt.Sprintf("DB[%s]: %v", e.Query, e.Cause) }\nfunc (e *DBError) Unwrap() error { return e.Cause }\n\nfunc queryDB(query string) error {\n    // Симулируем: запись не найдена\n    return &DBError{\n        Query: query,\n        Cause: fmt.Errorf("queryDB: %w", sql.ErrNoRows),\n    }\n}\n\nfunc main() {\n    err := queryDB("SELECT * FROM users WHERE id=999")\n\n    // errors.Is: проверяет равенство через всю цепочку Unwrap\n    fmt.Println("Is sql.ErrNoRows:", errors.Is(err, sql.ErrNoRows)) // true!\n\n    // errors.As: извлекает первый экземпляр нужного типа\n    var dbErr *DBError\n    if errors.As(err, &dbErr) {\n        fmt.Println("Запрос:", dbErr.Query)\n        // "SELECT * FROM users WHERE id=999"\n    }\n\n    // Типичный паттерн: Is для sentinel, As для типов с данными\n    switch {\n    case errors.Is(err, sql.ErrNoRows):\n        fmt.Println("Запись не найдена")\n    default:\n        var dbE *DBError\n        if errors.As(err, &dbE) {\n            fmt.Printf("Ошибка БД в запросе: %s\\n", dbE.Query)\n        } else {\n            fmt.Println("Неизвестная ошибка:", err)\n        }\n    }\n}' },
        { type: 'note', value: 'Ваш кастомный тип ошибки должен реализовать Unwrap() error, чтобы errors.Is/As искали в цепочке. Без Unwrap() поиск остановится на вашем типе.' }
      ]
    },
    {
      id: 5,
      title: 'Почему не нужен panic',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Go panic используется только для действительно неожиданных ситуаций (программных ошибок), не для бизнес-ошибок. Возвращайте error, не паникуйте.' },
        { type: 'heading', value: 'ПЛОХО: использование panic для бизнес-ошибок' },
        { type: 'code', language: 'go', value: '// ПЛОХО: panic для бизнес-ошибок\nfunc GetUser(id int) *User {\n    if id <= 0 {\n        panic("невалидный ID") // ПЛОХО: вызывающий код должен знать об этом\n    }\n    user, err := db.Query("SELECT * FROM users WHERE id=$1", id)\n    if err != nil {\n        panic(err) // ПЛОХО: убивает всё приложение при ошибке БД\n    }\n    return user\n}\n\n// Вызывающий код вынужден recover:\nfunc handler(w http.ResponseWriter, r *http.Request) {\n    defer func() {\n        if r := recover(); r != nil {\n            http.Error(w, "внутренняя ошибка", 500)\n        }\n    }()\n    user := GetUser(0) // паника!\n    json.NewEncoder(w).Encode(user)\n}' },
        { type: 'heading', value: 'ХОРОШО: возвращать ошибки' },
        { type: 'code', language: 'go', value: '// ХОРОШО: ошибки возвращаются, не бросаются\nfunc GetUser(ctx context.Context, id int) (*User, error) {\n    if id <= 0 {\n        return nil, fmt.Errorf("GetUser: невалидный ID: %d", id)\n    }\n    // ...\n    return user, nil\n}\n\nfunc handler(w http.ResponseWriter, r *http.Request) {\n    user, err := GetUser(r.Context(), 0)\n    if err != nil {\n        // Обрабатываем явно, без recover\n        http.Error(w, err.Error(), http.StatusBadRequest)\n        return\n    }\n    json.NewEncoder(w).Encode(user)\n}\n\n// Когда panic УМЕСТЕН:\n// 1. Программная ошибка в init() — приложение не может работать:\nfunc init() {\n    tmpl, err := template.ParseFiles("templates/*.html")\n    if err != nil {\n        panic("критично: шаблоны не найдены: " + err.Error())\n    }\n    _ = tmpl\n}\n\n// 2. Нарушение инварианта — никогда не должно происходить:\nfunc mustPositive(n int) int {\n    if n <= 0 {\n        panic(fmt.Sprintf("программная ошибка: ожидали положительное число, получили %d", n))\n    }\n    return n\n}' },
        { type: 'warning', value: 'Единственные допустимые случаи panic в production коде: инициализация (init, main) где провал означает, что приложение не может запуститься. В request handling — никогда.' }
      ]
    },
    {
      id: 6,
      title: 'Логирование ошибок — правильный уровень',
      type: 'theory',
      content: [
        { type: 'text', value: 'Главное правило логирования ошибок: логируй ошибку один раз — там, где ты её обрабатываешь (не передаёшь дальше). Если логируешь и возвращаешь — получишь дублированные записи.' },
        { type: 'heading', value: 'ПЛОХО: логирование на каждом уровне' },
        { type: 'code', language: 'go', value: '// ПЛОХО: ошибка логируется на каждом уровне\nfunc getUser(id int) (*User, error) {\n    user, err := db.QueryUser(id)\n    if err != nil {\n        log.Printf("getUser: %v", err) // лог #1\n        return nil, err\n    }\n    return user, nil\n}\n\nfunc getUserProfile(id int) (*Profile, error) {\n    user, err := getUser(id)\n    if err != nil {\n        log.Printf("getUserProfile: %v", err) // лог #2 — ДУБЛИРУЕТСЯ!\n        return nil, err\n    }\n    // ...\n    return profile, nil\n}\n\nfunc handleGetProfile(w http.ResponseWriter, r *http.Request) {\n    profile, err := getUserProfile(1)\n    if err != nil {\n        log.Printf("handleGetProfile: %v", err) // лог #3 — ТРОЙНОЕ дублирование!\n        http.Error(w, "ошибка", 500)\n    }\n}' },
        { type: 'heading', value: 'ХОРОШО: логируем только в точке обработки' },
        { type: 'code', language: 'go', value: '// ХОРОШО: ошибка передаётся вверх с контекстом, логируется один раз\nfunc getUser(ctx context.Context, id int) (*User, error) {\n    user, err := db.QueryUser(ctx, id)\n    if err != nil {\n        // НЕ логируем, просто добавляем контекст\n        return nil, fmt.Errorf("getUser(%d): %w", id, err)\n    }\n    return user, nil\n}\n\nfunc getUserProfile(ctx context.Context, id int) (*Profile, error) {\n    user, err := getUser(ctx, id)\n    if err != nil {\n        // НЕ логируем, добавляем контекст\n        return nil, fmt.Errorf("getUserProfile: %w", err)\n    }\n    // ...\n    return &Profile{User: user}, nil\n}\n\nfunc handleGetProfile(w http.ResponseWriter, r *http.Request) {\n    profile, err := getUserProfile(r.Context(), 1)\n    if err != nil {\n        // Логируем ОДИН РАЗ — здесь, где обрабатываем\n        slog.Error("ошибка при получении профиля",\n            "error", err,\n            "user_id", 1,\n            "path", r.URL.Path,\n        )\n        http.Error(w, "внутренняя ошибка", http.StatusInternalServerError)\n        return\n    }\n    json.NewEncoder(w).Encode(profile)\n}' },
        { type: 'tip', value: 'Передавай ошибки наверх с контекстом (fmt.Errorf("%w", err)), логируй только в верхнем обработчике. Уровни INFO/WARN/ERROR: INFO — нормальные события, WARN — неожиданное но не критичное, ERROR — требует внимания.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: обработка ошибок в HTTP хендлере',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй корректную обработку ошибок в HTTP API. Доменные ошибки должны маппиться в правильные HTTP коды, ошибки должны оборачиваться с контекстом, логироваться один раз.',
      requirements: [
        'Sentinel ошибки: ErrNotFound, ErrAlreadyExists, ErrInvalidInput',
        'Типизированная ошибка ValidationError{Field, Message} с методом Error()',
        'Функция userService.GetUser(ctx, id) возвращает (User, error) — при id<0 ValidationError, при id=999 ErrNotFound',
        'Функция respondError(w, logger, err) маппит ошибки в HTTP коды: ErrNotFound->404, ErrAlreadyExists->409, ValidationError->400, остальное->500',
        'HTTP хендлер GET /users/{id} использует respondError',
        'Ошибки оборачивать с контекстом (fmt.Errorf с %w)'
      ],
      expectedOutput: 'GET /users/1 -> 200 {id:1, name:"Алия"}\nGET /users/-5 -> 400 {"error":"поле id: ID должен быть положительным"}\nGET /users/999 -> 404 {"error":"пользователь не найден"}\nGET /users/abc -> 400 {"error":"некорректный ID"}',
      hint: 'В respondError используй errors.Is для sentinel и errors.As для ValidationError. Логируй только ошибки уровня 500 — остальные предсказуемые бизнес-ошибки.',
      solution: 'package main\n\nimport (\n    "context"\n    "encoding/json"\n    "errors"\n    "fmt"\n    "log/slog"\n    "net/http"\n    "net/http/httptest"\n    "os"\n    "strconv"\n    "strings"\n)\n\n// === Errors ===\n\nvar (\n    ErrNotFound      = errors.New("не найдено")\n    ErrAlreadyExists = errors.New("уже существует")\n    ErrInvalidInput  = errors.New("некорректные данные")\n)\n\ntype ValidationError struct {\n    Field   string\n    Message string\n}\n\nfunc (e *ValidationError) Error() string {\n    return fmt.Sprintf("поле %s: %s", e.Field, e.Message)\n}\n\n// === Domain ===\n\ntype User struct {\n    ID   int    `json:"id"`\n    Name string `json:"name"`\n}\n\nvar users = map[int]User{\n    1: {1, "Алия"},\n    2: {2, "Бауыржан"},\n}\n\nfunc getUser(ctx context.Context, id int) (*User, error) {\n    if id < 0 {\n        return nil, fmt.Errorf("getUser: %w",\n            &ValidationError{Field: "id", Message: "ID должен быть положительным"})\n    }\n    u, ok := users[id]\n    if !ok {\n        return nil, fmt.Errorf("getUser(%d): %w", id, ErrNotFound)\n    }\n    return &u, nil\n}\n\n// === Error handling ===\n\ntype errorResponse struct {\n    Error string `json:"error"`\n}\n\nfunc respondError(w http.ResponseWriter, logger *slog.Logger, err error) {\n    var status int\n    var message string\n\n    var valErr *ValidationError\n    switch {\n    case errors.As(err, &valErr):\n        status = http.StatusBadRequest\n        message = valErr.Error()\n    case errors.Is(err, ErrNotFound):\n        status = http.StatusNotFound\n        message = "пользователь не найден"\n    case errors.Is(err, ErrAlreadyExists):\n        status = http.StatusConflict\n        message = "ресурс уже существует"\n    case errors.Is(err, ErrInvalidInput):\n        status = http.StatusBadRequest\n        message = err.Error()\n    default:\n        status = http.StatusInternalServerError\n        message = "внутренняя ошибка сервера"\n        // Логируем только неожиданные ошибки\n        logger.Error("необработанная ошибка", "error", err)\n    }\n\n    w.Header().Set("Content-Type", "application/json")\n    w.WriteHeader(status)\n    json.NewEncoder(w).Encode(errorResponse{Error: message})\n}\n\n// === Handler ===\n\ntype UserHandler struct {\n    logger *slog.Logger\n}\n\nfunc (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {\n    // Извлечь ID из URL: GET /users/{id}\n    parts := strings.Split(r.URL.Path, "/")\n    idStr := parts[len(parts)-1]\n\n    id, err := strconv.Atoi(idStr)\n    if err != nil {\n        w.Header().Set("Content-Type", "application/json")\n        w.WriteHeader(http.StatusBadRequest)\n        json.NewEncoder(w).Encode(errorResponse{Error: "некорректный ID"})\n        return\n    }\n\n    user, err := getUser(r.Context(), id)\n    if err != nil {\n        respondError(w, h.logger, err)\n        return\n    }\n\n    w.Header().Set("Content-Type", "application/json")\n    json.NewEncoder(w).Encode(user)\n}\n\nfunc main() {\n    logger := slog.New(slog.NewTextHandler(os.Stdout, nil))\n    h := &UserHandler{logger: logger}\n\n    tests := []struct{ path string }{\n        {"/users/1"},\n        {"/users/-5"},\n        {"/users/999"},\n        {"/users/abc"},\n    }\n\n    for _, tc := range tests {\n        req := httptest.NewRequest("GET", tc.path, nil)\n        w := httptest.NewRecorder()\n        h.GetUser(w, req)\n        fmt.Printf("GET %s -> %d %s", tc.path, w.Code, strings.TrimSpace(w.Body.String()))\n        fmt.Println()\n    }\n}',
      explanation: 'respondError централизует маппинг ошибок в HTTP коды. errors.As(err, &valErr) ищет ValidationError в цепочке обёрток. errors.Is(err, ErrNotFound) ищет sentinel через всю цепочку %w. Ошибки оборачиваются в getUser через fmt.Errorf("%w") — контекст сохраняется, но проверка Is/As всё равно работает. Логируем только неожиданные 500-е ошибки.'
    }
  ]
}
