export default {
  id: 42,
  title: 'Практикум: Backtracking',
  description: 'Десять задач на перебор с возвратом: подмножества, перестановки, комбинации, поиск в сетке, N-Queens и Sudoku.',
  lessons: [
    {
      id: 1,
      title: 'Subsets (LeetCode #78)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив уникальных целых чисел nums. Верни все возможные подмножества (power set). Решение не должно содержать дубликатов.\n\nПример:\n  nums = [1,2,3]\n  Ответ: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]',
      requirements: [
        'Метод List<List<Integer>> subsets(int[] nums)',
        'Используй backtracking: на каждом шаге выбирай — включить элемент или нет',
        'Каждая рекурсивная ветка добавляет текущее подмножество в результат',
        'Всего 2^n подмножеств'
      ],
      expectedOutput: 'Input: nums=[1,2,3]\nOutput: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]',
      hint: 'Backtracking: на каждом уровне перебирай элементы начиная с индекса start. Добавь элемент → рекурсия → удали элемент (откат). Добавляй текущий path в результат на каждом шаге.',
      solution: `class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, int start, List<Integer> path,
                           List<List<Integer>> result) {
        result.add(new ArrayList<>(path)); // добавляем копию текущего подмножества

        for (int i = start; i < nums.length; i++) {
            path.add(nums[i]);             // выбираем
            backtrack(nums, i + 1, path, result); // рекурсия
            path.remove(path.size() - 1);  // откат
        }
    }
}`,
      explanation: 'Backtracking с параметром start для избежания дубликатов. На каждом уровне рекурсии добавляем текущее подмножество в результат, затем перебираем оставшиеся элементы. Время: O(n * 2^n) — генерация 2^n подмножеств, копирование каждого за O(n). Память: O(n) глубина рекурсии.'
    },
    {
      id: 2,
      title: 'Permutations (LeetCode #46)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив уникальных целых чисел nums. Верни все возможные перестановки.\n\nПример:\n  nums = [1,2,3]\n  Ответ: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',
      requirements: [
        'Метод List<List<Integer>> permute(int[] nums)',
        'Используй backtracking с отслеживанием использованных элементов',
        'Каждая перестановка содержит все n элементов ровно по одному разу',
        'Всего n! перестановок'
      ],
      expectedOutput: 'Input: nums=[1,2,3]\nOutput: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',
      hint: 'Используй boolean[] used для отслеживания уже включённых элементов. На каждом шаге перебирай все неиспользованные элементы. Когда path.size() == nums.length — добавляй в результат.',
      solution: `class Solution {
    public List<List<Integer>> permute(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(nums, new boolean[nums.length], new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] nums, boolean[] used, List<Integer> path,
                           List<List<Integer>> result) {
        if (path.size() == nums.length) {
            result.add(new ArrayList<>(path));
            return;
        }

        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            used[i] = true;
            path.add(nums[i]);
            backtrack(nums, used, path, result);
            path.remove(path.size() - 1);
            used[i] = false;
        }
    }
}`,
      explanation: 'Backtracking с массивом used[]. На каждом шаге перебираем все элементы; если элемент не использован — добавляем, рекурсия, откат. Когда path содержит все n элементов — это полная перестановка. Время: O(n * n!), память: O(n).'
    },
    {
      id: 3,
      title: 'Combination Sum (LeetCode #39)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив уникальных чисел candidates и целое число target. Найди все уникальные комбинации чисел из candidates, дающие в сумме target. Каждое число можно использовать неограниченное количество раз.\n\nПример:\n  candidates = [2,3,6,7], target = 7\n  Ответ: [[2,2,3],[7]]',
      requirements: [
        'Метод List<List<Integer>> combinationSum(int[] candidates, int target)',
        'Элемент может использоваться многократно',
        'Комбинации не должны повторяться',
        'Используй backtracking с отсечением при превышении target'
      ],
      expectedOutput: 'Input: candidates=[2,3,6,7], target=7\nOutput: [[2,2,3],[7]]',
      hint: 'Backtracking: на каждом шаге можешь взять текущий элемент ещё раз (рекурсия с тем же индексом) или перейти к следующему. Отсекай ветки, где сумма > target. Отсортируй массив для раннего выхода.',
      solution: `class Solution {
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        List<List<Integer>> result = new ArrayList<>();
        Arrays.sort(candidates);
        backtrack(candidates, target, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int[] candidates, int remain, int start,
                           List<Integer> path, List<List<Integer>> result) {
        if (remain == 0) {
            result.add(new ArrayList<>(path));
            return;
        }

        for (int i = start; i < candidates.length; i++) {
            if (candidates[i] > remain) break; // отсечение
            path.add(candidates[i]);
            backtrack(candidates, remain - candidates[i], i, path, result);
            path.remove(path.size() - 1);
        }
    }
}`,
      explanation: 'Backtracking с параметром start (чтобы избежать дубликатов) и передачей remain (остаток суммы). Ключевое отличие: рекурсия с тем же индексом i (допускается повторное использование). Сортировка позволяет рано отсекать ветки. Время: O(N^(T/M)), где T — target, M — минимальный элемент.'
    },
    {
      id: 4,
      title: 'Letter Combinations of a Phone Number (LeetCode #17)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка digits, содержащая цифры 2-9. Верни все возможные буквенные комбинации, которые можно набрать (как на кнопочном телефоне).\n\n  2→abc, 3→def, 4→ghi, 5→jkl, 6→mno, 7→pqrs, 8→tuv, 9→wxyz\n\nПример:\n  digits = "23"\n  Ответ: ["ad","ae","af","bd","be","bf","cd","ce","cf"]',
      requirements: [
        'Метод List<String> letterCombinations(String digits)',
        'Используй маппинг цифр → буквы',
        'Backtracking: для каждой цифры перебирай все её буквы',
        'Обработай пустой ввод'
      ],
      expectedOutput: 'Input: digits="23"\nOutput: ["ad","ae","af","bd","be","bf","cd","ce","cf"]',
      hint: 'Создай маппинг: String[] map = {"","","abc","def","ghi","jkl","mno","pqrs","tuv","wxyz"}. Backtracking по индексу цифры: для каждой буквы текущей цифры — добавь и рекурсия к следующей цифре.',
      solution: `class Solution {
    private String[] mapping = {
        "", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"
    };

    public List<String> letterCombinations(String digits) {
        List<String> result = new ArrayList<>();
        if (digits == null || digits.isEmpty()) return result;
        backtrack(digits, 0, new StringBuilder(), result);
        return result;
    }

    private void backtrack(String digits, int index, StringBuilder sb,
                           List<String> result) {
        if (index == digits.length()) {
            result.add(sb.toString());
            return;
        }

        String letters = mapping[digits.charAt(index) - '0'];
        for (char c : letters.toCharArray()) {
            sb.append(c);
            backtrack(digits, index + 1, sb, result);
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}`,
      explanation: 'Backtracking по индексу цифры. Для каждой цифры перебираем все соответствующие буквы, добавляем в StringBuilder, рекурсивно обрабатываем следующую цифру, откатываем. Время: O(4^n * n), где n — длина digits (максимум 4 буквы на цифру). Память: O(n).'
    },
    {
      id: 5,
      title: 'Word Search (LeetCode #79)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана сетка m x n из букв и слово word. Определи, можно ли найти word в сетке, двигаясь по соседним клеткам (вверх, вниз, влево, вправо). Каждая клетка используется не более одного раза.\n\nПример:\n  board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n  word = "ABCCED" → true\n  word = "SEE" → true\n  word = "ABCB" → false',
      requirements: [
        'Метод boolean exist(char[][] board, String word)',
        'DFS/Backtracking от каждой клетки, совпадающей с первой буквой',
        'Помечай посещённые клетки, чтобы не использовать повторно',
        'Восстанавливай клетку после отката (backtracking)'
      ],
      expectedOutput: 'Input: board=[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word="ABCCED"\nOutput: true',
      hint: 'Для каждой клетки (i,j), если board[i][j] == word[0] — запусти DFS. В DFS: помечай клетку (например \'#\'), проверяй 4 соседей, откатывай. Если индекс == word.length — слово найдено.',
      solution: `class Solution {
    public boolean exist(char[][] board, String word) {
        int m = board.length, n = board[0].length;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (dfs(board, word, i, j, 0)) return true;
            }
        }
        return false;
    }

    private boolean dfs(char[][] board, String word, int i, int j, int k) {
        if (k == word.length()) return true;
        if (i < 0 || i >= board.length || j < 0 || j >= board[0].length
                || board[i][j] != word.charAt(k)) {
            return false;
        }

        char temp = board[i][j];
        board[i][j] = '#'; // помечаем

        boolean found = dfs(board, word, i + 1, j, k + 1)
                     || dfs(board, word, i - 1, j, k + 1)
                     || dfs(board, word, i, j + 1, k + 1)
                     || dfs(board, word, i, j - 1, k + 1);

        board[i][j] = temp; // откат
        return found;
    }
}`,
      explanation: 'Backtracking на сетке: для каждой стартовой клетки запускаем DFS. Помечаем клетку символом \'#\' для предотвращения повторного посещения, после рекурсии восстанавливаем. Время: O(m * n * 4^L), где L — длина слова. Память: O(L) — глубина рекурсии.'
    },
    {
      id: 6,
      title: 'Palindrome Partitioning (LeetCode #131)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s. Раздели её на все возможные наборы подстрок, где каждая подстрока — палиндром.\n\nПример:\n  s = "aab"\n  Ответ: [["a","a","b"],["aa","b"]]',
      requirements: [
        'Метод List<List<String>> partition(String s)',
        'Backtracking: на каждом шаге выбирай подстроку-палиндром',
        'Проверяй, является ли подстрока палиндромом',
        'Когда дошёл до конца строки — добавь разбиение в результат'
      ],
      expectedOutput: 'Input: s="aab"\nOutput: [["a","a","b"],["aa","b"]]',
      hint: 'Backtracking: на каждом шаге перебирай длину подстроки от start до конца. Если подстрока s[start..i] — палиндром — добавь и рекурсия от i+1. Палиндром проверяй двумя указателями.',
      solution: `class Solution {
    public List<List<String>> partition(String s) {
        List<List<String>> result = new ArrayList<>();
        backtrack(s, 0, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(String s, int start, List<String> path,
                           List<List<String>> result) {
        if (start == s.length()) {
            result.add(new ArrayList<>(path));
            return;
        }

        for (int end = start; end < s.length(); end++) {
            if (isPalindrome(s, start, end)) {
                path.add(s.substring(start, end + 1));
                backtrack(s, end + 1, path, result);
                path.remove(path.size() - 1);
            }
        }
    }

    private boolean isPalindrome(String s, int left, int right) {
        while (left < right) {
            if (s.charAt(left++) != s.charAt(right--)) return false;
        }
        return true;
    }
}`,
      explanation: 'Backtracking: на каждом шаге перебираем все подстроки начиная с позиции start. Если подстрока — палиндром, добавляем и рекурсивно разбиваем остаток. Время: O(n * 2^n) в худшем случае. Можно оптимизировать проверку палиндромов через DP-предвычисление.'
    },
    {
      id: 7,
      title: 'N-Queens (LeetCode #51)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Размести n ферзей на шахматной доске n x n так, чтобы никакие два ферзя не атаковали друг друга (не стояли на одной строке, столбце или диагонали). Верни все решения.\n\nПример:\n  n = 4\n  Ответ: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]',
      requirements: [
        'Метод List<List<String>> solveNQueens(int n)',
        'Backtracking: размещай ферзей построчно',
        'Проверяй столбцы и обе диагонали с помощью Set или массивов',
        'Генерируй строковое представление доски для каждого решения'
      ],
      expectedOutput: 'Input: n=4\nOutput: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]',
      hint: 'Размещай ферзя в каждой строке по очереди. Используй три Set: columns, diag1 (row-col), diag2 (row+col) для быстрой проверки конфликтов за O(1).',
      solution: `class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> result = new ArrayList<>();
        char[][] board = new char[n][n];
        for (char[] row : board) Arrays.fill(row, '.');
        backtrack(board, 0, new HashSet<>(), new HashSet<>(),
                  new HashSet<>(), result);
        return result;
    }

    private void backtrack(char[][] board, int row, Set<Integer> cols,
                           Set<Integer> diag1, Set<Integer> diag2,
                           List<List<String>> result) {
        int n = board.length;
        if (row == n) {
            List<String> snapshot = new ArrayList<>();
            for (char[] r : board) snapshot.add(new String(r));
            result.add(snapshot);
            return;
        }

        for (int col = 0; col < n; col++) {
            int d1 = row - col, d2 = row + col;
            if (cols.contains(col) || diag1.contains(d1)
                    || diag2.contains(d2)) {
                continue;
            }

            board[row][col] = 'Q';
            cols.add(col);
            diag1.add(d1);
            diag2.add(d2);

            backtrack(board, row + 1, cols, diag1, diag2, result);

            board[row][col] = '.';
            cols.remove(col);
            diag1.remove(d1);
            diag2.remove(d2);
        }
    }
}`,
      explanation: 'Backtracking построчно: в каждой строке пробуем поставить ферзя в каждый столбец. Три множества (cols, diag1=row-col, diag2=row+col) обеспечивают O(1) проверку конфликтов. Время: O(n!), память: O(n^2).'
    },
    {
      id: 8,
      title: 'Generate Parentheses (LeetCode #22)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дано число n. Сгенерируй все комбинации из n пар корректных скобок.\n\nПример:\n  n = 3\n  Ответ: ["((()))","(()())","(())()","()(())","()()()"]',
      requirements: [
        'Метод List<String> generateParenthesis(int n)',
        'Backtracking: отслеживай количество открытых и закрытых скобок',
        'Открытую скобку можно добавить, если open < n',
        'Закрытую — если close < open'
      ],
      expectedOutput: 'Input: n=3\nOutput: ["((()))","(()())","(())()","()(())","()()()"]',
      hint: 'Два счётчика: open и close. Добавь \'(\' если open < n. Добавь \')\' если close < open. Когда длина строки == 2*n — добавь в результат.',
      solution: `class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        backtrack(n, 0, 0, new StringBuilder(), result);
        return result;
    }

    private void backtrack(int n, int open, int close, StringBuilder sb,
                           List<String> result) {
        if (sb.length() == 2 * n) {
            result.add(sb.toString());
            return;
        }

        if (open < n) {
            sb.append('(');
            backtrack(n, open + 1, close, sb, result);
            sb.deleteCharAt(sb.length() - 1);
        }
        if (close < open) {
            sb.append(')');
            backtrack(n, open, close + 1, sb, result);
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}`,
      explanation: 'Backtracking с двумя счётчиками: open (количество открывающих) и close (количество закрывающих). Добавляем \'(\' если open < n, \')\' если close < open — это гарантирует валидность. Время: O(4^n / sqrt(n)) — n-е число Каталана. Память: O(n).'
    },
    {
      id: 9,
      title: 'Sudoku Solver (LeetCode #37)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реши головоломку Судоку. Заполни пустые клетки (\'.\') цифрами 1-9 так, чтобы каждая строка, столбец и блок 3x3 содержали цифры 1-9 без повторений.\n\nПример:\n  Входная доска с пустыми клетками → заполненная доска',
      requirements: [
        'Метод void solveSudoku(char[][] board) — модифицирует board in-place',
        'Backtracking: для каждой пустой клетки пробуй цифры 1-9',
        'Проверяй валидность: строка, столбец и блок 3x3',
        'При невозможности — откатывай и пробуй следующую цифру'
      ],
      expectedOutput: 'Input: частично заполненная доска Судоку\nOutput: полностью заполненная доска Судоку',
      hint: 'Найди первую пустую клетку. Для каждой цифры \'1\'-\'9\': если валидна — поставь и рекурсия. Если рекурсия вернула false — откатывай (ставь \'.\' обратно). Проверяй строку, столбец и блок 3x3.',
      solution: `class Solution {
    public void solveSudoku(char[][] board) {
        solve(board);
    }

    private boolean solve(char[][] board) {
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] != '.') continue;

                for (char c = '1'; c <= '9'; c++) {
                    if (isValid(board, i, j, c)) {
                        board[i][j] = c;
                        if (solve(board)) return true;
                        board[i][j] = '.'; // откат
                    }
                }
                return false; // ни одна цифра не подошла
            }
        }
        return true; // все клетки заполнены
    }

    private boolean isValid(char[][] board, int row, int col, char c) {
        int boxRow = 3 * (row / 3), boxCol = 3 * (col / 3);
        for (int i = 0; i < 9; i++) {
            if (board[row][i] == c) return false;          // строка
            if (board[i][col] == c) return false;          // столбец
            if (board[boxRow + i / 3][boxCol + i % 3] == c) return false; // блок
        }
        return true;
    }
}`,
      explanation: 'Backtracking: для каждой пустой клетки пробуем цифры 1-9. Проверяем валидность (строка, столбец, блок 3x3). Если рекурсия не нашла решения — откатываем. Время: O(9^m), где m — число пустых клеток (в худшем случае). На практике отсечения ускоряют значительно.'
    },
    {
      id: 10,
      title: 'Combinations (LeetCode #77)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Даны два целых числа n и k. Верни все возможные комбинации из k чисел, выбранных из диапазона [1, n].\n\nПример:\n  n = 4, k = 2\n  Ответ: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]',
      requirements: [
        'Метод List<List<Integer>> combine(int n, int k)',
        'Backtracking с параметром start для избежания дубликатов',
        'Когда path.size() == k — добавляй в результат',
        'Оптимизация: отсекай ветки, если оставшихся элементов не хватит'
      ],
      expectedOutput: 'Input: n=4, k=2\nOutput: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]',
      hint: 'Backtracking: перебирай числа от start до n. Добавь число → рекурсия (start = i+1) → откат. Оптимизация: цикл до n-(k-path.size())+1, чтобы оставшихся элементов хватило для заполнения.',
      solution: `class Solution {
    public List<List<Integer>> combine(int n, int k) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(n, k, 1, new ArrayList<>(), result);
        return result;
    }

    private void backtrack(int n, int k, int start, List<Integer> path,
                           List<List<Integer>> result) {
        if (path.size() == k) {
            result.add(new ArrayList<>(path));
            return;
        }

        // Оптимизация: нужно ещё (k - path.size()) элементов
        int need = k - path.size();
        for (int i = start; i <= n - need + 1; i++) {
            path.add(i);
            backtrack(n, k, i + 1, path, result);
            path.remove(path.size() - 1);
        }
    }
}`,
      explanation: 'Backtracking с оптимизацией отсечения: цикл идёт до n - (k - path.size()) + 1, чтобы не входить в ветки, где оставшихся чисел недостаточно. Время: O(k * C(n,k)), память: O(k) — глубина рекурсии. C(n,k) = n! / (k! * (n-k)!).'
    }
  ]
}
