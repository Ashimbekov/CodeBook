export default {
  id: 25,
  title: 'LinkedList',
  description: 'Изучаем LinkedList — связный список, который отлично подходит для частых вставок и удалений',
  lessons: [
    {
      id: 1, title: 'Что такое LinkedList?', type: 'theory',
      content: [
        { type: 'text', value: 'LinkedList — это список, где каждый элемент знает, кто стоит перед ним и после него. В отличие от ArrayList, элементы не хранятся подряд в памяти — каждый держит ссылку на следующего.' },
        { type: 'tip', value: 'Представь детей в хороводе: каждый держит за руку предыдущего и следующего. Чтобы вставить нового ребёнка, нужно разъединить две руки и дать ему встать между ними. Легко! А в ArrayList это как коробка с плотно сложенными карточками — чтобы вставить карточку в середину, все остальные надо сдвинуть.' },
        { type: 'heading', value: 'Создание LinkedList' },
        { type: 'code', language: 'java', value: 'import java.util.LinkedList;\n\npublic class Main {\n    public static void main(String[] args) {\n        LinkedList<String> list = new LinkedList<>();\n\n        list.add("Первый");\n        list.add("Второй");\n        list.add("Третий");\n\n        System.out.println(list); // [Первый, Второй, Третий]\n        System.out.println("Размер: " + list.size()); // 3\n\n        // Обычные методы работают так же как у ArrayList\n        System.out.println(list.get(1)); // Второй\n        list.remove(0);\n        System.out.println(list); // [Второй, Третий]\n    }\n}' },
        { type: 'heading', value: 'Как LinkedList устроен внутри' },
        { type: 'text', value: 'Каждый узел (node) LinkedList содержит: значение, ссылку на предыдущий узел, ссылку на следующий узел. Это называется двусвязный список.' },
        { type: 'code', language: 'java', value: '// Упрощённо, LinkedList устроен примерно так:\n// null <- [Первый] <-> [Второй] <-> [Третий] -> null\n//\n// Каждый элемент знает:\n// - своё значение\n// - ссылку на предыдущий элемент\n// - ссылку на следующий элемент\n\nLinkedList<String> list = new LinkedList<>();\nlist.add("A");\nlist.add("B");\nlist.add("C");\n\n// Когда мы вставляем элемент в середину:\nlist.add(1, "X"); // [A, X, B, C]\n// Меняются только ссылки у соседей — быстро!\n// В ArrayList сдвинулись бы все элементы правее' },
        { type: 'note', value: 'LinkedList реализует как интерфейс List (как ArrayList), так и интерфейс Deque (двусторонняя очередь). Это делает его очень гибким.' }
      ]
    },
    {
      id: 2, title: 'Когда использовать LinkedList, а когда ArrayList?', type: 'theory',
      content: [
        { type: 'text', value: 'Это важный вопрос, который часто задают на собеседованиях. Оба хранят список, но работают по-разному.' },
        { type: 'heading', value: 'Сравнение по скорости операций' },
        { type: 'list', items: [
          'Получение по индексу (get): ArrayList O(1) — мгновенно. LinkedList O(n) — нужно пройти от начала.',
          'Добавление в конец (add): Оба O(1) — быстро.',
          'Вставка в середину: ArrayList O(n) — сдвиг. LinkedList O(1) — только поменять ссылки.',
          'Удаление из середины: ArrayList O(n) — сдвиг. LinkedList O(1) — только ссылки.',
          'Поиск элемента: Оба O(n) — нужно перебирать.'
        ]},
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\nimport java.util.LinkedList;\n\npublic class Main {\n    public static void main(String[] args) {\n        // ArrayList лучше когда:\n        // - часто читаешь элементы по индексу\n        // - добавляешь/удаляешь в конец\n        ArrayList<String> log = new ArrayList<>();\n        log.add("Запись 1");\n        System.out.println(log.get(0)); // быстро!\n\n        // LinkedList лучше когда:\n        // - часто вставляешь/удаляешь в начало или середину\n        // - используешь как очередь или стек\n        LinkedList<String> queue = new LinkedList<>();\n        queue.addFirst("Первый в очереди");\n        queue.addFirst("Теперь я первый!");\n        System.out.println(queue.removeFirst()); // Теперь я первый!\n    }\n}' },
        { type: 'tip', value: 'Правило большого пальца: если сомневаешься — используй ArrayList. LinkedList выбирай только когда знаешь, что будешь часто вставлять/удалять элементы в начале или середине списка.' }
      ]
    },
    {
      id: 3, title: 'Специальные методы LinkedList', type: 'theory',
      content: [
        { type: 'text', value: 'LinkedList имеет дополнительные методы для работы с началом и концом списка. Эти методы делают его удобным как стек или очередь.' },
        { type: 'heading', value: 'Методы для начала списка' },
        { type: 'code', language: 'java', value: 'import java.util.LinkedList;\n\npublic class Main {\n    public static void main(String[] args) {\n        LinkedList<String> list = new LinkedList<>();\n        list.add("Второй");\n        list.add("Третий");\n\n        // Добавить в начало\n        list.addFirst("Первый");\n        System.out.println(list); // [Первый, Второй, Третий]\n\n        // Посмотреть первый (не удалять)\n        System.out.println(list.getFirst());  // Первый\n        System.out.println(list.peekFirst()); // Первый (не бросает исключение если пусто)\n\n        // Удалить первый\n        String removed = list.removeFirst();\n        System.out.println("Удалён: " + removed); // Первый\n        System.out.println(list); // [Второй, Третий]\n    }\n}' },
        { type: 'heading', value: 'Методы для конца списка' },
        { type: 'code', language: 'java', value: 'LinkedList<String> list = new LinkedList<>();\nlist.add("Первый");\nlist.add("Второй");\n\n// Добавить в конец\nlist.addLast("Третий");\nSystem.out.println(list); // [Первый, Второй, Третий]\n\n// Посмотреть последний (не удалять)\nSystem.out.println(list.getLast());  // Третий\n\n// Удалить последний\nString last = list.removeLast();\nSystem.out.println("Удалён: " + last); // Третий\nSystem.out.println(list); // [Первый, Второй]' },
        { type: 'heading', value: 'LinkedList как стек (стопка тарелок)' },
        { type: 'code', language: 'java', value: '// Стек: последний добавленный — первый вышедший (LIFO)\nLinkedList<String> stack = new LinkedList<>();\n\nstack.push("Тарелка 1"); // добавить сверху\nstack.push("Тарелка 2");\nstack.push("Тарелка 3");\n\nSystem.out.println("Стопка: " + stack);\nSystem.out.println("Снимаем: " + stack.pop()); // Тарелка 3\nSystem.out.println("Снимаем: " + stack.pop()); // Тарелка 2\nSystem.out.println("Осталось: " + stack);      // [Тарелка 1]' },
        { type: 'heading', value: 'LinkedList как очередь (FIFO)' },
        { type: 'code', language: 'java', value: '// Очередь: первый добавленный — первый вышедший (FIFO)\nLinkedList<String> queue = new LinkedList<>();\n\nqueue.offer("Клиент 1"); // встать в очередь\nqueue.offer("Клиент 2");\nqueue.offer("Клиент 3");\n\nSystem.out.println("Очередь: " + queue);\nSystem.out.println("Обслуживаем: " + queue.poll()); // Клиент 1\nSystem.out.println("Обслуживаем: " + queue.poll()); // Клиент 2\nSystem.out.println("Осталось: " + queue);           // [Клиент 3]' }
      ]
    },
    {
      id: 4, title: 'Интерфейс Deque', type: 'theory',
      content: [
        { type: 'text', value: 'Deque (произносится "дэк") — это двусторонняя очередь (Double-Ended Queue). Можно добавлять и удалять элементы с ОБОИХ концов. LinkedList реализует этот интерфейс.' },
        { type: 'tip', value: 'Deque — как труба, открытая с двух сторон. Можно засунуть и вытащить что-то как слева, так и справа.' },
        { type: 'heading', value: 'Основные методы Deque' },
        { type: 'code', language: 'java', value: 'import java.util.Deque;\nimport java.util.LinkedList;\n\npublic class Main {\n    public static void main(String[] args) {\n        Deque<String> deque = new LinkedList<>();\n\n        // Добавление с обоих концов\n        deque.addFirst("B");\n        deque.addFirst("A"); // [A, B]\n        deque.addLast("C");  // [A, B, C]\n        deque.addLast("D");  // [A, B, C, D]\n\n        System.out.println("Deque: " + deque);\n        System.out.println("Первый: " + deque.peekFirst()); // A\n        System.out.println("Последний: " + deque.peekLast()); // D\n\n        // Удаление с обоих концов\n        System.out.println("Убрали спереди: " + deque.pollFirst()); // A\n        System.out.println("Убрали сзади: " + deque.pollLast());    // D\n        System.out.println("Осталось: " + deque); // [B, C]\n    }\n}' },
        { type: 'heading', value: 'Практический пример: история браузера' },
        { type: 'code', language: 'java', value: 'import java.util.LinkedList;\n\npublic class BrowserHistory {\n    public static void main(String[] args) {\n        LinkedList<String> history = new LinkedList<>();\n\n        // Посещаем сайты\n        history.addLast("google.com");\n        history.addLast("youtube.com");\n        history.addLast("github.com");\n\n        System.out.println("История: " + history);\n        System.out.println("Текущая страница: " + history.getLast());\n\n        // Нажать кнопку "Назад"\n        history.removeLast();\n        System.out.println("После Назад: " + history.getLast());\n    }\n}' }
      ]
    },
    {
      id: 5, title: 'Практика: Очередь задач', type: 'practice', difficulty: 'easy',
      description: 'Реализуй систему управления задачами используя LinkedList как очередь. Задачи выполняются в порядке поступления.',
      requirements: [
        'Создай LinkedList<String> как очередь задач',
        'Добавь 4 задачи в очередь',
        'Выведи текущую очередь',
        'Выполни (удали) первые 2 задачи, выводя каждую',
        'Добавь ещё одну задачу в конец',
        'Добавь срочную задачу в начало очереди',
        'Выведи итоговую очередь'
      ],
      expectedOutput: 'Очередь задач: [Написать отчёт, Позвонить клиенту, Обновить сайт, Проверить почту]\nВыполняем: Написать отчёт\nВыполняем: Позвонить клиенту\nДобавили новую задачу в конец\nСрочная задача добавлена в начало!\nИтоговая очередь: [СРОЧНО: Встреча с директором, Обновить сайт, Проверить почту, Сдать проект]',
      hint: 'Используй offer() или addLast() для добавления в конец, offerFirst() или addFirst() для добавления в начало, poll() для извлечения первого.',
      solution: 'import java.util.LinkedList;\n\npublic class Main {\n    public static void main(String[] args) {\n        LinkedList<String> tasks = new LinkedList<>();\n\n        tasks.add("Написать отчёт");\n        tasks.add("Позвонить клиенту");\n        tasks.add("Обновить сайт");\n        tasks.add("Проверить почту");\n\n        System.out.println("Очередь задач: " + tasks);\n\n        System.out.println("Выполняем: " + tasks.pollFirst());\n        System.out.println("Выполняем: " + tasks.pollFirst());\n\n        tasks.addLast("Сдать проект");\n        System.out.println("Добавили новую задачу в конец");\n\n        tasks.addFirst("СРОЧНО: Встреча с директором");\n        System.out.println("Срочная задача добавлена в начало!");\n\n        System.out.println("Итоговая очередь: " + tasks);\n    }\n}',
      explanation: 'LinkedList идеально подходит для очередей: addLast() добавляет в конец, addFirst() — в начало (для приоритетных задач), pollFirst() извлекает и удаляет первый элемент. Это настоящая FIFO-очередь с поддержкой приоритетов!'
    },
    {
      id: 6, title: 'Практика: Стек для скобок', type: 'practice', difficulty: 'hard',
      description: 'Используй LinkedList как стек для проверки правильности расстановки скобок в выражении.',
      requirements: [
        'Создай метод isBalanced(String expression), который проверяет правильность скобок',
        'Используй LinkedList как стек',
        'Открывающая скобка ( добавляется в стек',
        'Закрывающая скобка ) должна совпадать с вершиной стека',
        'Проверь несколько выражений',
        'Выведи результат для каждого'
      ],
      expectedOutput: '(()) - сбалансировано: true\n()() - сбалансировано: true\n((()) - сбалансировано: false\n)( - сбалансировано: false\n(()()) - сбалансировано: true',
      hint: 'Когда видишь "(", делай push в стек. Когда видишь ")", делай pop. Если pop не удался (стек пуст) или в конце стек не пуст — скобки не сбалансированы.',
      solution: 'import java.util.LinkedList;\n\npublic class Main {\n    public static boolean isBalanced(String expr) {\n        LinkedList<Character> stack = new LinkedList<>();\n\n        for (char c : expr.toCharArray()) {\n            if (c == \'(\') {\n                stack.push(c); // открывающая — в стек\n            } else if (c == \')\') {\n                if (stack.isEmpty()) {\n                    return false; // нечего закрывать\n                }\n                stack.pop(); // закрываем открывающую\n            }\n        }\n\n        return stack.isEmpty(); // все скобки должны быть закрыты\n    }\n\n    public static void main(String[] args) {\n        String[] tests = {"(())", "()()", "((())", ")(", "(()())"};\n        for (String test : tests) {\n            System.out.println(test + " - сбалансировано: " + isBalanced(test));\n        }\n    }\n}',
      explanation: 'Стек — классическая структура данных для проверки скобок. Каждая открывающая скобка кладётся на стек, каждая закрывающая убирает с него. Если стек пуст — всё в порядке. LinkedList.push() добавляет в начало, pop() забирает с начала — это стек LIFO.'
    }
  ]
}
