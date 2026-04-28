export default {
  id: 8,
  title: 'Деревья: обход и рекурсия',
  description: 'Обход деревьев: DFS (inorder, preorder, postorder), BFS (level order), рекурсия на деревьях.',
  lessons: [
    {
      id: 1,
      title: 'Обходы деревьев: DFS и BFS',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Бинарное дерево — основа'
        },
        {
          type: 'code',
          language: 'javascript',
          value: 'class TreeNode {\n  constructor(val = 0, left = null, right = null) {\n    this.val = val;\n    this.left = left;\n    this.right = right;\n  }\n}\n\n// DFS: три порядка обхода\nfunction inorder(root, res = []) { // Левый → Корень → Правый\n  if (!root) return res;\n  inorder(root.left, res);\n  res.push(root.val);\n  inorder(root.right, res);\n  return res;\n}\n\nfunction preorder(root, res = []) { // Корень → Левый → Правый\n  if (!root) return res;\n  res.push(root.val);\n  preorder(root.left, res);\n  preorder(root.right, res);\n  return res;\n}\n\nfunction postorder(root, res = []) { // Левый → Правый → Корень\n  if (!root) return res;\n  postorder(root.left, res);\n  postorder(root.right, res);\n  res.push(root.val);\n  return res;\n}\n\n// BFS: обход по уровням\nfunction levelOrder(root) {\n  if (!root) return [];\n  const result = [];\n  const queue = [root];\n  while (queue.length) {\n    const level = [];\n    const size = queue.length;\n    for (let i = 0; i < size; i++) {\n      const node = queue.shift();\n      level.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    result.push(level);\n  }\n  return result;\n}'
        },
        {
          type: 'heading',
          value: 'Когда использовать какой обход'
        },
        {
          type: 'list',
          value: [
            'Inorder: BST в отсортированном порядке',
            'Preorder: сериализация дерева, копирование',
            'Postorder: удаление дерева, вычисление размера поддеревьев',
            'Level order (BFS): минимальная глубина, правый/левый вид дерева'
          ]
        },
        {
          type: 'tip',
          value: 'На собеседованиях 90% задач на деревья решаются рекурсивно. Базовый шаблон: if (!root) return baseCase; ... recurse(root.left) ... recurse(root.right) ...'
        }
      ]
    },
    {
      id: 2,
      title: 'Рекурсия на деревьях: паттерны',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Два подхода к рекурсии'
        },
        {
          type: 'text',
          value: 'При решении задач на деревья есть два подхода: 1) вернуть результат из рекурсии (bottom-up), 2) передать информацию вниз через параметры (top-down).'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Bottom-up: высота дерева\nfunction maxDepth(root) {\n  if (!root) return 0;\n  const leftDepth = maxDepth(root.left);\n  const rightDepth = maxDepth(root.right);\n  return 1 + Math.max(leftDepth, rightDepth);\n}\n\n// Top-down: сумма путей от корня\nfunction hasPathSum(root, targetSum) {\n  if (!root) return false;\n  if (!root.left && !root.right) {\n    return root.val === targetSum; // лист\n  }\n  const remaining = targetSum - root.val;\n  return hasPathSum(root.left, remaining) ||\n         hasPathSum(root.right, remaining);\n}\n\n// Комбинированный: диаметр дерева\nfunction diameterOfBinaryTree(root) {\n  let maxDiameter = 0;\n  function height(node) {\n    if (!node) return 0;\n    const left = height(node.left);\n    const right = height(node.right);\n    maxDiameter = Math.max(maxDiameter, left + right);\n    return 1 + Math.max(left, right);\n  }\n  height(root);\n  return maxDiameter;\n}'
        },
        {
          type: 'note',
          value: 'Паттерн "глобальная переменная + рекурсия" очень частый. Рекурсия возвращает одно значение (например, высоту), но попутно обновляет глобальный ответ (например, диаметр).'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Maximum Depth of Binary Tree',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #104: найдите максимальную глубину бинарного дерева.',
      requirements: [
        'Реализуйте функцию maxDepth(root)',
        'Глубина = количество узлов на самом длинном пути от корня до листа',
        'Решите рекурсивно и итеративно (BFS)'
      ],
      hint: 'Рекурсивно: глубина = 1 + max(глубина левого, глубина правого). Базовый случай: null → 0.',
      expectedOutput: 'maxDepth([3,9,20,null,null,15,7]) -> 3\nmaxDepth([1,null,2]) -> 2\nmaxDepth([]) -> 0',
      solution: '// Рекурсивное решение — O(n)\nfunction maxDepth(root) {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}\n\n// Итеративное BFS\nfunction maxDepthBFS(root) {\n  if (!root) return 0;\n  const queue = [root];\n  let depth = 0;\n  while (queue.length) {\n    depth++;\n    const size = queue.length;\n    for (let i = 0; i < size; i++) {\n      const node = queue.shift();\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n  }\n  return depth;\n}',
      explanation: 'Рекурсивное решение элегантно: если узел null — глубина 0. Иначе — 1 + максимум из глубин поддеревьев. BFS считает количество уровней. Оба решения O(n) по времени. Рекурсивное использует O(h) стека (h — высота), BFS — O(w) очереди (w — макс. ширина).'
    },
    {
      id: 4,
      title: 'Практика: Invert Binary Tree',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #226: инвертируйте (отзеркальте) бинарное дерево.',
      requirements: [
        'Реализуйте функцию invertTree(root)',
        'Зеркально отразите дерево: левое поддерево становится правым и наоборот',
        'Решите рекурсивно'
      ],
      hint: 'Для каждого узла: поменяйте left и right местами, затем рекурсивно инвертируйте оба поддерева.',
      expectedOutput: 'invertTree([4,2,7,1,3,6,9]) -> [4,7,2,9,6,3,1]',
      solution: 'function invertTree(root) {\n  if (!root) return null;\n\n  // Меняем местами\n  [root.left, root.right] = [root.right, root.left];\n\n  // Рекурсивно инвертируем\n  invertTree(root.left);\n  invertTree(root.right);\n\n  return root;\n}\n\n// Итеративное решение с BFS\nfunction invertTreeBFS(root) {\n  if (!root) return null;\n  const queue = [root];\n  while (queue.length) {\n    const node = queue.shift();\n    [node.left, node.right] = [node.right, node.left];\n    if (node.left) queue.push(node.left);\n    if (node.right) queue.push(node.right);\n  }\n  return root;\n}',
      explanation: 'Знаменитая задача (Homebrew creator Max Howell не решил её на собеседовании в Google). Рекурсивное решение: swap left/right, затем рекурсия. Постоянно задавайте себе вопрос: "Что должен делать каждый узел?" — поменять детей и попросить их сделать то же самое.'
    },
    {
      id: 5,
      title: 'Практика: Same Tree и Subtree',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #100 и #572: проверьте, одинаковы ли деревья, и является ли одно поддеревом другого.',
      requirements: [
        'Реализуйте isSameTree(p, q) — одинаковы ли деревья',
        'Реализуйте isSubtree(root, subRoot) — является ли subRoot поддеревом root',
        'Используйте рекурсивное сравнение'
      ],
      hint: 'isSameTree: оба null → true, один null → false, иначе проверяем значения и рекурсивно поддеревья. isSubtree: для каждого узла проверяем isSameTree.',
      expectedOutput: 'isSameTree([1,2,3], [1,2,3]) -> true\nisSameTree([1,2], [1,null,2]) -> false\nisSubtree([3,4,5,1,2], [4,1,2]) -> true',
      solution: 'function isSameTree(p, q) {\n  if (!p && !q) return true;\n  if (!p || !q) return false;\n  return p.val === q.val &&\n    isSameTree(p.left, q.left) &&\n    isSameTree(p.right, q.right);\n}\n\nfunction isSubtree(root, subRoot) {\n  if (!root) return false;\n  if (isSameTree(root, subRoot)) return true;\n  return isSubtree(root.left, subRoot) ||\n         isSubtree(root.right, subRoot);\n}\n\n// Сложность isSubtree: O(m * n) в худшем случае,\n// где m — узлов в root, n — узлов в subRoot',
      explanation: 'isSameTree — базовый "кирпичик" для многих задач. Базовые случаи: оба null → true, один null → false. Иначе сравниваем значения и рекурсивно оба поддерева. isSubtree перебирает каждый узел root и проверяет isSameTree. Это O(m*n), но для собеседования достаточно.'
    },
    {
      id: 6,
      title: 'Практика: Binary Tree Level Order Traversal',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #102: обход дерева по уровням (BFS).',
      requirements: [
        'Реализуйте функцию levelOrder(root)',
        'Верните массив массивов: значения узлов на каждом уровне',
        'Используйте BFS с очередью'
      ],
      hint: 'На каждом шаге обрабатывайте все узлы текущего уровня (queue.length). Для каждого — добавляйте его детей в очередь.',
      expectedOutput: 'levelOrder([3,9,20,null,null,15,7]) -> [[3],[9,20],[15,7]]\nlevelOrder([1]) -> [[1]]\nlevelOrder([]) -> []',
      solution: 'function levelOrder(root) {\n  if (!root) return [];\n  const result = [];\n  const queue = [root];\n\n  while (queue.length) {\n    const level = [];\n    const size = queue.length; // важно зафиксировать!\n\n    for (let i = 0; i < size; i++) {\n      const node = queue.shift();\n      level.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n\n    result.push(level);\n  }\n\n  return result;\n}\n\n// Вариации:\n// LeetCode #107: Level Order Bottom → result.reverse()\n// LeetCode #199: Right Side View → level[level.length-1]\n// LeetCode #637: Average of Levels → avg каждого level',
      explanation: 'BFS с разделением по уровням: фиксируем size = queue.length перед циклом обработки уровня. Это гарантирует, что мы обработаем только узлы текущего уровня, а их дети попадут на следующий уровень. Этот шаблон — основа для многих вариаций.'
    },
    {
      id: 7,
      title: 'Практика: Diameter of Binary Tree',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #543: найдите диаметр дерева — самый длинный путь между любыми двумя узлами.',
      requirements: [
        'Реализуйте функцию diameterOfBinaryTree(root)',
        'Диаметр — количество рёбер в самом длинном пути',
        'Путь может не проходить через корень',
        'Используйте паттерн "глобальная переменная + рекурсия"'
      ],
      hint: 'Для каждого узла диаметр через него = высота левого + высота правого поддерева. Рекурсия вычисляет высоту, попутно обновляя максимальный диаметр.',
      expectedOutput: 'diameterOfBinaryTree([1,2,3,4,5]) -> 3\ndiameterOfBinaryTree([1,2]) -> 1',
      solution: 'function diameterOfBinaryTree(root) {\n  let maxDiameter = 0;\n\n  function height(node) {\n    if (!node) return 0;\n\n    const leftH = height(node.left);\n    const rightH = height(node.right);\n\n    // Диаметр через текущий узел\n    maxDiameter = Math.max(maxDiameter, leftH + rightH);\n\n    // Возвращаем высоту для родителя\n    return 1 + Math.max(leftH, rightH);\n  }\n\n  height(root);\n  return maxDiameter;\n}\n\n// Пример: [1,2,3,4,5]\n//     1\n//    / \\\n//   2   3\n//  / \\\n// 4   5\n// Диаметр: 4 → 2 → 1 → 3 (3 ребра) или 5 → 2 → 1 → 3',
      explanation: 'Паттерн "возвращаем одно, обновляем другое": функция height возвращает высоту поддерева (нужно для родителя), но по пути обновляет maxDiameter. Для каждого узла диаметр через него = leftH + rightH. Сложность: O(n), каждый узел посещается один раз.'
    }
  ]
}
