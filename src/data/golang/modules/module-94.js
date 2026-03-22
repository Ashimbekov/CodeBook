export default {
  id: 94,
  title: 'Практикум: Задачи Hard',
  description: 'Сложные алгоритмические задачи на Go: слияние K отсортированных списков, медиана двух массивов, вода в контейнере, скользящий максимум, разбиение строки (DP), регулярные выражения и другие задачи уровня Hard.',
  lessons: [
    {
      id: 1,
      title: 'Слияние K отсортированных срезов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Слей K отсортированных срезов в один отсортированный срез. Используй min-heap для эффективного решения.',
      requirements: [
        'Функция mergeKSorted(lists [][]int) []int',
        'Реализуй min-heap через container/heap из стандартной библиотеки',
        'Сложность: O(N log K), где N — общее количество элементов, K — количество срезов',
        'Протестируй: [[1,4,5],[1,3,4],[2,6]] -> [1,1,2,3,4,4,5,6]',
        'Также: [] -> []; [[]] -> []'
      ],
      expectedOutput: '[[1,4,5],[1,3,4],[2,6]] -> [1 1 2 3 4 4 5 6]\n[] -> []\n[[1],[]] -> [1]',
      hint: 'Создай heap элементов {value, listIndex, elementIndex}. Инициализируй первыми элементами каждого списка. При извлечении минимума добавляй следующий элемент из того же списка.',
      solution: 'package main\n\nimport (\n    "container/heap"\n    "fmt"\n)\n\ntype Item struct {\n    val, listIdx, elemIdx int\n}\n\ntype MinHeap []Item\n\nfunc (h MinHeap) Len() int           { return len(h) }\nfunc (h MinHeap) Less(i, j int) bool { return h[i].val < h[j].val }\nfunc (h MinHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }\nfunc (h *MinHeap) Push(x interface{}) { *h = append(*h, x.(Item)) }\nfunc (h *MinHeap) Pop() interface{} {\n    old := *h\n    n := len(old)\n    x := old[n-1]\n    *h = old[:n-1]\n    return x\n}\n\nfunc mergeKSorted(lists [][]int) []int {\n    h := &MinHeap{}\n    heap.Init(h)\n    for i, list := range lists {\n        if len(list) > 0 {\n            heap.Push(h, Item{list[0], i, 0})\n        }\n    }\n    var result []int\n    for h.Len() > 0 {\n        item := heap.Pop(h).(Item)\n        result = append(result, item.val)\n        nextIdx := item.elemIdx + 1\n        if nextIdx < len(lists[item.listIdx]) {\n            heap.Push(h, Item{lists[item.listIdx][nextIdx], item.listIdx, nextIdx})\n        }\n    }\n    return result\n}\n\nfunc main() {\n    fmt.Printf("[[1,4,5],[1,3,4],[2,6]] -> %v\\n", mergeKSorted([][]int{{1, 4, 5}, {1, 3, 4}, {2, 6}}))\n    fmt.Printf("[] -> %v\\n", mergeKSorted([][]int{}))\n    fmt.Printf("[[1],[]] -> %v\\n", mergeKSorted([][]int{{1}, {}}))\n}',
      explanation: 'container/heap требует реализации интерфейса heap.Interface (5 методов). Min-heap всегда держит минимум на вершине. Алгоритм: инициализируем heap первыми элементами всех списков, затем каждый раз извлекаем минимум и добавляем следующий элемент из того же списка. O(N log K): N операций Pop, каждая O(log K).'
    },
    {
      id: 2,
      title: 'Медиана двух отсортированных массивов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Найди медиану двух отсортированных массивов за O(log(m+n)) времени.',
      requirements: [
        'Функция findMedianSortedArrays(nums1, nums2 []int) float64',
        'Бинарный поиск по меньшему массиву',
        'Сложность строго O(log(min(m,n)))',
        'Протестируй: [1,3]+[2] -> 2.0; [1,2]+[3,4] -> 2.5; [0,0]+[0,0] -> 0.0; []+[1] -> 1.0'
      ],
      expectedOutput: '[1,3]+[2] = 2.00\n[1,2]+[3,4] = 2.50\n[0,0]+[0,0] = 0.00\n[]+[1] = 1.00',
      hint: 'Бинарный поиск по nums1 (меньшему). Ищи разбиение: partition1 в nums1 и partition2 = (m+n+1)/2 - partition1 в nums2. Условие правильного разбиения: maxLeft1 <= minRight2 && maxLeft2 <= minRight1.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "math"\n)\n\nfunc findMedianSortedArrays(nums1, nums2 []int) float64 {\n    if len(nums1) > len(nums2) {\n        nums1, nums2 = nums2, nums1\n    }\n    m, n := len(nums1), len(nums2)\n    lo, hi := 0, m\n    for lo <= hi {\n        p1 := (lo + hi) / 2\n        p2 := (m+n+1)/2 - p1\n        maxLeft1, minRight1 := math.MinInt64, math.MaxInt64\n        maxLeft2, minRight2 := math.MinInt64, math.MaxInt64\n        if p1 > 0 {\n            maxLeft1 = nums1[p1-1]\n        }\n        if p1 < m {\n            minRight1 = nums1[p1]\n        }\n        if p2 > 0 {\n            maxLeft2 = nums2[p2-1]\n        }\n        if p2 < n {\n            minRight2 = nums2[p2]\n        }\n        if maxLeft1 <= minRight2 && maxLeft2 <= minRight1 {\n            if (m+n)%2 == 1 {\n                if maxLeft1 > maxLeft2 {\n                    return float64(maxLeft1)\n                }\n                return float64(maxLeft2)\n            }\n            leftMax := maxLeft1\n            if maxLeft2 > leftMax {\n                leftMax = maxLeft2\n            }\n            rightMin := minRight1\n            if minRight2 < rightMin {\n                rightMin = minRight2\n            }\n            return float64(leftMax+rightMin) / 2.0\n        } else if maxLeft1 > minRight2 {\n            hi = p1 - 1\n        } else {\n            lo = p1 + 1\n        }\n    }\n    return 0\n}\n\nfunc main() {\n    tests := [][2][]int{\n        {{1, 3}, {2}},\n        {{1, 2}, {3, 4}},\n        {{0, 0}, {0, 0}},\n        {{}, {1}},\n    }\n    for _, t := range tests {\n        fmt.Printf("%v+%v = %.2f\\n", t[0], t[1], findMedianSortedArrays(t[0], t[1]))\n    }\n}',
      explanation: 'Ключевая идея: разбить оба массива на левую и правую половины. Правильное разбиение: все элементы левых половин <= всех элементов правых. Бинарный поиск по меньшему массиву находит правильную точку разбиения. При нечётной суммарной длине медиана = max левых элементов, при чётной = (max левых + min правых) / 2.'
    },
    {
      id: 3,
      title: 'Сбор дождевой воды',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив высот столбиков. Вычисли, сколько дождевой воды скапливается между ними.',
      requirements: [
        'Функция trap(height []int) int — O(n) время, O(1) память',
        'Также реализуй trapDP(height []int) int — через предвычисленные массивы leftMax и rightMax',
        'Объясни разницу подходов',
        'Протестируй: [0,1,0,2,1,0,1,3,2,1,2,1] -> 6; [4,2,0,3,2,5] -> 9'
      ],
      expectedOutput: '[0,1,0,2,1,0,1,3,2,1,2,1] -> 6\n[4,2,0,3,2,5] -> 9\ntrapDP: те же результаты',
      hint: 'Два указателя: l=0, r=n-1. Поддерживай leftMax и rightMax. Если height[l] < height[r]: вода над l = leftMax - height[l], двигай l вправо. Иначе — аналогично для r.',
      solution: 'package main\n\nimport "fmt"\n\nfunc trap(height []int) int {\n    l, r := 0, len(height)-1\n    leftMax, rightMax := 0, 0\n    water := 0\n    for l < r {\n        if height[l] < height[r] {\n            if height[l] >= leftMax {\n                leftMax = height[l]\n            } else {\n                water += leftMax - height[l]\n            }\n            l++\n        } else {\n            if height[r] >= rightMax {\n                rightMax = height[r]\n            } else {\n                water += rightMax - height[r]\n            }\n            r--\n        }\n    }\n    return water\n}\n\nfunc trapDP(height []int) int {\n    n := len(height)\n    if n == 0 {\n        return 0\n    }\n    leftMax := make([]int, n)\n    rightMax := make([]int, n)\n    leftMax[0] = height[0]\n    for i := 1; i < n; i++ {\n        if height[i] > leftMax[i-1] {\n            leftMax[i] = height[i]\n        } else {\n            leftMax[i] = leftMax[i-1]\n        }\n    }\n    rightMax[n-1] = height[n-1]\n    for i := n - 2; i >= 0; i-- {\n        if height[i] > rightMax[i+1] {\n            rightMax[i] = height[i]\n        } else {\n            rightMax[i] = rightMax[i+1]\n        }\n    }\n    water := 0\n    for i := 0; i < n; i++ {\n        minMax := leftMax[i]\n        if rightMax[i] < minMax {\n            minMax = rightMax[i]\n        }\n        water += minMax - height[i]\n    }\n    return water\n}\n\nfunc main() {\n    h1 := []int{0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1}\n    h2 := []int{4, 2, 0, 3, 2, 5}\n    fmt.Printf("%v -> %d\\n", h1, trap(h1))\n    fmt.Printf("%v -> %d\\n", h2, trap(h2))\n    fmt.Printf("trapDP: %d %d\\n", trapDP(h1), trapDP(h2))\n}',
      explanation: 'Вода над позицией i = min(maxLeft[i], maxRight[i]) - height[i]. DP-подход предвычисляет эти максимумы за O(n) с O(n) памятью. Два-указателя оптимизирует до O(1) памяти: мы знаем, что для позиции l высота справа (rightMax) гарантированно >= height[r] >= height[l] (иначе мы бы шли справа). Значит ограничивающая стена — leftMax.'
    },
    {
      id: 4,
      title: 'Скользящий максимум окна',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив и размер окна k. Найди максимум в каждом скользящем окне размера k.',
      requirements: [
        'Функция maxSlidingWindow(nums []int, k int) []int',
        'Используй deque (очередь с двумя концами) для O(n) решения',
        'Deque хранит индексы в убывающем порядке значений',
        'Протестируй: [1,3,-1,-3,5,3,6,7] k=3 -> [3,3,5,5,6,7]; [1] k=1 -> [1]; [1,-1] k=1 -> [1,-1]'
      ],
      expectedOutput: '[1,3,-1,-3,5,3,6,7] k=3 -> [3 3 5 5 6 7]\n[1] k=1 -> [1]\n[1,-1] k=1 -> [1 -1]',
      hint: 'Deque хранит индексы. При добавлении нового элемента: удаляй из конца deque все индексы с меньшими значениями. При выходе индекса из окна: удаляй из начала. Максимум окна — nums[deque[0]].',
      solution: 'package main\n\nimport "fmt"\n\nfunc maxSlidingWindow(nums []int, k int) []int {\n    if len(nums) == 0 {\n        return nil\n    }\n    deque := make([]int, 0, k)\n    var result []int\n    for i := 0; i < len(nums); i++ {\n        // Удаляем элементы вне окна\n        for len(deque) > 0 && deque[0] < i-k+1 {\n            deque = deque[1:]\n        }\n        // Удаляем меньшие элементы из конца\n        for len(deque) > 0 && nums[deque[len(deque)-1]] < nums[i] {\n            deque = deque[:len(deque)-1]\n        }\n        deque = append(deque, i)\n        // Добавляем результат после заполнения первого окна\n        if i >= k-1 {\n            result = append(result, nums[deque[0]])\n        }\n    }\n    return result\n}\n\nfunc main() {\n    fmt.Printf("[1,3,-1,-3,5,3,6,7] k=3 -> %v\\n", maxSlidingWindow([]int{1, 3, -1, -3, 5, 3, 6, 7}, 3))\n    fmt.Printf("[1] k=1 -> %v\\n", maxSlidingWindow([]int{1}, 1))\n    fmt.Printf("[1,-1] k=1 -> %v\\n", maxSlidingWindow([]int{1, -1}, 1))\n}',
      explanation: 'Монотонная deque: хранит индексы в порядке убывания значений. Инвариант: deque[0] всегда — индекс максимума текущего окна. При добавлении нового элемента очищаем "бесполезные" меньшие элементы сзади (они никогда не станут максимумом). При выходе из окна очищаем спереди. Каждый элемент добавляется/удаляется не более одного раза — O(n).'
    },
    {
      id: 5,
      title: 'Word Break (динамическое программирование)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Проверь, можно ли разбить строку s на слова из словаря. Верни все возможные разбиения.',
      requirements: [
        'Функция wordBreak(s string, wordDict []string) bool — только проверка',
        'Функция wordBreakAll(s string, wordDict []string) []string — все разбиения',
        'wordBreak использует DP: dp[i] = true если s[:i] можно разбить',
        'Протестируй wordBreak: "leetcode" dict=["leet","code"] -> true; "applepenapple" dict=["apple","pen"] -> true; "catsandog" dict=["cats","dog","sand","and","cat"] -> false',
        'Протестируй wordBreakAll: "catsanddog" dict=["cat","cats","and","sand","dog"] -> ["cat sand dog","cats and dog"]'
      ],
      expectedOutput: '"leetcode" -> true\n"applepenapple" -> true\n"catsandog" -> false\n"catsanddog" разбиения: [cat sand dog cats and dog]',
      hint: 'DP: dp[0]=true. dp[i] = true если существует j < i такой что dp[j]=true и s[j:i] в словаре. Для wordBreakAll используй мемоизацию с backtracking.',
      solution: 'package main\n\nimport "fmt"\n\nfunc wordBreak(s string, wordDict []string) bool {\n    wordSet := make(map[string]bool)\n    for _, w := range wordDict {\n        wordSet[w] = true\n    }\n    dp := make([]bool, len(s)+1)\n    dp[0] = true\n    for i := 1; i <= len(s); i++ {\n        for j := 0; j < i; j++ {\n            if dp[j] && wordSet[s[j:i]] {\n                dp[i] = true\n                break\n            }\n        }\n    }\n    return dp[len(s)]\n}\n\nfunc wordBreakAll(s string, wordDict []string) []string {\n    wordSet := make(map[string]bool)\n    for _, w := range wordDict {\n        wordSet[w] = true\n    }\n    memo := make(map[int][]string)\n    var backtrack func(start int) []string\n    backtrack = func(start int) []string {\n        if res, ok := memo[start]; ok {\n            return res\n        }\n        if start == len(s) {\n            return []string{""}\n        }\n        var result []string\n        for end := start + 1; end <= len(s); end++ {\n            word := s[start:end]\n            if wordSet[word] {\n                rest := backtrack(end)\n                for _, r := range rest {\n                    if r == "" {\n                        result = append(result, word)\n                    } else {\n                        result = append(result, word+" "+r)\n                    }\n                }\n            }\n        }\n        memo[start] = result\n        return result\n    }\n    return backtrack(0)\n}\n\nfunc main() {\n    fmt.Printf("%q -> %v\\n", "leetcode", wordBreak("leetcode", []string{"leet", "code"}))\n    fmt.Printf("%q -> %v\\n", "applepenapple", wordBreak("applepenapple", []string{"apple", "pen"}))\n    fmt.Printf("%q -> %v\\n", "catsandog", wordBreak("catsandog", []string{"cats", "dog", "sand", "and", "cat"}))\n    all := wordBreakAll("catsanddog", []string{"cat", "cats", "and", "sand", "dog"})\n    fmt.Printf("%q разбиения: %v\\n", "catsanddog", all)\n}',
      explanation: 'DP: строим решение снизу вверх. dp[i] истинно, если существует точка разбиения j, где dp[j]=true и s[j:i] — слово из словаря. wordBreakAll использует мемоизацию рекурсии: для каждой позиции кешируем все возможные разбиения суффикса. Это предотвращает экспоненциальный взрыв при перекрывающихся подзадачах.'
    },
    {
      id: 6,
      title: 'Сопоставление регулярных выражений',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй сопоставление с шаблоном, поддерживающим "." (любой символ) и "*" (ноль или более предыдущих символов).',
      requirements: [
        'Функция isMatch(s, p string) bool',
        'Используй DP: dp[i][j] = true если s[:i] совпадает с p[:j]',
        'Протестируй: ("aa","a") -> false; ("aa","a*") -> true; ("ab",".*") -> true; ("aab","c*a*b") -> true; ("mississippi","mis*is*p*.") -> false'
      ],
      expectedOutput: '("aa","a") -> false\n("aa","a*") -> true\n("ab",".*") -> true\n("aab","c*a*b") -> true\n("mississippi","mis*is*p*.") -> false',
      hint: 'dp[0][0]=true (пустая строка совпадает с пустым паттерном). dp[0][j]=true если p[j-1]=="*" && dp[0][j-2] (звёздочка может обнулять предыдущий символ). Для dp[i][j]: если p[j-1]=="*": dp[i][j] = dp[i][j-2] || (совпадает один символ и dp[i-1][j]).',
      solution: 'package main\n\nimport "fmt"\n\nfunc isMatch(s, p string) bool {\n    m, n := len(s), len(p)\n    dp := make([][]bool, m+1)\n    for i := range dp {\n        dp[i] = make([]bool, n+1)\n    }\n    dp[0][0] = true\n    for j := 2; j <= n; j++ {\n        if p[j-1] == \'*\' {\n            dp[0][j] = dp[0][j-2]\n        }\n    }\n    for i := 1; i <= m; i++ {\n        for j := 1; j <= n; j++ {\n            if p[j-1] == \'*\' {\n                // Ноль вхождений предыдущего символа\n                dp[i][j] = dp[i][j-2]\n                // Одно или более вхождений\n                if p[j-2] == \'.\' || p[j-2] == s[i-1] {\n                    dp[i][j] = dp[i][j] || dp[i-1][j]\n                }\n            } else if p[j-1] == \'.\' || p[j-1] == s[i-1] {\n                dp[i][j] = dp[i-1][j-1]\n            }\n        }\n    }\n    return dp[m][n]\n}\n\nfunc main() {\n    tests := [][2]string{\n        {"aa", "a"},\n        {"aa", "a*"},\n        {"ab", ".*"},\n        {"aab", "c*a*b"},\n        {"mississippi", "mis*is*p*."},\n    }\n    for _, t := range tests {\n        fmt.Printf("(%q,%q) -> %v\\n", t[0], t[1], isMatch(t[0], t[1]))\n    }\n}',
      explanation: 'DP на 2D таблице. Звёздочка "*" имеет два значения: 0 вхождений (dp[i][j-2]) или 1+ вхождений (если текущий символ совпадает с предыдущим в паттерне, берём dp[i-1][j] — "съедаем" один символ строки). dp[i-1][j] означает "используй текущий символ паттерна ещё раз". Инициализация dp[0][j] обрабатывает пустую строку с паттернами типа "a*b*c*".'
    },
    {
      id: 7,
      title: 'Минимальное окно подстроки',
      type: 'practice',
      difficulty: 'hard',
      description: 'Найди минимальную подстроку в s, содержащую все символы из t (включая дубликаты).',
      requirements: [
        'Функция minWindow(s, t string) string',
        'Скользящее окно с двумя счётчиками частот',
        'O(|s| + |t|) по времени',
        'Протестируй: ("ADOBECODEBANC","ABC") -> "BANC"; ("a","a") -> "a"; ("a","aa") -> ""; ("a","b") -> ""'
      ],
      expectedOutput: '("ADOBECODEBANC","ABC") -> "BANC"\n("a","a") -> "a"\n("a","aa") -> ""\n("a","b") -> ""',
      hint: 'need = карта частот t. have = 0, required = количество уникальных символов t. Расширяй окно вправо. Когда have == required (все символы покрыты) — сжимай слева, обновляя минимум.',
      solution: 'package main\n\nimport "fmt"\n\nfunc minWindow(s, t string) string {\n    if len(t) > len(s) {\n        return ""\n    }\n    need := make(map[byte]int)\n    for i := 0; i < len(t); i++ {\n        need[t[i]]++\n    }\n    window := make(map[byte]int)\n    have, required := 0, len(need)\n    l := 0\n    minLen := len(s) + 1\n    minStart := 0\n    for r := 0; r < len(s); r++ {\n        c := s[r]\n        window[c]++\n        if need[c] > 0 && window[c] == need[c] {\n            have++\n        }\n        for have == required {\n            if r-l+1 < minLen {\n                minLen = r - l + 1\n                minStart = l\n            }\n            lc := s[l]\n            window[lc]--\n            if need[lc] > 0 && window[lc] < need[lc] {\n                have--\n            }\n            l++\n        }\n    }\n    if minLen > len(s) {\n        return ""\n    }\n    return s[minStart : minStart+minLen]\n}\n\nfunc main() {\n    tests := [][2]string{{"ADOBECODEBANC", "ABC"}, {"a", "a"}, {"a", "aa"}, {"a", "b"}}\n    for _, t := range tests {\n        fmt.Printf("(%q,%q) -> %q\\n", t[0], t[1], minWindow(t[0], t[1]))\n    }\n}',
      explanation: 'Скользящее окно: переменная have считает, сколько уникальных символов t полностью покрыты окном (window[c] >= need[c]). Когда have == required — окно валидно, сжимаем слева для минимизации. have убывает, только когда покрытие ухудшается (window[c] < need[c]). Важно: window может содержать лишние символы — это нормально.'
    },
    {
      id: 8,
      title: 'Сериализация и десериализация бинарного дерева',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй сериализацию бинарного дерева в строку и десериализацию обратно. Дерево должно точно восстанавливаться.',
      requirements: [
        'Структура TreeNode: Val int, Left, Right *TreeNode',
        'Функция serialize(root *TreeNode) string — обход в ширину, nil = "#"',
        'Функция deserialize(data string) *TreeNode',
        'Построй дерево, сериализуй, десериализуй и проверь идентичность',
        'Протестируй: [1,2,3,nil,nil,4,5] -> сериализованная строка -> обратно'
      ],
      expectedOutput: 'Дерево: [1 2 3 # # 4 5]\nСериализация: "1,2,3,#,#,4,5"\nДесериализация прошла успешно\nСумма узлов: 15',
      hint: 'Сериализация BFS: используй очередь, nil узлы записывай как "#". Десериализация: создай root из первого значения, очередь родителей. Для каждого родителя берём следующие два значения как left и right.',
      solution: 'package main\n\nimport (\n    "fmt"\n    "strconv"\n    "strings"\n)\n\ntype TreeNode struct {\n    Val   int\n    Left  *TreeNode\n    Right *TreeNode\n}\n\nfunc serialize(root *TreeNode) string {\n    if root == nil {\n        return ""\n    }\n    var parts []string\n    queue := []*TreeNode{root}\n    for len(queue) > 0 {\n        node := queue[0]\n        queue = queue[1:]\n        if node == nil {\n            parts = append(parts, "#")\n        } else {\n            parts = append(parts, strconv.Itoa(node.Val))\n            queue = append(queue, node.Left, node.Right)\n        }\n    }\n    return strings.Join(parts, ",")\n}\n\nfunc deserialize(data string) *TreeNode {\n    if data == "" {\n        return nil\n    }\n    parts := strings.Split(data, ",")\n    if parts[0] == "#" {\n        return nil\n    }\n    val, _ := strconv.Atoi(parts[0])\n    root := &TreeNode{Val: val}\n    queue := []*TreeNode{root}\n    i := 1\n    for len(queue) > 0 && i < len(parts) {\n        node := queue[0]\n        queue = queue[1:]\n        if i < len(parts) && parts[i] != "#" {\n            v, _ := strconv.Atoi(parts[i])\n            node.Left = &TreeNode{Val: v}\n            queue = append(queue, node.Left)\n        }\n        i++\n        if i < len(parts) && parts[i] != "#" {\n            v, _ := strconv.Atoi(parts[i])\n            node.Right = &TreeNode{Val: v}\n            queue = append(queue, node.Right)\n        }\n        i++\n    }\n    return root\n}\n\nfunc sumTree(root *TreeNode) int {\n    if root == nil {\n        return 0\n    }\n    return root.Val + sumTree(root.Left) + sumTree(root.Right)\n}\n\nfunc main() {\n    root := &TreeNode{Val: 1,\n        Left:  &TreeNode{Val: 2},\n        Right: &TreeNode{Val: 3, Left: &TreeNode{Val: 4}, Right: &TreeNode{Val: 5}},\n    }\n    s := serialize(root)\n    fmt.Printf("Сериализация: %q\\n", s)\n    restored := deserialize(s)\n    fmt.Printf("Сумма узлов оригинала: %d\\n", sumTree(root))\n    fmt.Printf("Сумма узлов восстановленного: %d\\n", sumTree(restored))\n    fmt.Println("Десериализация прошла успешно")\n}',
      explanation: 'BFS-сериализация проста для понимания: уровень за уровнем. nil узлы помечаются "#" и не добавляются в очередь (иначе очередь никогда не опустеет). При десериализации родители в очереди — ожидают двух детей подряд из среза parts. Это взаимно однозначное соответствие обеспечивает корректное восстановление.'
    },
    {
      id: 9,
      title: 'Наибольший прямоугольник в гистограмме',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив высот гистограммы. Найди площадь наибольшего прямоугольника.',
      requirements: [
        'Функция largestRectangle(heights []int) int',
        'Использует стек для O(n) решения',
        'Протестируй: [2,1,5,6,2,3] -> 10; [2,4] -> 4; [1] -> 1; [2,1,2] -> 3'
      ],
      expectedOutput: '[2,1,5,6,2,3] -> 10\n[2,4] -> 4\n[1] -> 1\n[2,1,2] -> 3',
      hint: 'Стек хранит индексы в порядке возрастания высот. При h[i] < h[stack.top]: выталкиваем из стека, ширина = i - stack.top - 1 (или просто i если стек пуст). Добавь 0 в конец heights для финальной обработки.',
      solution: 'package main\n\nimport "fmt"\n\nfunc largestRectangle(heights []int) int {\n    heights = append(heights, 0)\n    stack := []int{}\n    maxArea := 0\n    for i, h := range heights {\n        for len(stack) > 0 && heights[stack[len(stack)-1]] > h {\n            top := stack[len(stack)-1]\n            stack = stack[:len(stack)-1]\n            width := i\n            if len(stack) > 0 {\n                width = i - stack[len(stack)-1] - 1\n            }\n            area := heights[top] * width\n            if area > maxArea {\n                maxArea = area\n            }\n        }\n        stack = append(stack, i)\n    }\n    return maxArea\n}\n\nfunc main() {\n    tests := [][]int{{2, 1, 5, 6, 2, 3}, {2, 4}, {1}, {2, 1, 2}}\n    expected := []int{10, 4, 1, 3}\n    for i, t := range tests {\n        result := largestRectangle(t)\n        fmt.Printf("%v -> %d (верно: %v)\\n", t, result, result == expected[i])\n    }\n}',
      explanation: 'Монотонный стек: храним индексы с возрастающими высотами. Когда встречаем высоту ниже вершины стека — вытолкнутый столбец ограничен справа текущим i, слева — следующим элементом стека. Ширина = i - stack.top - 1. Добавление 0 в конец гарантирует очистку стека. Каждый элемент входит и выходит из стека ровно один раз — O(n).'
    },
    {
      id: 10,
      title: 'Редакционное расстояние (Edit Distance)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Найди минимальное количество операций (вставка, удаление, замена) для преобразования строки word1 в word2.',
      requirements: [
        'Функция minEditDistance(word1, word2 string) int',
        'Классический DP на двумерной таблице',
        'Также реализуй функцию editOperations(word1, word2 string) []string — список операций',
        'Протестируй: ("horse","ros") -> 3; ("intention","execution") -> 5; ("","abc") -> 3; ("abc","abc") -> 0'
      ],
      expectedOutput: '("horse","ros") -> 3\n("intention","execution") -> 5\n("","abc") -> 3\n("abc","abc") -> 0',
      hint: 'dp[i][j] = минимальное расстояние между word1[:i] и word2[:j]. Base cases: dp[i][0]=i, dp[0][j]=j. Переход: если символы равны — dp[i][j]=dp[i-1][j-1], иначе min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+1) — удаление, вставка, замена.',
      solution: 'package main\n\nimport "fmt"\n\nfunc minEditDistance(word1, word2 string) int {\n    m, n := len(word1), len(word2)\n    dp := make([][]int, m+1)\n    for i := range dp {\n        dp[i] = make([]int, n+1)\n    }\n    for i := 0; i <= m; i++ {\n        dp[i][0] = i\n    }\n    for j := 0; j <= n; j++ {\n        dp[0][j] = j\n    }\n    for i := 1; i <= m; i++ {\n        for j := 1; j <= n; j++ {\n            if word1[i-1] == word2[j-1] {\n                dp[i][j] = dp[i-1][j-1]\n            } else {\n                dp[i][j] = 1 + min3(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\n            }\n        }\n    }\n    return dp[m][n]\n}\n\nfunc min3(a, b, c int) int {\n    if a < b {\n        if a < c {\n            return a\n        }\n        return c\n    }\n    if b < c {\n        return b\n    }\n    return c\n}\n\nfunc editOperations(word1, word2 string) []string {\n    m, n := len(word1), len(word2)\n    dp := make([][]int, m+1)\n    for i := range dp {\n        dp[i] = make([]int, n+1)\n        dp[i][0] = i\n    }\n    for j := 0; j <= n; j++ {\n        dp[0][j] = j\n    }\n    for i := 1; i <= m; i++ {\n        for j := 1; j <= n; j++ {\n            if word1[i-1] == word2[j-1] {\n                dp[i][j] = dp[i-1][j-1]\n            } else {\n                dp[i][j] = 1 + min3(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\n            }\n        }\n    }\n    var ops []string\n    i, j := m, n\n    for i > 0 || j > 0 {\n        if i > 0 && j > 0 && word1[i-1] == word2[j-1] {\n            i--; j--\n        } else if j > 0 && (i == 0 || dp[i][j-1] <= dp[i-1][j] && dp[i][j-1] <= dp[i-1][j-1]) {\n            ops = append([]string{fmt.Sprintf("Вставить %c на позиции %d", word2[j-1], i)}, ops...)\n            j--\n        } else if i > 0 && (j == 0 || dp[i-1][j] <= dp[i][j-1] && dp[i-1][j] <= dp[i-1][j-1]) {\n            ops = append([]string{fmt.Sprintf("Удалить %c на позиции %d", word1[i-1], i-1)}, ops...)\n            i--\n        } else {\n            ops = append([]string{fmt.Sprintf("Заменить %c -> %c на позиции %d", word1[i-1], word2[j-1], i-1)}, ops...)\n            i--; j--\n        }\n    }\n    return ops\n}\n\nfunc main() {\n    tests := [][2]string{{"horse", "ros"}, {"intention", "execution"}, {"", "abc"}, {"abc", "abc"}}\n    for _, t := range tests {\n        fmt.Printf("(%q,%q) -> %d\\n", t[0], t[1], minEditDistance(t[0], t[1]))\n    }\n    ops := editOperations("horse", "ros")\n    fmt.Println("\\nОперации для horse -> ros:")\n    for _, op := range ops {\n        fmt.Println(" ", op)\n    }\n}',
      explanation: 'DP строит таблицу снизу вверх. dp[i][j] зависит от трёх предыдущих ячеек: dp[i-1][j] — удаление из word1, dp[i][j-1] — вставка в word1, dp[i-1][j-1] — замена (или совпадение). Восстановление операций: идём от dp[m][n] к dp[0][0] в обратном порядке, выбирая операцию с наименьшей стоимостью.'
    }
  ]
}
