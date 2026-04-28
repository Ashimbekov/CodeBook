export default {
  id: 86,
  title: 'Практикум: Строковые алгоритмы',
  description: 'Практические задачи на строковые алгоритмы: анаграммы, палиндромы, подстроки, KMP, конвертация строк.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Anagram Check',
      type: 'practice',
      difficulty: 'easy',
      description: 'Определи, являются ли две строки анаграммами (содержат одинаковые буквы в одинаковом количестве).',
      requirements: [
        'Реализуй проверку через массив-счётчик из 26 элементов',
        'Для первой строки увеличивай, для второй уменьшай',
        'Если все счётчики == 0 — анаграмма',
        'Обработай случай разной длины строк'
      ],
      expectedOutput: '"anagram" и "nagaram": true\n"rat" и "car": false\n"listen" и "silent": true',
      hint: 'Используй int[26]. Для char c: index = c - `a`. Инкремент для первой строки, декремент для второй. Если все нули — анаграмма.',
      solution: `public class Main {
    static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) {
            if (c != 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println("\\"anagram\\" и \\"nagaram\\": " + isAnagram("anagram", "nagaram"));
        System.out.println("\\"rat\\" и \\"car\\": " + isAnagram("rat", "car"));
        System.out.println("\\"listen\\" и \\"silent\\": " + isAnagram("listen", "silent"));
    }
}`,
      explanation: 'Анаграмма — перестановка букв. Два подхода: 1) Отсортировать обе строки и сравнить O(n log n). 2) Массив-счётчик O(n). Второй эффективнее: считаем частоту каждой буквы в первой строке (+1) и второй (-1). Если все счётчики нулевые — буквы совпадают по количеству. Проверка длин — быстрый фильтр.'
    },
    {
      id: 2,
      title: 'Задача: Longest Substring Without Repeating Characters',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди длину самой длинной подстроки без повторяющихся символов.',
      requirements: [
        'Используй sliding window с двумя указателями',
        'HashMap или Set для отслеживания символов в текущем окне',
        'При нахождении дубликата двигай левый указатель',
        'Обновляй максимум на каждом шаге'
      ],
      expectedOutput: '"abcabcbb" → 3 ("abc")\n"bbbbb" → 1 ("b")\n"pwwkew" → 3 ("wke")',
      hint: 'HashMap<Character, Integer> хранит последнюю позицию каждого символа. При дубликате: left = max(left, map.get(c) + 1). Это позволяет перепрыгнуть через все дубликаты.',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {
    static int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int maxLen = 0;
        int left = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c)) {
                left = Math.max(left, map.get(c) + 1);
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println("\\"abcabcbb\\" → " + lengthOfLongestSubstring("abcabcbb") + " (\\"abc\\")");
        System.out.println("\\"bbbbb\\" → " + lengthOfLongestSubstring("bbbbb") + " (\\"b\\")");
        System.out.println("\\"pwwkew\\" → " + lengthOfLongestSubstring("pwwkew") + " (\\"wke\\")");
    }
}`,
      explanation: 'Sliding window с HashMap — оптимальный подход. Правый указатель расширяет окно. При обнаружении дубликата левый указатель перемещается за предыдущую позицию дубликата. Math.max(left, ...) нужен, потому что предыдущая позиция может быть до текущего left (уже вне окна). Сложность O(n) — каждый символ обрабатывается один раз.'
    },
    {
      id: 3,
      title: 'Задача: Group Anagrams',
      type: 'practice',
      difficulty: 'medium',
      description: 'Группируй массив строк по анаграммам. Все анаграммы должны быть в одной группе.',
      requirements: [
        'Используй HashMap<String, List<String>>',
        'Ключ — отсортированная версия строки (анаграммы дают одинаковый ключ)',
        'Альтернатива: ключ — массив частот букв, преобразованный в строку',
        'Верни список групп'
      ],
      expectedOutput: 'Вход: ["eat","tea","tan","ate","nat","bat"]\nГруппы:\n["eat","tea","ate"]\n["tan","nat"]\n["bat"]',
      hint: 'sorted("eat") = "aet", sorted("tea") = "aet" → одна группа. HashMap.computeIfAbsent(key, k -> new ArrayList<>()).add(str);',
      solution: `import java.util.*;

public class Main {
    static List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }

    public static void main(String[] args) {
        String[] input = {"eat", "tea", "tan", "ate", "nat", "bat"};
        System.out.println("Вход: " + Arrays.toString(input));
        System.out.println("Группы:");
        for (List<String> group : groupAnagrams(input)) {
            System.out.println(group);
        }
    }
}`,
      explanation: 'Ключевая идея: все анаграммы после сортировки дают одинаковую строку. "eat", "tea", "ate" → все сортируются в "aet". Используем эту отсортированную строку как ключ HashMap. computeIfAbsent создаёт новый список если ключа нет. Сложность O(n * k log k), где k — максимальная длина строки.'
    },
    {
      id: 4,
      title: 'Задача: Longest Palindromic Substring',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди самую длинную подстроку-палиндром в данной строке.',
      requirements: [
        'Используй метод "расширения из центра"',
        'Для каждой позиции проверяй нечётные палиндромы (центр — один символ)',
        'И чётные палиндромы (центр — между двумя символами)',
        'Отслеживай начало и длину самого длинного палиндрома'
      ],
      expectedOutput: '"babad" → "bab" (или "aba")\n"cbbd" → "bb"\n"racecar" → "racecar"',
      hint: 'expandFromCenter(s, left, right): пока s[left]==s[right] — расширяй. Для каждого i: проверяй expand(i, i) для нечётных и expand(i, i+1) для чётных палиндромов.',
      solution: `public class Main {
    static int start = 0, maxLen = 0;

    static void expandFromCenter(String s, int left, int right) {
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            if (right - left + 1 > maxLen) {
                start = left;
                maxLen = right - left + 1;
            }
            left--;
            right++;
        }
    }

    static String longestPalindrome(String s) {
        if (s.length() < 2) return s;
        start = 0;
        maxLen = 1;

        for (int i = 0; i < s.length(); i++) {
            expandFromCenter(s, i, i);     // нечётный палиндром
            expandFromCenter(s, i, i + 1); // чётный палиндром
        }
        return s.substring(start, start + maxLen);
    }

    public static void main(String[] args) {
        System.out.println("\\"babad\\" → \\"" + longestPalindrome("babad") + "\\"");
        System.out.println("\\"cbbd\\" → \\"" + longestPalindrome("cbbd") + "\\"");
        System.out.println("\\"racecar\\" → \\"" + longestPalindrome("racecar") + "\\"");
    }
}`,
      explanation: 'Метод "расширения из центра" — интуитивный и эффективный подход. Для каждой позиции пробуем расширить палиндром в обе стороны. Проверяем два случая: нечётный палиндром (центр — один символ, как "aba") и чётный (центр — между символами, как "abba"). Сложность O(n^2) — лучше чем DP O(n^2) по памяти. Существует O(n) алгоритм Манакера.'
    },
    {
      id: 5,
      title: 'Задача: String to Integer (atoi)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй функцию myAtoi — преобразование строки в целое число. Обработай пробелы, знак, переполнение.',
      requirements: [
        'Пропусти ведущие пробелы',
        'Определи знак: + или - (по умолчанию +)',
        'Читай цифры, пока они есть',
        'Обработай переполнение: верни Integer.MAX_VALUE или MIN_VALUE'
      ],
      expectedOutput: '"42" → 42\n"   -42" → -42\n"4193 with words" → 4193\n"words and 987" → 0\n"91283472332" → 2147483647 (overflow)',
      hint: 'Используй long для промежуточного результата или проверяй переполнение до умножения: if (result > (MAX - digit) / 10) — overflow.',
      solution: `public class Main {
    static int myAtoi(String s) {
        int i = 0, n = s.length();
        // Пропустить пробелы
        while (i < n && s.charAt(i) == ' ') i++;
        if (i == n) return 0;

        // Определить знак
        int sign = 1;
        if (s.charAt(i) == '-' || s.charAt(i) == '+') {
            sign = s.charAt(i) == '-' ? -1 : 1;
            i++;
        }

        // Читать цифры
        long result = 0;
        while (i < n && Character.isDigit(s.charAt(i))) {
            result = result * 10 + (s.charAt(i) - '0');
            if (result * sign > Integer.MAX_VALUE) return Integer.MAX_VALUE;
            if (result * sign < Integer.MIN_VALUE) return Integer.MIN_VALUE;
            i++;
        }
        return (int) (result * sign);
    }

    public static void main(String[] args) {
        System.out.println("\\"42\\" → " + myAtoi("42"));
        System.out.println("\\"   -42\\" → " + myAtoi("   -42"));
        System.out.println("\\"4193 with words\\" → " + myAtoi("4193 with words"));
        System.out.println("\\"words and 987\\" → " + myAtoi("words and 987"));
        System.out.println("\\"91283472332\\" → " + myAtoi("91283472332") + " (overflow)");
    }
}`,
      explanation: 'myAtoi имитирует стандартную функцию C atoi(). Алгоритм: 1) Пропустить пробелы. 2) Определить знак. 3) Читать цифры, накапливая результат. 4) Обработать переполнение. Использование long для промежуточного результата упрощает проверку переполнения. Нецифровые символы прекращают чтение. Строка без цифр даёт 0.'
    },
    {
      id: 6,
      title: 'Задача: Implement strStr (KMP)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Найди первое вхождение паттерна в строку. Реализуй алгоритм KMP (Кнута-Морриса-Пратта) для эффективного поиска.',
      requirements: [
        'Построй prefix function (failure function) для паттерна',
        'prefix[i] = длина наибольшего собственного префикса, совпадающего с суффиксом',
        'Используй prefix function для "прыжков" при несовпадении',
        'Верни индекс первого вхождения или -1'
      ],
      expectedOutput: 'text="ababcababababcabab", pattern="ababcabab"\nПервое вхождение: 8\n\ntext="hello", pattern="ll"\nПервое вхождение: 2',
      hint: 'Prefix function: для каждого i ищи наибольший k < i, где pattern[0..k-1] == pattern[i-k..i-1]. При несовпадении: прыгай на prefix[j-1] вместо начала.',
      solution: `public class Main {
    static int[] buildPrefixFunction(String pattern) {
        int n = pattern.length();
        int[] prefix = new int[n];
        int len = 0;
        int i = 1;

        while (i < n) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                len++;
                prefix[i] = len;
                i++;
            } else {
                if (len != 0) {
                    len = prefix[len - 1];
                } else {
                    prefix[i] = 0;
                    i++;
                }
            }
        }
        return prefix;
    }

    static int kmpSearch(String text, String pattern) {
        if (pattern.isEmpty()) return 0;
        int[] prefix = buildPrefixFunction(pattern);
        int i = 0, j = 0;

        while (i < text.length()) {
            if (text.charAt(i) == pattern.charAt(j)) {
                i++;
                j++;
                if (j == pattern.length()) {
                    return i - j;
                }
            } else {
                if (j != 0) {
                    j = prefix[j - 1];
                } else {
                    i++;
                }
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        System.out.println("text=\\"ababcababababcabab\\", pattern=\\"ababcabab\\"");
        System.out.println("Первое вхождение: " + kmpSearch("ababcababababcabab", "ababcabab"));

        System.out.println();
        System.out.println("text=\\"hello\\", pattern=\\"ll\\"");
        System.out.println("Первое вхождение: " + kmpSearch("hello", "ll"));
    }
}`,
      explanation: 'KMP — классический алгоритм поиска подстроки за O(n+m). Prefix function для паттерна определяет, куда "прыгать" при несовпадении, используя уже совпавший префикс. Наивный поиск при несовпадении возвращается к началу паттерна, KMP же прыгает на позицию prefix[j-1], экономя сравнения. Это гарантирует линейную сложность.'
    },
    {
      id: 7,
      title: 'Задача: Zigzag Conversion',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка и количество строк numRows. Запиши строку зигзагом и считай результат построчно.',
      requirements: [
        'Создай numRows StringBuilder-ов для каждой строки',
        'Двигайся вниз (row++), затем вверх (row--), заполняя символы',
        'Смени направление при достижении верхней или нижней строки',
        'Объедини все строки в результат'
      ],
      expectedOutput: '"PAYPALISHIRING", numRows=3:\nP   A   H   N\nA P L S I I G\nY   I   R\nРезультат: "PAHNAPLSIIGYIR"',
      hint: 'Используй переменную direction (1 = вниз, -1 = вверх). Меняй направление когда row == 0 или row == numRows-1.',
      solution: `public class Main {
    static String convert(String s, int numRows) {
        if (numRows == 1 || s.length() <= numRows) return s;

        StringBuilder[] rows = new StringBuilder[numRows];
        for (int i = 0; i < numRows; i++) rows[i] = new StringBuilder();

        int row = 0;
        int direction = 1;

        for (char c : s.toCharArray()) {
            rows[row].append(c);
            if (row == 0) direction = 1;
            else if (row == numRows - 1) direction = -1;
            row += direction;
        }

        StringBuilder result = new StringBuilder();
        for (StringBuilder sb : rows) result.append(sb);
        return result.toString();
    }

    public static void main(String[] args) {
        String s = "PAYPALISHIRING";
        System.out.println("\\"" + s + "\\", numRows=3:");
        System.out.println("P   A   H   N");
        System.out.println("A P L S I I G");
        System.out.println("Y   I   R");
        System.out.println("Результат: \\"" + convert(s, 3) + "\\"");
    }
}`,
      explanation: 'Зигзаг заполняется движением вниз-вверх по строкам. Вместо построения 2D-матрицы, создаём массив StringBuilder — по одному на строку. Проходим по символам, добавляя каждый в текущую строку. При достижении верха или низа меняем направление. В конце объединяем все строки. Сложность O(n).'
    },
    {
      id: 8,
      title: 'Задача: Count and Say',
      type: 'practice',
      difficulty: 'easy',
      description: 'Последовательность "Count and Say": 1 → "1", 2 → "11" (одна 1), 3 → "21" (две 1), 4 → "1211" (одна 2, одна 1). Найди n-й элемент.',
      requirements: [
        'Начни с "1"',
        'На каждом шаге "прочитай" предыдущую строку',
        'Считай подряд идущие одинаковые символы',
        'Формируй новую строку: count + digit'
      ],
      expectedOutput: 'n=1: "1"\nn=2: "11"\nn=3: "21"\nn=4: "1211"\nn=5: "111221"',
      hint: 'Для каждой строки: проходи по символам, считая группы одинаковых. Для группы из count символов char записывай: count + char.',
      solution: `public class Main {
    static String countAndSay(int n) {
        String result = "1";
        for (int i = 2; i <= n; i++) {
            StringBuilder sb = new StringBuilder();
            int count = 1;
            for (int j = 1; j < result.length(); j++) {
                if (result.charAt(j) == result.charAt(j - 1)) {
                    count++;
                } else {
                    sb.append(count).append(result.charAt(j - 1));
                    count = 1;
                }
            }
            sb.append(count).append(result.charAt(result.length() - 1));
            result = sb.toString();
        }
        return result;
    }

    public static void main(String[] args) {
        for (int n = 1; n <= 5; n++) {
            System.out.println("n=" + n + ": \\"" + countAndSay(n) + "\\"");
        }
    }
}`,
      explanation: 'Count and Say — итеративный процесс "описания" предыдущей строки. "21" читается как "одна двойка, одна единица" → "1211". Алгоритм: проходим по строке, считая группы одинаковых символов. Каждая группа описывается как "количество + символ". Строка быстро растёт, но для разумных n работает быстро.'
    },
    {
      id: 9,
      title: 'Задача: Multiply Strings',
      type: 'practice',
      difficulty: 'medium',
      description: 'Умножь два числа, представленные как строки. Результат тоже верни как строку. Не используй BigInteger.',
      requirements: [
        'Имитируй умножение "в столбик"',
        'Результат num1[i] * num2[j] попадает в позицию [i+j, i+j+1]',
        'Используй массив int[] для промежуточного результата',
        'Удали ведущие нули'
      ],
      expectedOutput: '"123" * "456" = "56088"\n"99" * "99" = "9801"\n"0" * "12345" = "0"',
      hint: 'Массив result длины m+n. Для каждого i, j: product = digit1 * digit2 + result[i+j+1]. result[i+j+1] = product % 10, result[i+j] += product / 10.',
      solution: `public class Main {
    static String multiply(String num1, String num2) {
        int m = num1.length(), n = num2.length();
        int[] result = new int[m + n];

        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 0; j--) {
                int mul = (num1.charAt(i) - '0') * (num2.charAt(j) - '0');
                int p1 = i + j, p2 = i + j + 1;
                int sum = mul + result[p2];
                result[p2] = sum % 10;
                result[p1] += sum / 10;
            }
        }

        StringBuilder sb = new StringBuilder();
        for (int d : result) {
            if (sb.length() > 0 || d > 0) sb.append(d);
        }
        return sb.length() == 0 ? "0" : sb.toString();
    }

    public static void main(String[] args) {
        System.out.println("\\"123\\" * \\"456\\" = \\"" + multiply("123", "456") + "\\"");
        System.out.println("\\"99\\" * \\"99\\" = \\"" + multiply("99", "99") + "\\"");
        System.out.println("\\"0\\" * \\"12345\\" = \\"" + multiply("0", "12345") + "\\"");
    }
}`,
      explanation: 'Имитация умножения в столбик. Ключевое наблюдение: цифра num1[i] * num2[j] влияет на позиции [i+j] и [i+j+1] результата. Массив result хранит цифры. После умножения обрабатываем переносы. Удаляем ведущие нули. Сложность O(m*n). Это единственный способ умножить числа, которые не помещаются в long.'
    },
    {
      id: 10,
      title: 'Задача: Minimum Window Substring',
      type: 'practice',
      difficulty: 'hard',
      description: 'Найди минимальную подстроку s, содержащую все символы строки t (включая дубликаты).',
      requirements: [
        'Используй sliding window с двумя указателями',
        'HashMap для подсчёта нужных и имеющихся символов',
        'Расширяй окно вправо, пока не собраны все символы',
        'Сужай окно слева, обновляя минимум'
      ],
      expectedOutput: 's="ADOBECODEBANC", t="ABC"\nМинимальное окно: "BANC"\n\ns="a", t="a"\nМинимальное окно: "a"',
      hint: 'Два HashMap: need (что нужно) и window (что имеем). Переменная matched считает совпавшие символы. Когда matched == need.size(): сужай окно слева.',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {
    static String minWindow(String s, String t) {
        Map<Character, Integer> need = new HashMap<>();
        Map<Character, Integer> window = new HashMap<>();
        for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);

        int left = 0, matched = 0;
        int minLen = Integer.MAX_VALUE, minStart = 0;

        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            window.merge(c, 1, Integer::sum);
            if (need.containsKey(c) && window.get(c).equals(need.get(c))) {
                matched++;
            }

            while (matched == need.size()) {
                if (right - left + 1 < minLen) {
                    minLen = right - left + 1;
                    minStart = left;
                }
                char d = s.charAt(left);
                if (need.containsKey(d) && window.get(d).equals(need.get(d))) {
                    matched--;
                }
                window.merge(d, -1, Integer::sum);
                left++;
            }
        }
        return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);
    }

    public static void main(String[] args) {
        System.out.println("s=\\"ADOBECODEBANC\\", t=\\"ABC\\"");
        System.out.println("Минимальное окно: \\"" + minWindow("ADOBECODEBANC", "ABC") + "\\"");

        System.out.println();
        System.out.println("s=\\"a\\", t=\\"a\\"");
        System.out.println("Минимальное окно: \\"" + minWindow("a", "a") + "\\"");
    }
}`,
      explanation: 'Minimum Window Substring — классическая задача на sliding window. Два HashMap: need хранит требуемые символы, window — текущие. matched считает, сколько символов полностью покрыто. Расширяем окно вправо, пока не покроем все символы. Затем сужаем слева, ища минимальное окно. Сложность O(n) — каждый символ добавляется и удаляется максимум один раз.'
    }
  ]
}
