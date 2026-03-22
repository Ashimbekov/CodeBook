export default {
  id: 7,
  title: 'Switch',
  description: 'Оператор switch в Go — мощнее и гибче, чем в других языках. Базовый switch, switch без условия, множественные значения в case, fallthrough и type switch.',
  lessons: [
    {
      id: 1,
      title: 'Базовый switch',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Switch — умный выбор'
        },
        {
          type: 'text',
          value: 'Switch в Go сравнивает значение с несколькими вариантами и выполняет соответствующий блок. Он чище цепочки if-else if и часто предпочтительнее для выбора из нескольких значений.'
        },
        {
          type: 'text',
          value: 'Важное отличие от C/Java: в Go break не нужен! Каждый case автоматически прерывается. Выполнение не "проваливается" в следующий case (если специально не указать fallthrough).'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc dayName(day int) string {\n    switch day {\n    case 1:\n        return "Понедельник"\n    case 2:\n        return "Вторник"\n    case 3:\n        return "Среда"\n    case 4:\n        return "Четверг"\n    case 5:\n        return "Пятница"\n    case 6:\n        return "Суббота"\n    case 7:\n        return "Воскресенье"\n    default:\n        return "Неизвестный день"\n    }\n}\n\nfunc main() {\n    for day := 1; day <= 7; day++ {\n        fmt.Println(day, "-", dayName(day))\n    }\n}'
        },
        {
          type: 'note',
          value: 'В Go switch также поддерживает инициализирующее выражение, как if: switch x := getValue(); x { ... }. Переменная x будет доступна только внутри switch.'
        }
      ]
    },
    {
      id: 2,
      title: 'Switch без условия',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Switch как замена цепочке if-else'
        },
        {
          type: 'text',
          value: 'Switch без выражения — уникальная особенность Go. Он эквивалентен цепочке if-else if, но читается значительно чище. Каждый case содержит произвольное булево выражение.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc classifyNumber(n int) string {\n    switch {\n    case n < 0:\n        return "отрицательное"\n    case n == 0:\n        return "ноль"\n    case n < 10:\n        return "маленькое положительное"\n    case n < 100:\n        return "среднее положительное"\n    default:\n        return "большое положительное"\n    }\n}\n\nfunc main() {\n    numbers := []int{-5, 0, 7, 42, 150}\n    for _, n := range numbers {\n        fmt.Printf("%d - %s\\n", n, classifyNumber(n))\n    }\n    // -5 - отрицательное\n    // 0 - ноль\n    // 7 - маленькое положительное\n    // 42 - среднее положительное\n    // 150 - большое положительное\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "time"\n)\n\nfunc timeOfDay() string {\n    hour := time.Now().Hour()\n    switch {\n    case hour < 6:\n        return "Ночь"\n    case hour < 12:\n        return "Утро"\n    case hour < 18:\n        return "День"\n    default:\n        return "Вечер"\n    }\n}\n\nfunc main() {\n    fmt.Println("Сейчас:", timeOfDay())\n}'
        },
        {
          type: 'tip',
          value: 'Switch без условия — прекрасная замена длинным цепочкам if-else if, особенно когда условия сложные. Код выглядит чище и легче читается.'
        }
      ]
    },
    {
      id: 3,
      title: 'Несколько значений в case',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Группировка вариантов'
        },
        {
          type: 'text',
          value: 'В Go один case может обрабатывать несколько значений через запятую. Это очень удобно, когда несколько значений должны давать одинаковый результат.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc isWeekend(day string) bool {\n    switch day {\n    case "Суббота", "Воскресенье":\n        return true\n    default:\n        return false\n    }\n}\n\nfunc seasonByMonth(month int) string {\n    switch month {\n    case 12, 1, 2:\n        return "Зима"\n    case 3, 4, 5:\n        return "Весна"\n    case 6, 7, 8:\n        return "Лето"\n    case 9, 10, 11:\n        return "Осень"\n    default:\n        return "Неизвестный месяц"\n    }\n}\n\nfunc main() {\n    days := []string{"Понедельник", "Суббота", "Среда", "Воскресенье"}\n    for _, day := range days {\n        if isWeekend(day) {\n            fmt.Println(day, "- выходной")\n        } else {\n            fmt.Println(day, "- рабочий")\n        }\n    }\n\n    for month := 1; month <= 12; month++ {\n        fmt.Printf("Месяц %2d: %s\\n", month, seasonByMonth(month))\n    }\n}'
        },
        {
          type: 'heading',
          value: 'Switch с инициализацией'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "math/rand"\n)\n\nfunc main() {\n    // switch с инициализирующим выражением\n    switch roll := rand.Intn(6) + 1; roll {\n    case 1:\n        fmt.Println("Выпала 1 - минимум!")\n    case 2, 3, 4, 5:\n        fmt.Printf("Выпало %d\\n", roll)\n    case 6:\n        fmt.Println("Выпала 6 - максимум!")\n    }\n    // roll доступна только внутри switch\n}'
        }
      ]
    },
    {
      id: 4,
      title: 'fallthrough',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Принудительный "провал" в следующий case'
        },
        {
          type: 'text',
          value: 'По умолчанию Go автоматически завершает выполнение после каждого case. Ключевое слово fallthrough заставляет выполнение "провалиться" в следующий case. Это используется редко, но иногда необходимо.'
        },
        {
          type: 'text',
          value: 'Важно: fallthrough выполняет следующий case БЕЗ проверки его условия!'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    n := 5\n\n    switch {\n    case n > 0:\n        fmt.Println("Положительное число")\n        fallthrough // провалиться в следующий case\n    case n > -10:\n        fmt.Println("Больше -10")\n        fallthrough // и ещё в следующий\n    case n > -100:\n        fmt.Println("Больше -100")\n    case n > -1000:\n        fmt.Println("Это не выполнится (нет fallthrough выше)")\n    }\n    // Выводит:\n    // Положительное число\n    // Больше -10\n    // Больше -100\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Практический пример: накопление прав\nfunc accessLevel(level int) {\n    fmt.Printf("Уровень %d имеет права:\\n", level)\n    switch level {\n    case 3:\n        fmt.Println(" - Удаление данных")\n        fallthrough\n    case 2:\n        fmt.Println(" - Изменение данных")\n        fallthrough\n    case 1:\n        fmt.Println(" - Чтение данных")\n    default:\n        fmt.Println(" - Нет прав")\n    }\n}\n\nfunc main() {\n    accessLevel(1) // Только чтение\n    fmt.Println()\n    accessLevel(2) // Чтение + изменение\n    fmt.Println()\n    accessLevel(3) // Все права\n}'
        },
        {
          type: 'warning',
          value: 'Используйте fallthrough крайне редко! Это нарушает интуитивное поведение switch. Обычно лучше использовать несколько значений в одном case или вынести общую логику в функцию.'
        }
      ]
    },
    {
      id: 5,
      title: 'Type switch',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Переключение по типу'
        },
        {
          type: 'text',
          value: 'Type switch — это специальный вид switch для определения динамического типа значения интерфейса. Это очень важная концепция в Go, которая используется при работе с интерфейсами.'
        },
        {
          type: 'text',
          value: 'Аналогия: Представьте посылку (interface{}). Вы не знаете, что внутри. Type switch — это как вскрыть посылку и проверить содержимое: это книга? Или телефон? Или что-то другое?'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc describe(i interface{}) string {\n    switch v := i.(type) {\n    case int:\n        return fmt.Sprintf("Целое число: %d", v)\n    case float64:\n        return fmt.Sprintf("Дробное число: %.2f", v)\n    case string:\n        return fmt.Sprintf("Строка: %q (длина %d)", v, len(v))\n    case bool:\n        if v {\n            return "Булево: true"\n        }\n        return "Булево: false"\n    case []int:\n        return fmt.Sprintf("Срез целых чисел: %v", v)\n    case nil:\n        return "Nil (пусто)"\n    default:\n        return fmt.Sprintf("Неизвестный тип: %T", v)\n    }\n}\n\nfunc main() {\n    values := []interface{}{42, 3.14, "hello", true, []int{1, 2, 3}, nil}\n    for _, v := range values {\n        fmt.Println(describe(v))\n    }\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "math"\n)\n\n// Интерфейс для геометрических фигур\ntype Shape interface {\n    Area() float64\n}\n\ntype Circle struct{ Radius float64 }\ntype Rectangle struct{ Width, Height float64 }\ntype Triangle struct{ Base, Height float64 }\n\nfunc (c Circle) Area() float64    { return math.Pi * c.Radius * c.Radius }\nfunc (r Rectangle) Area() float64 { return r.Width * r.Height }\nfunc (t Triangle) Area() float64  { return 0.5 * t.Base * t.Height }\n\nfunc describeShape(s Shape) {\n    switch v := s.(type) {\n    case Circle:\n        fmt.Printf("Круг с радиусом %.1f, площадь %.2f\\n", v.Radius, v.Area())\n    case Rectangle:\n        fmt.Printf("Прямоугольник %.1fx%.1f, площадь %.2f\\n", v.Width, v.Height, v.Area())\n    case Triangle:\n        fmt.Printf("Треугольник (основание %.1f, высота %.1f), площадь %.2f\\n",\n            v.Base, v.Height, v.Area())\n    }\n}\n\nfunc main() {\n    shapes := []Shape{\n        Circle{5},\n        Rectangle{4, 6},\n        Triangle{3, 8},\n    }\n    for _, s := range shapes {\n        describeShape(s)\n    }\n}'
        },
        {
          type: 'note',
          value: 'Type switch используется с типом interface{}  (или any в Go 1.18+). Это специальный интерфейс, который может хранить значение любого типа. Подробнее об интерфейсах — в следующих модулях.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Простой интерпретатор команд',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Создайте простой обработчик команд с использованием switch. Программа должна поддерживать команды: help, version, hello, time, quit.',
      requirements: [
        'Напишите функцию processCommand(cmd string) string',
        'Команда "help" возвращает список доступных команд',
        'Команда "version" возвращает "Версия 1.0.0"',
        'Команда "hello" возвращает "Привет, пользователь!"',
        'Команды "quit" и "exit" возвращают "Выход..."',
        'Пустая строка возвращает "Введите команду"',
        'Неизвестная команда возвращает сообщение об ошибке'
      ],
      expectedOutput: 'help -> Доступные команды: help, version, hello, quit\nversion -> Версия 1.0.0\nhello -> Привет, пользователь!\nquit -> Выход...\nexit -> Выход...\n -> Введите команду\nfoo -> Неизвестная команда: "foo"',
      hint: 'Используйте switch с несколькими значениями в case для "quit" и "exit". Пустую строку обрабатывайте в отдельном case "" или перед switch.',
      solution: 'package main\n\nimport "fmt"\n\nfunc processCommand(cmd string) string {\n    switch cmd {\n    case "help":\n        return "Доступные команды: help, version, hello, quit"\n    case "version":\n        return "Версия 1.0.0"\n    case "hello":\n        return "Привет, пользователь!"\n    case "quit", "exit":\n        return "Выход..."\n    case "":\n        return "Введите команду"\n    default:\n        return fmt.Sprintf("Неизвестная команда: %q", cmd)\n    }\n}\n\nfunc main() {\n    commands := []string{"help", "version", "hello", "quit", "exit", "", "foo"}\n    for _, cmd := range commands {\n        result := processCommand(cmd)\n        fmt.Printf("%s -> %s\\n", cmd, result)\n    }\n}',
      explanation: 'Switch идеально подходит для диспетчеризации команд. Использование нескольких значений в case ("quit", "exit") позволяет обработать синонимы команд без дублирования кода. Пустая строка "" — это тоже валидное значение для case. Блок default обрабатывает все неизвестные команды. Это стандартный паттерн для обработчиков команд в Go.'
    }
  ]
}
