export default {
  id: 64,
  title: 'CI/CD для Go',
  description: 'Автоматизация разработки Go проектов: GitHub Actions, запуск тестов и линтеров в CI, сборка и публикация артефактов, автоматические релизы и Makefile.',
  lessons: [
    {
      id: 1,
      title: 'GitHub Actions для Go',
      type: 'theory',
      content: [
        { type: 'text', value: 'CI/CD (Continuous Integration/Continuous Deployment) — это автоматизация процессов разработки. Представьте конвейер на заводе: каждое изменение в коде автоматически проверяется, тестируется и разворачивается без ручного вмешательства.' },
        { type: 'heading', value: 'Базовый workflow для Go' },
        { type: 'code', language: 'go', value: '# .github/workflows/ci.yml\n\nname: CI\n\n# Триггеры запуска\non:\n  push:\n    branches: [ main, develop ]\n  pull_request:\n    branches: [ main ]\n\n# Переменные окружения для всех jobs\nenv:\n  GO_VERSION: "1.22"\n\njobs:\n  # Job для тестирования\n  test:\n    name: Test\n    runs-on: ubuntu-latest\n\n    steps:\n      # 1. Получаем код\n      - name: Checkout code\n        uses: actions/checkout@v4\n\n      # 2. Устанавливаем Go\n      - name: Setup Go\n        uses: actions/setup-go@v5\n        with:\n          go-version: ${{ env.GO_VERSION }}\n          cache: true  # кешируем go modules\n\n      # 3. Скачиваем зависимости\n      - name: Download dependencies\n        run: go mod download\n\n      # 4. Проверяем что go.sum актуален\n      - name: Verify dependencies\n        run: go mod verify\n\n      # 5. Запускаем тесты\n      - name: Run tests\n        run: go test -v -race -coverprofile=coverage.out ./...\n\n      # 6. Показываем покрытие\n      - name: Show coverage\n        run: go tool cover -func=coverage.out\n\n      # 7. Загружаем артефакт\n      - name: Upload coverage\n        uses: actions/upload-artifact@v4\n        with:\n          name: coverage-report\n          path: coverage.out' },
        { type: 'tip', value: 'Используйте cache: true в actions/setup-go@v5 — это кеширует загруженные модули между запусками и ускоряет CI в 2-3 раза. GitHub Actions бесплатен для публичных репозиториев.' }
      ]
    },
    {
      id: 2,
      title: 'Тестирование в CI',
      type: 'theory',
      content: [
        { type: 'text', value: 'В CI важно запускать тесты правильно: с флагом -race для обнаружения гонок, с timeout для предотвращения зависаний, и с покрытием кода для контроля качества.' },
        { type: 'heading', value: 'Расширенная конфигурация тестов' },
        { type: 'code', language: 'go', value: '# .github/workflows/test.yml\n\njobs:\n  test:\n    strategy:\n      matrix:\n        # Тестируем на нескольких версиях Go\n        go-version: ["1.21", "1.22"]\n        os: [ubuntu-latest, windows-latest, macos-latest]\n\n    runs-on: ${{ matrix.os }}\n\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-go@v5\n        with:\n          go-version: ${{ matrix.go-version }}\n\n      # Интеграционные тесты с базой данных\n      - name: Start PostgreSQL\n        if: runner.os == "Linux"\n        run: |\n          docker run -d \\\n            --name postgres \\\n            -e POSTGRES_PASSWORD=testpass \\\n            -e POSTGRES_DB=testdb \\\n            -p 5432:5432 \\\n            postgres:16-alpine\n          # Ждём запуска\n          sleep 5\n\n      - name: Run unit tests\n        run: go test -v -short -race ./...\n\n      - name: Run integration tests\n        if: runner.os == "Linux"\n        env:\n          DATABASE_URL: postgres://postgres:testpass@localhost:5432/testdb?sslmode=disable\n        run: go test -v -race -run Integration ./...\n\n      # Загружаем покрытие в Codecov\n      - name: Upload to Codecov\n        if: matrix.go-version == "1.22" && matrix.os == "ubuntu-latest"\n        uses: codecov/codecov-action@v4\n        with:\n          file: ./coverage.out\n          fail_ci_if_error: true' },
        { type: 'heading', value: 'Теги для разделения тестов' },
        { type: 'code', language: 'go', value: '// В Go можно разделять тесты через build tags\n\n// unit_test.go — обычный тест\npackage service_test\n\nimport "testing"\n\nfunc TestCalculate(t *testing.T) {\n    // Быстрый unit тест\n}\n\n// integration_test.go — интеграционный тест\n//go:build integration\n\npackage service_test\n\nimport (\n    "database/sql"\n    "os"\n    "testing"\n)\n\nfunc TestIntegrationWithDB(t *testing.T) {\n    dbURL := os.Getenv("DATABASE_URL")\n    if dbURL == "" {\n        t.Skip("DATABASE_URL не задан, пропускаем интеграционный тест")\n    }\n\n    db, err := sql.Open("postgres", dbURL)\n    if err != nil {\n        t.Fatal(err)\n    }\n    defer db.Close()\n\n    // тест с реальной БД\n    if err := db.Ping(); err != nil {\n        t.Fatal("БД недоступна:", err)\n    }\n}\n\n// Запуск:\n// go test ./...                        - только unit тесты\n// go test -tags=integration ./...      - unit + integration\n// go test -short ./...                 - пропускаем медленные' }
      ]
    },
    {
      id: 3,
      title: 'Линтинг в CI',
      type: 'theory',
      content: [
        { type: 'text', value: 'Линтеры проверяют код на типичные ошибки, стиль и потенциальные проблемы. golangci-lint — это агрегатор, запускающий десятки линтеров одновременно. Как корректор в издательстве: проверяет не содержание, а форму.' },
        { type: 'heading', value: 'golangci-lint в CI' },
        { type: 'code', language: 'go', value: '# .github/workflows/lint.yml\n\njobs:\n  lint:\n    name: Lint\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-go@v5\n        with:\n          go-version: "1.22"\n          cache: false  # golangci-lint имеет свой кеш\n\n      # golangci-lint action использует официальный installer\n      - name: golangci-lint\n        uses: golangci/golangci-lint-action@v6\n        with:\n          version: latest\n          # Опционально: загружаем конфиг из файла\n          # args: --config .golangci.yml\n\n# .golangci.yml — конфигурация линтеров\n# linters:\n#   enable:\n#     - errcheck     # проверка необработанных ошибок\n#     - gosimple     # упрощение кода\n#     - govet        # подозрительные конструкции\n#     - ineffassign  # неэффективные присвоения\n#     - staticcheck  # статический анализ\n#     - unused       # неиспользуемый код\n#     - gofmt        # форматирование\n#     - goimports    # правильные импорты\n#     - misspell     # опечатки в комментариях\n#\n# linters-settings:\n#   errcheck:\n#     check-type-assertions: true\n#\n# issues:\n#   exclude-rules:\n#     - path: "_test.go"\n#       linters:\n#         - errcheck  # в тестах можно игнорировать ошибки' },
        { type: 'code', language: 'go', value: '// Запуск линтеров локально\n// go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest\n// golangci-lint run\n// golangci-lint run --fix  // автоисправление\n\n// Встроенные инструменты:\n// go vet ./...           - встроенный анализатор\n// gofmt -l .            - проверка форматирования\n// goimports -l .        - проверка импортов\n// staticcheck ./...     - статический анализ\n\n// Пример кода с ошибками для линтера:\npackage main\n\nimport (\n    "fmt"\n    "os"\n)\n\nfunc badCode() {\n    // errcheck: игнорирование ошибки\n    os.Remove("file.txt") // линтер это поймает!\n\n    // неиспользуемая переменная (компилятор поймает)\n    // x := 5\n\n    // потенциальная ошибка типа (govet поймает)\n    var x interface{} = "hello"\n    y := x.(int) // паника в runtime!\n    fmt.Println(y)\n}\n\nfunc goodCode() error {\n    // Правильный стиль\n    if err := os.Remove("file.txt"); err != nil {\n        return fmt.Errorf("удаление файла: %w", err)\n    }\n    return nil\n}' }
      ]
    },
    {
      id: 4,
      title: 'Сборка и публикация артефактов',
      type: 'theory',
      content: [
        { type: 'text', value: 'После прохождения тестов CI должен собрать готовые к deploy артефакты: бинарники или Docker образы. Это как продукт с конвейера — проверен и готов к отправке.' },
        { type: 'heading', value: 'Сборка бинарников и Docker образов' },
        { type: 'code', language: 'go', value: '# .github/workflows/build.yml\n\njobs:\n  build:\n    runs-on: ubuntu-latest\n    needs: [test, lint]  # запускаем после тестов и линтинга\n\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-go@v5\n        with:\n          go-version: "1.22"\n\n      # Сборка бинарника\n      - name: Build binary\n        run: |\n          CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \\\n            -ldflags="-w -s -X main.version=${{ github.sha }}" \\\n            -o bin/server-linux-amd64 ./cmd/server\n\n      # Сборка для нескольких платформ\n      - name: Build for multiple platforms\n        run: |\n          for os in linux darwin windows; do\n            for arch in amd64 arm64; do\n              ext=""\n              if [ "$os" = "windows" ]; then ext=".exe"; fi\n              GOOS=$os GOARCH=$arch CGO_ENABLED=0 \\\n                go build -ldflags="-w -s" \\\n                -o bin/server-$os-$arch$ext ./cmd/server\n            done\n          done\n\n      # Логин в Docker Hub или GHCR\n      - name: Login to GitHub Container Registry\n        uses: docker/login-action@v3\n        with:\n          registry: ghcr.io\n          username: ${{ github.actor }}\n          password: ${{ secrets.GITHUB_TOKEN }}\n\n      # Сборка и push Docker образа\n      - name: Build and push Docker image\n        uses: docker/build-push-action@v5\n        with:\n          context: .\n          push: ${{ github.ref == "refs/heads/main" }}\n          tags: |\n            ghcr.io/${{ github.repository }}:latest\n            ghcr.io/${{ github.repository }}:${{ github.sha }}\n          cache-from: type=gha\n          cache-to: type=gha,mode=max' },
        { type: 'heading', value: 'Версионирование через ldflags' },
        { type: 'code', language: 'go', value: '// cmd/server/main.go\npackage main\n\nimport "fmt"\n\n// Эти переменные заполняются при сборке через -ldflags\nvar (\n    version   = "dev"    // go build -ldflags="-X main.version=1.2.3"\n    buildTime = "unknown"\n    gitCommit = "unknown"\n)\n\nfunc main() {\n    fmt.Printf("Версия: %s\\n", version)\n    fmt.Printf("Собрано: %s\\n", buildTime)\n    fmt.Printf("Коммит: %s\\n", gitCommit)\n}\n\n// Сборка с информацией о версии:\n// go build \\\n//   -ldflags="-X main.version=1.2.3 \\\n//             -X main.buildTime=$(date -u +%Y-%m-%dT%H:%M:%SZ) \\\n//             -X main.gitCommit=$(git rev-parse --short HEAD)" \\\n//   ./cmd/server\n\n// В CI (GitHub Actions):\n// go build \\\n//   -ldflags="-X main.version=${{ github.ref_name }} \\\n//             -X main.gitCommit=${{ github.sha }}" \\\n//   ./cmd/server' }
      ]
    },
    {
      id: 5,
      title: 'Автоматические релизы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Автоматические релизы создают GitHub Release при создании тега версии. Это как автомат по розливу: нажал кнопку (создал тег v1.2.3) — получил готовый пакет со всеми артефактами.' },
        { type: 'heading', value: 'Workflow для релизов' },
        { type: 'code', language: 'go', value: '# .github/workflows/release.yml\n\nname: Release\n\non:\n  push:\n    tags:\n      - "v*"  # Триггер: git tag v1.0.0 && git push --tags\n\npermissions:\n  contents: write\n\njobs:\n  release:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n        with:\n          fetch-depth: 0  # нужно для changelog\n\n      - uses: actions/setup-go@v5\n        with:\n          go-version: "1.22"\n\n      # GoReleaser — инструмент для автоматических релизов\n      - name: Run GoReleaser\n        uses: goreleaser/goreleaser-action@v5\n        with:\n          distribution: goreleaser\n          version: latest\n          args: release --clean\n        env:\n          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n\n# .goreleaser.yml\n# before:\n#   hooks:\n#     - go mod tidy\n#     - go generate ./...\n#\n# builds:\n#   - id: server\n#     binary: server\n#     env:\n#       - CGO_ENABLED=0\n#     goos:\n#       - linux\n#       - darwin\n#       - windows\n#     goarch:\n#       - amd64\n#       - arm64\n#     ldflags:\n#       - -w -s\n#       - -X main.version={{.Version}}\n#       - -X main.buildTime={{.Date}}\n#       - -X main.gitCommit={{.Commit}}\n#\n# archives:\n#   - format: tar.gz\n#     format_overrides:\n#       - goos: windows\n#         format: zip\n#\n# changelog:\n#   sort: asc\n#   filters:\n#     exclude:\n#       - "^docs:"\n#       - "^test:"' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Makefile для Go проекта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай Makefile для автоматизации типичных задач Go проекта: сборка, тестирование, линтинг, запуск и очистка. Makefile должен работать как единая точка входа для всех команд.',
      requirements: [
        'Цель build: компиляция бинарника с ldflags версии',
        'Цель test: запуск тестов с покрытием (-race -coverprofile)',
        'Цель lint: запуск go vet и gofmt',
        'Цель run: запуск сервера локально',
        'Цель clean: удаление артефактов сборки',
        'Цель docker-build: сборка Docker образа',
        'Переменные: BINARY_NAME, VERSION, BUILD_DIR',
        'Цель help: вывод доступных команд'
      ],
      expectedOutput: '$ make help\nДоступные команды:\n  build       - собрать бинарник\n  test        - запустить тесты с покрытием\n  lint        - проверить код линтером\n  run         - запустить сервер\n  clean       - удалить артефакты\n  docker-build - собрать Docker образ\n\n$ make build\nСборка server v1.0.0...\n$ make test\nok github.com/myapp coverage: 85.5%',
      hint: 'В Makefile используй .PHONY для целей, которые не создают файлы. Переменные задаются как VAR = value или VAR := value. Команды в целях должны начинаться с TAB. Для вывода help используй grep по комментариям ##.',
      solution: '# Makefile\n\n# Переменные\nBINARY_NAME ?= server\nVERSION     ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")\nBUILD_DIR   := bin\nCMD_DIR     := ./cmd/server\n\n# Флаги сборки\nLDFLAGS := -ldflags="-w -s \\\n  -X main.version=$(VERSION) \\\n  -X main.buildTime=$(shell date -u +%Y-%m-%dT%H:%M:%SZ) \\\n  -X main.gitCommit=$(shell git rev-parse --short HEAD 2>/dev/null || echo unknown)"\n\nDOCKER_IMAGE ?= $(BINARY_NAME):$(VERSION)\n\n# Цвета для вывода\nGREEN  := \\033[0;32m\nYELLOW := \\033[0;33m\nRESET  := \\033[0m\n\n.PHONY: all build test lint run clean docker-build docker-run help\n\nall: lint test build ## Полная сборка: линтинг + тесты + компиляция\n\nbuild: ## Собрать бинарник\n\t@echo "$(GREEN)Сборка $(BINARY_NAME) v$(VERSION)...$(RESET)"\n\t@mkdir -p $(BUILD_DIR)\n\tCGO_ENABLED=0 go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME) $(CMD_DIR)\n\t@echo "$(GREEN)Готово: $(BUILD_DIR)/$(BINARY_NAME)$(RESET)"\n\ntest: ## Запустить тесты с покрытием\n\t@echo "$(YELLOW)Запуск тестов...$(RESET)"\n\tgo test -v -race -coverprofile=$(BUILD_DIR)/coverage.out ./...\n\tgo tool cover -func=$(BUILD_DIR)/coverage.out | tail -1\n\ntest-html: test ## Открыть HTML отчёт покрытия\n\tgo tool cover -html=$(BUILD_DIR)/coverage.out\n\nlint: ## Проверить код\n\t@echo "$(YELLOW)Линтинг...$(RESET)"\n\tgo vet ./...\n\t@test -z "$$(gofmt -l .)" || (echo "Нужен gofmt:" && gofmt -l . && exit 1)\n\nrun: ## Запустить сервер локально\n\t@echo "$(GREEN)Запуск $(BINARY_NAME)...$(RESET)"\n\tgo run $(CMD_DIR)\n\nclean: ## Удалить артефакты\n\t@echo "Очистка..."\n\trm -rf $(BUILD_DIR)\n\tdocker rmi $(DOCKER_IMAGE) 2>/dev/null || true\n\ndocker-build: ## Собрать Docker образ\n\t@echo "$(GREEN)Сборка Docker образа $(DOCKER_IMAGE)...$(RESET)"\n\tdocker build -t $(DOCKER_IMAGE) .\n\ndocker-run: docker-build ## Запустить в Docker\n\tdocker run -p 8080:8080 $(DOCKER_IMAGE)\n\nhelp: ## Показать список команд\n\t@echo "Доступные команды:"\n\t@grep -E "^[a-zA-Z_-]+:.*?## .*$$" $(MAKEFILE_LIST) | \\\n\t  awk "BEGIN {FS = \":.*?## \"}; {printf \\"  $(GREEN)%-15s$(RESET) %s\\\\n\\", $$1, $$2}"\n\n.DEFAULT_GOAL := help',
      explanation: 'Makefile — стандартный инструмент автоматизации в Unix системах. .PHONY объявляет цели, которые не создают файлы с тем же именем — без этого make может запутаться если существует файл с именем "build". Переменные с ?= устанавливаются только если не заданы извне: make build VERSION=2.0.0. Комментарии ## после цели используются для автогенерации help через grep/awk.'
    }
  ]
}
