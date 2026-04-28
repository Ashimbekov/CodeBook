export default {
  id: 41,
  title: 'Практикум: Graph BFS/DFS',
  description: 'Десять задач на обход графов: BFS, DFS, топологическая сортировка, Union-Find, multi-source BFS и поиск кратчайшего пути.',
  lessons: [
    {
      id: 1,
      title: 'Number of Islands (LeetCode #200)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана двумерная сетка `grid` размером m x n, заполненная символами \'1\' (суша) и \'0\' (вода). Остров — это область из единиц, соединённых по горизонтали или вертикали. Подсчитай количество островов.\n\nПример:\n  grid = [\n    ["1","1","0","0","0"],\n    ["1","1","0","0","0"],\n    ["0","0","1","0","0"],\n    ["0","0","0","1","1"]\n  ]\n  Ответ: 3',
      requirements: [
        'Метод int numIslands(char[][] grid) — возвращает количество островов',
        'Используй DFS или BFS для обхода каждого острова',
        'Помечай посещённые клетки, чтобы не считать их повторно',
        'Обрабатывай граничные случаи: пустая сетка'
      ],
      expectedOutput: 'Input: [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]\nOutput: 3',
      hint: 'Пройди по всей сетке. Когда находишь \'1\' — увеличь счётчик и запусти DFS/BFS, чтобы пометить весь остров как посещённый (замени \'1\' на \'0\').',
      solution: `class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        int m = grid.length, n = grid[0].length;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(grid, i, j);
                }
            }
        }
        return count;
    }

    private void dfs(char[][] grid, int i, int j) {
        if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length
                || grid[i][j] == '0') {
            return;
        }
        grid[i][j] = '0'; // помечаем как посещённое
        dfs(grid, i + 1, j);
        dfs(grid, i - 1, j);
        dfs(grid, i, j + 1);
        dfs(grid, i, j - 1);
    }
}`,
      explanation: 'Обходим сетку. При встрече \'1\' запускаем DFS, который рекурсивно «затапливает» весь остров, заменяя \'1\' на \'0\'. Каждый такой запуск DFS — один остров. Время: O(m*n), память: O(m*n) в худшем случае из-за стека рекурсии.'
    },
    {
      id: 2,
      title: 'Clone Graph (LeetCode #133)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан узел графа (каждый узел содержит значение и список соседей). Верни глубокую копию (клон) графа.\n\nПример:\n  Граф: 1 -- 2\n        |    |\n        4 -- 3\n  Вход: ссылка на узел 1\n  Выход: клон графа с теми же связями',
      requirements: [
        'Метод Node cloneGraph(Node node) — возвращает клон графа',
        'Используй HashMap для отслеживания уже клонированных узлов',
        'Обработай случай null и граф из одного узла',
        'BFS или DFS для обхода оригинального графа'
      ],
      expectedOutput: 'Input: adjList = [[2,4],[1,3],[2,4],[1,3]]\nOutput: [[2,4],[1,3],[2,4],[1,3]]',
      hint: 'Создай HashMap<Node, Node> — ключ: оригинальный узел, значение: его клон. При обходе DFS/BFS: если сосед уже клонирован — бери из map, иначе — создай клон и продолжи рекурсию.',
      solution: `import java.util.*;

class Node {
    public int val;
    public List<Node> neighbors;
    public Node(int val) {
        this.val = val;
        this.neighbors = new ArrayList<>();
    }
}

class Solution {
    private Map<Node, Node> visited = new HashMap<>();

    public Node cloneGraph(Node node) {
        if (node == null) return null;

        if (visited.containsKey(node)) {
            return visited.get(node);
        }

        Node clone = new Node(node.val);
        visited.put(node, clone);

        for (Node neighbor : node.neighbors) {
            clone.neighbors.add(cloneGraph(neighbor));
        }
        return clone;
    }
}`,
      explanation: 'Используем DFS с HashMap для хранения уже клонированных узлов. При посещении узла создаём его копию и рекурсивно клонируем всех соседей. HashMap предотвращает бесконечный цикл и повторное клонирование. Время: O(V+E), память: O(V).'
    },
    {
      id: 3,
      title: 'Course Schedule (LeetCode #207)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Всего numCourses курсов (0..numCourses-1). Даны пары prerequisites[i] = [a, b]: чтобы взять курс a, нужно сначала пройти курс b. Определи, можно ли пройти все курсы (нет ли циклической зависимости).\n\nПример 1: numCourses=2, prerequisites=[[1,0]] → true (сначала 0, потом 1)\nПример 2: numCourses=2, prerequisites=[[1,0],[0,1]] → false (цикл)',
      requirements: [
        'Метод boolean canFinish(int numCourses, int[][] prerequisites)',
        'Построй граф зависимостей и обнаружь цикл',
        'Используй топологическую сортировку (Kahn\'s BFS) или DFS с цветами',
        'Верни true, если можно пройти все курсы'
      ],
      expectedOutput: 'Input: numCourses=2, prerequisites=[[1,0]]\nOutput: true\n\nInput: numCourses=2, prerequisites=[[1,0],[0,1]]\nOutput: false',
      hint: 'BFS (Kahn): посчитай входящие степени (indegree). Добавь в очередь вершины с indegree=0. Снимай из очереди, уменьшай indegree соседей. Если обработал все вершины — цикла нет.',
      solution: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        int[] indegree = new int[numCourses];

        for (int i = 0; i < numCourses; i++) {
            graph.add(new ArrayList<>());
        }

        for (int[] pre : prerequisites) {
            graph.get(pre[1]).add(pre[0]);
            indegree[pre[0]]++;
        }

        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) queue.offer(i);
        }

        int count = 0;
        while (!queue.isEmpty()) {
            int course = queue.poll();
            count++;
            for (int next : graph.get(course)) {
                indegree[next]--;
                if (indegree[next] == 0) queue.offer(next);
            }
        }
        return count == numCourses;
    }
}`,
      explanation: 'Алгоритм Кана (BFS-топологическая сортировка): считаем входящие степени, добавляем вершины с indegree=0 в очередь. При обработке вершины уменьшаем indegree соседей. Если все вершины обработаны (count == numCourses) — цикла нет. Время: O(V+E), память: O(V+E).'
    },
    {
      id: 4,
      title: 'Pacific Atlantic Water Flow (LeetCode #417)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана матрица heights m x n, представляющая высоты на острове. Тихий океан касается левой и верхней границы, Атлантический — правой и нижней. Вода течёт в соседние клетки с меньшей или равной высотой. Найди все клетки, из которых вода может достичь обоих океанов.\n\nПример:\n  heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]\n  Ответ: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]',
      requirements: [
        'Метод List<List<Integer>> pacificAtlantic(int[][] heights)',
        'Запусти BFS/DFS от границ каждого океана «вверх по течению»',
        'Найди пересечение двух множеств достижимых клеток',
        'Верни список координат клеток, достигающих оба океана'
      ],
      expectedOutput: 'Input: heights=[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]\nOutput: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]',
      hint: 'Вместо проверки потока от каждой клетки — запусти DFS/BFS от границ океанов «в обратном направлении» (от океана вглубь, переходя к клеткам с >= высотой). Пересечение множеств — ответ.',
      solution: `class Solution {
    private int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};

    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        List<List<Integer>> result = new ArrayList<>();
        if (heights == null || heights.length == 0) return result;

        int m = heights.length, n = heights[0].length;
        boolean[][] pacific = new boolean[m][n];
        boolean[][] atlantic = new boolean[m][n];

        for (int i = 0; i < m; i++) {
            dfs(heights, pacific, i, 0);
            dfs(heights, atlantic, i, n - 1);
        }
        for (int j = 0; j < n; j++) {
            dfs(heights, pacific, 0, j);
            dfs(heights, atlantic, m - 1, j);
        }

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (pacific[i][j] && atlantic[i][j]) {
                    result.add(Arrays.asList(i, j));
                }
            }
        }
        return result;
    }

    private void dfs(int[][] heights, boolean[][] visited, int i, int j) {
        visited[i][j] = true;
        for (int[] d : dirs) {
            int ni = i + d[0], nj = j + d[1];
            if (ni >= 0 && ni < heights.length && nj >= 0
                    && nj < heights[0].length && !visited[ni][nj]
                    && heights[ni][nj] >= heights[i][j]) {
                dfs(heights, visited, ni, nj);
            }
        }
    }
}`,
      explanation: 'Запускаем DFS от каждой границы Тихого и Атлантического океанов «вверх по течению» (к клеткам с >= высотой). Для каждого океана получаем множество достижимых клеток. Пересечение этих множеств — ответ. Время: O(m*n), память: O(m*n).'
    },
    {
      id: 5,
      title: 'Number of Connected Components (LeetCode #323)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дано n узлов (0..n-1) и список неориентированных рёбер edges. Найди количество связных компонент в графе.\n\nПример:\n  n=5, edges=[[0,1],[1,2],[3,4]]\n  Ответ: 2 (компоненты: {0,1,2} и {3,4})',
      requirements: [
        'Метод int countComponents(int n, int[][] edges)',
        'Реализуй через Union-Find (Disjoint Set) или DFS',
        'Union-Find: объединяй вершины по рёбрам, считай оставшиеся корни',
        'DFS: строй список смежности, считай количество обходов'
      ],
      expectedOutput: 'Input: n=5, edges=[[0,1],[1,2],[3,4]]\nOutput: 2',
      hint: 'Union-Find: изначально n компонент. Для каждого ребра — union(u, v). Если корни разные — объединяй и уменьшай счётчик. Используй сжатие путей (path compression) и ранг (union by rank).',
      solution: `class Solution {
    private int[] parent;
    private int[] rank;

    public int countComponents(int n, int[][] edges) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;

        int components = n;
        for (int[] edge : edges) {
            if (union(edge[0], edge[1])) {
                components--;
            }
        }
        return components;
    }

    private int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // сжатие путей
        }
        return parent[x];
    }

    private boolean union(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        if (rank[px] < rank[py]) { int tmp = px; px = py; py = tmp; }
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        return true;
    }
}`,
      explanation: 'Union-Find с path compression и union by rank. Изначально каждая вершина — своя компонента (n штук). Для каждого ребра объединяем компоненты: если корни разные — уменьшаем счётчик. Время: O(E * α(n)) ≈ O(E), память: O(n).'
    },
    {
      id: 6,
      title: 'Surrounded Regions (LeetCode #130)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана матрица m x n из символов \'X\' и \'O\'. Захвати все области \'O\', которые полностью окружены \'X\' (замени их на \'X\'). Области \'O\', касающиеся границы, НЕ захватываются.\n\nПример:\n  [["X","X","X","X"],    [["X","X","X","X"],\n   ["X","O","O","X"],  →  ["X","X","X","X"],\n   ["X","X","O","X"],     ["X","X","X","X"],\n   ["X","O","X","X"]]     ["X","O","X","X"]]',
      requirements: [
        'Метод void solve(char[][] board) — модифицирует board in-place',
        'Найди все \'O\' на границе и пометь их (и связанные) как «безопасные»',
        'Все остальные \'O\' замени на \'X\'',
        'Используй DFS или BFS от граничных клеток'
      ],
      expectedOutput: 'Input: [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]\nOutput: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]',
      hint: 'Пройди по границам доски. Для каждого \'O\' на границе запусти DFS и пометь все связанные \'O\' временным символом (например \'T\'). Затем пройди по всей доске: \'O\' → \'X\', \'T\' → \'O\'.',
      solution: `class Solution {
    public void solve(char[][] board) {
        if (board == null || board.length == 0) return;
        int m = board.length, n = board[0].length;

        // Помечаем O на границах и связанные с ними
        for (int i = 0; i < m; i++) {
            if (board[i][0] == 'O') dfs(board, i, 0);
            if (board[i][n - 1] == 'O') dfs(board, i, n - 1);
        }
        for (int j = 0; j < n; j++) {
            if (board[0][j] == 'O') dfs(board, 0, j);
            if (board[m - 1][j] == 'O') dfs(board, m - 1, j);
        }

        // Замена: O -> X (окружённые), T -> O (граничные)
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (board[i][j] == 'O') board[i][j] = 'X';
                else if (board[i][j] == 'T') board[i][j] = 'O';
            }
        }
    }

    private void dfs(char[][] board, int i, int j) {
        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length
                || board[i][j] != 'O') {
            return;
        }
        board[i][j] = 'T'; // временная метка
        dfs(board, i + 1, j);
        dfs(board, i - 1, j);
        dfs(board, i, j + 1);
        dfs(board, i, j - 1);
    }
}`,
      explanation: 'Инвертируем задачу: вместо поиска окружённых областей, ищем «безопасные» (связанные с границей) \'O\'. DFS от граничных \'O\' помечает их как \'T\'. Затем: оставшиеся \'O\' → \'X\' (окружённые), \'T\' → \'O\' (безопасные). Время: O(m*n), память: O(m*n).'
    },
    {
      id: 7,
      title: 'Rotting Oranges (LeetCode #994)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана сетка m x n: 0 — пусто, 1 — свежий апельсин, 2 — гнилой. Каждую минуту гнилой апельсин заражает соседей (4 стороны). Верни минимальное число минут, чтобы все апельсины сгнили, или -1 если невозможно.\n\nПример:\n  grid = [[2,1,1],[1,1,0],[0,1,1]]\n  Ответ: 4',
      requirements: [
        'Метод int orangesRotting(int[][] grid)',
        'Используй multi-source BFS: все гнилые апельсины — стартовые точки',
        'Считай минуты (уровни BFS)',
        'Проверь, остались ли свежие апельсины после BFS'
      ],
      expectedOutput: 'Input: grid=[[2,1,1],[1,1,0],[0,1,1]]\nOutput: 4',
      hint: 'Добавь все клетки с 2 в очередь сразу (multi-source BFS). Обрабатывай уровень за уровнем. Каждый уровень — одна минута. В конце проверь: если остались клетки с 1 — верни -1.',
      solution: `class Solution {
    public int orangesRotting(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        Queue<int[]> queue = new LinkedList<>();
        int fresh = 0;

        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == 2) queue.offer(new int[]{i, j});
                else if (grid[i][j] == 1) fresh++;
            }
        }

        if (fresh == 0) return 0;

        int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
        int minutes = 0;

        while (!queue.isEmpty() && fresh > 0) {
            int size = queue.size();
            minutes++;
            for (int k = 0; k < size; k++) {
                int[] cell = queue.poll();
                for (int[] d : dirs) {
                    int ni = cell[0] + d[0], nj = cell[1] + d[1];
                    if (ni >= 0 && ni < m && nj >= 0 && nj < n
                            && grid[ni][nj] == 1) {
                        grid[ni][nj] = 2;
                        fresh--;
                        queue.offer(new int[]{ni, nj});
                    }
                }
            }
        }
        return fresh == 0 ? minutes : -1;
    }
}`,
      explanation: 'Multi-source BFS: все гнилые апельсины стартуют одновременно. Каждый уровень BFS — одна минута. Считаем свежие апельсины; при заражении уменьшаем счётчик. Если после BFS свежие остались — возвращаем -1. Время: O(m*n), память: O(m*n).'
    },
    {
      id: 8,
      title: 'Word Ladder (LeetCode #127)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Даны beginWord, endWord и список слов wordList. Найди длину кратчайшей цепочки преобразований от beginWord к endWord, где каждый шаг меняет ровно одну букву, и каждое промежуточное слово есть в wordList.\n\nПример:\n  beginWord="hit", endWord="cog"\n  wordList=["hot","dot","dog","lot","log","cog"]\n  Ответ: 5 (hit → hot → dot → dog → cog)',
      requirements: [
        'Метод int ladderLength(String beginWord, String endWord, List<String> wordList)',
        'Используй BFS для поиска кратчайшего пути',
        'Для каждого слова перебирай все возможные замены одной буквы',
        'Используй HashSet для быстрой проверки наличия слова'
      ],
      expectedOutput: 'Input: beginWord="hit", endWord="cog", wordList=["hot","dot","dog","lot","log","cog"]\nOutput: 5',
      hint: 'BFS от beginWord. Для каждого слова в очереди: замени каждую букву на a-z, проверь наличие в wordList (Set). Если нашли endWord — верни уровень. Удаляй использованные слова из Set.',
      solution: `class Solution {
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> wordSet = new HashSet<>(wordList);
        if (!wordSet.contains(endWord)) return 0;

        Queue<String> queue = new LinkedList<>();
        queue.offer(beginWord);
        int level = 1;

        while (!queue.isEmpty()) {
            int size = queue.size();
            level++;
            for (int i = 0; i < size; i++) {
                char[] word = queue.poll().toCharArray();
                for (int j = 0; j < word.length; j++) {
                    char original = word[j];
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == original) continue;
                        word[j] = c;
                        String newWord = new String(word);
                        if (newWord.equals(endWord)) return level;
                        if (wordSet.contains(newWord)) {
                            queue.offer(newWord);
                            wordSet.remove(newWord);
                        }
                    }
                    word[j] = original;
                }
            }
        }
        return 0;
    }
}`,
      explanation: 'BFS гарантирует кратчайший путь. Для каждого слова генерируем всех «соседей» (замена одной буквы). Удаляем использованные слова из множества, чтобы не зацикливаться. Время: O(M^2 * N), где M — длина слова, N — размер словаря. Память: O(M * N).'
    },
    {
      id: 9,
      title: 'Graph Valid Tree (LeetCode #261)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дано n узлов (0..n-1) и список неориентированных рёбер. Определи, образуют ли они валидное дерево. Дерево — это связный ациклический граф.\n\nПример 1: n=5, edges=[[0,1],[0,2],[0,3],[1,4]] → true\nПример 2: n=5, edges=[[0,1],[1,2],[2,3],[1,3],[1,4]] → false (цикл)',
      requirements: [
        'Метод boolean validTree(int n, int[][] edges)',
        'Дерево: ровно n-1 рёбер И граф связный',
        'Используй Union-Find или DFS для проверки',
        'Union-Find: если при объединении корни совпадают — цикл'
      ],
      expectedOutput: 'Input: n=5, edges=[[0,1],[0,2],[0,3],[1,4]]\nOutput: true\n\nInput: n=5, edges=[[0,1],[1,2],[2,3],[1,3],[1,4]]\nOutput: false',
      hint: 'Дерево с n узлами имеет ровно n-1 рёбер. Проверь это условие первым. Затем Union-Find: если при union() корни совпали — есть цикл → не дерево.',
      solution: `class Solution {
    private int[] parent;
    private int[] rank;

    public boolean validTree(int n, int[][] edges) {
        if (edges.length != n - 1) return false;

        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;

        for (int[] edge : edges) {
            if (!union(edge[0], edge[1])) return false; // цикл
        }
        return true;
    }

    private int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    private boolean union(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false; // цикл
        if (rank[px] < rank[py]) { int tmp = px; px = py; py = tmp; }
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        return true;
    }
}`,
      explanation: 'Два условия для дерева: (1) ровно n-1 рёбер, (2) нет циклов. Проверяем n-1 первым делом. Затем Union-Find: при добавлении ребра, если обе вершины уже в одной компоненте — цикл. Время: O(E * α(n)) ≈ O(E), память: O(n).'
    },
    {
      id: 10,
      title: 'Shortest Path in Binary Matrix (LeetCode #1091)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана бинарная матрица n x n (0 — проходимо, 1 — стена). Найди длину кратчайшего пути из левого верхнего угла (0,0) в правый нижний (n-1,n-1). Можно двигаться в 8 направлениях. Верни -1, если путь невозможен.\n\nПример:\n  grid = [[0,0,0],[1,1,0],[1,1,0]]\n  Ответ: 4',
      requirements: [
        'Метод int shortestPathBinaryMatrix(int[][] grid)',
        'Используй BFS для поиска кратчайшего пути',
        'Двигайся в 8 направлениях (включая диагонали)',
        'Обработай случаи: стартовая или конечная клетка заблокирована'
      ],
      expectedOutput: 'Input: grid=[[0,0,0],[1,1,0],[1,1,0]]\nOutput: 4',
      hint: 'BFS от (0,0). Каждый уровень — шаг. Используй 8 направлений: {-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}. Помечай посещённые клетки. Первое достижение (n-1,n-1) — кратчайший путь.',
      solution: `class Solution {
    public int shortestPathBinaryMatrix(int[][] grid) {
        int n = grid.length;
        if (grid[0][0] == 1 || grid[n - 1][n - 1] == 1) return -1;

        int[][] dirs = {{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0});
        grid[0][0] = 1; // помечаем как посещённое
        int path = 1;

        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                int[] cell = queue.poll();
                if (cell[0] == n - 1 && cell[1] == n - 1) return path;
                for (int[] d : dirs) {
                    int ni = cell[0] + d[0], nj = cell[1] + d[1];
                    if (ni >= 0 && ni < n && nj >= 0 && nj < n
                            && grid[ni][nj] == 0) {
                        grid[ni][nj] = 1;
                        queue.offer(new int[]{ni, nj});
                    }
                }
            }
            path++;
        }
        return -1;
    }
}`,
      explanation: 'BFS по уровням гарантирует кратчайший путь. Двигаемся в 8 направлениях. Помечаем клетки как посещённые (grid[i][j]=1) для предотвращения повторного посещения. Время: O(n^2), память: O(n^2).'
    }
  ]
}
