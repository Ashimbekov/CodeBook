export default {
  id: 46,
  title: 'Практикум: Greedy задачи',
  description: 'Жадные алгоритмы на LeetCode: раздача печенья, прыжки, заправки, конфеты, интервалы, разделение строки, реконструкция очереди.',
  lessons: [
    {
      id: 1,
      title: 'Assign Cookies',
      type: 'practice',
      difficulty: 'easy',
      description: 'У тебя есть массив greed[i] — жадность i-го ребёнка, и массив size[j] — размер j-го печенья. Ребёнок i будет доволен, если получит печенье размером >= greed[i]. Найди максимальное количество довольных детей.',
      requirements: [
        'Метод int findContentChildren(int[] g, int[] s)',
        'Отсортируй оба массива по возрастанию',
        'Жадный подход: самому нежадному ребёнку — самое маленькое подходящее печенье',
        'Два указателя: один по детям, один по печенькам',
        'Пример: g=[1,2,3], s=[1,1] → 1 (только первый ребёнок доволен)',
        'Пример: g=[1,2], s=[1,2,3] → 2'
      ],
      expectedOutput: 'g=[1,2,3], s=[1,1] → 1\ng=[1,2], s=[1,2,3] → 2\ng=[10,9,8,7], s=[5,6,7,8] → 2',
      hint: 'Сортируем оба массива. Идём двумя указателями: если текущее печенье подходит текущему ребёнку — оба вперёд, иначе — только указатель печенья вперёд.',
      solution: `import java.util.Arrays;

public class Main {
    static int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        Arrays.sort(s);
        int child = 0, cookie = 0;
        while (child < g.length && cookie < s.length) {
            if (s[cookie] >= g[child]) {
                child++; // ребёнок доволен
            }
            cookie++; // печенье использовано или слишком маленькое
        }
        return child;
    }

    public static void main(String[] args) {
        System.out.println("g=[1,2,3], s=[1,1] → " +
            findContentChildren(new int[]{1,2,3}, new int[]{1,1}));
        System.out.println("g=[1,2], s=[1,2,3] → " +
            findContentChildren(new int[]{1,2}, new int[]{1,2,3}));
        System.out.println("g=[10,9,8,7], s=[5,6,7,8] → " +
            findContentChildren(new int[]{10,9,8,7}, new int[]{5,6,7,8}));
    }
}`,
      explanation: 'Жадный выбор: отсортировав оба массива, мы гарантируем, что каждое печенье достаётся наиболее "подходящему" ребёнку. Сложность O(n log n + m log m) из-за сортировки.'
    },
    {
      id: 2,
      title: 'Jump Game',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums, где nums[i] — максимальная длина прыжка из позиции i. Определи, можно ли добраться из позиции 0 до последней позиции.',
      requirements: [
        'Метод boolean canJump(int[] nums)',
        'Жадный подход: отслеживай максимально достижимую позицию (maxReach)',
        'Если текущий индекс > maxReach — значит мы "застряли"',
        'Обновляй maxReach = max(maxReach, i + nums[i])',
        'Пример: [2,3,1,1,4] → true',
        'Пример: [3,2,1,0,4] → false (застрянем на индексе 3)'
      ],
      expectedOutput: '[2,3,1,1,4] → true\n[3,2,1,0,4] → false\n[0] → true\n[2,0,0] → true',
      hint: 'Идём слева направо. На каждом шаге обновляем maxReach. Если i > maxReach — return false. Если maxReach >= last index — return true.',
      solution: `public class Main {
    static boolean canJump(int[] nums) {
        int maxReach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > maxReach) return false; // не можем дойти до i
            maxReach = Math.max(maxReach, i + nums[i]);
            if (maxReach >= nums.length - 1) return true;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println("[2,3,1,1,4] → " + canJump(new int[]{2,3,1,1,4}));
        System.out.println("[3,2,1,0,4] → " + canJump(new int[]{3,2,1,0,4}));
        System.out.println("[0] → " + canJump(new int[]{0}));
        System.out.println("[2,0,0] → " + canJump(new int[]{2,0,0}));
    }
}`,
      explanation: 'Жадно отслеживаем максимальную достижимую позицию. Если в какой-то момент текущий индекс превышает maxReach — мы не можем до него дойти. O(n) время, O(1) память.'
    },
    {
      id: 3,
      title: 'Jump Game II',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums, где nums[i] — максимальная длина прыжка из позиции i. Гарантируется, что можно дойти до конца. Найди минимальное количество прыжков.',
      requirements: [
        'Метод int jump(int[] nums)',
        'Жадный BFS-подход: на каждом "уровне" считаем максимальный reach',
        'Переменные: jumps (счётчик), currentEnd (конец текущего уровня), farthest (максимальный reach)',
        'Когда i достигает currentEnd — делаем прыжок, currentEnd = farthest',
        'Пример: [2,3,1,1,4] → 2 (0→1→4)',
        'Пример: [2,3,0,1,4] → 2'
      ],
      expectedOutput: '[2,3,1,1,4] → 2\n[2,3,0,1,4] → 2\n[1,1,1,1] → 3\n[10,1,1,1] → 1',
      hint: 'Представь BFS по уровням: уровень 0 = {позиция 0}, уровень 1 = все позиции, достижимые за 1 прыжок, и т.д. На каждом уровне выбираем максимальный farthest.',
      solution: `public class Main {
    static int jump(int[] nums) {
        int jumps = 0;
        int currentEnd = 0;  // конец текущего "уровня"
        int farthest = 0;    // самая далёкая достижимая позиция

        for (int i = 0; i < nums.length - 1; i++) {
            farthest = Math.max(farthest, i + nums[i]);
            if (i == currentEnd) { // достигли конца текущего уровня
                jumps++;
                currentEnd = farthest;
                if (currentEnd >= nums.length - 1) break;
            }
        }
        return jumps;
    }

    public static void main(String[] args) {
        System.out.println("[2,3,1,1,4] → " + jump(new int[]{2,3,1,1,4}));
        System.out.println("[2,3,0,1,4] → " + jump(new int[]{2,3,0,1,4}));
        System.out.println("[1,1,1,1] → " + jump(new int[]{1,1,1,1}));
        System.out.println("[10,1,1,1] → " + jump(new int[]{10,1,1,1}));
    }
}`,
      explanation: 'Жадный BFS: на каждом "уровне прыжка" мы вычисляем максимально дальнюю точку. Когда доходим до конца текущего уровня — совершаем прыжок. O(n) время, O(1) память.'
    },
    {
      id: 4,
      title: 'Gas Station',
      type: 'practice',
      difficulty: 'medium',
      description: 'На круговом маршруте N станций. На станции i доступно gas[i] бензина, а до следующей станции нужно cost[i] бензина. Начиная с полного бака = 0, найди стартовую станцию, откуда можно проехать полный круг. Если нельзя — верни -1.',
      requirements: [
        'Метод int canCompleteCircuit(int[] gas, int[] cost)',
        'Жадный подход: если суммарный gas < суммарного cost — решения нет',
        'Иначе решение существует и единственное',
        'Если в какой-то точке tank < 0, начинаем заново со следующей станции',
        'Пример: gas=[1,2,3,4,5], cost=[3,4,5,1,2] → 3',
        'Пример: gas=[2,3,4], cost=[3,4,3] → -1'
      ],
      expectedOutput: 'gas=[1,2,3,4,5], cost=[3,4,5,1,2] → 3\ngas=[2,3,4], cost=[3,4,3] → -1\ngas=[5,1,2,3,4], cost=[4,4,1,5,1] → 4',
      hint: 'Два наблюдения: (1) если total gas >= total cost, решение всегда есть, (2) если на отрезке [start..i] tank стал < 0, то ни одна станция на этом отрезке не может быть стартом.',
      solution: `public class Main {
    static int canCompleteCircuit(int[] gas, int[] cost) {
        int totalTank = 0;
        int currentTank = 0;
        int start = 0;

        for (int i = 0; i < gas.length; i++) {
            int diff = gas[i] - cost[i];
            totalTank += diff;
            currentTank += diff;
            if (currentTank < 0) {
                start = i + 1;    // начинаем со следующей станции
                currentTank = 0;  // сбрасываем текущий бак
            }
        }
        return totalTank >= 0 ? start : -1;
    }

    public static void main(String[] args) {
        System.out.println("gas=[1,2,3,4,5], cost=[3,4,5,1,2] → " +
            canCompleteCircuit(new int[]{1,2,3,4,5}, new int[]{3,4,5,1,2}));
        System.out.println("gas=[2,3,4], cost=[3,4,3] → " +
            canCompleteCircuit(new int[]{2,3,4}, new int[]{3,4,3}));
        System.out.println("gas=[5,1,2,3,4], cost=[4,4,1,5,1] → " +
            canCompleteCircuit(new int[]{5,1,2,3,4}, new int[]{4,4,1,5,1}));
    }
}`,
      explanation: 'Ключевое наблюдение: если сумма gas >= суммы cost, решение гарантировано существует. Если на отрезке [start..i] бак ушёл в минус, ни одна из этих станций не годится как старт. O(n) один проход.'
    },
    {
      id: 5,
      title: 'Candy',
      type: 'practice',
      difficulty: 'hard',
      description: 'N детей стоят в ряд. Каждому ребёнку присвоен рейтинг ratings[i]. Раздай конфеты так, чтобы: (1) каждый ребёнок получил хотя бы 1 конфету, (2) ребёнок с более высоким рейтингом, чем сосед, получил больше конфет. Найди минимальное количество конфет.',
      requirements: [
        'Метод int candy(int[] ratings)',
        'Два прохода: слева направо и справа налево',
        'Проход слева: если ratings[i] > ratings[i-1], то candies[i] = candies[i-1] + 1',
        'Проход справа: если ratings[i] > ratings[i+1], то candies[i] = max(candies[i], candies[i+1] + 1)',
        'Пример: [1,0,2] → 5 (2+1+2)',
        'Пример: [1,2,2] → 4 (1+2+1)'
      ],
      expectedOutput: '[1,0,2] → 5\n[1,2,2] → 4\n[1,3,2,2,1] → 7\n[1,2,3,4,5] → 15',
      hint: 'Первый проход слева направо учитывает левого соседа. Второй проход справа налево учитывает правого. Берём максимум из двух проходов для каждой позиции.',
      solution: `public class Main {
    static int candy(int[] ratings) {
        int n = ratings.length;
        int[] candies = new int[n];
        java.util.Arrays.fill(candies, 1); // каждому минимум 1

        // Проход слева направо: учитываем левого соседа
        for (int i = 1; i < n; i++) {
            if (ratings[i] > ratings[i - 1]) {
                candies[i] = candies[i - 1] + 1;
            }
        }

        // Проход справа налево: учитываем правого соседа
        for (int i = n - 2; i >= 0; i--) {
            if (ratings[i] > ratings[i + 1]) {
                candies[i] = Math.max(candies[i], candies[i + 1] + 1);
            }
        }

        int total = 0;
        for (int c : candies) total += c;
        return total;
    }

    public static void main(String[] args) {
        System.out.println("[1,0,2] → " + candy(new int[]{1,0,2}));
        System.out.println("[1,2,2] → " + candy(new int[]{1,2,2}));
        System.out.println("[1,3,2,2,1] → " + candy(new int[]{1,3,2,2,1}));
        System.out.println("[1,2,3,4,5] → " + candy(new int[]{1,2,3,4,5}));
    }
}`,
      explanation: 'Два прохода гарантируют, что оба условия (левый и правый сосед) выполнены. Берём max из двух проходов, чтобы удовлетворить обоих соседей. O(n) время, O(n) память.'
    },
    {
      id: 6,
      title: 'Non-overlapping Intervals',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив интервалов intervals[i] = [start, end]. Найди минимальное количество интервалов, которые нужно удалить, чтобы оставшиеся не пересекались.',
      requirements: [
        'Метод int eraseOverlapIntervals(int[][] intervals)',
        'Отсортируй по концу интервала (end)',
        'Жадно: оставляй интервал, который заканчивается раньше всех',
        'Если текущий интервал пересекается с предыдущим оставленным — удаляй',
        'Пример: [[1,2],[2,3],[3,4],[1,3]] → 1 (удаляем [1,3])',
        'Пример: [[1,2],[1,2],[1,2]] → 2'
      ],
      expectedOutput: '[[1,2],[2,3],[3,4],[1,3]] → 1\n[[1,2],[1,2],[1,2]] → 2\n[[1,2],[2,3]] → 0',
      hint: 'Сортируем по end. Жадно оставляем интервалы: если start >= prevEnd — не пересекается (оставляем), иначе — удаляем (увеличиваем счётчик).',
      solution: `import java.util.Arrays;

public class Main {
    static int eraseOverlapIntervals(int[][] intervals) {
        if (intervals.length == 0) return 0;
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));

        int removed = 0;
        int prevEnd = intervals[0][1];

        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < prevEnd) {
                removed++; // пересечение — удаляем текущий
            } else {
                prevEnd = intervals[i][1]; // нет пересечения — обновляем конец
            }
        }
        return removed;
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
      explanation: 'Классическая задача на Activity Selection. Сортируя по концу и жадно выбирая интервалы, которые заканчиваются раньше, мы максимизируем количество непересекающихся интервалов. O(n log n).'
    },
    {
      id: 7,
      title: 'Meeting Rooms II',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив интервалов встреч intervals[i] = [start, end]. Найди минимальное количество переговорных комнат, необходимых для проведения всех встреч.',
      requirements: [
        'Метод int minMeetingRooms(int[][] intervals)',
        'Подход: раздели на два массива — starts и ends, отсортируй оба',
        'Два указателя: если starts[i] < ends[j] — нужна ещё комната, иначе — освобождается',
        'Или используй min-heap (PriorityQueue) по времени окончания',
        'Пример: [[0,30],[5,10],[15,20]] → 2',
        'Пример: [[7,10],[2,4]] → 1'
      ],
      expectedOutput: '[[0,30],[5,10],[15,20]] → 2\n[[7,10],[2,4]] → 1\n[[0,5],[5,10],[10,15]] → 1\n[[1,5],[2,6],[3,7]] → 3',
      hint: 'Метод двух массивов: отсортируй starts и ends отдельно. Проходи starts: если start < текущий end — нужна комната, иначе — двигай end-указатель.',
      solution: `import java.util.Arrays;

public class Main {
    static int minMeetingRooms(int[][] intervals) {
        int n = intervals.length;
        int[] starts = new int[n];
        int[] ends = new int[n];
        for (int i = 0; i < n; i++) {
            starts[i] = intervals[i][0];
            ends[i] = intervals[i][1];
        }
        Arrays.sort(starts);
        Arrays.sort(ends);

        int rooms = 0, endPtr = 0;
        for (int i = 0; i < n; i++) {
            if (starts[i] < ends[endPtr]) {
                rooms++; // нужна ещё одна комната
            } else {
                endPtr++; // встреча закончилась — освобождаем комнату
            }
        }
        return rooms;
    }

    public static void main(String[] args) {
        System.out.println("[[0,30],[5,10],[15,20]] → " +
            minMeetingRooms(new int[][]{{0,30},{5,10},{15,20}}));
        System.out.println("[[7,10],[2,4]] → " +
            minMeetingRooms(new int[][]{{7,10},{2,4}}));
        System.out.println("[[0,5],[5,10],[10,15]] → " +
            minMeetingRooms(new int[][]{{0,5},{5,10},{10,15}}));
        System.out.println("[[1,5],[2,6],[3,7]] → " +
            minMeetingRooms(new int[][]{{1,5},{2,6},{3,7}}));
    }
}`,
      explanation: 'Разделяем на starts и ends и сортируем. Каждый start — новая встреча начинается. Если она начинается раньше, чем самая ранняя заканчивается — нужна комната. Иначе переиспользуем. O(n log n).'
    },
    {
      id: 8,
      title: 'Partition Labels',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s. Раздели её на максимальное количество частей так, чтобы каждая буква встречалась максимум в одной части. Верни размеры частей.',
      requirements: [
        'Метод List<Integer> partitionLabels(String s)',
        'Шаг 1: запомни последнее вхождение каждого символа (last[c])',
        'Шаг 2: идём слева направо, расширяя "окно" до max(last[c])',
        'Когда текущий индекс == конец окна — отрезаем часть',
        'Пример: "ababcbacadefegdehijhklij" → [9,7,8]',
        'Пример: "eccbbbbdec" → [10]'
      ],
      expectedOutput: '"ababcbacadefegdehijhklij" → [9, 7, 8]\n"eccbbbbdec" → [10]\n"abcabc" → [6]',
      hint: 'Для каждого символа запомни его последнюю позицию. Затем, идя слева направо, расширяй конец текущей части до last[текущий символ]. Когда i == end — часть завершена.',
      solution: `import java.util.*;

public class Main {
    static List<Integer> partitionLabels(String s) {
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++) {
            last[s.charAt(i) - 'a'] = i; // последнее вхождение
        }

        List<Integer> result = new ArrayList<>();
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, last[s.charAt(i) - 'a']);
            if (i == end) { // все символы текущей части уместились
                result.add(end - start + 1);
                start = i + 1;
            }
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println("\\"ababcbacadefegdehijhklij\\" → " +
            partitionLabels("ababcbacadefegdehijhklij"));
        System.out.println("\\"eccbbbbdec\\" → " +
            partitionLabels("eccbbbbdec"));
        System.out.println("\\"abcabc\\" → " +
            partitionLabels("abcabc"));
    }
}`,
      explanation: 'Жадно: для каждого символа знаем его последнее вхождение. Расширяем окно текущей части, пока все символы внутри окна не "закончатся". Когда i == end — часть завершена. O(n) время.'
    },
    {
      id: 9,
      title: 'Queue Reconstruction by Height',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив людей people[i] = [h, k], где h — рост, k — количество людей ростом >= h, стоящих перед ним в очереди. Восстанови очередь.',
      requirements: [
        'Метод int[][] reconstructQueue(int[][] people)',
        'Отсортируй по росту (h) убывающе, при равном h — по k возрастающе',
        'Вставляй людей в результат на позицию k (insert at index k)',
        'Высокие люди "не видят" низких, поэтому вставляются первыми',
        'Пример: [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]] → [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]',
        'Сложность O(n^2) из-за вставок'
      ],
      expectedOutput: '[[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]\n→ [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]',
      hint: 'Сортировка по убыванию роста гарантирует, что при вставке человека все уже вставленные ростом >= его роста. Значит k — корректная позиция для insert.',
      solution: `import java.util.*;

public class Main {
    static int[][] reconstructQueue(int[][] people) {
        // Сортируем: по h убывающе, при равном h — по k возрастающе
        Arrays.sort(people, (a, b) -> a[0] != b[0] ? b[0] - a[0] : a[1] - b[1]);

        List<int[]> result = new ArrayList<>();
        for (int[] person : people) {
            result.add(person[1], person); // вставляем на позицию k
        }
        return result.toArray(new int[0][]);
    }

    public static void main(String[] args) {
        int[][] people = {{7,0},{4,4},{7,1},{5,0},{6,1},{5,2}};
        int[][] queue = reconstructQueue(people);
        System.out.println("[[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]");
        System.out.print("→ [");
        for (int i = 0; i < queue.length; i++) {
            System.out.print("[" + queue[i][0] + "," + queue[i][1] + "]");
            if (i < queue.length - 1) System.out.print(",");
        }
        System.out.println("]");
    }
}`,
      explanation: 'Жадная стратегия: сортируем по убыванию роста. Вставляем каждого человека на позицию k. Поскольку более высокие уже на месте, значение k для текущего человека — точная позиция вставки. O(n^2) из-за List.add(index).'
    },
    {
      id: 10,
      title: 'Minimum Number of Arrows to Burst Balloons',
      type: 'practice',
      difficulty: 'medium',
      description: 'Шарики на плоскости представлены интервалами [xstart, xend]. Стрела, запущенная по оси x, лопает все шарики, чей интервал содержит эту координату. Найди минимальное количество стрел, чтобы лопнуть все шарики.',
      requirements: [
        'Метод int findMinArrowShots(int[][] points)',
        'Отсортируй по xend (концу интервала)',
        'Жадно: стреляй в конец самого раннего шарика',
        'Если следующий шарик начинается после выстрела — нужна новая стрела',
        'Пример: [[10,16],[2,8],[1,6],[7,12]] → 2',
        'Пример: [[1,2],[3,4],[5,6],[7,8]] → 4'
      ],
      expectedOutput: '[[10,16],[2,8],[1,6],[7,12]] → 2\n[[1,2],[3,4],[5,6],[7,8]] → 4\n[[1,2],[2,3],[3,4],[4,5]] → 2',
      hint: 'Сортируй по end. Стреляй в end первого шарика. Все шарики, чей start <= этого end, тоже лопнут. Когда start > текущего end — нужна новая стрела.',
      solution: `import java.util.Arrays;

public class Main {
    static int findMinArrowShots(int[][] points) {
        if (points.length == 0) return 0;
        // Сортировка по end, аккуратно с overflow
        Arrays.sort(points, (a, b) -> Integer.compare(a[1], b[1]));

        int arrows = 1;
        int arrowPos = points[0][1]; // стреляем в конец первого

        for (int i = 1; i < points.length; i++) {
            if (points[i][0] > arrowPos) {
                arrows++;
                arrowPos = points[i][1]; // новая стрела
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
      explanation: 'Аналог Activity Selection / Non-overlapping Intervals. Сортируем по end, жадно стреляем в end текущего "крайнего" шарика. Все шарики, покрывающие эту точку, лопаются. O(n log n).'
    }
  ]
}
