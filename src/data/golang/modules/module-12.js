export default {
  id: 12,
  title: 'Карты (Maps)',
  description: 'Maps в Go — ключевая структура данных для хранения пар ключ-значение. Изучим создание, операции, итерацию и продвинутые паттерны использования карт.',
  lessons: [
    {
      id: 1,
      title: 'Объявление карт',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Map — словарь в Go'
        },
        {
          type: 'text',
          value: 'Map в Go — это как обычный словарь: вы ищете слово (ключ) и получаете его значение. В отличие от массива (доступ по числовому индексу), map позволяет использовать практически любой тип в качестве ключа.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Способ 1: объявление через var (nil map — нельзя писать!)\n    var m1 map[string]int\n    fmt.Println(m1)        // map[]\n    fmt.Println(m1 == nil) // true\n    // m1["key"] = 1  // ПАНИКА! assignment to entry in nil map\n    \n    // Способ 2: map literal (можно писать)\n    m2 := map[string]int{\n        "яблоко":  5,\n        "банан":   3,\n        "вишня":   10,\n    }\n    fmt.Println(m2) // map[банан:3 вишня:10 яблоко:5]\n    \n    // Способ 3: make() (рекомендуется для пустых карт)\n    m3 := make(map[string]int)\n    fmt.Println(m3)        // map[]\n    fmt.Println(m3 == nil) // false — можно писать!\n}'
        },
        {
          type: 'warning',
          value: 'Никогда не пишите в nil map! var m map[string]int создаёт nil map. Запись вызовет панику во время выполнения. Всегда используйте make() или инициализацию через литерал.'
        },
        {
          type: 'text',
          value: 'Ключами карты могут быть любые сравнимые типы: строки, числа, булевы значения, структуры. Слайсы, карты и функции не могут быть ключами.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Разные типы ключей\n    intKeys := map[int]string{1: "один", 2: "два"}\n    fmt.Println(intKeys[1]) // один\n    \n    // Структура как ключ\n    type Point struct{ X, Y int }\n    grid := map[Point]string{\n        {0, 0}: "начало",\n        {1, 0}: "вправо",\n        {0, 1}: "вверх",\n    }\n    fmt.Println(grid[Point{1, 0}]) // вправо\n}'
        }
      ]
    },
    {
      id: 2,
      title: 'make() и инициализация',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Создание карт с make()'
        },
        {
          type: 'text',
          value: 'Функция make() создаёт и инициализирует карту. Это как заказать пустой блокнот: он готов к записи. Можно указать начальный размер (hint) для оптимизации, но Go автоматически расширит карту при необходимости.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // make без подсказки размера\n    m1 := make(map[string]int)\n    \n    // make с подсказкой размера (только подсказка, не лимит!)\n    // Go выделит память как минимум на 100 элементов\n    m2 := make(map[string]int, 100)\n    \n    // Оба варианта работают одинаково\n    m1["a"] = 1\n    m2["a"] = 1\n    \n    fmt.Println(m1) // map[a:1]\n    fmt.Println(m2) // map[a:1]\n    \n    // Подсказка размера улучшает производительность\n    // если вы знаете приблизительный размер заранее\n}'
        },
        {
          type: 'tip',
          value: 'Если вы знаете приблизительное количество элементов заранее, передайте его в make(). Это снизит количество перевыделений памяти и ускорит программу.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Функция подсчёта слов\nfunc wordCount(text string) map[string]int {\n    counts := make(map[string]int)\n    word := ""\n    for _, r := range text + " " {\n        if r == \' \' || r == \'\\n\' || r == \'\\t\' {\n            if word != "" {\n                counts[word]++\n                word = ""\n            }\n        } else {\n            word += string(r)\n        }\n    }\n    return counts\n}\n\nfunc main() {\n    text := "go go go программирование go программирование"\n    counts := wordCount(text)\n    fmt.Println(counts)\n    // map[go:4 программирование:2]\n}'
        }
      ]
    },
    {
      id: 3,
      title: 'Добавление, получение и удаление',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'CRUD операции с картой'
        },
        {
          type: 'text',
          value: 'Операции с картой просты и интуитивны: запись через [], чтение через [], удаление через delete().'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    m := make(map[string]int)\n    \n    // Добавление / обновление\n    m["яблоко"] = 5\n    m["банан"] = 3\n    m["яблоко"] = 10 // обновление — просто перезапись\n    \n    fmt.Println(m) // map[банан:3 яблоко:10]\n    \n    // Чтение\n    apples := m["яблоко"]\n    fmt.Println("Яблок:", apples) // 10\n    \n    // Чтение несуществующего ключа возвращает нулевое значение!\n    oranges := m["апельсин"]\n    fmt.Println("Апельсинов:", oranges) // 0 (не ошибка!)\n    \n    // Удаление\n    delete(m, "банан")\n    fmt.Println(m) // map[яблоко:10]\n    \n    // delete с несуществующим ключом — НЕ паника, просто ничего\n    delete(m, "дуриан") // OK\n}'
        },
        {
          type: 'note',
          value: 'Обращение к несуществующему ключу возвращает нулевое значение типа (0 для int, "" для string, false для bool). Это может маскировать ошибки! Используйте "comma ok" идиому для проверки.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Типичный паттерн: инкремент счётчика\n    // Если ключ не существует, m[key] вернёт 0, и 0+1 = 1\n    counter := make(map[string]int)\n    words := []string{"go", "python", "go", "java", "go"}\n    \n    for _, word := range words {\n        counter[word]++ // работает даже для нового ключа!\n    }\n    \n    fmt.Println(counter) // map[go:3 java:1 python:1]\n}'
        }
      ]
    },
    {
      id: 4,
      title: 'Проверка существования ключа (comma ok)',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Как отличить "нет ключа" от "значение равно нулю"?'
        },
        {
          type: 'text',
          value: 'Проблема: m["ключ"] возвращает 0, даже если ключа нет. Как узнать, что счёт равен 0 потому что записан 0, а не потому что ключа нет? Для этого есть "comma ok" идиома — как двухэтажный лифт: первое значение это данные, второе — был ли ключ найден.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    scores := map[string]int{\n        "Алиса": 100,\n        "Боб":   0,  // намеренно 0\n    }\n    \n    // Без проверки: нельзя отличить "0" от "нет ключа"\n    aliceScore := scores["Алиса"]\n    eveScore := scores["Ева"]   // нет такого ключа\n    fmt.Println(aliceScore) // 100\n    fmt.Println(eveScore)   // 0 — но это нулевое значение!\n    \n    // С проверкой: comma ok идиома\n    score, ok := scores["Алиса"]\n    fmt.Printf("Алиса: %d, существует: %v\\n", score, ok) // 100, true\n    \n    score, ok = scores["Боб"]\n    fmt.Printf("Боб: %d, существует: %v\\n", score, ok)   // 0, true\n    \n    score, ok = scores["Ева"]\n    fmt.Printf("Ева: %d, существует: %v\\n", score, ok)   // 0, false\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    capitals := map[string]string{\n        "Казахстан": "Астана",\n        "Россия":    "Москва",\n        "Германия":  "Берлин",\n    }\n    \n    // Практичный пример: функция с проверкой\n    country := "Казахстан"\n    if capital, ok := capitals[country]; ok {\n        fmt.Printf("Столица %s — %s\\n", country, capital)\n    } else {\n        fmt.Printf("Столица %s неизвестна\\n", country)\n    }\n    \n    country = "Австралия"\n    if capital, ok := capitals[country]; ok {\n        fmt.Printf("Столица %s — %s\\n", country, capital)\n    } else {\n        fmt.Printf("Столица %s неизвестна\\n", country)\n    }\n}'
        },
        {
          type: 'tip',
          value: 'Идиома "comma ok" (v, ok := m[key]) используется не только в картах, но и в каналах (v, ok := <-ch) и в type assertions (v, ok := x.(Type)). Запомните этот паттерн!'
        }
      ]
    },
    {
      id: 5,
      title: 'Итерация по карте',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Перебор элементов карты'
        },
        {
          type: 'text',
          value: 'Итерация по карте через range, как и прогулка по рынку: вы обходите все прилавки (пары ключ-значение), но порядок обхода каждый раз разный! Go специально рандомизирует порядок итерации, чтобы программисты не полагались на определённый порядок.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    m := map[string]int{\n        "a": 1,\n        "b": 2,\n        "c": 3,\n    }\n    \n    // Итерация: ключ и значение\n    for k, v := range m {\n        fmt.Printf("%s: %d\\n", k, v)\n    }\n    \n    // Только ключи\n    fmt.Println("\\nТолько ключи:")\n    for k := range m {\n        fmt.Println(k)\n    }\n    \n    // Только значения (игнорируем ключ через _)\n    fmt.Println("\\nТолько значения:")\n    for _, v := range m {\n        fmt.Println(v)\n    }\n}'
        },
        {
          type: 'warning',
          value: 'Порядок итерации по карте непредсказуем и меняется от запуска к запуску. Если нужен определённый порядок — извлеките ключи в слайс, отсортируйте его и итерируйте по слайсу.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport (\n    "fmt"\n    "sort"\n)\n\nfunc main() {\n    m := map[string]int{\n        "банан":  3,\n        "яблоко": 5,\n        "вишня":  10,\n    }\n    \n    // Получаем ключи\n    keys := make([]string, 0, len(m))\n    for k := range m {\n        keys = append(keys, k)\n    }\n    \n    // Сортируем ключи\n    sort.Strings(keys)\n    \n    // Итерируем в отсортированном порядке\n    fmt.Println("Отсортированный вывод:")\n    for _, k := range keys {\n        fmt.Printf("%s: %d\\n", k, m[k])\n    }\n}'
        }
      ]
    },
    {
      id: 6,
      title: 'Карта срезов и вложенные карты',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Сложные структуры с картами'
        },
        {
          type: 'text',
          value: 'Карты могут содержать срезы или другие карты как значения. Это как картотека с папками (карта -> срез) или иерархическая структура данных (карта -> карта).'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Карта срезов: группировка элементов\n    groups := map[string][]string{\n        "фрукты":  {"яблоко", "банан", "манго"},\n        "овощи":   {"морковь", "огурец"},\n        "ягоды":   {"клубника", "черника"},\n    }\n    \n    fmt.Println("Фрукты:", groups["фрукты"])\n    \n    // Добавление элемента в срез внутри карты\n    groups["фрукты"] = append(groups["фрукты"], "киви")\n    fmt.Println("Фрукты после:", groups["фрукты"])\n    \n    // Если ключа нет — append работает с nil срезом\n    groups["злаки"] = append(groups["злаки"], "рис")\n    groups["злаки"] = append(groups["злаки"], "пшеница")\n    fmt.Println("Злаки:", groups["злаки"])\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Вложенные карты: как JSON объект\n    users := map[string]map[string]string{\n        "alice": {\n            "email": "alice@example.com",\n            "role":  "admin",\n        },\n        "bob": {\n            "email": "bob@example.com",\n            "role":  "user",\n        },\n    }\n    \n    fmt.Println("Email Alice:", users["alice"]["email"])\n    \n    // Важно: нельзя писать во вложенную карту если внешний ключ не существует!\n    // users["carol"]["email"] = "carol@example.com" // ПАНИКА!\n    \n    // Правильно: сначала создать вложенную карту\n    users["carol"] = make(map[string]string)\n    users["carol"]["email"] = "carol@example.com"\n    users["carol"]["role"] = "user"\n    fmt.Println("Email Carol:", users["carol"]["email"])\n}'
        },
        {
          type: 'warning',
          value: 'При работе с вложенными картами всегда проверяйте, что внешний ключ существует перед записью во внутреннюю карту. Иначе — паника!'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Карты как множества',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте функцию intersection(a, b []string) []string, которая возвращает пересечение двух срезов строк (элементы, присутствующие в обоих срезах). Используйте карту как множество (set) для эффективного решения.',
      requirements: [
        'Функция принимает два среза строк',
        'Возвращает срез с элементами, которые есть в обоих срезах',
        'Не должно быть дубликатов в результате',
        'Порядок элементов в результате не важен',
        'Использовать map[string]bool как множество'
      ],
      expectedOutput: '[go python]',
      hint: 'Создайте карту из элементов первого среза (ключ — элемент, значение — true). Затем итерируйтесь по второму срезу и проверяйте, есть ли элемент в карте.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sort"\n)\n\nfunc intersection(a, b []string) []string {\n    // Создаём множество из первого среза\n    set := make(map[string]bool, len(a))\n    for _, v := range a {\n        set[v] = true\n    }\n    \n    // Ищем пересечение\n    result := []string{}\n    seen := make(map[string]bool) // для дедупликации\n    for _, v := range b {\n        if set[v] && !seen[v] {\n            result = append(result, v)\n            seen[v] = true\n        }\n    }\n    \n    sort.Strings(result)\n    return result\n}\n\nfunc main() {\n    a := []string{"go", "python", "java", "rust"}\n    b := []string{"python", "go", "c++", "python"}\n    fmt.Println(intersection(a, b)) // [go python]\n    \n    c := []string{"a", "b", "c"}\n    d := []string{"d", "e", "f"}\n    fmt.Println(intersection(c, d)) // []\n}',
      explanation: 'Использование карты как множества — классический паттерн в Go. map[string]bool (или map[string]struct{} для экономии памяти) позволяет за O(1) проверить принадлежность элемента. Алгоритм работает за O(n+m), а не O(n*m) как у наивного решения с двойным циклом.'
    }
  ]
}
