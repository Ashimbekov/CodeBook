export default {
  id: 15,
  title: 'Coding: связные списки',
  description: 'Топ-8 задач на связные списки с полными решениями на Python. От простого Reverse до сложного Merge K Sorted Lists.',
  lessons: [
    {
      id: 1,
      type: 'practice',
      title: 'Reverse Linked List',
      difficulty: 'easy',
      description: 'Дан head односвязного списка. Разверните список и верните новый head. Решить итеративно и рекурсивно.',
      requirements: [
        'Входные данные: head = [1, 2, 3, 4, 5]',
        'Выходные данные: [5, 4, 3, 2, 1]',
        'Итеративное решение за O(n) времени O(1) памяти',
        'Рекурсивное решение за O(n) времени O(n) памяти (стек)',
        'Обработать пустой список и список из одного элемента'
      ],
      expectedOutput: '[5, 4, 3, 2, 1]\n[]\n[1]',
      hint: 'Итеративно: три переменных — prev (None), curr (head), next_node. На каждом шаге: сохрани next, разверни стрелку curr.next = prev, сдвинь prev и curr вперёд.',
      solution: 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\n# Итеративно: O(n) время, O(1) память\ndef reverse_list(head):\n    prev = None\n    curr = head\n\n    while curr:\n        next_node = curr.next  # Сохраняем следующий\n        curr.next = prev        # Разворачиваем стрелку\n        prev = curr             # Сдвигаем prev\n        curr = next_node        # Сдвигаем curr\n\n    return prev  # prev теперь новый head\n\n# Рекурсивно: O(n) время, O(n) память\ndef reverse_list_recursive(head):\n    if not head or not head.next:\n        return head\n\n    new_head = reverse_list_recursive(head.next)\n    head.next.next = head  # Разворачиваем стрелку\n    head.next = None        # Убираем старую стрелку\n    return new_head\n\n# Вспомогательная функция для теста\ndef to_list(head):\n    result = []\n    while head:\n        result.append(head.val)\n        head = head.next\n    return result\n\ndef from_list(vals):\n    if not vals:\n        return None\n    head = ListNode(vals[0])\n    curr = head\n    for v in vals[1:]:\n        curr.next = ListNode(v)\n        curr = curr.next\n    return head\n\n# Тест\nhead = from_list([1, 2, 3, 4, 5])\nprint(to_list(reverse_list(head)))   # [5, 4, 3, 2, 1]',
      explanation: 'Итеративно: O(n) время, O(1) память. Три переменных: prev (уже развёрнутая часть), curr (текущий), next_node (следующий — нужно сохранить перед разворотом). Рекурсивно: O(n) память из-за стека вызовов. Рекурсия идёт до конца, затем разворачивает стрелки назад. Важно: head.next.next = head создаёт обратную стрелку, head.next = None убирает старую. На интервью: знай оба подхода, обычно просят итеративный.'
    },
    {
      id: 2,
      type: 'practice',
      title: 'Merge Two Sorted Lists',
      difficulty: 'easy',
      description: 'Даны head двух отсортированных связных списков list1 и list2. Слейте их в один отсортированный список. Верните head нового списка.',
      requirements: [
        'Входные данные: list1 = [1,2,4], list2 = [1,3,4]',
        'Выходные данные: [1,1,2,3,4,4]',
        'Решение за O(n+m) времени',
        'Использовать dummy node для упрощения логики',
        'Решить итеративно и рекурсивно'
      ],
      expectedOutput: '[1, 1, 2, 3, 4, 4]\n[1, 2]\n[0, 1, 3, 4]',
      hint: 'Используй dummy node как виртуальный head результата. Сравнивай текущие узлы list1 и list2, присоединяй меньший к dummy.next. Когда один список закончится — присоединяй оставшийся.',
      solution: 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\n# Итеративно: O(n+m) время, O(1) память\ndef merge_two_lists(list1, list2):\n    dummy = ListNode(0)  # Виртуальный head\n    curr = dummy\n\n    while list1 and list2:\n        if list1.val <= list2.val:\n            curr.next = list1\n            list1 = list1.next\n        else:\n            curr.next = list2\n            list2 = list2.next\n        curr = curr.next\n\n    # Присоединяем остаток\n    curr.next = list1 if list1 else list2\n\n    return dummy.next\n\n# Рекурсивно: O(n+m) время, O(n+m) память\ndef merge_two_lists_recursive(list1, list2):\n    if not list1:\n        return list2\n    if not list2:\n        return list1\n\n    if list1.val <= list2.val:\n        list1.next = merge_two_lists_recursive(list1.next, list2)\n        return list1\n    else:\n        list2.next = merge_two_lists_recursive(list1, list2.next)\n        return list2',
      explanation: 'Временная сложность: O(n+m) — обрабатываем каждый узел один раз. Пространственная сложность: O(1) для итеративного (не считая выходного списка), O(n+m) для рекурсивного (стек вызовов). Dummy node — классический трюк для связных списков: избавляет от специальной обработки случая пустого результата. curr.next = list1 if list1 else list2 — элегантно обрабатывает оба остатка одной строкой.'
    },
    {
      id: 3,
      type: 'practice',
      title: 'Linked List Cycle',
      difficulty: 'easy',
      description: 'Дан head связного списка. Определите, есть ли в нём цикл. Для дополнительной задачи: найдите начало цикла. Решение за O(1) дополнительной памяти.',
      requirements: [
        'Входные данные: head = [3,2,0,-4], pos = 1 (tail соединён с узлом 1)',
        'Выходные данные: true',
        'Алгоритм Флойда: два указателя — slow и fast',
        'O(n) время, O(1) память',
        'Бонус: найти узел, где начинается цикл'
      ],
      expectedOutput: 'True\nFalse',
      hint: 'Slow идёт по 1 шагу, fast — по 2. Если есть цикл — они встретятся. Доказательство: fast "догоняет" slow внутри цикла со скоростью 1 шаг за итерацию.',
      solution: 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef has_cycle(head):\n    slow = head\n    fast = head\n\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n\n    return False\n\n# Бонус: найти начало цикла\ndef detect_cycle(head):\n    slow = head\n    fast = head\n\n    # Фаза 1: найти точку встречи\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            break\n    else:\n        return None  # Нет цикла\n\n    # Фаза 2: найти начало цикла\n    # Переставляем slow на head, оба идут по 1 шагу\n    slow = head\n    while slow != fast:\n        slow = slow.next\n        fast = fast.next\n\n    return slow  # Начало цикла\n\n# Создаём список с циклом для теста\nnode1 = ListNode(3)\nnode2 = ListNode(2)\nnode3 = ListNode(0)\nnode4 = ListNode(-4)\nnode1.next = node2\nnode2.next = node3\nnode3.next = node4\nnode4.next = node2  # Цикл: -4 -> 2\nprint(has_cycle(node1))  # True',
      explanation: 'Алгоритм Флойда (черепаха и заяц): O(n) время, O(1) память. Почему они встречаются? Если цикл есть, fast входит в него и "настигает" slow со скоростью 1 шаг/итерацию. Нахождение начала цикла: математически доказывается, что после встречи внутри цикла, если поставить slow на head и двигать оба по 1 шагу — они снова встретятся ровно на начале цикла. Это классическая задача с элегантным математическим доказательством.'
    },
    {
      id: 4,
      type: 'practice',
      title: 'Remove Nth Node From End of List',
      difficulty: 'medium',
      description: 'Дан head связного списка и число n. Удалите n-й узел с конца и верните head. Решение за один проход.',
      requirements: [
        'Входные данные: head = [1,2,3,4,5], n = 2',
        'Выходные данные: [1,2,3,5]',
        'Один проход по списку (не два)',
        'Использовать dummy node для удаления первого элемента',
        'Использовать два указателя с промежутком n+1'
      ],
      expectedOutput: '[1, 2, 3, 5]\n[]\n[2]',
      hint: 'Создай два указателя: fast и slow, оба на dummy. Сдвинь fast на n+1 шагов вперёд. Теперь двигай оба вместе пока fast не None. slow будет перед n-м с конца — можно удалить.',
      solution: 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef remove_nth_from_end(head, n):\n    dummy = ListNode(0, head)\n    fast = dummy\n    slow = dummy\n\n    # Двигаем fast на n+1 шагов вперёд\n    for _ in range(n + 1):\n        fast = fast.next\n\n    # Двигаем оба пока fast не None\n    while fast:\n        fast = fast.next\n        slow = slow.next\n\n    # slow стоит перед удаляемым узлом\n    slow.next = slow.next.next\n\n    return dummy.next\n\n# Тест\ndef from_list(vals):\n    dummy = ListNode(0)\n    curr = dummy\n    for v in vals:\n        curr.next = ListNode(v)\n        curr = curr.next\n    return dummy.next\n\ndef to_list(head):\n    result = []\n    while head:\n        result.append(head.val)\n        head = head.next\n    return result\n\nprint(to_list(remove_nth_from_end(from_list([1,2,3,4,5]), 2)))  # [1,2,3,5]',
      explanation: 'Временная сложность: O(n) — один проход. Пространственная сложность: O(1). Трюк с n+1 промежутком: когда fast достигает конца (None), slow находится ровно перед n-м с конца. Тогда slow.next = slow.next.next удаляет нужный узел. Dummy node критичен: если нужно удалить первый элемент (n = длина списка), fast выйдет за границу при n+1 шагах без dummy. С dummy всё работает корректно.'
    },
    {
      id: 5,
      type: 'practice',
      title: 'Reorder List',
      difficulty: 'medium',
      description: 'Дан head списка L0→L1→...→Ln. Переупорядочи в L0→Ln→L1→Ln-1→L2→Ln-2→... Изменяй на месте, не возвращай новый список.',
      requirements: [
        'Входные данные: head = [1,2,3,4,5]',
        'Выходные данные: [1,5,2,4,3]',
        'Три шага: найти середину, развернуть вторую половину, смержить',
        'O(n) время, O(1) память',
        'Не использовать дополнительный массив'
      ],
      expectedOutput: '[1, 5, 2, 4, 3]\n[1, 4, 2, 3]',
      hint: 'Шаг 1: найди середину (slow/fast). Шаг 2: разверни вторую половину. Шаг 3: поочерёдно чередуй узлы первой и второй половины.',
      solution: 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reorder_list(head):\n    if not head or not head.next:\n        return\n\n    # Шаг 1: Найти середину\n    slow, fast = head, head\n    while fast.next and fast.next.next:\n        slow = slow.next\n        fast = fast.next.next\n    # slow теперь на середине\n\n    # Шаг 2: Развернуть вторую половину\n    second = slow.next\n    slow.next = None  # Разрываем список\n    prev = None\n    while second:\n        tmp = second.next\n        second.next = prev\n        prev = second\n        second = tmp\n    second = prev  # Голова развёрнутой второй половины\n\n    # Шаг 3: Смержить две половины\n    first = head\n    while second:\n        tmp1 = first.next\n        tmp2 = second.next\n        first.next = second\n        second.next = tmp1\n        first = tmp1\n        second = tmp2',
      explanation: 'Временная сложность: O(n). Пространственная сложность: O(1). Три классических операции со связным списком: find middle (slow/fast pointers), reverse list, merge two lists. Это паттерн, который переиспользуется в других задачах. Важно разорвать список посередине (slow.next = None) перед разворотом, иначе второй раздел будет циклически связан с первым.'
    },
    {
      id: 6,
      type: 'practice',
      title: 'Add Two Numbers',
      difficulty: 'medium',
      description: 'Даны два ненулевых связных списка, представляющих неотрицательные числа в обратном порядке цифр. Сложи числа и верни результат в виде связного списка.',
      requirements: [
        'Входные данные: l1 = [2,4,3], l2 = [5,6,4] (342 + 465)',
        'Выходные данные: [7,0,8] (807)',
        'Обработать перенос (carry) из младшего разряда',
        'Обработать списки разной длины',
        'Обработать финальный перенос (999 + 1 = 1000)'
      ],
      expectedOutput: '[7, 0, 8]\n[0, 0, 0, 1]',
      hint: 'Идём по обоим спискам одновременно. На каждом шаге суммируем значения + carry. carry = total // 10, digit = total % 10. После окончания обоих списков, если carry == 1 — добавь ещё один узел.',
      solution: 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef add_two_numbers(l1, l2):\n    dummy = ListNode(0)\n    curr = dummy\n    carry = 0\n\n    while l1 or l2 or carry:\n        val1 = l1.val if l1 else 0\n        val2 = l2.val if l2 else 0\n\n        total = val1 + val2 + carry\n        carry = total // 10\n        digit = total % 10\n\n        curr.next = ListNode(digit)\n        curr = curr.next\n\n        if l1:\n            l1 = l1.next\n        if l2:\n            l2 = l2.next\n\n    return dummy.next\n\n# Тест\ndef from_list(vals):\n    dummy = ListNode(0)\n    curr = dummy\n    for v in vals:\n        curr.next = ListNode(v)\n        curr = curr.next\n    return dummy.next\n\ndef to_list(head):\n    res = []\n    while head:\n        res.append(head.val)\n        head = head.next\n    return res\n\nprint(to_list(add_two_numbers(from_list([2,4,3]), from_list([5,6,4]))))  # [7,0,8]\nprint(to_list(add_two_numbers(from_list([9,9,9]), from_list([1]))))       # [0,0,0,1]',
      explanation: 'Временная сложность: O(max(n,m)) — проходим по длиннейшему из списков плюс возможный перенос. Пространственная сложность: O(max(n,m)) — результирующий список. Ключевые детали: while l1 or l2 or carry — три условия, включая carry, обрабатывает финальный перенос (999+1). val1 = l1.val if l1 else 0 — обрабатывает разные длины. Числа в обратном порядке упрощают сложение: начинаем с младших разрядов.'
    },
    {
      id: 7,
      type: 'practice',
      title: 'Find the Duplicate Number',
      difficulty: 'medium',
      description: 'Дан массив nums из n+1 целых чисел, каждое из которых в диапазоне [1, n]. Гарантируется одно повторяющееся число. Найди его. Без изменения массива, O(1) памяти.',
      requirements: [
        'Входные данные: nums = [1,3,4,2,2]',
        'Выходные данные: 2',
        'Нельзя изменять массив (сортировка не подходит)',
        'O(1) дополнительной памяти (set не подходит)',
        'Использовать алгоритм Флойда для цикла в "связном списке"'
      ],
      expectedOutput: '2\n3',
      hint: 'Воспринимай массив как связный список: индекс i указывает на узел nums[i]. Дубль создаёт цикл. Применяй алгоритм Флойда: slow = nums[slow], fast = nums[nums[fast]]. Найди точку встречи, затем начало цикла.',
      solution: 'def find_duplicate(nums):\n    # Алгоритм Флойда для нахождения цикла\n    # nums[i] можно воспринимать как next pointer\n    slow = nums[0]\n    fast = nums[0]\n\n    # Фаза 1: найти точку встречи внутри цикла\n    while True:\n        slow = nums[slow]\n        fast = nums[nums[fast]]\n        if slow == fast:\n            break\n\n    # Фаза 2: найти начало цикла (= дубль)\n    slow = nums[0]\n    while slow != fast:\n        slow = nums[slow]\n        fast = nums[fast]\n\n    return slow\n\n# Простое решение через set (O(n) память, не оптимально)\ndef find_duplicate_set(nums):\n    seen = set()\n    for num in nums:\n        if num in seen:\n            return num\n        seen.add(num)\n    return -1\n\n# Тест\nprint(find_duplicate([1, 3, 4, 2, 2]))  # 2\nprint(find_duplicate([3, 1, 3, 4, 2]))  # 3',
      explanation: 'Алгоритм Флойда применён к массиву: индексы 0..n-1, значения 1..n. Значение nums[i] — "следующий индекс". Дублирующее число означает два индекса указывают на один узел — это цикл. Фаза 1: slow и fast встречаются внутри цикла. Фаза 2: переставляем slow на начало, двигаем оба по 1 шагу — встречаются на начале цикла (= дубле). O(n) время, O(1) память. Это изящное применение алгоритма из задачи на связные списки к массиву.'
    },
    {
      id: 8,
      type: 'practice',
      title: 'Merge K Sorted Lists',
      difficulty: 'hard',
      description: 'Дан массив из k отсортированных связных списков. Слей их все в один отсортированный список.',
      requirements: [
        'Входные данные: lists = [[1,4,5],[1,3,4],[2,6]]',
        'Выходные данные: [1,1,2,3,4,4,5,6]',
        'Наивное решение O(N*k) — слияние по одному',
        'Оптимальное через min-heap: O(N log k)',
        'N = суммарное количество узлов, k = количество списков'
      ],
      expectedOutput: '[1, 1, 2, 3, 4, 4, 5, 6]\n[]\n[0]',
      hint: 'Используй min-heap размером k. Добавь первый узел каждого непустого списка. На каждом шаге извлекай минимум из heap, добавляй в результат, кидай следующий узел из того же списка.',
      solution: 'import heapq\n\nclass ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\n    # Нужно для heapq сравнения (если vals равны)\n    def __lt__(self, other):\n        return self.val < other.val\n\ndef merge_k_lists(lists):\n    dummy = ListNode(0)\n    curr = dummy\n    heap = []\n\n    # Добавляем первый узел каждого списка\n    for node in lists:\n        if node:\n            heapq.heappush(heap, node)\n\n    while heap:\n        # Извлекаем минимальный узел\n        node = heapq.heappop(heap)\n        curr.next = node\n        curr = curr.next\n\n        # Добавляем следующий узел из того же списка\n        if node.next:\n            heapq.heappush(heap, node.next)\n\n    return dummy.next\n\n# Альтернатива: divide and conquer, тоже O(N log k)\ndef merge_k_lists_dc(lists):\n    if not lists:\n        return None\n    while len(lists) > 1:\n        merged = []\n        for i in range(0, len(lists), 2):\n            l1 = lists[i]\n            l2 = lists[i + 1] if i + 1 < len(lists) else None\n            merged.append(merge_two(l1, l2))\n        lists = merged\n    return lists[0]\n\ndef merge_two(l1, l2):\n    dummy = ListNode(0)\n    curr = dummy\n    while l1 and l2:\n        if l1.val <= l2.val:\n            curr.next = l1\n            l1 = l1.next\n        else:\n            curr.next = l2\n            l2 = l2.next\n        curr = curr.next\n    curr.next = l1 or l2\n    return dummy.next',
      explanation: 'Heap подход: O(N log k) время, O(k) память — heap хранит не более k элементов. На каждой итерации: heappop O(log k), heappush O(log k). N операций итого = O(N log k). Divide and Conquer: O(N log k) — log k раундов слияний, каждый раунд O(N). Одинаковая асимптотика, но D&C без heap overhead. __lt__ нужен Python heap для корректного сравнения ListNode при равных val. Это задача типичная для Google/Meta интервью.'
    }
  ]
}
