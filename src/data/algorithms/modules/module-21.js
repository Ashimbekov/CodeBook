export default {
  id: 21,
  title: 'ДП: задачи на одномерный массив',
  description: 'Динамическое программирование на одномерных массивах: алгоритм Кадане, наибольшая возрастающая подпоследовательность, задача о грабителе и другие классические задачи',
  lessons: [
    {
      id: 1,
      title: 'Алгоритм Кадане: максимальная подпоследовательность',
      type: 'theory',
      content: [
        { type: 'text', value: 'Задача "Максимальная сумма подмассива" — одна из самых известных в динамическом программировании. Дан массив чисел (среди которых могут быть отрицательные). Нужно найти подмассив (непрерывный участок) с максимальной суммой.' },
        { type: 'tip', value: 'Представь, что ты идёшь по улице и собираешь монеты, но иногда попадаются "ямы" (отрицательные числа), которые забирают монеты. Ты хочешь выбрать самый выгодный отрезок пути. Алгоритм Кадане помогает найти этот отрезок!' },
        { type: 'heading', value: 'Идея алгоритма Кадане' },
        { type: 'text', value: 'Для каждой позиции i задаём вопрос: "Если подмассив заканчивается здесь — какая максимальная сумма?" Ответ: либо взять только текущий элемент, либо продолжить предыдущий подмассив. dp[i] = max(nums[i], dp[i-1] + nums[i]).' },
        { type: 'code', language: 'java', value: 'public class MaxSubarray {\n    // Алгоритм Кадане\n    public static int maxSubarray(int[] nums) {\n        int currentSum = nums[0]; // Сумма подмассива, заканчивающегося здесь\n        int maxSum = nums[0];     // Глобальный максимум\n\n        for (int i = 1; i < nums.length; i++) {\n            // Начать новый подмассив ИЛИ продолжить старый?\n            currentSum = Math.max(nums[i], currentSum + nums[i]);\n            maxSum = Math.max(maxSum, currentSum);\n        }\n        return maxSum;\n    }\n\n    public static void main(String[] args) {\n        int[] nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};\n        System.out.println("Максимальная сумма: " + maxSubarray(nums)); // 6\n        // Подмассив [4, -1, 2, 1] = 6\n    }\n}' },
        { type: 'heading', value: 'Трассировка алгоритма шаг за шагом' },
        { type: 'code', language: 'java', value: '// Массив: [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n// Индекс:    0  1   2  3   4  5  6   7  8\n//\n// i=0: currentSum = -2,  maxSum = -2\n// i=1: currentSum = max(1, -2+1)   = max(1,-1)  = 1,  maxSum = 1\n// i=2: currentSum = max(-3, 1+(-3))= max(-3,-2) = -2, maxSum = 1\n// i=3: currentSum = max(4, -2+4)   = max(4,2)   = 4,  maxSum = 4\n// i=4: currentSum = max(-1, 4+(-1))= max(-1,3)  = 3,  maxSum = 4\n// i=5: currentSum = max(2, 3+2)    = max(2,5)   = 5,  maxSum = 5\n// i=6: currentSum = max(1, 5+1)    = max(1,6)   = 6,  maxSum = 6\n// i=7: currentSum = max(-5, 6+(-5))= max(-5,1)  = 1,  maxSum = 6\n// i=8: currentSum = max(4, 1+4)    = max(4,5)   = 5,  maxSum = 6\n//\n// Ответ: 6 (подмассив [4,-1,2,1])' },
        { type: 'heading', value: 'Расширение: найти сам подмассив' },
        { type: 'code', language: 'java', value: 'public static int[] maxSubarrayWithBounds(int[] nums) {\n    int currentSum = nums[0], maxSum = nums[0];\n    int start = 0, end = 0, tempStart = 0;\n\n    for (int i = 1; i < nums.length; i++) {\n        if (nums[i] > currentSum + nums[i]) {\n            currentSum = nums[i];\n            tempStart = i; // Начинаем новый подмассив\n        } else {\n            currentSum = currentSum + nums[i];\n        }\n        if (currentSum > maxSum) {\n            maxSum = currentSum;\n            start = tempStart;\n            end = i;\n        }\n    }\n    System.out.println("Подмассив с индекса " + start + " до " + end);\n    System.out.println("Максимальная сумма: " + maxSum);\n    return new int[]{start, end};\n}\n// Для [-2,1,-3,4,-1,2,1,-5,4]:\n// Подмассив с индекса 3 до 6\n// Максимальная сумма: 6' },
        { type: 'note', value: 'Сложность алгоритма Кадане: время O(n), память O(1). Это оптимальное решение — лучше не бывает, ведь нужно хотя бы раз просмотреть все элементы.' }
      ]
    },
    {
      id: 2,
      title: 'Наибольшая возрастающая подпоследовательность (НВП)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Задача НВП (Longest Increasing Subsequence, LIS): найти наибольшую подпоследовательность, в которой каждый следующий элемент строго больше предыдущего. Элементы подпоследовательности не обязаны идти подряд.' },
        { type: 'tip', value: 'Представь, что ты прыгаешь по камням в реке. Камни расположены в ряд, и ты можешь прыгать только вперёд, только на более высокие камни. Сколько максимально камней ты можешь посетить? Это и есть НВП!' },
        { type: 'heading', value: 'ДП-решение за O(n²)' },
        { type: 'code', language: 'java', value: 'public class LIS {\n    public static int lengthOfLIS(int[] nums) {\n        int n = nums.length;\n        int[] dp = new int[n]; // dp[i] = длина НВП, заканчивающейся в nums[i]\n        \n        // Каждый элемент сам по себе — подпоследовательность длины 1\n        for (int i = 0; i < n; i++) dp[i] = 1;\n\n        int maxLen = 1;\n        for (int i = 1; i < n; i++) {\n            for (int j = 0; j < i; j++) {\n                // Если nums[j] < nums[i], можем добавить nums[i] после nums[j]\n                if (nums[j] < nums[i]) {\n                    dp[i] = Math.max(dp[i], dp[j] + 1);\n                }\n            }\n            maxLen = Math.max(maxLen, dp[i]);\n        }\n        return maxLen;\n    }\n\n    public static void main(String[] args) {\n        int[] nums = {10, 9, 2, 5, 3, 7, 101, 18};\n        System.out.println("Длина НВП: " + lengthOfLIS(nums)); // 4\n        // НВП: [2, 3, 7, 18] или [2, 5, 7, 18] или [2, 5, 7, 101]\n    }\n}' },
        { type: 'heading', value: 'Трассировка ДП-таблицы' },
        { type: 'code', language: 'java', value: '// Массив: [10, 9, 2, 5, 3, 7, 101, 18]\n// Индекс:    0  1  2  3  4  5   6    7\n//\n// dp[0]=1: [10] - только сам\n// dp[1]=1: [9] - 9 < 10, не добавляем\n// dp[2]=1: [2] - 2 < 9 и 2 < 10, не добавляем\n// dp[3]=2: [2,5] - 5 > 2 (dp[2]+1=2), 5 < 9 и 5 < 10\n// dp[4]=2: [2,3] - 3 > 2 (dp[2]+1=2), 3 < 5 нет\n// dp[5]=3: [2,5,7] или [2,3,7] - 7>10? нет, 7>9? нет, 7>2(dp[2]+1=2), 7>5(dp[3]+1=3), 7>3(dp[4]+1=3)\n// dp[6]=4: 101>все, max(dp[j]+1) = dp[5]+1=4\n// dp[7]=4: 18>10? нет, 18>9? нет, 18>2(2), 18>5(3), 18>3(3), 18>7(4), 18<101\n//\n// dp = [1, 1, 1, 2, 2, 3, 4, 4]\n// Ответ: 4' },
        { type: 'note', value: 'Сложность O(n²) по времени, O(n) по памяти. Существует решение за O(n log n) с бинарным поиском, но O(n²) проще понять и достаточно для большинства задач на интервью.' }
      ]
    },
    {
      id: 3,
      title: 'Задача о грабителе (House Robber)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Задача: есть ряд домов, в каждом доме — определённая сумма денег. Грабитель не может ограбить два соседних дома (сработает сигнализация). Нужно найти максимальную сумму, которую можно украсть.' },
        { type: 'tip', value: 'Представь, что ты ребёнок и на улице стоят автоматы с конфетами. Можно взять конфеты из каждого второго автомата (иначе охранник заметит). Какие автоматы выбрать, чтобы получить больше всего конфет? Это задача о грабителе!' },
        { type: 'heading', value: 'Формула ДП' },
        { type: 'text', value: 'dp[i] = максимальная сумма с первых i домов. Для каждого дома два варианта: ограбить его (тогда не трогаем предыдущий: dp[i-2] + nums[i]) или пропустить (берём dp[i-1]).' },
        { type: 'code', language: 'java', value: 'public class HouseRobber {\n    public static int rob(int[] nums) {\n        int n = nums.length;\n        if (n == 1) return nums[0];\n        if (n == 2) return Math.max(nums[0], nums[1]);\n\n        int[] dp = new int[n];\n        dp[0] = nums[0];\n        dp[1] = Math.max(nums[0], nums[1]);\n\n        for (int i = 2; i < n; i++) {\n            // Пропустить i-й дом ИЛИ ограбить i-й дом\n            dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);\n        }\n        return dp[n-1];\n    }\n\n    public static void main(String[] args) {\n        int[] houses = {2, 7, 9, 3, 1};\n        System.out.println("Максимальная добыча: " + rob(houses)); // 12\n        // Грабим дома 0, 2, 4: 2 + 9 + 1 = 12\n    }\n}' },
        { type: 'heading', value: 'Трассировка ДП-таблицы' },
        { type: 'code', language: 'java', value: '// Дома:  [2, 7, 9, 3, 1]\n// Индекс:  0  1  2  3  4\n//\n// dp[0] = 2               (берём дом 0)\n// dp[1] = max(2, 7) = 7   (берём дом 1, он выгоднее)\n// dp[2] = max(dp[1], dp[0]+9) = max(7, 2+9) = max(7,11) = 11\n//         (пропустить дом2 и взять 7, или взять дома 0+2: 2+9=11)\n// dp[3] = max(dp[2], dp[1]+3) = max(11, 7+3) = max(11,10) = 11\n//         (пропустить дом3 и взять 11, или взять 1+3: 7+3=10)\n// dp[4] = max(dp[3], dp[2]+1) = max(11, 11+1) = max(11,12) = 12\n//         (пропустить дом4 и взять 11, или взять 0+2+4: 11+1=12)\n//\n// dp = [2, 7, 11, 11, 12]\n// Ответ: 12 (дома с индексами 0, 2, 4: 2+9+1=12)' },
        { type: 'heading', value: 'Оптимизация по памяти: O(1)' },
        { type: 'code', language: 'java', value: 'public static int robOptimized(int[] nums) {\n    // Нам нужны только два предыдущих значения!\n    int prev2 = 0; // dp[i-2]\n    int prev1 = 0; // dp[i-1]\n\n    for (int num : nums) {\n        int current = Math.max(prev1, prev2 + num);\n        prev2 = prev1;\n        prev1 = current;\n    }\n    return prev1;\n}\n// Время O(n), память O(1) — элегантное решение!' },
        { type: 'note', value: 'Задача о грабителе — классический пример, где ДП сводится к двум переменным. Запоминай: если dp[i] зависит только от dp[i-1] и dp[i-2], можно обойтись без массива.' }
      ]
    },
    {
      id: 4,
      title: 'Игра в прыжки (Jump Game)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Задача Jump Game: дан массив, где nums[i] — максимальная длина прыжка с позиции i. Начинаем с позиции 0. Можно ли добраться до последней позиции?' },
        { type: 'tip', value: 'Представь, что ты стоишь на первой кочке болота. На каждой кочке написано, как далеко максимально ты можешь прыгнуть. Задача: добраться до берега (последней кочки). Иногда кочки "мёртвые" — с них нельзя прыгнуть (0).' },
        { type: 'heading', value: 'Жадный подход (оптимальный)' },
        { type: 'code', language: 'java', value: 'public class JumpGame {\n    // Жадный алгоритм: отслеживаем максимальную достижимую позицию\n    public static boolean canJump(int[] nums) {\n        int maxReach = 0; // Максимально куда можем прыгнуть\n\n        for (int i = 0; i < nums.length; i++) {\n            if (i > maxReach) return false; // Застряли!\n            maxReach = Math.max(maxReach, i + nums[i]);\n        }\n        return true;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(canJump(new int[]{2, 3, 1, 1, 4})); // true\n        System.out.println(canJump(new int[]{3, 2, 1, 0, 4})); // false\n    }\n}' },
        { type: 'heading', value: 'Трассировка: можно добраться' },
        { type: 'code', language: 'java', value: '// nums = [2, 3, 1, 1, 4]\n// Индекс: 0  1  2  3  4\n//\n// i=0: 0 <= maxReach(0), maxReach = max(0, 0+2) = 2\n// i=1: 1 <= maxReach(2), maxReach = max(2, 1+3) = 4\n// i=2: 2 <= maxReach(4), maxReach = max(4, 2+1) = 4\n// i=3: 3 <= maxReach(4), maxReach = max(4, 3+1) = 4\n// i=4: 4 <= maxReach(4), maxReach = max(4, 4+4) = 8\n// Дошли до конца! Возвращаем true' },
        { type: 'heading', value: 'Трассировка: нельзя добраться' },
        { type: 'code', language: 'java', value: '// nums = [3, 2, 1, 0, 4]\n// Индекс: 0  1  2  3  4\n//\n// i=0: 0 <= maxReach(0), maxReach = max(0, 0+3) = 3\n// i=1: 1 <= maxReach(3), maxReach = max(3, 1+2) = 3\n// i=2: 2 <= maxReach(3), maxReach = max(3, 2+1) = 3\n// i=3: 3 <= maxReach(3), maxReach = max(3, 3+0) = 3\n// i=4: 4 > maxReach(3) — ЗАСТРЯЛИ! Возвращаем false\n//\n// Позиция 3 имеет значение 0 — тупик!' },
        { type: 'heading', value: 'ДП-решение для подсчёта минимальных прыжков' },
        { type: 'code', language: 'java', value: '// Jump Game II: минимальное количество прыжков\npublic static int jump(int[] nums) {\n    int jumps = 0;\n    int currentEnd = 0; // Конец текущего "уровня" прыжков\n    int farthest = 0;   // Максимально достижимая позиция\n\n    for (int i = 0; i < nums.length - 1; i++) {\n        farthest = Math.max(farthest, i + nums[i]);\n        if (i == currentEnd) { // Достигли конца уровня\n            jumps++;           // Делаем прыжок\n            currentEnd = farthest; // Переходим к следующему уровню\n        }\n    }\n    return jumps;\n}\n// [2,3,1,1,4] -> 2 прыжка (0->1->4)' },
        { type: 'note', value: 'Время O(n), память O(1). Jump Game — пример задачи, где жадный алгоритм даёт оптимальное решение. Мы всегда расширяем горизонт насколько возможно.' }
      ]
    },
    {
      id: 5,
      title: 'Расшифровка путей (Decode Ways)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Задача Decode Ways: строка цифр закодирована так, что A=1, B=2, ..., Z=26. Сколькими способами можно расшифровать данную строку? Например, "226" можно расшифровать как: BBF(2,2,6), BZ(2,26), VF(22,6) — 3 способа.' },
        { type: 'tip', value: 'Представь шифровальную машину. Буквы А-Z заменены числами 1-26. Тебе дают число "1226". Ты можешь читать по одной цифре (1,2,2,6) или парами (12,26), или смешивать. Сколько вариантов прочтения? Это задача о расшифровке!' },
        { type: 'heading', value: 'ДП-решение' },
        { type: 'code', language: 'java', value: 'public class DecodeWays {\n    public static int numDecodings(String s) {\n        int n = s.length();\n        if (n == 0 || s.charAt(0) == \'0\') return 0;\n\n        int[] dp = new int[n + 1];\n        dp[0] = 1; // Пустая строка — 1 способ\n        dp[1] = 1; // Одна цифра (не 0) — 1 способ\n\n        for (int i = 2; i <= n; i++) {\n            // Однозначное число: цифра от 1 до 9\n            int oneDigit = Integer.parseInt(s.substring(i-1, i));\n            if (oneDigit >= 1) {\n                dp[i] += dp[i-1];\n            }\n\n            // Двузначное число: от 10 до 26\n            int twoDigit = Integer.parseInt(s.substring(i-2, i));\n            if (twoDigit >= 10 && twoDigit <= 26) {\n                dp[i] += dp[i-2];\n            }\n        }\n        return dp[n];\n    }\n\n    public static void main(String[] args) {\n        System.out.println(numDecodings("226"));  // 3\n        System.out.println(numDecodings("12"));   // 2 (AB или L)\n        System.out.println(numDecodings("06"));   // 0 (нет буквы "06")\n    }\n}' },
        { type: 'heading', value: 'Трассировка для "226"' },
        { type: 'code', language: 'java', value: '// s = "226", n = 3\n// dp[0] = 1 (пустая строка)\n// dp[1] = 1 (\'2\' — это B)\n//\n// i=2:\n//   oneDigit  = "2" = 2,  >= 1 -> dp[2] += dp[1] = 1\n//   twoDigit  = "22" = 22, 10..26 -> dp[2] += dp[0] = 1\n//   dp[2] = 2  (AB или V)\n//\n// i=3:\n//   oneDigit  = "6" = 6,  >= 1 -> dp[3] += dp[2] = 2\n//   twoDigit  = "26" = 26, 10..26 -> dp[3] += dp[1] = 1\n//   dp[3] = 3\n//\n// dp = [1, 1, 2, 3]\n// Ответ: 3 способа (BBF, BZ, VF)' },
        { type: 'note', value: 'Эта задача учит работать с "окном" в 1 и 2 символа. Ключевой момент: проверяем корректность однозначного (1-9) и двузначного (10-26) числа. Время O(n), память O(n), или O(1) если хранить только два предыдущих значения.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Максимальная сумма подмассива (Кадане)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй алгоритм Кадане для нахождения максимальной суммы подмассива с трассировкой.',
      requirements: [
        'Метод maxSubarray(int[] nums): возвращает максимальную сумму',
        'Метод maxSubarrayWithBounds(int[] nums): возвращает [start, end, maxSum]',
        'Обработать случай массива из одного элемента',
        'Вывести пошаговую трассировку (currentSum и maxSum на каждом шаге)',
        'Протестировать на массивах: [-2,1,-3,4,-1,2,1,-5,4] и [-1,-2,-3]'
      ],
      expectedOutput: 'Шаг 0: num=-2, currentSum=-2, maxSum=-2\nШаг 1: num=1, currentSum=1, maxSum=1\nШаг 2: num=-3, currentSum=-2, maxSum=1\nШаг 3: num=4, currentSum=4, maxSum=4\nШаг 4: num=-1, currentSum=3, maxSum=4\nШаг 5: num=2, currentSum=5, maxSum=5\nШаг 6: num=1, currentSum=6, maxSum=6\nШаг 7: num=-5, currentSum=1, maxSum=6\nШаг 8: num=4, currentSum=5, maxSum=6\nРезультат: 6 (индексы 3..6)\nВсе отрицательные [-1,-2,-3]: -1',
      hint: 'Для отрицательных массивов алгоритм всё равно работает корректно — maxSum инициализируется первым элементом. Для поиска границ храни tempStart, обновляй start и end при обновлении maxSum.',
      solution: 'public class KadaneAlgorithm {\n    public static int maxSubarray(int[] nums) {\n        int currentSum = nums[0];\n        int maxSum = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            System.out.printf("Шаг %d: num=%d, ", i, nums[i]);\n            currentSum = Math.max(nums[i], currentSum + nums[i]);\n            maxSum = Math.max(maxSum, currentSum);\n            System.out.printf("currentSum=%d, maxSum=%d%n", currentSum, maxSum);\n        }\n        return maxSum;\n    }\n\n    public static int[] maxSubarrayWithBounds(int[] nums) {\n        int currentSum = nums[0], maxSum = nums[0];\n        int start = 0, end = 0, tempStart = 0;\n        System.out.printf("Шаг 0: num=%d, currentSum=%d, maxSum=%d%n", nums[0], currentSum, maxSum);\n        for (int i = 1; i < nums.length; i++) {\n            if (nums[i] > currentSum + nums[i]) {\n                currentSum = nums[i];\n                tempStart = i;\n            } else {\n                currentSum += nums[i];\n            }\n            if (currentSum > maxSum) {\n                maxSum = currentSum;\n                start = tempStart;\n                end = i;\n            }\n            System.out.printf("Шаг %d: num=%d, currentSum=%d, maxSum=%d%n", i, nums[i], currentSum, maxSum);\n        }\n        return new int[]{start, end, maxSum};\n    }\n\n    public static void main(String[] args) {\n        int[] nums1 = {-2, 1, -3, 4, -1, 2, 1, -5, 4};\n        int[] result = maxSubarrayWithBounds(nums1);\n        System.out.println("Результат: " + result[2] + " (индексы " + result[0] + ".." + result[1] + ")");\n\n        int[] nums2 = {-1, -2, -3};\n        System.out.println("Все отрицательные [-1,-2,-3]: " + maxSubarray(nums2));\n    }\n}',
      explanation: 'Алгоритм Кадане элегантен: в каждой точке мы делаем жадный выбор — продолжить подмассив или начать новый. Это и есть ДП: каждое состояние (currentSum) оптимально для своей позиции. Глобальный оптимум (maxSum) отслеживается параллельно.'
    },
    {
      id: 7,
      title: 'Практика: Задача о грабителе + Jump Game',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй задачу о грабителе с трассировкой ДП-таблицы и проверку достижимости в Jump Game.',
      requirements: [
        'Метод rob(int[] nums): возвращает максимальную сумму, печатает ДП-таблицу',
        'Метод robOptimized(int[] nums): версия с O(1) памятью',
        'Метод canJump(int[] nums): возвращает true/false, печатает maxReach на каждом шаге',
        'Метод minJumps(int[] nums): минимальное количество прыжков',
        'Тест: houses=[2,7,9,3,1], jumps1=[2,3,1,1,4], jumps2=[3,2,1,0,4]'
      ],
      expectedOutput: 'ДП-таблица: [2, 7, 11, 11, 12]\nМакс добыча: 12\nОптимизированный: 12\n[2,3,1,1,4]: можно добраться = true, мин прыжков = 2\n[3,2,1,0,4]: можно добраться = false',
      hint: 'В rob() для базовых случаев: dp[0]=nums[0], dp[1]=max(nums[0],nums[1]). В canJump если i > maxReach — сразу false. Для minJumps считай "уровни BFS": когда i==currentEnd, делаем прыжок.',
      solution: 'public class DPProblems {\n    public static int rob(int[] nums) {\n        int n = nums.length;\n        if (n == 1) return nums[0];\n        int[] dp = new int[n];\n        dp[0] = nums[0];\n        dp[1] = Math.max(nums[0], nums[1]);\n        for (int i = 2; i < n; i++) {\n            dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);\n        }\n        System.out.print("ДП-таблица: [");\n        for (int i = 0; i < n; i++) System.out.print(dp[i] + (i<n-1?", ":""));\n        System.out.println("]");\n        return dp[n-1];\n    }\n\n    public static int robOptimized(int[] nums) {\n        int prev2 = 0, prev1 = 0;\n        for (int num : nums) {\n            int cur = Math.max(prev1, prev2 + num);\n            prev2 = prev1;\n            prev1 = cur;\n        }\n        return prev1;\n    }\n\n    public static boolean canJump(int[] nums) {\n        int maxReach = 0;\n        for (int i = 0; i < nums.length; i++) {\n            if (i > maxReach) return false;\n            maxReach = Math.max(maxReach, i + nums[i]);\n        }\n        return true;\n    }\n\n    public static int minJumps(int[] nums) {\n        int jumps = 0, currentEnd = 0, farthest = 0;\n        for (int i = 0; i < nums.length - 1; i++) {\n            farthest = Math.max(farthest, i + nums[i]);\n            if (i == currentEnd) { jumps++; currentEnd = farthest; }\n        }\n        return jumps;\n    }\n\n    public static void main(String[] args) {\n        int[] houses = {2, 7, 9, 3, 1};\n        System.out.println("Макс добыча: " + rob(houses));\n        System.out.println("Оптимизированный: " + robOptimized(houses));\n\n        int[] j1 = {2, 3, 1, 1, 4};\n        int[] j2 = {3, 2, 1, 0, 4};\n        System.out.println("[2,3,1,1,4]: можно добраться = " + canJump(j1) + ", мин прыжков = " + minJumps(j1));\n        System.out.println("[3,2,1,0,4]: можно добраться = " + canJump(j2));\n    }\n}',
      explanation: 'Задача о грабителе демонстрирует классическое ДП: несовместимые выборы. Каждый dp[i] — лучший результат "не трогая дом i или соседа i-1". Jump Game показывает как жадность + ДП работают вместе: maxReach — это скользящий оптимум достижимости.'
    }
  ]
}
