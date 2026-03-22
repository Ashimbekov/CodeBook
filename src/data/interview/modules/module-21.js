export default {
  id: 21,
  title: 'Coding: скользящее окно',
  description: 'Задачи на технику скользящего окна: подмассивы, подстроки, оптимальные покрытия.',
  lessons: [
    {
      id: 1,
      title: 'Лучшее время для купли/продажи акций',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив prices где prices[i] — цена акции в день i. Найди максимальную прибыль от одной сделки (покупка до продажи). Если прибыли нет — верни 0. LeetCode #121.',
      requirements: [
        'Принимает список цен',
        'Возвращает максимальную прибыль',
        'Покупка должна быть до продажи',
        'Только одна сделка'
      ],
      expectedOutput: 'Вход: prices=[7,1,5,3,6,4]\nВыход: 5 (купить за 1, продать за 6)\nВход: prices=[7,6,4,3,1]\nВыход: 0 (цены только падают)',
      hint: 'Отслеживай минимальную цену покупки до текущего дня и максимальную прибыль при продаже сегодня. Скользящее окно: left — день покупки, right — день продажи.',
      solution: 'def maxProfit(prices):\n    min_price = float("inf")\n    max_profit = 0\n    for price in prices:\n        if price < min_price:\n            min_price = price\n        elif price - min_price > max_profit:\n            max_profit = price - min_price\n    return max_profit\n\n# Явные указатели скользящего окна\ndef maxProfitWindow(prices):\n    left, right = 0, 1\n    max_profit = 0\n    while right < len(prices):\n        if prices[right] > prices[left]:\n            profit = prices[right] - prices[left]\n            max_profit = max(max_profit, profit)\n        else:\n            left = right  # нашли новый минимум\n        right += 1\n    return max_profit',
      explanation: 'Подход: отслеживаем минимум слева. При каждой новой цене считаем прибыль относительно известного минимума.\nСложность: O(n) по времени, O(1) по памяти.\nСовет для интервью: это вариация скользящего окна где левый указатель двигается только при нахождении нового минимума.'
    },
    {
      id: 2,
      title: 'Длиннейшая подстрока без повторений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s. Найди длину длиннейшей подстроки без повторяющихся символов. LeetCode #3.',
      requirements: [
        'Принимает строку',
        'Возвращает целое число',
        'Подстрока должна быть непрерывной',
        'Использует скользящее окно с хеш-таблицей'
      ],
      expectedOutput: 'Вход: "abcabcbb"\nВыход: 3 ("abc")\nВход: "bbbbb"\nВыход: 1 ("b")\nВход: "pwwkew"\nВыход: 3 ("wke")',
      hint: 'Скользящее окно с set (или dict для хранения индексов). Расширяй правый указатель. При дубликате — сужай левый пока дубликат не пропадёт.',
      solution: 'def lengthOfLongestSubstring(s):\n    char_set = set()\n    left = 0\n    max_len = 0\n    for right in range(len(s)):\n        while s[right] in char_set:\n            char_set.remove(s[left])\n            left += 1\n        char_set.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len\n\n# Оптимизированный вариант с dict (O(1) прыжок left)\ndef lengthOfLongestSubstringOpt(s):\n    char_idx = {}  # символ -> последний индекс\n    left = 0\n    max_len = 0\n    for right, char in enumerate(s):\n        if char in char_idx and char_idx[char] >= left:\n            left = char_idx[char] + 1\n        char_idx[char] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len',
      explanation: 'Подход с set: при дубликате сдвигаем left на 1 пока дубликат не уйдёт из окна.\nОптимизация с dict: прыгаем left сразу на позицию после дубликата.\nСложность: O(n) по времени, O(min(n, m)) памяти где m — размер алфавита.\nСовет для интервью: объясни оба варианта. Dict-вариант быстрее на строках с большим алфавитом.'
    },
    {
      id: 3,
      title: 'Наидлиннейшая подстрока с заменой символов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s и число k. Можно заменить не более k символов на любую другую букву. Найди длину наидлиннейшей подстроки с одинаковыми символами после замен. LeetCode #424.',
      requirements: [
        'Принимает строку только из заглавных букв и число k',
        'Возвращает максимальную длину',
        'Можно заменять любые символы',
        'Оптимально: O(n) решение'
      ],
      expectedOutput: 'Вход: s="ABAB", k=2\nВыход: 4 (заменить оба "B" -> "AAAA")\nВход: s="AABABBA", k=1\nВыход: 4',
      hint: 'Скользящее окно. Окно валидно если (длина окна - максимальная частота символа) <= k. Поддерживай count[char] и max_count. При нарушении условия — сдвигай left на 1.',
      solution: 'from collections import defaultdict\n\ndef characterReplacement(s, k):\n    count = defaultdict(int)\n    left = 0\n    max_count = 0  # максимальная частота в текущем окне\n    max_len = 0\n\n    for right in range(len(s)):\n        count[s[right]] += 1\n        max_count = max(max_count, count[s[right]])\n\n        # Количество символов для замены = длина окна - max_count\n        window_size = right - left + 1\n        if window_size - max_count > k:\n            count[s[left]] -= 1\n            left += 1\n\n        max_len = max(max_len, right - left + 1)\n\n    return max_len',
      explanation: 'Подход: ключевой инсайт — окно из length символов валидно если (length - max_freq) <= k (нужно заменить все остальные).\nmax_count может только расти (не убывает при сдвиге left) — это корректно т.к. нас интересует максимальный размер окна.\nСложность: O(n) по времени, O(1) памяти (26 букв).\nСовет для интервью: объясни почему max_count можно не уменьшать при сдвиге left — это нестандартная оптимизация которую стоит обсудить.'
    },
    {
      id: 4,
      title: 'Перестановка в строке',
      type: 'practice',
      difficulty: 'medium',
      description: 'Даны строки s1 и s2. Верни True если s2 содержит перестановку s1 (подстрока s2 является анаграммой s1). LeetCode #567.',
      requirements: [
        'Принимает две строки',
        'Возвращает True если перестановка s1 найдена в s2',
        'Только строчные буквы',
        'Скользящее окно фиксированного размера len(s1)'
      ],
      expectedOutput: 'Вход: s1="ab", s2="eidbaooo"\nВыход: True ("ba" — анаграмма "ab")\nВход: s1="ab", s2="eidboaoo"\nВыход: False',
      hint: 'Окно фиксированного размера len(s1). Сравнивай частоты символов в окне с частотами s1. Используй массив из 26 чисел вместо словаря для O(1) сравнения.',
      solution: 'def checkInclusion(s1, s2):\n    if len(s1) > len(s2):\n        return False\n\n    count1 = [0] * 26\n    count2 = [0] * 26\n\n    for c in s1:\n        count1[ord(c) - ord("a")] += 1\n\n    for i in range(len(s2)):\n        count2[ord(s2[i]) - ord("a")] += 1\n        if i >= len(s1):\n            count2[ord(s2[i - len(s1)]) - ord("a")] -= 1\n        if count1 == count2:\n            return True\n\n    return False\n\n# Вариант с подсчётом совпадений (более эффективный)\ndef checkInclusionOpt(s1, s2):\n    from collections import Counter\n    need = Counter(s1)\n    have = {}\n    formed = 0\n    required = len(need)\n    left = 0\n\n    for right in range(len(s2)):\n        c = s2[right]\n        have[c] = have.get(c, 0) + 1\n        if c in need and have[c] == need[c]:\n            formed += 1\n        if right - left + 1 == len(s1):\n            if formed == required:\n                return True\n            left_c = s2[left]\n            if left_c in need and have[left_c] == need[left_c]:\n                formed -= 1\n            have[left_c] -= 1\n            left += 1\n\n    return False',
      explanation: 'Подход: фиксированное окно размера len(s1). Обновляем частоты при сдвиге.\nМассив из 26 int сравнивается за O(26) = O(1) (константа).\nСложность: O(26 * n) = O(n) по времени, O(1) по памяти.\nСовет для интервью: подход с счётчиком formed элегантнее — не сравниваем весь массив на каждой итерации.'
    },
    {
      id: 5,
      title: 'Минимальное окно подстроки',
      type: 'practice',
      difficulty: 'hard',
      description: 'Даны строки s и t. Найди минимальное окно в s, которое содержит все символы t (включая дубликаты). Если такого окна нет — верни пустую строку. LeetCode #76.',
      requirements: [
        'Принимает две строки s и t',
        'Возвращает минимальную подстроку или ""',
        'Должны присутствовать все символы t с учётом количества',
        'Оптимально: O(|s| + |t|)'
      ],
      expectedOutput: 'Вход: s="ADOBECODEBANC", t="ABC"\nВыход: "BANC"\nВход: s="a", t="a"\nВыход: "a"\nВход: s="a", t="aa"\nВыход: ""',
      hint: 'Расширяй правый указатель пока не покроешь все символы t. Затем сужай левый пока покрытие не нарушится. Отслеживай formed = количество символов удовлетворяющих требованию.',
      solution: 'from collections import Counter\n\ndef minWindow(s, t):\n    if not t or not s:\n        return ""\n\n    need = Counter(t)\n    have = {}\n    formed = 0\n    required = len(need)  # количество уникальных символов в t\n\n    left = 0\n    min_len = float("inf")\n    result = ""\n\n    for right in range(len(s)):\n        c = s[right]\n        have[c] = have.get(c, 0) + 1\n        if c in need and have[c] == need[c]:\n            formed += 1\n\n        # Сужаем окно пока все символы покрыты\n        while formed == required:\n            if right - left + 1 < min_len:\n                min_len = right - left + 1\n                result = s[left:right+1]\n            left_c = s[left]\n            have[left_c] -= 1\n            if left_c in need and have[left_c] < need[left_c]:\n                formed -= 1\n            left += 1\n\n    return result',
      explanation: 'Подход: expand-contract. Расширяем пока не покрыто t, сужаем пока покрыто. formed отслеживает сколько символов из need удовлетворяют требованию по количеству.\nСложность: O(|s| + |t|) по времени, O(|t|) по памяти.\nСовет для интервью: одна из самых сложных sliding window задач. Объясни зачем нужно formed vs. просто сравнивать have == need (O(1) vs. O(m) на каждом шаге).'
    },
    {
      id: 6,
      title: 'Максимальная сумма подмассива размера K',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив nums и число k. Найди максимальную сумму подмассива ровно из k элементов.',
      requirements: [
        'Принимает список чисел и k',
        'Возвращает максимальную сумму',
        'Подмассив непрерывный',
        'O(n) решение через скользящее окно'
      ],
      expectedOutput: 'Вход: nums=[2,1,5,1,3,2], k=3\nВыход: 9 ([5,1,3])\nВход: nums=[2,3,4,1,5], k=2\nВыход: 7 ([3,4])',
      hint: 'Вычисли сумму первых k элементов. Затем "скользи" окном: добавляй следующий элемент и убирай первый. Отслеживай максимум.',
      solution: 'def maxSumSubarrayOfSizeK(nums, k):\n    if len(nums) < k:\n        return 0\n\n    # Сумма первого окна\n    window_sum = sum(nums[:k])\n    max_sum = window_sum\n\n    # Скользим окно\n    for i in range(k, len(nums)):\n        window_sum += nums[i] - nums[i - k]\n        max_sum = max(max_sum, window_sum)\n\n    return max_sum',
      explanation: 'Подход: фиксированное окно. Вместо пересчёта суммы каждый раз — добавляем новый элемент и убираем вышедший.\nСложность: O(n) по времени, O(1) по памяти.\nСовет для интервью: это базовый паттерн скользящего окна фиксированного размера. Все более сложные задачи (K Largest, Minimum Window) строятся на этой идее.'
    },
    {
      id: 7,
      title: 'Корзина с фруктами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Есть ряд деревьев, каждое приносит один вид фруктов. У тебя две корзины. Начни с любого дерева и иди вправо. В каждую корзину можно класть только один вид фрукта. Найди максимальное количество фруктов которое можно собрать. LeetCode #904.',
      requirements: [
        'Принимает список целых чисел (типы фруктов)',
        'Возвращает максимальное количество фруктов',
        'Не более 2 разных видов одновременно',
        'Подмассив должен быть непрерывным'
      ],
      expectedOutput: 'Вход: fruits=[1,2,1]\nВыход: 3\nВход: fruits=[0,1,2,2]\nВыход: 3 ([1,2,2])\nВход: fruits=[1,2,3,2,2]\nВыход: 4 ([2,3,2,2])',
      hint: 'Скользящее окно с dict. Поддерживай словарь {вид: количество}. Если в словаре > 2 видов — сдвигай left пока не останется 2. Максимум длины окна — ответ.',
      solution: 'from collections import defaultdict\n\ndef totalFruit(fruits):\n    basket = defaultdict(int)  # вид -> количество\n    left = 0\n    max_fruits = 0\n\n    for right in range(len(fruits)):\n        basket[fruits[right]] += 1\n\n        while len(basket) > 2:\n            basket[fruits[left]] -= 1\n            if basket[fruits[left]] == 0:\n                del basket[fruits[left]]\n            left += 1\n\n        max_fruits = max(max_fruits, right - left + 1)\n\n    return max_fruits',
      explanation: 'Подход: sliding window с переменным размером. Словарь хранит текущие виды фруктов в окне. При > 2 видах — сужаем с левого конца.\nЭта задача эквивалентна "Longest Substring with at Most 2 Distinct Characters".\nСложность: O(n) по времени, O(1) памяти (не более 3 ключей в словаре).\nСовет для интервью: обобщение: "at most K distinct characters" — тот же паттерн с k вместо 2.'
    },
    {
      id: 8,
      title: 'Минимальный подмассив с суммой >= target',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums из положительных чисел и target. Найди минимальную длину подмассива с суммой >= target. Если такого нет — верни 0. LeetCode #209.',
      requirements: [
        'Принимает список положительных чисел и target',
        'Возвращает минимальную длину или 0',
        'Подмассив непрерывный',
        'O(n) решение через скользящее окно'
      ],
      expectedOutput: 'Вход: target=7, nums=[2,3,1,2,4,3]\nВыход: 2 ([4,3])\nВход: target=4, nums=[1,4,4]\nВыход: 1\nВход: target=11, nums=[1,1,1,1,1,1,1,1]\nВыход: 0',
      hint: 'Expand-contract. Добавляй элементы справа пока сумма < target. Как только сумма >= target — попробуй сузить слева, обновляй минимальную длину.',
      solution: 'def minSubArrayLen(target, nums):\n    left = 0\n    current_sum = 0\n    min_len = float("inf")\n\n    for right in range(len(nums)):\n        current_sum += nums[right]\n\n        while current_sum >= target:\n            min_len = min(min_len, right - left + 1)\n            current_sum -= nums[left]\n            left += 1\n\n    return min_len if min_len != float("inf") else 0\n\n# O(n log n) вариант через prefix sums + binary search\ndef minSubArrayLenBS(target, nums):\n    import bisect\n    n = len(nums)\n    prefix = [0] * (n + 1)\n    for i in range(n):\n        prefix[i+1] = prefix[i] + nums[i]\n    min_len = float("inf")\n    for i in range(1, n+1):\n        need = prefix[i] - target  # нам нужен prefix[j] >= need\n        j = bisect.bisect_left(prefix, need, 0, i)\n        if j < i:\n            min_len = min(min_len, i - j)\n    return min_len if min_len != float("inf") else 0',
      explanation: 'Подход: все числа положительные — сумма монотонна при расширении и убывает при сужении. Это гарантирует корректность sliding window.\nСложность: O(n) sliding window, O(n log n) binary search на prefix sums.\nСовет для интервью: ключевое условие для sliding window — положительные числа. Если могут быть отрицательные — нужен другой подход (например deque с монотонным стеком).'
    }
  ]
}
