export default {
  id: 87,
  title: 'Практикум: Задачи на HashMap',
  description: 'Практические задачи на HashMap: Two Sum, изоморфные строки, частотный анализ, подмассивы, LRU Cache.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Two Sum вариации',
      type: 'practice',
      difficulty: 'easy',
      description: 'Найди два числа в массиве, которые в сумме дают target. Верни их индексы. Затем реши вариацию: найди все пары.',
      requirements: [
        'Используй HashMap<Integer, Integer> (значение → индекс)',
        'Для каждого числа проверь: есть ли (target - num) в map',
        'Вариация: найди все пары и выведи их',
        'Сложность O(n) по времени'
      ],
      expectedOutput: 'nums=[2,7,11,15], target=9 → [0, 1]\nnums=[3,2,4], target=6 → [1, 2]\nnums=[1,5,3,7,2,8], target=9 → пары: (1,8), (2,7)',
      hint: 'Один проход: для каждого nums[i] ищи complement = target - nums[i] в map. Если нашёл — ответ. Иначе — добавь nums[i] в map.',
      solution: `import java.util.*;

public class Main {
    static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }

    static List<int[]> twoSumAllPairs(int[] nums, int target) {
        List<int[]> pairs = new ArrayList<>();
        Set<Integer> seen = new HashSet<>();
        Set<Integer> used = new HashSet<>();
        for (int num : nums) {
            int complement = target - num;
            if (seen.contains(complement) && !used.contains(num) && !used.contains(complement)) {
                pairs.add(new int[]{Math.min(num, complement), Math.max(num, complement)});
                used.add(num);
                used.add(complement);
            }
            seen.add(num);
        }
        return pairs;
    }

    public static void main(String[] args) {
        System.out.println("nums=[2,7,11,15], target=9 → " + Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9)));
        System.out.println("nums=[3,2,4], target=6 → " + Arrays.toString(twoSum(new int[]{3, 2, 4}, 6)));

        List<int[]> pairs = twoSumAllPairs(new int[]{1, 5, 3, 7, 2, 8}, 9);
        StringBuilder sb = new StringBuilder("nums=[1,5,3,7,2,8], target=9 → пары: ");
        for (int i = 0; i < pairs.size(); i++) {
            if (i > 0) sb.append(", ");
            sb.append("(").append(pairs.get(i)[0]).append(",").append(pairs.get(i)[1]).append(")");
        }
        System.out.println(sb);
    }
}`,
      explanation: 'Two Sum — каноническая задача на HashMap. Для каждого числа ищем его "дополнение" (target - num) в map. Если найдено — пара готова. Один проход — O(n). Вариация "все пары" использует два Set: seen (что видели) и used (что уже в парах), чтобы избежать дубликатов. HashMap превращает квадратичный перебор в линейный.'
    },
    {
      id: 2,
      title: 'Задача: Isomorphic Strings',
      type: 'practice',
      difficulty: 'easy',
      description: 'Определи, являются ли две строки изоморфными. Строки изоморфны, если символы одной можно заменить символами другой с сохранением порядка (биекция).',
      requirements: [
        'Используй два HashMap: s→t и t→s',
        'Для каждой пары символов проверяй согласованность отображения',
        'Если символ уже сопоставлен с другим — не изоморфны',
        'Проверь в обоих направлениях'
      ],
      expectedOutput: '"egg" и "add": true (e→a, g→d)\n"foo" и "bar": false (o→a и o→r — конфликт)\n"paper" и "title": true',
      hint: 'Два отображения: map1[s[i]] = t[i] и map2[t[i]] = s[i]. Если map1 уже содержит s[i] и значение != t[i] — false. Аналогично для map2.',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {
    static boolean isIsomorphic(String s, String t) {
        if (s.length() != t.length()) return false;
        Map<Character, Character> sToT = new HashMap<>();
        Map<Character, Character> tToS = new HashMap<>();

        for (int i = 0; i < s.length(); i++) {
            char sc = s.charAt(i), tc = t.charAt(i);

            if (sToT.containsKey(sc) && sToT.get(sc) != tc) return false;
            if (tToS.containsKey(tc) && tToS.get(tc) != sc) return false;

            sToT.put(sc, tc);
            tToS.put(tc, sc);
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println("\\"egg\\" и \\"add\\": " + isIsomorphic("egg", "add") + " (e→a, g→d)");
        System.out.println("\\"foo\\" и \\"bar\\": " + isIsomorphic("foo", "bar") + " (o→a и o→r — конфликт)");
        System.out.println("\\"paper\\" и \\"title\\": " + isIsomorphic("paper", "title"));
    }
}`,
      explanation: 'Изоморфизм требует биекции (взаимно-однозначного соответствия). Одного HashMap недостаточно: "ab" и "aa" — s→t работает (a→a, b→a), но это не биекция! Нужен и обратный map t→s, чтобы проверить, что разные символы t не отображаются в один символ s. Два map гарантируют корректность в обоих направлениях.'
    },
    {
      id: 3,
      title: 'Задача: Word Pattern',
      type: 'practice',
      difficulty: 'easy',
      description: 'Определи, следует ли строка str паттерну pattern. Например, "abba" и "dog cat cat dog" → true.',
      requirements: [
        'Раздели str по пробелам',
        'Проверь, что длина pattern == количество слов',
        'Используй два HashMap: pattern→word и word→pattern',
        'Каждая буква паттерна должна соответствовать ровно одному слову'
      ],
      expectedOutput: 'pattern="abba", str="dog cat cat dog": true\npattern="abba", str="dog cat cat fish": false\npattern="aaaa", str="dog cat cat dog": false',
      hint: 'Аналогично Isomorphic Strings, но вместо char→char используем char→String и String→char.',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {
    static boolean wordPattern(String pattern, String str) {
        String[] words = str.split(" ");
        if (pattern.length() != words.length) return false;

        Map<Character, String> pToW = new HashMap<>();
        Map<String, Character> wToP = new HashMap<>();

        for (int i = 0; i < pattern.length(); i++) {
            char p = pattern.charAt(i);
            String w = words[i];

            if (pToW.containsKey(p) && !pToW.get(p).equals(w)) return false;
            if (wToP.containsKey(w) && wToP.get(w) != p) return false;

            pToW.put(p, w);
            wToP.put(w, p);
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println("pattern=\\"abba\\", str=\\"dog cat cat dog\\": "
            + wordPattern("abba", "dog cat cat dog"));
        System.out.println("pattern=\\"abba\\", str=\\"dog cat cat fish\\": "
            + wordPattern("abba", "dog cat cat fish"));
        System.out.println("pattern=\\"aaaa\\", str=\\"dog cat cat dog\\": "
            + wordPattern("aaaa", "dog cat cat dog"));
    }
}`,
      explanation: 'Word Pattern — обобщение Isomorphic Strings на слова. Биекция между буквами паттерна и словами строки. "abba" / "dog cat cat dog": a↔dog, b↔cat — ОК. "aaaa" / "dog cat cat dog": a→dog, потом a→cat — конфликт. Два HashMap (прямой и обратный) гарантируют взаимно-однозначное соответствие.'
    },
    {
      id: 4,
      title: 'Задача: Contains Duplicate II',
      type: 'practice',
      difficulty: 'easy',
      description: 'Определи, есть ли в массиве два различных индекса i и j, такие что nums[i] == nums[j] и |i - j| <= k.',
      requirements: [
        'Используй HashMap<Integer, Integer> (значение → последний индекс)',
        'Для каждого элемента проверяй: есть ли он в map и |текущий_индекс - сохранённый| <= k',
        'Обновляй индекс в map',
        'Альтернатива: HashSet со скользящим окном размера k'
      ],
      expectedOutput: 'nums=[1,2,3,1], k=3: true\nnums=[1,0,1,1], k=1: true\nnums=[1,2,3,1,2,3], k=2: false',
      hint: 'HashMap хранит последний индекс каждого числа. При повторе проверяем расстояние. HashSet альтернатива: поддерживай окно размера k, удаляя старые элементы.',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {
    static boolean containsNearbyDuplicate(int[] nums, int k) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            if (map.containsKey(nums[i]) && i - map.get(nums[i]) <= k) {
                return true;
            }
            map.put(nums[i], i);
        }
        return false;
    }

    public static void main(String[] args) {
        System.out.println("nums=[1,2,3,1], k=3: " + containsNearbyDuplicate(new int[]{1, 2, 3, 1}, 3));
        System.out.println("nums=[1,0,1,1], k=1: " + containsNearbyDuplicate(new int[]{1, 0, 1, 1}, 1));
        System.out.println("nums=[1,2,3,1,2,3], k=2: " + containsNearbyDuplicate(new int[]{1, 2, 3, 1, 2, 3}, 2));
    }
}`,
      explanation: 'HashMap хранит последнюю позицию каждого числа. При обнаружении дубликата проверяем, удовлетворяет ли расстояние условию ≤ k. Обновляем позицию при каждом проходе (нас интересует ближайший дубликат). Альтернативный подход с HashSet: поддерживать окно размера k, удаляя элементы при выходе за границу. Оба подхода O(n).'
    },
    {
      id: 5,
      title: 'Задача: Subarray Sum Equals K',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди количество непрерывных подмассивов, сумма которых равна k.',
      requirements: [
        'Используй prefix sum и HashMap<Integer, Integer> (сумма → количество)',
        'Для каждой позиции: если (prefixSum - k) есть в map — добавь count',
        'Инициализируй map: map.put(0, 1)',
        'Обновляй map после проверки'
      ],
      expectedOutput: 'nums=[1,1,1], k=2: 2\nnums=[1,2,3], k=3: 2\nnums=[1,-1,0], k=0: 3',
      hint: 'Prefix Sum trick: если prefixSum[j] - prefixSum[i] == k, то подмассив [i+1..j] имеет сумму k. HashMap считает, сколько раз каждая prefix sum встречалась.',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {
    static int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> map = new HashMap<>();
        map.put(0, 1);
        int sum = 0, count = 0;

        for (int num : nums) {
            sum += num;
            count += map.getOrDefault(sum - k, 0);
            map.merge(sum, 1, Integer::sum);
        }
        return count;
    }

    public static void main(String[] args) {
        System.out.println("nums=[1,1,1], k=2: " + subarraySum(new int[]{1, 1, 1}, 2));
        System.out.println("nums=[1,2,3], k=3: " + subarraySum(new int[]{1, 2, 3}, 3));
        System.out.println("nums=[1,-1,0], k=0: " + subarraySum(new int[]{1, -1, 0}, 0));
    }
}`,
      explanation: 'Prefix Sum + HashMap — мощный паттерн. Идея: prefixSum[j] - prefixSum[i] = сумма подмассива [i+1..j]. Если prefixSum[j] - k встречалась раньше — нашли подмассив с суммой k. HashMap считает, сколько раз каждая prefix sum встречалась. map.put(0,1) обрабатывает случай, когда подмассив начинается с индекса 0. Сложность O(n).'
    },
    {
      id: 6,
      title: 'Задача: Longest Consecutive Sequence',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди длину наибольшей последовательности подряд идущих чисел в неотсортированном массиве. Решение должно быть O(n).',
      requirements: [
        'Помести все числа в HashSet',
        'Для каждого числа: если num-1 НЕ в set — это начало последовательности',
        'Считай длину последовательности: num, num+1, num+2, ...',
        'Обновляй максимум'
      ],
      expectedOutput: 'nums=[100, 4, 200, 1, 3, 2] → 4 (последовательность: 1,2,3,4)\nnums=[0,3,7,2,5,8,4,6,0,1] → 9 (0-8)',
      hint: 'Ключ: начинать подсчёт только с начала последовательности (num-1 не в set). Это гарантирует, что каждое число обрабатывается O(1) раз в среднем.',
      solution: `import java.util.HashSet;
import java.util.Set;

public class Main {
    static int longestConsecutive(int[] nums) {
        Set<Integer> set = new HashSet<>();
        for (int n : nums) set.add(n);

        int maxLen = 0;
        for (int num : set) {
            if (!set.contains(num - 1)) { // начало последовательности
                int current = num;
                int length = 1;
                while (set.contains(current + 1)) {
                    current++;
                    length++;
                }
                maxLen = Math.max(maxLen, length);
            }
        }
        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println("nums=[100,4,200,1,3,2] → "
            + longestConsecutive(new int[]{100, 4, 200, 1, 3, 2})
            + " (последовательность: 1,2,3,4)");
        System.out.println("nums=[0,3,7,2,5,8,4,6,0,1] → "
            + longestConsecutive(new int[]{0, 3, 7, 2, 5, 8, 4, 6, 0, 1})
            + " (0-8)");
    }
}`,
      explanation: 'Элегантное O(n) решение. HashSet для O(1) проверки наличия. Ключевой трюк: начинаем подсчёт только если num-1 отсутствует (это начало цепочки). Без этой проверки было бы O(n^2). С ней каждое число участвует в подсчёте ровно одной цепочки, суммарно O(n). Сортировка дала бы O(n log n).'
    },
    {
      id: 7,
      title: 'Задача: Top K Frequent Elements',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди k наиболее часто встречающихся элементов в массиве.',
      requirements: [
        'Подсчитай частоту каждого элемента с помощью HashMap',
        'Используй PriorityQueue (min-heap) размера k',
        'Альтернатива: Bucket Sort по частотам',
        'Верни k элементов с наибольшей частотой'
      ],
      expectedOutput: 'nums=[1,1,1,2,2,3], k=2 → [1, 2]\nnums=[4,4,4,3,3,2,1], k=3 → [4, 3, 2]',
      hint: 'HashMap для частот. PriorityQueue (min-heap) размера k: добавляй элементы, если размер > k — удаляй минимум. В конце в heap останутся top-k.',
      solution: `import java.util.*;

public class Main {
    static int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> freq = new HashMap<>();
        for (int n : nums) freq.merge(n, 1, Integer::sum);

        PriorityQueue<Integer> pq = new PriorityQueue<>(
            (a, b) -> freq.get(a) - freq.get(b)
        );

        for (int key : freq.keySet()) {
            pq.add(key);
            if (pq.size() > k) pq.poll();
        }

        int[] result = new int[k];
        for (int i = 0; i < k; i++) result[i] = pq.poll();
        return result;
    }

    public static void main(String[] args) {
        System.out.println("nums=[1,1,1,2,2,3], k=2 → "
            + Arrays.toString(topKFrequent(new int[]{1, 1, 1, 2, 2, 3}, 2)));
        System.out.println("nums=[4,4,4,3,3,2,1], k=3 → "
            + Arrays.toString(topKFrequent(new int[]{4, 4, 4, 3, 3, 2, 1}, 3)));
    }
}`,
      explanation: 'Два шага: 1) HashMap для подсчёта частот — O(n). 2) Min-heap размера k: добавляем элементы, при превышении размера k удаляем минимум. В итоге в heap остаются k самых частых. Сложность O(n log k). Bucket Sort альтернатива: массив списков по частотам, проход с конца — O(n). PriorityQueue с компаратором по частоте — элегантное решение.'
    },
    {
      id: 8,
      title: 'Задача: Group Shifted Strings',
      type: 'practice',
      difficulty: 'medium',
      description: 'Группируй строки по "сдвигу". Строки "abc" и "bcd" — в одной группе (сдвиг на 1). "az" и "ba" — тоже (циклический сдвиг).',
      requirements: [
        'Вычисли "ключ сдвига" для каждой строки: разности между соседними символами',
        'Используй модульную арифметику для обработки циклических сдвигов',
        'Группируй строки с одинаковым ключом через HashMap',
        'Выведи группы'
      ],
      expectedOutput: 'Вход: ["abc","bcd","acef","xyz","az","ba","a","z"]\nГруппы:\n["abc","bcd","xyz"]\n["acef"]\n["az","ba"]\n["a","z"]',
      hint: 'Ключ: для "abc" разности = "1,1", для "bcd" = "1,1" → одна группа. Для "az" = "25", для "ba" = "25" ((-1+26)%26=25) → одна группа.',
      solution: `import java.util.*;

public class Main {
    static String getKey(String s) {
        StringBuilder key = new StringBuilder();
        for (int i = 1; i < s.length(); i++) {
            int diff = (s.charAt(i) - s.charAt(i - 1) + 26) % 26;
            key.append(diff).append(",");
        }
        return key.toString();
    }

    static List<List<String>> groupStrings(String[] strings) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strings) {
            String key = getKey(s);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        return new ArrayList<>(map.values());
    }

    public static void main(String[] args) {
        String[] input = {"abc", "bcd", "acef", "xyz", "az", "ba", "a", "z"};
        System.out.println("Вход: " + Arrays.toString(input));
        System.out.println("Группы:");
        for (List<String> group : groupStrings(input)) {
            System.out.println(group);
        }
    }
}`,
      explanation: 'Сдвинутые строки имеют одинаковые разности между соседними символами (по модулю 26). "abc": b-a=1, c-b=1 → ключ "1,1". "xyz": y-x=1, z-y=1 → ключ "1,1". "az": z-a=25 → ключ "25". "ba": a-b=-1 → (-1+26)%26=25 → ключ "25". Модуль 26 обеспечивает корректность циклических сдвигов.'
    },
    {
      id: 9,
      title: 'Задача: Intersection of Two Arrays',
      type: 'practice',
      difficulty: 'easy',
      description: 'Найди пересечение двух массивов. Вариация 1: уникальные элементы. Вариация 2: с учётом дубликатов.',
      requirements: [
        'Вариация 1: используй два HashSet, пересечение',
        'Вариация 2: используй HashMap для подсчёта частот',
        'Для каждого элемента второго массива: если есть в map и count > 0 — добавь в результат',
        'Протестируй обе вариации'
      ],
      expectedOutput: 'nums1=[1,2,2,1], nums2=[2,2]\nУникальное пересечение: [2]\nПересечение с дубликатами: [2, 2]\n\nnums1=[4,9,5], nums2=[9,4,9,8,4]\nУникальное пересечение: [4, 9]\nПересечение с дубликатами: [4, 9]',
      hint: 'Уникальное: set1.retainAll(set2). С дубликатами: HashMap считает частоты в nums1. Для каждого элемента nums2: если count > 0, добавь и уменьши count.',
      solution: `import java.util.*;

public class Main {
    static int[] intersectUnique(int[] nums1, int[] nums2) {
        Set<Integer> set1 = new HashSet<>();
        for (int n : nums1) set1.add(n);
        Set<Integer> result = new HashSet<>();
        for (int n : nums2) {
            if (set1.contains(n)) result.add(n);
        }
        return result.stream().mapToInt(Integer::intValue).toArray();
    }

    static int[] intersectWithDups(int[] nums1, int[] nums2) {
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
        int[] a = {1, 2, 2, 1}, b = {2, 2};
        System.out.println("nums1=[1,2,2,1], nums2=[2,2]");
        System.out.println("Уникальное пересечение: " + Arrays.toString(intersectUnique(a, b)));
        System.out.println("Пересечение с дубликатами: " + Arrays.toString(intersectWithDups(a, b)));

        System.out.println();
        int[] c = {4, 9, 5}, d = {9, 4, 9, 8, 4};
        System.out.println("nums1=[4,9,5], nums2=[9,4,9,8,4]");
        System.out.println("Уникальное пересечение: " + Arrays.toString(intersectUnique(c, d)));
        System.out.println("Пересечение с дубликатами: " + Arrays.toString(intersectWithDups(c, d)));
    }
}`,
      explanation: 'Два варианта пересечения массивов. Уникальное: HashSet отсекает дубликаты, проверяем наличие каждого элемента nums2 в set1. С дубликатами: HashMap считает частоту каждого элемента nums1. Для nums2: если элемент есть в map с count>0 — добавляем и уменьшаем count. Это учитывает точное количество дубликатов. Оба решения O(n+m).'
    },
    {
      id: 10,
      title: 'Задача: LRU Cache',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй LRU (Least Recently Used) Cache с операциями get и put за O(1). При переполнении удаляется наименее недавно использованный элемент.',
      requirements: [
        'Используй HashMap + двусвязный список (LinkedHashMap или свой)',
        'get(key): вернуть значение и переместить в конец (недавно использованный)',
        'put(key, value): добавить/обновить и переместить в конец',
        'При переполнении удалить элемент из начала списка (самый старый)'
      ],
      expectedOutput: 'LRUCache(2)\nput(1,1), put(2,2)\nget(1) = 1\nput(3,3) → вытеснен ключ 2\nget(2) = -1 (удалён)\nput(4,4) → вытеснен ключ 1\nget(1) = -1\nget(3) = 3\nget(4) = 4',
      hint: 'LinkedHashMap с accessOrder=true автоматически поддерживает LRU порядок. Или реализуй свой двусвязный список с HashMap<key, Node>.',
      solution: `import java.util.LinkedHashMap;
import java.util.Map;

public class Main {
    static LinkedHashMap<Integer, Integer> cache;
    static int capacity;

    static void initCache(int cap) {
        capacity = cap;
        cache = new LinkedHashMap<>(cap, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
                return size() > capacity;
            }
        };
    }

    static int get(int key) {
        return cache.getOrDefault(key, -1);
    }

    static void put(int key, int value) {
        cache.put(key, value);
    }

    public static void main(String[] args) {
        initCache(2);
        System.out.println("LRUCache(2)");

        put(1, 1);
        put(2, 2);
        System.out.println("put(1,1), put(2,2)");
        System.out.println("get(1) = " + get(1));

        put(3, 3);
        System.out.println("put(3,3) → вытеснен ключ 2");
        System.out.println("get(2) = " + get(2) + " (удалён)");

        put(4, 4);
        System.out.println("put(4,4) → вытеснен ключ 1");
        System.out.println("get(1) = " + get(1));
        System.out.println("get(3) = " + get(3));
        System.out.println("get(4) = " + get(4));
    }
}`,
      explanation: 'LRU Cache — одна из важнейших структур данных на интервью. Требуется O(1) для get и put. LinkedHashMap с accessOrder=true — готовое решение в Java: при доступе элемент перемещается в конец. Override removeEldestEntry для автоматического удаления старейшего элемента. На интервью могут попросить реализовать с нуля: HashMap + двусвязный список с dummy head/tail.'
    }
  ]
}
