export default {
  id: 18,
  title: 'Обход графа: DFS',
  description: 'Поиск в глубину — рекурсия и стек, топологическая сортировка, обнаружение циклов, пошаговая трассировка',
  lessons: [
    {
      id: 1,
      title: 'Что такое DFS?',
      type: 'theory',
      content: [
        { type: 'text', value: 'DFS (Depth-First Search, поиск в глубину) — алгоритм обхода, который идёт как можно глубже по одному пути, прежде чем вернуться назад и попробовать другой. Он исследует граф "вглубь", а не "вширь" как BFS.' },
        { type: 'tip', value: 'Представь, что ты исследуешь лабиринт. Ты идёшь прямо вперёд, пока не упрёшься в тупик. Тогда возвращаешься и пробуешь другой коридор. Потом снова вперёд до упора, снова назад... Это и есть DFS! Алгоритм "не сдаётся" и идёт максимально вглубь по каждому пути.' },
        { type: 'heading', value: 'DFS vs BFS: разный порядок обхода' },
        { type: 'code', language: 'java', value: '// Граф:\n//       0\n//      / \\\n//     1   2\n//    / \\\n//   3   4\n//\n// BFS (ширина): 0, 1, 2, 3, 4   <- уровень за уровнем\n// DFS (глубина): 0, 1, 3, 4, 2  <- идём вглубь по ветке 1->3->4\n//                                    потом возвращаемся к 0 и идём к 2\n//\n// DFS полностью исследует одну ветку прежде чем перейти к другой' },
        { type: 'list', items: [
          'Топологическая сортировка (порядок выполнения зависимых задач)',
          'Обнаружение циклов в графе',
          'Нахождение всех путей между двумя вершинами',
          'Решение задач с backtracking (лабиринты, судоку, N ферзей)',
          'Проверка двудольности графа'
        ]},
        { type: 'note', value: 'DFS использует стек: либо явный (итеративный вариант), либо неявный стек вызовов (рекурсивный вариант). Оба дают одинаковый результат, но порядок обхода соседей может немного отличаться.' }
      ]
    },
    {
      id: 2,
      title: 'Рекурсивный DFS',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рекурсивный DFS — самый простой и элегантный вариант. Метод вызывает сам себя для каждого непосещённого соседа. Стек вызовов Java автоматически хранит "обратный путь".' },
        { type: 'heading', value: 'Рекурсивный DFS — реализация' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class DFS {\n\n    static List<List<Integer>> graph;\n    static int n;\n    static boolean[] visited;\n\n    static void dfsRecursive(int v) {\n        visited[v] = true;\n        System.out.print(v + " ");  // обрабатываем вершину\n\n        for (int neighbor : graph.get(v)) {\n            if (!visited[neighbor]) {\n                dfsRecursive(neighbor);  // идём глубже!\n            }\n        }\n        // После возврата из рекурсии — все потомки v посещены\n    }\n\n    public static void main(String[] args) {\n        n = 6;\n        graph = new ArrayList<>();\n        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());\n\n        //    0\n        //   / \\\n        //  1   2\n        // / \\   \\\n        //3   4   5\n        graph.get(0).add(1); graph.get(1).add(0);\n        graph.get(0).add(2); graph.get(2).add(0);\n        graph.get(1).add(3); graph.get(3).add(1);\n        graph.get(1).add(4); graph.get(4).add(1);\n        graph.get(2).add(5); graph.get(5).add(2);\n\n        visited = new boolean[n];\n        System.out.print("DFS (рекурсивный): ");\n        dfsRecursive(0);\n        System.out.println();\n    }\n}\n// Вывод:\n// DFS (рекурсивный): 0 1 3 4 2 5' },
        { type: 'heading', value: 'Пошаговая трассировка' },
        { type: 'code', language: 'java', value: '// dfsRecursive(0): посещаем 0, соседи [1,2]\n//   -> dfsRecursive(1): посещаем 1, соседи [0,3,4]\n//      0 посещён, пропускаем\n//      -> dfsRecursive(3): посещаем 3, соседи [1]\n//         1 посещён, пропускаем\n//         <- возврат из 3\n//      -> dfsRecursive(4): посещаем 4, соседи [1]\n//         1 посещён, пропускаем\n//         <- возврат из 4\n//      <- возврат из 1\n//   -> dfsRecursive(2): посещаем 2, соседи [0,5]\n//      0 посещён, пропускаем\n//      -> dfsRecursive(5): посещаем 5, соседи [2]\n//         2 посещён, пропускаем\n//         <- возврат из 5\n//      <- возврат из 2\n// <- возврат из 0\n//\n// Итог: 0 1 3 4 2 5' },
        { type: 'warning', value: 'Рекурсивный DFS использует стек вызовов. Для очень глубоких графов (>10000 вершин в цепочке) Java выбросит StackOverflowError. В таких случаях используй итеративный DFS.' }
      ]
    },
    {
      id: 3,
      title: 'Итеративный DFS со стеком',
      type: 'theory',
      content: [
        { type: 'text', value: 'Итеративный DFS использует явный стек (Stack или Deque). Мы сами управляем стеком вместо стека вызовов Java. Алгоритм: кладём стартовую вершину в стек, берём с вершины стека, добавляем непосещённых соседей.' },
        { type: 'heading', value: 'Итеративный DFS — реализация' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class DFSIterative {\n\n    static void dfsIterative(List<List<Integer>> graph, int start, int n) {\n        boolean[] visited = new boolean[n];\n        Deque<Integer> stack = new ArrayDeque<>();  // используем как стек\n\n        stack.push(start);\n\n        System.out.print("DFS (итеративный): ");\n\n        while (!stack.isEmpty()) {\n            int current = stack.pop();  // берём с вершины стека\n\n            if (visited[current]) continue;  // уже посещали\n            visited[current] = true;\n            System.out.print(current + " ");\n\n            // Добавляем соседей в стек (в обратном порядке для правильного порядка обхода)\n            List<Integer> neighbors = graph.get(current);\n            for (int i = neighbors.size() - 1; i >= 0; i--) {\n                int neighbor = neighbors.get(i);\n                if (!visited[neighbor]) {\n                    stack.push(neighbor);\n                }\n            }\n        }\n        System.out.println();\n    }\n}' },
        { type: 'heading', value: 'Трассировка итеративного DFS' },
        { type: 'code', language: 'java', value: '// Граф: 0->(1,2), 1->(0,3,4), 2->(0,5)\n// Стартуем с 0:\n//\n// Стек: [0]\n// pop(0), visited[0]=true, вывод: 0\n// Соседи 0: [1,2] -> добавляем в обратном порядке: push(2), push(1)\n// Стек: [2, 1]\n//\n// pop(1), visited[1]=true, вывод: 1\n// Соседи 1: [0,3,4] -> 0 посещён, добавляем 4, 3\n// Стек: [2, 4, 3]\n//\n// pop(3), visited[3]=true, вывод: 3\n// Соседи 3: [1] -> 1 посещён, ничего\n// Стек: [2, 4]\n//\n// pop(4), visited[4]=true, вывод: 4\n// Стек: [2]\n//\n// pop(2), visited[2]=true, вывод: 2\n// Соседи 2: [0,5] -> 0 посещён, добавляем 5\n// Стек: [5]\n//\n// pop(5), visited[5]=true, вывод: 5\n// Стек: [] -> конец!\n//\n// Итог: 0 1 3 4 2 5' },
        { type: 'tip', value: 'Почему добавляем соседей в обратном порядке? Стек — LIFO. Если соседи [1, 2], мы хотим сначала посетить 1. Значит 1 должен быть на вершине стека, то есть добавляться последним. Добавляем 2, потом 1 — стек [2, 1] — снимаем 1 первым.' }
      ]
    },
    {
      id: 4,
      title: 'Топологическая сортировка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Топологическая сортировка — это линейный порядок вершин ориентированного ациклического графа (DAG), где для каждого ребра u->v, u стоит перед v в порядке.' },
        { type: 'tip', value: 'Представь учебный план: курс "Java" требует "ООП", "ООП" требует "Программирование основы". Нельзя учить Java до ООП! Топологическая сортировка даёт правильный порядок изучения предметов.' },
        { type: 'heading', value: 'Топосортировка через DFS' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class TopologicalSort {\n\n    static List<List<Integer>> graph;\n    static int n;\n    static boolean[] visited;\n    static Deque<Integer> result;  // стек результата\n\n    // DFS: после обработки всех потомков — кладём в стек\n    static void dfsTopoSort(int v) {\n        visited[v] = true;\n\n        for (int neighbor : graph.get(v)) {\n            if (!visited[neighbor]) {\n                dfsTopoSort(neighbor);\n            }\n        }\n\n        result.push(v);  // добавляем ПОСЛЕ обработки всех потомков\n    }\n\n    static List<Integer> topologicalSort() {\n        visited = new boolean[n];\n        result = new ArrayDeque<>();\n\n        for (int i = 0; i < n; i++) {\n            if (!visited[i]) dfsTopoSort(i);\n        }\n\n        return new ArrayList<>(result);  // стек -> список\n    }\n\n    public static void main(String[] args) {\n        // Граф задач:\n        // 5 -> 0  (задача 5 должна быть выполнена до 0)\n        // 5 -> 2\n        // 4 -> 0\n        // 4 -> 1\n        // 2 -> 3\n        // 3 -> 1\n        n = 6;\n        graph = new ArrayList<>();\n        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());\n\n        graph.get(5).add(0);\n        graph.get(5).add(2);\n        graph.get(4).add(0);\n        graph.get(4).add(1);\n        graph.get(2).add(3);\n        graph.get(3).add(1);\n\n        System.out.println("Топосортировка: " + topologicalSort());\n        // Возможные правильные ответы: [4, 5, 2, 3, 1, 0] или [5, 4, 2, 3, 0, 1] и т.д.\n    }\n}' },
        { type: 'code', language: 'java', value: '// Почему добавляем в стек ПОСЛЕ рекурсии?\n// DFS для вершины 5:\n//   -> DFS(0): посещаем 0, нет соседей -> push(0)\n//   -> DFS(2): посещаем 2\n//     -> DFS(3): посещаем 3\n//       -> DFS(1): посещаем 1, нет непосещённых -> push(1)\n//       <- push(3)\n//     <- push(2)\n//   <- push(5)\n// Стек (дно->верх): [0, 1, 3, 2, 5]\n// Читаем сверху: 5, 2, 3, 1, 0 — правильный порядок!\n// 5 раньше 0 и 2 ✓, 2 раньше 3 ✓, 3 раньше 1 ✓' },
        { type: 'note', value: 'Топологическая сортировка работает ТОЛЬКО на DAG (ориентированный граф без циклов). Если в графе есть цикл, то правильного линейного порядка не существует — зависимости взаимны.' }
      ]
    },
    {
      id: 5,
      title: 'Обнаружение цикла в графе',
      type: 'theory',
      content: [
        { type: 'text', value: 'DFS позволяет определить, есть ли в графе цикл. В ориентированном графе — отслеживаем текущий путь DFS (recStack). В неориентированном — следим, что не идём назад к родителю.' },
        { type: 'heading', value: 'Обнаружение цикла в ориентированном графе' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class CycleDetection {\n\n    static List<List<Integer>> graph;\n    static int n;\n    static boolean[] visited;\n    static boolean[] recStack;  // вершины на текущем пути DFS\n\n    // Возвращает true если нашли цикл\n    static boolean dfsHasCycle(int v) {\n        visited[v] = true;\n        recStack[v] = true;  // добавляем в текущий путь\n\n        for (int neighbor : graph.get(v)) {\n            if (!visited[neighbor]) {\n                if (dfsHasCycle(neighbor)) return true;\n            } else if (recStack[neighbor]) {\n                // Нашли вершину из текущего пути -> цикл!\n                return true;\n            }\n        }\n\n        recStack[v] = false;  // убираем из текущего пути при возврате\n        return false;\n    }\n\n    static boolean hasCycle() {\n        visited = new boolean[n];\n        recStack = new boolean[n];\n\n        for (int i = 0; i < n; i++) {\n            if (!visited[i]) {\n                if (dfsHasCycle(i)) return true;\n            }\n        }\n        return false;\n    }\n\n    public static void main(String[] args) {\n        n = 4;\n        graph = new ArrayList<>();\n        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());\n\n        // Граф с циклом: 0->1->2->0\n        graph.get(0).add(1);\n        graph.get(1).add(2);\n        graph.get(2).add(0);\n        graph.get(2).add(3);\n\n        System.out.println("Есть цикл? " + hasCycle());  // true\n\n        // Граф без цикла\n        n = 4;\n        graph = new ArrayList<>();\n        for (int i = 0; i < n; i++) graph.add(new ArrayList<>());\n        graph.get(0).add(1);\n        graph.get(0).add(2);\n        graph.get(1).add(3);\n\n        System.out.println("Есть цикл? " + hasCycle());  // false\n    }\n}' },
        { type: 'heading', value: 'Ключевая идея: visited vs recStack' },
        { type: 'code', language: 'java', value: '// visited[v] = true  -> вершина посещена вообще (в любой ветке)\n// recStack[v] = true  -> вершина сейчас на активном пути DFS\n//\n// Цикл = мы встречаем вершину, которая СЕЙЧАС на нашем пути!\n//\n// Пример: путь 0->1->2, видим ребро 2->0\n// visited[0]=true, recStack[0]=true -> ЦИКЛ: 0->1->2->0\n//\n// Если просто visited: ошибочно детектируем цикл в DAG!\n// Граф: 0->1, 0->2, 1->3, 2->3\n// DFS: 0->1->3 (возврат из 3, recStack[3]=false)\n// Потом 2->3: visited[3]=true, но recStack[3]=false -> не цикл!' },
        { type: 'tip', value: 'Ключ к пониманию: recStack — это вершины на ТЕКУЩЕМ активном пути. Когда мы возвращаемся из рекурсии, убираем вершину из recStack. Цикл = нашли вершину, которая ещё в recStack (мы ещё не вернулись из неё!).' }
      ]
    },
    {
      id: 6,
      title: 'Пошаговая трассировка DFS',
      type: 'theory',
      content: [
        { type: 'text', value: 'Разберём DFS подробно на конкретном примере: граф с 5 вершинами. Будем отслеживать стек вызовов, массив visited и порядок обхода.' },
        { type: 'heading', value: 'Граф для трассировки' },
        { type: 'code', language: 'java', value: '// Неориентированный граф:\n// 0 -- 1 -- 3\n// |    |\n// 2    4\n//\n// Список смежности:\n// 0: [1, 2]\n// 1: [0, 3, 4]\n// 2: [0]\n// 3: [1]\n// 4: [1]' },
        { type: 'heading', value: 'Полная трассировка DFS(0)' },
        { type: 'code', language: 'java', value: '// Вызываем dfs(0):\n// visited = [F, F, F, F, F]\n//\n// dfs(0): visited[0]=T, обрабатываем 0\n// visited = [T, F, F, F, F]\n// Соседи 0: [1, 2] -> сначала идём к 1\n//\n//   dfs(1): visited[1]=T, обрабатываем 1\n//   visited = [T, T, F, F, F]\n//   Соседи 1: [0, 3, 4] -> 0 посещён, идём к 3\n//\n//     dfs(3): visited[3]=T, обрабатываем 3\n//     visited = [T, T, F, T, F]\n//     Соседи 3: [1] -> 1 посещён, возвращаемся\n//     <- возврат из dfs(3)\n//\n//   Продолжаем у 1: следующий сосед 4\n//\n//     dfs(4): visited[4]=T, обрабатываем 4\n//     visited = [T, T, F, T, T]\n//     Соседи 4: [1] -> 1 посещён, возвращаемся\n//     <- возврат из dfs(4)\n//\n//   <- возврат из dfs(1)\n//\n// Продолжаем у 0: следующий сосед 2\n//\n//   dfs(2): visited[2]=T, обрабатываем 2\n//   visited = [T, T, T, T, T]\n//   Соседи 2: [0] -> 0 посещён, возвращаемся\n//   <- возврат из dfs(2)\n//\n// <- возврат из dfs(0)\n//\n// Порядок: 0, 1, 3, 4, 2' },
        { type: 'heading', value: 'Время и пространство' },
        { type: 'code', language: 'java', value: '// Временная сложность: O(V + E)\n// Каждую вершину посещаем ровно один раз: O(V)\n// Каждое ребро рассматриваем ровно один раз: O(E)\n// Итого: O(V + E)\n//\n// Пространственная сложность: O(V)\n// Массив visited: O(V)\n// Глубина стека рекурсии: O(V) в худшем случае (цепочка 0->1->2->...->V)\n//\n// Для графа с 1000 вершин и 5000 рёбер: 6000 операций — очень быстро!' },
        { type: 'note', value: 'DFS — предпочтительный алгоритм для топологической сортировки, обнаружения циклов, нахождения мостов и точек сочленения. BFS лучше для кратчайших путей и обхода уровнями.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Топологическая сортировка курсов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Ты составляешь расписание университетских курсов. Каждый курс имеет предварительные требования (prerequisites). Реализуй метод canFinish(int numCourses, int[][] prerequisites), который возвращает true если можно пройти все курсы (нет циклических зависимостей), и метод findOrder(int numCourses, int[][] prerequisites), который возвращает порядок прохождения курсов.',
      requirements: [
        'prerequisites[i] = [a, b] означает: сначала пройди курс b, потом a',
        'canFinish возвращает false если есть цикл в зависимостях',
        'findOrder возвращает массив порядка прохождения или пустой массив если цикл',
        'Использовать DFS с recStack для обнаружения цикла',
        'Использовать постфиксный DFS (topological sort) для порядка'
      ],
      expectedOutput: 'Можно пройти все курсы? true\nПорядок: [0, 1, 3, 2]\nМожно пройти все курсы? false\nПорядок: []',
      hint: 'canFinish — это просто проверка цикла в ориентированном графе. findOrder — это топологическая сортировка. Если при топосортировке находим цикл — возвращаем пустой массив.',
      solution: 'import java.util.*;\n\npublic class Main {\n\n    static List<List<Integer>> graph;\n    static boolean[] visited;\n    static boolean[] recStack;\n    static boolean hasCycle;\n    static Deque<Integer> order;\n\n    static void dfs(int v) {\n        visited[v] = true;\n        recStack[v] = true;\n\n        for (int neighbor : graph.get(v)) {\n            if (!visited[neighbor]) {\n                dfs(neighbor);\n            } else if (recStack[neighbor]) {\n                hasCycle = true;\n                return;\n            }\n            if (hasCycle) return;\n        }\n\n        recStack[v] = false;\n        order.push(v);\n    }\n\n    static boolean canFinish(int numCourses, int[][] prerequisites) {\n        graph = new ArrayList<>();\n        for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());\n        for (int[] pre : prerequisites) graph.get(pre[1]).add(pre[0]);\n\n        visited = new boolean[numCourses];\n        recStack = new boolean[numCourses];\n        hasCycle = false;\n        order = new ArrayDeque<>();\n\n        for (int i = 0; i < numCourses; i++)\n            if (!visited[i]) { dfs(i); if (hasCycle) return false; }\n        return true;\n    }\n\n    static int[] findOrder(int numCourses, int[][] prerequisites) {\n        if (!canFinish(numCourses, prerequisites)) return new int[0];\n        int[] result = new int[numCourses];\n        int idx = 0;\n        while (!order.isEmpty()) result[idx++] = order.pop();\n        return result;\n    }\n\n    public static void main(String[] args) {\n        // 4 курса: 1<-0, 2<-0, 3<-1, 3<-2 (порядок: 0,1,2,3)\n        int[][] pre1 = {{1,0},{2,0},{3,1},{3,2}};\n        System.out.println("Можно пройти все курсы? " + canFinish(4, pre1));\n        System.out.println("Порядок: " + Arrays.toString(findOrder(4, pre1)));\n\n        // Цикл: 0<-1, 1<-0\n        int[][] pre2 = {{1,0},{0,1}};\n        System.out.println("Можно пройти все курсы? " + canFinish(2, pre2));\n        System.out.println("Порядок: " + Arrays.toString(findOrder(2, pre2)));\n    }\n}',
      explanation: 'canFinish строит граф зависимостей и запускает DFS с двумя массивами: visited (вообще посещали) и recStack (сейчас на пути). Если встречаем recStack[neighbor]=true — цикл! findOrder запускает canFinish и извлекает порядок из стека order. Вершины добавляются в стек после обхода всех потомков — это и даёт топологический порядок. Сложность: O(V + E).'
    }
  ]
}
