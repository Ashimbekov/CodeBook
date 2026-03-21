export default {
  id: 19,
  title: 'Алгоритм Дейкстры',
  description: 'Кратчайший путь во взвешенном графе — идея GPS-навигации, приоритетная очередь, пошаговая реализация на Java',
  lessons: [
    {
      id: 1,
      title: 'Задача о кратчайшем пути',
      type: 'theory',
      content: [
        { type: 'text', value: 'Алгоритм Дейкстры решает задачу: найти кратчайший путь от одной вершины до всех остальных во взвешенном графе с неотрицательными весами рёбер.' },
        { type: 'tip', value: 'Ты открываешь Google Maps и вводишь "Как добраться до аэропорта?". Приложение знает карту города — это взвешенный граф: улицы с расстояниями. Оно находит маршрут с наименьшей суммой километров. Это и есть Дейкстра! Эдсгер Дейкстра придумал этот алгоритм в 1956 году за 20 минут в кафе.' },
        { type: 'heading', value: 'Пример: граф дорог' },
        { type: 'code', language: 'java', value: '//         (4)\n//    A --------- B\n//    |\\          |\n//   (2)\\(7)      |(1)\n//    |  \\        |\n//    C   D -----E\n//        (3)\n//\n// Рёбра (A=0, B=1, C=2, D=3, E=4):\n// A-B: 4, A-C: 2, A-D: 7\n// B-E: 1, D-E: 3\n//\n// Кратчайшие пути из A:\n// A -> B: 4 (прямо)\n// A -> C: 2 (прямо)\n// A -> D: 7 (прямо) или 4+1+3=8 через B,E — лучше 7\n// A -> E: 4+1=5 (через B) или 7+3=10 — лучше 5' },
        { type: 'text', value: 'BFS решал кратчайший путь по количеству рёбер (невзвешенный). Дейкстра решает для взвешенного графа — минимальная сумма весов.' },
        { type: 'list', items: [
          'GPS и навигационные системы (Google Maps, Яндекс)',
          'Сетевая маршрутизация (алгоритм OSPF в интернет-роутерах)',
          'Авиабилеты — найти самый дешёвый маршрут с пересадками',
          'Игры — поиск пути персонажа по карте'
        ]}
      ]
    },
    {
      id: 2,
      title: 'Идея алгоритма Дейкстры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Дейкстра работает жадно: на каждом шаге берёт вершину с минимальным известным расстоянием от старта и "расслабляет" (relaxes) её рёбра — обновляет расстояния до соседей.' },
        { type: 'tip', value: 'Представь, что ты расставляешь флажки на карте: сначала флажок "расстояние 0" стоит у старта. Потом смотришь всех соседей и ставишь им флажки с расстояниями. Всегда выбираешь вершину с НАИМЕНЬШИМ флажком и обновляешь её соседей. Жадный выбор всегда оптимален, потому что расстояния неотрицательны!' },
        { type: 'heading', value: 'Шаги алгоритма' },
        { type: 'list', items: [
          'Шаг 1: dist[start] = 0, все остальные dist[v] = +Infinity',
          'Шаг 2: Выбери вершину u с минимальным dist[u] среди непосещённых',
          'Шаг 3: Пометь u как посещённую (обрабатывать не будем снова)',
          'Шаг 4: Для каждого соседа v вершины u: если dist[u] + вес(u,v) < dist[v], то dist[v] = dist[u] + вес(u,v)',
          'Шаг 5: Повтори с шага 2, пока все вершины не посещены'
        ]},
        { type: 'heading', value: 'Почему работает? Расслабление рёбер' },
        { type: 'code', language: 'java', value: '// "Relaxation" (расслабление) ребра u->v с весом w:\n//\n// Если dist[u] + w < dist[v] {\n//     dist[v] = dist[u] + w;  // нашли более короткий путь!\n//     parent[v] = u;           // запоминаем откуда пришли\n// }\n//\n// Пример:\n// dist[A] = 0, ребро A->B вес 4:\n// dist[A] + 4 = 4 < dist[B](=infinity) -> dist[B] = 4\n//\n// dist[A] = 0, ребро A->C вес 2:\n// dist[A] + 2 = 2 < dist[C](=infinity) -> dist[C] = 2\n//\n// Обрабатываем C (минимальный): ребро C нет исходящих\n// Обрабатываем B: ребро B->E вес 1:\n// dist[B] + 1 = 5 < dist[E](=infinity) -> dist[E] = 5' }
      ]
    },
    {
      id: 3,
      title: 'Приоритетная очередь в Дейкстре',
      type: 'theory',
      content: [
        { type: 'text', value: 'Выбор вершины с минимальным расстоянием — ключевая операция. Наивный способ — перебирать все вершины O(V). С PriorityQueue (мин-куча) — O(log V). Это делает алгоритм намного быстрее для больших графов.' },
        { type: 'heading', value: 'Дейкстра с PriorityQueue — реализация' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class Dijkstra {\n\n    static class Edge {\n        int to, weight;\n        Edge(int to, int weight) { this.to = to; this.weight = weight; }\n    }\n\n    static int[] dijkstra(List<List<Edge>> graph, int start, int n) {\n        int[] dist = new int[n];\n        Arrays.fill(dist, Integer.MAX_VALUE);  // "бесконечность"\n        dist[start] = 0;\n\n        // PriorityQueue<{расстояние, вершина}>, минимальная куча по расстоянию\n        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n        pq.offer(new int[]{0, start});  // {dist, vertex}\n\n        while (!pq.isEmpty()) {\n            int[] curr = pq.poll();  // берём вершину с минимальным расстоянием\n            int d = curr[0];\n            int u = curr[1];\n\n            // Если уже нашли лучший путь до u — пропускаем\n            if (d > dist[u]) continue;\n\n            // Расслабляем рёбра из u\n            for (Edge edge : graph.get(u)) {\n                int newDist = dist[u] + edge.weight;\n                if (newDist < dist[edge.to]) {\n                    dist[edge.to] = newDist;\n                    pq.offer(new int[]{newDist, edge.to});  // добавляем с новым расстоянием\n                }\n            }\n        }\n\n        return dist;\n    }\n\n    public static void main(String[] args) {\n        int n = 5;  // A=0, B=1, C=2, D=3, E=4\n        List<List<Edge>> graph = new ArrayList<>();\n        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());\n\n        // Добавляем рёбра (неориентированные — обе стороны)\n        graph.get(0).add(new Edge(1, 4));  graph.get(1).add(new Edge(0, 4)); // A-B:4\n        graph.get(0).add(new Edge(2, 2));  graph.get(2).add(new Edge(0, 2)); // A-C:2\n        graph.get(0).add(new Edge(3, 7));  graph.get(3).add(new Edge(0, 7)); // A-D:7\n        graph.get(1).add(new Edge(4, 1));  graph.get(4).add(new Edge(1, 1)); // B-E:1\n        graph.get(3).add(new Edge(4, 3));  graph.get(4).add(new Edge(3, 3)); // D-E:3\n\n        int[] distances = dijkstra(graph, 0, n);\n        String[] names = {"A", "B", "C", "D", "E"};\n        System.out.println("Кратчайшие расстояния из A:");\n        for (int i = 0; i < n; i++) {\n            System.out.println("  A -> " + names[i] + " = " + distances[i]);\n        }\n    }\n}\n// Вывод:\n// Кратчайшие расстояния из A:\n//   A -> A = 0\n//   A -> B = 4\n//   A -> C = 2\n//   A -> D = 7\n//   A -> E = 5' },
        { type: 'note', value: 'Зачем if (d > dist[u]) continue? В PriorityQueue может быть несколько записей для одной вершины (добавляем при каждом улучшении). Когда достаём старую запись с большим расстоянием — пропускаем её, вершина уже обработана оптимально.' }
      ]
    },
    {
      id: 4,
      title: 'Пошаговая трассировка Дейкстры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Проследим алгоритм Дейкстры шаг за шагом на нашем графе. Это поможет понять, почему он всегда даёт правильный ответ.' },
        { type: 'heading', value: 'Граф и начальное состояние' },
        { type: 'code', language: 'java', value: '// Граф: A(0)-B(1): 4, A-C(2): 2, A-D(3): 7, B-E(4): 1, D-E: 3\n//\n// Начало: dist = [0, INF, INF, INF, INF]\n//         PQ = [{0, A}]' },
        { type: 'heading', value: 'Трассировка шаг за шагом' },
        { type: 'code', language: 'java', value: '// ШАГ 1: Извлекаем {0, A} из PQ\n// Обрабатываем A:\n//   Ребро A->B вес 4: 0+4=4 < INF -> dist[B]=4, добавляем {4,B}\n//   Ребро A->C вес 2: 0+2=2 < INF -> dist[C]=2, добавляем {2,C}\n//   Ребро A->D вес 7: 0+7=7 < INF -> dist[D]=7, добавляем {7,D}\n// dist = [0, 4, 2, 7, INF]\n// PQ = [{2,C}, {4,B}, {7,D}]\n\n// ШАГ 2: Извлекаем {2, C} из PQ (минимальный!)\n// Обрабатываем C:\n//   У C нет соседей (в нашем примере)\n// dist = [0, 4, 2, 7, INF]\n// PQ = [{4,B}, {7,D}]\n\n// ШАГ 3: Извлекаем {4, B} из PQ\n// Обрабатываем B:\n//   Ребро B->A вес 4: 4+4=8 > dist[A]=0 -> НЕ обновляем\n//   Ребро B->E вес 1: 4+1=5 < INF -> dist[E]=5, добавляем {5,E}\n// dist = [0, 4, 2, 7, 5]\n// PQ = [{5,E}, {7,D}]\n\n// ШАГ 4: Извлекаем {5, E} из PQ\n// Обрабатываем E:\n//   Ребро E->B вес 1: 5+1=6 > dist[B]=4 -> НЕ обновляем\n//   Ребро E->D вес 3: 5+3=8 > dist[D]=7 -> НЕ обновляем\n// dist = [0, 4, 2, 7, 5]\n// PQ = [{7,D}]\n\n// ШАГ 5: Извлекаем {7, D} из PQ\n// Обрабатываем D:\n//   Ребро D->A вес 7: 7+7=14 > 0 -> НЕ обновляем\n//   Ребро D->E вес 3: 7+3=10 > dist[E]=5 -> НЕ обновляем\n// PQ = [] -> КОНЕЦ!\n//\n// Итоговые расстояния: A=0, B=4, C=2, D=7, E=5 ✓' },
        { type: 'tip', value: 'Дейкстра всегда выбирает вершину с наименьшим расстоянием — это жадный выбор. И он всегда правильный! Если dist[u] уже минимальна и веса неотрицательны, то никакой другой путь не может дать меньше.' }
      ]
    },
    {
      id: 5,
      title: 'Восстановление пути в Дейкстре',
      type: 'theory',
      content: [
        { type: 'text', value: 'Алгоритм находит расстояния, но не сам путь. Чтобы восстановить путь, нужно хранить массив parent — как в BFS.' },
        { type: 'heading', value: 'Дейкстра с восстановлением пути' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class DijkstraPath {\n\n    static class Edge {\n        int to, weight;\n        Edge(int to, int weight) { this.to = to; this.weight = weight; }\n    }\n\n    static int[] dist;\n    static int[] parent;\n\n    static void dijkstra(List<List<Edge>> graph, int start, int n) {\n        dist = new int[n];\n        parent = new int[n];\n        Arrays.fill(dist, Integer.MAX_VALUE);\n        Arrays.fill(parent, -1);\n        dist[start] = 0;\n\n        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n        pq.offer(new int[]{0, start});\n\n        while (!pq.isEmpty()) {\n            int[] curr = pq.poll();\n            int d = curr[0], u = curr[1];\n\n            if (d > dist[u]) continue;\n\n            for (Edge edge : graph.get(u)) {\n                int newDist = dist[u] + edge.weight;\n                if (newDist < dist[edge.to]) {\n                    dist[edge.to] = newDist;\n                    parent[edge.to] = u;  // запоминаем родителя!\n                    pq.offer(new int[]{newDist, edge.to});\n                }\n            }\n        }\n    }\n\n    // Восстановить путь от start до end\n    static List<Integer> getPath(int end) {\n        List<Integer> path = new ArrayList<>();\n        if (dist[end] == Integer.MAX_VALUE) return path;  // нет пути\n\n        for (int v = end; v != -1; v = parent[v]) {\n            path.add(v);\n        }\n        Collections.reverse(path);\n        return path;\n    }\n\n    public static void main(String[] args) {\n        int n = 5;\n        List<List<Edge>> graph = new ArrayList<>();\n        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());\n        graph.get(0).add(new Edge(1, 4));  graph.get(1).add(new Edge(0, 4));\n        graph.get(0).add(new Edge(2, 2));  graph.get(2).add(new Edge(0, 2));\n        graph.get(0).add(new Edge(3, 7));  graph.get(3).add(new Edge(0, 7));\n        graph.get(1).add(new Edge(4, 1));  graph.get(4).add(new Edge(1, 1));\n        graph.get(3).add(new Edge(4, 3));  graph.get(4).add(new Edge(3, 3));\n\n        dijkstra(graph, 0, n);\n\n        System.out.println("A -> E: расстояние " + dist[4] + ", путь " + getPath(4));\n        System.out.println("A -> D: расстояние " + dist[3] + ", путь " + getPath(3));\n    }\n}\n// Вывод:\n// A -> E: расстояние 5, путь [0, 1, 4]\n// A -> D: расстояние 7, путь [0, 3]' },
        { type: 'tip', value: 'getPath работает аналогично BFS: идём от конечной вершины к начальной по цепочке parent[], потом переворачиваем список. parent[start] = -1 — условие остановки.' }
      ]
    },
    {
      id: 6,
      title: 'Ограничения и сложность',
      type: 'theory',
      content: [
        { type: 'text', value: 'Дейкстра мощный, но не всесильный. Его главное ограничение — он не работает с отрицательными весами рёбер. Для этого есть алгоритм Беллмана–Форда.' },
        { type: 'heading', value: 'Почему отрицательные веса ломают Дейкстру?' },
        { type: 'code', language: 'java', value: '// Граф с отрицательным ребром:\n//  A --[2]--> B --[-5]--> C\n//  A --[4]--> C\n//\n// Дейкстра (старт A):\n// Шаг 1: Берём A (dist=0). Обновляем: dist[B]=2, dist[C]=4\n// Шаг 2: Берём B (dist=2). Обновляем: dist[C] = min(4, 2+(-5)) = min(4,-3) = -3\n//         НО! B уже "обработан" -> dist[C]=4 -> ОШИБКА!\n//\n// Дейкстра сказал dist[C]=4, правда dist[C]=-3!\n//\n// Проблема: жадный выбор неверен с отрицательными весами.\n// Обработанную вершину позже нельзя "передумать".' },
        { type: 'heading', value: 'Сложность алгоритма' },
        { type: 'code', language: 'java', value: '// Наивная реализация (перебор всех вершин):\n// O(V^2 + E) = O(V^2) для плотного графа\n//\n// С бинарной кучей (PriorityQueue):\n// O((V + E) * log V)\n// V вершин, каждая добавляется в PQ: V * log V\n// E рёбер, каждое добавляет запись в PQ: E * log V\n// Итого: O((V + E) * log V)\n//\n// Для типичного разреженного графа (E ≈ V):\n// O(V * log V) — очень быстро!\n//\n// Для карты Казахстана (10000 городов, 50000 дорог):\n// ≈ 50000 * log(10000) = 50000 * 14 = 700000 операций\n// Миллисекунды на современном компьютере!' },
        { type: 'list', items: [
          'Работает только с неотрицательными весами',
          'Для отрицательных весов: Беллман–Форд (медленнее, O(V*E))',
          'Для плотных графов (E ≈ V²): наивная реализация O(V²) лучше',
          'Для разреженных (реальные задачи): PriorityQueue-версия O((V+E)logV)'
        ]},
        { type: 'warning', value: 'Никогда не используй Дейкстру с отрицательными весами! Он даст неверный ответ без ошибки — это худший вид бага. Всегда проверяй, что все веса >= 0.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Кратчайший маршрут между городами',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй полный алгоритм Дейкстры для нахождения кратчайшего пути между двумя городами. Граф содержит 6 городов (0-5) и взвешенные рёбра. Программа должна вывести минимальное расстояние и сам маршрут от города 0 до города 5.',
      requirements: [
        'Использовать PriorityQueue для эффективного выбора минимума',
        'Хранить массив parent для восстановления пути',
        'Вывести расстояние от 0 до каждого города',
        'Вывести кратчайший путь от 0 до 5 (список вершин)',
        'Рёбра: 0-1:7, 0-2:9, 0-5:14, 1-2:10, 1-3:15, 2-3:11, 2-5:2, 3-4:6, 4-5:9'
      ],
      expectedOutput: 'Расстояния из вершины 0:\n  до 0: 0\n  до 1: 7\n  до 2: 9\n  до 3: 20\n  до 4: 26\n  до 5: 11\nКратчайший путь 0->5: [0, 2, 5]\nДлина: 11',
      hint: 'Это стандартная задача Дейкстры. Граф классический — "shortest path graph" из учебников. Путь 0->5 через 2 даёт 9+2=11, что лучше прямого 14.',
      solution: 'import java.util.*;\n\npublic class Main {\n\n    static class Edge {\n        int to, weight;\n        Edge(int to, int weight) { this.to = to; this.weight = weight; }\n    }\n\n    static int[] dist;\n    static int[] parent;\n    static int n;\n\n    static void dijkstra(List<List<Edge>> graph, int start) {\n        dist = new int[n];\n        parent = new int[n];\n        Arrays.fill(dist, Integer.MAX_VALUE);\n        Arrays.fill(parent, -1);\n        dist[start] = 0;\n\n        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n        pq.offer(new int[]{0, start});\n\n        while (!pq.isEmpty()) {\n            int[] curr = pq.poll();\n            int d = curr[0], u = curr[1];\n            if (d > dist[u]) continue;\n            for (Edge e : graph.get(u)) {\n                int newDist = dist[u] + e.weight;\n                if (newDist < dist[e.to]) {\n                    dist[e.to] = newDist;\n                    parent[e.to] = u;\n                    pq.offer(new int[]{newDist, e.to});\n                }\n            }\n        }\n    }\n\n    static List<Integer> getPath(int end) {\n        List<Integer> path = new ArrayList<>();\n        for (int v = end; v != -1; v = parent[v]) path.add(v);\n        Collections.reverse(path);\n        return path;\n    }\n\n    public static void main(String[] args) {\n        n = 6;\n        List<List<Edge>> g = new ArrayList<>();\n        for (int i = 0; i < n; i++) g.add(new ArrayList<>());\n\n        int[][] edges = {{0,1,7},{0,2,9},{0,5,14},{1,2,10},{1,3,15},\n                         {2,3,11},{2,5,2},{3,4,6},{4,5,9}};\n        for (int[] e : edges) {\n            g.get(e[0]).add(new Edge(e[1], e[2]));\n            g.get(e[1]).add(new Edge(e[0], e[2]));\n        }\n\n        dijkstra(g, 0);\n\n        System.out.println("Расстояния из вершины 0:");\n        for (int i = 0; i < n; i++)\n            System.out.println("  до " + i + ": " + dist[i]);\n\n        List<Integer> path = getPath(5);\n        System.out.println("Кратчайший путь 0->5: " + path);\n        System.out.println("Длина: " + dist[5]);\n    }\n}',
      explanation: 'Алгоритм Дейкстры с PriorityQueue. Начинаем с dist[0]=0 и INF для остальных. PQ всегда даёт нам вершину с минимальным текущим расстоянием. Для каждой вершины "расслабляем" её рёбра. Проверка d > dist[u] пропускает устаревшие записи в PQ. parent[] позволяет восстановить путь. Сложность: O((V+E) log V). Путь 0->2->5: 9+2=11 оказывается лучше прямого 0->5: 14.'
    }
  ]
}
