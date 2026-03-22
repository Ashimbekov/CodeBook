export default {
  id: 58,
  title: 'Практикум: Задачи уровня Medium',
  description: 'Задачи среднего уровня из технических интервью: три суммы, скользящее окно, анаграммы, матрицы, палиндромы и другие классические алгоритмические задачи',
  lessons: [
    {
      id: 1,
      title: 'Задача: Three Sum (Три числа с нулевой суммой)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums. Найди все уникальные тройки [nums[i], nums[j], nums[k]] такие что i != j != k и nums[i] + nums[j] + nums[k] == 0. Вернуть список всех таких троек без дубликатов.',
      requirements: [
        'Метод threeSum(int[] nums) возвращает List<List<Integer>>',
        'Нет дубликатов в результате',
        'Эффективное решение O(n²)',
        'Протестировать: [-1,0,1,2,-1,-4]→[[-1,-1,2],[-1,0,1]], [0,0,0]→[[0,0,0]], [0,1,1]→[]'
      ],
      expectedOutput: '[[-1, -1, 2], [-1, 0, 1]]\n[[0, 0, 0]]\n[]',
      hint: 'Сортируй массив. Фиксируй первый элемент в цикле (если nums[i] > 0 — стоп, нет смысла). Для оставшейся части используй два указателя: left и right. Двигай их в зависимости от суммы. Пропускай дубликаты.',
      solution: 'import java.util.ArrayList;\nimport java.util.Arrays;\nimport java.util.List;\n\npublic class ThreeSum {\n\n    public static List<List<Integer>> threeSum(int[] nums) {\n        List<List<Integer>> result = new ArrayList<>();\n        Arrays.sort(nums); // сортируем для использования двух указателей\n\n        for (int i = 0; i < nums.length - 2; i++) {\n            // Оптимизация: если наименьший элемент > 0, сумма всегда > 0\n            if (nums[i] > 0) break;\n\n            // Пропускаем дубликаты для первого элемента\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n\n            int left = i + 1;\n            int right = nums.length - 1;\n\n            while (left < right) {\n                int sum = nums[i] + nums[left] + nums[right];\n\n                if (sum == 0) {\n                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));\n\n                    // Пропускаем дубликаты для второго и третьего элементов\n                    while (left < right && nums[left] == nums[left + 1]) left++;\n                    while (left < right && nums[right] == nums[right - 1]) right--;\n\n                    left++;\n                    right--;\n                } else if (sum < 0) {\n                    left++; // сумма слишком мала — увеличиваем левый\n                } else {\n                    right--; // сумма слишком велика — уменьшаем правый\n                }\n            }\n        }\n\n        return result;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(threeSum(new int[]{-1, 0, 1, 2, -1, -4})); // [[-1,-1,2],[-1,0,1]]\n        System.out.println(threeSum(new int[]{0, 0, 0}));              // [[0,0,0]]\n        System.out.println(threeSum(new int[]{0, 1, 1}));              // []\n    }\n}',
      explanation: 'Стратегия: сортировка + два указателя. Сортировка позволяет двигать указатели предсказуемо: если сумма меньше нуля — left++, больше — right--. Сложность O(n²): внешний цикл O(n), внутренний двойной указатель O(n). Ключевой момент — пропуск дубликатов: после нахождения тройки сдвигаем оба указателя, пропуская одинаковые значения. Для внешнего цикла тоже пропускаем nums[i] == nums[i-1]. Оптимизация: если nums[i] > 0 и массив отсортирован — никаких нулевых сумм уже не будет.'
    },
    {
      id: 2,
      title: 'Задача: Longest Substring Without Repeating Characters',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s. Найди длину наибольшей подстроки без повторяющихся символов. Например: "abcabcbb" → 3 ("abc"), "bbbbb" → 1 ("b"), "pwwkew" → 3 ("wke").',
      requirements: [
        'Метод lengthOfLongestSubstring(String s) возвращает int',
        'Использовать технику скользящего окна (sliding window)',
        'Сложность O(n)',
        'Протестировать: "abcabcbb"→3, "bbbbb"→1, "pwwkew"→3, ""→0'
      ],
      expectedOutput: '3\n1\n3\n0',
      hint: 'Используй HashMap: символ → его последний индекс. Храни левую границу окна (start). При нахождении повторяющегося символа двигай start правее его предыдущей позиции. Максимальная ширина окна — ответ.',
      solution: 'import java.util.HashMap;\nimport java.util.Map;\n\npublic class LongestSubstring {\n\n    public static int lengthOfLongestSubstring(String s) {\n        Map<Character, Integer> lastIndex = new HashMap<>(); // символ → последний индекс\n        int maxLen = 0;\n        int start = 0; // левая граница окна\n\n        for (int end = 0; end < s.length(); end++) {\n            char c = s.charAt(end);\n\n            // Если символ уже встречался в текущем окне\n            if (lastIndex.containsKey(c) && lastIndex.get(c) >= start) {\n                // Сдвигаем левую границу правее повтора\n                start = lastIndex.get(c) + 1;\n            }\n\n            lastIndex.put(c, end); // обновляем последнюю позицию символа\n            maxLen = Math.max(maxLen, end - start + 1); // обновляем максимум\n        }\n\n        return maxLen;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(lengthOfLongestSubstring("abcabcbb")); // 3\n        System.out.println(lengthOfLongestSubstring("bbbbb"));    // 1\n        System.out.println(lengthOfLongestSubstring("pwwkew"));   // 3\n        System.out.println(lengthOfLongestSubstring(""));         // 0\n    }\n}',
      explanation: 'Скользящее окно — мощный паттерн для задач на подстроки/подмассивы. Окно определяется двумя указателями [start, end]. Правый указатель (end) всегда движется вперёд. Когда находим повторяющийся символ, левый (start) прыгает правее предыдущего вхождения этого символа. Критическая проверка: lastIndex.get(c) >= start, потому что символ мог встречаться до текущего окна — тогда его не нужно учитывать. HashMap хранит последний индекс каждого символа, что даёт O(1) поиск. Итоговая сложность O(n).'
    },
    {
      id: 3,
      title: 'Задача: Group Anagrams (Группировка анаграмм)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив строк strs. Сгруппируй анаграммы вместе и верни список групп. Анаграммы — слова, составленные из одних и тех же букв в разном порядке. Например: "eat", "tea", "ate" — анаграммы друг друга.',
      requirements: [
        'Метод groupAnagrams(String[] strs) возвращает List<List<String>>',
        'Каждая группа содержит все анаграммы данного слова',
        'Использовать отсортированную строку как ключ HashMap',
        'Протестировать: ["eat","tea","tan","ate","nat","bat"]→[["eat","tea","ate"],["tan","nat"],["bat"]]'
      ],
      expectedOutput: '[[eat, tea, ate], [tan, nat], [bat]]',
      hint: 'Ключ для группировки — отсортированные символы строки. "eat" → "aet", "tea" → "aet", "ate" → "aet" — все получают одинаковый ключ. Используй HashMap<String, List<String>>.',
      solution: 'import java.util.*;\n\npublic class GroupAnagrams {\n\n    public static List<List<String>> groupAnagrams(String[] strs) {\n        // Ключ: отсортированная строка, Значение: список анаграмм\n        Map<String, List<String>> groups = new HashMap<>();\n\n        for (String s : strs) {\n            // Создаём ключ: сортируем символы строки\n            char[] chars = s.toCharArray();\n            Arrays.sort(chars);\n            String key = new String(chars);\n\n            // Добавляем строку в соответствующую группу\n            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n        }\n\n        return new ArrayList<>(groups.values());\n    }\n\n    public static void main(String[] args) {\n        String[] input = {"eat", "tea", "tan", "ate", "nat", "bat"};\n        List<List<String>> result = groupAnagrams(input);\n\n        // Сортируем для стабильного вывода\n        for (List<String> group : result) {\n            Collections.sort(group);\n        }\n        result.sort(Comparator.comparing(g -> g.get(0)));\n\n        System.out.println(result); // [[eat, tea, ate], [tan, nat], [bat]]\n    }\n}',
      explanation: 'Ключевая идея: анаграммы имеют одинаковый набор символов, значит при сортировке символов дают одинаковую строку ("eat", "tea", "ate" → все "aet"). Используем эту отсортированную строку как ключ HashMap. computeIfAbsent(key, k -> new ArrayList<>()) — элегантный способ: получить существующий список или создать новый если ключа нет. Сложность: O(n * k log k), где n — количество строк, k — максимальная длина строки (из-за сортировки каждой строки). Альтернатива: ключ из частот символов [0,1,0,...] за O(n*k).'
    },
    {
      id: 4,
      title: 'Задача: Product of Array Except Self (Произведение кроме себя)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums. Верни массив answer такой, что answer[i] равно произведению всех элементов nums кроме nums[i]. Нельзя использовать деление! Решение должно работать за O(n).',
      requirements: [
        'Метод productExceptSelf(int[] nums) возвращает int[]',
        'Без операции деления',
        'O(n) по времени',
        'Протестировать: [1,2,3,4]→[24,12,8,6], [-1,1,0,-3,3]→[0,0,9,0,0]'
      ],
      expectedOutput: '[24, 12, 8, 6]\n[0, 0, 9, 0, 0]',
      hint: 'Два прохода. Первый слева направо: answer[i] = произведение всех элементов ЛЕВЕЕ i. Второй справа налево: умножаем на произведение всех элементов ПРАВЕЕ i. В итоге answer[i] = левое_произведение * правое_произведение.',
      solution: 'import java.util.Arrays;\n\npublic class ProductExceptSelf {\n\n    public static int[] productExceptSelf(int[] nums) {\n        int n = nums.length;\n        int[] answer = new int[n];\n\n        // Первый проход: answer[i] = произведение всех элементов левее i\n        answer[0] = 1; // слева от первого элемента ничего нет\n        for (int i = 1; i < n; i++) {\n            answer[i] = answer[i - 1] * nums[i - 1];\n        }\n\n        // Второй проход: умножаем на произведение всех элементов правее i\n        int rightProduct = 1; // произведение элементов правее текущего\n        for (int i = n - 1; i >= 0; i--) {\n            answer[i] *= rightProduct;\n            rightProduct *= nums[i]; // обновляем правое произведение\n        }\n\n        return answer;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(Arrays.toString(productExceptSelf(new int[]{1, 2, 3, 4})));       // [24, 12, 8, 6]\n        System.out.println(Arrays.toString(productExceptSelf(new int[]{-1, 1, 0, -3, 3}))); // [0, 0, 9, 0, 0]\n    }\n}',
      explanation: 'Элегантное решение без деления использует тот факт, что answer[i] = (произведение всех элементов левее i) * (произведение всех элементов правее i). Первый проход строит левые произведения: answer[0]=1, answer[1]=nums[0], answer[2]=nums[0]*nums[1] и т.д. Второй проход (справа) накапливает правое произведение в переменной rightProduct и умножает на него каждый элемент. Пример для [1,2,3,4]: левые=[1,1,2,6], правые=[24,12,4,1], результат=[24,12,8,6]. O(n) время, O(1) дополнительная память (не считая выходного массива).'
    },
    {
      id: 5,
      title: 'Задача: Spiral Matrix (Матрица по спирали)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана матрица m x n. Верни все элементы матрицы в порядке обхода по спирали (по часовой стрелке, начиная с верхнего левого угла). Например матрица [[1,2,3],[4,5,6],[7,8,9]] → [1,2,3,6,9,8,7,4,5].',
      requirements: [
        'Метод spiralOrder(int[][] matrix) возвращает List<Integer>',
        'Обход по часовой стрелке',
        'Работает для матриц любого размера включая одну строку/столбец',
        'Протестировать: [[1,2,3],[4,5,6],[7,8,9]]→[1,2,3,6,9,8,7,4,5]'
      ],
      expectedOutput: '[1, 2, 3, 6, 9, 8, 7, 4, 5]\n[1, 2, 3, 4, 5, 6]',
      hint: 'Поддерживай четыре границы: top, bottom, left, right. Обходи верхнюю строку слева направо, правый столбец сверху вниз, нижнюю строку справа налево, левый столбец снизу вверх. После каждого обхода сужай соответствующую границу.',
      solution: 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class SpiralMatrix {\n\n    public static List<Integer> spiralOrder(int[][] matrix) {\n        List<Integer> result = new ArrayList<>();\n        if (matrix == null || matrix.length == 0) return result;\n\n        int top = 0;\n        int bottom = matrix.length - 1;\n        int left = 0;\n        int right = matrix[0].length - 1;\n\n        while (top <= bottom && left <= right) {\n            // Обход верхней строки слева направо\n            for (int col = left; col <= right; col++) {\n                result.add(matrix[top][col]);\n            }\n            top++;\n\n            // Обход правого столбца сверху вниз\n            for (int row = top; row <= bottom; row++) {\n                result.add(matrix[row][right]);\n            }\n            right--;\n\n            // Обход нижней строки справа налево (если осталась)\n            if (top <= bottom) {\n                for (int col = right; col >= left; col--) {\n                    result.add(matrix[bottom][col]);\n                }\n                bottom--;\n            }\n\n            // Обход левого столбца снизу вверх (если остался)\n            if (left <= right) {\n                for (int row = bottom; row >= top; row--) {\n                    result.add(matrix[row][left]);\n                }\n                left++;\n            }\n        }\n\n        return result;\n    }\n\n    public static void main(String[] args) {\n        int[][] m1 = {{1,2,3},{4,5,6},{7,8,9}};\n        System.out.println(spiralOrder(m1)); // [1,2,3,6,9,8,7,4,5]\n\n        int[][] m2 = {{1,2,3,4},{5,6,7,8}};\n        System.out.println(spiralOrder(m2)); // [1,2,3,4,8,7,6,5]\n    }\n}',
      explanation: 'Метод "четырёх границ" симулирует спиральный обход. Поддерживаем top, bottom, left, right — текущие границы необработанной части матрицы. Каждый "виток" спирали: 1) верхняя строка слева→право, 2) правый столбец сверху→вниз, 3) нижняя строка право→влево, 4) левый столбец снизу→вверх. После каждого направления сужаем границу. Проверки top <= bottom и left <= right перед нижней строкой и левым столбцом необходимы для матриц с нечётными размерами, где средняя строка или столбец обрабатывается отдельно. Сложность O(m*n).'
    },
    {
      id: 6,
      title: 'Задача: Rotate Matrix 90 Degrees (Поворот матрицы на 90°)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана матрица n x n. Поверни её на 90 градусов по часовой стрелке "на месте" (in-place), без использования дополнительной матрицы. Например: [[1,2,3],[4,5,6],[7,8,9]] → [[7,4,1],[8,5,2],[9,6,3]].',
      requirements: [
        'Метод rotate(int[][] matrix) изменяет матрицу на месте (void)',
        'In-place поворот: O(1) дополнительной памяти',
        'Матрица квадратная n x n',
        'Протестировать: [[1,2,3],[4,5,6],[7,8,9]] → [[7,4,1],[8,5,2],[9,6,3]]'
      ],
      expectedOutput: '[[7, 4, 1], [8, 5, 2], [9, 6, 3]]',
      hint: 'Поворот на 90° = транспонирование (отражение по главной диагонали) + отражение по вертикальной оси. Транспонирование: matrix[i][j] ↔ matrix[j][i]. Отражение по вертикали: переворачиваем каждую строку.',
      solution: 'import java.util.Arrays;\n\npublic class RotateMatrix {\n\n    public static void rotate(int[][] matrix) {\n        int n = matrix.length;\n\n        // Шаг 1: Транспонирование — отражение по главной диагонали\n        // matrix[i][j] <-> matrix[j][i]\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) { // j = i+1 чтобы не делать двойную замену\n                int temp = matrix[i][j];\n                matrix[i][j] = matrix[j][i];\n                matrix[j][i] = temp;\n            }\n        }\n\n        // Шаг 2: Отражение по вертикальной оси (переворот каждой строки)\n        for (int i = 0; i < n; i++) {\n            int left = 0;\n            int right = n - 1;\n            while (left < right) {\n                int temp = matrix[i][left];\n                matrix[i][left] = matrix[i][right];\n                matrix[i][right] = temp;\n                left++;\n                right--;\n            }\n        }\n    }\n\n    public static void main(String[] args) {\n        int[][] matrix = {{1,2,3},{4,5,6},{7,8,9}};\n        rotate(matrix);\n        for (int[] row : matrix) {\n            System.out.println(Arrays.toString(row));\n        }\n        // [7, 4, 1]\n        // [8, 5, 2]\n        // [9, 6, 3]\n    }\n}',
      explanation: 'Математический факт: поворот матрицы на 90° по часовой стрелке = транспонирование + отражение по вертикали. Транспонирование меняет matrix[i][j] и matrix[j][i]. Важно: в цикле j начинается с i+1, иначе элементы вернутся обратно (двойная замена = ничего). После транспонирования [[1,2,3],[4,5,6],[7,8,9]] становится [[1,4,7],[2,5,8],[3,6,9]]. Затем переворачиваем каждую строку: [1,4,7]→[7,4,1], [2,5,8]→[8,5,2], [3,6,9]→[9,6,3]. Оба шага O(n²), дополнительная память O(1).'
    },
    {
      id: 7,
      title: 'Задача: Set Matrix Zeroes (Обнуление матрицы)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана матрица m x n. Если matrix[i][j] == 0, то обнули всю строку i и весь столбец j. Выполни это "на месте". Хитрость: нельзя использовать O(m*n) памяти — нужно O(m+n) или O(1).',
      requirements: [
        'Метод setZeroes(int[][] matrix) изменяет матрицу на месте',
        'O(m+n) памяти: использовать два boolean[] для пометки строк и столбцов',
        'Сначала собрать все позиции нулей, потом обнулять',
        'Протестировать: [[1,1,1],[1,0,1],[1,1,1]] → [[1,0,1],[0,0,0],[1,0,1]]'
      ],
      expectedOutput: '[[1, 0, 1], [0, 0, 0], [1, 0, 1]]\n[[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]',
      hint: 'Два прохода. Первый: найди все позиции нулей и запомни строки/столбцы в boolean[]. Второй: обнули соответствующие строки и столбцы. Нельзя обнулять в первом проходе — тогда новые нули изменят результат.',
      solution: 'import java.util.Arrays;\n\npublic class SetMatrixZeroes {\n\n    public static void setZeroes(int[][] matrix) {\n        int m = matrix.length;\n        int n = matrix[0].length;\n\n        boolean[] zeroRows = new boolean[m];    // строки, которые нужно обнулить\n        boolean[] zeroCols = new boolean[n];    // столбцы, которые нужно обнулить\n\n        // Первый проход: находим все нули\n        for (int i = 0; i < m; i++) {\n            for (int j = 0; j < n; j++) {\n                if (matrix[i][j] == 0) {\n                    zeroRows[i] = true;\n                    zeroCols[j] = true;\n                }\n            }\n        }\n\n        // Второй проход: обнуляем строки\n        for (int i = 0; i < m; i++) {\n            if (zeroRows[i]) {\n                Arrays.fill(matrix[i], 0);\n            }\n        }\n\n        // Третий проход: обнуляем столбцы\n        for (int j = 0; j < n; j++) {\n            if (zeroCols[j]) {\n                for (int i = 0; i < m; i++) {\n                    matrix[i][j] = 0;\n                }\n            }\n        }\n    }\n\n    public static void main(String[] args) {\n        int[][] m1 = {{1,1,1},{1,0,1},{1,1,1}};\n        setZeroes(m1);\n        for (int[] row : m1) System.out.println(Arrays.toString(row));\n        // [1, 0, 1] / [0, 0, 0] / [1, 0, 1]\n\n        System.out.println();\n\n        int[][] m2 = {{0,1,2,0},{3,4,5,2},{1,3,1,5}};\n        setZeroes(m2);\n        for (int[] row : m2) System.out.println(Arrays.toString(row));\n        // [0,0,0,0] / [0,4,5,0] / [0,3,1,0]\n    }\n}',
      explanation: 'Распространённая ошибка: обнулять строки/столбцы в том же проходе, где ищем нули. Это создаёт "ложные" нули, которые затем обнулят лишние строки/столбцы. Решение: два шага — сначала отметить все строки и столбцы с нулями, затем обнулить их. boolean[] zeroRows и zeroCols занимают O(m+n) памяти. Существует O(1) решение: использовать саму первую строку и первый столбец матрицы как хранилище меток, но это значительно сложнее в реализации. Для интервью O(m+n) решение обычно достаточно.'
    },
    {
      id: 8,
      title: 'Задача: Longest Palindromic Substring (Наидлиннейший палиндром)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s. Найди и верни наидлиннейшую подстроку, которая является палиндромом. Палиндром читается одинаково слева направо и справа налево. Если несколько подстрок одной длины — верни любую.',
      requirements: [
        'Метод longestPalindrome(String s) возвращает String',
        'Использовать метод "расширения от центра"',
        'O(n²) по времени, O(1) по памяти',
        'Протестировать: "babad"→"bab" или "aba", "cbbd"→"bb", "a"→"a", "racecar"→"racecar"'
      ],
      expectedOutput: 'bab\nbb\na\nracecar',
      hint: 'Каждый символ (и каждая пара соседних символов) может быть центром палиндрома. Расширяй от центра влево и вправо пока символы совпадают. Запоминай наидлинную найденную подстроку. Два случая: нечётный палиндром (центр — один символ) и чётный (центр — два символа).',
      solution: 'public class LongestPalindrome {\n\n    // Расширяем палиндром от центра и возвращаем его длину\n    private static int expandFromCenter(String s, int left, int right) {\n        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {\n            left--;\n            right++;\n        }\n        // Когда вышли из while, last valid: left+1 .. right-1\n        return right - left - 1; // длина палиндрома\n    }\n\n    public static String longestPalindrome(String s) {\n        if (s == null || s.length() < 2) return s;\n\n        int start = 0; // начало наидлиннего палиндрома\n        int maxLen = 1;\n\n        for (int i = 0; i < s.length(); i++) {\n            // Нечётный палиндром: центр в i (например "aba")\n            int len1 = expandFromCenter(s, i, i);\n\n            // Чётный палиндром: центр между i и i+1 (например "abba")\n            int len2 = expandFromCenter(s, i, i + 1);\n\n            int len = Math.max(len1, len2);\n\n            if (len > maxLen) {\n                maxLen = len;\n                // Вычисляем начальный индекс\n                start = i - (len - 1) / 2;\n            }\n        }\n\n        return s.substring(start, start + maxLen);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(longestPalindrome("babad"));   // bab\n        System.out.println(longestPalindrome("cbbd"));    // bb\n        System.out.println(longestPalindrome("a"));        // a\n        System.out.println(longestPalindrome("racecar"));  // racecar\n    }\n}',
      explanation: 'Метод расширения от центра: у строки длины n есть 2n-1 возможных центров (n одиночных символов для нечётных палиндромов и n-1 пар для чётных). Для каждого центра расширяемся влево-вправо пока символы совпадают. Возвращаем длину палиндрома через right - left - 1 (потому что цикл завершился когда условие нарушилось). Начальный индекс вычисляется как i - (len-1)/2. Существует алгоритм Манакера O(n), но расширение от центра O(n²) проще и обычно достаточно для интервью.'
    },
    {
      id: 9,
      title: 'Задача: Container With Most Water (Наибольший контейнер с водой)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив height из n неотрицательных чисел. Каждое число — высота вертикальной линии в точке i. Найди два столбца, которые вместе с горизонтальной осью образуют контейнер с наибольшим количеством воды. Верни максимальный объём воды.',
      requirements: [
        'Метод maxArea(int[] height) возвращает int',
        'Использовать технику двух указателей для O(n) решения',
        'Объём = ширина * min(height[left], height[right])',
        'Протестировать: [1,8,6,2,5,4,8,3,7]→49, [1,1]→1'
      ],
      expectedOutput: '49\n1',
      hint: 'Начни с левого и правого указателей на краях. Объём = (right - left) * min(h[left], h[right]). Двигай тот указатель, у которого высота меньше — он ограничивает текущий объём. Обновляй максимум на каждом шаге.',
      solution: 'public class ContainerWithMostWater {\n\n    public static int maxArea(int[] height) {\n        int left = 0;\n        int right = height.length - 1;\n        int maxWater = 0;\n\n        while (left < right) {\n            // Ширина * минимальная высота\n            int width = right - left;\n            int h = Math.min(height[left], height[right]);\n            int water = width * h;\n\n            maxWater = Math.max(maxWater, water);\n\n            // Двигаем тот указатель, у которого высота меньше\n            // Потому что он ограничивает объём\n            if (height[left] < height[right]) {\n                left++;\n            } else {\n                right--;\n            }\n        }\n\n        return maxWater;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(maxArea(new int[]{1,8,6,2,5,4,8,3,7})); // 49\n        System.out.println(maxArea(new int[]{1,1}));                 // 1\n    }\n}',
      explanation: 'Жадный алгоритм с двумя указателями. Начинаем с максимальной ширины (крайние столбцы). Почему двигаем меньший? Если двинуть больший — ширина уменьшится, а высота может только остаться той же или стать меньше (ограничена меньшим). Если же двигаем меньший — есть шанс найти больший столбец и увеличить объём. Доказательство корректности: мы не пропустим оптимальный ответ. Для любой пары (i, j) где height[i] < height[j]: на момент когда left == i, right уже прошёл через j (или right == j), поэтому ответ будет рассмотрен. Сложность O(n).'
    },
    {
      id: 10,
      title: 'Задача: Next Permutation (Следующая перестановка)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums с перестановкой чисел. Замени его на следующую лексикографически большую перестановку. Если такой нет (массив убывает) — переставь в наименьшую (возрастающую). Выполни in-place за O(1) доп. памяти.',
      requirements: [
        'Метод nextPermutation(int[] nums) изменяет массив на месте',
        'Следующая лексикографически большая перестановка',
        'Если наибольшая — вернуть наименьшую',
        'Протестировать: [1,2,3]→[1,3,2], [3,2,1]→[1,2,3], [1,1,5]→[1,5,1]'
      ],
      expectedOutput: '[1, 3, 2]\n[1, 2, 3]\n[1, 5, 1]',
      hint: 'Алгоритм: 1) Найди с конца первый элемент i, где nums[i] < nums[i+1] ("точка излома"). 2) Найди с конца первый элемент j > nums[i]. 3) Поменяй nums[i] и nums[j]. 4) Разверни суффикс от i+1 до конца.',
      solution: 'import java.util.Arrays;\n\npublic class NextPermutation {\n\n    public static void nextPermutation(int[] nums) {\n        int n = nums.length;\n\n        // Шаг 1: Найти "точку излома" — первый элемент с конца, который меньше своего правого соседа\n        int i = n - 2;\n        while (i >= 0 && nums[i] >= nums[i + 1]) {\n            i--;\n        }\n\n        if (i >= 0) {\n            // Шаг 2: Найти с конца первый элемент больше nums[i]\n            int j = n - 1;\n            while (nums[j] <= nums[i]) {\n                j--;\n            }\n\n            // Шаг 3: Поменять местами\n            int temp = nums[i];\n            nums[i] = nums[j];\n            nums[j] = temp;\n        }\n\n        // Шаг 4: Развернуть суффикс от i+1 до конца\n        // (суффикс убывающий -> станет возрастающим = наименьший)\n        int left = i + 1;\n        int right = n - 1;\n        while (left < right) {\n            int temp = nums[left];\n            nums[left] = nums[right];\n            nums[right] = temp;\n            left++;\n            right--;\n        }\n    }\n\n    public static void main(String[] args) {\n        int[] a = {1, 2, 3};\n        nextPermutation(a);\n        System.out.println(Arrays.toString(a)); // [1, 3, 2]\n\n        int[] b = {3, 2, 1};\n        nextPermutation(b);\n        System.out.println(Arrays.toString(b)); // [1, 2, 3]\n\n        int[] c = {1, 1, 5};\n        nextPermutation(c);\n        System.out.println(Arrays.toString(c)); // [1, 5, 1]\n    }\n}',
      explanation: 'Алгоритм построен на наблюдении: наибольшая перестановка — убывающая последовательность. "Точка излома" — место где убывание прерывается (nums[i] < nums[i+1]). Чтобы получить следующую перестановку: нужно увеличить nums[i] на минимально возможную величину. Для этого находим наименьший элемент в суффиксе, который больше nums[i], и меняем их местами. Теперь суффикс всё ещё убывающий — разворачиваем его, чтобы получить наименьший возможный суффикс. Если точки излома нет (весь массив убывает) — просто разворачиваем весь массив. Сложность O(n).'
    }
  ]
}
