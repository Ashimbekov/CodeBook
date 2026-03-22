export default {
  id: 23,
  title: 'Coding: сортировка',
  description: 'Задачи на сортировку и интервалы: объединение, вставка, планирование встреч и нестандартные компараторы.',
  lessons: [
    {
      id: 1,
      title: 'Слияние интервалов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан список интервалов [[start, end]]. Объедини все перекрывающиеся интервалы и верни список не перекрывающихся. LeetCode #56.',
      requirements: [
        'Принимает список интервалов',
        'Возвращает список объединённых интервалов',
        'Интервалы [1,3] и [2,6] перекрываются -> [1,6]',
        'Сортировка по началу интервала'
      ],
      expectedOutput: 'Вход: [[1,3],[2,6],[8,10],[15,18]]\nВыход: [[1,6],[8,10],[15,18]]\nВход: [[1,4],[4,5]]\nВыход: [[1,5]]',
      hint: 'Сортируй по start. Затем проходи и сравнивай текущий интервал с последним в результате. Если current.start <= last.end — объединяй. Иначе добавляй новый.',
      solution: 'def merge(intervals):\n    if not intervals:\n        return []\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n\n    for start, end in intervals[1:]:\n        last_start, last_end = merged[-1]\n        if start <= last_end:\n            # Перекрываются — объединяем\n            merged[-1][1] = max(last_end, end)\n        else:\n            merged.append([start, end])\n\n    return merged',
      explanation: 'Подход: после сортировки по start достаточно одного прохода. Перекрытие определяется условием current.start <= last.end.\nСложность: O(n log n) по времени (доминирует сортировка), O(n) памяти.\nСовет для интервью: убедись что объединяешь через max(last_end, end) — текущий интервал может быть полностью внутри предыдущего.'
    },
    {
      id: 2,
      title: 'Вставка интервала',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан список не перекрывающихся отсортированных интервалов и новый интервал newInterval. Вставь newInterval и объедини при необходимости. LeetCode #57.',
      requirements: [
        'Исходные интервалы отсортированы и не перекрываются',
        'Вставить newInterval и объединить перекрывающиеся',
        'Возвращает отсортированный список без перекрытий',
        'Без сортировки — используй позицию вставки'
      ],
      expectedOutput: 'Вход: intervals=[[1,3],[6,9]], newInterval=[2,5]\nВыход: [[1,5],[6,9]]\nВход: intervals=[[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval=[4,8]\nВыход: [[1,2],[3,10],[12,16]]',
      hint: 'Три фазы: 1) добавляй интервалы заканчивающиеся до newInterval.start, 2) объединяй перекрывающиеся с newInterval, 3) добавляй оставшиеся.',
      solution: 'def insert(intervals, newInterval):\n    result = []\n    i = 0\n    n = len(intervals)\n\n    # Фаза 1: интервалы до newInterval\n    while i < n and intervals[i][1] < newInterval[0]:\n        result.append(intervals[i])\n        i += 1\n\n    # Фаза 2: объединяем перекрывающиеся\n    while i < n and intervals[i][0] <= newInterval[1]:\n        newInterval[0] = min(newInterval[0], intervals[i][0])\n        newInterval[1] = max(newInterval[1], intervals[i][1])\n        i += 1\n    result.append(newInterval)\n\n    # Фаза 3: оставшиеся интервалы\n    while i < n:\n        result.append(intervals[i])\n        i += 1\n\n    return result',
      explanation: 'Подход: три чёткие фазы. Условие перекрытия: intervals[i].start <= newInterval.end (не заканчивается до начала нового).\nСложность: O(n) по времени, O(n) по памяти.\nСовет для интервью: не нужна сортировка — массив уже отсортирован. Три фазы проще чем кажется: до, пересечение, после.'
    },
    {
      id: 3,
      title: 'Непересекающиеся интервалы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан список интервалов. Найди минимальное количество интервалов для удаления чтобы оставшиеся не перекрывались. LeetCode #435.',
      requirements: [
        'Принимает список интервалов',
        'Возвращает минимальное количество удалений',
        'Оптимальная стратегия: жадный алгоритм',
        'Граничный случай: [1,2] и [2,3] не перекрываются'
      ],
      expectedOutput: 'Вход: [[1,2],[2,3],[3,4],[1,3]]\nВыход: 1 (удалить [1,3])\nВход: [[1,2],[1,2],[1,2]]\nВыход: 2\nВход: [[1,2],[2,3]]\nВыход: 0',
      hint: 'Жадный: сортируй по end. Всегда оставляй интервал с наименьшим end — это даёт больше места для следующих. При перекрытии удаляй текущий (с большим end).',
      solution: 'def eraseOverlapIntervals(intervals):\n    if not intervals:\n        return 0\n    # Сортируем по концу интервала\n    intervals.sort(key=lambda x: x[1])\n    removed = 0\n    prev_end = intervals[0][1]\n\n    for start, end in intervals[1:]:\n        if start < prev_end:\n            # Перекрытие — удаляем текущий (у него больший end)\n            removed += 1\n        else:\n            # Нет перекрытия — обновляем prev_end\n            prev_end = end\n\n    return removed',
      explanation: 'Подход: жадный алгоритм интервального планирования. Сортировка по end оптимальна: выбираем интервал с минимальным концом, освобождая максимум места.\nСложность: O(n log n) по времени.\nСовет для интервью: это классическая задача "Activity Selection Problem". Ответ = n - (максимальное количество не перекрывающихся интервалов).'
    },
    {
      id: 4,
      title: 'Meeting Rooms I и II',
      type: 'practice',
      difficulty: 'medium',
      description: 'Meeting Rooms I (LeetCode #252): можно ли один человек посетить все встречи? Meeting Rooms II (LeetCode #253): минимальное количество переговорных комнат.',
      requirements: [
        'I: принимает список интервалов, возвращает True/False',
        'II: возвращает минимальное количество комнат',
        'I: проверка на перекрытие после сортировки',
        'II: подсчёт активных встреч через heap или события'
      ],
      expectedOutput: 'Meeting Rooms I:\nВход: [[0,30],[5,10],[15,20]]\nВыход: False\nMeeting Rooms II:\nВход: [[0,30],[5,10],[15,20]]\nВыход: 2',
      hint: 'I: сортируй по start, проверяй intervals[i].start < intervals[i-1].end. II: min-heap конечных времён — добавляй встречу, если heap[0] <= start — вытесняй вершину (освобождаем комнату).',
      solution: '# Meeting Rooms I\ndef canAttendMeetings(intervals):\n    intervals.sort(key=lambda x: x[0])\n    for i in range(1, len(intervals)):\n        if intervals[i][0] < intervals[i-1][1]:\n            return False\n    return True\n\n# Meeting Rooms II\nimport heapq\n\ndef minMeetingRooms(intervals):\n    if not intervals:\n        return 0\n    intervals.sort(key=lambda x: x[0])\n    end_times = []  # min-heap конечных времён\n\n    for start, end in intervals:\n        if end_times and end_times[0] <= start:\n            heapq.heapreplace(end_times, end)  # переиспользуем комнату\n        else:\n            heapq.heappush(end_times, end)  # нужна новая комната\n\n    return len(end_times)\n\n# Альтернатива II: подход с событиями\ndef minMeetingRoomsEvents(intervals):\n    events = []\n    for start, end in intervals:\n        events.append((start, 1))   # встреча начинается\n        events.append((end, -1))    # встреча заканчивается\n    events.sort(key=lambda x: (x[0], x[1]))  # при одном времени: конец раньше начала\n    rooms = max_rooms = 0\n    for _, delta in events:\n        rooms += delta\n        max_rooms = max(max_rooms, rooms)\n    return max_rooms',
      explanation: 'Meeting Rooms I: O(n log n) — простая проверка после сортировки.\nMeeting Rooms II: heap хранит конечные времена активных встреч. Размер heap = количество комнат.\nСложность: O(n log n) для обоих.\nСовет для интервью: подход с событиями (sweep line) интуитивен: +1 при начале, -1 при конце, максимум одновременных событий = ответ.'
    },
    {
      id: 5,
      title: 'Сортировка по чётности',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив nums. Верни массив где все чётные числа стоят перед нечётными. Порядок внутри групп не важен. LeetCode #905.',
      requirements: [
        'Принимает список целых чисел',
        'Возвращает новый массив: чётные перед нечётными',
        'Порядок внутри каждой группы не важен',
        'Реализуй in-place через два указателя'
      ],
      expectedOutput: 'Вход: nums=[3,1,2,4]\nВыход: [2,4,3,1] или [4,2,1,3] (любой)\nВход: nums=[0]\nВыход: [0]',
      hint: 'Два указателя как в сортировке цветов. left ищет нечётный слева, right ищет чётный справа. Swap их местами.',
      solution: 'def sortArrayByParity(nums):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        while left < right and nums[left] % 2 == 0:\n            left += 1\n        while left < right and nums[right] % 2 == 1:\n            right -= 1\n        if left < right:\n            nums[left], nums[right] = nums[right], nums[left]\n            left += 1\n            right -= 1\n    return nums\n\n# Краткий вариант через sorted\ndef sortArrayByParityShort(nums):\n    return sorted(nums, key=lambda x: x % 2)',
      explanation: 'Подход: два указателя с концов. Паттерн из Dutch National Flag с двумя зонами.\nСложность: O(n) по времени, O(1) памяти.\nСовет для интервью: sorted с ключом — однострочное элегантное решение для Python, но O(n log n). Два указателя — O(n) и O(1) памяти.'
    },
    {
      id: 6,
      title: 'Наибольшее число',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан список неотрицательных чисел. Расположи их так, чтобы образованное число было наибольшим. Верни результат как строку. LeetCode #179.',
      requirements: [
        'Принимает список целых чисел',
        'Возвращает строку — наибольшее возможное число',
        'Если все числа 0 — вернуть "0"',
        'Нестандартный компаратор для сортировки'
      ],
      expectedOutput: 'Вход: nums=[10,2]\nВыход: "210"\nВход: nums=[3,30,34,5,9]\nВыход: "9534330"',
      hint: 'Нестандартный компаратор: a > b если str(a)+str(b) > str(b)+str(a). Используй functools.cmp_to_key для передачи компаратора в sorted.',
      solution: 'from functools import cmp_to_key\n\ndef largestNumber(nums):\n    def compare(a, b):\n        if a + b > b + a:\n            return -1  # a идёт перед b\n        elif a + b < b + a:\n            return 1\n        return 0\n\n    str_nums = [str(n) for n in nums]\n    str_nums.sort(key=cmp_to_key(compare))\n\n    result = "".join(str_nums)\n    # Edge case: все нули\n    return "0" if result[0] == "0" else result',
      explanation: 'Подход: нестандартный компаратор. Если "AB" > "BA" (строковое сравнение) то A должно идти перед B.\nКорректность: транзитивность отношения a+b > b+a гарантирует корректность сортировки.\nСложность: O(n log n * k) где k — длина числа.\nСовет для интервью: объясни почему лексикографического сравнения недостаточно (9 > 34 но "934" > "349"). Компаратор через конкатенацию строк — правильное решение.'
    },
    {
      id: 7,
      title: 'H-Index',
      type: 'practice',
      difficulty: 'medium',
      description: 'Учёный опубликовал n статей с массивом citations (количество цитирований). H-index = max h такое что h статей имеют не менее h цитирований. LeetCode #274.',
      requirements: [
        'Принимает список целых чисел',
        'Возвращает h-index',
        'H-index всегда существует (минимум 0)',
        'Реализуй оба подхода: сортировка и counting sort'
      ],
      expectedOutput: 'Вход: citations=[3,0,6,1,5]\nВыход: 3\n(3 статьи имеют >= 3 цитирований)\nВход: citations=[1,3,1]\nВыход: 1',
      hint: 'Сортируй по убыванию. Для каждого i (1-indexed): если citations[i-1] >= i — значит есть i статей с >= i цитирований. Максимальное такое i — ответ.',
      solution: 'def hIndex(citations):\n    citations.sort(reverse=True)\n    h = 0\n    for i, c in enumerate(citations):\n        if c >= i + 1:\n            h = i + 1\n        else:\n            break\n    return h\n\n# Counting sort O(n) — без сортировки\ndef hIndexCounting(citations):\n    n = len(citations)\n    count = [0] * (n + 1)\n    for c in citations:\n        count[min(c, n)] += 1  # > n то же что n для H-index\n\n    total = 0\n    for h in range(n, -1, -1):\n        total += count[h]\n        if total >= h:\n            return h\n    return 0',
      explanation: 'Подход 1: сортировка по убыванию. Проходим и проверяем инвариант: i статей имеют >= i цитирований.\nПодход 2: counting sort — O(n) времени. Подсчитываем количество статей с >= h цитирований справа налево.\nСложность: O(n log n) и O(n).\nСовет для интервью: h-index — реальная метрика в науке. Counting sort уместен т.к. ответ ограничен [0, n].'
    },
    {
      id: 8,
      title: 'Wiggle Sort II',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums. Переставь элементы так чтобы nums[0] < nums[1] > nums[2] < nums[3]... Гарантировано что ответ существует. LeetCode #324.',
      requirements: [
        'Принимает список целых чисел',
        'Переставляет элементы in-place',
        'Условие: nums[i] < nums[i+1] для чётных i, nums[i] > nums[i+1] для нечётных i',
        'Строгое неравенство (не >=)'
      ],
      expectedOutput: 'Вход: nums=[1,5,1,1,6,4]\nВыход: [1,6,1,5,1,4] или [1,4,1,5,1,6]\nВход: nums=[1,3,2,2,3,1]\nВыход: [2,3,1,3,1,2]',
      hint: 'Сортируй. Раздели на две половины: меньшую и большую. Заполни нечётные позиции (1,3,5,...) большей половиной с конца, чётные (0,2,4,...) — меньшей с конца. Обратный порядок избегает равных соседей.',
      solution: 'def wiggleSort(nums):\n    n = len(nums)\n    # Сортируем и берём медиану для разделения\n    sorted_nums = sorted(nums)\n    # Меньшая половина: sorted_nums[:(n+1)//2]\n    # Большая половина: sorted_nums[(n+1)//2:]\n\n    # Заполняем в обратном порядке чтобы избежать равных соседей\n    mid = (n - 1) // 2\n    hi = n - 1\n\n    # Чётные индексы (0,2,4,...) <- меньшая половина справа налево\n    j = 0\n    for i in range(mid, -1, -1):\n        nums[j] = sorted_nums[i]\n        j += 2\n\n    # Нечётные индексы (1,3,5,...) <- большая половина справа налево\n    j = 1\n    for i in range(n - 1, mid, -1):\n        nums[j] = sorted_nums[i]\n        j += 2\n\n# Простой жадный подход (не всегда корректен для строгого неравенства)\ndef wiggleSortSimple(nums):\n    for i in range(1, len(nums)):\n        if (i % 2 == 1 and nums[i] < nums[i-1]) or \\\n           (i % 2 == 0 and nums[i] > nums[i-1]):\n            nums[i], nums[i-1] = nums[i-1], nums[i]',
      explanation: 'Подход: разбиваем на две половины (меньшую и большую). Заполняем в обратном порядке: самые большие в большей половине -> нечётные позиции, средние -> чётные. Это гарантирует строгие неравенства.\nСложность: O(n log n) по времени, O(n) памяти.\nСовет для интервью: простой жадный O(n) не гарантирует строгие неравенства при дубликатах. Подход с двумя половинами — правильное решение для строгих неравенств.'
    }
  ]
}
