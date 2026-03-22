export default {
  id: 37,
  title: 'Практикум: Hard задачи (топ-15)',
  description: 'Топ-10 Hard задач LeetCode: Median of Two Sorted Arrays, Merge K Sorted Lists, Trapping Rain Water, Sliding Window Maximum и другие. Python решения с детальными объяснениями.',
  lessons: [
    {
      id: 1,
      title: 'Median of Two Sorted Arrays',
      type: 'practice',
      content: [
        { type: 'text', value: 'Задача: найдите медиану двух отсортированных массивов nums1 и nums2. Сложность должна быть O(log(m+n)).' },
        { type: 'text', value: 'Пример: nums1=[1,3], nums2=[2] → 2.0. nums1=[1,2], nums2=[3,4] → 2.5.' },
        { type: 'heading', value: 'Решение: бинарный поиск на меньшем массиве O(log(min(m,n)))' },
        { type: 'code', language: 'python', value: 'def find_median_sorted_arrays(nums1, nums2):\n    # Гарантируем nums1 — меньший массив\n    if len(nums1) > len(nums2):\n        nums1, nums2 = nums2, nums1\n\n    m, n = len(nums1), len(nums2)\n    half = (m + n) // 2\n    left, right = 0, m\n\n    while left <= right:\n        # Разбиваем nums1 в позиции i, nums2 в позиции j\n        i = (left + right) // 2\n        j = half - i\n\n        # Граничные значения\n        nums1_left = nums1[i-1] if i > 0 else float("-inf")\n        nums1_right = nums1[i] if i < m else float("inf")\n        nums2_left = nums2[j-1] if j > 0 else float("-inf")\n        nums2_right = nums2[j] if j < n else float("inf")\n\n        if nums1_left <= nums2_right and nums2_left <= nums1_right:\n            # Нашли правильное разбиение\n            if (m + n) % 2 == 1:\n                return float(min(nums1_right, nums2_right))\n            else:\n                return (max(nums1_left, nums2_left) +\n                        min(nums1_right, nums2_right)) / 2.0\n        elif nums1_left > nums2_right:\n            right = i - 1  # сдвигаем разрез в nums1 левее\n        else:\n            left = i + 1   # сдвигаем разрез в nums1 правее\n\nprint(find_median_sorted_arrays([1, 3], [2]))      # 2.0\nprint(find_median_sorted_arrays([1, 2], [3, 4]))   # 2.5' },
        { type: 'text', value: 'Объяснение: идея — найти такую точку разреза в обоих массивах, чтобы левая половина объединённого массива содержала ровно (m+n)//2 элементов. Бинарный поиск на меньшем массиве.\n\nСложность: O(log(min(m,n))) время, O(1) память.' },
        { type: 'tip', value: 'Это одна из сложнейших задач Binary Search. На интервью объясните идею словами сначала, затем кодируйте.' }
      ]
    },
    {
      id: 2,
      title: 'Merge K Sorted Lists',
      type: 'practice',
      content: [
        { type: 'text', value: 'Задача: слейте k отсортированных связных списков в один отсортированный.' },
        { type: 'text', value: 'Пример: [[1,4,5],[1,3,4],[2,6]] → [1,1,2,3,4,4,5,6].' },
        { type: 'heading', value: 'Решение: MinHeap (Priority Queue) O(n log k)' },
        { type: 'code', language: 'python', value: 'import heapq\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef merge_k_lists(lists):\n    heap = []\n    # Инициализируем кучу головами всех списков\n    for i, node in enumerate(lists):\n        if node:\n            heapq.heappush(heap, (node.val, i, node))\n\n    dummy = ListNode(0)\n    current = dummy\n\n    while heap:\n        val, i, node = heapq.heappop(heap)\n        current.next = node\n        current = current.next\n\n        if node.next:\n            heapq.heappush(heap, (node.next.val, i, node.next))\n\n    return dummy.next\n\n# Альтернатива: Divide and Conquer O(n log k)\ndef merge_k_lists_dc(lists):\n    if not lists:\n        return None\n    while len(lists) > 1:\n        merged = []\n        for i in range(0, len(lists), 2):\n            l1 = lists[i]\n            l2 = lists[i+1] if i+1 < len(lists) else None\n            merged.append(merge_two(l1, l2))\n        lists = merged\n    return lists[0]\n\ndef merge_two(l1, l2):\n    dummy = ListNode(0)\n    cur = dummy\n    while l1 and l2:\n        if l1.val <= l2.val:\n            cur.next, l1 = l1, l1.next\n        else:\n            cur.next, l2 = l2, l2.next\n        cur = cur.next\n    cur.next = l1 or l2\n    return dummy.next' },
        { type: 'text', value: 'Объяснение: MinHeap из k элементов (по одному из каждого списка). Извлекаем минимум, добавляем следующий элемент из того же списка. Индекс i нужен для разрешения коллизий при одинаковых значениях.\n\nСложность: O(n log k) время, O(k) память для кучи.' }
      ]
    },
    {
      id: 3,
      title: 'Trapping Rain Water',
      type: 'practice',
      content: [
        { type: 'text', value: 'Задача: дан массив height — высоты столбов. Посчитайте сколько воды может накопиться между столбами после дождя.' },
        { type: 'text', value: 'Пример: [0,1,0,2,1,0,1,3,2,1,2,1] → 6. [4,2,0,3,2,5] → 9.' },
        { type: 'heading', value: 'Решение: два указателя O(n) O(1)' },
        { type: 'code', language: 'python', value: 'def trap(height):\n    left, right = 0, len(height) - 1\n    left_max = right_max = 0\n    water = 0\n\n    while left < right:\n        if height[left] <= height[right]:\n            if height[left] >= left_max:\n                left_max = height[left]\n            else:\n                # Воды накапливается: left_max - текущая высота\n                water += left_max - height[left]\n            left += 1\n        else:\n            if height[right] >= right_max:\n                right_max = height[right]\n            else:\n                water += right_max - height[right]\n            right -= 1\n\n    return water\n\n# DP подход O(n) O(n):\ndef trap_dp(height):\n    n = len(height)\n    if n == 0:\n        return 0\n    left_max = [0] * n\n    right_max = [0] * n\n    left_max[0] = height[0]\n    right_max[n-1] = height[n-1]\n    for i in range(1, n):\n        left_max[i] = max(left_max[i-1], height[i])\n    for i in range(n-2, -1, -1):\n        right_max[i] = max(right_max[i+1], height[i])\n    return sum(min(left_max[i], right_max[i]) - height[i] for i in range(n))\n\nprint(trap([0,1,0,2,1,0,1,3,2,1,2,1]))  # 6\nprint(trap([4,2,0,3,2,5]))              # 9' },
        { type: 'text', value: 'Объяснение: вода в позиции i = min(max_left, max_right) - height[i]. Два указателя: если left меньше right_max, вода ограничена left_max — обрабатываем левую сторону.\n\nСложность: O(n) время, O(1) память.' },
        { type: 'note', value: 'Trapping Rain Water — классика визуализации. Нарисуйте на бумаге перед объяснением.' }
      ]
    },
    {
      id: 4,
      title: 'Minimum Window Substring',
      type: 'practice',
      content: [
        { type: 'text', value: 'Задача: найдите минимальную подстроку в s, содержащую все символы t (с учётом повторений).' },
        { type: 'text', value: 'Пример: s="ADOBECODEBANC", t="ABC" → "BANC". s="a", t="aa" → "" (невозможно).' },
        { type: 'heading', value: 'Решение: скользящее окно O(n+m)' },
        { type: 'code', language: 'python', value: 'from collections import Counter\n\ndef min_window(s, t):\n    if not t or not s:\n        return ""\n\n    need = Counter(t)    # нужные символы и их количество\n    window = {}          # текущее окно\n    have = 0             # сколько символов удовлетворены\n    required = len(need) # сколько уникальных символов нужно\n\n    left = 0\n    min_len = float("inf")\n    min_start = 0\n\n    for right, char in enumerate(s):\n        window[char] = window.get(char, 0) + 1\n\n        # Проверяем если символ полностью покрыт\n        if char in need and window[char] == need[char]:\n            have += 1\n\n        # Сужаем окно пока все символы покрыты\n        while have == required:\n            # Обновляем минимальное окно\n            if right - left + 1 < min_len:\n                min_len = right - left + 1\n                min_start = left\n\n            # Убираем левый символ\n            left_char = s[left]\n            window[left_char] -= 1\n            if left_char in need and window[left_char] < need[left_char]:\n                have -= 1\n            left += 1\n\n    return s[min_start:min_start + min_len] if min_len != float("inf") else ""\n\nprint(min_window("ADOBECODEBANC", "ABC"))  # "BANC"\nprint(min_window("a", "a"))                # "a"\nprint(min_window("a", "aa"))               # ""' },
        { type: 'text', value: 'Объяснение: расширяем правую границу. Когда все символы t покрыты — пробуем сузить левую. Отслеживаем счётчик have (сколько символов удовлетворены).\n\nСложность: O(n+m) время, O(m) память.' }
      ]
    },
    {
      id: 5,
      title: 'Serialize/Deserialize Binary Tree',
      type: 'practice',
      content: [
        { type: 'text', value: 'Задача: реализуйте сериализацию бинарного дерева в строку и десериализацию обратно. Формат — на ваш выбор.' },
        { type: 'heading', value: 'Решение: preorder с маркерами null O(n)' },
        { type: 'code', language: 'python', value: 'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Codec:\n    def serialize(self, root):\n        """Preorder обход, null -> "#", разделитель ","."""\n        result = []\n        def preorder(node):\n            if not node:\n                result.append("#")\n                return\n            result.append(str(node.val))\n            preorder(node.left)\n            preorder(node.right)\n        preorder(root)\n        return ",".join(result)\n\n    def deserialize(self, data):\n        """Восстанавливаем из preorder строки."""\n        nodes = iter(data.split(","))\n\n        def build():\n            val = next(nodes)\n            if val == "#":\n                return None\n            node = TreeNode(int(val))\n            node.left = build()\n            node.right = build()\n            return node\n\n        return build()\n\n# Тест:\ncodec = Codec()\nroot = TreeNode(1)\nroot.left = TreeNode(2)\nroot.right = TreeNode(3)\nroot.right.left = TreeNode(4)\nroot.right.right = TreeNode(5)\n\nserialized = codec.serialize(root)\nprint(serialized)  # "1,2,#,#,3,4,#,#,5,#,#"\n\nroot2 = codec.deserialize(serialized)\nprint(codec.serialize(root2))  # те же данные' },
        { type: 'text', value: 'Объяснение: preorder (корень, лево, право) с маркерами "#" для null однозначно определяет структуру дерева. При десериализации итерируем токены в том же порядке.\n\nСложность: O(n) время и память.' }
      ]
    },
    {
      id: 6,
      title: 'Sliding Window Maximum',
      type: 'practice',
      content: [
        { type: 'text', value: 'Задача: дан массив nums и размер окна k. Для каждой позиции скользящего окна найдите максимум. Верните массив максимумов.' },
        { type: 'text', value: 'Пример: nums=[1,3,-1,-3,5,3,6,7], k=3 → [3,3,5,5,6,7].' },
        { type: 'heading', value: 'Решение: Monotonic Deque O(n)' },
        { type: 'code', language: 'python', value: 'from collections import deque\n\ndef max_sliding_window(nums, k):\n    result = []\n    dq = deque()  # хранит индексы, монотонно убывает\n\n    for i, num in enumerate(nums):\n        # Удаляем элементы вышедшие из окна\n        while dq and dq[0] <= i - k:\n            dq.popleft()\n\n        # Удаляем из хвоста все меньше текущего\n        # (они никогда не будут максимумом)\n        while dq and nums[dq[-1]] < num:\n            dq.pop()\n\n        dq.append(i)\n\n        # Начинаем записывать результат после первого полного окна\n        if i >= k - 1:\n            result.append(nums[dq[0]])  # голова deque = максимум\n\n    return result\n\n# Трассировка для [1,3,-1,-3,5,3,6,7], k=3:\n# i=0: dq=[0], нет результата\n# i=1: 3>1, dq=[1], нет результата\n# i=2: dq=[1,2], результат: nums[1]=3\n# i=3: dq=[1,2,3], результат: nums[1]=3\n# i=4: 5>все, dq=[4], результат: nums[4]=5\n# i=5: dq=[4,5], результат: nums[4]=5\n# i=6: 6>3, dq=[4,6], результат: nums[6]=6\n# i=7: 7>6, dq=[7], результат: nums[7]=7\n# Итог: [3,3,5,5,6,7]\n\nprint(max_sliding_window([1,3,-1,-3,5,3,6,7], 3))  # [3,3,5,5,6,7]' },
        { type: 'text', value: 'Объяснение: deque хранит индексы в убывающем порядке значений (монотонная очередь). Голова всегда содержит индекс максимума текущего окна.\n\nСложность: O(n) время, O(k) память.' }
      ]
    },
    {
      id: 7,
      title: 'Word Search II — Trie + Backtracking',
      type: 'practice',
      content: [
        { type: 'text', value: 'Задача: дана матрица символов board и список words. Найдите все слова из списка, которые можно составить из соседних ячеек матрицы.' },
        { type: 'heading', value: 'Решение: Trie + DFS backtracking O(M * 4^L)' },
        { type: 'code', language: 'python', value: 'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.word = None  # хранит слово если это конец\n\ndef find_words(board, words):\n    # Строим Trie из словаря\n    root = TrieNode()\n    for word in words:\n        node = root\n        for char in word:\n            if char not in node.children:\n                node.children[char] = TrieNode()\n            node = node.children[char]\n        node.word = word\n\n    rows, cols = len(board), len(board[0])\n    result = set()\n\n    def dfs(r, c, node):\n        char = board[r][c]\n        if char not in node.children:\n            return\n        next_node = node.children[char]\n\n        if next_node.word:\n            result.add(next_node.word)\n            next_node.word = None  # избегаем дублей\n\n        board[r][c] = "#"  # помечаем как посещённое\n        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != "#":\n                dfs(nr, nc, next_node)\n        board[r][c] = char  # восстанавливаем\n\n        # Оптимизация: удаляем лист без слов (pruning)\n        if not next_node.children and not next_node.word:\n            del node.children[char]\n\n    for r in range(rows):\n        for c in range(cols):\n            dfs(r, c, root)\n\n    return list(result)\n\nboard = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]\nwords = ["oath","pea","eat","rain"]\nprint(find_words(board, words))  # ["eat","oath"]' },
        { type: 'text', value: 'Объяснение: Trie позволяет быстро проверить — является ли текущий путь началом какого-то слова. Pruning (обрезание пустых ветвей Trie) ускоряет поиск.\n\nСложность: O(M * 4^L) где M — ячейки матрицы, L — длина слова.' }
      ]
    },
    {
      id: 8,
      title: 'Alien Dictionary — порядок букв',
      type: 'practice',
      content: [
        { type: 'text', value: 'Задача: дан отсортированный словарь "инопланетного" языка. Определите порядок букв в алфавите. Если противоречие — верните "".' },
        { type: 'text', value: 'Пример: words=["wrt","wrf","er","ett","rftt"] → "wertf".' },
        { type: 'heading', value: 'Решение: топологическая сортировка O(C) где C — общая длина слов' },
        { type: 'code', language: 'python', value: 'from collections import defaultdict, deque\n\ndef alien_order(words):\n    # Все символы из всех слов\n    adj = defaultdict(set)\n    in_degree = {c: 0 for word in words for c in word}\n\n    # Сравниваем соседние слова\n    for i in range(len(words) - 1):\n        w1, w2 = words[i], words[i+1]\n        min_len = min(len(w1), len(w2))\n\n        # Проверяем противоречие: "abc" и "ab"\n        if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:\n            return ""\n\n        for j in range(min_len):\n            if w1[j] != w2[j]:\n                if w2[j] not in adj[w1[j]]:\n                    adj[w1[j]].add(w2[j])\n                    in_degree[w2[j]] += 1\n                break  # только первое различие\n\n    # BFS топологическая сортировка (Kahn)\n    queue = deque([c for c in in_degree if in_degree[c] == 0])\n    result = []\n\n    while queue:\n        c = queue.popleft()\n        result.append(c)\n        for neighbor in adj[c]:\n            in_degree[neighbor] -= 1\n            if in_degree[neighbor] == 0:\n                queue.append(neighbor)\n\n    return "".join(result) if len(result) == len(in_degree) else ""\n\nprint(alien_order(["wrt","wrf","er","ett","rftt"]))  # "wertf"\nprint(alien_order(["z","x"]))                        # "zx"\nprint(alien_order(["z","x","z"]))                    # "" (цикл)' },
        { type: 'text', value: 'Объяснение: сравниваем соседние слова → строим граф зависимостей букв. Топологическая сортировка даёт порядок. Цикл = противоречие.\n\nСложность: O(C) время где C — суммарная длина всех слов.' }
      ]
    },
    {
      id: 9,
      title: 'N-Queens — расстановка ферзей',
      type: 'practice',
      content: [
        { type: 'text', value: 'Задача: расставьте n ферзей на шахматной доске n×n так, чтобы они не атаковали друг друга. Верните все возможные расстановки.' },
        { type: 'heading', value: 'Решение: backtracking O(n!)' },
        { type: 'code', language: 'python', value: 'def solve_n_queens(n):\n    result = []\n    # Используем множества для O(1) проверки атаки\n    cols = set()\n    diag1 = set()  # (row - col): левая диагональ\n    diag2 = set()  # (row + col): правая диагональ\n\n    board = [[\"."] * n for _ in range(n)]\n\n    def backtrack(row):\n        if row == n:\n            result.append(["".join(r) for r in board])\n            return\n\n        for col in range(n):\n            if col in cols or (row-col) in diag1 or (row+col) in diag2:\n                continue  # атакован\n\n            # Ставим ферзя\n            board[row][col] = "Q"\n            cols.add(col)\n            diag1.add(row - col)\n            diag2.add(row + col)\n\n            backtrack(row + 1)\n\n            # Убираем ферзя\n            board[row][col] = "."\n            cols.remove(col)\n            diag1.remove(row - col)\n            diag2.remove(row + col)\n\n    backtrack(0)\n    return result\n\nsolutions = solve_n_queens(4)\nprint(f"Решений для n=4: {len(solutions)}")  # 2\nfor sol in solutions:\n    for row in sol:\n        print(row)\n    print()' },
        { type: 'text', value: 'Объяснение: размещаем ферзей по одному в каждой строке. Три множества для мгновенной проверки конфликтов по столбцу и двум диагоналям. Backtrack при конфликте.\n\nСложность: O(n!) время, O(n²) память.' }
      ]
    },
    {
      id: 10,
      title: 'Edit Distance — расстояние редактирования',
      type: 'practice',
      content: [
        { type: 'text', value: 'Задача: найдите минимальное количество операций (вставка, удаление, замена) для преобразования строки word1 в word2.' },
        { type: 'text', value: 'Примеры: "horse" → "ros" = 3 операции. "intention" → "execution" = 5 операций.' },
        { type: 'heading', value: 'Решение: динамическое программирование O(mn)' },
        { type: 'code', language: 'python', value: 'def min_distance(word1, word2):\n    m, n = len(word1), len(word2)\n\n    # dp[i][j] = расстояние между word1[:i] и word2[:j]\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n\n    # Базовые случаи\n    for i in range(m + 1):\n        dp[i][0] = i  # удалить i символов\n    for j in range(n + 1):\n        dp[0][j] = j  # вставить j символов\n\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if word1[i-1] == word2[j-1]:\n                dp[i][j] = dp[i-1][j-1]  # символы совпали\n            else:\n                dp[i][j] = 1 + min(\n                    dp[i-1][j],   # удаление из word1\n                    dp[i][j-1],   # вставка в word1\n                    dp[i-1][j-1]  # замена\n                )\n\n    return dp[m][n]\n\n# Оптимизация памяти до O(n):\ndef min_distance_opt(word1, word2):\n    m, n = len(word1), len(word2)\n    prev = list(range(n + 1))\n    for i in range(1, m + 1):\n        curr = [i] + [0] * n\n        for j in range(1, n + 1):\n            if word1[i-1] == word2[j-1]:\n                curr[j] = prev[j-1]\n            else:\n                curr[j] = 1 + min(prev[j], curr[j-1], prev[j-1])\n        prev = curr\n    return prev[n]\n\nprint(min_distance("horse", "ros"))        # 3\nprint(min_distance("intention", "execution"))  # 5\nprint(min_distance("", "abc"))             # 3' },
        { type: 'text', value: 'Объяснение: dp[i][j] — расстояние между префиксами. Переход: если символы совпадают — берём dp[i-1][j-1]; иначе минимум из трёх операций.\n\nСложность: O(mn) время, O(mn) память (оптимизированно до O(n)).' },
        { type: 'note', value: 'Edit Distance (расстояние Левенштейна) используется в spell checkers, биоинформатике (сравнение ДНК), diff утилитах.' }
      ]
    }
  ]
}
