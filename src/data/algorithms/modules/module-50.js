export default {
  id: 50,
  title: 'Практикум: Mock Interview',
  description: 'Имитация настоящего FAANG-собеседования: 10 раундов с задачами разной сложности. Засекай время, решай самостоятельно, потом сверяйся с решением.',
  lessons: [
    {
      id: 1,
      title: 'Two Sum + Follow-up',
      type: 'practice',
      difficulty: 'medium',
      description: 'Раунд 1: Google Style. Тебе дают 25 минут. Прочитай задачу и попробуй решить самостоятельно перед просмотром решения.\n\nЧасть 1 (easy): Дан массив nums и число target. Найди индексы двух чисел, дающих в сумме target.\nЧасть 2 (medium, follow-up): А если массив отсортирован? Реши за O(1) доп. памяти.',
      requirements: [
        'Часть 1: HashMap подход — O(n) время, O(n) память',
        'Часть 2: Two Pointers подход — O(n) время, O(1) память',
        'Обработай edge case: одно число не может использоваться дважды',
        'Объясни trade-off между двумя подходами',
        'Оцени сложность обоих решений',
        'Таймер: 25 минут на оба решения'
      ],
      expectedOutput: 'Часть 1: nums=[2,7,11,15], target=9 → [0, 1]\nЧасть 2: nums=[2,7,11,15], target=9 → [0, 1]',
      hint: 'Часть 1: для каждого num проверяй, есть ли (target - num) в map. Часть 2: left=0, right=last. Если сумма < target → left++, если > → right--.',
      solution: `import java.util.*;

public class Main {
    // Часть 1: HashMap — O(n) время, O(n) память
    static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }

    // Часть 2: Two Pointers (массив отсортирован) — O(n) время, O(1) память
    static int[] twoSumSorted(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        while (left < right) {
            int sum = nums[left] + nums[right];
            if (sum == target) return new int[]{left, right};
            if (sum < target) left++;
            else right--;
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        System.out.println("Часть 1: nums=[2,7,11,15], target=9 → " +
            Arrays.toString(twoSum(new int[]{2,7,11,15}, 9)));
        System.out.println("Часть 2: nums=[2,7,11,15], target=9 → " +
            Arrays.toString(twoSumSorted(new int[]{2,7,11,15}, 9)));
    }
}`,
      explanation: 'Классический вопрос Google: начинают с easy, потом усложняют follow-up. HashMap — универсальный O(n), Two Pointers — оптимальный для отсортированного. Интервьюер оценивает переход от brute force к оптимальному.'
    },
    {
      id: 2,
      title: 'LRU Cache',
      type: 'practice',
      difficulty: 'medium',
      description: 'Раунд 2: Amazon Style. Тебе дают 25 минут. Прочитай задачу и попробуй решить самостоятельно перед просмотром решения.\n\nРеализуй LRU Cache (Least Recently Used) с операциями get(key) и put(key, value). При превышении capacity удаляется наименее недавно использованный элемент.',
      requirements: [
        'Класс LRUCache с конструктором LRUCache(int capacity)',
        'int get(int key) — O(1), возвращает -1 если нет',
        'void put(int key, int value) — O(1)',
        'При get/put элемент становится "самым недавним"',
        'При put если capacity превышен — удали LRU элемент',
        'Таймер: 25 минут. Используй HashMap + Doubly Linked List'
      ],
      expectedOutput: 'put(1,1), put(2,2)\nget(1) → 1\nput(3,3) → вытеснен ключ 2\nget(2) → -1\nput(4,4) → вытеснен ключ 1\nget(1) → -1\nget(3) → 3\nget(4) → 4',
      hint: 'HashMap<key, Node> для O(1) поиска. Doubly Linked List для O(1) удаления/перемещения. Head = MRU, Tail = LRU. При get/put перемещай в head.',
      solution: `import java.util.*;

public class Main {
    static class Node {
        int key, val;
        Node prev, next;
        Node(int k, int v) { key = k; val = v; }
    }

    static Map<Integer, Node> map = new HashMap<>();
    static Node head = new Node(0, 0); // dummy head (MRU side)
    static Node tail = new Node(0, 0); // dummy tail (LRU side)
    static int capacity;

    static void init(int cap) {
        capacity = cap;
        map.clear();
        head.next = tail;
        tail.prev = head;
    }

    static void addToHead(Node node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }

    static void removeNode(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    static int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node node = map.get(key);
        removeNode(node);   // убираем из текущей позиции
        addToHead(node);     // ставим в начало (MRU)
        return node.val;
    }

    static void put(int key, int value) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            node.val = value;
            removeNode(node);
            addToHead(node);
        } else {
            Node node = new Node(key, value);
            map.put(key, node);
            addToHead(node);
            if (map.size() > capacity) {
                Node lru = tail.prev; // LRU — перед dummy tail
                removeNode(lru);
                map.remove(lru.key);
            }
        }
    }

    public static void main(String[] args) {
        init(2);
        put(1, 1); put(2, 2);
        System.out.println("put(1,1), put(2,2)");
        System.out.println("get(1) → " + get(1));
        put(3, 3);
        System.out.println("put(3,3) → вытеснен ключ 2");
        System.out.println("get(2) → " + get(2));
        put(4, 4);
        System.out.println("put(4,4) → вытеснен ключ 1");
        System.out.println("get(1) → " + get(1));
        System.out.println("get(3) → " + get(3));
        System.out.println("get(4) → " + get(4));
    }
}`,
      explanation: 'HashMap + Doubly Linked List = O(1) для get и put. HashMap даёт O(1) поиск по ключу. Linked List даёт O(1) перемещение и удаление. Dummy head/tail упрощают граничные случаи. Топовый вопрос на Amazon.'
    },
    {
      id: 3,
      title: 'Merge K Sorted Lists',
      type: 'practice',
      difficulty: 'hard',
      description: 'Раунд 3: Facebook/Meta Style. Тебе дают 25 минут. Прочитай задачу и попробуй решить самостоятельно перед просмотром решения.\n\nДаны k отсортированных связных списков. Слей их в один отсортированный список.',
      requirements: [
        'Метод ListNode mergeKLists(ListNode[] lists)',
        'Подход 1: PriorityQueue (min-heap) — O(n log k)',
        'Подход 2: Divide and Conquer — O(n log k)',
        'Реализуй оба подхода, объясни trade-offs',
        'Не забудь null-списки в массиве',
        'Таймер: 25 минут'
      ],
      expectedOutput: '[[1,4,5],[1,3,4],[2,6]] → [1,1,2,3,4,4,5,6]\n[[]] → []\n[] → []',
      hint: 'PriorityQueue: добавь head каждого списка в heap. Извлекай min, добавляй его next. Divide & Conquer: попарно сливай (как merge sort).',
      solution: `import java.util.*;

public class Main {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int v) { val = v; }
        ListNode(int v, ListNode n) { val = v; next = n; }
    }

    // Подход 1: PriorityQueue — O(n log k)
    static ListNode mergeKLists(ListNode[] lists) {
        PriorityQueue<ListNode> heap = new PriorityQueue<>(
            (a, b) -> Integer.compare(a.val, b.val));

        for (ListNode node : lists) {
            if (node != null) heap.add(node);
        }

        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;

        while (!heap.isEmpty()) {
            ListNode min = heap.poll();
            cur.next = min;
            cur = cur.next;
            if (min.next != null) heap.add(min.next);
        }
        return dummy.next;
    }

    // Подход 2: Divide and Conquer — O(n log k)
    static ListNode mergeKListsDC(ListNode[] lists) {
        if (lists.length == 0) return null;
        return divideAndConquer(lists, 0, lists.length - 1);
    }

    static ListNode divideAndConquer(ListNode[] lists, int lo, int hi) {
        if (lo == hi) return lists[lo];
        int mid = (lo + hi) / 2;
        ListNode left = divideAndConquer(lists, lo, mid);
        ListNode right = divideAndConquer(lists, mid + 1, hi);
        return mergeTwoLists(left, right);
    }

    static ListNode mergeTwoLists(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { cur.next = a; a = a.next; }
            else { cur.next = b; b = b.next; }
            cur = cur.next;
        }
        cur.next = (a != null) ? a : b;
        return dummy.next;
    }

    static String listToString(ListNode head) {
        StringBuilder sb = new StringBuilder("[");
        while (head != null) {
            sb.append(head.val);
            if (head.next != null) sb.append(",");
            head = head.next;
        }
        return sb.append("]").toString();
    }

    static ListNode arrayToList(int[] arr) {
        ListNode dummy = new ListNode(0);
        ListNode cur = dummy;
        for (int v : arr) { cur.next = new ListNode(v); cur = cur.next; }
        return dummy.next;
    }

    public static void main(String[] args) {
        ListNode[] lists = {
            arrayToList(new int[]{1,4,5}),
            arrayToList(new int[]{1,3,4}),
            arrayToList(new int[]{2,6})
        };
        System.out.println("[[1,4,5],[1,3,4],[2,6]] → " +
            listToString(mergeKLists(lists)));
    }
}`,
      explanation: 'PriorityQueue: heap из k элементов, извлекаем min, добавляем next — O(n log k). Divide & Conquer: попарно сливаем списки за log k раундов — тоже O(n log k). Heap проще в реализации, D&C не требует доп. памяти O(k).'
    },
    {
      id: 4,
      title: 'Word Break',
      type: 'practice',
      difficulty: 'medium',
      description: 'Раунд 4: Apple Style. Тебе дают 25 минут. Прочитай задачу и попробуй решить самостоятельно перед просмотром решения.\n\nДана строка s и словарь wordDict. Определи, можно ли разбить s на слова из словаря. Слова можно использовать повторно.',
      requirements: [
        'Метод boolean wordBreak(String s, List<String> wordDict)',
        'DP подход: dp[i] = true если s[0..i-1] можно разбить',
        'Для каждого i проверяй все слова из словаря',
        'dp[0] = true (пустая строка)',
        'Пример: s="leetcode", dict=["leet","code"] → true',
        'Пример: s="catsandog", dict=["cats","dog","sand","and","cat"] → false',
        'Таймер: 25 минут'
      ],
      expectedOutput: '"leetcode" → true\n"applepenapple" → true\n"catsandog" → false',
      hint: 'dp[i] = true если существует j < i такое что dp[j] == true и s[j..i] есть в словаре. Используй HashSet для O(1) проверки слов.',
      solution: `import java.util.*;

public class Main {
    static boolean wordBreak(String s, List<String> wordDict) {
        Set<String> dict = new HashSet<>(wordDict);
        int n = s.length();
        boolean[] dp = new boolean[n + 1];
        dp[0] = true; // пустая строка

        for (int i = 1; i <= n; i++) {
            for (String word : dict) {
                int len = word.length();
                if (i >= len && dp[i - len] && s.substring(i - len, i).equals(word)) {
                    dp[i] = true;
                    break;
                }
            }
        }
        return dp[n];
    }

    public static void main(String[] args) {
        System.out.println("\\"leetcode\\" → " +
            wordBreak("leetcode", Arrays.asList("leet", "code")));
        System.out.println("\\"applepenapple\\" → " +
            wordBreak("applepenapple", Arrays.asList("apple", "pen")));
        System.out.println("\\"catsandog\\" → " +
            wordBreak("catsandog", Arrays.asList("cats", "dog", "sand", "and", "cat")));
    }
}`,
      explanation: 'DP: dp[i] = можно ли разбить первые i символов. Для каждой позиции проверяем все слова из словаря. O(n * m * k) где n = длина строки, m = количество слов, k = средняя длина слова.'
    },
    {
      id: 5,
      title: 'Course Schedule II',
      type: 'practice',
      difficulty: 'medium',
      description: 'Раунд 5: Microsoft Style. Тебе дают 25 минут. Прочитай задачу и попробуй решить самостоятельно перед просмотром решения.\n\nЕсть numCourses курсов (0..n-1) и prerequisites[i] = [a, b] означает "для курса a нужно сначала пройти b". Верни порядок прохождения курсов (топологическая сортировка). Если невозможно — верни пустой массив.',
      requirements: [
        'Метод int[] findOrder(int numCourses, int[][] prerequisites)',
        'BFS (Kahn\'s algorithm): считай входные степени, начни с узлов со степенью 0',
        'Если результат содержит не все курсы — есть цикл → вернуть []',
        'Пример: numCourses=4, prereqs=[[1,0],[2,0],[3,1],[3,2]] → [0,1,2,3] или [0,2,1,3]',
        'Пример: numCourses=2, prereqs=[[1,0],[0,1]] → [] (цикл)',
        'Таймер: 25 минут'
      ],
      expectedOutput: 'courses=4, prereqs=[[1,0],[2,0],[3,1],[3,2]] → [0, 1, 2, 3]\ncourses=2, prereqs=[[1,0]] → [0, 1]\ncourses=2, prereqs=[[1,0],[0,1]] → [] (цикл)',
      hint: 'Kahn: inDegree[v] = количество входящих рёбер. Начинаем BFS с вершин где inDegree = 0. Каждая обработанная вершина уменьшает inDegree соседей. Если обработали не все — цикл.',
      solution: `import java.util.*;

public class Main {
    static int[] findOrder(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        int[] inDegree = new int[numCourses];

        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());

        for (int[] pre : prerequisites) {
            graph.get(pre[1]).add(pre[0]); // pre[1] → pre[0]
            inDegree[pre[0]]++;
        }

        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) queue.add(i);
        }

        int[] order = new int[numCourses];
        int idx = 0;

        while (!queue.isEmpty()) {
            int course = queue.poll();
            order[idx++] = course;
            for (int next : graph.get(course)) {
                inDegree[next]--;
                if (inDegree[next] == 0) queue.add(next);
            }
        }

        return idx == numCourses ? order : new int[0]; // цикл если не все обработаны
    }

    public static void main(String[] args) {
        System.out.println("courses=4, prereqs=[[1,0],[2,0],[3,1],[3,2]] → " +
            Arrays.toString(findOrder(4, new int[][]{{1,0},{2,0},{3,1},{3,2}})));
        System.out.println("courses=2, prereqs=[[1,0]] → " +
            Arrays.toString(findOrder(2, new int[][]{{1,0}})));
        int[] cycleResult = findOrder(2, new int[][]{{1,0},{0,1}});
        System.out.println("courses=2, prereqs=[[1,0],[0,1]] → " +
            Arrays.toString(cycleResult) + (cycleResult.length == 0 ? " (цикл)" : ""));
    }
}`,
      explanation: 'Kahn\'s algorithm: BFS с входными степенями. Начинаем с вершин без зависимостей (inDegree = 0). Каждая обработанная вершина уменьшает inDegree соседей. Если обработали меньше вершин, чем есть — цикл. O(V + E).'
    },
    {
      id: 6,
      title: 'Serialize and Deserialize Binary Tree',
      type: 'practice',
      difficulty: 'hard',
      description: 'Раунд 6: Google Style. Тебе дают 45 минут. Прочитай задачу и попробуй решить самостоятельно перед просмотром решения.\n\nРеализуй сериализацию и десериализацию бинарного дерева. serialize(root) → String, deserialize(data) → TreeNode.',
      requirements: [
        'String serialize(TreeNode root) — дерево в строку',
        'TreeNode deserialize(String data) — строка в дерево',
        'Используй preorder обход с маркером null (например "null")',
        'Разделитель — запятая',
        'deserialize(serialize(tree)) должен вернуть то же дерево',
        'Таймер: 45 минут. Обработай null-узлы и пустое дерево'
      ],
      expectedOutput: 'Дерево: [1,2,3,null,null,4,5]\nСериализация: 1,2,null,null,3,4,null,null,5,null,null\nДесериализация: [1,2,3,null,null,4,5]',
      hint: 'Preorder (корень, левый, правый): записываем значение или "null" для пустых узлов. При десериализации — Queue/Iterator, рекурсивно восстанавливаем: если "null" — return null, иначе создаём узел и рекурсивно left, right.',
      solution: `import java.util.*;

public class Main {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int v) { val = v; }
    }

    // Serialize: preorder с null-маркерами
    static String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        serializeHelper(root, sb);
        return sb.toString();
    }

    static void serializeHelper(TreeNode node, StringBuilder sb) {
        if (sb.length() > 0) sb.append(",");
        if (node == null) {
            sb.append("null");
            return;
        }
        sb.append(node.val);
        serializeHelper(node.left, sb);
        serializeHelper(node.right, sb);
    }

    // Deserialize: Queue + рекурсия
    static TreeNode deserialize(String data) {
        Queue<String> queue = new LinkedList<>(Arrays.asList(data.split(",")));
        return deserializeHelper(queue);
    }

    static TreeNode deserializeHelper(Queue<String> queue) {
        String val = queue.poll();
        if (val.equals("null")) return null;
        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left = deserializeHelper(queue);
        node.right = deserializeHelper(queue);
        return node;
    }

    // BFS для отображения дерева
    static String treeToString(TreeNode root) {
        if (root == null) return "[]";
        List<String> result = new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node == null) {
                result.add("null");
            } else {
                result.add(String.valueOf(node.val));
                queue.add(node.left);
                queue.add(node.right);
            }
        }
        // Удаляем trailing nulls
        while (result.size() > 0 && result.get(result.size() - 1).equals("null")) {
            result.remove(result.size() - 1);
        }
        return "[" + String.join(",", result) + "]";
    }

    public static void main(String[] args) {
        //      1
        //     / \\
        //    2   3
        //       / \\
        //      4   5
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.right.left = new TreeNode(4);
        root.right.right = new TreeNode(5);

        System.out.println("Дерево: " + treeToString(root));
        String serialized = serialize(root);
        System.out.println("Сериализация: " + serialized);
        TreeNode restored = deserialize(serialized);
        System.out.println("Десериализация: " + treeToString(restored));
    }
}`,
      explanation: 'Preorder сериализация: записываем значение или "null". При десериализации Queue хранит токены, рекурсия воссоздаёт дерево в том же порядке. O(n) для обеих операций. Ключевое: null-маркеры позволяют однозначно восстановить структуру.'
    },
    {
      id: 7,
      title: 'Median of Two Sorted Arrays',
      type: 'practice',
      difficulty: 'hard',
      description: 'Раунд 7: Amazon Style. Тебе дают 45 минут. Прочитай задачу и попробуй решить самостоятельно перед просмотром решения.\n\nДаны два отсортированных массива nums1 и nums2 размеров m и n. Найди медиану объединённого массива. Требуемая сложность: O(log(m+n)).',
      requirements: [
        'Метод double findMedianSortedArrays(int[] nums1, int[] nums2)',
        'Бинарный поиск по меньшему массиву',
        'Разделяем оба массива на left и right части: left содержит (m+n+1)/2 элементов',
        'Ищем partition в nums1 такой, что maxLeft1 <= minRight2 и maxLeft2 <= minRight1',
        'Пример: [1,3], [2] → 2.0',
        'Пример: [1,2], [3,4] → 2.5',
        'Таймер: 45 минут. Одна из сложнейших задач!'
      ],
      expectedOutput: '[1,3] + [2] → 2.0\n[1,2] + [3,4] → 2.5\n[0,0] + [0,0] → 0.0',
      hint: 'Binary search по partition в меньшем массиве. partition1 + partition2 = (m+n+1)/2. Условие: maxLeft1 <= minRight2 && maxLeft2 <= minRight1. Граничные: Integer.MIN/MAX для пустых частей.',
      solution: `public class Main {
    static double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Всегда ищем по меньшему массиву
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1);
        }

        int m = nums1.length, n = nums2.length;
        int lo = 0, hi = m;

        while (lo <= hi) {
            int p1 = (lo + hi) / 2;           // partition в nums1
            int p2 = (m + n + 1) / 2 - p1;    // partition в nums2

            int maxLeft1 = (p1 == 0) ? Integer.MIN_VALUE : nums1[p1 - 1];
            int minRight1 = (p1 == m) ? Integer.MAX_VALUE : nums1[p1];
            int maxLeft2 = (p2 == 0) ? Integer.MIN_VALUE : nums2[p2 - 1];
            int minRight2 = (p2 == n) ? Integer.MAX_VALUE : nums2[p2];

            if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
                // Нашли правильный partition
                if ((m + n) % 2 == 1) {
                    return Math.max(maxLeft1, maxLeft2);
                } else {
                    return (Math.max(maxLeft1, maxLeft2) +
                            Math.min(minRight1, minRight2)) / 2.0;
                }
            } else if (maxLeft1 > minRight2) {
                hi = p1 - 1; // двигаем влево
            } else {
                lo = p1 + 1; // двигаем вправо
            }
        }
        return 0.0;
    }

    public static void main(String[] args) {
        System.out.println("[1,3] + [2] → " +
            findMedianSortedArrays(new int[]{1,3}, new int[]{2}));
        System.out.println("[1,2] + [3,4] → " +
            findMedianSortedArrays(new int[]{1,2}, new int[]{3,4}));
        System.out.println("[0,0] + [0,0] → " +
            findMedianSortedArrays(new int[]{0,0}, new int[]{0,0}));
    }
}`,
      explanation: 'Бинарный поиск по меньшему массиву. Ищем partition, чтобы все элементы слева <= всех справа. O(log(min(m,n))). Это задача №4 на LeetCode — одна из классических hard задач на binary search.'
    },
    {
      id: 8,
      title: 'Design Twitter',
      type: 'practice',
      difficulty: 'medium',
      description: 'Раунд 8: Meta Style (System Design + Coding). Тебе дают 45 минут. Прочитай задачу и попробуй решить самостоятельно перед просмотром решения.\n\nСпроектируй упрощённый Twitter: postTweet, getNewsFeed (10 последних твитов от пользователя и его подписок), follow, unfollow.',
      requirements: [
        'void postTweet(int userId, int tweetId) — публикация твита',
        'List<Integer> getNewsFeed(int userId) — 10 последних твитов из ленты',
        'void follow(int followerId, int followeeId) — подписаться',
        'void unfollow(int followerId, int followeeId) — отписаться',
        'getNewsFeed: merge k sorted lists (твиты каждого пользователя) через PriorityQueue',
        'Таймер: 45 минут. Сначала опиши архитектуру, потом реализуй'
      ],
      expectedOutput: 'postTweet(1, 5)\ngetNewsFeed(1) → [5]\nfollow(1, 2)\npostTweet(2, 6)\ngetNewsFeed(1) → [6, 5]\nunfollow(1, 2)\ngetNewsFeed(1) → [5]',
      hint: 'Map<userId, List<Tweet>> для твитов. Map<userId, Set<userId>> для подписок. Tweet хранит tweetId и timestamp. getNewsFeed — merge k sorted lists через PriorityQueue.',
      solution: `import java.util.*;

public class Main {
    static int timestamp = 0;
    static Map<Integer, List<int[]>> tweets = new HashMap<>();  // userId -> [(time, tweetId)]
    static Map<Integer, Set<Integer>> following = new HashMap<>(); // userId -> Set(followeeId)

    static void postTweet(int userId, int tweetId) {
        tweets.computeIfAbsent(userId, k -> new ArrayList<>()).add(new int[]{timestamp++, tweetId});
    }

    static List<Integer> getNewsFeed(int userId) {
        // Собираем пользователей: сам + подписки
        Set<Integer> users = new HashSet<>();
        users.add(userId);
        if (following.containsKey(userId)) {
            users.addAll(following.get(userId));
        }

        // Max-heap по timestamp
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> b[0] - a[0]);
        for (int uid : users) {
            if (tweets.containsKey(uid)) {
                List<int[]> userTweets = tweets.get(uid);
                // Добавляем все твиты пользователя (можно оптимизировать)
                for (int[] tweet : userTweets) {
                    heap.add(tweet);
                }
            }
        }

        List<Integer> feed = new ArrayList<>();
        int count = 0;
        while (!heap.isEmpty() && count < 10) {
            feed.add(heap.poll()[1]); // tweetId
            count++;
        }
        return feed;
    }

    static void follow(int followerId, int followeeId) {
        if (followerId == followeeId) return;
        following.computeIfAbsent(followerId, k -> new HashSet<>()).add(followeeId);
    }

    static void unfollow(int followerId, int followeeId) {
        if (following.containsKey(followerId)) {
            following.get(followerId).remove(followeeId);
        }
    }

    public static void main(String[] args) {
        postTweet(1, 5);
        System.out.println("postTweet(1, 5)");
        System.out.println("getNewsFeed(1) → " + getNewsFeed(1));

        follow(1, 2);
        System.out.println("follow(1, 2)");

        postTweet(2, 6);
        System.out.println("postTweet(2, 6)");
        System.out.println("getNewsFeed(1) → " + getNewsFeed(1));

        unfollow(1, 2);
        System.out.println("unfollow(1, 2)");
        System.out.println("getNewsFeed(1) → " + getNewsFeed(1));
    }
}`,
      explanation: 'Twitter = HashMap (tweets, followers) + PriorityQueue (news feed). postTweet добавляет с timestamp. getNewsFeed собирает твиты подписок и выбирает top-10 через max-heap. Классический вопрос OOD + coding на Meta.'
    },
    {
      id: 9,
      title: 'Alien Dictionary',
      type: 'practice',
      difficulty: 'hard',
      description: 'Раунд 9: Google Style. Тебе дают 45 минут. Прочитай задачу и попробуй решить самостоятельно перед просмотром решения.\n\nДан отсортированный словарь инопланетного языка (массив слов). Определи порядок букв в этом языке. Если порядок невозможен — верни пустую строку.',
      requirements: [
        'Метод String alienOrder(String[] words)',
        'Сравни соседние слова: первое различие даёт ребро в графе',
        'Топологическая сортировка (BFS/Kahn\'s) для получения порядка',
        'Edge case: если более короткое слово — префикс более длинного и идёт после → невозможно',
        'Пример: ["wrt","wrf","er","ett","rftt"] → "wertf"',
        'Пример: ["z","x","z"] → "" (цикл)',
        'Таймер: 45 минут'
      ],
      expectedOutput: '["wrt","wrf","er","ett","rftt"] → wertf\n["z","x"] → zx\n["z","x","z"] → "" (цикл)',
      hint: 'Граф: для каждой пары соседних слов найди первое различие — это ребро u → v. Топологическая сортировка графа. Если цикл — невозможно. Не забудь добавить все уникальные буквы.',
      solution: `import java.util.*;

public class Main {
    static String alienOrder(String[] words) {
        // Граф и входные степени
        Map<Character, Set<Character>> graph = new HashMap<>();
        Map<Character, Integer> inDegree = new HashMap<>();

        // Инициализируем все уникальные буквы
        for (String word : words) {
            for (char c : word.toCharArray()) {
                graph.putIfAbsent(c, new HashSet<>());
                inDegree.putIfAbsent(c, 0);
            }
        }

        // Строим граф из соседних слов
        for (int i = 0; i < words.length - 1; i++) {
            String w1 = words[i], w2 = words[i + 1];
            // Edge case: "abc" перед "ab" — невозможно
            if (w1.length() > w2.length() && w1.startsWith(w2)) return "";

            int minLen = Math.min(w1.length(), w2.length());
            for (int j = 0; j < minLen; j++) {
                if (w1.charAt(j) != w2.charAt(j)) {
                    char from = w1.charAt(j), to = w2.charAt(j);
                    if (!graph.get(from).contains(to)) {
                        graph.get(from).add(to);
                        inDegree.merge(to, 1, Integer::sum);
                    }
                    break; // только первое различие!
                }
            }
        }

        // Topological sort (Kahn's BFS)
        Queue<Character> queue = new LinkedList<>();
        for (char c : inDegree.keySet()) {
            if (inDegree.get(c) == 0) queue.add(c);
        }

        StringBuilder order = new StringBuilder();
        while (!queue.isEmpty()) {
            char c = queue.poll();
            order.append(c);
            for (char next : graph.get(c)) {
                inDegree.merge(next, -1, Integer::sum);
                if (inDegree.get(next) == 0) queue.add(next);
            }
        }

        // Если не все буквы — есть цикл
        if (order.length() != inDegree.size()) return "";
        return order.toString();
    }

    public static void main(String[] args) {
        System.out.println("[\\"wrt\\",\\"wrf\\",\\"er\\",\\"ett\\",\\"rftt\\"] → " +
            alienOrder(new String[]{"wrt","wrf","er","ett","rftt"}));
        System.out.println("[\\"z\\",\\"x\\"] → " +
            alienOrder(new String[]{"z","x"}));
        String result = alienOrder(new String[]{"z","x","z"});
        System.out.println("[\\"z\\",\\"x\\",\\"z\\"] → " +
            (result.isEmpty() ? "\\"\\\" (цикл)" : result));
    }
}`,
      explanation: 'Строим граф из попарных сравнений слов: первое различие = ребро. Топологическая сортировка даёт порядок. Цикл = невозможно. Edge case: "abc" < "ab" невалидно. O(C) где C = суммарная длина слов.'
    },
    {
      id: 10,
      title: 'Trapping Rain Water',
      type: 'practice',
      difficulty: 'hard',
      description: 'Раунд 10: Финальный раунд, Goldman Sachs Style. Тебе дают 45 минут. Прочитай задачу и попробуй решить самостоятельно перед просмотром решения.\n\nДан массив высот elevation[i] — ширина каждого столбика 1. Посчитай, сколько воды может задержаться после дождя.',
      requirements: [
        'Метод int trap(int[] height)',
        'Подход 1: Two Pointers — O(n) время, O(1) память',
        'Подход 2: Stack — O(n) время, O(n) память',
        'Для каждой позиции: вода = min(maxLeft, maxRight) - height[i]',
        'Two Pointers: left и right сходятся к центру',
        'Пример: [0,1,0,2,1,0,1,3,2,1,2,1] → 6',
        'Таймер: 45 минут. Реализуй оба подхода'
      ],
      expectedOutput: '[0,1,0,2,1,0,1,3,2,1,2,1] → 6\n[4,2,0,3,2,5] → 9\n[1,0,1] → 1',
      hint: 'Two Pointers: left=0, right=n-1, leftMax=0, rightMax=0. Если leftMax < rightMax — вода определяется leftMax, двигай left. Иначе — rightMax, двигай right.',
      solution: `public class Main {
    // Подход 1: Two Pointers — O(n), O(1)
    static int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0;
        int water = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    water += leftMax - height[left];
                }
                left++;
            } else {
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    water += rightMax - height[right];
                }
                right--;
            }
        }
        return water;
    }

    // Подход 2: Stack — O(n), O(n)
    static int trapStack(int[] height) {
        java.util.Stack<Integer> stack = new java.util.Stack<>();
        int water = 0;

        for (int i = 0; i < height.length; i++) {
            while (!stack.isEmpty() && height[i] > height[stack.peek()]) {
                int bottom = stack.pop();
                if (stack.isEmpty()) break;
                int width = i - stack.peek() - 1;
                int h = Math.min(height[i], height[stack.peek()]) - height[bottom];
                water += width * h;
            }
            stack.push(i);
        }
        return water;
    }

    public static void main(String[] args) {
        System.out.println("[0,1,0,2,1,0,1,3,2,1,2,1] → " +
            trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1}));
        System.out.println("[4,2,0,3,2,5] → " +
            trap(new int[]{4,2,0,3,2,5}));
        System.out.println("[1,0,1] → " +
            trap(new int[]{1,0,1}));
    }
}`,
      explanation: 'Two Pointers: если height[left] < height[right], вода слева определяется leftMax. Двигаем "нижнюю" сторону. O(n), O(1) — оптимальное решение. Stack подход считает воду "по слоям" горизонтально. Обе версии O(n), но Two Pointers экономит память.'
    }
  ]
}
