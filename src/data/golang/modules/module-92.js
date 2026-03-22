export default {
  id: 92,
  title: 'Практикум: Задачи Easy',
  description: 'Классические алгоритмические задачи уровня Easy, реализованные на Go: Two Sum, разворот числа, валидация скобок, слияние массивов и другие фундаментальные задачи.',
  lessons: [
    {
      id: 1,
      title: 'Two Sum',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив чисел nums и целевое число target. Найди два индекса, сумма элементов которых равна target. Гарантируется ровно одно решение.',
      requirements: [
        'Функция twoSum(nums []int, target int) []int',
        'Верни индексы двух чисел (порядок неважен)',
        'Не используй тот же элемент дважды',
        'Решение должно работать за O(n) — используй хэш-таблицу',
        'Протестируй: [2,7,11,15] target=9 -> [0,1]; [3,2,4] target=6 -> [1,2]; [3,3] target=6 -> [0,1]'
      ],
      expectedOutput: '[2,7,11,15] target=9: [0 1]\n[3,2,4] target=6: [1 2]\n[3,3] target=6: [0 1]',
      hint: 'Создай map[int]int где ключ — значение, значение — индекс. Для каждого элемента проверь, есть ли в map число (target - nums[i]).',
      solution: 'package main\n\nimport "fmt"\n\nfunc twoSum(nums []int, target int) []int {\n    seen := make(map[int]int)\n    for i, n := range nums {\n        complement := target - n\n        if j, ok := seen[complement]; ok {\n            return []int{j, i}\n        }\n        seen[n] = i\n    }\n    return nil\n}\n\nfunc main() {\n    fmt.Printf("[2,7,11,15] target=9: %v\\n", twoSum([]int{2, 7, 11, 15}, 9))\n    fmt.Printf("[3,2,4] target=6: %v\\n", twoSum([]int{3, 2, 4}, 6))\n    fmt.Printf("[3,3] target=6: %v\\n", twoSum([]int{3, 3}, 6))\n}',
      explanation: 'Хэш-таблица (map) позволяет найти дополнение за O(1). Для каждого элемента вычисляем complement = target - nums[i] и проверяем его наличие в map. Если находим — возвращаем пару индексов. Иначе записываем текущий элемент в map. Итоговая сложность O(n) по времени и O(n) по памяти.'
    },
    {
      id: 2,
      title: 'Разворот целого числа',
      type: 'practice',
      difficulty: 'easy',
      description: 'Разверни цифры целого числа. Если результат выходит за пределы 32-битного знакового целого, верни 0.',
      requirements: [
        'Функция reverse(x int) int',
        'Работает с отрицательными числами: -123 -> -321',
        'Если результат > 2^31-1 или < -2^31 — вернуть 0',
        'Протестируй: 123 -> 321; -123 -> -321; 120 -> 21; 0 -> 0; 1534236469 -> 0 (переполнение)'
      ],
      expectedOutput: 'reverse(123) = 321\nreverse(-123) = -321\nreverse(120) = 21\nreverse(1534236469) = 0',
      hint: 'Извлекай последнюю цифру через x%10, сдвигай x через x/10. Перед умножением result*10+digit проверяй переполнение: result > (maxInt-digit)/10.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "math"\n)\n\nfunc reverse(x int) int {\n    result := 0\n    for x != 0 {\n        digit := x % 10\n        x /= 10\n        if result > math.MaxInt32/10 || (result == math.MaxInt32/10 && digit > 7) {\n            return 0\n        }\n        if result < math.MinInt32/10 || (result == math.MinInt32/10 && digit < -8) {\n            return 0\n        }\n        result = result*10 + digit\n    }\n    return result\n}\n\nfunc main() {\n    fmt.Printf("reverse(123) = %d\\n", reverse(123))\n    fmt.Printf("reverse(-123) = %d\\n", reverse(-123))\n    fmt.Printf("reverse(120) = %d\\n", reverse(120))\n    fmt.Printf("reverse(1534236469) = %d\\n", reverse(1534236469))\n}',
      explanation: 'Алгоритм: извлекаем цифры справа налево через остаток от деления на 10. Проверка переполнения до умножения: если result > MaxInt32/10, то result*10 точно переполнится. Операции с отрицательными числами работают корректно — в Go оператор % сохраняет знак делимого.'
    },
    {
      id: 3,
      title: 'Валидация скобок',
      type: 'practice',
      difficulty: 'easy',
      description: 'Проверь, является ли строка из скобок корректной: каждая открывающая должна быть закрыта в правильном порядке.',
      requirements: [
        'Функция isValid(s string) bool',
        'Поддерживай три типа скобок: (), [], {}',
        'Протестируй: "()" -> true; "()[]{}" -> true; "(]" -> false; "([)]" -> false; "{[]}" -> true; "" -> true'
      ],
      expectedOutput: '() -> true\n()[]{} -> true\n(] -> false\n([)] -> false\n{[]} -> true',
      hint: 'Используй стек (срез). При открывающей скобке — push. При закрывающей — pop и проверь соответствие. В конце стек должен быть пустым.',
      solution: 'package main\n\nimport "fmt"\n\nfunc isValid(s string) bool {\n    stack := []rune{}\n    pairs := map[rune]rune{\')\': \'(\', \']\': \'[\', \'}\': \'{\'}\n    for _, c := range s {\n        switch c {\n        case \'(\', \'[\', \'{\':\n            stack = append(stack, c)\n        case \')\', \']\', \'}\':\n            if len(stack) == 0 || stack[len(stack)-1] != pairs[c] {\n                return false\n            }\n            stack = stack[:len(stack)-1]\n        }\n    }\n    return len(stack) == 0\n}\n\nfunc main() {\n    tests := []string{"()", "()[]{}", "(]", "([)]", "{[]}"}\n    for _, t := range tests {\n        fmt.Printf("%s -> %v\\n", t, isValid(t))\n    }\n}',
      explanation: 'Стек — ключевая структура данных для проверки вложенности. map с обратными парами скобок делает код лаконичным: вместо серии if-else проверяем соответствие через map. Срез как стек: append для push, s[:len-1] для pop — идиоматичный Go-паттерн.'
    },
    {
      id: 4,
      title: 'Слияние отсортированных массивов',
      type: 'practice',
      difficulty: 'easy',
      description: 'Слей два отсортированных среза в один отсортированный срез. Реализуй два способа: с дополнительным массивом и слияние nums1 на месте.',
      requirements: [
        'Функция mergeSorted(nums1, nums2 []int) []int — возвращает новый слитый срез',
        'Функция mergeInPlace(nums1 []int, m int, nums2 []int, n int) — слияние в nums1 на месте; nums1 имеет длину m+n, первые m элементов заполнены, последние n — нули',
        'Оба алгоритма O(m+n) по времени',
        'Протестируй mergeSorted: [1,3,5]+[2,4,6] -> [1,2,3,4,5,6]',
        'Протестируй mergeInPlace: nums1=[1,2,3,0,0,0] m=3, nums2=[2,5,6] -> [1,2,2,3,5,6]'
      ],
      expectedOutput: 'mergeSorted: [1 2 3 4 5 6]\nmergeInPlace: [1 2 2 3 5 6]',
      hint: 'Для mergeInPlace: иди с конца обоих массивов и заполняй nums1 с позиции m+n-1. Это избегает сдвигов элементов.',
      solution: 'package main\n\nimport "fmt"\n\nfunc mergeSorted(nums1, nums2 []int) []int {\n    result := make([]int, 0, len(nums1)+len(nums2))\n    i, j := 0, 0\n    for i < len(nums1) && j < len(nums2) {\n        if nums1[i] <= nums2[j] {\n            result = append(result, nums1[i])\n            i++\n        } else {\n            result = append(result, nums2[j])\n            j++\n        }\n    }\n    result = append(result, nums1[i:]...)\n    result = append(result, nums2[j:]...)\n    return result\n}\n\nfunc mergeInPlace(nums1 []int, m int, nums2 []int, n int) {\n    i, j, k := m-1, n-1, m+n-1\n    for i >= 0 && j >= 0 {\n        if nums1[i] > nums2[j] {\n            nums1[k] = nums1[i]\n            i--\n        } else {\n            nums1[k] = nums2[j]\n            j--\n        }\n        k--\n    }\n    for j >= 0 {\n        nums1[k] = nums2[j]\n        j--\n        k--\n    }\n}\n\nfunc main() {\n    fmt.Printf("mergeSorted: %v\\n", mergeSorted([]int{1, 3, 5}, []int{2, 4, 6}))\n    nums1 := []int{1, 2, 3, 0, 0, 0}\n    mergeInPlace(nums1, 3, []int{2, 5, 6}, 3)\n    fmt.Printf("mergeInPlace: %v\\n", nums1)\n}',
      explanation: 'mergeSorted использует два указателя, двигаясь по обоим массивам — классический алгоритм слияния. mergeInPlace работает с конца: это ключевое наблюдение, позволяющее избежать перезаписи ещё не обработанных элементов nums1. Остаток nums2 (j >= 0) всегда нужно скопировать, остаток nums1 уже стоит на месте.'
    },
    {
      id: 5,
      title: 'Поиск дубликатов',
      type: 'practice',
      difficulty: 'easy',
      description: 'Проверь, содержит ли массив хотя бы один дубликат. Реализуй три подхода с разными компромиссами по времени и памяти.',
      requirements: [
        'Функция containsDuplicateHash(nums []int) bool — O(n) время, O(n) память через map',
        'Функция containsDuplicateSort(nums []int) bool — O(n log n) время, O(1) доп. память через сортировку',
        'Функция containsDuplicateK(nums []int, k int) bool — дубликат на расстоянии не более k позиций',
        'Протестируй: [1,2,3,1] -> true; [1,2,3,4] -> false; [1,1,1,3,3,4,3,2,4,2] -> true',
        'Для containsDuplicateK: [1,2,3,1] k=3 -> true; [1,0,1,1] k=1 -> true'
      ],
      expectedOutput: 'Hash [1,2,3,1]: true\nSort [1,2,3,4]: false\nHash [1,1,1,3,3,4]: true\ncontainsDuplicateK [1,2,3,1] k=3: true\ncontainsDuplicateK [1,0,1,1] k=1: true',
      hint: 'containsDuplicateK: используй map для хранения последнего индекса каждого числа. Если число встречалось и разница индексов <= k — дубликат найден.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "sort"\n)\n\nfunc containsDuplicateHash(nums []int) bool {\n    seen := make(map[int]bool)\n    for _, n := range nums {\n        if seen[n] {\n            return true\n        }\n        seen[n] = true\n    }\n    return false\n}\n\nfunc containsDuplicateSort(nums []int) bool {\n    cp := make([]int, len(nums))\n    copy(cp, nums)\n    sort.Ints(cp)\n    for i := 1; i < len(cp); i++ {\n        if cp[i] == cp[i-1] {\n            return true\n        }\n    }\n    return false\n}\n\nfunc containsDuplicateK(nums []int, k int) bool {\n    lastIdx := make(map[int]int)\n    for i, n := range nums {\n        if j, ok := lastIdx[n]; ok && i-j <= k {\n            return true\n        }\n        lastIdx[n] = i\n    }\n    return false\n}\n\nfunc main() {\n    fmt.Printf("Hash [1,2,3,1]: %v\\n", containsDuplicateHash([]int{1, 2, 3, 1}))\n    fmt.Printf("Sort [1,2,3,4]: %v\\n", containsDuplicateSort([]int{1, 2, 3, 4}))\n    fmt.Printf("Hash [1,1,1,3,3,4]: %v\\n", containsDuplicateHash([]int{1, 1, 1, 3, 3, 4}))\n    fmt.Printf("containsDuplicateK [1,2,3,1] k=3: %v\\n", containsDuplicateK([]int{1, 2, 3, 1}, 3))\n    fmt.Printf("containsDuplicateK [1,0,1,1] k=1: %v\\n", containsDuplicateK([]int{1, 0, 1, 1}, 1))\n}',
      explanation: 'Три подхода демонстрируют классический компромисс время/память. Hash-подход: O(n)/O(n) — быстрее всего. Sort-подход: O(n log n)/O(1) — экономит память, изменяет порядок. Вариант с k добавляет ограничение на расстояние: map хранит последнюю позицию каждого элемента.'
    },
    {
      id: 6,
      title: 'Одиночное число (XOR)',
      type: 'practice',
      difficulty: 'easy',
      description: 'В массиве каждый элемент встречается ровно дважды, кроме одного. Найди этот одиночный элемент за O(n) времени и O(1) памяти.',
      requirements: [
        'Функция singleNumber(nums []int) int — используй XOR',
        'Также реализуй singleNumberMap(nums []int) int — через map для сравнения',
        'Объясни в комментарии почему XOR работает',
        'Протестируй: [2,2,1] -> 1; [4,1,2,1,2] -> 4; [1] -> 1'
      ],
      expectedOutput: 'XOR [2,2,1]: 1\nXOR [4,1,2,1,2]: 4\nMap [4,1,2,1,2]: 4',
      hint: 'XOR свойства: a^a=0 и a^0=a. Если применить XOR ко всем элементам, все пары взаимно уничтожатся (x^x=0), останется только одиночный элемент.',
      solution: 'package main\n\nimport "fmt"\n\n// XOR работает благодаря свойствам:\n// 1. a ^ a = 0 (число XOR само с собой = 0)\n// 2. a ^ 0 = a (число XOR с нулём = само число)\n// 3. XOR коммутативен и ассоциативен\n// Поэтому: 4^1^2^1^2 = 4^(1^1)^(2^2) = 4^0^0 = 4\nfunc singleNumber(nums []int) int {\n    result := 0\n    for _, n := range nums {\n        result ^= n\n    }\n    return result\n}\n\nfunc singleNumberMap(nums []int) int {\n    counts := make(map[int]int)\n    for _, n := range nums {\n        counts[n]++\n    }\n    for n, c := range counts {\n        if c == 1 {\n            return n\n        }\n    }\n    return -1\n}\n\nfunc main() {\n    fmt.Printf("XOR [2,2,1]: %d\\n", singleNumber([]int{2, 2, 1}))\n    fmt.Printf("XOR [4,1,2,1,2]: %d\\n", singleNumber([]int{4, 1, 2, 1, 2}))\n    fmt.Printf("Map [4,1,2,1,2]: %d\\n", singleNumberMap([]int{4, 1, 2, 1, 2}))\n}',
      explanation: 'XOR-решение элегантно: O(n) время и O(1) память — никакой доп. структуры данных. Свойство a^a=0 означает, что все пары "гасят" друг друга. Коммутативность и ассоциативность XOR позволяют менять порядок операций. Битовые операции часто используются в Go для эффективных алгоритмов с жёсткими ограничениями по памяти.'
    },
    {
      id: 7,
      title: 'Перенос нулей',
      type: 'practice',
      difficulty: 'easy',
      description: 'Перенеси все нули в конец массива, сохраняя относительный порядок ненулевых элементов. Изменяй массив на месте (in-place).',
      requirements: [
        'Функция moveZeroes(nums []int) — изменяет nums на месте',
        'Относительный порядок ненулевых элементов сохраняется',
        'Минимизируй количество операций',
        'Протестируй: [0,1,0,3,12] -> [1,3,12,0,0]; [0] -> [0]; [0,0,1] -> [1,0,0]'
      ],
      expectedOutput: '[0,1,0,3,12] -> [1 3 12 0 0]\n[0] -> [0]\n[0,0,1] -> [1 0 0]',
      hint: 'Используй указатель pos для следующей позиции ненулевого элемента. Пройди по массиву: при ненулевом элементе поставь его на позицию pos и увеличь pos. Затем заполни остаток нулями.',
      solution: 'package main\n\nimport "fmt"\n\nfunc moveZeroes(nums []int) {\n    pos := 0\n    for _, n := range nums {\n        if n != 0 {\n            nums[pos] = n\n            pos++\n        }\n    }\n    for ; pos < len(nums); pos++ {\n        nums[pos] = 0\n    }\n}\n\nfunc main() {\n    tests := [][]int{\n        {0, 1, 0, 3, 12},\n        {0},\n        {0, 0, 1},\n    }\n    originals := []string{"[0,1,0,3,12]", "[0]", "[0,0,1]"}\n    for i, t := range tests {\n        moveZeroes(t)\n        fmt.Printf("%s -> %v\\n", originals[i], t)\n    }\n}',
      explanation: 'Два-прохода паттерн: первый проход собирает ненулевые элементы в начале через указатель pos, второй заполняет остаток нулями. Это O(n) по времени и O(1) по памяти. Альтернатива: swap-паттерн (одновременный перебор и обмен), но он производит больше присваиваний при большом количестве нулей в начале.'
    },
    {
      id: 8,
      title: 'Плюс один',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив цифр числа (без ведущих нулей). Прибавь 1 к числу и верни результат в виде массива цифр.',
      requirements: [
        'Функция plusOne(digits []int) []int',
        'Обработай перенос: [9] -> [1,0]; [9,9] -> [1,0,0]',
        'Не конвертируй в int — работай с массивом напрямую',
        'Протестируй: [1,2,3] -> [1,2,4]; [4,3,2,1] -> [4,3,2,2]; [9] -> [1,0]; [9,9,9] -> [1,0,0,0]'
      ],
      expectedOutput: '[1,2,3] -> [1 2 4]\n[4,3,2,1] -> [4 3 2 2]\n[9] -> [1 0]\n[9,9,9] -> [1 0 0 0]',
      hint: 'Иди с конца массива. Если цифра < 9: увеличь и верни. Если 9: установи в 0 и продолжай. Если прошли весь массив — добавь 1 в начало через append([]int{1}, digits...).',
      solution: 'package main\n\nimport "fmt"\n\nfunc plusOne(digits []int) []int {\n    for i := len(digits) - 1; i >= 0; i-- {\n        if digits[i] < 9 {\n            digits[i]++\n            return digits\n        }\n        digits[i] = 0\n    }\n    return append([]int{1}, digits...)\n}\n\nfunc main() {\n    tests := [][]int{{1, 2, 3}, {4, 3, 2, 1}, {9}, {9, 9, 9}}\n    originals := []string{"[1,2,3]", "[4,3,2,1]", "[9]", "[9,9,9]"}\n    for i, t := range tests {\n        result := plusOne(t)\n        fmt.Printf("%s -> %v\\n", originals[i], result)\n    }\n}',
      explanation: 'Алгоритм обрабатывает перенос: идём с конца, обнуляем девятки и продолжаем. Если вышли из цикла, значит все цифры были 9 (теперь все 0) — нужна новая цифра 1 в начале. append([]int{1}, digits...) создаёт новый срез: [] распаковывает digits как variadic-аргументы.'
    },
    {
      id: 9,
      title: 'Римские числа в десятичные',
      type: 'practice',
      difficulty: 'easy',
      description: 'Переведи римское число в десятичное. Учти правило вычитания: IV=4, IX=9, XL=40, XC=90, CD=400, CM=900.',
      requirements: [
        'Функция romanToInt(s string) int',
        'Поддержи все символы: I=1, V=5, X=10, L=50, C=100, D=500, M=1000',
        'Реализуй правило вычитания',
        'Протестируй: "III" -> 3; "IV" -> 4; "IX" -> 9; "LVIII" -> 58; "MCMXCIV" -> 1994'
      ],
      expectedOutput: 'III -> 3\nIV -> 4\nIX -> 9\nLVIII -> 58\nMCMXCIV -> 1994',
      hint: 'Идти слева направо: если текущий символ меньше следующего — вычти его, иначе прибавь. Или идти справа налево: сравнивай с предыдущим суммарным значением.',
      solution: 'package main\n\nimport "fmt"\n\nfunc romanToInt(s string) int {\n    values := map[byte]int{\n        \'I\': 1, \'V\': 5, \'X\': 10, \'L\': 50,\n        \'C\': 100, \'D\': 500, \'M\': 1000,\n    }\n    result := 0\n    for i := 0; i < len(s); i++ {\n        curr := values[s[i]]\n        if i+1 < len(s) && curr < values[s[i+1]] {\n            result -= curr\n        } else {\n            result += curr\n        }\n    }\n    return result\n}\n\nfunc main() {\n    tests := []string{"III", "IV", "IX", "LVIII", "MCMXCIV"}\n    answers := []int{3, 4, 9, 58, 1994}\n    for i, t := range tests {\n        result := romanToInt(t)\n        match := result == answers[i]\n        fmt.Printf("%s -> %d (верно: %v)\\n", t, result, match)\n    }\n}',
      explanation: 'Ключевое правило: если меньший символ стоит перед большим — он вычитается (IV=5-1=4). Проверяем следующий символ при каждом шаге. Строки в Go — байты, поэтому s[i] даёт byte, а не rune — работает корректно для ASCII (латиница). map[byte]int эффективнее switch для данного набора символов.'
    },
    {
      id: 10,
      title: 'Максимальная сумма подмассива (алгоритм Кадана)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Найди подмассив с максимальной суммой (алгоритм Кадана). Верни саму сумму и индексы подмассива.',
      requirements: [
        'Функция maxSubArray(nums []int) int — только сумма',
        'Функция maxSubArrayWithIndices(nums []int) (int, int, int) — сумма, начало, конец',
        'Алгоритм Кадана: O(n) время, O(1) память',
        'Протестируй: [-2,1,-3,4,-1,2,1,-5,4] -> 6 (подмассив [4,-1,2,1])',
        'Также: [1] -> 1; [5,4,-1,7,8] -> 23'
      ],
      expectedOutput: '[-2,1,-3,4,-1,2,1,-5,4]: maxSum=6 indices=[3,6]\n[1]: maxSum=1 indices=[0,0]\n[5,4,-1,7,8]: maxSum=23 indices=[0,4]',
      hint: 'Алгоритм Кадана: currentSum = max(nums[i], currentSum + nums[i]). Если currentSum обновился до nums[i] — начинается новый подмассив. Обновляй начало/конец при нахождении нового максимума.',
      solution: 'package main\n\nimport "fmt"\n\nfunc maxSubArray(nums []int) int {\n    maxSum := nums[0]\n    currSum := nums[0]\n    for i := 1; i < len(nums); i++ {\n        if currSum+nums[i] > nums[i] {\n            currSum += nums[i]\n        } else {\n            currSum = nums[i]\n        }\n        if currSum > maxSum {\n            maxSum = currSum\n        }\n    }\n    return maxSum\n}\n\nfunc maxSubArrayWithIndices(nums []int) (int, int, int) {\n    maxSum := nums[0]\n    currSum := nums[0]\n    start, end, tempStart := 0, 0, 0\n    for i := 1; i < len(nums); i++ {\n        if currSum+nums[i] > nums[i] {\n            currSum += nums[i]\n        } else {\n            currSum = nums[i]\n            tempStart = i\n        }\n        if currSum > maxSum {\n            maxSum = currSum\n            start = tempStart\n            end = i\n        }\n    }\n    return maxSum, start, end\n}\n\nfunc main() {\n    tests := [][]int{\n        {-2, 1, -3, 4, -1, 2, 1, -5, 4},\n        {1},\n        {5, 4, -1, 7, 8},\n    }\n    for _, t := range tests {\n        sum, s, e := maxSubArrayWithIndices(t)\n        fmt.Printf("%v: maxSum=%d indices=[%d,%d]\\n", t, sum, s, e)\n    }\n}',
      explanation: 'Алгоритм Кадана — классика динамического программирования за O(n). Ключевое решение: продолжать текущий подмассив или начать новый с текущего элемента. Если currSum + nums[i] < nums[i], значит накопленная сумма отрицательна — выгоднее начать заново. Отслеживание индексов требует tempStart для фиксации начала нового кандидата.'
    }
  ]
}
