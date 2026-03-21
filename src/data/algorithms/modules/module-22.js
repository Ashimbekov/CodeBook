export default {
  id: 22,
  title: 'ДП: задачи на двумерный массив',
  description: 'Динамическое программирование с двумерными таблицами: уникальные пути, минимальная сумма пути, редакционное расстояние, НОП и задача о рюкзаке',
  lessons: [
    {
      id: 1,
      title: 'Уникальные пути в сетке (Unique Paths)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Задача: в сетке m×n робот стоит в левом верхнем углу. Робот может двигаться только вправо или вниз. Сколькими способами он может добраться до правого нижнего угла?' },
        { type: 'tip', value: 'Представь лабиринт из клеток. Ты входишь слева-сверху и хочешь попасть вправо-снизу, двигаясь только вправо или вниз (как по карте, где можно ехать только на восток и юг). Сколько маршрутов? Это задача об уникальных путях!' },
        { type: 'heading', value: 'Формула ДП' },
        { type: 'text', value: 'dp[i][j] = количество путей до клетки (i,j). Пути приходят только сверху (dp[i-1][j]) или слева (dp[i][j-1]). Поэтому dp[i][j] = dp[i-1][j] + dp[i][j-1]. Первая строка и первый столбец — все единицы (только один путь — прямо).' },
        { type: 'code', language: 'java', value: 'public class UniquePaths {\n    public static int uniquePaths(int m, int n) {\n        int[][] dp = new int[m][n];\n\n        // Первую строку заполняем 1: можно прийти только слева\n        for (int j = 0; j < n; j++) dp[0][j] = 1;\n        // Первый столбец заполняем 1: можно прийти только сверху\n        for (int i = 0; i < m; i++) dp[i][0] = 1;\n\n        // Заполняем остальные клетки\n        for (int i = 1; i < m; i++) {\n            for (int j = 1; j < n; j++) {\n                dp[i][j] = dp[i-1][j] + dp[i][j-1];\n            }\n        }\n        return dp[m-1][n-1];\n    }\n\n    public static void main(String[] args) {\n        System.out.println(uniquePaths(3, 7)); // 28\n        System.out.println(uniquePaths(3, 3)); // 6\n    }\n}' },
        { type: 'heading', value: 'Визуализация ДП-таблицы для 3×3' },
        { type: 'code', language: 'java', value: '// Сетка 3x3, ответ = 6\n//\n// Инициализация:    Заполнение:\n// 1  1  1           1  1  1\n// 1  ?  ?    ->     1  2  3\n// 1  ?  ?           1  3  6\n//\n// dp[1][1] = dp[0][1] + dp[1][0] = 1 + 1 = 2\n// dp[1][2] = dp[0][2] + dp[1][1] = 1 + 2 = 3\n// dp[2][1] = dp[1][1] + dp[2][0] = 2 + 1 = 3\n// dp[2][2] = dp[1][2] + dp[2][1] = 3 + 3 = 6\n//\n// Ответ: 6 уникальных путей в сетке 3x3\n\npublic static void printDPTable(int m, int n) {\n    int[][] dp = new int[m][n];\n    for (int j = 0; j < n; j++) dp[0][j] = 1;\n    for (int i = 0; i < m; i++) dp[i][0] = 1;\n    for (int i = 1; i < m; i++)\n        for (int j = 1; j < n; j++)\n            dp[i][j] = dp[i-1][j] + dp[i][j-1];\n    \n    System.out.println("ДП-таблица:");\n    for (int[] row : dp) {\n        for (int val : row) System.out.printf("%4d", val);\n        System.out.println();\n    }\n}' },
        { type: 'note', value: 'Сложность O(m×n) по времени и памяти. Оптимизация: можно хранить только одну строку O(n) — текущая строка зависит только от предыдущей.' }
      ]
    },
    {
      id: 2,
      title: 'Минимальная сумма пути (Minimum Path Sum)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Задача: дана сетка m×n с неотрицательными числами. Найти путь из левого верхнего угла в правый нижний (только вправо или вниз) с минимальной суммой чисел на пути.' },
        { type: 'tip', value: 'Представь, что ты идёшь по полю, в каждой клетке — цена прохода. Тебе нужно добраться из верхнего левого угла в нижний правый, заплатив как можно меньше. Двигаться можно только вправо и вниз.' },
        { type: 'code', language: 'java', value: 'public class MinPathSum {\n    public static int minPathSum(int[][] grid) {\n        int m = grid.length, n = grid[0].length;\n        int[][] dp = new int[m][n];\n        dp[0][0] = grid[0][0];\n\n        // Первая строка: суммируем только слева\n        for (int j = 1; j < n; j++)\n            dp[0][j] = dp[0][j-1] + grid[0][j];\n\n        // Первый столбец: суммируем только сверху\n        for (int i = 1; i < m; i++)\n            dp[i][0] = dp[i-1][0] + grid[i][0];\n\n        // Остальные клетки: минимум из левой или верхней\n        for (int i = 1; i < m; i++) {\n            for (int j = 1; j < n; j++) {\n                dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + grid[i][j];\n            }\n        }\n        return dp[m-1][n-1];\n    }\n\n    public static void main(String[] args) {\n        int[][] grid = {{1,3,1},{1,5,1},{4,2,1}};\n        System.out.println("Мин сумма пути: " + minPathSum(grid)); // 7\n        // Путь: 1→3→1→1→1 = 7\n    }\n}' },
        { type: 'heading', value: 'Трассировка для сетки 3×3' },
        { type: 'code', language: 'java', value: '// Сетка:          ДП-таблица:\n// 1  3  1          1   4   5\n// 1  5  1    ->    2   7   6\n// 4  2  1          6   8   7\n//\n// dp[0][0]=1, dp[0][1]=1+3=4, dp[0][2]=4+1=5\n// dp[1][0]=1+1=2\n// dp[1][1] = min(dp[0][1], dp[1][0]) + grid[1][1]\n//          = min(4, 2) + 5 = 2 + 5 = 7\n// dp[1][2] = min(dp[0][2], dp[1][1]) + grid[1][2]\n//          = min(5, 7) + 1 = 5 + 1 = 6\n// dp[2][0] = dp[1][0] + 4 = 2 + 4 = 6\n// dp[2][1] = min(dp[1][1], dp[2][0]) + 2\n//          = min(7, 6) + 2 = 6 + 2 = 8\n// dp[2][2] = min(dp[1][2], dp[2][1]) + 1\n//          = min(6, 8) + 1 = 6 + 1 = 7\n//\n// Ответ: 7 (путь 1->3->1->1->1)' },
        { type: 'note', value: 'Обе задачи — Unique Paths и Min Path Sum — решаются одним шаблоном 2D ДП. Инициализируй границы, затем заполни внутренние клетки по формуле.' }
      ]
    },
    {
      id: 3,
      title: 'Редакционное расстояние (Edit Distance)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Редакционное расстояние (алгоритм Левенштейна) — минимальное количество операций (вставка, удаление, замена) для превращения одной строки в другую. Используется в поиске похожих слов, проверке орфографии.' },
        { type: 'tip', value: 'Ты опечатался и написал "котик" вместо "кофик". Автокоррекция должна понять: насколько близки эти слова? Если близко (1-2 операции), наверное опечатка. Редакционное расстояние считает эту "близость"!' },
        { type: 'heading', value: 'Формула ДП' },
        { type: 'text', value: 'dp[i][j] = редакционное расстояние между первыми i символами word1 и j символами word2. Если символы равны: dp[i][j] = dp[i-1][j-1]. Если нет: dp[i][j] = 1 + min(удалить, вставить, заменить) = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).' },
        { type: 'code', language: 'java', value: 'public class EditDistance {\n    public static int minDistance(String word1, String word2) {\n        int m = word1.length(), n = word2.length();\n        int[][] dp = new int[m+1][n+1];\n\n        // Базовые случаи: пустые строки\n        for (int i = 0; i <= m; i++) dp[i][0] = i; // Удалить i символов\n        for (int j = 0; j <= n; j++) dp[0][j] = j; // Вставить j символов\n\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (word1.charAt(i-1) == word2.charAt(j-1)) {\n                    // Символы равны — бесплатно!\n                    dp[i][j] = dp[i-1][j-1];\n                } else {\n                    // Минимум трёх операций + 1\n                    dp[i][j] = 1 + Math.min(dp[i-1][j-1],   // Замена\n                                   Math.min(dp[i-1][j],     // Удаление\n                                            dp[i][j-1]));   // Вставка\n                }\n            }\n        }\n        return dp[m][n];\n    }\n\n    public static void main(String[] args) {\n        System.out.println(minDistance("horse", "ros")); // 3\n        System.out.println(minDistance("intention", "execution")); // 5\n        System.out.println(minDistance("abc", "abc")); // 0\n    }\n}' },
        { type: 'heading', value: 'Визуализация таблицы для "horse" -> "ros"' },
        { type: 'code', language: 'java', value: '//        ""  r  o  s\n//    ""   0  1  2  3\n//    h    1  1  2  3\n//    o    2  2  1  2\n//    r    3  2  2  2\n//    s    4  3  3  2\n//    e    5  4  4  3\n//\n// Читаем ответ: dp[5][3] = 3\n// Операции:\n// horse -> rorse (заменить h на r)\n// rorse -> rose  (удалить r)\n// rose  -> ros   (удалить e)\n// 3 операции!' },
        { type: 'note', value: 'Редакционное расстояние — классика 2D ДП. Время O(m×n), память O(m×n). Оптимизация по памяти: хранить только текущую и предыдущую строки — O(min(m,n)).' }
      ]
    },
    {
      id: 4,
      title: 'Наибольшая общая подпоследовательность (НОП)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Задача НОП (Longest Common Subsequence, LCS): найти наибольшую подпоследовательность, общую для двух строк. Подпоследовательность — элементы в исходном порядке, но не обязательно рядом. Пример: LCS("abcde", "ace") = "ace", длина 3.' },
        { type: 'tip', value: 'Ты и твой друг написали списки любимых фильмов. Что у вас общего? НОП — это самый длинный список фильмов, который встречается у обоих в том же порядке (пусть и с другими фильмами между ними).' },
        { type: 'code', language: 'java', value: 'public class LCS {\n    public static int longestCommonSubsequence(String text1, String text2) {\n        int m = text1.length(), n = text2.length();\n        int[][] dp = new int[m+1][n+1];\n        // dp[0][...] = 0, dp[...][0] = 0 (пустая строка)\n\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (text1.charAt(i-1) == text2.charAt(j-1)) {\n                    // Символы совпали — добавляем к предыдущему LCS\n                    dp[i][j] = dp[i-1][j-1] + 1;\n                } else {\n                    // Не совпали — берём максимум без одного из символов\n                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n                }\n            }\n        }\n        return dp[m][n];\n    }\n\n    // Восстановление самой подпоследовательности\n    public static String findLCS(String text1, String text2) {\n        int m = text1.length(), n = text2.length();\n        int[][] dp = new int[m+1][n+1];\n        for (int i = 1; i <= m; i++)\n            for (int j = 1; j <= n; j++)\n                if (text1.charAt(i-1) == text2.charAt(j-1))\n                    dp[i][j] = dp[i-1][j-1] + 1;\n                else\n                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n\n        // Идём обратно по таблице\n        StringBuilder lcs = new StringBuilder();\n        int i = m, j = n;\n        while (i > 0 && j > 0) {\n            if (text1.charAt(i-1) == text2.charAt(j-1)) {\n                lcs.insert(0, text1.charAt(i-1));\n                i--; j--;\n            } else if (dp[i-1][j] > dp[i][j-1]) {\n                i--;\n            } else {\n                j--;\n            }\n        }\n        return lcs.toString();\n    }\n\n    public static void main(String[] args) {\n        System.out.println(longestCommonSubsequence("abcde", "ace")); // 3\n        System.out.println(findLCS("abcde", "ace")); // "ace"\n        System.out.println(longestCommonSubsequence("abc", "abc")); // 3\n        System.out.println(longestCommonSubsequence("abc", "def")); // 0\n    }\n}' },
        { type: 'heading', value: 'Таблица ДП для "abcde" vs "ace"' },
        { type: 'code', language: 'java', value: '//      ""  a  c  e\n// ""    0  0  0  0\n// a     0  1  1  1\n// b     0  1  1  1\n// c     0  1  2  2\n// d     0  1  2  2\n// e     0  1  2  3  <- ответ\n//\n// Восстановление (обратный ход):\n// dp[5][3]=3, e==e -> берём e, идём [4][2]\n// dp[4][2]=2, d!=c -> max=dp[3][2], идём [3][2]\n// dp[3][2]=2, c==c -> берём c, идём [2][1]\n// dp[2][1]=1, b!=a -> max=dp[1][1], идём [1][1]\n// dp[1][1]=1, a==a -> берём a, идём [0][0]\n// LCS = "ace"' },
        { type: 'note', value: 'LCS используется в diff-инструментах (git diff), биоинформатике для сравнения ДНК, системах версионирования. Время O(m×n), память O(m×n).' }
      ]
    },
    {
      id: 5,
      title: 'Задача о рюкзаке 0/1 (0/1 Knapsack)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Задача о рюкзаке: есть N предметов с весами weights[i] и ценностями values[i]. Рюкзак выдерживает W кг. Какой максимальной ценности вещи можно взять, не превышая лимит? Каждый предмет берётся целиком (0/1 — взять или не взять).' },
        { type: 'tip', value: 'Ты собираешься в поход. Рюкзак выдерживает 5 кг. Перед тобой вещи: палатка (4 кг, нужность 3), еда (3 кг, нужность 4), спальник (2 кг, нужность 2), аптечка (1 кг, нужность 3). Что взять, чтобы максимально пригодилось в походе?' },
        { type: 'heading', value: 'Формула ДП' },
        { type: 'text', value: 'dp[i][w] = максимальная ценность первых i предметов при ёмкости рюкзака w. Либо не берём предмет i: dp[i-1][w]. Либо берём: dp[i-1][w - weights[i]] + values[i] (если хватает места).' },
        { type: 'code', language: 'java', value: 'public class Knapsack01 {\n    public static int knapsack(int[] weights, int[] values, int W) {\n        int n = weights.length;\n        int[][] dp = new int[n+1][W+1];\n        // dp[0][...] = 0 (нет предметов), dp[...][0] = 0 (нет места)\n\n        for (int i = 1; i <= n; i++) {\n            for (int w = 0; w <= W; w++) {\n                // Не берём i-й предмет\n                dp[i][w] = dp[i-1][w];\n\n                // Берём i-й предмет (если влезает)\n                if (weights[i-1] <= w) {\n                    int withItem = dp[i-1][w - weights[i-1]] + values[i-1];\n                    dp[i][w] = Math.max(dp[i][w], withItem);\n                }\n            }\n        }\n        return dp[n][W];\n    }\n\n    public static void main(String[] args) {\n        int[] weights = {1, 3, 4, 5};\n        int[] values  = {1, 4, 5, 7};\n        int W = 7;\n        System.out.println("Макс ценность: " + knapsack(weights, values, W)); // 9\n    }\n}' },
        { type: 'heading', value: 'Трассировка ДП-таблицы' },
        { type: 'code', language: 'java', value: '// weights=[1,3,4,5], values=[1,4,5,7], W=7\n//\n// Предметы: #1(w=1,v=1), #2(w=3,v=4), #3(w=4,v=5), #4(w=5,v=7)\n//\n//       w=0  1  2  3  4  5  6  7\n// i=0:   0   0  0  0  0  0  0  0\n// i=1:   0   1  1  1  1  1  1  1  (предмет 1: w=1,v=1)\n// i=2:   0   1  1  4  5  5  5  5  (предмет 2: w=3,v=4)\n// i=3:   0   1  1  4  5  6  6  9  (предмет 3: w=4,v=5)\n// i=4:   0   1  1  4  5  7  8  9  (предмет 4: w=5,v=7)\n//\n// Ответ: dp[4][7] = 9 (взяли предметы 2+3: 4+5=9, вес 3+4=7)' },
        { type: 'heading', value: 'Восстановление взятых предметов' },
        { type: 'code', language: 'java', value: 'public static void findItems(int[][] dp, int[] weights, int[] values, int W) {\n    int n = weights.length;\n    int w = W;\n    System.out.print("Взятые предметы: ");\n    for (int i = n; i > 0; i--) {\n        if (dp[i][w] != dp[i-1][w]) { // Предмет i был взят\n            System.out.print("предмет" + i + "(w=" + weights[i-1] + ",v=" + values[i-1] + ") ");\n            w -= weights[i-1];\n        }\n    }\n    System.out.println();\n}' },
        { type: 'note', value: 'Время O(n×W), память O(n×W). Оптимизация по памяти до O(W): обходить w от W до weights[i], обновляя одномерный массив dp[w] = max(dp[w], dp[w-weights[i]] + values[i]).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Уникальные пути и минимальная сумма',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй задачи на пути в сетке с визуализацией ДП-таблиц.',
      requirements: [
        'Метод uniquePaths(int m, int n): количество уникальных путей',
        'Метод minPathSum(int[][] grid): минимальная сумма пути',
        'Метод printGrid(int[][] grid): печать 2D массива',
        'Для uniquePaths вывести ДП-таблицу для 3×4',
        'Для minPathSum использовать сетку [[1,3,1],[1,5,1],[4,2,1]] и вывести ДП-таблицу'
      ],
      expectedOutput: 'Unique Paths 3x4:\n1  1  1  1\n1  2  3  4\n1  3  6 10\nОтвет: 10\nMin Path Sum:\nДП-таблица:\n1  4  5\n2  7  6\n6  8  7\nМин путь: 7',
      hint: 'Для uniquePaths: первая строка и столбец — единицы, затем dp[i][j] = dp[i-1][j] + dp[i][j-1]. Для minPathSum: dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]. Не забудь инициализировать края.',
      solution: 'public class GridDP {\n    public static int uniquePaths(int m, int n) {\n        int[][] dp = new int[m][n];\n        for (int j = 0; j < n; j++) dp[0][j] = 1;\n        for (int i = 0; i < m; i++) dp[i][0] = 1;\n        for (int i = 1; i < m; i++)\n            for (int j = 1; j < n; j++)\n                dp[i][j] = dp[i-1][j] + dp[i][j-1];\n        printGrid(dp);\n        return dp[m-1][n-1];\n    }\n\n    public static int minPathSum(int[][] grid) {\n        int m = grid.length, n = grid[0].length;\n        int[][] dp = new int[m][n];\n        dp[0][0] = grid[0][0];\n        for (int j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + grid[0][j];\n        for (int i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + grid[i][0];\n        for (int i = 1; i < m; i++)\n            for (int j = 1; j < n; j++)\n                dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1]) + grid[i][j];\n        printGrid(dp);\n        return dp[m-1][n-1];\n    }\n\n    public static void printGrid(int[][] grid) {\n        for (int[] row : grid) {\n            for (int v : row) System.out.printf("%3d", v);\n            System.out.println();\n        }\n    }\n\n    public static void main(String[] args) {\n        System.out.println("Unique Paths 3x4:");\n        System.out.println("Ответ: " + uniquePaths(3, 4));\n        System.out.println("Min Path Sum:");\n        int[][] grid = {{1,3,1},{1,5,1},{4,2,1}};\n        System.out.println("ДП-таблица:");\n        System.out.println("Мин путь: " + minPathSum(grid));\n    }\n}',
      explanation: 'Оба решения используют один шаблон 2D ДП: инициализируй границы, заполни остальное по формуле. Unique Paths считает суммой (сколько путей), Min Path Sum берёт минимум (лучший путь). Форма таблицы совпадает, меняется только логика перехода.'
    },
    {
      id: 7,
      title: 'Практика: Задача о рюкзаке 0/1',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй полную задачу о рюкзаке с выводом ДП-таблицы и восстановлением ответа.',
      requirements: [
        'Метод knapsack(int[] w, int[] v, int W): возвращает максимальную ценность',
        'Вывести полную ДП-таблицу (строки = предметы, столбцы = ёмкость)',
        'Восстановить и вывести список взятых предметов',
        'Оптимизированная версия с O(W) памятью (одномерный ДП)',
        'Данные: weights=[2,3,4,5], values=[3,4,5,6], W=8'
      ],
      expectedOutput: 'ДП-таблица (строки=предметы, столбцы=ёмкость 0..8):\n0 0 0 0 0 0 0 0 0\n0 0 3 3 3 3 3 3 3\n0 0 3 4 4 7 7 7 7\n0 0 3 4 5 7 8 9 9\n0 0 3 4 5 7 8 9 10\nМакс ценность: 10\nВзятые предметы: предмет4 предмет2\nO(W) версия: 10',
      hint: 'В ДП-таблице строка i соответствует первым i предметам. Для восстановления: идём от dp[n][W], если dp[i][w] != dp[i-1][w] — предмет i взят, уменьшаем w на weights[i-1]. Для O(W) версии: проходи w от W до weights[i] (важно!), иначе предмет может быть взят дважды.',
      solution: 'public class Knapsack {\n    static int[][] dp;\n\n    public static int knapsack(int[] weights, int[] values, int W) {\n        int n = weights.length;\n        dp = new int[n+1][W+1];\n        for (int i = 1; i <= n; i++)\n            for (int w = 0; w <= W; w++) {\n                dp[i][w] = dp[i-1][w];\n                if (weights[i-1] <= w)\n                    dp[i][w] = Math.max(dp[i][w], dp[i-1][w-weights[i-1]] + values[i-1]);\n            }\n        System.out.println("ДП-таблица:");\n        for (int[] row : dp) {\n            for (int v : row) System.out.printf("%2d ", v);\n            System.out.println();\n        }\n        return dp[n][W];\n    }\n\n    public static void findItems(int[] weights, int[] values, int W) {\n        int n = weights.length, w = W;\n        System.out.print("Взятые предметы:");\n        for (int i = n; i > 0; i--)\n            if (dp[i][w] != dp[i-1][w]) {\n                System.out.print(" предмет" + i);\n                w -= weights[i-1];\n            }\n        System.out.println();\n    }\n\n    public static int knapsackOptimized(int[] weights, int[] values, int W) {\n        int[] dpRow = new int[W+1];\n        for (int i = 0; i < weights.length; i++)\n            for (int w = W; w >= weights[i]; w--) // Важно: справа налево!\n                dpRow[w] = Math.max(dpRow[w], dpRow[w - weights[i]] + values[i]);\n        return dpRow[W];\n    }\n\n    public static void main(String[] args) {\n        int[] weights = {2, 3, 4, 5};\n        int[] values  = {3, 4, 5, 6};\n        int W = 8;\n        System.out.println("Макс ценность: " + knapsack(weights, values, W));\n        findItems(weights, values, W);\n        System.out.println("O(W) версия: " + knapsackOptimized(weights, values, W));\n    }\n}',
      explanation: 'Задача о рюкзаке 0/1 — фундаментальная задача комбинаторной оптимизации. Ключевое различие от "дробного рюкзака": нельзя взять часть предмета. Поэтому жадный алгоритм не работает — нужно ДП. Трюк O(W) памяти: обходить w справа налево, чтобы не взять предмет дважды.'
    }
  ]
}
