export default {
  id: 18,
  title: 'Coding: графы',
  description: 'Задачи на графы: обходы BFS/DFS, топологическая сортировка, компоненты связности и кратчайшие пути.',
  lessons: [
    {
      id: 1,
      title: 'Количество островов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана сетка m x n из "1" (суша) и "0" (вода). Подсчитай количество островов. Остров окружён водой и образован соединёнными по горизонтали/вертикали участками суши. LeetCode #200.',
      requirements: [
        'Принимает 2D список символов "1" и "0"',
        'Возвращает целое число — количество островов',
        'Соединение только по 4 направлениям (не по диагонали)',
        'Можно модифицировать сетку (потоплять посещённые клетки)'
      ],
      expectedOutput: 'Вход:\n[["1","1","0","0","0"],\n ["1","1","0","0","0"],\n ["0","0","1","0","0"],\n ["0","0","0","1","1"]]\nВыход: 3',
      hint: 'Перебирай клетки. Когда находишь "1", запускай DFS/BFS и топи весь остров (меняй "1" на "0"). Увеличивай счётчик на 1.',
      solution: 'def numIslands(grid):\n    if not grid:\n        return 0\n    rows, cols = len(grid), len(grid[0])\n    count = 0\n\n    def dfs(r, c):\n        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1":\n            return\n        grid[r][c] = "0"  # топим\n        dfs(r + 1, c)\n        dfs(r - 1, c)\n        dfs(r, c + 1)\n        dfs(r, c - 1)\n\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == "1":\n                count += 1\n                dfs(r, c)\n    return count\n\n# BFS вариант\nfrom collections import deque\n\ndef numIslandsBFS(grid):\n    if not grid:\n        return 0\n    rows, cols = len(grid), len(grid[0])\n    count = 0\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == "1":\n                count += 1\n                queue = deque([(r, c)])\n                grid[r][c] = "0"\n                while queue:\n                    row, col = queue.popleft()\n                    for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:\n                        nr, nc = row + dr, col + dc\n                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == "1":\n                            grid[nr][nc] = "0"\n                            queue.append((nr, nc))\n    return count',
      explanation: 'Подход: flood fill — при обнаружении суши топим весь остров через DFS/BFS и увеличиваем счётчик.\nСложность: O(m*n) по времени, O(m*n) по памяти (стек рекурсии).\nСовет для интервью: одна из самых частых задач на графах. Паттерн "затоплять посещённые" или использовать visited set. Уточни у интервьюера можно ли менять входные данные.'
    },
    {
      id: 2,
      title: 'Клонировать граф',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан узел неориентированного связного графа. Верни глубокую копию (клон) графа. Каждый узел содержит значение int и список соседей. LeetCode #133.',
      requirements: [
        'Принимает ссылку на узел графа (или None)',
        'Возвращает клон того же узла в скопированном графе',
        'Все узлы и рёбра копируются',
        'Использует хеш-таблицу для избежания зацикливания'
      ],
      expectedOutput: 'Вход: adjList=[[2,4],[1,3],[2,4],[1,3]]\nВыход: глубокая копия того же графа',
      hint: 'Используй словарь {оригинальный_узел: клонированный_узел}. DFS: создай клон текущего узла, затем рекурсивно клонируй каждого соседа.',
      solution: 'class Node:\n    def __init__(self, val=0, neighbors=None):\n        self.val = val\n        self.neighbors = neighbors if neighbors is not None else []\n\ndef cloneGraph(node):\n    if not node:\n        return None\n    cloned = {}  # original -> clone\n\n    def dfs(n):\n        if n in cloned:\n            return cloned[n]\n        clone = Node(n.val)\n        cloned[n] = clone\n        for neighbor in n.neighbors:\n            clone.neighbors.append(dfs(neighbor))\n        return clone\n\n    return dfs(node)\n\n# BFS вариант\nfrom collections import deque\n\ndef cloneGraphBFS(node):\n    if not node:\n        return None\n    cloned = {node: Node(node.val)}\n    queue = deque([node])\n    while queue:\n        curr = queue.popleft()\n        for neighbor in curr.neighbors:\n            if neighbor not in cloned:\n                cloned[neighbor] = Node(neighbor.val)\n                queue.append(neighbor)\n            cloned[curr].neighbors.append(cloned[neighbor])\n    return cloned[node]',
      explanation: 'Подход: DFS/BFS с хеш-таблицей для отслеживания уже клонированных узлов. Без неё зациклимся на циклах в графе.\nСложность: O(V + E) по времени и памяти где V — вершины, E — рёбра.\nСовет для интервью: ключевой момент — обработка уже посещённых узлов. Если cloned[n] уже есть — возвращаем его без повторного обхода.'
    },
    {
      id: 3,
      title: 'Pacific Atlantic Water Flow',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана сетка высот m x n. Вода течёт в соседние клетки с равной или меньшей высотой. Найди все клетки, из которых вода может достичь и Тихого (верх/лево), и Атлантического (низ/право) океана. LeetCode #417.',
      requirements: [
        'Принимает 2D список целых чисел (высоты)',
        'Возвращает список координат [row, col]',
        'Вода может течь в 4 направлениях',
        'Использует "обратный" обход: от океанов вверх по высотам'
      ],
      expectedOutput: 'Вход: heights=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]\nВыход: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]',
      hint: 'Запусти BFS/DFS от всех клеток у Тихого океана (верх + лево) и от всех клеток у Атлантического (низ + право). Двигайся ВВЕРХ по высотам. Ответ — пересечение.',
      solution: 'from collections import deque\n\ndef pacificAtlantic(heights):\n    if not heights:\n        return []\n    rows, cols = len(heights), len(heights[0])\n    directions = [(1,0),(-1,0),(0,1),(0,-1)]\n\n    def bfs(starts):\n        visited = set(starts)\n        queue = deque(starts)\n        while queue:\n            r, c = queue.popleft()\n            for dr, dc in directions:\n                nr, nc = r + dr, c + dc\n                if (0 <= nr < rows and 0 <= nc < cols and\n                        (nr, nc) not in visited and\n                        heights[nr][nc] >= heights[r][c]):\n                    visited.add((nr, nc))\n                    queue.append((nr, nc))\n        return visited\n\n    pacific_starts = [(0, c) for c in range(cols)] + [(r, 0) for r in range(rows)]\n    atlantic_starts = [(rows-1, c) for c in range(cols)] + [(r, cols-1) for r in range(rows)]\n\n    pacific = bfs(pacific_starts)\n    atlantic = bfs(atlantic_starts)\n\n    return [[r, c] for r, c in pacific & atlantic]',
      explanation: 'Подход: обратный BFS — вместо "откуда вода вытечет" смотрим "куда вода может дойти снизу вверх". Двигаемся в направлении нарастающей высоты.\nСложность: O(m*n) по времени и памяти.\nСовет для интервью: идея инверсии обхода (от цели к источнику) — мощный приём. Объясни почему прямой обход сложнее: пришлось бы запускать DFS из каждой клетки.'
    },
    {
      id: 4,
      title: 'Course Schedule (топологическая сортировка)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Нужно пройти numCourses курсов [0..n-1]. Дан список prerequisites[[a,b]] — чтобы взять курс a, нужно сначала пройти b. Можно ли пройти все курсы? LeetCode #207.',
      requirements: [
        'Принимает numCourses и список зависимостей',
        'Возвращает True если можно пройти все курсы (нет цикла)',
        'Реализует определение цикла в ориентированном графе',
        'Поддерживает оба подхода: DFS с окраской и алгоритм Кана'
      ],
      expectedOutput: 'Вход: numCourses=2, prerequisites=[[1,0]]\nВыход: True\nВход: numCourses=2, prerequisites=[[1,0],[0,1]]\nВыход: False',
      hint: 'Задача — определить есть ли цикл в ориентированном графе. DFS: три состояния вершины — не посещена (0), в обработке (1), обработана (2). Цикл есть если достигаем вершину в состоянии 1.',
      solution: 'from collections import deque\n\ndef canFinish(numCourses, prerequisites):\n    # Алгоритм Кана (BFS топологическая сортировка)\n    graph = [[] for _ in range(numCourses)]\n    in_degree = [0] * numCourses\n\n    for a, b in prerequisites:\n        graph[b].append(a)\n        in_degree[a] += 1\n\n    queue = deque([i for i in range(numCourses) if in_degree[i] == 0])\n    processed = 0\n\n    while queue:\n        node = queue.popleft()\n        processed += 1\n        for neighbor in graph[node]:\n            in_degree[neighbor] -= 1\n            if in_degree[neighbor] == 0:\n                queue.append(neighbor)\n\n    return processed == numCourses\n\n# DFS вариант с окраской\ndef canFinishDFS(numCourses, prerequisites):\n    graph = [[] for _ in range(numCourses)]\n    for a, b in prerequisites:\n        graph[b].append(a)\n\n    # 0 = не посещена, 1 = в обработке, 2 = обработана\n    state = [0] * numCourses\n\n    def dfs(node):\n        if state[node] == 1:\n            return False  # цикл!\n        if state[node] == 2:\n            return True\n        state[node] = 1\n        for neighbor in graph[node]:\n            if not dfs(neighbor):\n                return False\n        state[node] = 2\n        return True\n\n    return all(dfs(i) for i in range(numCourses))',
      explanation: 'Подход 1 (Кан): узлы с нулевой входящей степенью берём первыми. Убираем их и уменьшаем in_degree соседей. Если обработали все — цикла нет.\nПодход 2 (DFS): три цвета вершины. "Серая" вершина (в обработке) при повторном визите = цикл.\nСложность: O(V + E) по времени и памяти.\nСовет для интервью: знай оба алгоритма. Кан интуитивен, DFS с окраской элегантен.'
    },
    {
      id: 5,
      title: 'Количество связных компонент',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан неориентированный граф: n вершин (0..n-1) и список рёбер edges. Найди количество связных компонент. LeetCode #323.',
      requirements: [
        'Принимает n (количество вершин) и список рёбер',
        'Возвращает количество связных компонент',
        'Реализует Union-Find или DFS/BFS',
        'Работает для графа без рёбер (n компонент)'
      ],
      expectedOutput: 'Вход: n=5, edges=[[0,1],[1,2],[3,4]]\nВыход: 2\nВход: n=5, edges=[[0,1],[1,2],[2,3],[3,4]]\nВыход: 1',
      hint: 'Union-Find: для каждого ребра объединяй компоненты. Считай количество уникальных корней. Или DFS: запускай обход из непосещённых вершин.',
      solution: '# Union-Find (оптимальный)\ndef countComponents(n, edges):\n    parent = list(range(n))\n    rank = [0] * n\n\n    def find(x):\n        if parent[x] != x:\n            parent[x] = find(parent[x])  # path compression\n        return parent[x]\n\n    def union(x, y):\n        px, py = find(x), find(y)\n        if px == py:\n            return 0\n        if rank[px] < rank[py]:\n            px, py = py, px\n        parent[py] = px\n        if rank[px] == rank[py]:\n            rank[px] += 1\n        return 1\n\n    components = n\n    for u, v in edges:\n        components -= union(u, v)\n    return components\n\n# DFS вариант\ndef countComponentsDFS(n, edges):\n    graph = [[] for _ in range(n)]\n    for u, v in edges:\n        graph[u].append(v)\n        graph[v].append(u)\n\n    visited = set()\n\n    def dfs(node):\n        visited.add(node)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                dfs(neighbor)\n\n    count = 0\n    for i in range(n):\n        if i not in visited:\n            dfs(i)\n            count += 1\n    return count',
      explanation: 'Union-Find с path compression и union by rank даёт почти O(1) на операцию (амортизированно O(α(n))). Эффективен для задач объединения множеств.\nDFS проще реализовать и легче объяснить.\nСложность: Union-Find O(n * α(n)) ≈ O(n). DFS O(V + E).\nСовет для интервью: Union-Find — обязательный паттерн. Знай path compression и union by rank.'
    },
    {
      id: 6,
      title: 'Граф является деревом',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан неориентированный граф из n вершин и n-1 рёбер. Определи, является ли он деревом. Граф — дерево если он связен и не содержит циклов. LeetCode #261.',
      requirements: [
        'Принимает n и список рёбер',
        'Возвращает True если граф является деревом',
        'Дерево: связный граф без циклов',
        'Реализует через Union-Find или DFS'
      ],
      expectedOutput: 'Вход: n=5, edges=[[0,1],[0,2],[0,3],[1,4]]\nВыход: True\nВход: n=5, edges=[[0,1],[1,2],[2,3],[1,3],[1,4]]\nВыход: False',
      hint: 'Два условия: 1) ровно n-1 рёбер (необходимое условие), 2) граф связен (проверяется DFS/Union-Find). Union-Find: если при объединении вершины уже в одной компоненте — есть цикл.',
      solution: 'def validTree(n, edges):\n    # Условие 1: дерево имеет ровно n-1 рёбер\n    if len(edges) != n - 1:\n        return False\n\n    # Union-Find\n    parent = list(range(n))\n\n    def find(x):\n        while parent[x] != x:\n            parent[x] = parent[parent[x]]  # path compression (halving)\n            x = parent[x]\n        return x\n\n    def union(x, y):\n        px, py = find(x), find(y)\n        if px == py:\n            return False  # цикл!\n        parent[px] = py\n        return True\n\n    for u, v in edges:\n        if not union(u, v):\n            return False\n    return True\n\n# DFS вариант\ndef validTreeDFS(n, edges):\n    if len(edges) != n - 1:\n        return False\n    graph = [[] for _ in range(n)]\n    for u, v in edges:\n        graph[u].append(v)\n        graph[v].append(u)\n\n    visited = set()\n\n    def dfs(node, parent):\n        visited.add(node)\n        for neighbor in graph[node]:\n            if neighbor == parent:\n                continue\n            if neighbor in visited:\n                return False\n            if not dfs(neighbor, node):\n                return False\n        return True\n\n    return dfs(0, -1) and len(visited) == n',
      explanation: 'Подход: проверяем два условия независимо. n-1 рёбер необходимо но недостаточно (может быть несвязный граф с циклом). Union-Find элегантно проверяет оба сразу.\nСложность: O(n * α(n)) для Union-Find.\nСовет для интервью: начни с проверки len(edges) == n-1, это быстро отсеивает невалидные случаи.'
    },
    {
      id: 7,
      title: 'Word Ladder',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дано начальное слово beginWord, конечное endWord и словарь wordList. Найди длину кратчайшей цепочки преобразований от beginWord до endWord, меняя по одной букве за шаг. Каждое промежуточное слово должно быть в словаре. LeetCode #127.',
      requirements: [
        'Каждое преобразование меняет ровно одну букву',
        'Все промежуточные слова должны быть в словаре',
        'Возвращает длину кратчайшей цепочки (включая begin и end)',
        'Возвращает 0 если путь не существует'
      ],
      expectedOutput: 'Вход: beginWord="hit", endWord="cog", wordList=["hot","dot","dog","lot","log","cog"]\nВыход: 5\n(hit -> hot -> dot -> dog -> cog)',
      hint: 'BFS для поиска кратчайшего пути. Из каждого слова генерируй соседей — слова отличающиеся на 1 букву, присутствующие в словаре. Оптимизация: pre-build паттерн "*ot" -> ["hot","dot","lot"].',
      solution: 'from collections import deque, defaultdict\n\ndef ladderLength(beginWord, endWord, wordList):\n    word_set = set(wordList)\n    if endWord not in word_set:\n        return 0\n\n    # Построим словарь паттернов для O(1) поиска соседей\n    L = len(beginWord)\n    pattern_map = defaultdict(list)\n    for word in word_set:\n        for i in range(L):\n            pattern = word[:i] + "*" + word[i+1:]\n            pattern_map[pattern].append(word)\n\n    queue = deque([(beginWord, 1)])\n    visited = {beginWord}\n\n    while queue:\n        word, steps = queue.popleft()\n        for i in range(L):\n            pattern = word[:i] + "*" + word[i+1:]\n            for neighbor in pattern_map[pattern]:\n                if neighbor == endWord:\n                    return steps + 1\n                if neighbor not in visited:\n                    visited.add(neighbor)\n                    queue.append((neighbor, steps + 1))\n\n    return 0',
      explanation: 'Подход: BFS гарантирует кратчайший путь. Построение словаря паттернов ускоряет поиск соседей с O(26*L) до O(L) на слово.\nСложность: O(M^2 * N) где M — длина слова, N — размер словаря.\nСовет для интервью: упомяни двустороннее BFS (bidirectional BFS) — оно сокращает пространство поиска с O(b^d) до O(b^(d/2)). Это оптимизация для больших словарей.'
    },
    {
      id: 8,
      title: 'Alien Dictionary',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан список слов на "инопланетном" языке, отсортированных в алфавитном порядке этого языка. Определи порядок букв в этом алфавите. Если порядок невозможен — верни пустую строку. LeetCode #269.',
      requirements: [
        'Принимает список слов',
        'Возвращает строку с буквами в порядке их приоритета',
        'Если несколько вариантов — любой подходит',
        'При противоречии (цикле) возвращает пустую строку'
      ],
      expectedOutput: 'Вход: words=["wrt","wrf","er","ett","rftt"]\nВыход: "wertf"\nВход: words=["z","x","z"]\nВыход: "" (цикл)',
      hint: 'Сравни соседние слова: первый различающийся символ даёт отношение порядка (a -> b). Построй граф и запусти топологическую сортировку. Цикл в графе = невозможный порядок.',
      solution: 'from collections import deque, defaultdict\n\ndef alienOrder(words):\n    # Инициализируем все уникальные символы\n    adj = {c: set() for word in words for c in word}\n    in_degree = {c: 0 for word in words for c in word}\n\n    # Извлекаем порядок из соседних слов\n    for i in range(len(words) - 1):\n        w1, w2 = words[i], words[i+1]\n        min_len = min(len(w1), len(w2))\n        # Проверка на невалидный случай: "abc" перед "ab"\n        if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:\n            return ""\n        for j in range(min_len):\n            if w1[j] != w2[j]:\n                if w2[j] not in adj[w1[j]]:\n                    adj[w1[j]].add(w2[j])\n                    in_degree[w2[j]] += 1\n                break  # только первое отличие!\n\n    # Топологическая сортировка (алгоритм Кана)\n    queue = deque([c for c in in_degree if in_degree[c] == 0])\n    result = []\n\n    while queue:\n        c = queue.popleft()\n        result.append(c)\n        for neighbor in adj[c]:\n            in_degree[neighbor] -= 1\n            if in_degree[neighbor] == 0:\n                queue.append(neighbor)\n\n    if len(result) != len(in_degree):\n        return ""  # цикл\n    return "".join(result)',
      explanation: 'Подход: строим ориентированный граф из попарного сравнения соседних слов. Затем топологическая сортировка даёт порядок букв.\nСложность: O(C) где C — суммарное количество символов во всех словах.\nСовет для интервью: не забудь edge case — слово является префиксом следующего (["abc","ab"]). Это невалидный входные данные.'
    }
  ]
}
