export default {
  id: 20,
  title: 'Динамическое программирование: основы',
  description: 'ДП — разбиение большой задачи на маленькие, мемоизация и табуляция, числа Фибоначчи, задача о ступеньках, задача о монетах',
  lessons: [
    {
      id: 1,
      title: 'Что такое динамическое программирование?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Динамическое программирование (ДП) — это метод решения задач путём разбиения их на перекрывающиеся подзадачи, решения каждой подзадачи ровно один раз и сохранения результатов для повторного использования.' },
        { type: 'tip', value: 'Представь, что тебя спросили: "Сколько будет 357 + 248 + 357?". Умный человек заметит, что 357 встречается дважды и посчитает его один раз, запомнив ответ. Глупый посчитает 357 дважды. ДП — это умный подход: решаем каждую подзадачу ровно один раз и помним ответ!' },
        { type: 'heading', value: 'Три признака ДП-задачи' },
        { type: 'list', items: [
          '1. Оптимальная подструктура: оптимальное решение большой задачи строится из оптимальных решений подзадач',
          '2. Перекрывающиеся подзадачи: одни и те же подзадачи решаются многократно (иначе достаточно "разделяй и властвуй")',
          '3. Можно сформулировать рекуррентное соотношение: f(n) выражается через f(n-1), f(n-2), ...'
        ]},
        { type: 'heading', value: 'Классические ДП-задачи' },
        { type: 'code', language: 'java', value: '// Числа Фибоначчи: fib(n) = fib(n-1) + fib(n-2)\n// Задача о ступеньках: stairs(n) = stairs(n-1) + stairs(n-2)\n// Задача о рюкзаке: knapsack(w) = max(knapsack(w-wi) + vi)\n// Наибольшая общая подпоследовательность (LCS)\n// Наибольшая возрастающая подпоследовательность (LIS)\n// Задача о монетах: coins(amount) = 1 + coins(amount - coin)' },
        { type: 'note', value: 'Слово "динамическое" в названии не связано с динамическими структурами данных. Ричард Беллман выбрал это слово в 1950-х, чтобы "впечатлить" комитет финансирования — звучит научно!' }
      ]
    },
    {
      id: 2,
      title: 'Проблема рекурсии: повторные вычисления',
      type: 'theory',
      content: [
        { type: 'text', value: 'Наивная рекурсия для ДП-задач работает ужасно медленно из-за повторных вычислений одних и тех же подзадач. Посмотрим на примере Фибоначчи.' },
        { type: 'heading', value: 'Дерево вызовов для fib(5)' },
        { type: 'code', language: 'java', value: '// Наивная рекурсия:\nstatic long fib(int n) {\n    if (n <= 1) return n;\n    return fib(n-1) + fib(n-2);\n}\n\n// Дерево вызовов fib(5):\n//                  fib(5)\n//                /        \\\n//           fib(4)        fib(3)\n//          /      \\      /     \\\n//       fib(3)  fib(2) fib(2) fib(1)\n//       /    \\  /   \\  /   \\\n//    fib(2) fib(1)...fib(1) fib(0)\n//    /   \\\n// fib(1) fib(0)\n//\n// fib(3) вычисляется 2 раза!\n// fib(2) вычисляется 3 раза!\n// fib(1) вычисляется 5 раз!\n//\n// fib(40) -> ~2 млрд вызовов! Несколько МИНУТ!' },
        { type: 'heading', value: 'Сколько вызовов без и с ДП?' },
        { type: 'code', language: 'java', value: '// Без ДП (наивная рекурсия):\n// fib(10)  -> 177 вызовов\n// fib(20)  -> 21891 вызовов\n// fib(30)  -> 2692537 вызовов\n// fib(40)  -> 331160281 вызовов\n// fib(50)  -> ОЧЕНЬ долго (не дождёшься!)\n//\n// С ДП (мемоизация):\n// fib(10)  -> 19 вызовов\n// fib(20)  -> 39 вызовов\n// fib(100) -> 199 вызовов\n// fib(n)   -> O(n) вызовов ВСЕГДА!\n//\n// Разница: O(2^n) vs O(n) — экспоненциальное vs линейное!' },
        { type: 'warning', value: 'Никогда не используй наивную рекурсию для Фибоначчи в реальном коде! fib(50) с наивной рекурсией работает минуты. С ДП — микросекунды. Разница в миллионы раз.' }
      ]
    },
    {
      id: 3,
      title: 'Мемоизация (сверху вниз)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мемоизация (top-down) — это рекурсия + кеш. Перед вычислением проверяем: уже считали этот ответ? Если да — возвращаем из кеша. Если нет — вычисляем и сохраняем.' },
        { type: 'tip', value: 'Ты решаешь задачи по математике. Встретил fib(42) — посчитал, записал на листочке. Встретил снова — просто смотришь в листочек. Мемоизация = "листочек с ответами".' },
        { type: 'heading', value: 'Фибоначчи с мемоизацией' },
        { type: 'code', language: 'java', value: 'import java.util.HashMap;\nimport java.util.Map;\n\npublic class FibMemo {\n\n    // Кеш: ключ = n, значение = fib(n)\n    static Map<Integer, Long> memo = new HashMap<>();\n\n    static long fib(int n) {\n        // Базовые случаи\n        if (n <= 1) return n;\n\n        // Проверяем кеш!\n        if (memo.containsKey(n)) {\n            return memo.get(n);  // уже считали\n        }\n\n        // Считаем и СОХРАНЯЕМ в кеш\n        long result = fib(n - 1) + fib(n - 2);\n        memo.put(n, result);\n        return result;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(fib(10));   // 55\n        System.out.println(fib(50));   // 12586269025\n        System.out.println(fib(100));  // 354224848179261915075 (но это переполнение long!)\n\n        // Счётчик вызовов - теперь O(n):\n        // fib(50) = ровно 99 вызовов вместо ~2 млрд!\n    }\n}' },
        { type: 'heading', value: 'Мемоизация с массивом (быстрее HashMap)' },
        { type: 'code', language: 'java', value: 'public class FibMemoArray {\n\n    static long[] cache;  // кеш в виде массива\n\n    static long fib(int n) {\n        if (n <= 1) return n;\n        if (cache[n] != -1) return cache[n];  // уже считали\n        cache[n] = fib(n - 1) + fib(n - 2);\n        return cache[n];\n    }\n\n    public static void main(String[] args) {\n        int n = 50;\n        cache = new long[n + 1];\n        java.util.Arrays.fill(cache, -1);  // -1 = не вычислено\n\n        for (int i = 0; i <= n; i++) {\n            System.out.print(fib(i) + " ");\n        }\n    }\n}\n// 0 1 1 2 3 5 8 13 21 34 55 89 ... 12586269025' },
        { type: 'note', value: 'Массив быстрее HashMap: доступ O(1) без хеширования и накладных расходов. Используй массив, когда n — целое число в разумных границах.' }
      ]
    },
    {
      id: 4,
      title: 'Табуляция (снизу вверх)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Табуляция (bottom-up) — итеративный подход к ДП. Мы заполняем таблицу ответов, начиная с базовых случаев и постепенно доходя до ответа. Без рекурсии, без риска StackOverflow.' },
        { type: 'tip', value: 'Мемоизация: "Хочу fib(10), попрошу fib(9), тот попросит fib(8)..." — сверху вниз. Табуляция: "Знаю fib(0)=0, fib(1)=1, посчитаю fib(2), потом fib(3)..." — снизу вверх. Оба дают одинаковый ответ, но табуляция часто быстрее.' },
        { type: 'heading', value: 'Фибоначчи с табуляцией' },
        { type: 'code', language: 'java', value: 'public class FibTabulation {\n\n    static long fibTab(int n) {\n        if (n <= 1) return n;\n\n        long[] dp = new long[n + 1];\n        dp[0] = 0;  // базовый случай\n        dp[1] = 1;  // базовый случай\n\n        // Заполняем снизу вверх\n        for (int i = 2; i <= n; i++) {\n            dp[i] = dp[i-1] + dp[i-2];\n        }\n\n        return dp[n];\n    }\n\n    public static void main(String[] args) {\n        System.out.println("fib(10) = " + fibTab(10));  // 55\n        System.out.println("fib(50) = " + fibTab(50));  // 12586269025\n\n        // Трассировка для fib(7):\n        // dp = [0, 1, ?, ?, ?, ?, ?, ?]\n        // i=2: dp[2] = dp[1]+dp[0] = 1+0 = 1\n        // i=3: dp[3] = dp[2]+dp[1] = 1+1 = 2\n        // i=4: dp[4] = dp[3]+dp[2] = 2+1 = 3\n        // i=5: dp[5] = dp[4]+dp[3] = 3+2 = 5\n        // i=6: dp[6] = dp[5]+dp[4] = 5+3 = 8\n        // i=7: dp[7] = dp[6]+dp[5] = 8+5 = 13\n        System.out.println("fib(7) = " + fibTab(7));   // 13\n    }\n}' },
        { type: 'heading', value: 'Оптимизация памяти: O(1) вместо O(n)' },
        { type: 'code', language: 'java', value: '// Нам нужны только два предыдущих значения!\n// Незачем хранить весь массив:\nstatic long fibOptimized(int n) {\n    if (n <= 1) return n;\n    long prev2 = 0;  // fib(i-2)\n    long prev1 = 1;  // fib(i-1)\n    for (int i = 2; i <= n; i++) {\n        long curr = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}\n// Память: O(1) вместо O(n) — в n раз экономнее!' },
        { type: 'list', items: [
          'Мемоизация: проще перевести из рекурсии, но стек вызовов ограничен',
          'Табуляция: нет рекурсии, работает с большими n, легче оптимизировать память',
          'Оба подхода: одинаковая временная сложность O(n)',
          'На интервью принято обсуждать оба подхода'
        ]}
      ]
    },
    {
      id: 5,
      title: 'Задача о ступеньках (Climbing Stairs)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Классическая ДП-задача: есть лестница из n ступенек. Ты можешь шагать по 1 или по 2 ступеньки за раз. Сколько различных способов добраться до вершины?' },
        { type: 'tip', value: 'Чтобы оказаться на ступеньке n, ты либо пришёл с ступеньки n-1 (шаг 1), либо с ступеньки n-2 (шаг 2). Значит: ways(n) = ways(n-1) + ways(n-2). Это Фибоначчи!' },
        { type: 'heading', value: 'Анализ задачи' },
        { type: 'code', language: 'java', value: '// ways(1) = 1:  [1]\n// ways(2) = 2:  [1,1], [2]\n// ways(3) = 3:  [1,1,1], [1,2], [2,1]\n// ways(4) = 5:  [1,1,1,1], [1,1,2], [1,2,1], [2,1,1], [2,2]\n// ways(5) = 8:  ... (8 способов)\n//\n// Паттерн: 1, 2, 3, 5, 8, 13... — это числа Фибоначчи!\n// ways(n) = ways(n-1) + ways(n-2)\n//           ^                ^\n//   пришли с n-1      пришли с n-2' },
        { type: 'heading', value: 'Решение с ДП' },
        { type: 'code', language: 'java', value: 'public class ClimbingStairs {\n\n    static int climbStairs(int n) {\n        if (n <= 2) return n;\n\n        int[] dp = new int[n + 1];\n        dp[1] = 1;  // одна ступенька — один способ\n        dp[2] = 2;  // две ступеньки — два способа: [1,1] или [2]\n\n        for (int i = 3; i <= n; i++) {\n            dp[i] = dp[i-1] + dp[i-2];\n        }\n\n        return dp[n];\n    }\n\n    public static void main(String[] args) {\n        for (int i = 1; i <= 10; i++) {\n            System.out.println("Ступенек: " + i + ", способов: " + climbStairs(i));\n        }\n    }\n}\n// Ступенек: 1, способов: 1\n// Ступенек: 2, способов: 2\n// Ступенек: 3, способов: 3\n// Ступенек: 4, способов: 5\n// Ступенек: 5, способов: 8\n// Ступенек: 10, способов: 89' },
        { type: 'heading', value: 'Усложнение: шаги 1, 2 или 3' },
        { type: 'code', language: 'java', value: '// Теперь можно шагать на 1, 2 или 3 ступеньки!\n// ways(n) = ways(n-1) + ways(n-2) + ways(n-3)\nstatic int climbStairs3(int n) {\n    if (n == 0) return 1;\n    if (n == 1) return 1;\n    if (n == 2) return 2;\n    int[] dp = new int[n + 1];\n    dp[0] = 1; dp[1] = 1; dp[2] = 2;\n    for (int i = 3; i <= n; i++) {\n        dp[i] = dp[i-1] + dp[i-2] + dp[i-3];\n    }\n    return dp[n];\n}\n// climbStairs3(3) = 4: [1,1,1],[1,2],[2,1],[3]' },
        { type: 'tip', value: 'Ключевой вопрос при решении ДП: "Каким был ПОСЛЕДНИЙ шаг?". Если последний шаг был на 1 — до него было ways(n-1) вариантов. На 2 — ways(n-2). Складываем все случаи.' }
      ]
    },
    {
      id: 6,
      title: 'Задача о монетах (Coin Change)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Задача о монетах: есть монеты разных номиналов и целевая сумма. Найди минимальное количество монет, которыми можно набрать эту сумму. Монет каждого номинала неограниченное количество.' },
        { type: 'tip', value: 'Ты идёшь в автомат за газировкой (95 тенге). У тебя монеты по 1, 5, 10, 25 тенге. Хочешь опустить как можно меньше монет. Жадный алгоритм (берём самую большую) не всегда работает! ДП даёт гарантированный минимум.' },
        { type: 'heading', value: 'Почему жадный алгоритм не работает?' },
        { type: 'code', language: 'java', value: '// Монеты: [1, 3, 4], сумма = 6\n// Жадный: 4 + 1 + 1 = 3 монеты\n// Оптимум: 3 + 3 = 2 монеты!\n//\n// Жадный алгоритм неоптимален для любых монет.\n// ДП всегда найдёт минимум.' },
        { type: 'heading', value: 'Решение с ДП' },
        { type: 'code', language: 'java', value: 'import java.util.Arrays;\n\npublic class CoinChange {\n\n    static int coinChange(int[] coins, int amount) {\n        // dp[i] = минимальное количество монет для суммы i\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);  // "бесконечность" = невозможно\n        dp[0] = 0;  // базовый случай: 0 монет для суммы 0\n\n        // Для каждой суммы от 1 до amount\n        for (int sum = 1; sum <= amount; sum++) {\n            // Пробуем каждую монету\n            for (int coin : coins) {\n                if (coin <= sum) {  // монету можно использовать\n                    // dp[sum] = min(текущее, 1 + способ набрать (sum - coin))\n                    dp[sum] = Math.min(dp[sum], 1 + dp[sum - coin]);\n                }\n            }\n        }\n\n        return dp[amount] > amount ? -1 : dp[amount];  // -1 если невозможно\n    }\n\n    public static void main(String[] args) {\n        System.out.println(coinChange(new int[]{1, 5, 10, 25}, 41)); // 4: 25+10+5+1\n        System.out.println(coinChange(new int[]{1, 3, 4}, 6));       // 2: 3+3\n        System.out.println(coinChange(new int[]{2}, 3));              // -1: невозможно\n    }\n}' },
        { type: 'heading', value: 'Трассировка: монеты [1,5,6], сумма 9' },
        { type: 'code', language: 'java', value: '// dp = [0, INF, INF, INF, INF, INF, INF, INF, INF, INF]\n//\n// sum=1: монета 1: dp[1]=min(INF, 1+dp[0])=1 -> dp[1]=1\n// sum=2: монета 1: dp[2]=min(INF, 1+dp[1])=2 -> dp[2]=2\n// sum=3: монета 1: dp[3]=3\n// sum=4: монета 1: dp[4]=4\n// sum=5: монета 1: 1+dp[4]=5; монета 5: 1+dp[0]=1 -> dp[5]=1\n// sum=6: монета 1: 1+dp[5]=2; монета 5: 1+dp[1]=2; монета 6: 1+dp[0]=1 -> dp[6]=1\n// sum=7: монета 1: 1+dp[6]=2; монета 5: 1+dp[2]=3; монета 6: 1+dp[1]=2 -> dp[7]=2\n// sum=8: монета 1: 1+dp[7]=3; монета 5: 1+dp[3]=4; монета 6: 1+dp[2]=3 -> dp[8]=3\n// sum=9: монета 1: 1+dp[8]=4; монета 5: 1+dp[4]=5; монета 6: 1+dp[3]=4 -> dp[9]=3\n//                                                          ^\n//              9 = 6 + 3 = 6 + 1+1+1 -> 4 монеты? Нет! 6+1+1+1=9, 4 монеты\n//              Но dp[9]=3: 9 = 6+3? 3 не монета! 9=5+4? 4 не монета!\n//              Правильно: 9 = 6+1+1+1=4 или... подождите. 9=3*3=нет 3 нет.\n//              С монетами [1,5,6]: 9 = 6+1+1+1 = 4 монеты. dp[9]=4. ✓' },
        { type: 'note', value: 'Запоминай паттерн: dp[sum] = min для всех монет { 1 + dp[sum - coin] }. Это рекуррентное соотношение. Базовый случай: dp[0] = 0.' }
      ]
    },
    {
      id: 7,
      title: 'Как распознать ДП-задачу',
      type: 'theory',
      content: [
        { type: 'text', value: 'Не каждую задачу можно решить с ДП. Вот сигналы, что перед тобой ДП-задача, и стратегия её решения.' },
        { type: 'heading', value: 'Признаки ДП-задачи' },
        { type: 'list', items: [
          'Слова "минимум", "максимум", "количество способов", "можно ли достичь"',
          'Выбор из нескольких вариантов на каждом шаге',
          'Подзадачи перекрываются (одни и те же подпроблемы встречаются не раз)',
          'Задача имеет оптимальную подструктуру',
          'На первый взгляд кажется, что нужен полный перебор'
        ]},
        { type: 'heading', value: 'Стратегия решения ДП' },
        { type: 'code', language: 'java', value: '// 1. Определи, что такое dp[i] (или dp[i][j])\n//    Например: dp[i] = минимальное количество монет для суммы i\n//\n// 2. Найди рекуррентное соотношение\n//    Например: dp[i] = min(dp[i-coin] + 1) для всех coin\n//\n// 3. Определи базовые случаи\n//    Например: dp[0] = 0\n//\n// 4. Определи порядок заполнения (снизу вверх или сверху вниз)\n//    Обычно: от меньших к большим\n//\n// 5. Подумай про оптимизацию памяти\n//    Часто нужны только последние k значений\n\n// ШАБЛОН ДП:\nint[] dp = new int[n + 1];\ndp[базовый_случай] = начальное_значение;\nfor (int i = ...; i <= n; i++) {\n    dp[i] = f(dp[i-1], dp[i-2], ...);  // рекуррентность\n}\nreturn dp[n];' },
        { type: 'heading', value: 'Пример: максимальная сумма подмассива' },
        { type: 'code', language: 'java', value: '// Задача: найти подмассив с максимальной суммой (алгоритм Кадана)\n// dp[i] = максимальная сумма подмассива, заканчивающегося в i\n// dp[i] = max(arr[i], dp[i-1] + arr[i])\n// Либо начинаем новый подмассив с arr[i], либо продолжаем предыдущий\n\nstatic int maxSubArray(int[] arr) {\n    int maxSum = arr[0];\n    int currSum = arr[0];\n    for (int i = 1; i < arr.length; i++) {\n        currSum = Math.max(arr[i], currSum + arr[i]);\n        maxSum = Math.max(maxSum, currSum);\n    }\n    return maxSum;\n}\n\n// Трассировка: [-2, 1, -3, 4, -1, 2, 1, -5, 4]\n// curr: -2, 1, -2, 4, 3, 5, 6, 1, 5\n// max:  -2, 1,  1, 4, 4, 5, 6, 6, 6\n// Ответ: 6 (подмассив [4,-1,2,1])' },
        { type: 'tip', value: 'Главный вопрос при формулировке ДП: "Что означает dp[i]?". Правильно определить смысл — полдела. Обычно это "ответ на задачу для первых i элементов / для суммы i / для строки длины i".' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Монеты и ступеньки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реши три ДП-задачи. Задача 1: climbStairs(n) — количество способов подняться на n ступенек (шаги 1 или 2). Задача 2: minCoins(coins, amount) — минимальное количество монет. Задача 3: countWays(coins, amount) — количество способов набрать сумму (не минимум, а все варианты).',
      requirements: [
        'climbStairs использует табуляцию dp[i] = dp[i-1] + dp[i-2]',
        'minCoins использует dp[sum] = min(dp[sum-coin] + 1)',
        'countWays считает количество комбинаций (порядок не важен)',
        'Все три метода должны работать за O(n) или O(n*m) времени',
        'Не использовать рекурсию без мемоизации'
      ],
      expectedOutput: 'Способов подняться на 5 ступеней: 8\nМинимум монет для 11 (монеты 1,5,6,9): 2\nСпособов набрать 5 монетами (1,2,5): 4',
      hint: 'countWays: внешний цикл по монетам, внутренний по суммам. dp[sum] += dp[sum - coin]. Это не то же что minCoins — здесь суммируем, а не берём min. dp[0] = 1 (один способ набрать 0).',
      solution: 'import java.util.Arrays;\n\npublic class Main {\n\n    static int climbStairs(int n) {\n        if (n <= 2) return n;\n        int[] dp = new int[n + 1];\n        dp[1] = 1;\n        dp[2] = 2;\n        for (int i = 3; i <= n; i++) {\n            dp[i] = dp[i-1] + dp[i-2];\n        }\n        return dp[n];\n    }\n\n    static int minCoins(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int sum = 1; sum <= amount; sum++) {\n            for (int coin : coins) {\n                if (coin <= sum) {\n                    dp[sum] = Math.min(dp[sum], 1 + dp[sum - coin]);\n                }\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n\n    static int countWays(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        dp[0] = 1;  // один способ набрать 0 — не брать ни одной монеты\n        for (int coin : coins) {       // внешний цикл по монетам!\n            for (int sum = coin; sum <= amount; sum++) {\n                dp[sum] += dp[sum - coin];\n            }\n        }\n        return dp[amount];\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Способов подняться на 5 ступеней: " + climbStairs(5));\n        System.out.println("Минимум монет для 11 (монеты 1,5,6,9): "\n            + minCoins(new int[]{1, 5, 6, 9}, 11));\n        System.out.println("Способов набрать 5 монетами (1,2,5): "\n            + countWays(new int[]{1, 2, 5}, 5));\n    }\n}',
      explanation: 'climbStairs — классика Фибоначчи. minCoins — для каждой суммы пробуем все монеты, берём минимум. countWays — внешний цикл по монетам (не по суммам!) гарантирует, что каждая комбинация считается один раз, порядок не важен. Если поменять циклы местами — будем считать перестановки, а не комбинации. Все три — O(n*m) где n = amount, m = количество монет.'
    }
  ]
}
