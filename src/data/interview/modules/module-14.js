export default {
  id: 14,
  title: 'Coding: хеш-таблицы',
  description: 'Топ-8 задач на хеш-таблицы с полными решениями на Python. От простого Two Sum до LRU Cache и Minimum Window Substring.',
  lessons: [
    {
      id: 1,
      type: 'practice',
      title: 'Two Sum — HashMap подход',
      difficulty: 'easy',
      description: 'Классическая Two Sum, но с акцентом на детальный разбор HashMap подхода. Дан массив nums и target. Верните индексы двух чисел с суммой target. Решение за O(n).',
      requirements: [
        'Входные данные: nums = [2, 7, 11, 15], target = 9',
        'Выходные данные: [0, 1]',
        'Один проход по массиву — не два',
        'Объяснить почему храним complement, а не сам элемент',
        'Обработать случай: nums = [3, 3], target = 6 → [0, 1]'
      ],
      expectedOutput: '[0, 1]\n[0, 1]',
      hint: 'Для nums[i] = 2, target = 9: complement = 9 - 2 = 7. Нам нужно найти 7 позже. Поэтому сохраняем {2: 0} — "видели 2 на индексе 0". Когда встретим 7 — найдём 2 в словаре.',
      solution: 'def two_sum(nums, target):\n    # seen: {значение: индекс}\n    seen = {}\n\n    for i, num in enumerate(nums):\n        complement = target - num\n\n        if complement in seen:\n            # Нашли пару!\n            return [seen[complement], i]\n\n        # Не нашли — добавляем текущий\n        seen[num] = i\n\n    return []  # Гарантированно не достигнем\n\n# Тест\nprint(two_sum([2, 7, 11, 15], 9))   # [0, 1]\nprint(two_sum([3, 3], 6))            # [0, 1] — дубли обрабатываются корректно',
      explanation: 'Временная сложность: O(n) — один проход. Пространственная сложность: O(n) — словарь до n элементов. Почему храним значение -> индекс (а не наоборот): нам нужно быстро ответить "есть ли complement в виденных числах, и где?" Ключ в словаре = число, значение = его индекс. Случай с дублями [3,3]: когда обрабатываем второй 3, complement=3 уже есть в seen с индексом 0 — корректно возвращаем [0,1].'
    },
    {
      id: 2,
      type: 'practice',
      title: 'Valid Sudoku',
      difficulty: 'medium',
      description: 'Дана доска Судоку 9x9. Определите, является ли она валидной. Правила: каждая строка содержит цифры 1-9 без повторений, каждый столбец — без повторений, каждый блок 3x3 — без повторений. Пустые клетки обозначены ".".',
      requirements: [
        'Проверить 9 строк, 9 столбцов, 9 блоков 3x3',
        'Пустые клетки ("." ) не проверяются',
        'Использовать sets для отслеживания виденных чисел',
        'Определить блок по формуле: (row//3, col//3)',
        'Один проход по всей доске O(81) = O(1)'
      ],
      expectedOutput: 'True\nFalse',
      hint: 'Храни три словаря sets: rows[i], cols[j], boxes[(i//3, j//3)]. Для каждой ячейки проверяй, не встречалось ли число в соответствующей строке, столбце и блоке.',
      solution: 'def is_valid_sudoku(board):\n    rows = [set() for _ in range(9)]\n    cols = [set() for _ in range(9)]\n    boxes = [[set() for _ in range(3)] for _ in range(3)]\n\n    for r in range(9):\n        for c in range(9):\n            val = board[r][c]\n            if val == ".":\n                continue\n\n            # Проверка строки\n            if val in rows[r]:\n                return False\n            rows[r].add(val)\n\n            # Проверка столбца\n            if val in cols[c]:\n                return False\n            cols[c].add(val)\n\n            # Проверка блока 3x3\n            box_r, box_c = r // 3, c // 3\n            if val in boxes[box_r][box_c]:\n                return False\n            boxes[box_r][box_c].add(val)\n\n    return True\n\n# Тест\nboard = [\n    ["5","3",".",".","7",".",".",".","."],\n    ["6",".",".","1","9","5",".",".","."],\n    [".","9","8",".",".",".",".","6","."],\n    ["8",".",".",".","6",".",".",".","3"],\n    ["4",".",".","8",".","3",".",".","1"],\n    ["7",".",".",".","2",".",".",".","6"],\n    [".","6",".",".",".",".","2","8","."],\n    [".",".",".","4","1","9",".",".","5"],\n    [".",".",".",".","8",".",".","7","9"]\n]\nprint(is_valid_sudoku(board))  # True',
      explanation: 'Временная сложность: O(81) = O(1) — фиксированный размер доски 9x9. Пространственная сложность: O(81) = O(1). Ключевой трюк: определение блока 3x3 через целочисленное деление (row//3, col//3). Блоки нумеруются (0,0), (0,1), (0,2), (1,0)... (2,2). Три независимых set на строку, столбец и блок — классический подход для подобных grid-задач.'
    },
    {
      id: 3,
      type: 'practice',
      title: 'Longest Consecutive Sequence',
      difficulty: 'medium',
      description: 'Дан неупорядоченный массив целых чисел nums. Найдите длину самой длинной последовательности подряд идущих чисел (например, 1,2,3,4). Решение за O(n).',
      requirements: [
        'Входные данные: nums = [100, 4, 200, 1, 3, 2]',
        'Выходные данные: 4 (последовательность 1, 2, 3, 4)',
        'Решение за O(n) — НЕ сортировать (это O(n log n))',
        'Использовать set для O(1) lookup',
        'Начинать подсчёт только от начала последовательности'
      ],
      expectedOutput: '4\n9',
      hint: 'Добавь все числа в set. Для каждого числа num проверь: если num-1 НЕТ в set, то num — начало новой последовательности. Тогда считай длину: num+1, num+2, ... пока есть в set.',
      solution: 'def longest_consecutive(nums):\n    num_set = set(nums)\n    max_len = 0\n\n    for num in num_set:\n        # Начинаем счёт только от начала последовательности\n        if num - 1 not in num_set:\n            curr_num = num\n            curr_len = 1\n\n            while curr_num + 1 in num_set:\n                curr_num += 1\n                curr_len += 1\n\n            max_len = max(max_len, curr_len)\n\n    return max_len\n\n# Тест\nprint(longest_consecutive([100, 4, 200, 1, 3, 2]))   # 4\nprint(longest_consecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]))  # 9',
      explanation: 'Временная сложность: O(n) — несмотря на вложенный while, каждое число посещается не более двух раз. Пространственная сложность: O(n) — set хранит все числа. Ключевая идея: проверяем num-1 NOT in set — это гарантирует, что мы начинаем счёт только с начала последовательности. Если бы начинали с каждого числа — было бы O(n^2). Паттерн: "start only from the beginning" для избежания лишних вычислений.'
    },
    {
      id: 4,
      type: 'practice',
      title: 'Top K Frequent Elements',
      difficulty: 'medium',
      description: 'Дан массив nums и число k. Верните k наиболее часто встречающихся элементов. Порядок ответа не важен. Решение за O(n log n) или O(n) с bucket sort.',
      requirements: [
        'Входные данные: nums = [1,1,1,2,2,3], k = 2',
        'Выходные данные: [1, 2]',
        'Подход 1: Counter + heapq.nlargest — O(n log k)',
        'Подход 2: Bucket sort — O(n)',
        'Объяснить оба подхода и их trade-offs'
      ],
      expectedOutput: '[1, 2]\n[1]',
      hint: 'Подход bucket sort: создай массив buckets длиной n+1, где buckets[freq] — список чисел с такой частотой. Заполни bucket, затем пройди с конца (от наибольшей частоты) и собери k элементов.',
      solution: 'from collections import Counter\nimport heapq\n\n# Подход 1: Counter + heap, O(n log k)\ndef top_k_frequent_v1(nums, k):\n    count = Counter(nums)\n    return heapq.nlargest(k, count.keys(), key=count.get)\n\n# Подход 2: Bucket sort, O(n)\ndef top_k_frequent_v2(nums, k):\n    count = Counter(nums)\n    # buckets[i] = список элементов с частотой i\n    buckets = [[] for _ in range(len(nums) + 1)]\n\n    for num, freq in count.items():\n        buckets[freq].append(num)\n\n    result = []\n    # Идём с конца (наибольшая частота первая)\n    for freq in range(len(buckets) - 1, 0, -1):\n        for num in buckets[freq]:\n            result.append(num)\n            if len(result) == k:\n                return result\n\n    return result\n\n# Тест\nprint(top_k_frequent_v1([1,1,1,2,2,3], 2))  # [1, 2]\nprint(top_k_frequent_v2([1,1,1,2,2,3], 2))  # [1, 2]\nprint(top_k_frequent_v1([1], 1))             # [1]',
      explanation: 'Подход 1 (heap): O(n log k) — Counter за O(n), heapq.nlargest за O(n log k). Удобен и читаем. Подход 2 (bucket sort): O(n) — максимальная частота не может превысить n, поэтому buckets имеет фиксированный размер n+1. Идём с конца для получения топ элементов. Это пример где O(n) достигается за счёт знания о диапазоне значений. На интервью: сначала предложи heap подход, потом скажи "есть способ сделать за O(n) через bucket sort".'
    },
    {
      id: 5,
      type: 'practice',
      title: 'Encode and Decode Strings',
      difficulty: 'medium',
      description: 'Реализуйте два метода: encode(strs) превращает список строк в одну строку, decode(s) обратно преобразует в список строк. Решение должно работать для строк с любыми символами включая разделители.',
      requirements: [
        'Входные данные encode: ["lint","code","love","you"]',
        'Выходные данные encode: некая строка, декодируемая обратно',
        'decode(encode(strs)) должен вернуть исходный список',
        'Работать со строками содержащими любые символы',
        'Использовать length-prefix формат: "4#lint4#code..."'
      ],
      expectedOutput: '["lint", "code", "love", "you"]\n["we", "say", ":", "yes"]',
      hint: 'Для каждой строки запиши её длину, затем разделитель "#", затем саму строку. Например: "4#lint". При декодировании читай число до "#", затем считывай ровно столько символов.',
      solution: 'class Codec:\n    def encode(self, strs):\n        """Кодирует список строк в одну строку.\n        Формат: <длина>#<строка><длина>#<строка>...\n        """\n        result = ""\n        for s in strs:\n            result += str(len(s)) + "#" + s\n        return result\n\n    def decode(self, s):\n        """Декодирует строку обратно в список.\"\"\"\n        result = []\n        i = 0\n        while i < len(s):\n            # Находим позицию разделителя #\n            j = i\n            while s[j] != "#":\n                j += 1\n            # Читаем длину\n            length = int(s[i:j])\n            # Читаем строку\n            result.append(s[j + 1 : j + 1 + length])\n            # Переходим к следующей записи\n            i = j + 1 + length\n        return result\n\n# Тест\ncodec = Codec()\nwords = ["lint", "code", "love", "you"]\nencoded = codec.encode(words)\nprint(codec.decode(encoded))  # ["lint", "code", "love", "you"]\n\ntricky = ["we", "say", ":", "yes"]\nprint(codec.decode(codec.encode(tricky)))  # работает со спецсимволами',
      explanation: 'Временная сложность: O(n) для encode и decode где n — суммарная длина всех строк. Пространственная сложность: O(n). Формат length-prefix (chunked encoding) используется в реальных протоколах (HTTP/2, протоколы gRPC). Почему не просто разделитель? Разделитель может быть частью строки. Length prefix надёжен всегда. Это паттерн сериализации данных.'
    },
    {
      id: 6,
      type: 'practice',
      title: 'Subarray Sum Equals K',
      difficulty: 'medium',
      description: 'Дан массив целых чисел nums и число k. Верните количество непрерывных подмассивов с суммой равной k. Числа могут быть отрицательными.',
      requirements: [
        'Входные данные: nums = [1, 1, 1], k = 2',
        'Выходные данные: 2',
        'Числа могут быть отрицательными — скользящее окно НЕ работает',
        'Использовать prefix sum + hash map',
        'Объяснить математику: sum[i..j] = prefix[j] - prefix[i-1]'
      ],
      expectedOutput: '2\n2',
      hint: 'Веди текущую prefix sum. Для каждого i: если prefix_sum - k уже встречалось раньше, то подмассив от той позиции до i имеет сумму k. Храни в словаре сколько раз встречалась каждая prefix sum.',
      solution: 'from collections import defaultdict\n\ndef subarray_sum(nums, k):\n    count = 0\n    prefix_sum = 0\n    # prefix_count[s] = сколько раз встречалась prefix sum s\n    prefix_count = defaultdict(int)\n    prefix_count[0] = 1  # Пустой префикс (важно!)\n\n    for num in nums:\n        prefix_sum += num\n        # Если prefix_sum - k встречалась раньше,\n        # то подмассив от той точки до сюда имеет сумму k\n        count += prefix_count[prefix_sum - k]\n        prefix_count[prefix_sum] += 1\n\n    return count\n\n# Тест\nprint(subarray_sum([1, 1, 1], 2))         # 2\nprint(subarray_sum([1, 2, 3], 3))         # 2 ([1,2] и [3])',
      explanation: 'Временная сложность: O(n). Пространственная сложность: O(n). Математика: sum(i..j) = prefix[j+1] - prefix[i]. Если prefix[j+1] - prefix[i] == k, то prefix[i] == prefix[j+1] - k. Поэтому для каждой позиции j проверяем: сколько раз встречалась prefix sum = current_sum - k? Инициализация prefix_count[0] = 1 критически важна — учитывает подмассивы с начала массива. Паттерн prefix sum + hash map используется во многих задачах с подмассивами.'
    },
    {
      id: 7,
      type: 'practice',
      title: 'LRU Cache',
      difficulty: 'hard',
      description: 'Реализуйте структуру данных LRU (Least Recently Used) Cache с фиксированной ёмкостью. Методы: get(key) — O(1), put(key, value) — O(1). При достижении ёмкости вытеснять наименее недавно использованный элемент.',
      requirements: [
        'LRUCache(capacity): инициализация с максимальным размером',
        'get(key): вернуть значение или -1 если нет. Обновить "недавнесть"',
        'put(key, value): добавить/обновить. При превышении ёмкости — удалить LRU',
        'Оба метода за O(1)',
        'Использовать OrderedDict или doubly linked list + hash map'
      ],
      expectedOutput: '1\n-1\n-1\n3',
      hint: 'OrderedDict в Python помнит порядок вставки и позволяет move_to_end(). Используй: get — move_to_end, put — добавь и move_to_end, при переполнении — popitem(last=False) удаляет самый старый.',
      solution: 'from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.cache = OrderedDict()\n\n    def get(self, key):\n        if key not in self.cache:\n            return -1\n        # Переместить в конец (самый недавний)\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key, value):\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            # Удалить самый старый (first=True -> LRU)\n            self.cache.popitem(last=False)\n\n# Тест\nlru = LRUCache(2)\nlru.put(1, 1)\nlru.put(2, 2)\nprint(lru.get(1))    # 1 (теперь [2,1] — 1 недавний)\nlru.put(3, 3)        # вытесняет 2 (LRU)\nprint(lru.get(2))    # -1\nlru.put(4, 4)        # вытесняет 1 (LRU)\nprint(lru.get(1))    # -1\nprint(lru.get(3))    # 3',
      explanation: 'Временная сложность: O(1) для get и put. Пространственная сложность: O(capacity). OrderedDict — это hash map + doubly linked list под капотом. move_to_end — O(1). popitem(last=False) — удаляет самый старый (front). Классическая реализация без OrderedDict: doubly linked list (для O(1) удаления) + hash map (для O(1) lookup). LRU Cache — частая задача на Meta, Google, Amazon. Понимание структуры важнее запоминания кода.'
    },
    {
      id: 8,
      type: 'practice',
      title: 'Minimum Window Substring',
      difficulty: 'hard',
      description: 'Даны строки s и t. Найдите минимальную подстроку s, которая содержит все символы t (с учётом повторений). Если такой нет — вернуть пустую строку.',
      requirements: [
        'Входные данные: s = "ADOBECODEBANC", t = "ABC"',
        'Выходные данные: "BANC"',
        'Решение за O(n + m) — sliding window',
        'Учитывать дубликаты в t: t = "AA" требует два A в окне',
        'Отслеживать сколько символов t "покрыто" окном'
      ],
      expectedOutput: '"BANC"\n"a"\n""',
      hint: 'Используй два словаря: need (сколько каждого символа нужно из t) и window (сколько в текущем окне). Переменная have = сколько символов удовлетворены, need_count = len(уникальных символов в t). Расширяй right, сужай left когда have == need_count.',
      solution: 'from collections import Counter\n\ndef min_window(s, t):\n    if not t or not s:\n        return ""\n\n    need = Counter(t)    # {char: нужное количество}\n    window = {}          # {char: текущее количество в окне}\n\n    have = 0             # символов t, которые покрыты окном\n    need_count = len(need)  # уникальных символов нужно покрыть\n\n    result = ""\n    min_len = float("inf")\n    left = 0\n\n    for right, char in enumerate(s):\n        # Расширяем окно\n        window[char] = window.get(char, 0) + 1\n        # Проверяем, покрыт ли этот символ\n        if char in need and window[char] == need[char]:\n            have += 1\n\n        # Сужаем окно пока все символы покрыты\n        while have == need_count:\n            # Обновляем минимальное окно\n            if right - left + 1 < min_len:\n                min_len = right - left + 1\n                result = s[left:right + 1]\n\n            # Убираем левый символ\n            left_char = s[left]\n            window[left_char] -= 1\n            if left_char in need and window[left_char] < need[left_char]:\n                have -= 1\n            left += 1\n\n    return result\n\n# Тест\nprint(min_window("ADOBECODEBANC", "ABC"))  # "BANC"\nprint(min_window("a", "a"))               # "a"\nprint(min_window("a", "aa"))              # ""',
      explanation: 'Временная сложность: O(n + m) где n = len(s), m = len(t). Каждый символ s обрабатывается не более двух раз (enter/leave window). Пространственная сложность: O(m) для need и window. Ключевая идея: have/need_count отслеживают "покрытие" без итерации по словарю. have растёт только когда window[char] == need[char] (достигли нужного количества). Это одна из самых сложных sliding window задач — типичный Hard на FAANG интервью.'
    }
  ]
}
