export default {
  id: 16,
  title: 'Coding: стеки и очереди',
  description: 'Топ-8 задач на стеки и очереди с полными решениями на Python. От Valid Parentheses до Sliding Window Maximum.',
  lessons: [
    {
      id: 1,
      type: 'practice',
      title: 'Valid Parentheses',
      difficulty: 'easy',
      description: 'Дана строка s из символов "(", ")", "{", "}", "[", "]". Определите, является ли строка корректно расставленными скобками. Открывающая скобка должна закрываться тем же типом скобки в правильном порядке.',
      requirements: [
        'Входные данные: s = "()[]{}"',
        'Выходные данные: true',
        'Входные данные: s = "([)]" → false',
        'Использовать стек',
        'Обработать пустую строку и строку нечётной длины'
      ],
      expectedOutput: 'True\nFalse\nFalse\nTrue',
      hint: 'Для открывающей скобки — кладём в стек. Для закрывающей — проверяем, совпадает ли с вершиной стека. Если стек пуст или не совпадает — false. В конце стек должен быть пустым.',
      solution: 'def is_valid(s):\n    stack = []\n    # Маппинг: закрывающая -> открывающая\n    mapping = {")": "(", "}": "{", "]": "["}\n\n    for char in s:\n        if char in mapping:\n            # Закрывающая скобка\n            top = stack.pop() if stack else "#"\n            if mapping[char] != top:\n                return False\n        else:\n            # Открывающая скобка\n            stack.append(char)\n\n    return len(stack) == 0\n\n# Тест\nprint(is_valid("()[]{}"))   # True\nprint(is_valid("([)]"))     # False\nprint(is_valid("{[}"))      # False\nprint(is_valid(""))         # True (пустая строка валидна)',
      explanation: 'Временная сложность: O(n). Пространственная сложность: O(n) — стек может вырасти до n/2. Трюк с "#": если стек пуст при встрече закрывающей скобки, pop вернул бы ошибку. Вместо этого возвращаем "#" — символ, который не совпадёт ни с одной открывающей скобкой. mapping хранит соответствие "закрывающая -> открывающая": это позволяет проверять в одну строку. В конце стек должен быть пустым — все открытые скобки закрыты.'
    },
    {
      id: 2,
      type: 'practice',
      title: 'Min Stack',
      difficulty: 'medium',
      description: 'Разработайте стек, поддерживающий push, pop, top и getMin — все за O(1). getMin возвращает минимальный элемент стека.',
      requirements: [
        'push(val): добавить val в стек',
        'pop(): удалить верхний элемент',
        'top(): вернуть верхний элемент',
        'getMin(): вернуть минимум за O(1)',
        'Все операции за O(1)'
      ],
      expectedOutput: '-3\n0\n-2',
      hint: 'Используй два стека: основной stack и вспомогательный min_stack. min_stack хранит текущий минимум на каждом уровне. При push: кладём в min_stack min(val, min_stack[-1]). При pop: достаём из обоих.',
      solution: 'class MinStack:\n    def __init__(self):\n        self.stack = []      # Основной стек\n        self.min_stack = []  # Минимум на каждом уровне\n\n    def push(self, val):\n        self.stack.append(val)\n        # Минимум = min(val, текущий минимум)\n        if self.min_stack:\n            self.min_stack.append(min(val, self.min_stack[-1]))\n        else:\n            self.min_stack.append(val)\n\n    def pop(self):\n        self.stack.pop()\n        self.min_stack.pop()\n\n    def top(self):\n        return self.stack[-1]\n\n    def getMin(self):\n        return self.min_stack[-1]\n\n# Тест\nms = MinStack()\nms.push(-2)\nms.push(0)\nms.push(-3)\nprint(ms.getMin())  # -3\nms.pop()\nprint(ms.top())     # 0\nprint(ms.getMin())  # -2',
      explanation: 'Временная сложность: O(1) для всех операций. Пространственная сложность: O(n) — два стека. Ключевая идея: min_stack[i] хранит минимальный элемент среди stack[0..i]. При добавлении нового элемента новый минимум = min(новый элемент, предыдущий минимум). При удалении элемента — удаляем соответствующий минимум. Это гарантирует O(1) для getMin. Альтернатива: хранить в каждом элементе стека пару (val, current_min).'
    },
    {
      id: 3,
      type: 'practice',
      title: 'Evaluate Reverse Polish Notation',
      difficulty: 'medium',
      description: 'Дан массив токенов, представляющих арифметическое выражение в обратной польской записи (RPN). Вычислите результат. Операторы: +, -, *, /. Деление целочисленное (округление к нулю).',
      requirements: [
        'Входные данные: tokens = ["2","1","+","3","*"]',
        'Выходные данные: 9 ((2+1)*3)',
        'Входные данные: ["4","13","5","/","+"] → 6 (4+(13/5))',
        'Деление округляет к нулю: int(a/b) или (-3)//2 = -2 -> int(-3/2) = -1',
        'Использовать стек'
      ],
      expectedOutput: '9\n6\n22',
      hint: 'Для числа — кладём в стек. Для оператора — извлекаем два числа, применяем оператор, кладём результат обратно. Порядок важен: первый pop — правый операнд, второй pop — левый.',
      solution: 'def eval_rpn(tokens):\n    stack = []\n    operators = {"+", "-", "*", "/"}\n\n    for token in tokens:\n        if token not in operators:\n            stack.append(int(token))\n        else:\n            b = stack.pop()  # Правый операнд\n            a = stack.pop()  # Левый операнд\n\n            if token == "+":\n                stack.append(a + b)\n            elif token == "-":\n                stack.append(a - b)\n            elif token == "*":\n                stack.append(a * b)\n            elif token == "/":\n                # Целочисленное деление с округлением к нулю\n                stack.append(int(a / b))\n\n    return stack[0]\n\n# Тест\nprint(eval_rpn(["2","1","+","3","*"]))           # 9\nprint(eval_rpn(["4","13","5","/","+"]))          # 6\nprint(eval_rpn(["10","6","9","3","+","-11","*","/","*","17","+","5","+"]))  # 22',
      explanation: 'Временная сложность: O(n). Пространственная сложность: O(n). Важная деталь: порядок pop имеет значение для - и /. Второй pop — левый операнд. int(a/b) vs a//b: в Python (-3)//2 = -2 (floor division), а int(-3/2) = -1 (округление к нулю по условию задачи). RPN — основа для компиляторов и калькуляторов. Стек идеально подходит для вычисления выражений.'
    },
    {
      id: 4,
      type: 'practice',
      title: 'Daily Temperatures',
      difficulty: 'medium',
      description: 'Дан массив temperatures где temperatures[i] — температура в i-й день. Для каждого дня верните количество дней до следующего более тёплого дня. Если такого дня нет — 0.',
      requirements: [
        'Входные данные: temperatures = [73,74,75,71,69,72,76,73]',
        'Выходные данные: [1,1,4,2,1,1,0,0]',
        'Использовать монотонный стек (monotonic decreasing stack)',
        'Решение за O(n)',
        'Стек хранит индексы, а не значения температур'
      ],
      expectedOutput: '[1, 1, 4, 2, 1, 1, 0, 0]\n[1, 1, 0]',
      hint: 'Используй стек индексов. Для каждого дня i: пока стек не пуст И temperatures[i] > temperatures[stack[-1]], извлекай индекс j из стека и answer[j] = i - j. Кладём текущий i в стек.',
      solution: 'def daily_temperatures(temperatures):\n    n = len(temperatures)\n    answer = [0] * n\n    # Монотонный стек индексов (температуры убывают от дна к вершине)\n    stack = []\n\n    for i, temp in enumerate(temperatures):\n        # Пока текущая температура выше температуры на вершине стека\n        while stack and temp > temperatures[stack[-1]]:\n            j = stack.pop()\n            answer[j] = i - j  # Количество дней ожидания\n        stack.append(i)\n\n    # Элементы оставшиеся в стеке — нет более тёплого дня -> answer[j] = 0\n    return answer\n\n# Тест\nprint(daily_temperatures([73,74,75,71,69,72,76,73]))  # [1,1,4,2,1,1,0,0]\nprint(daily_temperatures([30,40,50]))                  # [1,1,0]\nprint(daily_temperatures([30,60,90]))                  # [1,1,0]',
      explanation: 'Временная сложность: O(n) — каждый элемент добавляется и удаляется из стека не более одного раза. Пространственная сложность: O(n). Монотонный стек: стек хранит индексы в порядке убывания температур. Когда находим более тёплый день — все более холодные дни из стека получают ответ. Паттерн "Next Greater Element" — очень частый на интервью, применяется к Largest Rectangle, Car Fleet и другим задачам.'
    },
    {
      id: 5,
      type: 'practice',
      title: 'Implement Queue using Stacks',
      difficulty: 'easy',
      description: 'Реализуйте очередь (FIFO) используя только два стека. Методы: push(x), pop(), peek(), empty(). Амортизированная сложность pop/peek — O(1).',
      requirements: [
        'push(x): добавить элемент в конец очереди',
        'pop(): удалить и вернуть первый элемент',
        'peek(): вернуть первый элемент без удаления',
        'empty(): вернуть true если очередь пуста',
        'Амортизированная O(1) для pop и peek'
      ],
      expectedOutput: '1\n1\nFalse\n2',
      hint: 'Два стека: input (для push) и output (для pop/peek). При pop/peek: если output пуст, перелить все из input в output (порядок инвертируется). Это делается не чаще одного раза для каждого элемента.',
      solution: 'class MyQueue:\n    def __init__(self):\n        self.input = []   # Для push\n        self.output = []  # Для pop/peek\n\n    def push(self, x):\n        self.input.append(x)\n\n    def pop(self):\n        self._transfer()\n        return self.output.pop()\n\n    def peek(self):\n        self._transfer()\n        return self.output[-1]\n\n    def empty(self):\n        return not self.input and not self.output\n\n    def _transfer(self):\n        """Перелить input в output если output пуст.\"\"\"\n        if not self.output:\n            while self.input:\n                self.output.append(self.input.pop())\n\n# Тест\nq = MyQueue()\nq.push(1)\nq.push(2)\nprint(q.peek())   # 1 (первый добавленный)\nprint(q.pop())    # 1\nprint(q.empty())  # False\nprint(q.pop())    # 2',
      explanation: 'Амортизированная сложность: O(1) для всех операций. Худший случай для pop/peek: O(n) когда output пуст и нужен перелив. Но каждый элемент переливается не более одного раза за всё время. Поэтому n операций = O(n) суммарно = O(1) амортизированно. Пространственная сложность: O(n). Это классическая задача на понимание амортизированного анализа. Обратная задача — Stack using Queues — также спрашивается.'
    },
    {
      id: 6,
      type: 'practice',
      title: 'Largest Rectangle in Histogram',
      difficulty: 'hard',
      description: 'Дан массив heights, где heights[i] — высота столбика гистограммы. Найдите площадь наибольшего прямоугольника в гистограмме.',
      requirements: [
        'Входные данные: heights = [2,1,5,6,2,3]',
        'Выходные данные: 10 (прямоугольник высотой 5, шириной 2 — столбики 2 и 3)',
        'Решение через монотонный стек за O(n)',
        'Расширенный массив с 0 в начале и конце для обработки границ',
        'Стек хранит индексы в порядке возрастания высот'
      ],
      expectedOutput: '10\n4',
      hint: 'Монотонный возрастающий стек. Когда встречаем высоту меньше вершины стека — вычисляем площадь для вершины. Ширина = i - stack[-1] - 1 (после pop). Добавь 0 в начало и конец массива.',
      solution: 'def largest_rectangle_area(heights):\n    # Добавляем 0 по краям для обработки всех случаев\n    heights = [0] + heights + [0]\n    stack = [0]  # Индексы, стек возрастающих высот\n    max_area = 0\n\n    for i in range(1, len(heights)):\n        # Пока текущая высота меньше вершины стека\n        while heights[i] < heights[stack[-1]]:\n            h = heights[stack.pop()]\n            # Ширина: от stack[-1]+1 до i-1\n            w = i - stack[-1] - 1\n            max_area = max(max_area, h * w)\n        stack.append(i)\n\n    return max_area\n\n# Тест\nprint(largest_rectangle_area([2,1,5,6,2,3]))  # 10\nprint(largest_rectangle_area([2,4]))           # 4',
      explanation: 'Временная сложность: O(n) — каждый индекс добавляется и удаляется не более одного раза. Пространственная сложность: O(n). Монотонный возрастающий стек: поддерживаем стек с возрастающими высотами. Когда высота падает, вытолкнутый элемент — это "бутылочное горлышко" прямоугольника. Ширина вычисляется как i - stack[-1] - 1: левая граница определяется новой вершиной стека (первый более низкий слева), правая — текущим i. Нули по краям гарантируют, что все элементы будут вытолкнуты в конце.'
    },
    {
      id: 7,
      type: 'practice',
      title: 'Sliding Window Maximum',
      difficulty: 'hard',
      description: 'Дан массив nums и число k. Найдите максимум в каждом скользящем окне размера k. Верните массив максимумов.',
      requirements: [
        'Входные данные: nums = [1,3,-1,-3,5,3,6,7], k = 3',
        'Выходные данные: [3,3,5,5,6,7]',
        'Наивный подход O(n*k) — слишком медленно',
        'Оптимальный через деке (deque): O(n)',
        'Деке хранит индексы в порядке убывания значений'
      ],
      expectedOutput: '[3, 3, 5, 5, 6, 7]\n[3, 3, 2, 5]',
      hint: 'Используй collections.deque. Деке хранит индексы убывающих значений. При добавлении нового элемента: удаляй из конца деке все индексы меньших элементов. Удаляй из начала индексы вышедшие за окно. Максимум окна — deque[0].',
      solution: 'from collections import deque\n\ndef max_sliding_window(nums, k):\n    result = []\n    dq = deque()  # Хранит индексы, значения убывают\n\n    for i, num in enumerate(nums):\n        # Удаляем индексы вышедшие за левую границу окна\n        if dq and dq[0] <= i - k:\n            dq.popleft()\n\n        # Удаляем из конца все элементы меньше текущего\n        # (они никогда не будут максимумом)\n        while dq and nums[dq[-1]] < num:\n            dq.pop()\n\n        dq.append(i)\n\n        # Добавляем максимум когда окно полностью сформировано\n        if i >= k - 1:\n            result.append(nums[dq[0]])\n\n    return result\n\n# Тест\nprint(max_sliding_window([1,3,-1,-3,5,3,6,7], 3))  # [3,3,5,5,6,7]\nprint(max_sliding_window([1,-1], 1))                # [1,-1]\nprint(max_sliding_window([9,11,8,5,7,10], 3))       # [11,11,8,10] -- wait, let me recalculate\n# [9,11,8]: max=11; [11,8,5]: max=11; [8,5,7]: max=8; [5,7,10]: max=10\nprint(max_sliding_window([9,11,8,5,7,10], 3))       # [11,11,8,10]',
      explanation: 'Временная сложность: O(n) — каждый элемент добавляется и удаляется из деке не более одного раза. Пространственная сложность: O(k) — деке хранит не более k элементов. Монотонный убывающий деке: сохраняем только "полезные" кандидаты на максимум. Элемент становится бесполезным если слева от него (в том же окне) есть более большой элемент. dq[0] всегда хранит индекс максимума текущего окна. Это Hard задача — паттерн "monotonic deque" используется в нескольких задачах LeetCode.'
    },
    {
      id: 8,
      type: 'practice',
      title: 'Car Fleet',
      difficulty: 'medium',
      description: 'n автомобилей едут к финишу на позиции target. position[i] — начальная позиция, speed[i] — скорость. Более медленная машина впереди блокирует более быструю. Они образуют флот. Сколько флотов прибудет к финишу?',
      requirements: [
        'Входные данные: target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]',
        'Выходные данные: 3',
        'Сортировать по позиции (ближайшие к финишу — первые)',
        'Вычислить время прибытия для каждой машины',
        'Использовать стек: если следующая машина прибывает не позже предыдущей — они один флот'
      ],
      expectedOutput: '3\n1',
      hint: 'Отсортируй машины по убыванию позиции. Для каждой вычисли time = (target - pos) / speed. Используй стек: если time <= stack[-1] — машина догоняет предыдущую (один флот). Иначе — новый флот, push в стек.',
      solution: 'def car_fleet(target, position, speed):\n    # Пары (позиция, скорость), отсортированные по убыванию позиции\n    pairs = sorted(zip(position, speed), reverse=True)\n    stack = []  # Хранит время прибытия\n\n    for pos, spd in pairs:\n        time = (target - pos) / spd\n        # Если эта машина прибывает позже машины впереди -> новый флот\n        if not stack or time > stack[-1]:\n            stack.append(time)\n        # Иначе машина догоняет (или прибывает одновременно) -> тот же флот\n        # (ничего не делаем, машина поглощается флотом впереди)\n\n    return len(stack)\n\n# Тест\nprint(car_fleet(12, [10,8,0,5,3], [2,4,1,1,3]))  # 3\nprint(car_fleet(10, [3], [3]))                    # 1',
      explanation: 'Временная сложность: O(n log n) — сортировка. Пространственная сложность: O(n) — стек. Ключевая идея: сортируем по убыванию позиции (от ближайшей к финишу). Более быстрая машина СЗАДИ не может обогнать медленную СПЕРЕДИ — она образует с ней флот. Если time <= stack[-1] — машина сзади прибывает одновременно или раньше, чем "флот" впереди. Значит она его догонит и присоединится. Количество элементов в стеке в конце = количество независимых флотов.'
    }
  ]
}
