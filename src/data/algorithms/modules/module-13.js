export default {
  id: 13,
  title: 'Бинарное дерево поиска (BST)',
  description: 'BST — бинарное дерево с особым свойством порядка. Изучаем поиск, вставку, удаление (три случая), нахождение min/max и гарантированно упорядоченный inorder-обход.',
  lessons: [
    {
      id: 1,
      title: 'Свойство BST — левый < корень < правый',
      type: 'theory',
      content: [
        { type: 'text', value: 'Бинарное дерево поиска (BST, Binary Search Tree) — это бинарное дерево с одним важным правилом: для каждого узла все значения в левом поддереве МЕНЬШЕ значения узла, а все значения в правом поддереве БОЛЬШЕ.' },
        { type: 'tip', value: 'Представь игру "угадай число". Я загадал число. Ты называешь: "50?". Если моё больше — ищи правее (больше), если меньше — ищи левее. BST и работает по этому принципу! Каждый шаг отсекает половину дерева.' },
        { type: 'heading', value: 'Пример правильного BST' },
        { type: 'code', language: 'java', value: '//         8          ← корень\n//        / \\\n//       3   10\n//      / \\    \\\n//     1   6    14\n//        / \\\n//       4   7\n\n// Проверяем свойство для узла 3:\n//   Левое поддерево: {1} — всё < 3 ✓\n//   Правое поддерево: {6, 4, 7} — всё > 3 ✓\n\n// Проверяем для узла 8:\n//   Левое поддерево: {3, 1, 6, 4, 7} — всё < 8 ✓\n//   Правое поддерево: {10, 14} — всё > 8 ✓\n\n// ВАЖНО: правило распространяется на ВСЁ поддерево,\n// не только на прямых детей!\n\n// Вот НЕПРАВИЛЬНЫЙ BST — частая ошибка:\n//         8\n//        / \\\n//       3   10\n//            \\\n//             2   ← ОШИБКА! 2 < 8, а находится в правом поддереве!' },
        { type: 'heading', value: 'Класс BST в Java' },
        { type: 'code', language: 'java', value: 'class BST {\n    static class Node {\n        int value;\n        Node left, right;\n        Node(int v) { value = v; }\n    }\n\n    Node root;\n\n    BST() { root = null; }\n}\n\n// Использование:\nBST tree = new BST();\n// tree.root будет заполнен через методы insert/delete/...' },
        { type: 'note', value: 'Inorder-обход BST даёт элементы в отсортированном порядке. Это мощное свойство: BST — это своего рода "отсортированный" контейнер с быстрым поиском.' }
      ]
    },
    {
      id: 2,
      title: 'Поиск в BST',
      type: 'theory',
      content: [
        { type: 'text', value: 'Поиск в BST — элегантный рекурсивный алгоритм. Сравниваем с текущим узлом: если равно — нашли, если меньше — идём влево, если больше — идём вправо. Каждый шаг отсекает целое поддерево!' },
        { type: 'heading', value: 'Реализация поиска' },
        { type: 'code', language: 'java', value: 'boolean search(Node node, int target) {\n    // Базовый случай: дошли до конца — не нашли\n    if (node == null) return false;\n\n    // Нашли!\n    if (target == node.value) return true;\n\n    // Ключевое свойство BST: идём только в одну сторону\n    if (target < node.value) {\n        return search(node.left, target);   // ищем левее\n    } else {\n        return search(node.right, target);  // ищем правее\n    }\n}\n\n// Итеративная версия (без рекурсии):\nboolean searchIterative(int target) {\n    Node current = root;\n    while (current != null) {\n        if (target == current.value) return true;\n        if (target < current.value)\n            current = current.left;\n        else\n            current = current.right;\n    }\n    return false;\n}' },
        { type: 'heading', value: 'Трассировка: ищем 4 в дереве' },
        { type: 'code', language: 'java', value: '//         8\n//        / \\\n//       3   10\n//      / \\    \\\n//     1   6    14\n//        / \\\n//       4   7\n\n// search(root, 4)\n// current=8, 4 < 8 → идём влево\n// current=3, 4 > 3 → идём вправо\n// current=6, 4 < 6 → идём влево\n// current=4, 4 == 4 → нашли! return true\n\n// Сделали только 4 сравнения из 7 узлов!\n// Для сбалансированного BST из n узлов — O(log n) шагов' },
        { type: 'list', items: [
          'Лучший случай O(1): искомое в корне',
          'Средний случай O(log n): сбалансированное дерево',
          'Худший случай O(n): вырожденное дерево (как связный список)',
          'Сравни с поиском в массиве: бинарный поиск тоже O(log n), но в BST можно вставлять/удалять!'
        ]}
      ]
    },
    {
      id: 3,
      title: 'Вставка в BST',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вставка нового элемента — как поиск, только если дошли до null — вот здесь и нужно поставить новый узел. Свойство BST сохраняется автоматически!' },
        { type: 'heading', value: 'Реализация вставки' },
        { type: 'code', language: 'java', value: 'Node insert(Node node, int value) {\n    // Дошли до пустого места — вставляем!\n    if (node == null) return new Node(value);\n\n    if (value < node.value) {\n        // Вставляем в левое поддерево\n        node.left = insert(node.left, value);\n    } else if (value > node.value) {\n        // Вставляем в правое поддерево\n        node.right = insert(node.right, value);\n    }\n    // Если value == node.value — дубликат, игнорируем (или обновляем)\n\n    return node;  // возвращаем (возможно изменённый) узел\n}\n\n// Вызов: tree.root = tree.insert(tree.root, 5);' },
        { type: 'heading', value: 'Трассировка: вставка 5 в дерево {8,3,10}' },
        { type: 'code', language: 'java', value: '// Начальное дерево:\n//     8\n//    / \\\n//   3   10\n\n// insert(8, 5)\n//   5 < 8 → идём влево: node.left = insert(3, 5)\n//     insert(3, 5)\n//       5 > 3 → идём вправо: node.right = insert(null, 5)\n//         insert(null, 5)\n//           node==null → return new Node(5)  ← создаём!\n//       node.right = Node(5)\n//       return Node(3)\n//   node.left = Node(3 с правым=5)\n//   return Node(8)\n\n// Результат:\n//     8\n//    / \\\n//   3   10\n//    \\\n//     5  ← новый узел!\n\nBST tree = new BST();\ntree.root = tree.insert(tree.root, 8);\ntree.root = tree.insert(tree.root, 3);\ntree.root = tree.insert(tree.root, 10);\ntree.root = tree.insert(tree.root, 5);\n// inorder: 3 5 8 10 — всё ещё отсортировано!' },
        { type: 'note', value: 'Результат вставки зависит от порядка! Если вставлять 1, 2, 3, 4, 5 последовательно — получим вырожденное дерево (как связный список). Поэтому для гарантированного O(log n) используют AVL-деревья или красно-чёрные деревья.' }
      ]
    },
    {
      id: 4,
      title: 'Удаление из BST — случай 1: лист',
      type: 'theory',
      content: [
        { type: 'text', value: 'Удаление — самая сложная операция в BST. Есть три случая в зависимости от того, сколько детей у удаляемого узла. Случай 1: удаляем лист (нет детей) — самый простой.' },
        { type: 'heading', value: 'Случай 1: Удаляем лист' },
        { type: 'code', language: 'java', value: '// Дерево:\n//     8\n//    / \\\n//   3   10\n//  / \\    \\\n// 1   6    14\n//    / \\\n//   4   7\n\n// Удаляем 1 (это лист — нет детей)\n// Просто убираем его → ставим null вместо него\n\n//     8\n//    / \\\n//   3   10\n//    \\    \\\n//     6    14\n//    / \\\n//   4   7\n\n// Удаляем 4 (тоже лист)\n//     8\n//    / \\\n//   3   10\n//    \\    \\\n//     6    14\n//      \\\n//       7\n\n// Код для этого случая:\nNode delete(Node node, int value) {\n    if (node == null) return null;  // не нашли\n\n    if (value < node.value) {\n        node.left = delete(node.left, value);\n    } else if (value > node.value) {\n        node.right = delete(node.right, value);\n    } else {\n        // НАШЛИ УЗЕЛ ДЛЯ УДАЛЕНИЯ!\n        // Случай 1: нет детей — просто удаляем\n        if (node.left == null && node.right == null) {\n            return null;  // возвращаем null вместо узла\n        }\n        // ... случаи 2 и 3 — в следующих уроках\n    }\n    return node;\n}' }
      ]
    },
    {
      id: 5,
      title: 'Удаление из BST — случай 2 и 3',
      type: 'theory',
      content: [
        { type: 'text', value: 'Случай 2: один ребёнок — заменяем узел его единственным ребёнком. Случай 3: два ребёнка — самый сложный, нужно найти замену, не нарушающую свойство BST.' },
        { type: 'heading', value: 'Случай 2: один ребёнок' },
        { type: 'code', language: 'java', value: '// Удаляем 10 (только правый ребёнок 14)\n//     8                  8\n//    / \\                / \\\n//   3   10     →       3   14\n//  / \\    \\            / \\\n// 1   6    14         1   6\n\n// Просто "поднимаем" единственного ребёнка выше\n// Случай 2 в коде:\nif (node.left == null) return node.right;   // есть только правый\nif (node.right == null) return node.left;   // есть только левый' },
        { type: 'heading', value: 'Случай 3: два ребёнка — inorder преемник' },
        { type: 'code', language: 'java', value: '// Удаляем 3 (есть и левый=1, и правый=6)\n// Стратегия: заменить значением INORDER ПРЕЕМНИКА\n// (наименьший узел в ПРАВОМ поддереве)\n\n// Inorder преемник узла 3 = 4 (следующий в inorder-порядке)\n// Он наименьший в правом поддереве {6, 4, 7}\n\n//     8                  8\n//    / \\                / \\\n//   3   10     →       4   10\n//  / \\    \\            / \\    \\\n// 1   6    14         1   6    14\n//    / \\                   \\\n//   4   7                   7\n// Скопировали значение 4 → удалили 4 из правого поддерева\n\n// Находим наименьший узел (inorder преемник)\nNode findMin(Node node) {\n    while (node.left != null) node = node.left;\n    return node;\n}\n\n// Полная функция удаления:\nNode delete(Node node, int value) {\n    if (node == null) return null;\n    if (value < node.value)       node.left  = delete(node.left,  value);\n    else if (value > node.value)  node.right = delete(node.right, value);\n    else {\n        if (node.left == null && node.right == null) return null;  // лист\n        if (node.left  == null) return node.right;  // один правый\n        if (node.right == null) return node.left;   // один левый\n        // Два ребёнка: берём inorder преемника\n        Node successor = findMin(node.right);\n        node.value = successor.value;               // копируем значение\n        node.right = delete(node.right, successor.value); // удаляем преемника\n    }\n    return node;\n}' },
        { type: 'tip', value: 'Почему inorder преемник? Это наименьшее значение из тех, что больше удаляемого. Поставив его на место удалённого, мы сохраняем свойство BST: все левые < новое значение < все правые.' }
      ]
    },
    {
      id: 6,
      title: 'Нахождение min, max и inorder как сортировка',
      type: 'theory',
      content: [
        { type: 'text', value: 'В BST минимум всегда находится в самом левом узле, максимум — в самом правом. А inorder-обход автоматически даёт элементы в отсортированном порядке!' },
        { type: 'heading', value: 'Min и Max в BST' },
        { type: 'code', language: 'java', value: '// Минимальный элемент: идём всегда влево до упора\nNode findMin(Node node) {\n    if (node == null) return null;\n    if (node.left == null) return node;  // самый левый\n    return findMin(node.left);\n}\n\n// Или итеративно:\nNode findMinIterative(Node node) {\n    while (node.left != null) node = node.left;\n    return node;\n}\n\n// Максимальный элемент: идём всегда вправо\nNode findMax(Node node) {\n    while (node.right != null) node = node.right;\n    return node;\n}\n\n// Дерево: {8, 3, 10, 1, 6, 14}\n//         8\n//        / \\\n//       3   10\n//      /      \\\n//     1        14\n\nSystem.out.println("Min: " + findMin(root).value);  // 1\nSystem.out.println("Max: " + findMax(root).value);  // 14' },
        { type: 'heading', value: 'Inorder как сортировка дерева поиска' },
        { type: 'code', language: 'java', value: '// Inorder-обход BST = Tree Sort!\n// Время: O(n log n) в среднем, O(n) для обхода\n// Идея: вставляем n элементов за O(n log n),\n//        потом inorder-обход за O(n)\n\nstatic void inorderCollect(Node node, List<Integer> result) {\n    if (node == null) return;\n    inorderCollect(node.left, result);\n    result.add(node.value);  // собираем в список\n    inorderCollect(node.right, result);\n}\n\nimport java.util.*;\n\nBST tree = new BST();\nint[] arr = {5, 3, 8, 1, 4, 7, 9};\nfor (int x : arr) tree.root = tree.insert(tree.root, x);\n\nList<Integer> sorted = new ArrayList<>();\ninorderCollect(tree.root, sorted);\nSystem.out.println(sorted);  // [1, 3, 4, 5, 7, 8, 9]' },
        { type: 'list', items: [
          'findMin: O(h) время — идём до самого левого листа',
          'findMax: O(h) время — идём до самого правого листа',
          'Inorder-обход всегда: O(n) время, O(h) память (стек)',
          'h = O(log n) для сбалансированного, O(n) для вырожденного'
        ]}
      ]
    },
    {
      id: 7,
      title: 'Сложность операций BST',
      type: 'theory',
      content: [
        { type: 'text', value: 'BST даёт O(log n) для всех основных операций — но только для сбалансированного дерева. В худшем случае вырожденное дерево деградирует до O(n). Разберём это подробно.' },
        { type: 'heading', value: 'Зависимость от формы дерева' },
        { type: 'code', language: 'java', value: '// Хорошо сбалансированное дерево (случайные данные):\n//         4\n//        / \\\n//       2   6\n//      / \\ / \\\n//     1  3 5  7\n// Высота h = 2 ≈ log2(7)\n// Поиск: максимум 3 шага\n\n// Вырожденное дерево (вставка 1, 2, 3, 4, 5...):\n// 1\n//  \\\n//   2\n//    \\\n//     3\n//      \\\n//       4\n//        \\\n//         5\n// Высота h = n-1 = 4\n// Поиск 5: нужно пройти все 5 узлов — как в списке!\n\n// Сравнение:\n// n=1000, сбалансированное: log2(1000)  ≈ 10 шагов\n// n=1000, вырожденное:      1000        шагов' },
        { type: 'heading', value: 'Таблица сложности BST' },
        { type: 'list', items: [
          'Поиск — O(h): O(log n) сбалансированное, O(n) вырожденное',
          'Вставка — O(h): O(log n) сбалансированное, O(n) вырожденное',
          'Удаление — O(h): O(log n) сбалансированное, O(n) вырожденное',
          'Min/Max — O(h): O(log n) сбалансированное, O(n) вырожденное',
          'Inorder-обход — O(n): всегда, независимо от формы',
          'Память — O(n): хранятся все n узлов',
          'Стек рекурсии — O(h): дополнительная память при рекурсивных вызовах'
        ]},
        { type: 'note', value: 'Из-за проблемы вырождения в реальных приложениях используют самобалансирующиеся деревья: AVL (следующий модуль), красно-чёрные деревья (java.util.TreeMap), B-деревья (базы данных).' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Полная реализация BST',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй BST с методами insert, search, delete (все три случая), findMin, findMax. Протестируй вставку нескольких элементов, поиск существующего и несуществующего, удаление листа и узла с двумя детьми.',
      requirements: [
        'Создай класс BST с внутренним классом Node',
        'Реализуй insert(int value)',
        'Реализуй search(int value) — возвращает boolean',
        'Реализуй delete(int value)',
        'Реализуй findMin() и findMax()',
        'Вставь: 5, 3, 7, 1, 4, 6, 8',
        'Выведи inorder (должно быть: 1 3 4 5 6 7 8)',
        'Удали 3 (два ребёнка), выведи inorder снова'
      ],
      expectedOutput: 'После вставки inorder: 1 3 4 5 6 7 8\nSearch 4: true\nSearch 9: false\nMin: 1, Max: 8\nПосле удаления 3 inorder: 1 4 5 6 7 8',
      hint: 'Для удаления узла с двумя детьми: найди inorder-преемника через findMin(node.right), скопируй его значение в текущий узел, потом удали преемника из правого поддерева.',
      solution: 'public class Main {\n    static class Node {\n        int val;\n        Node left, right;\n        Node(int v) { val = v; }\n    }\n\n    static Node root;\n\n    static Node insert(Node node, int v) {\n        if (node == null) return new Node(v);\n        if (v < node.val) node.left  = insert(node.left,  v);\n        else if (v > node.val) node.right = insert(node.right, v);\n        return node;\n    }\n\n    static boolean search(Node node, int v) {\n        if (node == null) return false;\n        if (v == node.val) return true;\n        return v < node.val ? search(node.left, v) : search(node.right, v);\n    }\n\n    static Node findMin(Node node) {\n        while (node.left != null) node = node.left;\n        return node;\n    }\n\n    static Node delete(Node node, int v) {\n        if (node == null) return null;\n        if (v < node.val)      node.left  = delete(node.left,  v);\n        else if (v > node.val) node.right = delete(node.right, v);\n        else {\n            if (node.left  == null) return node.right;\n            if (node.right == null) return node.left;\n            Node succ = findMin(node.right);\n            node.val = succ.val;\n            node.right = delete(node.right, succ.val);\n        }\n        return node;\n    }\n\n    static void inorder(Node node) {\n        if (node == null) return;\n        inorder(node.left);\n        System.out.print(node.val + " ");\n        inorder(node.right);\n    }\n\n    public static void main(String[] args) {\n        int[] vals = {5, 3, 7, 1, 4, 6, 8};\n        for (int v : vals) root = insert(root, v);\n\n        System.out.print("После вставки inorder: "); inorder(root); System.out.println();\n        System.out.println("Search 4: " + search(root, 4));\n        System.out.println("Search 9: " + search(root, 9));\n        System.out.println("Min: " + findMin(root).val + ", Max: " + findMin(root).val);\n\n        root = delete(root, 3);\n        System.out.print("После удаления 3 inorder: "); inorder(root); System.out.println();\n    }\n}',
      explanation: 'При удалении узла с двумя детьми ищем inorder-преемника — наименьший узел в правом поддереве. Копируем его значение наверх, затем рекурсивно удаляем преемника из правого поддерева (у преемника не может быть левого ребёнка — иначе он не был бы минимальным). Вся логика выражается рекурсивно и компактно.'
    }
  ]
}
