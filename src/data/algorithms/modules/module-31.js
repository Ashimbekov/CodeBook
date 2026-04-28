export default {
  id: 31,
  title: 'Практикум: Array паттерны',
  description: '10 классических задач на массивы в стиле LeetCode. Two Sum, Maximum Subarray, 3Sum, Trapping Rain Water и другие популярные паттерны.',
  lessons: [
    {
      id: 1,
      title: 'Two Sum (LeetCode #1)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив целых чисел nums и целое число target. Верните индексы двух чисел, сумма которых равна target.\n\nГарантируется, что существует ровно одно решение. Нельзя использовать один и тот же элемент дважды.\n\nПример:\nВход: nums = [2, 7, 11, 15], target = 9\nВыход: [0, 1] (потому что nums[0] + nums[1] = 2 + 7 = 9)',
      requirements: [
        'Метод twoSum(int[] nums, int target) возвращает int[] из двух индексов',
        'Решение должно работать за O(n) по времени',
        'Использовать HashMap для хранения уже просмотренных чисел',
        'Обработать случай, когда решения нет (вернуть пустой массив)'
      ],
      expectedOutput: 'Input: [2, 7, 11, 15], target=9 → Output: [0, 1]\nInput: [3, 2, 4], target=6 → Output: [1, 2]\nInput: [3, 3], target=6 → Output: [0, 1]',
      hint: 'Для каждого числа nums[i] проверяй, есть ли в HashMap число (target - nums[i]). Если есть — нашли пару. Если нет — добавляй nums[i] в HashMap с индексом i.',
      solution: `import java.util.*;

public class TwoSum {
    public static int[] twoSum(int[] nums, int target) {
        // HashMap: число -> его индекс
        Map<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];

            // Если дополнение уже встречалось — нашли пару
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }

            // Запоминаем текущее число и его индекс
            map.put(nums[i], i);
        }

        return new int[] {}; // Решение не найдено
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9)));  // [0, 1]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 2, 4}, 6)));        // [1, 2]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 3}, 6)));           // [0, 1]
    }
}`,
      explanation: 'Используем HashMap для поиска дополнения за O(1). Проходим массив один раз: для каждого элемента проверяем, есть ли уже в map число (target - nums[i]). Если да — возвращаем оба индекса. Если нет — добавляем текущий элемент в map. Время: O(n), память: O(n).'
    },
    {
      id: 2,
      title: 'Best Time to Buy and Sell Stock (LeetCode #121)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив prices, где prices[i] — цена акции в i-й день. Нужно выбрать один день для покупки и один (позже) для продажи, чтобы максимизировать прибыль. Верните максимальную прибыль. Если прибыль получить невозможно — верните 0.\n\nПример:\nВход: prices = [7, 1, 5, 3, 6, 4]\nВыход: 5 (купить в день 1 за 1, продать в день 4 за 6, прибыль = 6 - 1 = 5)',
      requirements: [
        'Метод maxProfit(int[] prices) возвращает int — максимальную прибыль',
        'Решение должно работать за O(n) по времени и O(1) по памяти',
        'Отслеживать минимальную цену покупки и максимальную прибыль',
        'Корректно обработать убывающий массив цен'
      ],
      expectedOutput: 'Input: [7, 1, 5, 3, 6, 4] → Output: 5\nInput: [7, 6, 4, 3, 1] → Output: 0\nInput: [2, 4, 1] → Output: 2',
      hint: 'Идём слева направо. Храним минимальную цену, встреченную до текущего дня. Для каждого дня считаем прибыль = текущая цена - минимальная цена. Обновляем максимальную прибыль.',
      solution: `public class BestTimeToBuyAndSell {
    public static int maxProfit(int[] prices) {
        if (prices == null || prices.length < 2) return 0;

        int minPrice = prices[0]; // Минимальная цена покупки
        int maxProfit = 0;        // Максимальная прибыль

        for (int i = 1; i < prices.length; i++) {
            // Обновляем минимальную цену
            if (prices[i] < minPrice) {
                minPrice = prices[i];
            } else {
                // Считаем прибыль при продаже сегодня
                maxProfit = Math.max(maxProfit, prices[i] - minPrice);
            }
        }

        return maxProfit;
    }

    public static void main(String[] args) {
        System.out.println(maxProfit(new int[]{7, 1, 5, 3, 6, 4})); // 5
        System.out.println(maxProfit(new int[]{7, 6, 4, 3, 1}));    // 0
        System.out.println(maxProfit(new int[]{2, 4, 1}));           // 2
    }
}`,
      explanation: 'Ключевая идея: в каждый момент мы знаем минимальную цену до текущего дня. Прибыль = текущая цена - минимальная цена. Обновляем максимум. Один проход O(n), без дополнительной памяти O(1). Это жадный алгоритм: мы всегда покупаем по самой низкой цене из прошлого.'
    },
    {
      id: 3,
      title: 'Contains Duplicate (LeetCode #217)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив целых чисел nums. Верните true, если в массиве есть хотя бы один дубликат (значение, которое встречается более одного раза). Иначе верните false.\n\nПример:\nВход: nums = [1, 2, 3, 1]\nВыход: true (число 1 встречается дважды)',
      requirements: [
        'Метод containsDuplicate(int[] nums) возвращает boolean',
        'Решение должно работать за O(n) по времени',
        'Использовать HashSet для отслеживания уникальных чисел',
        'Обработать пустой массив и массив из одного элемента'
      ],
      expectedOutput: 'Input: [1, 2, 3, 1] → Output: true\nInput: [1, 2, 3, 4] → Output: false\nInput: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] → Output: true',
      hint: 'Используй HashSet. Проходи по массиву: если число уже в set — дубликат найден (return true). Если нет — добавляй в set. Если цикл закончился без дубликатов — return false.',
      solution: `import java.util.*;

public class ContainsDuplicate {
    public static boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();

        for (int num : nums) {
            // add() возвращает false, если элемент уже есть
            if (!seen.add(num)) {
                return true; // Дубликат найден
            }
        }

        return false; // Дубликатов нет
    }

    public static void main(String[] args) {
        System.out.println(containsDuplicate(new int[]{1, 2, 3, 1}));                   // true
        System.out.println(containsDuplicate(new int[]{1, 2, 3, 4}));                   // false
        System.out.println(containsDuplicate(new int[]{1, 1, 1, 3, 3, 4, 3, 2, 4, 2})); // true
    }
}`,
      explanation: 'HashSet.add() возвращает false, если элемент уже присутствует в множестве. Это позволяет проверить наличие дубликата за O(1) на каждом шаге. Общее время: O(n), память: O(n). Альтернатива: отсортировать массив O(n log n) и проверить соседние элементы — без дополнительной памяти.'
    },
    {
      id: 4,
      title: 'Product of Array Except Self (LeetCode #238)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив целых чисел nums. Верните массив answer, где answer[i] равен произведению всех элементов nums, кроме nums[i]. Нельзя использовать операцию деления. Решение должно работать за O(n).\n\nПример:\nВход: nums = [1, 2, 3, 4]\nВыход: [24, 12, 8, 6]\n(answer[0] = 2*3*4 = 24, answer[1] = 1*3*4 = 12, ...)',
      requirements: [
        'Метод productExceptSelf(int[] nums) возвращает int[]',
        'Время O(n), нельзя использовать деление',
        'Использовать два прохода: левые произведения и правые произведения',
        'Бонус: решить с O(1) дополнительной памяти (не считая результат)'
      ],
      expectedOutput: 'Input: [1, 2, 3, 4] → Output: [24, 12, 8, 6]\nInput: [-1, 1, 0, -3, 3] → Output: [0, 0, 9, 0, 0]\nInput: [2, 3] → Output: [3, 2]',
      hint: 'answer[i] = (произведение всех слева от i) * (произведение всех справа от i). Первый проход: считаем произведения слева. Второй проход (справа налево): домножаем на произведения справа.',
      solution: `public class ProductExceptSelf {
    public static int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];

        // Первый проход: answer[i] = произведение всех элементов слева от i
        answer[0] = 1;
        for (int i = 1; i < n; i++) {
            answer[i] = answer[i - 1] * nums[i - 1];
        }

        // Второй проход: домножаем на произведение всех справа от i
        int rightProduct = 1;
        for (int i = n - 1; i >= 0; i--) {
            answer[i] *= rightProduct;
            rightProduct *= nums[i];
        }

        return answer;
    }

    public static void main(String[] args) {
        System.out.println(java.util.Arrays.toString(
            productExceptSelf(new int[]{1, 2, 3, 4})));          // [24, 12, 8, 6]
        System.out.println(java.util.Arrays.toString(
            productExceptSelf(new int[]{-1, 1, 0, -3, 3})));     // [0, 0, 9, 0, 0]
        System.out.println(java.util.Arrays.toString(
            productExceptSelf(new int[]{2, 3})));                 // [3, 2]
    }
}`,
      explanation: 'Идея: answer[i] = leftProduct[i] * rightProduct[i]. Первый проход (слева направо): накапливаем произведение слева. Второй проход (справа налево): домножаем на произведение справа. Два прохода O(n), без деления. O(1) дополнительной памяти (используем answer как буфер для левых произведений).'
    },
    {
      id: 5,
      title: 'Maximum Subarray — Kadane (LeetCode #53)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив целых чисел nums. Найдите непрерывный подмассив с наибольшей суммой и верните эту сумму.\n\nПример:\nВход: nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nВыход: 6 (подмассив [4, -1, 2, 1] имеет максимальную сумму 6)',
      requirements: [
        'Метод maxSubArray(int[] nums) возвращает int — максимальную сумму подмассива',
        'Реализовать алгоритм Кадане (Kadane\'s Algorithm)',
        'Время O(n), память O(1)',
        'Корректно обработать массив из отрицательных чисел'
      ],
      expectedOutput: 'Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4] → Output: 6\nInput: [1] → Output: 1\nInput: [5, 4, -1, 7, 8] → Output: 23\nInput: [-1, -2, -3] → Output: -1',
      hint: 'Алгоритм Кадане: currentSum = max(nums[i], currentSum + nums[i]). Если currentSum стала отрицательной — начинаем новый подмассив. maxSum хранит глобальный максимум.',
      solution: `public class MaximumSubarray {
    public static int maxSubArray(int[] nums) {
        // Алгоритм Кадане
        int currentSum = nums[0]; // Сумма текущего подмассива
        int maxSum = nums[0];     // Глобальный максимум

        for (int i = 1; i < nums.length; i++) {
            // Или продолжаем текущий подмассив, или начинаем новый
            currentSum = Math.max(nums[i], currentSum + nums[i]);

            // Обновляем глобальный максимум
            maxSum = Math.max(maxSum, currentSum);
        }

        return maxSum;
    }

    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2, 1, -3, 4, -1, 2, 1, -5, 4})); // 6
        System.out.println(maxSubArray(new int[]{1}));                                // 1
        System.out.println(maxSubArray(new int[]{5, 4, -1, 7, 8}));                  // 23
        System.out.println(maxSubArray(new int[]{-1, -2, -3}));                       // -1
    }
}`,
      explanation: 'Алгоритм Кадане — классический O(n) алгоритм. На каждом шаге решаем: продолжить текущий подмассив (currentSum + nums[i]) или начать новый (nums[i]). Если текущая сумма стала меньше самого элемента — выгоднее начать заново. maxSum отслеживает лучший результат за всё время. Работает даже для массивов с отрицательными числами.'
    },
    {
      id: 6,
      title: 'Merge Sorted Arrays (LeetCode #88)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Даны два отсортированных массива nums1 и nums2. Слейте nums2 в nums1 как один отсортированный массив. В nums1 достаточно места (длина m + n), первые m элементов — данные, остальные — нули.\n\nПример:\nВход: nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [2, 5, 6], n = 3\nВыход: [1, 2, 2, 3, 5, 6]',
      requirements: [
        'Метод merge(int[] nums1, int m, int[] nums2, int n) — in-place в nums1',
        'Сливать с конца, чтобы не затирать элементы nums1',
        'Время O(m + n), память O(1)',
        'Обработать случай, когда один из массивов пуст'
      ],
      expectedOutput: 'Input: nums1=[1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3 → [1, 2, 2, 3, 5, 6]\nInput: nums1=[1], m=1, nums2=[], n=0 → [1]\nInput: nums1=[0], m=0, nums2=[1], n=1 → [1]',
      hint: 'Начинай с конца! Три указателя: p1 = m-1 (конец данных в nums1), p2 = n-1 (конец nums2), write = m+n-1 (позиция записи). Сравниваем nums1[p1] и nums2[p2], записываем больший на позицию write.',
      solution: `public class MergeSortedArrays {
    public static void merge(int[] nums1, int m, int[] nums2, int n) {
        int p1 = m - 1;     // Указатель на конец данных в nums1
        int p2 = n - 1;     // Указатель на конец nums2
        int write = m + n - 1; // Позиция записи (с конца)

        // Сливаем с конца — не затираем элементы nums1
        while (p1 >= 0 && p2 >= 0) {
            if (nums1[p1] > nums2[p2]) {
                nums1[write--] = nums1[p1--];
            } else {
                nums1[write--] = nums2[p2--];
            }
        }

        // Если остались элементы в nums2 — копируем
        while (p2 >= 0) {
            nums1[write--] = nums2[p2--];
        }
        // Элементы nums1 уже на месте, копировать не нужно
    }

    public static void main(String[] args) {
        int[] nums1 = {1, 2, 3, 0, 0, 0};
        merge(nums1, 3, new int[]{2, 5, 6}, 3);
        System.out.println(java.util.Arrays.toString(nums1)); // [1, 2, 2, 3, 5, 6]

        int[] nums2 = {1};
        merge(nums2, 1, new int[]{}, 0);
        System.out.println(java.util.Arrays.toString(nums2)); // [1]

        int[] nums3 = {0};
        merge(nums3, 0, new int[]{1}, 1);
        System.out.println(java.util.Arrays.toString(nums3)); // [1]
    }
}`,
      explanation: 'Слияние с конца — ключевой трюк. Если сливать с начала, то элементы nums1 будут затираться. С конца безопасно: мы записываем в "пустую" зону nums1. После цикла, если остались элементы nums2 — копируем их. Элементы nums1 копировать не нужно — они уже на месте. O(m+n) время, O(1) память.'
    },
    {
      id: 7,
      title: 'Rotate Array (LeetCode #189)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums. Сдвиньте его вправо на k позиций (циклический сдвиг).\n\nПример:\nВход: nums = [1, 2, 3, 4, 5, 6, 7], k = 3\nВыход: [5, 6, 7, 1, 2, 3, 4]\n(Три правых элемента перемещаются в начало)',
      requirements: [
        'Метод rotate(int[] nums, int k) — in-place, без нового массива',
        'Использовать алгоритм трёх разворотов (reverse)',
        'Время O(n), память O(1)',
        'Обработать случай k > nums.length'
      ],
      expectedOutput: 'Input: [1,2,3,4,5,6,7], k=3 → [5, 6, 7, 1, 2, 3, 4]\nInput: [-1,-100,3,99], k=2 → [3, 99, -1, -100]\nInput: [1,2], k=3 → [2, 1]',
      hint: 'Алгоритм трёх разворотов: 1) Развернуть весь массив. 2) Развернуть первые k элементов. 3) Развернуть оставшиеся n-k элементов. Не забудь k = k % n!',
      solution: `public class RotateArray {
    public static void rotate(int[] nums, int k) {
        int n = nums.length;
        k = k % n; // Если k > n, берём остаток
        if (k == 0) return;

        // Три разворота:
        // [1,2,3,4,5,6,7] k=3
        reverse(nums, 0, n - 1);     // [7,6,5,4,3,2,1]
        reverse(nums, 0, k - 1);     // [5,6,7,4,3,2,1]
        reverse(nums, k, n - 1);     // [5,6,7,1,2,3,4]
    }

    private static void reverse(int[] nums, int left, int right) {
        while (left < right) {
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            left++;
            right--;
        }
    }

    public static void main(String[] args) {
        int[] a = {1, 2, 3, 4, 5, 6, 7};
        rotate(a, 3);
        System.out.println(java.util.Arrays.toString(a)); // [5, 6, 7, 1, 2, 3, 4]

        int[] b = {-1, -100, 3, 99};
        rotate(b, 2);
        System.out.println(java.util.Arrays.toString(b)); // [3, 99, -1, -100]

        int[] c = {1, 2};
        rotate(c, 3);
        System.out.println(java.util.Arrays.toString(c)); // [2, 1]
    }
}`,
      explanation: 'Алгоритм трёх разворотов — элегантное O(n) решение с O(1) памятью. Сначала разворачиваем весь массив, потом отдельно первые k и оставшиеся n-k элементов. Важно: k = k % n, иначе при k > n будет ошибка. Каждый разворот — O(n), всего три прохода.'
    },
    {
      id: 8,
      title: 'Move Zeroes (LeetCode #283)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив nums. Переместите все нули в конец, сохраняя порядок ненулевых элементов. Сделайте это in-place.\n\nПример:\nВход: nums = [0, 1, 0, 3, 12]\nВыход: [1, 3, 12, 0, 0]',
      requirements: [
        'Метод moveZeroes(int[] nums) — in-place перемещение',
        'Сохранить относительный порядок ненулевых элементов',
        'Время O(n), память O(1)',
        'Минимальное количество операций записи'
      ],
      expectedOutput: 'Input: [0, 1, 0, 3, 12] → Output: [1, 3, 12, 0, 0]\nInput: [0] → Output: [0]\nInput: [1, 0, 0, 0, 5] → Output: [1, 5, 0, 0, 0]',
      hint: 'Используй два указателя: write (куда писать ненулевой) и read (текущий элемент). Когда read находит ненулевой — свопаем nums[write] и nums[read], двигаем write вперёд.',
      solution: `public class MoveZeroes {
    public static void moveZeroes(int[] nums) {
        int write = 0; // Позиция для следующего ненулевого

        for (int read = 0; read < nums.length; read++) {
            if (nums[read] != 0) {
                // Свопаем ненулевой на позицию write
                int temp = nums[write];
                nums[write] = nums[read];
                nums[read] = temp;
                write++;
            }
        }
    }

    public static void main(String[] args) {
        int[] a = {0, 1, 0, 3, 12};
        moveZeroes(a);
        System.out.println(java.util.Arrays.toString(a)); // [1, 3, 12, 0, 0]

        int[] b = {0};
        moveZeroes(b);
        System.out.println(java.util.Arrays.toString(b)); // [0]

        int[] c = {1, 0, 0, 0, 5};
        moveZeroes(c);
        System.out.println(java.util.Arrays.toString(c)); // [1, 5, 0, 0, 0]
    }
}`,
      explanation: 'Паттерн двух указателей: write указывает на позицию для следующего ненулевого элемента, read сканирует массив. Когда read находит ненулевой — свопаем с write. Все нули "всплывают" в конец, порядок ненулевых сохраняется. O(n) время, O(1) память, минимум свопов.'
    },
    {
      id: 9,
      title: '3Sum (LeetCode #15)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums. Найдите все уникальные тройки [nums[i], nums[j], nums[k]], такие что i != j != k и nums[i] + nums[j] + nums[k] = 0.\n\nПример:\nВход: nums = [-1, 0, 1, 2, -1, -4]\nВыход: [[-1, -1, 2], [-1, 0, 1]]',
      requirements: [
        'Метод threeSum(int[] nums) возвращает List<List<Integer>>',
        'Результат не должен содержать дубликатов троек',
        'Отсортировать массив и использовать два указателя',
        'Время O(n²), память O(1) (не считая результат)'
      ],
      expectedOutput: 'Input: [-1,0,1,2,-1,-4] → Output: [[-1,-1,2], [-1,0,1]]\nInput: [0,1,1] → Output: []\nInput: [0,0,0] → Output: [[0,0,0]]',
      hint: 'Отсортируй массив. Фиксируй первый элемент (i), для оставшихся используй два указателя (left, right). Пропускай дубликаты для i, left и right.',
      solution: `import java.util.*;

public class ThreeSum {
    public static List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(nums); // Сортируем для двух указателей

        for (int i = 0; i < nums.length - 2; i++) {
            // Пропускаем дубликаты для i
            if (i > 0 && nums[i] == nums[i - 1]) continue;

            // Оптимизация: если nums[i] > 0, сумма трёх не может быть 0
            if (nums[i] > 0) break;

            int left = i + 1, right = nums.length - 1;

            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];

                if (sum == 0) {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    // Пропускаем дубликаты
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (sum < 0) {
                    left++;  // Нужна большая сумма
                } else {
                    right--; // Нужна меньшая сумма
                }
            }
        }

        return result;
    }

    public static void main(String[] args) {
        System.out.println(threeSum(new int[]{-1, 0, 1, 2, -1, -4})); // [[-1,-1,2],[-1,0,1]]
        System.out.println(threeSum(new int[]{0, 1, 1}));               // []
        System.out.println(threeSum(new int[]{0, 0, 0}));               // [[0,0,0]]
    }
}`,
      explanation: 'Сортировка + два указателя: фиксируем nums[i], ищем пару в оставшейся части. Сортировка позволяет двигать указатели: если сумма < 0 — left++, если > 0 — right--. Дубликаты пропускаем, сравнивая с предыдущим значением. O(n²) время (n итераций внешнего цикла * n для двух указателей), O(1) дополнительная память.'
    },
    {
      id: 10,
      title: 'Trapping Rain Water (LeetCode #42)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив height, представляющий карту высот (ширина каждого столбца = 1). Подсчитайте, сколько воды можно поймать после дождя.\n\nПример:\nВход: height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]\nВыход: 6',
      requirements: [
        'Метод trap(int[] height) возвращает int — объём воды',
        'Реализовать через два указателя (O(1) памяти)',
        'Время O(n), память O(1)',
        'Понять формулу: вода на позиции i = min(maxLeft, maxRight) - height[i]'
      ],
      expectedOutput: 'Input: [0,1,0,2,1,0,1,3,2,1,2,1] → Output: 6\nInput: [4,2,0,3,2,5] → Output: 9\nInput: [1,0,1] → Output: 1',
      hint: 'Два указателя left и right, с краёв к центру. leftMax и rightMax хранят максимумы. Если leftMax < rightMax — обрабатываем left (вода ограничена leftMax). Иначе — right.',
      solution: `public class TrappingRainWater {
    public static int trap(int[] height) {
        if (height == null || height.length < 3) return 0;

        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0;
        int water = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                // Вода на позиции left ограничена leftMax
                if (height[left] >= leftMax) {
                    leftMax = height[left]; // Обновляем максимум
                } else {
                    water += leftMax - height[left]; // Добавляем воду
                }
                left++;
            } else {
                // Вода на позиции right ограничена rightMax
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    water += rightMax - height[right];
                }
                right--;
            }
        }

        return water;
    }

    public static void main(String[] args) {
        System.out.println(trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1})); // 6
        System.out.println(trap(new int[]{4,2,0,3,2,5}));               // 9
        System.out.println(trap(new int[]{1,0,1}));                     // 1
    }
}`,
      explanation: 'Вода на позиции i = min(maxLeft, maxRight) - height[i]. Два указателя идут навстречу. Если height[left] < height[right], то вода на left ограничена leftMax (правее точно есть столбец выше). Иначе — обрабатываем right. Каждый элемент обрабатывается один раз: O(n) время, O(1) память. Это оптимальнее подхода с двумя массивами prefix/suffix max.'
    }
  ]
}
