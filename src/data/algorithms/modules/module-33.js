export default {
  id: 33,
  title: 'Практикум: Two Pointers',
  description: '10 классических задач на паттерн двух указателей. Сортированные массивы, контейнеры с водой, удаление дубликатов, партиционирование.',
  lessons: [
    {
      id: 1,
      title: 'Two Sum II — Sorted Array (LeetCode #167)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив numbers, отсортированный по возрастанию (1-indexed). Найдите два числа с суммой target. Верните их индексы [index1, index2], где 1 <= index1 < index2.\n\nГарантируется ровно одно решение. Нельзя использовать один элемент дважды.\n\nПример:\nВход: numbers = [2, 7, 11, 15], target = 9\nВыход: [1, 2]',
      requirements: [
        'Метод twoSum(int[] numbers, int target) возвращает int[] (1-indexed)',
        'Использовать два указателя: left и right',
        'Время O(n), память O(1) — без HashMap',
        'Массив уже отсортирован — этим нужно воспользоваться'
      ],
      expectedOutput: 'Input: [2,7,11,15], target=9 → Output: [1, 2]\nInput: [2,3,4], target=6 → Output: [1, 3]\nInput: [-1,0], target=-1 → Output: [1, 2]',
      hint: 'left = 0, right = n-1. Если sum < target — left++. Если sum > target — right--. Если sum == target — нашли! Не забудь про 1-indexed ответ.',
      solution: `public class TwoSumII {
    public static int[] twoSum(int[] numbers, int target) {
        int left = 0, right = numbers.length - 1;

        while (left < right) {
            int sum = numbers[left] + numbers[right];

            if (sum == target) {
                return new int[] { left + 1, right + 1 }; // 1-indexed
            } else if (sum < target) {
                left++;  // Нужна большая сумма
            } else {
                right--; // Нужна меньшая сумма
            }
        }

        return new int[] {}; // Не найдено
    }

    public static void main(String[] args) {
        System.out.println(java.util.Arrays.toString(
            twoSum(new int[]{2, 7, 11, 15}, 9)));  // [1, 2]
        System.out.println(java.util.Arrays.toString(
            twoSum(new int[]{2, 3, 4}, 6)));        // [1, 3]
        System.out.println(java.util.Arrays.toString(
            twoSum(new int[]{-1, 0}, -1)));         // [1, 2]
    }
}`,
      explanation: 'Два указателя на отсортированном массиве — классический паттерн O(n). Если сумма мала — двигаем left (увеличиваем меньший). Если велика — двигаем right (уменьшаем больший). Каждый шаг гарантированно приближает к ответу. Не нужен HashMap, O(1) памяти.'
    },
    {
      id: 2,
      title: 'Remove Duplicates from Sorted Array (LeetCode #26)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан отсортированный массив nums. Удалите дубликаты in-place так, чтобы каждый элемент встречался один раз. Верните количество уникальных элементов k. Первые k элементов nums должны содержать уникальные значения.\n\nПример:\nВход: nums = [1, 1, 2]\nВыход: k = 2, nums = [1, 2, ...]',
      requirements: [
        'Метод removeDuplicates(int[] nums) возвращает int — количество уникальных',
        'In-place: не создавать новый массив',
        'Два указателя: write (куда писать) и read (откуда читать)',
        'Время O(n), память O(1)'
      ],
      expectedOutput: 'Input: [1,1,2] → k=2, nums=[1,2,...]\nInput: [0,0,1,1,1,2,2,3,3,4] → k=5, nums=[0,1,2,3,4,...]\nInput: [1] → k=1',
      hint: 'write = 1 (первый элемент всегда уникален). Для каждого read: если nums[read] != nums[write-1] — записываем nums[write++] = nums[read]. Массив отсортирован, поэтому дубликаты идут подряд.',
      solution: `public class RemoveDuplicates {
    public static int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;

        int write = 1; // Первый элемент всегда остаётся

        for (int read = 1; read < nums.length; read++) {
            // Если текущий отличается от предыдущего уникального
            if (nums[read] != nums[write - 1]) {
                nums[write] = nums[read];
                write++;
            }
        }

        return write; // Количество уникальных элементов
    }

    public static void main(String[] args) {
        int[] a = {1, 1, 2};
        int k1 = removeDuplicates(a);
        System.out.println("k=" + k1 + ", " + java.util.Arrays.toString(a)); // k=2

        int[] b = {0, 0, 1, 1, 1, 2, 2, 3, 3, 4};
        int k2 = removeDuplicates(b);
        System.out.println("k=" + k2 + ", " + java.util.Arrays.toString(b)); // k=5
    }
}`,
      explanation: 'Паттерн read/write указателей на отсортированном массиве. write отмечает конец уникальной части. read сканирует весь массив. Когда встречается новый элемент (отличный от nums[write-1]) — записываем его на позицию write. O(n) время, O(1) память. Элементы после write не важны.'
    },
    {
      id: 3,
      title: 'Container With Most Water (LeetCode #11)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив height длины n. Найдите два столбца, которые вместе с осью X образуют контейнер с наибольшим количеством воды. Верните максимальный объём.\n\nПример:\nВход: height = [1, 8, 6, 2, 5, 4, 8, 3, 7]\nВыход: 49 (между столбцами 8 и 7, расстояние 7, высота min(8,7) = 7)',
      requirements: [
        'Метод maxArea(int[] height) возвращает int',
        'Два указателя: left и right, с краёв к центру',
        'Двигать указатель с меньшей высотой (жадная стратегия)',
        'Время O(n), память O(1)'
      ],
      expectedOutput: 'Input: [1,8,6,2,5,4,8,3,7] → Output: 49\nInput: [1,1] → Output: 1\nInput: [4,3,2,1,4] → Output: 16',
      hint: 'Площадь = min(height[left], height[right]) * (right - left). Двигаем указатель с меньшей высотой — при уменьшении ширины нужно увеличить высоту.',
      solution: `public class ContainerWithMostWater {
    public static int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxWater = 0;

        while (left < right) {
            // Площадь = min высота * ширина
            int h = Math.min(height[left], height[right]);
            int w = right - left;
            maxWater = Math.max(maxWater, h * w);

            // Двигаем указатель с меньшей высотой
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }

        return maxWater;
    }

    public static void main(String[] args) {
        System.out.println(maxArea(new int[]{1,8,6,2,5,4,8,3,7})); // 49
        System.out.println(maxArea(new int[]{1,1}));                 // 1
        System.out.println(maxArea(new int[]{4,3,2,1,4}));           // 16
    }
}`,
      explanation: 'Жадный двух-указательный подход. Начинаем с максимальной ширины (left=0, right=n-1). Двигаем указатель с меньшей высотой: при уменьшении ширины единственный шанс увеличить площадь — найти более высокий столбец. Если двигать более высокий — площадь гарантированно не увеличится. O(n) — каждый элемент посещается максимум раз.'
    },
    {
      id: 4,
      title: '3Sum Closest (LeetCode #16)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums и целое число target. Найдите три элемента, сумма которых ближе всего к target. Верните эту сумму. Гарантируется ровно одно решение.\n\nПример:\nВход: nums = [-1, 2, 1, -4], target = 1\nВыход: 2 (тройка [-1, 2, 1], сумма = 2)',
      requirements: [
        'Метод threeSumClosest(int[] nums, int target) возвращает int',
        'Отсортировать + два указателя (как 3Sum)',
        'Отслеживать ближайшую сумму по модулю разности с target',
        'Время O(n²), память O(1)'
      ],
      expectedOutput: 'Input: [-1,2,1,-4], target=1 → Output: 2\nInput: [0,0,0], target=1 → Output: 0\nInput: [1,1,1,0], target=-100 → Output: 2',
      hint: 'Отсортируй. Фиксируй i, два указателя left и right. Считай sum = nums[i]+nums[left]+nums[right]. Если |sum - target| < |closest - target| — обновляй closest. Двигай указатели по тому же принципу что в 3Sum.',
      solution: `import java.util.Arrays;

public class ThreeSumClosest {
    public static int threeSumClosest(int[] nums, int target) {
        Arrays.sort(nums);
        int closest = nums[0] + nums[1] + nums[2]; // Начальное приближение

        for (int i = 0; i < nums.length - 2; i++) {
            int left = i + 1, right = nums.length - 1;

            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];

                // Обновляем ближайшую сумму
                if (Math.abs(sum - target) < Math.abs(closest - target)) {
                    closest = sum;
                }

                if (sum == target) {
                    return sum; // Точное совпадение
                } else if (sum < target) {
                    left++;
                } else {
                    right--;
                }
            }
        }

        return closest;
    }

    public static void main(String[] args) {
        System.out.println(threeSumClosest(new int[]{-1, 2, 1, -4}, 1));  // 2
        System.out.println(threeSumClosest(new int[]{0, 0, 0}, 1));       // 0
        System.out.println(threeSumClosest(new int[]{1, 1, 1, 0}, -100)); // 2
    }
}`,
      explanation: 'Модификация 3Sum: вместо поиска суммы == 0 ищем ближайшую к target. Сортируем, фиксируем первый элемент, два указателя ищут оптимальную пару. Обновляем closest, если текущая сумма ближе. Ранний выход при точном совпадении. O(n²) время, O(1) дополнительная память.'
    },
    {
      id: 5,
      title: 'Sort Colors — Dutch National Flag (LeetCode #75)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums с элементами 0, 1, 2 (красный, белый, синий). Отсортируйте его in-place так, чтобы одинаковые цвета были рядом в порядке 0, 1, 2. Без использования sort().\n\nПример:\nВход: nums = [2, 0, 2, 1, 1, 0]\nВыход: [0, 0, 1, 1, 2, 2]',
      requirements: [
        'Метод sortColors(int[] nums) — in-place сортировка',
        'Алгоритм Dutch National Flag (Дейкстра): три указателя',
        'Один проход: O(n) время, O(1) память',
        'Не использовать встроенную сортировку'
      ],
      expectedOutput: 'Input: [2,0,2,1,1,0] → Output: [0, 0, 1, 1, 2, 2]\nInput: [2,0,1] → Output: [0, 1, 2]\nInput: [0] → Output: [0]',
      hint: 'Три указателя: low (граница 0), mid (текущий), high (граница 2). Если nums[mid]==0 — swap(low,mid), low++, mid++. Если ==2 — swap(mid,high), high--. Если ==1 — mid++.',
      solution: `public class SortColors {
    public static void sortColors(int[] nums) {
        int low = 0;               // Граница для 0 (всё до low — нули)
        int mid = 0;               // Текущий элемент
        int high = nums.length - 1; // Граница для 2 (всё после high — двойки)

        while (mid <= high) {
            if (nums[mid] == 0) {
                // Переносим 0 в начало
                swap(nums, low, mid);
                low++;
                mid++;
            } else if (nums[mid] == 2) {
                // Переносим 2 в конец
                swap(nums, mid, high);
                high--;
                // mid НЕ двигаем — новый элемент на mid нужно проверить
            } else {
                // nums[mid] == 1 — на своём месте
                mid++;
            }
        }
    }

    private static void swap(int[] nums, int i, int j) {
        int temp = nums[i];
        nums[i] = nums[j];
        nums[j] = temp;
    }

    public static void main(String[] args) {
        int[] a = {2, 0, 2, 1, 1, 0};
        sortColors(a);
        System.out.println(java.util.Arrays.toString(a)); // [0, 0, 1, 1, 2, 2]

        int[] b = {2, 0, 1};
        sortColors(b);
        System.out.println(java.util.Arrays.toString(b)); // [0, 1, 2]
    }
}`,
      explanation: 'Алгоритм Dutch National Flag (Дейкстра): три области — [0..low) содержит 0, [low..mid) содержит 1, (high..n-1] содержит 2. mid сканирует неизвестную область [mid..high]. Ключевой момент: при swap с high мы НЕ двигаем mid, потому что новый элемент ещё не проверен. Один проход O(n), O(1) память.'
    },
    {
      id: 6,
      title: 'Reverse String (LeetCode #344)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив символов s. Разверните его in-place с O(1) дополнительной памяти.\n\nПример:\nВход: s = ["h","e","l","l","o"]\nВыход: ["o","l","l","e","h"]',
      requirements: [
        'Метод reverseString(char[] s) — in-place разворот',
        'Два указателя: left и right',
        'Время O(n), память O(1)',
        'Не использовать StringBuilder.reverse() или Arrays'
      ],
      expectedOutput: 'Input: ["h","e","l","l","o"] → Output: ["o","l","l","e","h"]\nInput: ["H","a","n","n","a","h"] → Output: ["h","a","n","n","a","H"]',
      hint: 'left = 0, right = n-1. Swap s[left] и s[right]. Двигай left++ и right-- пока left < right.',
      solution: `public class ReverseString {
    public static void reverseString(char[] s) {
        int left = 0, right = s.length - 1;

        while (left < right) {
            // Swap символов
            char temp = s[left];
            s[left] = s[right];
            s[right] = temp;

            left++;
            right--;
        }
    }

    public static void main(String[] args) {
        char[] a = {'h', 'e', 'l', 'l', 'o'};
        reverseString(a);
        System.out.println(java.util.Arrays.toString(a));
        // [o, l, l, e, h]

        char[] b = {'H', 'a', 'n', 'n', 'a', 'h'};
        reverseString(b);
        System.out.println(java.util.Arrays.toString(b));
        // [h, a, n, n, a, H]
    }
}`,
      explanation: 'Самая базовая задача на два указателя. Указатели идут навстречу, меняя элементы местами. n/2 свопов = O(n) время. O(1) память — только одна временная переменная. Этот паттерн используется во многих задачах: разворот массива, проверка палиндрома, разворот слов.'
    },
    {
      id: 7,
      title: 'Valid Palindrome II (LeetCode #680)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дана строка s. Верните true, если строка может стать палиндромом после удаления не более одного символа.\n\nПример:\nВход: s = "abca"\nВыход: true (удалив "c" получаем "aba")',
      requirements: [
        'Метод validPalindrome(String s) возвращает boolean',
        'Два указателя: при несовпадении попробовать пропустить left или right',
        'Вспомогательный метод isPalindromeRange(s, left, right)',
        'Время O(n), память O(1)'
      ],
      expectedOutput: 'Input: "aba" → Output: true\nInput: "abca" → Output: true\nInput: "abc" → Output: false',
      hint: 'Два указателя с краёв. При несовпадении s[left] != s[right] — проверь два варианта: isPalindrome(s, left+1, right) ИЛИ isPalindrome(s, left, right-1). Если хотя бы один true — ответ true.',
      solution: `public class ValidPalindromeII {
    public static boolean validPalindrome(String s) {
        int left = 0, right = s.length() - 1;

        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) {
                // Пробуем пропустить левый или правый символ
                return isPalindromeRange(s, left + 1, right) ||
                       isPalindromeRange(s, left, right - 1);
            }
            left++;
            right--;
        }

        return true; // Уже палиндром без удалений
    }

    private static boolean isPalindromeRange(String s, int left, int right) {
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(validPalindrome("aba"));  // true
        System.out.println(validPalindrome("abca")); // true
        System.out.println(validPalindrome("abc"));  // false
    }
}`,
      explanation: 'Расширение обычной проверки палиндрома: при первом несовпадении у нас есть одна "жизнь" — пропустить один символ. Пробуем оба варианта: пропустить левый или правый. Если хотя бы один вариант даёт палиндром — ответ true. Максимум два прохода: O(n) время, O(1) память.'
    },
    {
      id: 8,
      title: '4Sum (LeetCode #18)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums и целое число target. Найдите все уникальные четвёрки [nums[a], nums[b], nums[c], nums[d]], сумма которых равна target.\n\nПример:\nВход: nums = [1, 0, -1, 0, -2, 2], target = 0\nВыход: [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]',
      requirements: [
        'Метод fourSum(int[] nums, int target) возвращает List<List<Integer>>',
        'Сортировка + два вложенных цикла + два указателя',
        'Пропускать дубликаты на всех уровнях',
        'Время O(n³), использовать long для суммы (избежать переполнения)'
      ],
      expectedOutput: 'Input: [1,0,-1,0,-2,2], target=0 → [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]\nInput: [2,2,2,2,2], target=8 → [[2,2,2,2]]',
      hint: 'Обобщение 3Sum: фиксируй i и j, для оставшихся — два указателя. Пропускай дубликаты для i, j, left, right. Используй long для суммы, чтобы избежать integer overflow.',
      solution: `import java.util.*;

public class FourSum {
    public static List<List<Integer>> fourSum(int[] nums, int target) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(nums);
        int n = nums.length;

        for (int i = 0; i < n - 3; i++) {
            // Пропуск дубликатов i
            if (i > 0 && nums[i] == nums[i - 1]) continue;

            for (int j = i + 1; j < n - 2; j++) {
                // Пропуск дубликатов j
                if (j > i + 1 && nums[j] == nums[j - 1]) continue;

                int left = j + 1, right = n - 1;

                while (left < right) {
                    // long для избежания переполнения
                    long sum = (long) nums[i] + nums[j] + nums[left] + nums[right];

                    if (sum == target) {
                        result.add(Arrays.asList(
                            nums[i], nums[j], nums[left], nums[right]));
                        // Пропуск дубликатов
                        while (left < right && nums[left] == nums[left + 1]) left++;
                        while (left < right && nums[right] == nums[right - 1]) right--;
                        left++;
                        right--;
                    } else if (sum < target) {
                        left++;
                    } else {
                        right--;
                    }
                }
            }
        }

        return result;
    }

    public static void main(String[] args) {
        System.out.println(fourSum(new int[]{1, 0, -1, 0, -2, 2}, 0));
        // [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]

        System.out.println(fourSum(new int[]{2, 2, 2, 2, 2}, 8));
        // [[2,2,2,2]]
    }
}`,
      explanation: 'Обобщение паттерна kSum: k-2 вложенных цикла + два указателя. Для 4Sum: два цикла (i, j) + два указателя (left, right). Пропуск дубликатов на каждом уровне. Важно: long для суммы, чтобы избежать integer overflow при больших значениях. O(n³) время, O(1) дополнительная память.'
    },
    {
      id: 9,
      title: 'Remove Element (LeetCode #27)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив nums и значение val. Удалите все вхождения val in-place. Верните количество оставшихся элементов k. Первые k элементов nums должны содержать элементы, не равные val.\n\nПример:\nВход: nums = [3, 2, 2, 3], val = 3\nВыход: k = 2, nums = [2, 2, ...]',
      requirements: [
        'Метод removeElement(int[] nums, int val) возвращает int',
        'In-place удаление через два указателя',
        'Время O(n), память O(1)',
        'Порядок оставшихся элементов может быть любым'
      ],
      expectedOutput: 'Input: [3,2,2,3], val=3 → k=2, nums=[2,2,...]\nInput: [0,1,2,2,3,0,4,2], val=2 → k=5, nums=[0,1,3,0,4,...]\nInput: [1], val=1 → k=0',
      hint: 'write = 0. Проходи read по массиву: если nums[read] != val — записывай nums[write++] = nums[read]. В конце write = количество оставшихся.',
      solution: `public class RemoveElement {
    public static int removeElement(int[] nums, int val) {
        int write = 0;

        for (int read = 0; read < nums.length; read++) {
            if (nums[read] != val) {
                nums[write] = nums[read];
                write++;
            }
        }

        return write;
    }

    // Альтернатива: swap с конца (меньше записей при редком val)
    public static int removeElementSwap(int[] nums, int val) {
        int left = 0, right = nums.length - 1;

        while (left <= right) {
            if (nums[left] == val) {
                nums[left] = nums[right];
                right--;
            } else {
                left++;
            }
        }

        return left;
    }

    public static void main(String[] args) {
        int[] a = {3, 2, 2, 3};
        int k1 = removeElement(a, 3);
        System.out.println("k=" + k1); // k=2

        int[] b = {0, 1, 2, 2, 3, 0, 4, 2};
        int k2 = removeElement(b, 2);
        System.out.println("k=" + k2); // k=5
    }
}`,
      explanation: 'Два подхода: 1) read/write — сохраняет порядок, всегда n записей. 2) swap с конца — не сохраняет порядок, но делает минимум записей (только при удалении). Первый проще и чаще используется. Оба O(n) время, O(1) память.'
    },
    {
      id: 10,
      title: 'Partition Labels (LeetCode #763)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s. Разбейте её на максимальное количество частей так, чтобы каждый символ встречался только в одной части. Верните массив размеров частей.\n\nПример:\nВход: s = "ababcbacadefegdehijhklij"\nВыход: [9, 7, 8]\n(Части: "ababcbaca", "defegde", "hijhklij")',
      requirements: [
        'Метод partitionLabels(String s) возвращает List<Integer>',
        'Сначала найти последнее вхождение каждого символа',
        'Жадно расширять текущую часть до последнего вхождения',
        'Время O(n), память O(1) (массив на 26 букв)'
      ],
      expectedOutput: 'Input: "ababcbacadefegdehijhklij" → Output: [9, 7, 8]\nInput: "eccbbbbdec" → Output: [10]\nInput: "abc" → Output: [1, 1, 1]',
      hint: 'Шаг 1: для каждого символа запомни последний индекс (lastIndex[c]). Шаг 2: иди по строке, расширяя end = max(end, lastIndex[s[i]]). Когда i == end — конец текущей части.',
      solution: `import java.util.*;

public class PartitionLabels {
    public static List<Integer> partitionLabels(String s) {
        // Шаг 1: последнее вхождение каждого символа
        int[] lastIndex = new int[26];
        for (int i = 0; i < s.length(); i++) {
            lastIndex[s.charAt(i) - 'a'] = i;
        }

        // Шаг 2: жадное разбиение
        List<Integer> result = new ArrayList<>();
        int start = 0, end = 0;

        for (int i = 0; i < s.length(); i++) {
            // Расширяем текущую часть до последнего вхождения символа
            end = Math.max(end, lastIndex[s.charAt(i) - 'a']);

            if (i == end) {
                // Все символы текущей части уместились — фиксируем
                result.add(end - start + 1);
                start = i + 1;
            }
        }

        return result;
    }

    public static void main(String[] args) {
        System.out.println(partitionLabels("ababcbacadefegdehijhklij")); // [9, 7, 8]
        System.out.println(partitionLabels("eccbbbbdec"));                // [10]
        System.out.println(partitionLabels("abc"));                       // [1, 1, 1]
    }
}`,
      explanation: 'Жадный алгоритм с двумя указателями (start, end). Сначала находим последнее вхождение каждого символа. Затем проходим строку: для каждого символа расширяем end до его последнего вхождения. Когда i достигает end — все символы текущей части гарантированно внутри, и мы фиксируем часть. O(n) время, O(26) = O(1) дополнительная память.'
    }
  ]
}
