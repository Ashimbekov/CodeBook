export default {
  id: 12,
  title: 'Деревья: основы',
  description: 'Деревья — иерархические структуры данных. Изучаем терминологию, бинарные деревья, обходы (inorder, preorder, postorder, BFS) и реализацию на Java.',
  lessons: [
    {
      id: 1,
      title: 'Что такое дерево — терминология',
      type: 'theory',
      content: [
        { type: 'text', value: 'Дерево — это как настоящее дерево, только перевёрнутое: корень сверху, ветви идут вниз. Каждый элемент — это узел. От каждого узла могут отходить ветки (дочерние узлы). Листья — узлы без детей.' },
        { type: 'tip', value: 'Представь семейное дерево. Дедушка (корень) — наверху. У него двое детей. У каждого из детей свои дети. Самые молодые, у кого нет детей — это листья.' },
        { type: 'heading', value: 'Основные термины' },
        { type: 'list', items: [
          'Корень (root) — самый верхний узел, у него нет родителя',
          'Узел (node) — элемент дерева (содержит данные)',
          'Родитель (parent) — узел, от которого отходит ветка к текущему',
          'Дочерний узел (child) — узел, к которому идёт ветка от родителя',
          'Лист (leaf) — узел без дочерних узлов',
          'Высота (height) — длина длиннейшего пути от корня до листа',
          'Глубина (depth) — длина пути от корня до данного узла',
          'Поддерево (subtree) — узел вместе со всеми его потомками'
        ]},
        { type: 'heading', value: 'Визуализация в коде' },
        { type: 'code', language: 'java', value: '//        1         ← корень (root), глубина=0\n//       / \\\n//      2   3       ← глубина=1\n//     / \\   \\\n//    4   5   6     ← листья, глубина=2\n\n// Узел 1: родитель=нет, дети=[2,3]\n// Узел 2: родитель=1,   дети=[4,5]\n// Узел 3: родитель=1,   дети=[6]\n// Узел 4: родитель=2,   дети=[] (лист)\n// Узел 5: родитель=2,   дети=[] (лист)\n// Узел 6: родитель=3,   дети=[] (лист)\n\n// Высота дерева = 2 (путь 1→2→4 или 1→2→5 или 1→3→6)\n// Высота узла 3 = 1 (путь 3→6)\n// Количество узлов = 6\n// Количество листьев = 3' },
        { type: 'note', value: 'В деревьях нет циклов — это ключевое отличие от графов. От корня до любого узла существует ровно один путь.' }
      ]
    },
    {
      id: 2,
      title: 'Бинарное дерево',
      type: 'theory',
      content: [
        { type: 'text', value: 'Бинарное дерево — особый вид дерева, где у каждого узла не более двух детей: левый ребёнок и правый ребёнок. "Бинарное" = "двоичное". Это самый распространённый тип дерева в программировании.' },
        { type: 'heading', value: 'Узел бинарного дерева в Java' },
        { type: 'code', language: 'java', value: '// Узел бинарного дерева — очень простая структура!\nclass TreeNode {\n    int value;          // данные узла\n    TreeNode left;      // левый ребёнок (или null)\n    TreeNode right;     // правый ребёнок (или null)\n\n    TreeNode(int value) {\n        this.value = value;\n        this.left  = null;   // изначально детей нет\n        this.right = null;\n    }\n}\n\n// Строим дерево вручную:\n//       1\n//      / \\\n//     2   3\n//    / \\\n//   4   5\n\nTreeNode root = new TreeNode(1);\nroot.left  = new TreeNode(2);\nroot.right = new TreeNode(3);\nroot.left.left  = new TreeNode(4);\nroot.left.right = new TreeNode(5);\n\nSystem.out.println("Корень: "        + root.value);        // 1\nSystem.out.println("Левый ребёнок: " + root.left.value);   // 2\nSystem.out.println("Правый ребёнок: "+ root.right.value);  // 3\nSystem.out.println("Левый.левый: "   + root.left.left.value); // 4' },
        { type: 'heading', value: 'Виды бинарных деревьев' },
        { type: 'list', items: [
          'Полное бинарное дерево: у каждого узла 0 или 2 ребёнка (не 1)',
          'Совершенное бинарное дерево: все уровни полностью заполнены',
          'Сбалансированное: высота O(log n) — поиск быстрый',
          'Вырожденное (скошенное): все узлы в одну цепочку — высота O(n) — медленно'
        ]},
        { type: 'code', language: 'java', value: '// Подсчёт высоты дерева — рекурсивно\nstatic int height(TreeNode node) {\n    if (node == null) return -1;  // пустое дерево\n    int leftHeight  = height(node.left);\n    int rightHeight = height(node.right);\n    return 1 + Math.max(leftHeight, rightHeight);\n}\n\n// Подсчёт количества узлов\nstatic int countNodes(TreeNode node) {\n    if (node == null) return 0;\n    return 1 + countNodes(node.left) + countNodes(node.right);\n}\n\nSystem.out.println("Высота: "   + height(root));     // 2\nSystem.out.println("Узлов: "    + countNodes(root)); // 5' }
      ]
    },
    {
      id: 3,
      title: 'Обход Inorder (симметричный, LNR)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Обход дерева — значит посетить каждый узел ровно один раз. Есть несколько порядков. Inorder (LNR): сначала Левое поддерево, потом Node (сам узел), потом Right (правое поддерево).' },
        { type: 'tip', value: 'Inorder — как читаешь книгу: сначала вся левая страница, потом заголовок страницы, потом правая страница. Рекурсивно для каждой страницы.' },
        { type: 'heading', value: 'Реализация Inorder' },
        { type: 'code', language: 'java', value: 'static void inorder(TreeNode node) {\n    if (node == null) return;  // база рекурсии\n    inorder(node.left);         // 1. идём ВЛЕВО\n    System.out.print(node.value + " ");  // 2. ПЕЧАТАЕМ\n    inorder(node.right);        // 3. идём ВПРАВО\n}\n\n// Дерево:\n//       4\n//      / \\\n//     2   6\n//    / \\ / \\\n//   1  3 5  7\n\nTreeNode root = new TreeNode(4);\nroot.left  = new TreeNode(2);\nroot.right = new TreeNode(6);\nroot.left.left   = new TreeNode(1);\nroot.left.right  = new TreeNode(3);\nroot.right.left  = new TreeNode(5);\nroot.right.right = new TreeNode(7);\n\ninorder(root);\n// Вывод: 1 2 3 4 5 6 7' },
        { type: 'heading', value: 'Трассировка Inorder шаг за шагом' },
        { type: 'code', language: 'java', value: '// inorder(4)\n//   inorder(2)\n//     inorder(1)\n//       inorder(null) → return\n//       print 1          ← печатаем 1\n//       inorder(null) → return\n//     print 2            ← печатаем 2\n//     inorder(3)\n//       inorder(null) → return\n//       print 3          ← печатаем 3\n//       inorder(null) → return\n//   print 4              ← печатаем 4\n//   inorder(6)\n//     inorder(5)\n//       print 5          ← печатаем 5\n//     print 6            ← печатаем 6\n//     inorder(7)\n//       print 7          ← печатаем 7\n\n// Итог: 1 2 3 4 5 6 7  (отсортированный порядок!)' },
        { type: 'note', value: 'Для бинарного ДЕРЕВА ПОИСКА (BST) inorder-обход выдаёт элементы в отсортированном порядке. Это очень важное свойство!' }
      ]
    },
    {
      id: 4,
      title: 'Обход Preorder (NLR) и Postorder (LRN)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Preorder — сначала узел, потом левое, потом правое (NLR). Postorder — сначала левое, потом правое, потом узел (LRN). Каждый порядок полезен для разных задач.' },
        { type: 'heading', value: 'Preorder — корень первым (NLR)' },
        { type: 'code', language: 'java', value: '//       1\n//      / \\\n//     2   3\n//    / \\\n//   4   5\n\nstatic void preorder(TreeNode node) {\n    if (node == null) return;\n    System.out.print(node.value + " ");  // 1. ПЕЧАТАЕМ\n    preorder(node.left);                  // 2. ВЛЕВО\n    preorder(node.right);                 // 3. ВПРАВО\n}\n\npreorder(root);\n// Вывод: 1 2 4 5 3\n// Трассировка:\n// → print 1, влево\n//   → print 2, влево\n//     → print 4, null, null\n//   → вправо\n//     → print 5, null, null\n// → вправо\n//   → print 3, null, null\n// Результат: 1 2 4 5 3\n\n// Применение: копирование дерева, сериализация (сохранение структуры)' },
        { type: 'heading', value: 'Postorder — корень последним (LRN)' },
        { type: 'code', language: 'java', value: 'static void postorder(TreeNode node) {\n    if (node == null) return;\n    postorder(node.left);                // 1. ВЛЕВО\n    postorder(node.right);               // 2. ВПРАВО\n    System.out.print(node.value + " "); // 3. ПЕЧАТАЕМ\n}\n\npostorder(root);\n// Вывод: 4 5 2 3 1\n// Трассировка:\n// → влево\n//   → влево\n//     → null, null\n//     print 4\n//   → вправо\n//     → null, null\n//     print 5\n//   print 2\n// → вправо\n//   → null, null\n//   print 3\n// print 1\n// Результат: 4 5 2 3 1\n\n// Применение: удаление дерева (сначала дети, потом родитель),\n// вычисление выражений' },
        { type: 'heading', value: 'Сравнение трёх обходов' },
        { type: 'list', items: [
          'Inorder (LNR):  1 2 3 4 5 6 7 → для BST даёт отсортированный порядок',
          'Preorder (NLR): 1 2 4 5 3     → корень всегда первый, копирование структуры',
          'Postorder (LRN): 4 5 2 3 1   → корень всегда последний, удаление, вычисления'
        ]}
      ]
    },
    {
      id: 5,
      title: 'Обход в ширину BFS (обход по уровням)',
      type: 'theory',
      content: [
        { type: 'text', value: 'BFS (Breadth-First Search, обход в ширину) — посещаем узлы уровень за уровнем: сначала все узлы глубины 0 (корень), потом все на глубине 1, потом на глубине 2 и т.д. Используем очередь (Queue).' },
        { type: 'tip', value: 'BFS — как волна на воде. Бросил камень (корень) — сначала расходится первый круг (уровень 1), потом второй (уровень 2) и так далее. Очередь моделирует этот "фронт волны".' },
        { type: 'heading', value: 'Реализация BFS с очередью' },
        { type: 'code', language: 'java', value: 'import java.util.LinkedList;\nimport java.util.Queue;\n\nstatic void bfs(TreeNode root) {\n    if (root == null) return;\n\n    Queue<TreeNode> queue = new LinkedList<>();\n    queue.add(root);  // кладём корень в очередь\n\n    while (!queue.isEmpty()) {\n        TreeNode current = queue.poll();  // берём из начала очереди\n        System.out.print(current.value + " ");  // обрабатываем\n\n        // Добавляем детей в конец очереди\n        if (current.left  != null) queue.add(current.left);\n        if (current.right != null) queue.add(current.right);\n    }\n}\n\n// Дерево:\n//       1         уровень 0\n//      / \\\n//     2   3       уровень 1\n//    / \\   \\\n//   4   5   6     уровень 2\n\nbfs(root);\n// Вывод: 1 2 3 4 5 6' },
        { type: 'heading', value: 'Трассировка BFS шаг за шагом' },
        { type: 'code', language: 'java', value: '// Начало: queue=[1]\n\n// Шаг 1: poll=1, print 1, add 2 и 3\n//         queue=[2, 3]\n\n// Шаг 2: poll=2, print 2, add 4 и 5\n//         queue=[3, 4, 5]\n\n// Шаг 3: poll=3, print 3, add 6 (левого нет)\n//         queue=[4, 5, 6]\n\n// Шаг 4: poll=4, print 4, нет детей\n//         queue=[5, 6]\n\n// Шаг 5: poll=5, print 5, нет детей\n//         queue=[6]\n\n// Шаг 6: poll=6, print 6, нет детей\n//         queue=[] → цикл заканчивается\n\n// Итог: 1 2 3 4 5 6 (по уровням!)' },
        { type: 'list', items: [
          'BFS: O(n) время — каждый узел обрабатывается ровно раз',
          'BFS: O(w) память — w это максимальная ширина уровня',
          'Применение: кратчайший путь в невзвешенном графе',
          'Применение: поиск в ширину, проверка на симметричность дерева'
        ]}
      ]
    },
    {
      id: 6,
      title: 'Рекурсивные обходы и высота дерева',
      type: 'theory',
      content: [
        { type: 'text', value: 'Почти все операции на дереве — рекурсивные. Ключевая идея: "реши задачу для левого поддерева, реши для правого, скомбинируй". Это называется "разделяй и властвуй" (divide and conquer).' },
        { type: 'heading', value: 'Полезные рекурсивные функции' },
        { type: 'code', language: 'java', value: 'class BinaryTree {\n    TreeNode root;\n\n    // Высота дерева: макс(высота_лево, высота_право) + 1\n    int height(TreeNode node) {\n        if (node == null) return -1;  // нет узла — высота -1\n        return 1 + Math.max(height(node.left), height(node.right));\n    }\n\n    // Кол-во узлов: 1 + кол-во_лево + кол-во_право\n    int size(TreeNode node) {\n        if (node == null) return 0;\n        return 1 + size(node.left) + size(node.right);\n    }\n\n    // Поиск значения\n    boolean contains(TreeNode node, int target) {\n        if (node == null) return false;\n        if (node.value == target) return true;\n        return contains(node.left, target) || contains(node.right, target);\n    }\n\n    // Сумма всех значений\n    int sum(TreeNode node) {\n        if (node == null) return 0;\n        return node.value + sum(node.left) + sum(node.right);\n    }\n\n    // Максимальное значение\n    int max(TreeNode node) {\n        if (node.left == null && node.right == null) return node.value;\n        int maxChild = Integer.MIN_VALUE;\n        if (node.left  != null) maxChild = Math.max(maxChild, max(node.left));\n        if (node.right != null) maxChild = Math.max(maxChild, max(node.right));\n        return Math.max(node.value, maxChild);\n    }\n}' },
        { type: 'heading', value: 'Проверка сбалансированности' },
        { type: 'code', language: 'java', value: '// Дерево сбалансировано, если для каждого узла\n// |высота_лево - высота_право| <= 1\n\nboolean isBalanced(TreeNode node) {\n    if (node == null) return true;\n\n    int leftH  = height(node.left);\n    int rightH = height(node.right);\n\n    if (Math.abs(leftH - rightH) > 1) return false;\n\n    return isBalanced(node.left) && isBalanced(node.right);\n}\n\n// Пример:\n//      1            1\n//     /            /\n//    2            2\n//   /\n//  3\n// Не сбалансировано!  | Сбалансировано\n// |0-2| = 2 > 1       | |0-1| = 1 ≤ 1' },
        { type: 'note', value: 'Все рекурсивные функции работают за O(n) — каждый узел посещается ровно один раз. Стек вызовов занимает O(h) памяти, где h — высота дерева.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Обходы бинарного дерева',
      type: 'practice',
      difficulty: 'medium',
      description: 'Постройте бинарное дерево и выполните все четыре обхода. Убедись, что понимаешь порядок посещения узлов.',
      requirements: [
        'Создай дерево по структуре: корень=10, левый=5, правый=15, 5.левый=3, 5.правый=7, 15.правый=20',
        'Реализуй и вызови inorder (ожидается: 3 5 7 10 15 20)',
        'Реализуй и вызови preorder (ожидается: 10 5 3 7 15 20)',
        'Реализуй и вызови postorder (ожидается: 3 7 5 20 15 10)',
        'Реализуй и вызови BFS (ожидается: 10 5 15 3 7 20)'
      ],
      expectedOutput: 'Inorder:   3 5 7 10 15 20\nPreorder:  10 5 3 7 15 20\nPostorder: 3 7 5 20 15 10\nBFS:       10 5 15 3 7 20',
      hint: 'Для BFS импортируй java.util.LinkedList и java.util.Queue. Начни с queue.add(root), в цикле poll() и добавляй детей.',
      solution: 'import java.util.*;\n\nclass TreeNode {\n    int value;\n    TreeNode left, right;\n    TreeNode(int v) { value = v; }\n}\n\npublic class Main {\n    static void inorder(TreeNode n) {\n        if (n == null) return;\n        inorder(n.left);\n        System.out.print(n.value + " ");\n        inorder(n.right);\n    }\n\n    static void preorder(TreeNode n) {\n        if (n == null) return;\n        System.out.print(n.value + " ");\n        preorder(n.left);\n        preorder(n.right);\n    }\n\n    static void postorder(TreeNode n) {\n        if (n == null) return;\n        postorder(n.left);\n        postorder(n.right);\n        System.out.print(n.value + " ");\n    }\n\n    static void bfs(TreeNode root) {\n        Queue<TreeNode> q = new LinkedList<>();\n        q.add(root);\n        while (!q.isEmpty()) {\n            TreeNode cur = q.poll();\n            System.out.print(cur.value + " ");\n            if (cur.left  != null) q.add(cur.left);\n            if (cur.right != null) q.add(cur.right);\n        }\n    }\n\n    public static void main(String[] args) {\n        TreeNode root = new TreeNode(10);\n        root.left  = new TreeNode(5);\n        root.right = new TreeNode(15);\n        root.left.left   = new TreeNode(3);\n        root.left.right  = new TreeNode(7);\n        root.right.right = new TreeNode(20);\n\n        System.out.print("Inorder:   "); inorder(root);   System.out.println();\n        System.out.print("Preorder:  "); preorder(root);  System.out.println();\n        System.out.print("Postorder: "); postorder(root); System.out.println();\n        System.out.print("BFS:       "); bfs(root);       System.out.println();\n    }\n}',
      explanation: 'Три рекурсивных обхода отличаются только тем, когда мы печатаем текущий узел: до рекурсии (preorder), между (inorder) или после (postorder). BFS итеративный — очередь сама регулирует порядок посещения: добавляем детей в конец, а берём из начала.'
    }
  ]
}
