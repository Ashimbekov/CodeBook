export default {
  id: 36,
  title: 'Практикум: Medium задачи (топ-20)',
  description: 'Топ-10 Medium задач LeetCode: 3Sum, Longest Substring, LRU Cache, Course Schedule и другие. Python решения с детальными объяснениями.',
  lessons: [
    {
      id: 1,
      title: '3Sum — три числа с нулевой суммой',
      type: 'practice',
      description: 'Найти все уникальные тройки с суммой 0. Сортировка + два указателя: фиксируем i, сжимаем left/right. Пропуск дубликатов. O(n²) время, O(1) доп. память.',
      solution: 'def three_sum(nums):\n    nums.sort()\n    result = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i-1]: continue\n        if nums[i] > 0: break\n        left, right = i + 1, len(nums) - 1\n        while left < right:\n            total = nums[i] + nums[left] + nums[right]\n            if total == 0:\n                result.append([nums[i], nums[left], nums[right]])\n                while left < right and nums[left] == nums[left+1]: left += 1\n                while left < right and nums[right] == nums[right-1]: right -= 1\n                left += 1; right -= 1\n            elif total < 0: left += 1\n            else: right -= 1\n    return result\n# O(n²) время, O(1) доп. память',
      content: [
        { type: 'text', value: 'Задача: найдите все уникальные тройки [a, b, c] в массиве nums такие что a + b + c = 0. Тройки не должны дублироваться.' },
        { type: 'text', value: 'Пример: [-1,0,1,2,-1,-4] → [[-1,-1,2],[-1,0,1]].' },
        { type: 'heading', value: 'Решение: сортировка + два указателя O(n²)' },
        { type: 'code', language: 'python', value: 'def three_sum(nums):\n    nums.sort()\n    result = []\n    n = len(nums)\n\n    for i in range(n - 2):\n        # Пропускаем дубликаты для первого элемента\n        if i > 0 and nums[i] == nums[i-1]:\n            continue\n        # Если минимальная сумма > 0 — дальше только больше\n        if nums[i] > 0:\n            break\n\n        left, right = i + 1, n - 1\n        while left < right:\n            total = nums[i] + nums[left] + nums[right]\n            if total == 0:\n                result.append([nums[i], nums[left], nums[right]])\n                # Пропускаем дубликаты\n                while left < right and nums[left] == nums[left+1]:\n                    left += 1\n                while left < right and nums[right] == nums[right-1]:\n                    right -= 1\n                left += 1\n                right -= 1\n            elif total < 0:\n                left += 1\n            else:\n                right -= 1\n\n    return result\n\nprint(three_sum([-1, 0, 1, 2, -1, -4]))  # [[-1,-1,2],[-1,0,1]]\nprint(three_sum([0, 0, 0]))              # [[0,0,0]]' },
        { type: 'text', value: 'Объяснение: сортируем. Фиксируем первый элемент i, затем два указателя left/right сжимаются к центру. Важно пропускать дубликаты.\n\nСложность: O(n²) время, O(1) доп. память.' },
        { type: 'tip', value: 'Брутforce O(n³) с HashSet для дедупликации тоже работает, но O(n²) — ожидаемый ответ на интервью.' }
      ]
    },
    {
      id: 2,
      title: 'Longest Substring Without Repeating',
      type: 'practice',
      description: 'Длина наидлиннейшей подстроки без повторов. Скользящее окно с HashMap: при повторе левая граница прыгает к позиции последнего вхождения + 1. O(n) время.',
      solution: 'def length_of_longest_substring(s):\n    char_index = {}\n    max_len = 0\n    left = 0\n    for right, char in enumerate(s):\n        if char in char_index and char_index[char] >= left:\n            left = char_index[char] + 1\n        char_index[char] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len\n# O(n) время, O(min(n, alphabet)) память',
      content: [
        { type: 'text', value: 'Задача: найдите длину самой длинной подстроки без повторяющихся символов.' },
        { type: 'text', value: 'Примеры: "abcabcbb" → 3 ("abc"). "bbbbb" → 1 ("b"). "pwwkew" → 3 ("wke").' },
        { type: 'heading', value: 'Решение: скользящее окно O(n)' },
        { type: 'code', language: 'python', value: 'def length_of_longest_substring(s):\n    char_index = {}  # символ -> последний индекс\n    max_len = 0\n    left = 0  # левая граница окна\n\n    for right, char in enumerate(s):\n        # Если символ уже в окне — сдвигаем левую границу\n        if char in char_index and char_index[char] >= left:\n            left = char_index[char] + 1\n\n        char_index[char] = right\n        max_len = max(max_len, right - left + 1)\n\n    return max_len\n\n# Вариант с множеством:\ndef length_v2(s):\n    window = set()\n    left = 0\n    max_len = 0\n    for right in range(len(s)):\n        while s[right] in window:\n            window.remove(s[left])\n            left += 1\n        window.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len\n\nprint(length_of_longest_substring("abcabcbb"))  # 3\nprint(length_of_longest_substring("bbbbb"))     # 1\nprint(length_of_longest_substring("pwwkew"))    # 3' },
        { type: 'text', value: 'Объяснение: окно [left, right] расширяется вправо. При повторе символа левая граница прыгает вперёд. HashMap хранит последнюю позицию символа для быстрого прыжка.\n\nСложность: O(n) время, O(min(n, m)) память где m — размер алфавита.' }
      ]
    },
    {
      id: 3,
      title: 'Add Two Numbers — сложение через связные списки',
      type: 'practice',
      description: 'Сложение двух чисел, записанных обратными связными списками. Симуляция сложения столбиком с переносом (carry). Цикл пока есть l1 или l2 или carry.',
      solution: 'def add_two_numbers(l1, l2):\n    dummy = ListNode(0)\n    current = dummy\n    carry = 0\n    while l1 or l2 or carry:\n        val1 = l1.val if l1 else 0\n        val2 = l2.val if l2 else 0\n        total = val1 + val2 + carry\n        carry = total // 10\n        current.next = ListNode(total % 10)\n        current = current.next\n        if l1: l1 = l1.next\n        if l2: l2 = l2.next\n    return dummy.next\n# O(max(n,m)) время и память',
      content: [
        { type: 'text', value: 'Задача: два числа представлены в виде обратных связных списков (цифра за цифрой, от младшего разряда). Сложите их и верните результат в том же формате.' },
        { type: 'text', value: 'Пример: (2→4→3) + (5→6→4) = 342 + 465 = 807 → 7→0→8.' },
        { type: 'heading', value: 'Решение: симуляция O(max(n,m))' },
        { type: 'code', language: 'python', value: 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef add_two_numbers(l1, l2):\n    dummy = ListNode(0)\n    current = dummy\n    carry = 0\n\n    while l1 or l2 or carry:\n        val1 = l1.val if l1 else 0\n        val2 = l2.val if l2 else 0\n\n        total = val1 + val2 + carry\n        carry = total // 10\n        digit = total % 10\n\n        current.next = ListNode(digit)\n        current = current.next\n\n        if l1:\n            l1 = l1.next\n        if l2:\n            l2 = l2.next\n\n    return dummy.next\n\n# Трассировка:\n# l1: 2->4->3 (342)\n# l2: 5->6->4 (465)\n# Шаг 1: 2+5+0=7, carry=0, digit=7\n# Шаг 2: 4+6+0=10, carry=1, digit=0\n# Шаг 3: 3+4+1=8, carry=0, digit=8\n# Результат: 7->0->8' },
        { type: 'text', value: 'Объяснение: симулируем сложение столбиком. Обрабатываем перенос (carry). Цикл продолжается пока есть хотя бы один непустой список или ненулевой перенос.\n\nСложность: O(max(n,m)) время, O(max(n,m)) память.' }
      ]
    },
    {
      id: 4,
      title: 'Container With Most Water',
      type: 'practice',
      description: 'Максимальная площадь контейнера. Два указателя с краёв: двигаем указатель с меньшей высотой (больший двигать бессмысленно — площадь только упадёт). O(n) время.',
      solution: 'def max_area(height):\n    left, right = 0, len(height) - 1\n    max_water = 0\n    while left < right:\n        water = min(height[left], height[right]) * (right - left)\n        max_water = max(max_water, water)\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n    return max_water\n# O(n) время, O(1) память',
      content: [
        { type: 'text', value: 'Задача: дан массив height высот вертикальных линий. Найдите два индекса i, j такие что площадь контейнера между ними максимальна. Площадь = min(height[i], height[j]) * (j - i).' },
        { type: 'text', value: 'Пример: [1,8,6,2,5,4,8,3,7] → 49 (индексы 1 и 8, min(8,7) * 7 = 49).' },
        { type: 'heading', value: 'Решение: два указателя O(n)' },
        { type: 'code', language: 'python', value: 'def max_area(height):\n    left, right = 0, len(height) - 1\n    max_water = 0\n\n    while left < right:\n        # Площадь ограничена меньшей высотой\n        water = min(height[left], height[right]) * (right - left)\n        max_water = max(max_water, water)\n\n        # Двигаем указатель с меньшей высотой\n        # (большую высоту двигать бессмысленно — площадь только уменьшится)\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n\n    return max_water\n\nprint(max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]))  # 49\nprint(max_area([1, 1]))                         # 1' },
        { type: 'text', value: 'Объяснение: начинаем с максимальной ширины (крайние указатели). Двигаем указатель с меньшей высотой — только так площадь может вырасти.\n\nСложность: O(n) время, O(1) память.' },
        { type: 'tip', value: 'Доказательство корректности: если мы сдвигаем больший указатель, новая высота <= старой, а ширина уменьшилась → площадь точно не вырастет. Поэтому двигаем меньший.' }
      ]
    },
    {
      id: 5,
      title: 'Group Anagrams — группировка анаграмм',
      type: 'practice',
      description: 'Сгруппировать анаграммы. HashMap с ключом = tuple(sorted(word)): анаграммы имеют одинаковые буквы → одинаковый ключ. O(n × k log k) время.',
      solution: 'from collections import defaultdict\n\ndef group_anagrams(strs):\n    anagram_map = defaultdict(list)\n    for word in strs:\n        key = tuple(sorted(word))\n        anagram_map[key].append(word)\n    return list(anagram_map.values())\n\n# O(n × k log k) время, O(n × k) память\n# Без сортировки: ключ = tuple(26 счётчиков букв) → O(n × k)',
      content: [
        { type: 'text', value: 'Задача: дан массив строк. Сгруппируйте анаграммы вместе. Порядок групп не важен.' },
        { type: 'text', value: 'Пример: ["eat","tea","tan","ate","nat","bat"] → [["bat"],["nat","tan"],["ate","eat","tea"]].' },
        { type: 'heading', value: 'Решение: HashMap с ключом из отсортированных букв' },
        { type: 'code', language: 'python', value: 'from collections import defaultdict\n\ndef group_anagrams(strs):\n    anagram_map = defaultdict(list)\n\n    for word in strs:\n        # Ключ = отсортированные буквы слова\n        key = tuple(sorted(word))\n        anagram_map[key].append(word)\n\n    return list(anagram_map.values())\n\n# Вариант с частотным ключом (без сортировки):\ndef group_anagrams_v2(strs):\n    anagram_map = defaultdict(list)\n    for word in strs:\n        # Ключ = кортеж из 26 счётчиков букв\n        count = [0] * 26\n        for c in word:\n            count[ord(c) - ord("a")] += 1\n        anagram_map[tuple(count)].append(word)\n    return list(anagram_map.values())\n\nprint(group_anagrams(["eat","tea","tan","ate","nat","bat"]))\n# [["eat","tea","ate"], ["tan","nat"], ["bat"]]' },
        { type: 'text', value: 'Объяснение: анаграммы имеют одинаковые буквы, поэтому одинаковый ключ после сортировки. Используем словарь: ключ → список слов-анаграмм.\n\nСложность: O(n * k * log k) время (k — длина слова), O(n*k) память.' }
      ]
    },
    {
      id: 6,
      title: 'Product of Array Except Self',
      type: 'practice',
      description: 'Произведение всех элементов кроме текущего без деления. Два прохода: prefix (произведение левее) и suffix (произведение правее). O(n) время, O(1) доп. память.',
      solution: 'def product_except_self(nums):\n    n = len(nums)\n    result = [1] * n\n    prefix = 1\n    for i in range(n):\n        result[i] = prefix\n        prefix *= nums[i]\n    suffix = 1\n    for i in range(n - 1, -1, -1):\n        result[i] *= suffix\n        suffix *= nums[i]\n    return result\n# [1,2,3,4] → [24,12,8,6]\n# O(n) время, O(1) доп. память',
      content: [
        { type: 'text', value: 'Задача: дан массив nums. Верните массив answer где answer[i] = произведение всех элементов nums, кроме nums[i]. Нельзя использовать деление. O(n) по времени.' },
        { type: 'text', value: 'Пример: [1,2,3,4] → [24,12,8,6].' },
        { type: 'heading', value: 'Решение: prefix и suffix произведения O(n)' },
        { type: 'code', language: 'python', value: 'def product_except_self(nums):\n    n = len(nums)\n    result = [1] * n\n\n    # Prefix: result[i] = произведение всего ЛЕВЕЕ i\n    prefix = 1\n    for i in range(n):\n        result[i] = prefix\n        prefix *= nums[i]\n\n    # Suffix: умножаем справа налево\n    suffix = 1\n    for i in range(n - 1, -1, -1):\n        result[i] *= suffix\n        suffix *= nums[i]\n\n    return result\n\n# Трассировка для [1,2,3,4]:\n# После prefix: [1, 1, 2, 6]\n# После suffix: [24, 12, 8, 6]\n# result[0] = 1 * 24 = 24\n# result[1] = 1 * 12 = 12\n# result[2] = 2 * 4 = 8\n# result[3] = 6 * 1 = 6\n\nprint(product_except_self([1, 2, 3, 4]))   # [24, 12, 8, 6]\nprint(product_except_self([-1, 1, 0, -3])) # [0, 0, 3, 0]' },
        { type: 'text', value: 'Объяснение: answer[i] = (произведение всего левее i) * (произведение всего правее i). Вычисляем prefix за один проход и suffix за второй проход.\n\nСложность: O(n) время, O(1) доп. памяти (не считая output).' }
      ]
    },
    {
      id: 7,
      title: 'Merge Intervals — слияние интервалов',
      type: 'practice',
      description: 'Слить пересекающиеся интервалы. Сортировка по началу, затем: если начало текущего ≤ конец последнего в результате → расширить, иначе → добавить новый. O(n log n).',
      solution: 'def merge(intervals):\n    intervals.sort(key=lambda x: x[0])\n    result = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start <= result[-1][1]:\n            result[-1][1] = max(result[-1][1], end)\n        else:\n            result.append([start, end])\n    return result\n# O(n log n) время (сортировка), O(n) память',
      content: [
        { type: 'text', value: 'Задача: дан массив интервалов intervals = [[start,end],...]. Слейте все пересекающиеся интервалы и верните результат.' },
        { type: 'text', value: 'Пример: [[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]].' },
        { type: 'heading', value: 'Решение: сортировка + проверка пересечения O(n log n)' },
        { type: 'code', language: 'python', value: 'def merge(intervals):\n    if not intervals:\n        return []\n\n    # Сортируем по началу интервала\n    intervals.sort(key=lambda x: x[0])\n    result = [intervals[0]]\n\n    for start, end in intervals[1:]:\n        last_end = result[-1][1]\n\n        if start <= last_end:  # Пересечение!\n            # Расширяем последний интервал\n            result[-1][1] = max(last_end, end)\n        else:\n            # Нет пересечения — добавляем новый\n            result.append([start, end])\n\n    return result\n\n# Тесты\nprint(merge([[1,3],[2,6],[8,10],[15,18]])) # [[1,6],[8,10],[15,18]]\nprint(merge([[1,4],[4,5]]))               # [[1,5]] (касаются — сливаем)\nprint(merge([[1,4],[0,4]]))               # [[0,4]]\nprint(merge([[1,4],[0,0]]))               # [[0,0],[1,4]]' },
        { type: 'text', value: 'Объяснение: после сортировки по началу, пересекающиеся интервалы стоят рядом. Сравниваем начало текущего с концом последнего в результате.\n\nСложность: O(n log n) для сортировки, O(n) память.' }
      ]
    },
    {
      id: 8,
      title: 'LRU Cache — кэш с вытеснением',
      type: 'practice',
      description: 'LRU Cache с O(1) get и put. OrderedDict (Python): move_to_end при доступе, popitem(last=False) при переполнении. Вручную: HashMap + двусвязный список.',
      solution: 'from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.cache = OrderedDict()\n\n    def get(self, key):\n        if key not in self.cache: return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key, value):\n        if key in self.cache: self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            self.cache.popitem(last=False)\n\n# O(1) get и put\n# Вручную: HashMap + двусвязный список (head=MRU, tail=LRU)',
      content: [
        { type: 'text', value: 'Задача: реализуйте LRU (Least Recently Used) Cache с операциями get(key) и put(key, value). Оба за O(1). При переполнении вытесняйте давно неиспользованный элемент.' },
        { type: 'heading', value: 'Решение: OrderedDict (HashMap + Doubly Linked List)' },
        { type: 'code', language: 'python', value: 'from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.cache = OrderedDict()  # ключ -> значение, порядок = LRU\n\n    def get(self, key):\n        if key not in self.cache:\n            return -1\n        # Переносим в конец (most recently used)\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key, value):\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            # Удаляем наиболее давний (первый в OrderedDict)\n            self.cache.popitem(last=False)\n\n# Реализация "вручную" через двусвязный список + hashmap:\nclass Node:\n    def __init__(self, key=0, val=0):\n        self.key = key\n        self.val = val\n        self.prev = self.next = None\n\nclass LRUCacheManual:\n    def __init__(self, capacity):\n        self.cap = capacity\n        self.map = {}\n        # dummy head и tail\n        self.head, self.tail = Node(), Node()\n        self.head.next = self.tail\n        self.tail.prev = self.head\n\n    def _remove(self, node):\n        node.prev.next = node.next\n        node.next.prev = node.prev\n\n    def _add_to_front(self, node):\n        node.next = self.head.next\n        node.prev = self.head\n        self.head.next.prev = node\n        self.head.next = node\n\n    def get(self, key):\n        if key not in self.map:\n            return -1\n        node = self.map[key]\n        self._remove(node)\n        self._add_to_front(node)\n        return node.val\n\n    def put(self, key, value):\n        if key in self.map:\n            self._remove(self.map[key])\n        node = Node(key, value)\n        self._add_to_front(node)\n        self.map[key] = node\n        if len(self.map) > self.cap:\n            lru = self.tail.prev\n            self._remove(lru)\n            del self.map[lru.key]\n\n# Тест\ncache = LRUCache(2)\ncache.put(1, 1)\ncache.put(2, 2)\nprint(cache.get(1))  # 1\ncache.put(3, 3)      # вытесняет 2\nprint(cache.get(2))  # -1\nprint(cache.get(3))  # 3' },
        { type: 'text', value: 'Объяснение: OrderedDict поддерживает порядок вставки и move_to_end. Вручную: HashMap для O(1) доступа + двусвязный список для O(1) перестановок и удалений.\n\nСложность: O(1) для get и put.' },
        { type: 'note', value: 'LRU Cache — один из самых частых вопросов в FAANG. Убедитесь что понимаете ручную реализацию: HashMap + двусвязный список.' }
      ]
    },
    {
      id: 9,
      title: 'Course Schedule — топологическая сортировка',
      type: 'practice',
      description: 'Можно ли пройти все курсы (нет циклических зависимостей)? BFS Kahn: убираем вершины с in_degree=0, если в конце все убраны — цикла нет. O(V+E) время.',
      solution: 'from collections import defaultdict, deque\n\ndef can_finish(num_courses, prerequisites):\n    graph = defaultdict(list)\n    in_degree = [0] * num_courses\n    for course, prereq in prerequisites:\n        graph[prereq].append(course)\n        in_degree[course] += 1\n    queue = deque([i for i in range(num_courses) if in_degree[i] == 0])\n    completed = 0\n    while queue:\n        course = queue.popleft()\n        completed += 1\n        for next_course in graph[course]:\n            in_degree[next_course] -= 1\n            if in_degree[next_course] == 0:\n                queue.append(next_course)\n    return completed == num_courses\n# O(V+E) время и память',
      content: [
        { type: 'text', value: 'Задача: у вас numCourses курсов (0 до numCourses-1) и массив prerequisites [[a,b]] означающий "для курса a нужно сначала b". Можно ли пройти все курсы?' },
        { type: 'text', value: 'Пример: numCourses=2, prerequisites=[[1,0]] → True. [[1,0],[0,1]] → False (циклическая зависимость).' },
        { type: 'heading', value: 'Решение: определение цикла в графе DFS / BFS Kahn' },
        { type: 'code', language: 'python', value: 'from collections import defaultdict, deque\n\n# BFS Kahn\'s Algorithm: топологическая сортировка\ndef can_finish(num_courses, prerequisites):\n    # Граф смежности и in-degree\n    graph = defaultdict(list)\n    in_degree = [0] * num_courses\n\n    for course, prereq in prerequisites:\n        graph[prereq].append(course)\n        in_degree[course] += 1\n\n    # Начинаем с курсов без prerequisites\n    queue = deque([i for i in range(num_courses) if in_degree[i] == 0])\n    completed = 0\n\n    while queue:\n        course = queue.popleft()\n        completed += 1\n        for next_course in graph[course]:\n            in_degree[next_course] -= 1\n            if in_degree[next_course] == 0:\n                queue.append(next_course)\n\n    return completed == num_courses  # если есть цикл - не все пройдём\n\n# DFS: поиск цикла\ndef can_finish_dfs(num_courses, prerequisites):\n    graph = defaultdict(list)\n    for course, prereq in prerequisites:\n        graph[prereq].append(course)\n\n    # 0=unvisited, 1=visiting, 2=visited\n    state = [0] * num_courses\n\n    def has_cycle(course):\n        if state[course] == 1: return True   # цикл!\n        if state[course] == 2: return False  # уже проверено\n        state[course] = 1  # помечаем как "в процессе"\n        for neighbor in graph[course]:\n            if has_cycle(neighbor):\n                return True\n        state[course] = 2  # помечаем как "завершено"\n        return False\n\n    return not any(has_cycle(c) for c in range(num_courses) if state[c] == 0)\n\nprint(can_finish(2, [[1,0]]))       # True\nprint(can_finish(2, [[1,0],[0,1]])) # False' },
        { type: 'text', value: 'Объяснение: курсы — вершины графа, зависимости — рёбра. Задача сводится к обнаружению цикла. BFS (Kahn) убирает вершины с нулевой степенью; если в конце остались — есть цикл.\n\nСложность: O(V+E) время, O(V+E) память.' }
      ]
    },
    {
      id: 10,
      title: 'Word Break — разбиение на слова',
      type: 'practice',
      description: 'Можно ли разбить строку на слова из словаря? DP: dp[i] = True если s[:i] разбивается. Для каждой позиции проверяем все возможные "последние слова". O(n² × m).',
      solution: 'def word_break(s, word_dict):\n    word_set = set(word_dict)\n    n = len(s)\n    dp = [False] * (n + 1)\n    dp[0] = True\n    for i in range(1, n + 1):\n        for j in range(i):\n            if dp[j] and s[j:i] in word_set:\n                dp[i] = True\n                break\n    return dp[n]\n# O(n² × m) время, O(n) память\n# Оптимизация: ограничить j по min/max длине слова из словаря',
      content: [
        { type: 'text', value: 'Задача: дана строка s и словарь wordDict. Можно ли разбить s на одно или более слов из словаря?' },
        { type: 'text', value: 'Примеры: s="leetcode", wordDict=["leet","code"] → True. s="applepenapple", wordDict=["apple","pen"] → True. s="catsandog", wordDict=["cats","dog","sand","cat"] → False.' },
        { type: 'heading', value: 'Решение: динамическое программирование O(n² * m)' },
        { type: 'code', language: 'python', value: 'def word_break(s, word_dict):\n    word_set = set(word_dict)  # O(1) поиск\n    n = len(s)\n\n    # dp[i] = True если s[:i] можно разбить на слова из словаря\n    dp = [False] * (n + 1)\n    dp[0] = True  # пустая строка разбивается\n\n    for i in range(1, n + 1):\n        for j in range(i):\n            # Если s[:j] разбивается И s[j:i] есть в словаре\n            if dp[j] and s[j:i] in word_set:\n                dp[i] = True\n                break  # нашли — дальше не проверяем\n\n    return dp[n]\n\n# С мемоизацией (top-down):\nfrom functools import lru_cache\n\ndef word_break_memo(s, word_dict):\n    word_set = set(word_dict)\n\n    @lru_cache(maxsize=None)\n    def can_break(start):\n        if start == len(s):\n            return True\n        for end in range(start + 1, len(s) + 1):\n            if s[start:end] in word_set and can_break(end):\n                return True\n        return False\n\n    return can_break(0)\n\nprint(word_break("leetcode", ["leet","code"]))         # True\nprint(word_break("applepenapple", ["apple","pen"]))    # True\nprint(word_break("catsandog", ["cats","dog","cat"]))   # False' },
        { type: 'text', value: 'Объяснение: dp[i] = True если можно разбить первые i символов. Для каждой позиции перебираем все возможные "последние слова".\n\nСложность: O(n² * m) время (m — длина слова), O(n) память.' },
        { type: 'note', value: 'Word Break — классическая задача на DP. Добавьте оптимизацию: ограничьте j диапазоном min_word_len..max_word_len вместо 0..i.' }
      ]
    }
  ]
}
