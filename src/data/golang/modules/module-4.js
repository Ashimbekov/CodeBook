export default {
  id: 4,
  title: 'Константы и iota',
  description: 'Изучаем константы в Go, нетипизированные константы, перечисления с помощью iota и создание битовых флагов.',
  lessons: [
    {
      id: 1,
      title: 'Ключевое слово const',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Что такое константы?'
        },
        {
          type: 'text',
          value: 'Константа — это именованное значение, которое не может изменяться во время выполнения программы. В Go константы объявляются с помощью ключевого слова const. Аналогия: константа — это как фундамент здания. Его закладывают один раз, и потом он не меняется, на нём строят всё остальное.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Константы на уровне пакета\nconst Pi = 3.14159265358979\nconst AppName = "МоёПриложение"\nconst MaxRetries = 3\n\nfunc main() {\n    // Константы внутри функции\n    const greeting = "Привет!"\n    const maxUsers = 100\n\n    fmt.Println(greeting)    // Привет!\n    fmt.Println(maxUsers)    // 100\n    fmt.Println(Pi)          // 3.14159265358979\n    fmt.Println(AppName)     // МоёПриложение\n\n    // Нельзя изменить константу!\n    // Pi = 3.0  // ОШИБКА: cannot assign to Pi\n}'
        },
        {
          type: 'heading',
          value: 'Блок const'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Блочное объявление констант\nconst (\n    StatusOK       = 200\n    StatusNotFound = 404\n    StatusError    = 500\n\n    MinAge = 0\n    MaxAge = 150\n\n    AppVersion = "1.0.0"\n)\n\nfunc main() {\n    fmt.Println(StatusOK, StatusNotFound, StatusError)\n    // 200 404 500\n    fmt.Println("Версия:", AppVersion)\n    // Версия: 1.0.0\n}'
        },
        {
          type: 'tip',
          value: 'Используйте константы для: магических чисел (вместо 3.14 пишите Pi), HTTP-кодов, настроек приложения, размеров буферов. Это делает код самодокументируемым.'
        }
      ]
    },
    {
      id: 2,
      title: 'Нетипизированные константы',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Особенность констант в Go'
        },
        {
          type: 'text',
          value: 'Константы в Go могут быть нетипизированными. Это значит, что они имеют высокую точность и могут использоваться с разными числовыми типами без явного преобразования. Это уникальная особенность Go!'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Нетипизированная константа\n    const x = 100\n\n    // Можно использовать с разными типами!\n    var i int = x\n    var f float64 = x\n    var u uint = x\n\n    fmt.Println(i, f, u) // 100 100 100\n\n    // Типизированная константа\n    const y int = 100\n    var j int = y        // OK\n    // var k float64 = y // ОШИБКА: cannot use y (type int) as float64\n\n    _ = j // подавляем ошибку "unused variable"\n}'
        },
        {
          type: 'heading',
          value: 'Высокая точность констант'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Константы имеют произвольную точность при вычислении\n    const Big = 1 << 100  // 2 в степени 100 — огромное число\n    const Small = Big >> 99 // 2\n\n    // При использовании приводится к нужному типу\n    fmt.Println(Small)         // 2\n    fmt.Println(Small * 1.5)   // 3\n\n    // Нетипизированные числовые константы\n    const num = 1000000000000  // int64 при компиляции\n    fmt.Println(num / 1000)    // 1000000000\n}'
        },
        {
          type: 'note',
          value: 'Нетипизированные константы вычисляются с высокой точностью во время компиляции. При присваивании переменной константа принимает тип этой переменной (если значение в ней помещается).'
        }
      ]
    },
    {
      id: 3,
      title: 'iota — генератор констант',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Что такое iota?'
        },
        {
          type: 'text',
          value: 'iota — это специальный идентификатор в Go, который автоматически увеличивается в блоке const. Он начинается с 0 и увеличивается на 1 для каждой константы в блоке. Это мощный инструмент для создания перечислений.'
        },
        {
          type: 'text',
          value: 'Аналогия: iota — это как автоматический счётчик на конвейере. Каждая деталь получает свой уникальный номер: 0, 1, 2, 3...'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Дни недели с iota\nconst (\n    Monday    = iota // 0\n    Tuesday          // 1\n    Wednesday        // 2\n    Thursday         // 3\n    Friday           // 4\n    Saturday         // 5\n    Sunday           // 6\n)\n\nfunc main() {\n    fmt.Println(Monday, Tuesday, Wednesday)\n    // 0 1 2\n    fmt.Println(Thursday, Friday, Saturday, Sunday)\n    // 3 4 5 6\n\n    day := Wednesday\n    if day == Wednesday {\n        fmt.Println("Сегодня среда!")\n    }\n}'
        },
        {
          type: 'heading',
          value: 'iota с выражениями'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nconst (\n    // Начинаем с 1, а не с 0\n    First  = iota + 1 // 1\n    Second            // 2\n    Third             // 3\n)\n\nconst (\n    // Степени двойки\n    KB = 1 << (iota + 10) // 1 << 10 = 1024\n    MB                    // 1 << 11 = 2048? нет, 1 << 21!\n    // Подождите, давайте разберём...\n)\n\nconst (\n    // Правильно: степени для байтов\n    _  = iota             // пропускаем 0\n    KB2 = 1 << (iota * 10) // 1 << 10 = 1024\n    MB2                    // 1 << 20 = 1048576\n    GB2                    // 1 << 30 = 1073741824\n)\n\nfunc main() {\n    fmt.Println(First, Second, Third) // 1 2 3\n    fmt.Printf("KB: %d\\n", KB2)      // KB: 1024\n    fmt.Printf("MB: %d\\n", MB2)      // MB: 1048576\n    fmt.Printf("GB: %d\\n", GB2)      // GB: 1073741824\n}'
        }
      ]
    },
    {
      id: 4,
      title: 'Битовые флаги с iota',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Использование iota для битовых флагов'
        },
        {
          type: 'text',
          value: 'Один из классических паттернов в Go — создание битовых флагов с помощью iota. Битовые флаги позволяют хранить несколько булевых значений в одном числе, что экономит память и ускоряет операции.'
        },
        {
          type: 'text',
          value: 'Аналогия: Битовые флаги — это как панель переключателей. Каждый переключатель отвечает за одну функцию. Вы можете включить несколько одновременно, и всё это хранится в одном числе.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Права доступа к файлу\nconst (\n    Read    = 1 << iota // 1 (001 в бинарном)\n    Write               // 2 (010 в бинарном)\n    Execute             // 4 (100 в бинарном)\n)\n\nfunc main() {\n    fmt.Printf("Read:    %d (%b)\\n", Read, Read)       // 1 (1)\n    fmt.Printf("Write:   %d (%b)\\n", Write, Write)     // 2 (10)\n    fmt.Printf("Execute: %d (%b)\\n", Execute, Execute) // 4 (100)\n\n    // Комбинирование флагов через OR\n    readWrite := Read | Write\n    fmt.Printf("Read+Write: %d (%b)\\n", readWrite, readWrite) // 3 (11)\n\n    // Проверка флага через AND\n    permissions := Read | Execute\n    if permissions&Read != 0 {\n        fmt.Println("Есть право на чтение")\n    }\n    if permissions&Write != 0 {\n        fmt.Println("Есть право на запись")\n    } else {\n        fmt.Println("Нет права на запись")\n    }\n    if permissions&Execute != 0 {\n        fmt.Println("Есть право на выполнение")\n    }\n}'
        },
        {
          type: 'heading',
          value: 'Реальный пример: настройки логгера'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype LogLevel int\n\nconst (\n    LogDebug   LogLevel = 1 << iota // 1\n    LogInfo                          // 2\n    LogWarning                       // 4\n    LogError                         // 8\n)\n\nfunc log(level LogLevel, enabledLevels LogLevel, msg string) {\n    if enabledLevels&level != 0 {\n        fmt.Println("[LOG]", msg)\n    }\n}\n\nfunc main() {\n    // Включаем только Info и Error\n    enabled := LogInfo | LogError\n\n    log(LogDebug, enabled, "Отладка: соединение установлено") // НЕ выведется\n    log(LogInfo, enabled, "Сервер запущен")                  // Выведется\n    log(LogWarning, enabled, "Мало памяти")                  // НЕ выведется\n    log(LogError, enabled, "База данных недоступна")          // Выведется\n}'
        },
        {
          type: 'tip',
          value: 'Битовые флаги — мощный паттерн для конфигурации. Вместо множества булевых параметров используйте одно число с флагами. Это особенно полезно при передаче настроек в функции.'
        }
      ]
    },
    {
      id: 5,
      title: 'Практические паттерны с iota',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'iota для пропуска значений'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Использование _ для пропуска значений\nconst (\n    _ = iota  // 0 - пропускаем\n    One       // 1\n    Two       // 2\n    _         // 3 - пропускаем\n    Four      // 4\n)\n\n// Цвета светофора (начинаем с 1)\nconst (\n    Red = iota + 1   // 1\n    Yellow           // 2\n    Green            // 3\n)\n\nfunc trafficLight(color int) string {\n    switch color {\n    case Red:\n        return "Стоп!"\n    case Yellow:\n        return "Внимание!"\n    case Green:\n        return "Можно ехать!"\n    default:\n        return "Неизвестный сигнал"\n    }\n}\n\nfunc main() {\n    fmt.Println(One, Two, Four)  // 1 2 4\n    fmt.Println(Red, Yellow, Green) // 1 2 3\n\n    fmt.Println(trafficLight(Red))    // Стоп!\n    fmt.Println(trafficLight(Yellow)) // Внимание!\n    fmt.Println(trafficLight(Green))  // Можно ехать!\n}'
        },
        {
          type: 'heading',
          value: 'Строковые перечисления'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\ntype Season int\n\nconst (\n    Spring Season = iota + 1\n    Summer\n    Autumn\n    Winter\n)\n\n// Метод String() для красивого вывода\nfunc (s Season) String() string {\n    names := []string{"Весна", "Лето", "Осень", "Зима"}\n    if s < Spring || s > Winter {\n        return "Неизвестное время года"\n    }\n    return names[s-1]\n}\n\nfunc main() {\n    current := Summer\n    fmt.Println("Сейчас:", current) // Сейчас: Лето\n\n    seasons := []Season{Spring, Summer, Autumn, Winter}\n    for _, s := range seasons {\n        fmt.Println(s)\n    }\n}'
        },
        {
          type: 'note',
          value: 'Паттерн с методом String() для типов-перечислений — очень распространён в Go. Он позволяет fmt.Println автоматически выводить человекочитаемые имена вместо чисел.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Система приоритетов задач',
      type: 'practice',
      difficulty: 'beginner',
      description: 'Создайте систему приоритетов задач с использованием константы iota. Задайте приоритеты Low, Medium, High, Critical и напишите функцию, которая возвращает описание приоритета.',
      requirements: [
        'Объявите тип Priority как int',
        'Создайте константы с iota: Low=1, Medium=2, High=3, Critical=4',
        'Напишите функцию priorityName(p Priority) string, которая возвращает русское название приоритета',
        'В main создайте несколько задач с разными приоритетами',
        'Выведите каждую задачу с её приоритетом'
      ],
      expectedOutput: 'Задача "Исправить баг" - приоритет: Критический\nЗадача "Написать тесты" - приоритет: Высокий\nЗадача "Обновить документацию" - приоритет: Низкий\nЗадача "Рефакторинг кода" - приоритет: Средний',
      hint: 'Используйте switch внутри функции priorityName для возврата строки. Задачу можно представить как строку (название) и Priority (приоритет).',
      solution: 'package main\n\nimport "fmt"\n\ntype Priority int\n\nconst (\n    Low      Priority = iota + 1\n    Medium\n    High\n    Critical\n)\n\nfunc priorityName(p Priority) string {\n    switch p {\n    case Low:\n        return "Низкий"\n    case Medium:\n        return "Средний"\n    case High:\n        return "Высокий"\n    case Critical:\n        return "Критический"\n    default:\n        return "Неизвестный"\n    }\n}\n\nfunc main() {\n    tasks := []struct {\n        name     string\n        priority Priority\n    }{\n        {"Исправить баг", Critical},\n        {"Написать тесты", High},\n        {"Обновить документацию", Low},\n        {"Рефакторинг кода", Medium},\n    }\n\n    for _, task := range tasks {\n        fmt.Printf("Задача %q - приоритет: %s\\n",\n            task.name, priorityName(task.priority))\n    }\n}',
      explanation: 'Мы создали пользовательский тип Priority на основе int. Константы с iota начинаются с 1 (iota + 1), чтобы 0 не был валидным приоритетом. Функция priorityName использует switch для преобразования числа в строку. Анонимная структура в срезе позволяет хранить пары (название, приоритет) без объявления отдельного типа.'
    }
  ]
}
