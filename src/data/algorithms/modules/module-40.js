export default {
  id: 40,
  title: 'Практикум: Heap задачи',
  description: 'Десять классических задач LeetCode на кучу (Heap) и приоритетную очередь. От Kth Largest до планирования задач и IPO.',
  lessons: [
    {
      id: 1,
      title: 'Kth Largest Element in Array (LeetCode #215)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан целочисленный массив nums и число k. Верните k-й по величине элемент. Это k-й по величине в отсортированном порядке, а не k-й уникальный.',
      requirements: [
        'Реализуйте метод int findKthLargest(int[] nums, int k)',
        'k всегда валиден (1 <= k <= nums.length)',
        'Массив может содержать дубликаты',
        'Решение через min-heap размера k'
      ],
      expectedOutput: 'findKthLargest([3,2,1,5,6,4], 2) -> 5\nfindKthLargest([3,2,3,1,2,4,5,5,6], 4) -> 4',
      hint: 'Min-heap размера k: добавляйте элементы, если размер > k — удаляйте минимум. В конце на вершине min-heap будет k-й наибольший.',
      solution: `import java.util.PriorityQueue;

public class KthLargest {
    public int findKthLargest(int[] nums, int k) {
        // Min-heap размера k
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();

        for (int num : nums) {
            minHeap.offer(num);
            // Поддерживаем размер k
            if (minHeap.size() > k) {
                minHeap.poll(); // удаляем минимум
            }
        }
        // На вершине — k-й наибольший
        return minHeap.peek();
    }

    public static void main(String[] args) {
        KthLargest sol = new KthLargest();
        System.out.println(sol.findKthLargest(new int[]{3,2,1,5,6,4}, 2));         // 5
        System.out.println(sol.findKthLargest(new int[]{3,2,3,1,2,4,5,5,6}, 4));   // 4
    }
}`,
      explanation: 'Min-heap размера k хранит k наибольших элементов. При добавлении: если размер > k — удаляем минимум (он точно не в top-k). В конце вершина min-heap = k-й наибольший. Время O(n log k), память O(k). Альтернатива: QuickSelect O(n) в среднем.'
    },
    {
      id: 2,
      title: 'Top K Frequent Elements (LeetCode #347)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан целочисленный массив nums и число k. Верните k самых частых элементов. Ответ может быть в любом порядке.',
      requirements: [
        'Реализуйте метод int[] topKFrequent(int[] nums, int k)',
        'Используйте min-heap по частоте',
        'Гарантируется уникальный ответ',
        'Решение лучше O(n log n)'
      ],
      expectedOutput: 'topKFrequent([1,1,1,2,2,3], 2) -> [1,2]\ntopKFrequent([1], 1) -> [1]',
      hint: 'Посчитайте частоты через HashMap. Затем используйте min-heap размера k по частоте: добавляйте пары (число, частота), при size > k удаляйте минимум.',
      solution: `import java.util.*;

public class TopKFrequentHeap {
    public int[] topKFrequent(int[] nums, int k) {
        // Шаг 1: подсчёт частот
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.merge(num, 1, Integer::sum);
        }

        // Шаг 2: min-heap размера k по частоте
        PriorityQueue<Map.Entry<Integer, Integer>> minHeap =
            new PriorityQueue<>((a, b) -> a.getValue() - b.getValue());

        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            minHeap.offer(entry);
            if (minHeap.size() > k) {
                minHeap.poll(); // удаляем наименее частый
            }
        }

        // Шаг 3: собираем результат
        int[] result = new int[k];
        for (int i = 0; i < k; i++) {
            result[i] = minHeap.poll().getKey();
        }
        return result;
    }

    public static void main(String[] args) {
        TopKFrequentHeap sol = new TopKFrequentHeap();
        System.out.println(Arrays.toString(sol.topKFrequent(new int[]{1,1,1,2,2,3}, 2))); // [2, 1]
        System.out.println(Arrays.toString(sol.topKFrequent(new int[]{1}, 1))); // [1]
    }
}`,
      explanation: 'HashMap для частот + min-heap размера k. Heap хранит k самых частых: при переполнении удаляем наименее частый. В итоге в heap остаются top-k. Время O(n log k) — лучше O(n log n). Альтернатива — bucket sort за O(n) из предыдущего модуля.'
    },
    {
      id: 3,
      title: 'Merge K Sorted Lists (LeetCode #23)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив из k отсортированных связных списков. Слейте их в один отсортированный список используя PriorityQueue.',
      requirements: [
        'Реализуйте метод ListNode mergeKLists(ListNode[] lists)',
        'Используйте min-heap для выбора минимального элемента',
        'Все списки отсортированы по возрастанию',
        'В heap всегда максимум k элементов'
      ],
      expectedOutput: 'mergeKLists([[1,4,5],[1,3,4],[2,6]]) -> [1,1,2,3,4,4,5,6]\nmergeKLists([]) -> []',
      hint: 'Положите head каждого списка в min-heap. Извлекайте минимум, добавляйте в результат. Если у извлечённого узла есть next — кладите обратно.',
      solution: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class MergeKLists {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;

        // Min-heap: сравниваем узлы по значению
        PriorityQueue<ListNode> heap = new PriorityQueue<>(
            (a, b) -> a.val - b.val
        );

        // Добавляем head каждого непустого списка
        for (ListNode head : lists) {
            if (head != null) heap.offer(head);
        }

        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;

        while (!heap.isEmpty()) {
            ListNode min = heap.poll();
            tail.next = min;
            tail = tail.next;

            // Добавляем следующий узел из того же списка
            if (min.next != null) {
                heap.offer(min.next);
            }
        }

        return dummy.next;
    }

    public static void main(String[] args) {
        MergeKLists sol = new MergeKLists();
        ListNode l1 = new ListNode(1);
        l1.next = new ListNode(4);
        l1.next.next = new ListNode(5);

        ListNode l2 = new ListNode(1);
        l2.next = new ListNode(3);
        l2.next.next = new ListNode(4);

        ListNode l3 = new ListNode(2);
        l3.next = new ListNode(6);

        ListNode result = sol.mergeKLists(new ListNode[]{l1, l2, l3});
        while (result != null) {
            System.out.print(result.val + " "); // 1 1 2 3 4 4 5 6
            result = result.next;
        }
    }
}`,
      explanation: 'Min-heap хранит по одному узлу от каждого списка (максимум k). Извлекаем минимум, его next добавляем в heap. Каждый узел добавляется и извлекается ровно один раз. Время O(N log k), память O(k), где N — общее число узлов, k — количество списков.'
    },
    {
      id: 4,
      title: 'Find Median from Data Stream (LeetCode #295)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте структуру данных, поддерживающую добавление числа и нахождение медианы всех добавленных чисел. Медиана — среднее значение отсортированного списка.',
      requirements: [
        'Реализуйте класс MedianFinder с методами addNum(num) и findMedian()',
        'findMedian() возвращает медиану (double)',
        'Если чётное количество — среднее двух средних',
        'addNum — O(log n), findMedian — O(1)',
        'Используйте два heap: max-heap для левой половины, min-heap для правой'
      ],
      expectedOutput: 'MedianFinder mf = new MedianFinder();\nmf.addNum(1); mf.findMedian() -> 1.0\nmf.addNum(2); mf.findMedian() -> 1.5\nmf.addNum(3); mf.findMedian() -> 2.0',
      hint: 'Два heap: maxHeap (левая половина) и minHeap (правая половина). Поддерживайте баланс: |maxHeap.size() - minHeap.size()| <= 1. Медиана — вершина(и) heap.',
      solution: `import java.util.*;

public class MedianFinder {
    // Левая половина (max-heap): хранит меньшие числа
    private PriorityQueue<Integer> maxHeap;
    // Правая половина (min-heap): хранит большие числа
    private PriorityQueue<Integer> minHeap;

    public MedianFinder() {
        maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        minHeap = new PriorityQueue<>();
    }

    public void addNum(int num) {
        // Добавляем в max-heap (левая половина)
        maxHeap.offer(num);
        // Балансируем: вершина maxHeap <= вершина minHeap
        minHeap.offer(maxHeap.poll());
        // Поддерживаем: maxHeap.size >= minHeap.size
        if (minHeap.size() > maxHeap.size()) {
            maxHeap.offer(minHeap.poll());
        }
    }

    public double findMedian() {
        if (maxHeap.size() > minHeap.size()) {
            return maxHeap.peek(); // нечётное количество
        }
        return (maxHeap.peek() + minHeap.peek()) / 2.0; // чётное
    }

    public static void main(String[] args) {
        MedianFinder mf = new MedianFinder();
        mf.addNum(1);
        System.out.println(mf.findMedian()); // 1.0
        mf.addNum(2);
        System.out.println(mf.findMedian()); // 1.5
        mf.addNum(3);
        System.out.println(mf.findMedian()); // 2.0
        mf.addNum(4);
        System.out.println(mf.findMedian()); // 2.5
        mf.addNum(5);
        System.out.println(mf.findMedian()); // 3.0
    }
}`,
      explanation: 'Два heap делят числа на половины: maxHeap (меньшая, вершина = max) и minHeap (большая, вершина = min). Инвариант: maxHeap.size >= minHeap.size, и все в maxHeap <= все в minHeap. Медиана: при нечётном — вершина maxHeap, при чётном — среднее вершин обоих. addNum O(log n), findMedian O(1).'
    },
    {
      id: 5,
      title: 'K Closest Points to Origin (LeetCode #973)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив точек на плоскости points[i] = [xi, yi]. Верните k ближайших точек к началу координат (0, 0). Расстояние = sqrt(x^2 + y^2).',
      requirements: [
        'Реализуйте метод int[][] kClosest(int[][] points, int k)',
        'Порядок ответа не важен',
        'Сравнивайте по x^2 + y^2 (без sqrt для эффективности)',
        'Используйте max-heap размера k'
      ],
      expectedOutput: 'kClosest([[1,3],[-2,2]], 1) -> [[-2,2]]\nkClosest([[3,3],[5,-1],[-2,4]], 2) -> [[3,3],[-2,4]]',
      hint: 'Max-heap размера k по расстоянию: добавляйте точки, при size > k удаляйте самую далёкую. В конце в heap — k ближайших.',
      solution: `import java.util.*;

public class KClosestPoints {
    public int[][] kClosest(int[][] points, int k) {
        // Max-heap по расстоянию (сравниваем x^2 + y^2)
        PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
            (a, b) -> (b[0]*b[0] + b[1]*b[1]) - (a[0]*a[0] + a[1]*a[1])
        );

        for (int[] point : points) {
            maxHeap.offer(point);
            if (maxHeap.size() > k) {
                maxHeap.poll(); // удаляем самую далёкую
            }
        }

        // Собираем результат
        int[][] result = new int[k][2];
        for (int i = 0; i < k; i++) {
            result[i] = maxHeap.poll();
        }
        return result;
    }

    public static void main(String[] args) {
        KClosestPoints sol = new KClosestPoints();
        int[][] result1 = sol.kClosest(new int[][]{{1,3},{-2,2}}, 1);
        System.out.println(Arrays.toString(result1[0])); // [-2, 2]

        int[][] result2 = sol.kClosest(new int[][]{{3,3},{5,-1},{-2,4}}, 2);
        for (int[] p : result2) System.out.println(Arrays.toString(p));
        // [3, 3] и [-2, 4]
    }
}`,
      explanation: 'Max-heap размера k: при добавлении удаляем самую далёкую точку, если heap переполнен. Сравниваем по x^2+y^2 (без sqrt — монотонная функция, порядок не меняется). Время O(n log k), память O(k). Аналог задачи "Kth Largest" но для точек.'
    },
    {
      id: 6,
      title: 'Sort Characters By Frequency (LeetCode #451)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s. Отсортируйте символы по частоте в убывающем порядке. Символы с одинаковой частотой могут идти в любом порядке.',
      requirements: [
        'Реализуйте метод String frequencySort(String s)',
        'Символы сортируются по частоте (наибольшая первая)',
        'Одинаковые символы должны быть рядом',
        'Учитывайте регистр: "a" и "A" — разные символы'
      ],
      expectedOutput: 'frequencySort("tree") -> "eert" или "eetr"\nfrequencySort("cccaaa") -> "aaaccc" или "cccaaa"\nfrequencySort("Aabb") -> "bbAa" или "bbaA"',
      hint: 'Подсчитайте частоты -> max-heap по частоте -> извлекайте и стройте строку.',
      solution: `import java.util.*;

public class SortByFrequency {
    public String frequencySort(String s) {
        // Шаг 1: подсчёт частот
        Map<Character, Integer> freq = new HashMap<>();
        for (char c : s.toCharArray()) {
            freq.merge(c, 1, Integer::sum);
        }

        // Шаг 2: max-heap по частоте
        PriorityQueue<Map.Entry<Character, Integer>> maxHeap =
            new PriorityQueue<>((a, b) -> b.getValue() - a.getValue());
        maxHeap.addAll(freq.entrySet());

        // Шаг 3: строим результат
        StringBuilder sb = new StringBuilder();
        while (!maxHeap.isEmpty()) {
            Map.Entry<Character, Integer> entry = maxHeap.poll();
            char ch = entry.getKey();
            int count = entry.getValue();
            for (int i = 0; i < count; i++) {
                sb.append(ch);
            }
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        SortByFrequency sol = new SortByFrequency();
        System.out.println(sol.frequencySort("tree"));   // "eert"
        System.out.println(sol.frequencySort("cccaaa")); // "cccaaa" или "aaaccc"
        System.out.println(sol.frequencySort("Aabb"));   // "bbAa"
    }
}`,
      explanation: 'Три шага: 1) HashMap для частот. 2) Max-heap для сортировки символов по частоте. 3) Извлекаем из heap и повторяем символ count раз. Время O(n log k), где k — количество уникальных символов (максимум 62 для букв+цифр). По сути O(n).'
    },
    {
      id: 7,
      title: 'Task Scheduler (LeetCode #621)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Даны задачи (массив символов) и cooldown-период n. Между двумя одинаковыми задачами должно пройти минимум n интервалов. CPU может простаивать (idle). Найдите минимальное число интервалов для выполнения всех задач.',
      requirements: [
        'Реализуйте метод int leastInterval(char[] tasks, int n)',
        'Между одинаковыми задачами минимум n интервалов',
        'Порядок выполнения может быть любым',
        'CPU может простаивать (idle)',
        'Решение через max-heap + очередь'
      ],
      expectedOutput: 'leastInterval(["A","A","A","B","B","B"], 2) -> 8  // A B idle A B idle A B\nleastInterval(["A","A","A","B","B","B"], 0) -> 6\nleastInterval(["A","A","A","A","B","B","B","C","C"], 2) -> 10',
      hint: 'Max-heap по частоте. На каждом шаге берём самую частую задачу, уменьшаем частоту, кладём в очередь ожидания (cooldown). Через n+1 шагов возвращаем из очереди в heap.',
      solution: `import java.util.*;

public class TaskScheduler {
    public int leastInterval(char[] tasks, int n) {
        // Подсчёт частот
        int[] freq = new int[26];
        for (char task : tasks) freq[task - 'A']++;

        // Max-heap по частоте
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        for (int f : freq) {
            if (f > 0) maxHeap.offer(f);
        }

        // Очередь ожидания: (оставшаяся частота, время когда можно вернуть)
        Queue<int[]> cooldownQueue = new LinkedList<>();
        int time = 0;

        while (!maxHeap.isEmpty() || !cooldownQueue.isEmpty()) {
            time++;

            if (!maxHeap.isEmpty()) {
                int count = maxHeap.poll() - 1; // выполняем задачу
                if (count > 0) {
                    cooldownQueue.offer(new int[]{count, time + n});
                }
            }

            // Если cooldown истёк — возвращаем в heap
            if (!cooldownQueue.isEmpty() && cooldownQueue.peek()[1] == time) {
                maxHeap.offer(cooldownQueue.poll()[0]);
            }
        }
        return time;
    }

    public static void main(String[] args) {
        TaskScheduler sol = new TaskScheduler();
        System.out.println(sol.leastInterval(
            new char[]{'A','A','A','B','B','B'}, 2
        )); // 8
        System.out.println(sol.leastInterval(
            new char[]{'A','A','A','B','B','B'}, 0
        )); // 6
        System.out.println(sol.leastInterval(
            new char[]{'A','A','A','A','B','B','B','C','C'}, 2
        )); // 10
    }
}`,
      explanation: 'Жадная стратегия: всегда выполняем самую частую задачу (max-heap). После выполнения кладём в cooldown-очередь с временем возврата. Через n шагов возвращаем в heap. Idle возникает, когда heap пуст, но cooldown ещё не истёк. Время O(N * log 26) = O(N), где N — общее число задач.'
    },
    {
      id: 8,
      title: 'Reorganize String (LeetCode #767)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s. Переставьте символы так, чтобы никакие два одинаковых символа не стояли рядом. Верните любую валидную перестановку или пустую строку, если невозможно.',
      requirements: [
        'Реализуйте метод String reorganizeString(String s)',
        'Никакие два одинаковых символа не должны быть рядом',
        'Верните "" если невозможно',
        'Если самый частый символ встречается > (n+1)/2 раз — невозможно',
        'Используйте max-heap по частоте'
      ],
      expectedOutput: 'reorganizeString("aab") -> "aba"\nreorganizeString("aaab") -> ""\nreorganizeString("aabb") -> "abab" или "baba"',
      hint: 'Max-heap по частоте. На каждом шаге берём два самых частых символа и ставим их рядом. Если остаётся один — ставим его, если его частота > 1 — невозможно.',
      solution: `import java.util.*;

public class ReorganizeString {
    public String reorganizeString(String s) {
        // Подсчёт частот
        int[] freq = new int[26];
        for (char c : s.toCharArray()) freq[c - 'a']++;

        // Max-heap: (частота, символ)
        PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
            (a, b) -> b[0] - a[0]
        );
        for (int i = 0; i < 26; i++) {
            if (freq[i] > 0) {
                // Проверка: если частота > (n+1)/2 — невозможно
                if (freq[i] > (s.length() + 1) / 2) return "";
                maxHeap.offer(new int[]{freq[i], i});
            }
        }

        StringBuilder sb = new StringBuilder();
        while (maxHeap.size() >= 2) {
            // Берём два самых частых
            int[] first = maxHeap.poll();
            int[] second = maxHeap.poll();

            sb.append((char) ('a' + first[1]));
            sb.append((char) ('a' + second[1]));

            // Возвращаем с уменьшенной частотой
            if (--first[0] > 0) maxHeap.offer(first);
            if (--second[0] > 0) maxHeap.offer(second);
        }

        // Если остался один символ
        if (!maxHeap.isEmpty()) {
            sb.append((char) ('a' + maxHeap.poll()[1]));
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        ReorganizeString sol = new ReorganizeString();
        System.out.println(sol.reorganizeString("aab"));   // "aba"
        System.out.println(sol.reorganizeString("aaab"));  // ""
        System.out.println(sol.reorganizeString("aabb"));  // "abab"
        System.out.println(sol.reorganizeString("vvvlo")); // "vlvov"
    }
}`,
      explanation: 'Жадный подход с max-heap: на каждом шаге берём два самых частых символа и чередуем их. Это гарантирует, что одинаковые символы не будут рядом. Условие невозможности: maxFreq > (n+1)/2. Время O(n log 26) = O(n).'
    },
    {
      id: 9,
      title: 'Kth Smallest Element in Sorted Matrix (LeetCode #378)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана матрица n x n, где строки и столбцы отсортированы по возрастанию. Найдите k-й наименьший элемент.',
      requirements: [
        'Реализуйте метод int kthSmallest(int[][] matrix, int k)',
        'Матрица n x n, строки и столбцы отсортированы',
        'k всегда валиден',
        'Решение через min-heap — слияние k отсортированных строк'
      ],
      expectedOutput: 'kthSmallest([[1,5,9],[10,11,13],[12,13,15]], 8) -> 13\nkthSmallest([[-5]], 1) -> -5',
      hint: 'Аналог Merge K Sorted Lists. Положите matrix[i][0] для каждой строки в min-heap. Извлекайте минимум и добавляйте следующий элемент из той же строки.',
      solution: `import java.util.*;

public class KthSmallestMatrix {
    public int kthSmallest(int[][] matrix, int k) {
        int n = matrix.length;
        // Min-heap: (значение, строка, столбец)
        PriorityQueue<int[]> minHeap = new PriorityQueue<>(
            (a, b) -> a[0] - b[0]
        );

        // Добавляем первый элемент каждой строки
        for (int i = 0; i < Math.min(n, k); i++) {
            minHeap.offer(new int[]{matrix[i][0], i, 0});
        }

        // Извлекаем k-1 раз
        for (int i = 0; i < k - 1; i++) {
            int[] current = minHeap.poll();
            int row = current[1];
            int col = current[2];

            // Добавляем следующий элемент из той же строки
            if (col + 1 < n) {
                minHeap.offer(new int[]{matrix[row][col + 1], row, col + 1});
            }
        }

        return minHeap.poll()[0]; // k-й наименьший
    }

    public static void main(String[] args) {
        KthSmallestMatrix sol = new KthSmallestMatrix();
        int[][] matrix = {
            {1,  5,  9},
            {10, 11, 13},
            {12, 13, 15}
        };
        System.out.println(sol.kthSmallest(matrix, 8)); // 13
        // Отсортированный: 1,5,9,10,11,12,13,13,15 -> 8-й = 13
    }
}`,
      explanation: 'Паттерн "Merge K Sorted": каждая строка — отсортированный список. Min-heap хранит по одному элементу от каждой строки. Извлекаем минимум k раз, добавляя следующий из той же строки. Время O(k log n), память O(n). Альтернатива — бинарный поиск по значению O(n log(max-min)).'
    },
    {
      id: 10,
      title: 'IPO — Maximize Capital (LeetCode #502)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Есть n проектов. Для каждого проекта i известен капитал capital[i] (минимальный для начала) и прибыль profits[i]. Начальный капитал w. Можно выбрать максимум k проектов последовательно. Найдите максимальный итоговый капитал.',
      requirements: [
        'Реализуйте метод int findMaximizedCapital(int k, int w, int[] profits, int[] capital)',
        'Проект можно начать, только если текущий капитал >= capital[i]',
        'После завершения проекта прибыль добавляется к капиталу',
        'Выполняем максимум k проектов',
        'Жадная стратегия: из доступных выбираем самый прибыльный'
      ],
      expectedOutput: 'findMaximizedCapital(2, 0, [1,2,3], [0,1,1]) -> 4\n// Начинаем с w=0, берём проект 0 (capital=0, profit=1), w=1\n// Берём проект 2 (capital=1, profit=3), w=4\nfindMaximizedCapital(3, 0, [1,2,3], [0,1,2]) -> 6',
      hint: 'Два heap: min-heap по capital (для поиска доступных проектов), max-heap по profit (для выбора самого прибыльного). На каждом шаге: перемещаем доступные из min-heap в max-heap, берём top.',
      solution: `import java.util.*;

public class IPO {
    public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
        int n = profits.length;

        // Min-heap по capital — все проекты
        PriorityQueue<int[]> minCapHeap = new PriorityQueue<>(
            (a, b) -> a[0] - b[0]
        );
        for (int i = 0; i < n; i++) {
            minCapHeap.offer(new int[]{capital[i], profits[i]});
        }

        // Max-heap по profit — доступные проекты
        PriorityQueue<Integer> maxProfitHeap = new PriorityQueue<>(
            Collections.reverseOrder()
        );

        for (int i = 0; i < k; i++) {
            // Перемещаем все доступные проекты (capital <= w)
            while (!minCapHeap.isEmpty() && minCapHeap.peek()[0] <= w) {
                maxProfitHeap.offer(minCapHeap.poll()[1]);
            }

            // Нет доступных проектов — выходим
            if (maxProfitHeap.isEmpty()) break;

            // Берём самый прибыльный
            w += maxProfitHeap.poll();
        }

        return w;
    }

    public static void main(String[] args) {
        IPO sol = new IPO();
        System.out.println(sol.findMaximizedCapital(
            2, 0, new int[]{1,2,3}, new int[]{0,1,1}
        )); // 4

        System.out.println(sol.findMaximizedCapital(
            3, 0, new int[]{1,2,3}, new int[]{0,1,2}
        )); // 6
    }
}`,
      explanation: 'Два heap: min-heap (по capital) хранит все проекты, max-heap (по profit) хранит доступные. На каждом шаге: 1) Переносим проекты с capital <= w из min-heap в max-heap. 2) Берём самый прибыльный из max-heap. 3) Увеличиваем w. Жадный выбор оптимален: из доступных всегда берём максимальную прибыль. Время O(n log n + k log n).'
    }
  ]
}
