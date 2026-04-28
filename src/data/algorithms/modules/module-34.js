export default {
  id: 34,
  title: 'Практикум: Sliding Window',
  description: '10 классических задач на скользящее окно. Подмассивы фиксированной и переменной длины, анаграммы, замены символов, двусторонняя очередь.',
  lessons: [
    {
      id: 1,
      title: 'Maximum Average Subarray I (LeetCode #643)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив nums и целое число k. Найдите непрерывный подмассив длиной k с максимальным средним значением. Верните это среднее.\n\nПример:\nВход: nums = [1, 12, -5, -6, 50, 3], k = 4\nВыход: 12.75 (подмассив [12, -5, -6, 50], среднее = 51/4 = 12.75)',
      requirements: [
        'Метод findMaxAverage(int[] nums, int k) возвращает double',
        'Использовать скользящее окно фиксированного размера k',
        'Время O(n), память O(1)',
        'Не пересчитывать сумму заново на каждом шаге'
      ],
      expectedOutput: 'Input: [1,12,-5,-6,50,3], k=4 → Output: 12.75\nInput: [5], k=1 → Output: 5.0\nInput: [0,4,0,3,2], k=1 → Output: 4.0',
      hint: 'Сначала посчитай сумму первых k элементов. Затем двигай окно: добавляй правый, убирай левый. Обновляй максимальную сумму. В конце дели на k.',
      solution: `public class MaximumAverageSubarray {
    public static double findMaxAverage(int[] nums, int k) {
        // Сумма первого окна
        double windowSum = 0;
        for (int i = 0; i < k; i++) {
            windowSum += nums[i];
        }

        double maxSum = windowSum;

        // Сдвигаем окно: добавляем правый, убираем левый
        for (int i = k; i < nums.length; i++) {
            windowSum += nums[i] - nums[i - k];
            maxSum = Math.max(maxSum, windowSum);
        }

        return maxSum / k;
    }

    public static void main(String[] args) {
        System.out.println(findMaxAverage(new int[]{1, 12, -5, -6, 50, 3}, 4)); // 12.75
        System.out.println(findMaxAverage(new int[]{5}, 1));                      // 5.0
        System.out.println(findMaxAverage(new int[]{0, 4, 0, 3, 2}, 1));          // 4.0
    }
}`,
      explanation: 'Классическое скользящее окно фиксированного размера. Вместо пересчёта суммы за O(k) на каждом шаге, мы добавляем новый элемент и убираем старый за O(1). Общее время O(n). Делим максимальную сумму на k в конце, а не на каждом шаге — меньше операций с double.'
    },
    {
      id: 2,
      title: 'Minimum Size Subarray Sum (LeetCode #209)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив положительных чисел nums и число target. Найдите минимальную длину непрерывного подмассива, сумма которого >= target. Если такого нет — верните 0.\n\nПример:\nВход: nums = [2, 3, 1, 2, 4, 3], target = 7\nВыход: 2 (подмассив [4, 3])',
      requirements: [
        'Метод minSubArrayLen(int target, int[] nums) возвращает int',
        'Скользящее окно переменного размера',
        'Время O(n), память O(1)',
        'Расширять окно вправо, сужать слева когда сумма >= target'
      ],
      expectedOutput: 'Input: target=7, nums=[2,3,1,2,4,3] → Output: 2\nInput: target=4, nums=[1,4,4] → Output: 1\nInput: target=11, nums=[1,1,1,1,1,1,1,1] → Output: 0',
      hint: 'left = 0, расширяй right. Когда windowSum >= target — сужай left, обновляя минимальную длину. Все числа положительные, поэтому при сужении сумма уменьшается.',
      solution: `public class MinimumSizeSubarraySum {
    public static int minSubArrayLen(int target, int[] nums) {
        int minLen = Integer.MAX_VALUE;
        int windowSum = 0;
        int left = 0;

        for (int right = 0; right < nums.length; right++) {
            windowSum += nums[right]; // Расширяем окно

            // Сужаем окно пока сумма >= target
            while (windowSum >= target) {
                minLen = Math.min(minLen, right - left + 1);
                windowSum -= nums[left];
                left++;
            }
        }

        return minLen == Integer.MAX_VALUE ? 0 : minLen;
    }

    public static void main(String[] args) {
        System.out.println(minSubArrayLen(7, new int[]{2, 3, 1, 2, 4, 3})); // 2
        System.out.println(minSubArrayLen(4, new int[]{1, 4, 4}));           // 1
        System.out.println(minSubArrayLen(11, new int[]{1,1,1,1,1,1,1,1})); // 0
    }
}`,
      explanation: 'Скользящее окно переменного размера: расширяем right, пока не достигнем target. Затем сужаем left для минимизации длины. Каждый элемент добавляется и удаляется из окна максимум один раз — O(n) амортизированно. Работает только для положительных чисел (при сужении сумма гарантированно уменьшается).'
    },
    {
      id: 3,
      title: 'Longest Substring Without Repeating Characters (LeetCode #3)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s. Найдите длину самой длинной подстроки без повторяющихся символов.\n\nПример:\nВход: s = "abcabcbb"\nВыход: 3 (подстрока "abc")',
      requirements: [
        'Метод lengthOfLongestSubstring(String s) возвращает int',
        'Скользящее окно + HashSet или HashMap',
        'Время O(n), одно проход по строке',
        'Обработать пустую строку'
      ],
      expectedOutput: 'Input: "abcabcbb" → Output: 3\nInput: "bbbbb" → Output: 1\nInput: "pwwkew" → Output: 3\nInput: "" → Output: 0',
      hint: 'Используй HashMap<Character, Integer>: символ -> последний индекс. Если символ уже в окне (индекс >= left), сдвигай left за него. Обновляй maxLen = right - left + 1.',
      solution: `import java.util.*;

public class LongestSubstringNoRepeat {
    public static int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> lastSeen = new HashMap<>();
        int maxLen = 0;
        int left = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);

            // Если символ уже встречался внутри текущего окна
            if (lastSeen.containsKey(c) && lastSeen.get(c) >= left) {
                left = lastSeen.get(c) + 1; // Прыгаем за дубликат
            }

            lastSeen.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }

        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb")); // 3
        System.out.println(lengthOfLongestSubstring("bbbbb"));    // 1
        System.out.println(lengthOfLongestSubstring("pwwkew"));   // 3
        System.out.println(lengthOfLongestSubstring(""));         // 0
    }
}`,
      explanation: 'Скользящее окно с HashMap для O(1) прыжков. При обнаружении дубликата вместо постепенного сужения left (через HashSet) сразу прыгаем за последнее вхождение символа. Условие lastSeen.get(c) >= left важно: старые записи вне окна не должны влиять. Один проход O(n).'
    },
    {
      id: 4,
      title: 'Permutation in String (LeetCode #567)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Даны строки s1 и s2. Верните true, если s2 содержит перестановку (анаграмму) s1 как подстроку.\n\nПример:\nВход: s1 = "ab", s2 = "eidbaooo"\nВыход: true (s2 содержит "ba" — перестановку "ab")',
      requirements: [
        'Метод checkInclusion(String s1, String s2) возвращает boolean',
        'Скользящее окно размера s1.length() по строке s2',
        'Сравнивать частотные массивы int[26]',
        'Время O(n), где n = |s2|'
      ],
      expectedOutput: 'Input: s1="ab", s2="eidbaooo" → Output: true\nInput: s1="ab", s2="eidboaoo" → Output: false\nInput: s1="adc", s2="dcda" → Output: true',
      hint: 'Скользящее окно фиксированного размера |s1|. Поддерживай частотный массив окна. Сравнивай с частотным массивом s1 через Arrays.equals.',
      solution: `import java.util.Arrays;

public class PermutationInString {
    public static boolean checkInclusion(String s1, String s2) {
        if (s1.length() > s2.length()) return false;

        int[] s1Freq = new int[26];
        int[] windowFreq = new int[26];

        // Частоты s1
        for (char c : s1.toCharArray()) {
            s1Freq[c - 'a']++;
        }

        int k = s1.length();

        for (int i = 0; i < s2.length(); i++) {
            // Добавляем правый символ
            windowFreq[s2.charAt(i) - 'a']++;

            // Убираем символ за левой границей окна
            if (i >= k) {
                windowFreq[s2.charAt(i - k) - 'a']--;
            }

            // Сравниваем частоты
            if (Arrays.equals(s1Freq, windowFreq)) {
                return true;
            }
        }

        return false;
    }

    public static void main(String[] args) {
        System.out.println(checkInclusion("ab", "eidbaooo")); // true
        System.out.println(checkInclusion("ab", "eidboaoo")); // false
        System.out.println(checkInclusion("adc", "dcda"));    // true
    }
}`,
      explanation: 'Скользящее окно фиксированного размера |s1| скользит по s2. На каждом шаге обновляем частоты за O(1) и сравниваем массивы за O(26) = O(1). Итого O(n) время. Можно оптимизировать: вместо Arrays.equals отслеживать счётчик совпавших позиций (matches), но для 26 элементов разница незначительна.'
    },
    {
      id: 5,
      title: 'Find All Anagrams in a String (LeetCode #438)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Даны строки s и p. Найдите все начальные индексы анаграмм p в s. Порядок вывода не важен.\n\nПример:\nВход: s = "cbaebabacd", p = "abc"\nВыход: [0, 6] ("cba" на позиции 0, "bac" на позиции 6)',
      requirements: [
        'Метод findAnagrams(String s, String p) возвращает List<Integer>',
        'Скользящее окно размера |p| + частотные массивы',
        'Оптимизация: счётчик matches вместо Arrays.equals',
        'Время O(n), память O(1)'
      ],
      expectedOutput: 'Input: s="cbaebabacd", p="abc" → Output: [0, 6]\nInput: s="abab", p="ab" → Output: [0, 1, 2]\nInput: s="af", p="be" → Output: []',
      hint: 'Как Permutation in String, но собираем ВСЕ позиции. Оптимизация: вместо сравнения массивов, отслеживай matches — количество позиций в freq, где счётчики совпадают. Когда matches == 26 — анаграмма найдена.',
      solution: `import java.util.*;

public class FindAllAnagrams {
    public static List<Integer> findAnagrams(String s, String p) {
        List<Integer> result = new ArrayList<>();
        if (s.length() < p.length()) return result;

        int[] pFreq = new int[26];
        int[] wFreq = new int[26];

        for (char c : p.toCharArray()) pFreq[c - 'a']++;

        int k = p.length();
        int matches = 0;

        // Считаем начальное количество совпадений
        for (int i = 0; i < 26; i++) {
            if (pFreq[i] == 0) matches++; // wFreq[i] == 0 == pFreq[i]
        }

        for (int i = 0; i < s.length(); i++) {
            // Добавляем правый символ
            int idx = s.charAt(i) - 'a';
            wFreq[idx]++;
            if (wFreq[idx] == pFreq[idx]) matches++;
            else if (wFreq[idx] == pFreq[idx] + 1) matches--;

            // Убираем левый символ
            if (i >= k) {
                int leftIdx = s.charAt(i - k) - 'a';
                wFreq[leftIdx]--;
                if (wFreq[leftIdx] == pFreq[leftIdx]) matches++;
                else if (wFreq[leftIdx] == pFreq[leftIdx] - 1) matches--;
            }

            if (matches == 26) {
                result.add(i - k + 1);
            }
        }

        return result;
    }

    public static void main(String[] args) {
        System.out.println(findAnagrams("cbaebabacd", "abc")); // [0, 6]
        System.out.println(findAnagrams("abab", "ab"));         // [0, 1, 2]
        System.out.println(findAnagrams("af", "be"));           // []
    }
}`,
      explanation: 'Оптимизация через счётчик matches: вместо сравнения 26 элементов на каждом шаге, отслеживаем количество позиций, где частоты совпадают. При добавлении/удалении символа обновляем matches за O(1). Когда matches == 26 — все 26 позиций совпадают, значит окно — анаграмма. Чистый O(n) без скрытых констант.'
    },
    {
      id: 6,
      title: 'Longest Repeating Character Replacement (LeetCode #424)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s и число k. Можно заменить не более k символов на любые другие. Найдите длину самой длинной подстроки, состоящей из одного повторяющегося символа.\n\nПример:\nВход: s = "AABABBA", k = 1\nВыход: 4 (замени один B в "AABA" → "AAAA")',
      requirements: [
        'Метод characterReplacement(String s, int k) возвращает int',
        'Скользящее окно + частотный массив',
        'Ключевая формула: windowSize - maxFreq <= k',
        'Время O(n), память O(1)'
      ],
      expectedOutput: 'Input: s="AABABBA", k=1 → Output: 4\nInput: s="ABAB", k=2 → Output: 4\nInput: s="ABCDE", k=1 → Output: 2',
      hint: 'Окно валидно, если (размер окна - частота самого частого символа) <= k. То есть нужно заменить не более k символов. Если окно невалидно — сужай left.',
      solution: `public class LongestRepeatingCharReplacement {
    public static int characterReplacement(String s, int k) {
        int[] freq = new int[26];
        int maxFreq = 0; // Макс. частота одного символа в окне
        int maxLen = 0;
        int left = 0;

        for (int right = 0; right < s.length(); right++) {
            freq[s.charAt(right) - 'A']++;
            maxFreq = Math.max(maxFreq, freq[s.charAt(right) - 'A']);

            // Если нужно заменить больше k символов — сужаем
            int windowSize = right - left + 1;
            if (windowSize - maxFreq > k) {
                freq[s.charAt(left) - 'A']--;
                left++;
            }

            maxLen = Math.max(maxLen, right - left + 1);
        }

        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println(characterReplacement("AABABBA", 1)); // 4
        System.out.println(characterReplacement("ABAB", 2));    // 4
        System.out.println(characterReplacement("ABCDE", 1));   // 2
    }
}`,
      explanation: 'Ключевая идея: в окне мы хотим оставить самый частый символ и заменить остальные. Замен нужно (windowSize - maxFreq). Если > k — окно невалидно, сужаем. Тонкость: maxFreq не уменьшаем при сужении — это безопасно, потому что нас интересует только рост максимальной длины. O(n) время, O(26) = O(1) память.'
    },
    {
      id: 7,
      title: 'Max Consecutive Ones III (LeetCode #1004)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан бинарный массив nums и число k. Можно перевернуть не более k нулей в единицы. Верните максимальное количество последовательных единиц.\n\nПример:\nВход: nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2\nВыход: 6 (перевернём два нуля: [1,1,1,0,0,1,1,1,1,1,1]... окно [0,1,1,1,1,1,1] длины 6)',
      requirements: [
        'Метод longestOnes(int[] nums, int k) возвращает int',
        'Скользящее окно: считать количество нулей в окне',
        'Если нулей > k — сужать left',
        'Время O(n), память O(1)'
      ],
      expectedOutput: 'Input: [1,1,1,0,0,0,1,1,1,1,0], k=2 → Output: 6\nInput: [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k=3 → Output: 10\nInput: [1,1,1], k=0 → Output: 3',
      hint: 'Скользящее окно: расширяй right. Если nums[right]==0, увеличивай zeroCount. Пока zeroCount > k — сужай left (если nums[left]==0, уменьшай zeroCount). Ответ — максимальный размер окна.',
      solution: `public class MaxConsecutiveOnesIII {
    public static int longestOnes(int[] nums, int k) {
        int left = 0;
        int zeroCount = 0;
        int maxLen = 0;

        for (int right = 0; right < nums.length; right++) {
            if (nums[right] == 0) {
                zeroCount++;
            }

            // Сужаем окно, если нулей больше k
            while (zeroCount > k) {
                if (nums[left] == 0) {
                    zeroCount--;
                }
                left++;
            }

            maxLen = Math.max(maxLen, right - left + 1);
        }

        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println(longestOnes(new int[]{1,1,1,0,0,0,1,1,1,1,0}, 2));                      // 6
        System.out.println(longestOnes(new int[]{0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1}, 3));     // 10
        System.out.println(longestOnes(new int[]{1,1,1}, 0));                                       // 3
    }
}`,
      explanation: 'Переформулировка задачи: найти самое длинное окно с не более чем k нулями. Стандартное скользящее окно: расширяем right, считаем нули. Если нулей > k — сужаем left. Максимальный размер окна — ответ. O(n) время (каждый элемент добавляется и удаляется максимум раз), O(1) память.'
    },
    {
      id: 8,
      title: 'Fruit Into Baskets (LeetCode #904)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив fruits (типы фруктов на деревьях в ряд). У вас две корзины, каждая вмещает один тип фрукта. Начав с любого дерева, собирайте фрукты вправо. Остановитесь, когда встретите третий тип. Найдите максимальное количество фруктов.\n\nПо сути: найти длиннейший подмассив с не более чем 2 различными элементами.\n\nПример:\nВход: fruits = [1, 2, 1]\nВыход: 3',
      requirements: [
        'Метод totalFruit(int[] fruits) возвращает int',
        'Скользящее окно + HashMap (тип фрукта -> количество)',
        'Сужать окно когда в нём > 2 типов',
        'Время O(n), память O(1) (макс 3 записи в map)'
      ],
      expectedOutput: 'Input: [1,2,1] → Output: 3\nInput: [0,1,2,2] → Output: 3\nInput: [1,2,3,2,2] → Output: 4\nInput: [3,3,3,1,2,1,1,2,3,3,4] → Output: 5',
      hint: 'HashMap хранит тип фрукта и его количество в окне. Расширяй right. Если map.size() > 2 — сужай left, уменьшая счётчик. Когда счётчик 0 — удаляй из map.',
      solution: `import java.util.*;

public class FruitIntoBaskets {
    public static int totalFruit(int[] fruits) {
        Map<Integer, Integer> basket = new HashMap<>();
        int maxLen = 0;
        int left = 0;

        for (int right = 0; right < fruits.length; right++) {
            // Добавляем фрукт в корзину
            basket.merge(fruits[right], 1, Integer::sum);

            // Если больше 2 типов — сужаем окно
            while (basket.size() > 2) {
                int leftFruit = fruits[left];
                basket.merge(leftFruit, -1, Integer::sum);
                if (basket.get(leftFruit) == 0) {
                    basket.remove(leftFruit);
                }
                left++;
            }

            maxLen = Math.max(maxLen, right - left + 1);
        }

        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println(totalFruit(new int[]{1, 2, 1}));                     // 3
        System.out.println(totalFruit(new int[]{0, 1, 2, 2}));                  // 3
        System.out.println(totalFruit(new int[]{1, 2, 3, 2, 2}));               // 4
        System.out.println(totalFruit(new int[]{3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4})); // 5
    }
}`,
      explanation: 'Задача сводится к "longest subarray with at most K distinct elements" (K=2). Скользящее окно + HashMap для подсчёта типов. При > 2 типах сужаем left. merge(key, -1, Integer::sum) — элегантный способ уменьшить счётчик. O(n) время, O(1) фактическая память (максимум 3 записи в map).'
    },
    {
      id: 9,
      title: 'Minimum Window Substring (LeetCode #76)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Даны строки s и t. Найдите минимальную подстроку s, содержащую все символы t (с учётом повторений). Если такой подстроки нет — верните "".\n\nПример:\nВход: s = "ADOBECODEBANC", t = "ABC"\nВыход: "BANC"',
      requirements: [
        'Метод minWindow(String s, String t) возвращает String',
        'Скользящее окно с двумя HashMap: need и window',
        'Счётчик have/required для отслеживания покрытия',
        'Время O(|s| + |t|), память O(|s| + |t|)'
      ],
      expectedOutput: 'Input: s="ADOBECODEBANC", t="ABC" → Output: "BANC"\nInput: s="a", t="a" → Output: "a"\nInput: s="a", t="aa" → Output: ""',
      hint: 'need = частоты t. Расширяй right, обновляя window. Когда have == required (все символы покрыты) — сужай left, обновляя минимальную длину. have увеличивается когда window[c] достигает need[c].',
      solution: `import java.util.*;

public class MinWindowSubstring {
    public static String minWindow(String s, String t) {
        if (s.length() < t.length()) return "";

        // Частоты символов t
        Map<Character, Integer> need = new HashMap<>();
        for (char c : t.toCharArray()) {
            need.merge(c, 1, Integer::sum);
        }

        Map<Character, Integer> window = new HashMap<>();
        int have = 0, required = need.size();
        int minLen = Integer.MAX_VALUE, minStart = 0;
        int left = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            window.merge(c, 1, Integer::sum);

            // Символ полностью покрыт
            if (need.containsKey(c) &&
                window.get(c).intValue() == need.get(c).intValue()) {
                have++;
            }

            // Сужаем пока все символы покрыты
            while (have == required) {
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    minStart = left;
                }

                char leftChar = s.charAt(left);
                window.merge(leftChar, -1, Integer::sum);
                if (need.containsKey(leftChar) &&
                    window.get(leftChar) < need.get(leftChar)) {
                    have--;
                }
                left++;
            }
        }

        return minLen == Integer.MAX_VALUE ? "" :
               s.substring(minStart, minStart + minLen);
    }

    public static void main(String[] args) {
        System.out.println(minWindow("ADOBECODEBANC", "ABC")); // "BANC"
        System.out.println(minWindow("a", "a"));                // "a"
        System.out.println(minWindow("a", "aa"));               // ""
    }
}`,
      explanation: 'Классическая hard задача на скользящее окно. need хранит требуемые частоты, window — текущие. have считает полностью покрытые символы. Расширяем right до полного покрытия, затем сужаем left для минимизации. Каждый символ добавляется и удаляется из окна не более одного раза — O(|s|). Построение need — O(|t|). Итого O(|s| + |t|).'
    },
    {
      id: 10,
      title: 'Sliding Window Maximum (LeetCode #239)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив nums и размер окна k. Скользящее окно двигается слева направо. Верните массив максимумов в каждом положении окна.\n\nПример:\nВход: nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3\nВыход: [3, 3, 5, 5, 6, 7]',
      requirements: [
        'Метод maxSlidingWindow(int[] nums, int k) возвращает int[]',
        'Использовать монотонную двустороннюю очередь (Deque)',
        'Deque хранит индексы в убывающем порядке значений',
        'Время O(n), память O(k)'
      ],
      expectedOutput: 'Input: [1,3,-1,-3,5,3,6,7], k=3 → Output: [3, 3, 5, 5, 6, 7]\nInput: [1], k=1 → Output: [1]\nInput: [1,-1], k=1 → Output: [1, -1]',
      hint: 'Deque (двусторонняя очередь) хранит индексы. Перед добавлением нового элемента удаляй из хвоста все индексы с меньшими значениями. Удаляй из головы индексы за пределами окна. Голова — всегда максимум.',
      solution: `import java.util.*;

public class SlidingWindowMaximum {
    public static int[] maxSlidingWindow(int[] nums, int k) {
        if (nums.length == 0) return new int[0];

        int[] result = new int[nums.length - k + 1];
        // Монотонная Deque: хранит ИНДЕКСЫ в убывающем порядке значений
        Deque<Integer> deque = new ArrayDeque<>();

        for (int i = 0; i < nums.length; i++) {
            // Удаляем индексы за пределами окна (слева)
            while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
                deque.pollFirst();
            }

            // Удаляем из хвоста элементы меньше текущего
            // (они никогда не будут максимумом)
            while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
                deque.pollLast();
            }

            deque.offerLast(i); // Добавляем текущий индекс

            // Записываем максимум (голова deque)
            if (i >= k - 1) {
                result[i - k + 1] = nums[deque.peekFirst()];
            }
        }

        return result;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(
            maxSlidingWindow(new int[]{1,3,-1,-3,5,3,6,7}, 3)));
        // [3, 3, 5, 5, 6, 7]

        System.out.println(Arrays.toString(
            maxSlidingWindow(new int[]{1}, 1)));
        // [1]

        System.out.println(Arrays.toString(
            maxSlidingWindow(new int[]{1,-1}, 1)));
        // [1, -1]
    }
}`,
      explanation: 'Монотонная двусторонняя очередь (Monotonic Deque) — мощная структура для задач на скользящий максимум/минимум. Deque хранит индексы в убывающем порядке значений: голова — максимум. При добавлении нового элемента удаляем из хвоста все меньшие (они бесполезны). Из головы удаляем вышедшие за окно. Каждый элемент добавляется и удаляется из deque максимум один раз — амортизированно O(1) на элемент. Итого O(n).'
    }
  ]
}
