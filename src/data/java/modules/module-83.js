export default {
  id: 83,
  title: 'Практикум: Графы',
  description: 'Практические задачи на графы: BFS, DFS, поиск островов, топологическая сортировка, кратчайшие пути, обнаружение циклов.',
  lessons: [
    {
      id: 1,
      title: 'Задача: BFS — обход графа в ширину',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй обход графа в ширину (BFS) из заданной вершины. Граф представлен списком смежности.',
      requirements: [
        'Создай граф как Map<Integer, List<Integer>>',
        'Используй Queue для BFS и Set для посещённых вершин',
        'Начни обход с вершины 0',
        'Выведи порядок посещения вершин'
      ],
      expectedOutput: 'Граф: 0→[1,2], 1→[3], 2→[4], 3→[], 4→[]\nBFS от 0: [0, 1, 2, 3, 4]',
      hint: 'Добавь стартовую вершину в очередь и в visited. В цикле: достань из очереди, добавь соседей которых ещё не посещали.',
      solution: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map<Integer, List<Integer>> graph = new HashMap<>();
        graph.put(0, Arrays.asList(1, 2));
        graph.put(1, Arrays.asList(3));
        graph.put(2, Arrays.asList(4));
        graph.put(3, Collections.emptyList());
        graph.put(4, Collections.emptyList());

        System.out.println("Граф: 0→[1,2], 1→[3], 2→[4], 3→[], 4→[]");

        List<Integer> order = new ArrayList<>();
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new LinkedList<>();

        queue.add(0);
        visited.add(0);

        while (!queue.isEmpty()) {
            int node = queue.poll();
            order.add(node);
            for (int neighbor : graph.getOrDefault(node, Collections.emptyList())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }

        System.out.println("BFS от 0: " + order);
    }
}`,
      explanation: 'BFS обходит граф по уровням: сначала все вершины на расстоянии 1 от стартовой, затем на расстоянии 2 и так далее. Очередь (FIFO) гарантирует правильный порядок обхода. Set visited предотвращает повторное посещение вершин. Сложность O(V+E), где V — вершины, E — рёбра.'
    },
    {
      id: 2,
      title: 'Задача: DFS — обход графа в глубину',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй обход графа в глубину (DFS) рекурсивно и итеративно (с помощью стека).',
      requirements: [
        'Реализуй рекурсивный DFS',
        'Реализуй итеративный DFS с помощью Stack',
        'Используй Set<Integer> для отслеживания посещённых вершин',
        'Выведи порядок обхода обоими способами'
      ],
      expectedOutput: 'Граф: 0→[1,2], 1→[3,4], 2→[5], 3→[], 4→[], 5→[]\nDFS рекурсивный: [0, 1, 3, 4, 2, 5]\nDFS итеративный: [0, 2, 5, 1, 4, 3]',
      hint: 'Рекурсивный: посети узел, пометь как visited, рекурсивно для каждого непосещённого соседа. Итеративный: используй Stack вместо Queue (тогда обход будет в глубину).',
      solution: `import java.util.*;

public class Main {
    static Map<Integer, List<Integer>> graph = new HashMap<>();

    static void dfsRecursive(int node, Set<Integer> visited, List<Integer> order) {
        visited.add(node);
        order.add(node);
        for (int neighbor : graph.getOrDefault(node, Collections.emptyList())) {
            if (!visited.contains(neighbor)) {
                dfsRecursive(neighbor, visited, order);
            }
        }
    }

    static List<Integer> dfsIterative(int start) {
        List<Integer> order = new ArrayList<>();
        Set<Integer> visited = new HashSet<>();
        Stack<Integer> stack = new Stack<>();
        stack.push(start);

        while (!stack.isEmpty()) {
            int node = stack.pop();
            if (visited.contains(node)) continue;
            visited.add(node);
            order.add(node);
            List<Integer> neighbors = graph.getOrDefault(node, Collections.emptyList());
            for (int i = neighbors.size() - 1; i >= 0; i--) {
                if (!visited.contains(neighbors.get(i))) {
                    stack.push(neighbors.get(i));
                }
            }
        }
        return order;
    }

    public static void main(String[] args) {
        graph.put(0, Arrays.asList(1, 2));
        graph.put(1, Arrays.asList(3, 4));
        graph.put(2, Arrays.asList(5));
        graph.put(3, Collections.emptyList());
        graph.put(4, Collections.emptyList());
        graph.put(5, Collections.emptyList());

        System.out.println("Граф: 0→[1,2], 1→[3,4], 2→[5], 3→[], 4→[], 5→[]");

        List<Integer> recOrder = new ArrayList<>();
        dfsRecursive(0, new HashSet<>(), recOrder);
        System.out.println("DFS рекурсивный: " + recOrder);
        System.out.println("DFS итеративный: " + dfsIterative(0));
    }
}`,
      explanation: 'DFS идёт вглубь, исследуя одну ветвь до конца, прежде чем перейти к другой. Рекурсивная версия использует стек вызовов. Итеративная использует явный Stack. Порядок обхода может отличаться из-за порядка добавления соседей в стек. В итеративной версии добавляем соседей в обратном порядке, чтобы первый сосед обрабатывался первым.'
    },
    {
      id: 3,
      title: 'Задача: Number of Islands',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана матрица из "1" (земля) и "0" (вода). Посчитай количество островов. Остров — это группа смежных (горизонтально/вертикально) "1", окружённая водой.',
      requirements: [
        'Обходи матрицу, ищи клетки с "1"',
        'Для каждой найденной "1" запусти DFS/BFS, чтобы пометить весь остров',
        'Помечай посещённые клетки как "0" чтобы не считать дважды',
        'Подсчитай количество запусков DFS/BFS'
      ],
      expectedOutput: 'Карта:\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1\nКоличество островов: 3',
      hint: 'Для каждой клетки grid[i][j] == 1: увеличь счётчик и запусти DFS, помечая все связанные "1" как "0". DFS рекурсивно идёт вверх, вниз, влево, вправо.',
      solution: `public class Main {
    static char[][] grid;
    static int rows, cols;

    static void dfs(int r, int c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] == '0') return;
        grid[r][c] = '0';
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    }

    static int numIslands() {
        int count = 0;
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(i, j);
                }
            }
        }
        return count;
    }

    public static void main(String[] args) {
        grid = new char[][]{
            {'1', '1', '0', '0', '0'},
            {'1', '1', '0', '0', '0'},
            {'0', '0', '1', '0', '0'},
            {'0', '0', '0', '1', '1'}
        };
        rows = grid.length;
        cols = grid[0].length;

        System.out.println("Карта:");
        for (char[] row : grid) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < row.length; i++) {
                if (i > 0) sb.append(" ");
                sb.append(row[i]);
            }
            System.out.println(sb);
        }

        // Копируем для вывода, т.к. DFS изменит grid
        grid = new char[][]{
            {'1', '1', '0', '0', '0'},
            {'1', '1', '0', '0', '0'},
            {'0', '0', '1', '0', '0'},
            {'0', '0', '0', '1', '1'}
        };
        System.out.println("Количество островов: " + numIslands());
    }
}`,
      explanation: 'Классическая задача на DFS/BFS по матрице. Идея: проходим по всем клеткам. Когда находим "1" — это новый остров, увеличиваем счётчик и запускаем DFS, который "затопит" (пометит "0") все связанные клетки этого острова. Таким образом, каждый остров считается ровно один раз. Сложность O(rows × cols).'
    },
    {
      id: 4,
      title: 'Задача: Clone Graph',
      type: 'practice',
      difficulty: 'medium',
      description: 'Клонируй неориентированный граф. Каждый узел содержит значение и список соседей. Создай глубокую копию графа.',
      requirements: [
        'Используй HashMap<Integer, List<Integer>> для хранения клона',
        'Используй BFS или DFS для обхода оригинального графа',
        'Для каждого узла создай копию и скопируй соседей',
        'HashMap<old, new> для отслеживания уже клонированных узлов'
      ],
      expectedOutput: 'Оригинал: 1→[2,4], 2→[1,3], 3→[2,4], 4→[1,3]\nКлон: 1→[2,4], 2→[1,3], 3→[2,4], 4→[1,3]\nОригинал и клон — разные объекты: true',
      hint: 'Используй HashMap для маппинга оригинальный_узел → клонированный_узел. При обходе: если узел уже в map — вернуть клон. Иначе — создать клон и рекурсивно клонировать соседей.',
      solution: `import java.util.*;

public class Main {
    static Map<Integer, List<Integer>> graph = new HashMap<>();
    static Map<Integer, List<Integer>> clone = new HashMap<>();
    static Set<Integer> visited = new HashSet<>();

    static void cloneGraph(int node) {
        if (visited.contains(node)) return;
        visited.add(node);
        clone.put(node, new ArrayList<>(graph.get(node)));
        for (int neighbor : graph.get(node)) {
            cloneGraph(neighbor);
        }
    }

    public static void main(String[] args) {
        graph.put(1, new ArrayList<>(Arrays.asList(2, 4)));
        graph.put(2, new ArrayList<>(Arrays.asList(1, 3)));
        graph.put(3, new ArrayList<>(Arrays.asList(2, 4)));
        graph.put(4, new ArrayList<>(Arrays.asList(1, 3)));

        cloneGraph(1);

        System.out.print("Оригинал: ");
        for (int key : new TreeSet<>(graph.keySet())) {
            System.out.print(key + "→" + graph.get(key) + (key < 4 ? ", " : ""));
        }
        System.out.println();

        System.out.print("Клон: ");
        for (int key : new TreeSet<>(clone.keySet())) {
            System.out.print(key + "→" + clone.get(key) + (key < 4 ? ", " : ""));
        }
        System.out.println();

        System.out.println("Оригинал и клон — разные объекты: " + (graph != clone));
    }
}`,
      explanation: 'Клонирование графа требует глубокого копирования: каждый узел должен быть новым объектом с новым списком соседей. DFS обход гарантирует, что мы посетим все узлы. Set visited предотвращает бесконечную рекурсию в циклических графах. Новый список соседей создаётся через new ArrayList<>(...) — это важно для создания независимой копии.'
    },
    {
      id: 5,
      title: 'Задача: Course Schedule (топологическая сортировка)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Даны numCourses курсов и пары prerequisites[i] = [a, b], означающие "для курса a нужен курс b". Определи, можно ли пройти все курсы. Используй топологическую сортировку.',
      requirements: [
        'Построй граф зависимостей и массив входящих степеней (inDegree)',
        'Добавь в очередь все вершины с inDegree == 0',
        'BFS: для каждой обработанной вершины уменьши inDegree соседей',
        'Если обработаны все вершины — курсы можно пройти'
      ],
      expectedOutput: 'numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]\nМожно пройти все курсы: true\nПорядок: [0, 1, 2, 3]\n\nnumCourses=2, prerequisites=[[1,0],[0,1]]\nМожно пройти все курсы: false (цикл!)',
      hint: 'Алгоритм Кана: собери все вершины с inDegree=0 в очередь. Обрабатывай: для каждого соседа уменьши inDegree, если стало 0 — добавь в очередь. Если обработанных вершин < numCourses — есть цикл.',
      solution: `import java.util.*;

public class Main {
    static List<Integer> topologicalSort(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        int[] inDegree = new int[numCourses];
        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());

        for (int[] pre : prerequisites) {
            graph.get(pre[1]).add(pre[0]);
            inDegree[pre[0]]++;
        }

        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (inDegree[i] == 0) queue.add(i);
        }

        List<Integer> order = new ArrayList<>();
        while (!queue.isEmpty()) {
            int course = queue.poll();
            order.add(course);
            for (int next : graph.get(course)) {
                inDegree[next]--;
                if (inDegree[next] == 0) queue.add(next);
            }
        }
        return order;
    }

    public static void main(String[] args) {
        int[][] prereqs1 = {{1, 0}, {2, 0}, {3, 1}, {3, 2}};
        List<Integer> order1 = topologicalSort(4, prereqs1);
        System.out.println("numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]");
        System.out.println("Можно пройти все курсы: " + (order1.size() == 4));
        System.out.println("Порядок: " + order1);

        System.out.println();

        int[][] prereqs2 = {{1, 0}, {0, 1}};
        List<Integer> order2 = topologicalSort(2, prereqs2);
        System.out.println("numCourses=2, prerequisites=[[1,0],[0,1]]");
        System.out.println("Можно пройти все курсы: " + (order2.size() == 2) + " (цикл!)");
    }
}`,
      explanation: 'Топологическая сортировка (алгоритм Кана) работает с DAG (ориентированный ациклический граф). Начинаем с вершин без входящих рёбер (inDegree=0). Обрабатывая вершину, "удаляем" её рёбра (уменьшаем inDegree соседей). Если все вершины обработаны — граф ациклический. Если есть цикл — некоторые вершины никогда не достигнут inDegree=0.'
    },
    {
      id: 6,
      title: 'Задача: Dijkstra — кратчайший путь',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй алгоритм Дейкстры для нахождения кратчайших путей от заданной вершины до всех остальных во взвешенном графе.',
      requirements: [
        'Представь граф как список смежности с весами',
        'Используй PriorityQueue (min-heap) для выбора ближайшей вершины',
        'Массив dist[] для хранения кратчайших расстояний, изначально Integer.MAX_VALUE',
        'Выведи кратчайшие расстояния от стартовой вершины'
      ],
      expectedOutput: 'Граф: 0→(1,4), 0→(2,1), 1→(3,1), 2→(1,2), 2→(3,5), 3→()\nКратчайшие расстояния от 0:\n0 → 0: 0\n0 → 1: 3\n0 → 2: 1\n0 → 3: 4',
      hint: 'PriorityQueue сортирует по расстоянию. На каждом шаге извлекай вершину с минимальным dist. Для каждого соседа: если dist[curr] + weight < dist[neighbor] — обнови dist[neighbor] и добавь в очередь.',
      solution: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        int n = 4;
        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());

        graph.get(0).add(new int[]{1, 4});
        graph.get(0).add(new int[]{2, 1});
        graph.get(1).add(new int[]{3, 1});
        graph.get(2).add(new int[]{1, 2});
        graph.get(2).add(new int[]{3, 5});

        System.out.println("Граф: 0→(1,4), 0→(2,1), 1→(3,1), 2→(1,2), 2→(3,5), 3→()");

        int[] dist = new int[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[0] = 0;

        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
        pq.add(new int[]{0, 0});

        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int u = curr[0], d = curr[1];
            if (d > dist[u]) continue;

            for (int[] edge : graph.get(u)) {
                int v = edge[0], w = edge[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.add(new int[]{v, dist[v]});
                }
            }
        }

        System.out.println("Кратчайшие расстояния от 0:");
        for (int i = 0; i < n; i++) {
            System.out.println("0 → " + i + ": " + dist[i]);
        }
    }
}`,
      explanation: 'Алгоритм Дейкстры находит кратчайшие пути от одной вершины до всех остальных в графе с неотрицательными весами. PriorityQueue (min-heap) всегда извлекает вершину с минимальным расстоянием. Для каждого соседа проверяем: можно ли улучшить его расстояние через текущую вершину (релаксация). Сложность O((V+E) log V) с PriorityQueue.'
    },
    {
      id: 7,
      title: 'Задача: Connected Components',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди количество компонент связности в неориентированном графе. Две вершины в одной компоненте, если между ними есть путь.',
      requirements: [
        'Используй DFS или BFS для обхода каждой компоненты',
        'Массив visited для отслеживания посещённых вершин',
        'Для каждой непосещённой вершины запусти обход — это новая компонента',
        'Выведи количество компонент и состав каждой'
      ],
      expectedOutput: 'Граф: 0-1, 1-2, 3-4, 5 (изолирована)\nКоличество компонент: 3\nКомпонента 1: [0, 1, 2]\nКомпонента 2: [3, 4]\nКомпонента 3: [5]',
      hint: 'Пройди по всем вершинам. Для каждой непосещённой запусти DFS, собирая все вершины компоненты в список. Количество запусков DFS = количество компонент.',
      solution: `import java.util.*;

public class Main {
    static Map<Integer, List<Integer>> graph = new HashMap<>();
    static boolean[] visited;

    static void dfs(int node, List<Integer> component) {
        visited[node] = true;
        component.add(node);
        for (int neighbor : graph.getOrDefault(node, Collections.emptyList())) {
            if (!visited[neighbor]) {
                dfs(neighbor, component);
            }
        }
    }

    public static void main(String[] args) {
        int n = 6;
        for (int i = 0; i < n; i++) graph.put(i, new ArrayList<>());
        // 0-1, 1-2
        graph.get(0).add(1); graph.get(1).add(0);
        graph.get(1).add(2); graph.get(2).add(1);
        // 3-4
        graph.get(3).add(4); graph.get(4).add(3);
        // 5 изолирована

        System.out.println("Граф: 0-1, 1-2, 3-4, 5 (изолирована)");

        visited = new boolean[n];
        List<List<Integer>> components = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                List<Integer> component = new ArrayList<>();
                dfs(i, component);
                components.add(component);
            }
        }

        System.out.println("Количество компонент: " + components.size());
        for (int i = 0; i < components.size(); i++) {
            System.out.println("Компонента " + (i + 1) + ": " + components.get(i));
        }
    }
}`,
      explanation: 'Компоненты связности находятся серией DFS/BFS обходов. Каждый раз, когда встречаем непосещённую вершину — начинаем новый обход, который пройдёт по всей её компоненте. Количество таких обходов = количество компонент. Сложность O(V+E). Это фундаментальная задача теории графов, используемая в анализе сетей, обработке изображений и кластеризации.'
    },
    {
      id: 8,
      title: 'Задача: Detect Cycle в ориентированном графе',
      type: 'practice',
      difficulty: 'medium',
      description: 'Определи, содержит ли ориентированный граф цикл. Используй DFS с тремя состояниями вершин: white (не посещена), gray (в процессе), black (завершена).',
      requirements: [
        'Используй массив состояний: 0 = white, 1 = gray, 2 = black',
        'При входе в вершину помечай как gray',
        'Если встретил gray-вершину — найден цикл',
        'При выходе из вершины помечай как black'
      ],
      expectedOutput: 'Граф 1: 0→1, 1→2, 2→0 — Цикл: true\nГраф 2: 0→1, 1→2, 2→3 — Цикл: false',
      hint: 'White = ещё не посещали. Gray = в текущем стеке рекурсии (на пути от корня DFS). Black = полностью обработана. Цикл — когда DFS пришёл к gray-вершине.',
      solution: `import java.util.*;

public class Main {
    static List<List<Integer>> graph;
    static int[] color; // 0=white, 1=gray, 2=black

    static boolean hasCycle(int node) {
        color[node] = 1; // gray
        for (int neighbor : graph.get(node)) {
            if (color[neighbor] == 1) return true; // back edge = cycle
            if (color[neighbor] == 0 && hasCycle(neighbor)) return true;
        }
        color[node] = 2; // black
        return false;
    }

    static boolean detectCycle(int n) {
        color = new int[n];
        for (int i = 0; i < n; i++) {
            if (color[i] == 0 && hasCycle(i)) return true;
        }
        return false;
    }

    public static void main(String[] args) {
        // Граф 1: с циклом 0→1→2→0
        graph = new ArrayList<>();
        for (int i = 0; i < 3; i++) graph.add(new ArrayList<>());
        graph.get(0).add(1);
        graph.get(1).add(2);
        graph.get(2).add(0);
        System.out.println("Граф 1: 0→1, 1→2, 2→0 — Цикл: " + detectCycle(3));

        // Граф 2: без цикла
        graph = new ArrayList<>();
        for (int i = 0; i < 4; i++) graph.add(new ArrayList<>());
        graph.get(0).add(1);
        graph.get(1).add(2);
        graph.get(2).add(3);
        System.out.println("Граф 2: 0→1, 1→2, 2→3 — Цикл: " + detectCycle(4));
    }
}`,
      explanation: 'Три цвета позволяют различить типы рёбер в DFS. White (0) — вершина не обнаружена. Gray (1) — вершина открыта, её DFS-поддерево ещё обрабатывается. Black (2) — вершина полностью обработана. Ребро к gray-вершине (back edge) означает цикл: мы нашли путь от вершины к ней самой через стек рекурсии.'
    },
    {
      id: 9,
      title: 'Задача: Word Ladder',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дано начальное слово beginWord, конечное endWord и словарь wordList. Найди длину кратчайшей цепочки трансформаций, где на каждом шаге меняется ровно одна буква.',
      requirements: [
        'Используй BFS — каждый шаг трансформации это один уровень',
        'Для текущего слова генерируй все возможные замены одной буквы',
        'Проверяй, есть ли новое слово в словаре',
        'Верни длину кратчайшей цепочки или 0'
      ],
      expectedOutput: 'beginWord="hit", endWord="cog"\nwordList=["hot","dot","dog","lot","log","cog"]\nДлина цепочки: 5 (hit→hot→dot→dog→cog)',
      hint: 'BFS гарантирует кратчайший путь. На каждом шаге для каждой позиции буквы пробуй все 26 замен. Если получившееся слово в словаре — добавь в очередь и удали из словаря.',
      solution: `import java.util.*;

public class Main {
    static int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> wordSet = new HashSet<>(wordList);
        if (!wordSet.contains(endWord)) return 0;

        Queue<String> queue = new LinkedList<>();
        queue.add(beginWord);
        int level = 1;

        while (!queue.isEmpty()) {
            int size = queue.size();
            for (int i = 0; i < size; i++) {
                char[] word = queue.poll().toCharArray();
                for (int j = 0; j < word.length; j++) {
                    char original = word[j];
                    for (char c = 'a'; c <= 'z'; c++) {
                        if (c == original) continue;
                        word[j] = c;
                        String newWord = new String(word);
                        if (newWord.equals(endWord)) return level + 1;
                        if (wordSet.contains(newWord)) {
                            queue.add(newWord);
                            wordSet.remove(newWord);
                        }
                    }
                    word[j] = original;
                }
            }
            level++;
        }
        return 0;
    }

    public static void main(String[] args) {
        String begin = "hit";
        String end = "cog";
        List<String> words = new ArrayList<>(Arrays.asList("hot", "dot", "dog", "lot", "log", "cog"));

        System.out.println("beginWord=\\"hit\\", endWord=\\"cog\\"");
        System.out.println("wordList=[\\"hot\\",\\"dot\\",\\"dog\\",\\"lot\\",\\"log\\",\\"cog\\"]");
        System.out.println("Длина цепочки: " + ladderLength(begin, end, words) + " (hit→hot→dot→dog→cog)");
    }
}`,
      explanation: 'Word Ladder — классическая задача на BFS. Каждое слово — вершина графа, рёбра — слова, отличающиеся одной буквой. BFS находит кратчайший путь в невзвешенном графе. Оптимизация: вместо проверки всех пар слов, для каждой позиции пробуем все 26 букв. Удаление использованных слов из множества предотвращает повторное посещение.'
    },
    {
      id: 10,
      title: 'Задача: Network Delay Time',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана сеть из n узлов и рёбра times[i] = [u, v, w] (сигнал из u в v за w времени). Определи минимальное время, чтобы сигнал из узла k дошёл до всех узлов. Если невозможно — верни -1.',
      requirements: [
        'Примени алгоритм Дейкстры от узла k',
        'Найди кратчайшее расстояние до каждого узла',
        'Ответ — максимум из всех кратчайших расстояний',
        'Если какой-то узел недоступен (dist = MAX) — вернуть -1'
      ],
      expectedOutput: 'times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2\nВремя задержки: 2\n\ntimes=[[1,2,1]], n=2, k=2\nВремя задержки: -1 (узел 1 недоступен из 2)',
      hint: 'Дейкстра от узла k. После вычисления всех dist — ответ max(dist). Если max == Integer.MAX_VALUE — есть недоступные узлы.',
      solution: `import java.util.*;

public class Main {
    static int networkDelayTime(int[][] times, int n, int k) {
        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i <= n; i++) graph.add(new ArrayList<>());
        for (int[] t : times) graph.get(t[0]).add(new int[]{t[1], t[2]});

        int[] dist = new int[n + 1];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[k] = 0;

        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
        pq.add(new int[]{k, 0});

        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int u = curr[0], d = curr[1];
            if (d > dist[u]) continue;
            for (int[] edge : graph.get(u)) {
                int v = edge[0], w = edge[1];
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    pq.add(new int[]{v, dist[v]});
                }
            }
        }

        int maxDist = 0;
        for (int i = 1; i <= n; i++) {
            if (dist[i] == Integer.MAX_VALUE) return -1;
            maxDist = Math.max(maxDist, dist[i]);
        }
        return maxDist;
    }

    public static void main(String[] args) {
        int[][] times1 = {{2, 1, 1}, {2, 3, 1}, {3, 4, 1}};
        System.out.println("times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2");
        System.out.println("Время задержки: " + networkDelayTime(times1, 4, 2));

        System.out.println();

        int[][] times2 = {{1, 2, 1}};
        System.out.println("times=[[1,2,1]], n=2, k=2");
        System.out.println("Время задержки: " + networkDelayTime(times2, 2, 2) + " (узел 1 недоступен из 2)");
    }
}`,
      explanation: 'Задача сводится к алгоритму Дейкстры: находим кратчайшие расстояния от k до всех узлов. Ответ — максимальное из кратчайших расстояний (последний узел, до которого дойдёт сигнал). Если хотя бы один узел недоступен (dist = MAX_VALUE) — вернём -1. PriorityQueue обеспечивает эффективный выбор ближайшей необработанной вершины.'
    }
  ]
}
