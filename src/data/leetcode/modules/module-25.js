export default {
  id: 25,
  title: 'Mock Interview: комплексные задачи',
  description: 'Разбор комплексных задач уровня real interview rounds. Комбинация нескольких паттернов.',
  lessons: [
    {
      id: 1,
      title: 'Как проходить mock interview',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Чек-лист для mock interview'
        },
        {
          type: 'text',
          value: 'Mock interview — лучший способ подготовки. Засеките таймер на 45 минут и решите 2 задачи. Используйте следующий чек-лист:'
        },
        {
          type: 'list',
          value: [
            '0-2 мин: Прочитайте задачу. Перескажите условие своими словами.',
            '2-5 мин: Задайте уточняющие вопросы. Разберите 2-3 примера.',
            '5-8 мин: Опишите brute force. Оцените сложность.',
            '8-12 мин: Предложите оптимальное решение. Объясните подход.',
            '12-25 мин: Напишите код. Думайте вслух.',
            '25-30 мин: Проверьте на примерах. Обсудите edge cases.',
            '30-35 мин: Оцените сложность (время + память).',
            '35-45 мин: Обсудите альтернативные подходы и trade-offs.'
          ]
        },
        {
          type: 'heading',
          value: 'Типичные ошибки'
        },
        {
          type: 'list',
          value: [
            'Начинать кодировать без плана',
            'Молчать — интервьюер не видит ваш процесс мышления',
            'Застрять на brute force — предложите его, затем оптимизируйте',
            'Не тестировать код — всегда проверяйте на примере',
            'Игнорировать edge cases — пустой массив, один элемент, дубликаты'
          ]
        },
        {
          type: 'tip',
          value: 'Практикуйте с другом или используйте Pramp, Interviewing.io. Решение в одиночестве — не то же самое, что объяснение решения вслух.'
        }
      ]
    },
    {
      id: 2,
      title: 'Round 1: Массивы и строки',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Типичный первый раунд'
        },
        {
          type: 'text',
          value: 'Первый раунд обычно содержит задачи среднего уровня на массивы, строки, хеш-таблицы. Цель — проверить базовые навыки и коммуникацию.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Типичная задача: Product of Array Except Self (LeetCode #238)\n// Для каждого элемента: произведение всех остальных. Без деления!\nfunction productExceptSelf(nums) {\n  const n = nums.length;\n  const result = new Array(n).fill(1);\n\n  // Левые произведения\n  let leftProduct = 1;\n  for (let i = 0; i < n; i++) {\n    result[i] = leftProduct;\n    leftProduct *= nums[i];\n  }\n\n  // Правые произведения\n  let rightProduct = 1;\n  for (let i = n - 1; i >= 0; i--) {\n    result[i] *= rightProduct;\n    rightProduct *= nums[i];\n  }\n\n  return result;\n}\n\n// [1,2,3,4] → [24,12,8,6]\n// Левые: [1, 1, 2, 6]\n// Правые: [24, 12, 4, 1]\n// Результат: [1*24, 1*12, 2*4, 6*1] = [24, 12, 8, 6]'
        },
        {
          type: 'note',
          value: 'Ключевой инсайт: result[i] = произведение всех слева * произведение всех справа. Два прохода: слева направо (накапливаем левое произведение), справа налево (накапливаем правое). O(n) время, O(1) доп. память.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Alien Dictionary',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #269: определите порядок букв в инопланетном алфавите по отсортированному словарю.',
      requirements: [
        'Реализуйте функцию alienOrder(words)',
        'words отсортирован в инопланетном порядке',
        'Определите порядок букв алфавита',
        'Верните строку с буквами в правильном порядке или "" если невозможно',
        'Используйте топологическую сортировку'
      ],
      hint: 'Сравните соседние слова: первое различие определяет порядок двух букв. Постройте граф зависимостей и выполните topological sort.',
      expectedOutput: 'alienOrder(["wrt","wrf","er","ett","rftt"]) -> "wertf"\nalienOrder(["z","x"]) -> "zx"\nalienOrder(["z","x","z"]) -> ""',
      solution: 'function alienOrder(words) {\n  // Граф зависимостей\n  const graph = new Map();\n  const indegree = new Map();\n\n  // Инициализация: все уникальные буквы\n  for (const word of words) {\n    for (const ch of word) {\n      if (!graph.has(ch)) graph.set(ch, new Set());\n      if (!indegree.has(ch)) indegree.set(ch, 0);\n    }\n  }\n\n  // Сравниваем соседние слова\n  for (let i = 0; i < words.length - 1; i++) {\n    const w1 = words[i], w2 = words[i + 1];\n    // Edge case: "abc" перед "ab" — невалидно\n    if (w1.length > w2.length && w1.startsWith(w2)) return "";\n\n    for (let j = 0; j < Math.min(w1.length, w2.length); j++) {\n      if (w1[j] !== w2[j]) {\n        if (!graph.get(w1[j]).has(w2[j])) {\n          graph.get(w1[j]).add(w2[j]);\n          indegree.set(w2[j], indegree.get(w2[j]) + 1);\n        }\n        break; // только первое различие!\n      }\n    }\n  }\n\n  // Topological Sort (BFS — алгоритм Кана)\n  const queue = [];\n  for (const [ch, deg] of indegree) {\n    if (deg === 0) queue.push(ch);\n  }\n\n  let result = "";\n  while (queue.length) {\n    const ch = queue.shift();\n    result += ch;\n    for (const next of graph.get(ch)) {\n      indegree.set(next, indegree.get(next) - 1);\n      if (indegree.get(next) === 0) queue.push(next);\n    }\n  }\n\n  return result.length === graph.size ? result : "";\n}\n\nconsole.log(alienOrder(["wrt","wrf","er","ett","rftt"])); // "wertf"\nconsole.log(alienOrder(["z","x"])); // "zx"\nconsole.log(alienOrder(["z","x","z"])); // "" (цикл)',
      explanation: 'Комплексная задача: Graph + Topological Sort. 1) Сравниваем пары соседних слов — первое различие даёт ребро в графе. 2) Topological sort определяет порядок. Edge case: "abc" перед "ab" — невалидно (более длинное слово не может быть первым при совпадении префикса). O(C) где C = сумма длин слов.'
    },
    {
      id: 4,
      title: 'Практика: Median of Two Sorted Arrays',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #4: найдите медиану двух отсортированных массивов за O(log(m+n)).',
      requirements: [
        'Реализуйте функцию findMedianSortedArrays(nums1, nums2)',
        'Оба массива отсортированы',
        'Решение должно быть O(log(min(m,n)))',
        'Используйте бинарный поиск по разделителю'
      ],
      hint: 'Бинарный поиск по количеству элементов из первого массива в "левой половине". Нужно найти правильный разрез.',
      expectedOutput: 'findMedianSortedArrays([1,3], [2]) -> 2.0\nfindMedianSortedArrays([1,2], [3,4]) -> 2.5',
      solution: 'function findMedianSortedArrays(nums1, nums2) {\n  // Бинарный поиск по меньшему массиву\n  if (nums1.length > nums2.length) {\n    [nums1, nums2] = [nums2, nums1];\n  }\n\n  const m = nums1.length, n = nums2.length;\n  const half = Math.floor((m + n + 1) / 2);\n  let lo = 0, hi = m;\n\n  while (lo <= hi) {\n    const i = Math.floor((lo + hi) / 2); // элементов из nums1 в левой\n    const j = half - i;                    // элементов из nums2 в левой\n\n    const left1 = i > 0 ? nums1[i - 1] : -Infinity;\n    const left2 = j > 0 ? nums2[j - 1] : -Infinity;\n    const right1 = i < m ? nums1[i] : Infinity;\n    const right2 = j < n ? nums2[j] : Infinity;\n\n    if (left1 <= right2 && left2 <= right1) {\n      // Правильный разрез!\n      if ((m + n) % 2 === 1) {\n        return Math.max(left1, left2);\n      }\n      return (Math.max(left1, left2) + Math.min(right1, right2)) / 2;\n    } else if (left1 > right2) {\n      hi = i - 1; // слишком много из nums1\n    } else {\n      lo = i + 1; // слишком мало из nums1\n    }\n  }\n}\n\nconsole.log(findMedianSortedArrays([1,3], [2])); // 2.0\nconsole.log(findMedianSortedArrays([1,2], [3,4])); // 2.5',
      explanation: 'Одна из самых сложных задач на LeetCode. Идея: бинарный поиск по количеству элементов из nums1 в "левой половине". Правильный разрез: max(left) <= min(right). Используем -Infinity и Infinity для граничных случаев. O(log(min(m,n))).'
    },
    {
      id: 5,
      title: 'Практика: Serialize and Deserialize Binary Tree',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #297: сериализуйте и десериализуйте бинарное дерево (не BST).',
      requirements: [
        'Реализуйте serialize(root) и deserialize(data)',
        'Дерево может быть любым (не обязательно BST)',
        'Формат сериализации — на ваш выбор',
        'Используйте preorder с null-маркерами'
      ],
      hint: 'Preorder обход: при null записываем маркер "#". При десериализации рекурсивно строим дерево, читая из очереди.',
      expectedOutput: 'serialize([1,2,3,null,null,4,5]) -> "1,2,#,#,3,4,#,#,5,#,#"\ndeserialize("1,2,#,#,3,4,#,#,5,#,#") -> [1,2,3,null,null,4,5]',
      solution: 'function serialize(root) {\n  const result = [];\n\n  function preorder(node) {\n    if (!node) {\n      result.push("#");\n      return;\n    }\n    result.push(String(node.val));\n    preorder(node.left);\n    preorder(node.right);\n  }\n\n  preorder(root);\n  return result.join(",");\n}\n\nfunction deserialize(data) {\n  const values = data.split(",");\n  let index = 0;\n\n  function build() {\n    if (index >= values.length || values[index] === "#") {\n      index++;\n      return null;\n    }\n\n    const node = new TreeNode(parseInt(values[index]));\n    index++;\n    node.left = build();\n    node.right = build();\n    return node;\n  }\n\n  return build();\n}\n\n// Тест\nconst root = new TreeNode(1,\n  new TreeNode(2),\n  new TreeNode(3, new TreeNode(4), new TreeNode(5))\n);\n\nconst s = serialize(root);\nconsole.log(s); // "1,2,#,#,3,4,#,#,5,#,#"\n\nconst tree = deserialize(s);\nconsole.log(serialize(tree)); // тот же результат',
      explanation: 'Preorder + null-маркеры однозначно определяют структуру дерева. Serialize: preorder обход, null записываем как "#". Deserialize: рекурсивно читаем значения из массива — если "#" → null, иначе создаём узел и строим left/right. index продвигается автоматически.'
    },
    {
      id: 6,
      title: 'Практика: Longest Increasing Path in a Matrix',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #329: найдите длину наибольшего строго возрастающего пути в матрице.',
      requirements: [
        'Реализуйте функцию longestIncreasingPath(matrix)',
        'Двигаться можно в 4 направлениях',
        'Каждый шаг должен увеличивать значение',
        'DFS + Memoization'
      ],
      hint: 'DFS с мемоизацией: memo[r][c] = длина максимального пути из (r,c). Не нужен visited — путь строго возрастающий, циклов нет.',
      expectedOutput: 'longestIncreasingPath([[9,9,4],[6,6,8],[2,1,1]]) -> 4\nlongestIncreasingPath([[3,4,5],[3,2,6],[2,2,1]]) -> 4',
      solution: 'function longestIncreasingPath(matrix) {\n  const m = matrix.length, n = matrix[0].length;\n  const memo = Array.from({length: m}, () => Array(n).fill(0));\n  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];\n\n  function dfs(r, c) {\n    if (memo[r][c] !== 0) return memo[r][c];\n\n    let maxPath = 1;\n\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n &&\n          matrix[nr][nc] > matrix[r][c]) {\n        maxPath = Math.max(maxPath, 1 + dfs(nr, nc));\n      }\n    }\n\n    memo[r][c] = maxPath;\n    return maxPath;\n  }\n\n  let result = 0;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      result = Math.max(result, dfs(r, c));\n    }\n  }\n\n  return result;\n}\n\nconsole.log(longestIncreasingPath([[9,9,4],[6,6,8],[2,1,1]])); // 4\n// Путь: 1 → 2 → 6 → 9\n\nconsole.log(longestIncreasingPath([[3,4,5],[3,2,6],[2,2,1]])); // 4\n// Путь: 1 → 2 → 3 → 4',
      explanation: 'DFS + Memoization: memo[r][c] кэширует длину максимального пути из (r,c). Не нужен visited, потому что путь строго возрастающий — невозможно вернуться. Каждая клетка вычисляется один раз, суммарно O(m*n). Это топологический порядок "по значению".'
    },
    {
      id: 7,
      title: 'Практика: Trapping Rain Water II (3D)',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #407: вычислите объём воды на 2D карте высот (обобщение Trapping Rain Water на 2D).',
      requirements: [
        'Реализуйте функцию trapRainWater(heightMap)',
        'heightMap[i][j] — высота в точке (i,j)',
        'Вычислите объём дождевой воды, которая может задержаться',
        'BFS + Min-Heap от границ внутрь'
      ],
      hint: 'Начните с границ матрицы в min-heap. На каждом шаге извлекайте минимальную высоту и обрабатывайте соседей. Вода = max(0, currentMin - neighbor.height).',
      expectedOutput: 'trapRainWater([[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]]) -> 4',
      solution: 'function trapRainWater(heightMap) {\n  const m = heightMap.length, n = heightMap[0].length;\n  if (m < 3 || n < 3) return 0;\n\n  const visited = Array.from({length: m}, () => Array(n).fill(false));\n  // Min-heap: [height, row, col]\n  const heap = []; // упрощённо используем массив + sort\n\n  // Добавляем границы\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (r === 0 || r === m-1 || c === 0 || c === n-1) {\n        heap.push([heightMap[r][c], r, c]);\n        visited[r][c] = true;\n      }\n    }\n  }\n  heap.sort((a, b) => a[0] - b[0]);\n\n  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];\n  let water = 0;\n\n  while (heap.length) {\n    heap.sort((a, b) => a[0] - b[0]);\n    const [h, r, c] = heap.shift();\n\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {\n        visited[nr][nc] = true;\n        // Вода = max(0, текущий уровень - высота соседа)\n        water += Math.max(0, h - heightMap[nr][nc]);\n        // Добавляем в кучу с max(h, соседская высота)\n        heap.push([Math.max(h, heightMap[nr][nc]), nr, nc]);\n      }\n    }\n  }\n\n  return water;\n}\n\nconsole.log(trapRainWater([\n  [1,4,3,1,3,2],\n  [3,2,1,3,2,4],\n  [2,3,3,2,3,1]\n])); // 4',
      explanation: 'Обобщение Trapping Rain Water на 2D. Идея: вода "стекает" через самую низкую точку границы. Используем min-heap с границами, на каждом шаге обрабатываем самую низкую точку. Для соседей: вода = max(0, currentLevel - neighborHeight). Добавляем соседа в heap с max(currentLevel, neighborHeight). O(m*n*log(m*n)).'
    }
  ]
}
