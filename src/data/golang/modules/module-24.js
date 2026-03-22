export default {
  id: 24,
  title: 'Пакеты и модули',
  description: 'Пакеты — это строительные блоки Go-программ, а модули — способ управления зависимостями. Понимание системы пакетов критично для любого Go-разработчика.',
  lessons: [
    {
      id: 1,
      title: 'Объявление пакетов',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Каждый Go-файл начинается с объявления пакета. Пакет — это способ организации кода, как папки в файловой системе. Все файлы в одной директории должны принадлежать одному пакету.'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Объявление пакета — первая строка каждого .go файла\npackage main    // исполняемый пакет (имеет функцию main)\n\n// или\npackage utils   // библиотечный пакет\n\n// или\npackage models  // пакет с моделями данных'
        },
        {
          type: 'text',
          value: 'Специальный пакет main — точка входа программы. Только в нём может быть функция main(). Все остальные пакеты — библиотеки. Как театр: пакет main — это сцена, остальные пакеты — актёры за кулисами.'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Структура проекта:\n// myapp/\n//   main.go          -> package main\n//   models/\n//     user.go        -> package models\n//     product.go     -> package models\n//   utils/\n//     strings.go     -> package utils\n//     math.go        -> package utils\n//   config/\n//     config.go      -> package config\n\n// Файл: models/user.go\npackage models\n\nimport "fmt"\n\ntype User struct {\n    ID    int\n    Name  string\n    Email string\n}\n\nfunc (u User) String() string {\n    return fmt.Sprintf("User{%d: %s}", u.ID, u.Name)\n}\n\nfunc NewUser(id int, name, email string) *User {\n    return &User{ID: id, Name: name, Email: email}\n}'
        },
        {
          type: 'note',
          value: 'Имя пакета — последняя часть пути импорта. Пакет github.com/user/project/utils будет иметь package utils. Это соглашение, не требование, но его все соблюдают.'
        }
      ]
    },
    {
      id: 2,
      title: 'Импорт пакетов',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Для использования кода из другого пакета нужно его импортировать. Go строго проверяет: если импортировали пакет — обязательно используйте его.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    // Стандартная библиотека\n    "fmt"\n    "strings"\n    "os"\n    \n    // Несколько пакетов из стандартной библиотеки\n    "math/rand"\n    "net/http"\n    \n    // Внешние зависимости (после go get)\n    // "github.com/gin-gonic/gin"\n)\n\nfunc main() {\n    fmt.Println("Hello!")\n    fmt.Println(strings.ToUpper("world"))\n    fmt.Println(os.Getenv("HOME"))\n    fmt.Println(rand.Intn(100))\n    _ = http.StatusOK // используем константу\n}'
        },
        {
          type: 'heading',
          value: 'Псевдонимы импорта'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    \n    // Псевдоним для разрешения конфликтов имён\n    mrand "math/rand"\n    crand "crypto/rand"\n    \n    // Импорт только ради побочных эффектов (init функция)\n    _ "database/sql"\n    // _ "github.com/lib/pq"  // регистрация драйвера PostgreSQL\n    \n    // Точечный импорт (не рекомендуется!)\n    // . "fmt"  // тогда Println() вместо fmt.Println()\n)\n\nfunc main() {\n    // Используем псевдонимы\n    fmt.Println(mrand.Intn(100))  // math/rand\n    \n    buf := make([]byte, 4)\n    crand.Read(buf)               // crypto/rand\n    fmt.Printf("%x\\n", buf)\n}'
        },
        {
          type: 'warning',
          value: 'Go не компилирует программу с неиспользуемым импортом. Если импортировали пакет, используйте хотя бы одно его имя. Используйте _ "пакет" для импорта только ради побочных эффектов (выполнения init()).'
        }
      ]
    },
    {
      id: 3,
      title: 'Экспортируемые и неэкспортируемые имена',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'В Go нет ключевых слов public/private/protected. Видимость определяется первой буквой имени: заглавная — публично (экспортируется), строчная — приватно (только внутри пакета). Как два входа в здание: парадный (публичный) и служебный (приватный).'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Файл: store/product.go\npackage store\n\nimport "fmt"\n\n// Экспортируемые (публичные) — начинаются с заглавной буквы\ntype Product struct {\n    ID    int     // публичное поле\n    Name  string  // публичное поле\n    Price float64 // публичное поле\n    \n    stock    int     // ПРИВАТНОЕ поле — видно только внутри пакета store\n    discount float64 // ПРИВАТНОЕ поле\n}\n\n// NewProduct — экспортируемый конструктор\nfunc NewProduct(id int, name string, price float64) *Product {\n    return &Product{\n        ID:       id,\n        Name:     name,\n        Price:    price,\n        stock:    100,   // можем установить приватное поле внутри пакета\n        discount: 0.0,\n    }\n}\n\n// AddStock — экспортируемый метод\nfunc (p *Product) AddStock(quantity int) {\n    if quantity > 0 {\n        p.stock += quantity\n    }\n}\n\n// GetStock — экспортируемый метод (геттер для приватного поля)\nfunc (p *Product) GetStock() int {\n    return p.stock\n}\n\n// applyDiscount — ПРИВАТНАЯ функция\nfunc applyDiscount(price float64, discount float64) float64 {\n    return price * (1 - discount)\n}\n\n// FinalPrice — экспортируемый метод, использует приватную функцию\nfunc (p *Product) FinalPrice() float64 {\n    return applyDiscount(p.Price, p.discount)\n}\n\n// Вспомогательная — приватная\nfunc formatPrice(price float64) string {\n    return fmt.Sprintf("%.2f тг", price)\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Файл: main.go\npackage main\n\nimport (\n    "fmt"\n    // "myapp/store"\n)\n\nfunc main() {\n    // В реальном коде: p := store.NewProduct(1, "Ноутбук", 250000)\n    // p.ID = 1           // OK — публичное поле\n    // p.Name = "Планшет" // OK — публичное поле\n    // p.stock = 50       // ОШИБКА компиляции! stock приватное\n    // store.formatPrice(100) // ОШИБКА! функция приватная\n    \n    fmt.Println("Демонстрация видимости пакетов")\n}'
        },
        {
          type: 'tip',
          value: 'Правило: экспортируйте только то, что является частью публичного API пакета. Всё остальное делайте приватным. Это защита инварианта: внешний код не сможет нарушить внутреннее состояние.'
        }
      ]
    },
    {
      id: 4,
      title: 'go.mod и go.sum — управление зависимостями',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Go Modules — система управления зависимостями, введённая в Go 1.11. go.mod — манифест проекта (что нужно), go.sum — файл контрольных сумм (что именно скачано). Как список продуктов и чек из магазина.'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Создание нового модуля:\n// $ go mod init github.com/myuser/myproject\n\n// Содержимое go.mod:\nmodule github.com/myuser/myproject\n\ngo 1.21\n\nrequire (\n    github.com/gin-gonic/gin v1.9.1\n    github.com/stretchr/testify v1.8.4\n)\n\n// Часть go.sum (хэши зависимостей):\n// github.com/gin-gonic/gin v1.9.1 h1:...hash...\n// github.com/gin-gonic/gin v1.9.1/go.mod h1:...hash...'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Команды работы с модулями:\n\n// Инициализация нового модуля\n// $ go mod init module-name\n\n// Добавление зависимости\n// $ go get github.com/some/package\n\n// Добавление конкретной версии\n// $ go get github.com/some/package@v1.2.3\n\n// Обновление зависимостей\n// $ go get -u ./...\n\n// Удаление неиспользуемых зависимостей\n// $ go mod tidy\n\n// Скачать все зависимости в vendor\n// $ go mod vendor\n\n// Вывод графа зависимостей\n// $ go mod graph'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    // Пример использования внешней библиотеки\n    // После: go get github.com/fatih/color\n    // "github.com/fatih/color"\n)\n\nfunc main() {\n    // color.Green("Успех!")\n    // color.Red("Ошибка!")\n    fmt.Println("Модули позволяют использовать внешние библиотеки")\n}'
        },
        {
          type: 'note',
          value: 'go.sum нельзя редактировать вручную — он генерируется автоматически. go.sum нужно коммитить в git — это гарантирует воспроизводимые сборки для всей команды.'
        }
      ]
    },
    {
      id: 5,
      title: 'Добавление и использование зависимостей',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Пошаговый процесс добавления внешней зависимости в Go-проект. Рассмотрим на примере реальных популярных библиотек.'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Шаг 1: Инициализация модуля\n// $ mkdir myproject && cd myproject\n// $ go mod init github.com/myuser/myproject\n\n// Шаг 2: Написание кода использующего внешний пакет\n// main.go\npackage main\n\nimport (\n    "fmt"\n    // "github.com/google/uuid"  // после go get\n)\n\nfunc main() {\n    // id := uuid.New()\n    // fmt.Println("UUID:", id)\n    fmt.Println("Пример использования внешних зависимостей")\n}\n\n// Шаг 3: Загрузка зависимости\n// $ go get github.com/google/uuid\n// go: added github.com/google/uuid v1.4.0\n\n// Шаг 4: go.mod обновляется автоматически\n// require (\n//     github.com/google/uuid v1.4.0\n// )\n\n// Шаг 5: Сборка\n// $ go build .'
        },
        {
          type: 'heading',
          value: 'Версионирование зависимостей'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Семантическое версионирование: MAJOR.MINOR.PATCH\n// v1.2.3\n//   ^--- MAJOR: несовместимые изменения API\n//     ^--- MINOR: новые функции, обратная совместимость\n//       ^--- PATCH: исправления багов\n\n// Получить последнюю версию\n// $ go get github.com/pkg/errors@latest\n\n// Получить конкретный тег\n// $ go get github.com/pkg/errors@v0.9.1\n\n// Получить конкретный коммит\n// $ go get github.com/pkg/errors@abc1234\n\n// Для v2+ пакетов — другой путь импорта!\n// import "github.com/user/repo/v2"\n// Это важное соглашение Go Modules\n\n// go.mod с несколькими зависимостями:\nmodule example.com/myapp\n\ngo 1.21\n\nrequire (\n    github.com/google/uuid v1.4.0\n    github.com/stretchr/testify v1.8.4\n    // indirect зависимости (нужны для работы прямых)\n    github.com/davecgh/go-spew v1.1.1 // indirect\n)'
        }
      ]
    },
    {
      id: 6,
      title: 'Создание собственного пакета',
      type: 'theory',
      content: [
        {
          type: 'text',
          value: 'Создадим полноценный пакет с функциями, типами и документацией. Хороший пакет — как хорошая инструкция: понятно что делает, как использовать, что возвращает.'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Файл: calculator/calculator.go\n// Пакет calculator предоставляет базовые арифметические операции.\npackage calculator\n\nimport (\n    "fmt"\n    "math"\n)\n\n// ErrDivByZero возвращается при попытке деления на ноль.\nvar ErrDivByZero = fmt.Errorf("деление на ноль")\n\n// Calculator хранит историю вычислений.\ntype Calculator struct {\n    history []string\n    result  float64\n}\n\n// New создаёт новый калькулятор.\nfunc New() *Calculator {\n    return &Calculator{}\n}\n\n// Add складывает два числа и сохраняет в историю.\nfunc (c *Calculator) Add(a, b float64) float64 {\n    result := a + b\n    c.record(fmt.Sprintf("%.2f + %.2f = %.2f", a, b, result))\n    c.result = result\n    return result\n}\n\n// Subtract вычитает b из a.\nfunc (c *Calculator) Subtract(a, b float64) float64 {\n    result := a - b\n    c.record(fmt.Sprintf("%.2f - %.2f = %.2f", a, b, result))\n    c.result = result\n    return result\n}\n\n// Multiply умножает два числа.\nfunc (c *Calculator) Multiply(a, b float64) float64 {\n    result := a * b\n    c.record(fmt.Sprintf("%.2f * %.2f = %.2f", a, b, result))\n    c.result = result\n    return result\n}\n\n// Divide делит a на b, возвращает ошибку при делении на ноль.\nfunc (c *Calculator) Divide(a, b float64) (float64, error) {\n    if b == 0 {\n        return 0, ErrDivByZero\n    }\n    result := a / b\n    c.record(fmt.Sprintf("%.2f / %.2f = %.2f", a, b, result))\n    c.result = result\n    return result, nil\n}\n\n// Sqrt вычисляет квадратный корень.\nfunc (c *Calculator) Sqrt(a float64) (float64, error) {\n    if a < 0 {\n        return 0, fmt.Errorf("квадратный корень из отрицательного числа")\n    }\n    result := math.Sqrt(a)\n    c.record(fmt.Sprintf("sqrt(%.2f) = %.2f", a, result))\n    return result, nil\n}\n\n// History возвращает историю вычислений.\nfunc (c *Calculator) History() []string {\n    return append([]string{}, c.history...) // копия\n}\n\n// LastResult возвращает последний результат.\nfunc (c *Calculator) LastResult() float64 {\n    return c.result\n}\n\n// record — приватный метод записи в историю\nfunc (c *Calculator) record(entry string) {\n    c.history = append(c.history, entry)\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: '// Файл: main.go (использование пакета)\npackage main\n\nimport (\n    "fmt"\n    // "myapp/calculator"  // путь зависит от go.mod\n)\n\nfunc main() {\n    // calc := calculator.New()\n    // \n    // fmt.Println(calc.Add(10, 5))        // 15\n    // fmt.Println(calc.Multiply(3, 4))    // 12\n    // \n    // result, err := calc.Divide(10, 3)\n    // if err != nil {\n    //     fmt.Println("Ошибка:", err)\n    // } else {\n    //     fmt.Printf("%.4f\\n", result)    // 3.3333\n    // }\n    // \n    // _, err = calc.Divide(5, 0)\n    // fmt.Println(err)                    // деление на ноль\n    // \n    // fmt.Println("История:")\n    // for _, h := range calc.History() {\n    //     fmt.Println(" ", h)\n    // }\n    \n    fmt.Println("Пример использования собственного пакета")\n}'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Утилитарный пакет mathutils',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте утилитарный пакет с математическими функциями и правильной организацией кода.',
      requirements: [
        'Написать пакет mathutils (в одном файле) с функциями: Max(a, b int) int, Min(a, b int) int, Abs(n int) int',
        'Добавить функцию Clamp(value, min, max int) int — ограничивает value в диапазоне [min, max]',
        'Добавить функцию Sum(nums ...int) int и Average(nums ...int) (float64, error) — Average возвращает ошибку для пустого слайса',
        'Добавить функцию IsPrime(n int) bool — проверка простого числа',
        'Добавить функцию Fibonacci(n int) (int, error) — n-е число Фибоначчи, ошибка если n < 0',
        'В main() продемонстрировать все функции пакета'
      ],
      expectedOutput: 'Max(3, 7) = 7\nMin(3, 7) = 3\nAbs(-5) = 5\nClamp(15, 0, 10) = 10\nSum(1,2,3,4,5) = 15\nAverage = 3.00\nIsPrime(17) = true\nFibonacci(10) = 55',
      hint: 'IsPrime: проверяйте делители от 2 до sqrt(n). Fibonacci можно реализовать итеративно через цикл for. Average проверяет len(nums) == 0.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "math"\n)\n\n// Пакет mathutils\n\nfunc Max(a, b int) int {\n    if a > b {\n        return a\n    }\n    return b\n}\n\nfunc Min(a, b int) int {\n    if a < b {\n        return a\n    }\n    return b\n}\n\nfunc Abs(n int) int {\n    if n < 0 {\n        return -n\n    }\n    return n\n}\n\nfunc Clamp(value, minVal, maxVal int) int {\n    if value < minVal {\n        return minVal\n    }\n    if value > maxVal {\n        return maxVal\n    }\n    return value\n}\n\nfunc Sum(nums ...int) int {\n    total := 0\n    for _, n := range nums {\n        total += n\n    }\n    return total\n}\n\nfunc Average(nums ...int) (float64, error) {\n    if len(nums) == 0 {\n        return 0, fmt.Errorf("average: пустой список чисел")\n    }\n    return float64(Sum(nums...)) / float64(len(nums)), nil\n}\n\nfunc IsPrime(n int) bool {\n    if n < 2 {\n        return false\n    }\n    for i := 2; i <= int(math.Sqrt(float64(n))); i++ {\n        if n%i == 0 {\n            return false\n        }\n    }\n    return true\n}\n\nfunc Fibonacci(n int) (int, error) {\n    if n < 0 {\n        return 0, fmt.Errorf("fibonacci: n не может быть отрицательным")\n    }\n    if n == 0 {\n        return 0, nil\n    }\n    if n == 1 {\n        return 1, nil\n    }\n    a, b := 0, 1\n    for i := 2; i <= n; i++ {\n        a, b = b, a+b\n    }\n    return b, nil\n}\n\nfunc main() {\n    fmt.Printf("Max(3, 7) = %d\\n", Max(3, 7))\n    fmt.Printf("Min(3, 7) = %d\\n", Min(3, 7))\n    fmt.Printf("Abs(-5) = %d\\n", Abs(-5))\n    fmt.Printf("Clamp(15, 0, 10) = %d\\n", Clamp(15, 0, 10))\n    fmt.Printf("Sum(1,2,3,4,5) = %d\\n", Sum(1, 2, 3, 4, 5))\n    \n    avg, err := Average(1, 2, 3, 4, 5)\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n    } else {\n        fmt.Printf("Average = %.2f\\n", avg)\n    }\n    \n    fmt.Printf("IsPrime(17) = %v\\n", IsPrime(17))\n    fmt.Printf("IsPrime(15) = %v\\n", IsPrime(15))\n    \n    fib, err := Fibonacci(10)\n    if err != nil {\n        fmt.Println("Ошибка:", err)\n    } else {\n        fmt.Printf("Fibonacci(10) = %d\\n", fib)\n    }\n    \n    _, err = Fibonacci(-1)\n    fmt.Println("Fibonacci(-1):", err)\n}',
      explanation: 'Функции пакета принимают вариадические аргументы (...int) для Sum и Average. IsPrime использует math.Sqrt для оптимизации. Fibonacci реализован итеративно — O(n) по времени, O(1) по памяти.'
    }
  ]
}
