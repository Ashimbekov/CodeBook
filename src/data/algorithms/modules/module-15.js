export default {
  id: 15,
  title: 'Куча и приоритетная очередь',
  description: 'Куча — дерево с особым свойством порядка. Изучаем min-heap и max-heap, представление массивом, heapify, вставку и извлечение, PriorityQueue в Java и идею сортировки кучей.',
  lessons: [
    {
      id: 1,
      title: 'Что такое куча — аналогия с турниром',
      type: 'theory',
      content: [
        { type: 'text', value: 'Куча (Heap) — это специальное бинарное дерево, где родитель всегда "лучше" своих детей. В max-heap "лучше" значит больше. В min-heap — меньше. Самый "лучший" элемент всегда в корне.' },
        { type: 'tip', value: 'Представь турнир по теннису. Победитель матча поднимается выше по турнирной сетке. В итоге самый сильный игрок оказывается на вершине (в финале). Max-heap — это как такая турнирная сетка: самый большой элемент всегда наверху.' },
        { type: 'heading', value: 'Max-Heap и Min-Heap' },
        { type: 'code', language: 'java', value: '// MAX-HEAP: каждый родитель >= своих детей\n//\n//         100          ← максимум всегда в корне!\n//        /    \\\n//       80     90\n//      /  \\   /  \\\n//     50  60 70   85\n\n// Свойство: parent >= child (для КАЖДОГО узла)\n// 100 >= 80 ✓, 100 >= 90 ✓\n// 80 >= 50 ✓, 80 >= 60 ✓\n// 90 >= 70 ✓, 90 >= 85 ✓\n\n// MIN-HEAP: каждый родитель <= своих детей\n//\n//         1            ← минимум всегда в корне!\n//        / \\\n//       3   2\n//      / \\ / \\\n//     5  4 8   6\n\n// Свойство: parent <= child\n// 1 <= 3 ✓, 1 <= 2 ✓\n// 3 <= 5 ✓, 3 <= 4 ✓\n// 2 <= 8 ✓, 2 <= 6 ✓' },
        { type: 'heading', value: 'Важное ограничение кучи' },
        { type: 'text', value: 'Куча — НЕ дерево поиска (BST). У кучи нет порядка между левым и правым ребёнком, и нет отношения порядка между узлами на одном уровне. Единственное правило: каждый родитель лучше (больше/меньше) своих детей. Куча используется для быстрого получения максимума/минимума.' },
        { type: 'list', items: [
          'Получить max (в max-heap): O(1) — он всегда в корне',
          'Вставка нового элемента: O(log n)',
          'Удаление максимума: O(log n)',
          'Построение кучи из массива: O(n) — линейное время!'
        ]}
      ]
    },
    {
      id: 2,
      title: 'Представление кучи массивом',
      type: 'theory',
      content: [
        { type: 'text', value: 'Куча — "полное" бинарное дерево (все уровни заполнены слева). Благодаря этому её можно хранить в обычном массиве без указателей! Связь между индексами выводится математически.' },
        { type: 'heading', value: 'Формулы индексов' },
        { type: 'code', language: 'java', value: '// Куча хранится в массиве, начиная с индекса 0:\n//\n//         100    index 0\n//        /    \\\n//       80     90   index 1, 2\n//      /  \\   /  \\\n//     50  60 70  85  index 3,4,5,6\n\n// Массив: [100, 80, 90, 50, 60, 70, 85]\n//           0   1   2   3   4   5   6\n\n// Формулы для узла с индексом i:\n// Родитель: (i - 1) / 2  (целочисленное деление)\n// Левый ребёнок:  2*i + 1\n// Правый ребёнок: 2*i + 2\n\n// Проверка:\n// Узел 80 (i=1): родитель = (1-1)/2 = 0 → 100 ✓\n//               левый = 2*1+1 = 3  → 50 ✓\n//               правый = 2*1+2 = 4 → 60 ✓\n\n// Узел 90 (i=2): родитель = (2-1)/2 = 0 → 100 ✓\n//               левый = 2*2+1 = 5  → 70 ✓\n//               правый = 2*2+2 = 6 → 85 ✓\n\nint parent(int i) { return (i - 1) / 2; }\nint leftChild(int i) { return 2 * i + 1; }\nint rightChild(int i) { return 2 * i + 2; }' },
        { type: 'heading', value: 'Преимущества массива' },
        { type: 'list', items: [
          'Нет накладных расходов на указатели (left, right в Node)',
          'Отличная кэш-локальность: все данные рядом в памяти',
          'Лёгкий доступ к родителю за O(1) — важно при heapify-up',
          'Для полного бинарного дерева с n узлами: листья на позициях n/2 ... n-1'
        ]},
        { type: 'tip', value: 'Это единственная структура данных, где мы храним дерево в массиве! Это возможно именно потому, что куча — полное бинарное дерево: в нём никогда нет "пробелов" на уровнях (кроме возможно последнего, где заполняется слева).' }
      ]
    },
    {
      id: 3,
      title: 'Heapify Up — вставка элемента',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вставка в кучу: добавляем элемент в конец массива (следующее свободное место), а затем "всплываем" вверх, пока свойство кучи не восстановится. Этот процесс называется sift up или heapify up.' },
        { type: 'tip', value: 'Новый элемент — как новый участник турнира. Он начинает с нижней позиции и побеждает (меняется с родителем) до тех пор, пока не встретит кого-то сильнее. Тогда он останавливается.' },
        { type: 'heading', value: 'Реализация вставки в Max-Heap' },
        { type: 'code', language: 'java', value: 'class MaxHeap {\n    private int[] heap;\n    private int size;\n\n    MaxHeap(int capacity) {\n        heap = new int[capacity];\n        size = 0;\n    }\n\n    void insert(int value) {\n        if (size >= heap.length) throw new RuntimeException("Куча заполнена");\n\n        heap[size] = value;  // ставим в конец\n        size++;\n        siftUp(size - 1);    // "всплываем" вверх\n    }\n\n    private void siftUp(int i) {\n        while (i > 0) {\n            int parentIdx = (i - 1) / 2;\n            if (heap[i] > heap[parentIdx]) {\n                // Ребёнок больше родителя — меняем местами\n                int temp = heap[i];\n                heap[i] = heap[parentIdx];\n                heap[parentIdx] = temp;\n                i = parentIdx;  // поднимаемся выше\n            } else {\n                break;  // порядок восстановлен\n            }\n        }\n    }\n}' },
        { type: 'heading', value: 'Трассировка: вставка 95 в кучу [100, 80, 90]' },
        { type: 'code', language: 'java', value: '// Начало: heap = [100, 80, 90], size=3\n//          100\n//         /   \\\n//        80    90\n\n// insert(95):\n// Шаг 1: heap = [100, 80, 90, 95], size=4\n//         100\n//        /   \\\n//       80    90\n//      /\n//     95\n\n// siftUp(3):\n// i=3, parent=(3-1)/2=1\n// heap[3]=95 > heap[1]=80 → меняем!\n// heap = [100, 95, 90, 80], i=1\n\n// i=1, parent=(1-1)/2=0\n// heap[1]=95 < heap[0]=100 → СТОП\n\n// Результат:\n//         100\n//        /   \\\n//       95    90\n//      /\n//     80\n\n// Свойство кучи восстановлено!\n// 100 >= 95 ✓, 100 >= 90 ✓, 95 >= 80 ✓' }
      ]
    },
    {
      id: 4,
      title: 'Heapify Down — извлечение максимума',
      type: 'theory',
      content: [
        { type: 'text', value: 'Извлечение максимума (корня): берём корень (это и есть максимум), ставим на его место последний элемент, уменьшаем размер, затем "тонем" вниз (sift down), пока свойство не восстановится.' },
        { type: 'tip', value: 'Убрали чемпиона из турнира? Временно назначаем "слабейшего запасного" чемпионом (последний элемент в корень). Потом он проигрывает матчи и опускается на своё настоящее место.' },
        { type: 'heading', value: 'Реализация извлечения максимума' },
        { type: 'code', language: 'java', value: 'int extractMax() {\n    if (size == 0) throw new RuntimeException("Куча пустая");\n\n    int max = heap[0];           // сохраняем максимум\n    heap[0] = heap[size - 1];   // последний → в корень\n    size--;                      // уменьшаем размер\n    siftDown(0);                 // "тонем" вниз\n    return max;\n}\n\nprivate void siftDown(int i) {\n    while (true) {\n        int left  = 2 * i + 1;\n        int right = 2 * i + 2;\n        int largest = i;  // предполагаем, что i — наибольший\n\n        // Проверяем левого ребёнка\n        if (left < size && heap[left] > heap[largest])\n            largest = left;\n\n        // Проверяем правого ребёнка\n        if (right < size && heap[right] > heap[largest])\n            largest = right;\n\n        if (largest == i) break;  // порядок восстановлен\n\n        // Меняем i и largest местами\n        int temp = heap[i];\n        heap[i] = heap[largest];\n        heap[largest] = temp;\n        i = largest;  // продолжаем опускаться\n    }\n}' },
        { type: 'heading', value: 'Трассировка extractMax из [100, 95, 90, 80]' },
        { type: 'code', language: 'java', value: '// heap = [100, 95, 90, 80], size=4\n// extractMax():\n// max = 100\n// heap[0] = heap[3] = 80\n// size = 3\n// heap = [80, 95, 90, (80)], active=[80,95,90]\n\n// siftDown(0):\n// i=0: left=1(95), right=2(90), largest=1 (95>80)\n// меняем 80 и 95: heap=[95, 80, 90]\n// i=1: left=3 (нет, size=3), right=4 (нет) → СТОП\n\n// Результат: [95, 80, 90]\n//      95\n//     /  \\\n//    80   90\n// Свойство кучи восстановлено!\n\n// Сложность: O(log n) — опускаемся не более чем на высоту дерева' }
      ]
    },
    {
      id: 5,
      title: 'PriorityQueue в Java',
      type: 'theory',
      content: [
        { type: 'text', value: 'Java предоставляет готовую реализацию кучи — java.util.PriorityQueue. По умолчанию это min-heap: poll() возвращает наименьший элемент. Для max-heap нужен обратный компаратор.' },
        { type: 'heading', value: 'Основные операции PriorityQueue' },
        { type: 'code', language: 'java', value: 'import java.util.PriorityQueue;\nimport java.util.Collections;\n\n// MIN-HEAP (по умолчанию)\nPriorityQueue<Integer> minHeap = new PriorityQueue<>();\nminHeap.add(5);\nminHeap.add(1);\nminHeap.add(8);\nminHeap.add(3);\n\nSystem.out.println("Min: " + minHeap.peek()); // 1 (смотрим, не удаляем)\nSystem.out.println(minHeap.poll()); // 1 (берём минимум)\nSystem.out.println(minHeap.poll()); // 3\nSystem.out.println(minHeap.poll()); // 5\nSystem.out.println(minHeap.poll()); // 8\n\n// MAX-HEAP: передаём обратный компаратор\nPriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\nmaxHeap.add(5);\nmaxHeap.add(1);\nmaxHeap.add(8);\nmaxHeap.add(3);\n\nSystem.out.println("Max: " + maxHeap.peek());  // 8\nSystem.out.println(maxHeap.poll()); // 8\nSystem.out.println(maxHeap.poll()); // 5' },
        { type: 'heading', value: 'Практическое применение: топ-K элементов' },
        { type: 'code', language: 'java', value: 'import java.util.PriorityQueue;\n\n// Задача: найти 3 наибольших элемента из большого массива\n// Используем min-heap размером K!\npublic static int[] topK(int[] arr, int k) {\n    // Min-heap из k элементов\n    PriorityQueue<Integer> heap = new PriorityQueue<>();\n\n    for (int num : arr) {\n        heap.add(num);\n        if (heap.size() > k) {\n            heap.poll();  // удаляем наименьший\n        }\n        // В heap всегда k наибольших элементов!\n    }\n\n    int[] result = new int[k];\n    for (int i = k - 1; i >= 0; i--) {\n        result[i] = heap.poll();\n    }\n    return result;\n}\n\nint[] arr = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3};\nint[] top3 = topK(arr, 3);\nSystem.out.println(java.util.Arrays.toString(top3)); // [5, 6, 9]\n// Время: O(n log k) — намного лучше O(n log n) сортировки!' },
        { type: 'list', items: [
          'add(element): O(log n) — вставка с sift up',
          'poll(): O(log n) — извлечение min/max с sift down',
          'peek(): O(1) — посмотреть без удаления',
          'size(): O(1)',
          'Построение из коллекции: O(n) — более эффективно чем n раз add()'
        ]}
      ]
    },
    {
      id: 6,
      title: 'Сортировка кучей (Heap Sort)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Heap Sort — алгоритм сортировки на основе кучи. Идея в двух фазах: сначала строим max-heap из массива, потом последовательно извлекаем максимум и кладём в конец. Результат — отсортированный массив.' },
        { type: 'heading', value: 'Фаза 1: Построение кучи (Build Heap)' },
        { type: 'code', language: 'java', value: '// Строим кучу "на месте" в массиве — O(n)\n// Начинаем с последнего не-листового узла: n/2 - 1\n// и идём вверх, вызывая siftDown для каждого\n\nvoid buildHeap(int[] arr) {\n    int n = arr.length;\n    // Листья уже "кучи" сами по себе (size=1)\n    // Начинаем с первого нелистового узла\n    for (int i = n / 2 - 1; i >= 0; i--) {\n        siftDown(arr, n, i);\n    }\n}\n\n// Пример: arr = [3, 1, 6, 5, 2, 4]\n// n=6, начинаем с i=2:\n// Индексы нелистовых: 2, 1, 0\n//\n// i=2 (значение 6): дети 5(ind 5), нет правого\n//   6>5 → нет обмена\n//\n// i=1 (значение 1): дети 5(ind 3), 2(ind 4)\n//   largest=3 (5>1, 5>2) → меняем 1 и 5\n//   arr = [3, 5, 6, 1, 2, 4]\n//\n// i=0 (значение 3): дети 5(ind 1), 6(ind 2)\n//   largest=2 (6>3, 6>5) → меняем 3 и 6\n//   arr = [6, 5, 3, 1, 2, 4]\n//   продолжаем siftDown(0): дети 3(ind 1→теперь 5), 4(ind 2→3)\n//   actually arr = [6, 5, 4, 1, 2, 3]\n// Куча построена: 6 в корне!' },
        { type: 'heading', value: 'Фаза 2: Извлечение и полный Heap Sort' },
        { type: 'code', language: 'java', value: 'void heapSort(int[] arr) {\n    int n = arr.length;\n\n    // Фаза 1: строим max-heap O(n)\n    for (int i = n / 2 - 1; i >= 0; i--)\n        siftDown(arr, n, i);\n\n    // Фаза 2: последовательно извлекаем максимум O(n log n)\n    for (int i = n - 1; i > 0; i--) {\n        // Максимум (корень) ставим в конец отсортированной части\n        int temp = arr[0];\n        arr[0] = arr[i];\n        arr[i] = temp;\n\n        // Восстанавливаем кучу без последнего элемента\n        siftDown(arr, i, 0);\n    }\n}\n\nvoid siftDown(int[] arr, int n, int i) {\n    int largest = i, left = 2*i+1, right = 2*i+2;\n    if (left  < n && arr[left]  > arr[largest]) largest = left;\n    if (right < n && arr[right] > arr[largest]) largest = right;\n    if (largest != i) {\n        int t = arr[i]; arr[i] = arr[largest]; arr[largest] = t;\n        siftDown(arr, n, largest);\n    }\n}\n\nint[] arr = {5, 3, 8, 1, 9, 2};\nheapSort(arr);\nSystem.out.println(java.util.Arrays.toString(arr));\n// [1, 2, 3, 5, 8, 9]' },
        { type: 'list', items: [
          'Heap Sort время: O(n log n) — гарантированно в любом случае',
          'Heap Sort память: O(1) — сортируем "на месте", без доп. массива',
          'Не стабильный: одинаковые элементы могут поменяться местами',
          'Сравнение: Quick Sort O(n log n) средний (O(n²) худший), Merge Sort O(n log n) но O(n) памяти',
          'Heap Sort редко используется на практике из-за плохой кэш-локальности'
        ]}
      ]
    },
    {
      id: 7,
      title: 'Практика: K наименьших элементов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используй PriorityQueue (min-heap) для нахождения K наименьших элементов массива. Нужно вывести 3 наименьших элемента из массива {7, 3, 1, 8, 2, 9, 4, 5} в порядке возрастания.',
      requirements: [
        'Используй java.util.PriorityQueue (min-heap по умолчанию)',
        'Добавь все элементы массива в PriorityQueue',
        'Извлеки k=3 элемента через poll() — они выйдут в порядке возрастания',
        'Выведи каждый извлечённый элемент',
        'Массив: {7, 3, 1, 8, 2, 9, 4, 5}, k=3'
      ],
      expectedOutput: '1-й наименьший: 1\n2-й наименьший: 2\n3-й наименьший: 3',
      hint: 'PriorityQueue в Java — min-heap. Просто добавь все элементы через add(), потом k раз вызови poll() — каждый раз получишь следующий наименьший элемент.',
      solution: 'import java.util.PriorityQueue;\n\npublic class Main {\n    public static void main(String[] args) {\n        int[] arr = {7, 3, 1, 8, 2, 9, 4, 5};\n        int k = 3;\n\n        PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n        for (int num : arr) {\n            minHeap.add(num);\n        }\n\n        for (int i = 1; i <= k; i++) {\n            System.out.println(i + "-й наименьший: " + minHeap.poll());\n        }\n    }\n}',
      explanation: 'PriorityQueue автоматически поддерживает свойство min-heap: peek() и poll() всегда возвращают наименьший элемент. При добавлении каждого элемента выполняется siftUp за O(log n). При poll() — siftDown за O(log n). Итого добавление n элементов — O(n log n), извлечение k — O(k log n). Это элегантнее полной сортировки, когда k << n.'
    }
  ]
}
