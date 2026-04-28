export default {
  id: 43,
  title: 'Практикум: DP — одномерные задачи',
  description: 'Десять задач на одномерное динамическое программирование: лестницы, грабёж домов, монеты, подпоследовательности и разбиения.',
  lessons: [
    {
      id: 1,
      title: 'Climbing Stairs (LeetCode #70)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Ты поднимаешься по лестнице из n ступеней. На каждом шаге можно подняться на 1 или 2 ступени. Сколько различных способов добраться до вершины?\n\nПример:\n  n = 3 → 3 (1+1+1, 1+2, 2+1)\n  n = 5 → 8',
      requirements: [
        'Метод int climbStairs(int n)',
        'Используй DP: dp[i] = dp[i-1] + dp[i-2]',
        'Оптимизируй память до O(1) с помощью двух переменных',
        'Обработай базовые случаи: n=1, n=2'
      ],
      expectedOutput: 'Input: n=3\nOutput: 3\n\nInput: n=5\nOutput: 8',
      hint: 'Это числа Фибоначчи! dp[i] = dp[i-1] + dp[i-2]. Базовые случаи: dp[1]=1, dp[2]=2. Для O(1) памяти: храни только два предыдущих значения в переменных prev1, prev2.',
      solution: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1; // dp[i-2]
        int prev1 = 2; // dp[i-1]
        for (int i = 3; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
}`,
      explanation: 'Классическая задача DP, эквивалентная числам Фибоначчи. dp[i] = dp[i-1] (шагнул на 1) + dp[i-2] (шагнул на 2). Оптимизация: храним только два предыдущих значения. Время: O(n), память: O(1).'
    },
    {
      id: 2,
      title: 'House Robber (LeetCode #198)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Грабитель планирует ограбить дома на улице. Каждый дом содержит определённую сумму денег. Нельзя грабить два соседних дома (сработает сигнализация). Найди максимальную сумму, которую можно украсть.\n\nПример:\n  nums = [1,2,3,1] → 4 (дома 0 и 2: 1+3)\n  nums = [2,7,9,3,1] → 12 (дома 0, 2, 4: 2+9+1)',
      requirements: [
        'Метод int rob(int[] nums)',
        'dp[i] = max(dp[i-1], dp[i-2] + nums[i])',
        'Для каждого дома: грабить (+ dp[i-2]) или не грабить (dp[i-1])',
        'Оптимизируй память до O(1)'
      ],
      expectedOutput: 'Input: nums=[2,7,9,3,1]\nOutput: 12',
      hint: 'Для каждого дома i есть два варианта: (1) не грабить — берём dp[i-1], (2) грабить — берём nums[i] + dp[i-2]. Выбираем максимум. Для O(1) памяти: prev2 = dp[i-2], prev1 = dp[i-1].',
      solution: `class Solution {
    public int rob(int[] nums) {
        if (nums.length == 1) return nums[0];
        int prev2 = 0; // dp[i-2]
        int prev1 = 0; // dp[i-1]
        for (int num : nums) {
            int curr = Math.max(prev1, prev2 + num);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
}`,
      explanation: 'Классическая 1D DP задача. Для каждого дома: max(не грабить = prev1, грабить = prev2 + nums[i]). Оптимизация до O(1) памяти с двумя переменными. Время: O(n), память: O(1).'
    },
    {
      id: 3,
      title: 'House Robber II (LeetCode #213)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Аналогично House Robber, но дома расположены в кольце — первый и последний дома соседние. Нельзя грабить оба.\n\nПример:\n  nums = [2,3,2] → 3 (грабим только дом 1)\n  nums = [1,2,3,1] → 4 (грабим дома 1 и 3: 2+... нет, дома 0 и 2: 1+3)',
      requirements: [
        'Метод int rob(int[] nums)',
        'Разбей на два случая: грабить дома [0..n-2] или [1..n-1]',
        'В каждом случае применяй обычный House Robber',
        'Ответ = max из двух случаев'
      ],
      expectedOutput: 'Input: nums=[1,2,3,1]\nOutput: 4',
      hint: 'Кольцо: первый и последний дом соседи. Значит либо не грабим первый (rob nums[1..n-1]), либо не грабим последний (rob nums[0..n-2]). Ответ — max из двух запусков обычного House Robber.',
      solution: `class Solution {
    public int rob(int[] nums) {
        if (nums.length == 1) return nums[0];
        return Math.max(
            robRange(nums, 0, nums.length - 2),
            robRange(nums, 1, nums.length - 1)
        );
    }

    private int robRange(int[] nums, int start, int end) {
        int prev2 = 0, prev1 = 0;
        for (int i = start; i <= end; i++) {
            int curr = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
}`,
      explanation: 'Разбиваем кольцо на два линейных случая: (1) без последнего дома [0..n-2], (2) без первого дома [1..n-1]. Это гарантирует, что первый и последний дом не ограблены одновременно. Время: O(n), память: O(1).'
    },
    {
      id: 4,
      title: 'Coin Change (LeetCode #322)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Даны монеты различных номиналов coins и сумма amount. Найди минимальное количество монет для набора этой суммы. Если невозможно — верни -1.\n\nПример:\n  coins = [1,5,11], amount = 15 → 3 (5+5+5)\n  coins = [2], amount = 3 → -1',
      requirements: [
        'Метод int coinChange(int[] coins, int amount)',
        'dp[i] = минимальное количество монет для суммы i',
        'dp[i] = min(dp[i - coin] + 1) для всех монет coin',
        'Инициализируй dp[] значением amount+1 (недостижимо)'
      ],
      expectedOutput: 'Input: coins=[1,5,11], amount=15\nOutput: 3',
      hint: 'dp[0] = 0 (для суммы 0 нужно 0 монет). Для каждой суммы i от 1 до amount: перебирай монеты, если coin <= i, то dp[i] = min(dp[i], dp[i-coin] + 1). Если dp[amount] > amount — верни -1.',
      solution: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1); // "бесконечность"
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
}`,
      explanation: 'Классическая DP задача «рюкзак». dp[i] = минимум монет для суммы i. Для каждой суммы перебираем все номиналы монет. Если dp[amount] осталось «бесконечностью» — сумму набрать невозможно. Время: O(amount * coins.length), память: O(amount).'
    },
    {
      id: 5,
      title: 'Longest Increasing Subsequence (LeetCode #300)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив целых чисел nums. Найди длину наибольшей строго возрастающей подпоследовательности (LIS).\n\nПример:\n  nums = [10,9,2,5,3,7,101,18] → 4 ([2,3,7,101] или [2,5,7,101])\n  nums = [0,1,0,3,2,3] → 4',
      requirements: [
        'Метод int lengthOfLIS(int[] nums)',
        'DP решение: dp[i] = длина LIS, оканчивающейся на nums[i]',
        'Для каждого i перебирай все j < i: если nums[j] < nums[i], dp[i] = max(dp[i], dp[j]+1)',
        'Бонус: реализуй O(n log n) через бинарный поиск + patience sorting'
      ],
      expectedOutput: 'Input: nums=[10,9,2,5,3,7,101,18]\nOutput: 4',
      hint: 'DP: dp[i] = 1 изначально. Для каждого i: проверь все j < i. Если nums[j] < nums[i] → dp[i] = max(dp[i], dp[j]+1). Ответ = max(dp[]). Для O(n log n): поддерживай массив tails и используй бинарный поиск.',
      solution: `class Solution {
    // O(n^2) DP решение
    public int lengthOfLIS(int[] nums) {
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

    // O(n log n) решение через бинарный поиск
    public int lengthOfLIS_optimal(int[] nums) {
        List<Integer> tails = new ArrayList<>();
        for (int num : nums) {
            int pos = Collections.binarySearch(tails, num);
            if (pos < 0) pos = -(pos + 1);
            if (pos == tails.size()) {
                tails.add(num);
            } else {
                tails.set(pos, num);
            }
        }
        return tails.size();
    }
}`,
      explanation: 'DP O(n^2): dp[i] = длина LIS, заканчивающейся на nums[i]. Для каждого i проверяем все предыдущие элементы. Оптимальное O(n log n): поддерживаем массив tails — наименьшие хвостовые элементы подпоследовательностей каждой длины. Бинарный поиск находит позицию для вставки/замены.'
    },
    {
      id: 6,
      title: 'Word Break (LeetCode #139)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s и словарь wordDict. Определи, можно ли разбить s на последовательность слов из словаря. Слова могут использоваться повторно.\n\nПример:\n  s = "leetcode", wordDict = ["leet","code"] → true\n  s = "applepenapple", wordDict = ["apple","pen"] → true\n  s = "catsandog", wordDict = ["cats","dog","sand","and","cat"] → false',
      requirements: [
        'Метод boolean wordBreak(String s, List<String> wordDict)',
        'dp[i] = true, если s[0..i-1] можно разбить на слова из словаря',
        'Для каждой позиции i проверяй все возможные последние слова',
        'Используй HashSet для быстрой проверки слов'
      ],
      expectedOutput: 'Input: s="leetcode", wordDict=["leet","code"]\nOutput: true',
      hint: 'dp[0] = true (пустая строка). Для каждого i от 1 до n: для каждого j от 0 до i-1: если dp[j]==true и s[j..i] есть в словаре → dp[i]=true. Используй Set для O(1) проверки.',
      solution: `class Solution {
    public boolean wordBreak(String s, List<String> wordDict) {
        Set<String> wordSet = new HashSet<>(wordDict);
        int n = s.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true; // пустая строка

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
}`,
      explanation: 'DP: dp[i] означает, что s[0..i-1] разбивается на слова из словаря. Для каждой позиции i перебираем точку разреза j: если dp[j]=true и s[j..i] есть в словаре — dp[i]=true. Время: O(n^2 * m), где m — средняя длина слова (для substring). Память: O(n).'
    },
    {
      id: 7,
      title: 'Decode Ways (LeetCode #91)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Сообщение закодировано: A=1, B=2, ..., Z=26. Дана строка s из цифр. Посчитай количество способов декодирования.\n\nПример:\n  s = "12" → 2 (AB или L)\n  s = "226" → 3 (BZ, VF, BBF)\n  s = "06" → 0 (ведущий ноль невалиден)',
      requirements: [
        'Метод int numDecodings(String s)',
        'dp[i] = количество способов декодирования s[0..i-1]',
        'Одна цифра: если s[i-1] != \'0\', dp[i] += dp[i-1]',
        'Две цифры: если 10 <= s[i-2..i-1] <= 26, dp[i] += dp[i-2]'
      ],
      expectedOutput: 'Input: s="226"\nOutput: 3',
      hint: 'dp[0]=1, dp[1]= (s[0]!=\'0\' ? 1 : 0). Для i от 2: одна цифра s[i-1]!=\'0\' → dp[i]+=dp[i-1]; две цифры: num=s[i-2]*10+s[i-1], если 10<=num<=26 → dp[i]+=dp[i-2]. Оптимизируй до O(1) памяти.',
      solution: `class Solution {
    public int numDecodings(String s) {
        if (s.charAt(0) == '0') return 0;
        int n = s.length();
        int prev2 = 1; // dp[i-2]
        int prev1 = 1; // dp[i-1]

        for (int i = 1; i < n; i++) {
            int curr = 0;
            // одна цифра
            if (s.charAt(i) != '0') {
                curr += prev1;
            }
            // две цифры
            int twoDigit = (s.charAt(i - 1) - '0') * 10 + (s.charAt(i) - '0');
            if (twoDigit >= 10 && twoDigit <= 26) {
                curr += prev2;
            }
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
}`,
      explanation: 'DP, похожая на Climbing Stairs, но с условиями валидности. Одна цифра: допустима, если не \'0\'. Две цифры: допустимы, если число от 10 до 26. Оптимизация до O(1) памяти с двумя переменными. Время: O(n), память: O(1).'
    },
    {
      id: 8,
      title: 'Maximum Product Subarray (LeetCode #152)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди подмассив (непрерывный) с максимальным произведением элементов.\n\nПример:\n  nums = [2,3,-2,4] → 6 (подмассив [2,3])\n  nums = [-2,0,-1] → 0 (подмассив [0])\n  nums = [-2,3,-4] → 24 (весь массив)',
      requirements: [
        'Метод int maxProduct(int[] nums)',
        'Отслеживай текущий максимум и минимум (отрицательное число может стать максимумом)',
        'При встрече отрицательного числа — swap min и max',
        'Обновляй глобальный максимум на каждом шаге'
      ],
      expectedOutput: 'Input: nums=[2,3,-2,4]\nOutput: 6',
      hint: 'Ключевая идея: отрицательный * отрицательный = положительный. Поэтому храни и curMax, и curMin. При отрицательном nums[i]: swap(curMax, curMin). curMax = max(nums[i], curMax*nums[i]). curMin = min(nums[i], curMin*nums[i]).',
      solution: `class Solution {
    public int maxProduct(int[] nums) {
        int maxProd = nums[0];
        int curMax = nums[0];
        int curMin = nums[0];

        for (int i = 1; i < nums.length; i++) {
            if (nums[i] < 0) {
                int temp = curMax;
                curMax = curMin;
                curMin = temp;
            }
            curMax = Math.max(nums[i], curMax * nums[i]);
            curMin = Math.min(nums[i], curMin * nums[i]);
            maxProd = Math.max(maxProd, curMax);
        }
        return maxProd;
    }
}`,
      explanation: 'Храним два значения: curMax (макс произведение, заканчивающееся на i) и curMin (мин произведение). При отрицательном числе swap — минимум станет максимумом и наоборот. На каждом шаге решаем: начать новый подмассив или продолжить. Время: O(n), память: O(1).'
    },
    {
      id: 9,
      title: 'Partition Equal Subset Sum (LeetCode #416)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив целых положительных чисел nums. Определи, можно ли разделить массив на два подмножества с равной суммой.\n\nПример:\n  nums = [1,5,11,5] → true (подмножества {1,5,5} и {11})\n  nums = [1,2,3,5] → false',
      requirements: [
        'Метод boolean canPartition(int[] nums)',
        'Если сумма нечётная — false',
        'Сведи к задаче: есть ли подмножество с суммой sum/2',
        'Используй 1D DP (0/1 knapsack): boolean[] dp размером sum/2 + 1'
      ],
      expectedOutput: 'Input: nums=[1,5,11,5]\nOutput: true',
      hint: 'Сумма всех = 22, target = 11. dp[j] = true, если можно набрать сумму j из элементов. Для каждого num: идём от target вниз до num: dp[j] = dp[j] || dp[j-num]. Идём с конца, чтобы не использовать элемент дважды.',
      solution: `class Solution {
    public boolean canPartition(int[] nums) {
        int sum = 0;
        for (int num : nums) sum += num;
        if (sum % 2 != 0) return false;

        int target = sum / 2;
        boolean[] dp = new boolean[target + 1];
        dp[0] = true;

        for (int num : nums) {
            for (int j = target; j >= num; j--) {
                dp[j] = dp[j] || dp[j - num];
            }
        }
        return dp[target];
    }
}`,
      explanation: 'Сводим к 0/1 Knapsack: можно ли набрать сумму sum/2? Если сумма нечётная — сразу false. 1D DP: dp[j] = можно ли набрать сумму j. Идём с конца (от target к num), чтобы каждый элемент использовался максимум один раз. Время: O(n * sum/2), память: O(sum/2).'
    },
    {
      id: 10,
      title: 'Jump Game (LeetCode #55)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив неотрицательных чисел nums, где nums[i] — максимальная длина прыжка из позиции i. Определи, можно ли добраться до последнего индекса, начиная с первого.\n\nПример:\n  nums = [2,3,1,1,4] → true (0→1→4 или 0→2→3→4)\n  nums = [3,2,1,0,4] → false (застрянешь на индексе 3)',
      requirements: [
        'Метод boolean canJump(int[] nums)',
        'Жадный подход: отслеживай максимальную достижимую позицию',
        'Если текущая позиция > maxReach — недостижимо',
        'Альтернатива: DP, dp[i] = можно ли достичь позиции i'
      ],
      expectedOutput: 'Input: nums=[2,3,1,1,4]\nOutput: true\n\nInput: nums=[3,2,1,0,4]\nOutput: false',
      hint: 'Жадный: maxReach = 0. Для каждого i: если i > maxReach — return false. Иначе maxReach = max(maxReach, i + nums[i]). Если maxReach >= n-1 — return true.',
      solution: `class Solution {
    public boolean canJump(int[] nums) {
        int maxReach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > maxReach) return false;
            maxReach = Math.max(maxReach, i + nums[i]);
            if (maxReach >= nums.length - 1) return true;
        }
        return true;
    }
}`,
      explanation: 'Жадный алгоритм: отслеживаем максимальную достижимую позицию maxReach. Если текущий индекс i > maxReach — мы застряли. Иначе обновляем maxReach. Если maxReach >= n-1 — достигли конца. Время: O(n), память: O(1). Формально это DP с оптимизацией до жадного.'
    }
  ]
}
