export default {
  id: 37,
  title: 'Практикум: HashMap паттерны',
  description: 'Десять классических задач LeetCode на хеш-таблицы. Паттерны: частотный анализ, группировка, маппинг, префиксные суммы и кеширование.',
  lessons: [
    {
      id: 1,
      title: 'Two Sum (LeetCode #1)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан массив целых чисел nums и целое число target. Верните индексы двух чисел, сумма которых равна target. Каждый вход имеет ровно одно решение, нельзя использовать один элемент дважды.',
      requirements: [
        'Реализуйте метод int[] twoSum(int[] nums, int target)',
        'Верните массив из двух индексов',
        'Гарантируется ровно одно решение',
        'Нельзя использовать один элемент дважды',
        'Решение за O(n) с помощью HashMap'
      ],
      expectedOutput: 'twoSum([2,7,11,15], 9) -> [0,1]\ntwoSum([3,2,4], 6) -> [1,2]\ntwoSum([3,3], 6) -> [0,1]',
      hint: 'Используйте HashMap: ключ — число, значение — индекс. Для каждого числа проверяйте, есть ли в map дополнение (target - num).',
      solution: `import java.util.*;

public class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        // Ключ: число, Значение: его индекс
        Map<Integer, Integer> map = new HashMap<>();

        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            // Если дополнение уже есть в map — нашли пару
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{}; // не достигается при корректном входе
    }

    public static void main(String[] args) {
        TwoSum sol = new TwoSum();
        System.out.println(Arrays.toString(sol.twoSum(new int[]{2,7,11,15}, 9))); // [0,1]
        System.out.println(Arrays.toString(sol.twoSum(new int[]{3,2,4}, 6)));     // [1,2]
        System.out.println(Arrays.toString(sol.twoSum(new int[]{3,3}, 6)));       // [0,1]
    }
}`,
      explanation: 'Классическая задача #1 на LeetCode. Вместо brute-force O(n^2) используем HashMap для поиска дополнения за O(1). Один проход: для каждого числа проверяем, есть ли (target - num) в map, если нет — добавляем текущее число. Время O(n), память O(n).'
    },
    {
      id: 2,
      title: 'Valid Anagram (LeetCode #242)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Даны две строки s и t. Верните true, если t является анаграммой s, иначе false. Анаграмма — перестановка букв.',
      requirements: [
        'Реализуйте метод boolean isAnagram(String s, String t)',
        'Строки содержат только строчные латинские буквы',
        'Анаграмма — строка с теми же буквами в другом порядке',
        'Решение за O(n) с помощью частотного массива или HashMap'
      ],
      expectedOutput: 'isAnagram("anagram", "nagaram") -> true\nisAnagram("rat", "car") -> false\nisAnagram("listen", "silent") -> true',
      hint: 'Подсчитайте частоту каждой буквы в обеих строках и сравните. Можно использовать массив int[26] вместо HashMap для эффективности.',
      solution: `public class ValidAnagram {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;

        // Частотный массив для 26 букв
        int[] freq = new int[26];

        for (int i = 0; i < s.length(); i++) {
            freq[s.charAt(i) - 'a']++;  // +1 для символа из s
            freq[t.charAt(i) - 'a']--;  // -1 для символа из t
        }

        // Если все нули — анаграмма
        for (int f : freq) {
            if (f != 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        ValidAnagram sol = new ValidAnagram();
        System.out.println(sol.isAnagram("anagram", "nagaram")); // true
        System.out.println(sol.isAnagram("rat", "car"));         // false
        System.out.println(sol.isAnagram("listen", "silent"));   // true
    }
}`,
      explanation: 'Используем частотный массив из 26 элементов (по одному на букву). Увеличиваем счётчик для s и уменьшаем для t. Если все нули — строки являются анаграммами. Один проход, O(n) времени, O(1) памяти (массив фиксированного размера).'
    },
    {
      id: 3,
      title: 'Group Anagrams (LeetCode #49)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив строк. Сгруппируйте анаграммы вместе. Порядок групп не важен.',
      requirements: [
        'Реализуйте метод List<List<String>> groupAnagrams(String[] strs)',
        'Все строки содержат строчные латинские буквы',
        'Анаграммы должны быть в одной группе',
        'Порядок групп и элементов внутри группы не важен',
        'Решение с помощью HashMap, где ключ — отсортированная строка'
      ],
      expectedOutput: 'groupAnagrams(["eat","tea","tan","ate","nat","bat"])\n-> [["bat"],["nat","tan"],["ate","eat","tea"]]',
      hint: 'Ключ группировки — отсортированная строка. Все анаграммы при сортировке дают одинаковый результат. Используйте HashMap<String, List<String>>.',
      solution: `import java.util.*;

public class GroupAnagrams {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();

        for (String s : strs) {
            // Ключ — отсортированная строка
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);

            // Добавляем в группу
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }

        return new ArrayList<>(map.values());
    }

    public static void main(String[] args) {
        GroupAnagrams sol = new GroupAnagrams();
        List<List<String>> result = sol.groupAnagrams(
            new String[]{"eat","tea","tan","ate","nat","bat"}
        );
        for (List<String> group : result) {
            System.out.println(group);
        }
        // [bat]
        // [tan, nat]
        // [eat, tea, ate]
    }
}`,
      explanation: 'Ключевая идея: все анаграммы при сортировке символов дают одну и ту же строку. Например, "eat", "tea", "ate" -> "aet". Используем эту отсортированную строку как ключ в HashMap. Время O(n * k*log(k)), где k — максимальная длина строки.'
    },
    {
      id: 4,
      title: 'Top K Frequent Elements (LeetCode #347)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан целочисленный массив nums и число k. Верните k наиболее частых элементов. Ответ может быть в любом порядке.',
      requirements: [
        'Реализуйте метод int[] topKFrequent(int[] nums, int k)',
        'Гарантируется уникальный ответ',
        'Порядок элементов в ответе не важен',
        'Решение лучше O(n log n) — используйте bucket sort'
      ],
      expectedOutput: 'topKFrequent([1,1,1,2,2,3], 2) -> [1,2]\ntopKFrequent([1], 1) -> [1]\ntopKFrequent([4,1,-1,2,-1,2,3], 2) -> [-1,2]',
      hint: 'Bucket sort по частоте: создайте массив списков размером n+1, где индекс = частота. Заполните частоты через HashMap, затем пройдите bucket-ы справа (от наибольшей частоты) и соберите k элементов.',
      solution: `import java.util.*;

public class TopKFrequent {
    public int[] topKFrequent(int[] nums, int k) {
        // Шаг 1: подсчёт частот
        Map<Integer, Integer> freq = new HashMap<>();
        for (int num : nums) {
            freq.merge(num, 1, Integer::sum);
        }

        // Шаг 2: bucket sort — индекс = частота
        @SuppressWarnings("unchecked")
        List<Integer>[] buckets = new List[nums.length + 1];
        for (int i = 0; i < buckets.length; i++) {
            buckets[i] = new ArrayList<>();
        }
        for (Map.Entry<Integer, Integer> entry : freq.entrySet()) {
            buckets[entry.getValue()].add(entry.getKey());
        }

        // Шаг 3: собираем k элементов с наибольшей частотой
        int[] result = new int[k];
        int idx = 0;
        for (int i = buckets.length - 1; i >= 0 && idx < k; i--) {
            for (int num : buckets[i]) {
                result[idx++] = num;
                if (idx == k) break;
            }
        }
        return result;
    }

    public static void main(String[] args) {
        TopKFrequent sol = new TopKFrequent();
        System.out.println(Arrays.toString(sol.topKFrequent(new int[]{1,1,1,2,2,3}, 2))); // [1,2]
        System.out.println(Arrays.toString(sol.topKFrequent(new int[]{1}, 1))); // [1]
    }
}`,
      explanation: 'Три шага: 1) HashMap для подсчёта частот — O(n). 2) Bucket sort: создаём массив списков, где индекс = частота. 3) Собираем элементы от наибольшей частоты. Общее время O(n), что лучше O(n log n) при использовании сортировки или O(n log k) с кучей.'
    },
    {
      id: 5,
      title: 'Longest Consecutive Sequence (LeetCode #128)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан несортированный массив целых чисел nums. Найдите длину самой длинной последовательности последовательных чисел (например, 1,2,3,4). Алгоритм должен работать за O(n).',
      requirements: [
        'Реализуйте метод int longestConsecutive(int[] nums)',
        'Последовательность: числа идут подряд (100,200 — не последовательность, 1,2,3 — да)',
        'Массив может содержать дубликаты',
        'Решение за O(n) — нельзя сортировать',
        'Используйте HashSet'
      ],
      expectedOutput: 'longestConsecutive([100,4,200,1,3,2]) -> 4  // [1,2,3,4]\nlongestConsecutive([0,3,7,2,5,8,4,6,0,1]) -> 9  // [0..8]',
      hint: 'Положите все числа в HashSet. Для каждого числа проверьте, есть ли num-1 в Set. Если нет — это начало последовательности. Считайте длину, двигаясь вправо.',
      solution: `import java.util.*;

public class LongestConsecutive {
    public int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int num : nums) set.add(num);

        int longest = 0;

        for (int num : set) {
            // Начинаем только с начала последовательности
            if (!set.contains(num - 1)) {
                int currentNum = num;
                int length = 1;

                // Двигаемся вправо
                while (set.contains(currentNum + 1)) {
                    currentNum++;
                    length++;
                }
                longest = Math.max(longest, length);
            }
        }
        return longest;
    }

    public static void main(String[] args) {
        LongestConsecutive sol = new LongestConsecutive();
        System.out.println(sol.longestConsecutive(new int[]{100,4,200,1,3,2}));     // 4
        System.out.println(sol.longestConsecutive(new int[]{0,3,7,2,5,8,4,6,0,1})); // 9
    }
}`,
      explanation: 'Ключевой трюк: начинаем считать длину только если num-1 нет в Set (т.е. num — начало последовательности). Это гарантирует, что каждый элемент обрабатывается ровно один раз. HashSet для O(1) проверки наличия. Общее время O(n).'
    },
    {
      id: 6,
      title: 'Subarray Sum Equals K (LeetCode #560)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив целых чисел nums и число k. Верните количество подмассивов с суммой, равной k.',
      requirements: [
        'Реализуйте метод int subarraySum(int[] nums, int k)',
        'Подмассив — непрерывная часть массива',
        'Числа могут быть отрицательными',
        'Решение за O(n) с помощью префиксных сумм и HashMap'
      ],
      expectedOutput: 'subarraySum([1,1,1], 2) -> 2\nsubarraySum([1,2,3], 3) -> 2\nsubarraySum([1,-1,0], 0) -> 3',
      hint: 'Используйте префиксную сумму и HashMap. Если prefixSum[j] - prefixSum[i] == k, значит сумма подмассива [i+1..j] == k. Храните частоту каждой префиксной суммы.',
      solution: `import java.util.*;

public class SubarraySum {
    public int subarraySum(int[] nums, int k) {
        // Ключ: префиксная сумма, Значение: сколько раз встречалась
        Map<Integer, Integer> prefixCount = new HashMap<>();
        prefixCount.put(0, 1); // пустой префикс с суммой 0

        int sum = 0;
        int count = 0;

        for (int num : nums) {
            sum += num;
            // Если (sum - k) встречался ранее — нашли подмассив с суммой k
            if (prefixCount.containsKey(sum - k)) {
                count += prefixCount.get(sum - k);
            }
            prefixCount.merge(sum, 1, Integer::sum);
        }
        return count;
    }

    public static void main(String[] args) {
        SubarraySum sol = new SubarraySum();
        System.out.println(sol.subarraySum(new int[]{1,1,1}, 2));   // 2
        System.out.println(sol.subarraySum(new int[]{1,2,3}, 3));   // 2
        System.out.println(sol.subarraySum(new int[]{1,-1,0}, 0));  // 3
    }
}`,
      explanation: 'Паттерн "префиксная сумма + HashMap". Сумма подмассива [i+1..j] = prefix[j] - prefix[i]. Если prefix[j] - k встречалось — значит существует подмассив с суммой k. Храним частоту каждой префиксной суммы. Инициализация: map.put(0, 1) — пустой подмассив. Время O(n), память O(n).'
    },
    {
      id: 7,
      title: 'Isomorphic Strings (LeetCode #205)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Даны две строки s и t. Определите, являются ли они изоморфными. Строки изоморфны, если символы в s можно заменить для получения t с сохранением порядка (одинаковые символы → одинаковые, разные → разные).',
      requirements: [
        'Реализуйте метод boolean isIsomorphic(String s, String t)',
        'Один символ может отображаться только в один символ',
        'Два разных символа не могут отображаться в один',
        'Символ может отображаться сам в себя',
        'Строки одинаковой длины'
      ],
      expectedOutput: 'isIsomorphic("egg", "add") -> true  // e->a, g->d\nisIsomorphic("foo", "bar") -> false  // o->a и o->r — конфликт\nisIsomorphic("paper", "title") -> true',
      hint: 'Используйте два HashMap: s->t и t->s. Для каждой пары символов проверяйте, что маппинг не конфликтует в обоих направлениях.',
      solution: `import java.util.*;

public class IsomorphicStrings {
    public boolean isIsomorphic(String s, String t) {
        if (s.length() != t.length()) return false;

        Map<Character, Character> mapST = new HashMap<>(); // s -> t
        Map<Character, Character> mapTS = new HashMap<>(); // t -> s

        for (int i = 0; i < s.length(); i++) {
            char cs = s.charAt(i);
            char ct = t.charAt(i);

            // Проверяем маппинг s -> t
            if (mapST.containsKey(cs) && mapST.get(cs) != ct) return false;
            // Проверяем маппинг t -> s
            if (mapTS.containsKey(ct) && mapTS.get(ct) != cs) return false;

            mapST.put(cs, ct);
            mapTS.put(ct, cs);
        }
        return true;
    }

    public static void main(String[] args) {
        IsomorphicStrings sol = new IsomorphicStrings();
        System.out.println(sol.isIsomorphic("egg", "add"));     // true
        System.out.println(sol.isIsomorphic("foo", "bar"));     // false
        System.out.println(sol.isIsomorphic("paper", "title")); // true
    }
}`,
      explanation: 'Два маппинга: s->t и t->s. Один маппинг недостаточен: "ab"->"aa" — без обратной проверки a->a, b->a прошло бы, хотя разные символы отображаются в один. Двойной маппинг гарантирует биекцию. Время O(n), память O(размер алфавита).'
    },
    {
      id: 8,
      title: 'Word Pattern (LeetCode #290)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дана строка pattern и строка s. Определите, следует ли s шаблону pattern. Каждая буква pattern соответствует ровно одному слову из s.',
      requirements: [
        'Реализуйте метод boolean wordPattern(String pattern, String s)',
        'pattern содержит только строчные буквы',
        's содержит слова, разделённые пробелом',
        'Одна буква — ровно одно слово (биекция)',
        'Количество букв в pattern = количество слов в s'
      ],
      expectedOutput: 'wordPattern("abba", "dog cat cat dog") -> true\nwordPattern("abba", "dog cat cat fish") -> false\nwordPattern("aaaa", "dog cat cat dog") -> false\nwordPattern("abba", "dog dog dog dog") -> false',
      hint: 'Аналогично Isomorphic Strings: два HashMap для биективного маппинга между буквами pattern и словами s.',
      solution: `import java.util.*;

public class WordPattern {
    public boolean wordPattern(String pattern, String s) {
        String[] words = s.split(" ");
        if (pattern.length() != words.length) return false;

        Map<Character, String> charToWord = new HashMap<>();
        Map<String, Character> wordToChar = new HashMap<>();

        for (int i = 0; i < pattern.length(); i++) {
            char c = pattern.charAt(i);
            String w = words[i];

            // Проверяем маппинг char -> word
            if (charToWord.containsKey(c) && !charToWord.get(c).equals(w)) {
                return false;
            }
            // Проверяем маппинг word -> char
            if (wordToChar.containsKey(w) && wordToChar.get(w) != c) {
                return false;
            }

            charToWord.put(c, w);
            wordToChar.put(w, c);
        }
        return true;
    }

    public static void main(String[] args) {
        WordPattern sol = new WordPattern();
        System.out.println(sol.wordPattern("abba", "dog cat cat dog"));  // true
        System.out.println(sol.wordPattern("abba", "dog cat cat fish")); // false
        System.out.println(sol.wordPattern("aaaa", "dog cat cat dog"));  // false
        System.out.println(sol.wordPattern("abba", "dog dog dog dog"));  // false
    }
}`,
      explanation: 'Тот же паттерн биективного маппинга, что в Isomorphic Strings. Два HashMap: charToWord и wordToChar. При каждой паре (буква, слово) проверяем, что маппинг не конфликтует в обоих направлениях. Время O(n * L), где L — средняя длина слова.'
    },
    {
      id: 9,
      title: 'LRU Cache (LeetCode #146)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте структуру данных LRU (Least Recently Used) Cache. Поддержите get(key) и put(key, value) за O(1). При превышении ёмкости удаляется наименее недавно использованный элемент.',
      requirements: [
        'Реализуйте класс LRUCache(int capacity) с методами get(key) и put(key, value)',
        'get(key) возвращает значение или -1, если ключа нет',
        'put(key, value) обновляет или добавляет пару',
        'При превышении capacity удаляется LRU-элемент',
        'Обе операции за O(1)'
      ],
      expectedOutput: 'LRUCache cache = new LRUCache(2);\ncache.put(1,1); cache.put(2,2);\ncache.get(1) -> 1\ncache.put(3,3);  // удаляет ключ 2\ncache.get(2) -> -1\ncache.put(4,4);  // удаляет ключ 1\ncache.get(1) -> -1\ncache.get(3) -> 3\ncache.get(4) -> 4',
      hint: 'Используйте LinkedHashMap с accessOrder=true или реализуйте свой двусвязный список + HashMap. При get/put перемещайте элемент в конец (most recently used).',
      solution: `import java.util.LinkedHashMap;
import java.util.Map;

public class LRUCache extends LinkedHashMap<Integer, Integer> {
    private final int capacity;

    public LRUCache(int capacity) {
        // accessOrder=true — при get элемент перемещается в конец
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    public int get(int key) {
        return super.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        super.put(key, value);
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        // Удаляем старейший элемент, если превышена ёмкость
        return size() > capacity;
    }

    public static void main(String[] args) {
        LRUCache cache = new LRUCache(2);
        cache.put(1, 1);
        cache.put(2, 2);
        System.out.println(cache.get(1));  // 1
        cache.put(3, 3);                   // удаляет ключ 2
        System.out.println(cache.get(2));  // -1
        cache.put(4, 4);                   // удаляет ключ 1
        System.out.println(cache.get(1));  // -1
        System.out.println(cache.get(3));  // 3
        System.out.println(cache.get(4));  // 4
    }
}`,
      explanation: 'LinkedHashMap с accessOrder=true — идеальная структура для LRU Cache в Java. При get/put элемент автоматически перемещается в конец. removeEldestEntry вызывается после каждого put и удаляет старейший элемент при превышении ёмкости. Альтернатива — свой двусвязный список + HashMap. Обе операции O(1).'
    },
    {
      id: 10,
      title: 'Design HashMap (LeetCode #706)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте хеш-таблицу без использования встроенных библиотек. Поддержите put(key, value), get(key) и remove(key).',
      requirements: [
        'Реализуйте класс MyHashMap с методами put, get, remove',
        'put(key, value) — добавить или обновить пару',
        'get(key) — вернуть значение или -1',
        'remove(key) — удалить ключ',
        'Ключи и значения: 0 <= key, value <= 10^6',
        'Используйте метод цепочек (chaining) для разрешения коллизий'
      ],
      expectedOutput: 'MyHashMap map = new MyHashMap();\nmap.put(1, 1); map.put(2, 2);\nmap.get(1) -> 1\nmap.get(3) -> -1\nmap.put(2, 1);\nmap.get(2) -> 1\nmap.remove(2);\nmap.get(2) -> -1',
      hint: 'Создайте массив связных списков (chaining). Хеш-функция: key % size. При коллизии добавляйте в список. Начните с размера 1000+ для уменьшения коллизий.',
      solution: `public class MyHashMap {
    // Узел связного списка для chaining
    private static class Node {
        int key, value;
        Node next;
        Node(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }

    private static final int SIZE = 1009; // простое число
    private Node[] buckets;

    public MyHashMap() {
        buckets = new Node[SIZE];
    }

    private int hash(int key) {
        return key % SIZE;
    }

    public void put(int key, int value) {
        int idx = hash(key);
        if (buckets[idx] == null) {
            buckets[idx] = new Node(-1, -1); // sentinel node
        }
        Node prev = findPrev(buckets[idx], key);
        if (prev.next == null) {
            prev.next = new Node(key, value);
        } else {
            prev.next.value = value; // обновляем
        }
    }

    public int get(int key) {
        int idx = hash(key);
        if (buckets[idx] == null) return -1;
        Node prev = findPrev(buckets[idx], key);
        return prev.next == null ? -1 : prev.next.value;
    }

    public void remove(int key) {
        int idx = hash(key);
        if (buckets[idx] == null) return;
        Node prev = findPrev(buckets[idx], key);
        if (prev.next != null) {
            prev.next = prev.next.next; // удаляем узел
        }
    }

    // Находим узел ПЕРЕД узлом с данным ключом
    private Node findPrev(Node head, int key) {
        Node cur = head;
        while (cur.next != null && cur.next.key != key) {
            cur = cur.next;
        }
        return cur;
    }

    public static void main(String[] args) {
        MyHashMap map = new MyHashMap();
        map.put(1, 1);
        map.put(2, 2);
        System.out.println(map.get(1));  // 1
        System.out.println(map.get(3));  // -1
        map.put(2, 1);
        System.out.println(map.get(2));  // 1
        map.remove(2);
        System.out.println(map.get(2));  // -1
    }
}`,
      explanation: 'Реализация HashMap методом цепочек (separate chaining). Массив из 1009 бакетов (простое число для лучшего распределения). Каждый бакет — связный список с sentinel-узлом. findPrev ищет узел перед нужным — упрощает удаление. Средняя сложность операций O(1) при хорошей хеш-функции, O(n/SIZE) при коллизиях.'
    }
  ]
}
