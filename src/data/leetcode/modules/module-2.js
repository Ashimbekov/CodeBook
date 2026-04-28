export default {
  id: 2,
  title: 'Two Pointers',
  description: 'Техника двух указателей для решения задач с массивами и строками за O(n).',
  lessons: [
    {
      id: 1,
      title: 'Паттерн Two Pointers',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Что такое Two Pointers?'
        },
        {
          type: 'text',
          value: 'Two Pointers — один из самых частых паттернов на собеседованиях. Идея проста: вместо перебора всех пар за O(n^2), мы используем два указателя, которые двигаются навстречу друг другу или в одном направлении, сокращая сложность до O(n).'
        },
        {
          type: 'heading',
          value: 'Два основных варианта'
        },
        {
          type: 'list',
          value: [
            'Встречные указатели (Opposite direction): left начинает с начала, right — с конца, двигаются навстречу',
            'Быстрый/медленный (Same direction): оба начинают с начала, но двигаются с разной скоростью'
          ]
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Встречные указатели — шаблон\nfunction twoPointerOpposite(arr) {\n  let left = 0;\n  let right = arr.length - 1;\n\n  while (left < right) {\n    // Проверяем условие\n    // Двигаем left вправо или right влево\n    if (/* нужно сдвинуть левый */) {\n      left++;\n    } else {\n      right--;\n    }\n  }\n}\n\n// Быстрый/медленный — шаблон\nfunction twoPointerSameDir(arr) {\n  let slow = 0;\n\n  for (let fast = 0; fast < arr.length; fast++) {\n    if (/* условие */) {\n      arr[slow] = arr[fast];\n      slow++;\n    }\n  }\n  return slow; // новая длина\n}'
        },
        {
          type: 'heading',
          value: 'Когда применять Two Pointers'
        },
        {
          type: 'list',
          value: [
            'Массив отсортирован и нужно найти пару с заданной суммой',
            'Нужно проверить палиндром',
            'Удаление дубликатов in-place',
            'Разделение массива на две части (partition)',
            'Задачи на контейнер с водой, трапецию'
          ]
        },
        {
          type: 'tip',
          value: 'Если массив отсортирован и задача о парах — почти наверняка Two Pointers!'
        }
      ]
    },
    {
      id: 2,
      title: 'Two Sum II — отсортированный массив',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'LeetCode #167: Two Sum II - Input Array Is Sorted'
        },
        {
          type: 'text',
          value: 'Дан отсортированный массив. Найдите два числа, которые в сумме дают target. Верните их индексы (1-indexed).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// LeetCode #167: Two Sum II\nfunction twoSum(numbers, target) {\n  let left = 0;\n  let right = numbers.length - 1;\n\n  while (left < right) {\n    const sum = numbers[left] + numbers[right];\n\n    if (sum === target) {\n      return [left + 1, right + 1]; // 1-indexed\n    } else if (sum < target) {\n      left++;  // нужна сумма больше — двигаем левый\n    } else {\n      right--; // нужна сумма меньше — двигаем правый\n    }\n  }\n\n  return [-1, -1]; // не найдено\n}\n\n// Почему это работает?\n// Массив отсортирован: [2, 7, 11, 15], target = 9\n// left=0, right=3: 2+15=17 > 9 → right--\n// left=0, right=2: 2+11=13 > 9 → right--\n// left=0, right=1: 2+7=9 === 9 → [1, 2] ✓\n\n// Сложность: O(n) время, O(1) память'
        },
        {
          type: 'note',
          value: 'Ключевой инсайт: если сумма слишком большая — уменьшаем правый указатель (уменьшая сумму). Если слишком маленькая — увеличиваем левый (увеличивая сумму). Массив отсортирован, поэтому это корректно.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Valid Palindrome',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #125: проверьте, является ли строка палиндромом, игнорируя не-буквенные символы и регистр.',
      requirements: [
        'Реализуйте функцию isPalindrome(s)',
        'Игнорируйте все символы кроме букв и цифр',
        'Сравнение регистронезависимое',
        'Используйте Two Pointers — O(n) время, O(1) память'
      ],
      hint: 'Используйте два указателя: left с начала, right с конца. Пропускайте не-буквенные символы. Сравнивайте символы в нижнем регистре.',
      expectedOutput: 'isPalindrome("A man, a plan, a canal: Panama") -> true\nisPalindrome("race a car") -> false\nisPalindrome(" ") -> true',
      solution: 'function isPalindrome(s) {\n  let left = 0;\n  let right = s.length - 1;\n\n  while (left < right) {\n    // Пропускаем не-буквенные символы слева\n    while (left < right && !isAlphaNum(s[left])) left++;\n    // Пропускаем не-буквенные символы справа\n    while (left < right && !isAlphaNum(s[right])) right--;\n\n    if (s[left].toLowerCase() !== s[right].toLowerCase()) {\n      return false;\n    }\n    left++;\n    right--;\n  }\n  return true;\n}\n\nfunction isAlphaNum(ch) {\n  const code = ch.charCodeAt(0);\n  return (\n    (code >= 48 && code <= 57) ||  // 0-9\n    (code >= 65 && code <= 90) ||  // A-Z\n    (code >= 97 && code <= 122)    // a-z\n  );\n}\n\nconsole.log(isPalindrome("A man, a plan, a canal: Panama")); // true\nconsole.log(isPalindrome("race a car")); // false\nconsole.log(isPalindrome(" ")); // true',
      explanation: 'Классическое применение встречных указателей. Ключевые моменты: 1) пропуск не-буквенных символов, 2) сравнение в нижнем регистре, 3) условие left < right в каждом вложенном while. Сложность O(n) по времени и O(1) по памяти — каждый символ проверяется максимум один раз.'
    },
    {
      id: 4,
      title: 'Практика: 3Sum',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #15: найдите все тройки чисел в массиве, сумма которых равна 0. Результат не должен содержать дубликатов.',
      requirements: [
        'Реализуйте функцию threeSum(nums)',
        'Верните массив всех уникальных троек [nums[i], nums[j], nums[k]] где i != j != k и nums[i] + nums[j] + nums[k] = 0',
        'Результат не должен содержать дубликатов',
        'Оптимальное решение: O(n^2) с сортировкой + Two Pointers'
      ],
      hint: 'Отсортируйте массив. Для каждого i используйте Two Pointers на оставшейся части массива. Пропускайте дубликаты.',
      expectedOutput: 'threeSum([-1,0,1,2,-1,-4]) -> [[-1,-1,2],[-1,0,1]]\nthreeSum([0,1,1]) -> []\nthreeSum([0,0,0]) -> [[0,0,0]]',
      solution: 'function threeSum(nums) {\n  const result = [];\n  nums.sort((a, b) => a - b); // Сортировка: O(n log n)\n\n  for (let i = 0; i < nums.length - 2; i++) {\n    // Пропускаем дубликаты для i\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n\n    // Оптимизация: если nums[i] > 0, дальше только больше\n    if (nums[i] > 0) break;\n\n    let left = i + 1;\n    let right = nums.length - 1;\n\n    while (left < right) {\n      const sum = nums[i] + nums[left] + nums[right];\n\n      if (sum === 0) {\n        result.push([nums[i], nums[left], nums[right]]);\n        // Пропускаем дубликаты для left и right\n        while (left < right && nums[left] === nums[left + 1]) left++;\n        while (left < right && nums[right] === nums[right - 1]) right--;\n        left++;\n        right--;\n      } else if (sum < 0) {\n        left++;\n      } else {\n        right--;\n      }\n    }\n  }\n\n  return result;\n}\n\nconsole.log(threeSum([-1,0,1,2,-1,-4]));\n// [[-1,-1,2], [-1,0,1]]\nconsole.log(threeSum([0,0,0])); // [[0,0,0]]',
      explanation: 'Это одна из самых популярных задач на собеседованиях. Ключевая идея: зафиксировать один элемент и для оставшихся двух применить Two Pointers (как в Two Sum II). Сортировка позволяет: 1) использовать Two Pointers, 2) легко пропускать дубликаты. Сложность: O(n^2) время, O(1) доп. память (не считая результат).'
    },
    {
      id: 5,
      title: 'Практика: Container With Most Water',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #11: найдите контейнер, который вмещает больше всего воды. Дан массив высот линий.',
      requirements: [
        'Реализуйте функцию maxArea(height)',
        'height[i] — высота линии в точке i',
        'Найдите две линии, которые вместе с осью X образуют контейнер с максимальным количеством воды',
        'Решение должно быть O(n)'
      ],
      hint: 'Площадь = min(height[left], height[right]) * (right - left). Двигайте указатель с меньшей высотой — это единственный способ потенциально увеличить площадь.',
      expectedOutput: 'maxArea([1,8,6,2,5,4,8,3,7]) -> 49\nmaxArea([1,1]) -> 1\nmaxArea([4,3,2,1,4]) -> 16',
      solution: 'function maxArea(height) {\n  let left = 0;\n  let right = height.length - 1;\n  let maxWater = 0;\n\n  while (left < right) {\n    const width = right - left;\n    const h = Math.min(height[left], height[right]);\n    maxWater = Math.max(maxWater, width * h);\n\n    // Двигаем указатель с меньшей высотой\n    if (height[left] < height[right]) {\n      left++;\n    } else {\n      right--;\n    }\n  }\n\n  return maxWater;\n}\n\n// Пример: height = [1,8,6,2,5,4,8,3,7]\n// Оптимальная пара: index 1 (h=8) и index 8 (h=7)\n// Площадь = min(8,7) * (8-1) = 7 * 7 = 49\n\nconsole.log(maxArea([1,8,6,2,5,4,8,3,7])); // 49\nconsole.log(maxArea([1,1])); // 1',
      explanation: 'Почему двигаем меньший указатель? Если мы двигаем больший, ширина уменьшается, а высота (ограниченная минимумом) не может увеличиться — площадь точно уменьшится. Двигая меньший указатель, мы можем надеяться найти более высокую линию. Этот greedy подход даёт оптимальный ответ за O(n).'
    },
    {
      id: 6,
      title: 'Практика: Remove Duplicates from Sorted Array',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #26: удалите дубликаты из отсортированного массива in-place и верните новую длину.',
      requirements: [
        'Реализуйте функцию removeDuplicates(nums)',
        'Удалите дубликаты in-place (не создавайте новый массив)',
        'Верните количество уникальных элементов k',
        'Первые k элементов массива должны содержать уникальные элементы',
        'Используйте паттерн fast/slow pointers'
      ],
      hint: 'slow указывает на последний уникальный элемент. fast проходит по массиву. Когда fast находит новый уникальный элемент — копируем его в позицию slow+1.',
      expectedOutput: 'removeDuplicates([1,1,2]) -> 2, nums = [1,2,...]\nremoveDuplicates([0,0,1,1,1,2,2,3,3,4]) -> 5, nums = [0,1,2,3,4,...]',
      solution: 'function removeDuplicates(nums) {\n  if (nums.length === 0) return 0;\n\n  let slow = 0; // указывает на последний уникальный\n\n  for (let fast = 1; fast < nums.length; fast++) {\n    if (nums[fast] !== nums[slow]) {\n      slow++;\n      nums[slow] = nums[fast];\n    }\n  }\n\n  return slow + 1; // количество уникальных\n}\n\n// Пример: [0,0,1,1,1,2,2,3,3,4]\n// slow=0, fast=1: 0===0 → пропуск\n// slow=0, fast=2: 1!==0 → slow=1, nums[1]=1\n// slow=1, fast=3: 1===1 → пропуск\n// slow=1, fast=4: 1===1 → пропуск\n// slow=1, fast=5: 2!==1 → slow=2, nums[2]=2\n// ... → [0,1,2,3,4,...], return 5\n\nconst nums = [0,0,1,1,1,2,2,3,3,4];\nconsole.log(removeDuplicates(nums)); // 5\nconsole.log(nums.slice(0, 5)); // [0,1,2,3,4]',
      explanation: 'Паттерн fast/slow pointers: slow отмечает позицию для записи, fast ищет следующий уникальный элемент. Так как массив отсортирован, дубликаты идут подряд. Этот паттерн часто используется для in-place модификации массивов. Сложность: O(n) время, O(1) память.'
    },
    {
      id: 7,
      title: 'Практика: Trapping Rain Water',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #42: вычислите, сколько воды можно собрать между столбцами после дождя.',
      requirements: [
        'Реализуйте функцию trap(height)',
        'height[i] — высота столбца в позиции i',
        'Верните общее количество воды, которое может быть собрано',
        'Оптимальное решение: O(n) время, O(1) память с Two Pointers'
      ],
      hint: 'Вода над позицией i = min(maxLeft, maxRight) - height[i]. Используйте два указателя и отслеживайте максимумы слева и справа.',
      expectedOutput: 'trap([0,1,0,2,1,0,1,3,2,1,2,1]) -> 6\ntrap([4,2,0,3,2,5]) -> 9',
      solution: 'function trap(height) {\n  let left = 0;\n  let right = height.length - 1;\n  let leftMax = 0;\n  let rightMax = 0;\n  let water = 0;\n\n  while (left < right) {\n    if (height[left] < height[right]) {\n      if (height[left] >= leftMax) {\n        leftMax = height[left];\n      } else {\n        water += leftMax - height[left];\n      }\n      left++;\n    } else {\n      if (height[right] >= rightMax) {\n        rightMax = height[right];\n      } else {\n        water += rightMax - height[right];\n      }\n      right--;\n    }\n  }\n\n  return water;\n}\n\n// Визуализация для [0,1,0,2,1,0,1,3,2,1,2,1]:\n//       #\n//   # ~ ~ ~ # # ~\n// ~ # # # # # # # # ~\n// 0 1 0 2 1 0 1 3 2 1 2 1\n// Вода (помечена ~): 6 единиц\n\nconsole.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // 6\nconsole.log(trap([4,2,0,3,2,5])); // 9',
      explanation: 'Это одна из самых сложных задач на Two Pointers (Hard на LeetCode). Ключевой инсайт: вода над позицией определяется минимумом из максимальных высот слева и справа. Мы двигаем указатель с меньшей стороной, потому что знаем: на другой стороне есть столбец выше или равный, значит вода ограничена нашей стороной. Сложность: O(n) время, O(1) память.'
    }
  ]
}
