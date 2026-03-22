export default {
  id: 59,
  title: 'Практикум: Задачи уровня Hard',
  description: 'Сложные задачи уровня Hard из технических интервью в ведущие компании: слияние K массивов, медиана двух массивов, ловля дождевой воды, скользящий максимум, DP и другие',
  lessons: [
    {
      id: 1,
      title: 'Задача: Merge K Sorted Arrays (Слияние K отсортированных массивов)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Даны K отсортированных массивов. Слей их в один отсортированный массив. Например: [[1,4,7],[2,5,8],[3,6,9]] → [1,2,3,4,5,6,7,8,9]. Используй приоритетную очередь для эффективного решения.',
      requirements: [
        'Метод mergeKArrays(int[][] arrays) возвращает int[]',
        'Использовать PriorityQueue (min-heap) для O(N log K) решения',
        'N — суммарное количество элементов, K — количество массивов',
        'Протестировать: [[1,4,7],[2,5,8],[3,6,9]]→[1,2,3,4,5,6,7,8,9]'
      ],
      expectedOutput: '[1, 2, 3, 4, 5, 6, 7, 8, 9]\n[1, 1, 2, 3, 4, 5, 6]',
      hint: 'PriorityQueue хранит тройку [значение, индекс_массива, индекс_элемента]. Изначально добавь первые элементы всех массивов. На каждом шаге извлекай минимум (poll), добавляй в результат, затем добавляй следующий элемент из того же массива.',
      solution: 'import java.util.PriorityQueue;\nimport java.util.Arrays;\n\npublic class MergeKArrays {\n\n    public static int[] mergeKArrays(int[][] arrays) {\n        // Подсчитываем суммарный размер\n        int totalSize = 0;\n        for (int[] arr : arrays) totalSize += arr.length;\n\n        int[] result = new int[totalSize];\n        int resultIdx = 0;\n\n        // PriorityQueue: [значение, индекс_массива, индекс_в_массиве]\n        // Сортируем по значению (элемент [0])\n        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n\n        // Добавляем первый элемент каждого непустого массива\n        for (int i = 0; i < arrays.length; i++) {\n            if (arrays[i].length > 0) {\n                pq.offer(new int[]{arrays[i][0], i, 0});\n            }\n        }\n\n        while (!pq.isEmpty()) {\n            int[] entry = pq.poll(); // извлекаем минимальный элемент\n            int val = entry[0];\n            int arrayIdx = entry[1];\n            int elemIdx = entry[2];\n\n            result[resultIdx++] = val;\n\n            // Если в том же массиве есть следующий элемент — добавляем его\n            if (elemIdx + 1 < arrays[arrayIdx].length) {\n                pq.offer(new int[]{arrays[arrayIdx][elemIdx + 1], arrayIdx, elemIdx + 1});\n            }\n        }\n\n        return result;\n    }\n\n    public static void main(String[] args) {\n        int[][] arrays1 = {{1,4,7},{2,5,8},{3,6,9}};\n        System.out.println(Arrays.toString(mergeKArrays(arrays1)));\n        // [1, 2, 3, 4, 5, 6, 7, 8, 9]\n\n        int[][] arrays2 = {{1,3,5},{2,4,6},{1}};\n        System.out.println(Arrays.toString(mergeKArrays(arrays2)));\n        // [1, 1, 2, 3, 4, 5, 6]\n    }\n}',
      explanation: 'Min-heap (PriorityQueue с минимальным приоритетом) — ключевая структура для этой задачи. Heap всегда даёт нам минимальный из текущих "кандидатов" (первых элементов каждого массива) за O(log K). Алгоритм: инициализируем heap первыми элементами всех K массивов. Повторяем N раз: извлекаем минимум из heap (это следующий элемент результата), добавляем следующий элемент из того же массива. Сложность: O(N log K) — каждый из N элементов один раз добавляется и извлекается из heap размера K. Намного лучше наивного O(N*K) или O(N log N) через слияние всего в один массив и сортировку.'
    },
    {
      id: 2,
      title: 'Задача: Median of Two Sorted Arrays (Медиана двух отсортированных массивов)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Даны два отсортированных массива nums1 и nums2. Найди медиану объединённого массива. Общая сложность должна быть O(log(m+n)). Медиана — средний элемент (если нечётное количество) или среднее двух средних (если чётное).',
      requirements: [
        'Метод findMedianSortedArrays(int[] nums1, int[] nums2) возвращает double',
        'Сложность O(log(m+n)) — бинарный поиск на меньшем массиве',
        'Обработать случаи чётного и нечётного суммарного размера',
        'Протестировать: [1,3]+[2]→2.0, [1,2]+[3,4]→2.5'
      ],
      expectedOutput: '2.0\n2.5',
      hint: 'Идея: найти разбиение обоих массивов (partition) такое, что левые половины содержат ровно (m+n)/2 наименьших элементов. Бинарный поиск по partition1 (меньший массив). Медиана = среднее между max(левых) и min(правых).',
      solution: 'public class MedianOfTwoSortedArrays {\n\n    public static double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Работаем на меньшем массиве для O(log(min(m,n)))\n        if (nums1.length > nums2.length) {\n            return findMedianSortedArrays(nums2, nums1);\n        }\n\n        int m = nums1.length;\n        int n = nums2.length;\n        int half = (m + n + 1) / 2; // размер левой половины\n\n        int lo = 0, hi = m;\n\n        while (lo <= hi) {\n            int p1 = (lo + hi) / 2;   // сколько элементов nums1 в левой половине\n            int p2 = half - p1;        // сколько элементов nums2 в левой половине\n\n            // Граничные значения (используем +/-infinity для краёв)\n            int maxLeft1  = (p1 == 0) ? Integer.MIN_VALUE : nums1[p1 - 1];\n            int minRight1 = (p1 == m) ? Integer.MAX_VALUE : nums1[p1];\n            int maxLeft2  = (p2 == 0) ? Integer.MIN_VALUE : nums2[p2 - 1];\n            int minRight2 = (p2 == n) ? Integer.MAX_VALUE : nums2[p2];\n\n            if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {\n                // Нашли правильное разбиение!\n                if ((m + n) % 2 == 1) {\n                    return Math.max(maxLeft1, maxLeft2); // нечётный — медиана = max левых\n                } else {\n                    return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2.0;\n                }\n            } else if (maxLeft1 > minRight2) {\n                hi = p1 - 1; // сдвигаем разбиение nums1 влево\n            } else {\n                lo = p1 + 1; // сдвигаем разбиение nums1 вправо\n            }\n        }\n\n        return 0.0; // не достижимо при корректных входных данных\n    }\n\n    public static void main(String[] args) {\n        System.out.println(findMedianSortedArrays(new int[]{1,3}, new int[]{2}));     // 2.0\n        System.out.println(findMedianSortedArrays(new int[]{1,2}, new int[]{3,4}));  // 2.5\n    }\n}',
      explanation: 'Медиана объединённого массива разделяет его на две равные половины. Идея: найти такое разбиение (p1, p2) двух массивов, что: 1) p1 + p2 = (m+n+1)/2 (размер левой половины), 2) max(leftHalf) <= min(rightHalf). Бинарный поиск по p1 на меньшем массиве. Условие правильного разбиения: maxLeft1 <= minRight2 и maxLeft2 <= minRight1. Если maxLeft1 > minRight2 — нужно меньше элементов из nums1 (hi = p1-1). Медиана при нечётном суммарном размере = max(maxLeft1, maxLeft2), при чётном = (max левых + min правых) / 2. Сложность O(log(min(m,n))).'
    },
    {
      id: 3,
      title: 'Задача: Trapping Rain Water (Ловля дождевой воды)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив height, где height[i] — высота блока в позиции i. Посчитай сколько единиц воды может задержаться после дождя. Вода держится между более высокими блоками. Например: [0,1,0,2,1,0,1,3,2,1,2,1] → 6.',
      requirements: [
        'Метод trap(int[] height) возвращает int',
        'Использовать метод двух указателей для O(n) времени и O(1) памяти',
        'Протестировать: [0,1,0,2,1,0,1,3,2,1,2,1]→6, [4,2,0,3,2,5]→9'
      ],
      expectedOutput: '6\n9',
      hint: 'Два указателя left и right. Поддерживай maxLeft (макс. высота слева) и maxRight (макс. высота справа). Если maxLeft < maxRight — вода в позиции left = maxLeft - height[left]. Двигай тот указатель, со стороны которого меньший максимум.',
      solution: 'public class TrappingRainWater {\n\n    public static int trap(int[] height) {\n        int left = 0;\n        int right = height.length - 1;\n        int maxLeft = 0;  // максимальная высота слева от left\n        int maxRight = 0; // максимальная высота справа от right\n        int water = 0;\n\n        while (left < right) {\n            if (height[left] < height[right]) {\n                // Обрабатываем левую сторону\n                if (height[left] >= maxLeft) {\n                    maxLeft = height[left]; // обновляем максимум слева\n                } else {\n                    // Воды здесь: maxLeft - текущая высота\n                    water += maxLeft - height[left];\n                }\n                left++;\n            } else {\n                // Обрабатываем правую сторону\n                if (height[right] >= maxRight) {\n                    maxRight = height[right]; // обновляем максимум справа\n                } else {\n                    water += maxRight - height[right];\n                }\n                right--;\n            }\n        }\n\n        return water;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1})); // 6\n        System.out.println(trap(new int[]{4,2,0,3,2,5}));              // 9\n    }\n}',
      explanation: 'Количество воды над позицией i = min(maxLeft[i], maxRight[i]) - height[i]. Наивное решение: два прохода для вычисления maxLeft[] и maxRight[], затем суммирование. O(n) памяти. Оптимизация двумя указателями: ключевое наблюдение — если maxLeft < maxRight, то min(maxLeft, maxRight) = maxLeft, и мы знаем сколько воды в позиции left без знания точного maxRight. Аналогично для правой стороны. Двигаем тот указатель, чья сторона "ниже". Это гарантирует, что мы всегда знаем "ограничивающую" сторону для текущей позиции. Сложность O(n) время, O(1) память.'
    },
    {
      id: 4,
      title: 'Задача: Sliding Window Maximum (Максимум скользящего окна)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив nums и число k. Двигай окно размера k по массиву слева направо. Для каждой позиции окна верни максимальный элемент. Вернуть массив из (n - k + 1) максимумов.',
      requirements: [
        'Метод maxSlidingWindow(int[] nums, int k) возвращает int[]',
        'Использовать Deque (двусторонняя очередь) для O(n) решения',
        'В Deque храним индексы (не значения)',
        'Протестировать: [1,3,-1,-3,5,3,6,7] k=3 → [3,3,5,5,6,7]'
      ],
      expectedOutput: '[3, 3, 5, 5, 6, 7]\n[3, 3, 2, 5]',
      hint: 'Deque хранит индексы кандидатов на максимум в убывающем порядке значений. При добавлении нового элемента: удаляй с конца Deque все индексы с меньшим значением. Удаляй с начала индексы вышедшие из окна. Начало Deque — всегда индекс максимума.',
      solution: 'import java.util.ArrayDeque;\nimport java.util.Arrays;\nimport java.util.Deque;\n\npublic class SlidingWindowMaximum {\n\n    public static int[] maxSlidingWindow(int[] nums, int k) {\n        int n = nums.length;\n        int[] result = new int[n - k + 1];\n        // Deque хранит ИНДЕКСЫ в порядке убывания значений\n        Deque<Integer> dq = new ArrayDeque<>();\n\n        for (int i = 0; i < n; i++) {\n            // Удаляем индексы вышедшие за левую границу окна\n            while (!dq.isEmpty() && dq.peekFirst() < i - k + 1) {\n                dq.pollFirst();\n            }\n\n            // Удаляем с конца все индексы с МЕНЬШИМ значением\n            // (они никогда не станут максимумом при наличии nums[i])\n            while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) {\n                dq.pollLast();\n            }\n\n            dq.offerLast(i); // добавляем текущий индекс\n\n            // Начинаем записывать результат только когда окно заполнено\n            if (i >= k - 1) {\n                result[i - k + 1] = nums[dq.peekFirst()]; // максимум = первый элемент\n            }\n        }\n\n        return result;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(maxSlidingWindow(new int[]{1,3,-1,-3,5,3,6,7}, 3)));\n        // [3, 3, 5, 5, 6, 7]\n\n        System.out.println(Arrays.toString(maxSlidingWindow(new int[]{1,3,1,2,0,5}, 3)));\n        // [3, 3, 2, 5]\n    }\n}',
      explanation: 'Монотонная убывающая дека — продвинутая структура данных для задач на скользящие окна. Инвариант: dq содержит индексы кандидатов на максимум в текущем и будущих окнах, в порядке убывания значений. При обработке нового элемента i: 1) удаляем устаревшие индексы спереди (вышли из окна); 2) удаляем с конца все индексы меньшего значения — если пришёл больший элемент, меньшие ему бесполезны (новый элемент живёт дольше них в окне и больше их). Начало деки — всегда индекс максимума текущего окна. Каждый индекс добавляется и удаляется не более одного раза → O(n).'
    },
    {
      id: 5,
      title: 'Задача: Longest Valid Parentheses (Наидлиннейшая правильная скобочная последовательность)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дана строка s из символов "(" и ")". Найди длину наидлиннейшей правильной (корректной) скобочной подстроки. Например: "(()" → 2, ")()())" → 4, "" → 0.',
      requirements: [
        'Метод longestValidParentheses(String s) возвращает int',
        'Использовать стек с индексами для O(n) решения',
        'В стек помещать ИНДЕКСЫ символов',
        'Протестировать: "(()"→2, ")()())"→4, ""→0, "()(())"→6'
      ],
      expectedOutput: '2\n4\n0\n6',
      hint: 'Стек хранит индексы. Изначально push(-1) как "базовый" индекс. При "(" — push индекс. При ")" — pop; если стек пуст — push текущий индекс (новая "база"). Иначе длина = i - top стека.',
      solution: 'import java.util.Deque;\nimport java.util.ArrayDeque;\n\npublic class LongestValidParentheses {\n\n    public static int longestValidParentheses(String s) {\n        Deque<Integer> stack = new ArrayDeque<>();\n        stack.push(-1); // базовый индекс\n        int maxLen = 0;\n\n        for (int i = 0; i < s.length(); i++) {\n            char c = s.charAt(i);\n\n            if (c == \'(\') {\n                stack.push(i); // запоминаем позицию открывающей\n            } else {\n                stack.pop(); // "закрываем" предыдущую открывающую\n\n                if (stack.isEmpty()) {\n                    // Нет пары для этой ")" — она становится новой базой\n                    stack.push(i);\n                } else {\n                    // Длина корректной подстроки = i - индекс_базы\n                    maxLen = Math.max(maxLen, i - stack.peek());\n                }\n            }\n        }\n\n        return maxLen;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(longestValidParentheses("(()"));    // 2\n        System.out.println(longestValidParentheses(")()())"));  // 4\n        System.out.println(longestValidParentheses(""));        // 0\n        System.out.println(longestValidParentheses("()(())"));  // 6\n    }\n}',
      explanation: 'Стек с индексами — изящное решение. Ключевая идея: держим в стеке "базу" — индекс последнего символа, который не может быть частью корректной подстроки. Изначально база = -1. При "(" — push индекс (потенциальная открывающая). При ")" — pop: если стек опустел, текущая ")" некоррекна → push i как новую базу; иначе длина корректной подстроки заканчивающейся в i это i - stack.peek() (peek — это база или незакрытая "("). Подстрока может быть конкатенацией нескольких правильных — алгоритм это учитывает, потому что база обновляется только при некорректных ")". O(n) время, O(n) память.'
    },
    {
      id: 6,
      title: 'Задача: Regular Expression Matching — упрощённая версия (Сопоставление с образцом)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй сопоставление строки s с паттерном p. Паттерн поддерживает: "." — любой одиночный символ, "*" — ноль или более предыдущих символов. Сопоставление должно покрывать всю строку (не только часть). Использовать динамическое программирование.',
      requirements: [
        'Метод isMatch(String s, String p) возвращает boolean',
        'dp[i][j] = true если s[0..i-1] совпадает с p[0..j-1]',
        'Обработать "x*" как ноль вхождений или одно и более',
        'Протестировать: "aa","a"→false; "aa","a*"→true; "ab",".*"→true; "aab","c*a*b"→true'
      ],
      expectedOutput: 'false\ntrue\ntrue\ntrue',
      hint: 'dp[i][j] = true если s[0..i-1] совпадает с p[0..j-1]. Базовый случай: dp[0][0] = true. Для p[j-1] == "*": либо пропускаем "x*" (dp[i][j-2]), либо берём один символ (dp[i-1][j] если символы совпадают). Для обычного символа или ".": dp[i][j] = dp[i-1][j-1] && совпадение символов.',
      solution: 'public class RegexMatching {\n\n    public static boolean isMatch(String s, String p) {\n        int m = s.length();\n        int n = p.length();\n\n        // dp[i][j] = true если s[0..i-1] совпадает с p[0..j-1]\n        boolean[][] dp = new boolean[m + 1][n + 1];\n        dp[0][0] = true; // пустая строка совпадает с пустым паттерном\n\n        // Инициализация: паттерны вида "a*b*c*" совпадают с пустой строкой\n        for (int j = 2; j <= n; j++) {\n            if (p.charAt(j - 1) == \'*\') {\n                dp[0][j] = dp[0][j - 2]; // "x*" = ноль вхождений\n            }\n        }\n\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                char sc = s.charAt(i - 1);\n                char pc = p.charAt(j - 1);\n\n                if (pc == \'*\') {\n                    // "x*" означает 0 вхождений: берём dp[i][j-2]\n                    dp[i][j] = dp[i][j - 2];\n\n                    // "x*" означает 1+ вхождений: предыдущий символ паттерна совпадает\n                    char prev = p.charAt(j - 2);\n                    if (prev == \'.\' || prev == sc) {\n                        dp[i][j] = dp[i][j] || dp[i - 1][j];\n                    }\n                } else if (pc == \'.\' || pc == sc) {\n                    // Текущие символы совпадают\n                    dp[i][j] = dp[i - 1][j - 1];\n                }\n                // Иначе dp[i][j] остаётся false\n            }\n        }\n\n        return dp[m][n];\n    }\n\n    public static void main(String[] args) {\n        System.out.println(isMatch("aa", "a"));     // false\n        System.out.println(isMatch("aa", "a*"));    // true\n        System.out.println(isMatch("ab", ".*"));    // true\n        System.out.println(isMatch("aab", "c*a*b")); // true\n    }\n}',
      explanation: 'Динамическое программирование на двух строках. dp[i][j] означает: можно ли сопоставить первые i символов строки s с первыми j символами паттерна p. Сложный случай — символ "*": он "склеен" с предыдущим символом паттерна p[j-2]. Вариант 1: "x*" = ноль вхождений — то же что dp[i][j-2] (игнорируем "x*"). Вариант 2: "x*" = одно или более вхождений — dp[i-1][j] если p[j-2] совпадает с текущим символом строки (dot или точное совпадение). Инициализация: dp[0][j] для паттернов типа "a*b*" — они совпадают с пустой строкой. Сложность O(m*n) время и память.'
    },
    {
      id: 7,
      title: 'Задача: Minimum Window Substring (Минимальное окно с подстрокой)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Даны строки s и t. Найди минимальную подстроку s, которая содержит все символы t (включая дубликаты). Если такой нет — вернуть пустую строку. Например: s="ADOBECODEBANC", t="ABC" → "BANC".',
      requirements: [
        'Метод minWindow(String s, String t) возвращает String',
        'Скользящее окно + частотные карты за O(n+m)',
        'Обработать дубликаты символов в t',
        'Протестировать: "ADOBECODEBANC","ABC"→"BANC", "a","a"→"a", "a","b"→""'
      ],
      expectedOutput: 'BANC\na\n',
      hint: 'HashMap need хранит нужные частоты символов t. Переменная formed — сколько уникальных символов t уже покрыты нужным количеством. Расширяй правый указатель пока formed < required. Затем сжимай левый, обновляя минимум. Повтори.',
      solution: 'import java.util.HashMap;\nimport java.util.Map;\n\npublic class MinimumWindowSubstring {\n\n    public static String minWindow(String s, String t) {\n        if (s.isEmpty() || t.isEmpty()) return "";\n\n        // Частота символов в t\n        Map<Character, Integer> need = new HashMap<>();\n        for (char c : t.toCharArray()) {\n            need.merge(c, 1, Integer::sum);\n        }\n\n        int required = need.size(); // сколько уникальных символов нужно покрыть\n        int formed = 0;             // сколько уже покрыто\n\n        Map<Character, Integer> window = new HashMap<>(); // частота в текущем окне\n\n        int left = 0;\n        int minLen = Integer.MAX_VALUE;\n        int minLeft = 0;\n\n        for (int right = 0; right < s.length(); right++) {\n            // Расширяем окно вправо\n            char c = s.charAt(right);\n            window.merge(c, 1, Integer::sum);\n\n            // Проверяем покрыт ли этот символ\n            if (need.containsKey(c) && window.get(c).intValue() == need.get(c).intValue()) {\n                formed++;\n            }\n\n            // Сжимаем окно слева пока все символы покрыты\n            while (formed == required) {\n                // Обновляем минимальное окно\n                if (right - left + 1 < minLen) {\n                    minLen = right - left + 1;\n                    minLeft = left;\n                }\n\n                // Убираем левый символ из окна\n                char leftChar = s.charAt(left);\n                window.merge(leftChar, -1, Integer::sum);\n                if (need.containsKey(leftChar) && window.get(leftChar) < need.get(leftChar)) {\n                    formed--;\n                }\n                left++;\n            }\n        }\n\n        return minLen == Integer.MAX_VALUE ? "" : s.substring(minLeft, minLeft + minLen);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(minWindow("ADOBECODEBANC", "ABC")); // BANC\n        System.out.println(minWindow("a", "a"));               // a\n        System.out.println(minWindow("a", "b"));               // (пусто)\n    }\n}',
      explanation: 'Скользящее окно с двумя HashMap — классический паттерн для задач на подстроки с ограничениями. need хранит нужные частоты, window — текущие частоты в окне. formed отслеживает сколько символов из t уже покрыты достаточным количеством (==). Когда formed == required — окно содержит все нужные символы, пытаемся сжать его слева. При сжатии: если убираем нужный символ и его стало меньше нужного — formed--. Цикл "расширить-сжать" гарантирует O(n+m): каждый символ добавляется и удаляется из окна ровно один раз. Сравнение через .intValue() необходимо для Integer (избегаем сравнения ссылок при значениях > 127).'
    },
    {
      id: 8,
      title: 'Задача: Serialize and Deserialize Binary Tree (Сериализация дерева)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй сериализацию двоичного дерева в строку и десериализацию обратно в дерево. Сериализация — обход в ширину (BFS), null узлы обозначаются "null". Пример: дерево [1,2,3,null,null,4,5] → строка "1,2,3,null,null,4,5".',
      requirements: [
        'Класс TreeNode с полями val, left, right',
        'Метод serialize(TreeNode root) возвращает String',
        'Метод deserialize(String data) возвращает TreeNode',
        'Использовать BFS (Queue) для обоих методов'
      ],
      expectedOutput: 'Сериализация: 1,2,3,null,null,4,5\nДесериализация и повторная сериализация: 1,2,3,null,null,4,5',
      hint: 'Serialize: BFS обход, добавляй значение узла или "null". Deserialize: разбей строку по ",", BFS восстановление — для каждого узла из очереди назначай следующие два значения как левого и правого потомка.',
      solution: 'import java.util.ArrayDeque;\nimport java.util.Queue;\n\npublic class SerializeDeserializeTree {\n\n    static class TreeNode {\n        int val;\n        TreeNode left, right;\n        TreeNode(int val) { this.val = val; }\n    }\n\n    // Сериализация: BFS обход\n    public static String serialize(TreeNode root) {\n        if (root == null) return "";\n\n        StringBuilder sb = new StringBuilder();\n        Queue<TreeNode> queue = new ArrayDeque<>();\n        queue.offer(root);\n\n        while (!queue.isEmpty()) {\n            TreeNode node = queue.poll();\n\n            if (sb.length() > 0) sb.append(",");\n\n            if (node == null) {\n                sb.append("null");\n            } else {\n                sb.append(node.val);\n                queue.offer(node.left);  // добавляем даже null-детей\n                queue.offer(node.right);\n            }\n        }\n\n        return sb.toString();\n    }\n\n    // Десериализация: восстановление из BFS-строки\n    public static TreeNode deserialize(String data) {\n        if (data == null || data.isEmpty()) return null;\n\n        String[] tokens = data.split(",");\n        TreeNode root = new TreeNode(Integer.parseInt(tokens[0]));\n        Queue<TreeNode> queue = new ArrayDeque<>();\n        queue.offer(root);\n\n        int i = 1; // индекс текущего токена\n\n        while (!queue.isEmpty() && i < tokens.length) {\n            TreeNode node = queue.poll();\n\n            // Левый потомок\n            if (i < tokens.length && !tokens[i].equals("null")) {\n                node.left = new TreeNode(Integer.parseInt(tokens[i]));\n                queue.offer(node.left);\n            }\n            i++;\n\n            // Правый потомок\n            if (i < tokens.length && !tokens[i].equals("null")) {\n                node.right = new TreeNode(Integer.parseInt(tokens[i]));\n                queue.offer(node.right);\n            }\n            i++;\n        }\n\n        return root;\n    }\n\n    public static void main(String[] args) {\n        // Строим дерево: 1 -> (2, 3), 3 -> (4, 5)\n        TreeNode root = new TreeNode(1);\n        root.left = new TreeNode(2);\n        root.right = new TreeNode(3);\n        root.right.left = new TreeNode(4);\n        root.right.right = new TreeNode(5);\n\n        String serialized = serialize(root);\n        System.out.println("Сериализация: " + serialized);\n        // 1,2,3,null,null,4,5\n\n        TreeNode restored = deserialize(serialized);\n        System.out.println("Десериализация и повторная сериализация: " + serialize(restored));\n        // 1,2,3,null,null,4,5\n    }\n}',
      explanation: 'BFS (обход в ширину) даёт компактное и однозначное представление дерева. При сериализации добавляем в очередь и null-узлы — это важно для правильного восстановления структуры. При десериализации: первый токен — корень. Для каждого узла из очереди следующие два токена — его левый и правый потомок. Если токен "null" — потомка нет (не добавляем в очередь). Если токен — число — создаём узел и добавляем в очередь для дальнейшей обработки. Алгоритм работает для любых бинарных деревьев. Сложность O(n) для обоих методов.'
    },
    {
      id: 9,
      title: 'Задача: Word Break (Разбиение слова — ДП)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дана строка s и список слов wordDict. Определи, можно ли разбить строку s на слова из словаря. Например: s="leetcode", wordDict=["leet","code"] → true (leet + code). s="applepenapple", ["apple","pen"] → true.',
      requirements: [
        'Метод wordBreak(String s, List<String> wordDict) возвращает boolean',
        'dp[i] = true если s[0..i-1] можно разбить на слова из словаря',
        'HashSet для O(1) проверки наличия слова',
        'Протестировать: "leetcode",["leet","code"]→true; "applepenapple",["apple","pen"]→true; "catsandog",["cats","dog","sand","and","cat"]→false'
      ],
      expectedOutput: 'true\ntrue\nfalse',
      hint: 'dp[0] = true (пустая строка). Для каждой позиции i проверяй все j < i: если dp[j] == true и s[j..i-1] есть в словаре — то dp[i] = true. HashSet для быстрой проверки слов.',
      solution: 'import java.util.HashSet;\nimport java.util.List;\nimport java.util.Set;\nimport java.util.Arrays;\n\npublic class WordBreak {\n\n    public static boolean wordBreak(String s, List<String> wordDict) {\n        Set<String> wordSet = new HashSet<>(wordDict); // для O(1) поиска\n        int n = s.length();\n\n        // dp[i] = true если s[0..i-1] можно разбить на слова из словаря\n        boolean[] dp = new boolean[n + 1];\n        dp[0] = true; // пустая строка всегда "разбиваема"\n\n        for (int i = 1; i <= n; i++) {\n            for (int j = 0; j < i; j++) {\n                // Если s[0..j-1] разбиваемо И s[j..i-1] есть в словаре\n                if (dp[j] && wordSet.contains(s.substring(j, i))) {\n                    dp[i] = true;\n                    break; // нашли способ — можно переходить к i+1\n                }\n            }\n        }\n\n        return dp[n];\n    }\n\n    public static void main(String[] args) {\n        System.out.println(wordBreak("leetcode", Arrays.asList("leet", "code")));                    // true\n        System.out.println(wordBreak("applepenapple", Arrays.asList("apple", "pen")));               // true\n        System.out.println(wordBreak("catsandog", Arrays.asList("cats","dog","sand","and","cat"))); // false\n    }\n}',
      explanation: 'Классическая задача на динамическое программирование. dp[i] отвечает на вопрос: "можно ли разбить строку s[0..i-1]?" Переход: dp[i] = true если существует j (0 <= j < i) такое что dp[j] = true и s[j..i-1] есть в словаре. Базовый случай dp[0] = true (пустую строку считаем разбиваемой — это позволяет строить решение с начала). HashSet для словаря даёт O(1) поиск вместо O(n). Итоговая сложность O(n² * L), где L — средняя длина слова (из-за substring). Оптимизация: можно ограничить длину проверяемых подстрок максимальной длиной слова в словаре.'
    },
    {
      id: 10,
      title: 'Задача: Largest Rectangle in Histogram (Наибольший прямоугольник в гистограмме)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив heights, где heights[i] — высота i-го столбца гистограммы шириной 1. Найди площадь наибольшего прямоугольника в гистограмме. Например: [2,1,5,6,2,3] → 10 (прямоугольник высотой 5, шириной 2 из столбцов 2 и 3).',
      requirements: [
        'Метод largestRectangleArea(int[] heights) возвращает int',
        'Использовать стек для O(n) решения',
        'Стек хранит индексы столбцов в порядке возрастания высот',
        'Протестировать: [2,1,5,6,2,3]→10, [2,4]→4'
      ],
      expectedOutput: '10\n4',
      hint: 'Стек хранит индексы в порядке возрастания высот. Когда встречаем столбец ниже вершины стека — значит нашли правую границу прямоугольника. Извлекаем из стека, высота = heights[поп], ширина = i - stack.peek() - 1. Добавь sentinel-значение 0 в конец.',
      solution: 'import java.util.ArrayDeque;\nimport java.util.Deque;\n\npublic class LargestRectangleHistogram {\n\n    public static int largestRectangleArea(int[] heights) {\n        // Добавляем 0 в конец как "sentinel" для обработки оставшихся в стеке\n        int n = heights.length;\n        int[] h = new int[n + 1];\n        System.arraycopy(heights, 0, h, 0, n);\n        h[n] = 0; // sentinel\n\n        Deque<Integer> stack = new ArrayDeque<>(); // хранит индексы\n        stack.push(-1); // базовый индекс\n        int maxArea = 0;\n\n        for (int i = 0; i <= n; i++) {\n            // Пока текущий столбец ниже вершины стека\n            while (stack.peek() != -1 && h[stack.peek()] > h[i]) {\n                int height = h[stack.pop()]; // высота прямоугольника\n                int width = i - stack.peek() - 1; // ширина: от stack.peek()+1 до i-1\n                maxArea = Math.max(maxArea, height * width);\n            }\n            stack.push(i);\n        }\n\n        return maxArea;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(largestRectangleArea(new int[]{2,1,5,6,2,3})); // 10\n        System.out.println(largestRectangleArea(new int[]{2,4}));          // 4\n    }\n}',
      explanation: 'Монотонный возрастающий стек — ключ к O(n) решению. Стек хранит индексы столбцов с возрастающими высотами. Когда встречаем столбец с высотой меньше вершины стека — это правая граница прямоугольника с высотой вершины. Высота = heights[pop()], ширина = i - new_top - 1 (от позиции после новой вершины до текущей-1). Базовый индекс -1 в стеке позволяет правильно считать ширину когда стек содержит один элемент. Sentinel 0 в конце принудительно обрабатывает все оставшиеся в стеке элементы. Для [2,1,5,6,2,3]: максимальный прямоугольник — высота 5, ширина 2 (столбцы 2 и 3), площадь 10.'
    }
  ]
}
