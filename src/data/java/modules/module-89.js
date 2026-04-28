export default {
  id: 89,
  title: 'Практикум: Backtracking',
  description: 'Практические задачи на backtracking: генерация скобок, перестановки, комбинации, N-Queens, Sudoku Solver.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Generate Parentheses',
      type: 'practice',
      difficulty: 'medium',
      description: 'Сгенерируй все валидные комбинации n пар скобок.',
      requirements: [
        'Используй backtracking с параметрами: текущая строка, open, close',
        'Можно добавить "(" если open < n',
        'Можно добавить ")" если close < open',
        'Базовый случай: длина строки == 2*n'
      ],
      expectedOutput: 'n=3:\n["((()))","(()())","(())()","()(())","()()()"]',
      hint: 'Два правила: 1) Открывающих скобок не больше n. 2) Закрывающих не больше текущего количества открывающих. Это гарантирует валидность.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static List<String> result = new ArrayList<>();

    static void generate(StringBuilder sb, int open, int close, int n) {
        if (sb.length() == 2 * n) {
            result.add(sb.toString());
            return;
        }
        if (open < n) {
            sb.append('(');
            generate(sb, open + 1, close, n);
            sb.deleteCharAt(sb.length() - 1);
        }
        if (close < open) {
            sb.append(')');
            generate(sb, open, close + 1, n);
            sb.deleteCharAt(sb.length() - 1);
        }
    }

    public static void main(String[] args) {
        result.clear();
        generate(new StringBuilder(), 0, 0, 3);
        System.out.println("n=3:");
        System.out.println(result);
    }
}`,
      explanation: 'Backtracking строит валидные скобки посимвольно. Два правила ограничения: 1) "(" добавляется только если open < n (не израсходовали все открывающие). 2) ")" добавляется только если close < open (нельзя закрыть то, что не открыто). deleteCharAt — откат (backtrack) для исследования другой ветви. Генерирует ровно Cn (число Каталана) комбинаций.'
    },
    {
      id: 2,
      title: 'Задача: Permutations',
      type: 'practice',
      difficulty: 'medium',
      description: 'Сгенерируй все перестановки массива уникальных чисел.',
      requirements: [
        'Используй backtracking с массивом boolean[] used',
        'На каждом уровне рекурсии добавляй один неиспользованный элемент',
        'Когда текущая перестановка полна — добавь в результат',
        'Откатывай: удали последний элемент и пометь как неиспользованный'
      ],
      expectedOutput: 'nums=[1,2,3]\nПерестановки: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',
      hint: 'used[i] = true означает, что nums[i] уже в текущей перестановке. При возврате: used[i] = false и удалить из списка.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static List<List<Integer>> result = new ArrayList<>();

    static void permute(int[] nums, List<Integer> current, boolean[] used) {
        if (current.size() == nums.length) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            current.add(nums[i]);
            permute(nums, current, used);
            current.remove(current.size() - 1);
            used[i] = false;
        }
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        result.clear();
        permute(nums, new ArrayList<>(), new boolean[nums.length]);
        System.out.println("nums=[1,2,3]");
        System.out.println("Перестановки: " + result);
    }
}`,
      explanation: 'Перестановки генерируются выбором каждого неиспользованного элемента на каждую позицию. used[] отслеживает, какие элементы уже в текущей перестановке. На каждом уровне рекурсии n-k выборов (k — глубина). При возврате — откатываем выбор. new ArrayList<>(current) создаёт копию, иначе все ссылки указывали бы на один изменяемый список. Всего n! перестановок.'
    },
    {
      id: 3,
      title: 'Задача: Combinations',
      type: 'practice',
      difficulty: 'medium',
      description: 'Сгенерируй все комбинации k чисел из диапазона [1, n].',
      requirements: [
        'Backtracking с параметром start — минимальный доступный номер',
        'На каждом шаге выбирай число >= start',
        'Когда current.size() == k — добавь в результат',
        'Оптимизация: если осталось недостаточно чисел — обрежь ветвь'
      ],
      expectedOutput: 'n=4, k=2:\n[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]',
      hint: 'for i from start to n: добавь i, рекурсия(start=i+1), удали i. Прунинг: if (n - i + 1 < k - current.size()) break;',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static List<List<Integer>> result = new ArrayList<>();

    static void combine(int n, int k, int start, List<Integer> current) {
        if (current.size() == k) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int i = start; i <= n - (k - current.size()) + 1; i++) {
            current.add(i);
            combine(n, k, i + 1, current);
            current.remove(current.size() - 1);
        }
    }

    public static void main(String[] args) {
        result.clear();
        combine(4, 2, 1, new ArrayList<>());
        System.out.println("n=4, k=2:");
        System.out.println(result);
    }
}`,
      explanation: 'Комбинации отличаются от перестановок: порядок не важен. Параметр start гарантирует, что мы выбираем только возрастающие последовательности (избегая дубликатов). Прунинг (обрезка): i <= n - (k - current.size()) + 1 — если осталось недостаточно чисел для заполнения комбинации, ветвь отсекается. Это значительно ускоряет алгоритм.'
    },
    {
      id: 4,
      title: 'Задача: Subsets',
      type: 'practice',
      difficulty: 'medium',
      description: 'Сгенерируй все подмножества массива (power set) с помощью backtracking.',
      requirements: [
        'Backtracking: на каждом уровне решай — включить или не включить текущий элемент',
        'Добавляй текущее подмножество в результат на каждом шаге (не только в конце)',
        'Параметр start для избежания дубликатов',
        'Сравни с битовой маской из Module 85'
      ],
      expectedOutput: 'nums=[1,2,3]\nПодмножества: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]',
      hint: 'Отличие от Combinations: добавляем текущий список в результат ПЕРЕД рекурсией (каждое промежуточное состояние — валидное подмножество).',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static List<List<Integer>> result = new ArrayList<>();

    static void backtrack(int[] nums, int start, List<Integer> current) {
        result.add(new ArrayList<>(current));
        for (int i = start; i < nums.length; i++) {
            current.add(nums[i]);
            backtrack(nums, i + 1, current);
            current.remove(current.size() - 1);
        }
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3};
        result.clear();
        backtrack(nums, 0, new ArrayList<>());
        System.out.println("nums=[1,2,3]");
        System.out.println("Подмножества: " + result);
    }
}`,
      explanation: 'Subsets через backtracking: на каждом уровне рекурсии добавляем текущее состояние в результат (включая пустое множество). Затем для каждого элемента начиная с start: добавляем его и рекурсивно строим подмножества из оставшихся элементов. start = i + 1 гарантирует отсутствие дубликатов. Итого 2^n подмножеств — каждый элемент или включён, или нет.'
    },
    {
      id: 5,
      title: 'Задача: Letter Combinations of a Phone Number',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка цифр (2-9). Верни все буквенные комбинации, которые можно набрать на телефоне (как T9).',
      requirements: [
        'Создай маппинг цифра → буквы (2→abc, 3→def, ...)',
        'Backtracking: для каждой цифры перебирай все её буквы',
        'Добавляй букву в текущую комбинацию и рекурсивно обработай следующую цифру',
        'Базовый случай: индекс == длина digits'
      ],
      expectedOutput: 'digits="23"\nКомбинации: ["ad","ae","af","bd","be","bf","cd","ce","cf"]',
      hint: 'Map: {"2":"abc","3":"def","4":"ghi","5":"jkl","6":"mno","7":"pqrs","8":"tuv","9":"wxyz"}. Для каждой цифры перебирай её буквы.',
      solution: `import java.util.*;

public class Main {
    static String[] mapping = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    static List<String> result = new ArrayList<>();

    static void backtrack(String digits, int index, StringBuilder current) {
        if (index == digits.length()) {
            result.add(current.toString());
            return;
        }
        String letters = mapping[digits.charAt(index) - '0'];
        for (char c : letters.toCharArray()) {
            current.append(c);
            backtrack(digits, index + 1, current);
            current.deleteCharAt(current.length() - 1);
        }
    }

    public static void main(String[] args) {
        String digits = "23";
        result.clear();
        if (!digits.isEmpty()) {
            backtrack(digits, 0, new StringBuilder());
        }
        System.out.println("digits=\\"23\\"");
        System.out.println("Комбинации: " + result);
    }
}`,
      explanation: 'Каждая цифра даёт 3-4 варианта буквы. Backtracking перебирает все комбинации: для первой цифры выбираем букву, затем рекурсивно для следующей. Дерево решений: корень → буквы первой цифры → для каждой → буквы второй цифры → ... Количество комбинаций = произведение количеств букв для каждой цифры (3^n или 4^n).'
    },
    {
      id: 6,
      title: 'Задача: N-Queens',
      type: 'practice',
      difficulty: 'hard',
      description: 'Размести n ферзей на доске n×n так, чтобы ни один ферзь не атаковал другого. Найди все решения.',
      requirements: [
        'Используй backtracking: размещай ферзей по одному на каждой строке',
        'Проверяй конфликты: столбцы, главная и побочная диагонали',
        'Используй Set для отслеживания занятых столбцов и диагоналей',
        'Выведи количество решений и одно из них'
      ],
      expectedOutput: 'n=4: найдено 2 решения\nОдно из решений:\n. Q . .\n. . . Q\nQ . . .\n. . Q .',
      hint: 'Три Set: cols, diag1 (row-col), diag2 (row+col). Если ни один Set не содержит текущую позицию — можно ставить. При откате — удаляй из Set.',
      solution: `import java.util.*;

public class Main {
    static List<List<String>> results = new ArrayList<>();

    static void solve(int n, int row, int[] queens, Set<Integer> cols,
                      Set<Integer> diag1, Set<Integer> diag2) {
        if (row == n) {
            List<String> board = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                char[] rowArr = new char[n];
                Arrays.fill(rowArr, '.');
                rowArr[queens[i]] = 'Q';
                board.add(new String(rowArr));
            }
            results.add(board);
            return;
        }
        for (int col = 0; col < n; col++) {
            if (cols.contains(col) || diag1.contains(row - col) || diag2.contains(row + col))
                continue;
            queens[row] = col;
            cols.add(col);
            diag1.add(row - col);
            diag2.add(row + col);
            solve(n, row + 1, queens, cols, diag1, diag2);
            cols.remove(col);
            diag1.remove(row - col);
            diag2.remove(row + col);
        }
    }

    public static void main(String[] args) {
        int n = 4;
        results.clear();
        solve(n, 0, new int[n], new HashSet<>(), new HashSet<>(), new HashSet<>());

        System.out.println("n=" + n + ": найдено " + results.size() + " решения");
        System.out.println("Одно из решений:");
        for (String row : results.get(0)) {
            System.out.println(row.replace("", " ").trim());
        }
    }
}`,
      explanation: 'N-Queens — классическая задача backtracking. Ставим по одному ферзю на каждую строку, проверяя три ограничения: столбец (cols), главная диагональ (row-col одинаков), побочная диагональ (row+col одинаков). Set обеспечивает O(1) проверку. При невозможности поставить ферзя — откатываемся. Для n=8 существует 92 решения.'
    },
    {
      id: 7,
      title: 'Задача: Sudoku Solver',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реши головоломку Судоку. Заполни пустые клетки (обозначены ".") цифрами 1-9 так, чтобы в каждой строке, столбце и блоке 3×3 все цифры были уникальны.',
      requirements: [
        'Backtracking: для каждой пустой клетки пробуй цифры 1-9',
        'Проверяй валидность: строка, столбец, блок 3×3',
        'Если нашёл невалидную конфигурацию — откат',
        'Используй Set или boolean[][] для быстрой проверки'
      ],
      expectedOutput: 'Судоку решено!\n5 3 4 | 6 7 8 | 9 1 2\n6 7 2 | 1 9 5 | 3 4 8\n1 9 8 | 3 4 2 | 5 6 7\n------+-------+------\n8 5 9 | 7 6 1 | 4 2 3\n4 2 6 | 8 5 3 | 7 9 1\n7 1 3 | 9 2 4 | 8 5 6\n------+-------+------\n9 6 1 | 5 3 7 | 2 8 4\n2 8 7 | 4 1 9 | 6 3 5\n3 4 5 | 2 8 6 | 1 7 9',
      hint: 'isValid(board, row, col, num): проверь строку, столбец и блок 3×3 (начало блока: row/3*3, col/3*3). Перебирай пустые клетки последовательно.',
      solution: `public class Main {
    static boolean isValid(char[][] board, int row, int col, char num) {
        for (int i = 0; i < 9; i++) {
            if (board[row][i] == num) return false;
            if (board[i][col] == num) return false;
            int r = 3 * (row / 3) + i / 3;
            int c = 3 * (col / 3) + i % 3;
            if (board[r][c] == num) return false;
        }
        return true;
    }

    static boolean solve(char[][] board) {
        for (int row = 0; row < 9; row++) {
            for (int col = 0; col < 9; col++) {
                if (board[row][col] != '.') continue;
                for (char num = '1'; num <= '9'; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solve(board)) return true;
                        board[row][col] = '.';
                    }
                }
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        char[][] board = {
            {'5','3','.','.','7','.','.','.','.'},
            {'6','.','.','1','9','5','.','.','.'},
            {'.','9','8','.','.','.','.','6','.'},
            {'8','.','.','.','6','.','.','.','3'},
            {'4','.','.','8','.','3','.','.','1'},
            {'7','.','.','.','2','.','.','.','6'},
            {'.','6','.','.','.','.','2','8','.'},
            {'.','.','.','4','1','9','.','.','5'},
            {'.','.','.','.','8','.','.','7','9'}
        };

        if (solve(board)) {
            System.out.println("Судоку решено!");
            for (int i = 0; i < 9; i++) {
                StringBuilder sb = new StringBuilder();
                for (int j = 0; j < 9; j++) {
                    if (j == 3 || j == 6) sb.append("| ");
                    sb.append(board[i][j]).append(" ");
                }
                System.out.println(sb.toString().trim());
                if (i == 2 || i == 5) System.out.println("------+-------+------");
            }
        }
    }
}`,
      explanation: 'Sudoku Solver — классический пример backtracking с ограничениями. Для каждой пустой клетки пробуем цифры 1-9, проверяя три правила: уникальность в строке, столбце и блоке 3×3. Блок определяется: row/3*3 и col/3*3. Если ни одна цифра не подходит — возвращаем false (backtrack). Рекурсия гарантирует нахождение решения, если оно существует.'
    },
    {
      id: 8,
      title: 'Задача: Word Search',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана матрица символов и слово. Определи, можно ли найти слово, двигаясь по горизонтали и вертикали (каждая клетка используется один раз).',
      requirements: [
        'Для каждой клетки матрицы попробуй начать поиск слова',
        'DFS/Backtracking: если текущий символ совпадает — продолжи к соседям',
        'Помечай посещённые клетки (например, заменяя на "#")',
        'При откате — восстанавливай символ'
      ],
      expectedOutput: 'board:\nA B C E\nS F C S\nA D E E\nword="ABCCED": true\nword="SEE": true\nword="ABCB": false',
      hint: 'DFS(row, col, index): если index == word.length → true. Проверь границы, совпадение символа. Пометь клетку, рекурсия для 4 соседей, восстанови клетку.',
      solution: `public class Main {
    static char[][] board;
    static int rows, cols;

    static boolean search(int r, int c, String word, int index) {
        if (index == word.length()) return true;
        if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
        if (board[r][c] != word.charAt(index)) return false;

        char temp = board[r][c];
        board[r][c] = '#';

        boolean found = search(r + 1, c, word, index + 1)
            || search(r - 1, c, word, index + 1)
            || search(r, c + 1, word, index + 1)
            || search(r, c - 1, word, index + 1);

        board[r][c] = temp;
        return found;
    }

    static boolean exist(String word) {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (search(i, j, word, 0)) return true;
            }
        }
        return false;
    }

    public static void main(String[] args) {
        board = new char[][]{
            {'A', 'B', 'C', 'E'},
            {'S', 'F', 'C', 'S'},
            {'A', 'D', 'E', 'E'}
        };
        rows = board.length;
        cols = board[0].length;

        System.out.println("board:");
        for (char[] row : board) System.out.println(new String(row).replace("", " ").trim());
        System.out.println("word=\\"ABCCED\\": " + exist("ABCCED"));

        board = new char[][]{{'A','B','C','E'},{'S','F','C','S'},{'A','D','E','E'}};
        System.out.println("word=\\"SEE\\": " + exist("SEE"));

        board = new char[][]{{'A','B','C','E'},{'S','F','C','S'},{'A','D','E','E'}};
        System.out.println("word=\\"ABCB\\": " + exist("ABCB"));
    }
}`,
      explanation: 'Word Search — backtracking на 2D сетке. Для каждой стартовой клетки запускаем DFS, сравнивая символы с буквами слова. Замена на "#" предотвращает повторное использование клетки в одном пути. После возврата восстанавливаем символ — это позволяет использовать клетку в других путях. "ABCB" → false, потому что B нельзя использовать дважды.'
    },
    {
      id: 9,
      title: 'Задача: Combination Sum',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив уникальных чисел и target. Найди все уникальные комбинации, где сумма == target. Числа можно использовать повторно.',
      requirements: [
        'Backtracking с параметром start и оставшейся суммой',
        'Числа можно использовать повторно: рекурсия с тем же start (не i+1)',
        'Если remaining == 0 — добавь комбинацию',
        'Если remaining < 0 — обрежь ветвь'
      ],
      expectedOutput: 'candidates=[2,3,6,7], target=7\nКомбинации: [[2,2,3],[7]]',
      hint: 'При рекурсии передавай start=i (не i+1), чтобы разрешить повторное использование. Это отличие от обычных комбинаций.',
      solution: `import java.util.*;

public class Main {
    static List<List<Integer>> result = new ArrayList<>();

    static void backtrack(int[] candidates, int target, int start, List<Integer> current) {
        if (target == 0) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int i = start; i < candidates.length; i++) {
            if (candidates[i] > target) continue;
            current.add(candidates[i]);
            backtrack(candidates, target - candidates[i], i, current);
            current.remove(current.size() - 1);
        }
    }

    public static void main(String[] args) {
        int[] candidates = {2, 3, 6, 7};
        result.clear();
        backtrack(candidates, 7, 0, new ArrayList<>());
        System.out.println("candidates=[2,3,6,7], target=7");
        System.out.println("Комбинации: " + result);
    }
}`,
      explanation: 'Combination Sum разрешает повторное использование чисел. Ключевое отличие: рекурсия с start=i (а не i+1). Это позволяет взять элемент снова. target уменьшается на каждом шаге. Если target == 0 — нашли комбинацию. Если candidates[i] > target — пропускаем (прунинг). Start предотвращает дубликаты типа [2,3] и [3,2].'
    },
    {
      id: 10,
      title: 'Задача: Palindrome Partitioning',
      type: 'practice',
      difficulty: 'medium',
      description: 'Разбей строку на подстроки так, чтобы каждая подстрока была палиндромом. Найди все возможные разбиения.',
      requirements: [
        'Backtracking: для каждой позиции пробуй все возможные палиндромные префиксы',
        'Функция isPalindrome(s, start, end) для проверки',
        'Если дошли до конца строки — добавить разбиение в результат',
        'Откат: удалить последнюю подстроку'
      ],
      expectedOutput: 's="aab"\nРазбиения: [["a","a","b"],["aa","b"]]',
      hint: 'Для каждого начала: пробуй все длины подстрок. Если подстрока — палиндром, добавь её и рекурсивно разбей остаток.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static List<List<String>> result = new ArrayList<>();

    static boolean isPalindrome(String s, int left, int right) {
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }
        return true;
    }

    static void backtrack(String s, int start, List<String> current) {
        if (start == s.length()) {
            result.add(new ArrayList<>(current));
            return;
        }
        for (int end = start; end < s.length(); end++) {
            if (isPalindrome(s, start, end)) {
                current.add(s.substring(start, end + 1));
                backtrack(s, end + 1, current);
                current.remove(current.size() - 1);
            }
        }
    }

    public static void main(String[] args) {
        String s = "aab";
        result.clear();
        backtrack(s, 0, new ArrayList<>());
        System.out.println("s=\\"aab\\"");
        System.out.println("Разбиения: " + result);
    }
}`,
      explanation: 'Palindrome Partitioning — комбинация backtracking и проверки палиндромов. Для каждой позиции start пробуем все end >= start. Если s[start..end] — палиндром, добавляем его и рекурсивно разбиваем остаток s[end+1..]. Дерево решений: каждая ветвь — выбор длины следующей палиндромной подстроки. Можно оптимизировать предвычислением палиндромов через DP.'
    }
  ]
}
