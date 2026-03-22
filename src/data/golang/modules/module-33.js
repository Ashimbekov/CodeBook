export default {
  id: 33,
  title: 'Логирование',
  description: 'Пакет log, уровни логирования, структурированное логирование через slog, лучшие практики',
  lessons: [
    {
      id: 1,
      title: 'Пакет log — базовое логирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Логирование — это запись событий, происходящих в программе. Представьте бортовой журнал корабля: капитан записывает каждое важное событие. Если что-то пошло не так, журнал поможет понять что и когда произошло.' },
        { type: 'heading', value: 'Пакет log' },
        { type: 'text', value: 'В Go есть встроенный пакет log. Он прост и работает "из коробки". По умолчанию выводит сообщения в stderr с датой и временем.' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "log"\n    "os"\n)\n\nfunc main() {\n    // Простой вывод (добавляет дату и время)\n    log.Println("сервер запускается...")\n    // 2024/01/15 10:30:45 сервер запускается...\n\n    // Форматированный вывод (как fmt.Printf)\n    port := 8080\n    log.Printf("слушаем на порту %d", port)\n\n    // Вывод в файл\n    file, err := os.OpenFile("app.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)\n    if err != nil {\n        log.Fatal("не удалось открыть лог-файл:", err)\n    }\n    defer file.Close()\n\n    // Создаём логгер который пишет в файл\n    logger := log.New(file, "APP: ", log.LstdFlags)\n    logger.Println("это запишется в файл")\n}' },
        { type: 'heading', value: 'Флаги форматирования' },
        { type: 'code', language: 'go', value: '// Флаги определяют что добавляется к каждому сообщению\nlog.SetFlags(log.LstdFlags)              // дата + время (по умолчанию)\nlog.SetFlags(log.Ldate | log.Ltime)      // то же самое явно\nlog.SetFlags(log.Ldate | log.Ltime | log.Lshortfile) // + файл:строка\nlog.SetFlags(log.Ltime | log.Lmicroseconds)           // время с микросекундами\nlog.SetFlags(0)                          // без префикса\n\n// Префикс — строка перед каждым сообщением\nlog.SetPrefix("[ERROR] ")\nlog.Println("что-то пошло не так")\n// [ERROR] 2024/01/15 10:30:45 что-то пошло не так' },
        { type: 'note', value: 'Функции log.Println, log.Printf и log.Print работают точно как fmt аналоги, но добавляют дату/время и пишут в stderr (не stdout). Это важно при работе с Docker и системами сбора логов.' }
      ]
    },
    {
      id: 2,
      title: 'log.Fatal и log.Panic — критические ошибки',
      type: 'theory',
      content: [
        { type: 'text', value: 'В пакете log есть три уровня "серьёзности": обычный Print, Fatal (завершает программу) и Panic (вызывает панику). Это как светофор: жёлтый, красный и... взрыв.' },
        { type: 'heading', value: 'log.Fatal — завершение программы' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "log"\n    "os"\n)\n\nfunc main() {\n    // log.Fatal = log.Print + os.Exit(1)\n    configPath := os.Getenv("CONFIG_PATH")\n    if configPath == "" {\n        log.Fatal("CONFIG_PATH не задан — дальнейшая работа невозможна")\n        // эта строка никогда не выполнится\n    }\n\n    // log.Fatalf = log.Printf + os.Exit(1)\n    file, err := os.Open(configPath)\n    if err != nil {\n        log.Fatalf("не удалось открыть конфиг %s: %v", configPath, err)\n    }\n    defer file.Close()\n\n    log.Println("конфиг загружен успешно")\n}' },
        { type: 'heading', value: 'log.Panic — паника с логом' },
        { type: 'code', language: 'go', value: '// log.Panic = log.Print + panic()\n// log.Panicf = log.Printf + panic()\n\nfunc connectDB() *DB {\n    db, err := openDatabase()\n    if err != nil {\n        // panic можно recover-нуть в отличие от os.Exit\n        log.Panicf("критическая ошибка БД: %v", err)\n    }\n    return db\n}' },
        { type: 'heading', value: 'Когда что использовать' },
        { type: 'list', items: [
          'log.Print/Printf/Println — обычные информационные сообщения',
          'log.Fatal — программа не может продолжать работу (нет конфига, нет порта, критическая настройка)',
          'log.Panic — неожиданное состояние которое "не должно было произойти никогда"',
          'Избегайте log.Fatal внутри библиотечных функций — лучше вернуть ошибку'
        ]},
        { type: 'warning', value: 'log.Fatal вызывает os.Exit(1) — defer-функции НЕ выполнятся! Если у вас есть незакрытые ресурсы (файлы, соединения с БД), сначала закройте их вручную, потом вызывайте Fatal.' }
      ]
    },
    {
      id: 3,
      title: 'Уровни логирования — концепция',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стандартный пакет log не имеет уровней (DEBUG, INFO, WARN, ERROR). Уровни логирования — это как разные цвета выделения в книге: синий для заметок, жёлтый для важного, красный для критического. Это позволяет фильтровать и настраивать вербозность приложения.' },
        { type: 'heading', value: 'Создание простых уровней через несколько логгеров' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "io"\n    "log"\n    "os"\n)\n\nvar (\n    Debug   *log.Logger\n    Info    *log.Logger\n    Warning *log.Logger\n    Error   *log.Logger\n)\n\nfunc initLoggers(debugOut io.Writer) {\n    Debug   = log.New(debugOut,   "DEBUG: ",   log.Ldate|log.Ltime|log.Lshortfile)\n    Info    = log.New(os.Stdout,  "INFO:  ",   log.Ldate|log.Ltime)\n    Warning = log.New(os.Stdout,  "WARNING: ", log.Ldate|log.Ltime)\n    Error   = log.New(os.Stderr,  "ERROR: ",   log.Ldate|log.Ltime|log.Lshortfile)\n}\n\nfunc main() {\n    // В production отключаем DEBUG (пишем в /dev/null)\n    // В разработке включаем DEBUG (пишем в os.Stdout)\n    initLoggers(io.Discard) // DEBUG отключён\n\n    Info.Println("сервер запущен")\n    Warning.Println("использована устаревшая функция")\n    Error.Println("не удалось подключиться к кешу")\n    Debug.Println("это не выведется в production")\n}' },
        { type: 'heading', value: 'Популярные сторонние библиотеки логирования' },
        { type: 'list', items: [
          'zerolog — самый быстрый, нулевые аллокации, JSON-вывод',
          'zap (Uber) — высокая производительность, структурированный лог',
          'logrus — популярный, много плагинов (устаревает)',
          'slog (Go 1.21+) — стандартная библиотека, структурированное логирование'
        ]},
        { type: 'tip', value: 'Начиная с Go 1.21 в стандартной библиотеке есть пакет log/slog с поддержкой уровней и структурированного логирования. Рекомендуется для новых проектов.' }
      ]
    },
    {
      id: 4,
      title: 'Структурированное логирование — slog',
      type: 'theory',
      content: [
        { type: 'text', value: 'Структурированное логирование — это когда лог-сообщение содержит не просто текст, а набор ключ-значение пар. Это как разница между "Ошибка в заказе №123 пользователя Алия" и JSON: {"error": "not found", "order_id": 123, "user": "Алия"}. Второй формат легко парсить и искать.' },
        { type: 'heading', value: 'Пакет log/slog (Go 1.21+)' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "context"\n    "log/slog"\n    "os"\n)\n\nfunc main() {\n    // Текстовый обработчик (читаемый)\n    textHandler := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{\n        Level: slog.LevelDebug, // показывать с DEBUG и выше\n    })\n    logger := slog.New(textHandler)\n\n    // Базовое использование\n    logger.Info("пользователь вошёл",\n        "user_id", 42,\n        "username", "Алия",\n        "ip", "192.168.1.1",\n    )\n    // time=2024-01-15T10:30:45Z level=INFO msg="пользователь вошёл" user_id=42 username=Алия ip=192.168.1.1\n\n    // Уровни\n    logger.Debug("детальная отладка", "query", "SELECT * FROM users")\n    logger.Warn("медленный запрос", "duration_ms", 1500)\n    logger.Error("ошибка БД", "err", "connection refused")\n}' },
        { type: 'heading', value: 'JSON-вывод для production' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "log/slog"\n    "os"\n)\n\nfunc main() {\n    // JSON обработчик — идеально для Kibana, Datadog, Loki\n    jsonHandler := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{\n        Level: slog.LevelInfo,\n        // Добавляем имя источника в лог\n        AddSource: true,\n    })\n    logger := slog.New(jsonHandler)\n    slog.SetDefault(logger) // теперь slog.Info() будет использовать наш логгер\n\n    slog.Info("заказ создан",\n        slog.Int("order_id", 1001),\n        slog.String("user", "Нурдаулет"),\n        slog.Float64("amount", 1599.99),\n    )\n    // {\"time\":\"2024-01-15T10:30:45Z\",\"level\":\"INFO\",\"source\":{\"function\":\"main.main\",\"file\":\"main.go\",\"line\":18},\"msg\":\"заказ создан\",\"order_id\":1001,\"user\":\"Нурдаулет\",\"amount\":1599.99}\n\n    // С группировкой атрибутов\n    logger.Info("HTTP запрос",\n        slog.Group("request",\n            slog.String("method", "POST"),\n            slog.String("path", "/api/orders"),\n            slog.Int("status", 201),\n        ),\n    )\n}' },
        { type: 'heading', value: 'Контекстное логирование' },
        { type: 'code', language: 'go', value: 'func handleRequest(ctx context.Context, userID int) {\n    // Logger с общими полями для всего хендлера\n    log := slog.With(\n        "user_id", userID,\n        "request_id", ctx.Value("req_id"),\n    )\n\n    log.Info("обрабатываем запрос")\n    // ... работа ...\n    log.Info("запрос завершён", "duration_ms", 42)\n    // Оба сообщения будут содержать user_id и request_id\n}' }
      ]
    },
    {
      id: 5,
      title: 'Лучшие практики логирования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хороший лог — это помощник при отладке. Плохой лог — это шум, в котором ничего не найти. Вот правила хорошего логирования.' },
        { type: 'heading', value: 'Что логировать' },
        { type: 'list', items: [
          'INFO: старт/стоп сервисов, обработка запросов, важные бизнес-события (заказ создан, платёж прошёл)',
          'WARN: медленные запросы, использование устаревших API, высокое потребление ресурсов',
          'ERROR: ошибки которые требуют внимания, но программа продолжает работу',
          'DEBUG: детальная информация для отладки (запросы к БД, значения переменных)',
          'НЕ логируйте пароли, токены, персональные данные!'
        ]},
        { type: 'heading', value: 'Примеры хорошего логирования' },
        { type: 'code', language: 'go', value: 'package main\n\nimport (\n    "errors"\n    "log/slog"\n    "time"\n)\n\nfunc processOrder(orderID int, userID int) error {\n    start := time.Now()\n    logger := slog.With("order_id", orderID, "user_id", userID)\n\n    logger.Info("начало обработки заказа")\n\n    // Плохо: логируем ошибку И возвращаем её (двойной лог)\n    // err := saveOrder(orderID)\n    // if err != nil {\n    //     logger.Error("ошибка сохранения", "err", err) // плохо!\n    //     return err // ошибка залогируется снова на уровне выше\n    // }\n\n    // Хорошо: либо логируем здесь, либо возвращаем — не оба\n    err := saveOrder(orderID)\n    if err != nil {\n        // Оборачиваем ошибку и возвращаем — лог будет на верхнем уровне\n        return fmt.Errorf("сохранение заказа %d: %w", orderID, err)\n    }\n\n    duration := time.Since(start)\n    if duration > 500*time.Millisecond {\n        logger.Warn("медленная обработка заказа",\n            "duration_ms", duration.Milliseconds(),\n        )\n    }\n\n    logger.Info("заказ обработан успешно",\n        "duration_ms", duration.Milliseconds(),\n    )\n    return nil\n}' },
        { type: 'warning', value: 'Никогда не логируйте пароли, токены аутентификации, номера кредитных карт или другие чувствительные данные. Это нарушение безопасности и GDPR.' },
        { type: 'tip', value: 'В production используйте уровень INFO или WARN. DEBUG создаёт слишком много шума и замедляет систему. DEBUG включайте только при отладке конкретной проблемы.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: настройка логгера',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте пакет logger с настраиваемым логгером на основе slog. Логгер должен поддерживать текстовый режим для разработки и JSON режим для production, управляться через переменную окружения.',
      requirements: [
        'Создайте функцию New(env string) *slog.Logger',
        'Если env == "production" — JSON формат с уровнем INFO',
        'Если env == "development" — текстовый формат с уровнем DEBUG',
        'Добавьте поле "version" = "1.0.0" ко всем сообщениям через slog.With',
        'Напишите пример использования в main()'
      ],
      expectedOutput: 'time=... level=INFO msg="сервер запущен" version=1.0.0 port=8080',
      hint: 'Используйте os.Getenv("APP_ENV") для определения окружения. slog.NewJSONHandler и slog.NewTextHandler принимают io.Writer и *slog.HandlerOptions. Метод logger.With() добавляет общие поля.',
      solution: 'package main\n\nimport (\n    "log/slog"\n    "os"\n)\n\n// New создаёт логгер в зависимости от окружения\nfunc New(env string) *slog.Logger {\n    opts := &slog.HandlerOptions{\n        Level: slog.LevelInfo,\n    }\n\n    var handler slog.Handler\n    if env == "development" {\n        opts.Level = slog.LevelDebug\n        opts.AddSource = true\n        handler = slog.NewTextHandler(os.Stdout, opts)\n    } else {\n        handler = slog.NewJSONHandler(os.Stdout, opts)\n    }\n\n    return slog.New(handler).With(\n        slog.String("version", "1.0.0"),\n    )\n}\n\nfunc main() {\n    env := os.Getenv("APP_ENV")\n    if env == "" {\n        env = "development"\n    }\n\n    logger := New(env)\n    slog.SetDefault(logger)\n\n    logger.Info("сервер запущен",\n        slog.Int("port", 8080),\n        slog.String("env", env),\n    )\n\n    logger.Debug("отладочная информация",\n        slog.String("config", "default.yaml"),\n    )\n\n    logger.Warn("высокая нагрузка",\n        slog.Int("connections", 950),\n        slog.Int("max_connections", 1000),\n    )\n}',
      explanation: 'Функция New() выбирает обработчик на основе окружения. В development используем TextHandler с уровнем DEBUG — читаемо для разработчика. В production используем JSONHandler с уровнем INFO — машиночитаемо для систем сбора логов. slog.With добавляет постоянные поля (version) ко всем последующим сообщениям этого логгера.'
    }
  ]
}
