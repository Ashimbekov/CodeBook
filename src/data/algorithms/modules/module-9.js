export default {
  id: 9,
  title: 'Стек',
  description: 'LIFO-структура данных: последний вошёл — первый вышел. Реализация на массиве и списке, применение для скобок, разворота строки и операции "отмена"',
  lessons: [
    {
      id: 1,
      title: 'Концепция LIFO — стопка тарелок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стек — это как стопка тарелок в буфете. Ты кладёшь тарелку сверху и берёшь тоже сверху. Нельзя взять тарелку снизу, не сняв все тарелки сверху. LIFO = Last In, First Out (последний вошёл — первый вышел).' },
        { type: 'tip', value: 'Ещё пример: стопка книг. Положил "Java" поверх "Python" — сначала возьмёшь "Java". Или история браузера: нажал "Назад" — вернулся на предыдущую страницу. Стек вокруг нас!' },
        { type: 'heading', value: 'Три главные операции' },
        { type: 'code', language: 'java', value: '// PUSH — положить элемент на вершину стека\n// POP  — взять (и удалить) элемент с вершины\n// PEEK — посмотреть на верхний элемент (не удалять)\n\n// Аналогия: ящик для входящих документов\n// push("Документ А")  -> [А]\n// push("Документ Б")  -> [А, Б]  <- верхний Б\n// push("Документ В")  -> [А, Б, В] <- верхний В\n// peek() -> "Документ В"  (не удаляем!)\n// pop()  -> "Документ В", стек: [А, Б]\n// pop()  -> "Документ Б", стек: [А]\n// pop()  -> "Документ А", стек: []' },
        { type: 'heading', value: 'Где используется стек?' },
        { type: 'list', value: ['Кнопка "Отмена" (Ctrl+Z) в редакторах — каждое действие кладётся в стек', 'Проверка сбалансированности скобок: ( { [ ] } )', 'История браузера — кнопка "Назад"', 'Стек вызовов функций (call stack) — как Java запускает методы', 'Разворот строки или массива', 'Перевод числа в двоичную систему'] },
        { type: 'note', value: 'В Java есть встроенный java.util.Stack, но профессионалы обычно используют java.util.Deque (ArrayDeque) как стек — он быстрее. Но нам важно понять, как это работает изнутри!' }
      ]
    },
    {
      id: 2,
      title: 'Реализация стека на массиве',
      type: 'theory',
      content: [
        { type: 'text', value: 'Самая простая реализация: массив + указатель на верхушку (top). Добавляем элементы слева направо, top всегда указывает на последний добавленный.' },
        { type: 'heading', value: 'ArrayStack — реализация на массиве' },
        { type: 'code', language: 'java', value: 'class ArrayStack {\n    private int[] data;     // Массив для хранения\n    private int top;        // Индекс верхнего элемента\n    private int capacity;  // Максимальный размер\n\n    ArrayStack(int capacity) {\n        this.capacity = capacity;\n        data = new int[capacity];\n        top = -1;  // -1 означает пустой стек\n    }\n\n    // Положить элемент на верхушку — O(1)\n    void push(int value) {\n        if (top == capacity - 1) {\n            throw new RuntimeException("Стек переполнен! (Stack Overflow)");\n        }\n        data[++top] = value;  // top увеличиваем и добавляем\n    }\n\n    // Взять и удалить верхний элемент — O(1)\n    int pop() {\n        if (isEmpty()) {\n            throw new RuntimeException("Стек пуст! (Stack Underflow)");\n        }\n        return data[top--];  // Возвращаем и уменьшаем top\n    }\n\n    // Посмотреть верхний элемент, не удаляя — O(1)\n    int peek() {\n        if (isEmpty()) throw new RuntimeException("Стек пуст!");\n        return data[top];\n    }\n\n    boolean isEmpty() { return top == -1; }\n    int size() { return top + 1; }\n}' },
        { type: 'heading', value: 'Как выглядит в памяти' },
        { type: 'code', language: 'java', value: '// ArrayStack capacity=5\n// push(10): data=[10, _, _, _, _], top=0\n// push(20): data=[10, 20, _, _, _], top=1\n// push(30): data=[10, 20, 30, _, _], top=2\n// peek()  -> 30 (верхний), top=2 (не изменился)\n// pop()   -> 30, data=[10, 20, _, _, _], top=1\n// pop()   -> 20, data=[10, _, _, _, _], top=0\n// isEmpty() -> false (ещё есть 10)\n// pop()   -> 10, top=-1\n// isEmpty() -> true' },
        { type: 'tip', value: 'Элемент "не удаляется" физически из массива при pop — просто top уменьшается. Это значит, что старые данные остаются в памяти, но недоступны (мы просто притворяемся, что их нет).' }
      ]
    },
    {
      id: 3,
      title: 'Реализация стека на связном списке',
      type: 'theory',
      content: [
        { type: 'text', value: 'Второй способ — использовать связный список. Добавляем и удаляем только с начала (head) — это O(1). Плюс: нет ограничения на размер!' },
        { type: 'heading', value: 'LinkedStack — реализация на списке' },
        { type: 'code', language: 'java', value: 'class LinkedStack {\n    private Node top;  // Верхний элемент стека\n    private int size;\n\n    private static class Node {\n        int data;\n        Node next;\n        Node(int data) { this.data = data; }\n    }\n\n    // push — добавляем в начало списка — O(1)\n    void push(int value) {\n        Node newNode = new Node(value);\n        newNode.next = top;  // Новый узел -> старая верхушка\n        top = newNode;       // Новая верхушка\n        size++;\n    }\n\n    // pop — удаляем с начала списка — O(1)\n    int pop() {\n        if (isEmpty()) throw new RuntimeException("Стек пуст!");\n        int value = top.data;\n        top = top.next;  // Верхушка переходит на следующий\n        size--;\n        return value;\n    }\n\n    // peek — смотрим верхушку — O(1)\n    int peek() {\n        if (isEmpty()) throw new RuntimeException("Стек пуст!");\n        return top.data;\n    }\n\n    boolean isEmpty() { return top == null; }\n    int size() { return size; }\n}' },
        { type: 'heading', value: 'Трассировка LinkedStack' },
        { type: 'code', language: 'java', value: '// Изначально: top = null\n// push(10): top -> [10 | null]\n// push(20): top -> [20 | ->10] -> [10 | null]\n// push(30): top -> [30 | ->20] -> [20 | ->10] -> [10 | null]\n// peek() -> 30\n// pop()  -> 30, top -> [20 | ->10] -> [10 | null]\n// pop()  -> 20, top -> [10 | null]\n// pop()  -> 10, top = null\n// isEmpty() -> true' },
        { type: 'note', value: 'LinkedStack vs ArrayStack: LinkedStack — нет ограничений по размеру, чуть медленнее из-за создания объектов. ArrayStack — быстрее (работа с примитивами), но нужно знать максимальный размер заранее.' }
      ]
    },
    {
      id: 4,
      title: 'Применение: проверка скобок',
      type: 'theory',
      content: [
        { type: 'text', value: 'Классическая задача для стека — проверить, правильно ли расставлены скобки: (), [], {}. Алгоритм: встретили открывающую — кладём в стек, встретили закрывающую — проверяем, совпадает ли с верхушкой стека.' },
        { type: 'heading', value: 'Алгоритм проверки скобок' },
        { type: 'code', language: 'java', value: 'import java.util.Stack;\n\nstatic boolean isBalanced(String s) {\n    Stack<Character> stack = new Stack<>();\n\n    for (char c : s.toCharArray()) {\n        // Открывающая скобка — кладём в стек\n        if (c == \'(\' || c == \'[\' || c == \'{\') {\n            stack.push(c);\n        }\n        // Закрывающая скобка — проверяем пару\n        else if (c == \')\' || c == \']\' || c == \'}\') {\n            if (stack.isEmpty()) return false;  // Нечем закрывать\n            char top = stack.pop();\n            if (c == \')\' && top != \'(\') return false;\n            if (c == \']\' && top != \'[\') return false;\n            if (c == \'}\' && top != \'{\') return false;\n        }\n    }\n\n    return stack.isEmpty();  // Остались незакрытые?\n}\n\n// Тест:\nSystem.out.println(isBalanced("({[]})"));   // true\nSystem.out.println(isBalanced("([)]"));     // false\nSystem.out.println(isBalanced("{[}"));      // false\nSystem.out.println(isBalanced("((()))"));   // true' },
        { type: 'heading', value: 'Трассировка для "({[]})"' },
        { type: 'code', language: 'java', value: '// Строка: "({[]})" — проверяем символ за символом\n// c=\'(\'  -> открывающая -> push(\'(\')  стек: [(]\n// c=\'{\'  -> открывающая -> push(\'{\')  стек: [(, {]\n// c=\'[\'  -> открывающая -> push(\'[\')  стек: [(, {, []\n// c=\']\'  -> закрывающая -> pop()=\'[\' -> \'[\' совпадает с \']\' -> ОК  стек: [(, {]\n// c=\'}\'  -> закрывающая -> pop()=\'{\' -> \'{\' совпадает с \'}\' -> ОК  стек: [(]\n// c=\')\'  -> закрывающая -> pop()=\'(\' -> \'(\' совпадает с \')\' -> ОК  стек: []\n// stack.isEmpty() -> true -> СБАЛАНСИРОВАНО!' }
      ]
    },
    {
      id: 5,
      title: 'Применение: разворот строки и отмена действий',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стек — идеальный инструмент для "обратных" задач. Разворот строки: кладём все символы в стек, потом извлекаем (LIFO даёт обратный порядок). Отмена действий: каждое действие кладём в стек, Ctrl+Z — pop.' },
        { type: 'heading', value: 'Разворот строки с помощью стека' },
        { type: 'code', language: 'java', value: 'import java.util.Stack;\n\nstatic String reverseString(String s) {\n    Stack<Character> stack = new Stack<>();\n\n    // Кладём все символы в стек\n    for (char c : s.toCharArray()) {\n        stack.push(c);\n    }\n\n    // Извлекаем в обратном порядке (LIFO!)\n    StringBuilder reversed = new StringBuilder();\n    while (!stack.isEmpty()) {\n        reversed.append(stack.pop());\n    }\n\n    return reversed.toString();\n}\n\n// "Hello" -> стек: [H, e, l, l, o] (o сверху)\n// pop: o, l, l, e, H -> "olleH"\nSystem.out.println(reverseString("Hello"));   // olleH\nSystem.out.println(reverseString("Привет"));  // тевирП' },
        { type: 'heading', value: 'Симуляция операции Undo (отмена)' },
        { type: 'code', language: 'java', value: 'import java.util.Stack;\n\nclass TextEditor {\n    private String text = "";\n    private Stack<String> history = new Stack<>();\n\n    void type(String addition) {\n        history.push(text);  // Сохраняем текущее состояние\n        text += addition;\n        System.out.println("Текст: " + text);\n    }\n\n    void undo() {\n        if (!history.isEmpty()) {\n            text = history.pop();  // Восстанавливаем прошлое\n            System.out.println("Отмена. Текст: " + text);\n        } else {\n            System.out.println("Нечего отменять!");\n        }\n    }\n}\n\n// Демо:\nTextEditor editor = new TextEditor();\neditor.type("Привет");    // Текст: Привет\neditor.type(", мир!");    // Текст: Привет, мир!\neditor.type(" Как дела?"); // Текст: Привет, мир! Как дела?\neditor.undo();             // Отмена. Текст: Привет, мир!\neditor.undo();             // Отмена. Текст: Привет' },
        { type: 'tip', value: 'Стек истории — основа любого редактора. В реальных IDE стек может хранить тысячи операций. Для "повтора" (Ctrl+Y) используют второй стек: при undo кладём состояние в стек redo, при redo — обратно.' }
      ]
    },
    {
      id: 6,
      title: 'Сложность и сравнение реализаций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Оба варианта стека — массив и список — дают O(1) для всех основных операций. Различия в деталях.' },
        { type: 'heading', value: 'Таблица сложности' },
        { type: 'code', language: 'java', value: '// Операция     | ArrayStack | LinkedStack\n// -------------|------------|------------\n// push          |   O(1)     |   O(1)\n// pop           |   O(1)     |   O(1)\n// peek          |   O(1)     |   O(1)\n// isEmpty       |   O(1)     |   O(1)\n// size          |   O(1)     |   O(1)\n//\n// Память        |   O(n)     |   O(n)\n//\n// ArrayStack: нужно знать max размер заранее\n// LinkedStack: динамически растёт, но создаёт объекты' },
        { type: 'heading', value: 'Когда что использовать' },
        { type: 'list', value: ['ArrayStack — когда максимальный размер известен заранее и важна скорость (нет накладных расходов на объекты)', 'LinkedStack — когда размер непредсказуем, не хочется думать о переполнении', 'java.util.ArrayDeque — самый быстрый вариант в Java: используй как стек через push/pop', 'java.util.Stack — устаревший, синхронизированный (медленный), избегай в новом коде'] },
        { type: 'code', language: 'java', value: '// Профессиональный способ использовать стек в Java:\nimport java.util.ArrayDeque;\nimport java.util.Deque;\n\nDeque<Integer> stack = new ArrayDeque<>();\nstack.push(10);    // добавить сверху\nstack.push(20);\nstack.push(30);\nSystem.out.println(stack.peek());  // 30 — верхний\nSystem.out.println(stack.pop());   // 30 — снять\nSystem.out.println(stack.pop());   // 20\nSystem.out.println(stack.isEmpty()); // false (ещё есть 10)' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Проверка скобок',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй функцию isBalanced(String s), которая проверяет, правильно ли расставлены скобки трёх видов: (), [], {}. Используй Stack из java.util. Протестируй несколько строк.',
      requirements: [
        'Метод boolean isBalanced(String s) использует java.util.Stack<Character>',
        'Открывающие скобки (, [, { — кладём в стек',
        'Закрывающие ), ], } — извлекаем из стека и проверяем совпадение',
        'Если стек пуст при встрече закрывающей — false',
        'В конце: если стек пуст — true, иначе false',
        'Протестируй: "({[]})", "([)]", "((())", "{{}}", ""'
      ],
      expectedOutput: '({[]}) -> true\n([)] -> false\n((() -> false\n{{}} -> true\n (пустая строка) -> true',
      hint: 'Для проверки пары используй вспомогательный метод или серию if-else. Пример проверки: if (c == \')\' && top != \'(\') return false;',
      solution: 'import java.util.Stack;\n\npublic class Main {\n\n    static boolean isBalanced(String s) {\n        Stack<Character> stack = new Stack<>();\n\n        for (char c : s.toCharArray()) {\n            if (c == \'(\' || c == \'[\' || c == \'{\') {\n                stack.push(c);\n            } else if (c == \')\' || c == \']\' || c == \'}\') {\n                if (stack.isEmpty()) return false;\n                char top = stack.pop();\n                if (c == \')\' && top != \'(\') return false;\n                if (c == \']\' && top != \'[\') return false;\n                if (c == \'}\' && top != \'{\') return false;\n            }\n        }\n\n        return stack.isEmpty();\n    }\n\n    public static void main(String[] args) {\n        System.out.println("({[]}) -> " + isBalanced("({[]})"));  // true\n        System.out.println("([)] -> "  + isBalanced("([)]"));    // false\n        System.out.println("((() -> "  + isBalanced("((()"));    // false\n        System.out.println("{{}} -> "  + isBalanced("{{}}"));    // true\n        System.out.println(" (пустая строка) -> " + isBalanced("")); // true\n    }\n}',
      explanation: 'Стек идеален для скобок — это "парная" задача. Открывающая скобка ждёт своей пары: кладём её в стек. Встретив закрывающую, смотрим на вершину стека — там должна быть соответствующая открывающая. Если нет — ошибка. В конце стек должен быть пустой — иначе остались незакрытые скобки. Сложность O(n) времени, O(n) памяти.'
    }
  ]
}
