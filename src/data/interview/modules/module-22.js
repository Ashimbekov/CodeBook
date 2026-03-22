export default {
  id: 22,
  title: 'Coding: бинарный поиск',
  description: 'Задачи на бинарный поиск: классический поиск, повёрнутые массивы, матрицы и бинарный поиск по ответу.',
  lessons: [
    {
      id: 1,
      title: 'Бинарный поиск',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан отсортированный массив nums и целевое значение target. Верни индекс target или -1 если не найдено. LeetCode #704.',
      requirements: [
        'Принимает отсортированный список и target',
        'Возвращает индекс или -1',
        'O(log n) по времени',
        'Корректно обрабатывает дубликаты и граничные случаи'
      ],
      expectedOutput: 'Вход: nums=[-1,0,3,5,9,12], target=9\nВыход: 4\nВход: nums=[-1,0,3,5,9,12], target=2\nВыход: -1',
      hint: 'left=0, right=len-1. mid=(left+right)//2. Если nums[mid]==target — ответ. Если больше — right=mid-1. Если меньше — left=mid+1.',
      solution: 'def search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = left + (right - left) // 2  # избегаем переполнения\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\n# Шаблоны бинарного поиска\n# lower_bound: первый индекс >= target\ndef lower_bound(nums, target):\n    left, right = 0, len(nums)\n    while left < right:\n        mid = (left + right) // 2\n        if nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid\n    return left\n\n# upper_bound: первый индекс > target\ndef upper_bound(nums, target):\n    left, right = 0, len(nums)\n    while left < right:\n        mid = (left + right) // 2\n        if nums[mid] <= target:\n            left = mid + 1\n        else:\n            right = mid\n    return left',
      explanation: 'Подход: классический бинарный поиск. mid = left + (right-left)//2 безопаснее чем (left+right)//2 при больших числах.\nСложность: O(log n) по времени, O(1) по памяти.\nСовет для интервью: знай три шаблона — exact match, lower_bound, upper_bound. bisect.bisect_left/right в Python — это lower/upper bound. Всегда можно использовать их для нестандартных задач.'
    },
    {
      id: 2,
      title: 'Поиск в повёрнутом отсортированном массиве',
      type: 'practice',
      difficulty: 'medium',
      description: 'Отсортированный массив был повёрнут в случайной точке. Найди target. Верни индекс или -1. LeetCode #33.',
      requirements: [
        'Принимает повёрнутый массив и target',
        'Все значения уникальны',
        'Возвращает индекс или -1',
        'O(log n) по времени'
      ],
      expectedOutput: 'Вход: nums=[4,5,6,7,0,1,2], target=0\nВыход: 4\nВход: nums=[4,5,6,7,0,1,2], target=3\nВыход: -1\nВход: nums=[1], target=0\nВыход: -1',
      hint: 'В повёрнутом массиве одна из половин всегда отсортирована. Определи какая. Если target в отсортированной половине — ищи там. Иначе — в другой.',
      solution: 'def search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        # Левая половина отсортирована\n        if nums[left] <= nums[mid]:\n            if nums[left] <= target < nums[mid]:\n                right = mid - 1\n            else:\n                left = mid + 1\n        # Правая половина отсортирована\n        else:\n            if nums[mid] < target <= nums[right]:\n                left = mid + 1\n            else:\n                right = mid - 1\n    return -1',
      explanation: 'Подход: в любой момент одна из двух половин [left, mid] или [mid, right] гарантированно отсортирована. Это позволяет определить куда идти.\nСложность: O(log n) по времени.\nСовет для интервью: ключевой инсайт — проверяй nums[left] <= nums[mid] чтобы определить какая половина отсортирована. Аккуратно с граничными случаями: <=, не <.'
    },
    {
      id: 3,
      title: 'Минимум в повёрнутом отсортированном массиве',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан повёрнутый отсортированный массив без дубликатов. Найди минимальный элемент. LeetCode #153.',
      requirements: [
        'Принимает повёрнутый массив',
        'Все значения уникальны',
        'Возвращает минимальное значение',
        'O(log n) по времени'
      ],
      expectedOutput: 'Вход: nums=[3,4,5,1,2]\nВыход: 1\nВход: nums=[4,5,6,7,0,1,2]\nВыход: 0\nВход: nums=[11,13,15,17]\nВыход: 11',
      hint: 'Минимум находится в той части где есть "излом". Если nums[mid] > nums[right] — минимум в правой половине. Иначе — в левой (включая mid).',
      solution: 'def findMin(nums):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        mid = (left + right) // 2\n        if nums[mid] > nums[right]:\n            # Минимум в правой половине\n            left = mid + 1\n        else:\n            # Минимум в левой половине включая mid\n            right = mid\n    return nums[left]\n\n# С дубликатами (LeetCode #154)\ndef findMinWithDups(nums):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        mid = (left + right) // 2\n        if nums[mid] > nums[right]:\n            left = mid + 1\n        elif nums[mid] < nums[right]:\n            right = mid\n        else:\n            right -= 1  # неопределённость — убираем правый\n    return nums[left]',
      explanation: 'Подход: сравниваем mid с right (не с left!). Если nums[mid] > nums[right] — "излом" справа от mid, значит минимум правее.\nСложность: O(log n) по времени, O(n log n) в худшем случае с дубликатами.\nСовет для интервью: сравнение с right интуитивнее чем с left для этой задачи. right=mid а не right=mid-1 т.к. mid может быть минимумом.'
    },
    {
      id: 4,
      title: 'Поиск в 2D матрице',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана m x n матрица с двумя свойствами: каждая строка отсортирована, первый элемент каждой строки больше последнего предыдущей. Найди target. LeetCode #74.',
      requirements: [
        'Принимает 2D матрицу и target',
        'Возвращает True если target найден',
        'O(log(m*n)) по времени',
        'Рассматривает матрицу как один отсортированный массив'
      ],
      expectedOutput: 'Вход: matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=3\nВыход: True\nВход: matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=13\nВыход: False',
      hint: 'Матрица — это развёрнутый отсортированный массив. Применяй бинарный поиск в диапазоне [0, m*n). Конвертируй mid в (row, col): row = mid // cols, col = mid % cols.',
      solution: 'def searchMatrix(matrix, target):\n    if not matrix or not matrix[0]:\n        return False\n    rows, cols = len(matrix), len(matrix[0])\n    left, right = 0, rows * cols - 1\n\n    while left <= right:\n        mid = (left + right) // 2\n        row, col = divmod(mid, cols)\n        val = matrix[row][col]\n        if val == target:\n            return True\n        elif val < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return False\n\n# Альтернатива: начать с правого верхнего угла O(m+n)\ndef searchMatrixAlt(matrix, target):\n    if not matrix:\n        return False\n    row, col = 0, len(matrix[0]) - 1\n    while row < len(matrix) and col >= 0:\n        val = matrix[row][col]\n        if val == target:\n            return True\n        elif val > target:\n            col -= 1\n        else:\n            row += 1\n    return False',
      explanation: 'Подход 1: рассматриваем матрицу как плоский массив. divmod для конвертации индекса в координаты.\nПодход 2: стартуем с правого верхнего угла — больше идём вниз, меньше идём влево.\nСложность: O(log(m*n)) и O(m+n) соответственно.\nСовет для интервью: второй подход проще объяснить и работает даже если строки не "сцеплены" (LeetCode #240).'
    },
    {
      id: 5,
      title: 'Коко ест бананы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Коко ест бананы из n куч. За час она ест k бананов из одной кучи (если куча меньше k — съедает всю и ждёт следующий час). Найди минимальное k при котором она съест все бананы за h часов. LeetCode #875.',
      requirements: [
        'Принимает список куч piles и h часов',
        'Возвращает минимальное k',
        'k >= 1, h >= len(piles)',
        'Бинарный поиск по ответу в диапазоне [1, max(piles)]'
      ],
      expectedOutput: 'Вход: piles=[3,6,7,11], h=8\nВыход: 4\nВход: piles=[30,11,23,4,20], h=5\nВыход: 30',
      hint: 'Чем больше k тем меньше часов нужно. Бинарный поиск на k от 1 до max(piles). Для каждого k считай сколько часов нужно: sum(ceil(pile/k) для каждой кучи).',
      solution: 'import math\n\ndef minEatingSpeed(piles, h):\n    def canFinish(k):\n        hours = sum(math.ceil(pile / k) for pile in piles)\n        return hours <= h\n\n    left, right = 1, max(piles)\n    while left < right:\n        mid = (left + right) // 2\n        if canFinish(mid):\n            right = mid  # пробуем меньшее k\n        else:\n            left = mid + 1\n    return left',
      explanation: 'Подход: бинарный поиск по ответу. Функция canFinish монотонна: если k работает, то любое k\' > k тоже работает. Ищем минимальное k где canFinish = True.\nСложность: O(n log m) где n — количество куч, m — max(piles).\nСовет для интервью: паттерн "бинарный поиск по ответу" очень мощный. Признак: "найди минимальное/максимальное X такое что некоторое условие выполнено". Применяется к монотонным функциям.'
    },
    {
      id: 6,
      title: 'Поиск пиковых элементов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums (nums[-1] = nums[n] = -inf). Элемент является пиком если он строго больше соседей. Найди индекс любого пика. LeetCode #162.',
      requirements: [
        'Принимает список чисел',
        'Возвращает индекс любого пика',
        'Гарантировано что nums[i] != nums[i+1]',
        'O(log n) по времени'
      ],
      expectedOutput: 'Вход: nums=[1,2,3,1]\nВыход: 2\nВход: nums=[1,2,1,3,5,6,4]\nВыход: 1 или 5',
      hint: 'Если nums[mid] < nums[mid+1] — пик справа (и он точно есть там). Иначе — пик слева включая mid. Это работает потому что всегда есть хотя бы один пик.',
      solution: 'def findPeakElement(nums):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        mid = (left + right) // 2\n        if nums[mid] < nums[mid + 1]:\n            left = mid + 1  # пик справа\n        else:\n            right = mid  # пик слева включая mid\n    return left',
      explanation: 'Подход: если nums[mid] < nums[mid+1] — функция возрастает, значит пик правее. Иначе убывает или мы на пике — пик в [left, mid].\nСложность: O(log n) по времени.\nСовет для интервью: задача нестандартная — нет одного ответа, любой пик подходит. Докажи что пик всегда существует: массив ограничен -inf с обоих сторон, значит где-то должен быть максимум.'
    },
    {
      id: 7,
      title: 'Медиана двух отсортированных массивов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Даны два отсортированных массива nums1 и nums2 размеров m и n. Найди медиану объединённого массива. Алгоритм должен быть O(log(m+n)). LeetCode #4.',
      requirements: [
        'Принимает два отсортированных списка',
        'Возвращает медиану (float)',
        'O(log(min(m,n))) по времени',
        'Не объединяет массивы полностью'
      ],
      expectedOutput: 'Вход: nums1=[1,3], nums2=[2]\nВыход: 2.0\nВход: nums1=[1,2], nums2=[3,4]\nВыход: 2.5',
      hint: 'Бинарный поиск по позиции разреза в меньшем массиве. Разрез делит оба массива на левую и правую половины. Условие: max(left) <= min(right) для обоих массивов.',
      solution: 'def findMedianSortedArrays(nums1, nums2):\n    # Убеждаемся что nums1 меньше\n    if len(nums1) > len(nums2):\n        nums1, nums2 = nums2, nums1\n\n    m, n = len(nums1), len(nums2)\n    half = (m + n) // 2\n\n    left, right = 0, m\n    while True:\n        i = (left + right) // 2  # разрез в nums1\n        j = half - i              # разрез в nums2\n\n        # Значения на границах разреза\n        nums1_left  = nums1[i-1] if i > 0 else float(\'-inf\')\n        nums1_right = nums1[i]   if i < m else float(\'inf\')\n        nums2_left  = nums2[j-1] if j > 0 else float(\'-inf\')\n        nums2_right = nums2[j]   if j < n else float(\'inf\')\n\n        if nums1_left <= nums2_right and nums2_left <= nums1_right:\n            # Нашли правильный разрез\n            if (m + n) % 2 == 1:\n                return float(min(nums1_right, nums2_right))\n            else:\n                return (max(nums1_left, nums2_left) + min(nums1_right, nums2_right)) / 2.0\n        elif nums1_left > nums2_right:\n            right = i - 1\n        else:\n            left = i + 1',
      explanation: 'Подход: ищем правильный "разрез" в nums1 через бинарный поиск. Разрез определяет левую и правую половины объединённого массива.\nСложность: O(log(min(m,n))) по времени.\nСовет для интервью: одна из самых сложных задач LeetCode. Объясни идею разреза и инвариант. На интервью допускается O(log(m+n)) решение — слить массивы и найти середину.'
    },
    {
      id: 8,
      title: 'Time Based Key-Value Store',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй key-value хранилище с временными метками. set(key, value, timestamp) сохраняет (key, value) для данного timestamp. get(key, timestamp) возвращает value для наибольшего timestamp <= заданного. LeetCode #981.',
      requirements: [
        'set(key, value, timestamp): timestamp всегда возрастает',
        'get(key, timestamp): возвращает value или ""',
        'Для get ищи максимальный timestamp <= заданного',
        'Используй бинарный поиск для O(log n) get'
      ],
      expectedOutput: 'set("foo","bar",1)\nget("foo",1) -> "bar"\nget("foo",3) -> "bar"\nset("foo","bar2",4)\nget("foo",4) -> "bar2"\nget("foo",5) -> "bar2"',
      hint: 'Храни для каждого ключа список (timestamp, value) отсортированный по timestamp. bisect_right(timestamps, target) даёт позицию для вставки — одна позиция левее — нужный ответ.',
      solution: 'import bisect\nfrom collections import defaultdict\n\nclass TimeMap:\n    def __init__(self):\n        self.store = defaultdict(list)  # key -> [(timestamp, value)]\n\n    def set(self, key, value, timestamp):\n        self.store[key].append((timestamp, value))\n        # timestamp всегда возрастает, список уже отсортирован\n\n    def get(self, key, timestamp):\n        if key not in self.store:\n            return ""\n        entries = self.store[key]\n        # Ищем rightmost timestamp <= target\n        # bisect_right по timestamp (первый элемент кортежа)\n        idx = bisect.bisect_right(entries, (timestamp, chr(127)))\n        if idx == 0:\n            return ""\n        return entries[idx - 1][1]\n\n# Без bisect: ручной бинарный поиск\nclass TimeMapManual:\n    def __init__(self):\n        self.store = defaultdict(list)\n\n    def set(self, key, value, timestamp):\n        self.store[key].append((timestamp, value))\n\n    def get(self, key, timestamp):\n        if key not in self.store:\n            return ""\n        entries = self.store[key]\n        left, right = 0, len(entries) - 1\n        result = ""\n        while left <= right:\n            mid = (left + right) // 2\n            if entries[mid][0] <= timestamp:\n                result = entries[mid][1]\n                left = mid + 1\n            else:\n                right = mid - 1\n        return result',
      explanation: 'Подход: т.к. timestamp всегда возрастает при set, список для каждого ключа уже отсортирован. bisect_right находит позицию вставки, элемент слева — ответ.\nСложность: set O(1), get O(log n) где n — количество значений для ключа.\nСовет для интервью: chr(127) — символ с максимальным ASCII, это трюк чтобы bisect_right правильно обработал случай когда нужны все entry с данным timestamp.'
    }
  ]
}
