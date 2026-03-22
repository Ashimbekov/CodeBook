export default {
  id: 11,
  title: 'Строки и руны',
  description: 'Глубокое понимание строк в Go: байты, руны, Unicode и работа с текстом. Строки в Go — это не просто массив символов, это срез байт с особыми свойствами.',
  lessons: [
    {
      id: 1,
      title: 'Основы строк в Go',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Что такое строка в Go?'
        },
        {
          type: 'text',
          value: 'Строка в Go — это срез байт ([]byte) только для чтения. Представьте строку как запечатанный конверт с письмом: вы можете читать содержимое, но не можете изменить отдельные буквы внутри, не распечатав новый конверт.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Строковый литерал\n    s := "Привет, мир!"\n    fmt.Println(s)\n\n    // Длина в байтах (не символах!)\n    fmt.Println("Длина в байтах:", len(s))\n\n    // Доступ к байтам по индексу\n    fmt.Println("Первый байт:", s[0])\n\n    // Строка из байт\n    b := []byte{72, 101, 108, 108, 111}\n    fmt.Println(string(b)) // Hello\n}'
        },
        {
          type: 'note',
          value: 'len(s) возвращает количество БАЙТ, а не символов. Для русских букв (UTF-8) каждый символ занимает 2 байта, поэтому "Привет" имеет длину 12 байт, а не 6!'
        },
        {
          type: 'text',
          value: 'Строки в Go всегда в кодировке UTF-8. Это встроено в язык на уровне компилятора.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    s := "Go"\n    fmt.Println(len(s)) // 2 байта\n\n    r := "Го"\n    fmt.Println(len(r)) // 4 байта (каждая кириллическая буква = 2 байта в UTF-8)\n\n    // Объявление строк разными способами\n    s1 := "двойные кавычки"\n    s2 := `обратные кавычки\n(raw string literal)\nсохраняет переносы`\n    fmt.Println(s1)\n    fmt.Println(s2)\n}'
        },
        {
          type: 'tip',
          value: 'Обратные кавычки (`) создают "сырые" строки, в которых нет обработки escape-последовательностей. Удобно для многострочного текста, регулярных выражений и JSON.'
        }
      ]
    },
    {
      id: 2,
      title: 'Неизменяемость строк',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Строки нельзя изменить напрямую'
        },
        {
          type: 'text',
          value: 'Строки в Go неизменяемы (immutable). Это как номер на паспорте — вы не можете стереть и написать другой, нужно получить новый паспорт. "Изменение" строки всегда создаёт новую строку.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    s := "hello"\n    \n    // Это НЕ скомпилируется!\n    // s[0] = \'H\'  // cannot assign to s[0] (neither addressable nor a map index expression)\n    \n    // Правильный способ: создаём новую строку\n    // Конвертируем в []byte, меняем, конвертируем обратно\n    b := []byte(s)\n    b[0] = \'H\'\n    s2 := string(b)\n    fmt.Println(s2) // Hello\n    fmt.Println(s)  // hello (оригинал не изменился)\n}'
        },
        {
          type: 'text',
          value: 'Конкатенация строк с помощью + создаёт новую строку каждый раз. Для частых конкатенаций используйте strings.Builder (мы изучим его позже).'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    s := "Hello"\n    s += ", " // создаётся новая строка "Hello, "\n    s += "World" // создаётся ещё одна строка "Hello, World"\n    fmt.Println(s)\n    \n    // Сравнение строк\n    a := "apple"\n    b := "banana"\n    fmt.Println(a == b)  // false\n    fmt.Println(a < b)   // true (лексикографически)\n    fmt.Println(a != b)  // true\n}'
        },
        {
          type: 'warning',
          value: 'Цикличная конкатенация s += "x" в цикле создаёт O(n²) строк и очень медленна. Для построения строк в цикле используйте strings.Builder.'
        }
      ]
    },
    {
      id: 3,
      title: 'Тип rune и Unicode',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Руны — это символы Unicode'
        },
        {
          type: 'text',
          value: 'Тип rune — это псевдоним для int32. Он представляет кодовую точку Unicode (Unicode code point). Если byte — это "ящик на 8 бит", то rune — это "ящик на 32 бита", достаточный для любого символа в мире.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // rune = int32\n    var r rune = \'А\' // кириллическая А\n    fmt.Println(r)        // 1040 (код Unicode)\n    fmt.Printf("%c\\n", r) // А (сам символ)\n    \n    // byte = uint8, только ASCII\n    var b byte = \'A\' // латинская A\n    fmt.Println(b)        // 65\n    fmt.Printf("%c\\n", b) // A\n    \n    // Руны можно объявлять через код Unicode\n    smile := \'\\U0001F600\' // эмодзи 😀\n    fmt.Printf("%c\\n", smile)\n    \n    // Преобразование строки в срез рун\n    s := "Привет"\n    runes := []rune(s)\n    fmt.Println(len(s))     // 12 (байт)\n    fmt.Println(len(runes)) // 6  (символов)\n}'
        },
        {
          type: 'note',
          value: 'Аналогия: byte — это клетка на 8 пикселей (максимум 256 значений, только ASCII). rune — это клетка на 32 пикселя (более 4 миллиардов значений, все языки мира).'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // utf8.RuneCountInString считает символы, не байты\n    s := "日本語" // японские иероглифы\n    fmt.Println("Байт:", len(s))             // 9 (3 символа × 3 байта)\n    fmt.Println("Символов:", len([]rune(s))) // 3\n    \n    // Получить i-й символ (не байт)\n    runes := []rune(s)\n    fmt.Printf("Первый символ: %c\\n", runes[0]) // 日\n}'
        }
      ]
    },
    {
      id: 4,
      title: 'Итерация по строке: байты vs руны',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Два способа итерации по строке'
        },
        {
          type: 'text',
          value: 'В Go есть два способа перебрать строку. Первый — по байтам (через индекс), второй — по рунам (через range). Это как читать книгу побуквенно vs посимвольно в иероглифическом тексте.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    s := "Go! Го!"\n    \n    // Способ 1: по байтам (индекс)\n    fmt.Println("=== По байтам ===")\n    for i := 0; i < len(s); i++ {\n        fmt.Printf("s[%d] = %d (%c)\\n", i, s[i], s[i])\n    }\n    \n    // Способ 2: по рунам (range)\n    fmt.Println("\\n=== По рунам (range) ===")\n    for i, r := range s {\n        fmt.Printf("pos=%d, rune=%d (%c)\\n", i, r, r)\n    }\n}'
        },
        {
          type: 'note',
          value: 'Заметьте разницу: при итерации через range, индекс i — это позиция в байтах начала руны, а не порядковый номер символа. Поэтому для "Г" индекс может быть 4, а не 4-й символ.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    s := "Привет"\n    \n    // Подсчёт символов через range\n    count := 0\n    for range s {\n        count++\n    }\n    fmt.Println("Символов:", count) // 6\n    \n    // Реверс строки (правильный способ — через руны)\n    runes := []rune(s)\n    for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {\n        runes[i], runes[j] = runes[j], runes[i]\n    }\n    fmt.Println(string(runes)) // тевирП\n}'
        },
        {
          type: 'tip',
          value: 'Для правильной работы с текстом на любом языке всегда используйте range или конвертируйте в []rune. Итерация по байтам подходит только для ASCII-текста.'
        }
      ]
    },
    {
      id: 5,
      title: 'Пакет strings',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Стандартная библиотека для работы со строками'
        },
        {
          type: 'text',
          value: 'Пакет strings содержит десятки функций для работы со строками. Это ваш швейцарский нож для текста: разрезать, склеить, найти, заменить — всё здесь.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\nfunc main() {\n    s := "  Hello, World!  "\n    \n    // Обрезка пробелов\n    fmt.Println(strings.TrimSpace(s))       // "Hello, World!"\n    fmt.Println(strings.Trim(s, " "))       // "Hello, World!"\n    \n    // Регистр\n    fmt.Println(strings.ToUpper("hello"))   // HELLO\n    fmt.Println(strings.ToLower("WORLD"))   // world\n    fmt.Println(strings.Title("hello"))     // Hello (устарело, но работает)\n    \n    // Поиск\n    fmt.Println(strings.Contains("seafood", "foo"))  // true\n    fmt.Println(strings.HasPrefix("golang", "go"))   // true\n    fmt.Println(strings.HasSuffix("golang", "lang")) // true\n    fmt.Println(strings.Index("chicken", "ken"))     // 4\n    fmt.Println(strings.Count("cheese", "e"))        // 3\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\nfunc main() {\n    // Замена\n    s := "oink oink oink"\n    fmt.Println(strings.Replace(s, "oink", "moo", 2))  // "moo moo oink"\n    fmt.Println(strings.ReplaceAll(s, "oink", "moo"))  // "moo moo moo"\n    \n    // Разделение и объединение\n    parts := strings.Split("a,b,c", ",")\n    fmt.Println(parts)        // [a b c]\n    fmt.Println(len(parts))   // 3\n    \n    joined := strings.Join(parts, " - ")\n    fmt.Println(joined)       // a - b - c\n    \n    // Повторение\n    fmt.Println(strings.Repeat("ab", 3)) // ababab\n    \n    // Поля (разделение по пробелам)\n    fields := strings.Fields("  foo bar  baz   ")\n    fmt.Println(fields) // [foo bar baz]\n}'
        },
        {
          type: 'tip',
          value: 'strings.Fields лучше strings.Split(s, " ") для разбиения по пробелам, потому что Fields автоматически убирает лишние пробелы и пустые элементы.'
        }
      ]
    },
    {
      id: 6,
      title: 'strings.Builder — эффективное построение строк',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Зачем нужен Builder?'
        },
        {
          type: 'text',
          value: 'Представьте, что вы строите дом. Если каждый раз, добавляя кирпич, вы сносите весь дом и строите заново — это очень медленно. Именно это происходит при s += "x" в цикле. strings.Builder — это строительные леса: вы добавляете кирпичи (строки), а готовый дом (финальную строку) получаете в конце.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\nfunc main() {\n    // Плохо: O(n²) — каждый += создаёт новую строку\n    slow := ""\n    for i := 0; i < 5; i++ {\n        slow += fmt.Sprintf("item%d ", i)\n    }\n    fmt.Println(slow)\n    \n    // Хорошо: O(n) — Builder накапливает части\n    var sb strings.Builder\n    for i := 0; i < 5; i++ {\n        fmt.Fprintf(&sb, "item%d ", i)\n    }\n    fast := sb.String()\n    fmt.Println(fast)\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\nfunc main() {\n    var sb strings.Builder\n    \n    // Методы Builder\n    sb.WriteString("Hello")     // добавить строку\n    sb.WriteByte(\',\')           // добавить байт\n    sb.WriteRune(\' \')           // добавить руну\n    sb.WriteString("World")\n    sb.WriteByte(\'!\')\n    \n    fmt.Println(sb.String())    // Hello, World!\n    fmt.Println(sb.Len())       // 13 (длина в байтах)\n    \n    sb.Reset()                  // очистить Builder\n    fmt.Println(sb.String())    // (пустая строка)\n    fmt.Println(sb.Len())       // 0\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\n// Пример: создание CSV-строки\nfunc toCSV(items []string) string {\n    var sb strings.Builder\n    for i, item := range items {\n        if i > 0 {\n            sb.WriteByte(\',\')\n        }\n        sb.WriteString(item)\n    }\n    return sb.String()\n}\n\nfunc main() {\n    data := []string{"имя", "возраст", "город"}\n    fmt.Println(toCSV(data)) // имя,возраст,город\n}'
        },
        {
          type: 'note',
          value: 'strings.Builder не является потокобезопасным. Если несколько горутин пишут в один Builder — нужна синхронизация. Но обычно Builder используют в одной горутине.'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Работа со строками',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите функцию isPalindrome(s string) bool, которая проверяет, является ли строка палиндромом. Функция должна корректно работать с Unicode (русские буквы, эмодзи) и игнорировать регистр.',
      requirements: [
        'Функция должна вернуть true для "А роза упала на лапу Азора" (без пробелов)',
        'Функция должна вернуть true для "racecar"',
        'Функция должна корректно работать с кириллицей',
        'Функция должна игнорировать регистр символов',
        'Использовать []rune для правильной работы с Unicode'
      ],
      expectedOutput: 'true\ntrue\nfalse',
      hint: 'Сначала приведите строку к нижнему регистру с помощью strings.ToLower(), затем конвертируйте в []rune, и сравнивайте символы с двух концов.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "strings"\n)\n\nfunc isPalindrome(s string) bool {\n    // Приводим к нижнему регистру\n    s = strings.ToLower(s)\n    // Конвертируем в срез рун для правильной работы с Unicode\n    runes := []rune(s)\n    \n    i, j := 0, len(runes)-1\n    for i < j {\n        if runes[i] != runes[j] {\n            return false\n        }\n        i++\n        j--\n    }\n    return true\n}\n\nfunc main() {\n    fmt.Println(isPalindrome("racecar"))           // true\n    fmt.Println(isPalindrome("А роза упала на лапу Азора")) // false (с пробелами)\n    fmt.Println(isPalindrome("арозаупаланалапуазора"))      // true\n    fmt.Println(isPalindrome("hello"))             // false\n}',
      explanation: 'Ключевой момент — конвертация в []rune перед сравнением. Если работать с байтами, то для кириллицы каждый "символ" занимает 2 байта, и сравнение s[i] с s[j] будет некорректным. []rune обеспечивает работу с реальными Unicode-символами.'
    }
  ]
}
