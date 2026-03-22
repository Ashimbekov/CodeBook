export default {
  id: 62,
  title: 'Практикум: Задачи Hard',
  description: 'Сложные алгоритмические задачи: продвинутые DP, сложные структуры данных, оптимальные алгоритмы',
  lessons: [
    {
      id: 1,
      title: 'LRU Cache',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй LRU Cache с O(1) операциями get и put.',
      requirements: [
        'LRUCache(capacity): get(key) -> value или -1, put(key, value)',
        'При превышении capacity — удалить наименее недавно использованный',
        'O(1) для get и put',
        'Используй OrderedDict или двусвязный список + хеш-таблицу',
        'Тест: capacity=2, put(1,1), put(2,2), get(1)=1, put(3,3), get(2)=-1'
      ],
      expectedOutput: 'lru = LRUCache(2)\nlru.put(1, 1); lru.put(2, 2)\nlru.get(1) -> 1\nlru.put(3, 3)  # вытесняет 2\nlru.get(2) -> -1\nlru.get(3) -> 3',
      hint: 'OrderedDict.move_to_end(key) перемещает в конец. При put: если key есть — обнови и move_to_end. Если capacity исчерпан — popitem(last=False) удалит LRU (первый).',
      solution: 'from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.cache = OrderedDict()\n\n    def get(self, key):\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key, value):\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            self.cache.popitem(last=False)\n\nlru = LRUCache(2)\nlru.put(1, 1)\nlru.put(2, 2)\nprint(lru.get(1))\nlru.put(3, 3)\nprint(lru.get(2))\nprint(lru.get(3))',
      explanation: 'OrderedDict запоминает порядок вставки. move_to_end делает ключ "самым недавним". popitem(last=False) удаляет самый старый (LRU). Это O(1) для всех операций.'
    },
    {
      id: 2,
      title: 'Интервальные задачи',
      type: 'practice',
      difficulty: 'hard',
      description: 'Сложные задачи на работу с интервалами.',
      requirements: [
        'insert_interval(intervals, new) — вставить интервал и слить перекрывающиеся',
        'employee_free_time(schedules) — найти общее свободное время',
        'min_meeting_rooms(intervals) — минимум переговорных',
        'calendar_booking(slots) — максимум одновременных записей',
        'range_queries(arr, queries) — сумма диапазонов через prefix sum'
      ],
      expectedOutput: 'insert_interval([[1,3],[6,9]], [2,5]) -> [[1,5],[6,9]]\nmin_meeting_rooms([[0,30],[5,10],[15,20]]) -> 2\nrange_queries([3,1,4,1,5], [(0,2),(1,3),(2,4)]) -> [8,6,10]',
      hint: 'insert_interval: три части — до нового, перекрывающиеся (слить), после. min_meeting_rooms: события начала/конца, сортируй, считай текущие.',
      solution: 'import heapq\n\ndef insert_interval(intervals, new_interval):\n    result = []\n    i = 0\n    n = len(intervals)\n    while i < n and intervals[i][1] < new_interval[0]:\n        result.append(intervals[i])\n        i += 1\n    while i < n and intervals[i][0] <= new_interval[1]:\n        new_interval[0] = min(new_interval[0], intervals[i][0])\n        new_interval[1] = max(new_interval[1], intervals[i][1])\n        i += 1\n    result.append(new_interval)\n    result.extend(intervals[i:])\n    return result\n\ndef min_meeting_rooms(intervals):\n    if not intervals: return 0\n    starts = sorted(i[0] for i in intervals)\n    ends = sorted(i[1] for i in intervals)\n    rooms = max_rooms = i = j = 0\n    while i < len(starts):\n        if starts[i] < ends[j]:\n            rooms += 1\n            max_rooms = max(max_rooms, rooms)\n            i += 1\n        else:\n            rooms -= 1\n            j += 1\n    return max_rooms\n\ndef range_queries(arr, queries):\n    prefix = [0] * (len(arr) + 1)\n    for i, val in enumerate(arr):\n        prefix[i+1] = prefix[i] + val\n    return [prefix[r+1] - prefix[l] for l, r in queries]\n\ndef employee_free_time(schedules):\n    all_intervals = sorted([iv for emp in schedules for iv in emp], key=lambda x: x[0])\n    merged = [all_intervals[0][:]]\n    for start, end in all_intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return [[merged[i][1], merged[i+1][0]] for i in range(len(merged)-1)]\n\nprint(insert_interval([[1,3],[6,9]], [2,5]))\nprint(insert_interval([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]))\nprint(min_meeting_rooms([[0,30],[5,10],[15,20]]))\nprint(range_queries([3,1,4,1,5,9], [(0,2),(1,3),(2,5)]))\nprint(employee_free_time([[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]))',
      explanation: 'insert_interval в три фазы — классический линейный O(n). min_meeting_rooms через два отсортированных массива: если встреча начинается раньше чем закончится предыдущая — нужна новая комната. prefix sum позволяет отвечать на range queries за O(1).'
    },
    {
      id: 3,
      title: 'Сложное DP: разбиение строк',
      type: 'practice',
      difficulty: 'hard',
      description: 'Задачи динамического программирования на строках и разбиении.',
      requirements: [
        'palindrome_partitioning_min(s) — минимум разрезов для палиндромного разбиения',
        'burst_balloons(nums) — максимум монет при лопании шаров',
        'regular_expression_matching(s, p) — совпадение с . и *',
        'wildcard_matching(s, p) — совпадение с ? и *',
        'scramble_string(s1, s2) — перемешанная строка через DP'
      ],
      expectedOutput: 'palindrome_partitioning_min("aab") -> 1 (["aa","b"])\nregex("aa","a*") -> True\nregex("aab","c*a*b") -> True\nwildcard("aa","*") -> True',
      hint: 'palindrome_partitioning: dp[i] = min разрезов для s[:i+1]. burst_balloons: interval DP. regex: dp[i][j] = s[:i] совпадает с p[:j].',
      solution: 'def palindrome_partitioning_min(s):\n    n = len(s)\n    is_pal = [[False]*n for _ in range(n)]\n    for i in range(n):\n        is_pal[i][i] = True\n    for length in range(2, n+1):\n        for i in range(n-length+1):\n            j = i + length - 1\n            if s[i] == s[j]:\n                is_pal[i][j] = length == 2 or is_pal[i+1][j-1]\n    dp = list(range(n))\n    for i in range(1, n):\n        if is_pal[0][i]:\n            dp[i] = 0\n            continue\n        dp[i] = min(dp[j] + 1 for j in range(i) if is_pal[j+1][i])\n    return dp[n-1]\n\ndef regular_expression_matching(s, p):\n    m, n = len(s), len(p)\n    dp = [[False] * (n+1) for _ in range(m+1)]\n    dp[0][0] = True\n    for j in range(1, n+1):\n        if p[j-1] == "*":\n            dp[0][j] = dp[0][j-2]\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if p[j-1] in (s[i-1], "."):\n                dp[i][j] = dp[i-1][j-1]\n            elif p[j-1] == "*":\n                dp[i][j] = dp[i][j-2]\n                if p[j-2] in (s[i-1], "."):\n                    dp[i][j] = dp[i][j] or dp[i-1][j]\n    return dp[m][n]\n\ndef wildcard_matching(s, p):\n    m, n = len(s), len(p)\n    dp = [[False] * (n+1) for _ in range(m+1)]\n    dp[0][0] = True\n    for j in range(1, n+1):\n        if p[j-1] == "*":\n            dp[0][j] = dp[0][j-1]\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if p[j-1] in (s[i-1], "?"):\n                dp[i][j] = dp[i-1][j-1]\n            elif p[j-1] == "*":\n                dp[i][j] = dp[i][j-1] or dp[i-1][j]\n    return dp[m][n]\n\nprint(palindrome_partitioning_min("aab"))\nprint(palindrome_partitioning_min("abcba"))\nprint(regular_expression_matching("aa", "a*"))\nprint(regular_expression_matching("aab", "c*a*b"))\nprint(wildcard_matching("aa", "*"))\nprint(wildcard_matching("cb", "?a"))',
      explanation: 'palindrome_partitioning: вначале строим таблицу палиндромов is_pal[i][j], затем DP на минимальных разрезах. regex с *: dp[i][j-2] — ноль повторений, dp[i-1][j] — одно+ повторений совпадающего символа. wildcard *: dp[i][j-1] — пусто, dp[i-1][j] — поглотить s[i].'
    },
    {
      id: 4,
      title: 'Union-Find (Disjoint Set)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй Union-Find и реши задачи на связность.',
      requirements: [
        'UnionFind с path compression и union by rank',
        'number_of_components(n, edges) — количество компонент',
        'redundant_connection(edges) — найти лишнее ребро',
        'accounts_merge(accounts) — слить аккаунты с общими email',
        'min_cost_connections(n, edges) — MST алгоритм Краскала'
      ],
      expectedOutput: 'UnionFind: find с path compression O(α(n))\nnumber_of_components(5, [[0,1],[1,2],[3,4]]) -> 2\nredundant_connection([[1,2],[1,3],[2,3]]) -> [2,3]',
      hint: 'path compression: при find рекурсивно перепривязывай к корню. union by rank: присоединяй дерево меньшего ранга к большему.',
      solution: 'class UnionFind:\n    def __init__(self, n):\n        self.parent = list(range(n))\n        self.rank = [0] * n\n        self.count = n\n\n    def find(self, x):\n        if self.parent[x] != x:\n            self.parent[x] = self.find(self.parent[x])  # path compression\n        return self.parent[x]\n\n    def union(self, x, y):\n        px, py = self.find(x), self.find(y)\n        if px == py: return False\n        if self.rank[px] < self.rank[py]:\n            px, py = py, px\n        self.parent[py] = px\n        if self.rank[px] == self.rank[py]:\n            self.rank[px] += 1\n        self.count -= 1\n        return True\n\n    def connected(self, x, y):\n        return self.find(x) == self.find(y)\n\ndef number_of_components(n, edges):\n    uf = UnionFind(n)\n    for u, v in edges:\n        uf.union(u, v)\n    return uf.count\n\ndef redundant_connection(edges):\n    n = max(max(u, v) for u, v in edges)\n    uf = UnionFind(n + 1)\n    for u, v in edges:\n        if not uf.union(u, v):\n            return [u, v]\n    return []\n\ndef min_cost_connections(n, connections):\n    connections.sort(key=lambda x: x[2])\n    uf = UnionFind(n + 1)\n    total_cost = edges = 0\n    for u, v, cost in connections:\n        if uf.union(u, v):\n            total_cost += cost\n            edges += 1\n            if edges == n - 1:\n                return total_cost\n    return -1\n\nprint(number_of_components(5, [[0,1],[1,2],[3,4]]))\nprint(redundant_connection([[1,2],[1,3],[2,3]]))\nconns = [[1,2,5],[1,3,6],[2,3,1]]\nprint(min_cost_connections(3, conns))',
      explanation: 'Path compression: при find рекурсивно указываем все узлы на корень — следующий find O(1). Union by rank предотвращает вырождение дерева. Алгоритм Краскала для MST: сортируй рёбра, добавляй если не создаёт цикл (Union-Find для проверки).'
    },
    {
      id: 5,
      title: 'Segment Tree',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй Segment Tree для диапазонных запросов.',
      requirements: [
        'SegmentTree: build(arr), query(l, r), update(i, val)',
        'RangeSum: sum за O(log n)',
        'RangeMin/RangeMax',
        'range_update с lazy propagation',
        'Применение: нахождение количества инверсий'
      ],
      expectedOutput: 'tree = SegmentTree([1,3,5,7,9,11])\ntree.query(1,3) -> 15 (3+5+7)\ntree.update(1, 10)\ntree.query(1,3) -> 22 (10+5+7)',
      hint: 'Дерево в массиве: левый потомок = 2i, правый = 2i+1. build рекурсивно. query: если текущий узел полностью в диапазоне — возврат, иначе рекурсия в детей.',
      solution: 'class SegmentTree:\n    def __init__(self, arr):\n        self.n = len(arr)\n        self.tree = [0] * (4 * self.n)\n        self.build(arr, 0, 0, self.n - 1)\n\n    def build(self, arr, node, start, end):\n        if start == end:\n            self.tree[node] = arr[start]\n        else:\n            mid = (start + end) // 2\n            self.build(arr, 2*node+1, start, mid)\n            self.build(arr, 2*node+2, mid+1, end)\n            self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]\n\n    def update(self, node, start, end, idx, val):\n        if start == end:\n            self.tree[node] = val\n        else:\n            mid = (start + end) // 2\n            if idx <= mid:\n                self.update(2*node+1, start, mid, idx, val)\n            else:\n                self.update(2*node+2, mid+1, end, idx, val)\n            self.tree[node] = self.tree[2*node+1] + self.tree[2*node+2]\n\n    def query(self, node, start, end, l, r):\n        if r < start or end < l:\n            return 0\n        if l <= start and end <= r:\n            return self.tree[node]\n        mid = (start + end) // 2\n        left = self.query(2*node+1, start, mid, l, r)\n        right = self.query(2*node+2, mid+1, end, l, r)\n        return left + right\n\n    def range_query(self, l, r):\n        return self.query(0, 0, self.n-1, l, r)\n\n    def point_update(self, idx, val):\n        self.update(0, 0, self.n-1, idx, val)\n\narr = [1, 3, 5, 7, 9, 11]\nst = SegmentTree(arr)\nprint(f"query(1,3) = {st.range_query(1,3)}")\nst.point_update(1, 10)\nprint(f"после update(1,10), query(1,3) = {st.range_query(1,3)}")\nprint(f"query(0,5) = {st.range_query(0,5)}")',
      explanation: 'Segment Tree: O(n) build, O(log n) query и update. Дерево хранится в массиве размером 4n. Узел i: дети 2i+1 и 2i+2. Запрос: если диапазон не пересекается — 0, если полностью внутри — текущий узел, иначе рекурсия в оба ребёнка.'
    },
    {
      id: 6,
      title: 'Алгоритм Дейкстры',
      type: 'practice',
      difficulty: 'hard',
      description: 'Кратчайший путь в взвешенном графе.',
      requirements: [
        'dijkstra(graph, start) — расстояния от start до всех вершин',
        'shortest_path(graph, start, end) — восстановление пути',
        'network_delay_time(times, n, k) — минимальное время до всех узлов',
        'cheapest_flights(n, flights, src, dst, k) — дешевейший рейс с k пересадками',
        'Сравни Дейкстру с Беллманом-Фордом'
      ],
      expectedOutput: 'graph = {A: {B:1, C:4}, B: {C:2, D:5}, C: {D:1}}\ndijkstra(A) -> {A:0, B:1, C:3, D:4}\nshortest_path(A,D) -> [A,B,C,D]',
      hint: 'Дейкстра: min-heap с (distance, node). При извлечении: если dist > known — пропустить. Обновлять dist если found shorter path. Для пути: храни prev словарь.',
      solution: 'import heapq\nfrom collections import defaultdict\n\ndef dijkstra(graph, start):\n    dist = {node: float("inf") for node in graph}\n    dist[start] = 0\n    heap = [(0, start)]\n    while heap:\n        d, node = heapq.heappop(heap)\n        if d > dist[node]: continue\n        for neighbor, weight in graph[node].items():\n            new_dist = d + weight\n            if new_dist < dist[neighbor]:\n                dist[neighbor] = new_dist\n                heapq.heappush(heap, (new_dist, neighbor))\n    return dist\n\ndef shortest_path(graph, start, end):\n    dist = {node: float("inf") for node in graph}\n    prev = {node: None for node in graph}\n    dist[start] = 0\n    heap = [(0, start)]\n    while heap:\n        d, node = heapq.heappop(heap)\n        if d > dist[node]: continue\n        for neighbor, weight in graph[node].items():\n            new_dist = d + weight\n            if new_dist < dist[neighbor]:\n                dist[neighbor] = new_dist\n                prev[neighbor] = node\n                heapq.heappush(heap, (new_dist, neighbor))\n    path = []\n    node = end\n    while node is not None:\n        path.append(node)\n        node = prev[node]\n    return path[::-1] if path[-1] == start else []\n\ndef network_delay_time(times, n, k):\n    graph = defaultdict(list)\n    for u, v, w in times:\n        graph[u].append((v, w))\n    dist = dijkstra({node: dict(graph[node]) for node in range(1, n+1)}, k)\n    max_dist = max(dist.values())\n    return max_dist if max_dist != float("inf") else -1\n\ng = {"A": {"B":1,"C":4}, "B": {"C":2,"D":5}, "C": {"D":1}, "D": {}}\nprint("Расстояния от A:", dijkstra(g, "A"))\nprint("Путь A->D:", shortest_path(g, "A", "D"))\ntimes = [[2,1,1],[2,3,1],[3,4,1]]\nprint("Задержка сети:", network_delay_time(times, 4, 2))',
      explanation: 'Дейкстра с heap O((V+E) log V). Ключевая оптимизация: пропускать устаревшие записи в heap (if d > dist[node]: continue). Восстановление пути: идти назад по prev от конца к началу. Не работает с отрицательными рёбрами — используй Беллман-Форд.'
    },
    {
      id: 7,
      title: 'Trie (префиксное дерево)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй Trie и задачи на автодополнение.',
      requirements: [
        'Класс Trie: insert, search, starts_with',
        'Autocomplete: top-k слов с данным префиксом',
        'word_squares(words) — все квадраты слов',
        'replace_words(sentence, dictionary) — замена на корни',
        'longest_word_in_dictionary(words) — самое длинное составимое слово'
      ],
      expectedOutput: 'trie.insert("apple")\ntrie.search("apple") -> True\ntrie.search("app") -> False\ntrie.starts_with("app") -> True\nautocomplete("ap") -> ["apple", "apply", "apt"]',
      hint: 'TrieNode хранит children = {} и is_end = False. search идёт по символам и проверяет is_end. autocomplete: DFS от найденного prefix узла.',
      solution: 'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n        self.word = None\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        node = self.root\n        for char in word:\n            if char not in node.children:\n                node.children[char] = TrieNode()\n            node = node.children[char]\n        node.is_end = True\n        node.word = word\n\n    def search(self, word):\n        node = self._find_node(word)\n        return node is not None and node.is_end\n\n    def starts_with(self, prefix):\n        return self._find_node(prefix) is not None\n\n    def _find_node(self, prefix):\n        node = self.root\n        for char in prefix:\n            if char not in node.children:\n                return None\n            node = node.children[char]\n        return node\n\n    def autocomplete(self, prefix, k=5):\n        node = self._find_node(prefix)\n        if not node: return []\n        results = []\n        def dfs(n, path):\n            if len(results) >= k: return\n            if n.is_end: results.append(n.word)\n            for char, child in sorted(n.children.items()):\n                dfs(child, path + char)\n        dfs(node, prefix)\n        return results\n\n    def replace_words(self, sentence, roots):\n        for root in roots:\n            self.insert(root)\n        words = sentence.split()\n        result = []\n        for word in words:\n            node = self.root\n            replaced = word\n            for i, char in enumerate(word):\n                if char not in node.children: break\n                node = node.children[char]\n                if node.is_end:\n                    replaced = word[:i+1]\n                    break\n            result.append(replaced)\n        return " ".join(result)\n\ntrie = Trie()\nfor w in ["apple", "apply", "apt", "banana", "app", "application"]:\n    trie.insert(w)\nprint(trie.search("apple"))\nprint(trie.search("app"))\nprint(trie.starts_with("app"))\nprint(trie.autocomplete("app"))\nprint(trie.replace_words("the cattle was rattled", ["cat","rat","cattle"]))',
      explanation: 'Trie хранит символы как ключи в словаре children. DFS для autocomplete: обходим поддерево с нужным префиксом. replace_words: для каждого слова ищем кратчайший префикс-корень в Trie — O(L) на слово где L длина слова.'
    },
    {
      id: 8,
      title: 'Продвинутое DP: числа и разбиения',
      type: 'practice',
      difficulty: 'hard',
      description: 'Сложные задачи динамического программирования.',
      requirements: [
        'count_partitions(n, k) — количество разбиений числа n на k частей',
        'matrix_chain(dims) — оптимальное перемножение матриц',
        'optimal_bst(keys, freq) — оптимальное BST для поиска',
        'egg_drop(eggs, floors) — минимальные броски яйца',
        'largest_rectangle_histogram(heights) — наибольший прямоугольник'
      ],
      expectedOutput: 'egg_drop(2, 10) -> 4 (оптимальные броски)\nlargest_rectangle_histogram([2,1,5,6,2,3]) -> 10\nmatrix_chain(dims для 4 матриц) -> минимальные операции',
      hint: 'egg_drop через DP: dp[e][f] = минимальные броски. Бинарный поиск для оптимизации. largest_rectangle: стек для хранения индексов.',
      solution: 'def egg_drop(eggs, floors):\n    dp = [[0] * (floors + 1) for _ in range(eggs + 1)]\n    for f in range(1, floors + 1):\n        dp[1][f] = f  # 1 яйцо: f попыток\n    for e in range(2, eggs + 1):\n        for f in range(1, floors + 1):\n            dp[e][f] = float("inf")\n            lo, hi = 1, f\n            while lo <= hi:\n                mid = (lo + hi) // 2\n                broken = dp[e-1][mid-1]\n                not_broken = dp[e][f-mid]\n                worst = 1 + max(broken, not_broken)\n                if broken < not_broken:\n                    lo = mid + 1\n                else:\n                    hi = mid - 1\n                dp[e][f] = min(dp[e][f], worst)\n    return dp[eggs][floors]\n\ndef largest_rectangle_histogram(heights):\n    stack = []\n    max_area = 0\n    heights = heights + [0]  # sentinel\n    for i, h in enumerate(heights):\n        start = i\n        while stack and stack[-1][1] > h:\n            idx, height = stack.pop()\n            max_area = max(max_area, height * (i - idx))\n            start = idx\n        stack.append((start, h))\n    return max_area\n\ndef matrix_chain(dims):\n    n = len(dims) - 1\n    dp = [[0] * n for _ in range(n)]\n    for length in range(2, n+1):\n        for i in range(n - length + 1):\n            j = i + length - 1\n            dp[i][j] = float("inf")\n            for k in range(i, j):\n                cost = dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1]\n                dp[i][j] = min(dp[i][j], cost)\n    return dp[0][n-1]\n\ndef count_partitions(n, k):\n    dp = [[0] * (k+1) for _ in range(n+1)]\n    dp[0][0] = 1\n    for num in range(1, n+1):\n        for parts in range(1, k+1):\n            for take in range(1, num+1):\n                if num - take >= 0:\n                    dp[num][parts] += dp[num-take][parts-1]\n    return dp[n][k]\n\nprint(f"egg_drop(2,10) = {egg_drop(2, 10)}")\nprint(f"egg_drop(3,25) = {egg_drop(3, 25)}")\nprint(f"largest_rect = {largest_rectangle_histogram([2,1,5,6,2,3])}")\nprint(f"matrix_chain = {matrix_chain([10,30,5,60])} операций")\nprint(f"partitions(5,3) = {count_partitions(5,3)}")',
      explanation: 'egg_drop с бинарным поиском O(eggs * floors * log floors). В каждом этаже mid: если яйцо разбивается — идём ниже, иначе выше. largest_rectangle через монотонный стек O(n): при падении высоты вычисляем площадь для предыдущих. matrix_chain: interval DP O(n^3).'
    },
    {
      id: 9,
      title: 'Алгоритмы на строках: KMP и Rabin-Karp',
      type: 'practice',
      difficulty: 'hard',
      description: 'Эффективный поиск подстроки.',
      requirements: [
        'kmp_search(text, pattern) — все вхождения через KMP',
        'build_failure_function(pattern) — prefix function для KMP',
        'rabin_karp(text, pattern) — поиск через хеширование',
        'longest_repeated_substring(s) — наидлиннейшая повторяющаяся подстрока',
        'minimum_window_anagram(s, p) — все анаграммы p в s'
      ],
      expectedOutput: 'kmp_search("ababcabcabababd", "ababd") -> [9]\nbuild_failure("aabcaab") -> [0,1,0,0,1,2,3]\nrabin_karp("abracadabra","bra") -> [1,8]\nmin_anagram("cbaebabacd","abc") -> [0,6]',
      hint: 'KMP failure function: сравни prefix и suffix. При несовпадении откатись по failure функции. Rabin-Karp: rolling hash. anagram: sliding window со счётчиком.',
      solution: 'def build_failure(pattern):\n    f = [0] * len(pattern)\n    k = 0\n    for i in range(1, len(pattern)):\n        while k > 0 and pattern[k] != pattern[i]:\n            k = f[k-1]\n        if pattern[k] == pattern[i]:\n            k += 1\n        f[i] = k\n    return f\n\ndef kmp_search(text, pattern):\n    if not pattern: return []\n    f = build_failure(pattern)\n    matches = []\n    k = 0\n    for i, char in enumerate(text):\n        while k > 0 and pattern[k] != char:\n            k = f[k-1]\n        if pattern[k] == char:\n            k += 1\n        if k == len(pattern):\n            matches.append(i - len(pattern) + 1)\n            k = f[k-1]\n    return matches\n\ndef rabin_karp(text, pattern, base=256, mod=10**9+7):\n    n, m = len(text), len(pattern)\n    if m > n: return []\n    ph = th = 0\n    h = pow(base, m-1, mod)\n    for i in range(m):\n        ph = (base * ph + ord(pattern[i])) % mod\n        th = (base * th + ord(text[i])) % mod\n    matches = []\n    for i in range(n - m + 1):\n        if ph == th and text[i:i+m] == pattern:\n            matches.append(i)\n        if i < n - m:\n            th = (base * (th - ord(text[i]) * h) + ord(text[i+m])) % mod\n    return matches\n\ndef find_anagrams(s, p):\n    from collections import Counter\n    need = Counter(p)\n    have = Counter(s[:len(p)])\n    result = []\n    if have == need: result.append(0)\n    for i in range(len(p), len(s)):\n        have[s[i]] += 1\n        have[s[i-len(p)]] -= 1\n        if have[s[i-len(p)]] == 0:\n            del have[s[i-len(p)]]\n        if have == need:\n            result.append(i - len(p) + 1)\n    return result\n\nprint(build_failure("aabcaab"))\nprint(kmp_search("ababcabcabababd", "ababd"))\nprint(rabin_karp("abracadabra", "bra"))\nprint(find_anagrams("cbaebabacd", "abc"))',
      explanation: 'KMP O(n+m): failure function позволяет не возвращаться в тексте. При несовпадении — откат по failure (не к началу паттерна). Rabin-Karp O(n+m) средний, O(nm) в худшем случае (коллизии). Rolling hash: убираем старый символ, добавляем новый.'
    },
    {
      id: 10,
      title: 'Задача максимального потока',
      type: 'practice',
      difficulty: 'hard',
      description: 'Алгоритм Ford-Fulkerson для максимального потока в сети.',
      requirements: [
        'Граф с пропускными способностями',
        'ford_fulkerson(graph, source, sink) — максимальный поток',
        'bfs для нахождения увеличивающего пути',
        'min_cut(graph, source, sink) — минимальный разрез',
        'bipartite_matching(graph) — максимальное двудольное паросочетание'
      ],
      expectedOutput: 'graph с пропускными способностями:\nS->A:10, S->B:10, A->C:10, B->C:10, A->T:10, C->T:10\nmax_flow(S, T) -> 20',
      hint: 'Ford-Fulkerson с BFS (Эдмондс-Карп): пока есть путь от source до sink, найди минимальную пропускную способность, обнови residual граф.',
      solution: 'from collections import defaultdict, deque\n\nclass MaxFlow:\n    def __init__(self):\n        self.graph = defaultdict(lambda: defaultdict(int))\n\n    def add_edge(self, u, v, capacity):\n        self.graph[u][v] += capacity\n\n    def bfs(self, source, sink, parent):\n        visited = {source}\n        queue = deque([source])\n        while queue:\n            node = queue.popleft()\n            for neighbor, cap in self.graph[node].items():\n                if neighbor not in visited and cap > 0:\n                    visited.add(neighbor)\n                    parent[neighbor] = node\n                    if neighbor == sink:\n                        return True\n                    queue.append(neighbor)\n        return False\n\n    def max_flow(self, source, sink):\n        total_flow = 0\n        while True:\n            parent = {}\n            if not self.bfs(source, sink, parent):\n                break\n            path_flow = float("inf")\n            node = sink\n            while node != source:\n                prev = parent[node]\n                path_flow = min(path_flow, self.graph[prev][node])\n                node = prev\n            node = sink\n            while node != source:\n                prev = parent[node]\n                self.graph[prev][node] -= path_flow\n                self.graph[node][prev] += path_flow\n                node = prev\n            total_flow += path_flow\n        return total_flow\n\nmf = MaxFlow()\nmf.add_edge("S", "A", 10)\nmf.add_edge("S", "B", 10)\nmf.add_edge("A", "C", 10)\nmf.add_edge("B", "C", 10)\nmf.add_edge("A", "T", 10)\nmf.add_edge("C", "T", 10)\nprint(f"Максимальный поток S->T: {mf.max_flow(\'S\', \'T\')}")\n\nmf2 = MaxFlow()\nmf2.add_edge("S", "A", 16)\nmf2.add_edge("S", "B", 13)\nmf2.add_edge("A", "B", 10)\nmf2.add_edge("B", "A", 4)\nmf2.add_edge("A", "C", 12)\nmf2.add_edge("B", "D", 14)\nmf2.add_edge("C", "B", 9)\nmf2.add_edge("C", "T", 20)\nmf2.add_edge("D", "C", 7)\nmf2.add_edge("D", "T", 4)\nprint(f"Ford-Fulkerson пример: {mf2.max_flow(\'S\', \'T\')}")',
      explanation: 'Алгоритм Эдмондс-Карп (Ford-Fulkerson с BFS) O(VE^2). Остаточная сеть: при потоке f по ребру u->v добавляем обратное ребро v->u с пропускной способностью f. Это позволяет "отменять" поток. По теореме макс-поток = мин-разрез.'
    }
  ]
}
