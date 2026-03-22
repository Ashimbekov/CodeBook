export default {
  id: 13,
  title: 'Coding: массивы и строки',
  description: 'Топ-10 задач на массивы и строки с полными решениями на Python, анализом сложности и советами для интервью. От Easy до Hard, прогрессивная сложность.',
  lessons: [
    {
      id: 1,
      type: 'practice',
      title: 'Two Sum',
      difficulty: 'easy',
      description: 'Дан массив целых чисел nums и число target. Верните индексы двух чисел, сумма которых равна target. Гарантируется, что решение существует. Каждый элемент может использоваться только один раз.',
      requirements: [
        'Входные данные: nums = [2, 7, 11, 15], target = 9',
        'Выходные данные: [0, 1] (nums[0] + nums[1] == 9)',
        'Решение должно работать за O(n) — не O(n^2)',
        'Использовать хеш-таблицу для хранения complement',
        'Вернуть именно индексы, а не значения'
      ],
      expectedOutput: '[0, 1]\n[1, 2]',
      hint: 'Для каждого числа вычисли complement = target - num. Проверь, есть ли complement в словаре. Если нет — добавь текущий элемент в словарь.',
      solution: 'def two_sum(nums, target):\n    seen = {}  # value -> index\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n\n# Тест\nprint(two_sum([2, 7, 11, 15], 9))   # [0, 1]\nprint(two_sum([3, 2, 4], 6))        # [1, 2]',
      explanation: 'Временная сложность: O(n) — один проход по массиву. Пространственная сложность: O(n) — хеш-таблица может хранить до n элементов. Ключевая идея: вместо перебора всех пар (O(n^2)) мы используем словарь, чтобы за O(1) проверять, существует ли complement. На интервью: сначала скажи brute force O(n^2), потом предложи оптимизацию через hash map.'
    },
    {
      id: 2,
      type: 'practice',
      title: 'Best Time to Buy and Sell Stock',
      difficulty: 'easy',
      description: 'Дан массив prices, где prices[i] — цена акции в день i. Найдите максимальную прибыль от одной покупки и одной продажи. Продажа должна быть после покупки. Если прибыли нет — вернуть 0.',
      requirements: [
        'Входные данные: prices = [7, 1, 5, 3, 6, 4]',
        'Выходные данные: 5 (купить на день 1 за 1, продать на день 4 за 6)',
        'Только одна транзакция (купить и продать один раз)',
        'Решение за O(n) времени и O(1) памяти',
        'Если прибыли нет — вернуть 0'
      ],
      expectedOutput: '5\n0',
      hint: 'Следи за минимальной ценой покупки до текущего дня. Для каждого дня вычисляй прибыль как prices[i] - min_price. Обновляй максимальную прибыль.',
      solution: 'def max_profit(prices):\n    min_price = float("inf")\n    max_profit = 0\n\n    for price in prices:\n        if price < min_price:\n            min_price = price\n        elif price - min_price > max_profit:\n            max_profit = price - min_price\n\n    return max_profit\n\n# Тест\nprint(max_profit([7, 1, 5, 3, 6, 4]))  # 5\nprint(max_profit([7, 6, 4, 3, 1]))      # 0 (цены падают)',
      explanation: 'Временная сложность: O(n) — один проход. Пространственная сложность: O(1) — только две переменные. Паттерн: "sliding window minimum" — держим минимум слева, обновляем максимальную разницу. Частая ловушка: купить нельзя после продажи, поэтому нельзя просто брать глобальный min и max — min должен быть до max по индексу. Этот паттерн решает именно это требование.'
    },
    {
      id: 3,
      type: 'practice',
      title: 'Contains Duplicate',
      difficulty: 'easy',
      description: 'Дан массив целых чисел nums. Верните true, если в массиве есть хотя бы одно повторяющееся значение. Верните false, если все элементы уникальны.',
      requirements: [
        'Входные данные: nums = [1, 2, 3, 1]',
        'Выходные данные: true',
        'Решение за O(n) времени',
        'Рассмотреть решение через set и через sort',
        'Объяснить trade-off между вариантами'
      ],
      expectedOutput: 'True\nFalse',
      hint: 'Используй set для отслеживания уже виденных элементов. Если текущий элемент уже в set — найден дубль.',
      solution: 'def contains_duplicate(nums):\n    seen = set()\n    for num in nums:\n        if num in seen:\n            return True\n        seen.add(num)\n    return False\n\n# Или однострочно:\ndef contains_duplicate_v2(nums):\n    return len(nums) != len(set(nums))\n\n# Тест\nprint(contains_duplicate([1, 2, 3, 1]))     # True\nprint(contains_duplicate([1, 2, 3, 4]))     # False',
      explanation: 'Версия с циклом: O(n) время, O(n) память — останавливается при первом дубле. Версия с set(nums): O(n) время, O(n) память — но всегда обходит весь массив. Альтернатива: отсортировать O(n log n) и сравнить соседей O(n), тогда память O(1). Trade-off: скорость vs. память. На интервью упомяни оба подхода и объясни, когда какой предпочтительнее.'
    },
    {
      id: 4,
      type: 'practice',
      title: 'Product of Array Except Self',
      difficulty: 'medium',
      description: 'Дан массив nums. Верните массив answer, где answer[i] равен произведению всех элементов nums КРОМЕ nums[i]. Решение за O(n) БЕЗ деления. Пространственная сложность O(1) не считая выходного массива.',
      requirements: [
        'Входные данные: nums = [1, 2, 3, 4]',
        'Выходные данные: [24, 12, 8, 6]',
        'Нельзя использовать операцию деления',
        'Временная сложность O(n)',
        'Подсказка: два прохода — prefix и suffix произведения'
      ],
      expectedOutput: '[24, 12, 8, 6]\n[0, 0, 9, 0, 0]',
      hint: 'Для каждого i нужно произведение всех элементов слева и всех справа. Первый проход: накапливай prefix-произведение слева направо. Второй проход: накапливай suffix-произведение справа налево.',
      solution: 'def product_except_self(nums):\n    n = len(nums)\n    result = [1] * n\n\n    # Первый проход: prefix произведение слева\n    # result[i] = произведение nums[0..i-1]\n    prefix = 1\n    for i in range(n):\n        result[i] = prefix\n        prefix *= nums[i]\n\n    # Второй проход: умножаем на suffix произведение справа\n    suffix = 1\n    for i in range(n - 1, -1, -1):\n        result[i] *= suffix\n        suffix *= nums[i]\n\n    return result\n\n# Тест\nprint(product_except_self([1, 2, 3, 4]))       # [24, 12, 8, 6]\nprint(product_except_self([-1, 1, 0, -3, 3]))  # [0, 0, 9, 0, 0]',
      explanation: 'Временная сложность: O(n) — два линейных прохода. Пространственная сложность: O(1) не считая результирующего массива. Ключевая идея: answer[i] = (произведение всего слева от i) * (произведение всего справа от i). Первый проход считает "слева", второй — умножает на "справа". Это классическая задача на два указателя / два прохода. Часто спрашивают на Amazon и Google.'
    },
    {
      id: 5,
      type: 'practice',
      title: 'Maximum Subarray (Kadane\'s Algorithm)',
      difficulty: 'medium',
      description: 'Дан массив целых чисел nums. Найдите подмассив с максимальной суммой и верните эту сумму. Подмассив — это непрерывная часть массива (минимум один элемент).',
      requirements: [
        'Входные данные: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        'Выходные данные: 6 (подмассив [4, -1, 2, 1])',
        'Решение за O(n) — алгоритм Кадане',
        'Обработать случай когда все числа отрицательные',
        'Объяснить логику: когда начинать новый подмассив'
      ],
      expectedOutput: '6\n1',
      hint: 'Для каждого элемента реши: продолжать текущий подмассив (curr_sum + num) или начать новый с этого элемента (num). Выбери максимум. Это и есть алгоритм Кадане.',
      solution: 'def max_subarray(nums):\n    curr_sum = nums[0]\n    max_sum = nums[0]\n\n    for num in nums[1:]:\n        # Продолжить текущий подмассив или начать новый?\n        curr_sum = max(num, curr_sum + num)\n        max_sum = max(max_sum, curr_sum)\n\n    return max_sum\n\n# Тест\nprint(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # 6\nprint(max_subarray([1]))                                # 1\nprint(max_subarray([-1, -2, -3]))                       # -1 (все отрицательные)',
      explanation: 'Временная сложность: O(n). Пространственная сложность: O(1). Алгоритм Кадане: в каждой точке делаем жадный выбор — если curr_sum + num < num, то предыдущий подмассив тянет нас вниз, лучше начать заново с num. Обработка всех отрицательных: инициализируем curr_sum и max_sum первым элементом (а не 0), иначе вернём 0 вместо максимального отрицательного. Это одна из классических DP/Greedy задач.'
    },
    {
      id: 6,
      type: 'practice',
      title: '3Sum',
      difficulty: 'medium',
      description: 'Дан массив nums. Найдите все уникальные тройки [nums[i], nums[j], nums[k]] такие, что i != j != k и nums[i] + nums[j] + nums[k] == 0. Ответ не должен содержать дубликатов.',
      requirements: [
        'Входные данные: nums = [-1, 0, 1, 2, -1, -4]',
        'Выходные данные: [[-1, -1, 2], [-1, 0, 1]]',
        'Решение за O(n^2) — сортировка + два указателя',
        'Дубликаты в ответе недопустимы',
        'Объяснить, как пропускаются дубликаты'
      ],
      expectedOutput: '[[-1, -1, 2], [-1, 0, 1]]\n[]',
      hint: 'Отсортируй массив. Для каждого элемента nums[i] используй два указателя left и right для поиска пары. Пропускай дубликаты: если nums[i] == nums[i-1] — пропусти. Аналогично для left и right.',
      solution: 'def three_sum(nums):\n    nums.sort()\n    result = []\n\n    for i in range(len(nums) - 2):\n        # Пропускаем дубликаты для первого элемента\n        if i > 0 and nums[i] == nums[i - 1]:\n            continue\n        # Оптимизация: если минимальная сумма > 0, дальше нет смысла\n        if nums[i] > 0:\n            break\n\n        left, right = i + 1, len(nums) - 1\n        while left < right:\n            total = nums[i] + nums[left] + nums[right]\n            if total == 0:\n                result.append([nums[i], nums[left], nums[right]])\n                # Пропускаем дубликаты для left и right\n                while left < right and nums[left] == nums[left + 1]:\n                    left += 1\n                while left < right and nums[right] == nums[right - 1]:\n                    right -= 1\n                left += 1\n                right -= 1\n            elif total < 0:\n                left += 1\n            else:\n                right -= 1\n\n    return result\n\n# Тест\nprint(three_sum([-1, 0, 1, 2, -1, -4]))  # [[-1, -1, 2], [-1, 0, 1]]\nprint(three_sum([0, 1, 1]))               # []',
      explanation: 'Временная сложность: O(n^2) — сортировка O(n log n) + вложенные циклы O(n^2). Пространственная сложность: O(1) не считая вывода. Паттерн: Fix one element + Two Pointers — сортируем и для каждого элемента используем классический two-sum с двумя указателями. Дубликаты убираем пропуском одинаковых значений после нахождения ответа. Это паттерн, который переиспользуется в 4Sum и других задачах.'
    },
    {
      id: 7,
      type: 'practice',
      title: 'Container With Most Water',
      difficulty: 'medium',
      description: 'Дан массив height длины n. Найдите два столбика, которые вместе с горизонтальной осью образуют контейнер с максимальным количеством воды. Верните максимальный объём воды.',
      requirements: [
        'Входные данные: height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
        'Выходные данные: 49 (между индексами 1 и 8)',
        'Объём = min(height[l], height[r]) * (r - l)',
        'Решение за O(n) с двумя указателями',
        'Объяснить жадный выбор: какой указатель двигать'
      ],
      expectedOutput: '49\n1',
      hint: 'Начни с двух указателей на концах. Объём ограничен меньшим из двух столбиков. Двигай указатель у более короткого столбика — у более длинного объём только уменьшится при любом перемещении.',
      solution: 'def max_area(height):\n    left, right = 0, len(height) - 1\n    max_water = 0\n\n    while left < right:\n        # Объём = ширина * высота (ограничена меньшим)\n        water = (right - left) * min(height[left], height[right])\n        max_water = max(max_water, water)\n\n        # Двигаем указатель у более короткого столбика\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n\n    return max_water\n\n# Тест\nprint(max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]))  # 49\nprint(max_area([1, 1]))                         # 1',
      explanation: 'Временная сложность: O(n). Пространственная сложность: O(1). Жадный выбор: если мы двигаем более высокий столбик, ширина уменьшается, а высота ограничена тем же или меньшим значением — объём точно не вырастет. Поэтому всегда двигаем более короткий — у него есть шанс найти более высокий партнёр. Классический паттерн two pointers с жадным выбором направления.'
    },
    {
      id: 8,
      type: 'practice',
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'medium',
      description: 'Дана строка s. Найдите длину самой длинной подстроки без повторяющихся символов.',
      requirements: [
        'Входные данные: s = "abcabcbb"',
        'Выходные данные: 3 (подстрока "abc")',
        'Решение за O(n) — sliding window',
        'Использовать хеш-таблицу или set',
        'Правильно обрабатывать пустую строку'
      ],
      expectedOutput: '3\n1\n0',
      hint: 'Используй скользящее окно [left, right]. Расширяй окно вправо. Если символ уже в окне — сдвигай left вправо, пока не уберёшь дубль. Следи за максимальной длиной окна.',
      solution: 'def length_of_longest_substring(s):\n    char_index = {}  # символ -> последний встреченный индекс\n    left = 0\n    max_len = 0\n\n    for right, char in enumerate(s):\n        # Если символ уже в окне, двигаем left вправо\n        if char in char_index and char_index[char] >= left:\n            left = char_index[char] + 1\n        char_index[char] = right\n        max_len = max(max_len, right - left + 1)\n\n    return max_len\n\n# Тест\nprint(length_of_longest_substring("abcabcbb"))  # 3\nprint(length_of_longest_substring("bbbbb"))     # 1\nprint(length_of_longest_substring(""))          # 0',
      explanation: 'Временная сложность: O(n) — каждый символ посещается не более двух раз. Пространственная сложность: O(min(m, n)) где m — размер алфавита. Паттерн: Sliding Window с словарём. Ключевая деталь: храним последний индекс символа, а не просто факт присутствия. Это позволяет прыгнуть left сразу на нужную позицию вместо медленного сдвига по одному. Условие char_index[char] >= left важно — символ мог встречаться, но до текущего окна.'
    },
    {
      id: 9,
      type: 'practice',
      title: 'Valid Anagram',
      difficulty: 'easy',
      description: 'Даны две строки s и t. Верните true если t является анаграммой s. Анаграмма — строка с теми же символами в любом порядке.',
      requirements: [
        'Входные данные: s = "anagram", t = "nagaram"',
        'Выходные данные: true',
        'Решение за O(n) времени и O(1) памяти (алфавит фиксированный)',
        'Рассмотреть случай с unicode символами (follow-up)',
        'Несколько подходов: sort, Counter, массив из 26'
      ],
      expectedOutput: 'True\nFalse',
      hint: 'Если две строки имеют разную длину — не анаграммы. Посчитай частоту каждого символа в s, затем вычти частоту из t. Если все счётчики нулевые — анаграммы.',
      solution: 'def is_anagram(s, t):\n    if len(s) != len(t):\n        return False\n\n    # Подход 1: массив из 26 (только строчные латинские)\n    count = [0] * 26\n    for c in s:\n        count[ord(c) - ord("a")] += 1\n    for c in t:\n        count[ord(c) - ord("a")] -= 1\n    return all(x == 0 for x in count)\n\n# Подход 2: Counter (для unicode)\nfrom collections import Counter\ndef is_anagram_v2(s, t):\n    return Counter(s) == Counter(t)\n\n# Подход 3: sort (O(n log n))\ndef is_anagram_v3(s, t):\n    return sorted(s) == sorted(t)\n\n# Тест\nprint(is_anagram("anagram", "nagaram"))  # True\nprint(is_anagram("rat", "car"))          # False',
      explanation: 'Подход с массивом: O(n) время, O(1) память — размер массива фиксирован (26 букв). Подход с Counter: O(n) время, O(k) память где k — уникальные символы. Counter лучше для unicode (emoji, кириллица). Sort: O(n log n) — самый простой для написания, но медленнее. Follow-up на интервью: "Что если строки содержат unicode?" — тогда массив 26 не работает, нужен Counter или dict.'
    },
    {
      id: 10,
      type: 'practice',
      title: 'Group Anagrams',
      difficulty: 'medium',
      description: 'Дан массив строк strs. Сгруппируй анаграммы вместе. Порядок результата не важен.',
      requirements: [
        'Входные данные: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]',
        'Выходные данные: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]',
        'Решение за O(n * k * log k) где k — длина максимального слова',
        'Использовать sorted строку как ключ хеш-таблицы',
        'Рассмотреть оптимизацию с frequency tuple как ключом'
      ],
      expectedOutput: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]\n[[""]]',
      hint: 'Отсортированная версия строки уникальна для каждой группы анаграмм. "eat", "tea", "ate" — все дают "aet" после сортировки. Используй sorted строку как ключ словаря.',
      solution: 'from collections import defaultdict\n\ndef group_anagrams(strs):\n    anagram_map = defaultdict(list)\n\n    for word in strs:\n        # Ключ: отсортированные символы слова\n        key = tuple(sorted(word))\n        anagram_map[key].append(word)\n\n    return list(anagram_map.values())\n\n# Оптимизированная версия: O(n * k) вместо O(n * k * log k)\ndef group_anagrams_v2(strs):\n    anagram_map = defaultdict(list)\n\n    for word in strs:\n        # Ключ: кортеж частот символов (26 чисел)\n        count = [0] * 26\n        for c in word:\n            count[ord(c) - ord("a")] += 1\n        anagram_map[tuple(count)].append(word)\n\n    return list(anagram_map.values())\n\n# Тест\nprint(group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"]))\nprint(group_anagrams([""]))',
      explanation: 'Подход с sorted: O(n * k * log k) — n слов, каждое сортируется за k log k. Память O(n * k). Подход с frequency tuple: O(n * k) — счётчик за O(k), без сортировки. Оба подхода используют тот же принцип: найти каноническое представление анаграммы — строку, одинаковую для всей группы. Tuple нужен как ключ словаря (list не хешируется в Python). Это паттерн "canonicalization" — привести к стандартной форме для группировки.'
    }
  ]
}
