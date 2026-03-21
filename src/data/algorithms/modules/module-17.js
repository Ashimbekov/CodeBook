export default {
  id: 17,
  title: 'Обход графа: BFS',
  description: 'Поиск в ширину — обход уровень за уровнем, нахождение кратчайшего пути, обход матрицы-сетки и компоненты связности',
  lessons: [
    {
      id: 1,
      title: 'Что такое BFS?',
      type: 'theory',
      content: [
        { type: 'text', value: 'BFS (Breadth-First Search, поиск в ширину) — это алгоритм обхода графа, который посещает вершины уровень за уровнем: сначала все соседи стартовой вершины, потом соседи соседей, и так далее.' },
        { type: 'tip', value: 'Брось камень в воду — круги на воде расходятся равномерно во все стороны. Сначала волна достигает ближних точек, потом дальних. BFS работает точно так же: сначала вершины на расстоянии 1, потом на расстоянии 2, потом 3...' },
        { type: 'heading', value: 'Идея BFS — волна из стартовой вершины' },
        { type: 'code', language: 'java', value: '// Граф:\n//       1\n//      / \\\n//     2   3\n//    / \\   \\\n//   4   5   6\n//\n// BFS начинаем с вершины 1:\n// Уровень 0: [1]       <- стартовая вершина\n// Уровень 1: [2, 3]    <- соседи вершины 1\n// Уровень 2: [4, 5, 6] <- соседи вершин 2 и 3\n//\n// Порядок посещения: 1, 2, 3, 4, 5, 6' },
        { type: 'text', value: 'BFS гарантирует: когда мы первый раз посещаем вершину, путь до неё — кратчайший (в невзвешенном графе). Это ключевое свойство!' },
        { type: 'list', items: [
          'Используется для нахождения кратчайшего пути в невзвешенном графе',
          'Нахождения всех вершин на расстоянии K от старта',
          'Проверки связности графа',
          'Обхода лабиринта, игровых карт, пикселей изображения'
        ]},
        { type: 'note', value: 'BFS и DFS — два фундаментальных алгоритма обхода графа. BFS идёт "вширь" (использует очередь), DFS идёт "вглубь" (использует стек/рекурсию). Выбор зависит от задачи.' }
      ]
    },
    {
      id: 2,
      title: 'BFS использует очередь',
      type: 'theory',
      content: [
        { type: 'text', value: 'Главный инструмент BFS — очередь (Queue). Мы добавляем стартовую вершину в очередь, затем в цикле: берём вершину из начала очереди, добавляем в конец всех её непосещённых соседей.' },
        { type: 'tip', value: 'Представь очередь в магазине. Стартовая вершина встаёт в очередь первой. Когда её "обслуживают", она приводит с собой всех своих соседей, которые встают в конец очереди. Порядок всегда FIFO — кто пришёл первым, тот обслуживается первым.' },
        { type: 'heading', value: 'Пошаговая трассировка BFS' },
        { type: 'code', language: 'java', value: '// Граф: 0--1--3\n//        \\  |\n//         2-+\n// (рёбра: 0-1, 0-2, 1-2, 1-3)\n//\n// BFS от вершины 0:\n//\n// Шаг 1: очередь=[0], посещено={0}\n// Шаг 2: берём 0, добавляем соседей 1,2\n//         очередь=[1,2], посещено={0,1,2}\n// Шаг 3: берём 1, добавляем соседей (0 посещён, 2 посещён, 3 новый)\n//         очередь=[2,3], посещено={0,1,2,3}\n// Шаг 4: берём 2, добавляем соседей (0 и 1 посещены)\n//         очередь=[3], посещено={0,1,2,3}\n// Шаг 5: берём 3, соседей нет новых\n//         очередь=[], конец!\n//\n// Порядок: 0, 1, 2, 3' },
        { type: 'heading', value: 'Зачем нужен массив visited?' },
        { type: 'code', language: 'java', value: '// БЕЗ visited: попадаем в бесконечный цикл!\n// 0 добавляет 1, 1 добавляет 0 обратно,\n// 0 добавляет 1 снова... БЕСКОНЕЧНО!\n//\n// С visited: каждую вершину посещаем РОВНО ОДИН РАЗ\n// Когда добавляем вершину в очередь — сразу помечаем visited!\n// (не когда достаём, а когда добавляем — так избегаем дублирования)\nboolean[] visited = new boolean[n]; // false по умолчанию\nvisited[start] = true;  // помечаем старт сразу\nqueue.add(start);' },
        { type: 'tip', value: 'Важно: помечай вершину как посещённую в момент добавления в очередь, а не в момент извлечения. Иначе одна вершина может быть добавлена несколько раз!' }
      ]
    },
    {
      id: 3,
      title: 'Реализация BFS на Java',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реализуем BFS в Java. Нам понадобятся: список смежности, очередь (Queue), массив visited. Алгоритм простой: FIFO-очередь + проверка посещённости.' },
        { type: 'heading', value: 'Полная реализация BFS' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class BFS {\n\n    static List<List<Integer>> graph;\n    static int n;  // количество вершин\n\n    static void buildGraph(int vertices) {\n        n = vertices;\n        graph = new ArrayList<>();\n        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());\n    }\n\n    static void addEdge(int u, int v) {\n        graph.get(u).add(v);\n        graph.get(v).add(u);\n    }\n\n    // BFS от стартовой вершины start\n    static void bfs(int start) {\n        boolean[] visited = new boolean[n];\n        Queue<Integer> queue = new LinkedList<>();\n\n        // Инициализация: добавляем старт\n        visited[start] = true;\n        queue.add(start);\n\n        System.out.print("BFS порядок: ");\n\n        while (!queue.isEmpty()) {\n            int current = queue.poll();  // берём из начала очереди\n            System.out.print(current + " ");\n\n            // Добавляем всех непосещённых соседей\n            for (int neighbor : graph.get(current)) {\n                if (!visited[neighbor]) {\n                    visited[neighbor] = true;  // помечаем сразу!\n                    queue.add(neighbor);\n                }\n            }\n        }\n        System.out.println();\n    }\n\n    public static void main(String[] args) {\n        buildGraph(6);\n        addEdge(0, 1);\n        addEdge(0, 2);\n        addEdge(1, 3);\n        addEdge(1, 4);\n        addEdge(2, 5);\n\n        //      0\n        //    /   \\\n        //   1     2\n        //  / \\     \\\n        // 3   4     5\n\n        bfs(0);\n    }\n}\n// Вывод:\n// BFS порядок: 0 1 2 3 4 5' },
        { type: 'heading', value: 'BFS по уровням — с подсчётом расстояний' },
        { type: 'code', language: 'java', value: 'static int[] bfsWithDistance(int start) {\n    int[] dist = new int[n];\n    Arrays.fill(dist, -1);  // -1 = не достижимо\n    Queue<Integer> queue = new LinkedList<>();\n\n    dist[start] = 0;\n    queue.add(start);\n\n    while (!queue.isEmpty()) {\n        int current = queue.poll();\n        for (int neighbor : graph.get(current)) {\n            if (dist[neighbor] == -1) {  // ещё не посещали\n                dist[neighbor] = dist[current] + 1;  // расстояние +1\n                queue.add(neighbor);\n            }\n        }\n    }\n    return dist;\n}\n\n// При вызове bfsWithDistance(0) на графе выше:\n// dist = [0, 1, 1, 2, 2, 2]\n// 0 на расстоянии 0 от себя\n// 1,2 на расстоянии 1\n// 3,4,5 на расстоянии 2' },
        { type: 'list', items: [
          'Временная сложность: O(V + E) — посещаем каждую вершину и ребро ровно раз',
          'Пространственная сложность: O(V) — для очереди и массива visited',
          'Queue<Integer> в Java — интерфейс, LinkedList — реализация'
        ]}
      ]
    },
    {
      id: 4,
      title: 'Кратчайший путь в невзвешенном графе',
      type: 'theory',
      content: [
        { type: 'text', value: 'BFS даёт кратчайший путь (по количеству рёбер) в невзвешенном графе. Чтобы не только узнать длину, но и восстановить сам путь, нужно хранить массив parent (откуда пришли в каждую вершину).' },
        { type: 'heading', value: 'Восстановление кратчайшего пути' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class BFSShortestPath {\n\n    static List<List<Integer>> graph;\n    static int n;\n\n    // Возвращает кратчайший путь из start в end\n    static List<Integer> shortestPath(int start, int end) {\n        int[] parent = new int[n];\n        Arrays.fill(parent, -1);  // -1 = нет родителя\n        boolean[] visited = new boolean[n];\n        Queue<Integer> queue = new LinkedList<>();\n\n        visited[start] = true;\n        queue.add(start);\n\n        while (!queue.isEmpty()) {\n            int current = queue.poll();\n\n            if (current == end) break;  // нашли цель!\n\n            for (int neighbor : graph.get(current)) {\n                if (!visited[neighbor]) {\n                    visited[neighbor] = true;\n                    parent[neighbor] = current;  // запомнили откуда пришли\n                    queue.add(neighbor);\n                }\n            }\n        }\n\n        // Восстанавливаем путь: идём от end обратно к start\n        if (!visited[end]) return Collections.emptyList();  // пути нет\n\n        List<Integer> path = new ArrayList<>();\n        int cur = end;\n        while (cur != -1) {\n            path.add(cur);\n            cur = parent[cur];\n        }\n        Collections.reverse(path);  // путь был от конца к началу\n        return path;\n    }\n\n    public static void main(String[] args) {\n        n = 6;\n        graph = new ArrayList<>();\n        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());\n\n        // Граф:\n        // 0 -- 1 -- 3 -- 5\n        // |         |\n        // 2 ------- 4\n        graph.get(0).add(1); graph.get(1).add(0);\n        graph.get(0).add(2); graph.get(2).add(0);\n        graph.get(1).add(3); graph.get(3).add(1);\n        graph.get(2).add(4); graph.get(4).add(2);\n        graph.get(3).add(4); graph.get(4).add(3);\n        graph.get(3).add(5); graph.get(5).add(3);\n\n        System.out.println("Путь 0->5: " + shortestPath(0, 5));\n        // Путь 0->5: [0, 1, 3, 5]\n        System.out.println("Путь 0->4: " + shortestPath(0, 4));\n        // Путь 0->4: [0, 2, 4]\n    }\n}' },
        { type: 'tip', value: 'Трюк с parent[]: когда мы добавляем соседа в очередь, записываем в parent[сосед] = текущая вершина. Потом идём от конца к началу: end -> parent[end] -> parent[parent[end]] -> ... -> start. Разворачиваем список — и путь готов!' },
        { type: 'note', value: 'BFS даёт гарантированно кратчайший путь ТОЛЬКО в невзвешенном графе (или когда все веса равны 1). Для взвешенного графа нужен алгоритм Дейкстры (модуль 19).' }
      ]
    },
    {
      id: 5,
      title: 'BFS на матрице (сетке)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Очень частая задача — BFS на сетке (двумерном массиве). Клетки — вершины графа, соседи — клетки сверху/снизу/слева/справа (иногда и диагонали).' },
        { type: 'tip', value: 'Лабиринт — это сетка: "." проходимо, "#" стена. BFS найдёт кратчайший путь из старта в финиш! Это буквально то, как работают GPS и игровые ИИ.' },
        { type: 'heading', value: 'BFS на матрице — кратчайший путь в лабиринте' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class BFSGrid {\n\n    // 4 направления: вверх, вниз, влево, вправо\n    static int[] dr = {-1, 1, 0, 0};\n    static int[] dc = {0, 0, -1, 1};\n\n    // Найти кратчайший путь в сетке из (sr,sc) в (er,ec)\n    // 0 = проходимо, 1 = стена\n    static int bfsGrid(int[][] grid, int sr, int sc, int er, int ec) {\n        int rows = grid.length;\n        int cols = grid[0].length;\n\n        if (grid[sr][sc] == 1 || grid[er][ec] == 1) return -1;\n\n        boolean[][] visited = new boolean[rows][cols];\n        Queue<int[]> queue = new LinkedList<>();\n\n        visited[sr][sc] = true;\n        queue.add(new int[]{sr, sc, 0});  // {строка, столбец, расстояние}\n\n        while (!queue.isEmpty()) {\n            int[] curr = queue.poll();\n            int r = curr[0], c = curr[1], dist = curr[2];\n\n            if (r == er && c == ec) return dist;  // достигли цели!\n\n            // Проверяем 4 соседа\n            for (int d = 0; d < 4; d++) {\n                int nr = r + dr[d];\n                int nc = c + dc[d];\n\n                // Проверяем границы, стены и посещённость\n                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols\n                    && grid[nr][nc] == 0 && !visited[nr][nc]) {\n                    visited[nr][nc] = true;\n                    queue.add(new int[]{nr, nc, dist + 1});\n                }\n            }\n        }\n        return -1;  // путь не найден\n    }\n\n    public static void main(String[] args) {\n        int[][] maze = {\n            {0, 0, 1, 0, 0},\n            {0, 0, 0, 0, 1},\n            {1, 0, 1, 0, 0},\n            {0, 0, 0, 1, 0},\n            {0, 1, 0, 0, 0}\n        };\n        // Путь из (0,0) в (4,4)\n        System.out.println(bfsGrid(maze, 0, 0, 4, 4));  // 8\n    }\n}' },
        { type: 'tip', value: 'Трюк с dr/dc: массивы смещений позволяют компактно перебрать всех соседей в цикле от 0 до 3, не дублируя логику для каждого из 4 направлений. Запомни этот паттерн — он везде используется!' }
      ]
    },
    {
      id: 6,
      title: 'Компоненты связности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Граф может быть несвязным — состоять из нескольких "островов", между которыми нет пути. Каждый такой "остров" называется компонентой связности. BFS помогает найти все компоненты.' },
        { type: 'tip', value: 'Представь карту архипелага: острова — вершины, мосты — рёбра. Группа островов, соединённых мостами — компонента связности. Острова без мостов между группами — отдельные компоненты.' },
        { type: 'heading', value: 'Подсчёт компонент связности' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class ConnectedComponents {\n\n    static List<List<Integer>> graph;\n    static int n;\n\n    // Возвращает количество компонент связности\n    static int countComponents() {\n        boolean[] visited = new boolean[n];\n        int count = 0;\n\n        for (int i = 0; i < n; i++) {\n            if (!visited[i]) {  // нашли непосещённую вершину — новая компонента!\n                bfs(i, visited);\n                count++;\n            }\n        }\n        return count;\n    }\n\n    // BFS из вершины start — посещаем всю компоненту\n    static void bfs(int start, boolean[] visited) {\n        Queue<Integer> queue = new LinkedList<>();\n        visited[start] = true;\n        queue.add(start);\n\n        while (!queue.isEmpty()) {\n            int curr = queue.poll();\n            for (int neighbor : graph.get(curr)) {\n                if (!visited[neighbor]) {\n                    visited[neighbor] = true;\n                    queue.add(neighbor);\n                }\n            }\n        }\n    }\n\n    public static void main(String[] args) {\n        n = 7;\n        graph = new ArrayList<>();\n        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());\n\n        // Компонента 1: 0-1-2\n        graph.get(0).add(1); graph.get(1).add(0);\n        graph.get(1).add(2); graph.get(2).add(1);\n\n        // Компонента 2: 3-4\n        graph.get(3).add(4); graph.get(4).add(3);\n\n        // Компонента 3: 5-6\n        graph.get(5).add(6); graph.get(6).add(5);\n\n        System.out.println("Компонент: " + countComponents());  // 3\n    }\n}' },
        { type: 'code', language: 'java', value: '// Трассировка для графа выше:\n// i=0: visited[0]=false -> BFS(0) -> посещает 0,1,2. count=1\n// i=1: visited[1]=true  -> пропускаем\n// i=2: visited[2]=true  -> пропускаем\n// i=3: visited[3]=false -> BFS(3) -> посещает 3,4. count=2\n// i=4: visited[4]=true  -> пропускаем\n// i=5: visited[5]=false -> BFS(5) -> посещает 5,6. count=3\n// i=6: visited[6]=true  -> пропускаем\n// Итого: 3 компоненты' },
        { type: 'note', value: 'Этот паттерн (обход всех вершин + запуск BFS для непосещённых) используется повсюду: подсчёт островов на карте, поиск изолированных кластеров, проверка связности.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Кратчайший путь и острова',
      type: 'practice',
      difficulty: 'medium',
      description: 'Задача 1: Дана матрица NxN (0 — земля, 1 — вода). Найди количество "островов" — групп связных клеток-земли (4-направленная связность). Задача 2: В той же матрице найди размер самого большого острова.',
      requirements: [
        'Использовать BFS для обхода каждого острова',
        'Метод countIslands(int[][] grid) возвращает количество островов',
        'Метод maxIslandSize(int[][] grid) возвращает размер (в клетках) наибольшего острова',
        'Связность только по 4 направлениям (не по диагонали)',
        'Не изменять входную матрицу (использовать отдельный массив visited)'
      ],
      expectedOutput: 'Количество островов: 3\nРазмер наибольшего острова: 5',
      hint: 'Для каждой непосещённой клетки с grid[r][c]==0 запускай BFS, который посетит весь остров и посчитает его размер. Считай количество запусков BFS — это и есть число островов.',
      solution: 'import java.util.*;\n\npublic class Main {\n\n    static int[] dr = {-1, 1, 0, 0};\n    static int[] dc = {0, 0, -1, 1};\n\n    // BFS возвращает размер острова\n    static int bfs(int[][] grid, boolean[][] visited, int sr, int sc) {\n        int rows = grid.length;\n        int cols = grid[0].length;\n        Queue<int[]> queue = new LinkedList<>();\n        visited[sr][sc] = true;\n        queue.add(new int[]{sr, sc});\n        int size = 0;\n\n        while (!queue.isEmpty()) {\n            int[] curr = queue.poll();\n            size++;\n            for (int d = 0; d < 4; d++) {\n                int nr = curr[0] + dr[d];\n                int nc = curr[1] + dc[d];\n                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols\n                    && grid[nr][nc] == 0 && !visited[nr][nc]) {\n                    visited[nr][nc] = true;\n                    queue.add(new int[]{nr, nc});\n                }\n            }\n        }\n        return size;\n    }\n\n    static int countIslands(int[][] grid) {\n        int rows = grid.length, cols = grid[0].length;\n        boolean[][] visited = new boolean[rows][cols];\n        int count = 0;\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                if (grid[r][c] == 0 && !visited[r][c]) {\n                    bfs(grid, visited, r, c);\n                    count++;\n                }\n        return count;\n    }\n\n    static int maxIslandSize(int[][] grid) {\n        int rows = grid.length, cols = grid[0].length;\n        boolean[][] visited = new boolean[rows][cols];\n        int maxSize = 0;\n        for (int r = 0; r < rows; r++)\n            for (int c = 0; c < cols; c++)\n                if (grid[r][c] == 0 && !visited[r][c]) {\n                    int size = bfs(grid, visited, r, c);\n                    maxSize = Math.max(maxSize, size);\n                }\n        return maxSize;\n    }\n\n    public static void main(String[] args) {\n        int[][] grid = {\n            {0, 0, 1, 0, 0},\n            {0, 0, 1, 1, 0},\n            {1, 1, 1, 0, 0},\n            {0, 1, 0, 0, 1},\n            {0, 0, 0, 1, 1}\n        };\n        System.out.println("Количество островов: " + countIslands(grid));\n        System.out.println("Размер наибольшего острова: " + maxIslandSize(grid));\n    }\n}',
      explanation: 'BFS запускается из каждой непосещённой клетки земли (0). Один запуск BFS обходит весь остров и возвращает его размер. countIslands считает количество таких запусков. maxIslandSize берёт максимум размеров. Ключевой момент: visited помечается сразу при добавлении в очередь, чтобы не добавлять одну клетку дважды. Сложность: O(rows * cols).'
    }
  ]
}
