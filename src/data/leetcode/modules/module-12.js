export default {
  id: 12,
  title: 'Графы: продвинутый',
  description: 'Продвинутые алгоритмы на графах: Dijkstra, топологическая сортировка, Union-Find.',
  lessons: [
    {
      id: 1,
      title: 'Алгоритм Дейкстры',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Кратчайший путь во взвешенном графе'
        },
        {
          type: 'text',
          value: 'Алгоритм Дейкстры находит кратчайшие пути от одного источника ко всем вершинам в графе с неотрицательными весами. Используется с приоритетной очередью (min-heap).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Алгоритм Дейкстры\nfunction dijkstra(graph, start) {\n  // graph[u] = [[v, weight], ...]\n  const n = graph.length;\n  const dist = new Array(n).fill(Infinity);\n  dist[start] = 0;\n\n  // Min-heap: [расстояние, вершина]\n  const heap = new MinHeap();\n  heap.push([0, start]);\n\n  while (heap.size() > 0) {\n    const [d, u] = heap.pop();\n\n    if (d > dist[u]) continue; // устаревшая запись\n\n    for (const [v, w] of graph[u]) {\n      const newDist = dist[u] + w;\n      if (newDist < dist[v]) {\n        dist[v] = newDist;\n        heap.push([newDist, v]);\n      }\n    }\n  }\n\n  return dist;\n}\n\n// Сложность: O((V + E) * log V) с binary heap'
        },
        {
          type: 'note',
          value: 'Дейкстра НЕ работает с отрицательными весами! Для графов с отрицательными весами используйте Bellman-Ford. Для невзвешенных графов достаточно BFS.'
        }
      ]
    },
    {
      id: 2,
      title: 'Union-Find (Disjoint Set Union)',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Структура для объединения множеств'
        },
        {
          type: 'text',
          value: 'Union-Find (DSU) поддерживает две операции: find(x) — найти "представителя" множества x, и union(x, y) — объединить множества. С оптимизациями: O(α(n)) ≈ O(1) на операцию.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'class UnionFind {\n  constructor(n) {\n    this.parent = Array.from({length: n}, (_, i) => i);\n    this.rank = new Array(n).fill(0);\n    this.count = n; // количество компонент\n  }\n\n  find(x) {\n    if (this.parent[x] !== x) {\n      this.parent[x] = this.find(this.parent[x]); // path compression\n    }\n    return this.parent[x];\n  }\n\n  union(x, y) {\n    const px = this.find(x), py = this.find(y);\n    if (px === py) return false; // уже в одном множестве\n\n    // union by rank\n    if (this.rank[px] < this.rank[py]) this.parent[px] = py;\n    else if (this.rank[px] > this.rank[py]) this.parent[py] = px;\n    else { this.parent[py] = px; this.rank[px]++; }\n\n    this.count--;\n    return true;\n  }\n\n  connected(x, y) {\n    return this.find(x) === this.find(y);\n  }\n}'
        },
        {
          type: 'heading',
          value: 'Когда использовать Union-Find'
        },
        {
          type: 'list',
          value: [
            'Connected components (подсчёт компонент)',
            'Обнаружение цикла в неориентированном графе',
            'MST (Minimum Spanning Tree) — алгоритм Краскала',
            'Динамическое объединение множеств'
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Network Delay Time',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #743: определите время, за которое сигнал дойдёт до всех узлов сети.',
      requirements: [
        'Реализуйте функцию networkDelayTime(times, n, k)',
        'times[i] = [ui, vi, wi] — ребро из ui в vi с весом wi',
        'Сигнал отправляется из узла k',
        'Верните минимальное время, чтобы все узлы получили сигнал, или -1'
      ],
      hint: 'Алгоритм Дейкстры от узла k. Ответ = максимальное расстояние среди всех узлов.',
      expectedOutput: 'networkDelayTime([[2,1,1],[2,3,1],[3,4,1]], 4, 2) -> 2\nnetworkDelayTime([[1,2,1]], 2, 2) -> -1',
      solution: 'function networkDelayTime(times, n, k) {\n  // Строим граф\n  const graph = Array.from({length: n + 1}, () => []);\n  for (const [u, v, w] of times) {\n    graph[u].push([v, w]);\n  }\n\n  // Дейкстра\n  const dist = new Array(n + 1).fill(Infinity);\n  dist[k] = 0;\n  const heap = [[0, k]]; // [расстояние, узел]\n\n  while (heap.length) {\n    // Простая реализация: сортируем массив\n    heap.sort((a, b) => a[0] - b[0]);\n    const [d, u] = heap.shift();\n\n    if (d > dist[u]) continue;\n\n    for (const [v, w] of graph[u]) {\n      if (dist[u] + w < dist[v]) {\n        dist[v] = dist[u] + w;\n        heap.push([dist[v], v]);\n      }\n    }\n  }\n\n  let maxDist = 0;\n  for (let i = 1; i <= n; i++) {\n    if (dist[i] === Infinity) return -1;\n    maxDist = Math.max(maxDist, dist[i]);\n  }\n\n  return maxDist;\n}\n\nconsole.log(networkDelayTime([[2,1,1],[2,3,1],[3,4,1]], 4, 2)); // 2\nconsole.log(networkDelayTime([[1,2,1]], 2, 2)); // -1',
      explanation: 'Классическое применение Дейкстры. Запускаем от узла k, находим кратчайшие расстояния до всех узлов. Если какой-то узел недостижим (dist = Infinity) — return -1. Иначе ответ = max(dist). На настоящем собеседовании используйте правильный min-heap для O((V+E)logV).'
    },
    {
      id: 4,
      title: 'Практика: Course Schedule II (Topological Sort)',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #210: верните порядок прохождения курсов (топологическая сортировка).',
      requirements: [
        'Реализуйте функцию findOrder(numCourses, prerequisites)',
        'Верните порядок прохождения всех курсов',
        'Если невозможно (цикл) — верните пустой массив',
        'Используйте BFS (алгоритм Кана) или DFS'
      ],
      hint: 'Алгоритм Кана: начните с вершин с indegree=0. Удаляйте их, уменьшая indegree соседей. Повторяйте.',
      expectedOutput: 'findOrder(4, [[1,0],[2,0],[3,1],[3,2]]) -> [0,1,2,3] или [0,2,1,3]\nfindOrder(2, [[1,0],[0,1]]) -> []',
      solution: '// BFS — алгоритм Кана\nfunction findOrder(numCourses, prerequisites) {\n  const graph = Array.from({length: numCourses}, () => []);\n  const indegree = new Array(numCourses).fill(0);\n\n  for (const [a, b] of prerequisites) {\n    graph[b].push(a);\n    indegree[a]++;\n  }\n\n  // Начинаем с вершин без зависимостей\n  const queue = [];\n  for (let i = 0; i < numCourses; i++) {\n    if (indegree[i] === 0) queue.push(i);\n  }\n\n  const order = [];\n\n  while (queue.length) {\n    const node = queue.shift();\n    order.push(node);\n\n    for (const next of graph[node]) {\n      indegree[next]--;\n      if (indegree[next] === 0) {\n        queue.push(next);\n      }\n    }\n  }\n\n  return order.length === numCourses ? order : [];\n}\n\nconsole.log(findOrder(4, [[1,0],[2,0],[3,1],[3,2]])); // [0,1,2,3]\nconsole.log(findOrder(2, [[1,0],[0,1]])); // [] (цикл)',
      explanation: 'Алгоритм Кана (BFS topological sort): 1) вычисляем indegree каждой вершины, 2) добавляем в очередь все с indegree=0, 3) обрабатываем очередь, уменьшая indegree соседей. Если обработали все вершины — порядок найден, иначе есть цикл. O(V + E).'
    },
    {
      id: 5,
      title: 'Практика: Number of Connected Components',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #323: подсчитайте количество связных компонент в неориентированном графе.',
      requirements: [
        'Реализуйте функцию countComponents(n, edges)',
        'n вершин (0 до n-1), edges — рёбра',
        'Подсчитайте количество связных компонент',
        'Решите с Union-Find и с DFS'
      ],
      hint: 'Union-Find: начинаем с n компонент, каждый union уменьшает на 1. DFS: запускаем DFS из каждой непосещённой вершины.',
      expectedOutput: 'countComponents(5, [[0,1],[1,2],[3,4]]) -> 2\ncountComponents(5, [[0,1],[1,2],[2,3],[3,4]]) -> 1',
      solution: '// Union-Find\nfunction countComponents(n, edges) {\n  const uf = new UnionFind(n);\n  for (const [u, v] of edges) {\n    uf.union(u, v);\n  }\n  return uf.count;\n}\n\n// DFS\nfunction countComponentsDFS(n, edges) {\n  const graph = Array.from({length: n}, () => []);\n  for (const [u, v] of edges) {\n    graph[u].push(v);\n    graph[v].push(u);\n  }\n\n  const visited = new Set();\n  let components = 0;\n\n  function dfs(node) {\n    visited.add(node);\n    for (const neighbor of graph[node]) {\n      if (!visited.has(neighbor)) dfs(neighbor);\n    }\n  }\n\n  for (let i = 0; i < n; i++) {\n    if (!visited.has(i)) {\n      dfs(i);\n      components++;\n    }\n  }\n\n  return components;\n}\n\nconsole.log(countComponents(5, [[0,1],[1,2],[3,4]])); // 2\nconsole.log(countComponents(5, [[0,1],[1,2],[2,3],[3,4]])); // 1',
      explanation: 'Union-Find: инициализируем n компонент, каждый успешный union уменьшает count на 1. В конце count = количество компонент. DFS: каждый запуск DFS из непосещённой вершины исследует одну компоненту. Оба решения O(V + E). Union-Find особенно полезен, когда рёбра добавляются динамически.'
    },
    {
      id: 6,
      title: 'Практика: Redundant Connection',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #684: найдите ребро, удаление которого делает граф деревом.',
      requirements: [
        'Реализуйте функцию findRedundantConnection(edges)',
        'Граф изначально был деревом, к нему добавлено одно лишнее ребро',
        'Верните это ребро (последнее из кандидатов)',
        'Используйте Union-Find'
      ],
      hint: 'Добавляйте рёбра одно за другим с Union-Find. Первое ребро, которое соединяет уже связные вершины — ответ.',
      expectedOutput: 'findRedundantConnection([[1,2],[1,3],[2,3]]) -> [2,3]\nfindRedundantConnection([[1,2],[2,3],[3,4],[1,4],[1,5]]) -> [1,4]',
      solution: 'function findRedundantConnection(edges) {\n  const n = edges.length;\n  const uf = new UnionFind(n + 1); // вершины 1..n\n\n  for (const [u, v] of edges) {\n    if (!uf.union(u, v)) {\n      return [u, v]; // уже связаны — это лишнее ребро\n    }\n  }\n\n  return [];\n}\n\nconsole.log(findRedundantConnection([[1,2],[1,3],[2,3]])); // [2,3]\nconsole.log(findRedundantConnection([[1,2],[2,3],[3,4],[1,4],[1,5]])); // [1,4]',
      explanation: 'Классическое применение Union-Find для обнаружения цикла. Добавляем рёбра последовательно. Если union(u, v) возвращает false — вершины u и v уже в одной компоненте, значит добавление этого ребра создаёт цикл. Это и есть лишнее ребро. O(n * α(n)) ≈ O(n).'
    },
    {
      id: 7,
      title: 'Практика: Cheapest Flights Within K Stops',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #787: найдите самый дешёвый перелёт с ограничением на количество пересадок.',
      requirements: [
        'Реализуйте функцию findCheapestPrice(n, flights, src, dst, k)',
        'flights[i] = [from, to, price]',
        'Найдите самый дешёвый перелёт из src в dst с максимум k пересадками',
        'Верните цену или -1 если невозможно'
      ],
      hint: 'Модифицированный BFS (Bellman-Ford): на каждом шаге (пересадке) обновляйте расстояния. Максимум k+1 шагов.',
      expectedOutput: 'findCheapestPrice(4, [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], 0, 3, 1) -> 700',
      solution: 'function findCheapestPrice(n, flights, src, dst, k) {\n  // Bellman-Ford: k+1 итераций\n  let prices = new Array(n).fill(Infinity);\n  prices[src] = 0;\n\n  for (let i = 0; i <= k; i++) {\n    const newPrices = [...prices]; // копия!\n\n    for (const [from, to, price] of flights) {\n      if (prices[from] === Infinity) continue;\n      newPrices[to] = Math.min(newPrices[to], prices[from] + price);\n    }\n\n    prices = newPrices;\n  }\n\n  return prices[dst] === Infinity ? -1 : prices[dst];\n}\n\nconsole.log(findCheapestPrice(\n  4,\n  [[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]],\n  0, 3, 1\n)); // 700\n// 0→1→3: 100+600=700 (1 пересадка)\n// 0→1→2→3: 100+100+200=400, но 2 пересадки > k=1',
      explanation: 'Bellman-Ford с ограничением: вместо n-1 итераций делаем k+1. Ключевой момент: используем копию массива расстояний на каждой итерации, чтобы не использовать расстояния, обновлённые на текущем шаге (это привело бы к "лишним" пересадкам). O(k * E).'
    }
  ]
}
