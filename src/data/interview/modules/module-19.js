export default {
  id: 19,
  title: 'Coding: кучи (heaps)',
  description: 'Задачи на кучи (priority queue): k-е элементы, медианы, потоки данных и оптимальные планировщики.',
  lessons: [
    {
      id: 1,
      title: 'K-е наибольшее число в массиве',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив целых чисел и число k. Найди k-е наибольшее число в отсортированном порядке (не k-е уникальное). LeetCode #215.',
      requirements: [
        'Принимает список nums и целое k',
        'Возвращает k-е наибольшее значение',
        'k всегда валидно',
        'Оптимальный подход: O(n log k) через min-heap размера k'
      ],
      expectedOutput: 'Вход: nums=[3,2,1,5,6,4], k=2\nВыход: 5\nВход: nums=[3,2,3,1,2,4,5,5,6], k=4\nВыход: 4',
      hint: 'Поддерживай min-heap размером k. Для каждого нового числа: если оно больше вершины кучи — вытесняй вершину. В итоге в куче k наибольших, на вершине — k-е наибольшее.',
      solution: 'import heapq\n\ndef findKthLargest(nums, k):\n    # Min-heap размера k\n    heap = []\n    for num in nums:\n        heapq.heappush(heap, num)\n        if len(heap) > k:\n            heapq.heappop(heap)\n    return heap[0]  # вершина min-heap = k-е наибольшее\n\n# Альтернатива: quickselect O(n) в среднем\ndef findKthLargestQuickselect(nums, k):\n    target = len(nums) - k  # k-е наибольшее = (n-k)-е наименьшее\n\n    def partition(left, right):\n        pivot = nums[right]\n        store = left\n        for i in range(left, right):\n            if nums[i] <= pivot:\n                nums[i], nums[store] = nums[store], nums[i]\n                store += 1\n        nums[store], nums[right] = nums[right], nums[store]\n        return store\n\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        pivot_idx = partition(left, right)\n        if pivot_idx == target:\n            return nums[pivot_idx]\n        elif pivot_idx < target:\n            left = pivot_idx + 1\n        else:\n            right = pivot_idx - 1',
      explanation: 'Подход heap: поддерживаем min-heap из k наибольших. Вершина — ответ.\nПодход quickselect: O(n) в среднем, O(n^2) в худшем случае.\nСложность heap: O(n log k) по времени, O(k) по памяти.\nСовет для интервью: heap подход прост и предсказуем. Quickselect быстрее в среднем, но нестабилен. Для потоков данных heap обязателен.'
    },
    {
      id: 2,
      title: 'Последний камень',
      type: 'practice',
      difficulty: 'easy',
      description: 'Есть несколько камней с весами. Каждый ход: берём два самых тяжёлых камня x и y (x <= y). Если x == y — оба разрушаются. Если x != y — x разрушается, y принимает вес y-x. Верни вес последнего камня или 0. LeetCode #1046.',
      requirements: [
        'Принимает список целых чисел',
        'Возвращает вес последнего камня (или 0 если камней не осталось)',
        'Использует max-heap',
        'В Python heapq — min-heap, используй отрицательные значения'
      ],
      expectedOutput: 'Вход: stones=[2,7,4,1,8,1]\nВыход: 1\n(8 vs 7 -> 1, 2 vs 4 -> 2, 1 vs 2 -> 1, 1 vs 1 -> 0, ост. 1)',
      hint: 'Python heapq реализует min-heap. Для max-heap помещай отрицательные числа: heappush(heap, -x). Извлекая -heappop(heap) получаем максимум.',
      solution: 'import heapq\n\ndef lastStoneWeight(stones):\n    # Превращаем в max-heap через отрицательные значения\n    heap = [-s for s in stones]\n    heapq.heapify(heap)\n\n    while len(heap) > 1:\n        y = -heapq.heappop(heap)  # самый тяжёлый\n        x = -heapq.heappop(heap)  # второй по тяжести\n        if x != y:\n            heapq.heappush(heap, -(y - x))\n\n    return -heap[0] if heap else 0',
      explanation: 'Подход: max-heap позволяет за O(log n) извлекать максимальный элемент.\nСложность: O(n log n) по времени, O(n) по памяти.\nСовет для интервью: трюк с отрицательными числами для max-heap в Python — стандартный приём. Знай его наизусть.'
    },
    {
      id: 3,
      title: 'K ближайших точек к началу координат',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан список точек на плоскости и число k. Найди k точек, ближайших к началу координат (0,0). Расстояние — евклидово. LeetCode #973.',
      requirements: [
        'Принимает список точек [[x1,y1],...] и k',
        'Возвращает список k ближайших точек',
        'Порядок в ответе не важен',
        'Оптимально: max-heap размера k'
      ],
      expectedOutput: 'Вход: points=[[1,3],[-2,2]], k=1\nВыход: [[-2,2]]\nВход: points=[[3,3],[5,-1],[-2,4]], k=2\nВыход: [[3,3],[-2,4]]',
      hint: 'Можно сортировать по расстоянию. Для эффективности используй max-heap размером k: если новая точка ближе чем вершина кучи — вытесняй вершину. Расстояние^2 избегает sqrt.',
      solution: 'import heapq\n\ndef kClosest(points, k):\n    # Max-heap размером k (храним отрицательные расстояния)\n    heap = []\n    for x, y in points:\n        dist = x*x + y*y  # квадрат расстояния (без sqrt)\n        heapq.heappush(heap, (-dist, x, y))\n        if len(heap) > k:\n            heapq.heappop(heap)\n    return [[x, y] for _, x, y in heap]\n\n# Простой вариант через сортировку\ndef kClosestSort(points, k):\n    return sorted(points, key=lambda p: p[0]**2 + p[1]**2)[:k]\n\n# Quickselect O(n) в среднем\ndef kClosestQuickselect(points, k):\n    dist = lambda p: p[0]**2 + p[1]**2\n    points.sort(key=dist)\n    return points[:k]',
      explanation: 'Подход heap: поддерживаем k ближайших точек через max-heap. Если новая точка ближе чем самая дальняя из k — заменяем.\nСложность: O(n log k) heap, O(n log n) сортировка.\nСовет для интервью: используй квадрат расстояния вместо sqrt для избежания вычислений с плавающей точкой.'
    },
    {
      id: 4,
      title: 'Task Scheduler',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан список задач (буквы) и число n — минимальный интервал между одинаковыми задачами. Найди минимальное время выполнения всех задач. Можно вставлять idle. LeetCode #621.',
      requirements: [
        'Принимает список задач и целое n',
        'Возвращает минимальное количество интервалов',
        'Задачи можно выполнять в любом порядке',
        'Жадный подход: каждый раз берём самую частую доступную задачу'
      ],
      expectedOutput: 'Вход: tasks=["A","A","A","B","B","B"], n=2\nВыход: 8\n(A->B->idle->A->B->idle->A->B)',
      hint: 'Используй max-heap по частоте задач. Каждые n+1 слотов — один "цикл". В каждом цикле берём до n+1 задач с наибольшей частотой, остаток заполняем idle.',
      solution: 'import heapq\nfrom collections import Counter, deque\n\ndef leastInterval(tasks, n):\n    count = Counter(tasks)\n    max_heap = [-c for c in count.values()]\n    heapq.heapify(max_heap)\n\n    time = 0\n    cooldown_queue = deque()  # (count, available_time)\n\n    while max_heap or cooldown_queue:\n        time += 1\n        if max_heap:\n            cnt = heapq.heappop(max_heap) + 1  # -1 к счётчику\n            if cnt < 0:  # ещё остались задачи\n                cooldown_queue.append((cnt, time + n))\n        if cooldown_queue and cooldown_queue[0][1] == time:\n            heapq.heappush(max_heap, cooldown_queue.popleft()[0])\n\n    return time\n\n# Математическое решение\ndef leastIntervalMath(tasks, n):\n    count = Counter(tasks)\n    max_count = max(count.values())\n    # Количество задач с максимальной частотой\n    max_count_tasks = sum(1 for c in count.values() if c == max_count)\n    # Формула: max(len(tasks), (max_count-1)*(n+1) + max_count_tasks)\n    return max(len(tasks), (max_count - 1) * (n + 1) + max_count_tasks)',
      explanation: 'Подход heap: имитируем время с кулдауном. cooldown_queue хранит задачи с временем когда они снова доступны.\nМатематика: строим "фреймы" из n+1 слотов, самая частая задача занимает первый слот каждого фрейма.\nСложность: O(m log m) где m — количество уникальных задач. O(len(tasks)) для математики.\nСовет для интервью: объясни оба подхода. Математическое решение O(m) но требует инсайта.'
    },
    {
      id: 5,
      title: 'Design Twitter Feed',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй упрощённую ленту Twitter. Операции: postTweet(userId, tweetId), getNewsFeed(userId) — 10 последних твитов из ленты пользователя и его подписок, follow(followerId, followeeId), unfollow(followerId, followeeId). LeetCode #355.',
      requirements: [
        'postTweet: пользователь публикует твит',
        'getNewsFeed: возвращает до 10 последних твитов в хронологическом порядке',
        'follow/unfollow: управление подписками',
        'Использует heap для эффективного merge sorted lists'
      ],
      expectedOutput: 'twitter.postTweet(1, 5)\ntwitter.getNewsFeed(1) -> [5]\ntwitter.follow(1, 2)\ntwitter.postTweet(2, 6)\ntwitter.getNewsFeed(1) -> [6, 5]\ntwitter.unfollow(1, 2)\ntwitter.getNewsFeed(1) -> [5]',
      hint: 'Для каждого пользователя храни список твитов с timestamp. getNewsFeed — это merge k sorted lists через max-heap где k — количество подписок + 1.',
      solution: 'import heapq\nfrom collections import defaultdict\n\nclass Twitter:\n    def __init__(self):\n        self.timestamp = 0\n        self.tweets = defaultdict(list)  # userId -> [(time, tweetId)]\n        self.following = defaultdict(set)  # userId -> set of followeeIds\n\n    def postTweet(self, userId, tweetId):\n        self.tweets[userId].append((self.timestamp, tweetId))\n        self.timestamp -= 1  # убывающий для min-heap (последние первыми)\n\n    def getNewsFeed(self, userId):\n        # Собираем все ленты: свою + подписки\n        result = []\n        heap = []\n\n        users = self.following[userId] | {userId}\n        for uid in users:\n            if self.tweets[uid]:\n                # Берём последний твит каждого пользователя\n                idx = len(self.tweets[uid]) - 1\n                time, tweet_id = self.tweets[uid][idx]\n                heapq.heappush(heap, (time, tweet_id, uid, idx))\n\n        while heap and len(result) < 10:\n            time, tweet_id, uid, idx = heapq.heappop(heap)\n            result.append(tweet_id)\n            if idx > 0:  # у этого пользователя ещё есть твиты\n                idx -= 1\n                time2, tweet_id2 = self.tweets[uid][idx]\n                heapq.heappush(heap, (time2, tweet_id2, uid, idx))\n\n        return result\n\n    def follow(self, followerId, followeeId):\n        self.following[followerId].add(followeeId)\n\n    def unfollow(self, followerId, followeeId):\n        self.following[followerId].discard(followeeId)',
      explanation: 'Подход: merge k sorted lists — классическое применение heap. Для каждого пользователя берём его последний твит, затем итеративно извлекаем максимум и добавляем следующий твит того же пользователя.\nСложность: getNewsFeed O(k log k) где k — подписки. postTweet O(1).\nСовет для интервью: задача проектирования. Обсуди трейдоффы: хранение всех твитов в памяти vs. база данных, шардирование по userId.'
    },
    {
      id: 6,
      title: 'Медиана из потока данных',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй структуру данных MedianFinder с методами addNum(num) и findMedian(). findMedian() возвращает медиану всех добавленных чисел. LeetCode #295.',
      requirements: [
        'addNum(num): добавляет число в поток',
        'findMedian(): возвращает текущую медиану',
        'Если чётное количество элементов — медиана среднее двух центральных',
        'Оптимально: O(log n) для addNum, O(1) для findMedian'
      ],
      expectedOutput: 'addNum(1)\naddNum(2)\nfindMedian() -> 1.5\naddNum(3)\nfindMedian() -> 2.0',
      hint: 'Два heap: max-heap для левой половины (меньшие числа), min-heap для правой (большие числа). Балансируй их размеры: |left| == |right| или |left| == |right| + 1.',
      solution: 'import heapq\n\nclass MedianFinder:\n    def __init__(self):\n        self.small = []  # max-heap (левая половина, через отрицательные)\n        self.large = []  # min-heap (правая половина)\n\n    def addNum(self, num):\n        # Добавляем в max-heap\n        heapq.heappush(self.small, -num)\n\n        # Балансировка: вершина small <= вершины large\n        if self.small and self.large and (-self.small[0]) > self.large[0]:\n            val = -heapq.heappop(self.small)\n            heapq.heappush(self.large, val)\n\n        # Балансировка размеров: small может быть на 1 больше\n        if len(self.small) > len(self.large) + 1:\n            val = -heapq.heappop(self.small)\n            heapq.heappush(self.large, val)\n        elif len(self.large) > len(self.small):\n            val = heapq.heappop(self.large)\n            heapq.heappush(self.small, -val)\n\n    def findMedian(self):\n        if len(self.small) > len(self.large):\n            return float(-self.small[0])\n        return (-self.small[0] + self.large[0]) / 2.0',
      explanation: 'Подход: два heap делят данные на нижнюю и верхнюю половины. small (max-heap) содержит меньшие числа, large (min-heap) — большие. Медиана — вершина small или среднее двух вершин.\nСложность: O(log n) для addNum, O(1) для findMedian.\nСовет для интервью: одна из самых известных hard задач. Объясни инвариант: max(small) <= min(large) и |small| - |large| <= 1.'
    },
    {
      id: 7,
      title: 'Слияние K отсортированных списков',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив из k связных списков, каждый отсортирован в возрастающем порядке. Объедини их в один отсортированный список. LeetCode #23.',
      requirements: [
        'Принимает список ListNode (связных списков)',
        'Возвращает голову объединённого списка',
        'Использует min-heap для эффективного слияния',
        'Обрабатывает пустые списки'
      ],
      expectedOutput: 'Вход: lists=[[1,4,5],[1,3,4],[2,6]]\nВыход: [1,1,2,3,4,4,5,6]',
      hint: 'Добавь голову каждого списка в min-heap. Извлекай минимум, добавляй к результату, затем добавь следующий элемент того же списка в heap.',
      solution: 'import heapq\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef mergeKLists(lists):\n    dummy = ListNode(0)\n    curr = dummy\n    heap = []\n\n    # Инициализируем heap головами всех списков\n    for i, node in enumerate(lists):\n        if node:\n            heapq.heappush(heap, (node.val, i, node))\n\n    while heap:\n        val, i, node = heapq.heappop(heap)\n        curr.next = node\n        curr = curr.next\n        if node.next:\n            heapq.heappush(heap, (node.next.val, i, node.next))\n\n    return dummy.next\n\n# Divide & Conquer подход\ndef mergeKListsDnC(lists):\n    if not lists:\n        return None\n\n    def merge2(l1, l2):\n        dummy = ListNode(0)\n        curr = dummy\n        while l1 and l2:\n            if l1.val <= l2.val:\n                curr.next, l1 = l1, l1.next\n            else:\n                curr.next, l2 = l2, l2.next\n            curr = curr.next\n        curr.next = l1 or l2\n        return dummy.next\n\n    while len(lists) > 1:\n        merged = []\n        for i in range(0, len(lists), 2):\n            l1 = lists[i]\n            l2 = lists[i+1] if i+1 < len(lists) else None\n            merged.append(merge2(l1, l2))\n        lists = merged\n    return lists[0]',
      explanation: 'Подход heap: min-heap из k элементов. Индекс i добавлен в кортеж для разрыва ничьей при равных значениях.\nDivide & Conquer: объединяем попарно, O(n log k) — каждый элемент участвует в log k слияниях.\nСложность: O(n log k) по времени, O(k) памяти для heap.\nСовет для интервью: обоснуй почему O(n log k) лучше чем наивное O(nk). Это классический пример где структура данных кардинально улучшает алгоритм.'
    },
    {
      id: 8,
      title: 'Реорганизовать строку',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s. Переставь буквы так, чтобы никакие две одинаковые буквы не стояли рядом. Если это невозможно — верни пустую строку. LeetCode #767.',
      requirements: [
        'Принимает строку',
        'Возвращает переставленную строку или ""',
        'Использует greedy подход с max-heap',
        'Невозможно если любая буква встречается > (n+1)/2 раз'
      ],
      expectedOutput: 'Вход: s="aab"\nВыход: "aba"\nВход: s="aaab"\nВыход: ""',
      hint: 'Каждый раз ставь самую частую букву которая не совпадает с предыдущей. Max-heap по частоте. Если самая частая == предыдущая — ставь вторую по частоте.',
      solution: 'import heapq\nfrom collections import Counter\n\ndef reorganizeString(s):\n    count = Counter(s)\n    max_heap = [(-freq, char) for char, freq in count.items()]\n    heapq.heapify(max_heap)\n\n    result = []\n    prev_freq, prev_char = 0, ""\n\n    while max_heap:\n        freq, char = heapq.heappop(max_heap)\n        result.append(char)\n\n        # Возвращаем предыдущий символ обратно в heap\n        if prev_freq < 0:\n            heapq.heappush(max_heap, (prev_freq, prev_char))\n\n        prev_freq = freq + 1  # уменьшаем частоту (freq отрицательный)\n        prev_char = char\n\n    result_str = "".join(result)\n    # Проверка валидности\n    for i in range(1, len(result_str)):\n        if result_str[i] == result_str[i-1]:\n            return ""\n    return result_str if len(result_str) == len(s) else ""',
      explanation: 'Подход: жадно выбираем самую частую доступную букву. "Кулдаун" в 1 слот — предыдущую букву не можем использовать.\nСложность: O(n log m) где m — количество уникальных букв (максимум 26).\nСовет для интервью: упомяни что для большого алфавита это задача задача планировщика (Task Scheduler #621). Также можно решить через интерливинг: сначала заполняем чётные позиции, потом нечётные.'
    }
  ]
}
