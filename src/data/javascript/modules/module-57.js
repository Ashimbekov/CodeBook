export default {
  id: 57,
  title: 'Практикум — Easy задачи',
  description: 'Лёгкие практические задачи для разминки: строки, числа, массивы, простые алгоритмы',
  lessons: [
    {
      id: 1,
      title: 'Реверс строки',
      type: 'practice',
      difficulty: 'easy',
      description: 'Функция reverseString(str): перевернуть строку. Без использования reverse(). Три реализации: цикл, рекурсия, reduce.',
      requirements: [
        'reverseString("hello") -> "olleh"',
        'reverseString("") -> ""',
        'reverseString("а") -> "а"'
      ],
      solution: {
        code: '// Через цикл\nfunction reverseLoop(str) {\n  let result = "";\n  for (let i = str.length - 1; i >= 0; i--) result += str[i];\n  return result;\n}\n\n// Через рекурсию\nfunction reverseRecursive(str) {\n  if (str.length <= 1) return str;\n  return reverseRecursive(str.slice(1)) + str[0];\n}\n\n// Через reduce\nconst reverseReduce = (str) =>\n  str.split("").reduce((acc, ch) => ch + acc, "");\n\nconsole.log(reverseLoop("hello"));       // "olleh"\nconsole.log(reverseRecursive("world")); // "dlrow"\nconsole.log(reverseReduce("JavaScript")); // "tpircSavaJ"',
        language: 'javascript'
      },
      explanation: 'Три подхода демонстрируют разные техники. Цикл: итерируем с конца — просто и эффективно O(n). Рекурсия: reverseRecursive(str) = reverseRecursive(str без первого символа) + первый символ — элегантно но O(n) по памяти из-за стека. reduce: ch + acc добавляет каждый символ в начало накопителя — функциональный стиль. Важно: concat строк в JS создаёт новую строку на каждой итерации — для очень длинных строк лучше использовать массив и join.'
    },
    {
      id: 2,
      title: 'Проверка простого числа',
      type: 'practice',
      difficulty: 'easy',
      description: 'Функция isPrime(n): проверяет является ли число простым. И функция getPrimes(max): возвращает все простые до max.',
      requirements: [
        'isPrime(2) -> true, isPrime(4) -> false',
        'isPrime(1) -> false',
        'getPrimes(20) -> [2, 3, 5, 7, 11, 13, 17, 19]',
        'Алгоритм решета Эратосфена для getPrimes'
      ],
      solution: {
        code: 'function isPrime(n) {\n  if (n < 2) return false;\n  if (n === 2) return true;\n  if (n % 2 === 0) return false;\n  for (let i = 3; i <= Math.sqrt(n); i += 2) {\n    if (n % i === 0) return false;\n  }\n  return true;\n}\n\n// Решето Эратосфена\nfunction getPrimes(max) {\n  const sieve = new Array(max + 1).fill(true);\n  sieve[0] = sieve[1] = false;\n  for (let i = 2; i * i <= max; i++) {\n    if (sieve[i]) {\n      for (let j = i * i; j <= max; j += i) sieve[j] = false;\n    }\n  }\n  return sieve.reduce((primes, isPrime, i) => isPrime ? [...primes, i] : primes, []);\n}\n\nconsole.log(isPrime(17));        // true\nconsole.log(isPrime(15));        // false\nconsole.log(getPrimes(30));      // [2,3,5,7,11,13,17,19,23,29]',
        language: 'javascript'
      },
      explanation: 'isPrime: оптимизации — проверяем до sqrt(n) (если n = a*b то меньший множитель <= sqrt(n)), пропускаем чётные числа кроме 2. Шаг i += 2 вдвое сокращает итерации. Решето Эратосфена: начинаем с i*i (все меньшие кратные уже отмечены предыдущими простыми). Сложность O(n log log n) — почти линейная. Применение: проверка простоты в криптографии, генерация простых чисел для хэш-таблиц.'
    },
    {
      id: 3,
      title: 'Максимальная прибыль',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив цен акций. Найдите максимальную прибыль при одной покупке и одной продаже. Купить нужно до продажи.',
      requirements: [
        'maxProfit([7,1,5,3,6,4]) -> 5 (купить за 1, продать за 6)',
        'maxProfit([7,6,4,3,1]) -> 0 (нет прибыли)',
        'maxProfit([1]) -> 0 (нечего продавать)',
        'Сложность O(n)'
      ],
      solution: {
        code: 'function maxProfit(prices) {\n  if (prices.length < 2) return 0;\n  let minPrice = Infinity;\n  let maxPr = 0;\n  for (const price of prices) {\n    if (price < minPrice) {\n      minPrice = price;\n    } else if (price - minPrice > maxPr) {\n      maxPr = price - minPrice;\n    }\n  }\n  return maxPr;\n}\n\nconsole.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5\nconsole.log(maxProfit([7, 6, 4, 3, 1]));    // 0\nconsole.log(maxProfit([2, 4, 1]));           // 2',
        language: 'javascript'
      },
      explanation: 'Жадный алгоритм за один проход O(n): отслеживаем минимальную цену покупки и максимальную прибыль одновременно. На каждом шаге: если текущая цена меньше минимума — обновляем минимум (лучший момент для покупки); иначе проверяем текущую прибыль. Ключевой инсайт: оптимальная продажа всегда происходит после оптимальной покупки, поэтому один проход слева направо достаточен. 0 при убывающих ценах — нет смысла торговать.'
    },
    {
      id: 4,
      title: 'Скобки',
      type: 'practice',
      difficulty: 'easy',
      description: 'Функция isValidBrackets(str): проверяет правильность расстановки скобок. Поддерживает (), [], {}.',
      requirements: [
        'isValidBrackets("()") -> true',
        'isValidBrackets("([{}])") -> true',
        'isValidBrackets("(]") -> false',
        'isValidBrackets("((") -> false',
        'Используйте стек'
      ],
      solution: {
        code: 'function isValidBrackets(str) {\n  const pairs = { ")": "(", "]": "[", "}": "{" };\n  const stack = [];\n\n  for (const char of str) {\n    if (["(", "[", "{"].includes(char)) {\n      stack.push(char);\n    } else if (char in pairs) {\n      if (stack.pop() !== pairs[char]) return false;\n    }\n  }\n\n  return stack.length === 0;\n}\n\nconsole.log(isValidBrackets("()"));       // true\nconsole.log(isValidBrackets("([{}])"));   // true\nconsole.log(isValidBrackets("(]"));       // false\nconsole.log(isValidBrackets("{[()]}"));   // true\nconsole.log(isValidBrackets("(("));       // false',
        language: 'javascript'
      },
      explanation: 'Классическое применение стека: открывающие скобки кладём в стек, закрывающие — проверяем что вершина стека соответствует парной открывающей. pairs объект хранит соответствия закрывающая->открывающая. stack.pop() одновременно извлекает и возвращает вершину. Финальная проверка stack.length === 0: если стек пуст — все скобки закрыты. Неправильно: стек не пуст ("(("), или pop вернул неправильную скобку ("(]").'
    },
    {
      id: 5,
      title: 'Два числа дающих сумму',
      type: 'practice',
      difficulty: 'easy',
      description: 'twoSum(nums, target): найти два числа в массиве сумма которых равна target. Вернуть индексы. Сложность O(n).',
      requirements: [
        'twoSum([2, 7, 11, 15], 9) -> [0, 1]',
        'twoSum([3, 2, 4], 6) -> [1, 2]',
        'Гарантировано что решение одно',
        'Использовать HashMap для O(n)'
      ],
      solution: {
        code: 'function twoSum(nums, target) {\n  const seen = new Map(); // число -> индекс\n\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (seen.has(complement)) {\n      return [seen.get(complement), i];\n    }\n    seen.set(nums[i], i);\n  }\n\n  return [];\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));  // [0, 1]\nconsole.log(twoSum([3, 2, 4], 6));       // [1, 2]\nconsole.log(twoSum([3, 3], 6));          // [0, 1]',
        language: 'javascript'
      },
      explanation: 'HashMap подход O(n) вместо вложенных циклов O(n^2). Идея: для каждого числа x ищем его "дополнение" target-x в уже просмотренных числах. seen хранит число->индекс для быстрого поиска O(1). Важный порядок: сначала проверяем seen.has(complement), потом добавляем текущий элемент — это обрабатывает случай [3,3] с target=6 корректно (не используем один элемент дважды).'
    },
    {
      id: 6,
      title: 'Анаграммы в массиве',
      type: 'practice',
      difficulty: 'easy',
      description: 'groupAnagrams(words): сгруппировать слова-анаграммы вместе. Вернуть массив групп.',
      requirements: [
        'groupAnagrams(["eat","tea","tan","ate","nat","bat"]) -> [["eat","tea","ate"],["tan","nat"],["bat"]]',
        'Порядок групп не важен',
        'Используйте отсортированное слово как ключ'
      ],
      solution: {
        code: 'function groupAnagrams(words) {\n  const groups = new Map();\n\n  for (const word of words) {\n    const key = word.toLowerCase().split("").sort().join("");\n    if (!groups.has(key)) groups.set(key, []);\n    groups.get(key).push(word);\n  }\n\n  return [...groups.values()];\n}\n\nconsole.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));\n// [["eat","tea","ate"], ["tan","nat"], ["bat"]]',
        language: 'javascript'
      },
      explanation: 'Хэш-ключ для группировки: отсортированные буквы слова — уникальный идентификатор группы анаграмм. "eat", "tea", "ate" — все дают ключ "aet". O(n * k log k) где k — средняя длина слова. Map сохраняет порядок вставки и работает с любыми ключами. [...groups.values()] превращает итератор значений Map в массив массивов. Альтернатива: вместо сортировки — считать частоты букв (быстрее для длинных слов).'
    },
    {
      id: 7,
      title: 'Сжатие строки',
      type: 'practice',
      difficulty: 'easy',
      description: 'compressString(str): сжать строку используя подсчёт последовательных символов. "aabcccdddd" -> "a2bc3d4". Если сжатая длиннее — вернуть оригинал.',
      requirements: [
        'compressString("aabcccdddd") -> "a2bc3d4"',
        'compressString("abcd") -> "abcd" (сжатие не выгодно)',
        'compressString("aaaa") -> "a4"'
      ],
      solution: {
        code: 'function compressString(str) {\n  if (!str) return str;\n  let result = "";\n  let count = 1;\n\n  for (let i = 1; i <= str.length; i++) {\n    if (str[i] === str[i - 1]) {\n      count++;\n    } else {\n      result += str[i - 1] + (count > 1 ? count : "");\n      count = 1;\n    }\n  }\n\n  return result.length < str.length ? result : str;\n}\n\nconsole.log(compressString("aabcccdddd")); // "a2bc3d4"\nconsole.log(compressString("abcd"));       // "abcd"\nconsole.log(compressString("aaaa"));       // "a4"\nconsole.log(compressString("aab"));        // "aab"',
        language: 'javascript'
      },
      explanation: 'Цикл идёт до i <= str.length включительно — это позволяет "сбросить" последнюю группу когда i выходит за границу (str[str.length] === undefined !== любой символ). count > 1 ? count : "" — одиночные символы записываем без цифры (b, не b1). Финальная проверка: если сжатая строка не короче — возвращаем оригинал. RLE (Run-Length Encoding) — простейший алгоритм сжатия данных.'
    },
    {
      id: 8,
      title: 'Матрица по спирали',
      type: 'practice',
      difficulty: 'medium',
      description: 'spiralOrder(matrix): обойти матрицу по спирали и вернуть элементы в порядке обхода.',
      requirements: [
        'spiralOrder([[1,2,3],[4,5,6],[7,8,9]]) -> [1,2,3,6,9,8,7,4,5]',
        'Работать для прямоугольных матриц',
        'spiralOrder([[1,2],[3,4]]) -> [1,2,4,3]'
      ],
      solution: {
        code: 'function spiralOrder(matrix) {\n  const result = [];\n  let top = 0, bottom = matrix.length - 1;\n  let left = 0, right = matrix[0].length - 1;\n\n  while (top <= bottom && left <= right) {\n    for (let i = left; i <= right; i++) result.push(matrix[top][i]);\n    top++;\n    for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);\n    right--;\n    if (top <= bottom) {\n      for (let i = right; i >= left; i--) result.push(matrix[bottom][i]);\n      bottom--;\n    }\n    if (left <= right) {\n      for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);\n      left++;\n    }\n  }\n\n  return result;\n}\n\nconsole.log(spiralOrder([[1,2,3],[4,5,6],[7,8,9]]));\n// [1, 2, 3, 6, 9, 8, 7, 4, 5]',
        language: 'javascript'
      },
      explanation: 'Подход "сужающихся границ": четыре границы (top, bottom, left, right) сдвигаются внутрь после каждого обхода. Порядок: право по верхней строке -> вниз по правому столбцу -> влево по нижней строке -> вверх по левому столбцу. Дополнительные проверки if (top <= bottom) и if (left <= right) предотвращают двойной обход центральных строк/столбцов в матрицах с нечётными размерами. Работает для любых прямоугольных матриц.'
    },
    {
      id: 9,
      title: 'Счастливый билет',
      type: 'practice',
      difficulty: 'easy',
      description: 'isLucky(ticket): определяет "счастливый" ли билет. Шестизначный номер: сумма первых трёх цифр равна сумме последних трёх.',
      requirements: [
        'isLucky("123321") -> true (1+2+3 = 3+2+1)',
        'isLucky("000000") -> true',
        'isLucky("123456") -> false',
        'countLucky(n): посчитать количество счастливых n-значных билетов'
      ],
      solution: {
        code: 'function isLucky(ticket) {\n  const digits = ticket.split("").map(Number);\n  const half = digits.length / 2;\n  const sumFirst = digits.slice(0, half).reduce((a, b) => a + b, 0);\n  const sumSecond = digits.slice(half).reduce((a, b) => a + b, 0);\n  return sumFirst === sumSecond;\n}\n\nfunction countLucky(digits = 6) {\n  let count = 0;\n  const max = Math.pow(10, digits);\n  for (let i = 0; i < max; i++) {\n    const ticket = String(i).padStart(digits, "0");\n    if (isLucky(ticket)) count++;\n  }\n  return count;\n}\n\nconsole.log(isLucky("123321")); // true\nconsole.log(isLucky("123456")); // false\n// countLucky(6) = 55252 (долго для больших n)',
        language: 'javascript'
      },
      explanation: 'isLucky разбивает строку на цифры, делит пополам и сравнивает суммы половин. digits.length / 2 работает для любой чётной длины номера. padStart(digits, "0") гарантирует ведущие нули — "007" является валидным трёхзначным номером. Количество счастливых шестизначных билетов = 55252 — классическая задача комбинаторики. Оптимизация через динамическое программирование позволила бы избежать полного перебора.'
    },
    {
      id: 10,
      title: 'Бинарный поиск',
      type: 'practice',
      difficulty: 'easy',
      description: 'binarySearch(arr, target): найти индекс target в отсортированном массиве за O(log n). Вернуть -1 если не найден.',
      requirements: [
        'binarySearch([1,3,5,7,9,11], 7) -> 3',
        'binarySearch([1,3,5], 4) -> -1',
        'Реализовать итеративно и рекурсивно',
        'binarySearch([1], 1) -> 0'
      ],
      solution: {
        code: '// Итеративный\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n\n  return -1;\n}\n\n// Рекурсивный\nfunction binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {\n  if (left > right) return -1;\n  const mid = Math.floor((left + right) / 2);\n  if (arr[mid] === target) return mid;\n  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, right);\n  return binarySearchRecursive(arr, target, left, mid - 1);\n}\n\nconsole.log(binarySearch([1, 3, 5, 7, 9, 11], 7)); // 3\nconsole.log(binarySearch([1, 3, 5], 4));            // -1\nconsole.log(binarySearchRecursive([2, 4, 6, 8, 10], 6)); // 2',
        language: 'javascript'
      },
      explanation: 'Бинарный поиск работает только на отсортированных массивах. На каждой итерации делим пространство поиска пополам: O(log n). Math.floor((left + right) / 2) — безопасное вычисление середины (в некоторых языках left + right может переполниться — для JS это не проблема, но привычка). left = mid + 1 и right = mid - 1 — не включаем mid в следующий поиск, иначе бесконечный цикл при left === right. Итеративная версия предпочтительнее — нет риска переполнения стека.'
    }
  ]
};
