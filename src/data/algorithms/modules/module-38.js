export default {
  id: 38,
  title: 'Практикум: Linked List задачи',
  description: 'Десять классических задач LeetCode на связные списки. От разворота и слияния до палиндрома и реверса группами.',
  lessons: [
    {
      id: 1,
      title: 'Reverse Linked List (LeetCode #206)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан head односвязного списка. Разверните список и верните новый head.',
      requirements: [
        'Реализуйте метод ListNode reverseList(ListNode head)',
        'Итеративное решение через три указателя',
        'Верните новый head (бывший хвост)',
        'Пустой список и один элемент — валидные входы'
      ],
      expectedOutput: 'reverseList([1,2,3,4,5]) -> [5,4,3,2,1]\nreverseList([1,2]) -> [2,1]\nreverseList([]) -> []',
      hint: 'Три указателя: prev = null, curr = head, next = curr.next. На каждом шаге: сохраняем next, разворачиваем указатель, сдвигаемся.',
      solution: `// Определение узла
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class ReverseLinkedList {
    // Итеративный подход — O(n) время, O(1) память
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;

        while (curr != null) {
            ListNode next = curr.next; // сохраняем следующий
            curr.next = prev;          // разворачиваем указатель
            prev = curr;               // сдвигаем prev
            curr = next;               // сдвигаем curr
        }
        return prev; // prev — новый head
    }

    // Рекурсивный подход — O(n) время, O(n) память (стек вызовов)
    public ListNode reverseListRecursive(ListNode head) {
        if (head == null || head.next == null) return head;
        ListNode newHead = reverseListRecursive(head.next);
        head.next.next = head; // разворачиваем указатель
        head.next = null;      // обнуляем старый указатель
        return newHead;
    }

    public static void main(String[] args) {
        ReverseLinkedList sol = new ReverseLinkedList();
        // Создаём: 1 -> 2 -> 3 -> 4 -> 5
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(3);
        head.next.next.next = new ListNode(4);
        head.next.next.next.next = new ListNode(5);

        ListNode reversed = sol.reverseList(head);
        // Печатаем: 5 -> 4 -> 3 -> 2 -> 1
        while (reversed != null) {
            System.out.print(reversed.val + " ");
            reversed = reversed.next;
        }
    }
}`,
      explanation: 'Итеративный разворот: три указателя prev, curr, next. На каждом шаге разворачиваем curr.next на prev, затем сдвигаем оба. В конце prev указывает на новый head. O(n) времени, O(1) памяти. Рекурсивный вариант элегантен, но использует O(n) стековой памяти.'
    },
    {
      id: 2,
      title: 'Merge Two Sorted Lists (LeetCode #21)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Даны head двух отсортированных связных списков. Слейте их в один отсортированный список и верните его head.',
      requirements: [
        'Реализуйте метод ListNode mergeTwoLists(ListNode list1, ListNode list2)',
        'Оба списка отсортированы по возрастанию',
        'Новый список должен быть отсортирован',
        'Используйте узлы из входных списков (не создавайте новые)',
        'Один или оба списка могут быть пустыми'
      ],
      expectedOutput: 'mergeTwoLists([1,2,4], [1,3,4]) -> [1,1,2,3,4,4]\nmergeTwoLists([], []) -> []\nmergeTwoLists([], [0]) -> [0]',
      hint: 'Создайте dummy-узел. Итерируйте оба списка: на каждом шаге присоединяйте меньший узел. В конце присоедините оставшийся хвост.',
      solution: `public class MergeTwoLists {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Dummy-узел упрощает логику
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;

        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) {
                current.next = list1;
                list1 = list1.next;
            } else {
                current.next = list2;
                list2 = list2.next;
            }
            current = current.next;
        }

        // Присоединяем оставшийся хвост
        current.next = (list1 != null) ? list1 : list2;

        return dummy.next;
    }

    public static void main(String[] args) {
        MergeTwoLists sol = new MergeTwoLists();
        // list1: 1 -> 2 -> 4
        ListNode l1 = new ListNode(1);
        l1.next = new ListNode(2);
        l1.next.next = new ListNode(4);
        // list2: 1 -> 3 -> 4
        ListNode l2 = new ListNode(1);
        l2.next = new ListNode(3);
        l2.next.next = new ListNode(4);

        ListNode merged = sol.mergeTwoLists(l1, l2);
        while (merged != null) {
            System.out.print(merged.val + " "); // 1 1 2 3 4 4
            merged = merged.next;
        }
    }
}`,
      explanation: 'Dummy-узел — стандартный приём для упрощения работы со связным списком. Два указателя на входные списки, на каждом шаге выбираем меньший. Хвост оставшегося списка присоединяем одной операцией. O(n+m) времени, O(1) дополнительной памяти.'
    },
    {
      id: 3,
      title: 'Linked List Cycle (LeetCode #141)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан head связного списка. Определите, есть ли в нём цикл. Цикл — когда последний узел указывает на один из предыдущих.',
      requirements: [
        'Реализуйте метод boolean hasCycle(ListNode head)',
        'Верните true, если в списке есть цикл',
        'Решение за O(1) памяти (без HashSet)',
        'Используйте алгоритм Флойда (два указателя: slow и fast)'
      ],
      expectedOutput: 'hasCycle([3,2,0,-4] с циклом на pos=1) -> true\nhasCycle([1,2] с циклом на pos=0) -> true\nhasCycle([1] без цикла) -> false',
      hint: 'Алгоритм Флойда: slow двигается по 1 шагу, fast — по 2. Если есть цикл — они встретятся. Если fast достигнет null — цикла нет.',
      solution: `public class LinkedListCycle {
    public boolean hasCycle(ListNode head) {
        if (head == null || head.next == null) return false;

        ListNode slow = head;       // двигается по 1
        ListNode fast = head.next;  // двигается по 2

        while (slow != fast) {
            // fast достиг конца — цикла нет
            if (fast == null || fast.next == null) {
                return false;
            }
            slow = slow.next;
            fast = fast.next.next;
        }
        // slow == fast — встретились, цикл есть
        return true;
    }

    public static void main(String[] args) {
        LinkedListCycle sol = new LinkedListCycle();
        // Список с циклом: 3 -> 2 -> 0 -> -4 -> 2 (цикл)
        ListNode n1 = new ListNode(3);
        ListNode n2 = new ListNode(2);
        ListNode n3 = new ListNode(0);
        ListNode n4 = new ListNode(-4);
        n1.next = n2; n2.next = n3; n3.next = n4; n4.next = n2;
        System.out.println(sol.hasCycle(n1)); // true

        // Список без цикла: 1 -> 2
        ListNode a1 = new ListNode(1);
        a1.next = new ListNode(2);
        System.out.println(sol.hasCycle(a1)); // false
    }
}`,
      explanation: 'Алгоритм Флойда (черепаха и заяц): slow идёт по 1, fast по 2. Если цикл есть — fast обязательно "нагонит" slow внутри цикла. Если fast == null — конец списка, цикла нет. O(n) времени, O(1) памяти — без дополнительных структур данных.'
    },
    {
      id: 4,
      title: 'Remove Nth Node From End (LeetCode #19)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан head связного списка. Удалите n-й узел с конца списка и верните head.',
      requirements: [
        'Реализуйте метод ListNode removeNthFromEnd(ListNode head, int n)',
        'n всегда валиден (1 <= n <= длина списка)',
        'Решение за один проход',
        'Используйте два указателя с промежутком n'
      ],
      expectedOutput: 'removeNthFromEnd([1,2,3,4,5], 2) -> [1,2,3,5]\nremoveNthFromEnd([1], 1) -> []\nremoveNthFromEnd([1,2], 1) -> [1]',
      hint: 'Два указателя с промежутком n: сначала fast продвигается на n шагов, затем оба двигаются синхронно. Когда fast дойдёт до конца, slow будет перед удаляемым узлом.',
      solution: `public class RemoveNthFromEnd {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        // Dummy-узел для обработки случая удаления head
        ListNode dummy = new ListNode(0);
        dummy.next = head;

        ListNode fast = dummy;
        ListNode slow = dummy;

        // fast продвигается на n+1 шагов
        for (int i = 0; i <= n; i++) {
            fast = fast.next;
        }

        // Двигаем оба до конца
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }

        // slow.next — узел для удаления
        slow.next = slow.next.next;

        return dummy.next;
    }

    public static void main(String[] args) {
        RemoveNthFromEnd sol = new RemoveNthFromEnd();
        // 1 -> 2 -> 3 -> 4 -> 5, удалить 2-й с конца
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(3);
        head.next.next.next = new ListNode(4);
        head.next.next.next.next = new ListNode(5);

        ListNode result = sol.removeNthFromEnd(head, 2);
        while (result != null) {
            System.out.print(result.val + " "); // 1 2 3 5
            result = result.next;
        }
    }
}`,
      explanation: 'Два указателя с промежутком: fast уходит на n+1 вперёд, затем оба двигаются. Когда fast==null, slow стоит перед удаляемым узлом. Dummy-узел нужен для случая удаления head. Один проход — O(n) времени, O(1) памяти.'
    },
    {
      id: 5,
      title: 'Add Two Numbers (LeetCode #2)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Даны два непустых связных списка, представляющие неотрицательные числа в обратном порядке. Каждый узел — одна цифра. Сложите числа и верните сумму как связный список.',
      requirements: [
        'Реализуйте метод ListNode addTwoNumbers(ListNode l1, ListNode l2)',
        'Цифры хранятся в обратном порядке: 342 = 2 -> 4 -> 3',
        'Каждый узел содержит одну цифру (0-9)',
        'Числа не содержат ведущих нулей (кроме числа 0)',
        'Обработайте перенос (carry)'
      ],
      expectedOutput: 'addTwoNumbers([2,4,3], [5,6,4]) -> [7,0,8]  // 342 + 465 = 807\naddTwoNumbers([0], [0]) -> [0]\naddTwoNumbers([9,9,9,9], [9,9,9]) -> [8,9,9,0,1]  // 9999+999=10998',
      hint: 'Итерируйте оба списка поэлементно, складывая цифры + carry. Новая цифра = sum % 10, carry = sum / 10. Не забудьте про финальный carry.',
      solution: `public class AddTwoNumbers {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode current = dummy;
        int carry = 0;

        while (l1 != null || l2 != null || carry != 0) {
            int sum = carry;
            if (l1 != null) {
                sum += l1.val;
                l1 = l1.next;
            }
            if (l2 != null) {
                sum += l2.val;
                l2 = l2.next;
            }

            carry = sum / 10;
            current.next = new ListNode(sum % 10);
            current = current.next;
        }

        return dummy.next;
    }

    public static void main(String[] args) {
        AddTwoNumbers sol = new AddTwoNumbers();
        // 342: 2 -> 4 -> 3
        ListNode l1 = new ListNode(2);
        l1.next = new ListNode(4);
        l1.next.next = new ListNode(3);
        // 465: 5 -> 6 -> 4
        ListNode l2 = new ListNode(5);
        l2.next = new ListNode(6);
        l2.next.next = new ListNode(4);

        ListNode result = sol.addTwoNumbers(l1, l2);
        while (result != null) {
            System.out.print(result.val + " "); // 7 0 8
            result = result.next;
        }
    }
}`,
      explanation: 'Идём по обоим спискам параллельно, как при сложении столбиком. На каждом шаге: sum = val1 + val2 + carry. Цифра = sum % 10, carry = sum / 10. Условие цикла: пока хотя бы один список не пуст или есть carry. Dummy-узел упрощает построение результата. O(max(m,n)).'
    },
    {
      id: 6,
      title: 'Reorder List (LeetCode #143)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан head связного списка L0 -> L1 -> ... -> Ln-1 -> Ln. Переставьте узлы: L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...',
      requirements: [
        'Реализуйте метод void reorderList(ListNode head)',
        'Изменение in-place, без создания нового списка',
        'Не изменяйте значения узлов — только указатели',
        'Используйте три шага: найти середину, развернуть вторую половину, слить'
      ],
      expectedOutput: 'reorderList([1,2,3,4]) -> [1,4,2,3]\nreorderList([1,2,3,4,5]) -> [1,5,2,4,3]',
      hint: 'Три шага: 1) Найдите середину (slow/fast). 2) Разверните вторую половину. 3) Сливайте: поочерёдно берите узлы из первой и развёрнутой второй половины.',
      solution: `public class ReorderList {
    public void reorderList(ListNode head) {
        if (head == null || head.next == null) return;

        // Шаг 1: Находим середину
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        // Шаг 2: Разворачиваем вторую половину
        ListNode second = reverse(slow.next);
        slow.next = null; // отрезаем первую половину

        // Шаг 3: Сливаем поочерёдно
        ListNode first = head;
        while (second != null) {
            ListNode tmp1 = first.next;
            ListNode tmp2 = second.next;
            first.next = second;
            second.next = tmp1;
            first = tmp1;
            second = tmp2;
        }
    }

    private ListNode reverse(ListNode head) {
        ListNode prev = null;
        while (head != null) {
            ListNode next = head.next;
            head.next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }

    public static void main(String[] args) {
        ReorderList sol = new ReorderList();
        // 1 -> 2 -> 3 -> 4 -> 5
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(3);
        head.next.next.next = new ListNode(4);
        head.next.next.next.next = new ListNode(5);

        sol.reorderList(head);
        while (head != null) {
            System.out.print(head.val + " "); // 1 5 2 4 3
            head = head.next;
        }
    }
}`,
      explanation: 'Три классических приёма: 1) Slow/fast для нахождения середины. 2) Разворот второй половины. 3) Слияние двух половин. Каждый шаг — O(n), общее время O(n), дополнительная память O(1). Этот паттерн "split + reverse + merge" часто встречается в задачах на списки.'
    },
    {
      id: 7,
      title: 'Copy List with Random Pointer (LeetCode #138)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан связный список, где каждый узел имеет дополнительный random указатель на произвольный узел или null. Создайте глубокую копию списка.',
      requirements: [
        'Реализуйте метод Node copyRandomList(Node head)',
        'Каждый узел: val, next, random',
        'random указывает на любой узел списка или null',
        'Нужна глубокая копия (deep copy) — новые узлы',
        'Решение за O(n) с помощью HashMap'
      ],
      expectedOutput: 'copyRandomList([[7,null],[13,0],[11,4],[10,2],[1,0]])\n-> глубокая копия с теми же связями',
      hint: 'Первый проход: создайте HashMap<оригинал, копия>. Второй проход: настройте next и random для каждой копии, используя map.',
      solution: `import java.util.*;

// Определение узла
class Node {
    int val;
    Node next;
    Node random;
    Node(int val) { this.val = val; }
}

public class CopyRandomList {
    public Node copyRandomList(Node head) {
        if (head == null) return null;

        // Шаг 1: создаём копии и маппинг оригинал -> копия
        Map<Node, Node> map = new HashMap<>();
        Node curr = head;
        while (curr != null) {
            map.put(curr, new Node(curr.val));
            curr = curr.next;
        }

        // Шаг 2: настраиваем next и random
        curr = head;
        while (curr != null) {
            map.get(curr).next = map.get(curr.next);
            map.get(curr).random = map.get(curr.random);
            curr = curr.next;
        }

        return map.get(head);
    }

    public static void main(String[] args) {
        CopyRandomList sol = new CopyRandomList();
        // Создаём: 7 -> 13 -> 11
        Node n1 = new Node(7);
        Node n2 = new Node(13);
        Node n3 = new Node(11);
        n1.next = n2; n2.next = n3;
        n1.random = null; n2.random = n1; n3.random = n2;

        Node copy = sol.copyRandomList(n1);
        // Проверяем: копия — отдельные объекты
        System.out.println(copy.val);          // 7
        System.out.println(copy.next.val);     // 13
        System.out.println(copy.next.random.val); // 7
        System.out.println(copy != n1);         // true (разные объекты)
    }
}`,
      explanation: 'Два прохода с HashMap: 1) Создаём копию каждого узла и сохраняем маппинг оригинал->копия. 2) Для каждой копии устанавливаем next и random через map. HashMap позволяет найти копию любого узла за O(1). Время O(n), память O(n).'
    },
    {
      id: 8,
      title: 'Palindrome Linked List (LeetCode #234)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Дан head односвязного списка. Определите, является ли он палиндромом.',
      requirements: [
        'Реализуйте метод boolean isPalindrome(ListNode head)',
        'Решение за O(n) времени и O(1) памяти',
        'Список является палиндромом, если читается одинаково в обе стороны',
        'Используйте технику: найти середину, развернуть вторую половину, сравнить'
      ],
      expectedOutput: 'isPalindrome([1,2,2,1]) -> true\nisPalindrome([1,2]) -> false\nisPalindrome([1,2,3,2,1]) -> true',
      hint: 'Найдите середину (slow/fast), разверните вторую половину, затем сравните элементы первой и развёрнутой второй половины.',
      solution: `public class PalindromeLinkedList {
    public boolean isPalindrome(ListNode head) {
        if (head == null || head.next == null) return true;

        // Шаг 1: Находим середину
        ListNode slow = head, fast = head;
        while (fast.next != null && fast.next.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }

        // Шаг 2: Разворачиваем вторую половину
        ListNode secondHalf = reverse(slow.next);

        // Шаг 3: Сравниваем
        ListNode first = head;
        ListNode second = secondHalf;
        boolean result = true;
        while (second != null) {
            if (first.val != second.val) {
                result = false;
                break;
            }
            first = first.next;
            second = second.next;
        }

        // Шаг 4 (опционально): восстанавливаем список
        slow.next = reverse(secondHalf);

        return result;
    }

    private ListNode reverse(ListNode head) {
        ListNode prev = null;
        while (head != null) {
            ListNode next = head.next;
            head.next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }

    public static void main(String[] args) {
        PalindromeLinkedList sol = new PalindromeLinkedList();
        // 1 -> 2 -> 2 -> 1
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(2);
        head.next.next.next = new ListNode(1);
        System.out.println(sol.isPalindrome(head)); // true

        // 1 -> 2
        ListNode h2 = new ListNode(1);
        h2.next = new ListNode(2);
        System.out.println(sol.isPalindrome(h2)); // false
    }
}`,
      explanation: 'Тот же паттерн "split + reverse": 1) Середина через slow/fast. 2) Разворачиваем вторую половину. 3) Сравниваем элементы. 4) Восстанавливаем список (хороший тон). O(n) времени, O(1) памяти. Без разворота пришлось бы использовать O(n) памяти.'
    },
    {
      id: 9,
      title: 'Merge K Sorted Lists (LeetCode #23)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан массив из k отсортированных связных списков. Слейте их в один отсортированный список.',
      requirements: [
        'Реализуйте метод ListNode mergeKLists(ListNode[] lists)',
        'Используйте PriorityQueue (min-heap)',
        'Все списки отсортированы по возрастанию',
        'Результат — один отсортированный список',
        'Обработайте пустые списки и пустой массив'
      ],
      expectedOutput: 'mergeKLists([[1,4,5],[1,3,4],[2,6]]) -> [1,1,2,3,4,4,5,6]\nmergeKLists([]) -> []\nmergeKLists([[]]) -> []',
      hint: 'Положите head каждого списка в min-heap. Извлекайте минимум, добавляйте в результат. Если у извлечённого узла есть next — кладите его в heap.',
      solution: `import java.util.*;

public class MergeKSortedLists {
    public ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;

        // Min-heap по значению узла
        PriorityQueue<ListNode> pq = new PriorityQueue<>(
            (a, b) -> a.val - b.val
        );

        // Добавляем head каждого непустого списка
        for (ListNode head : lists) {
            if (head != null) pq.offer(head);
        }

        ListNode dummy = new ListNode(0);
        ListNode current = dummy;

        while (!pq.isEmpty()) {
            ListNode min = pq.poll(); // извлекаем минимум
            current.next = min;
            current = current.next;

            if (min.next != null) {
                pq.offer(min.next); // добавляем следующий
            }
        }

        return dummy.next;
    }

    public static void main(String[] args) {
        MergeKSortedLists sol = new MergeKSortedLists();
        // Список 1: 1 -> 4 -> 5
        ListNode l1 = new ListNode(1);
        l1.next = new ListNode(4);
        l1.next.next = new ListNode(5);
        // Список 2: 1 -> 3 -> 4
        ListNode l2 = new ListNode(1);
        l2.next = new ListNode(3);
        l2.next.next = new ListNode(4);
        // Список 3: 2 -> 6
        ListNode l3 = new ListNode(2);
        l3.next = new ListNode(6);

        ListNode result = sol.mergeKLists(new ListNode[]{l1, l2, l3});
        while (result != null) {
            System.out.print(result.val + " "); // 1 1 2 3 4 4 5 6
            result = result.next;
        }
    }
}`,
      explanation: 'Min-heap хранит по одному узлу от каждого списка. На каждом шаге извлекаем минимальный, добавляем его next в heap. В heap всегда максимум k элементов. Общее время O(N * log k), где N — суммарное количество узлов. Альтернатива — merge sort (divide and conquer) с тем же временем.'
    },
    {
      id: 10,
      title: 'Reverse Nodes in k-Group (LeetCode #25)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дан head связного списка. Разверните узлы группами по k. Если оставшихся узлов меньше k — оставьте их как есть.',
      requirements: [
        'Реализуйте метод ListNode reverseKGroup(ListNode head, int k)',
        'Разворачивайте по k узлов за раз',
        'Если осталось менее k — не разворачивать',
        'Решение за O(n) времени, O(1) памяти',
        'Нельзя менять значения — только указатели'
      ],
      expectedOutput: 'reverseKGroup([1,2,3,4,5], 2) -> [2,1,4,3,5]\nreverseKGroup([1,2,3,4,5], 3) -> [3,2,1,4,5]',
      hint: 'Для каждой группы: 1) Проверьте, что есть k узлов. 2) Разверните группу. 3) Соедините с предыдущей и следующей группами.',
      solution: `public class ReverseKGroup {
    public ListNode reverseKGroup(ListNode head, int k) {
        if (head == null || k == 1) return head;

        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode prevGroupEnd = dummy;

        while (true) {
            // Проверяем, есть ли k узлов
            ListNode kthNode = getKthNode(prevGroupEnd, k);
            if (kthNode == null) break;

            ListNode nextGroupStart = kthNode.next;
            // Разворачиваем группу
            ListNode prev = nextGroupStart;
            ListNode curr = prevGroupEnd.next;
            for (int i = 0; i < k; i++) {
                ListNode next = curr.next;
                curr.next = prev;
                prev = curr;
                curr = next;
            }

            // Соединяем: prevGroupEnd -> развёрнутая группа
            ListNode groupStart = prevGroupEnd.next; // станет концом после разворота
            prevGroupEnd.next = kthNode; // kthNode — новое начало
            prevGroupEnd = groupStart;   // старое начало — новый конец
        }

        return dummy.next;
    }

    // Возвращает k-й узел после node, или null если их меньше k
    private ListNode getKthNode(ListNode node, int k) {
        while (node != null && k > 0) {
            node = node.next;
            k--;
        }
        return node;
    }

    public static void main(String[] args) {
        ReverseKGroup sol = new ReverseKGroup();
        // 1 -> 2 -> 3 -> 4 -> 5
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        head.next.next = new ListNode(3);
        head.next.next.next = new ListNode(4);
        head.next.next.next.next = new ListNode(5);

        ListNode result = sol.reverseKGroup(head, 2);
        while (result != null) {
            System.out.print(result.val + " "); // 2 1 4 3 5
            result = result.next;
        }
    }
}`,
      explanation: 'Для каждой группы из k узлов: 1) getKthNode проверяет наличие k узлов. 2) Разворачиваем внутри группы (prev инициализируем следующей группой для автоматического соединения). 3) Обновляем связи между группами. O(n) времени (каждый узел обрабатывается дважды: проверка + разворот), O(1) памяти.'
    }
  ]
}
