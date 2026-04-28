export default {
  id: 92,
  title: 'Практикум: Greedy алгоритмы',
  description: 'Жадные алгоритмы: Jump Game, Gas Station, Candy, Task Scheduler, интервалы и оптимальный выбор.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Jump Game',
      type: 'practice',
      difficulty: 'medium',
      description: 'Массив неотрицательных чисел, каждое — максимальная длина прыжка. Определи, можно ли добраться до последнего индекса.',
      requirements: [
        'Метод canJump(int[] nums) возвращает boolean',
        'Greedy: отслеживай максимальную достижимую позицию',
        'Протестировать: [2,3,1,1,4]→true, [3,2,1,0,4]→false'
      ],
      expectedOutput: 'true\nfalse',
      hint: 'Пройди массив слева направо. Обновляй maxReach = max(maxReach, i + nums[i]). Если i > maxReach — не можем добраться.',
      solution: `public class Main {
    static boolean canJump(int[] nums) {
        int maxReach = 0;
        for (int i = 0; i < nums.length; i++) {
            if (i > maxReach) return false;
            maxReach = Math.max(maxReach, i + nums[i]);
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(canJump(new int[]{2,3,1,1,4}));
        System.out.println(canJump(new int[]{3,2,1,0,4}));
    }
}`,
      explanation: 'Greedy: на каждом шаге обновляем максимально достижимую позицию. Если текущий индекс > maxReach, мы застряли. O(n) времени, O(1) памяти. Жадный выбор: всегда прыгаем как можно дальше.'
    },
    {
      id: 2,
      title: 'Задача: Jump Game II',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди минимальное количество прыжков для достижения последнего индекса. Гарантировано, что это возможно.',
      requirements: [
        'Метод jump(int[] nums) возвращает int',
        'Greedy: BFS-подобный подход с уровнями',
        'Протестировать: [2,3,1,1,4]→2, [2,3,0,1,4]→2'
      ],
      expectedOutput: '2\n2',
      hint: 'Представь как BFS по уровням: текущий уровень — все позиции достижимые за k прыжков. Когда i выходит за конец текущего уровня — нужен ещё один прыжок.',
      solution: `public class Main {
    static int jump(int[] nums) {
        int jumps = 0, currEnd = 0, farthest = 0;
        for (int i = 0; i < nums.length - 1; i++) {
            farthest = Math.max(farthest, i + nums[i]);
            if (i == currEnd) {
                jumps++;
                currEnd = farthest;
            }
        }
        return jumps;
    }

    public static void main(String[] args) {
        System.out.println(jump(new int[]{2,3,1,1,4}));
        System.out.println(jump(new int[]{2,3,0,1,4}));
    }
}`,
      explanation: 'BFS-подобный greedy: currEnd — конец текущего «уровня». Пока i <= currEnd, обновляем farthest. Когда i == currEnd — переходим на следующий уровень (jumps++). O(n) один проход. Ключевая идея: откладываем прыжок до последнего момента, выбирая максимально дальнюю точку.'
    },
    {
      id: 3,
      title: 'Задача: Gas Station',
      type: 'practice',
      difficulty: 'medium',
      description: 'Кольцевой маршрут с заправками. На станции i получаешь gas[i] топлива, до следующей тратишь cost[i]. Найди стартовую станцию для полного круга.',
      requirements: [
        'Метод canCompleteCircuit(int[] gas, int[] cost) возвращает int (индекс) или -1',
        'Greedy: если total gas >= total cost — решение существует',
        'Протестировать: gas=[1,2,3,4,5] cost=[3,4,5,1,2] → 3'
      ],
      expectedOutput: '3\n-1',
      hint: 'Если сумма gas >= сумма cost, решение есть. Стартуй с позиции после последнего «провала» бака. Если tank < 0 — перезапускай с i+1.',
      solution: `public class Main {
    static int canCompleteCircuit(int[] gas, int[] cost) {
        int totalTank = 0, currTank = 0, start = 0;
        for (int i = 0; i < gas.length; i++) {
            int diff = gas[i] - cost[i];
            totalTank += diff;
            currTank += diff;
            if (currTank < 0) {
                start = i + 1;
                currTank = 0;
            }
        }
        return totalTank >= 0 ? start : -1;
    }

    public static void main(String[] args) {
        System.out.println(canCompleteCircuit(new int[]{1,2,3,4,5}, new int[]{3,4,5,1,2}));
        System.out.println(canCompleteCircuit(new int[]{2,3,4}, new int[]{3,4,3}));
    }
}`,
      explanation: 'Два наблюдения: 1) Если total gas >= total cost — решение существует и единственно. 2) Если tank уходит в минус на i — стартовать нужно с i+1 (все станции 0..i не подходят как старт). O(n) один проход, O(1) память.'
    },
    {
      id: 4,
      title: 'Задача: Candy Distribution',
      type: 'practice',
      difficulty: 'hard',
      description: 'N детей стоят в ряду с рейтингами. Раздай конфеты: каждому хотя бы 1, ребёнок с большим рейтингом чем сосед получает больше конфет. Минимизируй общее количество.',
      requirements: [
        'Метод candy(int[] ratings) возвращает int',
        'Два прохода: слева направо и справа налево',
        'Протестировать: [1,0,2]→5, [1,2,2]→4'
      ],
      expectedOutput: '5\n4',
      hint: 'Первый проход (→): если rating[i] > rating[i-1], candy[i] = candy[i-1]+1. Второй проход (←): если rating[i] > rating[i+1], candy[i] = max(candy[i], candy[i+1]+1).',
      solution: `import java.util.Arrays;

public class Main {
    static int candy(int[] ratings) {
        int n = ratings.length;
        int[] candies = new int[n];
        Arrays.fill(candies, 1);
        for (int i = 1; i < n; i++) {
            if (ratings[i] > ratings[i - 1])
                candies[i] = candies[i - 1] + 1;
        }
        for (int i = n - 2; i >= 0; i--) {
            if (ratings[i] > ratings[i + 1])
                candies[i] = Math.max(candies[i], candies[i + 1] + 1);
        }
        return Arrays.stream(candies).sum();
    }

    public static void main(String[] args) {
        System.out.println(candy(new int[]{1, 0, 2}));
        System.out.println(candy(new int[]{1, 2, 2}));
    }
}`,
      explanation: 'Два прохода разрешают противоречие между левым и правым соседями. Первый проход учитывает левого соседа, второй — правого. max() гарантирует удовлетворение обоих условий. O(n) время и O(n) память.'
    },
    {
      id: 5,
      title: 'Задача: Task Scheduler',
      type: 'practice',
      difficulty: 'medium',
      description: 'CPU выполняет задачи с cooldown: одинаковые задачи должны быть разделены минимум n интервалами. Найди минимальное время выполнения всех задач.',
      requirements: [
        'Метод leastInterval(char[] tasks, int n) возвращает int',
        'Подсчитать частоты задач',
        'Формула: (maxFreq - 1) * (n + 1) + countOfMaxFreq',
        'Протестировать: ["A","A","A","B","B","B"] n=2 → 8'
      ],
      expectedOutput: '8\n6',
      hint: 'Самая частая задача определяет каркас. Между её выполнениями — n слотов. Другие задачи заполняют эти слоты. Если задач достаточно — idle не нужен.',
      solution: `public class Main {
    static int leastInterval(char[] tasks, int n) {
        int[] freq = new int[26];
        for (char t : tasks) freq[t - 'A']++;
        int maxFreq = 0;
        for (int f : freq) maxFreq = Math.max(maxFreq, f);
        int maxCount = 0;
        for (int f : freq) if (f == maxFreq) maxCount++;
        int result = (maxFreq - 1) * (n + 1) + maxCount;
        return Math.max(result, tasks.length);
    }

    public static void main(String[] args) {
        System.out.println(leastInterval(new char[]{'A','A','A','B','B','B'}, 2));
        System.out.println(leastInterval(new char[]{'A','A','A','B','B','B'}, 0));
    }
}`,
      explanation: 'Формула: (maxFreq-1) группы по (n+1) слотов + задачи с макс. частотой. Пример: AAABBB, n=2 → A_B_A_B_AB → (3-1)*(2+1)+2=8. Если задач много — idle не нужен, ответ = tasks.length. max() выбирает больший из двух вариантов.'
    },
    {
      id: 6,
      title: 'Задача: Non-overlapping Intervals',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди минимальное количество интервалов, которые нужно удалить, чтобы оставшиеся не пересекались.',
      requirements: [
        'Метод eraseOverlapIntervals(int[][] intervals) возвращает int',
        'Greedy: сортировка по концу интервала',
        'Протестировать: [[1,2],[2,3],[3,4],[1,3]]→1'
      ],
      expectedOutput: '1\n2',
      hint: 'Сортируй по end. Всегда выбирай интервал с наименьшим end — он оставляет больше места для следующих. Это классическая задача Activity Selection.',
      solution: `import java.util.Arrays;

public class Main {
    static int eraseOverlapIntervals(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
        int count = 0, end = Integer.MIN_VALUE;
        for (int[] interval : intervals) {
            if (interval[0] >= end) {
                end = interval[1];
            } else {
                count++;
            }
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println(eraseOverlapIntervals(new int[][]{{1,2},{2,3},{3,4},{1,3}}));
        System.out.println(eraseOverlapIntervals(new int[][]{{1,2},{1,2},{1,2}}));
    }
}`,
      explanation: 'Activity Selection: сортировка по концу гарантирует оптимальный жадный выбор. Выбирая интервал с наименьшим end, мы максимизируем место для оставшихся интервалов. Удалённые = total - выбранные. O(n log n) из-за сортировки.'
    },
    {
      id: 7,
      title: 'Задача: Minimum Number of Arrows',
      type: 'practice',
      difficulty: 'medium',
      description: 'Воздушные шары на оси X, каждый — интервал [start, end]. Стрела, выпущенная в x, лопает все шары где start <= x <= end. Найди минимум стрел.',
      requirements: [
        'Метод findMinArrowShots(int[][] points) возвращает int',
        'Сортировка по end',
        'Greedy: стрела в конец текущего шара',
        'Протестировать: [[10,16],[2,8],[1,6],[7,12]]→2'
      ],
      expectedOutput: '2\n4',
      hint: 'Сортируй по end. Стреляй в end первого шара. Все шары, начало которых <= текущей стрелы, тоже лопнут. Следующая стрела — в end следующего не лопнутого.',
      solution: `import java.util.Arrays;

public class Main {
    static int findMinArrowShots(int[][] points) {
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
        System.out.println(findMinArrowShots(new int[][]{{10,16},{2,8},{1,6},{7,12}}));
        System.out.println(findMinArrowShots(new int[][]{{1,2},{3,4},{5,6},{7,8}}));
    }
}`,
      explanation: 'Аналог Activity Selection. Сортировка по end, стрела в конец текущего кластера. Если start следующего > текущей стрелы — нужна новая стрела. Integer.compare вместо вычитания — избегает overflow при больших числах.'
    },
    {
      id: 8,
      title: 'Задача: Queue Reconstruction by Height',
      type: 'practice',
      difficulty: 'medium',
      description: 'Люди в очереди: [h, k] где h=рост, k=количество людей с ростом >= h перед ним. Восстанови очередь.',
      requirements: [
        'Метод reconstructQueue(int[][] people) возвращает int[][]',
        'Сортировка: по h убыванию, при равном h — по k возрастанию',
        'Вставка на позицию k в результирующий список',
        'Протестировать: [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]] → [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]'
      ],
      expectedOutput: '[[5,0], [7,0], [5,2], [6,1], [4,4], [7,1]]',
      hint: 'Высокие люди не видят низких. Сортируй по росту убыванию. Вставляй каждого на позицию k — высокие уже на местах и не сдвинутся.',
      solution: `import java.util.*;

public class Main {
    static int[][] reconstructQueue(int[][] people) {
        Arrays.sort(people, (a, b) -> a[0] != b[0] ? b[0] - a[0] : a[1] - b[1]);
        List<int[]> result = new ArrayList<>();
        for (int[] p : people) {
            result.add(p[1], p);
        }
        return result.toArray(new int[0][]);
    }

    public static void main(String[] args) {
        int[][] res = reconstructQueue(new int[][]{{7,0},{4,4},{7,1},{5,0},{6,1},{5,2}});
        System.out.println(Arrays.deepToString(res));
    }
}`,
      explanation: 'Greedy: обрабатываем от высоких к низким. Высокие не «видят» низких, поэтому k для них корректно. Низких вставляем на позицию k — они не влияют на k высоких (высокие остаются «видимыми»). O(n²) из-за вставки в ArrayList.'
    },
    {
      id: 9,
      title: 'Задача: Best Time to Buy and Sell Stock II',
      type: 'practice',
      difficulty: 'easy',
      description: 'Можно совершать неограниченное количество сделок (купить и продать). Найди максимальную прибыль.',
      requirements: [
        'Метод maxProfit(int[] prices) возвращает int',
        'Greedy: собирай все восходящие разности',
        'Протестировать: [7,1,5,3,6,4]→7, [1,2,3,4,5]→4'
      ],
      expectedOutput: '7\n4\n0',
      hint: 'Если завтра дороже чем сегодня — покупай сегодня, продавай завтра. Суммируй все положительные разности prices[i]-prices[i-1].',
      solution: `public class Main {
    static int maxProfit(int[] prices) {
        int profit = 0;
        for (int i = 1; i < prices.length; i++) {
            if (prices[i] > prices[i - 1])
                profit += prices[i] - prices[i - 1];
        }
        return profit;
    }

    public static void main(String[] args) {
        System.out.println(maxProfit(new int[]{7,1,5,3,6,4}));
        System.out.println(maxProfit(new int[]{1,2,3,4,5}));
        System.out.println(maxProfit(new int[]{7,6,4,3,1}));
    }
}`,
      explanation: 'Жадный выбор: каждый день решаем — стоит ли «держать» акцию. Если завтра дороже — держим (эквивалентно покупке сегодня + продаже завтра). Математически: сумма всех положительных разностей соседних дней = оптимальная прибыль. O(n) один проход.'
    },
    {
      id: 10,
      title: 'Задача: Partition Labels',
      type: 'practice',
      difficulty: 'medium',
      description: 'Разбей строку на максимальное количество частей так, чтобы каждая буква встречалась только в одной части. Верни размеры частей.',
      requirements: [
        'Метод partitionLabels(String s) возвращает List<Integer>',
        'Найди последнее вхождение каждого символа',
        'Greedy: расширяй текущую часть до максимального last[c]',
        'Протестировать: "ababcbacadefegdehijhklij" → [9,7,8]'
      ],
      expectedOutput: '[9, 7, 8]\n[10]',
      hint: 'Предвычисли lastIndex для каждого символа. Проходи строку: расширяй end = max(end, last[c]). Когда i == end — текущая часть завершена.',
      solution: `import java.util.*;

public class Main {
    static List<Integer> partitionLabels(String s) {
        int[] last = new int[26];
        for (int i = 0; i < s.length(); i++)
            last[s.charAt(i) - 'a'] = i;

        List<Integer> result = new ArrayList<>();
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            end = Math.max(end, last[s.charAt(i) - 'a']);
            if (i == end) {
                result.add(end - start + 1);
                start = i + 1;
            }
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(partitionLabels("ababcbacadefegdehijhklij"));
        System.out.println(partitionLabels("eccbbbbdec"));
    }
}`,
      explanation: 'Два прохода: 1) Предвычисление последнего вхождения каждого символа. 2) Greedy расширение: для каждого символа в текущей части расширяем end до его последнего вхождения. Когда i == end — все символы текущей части «закрыты». O(n) время, O(1) память (массив 26).'
    }
  ]
}
