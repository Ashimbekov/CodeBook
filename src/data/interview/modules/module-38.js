export default {
  id: 38,
  title: 'Практикум: FAANG паттерны',
  description: 'Паттерны решения задач на LeetCode: Sliding Window, Two Pointers, Fast/Slow Pointers, Tree BFS/DFS, Two Heaps, Topological Sort. Каждый урок — паттерн с 2-3 задачами-примерами на Python.',
  lessons: [
    {
      id: 1,
      title: 'Паттерн: Sliding Window (скользящее окно)',
      type: 'practice',
      content: [
        { type: 'text', value: 'Паттерн Sliding Window применяется для задач на подмассивах и подстроках фиксированного или переменного размера. Избегает вложенных циклов O(n²) за счёт поддержания окна.\n\nПрименять когда: задача на непрерывном подмассиве/подстроке, нужен максимум/минимум/сумма в окне.' },
        { type: 'heading', value: 'Задача 1: максимальная сумма подмассива длины k' },
        { type: 'code', language: 'python', value: 'def max_sum_subarray(nums, k):\n    window_sum = sum(nums[:k])  # первое окно\n    max_sum = window_sum\n    for i in range(k, len(nums)):\n        window_sum += nums[i] - nums[i - k]  # сдвигаем окно\n        max_sum = max(max_sum, window_sum)\n    return max_sum\n\nprint(max_sum_subarray([2,1,5,1,3,2], 3))  # 9 (5+1+3)' },
        { type: 'heading', value: 'Задача 2: самая длинная подстрока с не более K различными символами' },
        { type: 'code', language: 'python', value: 'from collections import defaultdict\n\ndef longest_k_distinct(s, k):\n    char_count = defaultdict(int)\n    left = 0\n    max_len = 0\n\n    for right in range(len(s)):\n        char_count[s[right]] += 1\n\n        # Сужаем окно если уникальных символов > k\n        while len(char_count) > k:\n            char_count[s[left]] -= 1\n            if char_count[s[left]] == 0:\n                del char_count[s[left]]\n            left += 1\n\n        max_len = max(max_len, right - left + 1)\n\n    return max_len\n\nprint(longest_k_distinct("araaci", 2))  # 4 ("araa")\nprint(longest_k_distinct("cbbebi", 3)) # 5 ("cbbeb")' },
        { type: 'heading', value: 'Задача 3: минимальный подмассив с суммой >= target' },
        { type: 'code', language: 'python', value: 'def min_size_subarray(target, nums):\n    left = 0\n    window_sum = 0\n    min_len = float("inf")\n\n    for right in range(len(nums)):\n        window_sum += nums[right]\n        while window_sum >= target:\n            min_len = min(min_len, right - left + 1)\n            window_sum -= nums[left]\n            left += 1\n\n    return 0 if min_len == float("inf") else min_len\n\nprint(min_size_subarray(7, [2,3,1,2,4,3]))  # 2 ([4,3])' },
        { type: 'tip', value: 'Шаблон: right расширяет окно, while-цикл сужает с left. Для фиксированного окна k — просто сдвигайте: добавить правый, убрать левый (i-k).' }
      ]
    },
    {
      id: 2,
      title: 'Паттерн: Two Pointers (два указателя)',
      type: 'practice',
      content: [
        { type: 'text', value: 'Паттерн Two Pointers использует два указателя на один массив или строку. Обычно движутся навстречу (sorted array) или в одном направлении (partitioning).\n\nПрименять когда: отсортированный массив, поиск пар, partition (удаление элементов).' },
        { type: 'heading', value: 'Задача 1: пара с заданной суммой (отсортированный массив)' },
        { type: 'code', language: 'python', value: 'def two_sum_sorted(arr, target):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        current_sum = arr[left] + arr[right]\n        if current_sum == target:\n            return [left, right]\n        elif current_sum < target:\n            left += 1\n        else:\n            right -= 1\n    return []\n\nprint(two_sum_sorted([1, 2, 3, 4, 6], 6))  # [1, 3] (2+4)' },
        { type: 'heading', value: 'Задача 2: удаление дубликатов in-place' },
        { type: 'code', language: 'python', value: 'def remove_duplicates(nums):\n    # slow: граница уникальных элементов\n    # fast: сканирует массив\n    if not nums:\n        return 0\n    slow = 0\n    for fast in range(1, len(nums)):\n        if nums[fast] != nums[slow]:\n            slow += 1\n            nums[slow] = nums[fast]\n    return slow + 1  # длина без дублей\n\nnums = [1, 1, 2, 3, 3, 4]\nprint(remove_duplicates(nums), nums[:3])  # 4, [1,2,3,4]' },
        { type: 'heading', value: 'Задача 3: разделение массива (Dutch National Flag)' },
        { type: 'code', language: 'python', value: 'def sort_colors(nums):\n    # 0 - красные, 1 - белые, 2 - синие\n    low, mid, high = 0, 0, len(nums) - 1\n    while mid <= high:\n        if nums[mid] == 0:\n            nums[low], nums[mid] = nums[mid], nums[low]\n            low += 1; mid += 1\n        elif nums[mid] == 1:\n            mid += 1\n        else:\n            nums[mid], nums[high] = nums[high], nums[mid]\n            high -= 1  # mid не двигаем!\n    return nums\n\nprint(sort_colors([2,0,2,1,1,0]))  # [0,0,1,1,2,2]' },
        { type: 'note', value: 'Dutch National Flag (три указателя) — паттерн для трёхцветной сортировки. Основа алгоритма QuickSort (partition step).' }
      ]
    },
    {
      id: 3,
      title: 'Паттерн: Fast/Slow Pointers (черепаха и заяц)',
      type: 'practice',
      content: [
        { type: 'text', value: 'Паттерн Fast/Slow Pointers: один указатель движется на 1 шаг, другой на 2. Используется для обнаружения циклов, нахождения середины, перестановки списков.\n\nПрименять когда: связные списки, обнаружение цикла, "счастливое число".' },
        { type: 'heading', value: 'Задача 1: середина связного списка' },
        { type: 'code', language: 'python', value: 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef find_middle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow  # slow в середине\n\n# Для чётного: slow остановится на втором из двух средних\n# 1->2->3->4->5 -> вернёт 3\n# 1->2->3->4   -> вернёт 3 (второй из двух средних)' },
        { type: 'heading', value: 'Задача 2: является ли число "счастливым"' },
        { type: 'code', language: 'python', value: 'def is_happy(n):\n    def next_num(x):\n        return sum(int(d)**2 for d in str(x))\n\n    slow = n\n    fast = next_num(n)\n    while fast != 1 and slow != fast:\n        slow = next_num(slow)\n        fast = next_num(next_num(fast))\n\n    return fast == 1\n\nprint(is_happy(19))  # True: 19->82->68->100->1\nprint(is_happy(2))   # False: уйдёт в цикл' },
        { type: 'heading', value: 'Задача 3: палиндром в связном списке' },
        { type: 'code', language: 'python', value: 'def is_palindrome_list(head):\n    # 1. Находим середину\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n\n    # 2. Разворачиваем вторую половину\n    prev = None\n    while slow:\n        nxt = slow.next\n        slow.next = prev\n        prev = slow\n        slow = nxt\n\n    # 3. Сравниваем\n    left, right = head, prev\n    while right:\n        if left.val != right.val:\n            return False\n        left = left.next\n        right = right.next\n    return True' },
        { type: 'tip', value: 'Fast/Slow: когда fast достигает конца, slow на середине. Математическое свойство: fast = 2 * slow.' }
      ]
    },
    {
      id: 4,
      title: 'Паттерн: Merge Intervals',
      type: 'practice',
      content: [
        { type: 'text', value: 'Паттерн Merge Intervals для задач с перекрывающимися интервалами. Ключевая операция: сортировка по началу интервала.\n\nПрименять когда: расписания встреч, временные интервалы, планирование ресурсов.' },
        { type: 'heading', value: 'Задача 1: вставка интервала в отсортированный список' },
        { type: 'code', language: 'python', value: 'def insert_interval(intervals, new_interval):\n    result = []\n    i = 0\n    n = len(intervals)\n\n    # 1. Добавляем все интервалы ДО нового\n    while i < n and intervals[i][1] < new_interval[0]:\n        result.append(intervals[i])\n        i += 1\n\n    # 2. Сливаем пересекающиеся\n    while i < n and intervals[i][0] <= new_interval[1]:\n        new_interval[0] = min(new_interval[0], intervals[i][0])\n        new_interval[1] = max(new_interval[1], intervals[i][1])\n        i += 1\n    result.append(new_interval)\n\n    # 3. Добавляем все интервалы ПОСЛЕ\n    result.extend(intervals[i:])\n    return result\n\nprint(insert_interval([[1,3],[6,9]], [2,5]))     # [[1,5],[6,9]]\nprint(insert_interval([[1,2],[3,5],[6,7]], [4,8])) # [[1,2],[3,8]]' },
        { type: 'heading', value: 'Задача 2: минимум переговорных комнат' },
        { type: 'code', language: 'python', value: 'import heapq\n\ndef min_meeting_rooms(intervals):\n    if not intervals:\n        return 0\n    intervals.sort(key=lambda x: x[0])\n    # MinHeap хранит время окончания занятых комнат\n    heap = []\n    for start, end in intervals:\n        if heap and heap[0] <= start:\n            heapq.heapreplace(heap, end)  # освобождаем комнату\n        else:\n            heapq.heappush(heap, end)  # нужна новая комната\n    return len(heap)\n\nprint(min_meeting_rooms([[0,30],[5,10],[15,20]]))  # 2\nprint(min_meeting_rooms([[7,10],[2,4]]))           # 1' },
        { type: 'heading', value: 'Задача 3: пересечение двух списков интервалов' },
        { type: 'code', language: 'python', value: 'def interval_intersection(A, B):\n    result = []\n    i = j = 0\n    while i < len(A) and j < len(B):\n        # Пересечение = max начал, min концов\n        start = max(A[i][0], B[j][0])\n        end = min(A[i][1], B[j][1])\n        if start <= end:\n            result.append([start, end])\n        # Двигаем тот что заканчивается раньше\n        if A[i][1] < B[j][1]:\n            i += 1\n        else:\n            j += 1\n    return result\n\nprint(interval_intersection([[0,2],[5,10],[13,23]],\n                            [[1,5],[8,12],[15,24]]))\n# [[1,2],[5,5],[8,10],[15,23]]' },
        { type: 'note', value: 'Паттерн: сортируем → проходим одним циклом, сравнивая текущий конец с следующим началом.' }
      ]
    },
    {
      id: 5,
      title: 'Паттерн: Cyclic Sort',
      type: 'practice',
      content: [
        { type: 'text', value: 'Паттерн Cyclic Sort эффективен для массивов с числами в диапазоне [1, n] или [0, n]. Идея: каждое число кладём на правильный индекс за O(n).\n\nПрименять когда: массив содержит числа из известного диапазона, нужно найти пропущенное/дублирующееся число.' },
        { type: 'heading', value: 'Задача 1: сортировка массива [1..n]' },
        { type: 'code', language: 'python', value: 'def cyclic_sort(nums):\n    i = 0\n    while i < len(nums):\n        correct_idx = nums[i] - 1  # число X должно стоять на индексе X-1\n        if nums[i] != nums[correct_idx]:  # не на своём месте\n            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]\n        else:\n            i += 1\n    return nums\n\nprint(cyclic_sort([3, 1, 5, 4, 2]))  # [1, 2, 3, 4, 5]\nprint(cyclic_sort([2, 6, 4, 3, 1, 5]))  # [1, 2, 3, 4, 5, 6]' },
        { type: 'heading', value: 'Задача 2: найти пропущенное число' },
        { type: 'code', language: 'python', value: 'def find_missing_number(nums):\n    i = 0\n    n = len(nums)\n    while i < n:\n        correct_idx = nums[i]\n        if nums[i] < n and nums[i] != nums[correct_idx]:\n            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]\n        else:\n            i += 1\n    # Ищем где нарушение порядка\n    for i in range(n):\n        if nums[i] != i:\n            return i\n    return n\n\nprint(find_missing_number([4, 0, 3, 1]))  # 2\nprint(find_missing_number([8, 3, 5, 2, 4, 6, 0, 1]))  # 7' },
        { type: 'heading', value: 'Задача 3: найти дублирующееся число' },
        { type: 'code', language: 'python', value: 'def find_duplicate(nums):\n    i = 0\n    while i < len(nums):\n        if nums[i] != i + 1:\n            correct_idx = nums[i] - 1\n            if nums[i] != nums[correct_idx]:\n                nums[i], nums[correct_idx] = nums[correct_idx], nums[i]\n            else:\n                return nums[i]  # дубликат!\n        else:\n            i += 1\n    return -1\n\nprint(find_duplicate([1, 4, 4, 3, 2]))  # 4\nprint(find_duplicate([2, 1, 3, 3, 5]))  # 3' },
        { type: 'tip', value: 'Cyclic Sort: O(n) время, O(1) память. Когда num != nums[correct_idx] — меняем. Когда nums[i] == nums[correct_idx] — нашли дубликат.' }
      ]
    },
    {
      id: 6,
      title: 'Паттерн: In-place LinkedList Reversal',
      type: 'practice',
      content: [
        { type: 'text', value: 'Паттерн разворота связного списка на месте за O(1) доп. памяти. Ключевые операции: разворот всего списка, разворота подсписка, k-групп.\n\nПрименять когда: нужно изменить порядок элементов связного списка.' },
        { type: 'heading', value: 'Задача 1: разворот всего списка' },
        { type: 'code', language: 'python', value: 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head):\n    prev = None\n    current = head\n    while current:\n        nxt = current.next    # сохраняем следующий\n        current.next = prev   # разворачиваем указатель\n        prev = current        # двигаем prev\n        current = nxt         # двигаем current\n    return prev  # новая голова\n\n# 1->2->3->4->5 => 5->4->3->2->1' },
        { type: 'heading', value: 'Задача 2: разворот подсписка [left, right]' },
        { type: 'code', language: 'python', value: 'def reverse_between(head, left, right):\n    if not head or left == right:\n        return head\n\n    dummy = ListNode(0)\n    dummy.next = head\n    prev = dummy\n\n    # Идём до позиции left\n    for _ in range(left - 1):\n        prev = prev.next\n\n    current = prev.next\n    for _ in range(right - left):\n        nxt = current.next\n        current.next = nxt.next\n        nxt.next = prev.next\n        prev.next = nxt\n\n    return dummy.next\n\n# Input: 1->2->3->4->5, left=2, right=4\n# Output: 1->4->3->2->5' },
        { type: 'heading', value: 'Задача 3: разворот k-групп (Reverse Nodes in k-Group)' },
        { type: 'code', language: 'python', value: 'def reverse_k_group(head, k):\n    def reverse(head, k):\n        prev, curr = None, head\n        for _ in range(k):\n            nxt = curr.next\n            curr.next = prev\n            prev = curr\n            curr = nxt\n        return prev  # новая голова\n\n    # Проверяем есть ли k узлов\n    count = 0\n    node = head\n    while node and count < k:\n        node = node.next\n        count += 1\n\n    if count == k:\n        reversed_head = reverse(head, k)\n        head.next = reverse_k_group(node, k)\n        return reversed_head\n\n    return head  # меньше k узлов — не разворачиваем\n\n# [1,2,3,4,5], k=2 -> [2,1,4,3,5]\n# [1,2,3,4,5], k=3 -> [3,2,1,4,5]' },
        { type: 'note', value: 'Шаблон разворота: сохрани следующий, разверни, двинь оба указателя. Три переменные: prev, current, next.' }
      ]
    },
    {
      id: 7,
      title: 'Паттерн: Tree BFS (обход в ширину)',
      type: 'practice',
      content: [
        { type: 'text', value: 'Паттерн Tree BFS использует очередь для обхода дерева по уровням. Идеален для задач "найти ширину уровня", "правое значение каждого уровня", "зигзаг-обход".\n\nПрименять когда: обход по уровням, кратчайший путь, минимальная глубина.' },
        { type: 'heading', value: 'Задача 1: обход по уровням (Level Order Traversal)' },
        { type: 'code', language: 'python', value: 'from collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef level_order(root):\n    if not root:\n        return []\n    result = []\n    queue = deque([root])\n    while queue:\n        level_size = len(queue)  # размер текущего уровня\n        level = []\n        for _ in range(level_size):\n            node = queue.popleft()\n            level.append(node.val)\n            if node.left: queue.append(node.left)\n            if node.right: queue.append(node.right)\n        result.append(level)\n    return result' },
        { type: 'heading', value: 'Задача 2: правый вид дерева (Right Side View)' },
        { type: 'code', language: 'python', value: 'def right_side_view(root):\n    if not root:\n        return []\n    result = []\n    queue = deque([root])\n    while queue:\n        level_size = len(queue)\n        for i in range(level_size):\n            node = queue.popleft()\n            if i == level_size - 1:  # последний на уровне = правый\n                result.append(node.val)\n            if node.left: queue.append(node.left)\n            if node.right: queue.append(node.right)\n    return result' },
        { type: 'heading', value: 'Задача 3: зигзаг-обход (Zigzag Level Order)' },
        { type: 'code', language: 'python', value: 'def zigzag_level_order(root):\n    if not root:\n        return []\n    result = []\n    queue = deque([root])\n    left_to_right = True\n    while queue:\n        level_size = len(queue)\n        level = deque()\n        for _ in range(level_size):\n            node = queue.popleft()\n            if left_to_right:\n                level.append(node.val)\n            else:\n                level.appendleft(node.val)  # в начало = реверс\n            if node.left: queue.append(node.left)\n            if node.right: queue.append(node.right)\n        result.append(list(level))\n        left_to_right = not left_to_right\n    return result' },
        { type: 'tip', value: 'Ключевой трюк BFS по уровням: запоминаем level_size = len(queue) ПЕРЕД циклом. Цикл for _ in range(level_size) обрабатывает ровно один уровень.' }
      ]
    },
    {
      id: 8,
      title: 'Паттерн: Tree DFS (обход в глубину)',
      type: 'practice',
      content: [
        { type: 'text', value: 'Паттерн Tree DFS обходит дерево в глубину: preorder (корень первым), inorder (корень между), postorder (корень последним). Естественно реализуется рекурсивно.\n\nПрименять когда: пути в дереве, сумма пути, валидация BST, сериализация.' },
        { type: 'heading', value: 'Задача 1: существует ли путь с заданной суммой' },
        { type: 'code', language: 'python', value: 'def has_path_sum(root, target_sum):\n    if not root:\n        return False\n    # Лист: проверяем остаток\n    if not root.left and not root.right:\n        return root.val == target_sum\n    remaining = target_sum - root.val\n    return (has_path_sum(root.left, remaining) or\n            has_path_sum(root.right, remaining))\n\n# Нахождение ВСЕХ путей:\ndef path_sum_all(root, target):\n    result = []\n    def dfs(node, path, remaining):\n        if not node:\n            return\n        path.append(node.val)\n        if not node.left and not node.right and remaining == node.val:\n            result.append(list(path))\n        dfs(node.left, path, remaining - node.val)\n        dfs(node.right, path, remaining - node.val)\n        path.pop()  # backtrack\n    dfs(root, [], target)\n    return result' },
        { type: 'heading', value: 'Задача 2: диаметр дерева (Diameter of Binary Tree)' },
        { type: 'code', language: 'python', value: 'def diameter_of_binary_tree(root):\n    max_diameter = [0]\n\n    def dfs(node):\n        if not node:\n            return 0\n        left = dfs(node.left)\n        right = dfs(node.right)\n        # Диаметр через этот узел = left + right\n        max_diameter[0] = max(max_diameter[0], left + right)\n        return 1 + max(left, right)  # высота от этого узла\n\n    dfs(root)\n    return max_diameter[0]' },
        { type: 'heading', value: 'Задача 3: максимальная сумма пути (Max Path Sum)' },
        { type: 'code', language: 'python', value: 'def max_path_sum(root):\n    max_sum = [float("-inf")]\n\n    def dfs(node):\n        if not node:\n            return 0\n        # Берём только положительный вклад поддеревьев\n        left = max(dfs(node.left), 0)\n        right = max(dfs(node.right), 0)\n        # Путь через текущий узел\n        max_sum[0] = max(max_sum[0], node.val + left + right)\n        # Возвращаем лучший путь вниз (только одну ветку)\n        return node.val + max(left, right)\n\n    dfs(root)\n    return max_sum[0]' },
        { type: 'note', value: 'DFS с "возвратом значения вверх" — мощный паттерн. Внутри функции обновляем глобальный максимум, наружу возвращаем частичный результат.' }
      ]
    },
    {
      id: 9,
      title: 'Паттерн: Two Heaps (медиана потока)',
      type: 'practice',
      content: [
        { type: 'text', value: 'Паттерн Two Heaps использует MaxHeap (левая половина) и MinHeap (правая половина). Гарантирует O(log n) для добавления и O(1) для медианы.\n\nПрименять когда: медиана скользящего окна, планировщик задач по приоритету.' },
        { type: 'heading', value: 'Задача 1: медиана потока данных (Find Median from Data Stream)' },
        { type: 'code', language: 'python', value: 'import heapq\n\nclass MedianFinder:\n    def __init__(self):\n        # max_heap: левая половина (меньшие), инвертируем знак\n        self.max_heap = []  # [-5, -3, -1]\n        # min_heap: правая половина (большие)\n        self.min_heap = []  # [6, 8, 10]\n\n    def add_num(self, num):\n        # 1. Добавляем в max_heap\n        heapq.heappush(self.max_heap, -num)\n\n        # 2. Балансируем: max_heap <= min_heap\n        if self.max_heap and self.min_heap:\n            if -self.max_heap[0] > self.min_heap[0]:\n                val = -heapq.heappop(self.max_heap)\n                heapq.heappush(self.min_heap, val)\n\n        # 3. Выравниваем размеры: разница не более 1\n        if len(self.max_heap) > len(self.min_heap) + 1:\n            val = -heapq.heappop(self.max_heap)\n            heapq.heappush(self.min_heap, val)\n        elif len(self.min_heap) > len(self.max_heap):\n            val = heapq.heappop(self.min_heap)\n            heapq.heappush(self.max_heap, -val)\n\n    def find_median(self):\n        if len(self.max_heap) == len(self.min_heap):\n            return (-self.max_heap[0] + self.min_heap[0]) / 2.0\n        return float(-self.max_heap[0])  # max_heap больше на 1\n\nmf = MedianFinder()\nfor n in [1, 2, 3, 4, 5]:\n    mf.add_num(n)\n    print(mf.find_median())\n# 1.0, 1.5, 2.0, 2.5, 3.0' },
        { type: 'heading', value: 'Задача 2: медиана скользящего окна' },
        { type: 'code', language: 'python', value: 'from sortedcontainers import SortedList\n\ndef median_sliding_window(nums, k):\n    window = SortedList(nums[:k])\n    result = []\n\n    def get_median():\n        if k % 2 == 0:\n            return (window[k//2 - 1] + window[k//2]) / 2.0\n        return float(window[k//2])\n\n    result.append(get_median())\n\n    for i in range(k, len(nums)):\n        window.add(nums[i])\n        window.remove(nums[i - k])\n        result.append(get_median())\n\n    return result\n\nprint(median_sliding_window([1,3,-1,-3,5,3,6,7], 3))\n# [1.0,-1.0,-1.0,3.0,5.0,6.0]' },
        { type: 'tip', value: 'В Python нет MaxHeap. Эмулируем через MinHeap с отрицательными числами: heappush(h, -x), -h[0] = максимум.' }
      ]
    },
    {
      id: 10,
      title: 'Паттерн: Topological Sort',
      type: 'practice',
      content: [
        { type: 'text', value: 'Паттерн Topological Sort для задач с зависимостями (DAG — Directed Acyclic Graph). Два алгоритма: BFS Kahn (in-degree) и DFS с постордером.\n\nПрименять когда: порядок задач, зависимости пакетов, порядок компиляции.' },
        { type: 'heading', value: 'Задача 1: топологический порядок курсов' },
        { type: 'code', language: 'python', value: 'from collections import defaultdict, deque\n\ndef find_order(num_courses, prerequisites):\n    graph = defaultdict(list)\n    in_degree = [0] * num_courses\n\n    for course, prereq in prerequisites:\n        graph[prereq].append(course)\n        in_degree[course] += 1\n\n    # Начинаем с курсов без prerequisites\n    queue = deque([i for i in range(num_courses) if in_degree[i] == 0])\n    order = []\n\n    while queue:\n        course = queue.popleft()\n        order.append(course)\n        for next_course in graph[course]:\n            in_degree[next_course] -= 1\n            if in_degree[next_course] == 0:\n                queue.append(next_course)\n\n    return order if len(order) == num_courses else []\n\nprint(find_order(4, [[1,0],[2,0],[3,1],[3,2]]))  # [0,1,2,3] или [0,2,1,3]' },
        { type: 'heading', value: 'Задача 2: задачи с дедлайнами (Task Scheduler)' },
        { type: 'code', language: 'python', value: 'from collections import Counter\nimport heapq\n\ndef least_interval(tasks, n):\n    freq = Counter(tasks)\n    max_heap = [-f for f in freq.values()]\n    heapq.heapify(max_heap)\n\n    time = 0\n    queue = []  # (available_time, freq)\n\n    while max_heap or queue:\n        time += 1\n        if max_heap:\n            cnt = heapq.heappop(max_heap) + 1  # выполняем задачу\n            if cnt != 0:  # ещё остались экземпляры\n                queue.append((time + n, cnt))  # cooldown\n\n        if queue and queue[0][0] == time:\n            heapq.heappush(max_heap, queue.pop(0)[1])\n\n    return time\n\nprint(least_interval(["A","A","A","B","B","B"], 2))  # 8' },
        { type: 'heading', value: 'Задача 3: DFS топологическая сортировка' },
        { type: 'code', language: 'python', value: 'def topo_sort_dfs(graph, n):\n    state = [0] * n  # 0=unvisited, 1=visiting, 2=done\n    order = []\n    has_cycle = [False]\n\n    def dfs(node):\n        if state[node] == 1:  # back edge = цикл\n            has_cycle[0] = True\n            return\n        if state[node] == 2:\n            return\n        state[node] = 1\n        for neighbor in graph[node]:\n            dfs(neighbor)\n        state[node] = 2\n        order.append(node)  # postorder: добавляем после обработки\n\n    for i in range(n):\n        if state[i] == 0:\n            dfs(i)\n\n    if has_cycle[0]:\n        return []\n    return order[::-1]  # реверс postorder = topological order' },
        { type: 'note', value: 'BFS Kahn — интуитивнее и не требует явного обнаружения цикла. DFS — элегантнее рекурсивно. На интервью уточните что предпочитает интервьюер.' }
      ]
    }
  ]
}
