export default {
  id: 56,
  title: 'Go Modules в деталях',
  description: 'Углублённое изучение системы модулей Go: синтаксис go.mod, семантическое версионирование, директивы replace и exclude, vendoring, приватные модули и прокси.',
  lessons: [
    {
      id: 1,
      title: 'Синтаксис go.mod',
      type: 'theory',
      content: [
        { type: 'text', value: 'go.mod — это паспорт вашего модуля. Он содержит имя модуля, минимальную версию Go и список всех прямых зависимостей. Думайте о нём как о списке ингредиентов для рецепта.' },
        { type: 'heading', value: 'Анатомия go.mod' },
        { type: 'code', language: 'go', value: '// go.mod — каждая строка имеет смысл\nmodule github.com/nurdaulet/myapp  // имя модуля (путь импорта)\n\ngo 1.22  // минимальная версия Go\n\n// require — прямые зависимости\nrequire (\n    github.com/gin-gonic/gin v1.9.1            // прямая зависимость\n    github.com/go-chi/chi/v5 v5.0.11           // прямая зависимость\n    gorm.io/gorm v1.25.5                       // прямая зависимость\n    gorm.io/driver/postgres v1.5.4             // прямая зависимость\n\n    // Косвенные зависимости (зависимости зависимостей)\n    github.com/jinzhu/inflection v1.0.0 // indirect\n    google.golang.org/protobuf v1.31.0  // indirect\n)\n\n// replace — заменяем зависимость (локальная разработка или форк)\nreplace github.com/some/library => ../local-library\nreplace github.com/buggy/pkg v1.0.0 => github.com/myfork/pkg v1.0.0-fixed\n\n// exclude — исключаем конкретную версию (уязвимость или баг)\nexclude github.com/vuln/pkg v1.2.3\n\n// retract — помечаем версии модуля как отозванные (для авторов библиотек)\nretract v1.0.1  // причина: критический баг в API' },
        { type: 'heading', value: 'go.sum — файл контрольных сумм' },
        { type: 'code', language: 'go', value: '// go.sum содержит криптографические хеши всех зависимостей\n// Это защита от атак на цепочку поставок\n//\n// Формат:\n// <module> <version> <hash>\n// <module> <version>/go.mod <hash>\n//\n// Пример:\n// github.com/go-chi/chi/v5 v5.0.11 h1:BnpYbFZ3T3S1WMpD79r7R5ThWX40TaFB7L31Y8xqSwA=\n// github.com/go-chi/chi/v5 v5.0.11/go.mod h1:mDTs6UXnXcjz87YFzJV5mHHyXmqoLBRNeTufZOF0Y0w=\n//\n// go.sum НЕЛЬЗЯ редактировать вручную — только через go команды\n// go.sum НУЖНО коммитить в git!\n//\n// Проверить суммы:\n// go mod verify  -> проверяет что скачанные модули совпадают с go.sum\n\n// Команды управления модулями:\n// go mod init github.com/user/repo  -> создать go.mod\n// go mod tidy                       -> удалить лишние, добавить нужные зависимости\n// go mod download                   -> скачать все зависимости в кеш\n// go mod verify                     -> проверить контрольные суммы\n// go mod graph                      -> граф зависимостей\n// go mod why github.com/some/pkg    -> почему эта зависимость нужна\n// go list -m all                    -> все зависимости\n// go get github.com/some/pkg@v1.2.3 -> добавить/обновить зависимость' },
        { type: 'note', value: 'go mod tidy — одна из самых важных команд. Она автоматически удаляет неиспользуемые зависимости и добавляет отсутствующие. Запускайте её после каждого добавления/удаления импортов.' }
      ]
    },
    {
      id: 2,
      title: 'Семантическое версионирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Go использует семантическое версионирование (semver): MAJOR.MINOR.PATCH. Это как версии телефонов: iPhone 15 (MAJOR изменился — несовместим) vs iOS 17.1 -> 17.2 (MINOR — новые функции, совместимо).' },
        { type: 'heading', value: 'Правила semver в Go' },
        { type: 'code', language: 'go', value: '// MAJOR.MINOR.PATCH\n// v1.2.3\n//  ^  ^  ^\n//  |  |  └── PATCH: исправление багов, обратно совместимо\n//  |  └───── MINOR: новые возможности, обратно совместимо\n//  └──────── MAJOR: несовместимые изменения API\n\n// ВАЖНОЕ ПРАВИЛО GO: v2+ требует другого пути импорта!\n//\n// v1.x.x: github.com/user/mylib\n// v2.x.x: github.com/user/mylib/v2\n// v3.x.x: github.com/user/mylib/v3\n//\n// Это называется "major version suffix"\n// Позволяет использовать v1 и v2 одновременно!\n\n// go.mod для библиотеки v2:\n// module github.com/user/mylib/v2\n\n// Импорт v2:\n// import "github.com/user/mylib/v2"\n\n// Псевдо-версии (когда нет тегов):\n// v0.0.0-20240101120000-abcdef123456\n// Формат: vX.Y.Z-YYYYMMDDHHMMSS-COMMIT_HASH\n//\n// Специальные версии:\n// go get github.com/pkg@latest         -> последняя стабильная\n// go get github.com/pkg@master         -> последний коммит ветки\n// go get github.com/pkg@v1.2.3        -> конкретная версия\n// go get github.com/pkg@>=v1.2        -> минимальная версия (не работает так)\n\npackage main\n\nimport (\n    "fmt"\n    // Используем chi v5 (major version = 5, путь содержит /v5)\n    "github.com/go-chi/chi/v5"\n    // Теоретически можно одновременно использовать и v4:\n    // chiv4 "github.com/go-chi/chi"\n)\n\nfunc main() {\n    r := chi.NewRouter()\n    fmt.Printf("chi router: %T\\n", r)\n}' },
        { type: 'heading', value: 'Минимальная версия vs максимальная' },
        { type: 'code', language: 'go', value: '// Go использует MVS — Minimum Version Selection (минимальный выбор версий)\n//\n// Ваш проект требует:\n//   gin >= v1.9.0\n//   lib A, которая требует gin >= v1.8.0\n//   lib B, которая требует gin >= v1.9.1\n//\n// Go выберет: gin v1.9.1 (максимум из минимальных требований)\n// Это детерминированно и воспроизводимо!\n//\n// Pip (Python) и npm (Node.js) используют "наибольшую совместимую" —\n// это может привести к разным версиям у разных разработчиков\n\n// Обновление зависимостей:\n// go get -u                      -> обновить все зависимости до последних minor/patch\n// go get -u=patch               -> только patch обновления\n// go get github.com/pkg@latest  -> обновить конкретный пакет\n//\n// После go get всегда запускайте:\n// go mod tidy' }
      ]
    },
    {
      id: 3,
      title: 'replace и exclude директивы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Директива replace позволяет заменить зависимость — например, использовать локальную версию или форк. exclude исключает конкретную версию с уязвимостью.' },
        { type: 'heading', value: 'replace — локальная разработка' },
        { type: 'code', language: 'go', value: '// Сценарий 1: Разрабатываете две связанных библиотеки одновременно\n//\n// Структура:\n// workspace/\n// ├── myapp/        <- ваше приложение\n// │   └── go.mod   <- module github.com/you/myapp\n// └── mylib/        <- ваша библиотека (ещё не опубликована)\n//     └── go.mod   <- module github.com/you/mylib\n//\n// В myapp/go.mod:\n// module github.com/you/myapp\n// require github.com/you/mylib v0.0.0\n// replace github.com/you/mylib => ../mylib\n//\n// ВАЖНО: replace с относительным путём НЕ наследуется!\n// Если кто-то использует myapp как библиотеку, replace не применяется.\n\n// Сценарий 2: Форк с исправлением бага\n// require github.com/buggy/pkg v1.3.0\n// replace github.com/buggy/pkg v1.3.0 => github.com/yourfork/pkg v1.3.0-fix\n\n// Сценарий 3: Замена на локальный путь навсегда (для тестирования)\n// replace github.com/external/pkg => ./internal/mock-pkg\n\n// Go Workspaces (Go 1.18+) — альтернатива replace для монорепо:\n// go work init\n// go work use ./myapp ./mylib\n//\n// Создаёт go.work:\n// go 1.22\n// use (\n//   ./myapp\n//   ./mylib\n// )\n// Не требует изменения go.mod!' },
        { type: 'heading', value: 'exclude и retract' },
        { type: 'code', language: 'go', value: '// exclude — исключить уязвимую или сломанную версию\n// Если ваш граф зависимостей пытается использовать эту версию — Go заменит её следующей\n//\n// go.mod:\n// require github.com/vuln/pkg v1.5.0  // эта будет использована\n// exclude github.com/vuln/pkg v1.4.0  // эту игнорируем (CVE-2024-1234)\n// exclude github.com/vuln/pkg v1.4.1  // и эту тоже\n\n// Проверка уязвимостей в зависимостях:\n// go install golang.org/x/vuln/cmd/govulncheck@latest\n// govulncheck ./...\n// Покажет: какие зависимости имеют CVE и каков риск\n\n// Обновление уязвимой зависимости:\n// go get github.com/vuln/pkg@latest\n// go mod tidy\n\npackage main\n\nimport "fmt"\n\nfunc main() {\n    // go mod graph показывает дерево зависимостей\n    // go mod why github.com/pkg/errors показывает ПОЧЕМУ пакет нужен\n    fmt.Println("Управление зависимостями в Go")\n}' }
      ]
    },
    {
      id: 4,
      title: 'Vendoring',
      type: 'theory',
      content: [
        { type: 'text', value: 'Vendoring — это хранение всех зависимостей прямо в репозитории в папке vendor/. Как упаковать все нужные инструменты в чемодан перед путешествием — чтобы не зависеть от интернета.' },
        { type: 'heading', value: 'Команды vendor' },
        { type: 'code', language: 'go', value: '// Создание vendor директории:\n// go mod vendor\n//\n// Создаётся структура:\n// vendor/\n// ├── modules.txt          <- метаданные\n// ├── github.com/\n// │   ├── go-chi/\n// │   │   └── chi/\n// │   │       └── v5/     <- исходный код зависимости\n// │   └── gorilla/\n// │       └── websocket/\n// └── gorm.io/\n//     └── gorm/\n\n// Сборка с использованием vendor (игнорирует кеш модулей):\n// go build -mod=vendor ./...\n// go test -mod=vendor ./...\n\n// Проверка что vendor актуален:\n// go mod verify\n\n// Почему использовать vendor?\n// 1. Полная воспроизводимость (без доступа к интернету)\n// 2. Ускорение CI/CD (не нужно скачивать зависимости)\n// 3. Защита от исчезновения пакета (pkg.go.dev может пропасть)\n// 4. Ревью изменений в зависимостях в PR\n//\n// Почему НЕ использовать vendor?\n// 1. Репозиторий становится большим\n// 2. PR с обновлением зависимости включает тысячи строк diff\n// 3. GOPATH-кеш и Go modules proxy решают большинство проблем\n\n// GOFLAGS для автоматического использования vendor:\n// export GOFLAGS=-mod=vendor\n// или в go.mod:\n// go 1.22\n// (vendor используется автоматически если папка vendor/ существует)\n\npackage main\n\nimport (\n    "fmt"\n    "os"\n)\n\nfunc main() {\n    // Проверить используется ли vendor\n    if _, err := os.Stat("vendor"); err == nil {\n        fmt.Println("vendor/ папка существует")\n    }\n    fmt.Println("Запустите: go mod vendor")\n}' },
        { type: 'tip', value: 'В Docker-образах вместо vendor рекомендуется использовать многоэтапную сборку: сначала скачать зависимости в отдельном слое (кешируется), потом собрать код. Это быстрее, чем копировать vendor в образ.' }
      ]
    },
    {
      id: 5,
      title: 'Приватные модули и прокси',
      type: 'theory',
      content: [
        { type: 'text', value: 'Go по умолчанию загружает модули через proxy.golang.org. Для приватных репозиториев нужна настройка: либо отключить прокси для конкретных доменов, либо поднять свой прокси.' },
        { type: 'heading', value: 'Настройка для приватных репозиториев' },
        { type: 'code', language: 'go', value: '// Переменные окружения для настройки модулей:\n\n// GOPROXY — цепочка прокси (разделённые запятой)\n// go env GOPROXY\n// > https://proxy.golang.org,direct\n// Означает: сначала proxy.golang.org, если недоступен — напрямую\n\n// Для приватных репозиториев:\n// export GOPROXY=https://goproxy.company.com,https://proxy.golang.org,direct\n\n// GONOSUMCHECK — не проверять checksum для этих модулей\n// export GONOSUMCHECK=gitlab.company.com/*\n\n// GOPRIVATE — приватные модули (не через прокси и без checksum)\n// export GOPRIVATE=gitlab.company.com,github.com/mycompany\n// Сокращение для GONOSUMCHECK + GONOPROXY\n\n// GONOSUMDB — не проверять в sum database (аналог GONOPROXY для сумм)\n// export GONOSUMDB=gitlab.company.com/*\n\n// Пример настройки для корпоративного GitLab:\n// export GOPRIVATE=gitlab.company.com\n// export GOFLAGS=-mod=mod\n// Настройка аутентификации в ~/.netrc:\n// machine gitlab.company.com login GITLAB_USER password GITLAB_TOKEN\n// или через git:\n// git config --global url."https://oauth2:TOKEN@gitlab.company.com/".insteadOf "https://gitlab.company.com/"\n\n// Свой прокси модулей (Athens):\n// docker run -d -p 3000:3000 gomods/athens:latest\n// export GOPROXY=http://localhost:3000\n\n// GOPROXY=off — запретить загрузку (только кеш/vendor)\n// GOPROXY=direct — загружать напрямую без прокси\n\npackage main\n\nimport (\n    "fmt"\n    "os/exec"\n)\n\nfunc printGoEnv() {\n    for _, env := range []string{"GOPROXY", "GOPRIVATE", "GOPATH", "GOMODCACHE"} {\n        out, _ := exec.Command("go", "env", env).Output()\n        fmt.Printf("%s=%s", env, out)\n    }\n}\n\nfunc main() {\n    printGoEnv()\n}' },
        { type: 'note', value: 'GOMODCACHE — папка где хранится кеш скачанных модулей (по умолчанию ~/go/pkg/mod). Если несколько проектов используют одну и ту же версию пакета — скачивается один раз.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: управление зависимостями',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай Go модуль с несколькими зависимостями, напиши go.mod вручную, разберись с replace для локальной библиотеки и настрой сборку с vendor.',
      requirements: [
        'Создай модуль myapp с go mod init',
        'Добавь зависимость github.com/fatih/color для цветного вывода',
        'Создай локальный модуль myutils с функцией Greet(name string) string',
        'В go.mod myapp добавь replace для myutils на локальный путь',
        'Напиши main.go: использует color.Green для вывода Greet("Нурдаулет")',
        'Запусти go mod tidy для очистки зависимостей',
        'Создай vendor: go mod vendor',
        'Собери и запусти с -mod=vendor',
        'Выведи статистику: go list -m all | wc -l (количество зависимостей)'
      ],
      expectedOutput: 'Привет, Нурдаулет! (зелёным цветом в терминале)\nКоличество зависимостей: N модулей',
      hint: 'myutils/go.mod: module myutils. В go.mod myapp: require myutils v0.0.0 и replace myutils => ../myutils. go mod tidy обновит go.sum автоматически.',
      solution: '// === myutils/go.mod ===\n// module myutils\n// go 1.22\n\n// === myutils/greet.go ===\n// package myutils\n// import "fmt"\n// func Greet(name string) string {\n//     return fmt.Sprintf("Привет, %s!", name)\n// }\n\n// === myapp/go.mod (после go get github.com/fatih/color) ===\n// module myapp\n// go 1.22\n// require (\n//     github.com/fatih/color v1.16.0\n//     myutils v0.0.0\n// )\n// replace myutils => ../myutils\n\n// === myapp/main.go ===\npackage main\n\nimport (\n    "fmt"\n    "os/exec"\n    "strings"\n\n    "github.com/fatih/color"\n    "myutils"\n)\n\nfunc main() {\n    greeting := myutils.Greet("Нурдаулет")\n    color.Green(greeting)\n\n    // Подсчёт зависимостей\n    out, err := exec.Command("go", "list", "-m", "all").Output()\n    if err != nil {\n        fmt.Println("Ошибка подсчёта зависимостей")\n        return\n    }\n    lines := strings.Split(strings.TrimSpace(string(out)), "\\n")\n    fmt.Printf("Количество зависимостей: %d модулей\\n", len(lines))\n}\n\n// Команды для запуска:\n// mkdir -p workspace/myutils workspace/myapp\n// cd workspace/myutils && go mod init myutils\n// (создать greet.go)\n// cd ../myapp && go mod init myapp\n// go get github.com/fatih/color\n// (добавить replace в go.mod)\n// go mod tidy\n// go mod vendor\n// go run -mod=vendor main.go',
      explanation: 'replace позволяет подключить незапущенный модуль из локальной файловой системы — идеально для разработки связанных модулей. go mod tidy анализирует импорты в коде и обновляет go.mod/go.sum. vendor сохраняет точные версии зависимостей в репозитории для воспроизводимой сборки без интернета.'
    }
  ]
}
