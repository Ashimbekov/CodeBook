export default {
  id: 32,
  title: 'Практикум: String паттерны',
  description: '10 классических задач на строки в стиле LeetCode. Анаграммы, палиндромы, скользящее окно, динамическое программирование на строках.',
  lessons: [
    {
      id: 1,
      title: 'Valid Anagram (LeetCode #242)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Даны две строки s и t. Верните true, если t является анаграммой s, иначе false. Анаграмма — слово, полученное перестановкой букв другого слова.\n\nПример:\nВход: s = "anagram", t = "nagaram"\nВыход: true',
      requirements: [
        'Метод isAnagram(String s, String t) возвращает boolean',
        'Использовать частотный массив int[26] для строчных латинских букв',
        'Время O(n), память O(1) (массив фиксированного размера)',
        'Обработать строки разной длины'
      ],
      expectedOutput: 'Input: s="anagram", t="nagaram" → Output: true\nInput: s="rat", t="car" → Output: false\nInput: s="a", t="a" → Output: true',
      hint: 'Если длины разные — сразу false. Иначе: заведи int[26]. Для s увеличивай счётчик freq[c-\'a\']++. Для t уменьшай freq[c-\'a\']--. Если все нули — анаграмма.',
      solution: `public class ValidAnagram {
    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;

        int[] freq = new int[26];

        // Считаем частоты символов в s
        for (char c : s.toCharArray()) {
            freq[c - 'a']++;
        }

        // Вычитаем частоты символов в t
        for (char c : t.toCharArray()) {
            freq[c - 'a']--;
            // Ранний выход: если стало отрицательным — не анаграмма
            if (freq[c - 'a'] < 0) return false;
        }

        return true;
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("anagram", "nagaram")); // true
        System.out.println(isAnagram("rat", "car"));         // false
        System.out.println(isAnagram("a", "a"));             // true
    }
}`,
      explanation: 'Частотный массив int[26] — стандартный приём для задач с латинскими буквами. Сначала считаем частоты для s, потом вычитаем для t. Если все элементы ноль — строки являются анаграммами. Ранний выход при отрицательном значении ускоряет работу на практике. O(n) время, O(1) память.'
    },
    {
      id: 2,
      title: 'Valid Palindrome (LeetCode #125)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дана строка s. Определите, является ли она палиндромом, учитывая только буквы и цифры и игнорируя регистр.\n\nПример:\nВход: s = "A man, a plan, a canal: Panama"\nВыход: true ("amanaplanacanalpanama" — палиндром)',
      requirements: [
        'Метод isPalindrome(String s) возвращает boolean',
        'Игнорировать все символы кроме букв и цифр',
        'Сравнение без учёта регистра',
        'Использовать два указателя (left, right), O(1) памяти'
      ],
      expectedOutput: 'Input: "A man, a plan, a canal: Panama" → Output: true\nInput: "race a car" → Output: false\nInput: " " → Output: true',
      hint: 'Два указателя с краёв. Пропускай не-алфавитно-цифровые символы с обеих сторон (Character.isLetterOrDigit). Сравнивай в нижнем регистре (Character.toLowerCase).',
      solution: `public class ValidPalindrome {
    public static boolean isPalindrome(String s) {
        int left = 0, right = s.length() - 1;

        while (left < right) {
            // Пропускаем не-алфавитно-цифровые символы слева
            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
                left++;
            }
            // Пропускаем не-алфавитно-цифровые символы справа
            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
                right--;
            }

            // Сравниваем в нижнем регистре
            if (Character.toLowerCase(s.charAt(left)) !=
                Character.toLowerCase(s.charAt(right))) {
                return false;
            }

            left++;
            right--;
        }

        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama")); // true
        System.out.println(isPalindrome("race a car"));                     // false
        System.out.println(isPalindrome(" "));                              // true
    }
}`,
      explanation: 'Два указателя сходятся к центру, пропуская "мусорные" символы. Character.isLetterOrDigit проверяет буквы и цифры, Character.toLowerCase приводит к нижнему регистру. O(n) время, O(1) память — не создаём новую строку.'
    },
    {
      id: 3,
      title: 'Longest Substring Without Repeating Characters (LeetCode #3)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s. Найдите длину самой длинной подстроки без повторяющихся символов.\n\nПример:\nВход: s = "abcabcbb"\nВыход: 3 (подстрока "abc")',
      requirements: [
        'Метод lengthOfLongestSubstring(String s) возвращает int',
        'Использовать скользящее окно + HashSet или HashMap',
        'Время O(n), память O(min(n, m)) где m — размер алфавита',
        'Обработать пустую строку и строку из одинаковых символов'
      ],
      expectedOutput: 'Input: "abcabcbb" → Output: 3\nInput: "bbbbb" → Output: 1\nInput: "pwwkew" → Output: 3\nInput: "" → Output: 0',
      hint: 'Скользящее окно [left, right]. HashSet хранит символы в окне. Если right-символ уже в set — удаляем left-символ из set и двигаем left. Иначе — добавляем в set и обновляем max.',
      solution: `import java.util.*;

public class LongestSubstringWithoutRepeating {
    public static int lengthOfLongestSubstring(String s) {
        // HashMap: символ -> его последний индекс
        Map<Character, Integer> map = new HashMap<>();
        int maxLen = 0;
        int left = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);

            // Если символ уже в окне — сдвигаем left
            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;
            }

            map.put(c, right);
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
      explanation: 'Скользящее окно с HashMap. Для каждого символа запоминаем его последний индекс. Если символ уже встречался внутри текущего окна (индекс >= left), сдвигаем left за него. Это позволяет за один проход находить длину максимальной подстроки без повторов. O(n) время, O(min(n, 128)) память для ASCII.'
    },
    {
      id: 4,
      title: 'Group Anagrams (LeetCode #49)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив строк strs. Сгруппируйте анаграммы вместе. Порядок групп и элементов внутри группы не важен.\n\nПример:\nВход: strs = ["eat","tea","tan","ate","nat","bat"]\nВыход: [["bat"],["nat","tan"],["ate","eat","tea"]]',
      requirements: [
        'Метод groupAnagrams(String[] strs) возвращает List<List<String>>',
        'Использовать HashMap с канонической формой как ключ',
        'Каноническая форма: отсортированная строка или частотный массив',
        'Время O(n * k log k), где k — макс длина строки'
      ],
      expectedOutput: 'Input: ["eat","tea","tan","ate","nat","bat"] → [["eat","tea","ate"],["tan","nat"],["bat"]]\nInput: [""] → [[""]]\nInput: ["a"] → [["a"]]',
      hint: 'Все анаграммы при сортировке дают одну строку. Используй отсортированную строку как ключ HashMap. computeIfAbsent упростит добавление.',
      solution: `import java.util.*;

public class GroupAnagrams {
    public static List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();

        for (String s : strs) {
            // Каноническая форма: отсортированная строка
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);

            // Добавляем в соответствующую группу
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }

        return new ArrayList<>(map.values());
    }

    // Альтернатива: ключ через частотный массив (O(n * k) без сортировки)
    public static List<List<String>> groupAnagramsFreq(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();

        for (String s : strs) {
            int[] freq = new int[26];
            for (char c : s.toCharArray()) freq[c - 'a']++;
            // Ключ: "1#0#0#...#0" — частоты через разделитель
            StringBuilder sb = new StringBuilder();
            for (int f : freq) sb.append(f).append('#');
            String key = sb.toString();

            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }

        return new ArrayList<>(map.values());
    }

    public static void main(String[] args) {
        String[] strs = {"eat","tea","tan","ate","nat","bat"};
        System.out.println(groupAnagrams(strs));
        // [["eat","tea","ate"],["tan","nat"],["bat"]]

        System.out.println(groupAnagrams(new String[]{""}));  // [[""]]
        System.out.println(groupAnagrams(new String[]{"a"})); // [["a"]]
    }
}`,
      explanation: 'Два подхода к канонической форме: 1) Сортировка строки — O(k log k) на строку. 2) Частотный массив — O(k) на строку. Оба используют HashMap для группировки. Способ с частотами быстрее для длинных строк, но ключ длиннее. computeIfAbsent — удобный метод Java: создаёт список если ключа ещё нет.'
    },
    {
      id: 5,
      title: 'Longest Palindromic Substring (LeetCode #5)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s. Верните самую длинную палиндромную подстроку в s.\n\nПример:\nВход: s = "babad"\nВыход: "bab" (или "aba" — оба верны)',
      requirements: [
        'Метод longestPalindrome(String s) возвращает String',
        'Использовать метод расширения от центра (Expand Around Center)',
        'Проверять нечётные и чётные палиндромы',
        'Время O(n²), память O(1)'
      ],
      expectedOutput: 'Input: "babad" → Output: "bab"\nInput: "cbbd" → Output: "bb"\nInput: "a" → Output: "a"\nInput: "ac" → Output: "a"',
      hint: 'Для каждого символа (центра) расширяйся влево и вправо, пока символы совпадают. Проверяй два случая: нечётный палиндром (центр — один символ) и чётный (центр — между двумя символами).',
      solution: `public class LongestPalindromicSubstring {
    public static String longestPalindrome(String s) {
        if (s.length() < 2) return s;

        int start = 0, maxLen = 1;

        for (int center = 0; center < s.length(); center++) {
            // Нечётный палиндром: "aba" (центр — один символ)
            int len1 = expandAroundCenter(s, center, center);
            // Чётный палиндром: "abba" (центр — между символами)
            int len2 = expandAroundCenter(s, center, center + 1);

            int len = Math.max(len1, len2);
            if (len > maxLen) {
                maxLen = len;
                start = center - (len - 1) / 2;
            }
        }

        return s.substring(start, start + maxLen);
    }

    private static int expandAroundCenter(String s, int left, int right) {
        // Расширяем пока символы совпадают
        while (left >= 0 && right < s.length()
               && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        return right - left - 1; // Длина палиндрома
    }

    public static void main(String[] args) {
        System.out.println(longestPalindrome("babad")); // "bab"
        System.out.println(longestPalindrome("cbbd"));  // "bb"
        System.out.println(longestPalindrome("a"));     // "a"
        System.out.println(longestPalindrome("ac"));    // "a"
    }
}`,
      explanation: 'Метод расширения от центра: для каждого символа пробуем расширить палиндром влево и вправо. Проверяем два случая: нечётный (один центр) и чётный (два центра). Всего 2n - 1 возможных центров. Каждое расширение — O(n) в худшем случае. Итого O(n²) время, O(1) память. Формула start = center - (len - 1) / 2 вычисляет начало палиндрома.'
    },
    {
      id: 6,
      title: 'String to Integer — atoi (LeetCode #8)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте функцию myAtoi(String s), которая преобразует строку в 32-битное целое число. Правила:\n1. Пропустить начальные пробелы\n2. Определить знак (+/-)\n3. Читать цифры до первого нецифрового символа\n4. Ограничить результат диапазоном [Integer.MIN_VALUE, Integer.MAX_VALUE]\n\nПример:\nВход: s = "   -42"\nВыход: -42',
      requirements: [
        'Метод myAtoi(String s) возвращает int',
        'Пропустить начальные пробелы',
        'Обработать знак (+/-)',
        'Обработать переполнение int (clamping к MIN_VALUE/MAX_VALUE)'
      ],
      expectedOutput: 'Input: "42" → Output: 42\nInput: "   -42" → Output: -42\nInput: "4193 with words" → Output: 4193\nInput: "words and 987" → Output: 0\nInput: "-91283472332" → Output: -2147483648',
      hint: 'Пошагово: 1) Пропусти пробелы. 2) Определи знак. 3) Читай цифры, проверяя переполнение ПЕРЕД умножением на 10. Сравнивай с Integer.MAX_VALUE / 10.',
      solution: `public class StringToInteger {
    public static int myAtoi(String s) {
        int i = 0, n = s.length();

        // 1. Пропускаем пробелы
        while (i < n && s.charAt(i) == ' ') i++;

        if (i >= n) return 0;

        // 2. Определяем знак
        int sign = 1;
        if (s.charAt(i) == '-' || s.charAt(i) == '+') {
            sign = s.charAt(i) == '-' ? -1 : 1;
            i++;
        }

        // 3. Читаем цифры
        int result = 0;
        while (i < n && Character.isDigit(s.charAt(i))) {
            int digit = s.charAt(i) - '0';

            // Проверка переполнения ПЕРЕД умножением
            if (result > Integer.MAX_VALUE / 10 ||
                (result == Integer.MAX_VALUE / 10 && digit > Integer.MAX_VALUE % 10)) {
                return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
            }

            result = result * 10 + digit;
            i++;
        }

        return result * sign;
    }

    public static void main(String[] args) {
        System.out.println(myAtoi("42"));              // 42
        System.out.println(myAtoi("   -42"));          // -42
        System.out.println(myAtoi("4193 with words")); // 4193
        System.out.println(myAtoi("words and 987"));   // 0
        System.out.println(myAtoi("-91283472332"));    // -2147483648
    }
}`,
      explanation: 'Главная сложность — проверка переполнения. Проверяем ДО умножения: если result > MAX/10 или result == MAX/10 и digit > MAX%10 — переполнение. Возвращаем MAX_VALUE или MIN_VALUE в зависимости от знака. Алгоритм линейный O(n), проходим строку один раз.'
    },
    {
      id: 7,
      title: 'Count and Say (LeetCode #38)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Последовательность "Count and Say" начинается с "1" и каждый следующий член получается "произнесением" предыдущего:\n"1" → одна 1 → "11"\n"11" → две 1 → "21"\n"21" → одна 2, одна 1 → "1211"\n"1211" → одна 1, одна 2, две 1 → "111221"\n\nВерните n-й член последовательности.\n\nПример:\nВход: n = 4\nВыход: "1211"',
      requirements: [
        'Метод countAndSay(int n) возвращает String',
        'Итеративно строить каждый следующий член',
        'Считать подряд идущие одинаковые символы',
        'n >= 1, countAndSay(1) = "1"'
      ],
      expectedOutput: 'Input: n=1 → Output: "1"\nInput: n=2 → Output: "11"\nInput: n=3 → Output: "21"\nInput: n=4 → Output: "1211"\nInput: n=5 → Output: "111221"',
      hint: 'Начни с "1". На каждом шаге проходи текущую строку, считая группы одинаковых символов. Формируй новую строку: count + символ. Повтори n-1 раз.',
      solution: `public class CountAndSay {
    public static String countAndSay(int n) {
        String current = "1";

        for (int step = 2; step <= n; step++) {
            StringBuilder next = new StringBuilder();
            int i = 0;

            while (i < current.length()) {
                char ch = current.charAt(i);
                int count = 0;

                // Считаем подряд идущие одинаковые символы
                while (i < current.length() && current.charAt(i) == ch) {
                    count++;
                    i++;
                }

                // Добавляем: количество + символ
                next.append(count).append(ch);
            }

            current = next.toString();
        }

        return current;
    }

    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println("n=" + i + " → " + countAndSay(i));
        }
        // n=1 → 1
        // n=2 → 11
        // n=3 → 21
        // n=4 → 1211
        // n=5 → 111221
    }
}`,
      explanation: 'Итеративный подход: начинаем с "1" и на каждом шаге "произносим" текущую строку. Для каждой группы одинаковых символов записываем количество + символ. StringBuilder эффективнее конкатенации строк. Сложность зависит от длины строк, которые растут экспоненциально, но для практических n (до 30) работает быстро.'
    },
    {
      id: 8,
      title: 'Longest Common Prefix (LeetCode #14)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив строк strs. Найдите самый длинный общий префикс среди всех строк. Если общего префикса нет — верните пустую строку.\n\nПример:\nВход: strs = ["flower", "flow", "flight"]\nВыход: "fl"',
      requirements: [
        'Метод longestCommonPrefix(String[] strs) возвращает String',
        'Посимвольное сравнение вертикальным сканированием',
        'Обработать пустой массив и массив с пустой строкой',
        'Время O(S), где S — суммарная длина всех строк'
      ],
      expectedOutput: 'Input: ["flower","flow","flight"] → Output: "fl"\nInput: ["dog","racecar","car"] → Output: ""\nInput: ["interspecies","interstellar","interstate"] → Output: "inters"',
      hint: 'Бери первую строку как эталон. Для каждого символа на позиции i проверяй, есть ли такой символ во всех остальных строках. Как только не совпал — возвращай prefix до i.',
      solution: `public class LongestCommonPrefix {
    public static String longestCommonPrefix(String[] strs) {
        if (strs == null || strs.length == 0) return "";

        // Берём первую строку как эталон
        String first = strs[0];

        for (int i = 0; i < first.length(); i++) {
            char c = first.charAt(i);

            // Проверяем символ i во всех остальных строках
            for (int j = 1; j < strs.length; j++) {
                // Если строка короче или символ не совпал
                if (i >= strs[j].length() || strs[j].charAt(i) != c) {
                    return first.substring(0, i);
                }
            }
        }

        return first; // Вся первая строка — общий префикс
    }

    public static void main(String[] args) {
        System.out.println(longestCommonPrefix(
            new String[]{"flower","flow","flight"}));      // "fl"
        System.out.println(longestCommonPrefix(
            new String[]{"dog","racecar","car"}));          // ""
        System.out.println(longestCommonPrefix(
            new String[]{"interspecies","interstellar","interstate"})); // "inters"
    }
}`,
      explanation: 'Вертикальное сканирование: проверяем символы столбец за столбцом. Для позиции i проверяем, совпадает ли символ во всех строках. Первое несовпадение или конец строки — возвращаем результат. В худшем случае O(S), где S — сумма длин всех строк. В лучшем — O(n * minLen), где n — количество строк.'
    },
    {
      id: 9,
      title: 'Minimum Window Substring (LeetCode #76)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Даны строки s и t. Найдите минимальную подстроку s, содержащую все символы t (с учётом повторений). Если такой подстроки нет — верните пустую строку.\n\nПример:\nВход: s = "ADOBECODEBANC", t = "ABC"\nВыход: "BANC"',
      requirements: [
        'Метод minWindow(String s, String t) возвращает String',
        'Использовать скользящее окно с двумя указателями',
        'Время O(|s| + |t|), память O(|s| + |t|)',
        'Корректно обработать повторяющиеся символы в t'
      ],
      expectedOutput: 'Input: s="ADOBECODEBANC", t="ABC" → Output: "BANC"\nInput: s="a", t="a" → Output: "a"\nInput: s="a", t="aa" → Output: ""',
      hint: 'Два HashMap: need (частоты t) и window (частоты текущего окна). Расширяй right, пока не покроешь все символы t. Затем сужай left, обновляя минимальную длину.',
      solution: `import java.util.*;

public class MinimumWindowSubstring {
    public static String minWindow(String s, String t) {
        if (s.length() < t.length()) return "";

        // Частоты символов, необходимых из t
        Map<Character, Integer> need = new HashMap<>();
        for (char c : t.toCharArray()) {
            need.merge(c, 1, Integer::sum);
        }

        Map<Character, Integer> window = new HashMap<>();
        int have = 0;          // Сколько уникальных символов покрыто
        int required = need.size(); // Сколько уникальных символов нужно покрыть

        int minLen = Integer.MAX_VALUE;
        int minStart = 0;

        int left = 0;
        for (int right = 0; right < s.length(); right++) {
            // Расширяем окно вправо
            char c = s.charAt(right);
            window.merge(c, 1, Integer::sum);

            // Проверяем: покрыли ли мы очередной символ из need
            if (need.containsKey(c) && window.get(c).intValue() == need.get(c).intValue()) {
                have++;
            }

            // Сужаем окно слева
            while (have == required) {
                // Обновляем минимум
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    minStart = left;
                }

                // Убираем left-символ из окна
                char leftChar = s.charAt(left);
                window.merge(leftChar, -1, Integer::sum);
                if (need.containsKey(leftChar) &&
                    window.get(leftChar) < need.get(leftChar)) {
                    have--;
                }
                left++;
            }
        }

        return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);
    }

    public static void main(String[] args) {
        System.out.println(minWindow("ADOBECODEBANC", "ABC")); // "BANC"
        System.out.println(minWindow("a", "a"));                // "a"
        System.out.println(minWindow("a", "aa"));               // ""
    }
}`,
      explanation: 'Классическое скользящее окно: расширяем right, пока не покроем все символы t, затем сужаем left для минимизации. Счётчик have отслеживает, сколько уникальных символов из t полностью покрыты. Когда have == required — окно валидно. Время O(|s| + |t|): каждый символ добавляется и удаляется из окна максимум один раз.'
    },
    {
      id: 10,
      title: 'Edit Distance (LeetCode #72)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Даны две строки word1 и word2. Найдите минимальное количество операций для преобразования word1 в word2. Допустимые операции: вставка, удаление, замена символа.\n\nЭто расстояние Левенштейна.\n\nПример:\nВход: word1 = "horse", word2 = "ros"\nВыход: 3 (horse → rorse → rose → ros)',
      requirements: [
        'Метод minDistance(String word1, String word2) возвращает int',
        'Использовать динамическое программирование (2D таблица)',
        'dp[i][j] = минимальные операции для word1[0..i-1] → word2[0..j-1]',
        'Время O(m*n), память O(m*n) или O(min(m,n)) с оптимизацией'
      ],
      expectedOutput: 'Input: word1="horse", word2="ros" → Output: 3\nInput: word1="intention", word2="execution" → Output: 5\nInput: word1="", word2="abc" → Output: 3',
      hint: 'dp[i][j]: если word1[i-1] == word2[j-1], то dp[i][j] = dp[i-1][j-1]. Иначе dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) — удаление, вставка, замена.',
      solution: `public class EditDistance {
    public static int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();

        // dp[i][j] = мин. операций для word1[0..i-1] -> word2[0..j-1]
        int[][] dp = new int[m + 1][n + 1];

        // Базовые случаи: преобразование в пустую строку
        for (int i = 0; i <= m; i++) dp[i][0] = i; // Удаление i символов
        for (int j = 0; j <= n; j++) dp[0][j] = j; // Вставка j символов

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    // Символы совпадают — без операции
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    // Минимум из трёх операций + 1
                    dp[i][j] = 1 + Math.min(
                        dp[i - 1][j - 1], // Замена
                        Math.min(
                            dp[i - 1][j],  // Удаление из word1
                            dp[i][j - 1]   // Вставка в word1
                        )
                    );
                }
            }
        }

        return dp[m][n];
    }

    public static void main(String[] args) {
        System.out.println(minDistance("horse", "ros"));          // 3
        System.out.println(minDistance("intention", "execution")); // 5
        System.out.println(minDistance("", "abc"));                // 3
    }
}`,
      explanation: 'Классическое 2D DP. dp[i][j] — минимум операций для первых i символов word1 и первых j символов word2. Если символы совпадают — берём dp[i-1][j-1] (без операции). Иначе — min из трёх вариантов + 1: замена (dp[i-1][j-1]), удаление (dp[i-1][j]), вставка (dp[i][j-1]). Расстояние Левенштейна используется в спелл-чекерах, diff утилитах, биоинформатике. O(m*n) время и память.'
    }
  ]
}
