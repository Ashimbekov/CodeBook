export default {
  id: 13,
  title: 'Dynamic Programming: основы',
  description: 'Основы динамического программирования: fibonacci, climbing stairs, house robber.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Dynamic Programming',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'DP = Рекурсия + Мемоизация'
        },
        {
          type: 'text',
          value: 'Dynamic Programming (DP) — метод решения задач путём разбиения на перекрывающиеся подзадачи. Вместо повторного решения одних и тех же подзадач, мы запоминаем результаты. Два подхода: top-down (мемоизация) и bottom-up (табуляция).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Fibonacci: три подхода\n\n// 1. Наивная рекурсия — O(2^n) ❌\nfunction fibNaive(n) {\n  if (n <= 1) return n;\n  return fibNaive(n - 1) + fibNaive(n - 2);\n}\n\n// 2. Top-down (мемоизация) — O(n) ✓\nfunction fibMemo(n, memo = {}) {\n  if (n <= 1) return n;\n  if (n in memo) return memo[n];\n  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);\n  return memo[n];\n}\n\n// 3. Bottom-up (табуляция) — O(n) время, O(1) память ✓✓\nfunction fib(n) {\n  if (n <= 1) return n;\n  let prev2 = 0, prev1 = 1;\n  for (let i = 2; i <= n; i++) {\n    const curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}'
        },
        {
          type: 'heading',
          value: 'Когда задача решается DP'
        },
        {
          type: 'list',
          value: [
            'Перекрывающиеся подзадачи — одни и те же подзадачи решаются многократно',
            'Оптимальная подструктура — оптимальное решение строится из оптимальных решений подзадач',
            'Ключевые слова: "минимальное/максимальное", "количество способов", "возможно ли"'
          ]
        },
        {
          type: 'tip',
          value: 'Фреймворк DP: 1) Определите состояние (dp[i] = что?). 2) Определите переход (dp[i] зависит от чего?). 3) Определите базовый случай. 4) Определите порядок заполнения.'
        }
      ]
    },
    {
      id: 2,
      title: 'Одномерный DP: паттерны',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Типичные 1D DP задачи'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Climbing Stairs (LeetCode #70)\n// dp[i] = количество способов подняться на i ступеней\nfunction climbStairs(n) {\n  if (n <= 2) return n;\n  let prev2 = 1, prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}\n\n// House Robber (LeetCode #198)\n// dp[i] = макс. добыча при ограблении домов [0..i]\nfunction rob(nums) {\n  if (nums.length === 1) return nums[0];\n  let prev2 = 0, prev1 = 0;\n  for (const num of nums) {\n    const curr = Math.max(prev1, prev2 + num);\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}\n\n// Min Cost Climbing Stairs (LeetCode #746)\nfunction minCostClimbingStairs(cost) {\n  let prev2 = 0, prev1 = 0;\n  for (let i = 2; i <= cost.length; i++) {\n    const curr = Math.min(prev1 + cost[i-1], prev2 + cost[i-2]);\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}'
        },
        {
          type: 'note',
          value: 'Оптимизация памяти: если dp[i] зависит только от dp[i-1] и dp[i-2], не нужен весь массив — достаточно двух переменных. Это снижает O(n) → O(1) по памяти.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Climbing Stairs',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #70: сколькими способами можно подняться на n ступеней, шагая по 1 или 2?',
      requirements: [
        'Реализуйте функцию climbStairs(n)',
        'На каждом шаге можно подняться на 1 или 2 ступени',
        'Подсчитайте количество различных способов подняться на вершину',
        'Оптимизируйте до O(1) по памяти'
      ],
      hint: 'dp[i] = dp[i-1] + dp[i-2]. Это числа Фибоначчи! Базовые случаи: dp[1]=1, dp[2]=2.',
      expectedOutput: 'climbStairs(2) -> 2\nclimbStairs(3) -> 3\nclimbStairs(5) -> 8',
      solution: 'function climbStairs(n) {\n  if (n <= 2) return n;\n\n  let prev2 = 1; // dp[1]\n  let prev1 = 2; // dp[2]\n\n  for (let i = 3; i <= n; i++) {\n    const curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n\n  return prev1;\n}\n\n// n=3: 1+1+1, 1+2, 2+1 = 3 способа\n// n=5: 8 способов\n\nconsole.log(climbStairs(2)); // 2\nconsole.log(climbStairs(3)); // 3\nconsole.log(climbStairs(5)); // 8',
      explanation: 'Чтобы попасть на ступень i, мы можем прийти с i-1 (один шаг) или i-2 (два шага). Значит dp[i] = dp[i-1] + dp[i-2] — числа Фибоначчи. Так как зависим только от двух предыдущих значений, используем O(1) памяти.'
    },
    {
      id: 4,
      title: 'Практика: House Robber',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #198: максимальная сумма, которую можно украсть, не грабя соседние дома.',
      requirements: [
        'Реализуйте функцию rob(nums)',
        'nums[i] — деньги в доме i',
        'Нельзя грабить два соседних дома',
        'Верните максимальную сумму'
      ],
      hint: 'Для каждого дома: ограбить (nums[i] + dp[i-2]) или пропустить (dp[i-1]). dp[i] = max(dp[i-1], dp[i-2] + nums[i]).',
      expectedOutput: 'rob([1,2,3,1]) -> 4\nrob([2,7,9,3,1]) -> 12\nrob([2,1,1,2]) -> 4',
      solution: 'function rob(nums) {\n  let prev2 = 0; // dp[i-2]\n  let prev1 = 0; // dp[i-1]\n\n  for (const num of nums) {\n    const curr = Math.max(\n      prev1,       // не грабим текущий\n      prev2 + num  // грабим текущий\n    );\n    prev2 = prev1;\n    prev1 = curr;\n  }\n\n  return prev1;\n}\n\nconsole.log(rob([1,2,3,1])); // 4 (1+3)\nconsole.log(rob([2,7,9,3,1])); // 12 (2+9+1)\n\n// House Robber II (LeetCode #213) — дома по кругу\nfunction robII(nums) {\n  if (nums.length === 1) return nums[0];\n  // Грабим [0..n-2] или [1..n-1]\n  return Math.max(\n    rob(nums.slice(0, -1)),\n    rob(nums.slice(1))\n  );\n}',
      explanation: 'Решение "грабить или не грабить": для каждого дома выбираем максимум между "пропустить" (prev1) и "ограбить" (prev2 + nums[i]). House Robber II: дома по кругу, поэтому первый и последний — соседи. Решаем дважды: без первого и без последнего.'
    },
    {
      id: 5,
      title: 'Практика: Maximum Subarray',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #53: найдите подмассив с максимальной суммой (алгоритм Кадане).',
      requirements: [
        'Реализуйте функцию maxSubArray(nums)',
        'Найдите непрерывный подмассив с наибольшей суммой',
        'Верните эту сумму',
        'Решение O(n) — алгоритм Кадане'
      ],
      hint: 'Для каждого элемента: продолжить текущий подмассив или начать новый. currentMax = max(num, currentMax + num).',
      expectedOutput: 'maxSubArray([-2,1,-3,4,-1,2,1,-5,4]) -> 6\nmaxSubArray([1]) -> 1\nmaxSubArray([5,4,-1,7,8]) -> 23',
      solution: 'function maxSubArray(nums) {\n  let currentMax = nums[0];\n  let globalMax = nums[0];\n\n  for (let i = 1; i < nums.length; i++) {\n    // Продолжить подмассив или начать новый?\n    currentMax = Math.max(nums[i], currentMax + nums[i]);\n    globalMax = Math.max(globalMax, currentMax);\n  }\n\n  return globalMax;\n}\n\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // 6\n// Подмассив [4,-1,2,1] → сумма 6\n\nconsole.log(maxSubArray([5,4,-1,7,8])); // 23\n// Весь массив → сумма 23',
      explanation: 'Алгоритм Кадане — один из самых элегантных DP. Идея: если currentMax < 0, лучше начать заново с текущего элемента. По сути, dp[i] = max(nums[i], dp[i-1] + nums[i]). Оптимизация: храним только текущее и глобальное максимальное значение. O(n) время, O(1) память.'
    },
    {
      id: 6,
      title: 'Практика: Decode Ways',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #91: сколькими способами можно декодировать строку цифр в буквы (A=1, B=2, ..., Z=26)?',
      requirements: [
        'Реализуйте функцию numDecodings(s)',
        '"A"=1, "B"=2, ..., "Z"=26',
        'Подсчитайте количество способов декодировать строку',
        'Например, "226" можно декодировать как BZ(2,26), VF(22,6), BBF(2,2,6)'
      ],
      hint: 'dp[i] = количество декодирований для s[0..i-1]. Если s[i-1] != "0": dp[i] += dp[i-1]. Если s[i-2..i-1] от 10 до 26: dp[i] += dp[i-2].',
      expectedOutput: 'numDecodings("12") -> 2\nnumDecodings("226") -> 3\nnumDecodings("06") -> 0',
      solution: 'function numDecodings(s) {\n  if (s[0] === "0") return 0;\n\n  let prev2 = 1; // dp[0]: пустая строка — 1 способ\n  let prev1 = 1; // dp[1]: одна цифра (не 0) — 1 способ\n\n  for (let i = 2; i <= s.length; i++) {\n    let curr = 0;\n\n    // Одна цифра: s[i-1]\n    const oneDigit = parseInt(s[i-1]);\n    if (oneDigit >= 1) {\n      curr += prev1;\n    }\n\n    // Две цифры: s[i-2..i-1]\n    const twoDigits = parseInt(s.substring(i-2, i));\n    if (twoDigits >= 10 && twoDigits <= 26) {\n      curr += prev2;\n    }\n\n    prev2 = prev1;\n    prev1 = curr;\n  }\n\n  return prev1;\n}\n\nconsole.log(numDecodings("12")); // 2: "AB"(1,2) или "L"(12)\nconsole.log(numDecodings("226")); // 3: "BZ", "VF", "BBF"\nconsole.log(numDecodings("06")); // 0: "0" нельзя декодировать',
      explanation: 'Похоже на Climbing Stairs, но с условиями: одна цифра должна быть 1-9, две цифры — 10-26. "0" не может быть самостоятельной цифрой. dp[i] = (одна цифра валидна ? dp[i-1] : 0) + (две цифры валидны ? dp[i-2] : 0). O(n) время, O(1) память.'
    },
    {
      id: 7,
      title: 'Практика: Word Break',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #139: можно ли разбить строку на слова из словаря?',
      requirements: [
        'Реализуйте функцию wordBreak(s, wordDict)',
        'Определите, можно ли разбить s на последовательность слов из wordDict',
        'Одно слово можно использовать несколько раз',
        'Используйте DP: dp[i] = можно ли разбить s[0..i-1]'
      ],
      hint: 'dp[i] = true, если существует j < i такое что dp[j] = true и s[j..i-1] есть в словаре.',
      expectedOutput: 'wordBreak("leetcode", ["leet","code"]) -> true\nwordBreak("applepenapple", ["apple","pen"]) -> true\nwordBreak("catsandog", ["cats","dog","sand","and","cat"]) -> false',
      solution: 'function wordBreak(s, wordDict) {\n  const wordSet = new Set(wordDict);\n  const dp = new Array(s.length + 1).fill(false);\n  dp[0] = true; // пустая строка\n\n  for (let i = 1; i <= s.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (dp[j] && wordSet.has(s.substring(j, i))) {\n        dp[i] = true;\n        break;\n      }\n    }\n  }\n\n  return dp[s.length];\n}\n\nconsole.log(wordBreak("leetcode", ["leet","code"])); // true\n// "leet" + "code"\n\nconsole.log(wordBreak("applepenapple", ["apple","pen"])); // true\n// "apple" + "pen" + "apple"\n\nconsole.log(wordBreak("catsandog", ["cats","dog","sand","and","cat"])); // false',
      explanation: 'dp[i] означает: можно ли разбить s[0..i-1] на слова из словаря. Для каждого i проверяем все возможные "последние слова" s[j..i-1]. Если dp[j]=true (prefix разбивается) и s[j..i-1] есть в словаре — dp[i]=true. O(n^2 * k) где k — средняя длина проверки подстроки.'
    }
  ]
}
