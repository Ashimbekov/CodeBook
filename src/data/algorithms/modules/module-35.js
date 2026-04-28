export default {
  id: 35,
  title: 'Практикум: Binary Search',
  description: '10 классических задач на бинарный поиск. От базового поиска до поиска в повёрнутых массивах, матрицах и задач на бинарный поиск по ответу.',
  lessons: [
    {
      id: 1,
      title: 'Binary Search — classic (LeetCode #704)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан отсортированный массив nums и число target. Верните индекс target или -1 если не найден. Алгоритм должен работать за O(log n).\n\nПример:\nВход: nums = [-1, 0, 3, 5, 9, 12], target = 9\nВыход: 4',
      requirements: [
        'Метод search(int[] nums, int target) возвращает int',
        'Классический бинарный поиск с left, right, mid',
        'Время O(log n), память O(1)',
        'Корректно вычислять mid без переполнения: left + (right - left) / 2'
      ],
      expectedOutput: 'Input: [-1,0,3,5,9,12], target=9 → Output: 4\nInput: [-1,0,3,5,9,12], target=2 → Output: -1\nInput: [5], target=5 → Output: 0',
      hint: 'left = 0, right = n-1. Пока left <= right: mid = left + (right - left) / 2. Если nums[mid] == target — нашли. Если < target — left = mid + 1. Если > target — right = mid - 1.',
      solution: `public class BinarySearch {
    public static int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2; // Без переполнения

            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;  // Ищем в правой половине
            } else {
                right = mid - 1; // Ищем в левой половине
            }
        }

        return -1; // Не найден
    }

    public static void main(String[] args) {
        System.out.println(search(new int[]{-1, 0, 3, 5, 9, 12}, 9)); // 4
        System.out.println(search(new int[]{-1, 0, 3, 5, 9, 12}, 2)); // -1
        System.out.println(search(new int[]{5}, 5));                    // 0
    }
}`,
      explanation: 'Классический бинарный поиск — фундамент всех задач этого модуля. Ключевые моменты: 1) mid = left + (right - left) / 2 вместо (left + right) / 2 для избежания integer overflow. 2) Условие left <= right (с равенством). 3) Сдвиги left = mid + 1, right = mid - 1 (не mid!) для избежания бесконечного цикла. O(log n) время, O(1) память.'
    },
    {
      id: 2,
      title: 'Search Insert Position (LeetCode #35)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан отсортированный массив nums и число target. Верните индекс target или позицию, куда его нужно вставить, чтобы массив остался отсортированным.\n\nПример:\nВход: nums = [1, 3, 5, 6], target = 5\nВыход: 2\nВход: nums = [1, 3, 5, 6], target = 2\nВыход: 1 (вставить между 1 и 3)',
      requirements: [
        'Метод searchInsert(int[] nums, int target) возвращает int',
        'Бинарный поиск с left/right',
        'После цикла left — позиция вставки',
        'Время O(log n), память O(1)'
      ],
      expectedOutput: 'Input: [1,3,5,6], target=5 → Output: 2\nInput: [1,3,5,6], target=2 → Output: 1\nInput: [1,3,5,6], target=7 → Output: 4\nInput: [1,3,5,6], target=0 → Output: 0',
      hint: 'Стандартный бинарный поиск. Если target найден — возвращаем mid. Если нет — после цикла left указывает на позицию вставки (первый элемент >= target).',
      solution: `public class SearchInsertPosition {
    public static int searchInsert(int[] nums, int target) {
        int left = 0, right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        // left = позиция вставки (первый элемент >= target)
        return left;
    }

    public static void main(String[] args) {
        int[] nums = {1, 3, 5, 6};
        System.out.println(searchInsert(nums, 5)); // 2
        System.out.println(searchInsert(nums, 2)); // 1
        System.out.println(searchInsert(nums, 7)); // 4
        System.out.println(searchInsert(nums, 0)); // 0
    }
}`,
      explanation: 'После бинарного поиска, если элемент не найден, left указывает на первую позицию, где nums[left] >= target — это и есть позиция вставки. Это работает потому что: при nums[mid] < target мы делаем left = mid + 1 (left "прыгает" за все элементы < target). Аналог Arrays.binarySearch, но без отрицательных значений.'
    },
    {
      id: 3,
      title: 'Find First and Last Position (LeetCode #34)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан отсортированный массив nums и число target. Найдите первую и последнюю позиции target. Если target не найден — верните [-1, -1]. Решение должно быть O(log n).\n\nПример:\nВход: nums = [5, 7, 7, 8, 8, 10], target = 8\nВыход: [3, 4]',
      requirements: [
        'Метод searchRange(int[] nums, int target) возвращает int[2]',
        'Два бинарных поиска: для левой границы и правой границы',
        'findFirst: при nums[mid] == target продолжаем поиск влево',
        'Время O(log n), память O(1)'
      ],
      expectedOutput: 'Input: [5,7,7,8,8,10], target=8 → Output: [3, 4]\nInput: [5,7,7,8,8,10], target=6 → Output: [-1, -1]\nInput: [], target=0 → Output: [-1, -1]',
      hint: 'findFirst: при nums[mid] == target делай right = mid - 1 (ищем ещё левее). findLast: при nums[mid] == target делай left = mid + 1 (ищем ещё правее). Запоминай результат при каждом совпадении.',
      solution: `public class FindFirstAndLastPosition {
    public static int[] searchRange(int[] nums, int target) {
        return new int[] { findFirst(nums, target), findLast(nums, target) };
    }

    private static int findFirst(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        int result = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) {
                result = mid;        // Запоминаем и ищем ещё левее
                right = mid - 1;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return result;
    }

    private static int findLast(int[] nums, int target) {
        int left = 0, right = nums.length - 1;
        int result = -1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) {
                result = mid;        // Запоминаем и ищем ещё правее
                left = mid + 1;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return result;
    }

    public static void main(String[] args) {
        System.out.println(java.util.Arrays.toString(
            searchRange(new int[]{5,7,7,8,8,10}, 8)));  // [3, 4]
        System.out.println(java.util.Arrays.toString(
            searchRange(new int[]{5,7,7,8,8,10}, 6)));  // [-1, -1]
        System.out.println(java.util.Arrays.toString(
            searchRange(new int[]{}, 0)));               // [-1, -1]
    }
}`,
      explanation: 'Два модифицированных бинарных поиска. findFirst: при совпадении не останавливаемся, а продолжаем искать влево (right = mid - 1). findLast: при совпадении ищем правее (left = mid + 1). Запоминаем последний найденный result. Оба поиска O(log n), итого O(log n). Этот паттерн "binary search for boundary" используется во многих задачах.'
    },
    {
      id: 4,
      title: 'Search in Rotated Sorted Array (LeetCode #33)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Отсортированный массив был повёрнут в неизвестной точке (например [4,5,6,7,0,1,2]). Найдите индекс target за O(log n) или верните -1.\n\nПример:\nВход: nums = [4, 5, 6, 7, 0, 1, 2], target = 0\nВыход: 4',
      requirements: [
        'Метод search(int[] nums, int target) возвращает int',
        'Модифицированный бинарный поиск',
        'Определить, какая половина отсортирована, и искать там',
        'Время O(log n), элементы уникальны'
      ],
      expectedOutput: 'Input: [4,5,6,7,0,1,2], target=0 → Output: 4\nInput: [4,5,6,7,0,1,2], target=3 → Output: -1\nInput: [1], target=0 → Output: -1',
      hint: 'На каждом шаге одна из половин [left..mid] или [mid..right] обязательно отсортирована. Определи какая: если nums[left] <= nums[mid] — левая отсортирована. Проверь, попадает ли target в отсортированную половину.',
      solution: `public class SearchInRotatedArray {
    public static int search(int[] nums, int target) {
        int left = 0, right = nums.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] == target) return mid;

            // Определяем, какая половина отсортирована
            if (nums[left] <= nums[mid]) {
                // Левая половина [left..mid] отсортирована
                if (target >= nums[left] && target < nums[mid]) {
                    right = mid - 1; // Target в левой половине
                } else {
                    left = mid + 1;  // Target в правой половине
                }
            } else {
                // Правая половина [mid..right] отсортирована
                if (target > nums[mid] && target <= nums[right]) {
                    left = mid + 1;  // Target в правой половине
                } else {
                    right = mid - 1; // Target в левой половине
                }
            }
        }

        return -1;
    }

    public static void main(String[] args) {
        System.out.println(search(new int[]{4, 5, 6, 7, 0, 1, 2}, 0)); // 4
        System.out.println(search(new int[]{4, 5, 6, 7, 0, 1, 2}, 3)); // -1
        System.out.println(search(new int[]{1}, 0));                     // -1
    }
}`,
      explanation: 'В повёрнутом массиве одна из половин всегда отсортирована. Проверяем nums[left] <= nums[mid]: если да — левая часть отсортирована. Затем проверяем, попадает ли target в отсортированную часть. Если да — ищем там. Если нет — ищем в другой половине. O(log n) гарантировано, так как каждый шаг уменьшает область поиска вдвое.'
    },
    {
      id: 5,
      title: 'Find Minimum in Rotated Sorted Array (LeetCode #153)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Отсортированный массив уникальных элементов был повёрнут от 1 до n раз. Найдите минимальный элемент за O(log n).\n\nПример:\nВход: nums = [3, 4, 5, 1, 2]\nВыход: 1',
      requirements: [
        'Метод findMin(int[] nums) возвращает int',
        'Бинарный поиск: сравнивать mid с right',
        'Если nums[mid] > nums[right] — минимум справа',
        'Время O(log n), элементы уникальны'
      ],
      expectedOutput: 'Input: [3,4,5,1,2] → Output: 1\nInput: [4,5,6,7,0,1,2] → Output: 0\nInput: [11,13,15,17] → Output: 11\nInput: [2,1] → Output: 1',
      hint: 'Сравнивай nums[mid] с nums[right]. Если nums[mid] > nums[right] — точка поворота (и минимум) находится справа: left = mid + 1. Иначе — минимум в [left..mid]: right = mid.',
      solution: `public class FindMinInRotatedArray {
    public static int findMin(int[] nums) {
        int left = 0, right = nums.length - 1;

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] > nums[right]) {
                // Минимум находится справа от mid
                left = mid + 1;
            } else {
                // Минимум находится в [left..mid]
                right = mid; // mid может быть минимумом
            }
        }

        return nums[left]; // left == right — точка минимума
    }

    public static void main(String[] args) {
        System.out.println(findMin(new int[]{3, 4, 5, 1, 2}));     // 1
        System.out.println(findMin(new int[]{4, 5, 6, 7, 0, 1, 2})); // 0
        System.out.println(findMin(new int[]{11, 13, 15, 17}));     // 11
        System.out.println(findMin(new int[]{2, 1}));                // 1
    }
}`,
      explanation: 'Сравниваем nums[mid] с nums[right] (не с nums[left]!). Если nums[mid] > nums[right] — в правой части есть "разрыв" (точка поворота), минимум там: left = mid + 1. Иначе — правая часть отсортирована, минимум в [left..mid]: right = mid. Условие while (left < right) (без равенства) и right = mid (не mid-1) — стандартный шаблон для поиска границы.'
    },
    {
      id: 6,
      title: 'Search a 2D Matrix (LeetCode #74)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана матрица m x n, где каждая строка отсортирована, и первый элемент каждой строки больше последнего элемента предыдущей. Определите, есть ли в матрице число target.\n\nПример:\nВход: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3\nВыход: true',
      requirements: [
        'Метод searchMatrix(int[][] matrix, int target) возвращает boolean',
        'Рассматривать матрицу как один отсортированный массив',
        'Преобразование индекса: row = mid / cols, col = mid % cols',
        'Время O(log(m*n)), один бинарный поиск'
      ],
      expectedOutput: 'Input: [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=3 → true\nInput: [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=13 → false\nInput: [[1]], target=1 → true',
      hint: 'Матрица — по сути один отсортированный массив длины m*n. Бинарный поиск по виртуальному индексу [0, m*n-1]. Конвертация: row = mid / n, col = mid % n.',
      solution: `public class SearchMatrix {
    public static boolean searchMatrix(int[][] matrix, int target) {
        int rows = matrix.length, cols = matrix[0].length;
        int left = 0, right = rows * cols - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            // Конвертация виртуального индекса в координаты матрицы
            int row = mid / cols;
            int col = mid % cols;
            int value = matrix[row][col];

            if (value == target) {
                return true;
            } else if (value < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return false;
    }

    public static void main(String[] args) {
        int[][] matrix = {
            {1, 3, 5, 7},
            {10, 11, 16, 20},
            {23, 30, 34, 60}
        };
        System.out.println(searchMatrix(matrix, 3));  // true
        System.out.println(searchMatrix(matrix, 13)); // false

        System.out.println(searchMatrix(new int[][]{{1}}, 1)); // true
    }
}`,
      explanation: 'Вместо двух бинарных поисков (сначала строка, потом столбец) используем один: рассматриваем матрицу как плоский массив длины m*n. Виртуальный индекс mid конвертируется: row = mid / cols, col = mid % cols. Один бинарный поиск O(log(m*n)) = O(log m + log n). Работает потому что строки "склеиваются" в отсортированную последовательность.'
    },
    {
      id: 7,
      title: 'Koko Eating Bananas (LeetCode #875)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Коко ест бананы. Есть n кучек бананов piles[i]. Стражник вернётся через h часов. Коко может есть k бананов в час (если в кучке < k — съедает всю кучку за час). Найдите минимальное k, чтобы Коко успел съесть все бананы за h часов.\n\nПример:\nВход: piles = [3, 6, 7, 11], h = 8\nВыход: 4',
      requirements: [
        'Метод minEatingSpeed(int[] piles, int h) возвращает int',
        'Бинарный поиск по ответу: k в диапазоне [1, max(piles)]',
        'Вспомогательная функция: canFinish(piles, k, h)',
        'Время O(n * log(max(piles)))'
      ],
      expectedOutput: 'Input: piles=[3,6,7,11], h=8 → Output: 4\nInput: piles=[30,11,23,4,20], h=5 → Output: 30\nInput: piles=[30,11,23,4,20], h=6 → Output: 23',
      hint: 'Бинарный поиск по скорости k. Для каждого k считай общее время: sum(ceil(pile / k)). Если время <= h — k достаточно, ищем меньше (right = mid). Если > h — слишком медленно (left = mid + 1).',
      solution: `public class KokoEatingBananas {
    public static int minEatingSpeed(int[] piles, int h) {
        int left = 1;
        int right = 0;
        for (int pile : piles) right = Math.max(right, pile);

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (canFinish(piles, mid, h)) {
                right = mid; // Можно медленнее
            } else {
                left = mid + 1; // Нужно быстрее
            }
        }

        return left;
    }

    private static boolean canFinish(int[] piles, int speed, int h) {
        int hours = 0;
        for (int pile : piles) {
            // ceil(pile / speed) = (pile + speed - 1) / speed
            hours += (pile + speed - 1) / speed;
        }
        return hours <= h;
    }

    public static void main(String[] args) {
        System.out.println(minEatingSpeed(new int[]{3, 6, 7, 11}, 8));     // 4
        System.out.println(minEatingSpeed(new int[]{30, 11, 23, 4, 20}, 5)); // 30
        System.out.println(minEatingSpeed(new int[]{30, 11, 23, 4, 20}, 6)); // 23
    }
}`,
      explanation: 'Бинарный поиск по ответу — мощный паттерн: вместо поиска элемента в массиве ищем оптимальное значение параметра. Диапазон скорости: [1, max(piles)]. Для каждой скорости проверяем, успеет ли Коко. ceil(a/b) без double: (a + b - 1) / b. Условие while (left < right) + right = mid — шаблон поиска минимума. O(n * log(max)) время.'
    },
    {
      id: 8,
      title: 'Find Peak Element (LeetCode #162)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums, где nums[i] != nums[i+1]. Найдите индекс пикового элемента (больше обоих соседей). Массив может иметь несколько пиков — верните индекс любого. nums[-1] = nums[n] = -infinity.\n\nПример:\nВход: nums = [1, 2, 3, 1]\nВыход: 2 (nums[2] = 3 — пик)',
      requirements: [
        'Метод findPeakElement(int[] nums) возвращает int',
        'Бинарный поиск: если nums[mid] < nums[mid+1] — пик справа',
        'Время O(log n)',
        'Любой пик — валидный ответ'
      ],
      expectedOutput: 'Input: [1,2,3,1] → Output: 2\nInput: [1,2,1,3,5,6,4] → Output: 5 (или 1)\nInput: [1] → Output: 0',
      hint: 'Если nums[mid] < nums[mid+1], то на отрезке [mid+1, right] гарантированно есть пик (потому что справа растём, а в конце -infinity). Иначе — пик в [left, mid].',
      solution: `public class FindPeakElement {
    public static int findPeakElement(int[] nums) {
        int left = 0, right = nums.length - 1;

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] < nums[mid + 1]) {
                // Восходящий склон — пик справа
                left = mid + 1;
            } else {
                // Нисходящий склон — пик слева (или mid сам пик)
                right = mid;
            }
        }

        return left; // left == right — индекс пика
    }

    public static void main(String[] args) {
        System.out.println(findPeakElement(new int[]{1, 2, 3, 1}));       // 2
        System.out.println(findPeakElement(new int[]{1, 2, 1, 3, 5, 6, 4})); // 5 или 1
        System.out.println(findPeakElement(new int[]{1}));                 // 0
    }
}`,
      explanation: 'Бинарный поиск работает даже на неотсортированном массиве! Ключевая идея: если nums[mid] < nums[mid+1] — мы на восходящем склоне, пик гарантированно справа (в конце -infinity, значит где-то будет спуск). Если nums[mid] > nums[mid+1] — пик в [left, mid]. while (left < right) + right = mid — сужаем до одного элемента. O(log n) время.'
    },
    {
      id: 9,
      title: 'Median of Two Sorted Arrays (LeetCode #4)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Даны два отсортированных массива nums1 и nums2 размеров m и n. Найдите медиану объединённого отсортированного массива. Время должно быть O(log(m+n)).\n\nПример:\nВход: nums1 = [1, 3], nums2 = [2]\nВыход: 2.0 (объединённый массив [1, 2, 3], медиана = 2)',
      requirements: [
        'Метод findMedianSortedArrays(int[] nums1, int[] nums2) возвращает double',
        'Бинарный поиск по меньшему массиву',
        'Найти правильное разбиение обоих массивов на левую и правую части',
        'Время O(log(min(m, n)))'
      ],
      expectedOutput: 'Input: [1,3], [2] → Output: 2.0\nInput: [1,2], [3,4] → Output: 2.5\nInput: [0,0], [0,0] → Output: 0.0',
      hint: 'Бинарный поиск по разбиению меньшего массива (i элементов слева). j = (m+n+1)/2 - i элементов из второго массива. Условие: maxLeft1 <= minRight2 && maxLeft2 <= minRight1. Используй Integer.MIN/MAX_VALUE для граничных случаев.',
      solution: `public class MedianOfTwoSortedArrays {
    public static double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Всегда ищем по меньшему массиву
        if (nums1.length > nums2.length) {
            return findMedianSortedArrays(nums2, nums1);
        }

        int m = nums1.length, n = nums2.length;
        int left = 0, right = m;
        int halfLen = (m + n + 1) / 2;

        while (left <= right) {
            int i = left + (right - left) / 2; // Разбиение nums1
            int j = halfLen - i;                // Разбиение nums2

            int maxLeft1 = (i == 0) ? Integer.MIN_VALUE : nums1[i - 1];
            int minRight1 = (i == m) ? Integer.MAX_VALUE : nums1[i];
            int maxLeft2 = (j == 0) ? Integer.MIN_VALUE : nums2[j - 1];
            int minRight2 = (j == n) ? Integer.MAX_VALUE : nums2[j];

            if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
                // Нашли правильное разбиение
                if ((m + n) % 2 == 1) {
                    return Math.max(maxLeft1, maxLeft2);
                } else {
                    return (Math.max(maxLeft1, maxLeft2) +
                            Math.min(minRight1, minRight2)) / 2.0;
                }
            } else if (maxLeft1 > minRight2) {
                right = i - 1; // Слишком много из nums1
            } else {
                left = i + 1;  // Слишком мало из nums1
            }
        }

        throw new IllegalArgumentException("Массивы не отсортированы");
    }

    public static void main(String[] args) {
        System.out.println(findMedianSortedArrays(
            new int[]{1, 3}, new int[]{2}));     // 2.0
        System.out.println(findMedianSortedArrays(
            new int[]{1, 2}, new int[]{3, 4}));  // 2.5
        System.out.println(findMedianSortedArrays(
            new int[]{0, 0}, new int[]{0, 0}));  // 0.0
    }
}`,
      explanation: 'Одна из самых сложных задач на бинарный поиск. Идея: разделить оба массива на левую и правую части, чтобы maxLeft <= minRight. Бинарный поиск по разбиению меньшего массива (i элементов). j вычисляется автоматически: halfLen - i. Граничные значения MIN/MAX_VALUE обрабатывают крайние случаи. O(log(min(m,n))) — ищем только по меньшему массиву.'
    },
    {
      id: 10,
      title: 'Split Array Largest Sum (LeetCode #410)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив nums и число k. Разбейте массив на k непрерывных подмассивов так, чтобы минимизировать максимальную сумму среди них. Верните эту минимальную максимальную сумму.\n\nПример:\nВход: nums = [7, 2, 5, 10, 8], k = 2\nВыход: 18 (разбиение [7,2,5] и [10,8], суммы 14 и 18, максимум = 18)',
      requirements: [
        'Метод splitArray(int[] nums, int k) возвращает int',
        'Бинарный поиск по ответу: от max(nums) до sum(nums)',
        'Проверка: можно ли разбить на <= k частей с макс. суммой <= mid',
        'Время O(n * log(sum - max))'
      ],
      expectedOutput: 'Input: [7,2,5,10,8], k=2 → Output: 18\nInput: [1,2,3,4,5], k=2 → Output: 9\nInput: [1,4,4], k=3 → Output: 4',
      hint: 'Бинарный поиск по максимальной сумме подмассива. left = max(nums) (каждый элемент в отдельном подмассиве), right = sum(nums) (один подмассив). canSplit: жадно набирай сумму, если превышает mid — начинай новый подмассив.',
      solution: `public class SplitArrayLargestSum {
    public static int splitArray(int[] nums, int k) {
        int left = 0;  // max(nums)
        long right = 0; // sum(nums)

        for (int num : nums) {
            left = Math.max(left, num);
            right += num;
        }

        while (left < right) {
            long mid = left + (right - left) / 2;

            if (canSplit(nums, k, mid)) {
                right = mid; // Можно с меньшей суммой
            } else {
                left = (int) mid + 1; // Нужна большая сумма
            }
        }

        return left;
    }

    // Можно ли разбить на <= k частей с макс. суммой <= maxSum?
    private static boolean canSplit(int[] nums, int k, long maxSum) {
        int parts = 1;
        long currentSum = 0;

        for (int num : nums) {
            currentSum += num;
            if (currentSum > maxSum) {
                // Начинаем новый подмассив
                parts++;
                currentSum = num;
                if (parts > k) return false;
            }
        }

        return true;
    }

    public static void main(String[] args) {
        System.out.println(splitArray(new int[]{7, 2, 5, 10, 8}, 2)); // 18
        System.out.println(splitArray(new int[]{1, 2, 3, 4, 5}, 2));  // 9
        System.out.println(splitArray(new int[]{1, 4, 4}, 3));         // 4
    }
}`,
      explanation: 'Бинарный поиск по ответу — минимальной максимальной сумме подмассива. Диапазон: [max(nums), sum(nums)]. Для каждого кандидата mid жадно проверяем: набираем сумму, если превышает mid — начинаем новый подмассив. Если подмассивов > k — mid слишком мал. Если <= k — mid достаточен, ищем меньше. O(n * log(sum - max)) время. Этот паттерн "binary search on answer + greedy check" встречается во многих Hard задачах.'
    }
  ]
}
