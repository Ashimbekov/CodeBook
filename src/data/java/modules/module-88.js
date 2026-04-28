export default {
  id: 88,
  title: 'Практикум: Two Pointers и Sliding Window',
  description: 'Практические задачи на технику двух указателей и скользящего окна: контейнеры, подмассивы, сортировки.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Container With Most Water',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив высот. Найди два столбца, которые вместе с осью X образуют контейнер с максимальным объёмом воды.',
      requirements: [
        'Используй два указателя: left = 0, right = n-1',
        'Площадь = min(height[left], height[right]) * (right - left)',
        'Двигай указатель с меньшей высотой',
        'Обновляй максимум на каждом шаге'
      ],
      expectedOutput: 'heights=[1,8,6,2,5,4,8,3,7]\nМаксимальный объём: 49 (столбцы 1 и 8, ширина 7)',
      hint: 'Двигаем меньший столбец, потому что перемещение большего не может увеличить площадь (ширина уменьшается, а высота ограничена меньшим столбцом).',
      solution: `public class Main {
    static int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxWater = 0;

        while (left < right) {
            int water = Math.min(height[left], height[right]) * (right - left);
            maxWater = Math.max(maxWater, water);
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxWater;
    }

    public static void main(String[] args) {
        int[] heights = {1, 8, 6, 2, 5, 4, 8, 3, 7};
        System.out.println("heights=[1,8,6,2,5,4,8,3,7]");
        System.out.println("Максимальный объём: " + maxArea(heights)
            + " (столбцы 1 и 8, ширина 7)");
    }
}`,
      explanation: 'Two pointers с двух концов — оптимальный подход O(n). Начинаем с максимальной ширины. На каждом шаге двигаем указатель с меньшей высотой, потому что: 1) перемещение большего не увеличит площадь (ограничена меньшим), 2) перемещение меньшего может найти более высокий столбец. Это гарантирует проверку всех потенциально оптимальных пар.'
    },
    {
      id: 2,
      title: 'Задача: 3Sum',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди все уникальные тройки чисел, которые в сумме дают 0. Результат не должен содержать дубликатов.',
      requirements: [
        'Отсортируй массив',
        'Фиксируй первый элемент, для оставшихся используй two pointers',
        'Пропускай дубликаты первого элемента',
        'Пропускай дубликаты в two pointers'
      ],
      expectedOutput: 'nums=[-1,0,1,2,-1,-4]\nТройки с суммой 0: [[-1,-1,2],[-1,0,1]]',
      hint: 'Отсортируй. Для каждого i: left=i+1, right=n-1. Если sum<0 → left++. Если sum>0 → right--. Если sum==0 → записать и пропустить дубликаты.',
      solution: `import java.util.*;

public class Main {
    static List<List<Integer>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();

        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int left = i + 1, right = nums.length - 1;

            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum < 0) {
                    left++;
                } else if (sum > 0) {
                    right--;
                } else {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                }
            }
        }
        return result;
    }

    public static void main(String[] args) {
        int[] nums = {-1, 0, 1, 2, -1, -4};
        System.out.println("nums=[-1,0,1,2,-1,-4]");
        System.out.println("Тройки с суммой 0: " + threeSum(nums));
    }
}`,
      explanation: '3Sum сводится к серии задач 2Sum на отсортированном массиве. Фиксируем первый элемент, ищем два других с помощью two pointers. Сортировка позволяет пропускать дубликаты и эффективно двигать указатели. Пропуск дубликатов критически важен: без него получим повторяющиеся тройки. Сложность O(n^2) — оптимально для этой задачи.'
    },
    {
      id: 3,
      title: 'Задача: Remove Duplicates from Sorted Array',
      type: 'practice',
      difficulty: 'easy',
      description: 'Удали дубликаты из отсортированного массива in-place. Верни длину нового массива. Порядок элементов сохрани.',
      requirements: [
        'Используй два указателя: slow и fast',
        'slow — позиция для следующего уникального элемента',
        'fast — сканирует весь массив',
        'Если nums[fast] != nums[slow] — копируй и двигай slow'
      ],
      expectedOutput: 'До: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]\nПосле: [0, 1, 2, 3, 4], длина: 5',
      hint: 'slow=0. Для fast от 1 до n-1: если nums[fast] != nums[slow], увеличь slow и скопируй nums[fast] в nums[slow].',
      solution: `import java.util.Arrays;

public class Main {
    static int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;
        int slow = 0;
        for (int fast = 1; fast < nums.length; fast++) {
            if (nums[fast] != nums[slow]) {
                slow++;
                nums[slow] = nums[fast];
            }
        }
        return slow + 1;
    }

    public static void main(String[] args) {
        int[] nums = {0, 0, 1, 1, 1, 2, 2, 3, 3, 4};
        System.out.println("До: " + Arrays.toString(nums));
        int len = removeDuplicates(nums);
        System.out.println("После: " + Arrays.toString(Arrays.copyOf(nums, len)) + ", длина: " + len);
    }
}`,
      explanation: 'Классическая задача на два указателя. slow указывает на последний уникальный элемент. fast сканирует массив. Когда fast находит новый элемент (отличный от slow) — slow++ и копируем. Массив отсортирован, поэтому дубликаты всегда рядом. In-place: O(1) дополнительной памяти, O(n) по времени. Этот паттерн "slow/fast pointer" встречается во многих задачах.'
    },
    {
      id: 4,
      title: 'Задача: Trapping Rain Water',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив высот столбцов. Вычисли, сколько воды можно собрать после дождя между столбцами.',
      requirements: [
        'Используй два указателя: left и right',
        'Отслеживай leftMax и rightMax',
        'Вода над позицией = min(leftMax, rightMax) - height',
        'Двигай указатель с меньшим max'
      ],
      expectedOutput: 'heights=[0,1,0,2,1,0,1,3,2,1,2,1]\nВода: 6',
      hint: 'Если leftMax < rightMax: вода в left определяется leftMax (правая стена точно выше). Вычисли water += leftMax - height[left], двинь left. Иначе — аналогично для right.',
      solution: `public class Main {
    static int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0;
        int water = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                leftMax = Math.max(leftMax, height[left]);
                water += leftMax - height[left];
                left++;
            } else {
                rightMax = Math.max(rightMax, height[right]);
                water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }

    public static void main(String[] args) {
        int[] heights = {0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1};
        System.out.println("heights=[0,1,0,2,1,0,1,3,2,1,2,1]");
        System.out.println("Вода: " + trap(heights));
    }
}`,
      explanation: 'Two pointers с двух концов. Ключевое наблюдение: вода над позицией = min(maxLeft, maxRight) - height. Если leftMax < rightMax, то для left-позиции ограничивающий фактор — leftMax (правая стена точно выше). Двигаем left и считаем воду. Аналогично для right. Это O(n) по времени и O(1) по памяти — эффективнее подходов с массивами prefix max.'
    },
    {
      id: 5,
      title: 'Задача: Sort Colors (Dutch National Flag)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Отсортируй массив из 0, 1 и 2 за один проход. Это задача "голландского флага" Дейкстры.',
      requirements: [
        'Три указателя: low (граница 0), mid (текущий), high (граница 2)',
        'Если nums[mid] == 0: swap(low, mid), low++, mid++',
        'Если nums[mid] == 1: mid++',
        'Если nums[mid] == 2: swap(mid, high), high--'
      ],
      expectedOutput: 'До: [2, 0, 2, 1, 1, 0]\nПосле: [0, 0, 1, 1, 2, 2]',
      hint: 'Не увеличивай mid при swap с high! Элемент из high может быть 0 и потребует повторной обработки. При swap с low — mid++ безопасен, т.к. элемент из low <= 1.',
      solution: `import java.util.Arrays;

public class Main {
    static void sortColors(int[] nums) {
        int low = 0, mid = 0, high = nums.length - 1;

        while (mid <= high) {
            if (nums[mid] == 0) {
                int temp = nums[low];
                nums[low] = nums[mid];
                nums[mid] = temp;
                low++;
                mid++;
            } else if (nums[mid] == 1) {
                mid++;
            } else {
                int temp = nums[mid];
                nums[mid] = nums[high];
                nums[high] = temp;
                high--;
            }
        }
    }

    public static void main(String[] args) {
        int[] nums = {2, 0, 2, 1, 1, 0};
        System.out.println("До: " + Arrays.toString(nums));
        sortColors(nums);
        System.out.println("После: " + Arrays.toString(nums));
    }
}`,
      explanation: 'Dutch National Flag — алгоритм трёхсторонней разбивки за один проход O(n). Три области: [0..low-1] = нули, [low..mid-1] = единицы, [high+1..n-1] = двойки, [mid..high] = неотсортированные. При swap(mid, high) не увеличиваем mid, потому что элемент из high ещё не проверен. При swap(low, mid) — mid++ безопасен, т.к. left уже содержит 0 или 1.'
    },
    {
      id: 6,
      title: 'Задача: Maximum Subarray (Kadane)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди непрерывный подмассив с максимальной суммой. Реализуй алгоритм Кадане.',
      requirements: [
        'Поддерживай currentSum — максимальная сумма, заканчивающаяся в текущей позиции',
        'currentSum = max(nums[i], currentSum + nums[i])',
        'Обновляй глобальный максимум',
        'Также выведи сам подмассив'
      ],
      expectedOutput: 'nums=[-2,1,-3,4,-1,2,1,-5,4]\nМаксимальная сумма: 6\nПодмассив: [4, -1, 2, 1]',
      hint: 'На каждом шаге решаем: начать новый подмассив (nums[i]) или продолжить текущий (currentSum + nums[i]). Выбираем максимум. Для нахождения самого подмассива: запоминай start и end.',
      solution: `import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        int maxSum = nums[0];
        int currentSum = nums[0];
        int start = 0, end = 0, tempStart = 0;

        for (int i = 1; i < nums.length; i++) {
            if (currentSum + nums[i] < nums[i]) {
                currentSum = nums[i];
                tempStart = i;
            } else {
                currentSum += nums[i];
            }
            if (currentSum > maxSum) {
                maxSum = currentSum;
                start = tempStart;
                end = i;
            }
        }

        System.out.println("nums=" + Arrays.toString(nums));
        System.out.println("Максимальная сумма: " + maxSum);
        System.out.println("Подмассив: " + Arrays.toString(Arrays.copyOfRange(nums, start, end + 1)));
    }
}`,
      explanation: 'Алгоритм Кадане — O(n) решение для задачи максимального подмассива. На каждой позиции выбор: продолжить текущий подмассив или начать новый. Если currentSum + nums[i] < nums[i], значит предыдущая сумма отрицательна и только мешает — начинаем заново. Для восстановления подмассива: запоминаем start (начало текущего кандидата) и обновляем end при новом максимуме.'
    },
    {
      id: 7,
      title: 'Задача: Minimum Size Subarray Sum',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди минимальную длину непрерывного подмассива, сумма которого >= target. Если такого нет — верни 0.',
      requirements: [
        'Используй sliding window',
        'Расширяй окно вправо, добавляя элементы',
        'Когда сумма >= target: сужай слева, обновляя минимум',
        'Сложность O(n)'
      ],
      expectedOutput: 'target=7, nums=[2,3,1,2,4,3]\nМинимальная длина: 2 (подмассив [4,3])\n\ntarget=11, nums=[1,1,1,1,1,1,1,1]\nМинимальная длина: 0 (невозможно)',
      hint: 'Sliding window: right расширяет, left сужает. Когда sum >= target: обнови минимум, вычти nums[left], left++. Продолжай сужение пока sum >= target.',
      solution: `public class Main {
    static int minSubArrayLen(int target, int[] nums) {
        int left = 0, sum = 0;
        int minLen = Integer.MAX_VALUE;

        for (int right = 0; right < nums.length; right++) {
            sum += nums[right];
            while (sum >= target) {
                minLen = Math.min(minLen, right - left + 1);
                sum -= nums[left];
                left++;
            }
        }
        return minLen == Integer.MAX_VALUE ? 0 : minLen;
    }

    public static void main(String[] args) {
        System.out.println("target=7, nums=[2,3,1,2,4,3]");
        System.out.println("Минимальная длина: " + minSubArrayLen(7, new int[]{2, 3, 1, 2, 4, 3})
            + " (подмассив [4,3])");

        System.out.println();
        System.out.println("target=11, nums=[1,1,1,1,1,1,1,1]");
        System.out.println("Минимальная длина: " + minSubArrayLen(11, new int[]{1, 1, 1, 1, 1, 1, 1, 1})
            + " (невозможно)");
    }
}`,
      explanation: 'Sliding window с переменным размером окна. Правый указатель расширяет окно, добавляя элементы в сумму. Когда сумма достигает target — сужаем окно слева, ища минимальную длину. Каждый элемент добавляется и удаляется максимум один раз — O(n). Если минимум не найден (остался MAX_VALUE) — подмассива с нужной суммой нет.'
    },
    {
      id: 8,
      title: 'Задача: Longest Repeating Character Replacement',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка и число k. Можно заменить не более k символов. Найди длину самой длинной подстроки, состоящей из одного символа.',
      requirements: [
        'Sliding window: расширяй окно вправо',
        'Отслеживай частоту символов в окне и максимальную частоту maxFreq',
        'Если (размер окна - maxFreq) > k — сужай слева',
        'Ответ — максимальный размер окна'
      ],
      expectedOutput: 's="AABABBA", k=1 → 4 ("AABA" → "AAAA")\ns="ABAB", k=2 → 4 ("ABAB" → "AAAA")',
      hint: 'Количество замен = размер окна - maxFreq. Если замен > k — окно слишком большое, сдвигаем left. maxFreq не нужно уменьшать (это оптимизация, не влияющая на корректность).',
      solution: `public class Main {
    static int characterReplacement(String s, int k) {
        int[] count = new int[26];
        int left = 0, maxFreq = 0, maxLen = 0;

        for (int right = 0; right < s.length(); right++) {
            count[s.charAt(right) - 'A']++;
            maxFreq = Math.max(maxFreq, count[s.charAt(right) - 'A']);

            if (right - left + 1 - maxFreq > k) {
                count[s.charAt(left) - 'A']--;
                left++;
            }
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println("s=\\"AABABBA\\", k=1 → " + characterReplacement("AABABBA", 1)
            + " (\\"AABA\\" → \\"AAAA\\")");
        System.out.println("s=\\"ABAB\\", k=2 → " + characterReplacement("ABAB", 2)
            + " (\\"ABAB\\" → \\"AAAA\\")");
    }
}`,
      explanation: 'Sliding window с подсчётом частот. Ключевое наблюдение: в окне нужно заменить (размер_окна - maxFreq) символов. Если это > k — окно слишком большое. Интересный момент: maxFreq НЕ уменьшается при сдвиге left. Это корректно, потому что нас интересует только максимальное окно, а оно возможно только при увеличении maxFreq.'
    },
    {
      id: 9,
      title: 'Задача: Fruit Into Baskets',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив фруктов. Есть 2 корзины, каждая может содержать только один тип фрукта. Найди максимальное количество фруктов, которые можно собрать подряд.',
      requirements: [
        'По сути: найди самый длинный подмассив максимум с 2 различными числами',
        'Sliding window + HashMap для подсчёта типов в окне',
        'Когда типов > 2: сужай окно слева',
        'Обновляй максимум'
      ],
      expectedOutput: 'fruits=[1,2,1] → 3 (все фрукты)\nfruits=[0,1,2,2] → 3 (подмассив [1,2,2])\nfruits=[1,2,3,2,2] → 4 (подмассив [2,3,2,2])',
      hint: 'HashMap<Integer, Integer> хранит частоту каждого типа в окне. Если map.size() > 2: удаляй fruit[left] из map, если count=0 — удали ключ, left++.',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {
    static int totalFruit(int[] fruits) {
        Map<Integer, Integer> basket = new HashMap<>();
        int left = 0, maxLen = 0;

        for (int right = 0; right < fruits.length; right++) {
            basket.merge(fruits[right], 1, Integer::sum);

            while (basket.size() > 2) {
                int leftFruit = fruits[left];
                basket.merge(leftFruit, -1, Integer::sum);
                if (basket.get(leftFruit) == 0) basket.remove(leftFruit);
                left++;
            }
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println("fruits=[1,2,1] → " + totalFruit(new int[]{1, 2, 1}));
        System.out.println("fruits=[0,1,2,2] → " + totalFruit(new int[]{0, 1, 2, 2}));
        System.out.println("fruits=[1,2,3,2,2] → " + totalFruit(new int[]{1, 2, 3, 2, 2}));
    }
}`,
      explanation: 'Fruit Into Baskets — задача на longest subarray with at most K distinct elements (K=2). Sliding window + HashMap: расширяем окно вправо, добавляя фрукты. Если типов > 2 — сужаем слева, убирая фрукты из HashMap. Когда count типа = 0 — удаляем ключ. Максимальный размер валидного окна — ответ. Обобщение на K типов — та же логика.'
    },
    {
      id: 10,
      title: 'Задача: Permutation in String',
      type: 'practice',
      difficulty: 'medium',
      description: 'Определи, содержит ли строка s2 перестановку строки s1 как подстроку.',
      requirements: [
        'Sliding window размера len(s1)',
        'Подсчитай частоты символов s1',
        'Окно в s2 движется, поддерживая массив частот',
        'Если частоты совпадают — найдена перестановка'
      ],
      expectedOutput: 's1="ab", s2="eidbaooo" → true ("ba" — перестановка "ab")\ns1="ab", s2="eidboaoo" → false',
      hint: 'Фиксированное окно размера s1.length(). Вместо сравнения массивов на каждом шаге, используй переменную matches — количество совпавших частот (из 26 букв). Если matches == 26 — OK.',
      solution: `public class Main {
    static boolean checkInclusion(String s1, String s2) {
        if (s1.length() > s2.length()) return false;

        int[] s1Count = new int[26];
        int[] windowCount = new int[26];

        for (int i = 0; i < s1.length(); i++) {
            s1Count[s1.charAt(i) - 'a']++;
            windowCount[s2.charAt(i) - 'a']++;
        }

        int matches = 0;
        for (int i = 0; i < 26; i++) {
            if (s1Count[i] == windowCount[i]) matches++;
        }

        for (int i = s1.length(); i < s2.length(); i++) {
            if (matches == 26) return true;

            int addIdx = s2.charAt(i) - 'a';
            windowCount[addIdx]++;
            if (windowCount[addIdx] == s1Count[addIdx]) matches++;
            else if (windowCount[addIdx] == s1Count[addIdx] + 1) matches--;

            int removeIdx = s2.charAt(i - s1.length()) - 'a';
            windowCount[removeIdx]--;
            if (windowCount[removeIdx] == s1Count[removeIdx]) matches++;
            else if (windowCount[removeIdx] == s1Count[removeIdx] - 1) matches--;
        }
        return matches == 26;
    }

    public static void main(String[] args) {
        System.out.println("s1=\\"ab\\", s2=\\"eidbaooo\\" → " + checkInclusion("ab", "eidbaooo"));
        System.out.println("s1=\\"ab\\", s2=\\"eidboaoo\\" → " + checkInclusion("ab", "eidboaoo"));
    }
}`,
      explanation: 'Фиксированное окно + счётчик matches. Вместо сравнения 26 частот на каждом шаге (O(26)), отслеживаем matches — сколько букв имеют одинаковую частоту в окне и в s1. При добавлении/удалении символа обновляем matches за O(1). Если matches == 26 — все 26 букв совпадают по частоте → окно содержит перестановку. Сложность O(n).'
    }
  ]
}
