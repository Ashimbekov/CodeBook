export default {
  id: 15,
  title: 'DP: knapsack и подмножества',
  description: 'Задача о рюкзаке, subset sum, coin change и другие задачи на подмножества.',
  lessons: [
    {
      id: 1,
      title: '0/1 Knapsack и его вариации',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Классическая задача о рюкзаке'
        },
        {
          type: 'text',
          value: 'Задача о рюкзаке: даны предметы с весом и стоимостью, рюкзак вместимости W. Найти максимальную стоимость, которую можно уместить. Два варианта: 0/1 (каждый предмет один раз) и unbounded (неограниченно).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// 0/1 Knapsack\nfunction knapsack01(weights, values, W) {\n  const n = weights.length;\n  const dp = Array.from({length: n + 1}, () => Array(W + 1).fill(0));\n\n  for (let i = 1; i <= n; i++) {\n    for (let w = 0; w <= W; w++) {\n      dp[i][w] = dp[i-1][w]; // не берём предмет i\n      if (weights[i-1] <= w) {\n        dp[i][w] = Math.max(\n          dp[i][w],\n          dp[i-1][w - weights[i-1]] + values[i-1] // берём\n        );\n      }\n    }\n  }\n  return dp[n][W];\n}\n\n// Оптимизация: 1D массив (обход справа налево!)\nfunction knapsack01_1D(weights, values, W) {\n  const dp = new Array(W + 1).fill(0);\n  for (let i = 0; i < weights.length; i++) {\n    for (let w = W; w >= weights[i]; w--) { // справа налево!\n      dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);\n    }\n  }\n  return dp[W];\n}\n\n// Unbounded Knapsack (каждый предмет неограниченно)\nfunction knapsackUnbounded(weights, values, W) {\n  const dp = new Array(W + 1).fill(0);\n  for (let w = 0; w <= W; w++) {\n    for (let i = 0; i < weights.length; i++) {\n      if (weights[i] <= w) {\n        dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);\n      }\n    }\n  }\n  return dp[W];\n}'
        },
        {
          type: 'note',
          value: '0/1 Knapsack: внутренний цикл справа налево (чтобы не использовать предмет дважды). Unbounded: слева направо (можно использовать повторно).'
        }
      ]
    },
    {
      id: 2,
      title: 'Subset Sum и Target Sum',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Задачи на подмножества'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Subset Sum: можно ли набрать сумму target?\n// По сути 0/1 Knapsack с values = weights\nfunction canPartition(nums, target) {\n  const dp = new Array(target + 1).fill(false);\n  dp[0] = true;\n\n  for (const num of nums) {\n    for (let s = target; s >= num; s--) { // справа налево!\n      dp[s] = dp[s] || dp[s - num];\n    }\n  }\n\n  return dp[target];\n}\n\n// Target Sum (LeetCode #494)\n// Разделить на две группы: P (плюс) и N (минус)\n// P - N = target, P + N = sum\n// P = (sum + target) / 2 → задача Subset Sum\nfunction findTargetSumWays(nums, target) {\n  const sum = nums.reduce((a, b) => a + b, 0);\n  if ((sum + target) % 2 !== 0 || Math.abs(target) > sum) return 0;\n\n  const newTarget = (sum + target) / 2;\n  const dp = new Array(newTarget + 1).fill(0);\n  dp[0] = 1;\n\n  for (const num of nums) {\n    for (let s = newTarget; s >= num; s--) {\n      dp[s] += dp[s - num];\n    }\n  }\n\n  return dp[newTarget];\n}'
        },
        {
          type: 'tip',
          value: 'Многие задачи сводятся к Subset Sum / Knapsack: Partition Equal Subset Sum, Target Sum, Coin Change, и даже некоторые задачи на строки.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Coin Change',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #322: найдите минимальное количество монет для набора суммы.',
      requirements: [
        'Реализуйте функцию coinChange(coins, amount)',
        'Каждую монету можно использовать неограниченно',
        'Верните минимальное количество монет или -1 если невозможно'
      ],
      hint: 'Unbounded Knapsack: dp[a] = минимум монет для суммы a. dp[a] = min(dp[a], dp[a - coin] + 1) для каждой монеты.',
      expectedOutput: 'coinChange([1,5,10], 12) -> 3\ncoinChange([2], 3) -> -1\ncoinChange([1], 0) -> 0',
      solution: 'function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n\n  for (let a = 1; a <= amount; a++) {\n    for (const coin of coins) {\n      if (coin <= a && dp[a - coin] !== Infinity) {\n        dp[a] = Math.min(dp[a], dp[a - coin] + 1);\n      }\n    }\n  }\n\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}\n\nconsole.log(coinChange([1,5,10], 12)); // 3 (10+1+1)\nconsole.log(coinChange([2], 3)); // -1\nconsole.log(coinChange([1], 0)); // 0\nconsole.log(coinChange([1,2,5], 11)); // 3 (5+5+1)',
      explanation: 'Unbounded Knapsack: для каждой суммы пробуем каждую монету. dp[a] = min монет для суммы a. Перебираем слева направо (можно использовать монету повторно). Базовый случай: dp[0]=0 (для суммы 0 нужно 0 монет). O(amount * coins.length).'
    },
    {
      id: 4,
      title: 'Практика: Partition Equal Subset Sum',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #416: можно ли разделить массив на два подмножества с равной суммой?',
      requirements: [
        'Реализуйте функцию canPartition(nums)',
        'Верните true, если можно разделить на два подмножества с одинаковой суммой',
        'Это задача Subset Sum с target = sum/2'
      ],
      hint: 'Если сумма нечётная — невозможно. Иначе target = sum/2. Задача: можно ли выбрать подмножество с суммой target?',
      expectedOutput: 'canPartition([1,5,11,5]) -> true\ncanPartition([1,2,3,5]) -> false',
      solution: 'function canPartition(nums) {\n  const sum = nums.reduce((a, b) => a + b, 0);\n  if (sum % 2 !== 0) return false;\n\n  const target = sum / 2;\n  const dp = new Array(target + 1).fill(false);\n  dp[0] = true;\n\n  for (const num of nums) {\n    // Справа налево — каждый элемент используется максимум раз\n    for (let s = target; s >= num; s--) {\n      dp[s] = dp[s] || dp[s - num];\n    }\n  }\n\n  return dp[target];\n}\n\nconsole.log(canPartition([1,5,11,5])); // true\n// {1,5,5} и {11}: оба по 11\n\nconsole.log(canPartition([1,2,3,5])); // false\n// sum=11, нечётное → false... нет, sum=11 → false',
      explanation: 'Сводим к Subset Sum: если sum нечётна — ответ false. Иначе ищем подмножество с суммой sum/2. 1D DP с обходом справа налево (0/1 knapsack — каждый элемент один раз). O(n * sum/2) время, O(sum/2) память.'
    },
    {
      id: 5,
      title: 'Практика: Coin Change 2',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #518: подсчитайте количество комбинаций монет для набора суммы.',
      requirements: [
        'Реализуйте функцию change(amount, coins)',
        'Подсчитайте количество различных комбинаций монет для набора amount',
        'Каждую монету можно использовать неограниченно',
        'Порядок не важен: [1,2] и [2,1] — одна комбинация'
      ],
      hint: 'Внешний цикл по монетам, внутренний по суммам. Это обеспечивает подсчёт комбинаций (не перестановок).',
      expectedOutput: 'change(5, [1,2,5]) -> 4\nchange(3, [2]) -> 0\nchange(10, [10]) -> 1',
      solution: 'function change(amount, coins) {\n  const dp = new Array(amount + 1).fill(0);\n  dp[0] = 1; // один способ набрать 0\n\n  // Внешний цикл по монетам!\n  for (const coin of coins) {\n    for (let a = coin; a <= amount; a++) {\n      dp[a] += dp[a - coin];\n    }\n  }\n\n  return dp[amount];\n}\n\nconsole.log(change(5, [1,2,5])); // 4\n// 5 = 5\n// 5 = 2+2+1\n// 5 = 2+1+1+1\n// 5 = 1+1+1+1+1\n\n// ВАЖНО: если поменять порядок циклов, получим\n// количество ПЕРЕСТАНОВОК (комбинаций с порядком).\n// Это другая задача: Combination Sum IV (#377).',
      explanation: 'Тонкий момент: внешний цикл по монетам, внутренний по суммам = комбинации (без учёта порядка). Наоборот = перестановки (с учётом порядка). Это потому что при фиксированной монете мы добавляем только "новые" способы с этой монетой, не дублируя порядок. O(amount * coins).'
    },
    {
      id: 6,
      title: 'Практика: Target Sum',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #494: сколькими способами можно расставить + и - перед числами, чтобы получить target?',
      requirements: [
        'Реализуйте функцию findTargetSumWays(nums, target)',
        'Перед каждым числом можно поставить + или -',
        'Подсчитайте количество способов получить target'
      ],
      hint: 'Сведите к Subset Sum: P - N = target, P + N = sum → P = (sum + target) / 2. Подсчитайте количество подмножеств с суммой P.',
      expectedOutput: 'findTargetSumWays([1,1,1,1,1], 3) -> 5\nfindTargetSumWays([1], 1) -> 1',
      solution: 'function findTargetSumWays(nums, target) {\n  const sum = nums.reduce((a, b) => a + b, 0);\n\n  // P = (sum + target) / 2\n  if ((sum + target) % 2 !== 0 || Math.abs(target) > sum) return 0;\n\n  const newTarget = (sum + target) / 2;\n  const dp = new Array(newTarget + 1).fill(0);\n  dp[0] = 1;\n\n  for (const num of nums) {\n    for (let s = newTarget; s >= num; s--) {\n      dp[s] += dp[s - num];\n    }\n  }\n\n  return dp[newTarget];\n}\n\nconsole.log(findTargetSumWays([1,1,1,1,1], 3)); // 5\n// -1+1+1+1+1 = 3\n// +1-1+1+1+1 = 3\n// +1+1-1+1+1 = 3\n// +1+1+1-1+1 = 3\n// +1+1+1+1-1 = 3\n\nconsole.log(findTargetSumWays([1], 1)); // 1',
      explanation: 'Математическое преобразование: разделяем числа на P (плюс) и N (минус). P-N=target и P+N=sum, значит P=(sum+target)/2. Задача сводится к подсчёту подмножеств с суммой P — классический Subset Sum Count. O(n * P).'
    },
    {
      id: 7,
      title: 'Практика: Ones and Zeroes',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #474: максимальное количество строк из 0 и 1, если дано m нулей и n единиц.',
      requirements: [
        'Реализуйте функцию findMaxForm(strs, m, n)',
        'Каждая строка содержит только 0 и 1',
        'Найдите наибольшее подмножество строк, которое можно составить из m нулей и n единиц',
        'Это 2D Knapsack'
      ],
      hint: '2D Knapsack: dp[i][j] = макс. строк при i нулях и j единицах. Для каждой строки обновляйте dp справа налево по обоим измерениям.',
      expectedOutput: 'findMaxForm(["10","0001","111001","1","0"], 5, 3) -> 4\nfindMaxForm(["10","0","1"], 1, 1) -> 2',
      solution: 'function findMaxForm(strs, m, n) {\n  // 2D Knapsack: dp[i][j] = макс. строк с i нулями и j единицами\n  const dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));\n\n  for (const str of strs) {\n    // Подсчёт нулей и единиц\n    let zeros = 0, ones = 0;\n    for (const ch of str) {\n      if (ch === "0") zeros++;\n      else ones++;\n    }\n\n    // Обновляем dp справа налево (0/1 knapsack)\n    for (let i = m; i >= zeros; i--) {\n      for (let j = n; j >= ones; j--) {\n        dp[i][j] = Math.max(dp[i][j], dp[i - zeros][j - ones] + 1);\n      }\n    }\n  }\n\n  return dp[m][n];\n}\n\nconsole.log(findMaxForm(["10","0001","111001","1","0"], 5, 3)); // 4\n// Выбираем: "10", "0001", "1", "0" → 3 нуля + 3 единицы ≤ (5,3)\n\nconsole.log(findMaxForm(["10","0","1"], 1, 1)); // 2\n// Выбираем "0" и "1"',
      explanation: '2D Knapsack: два ресурса (нули и единицы) вместо одного (вес). Для каждой строки считаем количество 0 и 1, затем обновляем dp справа налево по обоим измерениям. Это 0/1 knapsack, поэтому обход справа налево. O(l * m * n), где l = количество строк.'
    }
  ]
}
