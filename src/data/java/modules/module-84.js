export default {
  id: 84,
  title: 'Практикум: Динамическое программирование',
  description: 'Практические задачи на динамическое программирование: Fibonacci, рюкзак, LIS, LCS, Edit Distance и другие классические задачи DP.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Fibonacci / Climbing Stairs',
      type: 'practice',
      difficulty: 'easy',
      description: 'Найди n-е число Фибоначчи. Затем реши задачу Climbing Stairs: сколькими способами можно подняться на n ступенек, если за шаг можно подняться на 1 или 2 ступеньки.',
      requirements: [
        'Реализуй fibonacci(n) с мемоизацией (или bottom-up DP)',
        'Реализуй climbStairs(n) — аналогичная рекурренция',
        'Оптимизируй до O(1) по памяти — храни только два предыдущих значения',
        'Выведи результаты для нескольких n'
      ],
      expectedOutput: 'Fibonacci(10) = 55\nClimbing Stairs(5) = 8\nClimbing Stairs(10) = 89',
      hint: 'Climbing Stairs — это по сути Fibonacci! ways(n) = ways(n-1) + ways(n-2). Для O(1) памяти: храни prev1 и prev2, обновляй на каждом шаге.',
      solution: `public class Main {
    static long fibonacci(int n) {
        if (n <= 1) return n;
        long a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            long temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }

    static int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }

    public static void main(String[] args) {
        System.out.println("Fibonacci(10) = " + fibonacci(10));
        System.out.println("Climbing Stairs(5) = " + climbStairs(5));
        System.out.println("Climbing Stairs(10) = " + climbStairs(10));
    }
}`,
      explanation: 'Fibonacci и Climbing Stairs имеют одинаковую рекурренцию: f(n) = f(n-1) + f(n-2). Наивная рекурсия имеет экспоненциальную сложность O(2^n). Bottom-up DP с двумя переменными — O(n) по времени и O(1) по памяти. Climbing Stairs: на n-ю ступеньку можно попасть с (n-1)-й (один шаг) или с (n-2)-й (два шага), поэтому ways(n) = ways(n-1) + ways(n-2).'
    },
    {
      id: 2,
      title: 'Задача: House Robber',
      type: 'practice',
      difficulty: 'medium',
      description: 'Грабитель не может обчистить два соседних дома. Дан массив — сумма в каждом доме. Найди максимальную сумму, которую можно украсть.',
      requirements: [
        'Определи рекурренцию: dp[i] = max(dp[i-1], dp[i-2] + nums[i])',
        'Для каждого дома выбор: пропустить или ограбить',
        'Оптимизируй до O(1) по памяти',
        'Протестируй на нескольких примерах'
      ],
      expectedOutput: 'Дома: [1, 2, 3, 1] → Максимум: 4\nДома: [2, 7, 9, 3, 1] → Максимум: 12',
      hint: 'dp[i] = max(не грабить дом i → dp[i-1], ограбить дом i → dp[i-2] + nums[i]). Начальные: dp[0] = nums[0], dp[1] = max(nums[0], nums[1]).',
      solution: `import java.util.Arrays;

public class Main {
    static int rob(int[] nums) {
        if (nums.length == 0) return 0;
        if (nums.length == 1) return nums[0];

        int prev2 = nums[0];
        int prev1 = Math.max(nums[0], nums[1]);

        for (int i = 2; i < nums.length; i++) {
            int curr = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }

    public static void main(String[] args) {
        int[] houses1 = {1, 2, 3, 1};
        System.out.println("Дома: " + Arrays.toString(houses1) + " → Максимум: " + rob(houses1));

        int[] houses2 = {2, 7, 9, 3, 1};
        System.out.println("Дома: " + Arrays.toString(houses2) + " → Максимум: " + rob(houses2));
    }
}`,
      explanation: 'House Robber — классическая задача DP с выбором "взять или пропустить". Для каждого дома: либо пропустить (оставить предыдущий максимум dp[i-1]), либо ограбить (dp[i-2] + nums[i], потому что соседний дом пропущен). Оптимизация: вместо массива dp храним только два предыдущих значения. Для [2,7,9,3,1]: берём 2, 9, 1 = 12.'
    },
    {
      id: 3,
      title: 'Задача: Coin Change',
      type: 'practice',
      difficulty: 'medium',
      description: 'Даны монеты разных номиналов и сумма amount. Найди минимальное количество монет для набора этой суммы. Если невозможно — верни -1.',
      requirements: [
        'Создай массив dp[amount+1], заполни значением amount+1 (невозможно)',
        'dp[0] = 0 (для суммы 0 нужно 0 монет)',
        'Для каждой суммы i и каждой монеты coin: dp[i] = min(dp[i], dp[i-coin] + 1)',
        'Верни dp[amount] или -1 если невозможно'
      ],
      expectedOutput: 'Монеты: [1, 5, 10, 25], сумма: 30\nМинимум монет: 2 (25 + 5)\n\nМонеты: [2], сумма: 3\nМинимум монет: -1 (невозможно)',
      hint: 'Bottom-up: для каждой суммы от 1 до amount, для каждой монеты — если coin <= i, пробуй dp[i] = min(dp[i], dp[i - coin] + 1).',
      solution: `import java.util.Arrays;

public class Main {
    static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;

        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }

    public static void main(String[] args) {
        int[] coins1 = {1, 5, 10, 25};
        System.out.println("Монеты: " + Arrays.toString(coins1) + ", сумма: 30");
        System.out.println("Минимум монет: " + coinChange(coins1, 30) + " (25 + 5)");

        System.out.println();

        int[] coins2 = {2};
        System.out.println("Монеты: " + Arrays.toString(coins2) + ", сумма: 3");
        System.out.println("Минимум монет: " + coinChange(coins2, 3) + " (невозможно)");
    }
}`,
      explanation: 'Coin Change — классическая задача unbounded knapsack. dp[i] — минимальное количество монет для суммы i. Для каждой суммы перебираем все монеты: если можем использовать монету coin, то dp[i] = min(dp[i], dp[i-coin] + 1). Начальное значение amount+1 означает "невозможно". Сложность O(amount * coins).'
    },
    {
      id: 4,
      title: 'Задача: Longest Increasing Subsequence',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди длину наибольшей возрастающей подпоследовательности (LIS). Подпоследовательность не обязана быть непрерывной.',
      requirements: [
        'Реализуй DP-решение: dp[i] = длина LIS, заканчивающейся на nums[i]',
        'Для каждого i проверяй все j < i: если nums[j] < nums[i], обнови dp[i]',
        'Ответ — максимум в массиве dp',
        'Попробуй также O(n log n) решение с бинарным поиском (опционально)'
      ],
      expectedOutput: 'Массив: [10, 9, 2, 5, 3, 7, 101, 18]\nДлина LIS: 4 (например: 2, 3, 7, 101)',
      hint: 'dp[i] = 1 (сам элемент). Для каждого j < i: если nums[j] < nums[i], dp[i] = max(dp[i], dp[j] + 1). Ответ = max(dp).',
      solution: `import java.util.Arrays;

public class Main {
    static int lengthOfLIS(int[] nums) {
        int n = nums.length;
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        int maxLen = 1;

        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    dp[i] = Math.max(dp[i], dp[j] + 1);
                }
            }
            maxLen = Math.max(maxLen, dp[i]);
        }
        return maxLen;
    }

    public static void main(String[] args) {
        int[] nums = {10, 9, 2, 5, 3, 7, 101, 18};
        System.out.println("Массив: " + Arrays.toString(nums));
        System.out.println("Длина LIS: " + lengthOfLIS(nums) + " (например: 2, 3, 7, 101)");
    }
}`,
      explanation: 'dp[i] — длина LIS, заканчивающейся элементом nums[i]. Для каждого i перебираем все предыдущие j: если nums[j] < nums[i], можно продолжить LIS, заканчивающуюся на j, элементом i. Сложность O(n^2). Существует O(n log n) решение с использованием массива tails и бинарного поиска. Для [10,9,2,5,3,7,101,18]: LIS = [2,3,7,101] или [2,5,7,18].'
    },
    {
      id: 5,
      title: 'Задача: 0/1 Knapsack',
      type: 'practice',
      difficulty: 'medium',
      description: 'Задача о рюкзаке: даны предметы с весами и ценностями. Найди максимальную ценность, которую можно вместить в рюкзак грузоподъёмности W. Каждый предмет можно взять максимум один раз.',
      requirements: [
        'Создай таблицу dp[i][w] — максимальная ценность для первых i предметов и веса w',
        'Для каждого предмета: взять или не взять',
        'dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])',
        'Верни dp[n][W]'
      ],
      expectedOutput: 'Вес рюкзака: 7\nПредметы: вес=[1,3,4,5], ценность=[1,4,5,7]\nМаксимальная ценность: 9 (предметы с весом 3 и 4)',
      hint: 'Двумерная таблица: строки = предметы, столбцы = допустимый вес. Для каждого предмета решаем: если вес предмета <= w, то max(не брать, брать). Можно оптимизировать до 1D массива.',
      solution: `public class Main {
    static int knapsack(int W, int[] weights, int[] values) {
        int n = weights.length;
        int[][] dp = new int[n + 1][W + 1];

        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= W; w++) {
                dp[i][w] = dp[i - 1][w]; // не берём
                if (weights[i - 1] <= w) {
                    dp[i][w] = Math.max(dp[i][w],
                        dp[i - 1][w - weights[i - 1]] + values[i - 1]);
                }
            }
        }
        return dp[n][W];
    }

    public static void main(String[] args) {
        int W = 7;
        int[] weights = {1, 3, 4, 5};
        int[] values = {1, 4, 5, 7};

        System.out.println("Вес рюкзака: " + W);
        System.out.println("Предметы: вес=[1,3,4,5], ценность=[1,4,5,7]");
        System.out.println("Максимальная ценность: " + knapsack(W, weights, values)
            + " (предметы с весом 3 и 4)");
    }
}`,
      explanation: '0/1 Knapsack — фундаментальная задача DP. dp[i][w] — максимальная ценность, используя первые i предметов с лимитом веса w. Для каждого предмета два варианта: не брать (dp[i-1][w]) или взять (dp[i-1][w-weight] + value, если предмет влезает). Сложность O(n*W). Для вес=[1,3,4,5], ценность=[1,4,5,7]: берём предметы 2 и 3 (вес 3+4=7, ценность 4+5=9).'
    },
    {
      id: 6,
      title: 'Задача: Longest Common Subsequence',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди длину наибольшей общей подпоследовательности (LCS) двух строк. Подпоследовательность — символы в том же порядке, но не обязательно подряд.',
      requirements: [
        'Создай таблицу dp[i][j] — длина LCS для text1[0..i-1] и text2[0..j-1]',
        'Если символы совпадают: dp[i][j] = dp[i-1][j-1] + 1',
        'Если не совпадают: dp[i][j] = max(dp[i-1][j], dp[i][j-1])',
        'Восстанови саму LCS через обратный проход'
      ],
      expectedOutput: 'text1="abcde", text2="ace"\nДлина LCS: 3\nLCS: "ace"',
      hint: 'Двумерная таблица. Совпадение символов — берём диагональ +1. Несовпадение — max из верхней и левой ячеек. Для восстановления LCS: иди от dp[m][n] назад, если символы совпали — добавь символ.',
      solution: `public class Main {
    public static void main(String[] args) {
        String text1 = "abcde";
        String text2 = "ace";
        int m = text1.length(), n = text2.length();

        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        // Восстановление LCS
        StringBuilder lcs = new StringBuilder();
        int i = m, j = n;
        while (i > 0 && j > 0) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                lcs.append(text1.charAt(i - 1));
                i--; j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        lcs.reverse();

        System.out.println("text1=\\"abcde\\", text2=\\"ace\\"");
        System.out.println("Длина LCS: " + dp[m][n]);
        System.out.println("LCS: \\"" + lcs + "\\"");
    }
}`,
      explanation: 'LCS — классическая задача на двумерное DP. Таблица dp[i][j] хранит длину LCS для первых i символов text1 и первых j символов text2. При совпадении символов берём диагональ +1, иначе — max(сверху, слева). Восстановление LCS: идём от dp[m][n] к dp[0][0], при совпадении — добавляем символ и идём по диагонали, иначе — к большему значению. Сложность O(m*n).'
    },
    {
      id: 7,
      title: 'Задача: Edit Distance',
      type: 'practice',
      difficulty: 'hard',
      description: 'Найди минимальное количество операций (вставка, удаление, замена) для преобразования строки word1 в word2.',
      requirements: [
        'Создай таблицу dp[i][j] — edit distance для word1[0..i-1] и word2[0..j-1]',
        'Базовые случаи: dp[i][0] = i (удалить все), dp[0][j] = j (вставить все)',
        'Если символы равны: dp[i][j] = dp[i-1][j-1] (бесплатно)',
        'Иначе: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])'
      ],
      expectedOutput: 'word1="horse", word2="ros"\nEdit Distance: 3\n(horse → rorse → rose → ros)',
      hint: 'Три операции: вставка (dp[i][j-1]+1), удаление (dp[i-1][j]+1), замена (dp[i-1][j-1]+1). Если символы совпали — замена бесплатна.',
      solution: `public class Main {
    static int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] dp = new int[m + 1][n + 1];

        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(
                        dp[i - 1][j - 1], // замена
                        Math.min(dp[i - 1][j], dp[i][j - 1]) // удаление, вставка
                    );
                }
            }
        }
        return dp[m][n];
    }

    public static void main(String[] args) {
        System.out.println("word1=\\"horse\\", word2=\\"ros\\"");
        System.out.println("Edit Distance: " + minDistance("horse", "ros"));
        System.out.println("(horse → rorse → rose → ros)");
    }
}`,
      explanation: 'Edit Distance (расстояние Левенштейна) — фундаментальная задача. dp[i][j] — минимальные операции для word1[0..i-1] → word2[0..j-1]. При совпадении символов: бесплатный переход по диагонали. При несовпадении: 1 + min(замена, удаление, вставка). Используется в проверке орфографии, сравнении ДНК, diff-утилитах. Сложность O(m*n).'
    },
    {
      id: 8,
      title: 'Задача: Unique Paths',
      type: 'practice',
      difficulty: 'easy',
      description: 'Робот стоит в левом верхнем углу сетки m×n. Он может двигаться только вправо или вниз. Сколько уникальных путей до правого нижнего угла?',
      requirements: [
        'dp[i][j] = количество путей до ячейки (i, j)',
        'dp[i][j] = dp[i-1][j] + dp[i][j-1] (пришёл сверху или слева)',
        'Первая строка и первый столбец — всё единицы (только один путь)',
        'Оптимизируй до 1D массива'
      ],
      expectedOutput: 'Сетка 3×7: 28 уникальных путей\nСетка 3×3: 6 уникальных путей',
      hint: 'Для 1D оптимизации: dp[j] += dp[j-1] на каждой строке. dp[j] уже содержит значение от предыдущей строки (сверху), а dp[j-1] — от текущей строки (слева).',
      solution: `public class Main {
    static int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        java.util.Arrays.fill(dp, 1);

        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[j] += dp[j - 1];
            }
        }
        return dp[n - 1];
    }

    public static void main(String[] args) {
        System.out.println("Сетка 3×7: " + uniquePaths(3, 7) + " уникальных путей");
        System.out.println("Сетка 3×3: " + uniquePaths(3, 3) + " уникальных путей");
    }
}`,
      explanation: 'Количество путей до ячейки (i,j) = сумма путей сверху и слева, потому что робот может прийти только из этих двух направлений. Первая строка и столбец содержат 1 (только один путь — прямо). 1D оптимизация: dp[j] хранит значение для текущей строки. dp[j] (до обновления) = значение из прошлой строки (сверху), dp[j-1] = уже обновлённое значение текущей строки (слева).'
    },
    {
      id: 9,
      title: 'Задача: Decode Ways',
      type: 'practice',
      difficulty: 'medium',
      description: 'Сообщение закодировано цифрами, где A=1, B=2, ..., Z=26. Дана строка из цифр. Найди количество способов декодирования.',
      requirements: [
        'dp[i] = количество способов декодировать первые i символов',
        'Если текущая цифра != 0: dp[i] += dp[i-1] (один символ)',
        'Если две последние цифры образуют число 10-26: dp[i] += dp[i-2]',
        'Обработай крайние случаи: 0, числа > 26'
      ],
      expectedOutput: 'Строка "226": 3 способа (BZ=2,26 | VF=22,6 | BBF=2,2,6)\nСтрока "12": 2 способа (AB=1,2 | L=12)\nСтрока "06": 0 способов',
      hint: 'Ноль в начале или одинокий ноль — невозможно декодировать (0 не соответствует букве). Пара 10-26 допустима, >26 — только по одному символу.',
      solution: `public class Main {
    static int numDecodings(String s) {
        if (s.isEmpty() || s.charAt(0) == '0') return 0;
        int n = s.length();
        int[] dp = new int[n + 1];
        dp[0] = 1;
        dp[1] = 1;

        for (int i = 2; i <= n; i++) {
            int oneDigit = Integer.parseInt(s.substring(i - 1, i));
            int twoDigits = Integer.parseInt(s.substring(i - 2, i));

            if (oneDigit >= 1) dp[i] += dp[i - 1];
            if (twoDigits >= 10 && twoDigits <= 26) dp[i] += dp[i - 2];
        }
        return dp[n];
    }

    public static void main(String[] args) {
        System.out.println("Строка \\"226\\": " + numDecodings("226")
            + " способа (BZ=2,26 | VF=22,6 | BBF=2,2,6)");
        System.out.println("Строка \\"12\\": " + numDecodings("12")
            + " способа (AB=1,2 | L=12)");
        System.out.println("Строка \\"06\\": " + numDecodings("06") + " способов");
    }
}`,
      explanation: 'Decode Ways — вариация Climbing Stairs с дополнительными ограничениями. На каждом шаге решаем: взять одну цифру (если != 0, это буква 1-9 → A-I) или две цифры (если 10-26 → J-Z). dp[i] = сумма вариантов. Особый случай: "0" нельзя декодировать как одну цифру. Сложность O(n).'
    },
    {
      id: 10,
      title: 'Задача: Word Break',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s и словарь wordDict. Определи, можно ли разбить s на слова из словаря. Слова можно использовать повторно.',
      requirements: [
        'dp[i] = true, если s[0..i-1] можно разбить на слова из словаря',
        'dp[0] = true (пустая строка)',
        'Для каждого i проверяй все j < i: если dp[j] && s[j..i] в словаре → dp[i] = true',
        'Используй HashSet для быстрого поиска по словарю'
      ],
      expectedOutput: 's="leetcode", словарь=["leet","code"]\nМожно разбить: true\n\ns="applepenapple", словарь=["apple","pen"]\nМожно разбить: true\n\ns="catsandog", словарь=["cats","dog","sand","and","cat"]\nМожно разбить: false',
      hint: 'Для каждой позиции i проверяй все возможные разбиения: подстрока s[j..i] должна быть в словаре, и dp[j] должно быть true (первая часть уже разбита).',
      solution: `import java.util.*;

public class Main {
    static boolean wordBreak(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        int n = s.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true;

        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < i; j++) {
                if (dp[j] && wordSet.contains(s.substring(j, i))) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[n];
    }

    public static void main(String[] args) {
        System.out.println("s=\\"leetcode\\", словарь=[\\"leet\\",\\"code\\"]");
        System.out.println("Можно разбить: " + wordBreak("leetcode", Arrays.asList("leet", "code")));

        System.out.println();
        System.out.println("s=\\"applepenapple\\", словарь=[\\"apple\\",\\"pen\\"]");
        System.out.println("Можно разбить: " + wordBreak("applepenapple", Arrays.asList("apple", "pen")));

        System.out.println();
        System.out.println("s=\\"catsandog\\", словарь=[\\"cats\\",\\"dog\\",\\"sand\\",\\"and\\",\\"cat\\"]");
        System.out.println("Можно разбить: " + wordBreak("catsandog",
            Arrays.asList("cats", "dog", "sand", "and", "cat")));
    }
}`,
      explanation: 'Word Break — задача DP с проверкой подстрок. dp[i] означает "можно ли разбить первые i символов". Для каждой позиции i перебираем все разбиения на две части: s[0..j) уже разбита (dp[j]=true) и s[j..i) есть в словаре. HashSet обеспечивает O(1) поиск слова. "catsandog" нельзя разбить: "dog" остаётся, но "catsan" или "catsa" не в словаре.'
    }
  ]
}
