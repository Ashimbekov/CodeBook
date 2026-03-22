export default {
  id: 24,
  title: 'Coding: рекурсия и backtracking',
  description: 'Задачи на рекурсию и перебор с откатом: подмножества, перестановки, комбинации и NP-полные задачи.',
  lessons: [
    {
      id: 1,
      title: 'Подмножества',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив уникальных целых чисел nums. Верни все возможные подмножества (power set). Решение не должно содержать дубликатов. LeetCode #78.',
      requirements: [
        'Принимает список уникальных чисел',
        'Возвращает все 2^n подмножеств',
        'Включая пустое подмножество',
        'Порядок подмножеств не важен'
      ],
      expectedOutput: 'Вход: nums=[1,2,3]\nВыход: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]',
      hint: 'Backtracking: для каждого индекса решаем — включить элемент или нет. Или итеративно: начинаем с [[]], для каждого элемента добавляем его ко всем существующим подмножествам.',
      solution: 'def subsets(nums):\n    result = []\n\n    def backtrack(start, current):\n        result.append(current[:])\n        for i in range(start, len(nums)):\n            current.append(nums[i])\n            backtrack(i + 1, current)\n            current.pop()\n\n    backtrack(0, [])\n    return result\n\n# Итеративный вариант\ndef subsetsIterative(nums):\n    result = [[]]\n    for num in nums:\n        result += [subset + [num] for subset in result]\n    return result\n\n# Битовые маски\ndef subsetsBitmask(nums):\n    n = len(nums)\n    result = []\n    for mask in range(1 << n):\n        subset = [nums[i] for i in range(n) if mask & (1 << i)]\n        result.append(subset)\n    return result',
      explanation: 'Подход backtracking: на каждом шаге добавляем текущее подмножество в результат (не только листья дерева).\nПодход битовых масок: каждое из 2^n чисел от 0 до 2^n-1 представляет одно подмножество.\nСложность: O(n * 2^n) по времени и памяти.\nСовет для интервью: знай все три подхода. Битовые маски элегантны для n <= 20. Backtracking — универсальный шаблон для всех задач этого типа.'
    },
    {
      id: 2,
      title: 'Подмножества II (с дубликатами)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив nums который МОЖЕТ содержать дубликаты. Верни все уникальные подмножества. LeetCode #90.',
      requirements: [
        'Принимает список чисел (может быть дубликаты)',
        'Возвращает список уникальных подмножеств',
        'Нет дублирующихся подмножеств в ответе',
        'Сортировка входных данных для обработки дубликатов'
      ],
      expectedOutput: 'Вход: nums=[1,2,2]\nВыход: [[],[1],[1,2],[1,2,2],[2],[2,2]]',
      hint: 'Сортируй nums. При backtracking: если i > start и nums[i] == nums[i-1] — пропускай (это дубликат на том же уровне рекурсии). Условие i > start важно — позволяет использовать элемент впервые на новой ветке.',
      solution: 'def subsetsWithDup(nums):\n    nums.sort()\n    result = []\n\n    def backtrack(start, current):\n        result.append(current[:])\n        for i in range(start, len(nums)):\n            # Пропускаем дубликаты на одном уровне\n            if i > start and nums[i] == nums[i-1]:\n                continue\n            current.append(nums[i])\n            backtrack(i + 1, current)\n            current.pop()\n\n    backtrack(0, [])\n    return result',
      explanation: 'Подход: та же логика что и Subsets, плюс пропуск дубликатов на одном уровне рекурсии.\nКлючевое: условие i > start (не просто i > 0) — позволяет первый раз использовать дубликат на новой ветке, но запрещает использовать его повторно на том же уровне.\nСложность: O(n * 2^n) в худшем случае.\nСовет для интервью: это паттерн пропуска дубликатов используется в 3Sum, Combination Sum II, Permutations II. Запомни его.'
    },
    {
      id: 3,
      title: 'Перестановки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив уникальных целых чисел. Верни все перестановки. LeetCode #46.',
      requirements: [
        'Принимает список уникальных чисел',
        'Возвращает все n! перестановок',
        'Каждая перестановка — упорядоченный набор всех элементов',
        'Порядок перестановок не важен'
      ],
      expectedOutput: 'Вход: nums=[1,2,3]\nВыход: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',
      hint: 'Backtracking: поддерживай список used (или множество). На каждом шаге выбирай не использованный элемент. Когда current.length == nums.length — добавляй в результат.',
      solution: 'def permute(nums):\n    result = []\n\n    def backtrack(current, remaining):\n        if not remaining:\n            result.append(current[:])\n            return\n        for i in range(len(remaining)):\n            current.append(remaining[i])\n            backtrack(current, remaining[:i] + remaining[i+1:])\n            current.pop()\n\n    backtrack([], nums)\n    return result\n\n# Вариант со swap (in-place, эффективнее)\ndef permuteSwap(nums):\n    result = []\n\n    def backtrack(start):\n        if start == len(nums):\n            result.append(nums[:])\n            return\n        for i in range(start, len(nums)):\n            nums[start], nums[i] = nums[i], nums[start]\n            backtrack(start + 1)\n            nums[start], nums[i] = nums[i], nums[start]\n\n    backtrack(0)\n    return result',
      explanation: 'Подход со swap: на каждой позиции start пробуем поставить каждый элемент из remaining (swap), рекурсируем, откатываем (swap обратно).\nСложность: O(n! * n) по времени, O(n) по памяти для стека.\nСовет для интервью: вариант со swap избегает создания новых списков. Вариант с remaining интуитивнее. Оба валидны.'
    },
    {
      id: 4,
      title: 'Сумма комбинаций',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив уникальных кандидатов и target. Найди все уникальные комбинации элементов которые в сумме дают target. Один элемент можно использовать несколько раз. LeetCode #39.',
      requirements: [
        'Каждый элемент можно использовать неограниченно',
        'Все числа положительны',
        'Нет дублирующихся комбинаций в ответе',
        'Порядок в комбинации не важен'
      ],
      expectedOutput: 'Вход: candidates=[2,3,6,7], target=7\nВыход: [[2,2,3],[7]]\nВход: candidates=[2,3,5], target=8\nВыход: [[2,2,2,2],[2,3,3],[3,5]]',
      hint: 'Backtracking с сортировкой. Передавай start чтобы не использовать элементы раньше текущего (избегает дубликатов). Если выбрал candidates[i] — следующий рекурсивный вызов начинается с i (можно повторить).',
      solution: 'def combinationSum(candidates, target):\n    candidates.sort()\n    result = []\n\n    def backtrack(start, current, remaining):\n        if remaining == 0:\n            result.append(current[:])\n            return\n        for i in range(start, len(candidates)):\n            if candidates[i] > remaining:\n                break  # остальные ещё больше (массив отсортирован)\n            current.append(candidates[i])\n            backtrack(i, current, remaining - candidates[i])  # i, не i+1!\n            current.pop()\n\n    backtrack(0, [], target)\n    return result',
      explanation: 'Подход: backtrack(i, ...) позволяет повторно использовать candidates[i]. Сортировка + break обрезает ветви где кандидат слишком большой.\nСложность: O(N^(T/M)) где N — количество кандидатов, T — target, M — минимальный кандидат.\nСовет для интервью: ключевое отличие от Combination Sum II: backtrack(i, ...) vs backtrack(i+1, ...). Первое позволяет повторение.'
    },
    {
      id: 5,
      title: 'Сумма комбинаций II',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив candidates (МОЖЕТ содержать дубликаты) и target. Найди все уникальные комбинации где каждый элемент используется не более одного раза. LeetCode #40.',
      requirements: [
        'Каждый элемент используется не более одного раза',
        'Массив может содержать дубликаты',
        'Нет дублирующихся комбинаций в ответе',
        'Сортировка + пропуск дубликатов на одном уровне'
      ],
      expectedOutput: 'Вход: candidates=[10,1,2,7,6,1,5], target=8\nВыход: [[1,1,6],[1,2,5],[1,7],[2,6]]\nВход: candidates=[2,5,2,1,2], target=5\nВыход: [[1,2,2],[5]]',
      hint: 'Тот же паттерн что и Subsets II: сортировка + пропуск if i > start and candidates[i] == candidates[i-1]. Используй backtrack(i+1, ...) — каждый элемент только раз.',
      solution: 'def combinationSum2(candidates, target):\n    candidates.sort()\n    result = []\n\n    def backtrack(start, current, remaining):\n        if remaining == 0:\n            result.append(current[:])\n            return\n        for i in range(start, len(candidates)):\n            if candidates[i] > remaining:\n                break\n            # Пропускаем дубликаты на одном уровне\n            if i > start and candidates[i] == candidates[i-1]:\n                continue\n            current.append(candidates[i])\n            backtrack(i + 1, current, remaining - candidates[i])\n            current.pop()\n\n    backtrack(0, [], target)\n    return result',
      explanation: 'Подход: паттерн пропуска дубликатов идентичен Subsets II. backtrack(i+1, ...) запрещает повторное использование одного элемента.\nСложность: O(2^n) в худшем случае.\nСовет для интервью: сравни с Combination Sum I: одно изменение i -> i+1 запрещает повторение. Плюс паттерн пропуска дубликатов. Если помнишь оба паттерна — легко решишь обе задачи.'
    },
    {
      id: 6,
      title: 'Поиск слова в матрице',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана сетка символов и слово. Определи существует ли слово в сетке составленное из последовательно соединённых соседних (горизонтально/вертикально) клеток. LeetCode #79.',
      requirements: [
        'Принимает 2D список символов и строку word',
        'Возвращает True если слово найдено',
        'Каждая клетка используется не более одного раза',
        'Backtracking с пометкой посещённых клеток'
      ],
      expectedOutput: 'Вход: board=[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word="ABCCED"\nВыход: True\nВход: word="SEE"\nВыход: True\nВход: word="ABCB"\nВыход: False',
      hint: 'DFS/Backtracking: для каждой начальной клетки запускай поиск. На каждом шаге: если текущий символ не совпадает — возврат. Помечай клетку как посещённую (меняй на "#"), рекурсируй, отменяй.',
      solution: 'def exist(board, word):\n    rows, cols = len(board), len(board[0])\n\n    def dfs(r, c, idx):\n        if idx == len(word):\n            return True\n        if (r < 0 or r >= rows or c < 0 or c >= cols or\n                board[r][c] != word[idx]):\n            return False\n\n        # Помечаем как посещённую\n        temp = board[r][c]\n        board[r][c] = "#"\n\n        found = (dfs(r+1, c, idx+1) or\n                 dfs(r-1, c, idx+1) or\n                 dfs(r, c+1, idx+1) or\n                 dfs(r, c-1, idx+1))\n\n        # Откатываем\n        board[r][c] = temp\n        return found\n\n    for r in range(rows):\n        for c in range(cols):\n            if dfs(r, c, 0):\n                return True\n    return False',
      explanation: 'Подход: DFS с backtracking. Временная замена на "#" помечает клетку как посещённую без использования отдельного visited set.\nСложность: O(m*n * 4^L) где L — длина слова. Каждая клетка запускает DFS глубиной L.\nСовет для интервью: оптимизация — проверь частоту символов в word против board. Если symbol не хватает — вернуть False сразу.'
    },
    {
      id: 7,
      title: 'Разбиение на палиндромы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка s. Верни все возможные разбиения s на подстроки так, чтобы каждая подстрока была палиндромом. LeetCode #131.',
      requirements: [
        'Принимает строку',
        'Возвращает список списков строк',
        'Каждая подстрока в разбиении — палиндром',
        'Backtracking + предвычисление палиндромности'
      ],
      expectedOutput: 'Вход: s="aab"\nВыход: [["a","a","b"],["aa","b"]]\nВход: s="a"\nВыход: [["a"]]',
      hint: 'Backtracking: пробуй все префиксы от текущей позиции. Если префикс — палиндром — добавляй в current и рекурсируй для остатка. В конце строки — добавляй в результат.',
      solution: 'def partition(s):\n    n = len(s)\n    result = []\n\n    # Предвычисляем палиндромность O(n^2)\n    is_pal = [[False] * n for _ in range(n)]\n    for i in range(n-1, -1, -1):\n        for j in range(i, n):\n            if s[i] == s[j] and (j - i <= 2 or is_pal[i+1][j-1]):\n                is_pal[i][j] = True\n\n    def backtrack(start, current):\n        if start == n:\n            result.append(current[:])\n            return\n        for end in range(start + 1, n + 1):\n            if is_pal[start][end-1]:\n                current.append(s[start:end])\n                backtrack(end, current)\n                current.pop()\n\n    backtrack(0, [])\n    return result',
      explanation: 'Подход: предвычисляем is_pal[i][j] за O(n^2) один раз. Затем backtracking использует O(1) проверку палиндромности.\nСложность: O(n * 2^n) по времени в худшем случае (строка из одинаковых символов).\nСовет для интервью: DP предвычисление — ключевая оптимизация. Без него O(n^3) — каждый шаг backtracking проверяет палиндром за O(n).'
    },
    {
      id: 8,
      title: 'Комбинации букв телефона',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дана строка из цифр 2-9. Верни все возможные комбинации букв которые представляют цифры (как на телефоне). LeetCode #17.',
      requirements: [
        'Принимает строку цифр',
        'Возвращает список всех возможных строк',
        'Если входная строка пустая — вернуть []',
        'Порядок ответа не важен'
      ],
      expectedOutput: 'Вход: digits="23"\nВыход: ["ad","ae","af","bd","be","bf","cd","ce","cf"]\nВход: digits=""\nВыход: []',
      hint: 'Backtracking: для каждой цифры перебирай все соответствующие буквы. Когда длина current равна длине digits — добавляй в результат.',
      solution: 'def letterCombinations(digits):\n    if not digits:\n        return []\n\n    phone_map = {\n        "2": "abc", "3": "def", "4": "ghi", "5": "jkl",\n        "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"\n    }\n\n    result = []\n\n    def backtrack(idx, current):\n        if idx == len(digits):\n            result.append("".join(current))\n            return\n        for letter in phone_map[digits[idx]]:\n            current.append(letter)\n            backtrack(idx + 1, current)\n            current.pop()\n\n    backtrack(0, [])\n    return result\n\n# Итеративный вариант (BFS)\ndef letterCombinationsIter(digits):\n    if not digits:\n        return []\n    phone_map = {\n        "2": "abc", "3": "def", "4": "ghi", "5": "jkl",\n        "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"\n    }\n    result = [""]\n    for digit in digits:\n        result = [prev + c for prev in result for c in phone_map[digit]]\n    return result',
      explanation: 'Подход backtracking: стандартный шаблон — цикл по вариантам, добавить, рекурсия, убрать.\nПодход iterative (BFS): строим результат слой за слоем. Для каждой цифры расширяем каждую существующую строку всеми буквами.\nСложность: O(4^n * n) где n — количество цифр (4 — макс. букв на кнопке).\nСовет для интервью: итеративный вариант проще для понимания. Backtracking более универсален для сложных ограничений.'
    },
    {
      id: 9,
      title: 'N-ферзей',
      type: 'practice',
      difficulty: 'hard',
      description: 'Расставь n ферзей на шахматной доске n x n так, чтобы ни один не атаковал другого. Верни все возможные расстановки. LeetCode #51.',
      requirements: [
        'Принимает целое n',
        'Возвращает список досок (список строк)',
        'Каждая строка содержит "Q" и "."',
        'Ни один ферзь не атакует другого по строке, столбцу, диагонали'
      ],
      expectedOutput: 'Вход: n=4\nВыход: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]\nВход: n=1\nВыход: [["Q"]]',
      hint: 'Ставь по одному ферзю в строку (строка за строкой). Отслеживай занятые столбцы, диагонали (row-col) и антидиагонали (row+col). Backtracking: пробуй каждую позицию в строке, проверяй конфликты.',
      solution: 'def solveNQueens(n):\n    result = []\n    queens = []  # queens[i] = col ферзя в строке i\n    cols = set()\n    diag1 = set()  # row - col\n    diag2 = set()  # row + col\n\n    def backtrack(row):\n        if row == n:\n            board = []\n            for r in range(n):\n                board.append("." * queens[r] + "Q" + "." * (n - queens[r] - 1))\n            result.append(board)\n            return\n\n        for col in range(n):\n            if col in cols or (row-col) in diag1 or (row+col) in diag2:\n                continue\n            cols.add(col)\n            diag1.add(row - col)\n            diag2.add(row + col)\n            queens.append(col)\n\n            backtrack(row + 1)\n\n            cols.remove(col)\n            diag1.remove(row - col)\n            diag2.remove(row + col)\n            queens.pop()\n\n    backtrack(0)\n    return result',
      explanation: 'Подход: по одному ферзю в строку (строки не пересекаются). Три множества для O(1) проверки конфликтов: столбцы, диагонали (row-col постоянна), антидиагонали (row+col постоянна).\nСложность: O(n!) в худшем случае, реально намного быстрее из-за отсечений.\nСовет для интервью: ключевой инсайт — диагональ однозначно определяется разностью row-col, антидиагональ — суммой row+col. Три set вместо O(n) проверок ускоряют решение.'
    },
    {
      id: 10,
      title: 'Решатель Судоку',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дана частично заполненная доска Судоку 9x9. Заполни её (in-place) по правилам: цифры 1-9, каждая строка/столбец/блок 3x3 без повторений. Гарантировано уникальное решение. LeetCode #37.',
      requirements: [
        'Принимает 2D список символов (цифры "1"-"9" или ".")',
        'Модифицирует доску in-place',
        'Соблюдает правила Судоку',
        'Backtracking с проверкой валидности'
      ],
      expectedOutput: 'Вход: частично заполненная доска\nВыход: та же доска полностью заполненная\n(решение единственно)',
      hint: 'Найди первую пустую клетку. Пробуй цифры 1-9. Для каждой проверяй: не нарушает ли строку, столбец, блок 3x3. Рекурсируй. Если зашли в тупик — откатываем.',
      solution: 'def solveSudoku(board):\n    def is_valid(row, col, num):\n        # Проверяем строку\n        if num in board[row]:\n            return False\n        # Проверяем столбец\n        if num in [board[r][col] for r in range(9)]:\n            return False\n        # Проверяем блок 3x3\n        box_row, box_col = 3 * (row // 3), 3 * (col // 3)\n        for r in range(box_row, box_row + 3):\n            for c in range(box_col, box_col + 3):\n                if board[r][c] == num:\n                    return False\n        return True\n\n    def backtrack():\n        for row in range(9):\n            for col in range(9):\n                if board[row][col] == ".":\n                    for num in "123456789":\n                        if is_valid(row, col, num):\n                            board[row][col] = num\n                            if backtrack():\n                                return True\n                            board[row][col] = "."  # откат\n                    return False  # нет валидной цифры\n        return True  # все клетки заполнены\n\n    backtrack()\n\n# Оптимизированная версия с предвычисленными sets\ndef solveSudokuOpt(board):\n    rows = [set() for _ in range(9)]\n    cols = [set() for _ in range(9)]\n    boxes = [set() for _ in range(9)]\n    empty = []\n\n    for r in range(9):\n        for c in range(9):\n            if board[r][c] != ".":\n                d = board[r][c]\n                rows[r].add(d)\n                cols[c].add(d)\n                boxes[(r//3)*3 + c//3].add(d)\n            else:\n                empty.append((r, c))\n\n    def backtrack(idx):\n        if idx == len(empty):\n            return True\n        r, c = empty[idx]\n        box_id = (r//3)*3 + c//3\n        for num in "123456789":\n            if num not in rows[r] and num not in cols[c] and num not in boxes[box_id]:\n                board[r][c] = num\n                rows[r].add(num)\n                cols[c].add(num)\n                boxes[box_id].add(num)\n                if backtrack(idx + 1):\n                    return True\n                board[r][c] = "."\n                rows[r].discard(num)\n                cols[c].discard(num)\n                boxes[box_id].discard(num)\n        return False\n\n    backtrack(0)',
      explanation: 'Подход: классический backtracking. Находим пустую клетку, пробуем цифры 1-9, рекурсируем, откатываем при неудаче.\nОптимизация: предвычисляем sets для строк, столбцов, блоков — проверка O(1) вместо O(n).\nСложность: O(9^m) где m — количество пустых клеток. На практике намного быстрее благодаря сокращению.\nСовет для интервью: ключевые паттерны backtracking: выбрать клетку, попробовать вариант, проверить, рекурсировать, откатить. Оптимизация — предвычисленные sets вместо сканирования массивов.'
    }
  ]
}
