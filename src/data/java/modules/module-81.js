export default {
  id: 81,
  title: 'Практикум: Стек и очередь',
  description: 'Практические задачи на стеки и очереди: реализация стека, минимальный стек, очередь на двух стеках, обратная польская нотация, температуры, скользящий максимум.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Реализация Stack',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуй собственный стек на основе массива с операциями push, pop, peek и isEmpty. Стек должен динамически увеличиваться при заполнении.',
      requirements: [
        'Создай класс MyStack с массивом int[] и переменной top',
        'Метод push(int val) — добавляет элемент на вершину',
        'Метод pop() — удаляет и возвращает верхний элемент',
        'Методы peek() и isEmpty() — просмотр вершины и проверка пустоты'
      ],
      expectedOutput: 'Push: 10, 20, 30\nPeek: 30\nPop: 30\nPop: 20\nisEmpty: false\nPop: 10\nisEmpty: true',
      hint: 'Используй переменную top = -1 как индикатор пустого стека. При push увеличивай top, при pop — уменьшай.',
      solution: `public class Main {
    static int[] data = new int[100];
    static int top = -1;

    static void push(int val) {
        data[++top] = val;
    }

    static int pop() {
        return data[top--];
    }

    static int peek() {
        return data[top];
    }

    static boolean isEmpty() {
        return top == -1;
    }

    public static void main(String[] args) {
        push(10);
        push(20);
        push(30);
        System.out.println("Push: 10, 20, 30");
        System.out.println("Peek: " + peek());
        System.out.println("Pop: " + pop());
        System.out.println("Pop: " + pop());
        System.out.println("isEmpty: " + isEmpty());
        System.out.println("Pop: " + pop());
        System.out.println("isEmpty: " + isEmpty());
    }
}`,
      explanation: 'Стек работает по принципу LIFO (Last In, First Out). Переменная top указывает на индекс верхнего элемента. При push мы сначала увеличиваем top, затем записываем значение. При pop — читаем значение и уменьшаем top. Peek просто возвращает data[top] без изменения указателя.'
    },
    {
      id: 2,
      title: 'Задача: MinStack',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй стек, который поддерживает операцию getMin() за O(1). Помимо push, pop, peek, стек должен в любой момент возвращать минимальный элемент.',
      requirements: [
        'Используй два стека: основной и стек минимумов',
        'При push добавляй в minStack если значение <= текущему минимуму',
        'При pop удаляй из minStack если значение совпадает с вершиной minStack',
        'getMin() возвращает вершину minStack'
      ],
      expectedOutput: 'push(-2), push(0), push(-3)\ngetMin: -3\npop: -3\ngetMin: -2\npush(-1)\ngetMin: -2',
      hint: 'Ключевая идея — второй стек хранит текущий минимум. Каждый раз при push проверяй: если новое значение <= вершине minStack, добавляй его туда тоже.',
      solution: `import java.util.Stack;

public class Main {
    static Stack<Integer> stack = new Stack<>();
    static Stack<Integer> minStack = new Stack<>();

    static void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) {
            minStack.push(val);
        }
    }

    static int pop() {
        int val = stack.pop();
        if (val == minStack.peek()) {
            minStack.pop();
        }
        return val;
    }

    static int getMin() {
        return minStack.peek();
    }

    public static void main(String[] args) {
        push(-2);
        push(0);
        push(-3);
        System.out.println("push(-2), push(0), push(-3)");
        System.out.println("getMin: " + getMin());
        System.out.println("pop: " + pop());
        System.out.println("getMin: " + getMin());
        push(-1);
        System.out.println("push(-1)");
        System.out.println("getMin: " + getMin());
    }
}`,
      explanation: 'MinStack использует дополнительный стек для хранения текущих минимумов. Когда мы добавляем элемент, который меньше или равен текущему минимуму, он также попадает в minStack. При удалении — если удаляемый элемент равен вершине minStack, удаляем и оттуда. Это гарантирует O(1) для всех операций.'
    },
    {
      id: 3,
      title: 'Задача: Queue через два Stack',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй очередь (FIFO) используя только два стека. Очередь должна поддерживать операции enqueue, dequeue и peek.',
      requirements: [
        'Используй Stack<Integer> inStack и outStack',
        'enqueue — добавляй в inStack',
        'dequeue — если outStack пуст, перелей всё из inStack в outStack, затем pop',
        'peek — аналогично dequeue, но без удаления'
      ],
      expectedOutput: 'enqueue: 1, 2, 3\ndequeue: 1\npeek: 2\ndequeue: 2\ndequeue: 3',
      hint: 'Перекладывание из одного стека в другой переворачивает порядок элементов — это именно то, что нужно для преобразования LIFO в FIFO.',
      solution: `import java.util.Stack;

public class Main {
    static Stack<Integer> inStack = new Stack<>();
    static Stack<Integer> outStack = new Stack<>();

    static void enqueue(int val) {
        inStack.push(val);
    }

    static int dequeue() {
        if (outStack.isEmpty()) {
            while (!inStack.isEmpty()) {
                outStack.push(inStack.pop());
            }
        }
        return outStack.pop();
    }

    static int peek() {
        if (outStack.isEmpty()) {
            while (!inStack.isEmpty()) {
                outStack.push(inStack.pop());
            }
        }
        return outStack.peek();
    }

    public static void main(String[] args) {
        enqueue(1);
        enqueue(2);
        enqueue(3);
        System.out.println("enqueue: 1, 2, 3");
        System.out.println("dequeue: " + dequeue());
        System.out.println("peek: " + peek());
        System.out.println("dequeue: " + dequeue());
        System.out.println("dequeue: " + dequeue());
    }
}`,
      explanation: 'Два стека имитируют очередь: inStack принимает новые элементы, outStack выдаёт. Когда outStack пуст, мы переливаем все элементы из inStack — при этом порядок инвертируется, и первый добавленный оказывается на вершине outStack. Амортизированная сложность каждой операции — O(1).'
    },
    {
      id: 4,
      title: 'Задача: Evaluate Reverse Polish Notation',
      type: 'practice',
      difficulty: 'medium',
      description: 'Вычисли значение арифметического выражения в обратной польской нотации (RPN). Допустимые операторы: +, -, *, /. Деление целочисленное с отбрасыванием дробной части.',
      requirements: [
        'Используй стек для хранения операндов',
        'Если токен — число, положи в стек',
        'Если токен — оператор, достань два числа, выполни операцию, результат положи обратно',
        'Верни последний элемент стека как результат'
      ],
      expectedOutput: 'Выражение: ["2","1","+","3","*"]\nРезультат: 9\nВыражение: ["4","13","5","/","+"]\nРезультат: 6',
      hint: 'При извлечении операндов порядок важен: первый извлечённый — правый операнд (b), второй — левый (a). Результат: a op b.',
      solution: `import java.util.Stack;

public class Main {
    static int evalRPN(String[] tokens) {
        Stack<Integer> stack = new Stack<>();
        for (String token : tokens) {
            switch (token) {
                case "+":
                    stack.push(stack.pop() + stack.pop());
                    break;
                case "-":
                    int b = stack.pop();
                    int a = stack.pop();
                    stack.push(a - b);
                    break;
                case "*":
                    stack.push(stack.pop() * stack.pop());
                    break;
                case "/":
                    int divisor = stack.pop();
                    int dividend = stack.pop();
                    stack.push(dividend / divisor);
                    break;
                default:
                    stack.push(Integer.parseInt(token));
            }
        }
        return stack.pop();
    }

    public static void main(String[] args) {
        String[] expr1 = {"2", "1", "+", "3", "*"};
        System.out.println("Выражение: [\\"2\\",\\"1\\",\\"+\\",\\"3\\",\\"*\\"]");
        System.out.println("Результат: " + evalRPN(expr1));

        String[] expr2 = {"4", "13", "5", "/", "+"};
        System.out.println("Выражение: [\\"4\\",\\"13\\",\\"5\\",\\"/\\",\\"+\\"]");
        System.out.println("Результат: " + evalRPN(expr2));
    }
}`,
      explanation: 'RPN (обратная польская нотация) не требует скобок — порядок вычислений определяется позицией операторов. Стек идеально подходит: числа складываются в стек, а оператор забирает два верхних числа, вычисляет результат и кладёт его обратно. Для "2 1 + 3 *": стек [2,1] → + → [3] → [3,3] → * → [9].'
    },
    {
      id: 5,
      title: 'Задача: Daily Temperatures',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив дневных температур. Для каждого дня определи, через сколько дней будет теплее. Если теплее не станет — верни 0.',
      requirements: [
        'Используй стек для хранения индексов',
        'Обходи массив слева направо',
        'Если текущая температура выше температуры по индексу на вершине стека — вычисли разницу индексов',
        'Результат записывай в массив answer'
      ],
      expectedOutput: 'Температуры: [73, 74, 75, 71, 69, 72, 76, 73]\nОтвет: [1, 1, 4, 2, 1, 1, 0, 0]',
      hint: 'Стек хранит индексы дней с нерешёнными температурами. Когда встречаем более тёплый день — pop из стека и записываем разницу индексов.',
      solution: `import java.util.Arrays;
import java.util.Stack;

public class Main {
    static int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] answer = new int[n];
        Stack<Integer> stack = new Stack<>();

        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
                int idx = stack.pop();
                answer[idx] = i - idx;
            }
            stack.push(i);
        }
        return answer;
    }

    public static void main(String[] args) {
        int[] temps = {73, 74, 75, 71, 69, 72, 76, 73};
        System.out.println("Температуры: " + Arrays.toString(temps));
        System.out.println("Ответ: " + Arrays.toString(dailyTemperatures(temps)));
    }
}`,
      explanation: 'Используем монотонный стек (monotonic stack). Стек хранит индексы дней, для которых мы ещё не нашли более тёплый день. Когда текущая температура выше вершины стека, мы знаем ответ для того дня: разница индексов. Сложность O(n) — каждый индекс попадает в стек и извлекается максимум один раз.'
    },
    {
      id: 6,
      title: 'Задача: Next Greater Element',
      type: 'practice',
      difficulty: 'medium',
      description: 'Для каждого элемента массива найди следующий больший элемент. Если такого нет — верни -1. Используй стек для оптимального решения.',
      requirements: [
        'Обходи массив справа налево',
        'Используй стек для хранения кандидатов на "следующий больший"',
        'Удаляй из стека все элементы, которые меньше или равны текущему',
        'Результат — вершина стека или -1, если стек пуст'
      ],
      expectedOutput: 'Массив: [4, 5, 2, 25, 7, 8]\nNext Greater: [5, 25, 25, -1, 8, -1]',
      hint: 'Обход справа налево со стеком: для каждого элемента убираем из стека всё что <= ему. Оставшаяся вершина — следующий больший элемент.',
      solution: `import java.util.Arrays;
import java.util.Stack;

public class Main {
    static int[] nextGreater(int[] arr) {
        int n = arr.length;
        int[] result = new int[n];
        Stack<Integer> stack = new Stack<>();

        for (int i = n - 1; i >= 0; i--) {
            while (!stack.isEmpty() && stack.peek() <= arr[i]) {
                stack.pop();
            }
            result[i] = stack.isEmpty() ? -1 : stack.peek();
            stack.push(arr[i]);
        }
        return result;
    }

    public static void main(String[] args) {
        int[] arr = {4, 5, 2, 25, 7, 8};
        System.out.println("Массив: " + Arrays.toString(arr));
        System.out.println("Next Greater: " + Arrays.toString(nextGreater(arr)));
    }
}`,
      explanation: 'Обход справа налево с монотонным стеком. Для каждого элемента мы удаляем из стека все значения, которые ему не подходят (меньше или равны). Оставшаяся вершина — ближайший больший элемент справа. Затем добавляем текущий элемент в стек. Сложность O(n), так как каждый элемент попадает в стек и удаляется не более одного раза.'
    },
    {
      id: 7,
      title: 'Задача: Validate Stack Sequences',
      type: 'practice',
      difficulty: 'medium',
      description: 'Даны две последовательности pushed и popped. Определи, может ли последовательность pop быть результатом операций push/pop на изначально пустом стеке.',
      requirements: [
        'Симулируй операции push и pop на стеке',
        'Пройди по массиву pushed, добавляя элементы в стек',
        'После каждого push проверяй, совпадает ли вершина стека с текущим элементом popped',
        'Если совпадает — делай pop и двигай указатель popped'
      ],
      expectedOutput: 'pushed=[1,2,3,4,5], popped=[4,5,3,2,1]: true\npushed=[1,2,3,4,5], popped=[4,3,5,1,2]: false',
      hint: 'Используй указатель j для массива popped. После каждого push проверяй в цикле while: если stack.peek() == popped[j], делай pop и j++.',
      solution: `import java.util.Stack;

public class Main {
    static boolean validateStackSequences(int[] pushed, int[] popped) {
        Stack<Integer> stack = new Stack<>();
        int j = 0;
        for (int val : pushed) {
            stack.push(val);
            while (!stack.isEmpty() && stack.peek() == popped[j]) {
                stack.pop();
                j++;
            }
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        int[] pushed1 = {1, 2, 3, 4, 5};
        int[] popped1 = {4, 5, 3, 2, 1};
        System.out.println("pushed=[1,2,3,4,5], popped=[4,5,3,2,1]: "
            + validateStackSequences(pushed1, popped1));

        int[] pushed2 = {1, 2, 3, 4, 5};
        int[] popped2 = {4, 3, 5, 1, 2};
        System.out.println("pushed=[1,2,3,4,5], popped=[4,3,5,1,2]: "
            + validateStackSequences(pushed2, popped2));
    }
}`,
      explanation: 'Симулируем работу стека: добавляем элементы из pushed по одному. После каждого добавления проверяем, совпадает ли вершина стека с текущим ожидаемым элементом для pop. Если да — извлекаем. В конце если стек пуст — последовательность валидна. Для [4,3,5,1,2]: после push 1-4, pop 4,3 → стек [1,2], push 5, pop 5 → стек [1,2], но нужно pop 1 перед 2 — невозможно.'
    },
    {
      id: 8,
      title: 'Задача: Simplify Path',
      type: 'practice',
      difficulty: 'medium',
      description: 'Упрости абсолютный Unix-путь. Обработай ".." (вверх), "." (текущая), множественные "/" и trailing "/".',
      requirements: [
        'Раздели путь по "/"',
        'Используй стек (Deque) для хранения директорий',
        'Для ".." — pop из стека (если не пуст)',
        'Для "." и пустых строк — пропусти'
      ],
      expectedOutput: '/home/user/../docs → /home/docs\n/a/./b/../../c/ → /c\n////home//foo/ → /home/foo',
      hint: 'Раздели строку path.split("/"). Пустые строки и "." игнорируй. ".." — удаляй последний элемент из стека. В конце собери путь из стека.',
      solution: `import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    static String simplifyPath(String path) {
        Deque<String> stack = new ArrayDeque<>();
        String[] parts = path.split("/");

        for (String part : parts) {
            if (part.equals("..")) {
                if (!stack.isEmpty()) {
                    stack.pollLast();
                }
            } else if (!part.equals(".") && !part.isEmpty()) {
                stack.addLast(part);
            }
        }

        StringBuilder sb = new StringBuilder();
        for (String dir : stack) {
            sb.append("/").append(dir);
        }
        return sb.length() == 0 ? "/" : sb.toString();
    }

    public static void main(String[] args) {
        System.out.println("/home/user/../docs → " + simplifyPath("/home/user/../docs"));
        System.out.println("/a/./b/../../c/ → " + simplifyPath("/a/./b/../../c/"));
        System.out.println("////home//foo/ → " + simplifyPath("////home//foo/"));
    }
}`,
      explanation: 'Разбиваем путь по "/". Каждый фрагмент обрабатываем: ".." — подняться вверх (pop), "." и "" — игнорировать, иначе — добавить в стек как имя директории. В конце собираем канонический путь, добавляя "/" перед каждым элементом стека. Если стек пуст — возвращаем корень "/".'
    },
    {
      id: 9,
      title: 'Задача: Sliding Window Maximum',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив целых чисел и размер окна k. Найди максимум в каждом скользящем окне размера k. Используй Deque для решения за O(n).',
      requirements: [
        'Используй ArrayDeque для хранения индексов',
        'Поддерживай Deque в убывающем порядке значений',
        'Удаляй индексы, вышедшие за пределы окна',
        'Максимум текущего окна — элемент по индексу на голове Deque'
      ],
      expectedOutput: 'Массив: [1, 3, -1, -3, 5, 3, 6, 7], k=3\nМаксимумы окон: [3, 3, 5, 5, 6, 7]',
      hint: 'Deque хранит индексы в убывающем порядке значений. При добавлении нового элемента удаляй из хвоста все индексы с меньшими значениями. Голова деque — индекс максимума текущего окна.',
      solution: `import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Deque;

public class Main {
    static int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] result = new int[n - k + 1];
        Deque<Integer> deque = new ArrayDeque<>();

        for (int i = 0; i < n; i++) {
            while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
                deque.pollFirst();
            }
            while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
                deque.pollLast();
            }
            deque.addLast(i);
            if (i >= k - 1) {
                result[i - k + 1] = nums[deque.peekFirst()];
            }
        }
        return result;
    }

    public static void main(String[] args) {
        int[] nums = {1, 3, -1, -3, 5, 3, 6, 7};
        int k = 3;
        System.out.println("Массив: " + Arrays.toString(nums) + ", k=" + k);
        System.out.println("Максимумы окон: " + Arrays.toString(maxSlidingWindow(nums, k)));
    }
}`,
      explanation: 'Deque (двусторонняя очередь) хранит индексы элементов в убывающем порядке их значений. При добавлении нового элемента: 1) удаляем из начала индексы за пределами окна, 2) удаляем из конца индексы элементов меньше текущего (они уже не могут быть максимумом). Голова Deque всегда содержит индекс максимума текущего окна. Сложность O(n) — каждый элемент добавляется и удаляется из Deque максимум один раз.'
    },
    {
      id: 10,
      title: 'Задача: Circular Queue',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй кольцевую очередь (Circular Queue) фиксированного размера с операциями enQueue, deQueue, Front, Rear, isEmpty, isFull.',
      requirements: [
        'Используй массив фиксированного размера и два указателя: front и rear',
        'enQueue — добавляет элемент в конец, возвращает true/false',
        'deQueue — удаляет элемент из начала, возвращает true/false',
        'Front/Rear — возвращают первый/последний элемент или -1'
      ],
      expectedOutput: 'enQueue(1): true\nenQueue(2): true\nenQueue(3): true\nenQueue(4): false (очередь полна)\nRear: 3\nisFull: true\ndeQueue: true\nenQueue(4): true\nRear: 4\nFront: 2',
      hint: 'Кольцевая очередь использует модульную арифметику: rear = (rear + 1) % size. Используй count для отслеживания числа элементов.',
      solution: `public class Main {
    static int[] queue;
    static int front, rear, count, capacity;

    static void init(int k) {
        queue = new int[k];
        capacity = k;
        front = 0;
        rear = -1;
        count = 0;
    }

    static boolean enQueue(int value) {
        if (count == capacity) return false;
        rear = (rear + 1) % capacity;
        queue[rear] = value;
        count++;
        return true;
    }

    static boolean deQueue() {
        if (count == 0) return false;
        front = (front + 1) % capacity;
        count--;
        return true;
    }

    static int front() {
        return count == 0 ? -1 : queue[front];
    }

    static int rear() {
        return count == 0 ? -1 : queue[rear];
    }

    static boolean isEmpty() {
        return count == 0;
    }

    static boolean isFull() {
        return count == capacity;
    }

    public static void main(String[] args) {
        init(3);
        System.out.println("enQueue(1): " + enQueue(1));
        System.out.println("enQueue(2): " + enQueue(2));
        System.out.println("enQueue(3): " + enQueue(3));
        System.out.println("enQueue(4): " + enQueue(4) + " (очередь полна)");
        System.out.println("Rear: " + rear());
        System.out.println("isFull: " + isFull());
        System.out.println("deQueue: " + deQueue());
        System.out.println("enQueue(4): " + enQueue(4));
        System.out.println("Rear: " + rear());
        System.out.println("Front: " + front());
    }
}`,
      explanation: 'Кольцевая очередь использует массив как замкнутый буфер. Указатели front и rear двигаются по кругу с помощью модульной арифметики: (index + 1) % capacity. Переменная count отслеживает текущее количество элементов, что позволяет легко определить, пуста ли очередь или заполнена. Это эффективная структура данных для буферов фиксированного размера.'
    }
  ]
}
