export default {
  id: 16,
  title: 'DP: интервалы и матрицы',
  description: 'DP на матрицах и интервалах: unique paths, min path sum, burst balloons.',
  lessons: [
    {
      id: 1,
      title: 'DP на матрицах',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: '2D Grid DP'
        },
        {
          type: 'text',
          value: 'Задачи DP на матрицах: передвигаемся по сетке (обычно вниз/вправо), собирая или минимизируя что-то. dp[i][j] зависит от dp[i-1][j] и dp[i][j-1].'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Unique Paths (LeetCode #62)\n// dp[i][j] = количество путей до (i,j)\nfunction uniquePaths(m, n) {\n  const dp = Array.from({length: m}, () => Array(n).fill(1));\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      dp[i][j] = dp[i-1][j] + dp[i][j-1];\n    }\n  }\n  return dp[m-1][n-1];\n}\n\n// Minimum Path Sum (LeetCode #64)\nfunction minPathSum(grid) {\n  const m = grid.length, n = grid[0].length;\n  for (let i = 0; i < m; i++) {\n    for (let j = 0; j < n; j++) {\n      if (i === 0 && j === 0) continue;\n      else if (i === 0) grid[i][j] += grid[i][j-1];\n      else if (j === 0) grid[i][j] += grid[i-1][j];\n      else grid[i][j] += Math.min(grid[i-1][j], grid[i][j-1]);\n    }\n  }\n  return grid[m-1][n-1];\n}'
        },
        {
          type: 'tip',
          value: 'В Grid DP часто можно использовать саму матрицу как dp-таблицу (in-place), экономя O(m*n) памяти. Спросите интервьюера, можно ли модифицировать input.'
        }
      ]
    },
    {
      id: 2,
      title: 'Interval DP',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'DP на интервалах'
        },
        {
          type: 'text',
          value: 'Interval DP: dp[i][j] — ответ для подзадачи на интервале [i, j]. Заполняется по длине интервала. Типичный переход: перебираем точку разделения k внутри [i, j].'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Шаблон Interval DP\nfunction intervalDP(arr) {\n  const n = arr.length;\n  const dp = Array.from({length: n}, () => Array(n).fill(0));\n\n  // Базовый случай: интервалы длины 1\n  for (let i = 0; i < n; i++) dp[i][i] = /* base */;\n\n  // Заполняем по длине интервала\n  for (let len = 2; len <= n; len++) {\n    for (let i = 0; i <= n - len; i++) {\n      const j = i + len - 1;\n      dp[i][j] = Infinity; // или 0, зависит от задачи\n      for (let k = i; k < j; k++) {\n        dp[i][j] = Math.min(\n          dp[i][j],\n          dp[i][k] + dp[k+1][j] + /* cost */\n        );\n      }\n    }\n  }\n\n  return dp[0][n-1];\n}'
        },
        {
          type: 'note',
          value: 'Interval DP сложнее обычного DP. Ключевое — понять, как подзадачи [i,k] и [k+1,j] комбинируются. Сложность обычно O(n^3).'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Unique Paths',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #62: сколько уникальных путей из верхнего левого угла в нижний правый?',
      requirements: [
        'Реализуйте функцию uniquePaths(m, n)',
        'Движение только вниз или вправо',
        'Верните количество уникальных путей'
      ],
      hint: 'dp[i][j] = dp[i-1][j] + dp[i][j-1]. Первая строка и столбец заполнены единицами.',
      expectedOutput: 'uniquePaths(3, 7) -> 28\nuniquePaths(3, 2) -> 3\nuniquePaths(1, 1) -> 1',
      solution: 'function uniquePaths(m, n) {\n  const dp = Array.from({length: m}, () => Array(n).fill(1));\n\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      dp[i][j] = dp[i-1][j] + dp[i][j-1];\n    }\n  }\n\n  return dp[m-1][n-1];\n}\n\n// Оптимизация: 1D массив\nfunction uniquePathsOpt(m, n) {\n  const dp = new Array(n).fill(1);\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      dp[j] += dp[j-1];\n    }\n  }\n  return dp[n-1];\n}\n\nconsole.log(uniquePaths(3, 7)); // 28\nconsole.log(uniquePaths(3, 2)); // 3\n// Пути: вниз-вниз-вправо, вниз-вправо-вниз, вправо-вниз-вниз',
      explanation: 'В клетку (i,j) можно попасть только сверху (i-1,j) или слева (i,j-1). Значит dp[i][j] = dp[i-1][j] + dp[i][j-1]. Первая строка и столбец = 1 (только один путь). Можно оптимизировать до 1D, потому что текущая строка зависит только от предыдущей.'
    },
    {
      id: 4,
      title: 'Практика: Unique Paths II (с препятствиями)',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #63: уникальные пути с препятствиями в матрице.',
      requirements: [
        'Реализуйте функцию uniquePathsWithObstacles(obstacleGrid)',
        'obstacleGrid[i][j] = 1 означает препятствие',
        'Верните количество уникальных путей из (0,0) в (m-1,n-1)'
      ],
      hint: 'Если клетка — препятствие, dp[i][j] = 0. Иначе — стандартная формула.',
      expectedOutput: 'uniquePathsWithObstacles([[0,0,0],[0,1,0],[0,0,0]]) -> 2\nuniquePathsWithObstacles([[0,1],[0,0]]) -> 1',
      solution: 'function uniquePathsWithObstacles(grid) {\n  const m = grid.length, n = grid[0].length;\n  if (grid[0][0] === 1 || grid[m-1][n-1] === 1) return 0;\n\n  const dp = Array.from({length: m}, () => Array(n).fill(0));\n  dp[0][0] = 1;\n\n  // Первая строка\n  for (let j = 1; j < n; j++) {\n    dp[0][j] = grid[0][j] === 1 ? 0 : dp[0][j-1];\n  }\n  // Первый столбец\n  for (let i = 1; i < m; i++) {\n    dp[i][0] = grid[i][0] === 1 ? 0 : dp[i-1][0];\n  }\n\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      dp[i][j] = grid[i][j] === 1 ? 0 : dp[i-1][j] + dp[i][j-1];\n    }\n  }\n\n  return dp[m-1][n-1];\n}\n\nconsole.log(uniquePathsWithObstacles([[0,0,0],[0,1,0],[0,0,0]])); // 2\nconsole.log(uniquePathsWithObstacles([[0,1],[0,0]])); // 1',
      explanation: 'Модификация Unique Paths: если клетка содержит препятствие, dp[i][j] = 0 (через неё нельзя пройти). Важный edge case: если начало или конец заблокированы — ответ 0. Также препятствие в первой строке/столбце блокирует все клетки правее/ниже.'
    },
    {
      id: 5,
      title: 'Практика: Maximal Square',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #221: найдите площадь наибольшего квадрата из единиц в бинарной матрице.',
      requirements: [
        'Реализуйте функцию maximalSquare(matrix)',
        'Верните площадь наибольшего квадрата, состоящего только из "1"',
        'dp[i][j] = сторона наибольшего квадрата с правым нижним углом в (i,j)'
      ],
      hint: 'dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1, если matrix[i][j] = "1".',
      expectedOutput: 'maximalSquare([["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]) -> 4',
      solution: 'function maximalSquare(matrix) {\n  const m = matrix.length, n = matrix[0].length;\n  const dp = Array.from({length: m}, () => Array(n).fill(0));\n  let maxSide = 0;\n\n  for (let i = 0; i < m; i++) {\n    for (let j = 0; j < n; j++) {\n      if (matrix[i][j] === "1") {\n        if (i === 0 || j === 0) {\n          dp[i][j] = 1;\n        } else {\n          dp[i][j] = Math.min(\n            dp[i-1][j],\n            dp[i][j-1],\n            dp[i-1][j-1]\n          ) + 1;\n        }\n        maxSide = Math.max(maxSide, dp[i][j]);\n      }\n    }\n  }\n\n  return maxSide * maxSide; // площадь\n}\n\nconsole.log(maximalSquare([\n  ["1","0","1","0","0"],\n  ["1","0","1","1","1"],\n  ["1","1","1","1","1"],\n  ["1","0","0","1","0"]\n])); // 4 (квадрат 2x2)',
      explanation: 'dp[i][j] = сторона наибольшего квадрата из единиц с правым нижним углом в (i,j). Формула: минимум из трёх соседей + 1. Интуиция: квадрат может вырасти, только если все три "опоры" (сверху, слева, по диагонали) достаточно большие. O(m*n).'
    },
    {
      id: 6,
      title: 'Практика: Longest Increasing Subsequence',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #300: найдите длину наибольшей возрастающей подпоследовательности.',
      requirements: [
        'Реализуйте функцию lengthOfLIS(nums)',
        'Подпоследовательность — элементы в исходном порядке, не обязательно подряд',
        'Строго возрастающая',
        'DP решение O(n^2) и оптимальное O(n log n)'
      ],
      hint: 'DP: dp[i] = длина LIS, заканчивающейся в nums[i]. Для каждого j < i: если nums[j] < nums[i], dp[i] = max(dp[i], dp[j]+1).',
      expectedOutput: 'lengthOfLIS([10,9,2,5,3,7,101,18]) -> 4\nlengthOfLIS([0,1,0,3,2,3]) -> 4\nlengthOfLIS([7,7,7,7,7]) -> 1',
      solution: '// DP — O(n^2)\nfunction lengthOfLIS(nums) {\n  const dp = new Array(nums.length).fill(1);\n\n  for (let i = 1; i < nums.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (nums[j] < nums[i]) {\n        dp[i] = Math.max(dp[i], dp[j] + 1);\n      }\n    }\n  }\n\n  return Math.max(...dp);\n}\n\n// Оптимальное — O(n log n) с бинарным поиском\nfunction lengthOfLIS_Optimal(nums) {\n  const tails = []; // tails[i] = минимальный хвост LIS длины i+1\n\n  for (const num of nums) {\n    let lo = 0, hi = tails.length;\n    while (lo < hi) {\n      const mid = (lo + hi) >> 1;\n      if (tails[mid] < num) lo = mid + 1;\n      else hi = mid;\n    }\n    tails[lo] = num;\n  }\n\n  return tails.length;\n}\n\nconsole.log(lengthOfLIS([10,9,2,5,3,7,101,18])); // 4\n// LIS: [2,3,7,101] или [2,5,7,101] и т.д.',
      explanation: 'DP O(n^2): для каждого элемента проверяем все предыдущие. O(n log n): поддерживаем массив tails, где tails[i] = минимальный хвост LIS длины i+1. Для каждого элемента бинарным поиском находим позицию для вставки. Длина LIS = длина tails. Это patience sorting.'
    },
    {
      id: 7,
      title: 'Практика: Burst Balloons',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #312: максимальное количество монет при лопании шаров.',
      requirements: [
        'Реализуйте функцию maxCoins(nums)',
        'При лопании шара i получаете nums[i-1]*nums[i]*nums[i+1] монет',
        'Найдите порядок лопания, максимизирующий монеты',
        'Используйте Interval DP'
      ],
      hint: 'dp[i][j] = макс. монет при лопании шаров от i до j. Перебираем последний лопнувший шар k в интервале [i,j].',
      expectedOutput: 'maxCoins([3,1,5,8]) -> 167',
      solution: 'function maxCoins(nums) {\n  // Добавляем 1 по краям\n  const balls = [1, ...nums, 1];\n  const n = balls.length;\n  const dp = Array.from({length: n}, () => Array(n).fill(0));\n\n  // Заполняем по длине интервала\n  for (let len = 2; len < n; len++) {\n    for (let i = 0; i < n - len; i++) {\n      const j = i + len;\n      for (let k = i + 1; k < j; k++) {\n        // k — ПОСЛЕДНИЙ лопнувший шар в (i,j)\n        const coins = balls[i] * balls[k] * balls[j]\n                    + dp[i][k] + dp[k][j];\n        dp[i][j] = Math.max(dp[i][j], coins);\n      }\n    }\n  }\n\n  return dp[0][n - 1];\n}\n\nconsole.log(maxCoins([3,1,5,8])); // 167\n// Порядок: лопаем 1, затем 5, затем 3, затем 8\n// 3*1*5 + 3*5*8 + 1*3*8 + 1*8*1 = 15+120+24+8 = 167',
      explanation: 'Хитрость: вместо "какой шар лопнуть первым", думаем "какой шар лопнуть ПОСЛЕДНИМ" в интервале. Если k — последний, то при его лопании соседи — balls[i] и balls[j] (все остальные в интервале уже лопнуты). dp[i][k] + dp[k][j] + balls[i]*balls[k]*balls[j]. Сложность: O(n^3).'
    }
  ]
}
