export default {
  id: 9,
  title: 'BST задачи',
  description: 'Задачи на бинарное дерево поиска: валидация, LCA, kth smallest, сериализация.',
  lessons: [
    {
      id: 1,
      title: 'Свойства BST и их использование',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Ключевое свойство BST'
        },
        {
          type: 'text',
          value: 'В BST для каждого узла: все значения в левом поддереве < значение узла < все значения в правом поддереве. Inorder обход BST даёт отсортированную последовательность.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// BST: inorder даёт отсортированный массив\nfunction inorderBST(root) {\n  const result = [];\n  function dfs(node) {\n    if (!node) return;\n    dfs(node.left);\n    result.push(node.val);\n    dfs(node.right);\n  }\n  dfs(root);\n  return result; // всегда отсортирован!\n}\n\n// Поиск в BST — O(h)\nfunction searchBST(root, val) {\n  if (!root) return null;\n  if (val < root.val) return searchBST(root.left, val);\n  if (val > root.val) return searchBST(root.right, val);\n  return root; // нашли!\n}\n\n// Вставка в BST — O(h)\nfunction insertIntoBST(root, val) {\n  if (!root) return new TreeNode(val);\n  if (val < root.val) root.left = insertIntoBST(root.left, val);\n  else root.right = insertIntoBST(root.right, val);\n  return root;\n}'
        },
        {
          type: 'tip',
          value: 'Если задача на BST — подумайте об inorder обходе. Это даёт отсортированный порядок, что часто упрощает решение.'
        }
      ]
    },
    {
      id: 2,
      title: 'Validate BST и диапазоны',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Проверка корректности BST'
        },
        {
          type: 'text',
          value: 'Частая ошибка: проверять только node.left.val < node.val < node.right.val. Это недостаточно! Нужно проверять, что ВСЕ узлы в левом поддереве меньше, а в правом — больше.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Правильная валидация BST — диапазоны\nfunction isValidBST(root, min = -Infinity, max = Infinity) {\n  if (!root) return true;\n  if (root.val <= min || root.val >= max) return false;\n  return isValidBST(root.left, min, root.val) &&\n         isValidBST(root.right, root.val, max);\n}\n\n// Альтернатива: inorder обход должен быть строго возрастающим\nfunction isValidBSTInorder(root) {\n  let prev = -Infinity;\n  function inorder(node) {\n    if (!node) return true;\n    if (!inorder(node.left)) return false;\n    if (node.val <= prev) return false;\n    prev = node.val;\n    return inorder(node.right);\n  }\n  return inorder(root);\n}'
        },
        {
          type: 'note',
          value: 'Диапазонный подход: каждый узел получает допустимый диапазон (min, max). Для левого ребёнка max становится parent.val, для правого min становится parent.val.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Validate Binary Search Tree',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #98: проверьте, является ли дерево корректным BST.',
      requirements: [
        'Реализуйте функцию isValidBST(root)',
        'Левое поддерево содержит только узлы со значениями < root.val',
        'Правое поддерево содержит только узлы со значениями > root.val',
        'Оба поддерева также являются BST'
      ],
      hint: 'Передавайте допустимый диапазон (min, max) в каждый рекурсивный вызов.',
      expectedOutput: 'isValidBST([2,1,3]) -> true\nisValidBST([5,1,4,null,null,3,6]) -> false',
      solution: 'function isValidBST(root, min = -Infinity, max = Infinity) {\n  if (!root) return true;\n  if (root.val <= min || root.val >= max) return false;\n\n  return isValidBST(root.left, min, root.val) &&\n         isValidBST(root.right, root.val, max);\n}\n\n// Тест:\n//   5\n//  / \\\n// 1   4   ← 4 < 5, но в правом поддереве!\n//    / \\\n//   3   6\n// isValidBST → false (3 < 5, но в правом поддереве)',
      explanation: 'Диапазонный подход: root получает (-inf, +inf). Левый ребёнок — (-inf, root.val). Правый — (root.val, +inf). Если значение выходит за диапазон — не BST. Сложность: O(n) время, O(h) стек рекурсии.'
    },
    {
      id: 4,
      title: 'Практика: Kth Smallest Element in BST',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #230: найдите k-й наименьший элемент в BST.',
      requirements: [
        'Реализуйте функцию kthSmallest(root, k)',
        'Верните значение k-го наименьшего элемента (1-indexed)',
        'Используйте inorder обход (который даёт отсортированный порядок)'
      ],
      hint: 'Inorder обход BST даёт элементы в отсортированном порядке. Остановитесь на k-м элементе.',
      expectedOutput: 'kthSmallest([3,1,4,null,2], 1) -> 1\nkthSmallest([5,3,6,2,4,null,null,1], 3) -> 3',
      solution: 'function kthSmallest(root, k) {\n  let count = 0;\n  let result = null;\n\n  function inorder(node) {\n    if (!node || result !== null) return;\n\n    inorder(node.left);\n\n    count++;\n    if (count === k) {\n      result = node.val;\n      return;\n    }\n\n    inorder(node.right);\n  }\n\n  inorder(root);\n  return result;\n}\n\n// Итеративный inorder (стек)\nfunction kthSmallestIterative(root, k) {\n  const stack = [];\n  let curr = root;\n\n  while (curr || stack.length) {\n    while (curr) {\n      stack.push(curr);\n      curr = curr.left;\n    }\n    curr = stack.pop();\n    k--;\n    if (k === 0) return curr.val;\n    curr = curr.right;\n  }\n}',
      explanation: 'Inorder обход BST = отсортированный порядок. Мы просто считаем посещённые узлы и останавливаемся на k-м. Рекурсивная версия использует ранний выход (result !== null). Итеративная версия со стеком даёт тот же результат без рекурсии. O(H + k) времени.'
    },
    {
      id: 5,
      title: 'Практика: Lowest Common Ancestor of BST',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #235: найдите наименьшего общего предка двух узлов в BST.',
      requirements: [
        'Реализуйте функцию lowestCommonAncestor(root, p, q)',
        'p и q — узлы дерева (гарантированно существуют)',
        'Используйте свойство BST для O(h) решения'
      ],
      hint: 'Если оба узла меньше root — ищем в левом поддереве. Если оба больше — в правом. Иначе root — LCA.',
      expectedOutput: 'LCA([6,2,8,0,4,7,9], p=2, q=8) -> 6\nLCA([6,2,8,0,4,7,9], p=2, q=4) -> 2',
      solution: 'function lowestCommonAncestor(root, p, q) {\n  while (root) {\n    if (p.val < root.val && q.val < root.val) {\n      root = root.left; // оба в левом поддереве\n    } else if (p.val > root.val && q.val > root.val) {\n      root = root.right; // оба в правом поддереве\n    } else {\n      return root; // разделение — это LCA\n    }\n  }\n}\n\n// Рекурсивная версия\nfunction lcaRecursive(root, p, q) {\n  if (p.val < root.val && q.val < root.val) {\n    return lcaRecursive(root.left, p, q);\n  }\n  if (p.val > root.val && q.val > root.val) {\n    return lcaRecursive(root.right, p, q);\n  }\n  return root;\n}',
      explanation: 'В BST мы можем определить, в каком поддереве находится узел, сравнив значение с root. Если оба узла в одном поддереве — идём туда. Если в разных — текущий узел является LCA (точка разделения). Сложность: O(h), где h — высота дерева.'
    },
    {
      id: 6,
      title: 'Практика: Serialize and Deserialize BST',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #449: сериализуйте BST в строку и восстановите обратно.',
      requirements: [
        'Реализуйте serialize(root) и deserialize(data)',
        'serialize: дерево → строка',
        'deserialize: строка → дерево',
        'Используйте preorder обход и свойства BST'
      ],
      hint: 'Serialize: preorder обход. Deserialize: для каждого значения используйте диапазоны (min, max) чтобы определить, куда вставлять.',
      expectedOutput: 'serialize([2,1,3]) -> "2,1,3"\ndeserialize("2,1,3") -> [2,1,3]',
      solution: 'function serialize(root) {\n  const result = [];\n  function preorder(node) {\n    if (!node) return;\n    result.push(node.val);\n    preorder(node.left);\n    preorder(node.right);\n  }\n  preorder(root);\n  return result.join(",");\n}\n\nfunction deserialize(data) {\n  if (!data) return null;\n  const values = data.split(",").map(Number);\n  let index = 0;\n\n  function build(min, max) {\n    if (index >= values.length) return null;\n    const val = values[index];\n    if (val < min || val > max) return null;\n\n    index++;\n    const node = new TreeNode(val);\n    node.left = build(min, val);\n    node.right = build(val, max);\n    return node;\n  }\n\n  return build(-Infinity, Infinity);\n}\n\n// Преимущество перед обычным деревом:\n// Не нужно хранить null-маркеры, потому что\n// свойство BST позволяет определить структуру.\n// Это делает сериализацию более компактной.',
      explanation: 'Для BST preorder обход достаточен для однозначной сериализации (в отличие от обычного дерева, где нужны null-маркеры). При десериализации используем диапазоны: если следующее значение не попадает в (min, max) — это значение принадлежит другому поддереву. O(n) время и память.'
    },
    {
      id: 7,
      title: 'Практика: Convert Sorted Array to BST',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #108: преобразуйте отсортированный массив в сбалансированное BST.',
      requirements: [
        'Реализуйте функцию sortedArrayToBST(nums)',
        'Массив отсортирован по возрастанию',
        'Верните корень сбалансированного BST',
        'Высоты левого и правого поддеревьев отличаются не более чем на 1'
      ],
      hint: 'Корень — средний элемент. Левое поддерево — из левой половины, правое — из правой. Рекурсивно.',
      expectedOutput: 'sortedArrayToBST([-10,-3,0,5,9]) -> [0,-3,9,-10,null,5]',
      solution: 'function sortedArrayToBST(nums) {\n  function build(left, right) {\n    if (left > right) return null;\n\n    const mid = Math.floor((left + right) / 2);\n    const node = new TreeNode(nums[mid]);\n\n    node.left = build(left, mid - 1);\n    node.right = build(mid + 1, right);\n\n    return node;\n  }\n\n  return build(0, nums.length - 1);\n}\n\n// [-10,-3,0,5,9]\n//       0\n//      / \\\n//    -3    9\n//   /    /\n// -10   5\n\n// Сложность: O(n) время, O(log n) стек рекурсии',
      explanation: 'Рекурсивный принцип "разделяй и властвуй": средний элемент становится корнем, левая половина — левым поддеревом, правая — правым. Это гарантирует сбалансированность, потому что размеры левой и правой частей отличаются максимум на 1. Аналогично merge sort, но в обратную сторону.'
    }
  ]
}
