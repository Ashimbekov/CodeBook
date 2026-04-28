export default {
  id: 4,
  title: 'Binary Search продвинутый',
  description: 'Продвинутый бинарный поиск: поиск по пространству ответов, bisect, применение к нестандартным задачам.',
  lessons: [
    {
      id: 1,
      title: 'Binary Search: за пределами отсортированного массива',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Бинарный поиск — это не только поиск элемента'
        },
        {
          type: 'text',
          value: 'Большинство разработчиков знают бинарный поиск как способ найти элемент в отсортированном массиве. Но на собеседованиях бинарный поиск применяется к гораздо более широкому классу задач — везде, где можно разделить пространство ответов пополам.'
        },
        {
          type: 'heading',
          value: 'Три шаблона Binary Search'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Шаблон 1: Классический — найти точный элемент\nfunction binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = lo + Math.floor((hi - lo) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}\n\n// Шаблон 2: Найти левую границу (первый >= target)\nfunction lowerBound(arr, target) {\n  let lo = 0, hi = arr.length;\n  while (lo < hi) {\n    const mid = lo + Math.floor((hi - lo) / 2);\n    if (arr[mid] < target) lo = mid + 1;\n    else hi = mid;\n  }\n  return lo;\n}\n\n// Шаблон 3: Бинарный поиск по ответу\nfunction binarySearchAnswer(lo, hi, isValid) {\n  while (lo < hi) {\n    const mid = lo + Math.floor((hi - lo) / 2);\n    if (isValid(mid)) hi = mid;\n    else lo = mid + 1;\n  }\n  return lo;\n}'
        },
        {
          type: 'note',
          value: 'Ключевой инсайт: бинарный поиск работает на любом монотонном свойстве. Если есть функция f(x), которая меняется с false на true (или наоборот) при увеличении x — можно применить бинарный поиск.'
        },
        {
          type: 'tip',
          value: 'Используйте lo + (hi - lo) / 2 вместо (lo + hi) / 2 чтобы избежать integer overflow.'
        }
      ]
    },
    {
      id: 2,
      title: 'Бинарный поиск по пространству ответов',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Когда ответ — число, а не элемент массива'
        },
        {
          type: 'text',
          value: 'Многие задачи формулируются как: "Найдите минимальное/максимальное значение X, при котором выполняется условие". Если проверка условия для данного X стоит O(n), а диапазон X = [lo, hi], то мы можем найти ответ за O(n * log(hi - lo)).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Пример: Koko Eating Bananas (LeetCode #875)\n// Коко ест бананы со скоростью k бананов/час.\n// За h часов она должна съесть все кучи.\n// Найти минимальное k.\n\nfunction minEatingSpeed(piles, h) {\n  let lo = 1;\n  let hi = Math.max(...piles);\n\n  while (lo < hi) {\n    const mid = lo + Math.floor((hi - lo) / 2);\n\n    // Проверяем: можно ли съесть всё за h часов?\n    const hours = piles.reduce((sum, p) => sum + Math.ceil(p / mid), 0);\n\n    if (hours <= h) {\n      hi = mid; // можно — пробуем медленнее\n    } else {\n      lo = mid + 1; // нельзя — нужно быстрее\n    }\n  }\n\n  return lo;\n}\n\n// piles = [3,6,7,11], h = 8\n// lo=1, hi=11\n// mid=6: часы = 1+1+2+2 = 6 <= 8 → hi=6\n// mid=3: часы = 1+2+3+4 = 10 > 8 → lo=4\n// mid=5: часы = 1+2+2+3 = 8 <= 8 → hi=5\n// mid=4: часы = 1+2+2+3 = 8 <= 8 → hi=4\n// lo=4=hi → ответ 4'
        },
        {
          type: 'list',
          value: [
            'Определите пространство ответов [lo, hi]',
            'Напишите функцию isValid(mid) — проверку условия',
            'Примените бинарный поиск по ответу',
            'Типичные задачи: минимальная скорость, максимальная дистанция, разделение массива'
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Search in Rotated Sorted Array',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #33: найдите элемент в отсортированном массиве, который был повёрнут в некоторой точке.',
      requirements: [
        'Реализуйте функцию search(nums, target)',
        'Массив был отсортирован и затем повёрнут (например: [4,5,6,7,0,1,2])',
        'Верните индекс target или -1',
        'Решение должно быть O(log n)'
      ],
      hint: 'На каждом шаге одна из половин точно отсортирована. Определите, в какой половине может быть target.',
      expectedOutput: 'search([4,5,6,7,0,1,2], 0) -> 4\nsearch([4,5,6,7,0,1,2], 3) -> -1\nsearch([1], 0) -> -1',
      solution: 'function search(nums, target) {\n  let lo = 0, hi = nums.length - 1;\n\n  while (lo <= hi) {\n    const mid = lo + Math.floor((hi - lo) / 2);\n\n    if (nums[mid] === target) return mid;\n\n    // Левая половина отсортирована\n    if (nums[lo] <= nums[mid]) {\n      if (nums[lo] <= target && target < nums[mid]) {\n        hi = mid - 1; // target в левой половине\n      } else {\n        lo = mid + 1; // target в правой половине\n      }\n    }\n    // Правая половина отсортирована\n    else {\n      if (nums[mid] < target && target <= nums[hi]) {\n        lo = mid + 1; // target в правой половине\n      } else {\n        hi = mid - 1; // target в левой половине\n      }\n    }\n  }\n\n  return -1;\n}\n\nconsole.log(search([4,5,6,7,0,1,2], 0)); // 4\nconsole.log(search([4,5,6,7,0,1,2], 3)); // -1\nconsole.log(search([1], 0)); // -1',
      explanation: 'Ключевой инсайт: в повёрнутом массиве на каждом шаге одна из половин [lo..mid] или [mid..hi] точно отсортирована. Мы определяем отсортированную половину, проверяем, может ли target быть в ней, и сужаем поиск. Сложность: O(log n).'
    },
    {
      id: 4,
      title: 'Практика: Find Minimum in Rotated Sorted Array',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #153: найдите минимальный элемент в повёрнутом отсортированном массиве.',
      requirements: [
        'Реализуйте функцию findMin(nums)',
        'Массив уникальных чисел был отсортирован и повёрнут',
        'Верните минимальный элемент',
        'Решение O(log n)'
      ],
      hint: 'Если nums[mid] > nums[hi], минимум в правой половине. Иначе — в левой (включая mid).',
      expectedOutput: 'findMin([3,4,5,1,2]) -> 1\nfindMin([4,5,6,7,0,1,2]) -> 0\nfindMin([11,13,15,17]) -> 11',
      solution: 'function findMin(nums) {\n  let lo = 0, hi = nums.length - 1;\n\n  while (lo < hi) {\n    const mid = lo + Math.floor((hi - lo) / 2);\n\n    if (nums[mid] > nums[hi]) {\n      // Минимум где-то справа от mid\n      lo = mid + 1;\n    } else {\n      // Минимум в [lo, mid] (mid может быть минимумом)\n      hi = mid;\n    }\n  }\n\n  return nums[lo];\n}\n\nconsole.log(findMin([3,4,5,1,2])); // 1\nconsole.log(findMin([4,5,6,7,0,1,2])); // 0\nconsole.log(findMin([11,13,15,17])); // 11 (не повёрнут)',
      explanation: 'Сравниваем mid с правым концом. Если nums[mid] > nums[hi] — разрыв (точка поворота) находится справа от mid, значит минимум тоже справа. Иначе — правая часть уже отсортирована, минимум слева (включая mid). Обратите внимание: hi = mid, а не mid - 1, потому что mid может быть ответом.'
    },
    {
      id: 5,
      title: 'Практика: Koko Eating Bananas',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #875: найдите минимальную скорость поедания бананов, чтобы успеть за h часов.',
      requirements: [
        'Реализуйте функцию minEatingSpeed(piles, h)',
        'piles[i] — количество бананов в куче i',
        'За час Коко съедает максимум k бананов из одной кучи',
        'Найдите минимальное k, при котором все бананы будут съедены за h часов'
      ],
      hint: 'Бинарный поиск по k в диапазоне [1, max(piles)]. Для каждого k проверьте, хватит ли h часов.',
      expectedOutput: 'minEatingSpeed([3,6,7,11], 8) -> 4\nminEatingSpeed([30,11,23,4,20], 5) -> 30\nminEatingSpeed([30,11,23,4,20], 6) -> 23',
      solution: 'function minEatingSpeed(piles, h) {\n  let lo = 1;\n  let hi = Math.max(...piles);\n\n  while (lo < hi) {\n    const mid = lo + Math.floor((hi - lo) / 2);\n\n    // Считаем сколько часов нужно при скорости mid\n    let hours = 0;\n    for (const pile of piles) {\n      hours += Math.ceil(pile / mid);\n    }\n\n    if (hours <= h) {\n      hi = mid; // успеваем — пробуем медленнее\n    } else {\n      lo = mid + 1; // не успеваем — нужно быстрее\n    }\n  }\n\n  return lo;\n}\n\nconsole.log(minEatingSpeed([3,6,7,11], 8)); // 4\nconsole.log(minEatingSpeed([30,11,23,4,20], 5)); // 30\nconsole.log(minEatingSpeed([30,11,23,4,20], 6)); // 23',
      explanation: 'Классическая задача на бинарный поиск по ответу. Пространство ответов: [1, max(piles)]. Монотонное свойство: если скорости k достаточно, то k+1 тоже достаточно. Проверка за O(n), бинарный поиск за O(log(max)), итого O(n * log(max)).'
    },
    {
      id: 6,
      title: 'Практика: Find Peak Element',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #162: найдите пиковый элемент — элемент, который строго больше соседей.',
      requirements: [
        'Реализуйте функцию findPeakElement(nums)',
        'nums[i] != nums[i+1] для всех i',
        'nums[-1] = nums[n] = -∞',
        'Верните индекс любого пика за O(log n)'
      ],
      hint: 'Если nums[mid] < nums[mid+1], пик находится справа (массив возрастает). Иначе — слева или в mid.',
      expectedOutput: 'findPeakElement([1,2,3,1]) -> 2\nfindPeakElement([1,2,1,3,5,6,4]) -> 1 или 5',
      solution: 'function findPeakElement(nums) {\n  let lo = 0, hi = nums.length - 1;\n\n  while (lo < hi) {\n    const mid = lo + Math.floor((hi - lo) / 2);\n\n    if (nums[mid] < nums[mid + 1]) {\n      // Восходящий склон — пик справа\n      lo = mid + 1;\n    } else {\n      // Нисходящий склон — пик слева или mid\n      hi = mid;\n    }\n  }\n\n  return lo;\n}\n\nconsole.log(findPeakElement([1,2,3,1])); // 2\nconsole.log(findPeakElement([1,2,1,3,5,6,4])); // 5',
      explanation: 'Бинарный поиск работает здесь благодаря свойству: если nums[mid] < nums[mid+1], то на интервале [mid+1, hi] гарантированно есть пик (потому что либо массив будет расти до конца, а nums[n] = -∞, либо где-то начнёт убывать). Аналогично для другой стороны. O(log n).'
    },
    {
      id: 7,
      title: 'Практика: Split Array Largest Sum',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #410: разделите массив на k подмассивов так, чтобы максимальная сумма подмассива была минимальной.',
      requirements: [
        'Реализуйте функцию splitArray(nums, k)',
        'Разделите nums на k непустых подмассивов',
        'Минимизируйте максимальную сумму среди подмассивов',
        'Используйте бинарный поиск по ответу'
      ],
      hint: 'Бинарный поиск по максимальной сумме подмассива. Для каждого значения проверьте: можно ли разделить на <= k частей?',
      expectedOutput: 'splitArray([7,2,5,10,8], 2) -> 18\nsplitArray([1,2,3,4,5], 2) -> 9\nsplitArray([1,4,4], 3) -> 4',
      solution: 'function splitArray(nums, k) {\n  let lo = Math.max(...nums);        // минимум = макс. элемент\n  let hi = nums.reduce((a, b) => a + b); // максимум = сумма всех\n\n  while (lo < hi) {\n    const mid = lo + Math.floor((hi - lo) / 2);\n\n    if (canSplit(nums, k, mid)) {\n      hi = mid; // можно — пробуем меньше\n    } else {\n      lo = mid + 1; // нельзя — нужно больше\n    }\n  }\n\n  return lo;\n}\n\n// Можно ли разделить на <= k частей с макс. суммой <= maxSum?\nfunction canSplit(nums, k, maxSum) {\n  let parts = 1;\n  let currentSum = 0;\n\n  for (const num of nums) {\n    if (currentSum + num > maxSum) {\n      parts++;\n      currentSum = num;\n      if (parts > k) return false;\n    } else {\n      currentSum += num;\n    }\n  }\n\n  return true;\n}\n\nconsole.log(splitArray([7,2,5,10,8], 2)); // 18\n// [7,2,5] и [10,8] → суммы 14 и 18 → макс = 18\n\nconsole.log(splitArray([1,2,3,4,5], 2)); // 9\n// [1,2,3,4] и [5] → нет, [1,2,3] и [4,5] → суммы 6 и 9',
      explanation: 'Бинарный поиск по ответу (максимальной сумме подмассива). Монотонность: если можно разделить с максимальной суммой X, то с X+1 тоже можно. Проверка canSplit жадно набирает элементы в текущую часть, пока сумма не превысит maxSum, затем начинает новую часть. Сложность: O(n * log(sum)).'
    }
  ]
}
