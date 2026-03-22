export default {
  id: 32,
  title: 'Практикум: Задачи Easy-Hard',
  description: 'Сборник алгоритмических задач разного уровня сложности: строки, массивы, рекурсия, динамическое программирование.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Разворот строки по словам',
      type: 'practice',
      difficulty: 'easy',
      description: 'Разверните порядок слов в строке. "Hello World Kotlin" -> "Kotlin World Hello".',
      requirements: [
        'reverseWords("Hello World Kotlin") = "Kotlin World Hello"',
        'Игнорировать лишние пробелы',
        'reverseWords("  Kotlin  ") = "Kotlin"'
      ],
      expectedOutput: 'Kotlin World Hello\nKotlin',
      hint: 'trim().split("\\s+".toRegex()).reversed().joinToString(" ")',
      solution: 'fun reverseWords(s: String) = s.trim().split("\\s+".toRegex()).reversed().joinToString(" ")\n\nfun main() {\n    println(reverseWords("Hello World Kotlin"))\n    println(reverseWords("  Kotlin  "))\n}',
      explanation: 'trim убирает крайние пробелы, split("\\s+") разбивает по любым пробелам, reversed() переворачивает список, joinToString(" ") склеивает обратно.'
    },
    {
      id: 2,
      title: 'Задача: Максимальная подпоследовательность',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найдите максимальную сумму подмассива (алгоритм Кадана). maxSubarraySum([-2,1,-3,4,-1,2,1,-5,4]) = 6 (подмассив [4,-1,2,1]).',
      requirements: [
        'Алгоритм Кадана за O(n)',
        'maxSubarraySum([-2,1,-3,4,-1,2,1,-5,4]) = 6',
        'maxSubarraySum([-1,-2,-3]) = -1'
      ],
      expectedOutput: '6\n-1',
      hint: 'currentMax = max(num, currentMax + num). globalMax = max(globalMax, currentMax).',
      solution: 'fun maxSubarraySum(nums: IntArray): Int {\n    var currentMax = nums[0]\n    var globalMax = nums[0]\n    for (i in 1 until nums.size) {\n        currentMax = maxOf(nums[i], currentMax + nums[i])\n        globalMax = maxOf(globalMax, currentMax)\n    }\n    return globalMax\n}\n\nfun main() {\n    println(maxSubarraySum(intArrayOf(-2,1,-3,4,-1,2,1,-5,4)))\n    println(maxSubarraySum(intArrayOf(-1,-2,-3)))\n}',
      explanation: 'Алгоритм Кадана: для каждого элемента выбираем — начать новый подмассив с него или продолжить текущий. currentMax + num < num когда currentMax < 0.'
    },
    {
      id: 3,
      title: 'Задача: Скобочная последовательность',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проверьте, является ли строка корректной скобочной последовательностью. Поддерживайте (), [], {}.',
      requirements: [
        'isValid("()[]{}") = true',
        'isValid("([{}])") = true',
        'isValid("(]") = false',
        'isValid("{[}]") = false'
      ],
      expectedOutput: 'true\ntrue\nfalse\nfalse',
      hint: 'Используйте стек. При открывающей — push, при закрывающей — pop и проверяй соответствие.',
      solution: 'fun isValid(s: String): Boolean {\n    val stack = ArrayDeque<Char>()\n    val pairs = mapOf(\')\' to \'(\', \']\' to \'[\', \'}\' to \'{\')\n    for (ch in s) {\n        if (ch in "([{") stack.addLast(ch)\n        else {\n            if (stack.isEmpty() || stack.last() != pairs[ch]) return false\n            stack.removeLast()\n        }\n    }\n    return stack.isEmpty()\n}\n\nfun main() {\n    println(isValid("()[]{}"))  // true\n    println(isValid("([{}])"))  // true\n    println(isValid("(]"))      // false\n    println(isValid("{[}]"))    // false\n}',
      explanation: 'Стек идеален для проверки вложенности. Открывающие скобки кладём в стек. Закрывающие — проверяем вершину стека. В конце стек должен быть пустым.'
    },
    {
      id: 4,
      title: 'Задача: Двоичный поиск',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте функцию binarySearch(arr: IntArray, target: Int): Int — индекс target в отсортированном массиве, или -1 если не найден.',
      requirements: [
        'binarySearch(intArrayOf(1,3,5,7,9,11), 7) = 3',
        'binarySearch(intArrayOf(1,3,5,7,9,11), 6) = -1',
        'Сложность O(log n)'
      ],
      expectedOutput: '3\n-1',
      hint: 'lo = 0, hi = arr.size - 1. mid = (lo + hi) / 2. Сравни arr[mid] с target.',
      solution: 'fun binarySearch(arr: IntArray, target: Int): Int {\n    var lo = 0\n    var hi = arr.size - 1\n    while (lo <= hi) {\n        val mid = lo + (hi - lo) / 2\n        when {\n            arr[mid] == target -> return mid\n            arr[mid] < target  -> lo = mid + 1\n            else               -> hi = mid - 1\n        }\n    }\n    return -1\n}\n\nfun main() {\n    println(binarySearch(intArrayOf(1,3,5,7,9,11), 7))\n    println(binarySearch(intArrayOf(1,3,5,7,9,11), 6))\n}',
      explanation: 'lo + (hi - lo) / 2 безопаснее чем (lo + hi) / 2 — не переполняет Int. Каждый шаг делит пространство поиска вдвое → O(log n).'
    },
    {
      id: 5,
      title: 'Задача: Перестановки строки',
      type: 'practice',
      difficulty: 'hard',
      description: 'Найдите все перестановки строки. permutations("abc") = ["abc", "acb", "bac", "bca", "cab", "cba"].',
      requirements: [
        'permutations("abc") возвращает List<String> из 6 элементов',
        'permutations("ab") = ["ab", "ba"]',
        'Использовать рекурсию'
      ],
      expectedOutput: '[abc, acb, bac, bca, cab, cba]',
      hint: 'Для каждого символа — зафиксируй его первым, рекурсивно получи перестановки оставшихся.',
      solution: 'fun permutations(s: String): List<String> {\n    if (s.length <= 1) return listOf(s)\n    val result = mutableListOf<String>()\n    for (i in s.indices) {\n        val char = s[i]\n        val rest = s.removeRange(i, i + 1)\n        permutations(rest).forEach { result.add(char + it) }\n    }\n    return result\n}\n\nfun main() {\n    println(permutations("abc").sorted())\n}',
      explanation: 'Рекурсия: фиксируем один символ на первой позиции, рекурсивно генерируем перестановки остатка. Для строки длины n результат содержит n! элементов.'
    },
    {
      id: 6,
      title: 'Задача: Самая длинная общая подстрока',
      type: 'practice',
      difficulty: 'hard',
      description: 'Найдите длину самой длинной общей подпоследовательности (LCS) двух строк. lcs("abcde", "ace") = 3.',
      requirements: [
        'lcs("abcde", "ace") = 3 (ace)',
        'lcs("abc", "abc") = 3',
        'lcs("abc", "def") = 0',
        'Динамическое программирование'
      ],
      expectedOutput: '3\n3\n0',
      hint: 'dp[i][j] = если s1[i-1]==s2[j-1]: dp[i-1][j-1]+1, иначе max(dp[i-1][j], dp[i][j-1]).',
      solution: 'fun lcs(s1: String, s2: String): Int {\n    val m = s1.length\n    val n = s2.length\n    val dp = Array(m + 1) { IntArray(n + 1) }\n    for (i in 1..m) for (j in 1..n) {\n        dp[i][j] = if (s1[i-1] == s2[j-1]) dp[i-1][j-1] + 1\n                   else maxOf(dp[i-1][j], dp[i][j-1])\n    }\n    return dp[m][n]\n}\n\nfun main() {\n    println(lcs("abcde", "ace"))\n    println(lcs("abc", "abc"))\n    println(lcs("abc", "def"))\n}',
      explanation: 'DP-таблица dp[i][j] хранит LCS первых i символов s1 и j символов s2. Если символы совпадают — расширяем предыдущую LCS; иначе берём лучший из соседей.'
    },
    {
      id: 7,
      title: 'Задача: Задача о рюкзаке',
      type: 'practice',
      difficulty: 'hard',
      description: 'Классическая задача о рюкзаке 0/1: максимальная стоимость предметов при ограничении по весу.',
      requirements: [
        'knapsack(capacity: Int, weights: IntArray, values: IntArray): Int',
        'knapsack(50, [10,20,30], [60,100,120]) = 220',
        'Каждый предмет можно взять один раз'
      ],
      expectedOutput: '220',
      hint: 'dp[i][w] = максимальная стоимость с первыми i предметами при ёмкости w.',
      solution: 'fun knapsack(capacity: Int, weights: IntArray, values: IntArray): Int {\n    val n = weights.size\n    val dp = Array(n + 1) { IntArray(capacity + 1) }\n    for (i in 1..n) for (w in 0..capacity) {\n        dp[i][w] = if (weights[i-1] <= w)\n            maxOf(dp[i-1][w], dp[i-1][w - weights[i-1]] + values[i-1])\n        else\n            dp[i-1][w]\n    }\n    return dp[n][capacity]\n}\n\nfun main() {\n    println(knapsack(50, intArrayOf(10,20,30), intArrayOf(60,100,120)))\n}',
      explanation: 'dp[i][w]: берём i-й предмет (если помещается) или нет. При взятии: предыдущая стоимость для (w - вес_предмета) + стоимость_предмета. Берём максимум из двух вариантов.'
    },
    {
      id: 8,
      title: 'Задача: Топологическая сортировка',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте топологическую сортировку ориентированного ациклического графа (DAG) с помощью алгоритма Кана.',
      requirements: [
        'topologicalSort(n: Int, edges: List<Pair<Int,Int>>): List<Int>',
        'Граф: 5->2, 5->0, 4->0, 4->1, 2->3, 3->1',
        'Один из верных ответов: [4, 5, 2, 3, 1, 0]'
      ],
      expectedOutput: 'Топологический порядок без циклов',
      hint: 'Алгоритм Кана: считаем входящие рёбра (inDegree), кладём в очередь вершины с inDegree=0, удаляем рёбра.',
      solution: 'fun topologicalSort(n: Int, edges: List<Pair<Int,Int>>): List<Int> {\n    val adj = Array(n) { mutableListOf<Int>() }\n    val inDegree = IntArray(n)\n    for ((u, v) in edges) { adj[u].add(v); inDegree[v]++ }\n    val queue = ArrayDeque<Int>()\n    for (i in 0 until n) if (inDegree[i] == 0) queue.add(i)\n    val result = mutableListOf<Int>()\n    while (queue.isNotEmpty()) {\n        val u = queue.removeFirst()\n        result.add(u)\n        for (v in adj[u]) { if (--inDegree[v] == 0) queue.add(v) }\n    }\n    return if (result.size == n) result else emptyList() // цикл обнаружен\n}\n\nfun main() {\n    val edges = listOf(5 to 2, 5 to 0, 4 to 0, 4 to 1, 2 to 3, 3 to 1)\n    println(topologicalSort(6, edges))\n}',
      explanation: 'Алгоритм Кана: начинаем с вершин без входящих рёбер. Удаляем вершину и её исходящие рёбра — если у соседа inDegree стал 0, добавляем в очередь. Если result.size < n — есть цикл.'
    },
    {
      id: 9,
      title: 'Задача: Сжатие строки (RLE)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте Run-Length Encoding: "aaabbc" -> "a3b2c1". Если сжатая строка не короче исходной — вернуть исходную.',
      requirements: [
        'compress("aaabbc") = "a3b2c1"',
        'compress("abcd") = "abcd" (не короче)',
        'compress("aabbbcccc") = "a2b3c4"'
      ],
      expectedOutput: 'a3b2c1\nabcd\na2b3c4',
      hint: 'Итерируйте по строке, считайте подряд идущие одинаковые символы.',
      solution: 'fun compress(s: String): String {\n    if (s.isEmpty()) return s\n    val sb = StringBuilder()\n    var count = 1\n    for (i in 1..s.length) {\n        if (i < s.length && s[i] == s[i-1]) count++\n        else { sb.append(s[i-1]); sb.append(count); count = 1 }\n    }\n    return if (sb.length < s.length) sb.toString() else s\n}\n\nfun main() {\n    println(compress("aaabbc"))\n    println(compress("abcd"))\n    println(compress("aabbbcccc"))\n}',
      explanation: 'Сравниваем каждый символ с предыдущим. При смене символа записываем предыдущий с его счётчиком. Цикл до s.length включительно: последнее "i-1" записывается при i == s.length.'
    },
    {
      id: 10,
      title: 'Задача: Матричное умножение',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте умножение двух матриц. matMul(A, B) где A — m×k, B — k×n, результат — m×n.',
      requirements: [
        'matMul(A: Array<IntArray>, B: Array<IntArray>): Array<IntArray>',
        'A = [[1,2],[3,4]], B = [[5,6],[7,8]] -> [[19,22],[43,50]]',
        'Проверить размерность'
      ],
      expectedOutput: '19 22\n43 50',
      hint: 'C[i][j] = sum(A[i][k] * B[k][j]) для k в 0..cols_A.',
      solution: 'fun matMul(A: Array<IntArray>, B: Array<IntArray>): Array<IntArray> {\n    val m = A.size; val k = A[0].size; val n = B[0].size\n    require(k == B.size) { "Несовместимые размеры матриц" }\n    val C = Array(m) { IntArray(n) }\n    for (i in 0 until m) for (j in 0 until n) for (p in 0 until k) C[i][j] += A[i][p] * B[p][j]\n    return C\n}\n\nfun main() {\n    val A = arrayOf(intArrayOf(1,2), intArrayOf(3,4))\n    val B = arrayOf(intArrayOf(5,6), intArrayOf(7,8))\n    matMul(A, B).forEach { row -> println(row.joinToString(" ")) }\n}',
      explanation: 'Тройной цикл: i по строкам C, j по столбцам C, p по общему измерению. C[i][j] — скалярное произведение i-й строки A и j-го столбца B.'
    }
  ]
}
