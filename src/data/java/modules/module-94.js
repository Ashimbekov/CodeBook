export default {
  id: 94,
  title: 'Практикум: Конкурсные задачи',
  description: 'Задачи уровня medium-hard из соревнований и интервью: матрицы, гистограммы, структуры данных, дизайн систем.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Spiral Matrix',
      type: 'practice',
      difficulty: 'medium',
      description: 'Обойди матрицу m×n по спирали (по часовой стрелке) и верни элементы в порядке обхода.',
      requirements: [
        'Метод spiralOrder(int[][] matrix) возвращает List<Integer>',
        'Четыре указателя: top, bottom, left, right',
        'Протестировать: [[1,2,3],[4,5,6],[7,8,9]] → [1,2,3,6,9,8,7,4,5]'
      ],
      expectedOutput: '[1, 2, 3, 6, 9, 8, 7, 4, 5]\n[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]',
      hint: 'Четыре прохода: →(top row), ↓(right col), ←(bottom row), ↑(left col). После каждого — сужай границу. Проверяй top<=bottom и left<=right.',
      solution: `import java.util.*;

public class Main {
    static List<Integer> spiralOrder(int[][] matrix) {
        List<Integer> result = new ArrayList<>();
        int top = 0, bottom = matrix.length - 1;
        int left = 0, right = matrix[0].length - 1;
        while (top <= bottom && left <= right) {
            for (int i = left; i <= right; i++) result.add(matrix[top][i]);
            top++;
            for (int i = top; i <= bottom; i++) result.add(matrix[i][right]);
            right--;
            if (top <= bottom) {
                for (int i = right; i >= left; i--) result.add(matrix[bottom][i]);
                bottom--;
            }
            if (left <= right) {
                for (int i = bottom; i >= top; i--) result.add(matrix[i][left]);
                left++;
            }
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(spiralOrder(new int[][]{{1,2,3},{4,5,6},{7,8,9}}));
        System.out.println(spiralOrder(new int[][]{{1,2,3,4},{5,6,7,8},{9,10,11,12}}));
    }
}`,
      explanation: 'Четыре указателя определяют текущий «слой» спирали. После каждого направления сужаем границу. Проверки top<=bottom и left<=right предотвращают двойной обход для нечётных размеров. O(m*n) — каждый элемент посещается ровно один раз.'
    },
    {
      id: 2,
      title: 'Задача: Rotate Image',
      type: 'practice',
      difficulty: 'medium',
      description: 'Поверни NxN матрицу на 90° по часовой стрелке in-place.',
      requirements: [
        'Метод rotate(int[][] matrix) — in-place',
        'Транспонирование + реверс строк',
        'Протестировать: [[1,2,3],[4,5,6],[7,8,9]] → [[7,4,1],[8,5,2],[9,6,3]]'
      ],
      expectedOutput: '[[7, 4, 1], [8, 5, 2], [9, 6, 3]]',
      hint: 'Два шага: 1) Транспонирование: swap(matrix[i][j], matrix[j][i]). 2) Реверс каждой строки. Это эквивалентно повороту на 90° по часовой.',
      solution: `import java.util.Arrays;

public class Main {
    static void rotate(int[][] m) {
        int n = m.length;
        // Transpose
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++) {
                int tmp = m[i][j]; m[i][j] = m[j][i]; m[j][i] = tmp;
            }
        // Reverse rows
        for (int i = 0; i < n; i++)
            for (int l = 0, r = n-1; l < r; l++, r--) {
                int tmp = m[i][l]; m[i][l] = m[i][r]; m[i][r] = tmp;
            }
    }

    public static void main(String[] args) {
        int[][] m = {{1,2,3},{4,5,6},{7,8,9}};
        rotate(m);
        System.out.println(Arrays.deepToString(m));
    }
}`,
      explanation: 'Поворот на 90° CW = транспонирование + реверс строк. Транспонирование: swap элементов относительно главной диагонали. Реверс строк: swap элементов с двух концов. O(n²) время, O(1) память — полностью in-place.'
    },
    {
      id: 3,
      title: 'Задача: Game of Life',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй один шаг «Игры Жизни» Конвея. Правила: живая клетка с 2-3 живыми соседями выживает; мёртвая с 3 — оживает; остальные умирают.',
      requirements: [
        'Метод gameOfLife(int[][] board) — in-place, одновременное обновление',
        'Использовать промежуточные состояния: 2 = was alive -> dead, 3 = was dead -> alive',
        'Протестировать: [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]'
      ],
      expectedOutput: '[[0, 0, 0], [1, 0, 1], [0, 1, 1], [0, 1, 0]]',
      hint: 'In-place: используй битовые состояния или значения 2,3 для кодирования «было живо → стало мёртво» и «было мёртво → стало живо». Финальный проход: 2→0, 3→1.',
      solution: `import java.util.Arrays;

public class Main {
    static void gameOfLife(int[][] board) {
        int m = board.length, n = board[0].length;
        int[][] dirs = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int live = 0;
                for (int[] d : dirs) {
                    int ni = i+d[0], nj = j+d[1];
                    if (ni>=0 && ni<m && nj>=0 && nj<n && (board[ni][nj]==1 || board[ni][nj]==2))
                        live++;
                }
                if (board[i][j] == 1 && (live < 2 || live > 3)) board[i][j] = 2; // alive->dead
                if (board[i][j] == 0 && live == 3) board[i][j] = 3; // dead->alive
            }
        }
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++)
                board[i][j] = board[i][j] == 3 ? 1 : (board[i][j] == 2 ? 0 : board[i][j]);
    }

    public static void main(String[] args) {
        int[][] board = {{0,1,0},{0,0,1},{1,1,1},{0,0,0}};
        gameOfLife(board);
        System.out.println(Arrays.deepToString(board));
    }
}`,
      explanation: 'Промежуточные состояния позволяют обновлять in-place: 2 означает «была жива, станет мёртвой» (для подсчёта соседей считается как живая). 3 означает «была мёртва, станет живой» (для соседей — мёртвая). Финальный проход преобразует 2→0, 3→1. O(m*n) время, O(1) память.'
    },
    {
      id: 4,
      title: 'Задача: Set Matrix Zeroes',
      type: 'practice',
      difficulty: 'medium',
      description: 'Если элемент матрицы 0 — обнули всю его строку и столбец. Решение за O(1) дополнительной памяти.',
      requirements: [
        'Метод setZeroes(int[][] matrix) — in-place',
        'Использовать первую строку и первый столбец как маркеры',
        'Протестировать: [[1,1,1],[1,0,1],[1,1,1]] → [[1,0,1],[0,0,0],[1,0,1]]'
      ],
      expectedOutput: '[[1, 0, 1], [0, 0, 0], [1, 0, 1]]',
      hint: 'Первая строка/столбец как флаги: если matrix[i][j]==0, ставим matrix[i][0]=0 и matrix[0][j]=0. Потом обнуляем по флагам. Отдельный флаг для первой строки/столбца.',
      solution: `import java.util.Arrays;

public class Main {
    static void setZeroes(int[][] m) {
        boolean firstRow = false, firstCol = false;
        int R = m.length, C = m[0].length;
        for (int i = 0; i < R; i++) if (m[i][0] == 0) firstCol = true;
        for (int j = 0; j < C; j++) if (m[0][j] == 0) firstRow = true;
        for (int i = 1; i < R; i++)
            for (int j = 1; j < C; j++)
                if (m[i][j] == 0) { m[i][0] = 0; m[0][j] = 0; }
        for (int i = 1; i < R; i++)
            for (int j = 1; j < C; j++)
                if (m[i][0] == 0 || m[0][j] == 0) m[i][j] = 0;
        if (firstRow) Arrays.fill(m[0], 0);
        if (firstCol) for (int i = 0; i < R; i++) m[i][0] = 0;
    }

    public static void main(String[] args) {
        int[][] m = {{1,1,1},{1,0,1},{1,1,1}};
        setZeroes(m);
        System.out.println(Arrays.deepToString(m));
    }
}`,
      explanation: 'O(1) память: используем первую строку/столбец как маркеры. Два отдельных boolean для самих первой строки/столбца. Порядок важен: сначала маркируем, потом обнуляем по маркерам, в конце — первую строку/столбец. Если обнулить их раньше — маркеры потеряются.'
    },
    {
      id: 5,
      title: 'Задача: Largest Rectangle in Histogram',
      type: 'practice',
      difficulty: 'hard',
      description: 'Найди площадь наибольшего прямоугольника, вписанного в гистограмму.',
      requirements: [
        'Метод largestRectangleArea(int[] heights) возвращает int',
        'Использовать стек для отслеживания индексов',
        'O(n) время',
        'Протестировать: [2,1,5,6,2,3] → 10'
      ],
      expectedOutput: '10\n4',
      hint: 'Монотонный стек: храни индексы столбцов с неубывающей высотой. Когда текущий столбец ниже — pop и рассчитай площадь с высотой pop-нутого столбца.',
      solution: `import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    static int largestRectangleArea(int[] heights) {
        Deque<Integer> stack = new ArrayDeque<>();
        int maxArea = 0;
        for (int i = 0; i <= heights.length; i++) {
            int h = (i == heights.length) ? 0 : heights[i];
            while (!stack.isEmpty() && h < heights[stack.peek()]) {
                int height = heights[stack.pop()];
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }
        return maxArea;
    }

    public static void main(String[] args) {
        System.out.println(largestRectangleArea(new int[]{2,1,5,6,2,3}));
        System.out.println(largestRectangleArea(new int[]{2,4}));
    }
}`,
      explanation: 'Монотонный стек: при pop рассчитываем площадь прямоугольника с высотой pop-нутого элемента. Ширина: от текущего индекса до нового peek стека. Трюк: добавляем 0 в конец для обработки оставшихся элементов стека. O(n) — каждый элемент push/pop ровно один раз.'
    },
    {
      id: 6,
      title: 'Задача: Maximum Product Subarray',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди непрерывный подмассив с максимальным произведением. Учти отрицательные числа и нули.',
      requirements: [
        'Метод maxProduct(int[] nums) возвращает int',
        'Отслеживай и max и min (отрицательный min может стать max после умножения на отрицательное)',
        'Протестировать: [2,3,-2,4]→6, [-2,0,-1]→0, [-2,3,-4]→24'
      ],
      expectedOutput: '6\n0\n24',
      hint: 'Два состояния: currMax и currMin. При отрицательном nums[i] — swap max/min. currMax = max(nums[i], currMax*nums[i]), аналогично для min.',
      solution: `public class Main {
    static int maxProduct(int[] nums) {
        int maxProd = nums[0], currMax = nums[0], currMin = nums[0];
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] < 0) { int tmp = currMax; currMax = currMin; currMin = tmp; }
            currMax = Math.max(nums[i], currMax * nums[i]);
            currMin = Math.min(nums[i], currMin * nums[i]);
            maxProd = Math.max(maxProd, currMax);
        }
        return maxProd;
    }

    public static void main(String[] args) {
        System.out.println(maxProduct(new int[]{2,3,-2,4}));
        System.out.println(maxProduct(new int[]{-2,0,-1}));
        System.out.println(maxProduct(new int[]{-2,3,-4}));
    }
}`,
      explanation: 'Аналог Kadane но для произведения. Ключевое отличие: отрицательное * отрицательное = положительное, поэтому нужен и currMin. При отрицательном числе swap max/min перед обновлением. O(n) один проход, O(1) память.'
    },
    {
      id: 7,
      title: 'Задача: Find Median from Data Stream',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дизайн структуры для потокового вычисления медианы: addNum(num) и findMedian().',
      requirements: [
        'Два heap: maxHeap для левой половины, minHeap для правой',
        'addNum() — O(log n)',
        'findMedian() — O(1)',
        'Протестировать: add(1), add(2), median=1.5, add(3), median=2'
      ],
      expectedOutput: '1.5\n2.0',
      hint: 'maxHeap хранит меньшую половину (peek = максимум левой), minHeap — большую (peek = минимум правой). Балансируй размеры: |size1 - size2| <= 1.',
      solution: `import java.util.PriorityQueue;
import java.util.Collections;

public class Main {
    static PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    static PriorityQueue<Integer> minHeap = new PriorityQueue<>();

    static void addNum(int num) {
        maxHeap.offer(num);
        minHeap.offer(maxHeap.poll());
        if (minHeap.size() > maxHeap.size())
            maxHeap.offer(minHeap.poll());
    }

    static double findMedian() {
        if (maxHeap.size() > minHeap.size()) return maxHeap.peek();
        return (maxHeap.peek() + minHeap.peek()) / 2.0;
    }

    public static void main(String[] args) {
        addNum(1); addNum(2);
        System.out.println(findMedian());
        addNum(3);
        System.out.println(findMedian());
    }
}`,
      explanation: 'Два heap разделяют поток на две половины. maxHeap.peek() — медиана для нечётного количества, среднее двух peek — для чётного. Балансировка: всегда maxHeap.size >= minHeap.size. addNum: O(log n) из-за heap операций. findMedian: O(1) — просто peek.'
    },
    {
      id: 8,
      title: 'Задача: Implement Trie (Prefix Tree)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй префиксное дерево (Trie) с операциями insert, search, startsWith.',
      requirements: [
        'Класс TrieNode: children[26], isEnd',
        'insert(word) — вставка слова',
        'search(word) — точный поиск',
        'startsWith(prefix) — есть ли слова с таким префиксом',
        'Протестировать: insert("apple"), search("apple")=true, search("app")=false, startsWith("app")=true'
      ],
      expectedOutput: 'search(apple): true\nsearch(app): false\nstartsWith(app): true\ninsert(app)\nsearch(app): true',
      hint: 'Каждый узел имеет 26 детей (a-z). insert идёт по символам, создавая узлы. search проверяет isEnd. startsWith не проверяет isEnd.',
      solution: `public class Main {
    static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd = false;
    }

    static class Trie {
        TrieNode root = new TrieNode();

        void insert(String word) {
            TrieNode node = root;
            for (char c : word.toCharArray()) {
                int idx = c - 'a';
                if (node.children[idx] == null)
                    node.children[idx] = new TrieNode();
                node = node.children[idx];
            }
            node.isEnd = true;
        }

        boolean search(String word) {
            TrieNode node = findNode(word);
            return node != null && node.isEnd;
        }

        boolean startsWith(String prefix) {
            return findNode(prefix) != null;
        }

        private TrieNode findNode(String s) {
            TrieNode node = root;
            for (char c : s.toCharArray()) {
                node = node.children[c - 'a'];
                if (node == null) return null;
            }
            return node;
        }
    }

    public static void main(String[] args) {
        Trie trie = new Trie();
        trie.insert("apple");
        System.out.println("search(apple): " + trie.search("apple"));
        System.out.println("search(app): " + trie.search("app"));
        System.out.println("startsWith(app): " + trie.startsWith("app"));
        trie.insert("app");
        System.out.println("insert(app)");
        System.out.println("search(app): " + trie.search("app"));
    }
}`,
      explanation: 'Trie: каждый узел — массив из 26 детей. Путь от корня к isEnd-узлу = слово. insert O(L), search O(L), startsWith O(L) где L = длина слова. Используется в автокомплите, spell checker, IP routing. Альтернатива HashMap для префиксных операций.'
    },
    {
      id: 9,
      title: 'Задача: Design Twitter',
      type: 'practice',
      difficulty: 'hard',
      description: 'Упрощённый Twitter: postTweet, getNewsFeed (10 последних от себя и подписок), follow, unfollow.',
      requirements: [
        'Метод postTweet(userId, tweetId)',
        'Метод getNewsFeed(userId) → List<Integer> (10 последних)',
        'Метод follow(followerId, followeeId)',
        'Метод unfollow(followerId, followeeId)',
        'News feed объединяет твиты пользователя и его подписок'
      ],
      expectedOutput: 'Feed of 1: [5]\nFollow: 1 -> 2\nFeed of 1: [6, 5]\nUnfollow: 1 -> 2\nFeed of 1: [5]',
      hint: 'Tweet с timestamp для сортировки. PriorityQueue (merge k sorted lists) для эффективного feed. Каждый пользователь хранит свои твиты в LinkedList.',
      solution: `import java.util.*;

public class Main {
    static int time = 0;
    static Map<Integer, Set<Integer>> following = new HashMap<>();
    static Map<Integer, List<int[]>> tweets = new HashMap<>(); // userId -> [[time, tweetId]]

    static void postTweet(int userId, int tweetId) {
        tweets.computeIfAbsent(userId, k -> new ArrayList<>()).add(new int[]{time++, tweetId});
    }

    static List<Integer> getNewsFeed(int userId) {
        PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> b[0] - a[0]);
        Set<Integer> users = new HashSet<>(following.getOrDefault(userId, Set.of()));
        users.add(userId);
        for (int uid : users) {
            List<int[]> t = tweets.getOrDefault(uid, List.of());
            for (int[] tw : t) pq.offer(tw);
        }
        List<Integer> feed = new ArrayList<>();
        while (!pq.isEmpty() && feed.size() < 10) feed.add(pq.poll()[1]);
        return feed;
    }

    static void follow(int followerId, int followeeId) {
        following.computeIfAbsent(followerId, k -> new HashSet<>()).add(followeeId);
        System.out.println("Follow: " + followerId + " -> " + followeeId);
    }

    static void unfollow(int followerId, int followeeId) {
        following.getOrDefault(followerId, Set.of()).remove(followeeId);
        System.out.println("Unfollow: " + followerId + " -> " + followeeId);
    }

    public static void main(String[] args) {
        postTweet(1, 5);
        System.out.println("Feed of 1: " + getNewsFeed(1));
        follow(1, 2);
        postTweet(2, 6);
        System.out.println("Feed of 1: " + getNewsFeed(1));
        unfollow(1, 2);
        System.out.println("Feed of 1: " + getNewsFeed(1));
    }
}`,
      explanation: 'Max-heap по timestamp для merge новостных лент. Глобальный timestamp гарантирует порядок. Set для подписок — O(1) follow/unfollow. Оптимизация: для каждого user хранить только последние N твитов. В реальности: Fan-out on write (pre-compute feeds) vs Fan-out on read (merge at query time).'
    },
    {
      id: 10,
      title: 'Задача: LFU Cache',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй LFU (Least Frequently Used) кеш: get и put за O(1). При одинаковой частоте — удаляется наиболее давний.',
      requirements: [
        'Метод get(key) — возвращает значение или -1',
        'Метод put(key, value) — при переполнении удаляет LFU элемент',
        'O(1) для обеих операций',
        'HashMap + LinkedHashSet для каждой частоты'
      ],
      expectedOutput: 'put(1,1), put(2,2)\nget(1) = 1\nput(3,3) evicts key 2 (LFU)\nget(2) = -1\nget(3) = 3',
      hint: 'Три HashMap: keyToVal, keyToFreq, freqToKeys (LinkedHashSet для LRU внутри частоты). minFreq отслеживает минимальную частоту для O(1) eviction.',
      solution: `import java.util.*;

public class Main {
    static int capacity, minFreq;
    static Map<Integer, Integer> keyToVal = new HashMap<>();
    static Map<Integer, Integer> keyToFreq = new HashMap<>();
    static Map<Integer, LinkedHashSet<Integer>> freqToKeys = new HashMap<>();

    static void init(int cap) {
        capacity = cap; minFreq = 0;
    }

    static int get(int key) {
        if (!keyToVal.containsKey(key)) return -1;
        increaseFreq(key);
        return keyToVal.get(key);
    }

    static void put(int key, int value) {
        if (capacity <= 0) return;
        if (keyToVal.containsKey(key)) {
            keyToVal.put(key, value);
            increaseFreq(key);
            return;
        }
        if (keyToVal.size() >= capacity) {
            int evict = freqToKeys.get(minFreq).iterator().next();
            freqToKeys.get(minFreq).remove(evict);
            keyToVal.remove(evict);
            keyToFreq.remove(evict);
        }
        keyToVal.put(key, value);
        keyToFreq.put(key, 1);
        freqToKeys.computeIfAbsent(1, k -> new LinkedHashSet<>()).add(key);
        minFreq = 1;
    }

    static void increaseFreq(int key) {
        int freq = keyToFreq.get(key);
        keyToFreq.put(key, freq + 1);
        freqToKeys.get(freq).remove(key);
        if (freqToKeys.get(freq).isEmpty()) {
            freqToKeys.remove(freq);
            if (minFreq == freq) minFreq++;
        }
        freqToKeys.computeIfAbsent(freq + 1, k -> new LinkedHashSet<>()).add(key);
    }

    public static void main(String[] args) {
        init(2);
        put(1, 1); put(2, 2);
        System.out.println("put(1,1), put(2,2)");
        System.out.println("get(1) = " + get(1));
        put(3, 3);
        System.out.println("put(3,3) evicts key 2 (LFU)");
        System.out.println("get(2) = " + get(2));
        System.out.println("get(3) = " + get(3));
    }
}`,
      explanation: 'LFU за O(1): три HashMap + LinkedHashSet. keyToVal: значения. keyToFreq: частоты. freqToKeys: для каждой частоты — LinkedHashSet ключей (сохраняет порядок вставки для LRU внутри одной частоты). minFreq: отслеживает минимальную частоту для eviction. При get/put — увеличиваем частоту и перемещаем ключ.'
    }
  ]
}
