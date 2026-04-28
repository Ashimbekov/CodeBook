export default {
  id: 29,
  title: 'Monotonic Stack и Queue',
  description: 'Монотонный стек и монотонная очередь — мощные инструменты для задач на поиск ближайших больших/меньших элементов, скользящее окно и оптимизацию динамического программирования.',
  lessons: [
    {
      id: 1,
      title: 'Что такое монотонный стек',
      type: 'theory',
      content: [
        { type: 'text', value: 'Монотонный стек (Monotonic Stack) — стек, элементы которого поддерживаются в строго возрастающем или убывающем порядке. При добавлении нового элемента мы выталкиваем все элементы, нарушающие монотонность.' },
        { type: 'tip', value: 'Представьте очередь людей по росту. Пришёл высокий человек — все, кто ниже него, уходят. Остаётся только возрастающая последовательность ростов. Это монотонно убывающий стек (от дна к вершине — убывание). Для каждого "ушедшего" мы нашли его "следующего большего"!' },
        { type: 'heading', value: 'Виды монотонных стеков' },
        { type: 'code', language: 'java', value: '// Монотонно возрастающий стек (от дна к вершине — возрастание)\n// Пример: [1, 3, 5, 7]\n// При добавлении 4: выталкиваем 5, 7 -> [1, 3, 4]\n//\n// Монотонно убывающий стек (от дна к вершине — убывание)\n// Пример: [7, 5, 3, 1]\n// При добавлении 4: выталкиваем 3, 1 -> [7, 5, 4]\n//\n// Ключевая идея:\n// - Возрастающий стек -> находит Previous Smaller Element\n// - Убывающий стек -> находит Previous Greater Element\n// - При выталкивании -> текущий элемент = Next Greater/Smaller для вытолкнутого' },
        { type: 'heading', value: 'Базовый паттерн монотонного стека' },
        { type: 'code', language: 'java', value: 'import java.util.Stack;\n\npublic class MonotonicStackBasic {\n    public static void main(String[] args) {\n        int[] arr = {3, 1, 4, 1, 5, 9, 2, 6};\n\n        // Монотонно возрастающий стек (хранит индексы)\n        Stack<Integer> stack = new Stack<>();\n\n        System.out.println("Обработка массива: [3, 1, 4, 1, 5, 9, 2, 6]");\n        for (int i = 0; i < arr.length; i++) {\n            // Выталкиваем элементы >= текущего\n            while (!stack.isEmpty() && arr[stack.peek()] >= arr[i]) {\n                int popped = stack.pop();\n                System.out.println("Элемент " + arr[popped] +\n                    " (idx=" + popped + ") вытолкнут элементом " +\n                    arr[i] + " (idx=" + i + ")");\n            }\n            stack.push(i);\n        }\n\n        // Оставшиеся в стеке — элементы без \"следующего меньшего\"\n        System.out.println("\\nОстались в стеке:");\n        while (!stack.isEmpty()) {\n            int idx = stack.pop();\n            System.out.println("  " + arr[idx] + " (idx=" + idx + ")");\n        }\n    }\n}' },
        { type: 'heading', value: 'Сложность' },
        { type: 'text', value: 'Каждый элемент добавляется в стек ровно 1 раз и удаляется из стека максимум 1 раз. Итого: O(n) для обработки всего массива, несмотря на вложенный while!' },
        { type: 'warning', value: 'Частая ошибка: хранить в стеке значения вместо индексов. Индексы нужны почти всегда — они позволяют найти расстояние между элементами, а значение всегда можно получить по индексу.' }
      ]
    },
    {
      id: 2,
      title: 'Next Greater Element',
      type: 'theory',
      content: [
        { type: 'text', value: 'Next Greater Element (NGE) — для каждого элемента массива найти первый элемент справа, который строго больше него. Если такого нет — ответ -1. Решается монотонным стеком за O(n).' },
        { type: 'heading', value: 'Реализация Next Greater Element' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class NextGreaterElement {\n    // Для каждого arr[i] найти первый элемент справа > arr[i]\n    public static int[] nextGreater(int[] arr) {\n        int n = arr.length;\n        int[] result = new int[n];\n        Arrays.fill(result, -1); // По умолчанию: нет большего\n\n        // Монотонно убывающий стек (от дна к вершине)\n        // Храним индексы\n        Stack<Integer> stack = new Stack<>();\n\n        for (int i = 0; i < n; i++) {\n            // Пока текущий > вершины стека:\n            // текущий — это NGE для элемента на вершине\n            while (!stack.isEmpty() && arr[stack.peek()] < arr[i]) {\n                int idx = stack.pop();\n                result[idx] = arr[i];\n            }\n            stack.push(i);\n        }\n        // Элементы, оставшиеся в стеке, не имеют NGE -> -1\n\n        return result;\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {4, 5, 2, 10, 8};\n        int[] nge = nextGreater(arr);\n\n        System.out.println("Массив:  " + Arrays.toString(arr));\n        System.out.println("NGE:     " + Arrays.toString(nge));\n        // arr = [4,  5,  2, 10, 8]\n        // NGE = [5, 10, 10, -1, -1]\n        // 4 -> 5 (первый больший справа)\n        // 5 -> 10\n        // 2 -> 10\n        // 10 -> -1 (нет большего)\n        // 8 -> -1\n    }\n}' },
        { type: 'heading', value: 'Трассировка алгоритма' },
        { type: 'code', language: 'java', value: '// arr = [4, 5, 2, 10, 8]\n//\n// i=0 (arr[0]=4): стек пуст -> push(0). Стек: [0]\n//\n// i=1 (arr[1]=5): arr[0]=4 < 5 -> pop(0), result[0]=5. Стек: []\n//                 push(1). Стек: [1]\n//\n// i=2 (arr[2]=2): arr[1]=5 >= 2 -> не выталкиваем\n//                 push(2). Стек: [1, 2]\n//\n// i=3 (arr[3]=10): arr[2]=2 < 10 -> pop(2), result[2]=10. Стек: [1]\n//                  arr[1]=5 < 10 -> pop(1), result[1]=10. Стек: []\n//                  push(3). Стек: [3]\n//\n// i=4 (arr[4]=8): arr[3]=10 >= 8 -> не выталкиваем\n//                 push(4). Стек: [3, 4]\n//\n// Оставшиеся: idx 3 и 4 -> result[3]=-1, result[4]=-1\n// Результат: [5, 10, 10, -1, -1]' },
        { type: 'tip', value: 'Для циклического массива (Next Greater Element II) обрабатывайте массив дважды: for (int i = 0; i < 2*n; i++) и используйте i % n как индекс.' }
      ]
    },
    {
      id: 3,
      title: 'Previous Smaller Element',
      type: 'theory',
      content: [
        { type: 'text', value: 'Previous Smaller Element (PSE) — для каждого элемента найти ближайший меньший элемент слева. Решается монотонно возрастающим стеком: элемент на вершине стека — PSE для текущего элемента.' },
        { type: 'heading', value: 'Реализация Previous Smaller Element' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class PreviousSmallerElement {\n    public static int[] previousSmaller(int[] arr) {\n        int n = arr.length;\n        int[] result = new int[n];\n        Arrays.fill(result, -1);\n\n        // Монотонно возрастающий стек\n        Stack<Integer> stack = new Stack<>();\n\n        for (int i = 0; i < n; i++) {\n            // Удаляем все >= текущего (они не могут быть PSE)\n            while (!stack.isEmpty() && arr[stack.peek()] >= arr[i]) {\n                stack.pop();\n            }\n            // Вершина стека — ближайший меньший слева\n            if (!stack.isEmpty()) {\n                result[i] = arr[stack.peek()];\n            }\n            stack.push(i);\n        }\n\n        return result;\n    }\n\n    // Также: Previous Smaller Element Index (для расстояний)\n    public static int[] previousSmallerIndex(int[] arr) {\n        int n = arr.length;\n        int[] result = new int[n];\n        Arrays.fill(result, -1); // -1 = нет меньшего слева\n\n        Stack<Integer> stack = new Stack<>();\n        for (int i = 0; i < n; i++) {\n            while (!stack.isEmpty() && arr[stack.peek()] >= arr[i]) {\n                stack.pop();\n            }\n            if (!stack.isEmpty()) {\n                result[i] = stack.peek(); // Индекс, а не значение\n            }\n            stack.push(i);\n        }\n        return result;\n    }\n\n    public static void main(String[] args) {\n        int[] arr = {4, 5, 2, 10, 8};\n\n        System.out.println("Массив: " + Arrays.toString(arr));\n        System.out.println("PSE:    " + Arrays.toString(previousSmaller(arr)));\n        System.out.println("PSE idx:" + Arrays.toString(previousSmallerIndex(arr)));\n        // arr = [4,  5,  2, 10, 8]\n        // PSE = [-1, 4, -1,  2, 2]\n        // idx = [-1, 0, -1,  2, 2]\n    }\n}' },
        { type: 'heading', value: 'Все четыре варианта задач' },
        { type: 'code', language: 'java', value: '// Четыре классических задачи на монотонный стек:\n//\n// 1. Next Greater Element (NGE):\n//    Убывающий стек, обход слева направо\n//    При pop: result[popped] = current\n//\n// 2. Next Smaller Element (NSE):\n//    Возрастающий стек, обход слева направо\n//    При pop: result[popped] = current\n//\n// 3. Previous Greater Element (PGE):\n//    Убывающий стек, обход слева направо\n//    Вершина стека = PGE для current\n//\n// 4. Previous Smaller Element (PSE):\n//    Возрастающий стек, обход слева направо\n//    Вершина стека = PSE для current\n//\n// Мнемоника:\n// "Next" — ответ находится при ВЫТАЛКИВАНИИ (pop)\n// "Previous" — ответ находится на ВЕРШИНЕ СТЕКА (peek)\n// "Greater" — убывающий стек\n// "Smaller" — возрастающий стек' },
        { type: 'tip', value: 'Все четыре варианта решаются одним и тем же паттерном: цикл for + while с pop + push. Отличается только (1) направление стека (возрастающий/убывающий) и (2) момент записи ответа (при pop или при peek).' }
      ]
    },
    {
      id: 4,
      title: 'Монотонная очередь',
      type: 'theory',
      content: [
        { type: 'text', value: 'Монотонная очередь (Monotonic Deque) — двусторонняя очередь, элементы которой поддерживаются в монотонном порядке. Позволяет за O(1) получить минимум/максимум текущего окна. Используется в задачах скользящего окна.' },
        { type: 'heading', value: 'Разница между монотонным стеком и очередью' },
        { type: 'code', language: 'java', value: '// Монотонный стек:\n//   - Добавление с одного конца (push)\n//   - Удаление с одного конца (pop)\n//   - Используется для: NGE, PSE и подобных задач\n//\n// Монотонная очередь (deque):\n//   - Добавление с одного конца (addLast)\n//   - Удаление с ОБОИХ концов (removeFirst, removeLast)\n//   - removeFirst: удаление "старых" элементов, вышедших из окна\n//   - removeLast: поддержание монотонности\n//   - Используется для: скользящее окно min/max' },
        { type: 'heading', value: 'Реализация монотонной очереди' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class MonotonicDeque {\n    // Монотонная очередь для максимума\n    // Deque хранит ИНДЕКСЫ\n    // Значения от дна к вершине — убывающие\n    // Голова (peekFirst) — индекс максимального элемента в текущем окне\n\n    public static void demonstrate() {\n        int[] arr = {1, 3, -1, -3, 5, 3, 6, 7};\n        int k = 3; // Размер окна\n\n        Deque<Integer> deque = new ArrayDeque<>();\n\n        System.out.println("Массив: " + Arrays.toString(arr));\n        System.out.println("Размер окна: " + k);\n        System.out.println();\n\n        for (int i = 0; i < arr.length; i++) {\n            // 1. Удаляем из хвоста: все, кто меньше текущего\n            while (!deque.isEmpty() && arr[deque.peekLast()] <= arr[i]) {\n                deque.removeLast();\n            }\n            deque.addLast(i);\n\n            // 2. Удаляем из головы: элемент вышел за окно\n            if (deque.peekFirst() <= i - k) {\n                deque.removeFirst();\n            }\n\n            // 3. Когда окно сформировано — голова = максимум\n            if (i >= k - 1) {\n                System.out.println("Окно [" + (i - k + 1) + ".." + i + "]: " +\n                    "max = " + arr[deque.peekFirst()]);\n            }\n        }\n    }\n\n    public static void main(String[] args) {\n        demonstrate();\n        // Окно [0..2]: max = 3\n        // Окно [1..3]: max = 3\n        // Окно [2..4]: max = 5\n        // Окно [3..5]: max = 5\n        // Окно [4..6]: max = 6\n        // Окно [5..7]: max = 7\n    }\n}' },
        { type: 'tip', value: 'Монотонная очередь — это как "VIP-зал": входящий выгоняет всех, кто слабее, но старые VIP-персоны уходят по времени (когда окно сдвигается). Голова очереди — всегда самый "сильный" в текущем окне.' }
      ]
    },
    {
      id: 5,
      title: 'Sliding Window Maximum',
      type: 'theory',
      content: [
        { type: 'text', value: 'Sliding Window Maximum — классическая задача: дан массив и размер окна k, найти максимум в каждом окне размера k. Наивное решение O(n*k), с монотонной очередью — O(n).' },
        { type: 'heading', value: 'Полное решение Sliding Window Maximum' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\npublic class SlidingWindowMax {\n    public static int[] maxSlidingWindow(int[] nums, int k) {\n        if (nums.length == 0 || k == 0) return new int[0];\n        int n = nums.length;\n        int[] result = new int[n - k + 1]; // Количество окон\n\n        // Монотонно убывающая очередь (deque)\n        // Голова = индекс максимума текущего окна\n        Deque<Integer> deque = new ArrayDeque<>();\n\n        for (int i = 0; i < n; i++) {\n            // 1. Удаляем из головы: вышедшие за пределы окна\n            while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {\n                deque.removeFirst();\n            }\n\n            // 2. Удаляем из хвоста: все элементы <= текущему\n            //    (они никогда не будут максимумом, пока текущий в окне)\n            while (!deque.isEmpty() && nums[deque.peekLast()] <= nums[i]) {\n                deque.removeLast();\n            }\n\n            // 3. Добавляем текущий\n            deque.addLast(i);\n\n            // 4. Записываем максимум (когда окно полностью сформировано)\n            if (i >= k - 1) {\n                result[i - k + 1] = nums[deque.peekFirst()];\n            }\n        }\n        return result;\n    }\n\n    public static void main(String[] args) {\n        int[] nums = {1, 3, -1, -3, 5, 3, 6, 7};\n        int k = 3;\n\n        int[] result = maxSlidingWindow(nums, k);\n        System.out.println("Массив: " + Arrays.toString(nums));\n        System.out.println("k = " + k);\n        System.out.println("Максимумы окон: " + Arrays.toString(result));\n        // [3, 3, 5, 5, 6, 7]\n    }\n}' },
        { type: 'heading', value: 'Пошаговая трассировка' },
        { type: 'code', language: 'java', value: '// nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3\n//\n// i=0 (val=1): deque=[], push(0) -> deque=[0]\n// i=1 (val=3): nums[0]=1 <= 3, removeLast -> deque=[]\n//              push(1) -> deque=[1]\n// i=2 (val=-1): nums[1]=3 > -1, не удаляем\n//              push(2) -> deque=[1, 2]\n//              ОКНО [0..2]: max = nums[1] = 3. result[0]=3\n//\n// i=3 (val=-3): nums[2]=-1 > -3, не удаляем\n//              push(3) -> deque=[1, 2, 3]\n//              ОКНО [1..3]: max = nums[1] = 3. result[1]=3\n//\n// i=4 (val=5): nums[3]=-3 <= 5, removeLast. deque=[1, 2]\n//              nums[2]=-1 <= 5, removeLast. deque=[1]\n//              nums[1]=3 <= 5, removeLast. deque=[]\n//              push(4) -> deque=[4]\n//              ОКНО [2..4]: max = nums[4] = 5. result[2]=5\n//\n// i=5 (val=3): nums[4]=5 > 3, не удаляем\n//              push(5) -> deque=[4, 5]\n//              ОКНО [3..5]: max = nums[4] = 5. result[3]=5\n//\n// i=6 (val=6): nums[5]=3 <= 6, removeLast. deque=[4]\n//              nums[4]=5 <= 6, removeLast. deque=[]\n//              push(6) -> deque=[6]\n//              ОКНО [4..6]: max = nums[6] = 6. result[4]=6\n//\n// i=7 (val=7): nums[6]=6 <= 7, removeLast. deque=[]\n//              push(7) -> deque=[7]\n//              ОКНО [5..7]: max = nums[7] = 7. result[5]=7\n//\n// result = [3, 3, 5, 5, 6, 7]' },
        { type: 'tip', value: 'Sliding Window Minimum решается аналогично — замените <= на >= при removeLast. Голова deque будет хранить индекс минимума.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Daily Temperatures',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив temperatures — температуры за n дней. Для каждого дня найдите, через сколько дней будет более тёплая погода. Если такого дня нет, запишите 0.',
      requirements: [
        'Метод dailyTemperatures(int[] temperatures): возвращает int[] с ответами',
        'Используйте монотонно убывающий стек (хранить индексы)',
        'При выталкивании: result[popped] = i - popped (разница индексов)',
        'Сложность: O(n) по времени, O(n) по памяти',
        'Тест 1: [73, 74, 75, 71, 69, 72, 76, 73] -> [1, 1, 4, 2, 1, 1, 0, 0]',
        'Тест 2: [30, 40, 50, 60] -> [1, 1, 1, 0]'
      ],
      expectedOutput: 'temperatures = [73, 74, 75, 71, 69, 72, 76, 73]\nresult = [1, 1, 4, 2, 1, 1, 0, 0]\n\ntemperatures = [30, 40, 50, 60]\nresult = [1, 1, 1, 0]\n\ntemperatures = [30, 20, 10]\nresult = [0, 0, 0]',
      hint: 'Используйте стек для хранения индексов дней с "неотвеченными" температурами. Когда текущая температура выше вершины стека — вычисляйте разницу индексов и записывайте в result.',
      solution: 'import java.util.*;\n\npublic class DailyTemperatures {\n    public static int[] dailyTemperatures(int[] temperatures) {\n        int n = temperatures.length;\n        int[] result = new int[n];\n        // Монотонно убывающий стек (хранит индексы)\n        Stack<Integer> stack = new Stack<>();\n\n        for (int i = 0; i < n; i++) {\n            // Выталкиваем все дни, для которых текущий день — теплее\n            while (!stack.isEmpty() &&\n                   temperatures[stack.peek()] < temperatures[i]) {\n                int prevDay = stack.pop();\n                result[prevDay] = i - prevDay; // Через сколько дней\n            }\n            stack.push(i);\n        }\n        // Оставшиеся в стеке — дни без более тёплого -> result[i] = 0\n        return result;\n    }\n\n    public static void main(String[] args) {\n        int[] t1 = {73, 74, 75, 71, 69, 72, 76, 73};\n        System.out.println("temperatures = " + Arrays.toString(t1));\n        System.out.println("result = " + Arrays.toString(dailyTemperatures(t1)));\n        System.out.println();\n\n        int[] t2 = {30, 40, 50, 60};\n        System.out.println("temperatures = " + Arrays.toString(t2));\n        System.out.println("result = " + Arrays.toString(dailyTemperatures(t2)));\n        System.out.println();\n\n        int[] t3 = {30, 20, 10};\n        System.out.println("temperatures = " + Arrays.toString(t3));\n        System.out.println("result = " + Arrays.toString(dailyTemperatures(t3)));\n    }\n}',
      explanation: 'Это классическая задача Next Greater Element с возвратом расстояния, а не значения. Стек хранит индексы дней, для которых мы ещё не нашли более тёплый день. Когда текущий день теплее вершины стека — вытаскиваем индекс и записываем i - prevDay. Каждый элемент push/pop ровно 1 раз -> O(n).'
    },
    {
      id: 7,
      title: 'Практика: Largest Rectangle in Histogram',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив heights — высоты столбцов гистограммы. Найдите площадь наибольшего прямоугольника, который можно вписать в гистограмму.',
      requirements: [
        'Метод largestRectangleArea(int[] heights): максимальная площадь',
        'Используйте монотонно возрастающий стек',
        'Для каждого столбца определите, как далеко он может расширяться влево и вправо',
        'Площадь = height * (rightBound - leftBound - 1)',
        'Сложность: O(n) по времени',
        'Тест 1: [2, 1, 5, 6, 2, 3] -> 10',
        'Тест 2: [2, 4] -> 4'
      ],
      expectedOutput: 'heights = [2, 1, 5, 6, 2, 3]\nМаксимальная площадь: 10\n\nheights = [2, 4]\nМаксимальная площадь: 4\n\nheights = [1, 1, 1, 1, 1]\nМаксимальная площадь: 5',
      hint: 'При выталкивании столбца из стека: его высота — высота прямоугольника. Ширина — расстояние между текущим индексом i и новой вершиной стека (минус 1). Если стек пуст, ширина = i. Добавьте "виртуальный" столбец высоты 0 в конец для обработки оставшихся.',
      solution: 'import java.util.*;\n\npublic class LargestRectangleHistogram {\n    public static int largestRectangleArea(int[] heights) {\n        int n = heights.length;\n        int maxArea = 0;\n        // Монотонно возрастающий стек (хранит индексы)\n        Stack<Integer> stack = new Stack<>();\n\n        // Обрабатываем все столбцы + виртуальный столбец высоты 0\n        for (int i = 0; i <= n; i++) {\n            int currentHeight = (i == n) ? 0 : heights[i];\n\n            while (!stack.isEmpty() && heights[stack.peek()] > currentHeight) {\n                int height = heights[stack.pop()];\n                // Ширина: от текущего i до предыдущего в стеке\n                int width = stack.isEmpty() ? i : (i - stack.peek() - 1);\n                int area = height * width;\n                maxArea = Math.max(maxArea, area);\n            }\n            stack.push(i);\n        }\n        return maxArea;\n    }\n\n    public static void main(String[] args) {\n        int[] h1 = {2, 1, 5, 6, 2, 3};\n        System.out.println("heights = " + Arrays.toString(h1));\n        System.out.println("Максимальная площадь: " + largestRectangleArea(h1));\n        System.out.println();\n\n        int[] h2 = {2, 4};\n        System.out.println("heights = " + Arrays.toString(h2));\n        System.out.println("Максимальная площадь: " + largestRectangleArea(h2));\n        System.out.println();\n\n        int[] h3 = {1, 1, 1, 1, 1};\n        System.out.println("heights = " + Arrays.toString(h3));\n        System.out.println("Максимальная площадь: " + largestRectangleArea(h3));\n    }\n}',
      explanation: 'Для каждого столбца мы ищем, как далеко он может быть "основой" прямоугольника. Монотонно возрастающий стек гарантирует: при выталкивании столбца h, текущий столбец — первый меньший справа, а новая вершина стека — первый меньший слева. Ширина = i - stack.peek() - 1. Виртуальный столбец высоты 0 в конце заставляет вытолкнуть все оставшиеся. Для [2,1,5,6,2,3]: максимум 10 = высота 5 * ширина 2 (столбцы 5 и 6 на позициях 2-3).'
    }
  ]
}
