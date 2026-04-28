export default {
  id: 82,
  title: 'Практикум: Бинарное дерево',
  description: 'Практические задачи на бинарные деревья: обходы, глубина, симметрия, LCA, сериализация и другие классические задачи.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Inorder, Preorder, Postorder обход',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй три вида обхода бинарного дерева: inorder (лево-корень-право), preorder (корень-лево-право), postorder (лево-право-корень).',
      requirements: [
        'Создай класс TreeNode с полями val, left, right',
        'Реализуй рекурсивные методы inorder, preorder, postorder',
        'Каждый метод добавляет значения узлов в список',
        'Построй дерево [1, null, 2, 3] и выведи все три обхода'
      ],
      expectedOutput: 'Дерево: 1 -> null, 2 -> 3\nInorder: [1, 3, 2]\nPreorder: [1, 2, 3]\nPostorder: [3, 2, 1]',
      hint: 'Inorder: рекурсия(left), добавь val, рекурсия(right). Preorder: добавь val, рекурсия(left), рекурсия(right). Postorder: рекурсия(left), рекурсия(right), добавь val.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static int[] val;
    static int[] left;
    static int[] right;

    static void inorder(int node, List<Integer> result) {
        if (node == -1) return;
        inorder(left[node], result);
        result.add(val[node]);
        inorder(right[node], result);
    }

    static void preorder(int node, List<Integer> result) {
        if (node == -1) return;
        result.add(val[node]);
        preorder(left[node], result);
        preorder(right[node], result);
    }

    static void postorder(int node, List<Integer> result) {
        if (node == -1) return;
        postorder(left[node], result);
        postorder(right[node], result);
        result.add(val[node]);
    }

    public static void main(String[] args) {
        // Дерево: 1 -> right: 2 -> left: 3
        val = new int[]{1, 2, 3};
        left = new int[]{-1, 2, -1};
        right = new int[]{1, -1, -1};

        System.out.println("Дерево: 1 -> null, 2 -> 3");

        List<Integer> inRes = new ArrayList<>();
        inorder(0, inRes);
        System.out.println("Inorder: " + inRes);

        List<Integer> preRes = new ArrayList<>();
        preorder(0, preRes);
        System.out.println("Preorder: " + preRes);

        List<Integer> postRes = new ArrayList<>();
        postorder(0, postRes);
        System.out.println("Postorder: " + postRes);
    }
}`,
      explanation: 'Три вида обхода отличаются только моментом обработки корня: Inorder — между левым и правым поддеревом (для BST даёт отсортированный порядок), Preorder — сначала корень (полезен для копирования дерева), Postorder — корень последним (полезен для удаления дерева). Все три обхода имеют сложность O(n).'
    },
    {
      id: 2,
      title: 'Задача: Maximum Depth',
      type: 'practice',
      difficulty: 'easy',
      description: 'Найди максимальную глубину бинарного дерева. Глубина — это число узлов на самом длинном пути от корня до листа.',
      requirements: [
        'Реализуй рекурсивный метод maxDepth',
        'Базовый случай: null → 0',
        'Рекурсивный случай: 1 + max(глубина левого, глубина правого)',
        'Протестируй на дереве с глубиной 3'
      ],
      expectedOutput: 'Дерево: [3, 9, 20, null, null, 15, 7]\nМаксимальная глубина: 3',
      hint: 'maxDepth(node) = node == null ? 0 : 1 + Math.max(maxDepth(left), maxDepth(right))',
      solution: `public class Main {
    static int[] val, left, right;

    static int maxDepth(int node) {
        if (node == -1) return 0;
        return 1 + Math.max(maxDepth(left[node]), maxDepth(right[node]));
    }

    public static void main(String[] args) {
        // Дерево: 3 -> 9, 20 -> null, null, 15, 7
        val = new int[]{3, 9, 20, 15, 7};
        left = new int[]{1, -1, 3, -1, -1};
        right = new int[]{2, -1, 4, -1, -1};

        System.out.println("Дерево: [3, 9, 20, null, null, 15, 7]");
        System.out.println("Максимальная глубина: " + maxDepth(0));
    }
}`,
      explanation: 'Рекурсивное решение очень элегантно: глубина дерева равна 1 (текущий узел) плюс максимум из глубин левого и правого поддеревьев. Базовый случай — null (индекс -1), глубина 0. Для дерева [3,9,20,null,null,15,7]: корень 3 → max(глубина(9)=1, глубина(20)=2) + 1 = 3.'
    },
    {
      id: 3,
      title: 'Задача: Symmetric Tree',
      type: 'practice',
      difficulty: 'easy',
      description: 'Определи, является ли бинарное дерево симметричным (зеркальным). Дерево симметрично, если левое поддерево — зеркальное отражение правого.',
      requirements: [
        'Реализуй метод isSymmetric, который сравнивает два поддерева',
        'Два поддерева зеркальны, если: оба null, значения равны, left1 зеркалит right2 и right1 зеркалит left2',
        'Протестируй на симметричном и несимметричном деревьях',
        'Решение должно быть рекурсивным'
      ],
      expectedOutput: 'Дерево [1, 2, 2, 3, 4, 4, 3]: симметрично: true\nДерево [1, 2, 2, null, 3, null, 3]: симметрично: false',
      hint: 'Создай вспомогательный метод isMirror(node1, node2), который проверяет: оба null → true, один null → false, значения равны и isMirror(left1, right2) && isMirror(right1, left2).',
      solution: `public class Main {
    static int[] val, left, right;

    static boolean isMirror(int a, int b) {
        if (a == -1 && b == -1) return true;
        if (a == -1 || b == -1) return false;
        return val[a] == val[b]
            && isMirror(left[a], right[b])
            && isMirror(right[a], left[b]);
    }

    public static void main(String[] args) {
        // Симметричное дерево: [1, 2, 2, 3, 4, 4, 3]
        val = new int[]{1, 2, 2, 3, 4, 4, 3};
        left = new int[]{1, 3, 5, -1, -1, -1, -1};
        right = new int[]{2, 4, 6, -1, -1, -1, -1};
        System.out.println("Дерево [1, 2, 2, 3, 4, 4, 3]: симметрично: " + isMirror(left[0], right[0]));

        // Несимметричное дерево: [1, 2, 2, null, 3, null, 3]
        val = new int[]{1, 2, 2, 3, 3};
        left = new int[]{1, -1, -1, -1, -1};
        right = new int[]{2, 3, 4, -1, -1};
        System.out.println("Дерево [1, 2, 2, null, 3, null, 3]: симметрично: " + isMirror(left[0], right[0]));
    }
}`,
      explanation: 'Симметрия дерева проверяется попарным сравнением узлов: левый ребёнок одного поддерева должен быть зеркальной копией правого ребёнка другого, и наоборот. Рекурсия разворачивается от корня к листьям. Сложность O(n) — каждый узел посещается один раз.'
    },
    {
      id: 4,
      title: 'Задача: Level Order Traversal',
      type: 'practice',
      difficulty: 'medium',
      description: 'Выполни обход бинарного дерева по уровням (BFS). Верни список списков, где каждый внутренний список содержит значения узлов одного уровня.',
      requirements: [
        'Используй Queue (LinkedList) для BFS',
        'На каждом шаге обрабатывай все узлы текущего уровня',
        'Добавляй значения уровня в отдельный список',
        'Результат — список списков по уровням'
      ],
      expectedOutput: 'Дерево: [3, 9, 20, null, null, 15, 7]\nLevel Order: [[3], [9, 20], [15, 7]]',
      hint: 'На каждой итерации внешнего цикла запомни size = queue.size(). Это количество узлов текущего уровня. Обработай ровно size узлов, добавляя их потомков в очередь.',
      solution: `import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class Main {
    static int[] val, left, right;

    static List<List<Integer>> levelOrder(int root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == -1) return result;

        Queue<Integer> queue = new LinkedList<>();
        queue.add(root);

        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                int node = queue.poll();
                level.add(val[node]);
                if (left[node] != -1) queue.add(left[node]);
                if (right[node] != -1) queue.add(right[node]);
            }
            result.add(level);
        }
        return result;
    }

    public static void main(String[] args) {
        val = new int[]{3, 9, 20, 15, 7};
        left = new int[]{1, -1, 3, -1, -1};
        right = new int[]{2, -1, 4, -1, -1};

        System.out.println("Дерево: [3, 9, 20, null, null, 15, 7]");
        System.out.println("Level Order: " + levelOrder(0));
    }
}`,
      explanation: 'BFS с использованием очереди — стандартный способ обхода по уровням. Ключевой трюк: на каждой итерации мы запоминаем размер очереди (это количество узлов на текущем уровне) и обрабатываем ровно столько узлов. Все добавленные потомки попадут в очередь и будут обработаны на следующем уровне.'
    },
    {
      id: 5,
      title: 'Задача: Path Sum',
      type: 'practice',
      difficulty: 'easy',
      description: 'Определи, существует ли в бинарном дереве путь от корня до листа, сумма которого равна заданному числу targetSum.',
      requirements: [
        'Реализуй рекурсивный метод hasPathSum(node, remainingSum)',
        'Лист — узел без потомков; проверь remainingSum == val[node]',
        'Для внутреннего узла рекурсивно проверь левое и правое поддерево с уменьшенной суммой',
        'Верни true если хотя бы один путь подходит'
      ],
      expectedOutput: 'Дерево: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]\ntargetSum=22: true (путь: 5→4→11→2)',
      hint: 'hasPathSum(node, sum): если лист — проверь sum == val. Иначе: hasPathSum(left, sum - val) || hasPathSum(right, sum - val).',
      solution: `public class Main {
    static int[] val, left, right;

    static boolean hasPathSum(int node, int sum) {
        if (node == -1) return false;
        if (left[node] == -1 && right[node] == -1) {
            return sum == val[node];
        }
        return hasPathSum(left[node], sum - val[node])
            || hasPathSum(right[node], sum - val[node]);
    }

    public static void main(String[] args) {
        // [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]
        val = new int[]{5, 4, 8, 11, 13, 4, 7, 2, 1};
        left = new int[]{1, 3, 4, 6, -1, -1, -1, -1, -1};
        right = new int[]{2, -1, 5, 7, -1, 8, -1, -1, -1};

        System.out.println("Дерево: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]");
        System.out.println("targetSum=22: " + hasPathSum(0, 22) + " (путь: 5→4→11→2)");
    }
}`,
      explanation: 'Рекурсивно спускаемся от корня к листьям, вычитая значение каждого узла из оставшейся суммы. Когда дошли до листа — проверяем, равна ли оставшаяся сумма значению листа. Если хотя бы один путь удовлетворяет условию — возвращаем true. Сложность O(n) в худшем случае.'
    },
    {
      id: 6,
      title: 'Задача: Invert Binary Tree',
      type: 'practice',
      difficulty: 'easy',
      description: 'Инвертируй (отзеркаль) бинарное дерево — поменяй местами левого и правого потомка каждого узла.',
      requirements: [
        'Реализуй рекурсивный метод invertTree',
        'Для каждого узла поменяй left и right местами',
        'Рекурсивно инвертируй оба поддерева',
        'Выведи level order до и после инвертирования'
      ],
      expectedOutput: 'До инверсии: [4, 2, 7, 1, 3, 6, 9]\nПосле инверсии: [4, 7, 2, 9, 6, 3, 1]',
      hint: 'Для каждого узла: temp = left; left = right; right = temp. Затем рекурсивно вызови для обоих потомков.',
      solution: `import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class Main {
    static int[] val, left, right;

    static void invertTree(int node) {
        if (node == -1) return;
        int temp = left[node];
        left[node] = right[node];
        right[node] = temp;
        invertTree(left[node]);
        invertTree(right[node]);
    }

    static List<Integer> levelOrder(int root) {
        List<Integer> result = new ArrayList<>();
        if (root == -1) return result;
        Queue<Integer> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            int node = queue.poll();
            result.add(val[node]);
            if (left[node] != -1) queue.add(left[node]);
            if (right[node] != -1) queue.add(right[node]);
        }
        return result;
    }

    public static void main(String[] args) {
        val = new int[]{4, 2, 7, 1, 3, 6, 9};
        left = new int[]{1, 3, 5, -1, -1, -1, -1};
        right = new int[]{2, 4, 6, -1, -1, -1, -1};

        System.out.println("До инверсии: " + levelOrder(0));
        invertTree(0);
        System.out.println("После инверсии: " + levelOrder(0));
    }
}`,
      explanation: 'Инвертирование дерева — классическая рекурсивная задача. Для каждого узла меняем местами левого и правого ребёнка, затем рекурсивно обрабатываем поддеревья. После инвертирования всё дерево становится зеркальным отражением оригинала. Эту задачу прославил Макс Хоуэлл (создатель Homebrew), не решив её на интервью в Google.'
    },
    {
      id: 7,
      title: 'Задача: Validate BST',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проверь, является ли бинарное дерево валидным BST (деревом поиска). В BST все значения в левом поддереве < корня, а в правом > корня.',
      requirements: [
        'Реализуй метод isValidBST с параметрами min и max',
        'Для каждого узла проверяй: min < val < max',
        'Рекурсивно проверяй левое поддерево с max = val',
        'Рекурсивно проверяй правое поддерево с min = val'
      ],
      expectedOutput: 'Дерево [2, 1, 3]: BST? true\nДерево [5, 1, 4, null, null, 3, 6]: BST? false',
      hint: 'Используй Long.MIN_VALUE и Long.MAX_VALUE как начальные границы. При каждом рекурсивном вызове сужай допустимый диапазон.',
      solution: `public class Main {
    static int[] val, left, right;

    static boolean isValidBST(int node, long min, long max) {
        if (node == -1) return true;
        if (val[node] <= min || val[node] >= max) return false;
        return isValidBST(left[node], min, val[node])
            && isValidBST(right[node], val[node], max);
    }

    public static void main(String[] args) {
        // Дерево [2, 1, 3] — валидный BST
        val = new int[]{2, 1, 3};
        left = new int[]{1, -1, -1};
        right = new int[]{2, -1, -1};
        System.out.println("Дерево [2, 1, 3]: BST? " + isValidBST(0, Long.MIN_VALUE, Long.MAX_VALUE));

        // Дерево [5, 1, 4, null, null, 3, 6] — не валидный BST
        val = new int[]{5, 1, 4, 3, 6};
        left = new int[]{1, -1, 3, -1, -1};
        right = new int[]{2, -1, 4, -1, -1};
        System.out.println("Дерево [5, 1, 4, null, null, 3, 6]: BST? " + isValidBST(0, Long.MIN_VALUE, Long.MAX_VALUE));
    }
}`,
      explanation: 'Недостаточно проверять только parent > left и parent < right — нужно учитывать все ограничения предков. Передаём диапазон [min, max] при рекурсии: для левого поддерева max = val текущего узла, для правого min = val. Используем long вместо int, чтобы корректно обработать граничные значения Integer.MIN_VALUE и Integer.MAX_VALUE.'
    },
    {
      id: 8,
      title: 'Задача: Lowest Common Ancestor',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди наименьшего общего предка (LCA) двух узлов в бинарном дереве. LCA — это самый глубокий узел, который является предком обоих заданных узлов.',
      requirements: [
        'Реализуй рекурсивный метод lowestCommonAncestor(root, p, q)',
        'Если root == null || root == p || root == q — верни root',
        'Рекурсивно ищи в левом и правом поддеревьях',
        'Если оба поддерева вернули не null — root является LCA'
      ],
      expectedOutput: 'Дерево: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]\nLCA(5, 1) = 3\nLCA(5, 4) = 5',
      hint: 'Если p и q находятся в разных поддеревьях — LCA это текущий узел. Если оба в одном поддереве — LCA глубже.',
      solution: `public class Main {
    static int[] val, left, right;

    static int lca(int node, int p, int q) {
        if (node == -1) return -1;
        if (val[node] == p || val[node] == q) return node;

        int leftResult = lca(left[node], p, q);
        int rightResult = lca(right[node], p, q);

        if (leftResult != -1 && rightResult != -1) return node;
        return leftResult != -1 ? leftResult : rightResult;
    }

    public static void main(String[] args) {
        // [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]
        val = new int[]{3, 5, 1, 6, 2, 0, 8, 7, 4};
        left = new int[]{1, 3, 5, -1, 7, -1, -1, -1, -1};
        right = new int[]{2, 4, 6, -1, 8, -1, -1, -1, -1};

        System.out.println("Дерево: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]");
        int r1 = lca(0, 5, 1);
        System.out.println("LCA(5, 1) = " + val[r1]);
        int r2 = lca(0, 5, 4);
        System.out.println("LCA(5, 4) = " + val[r2]);
    }
}`,
      explanation: 'Алгоритм LCA работает так: рекурсивно ищем p и q в левом и правом поддеревьях. Если оба найдены в разных поддеревьях — текущий узел и есть LCA. Если оба в одном поддереве — LCA находится глубже, возвращаем результат непустого поддерева. Если текущий узел равен p или q — он сам является LCA (другой узел гарантированно ниже).'
    },
    {
      id: 9,
      title: 'Задача: Diameter of Binary Tree',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди диаметр бинарного дерева — длину самого длинного пути между любыми двумя узлами (в рёбрах). Путь не обязательно проходит через корень.',
      requirements: [
        'Реализуй рекурсивный метод, возвращающий высоту поддерева',
        'На каждом узле вычисляй потенциальный диаметр: высота левого + высота правого',
        'Обновляй глобальный максимум',
        'Диаметр — количество рёбер, не узлов'
      ],
      expectedOutput: 'Дерево: [1, 2, 3, 4, 5]\nДиаметр: 3 (путь: 4→2→1→3 или 5→2→1→3)',
      hint: 'Диаметр через узел = высота_левого + высота_правого. Глобальный диаметр — максимум по всем узлам. Высота = 1 + max(высота_левого, высота_правого).',
      solution: `public class Main {
    static int[] val, left, right;
    static int maxDiameter = 0;

    static int height(int node) {
        if (node == -1) return 0;
        int leftH = height(left[node]);
        int rightH = height(right[node]);
        maxDiameter = Math.max(maxDiameter, leftH + rightH);
        return 1 + Math.max(leftH, rightH);
    }

    public static void main(String[] args) {
        val = new int[]{1, 2, 3, 4, 5};
        left = new int[]{1, 3, -1, -1, -1};
        right = new int[]{2, 4, -1, -1, -1};

        maxDiameter = 0;
        height(0);
        System.out.println("Дерево: [1, 2, 3, 4, 5]");
        System.out.println("Диаметр: " + maxDiameter + " (путь: 4→2→1→3 или 5→2→1→3)");
    }
}`,
      explanation: 'Диаметр дерева — длина самого длинного пути между двумя узлами. Для каждого узла потенциальный диаметр = высота левого поддерева + высота правого поддерева (путь через этот узел). Мы вычисляем высоту рекурсивно и на каждом шаге обновляем глобальный максимум диаметра. Сложность O(n), так как каждый узел посещается один раз.'
    },
    {
      id: 10,
      title: 'Задача: Serialize и Deserialize Binary Tree',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй сериализацию бинарного дерева в строку и десериализацию обратно. Дерево должно восстанавливаться идентично.',
      requirements: [
        'serialize: обход preorder, null обозначай как "null", разделитель ","',
        'deserialize: разбей строку по ",", воссоздай дерево рекурсивно',
        'Используй Queue или индекс для десериализации',
        'Проверь: serialize(deserialize(data)) == data'
      ],
      expectedOutput: 'Оригинал: [1, 2, 3, null, null, 4, 5]\nСериализовано: 1,2,null,null,3,4,null,null,5,null,null\nДесериализовано и снова сериализовано: 1,2,null,null,3,4,null,null,5,null,null',
      hint: 'Serialize: preorder обход, добавляй "null" для null-узлов. Deserialize: используй Queue из токенов, рекурсивно бери следующий токен — если "null" вернуть -1, иначе создать узел.',
      solution: `import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class Main {
    static List<Integer> vals = new ArrayList<>();
    static List<Integer> lefts = new ArrayList<>();
    static List<Integer> rights = new ArrayList<>();

    static String serialize(int node) {
        if (node == -1) return "null";
        return vals.get(node) + "," + serialize(lefts.get(node)) + "," + serialize(rights.get(node));
    }

    static int deserialize(Queue<String> queue) {
        String token = queue.poll();
        if (token.equals("null")) return -1;

        int idx = vals.size();
        vals.add(Integer.parseInt(token));
        lefts.add(-1);
        rights.add(-1);

        lefts.set(idx, deserialize(queue));
        rights.set(idx, deserialize(queue));
        return idx;
    }

    public static void main(String[] args) {
        // Построим дерево [1, 2, 3, null, null, 4, 5]
        vals.clear(); lefts.clear(); rights.clear();
        vals.add(1); lefts.add(1); rights.add(2);  // 0: val=1
        vals.add(2); lefts.add(-1); rights.add(-1); // 1: val=2
        vals.add(3); lefts.add(3); rights.add(4);  // 2: val=3
        vals.add(4); lefts.add(-1); rights.add(-1); // 3: val=4
        vals.add(5); lefts.add(-1); rights.add(-1); // 4: val=5

        String serialized = serialize(0);
        System.out.println("Оригинал: [1, 2, 3, null, null, 4, 5]");
        System.out.println("Сериализовано: " + serialized);

        // Десериализация
        vals.clear(); lefts.clear(); rights.clear();
        Queue<String> queue = new LinkedList<>();
        for (String s : serialized.split(",")) {
            queue.add(s);
        }
        int root = deserialize(queue);
        System.out.println("Десериализовано и снова сериализовано: " + serialize(root));
    }
}`,
      explanation: 'Сериализация использует preorder обход: записываем значение корня, затем рекурсивно левое и правое поддерево. null-узлы записываются как "null" — это важно для однозначного восстановления структуры. Десериализация читает токены последовательно из очереди: если "null" — возвращаем пустой узел, иначе — создаём узел и рекурсивно строим его поддеревья. Preorder + маркеры null дают уникальное представление любого дерева.'
    }
  ]
}
