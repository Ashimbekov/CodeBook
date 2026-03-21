export default {
  id: 16,
  title: 'Графы: основы и представление',
  description: 'Что такое граф, виды графов, вершины, рёбра, пути и циклы. Матрица смежности и список смежности — реализация на Java',
  lessons: [
    {
      id: 1,
      title: 'Что такое граф?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Граф — это одна из самых мощных структур данных. Он позволяет описывать связи между объектами. Города и дороги между ними, люди и их дружба, компьютеры и сетевые кабели — всё это графы!' },
        { type: 'tip', value: 'Представь карту города. Города — это точки (вершины). Дороги между ними — это линии (рёбра). Вот и всё — ты уже понимаешь граф! Любая задача "как добраться из A в B?" — это задача на графе.' },
        { type: 'heading', value: 'Основные понятия' },
        { type: 'list', items: [
          'Вершина (Vertex / Node) — точка в графе. Например, город Алматы',
          'Ребро (Edge) — связь между двумя вершинами. Например, дорога Алматы–Астана',
          'Граф G = (V, E), где V — множество вершин, E — множество рёбер'
        ]},
        { type: 'heading', value: 'Простой граф из 5 городов' },
        { type: 'code', language: 'java', value: '// Граф: Алматы(0) -- Тараз(1) -- Шымкент(2)\n//        |                          |\n//       Астана(3) ---------- Актобе(4)\n//\n// Вершины: {0, 1, 2, 3, 4}\n// Рёбра:   {(0,1), (1,2), (2,4), (0,3), (3,4)}\n//\n// Из Алматы можно добраться до Тараза, Астаны.\n// Из Тараза — до Алматы и Шымкента.\n// Из Шымкента — до Тараза и Актобе. И т.д.' },
        { type: 'text', value: 'Графы используются повсюду: GPS-навигация находит кратчайший маршрут (граф дорог), социальные сети показывают друзей (граф людей), интернет-роутеры пересылают пакеты (граф сетевых узлов).' },
        { type: 'note', value: 'В отличие от дерева, в графе нет "корня" и "родителя". Граф — более общая структура: дерево — это частный случай графа без циклов.' }
      ]
    },
    {
      id: 2,
      title: 'Ориентированные и неориентированные графы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рёбра графа могут быть с направлением или без. Это различие принципиально важно при решении задач.' },
        { type: 'tip', value: 'Дорога с двусторонним движением — неориентированное ребро: можно ехать в обе стороны. Улица с односторонним движением — ориентированное ребро (дуга): ехать можно только в одну сторону. В Instagram подписка тоже ориентирована: ты можешь подписаться на звезду, но она не обязана на тебя.' },
        { type: 'heading', value: 'Неориентированный граф (Undirected Graph)' },
        { type: 'code', language: 'java', value: '// Ребро (A, B) означает: A связан с B И B связан с A\n// Пример: дружба в ВКонтакте — взаимная\n//\n//   A --- B\n//   |   / |\n//   |  /  |\n//   C --- D\n//\n// Если (A,B) — то можно и из A в B, и из B в A' },
        { type: 'heading', value: 'Ориентированный граф (Directed Graph / Digraph)' },
        { type: 'code', language: 'java', value: '// Ребро (A -> B) означает: из A можно попасть в B, но НЕ наоборот!\n// Пример: подписки в Instagram\n//\n//   A --> B\n//   ^     |\n//   |     v\n//   D <-- C\n//\n// Из A идёт стрелка в B\n// Из B идёт стрелка в C\n// Из C идёт стрелка в D\n// Из D идёт стрелка в A\n// Это ЦИКЛ: A->B->C->D->A' },
        { type: 'list', items: [
          'Неориентированный: друзья (ВКонтакте, Facebook), карта дорог с двусторонним движением',
          'Ориентированный: подписки (Instagram, Twitter), веб-ссылки, зависимости пакетов в проекте',
          'В неориентированном: степень вершины = количество рёбер',
          'В ориентированном: входящая степень (in-degree) и исходящая степень (out-degree)'
        ]},
        { type: 'note', value: 'Неориентированное ребро (u,v) — это два ориентированных ребра: u->v и v->u. Поэтому при хранении неориентированного графа мы всегда добавляем ребро в обе стороны.' }
      ]
    },
    {
      id: 3,
      title: 'Взвешенные графы и терминология',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рёбра графа могут иметь "вес" — число, которое показывает стоимость, расстояние или время перехода по этому ребру.' },
        { type: 'tip', value: 'GPS-навигатор знает не просто что дороги существуют, но и их длину. Расстояние Алматы–Астана — 1300 км, Алматы–Тараз — 680 км. Это взвешенный граф! Алгоритм находит маршрут с минимальной суммой весов.' },
        { type: 'heading', value: 'Взвешенный граф' },
        { type: 'code', language: 'java', value: '// Расстояния между городами (в км)\n//\n//   Алматы(0) --[680]--> Тараз(1) --[310]--> Шымкент(2)\n//       |                                          |\n//     [1300]                                     [720]\n//       |                                          |\n//   Астана(3) <--------[1500]-------------- Актобе(4)\n//\n// Кратчайший путь из Алматы в Шымкент:\n// Алматы -> Тараз -> Шымкент = 680 + 310 = 990 км\n// (не через Астану: 1300 + 1500 + 720 = 3520 км!)' },
        { type: 'heading', value: 'Ключевые термины' },
        { type: 'list', items: [
          'Путь (Path) — последовательность вершин, где каждые две соседние соединены ребром',
          'Длина пути — для невзвешенного: количество рёбер, для взвешенного: сумма весов',
          'Цикл (Cycle) — путь, который начинается и заканчивается в одной вершине',
          'Степень вершины (Degree) — количество рёбер, смежных с ней',
          'Связный граф — из любой вершины можно добраться до любой другой',
          'Компонента связности — максимальное множество взаимно достижимых вершин'
        ]},
        { type: 'code', language: 'java', value: '// Пример пути и цикла:\n// Граф: 1--2--3\n//       |     |\n//       4-----+\n//\n// Путь из 1 в 3: [1, 2, 3] (длина 2)\n// Путь из 1 в 3: [1, 4, 3] (длина 2) — другой путь!\n// Цикл: [1, 2, 3, 4, 1] (длина 4)\n//\n// Степень вершины 1: 2 (смежна с 2 и 4)\n// Степень вершины 2: 2 (смежна с 1 и 3)' },
        { type: 'warning', value: 'Граф без циклов называется ациклическим. Ориентированный ациклический граф (DAG — Directed Acyclic Graph) очень важен на практике: это зависимости в Makefile, порядок задач, компиляция модулей.' }
      ]
    },
    {
      id: 4,
      title: 'Матрица смежности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Матрица смежности — это двумерный массив, где строки и столбцы — это вершины. Ячейка [i][j] = 1, если есть ребро из i в j, иначе 0. Для взвешенного графа — ячейка хранит вес.' },
        { type: 'tip', value: 'Представь таблицу: строки — "откуда", столбцы — "куда". Ставим 1 там, где есть дорога. Ноль — дороги нет. Просто и наглядно!' },
        { type: 'heading', value: 'Граф на 4 вершины и его матрица' },
        { type: 'code', language: 'java', value: '// Граф:\n//  0 -- 1\n//  |    |\n//  3 -- 2\n//\n// Матрица смежности (0 = нет ребра, 1 = есть ребро):\n//     0  1  2  3\n//  0 [0, 1, 0, 1]\n//  1 [1, 0, 1, 0]\n//  2 [0, 1, 0, 1]\n//  3 [1, 0, 1, 0]\n//\n// matrix[0][1] = 1 -> есть ребро 0--1\n// matrix[0][2] = 0 -> нет ребра 0--2\n// Для неориентированного: матрица симметрична (matrix[i][j] == matrix[j][i])' },
        { type: 'heading', value: 'Реализация матрицы смежности на Java' },
        { type: 'code', language: 'java', value: 'public class GraphMatrix {\n    private int vertices;    // количество вершин\n    private int[][] matrix;  // матрица смежности\n\n    public GraphMatrix(int vertices) {\n        this.vertices = vertices;\n        this.matrix = new int[vertices][vertices];\n        // По умолчанию все 0 — рёбер нет\n    }\n\n    // Добавить неориентированное ребро\n    public void addEdge(int u, int v) {\n        matrix[u][v] = 1;\n        matrix[v][u] = 1;  // симметрично для неориентированного\n    }\n\n    // Добавить взвешенное ребро\n    public void addWeightedEdge(int u, int v, int weight) {\n        matrix[u][v] = weight;\n        matrix[v][u] = weight;\n    }\n\n    // Есть ли ребро?\n    public boolean hasEdge(int u, int v) {\n        return matrix[u][v] != 0;\n    }\n\n    // Вывести матрицу\n    public void printMatrix() {\n        System.out.print("  ");\n        for (int i = 0; i < vertices; i++) System.out.print(i + " ");\n        System.out.println();\n        for (int i = 0; i < vertices; i++) {\n            System.out.print(i + " ");\n            for (int j = 0; j < vertices; j++) {\n                System.out.print(matrix[i][j] + " ");\n            }\n            System.out.println();\n        }\n    }\n\n    public static void main(String[] args) {\n        GraphMatrix g = new GraphMatrix(4);\n        g.addEdge(0, 1);\n        g.addEdge(0, 3);\n        g.addEdge(1, 2);\n        g.addEdge(2, 3);\n        g.printMatrix();\n        System.out.println("Есть ребро 0-2? " + g.hasEdge(0, 2));\n        System.out.println("Есть ребро 0-1? " + g.hasEdge(0, 1));\n    }\n}\n// Вывод:\n//   0 1 2 3\n// 0 0 1 0 1\n// 1 1 0 1 0\n// 2 0 1 0 1\n// 3 1 0 1 0\n// Есть ребро 0-2? false\n// Есть ребро 0-1? true' },
        { type: 'list', items: [
          'Плюсы: O(1) проверка наличия ребра, простота реализации',
          'Минусы: O(V²) памяти — для 10000 вершин нужно 100 000 000 ячеек!',
          'Подходит для: плотных графов (много рёбер), маленьких графов'
        ]}
      ]
    },
    {
      id: 5,
      title: 'Список смежности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Список смежности хранит для каждой вершины список её соседей. Это намного экономнее по памяти для разреженных графов (мало рёбер относительно числа вершин).' },
        { type: 'tip', value: 'Вместо огромной таблицы с кучей нулей, у каждого города хранится только список городов, с которыми он соединён. У Алматы: [Тараз, Астана]. У Тараза: [Алматы, Шымкент]. Никаких лишних нулей!' },
        { type: 'heading', value: 'Тот же граф, но списком' },
        { type: 'code', language: 'java', value: '// Граф:\n//  0 -- 1\n//  |    |\n//  3 -- 2\n//\n// Список смежности:\n// 0: [1, 3]   (вершина 0 соединена с 1 и 3)\n// 1: [0, 2]   (вершина 1 соединена с 0 и 2)\n// 2: [1, 3]   (вершина 2 соединена с 1 и 3)\n// 3: [0, 2]   (вершина 3 соединена с 0 и 2)\n//\n// Всего 8 элементов вместо 16 в матрице (4x4)!' },
        { type: 'heading', value: 'Реализация списка смежности на Java' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class GraphList {\n    private int vertices;\n    private List<List<Integer>> adjList;  // список списков\n\n    public GraphList(int vertices) {\n        this.vertices = vertices;\n        adjList = new ArrayList<>();\n        for (int i = 0; i < vertices; i++) {\n            adjList.add(new ArrayList<>());  // для каждой вершины — пустой список\n        }\n    }\n\n    // Добавить неориентированное ребро\n    public void addEdge(int u, int v) {\n        adjList.get(u).add(v);\n        adjList.get(v).add(u);\n    }\n\n    // Получить соседей вершины\n    public List<Integer> getNeighbors(int v) {\n        return adjList.get(v);\n    }\n\n    // Вывести граф\n    public void printGraph() {\n        for (int i = 0; i < vertices; i++) {\n            System.out.print(i + " -> ");\n            System.out.println(adjList.get(i));\n        }\n    }\n\n    public static void main(String[] args) {\n        GraphList g = new GraphList(4);\n        g.addEdge(0, 1);\n        g.addEdge(0, 3);\n        g.addEdge(1, 2);\n        g.addEdge(2, 3);\n        g.printGraph();\n        System.out.println("Соседи вершины 0: " + g.getNeighbors(0));\n    }\n}\n// Вывод:\n// 0 -> [1, 3]\n// 1 -> [0, 2]\n// 2 -> [1, 3]\n// 3 -> [0, 2]\n// Соседи вершины 0: [1, 3]' },
        { type: 'list', items: [
          'Плюсы: O(V + E) памяти — только реальные рёбра. Для 10000 городов с 50000 дорогами — всего 60000 элементов!',
          'Минусы: O(degree) для проверки наличия ребра (нужно просмотреть список)',
          'Подходит для: разреженных графов (реальные карты, социальные сети)'
        ]},
        { type: 'note', value: 'Большинство реальных графов разреженные. Социальная сеть с 1 млрд пользователей — у каждого в среднем 300 друзей. Матрица смежности заняла бы 10^18 ячеек! Список смежности — всего ~300 млрд элементов.' }
      ]
    },
    {
      id: 6,
      title: 'Взвешенный граф: полная реализация',
      type: 'theory',
      content: [
        { type: 'text', value: 'На практике рёбра часто имеют вес. Для взвешенного графа в списке смежности хранят пары (сосед, вес). В Java для этого создают вспомогательный класс или используют массивы.' },
        { type: 'heading', value: 'Класс Edge и взвешенный список смежности' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class WeightedGraph {\n\n    // Вспомогательный класс для хранения ребра с весом\n    static class Edge {\n        int to;      // куда ведёт ребро\n        int weight;  // вес ребра\n\n        Edge(int to, int weight) {\n            this.to = to;\n            this.weight = weight;\n        }\n\n        public String toString() {\n            return "(" + to + ", вес=" + weight + ")";\n        }\n    }\n\n    private int vertices;\n    private List<List<Edge>> adjList;\n\n    public WeightedGraph(int vertices) {\n        this.vertices = vertices;\n        adjList = new ArrayList<>();\n        for (int i = 0; i < vertices; i++) {\n            adjList.add(new ArrayList<>());\n        }\n    }\n\n    // Добавить взвешенное неориентированное ребро\n    public void addEdge(int u, int v, int weight) {\n        adjList.get(u).add(new Edge(v, weight));\n        adjList.get(v).add(new Edge(u, weight));\n    }\n\n    public void printGraph() {\n        for (int i = 0; i < vertices; i++) {\n            System.out.print("Вершина " + i + " -> ");\n            System.out.println(adjList.get(i));\n        }\n    }\n\n    public static void main(String[] args) {\n        WeightedGraph g = new WeightedGraph(5);\n        // Карта городов (расстояние в км)\n        g.addEdge(0, 1, 680);   // Алматы -- Тараз\n        g.addEdge(1, 2, 310);   // Тараз -- Шымкент\n        g.addEdge(2, 4, 720);   // Шымкент -- Актобе\n        g.addEdge(0, 3, 1300);  // Алматы -- Астана\n        g.addEdge(3, 4, 1500);  // Астана -- Актобе\n        g.printGraph();\n    }\n}\n// Вывод:\n// Вершина 0 -> [(1, вес=680), (3, вес=1300)]\n// Вершина 1 -> [(0, вес=680), (2, вес=310)]\n// Вершина 2 -> [(1, вес=310), (4, вес=720)]\n// Вершина 3 -> [(0, вес=1300), (4, вес=1500)]\n// Вершина 4 -> [(2, вес=720), (3, вес=1500)]' },
        { type: 'heading', value: 'Сравнение: матрица vs список' },
        { type: 'code', language: 'java', value: '// Матрица смежности:\n// - Проверка ребра (u,v): O(1)  -> matrix[u][v]\n// - Список соседей: O(V)        -> перебрать всю строку\n// - Память: O(V^2)              -> всегда V*V ячеек\n//\n// Список смежности:\n// - Проверка ребра (u,v): O(degree(u))  -> перебрать список\n// - Список соседей: O(degree(u))        -> сам список\n// - Память: O(V + E)                    -> вершины + рёбра\n//\n// Совет: если E близко к V^2 — матрица.\n//        если E << V^2 — список (почти всегда в реальных задачах).' },
        { type: 'tip', value: 'Для конкурсных задач и большинства интервью используй список смежности с ArrayList. Это стандартное решение, которое работает для 99% задач на графах.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Построй граф городов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй класс Graph, используя список смежности. Создай граф из 6 вершин (города Казахстана) и добавь рёбра. Реализуй метод degree(v) для подсчёта степени вершины и метод hasPath(u, v) (проверка: являются ли u и v соседями).',
      requirements: [
        'Использовать List<List<Integer>> для хранения графа',
        'Метод addEdge(u, v) добавляет неориентированное ребро',
        'Метод degree(v) возвращает степень вершины (количество соседей)',
        'Метод hasEdge(u, v) проверяет наличие ребра между u и v',
        'Метод printGraph() красиво выводит список смежности',
        'Создать граф: 0-Алматы, 1-Тараз, 2-Шымкент, 3-Астана, 4-Актобе, 5-Атырау. Рёбра: 0-1, 1-2, 0-3, 3-4, 4-5, 2-4'
      ],
      expectedOutput: '0 (Алматы) -> [1, 3]\n1 (Тараз) -> [0, 2]\n2 (Шымкент) -> [1, 4]\n3 (Астана) -> [0, 4]\n4 (Актобе) -> [3, 5, 2]\n5 (Атырау) -> [4]\nСтепень Алматы: 2\nСтепень Актобе: 3\nЕсть ребро 0-1? true\nЕсть ребро 0-5? false',
      hint: 'degree(v) — это просто adjList.get(v).size(). hasEdge(u, v) — adjList.get(u).contains(v). Не забудь addEdge добавляет в обе стороны.',
      solution: 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n\n    static List<List<Integer>> adjList;\n    static String[] cityNames = {"Алматы", "Тараз", "Шымкент", "Астана", "Актобе", "Атырау"};\n\n    static void initGraph(int n) {\n        adjList = new ArrayList<>();\n        for (int i = 0; i < n; i++) {\n            adjList.add(new ArrayList<>());\n        }\n    }\n\n    static void addEdge(int u, int v) {\n        adjList.get(u).add(v);\n        adjList.get(v).add(u);\n    }\n\n    static int degree(int v) {\n        return adjList.get(v).size();\n    }\n\n    static boolean hasEdge(int u, int v) {\n        return adjList.get(u).contains(v);\n    }\n\n    static void printGraph() {\n        for (int i = 0; i < adjList.size(); i++) {\n            System.out.println(i + " (" + cityNames[i] + ") -> " + adjList.get(i));\n        }\n    }\n\n    public static void main(String[] args) {\n        initGraph(6);\n        addEdge(0, 1);\n        addEdge(1, 2);\n        addEdge(0, 3);\n        addEdge(3, 4);\n        addEdge(4, 5);\n        addEdge(2, 4);\n        printGraph();\n        System.out.println("Степень Алматы: " + degree(0));\n        System.out.println("Степень Актобе: " + degree(4));\n        System.out.println("Есть ребро 0-1? " + hasEdge(0, 1));\n        System.out.println("Есть ребро 0-5? " + hasEdge(0, 5));\n    }\n}',
      explanation: 'initGraph создаёт V пустых списков. addEdge добавляет v в список u и u в список v — граф неориентированный. degree — это размер списка соседей. hasEdge использует contains для поиска в списке. Сложность: O(V+E) памяти, O(1) для degree, O(degree) для hasEdge.'
    }
  ]
}
