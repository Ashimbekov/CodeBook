export default {
  id: 10,
  title: 'Очередь и дек',
  description: 'FIFO-структура: первый вошёл — первый вышел. Реализация на массиве (кольцевая) и на списке, дек с двумя концами, применения в реальных задачах',
  lessons: [
    {
      id: 1,
      title: 'Концепция FIFO — очередь в магазине',
      type: 'theory',
      content: [
        { type: 'text', value: 'Очередь — это как очередь в магазине или кассу. Первый, кто встал в очередь — первый обслуживается. Новые люди встают в конец. FIFO = First In, First Out (первый вошёл — первый вышел).' },
        { type: 'tip', value: 'Разница со стеком: стек — тарелки (берёшь сверху, кладёшь сверху). Очередь — труба: кладёшь с одного конца, берёшь с другого. Два разных конца!' },
        { type: 'heading', value: 'Основные операции' },
        { type: 'code', language: 'java', value: '// ENQUEUE — добавить элемент в конец очереди\n// DEQUEUE  — извлечь элемент из начала очереди\n// PEEK     — посмотреть первый элемент (не удалять)\n\n// Пример: очередь принтера\n// enqueue("Документ А")  -> [А]\n// enqueue("Документ Б")  -> [А, Б]  <- конец Б\n// enqueue("Документ В")  -> [А, Б, В]\n// peek()   -> "Документ А" (первый в очереди!)\n// dequeue() -> "Документ А", очередь: [Б, В]\n// dequeue() -> "Документ Б", очередь: [В]\n// dequeue() -> "Документ В", очередь: []' },
        { type: 'heading', value: 'Где используется очередь?' },
        { type: 'list', value: ['Очередь задач в принтере — первый документ печатается первым', 'BFS (поиск в ширину) на графах и деревьях', 'Обработка запросов на сервере — по порядку поступления', 'Буфер обмена данными между процессами', 'Планировщик задач операционной системы — очередь процессов', 'Кэширование: новые данные вытесняют старые'] },
        { type: 'note', value: 'В Java есть интерфейс Queue с реализациями LinkedList и ArrayDeque. Метод offer() = enqueue, poll() = dequeue, peek() = peek. Профессионалы используют ArrayDeque как самую быструю реализацию.' }
      ]
    },
    {
      id: 2,
      title: 'Очередь на связном списке',
      type: 'theory',
      content: [
        { type: 'text', value: 'Самая понятная реализация: двусвязный список с head и tail. Добавляем в хвост (enqueue) — O(1), берём из головы (dequeue) — O(1). Идеально!' },
        { type: 'heading', value: 'LinkedQueue — реализация на списке' },
        { type: 'code', language: 'java', value: 'class LinkedQueue {\n    private Node head;  // Начало очереди (откуда берём)\n    private Node tail;  // Конец очереди (куда добавляем)\n    private int size;\n\n    private static class Node {\n        int data;\n        Node next;\n        Node(int data) { this.data = data; }\n    }\n\n    // Добавить в конец — O(1)\n    void enqueue(int value) {\n        Node newNode = new Node(value);\n        if (isEmpty()) {\n            head = newNode;\n            tail = newNode;\n        } else {\n            tail.next = newNode;  // Старый хвост -> новый узел\n            tail = newNode;       // Новый хвост\n        }\n        size++;\n    }\n\n    // Извлечь из начала — O(1)\n    int dequeue() {\n        if (isEmpty()) throw new RuntimeException("Очередь пуста!");\n        int value = head.data;\n        head = head.next;\n        if (head == null) tail = null;  // Очередь стала пустой\n        size--;\n        return value;\n    }\n\n    // Посмотреть первый элемент — O(1)\n    int peek() {\n        if (isEmpty()) throw new RuntimeException("Очередь пуста!");\n        return head.data;\n    }\n\n    boolean isEmpty() { return head == null; }\n    int size() { return size; }\n}' },
        { type: 'heading', value: 'Трассировка' },
        { type: 'code', language: 'java', value: '// head=null, tail=null\n// enqueue(1): head->[1]<-tail\n// enqueue(2): head->[1]->[2]<-tail\n// enqueue(3): head->[1]->[2]->[3]<-tail\n// peek() -> 1 (голова)\n// dequeue() -> 1, head->[2]->[3]<-tail\n// dequeue() -> 2, head->[3]<-tail\n// dequeue() -> 3, head=null, tail=null\n// isEmpty() -> true' },
        { type: 'tip', value: 'Важная деталь: если после dequeue список стал пустым (head=null), нужно обнулить и tail! Иначе tail будет указывать на удалённый узел — "висячая ссылка".' }
      ]
    },
    {
      id: 3,
      title: 'Кольцевая очередь на массиве',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реализация очереди на обычном массиве имеет проблему: после многих enqueue/dequeue начало массива "пустует". Кольцевой (циклический) массив решает это: когда доходим до конца — начинаем сначала. Как циферблат часов!' },
        { type: 'heading', value: 'Проблема обычного массива' },
        { type: 'code', language: 'java', value: '// Обычный массив capacity=5:\n// enqueue(1): [1, _, _, _, _], front=0, rear=0\n// enqueue(2): [1, 2, _, _, _], front=0, rear=1\n// enqueue(3): [1, 2, 3, _, _], front=0, rear=2\n// dequeue() -> 1: [_, 2, 3, _, _], front=1, rear=2\n// dequeue() -> 2: [_, _, 3, _, _], front=2, rear=2\n// enqueue(4): [_, _, 3, 4, _], front=2, rear=3\n// enqueue(5): [_, _, 3, 4, 5], front=2, rear=4\n// enqueue(6): rear=5 -- ВЫХОДИМ ЗА ГРАНИЦУ! Но ячейки 0,1 свободны!\n// КОЛЬЦЕВОЙ: rear = (rear + 1) % capacity -> rear = 0!' },
        { type: 'heading', value: 'Circular ArrayQueue — кольцевая очередь' },
        { type: 'code', language: 'java', value: 'class CircularQueue {\n    private int[] data;\n    private int front;      // Индекс первого элемента\n    private int rear;       // Индекс следующей свободной позиции\n    private int size;\n    private int capacity;\n\n    CircularQueue(int capacity) {\n        this.capacity = capacity;\n        data = new int[capacity];\n        front = 0;\n        rear = 0;\n        size = 0;\n    }\n\n    // Добавить в конец — O(1)\n    void enqueue(int value) {\n        if (size == capacity) throw new RuntimeException("Очередь полна!");\n        data[rear] = value;\n        rear = (rear + 1) % capacity;  // Кольцо!\n        size++;\n    }\n\n    // Извлечь из начала — O(1)\n    int dequeue() {\n        if (isEmpty()) throw new RuntimeException("Очередь пуста!");\n        int value = data[front];\n        front = (front + 1) % capacity;  // Кольцо!\n        size--;\n        return value;\n    }\n\n    int peek() {\n        if (isEmpty()) throw new RuntimeException("Очередь пуста!");\n        return data[front];\n    }\n\n    boolean isEmpty() { return size == 0; }\n    boolean isFull()  { return size == capacity; }\n    int size() { return size; }\n}' },
        { type: 'code', language: 'java', value: '// Трассировка кольцевой очереди capacity=4:\n// enqueue(10): data=[10,_,_,_], front=0, rear=1, size=1\n// enqueue(20): data=[10,20,_,_], front=0, rear=2, size=2\n// enqueue(30): data=[10,20,30,_], front=0, rear=3, size=3\n// dequeue()->10: data=[_,20,30,_], front=1, rear=3, size=2\n// enqueue(40): data=[_,20,30,40], front=1, rear=0(3+1)%4=0!, size=3\n// enqueue(50): data=[50,20,30,40], front=1, rear=1, size=4  <- ЗАПОЛНЕНА!\n// dequeue()->20: front=2, size=3\n// dequeue()->30: front=3, size=2' },
        { type: 'note', value: 'Магия кольцевого массива: операция % (modulo). (rear + 1) % capacity — если rear был 3 при capacity=4, то (3+1)%4 = 0. Мы "перепрыгиваем" с конца в начало!' }
      ]
    },
    {
      id: 4,
      title: 'Дек (Deque) — двусторонняя очередь',
      type: 'theory',
      content: [
        { type: 'text', value: 'Дек (Deque = Double-Ended Queue) — это "прокачанная" очередь: можно добавлять и извлекать элементы с ОБОИХ концов. Это объединяет возможности стека и очереди!' },
        { type: 'tip', value: 'Аналогия: двусторонний автобус. Люди заходят и выходят и спереди, и сзади. Обычная очередь — заходишь только сзади, выходишь только спереди.' },
        { type: 'heading', value: 'Операции дека' },
        { type: 'code', language: 'java', value: '// Дек поддерживает ВСЕ 6 операций:\n// addFirst(x)    — добавить в НАЧАЛО\n// addLast(x)     — добавить в КОНЕЦ\n// removeFirst()  — удалить из НАЧАЛА\n// removeLast()   — удалить из КОНЦА\n// peekFirst()    — посмотреть первый\n// peekLast()     — посмотреть последний\n\n// Используя Java ArrayDeque как дек:\nimport java.util.ArrayDeque;\nimport java.util.Deque;\n\nDeque<Integer> deque = new ArrayDeque<>();\ndeque.addFirst(10);  // [10]\ndeque.addLast(20);   // [10, 20]\ndeque.addFirst(5);   // [5, 10, 20]\ndeque.addLast(30);   // [5, 10, 20, 30]\n\nSystem.out.println(deque.peekFirst()); // 5\nSystem.out.println(deque.peekLast());  // 30\n\ndeque.removeFirst();  // Удаляем 5  -> [10, 20, 30]\ndeque.removeLast();   // Удаляем 30 -> [10, 20]\nSystem.out.println(deque);  // [10, 20]' },
        { type: 'heading', value: 'Реализация дека на двусвязном списке' },
        { type: 'code', language: 'java', value: '// Дек на двусвязном списке — все операции O(1)!\n// (Используем DoublyLinkedList из модуля 8)\n//\n// Дек как СТЕК: используй addFirst/removeFirst\n//   push(x) = addFirst(x)\n//   pop()   = removeFirst()\n//\n// Дек как ОЧЕРЕДЬ: используй addLast/removeFirst\n//   enqueue(x) = addLast(x)\n//   dequeue()  = removeFirst()\n//\n// Или наоборот! Дек гибкий.' },
        { type: 'list', value: ['addFirst/removeFirst: O(1)', 'addLast/removeLast: O(1)', 'peekFirst/peekLast: O(1)', 'Память: O(n)', 'Применения: палиндром, скользящее окно, LRU-кэш'] }
      ]
    },
    {
      id: 5,
      title: 'Применение: BFS и симуляция очереди задач',
      type: 'theory',
      content: [
        { type: 'text', value: 'Очередь — основа алгоритма BFS (поиск в ширину). BFS обходит граф или дерево "по слоям": сначала все соседи текущего, потом их соседи. Очередь обеспечивает правильный порядок.' },
        { type: 'heading', value: 'BFS на дереве с помощью очереди' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\n// Простое бинарное дерево\nclass TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int val) { this.val = val; }\n}\n\n// Обход дерева в ширину (BFS) — по уровням\nvoid bfs(TreeNode root) {\n    if (root == null) return;\n\n    Queue<TreeNode> queue = new LinkedList<>();\n    queue.offer(root);  // Кладём корень в очередь\n\n    while (!queue.isEmpty()) {\n        TreeNode node = queue.poll();  // Берём первый\n        System.out.print(node.val + " ");\n\n        // Кладём детей в очередь (они будут обработаны потом)\n        if (node.left  != null) queue.offer(node.left);\n        if (node.right != null) queue.offer(node.right);\n    }\n}\n\n// Дерево:    1\n//           / \\\n//          2   3\n//         / \\\n//        4   5\n// BFS: 1 2 3 4 5 (по уровням!)' },
        { type: 'heading', value: 'Симуляция очереди печати' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\nQueue<String> printQueue = new LinkedList<>();\n\n// Добавляем документы в очередь\nprintQueue.offer("Отчёт за январь");\nprintQueue.offer("Презентация");\nprintQueue.offer("Контракт");\n\nSystem.out.println("Документов в очереди: " + printQueue.size());\n\n// Печатаем по одному (FIFO — в порядке поступления!)\nwhile (!printQueue.isEmpty()) {\n    String doc = printQueue.poll();\n    System.out.println("Печатаю: " + doc);\n}\n// Вывод:\n// Документов в очереди: 3\n// Печатаю: Отчёт за январь\n// Печатаю: Презентация\n// Печатаю: Контракт' },
        { type: 'tip', value: 'offer() предпочтительнее add() в Java Queue: offer() возвращает false при переполнении, add() бросает исключение. Аналогично, poll() вместо remove() (poll возвращает null, remove бросает исключение).' }
      ]
    },
    {
      id: 6,
      title: 'Сравнение: очередь vs стек vs дек',
      type: 'theory',
      content: [
        { type: 'text', value: 'Подведём итоги: стек, очередь и дек — родственные структуры данных. Различаются только правилами доступа к элементам.' },
        { type: 'heading', value: 'Сравнительная таблица' },
        { type: 'code', language: 'java', value: '// Структура  | Добавление | Удаление   | Порядок\n// ------------|------------|------------|--------\n// Stack (стек)| только сверху (push) | только сверху (pop) | LIFO\n// Queue (очер)| в конец (enqueue) | из начала (dequeue) | FIFO\n// Deque (дек) | с обоих концов | с обоих концов | Любой\n\n// Все операции: O(1)\n// Все требуют памяти: O(n)\n\n// Когда что использовать:\n// Stack: Ctrl+Z, скобки, DFS, парсинг выражений\n// Queue: BFS, очередь задач, буферы\n// Deque: скользящее окно, палиндромы, замена и стека и очереди' },
        { type: 'heading', value: 'Java API — лучшие реализации' },
        { type: 'code', language: 'java', value: 'import java.util.*;\n\n// КАК СТЕК:\nDeque<Integer> stack = new ArrayDeque<>();\nstack.push(1);   // addFirst\nstack.pop();     // removeFirst\nstack.peek();    // peekFirst\n\n// КАК ОЧЕРЕДЬ:\nQueue<Integer> queue = new ArrayDeque<>();\nqueue.offer(1);  // addLast\nqueue.poll();    // removeFirst\nqueue.peek();    // peekFirst\n\n// КАК ДЕК (оба конца):\nDeque<Integer> deque = new ArrayDeque<>();\ndeque.addFirst(1);    deque.addLast(2);\ndeque.removeFirst();  deque.removeLast();\ndeque.peekFirst();    deque.peekLast();\n\n// ArrayDeque БЫСТРЕЕ LinkedList для всех этих задач!' },
        { type: 'note', value: 'ArrayDeque — универсальный инструмент: работает как стек, очередь и дек. Внутри использует кольцевой массив с автоматическим расширением (как ArrayList). Запомни: ArrayDeque = твой лучший друг для стека и очереди в Java.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Реализуй Queue и проверь палиндром',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй LinkedQueue с нуля (enqueue, dequeue, peek, isEmpty, size). Затем используй Stack + Queue вместе, чтобы определить, является ли строка палиндромом (читается одинаково с обоих концов).',
      requirements: [
        'Реализуй класс LinkedQueue с вложенным классом Node',
        'Методы: void enqueue(char c), char dequeue(), char peek(), boolean isEmpty()',
        'Метод boolean isPalindrome(String s): использует Queue и Stack из java.util',
        'Алгоритм: положи все символы в очередь И в стек; потом сравнивай символы из очереди (спереди) и из стека (сзади)',
        'Протестируй: "radar", "hello", "level", "java"'
      ],
      expectedOutput: 'radar -> true\nhello -> false\nlevel -> true\njava -> false',
      hint: 'Для палиндрома: символы из очереди идут слева направо, из стека — справа налево. Если все пары совпадают — палиндром. Пример: "radar" — очередь даёт r,a,d,a,r; стек даёт r,a,d,a,r.',
      solution: 'import java.util.Stack;\n\nclass LinkedQueue {\n    private Node head, tail;\n    private int size;\n\n    private static class Node {\n        char data;\n        Node next;\n        Node(char data) { this.data = data; }\n    }\n\n    void enqueue(char c) {\n        Node newNode = new Node(c);\n        if (head == null) { head = tail = newNode; }\n        else { tail.next = newNode; tail = newNode; }\n        size++;\n    }\n\n    char dequeue() {\n        if (isEmpty()) throw new RuntimeException("Пусто!");\n        char val = head.data;\n        head = head.next;\n        if (head == null) tail = null;\n        size--;\n        return val;\n    }\n\n    char peek() { return head.data; }\n    boolean isEmpty() { return head == null; }\n    int size() { return size; }\n}\n\npublic class Main {\n\n    static boolean isPalindrome(String s) {\n        LinkedQueue queue = new LinkedQueue();\n        Stack<Character> stack = new Stack<>();\n\n        // Кладём все символы в обе структуры\n        for (char c : s.toCharArray()) {\n            queue.enqueue(c);  // Очередь: слева направо\n            stack.push(c);     // Стек: тоже, но pop даст справа налево\n        }\n\n        // Сравниваем: очередь (спереди) vs стек (сзади)\n        while (!queue.isEmpty()) {\n            if (queue.dequeue() != stack.pop()) {\n                return false;  // Не совпало!\n            }\n        }\n        return true;\n    }\n\n    public static void main(String[] args) {\n        System.out.println("radar -> " + isPalindrome("radar"));\n        System.out.println("hello -> " + isPalindrome("hello"));\n        System.out.println("level -> " + isPalindrome("level"));\n        System.out.println("java -> "  + isPalindrome("java"));\n    }\n}',
      explanation: 'Алгоритм использует разницу между стеком (LIFO) и очередью (FIFO): очередь отдаёт символы слева направо, стек — справа налево. Если строка — палиндром, оба порядка совпадают. Это элегантный способ проверки без дополнительных индексов. Сложность O(n) времени, O(n) памяти.'
    }
  ]
}
