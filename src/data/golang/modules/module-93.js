export default {
  id: 93,
  title: 'Практикум: Задачи Medium',
  description: 'Алгоритмические задачи среднего уровня на Go: три суммы, длиннейшая подстрока без повторений, группировка анаграмм, произведение массива, спиральная матрица и другие классические задачи.',
  lessons: [
    {
      id: 1,
      title: 'Three Sum',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди все уникальные тройки чисел в массиве, сумма которых равна нулю. Тройки не должны повторяться.',
      requirements: [
        'Функция threeSum(nums []int) [][]int',
        'Вернуть все уникальные тройки [a,b,c] где a+b+c=0',
        'Нет дубликатов тройек в результате',
        'Протестируй: [-1,0,1,2,-1,-4] -> [[-1,-1,2],[-1,0,1]]; [0,1,1] -> []; [0,0,0] -> [[0,0,0]]'
      ],
      expectedOutput: '[-1,0,1,2,-1,-4] -> [[-1 -1 2] [-1 0 1]]\n[0,1,1] -> []\n[0,0,0] -> [[0 0 0]]',
      hint: 'Отсортируй массив. Зафикси первый элемент и используй два указателя для поиска пары. Пропускай дубликаты: если nums[i] == nums[i-1] — пропусти итерацию.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sort"\n)\n\nfunc threeSum(nums []int) [][]int {\n    sort.Ints(nums)\n    var result [][]int\n    for i := 0; i < len(nums)-2; i++ {\n        if i > 0 && nums[i] == nums[i-1] {\n            continue\n        }\n        l, r := i+1, len(nums)-1\n        for l < r {\n            sum := nums[i] + nums[l] + nums[r]\n            if sum == 0 {\n                result = append(result, []int{nums[i], nums[l], nums[r]})\n                for l < r && nums[l] == nums[l+1] {\n                    l++\n                }\n                for l < r && nums[r] == nums[r-1] {\n                    r--\n                }\n                l++\n                r--\n            } else if sum < 0 {\n                l++\n            } else {\n                r--\n            }\n        }\n    }\n    return result\n}\n\nfunc main() {\n    fmt.Printf("[-1,0,1,2,-1,-4] -> %v\\n", threeSum([]int{-1, 0, 1, 2, -1, -4}))\n    fmt.Printf("[0,1,1] -> %v\\n", threeSum([]int{0, 1, 1}))\n    fmt.Printf("[0,0,0] -> %v\\n", threeSum([]int{0, 0, 0}))\n}',
      explanation: 'Сортировка позволяет применить паттерн двух указателей. Первый элемент фиксируем циклом, два указателя l и r движутся навстречу. При сумме < 0 двигаем l вправо, при > 0 — r влево. Пропуск дубликатов на каждом уровне (i, l, r) обеспечивает уникальность результата. Сложность O(n²).'
    },
    {
      id: 2,
      title: 'Длиннейшая подстрока без повторений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди длину самой длинной подстроки без повторяющихся символов.',
      requirements: [
        'Функция lengthOfLongestSubstring(s string) int',
        'Также верни саму подстроку: longestSubstringWithChars(s string) string',
        'Используй подход скользящего окна (sliding window)',
        'Протестируй: "abcabcbb" -> 3 ("abc"); "bbbbb" -> 1 ("b"); "pwwkew" -> 3 ("wke"); "" -> 0'
      ],
      expectedOutput: '"abcabcbb" -> 3 (abc)\n"bbbbb" -> 1 (b)\n"pwwkew" -> 3 (wke)\n"" -> 0 ()',
      hint: 'Скользящее окно: left и right указатели. map хранит последний индекс каждого символа. При повторе символа: сдвигай left до позиции после последнего вхождения.',
      solution: 'package main\n\nimport "fmt"\n\nfunc lengthOfLongestSubstring(s string) int {\n    charIndex := make(map[byte]int)\n    maxLen := 0\n    left := 0\n    for right := 0; right < len(s); right++ {\n        if idx, ok := charIndex[s[right]]; ok && idx >= left {\n            left = idx + 1\n        }\n        charIndex[s[right]] = right\n        if right-left+1 > maxLen {\n            maxLen = right - left + 1\n        }\n    }\n    return maxLen\n}\n\nfunc longestSubstringWithChars(s string) string {\n    charIndex := make(map[byte]int)\n    maxLen, maxStart := 0, 0\n    left := 0\n    for right := 0; right < len(s); right++ {\n        if idx, ok := charIndex[s[right]]; ok && idx >= left {\n            left = idx + 1\n        }\n        charIndex[s[right]] = right\n        if right-left+1 > maxLen {\n            maxLen = right - left + 1\n            maxStart = left\n        }\n    }\n    return s[maxStart : maxStart+maxLen]\n}\n\nfunc main() {\n    tests := []string{"abcabcbb", "bbbbb", "pwwkew", ""}\n    for _, t := range tests {\n        length := lengthOfLongestSubstring(t)\n        substr := longestSubstringWithChars(t)\n        fmt.Printf("%q -> %d (%s)\\n", t, length, substr)\n    }\n}',
      explanation: 'Скользящее окно [left, right] содержит текущую подстроку без повторений. map хранит последний индекс каждого символа. Важна проверка idx >= left: символ может быть в map, но вне текущего окна (уже "выдвинут" за left). Обновление left = idx+1 сжимает окно слева. Сложность O(n).'
    },
    {
      id: 3,
      title: 'Группировка анаграмм',
      type: 'practice',
      difficulty: 'medium',
      description: 'Сгруппируй строки-анаграммы вместе. Анаграммы содержат одинаковые символы в разном порядке.',
      requirements: [
        'Функция groupAnagrams(strs []string) [][]string',
        'Ключ группы — отсортированная строка (или массив частот символов)',
        'Порядок групп в результате неважен',
        'Протестируй: ["eat","tea","tan","ate","nat","bat"] -> [[eat tea ate][tan nat][bat]]',
        'Также: [""] -> [[""]], ["a"] -> [["a"]]'
      ],
      expectedOutput: '["eat","tea","tan","ate","nat","bat"] -> 3 группы\nГруппа 1 (3 элемента): [eat tea ate]\nГруппа 2 (2 элемента): [tan nat]\nГруппа 3 (1 элемент): [bat]',
      hint: 'Используй map[string][]string. Ключ — отсортированные символы строки. sort.Slice на []byte(s) даёт отсортированный ключ.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sort"\n)\n\nfunc groupAnagrams(strs []string) [][]string {\n    groups := make(map[string][]string)\n    for _, s := range strs {\n        b := []byte(s)\n        sort.Slice(b, func(i, j int) bool { return b[i] < b[j] })\n        key := string(b)\n        groups[key] = append(groups[key], s)\n    }\n    result := make([][]string, 0, len(groups))\n    for _, g := range groups {\n        result = append(result, g)\n    }\n    return result\n}\n\nfunc main() {\n    input := []string{"eat", "tea", "tan", "ate", "nat", "bat"}\n    result := groupAnagrams(input)\n    fmt.Printf("%v -> %d группы\\n", input, len(result))\n    sort.Slice(result, func(i, j int) bool { return len(result[i]) > len(result[j]) })\n    for i, g := range result {\n        fmt.Printf("Группа %d (%d элемент): %v\\n", i+1, len(g), g)\n    }\n}',
      explanation: 'Отсортированная строка — канонический ключ для анаграмм: все анаграммы дают одинаковый ключ. sort.Slice работает на []byte, затем string() конвертирует обратно. Альтернативный ключ: массив [26]int с частотами букв — работает быстрее для длинных строк, не требует сортировки.'
    },
    {
      id: 4,
      title: 'Произведение массива, кроме самого элемента',
      type: 'practice',
      difficulty: 'medium',
      description: 'Верни массив, где output[i] равно произведению всех элементов nums, кроме nums[i]. Без деления, за O(n).',
      requirements: [
        'Функция productExceptSelf(nums []int) []int',
        'Не использовать операцию деления',
        'O(n) по времени',
        'Сначала реализуй с O(n) доп. памятью (два прохода: prefix и suffix массивы)',
        'Затем оптимизируй до O(1) доп. памяти (не считая выходного массива)',
        'Протестируй: [1,2,3,4] -> [24,12,8,6]; [-1,1,0,-3,3] -> [0,0,9,0,0]'
      ],
      expectedOutput: '[1,2,3,4] -> [24 12 8 6]\n[-1,1,0,-3,3] -> [0 0 9 0 0]',
      hint: 'O(1) решение: сначала заполни output[i] произведением всех элементов слева (prefix). Затем в одном проходе справа налево умножай на suffix (произведение справа), не сохраняя массив suffix.',
      solution: 'package main\n\nimport "fmt"\n\nfunc productExceptSelf(nums []int) []int {\n    n := len(nums)\n    output := make([]int, n)\n    // Шаг 1: prefix произведения (слева)\n    output[0] = 1\n    for i := 1; i < n; i++ {\n        output[i] = output[i-1] * nums[i-1]\n    }\n    // Шаг 2: умножаем на suffix (справа), suffix = накопленное произведение\n    suffix := 1\n    for i := n - 1; i >= 0; i-- {\n        output[i] *= suffix\n        suffix *= nums[i]\n    }\n    return output\n}\n\nfunc main() {\n    fmt.Printf("[1,2,3,4] -> %v\\n", productExceptSelf([]int{1, 2, 3, 4}))\n    fmt.Printf("[-1,1,0,-3,3] -> %v\\n", productExceptSelf([]int{-1, 1, 0, -3, 3}))\n}',
      explanation: 'Два прохода: сначала слева — output[i] = произведение всех элементов до i. Затем справа — suffix накапливает произведение правой части и умножается на output[i]. В итоге output[i] = (произведение слева) * (произведение справа) = произведение всех кроме nums[i]. Гениальная экономия памяти: suffix — единственная переменная вместо массива.'
    },
    {
      id: 5,
      title: 'Спиральная матрица',
      type: 'practice',
      difficulty: 'medium',
      description: 'Верни все элементы матрицы в спиральном порядке (по часовой стрелке) и сгенерируй матрицу n×n, заполненную числами от 1 до n² по спирали.',
      requirements: [
        'Функция spiralOrder(matrix [][]int) []int — читает матрицу по спирали',
        'Функция generateMatrix(n int) [][]int — создаёт матрицу n×n с числами 1..n² по спирали',
        'Протестируй spiralOrder: [[1,2,3],[4,5,6],[7,8,9]] -> [1,2,3,6,9,8,7,4,5]',
        'Протестируй generateMatrix: n=3 -> [[1,2,3],[8,9,4],[7,6,5]]'
      ],
      expectedOutput: 'spiralOrder: [1 2 3 6 9 8 7 4 5]\ngenerateMatrix(3):\n[1 2 3]\n[8 9 4]\n[7 6 5]',
      hint: 'Используй границы: top, bottom, left, right. На каждом шаге обходи строку сверху, столбец справа, строку снизу, столбец слева, затем сдвигай границы.',
      solution: 'package main\n\nimport "fmt"\n\nfunc spiralOrder(matrix [][]int) []int {\n    if len(matrix) == 0 {\n        return nil\n    }\n    top, bottom := 0, len(matrix)-1\n    left, right := 0, len(matrix[0])-1\n    var result []int\n    for top <= bottom && left <= right {\n        for i := left; i <= right; i++ {\n            result = append(result, matrix[top][i])\n        }\n        top++\n        for i := top; i <= bottom; i++ {\n            result = append(result, matrix[i][right])\n        }\n        right--\n        if top <= bottom {\n            for i := right; i >= left; i-- {\n                result = append(result, matrix[bottom][i])\n            }\n            bottom--\n        }\n        if left <= right {\n            for i := bottom; i >= top; i-- {\n                result = append(result, matrix[i][left])\n            }\n            left++\n        }\n    }\n    return result\n}\n\nfunc generateMatrix(n int) [][]int {\n    matrix := make([][]int, n)\n    for i := range matrix {\n        matrix[i] = make([]int, n)\n    }\n    top, bottom, left, right := 0, n-1, 0, n-1\n    num := 1\n    for top <= bottom && left <= right {\n        for i := left; i <= right; i++ {\n            matrix[top][i] = num; num++\n        }\n        top++\n        for i := top; i <= bottom; i++ {\n            matrix[i][right] = num; num++\n        }\n        right--\n        if top <= bottom {\n            for i := right; i >= left; i-- {\n                matrix[bottom][i] = num; num++\n            }\n            bottom--\n        }\n        if left <= right {\n            for i := bottom; i >= top; i-- {\n                matrix[i][left] = num; num++\n            }\n            left++\n        }\n    }\n    return matrix\n}\n\nfunc main() {\n    m := [][]int{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}\n    fmt.Printf("spiralOrder: %v\\n", spiralOrder(m))\n    gen := generateMatrix(3)\n    fmt.Println("generateMatrix(3):")\n    for _, row := range gen {\n        fmt.Println(row)\n    }\n}',
      explanation: 'Паттерн "четыре границы" — стандартный подход для спирального обхода. Важны проверки top <= bottom и left <= right перед обходом нижней строки и левого столбца: без них одиночная строка/столбец будут обработаны дважды. Тот же алгоритм переиспользуется для заполнения матрицы — только пишем вместо чтения.'
    },
    {
      id: 6,
      title: 'Поворот матрицы на 90 градусов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Поверни квадратную матрицу n×n на 90 градусов по часовой стрелке. Модифицируй матрицу на месте (in-place).',
      requirements: [
        'Функция rotate(matrix [][]int) — поворот in-place',
        'Алгоритм: сначала транспонируй (matrix[i][j] <-> matrix[j][i]), затем отзеркаль горизонтально',
        'Протестируй: [[1,2,3],[4,5,6],[7,8,9]] -> [[7,4,1],[8,5,2],[9,6,3]]',
        'Также: [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]] -> [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]'
      ],
      expectedOutput: 'До: [[1 2 3] [4 5 6] [7 8 9]]\nПосле: [[7 4 1] [8 5 2] [9 6 3]]',
      hint: 'Шаг 1: транспонировать (менять matrix[i][j] и matrix[j][i] для i<j). Шаг 2: отразить каждую строку горизонтально (менять matrix[i][j] и matrix[i][n-1-j]).',
      solution: 'package main\n\nimport "fmt"\n\nfunc rotate(matrix [][]int) {\n    n := len(matrix)\n    // Шаг 1: Транспонирование\n    for i := 0; i < n; i++ {\n        for j := i + 1; j < n; j++ {\n            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n        }\n    }\n    // Шаг 2: Горизонтальное отражение\n    for i := 0; i < n; i++ {\n        for j := 0; j < n/2; j++ {\n            matrix[i][j], matrix[i][n-1-j] = matrix[i][n-1-j], matrix[i][j]\n        }\n    }\n}\n\nfunc printMatrix(m [][]int) {\n    for _, row := range m {\n        fmt.Println(row)\n    }\n}\n\nfunc main() {\n    m := [][]int{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}\n    fmt.Printf("До: %v\\n", m)\n    rotate(m)\n    fmt.Printf("После: %v\\n", m)\n    fmt.Println()\n    m2 := [][]int{{5, 1, 9, 11}, {2, 4, 8, 10}, {13, 3, 6, 7}, {15, 14, 12, 16}}\n    rotate(m2)\n    fmt.Println("Матрица 4x4 после поворота:")\n    printMatrix(m2)\n}',
      explanation: 'Поворот на 90° = транспонирование + горизонтальное отражение. Математически: для поворота на 90° по часовой стрелке element[i][j] переходит в [j][n-1-i]. Двухшаговый алгоритм позволяет сделать это in-place, используя только обмен пар элементов без доп. памяти. Транспонирование проходит только верхний треугольник (j > i), чтобы не менять дважды.'
    },
    {
      id: 7,
      title: 'Обнуление матрицы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Если элемент матрицы равен 0, обнули всю его строку и столбец. Сделай это in-place с O(1) доп. памятью.',
      requirements: [
        'Функция setZeroes(matrix [][]int) — модифицирует in-place',
        'O(1) доп. памяти: используй первую строку и первый столбец как маркеры',
        'Не обнуляй сразу — сначала отметь, потом обнули',
        'Протестируй: [[1,1,1],[1,0,1],[1,1,1]] -> [[1,0,1],[0,0,0],[1,0,1]]',
        'Также: [[0,1,2,0],[3,4,5,2],[1,3,1,5]] -> [[0,0,0,0],[0,4,5,0],[0,3,1,0]]'
      ],
      expectedOutput: '[[1,1,1],[1,0,1],[1,1,1]] -> [[1 0 1] [0 0 0] [1 0 1]]\n[[0,1,2,0],[3,4,5,2],[1,3,1,5]] -> [[0 0 0 0] [0 4 5 0] [0 3 1 0]]',
      hint: 'Используй matrix[0][j] как маркер для столбца j, matrix[i][0] как маркер для строки i. Отдельно обрабатывай первую строку и первый столбец, так как они сами являются маркерами.',
      solution: 'package main\n\nimport "fmt"\n\nfunc setZeroes(matrix [][]int) {\n    m, n := len(matrix), len(matrix[0])\n    firstRowZero := false\n    firstColZero := false\n    for j := 0; j < n; j++ {\n        if matrix[0][j] == 0 {\n            firstRowZero = true\n            break\n        }\n    }\n    for i := 0; i < m; i++ {\n        if matrix[i][0] == 0 {\n            firstColZero = true\n            break\n        }\n    }\n    // Отмечаем через первую строку и столбец\n    for i := 1; i < m; i++ {\n        for j := 1; j < n; j++ {\n            if matrix[i][j] == 0 {\n                matrix[i][0] = 0\n                matrix[0][j] = 0\n            }\n        }\n    }\n    // Обнуляем\n    for i := 1; i < m; i++ {\n        for j := 1; j < n; j++ {\n            if matrix[i][0] == 0 || matrix[0][j] == 0 {\n                matrix[i][j] = 0\n            }\n        }\n    }\n    if firstRowZero {\n        for j := 0; j < n; j++ {\n            matrix[0][j] = 0\n        }\n    }\n    if firstColZero {\n        for i := 0; i < m; i++ {\n            matrix[i][0] = 0\n        }\n    }\n}\n\nfunc main() {\n    m1 := [][]int{{1, 1, 1}, {1, 0, 1}, {1, 1, 1}}\n    setZeroes(m1)\n    fmt.Printf("[[1,1,1],[1,0,1],[1,1,1]] -> %v\\n", m1)\n    m2 := [][]int{{0, 1, 2, 0}, {3, 4, 5, 2}, {1, 3, 1, 5}}\n    setZeroes(m2)\n    fmt.Printf("[[0,1,2,0],[3,4,5,2],[1,3,1,5]] -> %v\\n", m2)\n}',
      explanation: 'O(1) трюк: первая строка и столбец используются как маркеры. Проблема: сами они могут содержать нули. Решение: до использования в качестве маркеров запоминаем, должны ли они сами быть обнулены (firstRowZero, firstColZero). Обнуление первой строки/столбца — последнее действие, иначе маркеры испортятся.'
    },
    {
      id: 8,
      title: 'Длиннейшая палиндромная подстрока',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди самую длинную подстроку, являющуюся палиндромом. Реализуй подход расширения из центра.',
      requirements: [
        'Функция longestPalindrome(s string) string',
        'Использует метод расширения из центра: O(n²) время, O(1) память',
        'Обработай оба случая: нечётная длина (центр — символ) и чётная (центр между символами)',
        'Протестируй: "babad" -> "bab" или "aba"; "cbbd" -> "bb"; "a" -> "a"; "ac" -> "a"'
      ],
      expectedOutput: '"babad" -> "bab"\n"cbbd" -> "bb"\n"a" -> "a"\n"racecar" -> "racecar"',
      hint: 'Функция expand(s string, left, right int) int расширяет из центра и возвращает длину палиндрома. Для каждой позиции i вызывай expand для нечётного (i,i) и чётного (i,i+1) случаев.',
      solution: 'package main\n\nimport "fmt"\n\nfunc expand(s string, left, right int) int {\n    for left >= 0 && right < len(s) && s[left] == s[right] {\n        left--\n        right++\n    }\n    return right - left - 1\n}\n\nfunc longestPalindrome(s string) string {\n    if len(s) == 0 {\n        return ""\n    }\n    start, maxLen := 0, 1\n    for i := 0; i < len(s); i++ {\n        odd := expand(s, i, i)\n        even := expand(s, i, i+1)\n        best := odd\n        if even > odd {\n            best = even\n        }\n        if best > maxLen {\n            maxLen = best\n            start = i - (best-1)/2\n        }\n    }\n    return s[start : start+maxLen]\n}\n\nfunc main() {\n    tests := []string{"babad", "cbbd", "a", "racecar"}\n    for _, t := range tests {\n        fmt.Printf("%q -> %q\\n", t, longestPalindrome(t))\n    }\n}',
      explanation: 'Метод расширения из центра: для каждой из n позиций расширяем палиндром влево и вправо. Нечётный случай (i,i) — центр в символе. Чётный (i,i+1) — центр между символами. Длина нечётного: 2*k+1 (где k — число шагов). Начало: i - (len-1)/2. Сложность O(n²)/O(1) — лучше DP по памяти, хотя оба O(n²).'
    },
    {
      id: 9,
      title: 'Контейнер с наибольшим количеством воды',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив высот. Найди два столбца, образующие контейнер с максимальным объёмом воды.',
      requirements: [
        'Функция maxWater(height []int) int',
        'Используй два указателя: O(n) время, O(1) память',
        'Объясни почему жадный выбор (двигать меньший указатель) оптимален',
        'Протестируй: [1,8,6,2,5,4,8,3,7] -> 49; [1,1] -> 1; [4,3,2,1,4] -> 16; [1,2,1] -> 2'
      ],
      expectedOutput: '[1,8,6,2,5,4,8,3,7] -> 49\n[1,1] -> 1\n[4,3,2,1,4] -> 16\n[1,2,1] -> 2',
      hint: 'Два указателя l=0 и r=n-1. Объём = min(h[l],h[r]) * (r-l). Двигай тот указатель, чья высота меньше: больший нет смысла двигать — объём только уменьшится.',
      solution: 'package main\n\nimport "fmt"\n\nfunc maxWater(height []int) int {\n    l, r := 0, len(height)-1\n    maxVol := 0\n    for l < r {\n        h := height[l]\n        if height[r] < h {\n            h = height[r]\n        }\n        vol := h * (r - l)\n        if vol > maxVol {\n            maxVol = vol\n        }\n        if height[l] < height[r] {\n            l++\n        } else {\n            r--\n        }\n    }\n    return maxVol\n}\n\nfunc main() {\n    tests := [][]int{\n        {1, 8, 6, 2, 5, 4, 8, 3, 7},\n        {1, 1},\n        {4, 3, 2, 1, 4},\n        {1, 2, 1},\n    }\n    expected := []int{49, 1, 16, 2}\n    for i, t := range tests {\n        result := maxWater(t)\n        fmt.Printf("%v -> %d (верно: %v)\\n", t, result, result == expected[i])\n    }\n}',
      explanation: 'Жадный выбор: двигаем меньший указатель. Почему правильно? Ширина уменьшается при любом движении. Если двигаем больший, высота ограничена меньшим и точно не вырастет — только ухудшим. Двигая меньший, даём шанс найти более высокий столбец. Доказательство корректности: все пары рассматриваются неявно через инвариант указателей.'
    },
    {
      id: 10,
      title: 'LRU Cache',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй структуру данных LRU Cache (Least Recently Used) с операциями Get и Put за O(1).',
      requirements: [
        'Структура LRUCache с методами: Get(key int) int и Put(key, value int)',
        'Get: возвращает -1 если ключ не найден; иначе значение и помечает как недавно использованный',
        'Put: вставляет пару ключ-значение; если кэш полон — удаляет наименее недавно использованный',
        'Используй doubly linked list + hashmap для O(1) операций',
        'Протестируй: capacity=2; Put(1,1); Put(2,2); Get(1)->1; Put(3,3); Get(2)->-1; Put(4,4); Get(1)->-1; Get(3)->3; Get(4)->4'
      ],
      expectedOutput: 'LRUCache capacity=2\nGet(1) = 1\nGet(2) = -1 (вытеснен)\nGet(1) = -1 (вытеснен)\nGet(3) = 3\nGet(4) = 4',
      hint: 'Двусвязный список: голова (head) — самый недавний, хвост (tail) — кандидат на вытеснение. При Get и Put перемещай узел в голову. При переполнении удаляй хвостовой узел.',
      solution: 'package main\n\nimport "fmt"\n\ntype LRUNode struct {\n    key, val   int\n    prev, next *LRUNode\n}\n\ntype LRUCache struct {\n    capacity int\n    cache    map[int]*LRUNode\n    head     *LRUNode // most recent\n    tail     *LRUNode // least recent\n}\n\nfunc NewLRUCache(capacity int) *LRUCache {\n    head := &LRUNode{}\n    tail := &LRUNode{}\n    head.next = tail\n    tail.prev = head\n    return &LRUCache{capacity: capacity, cache: make(map[int]*LRUNode), head: head, tail: tail}\n}\n\nfunc (c *LRUCache) removeNode(node *LRUNode) {\n    node.prev.next = node.next\n    node.next.prev = node.prev\n}\n\nfunc (c *LRUCache) insertFront(node *LRUNode) {\n    node.next = c.head.next\n    node.prev = c.head\n    c.head.next.prev = node\n    c.head.next = node\n}\n\nfunc (c *LRUCache) Get(key int) int {\n    if node, ok := c.cache[key]; ok {\n        c.removeNode(node)\n        c.insertFront(node)\n        return node.val\n    }\n    return -1\n}\n\nfunc (c *LRUCache) Put(key, value int) {\n    if node, ok := c.cache[key]; ok {\n        node.val = value\n        c.removeNode(node)\n        c.insertFront(node)\n        return\n    }\n    if len(c.cache) >= c.capacity {\n        lru := c.tail.prev\n        c.removeNode(lru)\n        delete(c.cache, lru.key)\n    }\n    node := &LRUNode{key: key, val: value}\n    c.insertFront(node)\n    c.cache[key] = node\n}\n\nfunc main() {\n    cache := NewLRUCache(2)\n    cache.Put(1, 1)\n    cache.Put(2, 2)\n    fmt.Printf("Get(1) = %d\\n", cache.Get(1))\n    cache.Put(3, 3)\n    fmt.Printf("Get(2) = %d (вытеснен)\\n", cache.Get(2))\n    cache.Put(4, 4)\n    fmt.Printf("Get(1) = %d (вытеснен)\\n", cache.Get(1))\n    fmt.Printf("Get(3) = %d\\n", cache.Get(3))\n    fmt.Printf("Get(4) = %d\\n", cache.Get(4))\n}',
      explanation: 'LRU Cache = HashMap + Doubly Linked List. HashMap даёт O(1) доступ по ключу. Linked List позволяет O(1) перемещение узла в голову (недавно использованный) и удаление хвоста (наименее использованный). Sentinel-узлы head и tail упрощают операции: нет проверок на nil. При Put существующего ключа — обновляем значение и перемещаем в голову.'
    }
  ]
}
