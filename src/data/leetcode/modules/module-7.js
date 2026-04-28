export default {
  id: 7,
  title: 'Linked List',
  description: 'Задачи на связные списки: reverse, merge, cycle detection, Floyd\'s algorithm.',
  lessons: [
    {
      id: 1,
      title: 'Linked List: основные паттерны',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Связный список на собеседованиях'
        },
        {
          type: 'text',
          value: 'Связные списки — одна из самых частых тем на собеседованиях. Основные операции: обход, разворот, поиск середины, слияние. Ключевой навык — работа с указателями без потери ссылок.'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// Определение узла\nclass ListNode {\n  constructor(val = 0, next = null) {\n    this.val = val;\n    this.next = next;\n  }\n}\n\n// Создание списка из массива (для тестирования)\nfunction createList(arr) {\n  const dummy = new ListNode(0);\n  let curr = dummy;\n  for (const val of arr) {\n    curr.next = new ListNode(val);\n    curr = curr.next;\n  }\n  return dummy.next;\n}\n\n// Вывод списка\nfunction printList(head) {\n  const vals = [];\n  while (head) {\n    vals.push(head.val);\n    head = head.next;\n  }\n  return vals.join(" -> ");\n}'
        },
        {
          type: 'heading',
          value: 'Три ключевых паттерна'
        },
        {
          type: 'list',
          value: [
            'Dummy Node — фиктивная голова для упрощения вставки/удаления',
            'Fast/Slow pointers — быстрый и медленный указатели для поиска середины, обнаружения цикла',
            'Reverse — разворот списка или его части'
          ]
        },
        {
          type: 'tip',
          value: 'Совет: рисуйте диаграммы при решении задач на linked list. Это поможет не запутаться в указателях.'
        }
      ]
    },
    {
      id: 2,
      title: 'Reverse Linked List и его применения',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Три способа развернуть список'
        },
        {
          type: 'code',
          language: 'javascript',
          value: '// 1. Итеративный разворот — O(n) время, O(1) память\nfunction reverseList(head) {\n  let prev = null;\n  let curr = head;\n\n  while (curr) {\n    const next = curr.next; // сохраняем следующий\n    curr.next = prev;       // разворачиваем связь\n    prev = curr;            // двигаем prev\n    curr = next;            // двигаем curr\n  }\n\n  return prev; // новая голова\n}\n\n// 2. Рекурсивный разворот\nfunction reverseListRecursive(head) {\n  if (!head || !head.next) return head;\n\n  const newHead = reverseListRecursive(head.next);\n  head.next.next = head;\n  head.next = null;\n\n  return newHead;\n}\n\n// 3. Разворот части списка [left, right]\nfunction reverseBetween(head, left, right) {\n  const dummy = new ListNode(0, head);\n  let prev = dummy;\n\n  for (let i = 1; i < left; i++) prev = prev.next;\n\n  let curr = prev.next;\n  for (let i = 0; i < right - left; i++) {\n    const next = curr.next;\n    curr.next = next.next;\n    next.next = prev.next;\n    prev.next = next;\n  }\n\n  return dummy.next;\n}'
        },
        {
          type: 'note',
          value: 'Итеративный разворот — самая частая операция. Запомните три переменные: prev, curr, next. На каждом шаге: сохраняем next, разворачиваем стрелку curr→prev, двигаем оба указателя.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Reverse Linked List',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #206: разверните односвязный список.',
      requirements: [
        'Реализуйте функцию reverseList(head)',
        'Верните голову развёрнутого списка',
        'Итеративное решение: O(n) время, O(1) память',
        'Бонус: рекурсивное решение'
      ],
      hint: 'Три указателя: prev (инициально null), curr (инициально head), next (сохраняем на каждом шаге).',
      expectedOutput: 'reverseList([1,2,3,4,5]) -> [5,4,3,2,1]\nreverseList([1,2]) -> [2,1]\nreverseList([]) -> []',
      solution: 'function reverseList(head) {\n  let prev = null;\n  let curr = head;\n\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n\n  return prev;\n}\n\n// Рекурсивное решение\nfunction reverseListRecursive(head) {\n  if (!head || !head.next) return head;\n\n  const newHead = reverseListRecursive(head.next);\n  head.next.next = head; // задний узел указывает на нас\n  head.next = null;      // мы указываем в никуда\n\n  return newHead;\n}\n\n// Тест\nconst list = createList([1,2,3,4,5]);\nconsole.log(printList(reverseList(list)));\n// 5 -> 4 -> 3 -> 2 -> 1',
      explanation: 'Итеративный разворот: на каждом шаге мы "переворачиваем стрелку" curr.next = prev. Важно сохранить curr.next до переворота, иначе потеряем остаток списка. После цикла prev указывает на новую голову. Рекурсивное решение: сначала разворачиваем хвост, потом привязываем текущий узел в конец.'
    },
    {
      id: 4,
      title: 'Практика: Linked List Cycle',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #141: определите, есть ли цикл в связном списке.',
      requirements: [
        'Реализуйте функцию hasCycle(head)',
        'Верните true, если в списке есть цикл',
        'Используйте алгоритм Флойда (fast/slow pointers)',
        'O(n) время, O(1) память'
      ],
      hint: 'Быстрый указатель двигается на 2 шага, медленный на 1. Если есть цикл — они обязательно встретятся.',
      expectedOutput: 'hasCycle([3,2,0,-4], pos=1) -> true\nhasCycle([1,2], pos=0) -> true\nhasCycle([1], pos=-1) -> false',
      solution: 'function hasCycle(head) {\n  let slow = head;\n  let fast = head;\n\n  while (fast && fast.next) {\n    slow = slow.next;      // 1 шаг\n    fast = fast.next.next; // 2 шага\n\n    if (slow === fast) return true; // встретились!\n  }\n\n  return false; // fast дошёл до конца — цикла нет\n}\n\n// Почему работает?\n// Если есть цикл, fast "догоняет" slow внутри цикла.\n// На каждом шаге расстояние между ними уменьшается на 1.\n// Значит, они обязательно встретятся.\n\n// LeetCode #142: Найти НАЧАЛО цикла\nfunction detectCycle(head) {\n  let slow = head, fast = head;\n\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n\n    if (slow === fast) {\n      // Второй этап: два указателя с начала и точки встречи\n      let ptr = head;\n      while (ptr !== slow) {\n        ptr = ptr.next;\n        slow = slow.next;\n      }\n      return ptr; // начало цикла\n    }\n  }\n\n  return null;\n}',
      explanation: 'Алгоритм Флойда (черепаха и заяц): если есть цикл, быстрый указатель (2 шага) догонит медленный (1 шаг). Для нахождения начала цикла: после встречи ставим один указатель на head, оба двигаются по 1 шагу — они встретятся в начале цикла. Математическое доказательство основано на модульной арифметике.'
    },
    {
      id: 5,
      title: 'Практика: Merge Two Sorted Lists',
      type: 'practice',
      difficulty: 'easy',
      description: 'LeetCode #21: объедините два отсортированных связных списка в один.',
      requirements: [
        'Реализуйте функцию mergeTwoLists(list1, list2)',
        'Верните голову объединённого отсортированного списка',
        'Используйте dummy node',
        'O(n + m) время, O(1) доп. память'
      ],
      hint: 'Создайте dummy node. Сравнивайте текущие элементы обоих списков, присоединяйте меньший.',
      expectedOutput: 'mergeTwoLists([1,2,4], [1,3,4]) -> [1,1,2,3,4,4]\nmergeTwoLists([], []) -> []\nmergeTwoLists([], [0]) -> [0]',
      solution: 'function mergeTwoLists(list1, list2) {\n  const dummy = new ListNode(0);\n  let curr = dummy;\n\n  while (list1 && list2) {\n    if (list1.val <= list2.val) {\n      curr.next = list1;\n      list1 = list1.next;\n    } else {\n      curr.next = list2;\n      list2 = list2.next;\n    }\n    curr = curr.next;\n  }\n\n  // Присоединяем оставшийся список\n  curr.next = list1 || list2;\n\n  return dummy.next;\n}\n\nconst l1 = createList([1,2,4]);\nconst l2 = createList([1,3,4]);\nconsole.log(printList(mergeTwoLists(l1, l2)));\n// 1 -> 1 -> 2 -> 3 -> 4 -> 4',
      explanation: 'Dummy node упрощает код: не нужно отдельно обрабатывать создание головы результата. На каждом шаге присоединяем узел с меньшим значением. В конце присоединяем оставшийся хвост. Этот же принцип используется в merge sort.'
    },
    {
      id: 6,
      title: 'Практика: Reorder List',
      type: 'practice',
      difficulty: 'medium',
      description: 'LeetCode #143: переупорядочьте список L0→L1→...→Ln в L0→Ln→L1→Ln-1→L2→Ln-2→...',
      requirements: [
        'Реализуйте функцию reorderList(head)',
        'Модификация in-place, ничего не возвращайте',
        'Нельзя изменять значения узлов — только переставлять узлы',
        'Комбинация трёх паттернов: найти середину + развернуть + слить'
      ],
      hint: 'Шаг 1: найдите середину (fast/slow). Шаг 2: разверните вторую половину. Шаг 3: объедините первую и развёрнутую вторую.',
      expectedOutput: 'reorderList([1,2,3,4]) -> [1,4,2,3]\nreorderList([1,2,3,4,5]) -> [1,5,2,4,3]',
      solution: 'function reorderList(head) {\n  if (!head || !head.next) return;\n\n  // Шаг 1: Найти середину (slow окажется в середине)\n  let slow = head, fast = head;\n  while (fast.next && fast.next.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n\n  // Шаг 2: Развернуть вторую половину\n  let prev = null;\n  let curr = slow.next;\n  slow.next = null; // разрезаем список\n\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n\n  // Шаг 3: Объединить (чередованием)\n  let first = head;\n  let second = prev;\n\n  while (second) {\n    const tmp1 = first.next;\n    const tmp2 = second.next;\n    first.next = second;\n    second.next = tmp1;\n    first = tmp1;\n    second = tmp2;\n  }\n}\n\nconst list = createList([1,2,3,4,5]);\nreorderList(list);\nconsole.log(printList(list)); // 1 -> 5 -> 2 -> 4 -> 3',
      explanation: 'Эта задача комбинирует три классических паттерна: 1) поиск середины через fast/slow, 2) разворот второй половины, 3) merge двух списков. Сложность: O(n) время, O(1) память. На собеседовании разбейте решение на шаги и реализуйте каждый отдельно.'
    },
    {
      id: 7,
      title: 'Практика: LRU Cache (Linked List часть)',
      type: 'practice',
      difficulty: 'hard',
      description: 'LeetCode #146: реализуйте LRU Cache с операциями get и put за O(1).',
      requirements: [
        'Реализуйте класс LRUCache(capacity)',
        'get(key): вернуть значение или -1, пометить как недавно использованный',
        'put(key, value): вставить или обновить. При превышении capacity — удалить наименее используемый',
        'Обе операции O(1)'
      ],
      hint: 'Doubly Linked List + HashMap. Map хранит key → node. Список хранит порядок использования. Последний использованный — в начале, наименее — в конце.',
      expectedOutput: 'LRUCache(2): put(1,1), put(2,2), get(1)->1, put(3,3), get(2)->-1, put(4,4), get(1)->-1, get(3)->3, get(4)->4',
      solution: 'class DLNode {\n  constructor(key = 0, val = 0) {\n    this.key = key;\n    this.val = val;\n    this.prev = null;\n    this.next = null;\n  }\n}\n\nclass LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map();\n    // Dummy head и tail\n    this.head = new DLNode();\n    this.tail = new DLNode();\n    this.head.next = this.tail;\n    this.tail.prev = this.head;\n  }\n\n  _remove(node) {\n    node.prev.next = node.next;\n    node.next.prev = node.prev;\n  }\n\n  _addToFront(node) {\n    node.next = this.head.next;\n    node.prev = this.head;\n    this.head.next.prev = node;\n    this.head.next = node;\n  }\n\n  get(key) {\n    if (!this.map.has(key)) return -1;\n    const node = this.map.get(key);\n    this._remove(node);\n    this._addToFront(node);\n    return node.val;\n  }\n\n  put(key, value) {\n    if (this.map.has(key)) {\n      const node = this.map.get(key);\n      node.val = value;\n      this._remove(node);\n      this._addToFront(node);\n    } else {\n      const node = new DLNode(key, value);\n      this.map.set(key, node);\n      this._addToFront(node);\n\n      if (this.map.size > this.capacity) {\n        const lru = this.tail.prev;\n        this._remove(lru);\n        this.map.delete(lru.key);\n      }\n    }\n  }\n}\n\nconst cache = new LRUCache(2);\ncache.put(1, 1);\ncache.put(2, 2);\nconsole.log(cache.get(1)); // 1\ncache.put(3, 3);           // вытесняет ключ 2\nconsole.log(cache.get(2)); // -1\ncache.put(4, 4);           // вытесняет ключ 1\nconsole.log(cache.get(1)); // -1\nconsole.log(cache.get(3)); // 3\nconsole.log(cache.get(4)); // 4',
      explanation: 'LRU Cache — одна из самых популярных Design-задач. Doubly Linked List обеспечивает O(1) для перемещения узла (remove + addToFront). HashMap обеспечивает O(1) поиск узла по ключу. Head = самый недавний, Tail = самый старый. При вытеснении удаляем узел перед tail.'
    }
  ]
}
