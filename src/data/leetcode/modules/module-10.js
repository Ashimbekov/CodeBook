export default {
  id: 10,
  title: 'Heap / Priority Queue',
  description: 'Куча и приоритетная очередь: top K задачи, merge K sorted, медиана потока.',
  lessons: [
    {
      id: 1,
      title: 'Heap: когда и зачем',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Priority Queue на собеседованиях'
        },
        {
          type: 'text',
          value: 'Heap (куча) — структура данных для эффективного получения минимума/максимума. Основные операции: вставка O(log n), извлечение min/max O(log n), просмотр min/max O(1).'
        },
        {
          type: 'heading',
          value: 'Когда применять Heap'
        },
        {
          type: 'list',
          value: [
            'Top K / K-th largest/smallest — не нужно сортировать всё',
            'Merge K sorted — объединение нескольких отсортированных списков',
            'Stream processing — обработка потока данных (медиана, скользящий максимум)',
            'Greedy with priority — жадные алгоритмы с приоритетом'
          ]
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Минимальная куча на JavaScript\nclass MinHeap {\n  constructor() { this.heap = []; }\n\n  push(val) {\n    this.heap.push(val);\n    this._bubbleUp(this.heap.length - 1);\n  }\n\n  pop() {\n    const min = this.heap[0];\n    const last = this.heap.pop();\n    if (this.heap.length) {\n      this.heap[0] = last;\n      this._sinkDown(0);\n    }\n    return min;\n  }\n\n  peek() { return this.heap[0]; }\n  size() { return this.heap.length; }\n\n  _bubbleUp(i) {\n    while (i > 0) {\n      const parent = (i - 1) >> 1;\n      if (this.heap[i] >= this.heap[parent]) break;\n      [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];\n      i = parent;\n    }\n  }\n\n  _sinkDown(i) {\n    const n = this.heap.length;\n    while (true) {\n      let smallest = i;\n      const left = 2 * i + 1, right = 2 * i + 2;\n      if (left < n && this.heap[left] < this.heap[smallest]) smallest = left;\n      if (right < n && this.heap[right] < this.heap[smallest]) smallest = right;\n      if (smallest === i) break;\n      [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];\n      i = smallest;\n    }\n  }\n}'
        },
        {
          type: 'tip',
          value: 'В Python используйте heapq (min-heap). Для max-heap: вставляйте -val. В Java — PriorityQueue. В JS нет встроенной кучи — нужно реализовать или использовать сортировку.'
        }
      ]
    },
    {
      id: 2,
      title: 'Top K паттерн',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Три подхода к Top K'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import heapq\n\n# Подход 1: Сортировка — O(n log n)\ndef topK_sort(nums, k):\n    return sorted(nums, reverse=True)[:k]\n\n# Подход 2: Min-heap размера k — O(n log k)\ndef topK_heap(nums, k):\n    # Поддерживаем кучу из k наибольших\n    heap = []\n    for num in nums:\n        heapq.heappush(heap, num)\n        if len(heap) > k:\n            heapq.heappop(heap)  # убираем наименьший\n    return heap\n\n# Подход 3: Quickselect — O(n) в среднем\n# (см. модуль Backtracking)\n\n# Пример: top 3 из [3,1,5,12,2,11]\n# Heap: [5, 11, 12] (min-heap, peek = 5 = 3-й по величине)'
        },
        {
          type: 'note',
          value: 'Ключевой инсайт для Top K Largest: используйте min-heap размера k. Минимум кучи = k-й по величине элемент. Если новый элемент больше минимума — заменяем. Итого O(n log k).'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Kth Largest Element',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #215: найдите k-й по величине элемент в массиве.',
      requirements: [
        'Реализуйте функцию findKthLargest(nums, k)',
        'Верните k-й по величине элемент (не k-й уникальный)',
        'Решение с min-heap: O(n log k)'
      ],
      hint: 'Поддерживайте min-heap размера k. В конце вершина кучи = k-й по величине.',
      expectedOutput: 'findKthLargest([3,2,1,5,6,4], 2) -> 5\nfindKthLargest([3,2,3,1,2,4,5,5,6], 4) -> 4',
      solution: '// JavaScript с ручной кучей\nfunction findKthLargest(nums, k) {\n  const heap = new MinHeap();\n\n  for (const num of nums) {\n    heap.push(num);\n    if (heap.size() > k) {\n      heap.pop(); // убираем наименьший\n    }\n  }\n\n  return heap.peek(); // k-й по величине\n}\n\n// Python решение (для собеседования):\n// import heapq\n// def findKthLargest(nums, k):\n//     heap = []\n//     for num in nums:\n//         heapq.heappush(heap, num)\n//         if len(heap) > k:\n//             heapq.heappop(heap)\n//     return heap[0]\n\n// Альтернатива: QuickSelect — O(n) в среднем\nfunction findKthLargestQS(nums, k) {\n  k = nums.length - k; // k-й с конца\n\n  function quickSelect(lo, hi) {\n    const pivot = nums[hi];\n    let p = lo;\n    for (let i = lo; i < hi; i++) {\n      if (nums[i] <= pivot) {\n        [nums[i], nums[p]] = [nums[p], nums[i]];\n        p++;\n      }\n    }\n    [nums[p], nums[hi]] = [nums[hi], nums[p]];\n\n    if (p === k) return nums[p];\n    if (p < k) return quickSelect(p + 1, hi);\n    return quickSelect(lo, p - 1);\n  }\n\n  return quickSelect(0, nums.length - 1);\n}',
      explanation: 'Min-heap размера k: после обработки всех элементов, в куче останутся k наибольших, а на вершине — наименьший из них = k-й по величине. QuickSelect работает за O(n) в среднем, но O(n^2) в худшем. На собеседовании покажите оба подхода.'
    },
    {
      id: 4,
      title: 'Практика: Merge K Sorted Lists',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #23: объедините k отсортированных связных списков в один.',
      requirements: [
        'Реализуйте функцию mergeKLists(lists)',
        'lists — массив отсортированных связных списков',
        'Верните один отсортированный список',
        'Оптимальное решение с min-heap: O(n log k)'
      ],
      hint: 'Положите головы всех списков в min-heap. Извлекайте минимум, добавляйте в результат, кладите его next в кучу.',
      expectedOutput: 'mergeKLists([[1,4,5],[1,3,4],[2,6]]) -> [1,1,2,3,4,4,5,6]',
      solution: '// С min-heap\nfunction mergeKLists(lists) {\n  const heap = new MinHeap(); // сравнение по val\n  const dummy = new ListNode(0);\n  let curr = dummy;\n\n  // Инициализация: добавляем головы\n  for (const head of lists) {\n    if (head) heap.push(head);\n  }\n\n  while (heap.size() > 0) {\n    const node = heap.pop();\n    curr.next = node;\n    curr = curr.next;\n    if (node.next) heap.push(node.next);\n  }\n\n  return dummy.next;\n}\n\n// Альтернатива: Divide and Conquer\nfunction mergeKListsDC(lists) {\n  if (!lists.length) return null;\n  if (lists.length === 1) return lists[0];\n\n  const mid = Math.floor(lists.length / 2);\n  const left = mergeKListsDC(lists.slice(0, mid));\n  const right = mergeKListsDC(lists.slice(mid));\n\n  return mergeTwoLists(left, right);\n}\n\nfunction mergeTwoLists(l1, l2) {\n  const dummy = new ListNode(0);\n  let curr = dummy;\n  while (l1 && l2) {\n    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }\n    else { curr.next = l2; l2 = l2.next; }\n    curr = curr.next;\n  }\n  curr.next = l1 || l2;\n  return dummy.next;\n}',
      explanation: 'Heap подход: O(n log k), где n — общее количество узлов, k — количество списков. На каждом шаге извлекаем минимум за O(log k). Divide & Conquer: O(n log k) — merge по парам log k раз. Оба подхода оптимальны. На собеседовании покажите heap-решение как основное.'
    },
    {
      id: 5,
      title: 'Практика: Find Median from Data Stream',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #295: найдите медиану потока чисел, поддерживая addNum и findMedian.',
      requirements: [
        'Реализуйте класс MedianFinder',
        'addNum(num): добавить число из потока',
        'findMedian(): вернуть текущую медиану',
        'Оба метода должны быть эффективными'
      ],
      hint: 'Используйте два кучи: max-heap для левой половины, min-heap для правой. Медиана — средний элемент(ы) на стыке.',
      expectedOutput: 'addNum(1), addNum(2), findMedian() -> 1.5\naddNum(3), findMedian() -> 2.0',
      solution: 'class MedianFinder {\n  constructor() {\n    this.maxHeap = new MaxHeap(); // левая половина (меньшие)\n    this.minHeap = new MinHeap(); // правая половина (большие)\n  }\n\n  addNum(num) {\n    // Всегда добавляем в maxHeap сначала\n    this.maxHeap.push(num);\n\n    // Балансировка: max левой <= min правой\n    if (\n      this.minHeap.size() &&\n      this.maxHeap.peek() > this.minHeap.peek()\n    ) {\n      this.minHeap.push(this.maxHeap.pop());\n    }\n\n    // Балансировка размеров: |maxHeap| - |minHeap| <= 1\n    if (this.maxHeap.size() > this.minHeap.size() + 1) {\n      this.minHeap.push(this.maxHeap.pop());\n    } else if (this.minHeap.size() > this.maxHeap.size()) {\n      this.maxHeap.push(this.minHeap.pop());\n    }\n  }\n\n  findMedian() {\n    if (this.maxHeap.size() > this.minHeap.size()) {\n      return this.maxHeap.peek();\n    }\n    return (this.maxHeap.peek() + this.minHeap.peek()) / 2;\n  }\n}\n\n// Python решение:\n// import heapq\n// class MedianFinder:\n//     def __init__(self):\n//         self.small = []  # max-heap (хранить отрицательные)\n//         self.large = []  # min-heap\n//     def addNum(self, num):\n//         heapq.heappush(self.small, -num)\n//         heapq.heappush(self.large, -heapq.heappop(self.small))\n//         if len(self.large) > len(self.small):\n//             heapq.heappush(self.small, -heapq.heappop(self.large))\n//     def findMedian(self):\n//         if len(self.small) > len(self.large):\n//             return -self.small[0]\n//         return (-self.small[0] + self.large[0]) / 2',
      explanation: 'Два кучи: maxHeap хранит меньшую половину (вершина — максимум), minHeap — большую половину (вершина — минимум). Инвариант: maxHeap.peek() <= minHeap.peek() и размеры отличаются не более чем на 1. Медиана — либо вершина maxHeap (если больше элементов), либо среднее двух вершин. addNum: O(log n), findMedian: O(1).'
    },
    {
      id: 6,
      title: 'Практика: K Closest Points to Origin',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #973: найдите k ближайших точек к началу координат.',
      requirements: [
        'Реализуйте функцию kClosest(points, k)',
        'points[i] = [xi, yi]',
        'Расстояние = sqrt(x^2 + y^2), но можно сравнивать x^2 + y^2',
        'Верните k ближайших точек'
      ],
      hint: 'Max-heap размера k: если новая точка ближе текущего максимума в куче — заменяем. Или используйте сортировку по расстоянию.',
      expectedOutput: 'kClosest([[1,3],[-2,2]], 1) -> [[-2,2]]\nkClosest([[3,3],[5,-1],[-2,4]], 2) -> [[3,3],[-2,4]]',
      solution: '// Решение с сортировкой — O(n log n)\nfunction kClosest(points, k) {\n  return points\n    .sort((a, b) => (a[0]**2 + a[1]**2) - (b[0]**2 + b[1]**2))\n    .slice(0, k);\n}\n\n// Решение с max-heap размера k — O(n log k)\nfunction kClosestHeap(points, k) {\n  // Max-heap по расстоянию\n  const heap = []; // [distance, point]\n\n  for (const point of points) {\n    const dist = point[0]**2 + point[1]**2;\n    heap.push([dist, point]);\n    // Упрощённая версия: сортируем после каждого push\n    heap.sort((a, b) => b[0] - a[0]);\n    if (heap.length > k) heap.pop();\n  }\n\n  return heap.map(h => h[1]);\n}\n\nconsole.log(kClosest([[1,3],[-2,2]], 1));\n// [[-2,2]], dist = 4+4 = 8 < 1+9 = 10\n\nconsole.log(kClosest([[3,3],[5,-1],[-2,4]], 2));\n// [[3,3],[-2,4]]',
      explanation: 'Для Top K Closest используем max-heap размера k (чтобы эффективно убирать самую далёкую точку). Сравниваем x^2+y^2 вместо sqrt (избегаем вычисления корня). Сортировка O(n log n) проще в реализации, heap O(n log k) эффективнее при k << n.'
    },
    {
      id: 7,
      title: 'Практика: Task Scheduler',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #621: определите минимальное время выполнения задач с cooldown.',
      requirements: [
        'Реализуйте функцию leastInterval(tasks, n)',
        'tasks — массив задач (буквы A-Z)',
        'Между одинаковыми задачами должно быть минимум n интервалов',
        'В пустой интервал процессор простаивает (idle)'
      ],
      hint: 'Самая частая задача определяет длину. Формула: (maxFreq - 1) * (n + 1) + countOfMaxFreq. Результат = max(формула, tasks.length).',
      expectedOutput: 'leastInterval(["A","A","A","B","B","B"], 2) -> 8\nleastInterval(["A","A","A","B","B","B"], 0) -> 6',
      solution: 'function leastInterval(tasks, n) {\n  const freq = new Array(26).fill(0);\n  for (const task of tasks) {\n    freq[task.charCodeAt(0) - 65]++;\n  }\n\n  const maxFreq = Math.max(...freq);\n  // Сколько задач имеют максимальную частоту\n  const maxCount = freq.filter(f => f === maxFreq).length;\n\n  // Формула: (maxFreq-1) рамок по (n+1) + maxCount\n  const formula = (maxFreq - 1) * (n + 1) + maxCount;\n\n  // Ответ не может быть меньше общего числа задач\n  return Math.max(formula, tasks.length);\n}\n\nconsole.log(leastInterval(["A","A","A","B","B","B"], 2)); // 8\n// A B _ A B _ A B\n// 3 рамки по 3 (n+1), но последняя только 2 (A,B)\n// (3-1)*3 + 2 = 8\n\nconsole.log(leastInterval(["A","A","A","B","B","B"], 0)); // 6\n// Нет cooldown — просто tasks.length',
      explanation: 'Математическое решение O(n): самая частая задача создаёт "рамки" длиной n+1. Между ними заполняются другие задачи. Если задач мало — будут idle слоты. Если задач много — idle слотов нет, ответ = tasks.length. Формула: max((maxFreq-1)*(n+1)+maxCount, tasks.length).'
    }
  ]
}
