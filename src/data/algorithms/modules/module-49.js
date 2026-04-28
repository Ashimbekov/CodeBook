export default {
  id: 49,
  title: 'Практикум: Trie и Union-Find',
  description: 'Trie (префиксное дерево) и Union-Find (система непересекающихся множеств): реализация, поиск слов, wildcard, острова, лишнее ребро, провинции, аккаунты.',
  lessons: [
    {
      id: 1,
      title: 'Implement Trie (Prefix Tree)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй Trie с операциями insert(word), search(word) — точный поиск, startsWith(prefix) — проверка наличия слов с данным префиксом.',
      requirements: [
        'Класс Trie с вложенным классом TrieNode',
        'TrieNode: children[26] и boolean isEnd',
        'void insert(String word) — вставка слова',
        'boolean search(String word) — точный поиск (isEnd == true)',
        'boolean startsWith(String prefix) — есть ли слова с таким префиксом',
        'Протестируй: insert("apple"), search("apple")→true, search("app")→false, startsWith("app")→true'
      ],
      expectedOutput: 'insert("apple")\nsearch("apple") → true\nsearch("app") → false\nstartsWith("app") → true\ninsert("app")\nsearch("app") → true',
      hint: 'Каждый узел — массив из 26 детей (по одному на букву). Идём по символам слова, создавая узлы. search проверяет isEnd в конце. startsWith — только наличие пути.',
      solution: `public class Main {
    static int[][] children;
    static boolean[] isEnd;
    static int cnt;

    static void init() {
        children = new int[100000][26];
        isEnd = new boolean[100000];
        cnt = 0;
        for (int[] row : children) java.util.Arrays.fill(row, -1);
    }

    static void insert(String word) {
        int node = 0;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (children[node][idx] == -1) {
                children[node][idx] = ++cnt;
            }
            node = children[node][idx];
        }
        isEnd[node] = true;
    }

    static boolean search(String word) {
        int node = findNode(word);
        return node != -1 && isEnd[node];
    }

    static boolean startsWith(String prefix) {
        return findNode(prefix) != -1;
    }

    static int findNode(String s) {
        int node = 0;
        for (char c : s.toCharArray()) {
            int idx = c - 'a';
            if (children[node][idx] == -1) return -1;
            node = children[node][idx];
        }
        return node;
    }

    public static void main(String[] args) {
        init();
        insert("apple");
        System.out.println("insert(\\"apple\\")");
        System.out.println("search(\\"apple\\") → " + search("apple"));
        System.out.println("search(\\"app\\") → " + search("app"));
        System.out.println("startsWith(\\"app\\") → " + startsWith("app"));
        insert("app");
        System.out.println("insert(\\"app\\")");
        System.out.println("search(\\"app\\") → " + search("app"));
    }
}`,
      explanation: 'Trie хранит слова символ за символом: каждый узел — массив из 26 детей. insert создаёт путь, search проверяет путь и isEnd, startsWith — только путь. Все операции O(m), где m — длина слова.'
    },
    {
      id: 2,
      title: 'Design Add and Search Words',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй WordDictionary с поддержкой wildcard ".". addWord(word) — добавляет слово. search(word) — ищет слово, где "." может быть любым символом.',
      requirements: [
        'Класс WordDictionary на основе Trie',
        'void addWord(String word) — обычная вставка в Trie',
        'boolean search(String word) — поиск с поддержкой "."',
        'Для "." — рекурсивно проверяй все 26 дочерних узлов',
        'Пример: addWord("bad"), addWord("dad"), addWord("mad")',
        'search(".ad")→true, search("b..")→true, search("b.d")→true'
      ],
      expectedOutput: 'addWord("bad"), addWord("dad"), addWord("mad")\nsearch("pad") → false\nsearch("bad") → true\nsearch(".ad") → true\nsearch("b..") → true',
      hint: 'Для "." в позиции i рекурсивно пробуй все дочерние узлы. Если хотя бы один путь приводит к результату — true.',
      solution: `public class Main {
    static int[][] children;
    static boolean[] isEnd;
    static int cnt;

    static void init() {
        children = new int[100000][26];
        isEnd = new boolean[100000];
        cnt = 0;
        for (int[] row : children) java.util.Arrays.fill(row, -1);
    }

    static void addWord(String word) {
        int node = 0;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (children[node][idx] == -1) {
                children[node][idx] = ++cnt;
            }
            node = children[node][idx];
        }
        isEnd[node] = true;
    }

    static boolean search(String word) {
        return dfs(word, 0, 0);
    }

    static boolean dfs(String word, int pos, int node) {
        if (pos == word.length()) return isEnd[node];

        char c = word.charAt(pos);
        if (c == '.') {
            // Пробуем все дочерние узлы
            for (int i = 0; i < 26; i++) {
                if (children[node][i] != -1 && dfs(word, pos + 1, children[node][i])) {
                    return true;
                }
            }
            return false;
        } else {
            int idx = c - 'a';
            if (children[node][idx] == -1) return false;
            return dfs(word, pos + 1, children[node][idx]);
        }
    }

    public static void main(String[] args) {
        init();
        addWord("bad");
        addWord("dad");
        addWord("mad");
        System.out.println("addWord(\\"bad\\"), addWord(\\"dad\\"), addWord(\\"mad\\")");
        System.out.println("search(\\"pad\\") → " + search("pad"));
        System.out.println("search(\\"bad\\") → " + search("bad"));
        System.out.println("search(\\".ad\\") → " + search(".ad"));
        System.out.println("search(\\"b..\\") → " + search("b.."));
    }
}`,
      explanation: 'Расширяем Trie DFS-поиском: для обычных символов идём по пути, для "." пробуем все 26 дочерних. Worst case O(26^m) для строки из точек, но на практике быстро.'
    },
    {
      id: 3,
      title: 'Word Search II',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дана доска m×n с буквами и список слов. Найди все слова, которые можно составить, двигаясь по соседним клеткам (вверх/вниз/влево/вправо). Каждая клетка используется не более одного раза.',
      requirements: [
        'Метод List<String> findWords(char[][] board, String[] words)',
        'Построй Trie из всех слов',
        'DFS с Trie: из каждой клетки, если текущий путь в Trie — продолжай',
        'Если дошёл до isEnd — нашли слово, добавляем и помечаем (избегаем дубликатов)',
        'Помечай посещённые клетки символом "#" (backtrack после)',
        'Пример: board=[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words=["oath","pea","eat","rain"] → ["eat","oath"]'
      ],
      expectedOutput: 'Найдены слова: [eat, oath]',
      hint: 'Trie позволяет прунить поиск: если текущий путь не является префиксом ни одного слова — прекращай DFS. Гораздо быстрее, чем искать каждое слово отдельно.',
      solution: `import java.util.*;

public class Main {
    static int[][] trie = new int[250001][26];
    static String[] endWord = new String[250001];
    static int cnt = 0;

    static void insertTrie(String word) {
        int node = 0;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (trie[node][idx] == 0) trie[node][idx] = ++cnt;
            node = trie[node][idx];
        }
        endWord[node] = word;
    }

    static List<String> result = new ArrayList<>();
    static int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};

    static List<String> findWords(char[][] board, String[] words) {
        cnt = 0;
        result.clear();
        for (int[] row : trie) Arrays.fill(row, 0);
        Arrays.fill(endWord, null);

        for (String w : words) insertTrie(w);

        int m = board.length, n = board[0].length;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                int idx = board[i][j] - 'a';
                if (trie[0][idx] != 0) {
                    dfs(board, i, j, 0);
                }
            }
        }
        return result;
    }

    static void dfs(char[][] board, int r, int c, int node) {
        char ch = board[r][c];
        int next = trie[node][ch - 'a'];
        if (next == 0) return;

        if (endWord[next] != null) {
            result.add(endWord[next]);
            endWord[next] = null; // избегаем дубликатов
        }

        board[r][c] = '#'; // помечаем посещённой
        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length
                    && board[nr][nc] != '#') {
                dfs(board, nr, nc, next);
            }
        }
        board[r][c] = ch; // backtrack
    }

    public static void main(String[] args) {
        char[][] board = {
            {'o','a','a','n'},
            {'e','t','a','e'},
            {'i','h','k','r'},
            {'i','f','l','v'}
        };
        String[] words = {"oath","pea","eat","rain"};
        System.out.println("Найдены слова: " + findWords(board, words));
    }
}`,
      explanation: 'Trie + DFS на доске: строим Trie из слов, затем DFS из каждой клетки, следуя по Trie. Если путь не в Trie — прунинг. Если дошли до endWord — нашли. Обнуляем endWord для избежания дубликатов.'
    },
    {
      id: 4,
      title: 'Longest Word in Dictionary',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив слов. Найди самое длинное слово, которое можно построить посимвольно из других слов массива. Если несколько — верни лексикографически наименьшее.',
      requirements: [
        'Метод String longestWord(String[] words)',
        'Построй Trie из всех слов',
        'Слово "можно построить" = каждый его префикс тоже есть в словаре',
        'BFS или DFS по Trie: проверяй, что каждый промежуточный узел — конец слова',
        'Пример: ["w","wo","wor","worl","world"] → "world"',
        'Пример: ["a","banana","app","appl","ap","apply","apple"] → "apple"'
      ],
      expectedOutput: '["w","wo","wor","worl","world"] → world\n["a","banana","app","appl","ap","apply","apple"] → apple',
      hint: 'Сортируй слова по длине и лексикографически. Добавляй слово в множество, если его префикс (без последней буквы) уже в множестве. Или используй Trie + DFS.',
      solution: `import java.util.*;

public class Main {
    static String longestWord(String[] words) {
        // Простой подход: сортировка + HashSet
        Arrays.sort(words); // лексикографически
        Set<String> built = new HashSet<>();
        built.add(""); // пустая строка как база
        String result = "";

        for (String word : words) {
            // Проверяем, что префикс (без последней буквы) уже построен
            if (built.contains(word.substring(0, word.length() - 1))) {
                built.add(word);
                if (word.length() > result.length()) {
                    result = word;
                }
            }
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println("[\\"w\\",\\"wo\\",\\"wor\\",\\"worl\\",\\"world\\"] → " +
            longestWord(new String[]{"w","wo","wor","worl","world"}));
        System.out.println("[\\"a\\",\\"banana\\",\\"app\\",\\"appl\\",\\"ap\\",\\"apply\\",\\"apple\\"] → " +
            longestWord(new String[]{"a","banana","app","appl","ap","apply","apple"}));
    }
}`,
      explanation: 'Сортируем лексикографически — гарантируем, что при равной длине выберем наименьшее. Слово "построимо", если его префикс (без последней буквы) уже в множестве. O(n * m) где m — средняя длина слова.'
    },
    {
      id: 5,
      title: 'Replace Words',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан словарь корней и предложение. Замени каждое слово в предложении на его кратчайший корень из словаря. Если корня нет — оставь как есть.',
      requirements: [
        'Метод String replaceWords(List<String> dictionary, String sentence)',
        'Построй Trie из корней',
        'Для каждого слова: иди по Trie, если нашёл isEnd — замени на этот корень',
        'Пример: dict=["cat","bat","rat"], sentence="the cattle was rattled by the battery"',
        '→ "the cat was rat by the bat"',
        'Пример: dict=["a","b","c"], sentence="aadsfasf absbd bbab cadsfabd" → "a a b c"'
      ],
      expectedOutput: '"the cattle was rattled by the battery" → "the cat was rat by the bat"\n"aadsfasf absbd bbab cadsfabd" → "a a b c"',
      hint: 'Trie позволяет быстро найти кратчайший корень: идём по символам слова, как только встретили isEnd — возвращаем текущий префикс.',
      solution: `import java.util.*;

public class Main {
    static int[][] trie = new int[100001][26];
    static boolean[] isEnd = new boolean[100001];
    static int cnt = 0;

    static void insert(String word) {
        int node = 0;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (trie[node][idx] == 0) trie[node][idx] = ++cnt;
            node = trie[node][idx];
        }
        isEnd[node] = true;
    }

    static String findRoot(String word) {
        int node = 0;
        StringBuilder sb = new StringBuilder();
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (trie[node][idx] == 0) break; // нет пути в Trie
            node = trie[node][idx];
            sb.append(c);
            if (isEnd[node]) return sb.toString(); // нашли кратчайший корень
        }
        return word; // корень не найден
    }

    static String replaceWords(List<String> dictionary, String sentence) {
        cnt = 0;
        for (int[] row : trie) Arrays.fill(row, 0);
        Arrays.fill(isEnd, false);

        for (String root : dictionary) insert(root);

        String[] words = sentence.split(" ");
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < words.length; i++) {
            result.append(findRoot(words[i]));
            if (i < words.length - 1) result.append(" ");
        }
        return result.toString();
    }

    public static void main(String[] args) {
        System.out.println("\\"the cattle was rattled by the battery\\" → \\"" +
            replaceWords(Arrays.asList("cat","bat","rat"),
                "the cattle was rattled by the battery") + "\\"");
        System.out.println("\\"aadsfasf absbd bbab cadsfabd\\" → \\"" +
            replaceWords(Arrays.asList("a","b","c"),
                "aadsfasf absbd bbab cadsfabd") + "\\"");
    }
}`,
      explanation: 'Trie из корней. Для каждого слова идём по Trie: первый isEnd — кратчайший корень. Если путь оборвался без isEnd — слово остаётся. O(n * m) где n — слова, m — средняя длина.'
    },
    {
      id: 6,
      title: 'Number of Islands — Union-Find',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана матрица m×n из "1" (земля) и "0" (вода). Посчитай количество островов. Остров — группа соседних "1" (по горизонтали/вертикали). Реши через Union-Find.',
      requirements: [
        'Реализуй Union-Find с path compression и union by rank',
        'Для каждой клетки "1": объедини с соседними "1" (вправо и вниз)',
        'Количество островов = количество уникальных корней среди "1"',
        'Координаты (r, c) → id = r * cols + c',
        'Пример: [["1","1","0"],["0","1","0"],["0","0","1"]] → 2',
        'Сравни с DFS/BFS подходом'
      ],
      expectedOutput: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]] → 1\n[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]] → 3',
      hint: 'Union-Find: parent[i] = i изначально. find(x) с path compression. union(x, y) объединяет. Для "1" клеток объединяй с правым и нижним соседом если тоже "1".',
      solution: `public class Main {
    static int[] parent, rank;

    static void init(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    static int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]); // path compression
        return parent[x];
    }

    static void union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return;
        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
    }

    static int numIslands(char[][] grid) {
        int m = grid.length, n = grid[0].length;
        init(m * n);

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    if (i + 1 < m && grid[i + 1][j] == '1')
                        union(i * n + j, (i + 1) * n + j);
                    if (j + 1 < n && grid[i][j + 1] == '1')
                        union(i * n + j, i * n + j + 1);
                }
            }
        }

        java.util.Set<Integer> roots = new java.util.HashSet<>();
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') roots.add(find(i * n + j));
            }
        }
        return roots.size();
    }

    public static void main(String[] args) {
        char[][] g1 = {
            {'1','1','1','1','0'},
            {'1','1','0','1','0'},
            {'1','1','0','0','0'},
            {'0','0','0','0','0'}
        };
        System.out.println(
            "[[\\"1\\",\\"1\\",\\"1\\",\\"1\\",\\"0\\"],[...]] → " + numIslands(g1));

        char[][] g2 = {
            {'1','1','0','0','0'},
            {'1','1','0','0','0'},
            {'0','0','1','0','0'},
            {'0','0','0','1','1'}
        };
        System.out.println(
            "[[\\"1\\",\\"1\\",\\"0\\",\\"0\\",\\"0\\"],[...]] → " + numIslands(g2));
    }
}`,
      explanation: 'Union-Find: объединяем соседние "1" клетки. В конце считаем уникальные корни. Path compression и union by rank дают почти O(1) на операцию. Общая сложность O(m*n * α(m*n)) ≈ O(m*n).'
    },
    {
      id: 7,
      title: 'Redundant Connection',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан граф-дерево с n узлами и n рёбрами (одно лишнее). Найди ребро, удаление которого сделает граф деревом. Если несколько — верни последнее в списке.',
      requirements: [
        'Метод int[] findRedundantConnection(int[][] edges)',
        'Union-Find: добавляй рёбра по одному',
        'Если find(u) == find(v) перед union — это ребро создаёт цикл (лишнее)',
        'Верни последнее такое ребро',
        'Пример: [[1,2],[1,3],[2,3]] → [2,3]',
        'Пример: [[1,2],[2,3],[3,4],[1,4],[1,5]] → [1,4]'
      ],
      expectedOutput: '[[1,2],[1,3],[2,3]] → [2, 3]\n[[1,2],[2,3],[3,4],[1,4],[1,5]] → [1, 4]',
      hint: 'Union-Find в действии: обрабатываем рёбра по порядку. Если u и v уже в одном компоненте (find(u) == find(v)) — это ребро создаёт цикл.',
      solution: `import java.util.Arrays;

public class Main {
    static int[] parent, rank;

    static void init(int n) {
        parent = new int[n + 1];
        rank = new int[n + 1];
        for (int i = 0; i <= n; i++) parent[i] = i;
    }

    static int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    static boolean union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return false; // уже в одном компоненте — цикл!
        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rank[ra] == rank[rb]) rank[ra]++;
        return true;
    }

    static int[] findRedundantConnection(int[][] edges) {
        init(edges.length);
        for (int[] edge : edges) {
            if (!union(edge[0], edge[1])) {
                return edge; // лишнее ребро
            }
        }
        return new int[0];
    }

    public static void main(String[] args) {
        System.out.println("[[1,2],[1,3],[2,3]] → " +
            Arrays.toString(findRedundantConnection(new int[][]{{1,2},{1,3},{2,3}})));
        System.out.println("[[1,2],[2,3],[3,4],[1,4],[1,5]] → " +
            Arrays.toString(findRedundantConnection(new int[][]{{1,2},{2,3},{3,4},{1,4},{1,5}})));
    }
}`,
      explanation: 'Union-Find: обрабатываем рёбра по порядку. Если union возвращает false (вершины уже соединены) — это ребро создаёт цикл. O(n * α(n)) ≈ O(n).'
    },
    {
      id: 8,
      title: 'Accounts Merge',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан список аккаунтов: accounts[i] = [name, email1, email2, ...]. Если два аккаунта имеют общий email — это один человек. Объедини аккаунты.',
      requirements: [
        'Метод List<List<String>> accountsMerge(List<List<String>> accounts)',
        'Union-Find: присвой каждому email ID, объедини emails одного аккаунта',
        'Собери группы по корневому ID',
        'Отсортируй emails в каждой группе, добавь имя в начало',
        'Пример: [["John","john@mail","john00@mail"],["John","johnnybravo@mail"],["John","john@mail","john32@mail"]]',
        '→ [["John","john00@mail","john32@mail","john@mail"],["John","johnnybravo@mail"]]'
      ],
      expectedOutput: 'John: [john00@mail, john32@mail, john@mail]\nJohn: [johnnybravo@mail]',
      hint: 'Map<String, Integer> emailToId — каждому email свой ID. Union-Find: объедини все emails одного аккаунта. Потом группируй по корневому ID. Map<String, String> emailToName — чтобы знать имя.',
      solution: `import java.util.*;

public class Main {
    static int[] parent, rnk;

    static int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    static void union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return;
        if (rnk[ra] < rnk[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rnk[ra] == rnk[rb]) rnk[ra]++;
    }

    static List<List<String>> accountsMerge(List<List<String>> accounts) {
        Map<String, Integer> emailToId = new HashMap<>();
        Map<String, String> emailToName = new HashMap<>();
        int id = 0;

        // Назначаем ID каждому email
        for (List<String> acc : accounts) {
            String name = acc.get(0);
            for (int i = 1; i < acc.size(); i++) {
                if (!emailToId.containsKey(acc.get(i))) {
                    emailToId.put(acc.get(i), id++);
                }
                emailToName.put(acc.get(i), name);
            }
        }

        parent = new int[id];
        rnk = new int[id];
        for (int i = 0; i < id; i++) parent[i] = i;

        // Объединяем emails одного аккаунта
        for (List<String> acc : accounts) {
            int firstId = emailToId.get(acc.get(1));
            for (int i = 2; i < acc.size(); i++) {
                union(firstId, emailToId.get(acc.get(i)));
            }
        }

        // Группируем по корневому ID
        Map<Integer, TreeSet<String>> groups = new HashMap<>();
        for (String email : emailToId.keySet()) {
            int root = find(emailToId.get(email));
            groups.computeIfAbsent(root, k -> new TreeSet<>()).add(email);
        }

        // Формируем результат
        List<List<String>> result = new ArrayList<>();
        for (TreeSet<String> emails : groups.values()) {
            List<String> merged = new ArrayList<>();
            String name = emailToName.get(emails.first());
            merged.add(name);
            merged.addAll(emails);
            result.add(merged);
        }
        return result;
    }

    public static void main(String[] args) {
        List<List<String>> accounts = Arrays.asList(
            Arrays.asList("John", "john@mail", "john00@mail"),
            Arrays.asList("John", "johnnybravo@mail"),
            Arrays.asList("John", "john@mail", "john32@mail")
        );
        List<List<String>> merged = accountsMerge(accounts);
        for (List<String> acc : merged) {
            System.out.println(acc.get(0) + ": " + acc.subList(1, acc.size()));
        }
    }
}`,
      explanation: 'Union-Find объединяет email-ы одного аккаунта. Общий email связывает разные аккаунты. Группируем по корневому ID, сортируем TreeSet. O(n * α(n) + n log n) для сортировки.'
    },
    {
      id: 9,
      title: 'Number of Provinces',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана матрица смежности n×n, где isConnected[i][j] = 1, если города i и j напрямую связаны. Провинция — группа связанных городов. Посчитай количество провинций.',
      requirements: [
        'Метод int findCircleNum(int[][] isConnected)',
        'Union-Find: для каждого isConnected[i][j] == 1 — union(i, j)',
        'Количество провинций = количество уникальных корней',
        'Пример: [[1,1,0],[1,1,0],[0,0,1]] → 2',
        'Пример: [[1,0,0],[0,1,0],[0,0,1]] → 3',
        'Или реши DFS: для каждого непосещённого города запусти DFS'
      ],
      expectedOutput: '[[1,1,0],[1,1,0],[0,0,1]] → 2\n[[1,0,0],[0,1,0],[0,0,1]] → 3',
      hint: 'Union-Find: проходим верхний треугольник матрицы. Если isConnected[i][j] == 1 — union(i, j). Считаем различные корни.',
      solution: `import java.util.*;

public class Main {
    static int[] parent, rnk;

    static int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    static void union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return;
        if (rnk[ra] < rnk[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rnk[ra] == rnk[rb]) rnk[ra]++;
    }

    static int findCircleNum(int[][] isConnected) {
        int n = isConnected.length;
        parent = new int[n];
        rnk = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;

        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (isConnected[i][j] == 1) union(i, j);
            }
        }

        Set<Integer> roots = new HashSet<>();
        for (int i = 0; i < n; i++) roots.add(find(i));
        return roots.size();
    }

    public static void main(String[] args) {
        System.out.println("[[1,1,0],[1,1,0],[0,0,1]] → " +
            findCircleNum(new int[][]{{1,1,0},{1,1,0},{0,0,1}}));
        System.out.println("[[1,0,0],[0,1,0],[0,0,1]] → " +
            findCircleNum(new int[][]{{1,0,0},{0,1,0},{0,0,1}}));
    }
}`,
      explanation: 'Union-Find: проходим верхний треугольник матрицы, объединяем связанные города. Количество уникальных корней = количество провинций. O(n^2 * α(n)).'
    },
    {
      id: 10,
      title: 'Largest Component Size by Common Factor',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив уникальных положительных чисел. Два числа связаны, если имеют общий делитель > 1. Найди размер наибольшей компоненты связности.',
      requirements: [
        'Метод int largestComponentSize(int[] nums)',
        'Union-Find: для каждого числа найди его делители',
        'Объединяй число с его делителями (и делители между собой)',
        'Используй факторизацию: для num объединяй num с каждым простым множителем',
        'Пример: [4,6,15,35] → 4 (все связаны: 4-6 через 2, 6-15 через 3, 15-35 через 5)',
        'Пример: [20,50,9,63] → 2'
      ],
      expectedOutput: '[4,6,15,35] → 4\n[20,50,9,63] → 2\n[2,3,6,7,4,12,21,39] → 8',
      hint: 'Для каждого числа num: найди все простые множители. Объединяй num с каждым множителем в Union-Find. Так числа с общим множителем окажутся в одном компоненте.',
      solution: `import java.util.*;

public class Main {
    static int[] parent, rnk;

    static int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    static void union(int a, int b) {
        int ra = find(a), rb = find(b);
        if (ra == rb) return;
        if (rnk[ra] < rnk[rb]) { int t = ra; ra = rb; rb = t; }
        parent[rb] = ra;
        if (rnk[ra] == rnk[rb]) rnk[ra]++;
    }

    static int largestComponentSize(int[] nums) {
        int maxVal = 0;
        for (int n : nums) maxVal = Math.max(maxVal, n);

        parent = new int[maxVal + 1];
        rnk = new int[maxVal + 1];
        for (int i = 0; i <= maxVal; i++) parent[i] = i;

        // Для каждого числа — объединяем с его делителями
        for (int num : nums) {
            for (int d = 2; d * d <= num; d++) {
                if (num % d == 0) {
                    union(num, d);
                    union(num, num / d);
                }
            }
        }

        // Считаем размеры компонент (только для чисел из nums!)
        Map<Integer, Integer> compSize = new HashMap<>();
        int max = 0;
        for (int num : nums) {
            int root = find(num);
            int size = compSize.getOrDefault(root, 0) + 1;
            compSize.put(root, size);
            max = Math.max(max, size);
        }
        return max;
    }

    public static void main(String[] args) {
        System.out.println("[4,6,15,35] → " +
            largestComponentSize(new int[]{4,6,15,35}));
        System.out.println("[20,50,9,63] → " +
            largestComponentSize(new int[]{20,50,9,63}));
        System.out.println("[2,3,6,7,4,12,21,39] → " +
            largestComponentSize(new int[]{2,3,6,7,4,12,21,39}));
    }
}`,
      explanation: 'Для каждого числа находим делители до sqrt(num) и объединяем через Union-Find. Числа с общим множителем окажутся в одном компоненте. Считаем размеры компонент только для чисел из массива. O(n * sqrt(max) * α(max)).'
    }
  ]
}
