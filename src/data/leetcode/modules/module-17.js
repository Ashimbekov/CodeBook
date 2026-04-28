export default {
  id: 17,
  title: 'Backtracking',
  description: 'Перебор с возвратом: перестановки, комбинации, N-Queens, Sudoku.',
  lessons: [
    {
      id: 1,
      title: 'Backtracking: шаблон и паттерны',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Что такое Backtracking?'
        },
        {
          type: 'text',
          value: 'Backtracking — метод перебора, при котором мы строим решение пошагово, откатываясь назад при обнаружении тупика. Это "умный" brute force с отсечением ненужных веток.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Шаблон Backtracking\nfunction backtrack(result, current, choices, start) {\n  // Базовый случай: решение найдено\n  if (/* решение полное */) {\n    result.push([...current]); // копия!\n    return;\n  }\n\n  for (let i = start; i < choices.length; i++) {\n    // Отсечение (pruning)\n    if (/* условие отсечения */) continue;\n\n    // Делаем выбор\n    current.push(choices[i]);\n\n    // Рекурсия\n    backtrack(result, current, choices, i + 1); // или i для повторений\n\n    // Откат (backtrack)\n    current.pop();\n  }\n}'
        },
        {
          type: 'heading',
          value: 'Три типа задач'
        },
        {
          type: 'list',
          value: [
            'Подмножества (Subsets): выбрать подмножество элементов',
            'Перестановки (Permutations): все порядки элементов',
            'Комбинации (Combinations): выбрать k из n, порядок не важен'
          ]
        },
        {
          type: 'tip',
          value: 'Ключевые отличия: Subsets — start = i+1, добавляем на каждом шаге. Permutations — без start, с visited. Combinations — start = i+1, добавляем при size === k.'
        }
      ]
    },
    {
      id: 2,
      title: 'Subsets и Combinations',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Генерация подмножеств и комбинаций'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Subsets (LeetCode #78)\nfunction subsets(nums) {\n  const result = [];\n  function backtrack(start, current) {\n    result.push([...current]);\n    for (let i = start; i < nums.length; i++) {\n      current.push(nums[i]);\n      backtrack(i + 1, current);\n      current.pop();\n    }\n  }\n  backtrack(0, []);\n  return result;\n}\n\n// Combinations (LeetCode #77)\nfunction combine(n, k) {\n  const result = [];\n  function backtrack(start, current) {\n    if (current.length === k) {\n      result.push([...current]);\n      return;\n    }\n    // Отсечение: нужно ещё (k - current.length) элементов\n    for (let i = start; i <= n - (k - current.length) + 1; i++) {\n      current.push(i);\n      backtrack(i + 1, current);\n      current.pop();\n    }\n  }\n  backtrack(1, []);\n  return result;\n}\n\n// Combination Sum (LeetCode #39)\nfunction combinationSum(candidates, target) {\n  const result = [];\n  function backtrack(start, current, remaining) {\n    if (remaining === 0) { result.push([...current]); return; }\n    if (remaining < 0) return;\n    for (let i = start; i < candidates.length; i++) {\n      current.push(candidates[i]);\n      backtrack(i, current, remaining - candidates[i]); // i, не i+1!\n      current.pop();\n    }\n  }\n  backtrack(0, [], target);\n  return result;\n}'
        },
        {
          type: 'note',
          value: 'Combination Sum: backtrack(i, ...) — начинаем с i, не i+1, потому что элемент можно использовать повторно. Для Combination Sum II (без повторов): используйте i+1 и пропускайте дубликаты.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Subsets',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #78: сгенерируйте все подмножества массива уникальных чисел.',
      requirements: [
        'Реализуйте функцию subsets(nums)',
        'Верните все возможные подмножества (power set)',
        'Результат не должен содержать дубликатов'
      ],
      hint: 'На каждом шаге рекурсии добавляем текущее подмножество в результат. Для каждого элемента: включить или не включить.',
      expectedOutput: 'subsets([1,2,3]) -> [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]',
      solution: 'function subsets(nums) {\n  const result = [];\n\n  function backtrack(start, current) {\n    result.push([...current]);\n\n    for (let i = start; i < nums.length; i++) {\n      current.push(nums[i]);\n      backtrack(i + 1, current);\n      current.pop();\n    }\n  }\n\n  backtrack(0, []);\n  return result;\n}\n\nconsole.log(subsets([1,2,3]));\n// [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]\n\n// Subsets II (LeetCode #90) — с дубликатами\nfunction subsetsWithDup(nums) {\n  nums.sort((a, b) => a - b);\n  const result = [];\n  function backtrack(start, current) {\n    result.push([...current]);\n    for (let i = start; i < nums.length; i++) {\n      if (i > start && nums[i] === nums[i-1]) continue; // пропуск дубликатов\n      current.push(nums[i]);\n      backtrack(i + 1, current);\n      current.pop();\n    }\n  }\n  backtrack(0, []);\n  return result;\n}',
      explanation: 'Backtracking генерирует дерево решений. На каждом уровне выбираем следующий элемент (от start до конца). Каждый узел дерева = подмножество, которое мы добавляем в результат. start гарантирует, что мы не используем элемент дважды и не генерируем дубликаты. 2^n подмножеств.'
    },
    {
      id: 4,
      title: 'Практика: Permutations',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #46: сгенерируйте все перестановки массива уникальных чисел.',
      requirements: [
        'Реализуйте функцию permute(nums)',
        'Верните все возможные перестановки',
        'Используйте backtracking с массивом visited'
      ],
      hint: 'В отличие от subsets, порядок важен. Используйте Set/массив для отслеживания использованных элементов.',
      expectedOutput: 'permute([1,2,3]) -> [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',
      solution: 'function permute(nums) {\n  const result = [];\n\n  function backtrack(current, used) {\n    if (current.length === nums.length) {\n      result.push([...current]);\n      return;\n    }\n\n    for (let i = 0; i < nums.length; i++) {\n      if (used[i]) continue;\n\n      current.push(nums[i]);\n      used[i] = true;\n\n      backtrack(current, used);\n\n      current.pop();\n      used[i] = false;\n    }\n  }\n\n  backtrack([], new Array(nums.length).fill(false));\n  return result;\n}\n\nconsole.log(permute([1,2,3]));\n// [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\n\n// Альтернатива: swap-based\nfunction permuteSwap(nums) {\n  const result = [];\n  function backtrack(start) {\n    if (start === nums.length) {\n      result.push([...nums]);\n      return;\n    }\n    for (let i = start; i < nums.length; i++) {\n      [nums[start], nums[i]] = [nums[i], nums[start]];\n      backtrack(start + 1);\n      [nums[start], nums[i]] = [nums[i], nums[start]];\n    }\n  }\n  backtrack(0);\n  return result;\n}',
      explanation: 'Перестановки: на каждом уровне можно выбрать любой неиспользованный элемент. Массив used отслеживает, какие элементы уже в текущей перестановке. Swap-based подход не требует дополнительной памяти: на каждом уровне меняем текущую позицию со всеми правее. n! перестановок.'
    },
    {
      id: 5,
      title: 'Практика: Combination Sum',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #39: найдите все комбинации чисел, сумма которых равна target.',
      requirements: [
        'Реализуйте функцию combinationSum(candidates, target)',
        'Каждое число можно использовать неограниченно',
        'Верните все уникальные комбинации',
        'Результат без дубликатов'
      ],
      hint: 'Backtracking с start=i (не i+1), чтобы разрешить повторное использование. Отсечение: если remaining < 0, откат.',
      expectedOutput: 'combinationSum([2,3,6,7], 7) -> [[2,2,3],[7]]\ncombinationSum([2,3,5], 8) -> [[2,2,2,2],[2,3,3],[3,5]]',
      solution: 'function combinationSum(candidates, target) {\n  const result = [];\n  candidates.sort((a, b) => a - b); // для отсечения\n\n  function backtrack(start, current, remaining) {\n    if (remaining === 0) {\n      result.push([...current]);\n      return;\n    }\n\n    for (let i = start; i < candidates.length; i++) {\n      if (candidates[i] > remaining) break; // отсечение!\n\n      current.push(candidates[i]);\n      backtrack(i, current, remaining - candidates[i]); // i, не i+1\n      current.pop();\n    }\n  }\n\n  backtrack(0, [], target);\n  return result;\n}\n\nconsole.log(combinationSum([2,3,6,7], 7)); // [[2,2,3],[7]]\nconsole.log(combinationSum([2,3,5], 8)); // [[2,2,2,2],[2,3,3],[3,5]]',
      explanation: 'Ключевые отличия от обычных комбинаций: 1) start=i (не i+1) — элемент можно использовать повторно. 2) Сортировка + break при candidates[i] > remaining — мощное отсечение. Для Combination Sum II (каждый элемент один раз): start=i+1 и пропуск дубликатов (if i > start && nums[i] === nums[i-1]).'
    },
    {
      id: 6,
      title: 'Практика: Word Search',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #79: найдите слово в матрице букв, двигаясь по соседним клеткам.',
      requirements: [
        'Реализуйте функцию exist(board, word)',
        'Двигаться можно вверх, вниз, влево, вправо',
        'Каждая клетка используется максимум один раз',
        'Верните true, если слово можно найти'
      ],
      hint: 'DFS/Backtracking: для каждой клетки, совпадающей с первой буквой, запускайте поиск. Помечайте посещённые клетки.',
      expectedOutput: 'exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED") -> true\nexist([...], "SEE") -> true\nexist([...], "ABCB") -> false',
      solution: 'function exist(board, word) {\n  const m = board.length, n = board[0].length;\n\n  function backtrack(r, c, idx) {\n    if (idx === word.length) return true;\n    if (r < 0 || r >= m || c < 0 || c >= n) return false;\n    if (board[r][c] !== word[idx]) return false;\n\n    const temp = board[r][c];\n    board[r][c] = "#"; // помечаем как посещённую\n\n    const found =\n      backtrack(r + 1, c, idx + 1) ||\n      backtrack(r - 1, c, idx + 1) ||\n      backtrack(r, c + 1, idx + 1) ||\n      backtrack(r, c - 1, idx + 1);\n\n    board[r][c] = temp; // откат!\n    return found;\n  }\n\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (backtrack(r, c, 0)) return true;\n    }\n  }\n\n  return false;\n}\n\nconst board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]];\nconsole.log(exist(board, "ABCCED")); // true\nconsole.log(exist(board, "SEE")); // true',
      explanation: 'Backtracking на матрице: помечаем клетку как посещённую (заменяем на "#"), ищем в 4 направлениях, при откате восстанавливаем. Ранний return при нахождении. Сложность: O(m*n*4^L), где L — длина слова, но на практике отсечение делает её намного лучше.'
    },
    {
      id: 7,
      title: 'Практика: N-Queens',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #51: разместите N ферзей на доске N x N так, чтобы они не атаковали друг друга.',
      requirements: [
        'Реализуйте функцию solveNQueens(n)',
        'Верните все возможные расстановки',
        'Ферзь атакует по горизонтали, вертикали и диагоналям',
        'Используйте backtracking с проверкой конфликтов'
      ],
      hint: 'Размещайте по одному ферзю в каждой строке. Для проверки конфликтов отслеживайте занятые столбцы и диагонали.',
      expectedOutput: 'solveNQueens(4) -> [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]',
      solution: 'function solveNQueens(n) {\n  const result = [];\n  const cols = new Set();\n  const posDiag = new Set(); // row + col\n  const negDiag = new Set(); // row - col\n  const board = Array.from({length: n}, () => ".".repeat(n));\n\n  function backtrack(row) {\n    if (row === n) {\n      result.push([...board]);\n      return;\n    }\n\n    for (let col = 0; col < n; col++) {\n      if (cols.has(col) || posDiag.has(row + col) || negDiag.has(row - col)) {\n        continue;\n      }\n\n      cols.add(col);\n      posDiag.add(row + col);\n      negDiag.add(row - col);\n      board[row] = ".".repeat(col) + "Q" + ".".repeat(n - col - 1);\n\n      backtrack(row + 1);\n\n      cols.delete(col);\n      posDiag.delete(row + col);\n      negDiag.delete(row - col);\n      board[row] = ".".repeat(n);\n    }\n  }\n\n  backtrack(0);\n  return result;\n}\n\nconsole.log(solveNQueens(4));\n// [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]',
      explanation: 'Три множества для O(1) проверки конфликтов: cols (столбцы), posDiag (row+col одинаковый для одной диагонали), negDiag (row-col одинаковый для другой). Размещаем по строкам — горизонтали проверять не нужно. Backtrack: ставим ферзя, рекурсия, снимаем ферзя. O(n!) в худшем случае.'
    }
  ]
}
