export default {
  id: 23,
  title: 'Пользовательские ошибки',
  description: 'Собственные типы ошибок позволяют передавать структурированную информацию о проблемах: поля, коды, контекст. Это мощнее чем простые строки — как разница между "произошла ошибка" и подробным отчётом.',
  lessons: [
    {
      id: 1,
      title: 'Создание собственных типов ошибок',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Любой тип, реализующий интерфейс error (то есть имеющий метод Error() string), может быть использован как ошибка. Это открывает возможность создавать ошибки с дополнительными данными.'
        },
        {
          type: 'text',
          value: 'Представьте: обычная ошибка — это записка "что-то сломалось". Пользовательская ошибка — официальный отчёт с полями: что сломалось, где, когда, код ошибки, кто виноват.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Простейший пользовательский тип ошибки\ntype AppError struct {\n    Code    int\n    Message string\n}\n\nfunc (e *AppError) Error() string {\n    return fmt.Sprintf("[%d] %s", e.Code, e.Message)\n}\n\nfunc getUser(id int) (string, error) {\n    if id <= 0 {\n        return "", &AppError{\n            Code:    400,\n            Message: fmt.Sprintf("неверный ID: %d", id),\n        }\n    }\n    if id > 100 {\n        return "", &AppError{\n            Code:    404,\n            Message: fmt.Sprintf("пользователь %d не найден", id),\n        }\n    }\n    return "Пользователь", nil\n}\n\nfunc main() {\n    _, err := getUser(-1)\n    if err != nil {\n        fmt.Println(err) // [400] неверный ID: -1\n        \n        // Приведение типа для получения дополнительных данных\n        if appErr, ok := err.(*AppError); ok {\n            fmt.Printf("HTTP код: %d\\n", appErr.Code)\n            fmt.Printf("Сообщение: %s\\n", appErr.Message)\n        }\n    }\n    \n    _, err = getUser(999)\n    if appErr, ok := err.(*AppError); ok {\n        switch appErr.Code {\n        case 400:\n            fmt.Println("Плохой запрос")\n        case 404:\n            fmt.Println("Не найден:", appErr.Message) // Не найден: пользователь 999 не найден\n        }\n    }\n}'
        },
        {
          type: 'note',
          value: 'Принято делать методы Error() на указателе (*MyError), не на значении (MyError). Тогда при возврате ошибки используйте &MyError{...}. Это позволяет методам Error() изменять состояние если нужно (хотя обычно не нужно).'
        }
      ]
    },
    {
      id: 2,
      title: 'Ошибки с контекстом',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Пользовательские ошибки позволяют хранить богатый контекст: какая операция выполнялась, с какими параметрами, в какое время, на каком сервере. Это бесценно при отладке в продакшн.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\ntype OperationError struct {\n    Op        string    // имя операции\n    Resource  string    // ресурс (файл, URL, ключ БД)\n    Err       error     // оригинальная ошибка\n    Timestamp time.Time // когда произошло\n}\n\nfunc (e *OperationError) Error() string {\n    return fmt.Sprintf("операция %s на %s: %v (в %s)",\n        e.Op, e.Resource, e.Err, e.Timestamp.Format("15:04:05"))\n}\n\nfunc (e *OperationError) Unwrap() error {\n    return e.Err // поддерживаем errors.Is/As\n}\n\nfunc newOpError(op, resource string, err error) *OperationError {\n    return &OperationError{\n        Op:        op,\n        Resource:  resource,\n        Err:       err,\n        Timestamp: time.Now(),\n    }\n}\n\nfunc readConfig(path string) error {\n    // Симулируем ошибку\n    return fmt.Errorf("файл не существует")\n}\n\nfunc initApp(configPath string) error {\n    err := readConfig(configPath)\n    if err != nil {\n        return newOpError("readConfig", configPath, err)\n    }\n    return nil\n}\n\nfunc main() {\n    err := initApp("/etc/app/config.yaml")\n    if err != nil {\n        fmt.Println(err)\n        // операция readConfig на /etc/app/config.yaml: файл не существует (в 14:25:30)\n        \n        if opErr, ok := err.(*OperationError); ok {\n            fmt.Printf("Операция: %s\\n", opErr.Op)\n            fmt.Printf("Ресурс:   %s\\n", opErr.Resource)\n            fmt.Printf("Время:    %s\\n", opErr.Timestamp.Format("2006-01-02 15:04:05"))\n            fmt.Printf("Причина:  %v\\n", opErr.Err)\n        }\n    }\n}'
        },
        {
          type: 'tip',
          value: 'Метод Unwrap() в пользовательской ошибке позволяет errors.Is и errors.As "заглядывать" внутрь. Всегда реализуйте Unwrap() если ваша ошибка оборачивает другую.'
        }
      ]
    },
    {
      id: 3,
      title: 'Ошибки с несколькими полями',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Для сложных систем иногда нужны ошибки с множеством структурированных полей. Например, HTTP-ошибка с кодом, сообщением, деталями и ID запроса для трейсинга.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "errors"\n    "fmt"\n    "strings"\n)\n\n// HTTPError — ошибка с HTTP-семантикой\ntype HTTPError struct {\n    StatusCode int\n    Status     string\n    Message    string\n    RequestID  string\n    Details    map[string]string\n}\n\nfunc (e *HTTPError) Error() string {\n    var sb strings.Builder\n    sb.WriteString(fmt.Sprintf("HTTP %d %s: %s", e.StatusCode, e.Status, e.Message))\n    if e.RequestID != "" {\n        sb.WriteString(fmt.Sprintf(" (reqID: %s)", e.RequestID))\n    }\n    return sb.String()\n}\n\nfunc (e *HTTPError) IsClientError() bool {\n    return e.StatusCode >= 400 && e.StatusCode < 500\n}\n\nfunc (e *HTTPError) IsServerError() bool {\n    return e.StatusCode >= 500\n}\n\n// Конструкторы для удобства\nfunc ErrBadRequest(msg, reqID string) *HTTPError {\n    return &HTTPError{\n        StatusCode: 400,\n        Status:     "Bad Request",\n        Message:    msg,\n        RequestID:  reqID,\n    }\n}\n\nfunc ErrNotFound(resource, reqID string) *HTTPError {\n    return &HTTPError{\n        StatusCode: 404,\n        Status:     "Not Found",\n        Message:    fmt.Sprintf("%s не найден", resource),\n        RequestID:  reqID,\n    }\n}\n\nfunc ErrInternalServer(msg, reqID string, details map[string]string) *HTTPError {\n    return &HTTPError{\n        StatusCode: 500,\n        Status:     "Internal Server Error",\n        Message:    msg,\n        RequestID:  reqID,\n        Details:    details,\n    }\n}\n\nfunc handleAPIRequest(path, reqID string) error {\n    if path == "" {\n        return ErrBadRequest("путь не может быть пустым", reqID)\n    }\n    if path == "/unknown" {\n        return ErrNotFound(path, reqID)\n    }\n    if path == "/crash" {\n        return ErrInternalServer("внутренняя ошибка", reqID,\n            map[string]string{"goroutine": "42", "file": "handler.go:55"})\n    }\n    return nil\n}\n\nfunc main() {\n    paths := []string{"", "/unknown", "/crash", "/ok"}\n    \n    for _, path := range paths {\n        err := handleAPIRequest(path, "req-abc-123")\n        if err != nil {\n            fmt.Println("Ошибка:", err)\n            \n            var httpErr *HTTPError\n            if errors.As(err, &httpErr) {\n                if httpErr.IsClientError() {\n                    fmt.Println("  -> Ошибка клиента")\n                } else if httpErr.IsServerError() {\n                    fmt.Println("  -> Ошибка сервера")\n                    for k, v := range httpErr.Details {\n                        fmt.Printf("     %s: %s\\n", k, v)\n                    }\n                }\n            }\n        } else {\n            fmt.Printf("Запрос %q — OK\\n", path)\n        }\n    }\n}'
        }
      ]
    },
    {
      id: 4,
      title: 'Иерархия ошибок',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Можно строить иерархии ошибок, используя встраивание типов. Как семейное дерево: есть общий предок (BaseError), от которого наследуют специфичные ошибки.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\n// Базовая ошибка приложения\ntype BaseError struct {\n    Code    string\n    Message string\n}\n\nfunc (e *BaseError) Error() string {\n    return fmt.Sprintf("[%s] %s", e.Code, e.Message)\n}\n\n// Ошибка базы данных\ntype DBError struct {\n    BaseError\n    Query string\n    Table string\n}\n\nfunc (e *DBError) Error() string {\n    return fmt.Sprintf("[DB:%s] таблица=%s, запрос=%s: %s",\n        e.Code, e.Table, e.Query, e.Message)\n}\n\n// Ошибка сети\ntype NetworkError struct {\n    BaseError\n    Host    string\n    Port    int\n    Timeout bool\n}\n\nfunc (e *NetworkError) Error() string {\n    suffix := ""\n    if e.Timeout {\n        suffix = " (таймаут)"\n    }\n    return fmt.Sprintf("[NET:%s] %s:%d%s: %s",\n        e.Code, e.Host, e.Port, suffix, e.Message)\n}\n\n// Маркерные интерфейсы для категоризации\ntype Retryable interface {\n    IsRetryable() bool\n}\n\nfunc (e *NetworkError) IsRetryable() bool {\n    return e.Timeout // таймауты можно повторить\n}\n\nfunc processRequest(reqType string) error {\n    switch reqType {\n    case "db":\n        return &DBError{\n            BaseError: BaseError{Code: "DB_CONN", Message: "соединение отклонено"},\n            Query:     "SELECT * FROM users",\n            Table:     "users",\n        }\n    case "net":\n        return &NetworkError{\n            BaseError: BaseError{Code: "NET_TIMEOUT", Message: "превышено время"},\n            Host:      "api.example.com",\n            Port:      443,\n            Timeout:   true,\n        }\n    }\n    return nil\n}\n\nfunc main() {\n    for _, reqType := range []string{"db", "net"} {\n        err := processRequest(reqType)\n        if err != nil {\n            fmt.Println(err)\n            \n            // Проверяем можно ли повторить запрос\n            var retryable Retryable\n            if errors.As(err, &retryable) && retryable.IsRetryable() {\n                fmt.Println("  -> Можно повторить запрос")\n            }\n            \n            // Проверяем специфику ошибки\n            var dbErr *DBError\n            if errors.As(err, &dbErr) {\n                fmt.Printf("  -> Таблица: %s\\n", dbErr.Table)\n            }\n            \n            var netErr *NetworkError\n            if errors.As(err, &netErr) {\n                fmt.Printf("  -> Хост: %s:%d\\n", netErr.Host, netErr.Port)\n            }\n        }\n    }\n}'
        }
      ]
    },
    {
      id: 5,
      title: 'Ошибки валидации',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Один из самых частых случаев пользовательских ошибок — ошибки валидации данных. Форма с несколькими полями может иметь несколько ошибок одновременно — удобно их все собрать и вернуть разом.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "errors"\n    "fmt"\n    "strings"\n)\n\n// FieldError — ошибка конкретного поля\ntype FieldError struct {\n    Field   string\n    Value   interface{}\n    Message string\n}\n\nfunc (e *FieldError) Error() string {\n    return fmt.Sprintf("поле %q (значение: %v): %s", e.Field, e.Value, e.Message)\n}\n\n// ValidationErrors — коллекция ошибок полей\ntype ValidationErrors struct {\n    Errors []*FieldError\n}\n\nfunc (ve *ValidationErrors) Add(field string, value interface{}, msg string) {\n    ve.Errors = append(ve.Errors, &FieldError{\n        Field:   field,\n        Value:   value,\n        Message: msg,\n    })\n}\n\nfunc (ve *ValidationErrors) HasErrors() bool {\n    return len(ve.Errors) > 0\n}\n\nfunc (ve *ValidationErrors) Error() string {\n    if len(ve.Errors) == 0 {\n        return "нет ошибок"\n    }\n    msgs := make([]string, len(ve.Errors))\n    for i, e := range ve.Errors {\n        msgs[i] = e.Error()\n    }\n    return fmt.Sprintf("ошибки валидации (%d): %s",\n        len(ve.Errors), strings.Join(msgs, "; "))\n}\n\n// ForField возвращает ошибку конкретного поля\nfunc (ve *ValidationErrors) ForField(field string) *FieldError {\n    for _, e := range ve.Errors {\n        if e.Field == field {\n            return e\n        }\n    }\n    return nil\n}\n\ntype RegisterForm struct {\n    Username string\n    Email    string\n    Password string\n    Age      int\n}\n\nfunc validateForm(form RegisterForm) error {\n    ve := &ValidationErrors{}\n    \n    if len(form.Username) < 3 {\n        ve.Add("username", form.Username, "минимум 3 символа")\n    }\n    if len(form.Username) > 20 {\n        ve.Add("username", form.Username, "максимум 20 символов")\n    }\n    if !strings.Contains(form.Email, "@") {\n        ve.Add("email", form.Email, "неверный формат email")\n    }\n    if len(form.Password) < 8 {\n        ve.Add("password", "***", "минимум 8 символов")\n    }\n    if form.Age < 18 {\n        ve.Add("age", form.Age, "должно быть не менее 18")\n    }\n    \n    if ve.HasErrors() {\n        return ve\n    }\n    return nil\n}\n\nfunc main() {\n    form := RegisterForm{\n        Username: "ab",          // слишком короткий\n        Email:    "не-email",    // неверный формат\n        Password: "123",         // слишком короткий\n        Age:      15,            // несовершеннолетний\n    }\n    \n    err := validateForm(form)\n    if err != nil {\n        fmt.Println(err)\n        fmt.Println()\n        \n        var ve *ValidationErrors\n        if errors.As(err, &ve) {\n            fmt.Printf("Найдено ошибок: %d\\n", len(ve.Errors))\n            for _, fe := range ve.Errors {\n                fmt.Printf("  - %s\\n", fe)\n            }\n            \n            // Проверяем конкретное поле\n            if ageErr := ve.ForField("age"); ageErr != nil {\n                fmt.Printf("\\nПроблема с возрастом: %s\\n", ageErr.Message)\n            }\n        }\n    }\n}'
        },
        {
          type: 'note',
          value: 'Паттерн ValidationErrors (коллекция ошибок) используется во многих Go фреймворках валидации: go-playground/validator, ozzo-validation и других.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Система обработки платежей',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте систему ошибок для обработки платежей с иерархией типов.',
      requirements: [
        'Создать базовый тип PaymentError с полями Code string, Message string, TransactionID string и методом Error() string',
        'Создать InsufficientFundsError встраивающий PaymentError с полями Amount float64, Balance float64',
        'Создать CardDeclinedError встраивающий PaymentError с полями CardLast4 string, Reason string',
        'Создать FraudDetectedError встраивающий PaymentError с полями RiskScore float64',
        'Написать функцию ProcessPayment(amount float64, cardLast4 string, balance float64) error симулирующую оплату: если amount > balance — InsufficientFunds, если cardLast4 == "0000" — CardDeclined, если amount > 50000 — FraudDetected, иначе nil',
        'Написать функцию HandlePaymentError(err error) string которая через errors.As определяет тип и возвращает понятное сообщение для пользователя'
      ],
      expectedOutput: 'Обработка 5000: Недостаточно средств: нужно 5000.00, есть 1000.00\nОбработка с картой 0000: Карта отклонена: подозрительная активность\nОбработка 60000: Транзакция заблокирована службой безопасности',
      hint: 'У каждой ошибки должен быть свой Error() метод с деталями. HandlePaymentError использует серию errors.As для определения конкретного типа.',
      solution: 'package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\ntype PaymentError struct {\n    Code          string\n    Message       string\n    TransactionID string\n}\n\nfunc (e *PaymentError) Error() string {\n    return fmt.Sprintf("[%s] %s (txID: %s)", e.Code, e.Message, e.TransactionID)\n}\n\ntype InsufficientFundsError struct {\n    PaymentError\n    Amount  float64\n    Balance float64\n}\n\nfunc (e *InsufficientFundsError) Error() string {\n    return fmt.Sprintf("Недостаточно средств: нужно %.2f, есть %.2f (txID: %s)",\n        e.Amount, e.Balance, e.TransactionID)\n}\n\ntype CardDeclinedError struct {\n    PaymentError\n    CardLast4 string\n    Reason    string\n}\n\nfunc (e *CardDeclinedError) Error() string {\n    return fmt.Sprintf("Карта *%s отклонена: %s (txID: %s)",\n        e.CardLast4, e.Reason, e.TransactionID)\n}\n\ntype FraudDetectedError struct {\n    PaymentError\n    RiskScore float64\n}\n\nfunc (e *FraudDetectedError) Error() string {\n    return fmt.Sprintf("Мошенничество (риск %.0f%%): %s (txID: %s)",\n        e.RiskScore*100, e.Message, e.TransactionID)\n}\n\nfunc ProcessPayment(amount float64, cardLast4 string, balance float64) error {\n    txID := fmt.Sprintf("TX-%s-%.0f", cardLast4, amount)\n    if amount > balance {\n        return &InsufficientFundsError{\n            PaymentError: PaymentError{Code: "INSUF_FUNDS", Message: "недостаточно средств", TransactionID: txID},\n            Amount:  amount,\n            Balance: balance,\n        }\n    }\n    if cardLast4 == "0000" {\n        return &CardDeclinedError{\n            PaymentError: PaymentError{Code: "CARD_DECLINED", Message: "карта отклонена", TransactionID: txID},\n            CardLast4: cardLast4,\n            Reason:    "подозрительная активность",\n        }\n    }\n    if amount > 50000 {\n        return &FraudDetectedError{\n            PaymentError: PaymentError{Code: "FRAUD", Message: "подозрение на мошенничество", TransactionID: txID},\n            RiskScore: 0.95,\n        }\n    }\n    return nil\n}\n\nfunc HandlePaymentError(err error) string {\n    if err == nil {\n        return "Платёж успешно обработан"\n    }\n    var insuf *InsufficientFundsError\n    if errors.As(err, &insuf) {\n        return fmt.Sprintf("Недостаточно средств: нужно %.2f, есть %.2f", insuf.Amount, insuf.Balance)\n    }\n    var declined *CardDeclinedError\n    if errors.As(err, &declined) {\n        return fmt.Sprintf("Карта отклонена: %s", declined.Reason)\n    }\n    var fraud *FraudDetectedError\n    if errors.As(err, &fraud) {\n        return "Транзакция заблокирована службой безопасности"\n    }\n    return "Неизвестная ошибка платежа: " + err.Error()\n}\n\nfunc main() {\n    cases := []struct{\n        amount  float64\n        card    string\n        balance float64\n    }{\n        {5000, "1234", 1000},\n        {100, "0000", 500},\n        {60000, "5678", 100000},\n        {500, "9999", 1000},\n    }\n    for _, c := range cases {\n        err := ProcessPayment(c.amount, c.card, c.balance)\n        msg := HandlePaymentError(err)\n        if err != nil {\n            fmt.Printf("Обработка %.0f (карта %s): %s\\n", c.amount, c.card, msg)\n        } else {\n            fmt.Printf("Обработка %.0f: %s\\n", c.amount, msg)\n        }\n    }\n}',
      explanation: 'Иерархия ошибок строится через встраивание PaymentError. Каждый тип переопределяет Error() для специфического сообщения. HandlePaymentError использует errors.As для безопасного приведения типов без паники.'
    }
  ]
}
