export default {
  id: 35,
  title: 'Практикум: Easy задачи (топ-20)',
  description: 'Топ-20 задач уровня Easy на LeetCode: Two Sum, Valid Parentheses, Merge Two Sorted Lists и другие. Python решения с объяснениями.',
  lessons: [
    {
      id: 1,
      title: 'Two Sum — поиск пары с суммой',
      type: 'practice',
      description: 'Найти два индекса с суммой элементов равной target. Решение за O(n) через HashMap: для каждого элемента ищем complement = target - num.',
      solution: 'def two_sum(nums, target):\n    seen = {}  # значение -> индекс\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n\n# O(n) время, O(n) память\n# Наивное решение O(n²) — два цикла',
      content: [
        { type: 'text', value: 'Задача: дан массив nums и число target. Найдите два индекса, сумма элементов которых равна target. Гарантировано ровно одно решение.' },
        { type: 'text', value: 'Пример: nums = [2, 7, 11, 15], target = 9 → [0, 1], потому что nums[0] + nums[1] = 2 + 7 = 9.' },
        { type: 'heading', value: 'Решение: HashMap за O(n)' },
        { type: 'code', language: 'python', value: 'def two_sum(nums, target):\n    # seen хранит: значение -> индекс\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num  # что нам нужно\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []  # по условию всегда есть ответ\n\n# Тесты\nprint(two_sum([2, 7, 11, 15], 9))   # [0, 1]\nprint(two_sum([3, 2, 4], 6))        # [1, 2]\nprint(two_sum([3, 3], 6))           # [0, 1]' },
        { type: 'text', value: 'Объяснение: для каждого элемента проверяем — видели ли мы complement = target - num раньше? Если да — нашли пару. HashMap даёт O(1) поиск.\n\nСложность: O(n) время, O(n) память.' },
        { type: 'tip', value: 'Наивное решение O(n²) — два цикла. Спросите интервьюера: можно ли использовать дополнительную память? Всегда предлагайте оптимизацию через HashMap.' }
      ]
    },
    {
      id: 2,
      title: 'Valid Parentheses — проверка скобок',
      type: 'practice',
      description: 'Проверить корректность расстановки скобок через стек: открывающие кладём в стек, закрывающие проверяем с вершиной. В конце стек должен быть пуст.',
      solution: 'def is_valid(s):\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else "#"\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return len(stack) == 0\n\n# O(n) время, O(n) память',
      content: [
        { type: 'text', value: 'Задача: дана строка s из символов (, ), {, }, [, ]. Проверьте, корректно ли расставлены скобки.' },
        { type: 'text', value: 'Примеры: "()" → True, "()[]{}" → True, "(]" → False, "([)]" → False, "{[]}" → True.' },
        { type: 'heading', value: 'Решение: стек' },
        { type: 'code', language: 'python', value: 'def is_valid(s):\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n\n    for char in s:\n        if char in mapping:  # закрывающая скобка\n            # берём вершину стека (или "#" если пуст)\n            top = stack.pop() if stack else "#"\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)  # открывающая — кладём в стек\n\n    return len(stack) == 0  # стек пуст = все скобки закрыты\n\n# Тесты\nprint(is_valid("()"))      # True\nprint(is_valid("()[]{}" )) # True\nprint(is_valid("(]"))      # False\nprint(is_valid("{[]}"))    # True' },
        { type: 'text', value: 'Объяснение: открывающие скобки кладём в стек. Когда встречаем закрывающую — снимаем с вершины стека и проверяем соответствие. В конце стек должен быть пуст.\n\nСложность: O(n) время, O(n) память.' },
        { type: 'note', value: 'Edge cases: пустая строка (True), нечётная длина (False быстрая проверка), строка начинается с ) или ].' }
      ]
    },
    {
      id: 3,
      title: 'Merge Two Sorted Lists — слияние списков',
      type: 'practice',
      description: 'Слить два отсортированных связных списка. Итеративно через dummy node: сравниваем значения, переключаем указатели. O(n+m) время, O(1) память.',
      solution: 'def merge_two_lists(l1, l2):\n    dummy = ListNode(0)\n    current = dummy\n    while l1 and l2:\n        if l1.val <= l2.val:\n            current.next = l1; l1 = l1.next\n        else:\n            current.next = l2; l2 = l2.next\n        current = current.next\n    current.next = l1 if l1 else l2\n    return dummy.next\n\n# dummy node — стандартный трюк для linked lists\n# O(n+m) время, O(1) память',
      content: [
        { type: 'text', value: 'Задача: слейте два отсортированных связных списка в один отсортированный. Верните голову нового списка.' },
        { type: 'text', value: 'Пример: 1→2→4 и 1→3→4 → 1→1→2→3→4→4.' },
        { type: 'heading', value: 'Решение: итеративное с dummy node' },
        { type: 'code', language: 'python', value: 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef merge_two_lists(l1, l2):\n    # Dummy node упрощает работу с головой списка\n    dummy = ListNode(0)\n    current = dummy\n\n    while l1 and l2:\n        if l1.val <= l2.val:\n            current.next = l1\n            l1 = l1.next\n        else:\n            current.next = l2\n            l2 = l2.next\n        current = current.next\n\n    # Подключаем оставшуюся часть\n    current.next = l1 if l1 else l2\n\n    return dummy.next  # первый реальный узел\n\n# Рекурсивное решение (элегантнее, O(n) стек):\ndef merge_recursive(l1, l2):\n    if not l1:\n        return l2\n    if not l2:\n        return l1\n    if l1.val <= l2.val:\n        l1.next = merge_recursive(l1.next, l2)\n        return l1\n    else:\n        l2.next = merge_recursive(l1, l2.next)\n        return l2' },
        { type: 'text', value: 'Объяснение: dummy node позволяет не обрабатывать edge case пустой головы. Сравниваем значения и переключаем указатели.\n\nСложность: O(n+m) время, O(1) память (итеративно).' },
        { type: 'tip', value: 'Dummy node — стандартный трюк для задач со связными списками. Позволяет не писать отдельный код для первого элемента.' }
      ]
    },
    {
      id: 4,
      title: 'Best Time to Buy and Sell Stock',
      type: 'practice',
      description: 'Максимальная прибыль от одной сделки. Один проход: отслеживать минимальную цену и максимальную прибыль (текущая цена - min_price). O(n) время, O(1) память.',
      solution: 'def max_profit(prices):\n    min_price = float("inf")\n    max_profit = 0\n    for price in prices:\n        if price < min_price:\n            min_price = price\n        elif price - min_price > max_profit:\n            max_profit = price - min_price\n    return max_profit\n\n# O(n) время, O(1) память\n# Ошибка: искать max-min в массиве — min должен быть ЛЕВЕЕ max',
      content: [
        { type: 'text', value: 'Задача: дан массив prices, где prices[i] — цена акции в день i. Найдите максимальную прибыль от одной сделки (купить и продать). Нельзя продать раньше чем купить.' },
        { type: 'text', value: 'Пример: [7,1,5,3,6,4] → 5 (купить за 1, продать за 6). [7,6,4,3,1] → 0 (выгоднее не торговать).' },
        { type: 'heading', value: 'Решение: один проход O(n)' },
        { type: 'code', language: 'python', value: 'def max_profit(prices):\n    if not prices:\n        return 0\n\n    min_price = float("inf")  # минимальная цена покупки\n    max_profit = 0\n\n    for price in prices:\n        if price < min_price:\n            min_price = price  # нашли новый минимум\n        elif price - min_price > max_profit:\n            max_profit = price - min_price  # новая лучшая прибыль\n\n    return max_profit\n\n# Тесты\nprint(max_profit([7, 1, 5, 3, 6, 4]))  # 5\nprint(max_profit([7, 6, 4, 3, 1]))     # 0\nprint(max_profit([1, 2]))               # 1' },
        { type: 'text', value: 'Объяснение: отслеживаем минимальную цену покупки. На каждом шаге обновляем максимальную прибыль: текущая цена - минимальная покупка.\n\nСложность: O(n) время, O(1) память.' },
        { type: 'note', value: 'Частая ошибка: искать max - min в массиве. Это неверно! min должен быть ЛЕВЕЕ max (купить до продажи). Алгоритм "слева направо" это гарантирует.' }
      ]
    },
    {
      id: 5,
      title: 'Valid Palindrome — палиндром строки',
      type: 'practice',
      description: 'Проверить является ли строка палиндромом (только буквы и цифры, без регистра). Два указателя с пропуском не-alnum символов. O(n) время, O(1) память.',
      solution: 'def is_palindrome(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        while left < right and not s[left].isalnum():\n            left += 1\n        while left < right and not s[right].isalnum():\n            right -= 1\n        if s[left].lower() != s[right].lower():\n            return False\n        left += 1; right -= 1\n    return True\n\n# O(n) время, O(1) память\n# Короче: cleaned = "".join(c.lower() for c in s if c.isalnum()); return cleaned == cleaned[::-1]',
      content: [
        { type: 'text', value: 'Задача: строка s является палиндромом если после удаления не-алфавитно-цифровых символов и приведения к нижнему регистру читается одинаково слева и справа.' },
        { type: 'text', value: 'Примеры: "A man, a plan, a canal: Panama" → True. "race a car" → False.' },
        { type: 'heading', value: 'Решение: два указателя O(n)' },
        { type: 'code', language: 'python', value: 'def is_palindrome(s):\n    left, right = 0, len(s) - 1\n\n    while left < right:\n        # Пропускаем не-алфавитно-цифровые\n        while left < right and not s[left].isalnum():\n            left += 1\n        while left < right and not s[right].isalnum():\n            right -= 1\n\n        if s[left].lower() != s[right].lower():\n            return False\n\n        left += 1\n        right -= 1\n\n    return True\n\n# Однострочное решение (менее эффективно по памяти):\ndef is_palindrome_v2(s):\n    cleaned = "".join(c.lower() for c in s if c.isalnum())\n    return cleaned == cleaned[::-1]\n\n# Тесты\nprint(is_palindrome("A man, a plan, a canal: Panama"))  # True\nprint(is_palindrome("race a car"))                      # False\nprint(is_palindrome(" "))                               # True' },
        { type: 'text', value: 'Объяснение: два указателя движутся навстречу, пропуская не-алфавитно-цифровые символы. Сравниваем символы без учёта регистра.\n\nСложность: O(n) время, O(1) память.' }
      ]
    },
    {
      id: 6,
      title: 'Invert Binary Tree — зеркальное дерево',
      type: 'practice',
      description: 'Зеркальное отражение бинарного дерева: для каждого узла поменять левый и правый потомок местами, рекурсивно. O(n) время, O(h) память.',
      solution: 'def invert_tree(root):\n    if not root:\n        return None\n    root.left, root.right = root.right, root.left\n    invert_tree(root.left)\n    invert_tree(root.right)\n    return root\n\n# O(n) время, O(h) память (h = высота дерева)\n# Классическая задача — знаменита благодаря твиту Макса Хоуэлла',
      content: [
        { type: 'text', value: 'Задача: переверните бинарное дерево (зеркальное отображение). Для каждого узла поменяйте местами левого и правого потомка.' },
        { type: 'text', value: 'Пример: дерево [4,2,7,1,3,6,9] → [4,7,2,9,6,3,1].' },
        { type: 'heading', value: 'Решение: рекурсия O(n)' },
        { type: 'code', language: 'python', value: 'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef invert_tree(root):\n    if not root:\n        return None\n\n    # Меняем потомков местами\n    root.left, root.right = root.right, root.left\n\n    # Рекурсивно инвертируем каждое поддерево\n    invert_tree(root.left)\n    invert_tree(root.right)\n\n    return root\n\n# Итеративное решение через BFS:\nfrom collections import deque\n\ndef invert_tree_bfs(root):\n    if not root:\n        return None\n    queue = deque([root])\n    while queue:\n        node = queue.popleft()\n        node.left, node.right = node.right, node.left\n        if node.left:\n            queue.append(node.left)\n        if node.right:\n            queue.append(node.right)\n    return root' },
        { type: 'text', value: 'Объяснение: для каждого узла меняем левое и правое поддерево местами, затем рекурсивно инвертируем оба поддерева.\n\nСложность: O(n) время, O(h) память где h — высота дерева.' },
        { type: 'tip', value: 'Эта задача стала знаменитой: Макс Хоуэлл (создатель Homebrew) написал в Twitter что не смог её решить в Google. Она простая, но интервью стрессовое.' }
      ]
    },
    {
      id: 7,
      title: 'Maximum Depth of Binary Tree',
      type: 'practice',
      description: 'Максимальная глубина бинарного дерева. Рекурсия DFS: глубина узла = 1 + max(глубина левого, глубина правого). O(n) время, O(h) память.',
      solution: 'def max_depth(root):\n    if not root:\n        return 0\n    return 1 + max(max_depth(root.left), max_depth(root.right))\n\n# O(n) время, O(h) память (рекурсивный стек)\n# Итеративно BFS: считать уровни через deque',
      content: [
        { type: 'text', value: 'Задача: найдите максимальную глубину бинарного дерева — количество узлов вдоль самого длинного пути от корня до листа.' },
        { type: 'text', value: 'Пример: [3,9,20,null,null,15,7] → 3.' },
        { type: 'heading', value: 'Решение: рекурсия и BFS' },
        { type: 'code', language: 'python', value: 'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\n# Рекурсивный DFS: O(n) время, O(h) память\ndef max_depth(root):\n    if not root:\n        return 0\n    left_depth = max_depth(root.left)\n    right_depth = max_depth(root.right)\n    return 1 + max(left_depth, right_depth)\n\n# Итеративный BFS: O(n) время, O(n) память\nfrom collections import deque\n\ndef max_depth_bfs(root):\n    if not root:\n        return 0\n    depth = 0\n    queue = deque([root])\n    while queue:\n        depth += 1\n        # Обрабатываем весь текущий уровень\n        for _ in range(len(queue)):\n            node = queue.popleft()\n            if node.left:\n                queue.append(node.left)\n            if node.right:\n                queue.append(node.right)\n    return depth\n\n# Итеративный DFS через стек:\ndef max_depth_dfs(root):\n    stack = [(root, 1)] if root else []\n    max_d = 0\n    while stack:\n        node, depth = stack.pop()\n        max_d = max(max_d, depth)\n        if node.left:\n            stack.append((node.left, depth + 1))\n        if node.right:\n            stack.append((node.right, depth + 1))\n    return max_d' },
        { type: 'text', value: 'Объяснение: глубина узла = 1 + max(глубина левого, глубина правого). Рекурсия — естественное решение для деревьев.\n\nСложность: O(n) время, O(h) память для рекурсии (h=высота дерева).' }
      ]
    },
    {
      id: 8,
      title: 'Linked List Cycle — цикл в списке',
      type: 'practice',
      description: 'Определить наличие цикла в связном списке. Алгоритм Флойда (черепаха и заяц): быстрый указатель (2 шага) и медленный (1 шаг). Встретились = цикл. O(n) время, O(1) память.',
      solution: 'def has_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False\n\n# O(n) время, O(1) память (алгоритм Флойда)\n# Альтернатива: HashSet посещённых узлов — O(n) память',
      content: [
        { type: 'text', value: 'Задача: определите, есть ли цикл в односвязном списке. Цикл существует если какой-то узел достижим снова, двигаясь по указателям next.' },
        { type: 'heading', value: 'Решение: алгоритм Флойда (черепаха и заяц)' },
        { type: 'code', language: 'python', value: 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\n# Floyd\'s Cycle Detection: O(n) время, O(1) память\ndef has_cycle(head):\n    slow = head\n    fast = head\n\n    while fast and fast.next:\n        slow = slow.next        # черепаха: 1 шаг\n        fast = fast.next.next   # заяц: 2 шага\n\n        if slow == fast:        # встретились = цикл есть!\n            return True\n\n    return False  # fast дошёл до конца = цикла нет\n\n# Найти начало цикла (бонус):\ndef detect_cycle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            # Нашли точку встречи, ищем начало цикла\n            slow = head\n            while slow != fast:\n                slow = slow.next\n                fast = fast.next\n            return slow  # начало цикла\n    return None' },
        { type: 'text', value: 'Объяснение: быстрый указатель движется в 2 раза быстрее медленного. Если цикл есть — они обязательно встретятся (как на кольцевой трассе). Если цикла нет — быстрый дойдёт до None.\n\nСложность: O(n) время, O(1) память.' },
        { type: 'note', value: 'Без ограничения памяти можно хранить посещённые узлы в HashSet. O(n) память. Алгоритм Флойда элегантнее: O(1) памяти.' }
      ]
    },
    {
      id: 9,
      title: 'Contains Duplicate — есть ли дубликаты',
      type: 'practice',
      description: 'Проверить наличие дубликатов в массиве. HashSet: добавляем элементы, возвращаем True при повторе. O(n) время, O(n) память. Без доп. памяти: сортировка O(n log n).',
      solution: 'def contains_duplicate(nums):\n    seen = set()\n    for num in nums:\n        if num in seen:\n            return True\n        seen.add(num)\n    return False\n\n# Короче: return len(nums) != len(set(nums))\n# Без доп. памяти: nums.sort(); return any(nums[i]==nums[i-1] for i in range(1,len(nums)))',
      content: [
        { type: 'text', value: 'Задача: дан массив nums. Верните True если любое значение встречается хотя бы дважды. False если все элементы уникальны.' },
        { type: 'text', value: 'Примеры: [1,2,3,1] → True. [1,2,3,4] → False. [1,1,1,3,3,4,3,2,4,2] → True.' },
        { type: 'heading', value: 'Решение: HashSet O(n)' },
        { type: 'code', language: 'python', value: 'def contains_duplicate(nums):\n    seen = set()\n    for num in nums:\n        if num in seen:\n            return True\n        seen.add(num)\n    return False\n\n# Однострочное решение:\ndef contains_duplicate_v2(nums):\n    return len(nums) != len(set(nums))\n\n# Через сортировку O(n log n), O(1) доп. памяти:\ndef contains_duplicate_sort(nums):\n    nums.sort()\n    for i in range(1, len(nums)):\n        if nums[i] == nums[i-1]:\n            return True\n    return False\n\n# Тесты\nprint(contains_duplicate([1, 2, 3, 1]))           # True\nprint(contains_duplicate([1, 2, 3, 4]))           # False\nprint(contains_duplicate([1, 1, 1, 3, 3, 4]))     # True' },
        { type: 'text', value: 'Объяснение: добавляем элементы в множество. Если элемент уже есть — нашли дубликат.\n\nСложность: O(n) время, O(n) память для HashSet варианта.' },
        { type: 'tip', value: 'Если интервьюер спросит "без дополнительной памяти" — используйте сортировку: соседние дубликаты окажутся рядом.' }
      ]
    },
    {
      id: 10,
      title: 'Climbing Stairs — ступеньки',
      type: 'practice',
      description: 'Количество способов подняться на n ступеней (по 1 или 2). DP: dp[i] = dp[i-1] + dp[i-2] — это последовательность Фибоначчи. O(n) время, O(1) память.',
      solution: 'def climb_stairs(n):\n    if n <= 2:\n        return n\n    prev2, prev1 = 1, 2\n    for _ in range(3, n + 1):\n        current = prev1 + prev2\n        prev2 = prev1\n        prev1 = current\n    return prev1\n\n# O(n) время, O(1) память\n# Это последовательность Фибоначчи!\n# DP: dp[i] = dp[i-1] + dp[i-2]',
      content: [
        { type: 'text', value: 'Задача: вы поднимаетесь по лестнице с n ступенями. За один раз можно подняться на 1 или 2 ступени. Сколькими способами вы можете подняться до вершины?' },
        { type: 'text', value: 'Примеры: n=2 → 2 способа (1+1, 2). n=3 → 3 способа (1+1+1, 1+2, 2+1). n=5 → 8 способов.' },
        { type: 'heading', value: 'Решение: динамическое программирование' },
        { type: 'code', language: 'python', value: '# DP снизу вверх: O(n) время, O(n) память\ndef climb_stairs(n):\n    if n <= 2:\n        return n\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    dp[2] = 2\n    for i in range(3, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]  # Фибоначчи!\n    return dp[n]\n\n# Оптимизировано: O(1) память\ndef climb_stairs_opt(n):\n    if n <= 2:\n        return n\n    prev2, prev1 = 1, 2\n    for _ in range(3, n + 1):\n        current = prev1 + prev2\n        prev2 = prev1\n        prev1 = current\n    return prev1\n\n# Рекурсия с мемоизацией:\nfrom functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef climb_stairs_memo(n):\n    if n <= 2:\n        return n\n    return climb_stairs_memo(n-1) + climb_stairs_memo(n-2)\n\n# Тесты\nprint(climb_stairs(1))  # 1\nprint(climb_stairs(2))  # 2\nprint(climb_stairs(5))  # 8\nprint(climb_stairs(10)) # 89' },
        { type: 'text', value: 'Объяснение: количество способов подняться на i ступеней = (с i-1 ступени прыгаем на 1) + (с i-2 ступени прыгаем на 2). Это последовательность Фибоначчи!\n\nСложность: O(n) время, O(1) память (оптимизированный вариант).' },
        { type: 'note', value: 'Climbing Stairs — стандартная вводная задача на DP. Покажите интервьюеру что распознаёте паттерн Фибоначчи и можете оптимизировать память с O(n) до O(1).' }
      ]
    }
  ]
}
