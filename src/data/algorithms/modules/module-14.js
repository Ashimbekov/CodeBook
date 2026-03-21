export default {
  id: 14,
  title: 'AVL-дерево',
  description: 'AVL-деревья — самобалансирующиеся BST. Изучаем баланс-фактор, четыре типа вращений и автоматическое восстановление баланса при вставке. Гарантированный O(log n).',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужны сбалансированные деревья',
      type: 'theory',
      content: [
        { type: 'text', value: 'Обычный BST деградирует до O(n) при последовательной вставке. Представь: вставляем числа 1, 2, 3, 4, 5 — дерево превращается в список. AVL-дерево автоматически перестраивает себя, чтобы оставаться "низким" (сбалансированным).' },
        { type: 'tip', value: 'Представь башню из блоков. Если ставить блоки только с одной стороны — башня накренится и упадёт. AVL-дерево — умный строитель: после каждого нового блока оно проверяет баланс и выравнивает башню вращением.' },
        { type: 'heading', value: 'Проблема несбалансированного BST' },
        { type: 'code', language: 'java', value: '// Вставляем 1, 2, 3 последовательно в обычный BST:\n//\n// После вставки 1:      1\n// После вставки 2:      1\n//                        \\\n//                         2\n// После вставки 3:      1\n//                        \\\n//                         2\n//                          \\\n//                           3\n//\n// Это вырожденное дерево! Высота = 2, а не log2(3) ≈ 1\n// Поиск 3 требует 3 шага вместо 2!\n\n// При n=1000 последовательных вставок:\n// Обычный BST: высота 999, поиск O(1000)\n// AVL-дерево:  высота ≤13, поиск O(13)  — в 77 раз быстрее!\n\n// AVL после вставки 1, 2, 3:\n//      2\n//     / \\\n//    1   3\n// Дерево само перестроилось!' },
        { type: 'heading', value: 'История: AVL = Адельсон-Вельский и Ландис' },
        { type: 'text', value: 'AVL-дерево изобрели советские математики Георгий Адельсон-Вельский и Евгений Ландис в 1962 году — первое самобалансирующееся дерево в истории! Названо по первым буквам их фамилий.' },
        { type: 'note', value: 'Гарантия AVL: для дерева с n узлами высота всегда ≤ 1.44 * log2(n). На практике обычно ещё ниже. Это гарантирует O(log n) для всех операций.' }
      ]
    },
    {
      id: 2,
      title: 'Баланс-фактор (Balance Factor)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Баланс-фактор (BF) каждого узла = высота правого поддерева − высота левого поддерева. В AVL-дереве у каждого узла BF должен быть в {−1, 0, 1}. Если BF вышел за эти границы — нужно вращение.' },
        { type: 'heading', value: 'Вычисление баланс-фактора' },
        { type: 'code', language: 'java', value: 'class AVLNode {\n    int value;\n    AVLNode left, right;\n    int height;  // высота поддерева с корнем в этом узле\n\n    AVLNode(int v) {\n        value  = v;\n        height = 1;  // новый узел — высота 1\n    }\n}\n\n// Вспомогательные методы:\nint height(AVLNode node) {\n    return node == null ? 0 : node.height;\n}\n\nint getBalanceFactor(AVLNode node) {\n    if (node == null) return 0;\n    return height(node.right) - height(node.left);\n    // BF > 0: правое тяжелее (правый перекос)\n    // BF < 0: левое тяжелее (левый перекос)\n    // BF = 0: идеальный баланс\n}\n\nvoid updateHeight(AVLNode node) {\n    node.height = 1 + Math.max(height(node.left), height(node.right));\n}' },
        { type: 'heading', value: 'Примеры баланс-фактора' },
        { type: 'code', language: 'java', value: '// Пример 1: сбалансированное\n//       5  (BF = 1-1 = 0)\n//      / \\\n//     3   7  (оба BF=0)\n\n// Пример 2: требует вращения!\n//     1  (BF = 2-0 = 2)  ← НАРУШЕНИЕ!\n//      \\\n//       2  (BF = 1-0 = 1)\n//        \\\n//         3  (BF=0)\n// Узел 1 имеет BF=2 → нужно левое вращение!\n\n// Пример 3:\n//       5  (BF = 0-2 = -2)  ← НАРУШЕНИЕ!\n//      /\n//     3  (BF = 0-1 = -1)\n//    /\n//   1  (BF=0)\n// Узел 5 имеет BF=-2 → нужно правое вращение!' }
      ]
    },
    {
      id: 3,
      title: 'Правое вращение (Right Rotation)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правое вращение применяется когда левое поддерево "перевешивает" (BF = −2, левый ребёнок BF = −1). Левый ребёнок поднимается наверх, а текущий корень становится его правым ребёнком.' },
        { type: 'tip', value: 'Вращение — как на карусели: левый ребёнок поднимается вверх на место родителя, родитель съезжает вправо. Правый ребёнок левого ребёнка "переезжает" к родителю (теперь он его левый ребёнок).' },
        { type: 'heading', value: 'Правое вращение — пошагово' },
        { type: 'code', language: 'java', value: '// До вращения:\n//       z (BF=-2)\n//      /\n//     y (BF=-1)\n//    /\n//   x\n\n// После правого вращения вокруг z:\n//     y\n//    / \\\n//   x   z\n\n// Код правого вращения:\nAVLNode rotateRight(AVLNode z) {\n    AVLNode y = z.left;    // y станет новым корнем\n    AVLNode T3 = y.right;  // правое поддерево y переезжает к z\n\n    // Делаем вращение\n    y.right = z;           // z становится правым ребёнком y\n    z.left  = T3;          // T3 становится левым ребёнком z\n\n    // Обновляем высоты (z обновляем первым, потому что стал ниже!)\n    updateHeight(z);\n    updateHeight(y);\n\n    return y;  // y — новый корень этого поддерева\n}' },
        { type: 'heading', value: 'Пример правого вращения' },
        { type: 'code', language: 'java', value: '// Вставляем 3, 2, 1:\n// После вставки 1 узел 3 имеет BF=-2\n\n// Было:         3\n//              /\n//             2\n//            /\n//           1\n\n// rotateRight(3):\n//   y = 2, T3 = null\n//   y.right = 3\n//   3.left  = null (T3)\n//   updateHeight(3): 3 теперь лист, height=1\n//   updateHeight(2): height = 1 + max(1,1) = 2\n\n// Стало:        2\n//              / \\\n//             1   3\n\n// Баланс-факторы:\n// BF(2) = 1-1 = 0  ✓\n// BF(1) = 0-0 = 0  ✓\n// BF(3) = 0-0 = 0  ✓\n// Все в норме!' }
      ]
    },
    {
      id: 4,
      title: 'Левое вращение (Left Rotation)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Левое вращение — зеркальное отражение правого. Применяется когда правое поддерево "перевешивает" (BF = +2, правый ребёнок BF = +1).' },
        { type: 'heading', value: 'Левое вращение — пошагово' },
        { type: 'code', language: 'java', value: '// До вращения:\n// x (BF=+2)\n//  \\\n//   y (BF=+1)\n//    \\\n//     z\n\n// После левого вращения вокруг x:\n//   y\n//  / \\\n// x   z\n\nAVLNode rotateLeft(AVLNode x) {\n    AVLNode y  = x.right;  // y станет новым корнем\n    AVLNode T2 = y.left;   // левое поддерево y переезжает к x\n\n    y.left  = x;   // x становится левым ребёнком y\n    x.right = T2;  // T2 становится правым ребёнком x\n\n    updateHeight(x);\n    updateHeight(y);\n\n    return y;\n}' },
        { type: 'heading', value: 'Пример левого вращения' },
        { type: 'code', language: 'java', value: '// Вставляем 1, 2, 3:\n// После вставки 3 узел 1 имеет BF=+2\n\n// Было:  1\n//         \\\n//          2\n//           \\\n//            3\n\n// rotateLeft(1):\n//   y=2, T2=null\n//   y.left  = 1\n//   1.right = null (T2)\n//   updateHeight(1): height=1\n//   updateHeight(2): height=2\n\n// Стало:  2\n//        / \\\n//       1   3\n\n// BF(2)=0, BF(1)=0, BF(3)=0 — всё сбалансировано!\n\n// Таблица: когда какое вращение?\n// BF = -2, BF(left) <= 0:  правое вращение\n// BF = +2, BF(right) >= 0: левое вращение\n// BF = -2, BF(left) = +1:  лево-правое (двойное)\n// BF = +2, BF(right) = -1: право-левое (двойное)' }
      ]
    },
    {
      id: 5,
      title: 'Двойные вращения: Left-Right и Right-Left',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда одного вращения недостаточно — нужно двойное. Left-Right (LR): сначала левое вращение левого ребёнка, потом правое вращение корня. Right-Left (RL): зеркально.' },
        { type: 'heading', value: 'Left-Right вращение' },
        { type: 'code', language: 'java', value: '// Ситуация LR: BF(z) = -2, BF(y) = +1\n// (левый ребёнок правоперевешен)\n//\n//       z (BF=-2)\n//      /\n//     y (BF=+1)\n//      \\\n//       x\n\n// Шаг 1: rotateLeft(y) → получаем правоперевешенное z\n//       z\n//      /\n//     x\n//    /\n//   y\n\n// Шаг 2: rotateRight(z)\n//     x\n//    / \\\n//   y   z\n\n// Пример: вставляем 3, 1, 2\n// После вставки 2:\n//     3 (BF=-2)\n//    /\n//   1 (BF=+1)\n//    \\\n//     2\n\n// rotateLeft(1) → \n//     3 (BF=-2)\n//    /\n//   2\n//  /\n// 1\n\n// rotateRight(3) →\n//     2\n//    / \\\n//   1   3' },
        { type: 'heading', value: 'Right-Left вращение' },
        { type: 'code', language: 'java', value: '// Ситуация RL: BF(z) = +2, BF(y) = -1\n//\n// z (BF=+2)\n//  \\\n//   y (BF=-1)\n//  /\n// x\n\n// Шаг 1: rotateRight(y)\n// Шаг 2: rotateLeft(z)\n\n// Пример: вставляем 1, 3, 2\n// После вставки 2:\n// 1 (BF=+2)\n//  \\\n//   3 (BF=-1)\n//  /\n// 2\n\n// rotateRight(3) →\n// 1 (BF=+2)\n//  \\\n//   2\n//    \\\n//     3\n\n// rotateLeft(1) →\n//     2\n//    / \\\n//   1   3\n\n// Итого 4 ситуации:\n// 1) LL: один rotateRight\n// 2) RR: один rotateLeft\n// 3) LR: rotateLeft(left) + rotateRight(root)\n// 4) RL: rotateRight(right) + rotateLeft(root)' }
      ]
    },
    {
      id: 6,
      title: 'Вставка в AVL-дерево с балансировкой',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вставка в AVL-дерево = вставка как в обычный BST + проверка баланса на пути обратно к корню + вращение при необходимости. Рекурсия сама "раскручивается" обратно и балансирует каждый узел.' },
        { type: 'heading', value: 'Полная реализация AVL insert' },
        { type: 'code', language: 'java', value: 'AVLNode insert(AVLNode node, int value) {\n    // Шаг 1: обычная вставка BST\n    if (node == null) return new AVLNode(value);\n\n    if (value < node.value)\n        node.left  = insert(node.left,  value);\n    else if (value > node.value)\n        node.right = insert(node.right, value);\n    else\n        return node;  // дубликат — ничего не делаем\n\n    // Шаг 2: обновляем высоту текущего узла\n    updateHeight(node);\n\n    // Шаг 3: проверяем баланс-фактор\n    int bf = getBalanceFactor(node);\n\n    // Шаг 4: 4 случая вращений\n\n    // LL: левый перекос, левый ребёнок тоже влево\n    if (bf == -2 && getBalanceFactor(node.left) <= 0)\n        return rotateRight(node);\n\n    // RR: правый перекос, правый ребёнок тоже вправо\n    if (bf == +2 && getBalanceFactor(node.right) >= 0)\n        return rotateLeft(node);\n\n    // LR: левый перекос, но левый ребёнок вправо\n    if (bf == -2 && getBalanceFactor(node.left) > 0) {\n        node.left = rotateLeft(node.left);\n        return rotateRight(node);\n    }\n\n    // RL: правый перекос, но правый ребёнок влево\n    if (bf == +2 && getBalanceFactor(node.right) < 0) {\n        node.right = rotateRight(node.right);\n        return rotateLeft(node);\n    }\n\n    return node;  // уже сбалансировано\n}' },
        { type: 'heading', value: 'Трассировка: вставка 3, 2, 1' },
        { type: 'code', language: 'java', value: '// insert(null, 3) → Node(3, h=1)\n// insert(Node(3), 2)\n//   2 < 3, влево: node.left = insert(null, 2) = Node(2, h=1)\n//   updateHeight(3): h = 1+max(1,0) = 2\n//   BF(3) = 0-1 = -1 → нет вращения\n//   Дерево: 3(h=2)\n//           /\n//          2(h=1)\n\n// insert(Node(3), 1)\n//   1 < 3, влево: node.left = insert(Node(2), 1)\n//     1 < 2, влево: node.left = insert(null,1) = Node(1, h=1)\n//     updateHeight(2): h = 1+max(1,0) = 2\n//     BF(2) = 0-1 = -1 → нет вращения, return Node(2)\n//   node.left = Node(2, h=2, left=Node(1))\n//   updateHeight(3): h = 1+max(2,0) = 3\n//   BF(3) = 0-2 = -2 → НАРУШЕНИЕ!\n//   BF(node.left=2) = -1 ≤ 0 → LL → rotateRight(3)\n//     y=2, T3=null\n//     y.right=3, 3.left=null\n//     updateHeight(3)=1, updateHeight(2)=2\n//   return Node(2, h=2)\n\n// Итог:   2(h=2)\n//        / \\\n//       1   3    ← сбалансировано!' },
        { type: 'list', items: [
          'Вставка AVL: O(log n) время — высота гарантированно O(log n)',
          'Максимум одно вращение (или двойное) на вставку',
          'После каждой вставки перебалансировка идёт снизу вверх по пути вставки',
          'В Java java.util.TreeMap использует красно-чёрное дерево (похоже на AVL)'
        ]}
      ]
    },
    {
      id: 7,
      title: 'Практика: Симуляция AVL вращений',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй AVL-дерево с вставкой и автоматической балансировкой. Последовательно вставь числа 1, 2, 3, 4, 5 — дерево должно автоматически балансироваться. Выведи inorder (отсортированный порядок) и высоту после всех вставок.',
      requirements: [
        'Создай класс AVLNode с полями value, left, right, height',
        'Реализуй rotateLeft и rotateRight',
        'Реализуй getBalanceFactor и updateHeight',
        'Реализуй insert с автоматической балансировкой (все 4 случая)',
        'Реализуй inorder и height',
        'Вставь числа: 1, 2, 3, 4, 5',
        'Без AVL-балансировки высота была бы 4. С AVL-балансировкой должна быть ≤ 3'
      ],
      expectedOutput: 'Inorder: 1 2 3 4 5\nВысота дерева: 2',
      hint: 'После каждой вставки вызывай updateHeight(node), вычисли BF и применяй нужное вращение. Важно: updateHeight для z вызывать ДО updateHeight для y внутри вращений.',
      solution: 'public class Main {\n    static class Node {\n        int val, h;\n        Node left, right;\n        Node(int v) { val = v; h = 1; }\n    }\n\n    static int h(Node n) { return n == null ? 0 : n.h; }\n    static int bf(Node n) { return n == null ? 0 : h(n.right) - h(n.left); }\n    static void upd(Node n) { if (n != null) n.h = 1 + Math.max(h(n.left), h(n.right)); }\n\n    static Node rotR(Node z) {\n        Node y = z.left, T3 = y.right;\n        y.right = z; z.left = T3;\n        upd(z); upd(y);\n        return y;\n    }\n\n    static Node rotL(Node x) {\n        Node y = x.right, T2 = y.left;\n        y.left = x; x.right = T2;\n        upd(x); upd(y);\n        return y;\n    }\n\n    static Node insert(Node node, int v) {\n        if (node == null) return new Node(v);\n        if (v < node.val)       node.left  = insert(node.left,  v);\n        else if (v > node.val)  node.right = insert(node.right, v);\n        else return node;\n        upd(node);\n        int b = bf(node);\n        if (b == -2 && bf(node.left)  <= 0) return rotR(node);\n        if (b == +2 && bf(node.right) >= 0) return rotL(node);\n        if (b == -2 && bf(node.left)  >  0) { node.left  = rotL(node.left);  return rotR(node); }\n        if (b == +2 && bf(node.right) <  0) { node.right = rotR(node.right); return rotL(node); }\n        return node;\n    }\n\n    static void inorder(Node n) {\n        if (n == null) return;\n        inorder(n.left);\n        System.out.print(n.val + " ");\n        inorder(n.right);\n    }\n\n    public static void main(String[] args) {\n        Node root = null;\n        for (int v : new int[]{1, 2, 3, 4, 5})\n            root = insert(root, v);\n        System.out.print("Inorder: "); inorder(root); System.out.println();\n        System.out.println("Высота дерева: " + (h(root) - 1));\n    }\n}',
      explanation: 'Последовательная вставка 1,2,3,4,5 в обычный BST даёт высоту 4 (вырожденная цепочка). AVL автоматически балансирует при каждой вставке: 1→2→[RR→rotL]→2,3→4→[RR→rotL]→результат — дерево высотой 2. Рекурсия поднимается обратно к корню и на каждом шаге проверяет BF, применяя нужное вращение.'
    }
  ]
}
