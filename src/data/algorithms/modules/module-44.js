export default {
  id: 44,
  title: 'Практикум: DP — двумерные задачи',
  description: 'Десять задач на двумерное динамическое программирование: пути в сетке, рюкзак, чередование строк и подпоследовательности.',
  lessons: [
    {
      id: 1,
      title: 'Unique Paths (LeetCode #62)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Робот стоит в левом верхнем углу сетки m x n. Он может двигаться только вниз или вправо. Сколько уникальных путей к правому нижнему углу?\n\nПример:\n  m = 3, n = 7 → 28\n  m = 3, n = 2 → 3',
      requirements: [
        'Метод int uniquePaths(int m, int n)',
        'dp[i][j] = dp[i-1][j] + dp[i][j-1]',
        'Первая строка и первый столбец = 1',
        'Оптимизируй до 1D массива O(n) памяти'
      ],
      expectedOutput: 'Input: m=3, n=7\nOutput: 28',
      hint: 'Базовые случаи: dp[0][j]=1, dp[i][0]=1 (только один путь по краю). Для остальных: dp[i][j] = dp[i-1][j] + dp[i][j-1]. Оптимизация: dp[j] += dp[j-1] (текущая строка обновляется поверх предыдущей).',
      solution: `class Solution {
    public int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        Arrays.fill(dp, 1); // первая строка — все единицы

        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[j] += dp[j - 1]; // dp[j] (сверху) + dp[j-1] (слева)
            }
        }
        return dp[n - 1];
    }
}`,
      explanation: 'Классическая 2D DP задача. dp[i][j] = количество путей сверху + слева. Оптимизация до 1D: dp[j] хранит значение сверху, dp[j-1] — слева (уже обновлено на текущей строке). Время: O(m*n), память: O(n).'
    },
    {
      id: 2,
      title: 'Unique Paths II (LeetCode #63)',
      type: 'practice',
      difficulty: 'medium',
      description: 'То же, что Unique Paths, но в сетке есть препятствия (obstacleGrid[i][j] = 1). Робот не может проходить через препятствия.\n\nПример:\n  obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]] → 2\n  (два пути: вправо-вправо-вниз-вниз и вниз-вниз-вправо-вправо)',
      requirements: [
        'Метод int uniquePathsWithObstacles(int[][] obstacleGrid)',
        'Если клетка — препятствие, dp[i][j] = 0',
        'Если стартовая или конечная клетка — препятствие, ответ 0',
        'Оптимизируй до 1D массива'
      ],
      expectedOutput: 'Input: obstacleGrid=[[0,0,0],[0,1,0],[0,0,0]]\nOutput: 2',
      hint: 'Аналогично Unique Paths, но dp[i][j]=0 если obstacle. Первая строка и столбец: dp=1, но если встретили препятствие — все последующие dp=0 (путь заблокирован).',
      solution: `class Solution {
    public int uniquePathsWithObstacles(int[][] obstacleGrid) {
        int n = obstacleGrid[0].length;
        int[] dp = new int[n];
        dp[0] = 1;

        for (int[] row : obstacleGrid) {
            for (int j = 0; j < n; j++) {
                if (row[j] == 1) {
                    dp[j] = 0;
                } else if (j > 0) {
                    dp[j] += dp[j - 1];
                }
            }
        }
        return dp[n - 1];
    }
}`,
      explanation: 'Как Unique Paths, но клетки с препятствиями дают dp=0. Оптимизация до 1D: dp[j] обновляется на каждой строке. Если клетка — препятствие, dp[j]=0 (пути нет). Иначе dp[j] += dp[j-1]. Время: O(m*n), память: O(n).'
    },
    {
      id: 3,
      title: 'Minimum Path Sum (LeetCode #64)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана сетка m x n с неотрицательными числами. Найди путь из левого верхнего в правый нижний угол с минимальной суммой. Двигаться можно только вниз или вправо.\n\nПример:\n  grid = [[1,3,1],[1,5,1],[4,2,1]] → 7 (путь: 1→3→1→1→1)',
      requirements: [
        'Метод int minPathSum(int[][] grid)',
        'dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])',
        'Первая строка и столбец: кумулятивная сумма',
        'Оптимизируй до 1D массива'
      ],
      expectedOutput: 'Input: grid=[[1,3,1],[1,5,1],[4,2,1]]\nOutput: 7',
      hint: 'dp[i][j] = стоимость клетки + минимум из (сверху, слева). Первая строка: dp[0][j] = dp[0][j-1] + grid[0][j]. Первый столбец: dp[i][0] = dp[i-1][0] + grid[i][0]. Оптимизация: 1D массив.',
      solution: `class Solution {
    public int minPathSum(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[] dp = new int[n];
        dp[0] = grid[0][0];

        // первая строка
        for (int j = 1; j < n; j++) {
            dp[j] = dp[j - 1] + grid[0][j];
        }

        for (int i = 1; i < m; i++) {
            dp[0] += grid[i][0]; // первый столбец
            for (int j = 1; j < n; j++) {
                dp[j] = grid[i][j] + Math.min(dp[j], dp[j - 1]);
            }
        }
        return dp[n - 1];
    }
}`,
      explanation: 'DP: для каждой клетки минимальная стоимость пути = стоимость клетки + min(сверху, слева). Оптимизация до 1D: dp[j] — сверху, dp[j-1] — слева. Время: O(m*n), память: O(n).'
    },
    {
      id: 4,
      title: 'Maximal Square (LeetCode #221)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана бинарная матрица m x n из \'0\' и \'1\'. Найди площадь максимального квадрата, содержащего только единицы.\n\nПример:\n  matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]\n  Ответ: 4 (квадрат 2x2)',
      requirements: [
        'Метод int maximalSquare(char[][] matrix)',
        'dp[i][j] = сторона максимального квадрата с правым нижним углом в (i,j)',
        'dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1 (если matrix[i][j]=\'1\')',
        'Ответ = max(dp[i][j])^2'
      ],
      expectedOutput: 'Input: matrix=[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]\nOutput: 4',
      hint: 'Ключевая формула: dp[i][j] = min(верх, лево, диагональ) + 1. Квадрат ограничен минимальным из трёх соседей. Если хотя бы один из них 0 — квадрат не расширяется.',
      solution: `class Solution {
    public int maximalSquare(char[][] matrix) {
        int m = matrix.length, n = matrix[0].length;
        int[] dp = new int[n + 1];
        int maxSide = 0, prev = 0;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                int temp = dp[j];
                if (matrix[i - 1][j - 1] == '1') {
                    dp[j] = Math.min(Math.min(dp[j - 1], dp[j]), prev) + 1;
                    maxSide = Math.max(maxSide, dp[j]);
                } else {
                    dp[j] = 0;
                }
                prev = temp;
            }
            prev = 0;
        }
        return maxSide * maxSide;
    }
}`,
      explanation: 'dp[i][j] = сторона максимального квадрата из единиц с правым нижним углом в (i,j). Формула: min(верх, лево, диагональ) + 1 — квадрат ограничен минимальным соседом. Оптимизация до 1D с переменной prev для диагонали. Время: O(m*n), память: O(n).'
    },
    {
      id: 5,
      title: '0/1 Knapsack Problem',
      type: 'practice',
      difficulty: 'medium',
      description: 'Классическая задача рюкзака: даны n предметов с весами weights[] и стоимостями values[]. Рюкзак выдерживает вес capacity. Каждый предмет можно взять 0 или 1 раз. Найди максимальную суммарную стоимость.\n\nПример:\n  weights = [1,3,4,5], values = [1,4,5,7], capacity = 7\n  Ответ: 9 (предметы с весами 3 и 4: стоимость 4+5=9)',
      requirements: [
        'Метод int knapsack(int[] weights, int[] values, int capacity)',
        'dp[i][w] = макс стоимость, используя первые i предметов и вес <= w',
        'Для каждого предмета: взять или не взять',
        'Оптимизируй до 1D массива (идти с конца!)'
      ],
      expectedOutput: 'Input: weights=[1,3,4,5], values=[1,4,5,7], capacity=7\nOutput: 9',
      hint: 'dp[w] = макс стоимость для рюкзака вместимостью w. Для каждого предмета i: от capacity вниз до weights[i]: dp[w] = max(dp[w], dp[w-weights[i]] + values[i]). Идём с конца, чтобы предмет не использовался дважды.',
      solution: `class Solution {
    public int knapsack(int[] weights, int[] values, int capacity) {
        int[] dp = new int[capacity + 1];

        for (int i = 0; i < weights.length; i++) {
            for (int w = capacity; w >= weights[i]; w--) {
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
            }
        }
        return dp[capacity];
    }
}`,
      explanation: 'Классический 0/1 Knapsack. 1D DP: dp[w] = макс стоимость для рюкзака весом w. Для каждого предмета обходим с конца (от capacity к weights[i]), чтобы каждый предмет использовался максимум один раз. Время: O(n * capacity), память: O(capacity).'
    },
    {
      id: 6,
      title: 'Target Sum (LeetCode #494)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums и целое число target. Перед каждым числом можно поставить + или -. Посчитай количество способов получить target.\n\nПример:\n  nums = [1,1,1,1,1], target = 3 → 5\n  (−1+1+1+1+1, +1−1+1+1+1, +1+1−1+1+1, +1+1+1−1+1, +1+1+1+1−1)',
      requirements: [
        'Метод int findTargetSumWays(int[] nums, int target)',
        'Сведи к задаче подмножеств: P - N = target, P + N = sum → P = (sum+target)/2',
        'Используй 0/1 knapsack для подсчёта подмножеств с суммой P',
        'Проверь: (sum + target) должно быть чётным и неотрицательным'
      ],
      expectedOutput: 'Input: nums=[1,1,1,1,1], target=3\nOutput: 5',
      hint: 'Преобразуй: P (плюсовые) и N (минусовые). P-N=target, P+N=sum. P=(sum+target)/2. Задача: сколько подмножеств с суммой P? 0/1 Knapsack: dp[j] += dp[j-num].',
      solution: `class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        int sum = 0;
        for (int num : nums) sum += num;
        if ((sum + target) % 2 != 0 || sum + target < 0) return 0;

        int p = (sum + target) / 2;
        int[] dp = new int[p + 1];
        dp[0] = 1;

        for (int num : nums) {
            for (int j = p; j >= num; j--) {
                dp[j] += dp[j - num];
            }
        }
        return dp[p];
    }
}`,
      explanation: 'Сводим к задаче подмножеств: P=(sum+target)/2. Считаем количество подмножеств с суммой P через 0/1 Knapsack. dp[j] = число способов набрать сумму j. Для каждого числа: dp[j] += dp[j-num] (с конца!). Время: O(n * P), память: O(P).'
    },
    {
      id: 7,
      title: 'Interleaving String (LeetCode #97)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Даны строки s1, s2 и s3. Определи, является ли s3 чередованием s1 и s2 (все символы s1 и s2 используются, порядок внутри каждой строки сохраняется).\n\nПример:\n  s1="aabcc", s2="dbbca", s3="aadbbcbcac" → true\n  s1="aabcc", s2="dbbca", s3="aadbbbaccc" → false',
      requirements: [
        'Метод boolean isInterleave(String s1, String s2, String s3)',
        'dp[i][j] = true, если s3[0..i+j-1] — чередование s1[0..i-1] и s2[0..j-1]',
        'Переход: dp[i][j] = (dp[i-1][j] && s1[i-1]==s3[i+j-1]) || (dp[i][j-1] && s2[j-1]==s3[i+j-1])',
        'Оптимизируй до 1D'
      ],
      expectedOutput: 'Input: s1="aabcc", s2="dbbca", s3="aadbbcbcac"\nOutput: true',
      hint: 'dp[i][j] = s3 до позиции i+j является чередованием s1 до i и s2 до j. Переходы: если s1[i-1]==s3[i+j-1] → от dp[i-1][j]; если s2[j-1]==s3[i+j-1] → от dp[i][j-1].',
      solution: `class Solution {
    public boolean isInterleave(String s1, String s2, String s3) {
        int m = s1.length(), n = s2.length();
        if (m + n != s3.length()) return false;

        boolean[] dp = new boolean[n + 1];
        for (int i = 0; i <= m; i++) {
            for (int j = 0; j <= n; j++) {
                if (i == 0 && j == 0) {
                    dp[j] = true;
                } else if (i == 0) {
                    dp[j] = dp[j - 1] && s2.charAt(j - 1) == s3.charAt(j - 1);
                } else if (j == 0) {
                    dp[j] = dp[j] && s1.charAt(i - 1) == s3.charAt(i - 1);
                } else {
                    dp[j] = (dp[j] && s1.charAt(i - 1) == s3.charAt(i + j - 1))
                          || (dp[j - 1] && s2.charAt(j - 1) == s3.charAt(i + j - 1));
                }
            }
        }
        return dp[n];
    }
}`,
      explanation: '2D DP, оптимизированная до 1D. dp[j] (после обработки строки i) показывает, можно ли составить s3[0..i+j-1] чередованием s1[0..i-1] и s2[0..j-1]. Два перехода: взять символ из s1 или из s2. Время: O(m*n), память: O(n).'
    },
    {
      id: 8,
      title: 'Longest Common Subsequence (LeetCode #1143)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Даны две строки text1 и text2. Найди длину их наибольшей общей подпоследовательности (LCS). Подпоследовательность — символы в том же порядке, но не обязательно подряд.\n\nПример:\n  text1="abcde", text2="ace" → 3 (LCS = "ace")\n  text1="abc", text2="def" → 0',
      requirements: [
        'Метод int longestCommonSubsequence(String text1, String text2)',
        'dp[i][j] = LCS для text1[0..i-1] и text2[0..j-1]',
        'Если символы совпадают: dp[i][j] = dp[i-1][j-1] + 1',
        'Иначе: dp[i][j] = max(dp[i-1][j], dp[i][j-1])'
      ],
      expectedOutput: 'Input: text1="abcde", text2="ace"\nOutput: 3',
      hint: 'Два случая: (1) text1[i-1]==text2[j-1] → оба символа в LCS, dp[i][j]=dp[i-1][j-1]+1. (2) Не совпадают → берём лучшее из «без последнего символа text1» или «без последнего символа text2».',
      solution: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[] dp = new int[n + 1];

        for (int i = 1; i <= m; i++) {
            int prev = 0; // dp[i-1][j-1]
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
      explanation: 'Классическая 2D DP задача, оптимизированная до 1D. При совпадении символов: dp[j] = prev (диагональ) + 1. При несовпадении: max(dp[j] сверху, dp[j-1] слева). Переменная prev хранит dp[i-1][j-1]. Время: O(m*n), память: O(n).'
    },
    {
      id: 9,
      title: 'Coin Change 2 (LeetCode #518)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Даны монеты разных номиналов coins и сумма amount. Найди количество комбинаций монет, дающих эту сумму. Каждая монета может использоваться неограниченно.\n\nПример:\n  amount=5, coins=[1,2,5] → 4\n  (5, 2+2+1, 2+1+1+1, 1+1+1+1+1)',
      requirements: [
        'Метод int change(int amount, int[] coins)',
        'Unbounded knapsack: dp[j] += dp[j - coin]',
        'В отличие от 0/1 knapsack: внутренний цикл идёт ВПЕРЁД (от coin до amount)',
        'dp[0] = 1 (один способ набрать сумму 0 — не взять ничего)'
      ],
      expectedOutput: 'Input: amount=5, coins=[1,2,5]\nOutput: 4',
      hint: 'Unbounded knapsack (бесконечный рюкзак). Внешний цикл — по монетам, внутренний — от coin до amount ВПЕРЁД (можно использовать повторно). dp[j] += dp[j-coin]. Порядок циклов важен, чтобы не считать перестановки!',
      solution: `class Solution {
    public int change(int amount, int[] coins) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;

        for (int coin : coins) {
            for (int j = coin; j <= amount; j++) {
                dp[j] += dp[j - coin];
            }
        }
        return dp[amount];
    }
}`,
      explanation: 'Unbounded Knapsack: монету можно использовать неограниченно, поэтому внутренний цикл идёт вперёд (от coin до amount). Внешний цикл по монетам гарантирует подсчёт комбинаций (не перестановок). dp[0]=1 — базовый случай. Время: O(amount * coins.length), память: O(amount).'
    },
    {
      id: 10,
      title: 'Dungeon Game (LeetCode #174)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Рыцарь в левом верхнем углу подземелья m x n, принцесса — в правом нижнем. Каждая клетка содержит число (отрицательное — урон, положительное — лечение). Рыцарь двигается вниз или вправо. Найди минимальное начальное здоровье, чтобы дойти до принцессы (здоровье > 0 всегда).\n\nПример:\n  dungeon = [[-2,-3,3],[-5,-10,1],[10,30,-5]]\n  Ответ: 7',
      requirements: [
        'Метод int calculateMinimumHP(int[][] dungeon)',
        'DP с конца: dp[i][j] = мин здоровье для достижения (m-1,n-1) из (i,j)',
        'dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j])',
        'Заполняй от правого нижнего к левому верхнему'
      ],
      expectedOutput: 'Input: dungeon=[[-2,-3,3],[-5,-10,1],[10,30,-5]]\nOutput: 7',
      hint: 'Идём с конца! dp[m-1][n-1] = max(1, 1 - dungeon[m-1][n-1]). Для (i,j): нужно min здоровья для следующего шага минус бонус/урон текущей клетки, но не менее 1. dp[i][j] = max(1, min(dp[i+1][j], dp[i][j+1]) - dungeon[i][j]).',
      solution: `class Solution {
    public int calculateMinimumHP(int[][] dungeon) {
        int m = dungeon.length, n = dungeon[0].length;
        int[] dp = new int[n + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[n - 1] = 1; // начальная точка для правого нижнего угла

        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                int minNext;
                if (i == m - 1 && j == n - 1) {
                    minNext = 1;
                } else if (i == m - 1) {
                    minNext = dp[j + 1];
                } else if (j == n - 1) {
                    minNext = dp[j];
                } else {
                    minNext = Math.min(dp[j], dp[j + 1]);
                }
                dp[j] = Math.max(1, minNext - dungeon[i][j]);
            }
        }
        return dp[0];
    }
}`,
      explanation: 'DP с конца (обратный проход): dp[i][j] = минимальное здоровье для (i,j), чтобы дойти до конца. Для каждой клетки: нужно min(вниз, вправо) - dungeon[i][j] здоровья, но не менее 1. Оптимизация до 1D. Время: O(m*n), память: O(n).'
    }
  ]
}
