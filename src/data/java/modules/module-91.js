export default {
  id: 91,
  title: 'Практикум: Сортировки',
  description: 'Реализация и применение алгоритмов сортировки: Merge Sort, Quick Sort, Heap Sort, Counting Sort, Radix Sort и задачи на сортировку.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Merge Sort',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй сортировку слиянием (Merge Sort) для массива целых чисел.',
      requirements: [
        'Метод mergeSort(int[] arr) сортирует массив in-place',
        'Рекурсивное разделение на половины',
        'Слияние двух отсортированных подмассивов',
        'Протестировать: [38,27,43,3,9,82,10] → [3,9,10,27,38,43,82]'
      ],
      expectedOutput: '[3, 9, 10, 27, 38, 43, 82]',
      hint: 'Разделяй массив пополам рекурсивно до размера 1. Затем сливай обратно, сравнивая элементы двух половин.',
      solution: `import java.util.Arrays;

public class Main {
    static void mergeSort(int[] arr, int left, int right) {
        if (left >= right) return;
        int mid = (left + right) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }

    static void merge(int[] arr, int left, int mid, int right) {
        int[] temp = new int[right - left + 1];
        int i = left, j = mid + 1, k = 0;
        while (i <= mid && j <= right) {
            if (arr[i] <= arr[j]) temp[k++] = arr[i++];
            else temp[k++] = arr[j++];
        }
        while (i <= mid) temp[k++] = arr[i++];
        while (j <= right) temp[k++] = arr[j++];
        System.arraycopy(temp, 0, arr, left, temp.length);
    }

    public static void main(String[] args) {
        int[] arr = {38, 27, 43, 3, 9, 82, 10};
        mergeSort(arr, 0, arr.length - 1);
        System.out.println(Arrays.toString(arr));
    }
}`,
      explanation: 'Merge Sort — стабильная сортировка O(n log n). Принцип «разделяй и властвуй»: делим массив пополам до элементов, затем сливаем отсортированные половины. Стабильность означает сохранение порядка равных элементов. Недостаток — O(n) дополнительной памяти для temp массива.'
    },
    {
      id: 2,
      title: 'Задача: Quick Sort',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй быструю сортировку (Quick Sort) с выбором pivot.',
      requirements: [
        'Метод quickSort(int[] arr, int low, int high)',
        'Partition с выбором последнего элемента как pivot',
        'In-place сортировка',
        'Протестировать: [10,7,8,9,1,5] → [1,5,7,8,9,10]'
      ],
      expectedOutput: '[1, 5, 7, 8, 9, 10]',
      hint: 'Partition переставляет элементы так, что все меньше pivot — слева, больше — справа. Возвращает индекс pivot. Рекурсивно сортируем левую и правую части.',
      solution: `import java.util.Arrays;

public class Main {
    static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
            }
        }
        int tmp = arr[i + 1]; arr[i + 1] = arr[high]; arr[high] = tmp;
        return i + 1;
    }

    public static void main(String[] args) {
        int[] arr = {10, 7, 8, 9, 1, 5};
        quickSort(arr, 0, arr.length - 1);
        System.out.println(Arrays.toString(arr));
    }
}`,
      explanation: 'Quick Sort — в среднем O(n log n), worst case O(n²) при плохом выборе pivot. Partition (Lomuto scheme): все элементы < pivot перемещаются влево. In-place — не нужна дополнительная память. На практике часто быстрее Merge Sort из-за лучшей локальности кэша.'
    },
    {
      id: 3,
      title: 'Задача: Heap Sort',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй сортировку кучей (Heap Sort) используя max-heap.',
      requirements: [
        'Метод heapSort(int[] arr)',
        'Построение max-heap (heapify)',
        'Извлечение максимума и перестроение',
        'Протестировать: [12,11,13,5,6,7] → [5,6,7,11,12,13]'
      ],
      expectedOutput: '[5, 6, 7, 11, 12, 13]',
      hint: 'Шаги: 1) Построй max-heap из массива. 2) Поменяй корень (максимум) с последним элементом. 3) Heapify уменьшенный heap. Повторяй.',
      solution: `import java.util.Arrays;

public class Main {
    static void heapSort(int[] arr) {
        int n = arr.length;
        for (int i = n / 2 - 1; i >= 0; i--)
            heapify(arr, n, i);
        for (int i = n - 1; i > 0; i--) {
            int tmp = arr[0]; arr[0] = arr[i]; arr[i] = tmp;
            heapify(arr, i, 0);
        }
    }

    static void heapify(int[] arr, int n, int i) {
        int largest = i;
        int left = 2 * i + 1, right = 2 * i + 2;
        if (left < n && arr[left] > arr[largest]) largest = left;
        if (right < n && arr[right] > arr[largest]) largest = right;
        if (largest != i) {
            int tmp = arr[i]; arr[i] = arr[largest]; arr[largest] = tmp;
            heapify(arr, n, largest);
        }
    }

    public static void main(String[] args) {
        int[] arr = {12, 11, 13, 5, 6, 7};
        heapSort(arr);
        System.out.println(Arrays.toString(arr));
    }
}`,
      explanation: 'Heap Sort: O(n log n) гарантированно, O(1) дополнительной памяти. Max-heap — бинарное дерево где родитель >= детей. Build heap за O(n), n извлечений по O(log n). Не стабильная сортировка. Используется в Java для Arrays.sort() примитивных типов (DualPivotQuicksort с fallback на Heap Sort).'
    },
    {
      id: 4,
      title: 'Задача: Counting Sort',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй сортировку подсчётом для массива неотрицательных целых чисел.',
      requirements: [
        'Метод countingSort(int[] arr)',
        'Определить max элемент',
        'Подсчитать количество каждого элемента',
        'Протестировать: [4,2,2,8,3,3,1] → [1,2,2,3,3,4,8]'
      ],
      expectedOutput: '[1, 2, 2, 3, 3, 4, 8]',
      hint: 'Создай массив count размером max+1. Подсчитай вхождения. Перепиши массив, используя count.',
      solution: `import java.util.Arrays;

public class Main {
    static void countingSort(int[] arr) {
        int max = 0;
        for (int v : arr) max = Math.max(max, v);
        int[] count = new int[max + 1];
        for (int v : arr) count[v]++;
        int idx = 0;
        for (int i = 0; i <= max; i++) {
            while (count[i]-- > 0) arr[idx++] = i;
        }
    }

    public static void main(String[] args) {
        int[] arr = {4, 2, 2, 8, 3, 3, 1};
        countingSort(arr);
        System.out.println(Arrays.toString(arr));
    }
}`,
      explanation: 'Counting Sort — O(n+k) где k = max значение. Не comparison-based — не ограничена O(n log n). Идеальна для небольшого диапазона значений (оценки 1-5, ASCII коды). Не стабильна в этой простой реализации; стабильная версия использует prefix sum.'
    },
    {
      id: 5,
      title: 'Задача: Radix Sort',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй поразрядную сортировку (Radix Sort) для положительных целых чисел.',
      requirements: [
        'Метод radixSort(int[] arr)',
        'Использовать counting sort для каждого разряда',
        'Сортировка от младшего разряда к старшему (LSD)',
        'Протестировать: [170,45,75,90,802,24,2,66] → [2,24,45,66,75,90,170,802]'
      ],
      expectedOutput: '[2, 24, 45, 66, 75, 90, 170, 802]',
      hint: 'Для каждого разряда (единицы, десятки, сотни...) применяй стабильный counting sort. Извлекай разряд: (num / exp) % 10.',
      solution: `import java.util.Arrays;

public class Main {
    static void radixSort(int[] arr) {
        int max = Arrays.stream(arr).max().orElse(0);
        for (int exp = 1; max / exp > 0; exp *= 10) {
            countingSortByDigit(arr, exp);
        }
    }

    static void countingSortByDigit(int[] arr, int exp) {
        int n = arr.length;
        int[] output = new int[n];
        int[] count = new int[10];
        for (int v : arr) count[(v / exp) % 10]++;
        for (int i = 1; i < 10; i++) count[i] += count[i - 1];
        for (int i = n - 1; i >= 0; i--) {
            int digit = (arr[i] / exp) % 10;
            output[count[digit] - 1] = arr[i];
            count[digit]--;
        }
        System.arraycopy(output, 0, arr, 0, n);
    }

    public static void main(String[] args) {
        int[] arr = {170, 45, 75, 90, 802, 24, 2, 66};
        radixSort(arr);
        System.out.println(Arrays.toString(arr));
    }
}`,
      explanation: 'Radix Sort: O(d*(n+k)) где d=количество разрядов, k=основание (10). Для каждого разряда применяется СТАБИЛЬНЫЙ counting sort. Стабильность критична — иначе разряды перемешаются. LSD (Least Significant Digit) сортирует от младшего разряда к старшему.'
    },
    {
      id: 6,
      title: 'Задача: Sort Colors (Dutch National Flag)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Отсортируй массив из 0, 1, 2 за один проход. Это задача Dutch National Flag problem.',
      requirements: [
        'Метод sortColors(int[] nums) — in-place, один проход',
        'Три указателя: low (граница 0), mid (текущий), high (граница 2)',
        'O(n) время, O(1) память',
        'Протестировать: [2,0,2,1,1,0] → [0,0,1,1,2,2]'
      ],
      expectedOutput: '[0, 0, 1, 1, 2, 2]\n[0, 1, 2]',
      hint: 'low=0, mid=0, high=n-1. Если nums[mid]==0 — swap с low, оба ++. Если 1 — mid++. Если 2 — swap с high, high--.',
      solution: `import java.util.Arrays;

public class Main {
    static void sortColors(int[] nums) {
        int low = 0, mid = 0, high = nums.length - 1;
        while (mid <= high) {
            if (nums[mid] == 0) {
                int tmp = nums[low]; nums[low] = nums[mid]; nums[mid] = tmp;
                low++; mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                int tmp = nums[mid]; nums[mid] = nums[high]; nums[high] = tmp;
                high--;
            }
        }
    }

    public static void main(String[] args) {
        int[] a = {2, 0, 2, 1, 1, 0};
        sortColors(a);
        System.out.println(Arrays.toString(a));

        int[] b = {2, 1, 0};
        sortColors(b);
        System.out.println(Arrays.toString(b));
    }
}`,
      explanation: 'Dutch National Flag (Dijkstra): три области — [0..low) все 0, [low..mid) все 1, (high..n-1] все 2. mid сканирует массив: 0 → swap с low, 2 → swap с high. При swap с high не инкрементируем mid, т.к. элемент из high ещё не проверен. O(n) один проход.'
    },
    {
      id: 7,
      title: 'Задача: Kth Largest Element',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди k-й по величине элемент в неотсортированном массиве. Например: [3,2,1,5,6,4], k=2 → 5.',
      requirements: [
        'Метод findKthLargest(int[] nums, int k)',
        'Решение через QuickSelect (partition) — O(n) в среднем',
        'Альтернатива: min-heap размера k',
        'Протестировать: [3,2,1,5,6,4] k=2 → 5, [3,2,3,1,2,4,5,5,6] k=4 → 4'
      ],
      expectedOutput: '5\n4',
      hint: 'QuickSelect: partition как в QuickSort, но рекурсия только в одну сторону — ту, где находится k-й элемент. Ищем элемент с индексом n-k в отсортированном массиве.',
      solution: `import java.util.PriorityQueue;

public class Main {
    // Решение через min-heap
    static int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int num : nums) {
            heap.offer(num);
            if (heap.size() > k) heap.poll();
        }
        return heap.peek();
    }

    // Решение через QuickSelect
    static int quickSelect(int[] nums, int k) {
        int target = nums.length - k;
        return select(nums, 0, nums.length - 1, target);
    }

    static int select(int[] arr, int low, int high, int k) {
        int pivot = arr[high];
        int i = low;
        for (int j = low; j < high; j++) {
            if (arr[j] <= pivot) {
                int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
                i++;
            }
        }
        int tmp = arr[i]; arr[i] = arr[high]; arr[high] = tmp;
        if (i == k) return arr[i];
        else if (i < k) return select(arr, i + 1, high, k);
        else return select(arr, low, i - 1, k);
    }

    public static void main(String[] args) {
        System.out.println(findKthLargest(new int[]{3,2,1,5,6,4}, 2));
        System.out.println(findKthLargest(new int[]{3,2,3,1,2,4,5,5,6}, 4));
    }
}`,
      explanation: 'Min-heap подход: O(n log k). Поддерживаем heap размера k — в конце корень = k-й максимальный. QuickSelect: O(n) в среднем — partition как QuickSort, но рекурсия только в нужную половину. В Java Arrays.sort() + индекс тоже работает за O(n log n).'
    },
    {
      id: 8,
      title: 'Задача: Merge Intervals',
      type: 'practice',
      difficulty: 'medium',
      description: 'Слей перекрывающиеся интервалы. Например: [[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]].',
      requirements: [
        'Метод merge(int[][] intervals) возвращает int[][]',
        'Отсортировать по началу интервала',
        'Сливать перекрывающиеся интервалы',
        'Протестировать: [[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]'
      ],
      expectedOutput: '[[1,6], [8,10], [15,18]]\n[[1,5]]',
      hint: 'Отсортируй по start. Для каждого интервала: если начало <= конец предыдущего, объединяй (max из концов). Иначе добавляй новый.',
      solution: `import java.util.*;

public class Main {
    static int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        List<int[]> result = new ArrayList<>();
        result.add(intervals[0]);
        for (int i = 1; i < intervals.length; i++) {
            int[] last = result.get(result.size() - 1);
            if (intervals[i][0] <= last[1]) {
                last[1] = Math.max(last[1], intervals[i][1]);
            } else {
                result.add(intervals[i]);
            }
        }
        return result.toArray(new int[0][]);
    }

    public static void main(String[] args) {
        int[][] r1 = merge(new int[][]{{1,3},{2,6},{8,10},{15,18}});
        System.out.println(Arrays.deepToString(r1));

        int[][] r2 = merge(new int[][]{{1,4},{4,5}});
        System.out.println(Arrays.deepToString(r2));
    }
}`,
      explanation: 'Сортировка по началу гарантирует, что перекрывающиеся интервалы стоят рядом. Для каждого нового интервала проверяем: если его начало <= конца последнего добавленного, сливаем (берём max из концов). Иначе — новый непересекающийся интервал. O(n log n) из-за сортировки.'
    },
    {
      id: 9,
      title: 'Задача: Meeting Rooms II',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди минимальное количество переговорных комнат для проведения всех встреч. Каждая встреча — интервал [start, end].',
      requirements: [
        'Метод minMeetingRooms(int[][] intervals) возвращает int',
        'Использовать min-heap (PriorityQueue) для отслеживания окончания встреч',
        'Протестировать: [[0,30],[5,10],[15,20]] → 2, [[7,10],[2,4]] → 1'
      ],
      expectedOutput: '2\n1\n3',
      hint: 'Отсортируй по началу. PriorityQueue хранит end-time текущих встреч. Если начало новой >= минимальный end — освобождаем комнату (poll). Всегда добавляем новый end. Размер кучи = нужное количество комнат.',
      solution: `import java.util.*;

public class Main {
    static int minMeetingRooms(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        for (int[] meeting : intervals) {
            if (!heap.isEmpty() && heap.peek() <= meeting[0]) {
                heap.poll();
            }
            heap.offer(meeting[1]);
        }
        return heap.size();
    }

    public static void main(String[] args) {
        System.out.println(minMeetingRooms(new int[][]{{0,30},{5,10},{15,20}}));
        System.out.println(minMeetingRooms(new int[][]{{7,10},{2,4}}));
        System.out.println(minMeetingRooms(new int[][]{{1,5},{2,6},{3,7}}));
    }
}`,
      explanation: 'Min-heap хранит end-time активных встреч. Если начало новой встречи >= самого раннего окончания (peek), освобождаем комнату (poll). Иначе нужна новая комната. Размер кучи в конце — ответ. O(n log n) из-за сортировки и операций с кучей.'
    },
    {
      id: 10,
      title: 'Задача: Custom Sort с Comparator',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй несколько задач с пользовательской сортировкой: сортировка по частоте, по последней цифре, по длине слова.',
      requirements: [
        'sortByFrequency: сортировать по частоте (реже → чаще), при равной частоте — по значению',
        'sortByLastDigit: сортировать по последней цифре числа',
        'sortByLength: сортировать строки по длине, при равной длине — лексикографически',
        'Использовать Comparator.comparing, thenComparing'
      ],
      expectedOutput: 'By frequency: [3, 1, 1, 2, 2, 2]\nBy last digit: [10, 21, 33, 45, 67, 89]\nBy length: [go, cat, dog, java, apple, hello, python]',
      hint: 'Для частотной сортировки: сначала подсчитай частоты в Map, затем сортируй с Comparator, который сравнивает по freq. Comparator.comparingInt(a -> freq.get(a)).',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    static int[] sortByFrequency(int[] arr) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int v : arr) freq.merge(v, 1, Integer::sum);
        return Arrays.stream(arr).boxed()
            .sorted(Comparator.comparingInt((Integer a) -> freq.get(a))
                .thenComparingInt(a -> a))
            .mapToInt(Integer::intValue).toArray();
    }

    static int[] sortByLastDigit(int[] arr) {
        return Arrays.stream(arr).boxed()
            .sorted(Comparator.comparingInt(a -> a % 10))
            .mapToInt(Integer::intValue).toArray();
    }

    static String[] sortByLength(String[] arr) {
        Arrays.sort(arr, Comparator.comparingInt(String::length)
            .thenComparing(Comparator.naturalOrder()));
        return arr;
    }

    public static void main(String[] args) {
        System.out.println("By frequency: " +
            Arrays.toString(sortByFrequency(new int[]{1,1,2,2,2,3})));
        System.out.println("By last digit: " +
            Arrays.toString(sortByLastDigit(new int[]{33,21,45,89,10,67})));
        System.out.println("By length: " +
            Arrays.toString(sortByLength(new String[]{"python","go","java","hello","cat","dog","apple"})));
    }
}`,
      explanation: 'Comparator.comparing позволяет строить сложные правила сортировки. thenComparing добавляет вторичный критерий. Stream API с sorted() — функциональный стиль. Для примитивов нужен boxing (stream().boxed()). Comparator — ключевой инструмент Java для кастомной сортировки.'
    }
  ]
}
