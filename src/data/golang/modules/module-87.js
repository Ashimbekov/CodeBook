export default {
  id: 87,
  title: 'Практикум: Слайсы и карты',
  description: 'Десять практических задач на работу со слайсами и картами в Go: удаление дубликатов, ротация, слияние, частота слов и другие типовые алгоритмы.',
  lessons: [
    {
      id: 1,
      title: 'Удаление дубликатов из слайса',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши функцию удаления дубликатов из слайса, сохраняющую порядок первого вхождения элементов.',
      requirements: [
        'Функция Unique[T comparable](slice []T) []T — дженерик версия',
        'Сохранять порядок первого вхождения',
        'Работать с []int, []string',
        'Проверить: [1,2,3,2,1,4], ["a","b","a","c","b"], []'
      ],
      expectedOutput: '[1 2 3 2 1 4] -> [1 2 3 4]\n[a b a c b] -> [a b c]\n[] -> []',
      hint: 'Используй map[T]bool для отслеживания встреченных элементов. Итерируй по слайсу: если элемент не в map — добавь в результат и поставь map[el] = true.',
      solution: 'package main\n\nimport "fmt"\n\nfunc Unique[T comparable](slice []T) []T {\n    seen := make(map[T]bool)\n    result := make([]T, 0, len(slice))\n    for _, v := range slice {\n        if !seen[v] {\n            seen[v] = true\n            result = append(result, v)\n        }\n    }\n    return result\n}\n\nfunc main() {\n    ints := []int{1, 2, 3, 2, 1, 4}\n    fmt.Printf("%v -> %v\\n", ints, Unique(ints))\n\n    strs := []string{"a", "b", "a", "c", "b"}\n    fmt.Printf("%v -> %v\\n", strs, Unique(strs))\n\n    empty := []int{}\n    fmt.Printf("%v -> %v\\n", empty, Unique(empty))\n}',
      explanation: 'map[T]bool с ключом comparable позволяет отслеживать уникальные элементы за O(1). Дженерики в Go 1.18+ делают функцию универсальной. make([]T, 0, len(slice)) предварительно выделяет память, избегая лишних аллокаций.'
    },
    {
      id: 2,
      title: 'Ротация слайса',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй функцию ротации слайса влево и вправо на k позиций.',
      requirements: [
        'RotateLeft(slice []int, k int) []int — поворот влево',
        'RotateRight(slice []int, k int) []int — поворот вправо',
        'Обработать k > len(slice) через операцию %',
        'Не изменять исходный слайс',
        'Проверить с k=2 для [1,2,3,4,5]'
      ],
      expectedOutput: '[1 2 3 4 5] rotate left 2 -> [3 4 5 1 2]\n[1 2 3 4 5] rotate right 2 -> [4 5 1 2 3]\n[1 2 3] rotate left 5 -> [3 1 2]',
      hint: 'Для RotateLeft: новый слайс = slice[k:] + slice[:k]. Нормализуй k: k = k % len(slice). Для RotateRight: RotateLeft с k = len - k.',
      solution: 'package main\n\nimport "fmt"\n\nfunc RotateLeft(slice []int, k int) []int {\n    n := len(slice)\n    if n == 0 {\n        return []int{}\n    }\n    k = k % n\n    if k < 0 {\n        k += n\n    }\n    result := make([]int, n)\n    copy(result, slice[k:])\n    copy(result[n-k:], slice[:k])\n    return result\n}\n\nfunc RotateRight(slice []int, k int) []int {\n    n := len(slice)\n    if n == 0 {\n        return []int{}\n    }\n    return RotateLeft(slice, n-k%n)\n}\n\nfunc main() {\n    s := []int{1, 2, 3, 4, 5}\n    fmt.Printf("%v rotate left 2 -> %v\\n", s, RotateLeft(s, 2))\n    fmt.Printf("%v rotate right 2 -> %v\\n", s, RotateRight(s, 2))\n    fmt.Printf("[1 2 3] rotate left 5 -> %v\\n", RotateLeft([]int{1, 2, 3}, 5))\n}',
      explanation: 'k % n нормализует k — если k > len, мы делаем полный оборот и результат тот же. copy эффективнее append для копирования подслайсов. RotateRight через RotateLeft: поворот вправо на k = поворот влево на (n - k).'
    },
    {
      id: 3,
      title: 'Слияние отсортированных слайсов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй слияние двух отсортированных слайсов в один отсортированный слайс (алгоритм merge из merge sort).',
      requirements: [
        'MergeSorted(a, b []int) []int — слияние двух отсортированных слайсов',
        'Результирующий слайс должен быть отсортирован',
        'Сложность O(n+m) — без повторной сортировки',
        'Обработать случаи когда один или оба слайса пусты'
      ],
      expectedOutput: '[1 3 5] + [2 4 6] -> [1 2 3 4 5 6]\n[1 2 3] + [] -> [1 2 3]\n[] + [1] -> [1]\n[1 1 2] + [1 2 3] -> [1 1 1 2 2 3]',
      hint: 'Два указателя i и j для двух слайсов. На каждом шаге берём меньший элемент и продвигаем его указатель. После основного цикла добавляем оставшиеся элементы.',
      solution: 'package main\n\nimport "fmt"\n\nfunc MergeSorted(a, b []int) []int {\n    result := make([]int, 0, len(a)+len(b))\n    i, j := 0, 0\n    for i < len(a) && j < len(b) {\n        if a[i] <= b[j] {\n            result = append(result, a[i])\n            i++\n        } else {\n            result = append(result, b[j])\n            j++\n        }\n    }\n    result = append(result, a[i:]...)\n    result = append(result, b[j:]...)\n    return result\n}\n\nfunc main() {\n    fmt.Printf("[1 3 5] + [2 4 6] -> %v\\n",\n        MergeSorted([]int{1, 3, 5}, []int{2, 4, 6}))\n    fmt.Printf("[1 2 3] + [] -> %v\\n",\n        MergeSorted([]int{1, 2, 3}, []int{}))\n    fmt.Printf("[] + [1] -> %v\\n",\n        MergeSorted([]int{}, []int{1}))\n    fmt.Printf("[1 1 2] + [1 2 3] -> %v\\n",\n        MergeSorted([]int{1, 1, 2}, []int{1, 2, 3}))\n}',
      explanation: 'Алгоритм слияния — основа merge sort. Два указателя двигаются по слайсам, выбирая меньший элемент. append(result, a[i:]...) добавляет все оставшиеся элементы одного слайса после того как второй исчерпан. Сложность O(n+m).'
    },
    {
      id: 4,
      title: 'Частота слов',
      type: 'practice',
      difficulty: 'easy',
      description: 'Подсчитай частоту каждого слова в тексте и выведи топ-5 самых частых слов.',
      requirements: [
        'WordFrequency(text string) map[string]int — возвращает частоту слов',
        'Игнорировать регистр и пунктуацию',
        'TopN(freq map[string]int, n int) []string — топ N слов по частоте',
        'Вывести топ-5 с их частотой'
      ],
      expectedOutput: 'Топ-5 слов:\n1. "go" - 3\n2. "is" - 2\n3. "a" - 2\n4. "language" - 1\n5. "great" - 1',
      hint: 'Используй strings.Fields для разбивки по пробелам, strings.ToLower для регистра, strings.Trim(word, ".,!?") для пунктуации. Для сортировки по частоте создай []struct{word string; count int} и sort.Slice.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sort"\n    "strings"\n    "unicode"\n)\n\nfunc WordFrequency(text string) map[string]int {\n    freq := make(map[string]int)\n    words := strings.Fields(strings.ToLower(text))\n    for _, word := range words {\n        // Убираем пунктуацию\n        cleaned := strings.TrimFunc(word, func(r rune) bool {\n            return !unicode.IsLetter(r) && !unicode.IsDigit(r)\n        })\n        if cleaned != "" {\n            freq[cleaned]++\n        }\n    }\n    return freq\n}\n\ntype wordCount struct {\n    word  string\n    count int\n}\n\nfunc TopN(freq map[string]int, n int) []wordCount {\n    wcs := make([]wordCount, 0, len(freq))\n    for w, c := range freq {\n        wcs = append(wcs, wordCount{w, c})\n    }\n    sort.Slice(wcs, func(i, j int) bool {\n        if wcs[i].count != wcs[j].count {\n            return wcs[i].count > wcs[j].count\n        }\n        return wcs[i].word < wcs[j].word\n    })\n    if n > len(wcs) {\n        n = len(wcs)\n    }\n    return wcs[:n]\n}\n\nfunc main() {\n    text := "Go is a great language. Go is fast. Go language is simple."\n    freq := WordFrequency(text)\n    top := TopN(freq, 5)\n    fmt.Println("Топ-5 слов:")\n    for i, wc := range top {\n        fmt.Printf("%d. %q - %d\\n", i+1, wc.word, wc.count)\n    }\n}',
      explanation: 'strings.TrimFunc удаляет символы с обоих концов, пока предикат возвращает true — это надёжнее чем перечислять конкретные символы. При одинаковой частоте сортируем по алфавиту для детерминированного вывода (карты не упорядочены).'
    },
    {
      id: 5,
      title: 'Группировка по первой букве',
      type: 'practice',
      difficulty: 'easy',
      description: 'Сгруппируй слова из слайса по первой букве и выведи результат в алфавитном порядке.',
      requirements: [
        'GroupByFirstLetter(words []string) map[rune][]string',
        'Ключ — первая буква (в нижнем регистре)',
        'Слова в каждой группе отсортировать',
        'Вывести группы в алфавитном порядке ключей',
        'Обработать пустые строки (игнорировать)'
      ],
      expectedOutput: 'a: [apple apricot]\nb: [banana berry]\nc: [cherry]\ng: [grape]\nm: [mango melon]',
      hint: 'Для получения первой буквы: []rune(word)[0]. После группировки для вывода в порядке ключей: собери ключи в []rune, отсортируй через sort.Slice, итерируй по отсортированным ключам.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sort"\n    "strings"\n)\n\nfunc GroupByFirstLetter(words []string) map[rune][]string {\n    groups := make(map[rune][]string)\n    for _, word := range words {\n        if word == "" {\n            continue\n        }\n        key := []rune(strings.ToLower(word))[0]\n        groups[key] = append(groups[key], word)\n    }\n    for k := range groups {\n        sort.Strings(groups[k])\n    }\n    return groups\n}\n\nfunc main() {\n    words := []string{"apple", "banana", "cherry", "apricot", "berry", "grape", "mango", "melon"}\n    groups := GroupByFirstLetter(words)\n\n    // Собираем ключи и сортируем\n    keys := make([]rune, 0, len(groups))\n    for k := range groups {\n        keys = append(keys, k)\n    }\n    sort.Slice(keys, func(i, j int) bool { return keys[i] < keys[j] })\n\n    for _, k := range keys {\n        fmt.Printf("%c: %v\\n", k, groups[k])\n    }\n}',
      explanation: 'Карта не гарантирует порядок итерации — поэтому для детерминированного вывода нужно собрать ключи, отсортировать и итерировать по ним. sort.Strings сортирует строки в группе. []rune(word)[0] корректно получает первый символ Unicode.'
    },
    {
      id: 6,
      title: 'Задача Two Sum',
      type: 'practice',
      difficulty: 'medium',
      description: 'Классическая задача Two Sum: найди два числа в слайсе, сумма которых равна target. Верни их индексы.',
      requirements: [
        'TwoSum(nums []int, target int) (int, int, bool) — индексы двух чисел и флаг нахождения',
        'Использовать хеш-таблицу для O(n) решения',
        'Проверить: [2,7,11,15] target=9, [3,2,4] target=6, [3,3] target=6, [1,2] target=10'
      ],
      expectedOutput: '[2 7 11 15] target=9 -> (0, 1)\n[3 2 4] target=6 -> (1, 2)\n[3 3] target=6 -> (0, 1)\n[1 2] target=10 -> не найдено',
      hint: 'Хеш-подход: создай map[int]int где key=значение, value=индекс. Для каждого nums[i] проверь: есть ли (target - nums[i]) в map? Если да — нашли пару. Если нет — добавь nums[i] в map.',
      solution: 'package main\n\nimport "fmt"\n\nfunc TwoSum(nums []int, target int) (int, int, bool) {\n    seen := make(map[int]int) // value -> index\n    for i, num := range nums {\n        complement := target - num\n        if j, ok := seen[complement]; ok {\n            return j, i, true\n        }\n        seen[num] = i\n    }\n    return 0, 0, false\n}\n\nfunc main() {\n    tests := []struct {\n        nums   []int\n        target int\n    }{\n        {[]int{2, 7, 11, 15}, 9},\n        {[]int{3, 2, 4}, 6},\n        {[]int{3, 3}, 6},\n        {[]int{1, 2}, 10},\n    }\n    for _, t := range tests {\n        i, j, found := TwoSum(t.nums, t.target)\n        if found {\n            fmt.Printf("%v target=%d -> (%d, %d)\\n", t.nums, t.target, i, j)\n        } else {\n            fmt.Printf("%v target=%d -> не найдено\\n", t.nums, t.target)\n        }\n    }\n}',
      explanation: 'O(n) решение через хеш-таблицу: для каждого элемента ищем его дополнение (target - num). Если дополнение уже в map — нашли пару. Важно не добавлять элемент в map ДО проверки — иначе [3,3] target=6 ошибочно даст (0,0).'
    },
    {
      id: 7,
      title: 'Пересечение слайсов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди пересечение двух слайсов (общие элементы). Верни каждый общий элемент столько раз, сколько он встречается в обоих слайсах.',
      requirements: [
        'Intersect(a, b []int) []int — элементы общие для обоих слайсов',
        'Учитывать кратность: если 2 встречается дважды в a и трижды в b, в результате будет дважды',
        'Порядок не важен',
        'Проверить: [1,2,2,1] и [2,2], [4,9,5] и [9,4,9,8,4]'
      ],
      expectedOutput: '[1 2 2 1] ∩ [2 2] -> [2 2]\n[4 9 5] ∩ [9 4 9 8 4] -> [4 9]',
      hint: 'Создай map[int]int с частотой элементов меньшего слайса. Для каждого элемента второго слайса: если он есть в map и count > 0 — добавь в результат и уменьши count.',
      solution: 'package main\n\nimport "fmt"\n\nfunc Intersect(a, b []int) []int {\n    freq := make(map[int]int)\n    for _, v := range a {\n        freq[v]++\n    }\n    var result []int\n    for _, v := range b {\n        if freq[v] > 0 {\n            result = append(result, v)\n            freq[v]--\n        }\n    }\n    return result\n}\n\nfunc main() {\n    fmt.Printf("[1 2 2 1] ∩ [2 2] -> %v\\n",\n        Intersect([]int{1, 2, 2, 1}, []int{2, 2}))\n    fmt.Printf("[4 9 5] ∩ [9 4 9 8 4] -> %v\\n",\n        Intersect([]int{4, 9, 5}, []int{9, 4, 9, 8, 4}))\n}',
      explanation: 'Частотная map позволяет учесть кратность. freq[v]-- уменьшает счётчик после использования — так мы не возьмём элемент больше раз, чем он встречается в первом слайсе. Порядок результата зависит от порядка обхода второго слайса.'
    },
    {
      id: 8,
      title: 'Разворачивание двумерного слайса',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши функцию, преобразующую двумерный слайс в одномерный (flatten).',
      requirements: [
        'Flatten(matrix [][]int) []int — разворачивает 2D в 1D',
        'Сохранять порядок элементов: строка за строкой',
        'FlattenDeep для []interface{} с произвольной вложенностью (бонус)',
        'Проверить: [[1,2,3],[4,5],[6,7,8,9]]'
      ],
      expectedOutput: '[[1 2 3] [4 5] [6 7 8 9]] -> [1 2 3 4 5 6 7 8 9]\n[[1 2] [3 [4 5]]] -> [1 2 3 4 5]',
      hint: 'Для Flatten: просто итерируй по строкам и добавляй элементы в результат через append. Для подсчёта итогового размера: суммируй len каждой строки для предварительного выделения памяти.',
      solution: 'package main\n\nimport "fmt"\n\nfunc Flatten(matrix [][]int) []int {\n    totalSize := 0\n    for _, row := range matrix {\n        totalSize += len(row)\n    }\n    result := make([]int, 0, totalSize)\n    for _, row := range matrix {\n        result = append(result, row...)\n    }\n    return result\n}\n\n// FlattenDeep для произвольной вложенности\nfunc FlattenDeep(data []interface{}) []int {\n    var result []int\n    for _, item := range data {\n        switch v := item.(type) {\n        case int:\n            result = append(result, v)\n        case []interface{}:\n            result = append(result, FlattenDeep(v)...)\n        case []int:\n            result = append(result, v...)\n        }\n    }\n    return result\n}\n\nfunc main() {\n    matrix := [][]int{{1, 2, 3}, {4, 5}, {6, 7, 8, 9}}\n    fmt.Printf("%v -> %v\\n", matrix, Flatten(matrix))\n\n    nested := []interface{}{1, 2, []interface{}{3, []int{4, 5}}}\n    fmt.Printf("[[1 2] [3 [4 5]]] -> %v\\n", FlattenDeep(nested))\n}',
      explanation: 'append(result, row...) разворачивает слайс row в отдельные аргументы — элегантный Go-идиом. Предварительный подсчёт totalSize и make с capacity избегает ненужных реаллокаций. FlattenDeep использует рекурсию и type switch для обработки вложенности.'
    },
    {
      id: 9,
      title: 'Разбивка слайса на чанки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй функцию разбивки слайса на подслайсы (чанки) заданного размера.',
      requirements: [
        'Chunk[T any](slice []T, size int) [][]T — дженерик версия',
        'Последний чанк может быть меньше size',
        'Возвращать ошибку если size <= 0',
        'Проверить: [1..10] по 3, ["a".."g"] по 2, [] по 3'
      ],
      expectedOutput: '[1 2 3 4 5 6 7 8 9 10] chunk(3) -> [[1 2 3] [4 5 6] [7 8 9] [10]]\n[a b c d e f g] chunk(2) -> [[a b] [c d] [e f] [g]]\n[] chunk(3) -> []',
      hint: 'Итерируй с шагом size: for i := 0; i < len(slice); i += size. Конец чанка: min(i+size, len(slice)). Добавляй slice[i:end] в результат.',
      solution: 'package main\n\nimport "fmt"\n\nfunc Chunk[T any](slice []T, size int) ([][]T, error) {\n    if size <= 0 {\n        return nil, fmt.Errorf("размер чанка должен быть > 0, получено %d", size)\n    }\n    if len(slice) == 0 {\n        return [][]T{}, nil\n    }\n    var chunks [][]T\n    for i := 0; i < len(slice); i += size {\n        end := i + size\n        if end > len(slice) {\n            end = len(slice)\n        }\n        chunk := make([]T, end-i)\n        copy(chunk, slice[i:end])\n        chunks = append(chunks, chunk)\n    }\n    return chunks, nil\n}\n\nfunc main() {\n    ints := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}\n    chunks, _ := Chunk(ints, 3)\n    fmt.Printf("%v chunk(3) -> %v\\n", ints, chunks)\n\n    strs := []string{"a", "b", "c", "d", "e", "f", "g"}\n    schunks, _ := Chunk(strs, 2)\n    fmt.Printf("%v chunk(2) -> %v\\n", strs, schunks)\n\n    empty := []int{}\n    echunks, _ := Chunk(empty, 3)\n    fmt.Printf("[] chunk(3) -> %v\\n", echunks)\n}',
      explanation: 'Дженерики делают Chunk универсальной — работает с любым типом. copy(chunk, slice[i:end]) создаёт независимую копию, изменение результата не затронет исходный слайс. min(i+size, len(slice)) защищает от выхода за пределы в последнем чанке.'
    },
    {
      id: 10,
      title: 'Наиболее частый элемент',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди наиболее часто встречающийся элемент в слайсе. При одинаковой частоте вернуть тот, что встречается первым.',
      requirements: [
        'MostFrequent[T comparable](slice []T) (T, int, bool) — элемент, частота, найден ли',
        'При одинаковой частоте вернуть элемент с наименьшим первым индексом',
        'Вернуть found=false для пустого слайса',
        'Проверить: [1,2,3,2,1,1], ["a","b","a","c"], []'
      ],
      expectedOutput: '[1 2 3 2 1 1] -> 1 (3 раза)\n[a b a c] -> "a" (2 раза)\n[] -> не найдено',
      hint: 'Два прохода: первый — частота (map), второй — поиск максимума с сохранением первого вхождения. Или один проход: обновляй максимум при freq[el] > maxFreq (строго больше — не >=).',
      solution: 'package main\n\nimport "fmt"\n\nfunc MostFrequent[T comparable](slice []T) (T, int, bool) {\n    var zero T\n    if len(slice) == 0 {\n        return zero, 0, false\n    }\n    freq := make(map[T]int)\n    for _, v := range slice {\n        freq[v]++\n    }\n    // Второй проход для сохранения первого вхождения при равной частоте\n    var best T\n    bestCount := 0\n    for _, v := range slice {\n        if freq[v] > bestCount {\n            bestCount = freq[v]\n            best = v\n        }\n    }\n    return best, bestCount, true\n}\n\nfunc main() {\n    ints := []int{1, 2, 3, 2, 1, 1}\n    v, count, ok := MostFrequent(ints)\n    if ok {\n        fmt.Printf("%v -> %v (%d раза)\\n", ints, v, count)\n    }\n\n    strs := []string{"a", "b", "a", "c"}\n    sv, sc, sok := MostFrequent(strs)\n    if sok {\n        fmt.Printf("%v -> %q (%d раза)\\n", strs, sv, sc)\n    }\n\n    _, _, found := MostFrequent([]int{})\n    fmt.Printf("[] -> найдено: %v\\n", found)\n}',
      explanation: 'Два прохода: первый строит частотную карту за O(n), второй проходит по оригинальному слайсу для нахождения максимума. Второй проход по оригинальному слайсу (не по карте) гарантирует что при равной частоте победит элемент с наименьшим первым индексом.'
    }
  ]
}
