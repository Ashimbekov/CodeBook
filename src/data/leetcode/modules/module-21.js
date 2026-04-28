export default {
  id: 21,
  title: 'Math задачи',
  description: 'Математические задачи: GCD, простые числа, модулярная арифметика, reservoir sampling.',
  lessons: [
    {
      id: 1,
      title: 'Математика на собеседованиях',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Основные математические приёмы'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// GCD (НОД) — алгоритм Евклида\nfunction gcd(a, b) {\n  while (b) {\n    [a, b] = [b, a % b];\n  }\n  return a;\n}\n\n// LCM (НОК)\nfunction lcm(a, b) {\n  return (a / gcd(a, b)) * b;\n}\n\n// Проверка простого числа — O(sqrt(n))\nfunction isPrime(n) {\n  if (n < 2) return false;\n  if (n < 4) return true;\n  if (n % 2 === 0 || n % 3 === 0) return false;\n  for (let i = 5; i * i <= n; i += 6) {\n    if (n % i === 0 || n % (i + 2) === 0) return false;\n  }\n  return true;\n}\n\n// Решето Эратосфена — все простые до n\nfunction sieveOfEratosthenes(n) {\n  const isPrime = new Array(n + 1).fill(true);\n  isPrime[0] = isPrime[1] = false;\n  for (let i = 2; i * i <= n; i++) {\n    if (isPrime[i]) {\n      for (let j = i * i; j <= n; j += i) {\n        isPrime[j] = false;\n      }\n    }\n  }\n  return isPrime.reduce((acc, v, i) => v ? [...acc, i] : acc, []);\n}\n\n// Быстрое возведение в степень — O(log n)\nfunction power(base, exp, mod) {\n  let result = 1;\n  base %= mod;\n  while (exp > 0) {\n    if (exp & 1) result = (result * base) % mod;\n    exp >>= 1;\n    base = (base * base) % mod;\n  }\n  return result;\n}'
        },
        {
          type: 'tip',
          value: 'На собеседованиях математические задачи часто проверяют "за гранью кода": умение находить паттерны, формулы, edge cases с нулём и отрицательными числами.'
        }
      ]
    },
    {
      id: 2,
      title: 'Паттерны математических задач',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Частые паттерны'
        },
        {
          type: 'list',
          value: [
            'Modular Arithmetic: (a*b) % m = ((a%m)*(b%m)) % m',
            'Формула суммы: 1+2+...+n = n*(n+1)/2',
            'Pigeonhole Principle: если n+1 объектов в n ящиках, один содержит минимум 2',
            'Reservoir Sampling: случайный выбор k из потока неизвестной длины',
            'Boyer-Moore Voting: нахождение элемента большинства за O(1) памяти'
          ]
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Boyer-Moore Voting Algorithm (LeetCode #169)\n// Элемент, встречающийся > n/2 раз\nfunction majorityElement(nums) {\n  let candidate = nums[0];\n  let count = 1;\n\n  for (let i = 1; i < nums.length; i++) {\n    if (count === 0) {\n      candidate = nums[i];\n      count = 1;\n    } else if (nums[i] === candidate) {\n      count++;\n    } else {\n      count--;\n    }\n  }\n\n  return candidate;\n}\n\n// Reservoir Sampling (случайный элемент из потока)\n// Каждый i-й элемент выбирается с вероятностью 1/i\nfunction getRandom(stream) {\n  let result = null;\n  let count = 0;\n  for (const item of stream) {\n    count++;\n    if (Math.random() < 1 / count) {\n      result = item;\n    }\n  }\n  return result;\n}'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Pow(x, n)',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #50: вычислите x в степени n.',
      requirements: [
        'Реализуйте функцию myPow(x, n)',
        'n может быть отрицательным',
        'Используйте быстрое возведение в степень — O(log n)',
        'Не используйте Math.pow'
      ],
      hint: 'x^n = (x^(n/2))^2 если n чётное. Если n отрицательное: x^(-n) = 1/(x^n).',
      expectedOutput: 'myPow(2.0, 10) -> 1024.0\nmyPow(2.1, 3) -> 9.261\nmyPow(2.0, -2) -> 0.25',
      solution: 'function myPow(x, n) {\n  if (n === 0) return 1;\n  if (n < 0) {\n    x = 1 / x;\n    n = -n;\n  }\n\n  let result = 1;\n  while (n > 0) {\n    if (n & 1) result *= x; // нечётная степень\n    x *= x;\n    n >>= 1;\n  }\n\n  return result;\n}\n\n// Рекурсивная версия\nfunction myPowRec(x, n) {\n  if (n === 0) return 1;\n  if (n < 0) return myPowRec(1 / x, -n);\n  if (n & 1) return x * myPowRec(x, n - 1);\n  const half = myPowRec(x, n / 2);\n  return half * half;\n}\n\nconsole.log(myPow(2.0, 10)); // 1024\nconsole.log(myPow(2.1, 3)); // 9.261...\nconsole.log(myPow(2.0, -2)); // 0.25',
      explanation: 'Быстрое возведение в степень: x^10 = (x^5)^2 = (x*(x^2)^2)^2. На каждом шаге возводим x в квадрат и делим n на 2. Если n нечётное — умножаем результат на x. O(log n) вместо O(n). Важно: n<0 → x=1/x, n=-n.'
    },
    {
      id: 4,
      title: 'Практика: Happy Number',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #202: определите, является ли число "счастливым".',
      requirements: [
        'Реализуйте функцию isHappy(n)',
        'Заменяйте число суммой квадратов его цифр',
        'Если процесс приводит к 1 — число счастливое',
        'Если зацикливается — не счастливое',
        'Используйте Floyd\'s cycle detection или Set'
      ],
      hint: 'Если число не счастливое, последовательность зацикливается. Используйте Set для обнаружения цикла или fast/slow pointers.',
      expectedOutput: 'isHappy(19) -> true\nisHappy(2) -> false',
      solution: 'function isHappy(n) {\n  const seen = new Set();\n\n  while (n !== 1 && !seen.has(n)) {\n    seen.add(n);\n    n = sumOfSquares(n);\n  }\n\n  return n === 1;\n}\n\nfunction sumOfSquares(n) {\n  let sum = 0;\n  while (n > 0) {\n    const digit = n % 10;\n    sum += digit * digit;\n    n = Math.floor(n / 10);\n  }\n  return sum;\n}\n\n// Floyd\'s cycle detection (O(1) память)\nfunction isHappyFloyd(n) {\n  let slow = n;\n  let fast = sumOfSquares(n);\n\n  while (fast !== 1 && slow !== fast) {\n    slow = sumOfSquares(slow);\n    fast = sumOfSquares(sumOfSquares(fast));\n  }\n\n  return fast === 1;\n}\n\nconsole.log(isHappy(19)); // true\n// 19 → 82 → 68 → 100 → 1 ✓\nconsole.log(isHappy(2)); // false',
      explanation: 'Последовательность сумм квадратов цифр либо достигает 1, либо входит в цикл. Используем Set для обнаружения цикла. Floyd\'s algorithm: slow двигается на 1 шаг, fast на 2. Если fast достигает 1 — счастливое. Если slow === fast — цикл.'
    },
    {
      id: 5,
      title: 'Практика: Count Primes',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #204: подсчитайте количество простых чисел меньше n.',
      requirements: [
        'Реализуйте функцию countPrimes(n)',
        'Верните количество простых чисел строго меньше n',
        'Используйте решето Эратосфена — O(n log log n)'
      ],
      hint: 'Решето: создайте массив boolean. Для каждого простого p помечайте p*p, p*p+p, p*p+2p, ... как составные.',
      expectedOutput: 'countPrimes(10) -> 4\ncountPrimes(0) -> 0\ncountPrimes(1) -> 0',
      solution: 'function countPrimes(n) {\n  if (n <= 2) return 0;\n\n  const isPrime = new Array(n).fill(true);\n  isPrime[0] = isPrime[1] = false;\n\n  for (let i = 2; i * i < n; i++) {\n    if (isPrime[i]) {\n      for (let j = i * i; j < n; j += i) {\n        isPrime[j] = false;\n      }\n    }\n  }\n\n  return isPrime.filter(Boolean).length;\n}\n\nconsole.log(countPrimes(10)); // 4 (2, 3, 5, 7)\nconsole.log(countPrimes(100)); // 25\n\n// Оптимизация: начинаем с j = i*i (все меньшие уже помечены)\n// Проверяем только до sqrt(n)',
      explanation: 'Решето Эратосфена: для каждого простого числа p вычёркиваем все его кратные начиная с p^2 (меньшие кратные уже вычеркнуты). Оптимизация: проверяем только до sqrt(n). Сложность: O(n log log n), что близко к O(n). Один из самых эффективных алгоритмов для генерации простых.'
    },
    {
      id: 6,
      title: 'Практика: Rotate Image',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #48: поверните матрицу NxN на 90 градусов по часовой стрелке in-place.',
      requirements: [
        'Реализуйте функцию rotate(matrix)',
        'Поворот на 90 градусов по часовой стрелке',
        'Модификация in-place (без создания новой матрицы)'
      ],
      hint: 'Два шага: 1) транспонирование (строки ↔ столбцы), 2) реверс каждой строки.',
      expectedOutput: 'rotate([[1,2,3],[4,5,6],[7,8,9]]) -> [[7,4,1],[8,5,2],[9,6,3]]',
      solution: 'function rotate(matrix) {\n  const n = matrix.length;\n\n  // Шаг 1: Транспонирование\n  for (let i = 0; i < n; i++) {\n    for (let j = i + 1; j < n; j++) {\n      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];\n    }\n  }\n\n  // Шаг 2: Реверс каждой строки\n  for (let i = 0; i < n; i++) {\n    matrix[i].reverse();\n  }\n}\n\nconst m = [[1,2,3],[4,5,6],[7,8,9]];\nrotate(m);\nconsole.log(m); // [[7,4,1],[8,5,2],[9,6,3]]\n\n// Транспонирование:\n// 1 2 3    1 4 7\n// 4 5 6 → 2 5 8\n// 7 8 9    3 6 9\n\n// Реверс строк:\n// 7 4 1\n// 8 5 2\n// 9 6 3',
      explanation: 'Математический инсайт: поворот на 90° = транспонирование + реверс строк. Поворот на 270° (или -90°) = транспонирование + реверс столбцов. Поворот на 180° = реверс строк + реверс столбцов. Оба шага in-place, O(n^2) время, O(1) память.'
    },
    {
      id: 7,
      title: 'Практика: Spiral Matrix',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #54: обойдите матрицу по спирали.',
      requirements: [
        'Реализуйте функцию spiralOrder(matrix)',
        'Верните элементы матрицы в порядке спирали (по часовой стрелке)',
        'Начиная с левого верхнего угла'
      ],
      hint: 'Четыре границы: top, bottom, left, right. На каждом витке обходим 4 стороны и сужаем границы.',
      expectedOutput: 'spiralOrder([[1,2,3],[4,5,6],[7,8,9]]) -> [1,2,3,6,9,8,7,4,5]',
      solution: 'function spiralOrder(matrix) {\n  const result = [];\n  let top = 0, bottom = matrix.length - 1;\n  let left = 0, right = matrix[0].length - 1;\n\n  while (top <= bottom && left <= right) {\n    // Вправо по верхней строке\n    for (let c = left; c <= right; c++) {\n      result.push(matrix[top][c]);\n    }\n    top++;\n\n    // Вниз по правому столбцу\n    for (let r = top; r <= bottom; r++) {\n      result.push(matrix[r][right]);\n    }\n    right--;\n\n    // Влево по нижней строке\n    if (top <= bottom) {\n      for (let c = right; c >= left; c--) {\n        result.push(matrix[bottom][c]);\n      }\n      bottom--;\n    }\n\n    // Вверх по левому столбцу\n    if (left <= right) {\n      for (let r = bottom; r >= top; r--) {\n        result.push(matrix[r][left]);\n      }\n      left++;\n    }\n  }\n\n  return result;\n}\n\nconsole.log(spiralOrder([[1,2,3],[4,5,6],[7,8,9]]));\n// [1,2,3,6,9,8,7,4,5]',
      explanation: 'Четыре указателя (top, bottom, left, right) определяют текущие границы спирали. На каждом витке обходим 4 стороны: вправо, вниз, влево, вверх. После каждой стороны сужаем соответствующую границу. Проверки top<=bottom и left<=right предотвращают повторный обход для нечётных размеров.'
    }
  ]
}
