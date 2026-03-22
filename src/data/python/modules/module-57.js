export default {
  id: 57,
  title: 'Практикум: Строки и списки',
  description: 'Практические задачи на работу со строками, списками и алгоритмами обработки данных',
  lessons: [
    {
      id: 1,
      title: 'Палиндромы и анаграммы',
      type: 'practice',
      difficulty: 'easy',
      description: 'Проверь строки на палиндром и анаграмму.',
      requirements: [
        'is_palindrome(s) — игнорирует регистр, пробелы и пунктуацию',
        'is_anagram(s1, s2) — является ли s2 анаграммой s1',
        'find_palindromes(word_list) — все палиндромы в списке',
        'group_anagrams(words) — сгруппировать слова-анаграммы'
      ],
      expectedOutput: 'is_palindrome("А роза упала на лапу Азора") -> True\nis_anagram("кот", "ток") -> True\ngroup_anagrams(["eat","tea","tan","ate","nat","bat"]) -> [["eat","tea","ate"],["tan","nat"],["bat"]]',
      hint: 'Для палиндрома: очисти строку re.sub(r"[^а-яёa-z]", "", s.lower()). Для анаграммы: sorted(s1) == sorted(s2). Для группировки: словарь с ключом sorted(word).',
      solution: 'import re\nfrom collections import defaultdict\n\ndef is_palindrome(s):\n    clean = re.sub(r"[^а-яёa-z0-9]", "", s.lower())\n    return clean == clean[::-1]\n\ndef is_anagram(s1, s2):\n    clean1 = re.sub(r"\\s", "", s1.lower())\n    clean2 = re.sub(r"\\s", "", s2.lower())\n    return sorted(clean1) == sorted(clean2)\n\ndef find_palindromes(word_list):\n    return [w for w in word_list if is_palindrome(w)]\n\ndef group_anagrams(words):\n    groups = defaultdict(list)\n    for word in words:\n        key = tuple(sorted(word.lower()))\n        groups[key].append(word)\n    return [group for group in groups.values() if len(group) >= 1]\n\nprint(is_palindrome("А роза упала на лапу Азора"))\nprint(is_palindrome("Топот"))\nprint(is_anagram("кот", "ток"))\nprint(is_anagram("кот", "кит"))\nprint(find_palindromes(["топот", "кот", "казак", "дом", "шалаш"]))\nprint(group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"]))',
      explanation: 'sorted() на строке возвращает список символов в алфавитном порядке. defaultdict(list) автоматически создаёт пустой список для новых ключей. tuple(sorted()) — хешируемый ключ для словаря.'
    },
    {
      id: 2,
      title: 'Сжатие строк',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй Run-Length Encoding (RLE) — сжатие повторяющихся символов.',
      requirements: [
        'compress(s) — "aabbbcccc" -> "a2b3c4"',
        'decompress(s) — "a2b3c4" -> "aabbbcccc"',
        'compress_ratio(s) — процент сжатия',
        'best_case(n) — строка с максимальным сжатием длиной n',
        'worst_case(n) — строка без сжатия длиной n'
      ],
      expectedOutput: 'compress("aabbbcccc") -> "a2b3c4"\ndecompress("a2b3c4") -> "aabbbcccc"\ncompress("abc") -> "abc" (не сжимать одиночные)\ncompress_ratio("aaabbbccc") -> 33.33%',
      hint: 'itertools.groupby() группирует подряд идущие одинаковые символы. В decompress: re.findall(r"([a-z])(\\d*)", s).',
      solution: 'import re\nfrom itertools import groupby\n\ndef compress(s):\n    if not s:\n        return ""\n    result = []\n    for char, group in groupby(s):\n        count = sum(1 for _ in group)\n        result.append(char + (str(count) if count > 1 else ""))\n    return "".join(result)\n\ndef decompress(s):\n    result = []\n    i = 0\n    while i < len(s):\n        char = s[i]\n        i += 1\n        num = ""\n        while i < len(s) and s[i].isdigit():\n            num += s[i]\n            i += 1\n        result.append(char * (int(num) if num else 1))\n    return "".join(result)\n\ndef compress_ratio(s):\n    compressed = compress(s)\n    if len(s) == 0:\n        return 0\n    ratio = (1 - len(compressed) / len(s)) * 100\n    return max(0, ratio)\n\ndef best_case(n):\n    return "a" * n\n\ndef worst_case(n):\n    import string\n    chars = string.ascii_lowercase\n    return "".join(chars[i % 26] for i in range(n))\n\ntests = ["aabbbcccc", "abc", "aaaaaa", "aaabbbccc", "abababab"]\nfor t in tests:\n    c = compress(t)\n    d = decompress(c)\n    ratio = compress_ratio(t)\n    status = "OK" if d == t else "FAIL"\n    print(f"{t!r:15} -> {c!r:15} -> {d!r:15} | сжатие: {ratio:.1f}% | {status}")',
      explanation: 'itertools.groupby() — элегантный способ найти повторы без цикла. groupby возвращает (key, group_iterator) — group нужно итерировать чтобы посчитать. Цикл с i в decompress обрабатывает многозначные числа (a10).'
    },
    {
      id: 3,
      title: 'Операции со списками: сортировка',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй алгоритмы сортировки и поиска вручную.',
      requirements: [
        'bubble_sort(lst) — пузырьковая сортировка',
        'binary_search(sorted_lst, target) — бинарный поиск, возвращает индекс или -1',
        'merge_sort(lst) — сортировка слиянием',
        'Сравнение производительности: измерь время для 1000 элементов',
        'Верни оба результата: отсортированный список и количество сравнений'
      ],
      expectedOutput: 'bubble_sort([3,1,4,1,5,9,2,6]) -> [1,1,2,3,4,5,6,9]\nbinary_search([1,2,3,4,5], 3) -> 2\nbinary_search([1,2,3,4,5], 6) -> -1\nbubble_sort время: Xms\nmerge_sort время: Xms (быстрее)',
      hint: 'Bubble sort: два вложенных цикла, меняй если lst[j] > lst[j+1]. Binary search: mid = (low + high) // 2. Merge sort: разбей пополам, отсортируй рекурсивно, слей.',
      solution: 'import time\nimport random\n\ndef bubble_sort(lst):\n    arr = lst[:]\n    n = len(arr)\n    comparisons = 0\n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            comparisons += 1\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr, comparisons\n\ndef binary_search(sorted_lst, target):\n    low, high = 0, len(sorted_lst) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if sorted_lst[mid] == target:\n            return mid\n        elif sorted_lst[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\ndef merge_sort(lst):\n    if len(lst) <= 1:\n        return lst\n    mid = len(lst) // 2\n    left = merge_sort(lst[:mid])\n    right = merge_sort(lst[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i])\n            i += 1\n        else:\n            result.append(right[j])\n            j += 1\n    return result + left[i:] + right[j:]\n\ntest = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]\nprint("Bubble sort:", bubble_sort(test)[0])\nprint("Merge sort:", merge_sort(test))\n\nsorted_list = list(range(1, 20))\nprint("Binary search 15:", binary_search(sorted_list, 15))\nprint("Binary search 25:", binary_search(sorted_list, 25))\n\nbig = random.sample(range(10000), 1000)\nt1 = time.time(); bubble_sort(big); t2 = time.time()\nt3 = time.time(); merge_sort(big); t4 = time.time()\nprint(f"Bubble sort 1000 элементов: {(t2-t1)*1000:.1f}ms")\nprint(f"Merge sort 1000 элементов: {(t4-t3)*1000:.1f}ms")',
      explanation: 'Оптимизация bubble sort: флаг swapped — если за проход не было обменов, список уже отсортирован. Merge sort O(n log n) значительно быстрее bubble sort O(n^2) на больших данных. Binary search требует отсортированного списка.'
    },
    {
      id: 4,
      title: 'Работа с матрицей (2D список)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Операции с двумерными списками без NumPy.',
      requirements: [
        'rotate_90(matrix) — поворот матрицы на 90 градусов по часовой',
        'spiral_order(matrix) — обход матрицы по спирали',
        'find_path(matrix, start, end) — поиск пути в лабиринте (0=проход, 1=стена)',
        'diagonal_sum(matrix) — сумма главной и побочной диагоналей',
        'Вывод матрицы в красивом формате'
      ],
      expectedOutput: 'rotate_90([[1,2,3],[4,5,6],[7,8,9]]) -> [[7,4,1],[8,5,2],[9,6,3]]\nspiral_order([[1,2,3],[4,5,6],[7,8,9]]) -> [1,2,3,6,9,8,7,4,5]\ndiagonal_sum([[1,2],[3,4]]) -> main=5, anti=5',
      hint: 'Поворот: zip(*matrix[::-1]). Спираль: берёт верхнюю строку, поворачивает оставшееся, рекурсивно. BFS/DFS для поиска пути.',
      solution: 'from collections import deque\n\ndef print_matrix(m):\n    for row in m:\n        print(" ".join(f"{x:3d}" for x in row))\n\ndef rotate_90(matrix):\n    return [list(row) for row in zip(*matrix[::-1])]\n\ndef spiral_order(matrix):\n    result = []\n    while matrix:\n        result += matrix.pop(0)\n        matrix = [list(row) for row in zip(*matrix)][::-1]\n    return result\n\ndef diagonal_sum(matrix):\n    n = len(matrix)\n    main_diag = sum(matrix[i][i] for i in range(n))\n    anti_diag = sum(matrix[i][n-1-i] for i in range(n))\n    if n % 2 == 1:\n        mid = n // 2\n        anti_diag -= matrix[mid][mid]\n    return main_diag, anti_diag\n\ndef find_path(maze, start, end):\n    rows, cols = len(maze), len(maze[0])\n    queue = deque([(start, [start])])\n    visited = {start}\n    directions = [(0,1),(1,0),(0,-1),(-1,0)]\n    while queue:\n        (r, c), path = queue.popleft()\n        if (r, c) == end:\n            return path\n        for dr, dc in directions:\n            nr, nc = r + dr, c + dc\n            if (0 <= nr < rows and 0 <= nc < cols\n                    and maze[nr][nc] == 0\n                    and (nr, nc) not in visited):\n                visited.add((nr, nc))\n                queue.append(((nr, nc), path + [(nr, nc)]))\n    return None\n\nm = [[1,2,3],[4,5,6],[7,8,9]]\nprint("Оригинал:"); print_matrix(m)\nprint("Поворот 90:"); print_matrix(rotate_90(m))\nprint("Спираль:", spiral_order([row[:] for row in m]))\nprint("Диагонали:", diagonal_sum(m))\n\nmaze = [[0,0,0,1],[1,0,0,1],[0,0,0,0],[0,1,0,0]]\npath = find_path(maze, (0,0), (3,2))\nprint("Путь в лабиринте:", path)',
      explanation: 'zip(*matrix[::-1]) — питонский способ поворота матрицы: [::-1] переворачивает строки, zip* транспонирует. BFS (breadth-first search) находит кратчайший путь в лабиринте. deque эффективнее list для queue операций.'
    },
    {
      id: 5,
      title: 'Стек и очередь',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй стек и очередь с дополнительными операциями.',
      requirements: [
        'Stack: push, pop, peek, is_empty, size, __repr__',
        'Queue: enqueue, dequeue, front, is_empty, size',
        'valid_parentheses(s) — проверка скобок через стек: {[()]}',
        'reverse_string(s) — через стек',
        'evaluate_rpn(tokens) — вычислить RPN выражение: ["3","4","+","2","*"]'
      ],
      expectedOutput: 'Stack: push/pop работает\nvalid_parentheses("{[()]}") -> True\nvalid_parentheses("{[}") -> False\nreverse_string("hello") -> "olleh"\nevaluate_rpn(["3","4","+","2","*"]) -> 14',
      hint: 'valid_parentheses: при открывающей — push, при закрывающей — pop и проверь пару. evaluate_rpn: числа push, операторы pop два числа и push результат.',
      solution: 'class Stack:\n    def __init__(self):\n        self._data = []\n\n    def push(self, item):\n        self._data.append(item)\n\n    def pop(self):\n        if self.is_empty():\n            raise IndexError("Стек пуст")\n        return self._data.pop()\n\n    def peek(self):\n        if self.is_empty():\n            raise IndexError("Стек пуст")\n        return self._data[-1]\n\n    def is_empty(self):\n        return len(self._data) == 0\n\n    def size(self):\n        return len(self._data)\n\n    def __repr__(self):\n        return f"Stack({self._data})"\n\nclass Queue:\n    def __init__(self):\n        from collections import deque\n        self._data = deque()\n\n    def enqueue(self, item):\n        self._data.append(item)\n\n    def dequeue(self):\n        if self.is_empty():\n            raise IndexError("Очередь пуста")\n        return self._data.popleft()\n\n    def front(self):\n        return self._data[0]\n\n    def is_empty(self):\n        return len(self._data) == 0\n\n    def size(self):\n        return len(self._data)\n\ndef valid_parentheses(s):\n    pairs = {")": "(", "]": "[", "}": "{"}\n    stack = Stack()\n    for char in s:\n        if char in "([{":\n            stack.push(char)\n        elif char in ")]}":\n            if stack.is_empty() or stack.pop() != pairs[char]:\n                return False\n    return stack.is_empty()\n\ndef reverse_string(s):\n    stack = Stack()\n    for char in s:\n        stack.push(char)\n    return "".join(stack.pop() for _ in range(stack.size() + len(s)))\n\ndef evaluate_rpn(tokens):\n    stack = Stack()\n    ops = {"+": lambda a,b: a+b, "-": lambda a,b: a-b,\n           "*": lambda a,b: a*b, "/": lambda a,b: a/b}\n    for token in tokens:\n        if token in ops:\n            b, a = stack.pop(), stack.pop()\n            stack.push(ops[token](a, b))\n        else:\n            stack.push(float(token))\n    return stack.pop()\n\nprint(valid_parentheses("{[()]}"))\nprint(valid_parentheses("{[}"))\nprint(valid_parentheses("(())"))\ns = Stack()\nfor c in "hello": s.push(c)\nprint("".join(s.pop() for _ in range(5)))\nprint(evaluate_rpn(["3","4","+","2","*"]))  # (3+4)*2=14',
      explanation: 'deque в Queue обеспечивает O(1) для popleft вместо O(n) у list. В RPN порядок важен: b = pop(), a = pop() (второй операнд снимается первым). Стек — LIFO: последним вошёл, первым вышел.'
    },
    {
      id: 6,
      title: 'Работа с текстом: парсер CSV',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй простой CSV парсер вручную без использования модуля csv.',
      requirements: [
        'parse_csv(text, delimiter=",") — парсит CSV строку в список словарей',
        'Обработка кавычек: поля в кавычках могут содержать разделитель',
        'generate_csv(data, fields) — генерирует CSV строку из списка словарей',
        'Обработка пустых значений и значений с запятыми',
        'statistics из CSV: подсчёт строк, числовых колонок, пропусков'
      ],
      expectedOutput: 'parse_csv("name,age\\nАлиса,25") -> [{"name": "Алиса", "age": "25"}]\nparse_csv с кавычками: поле "Москва, центр" не делится',
      hint: 'Состояния парсера: обычный символ / внутри кавычек. При кавычке в кавычках — пропусти. Проще: split(",") не работает для кавычек, нужен конечный автомат.',
      solution: 'def parse_csv_line(line, delimiter=","):\n    fields = []\n    current = []\n    in_quotes = False\n    i = 0\n    while i < len(line):\n        char = line[i]\n        if char == \'"\' and not in_quotes:\n            in_quotes = True\n        elif char == \'"\' and in_quotes:\n            if i + 1 < len(line) and line[i+1] == \'"\':\n                current.append(\'"\')\n                i += 1\n            else:\n                in_quotes = False\n        elif char == delimiter and not in_quotes:\n            fields.append("".join(current))\n            current = []\n        else:\n            current.append(char)\n        i += 1\n    fields.append("".join(current))\n    return fields\n\ndef parse_csv(text, delimiter=","):\n    lines = text.strip().split("\\n")\n    if not lines:\n        return []\n    headers = parse_csv_line(lines[0], delimiter)\n    result = []\n    for line in lines[1:]:\n        if line.strip():\n            values = parse_csv_line(line, delimiter)\n            result.append(dict(zip(headers, values)))\n    return result\n\ndef generate_csv(data, fields=None):\n    if not data:\n        return ""\n    if fields is None:\n        fields = list(data[0].keys())\n    lines = [",".join(fields)]\n    for row in data:\n        values = []\n        for f in fields:\n            val = str(row.get(f, ""))\n            if "," in val or \'"\' in val or "\\n" in val:\n                val = \'"\' + val.replace(\'"\',"\\"\\"") + \'"\'\n            values.append(val)\n        lines.append(",".join(values))\n    return "\\n".join(lines)\n\ncsv_text = \'\'\'name,city,age\nАлиса,"Москва, центр",25\nБоб,Санкт-Петербург,30\nВася,"Казань",22\'\'\'\n\ndata = parse_csv(csv_text)\nfor row in data:\n    print(row)\n\nprint("\\nОбратно в CSV:")\nprint(generate_csv(data))',
      explanation: 'Конечный автомат с флагом in_quotes обрабатывает экранированные кавычки и разделители внутри кавычек. Двойная кавычка "" внутри поля — стандарт CSV для экранирования. zip(headers, values) создаёт словарь из двух списков.'
    },
    {
      id: 7,
      title: 'Цепочка методов (Method Chaining)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй класс для обработки списков в стиле функциональных цепочек.',
      requirements: [
        'Класс Pipeline принимает список данных',
        'Методы: filter(func), map(func), sort(key=None, reverse=False), take(n), skip(n)',
        'Каждый метод возвращает новый Pipeline для цепочки',
        'Метод result() возвращает финальный список',
        'Метод reduce(func, initial) применяет functools.reduce',
        'Пример: Pipeline([1..10]).filter(lambda x: x%2==0).map(lambda x: x**2).result()'
      ],
      expectedOutput: 'Pipeline([1..10]).filter(even).map(square).result() -> [4,16,36,64,100]\nPipeline(words).filter(len>3).sort().take(5).result() -> первые 5 слов длиннее 3',
      hint: 'Каждый метод делает return Pipeline(processed_data). Ленивые вычисления: храни список функций и применяй при result() — но для начала можно сразу вычислять.',
      solution: 'import functools\n\nclass Pipeline:\n    def __init__(self, data):\n        self._data = list(data)\n\n    def filter(self, func):\n        return Pipeline(x for x in self._data if func(x))\n\n    def map(self, func):\n        return Pipeline(func(x) for x in self._data)\n\n    def sort(self, key=None, reverse=False):\n        return Pipeline(sorted(self._data, key=key, reverse=reverse))\n\n    def take(self, n):\n        return Pipeline(self._data[:n])\n\n    def skip(self, n):\n        return Pipeline(self._data[n:])\n\n    def unique(self):\n        seen = set()\n        def gen():\n            for x in self._data:\n                if x not in seen:\n                    seen.add(x)\n                    yield x\n        return Pipeline(gen())\n\n    def reduce(self, func, initial=None):\n        if initial is not None:\n            return functools.reduce(func, self._data, initial)\n        return functools.reduce(func, self._data)\n\n    def result(self):\n        return list(self._data)\n\n    def __len__(self):\n        return len(self._data)\n\n    def __repr__(self):\n        return f"Pipeline({self._data[:5]}{"..." if len(self._data) > 5 else ""})"\n\n# Тесты\nresult = (Pipeline(range(1, 11))\n          .filter(lambda x: x % 2 == 0)\n          .map(lambda x: x ** 2)\n          .result())\nprint("Чётные квадраты:", result)\n\nwords = ["питон", "кот", "программирование", "ит", "данные", "анализ", "код"]\nresult2 = (Pipeline(words)\n           .filter(lambda w: len(w) > 3)\n           .sort()\n           .take(4)\n           .result())\nprint("Длинные слова (сортировка):", result2)\n\ntotal = Pipeline(range(1, 6)).reduce(lambda a, b: a + b)\nprint("Сумма 1..5:", total)',
      explanation: 'Method chaining — каждый метод возвращает self или новый объект того же типа. Передача генераторов в Pipeline.__init__ откладывает вычисление до list(). Это основа функционального программирования в Python.'
    },
    {
      id: 8,
      title: 'Форматирование таблиц',
      type: 'practice',
      difficulty: 'easy',
      description: 'Выведи данные в красиво отформатированной таблице.',
      requirements: [
        'format_table(data, headers) — форматирует список словарей в таблицу',
        'Автоматически подбирает ширину столбцов',
        'Поддерживает выравнивание: left, right, center',
        'add_total_row(data, numeric_cols) — добавляет строку итогов',
        'Рамка из символов ─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼'
      ],
      expectedOutput: '┌──────────────┬───────┬──────────┐\n│ Имя          │ Возр. │ Зарплата │\n├──────────────┼───────┼──────────┤\n│ Алиса        │    25 │   80,000 │\n│ Боб          │    30 │   60,000 │\n├──────────────┼───────┼──────────┤\n│ Итого        │       │  140,000 │\n└──────────────┴───────┴──────────┘',
      hint: 'max(len(str(row[col])) for row in data) для ширины. str.ljust(w), str.rjust(w), str.center(w) для выравнивания.',
      solution: 'def format_table(data, headers, alignments=None):\n    if not data:\n        return "Нет данных"\n    \n    cols = list(headers.keys())\n    titles = list(headers.values())\n    \n    if alignments is None:\n        alignments = {col: "left" for col in cols}\n    \n    # Вычислить ширины\n    widths = {}\n    for col, title in zip(cols, titles):\n        max_data = max((len(str(row.get(col, ""))) for row in data), default=0)\n        widths[col] = max(len(title), max_data)\n    \n    def align_cell(text, width, align):\n        if align == "right":\n            return str(text).rjust(width)\n        elif align == "center":\n            return str(text).center(width)\n        return str(text).ljust(width)\n    \n    def make_row(values):\n        cells = [f" {align_cell(v, widths[c], alignments.get(c, \'left\'))} "\n                 for c, v in zip(cols, values)]\n        return "│" + "│".join(cells) + "│"\n    \n    def separator(left, mid, right, fill):\n        parts = [fill * (widths[c] + 2) for c in cols]\n        return left + mid.join(parts) + right\n    \n    lines = [\n        separator("┌", "┬", "┐", "─"),\n        make_row(titles),\n        separator("├", "┼", "┤", "─"),\n    ]\n    for row in data:\n        lines.append(make_row([row.get(c, "") for c in cols]))\n    lines.append(separator("└", "┴", "┘", "─"))\n    \n    return "\\n".join(lines)\n\ndata = [\n    {"name": "Алиса", "age": 25, "salary": "80,000"},\n    {"name": "Боб", "age": 30, "salary": "60,000"},\n    {"name": "Вася", "age": 22, "salary": "55,000"},\n]\nheaders = {"name": "Имя", "age": "Возр.", "salary": "Зарплата"}\naligns = {"name": "left", "age": "right", "salary": "right"}\nprint(format_table(data, headers, aligns))',
      explanation: 'Вычисление ширин через max с generator expression экономит память. Функции separator и make_row разделяют ответственность. Unicode символы рамки делают таблицу читаемой в терминале.'
    },
    {
      id: 9,
      title: 'Регулярные выражения на практике',
      type: 'practice',
      difficulty: 'medium',
      description: 'Извлечь и обработать данные из текста с помощью регулярных выражений.',
      requirements: [
        'extract_emails(text) — все email адреса',
        'extract_phones(text) — номера телефонов (+7, 8, форматы)',
        'extract_urls(text) — все URL (http/https)',
        'extract_dates(text) — даты в форматах ДД.ММ.ГГГГ и ГГГГ-ММ-ДД',
        'mask_sensitive(text) — замаскировать email и телефоны: al***@mail.ru, +7***1234'
      ],
      expectedOutput: 'Emails: ["user@mail.ru", "admin@example.com"]\nPhones: ["+79161234567", "8-916-123-45-67"]\nDates: ["25.12.2024", "2024-01-15"]\nMasked: "Звоните ***@mail.ru или +7***4567"',
      hint: 'Email: r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}". Телефон: r"(?:\\+7|8)[\\s-]?\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{2}[\\s-]?\\d{2}".',
      solution: 'import re\n\ndef extract_emails(text):\n    pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"\n    return re.findall(pattern, text)\n\ndef extract_phones(text):\n    pattern = r"(?:\\+7|8)[\\s\\-]?\\(?\\d{3}\\)?[\\s\\-]?\\d{3}[\\s\\-]?\\d{2}[\\s\\-]?\\d{2}"\n    return re.findall(pattern, text)\n\ndef extract_urls(text):\n    pattern = r"https?://[^\\s<>\"{}|\\\\^`\\[\\]]+"\n    return re.findall(pattern, text)\n\ndef extract_dates(text):\n    ru_date = r"\\d{2}\\.\\d{2}\\.\\d{4}"\n    iso_date = r"\\d{4}-\\d{2}-\\d{2}"\n    return re.findall(ru_date, text) + re.findall(iso_date, text)\n\ndef mask_email(email):\n    user, domain = email.split("@", 1)\n    masked_user = user[:2] + "***" if len(user) > 2 else "***"\n    return f"{masked_user}@{domain}"\n\ndef mask_phone(phone):\n    digits = re.sub(r"\\D", "", phone)\n    return digits[:2] + "***" + digits[-4:]\n\ndef mask_sensitive(text):\n    text = re.sub(\n        r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",\n        lambda m: mask_email(m.group()), text\n    )\n    text = re.sub(\n        r"(?:\\+7|8)[\\s\\-]?\\(?\\d{3}\\)?[\\s\\-]?\\d{3}[\\s\\-]?\\d{2}[\\s\\-]?\\d{2}",\n        lambda m: mask_phone(m.group()), text\n    )\n    return text\n\ntext = """\nСвяжитесь с нами: admin@company.ru или support@mail.com\nТелефон: +7(916)123-45-67 или 8-800-555-35-35\nСайт: https://example.com/page?id=123\nДата отчёта: 25.12.2024, дата рождения: 1990-05-15\n"""\n\nprint("Emails:", extract_emails(text))\nprint("Phones:", extract_phones(text))\nprint("URLs:", extract_urls(text))\nprint("Dates:", extract_dates(text))\nprint("\\nМаскировка:")\nprint(mask_sensitive(text))',
      explanation: 're.sub с lambda как replacement позволяет обрабатывать каждое совпадение динамически. (?:...) — некапturing группа. \\(?\\d{3}\\)? — опциональные скобки. Маскировка данных важна для логов и GDPR.'
    },
    {
      id: 10,
      title: 'Словарь и Counter задачи',
      type: 'practice',
      difficulty: 'medium',
      description: 'Решение классических задач с использованием словарей и Counter.',
      requirements: [
        'two_sum(nums, target) — найти два индекса чьи значения дают target',
        'group_by(items, key_func) — сгруппировать элементы по ключевой функции',
        'count_words(text) — подсчёт слов без стоп-слов',
        'invert_dict(d) — инвертировать словарь (значения -> список ключей)',
        'merge_dicts(*dicts) — объединить словари, суммируя числовые значения'
      ],
      expectedOutput: 'two_sum([2,7,11,15], 9) -> [0, 1]\ngroup_by([1..9], lambda x: x%3) -> {0:[3,6,9], 1:[1,4,7], 2:[2,5,8]}\ninvert_dict({"a":1,"b":2,"c":1}) -> {1:["a","c"], 2:["b"]}',
      hint: 'two_sum: хранить {значение: индекс}, при каждом элементе проверяй есть ли (target - elem) в словаре — O(n). group_by: defaultdict(list).',
      solution: 'from collections import defaultdict, Counter\n\ndef two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n\ndef group_by(items, key_func):\n    result = defaultdict(list)\n    for item in items:\n        result[key_func(item)].append(item)\n    return dict(result)\n\ndef count_words(text, stop_words=None):\n    if stop_words is None:\n        stop_words = {"и", "в", "на", "с", "по", "а", "но", "что", "для"}\n    words = text.lower().split()\n    import re\n    clean = [re.sub(r"[^а-яёa-z]", "", w) for w in words]\n    filtered = [w for w in clean if w and w not in stop_words]\n    return Counter(filtered)\n\ndef invert_dict(d):\n    result = defaultdict(list)\n    for k, v in d.items():\n        result[v].append(k)\n    return dict(result)\n\ndef merge_dicts(*dicts):\n    result = {}\n    for d in dicts:\n        for k, v in d.items():\n            if k in result and isinstance(result[k], (int, float)) and isinstance(v, (int, float)):\n                result[k] += v\n            else:\n                result[k] = v\n    return result\n\nprint("two_sum:", two_sum([2, 7, 11, 15], 9))\nprint("two_sum:", two_sum([3, 2, 4], 6))\nprint("group_by:", group_by(range(1, 10), lambda x: x % 3))\nprint("invert_dict:", invert_dict({"a": 1, "b": 2, "c": 1, "d": 2}))\nd1, d2 = {"a": 1, "b": 2}, {"b": 3, "c": 4}\nprint("merge_dicts:", merge_dicts(d1, d2))\nprint("word_count:", count_words("питон и питон это питон для всех").most_common(3))',
      explanation: 'two_sum с хеш-таблицей O(n) — классика. defaultdict автоматически создаёт значение по умолчанию. Counter наследует dict и добавляет most_common(). enumerate() даёт и индекс и значение одновременно.'
    }
  ]
}
