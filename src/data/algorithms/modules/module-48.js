export default {
  id: 48,
  title: 'Практикум: Intervals',
  description: 'Задачи на интервалы: слияние, вставка, пересечения, минимум залов, стрелы для шариков, покрытые интервалы, свободное время, потоковые интервалы.',
  lessons: [
    {
      id: 1,
      title: 'Merge Intervals',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив интервалов intervals[i] = [start, end]. Объедини все пересекающиеся интервалы и верни массив непересекающихся интервалов, покрывающих все исходные.',
      requirements: [
        'Метод int[][] merge(int[][] intervals)',
        'Отсортируй по start',
        'Если текущий start <= prevEnd — сливаем (расширяем end)',
        'Иначе — добавляем предыдущий в результат и начинаем новый',
        'Пример: [[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]',
        'Пример: [[1,4],[4,5]] → [[1,5]]'
      ],
      expectedOutput: '[[1,3],[2,6],[8,10],[15,18]] → [[1,6],[8,10],[15,18]]\n[[1,4],[4,5]] → [[1,5]]\n[[1,4],[0,4]] → [[0,4]]',
      hint: 'Сортируй по start. Сравнивай start текущего с end предыдущего. Если пересекаются — end = max(end, currEnd). Иначе — новый интервал.',
      solution: `import java.util.*;

public class Main {
    static int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> merged = new ArrayList<>();
        int[] current = intervals[0];
        merged.add(current);

        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] <= current[1]) {
                current[1] = Math.max(current[1], intervals[i][1]); // сливаем
            } else {
                current = intervals[i];
                merged.add(current);
            }
        }
        return merged.toArray(new int[0][]);
    }

    static String format(int[][] arr) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < arr.length; i++) {
            sb.append("[").append(arr[i][0]).append(",").append(arr[i][1]).append("]");
            if (i < arr.length - 1) sb.append(",");
        }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        System.out.println("[[1,3],[2,6],[8,10],[15,18]] → " +
            format(merge(new int[][]{{1,3},{2,6},{8,10},{15,18}})));
        System.out.println("[[1,4],[4,5]] → " +
            format(merge(new int[][]{{1,4},{4,5}})));
        System.out.println("[[1,4],[0,4]] → " +
            format(merge(new int[][]{{1,4},{0,4}})));
    }
}`,
      explanation: 'Сортировка по start гарантирует, что пересекающиеся интервалы идут подряд. Сливаем, расширяя end. O(n log n) из-за сортировки.'
    },
    {
      id: 2,
      title: 'Insert Interval',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан отсортированный массив непересекающихся интервалов и новый интервал newInterval. Вставь newInterval и объедини пересекающиеся. Результат должен быть отсортирован и без пересечений.',
      requirements: [
        'Метод int[][] insert(int[][] intervals, int[] newInterval)',
        'Три фазы: (1) добавить все интервалы до newInterval, (2) слить пересекающиеся, (3) добавить оставшиеся',
        'Пересечение: intervals[i][0] <= newInterval[1] && intervals[i][1] >= newInterval[0]',
        'Пример: [[1,3],[6,9]], [2,5] → [[1,5],[6,9]]',
        'Пример: [[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8] → [[1,2],[3,10],[12,16]]',
        'Не забудь edge cases: пустой массив, вставка в начало/конец'
      ],
      expectedOutput: '[[1,3],[6,9]] + [2,5] → [[1,5],[6,9]]\n[[1,2],[3,5],[6,7],[8,10],[12,16]] + [4,8] → [[1,2],[3,10],[12,16]]',
      hint: 'Три шага: (1) все интервалы, заканчивающиеся до начала нового → добавь как есть, (2) все пересекающиеся с новым → слей в один, (3) все оставшиеся → добавь как есть.',
      solution: `import java.util.*;

public class Main {
    static int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> result = new ArrayList<>();
        int i = 0, n = intervals.length;

        // 1. Добавляем все интервалы, заканчивающиеся ДО нового
        while (i < n && intervals[i][1] < newInterval[0]) {
            result.add(intervals[i++]);
        }

        // 2. Сливаем все пересекающиеся
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        result.add(newInterval);

        // 3. Добавляем оставшиеся
        while (i < n) {
            result.add(intervals[i++]);
        }
        return result.toArray(new int[0][]);
    }

    static String format(int[][] arr) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < arr.length; i++) {
            sb.append("[").append(arr[i][0]).append(",").append(arr[i][1]).append("]");
            if (i < arr.length - 1) sb.append(",");
        }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        System.out.println("[[1,3],[6,9]] + [2,5] → " +
            format(insert(new int[][]{{1,3},{6,9}}, new int[]{2,5})));
        System.out.println("[[1,2],[3,5],[6,7],[8,10],[12,16]] + [4,8] → " +
            format(insert(new int[][]{{1,2},{3,5},{6,7},{8,10},{12,16}}, new int[]{4,8})));
    }
}`,
      explanation: 'Три фазы: до пересечения, слияние, после пересечения. Массив уже отсортирован, поэтому сортировка не нужна. O(n) один проход.'
    },
    {
      id: 3,
      title: 'Non-overlapping Intervals',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив интервалов. Найди минимальное количество интервалов, которые нужно удалить, чтобы оставшиеся не пересекались.',
      requirements: [
        'Метод int eraseOverlapIntervals(int[][] intervals)',
        'Отсортируй по end (концу интервала)',
        'Жадно оставляй интервалы, заканчивающиеся раньше',
        'Считай пересечения: если start < prevEnd → удаляем',
        'Пример: [[1,2],[2,3],[3,4],[1,3]] → 1',
        'Пример: [[1,2],[1,2],[1,2]] → 2'
      ],
      expectedOutput: '[[1,2],[2,3],[3,4],[1,3]] → 1\n[[1,2],[1,2],[1,2]] → 2\n[[1,2],[2,3]] → 0',
      hint: 'Activity Selection Problem: максимизируй количество непересекающихся интервалов. Удалённые = total - оставленные.',
      solution: `import java.util.Arrays;

public class Main {
    static int eraseOverlapIntervals(int[][] intervals) {
        if (intervals.length == 0) return 0;
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

        int count = 0;
        int prevEnd = intervals[0][1];

        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < prevEnd) {
                count++; // пересечение — удаляем
            } else {
                prevEnd = intervals[i][1];
            }
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println("[[1,2],[2,3],[3,4],[1,3]] → " +
            eraseOverlapIntervals(new int[][]{{1,2},{2,3},{3,4},{1,3}}));
        System.out.println("[[1,2],[1,2],[1,2]] → " +
            eraseOverlapIntervals(new int[][]{{1,2},{1,2},{1,2}}));
        System.out.println("[[1,2],[2,3]] → " +
            eraseOverlapIntervals(new int[][]{{1,2},{2,3}}));
    }
}`,
      explanation: 'Сортируем по end. Жадно оставляем интервалы, заканчивающиеся раньше — так мы даём больше места следующим. Если start текущего < prevEnd — удаляем текущий. O(n log n).'
    },
    {
      id: 4,
      title: 'Meeting Rooms',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив интервалов встреч. Определи, может ли человек посетить все встречи (нет пересечений).',
      requirements: [
        'Метод boolean canAttendMeetings(int[][] intervals)',
        'Отсортируй по start',
        'Проверь: если start[i] < end[i-1] — пересечение → false',
        'Пример: [[0,30],[5,10],[15,20]] → false',
        'Пример: [[7,10],[2,4]] → true',
        'Пример: [[1,5],[5,10]] → true (граница не считается пересечением)'
      ],
      expectedOutput: '[[0,30],[5,10],[15,20]] → false\n[[7,10],[2,4]] → true\n[[1,5],[5,10]] → true',
      hint: 'Сортируй по start. Если у двух соседних интервалов start[i] < end[i-1] — пересечение. Одного пересечения достаточно, чтобы вернуть false.',
      solution: `import java.util.Arrays;

public class Main {
    static boolean canAttendMeetings(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < intervals[i - 1][1]) {
                return false; // пересечение
            }
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println("[[0,30],[5,10],[15,20]] → " +
            canAttendMeetings(new int[][]{{0,30},{5,10},{15,20}}));
        System.out.println("[[7,10],[2,4]] → " +
            canAttendMeetings(new int[][]{{7,10},{2,4}}));
        System.out.println("[[1,5],[5,10]] → " +
            canAttendMeetings(new int[][]{{1,5},{5,10}}));
    }
}`,
      explanation: 'Простейшая задача на интервалы: сортируем по start, проверяем соседние пары на пересечение. O(n log n) из-за сортировки.'
    },
    {
      id: 5,
      title: 'Meeting Rooms II',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив интервалов встреч. Найди минимальное количество переговорных комнат, необходимых для проведения всех встреч одновременно.',
      requirements: [
        'Метод int minMeetingRooms(int[][] intervals)',
        'Подход 1: два массива starts и ends, отсортированные',
        'Подход 2: min-heap (PriorityQueue) по времени окончания',
        'Подход с heap: для каждой встречи — если start >= heap.peek() → poll и add, иначе просто add',
        'Пример: [[0,30],[5,10],[15,20]] → 2',
        'Пример: [[1,5],[2,6],[3,7]] → 3'
      ],
      expectedOutput: '[[0,30],[5,10],[15,20]] → 2\n[[7,10],[2,4]] → 1\n[[1,5],[2,6],[3,7]] → 3',
      hint: 'PriorityQueue хранит конец самой ранней заканчивающейся встречи. Для каждой новой: если она начинается после min end — переиспользуем комнату (poll + add). Иначе — нужна новая (add). Ответ = heap.size().',
      solution: `import java.util.*;

public class Main {
    static int minMeetingRooms(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        PriorityQueue<Integer> heap = new PriorityQueue<>(); // min-heap по end

        for (int[] meeting : intervals) {
            if (!heap.isEmpty() && meeting[0] >= heap.peek()) {
                heap.poll(); // комната освободилась
            }
            heap.add(meeting[1]); // занимаем комнату
        }
        return heap.size();
    }

    public static void main(String[] args) {
        System.out.println("[[0,30],[5,10],[15,20]] → " +
            minMeetingRooms(new int[][]{{0,30},{5,10},{15,20}}));
        System.out.println("[[7,10],[2,4]] → " +
            minMeetingRooms(new int[][]{{7,10},{2,4}}));
        System.out.println("[[1,5],[2,6],[3,7]] → " +
            minMeetingRooms(new int[][]{{1,5},{2,6},{3,7}}));
    }
}`,
      explanation: 'Min-heap хранит время окончания текущих встреч. Для каждой новой встречи: если самая ранняя заканчивающаяся уже закончилась — освобождаем комнату. Ответ = размер кучи. O(n log n).'
    },
    {
      id: 6,
      title: 'Interval List Intersections',
      type: 'practice',
      difficulty: 'medium',
      description: 'Даны два списка отсортированных непересекающихся интервалов. Найди их пересечение — список интервалов, входящих в оба списка.',
      requirements: [
        'Метод int[][] intervalIntersection(int[][] A, int[][] B)',
        'Два указателя: i для A, j для B',
        'Пересечение: [max(startA, startB), min(endA, endB)] если start <= end',
        'Двигай указатель с меньшим end',
        'Пример: A=[[0,2],[5,10],[13,23],[24,25]], B=[[1,5],[8,12],[15,24],[25,26]]',
        '→ [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]'
      ],
      expectedOutput: 'A=[[0,2],[5,10],[13,23],[24,25]]\nB=[[1,5],[8,12],[15,24],[25,26]]\n→ [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]',
      hint: 'Для каждой пары (A[i], B[j]): start = max(A[i][0], B[j][0]), end = min(A[i][1], B[j][1]). Если start <= end — есть пересечение. Двигай указатель с меньшим end.',
      solution: `import java.util.*;

public class Main {
    static int[][] intervalIntersection(int[][] A, int[][] B) {
        List<int[]> result = new ArrayList<>();
        int i = 0, j = 0;

        while (i < A.length && j < B.length) {
            int start = Math.max(A[i][0], B[j][0]);
            int end = Math.min(A[i][1], B[j][1]);

            if (start <= end) {
                result.add(new int[]{start, end});
            }
            // Двигаем указатель с меньшим end
            if (A[i][1] < B[j][1]) i++;
            else j++;
        }
        return result.toArray(new int[0][]);
    }

    static String format(int[][] arr) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < arr.length; i++) {
            sb.append("[").append(arr[i][0]).append(",").append(arr[i][1]).append("]");
            if (i < arr.length - 1) sb.append(",");
        }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        int[][] A = {{0,2},{5,10},{13,23},{24,25}};
        int[][] B = {{1,5},{8,12},{15,24},{25,26}};
        System.out.println("A=[[0,2],[5,10],[13,23],[24,25]]");
        System.out.println("B=[[1,5],[8,12],[15,24],[25,26]]");
        System.out.println("→ " + format(intervalIntersection(A, B)));
    }
}`,
      explanation: 'Два указателя: вычисляем пересечение текущей пары. Двигаем указатель с меньшим end, потому что его интервал уже не пересечётся со следующими. O(n + m) — один проход по обоим спискам.'
    },
    {
      id: 7,
      title: 'Minimum Number of Arrows to Burst Balloons',
      type: 'practice',
      difficulty: 'medium',
      description: 'Шарики представлены интервалами [xstart, xend]. Стрела лопает все шарики, содержащие координату x. Найди минимальное количество стрел.',
      requirements: [
        'Метод int findMinArrowShots(int[][] points)',
        'Отсортируй по xend',
        'Жадно: стреляй в end самого раннего шарика',
        'Если start следующего > текущего arrowPos — нужна новая стрела',
        'Пример: [[10,16],[2,8],[1,6],[7,12]] → 2',
        'Используй Integer.compare для безопасного сравнения (overflow!)'
      ],
      expectedOutput: '[[10,16],[2,8],[1,6],[7,12]] → 2\n[[1,2],[3,4],[5,6],[7,8]] → 4\n[[1,2],[2,3],[3,4],[4,5]] → 2',
      hint: 'Сортируй по end. Стрела в end[0] лопает все шарики с start <= end[0]. Следующая стрела нужна, когда start > текущего arrowPos.',
      solution: `import java.util.Arrays;

public class Main {
    static int findMinArrowShots(int[][] points) {
        if (points.length == 0) return 0;
        Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));

        int arrows = 1;
        int arrowPos = points[0][1];

        for (int i = 1; i < points.length; i++) {
            if (points[i][0] > arrowPos) {
                arrows++;
                arrowPos = points[i][1];
            }
        }
        return arrows;
    }

    public static void main(String[] args) {
        System.out.println("[[10,16],[2,8],[1,6],[7,12]] → " +
            findMinArrowShots(new int[][]{{10,16},{2,8},{1,6},{7,12}}));
        System.out.println("[[1,2],[3,4],[5,6],[7,8]] → " +
            findMinArrowShots(new int[][]{{1,2},{3,4},{5,6},{7,8}}));
        System.out.println("[[1,2],[2,3],[3,4],[4,5]] → " +
            findMinArrowShots(new int[][]{{1,2},{2,3},{3,4},{4,5}}));
    }
}`,
      explanation: 'Жадный подход: сортируем по end, стреляем в конец первого шарика. Все шарики, чей start <= arrowPos, тоже лопнут. Когда start > arrowPos — новая стрела. O(n log n).'
    },
    {
      id: 8,
      title: 'Employee Free Time',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан список расписаний сотрудников. Каждое расписание — список отсортированных непересекающихся интервалов. Найди общее свободное время — интервалы, когда ВСЕ сотрудники свободны.',
      requirements: [
        'Метод List<int[]> employeeFreeTime(List<List<int[]>> schedule)',
        'Собери все интервалы в один список и отсортируй по start',
        'Слей пересекающиеся (как Merge Intervals)',
        'Промежутки между слитыми интервалами — свободное время',
        'Пример: [[[1,2],[5,6]],[[1,3]],[[4,10]]] → [[3,4]]',
        'Пример: [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]] → [[5,6],[7,9]]'
      ],
      expectedOutput: '[[[1,2],[5,6]],[[1,3]],[[4,10]]] → [[3,4]]\n[[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]] → [[5,6],[7,9]]',
      hint: 'Собери все интервалы, отсортируй, слей. Промежутки между слитыми — ответ. Или используй PriorityQueue для merge k sorted lists.',
      solution: `import java.util.*;

public class Main {
    static List<int[]> employeeFreeTime(List<List<int[]>> schedule) {
        // Собираем все интервалы
        List<int[]> all = new ArrayList<>();
        for (List<int[]> emp : schedule) {
            all.addAll(emp);
        }
        all.sort((a, b) -> Integer.compare(a[0], b[0]));

        // Сливаем пересекающиеся
        List<int[]> merged = new ArrayList<>();
        int[] prev = all.get(0);
        for (int i = 1; i < all.size(); i++) {
            if (all.get(i)[0] <= prev[1]) {
                prev[1] = Math.max(prev[1], all.get(i)[1]);
            } else {
                merged.add(prev);
                prev = all.get(i);
            }
        }
        merged.add(prev);

        // Промежутки между слитыми — свободное время
        List<int[]> free = new ArrayList<>();
        for (int i = 1; i < merged.size(); i++) {
            free.add(new int[]{merged.get(i - 1)[1], merged.get(i)[0]});
        }
        return free;
    }

    static String format(List<int[]> list) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            sb.append("[").append(list.get(i)[0]).append(",").append(list.get(i)[1]).append("]");
            if (i < list.size() - 1) sb.append(",");
        }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        List<List<int[]>> s1 = Arrays.asList(
            Arrays.asList(new int[]{1,2}, new int[]{5,6}),
            Arrays.asList(new int[]{1,3}),
            Arrays.asList(new int[]{4,10})
        );
        System.out.println("[[[1,2],[5,6]],[[1,3]],[[4,10]]] → " +
            format(employeeFreeTime(s1)));

        List<List<int[]>> s2 = Arrays.asList(
            Arrays.asList(new int[]{1,3}, new int[]{6,7}),
            Arrays.asList(new int[]{2,4}),
            Arrays.asList(new int[]{2,5}, new int[]{9,12})
        );
        System.out.println("[[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]] → " +
            format(employeeFreeTime(s2)));
    }
}`,
      explanation: 'Собираем все интервалы от всех сотрудников, сортируем, сливаем пересекающиеся. Промежутки между слитыми — общее свободное время. O(n log n), где n — общее количество интервалов.'
    },
    {
      id: 9,
      title: 'Remove Covered Intervals',
      type: 'practice',
      difficulty: 'medium',
      description: 'Интервал [a,b] покрыт интервалом [c,d], если c <= a и b <= d. Удали все покрытые интервалы и верни количество оставшихся.',
      requirements: [
        'Метод int removeCoveredIntervals(int[][] intervals)',
        'Отсортируй по start возрастающе, при равном start — по end убывающе',
        'Идём и следим за maxEnd: если end <= maxEnd — интервал покрыт',
        'Иначе — оставляем, обновляем maxEnd',
        'Пример: [[1,4],[3,6],[2,8]] → 2 (удалён [1,4], покрыт [2,8]... нет, [3,6] не покрыт)',
        'Пример: [[1,4],[2,3]] → 1'
      ],
      expectedOutput: '[[1,4],[3,6],[2,8]] → 2\n[[1,4],[2,3]] → 1\n[[1,2],[1,4],[3,4]] → 1',
      hint: 'Сортировка: по start ↑, при равном start по end ↓. Тогда если текущий end <= maxEnd — он покрыт предыдущим (с тем же или меньшим start, но большим end).',
      solution: `import java.util.Arrays;

public class Main {
    static int removeCoveredIntervals(int[][] intervals) {
        // Сортируем: по start ↑, при равном — по end ↓
        Arrays.sort(intervals, (a, b) ->
            a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(b[1], a[1]));

        int remaining = 0;
        int maxEnd = 0;

        for (int[] interval : intervals) {
            if (interval[1] > maxEnd) {
                remaining++; // не покрыт
                maxEnd = interval[1];
            }
            // иначе interval[1] <= maxEnd — покрыт, пропускаем
        }
        return remaining;
    }

    public static void main(String[] args) {
        System.out.println("[[1,4],[3,6],[2,8]] → " +
            removeCoveredIntervals(new int[][]{{1,4},{3,6},{2,8}}));
        System.out.println("[[1,4],[2,3]] → " +
            removeCoveredIntervals(new int[][]{{1,4},{2,3}}));
        System.out.println("[[1,2],[1,4],[3,4]] → " +
            removeCoveredIntervals(new int[][]{{1,2},{1,4},{3,4}}));
    }
}`,
      explanation: 'Сортировка по start ↑, end ↓ гарантирует: если end <= maxEnd, интервал покрыт предыдущим с тем же или меньшим start. Считаем непокрытые. O(n log n).'
    },
    {
      id: 10,
      title: 'Data Stream as Disjoint Intervals',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй структуру SummaryRanges: addNum(val) — добавляет число, getIntervals() — возвращает непересекающиеся интервалы, покрывающие все добавленные числа.',
      requirements: [
        'Класс SummaryRanges с TreeMap<Integer, int[]>',
        'addNum(val): найди соседние интервалы через floorKey/ceilingKey',
        'Слей с соседями если val примыкает или попадает внутрь',
        'getIntervals(): верни все интервалы из TreeMap',
        'Пример: addNum(1), addNum(3), addNum(7), addNum(2), addNum(6)',
        'getIntervals() → [[1,3],[6,7]]'
      ],
      expectedOutput: 'После add(1): [[1,1]]\nПосле add(3): [[1,1],[3,3]]\nПосле add(7): [[1,1],[3,3],[7,7]]\nПосле add(2): [[1,3],[7,7]]\nПосле add(6): [[1,3],[6,7]]',
      hint: 'TreeMap: ключ = start интервала, значение = int[]{start, end}. floorKey(val) — ближайший <= val. ceilingKey(val) — ближайший >= val. Проверяй, можно ли слить с left и right.',
      solution: `import java.util.*;

public class Main {
    static TreeMap<Integer, int[]> map = new TreeMap<>();

    static void addNum(int val) {
        if (map.containsKey(val)) return;

        Integer lo = map.lowerKey(val);  // ключ < val
        Integer hi = map.higherKey(val); // ключ > val

        boolean mergeLeft = lo != null && map.get(lo)[1] >= val - 1;
        boolean mergeRight = hi != null && hi == val + 1;

        if (mergeLeft && mergeRight) {
            // Сливаем оба
            map.get(lo)[1] = map.get(hi)[1];
            map.remove(hi);
        } else if (mergeLeft) {
            map.get(lo)[1] = Math.max(map.get(lo)[1], val);
        } else if (mergeRight) {
            int[] rightInterval = map.get(hi);
            map.remove(hi);
            rightInterval[0] = val;
            map.put(val, rightInterval);
        } else {
            map.put(val, new int[]{val, val});
        }
    }

    static int[][] getIntervals() {
        return map.values().toArray(new int[0][]);
    }

    static String format(int[][] arr) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < arr.length; i++) {
            sb.append("[").append(arr[i][0]).append(",").append(arr[i][1]).append("]");
            if (i < arr.length - 1) sb.append(",");
        }
        return sb.append("]").toString();
    }

    public static void main(String[] args) {
        addNum(1);
        System.out.println("После add(1): " + format(getIntervals()));
        addNum(3);
        System.out.println("После add(3): " + format(getIntervals()));
        addNum(7);
        System.out.println("После add(7): " + format(getIntervals()));
        addNum(2);
        System.out.println("После add(2): " + format(getIntervals()));
        addNum(6);
        System.out.println("После add(6): " + format(getIntervals()));
    }
}`,
      explanation: 'TreeMap поддерживает интервалы отсортированными. addNum проверяет соседей (lowerKey, higherKey) и сливает при примыкании. Каждая операция O(log n). getIntervals — O(n).'
    }
  ]
}
