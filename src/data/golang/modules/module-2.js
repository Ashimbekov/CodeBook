export default {
  id: 2,
  title: 'Установка и первая программа',
  description: 'Устанавливаем Go, настраиваем рабочее окружение, разбираемся с GOPATH и модулями, пишем первую программу Hello World.',
  lessons: [
    {
      id: 1,
      title: 'Установка Go',
      content: [
        {
          type: 'heading',
          value: 'Как установить Go?'
        },
        {
          type: 'text',
          value: 'Установить Go очень просто. Официальный установщик доступен на сайте go.dev/dl/ для всех операционных систем. Go не требует сложной настройки — скачал, установил, работаешь.'
        },
        {
          type: 'heading',
          value: 'Установка на Linux'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Команды в терминале (не Go-код):\n// 1. Скачать архив:\n// wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz\n\n// 2. Распаковать в /usr/local:\n// sudo tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz\n\n// 3. Добавить в PATH (в ~/.bashrc или ~/.zshrc):\n// export PATH=$PATH:/usr/local/go/bin\n\n// 4. Проверить установку:\n// go version\n// Вывод: go version go1.21.0 linux/amd64'
        },
        {
          type: 'heading',
          value: 'Установка на macOS'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Вариант 1: Homebrew\n// brew install go\n\n// Вариант 2: Официальный установщик\n// Скачать .pkg файл с go.dev/dl/ и запустить\n\n// Проверка:\n// go version'
        },
        {
          type: 'heading',
          value: 'Установка на Windows'
        },
        {
          type: 'text',
          value: 'На Windows скачайте .msi файл с go.dev/dl/ и запустите установщик. Он автоматически настроит PATH. После установки откройте новый терминал и проверьте: go version.'
        },
        {
          type: 'tip',
          value: 'После установки выполните команду "go version" в терминале. Если видите версию Go — установка прошла успешно!'
        }
      ]
    },
    {
      id: 2,
      title: 'GOPATH и GOROOT',
      content: [
        {
          type: 'heading',
          value: 'Что такое GOROOT?'
        },
        {
          type: 'text',
          value: 'GOROOT — это директория, куда установлен Go. Там находятся компилятор, стандартная библиотека и инструменты. Вам обычно не нужно её трогать — Go сам находит её при установке.'
        },
        {
          type: 'text',
          value: 'Аналогия: GOROOT — это как папка "Program Files" для Go. Там живёт сам инструмент.'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Посмотреть GOROOT:\n// go env GOROOT\n// Обычно: /usr/local/go (Linux/Mac) или C:\\Go (Windows)'
        },
        {
          type: 'heading',
          value: 'Что такое GOPATH?'
        },
        {
          type: 'text',
          value: 'GOPATH — это рабочая директория для ваших Go-проектов и скачанных пакетов. По умолчанию это ~/go (домашняя папка пользователя + /go). Внутри GOPATH три поддиректории: src (исходники), pkg (скомпилированные пакеты), bin (исполняемые файлы).'
        },
        {
          type: 'text',
          value: 'Аналогия: GOPATH — это ваш рабочий стол, где лежат ваши проекты. GOROOT — это сам инструментарий (молоток, отвёртки).'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Посмотреть GOPATH:\n// go env GOPATH\n// Обычно: /home/username/go (Linux) или C:\\Users\\username\\go (Windows)\n\n// Структура GOPATH:\n// ~/go/\n//   src/     - исходный код проектов (устаревший подход)\n//   pkg/     - кешированные пакеты\n//   bin/     - скомпилированные программы'
        },
        {
          type: 'note',
          value: 'С появлением Go Modules (Go 1.11+) вы больше не обязаны хранить проекты в GOPATH/src. Можно создавать проекты в любом месте файловой системы. GOPATH используется в основном для хранения кеша пакетов.'
        }
      ]
    },
    {
      id: 3,
      title: 'Go модули: go mod init',
      content: [
        {
          type: 'heading',
          value: 'Что такое Go модули?'
        },
        {
          type: 'text',
          value: 'Go модули — это система управления зависимостями, введённая в Go 1.11. Модуль — это набор связанных Go-пакетов, которые версионируются вместе. Каждый проект начинается с инициализации модуля.'
        },
        {
          type: 'text',
          value: 'Аналогия: Модуль — это как package.json в Node.js или requirements.txt в Python. Он описывает ваш проект и его зависимости.'
        },
        {
          type: 'heading',
          value: 'Создание нового модуля'
        },
        {
          type: 'code',
          language: 'go',
          value: '// 1. Создать папку для проекта:\n// mkdir my-first-go-project\n// cd my-first-go-project\n\n// 2. Инициализировать модуль:\n// go mod init my-first-go-project\n// или с полным путём (для публичных пакетов):\n// go mod init github.com/username/my-project\n\n// После этого создаётся файл go.mod:'
        },
        {
          type: 'heading',
          value: 'Файл go.mod'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Содержимое файла go.mod:\nmodule my-first-go-project\n\ngo 1.21\n\n// После добавления зависимостей появится секция require:\n// require (\n//     github.com/gin-gonic/gin v1.9.1\n// )'
        },
        {
          type: 'heading',
          value: 'Файл go.sum'
        },
        {
          type: 'text',
          value: 'При добавлении зависимостей автоматически создаётся файл go.sum. Он содержит контрольные суммы для проверки целостности загруженных пакетов. Не редактируйте этот файл вручную.'
        },
        {
          type: 'tip',
          value: 'Всегда начинайте новый Go-проект с команды "go mod init". Это первый шаг для любого проекта на Go.'
        }
      ]
    },
    {
      id: 4,
      title: 'Hello World',
      content: [
        {
          type: 'heading',
          value: 'Первая программа на Go'
        },
        {
          type: 'text',
          value: 'По традиции программирования, первая программа выводит "Hello, World!". Давайте разберём каждую строку этой программы — в ней скрыто много важного о Go.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}'
        },
        {
          type: 'heading',
          value: 'Разбор программы по строкам'
        },
        {
          type: 'text',
          value: 'Строка 1: package main — объявление пакета. В Go каждый файл принадлежит пакету. Пакет main — особенный: программы с этим пакетом можно запускать. Другие пакеты — это библиотеки.'
        },
        {
          type: 'text',
          value: 'Строка 3: import "fmt" — подключаем пакет fmt (сокращение от "format"). Этот пакет из стандартной библиотеки предоставляет функции для ввода-вывода. В Go нельзя импортировать пакет и не использовать его — это ошибка компиляции!'
        },
        {
          type: 'text',
          value: 'Строка 5: func main() — объявление функции. main — это точка входа программы. Когда вы запускаете программу, Go ищет и вызывает именно эту функцию. Фигурные скобки { } обязательны, и открывающая скобка должна быть на той же строке.'
        },
        {
          type: 'text',
          value: 'Строка 6: fmt.Println("Hello, World!") — вызов функции Println из пакета fmt. Println выводит текст с переносом строки в конце. Строки в Go заключаются в двойные кавычки.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc main() {\n    // Более развёрнутый Hello World\n    fmt.Println("Hello, World!")\n    fmt.Println("Текущий год:", time.Now().Year())\n    fmt.Printf("Язык: %s, версия: %d\\n", "Go", 1)\n}'
        },
        {
          type: 'note',
          value: 'В Go форматирование кода стандартизировано инструментом gofmt. Всегда используйте табуляцию для отступов (не пробелы), хотя gofmt сделает это автоматически.'
        }
      ]
    },
    {
      id: 5,
      title: 'go run и go build',
      content: [
        {
          type: 'heading',
          value: 'Два способа запустить программу'
        },
        {
          type: 'text',
          value: 'В Go есть два основных способа запустить программу: go run (для разработки) и go build (для продакшена). Понимание разницы важно для работы с Go.'
        },
        {
          type: 'heading',
          value: 'go run — быстрый запуск'
        },
        {
          type: 'text',
          value: 'Команда go run компилирует и немедленно запускает программу. Она НЕ создаёт исполняемый файл на диске. Идеально для разработки и экспериментов.'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Запуск одного файла:\n// go run main.go\n\n// Запуск нескольких файлов:\n// go run main.go helper.go\n\n// Запуск всех файлов в директории:\n// go run .\n\n// Пример вывода:\n// Hello, World!'
        },
        {
          type: 'heading',
          value: 'go build — компиляция в файл'
        },
        {
          type: 'text',
          value: 'Команда go build компилирует программу и создаёт исполняемый файл. Этот файл можно запускать без установленного Go и распространять другим пользователям.'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Компиляция текущего проекта:\n// go build\n// Создаёт файл с именем директории (или модуля)\n\n// Компиляция с указанием имени файла:\n// go build -o myapp main.go\n// Создаёт файл myapp (или myapp.exe на Windows)\n\n// Запуск скомпилированного файла:\n// ./myapp          (Linux/Mac)\n// .\\myapp.exe      (Windows)'
        },
        {
          type: 'heading',
          value: 'go install — установка программы'
        },
        {
          type: 'text',
          value: 'Команда go install компилирует и помещает исполняемый файл в $GOPATH/bin. Если эта директория в PATH, программу можно запускать из любого места.'
        },
        {
          type: 'tip',
          value: 'Правило простое: используйте go run во время разработки и тестирования. Используйте go build для создания финального исполняемого файла.'
        }
      ]
    },
    {
      id: 6,
      title: 'Настройка IDE',
      content: [
        {
          type: 'heading',
          value: 'Выбор среды разработки'
        },
        {
          type: 'text',
          value: 'Хорошая IDE значительно ускоряет разработку. Для Go есть несколько отличных вариантов. Самые популярные: VS Code с расширением Go и GoLand от JetBrains.'
        },
        {
          type: 'heading',
          value: 'VS Code + расширение Go (бесплатно)'
        },
        {
          type: 'text',
          value: 'VS Code — лёгкий редактор с мощным расширением Go. Расширение предоставляет: автодополнение кода, навигацию по коду, отладчик, автоматическое форматирование, проверку кода (linting).'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Установка расширения Go в VS Code:\n// 1. Открыть VS Code\n// 2. Нажать Ctrl+Shift+X (Extensions)\n// 3. Найти "Go" by Google\n// 4. Нажать Install\n// 5. Открыть любой .go файл\n// 6. VS Code предложит установить Go tools - согласитесь\n\n// Полезные команды VS Code для Go:\n// Ctrl+Shift+P -> "Go: Install/Update Tools" - установить инструменты\n// Alt+Shift+F - форматировать файл\n// F12 - перейти к определению\n// Ctrl+Shift+I - показать реализацию'
        },
        {
          type: 'heading',
          value: 'GoLand (платная, есть пробный период)'
        },
        {
          type: 'text',
          value: 'GoLand от JetBrains — профессиональная IDE специально для Go. Предоставляет более умное автодополнение, лучший рефакторинг, встроенный дебаггер. Рекомендуется для профессиональной разработки.'
        },
        {
          type: 'heading',
          value: 'Важные инструменты Go'
        },
        {
          type: 'list',
          value: 'gofmt — автоматическое форматирование кода (входит в стандартную установку)\ngoimports — автоматическое управление импортами\ngolangci-lint — статический анализатор кода\ngodoc — генерация документации\ndelve — отладчик для Go'
        },
        {
          type: 'note',
          value: 'Запустите "gofmt -w main.go" чтобы автоматически отформатировать ваш файл. В реальных проектах форматирование обычно делается автоматически при сохранении файла.'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Hello World и первый проект',
      type: 'practice',
      difficulty: 'beginner',
      description: 'Создайте свой первый Go-проект с модулем. Напишите программу, которая выводит информацию о вас и текущее время.',
      requirements: [
        'Инициализируйте Go-модуль с именем "hello-go"',
        'Создайте файл main.go',
        'Импортируйте пакеты "fmt" и "time"',
        'Выведите "Мой первый Go-проект!"',
        'Выведите текущий год в формате "Год: XXXX"',
        'Скомпилируйте программу командой go build'
      ],
      expectedOutput: 'Мой первый Go-проект!\nГод: 2024',
      hint: 'Используйте time.Now().Year() для получения текущего года. Функция fmt.Printf позволяет форматировать вывод: fmt.Printf("Год: %d\\n", year).',
      solution: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc main() {\n    fmt.Println("Мой первый Go-проект!")\n    \n    year := time.Now().Year()\n    fmt.Printf("Год: %d\\n", year)\n}',
      explanation: 'Мы использовали несколько импортов — при импорте нескольких пакетов используются скобки. Пакет time предоставляет функции работы со временем. time.Now() возвращает текущее время, а метод .Year() извлекает год. fmt.Printf позволяет форматировать строки: %d для целых чисел, %s для строк, \\n для переноса строки.'
    }
  ]
}
