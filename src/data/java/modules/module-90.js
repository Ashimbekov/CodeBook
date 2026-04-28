export default {
  id: 90,
  title: 'Практикум: LinkedList задачи',
  description: 'Практические задачи на связные списки: разворот, слияние, обнаружение цикла, пересечение, сортировка и другие классические алгоритмы.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Reverse Linked List',
      type: 'practice',
      difficulty: 'easy',
      description: 'Разверни односвязный список. Например: 1→2→3→4→5 становится 5→4→3→2→1.',
      requirements: [
        'Класс ListNode с полями val и next',
        'Метод reverseList(ListNode head) возвращает ListNode',
        'Итеративное решение с тремя указателями',
        'Протестировать: [1,2,3,4,5] → [5,4,3,2,1], [] → []'
      ],
      expectedOutput: '5 -> 4 -> 3 -> 2 -> 1 -> null\nnull',
      hint: 'Используй три указателя: prev (null вначале), curr (head), next (curr.next). На каждом шаге: next = curr.next, curr.next = prev, prev = curr, curr = next.',
      solution: `public class Main {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    static ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }
        return prev;
    }

    static ListNode of(int... vals) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        for (int v : vals) { curr.next = new ListNode(v); curr = curr.next; }
        return dummy.next;
    }

    static String toString(ListNode head) {
        StringBuilder sb = new StringBuilder();
        while (head != null) { sb.append(head.val).append(" -> "); head = head.next; }
        sb.append("null");
        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println(toString(reverseList(of(1,2,3,4,5))));
        System.out.println(toString(reverseList(null)));
    }
}`,
      explanation: 'Итеративный разворот за O(n) время и O(1) память. На каждом шаге переключаем указатель next текущего узла на предыдущий узел. Три указателя prev, curr, next позволяют не потерять остаток списка при переключении.'
    },
    {
      id: 2,
      title: 'Задача: Merge Two Sorted Lists',
      type: 'practice',
      difficulty: 'easy',
      description: 'Слей два отсортированных связных списка в один отсортированный список.',
      requirements: [
        'Метод mergeTwoLists(ListNode l1, ListNode l2) возвращает ListNode',
        'Использовать dummy node для упрощения логики',
        'Результат должен быть отсортирован по возрастанию',
        'Протестировать: [1,2,4]+[1,3,4] → [1,1,2,3,4,4]'
      ],
      expectedOutput: '1 -> 1 -> 2 -> 3 -> 4 -> 4 -> null',
      hint: 'Dummy node — фиктивный узел в начале, чтобы не обрабатывать отдельно первый элемент. Сравнивай l1.val и l2.val, меньший присоединяй к результату.',
      solution: `public class Main {
    static class ListNode {
        int val; ListNode next;
        ListNode(int val) { this.val = val; }
    }

    static ListNode mergeTwoLists(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) {
                curr.next = l1; l1 = l1.next;
            } else {
                curr.next = l2; l2 = l2.next;
            }
            curr = curr.next;
        }
        curr.next = (l1 != null) ? l1 : l2;
        return dummy.next;
    }

    static ListNode of(int... vals) {
        ListNode dummy = new ListNode(0); ListNode c = dummy;
        for (int v : vals) { c.next = new ListNode(v); c = c.next; }
        return dummy.next;
    }

    static String toString(ListNode h) {
        StringBuilder sb = new StringBuilder();
        while (h != null) { sb.append(h.val).append(" -> "); h = h.next; }
        return sb.append("null").toString();
    }

    public static void main(String[] args) {
        System.out.println(toString(mergeTwoLists(of(1,2,4), of(1,3,4))));
    }
}`,
      explanation: 'Dummy node избавляет от специальной обработки первого элемента. Алгоритм сравнивает головы обоих списков и присоединяет меньший узел. Когда один список исчерпан, присоединяем остаток другого. O(n+m) время, O(1) память.'
    },
    {
      id: 3,
      title: 'Задача: Remove Nth Node From End',
      type: 'practice',
      difficulty: 'medium',
      description: 'Удали n-й узел с конца связного списка и верни его голову. Например: [1,2,3,4,5], n=2 → [1,2,3,5].',
      requirements: [
        'Метод removeNthFromEnd(ListNode head, int n)',
        'Решение за один проход (two pointers)',
        'Использовать dummy node для обработки удаления головы',
        'Протестировать: [1,2,3,4,5] n=2 → [1,2,3,5], [1] n=1 → []'
      ],
      expectedOutput: '1 -> 2 -> 3 -> 5 -> null\nnull',
      hint: 'Два указателя: fast сначала продвигается на n шагов, потом оба двигаются одновременно. Когда fast дойдёт до конца, slow будет на (n+1)-м с конца.',
      solution: `public class Main {
    static class ListNode {
        int val; ListNode next;
        ListNode(int val) { this.val = val; }
    }

    static ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode fast = dummy, slow = dummy;
        for (int i = 0; i <= n; i++) fast = fast.next;
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
        return dummy.next;
    }

    static ListNode of(int... vals) {
        ListNode dummy = new ListNode(0); ListNode c = dummy;
        for (int v : vals) { c.next = new ListNode(v); c = c.next; }
        return dummy.next;
    }

    static String toString(ListNode h) {
        StringBuilder sb = new StringBuilder();
        while (h != null) { sb.append(h.val).append(" -> "); h = h.next; }
        return sb.append("null").toString();
    }

    public static void main(String[] args) {
        System.out.println(toString(removeNthFromEnd(of(1,2,3,4,5), 2)));
        System.out.println(toString(removeNthFromEnd(of(1), 1)));
    }
}`,
      explanation: 'Two pointers с разницей в n шагов. Fast уходит вперёд на n+1 узлов (от dummy). Затем оба двигаются до конца. Когда fast == null, slow стоит перед удаляемым узлом. Dummy node нужен для случая удаления головы списка. O(n) за один проход.'
    },
    {
      id: 4,
      title: 'Задача: Detect Cycle (Floyd)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Определи, есть ли цикл в связном списке. Если есть — найди узел начала цикла.',
      requirements: [
        'Метод hasCycle(ListNode head) возвращает boolean',
        'Метод detectCycle(ListNode head) возвращает ListNode — начало цикла',
        'Использовать алгоритм Флойда (быстрый и медленный указатели)',
        'O(1) дополнительной памяти'
      ],
      expectedOutput: 'Has cycle: true\nCycle starts at node with val: 3\nNo cycle: false',
      hint: 'Slow двигается по 1, fast по 2. Если встретились — цикл есть. Для нахождения начала: после встречи сбрось один указатель на head и двигай оба по 1.',
      solution: `public class Main {
    static class ListNode {
        int val; ListNode next;
        ListNode(int val) { this.val = val; }
    }

    static boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }

    static ListNode detectCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                slow = head;
                while (slow != fast) {
                    slow = slow.next;
                    fast = fast.next;
                }
                return slow;
            }
        }
        return null;
    }

    public static void main(String[] args) {
        ListNode n1 = new ListNode(1), n2 = new ListNode(2),
                 n3 = new ListNode(3), n4 = new ListNode(4);
        n1.next = n2; n2.next = n3; n3.next = n4; n4.next = n3;
        System.out.println("Has cycle: " + hasCycle(n1));
        System.out.println("Cycle starts at node with val: " + detectCycle(n1).val);

        ListNode a = new ListNode(1); a.next = new ListNode(2);
        System.out.println("No cycle: " + hasCycle(a));
    }
}`,
      explanation: 'Алгоритм Флойда: slow +1, fast +2. Если цикл есть — обязательно встретятся. Для нахождения начала цикла: после встречи сбрасываем slow на head и двигаем оба по 1. Математически они встретятся на входе в цикл. O(n) время, O(1) память.'
    },
    {
      id: 5,
      title: 'Задача: Intersection of Two Lists',
      type: 'practice',
      difficulty: 'easy',
      description: 'Найди узел, в котором два связных списка пересекаются. Если не пересекаются — верни null.',
      requirements: [
        'Метод getIntersectionNode(ListNode headA, ListNode headB)',
        'O(1) дополнительной памяти',
        'Не модифицировать списки',
        'Два указателя: когда один доходит до конца — начинает с головы другого'
      ],
      expectedOutput: 'Intersection at: 8\nNo intersection: null',
      hint: 'Указатель A проходит: listA + listB. Указатель B проходит: listB + listA. Оба пройдут одинаковую длину и встретятся на пересечении (или оба станут null).',
      solution: `public class Main {
    static class ListNode {
        int val; ListNode next;
        ListNode(int val) { this.val = val; }
    }

    static ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode a = headA, b = headB;
        while (a != b) {
            a = (a != null) ? a.next : headB;
            b = (b != null) ? b.next : headA;
        }
        return a;
    }

    public static void main(String[] args) {
        ListNode common = new ListNode(8);
        common.next = new ListNode(10);

        ListNode a = new ListNode(4); a.next = new ListNode(1); a.next.next = common;
        ListNode b = new ListNode(5); b.next = new ListNode(6);
        b.next.next = new ListNode(1); b.next.next.next = common;

        ListNode res = getIntersectionNode(a, b);
        System.out.println("Intersection at: " + (res != null ? res.val : "null"));

        ListNode x = new ListNode(1); ListNode y = new ListNode(2);
        res = getIntersectionNode(x, y);
        System.out.println("No intersection: " + (res != null ? res.val : "null"));
    }
}`,
      explanation: 'Каждый указатель проходит оба списка: lenA + lenB == lenB + lenA. Это выравнивает их так, что они приходят к пересечению одновременно. Если пересечения нет — оба становятся null одновременно. Элегантное O(n+m) решение без дополнительной памяти.'
    },
    {
      id: 6,
      title: 'Задача: Add Two Numbers',
      type: 'practice',
      difficulty: 'medium',
      description: 'Два числа представлены связными списками в обратном порядке. Сложи их и верни результат как связный список. Пример: (2→4→3) + (5→6→4) = (7→0→8), т.е. 342 + 465 = 807.',
      requirements: [
        'Метод addTwoNumbers(ListNode l1, ListNode l2)',
        'Учитывать перенос (carry) между разрядами',
        'Числа могут быть разной длины',
        'Протестировать: [2,4,3]+[5,6,4]→[7,0,8], [9,9,9]+[1]→[0,0,0,1]'
      ],
      expectedOutput: '7 -> 0 -> 8 -> null\n0 -> 0 -> 0 -> 1 -> null',
      hint: 'Итерируй по обоим спискам одновременно, складывая значения + carry. Новый carry = sum / 10, цифра = sum % 10. Не забудь обработать финальный carry.',
      solution: `public class Main {
    static class ListNode {
        int val; ListNode next;
        ListNode(int val) { this.val = val; }
    }

    static ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;
            if (l1 != null) { sum += l1.val; l1 = l1.next; }
            if (l2 != null) { sum += l2.val; l2 = l2.next; }
            carry = sum / 10;
            curr.next = new ListNode(sum % 10);
            curr = curr.next;
        }
        return dummy.next;
    }

    static ListNode of(int... vals) {
        ListNode d = new ListNode(0); ListNode c = d;
        for (int v : vals) { c.next = new ListNode(v); c = c.next; }
        return d.next;
    }

    static String toString(ListNode h) {
        StringBuilder sb = new StringBuilder();
        while (h != null) { sb.append(h.val).append(" -> "); h = h.next; }
        return sb.append("null").toString();
    }

    public static void main(String[] args) {
        System.out.println(toString(addTwoNumbers(of(2,4,3), of(5,6,4))));
        System.out.println(toString(addTwoNumbers(of(9,9,9), of(1))));
    }
}`,
      explanation: 'Сложение в столбик: проходим оба списка параллельно, складываем цифры + carry. sum % 10 — текущая цифра, sum / 10 — перенос. Условие цикла включает carry != 0 для обработки финального переноса (99+1=100). Dummy node упрощает присоединение первого узла.'
    },
    {
      id: 7,
      title: 'Задача: Reorder List',
      type: 'practice',
      difficulty: 'medium',
      description: 'Переставь узлы списка: L0→L1→...→Ln-1→Ln превращается в L0→Ln→L1→Ln-1→L2→Ln-2→...',
      requirements: [
        'Метод reorderList(ListNode head) — in-place',
        'Шаг 1: Найти середину (slow/fast pointers)',
        'Шаг 2: Развернуть вторую половину',
        'Шаг 3: Слить две половины поочерёдно',
        'Протестировать: [1,2,3,4] → [1,4,2,3], [1,2,3,4,5] → [1,5,2,4,3]'
      ],
      expectedOutput: '1 -> 4 -> 2 -> 3 -> null\n1 -> 5 -> 2 -> 4 -> 3 -> null',
      hint: 'Три шага: 1) Найди середину slow/fast. 2) Разверни вторую половину. 3) Чередуй узлы из первой и второй половин.',
      solution: `public class Main {
    static class ListNode {
        int val; ListNode next;
        ListNode(int val) { this.val = val; }
    }

    static void reorderList(ListNode head) {
        if (head == null || head.next == null) return;
        // 1. Найти середину
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next; fast = fast.next.next;
        }
        // 2. Развернуть вторую половину
        ListNode prev = null, curr = slow.next;
        slow.next = null;
        while (curr != null) {
            ListNode next = curr.next;
            curr.next = prev; prev = curr; curr = next;
        }
        // 3. Слить
        ListNode first = head, second = prev;
        while (second != null) {
            ListNode tmp1 = first.next, tmp2 = second.next;
            first.next = second;
            second.next = tmp1;
            first = tmp1; second = tmp2;
        }
    }

    static ListNode of(int... vals) {
        ListNode d = new ListNode(0); ListNode c = d;
        for (int v : vals) { c.next = new ListNode(v); c = c.next; }
        return d.next;
    }

    static String toString(ListNode h) {
        StringBuilder sb = new StringBuilder();
        while (h != null) { sb.append(h.val).append(" -> "); h = h.next; }
        return sb.append("null").toString();
    }

    public static void main(String[] args) {
        ListNode l1 = of(1,2,3,4);
        reorderList(l1);
        System.out.println(toString(l1));

        ListNode l2 = of(1,2,3,4,5);
        reorderList(l2);
        System.out.println(toString(l2));
    }
}`,
      explanation: 'Комбинация трёх классических алгоритмов: 1) Нахождение середины (slow/fast). 2) Разворот списка. 3) Слияние двух списков. Всё in-place за O(n) время и O(1) память. Ключевой приём — разорвать список посередине (slow.next = null) перед разворотом.'
    },
    {
      id: 8,
      title: 'Задача: Copy List with Random Pointer',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай глубокую копию связного списка, у которого каждый узел имеет дополнительный указатель random на произвольный узел.',
      requirements: [
        'Класс Node с полями val, next, random',
        'Метод copyRandomList(Node head) возвращает Node',
        'Подход: HashMap (old → new) или interleaving nodes',
        'Все указатели (next, random) должны указывать на НОВЫЕ узлы'
      ],
      expectedOutput: 'Original: [7(->null), 13(->7), 11(->1), 10(->11), 1(->7)]\nCopy:     [7(->null), 13(->7), 11(->1), 10(->11), 1(->7)]',
      hint: 'HashMap подход: 1) Первый проход — создай копии всех узлов (old→new). 2) Второй проход — настрой next и random через map.get().',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {
    static class Node {
        int val; Node next; Node random;
        Node(int val) { this.val = val; }
    }

    static Node copyRandomList(Node head) {
        if (head == null) return null;
        Map<Node, Node> map = new HashMap<>();
        Node curr = head;
        while (curr != null) {
            map.put(curr, new Node(curr.val));
            curr = curr.next;
        }
        curr = head;
        while (curr != null) {
            map.get(curr).next = map.get(curr.next);
            map.get(curr).random = map.get(curr.random);
            curr = curr.next;
        }
        return map.get(head);
    }

    public static void main(String[] args) {
        Node n1 = new Node(7), n2 = new Node(13), n3 = new Node(11),
             n4 = new Node(10), n5 = new Node(1);
        n1.next=n2; n2.next=n3; n3.next=n4; n4.next=n5;
        n1.random=null; n2.random=n1; n3.random=n5; n4.random=n3; n5.random=n1;

        Node copy = copyRandomList(n1);
        System.out.print("Original: ");
        printList(n1);
        System.out.print("Copy:     ");
        printList(copy);
    }

    static void printList(Node h) {
        StringBuilder sb = new StringBuilder("[");
        while (h != null) {
            sb.append(h.val).append("(->").append(h.random != null ? h.random.val : "null").append(")");
            if (h.next != null) sb.append(", ");
            h = h.next;
        }
        System.out.println(sb.append("]"));
    }
}`,
      explanation: 'HashMap подход: два прохода. Первый — создаём новые узлы и маппинг old→new. Второй — настраиваем связи next и random через маппинг. O(n) время и O(n) память. Альтернатива — interleaving (вставка копий между оригиналами) даёт O(1) память, но сложнее в реализации.'
    },
    {
      id: 9,
      title: 'Задача: Sort List (Merge Sort)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Отсортируй связный список за O(n log n) время. Используй Merge Sort для списков.',
      requirements: [
        'Метод sortList(ListNode head) возвращает ListNode',
        'Merge Sort: разделить пополам, рекурсивно отсортировать, слить',
        'O(n log n) время, O(log n) стек рекурсии',
        'Протестировать: [4,2,1,3] → [1,2,3,4], [-1,5,3,4,0] → [-1,0,3,4,5]'
      ],
      expectedOutput: '1 -> 2 -> 3 -> 4 -> null\n-1 -> 0 -> 3 -> 4 -> 5 -> null',
      hint: 'Найди середину через slow/fast. Разорви список на две части. Рекурсивно отсортируй каждую. Слей через merge двух отсортированных списков.',
      solution: `public class Main {
    static class ListNode {
        int val; ListNode next;
        ListNode(int val) { this.val = val; }
    }

    static ListNode sortList(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode slow = head, fast = head.next;
        while (fast != null && fast.next != null) {
            slow = slow.next; fast = fast.next.next;
        }
        ListNode mid = slow.next;
        slow.next = null;
        ListNode left = sortList(head);
        ListNode right = sortList(mid);
        return merge(left, right);
    }

    static ListNode merge(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0), curr = dummy;
        while (l1 != null && l2 != null) {
            if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
            else { curr.next = l2; l2 = l2.next; }
            curr = curr.next;
        }
        curr.next = (l1 != null) ? l1 : l2;
        return dummy.next;
    }

    static ListNode of(int... vals) {
        ListNode d = new ListNode(0); ListNode c = d;
        for (int v : vals) { c.next = new ListNode(v); c = c.next; }
        return d.next;
    }

    static String toString(ListNode h) {
        StringBuilder sb = new StringBuilder();
        while (h != null) { sb.append(h.val).append(" -> "); h = h.next; }
        return sb.append("null").toString();
    }

    public static void main(String[] args) {
        System.out.println(toString(sortList(of(4,2,1,3))));
        System.out.println(toString(sortList(of(-1,5,3,4,0))));
    }
}`,
      explanation: 'Merge Sort идеален для связных списков: 1) Нахождение середины за O(n) — slow/fast pointers. 2) Рекурсивная сортировка двух половин. 3) Слияние — O(n) без дополнительной памяти (в отличие от массивов). Итого O(n log n) по времени. Для списков Merge Sort предпочтительнее Quick Sort из-за отсутствия random access.'
    },
    {
      id: 10,
      title: 'Задача: Flatten Multilevel Doubly Linked List',
      type: 'practice',
      difficulty: 'hard',
      description: 'Многоуровневый двусвязный список имеет указатель child, ведущий на вложенный подсписок. Расплющи (flatten) список в один уровень.',
      requirements: [
        'Класс Node с полями val, prev, next, child',
        'Метод flatten(Node head) — in-place',
        'Вложенный ребёнок вставляется между текущим и следующим узлом',
        'Рекурсивно обрабатывать вложенные уровни'
      ],
      expectedOutput: '1 <-> 2 <-> 3 <-> 7 <-> 8 <-> 11 <-> 12 <-> 9 <-> 10 <-> 4 <-> 5 <-> 6 -> null',
      hint: 'При встрече child: 1) Найди конец child-списка. 2) Вставь child-список между curr и curr.next. 3) Обнули curr.child.',
      solution: `public class Main {
    static class Node {
        int val; Node prev; Node next; Node child;
        Node(int val) { this.val = val; }
    }

    static Node flatten(Node head) {
        Node curr = head;
        while (curr != null) {
            if (curr.child != null) {
                Node child = curr.child;
                Node next = curr.next;
                // Найти конец child-списка
                Node tail = child;
                while (tail.next != null) tail = tail.next;
                // Вставить child-список
                curr.next = child;
                child.prev = curr;
                tail.next = next;
                if (next != null) next.prev = tail;
                curr.child = null;
            }
            curr = curr.next;
        }
        return head;
    }

    public static void main(String[] args) {
        Node n1=new Node(1),n2=new Node(2),n3=new Node(3),n4=new Node(4),
             n5=new Node(5),n6=new Node(6),n7=new Node(7),n8=new Node(8),
             n9=new Node(9),n10=new Node(10),n11=new Node(11),n12=new Node(12);
        n1.next=n2;n2.prev=n1;n2.next=n3;n3.prev=n2;n3.next=n4;n4.prev=n3;
        n4.next=n5;n5.prev=n4;n5.next=n6;n6.prev=n5;
        n3.child=n7;n7.next=n8;n8.prev=n7;n8.next=n9;n9.prev=n8;n9.next=n10;n10.prev=n9;
        n8.child=n11;n11.next=n12;n12.prev=n11;

        Node result = flatten(n1);
        StringBuilder sb = new StringBuilder();
        while (result != null) {
            sb.append(result.val);
            sb.append(result.next != null ? " <-> " : " -> null");
            result = result.next;
        }
        System.out.println(sb);
    }
}`,
      explanation: 'Итеративный подход: при обнаружении child 1) находим конец подсписка, 2) вставляем подсписок между curr и curr.next, 3) обнуляем child. Продолжаем итерацию — вложенные child-узлы обработаются автоматически, т.к. curr.next теперь указывает на начало бывшего подсписка. O(n) время, O(1) память.'
    }
  ]
}
