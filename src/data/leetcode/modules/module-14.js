export default {
  id: 14,
  title: 'DP: строки',
  description: 'Динамическое программирование на строках: LCS, edit distance, palindrome.',
  lessons: [
    {
      id: 1,
      title: 'DP на двух строках: шаблон',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: '2D DP на строках'
        },
        {
          type: 'text',
          value: 'Многие задачи DP на строках решаются таблицей dp[i][j], где i — позиция в первой строке, j — во второй. Типичный переход: сравниваем s[i-1] и t[j-1], и в зависимости от совпадения выбираем формулу.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Шаблон 2D DP на строках\nfunction stringDP(s, t) {\n  const m = s.length, n = t.length;\n  // dp[i][j] — ответ для s[0..i-1] и t[0..j-1]\n  const dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));\n\n  // Базовые случаи\n  for (let i = 0; i <= m; i++) dp[i][0] = /* base */;\n  for (let j = 0; j <= n; j++) dp[0][j] = /* base */;\n\n  // Заполнение\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (s[i-1] === t[j-1]) {\n        dp[i][j] = /* формула при совпадении */;\n      } else {\n        dp[i][j] = /* формула при несовпадении */;\n      }\n    }\n  }\n\n  return dp[m][n];\n}'
        },
        {
          type: 'list',
          value: [
            'LCS (Longest Common Subsequence): dp[i][j] = длина LCS для s[0..i-1] и t[0..j-1]',
            'Edit Distance: dp[i][j] = минимум операций для преобразования s[0..i-1] в t[0..j-1]',
            'Longest Common Substring: dp[i][j] = длина общей подстроки, заканчивающейся в i и j'
          ]
        },
        {
          type: 'tip',
          value: 'Рисуйте таблицу на бумаге! Это поможет понять переходы и увидеть паттерн заполнения.'
        }
      ]
    },
    {
      id: 2,
      title: 'Palindrome DP',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'DP для палиндромов'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Longest Palindromic Substring (LeetCode #5)\n// dp[i][j] = является ли s[i..j] палиндромом\nfunction longestPalindrome(s) {\n  const n = s.length;\n  if (n < 2) return s;\n\n  let start = 0, maxLen = 1;\n\n  // Expand around center (оптимальнее чем DP)\n  function expandFromCenter(left, right) {\n    while (left >= 0 && right < n && s[left] === s[right]) {\n      if (right - left + 1 > maxLen) {\n        start = left;\n        maxLen = right - left + 1;\n      }\n      left--;\n      right++;\n    }\n  }\n\n  for (let i = 0; i < n; i++) {\n    expandFromCenter(i, i);     // нечётная длина\n    expandFromCenter(i, i + 1); // чётная длина\n  }\n\n  return s.substring(start, start + maxLen);\n}\n\n// Palindromic Substrings count (LeetCode #647)\nfunction countSubstrings(s) {\n  let count = 0;\n  for (let i = 0; i < s.length; i++) {\n    // Нечётные\n    let l = i, r = i;\n    while (l >= 0 && r < s.length && s[l] === s[r]) {\n      count++; l--; r++;\n    }\n    // Чётные\n    l = i; r = i + 1;\n    while (l >= 0 && r < s.length && s[l] === s[r]) {\n      count++; l--; r++;\n    }\n  }\n  return count;\n}'
        },
        {
          type: 'note',
          value: 'Expand around center — O(n^2) время, O(1) память. DP-подход — O(n^2) время и O(n^2) память. Для собеседования expand around center предпочтительнее.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Longest Common Subsequence',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #1143: найдите длину наибольшей общей подпоследовательности двух строк.',
      requirements: [
        'Реализуйте функцию longestCommonSubsequence(text1, text2)',
        'Подпоследовательность — символы в исходном порядке, но не обязательно подряд',
        'Верните длину LCS'
      ],
      hint: 'Если символы совпадают: dp[i][j] = dp[i-1][j-1] + 1. Иначе: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).',
      expectedOutput: 'longestCommonSubsequence("abcde", "ace") -> 3\nlongestCommonSubsequence("abc", "abc") -> 3\nlongestCommonSubsequence("abc", "def") -> 0',
      solution: 'function longestCommonSubsequence(text1, text2) {\n  const m = text1.length, n = text2.length;\n  const dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));\n\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (text1[i-1] === text2[j-1]) {\n        dp[i][j] = dp[i-1][j-1] + 1;\n      } else {\n        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n      }\n    }\n  }\n\n  return dp[m][n];\n}\n\nconsole.log(longestCommonSubsequence("abcde", "ace")); // 3 ("ace")\nconsole.log(longestCommonSubsequence("abc", "def")); // 0\n\n// Таблица для "abcde" и "ace":\n//     ""  a  c  e\n// ""   0  0  0  0\n// a    0  1  1  1\n// b    0  1  1  1\n// c    0  1  2  2\n// d    0  1  2  2\n// e    0  1  2  3',
      explanation: 'Классическая 2D DP задача. Если символы совпадают — берём диагональ + 1. Иначе — максимум из "пропустить символ первой строки" и "пропустить символ второй строки". O(m*n) время и память. Можно оптимизировать до O(min(m,n)) памяти, храня только предыдущую строку.'
    },
    {
      id: 4,
      title: 'Практика: Edit Distance',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #72: найдите минимальное количество операций для преобразования одной строки в другую.',
      requirements: [
        'Реализуйте функцию minDistance(word1, word2)',
        'Допустимые операции: вставка, удаление, замена символа',
        'Верните минимальное количество операций'
      ],
      hint: 'Если символы совпадают: dp[i][j] = dp[i-1][j-1]. Иначе: dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]).',
      expectedOutput: 'minDistance("horse", "ros") -> 3\nminDistance("intention", "execution") -> 5',
      solution: 'function minDistance(word1, word2) {\n  const m = word1.length, n = word2.length;\n  const dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));\n\n  // Базовые случаи\n  for (let i = 0; i <= m; i++) dp[i][0] = i; // удаление\n  for (let j = 0; j <= n; j++) dp[0][j] = j; // вставка\n\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (word1[i-1] === word2[j-1]) {\n        dp[i][j] = dp[i-1][j-1]; // совпадение — бесплатно\n      } else {\n        dp[i][j] = 1 + Math.min(\n          dp[i-1][j-1], // замена\n          dp[i-1][j],   // удаление\n          dp[i][j-1]    // вставка\n        );\n      }\n    }\n  }\n\n  return dp[m][n];\n}\n\nconsole.log(minDistance("horse", "ros")); // 3\n// horse → rorse (замена h→r)\n// rorse → rose (удаление r)\n// rose → ros (удаление e)\n\nconsole.log(minDistance("intention", "execution")); // 5',
      explanation: 'Edit Distance (расстояние Левенштейна) — фундаментальная задача DP. Три операции дают три перехода: замена (диагональ), удаление (сверху), вставка (слева). При совпадении символов — операция не нужна. Используется в spell checkers, DNA alignment, diff tools. O(m*n).'
    },
    {
      id: 5,
      title: 'Практика: Longest Palindromic Substring',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #5: найдите наибольшую подстроку-палиндром.',
      requirements: [
        'Реализуйте функцию longestPalindrome(s)',
        'Верните саму подстроку (не длину)',
        'Решение O(n^2) с expand around center'
      ],
      hint: 'Для каждой позиции расширяйтесь влево и вправо, пока символы совпадают. Проверьте и нечётные, и чётные палиндромы.',
      expectedOutput: 'longestPalindrome("babad") -> "bab" или "aba"\nlongestPalindrome("cbbd") -> "bb"',
      solution: 'function longestPalindrome(s) {\n  let start = 0, maxLen = 1;\n\n  function expand(left, right) {\n    while (left >= 0 && right < s.length && s[left] === s[right]) {\n      if (right - left + 1 > maxLen) {\n        start = left;\n        maxLen = right - left + 1;\n      }\n      left--;\n      right++;\n    }\n  }\n\n  for (let i = 0; i < s.length; i++) {\n    expand(i, i);     // нечётный палиндром: "aba"\n    expand(i, i + 1); // чётный палиндром: "abba"\n  }\n\n  return s.substring(start, start + maxLen);\n}\n\nconsole.log(longestPalindrome("babad")); // "bab"\nconsole.log(longestPalindrome("cbbd")); // "bb"\nconsole.log(longestPalindrome("a")); // "a"\nconsole.log(longestPalindrome("racecar")); // "racecar"',
      explanation: 'Expand around center: для каждого возможного центра (n для нечётных + n-1 для чётных) расширяемся, пока символы совпадают. Это O(n^2) по времени и O(1) по памяти — лучше, чем DP-подход O(n^2) памяти. Manacher\'s algorithm даёт O(n), но редко спрашивают на собеседованиях.'
    },
    {
      id: 6,
      title: 'Практика: Palindromic Substrings',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #647: подсчитайте количество подстрок-палиндромов.',
      requirements: [
        'Реализуйте функцию countSubstrings(s)',
        'Подсчитайте количество подстрок, являющихся палиндромами',
        'Каждый одиночный символ — палиндром',
        'Используйте expand around center'
      ],
      hint: 'Для каждого центра считайте, сколько раз можно расшириться (каждое расширение = ещё один палиндром).',
      expectedOutput: 'countSubstrings("abc") -> 3\ncountSubstrings("aaa") -> 6',
      solution: 'function countSubstrings(s) {\n  let count = 0;\n\n  function expand(left, right) {\n    while (left >= 0 && right < s.length && s[left] === s[right]) {\n      count++;\n      left--;\n      right++;\n    }\n  }\n\n  for (let i = 0; i < s.length; i++) {\n    expand(i, i);     // нечётные\n    expand(i, i + 1); // чётные\n  }\n\n  return count;\n}\n\nconsole.log(countSubstrings("abc")); // 3: "a", "b", "c"\nconsole.log(countSubstrings("aaa")); // 6: "a","a","a","aa","aa","aaa"',
      explanation: 'Каждое успешное расширение — это ещё один палиндром. Для "aaa": центры в позиции 0 дают "a"; позиции 1 дают "a","aaa"; позиции 2 дают "a"; между 0-1: "aa"; между 1-2: "aa". Итого 6. O(n^2) время, O(1) память.'
    },
    {
      id: 7,
      title: 'Практика: Distinct Subsequences',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #115: сколькими способами строка t является подпоследовательностью s?',
      requirements: [
        'Реализуйте функцию numDistinct(s, t)',
        'Подсчитайте количество различных подпоследовательностей s, равных t',
        'Используйте 2D DP'
      ],
      hint: 'dp[i][j] = количество способов получить t[0..j-1] из s[0..i-1]. Если совпадают: dp[i][j] = dp[i-1][j-1] + dp[i-1][j]. Иначе: dp[i][j] = dp[i-1][j].',
      expectedOutput: 'numDistinct("rabbbit", "rabbit") -> 3\nnumDistinct("babgbag", "bag") -> 5',
      solution: 'function numDistinct(s, t) {\n  const m = s.length, n = t.length;\n  const dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));\n\n  // Базовый случай: пустая t — всегда 1 способ\n  for (let i = 0; i <= m; i++) dp[i][0] = 1;\n\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (s[i-1] === t[j-1]) {\n        // Используем s[i-1] + не используем s[i-1]\n        dp[i][j] = dp[i-1][j-1] + dp[i-1][j];\n      } else {\n        // Не используем s[i-1]\n        dp[i][j] = dp[i-1][j];\n      }\n    }\n  }\n\n  return dp[m][n];\n}\n\nconsole.log(numDistinct("rabbbit", "rabbit")); // 3\n// Три способа выбрать "rabbit" из "rabbbit"\n// (выбирая разные b)\n\nconsole.log(numDistinct("babgbag", "bag")); // 5',
      explanation: 'При совпадении символов есть два выбора: использовать текущий символ s[i-1] для сопоставления с t[j-1] (берём dp[i-1][j-1]) или не использовать (берём dp[i-1][j]). При несовпадении — только не использовать. Это тонкая задача, которая проверяет понимание DP-переходов. O(m*n).'
    }
  ]
}
