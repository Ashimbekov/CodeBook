export default {
  id: 45,
  title: 'Практикум: DP — строки',
  description: 'Десять задач на динамическое программирование со строками: палиндромы, редакционное расстояние, регулярные выражения и разбиения.',
  lessons: [
    {
      id: 1,
      title: 'Longest Palindromic Substring (LeetCode #5)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s. Найди самую длинную палиндромную подстроку.\n\nПример:\n  s = "babad" → "bab" (или "aba")\n  s = "cbbd" → "bb"',
      requirements: [
        'Метод String longestPalindrome(String s)',
        'Метод «расширения от центра»: для каждого центра расширяй влево и вправо',
        'Проверяй и нечётные (один центр), и чётные (два центра) палиндромы',
        'Альтернатива: DP, dp[i][j] = true если s[i..j] палиндром'
      ],
      expectedOutput: 'Input: s="babad"\nOutput: "bab"',
      hint: 'Для каждого центра (0..n-1): расширяй два указателя l,r пока s[l]==s[r]. Проверяй нечётный (l=r=center) и чётный (l=center, r=center+1) палиндромы. Обновляй максимальную длину.',
      solution: `class Solution {
    public String longestPalindrome(String s) {
        int start = 0, maxLen = 0;

        for (int center = 0; center < s.length(); center++) {
            // нечётный палиндром
            int len1 = expand(s, center, center);
            // чётный палиндром
            int len2 = expand(s, center, center + 1);
            int len = Math.max(len1, len2);
            if (len > maxLen) {
                maxLen = len;
                start = center - (len - 1) / 2;
            }
        }
        return s.substring(start, start + maxLen);
    }

    private int expand(String s, int left, int right) {
        while (left >= 0 && right < s.length()
                && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        return right - left - 1;
    }
}`,
      explanation: 'Метод «расширения от центра»: для каждого из n возможных центров расширяем палиндром. Проверяем оба варианта: нечётной (1 центр) и чётной (2 центра) длины. Время: O(n^2), память: O(1). DP-вариант: O(n^2) времени и памяти.'
    },
    {
      id: 2,
      title: 'Longest Common Subsequence (LeetCode #1143)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Даны две строки text1 и text2. Найди длину их наибольшей общей подпоследовательности (LCS).\n\nПример:\n  text1="abcde", text2="ace" → 3 ("ace")\n  text1="abc", text2="abc" → 3\n  text1="abc", text2="def" → 0',
      requirements: [
        'Метод int longestCommonSubsequence(String text1, String text2)',
        'dp[i][j] = LCS для text1[0..i-1] и text2[0..j-1]',
        'Совпадение: dp[i][j] = dp[i-1][j-1] + 1',
        'Несовпадение: dp[i][j] = max(dp[i-1][j], dp[i][j-1])'
      ],
      expectedOutput: 'Input: text1="abcde", text2="ace"\nOutput: 3',
      hint: 'Два случая: (1) text1[i-1]==text2[j-1] → символ входит в LCS, dp[i][j]=dp[i-1][j-1]+1. (2) Не совпадают → max(пропустить символ text1, пропустить символ text2). Оптимизируй до 1D.',
      solution: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[] dp = new int[n + 1];

        for (int i = 1; i <= m; i++) {
            int prev = 0;
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[j] = prev + 1;
                } else {
                    dp[j] = Math.max(dp[j], dp[j - 1]);
                }
                prev = temp;
            }
        }
        return dp[n];
    }
}`,
      explanation: 'Классическая 2D DP на строках, оптимизированная до 1D. При совпадении символов: берём диагональ (prev) + 1. При несовпадении: max(сверху dp[j], слева dp[j-1]). Переменная prev хранит dp[i-1][j-1]. Время: O(m*n), память: O(n).'
    },
    {
      id: 3,
      title: 'Edit Distance (LeetCode #72)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Даны две строки word1 и word2. Найди минимальное количество операций для преобразования word1 в word2. Доступные операции: вставить символ, удалить символ, заменить символ.\n\nПример:\n  word1="horse", word2="ros" → 3\n  (horse → rorse → rose → ros)\n  word1="intention", word2="execution" → 5',
      requirements: [
        'Метод int minDistance(String word1, String word2)',
        'dp[i][j] = мин операций для word1[0..i-1] → word2[0..j-1]',
        'Совпадение: dp[i][j] = dp[i-1][j-1]',
        'Несовпадение: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])'
      ],
      expectedOutput: 'Input: word1="horse", word2="ros"\nOutput: 3',
      hint: 'Три операции при несовпадении: (1) удалить из word1 → dp[i-1][j]+1, (2) вставить в word1 → dp[i][j-1]+1, (3) заменить → dp[i-1][j-1]+1. Берём минимум. Базовые случаи: dp[i][0]=i, dp[0][j]=j.',
      solution: `class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[] dp = new int[n + 1];
        for (int j = 0; j <= n; j++) dp[j] = j;

        for (int i = 1; i <= m; i++) {
            int prev = dp[0]; // dp[i-1][j-1]
            dp[0] = i;
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[j] = prev;
                } else {
                    dp[j] = 1 + Math.min(prev, Math.min(dp[j], dp[j - 1]));
                    // prev = замена, dp[j] = удаление, dp[j-1] = вставка
                }
                prev = temp;
            }
        }
        return dp[n];
    }
}`,
      explanation: 'Расстояние Левенштейна: классическая 2D DP задача. При совпадении символов — бесплатно (берём диагональ). При несовпадении: 1 + min(замена, удаление, вставка). Оптимизация до 1D с переменной prev. Время: O(m*n), память: O(n). Используется в spell-checkers, diff утилитах.'
    },
    {
      id: 4,
      title: 'Regular Expression Matching (LeetCode #10)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй сопоставление с поддержкой \'.\' (любой символ) и \'*\' (ноль или более предыдущего символа). Сопоставление должно покрывать всю строку.\n\nПример:\n  s="aa", p="a" → false\n  s="aa", p="a*" → true\n  s="ab", p=".*" → true\n  s="aab", p="c*a*b" → true (c* = пусто, a* = aa, b = b)',
      requirements: [
        'Метод boolean isMatch(String s, String p)',
        'dp[i][j] = true если s[0..i-1] матчится с p[0..j-1]',
        'Обработай \'.\': матчит любой символ',
        'Обработай \'*\': ноль повторений (dp[i][j-2]) или одно+ (dp[i-1][j] если символ совпадает)'
      ],
      expectedOutput: 'Input: s="aab", p="c*a*b"\nOutput: true',
      hint: 'Для \'*\': два случая: (1) ноль повторений предыдущего символа → dp[i][j-2], (2) одно или более → dp[i-1][j] при условии s[i-1] совпадает с p[j-2] (или p[j-2]=\'.\').',
      solution: `class Solution {
    public boolean isMatch(String s, String p) {
        int m = s.length(), n = p.length();
        boolean[][] dp = new boolean[m + 1][n + 1];
        dp[0][0] = true;

        // Паттерны вида a*, a*b*, a*b*c* могут матчить пустую строку
        for (int j = 2; j <= n; j++) {
            if (p.charAt(j - 1) == '*') {
                dp[0][j] = dp[0][j - 2];
            }
        }

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                char sc = s.charAt(i - 1);
                char pc = p.charAt(j - 1);

                if (pc == '.' || pc == sc) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else if (pc == '*') {
                    char prev = p.charAt(j - 2);
                    // ноль повторений
                    dp[i][j] = dp[i][j - 2];
                    // одно или более повторений
                    if (prev == '.' || prev == sc) {
                        dp[i][j] = dp[i][j] || dp[i - 1][j];
                    }
                }
            }
        }
        return dp[m][n];
    }
}`,
      explanation: 'DP на двух строках. \'.\' матчит любой символ. \'*\' может означать: (1) ноль повторений предыдущего → dp[i][j-2], (2) одно+ повторений → dp[i-1][j] при совпадении символа. Время: O(m*n), память: O(m*n). Можно оптимизировать до O(n) памяти.'
    },
    {
      id: 5,
      title: 'Wildcard Matching (LeetCode #44)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй сопоставление с поддержкой \'?\' (любой один символ) и \'*\' (любая последовательность символов, включая пустую).\n\nПример:\n  s="aa", p="a" → false\n  s="aa", p="*" → true\n  s="cb", p="?a" → false\n  s="adceb", p="*a*b" → true',
      requirements: [
        'Метод boolean isMatch(String s, String p)',
        'dp[i][j] = true если s[0..i-1] матчится с p[0..j-1]',
        'Обработай \'?\': матчит один любой символ',
        'Обработай \'*\': dp[i][j] = dp[i][j-1] (пустая) || dp[i-1][j] (один+ символ)'
      ],
      expectedOutput: 'Input: s="adceb", p="*a*b"\nOutput: true',
      hint: '\'*\' может матчить: (1) пустую строку → dp[i][j-1], (2) один или более символов → dp[i-1][j]. \'?\' как обычный символ: dp[i][j] = dp[i-1][j-1]. Базовые случаи: dp[0][0]=true, dp[0][j]=true только если все p[0..j-1] — \'*\'.',
      solution: `class Solution {
    public boolean isMatch(String s, String p) {
        int m = s.length(), n = p.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;

        // паттерн из одних '*' матчит пустую строку
        for (int j = 1; j <= n; j++) {
            dp[j] = dp[j - 1] && p.charAt(j - 1) == '*';
        }

        for (int i = 1; i <= m; i++) {
            boolean prev = dp[0]; // dp[i-1][j-1]
            dp[0] = false;
            for (int j = 1; j <= n; j++) {
                boolean temp = dp[j];
                char pc = p.charAt(j - 1);
                if (pc == '?' || pc == s.charAt(i - 1)) {
                    dp[j] = prev;
                } else if (pc == '*') {
                    dp[j] = dp[j] || dp[j - 1];
                    // dp[j] = dp[i-1][j] (один+ символ)
                    // dp[j-1] = dp[i][j-1] (пустая)
                } else {
                    dp[j] = false;
                }
                prev = temp;
            }
        }
        return dp[n];
    }
}`,
      explanation: 'Аналогично Regular Expression, но \'*\' здесь матчит любую последовательность (включая пустую). Два перехода для \'*\': dp[i-1][j] (матчит ещё один символ из s) и dp[i][j-1] (матчит пустую). Оптимизация до 1D. Время: O(m*n), память: O(n).'
    },
    {
      id: 6,
      title: 'Distinct Subsequences (LeetCode #115)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Даны строки s и t. Посчитай количество различных подпоследовательностей s, равных t.\n\nПример:\n  s="rabbbit", t="rabbit" → 3\n  s="babgbag", t="bag" → 5',
      requirements: [
        'Метод int numDistinct(String s, String t)',
        'dp[i][j] = количество подпоследовательностей s[0..i-1], равных t[0..j-1]',
        'Совпадение: dp[i][j] = dp[i-1][j-1] + dp[i-1][j]',
        'Несовпадение: dp[i][j] = dp[i-1][j]'
      ],
      expectedOutput: 'Input: s="rabbbit", t="rabbit"\nOutput: 3',
      hint: 'Если s[i-1]==t[j-1]: dp[i][j] = dp[i-1][j-1] (используем s[i-1]) + dp[i-1][j] (не используем s[i-1]). Если не совпадают: dp[i][j] = dp[i-1][j] (пропускаем s[i-1]). dp[i][0]=1 (пустая t).',
      solution: `class Solution {
    public int numDistinct(String s, String t) {
        int m = s.length(), n = t.length();
        int[] dp = new int[n + 1];
        dp[0] = 1; // пустая t

        for (int i = 1; i <= m; i++) {
            // идём справа налево, чтобы не затереть dp[j-1]
            for (int j = n; j >= 1; j--) {
                if (s.charAt(i - 1) == t.charAt(j - 1)) {
                    dp[j] += dp[j - 1];
                }
                // при несовпадении dp[j] остаётся прежним
            }
        }
        return dp[n];
    }
}`,
      explanation: 'При совпадении символов: два варианта — использовать s[i-1] (dp[i-1][j-1]) или пропустить (dp[i-1][j]). При несовпадении: только пропустить. Оптимизация до 1D: идём справа налево. Время: O(m*n), память: O(n).'
    },
    {
      id: 7,
      title: 'Palindrome Partitioning II (LeetCode #132)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дана строка s. Найди минимальное количество разрезов, чтобы каждая часть была палиндромом.\n\nПример:\n  s = "aab" → 1 (разрез: "aa" | "b")\n  s = "a" → 0\n  s = "ab" → 1',
      requirements: [
        'Метод int minCut(String s)',
        'dp[i] = мин разрезов для s[0..i]',
        'Предвычисли isPalin[i][j] = true если s[i..j] палиндром',
        'dp[i] = min(dp[j-1] + 1) для всех j, где s[j..i] — палиндром'
      ],
      expectedOutput: 'Input: s="aab"\nOutput: 1',
      hint: 'Два этапа: (1) предвычисление isPalin[i][j] через DP: isPalin[i][j] = s[i]==s[j] && isPalin[i+1][j-1]. (2) dp[i] = min(dp[j-1]+1) по всем j, где s[j..i] палиндром. Если s[0..i] сам палиндром — dp[i]=0.',
      solution: `class Solution {
    public int minCut(String s) {
        int n = s.length();
        boolean[][] isPalin = new boolean[n][n];

        // предвычисление палиндромов
        for (int right = 0; right < n; right++) {
            for (int left = 0; left <= right; left++) {
                if (s.charAt(left) == s.charAt(right)
                        && (right - left <= 2 || isPalin[left + 1][right - 1])) {
                    isPalin[left][right] = true;
                }
            }
        }

        int[] dp = new int[n];
        for (int i = 0; i < n; i++) {
            if (isPalin[0][i]) {
                dp[i] = 0;
                continue;
            }
            dp[i] = i; // максимум i разрезов
            for (int j = 1; j <= i; j++) {
                if (isPalin[j][i]) {
                    dp[i] = Math.min(dp[i], dp[j - 1] + 1);
                }
            }
        }
        return dp[n - 1];
    }
}`,
      explanation: 'Два этапа DP: (1) предвычисление всех палиндромных подстрок за O(n^2). (2) dp[i] = мин разрезов для s[0..i]. Для каждого i перебираем все j, где s[j..i] — палиндром. Время: O(n^2), память: O(n^2).'
    },
    {
      id: 8,
      title: 'Word Break II (LeetCode #140)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дана строка s и словарь wordDict. Верни все варианты разбиения s на слова из словаря (через пробелы).\n\nПример:\n  s="catsanddog", wordDict=["cat","cats","and","sand","dog"]\n  Ответ: ["cats and dog","cat sand dog"]',
      requirements: [
        'Метод List<String> wordBreak(String s, List<String> wordDict)',
        'Backtracking + мемоизация (или DP + восстановление)',
        'Для каждой позиции: если s[start..end] — слово, рекурсия от end',
        'Используй HashMap для мемоизации результатов подзадач'
      ],
      expectedOutput: 'Input: s="catsanddog", wordDict=["cat","cats","and","sand","dog"]\nOutput: ["cats and dog","cat sand dog"]',
      hint: 'Backtracking с мемоизацией: для позиции start перебирай все длины слов. Если s[start..end] есть в словаре — рекурсия от end. Сохраняй результаты в HashMap<Integer, List<String>> для мемоизации.',
      solution: `class Solution {
    private Map<Integer, List<String>> memo = new HashMap<>();

    public List<String> wordBreak(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        return backtrack(s, wordSet, 0);
    }

    private List<String> backtrack(String s, Set<String> wordSet, int start) {
        if (memo.containsKey(start)) return memo.get(start);

        List<String> result = new ArrayList<>();
        if (start == s.length()) {
            result.add("");
            return result;
        }

        for (int end = start + 1; end <= s.length(); end++) {
            String word = s.substring(start, end);
            if (wordSet.contains(word)) {
                List<String> rest = backtrack(s, wordSet, end);
                for (String sub : rest) {
                    result.add(word + (sub.isEmpty() ? "" : " " + sub));
                }
            }
        }

        memo.put(start, result);
        return result;
    }
}`,
      explanation: 'Backtracking с мемоизацией: для каждой позиции start перебираем все подстроки, которые есть в словаре. Рекурсивно разбиваем остаток. Мемоизация через HashMap предотвращает повторные вычисления. Время: O(n^2 * 2^n) в худшем случае, на практике гораздо быстрее.'
    },
    {
      id: 9,
      title: 'Longest Palindromic Subsequence (LeetCode #516)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s. Найди длину самой длинной палиндромной подпоследовательности.\n\nПример:\n  s = "bbbab" → 4 ("bbbb")\n  s = "cbbd" → 2 ("bb")',
      requirements: [
        'Метод int longestPalinSubseq(String s)',
        'dp[i][j] = длина LPS для s[i..j]',
        'Совпадение: dp[i][j] = dp[i+1][j-1] + 2',
        'Несовпадение: dp[i][j] = max(dp[i+1][j], dp[i][j-1])'
      ],
      expectedOutput: 'Input: s="bbbab"\nOutput: 4',
      hint: 'DP на интервалах: dp[i][j] = LPS для подстроки s[i..j]. Если s[i]==s[j]: dp[i][j]=dp[i+1][j-1]+2. Иначе: max(dp[i+1][j], dp[i][j-1]). Базовый случай: dp[i][i]=1. Заполняй по длине интервала. Можно оптимизировать до 1D.',
      solution: `class Solution {
    public int longestPalinSubseq(String s) {
        int n = s.length();
        int[] dp = new int[n];
        Arrays.fill(dp, 1); // каждый символ — палиндром длины 1

        for (int i = n - 2; i >= 0; i--) {
            int prev = 0; // dp[i+1][j-1]
            for (int j = i + 1; j < n; j++) {
                int temp = dp[j];
                if (s.charAt(i) == s.charAt(j)) {
                    dp[j] = prev + 2;
                } else {
                    dp[j] = Math.max(dp[j], dp[j - 1]);
                }
                prev = temp;
            }
        }
        return dp[n - 1];
    }
}`,
      explanation: 'DP на интервалах, оптимизированная до 1D. При совпадении крайних символов: они оба входят в LPS, dp=prev+2. При несовпадении: max(без левого, без правого). Заполняем от конца (i от n-2 до 0). Время: O(n^2), память: O(n).'
    },
    {
      id: 10,
      title: 'Minimum ASCII Delete Sum (LeetCode #712)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Даны две строки s1 и s2. Найди минимальную сумму ASCII-значений удалённых символов, чтобы строки стали равными.\n\nПример:\n  s1="sea", s2="eat" → 231\n  (удаляем \'s\'(115) из s1 и \'t\'(116) из s2: 115+116=231)\n  s1="delete", s2="leet" → 403',
      requirements: [
        'Метод int minimumDeleteSum(String s1, String s2)',
        'dp[i][j] = мин сумма удалений для s1[0..i-1] и s2[0..j-1]',
        'Совпадение: dp[i][j] = dp[i-1][j-1] (удалять не нужно)',
        'Несовпадение: dp[i][j] = min(dp[i-1][j] + s1[i-1], dp[i][j-1] + s2[j-1])'
      ],
      expectedOutput: 'Input: s1="sea", s2="eat"\nOutput: 231',
      hint: 'Аналогично Edit Distance, но вместо количества операций минимизируем сумму ASCII. При несовпадении: либо удаляем s1[i-1] (+ его ASCII), либо s2[j-1] (+ его ASCII). Базовые случаи: dp[i][0] = сумма ASCII s1[0..i-1], dp[0][j] = сумма ASCII s2[0..j-1].',
      solution: `class Solution {
    public int minimumDeleteSum(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        int[] dp = new int[n + 1];

        // базовый случай: удалить все символы s2
        for (int j = 1; j <= n; j++) {
            dp[j] = dp[j - 1] + s2.charAt(j - 1);
        }

        for (int i = 1; i <= m; i++) {
            int prev = dp[0]; // dp[i-1][j-1]
            dp[0] += s1.charAt(i - 1); // удалить все символы s1
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    dp[j] = prev; // символы совпадают — ничего не удаляем
                } else {
                    dp[j] = Math.min(
                        dp[j] + s1.charAt(i - 1),   // удалить s1[i-1]
                        dp[j - 1] + s2.charAt(j - 1) // удалить s2[j-1]
                    );
                }
                prev = temp;
            }
        }
        return dp[n];
    }
}`,
      explanation: 'Вариация Edit Distance/LCS с весами. При совпадении — бесплатно. При несовпадении: удаляем символ из s1 или s2, добавляя его ASCII-стоимость. Оптимизация до 1D с переменной prev. Время: O(m*n), память: O(n).'
    }
  ]
}
