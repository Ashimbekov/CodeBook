export default {
  id: 10,
  title: 'Слайсы',
  description: 'Срезы (слайсы) — самая важная структура данных в Go. Изучаем отличия от массивов, make(), append(), срезание, len/cap, copy, nil-срезы и внутреннее устройство.',
  lessons: [
    {
      id: 1,
      title: 'Срез vs Массив',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Почему срезы важнее массивов?'
        },
        {
          type: 'text',
          value: 'В реальном Go-коде срезы (slices) используются намного чаще массивов. Срез — это динамический массив: он может расти и уменьшаться. Большинство функций в стандартной библиотеке работают со срезами, а не с массивами.'
        },
        {
          type: 'text',
          value: 'Аналогия: Массив — это стол с фиксированным числом ящиков. Срез — это список покупок: вы можете добавлять и удалять пункты сколько угодно.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Массив - размер фиксирован, часть типа\n    arr := [3]int{1, 2, 3}\n    fmt.Printf("Массив: %v, тип: %T\\n", arr, arr)\n    // Массив: [1 2 3], тип: [3]int\n\n    // Срез - размер динамический, нет размера в типе\n    slice := []int{1, 2, 3}\n    fmt.Printf("Срез: %v, тип: %T\\n", slice, slice)\n    // Срез: [1 2 3], тип: []int\n\n    // Срез можно растить\n    slice = append(slice, 4, 5)\n    fmt.Println("После append:", slice) // [1 2 3 4 5]\n\n    // Нельзя добавить в массив!\n    // arr = append(arr, 4)  // ОШИБКА!\n\n    // Срез из массива\n    fromArr := arr[:]  // срез, ссылающийся на массив\n    fmt.Println("Срез из массива:", fromArr) // [1 2 3]\n}'
        },
        {
          type: 'list',
          value: 'Массив: тип включает размер ([3]int), передаётся по значению (копия), размер нельзя изменить\nСрез: тип не включает размер ([]int), ссылается на массив под капотом, размер можно изменить через append'
        }
      ]
    },
    {
      id: 2,
      title: 'Создание срезов: make()',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Функция make для создания срезов'
        },
        {
          type: 'text',
          value: 'Функция make() — встроенная функция для создания срезов, map и каналов. Для срезов она принимает тип, длину и (опционально) ёмкость.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // make(type, len) - срез с длиной и ёмкостью = len\n    s1 := make([]int, 5)\n    fmt.Printf("s1: %v, len=%d, cap=%d\\n", s1, len(s1), cap(s1))\n    // s1: [0 0 0 0 0], len=5, cap=5\n\n    // make(type, len, cap) - срез с заданной ёмкостью\n    s2 := make([]int, 3, 10)\n    fmt.Printf("s2: %v, len=%d, cap=%d\\n", s2, len(s2), cap(s2))\n    // s2: [0 0 0], len=3, cap=10\n\n    // Разница: len - текущий размер, cap - выделено памяти\n    s2 = append(s2, 4, 5, 6) // добавляем без переаллокации!\n    fmt.Printf("s2: %v, len=%d, cap=%d\\n", s2, len(s2), cap(s2))\n    // s2: [0 0 0 4 5 6], len=6, cap=10\n\n    // Другие способы создания\n    s3 := []int{10, 20, 30}          // литерал\n    s4 := []string{}                  // пустой срез\n    s5 := make([]float64, 0, 100)     // пустой с ёмкостью 100\n\n    fmt.Println(s3, s4)\n    fmt.Printf("s5: len=%d, cap=%d\\n", len(s5), cap(s5))\n}'
        },
        {
          type: 'tip',
          value: 'Если вы знаете приблизительный размер среза заранее — задайте ёмкость через make([]T, 0, capacity). Это избежит множественных реаллокаций при append и ускорит программу.'
        }
      ]
    },
    {
      id: 3,
      title: 'append — добавление элементов',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Функция append'
        },
        {
          type: 'text',
          value: 'append — встроенная функция для добавления элементов в срез. Она может добавить один или несколько элементов. Если текущей ёмкости не хватает, append создаёт новый, больший массив под капотом.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Базовый append\n    s := []int{1, 2, 3}\n    s = append(s, 4)       // добавить один элемент\n    s = append(s, 5, 6, 7) // добавить несколько\n    fmt.Println(s) // [1 2 3 4 5 6 7]\n\n    // Слияние срезов через append + ...\n    a := []int{1, 2, 3}\n    b := []int{4, 5, 6}\n    c := append(a, b...) // ... разворачивает срез\n    fmt.Println(c) // [1 2 3 4 5 6]\n\n    // append возвращает новый срез!\n    // Всегда присваивайте результат обратно: s = append(s, ...)\n    original := []int{1, 2, 3}\n    _ = append(original, 4) // БАГ: результат выброшен!\n    fmt.Println(original)   // [1 2 3] - не изменился!\n\n    original = append(original, 4) // Правильно\n    fmt.Println(original) // [1 2 3 4]\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Наблюдаем за ростом ёмкости\n    s := make([]int, 0)\n    prevCap := 0\n\n    for i := 0; i < 20; i++ {\n        s = append(s, i)\n        if cap(s) != prevCap {\n            fmt.Printf("len=%d, cap=%d (был %d)\\n", len(s), cap(s), prevCap)\n            prevCap = cap(s)\n        }\n    }\n    // len=1, cap=1 (был 0)\n    // len=2, cap=2 (был 1)\n    // len=3, cap=4 (был 2)\n    // len=5, cap=8 (был 4)\n    // len=9, cap=16 (был 8)\n    // len=17, cap=32 (был 16)\n    // Ёмкость удваивается при нехватке места!\n}'
        },
        {
          type: 'warning',
          value: 'Всегда используйте результат append: s = append(s, value). Если append создаёт новый массив под капотом, старый срез указывает на старые данные и не будет содержать добавленные элементы.'
        }
      ]
    },
    {
      id: 4,
      title: 'Срезание (slicing)',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Создание подсрезов'
        },
        {
          type: 'text',
          value: 'Из среза можно получить подсрез с помощью синтаксиса s[low:high]. Подсрез разделяет память с оригинальным срезом — это не копия! Изменения в подсрезе видны в оригинале.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    s := []int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}\n\n    // s[low:high] - элементы от low до high (не включая high)\n    fmt.Println(s[2:5])  // [2 3 4]\n    fmt.Println(s[:3])   // [0 1 2] - от начала\n    fmt.Println(s[7:])   // [7 8 9] - до конца\n    fmt.Println(s[:])    // [0 1 2 3 4 5 6 7 8 9] - всё\n\n    // Подсрез РАЗДЕЛЯЕТ память с оригиналом!\n    sub := s[2:5]\n    sub[0] = 999 // изменяем подсрез\n    fmt.Println(s)   // [0 1 999 3 4 5 6 7 8 9] - оригинал изменился!\n    fmt.Println(sub) // [999 3 4]\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Трёхиндексное срезание: s[low:high:max]\n    // max ограничивает ёмкость подсреза\n    s := []int{0, 1, 2, 3, 4, 5}\n\n    // Обычный подсрез - ёмкость = cap(s) - low\n    sub1 := s[1:3]\n    fmt.Printf("sub1: %v, len=%d, cap=%d\\n", sub1, len(sub1), cap(sub1))\n    // sub1: [1 2], len=2, cap=5\n\n    // Трёхиндексный - ограничиваем ёмкость\n    sub2 := s[1:3:4]\n    fmt.Printf("sub2: %v, len=%d, cap=%d\\n", sub2, len(sub2), cap(sub2))\n    // sub2: [1 2], len=2, cap=3\n\n    // Практичные операции\n    words := []string{"Go", "is", "awesome", "and", "fast"}\n\n    // Первые 3 слова\n    first3 := words[:3]\n    fmt.Println("Первые 3:", first3)\n\n    // Последние 2 слова\n    last2 := words[len(words)-2:]\n    fmt.Println("Последние 2:", last2)\n}'
        },
        {
          type: 'note',
          value: 'Важно помнить: подсрез не копирует данные. Это означает, что если вы держите маленький подсрез большого среза, весь большой массив будет оставаться в памяти. Для независимой копии используйте copy().'
        }
      ]
    },
    {
      id: 5,
      title: 'len и cap',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Длина и ёмкость среза'
        },
        {
          type: 'text',
          value: 'Каждый срез имеет два важных свойства: len (длина — сколько элементов сейчас) и cap (ёмкость — сколько элементов можно добавить без реаллокации). Понимание len и cap важно для оптимизации.'
        },
        {
          type: 'text',
          value: 'Аналогия: Срез — это стакан. len — сколько воды налито сейчас. cap — вместимость стакана. Когда воды больше чем вмещает стакан, нужно взять больший (реаллокация).'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // len и cap для разных срезов\n    s1 := []int{1, 2, 3}\n    fmt.Printf("s1: len=%d, cap=%d\\n", len(s1), cap(s1))\n    // s1: len=3, cap=3\n\n    s2 := make([]int, 3, 10)\n    fmt.Printf("s2: len=%d, cap=%d\\n", len(s2), cap(s2))\n    // s2: len=3, cap=10\n\n    // Срезание влияет на len и cap\n    s := []int{0, 1, 2, 3, 4, 5}\n    fmt.Printf("s: len=%d, cap=%d\\n", len(s), cap(s))\n    // s: len=6, cap=6\n\n    sub := s[2:4]\n    fmt.Printf("sub s[2:4]: len=%d, cap=%d\\n", len(sub), cap(sub))\n    // sub: len=2, cap=4 (от индекса 2 до конца оригинального массива)\n\n    // Увеличиваем через len среза\n    sub = sub[:cap(sub)] // расширяем до максимальной ёмкости\n    fmt.Printf("expanded: %v, len=%d, cap=%d\\n", sub, len(sub), cap(sub))\n    // expanded: [2 3 4 5], len=4, cap=4\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Эффективное накопление данных\nfunc collectEvenNumbers(max int) []int {\n    // Предвыделяем память\n    result := make([]int, 0, max/2)\n    for i := 2; i <= max; i += 2 {\n        result = append(result, i)\n    }\n    return result\n}\n\nfunc main() {\n    evens := collectEvenNumbers(20)\n    fmt.Printf("Чётные числа: %v\\n", evens)\n    fmt.Printf("len=%d, cap=%d\\n", len(evens), cap(evens))\n    // Чётные числа: [2 4 6 8 10 12 14 16 18 20]\n    // len=10, cap=10\n}'
        }
      ]
    },
    {
      id: 6,
      title: 'copy — копирование срезов',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Функция copy'
        },
        {
          type: 'text',
          value: 'Функция copy() копирует элементы из одного среза в другой. В отличие от срезания, copy создаёт независимую копию данных. Изменения в копии не влияют на источник.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    src := []int{1, 2, 3, 4, 5}\n\n    // Создаём независимую копию\n    dst := make([]int, len(src))\n    n := copy(dst, src)\n    fmt.Printf("Скопировано %d элементов\\n", n) // 5\n    fmt.Println("src:", src) // [1 2 3 4 5]\n    fmt.Println("dst:", dst) // [1 2 3 4 5]\n\n    // Изменяем копию - оригинал не меняется!\n    dst[0] = 999\n    fmt.Println("src после изменения dst:", src) // [1 2 3 4 5]\n    fmt.Println("dst после изменения:", dst)     // [999 2 3 4 5]\n\n    // copy копирует min(len(dst), len(src)) элементов\n    small := make([]int, 3)\n    copy(small, src)\n    fmt.Println("small:", small) // [1 2 3] (только 3 элемента)\n\n    // Копирование части среза\n    partial := make([]int, 5)\n    copy(partial[1:3], src[2:4]) // копируем src[2:4] -> partial[1:3]\n    fmt.Println("partial:", partial) // [0 3 4 0 0]\n}'
        },
        {
          type: 'heading',
          value: 'Удаление элементов через copy'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Удаление элемента по индексу\nfunc removeAt(s []int, index int) []int {\n    // Копируем элементы после index на место index\n    return append(s[:index], s[index+1:]...)\n}\n\n// Вставка элемента по индексу\nfunc insertAt(s []int, index int, value int) []int {\n    s = append(s, 0) // расширяем срез\n    copy(s[index+1:], s[index:]) // сдвигаем элементы\n    s[index] = value\n    return s\n}\n\nfunc main() {\n    s := []int{1, 2, 3, 4, 5}\n    fmt.Println("Исходный:", s)\n\n    s = removeAt(s, 2) // удаляем индекс 2 (значение 3)\n    fmt.Println("После удаления:", s) // [1 2 4 5]\n\n    s = insertAt(s, 1, 99) // вставляем 99 на позицию 1\n    fmt.Println("После вставки:", s) // [1 99 2 4 5]\n}'
        },
        {
          type: 'tip',
          value: 'Паттерн append(s[:i], s[i+1:]...) — стандартный способ удалить элемент по индексу в Go. Запомните его, он встречается очень часто!'
        }
      ]
    },
    {
      id: 7,
      title: 'Nil-срезы',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Нулевое значение среза — nil'
        },
        {
          type: 'text',
          value: 'Нулевое значение среза — это nil. Nil-срез не указывает ни на какой массив. Но важно: nil-срез и пустой срез ([]int{}) ведут себя одинаково в большинстве операций — и тот, и другой имеют длину 0.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // nil-срез\n    var s []int\n    fmt.Println(s == nil)  // true\n    fmt.Println(len(s))    // 0\n    fmt.Println(cap(s))    // 0\n\n    // Можно делать append на nil-срез!\n    s = append(s, 1, 2, 3)\n    fmt.Println(s)        // [1 2 3]\n    fmt.Println(s == nil) // false теперь\n\n    // Пустой срез (не nil)\n    empty := []int{}\n    fmt.Println(empty == nil) // false\n    fmt.Println(len(empty))   // 0\n\n    // Оба имеют длину 0 и работают одинаково\n    fmt.Println("nil срез:", s[:0])\n    fmt.Println("пустой:", empty)\n\n    // Разница важна при JSON-сериализации!\n    // nil -> null в JSON\n    // []int{} -> [] в JSON\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Функция возвращает nil если данных нет\nfunc getPositives(numbers []int) []int {\n    var result []int // nil-срез изначально\n    for _, n := range numbers {\n        if n > 0 {\n            result = append(result, n)\n        }\n    }\n    return result // может вернуть nil!\n}\n\nfunc main() {\n    nums1 := []int{-1, 2, -3, 4, 5}\n    nums2 := []int{-1, -2, -3}\n\n    positives1 := getPositives(nums1)\n    positives2 := getPositives(nums2)\n\n    fmt.Println("Положительные из nums1:", positives1) // [2 4 5]\n    fmt.Println("Положительные из nums2:", positives2) // []\n    fmt.Println("positives2 == nil:", positives2 == nil) // true\n\n    // Безопасно работать с nil-срезом\n    for _, v := range positives2 { // range на nil работает корректно\n        fmt.Println(v)\n    }\n    fmt.Println("Цикл завершён без паники")\n}'
        },
        {
          type: 'note',
          value: 'for range, len(), cap() и append() работают корректно с nil-срезами. Это делает nil-срез безопасным "нулевым значением" для функций, которые могут не вернуть данных.'
        }
      ]
    },
    {
      id: 8,
      title: 'Внутреннее устройство среза',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Как срезы устроены внутри?'
        },
        {
          type: 'text',
          value: 'Срез в Go — это структура из трёх полей: указатель на массив (ptr), длина (len) и ёмкость (cap). При передаче в функцию копируется эта структура, но не сам массив. Поэтому изменения элементов через срез видны снаружи.'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\n// Срез передаётся по значению, но указывает на тот же массив\nfunc modifySlice(s []int) {\n    s[0] = 999 // изменяем через указатель - оригинал меняется!\n}\n\nfunc appendSlice(s []int) {\n    s = append(s, 100) // создаём новый массив - оригинал НЕ меняется!\n    fmt.Println("Внутри функции:", s)\n}\n\nfunc appendSlicePtr(s *[]int) {\n    *s = append(*s, 100) // меняем оригинальный срез через указатель\n}\n\nfunc main() {\n    original := []int{1, 2, 3}\n\n    modifySlice(original)\n    fmt.Println("После modifySlice:", original) // [999 2 3] - изменился!\n\n    original2 := []int{1, 2, 3}\n    appendSlice(original2)\n    fmt.Println("После appendSlice:", original2) // [1 2 3] - не изменился!\n\n    appendSlicePtr(&original2)\n    fmt.Println("После appendSlicePtr:", original2) // [1 2 3 100] - изменился!\n}'
        },
        {
          type: 'code',
          language: 'go',
          value: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Несколько срезов на один массив\n    backing := [8]int{1, 2, 3, 4, 5, 6, 7, 8}\n\n    s1 := backing[0:4] // [1 2 3 4]\n    s2 := backing[4:8] // [5 6 7 8]\n    s3 := backing[2:6] // [3 4 5 6] - перекрывается с обоими!\n\n    fmt.Println("s1:", s1)\n    fmt.Println("s2:", s2)\n    fmt.Println("s3:", s3)\n\n    // Изменяем через s3 - s1 и s2 тоже меняются!\n    s3[1] = 999 // это backing[3]\n    fmt.Println("\\nПосле s3[1] = 999:")\n    fmt.Println("backing:", backing) // [1 2 3 999 5 6 7 8]\n    fmt.Println("s1:", s1)           // [1 2 3 999]\n    fmt.Println("s3:", s3)           // [3 999 5 6]\n}'
        },
        {
          type: 'tip',
          value: 'Чтобы срез не разделял память с оригиналом, используйте copy(): dst := make([]T, len(src)); copy(dst, src). Или просто append([]T(nil), src...) — это тоже создаёт копию!'
        }
      ]
    },
    {
      id: 9,
      title: 'Практика: Стек и очередь на срезах',
      type: 'practice',
      difficulty: 'intermediate',
      description: 'Реализуйте структуры данных Стек (LIFO) и Очередь (FIFO) на основе срезов. Стек поддерживает Push и Pop, Очередь — Enqueue и Dequeue.',
      requirements: [
        'Тип Stack — срез []int с методами Push(v int) и Pop() (int, bool)',
        'Push добавляет элемент на вершину стека',
        'Pop удаляет и возвращает верхний элемент (false если стек пуст)',
        'Тип Queue — срез []string с методами Enqueue(v string) и Dequeue() (string, bool)',
        'Enqueue добавляет в конец очереди',
        'Dequeue удаляет и возвращает из начала очереди (false если пуста)',
        'Продемонстрируйте работу обеих структур'
      ],
      expectedOutput: 'Стек:\nPush: 1, 2, 3\nPop: 3\nPop: 2\nPop: 1\nPop из пустого: 0, false\n\nОчередь:\nEnqueue: задача-1, задача-2, задача-3\nDequeue: задача-1\nDequeue: задача-2\nDequeue: задача-3\nDequeue из пустой: , false',
      hint: 'Стек: Push = append, Pop = последний элемент + s = s[:len(s)-1]. Очередь: Enqueue = append, Dequeue = первый элемент + s = s[1:]. Используйте указатели (*Stack, *Queue) в методах, чтобы изменения были видны снаружи.',
      solution: 'package main\n\nimport "fmt"\n\ntype Stack []int\n\nfunc (s *Stack) Push(v int) {\n    *s = append(*s, v)\n}\n\nfunc (s *Stack) Pop() (int, bool) {\n    if len(*s) == 0 {\n        return 0, false\n    }\n    top := (*s)[len(*s)-1]\n    *s = (*s)[:len(*s)-1]\n    return top, true\n}\n\ntype Queue []string\n\nfunc (q *Queue) Enqueue(v string) {\n    *q = append(*q, v)\n}\n\nfunc (q *Queue) Dequeue() (string, bool) {\n    if len(*q) == 0 {\n        return "", false\n    }\n    front := (*q)[0]\n    *q = (*q)[1:]\n    return front, true\n}\n\nfunc main() {\n    fmt.Println("Стек:")\n    var s Stack\n    fmt.Println("Push: 1, 2, 3")\n    s.Push(1)\n    s.Push(2)\n    s.Push(3)\n\n    for {\n        v, ok := s.Pop()\n        if !ok {\n            fmt.Printf("Pop из пустого: %d, %t\\n", v, ok)\n            break\n        }\n        fmt.Println("Pop:", v)\n    }\n\n    fmt.Println()\n    fmt.Println("Очередь:")\n    var q Queue\n    fmt.Println("Enqueue: задача-1, задача-2, задача-3")\n    q.Enqueue("задача-1")\n    q.Enqueue("задача-2")\n    q.Enqueue("задача-3")\n\n    for {\n        v, ok := q.Dequeue()\n        if !ok {\n            fmt.Printf("Dequeue из пустой: %q, %t\\n", v, ok)\n            break\n        }\n        fmt.Println("Dequeue:", v)\n    }\n}',
      explanation: 'Стек реализован как именованный тип на основе []int. Методы принимают указатель *Stack, чтобы изменения среза были видны снаружи (без указателя append создаст новый срез и изменения потеряются). Pop возвращает два значения: значение и флаг успеха — это идиоматичный Go. Очередь работает аналогично, но Dequeue берёт из начала (s[0]) и сдвигает срез (s[1:]). Это простая реализация; для высоконагруженного кода очередь лучше реализовывать через кольцевой буфер.'
    }
  ]
}
