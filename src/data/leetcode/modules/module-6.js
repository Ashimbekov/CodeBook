export default {
  id: 6,
  title: 'Stack паттерны',
  description: 'Паттерны со стеком: monotonic stack, скобки, калькулятор, обработка вложенных структур.',
  lessons: [
    {
      id: 1,
      title: 'Stack паттерны на собеседованиях',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Когда использовать стек?'
        },
        {
          type: 'text',
          value: 'Стек (LIFO) — идеальная структура для задач, где нужно обрабатывать элементы в обратном порядке, отслеживать вложенность или находить ближайший больший/меньший элемент.'
        },
        {
          type: 'list',
          value: [
            'Matching brackets — проверка и сопоставление скобок',
            'Monotonic Stack — нахождение следующего большего/меньшего элемента',
            'Expression evaluation — вычисление выражений (калькулятор)',
            'Nested structures — декодирование вложенных строк',
            'History tracking — undo/redo, навигация по истории'
          ]
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Monotonic Stack — шаблон\n// Находит для каждого элемента следующий больший\nfunction nextGreater(nums) {\n  const result = new Array(nums.length).fill(-1);\n  const stack = []; // стек индексов\n\n  for (let i = 0; i < nums.length; i++) {\n    // Пока текущий элемент больше верхушки стека\n    while (stack.length && nums[i] > nums[stack[stack.length - 1]]) {\n      const idx = stack.pop();\n      result[idx] = nums[i];\n    }\n    stack.push(i);\n  }\n\n  return result;\n}\n\n// [2,1,2,4,3] → [4,2,4,-1,-1]\n// Для 2: следующий больший = 4\n// Для 1: следующий больший = 2'
        },
        {
          type: 'tip',
          value: 'Monotonic Stack работает за O(n): каждый элемент кладётся в стек ровно один раз и извлекается максимум один раз.'
        }
      ]
    },
    {
      id: 2,
      title: 'Monotonic Stack: теория и варианты',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Четыре варианта Monotonic Stack'
        },
        {
          type: 'text',
          value: 'В зависимости от задачи, стек может быть возрастающим или убывающим, и мы можем искать следующий или предыдущий больший/меньший элемент.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// 1. Следующий больший элемент (Next Greater)\n// Стек: убывающий (сверху — меньшие)\nfunction nextGreater(nums) {\n  const n = nums.length;\n  const res = new Array(n).fill(-1);\n  const stack = [];\n  for (let i = 0; i < n; i++) {\n    while (stack.length && nums[i] > nums[stack.at(-1)]) {\n      res[stack.pop()] = nums[i];\n    }\n    stack.push(i);\n  }\n  return res;\n}\n\n// 2. Следующий меньший элемент (Next Smaller)\n// Стек: возрастающий (сверху — большие)\nfunction nextSmaller(nums) {\n  const n = nums.length;\n  const res = new Array(n).fill(-1);\n  const stack = [];\n  for (let i = 0; i < n; i++) {\n    while (stack.length && nums[i] < nums[stack.at(-1)]) {\n      res[stack.pop()] = nums[i];\n    }\n    stack.push(i);\n  }\n  return res;\n}\n\n// 3. Предыдущий больший — итерация справа налево\n// 4. Предыдущий меньший — итерация справа налево'
        },
        {
          type: 'note',
          value: 'Запомните: "следующий больший" = убывающий стек + итерация слева направо. "Предыдущий больший" = убывающий стек + итерация справа налево. Для "меньший" — меняем направление сравнения.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Valid Parentheses',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #20: проверьте, является ли строка из скобок валидной.',
      requirements: [
        'Реализуйте функцию isValid(s)',
        'Строка содержит только символы: ()[]{}',
        'Каждая открывающая скобка должна закрываться соответствующей',
        'Скобки должны закрываться в правильном порядке'
      ],
      hint: 'Кладите открывающие скобки в стек. При встрече закрывающей — проверьте, совпадает ли она с верхушкой стека.',
      expectedOutput: 'isValid("()") -> true\nisValid("()[]{}") -> true\nisValid("(]") -> false\nisValid("([)]") -> false\nisValid("{[]}") -> true',
      solution: 'function isValid(s) {\n  const stack = [];\n  const pairs = { ")": "(", "]": "[", "}": "{" };\n\n  for (const ch of s) {\n    if (ch in pairs) {\n      // Закрывающая скобка\n      if (!stack.length || stack[stack.length - 1] !== pairs[ch]) {\n        return false;\n      }\n      stack.pop();\n    } else {\n      // Открывающая скобка\n      stack.push(ch);\n    }\n  }\n\n  return stack.length === 0;\n}\n\nconsole.log(isValid("()")); // true\nconsole.log(isValid("()[]{}")); // true\nconsole.log(isValid("(]")); // false\nconsole.log(isValid("([)]")); // false\nconsole.log(isValid("{[]}")); // true',
      explanation: 'Классическая задача на стек. Открывающие скобки кладём в стек, закрывающие — сравниваем с верхушкой. Если не совпадает или стек пуст — невалидно. В конце стек должен быть пуст. O(n) время, O(n) память.'
    },
    {
      id: 4,
      title: 'Практика: Daily Temperatures',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #739: для каждого дня найдите, через сколько дней будет теплее.',
      requirements: [
        'Реализуйте функцию dailyTemperatures(temperatures)',
        'Для каждого дня верните количество дней до следующего более тёплого дня',
        'Если более тёплого дня нет — 0',
        'Используйте Monotonic Stack — O(n)'
      ],
      hint: 'Используйте убывающий стек индексов. Когда текущая температура выше верхушки стека — вычисляем разницу индексов.',
      expectedOutput: 'dailyTemperatures([73,74,75,71,69,72,76,73]) -> [1,1,4,2,1,1,0,0]\ndailyTemperatures([30,40,50,60]) -> [1,1,1,0]',
      solution: 'function dailyTemperatures(temperatures) {\n  const n = temperatures.length;\n  const result = new Array(n).fill(0);\n  const stack = []; // стек индексов\n\n  for (let i = 0; i < n; i++) {\n    while (\n      stack.length &&\n      temperatures[i] > temperatures[stack[stack.length - 1]]\n    ) {\n      const prevIdx = stack.pop();\n      result[prevIdx] = i - prevIdx;\n    }\n    stack.push(i);\n  }\n\n  return result;\n}\n\nconsole.log(dailyTemperatures([73,74,75,71,69,72,76,73]));\n// [1,1,4,2,1,1,0,0]\n\n// Разбор для 75 (индекс 2):\n// Стек ищет следующий день теплее 75°\n// 71, 69, 72 — нет. 76 (индекс 6) — да!\n// result[2] = 6 - 2 = 4',
      explanation: 'Monotonic Stack: храним индексы дней с убывающими температурами. Когда встречаем более тёплый день — извлекаем из стека все дни, для которых текущий день является "следующим более тёплым". Каждый элемент входит и выходит из стека ровно один раз — O(n).'
    },
    {
      id: 5,
      title: 'Практика: Largest Rectangle in Histogram',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #84: найдите площадь наибольшего прямоугольника в гистограмме.',
      requirements: [
        'Реализуйте функцию largestRectangleArea(heights)',
        'heights[i] — высота столбца i',
        'Найдите площадь наибольшего прямоугольника, который можно вписать в гистограмму',
        'Решение O(n) с Monotonic Stack'
      ],
      hint: 'Для каждого столбца найдите, как далеко он может расшириться влево и вправо (до первого столбца ниже). Используйте стек.',
      expectedOutput: 'largestRectangleArea([2,1,5,6,2,3]) -> 10\nlargestRectangleArea([2,4]) -> 4',
      solution: 'function largestRectangleArea(heights) {\n  const stack = []; // стек индексов\n  let maxArea = 0;\n\n  // Добавляем 0 в конец для обработки оставшихся в стеке\n  heights.push(0);\n\n  for (let i = 0; i < heights.length; i++) {\n    while (stack.length && heights[i] < heights[stack[stack.length - 1]]) {\n      const height = heights[stack.pop()];\n      // Ширина: от элемента слева в стеке до i\n      const width = stack.length ? i - stack[stack.length - 1] - 1 : i;\n      maxArea = Math.max(maxArea, height * width);\n    }\n    stack.push(i);\n  }\n\n  heights.pop(); // восстанавливаем массив\n  return maxArea;\n}\n\nconsole.log(largestRectangleArea([2,1,5,6,2,3])); // 10\n// Прямоугольник высотой 5, шириной 2 (столбцы 5 и 6)\n\nconsole.log(largestRectangleArea([2,4])); // 4',
      explanation: 'Для каждого столбца при извлечении из стека мы знаем: справа ограничивает текущий элемент i, слева — элемент под ним в стеке. Ширина = i - stack.top - 1. Добавление 0 в конец гарантирует, что все столбцы будут обработаны. Это одна из самых элегантных задач на Monotonic Stack.'
    },
    {
      id: 6,
      title: 'Практика: Evaluate Reverse Polish Notation',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #150: вычислите значение арифметического выражения в обратной польской записи.',
      requirements: [
        'Реализуйте функцию evalRPN(tokens)',
        'tokens — массив строк с числами и операторами (+, -, *, /)',
        'Деление округляется к нулю',
        'Используйте стек'
      ],
      hint: 'Числа кладите в стек. При встрече оператора — извлекайте два числа, выполняйте операцию, результат кладите обратно.',
      expectedOutput: 'evalRPN(["2","1","+","3","*"]) -> 9\nevalRPN(["4","13","5","/","+"]) -> 6\nevalRPN(["10","6","9","3","+","-11","*","/","*","17","+","5","+"]) -> 22',
      solution: 'function evalRPN(tokens) {\n  const stack = [];\n  const ops = {\n    "+": (a, b) => a + b,\n    "-": (a, b) => a - b,\n    "*": (a, b) => a * b,\n    "/": (a, b) => Math.trunc(a / b), // округление к нулю\n  };\n\n  for (const token of tokens) {\n    if (token in ops) {\n      const b = stack.pop();\n      const a = stack.pop();\n      stack.push(ops[token](a, b));\n    } else {\n      stack.push(Number(token));\n    }\n  }\n\n  return stack[0];\n}\n\nconsole.log(evalRPN(["2","1","+","3","*"])); // 9\n// 2+1=3, 3*3=9\n\nconsole.log(evalRPN(["4","13","5","/","+"])); // 6\n// 13/5=2, 4+2=6',
      explanation: 'Обратная польская запись (RPN) идеально обрабатывается стеком: числа кладём, операторы — извлекаем два операнда и выполняем операцию. Обратите внимание на порядок: первый извлечённый (b) — правый операнд, второй (a) — левый. Math.trunc для целочисленного деления.'
    },
    {
      id: 7,
      title: 'Практика: Min Stack',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #155: реализуйте стек, который поддерживает push, pop, top и getMin за O(1).',
      requirements: [
        'Реализуйте класс MinStack',
        'push(val) — добавить элемент',
        'pop() — удалить верхний элемент',
        'top() — получить верхний элемент',
        'getMin() — получить минимальный элемент за O(1)'
      ],
      hint: 'Используйте два стека: основной и стек минимумов. При push в стек минимумов кладём min(val, currentMin).',
      expectedOutput: 'MinStack: push(-2), push(0), push(-3)\ngetMin() -> -3\npop()\ntop() -> 0\ngetMin() -> -2',
      solution: 'class MinStack {\n  constructor() {\n    this.stack = [];\n    this.minStack = []; // хранит минимум для каждого состояния\n  }\n\n  push(val) {\n    this.stack.push(val);\n    const min = this.minStack.length\n      ? Math.min(val, this.minStack[this.minStack.length - 1])\n      : val;\n    this.minStack.push(min);\n  }\n\n  pop() {\n    this.stack.pop();\n    this.minStack.pop();\n  }\n\n  top() {\n    return this.stack[this.stack.length - 1];\n  }\n\n  getMin() {\n    return this.minStack[this.minStack.length - 1];\n  }\n}\n\nconst ms = new MinStack();\nms.push(-2);\nms.push(0);\nms.push(-3);\nconsole.log(ms.getMin()); // -3\nms.pop();\nconsole.log(ms.top()); // 0\nconsole.log(ms.getMin()); // -2\n\n// minStack хранит: [-2, -2, -3]\n// После pop(): [-2, -2]\n// getMin() = -2',
      explanation: 'Идея: параллельный стек минимумов хранит текущий минимум на каждом "уровне". При push мы добавляем min(val, текущий минимум). При pop — оба стека синхронно удаляют элемент. getMin просто возвращает верхушку стека минимумов. Все операции O(1), дополнительная память O(n).'
    }
  ]
}
