export default {
  id: 7,
  title: 'Связный список',
  description: 'Динамическая структура данных из узлов-цепочек. Реализуем с нуля на Java: добавление, удаление, поиск по индексу',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужны связные списки? Ограничения массивов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Представь, что массив — это ряд парт в классе. Все парты стоят вплотную, подряд. Если учитель хочет вставить новую парту в середину — нужно подвинуть ВСЕ парты справа! Это долго и неудобно. Связный список решает эту проблему.' },
        { type: 'heading', value: 'Проблемы массивов' },
        { type: 'list', value: ['Фиксированный размер (в Java int[] нельзя увеличить)', 'Вставка в середину — O(n): нужно сдвигать все элементы', 'Удаление из середины — O(n): нужно сдвигать все элементы', 'Неэффективная память: заранее резервируем место, которое может не использоваться'] },
        { type: 'heading', value: 'Аналогия: поезд из вагонов' },
        { type: 'text', value: 'Связный список — это как поезд. Каждый вагон (узел) знает только про следующий вагон. Хочешь добавить вагон в начало? Просто прицепи его! Хочешь убрать вагон из середины? Просто перецепи ссылки! Никуда двигаться не нужно.' },
        { type: 'code', language: 'java', value: '// Сравнение операций:\n// Вставка в начало:\n//   Массив:        O(n) — сдвиг всех элементов вправо\n//   Связный список: O(1) — просто меняем ссылку head\n//\n// Вставка в конец:\n//   Массив:        O(1) амортизировано (если знаем размер)\n//   Связный список: O(n) без хранения tail, O(1) с tail\n//\n// Доступ по индексу arr[i]:\n//   Массив:        O(1) — прямой доступ по адресу\n//   Связный список: O(n) — нужно пройти с начала до i\n//\n// Вставка в середину (зная позицию):\n//   Массив:        O(n) — сдвиг\n//   Связный список: O(1) — только ссылки!' },
        { type: 'note', value: 'Связный список лучше массива для частых вставок/удалений в начало или конец. Массив лучше для частого доступа по индексу. Выбирай структуру под задачу!' }
      ]
    },
    {
      id: 2,
      title: 'Класс Node — кирпичик списка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый элемент связного списка — это объект Node (узел). Узел хранит два поля: данные (data) и ссылку на следующий узел (next). Если next = null — это конец списка.' },
        { type: 'tip', value: 'Node — как записка с двумя частями: "моё значение" и "адрес следующей записки". Последняя записка пишет "следующей нет" (next = null).' },
        { type: 'heading', value: 'Класс Node' },
        { type: 'code', language: 'java', value: 'class Node {\n    int data;   // Данные узла\n    Node next;  // Ссылка на следующий узел\n\n    // Конструктор\n    Node(int data) {\n        this.data = data;\n        this.next = null;  // По умолчанию — конец списка\n    }\n}\n\n// Создаём узлы вручную:\nNode node1 = new Node(10);\nNode node2 = new Node(20);\nNode node3 = new Node(30);\n\n// Связываем их:\nnode1.next = node2;  // 10 -> 20\nnode2.next = node3;  // 20 -> 30\n// node3.next = null (по умолчанию)\n\n// Цепочка: 10 -> 20 -> 30 -> null' },
        { type: 'heading', value: 'Как выглядит в памяти' },
        { type: 'code', language: 'java', value: '// В памяти компьютера узлы могут быть ГДЕ УГОДНО!\n// Не обязательно рядом, как в массиве.\n//\n// Адрес 0x100: [data=10, next=0x240]  <- node1\n// Адрес 0x240: [data=20, next=0x580]  <- node2\n// Адрес 0x580: [data=30, next=null]   <- node3\n//\n// Логически:  10 --> 20 --> 30 --> null\n//\n// head всегда указывает на первый узел (0x100)\n// Если head = null — список пустой' },
        { type: 'warning', value: 'В связном списке нет индексов! Нельзя написать list[2]. Чтобы добраться до 3-го элемента, нужно пройти: head -> node1 -> node2 -> node3. Это занимает O(n) времени.' }
      ]
    },
    {
      id: 3,
      title: 'Класс LinkedList и addFirst',
      type: 'theory',
      content: [
        { type: 'text', value: 'Теперь создаём класс LinkedList — он управляет цепочкой узлов. Внутри хранит ссылку head (голова списка) и size (размер). Начнём с операции addFirst — добавление в начало.' },
        { type: 'heading', value: 'Основа класса LinkedList' },
        { type: 'code', language: 'java', value: 'class LinkedList {\n    Node head;  // Первый узел списка\n    int size;   // Количество элементов\n\n    LinkedList() {\n        head = null;\n        size = 0;\n    }\n\n    // Добавить элемент В НАЧАЛО списка — O(1)!\n    void addFirst(int data) {\n        Node newNode = new Node(data);  // Создаём новый узел\n        newNode.next = head;            // Новый узел указывает на старый первый\n        head = newNode;                 // Head теперь указывает на новый узел\n        size++;                         // Увеличиваем размер\n    }\n}' },
        { type: 'heading', value: 'Как работает addFirst — пошагово' },
        { type: 'code', language: 'java', value: '// Начальное состояние: head -> [20] -> [30] -> null\n\n// addFirst(10):\n// 1. Создаём newNode = Node(10), newNode.next = null\n// 2. newNode.next = head  => newNode.next = [20]\n//    Теперь: newNode -> [20] -> [30] -> null, но head всё ещё на [20]\n// 3. head = newNode\n//    Теперь: head -> [10] -> [20] -> [30] -> null\n// 4. size++: size = 3\n\n// Демонстрация:\nLinkedList list = new LinkedList();\nlist.addFirst(30);  // head -> [30] -> null\nlist.addFirst(20);  // head -> [20] -> [30] -> null\nlist.addFirst(10);  // head -> [10] -> [20] -> [30] -> null' },
        { type: 'tip', value: 'addFirst — самая быстрая операция: O(1)! Не важно, 10 или 1 000 000 элементов в списке — добавление в начало всегда занимает одинаковое время. Просто меняем одну ссылку.' }
      ]
    },
    {
      id: 4,
      title: 'addLast, removeFirst, removeLast',
      type: 'theory',
      content: [
        { type: 'text', value: 'Теперь реализуем остальные базовые операции: добавление в конец и удаление с обоих концов. Для addLast нужно "дойти до конца" — это O(n). Но с указателем tail — O(1)!' },
        { type: 'heading', value: 'addLast — добавление в конец' },
        { type: 'code', language: 'java', value: '// Добавить элемент В КОНЕЦ списка — O(n)\nvoid addLast(int data) {\n    Node newNode = new Node(data);\n\n    if (head == null) {  // Список пустой\n        head = newNode;\n    } else {\n        // Идём до последнего узла\n        Node current = head;\n        while (current.next != null) {\n            current = current.next;  // Шагаем вперёд\n        }\n        current.next = newNode;  // Последний узел -> новый узел\n    }\n    size++;\n}' },
        { type: 'heading', value: 'removeFirst — удаление с начала' },
        { type: 'code', language: 'java', value: '// Удалить первый элемент — O(1)\nint removeFirst() {\n    if (head == null) {\n        throw new RuntimeException("Список пуст!");\n    }\n    int removed = head.data;  // Запоминаем значение\n    head = head.next;         // Head перепрыгивает на второй узел\n    size--;\n    return removed;\n}\n\n// Как работает:\n// head -> [10] -> [20] -> [30] -> null\n// removed = 10\n// head = head.next = [20]\n// head -> [20] -> [30] -> null\n// Узел [10] теперь недоступен и удалится garbage collector\'ом' },
        { type: 'heading', value: 'removeLast — удаление с конца' },
        { type: 'code', language: 'java', value: '// Удалить последний элемент — O(n)\nint removeLast() {\n    if (head == null) {\n        throw new RuntimeException("Список пуст!");\n    }\n    if (head.next == null) {  // Только один элемент\n        int removed = head.data;\n        head = null;\n        size--;\n        return removed;\n    }\n    // Ищем предпоследний узел\n    Node current = head;\n    while (current.next.next != null) {\n        current = current.next;\n    }\n    // current — предпоследний узел\n    int removed = current.next.data;  // Запоминаем последний\n    current.next = null;              // Отсекаем последний\n    size--;\n    return removed;\n}' },
        { type: 'note', value: 'removeLast — O(n) потому что нужно дойти до предпоследнего узла. В двусвязном списке (следующий модуль) это будет O(1) за счёт обратных ссылок!' }
      ]
    },
    {
      id: 5,
      title: 'Получение элемента по индексу',
      type: 'theory',
      content: [
        { type: 'text', value: 'В массиве arr[5] — мгновенно. В связном списке — нужно пройти 5 шагов от начала. Это как искать 5-ю страницу в книге, перелистывая по одной с начала.' },
        { type: 'heading', value: 'Метод get(int index)' },
        { type: 'code', language: 'java', value: '// Получить элемент по индексу — O(n)\nint get(int index) {\n    if (index < 0 || index >= size) {\n        throw new IndexOutOfBoundsException(\n            "Индекс " + index + " выходит за пределы (размер: " + size + ")");\n    }\n\n    Node current = head;\n    for (int i = 0; i < index; i++) {\n        current = current.next;  // Шагаем вперёд\n    }\n    return current.data;\n}\n\n// Пример:\n// Список: head -> [10] -> [20] -> [30] -> [40] -> null\n// get(2):\n//   i=0: current = head.next = [20]\n//   i=1: current = current.next = [30]\n//   Возвращаем current.data = 30' },
        { type: 'heading', value: 'Метод contains(int data)' },
        { type: 'code', language: 'java', value: '// Проверить, содержится ли элемент — O(n)\nboolean contains(int data) {\n    Node current = head;\n    while (current != null) {\n        if (current.data == data) {\n            return true;  // Нашли!\n        }\n        current = current.next;\n    }\n    return false;  // Не нашли\n}\n\n// indexOf — найти позицию элемента — O(n)\nint indexOf(int data) {\n    Node current = head;\n    int index = 0;\n    while (current != null) {\n        if (current.data == data) return index;\n        current = current.next;\n        index++;\n    }\n    return -1;  // Не найдено\n}' },
        { type: 'warning', value: 'Операция get(i) в связном списке — O(n), а не O(1) как в массиве. Если ты часто обращаешься по индексу — используй массив или ArrayList. Связный список хорош для частых вставок/удалений.' }
      ]
    },
    {
      id: 6,
      title: 'Вывод списка и размер',
      type: 'theory',
      content: [
        { type: 'text', value: 'Осталось добавить вывод на экран и методы для работы с размером. Вывод — это просто обход всего списка.' },
        { type: 'heading', value: 'printList — вывод всех элементов' },
        { type: 'code', language: 'java', value: '// Вывести все элементы — O(n)\nvoid printList() {\n    Node current = head;\n    System.out.print("[");\n    while (current != null) {\n        System.out.print(current.data);\n        if (current.next != null) System.out.print(" -> ");\n        current = current.next;\n    }\n    System.out.println("]");\n}\n\n// size — O(1), isEmpty — O(1)\nint size() {\n    return size;\n}\n\nboolean isEmpty() {\n    return head == null;  // или size == 0\n}' },
        { type: 'heading', value: 'Полный тест' },
        { type: 'code', language: 'java', value: 'LinkedList list = new LinkedList();\nlist.addLast(10);   // [10]\nlist.addLast(20);   // [10 -> 20]\nlist.addLast(30);   // [10 -> 20 -> 30]\nlist.addFirst(5);   // [5 -> 10 -> 20 -> 30]\n\nlist.printList();   // [5 -> 10 -> 20 -> 30]\nSystem.out.println("Размер: " + list.size());  // 4\nSystem.out.println("Элемент 2: " + list.get(2));  // 20\nSystem.out.println("Есть 10? " + list.contains(10));  // true\nSystem.out.println("Есть 99? " + list.contains(99));  // false\n\nlist.removeFirst();  // Удаляем 5\nlist.removeLast();   // Удаляем 30\nlist.printList();   // [10 -> 20]\nSystem.out.println("Размер: " + list.size());  // 2' },
        { type: 'tip', value: 'toString() лучше printList()! В реальных проектах переопределяй toString() вместо отдельного метода вывода. Тогда можно писать System.out.println(list) и Java вызовет toString() автоматически.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Реализуй LinkedList',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй класс Node и класс LinkedList с нуля. Класс должен поддерживать: addFirst, addLast, removeFirst, get, printList, size. Протестируй все операции.',
      requirements: [
        'Создай класс Node с полями int data и Node next',
        'Создай класс LinkedList с полем Node head и int size',
        'Реализуй void addFirst(int data)',
        'Реализуй void addLast(int data)',
        'Реализуй int removeFirst()',
        'Реализуй int get(int index) с проверкой границ',
        'Реализуй void printList()',
        'В main: добавь 1, 2, 3 через addLast, потом 0 через addFirst, выведи, удали первый, выведи снова'
      ],
      expectedOutput: 'Список: [0 -> 1 -> 2 -> 3]\nРазмер: 4\nЭлемент [2]: 2\nУдалён: 0\nСписок: [1 -> 2 -> 3]\nРазмер: 3',
      hint: 'В addLast пройди до конца (while current.next != null), потом current.next = newNode. В get используй цикл for (int i = 0; i < index; i++) current = current.next.',
      solution: 'class Node {\n    int data;\n    Node next;\n    Node(int data) {\n        this.data = data;\n        this.next = null;\n    }\n}\n\nclass LinkedList {\n    Node head;\n    int size;\n\n    LinkedList() {\n        head = null;\n        size = 0;\n    }\n\n    void addFirst(int data) {\n        Node newNode = new Node(data);\n        newNode.next = head;\n        head = newNode;\n        size++;\n    }\n\n    void addLast(int data) {\n        Node newNode = new Node(data);\n        if (head == null) {\n            head = newNode;\n        } else {\n            Node current = head;\n            while (current.next != null) current = current.next;\n            current.next = newNode;\n        }\n        size++;\n    }\n\n    int removeFirst() {\n        if (head == null) throw new RuntimeException("Список пуст!");\n        int removed = head.data;\n        head = head.next;\n        size--;\n        return removed;\n    }\n\n    int get(int index) {\n        if (index < 0 || index >= size)\n            throw new IndexOutOfBoundsException("Неверный индекс: " + index);\n        Node current = head;\n        for (int i = 0; i < index; i++) current = current.next;\n        return current.data;\n    }\n\n    void printList() {\n        Node current = head;\n        System.out.print("[");\n        while (current != null) {\n            System.out.print(current.data);\n            if (current.next != null) System.out.print(" -> ");\n            current = current.next;\n        }\n        System.out.println("]");\n    }\n\n    int size() { return size; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        LinkedList list = new LinkedList();\n        list.addLast(1);\n        list.addLast(2);\n        list.addLast(3);\n        list.addFirst(0);\n\n        System.out.print("Список: ");\n        list.printList();\n        System.out.println("Размер: " + list.size());\n        System.out.println("Элемент [2]: " + list.get(2));\n\n        int removed = list.removeFirst();\n        System.out.println("Удалён: " + removed);\n\n        System.out.print("Список: ");\n        list.printList();\n        System.out.println("Размер: " + list.size());\n    }\n}',
      explanation: 'LinkedList управляет цепочкой узлов через поле head. addFirst — O(1): просто prepend нового узла. addLast — O(n): нужно дойти до конца. removeFirst — O(1): перемещаем head. get — O(n): идём шаг за шагом. Поле size позволяет узнать размер за O(1) без обхода всего списка.'
    },
    {
      id: 8,
      title: 'Практика: Разворот связного списка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши метод reverse() для класса LinkedList, который переворачивает список на месте. Например: [1 -> 2 -> 3 -> 4] превращается в [4 -> 3 -> 2 -> 1].',
      requirements: [
        'Добавь метод void reverse() в класс LinkedList',
        'Используй три указателя: prev, current, next',
        'Начальное состояние: list.addLast(1), addLast(2), addLast(3), addLast(4)',
        'Выведи список до и после разворота'
      ],
      expectedOutput: 'До: [1 -> 2 -> 3 -> 4]\nПосле: [4 -> 3 -> 2 -> 1]',
      hint: 'Три указателя: prev=null, current=head. На каждом шаге: сохрани current.next в nextNode, переверни ссылку current.next=prev, сдвинь prev=current, current=nextNode. В конце head=prev.',
      solution: 'class Node {\n    int data;\n    Node next;\n    Node(int data) { this.data = data; }\n}\n\nclass LinkedList {\n    Node head;\n    int size;\n\n    void addLast(int data) {\n        Node newNode = new Node(data);\n        if (head == null) { head = newNode; }\n        else {\n            Node cur = head;\n            while (cur.next != null) cur = cur.next;\n            cur.next = newNode;\n        }\n        size++;\n    }\n\n    void reverse() {\n        Node prev = null;\n        Node current = head;\n        while (current != null) {\n            Node nextNode = current.next;  // Сохраняем следующий\n            current.next = prev;           // Переворачиваем ссылку\n            prev = current;                // Сдвигаем prev вперёд\n            current = nextNode;            // Сдвигаем current вперёд\n        }\n        head = prev;  // Новая голова — бывший хвост\n    }\n\n    void printList() {\n        Node cur = head;\n        System.out.print("[");\n        while (cur != null) {\n            System.out.print(cur.data);\n            if (cur.next != null) System.out.print(" -> ");\n            cur = cur.next;\n        }\n        System.out.println("]");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        LinkedList list = new LinkedList();\n        list.addLast(1); list.addLast(2);\n        list.addLast(3); list.addLast(4);\n\n        System.out.print("До: ");\n        list.printList();\n        list.reverse();\n        System.out.print("После: ");\n        list.printList();\n    }\n}',
      explanation: 'Разворот за O(n) времени и O(1) памяти — классическая задача. Три указателя: prev (уже перевёрнутая часть), current (текущий узел), nextNode (следующий — сохраняем, чтобы не потерять). Каждый шаг: разворачиваем стрелку current.next = prev, потом оба указателя сдвигаем на шаг вправо. В конце head указывает на бывший последний узел.'
    }
  ]
}
