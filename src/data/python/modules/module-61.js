export default {
  id: 61,
  title: 'Практикум: Задачи Medium',
  description: 'Задачи среднего уровня: динамическое программирование, графы, деревья, продвинутые алгоритмы',
  lessons: [
    {
      id: 1,
      title: 'Динамическое программирование: основы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реши задачи через DP с мемоизацией.',
      requirements: [
        'coin_change(coins, amount) — минимальное количество монет',
        'longest_common_subsequence(s1, s2)',
        'knapsack(weights, values, capacity) — задача о рюкзаке',
        'climb_stairs(n) — способов подняться на n ступеней (шаг 1 или 2)',
        'max_subarray(lst) — подмассив с максимальной суммой (Кадане)'
      ],
      expectedOutput: 'coin_change([1,5,10,25], 36) -> 3 (25+10+1)\nlcs("ABCBDAB","BDCAB") -> 4 ("BCAB")\nknapsack([2,3,4],[3,4,5],5) -> 7\nclimb_stairs(5) -> 8\nmax_subarray([-2,1,-3,4,-1,2,1,-5,4]) -> 6',
      hint: 'coin_change: dp[i] = min(dp[i], dp[i-coin]+1). lcs: dp[i][j] = dp[i-1][j-1]+1 если s1[i]==s2[j]. Кадане: track running_max и max_ending_here.',
      solution: 'def coin_change(coins, amount):\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for coin in coins:\n            if coin <= i:\n                dp[i] = min(dp[i], dp[i - coin] + 1)\n    return dp[amount] if dp[amount] != float("inf") else -1\n\ndef lcs(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]\n\ndef knapsack(weights, values, capacity):\n    n = len(weights)\n    dp = [[0] * (capacity + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        for w in range(capacity + 1):\n            dp[i][w] = dp[i-1][w]\n            if weights[i-1] <= w:\n                dp[i][w] = max(dp[i][w], dp[i-1][w-weights[i-1]] + values[i-1])\n    return dp[n][capacity]\n\ndef climb_stairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(n - 2):\n        a, b = b, a + b\n    return b\n\ndef max_subarray(lst):\n    max_sum = current = lst[0]\n    for num in lst[1:]:\n        current = max(num, current + num)\n        max_sum = max(max_sum, current)\n    return max_sum\n\nprint(coin_change([1, 5, 10, 25], 36))\nprint(lcs("ABCBDAB", "BDCAB"))\nprint(knapsack([2, 3, 4], [3, 4, 5], 5))\nprint(climb_stairs(5))\nprint(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))',
      explanation: 'DP через таблицу dp[i] — избегает повторного вычисления. coin_change: dp[0]=0, остальные inf. lcs: если символы равны — +1, иначе max из верхнего/левого. Кадане O(n): current — лучшая сумма заканчивающаяся в текущем элементе.'
    },
    {
      id: 2,
      title: 'Деревья: бинарное дерево поиска',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй BST и операции с деревьями.',
      requirements: [
        'Класс BST: insert, search, delete',
        'inorder() — обход в порядке возрастания',
        'height() — высота дерева',
        'is_balanced() — сбалансировано ли',
        'level_order() — обход по уровням (BFS)'
      ],
      expectedOutput: 'BST вставить [5,3,7,1,4,6,8]\ninorder() -> [1,3,4,5,6,7,8]\nheight() -> 3\nlevel_order() -> [[5],[3,7],[1,4,6,8]]',
      hint: 'Класс Node(val, left, right). insert рекурсивно. inorder: левое -> текущее -> правое. level_order: BFS с deque.',
      solution: 'from collections import deque\n\nclass Node:\n    def __init__(self, val):\n        self.val = val\n        self.left = self.right = None\n\nclass BST:\n    def __init__(self):\n        self.root = None\n\n    def insert(self, val):\n        def _insert(node, val):\n            if node is None:\n                return Node(val)\n            if val < node.val:\n                node.left = _insert(node.left, val)\n            elif val > node.val:\n                node.right = _insert(node.right, val)\n            return node\n        self.root = _insert(self.root, val)\n\n    def search(self, val):\n        def _search(node, val):\n            if node is None or node.val == val:\n                return node\n            if val < node.val:\n                return _search(node.left, val)\n            return _search(node.right, val)\n        return _search(self.root, val) is not None\n\n    def inorder(self):\n        result = []\n        def _inorder(node):\n            if node:\n                _inorder(node.left)\n                result.append(node.val)\n                _inorder(node.right)\n        _inorder(self.root)\n        return result\n\n    def height(self):\n        def _height(node):\n            if node is None: return 0\n            return 1 + max(_height(node.left), _height(node.right))\n        return _height(self.root)\n\n    def is_balanced(self):\n        def _check(node):\n            if node is None: return 0\n            left = _check(node.left)\n            right = _check(node.right)\n            if left == -1 or right == -1 or abs(left - right) > 1:\n                return -1\n            return 1 + max(left, right)\n        return _check(self.root) != -1\n\n    def level_order(self):\n        if not self.root: return []\n        result, queue = [], deque([self.root])\n        while queue:\n            level = []\n            for _ in range(len(queue)):\n                node = queue.popleft()\n                level.append(node.val)\n                if node.left: queue.append(node.left)\n                if node.right: queue.append(node.right)\n            result.append(level)\n        return result\n\nbst = BST()\nfor v in [5, 3, 7, 1, 4, 6, 8]:\n    bst.insert(v)\nprint("inorder:", bst.inorder())\nprint("height:", bst.height())\nprint("balanced:", bst.is_balanced())\nprint("level_order:", bst.level_order())',
      explanation: 'is_balanced возвращает -1 при нарушении баланса — элегантная передача ошибки через возвращаемое значение. level_order через deque обрабатывает все узлы уровня за один проход. BST inorder всегда даёт отсортированную последовательность.'
    },
    {
      id: 3,
      title: 'Графы: BFS и DFS',
      type: 'practice',
      difficulty: 'medium',
      description: 'Обходы графов и базовые алгоритмы.',
      requirements: [
        'BFS(graph, start) — обход в ширину',
        'DFS(graph, start) — обход в глубину',
        'has_cycle(graph) — есть ли цикл в ориентированном графе',
        'topological_sort(graph) — топологическая сортировка',
        'shortest_path(graph, start, end) — кратчайший путь (BFS)'
      ],
      expectedOutput: 'graph = {A:[B,C], B:[D], C:[D], D:[]}\nBFS(A) -> [A,B,C,D]\nDFS(A) -> [A,B,D,C]\nhas_cycle({A:[B],B:[C],C:[A]}) -> True\ntopological_sort -> [A,B,C,D] или другой валидный',
      hint: 'BFS: deque, visited set. DFS: рекурсия с visited. has_cycle: 3 цвета: white(0)/gray(1)/black(2). topological_sort: DFS, добавляй в начало после обработки всех потомков.',
      solution: 'from collections import deque\n\ndef bfs(graph, start):\n    visited = set()\n    queue = deque([start])\n    result = []\n    while queue:\n        node = queue.popleft()\n        if node not in visited:\n            visited.add(node)\n            result.append(node)\n            for neighbor in graph.get(node, []):\n                if neighbor not in visited:\n                    queue.append(neighbor)\n    return result\n\ndef dfs(graph, start):\n    visited = set()\n    result = []\n    def _dfs(node):\n        if node in visited: return\n        visited.add(node)\n        result.append(node)\n        for neighbor in graph.get(node, []):\n            _dfs(neighbor)\n    _dfs(start)\n    return result\n\ndef has_cycle(graph):\n    WHITE, GRAY, BLACK = 0, 1, 2\n    color = {node: WHITE for node in graph}\n    def dfs_cycle(node):\n        color[node] = GRAY\n        for neighbor in graph.get(node, []):\n            if color[neighbor] == GRAY: return True\n            if color[neighbor] == WHITE and dfs_cycle(neighbor): return True\n        color[node] = BLACK\n        return False\n    return any(dfs_cycle(node) for node in graph if color[node] == WHITE)\n\ndef topological_sort(graph):\n    visited = set()\n    result = []\n    def dfs_topo(node):\n        if node in visited: return\n        visited.add(node)\n        for neighbor in graph.get(node, []):\n            dfs_topo(neighbor)\n        result.append(node)\n    for node in graph:\n        dfs_topo(node)\n    return result[::-1]\n\ndef shortest_path(graph, start, end):\n    queue = deque([(start, [start])])\n    visited = {start}\n    while queue:\n        node, path = queue.popleft()\n        if node == end: return path\n        for neighbor in graph.get(node, []):\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append((neighbor, path + [neighbor]))\n    return None\n\ng = {"A": ["B","C"], "B": ["D"], "C": ["D"], "D": []}\nprint("BFS:", bfs(g, "A"))\nprint("DFS:", dfs(g, "A"))\nprint("has_cycle:", has_cycle(g))\ncyclic = {"A": ["B"], "B": ["C"], "C": ["A"]}\nprint("cycle:", has_cycle(cyclic))\nprint("topo:", topological_sort(g))\nprint("path A->D:", shortest_path(g, "A", "D"))',
      explanation: 'has_cycle через 3 цвета: GRAY значит "в процессе обхода" — если встретили GRAY, есть цикл. Топологическая сортировка: добавляем узел в result после обработки всех потомков, затем разворачиваем. BFS для кратчайшего пути: первое найденное — гарантированно кратчайшее.'
    },
    {
      id: 4,
      title: 'Sliding Window и Two Pointers',
      type: 'practice',
      difficulty: 'medium',
      description: 'Техники оптимизации: скользящее окно и два указателя.',
      requirements: [
        'max_sum_subarray(lst, k) — максимальная сумма подмассива длиной k',
        'min_window_substring(s, t) — минимальное окно содержащее все символы t',
        'two_sum_sorted(lst, target) — два числа в отсортированном массиве',
        'container_with_water(heights) — максимальный объём воды',
        'longest_subarray_at_most_k(lst, k) — longest subarray with sum <= k'
      ],
      expectedOutput: 'max_sum_subarray([2,3,4,1,5], 3) -> 10 (3+4+1... нет, 2+3+4=9 -> нет, 3+4+1... ждём 4+1+5=10)\ntwo_sum_sorted([2,7,11,15], 9) -> [0,1]\ncontainer_with_water([1,8,6,2,5,4,8,3,7]) -> 49',
      hint: 'max_sum_subarray: сначала посчитай первое окно, затем двигай (+lst[i] - lst[i-k]). two_sum_sorted: l=0, r=n-1, если sum>target -- r--, else l++. container: min(height[l], height[r]) * (r-l).',
      solution: 'from collections import Counter\n\ndef max_sum_subarray(lst, k):\n    if len(lst) < k: return None\n    window_sum = sum(lst[:k])\n    max_sum = window_sum\n    for i in range(k, len(lst)):\n        window_sum += lst[i] - lst[i - k]\n        max_sum = max(max_sum, window_sum)\n    return max_sum\n\ndef min_window_substring(s, t):\n    need = Counter(t)\n    missing = len(t)\n    start = best_start = best_end = 0\n    for end, char in enumerate(s, 1):\n        if need[char] > 0:\n            missing -= 1\n        need[char] -= 1\n        if missing == 0:\n            while need[s[start]] < 0:\n                need[s[start]] += 1\n                start += 1\n            if best_end == 0 or end - start < best_end - best_start:\n                best_start, best_end = start, end\n            need[s[start]] += 1\n            missing += 1\n            start += 1\n    return s[best_start:best_end]\n\ndef two_sum_sorted(lst, target):\n    l, r = 0, len(lst) - 1\n    while l < r:\n        s = lst[l] + lst[r]\n        if s == target: return [l, r]\n        elif s < target: l += 1\n        else: r -= 1\n    return []\n\ndef container_with_water(heights):\n    l, r = 0, len(heights) - 1\n    max_water = 0\n    while l < r:\n        water = min(heights[l], heights[r]) * (r - l)\n        max_water = max(max_water, water)\n        if heights[l] < heights[r]: l += 1\n        else: r -= 1\n    return max_water\n\nprint(max_sum_subarray([2, 3, 4, 1, 5], 3))\nprint(min_window_substring("ADOBECODEBANC", "ABC"))\nprint(two_sum_sorted([2, 7, 11, 15], 9))\nprint(container_with_water([1, 8, 6, 2, 5, 4, 8, 3, 7]))',
      explanation: 'Sliding window O(n) vs брутфорс O(n*k). min_window_substring: расширяем правый указатель пока не найдём все символы, сжимаем левый — классический sliding window с двумя указателями. container_with_water: двигаем меньший указатель (большее не улучшит результат).'
    },
    {
      id: 5,
      title: 'Структуры данных: heap и priority queue',
      type: 'practice',
      difficulty: 'medium',
      description: 'Задачи с кучей (heap) и приоритетной очередью.',
      requirements: [
        'k_largest_elements(lst, k) — k наибольших через heap',
        'merge_k_sorted(lists) — слить k отсортированных списков',
        'find_median_stream() — медиана потока чисел',
        'task_scheduler(tasks, n) — минимальное время с паузами',
        'top_k_frequent(lst, k) — k самых частых элементов'
      ],
      expectedOutput: 'k_largest([3,2,1,5,6,4], 2) -> [6, 5]\nmerge_k_sorted([[1,4,5],[1,3,4],[2,6]]) -> [1,1,2,3,4,4,5,6]\ntop_k_frequent([1,1,1,2,2,3], 2) -> [1, 2]',
      hint: 'import heapq. heapq.nlargest(k, lst). merge_k_sorted: min-heap с (value, list_idx, element_idx). find_median: два heap — max-heap для левой половины, min-heap для правой.',
      solution: 'import heapq\nfrom collections import Counter\n\ndef k_largest_elements(lst, k):\n    return heapq.nlargest(k, lst)\n\ndef merge_k_sorted(lists):\n    heap = []\n    for i, lst in enumerate(lists):\n        if lst:\n            heapq.heappush(heap, (lst[0], i, 0))\n    result = []\n    while heap:\n        val, i, j = heapq.heappop(heap)\n        result.append(val)\n        if j + 1 < len(lists[i]):\n            heapq.heappush(heap, (lists[i][j+1], i, j+1))\n    return result\n\nclass MedianFinder:\n    def __init__(self):\n        self.lo = []  # max-heap (инвертированный)\n        self.hi = []  # min-heap\n\n    def add(self, num):\n        heapq.heappush(self.lo, -num)\n        heapq.heappush(self.hi, -heapq.heappop(self.lo))\n        if len(self.lo) < len(self.hi):\n            heapq.heappush(self.lo, -heapq.heappop(self.hi))\n\n    def median(self):\n        if len(self.lo) > len(self.hi):\n            return -self.lo[0]\n        return (-self.lo[0] + self.hi[0]) / 2\n\ndef top_k_frequent(lst, k):\n    counts = Counter(lst)\n    return [item for item, _ in counts.most_common(k)]\n\ndef task_scheduler(tasks, n):\n    counts = Counter(tasks)\n    max_count = max(counts.values())\n    max_count_tasks = sum(1 for c in counts.values() if c == max_count)\n    return max(len(tasks), (max_count - 1) * (n + 1) + max_count_tasks)\n\nprint(k_largest_elements([3, 2, 1, 5, 6, 4], 2))\nprint(merge_k_sorted([[1,4,5],[1,3,4],[2,6]]))\nmf = MedianFinder()\nfor num in [5, 3, 8, 1, 9]:\n    mf.add(num)\n    print(f"После добавления {num}: медиана={mf.median()}")\nprint(top_k_frequent([1,1,1,2,2,3], 2))\nprint(task_scheduler(["A","A","A","B","B","B"], 2))',
      explanation: 'Python heapq — только min-heap. Для max-heap инвертируй значения (отрицательные). MedianFinder: lo хранит нижнюю половину (max-heap), hi — верхнюю (min-heap). Балансировка: |lo| - |hi| <= 1. merge_k_sorted через heap O(N log k).'
    },
    {
      id: 6,
      title: 'Задачи на матрицы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Алгоритмические задачи на двумерные массивы.',
      requirements: [
        'search_2d_matrix(matrix, target) — поиск в отсортированной 2D матрице',
        'flood_fill(matrix, sr, sc, new_color) — заливка',
        'count_islands(grid) — подсчёт островов (1=суша, 0=вода)',
        'rotate_image_90(matrix) — поворот матрицы на месте',
        'diagonal_traverse(matrix) — диагональный обход'
      ],
      expectedOutput: 'search_2d([[1,3,5],[7,9,11],[13,15,17]], 9) -> (1,1)\ncount_islands([[1,1,0],[0,1,0],[1,0,1]]) -> 3\nflood_fill([[1,1,1],[1,1,0],[1,0,1]], 1,1, 2) -> [[2,2,2],[2,2,0],[2,0,1]]',
      hint: 'search_2d: начни с правого верхнего угла. count_islands: DFS/BFS, при посещении помечай 0. rotate_90: transpose + reverse каждой строки.',
      solution: 'def search_2d_matrix(matrix, target):\n    if not matrix: return None\n    rows, cols = len(matrix), len(matrix[0])\n    r, c = 0, cols - 1\n    while r < rows and c >= 0:\n        if matrix[r][c] == target: return (r, c)\n        elif matrix[r][c] > target: c -= 1\n        else: r += 1\n    return None\n\ndef flood_fill(matrix, sr, sc, new_color):\n    grid = [row[:] for row in matrix]\n    orig = grid[sr][sc]\n    if orig == new_color: return grid\n    def fill(r, c):\n        if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]):\n            return\n        if grid[r][c] != orig: return\n        grid[r][c] = new_color\n        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:\n            fill(r+dr, c+dc)\n    fill(sr, sc)\n    return grid\n\ndef count_islands(grid):\n    if not grid: return 0\n    grid = [row[:] for row in grid]\n    count = 0\n    def sink(r, c):\n        if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]): return\n        if grid[r][c] != "1": return\n        grid[r][c] = "0"\n        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:\n            sink(r+dr, c+dc)\n    for r in range(len(grid)):\n        for c in range(len(grid[0])):\n            if grid[r][c] == "1":\n                count += 1\n                sink(r, c)\n    return count\n\ndef rotate_image_90(matrix):\n    n = len(matrix)\n    for i in range(n):\n        for j in range(i+1, n):\n            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n    for row in matrix:\n        row.reverse()\n\nm = [[1,3,5],[7,9,11],[13,15,17]]\nprint(search_2d_matrix(m, 9))\ngrid = [[1,1,0],[0,1,0],[1,0,1]]\nprint(count_islands([["1","1","0"],["0","1","0"],["1","0","1"]]))\npm = [[1,1,1],[1,1,0],[1,0,1]]\nprint(flood_fill(pm, 1, 1, 2))\ntest = [[1,2,3],[4,5,6],[7,8,9]]\nrotate_image_90(test)\nprint(test)',
      explanation: 'search_2d от правого верхнего: если больше — идём влево, если меньше — вниз. O(m+n). count_islands через DFS "топит" острова — помечает посещённые клетки. rotate_90: transpose (зеркало по диагонали) + reverse строк = поворот на 90°.'
    },
    {
      id: 7,
      title: 'Бэктрекинг',
      type: 'practice',
      difficulty: 'medium',
      description: 'Задачи с перебором и возвратом (backtracking).',
      requirements: [
        'permutations(lst) — все перестановки',
        'combinations(lst, k) — все комбинации размера k',
        'solve_sudoku(board) — решить судоку',
        'n_queens(n) — расставить N ферзей',
        'word_search(board, word) — поиск слова в матрице букв'
      ],
      expectedOutput: 'permutations([1,2,3]) -> [[1,2,3],[1,3,2],...] (6 штук)\ncombinations([1,2,3,4], 2) -> [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]\nn_queens(4) -> 2 решения',
      hint: 'backtrack(path, remaining): if не remaining -> add to result. permutations: swap и рекурсия. n_queens: проверяй столбцы, диагонали.',
      solution: 'def permutations(lst):\n    result = []\n    def backtrack(current, remaining):\n        if not remaining:\n            result.append(current[:])\n            return\n        for i, item in enumerate(remaining):\n            current.append(item)\n            backtrack(current, remaining[:i] + remaining[i+1:])\n            current.pop()\n    backtrack([], lst)\n    return result\n\ndef combinations(lst, k):\n    result = []\n    def backtrack(start, current):\n        if len(current) == k:\n            result.append(current[:])\n            return\n        for i in range(start, len(lst)):\n            current.append(lst[i])\n            backtrack(i + 1, current)\n            current.pop()\n    backtrack(0, [])\n    return result\n\ndef n_queens(n):\n    solutions = []\n    cols, diag1, diag2 = set(), set(), set()\n    board = [["." for _ in range(n)] for _ in range(n)]\n    def backtrack(row):\n        if row == n:\n            solutions.append(["".join(r) for r in board])\n            return\n        for col in range(n):\n            if col in cols or (row-col) in diag1 or (row+col) in diag2:\n                continue\n            cols.add(col); diag1.add(row-col); diag2.add(row+col)\n            board[row][col] = "Q"\n            backtrack(row + 1)\n            board[row][col] = "."\n            cols.discard(col); diag1.discard(row-col); diag2.discard(row+col)\n    backtrack(0)\n    return len(solutions)\n\ndef word_search(board, word):\n    rows, cols = len(board), len(board[0])\n    def dfs(r, c, idx):\n        if idx == len(word): return True\n        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[idx]:\n            return False\n        tmp, board[r][c] = board[r][c], "#"\n        found = any(dfs(r+dr, c+dc, idx+1) for dr,dc in [(0,1),(0,-1),(1,0),(-1,0)])\n        board[r][c] = tmp\n        return found\n    return any(dfs(r, c, 0) for r in range(rows) for c in range(cols))\n\nprint(permutations([1,2,3]))\nprint(combinations([1,2,3,4], 2))\nprint(f"N-ферзей для N=4: {n_queens(4)} решения")\nb = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\nprint(word_search(b, "ABCCED"))',
      explanation: 'Бэктрекинг: ветвление + возврат. N-ферзей: 3 множества для проверки атак O(1). word_search: временная замена символа "#" предотвращает повторное посещение. combinations начинает с i+1 чтобы избежать повторов.'
    },
    {
      id: 8,
      title: 'Жадные алгоритмы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Задачи решаемые жадным подходом.',
      requirements: [
        'activity_selection(starts, ends) — максимум несовместимых активностей',
        'fractional_knapsack(weights, values, capacity) — дробный рюкзак',
        'jump_game(lst) — можно ли достичь последнего элемента (каждый = макс прыжок)',
        'gas_station(gas, cost) — стартовая позиция для полного круга',
        'minimum_platforms(arrivals, departures) — минимум платформ на вокзале'
      ],
      expectedOutput: 'activity_selection([1,3,0,5],[2,4,6,7]) -> 3 (макс активностей)\njump_game([2,3,1,1,4]) -> True\njump_game([3,2,1,0,4]) -> False\ngas_station([1,2,3,4,5],[3,4,5,1,2]) -> 3',
      hint: 'activity_selection: сортируй по времени окончания. fractional_knapsack: ratio=value/weight, сортируй убыванию. jump_game: отслеживай max_reach. gas_station: если sum(gas) >= sum(cost) — решение есть.',
      solution: 'def activity_selection(starts, ends):\n    activities = sorted(zip(starts, ends), key=lambda x: x[1])\n    count, last_end = 1, activities[0][1]\n    for start, end in activities[1:]:\n        if start >= last_end:\n            count += 1\n            last_end = end\n    return count\n\ndef fractional_knapsack(weights, values, capacity):\n    items = sorted(zip(weights, values), key=lambda x: x[1]/x[0], reverse=True)\n    total = 0\n    for w, v in items:\n        if capacity <= 0: break\n        take = min(w, capacity)\n        total += take * (v / w)\n        capacity -= take\n    return round(total, 2)\n\ndef jump_game(lst):\n    max_reach = 0\n    for i, jump in enumerate(lst):\n        if i > max_reach: return False\n        max_reach = max(max_reach, i + jump)\n    return True\n\ndef gas_station(gas, cost):\n    total = current = start = 0\n    for i in range(len(gas)):\n        diff = gas[i] - cost[i]\n        total += diff\n        current += diff\n        if current < 0:\n            start = i + 1\n            current = 0\n    return start if total >= 0 else -1\n\ndef minimum_platforms(arrivals, departures):\n    arrivals_s = sorted(arrivals)\n    departures_s = sorted(departures)\n    platforms = max_platforms = 0\n    i = j = 0\n    while i < len(arrivals_s):\n        if arrivals_s[i] <= departures_s[j]:\n            platforms += 1\n            max_platforms = max(max_platforms, platforms)\n            i += 1\n        else:\n            platforms -= 1\n            j += 1\n    return max_platforms\n\nprint(activity_selection([1,3,0,5,8,5],[2,4,6,7,9,9]))\nprint(fractional_knapsack([10,20,30],[60,100,120],50))\nprint(jump_game([2,3,1,1,4]))\nprint(jump_game([3,2,1,0,4]))\nprint(gas_station([1,2,3,4,5],[3,4,5,1,2]))\nprint(minimum_platforms([9,15,13,11],[20,16,14,12]))',
      explanation: 'Жадный подход: всегда делай локально оптимальный выбор. activity_selection: выбор с ранним завершением максимизирует количество. gas_station: если суммарный баланс >= 0, стартовая позиция — после последнего отрицательного участка.'
    },
    {
      id: 9,
      title: 'Битовые операции',
      type: 'practice',
      difficulty: 'medium',
      description: 'Задачи с использованием битовых операций.',
      requirements: [
        'count_bits(n) — количество единичных бит (popcount)',
        'single_number(lst) — найти единственное неповторяющееся число (XOR)',
        'missing_number(lst) — найти пропущенное число через XOR',
        'reverse_bits(n) — перевернуть биты 32-битного числа',
        'generate_subsets_bitmask(lst) — подмножества через битовую маску'
      ],
      expectedOutput: 'count_bits(7) -> 3 (111)\nsingle_number([4,1,2,1,2]) -> 4\nmissing_number([3,0,1]) -> 2\nreverse_bits(43261596) -> 964176192\ngenerate_subsets([1,2,3]) -> [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]',
      hint: 'count_bits: bin(n).count("1") или через сдвиги. single_number: XOR всех элементов (a^a=0, a^0=a). missing: XOR от 0..n с XOR всех элементов. subsets через 2^n масок.',
      solution: 'def count_bits(n):\n    count = 0\n    while n:\n        count += n & 1\n        n >>= 1\n    return count\n\ndef single_number(lst):\n    result = 0\n    for num in lst:\n        result ^= num\n    return result\n\ndef missing_number(lst):\n    n = len(lst)\n    result = n\n    for i, num in enumerate(lst):\n        result ^= i ^ num\n    return result\n\ndef reverse_bits(n):\n    result = 0\n    for _ in range(32):\n        result = (result << 1) | (n & 1)\n        n >>= 1\n    return result\n\ndef generate_subsets_bitmask(lst):\n    n = len(lst)\n    subsets = []\n    for mask in range(1 << n):\n        subset = [lst[i] for i in range(n) if mask & (1 << i)]\n        subsets.append(subset)\n    return subsets\n\nprint(count_bits(7), count_bits(255), count_bits(0))\nprint(single_number([4, 1, 2, 1, 2]))\nprint(missing_number([3, 0, 1]))\nprint(reverse_bits(43261596))\nprint(generate_subsets_bitmask([1, 2, 3]))',
      explanation: 'XOR свойства: a^a=0, a^0=a, коммутативность — идеальны для поиска уникального. Маска 1<<n для n-го элемента. 2^n масок покрывают все подмножества из n элементов. n & 1 извлекает последний бит, n >>= 1 — сдвигает.'
    },
    {
      id: 10,
      title: 'Задачи на строки Medium',
      type: 'practice',
      difficulty: 'medium',
      description: 'Строковые алгоритмы среднего уровня.',
      requirements: [
        'longest_palindromic_substring(s) — наидлиннейший палиндром',
        'word_break(s, word_dict) — можно ли разбить строку на слова из словаря',
        'decode_ways("226") — количество способов декодировать (1=A, ..., 26=Z)',
        'string_compression("aabcccdddd") -> "a2bc3d4"',
        'edit_distance(s1, s2) — расстояние Левенштейна'
      ],
      expectedOutput: 'longest_palindromic_substring("babad") -> "bab"\nword_break("leetcode", ["leet","code"]) -> True\ndecode_ways("226") -> 3\nstring_compression("aabcccdddd") -> "a2bc3d4"\nedit_distance("kitten","sitting") -> 3',
      hint: 'longest_palindrome: expand around center для каждой позиции. word_break: DP dp[i]=True если есть j<i где dp[j] и s[j:i] in dict. edit_distance: dp[i][j] = 1+min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).',
      solution: 'def longest_palindromic_substring(s):\n    start = length = 0\n    def expand(l, r):\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            l -= 1; r += 1\n        return l + 1, r - 1\n    for i in range(len(s)):\n        for l, r in [expand(i, i), expand(i, i+1)]:\n            if r - l + 1 > length:\n                start, length = l, r - l + 1\n    return s[start:start+length]\n\ndef word_break(s, word_dict):\n    word_set = set(word_dict)\n    dp = [False] * (len(s) + 1)\n    dp[0] = True\n    for i in range(1, len(s) + 1):\n        for j in range(i):\n            if dp[j] and s[j:i] in word_set:\n                dp[i] = True\n                break\n    return dp[len(s)]\n\ndef decode_ways(s):\n    if not s or s[0] == "0": return 0\n    dp = [0] * (len(s) + 1)\n    dp[0] = dp[1] = 1\n    for i in range(2, len(s) + 1):\n        if s[i-1] != "0":\n            dp[i] += dp[i-1]\n        two_digit = int(s[i-2:i])\n        if 10 <= two_digit <= 26:\n            dp[i] += dp[i-2]\n    return dp[len(s)]\n\ndef string_compression(s):\n    from itertools import groupby\n    return "".join(k + (str(sum(1 for _ in g)) if sum(1 for _ in list(g)) > 1\n                        else "") for k, g in groupby(s))\n\ndef edit_distance(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = list(range(n + 1))\n    for i in range(1, m + 1):\n        prev, dp[0] = dp[0], i\n        for j in range(1, n + 1):\n            temp = dp[j]\n            if s1[i-1] == s2[j-1]:\n                dp[j] = prev\n            else:\n                dp[j] = 1 + min(prev, dp[j], dp[j-1])\n            prev = temp\n    return dp[n]\n\nprint(longest_palindromic_substring("babad"))\nprint(word_break("leetcode", ["leet","code"]))\nprint(decode_ways("226"))\nprint(string_compression("aabcccdddd"))\nprint(edit_distance("kitten","sitting"))',
      explanation: 'expand around center O(n^2) для palindrome — проще чем Манакер O(n) но понятнее. edit_distance с оптимизацией памяти O(n): хранится только одна строка dp. word_break через DP: dp[i] = можно ли составить s[:i] из слов словаря.'
    }
  ]
}
