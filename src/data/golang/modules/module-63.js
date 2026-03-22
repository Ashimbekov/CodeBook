export default {
  id: 63,
  title: 'Docker и Go',
  description: 'Контейнеризация Go приложений: написание Dockerfile, многоэтапная сборка, docker-compose, переменные окружения, тома, сетевое взаимодействие и оптимизация размера образа.',
  lessons: [
    {
      id: 1,
      title: 'Dockerfile для Go приложения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker — это как одноразовый контейнер для транспортировки: ваше приложение упакованно со всем необходимым и работает одинаково на любой машине. Dockerfile — это рецепт создания такого контейнера.' },
        { type: 'heading', value: 'Базовый Dockerfile' },
        { type: 'code', language: 'go', value: '# Dockerfile (простая версия, НЕ оптимальная)\n\n# Базовый образ с Go\nFROM golang:1.22-alpine\n\n# Рабочая директория внутри контейнера\nWORKDIR /app\n\n# Копируем файлы зависимостей\nCOPY go.mod go.sum ./\n\n# Скачиваем зависимости (кешируется отдельным слоем)\nRUN go mod download\n\n# Копируем исходный код\nCOPY . .\n\n# Компилируем\nRUN go build -o server ./cmd/server\n\n# Открываем порт\nEXPOSE 8080\n\n# Команда запуска\nCMD ["./server"]\n\n# Проблема: итоговый образ ~400MB из-за golang:1.22\n# Решение: multi-stage build (следующий урок)' },
        { type: 'heading', value: 'Сборка и запуск' },
        { type: 'code', language: 'go', value: '// Команды для работы с Docker:\n\n// Сборка образа\n// docker build -t myapp:latest .\n// docker build -t myapp:v1.0.0 .\n\n// Запуск контейнера\n// docker run -p 8080:8080 myapp:latest\n\n// Запуск в фоне с именем\n// docker run -d --name myapp -p 8080:8080 myapp:latest\n\n// Просмотр логов\n// docker logs myapp\n// docker logs -f myapp  # follow (как tail -f)\n\n// Проверка запущенных контейнеров\n// docker ps\n\n// Остановка и удаление\n// docker stop myapp\n// docker rm myapp\n\n// Размер образа\n// docker images myapp\n\n// main.go для примера:\npackage main\n\nimport (\n    "fmt"\n    "net/http"\n    "os"\n)\n\nfunc main() {\n    port := os.Getenv("PORT")\n    if port == "" {\n        port = "8080"\n    }\n\n    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {\n        hostname, _ := os.Hostname()\n        fmt.Fprintf(w, "Привет из контейнера %s!\\n", hostname)\n    })\n\n    fmt.Printf("Сервер запущен на :%s\\n", port)\n    http.ListenAndServe(":"+port, nil)\n}' },
        { type: 'tip', value: 'Порядок команд в Dockerfile важен для кеширования. Ставьте часто изменяющиеся команды (COPY . .) ПОСЛЕ редко изменяющихся (go mod download). Docker кеширует каждый слой, и при изменении слоя все последующие перестраиваются.' }
      ]
    },
    {
      id: 2,
      title: 'Multi-stage сборка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Multi-stage сборка — ключевой приём для Go в Docker. Идея проста: используем один контейнер для компиляции, а другой (маленький) — для запуска. Как строить корабль на верфи, а плавать на готовом корабле без верфи.' },
        { type: 'heading', value: 'Многоэтапный Dockerfile' },
        { type: 'code', language: 'go', value: '# Dockerfile с multi-stage сборкой\n\n# ===== Этап 1: Сборка =====\n# Называем этап "builder"\nFROM golang:1.22-alpine AS builder\n\n# Устанавливаем зависимости для CGO (если нужны)\n# RUN apk add --no-cache gcc musl-dev\n\nWORKDIR /app\n\n# Копируем и скачиваем зависимости\nCOPY go.mod go.sum ./\nRUN go mod download\n\n# Копируем исходный код\nCOPY . .\n\n# Компилируем статический бинарник\n# CGO_ENABLED=0 - отключаем CGO (статическая линковка)\n# GOOS=linux - явно указываем ОС\n# -ldflags="-w -s" - убираем debug символы (меньше размер)\nRUN CGO_ENABLED=0 GOOS=linux go build \\\n    -ldflags="-w -s" \\\n    -o server \\\n    ./cmd/server\n\n# ===== Этап 2: Финальный образ =====\n# scratch - абсолютно пустой образ!\nFROM scratch\n\n# Или используйте alpine для отладки:\n# FROM alpine:3.19\n# RUN apk --no-cache add ca-certificates tzdata\n\n# Копируем ТОЛЬКО скомпилированный бинарник из builder\nCOPY --from=builder /app/server /server\n\n# Копируем сертификаты (нужны для HTTPS запросов)\nCOPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/\n\nEXPOSE 8080\n\n# Запускаем от непривилегированного пользователя (безопасность)\nUSER 1000:1000\n\nCMD ["/server"]' },
        { type: 'heading', value: 'Сравнение размеров образов' },
        { type: 'code', language: 'go', value: '// Сравнение размеров:\n// golang:1.22                  -> ~800MB\n// golang:1.22-alpine           -> ~300MB\n// golang:alpine + app (naive)  -> ~350MB\n// multi-stage + scratch        -> ~10-15MB  !!!\n// multi-stage + alpine:3.19    -> ~20-25MB\n\n// Проверить размер:\n// docker images myapp\n\n// Почему scratch работает с Go?\n// Go компилирует статический бинарник, который не нуждается\n// в системных библиотеках (libc и т.д.)\n// Исключение: если используете CGO или net пакет без CGO_ENABLED=0\n\n// Dockerfile.alpine — для отладки\n// FROM alpine:3.19\n// RUN apk --no-cache add ca-certificates tzdata\n// WORKDIR /app\n// COPY --from=builder /app/server .\n// EXPOSE 8080\n// CMD ["./server"]' },
        { type: 'warning', value: 'При использовании FROM scratch убедитесь, что добавляете ca-certificates для HTTPS и timezone данные (tzdata) если работаете с временными зонами. Без них TLS соединения и time.LoadLocation упадут.' }
      ]
    },
    {
      id: 3,
      title: 'Docker Compose',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker Compose позволяет запускать несколько контейнеров как единую систему. Это как партитура для оркестра: каждый инструмент (контейнер) знает свою роль, и все они играют вместе.' },
        { type: 'heading', value: 'docker-compose.yml для Go приложения' },
        { type: 'code', language: 'go', value: '# docker-compose.yml\n\n# version: "3.8"  # для старых версий Docker Compose\n\nservices:\n  # Go приложение\n  app:\n    build:\n      context: .           # директория с Dockerfile\n      dockerfile: Dockerfile\n    ports:\n      - "8080:8080"        # host:container\n    environment:\n      - PORT=8080\n      - DATABASE_URL=postgres://user:pass@postgres:5432/myapp\n      - REDIS_URL=redis://redis:6379\n    depends_on:\n      postgres:\n        condition: service_healthy  # ждём готовности postgres\n      redis:\n        condition: service_started\n    networks:\n      - app-network\n    restart: unless-stopped\n\n  # PostgreSQL\n  postgres:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_DB: myapp\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: pass\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n      - ./migrations:/docker-entrypoint-initdb.d  # авто-миграции\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]\n      interval: 5s\n      timeout: 5s\n      retries: 5\n    networks:\n      - app-network\n\n  # Redis\n  redis:\n    image: redis:7-alpine\n    ports:\n      - "6379:6379"\n    networks:\n      - app-network\n\nnetworks:\n  app-network:\n    driver: bridge\n\nvolumes:\n  postgres_data:  # именованный том для persistence' },
        { type: 'heading', value: 'Команды docker-compose' },
        { type: 'code', language: 'go', value: '// Основные команды:\n// docker compose up              - запустить всё\n// docker compose up -d           - запустить в фоне\n// docker compose up --build      - пересобрать образы\n// docker compose down            - остановить всё\n// docker compose down -v         - остановить и удалить тома\n// docker compose logs app        - логи конкретного сервиса\n// docker compose logs -f         - все логи в реальном времени\n// docker compose ps              - статус сервисов\n// docker compose exec app sh     - войти в контейнер\n// docker compose restart app     - перезапустить сервис\n\n// Для разработки: горячая перезагрузка с air\n// services:\n//   app:\n//     build:\n//       context: .\n//       dockerfile: Dockerfile.dev\n//     volumes:\n//       - .:/app        # монтируем исходный код\n//     command: air      # горячая перезагрузка\n\n// Dockerfile.dev\n// FROM golang:1.22-alpine\n// RUN go install github.com/cosmtrek/air@latest\n// WORKDIR /app\n// COPY go.mod go.sum ./\n// RUN go mod download\n// CMD ["air"]' }
      ]
    },
    {
      id: 4,
      title: 'Переменные окружения и секреты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Управление конфигурацией в Docker — важная тема. Никогда не хардкодируйте секреты в Dockerfile или docker-compose.yml. Используйте .env файлы, Docker secrets или системы управления секретами.' },
        { type: 'heading', value: 'Работа с .env файлами' },
        { type: 'code', language: 'go', value: '# .env файл (НЕ добавляйте в git!)\n# DATABASE_URL=postgres://user:secret123@localhost:5432/prod\n# JWT_SECRET=my-super-secret-key\n# REDIS_URL=redis://localhost:6379\n\n# docker-compose.yml с .env\n# services:\n#   app:\n#     env_file:\n#       - .env           # загружает все переменные из файла\n#     environment:\n#       - NODE_ENV=production  # переопределяем отдельные\n\n# .env.example (ДОБАВЛЯЙТЕ в git — шаблон без значений)\n# DATABASE_URL=postgres://user:password@localhost:5432/myapp\n# JWT_SECRET=change-me\n# REDIS_URL=redis://localhost:6379\n\n// В Go коде:\npackage main\n\nimport (\n    "fmt"\n    "log"\n    "os"\n)\n\ntype Config struct {\n    DatabaseURL string\n    JWTSecret   string\n    RedisURL    string\n    Port        string\n}\n\nfunc mustGetEnv(key string) string {\n    val := os.Getenv(key)\n    if val == "" {\n        log.Fatalf("Обязательная переменная %s не задана", key)\n    }\n    return val\n}\n\nfunc LoadConfig() *Config {\n    return &Config{\n        DatabaseURL: mustGetEnv("DATABASE_URL"),\n        JWTSecret:   mustGetEnv("JWT_SECRET"),\n        RedisURL:    os.Getenv("REDIS_URL"), // опциональная\n        Port:        getEnvDefault("PORT", "8080"),\n    }\n}\n\nfunc getEnvDefault(key, def string) string {\n    if v := os.Getenv(key); v != "" {\n        return v\n    }\n    return def\n}\n\nfunc main() {\n    cfg := LoadConfig()\n    fmt.Printf("Конфигурация загружена. Порт: %s\\n", cfg.Port)\n}' },
        { type: 'warning', value: 'Никогда не добавляйте .env файлы с реальными секретами в git. Добавьте .env в .gitignore. Вместо этого создайте .env.example с примерами значений без реальных секретов.' }
      ]
    },
    {
      id: 5,
      title: 'Тома (Volumes) и данные',
      type: 'theory',
      content: [
        { type: 'text', value: 'Данные в контейнерах эфемерны — при удалении контейнера данные теряются. Docker volumes решают эту проблему: это как USB флешка, которую можно подключить к любому контейнеру.' },
        { type: 'heading', value: 'Типы томов в Docker' },
        { type: 'code', language: 'go', value: '# 1. Именованный том (named volume) — управляется Docker\n# docker volume create mydata\n# docker run -v mydata:/app/data myapp\n\n# 2. Bind mount — монтируем директорию с хоста\n# docker run -v /home/user/data:/app/data myapp\n# Удобно для разработки (видим изменения сразу)\n\n# 3. tmpfs — временный том в памяти\n# docker run --tmpfs /tmp myapp\n\n# docker-compose.yml с томами:\n# services:\n#   app:\n#     image: myapp\n#     volumes:\n#       # Bind mount для исходного кода (разработка)\n#       - ./src:/app/src\n#       # Именованный том для данных (production)\n#       - app-data:/app/data\n#       # Только чтение\n#       - ./config:/app/config:ro\n#\n#   postgres:\n#     image: postgres:16\n#     volumes:\n#       - pgdata:/var/lib/postgresql/data\n#\n# volumes:\n#   app-data:\n#   pgdata:\n\n// Работа с файлами в Go (с томом)\npackage main\n\nimport (\n    "fmt"\n    "os"\n    "path/filepath"\n)\n\nfunc main() {\n    // Директория данных из ENV (для гибкости в контейнере)\n    dataDir := os.Getenv("DATA_DIR")\n    if dataDir == "" {\n        dataDir = "/app/data"\n    }\n\n    // Убедимся что директория существует\n    if err := os.MkdirAll(dataDir, 0755); err != nil {\n        fmt.Printf("Ошибка создания директории: %v\\n", err)\n        return\n    }\n\n    // Записываем данные\n    filePath := filepath.Join(dataDir, "output.txt")\n    if err := os.WriteFile(filePath, []byte("Данные сохранены!\\n"), 0644); err != nil {\n        fmt.Printf("Ошибка записи: %v\\n", err)\n        return\n    }\n\n    fmt.Printf("Данные сохранены в: %s\\n", filePath)\n}' }
      ]
    },
    {
      id: 6,
      title: 'Сетевое взаимодействие контейнеров',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker создаёт изолированные сети для контейнеров. Внутри одной сети контейнеры видят друг друга по имени сервиса, как если бы они были на одном компьютере в локальной сети.' },
        { type: 'heading', value: 'Сети в Docker Compose' },
        { type: 'code', language: 'go', value: '# docker-compose.yml с изолированными сетями\n\n# services:\n#   frontend:\n#     image: nginx\n#     ports:\n#       - "80:80"\n#     networks:\n#       - frontend-net\n#       - backend-net\n#\n#   api:\n#     build: ./api\n#     networks:\n#       - backend-net    # видит базу данных\n#       - frontend-net   # виден frontend\n#\n#   postgres:\n#     image: postgres:16\n#     networks:\n#       - backend-net    # только backend!\n#       # НЕ доступен из frontend (безопасность)\n#\n# networks:\n#   frontend-net:\n#     driver: bridge\n#   backend-net:\n#     driver: bridge\n\n// В Go коде — подключение к сервисам по имени\npackage main\n\nimport (\n    "database/sql"\n    "fmt"\n    "os"\n\n    _ "github.com/lib/pq"\n)\n\nfunc main() {\n    // В docker-compose postgres доступен как "postgres"\n    // а не как "localhost"\n    dbURL := os.Getenv("DATABASE_URL")\n    if dbURL == "" {\n        // В docker-compose: postgres — имя сервиса\n        dbURL = "postgres://user:pass@postgres:5432/myapp?sslmode=disable"\n    }\n\n    db, err := sql.Open("postgres", dbURL)\n    if err != nil {\n        fmt.Printf("Ошибка подключения: %v\\n", err)\n        return\n    }\n    defer db.Close()\n\n    if err := db.Ping(); err != nil {\n        fmt.Printf("БД недоступна: %v\\n", err)\n        return\n    }\n\n    fmt.Println("Подключение к PostgreSQL успешно!")\n}' },
        { type: 'tip', value: 'По умолчанию docker-compose создаёт одну сеть для всех сервисов. Разделение на несколько сетей — хорошая практика для безопасности: база данных не должна быть доступна напрямую из интернета.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: оптимизация образа Go приложения',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай оптимизированный Docker образ для Go веб-сервера. Используй multi-stage сборку, минимизируй размер образа и добавь health check.',
      requirements: [
        'Создай простой HTTP сервер на Go с эндпоинтами / и /health',
        'Напиши Dockerfile с multi-stage сборкой (builder + scratch/alpine)',
        'Добавь CGO_ENABLED=0 и -ldflags="-w -s" для минимального бинарника',
        'Добавь HEALTHCHECK инструкцию в Dockerfile',
        'Создай .dockerignore для исключения ненужных файлов',
        'Итоговый образ должен быть менее 20MB',
        'Сервер должен читать PORT из переменной окружения'
      ],
      expectedOutput: '$ docker build -t myapp .\n$ docker images myapp\nREPOSITORY   TAG       SIZE\nmyapp        latest    ~12MB\n\n$ docker run -d -p 8080:8080 -e PORT=8080 myapp\n$ curl http://localhost:8080/\nПривет из Go контейнера!\n$ curl http://localhost:8080/health\n{"status":"ok","version":"1.0.0"}',
      hint: 'Ключ к маленькому образу: FROM scratch в финальном этапе + CGO_ENABLED=0 + -ldflags="-w -s". .dockerignore должен исключать .git, *.md, *_test.go файлы. HEALTHCHECK CMD ["/server", "-check"] или используй curl в alpine образе.',
      solution: '// main.go\npackage main\n\nimport (\n    "encoding/json"\n    "flag"\n    "fmt"\n    "net/http"\n    "os"\n)\n\nconst version = "1.0.0"\n\nfunc main() {\n    // Флаг для health check\n    check := flag.Bool("check", false, "выполнить health check и выйти")\n    flag.Parse()\n\n    if *check {\n        resp, err := http.Get("http://localhost:" + getPort() + "/health")\n        if err != nil || resp.StatusCode != 200 {\n            os.Exit(1)\n        }\n        os.Exit(0)\n    }\n\n    mux := http.NewServeMux()\n\n    mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {\n        hostname, _ := os.Hostname()\n        fmt.Fprintf(w, "Привет из Go контейнера %s!\\n", hostname)\n    })\n\n    mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {\n        w.Header().Set("Content-Type", "application/json")\n        json.NewEncoder(w).Encode(map[string]string{\n            "status":  "ok",\n            "version": version,\n        })\n    })\n\n    port := getPort()\n    fmt.Printf("Сервер запущен на :%s (v%s)\\n", port, version)\n    if err := http.ListenAndServe(":"+port, mux); err != nil {\n        fmt.Fprintf(os.Stderr, "Ошибка: %v\\n", err)\n        os.Exit(1)\n    }\n}\n\nfunc getPort() string {\n    if p := os.Getenv("PORT"); p != "" {\n        return p\n    }\n    return "8080"\n}\n\n// ---\n// Dockerfile\n// FROM golang:1.22-alpine AS builder\n// WORKDIR /app\n// COPY go.mod go.sum ./\n// RUN go mod download\n// COPY . .\n// RUN CGO_ENABLED=0 GOOS=linux go build \\\n//     -ldflags="-w -s" \\\n//     -o server .\n//\n// FROM scratch\n// COPY --from=builder /app/server /server\n// COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/\n// EXPOSE 8080\n// HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\\n//   CMD ["/server", "-check"]\n// USER 1000:1000\n// CMD ["/server"]\n//\n// ---\n// .dockerignore\n// .git\n// .gitignore\n// *.md\n// *_test.go\n// Dockerfile*\n// docker-compose*\n// .env*',
      explanation: 'multi-stage сборка разделяет этапы компиляции (golang:alpine) и запуска (scratch). CGO_ENABLED=0 отключает CGO и создаёт полностью статический бинарник без зависимостей от системных библиотек. -ldflags="-w -s" убирает debug информацию (~30% экономии). FROM scratch создаёт минимальный образ — только ваш бинарник и необходимые файлы. HEALTHCHECK позволяет Docker и оркестраторам автоматически проверять состояние контейнера.'
    }
  ]
}
