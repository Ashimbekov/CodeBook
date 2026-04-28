export default {
  id: 5,
  title: 'HashMap и HashSet паттерны',
  description: 'Паттерны использования хеш-таблиц: подсчёт частот, Two Sum, группировка, кэширование.',
  lessons: [
    {
      id: 1,
      title: 'HashMap/HashSet на собеседованиях',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Зачем нужны хеш-таблицы?'
        },
        {
          type: 'text',
          value: 'HashMap (Map в JS, dict в Python) и HashSet (Set) — самые часто используемые структуры данных на собеседованиях. Они дают O(1) для поиска, вставки и удаления, что позволяет оптимизировать решения с O(n^2) до O(n).'
        },
        {
          type: 'heading',
          value: 'Основные паттерны'
        },
        {
          type: 'list',
          value: [
            'Frequency Count — подсчёт частоты каждого элемента',
            'Two Sum Pattern — найти пару с заданным свойством',
            'Grouping — группировка элементов по ключу',
            'Caching/Memoization — кэширование промежуточных результатов',
            'Existence Check — быстрая проверка "существует ли элемент?"'
          ]
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Frequency Count\nfunction countFreq(arr) {\n  const freq = new Map();\n  for (const item of arr) {\n    freq.set(item, (freq.get(item) || 0) + 1);\n  }\n  return freq;\n}\n\n// Existence Check с Set\nfunction hasDuplicate(arr) {\n  const seen = new Set();\n  for (const item of arr) {\n    if (seen.has(item)) return true;\n    seen.add(item);\n  }\n  return false;\n}\n\n// Grouping\nfunction groupBy(arr, keyFn) {\n  const groups = new Map();\n  for (const item of arr) {\n    const key = keyFn(item);\n    if (!groups.has(key)) groups.set(key, []);\n    groups.get(key).push(item);\n  }\n  return groups;\n}'
        },
        {
          type: 'tip',
          value: 'Если задача требует O(n^2) из-за поиска элемента — скорее всего можно оптимизировать до O(n) с помощью HashMap/HashSet.'
        }
      ]
    },
    {
      id: 2,
      title: 'Паттерн Two Sum и его вариации',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Классический Two Sum (LeetCode #1)'
        },
        {
          type: 'text',
          value: 'Two Sum — задача номер один на LeetCode. Она закладывает фундамент для понимания паттерна "complement lookup" (поиск дополнения).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// LeetCode #1: Two Sum\nfunction twoSum(nums, target) {\n  const map = new Map(); // число → индекс\n\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n\n  return [];\n}\n\n// Пример: nums = [2,7,11,15], target = 9\n// i=0: complement = 9-2 = 7, map = {2:0}\n// i=1: complement = 9-7 = 2, map.has(2) ✓ → [0, 1]'
        },
        {
          type: 'heading',
          value: 'Вариации Two Sum'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Two Sum: количество пар\nfunction countPairs(nums, target) {\n  const freq = new Map();\n  let count = 0;\n  for (const num of nums) {\n    const complement = target - num;\n    count += freq.get(complement) || 0;\n    freq.set(num, (freq.get(num) || 0) + 1);\n  }\n  return count;\n}\n\n// Two Sum: все уникальные пары\nfunction uniquePairs(nums, target) {\n  const seen = new Set();\n  const used = new Set();\n  const result = [];\n  for (const num of nums) {\n    const complement = target - num;\n    if (seen.has(complement) && !used.has(num)) {\n      result.push([Math.min(num, complement), Math.max(num, complement)]);\n      used.add(num);\n      used.add(complement);\n    }\n    seen.add(num);\n  }\n  return result;\n}'
        },
        {
          type: 'note',
          value: 'Паттерн complement lookup: для каждого элемента вычисляем "чего не хватает" (complement = target - current) и ищем в HashMap. Это работает для суммы, разности, XOR и других операций.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Group Anagrams',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #49: сгруппируйте строки-анаграммы вместе.',
      requirements: [
        'Реализуйте функцию groupAnagrams(strs)',
        'Сгруппируйте слова, которые являются анаграммами друг друга',
        'Верните массив групп (порядок не важен)',
        'Используйте HashMap с отсортированной строкой или частотным ключом'
      ],
      hint: 'Все анаграммы дают одинаковую строку при сортировке символов. Используйте отсортированную строку как ключ HashMap.',
      expectedOutput: 'groupAnagrams(["eat","tea","tan","ate","nat","bat"]) -> [["eat","tea","ate"],["tan","nat"],["bat"]]',
      solution: '// Решение 1: Сортировка как ключ — O(n * k * log(k))\nfunction groupAnagrams(strs) {\n  const map = new Map();\n\n  for (const str of strs) {\n    const key = [...str].sort().join("");\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(str);\n  }\n\n  return [...map.values()];\n}\n\n// Решение 2: Частотный ключ — O(n * k)\nfunction groupAnagramsFreq(strs) {\n  const map = new Map();\n\n  for (const str of strs) {\n    const count = new Array(26).fill(0);\n    for (const ch of str) {\n      count[ch.charCodeAt(0) - 97]++;\n    }\n    const key = count.join("#"); // "1#0#0#...#0" — уникальный ключ\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(str);\n  }\n\n  return [...map.values()];\n}\n\nconsole.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));\n// [["eat","tea","ate"], ["tan","nat"], ["bat"]]',
      explanation: 'Паттерн Grouping: используем HashMap для группировки по ключу. Ключ для анаграммы — либо отсортированная строка (O(k log k)), либо частотный вектор (O(k)). Второй способ быстрее для длинных строк. Общая сложность: O(n * k) для частотного ключа.'
    },
    {
      id: 4,
      title: 'Практика: Top K Frequent Elements',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #347: найдите k самых частых элементов в массиве.',
      requirements: [
        'Реализуйте функцию topKFrequent(nums, k)',
        'Верните k наиболее часто встречающихся элементов',
        'Решение должно быть лучше O(n log n)',
        'Используйте Bucket Sort подход'
      ],
      hint: 'Подсчитайте частоты. Создайте массив «корзин» где индекс = частота, значение = список элементов с этой частотой. Пройдите корзины с конца.',
      expectedOutput: 'topKFrequent([1,1,1,2,2,3], 2) -> [1,2]\ntopKFrequent([1], 1) -> [1]',
      solution: '// Bucket Sort — O(n)\nfunction topKFrequent(nums, k) {\n  // Шаг 1: подсчёт частот\n  const freq = new Map();\n  for (const num of nums) {\n    freq.set(num, (freq.get(num) || 0) + 1);\n  }\n\n  // Шаг 2: корзины (индекс = частота)\n  const buckets = new Array(nums.length + 1).fill(null).map(() => []);\n  for (const [num, count] of freq) {\n    buckets[count].push(num);\n  }\n\n  // Шаг 3: собираем k элементов с конца\n  const result = [];\n  for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {\n    for (const num of buckets[i]) {\n      result.push(num);\n      if (result.length === k) break;\n    }\n  }\n\n  return result;\n}\n\nconsole.log(topKFrequent([1,1,1,2,2,3], 2)); // [1, 2]\nconsole.log(topKFrequent([1], 1)); // [1]\n\n// Альтернатива с sort — O(n log n), но проще:\n// [...freq.entries()].sort((a,b) => b[1]-a[1]).slice(0,k).map(e => e[0])',
      explanation: 'Bucket Sort даёт O(n): 1) подсчёт частот за O(n), 2) распределение по корзинам за O(n), 3) сбор результата за O(n). Максимальная частота ≤ n, поэтому массив корзин имеет размер n+1. Это быстрее, чем использование кучи O(n log k) или сортировки O(n log n).'
    },
    {
      id: 5,
      title: 'Практика: Longest Consecutive Sequence',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #128: найдите длину наибольшей последовательности из подряд идущих чисел.',
      requirements: [
        'Реализуйте функцию longestConsecutive(nums)',
        'Найдите самую длинную последовательность вида [x, x+1, x+2, ..., x+k]',
        'Элементы не обязательно идут подряд в массиве',
        'Решение должно быть O(n) — без сортировки!'
      ],
      hint: 'Добавьте все числа в Set. Для каждого числа проверьте: если num-1 нет в Set, значит num — начало последовательности. Считайте длину.',
      expectedOutput: 'longestConsecutive([100,4,200,1,3,2]) -> 4\nlongestConsecutive([0,3,7,2,5,8,4,6,0,1]) -> 9',
      solution: 'function longestConsecutive(nums) {\n  const numSet = new Set(nums);\n  let longest = 0;\n\n  for (const num of numSet) {\n    // Начинаем последовательность только с её начала\n    if (!numSet.has(num - 1)) {\n      let currentNum = num;\n      let currentLen = 1;\n\n      while (numSet.has(currentNum + 1)) {\n        currentNum++;\n        currentLen++;\n      }\n\n      longest = Math.max(longest, currentLen);\n    }\n  }\n\n  return longest;\n}\n\nconsole.log(longestConsecutive([100,4,200,1,3,2])); // 4\n// Последовательность: [1,2,3,4]\n\nconsole.log(longestConsecutive([0,3,7,2,5,8,4,6,0,1])); // 9\n// Последовательность: [0,1,2,3,4,5,6,7,8]',
      explanation: 'Хитрость в том, чтобы начинать подсчёт только с начала последовательности (когда num-1 нет в Set). Это гарантирует, что каждый элемент проверяется максимум дважды (один раз как начало, один раз в while), давая O(n) суммарно. Без этой оптимизации было бы O(n^2).'
    },
    {
      id: 6,
      title: 'Практика: Subarray Sum Equals K',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #560: найдите количество подмассивов с суммой, равной k.',
      requirements: [
        'Реализуйте функцию subarraySum(nums, k)',
        'Подсчитайте количество подмассивов с суммой === k',
        'Массив может содержать отрицательные числа',
        'Решение O(n) с prefix sum + HashMap'
      ],
      hint: 'Prefix sum: если prefixSum[j] - prefixSum[i] = k, то подмассив [i+1..j] имеет сумму k. Храните частоту каждого prefix sum в HashMap.',
      expectedOutput: 'subarraySum([1,1,1], 2) -> 2\nsubarraySum([1,2,3], 3) -> 2\nsubarraySum([1,-1,0], 0) -> 3',
      solution: 'function subarraySum(nums, k) {\n  const prefixCount = new Map();\n  prefixCount.set(0, 1); // пустой префикс\n  let sum = 0;\n  let count = 0;\n\n  for (const num of nums) {\n    sum += num;\n    // Если sum - k встречался раньше, значит есть подмассив с суммой k\n    if (prefixCount.has(sum - k)) {\n      count += prefixCount.get(sum - k);\n    }\n    prefixCount.set(sum, (prefixCount.get(sum) || 0) + 1);\n  }\n\n  return count;\n}\n\nconsole.log(subarraySum([1,1,1], 2)); // 2\n// [1,1] начиная с индекса 0, и [1,1] начиная с индекса 1\n\nconsole.log(subarraySum([1,2,3], 3)); // 2\n// [1,2] и [3]\n\nconsole.log(subarraySum([1,-1,0], 0)); // 3\n// [1,-1], [-1,0], [1,-1,0]',
      explanation: 'Prefix Sum + HashMap — мощная комбинация. Идея: для текущей суммы sum мы ищем, сколько раз ранее встречалась сумма (sum - k). Каждое такое совпадение означает подмассив с суммой k. Инициализируем map.set(0, 1) для случая, когда весь префикс [0..i] имеет сумму k. Сложность: O(n) время, O(n) память.'
    },
    {
      id: 7,
      title: 'Практика: 4Sum II',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #454: найдите количество четвёрок (i,j,k,l) таких что nums1[i]+nums2[j]+nums3[k]+nums4[l]=0.',
      requirements: [
        'Реализуйте функцию fourSumCount(nums1, nums2, nums3, nums4)',
        'Подсчитайте количество кортежей (i,j,k,l) с суммой 0',
        'Brute force O(n^4) слишком медленно. Используйте HashMap для O(n^2)'
      ],
      hint: 'Разделите на две пары. Для всех пар (nums1[i], nums2[j]) сохраните сумму в HashMap. Для всех пар (nums3[k], nums4[l]) ищите -(sum) в HashMap.',
      expectedOutput: 'fourSumCount([1,2], [-2,-1], [-1,2], [0,2]) -> 2\nfourSumCount([0], [0], [0], [0]) -> 1',
      solution: 'function fourSumCount(nums1, nums2, nums3, nums4) {\n  const map = new Map();\n\n  // Все суммы пар из nums1 и nums2\n  for (const a of nums1) {\n    for (const b of nums2) {\n      const sum = a + b;\n      map.set(sum, (map.get(sum) || 0) + 1);\n    }\n  }\n\n  let count = 0;\n\n  // Для каждой пары из nums3 и nums4 ищем дополнение\n  for (const c of nums3) {\n    for (const d of nums4) {\n      const target = -(c + d);\n      if (map.has(target)) {\n        count += map.get(target);\n      }\n    }\n  }\n\n  return count;\n}\n\nconsole.log(fourSumCount([1,2], [-2,-1], [-1,2], [0,2])); // 2\n// (0,0,0,1): 1+(-2)+(-1)+2 = 0\n// (1,1,0,0): 2+(-1)+(-1)+0 = 0\n\nconsole.log(fourSumCount([0], [0], [0], [0])); // 1',
      explanation: 'Разделяем 4 массива на 2 группы по 2. Для первой группы за O(n^2) строим HashMap (сумма → количество пар). Для второй группы за O(n^2) ищем дополнение. Итого O(n^2) вместо O(n^4). Это обобщение паттерна Two Sum на 4 массива.'
    }
  ]
}
