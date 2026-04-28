export default {
  id: 95,
  title: 'Практикум: Mock-интервью задачи',
  description: 'Типичные задачи технических интервью: Product of Array, Valid Sudoku, Rotate Array, String Compression, Happy Number и другие.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Product of Array Except Self',
      type: 'practice',
      difficulty: 'medium',
      description: 'Для каждого элемента массива верни произведение всех остальных элементов. Без деления, за O(n).',
      requirements: [
        'Метод productExceptSelf(int[] nums) возвращает int[]',
        'Без использования оператора деления (/)',
        'O(n) время, O(1) дополнительной памяти (кроме результата)',
        'Протестировать: [1,2,3,4] → [24,12,8,6]'
      ],
      expectedOutput: '[24, 12, 8, 6]\n[0, 0, 9, 0, 0]',
      hint: 'Два прохода: prefix слева и suffix справа. result[i] = prefix[0..i-1] * suffix[i+1..n]. Первый проход: result[i] = произведение слева. Второй проход: домножаем на произведение справа.',
      solution: `import java.util.Arrays;

public class Main {
    static int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        result[0] = 1;
        for (int i = 1; i < n; i++)
            result[i] = result[i - 1] * nums[i - 1];
        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= suffix;
            suffix *= nums[i];
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(productExceptSelf(new int[]{1,2,3,4})));
        System.out.println(Arrays.toString(productExceptSelf(new int[]{-1,1,0,-3,3})));
    }
}`,
      explanation: 'Два прохода без деления. Первый проход (→): result[i] = произведение всех элементов слева от i. Второй проход (←): домножаем на произведение всех элементов справа. suffix — бегущее произведение справа. O(n) время, O(1) дополнительной памяти.'
    },
    {
      id: 2,
      title: 'Задача: Valid Sudoku',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проверь, является ли заполненная/частично заполненная доска Судоку валидной. Каждая строка, столбец и 3x3 блок содержат уникальные цифры 1-9.',
      requirements: [
        'Метод isValidSudoku(char[][] board) возвращает boolean',
        'Проверить строки, столбцы и 3x3 блоки',
        'Точка (.) означает пустую ячейку',
        'HashSet для отслеживания дубликатов'
      ],
      expectedOutput: 'true\nfalse',
      hint: 'Один проход: для каждой цифры добавляй в Set строки типа "row-0-5", "col-3-5", "box-0-1-5" (row-col-val). Если add() вернул false — дубликат.',
      solution: `import java.util.HashSet;
import java.util.Set;

public class Main {
    static boolean isValidSudoku(char[][] board) {
        Set<String> seen = new HashSet<>();
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                char c = board[i][j];
                if (c == '.') continue;
                if (!seen.add("row" + i + c) ||
                    !seen.add("col" + j + c) ||
                    !seen.add("box" + i/3 + j/3 + c))
                    return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        char[][] valid = {
            {'5','3','.','.','7','.','.','.','.'},
            {'6','.','.','1','9','5','.','.','.'},
            {'.','9','8','.','.','.','.','6','.'},
            {'8','.','.','.','6','.','.','.','3'},
            {'4','.','.','8','.','3','.','.','1'},
            {'7','.','.','.','2','.','.','.','6'},
            {'.','6','.','.','.','.','2','8','.'},
            {'.','.','.','4','1','9','.','.','5'},
            {'.','.','.','.','8','.','.','7','9'}
        };
        System.out.println(isValidSudoku(valid));

        char[][] invalid = {
            {'8','3','.','.','7','.','.','.','.'},
            {'6','.','.','1','9','5','.','.','.'},
            {'.','9','8','.','.','.','.','6','.'},
            {'8','.','.','.','6','.','.','.','3'},
            {'4','.','.','8','.','3','.','.','1'},
            {'7','.','.','.','2','.','.','.','6'},
            {'.','6','.','.','.','.','2','8','.'},
            {'.','.','.','4','1','9','.','.','5'},
            {'.','.','.','.','8','.','.','7','9'}
        };
        System.out.println(isValidSudoku(invalid));
    }
}`,
      explanation: 'Элегантный подход: одно множество хранит encoded строки для строк, столбцов и блоков. Если add() возвращает false — элемент уже есть (дубликат). i/3 и j/3 определяют номер 3x3 блока. Один проход O(81) = O(1) по определению Судоку.'
    },
    {
      id: 3,
      title: 'Задача: Rotate Array',
      type: 'practice',
      difficulty: 'medium',
      description: 'Поверни массив вправо на k позиций. [1,2,3,4,5,6,7], k=3 → [5,6,7,1,2,3,4].',
      requirements: [
        'Метод rotate(int[] nums, int k) — in-place',
        'O(n) время, O(1) память',
        'Подход: три реверса',
        'Протестировать: [1,2,3,4,5,6,7] k=3 → [5,6,7,1,2,3,4]'
      ],
      expectedOutput: '[5, 6, 7, 1, 2, 3, 4]\n[3, 99, -1, -100]',
      hint: 'Три реверса: 1) Весь массив. 2) Первые k элементов. 3) Оставшиеся n-k. Пример: [1,2,3,4,5] k=2 → [5,4,3,2,1] → [4,5,3,2,1] → [4,5,1,2,3].',
      solution: `import java.util.Arrays;

public class Main {
    static void rotate(int[] nums, int k) {
        k %= nums.length;
        reverse(nums, 0, nums.length - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, nums.length - 1);
    }

    static void reverse(int[] arr, int l, int r) {
        while (l < r) {
            int tmp = arr[l]; arr[l] = arr[r]; arr[r] = tmp;
            l++; r--;
        }
    }

    public static void main(String[] args) {
        int[] a = {1,2,3,4,5,6,7};
        rotate(a, 3);
        System.out.println(Arrays.toString(a));

        int[] b = {-1,-100,3,99};
        rotate(b, 2);
        System.out.println(Arrays.toString(b));
    }
}`,
      explanation: 'Три реверса — математически доказанный трюк для ротации за O(n), O(1). k %= n для обработки k > n. Реверс всего массива «переворачивает» порядок, затем два частичных реверса восстанавливают порядок внутри двух частей.'
    },
    {
      id: 4,
      title: 'Задача: Move Zeroes',
      type: 'practice',
      difficulty: 'easy',
      description: 'Перемести все нули в конец массива, сохраняя порядок ненулевых элементов. In-place.',
      requirements: [
        'Метод moveZeroes(int[] nums) — in-place',
        'Сохранить относительный порядок ненулевых',
        'Минимум операций записи',
        'Протестировать: [0,1,0,3,12] → [1,3,12,0,0]'
      ],
      expectedOutput: '[1, 3, 12, 0, 0]\n[0]',
      hint: 'Two pointers: slow указывает на позицию для следующего ненулевого. Fast сканирует массив. Swap nums[slow] и nums[fast] когда fast находит ненулевой.',
      solution: `import java.util.Arrays;

public class Main {
    static void moveZeroes(int[] nums) {
        int slow = 0;
        for (int fast = 0; fast < nums.length; fast++) {
            if (nums[fast] != 0) {
                int tmp = nums[slow]; nums[slow] = nums[fast]; nums[fast] = tmp;
                slow++;
            }
        }
    }

    public static void main(String[] args) {
        int[] a = {0, 1, 0, 3, 12};
        moveZeroes(a);
        System.out.println(Arrays.toString(a));

        int[] b = {0};
        moveZeroes(b);
        System.out.println(Arrays.toString(b));
    }
}`,
      explanation: 'Snowball technique: slow — позиция для следующего ненулевого. Swap перемещает ненулевой элемент на место slow, а ноль — на место fast. slow растёт только при swap, поэтому нули «накапливаются» в конце. O(n) один проход.'
    },
    {
      id: 5,
      title: 'Задача: Happy Number',
      type: 'practice',
      difficulty: 'easy',
      description: 'Число «счастливое» если цепочка сумм квадратов цифр приводит к 1. Если зацикливается — не счастливое. Пример: 19 → 82 → 68 → 100 → 1 ✓',
      requirements: [
        'Метод isHappy(int n) возвращает boolean',
        'Обнаружение цикла через Floyd или HashSet',
        'Протестировать: 19 → true, 2 → false'
      ],
      expectedOutput: 'true\nfalse\ntrue',
      hint: 'Floyd: slow = одно вычисление, fast = два. Если встретились и != 1 — цикл. Или HashSet для обнаружения повтора.',
      solution: `public class Main {
    static int sumOfSquares(int n) {
        int sum = 0;
        while (n > 0) {
            int d = n % 10;
            sum += d * d;
            n /= 10;
        }
        return sum;
    }

    static boolean isHappy(int n) {
        int slow = n, fast = n;
        do {
            slow = sumOfSquares(slow);
            fast = sumOfSquares(sumOfSquares(fast));
        } while (slow != fast);
        return slow == 1;
    }

    public static void main(String[] args) {
        System.out.println(isHappy(19));
        System.out.println(isHappy(2));
        System.out.println(isHappy(7));
    }
}`,
      explanation: 'Floyd cycle detection: если последовательность зацикливается (не в 1), slow и fast встретятся в цикле. Если встретились на 1 — число счастливое. Доказано что последовательность всегда либо приходит к 1, либо зацикливается. O(1) память с Floyd.'
    },
    {
      id: 6,
      title: 'Задача: String Compression',
      type: 'practice',
      difficulty: 'medium',
      description: 'Сожми массив символов in-place: ["a","a","b","b","c","c","c"] → ["a","2","b","2","c","3"]. Верни новую длину.',
      requirements: [
        'Метод compress(char[] chars) возвращает int (новая длина)',
        'In-place, O(1) дополнительной памяти',
        'Если символ встречается 1 раз — не добавлять цифру',
        'Протестировать: ["a","a","b","b","c","c","c"] → 6, ["a"] → 1'
      ],
      expectedOutput: '6 [a, 2, b, 2, c, 3]\n1 [a]',
      hint: 'Two pointers: read сканирует, write записывает. Для каждой группы одинаковых символов: записать символ, затем цифры количества (если > 1).',
      solution: `import java.util.Arrays;

public class Main {
    static int compress(char[] chars) {
        int write = 0, read = 0;
        while (read < chars.length) {
            char cur = chars[read];
            int count = 0;
            while (read < chars.length && chars[read] == cur) {
                read++; count++;
            }
            chars[write++] = cur;
            if (count > 1) {
                for (char c : String.valueOf(count).toCharArray()) {
                    chars[write++] = c;
                }
            }
        }
        return write;
    }

    public static void main(String[] args) {
        char[] a = {'a','a','b','b','c','c','c'};
        int len = compress(a);
        System.out.println(len + " " + Arrays.toString(Arrays.copyOf(a, len)));

        char[] b = {'a'};
        len = compress(b);
        System.out.println(len + " " + Arrays.toString(Arrays.copyOf(b, len)));
    }
}`,
      explanation: 'Read-write pointers: read считает группы, write записывает сжатую версию. Ключевое: write всегда <= read, поэтому мы не перезаписываем непрочитанные данные. String.valueOf(count) для записи многоразрядных чисел. O(n) время, O(1) память.'
    },
    {
      id: 7,
      title: 'Задача: First Unique Character in String',
      type: 'practice',
      difficulty: 'easy',
      description: 'Найди индекс первого неповторяющегося символа в строке. Если нет — вернуть -1.',
      requirements: [
        'Метод firstUniqChar(String s) возвращает int',
        'O(n) время',
        'Протестировать: "leetcode" → 0, "loveleetcode" → 2, "aabb" → -1'
      ],
      expectedOutput: '0\n2\n-1',
      hint: 'Два прохода: 1) Подсчитай частоту каждого символа. 2) Найди первый с частотой 1.',
      solution: `public class Main {
    static int firstUniqChar(String s) {
        int[] freq = new int[26];
        for (char c : s.toCharArray()) freq[c - 'a']++;
        for (int i = 0; i < s.length(); i++) {
            if (freq[s.charAt(i) - 'a'] == 1) return i;
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(firstUniqChar("leetcode"));
        System.out.println(firstUniqChar("loveleetcode"));
        System.out.println(firstUniqChar("aabb"));
    }
}`,
      explanation: 'Два прохода O(n) каждый. Массив freq[26] — быстрее HashMap для символов. Первый проход подсчитывает, второй находит первый с freq==1. LinkedHashMap альтернатива для сохранения порядка вставки.'
    },
    {
      id: 8,
      title: 'Задача: Power(x, n)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Вычисли x^n. Поддержи отрицательные степени. Используй быстрое возведение в степень O(log n).',
      requirements: [
        'Метод myPow(double x, int n) возвращает double',
        'Быстрое возведение в степень (binary exponentiation)',
        'Обработка n < 0: x^(-n) = 1/x^n',
        'Протестировать: pow(2,10)=1024, pow(2,-2)=0.25'
      ],
      expectedOutput: '1024.0\n0.25\n9.261',
      hint: 'x^n = (x^(n/2))^2 если n чётный. x^n = x * (x^(n/2))^2 если n нечётный. Рекурсия или итеративно через биты n.',
      solution: `public class Main {
    static double myPow(double x, int n) {
        long N = n;
        if (N < 0) { x = 1 / x; N = -N; }
        double result = 1;
        while (N > 0) {
            if (N % 2 == 1) result *= x;
            x *= x;
            N /= 2;
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(myPow(2, 10));
        System.out.println(myPow(2, -2));
        System.out.println(Math.round(myPow(2.1, 3) * 1000.0) / 1000.0);
    }
}`,
      explanation: 'Binary exponentiation: O(log n). Проходим по битам n: если бит = 1, умножаем result на текущую степень x. На каждом шаге x *= x (удваиваем степень). long N для обработки Integer.MIN_VALUE (|-2^31| > 2^31 - 1). Для n < 0: x = 1/x.'
    },
    {
      id: 9,
      title: 'Задача: Intersection of Two Arrays II',
      type: 'practice',
      difficulty: 'easy',
      description: 'Найди пересечение двух массивов с учётом количества. [1,2,2,1] ∩ [2,2] = [2,2].',
      requirements: [
        'Метод intersect(int[] nums1, int[] nums2) возвращает int[]',
        'Элемент в результате столько раз, сколько он есть в обоих массивах',
        'Два подхода: HashMap и сортировка + two pointers',
        'Протестировать: [1,2,2,1]∩[2,2]→[2,2], [4,9,5]∩[9,4,9,8,4]→[4,9]'
      ],
      expectedOutput: '[2, 2]\n[4, 9]',
      hint: 'HashMap: подсчитай частоты в меньшем массиве. Пройди по большему — если есть в map и count > 0, добавь в результат и уменьши count.',
      solution: `import java.util.*;

public class Main {
    static int[] intersect(int[] nums1, int[] nums2) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int n : nums1) map.merge(n, 1, Integer::sum);
        List<Integer> result = new ArrayList<>();
        for (int n : nums2) {
            if (map.getOrDefault(n, 0) > 0) {
                result.add(n);
                map.merge(n, -1, Integer::sum);
            }
        }
        return result.stream().mapToInt(Integer::intValue).toArray();
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(intersect(new int[]{1,2,2,1}, new int[]{2,2})));
        System.out.println(Arrays.toString(intersect(new int[]{4,9,5}, new int[]{9,4,9,8,4})));
    }
}`,
      explanation: 'HashMap подход O(n+m): подсчёт частот первого массива, затем проход по второму с уменьшением count. merge() с Integer::sum элегантно инкрементирует/декрементирует. Альтернатива: сортировка + two pointers O(n log n), но лучше для больших данных на диске (follow-up вопрос).'
    },
    {
      id: 10,
      title: 'Задача: Sliding Window Maximum',
      type: 'practice',
      difficulty: 'hard',
      description: 'Найди максимум в каждом окне размера k, скользящем по массиву. [1,3,-1,-3,5,3,6,7] k=3 → [3,3,5,5,6,7].',
      requirements: [
        'Метод maxSlidingWindow(int[] nums, int k) возвращает int[]',
        'Использовать Deque (monotonic decreasing)',
        'O(n) время',
        'Протестировать: [1,3,-1,-3,5,3,6,7] k=3 → [3,3,5,5,6,7]'
      ],
      expectedOutput: '[3, 3, 5, 5, 6, 7]\n[1]',
      hint: 'Монотонная очередь: deque хранит индексы в порядке убывания значений. Front = максимум окна. При добавлении нового — удаляй все меньшие с back. При сдвиге окна — удаляй front если вышел за окно.',
      solution: `import java.util.*;

public class Main {
    static int[] maxSlidingWindow(int[] nums, int k) {
        Deque<Integer> deque = new ArrayDeque<>();
        int[] result = new int[nums.length - k + 1];
        for (int i = 0; i < nums.length; i++) {
            // Remove elements outside window
            while (!deque.isEmpty() && deque.peekFirst() < i - k + 1)
                deque.pollFirst();
            // Remove smaller elements from back
            while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i])
                deque.pollLast();
            deque.offerLast(i);
            if (i >= k - 1)
                result[i - k + 1] = nums[deque.peekFirst()];
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(
            maxSlidingWindow(new int[]{1,3,-1,-3,5,3,6,7}, 3)));
        System.out.println(Arrays.toString(
            maxSlidingWindow(new int[]{1}, 1)));
    }
}`,
      explanation: 'Монотонная убывающая очередь: front всегда максимум текущего окна. При добавлении нового элемента удаляем все меньшие с back (они никогда не будут максимумом). При сдвиге окна проверяем front — если вышел за границу, удаляем. Каждый элемент добавляется и удаляется из deque ровно один раз → O(n) амортизировано.'
    }
  ]
}
