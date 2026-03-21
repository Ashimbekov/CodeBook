export default {
  id: 8,
  title: 'Двусвязный список',
  description: 'Улучшенный связный список с указателями в обе стороны. Добавление и удаление с обоих концов за O(1), обход вперёд и назад',
  lessons: [
    {
      id: 1,
      title: 'Идея двусвязного списка: prev + next',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вспомни обычный связный список — это как улица с односторонним движением. Ты можешь ехать только вперёд. Двусвязный список — это улица с двусторонним движением! Каждый узел знает как следующего, так и предыдущего соседа.' },
        { type: 'heading', value: 'Сравнение узлов' },
        { type: 'code', language: 'java', value: '// Односвязный Node: только вперёд\nclass NodeSingle {\n    int data;\n    NodeSingle next;  // -> следующий\n}\n// null <- [10] -> [20] -> [30] -> null\n//          ^нет пути назад!\n\n// Двусвязный Node: в обе стороны!\nclass Node {\n    int data;\n    Node prev;  // <- предыдущий\n    Node next;  // -> следующий\n}\n// null <- [10] <-> [20] <-> [30] -> null\n//   head=10                  tail=30' },
        { type: 'heading', value: 'Аналогия: двусторонняя лента' },
        { type: 'text', value: 'Представь CD-плеер с кнопками "Вперёд" и "Назад". Односвязный список — это плеер только с "Вперёд". Двусвязный — полноценный плеер: можно двигаться в обе стороны.' },
        { type: 'list', value: ['Удаление с конца — O(1) вместо O(n)!', 'Обход в обратном направлении', 'Вставка перед заданным узлом — O(1)', 'Цена: каждый узел хранит две ссылки (больше памяти)'] },
        { type: 'note', value: 'Java\'s LinkedList — это двусвязный список с указателями head и tail. Он используется как основа для деков (Deque) в стандартной библиотеке.' }
      ]
    },
    {
      id: 2,
      title: 'Класс Node с prev и реализация DoublyLinkedList',
      type: 'theory',
      content: [
        { type: 'text', value: 'Строим фундамент: класс Node с тремя полями и класс DoublyLinkedList с двумя "якорями" — head (начало) и tail (конец).' },
        { type: 'heading', value: 'Классы Node и DoublyLinkedList' },
        { type: 'code', language: 'java', value: 'class Node {\n    int data;\n    Node prev;  // Ссылка на предыдущий узел\n    Node next;  // Ссылка на следующий узел\n\n    Node(int data) {\n        this.data = data;\n        this.prev = null;\n        this.next = null;\n    }\n}\n\nclass DoublyLinkedList {\n    Node head;  // Первый узел\n    Node tail;  // Последний узел\n    int size;\n\n    DoublyLinkedList() {\n        head = null;\n        tail = null;\n        size = 0;\n    }\n\n    boolean isEmpty() {\n        return size == 0;\n    }\n\n    int size() {\n        return size;\n    }\n}' },
        { type: 'heading', value: 'Визуализация состояний' },
        { type: 'code', language: 'java', value: '// Пустой список:\n// head = null, tail = null\n\n// После addFirst(10):\n// head -> [null <-[10]-> null] <- tail\n// Один узел: head и tail указывают на один и тот же узел!\n\n// После addLast(20):\n// head -> [null <-[10]<-> [20]-> null] <- tail\n//                  ^           ^\n//                head         tail\n\n// После addLast(30):\n// head -> [10] <-> [20] <-> [30] <- tail\n//   head.prev = null\n//   tail.next = null\n//   [10].next = [20], [20].prev = [10]\n//   [20].next = [30], [30].prev = [20]' },
        { type: 'tip', value: 'Всегда следи за head и tail! При добавлении/удалении нужно обновлять оба. Самая частая ошибка — забыть обновить tail при добавлении в конец или обновить prev при вставке нового узла.' }
      ]
    },
    {
      id: 3,
      title: 'addFirst и addLast — O(1)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Главное преимущество двусвязного списка: addFirst и addLast оба работают за O(1)! Нам не нужно проходить весь список до конца — у нас есть tail.' },
        { type: 'heading', value: 'addFirst — добавление в начало O(1)' },
        { type: 'code', language: 'java', value: 'void addFirst(int data) {\n    Node newNode = new Node(data);\n\n    if (isEmpty()) {\n        head = newNode;\n        tail = newNode;  // Единственный узел — и голова, и хвост\n    } else {\n        newNode.next = head;  // Новый узел -> старый первый\n        head.prev = newNode;  // Старый первый <- новый узел\n        head = newNode;       // Теперь новый узел — голова\n    }\n    size++;\n}\n\n// Пример:\n// Было: head -> [20] <-> [30] <- tail\n// addFirst(10):\n//   newNode(10).next = head([20])\n//   head([20]).prev = newNode(10)\n//   head = newNode(10)\n// Стало: head -> [10] <-> [20] <-> [30] <- tail' },
        { type: 'heading', value: 'addLast — добавление в конец O(1)' },
        { type: 'code', language: 'java', value: 'void addLast(int data) {\n    Node newNode = new Node(data);\n\n    if (isEmpty()) {\n        head = newNode;\n        tail = newNode;\n    } else {\n        tail.next = newNode;  // Старый последний -> новый узел\n        newNode.prev = tail;  // Новый узел <- старый последний\n        tail = newNode;       // Теперь новый узел — хвост\n    }\n    size++;\n}\n\n// Было: head -> [10] <-> [20] <- tail\n// addLast(30):\n//   tail([20]).next = newNode(30)\n//   newNode(30).prev = tail([20])\n//   tail = newNode(30)\n// Стало: head -> [10] <-> [20] <-> [30] <- tail' },
        { type: 'note', value: 'Благодаря tail обе операции — O(1). В односвязном списке addLast без tail — O(n). Это главное преимущество хранения двух указателей!' }
      ]
    },
    {
      id: 4,
      title: 'removeFirst и removeLast — O(1)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Удаление с обоих концов — тоже O(1)! Это делает двусвязный список идеальной основой для деков (добавить/удалить с любого конца быстро).' },
        { type: 'heading', value: 'removeFirst — удаление с начала O(1)' },
        { type: 'code', language: 'java', value: 'int removeFirst() {\n    if (isEmpty()) throw new RuntimeException("Список пуст!");\n\n    int removed = head.data;\n\n    if (size == 1) {\n        head = null;\n        tail = null;\n    } else {\n        head = head.next;    // Голова переходит на второй узел\n        head.prev = null;    // У нового первого нет предыдущего\n    }\n    size--;\n    return removed;\n}\n\n// Было: head -> [10] <-> [20] <-> [30] <- tail\n// removeFirst():\n//   removed = 10\n//   head = head.next = [20]\n//   head.prev = null\n// Стало: head -> [20] <-> [30] <- tail' },
        { type: 'heading', value: 'removeLast — удаление с конца O(1)' },
        { type: 'code', language: 'java', value: 'int removeLast() {\n    if (isEmpty()) throw new RuntimeException("Список пуст!");\n\n    int removed = tail.data;\n\n    if (size == 1) {\n        head = null;\n        tail = null;\n    } else {\n        tail = tail.prev;    // Хвост переходит на предпоследний\n        tail.next = null;    // У нового последнего нет следующего\n    }\n    size--;\n    return removed;\n}\n\n// Было: head -> [10] <-> [20] <-> [30] <- tail\n// removeLast():\n//   removed = 30\n//   tail = tail.prev = [20]\n//   tail.next = null\n// Стало: head -> [10] <-> [20] <- tail' },
        { type: 'tip', value: 'Заметь: removeLast в двусвязном — O(1), а в односвязном — O(n). Это потому что здесь tail.prev сразу даёт нам предпоследний узел. В односвязном мы не знаем предыдущий — нужно обходить весь список!' }
      ]
    },
    {
      id: 5,
      title: 'Обход в обоих направлениях',
      type: 'theory',
      content: [
        { type: 'text', value: 'Два направления обхода — ещё одна "суперсила" двусвязного списка. Вперёд через next, назад через prev.' },
        { type: 'heading', value: 'printForward и printBackward' },
        { type: 'code', language: 'java', value: '// Обход вперёд — O(n)\nvoid printForward() {\n    Node current = head;\n    System.out.print("Forward: [");\n    while (current != null) {\n        System.out.print(current.data);\n        if (current.next != null) System.out.print(" <-> ");\n        current = current.next;\n    }\n    System.out.println("]");\n}\n\n// Обход назад — O(n)\nvoid printBackward() {\n    Node current = tail;  // Начинаем с ХВОСТА!\n    System.out.print("Backward: [");\n    while (current != null) {\n        System.out.print(current.data);\n        if (current.prev != null) System.out.print(" <-> ");\n        current = current.prev;  // Идём назад!\n    }\n    System.out.println("]");\n}' },
        { type: 'heading', value: 'Полный тест' },
        { type: 'code', language: 'java', value: 'DoublyLinkedList list = new DoublyLinkedList();\nlist.addLast(10);\nlist.addLast(20);\nlist.addLast(30);\nlist.addFirst(5);\n\nlist.printForward();   // Forward: [5 <-> 10 <-> 20 <-> 30]\nlist.printBackward();  // Backward: [30 <-> 20 <-> 10 <-> 5]\n\nSystem.out.println("Удалён с начала: " + list.removeFirst());  // 5\nSystem.out.println("Удалён с конца: " + list.removeLast());   // 30\n\nlist.printForward();   // Forward: [10 <-> 20]\nSystem.out.println("Размер: " + list.size());  // 2' },
        { type: 'list', value: ['addFirst: O(1) — обновляем head и его prev', 'addLast: O(1) — обновляем tail и его next', 'removeFirst: O(1) — обновляем head и его prev', 'removeLast: O(1) — обновляем tail и его next', 'get(i): O(n) — нет прямого доступа по индексу', 'Память: O(n), но каждый узел на 1 указатель больше'] }
      ]
    },
    {
      id: 6,
      title: 'Практика: Реализуй DoublyLinkedList',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй класс DoublyLinkedList с нуля. Нужны: Node (с prev и next), addFirst, addLast, removeFirst, removeLast, printForward, printBackward. Продемонстрируй все операции.',
      requirements: [
        'Класс Node с полями: int data, Node prev, Node next',
        'Класс DoublyLinkedList с полями: Node head, Node tail, int size',
        'void addFirst(int data) — обновляет head и связи',
        'void addLast(int data) — обновляет tail и связи',
        'int removeFirst() — O(1) удаление с начала',
        'int removeLast() — O(1) удаление с конца',
        'void printForward() — обход через next',
        'void printBackward() — обход через prev от tail',
        'В main: добавь 1,2,3 через addLast, добавь 0 через addFirst, выведи вперёд и назад, удали с обоих концов'
      ],
      expectedOutput: 'Вперёд: [0 <-> 1 <-> 2 <-> 3]\nНазад: [3 <-> 2 <-> 1 <-> 0]\nУдалён с начала: 0\nУдалён с конца: 3\nВперёд: [1 <-> 2]\nРазмер: 2',
      hint: 'В addLast: tail.next = newNode; newNode.prev = tail; tail = newNode. В removeLast: tail = tail.prev; tail.next = null. Не забудь случай size==1 — тогда head и tail оба = null.',
      solution: 'class Node {\n    int data;\n    Node prev, next;\n    Node(int data) { this.data = data; }\n}\n\nclass DoublyLinkedList {\n    Node head, tail;\n    int size;\n\n    boolean isEmpty() { return size == 0; }\n\n    void addFirst(int data) {\n        Node n = new Node(data);\n        if (isEmpty()) { head = tail = n; }\n        else {\n            n.next = head;\n            head.prev = n;\n            head = n;\n        }\n        size++;\n    }\n\n    void addLast(int data) {\n        Node n = new Node(data);\n        if (isEmpty()) { head = tail = n; }\n        else {\n            tail.next = n;\n            n.prev = tail;\n            tail = n;\n        }\n        size++;\n    }\n\n    int removeFirst() {\n        if (isEmpty()) throw new RuntimeException("Пусто!");\n        int val = head.data;\n        if (size == 1) { head = tail = null; }\n        else { head = head.next; head.prev = null; }\n        size--;\n        return val;\n    }\n\n    int removeLast() {\n        if (isEmpty()) throw new RuntimeException("Пусто!");\n        int val = tail.data;\n        if (size == 1) { head = tail = null; }\n        else { tail = tail.prev; tail.next = null; }\n        size--;\n        return val;\n    }\n\n    void printForward() {\n        Node cur = head;\n        System.out.print("Вперёд: [");\n        while (cur != null) {\n            System.out.print(cur.data);\n            if (cur.next != null) System.out.print(" <-> ");\n            cur = cur.next;\n        }\n        System.out.println("]");\n    }\n\n    void printBackward() {\n        Node cur = tail;\n        System.out.print("Назад: [");\n        while (cur != null) {\n            System.out.print(cur.data);\n            if (cur.prev != null) System.out.print(" <-> ");\n            cur = cur.prev;\n        }\n        System.out.println("]");\n    }\n\n    int size() { return size; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        DoublyLinkedList list = new DoublyLinkedList();\n        list.addLast(1);\n        list.addLast(2);\n        list.addLast(3);\n        list.addFirst(0);\n\n        list.printForward();\n        list.printBackward();\n        System.out.println("Удалён с начала: " + list.removeFirst());\n        System.out.println("Удалён с конца: " + list.removeLast());\n        list.printForward();\n        System.out.println("Размер: " + list.size());\n    }\n}',
      explanation: 'Двусвязный список сложнее в реализации: каждая операция должна обновлять ДВЕ ссылки (prev и next). Зато платим за это скоростью: все операции с концами — O(1). Сложнее всего — граничный случай: когда узел один, head и tail должны оба стать null. Всегда проверяй isEmpty() и size==1!'
    }
  ]
}
