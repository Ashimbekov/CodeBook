export default {
  id: 17,
  title: 'Coding: деревья и BST',
  description: 'Задачи на бинарные деревья и деревья поиска: обходы, трансформации, валидация и сериализация.',
  lessons: [
    {
      id: 1,
      title: 'Инвертировать бинарное дерево',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дано бинарное дерево. Инвертируй его (зеркально отрази) и верни корень. LeetCode #226.',
      requirements: [
        'Принимает корень бинарного дерева (TreeNode или None)',
        'Рекурсивно меняет местами левый и правый дочерние узлы',
        'Возвращает корень изменённого дерева',
        'Работает для пустого дерева (None)'
      ],
      expectedOutput: 'Вход: [4,2,7,1,3,6,9]\nВыход: [4,7,2,9,6,3,1]',
      hint: 'На каждом узле поменяй местами node.left и node.right, затем рекурсивно вызови для обоих поддеревьев.',
      solution: 'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef invertTree(root):\n    if root is None:\n        return None\n    root.left, root.right = root.right, root.left\n    invertTree(root.left)\n    invertTree(root.right)\n    return root\n\n# Итеративный вариант через очередь\nfrom collections import deque\n\ndef invertTreeIterative(root):\n    if not root:\n        return None\n    queue = deque([root])\n    while queue:\n        node = queue.popleft()\n        node.left, node.right = node.right, node.left\n        if node.left:\n            queue.append(node.left)\n        if node.right:\n            queue.append(node.right)\n    return root',
      explanation: 'Подход: рекурсивный DFS. На каждом узле меняем детей местами и рекурсируем.\nСложность: O(n) по времени — посещаем каждый узел. O(h) по памяти — стек рекурсии, h — высота дерева (O(log n) для сбалансированного, O(n) в худшем случае).\nСовет для интервью: упомяни оба варианта — рекурсию и итерацию через BFS. Покажи понимание стека вызовов.'
    },
    {
      id: 2,
      title: 'Максимальная глубина бинарного дерева',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дано бинарное дерево. Найди его максимальную глубину — количество узлов на пути от корня до самого дальнего листа. LeetCode #104.',
      requirements: [
        'Принимает корень бинарного дерева',
        'Возвращает целое число — максимальную глубину',
        'Для пустого дерева возвращает 0',
        'Для дерева из одного узла возвращает 1'
      ],
      expectedOutput: 'Вход: [3,9,20,null,null,15,7]\nВыход: 3',
      hint: 'Глубина узла = 1 + max(глубина левого поддерева, глубина правого поддерева).',
      solution: 'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef maxDepth(root):\n    if root is None:\n        return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))\n\n# Итеративный BFS\nfrom collections import deque\n\ndef maxDepthBFS(root):\n    if not root:\n        return 0\n    depth = 0\n    queue = deque([root])\n    while queue:\n        depth += 1\n        for _ in range(len(queue)):\n            node = queue.popleft()\n            if node.left:\n                queue.append(node.left)\n            if node.right:\n                queue.append(node.right)\n    return depth',
      explanation: 'Подход: постордерный DFS — сначала вычисляем глубины поддеревьев, затем берём максимум.\nСложность: O(n) по времени, O(h) по памяти для рекурсии, O(w) для BFS где w — максимальная ширина уровня.\nСовет для интервью: BFS естественен для задач по уровням. Отметь, что для разреженных глубоких деревьев DFS экономнее по памяти.'
    },
    {
      id: 3,
      title: 'Одинаковые деревья',
      type: 'practice',
      difficulty: 'easy',
      description: 'Даны два бинарных дерева. Определи, являются ли они одинаковыми (одинаковая структура и значения). LeetCode #100.',
      requirements: [
        'Принимает два корня p и q',
        'Возвращает True если деревья идентичны',
        'Возвращает False если различается структура или значения',
        'Два пустых дерева считаются одинаковыми'
      ],
      expectedOutput: 'Вход: p=[1,2,3], q=[1,2,3]\nВыход: True\nВход: p=[1,2], q=[1,null,2]\nВыход: False',
      hint: 'Базовые случаи: оба None -> True, один None -> False, разные значения -> False. Иначе рекурсируй для обоих поддеревьев.',
      solution: 'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef isSameTree(p, q):\n    if p is None and q is None:\n        return True\n    if p is None or q is None:\n        return False\n    if p.val != q.val:\n        return False\n    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)\n\n# Итеративный вариант через стек\ndef isSameTreeIterative(p, q):\n    stack = [(p, q)]\n    while stack:\n        n1, n2 = stack.pop()\n        if n1 is None and n2 is None:\n            continue\n        if n1 is None or n2 is None or n1.val != n2.val:\n            return False\n        stack.append((n1.left, n2.left))\n        stack.append((n1.right, n2.right))\n    return True',
      explanation: 'Подход: синхронный преордерный обход обоих деревьев.\nСложность: O(n) по времени где n — минимальное количество узлов. O(h) по памяти.\nСовет для интервью: эту задачу используют как базу для "Subtree of Another Tree". Обратите внимание на порядок проверок в базовом случае — сначала оба None, потом один None.'
    },
    {
      id: 4,
      title: 'Поддерево другого дерева',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дано дерево root и дерево subRoot. Определи, является ли subRoot поддеревом root (то есть root содержит поддерево с той же структурой и значениями). LeetCode #572.',
      requirements: [
        'Принимает root и subRoot',
        'Возвращает True если subRoot является поддеревом root',
        'Дерево является поддеревом самого себя',
        'Пустое дерево является поддеревом любого дерева'
      ],
      expectedOutput: 'Вход: root=[3,4,5,1,2], subRoot=[4,1,2]\nВыход: True\nВход: root=[3,4,5,1,2,null,null,null,null,0], subRoot=[4,1,2]\nВыход: False',
      hint: 'Используй isSameTree из предыдущей задачи. Для каждого узла root проверяй, совпадает ли поддерево начиная с этого узла с subRoot.',
      solution: 'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef isSameTree(p, q):\n    if p is None and q is None:\n        return True\n    if p is None or q is None:\n        return False\n    return p.val == q.val and isSameTree(p.left, q.left) and isSameTree(p.right, q.right)\n\ndef isSubtree(root, subRoot):\n    if root is None:\n        return False\n    if isSameTree(root, subRoot):\n        return True\n    return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)',
      explanation: 'Подход: для каждого узла root вызываем isSameTree. Итого O(n * m) в худшем случае.\nСложность: O(n * m) по времени где n — узлы root, m — узлы subRoot. O(n) по памяти для стека.\nСовет для интервью: существует O(n + m) решение через сериализацию деревьев в строку и поиск подстроки (KMP). Упомяни это как оптимизацию.'
    },
    {
      id: 5,
      title: 'Наименьший общий предок в BST',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан BST и два узла p и q. Найди наименьшего общего предка (LCA) — самый нижний узел, у которого p и q являются потомками (узел считается потомком самого себя). LeetCode #235.',
      requirements: [
        'Дерево является BST',
        'p и q существуют в дереве',
        'p != q',
        'Использует свойство BST для оптимального поиска'
      ],
      expectedOutput: 'Вход: root=[6,2,8,0,4,7,9], p=2, q=8\nВыход: 6\nВход: root=[6,2,8,0,4,7,9], p=2, q=4\nВыход: 2',
      hint: 'В BST: если оба p и q меньше текущего узла — LCA в левом поддереве. Если оба больше — в правом. Иначе текущий узел и есть LCA.',
      solution: 'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\n# Рекурсивный вариант\ndef lowestCommonAncestor(root, p, q):\n    if p.val < root.val and q.val < root.val:\n        return lowestCommonAncestor(root.left, p, q)\n    if p.val > root.val and q.val > root.val:\n        return lowestCommonAncestor(root.right, p, q)\n    return root\n\n# Итеративный вариант O(1) памяти\ndef lowestCommonAncestorIterative(root, p, q):\n    node = root\n    while node:\n        if p.val < node.val and q.val < node.val:\n            node = node.left\n        elif p.val > node.val and q.val > node.val:\n            node = node.right\n        else:\n            return node',
      explanation: 'Подход: используем свойство BST. Если оба узла "ушли" в одну сторону — идём туда. Иначе текущий узел разделяет их — он и есть LCA.\nСложность: O(h) по времени где h — высота дерева. O(1) для итеративного варианта.\nСовет для интервью: сначала реши для обычного бинарного дерева (без BST), затем покажи оптимизацию через свойство BST. Это демонстрирует способность улучшать решение.'
    },
    {
      id: 6,
      title: 'Обход по уровням (BFS)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дано бинарное дерево. Верни обход по уровням: список списков, где каждый внутренний список содержит значения узлов одного уровня. LeetCode #102.',
      requirements: [
        'Возвращает список списков',
        'Каждый внутренний список — значения одного уровня слева направо',
        'Для пустого дерева возвращает []',
        'Использует BFS с очередью'
      ],
      expectedOutput: 'Вход: [3,9,20,null,null,15,7]\nВыход: [[3],[9,20],[15,7]]',
      hint: 'Используй deque. На каждой итерации обрабатывай ровно len(queue) узлов — это один уровень.',
      solution: 'from collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef levelOrder(root):\n    if not root:\n        return []\n    result = []\n    queue = deque([root])\n    while queue:\n        level_size = len(queue)\n        level = []\n        for _ in range(level_size):\n            node = queue.popleft()\n            level.append(node.val)\n            if node.left:\n                queue.append(node.left)\n            if node.right:\n                queue.append(node.right)\n        result.append(level)\n    return result',
      explanation: 'Подход: BFS с разбивкой на уровни. Ключевой трюк: фиксируем размер очереди в начале каждого уровня через level_size = len(queue).\nСложность: O(n) по времени и O(w) по памяти где w — максимальная ширина уровня (может быть O(n) для полного дерева).\nСовет для интервью: эта задача — база для многих вариаций: обход зигзагом (zigzag), справа налево, правый вид дерева. Паттерн level_size очень универсален.'
    },
    {
      id: 7,
      title: 'Валидация BST',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дано бинарное дерево. Определи, является ли оно корректным BST: каждый узел > всех узлов левого поддерева и < всех узлов правого поддерева. LeetCode #98.',
      requirements: [
        'Принимает корень бинарного дерева',
        'Возвращает True если дерево является валидным BST',
        'Учитывает полный диапазон, а не только прямых детей',
        'Граничные значения строго: left < node < right'
      ],
      expectedOutput: 'Вход: [2,1,3]\nВыход: True\nВход: [5,1,4,null,null,3,6]\nВыход: False (4 в правом поддереве меньше 5)',
      hint: 'Передавай min и max границы при рекурсии. Для левого поддерева max = текущее значение, для правого min = текущее значение.',
      solution: 'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef isValidBST(root):\n    def validate(node, min_val, max_val):\n        if node is None:\n            return True\n        if node.val <= min_val or node.val >= max_val:\n            return False\n        return (validate(node.left, min_val, node.val) and\n                validate(node.right, node.val, max_val))\n\n    return validate(root, float(\'-inf\'), float(\'inf\'))\n\n# Альтернатива: inorder обход должен быть строго возрастающим\ndef isValidBSTInorder(root):\n    prev = [float(\'-inf\')]\n\n    def inorder(node):\n        if not node:\n            return True\n        if not inorder(node.left):\n            return False\n        if node.val <= prev[0]:\n            return False\n        prev[0] = node.val\n        return inorder(node.right)\n\n    return inorder(root)',
      explanation: 'Подход 1: передаём допустимый диапазон [min, max] вниз по рекурсии. Подход 2: inorder обход BST всегда даёт отсортированный массив.\nСложность: O(n) по времени, O(h) по памяти.\nСовет для интервью: частая ошибка — проверять только прямых детей (node.left.val < node.val). Правильно — передавать диапазоны. Инордерный подход элегантнее и его легче объяснить.'
    },
    {
      id: 8,
      title: 'K-е наименьшее в BST',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан BST и целое число k. Найди k-е наименьшее значение среди всех узлов дерева. LeetCode #230.',
      requirements: [
        'k всегда валидно (1 <= k <= количество узлов)',
        'Возвращает целое число',
        'Не изменяет дерево',
        'Оптимально: останавливается как только найдено k-е значение'
      ],
      expectedOutput: 'Вход: root=[3,1,4,null,2], k=1\nВыход: 1\nВход: root=[5,3,6,2,4,null,null,1], k=3\nВыход: 3',
      hint: 'Inorder обход BST даёт узлы в возрастающем порядке. k-й посещённый узел — ответ.',
      solution: 'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\n# Итеративный inorder с ранней остановкой\ndef kthSmallest(root, k):\n    stack = []\n    node = root\n    count = 0\n    while stack or node:\n        while node:\n            stack.append(node)\n            node = node.left\n        node = stack.pop()\n        count += 1\n        if count == k:\n            return node.val\n        node = node.right\n    return -1\n\n# Рекурсивный вариант\ndef kthSmallestRecursive(root, k):\n    result = []\n\n    def inorder(node):\n        if not node or len(result) >= k:\n            return\n        inorder(node.left)\n        result.append(node.val)\n        inorder(node.right)\n\n    inorder(root)\n    return result[k - 1]',
      explanation: 'Подход: inorder обход BST (left -> root -> right) даёт узлы в отсортированном порядке. Итеративный вариант позволяет остановиться раньше.\nСложность: O(H + k) по времени где H — высота дерева. O(H) по памяти.\nСовет для интервью: если BST часто модифицируется и запросы k часты — можно хранить в каждом узле размер левого поддерева для O(log n) поиска.'
    },
    {
      id: 9,
      title: 'Построить дерево из preorder и inorder',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дано два массива: preorder и inorder обходы бинарного дерева. Восстанови и верни дерево. Все значения уникальны. LeetCode #105.',
      requirements: [
        'Принимает два списка целых чисел',
        'Возвращает корень восстановленного дерева',
        'Гарантируется, что дерево может быть построено',
        'Использует хеш-таблицу для O(1) поиска индекса в inorder'
      ],
      expectedOutput: 'Вход: preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]\nВыход: дерево [3,9,20,null,null,15,7]',
      hint: 'Первый элемент preorder — корень. Найди его в inorder — всё слева это левое поддерево, всё справа — правое. Рекурсируй.',
      solution: 'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef buildTree(preorder, inorder):\n    inorder_map = {val: idx for idx, val in enumerate(inorder)}\n    pre_idx = [0]  # используем список для изменения в замыкании\n\n    def helper(left, right):\n        if left > right:\n            return None\n        root_val = preorder[pre_idx[0]]\n        pre_idx[0] += 1\n        root = TreeNode(root_val)\n        mid = inorder_map[root_val]\n        root.left = helper(left, mid - 1)\n        root.right = helper(mid + 1, right)\n        return root\n\n    return helper(0, len(inorder) - 1)',
      explanation: 'Подход: preorder[0] всегда корень. Его позиция в inorder делит массив на левое и правое поддеревья. Рекурсируем для каждого поддерева.\nСложность: O(n) по времени с хеш-таблицей (иначе O(n^2)). O(n) по памяти.\nСовет для интервью: хеш-таблица для inorder — ключевая оптимизация. Также важно запомнить аналогичную задачу из postorder+inorder (LeetCode #106).'
    },
    {
      id: 10,
      title: 'Сериализация и десериализация бинарного дерева',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй сериализацию (дерево -> строка) и десериализацию (строка -> дерево) бинарного дерева. Формат выбираешь сам. LeetCode #297.',
      requirements: [
        'serialize(root) возвращает строку',
        'deserialize(data) восстанавливает дерево из строки',
        'deserialize(serialize(root)) должно давать то же дерево',
        'Поддерживает None узлы'
      ],
      expectedOutput: 'Вход: [1,2,3,null,null,4,5]\nserialize -> "1,2,N,N,3,4,N,N,5,N,N"\ndeserialize -> восстановленное дерево',
      hint: 'Используй preorder обход. Null узлы кодируй как "N". При десериализации используй очередь из токенов и рекурсию.',
      solution: 'from collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass Codec:\n    def serialize(self, root):\n        result = []\n        def dfs(node):\n            if node is None:\n                result.append("N")\n                return\n            result.append(str(node.val))\n            dfs(node.left)\n            dfs(node.right)\n        dfs(root)\n        return ",".join(result)\n\n    def deserialize(self, data):\n        tokens = deque(data.split(","))\n\n        def dfs():\n            token = tokens.popleft()\n            if token == "N":\n                return None\n            node = TreeNode(int(token))\n            node.left = dfs()\n            node.right = dfs()\n            return node\n\n        return dfs()\n\n# Пример использования\ncodec = Codec()\n# root = построенное дерево\n# data = codec.serialize(root)\n# restored = codec.deserialize(data)',
      explanation: 'Подход: preorder обход с маркерами для None. При десериализации deque позволяет брать токены по одному без передачи индекса.\nСложность: O(n) по времени и O(n) по памяти для обеих операций.\nСовет для интервью: задача проверяет знание обходов и умение работать со строками. Упомяни что BFS-сериализация (уровень за уровнем) более читаема, но preorder проще реализовать рекурсивно.'
    }
  ]
}
