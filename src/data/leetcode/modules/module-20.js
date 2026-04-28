export default {
  id: 20,
  title: 'Bit Manipulation',
  description: 'Битовые операции: XOR трюки, single number, степень двойки, маски.',
  lessons: [
    {
      id: 1,
      title: 'Основы битовых операций',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Битовые операции в алгоритмах'
        },
        {
          type: 'text',
          value: 'Битовые операции работают на уровне отдельных битов числа. Они выполняются за O(1) и могут заменить сложные операции. На собеседованиях чаще всего спрашивают задачи на XOR.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Основные операции\n// AND (&): 1 & 1 = 1, остальное 0\n// OR (|): 0 | 0 = 0, остальное 1\n// XOR (^): одинаковые = 0, разные = 1\n// NOT (~): инвертирует все биты\n// Left shift (<<): сдвиг влево (умножение на 2)\n// Right shift (>>): сдвиг вправо (деление на 2)\n\n// Ключевые свойства XOR:\n// a ^ a = 0       (число XOR себя = 0)\n// a ^ 0 = a       (число XOR ноль = число)\n// a ^ b ^ a = b   (XOR коммутативен и ассоциативен)\n\n// Полезные трюки:\nconst isEven = (n) => (n & 1) === 0;           // проверка чётности\nconst isPowerOfTwo = (n) => n > 0 && (n & (n - 1)) === 0; // степень 2\nconst swap = (a, b) => { a ^= b; b ^= a; a ^= b; }; // swap без temp\nconst clearLastBit = (n) => n & (n - 1);       // сброс младшего бита\nconst getLastBit = (n) => n & (-n);             // выделить младший бит'
        },
        {
          type: 'heading',
          value: 'Частые паттерны'
        },
        {
          type: 'list',
          value: [
            'XOR для нахождения уникального элемента (остальные парные)',
            'n & (n-1) для подсчёта битов или проверки степени двойки',
            'Битовые маски для подмножеств',
            'Сдвиги для умножения/деления на 2'
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'XOR паттерны',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'XOR — главный инструмент'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Single Number (LeetCode #136)\n// Все числа парные кроме одного\nfunction singleNumber(nums) {\n  let result = 0;\n  for (const num of nums) {\n    result ^= num; // парные обнуляются!\n  }\n  return result;\n}\n// [4,1,2,1,2] → 4^1^2^1^2 = 4^(1^1)^(2^2) = 4^0^0 = 4\n\n// Missing Number (LeetCode #268)\n// Массив [0..n], одно число отсутствует\nfunction missingNumber(nums) {\n  let xor = nums.length;\n  for (let i = 0; i < nums.length; i++) {\n    xor ^= i ^ nums[i];\n  }\n  return xor;\n}\n// [3,0,1] → 3^(0^3)^(1^0)^(2^1) = 3^3^0^0^1^1^2 = 2'
        },
        {
          type: 'note',
          value: 'XOR обнуляет парные элементы и оставляет уникальный. Это работает, потому что XOR коммутативен (порядок не важен) и a^a=0.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Single Number',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #136: найдите число, которое встречается один раз (остальные — дважды).',
      requirements: [
        'Реализуйте функцию singleNumber(nums)',
        'Каждый элемент встречается дважды, кроме одного',
        'Найдите этот единственный элемент',
        'O(n) время, O(1) память'
      ],
      hint: 'XOR всех чисел: парные обнулят друг друга, останется уникальное.',
      expectedOutput: 'singleNumber([2,2,1]) -> 1\nsingleNumber([4,1,2,1,2]) -> 4\nsingleNumber([1]) -> 1',
      solution: 'function singleNumber(nums) {\n  let result = 0;\n  for (const num of nums) {\n    result ^= num;\n  }\n  return result;\n}\n\nconsole.log(singleNumber([2,2,1])); // 1\nconsole.log(singleNumber([4,1,2,1,2])); // 4\nconsole.log(singleNumber([1])); // 1\n\n// Доказательство:\n// [4,1,2,1,2]\n// 0 ^ 4 = 4\n// 4 ^ 1 = 5\n// 5 ^ 2 = 7\n// 7 ^ 1 = 6\n// 6 ^ 2 = 4 ✓',
      explanation: 'Красивейшее решение: XOR коммутативен и ассоциативен, поэтому порядок не важен. a^a=0, a^0=a. Все парные числа обнулятся, останется уникальное. O(n) время, O(1) память — невозможно лучше!'
    },
    {
      id: 4,
      title: 'Практика: Number of 1 Bits',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #191: подсчитайте количество единичных битов в числе (Hamming Weight).',
      requirements: [
        'Реализуйте функцию hammingWeight(n)',
        'Подсчитайте количество битов, равных 1',
        'Используйте трюк n & (n-1)'
      ],
      hint: 'n & (n-1) сбрасывает младший единичный бит. Повторяйте, пока n не станет 0.',
      expectedOutput: 'hammingWeight(11) -> 3 (1011 в двоичной)\nhammingWeight(128) -> 1 (10000000)\nhammingWeight(4294967293) -> 31',
      solution: 'function hammingWeight(n) {\n  let count = 0;\n  while (n !== 0) {\n    n &= (n - 1); // сбрасываем младший единичный бит\n    count++;\n  }\n  return count;\n}\n\n// Альтернатива: проверяем каждый бит\nfunction hammingWeight2(n) {\n  let count = 0;\n  while (n !== 0) {\n    count += n & 1; // младший бит\n    n >>>= 1;       // сдвиг вправо (unsigned)\n  }\n  return count;\n}\n\nconsole.log(hammingWeight(11)); // 3 (1011)\nconsole.log(hammingWeight(128)); // 1 (10000000)\n\n// Почему n & (n-1) работает?\n// n   = 1100\n// n-1 = 1011\n// &   = 1000 (младший единичный бит сброшен)',
      explanation: 'Трюк n & (n-1): вычитание 1 переворачивает все биты от младшего единичного бита вправо. AND с n сбрасывает этот бит. Каждая итерация убирает один единичный бит, поэтому количество итераций = количество единиц. O(k), где k — число единичных бит.'
    },
    {
      id: 5,
      title: 'Практика: Counting Bits',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #338: для каждого числа от 0 до n подсчитайте количество единичных битов.',
      requirements: [
        'Реализуйте функцию countBits(n)',
        'Верните массив, где ans[i] = количество единиц в двоичном представлении i',
        'Решение O(n) с DP'
      ],
      hint: 'DP: ans[i] = ans[i >> 1] + (i & 1). Или: ans[i] = ans[i & (i-1)] + 1.',
      expectedOutput: 'countBits(2) -> [0,1,1]\ncountBits(5) -> [0,1,1,2,1,2]',
      solution: 'function countBits(n) {\n  const ans = new Array(n + 1).fill(0);\n\n  for (let i = 1; i <= n; i++) {\n    // Вариант 1: сдвиг + младший бит\n    ans[i] = ans[i >> 1] + (i & 1);\n\n    // Вариант 2: сброс младшего бита\n    // ans[i] = ans[i & (i - 1)] + 1;\n  }\n\n  return ans;\n}\n\nconsole.log(countBits(2)); // [0, 1, 1]\nconsole.log(countBits(5)); // [0, 1, 1, 2, 1, 2]\n\n// Объяснение:\n// 0 = 000 → 0\n// 1 = 001 → 1\n// 2 = 010 → 1\n// 3 = 011 → 2\n// 4 = 100 → 1\n// 5 = 101 → 2',
      explanation: 'DP на битах: ans[i >> 1] — количество единиц в числе без младшего бита. (i & 1) — сам младший бит. Итого: ans[i] = ans[i >> 1] + (i & 1). Каждое число обрабатывается за O(1), итого O(n). Красивый пример DP + битовые операции.'
    },
    {
      id: 6,
      title: 'Практика: Reverse Bits',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #190: разверните биты 32-битного числа.',
      requirements: [
        'Реализуйте функцию reverseBits(n)',
        'Разверните порядок бит 32-битного unsigned integer',
        'Например: 00000010100101000001111010011100 → 00111001011110000010100101000000'
      ],
      hint: 'Извлекайте младший бит n, добавляйте его в результат (сдвинутый влево), сдвигайте n вправо.',
      expectedOutput: 'reverseBits(43261596) -> 964176192',
      solution: 'function reverseBits(n) {\n  let result = 0;\n  for (let i = 0; i < 32; i++) {\n    result = (result << 1) | (n & 1);\n    n >>>= 1; // unsigned right shift\n  }\n  return result >>> 0; // convert to unsigned\n}\n\nconsole.log(reverseBits(43261596)); // 964176192\n// 00000010100101000001111010011100\n// → 00111001011110000010100101000000\n\n// Python решение:\n// def reverseBits(n):\n//     result = 0\n//     for i in range(32):\n//         result = (result << 1) | (n & 1)\n//         n >>= 1\n//     return result',
      explanation: 'На каждой итерации: 1) сдвигаем результат влево (освобождаем место), 2) добавляем младший бит n в результат через OR, 3) сдвигаем n вправо. 32 итерации = все биты обработаны. >>> 0 в JS конвертирует в unsigned integer.'
    },
    {
      id: 7,
      title: 'Практика: Sum of Two Integers',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #371: вычислите сумму двух чисел без использования + и -.',
      requirements: [
        'Реализуйте функцию getSum(a, b)',
        'Нельзя использовать операторы + и -',
        'Используйте только битовые операции'
      ],
      hint: 'XOR даёт сумму без переноса. AND + сдвиг влево даёт перенос. Повторяйте, пока перенос не станет 0.',
      expectedOutput: 'getSum(1, 2) -> 3\ngetSum(-2, 3) -> 1\ngetSum(0, 0) -> 0',
      solution: 'function getSum(a, b) {\n  while (b !== 0) {\n    const carry = (a & b) << 1; // перенос\n    a = a ^ b;                   // сумма без переноса\n    b = carry;                   // добавляем перенос\n  }\n  return a;\n}\n\nconsole.log(getSum(1, 2)); // 3\nconsole.log(getSum(-2, 3)); // 1\nconsole.log(getSum(0, 0)); // 0\n\n// Пошагово для a=5 (101), b=3 (011):\n// Итерация 1:\n//   carry = (101 & 011) << 1 = 001 << 1 = 010\n//   a = 101 ^ 011 = 110\n//   b = 010\n// Итерация 2:\n//   carry = (110 & 010) << 1 = 010 << 1 = 100\n//   a = 110 ^ 010 = 100\n//   b = 100\n// Итерация 3:\n//   carry = (100 & 100) << 1 = 100 << 1 = 1000\n//   a = 100 ^ 100 = 000\n//   b = 1000\n// Итерация 4:\n//   carry = 0\n//   a = 1000 = 8 ✓',
      explanation: 'Сложение в двоичной: XOR = сумма без переноса (как в десятичной: 5+3 без переноса = 8), AND = где возникает перенос, сдвиг влево = перенос в следующий разряд. Повторяем, пока нет переноса. Это именно так работает сложение в процессоре!'
    }
  ]
}
