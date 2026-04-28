export default {
  id: 18,
  title: 'Greedy алгоритмы',
  description: 'Жадные алгоритмы: intervals, jump game, task scheduler и другие задачи.',
  lessons: [
    {
      id: 1,
      title: 'Greedy: когда жадность работает',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Принцип жадных алгоритмов'
        },
        {
          type: 'text',
          value: 'Жадный алгоритм на каждом шаге делает локально оптимальный выбор, надеясь получить глобально оптимальное решение. Это не всегда работает, но для определённых задач гарантирует оптимальность.'
        },
        {
          type: 'heading',
          value: 'Признаки задачи для Greedy'
        },
        {
          type: 'list',
          value: [
            'Задачи на интервалы (сортировка + жадный выбор)',
            'Задачи на "достаточно ли ресурсов" (jump game)',
            'Задачи на оптимальное распределение (assign cookies)',
            'Когда DP работает, но можно доказать жадный выбор'
          ]
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Пример: Assign Cookies (LeetCode #455)\n// Каждому ребёнку — печенье, размер >= жадность ребёнка\nfunction findContentChildren(g, s) {\n  g.sort((a, b) => a - b); // жадность детей\n  s.sort((a, b) => a - b); // размеры печенья\n\n  let child = 0;\n  for (let i = 0; i < s.length && child < g.length; i++) {\n    if (s[i] >= g[child]) {\n      child++; // ребёнок доволен\n    }\n  }\n  return child;\n}\n\n// Жадный выбор: самое маленькое печенье → самому нежадному ребёнку'
        },
        {
          type: 'tip',
          value: 'Если не уверены, что greedy работает — сначала решите через DP, затем посмотрите, всегда ли оптимальный выбор совпадает с жадным.'
        }
      ]
    },
    {
      id: 2,
      title: 'Greedy на интервалах',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Паттерн: сортировка интервалов + жадный выбор'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Non-overlapping Intervals (LeetCode #435)\n// Минимальное количество удалений для устранения пересечений\nfunction eraseOverlapIntervals(intervals) {\n  intervals.sort((a, b) => a[1] - b[1]); // сорт. по концу!\n  let count = 0;\n  let prevEnd = -Infinity;\n\n  for (const [start, end] of intervals) {\n    if (start >= prevEnd) {\n      prevEnd = end; // не пересекается — оставляем\n    } else {\n      count++; // пересекается — удаляем\n    }\n  }\n\n  return count;\n}\n\n// Почему сортируем по концу?\n// Выбирая интервал с наименьшим концом,\n// мы оставляем максимум места для следующих интервалов.'
        },
        {
          type: 'note',
          value: 'Для задач "максимум непересекающихся интервалов" — сортируйте по концу. Для задач "объединение пересекающихся" — сортируйте по началу.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Jump Game',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #55: определите, можно ли добраться до последнего индекса.',
      requirements: [
        'Реализуйте функцию canJump(nums)',
        'nums[i] — максимальная длина прыжка из позиции i',
        'Начинаете с индекса 0',
        'Верните true, если можно достигнуть последнего индекса'
      ],
      hint: 'Жадно отслеживайте максимально достижимую позицию. Если текущая позиция > maxReach — застряли.',
      expectedOutput: 'canJump([2,3,1,1,4]) -> true\ncanJump([3,2,1,0,4]) -> false',
      solution: 'function canJump(nums) {\n  let maxReach = 0;\n\n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) return false; // застряли\n    maxReach = Math.max(maxReach, i + nums[i]);\n  }\n\n  return true;\n}\n\nconsole.log(canJump([2,3,1,1,4])); // true\n// 0→1→4: прыжок 1, затем 3\n\nconsole.log(canJump([3,2,1,0,4])); // false\n// Застряли на индексе 3 (nums[3]=0)\n\n// Jump Game II (LeetCode #45) — минимум прыжков\nfunction jump(nums) {\n  let jumps = 0, curEnd = 0, farthest = 0;\n  for (let i = 0; i < nums.length - 1; i++) {\n    farthest = Math.max(farthest, i + nums[i]);\n    if (i === curEnd) {\n      jumps++;\n      curEnd = farthest;\n    }\n  }\n  return jumps;\n}',
      explanation: 'Жадный подход: на каждом шаге обновляем максимально достижимую позицию. Если текущая позиция недостижима (i > maxReach) — ответ false. Jump Game II: аналогичная идея, но считаем прыжки — каждый раз, когда достигаем curEnd, делаем "прыжок" до farthest.'
    },
    {
      id: 4,
      title: 'Практика: Gas Station',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #134: найдите стартовую заправку для кругового маршрута.',
      requirements: [
        'Реализуйте функцию canCompleteCircuit(gas, cost)',
        'gas[i] — бензин на станции i, cost[i] — стоимость проезда до i+1',
        'Найдите индекс стартовой станции для полного круга',
        'Верните -1 если невозможно'
      ],
      hint: 'Если total gas >= total cost — ответ существует. Жадно: если tank < 0 на станции i, начинаем заново с i+1.',
      expectedOutput: 'canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2]) -> 3\ncanCompleteCircuit([2,3,4], [3,4,3]) -> -1',
      solution: 'function canCompleteCircuit(gas, cost) {\n  let totalTank = 0;\n  let currentTank = 0;\n  let start = 0;\n\n  for (let i = 0; i < gas.length; i++) {\n    const net = gas[i] - cost[i];\n    totalTank += net;\n    currentTank += net;\n\n    if (currentTank < 0) {\n      start = i + 1;  // начинаем заново\n      currentTank = 0;\n    }\n  }\n\n  return totalTank >= 0 ? start : -1;\n}\n\nconsole.log(canCompleteCircuit([1,2,3,4,5], [3,4,5,1,2])); // 3\nconsole.log(canCompleteCircuit([2,3,4], [3,4,3])); // -1',
      explanation: 'Два инсайта: 1) Если total gas >= total cost, решение всегда существует. 2) Если мы не можем добраться до i из start, то ни одна станция между start и i не может быть стартовой (потому что из start мы приезжаем к ним с дополнительным бензином). Поэтому начинаем с i+1. O(n).'
    },
    {
      id: 5,
      title: 'Практика: Maximum Subarray (Greedy)',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #53: найдите подмассив с максимальной суммой (жадный подход Кадане).',
      requirements: [
        'Реализуйте функцию maxSubArray(nums) жадным подходом',
        'Если текущая сумма отрицательная — начните заново',
        'Это тот же алгоритм Кадане, но через призму жадности'
      ],
      hint: 'Жадный выбор: если текущая сумма < 0, начинать заново лучше, чем продолжать.',
      expectedOutput: 'maxSubArray([-2,1,-3,4,-1,2,1,-5,4]) -> 6',
      solution: 'function maxSubArray(nums) {\n  let maxSum = nums[0];\n  let currentSum = 0;\n\n  for (const num of nums) {\n    // Жадный выбор: начать заново или продолжить?\n    if (currentSum < 0) {\n      currentSum = 0; // начать заново\n    }\n    currentSum += num;\n    maxSum = Math.max(maxSum, currentSum);\n  }\n\n  return maxSum;\n}\n\nconsole.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // 6\n// [4,-1,2,1] = 6\n\n// Divide & Conquer вариант — O(n log n)\nfunction maxSubArrayDC(nums, lo = 0, hi = nums.length - 1) {\n  if (lo === hi) return nums[lo];\n  const mid = (lo + hi) >> 1;\n  const leftMax = maxSubArrayDC(nums, lo, mid);\n  const rightMax = maxSubArrayDC(nums, mid + 1, hi);\n\n  // Максимальный подмассив через середину\n  let leftSum = -Infinity, rightSum = -Infinity, sum = 0;\n  for (let i = mid; i >= lo; i--) { sum += nums[i]; leftSum = Math.max(leftSum, sum); }\n  sum = 0;\n  for (let i = mid + 1; i <= hi; i++) { sum += nums[i]; rightSum = Math.max(rightSum, sum); }\n\n  return Math.max(leftMax, rightMax, leftSum + rightSum);\n}',
      explanation: 'Алгоритм Кадане с точки зрения жадности: отрицательная текущая сумма только ухудшает любой будущий подмассив, поэтому жадный выбор — сбросить до 0. Это доказуемо оптимально. O(n) — один из самых элегантных алгоритмов.'
    },
    {
      id: 6,
      title: 'Практика: Partition Labels',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #763: разбейте строку на максимальное количество частей, чтобы каждая буква появлялась только в одной части.',
      requirements: [
        'Реализуйте функцию partitionLabels(s)',
        'Каждая буква должна появляться максимум в одной части',
        'Максимизируйте количество частей',
        'Верните массив размеров частей'
      ],
      hint: 'Для каждой буквы найдите её последнее вхождение. Расширяйте текущую часть до максимального lastIndex всех букв в ней.',
      expectedOutput: 'partitionLabels("ababcbacadefegdehijhklij") -> [9,7,8]',
      solution: 'function partitionLabels(s) {\n  // Последнее вхождение каждой буквы\n  const last = {};\n  for (let i = 0; i < s.length; i++) {\n    last[s[i]] = i;\n  }\n\n  const result = [];\n  let start = 0;\n  let end = 0;\n\n  for (let i = 0; i < s.length; i++) {\n    end = Math.max(end, last[s[i]]); // расширяем часть\n\n    if (i === end) {\n      result.push(end - start + 1);\n      start = i + 1;\n    }\n  }\n\n  return result;\n}\n\nconsole.log(partitionLabels("ababcbacadefegdehijhklij"));\n// [9, 7, 8]\n// "ababcbaca" | "defegde" | "hijhklij"',
      explanation: 'Жадный подход: для каждой буквы знаем последнее вхождение. Текущая часть должна включать все вхождения каждой буквы в ней. Расширяем end = max(end, last[s[i]]). Когда i достигает end — это конец части. O(n) время, O(1) память (26 букв).'
    },
    {
      id: 7,
      title: 'Практика: Hand of Straights',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #846: можно ли разделить карты на группы последовательных чисел размером groupSize?',
      requirements: [
        'Реализуйте функцию isNStraightHand(hand, groupSize)',
        'Каждая группа — последовательные числа длины groupSize',
        'Верните true, если можно разделить'
      ],
      hint: 'Сортируйте. Жадно: для каждого минимального числа пытайтесь собрать группу начиная с него.',
      expectedOutput: 'isNStraightHand([1,2,3,6,2,3,4,7,8], 3) -> true\nisNStraightHand([1,2,3,4,5], 4) -> false',
      solution: 'function isNStraightHand(hand, groupSize) {\n  if (hand.length % groupSize !== 0) return false;\n\n  const count = new Map();\n  for (const card of hand) {\n    count.set(card, (count.get(card) || 0) + 1);\n  }\n\n  const sorted = [...count.keys()].sort((a, b) => a - b);\n\n  for (const start of sorted) {\n    const freq = count.get(start);\n    if (freq === 0) continue;\n\n    // Пытаемся собрать freq групп начиная с start\n    for (let i = 0; i < groupSize; i++) {\n      const card = start + i;\n      if ((count.get(card) || 0) < freq) return false;\n      count.set(card, count.get(card) - freq);\n    }\n  }\n\n  return true;\n}\n\nconsole.log(isNStraightHand([1,2,3,6,2,3,4,7,8], 3)); // true\n// [1,2,3], [2,3,4], [6,7,8]\n\nconsole.log(isNStraightHand([1,2,3,4,5], 4)); // false',
      explanation: 'Жадный подход: начинаем с наименьшего числа и пытаемся собрать группу. Если для какого-то числа в группе не хватает карт — невозможно. Оптимизация: если start имеет freq экземпляров, собираем сразу freq групп. O(n log n) из-за сортировки.'
    }
  ]
}
