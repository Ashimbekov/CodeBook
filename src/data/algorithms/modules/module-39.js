export default {
  id: 39,
  title: 'Практикум: Tree задачи',
  description: 'Десять классических задач LeetCode на бинарные деревья. От обхода в глубину и ширину до сериализации и построения дерева.',
  lessons: [
    {
      id: 1,
      title: 'Maximum Depth of Binary Tree (LeetCode #104)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан корень бинарного дерева. Верните его максимальную глубину — количество узлов на самом длинном пути от корня до листа.',
      requirements: [
        'Реализуйте метод int maxDepth(TreeNode root)',
        'Глубина пустого дерева = 0',
        'Глубина дерева из одного узла = 1',
        'Рекурсивное или итеративное решение'
      ],
      expectedOutput: 'maxDepth([3,9,20,null,null,15,7]) -> 3\nmaxDepth([1,null,2]) -> 2\nmaxDepth([]) -> 0',
      hint: 'Рекурсия: глубина = 1 + max(глубина левого, глубина правого). Базовый случай: null -> 0.',
      solution: `// Определение узла
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

public class MaxDepth {
    // Рекурсивный DFS — O(n) время, O(h) память
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        int leftDepth = maxDepth(root.left);
        int rightDepth = maxDepth(root.right);
        return 1 + Math.max(leftDepth, rightDepth);
    }

    public static void main(String[] args) {
        MaxDepth sol = new MaxDepth();
        //       3
        //      / \\
        //     9   20
        //        /  \\
        //       15    7
        TreeNode root = new TreeNode(3);
        root.left = new TreeNode(9);
        root.right = new TreeNode(20);
        root.right.left = new TreeNode(15);
        root.right.right = new TreeNode(7);

        System.out.println(sol.maxDepth(root)); // 3
        System.out.println(sol.maxDepth(null)); // 0
    }
}`,
      explanation: 'Классическая рекурсия на деревьях. Базовый случай: null -> 0. Рекурсивный случай: 1 + max(левое, правое). Каждый узел посещается ровно один раз. Время O(n), память O(h), где h — высота дерева (O(n) в худшем, O(log n) для сбалансированного).'
    },
    {
      id: 2,
      title: 'Same Tree (LeetCode #100)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Даны корни двух бинарных деревьев p и q. Определите, являются ли они одинаковыми. Деревья одинаковы, если имеют одинаковую структуру и одинаковые значения узлов.',
      requirements: [
        'Реализуйте метод boolean isSameTree(TreeNode p, TreeNode q)',
        'Деревья одинаковы по структуре и значениям',
        'Оба null = одинаковы',
        'Рекурсивное решение'
      ],
      expectedOutput: 'isSameTree([1,2,3], [1,2,3]) -> true\nisSameTree([1,2], [1,null,2]) -> false\nisSameTree([1,2,1], [1,1,2]) -> false',
      hint: 'Рекурсия: оба null -> true. Один null -> false. Значения разные -> false. Иначе рекурсивно проверяем left и right.',
      solution: `public class SameTree {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        // Оба пустые — одинаковые
        if (p == null && q == null) return true;
        // Одно пустое — разные
        if (p == null || q == null) return false;
        // Значения разные
        if (p.val != q.val) return false;
        // Рекурсивно проверяем поддеревья
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }

    public static void main(String[] args) {
        SameTree sol = new SameTree();
        // Дерево 1: [1,2,3]
        TreeNode p = new TreeNode(1);
        p.left = new TreeNode(2);
        p.right = new TreeNode(3);
        // Дерево 2: [1,2,3]
        TreeNode q = new TreeNode(1);
        q.left = new TreeNode(2);
        q.right = new TreeNode(3);

        System.out.println(sol.isSameTree(p, q)); // true

        // Дерево 3: [1,2] vs [1,null,2]
        TreeNode a = new TreeNode(1);
        a.left = new TreeNode(2);
        TreeNode b = new TreeNode(1);
        b.right = new TreeNode(2);
        System.out.println(sol.isSameTree(a, b)); // false
    }
}`,
      explanation: 'Три базовых случая: оба null (true), один null (false), значения разные (false). Рекурсивный случай: оба поддерева должны совпадать. Это шаблон для многих задач на деревья. Время O(n), память O(h).'
    },
    {
      id: 3,
      title: 'Invert Binary Tree (LeetCode #226)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан корень бинарного дерева. Инвертируйте (отзеркальте) дерево и верните его корень.',
      requirements: [
        'Реализуйте метод TreeNode invertTree(TreeNode root)',
        'Поменяйте местами левое и правое поддерево рекурсивно',
        'Верните корень модифицированного дерева',
        'Пустое дерево -> null'
      ],
      expectedOutput: 'invertTree([4,2,7,1,3,6,9]) -> [4,7,2,9,6,3,1]\ninvertTree([2,1,3]) -> [2,3,1]\ninvertTree([]) -> []',
      hint: 'Рекурсия: для каждого узла поменяйте left и right местами, затем рекурсивно инвертируйте каждое поддерево.',
      solution: `public class InvertTree {
    public TreeNode invertTree(TreeNode root) {
        if (root == null) return null;

        // Меняем left и right местами
        TreeNode temp = root.left;
        root.left = root.right;
        root.right = temp;

        // Рекурсивно инвертируем поддеревья
        invertTree(root.left);
        invertTree(root.right);

        return root;
    }

    public static void main(String[] args) {
        InvertTree sol = new InvertTree();
        //       4                4
        //      / \\    =>       / \\
        //     2   7           7   2
        //    / \\ / \\        / \\ / \\
        //   1  3 6  9      9  6 3  1
        TreeNode root = new TreeNode(4);
        root.left = new TreeNode(2);
        root.right = new TreeNode(7);
        root.left.left = new TreeNode(1);
        root.left.right = new TreeNode(3);
        root.right.left = new TreeNode(6);
        root.right.right = new TreeNode(9);

        TreeNode inverted = sol.invertTree(root);
        System.out.println(inverted.left.val);  // 7
        System.out.println(inverted.right.val); // 2
    }
}`,
      explanation: 'Знаменитая задача (Homebrew author). Рекурсия: меняем left и right, затем инвертируем каждое поддерево. Можно делать в любом порядке: preorder, postorder, inorder (но осторожно). Время O(n) — посещаем каждый узел ровно раз, память O(h).'
    },
    {
      id: 4,
      title: 'Binary Tree Level Order Traversal (LeetCode #102)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан корень бинарного дерева. Верните обход по уровням (слева направо, уровень за уровнем).',
      requirements: [
        'Реализуйте метод List<List<Integer>> levelOrder(TreeNode root)',
        'Каждый уровень — отдельный список',
        'Узлы на уровне — слева направо',
        'Используйте BFS (очередь)'
      ],
      expectedOutput: 'levelOrder([3,9,20,null,null,15,7]) -> [[3],[9,20],[15,7]]\nlevelOrder([1]) -> [[1]]\nlevelOrder([]) -> []',
      hint: 'BFS с уровнями: на каждой итерации обрабатываем все узлы текущего уровня (queue.size() узлов), добавляя их детей для следующего уровня.',
      solution: `import java.util.*;

public class LevelOrder {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;

        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            int levelSize = queue.size(); // количество узлов на текущем уровне
            List<Integer> level = new ArrayList<>();

            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);

                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            result.add(level);
        }
        return result;
    }

    public static void main(String[] args) {
        LevelOrder sol = new LevelOrder();
        //       3
        //      / \\
        //     9   20
        //        /  \\
        //       15    7
        TreeNode root = new TreeNode(3);
        root.left = new TreeNode(9);
        root.right = new TreeNode(20);
        root.right.left = new TreeNode(15);
        root.right.right = new TreeNode(7);

        System.out.println(sol.levelOrder(root)); // [[3],[9,20],[15,7]]
    }
}`,
      explanation: 'BFS с обработкой уровней. Ключевой трюк: запоминаем queue.size() перед обработкой уровня. Внутренний цикл обрабатывает ровно один уровень, добавляя детей в очередь для следующего. Время O(n), память O(n) (ширина дерева).'
    },
    {
      id: 5,
      title: 'Validate BST (LeetCode #98)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан корень бинарного дерева. Определите, является ли оно допустимым BST (Binary Search Tree). В BST все значения в левом поддереве < root < все в правом.',
      requirements: [
        'Реализуйте метод boolean isValidBST(TreeNode root)',
        'Левое поддерево содержит только значения < root',
        'Правое поддерево содержит только значения > root',
        'Оба поддерева тоже должны быть BST',
        'Дубликаты не допускаются'
      ],
      expectedOutput: 'isValidBST([2,1,3]) -> true\nisValidBST([5,1,4,null,null,3,6]) -> false  // 4 < 5, но 3 в правом поддереве\nisValidBST([5,4,6,null,null,3,7]) -> false  // 3 < 5, но в правом поддереве',
      hint: 'Передавайте допустимый диапазон (min, max) при рекурсии. Для левого поддерева max = root.val, для правого min = root.val.',
      solution: `public class ValidateBST {
    public boolean isValidBST(TreeNode root) {
        return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    private boolean validate(TreeNode node, long min, long max) {
        if (node == null) return true;

        // Значение должно быть строго в диапазоне (min, max)
        if (node.val <= min || node.val >= max) return false;

        // Левое поддерево: max = node.val
        // Правое поддерево: min = node.val
        return validate(node.left, min, node.val)
            && validate(node.right, node.val, max);
    }

    public static void main(String[] args) {
        ValidateBST sol = new ValidateBST();
        //     2
        //    / \\
        //   1   3
        TreeNode t1 = new TreeNode(2);
        t1.left = new TreeNode(1);
        t1.right = new TreeNode(3);
        System.out.println(sol.isValidBST(t1)); // true

        //     5
        //    / \\
        //   1   4
        //      / \\
        //     3   6
        TreeNode t2 = new TreeNode(5);
        t2.left = new TreeNode(1);
        t2.right = new TreeNode(4);
        t2.right.left = new TreeNode(3);
        t2.right.right = new TreeNode(6);
        System.out.println(sol.isValidBST(t2)); // false
    }
}`,
      explanation: 'Частая ошибка — проверять только node.left < node < node.right. Нужно проверять ВСЕ узлы в поддереве. Решение: передаём допустимый диапазон. Используем long, чтобы покрыть граничные случаи с Integer.MIN_VALUE/MAX_VALUE. Время O(n), память O(h).'
    },
    {
      id: 6,
      title: 'Kth Smallest Element in BST (LeetCode #230)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан корень BST и число k. Верните k-й наименьший элемент (1-indexed).',
      requirements: [
        'Реализуйте метод int kthSmallest(TreeNode root, int k)',
        'k всегда валиден (1 <= k <= количество узлов)',
        'Используйте свойство BST: inorder обход даёт отсортированный порядок',
        'Итеративное решение предпочтительнее'
      ],
      expectedOutput: 'kthSmallest([3,1,4,null,2], 1) -> 1\nkthSmallest([5,3,6,2,4,null,null,1], 3) -> 3',
      hint: 'Inorder обход BST даёт элементы в порядке возрастания. Используйте итеративный inorder со стеком и счётчиком.',
      solution: `import java.util.Stack;

public class KthSmallestBST {
    public int kthSmallest(TreeNode root, int k) {
        // Итеративный inorder обход
        Stack<TreeNode> stack = new Stack<>();
        TreeNode curr = root;
        int count = 0;

        while (curr != null || !stack.isEmpty()) {
            // Идём в самый левый узел
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            // Обрабатываем узел
            curr = stack.pop();
            count++;
            if (count == k) return curr.val;

            // Переходим в правое поддерево
            curr = curr.right;
        }
        return -1; // не достигается при валидном k
    }

    public static void main(String[] args) {
        KthSmallestBST sol = new KthSmallestBST();
        //       3
        //      / \\
        //     1   4
        //      \\
        //       2
        TreeNode root = new TreeNode(3);
        root.left = new TreeNode(1);
        root.right = new TreeNode(4);
        root.left.right = new TreeNode(2);

        System.out.println(sol.kthSmallest(root, 1)); // 1
        System.out.println(sol.kthSmallest(root, 2)); // 2
        System.out.println(sol.kthSmallest(root, 3)); // 3
    }
}`,
      explanation: 'Inorder обход BST = отсортированный порядок. Итеративный inorder со стеком: идём влево до конца, обрабатываем, идём вправо. Считаем узлы — на k-м останавливаемся. Время O(H + k), где H — высота. Лучше рекурсии: останавливаемся сразу, не обходя всё дерево.'
    },
    {
      id: 7,
      title: 'Lowest Common Ancestor (LeetCode #236)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан корень бинарного дерева и два узла p и q. Найдите их наименьшего общего предка (LCA). LCA — самый глубокий узел, являющийся предком обоих.',
      requirements: [
        'Реализуйте метод TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q)',
        'Все значения уникальны',
        'p и q существуют в дереве',
        'Узел является предком самого себя',
        'Решение за O(n)'
      ],
      expectedOutput: 'LCA([3,5,1,6,2,0,8,null,null,7,4], p=5, q=1) -> 3\nLCA([3,5,1,6,2,0,8,null,null,7,4], p=5, q=4) -> 5',
      hint: 'Рекурсия: если root == p или root == q — возвращаем root. Рекурсивно ищем в left и right. Если оба не null — root = LCA. Если один null — возвращаем другой.',
      solution: `public class LowestCommonAncestor {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Базовый случай
        if (root == null || root == p || root == q) {
            return root;
        }

        // Ищем в левом и правом поддеревьях
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);

        // Оба найдены — root = LCA
        if (left != null && right != null) return root;
        // Один найден — возвращаем его (LCA выше или это он)
        return left != null ? left : right;
    }

    public static void main(String[] args) {
        LowestCommonAncestor sol = new LowestCommonAncestor();
        //         3
        //        / \\
        //       5   1
        //      / \\ / \\
        //     6  2 0  8
        //       / \\
        //      7   4
        TreeNode root = new TreeNode(3);
        TreeNode n5 = new TreeNode(5);
        TreeNode n1 = new TreeNode(1);
        root.left = n5; root.right = n1;
        n5.left = new TreeNode(6);
        TreeNode n2 = new TreeNode(2);
        n5.right = n2;
        n1.left = new TreeNode(0);
        n1.right = new TreeNode(8);
        n2.left = new TreeNode(7);
        TreeNode n4 = new TreeNode(4);
        n2.right = n4;

        System.out.println(sol.lowestCommonAncestor(root, n5, n1).val); // 3
        System.out.println(sol.lowestCommonAncestor(root, n5, n4).val); // 5
    }
}`,
      explanation: 'Элегантная рекурсия: если нашли p или q — возвращаем. Если оба поддерева вернули не null — текущий узел = LCA (p и q по разные стороны). Если только одно — LCA там. "Узел является предком самого себя" покрывается базовым случаем root == p || root == q. Время O(n), память O(h).'
    },
    {
      id: 8,
      title: 'Binary Tree Right Side View (LeetCode #199)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан корень бинарного дерева. Верните значения узлов, видимых справа (правый вид дерева) — последний узел каждого уровня.',
      requirements: [
        'Реализуйте метод List<Integer> rightSideView(TreeNode root)',
        'Для каждого уровня возьмите самый правый узел',
        'Используйте BFS (по уровням) или DFS',
        'Пустое дерево -> пустой список'
      ],
      expectedOutput: 'rightSideView([1,2,3,null,5,null,4]) -> [1,3,4]\nrightSideView([1,null,3]) -> [1,3]\nrightSideView([]) -> []',
      hint: 'BFS по уровням: последний элемент каждого уровня — видимый справа. Или DFS: сначала идём в правое поддерево, добавляем узел если result.size() == depth.',
      solution: `import java.util.*;

public class RightSideView {
    // BFS решение — берём последний элемент каждого уровня
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;

        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);

        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                // Последний узел на уровне — видимый справа
                if (i == levelSize - 1) {
                    result.add(node.val);
                }
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
        }
        return result;
    }

    public static void main(String[] args) {
        RightSideView sol = new RightSideView();
        //       1
        //      / \\
        //     2   3
        //      \\   \\
        //       5    4
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.left.right = new TreeNode(5);
        root.right.right = new TreeNode(4);

        System.out.println(sol.rightSideView(root)); // [1, 3, 4]
    }
}`,
      explanation: 'BFS по уровням, берём последний элемент каждого уровня (i == levelSize - 1). Альтернативный DFS подход: обходим сначала правое поддерево, добавляем узел, если его глубина == result.size(). Оба подхода O(n) по времени.'
    },
    {
      id: 9,
      title: 'Construct Tree from Preorder and Inorder (LeetCode #105)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Даны массивы preorder и inorder обхода бинарного дерева. Постройте дерево.',
      requirements: [
        'Реализуйте метод TreeNode buildTree(int[] preorder, int[] inorder)',
        'preorder: корень, левое, правое',
        'inorder: левое, корень, правое',
        'Все значения уникальны',
        'Используйте HashMap для быстрого поиска индекса в inorder'
      ],
      expectedOutput: 'buildTree([3,9,20,15,7], [9,3,15,20,7])\n-> дерево: 3(9, 20(15, 7))',
      hint: 'Первый элемент preorder — корень. Найдите его в inorder: слева — левое поддерево, справа — правое. Рекурсивно строите оба поддерева.',
      solution: `import java.util.*;

public class BuildTree {
    private Map<Integer, Integer> inorderIndex;
    private int preorderIdx;

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        // Маппинг значение -> индекс в inorder для O(1) поиска
        inorderIndex = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) {
            inorderIndex.put(inorder[i], i);
        }
        preorderIdx = 0;
        return build(preorder, 0, inorder.length - 1);
    }

    private TreeNode build(int[] preorder, int inLeft, int inRight) {
        if (inLeft > inRight) return null;

        // Текущий корень — следующий элемент preorder
        int rootVal = preorder[preorderIdx++];
        TreeNode root = new TreeNode(rootVal);

        // Индекс корня в inorder делит на левое и правое поддеревья
        int inorderRootIdx = inorderIndex.get(rootVal);

        // Сначала строим левое (preorder: корень, ЛЕВОЕ, правое)
        root.left = build(preorder, inLeft, inorderRootIdx - 1);
        root.right = build(preorder, inorderRootIdx + 1, inRight);

        return root;
    }

    public static void main(String[] args) {
        BuildTree sol = new BuildTree();
        int[] preorder = {3, 9, 20, 15, 7};
        int[] inorder  = {9, 3, 15, 20, 7};

        TreeNode root = sol.buildTree(preorder, inorder);
        //       3
        //      / \\
        //     9   20
        //        /  \\
        //       15    7
        System.out.println(root.val);              // 3
        System.out.println(root.left.val);          // 9
        System.out.println(root.right.val);         // 20
        System.out.println(root.right.left.val);    // 15
        System.out.println(root.right.right.val);   // 7
    }
}`,
      explanation: 'Preorder даёт порядок корней, inorder разделяет на левое/правое поддеревья. Алгоритм: 1) Берём следующий корень из preorder. 2) Находим его в inorder — всё слева = левое поддерево, справа = правое. 3) Рекурсивно строим. HashMap для O(1) поиска в inorder. Время O(n).'
    },
    {
      id: 10,
      title: 'Serialize and Deserialize Binary Tree (LeetCode #297)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте сериализацию и десериализацию бинарного дерева. Преобразуйте дерево в строку и обратно так, чтобы исходное дерево восстанавливалось полностью.',
      requirements: [
        'Реализуйте методы String serialize(TreeNode root) и TreeNode deserialize(String data)',
        'Формат сериализации на ваш выбор',
        'Поддержите null-узлы',
        'Дерево может быть любым (не обязательно BST)',
        'deserialize(serialize(root)) должен вернуть идентичное дерево'
      ],
      expectedOutput: 'serialize([1,2,3,null,null,4,5]) -> "1,2,null,null,3,4,null,null,5,null,null"\ndeserialize("1,2,null,null,3,4,null,null,5,null,null") -> [1,2,3,null,null,4,5]',
      hint: 'Preorder DFS: при сериализации записывайте значения и "null" для пустых узлов. При десериализации используйте очередь токенов и рекурсию.',
      solution: `import java.util.*;

public class Codec {
    private static final String NULL = "null";
    private static final String SEP = ",";

    // Сериализация: preorder DFS
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        serializeDFS(root, sb);
        return sb.toString();
    }

    private void serializeDFS(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append(NULL).append(SEP);
            return;
        }
        sb.append(node.val).append(SEP);
        serializeDFS(node.left, sb);
        serializeDFS(node.right, sb);
    }

    // Десериализация
    public TreeNode deserialize(String data) {
        Queue<String> tokens = new LinkedList<>(
            Arrays.asList(data.split(SEP))
        );
        return deserializeDFS(tokens);
    }

    private TreeNode deserializeDFS(Queue<String> tokens) {
        String val = tokens.poll();
        if (val.equals(NULL)) return null;

        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left = deserializeDFS(tokens);
        node.right = deserializeDFS(tokens);
        return node;
    }

    public static void main(String[] args) {
        Codec codec = new Codec();
        //       1
        //      / \\
        //     2   3
        //        / \\
        //       4   5
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.right.left = new TreeNode(4);
        root.right.right = new TreeNode(5);

        String serialized = codec.serialize(root);
        System.out.println(serialized);
        // "1,2,null,null,3,4,null,null,5,null,null,"

        TreeNode deserialized = codec.deserialize(serialized);
        System.out.println(deserialized.val);              // 1
        System.out.println(deserialized.right.left.val);   // 4

        // Проверка: serialize(deserialize(x)) == x
        System.out.println(codec.serialize(deserialized).equals(serialized)); // true
    }
}`,
      explanation: 'Preorder DFS с маркерами null. Сериализация: обход дерева, записывая значения и "null" для пустых узлов. Десериализация: разбиваем строку на токены, рекурсивно восстанавливаем дерево (preorder гарантирует правильный порядок). Время O(n) для обеих операций.'
    }
  ]
}
