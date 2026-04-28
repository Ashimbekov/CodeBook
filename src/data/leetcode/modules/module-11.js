export default {
  id: 11,
  title: 'Графы: BFS и DFS',
  description: 'Обход графов: BFS, DFS, connected components, задача об островах, bipartite.',
  lessons: [
    {
      id: 1,
      title: 'Представление графов и обходы',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Графы на собеседованиях'
        },
        {
          type: 'text',
          value: 'Графы — одна из самых сложных тем на собеседованиях. Ключевое: уметь представить граф (adjacency list), обойти его (BFS/DFS) и распознать задачу как графовую.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Представление графа: список смежности\n// Из массива рёбер\nfunction buildGraph(n, edges) {\n  const graph = Array.from({length: n}, () => []);\n  for (const [u, v] of edges) {\n    graph[u].push(v);\n    graph[v].push(u); // для неориентированного\n  }\n  return graph;\n}\n\n// DFS — рекурсивный\nfunction dfs(graph, node, visited) {\n  visited.add(node);\n  for (const neighbor of graph[node]) {\n    if (!visited.has(neighbor)) {\n      dfs(graph, neighbor, visited);\n    }\n  }\n}\n\n// BFS — итеративный\nfunction bfs(graph, start) {\n  const visited = new Set([start]);\n  const queue = [start];\n  while (queue.length) {\n    const node = queue.shift();\n    for (const neighbor of graph[node]) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n  return visited;\n}'
        },
        {
          type: 'heading',
          value: 'BFS vs DFS'
        },
        {
          type: 'list',
          value: [
            'BFS: кратчайший путь в невзвешенном графе, обход по уровням',
            'DFS: поиск путей, обнаружение циклов, топологическая сортировка',
            'Оба: connected components, достижимость'
          ]
        },
        {
          type: 'tip',
          value: 'Матрица (grid) — это тоже граф! Каждая клетка — узел, соседи — клетки сверху/снизу/слева/справа.'
        }
      ]
    },
    {
      id: 2,
      title: 'Графы на матрицах (Grid)',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Обход матрицы как графа'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Шаблон DFS на матрице\nconst directions = [[0,1],[0,-1],[1,0],[-1,0]]; // вправо, влево, вниз, вверх\n\nfunction dfsGrid(grid, row, col, visited) {\n  const m = grid.length, n = grid[0].length;\n\n  if (row < 0 || row >= m || col < 0 || col >= n) return; // за границей\n  if (visited[row][col]) return; // уже посещена\n  if (grid[row][col] === 0) return; // условие (например, вода)\n\n  visited[row][col] = true;\n\n  for (const [dr, dc] of directions) {\n    dfsGrid(grid, row + dr, col + dc, visited);\n  }\n}\n\n// Шаблон BFS на матрице\nfunction bfsGrid(grid, startRow, startCol) {\n  const m = grid.length, n = grid[0].length;\n  const queue = [[startRow, startCol]];\n  const visited = Array.from({length: m}, () => Array(n).fill(false));\n  visited[startRow][startCol] = true;\n  let dist = 0;\n\n  while (queue.length) {\n    const size = queue.length;\n    for (let i = 0; i < size; i++) {\n      const [r, c] = queue.shift();\n      for (const [dr, dc] of directions) {\n        const nr = r + dr, nc = c + dc;\n        if (nr >= 0 && nr < m && nc >= 0 && nc < n &&\n            !visited[nr][nc] && grid[nr][nc] === 1) {\n          visited[nr][nc] = true;\n          queue.push([nr, nc]);\n        }\n      }\n    }\n    dist++;\n  }\n  return dist;\n}'
        },
        {
          type: 'note',
          value: 'Вместо отдельного массива visited можно модифицировать саму матрицу (например, менять 1 на 0), но спросите интервьюера, можно ли менять входные данные.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Number of Islands',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #200: подсчитайте количество островов в матрице.',
      requirements: [
        'Реализуйте функцию numIslands(grid)',
        'grid[i][j] = "1" (земля) или "0" (вода)',
        'Остров — группа смежных (по горизонтали/вертикали) клеток "1"',
        'Подсчитайте количество островов'
      ],
      hint: 'Для каждой непосещённой клетки "1" запускайте DFS/BFS, помечая все связанные клетки "1" как посещённые. Каждый запуск = один остров.',
      expectedOutput: 'numIslands([["1","1","0"],["1","1","0"],["0","0","1"]]) -> 2',
      solution: 'function numIslands(grid) {\n  if (!grid.length) return 0;\n  const m = grid.length, n = grid[0].length;\n  let islands = 0;\n\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] === "0") return;\n    grid[r][c] = "0"; // помечаем как посещённую\n    dfs(r + 1, c);\n    dfs(r - 1, c);\n    dfs(r, c + 1);\n    dfs(r, c - 1);\n  }\n\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === "1") {\n        islands++;\n        dfs(r, c); // "затопить" весь остров\n      }\n    }\n  }\n\n  return islands;\n}\n\nconsole.log(numIslands([\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n])); // 3',
      explanation: 'Классическая задача на DFS/BFS по матрице. Для каждой непосещённой "1" запускаем DFS, который "затопляет" весь остров (меняет "1" на "0"). Каждый такой запуск = один остров. Сложность: O(m*n) — каждая клетка посещается один раз.'
    },
    {
      id: 4,
      title: 'Практика: Clone Graph',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #133: создайте глубокую копию неориентированного графа.',
      requirements: [
        'Реализуйте функцию cloneGraph(node)',
        'Каждый узел имеет val и neighbors',
        'Создайте полную копию графа',
        'Используйте HashMap для отслеживания уже скопированных узлов'
      ],
      hint: 'DFS/BFS + HashMap (oldNode → newNode). При посещении узла создаём его копию, затем рекурсивно копируем соседей.',
      expectedOutput: 'cloneGraph(node) -> deep copy of the graph',
      solution: 'function cloneGraph(node) {\n  if (!node) return null;\n\n  const map = new Map(); // old node → new node\n\n  function dfs(original) {\n    if (map.has(original)) return map.get(original);\n\n    const copy = new Node(original.val);\n    map.set(original, copy);\n\n    for (const neighbor of original.neighbors) {\n      copy.neighbors.push(dfs(neighbor));\n    }\n\n    return copy;\n  }\n\n  return dfs(node);\n}\n\n// BFS версия\nfunction cloneGraphBFS(node) {\n  if (!node) return null;\n\n  const map = new Map();\n  map.set(node, new Node(node.val));\n  const queue = [node];\n\n  while (queue.length) {\n    const curr = queue.shift();\n    for (const neighbor of curr.neighbors) {\n      if (!map.has(neighbor)) {\n        map.set(neighbor, new Node(neighbor.val));\n        queue.push(neighbor);\n      }\n      map.get(curr).neighbors.push(map.get(neighbor));\n    }\n  }\n\n  return map.get(node);\n}',
      explanation: 'HashMap (old → new) предотвращает бесконечную рекурсию и повторное копирование. DFS: при первом посещении создаём копию и рекурсивно обрабатываем соседей. При повторном — возвращаем уже созданную копию из map. Сложность: O(V + E).'
    },
    {
      id: 5,
      title: 'Практика: Pacific Atlantic Water Flow',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #417: найдите клетки, из которых вода может стечь в оба океана.',
      requirements: [
        'Реализуйте функцию pacificAtlantic(heights)',
        'Тихий океан: верхняя и левая граница',
        'Атлантический: нижняя и правая граница',
        'Вода течёт в клетку с высотой ≤ текущей',
        'Найдите клетки, из которых вода достигает обоих океанов'
      ],
      hint: 'Обратный подход: запустите DFS/BFS от каждого океана вглубь (вверх по высоте). Найдите пересечение множеств клеток.',
      expectedOutput: 'pacificAtlantic([[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]) -> [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]',
      solution: 'function pacificAtlantic(heights) {\n  const m = heights.length, n = heights[0].length;\n  const pacific = Array.from({length: m}, () => Array(n).fill(false));\n  const atlantic = Array.from({length: m}, () => Array(n).fill(false));\n\n  function dfs(r, c, visited, prevHeight) {\n    if (r < 0 || r >= m || c < 0 || c >= n) return;\n    if (visited[r][c] || heights[r][c] < prevHeight) return;\n\n    visited[r][c] = true;\n    dfs(r + 1, c, visited, heights[r][c]);\n    dfs(r - 1, c, visited, heights[r][c]);\n    dfs(r, c + 1, visited, heights[r][c]);\n    dfs(r, c - 1, visited, heights[r][c]);\n  }\n\n  // DFS от Pacific (верх и лево)\n  for (let c = 0; c < n; c++) dfs(0, c, pacific, 0);\n  for (let r = 0; r < m; r++) dfs(r, 0, pacific, 0);\n\n  // DFS от Atlantic (низ и право)\n  for (let c = 0; c < n; c++) dfs(m - 1, c, atlantic, 0);\n  for (let r = 0; r < m; r++) dfs(r, n - 1, atlantic, 0);\n\n  // Пересечение\n  const result = [];\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (pacific[r][c] && atlantic[r][c]) {\n        result.push([r, c]);\n      }\n    }\n  }\n  return result;\n}',
      explanation: 'Обратный подход: вместо DFS из каждой клетки (O(m*n*(m*n))), запускаем DFS от границ океанов вглубь. Вода "течёт вверх" — в клетки с высотой >= текущей. Пересечение двух множеств достижимых клеток = ответ. Сложность: O(m*n).'
    },
    {
      id: 6,
      title: 'Практика: Rotting Oranges',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #994: определите, через сколько минут все апельсины сгниют.',
      requirements: [
        'Реализуйте функцию orangesRotting(grid)',
        '0 = пусто, 1 = свежий, 2 = гнилой',
        'Каждую минуту гнилые апельсины заражают соседей',
        'Верните минимальное время или -1 если невозможно'
      ],
      hint: 'Multi-source BFS: начните со всех гнилых апельсинов одновременно. Подсчитывайте уровни BFS = минуты.',
      expectedOutput: 'orangesRotting([[2,1,1],[1,1,0],[0,1,1]]) -> 4\norangesRotting([[2,1,1],[0,1,1],[1,0,1]]) -> -1\norangesRotting([[0,2]]) -> 0',
      solution: 'function orangesRotting(grid) {\n  const m = grid.length, n = grid[0].length;\n  const queue = [];\n  let fresh = 0;\n\n  // Находим все гнилые и считаем свежие\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === 2) queue.push([r, c]);\n      if (grid[r][c] === 1) fresh++;\n    }\n  }\n\n  if (fresh === 0) return 0;\n\n  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];\n  let minutes = 0;\n\n  while (queue.length && fresh > 0) {\n    const size = queue.length;\n    for (let i = 0; i < size; i++) {\n      const [r, c] = queue.shift();\n      for (const [dr, dc] of dirs) {\n        const nr = r + dr, nc = c + dc;\n        if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {\n          grid[nr][nc] = 2;\n          fresh--;\n          queue.push([nr, nc]);\n        }\n      }\n    }\n    minutes++;\n  }\n\n  return fresh === 0 ? minutes : -1;\n}\n\nconsole.log(orangesRotting([[2,1,1],[1,1,0],[0,1,1]])); // 4\nconsole.log(orangesRotting([[2,1,1],[0,1,1],[1,0,1]])); // -1',
      explanation: 'Multi-source BFS: все гнилые апельсины — стартовые точки BFS. Каждый уровень BFS = одна минута. В конце проверяем: если остались свежие (fresh > 0) — невозможно (return -1). Это классический паттерн для задач "одновременное распространение".'
    },
    {
      id: 7,
      title: 'Практика: Course Schedule',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #207: определите, можно ли пройти все курсы (обнаружение цикла в ориентированном графе).',
      requirements: [
        'Реализуйте функцию canFinish(numCourses, prerequisites)',
        'prerequisites[i] = [ai, bi] означает: чтобы пройти ai, нужно сначала bi',
        'Верните true, если можно пройти все курсы',
        'По сути: есть ли цикл в ориентированном графе?'
      ],
      hint: 'DFS с тремя состояниями: не посещён, в процессе (серый), завершён (чёрный). Цикл = встретили серый узел.',
      expectedOutput: 'canFinish(2, [[1,0]]) -> true\ncanFinish(2, [[1,0],[0,1]]) -> false',
      solution: 'function canFinish(numCourses, prerequisites) {\n  const graph = Array.from({length: numCourses}, () => []);\n  for (const [a, b] of prerequisites) {\n    graph[b].push(a);\n  }\n\n  // 0 = не посещён, 1 = в процессе, 2 = завершён\n  const state = new Array(numCourses).fill(0);\n\n  function hasCycle(node) {\n    if (state[node] === 1) return true;  // цикл!\n    if (state[node] === 2) return false; // уже проверен\n\n    state[node] = 1; // в процессе\n\n    for (const next of graph[node]) {\n      if (hasCycle(next)) return true;\n    }\n\n    state[node] = 2; // завершён\n    return false;\n  }\n\n  for (let i = 0; i < numCourses; i++) {\n    if (hasCycle(i)) return false;\n  }\n\n  return true;\n}\n\nconsole.log(canFinish(2, [[1,0]])); // true\nconsole.log(canFinish(2, [[1,0],[0,1]])); // false (цикл)',
      explanation: 'Обнаружение цикла в ориентированном графе через DFS с тремя цветами: белый (не посещён), серый (в процессе обработки), чёрный (завершён). Если при DFS встречаем серый узел — это цикл. Альтернатива: BFS с Kahn\'s algorithm (топологическая сортировка). O(V + E).'
    }
  ]
}
