export default {
  id: 36,
  title: 'Практикум: Stack и Queue задачи',
  description: 'Десять классических задач LeetCode на стек и очередь. От проверки скобок до нахождения наибольшего прямоугольника в гистограмме.',
  lessons: [
    {
      id: 1,
      title: 'Valid Parentheses (LeetCode #20)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дана строка, содержащая только символы \'(\', \')\', \'{\', \'}\', \'[\' и \']\'. Определите, является ли строка валидной. Строка валидна, если каждая открывающая скобка закрывается соответствующей, и скобки закрываются в правильном порядке.',
      requirements: [
        'Реализуйте метод boolean isValid(String s)',
        'Строка содержит только символы ()[]{}',
        'Пустая строка считается валидной',
        'Каждая открывающая скобка должна иметь парную закрывающую того же типа',
        'Скобки должны закрываться в правильном порядке'
      ],
      expectedOutput: 'isValid("()") -> true\nisValid("()[]{}") -> true\nisValid("(]") -> false\nisValid("([)]") -> false\nisValid("{[]}") -> true',
      hint: 'Используйте стек: при встрече открывающей скобки кладите её в стек, при закрывающей — проверяйте, что на вершине стека лежит парная открывающая.',
      solution: `import java.util.Stack;

public class ValidParentheses {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            // Если открывающая — кладём парную закрывающую
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            // Если закрывающая — проверяем вершину стека
            else if (stack.isEmpty() || stack.pop() != c) {
                return false;
            }
        }
        // Стек должен быть пуст — все скобки закрыты
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        ValidParentheses sol = new ValidParentheses();
        System.out.println(sol.isValid("()"));      // true
        System.out.println(sol.isValid("()[]{}")); // true
        System.out.println(sol.isValid("(]"));      // false
        System.out.println(sol.isValid("([)]"));    // false
        System.out.println(sol.isValid("{[]}"));    // true
    }
}`,
      explanation: 'Классическая задача на стек. Вместо проверки при закрывающей скобке, проще при открывающей скобке класть в стек ожидаемую закрывающую. Тогда при встрече закрывающей просто сравниваем с вершиной. Время O(n), память O(n).'
    },
    {
      id: 2,
      title: 'Min Stack (LeetCode #155)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте стек, поддерживающий операции push, pop, top и getMin за O(1) по времени.',
      requirements: [
        'Реализуйте класс MinStack с методами push(val), pop(), top(), getMin()',
        'Каждая операция должна работать за O(1)',
        'getMin() возвращает минимальный элемент в стеке',
        'Гарантируется, что pop, top и getMin вызываются на непустом стеке'
      ],
      expectedOutput: 'MinStack ms = new MinStack();\nms.push(-2); ms.push(0); ms.push(-3);\nms.getMin() -> -3\nms.pop();\nms.top() -> 0\nms.getMin() -> -2',
      hint: 'Храните два стека: основной и вспомогательный для минимумов. При push в стек минимумов кладите новый минимум (min из текущего и вершины стека минимумов).',
      solution: `import java.util.Stack;

public class MinStack {
    private Stack<Integer> stack;
    private Stack<Integer> minStack;

    public MinStack() {
        stack = new Stack<>();
        minStack = new Stack<>();
    }

    public void push(int val) {
        stack.push(val);
        // В minStack кладём текущий минимум
        if (minStack.isEmpty() || val <= minStack.peek()) {
            minStack.push(val);
        } else {
            minStack.push(minStack.peek());
        }
    }

    public void pop() {
        stack.pop();
        minStack.pop();
    }

    public int top() {
        return stack.peek();
    }

    public int getMin() {
        return minStack.peek();
    }

    public static void main(String[] args) {
        MinStack ms = new MinStack();
        ms.push(-2);
        ms.push(0);
        ms.push(-3);
        System.out.println(ms.getMin()); // -3
        ms.pop();
        System.out.println(ms.top());    // 0
        System.out.println(ms.getMin()); // -2
    }
}`,
      explanation: 'Ключевая идея — параллельный стек минимумов. При каждом push мы кладём в minStack актуальный минимум, при pop — синхронно удаляем. Так getMin() всегда возвращает вершину minStack. Все операции O(1), дополнительная память O(n).'
    },
    {
      id: 3,
      title: 'Evaluate Reverse Polish Notation (LeetCode #150)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Вычислите значение арифметического выражения в обратной польской нотации (постфиксной). Допустимые операторы: +, -, *, /. Деление целочисленное, усекается к нулю.',
      requirements: [
        'Реализуйте метод int evalRPN(String[] tokens)',
        'Каждый токен — число или оператор (+, -, *, /)',
        'Деление целочисленное с усечением к нулю',
        'Гарантируется, что выражение всегда корректно',
        'Вход: массив строк tokens'
      ],
      expectedOutput: 'evalRPN(["2","1","+","3","*"]) -> 9  // ((2+1)*3)\nevalRPN(["4","13","5","/","+"]) -> 6  // (4+(13/5))\nevalRPN(["10","6","9","3","+","-11","*","/","*","17","+","5","+"]) -> 22',
      hint: 'Используйте стек: числа кладите в стек, при встрече оператора извлекайте два верхних элемента, выполняйте операцию и кладите результат обратно.',
      solution: `import java.util.Stack;

public class EvalRPN {
    public int evalRPN(String[] tokens) {
        Stack<Integer> stack = new Stack<>();

        for (String token : tokens) {
            switch (token) {
                case "+":
                    stack.push(stack.pop() + stack.pop());
                    break;
                case "-":
                    int b = stack.pop();
                    int a = stack.pop();
                    stack.push(a - b); // порядок важен!
                    break;
                case "*":
                    stack.push(stack.pop() * stack.pop());
                    break;
                case "/":
                    int divisor = stack.pop();
                    int dividend = stack.pop();
                    stack.push(dividend / divisor); // порядок важен!
                    break;
                default:
                    stack.push(Integer.parseInt(token));
            }
        }
        return stack.pop();
    }

    public static void main(String[] args) {
        EvalRPN sol = new EvalRPN();
        System.out.println(sol.evalRPN(new String[]{"2","1","+","3","*"})); // 9
        System.out.println(sol.evalRPN(new String[]{"4","13","5","/","+"})); // 6
        System.out.println(sol.evalRPN(new String[]{"10","6","9","3","+","-11","*","/","*","17","+","5","+"})); // 22
    }
}`,
      explanation: 'Обратная польская нотация идеально решается стеком. Числа кладём в стек. При операторе достаём два числа (внимание на порядок при - и /!), вычисляем результат и кладём обратно. В конце в стеке остаётся ответ. Время O(n), память O(n).'
    },
    {
      id: 4,
      title: 'Daily Temperatures (LeetCode #739)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан массив temperatures, представляющий дневные температуры. Верните массив answer, где answer[i] — количество дней, которые нужно подождать после i-го дня, чтобы наступила более тёплая температура. Если такого дня нет — 0.',
      requirements: [
        'Реализуйте метод int[] dailyTemperatures(int[] temperatures)',
        'answer[i] — количество дней до более тёплого дня',
        'Если более тёплого дня нет, answer[i] = 0',
        'Решение должно работать за O(n)'
      ],
      expectedOutput: 'dailyTemperatures([73,74,75,71,69,72,76,73]) -> [1,1,4,2,1,1,0,0]\ndailyTemperatures([30,40,50,60]) -> [1,1,1,0]\ndailyTemperatures([30,60,90]) -> [1,1,0]',
      hint: 'Используйте монотонный стек (хранит индексы). Обходите массив: если текущая температура больше температуры на вершине стека — извлекаем и вычисляем разницу индексов.',
      solution: `import java.util.Arrays;
import java.util.Stack;

public class DailyTemperatures {
    public int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] answer = new int[n];
        // Стек хранит индексы дней с убывающими температурами
        Stack<Integer> stack = new Stack<>();

        for (int i = 0; i < n; i++) {
            // Пока текущая температура выше, чем у дня на вершине стека
            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
                int prevDay = stack.pop();
                answer[prevDay] = i - prevDay;
            }
            stack.push(i);
        }
        // Оставшиеся в стеке дни — answer[i] = 0 (по умолчанию)
        return answer;
    }

    public static void main(String[] args) {
        DailyTemperatures sol = new DailyTemperatures();
        System.out.println(Arrays.toString(
            sol.dailyTemperatures(new int[]{73,74,75,71,69,72,76,73})
        )); // [1,1,4,2,1,1,0,0]
        System.out.println(Arrays.toString(
            sol.dailyTemperatures(new int[]{30,40,50,60})
        )); // [1,1,1,0]
    }
}`,
      explanation: 'Классическая задача на монотонный стек. Стек хранит индексы дней в порядке убывания температур. Когда встречаем более тёплый день — извлекаем все дни из стека, у которых температура ниже, и записываем разницу индексов. Каждый элемент кладётся и извлекается максимум один раз — O(n).'
    },
    {
      id: 5,
      title: 'Implement Queue using Stacks (LeetCode #232)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте очередь (FIFO) используя только два стека. Очередь должна поддерживать push, pop, peek и empty.',
      requirements: [
        'Реализуйте класс MyQueue с методами push(x), pop(), peek(), empty()',
        'Используйте только стандартные операции стека: push, pop, peek, isEmpty',
        'Допускается использовать только два стека',
        'Амортизированная сложность операций — O(1)'
      ],
      expectedOutput: 'MyQueue q = new MyQueue();\nq.push(1); q.push(2);\nq.peek() -> 1\nq.pop() -> 1\nq.empty() -> false',
      hint: 'Используйте два стека: входной (inStack) и выходной (outStack). При push кладите в inStack. При pop/peek, если outStack пуст — переложите все из inStack в outStack (порядок перевернётся).',
      solution: `import java.util.Stack;

public class MyQueue {
    private Stack<Integer> inStack;   // для push
    private Stack<Integer> outStack;  // для pop/peek

    public MyQueue() {
        inStack = new Stack<>();
        outStack = new Stack<>();
    }

    public void push(int x) {
        inStack.push(x);
    }

    public int pop() {
        moveIfNeeded();
        return outStack.pop();
    }

    public int peek() {
        moveIfNeeded();
        return outStack.peek();
    }

    public boolean empty() {
        return inStack.isEmpty() && outStack.isEmpty();
    }

    // Перекладываем из inStack в outStack, если outStack пуст
    private void moveIfNeeded() {
        if (outStack.isEmpty()) {
            while (!inStack.isEmpty()) {
                outStack.push(inStack.pop());
            }
        }
    }

    public static void main(String[] args) {
        MyQueue q = new MyQueue();
        q.push(1);
        q.push(2);
        System.out.println(q.peek());  // 1
        System.out.println(q.pop());   // 1
        System.out.println(q.empty()); // false
        System.out.println(q.pop());   // 2
        System.out.println(q.empty()); // true
    }
}`,
      explanation: 'Два стека: inStack для записи, outStack для чтения. Перекладывание происходит лениво — только когда outStack пуст. При перекладывании порядок переворачивается, и первый добавленный элемент оказывается на вершине outStack. Амортизированная сложность O(1): каждый элемент перекладывается максимум один раз.'
    },
    {
      id: 6,
      title: 'Implement Stack using Queues (LeetCode #225)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте стек (LIFO) используя только две очереди. Стек должен поддерживать push, pop, top и empty.',
      requirements: [
        'Реализуйте класс MyStack с методами push(x), pop(), top(), empty()',
        'Используйте только стандартные операции очереди: add, poll, peek, isEmpty',
        'Допускается использовать одну или две очереди',
        'Операция push должна быть O(n), остальные — O(1)'
      ],
      expectedOutput: 'MyStack s = new MyStack();\ns.push(1); s.push(2);\ns.top() -> 2\ns.pop() -> 2\ns.empty() -> false',
      hint: 'При push добавьте элемент в очередь, затем перенесите все предыдущие элементы в конец (сделайте n-1 операций poll+add). Так новый элемент окажется в начале.',
      solution: `import java.util.LinkedList;
import java.util.Queue;

public class MyStack {
    private Queue<Integer> queue;

    public MyStack() {
        queue = new LinkedList<>();
    }

    // O(n): кладём элемент и вращаем очередь
    public void push(int x) {
        queue.add(x);
        // Переносим все предыдущие элементы за новый
        int size = queue.size();
        for (int i = 0; i < size - 1; i++) {
            queue.add(queue.poll());
        }
    }

    public int pop() {
        return queue.poll();
    }

    public int top() {
        return queue.peek();
    }

    public boolean empty() {
        return queue.isEmpty();
    }

    public static void main(String[] args) {
        MyStack s = new MyStack();
        s.push(1);
        s.push(2);
        System.out.println(s.top());   // 2
        System.out.println(s.pop());   // 2
        System.out.println(s.empty()); // false
        System.out.println(s.pop());   // 1
        System.out.println(s.empty()); // true
    }
}`,
      explanation: 'Используем одну очередь. При push добавляем элемент, затем вращаем очередь: достаём из начала и кладём в конец n-1 раз. После этого новый элемент оказывается в начале очереди. push — O(n), pop/top — O(1). Одна очередь достаточна.'
    },
    {
      id: 7,
      title: 'Next Greater Element I (LeetCode #496)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Даны два массива nums1 и nums2 без повторов, где nums1 — подмножество nums2. Для каждого элемента nums1 найдите следующий больший элемент в nums2. Если такого нет — верните -1.',
      requirements: [
        'Реализуйте метод int[] nextGreaterElement(int[] nums1, int[] nums2)',
        'nums1 — подмножество nums2, оба без повторов',
        'Для каждого nums1[i] ищем следующий больший элемент справа в nums2',
        'Если такого элемента нет, записываем -1',
        'Решение за O(n) с помощью стека и HashMap'
      ],
      expectedOutput: 'nextGreaterElement([4,1,2], [1,3,4,2]) -> [-1,3,-1]\nnextGreaterElement([2,4], [1,2,3,4]) -> [3,-1]',
      hint: 'Сначала пройдите nums2 с монотонным стеком и для каждого элемента сохраните в HashMap его next greater element. Затем для каждого nums1[i] просто возьмите значение из HashMap.',
      solution: `import java.util.*;

public class NextGreaterElement {
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        // Шаг 1: строим map next_greater для каждого элемента nums2
        Map<Integer, Integer> nextGreater = new HashMap<>();
        Stack<Integer> stack = new Stack<>();

        for (int num : nums2) {
            // Текущий элемент — next greater для всех меньших на стеке
            while (!stack.isEmpty() && stack.peek() < num) {
                nextGreater.put(stack.pop(), num);
            }
            stack.push(num);
        }
        // Оставшиеся в стеке — нет next greater
        while (!stack.isEmpty()) {
            nextGreater.put(stack.pop(), -1);
        }

        // Шаг 2: для каждого nums1[i] берём из map
        int[] result = new int[nums1.length];
        for (int i = 0; i < nums1.length; i++) {
            result[i] = nextGreater.get(nums1[i]);
        }
        return result;
    }

    public static void main(String[] args) {
        NextGreaterElement sol = new NextGreaterElement();
        System.out.println(Arrays.toString(
            sol.nextGreaterElement(new int[]{4,1,2}, new int[]{1,3,4,2})
        )); // [-1, 3, -1]
        System.out.println(Arrays.toString(
            sol.nextGreaterElement(new int[]{2,4}, new int[]{1,2,3,4})
        )); // [3, -1]
    }
}`,
      explanation: 'Двухшаговый подход: 1) Монотонным стеком за O(n) строим HashMap с next greater element для каждого элемента nums2. 2) Для каждого элемента nums1 просто делаем lookup в HashMap за O(1). Общая сложность O(n + m).'
    },
    {
      id: 8,
      title: 'Simplify Path (LeetCode #71)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан абсолютный путь файловой системы Unix (начинается с \'/\'). Упростите его: уберите двойные слэши, точки (текущий каталог), двойные точки (родительский каталог).',
      requirements: [
        'Реализуйте метод String simplifyPath(String path)',
        '"." означает текущий каталог — игнорируем',
        '".." означает переход в родительский каталог — удаляем последний элемент',
        'Несколько слэшей подряд = один слэш',
        'Результат начинается с "/" и не заканчивается на "/" (кроме корня)'
      ],
      expectedOutput: 'simplifyPath("/home/") -> "/home"\nsimplifyPath("/../") -> "/"\nsimplifyPath("/home//foo/") -> "/home/foo"\nsimplifyPath("/a/./b/../../c/") -> "/c"',
      hint: 'Разбейте путь по "/" (split). Используйте стек (Deque): для обычных имён — push, для ".." — pop, для "." и пустых строк — пропуск. В конце соберите путь из стека.',
      solution: `import java.util.*;

public class SimplifyPath {
    public String simplifyPath(String path) {
        Deque<String> stack = new ArrayDeque<>();
        String[] parts = path.split("/");

        for (String part : parts) {
            if (part.equals("..")) {
                // Переход в родительский каталог
                if (!stack.isEmpty()) {
                    stack.pollLast();
                }
            } else if (!part.equals(".") && !part.isEmpty()) {
                // Обычное имя каталога
                stack.addLast(part);
            }
            // "." и "" — просто пропускаем
        }

        // Собираем каноничный путь
        StringBuilder result = new StringBuilder();
        for (String dir : stack) {
            result.append("/").append(dir);
        }
        return result.length() > 0 ? result.toString() : "/";
    }

    public static void main(String[] args) {
        SimplifyPath sol = new SimplifyPath();
        System.out.println(sol.simplifyPath("/home/"));           // /home
        System.out.println(sol.simplifyPath("/../"));             // /
        System.out.println(sol.simplifyPath("/home//foo/"));      // /home/foo
        System.out.println(sol.simplifyPath("/a/./b/../../c/"));  // /c
    }
}`,
      explanation: 'Разбиваем путь по "/", обрабатываем каждый компонент: ".." — удаляем последний каталог из стека, "." и пустая строка — пропускаем, иначе — добавляем. В конце собираем путь через "/". Время O(n), память O(n).'
    },
    {
      id: 9,
      title: 'Decode String (LeetCode #394)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Декодируйте строку вида "3[a2[bc]]". Число перед скобками означает, сколько раз повторить содержимое. Результат: "abcbcabcbcabcbc".',
      requirements: [
        'Реализуйте метод String decodeString(String s)',
        'Входная строка содержит цифры, буквы и квадратные скобки',
        'Число k перед [...] означает повторение k раз',
        'Вложенность может быть произвольной глубины',
        'Гарантируется корректный вход'
      ],
      expectedOutput: 'decodeString("3[a]2[bc]") -> "aaabcbc"\ndecodeString("3[a2[c]]") -> "accaccacc"\ndecodeString("2[abc]3[cd]ef") -> "abcabccdcdcdef"',
      hint: 'Используйте два стека: один для чисел (множителей), второй для строк. При \'[\' сохраняйте текущее состояние. При \']\' извлекайте и повторяйте.',
      solution: `import java.util.Stack;

public class DecodeString {
    public String decodeString(String s) {
        Stack<Integer> countStack = new Stack<>();
        Stack<StringBuilder> stringStack = new Stack<>();
        StringBuilder current = new StringBuilder();
        int k = 0;

        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) {
                // Число может быть многозначным: 12[a]
                k = k * 10 + (c - '0');
            } else if (c == '[') {
                // Сохраняем текущий множитель и строку
                countStack.push(k);
                stringStack.push(current);
                // Начинаем новую строку
                current = new StringBuilder();
                k = 0;
            } else if (c == ']') {
                // Извлекаем множитель и предыдущую строку
                int repeat = countStack.pop();
                StringBuilder prev = stringStack.pop();
                // Повторяем текущую строку repeat раз
                String repeated = current.toString().repeat(repeat);
                // Присоединяем к предыдущей
                current = prev.append(repeated);
            } else {
                // Обычная буква
                current.append(c);
            }
        }
        return current.toString();
    }

    public static void main(String[] args) {
        DecodeString sol = new DecodeString();
        System.out.println(sol.decodeString("3[a]2[bc]"));   // aaabcbc
        System.out.println(sol.decodeString("3[a2[c]]"));    // accaccacc
        System.out.println(sol.decodeString("2[abc]3[cd]ef")); // abcabccdcdcdef
    }
}`,
      explanation: 'Два стека: countStack хранит множители, stringStack — контекст строки до "[". При "[" сохраняем состояние и начинаем новую строку. При "]" извлекаем множитель и предыдущую строку, повторяем текущую и конкатенируем. Время O(n * maxRepeat), память O(n).'
    },
    {
      id: 10,
      title: 'Largest Rectangle in Histogram (LeetCode #84)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив heights, где heights[i] — высота столбца гистограммы шириной 1. Найдите площадь наибольшего прямоугольника, который можно вписать в гистограмму.',
      requirements: [
        'Реализуйте метод int largestRectangleArea(int[] heights)',
        'Ширина каждого столбца = 1',
        'Прямоугольник может занимать несколько соседних столбцов',
        'Высота прямоугольника ограничена минимальным столбцом в диапазоне',
        'Решение за O(n) с помощью стека'
      ],
      expectedOutput: 'largestRectangleArea([2,1,5,6,2,3]) -> 10\nlargestRectangleArea([2,4]) -> 4',
      hint: 'Используйте монотонно возрастающий стек индексов. Когда встречаете столбец ниже вершины стека — вычисляйте площадь для извлекаемого столбца. Ширина: от текущей позиции до нового peek стека.',
      solution: `import java.util.Stack;

public class LargestRectangle {
    public int largestRectangleArea(int[] heights) {
        Stack<Integer> stack = new Stack<>(); // стек индексов
        int maxArea = 0;
        int n = heights.length;

        for (int i = 0; i <= n; i++) {
            // Виртуальный столбец высотой 0 в конце — чтобы вытолкнуть все
            int currentHeight = (i == n) ? 0 : heights[i];

            while (!stack.isEmpty() && currentHeight < heights[stack.peek()]) {
                int height = heights[stack.pop()];
                // Ширина: от текущего i до элемента после нового peek
                int width = stack.isEmpty() ? i : i - stack.peek() - 1;
                maxArea = Math.max(maxArea, height * width);
            }
            stack.push(i);
        }
        return maxArea;
    }

    public static void main(String[] args) {
        LargestRectangle sol = new LargestRectangle();
        System.out.println(sol.largestRectangleArea(new int[]{2,1,5,6,2,3})); // 10
        System.out.println(sol.largestRectangleArea(new int[]{2,4})); // 4
        System.out.println(sol.largestRectangleArea(new int[]{1})); // 1
    }
}`,
      explanation: 'Монотонно возрастающий стек. При встрече столбца ниже вершины стека — извлекаем и считаем площадь: высота = height[pop], ширина = расстояние между текущим индексом и новой вершиной стека. Добавляем виртуальный 0-столбец в конце для обработки остатка. Каждый индекс push/pop ровно один раз — O(n).'
    }
  ]
}
