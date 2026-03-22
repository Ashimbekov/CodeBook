export default {
  id: 25,
  title: 'Coding: динамическое программирование',
  description: 'Динамическое программирование: от простых задач (Climbing Stairs, House Robber) до классических (LCS, Edit Distance, 0/1 Knapsack). Все задачи практические с разбором подхода мемоизации и табуляции.',
  lessons: [
    {
      id: 1,
      title: 'Climbing Stairs',
      type: 'practice',
      difficulty: 'easy',
      description: 'Подняться на n ступеней, за раз можно подняться на 1 или 2 ступени. Сколько способов добраться до вершины?',
      requirements: [
        'Реализовать функцию climb_stairs(n: int) -> int',
        'Использовать ДП снизу вверх (табуляция)',
        'Вывести dp массив для n=5 пошагово',
        'Тест: n=2 -> 2, n=3 -> 3, n=5 -> 8, n=10 -> 89'
      ],
      expectedOutput: 'n=2: 2\nn=3: 3\nn=5: 8\nn=10: 89\ndp для n=5: [1, 1, 2, 3, 5, 8]',
      hint: 'Каждая ступень i достигается с ступени i-1 или i-2. dp[i] = dp[i-1] + dp[i-2]. Это числа Фибоначчи! dp[0]=1, dp[1]=1.',
      solution: 'def climb_stairs(n):\n    if n <= 1:\n        return 1\n    dp = [0] * (n + 1)\n    dp[0] = 1\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]\n\nprint("n=2:", climb_stairs(2))\nprint("n=3:", climb_stairs(3))\nprint("n=5:", climb_stairs(5))\nprint("n=10:", climb_stairs(10))\n\ndef climb_stairs_verbose(n):\n    dp = [0] * (n + 1)\n    dp[0] = 1\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    print("dp для n=" + str(n) + ":", dp)\n    return dp[n]\n\nclimb_stairs_verbose(5)',
      explanation: 'Подход: dp[i] = dp[i-1] + dp[i-2] — рекуррентное соотношение аналогично Фибоначчи. Табуляция (bottom-up): заполняем таблицу слева направо без рекурсии.\nСложность: O(n) по времени, O(n) по памяти (оптимизируется до O(1) двумя переменными).\nНа интервью: объясни, что это частный случай ДП — перекрывающиеся подзадачи (каждая ступень считается один раз). Упомяни оптимизацию O(1) памяти через два скользящих числа.'
    },
    {
      id: 2,
      title: 'House Robber',
      type: 'practice',
      difficulty: 'medium',
      description: 'Вор грабит дома на улице. Нельзя грабить два соседних дома. Найди максимальную сумму добычи. nums[i] — деньги в i-м доме.',
      requirements: [
        'Реализовать функцию rob(nums: list) -> int',
        'Использовать ДП: dp[i] = max(dp[i-1], dp[i-2] + nums[i])',
        'Вывести dp массив для nums=[2,7,9,3,1]',
        'Тесты: [1,2,3,1] -> 4, [2,7,9,3,1] -> 12'
      ],
      expectedOutput: '[1,2,3,1] -> 4\n[2,7,9,3,1] -> 12\ndp для [2,7,9,3,1]: [2, 7, 11, 11, 12]',
      hint: 'Для каждого дома i: либо пропускаем его (берём dp[i-1]), либо грабим (dp[i-2] + nums[i]). dp[i] = max(dp[i-1], dp[i-2] + nums[i]).',
      solution: 'def rob(nums):\n    if not nums:\n        return 0\n    n = len(nums)\n    if n == 1:\n        return nums[0]\n    dp = [0] * n\n    dp[0] = nums[0]\n    dp[1] = max(nums[0], nums[1])\n    for i in range(2, n):\n        dp[i] = max(dp[i-1], dp[i-2] + nums[i])\n    return dp[-1]\n\nprint("[1,2,3,1] ->", rob([1, 2, 3, 1]))\nprint("[2,7,9,3,1] ->", rob([2, 7, 9, 3, 1]))\n\ndef rob_verbose(nums):\n    n = len(nums)\n    dp = [0] * n\n    dp[0] = nums[0]\n    dp[1] = max(nums[0], nums[1])\n    for i in range(2, n):\n        dp[i] = max(dp[i-1], dp[i-2] + nums[i])\n    print("dp для", nums, ":", dp)\n    return dp[-1]\n\nrob_verbose([2, 7, 9, 3, 1])',
      explanation: 'Подход: dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Для дома i выбираем: пропустить (взять dp[i-1]) или ограбить (добавить nums[i] к лучшему результату без соседнего дома).\nСложность: O(n) время, O(n) память (можно O(1) через prev2, prev1).\nНа интервью: покажи оптимизацию — нужны только два предыдущих значения. Вариация: House Robber II (круговые дома) — запускаем rob дважды: [0..n-2] и [1..n-1], берём максимум.'
    },
    {
      id: 3,
      title: 'Coin Change',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дано n монет разного номинала и сумма amount. Найди минимальное количество монет, чтобы набрать amount. Монет неограниченное количество.',
      requirements: [
        'Реализовать функцию coin_change(coins: list, amount: int) -> int',
        'Вернуть -1, если сумма недостижима',
        'Вывести dp массив для coins=[1,5,6,9], amount=11',
        'Тесты: coins=[1,5,6,9] amount=11 -> 2, coins=[2] amount=3 -> -1'
      ],
      expectedOutput: 'coins=[1,5,6,9] amount=11: 2\ncoins=[2] amount=3: -1\ndp для amount=11: [0, 1, 2, 3, 4, 1, 1, 2, 3, 1, 2, 2]',
      hint: 'dp[i] — минимум монет для суммы i. dp[0]=0, dp[i] = min(dp[i-c]+1) для каждой монеты c <= i. Инициализируй dp[i] = infinity.',
      solution: 'def coin_change(coins, amount):\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for coin in coins:\n            if coin <= i:\n                dp[i] = min(dp[i], dp[i - coin] + 1)\n    return dp[amount] if dp[amount] != float("inf") else -1\n\nprint("coins=[1,5,6,9] amount=11:", coin_change([1, 5, 6, 9], 11))\nprint("coins=[2] amount=3:", coin_change([2], 3))\n\ndef coin_change_verbose(coins, amount):\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for coin in coins:\n            if coin <= i:\n                dp[i] = min(dp[i], dp[i - coin] + 1)\n    result = [x if x != float("inf") else -1 for x in dp]\n    print("dp для amount=" + str(amount) + ":", result)\n    return dp[amount] if dp[amount] != float("inf") else -1\n\ncoin_change_verbose([1, 5, 6, 9], 11)',
      explanation: 'Подход: bottom-up ДП. dp[i] = минимум монет для суммы i. Для каждой суммы перебираем все монеты: dp[i] = min(dp[i], dp[i-coin] + 1).\nСложность: O(amount * len(coins)) время, O(amount) память.\nНа интервью: объясни разницу между этой задачей (unbounded knapsack) и 0/1 knapsack. Здесь каждую монету можно использовать бесчисленное число раз — внешний цикл по суммам, внутренний по монетам.'
    },
    {
      id: 4,
      title: 'Longest Increasing Subsequence',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди длину наибольшей возрастающей подпоследовательности (LIS) в массиве nums. Подпоследовательность не обязательно непрерывная.',
      requirements: [
        'Реализовать функцию length_of_lis(nums: list) -> int',
        'Метод O(n^2) через ДП с выводом dp массива',
        'Вывести dp для nums=[10,9,2,5,3,7,101,18]',
        'Тесты: [10,9,2,5,3,7,101,18] -> 4, [0,1,0,3,2,3] -> 4, [7,7,7,7] -> 1'
      ],
      expectedOutput: '[10,9,2,5,3,7,101,18] -> 4\n[0,1,0,3,2,3] -> 4\n[7,7,7,7] -> 1\ndp: [1, 1, 1, 2, 2, 3, 4, 4]',
      hint: 'dp[i] — длина LIS, заканчивающейся в nums[i]. dp[i] = max(dp[j]+1) для всех j < i, где nums[j] < nums[i]. Ответ: max(dp).',
      solution: 'def length_of_lis(nums):\n    if not nums:\n        return 0\n    n = len(nums)\n    dp = [1] * n\n    for i in range(1, n):\n        for j in range(i):\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp)\n\nnums1 = [10, 9, 2, 5, 3, 7, 101, 18]\nprint("[10,9,2,5,3,7,101,18] ->", length_of_lis(nums1))\nprint("[0,1,0,3,2,3] ->", length_of_lis([0, 1, 0, 3, 2, 3]))\nprint("[7,7,7,7] ->", length_of_lis([7, 7, 7, 7]))\n\ndef lis_verbose(nums):\n    n = len(nums)\n    dp = [1] * n\n    for i in range(1, n):\n        for j in range(i):\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    print("dp:", dp)\n    return max(dp)\n\nlis_verbose([10, 9, 2, 5, 3, 7, 101, 18])',
      explanation: 'Подход: dp[i] = длина LIS, заканчивающейся в позиции i. Для каждого i смотрим все j < i: если nums[j] < nums[i], то можем продлить подпоследовательность.\nСложность: O(n^2) время, O(n) память.\nНа интервью: упомяни оптимальный O(n log n) подход с бинарным поиском (patience sorting). LIS — классика ДП на подпоследовательностях.'
    },
    {
      id: 5,
      title: 'Word Break',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s и словарь wordDict. Можно ли разбить s на слова из словаря? Слова можно использовать повторно.',
      requirements: [
        'Реализовать функцию word_break(s: str, wordDict: list) -> bool',
        'Использовать ДП: dp[i] = True если s[:i] можно разбить',
        'Вывести dp массив для s="leetcode", wordDict=["leet","code"]',
        'Тесты: "leetcode",["leet","code"] -> True, "applepenapple",["apple","pen"] -> True, "catsandog",["cats","dog","sand","cat","an"] -> False'
      ],
      expectedOutput: 'leetcode: True\napplepenapple: True\ncatsandog: False\ndp: [True, False, False, False, True, False, False, False, True]',
      hint: 'dp[i] = True если s[0:i] можно разбить. dp[0] = True (пустая строка). Для каждого i проверяем все j < i: если dp[j] == True и s[j:i] в словаре, то dp[i] = True.',
      solution: 'def word_break(s, word_dict):\n    word_set = set(word_dict)\n    n = len(s)\n    dp = [False] * (n + 1)\n    dp[0] = True\n    for i in range(1, n + 1):\n        for j in range(i):\n            if dp[j] and s[j:i] in word_set:\n                dp[i] = True\n                break\n    return dp[n]\n\nprint("leetcode:", word_break("leetcode", ["leet", "code"]))\nprint("applepenapple:", word_break("applepenapple", ["apple", "pen"]))\nprint("catsandog:", word_break("catsandog", ["cats", "dog", "sand", "cat", "an"]))\n\ndef word_break_verbose(s, word_dict):\n    word_set = set(word_dict)\n    n = len(s)\n    dp = [False] * (n + 1)\n    dp[0] = True\n    for i in range(1, n + 1):\n        for j in range(i):\n            if dp[j] and s[j:i] in word_set:\n                dp[i] = True\n                break\n    print("dp:", dp)\n    return dp[n]\n\nword_break_verbose("leetcode", ["leet", "code"])',
      explanation: 'Подход: dp[i] означает "первые i символов строки можно разбить на слова из словаря". Переход: dp[i] = True если существует j такой, что dp[j]=True и s[j:i] в словаре.\nСложность: O(n^2 * m) где m — средняя длина слова (для проверки в set O(m)), O(n) память.\nНа интервью: это классический пример ДП на строках. Можно улучшить, ограничив j проверкой только слов длиной <= max_word_len.'
    },
    {
      id: 6,
      title: 'Unique Paths',
      type: 'practice',
      difficulty: 'medium',
      description: 'Робот стоит в левом верхнем углу сетки m x n. Может двигаться только вправо или вниз. Сколько уникальных путей до правого нижнего угла?',
      requirements: [
        'Реализовать функцию unique_paths(m: int, n: int) -> int',
        'Использовать 2D ДП таблицу',
        'Вывести таблицу dp для m=3, n=3',
        'Тесты: m=3,n=7 -> 28, m=3,n=2 -> 3, m=3,n=3 -> 6'
      ],
      expectedOutput: 'm=3,n=7: 28\nm=3,n=2: 3\nm=3,n=3: 6\ndp[3][3]:\n[1, 1, 1]\n[1, 2, 3]\n[1, 3, 6]',
      hint: 'dp[i][j] — количество путей до клетки (i,j). Первая строка и первый столбец всегда 1 (один путь — прямо вправо или прямо вниз). dp[i][j] = dp[i-1][j] + dp[i][j-1].',
      solution: 'def unique_paths(m, n):\n    dp = [[1] * n for _ in range(m)]\n    for i in range(1, m):\n        for j in range(1, n):\n            dp[i][j] = dp[i-1][j] + dp[i][j-1]\n    return dp[m-1][n-1]\n\nprint("m=3,n=7:", unique_paths(3, 7))\nprint("m=3,n=2:", unique_paths(3, 2))\nprint("m=3,n=3:", unique_paths(3, 3))\n\ndef unique_paths_verbose(m, n):\n    dp = [[1] * n for _ in range(m)]\n    for i in range(1, m):\n        for j in range(1, n):\n            dp[i][j] = dp[i-1][j] + dp[i][j-1]\n    print("dp[" + str(m) + "][" + str(n) + "]:")\n    for row in dp:\n        print(row)\n    return dp[m-1][n-1]\n\nunique_paths_verbose(3, 3)',
      explanation: 'Подход: 2D ДП. dp[i][j] = dp[i-1][j] + dp[i][j-1] — в клетку можно прийти сверху или слева. Граничные условия: первая строка и столбец заполняются единицами.\nСложность: O(m*n) время и память (оптимизируется до O(n) одномерным массивом).\nНа интервью: покажи оптимизацию памяти до O(n). Также существует математическое решение через биномиальные коэффициенты: C(m+n-2, m-1).'
    },
    {
      id: 7,
      title: 'Decode Ways',
      type: 'practice',
      difficulty: 'medium',
      description: 'Строка цифр закодирована: A=1, B=2, ..., Z=26. Найди количество способов декодировать строку s.',
      requirements: [
        'Реализовать функцию num_decodings(s: str) -> int',
        'Учесть ведущие нули (невалидные)',
        'Вывести dp для s="226"',
        'Тесты: "12" -> 2, "226" -> 3, "06" -> 0, "11106" -> 2'
      ],
      expectedOutput: '"12": 2\n"226": 3\n"06": 0\n"11106": 2\ndp для "226": [1, 1, 2, 3]',
      hint: 'dp[i] — количество декодирований s[:i]. dp[0]=1, dp[1]=0 если s[0]=="0" иначе 1. Для каждого i: если s[i-1]!="0" то dp[i]+=dp[i-1]. Если s[i-2:i] в диапазоне 10..26 то dp[i]+=dp[i-2].',
      solution: 'def num_decodings(s):\n    if not s or s[0] == "0":\n        return 0\n    n = len(s)\n    dp = [0] * (n + 1)\n    dp[0] = 1\n    dp[1] = 1\n    for i in range(2, n + 1):\n        one_digit = int(s[i-1])\n        two_digits = int(s[i-2:i])\n        if one_digit >= 1:\n            dp[i] += dp[i-1]\n        if 10 <= two_digits <= 26:\n            dp[i] += dp[i-2]\n    return dp[n]\n\nprint(\'"\' + "12" + \'"\' + ":", num_decodings("12"))\nprint(\'"\' + "226" + \'"\' + ":", num_decodings("226"))\nprint(\'"\' + "06" + \'"\' + ":", num_decodings("06"))\nprint(\'"\' + "11106" + \'"\' + ":", num_decodings("11106"))\n\ndef num_decodings_verbose(s):\n    if not s or s[0] == "0":\n        return 0\n    n = len(s)\n    dp = [0] * (n + 1)\n    dp[0] = 1\n    dp[1] = 1\n    for i in range(2, n + 1):\n        one_digit = int(s[i-1])\n        two_digits = int(s[i-2:i])\n        if one_digit >= 1:\n            dp[i] += dp[i-1]\n        if 10 <= two_digits <= 26:\n            dp[i] += dp[i-2]\n    print("dp для \\"" + s + "\\":", dp)\n    return dp[n]\n\nnum_decodings_verbose("226")',
      explanation: 'Подход: dp[i] = количество способов декодировать первые i символов. На каждом шаге смотрим последнюю одну цифру (1-9 валидна) и последние две цифры (10-26 валидны).\nСложность: O(n) время, O(n) память (оптимизируется до O(1)).\nНа интервью: акцент на обработку нулей — "0" отдельно не декодируется, только в паре "10" или "20". Похоже на Climbing Stairs, но с условиями.'
    },
    {
      id: 8,
      title: 'Longest Common Subsequence',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди длину наибольшей общей подпоследовательности (LCS) двух строк text1 и text2. Подпоследовательность — символы в том же порядке, но не обязательно рядом.',
      requirements: [
        'Реализовать функцию lcs(text1: str, text2: str) -> int',
        'Использовать 2D ДП таблицу',
        'Вывести таблицу dp для text1="abcde", text2="ace"',
        'Тесты: "abcde","ace" -> 3, "abc","abc" -> 3, "abc","def" -> 0'
      ],
      expectedOutput: '"abcde","ace": 3\n"abc","abc": 3\n"abc","def": 0\ndp таблица для "abcde","ace":\n[0, 0, 0, 0]\n[0, 1, 1, 1]\n[0, 1, 1, 1]\n[0, 1, 2, 2]\n[0, 1, 2, 2]\n[0, 1, 2, 3]',
      hint: 'dp[i][j] — LCS text1[:i] и text2[:j]. Если text1[i-1]==text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1. Иначе: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).',
      solution: 'def lcs(text1, text2):\n    m, n = len(text1), len(text2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if text1[i-1] == text2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]\n\nprint(\'"\' + "abcde" + \'","ace":\', lcs("abcde", "ace"))\nprint(\'"\' + "abc" + \'","abc":\', lcs("abc", "abc"))\nprint(\'"\' + "abc" + \'","def":\', lcs("abc", "def"))\n\ndef lcs_verbose(text1, text2):\n    m, n = len(text1), len(text2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if text1[i-1] == text2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    print("dp таблица для \\"" + text1 + "\\",\\"" + text2 + "\\":" )\n    for row in dp:\n        print(row)\n    return dp[m][n]\n\nlcs_verbose("abcde", "ace")',
      explanation: 'Подход: 2D ДП. Совпавшие символы: dp[i][j] = dp[i-1][j-1] + 1. Несовпавшие: берём максимум из "пропустить символ text1" или "пропустить символ text2".\nСложность: O(m*n) время и память.\nНа интервью: LCS — фундаментальный алгоритм. Используется в git diff, bioinformatics (выравнивание ДНК). Прямо связан с Edit Distance (следующая задача).'
    },
    {
      id: 9,
      title: 'Edit Distance',
      type: 'practice',
      difficulty: 'hard',
      description: 'Расстояние Левенштейна: минимальное количество операций (вставка, удаление, замена) для преобразования строки word1 в word2.',
      requirements: [
        'Реализовать функцию edit_distance(word1: str, word2: str) -> int',
        'Использовать 2D ДП таблицу',
        'Вывести таблицу dp для word1="horse", word2="ros"',
        'Тесты: "horse","ros" -> 3, "intention","execution" -> 5, "","abc" -> 3'
      ],
      expectedOutput: '"horse","ros": 3\n"intention","execution": 5\n"","abc": 3\ndp таблица для "horse","ros":\n[0, 1, 2, 3]\n[1, 1, 2, 3]\n[2, 2, 1, 2]\n[3, 2, 2, 2]\n[4, 3, 3, 2]\n[5, 4, 4, 3]',
      hint: 'dp[i][j] — Edit Distance word1[:i] и word2[:j]. Базис: dp[i][0]=i, dp[0][j]=j. Если символы равны: dp[i][j]=dp[i-1][j-1]. Иначе: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).',
      solution: 'def edit_distance(word1, word2):\n    m, n = len(word1), len(word2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m + 1):\n        dp[i][0] = i\n    for j in range(n + 1):\n        dp[0][j] = j\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if word1[i-1] == word2[j-1]:\n                dp[i][j] = dp[i-1][j-1]\n            else:\n                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\n    return dp[m][n]\n\nprint(\'"\' + "horse" + \'","ros":\', edit_distance("horse", "ros"))\nprint(\'"\' + "intention" + \'","execution":\', edit_distance("intention", "execution"))\nprint(\'"\' + "" + \'","abc":\', edit_distance("", "abc"))\n\ndef edit_distance_verbose(word1, word2):\n    m, n = len(word1), len(word2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m + 1):\n        dp[i][0] = i\n    for j in range(n + 1):\n        dp[0][j] = j\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if word1[i-1] == word2[j-1]:\n                dp[i][j] = dp[i-1][j-1]\n            else:\n                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])\n    print("dp таблица для \\"" + word1 + "\\",\\"" + word2 + "\\":")\n    for row in dp:\n        print(row)\n    return dp[m][n]\n\nedit_distance_verbose("horse", "ros")',
      explanation: 'Подход: dp[i][j] = min операций для word1[:i] -> word2[:j]. Три операции: удаление (dp[i-1][j]+1), вставка (dp[i][j-1]+1), замена (dp[i-1][j-1]+1). Если символы совпадают — операция не нужна.\nСложность: O(m*n) время и память.\nНа интервью: Edit Distance — один из самых известных алгоритмов ДП. Используется в spell checkers, DNA alignment, plagiarism detection. Объясни три операции интуитивно.'
    },
    {
      id: 10,
      title: '0/1 Knapsack',
      type: 'practice',
      difficulty: 'hard',
      description: 'Рюкзак с ограниченной ёмкостью capacity. Каждый предмет имеет вес weights[i] и ценность values[i]. Каждый предмет можно взять не более одного раза. Максимизировать ценность.',
      requirements: [
        'Реализовать функцию knapsack(weights: list, values: list, capacity: int) -> int',
        'Использовать 2D ДП таблицу dp[i][w]',
        'Вывести таблицу dp для weights=[1,3,4,5], values=[1,4,5,7], capacity=7',
        'Тест: weights=[1,3,4,5], values=[1,4,5,7], capacity=7 -> 9'
      ],
      expectedOutput: 'weights=[1,3,4,5], values=[1,4,5,7], capacity=7: 9\ndp таблица:\n[0, 1, 1, 1, 1, 1, 1, 1]\n[0, 1, 1, 4, 5, 5, 5, 5]\n[0, 1, 1, 4, 5, 6, 6, 9]\n[0, 1, 1, 4, 5, 7, 8, 9]',
      hint: 'dp[i][w] — максимальная ценность при использовании первых i предметов и ёмкости w. Если weights[i-1] > w: dp[i][w] = dp[i-1][w]. Иначе: dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w-weights[i-1]]).',
      solution: 'def knapsack(weights, values, capacity):\n    n = len(weights)\n    dp = [[0] * (capacity + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        for w in range(capacity + 1):\n            if weights[i-1] > w:\n                dp[i][w] = dp[i-1][w]\n            else:\n                dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]])\n    return dp[n][capacity]\n\nweights = [1, 3, 4, 5]\nvalues = [1, 4, 5, 7]\ncapacity = 7\nprint("weights=[1,3,4,5], values=[1,4,5,7], capacity=7:", knapsack(weights, values, capacity))\n\ndef knapsack_verbose(weights, values, capacity):\n    n = len(weights)\n    dp = [[0] * (capacity + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        for w in range(capacity + 1):\n            if weights[i-1] > w:\n                dp[i][w] = dp[i-1][w]\n            else:\n                dp[i][w] = max(dp[i-1][w], values[i-1] + dp[i-1][w - weights[i-1]])\n    print("dp таблица:")\n    for row in dp[1:]:\n        print(row)\n    return dp[n][capacity]\n\nknapsack_verbose(weights, values, capacity)',
      explanation: 'Подход: dp[i][w] = максимальная ценность первых i предметов при ёмкости w. Для каждого предмета: либо не берём (берём результат без него), либо берём (добавляем его ценность к лучшему результату с оставшейся ёмкостью).\nСложность: O(n * capacity) время и память (псевдополиномиальная, не полиномиальная — от числа в задаче зависит).\nНа интервью: 0/1 knapsack — шаблон для многих ДП задач (Partition Equal Subset Sum, Target Sum). Отличие от Coin Change: здесь каждый предмет не более одного раза. Можно оптимизировать до O(capacity) памяти, используя одномерный dp и итерируя w справа налево.'
    }
  ]
}
