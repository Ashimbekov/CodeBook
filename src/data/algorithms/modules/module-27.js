export default {
  id: 27,
  title: 'Union-Find (Disjoint Set)',
  description: 'Структура данных Union-Find для работы с непересекающимися множествами. Операции union и find, оптимизации path compression и union by rank, определение компонент связности.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Union-Find',
      type: 'theory',
      content: [
        { type: 'text', value: 'Union-Find (другое название — Disjoint Set Union, DSU) — структура данных для управления набором непересекающихся множеств. Поддерживает две операции: union (объединение двух множеств) и find (определение, к какому множеству принадлежит элемент).' },
        { type: 'tip', value: 'Представьте группу людей. Изначально каждый сам по себе. Потом Петя подружился с Колей — они в одной группе. Маша подружилась с Катей. Затем Петя подружился с Машей — теперь Петя, Коля, Маша и Катя в одной большой группе. Union-Find отслеживает такие объединения!' },
        { type: 'heading', value: 'Ключевые задачи Union-Find' },
        { type: 'list', value: [
          'Определение компонент связности в графе',
          'Обнаружение циклов в неориентированном графе',
          'Алгоритм Краскала для минимального остовного дерева',
          'Сети: кто с кем соединён',
          'Задача о количестве островов (Number of Islands)'
        ]},
        { type: 'heading', value: 'Наивная реализация' },
        { type: 'code', language: 'java', value: '// Каждый элемент хранит ссылку на "родителя"\n// Корень множества — элемент, чей родитель = он сам\n\npublic class NaiveUnionFind {\n    int[] parent;\n\n    // Инициализация: каждый элемент — свой собственный родитель\n    public NaiveUnionFind(int n) {\n        parent = new int[n];\n        for (int i = 0; i < n; i++) {\n            parent[i] = i; // Каждый сам себе начальник\n        }\n    }\n\n    // Найти корень множества для элемента x\n    // Поднимаемся по parent, пока не найдём корень\n    public int find(int x) {\n        while (parent[x] != x) {\n            x = parent[x];\n        }\n        return x;\n    }\n\n    // Объединить множества, содержащие x и y\n    public void union(int x, int y) {\n        int rootX = find(x);\n        int rootY = find(y);\n        if (rootX != rootY) {\n            parent[rootX] = rootY; // Подвешиваем одно дерево к другому\n        }\n    }\n\n    // Проверка: в одном ли множестве x и y\n    public boolean connected(int x, int y) {\n        return find(x) == find(y);\n    }\n\n    public static void main(String[] args) {\n        NaiveUnionFind uf = new NaiveUnionFind(5);\n        // Изначально: {0}, {1}, {2}, {3}, {4}\n\n        uf.union(0, 1); // {0,1}, {2}, {3}, {4}\n        uf.union(2, 3); // {0,1}, {2,3}, {4}\n        System.out.println(uf.connected(0, 1)); // true\n        System.out.println(uf.connected(0, 2)); // false\n\n        uf.union(1, 3); // {0,1,2,3}, {4}\n        System.out.println(uf.connected(0, 3)); // true\n        System.out.println(uf.connected(0, 4)); // false\n    }\n}' },
        { type: 'warning', value: 'Наивная реализация может привести к вырожденному дереву — цепочке из n элементов. В этом случае find работает за O(n). Далее мы рассмотрим оптимизации, которые снижают сложность до почти O(1).' }
      ]
    },
    {
      id: 2,
      title: 'Реализация: union, find',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим подробнее, как работают операции find и union, и разберём поведение структуры на примерах.' },
        { type: 'heading', value: 'Детальная реализация с подсчётом компонент' },
        { type: 'code', language: 'java', value: 'public class UnionFind {\n    private int[] parent;\n    private int count; // Количество компонент (множеств)\n\n    public UnionFind(int n) {\n        parent = new int[n];\n        count = n; // Изначально n компонент\n        for (int i = 0; i < n; i++) {\n            parent[i] = i;\n        }\n    }\n\n    // Найти корень (представитель множества)\n    public int find(int x) {\n        while (parent[x] != x) {\n            x = parent[x];\n        }\n        return x;\n    }\n\n    // Объединить два множества\n    // Возвращает true, если объединение произошло (были в разных множествах)\n    public boolean union(int x, int y) {\n        int rootX = find(x);\n        int rootY = find(y);\n        if (rootX == rootY) return false; // Уже в одном множестве\n        parent[rootX] = rootY;\n        count--; // Стало на одну компоненту меньше\n        return true;\n    }\n\n    public boolean connected(int x, int y) {\n        return find(x) == find(y);\n    }\n\n    public int getCount() {\n        return count;\n    }\n\n    public static void main(String[] args) {\n        UnionFind uf = new UnionFind(6);\n        System.out.println("Компонент: " + uf.getCount()); // 6\n\n        uf.union(0, 1);\n        System.out.println("union(0,1) -> компонент: " + uf.getCount()); // 5\n\n        uf.union(2, 3);\n        System.out.println("union(2,3) -> компонент: " + uf.getCount()); // 4\n\n        uf.union(4, 5);\n        System.out.println("union(4,5) -> компонент: " + uf.getCount()); // 3\n\n        uf.union(0, 2);\n        System.out.println("union(0,2) -> компонент: " + uf.getCount()); // 2\n        // Теперь: {0,1,2,3}, {4,5}\n\n        System.out.println("connected(1,3): " + uf.connected(1, 3)); // true\n        System.out.println("connected(1,4): " + uf.connected(1, 4)); // false\n\n        uf.union(3, 5);\n        System.out.println("union(3,5) -> компонент: " + uf.getCount()); // 1\n        System.out.println("connected(0,5): " + uf.connected(0, 5)); // true\n    }\n}' },
        { type: 'heading', value: 'Трассировка массива parent' },
        { type: 'code', language: 'java', value: '// Начало: parent = [0, 1, 2, 3, 4, 5]\n//   Каждый сам себе корень: {0},{1},{2},{3},{4},{5}\n//\n// union(0,1): find(0)=0, find(1)=1, parent[0]=1\n//   parent = [1, 1, 2, 3, 4, 5]\n//   Дерево: 1<-0, {2},{3},{4},{5}\n//\n// union(2,3): find(2)=2, find(3)=3, parent[2]=3\n//   parent = [1, 1, 3, 3, 4, 5]\n//   Деревья: 1<-0, 3<-2, {4},{5}\n//\n// union(0,2): find(0)->parent[0]=1->parent[1]=1, root=1\n//             find(2)->parent[2]=3->parent[3]=3, root=3\n//             parent[1]=3\n//   parent = [1, 3, 3, 3, 4, 5]\n//   Дерево: 3<-1<-0, 3<-2\n//           Т.е. все {0,1,2,3} в одном множестве с корнем 3' },
        { type: 'tip', value: 'Метод union возвращает boolean — это полезно для обнаружения циклов. Если union(a,b) вернул false, значит a и b уже в одном множестве, и ребро (a,b) образует цикл.' }
      ]
    },
    {
      id: 3,
      title: 'Оптимизация: path compression',
      type: 'theory',
      content: [
        { type: 'text', value: 'Path compression (сжатие пути) — оптимизация find. При каждом вызове find мы перенаправляем все узлы на пути непосредственно к корню. Это делает дерево плоским и ускоряет будущие запросы.' },
        { type: 'tip', value: 'Без сжатия: чтобы узнать начальника 5-го уровня, надо спросить 4 человек. С сжатием: после первого запроса все эти люди "запоминают" начальника напрямую. Следующий запрос — мгновенный!' },
        { type: 'heading', value: 'Реализация path compression' },
        { type: 'code', language: 'java', value: 'public class UnionFindPC {\n    private int[] parent;\n    private int count;\n\n    public UnionFindPC(int n) {\n        parent = new int[n];\n        count = n;\n        for (int i = 0; i < n; i++) parent[i] = i;\n    }\n\n    // find с path compression (рекурсивный)\n    public int find(int x) {\n        if (parent[x] != x) {\n            parent[x] = find(parent[x]); // Рекурсивно находим корень\n            // и ПЕРЕНАПРАВЛЯЕМ x прямо к корню!\n        }\n        return parent[x];\n    }\n\n    // find с path compression (итеративный, два прохода)\n    public int findIterative(int x) {\n        // Первый проход: находим корень\n        int root = x;\n        while (parent[root] != root) root = parent[root];\n        // Второй проход: перенаправляем все узлы к корню\n        while (parent[x] != root) {\n            int next = parent[x];\n            parent[x] = root;\n            x = next;\n        }\n        return root;\n    }\n\n    public boolean union(int x, int y) {\n        int rootX = find(x);\n        int rootY = find(y);\n        if (rootX == rootY) return false;\n        parent[rootX] = rootY;\n        count--;\n        return true;\n    }\n\n    public boolean connected(int x, int y) {\n        return find(x) == find(y);\n    }\n\n    public int getCount() { return count; }\n}' },
        { type: 'heading', value: 'Визуализация path compression' },
        { type: 'code', language: 'java', value: '// Без path compression:\n// Дерево может выглядеть как цепочка:\n//   4 -> 3 -> 2 -> 1 -> 0 (корень)\n//   find(4) = O(4) — проходим 4 узла\n//\n// С path compression после find(4):\n// До:                После:\n//   0                  0\n//   |               / | \\ \\\n//   1              1  2  3  4\n//   |\n//   2\n//   |\n//   3\n//   |\n//   4\n//\n// find(4): идём 4->3->2->1->0 (нашли корень 0)\n// Затем: parent[4]=0, parent[3]=0, parent[2]=0, parent[1]=0\n// Теперь find(4) = O(1)!\n//\n// Амортизированная сложность find с path compression:\n// O(log n) в среднем. С union by rank — почти O(1).' },
        { type: 'warning', value: 'Рекурсивный find может вызвать StackOverflowError при очень длинных цепочках (> 10000 элементов). Для больших данных используйте итеративную версию с двумя проходами.' }
      ]
    },
    {
      id: 4,
      title: 'Оптимизация: union by rank',
      type: 'theory',
      content: [
        { type: 'text', value: 'Union by rank — вторая оптимизация Union-Find. При объединении мы подвешиваем меньшее дерево к большему, чтобы высота росла как можно медленнее. Вместе с path compression это даёт амортизированную сложность O(α(n)) ≈ O(1).' },
        { type: 'heading', value: 'Полная реализация с обеими оптимизациями' },
        { type: 'code', language: 'java', value: 'public class UnionFindOptimized {\n    private int[] parent;\n    private int[] rank;   // Верхняя граница высоты дерева\n    private int count;\n\n    public UnionFindOptimized(int n) {\n        parent = new int[n];\n        rank = new int[n];  // Изначально rank = 0 у всех\n        count = n;\n        for (int i = 0; i < n; i++) parent[i] = i;\n    }\n\n    // find с path compression\n    public int find(int x) {\n        if (parent[x] != x) {\n            parent[x] = find(parent[x]);\n        }\n        return parent[x];\n    }\n\n    // union by rank + path compression\n    public boolean union(int x, int y) {\n        int rootX = find(x);\n        int rootY = find(y);\n        if (rootX == rootY) return false;\n\n        // Подвешиваем дерево с меньшим рангом к дереву с большим\n        if (rank[rootX] < rank[rootY]) {\n            parent[rootX] = rootY;\n        } else if (rank[rootX] > rank[rootY]) {\n            parent[rootY] = rootX;\n        } else {\n            // Ранги равны: подвешиваем любое, увеличиваем ранг\n            parent[rootY] = rootX;\n            rank[rootX]++;\n        }\n        count--;\n        return true;\n    }\n\n    public boolean connected(int x, int y) {\n        return find(x) == find(y);\n    }\n\n    public int getCount() { return count; }\n\n    public static void main(String[] args) {\n        UnionFindOptimized uf = new UnionFindOptimized(8);\n\n        // Создаём два "дерева"\n        uf.union(0, 1); // rank[0]=1\n        uf.union(2, 3); // rank[2]=1\n        uf.union(0, 2); // rank одинаковый -> rank[0]=2\n\n        uf.union(4, 5); // rank[4]=1\n        uf.union(6, 7); // rank[6]=1\n        uf.union(4, 6); // rank[4]=2\n\n        System.out.println("Компонент: " + uf.getCount()); // 2\n\n        // Объединяем два дерева одинакового ранга\n        uf.union(0, 4);\n        System.out.println("Компонент: " + uf.getCount()); // 1\n        System.out.println("Все связаны: " + uf.connected(1, 7)); // true\n    }\n}' },
        { type: 'heading', value: 'Сложность операций' },
        { type: 'code', language: 'java', value: '// Сложность Union-Find:\n//\n// Без оптимизаций:\n//   find:  O(n) — вырожденная цепочка\n//   union: O(n)\n//\n// Path compression:\n//   find:  O(log n) амортизированно\n//   union: O(log n)\n//\n// Union by rank:\n//   find:  O(log n) — дерево не глубже log n\n//   union: O(log n)\n//\n// Path compression + Union by rank:\n//   find:  O(α(n)) — обратная функция Аккермана\n//   union: O(α(n))\n//   α(n) ≤ 4 для любого n < 10^80\n//   Практически O(1)!\n//\n// Пространство: O(n) — массивы parent и rank' },
        { type: 'tip', value: 'Обратная функция Аккермана α(n) растёт невероятно медленно. Для любого реально возможного n (хоть 10^80 — количество атомов во Вселенной) α(n) ≤ 4. Поэтому считается, что Union-Find с обеими оптимизациями работает за O(1) на операцию.' }
      ]
    },
    {
      id: 5,
      title: 'Определение компонент связности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Union-Find идеально подходит для задач на компоненты связности: определить количество групп, проверить связность, динамически добавлять рёбра. Рассмотрим несколько классических задач.' },
        { type: 'heading', value: 'Количество компонент связности в графе' },
        { type: 'code', language: 'java', value: 'public class ConnectedComponents {\n    // Union-Find с path compression и union by rank\n    static int[] parent, rank;\n\n    static int find(int x) {\n        if (parent[x] != x) parent[x] = find(parent[x]);\n        return parent[x];\n    }\n\n    static boolean union(int x, int y) {\n        int rx = find(x), ry = find(y);\n        if (rx == ry) return false;\n        if (rank[rx] < rank[ry]) parent[rx] = ry;\n        else if (rank[rx] > rank[ry]) parent[ry] = rx;\n        else { parent[ry] = rx; rank[rx]++; }\n        return true;\n    }\n\n    // Задача: n вершин, список рёбер. Сколько компонент связности?\n    public static int countComponents(int n, int[][] edges) {\n        parent = new int[n];\n        rank = new int[n];\n        for (int i = 0; i < n; i++) parent[i] = i;\n\n        int components = n;\n        for (int[] edge : edges) {\n            if (union(edge[0], edge[1])) {\n                components--;\n            }\n        }\n        return components;\n    }\n\n    public static void main(String[] args) {\n        // Граф: 0-1, 2-3, 3-4\n        // Компоненты: {0,1}, {2,3,4}\n        int[][] edges = {{0,1}, {2,3}, {3,4}};\n        System.out.println("Компонент: " + countComponents(5, edges)); // 2\n\n        // Граф: 0-1, 1-2, 2-3, 3-4\n        int[][] edges2 = {{0,1}, {1,2}, {2,3}, {3,4}};\n        System.out.println("Компонент: " + countComponents(5, edges2)); // 1\n    }\n}' },
        { type: 'heading', value: 'Обнаружение цикла в неориентированном графе' },
        { type: 'code', language: 'java', value: '// Если union(a, b) возвращает false — значит a и b УЖЕ связаны,\n// и ребро (a,b) создаёт цикл!\n\npublic static boolean hasCycle(int n, int[][] edges) {\n    parent = new int[n];\n    rank = new int[n];\n    for (int i = 0; i < n; i++) parent[i] = i;\n\n    for (int[] edge : edges) {\n        if (!union(edge[0], edge[1])) {\n            System.out.println("Цикл обнаружен на ребре: " +\n                edge[0] + " - " + edge[1]);\n            return true;\n        }\n    }\n    return false;\n}\n\n// Пример без цикла: 0-1, 1-2, 2-3\n// union(0,1)=true, union(1,2)=true, union(2,3)=true -> нет цикла\n//\n// Пример с циклом: 0-1, 1-2, 2-0\n// union(0,1)=true, union(1,2)=true\n// union(2,0)=false -> цикл! (0 и 2 уже связаны через 1)' },
        { type: 'heading', value: 'Проверка, является ли граф деревом' },
        { type: 'code', language: 'java', value: '// Граф является деревом, если:\n// 1) Нет циклов\n// 2) Все вершины связаны (одна компонента)\n// 3) Количество рёбер = n - 1\n\npublic static boolean isValidTree(int n, int[][] edges) {\n    if (edges.length != n - 1) return false; // Быстрая проверка\n\n    parent = new int[n];\n    rank = new int[n];\n    for (int i = 0; i < n; i++) parent[i] = i;\n\n    for (int[] edge : edges) {\n        if (!union(edge[0], edge[1])) {\n            return false; // Цикл!\n        }\n    }\n    return true; // n-1 рёбер без циклов -> дерево\n}\n\n// {0-1, 0-2, 0-3, 1-4} — дерево (5 вершин, 4 ребра, нет циклов)\n// {0-1, 1-2, 2-3, 1-3, 1-4} — НЕ дерево (цикл 1-2-3-1)' },
        { type: 'tip', value: 'Union-Find часто используется как альтернатива BFS/DFS для задач на связность. Преимущество: Union-Find работает инкрементально — можно добавлять рёбра по одному и мгновенно отвечать на запросы "связаны ли a и b?".' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Количество островов через UF',
      type: 'practice',
      difficulty: 'medium',
      description: 'Решите задачу Number of Islands с помощью Union-Find. Дана матрица grid из символов \'1\' (суша) и \'0\' (вода). Найдите количество островов. Остров — это группа смежных клеток суши (горизонтально/вертикально).',
      requirements: [
        'Класс UnionFind с path compression и union by rank',
        'Метод numIslands(char[][] grid): возвращает количество островов',
        'Каждую клетку суши (i,j) представить как узел с id = i * cols + j',
        'Объединять смежные клетки суши (вверх, вниз, влево, вправо)',
        'Клетки воды не участвуют в Union-Find',
        'Тест: матрица 4x5 с двумя островами'
      ],
      expectedOutput: 'Карта:\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1\nКоличество островов: 3',
      hint: 'Создайте UnionFind размера rows*cols. Пройдите по всем клеткам: если клетка = \'1\', объедините её с соседями-сушей. В конце посчитайте количество уникальных корней среди клеток суши.',
      solution: 'public class NumberOfIslandsUF {\n    static int[] parent, rank;\n\n    static int find(int x) {\n        if (parent[x] != x) parent[x] = find(parent[x]);\n        return parent[x];\n    }\n\n    static boolean union(int x, int y) {\n        int rx = find(x), ry = find(y);\n        if (rx == ry) return false;\n        if (rank[rx] < rank[ry]) parent[rx] = ry;\n        else if (rank[rx] > rank[ry]) parent[ry] = rx;\n        else { parent[ry] = rx; rank[rx]++; }\n        return true;\n    }\n\n    public static int numIslands(char[][] grid) {\n        if (grid.length == 0) return 0;\n        int rows = grid.length, cols = grid[0].length;\n        parent = new int[rows * cols];\n        rank = new int[rows * cols];\n        for (int i = 0; i < rows * cols; i++) parent[i] = i;\n\n        int count = 0;\n        // Считаем начальное количество клеток суши\n        for (int i = 0; i < rows; i++)\n            for (int j = 0; j < cols; j++)\n                if (grid[i][j] == \'1\') count++;\n\n        int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};\n        for (int i = 0; i < rows; i++) {\n            for (int j = 0; j < cols; j++) {\n                if (grid[i][j] == \'1\') {\n                    for (int[] d : dirs) {\n                        int ni = i + d[0], nj = j + d[1];\n                        if (ni >= 0 && ni < rows && nj >= 0 && nj < cols\n                                && grid[ni][nj] == \'1\') {\n                            if (union(i * cols + j, ni * cols + nj)) {\n                                count--; // Объединение уменьшает число компонент\n                            }\n                        }\n                    }\n                }\n            }\n        }\n        return count;\n    }\n\n    public static void main(String[] args) {\n        char[][] grid = {\n            {\'1\',\'1\',\'0\',\'0\',\'0\'},\n            {\'1\',\'1\',\'0\',\'0\',\'0\'},\n            {\'0\',\'0\',\'1\',\'0\',\'0\'},\n            {\'0\',\'0\',\'0\',\'1\',\'1\'}\n        };\n        System.out.println("Карта:");\n        for (char[] row : grid) {\n            StringBuilder sb = new StringBuilder();\n            for (int k = 0; k < row.length; k++) {\n                if (k > 0) sb.append(" ");\n                sb.append(row[k]);\n            }\n            System.out.println(sb);\n        }\n        System.out.println("Количество островов: " + numIslands(grid));\n    }\n}',
      explanation: 'Каждая клетка суши — узел Union-Find с id = i*cols+j. Проходим по матрице: для каждой клетки суши объединяем её с соседними клетками суши. Начинаем с count = количество клеток суши. Каждое успешное объединение уменьшает count на 1. В конце count — количество островов. Сложность: O(rows*cols * α(rows*cols)) ≈ O(rows*cols).'
    },
    {
      id: 7,
      title: 'Практика: Redundant Connection',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан граф-дерево с одним лишним ребром (n вершин, n рёбер). Найдите ребро, удаление которого превратит граф в дерево. Если таких рёбер несколько, верните последнее в списке.',
      requirements: [
        'Класс RedundantConnection с Union-Find внутри',
        'Метод findRedundantConnection(int[][] edges): вернуть лишнее ребро',
        'Используйте Union-Find: ребро, которое пытается соединить уже связанные вершины — лишнее',
        'Path compression и union by rank для оптимальности',
        'Тест 1: [[1,2],[1,3],[2,3]] -> [2,3]',
        'Тест 2: [[1,2],[2,3],[3,4],[1,4],[1,5]] -> [1,4]'
      ],
      expectedOutput: 'Граф 1: [[1,2],[1,3],[2,3]]\nЛишнее ребро: [2, 3]\n\nГраф 2: [[1,2],[2,3],[3,4],[1,4],[1,5]]\nЛишнее ребро: [1, 4]',
      hint: 'Проходите по рёбрам в порядке. Для каждого ребра (u,v) вызовите union(u,v). Если union вернул false — значит u и v уже связаны, это ребро лишнее. Запоминайте последнее такое ребро.',
      solution: 'import java.util.Arrays;\n\npublic class RedundantConnection {\n    static int[] parent, rank;\n\n    static int find(int x) {\n        if (parent[x] != x) parent[x] = find(parent[x]);\n        return parent[x];\n    }\n\n    static boolean union(int x, int y) {\n        int rx = find(x), ry = find(y);\n        if (rx == ry) return false;\n        if (rank[rx] < rank[ry]) parent[rx] = ry;\n        else if (rank[rx] > rank[ry]) parent[ry] = rx;\n        else { parent[ry] = rx; rank[rx]++; }\n        return true;\n    }\n\n    public static int[] findRedundantConnection(int[][] edges) {\n        int n = edges.length;\n        parent = new int[n + 1]; // Вершины нумеруются с 1\n        rank = new int[n + 1];\n        for (int i = 0; i <= n; i++) parent[i] = i;\n\n        for (int[] edge : edges) {\n            if (!union(edge[0], edge[1])) {\n                return edge; // Это ребро создаёт цикл — оно лишнее\n            }\n        }\n        return new int[0]; // Не должно произойти\n    }\n\n    public static void main(String[] args) {\n        int[][] edges1 = {{1,2},{1,3},{2,3}};\n        System.out.println("Граф 1: " + Arrays.deepToString(edges1));\n        System.out.println("Лишнее ребро: " + Arrays.toString(findRedundantConnection(edges1)));\n\n        System.out.println();\n\n        int[][] edges2 = {{1,2},{2,3},{3,4},{1,4},{1,5}};\n        System.out.println("Граф 2: " + Arrays.deepToString(edges2));\n        System.out.println("Лишнее ребро: " + Arrays.toString(findRedundantConnection(edges2)));\n    }\n}',
      explanation: 'Дерево с n вершинами имеет n-1 рёбер. Если рёбер n — ровно одно лишнее, и оно создаёт цикл. Union-Find находит его: проходим рёбра по порядку, объединяя вершины. Когда union(u,v) возвращает false — u и v уже связаны, ребро (u,v) создаёт цикл. Поскольку мы идём по порядку, это будет последнее цикл-образующее ребро. Сложность: O(n * α(n)) ≈ O(n).'
    }
  ]
}
