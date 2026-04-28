export default {
  id: 3,
  title: 'Sliding Window',
  description: 'Техника скользящего окна для задач на подмассивы и подстроки за O(n).',
  lessons: [
    {
      id: 1,
      title: 'Паттерн Sliding Window',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Что такое скользящее окно?'
        },
        {
          type: 'text',
          value: 'Sliding Window — это техника, при которой мы поддерживаем «окно» (подмассив/подстроку) и двигаем его по массиву/строке. Вместо пересчёта с нуля при каждом сдвиге, мы обновляем результат инкрементально — добавляя новый элемент и убирая старый.'
        },
        {
          type: 'heading',
          value: 'Два типа окна'
        },
        {
          type: 'list',
          value: [
            'Фиксированный размер: окно всегда имеет длину k (например, максимальная сумма подмассива длины k)',
            'Переменный размер: окно растёт и сжимается в зависимости от условия (например, наименьший подмассив с суммой >= target)'
          ]
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Фиксированное окно размера k\nfunction fixedWindow(arr, k) {\n  let windowSum = 0;\n  // Инициализируем первое окно\n  for (let i = 0; i < k; i++) {\n    windowSum += arr[i];\n  }\n  let maxSum = windowSum;\n  // Сдвигаем окно\n  for (let i = k; i < arr.length; i++) {\n    windowSum += arr[i] - arr[i - k]; // добавляем новый, убираем старый\n    maxSum = Math.max(maxSum, windowSum);\n  }\n  return maxSum;\n}\n\n// Переменное окно\nfunction variableWindow(arr, target) {\n  let left = 0, windowSum = 0, minLen = Infinity;\n  for (let right = 0; right < arr.length; right++) {\n    windowSum += arr[right]; // расширяем окно\n    while (windowSum >= target) { // сжимаем окно\n      minLen = Math.min(minLen, right - left + 1);\n      windowSum -= arr[left];\n      left++;\n    }\n  }\n  return minLen === Infinity ? 0 : minLen;\n}'
        },
        {
          type: 'tip',
          value: 'Ключевое отличие от brute force: вместо O(n*k) мы получаем O(n), потому что каждый элемент входит и выходит из окна максимум один раз.'
        }
      ]
    },
    {
      id: 2,
      title: 'Sliding Window с HashMap',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Окно с подсчётом частот'
        },
        {
          type: 'text',
          value: 'Часто Sliding Window комбинируется с HashMap для подсчёта частот символов или элементов в текущем окне. Это особенно полезно для задач на строки.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Шаблон: Sliding Window + HashMap для строк\nfunction slidingWindowMap(s) {\n  const map = new Map(); // частоты символов в окне\n  let left = 0;\n  let result = 0;\n\n  for (let right = 0; right < s.length; right++) {\n    // Расширяем окно: добавляем s[right]\n    map.set(s[right], (map.get(s[right]) || 0) + 1);\n\n    // Сжимаем окно, пока условие нарушено\n    while (/* окно невалидно */) {\n      map.set(s[left], map.get(s[left]) - 1);\n      if (map.get(s[left]) === 0) map.delete(s[left]);\n      left++;\n    }\n\n    // Обновляем результат\n    result = Math.max(result, right - left + 1);\n  }\n\n  return result;\n}'
        },
        {
          type: 'note',
          value: 'Паттерн «расширяй правый, сжимай левый» — основа почти всех задач Sliding Window. Правый указатель всегда двигается вперёд, левый — только когда окно становится невалидным.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Maximum Average Subarray',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #643: найдите подмассив длины k с максимальным средним значением.',
      requirements: [
        'Реализуйте функцию findMaxAverage(nums, k)',
        'Найдите подмассив длины k с максимальной средней',
        'Верните максимальное среднее значение',
        'Используйте фиксированное окно — O(n)'
      ],
      hint: 'Вычислите сумму первого окна. Затем сдвигайте: прибавляйте новый элемент, вычитайте старый. Делить на k нужно только в конце.',
      expectedOutput: 'findMaxAverage([1,12,-5,-6,50,3], 4) -> 12.75\nfindMaxAverage([5], 1) -> 5.0',
      solution: 'function findMaxAverage(nums, k) {\n  let windowSum = 0;\n\n  // Сумма первого окна\n  for (let i = 0; i < k; i++) {\n    windowSum += nums[i];\n  }\n\n  let maxSum = windowSum;\n\n  // Сдвигаем окно\n  for (let i = k; i < nums.length; i++) {\n    windowSum += nums[i] - nums[i - k];\n    maxSum = Math.max(maxSum, windowSum);\n  }\n\n  return maxSum / k;\n}\n\nconsole.log(findMaxAverage([1,12,-5,-6,50,3], 4)); // 12.75\n// Подмассив [12,-5,-6,50] → сумма 51 → среднее 12.75\n\nconsole.log(findMaxAverage([5], 1)); // 5.0',
      explanation: 'Классическое фиксированное скользящее окно. Вместо пересчёта суммы с нуля для каждого окна (O(n*k)), мы обновляем сумму за O(1): прибавляем входящий элемент, вычитаем выходящий. Итоговая сложность: O(n) время, O(1) память.'
    },
    {
      id: 4,
      title: 'Практика: Longest Substring Without Repeating',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #3: найдите длину наибольшей подстроки без повторяющихся символов.',
      requirements: [
        'Реализуйте функцию lengthOfLongestSubstring(s)',
        'Найдите длину наибольшей подстроки, в которой все символы уникальны',
        'Используйте Sliding Window + Set или Map'
      ],
      hint: 'Расширяйте окно вправо. Если символ уже есть в окне — сжимайте слева, пока дубликат не будет удалён.',
      expectedOutput: 'lengthOfLongestSubstring("abcabcbb") -> 3\nlengthOfLongestSubstring("bbbbb") -> 1\nlengthOfLongestSubstring("pwwkew") -> 3\nlengthOfLongestSubstring("") -> 0',
      solution: '// Решение с Set\nfunction lengthOfLongestSubstring(s) {\n  const set = new Set();\n  let left = 0;\n  let maxLen = 0;\n\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) {\n      set.delete(s[left]);\n      left++;\n    }\n    set.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n\n  return maxLen;\n}\n\n// Оптимизированное решение с Map (прыжок left сразу)\nfunction lengthOfLongestSubstringOpt(s) {\n  const map = new Map(); // символ → последний индекс\n  let left = 0;\n  let maxLen = 0;\n\n  for (let right = 0; right < s.length; right++) {\n    if (map.has(s[right]) && map.get(s[right]) >= left) {\n      left = map.get(s[right]) + 1;\n    }\n    map.set(s[right], right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n\n  return maxLen;\n}\n\nconsole.log(lengthOfLongestSubstring("abcabcbb")); // 3 ("abc")\nconsole.log(lengthOfLongestSubstring("bbbbb")); // 1 ("b")\nconsole.log(lengthOfLongestSubstring("pwwkew")); // 3 ("wke")',
      explanation: 'Одна из самых популярных задач на собеседованиях. Решение с Set: когда встречаем дубликат, удаляем символы слева, пока дубликат не исчезнет. Решение с Map: запоминаем индекс каждого символа и «прыгаем» left сразу за дубликат. Оба работают за O(n), но Map-версия быстрее на практике.'
    },
    {
      id: 5,
      title: 'Практика: Minimum Size Subarray Sum',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #209: найдите наименьший подмассив, сумма которого >= target.',
      requirements: [
        'Реализуйте функцию minSubArrayLen(target, nums)',
        'Найдите минимальную длину подмассива, сумма которого >= target',
        'Если такого подмассива нет — верните 0',
        'Решение должно быть O(n)'
      ],
      hint: 'Расширяйте окно вправо, прибавляя элементы. Когда сумма >= target, сжимайте слева, обновляя минимальную длину.',
      expectedOutput: 'minSubArrayLen(7, [2,3,1,2,4,3]) -> 2\nminSubArrayLen(4, [1,4,4]) -> 1\nminSubArrayLen(11, [1,1,1,1,1,1,1,1]) -> 0',
      solution: 'function minSubArrayLen(target, nums) {\n  let left = 0;\n  let sum = 0;\n  let minLen = Infinity;\n\n  for (let right = 0; right < nums.length; right++) {\n    sum += nums[right];\n\n    while (sum >= target) {\n      minLen = Math.min(minLen, right - left + 1);\n      sum -= nums[left];\n      left++;\n    }\n  }\n\n  return minLen === Infinity ? 0 : minLen;\n}\n\nconsole.log(minSubArrayLen(7, [2,3,1,2,4,3])); // 2\n// Подмассив [4,3] → сумма 7 >= 7, длина 2\n\nconsole.log(minSubArrayLen(4, [1,4,4])); // 1\n// Подмассив [4] → сумма 4 >= 4, длина 1\n\nconsole.log(minSubArrayLen(11, [1,1,1,1,1,1,1,1])); // 0\n// Сумма всего массива = 8 < 11',
      explanation: 'Классический пример переменного скользящего окна. Правый указатель расширяет окно, увеличивая сумму. Когда сумма достаточна — сжимаем левый, ища минимальную длину. Каждый элемент обрабатывается максимум дважды (вход и выход из окна), поэтому O(n).'
    },
    {
      id: 6,
      title: 'Практика: Permutation in String',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #567: проверьте, содержит ли строка s2 перестановку строки s1 как подстроку.',
      requirements: [
        'Реализуйте функцию checkInclusion(s1, s2)',
        'Верните true, если какая-либо перестановка s1 является подстрокой s2',
        'Используйте фиксированное окно размера s1.length + HashMap'
      ],
      hint: 'Создайте частотную карту s1. Скользите окном длины s1.length по s2, поддерживая частотную карту окна. Если карты совпадают — ответ true.',
      expectedOutput: 'checkInclusion("ab", "eidbaooo") -> true\ncheckInclusion("ab", "eidboaoo") -> false\ncheckInclusion("adc", "dcda") -> true',
      solution: 'function checkInclusion(s1, s2) {\n  if (s1.length > s2.length) return false;\n\n  const s1Count = new Array(26).fill(0);\n  const windowCount = new Array(26).fill(0);\n  const a = "a".charCodeAt(0);\n\n  // Подсчёт частот s1\n  for (const ch of s1) {\n    s1Count[ch.charCodeAt(0) - a]++;\n  }\n\n  // Инициализация первого окна\n  for (let i = 0; i < s1.length; i++) {\n    windowCount[s2.charCodeAt(i) - a]++;\n  }\n\n  // Проверяем совпадение\n  let matches = 0;\n  for (let i = 0; i < 26; i++) {\n    if (s1Count[i] === windowCount[i]) matches++;\n  }\n\n  // Сдвигаем окно\n  for (let i = s1.length; i < s2.length; i++) {\n    if (matches === 26) return true;\n\n    // Добавляем правый символ\n    const idxR = s2.charCodeAt(i) - a;\n    windowCount[idxR]++;\n    if (windowCount[idxR] === s1Count[idxR]) matches++;\n    else if (windowCount[idxR] === s1Count[idxR] + 1) matches--;\n\n    // Убираем левый символ\n    const idxL = s2.charCodeAt(i - s1.length) - a;\n    windowCount[idxL]--;\n    if (windowCount[idxL] === s1Count[idxL]) matches++;\n    else if (windowCount[idxL] === s1Count[idxL] - 1) matches--;\n  }\n\n  return matches === 26;\n}\n\nconsole.log(checkInclusion("ab", "eidbaooo")); // true ("ba")\nconsole.log(checkInclusion("ab", "eidboaoo")); // false',
      explanation: 'Оптимизация через подсчёт совпадающих частот (matches). Вместо сравнения двух массивов за O(26) на каждом шаге, мы обновляем счётчик matches инкрементально за O(1). Когда matches === 26 — все 26 букв имеют одинаковую частоту, значит окно — перестановка s1. Сложность: O(n) время, O(1) память.'
    },
    {
      id: 7,
      title: 'Практика: Minimum Window Substring',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #76: найдите минимальную подстроку s, содержащую все символы строки t.',
      requirements: [
        'Реализуйте функцию minWindow(s, t)',
        'Верните минимальную подстроку s, которая содержит все символы t (включая дубликаты)',
        'Если такой подстроки нет — верните пустую строку',
        'Решение O(n) с переменным окном + HashMap'
      ],
      hint: 'Расширяйте окно вправо, добавляя символы. Когда окно содержит все символы t — сжимайте слева, запоминая минимальную длину.',
      expectedOutput: 'minWindow("ADOBECODEBANC", "ABC") -> "BANC"\nminWindow("a", "a") -> "a"\nminWindow("a", "aa") -> ""',
      solution: 'function minWindow(s, t) {\n  if (t.length > s.length) return "";\n\n  const need = new Map(); // сколько нужно каждого символа\n  for (const ch of t) {\n    need.set(ch, (need.get(ch) || 0) + 1);\n  }\n\n  let have = 0;            // сколько символов полностью покрыто\n  const required = need.size; // сколько уникальных символов нужно\n  const window = new Map();\n\n  let minLen = Infinity;\n  let minStart = 0;\n  let left = 0;\n\n  for (let right = 0; right < s.length; right++) {\n    const ch = s[right];\n    window.set(ch, (window.get(ch) || 0) + 1);\n\n    // Если частота символа в окне совпала с нужной\n    if (need.has(ch) && window.get(ch) === need.get(ch)) {\n      have++;\n    }\n\n    // Сжимаем окно, пока оно валидно\n    while (have === required) {\n      const len = right - left + 1;\n      if (len < minLen) {\n        minLen = len;\n        minStart = left;\n      }\n\n      const leftCh = s[left];\n      window.set(leftCh, window.get(leftCh) - 1);\n      if (need.has(leftCh) && window.get(leftCh) < need.get(leftCh)) {\n        have--;\n      }\n      left++;\n    }\n  }\n\n  return minLen === Infinity ? "" : s.substring(minStart, minStart + minLen);\n}\n\nconsole.log(minWindow("ADOBECODEBANC", "ABC")); // "BANC"\nconsole.log(minWindow("a", "a")); // "a"\nconsole.log(minWindow("a", "aa")); // ""',
      explanation: 'Это Hard-задача, которую очень любят на собеседованиях в FAANG. Ключевая идея: отслеживаем have (сколько уникальных символов полностью покрыто) и required (сколько всего нужно). Когда have === required — окно валидно, можно сжимать. Сложность: O(|s| + |t|) время, O(|s| + |t|) память.'
    }
  ]
}
