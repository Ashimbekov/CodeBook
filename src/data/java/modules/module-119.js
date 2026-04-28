export default {
  id: 119,
  title: 'Практикум: Collections deep dive',
  description: 'Глубокое погружение в коллекции Java: реализация ArrayList, LinkedList, HashMap и Stack с нуля, LRU Cache, PriorityQueue, TreeMap, утилиты Collections, Deque и Iterator.',
  lessons: [
    {
      id: 1,
      title: 'Реализация ArrayList с нуля',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте свой MyArrayList на основе массива с динамическим расширением. Поддержите основные операции: add, get, remove, size. При заполнении массив увеличивается в 1.5 раза. Это показывает, как работает java.util.ArrayList изнутри.',
      requirements: [
        'Класс MyArrayList<T> с внутренним массивом Object[]',
        'Начальная ёмкость 4, рост в 1.5 раза при заполнении',
        'Методы: add(T), get(int), remove(int), size(), isEmpty()',
        'Метод resize() — создание нового массива и копирование',
        'Проверка границ индексов с IndexOutOfBoundsException',
        'toString() для удобного вывода'
      ],
      expectedOutput: `=== MyArrayList ===
Добавляем: 10, 20, 30, 40
Список: [10, 20, 30, 40], size=4
get(2): 30

Добавляем 50 (resize!)
Список: [10, 20, 30, 40, 50], size=5, capacity=6

remove(1) → удалён: 20
Список: [10, 30, 40, 50], size=4

Добавляем 60, 70, 80 (ещё resize!)
Список: [10, 30, 40, 50, 60, 70, 80], size=7

get(-1): IndexOutOfBoundsException!`,
      hint: 'Внутри — Object[] data и int size. При add: если size == data.length, создайте новый массив с ёмкостью data.length * 3 / 2 + 1. При remove: сдвиньте элементы влево через System.arraycopy(). Не забудьте обнулить data[size] после remove.',
      solution: `import java.util.Arrays;

public class Main {
    static class MyArrayList<T> {
        private Object[] data;
        private int size;

        MyArrayList() {
            data = new Object[4];
            size = 0;
        }

        void add(T element) {
            if (size == data.length) resize();
            data[size++] = element;
        }

        @SuppressWarnings("unchecked")
        T get(int index) {
            checkIndex(index);
            return (T) data[index];
        }

        @SuppressWarnings("unchecked")
        T remove(int index) {
            checkIndex(index);
            T removed = (T) data[index];
            System.arraycopy(data, index + 1, data, index, size - index - 1);
            data[--size] = null;
            return removed;
        }

        int size() { return size; }
        boolean isEmpty() { return size == 0; }
        int capacity() { return data.length; }

        private void resize() {
            int newCap = data.length * 3 / 2 + 1;
            data = Arrays.copyOf(data, newCap);
        }

        private void checkIndex(int index) {
            if (index < 0 || index >= size)
                throw new IndexOutOfBoundsException("Index: " + index + ", Size: " + size);
        }

        @Override
        public String toString() {
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < size; i++) {
                if (i > 0) sb.append(", ");
                sb.append(data[i]);
            }
            return sb.append("]").toString();
        }
    }

    public static void main(String[] args) {
        System.out.println("=== MyArrayList ===");

        MyArrayList<Integer> list = new MyArrayList<>();
        System.out.println("Добавляем: 10, 20, 30, 40");
        list.add(10); list.add(20); list.add(30); list.add(40);
        System.out.println("Список: " + list + ", size=" + list.size());
        System.out.println("get(2): " + list.get(2));

        System.out.println("\\nДобавляем 50 (resize!)");
        list.add(50);
        System.out.println("Список: " + list + ", size=" + list.size()
            + ", capacity=" + list.capacity());

        System.out.println("\\nremove(1) → удалён: " + list.remove(1));
        System.out.println("Список: " + list + ", size=" + list.size());

        System.out.println("\\nДобавляем 60, 70, 80 (ещё resize!)");
        list.add(60); list.add(70); list.add(80);
        System.out.println("Список: " + list + ", size=" + list.size());

        System.out.println("\\nget(-1): ");
        try {
            list.get(-1);
        } catch (IndexOutOfBoundsException e) {
            System.out.println("IndexOutOfBoundsException!");
        }
    }
}`,
      explanation: 'ArrayList внутри — массив Object[]. При заполнении создаётся новый массив большего размера (в JDK — oldCapacity + oldCapacity >> 1, примерно *1.5). Сложность: add — амортизированная O(1), get — O(1), remove — O(n) из-за сдвига. System.arraycopy() — нативный метод, быстрее цикла. Реальный ArrayList ещё проверяет overflow ёмкости и поддерживает modCount для fail-fast.'
    },
    {
      id: 2,
      title: 'Реализация LinkedList с нуля',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте двусвязный список MyLinkedList с узлами Node<T>. Поддержите addFirst, addLast, removeFirst, removeLast, get, size. Покажите преимущества перед ArrayList при вставке в начало.',
      requirements: [
        'Внутренний класс Node<T> с prev, next, data',
        'Поля head, tail, size',
        'Методы: addFirst(T), addLast(T), removeFirst(), removeLast(), get(int), size()',
        'Корректная обработка граничных случаев: пустой список, один элемент',
        'toString() для вывода в обоих направлениях'
      ],
      expectedOutput: `=== MyLinkedList ===
addLast: 10, 20, 30
Список (→): [10 → 20 → 30], size=3
Список (←): [30 → 20 → 10]

addFirst: 5
Список: [5 → 10 → 20 → 30], size=4

get(2): 20

removeFirst() → 5
Список: [10 → 20 → 30], size=3

removeLast() → 30
Список: [10 → 20], size=2

Удаляем всё:
removeFirst() → 10
removeFirst() → 20
isEmpty: true, size=0`,
      hint: 'Node хранит prev, next, data. При addFirst: новый узел.next = head, head.prev = новый, head = новый. При addLast — аналогично с tail. При remove — не забудьте обнулить ссылки и обработать случай size == 1 (head = tail = null).',
      solution: `public class Main {
    static class MyLinkedList<T> {
        private static class Node<T> {
            T data;
            Node<T> prev, next;
            Node(T data) { this.data = data; }
        }

        private Node<T> head, tail;
        private int size;

        void addFirst(T data) {
            Node<T> node = new Node<>(data);
            if (head == null) {
                head = tail = node;
            } else {
                node.next = head;
                head.prev = node;
                head = node;
            }
            size++;
        }

        void addLast(T data) {
            Node<T> node = new Node<>(data);
            if (tail == null) {
                head = tail = node;
            } else {
                node.prev = tail;
                tail.next = node;
                tail = node;
            }
            size++;
        }

        T removeFirst() {
            if (head == null) throw new RuntimeException("List is empty");
            T data = head.data;
            if (head == tail) {
                head = tail = null;
            } else {
                head = head.next;
                head.prev = null;
            }
            size--;
            return data;
        }

        T removeLast() {
            if (tail == null) throw new RuntimeException("List is empty");
            T data = tail.data;
            if (head == tail) {
                head = tail = null;
            } else {
                tail = tail.prev;
                tail.next = null;
            }
            size--;
            return data;
        }

        T get(int index) {
            if (index < 0 || index >= size)
                throw new IndexOutOfBoundsException("Index: " + index);
            Node<T> current = head;
            for (int i = 0; i < index; i++) current = current.next;
            return current.data;
        }

        int size() { return size; }
        boolean isEmpty() { return size == 0; }

        String toStringForward() {
            StringBuilder sb = new StringBuilder("[");
            Node<T> cur = head;
            while (cur != null) {
                if (cur != head) sb.append(" → ");
                sb.append(cur.data);
                cur = cur.next;
            }
            return sb.append("]").toString();
        }

        String toStringBackward() {
            StringBuilder sb = new StringBuilder("[");
            Node<T> cur = tail;
            while (cur != null) {
                if (cur != tail) sb.append(" → ");
                sb.append(cur.data);
                cur = cur.prev;
            }
            return sb.append("]").toString();
        }
    }

    public static void main(String[] args) {
        System.out.println("=== MyLinkedList ===");

        MyLinkedList<Integer> list = new MyLinkedList<>();
        System.out.println("addLast: 10, 20, 30");
        list.addLast(10); list.addLast(20); list.addLast(30);
        System.out.println("Список (→): " + list.toStringForward() + ", size=" + list.size());
        System.out.println("Список (←): " + list.toStringBackward());

        System.out.println("\\naddFirst: 5");
        list.addFirst(5);
        System.out.println("Список: " + list.toStringForward() + ", size=" + list.size());

        System.out.println("\\nget(2): " + list.get(2));

        System.out.println("\\nremoveFirst() → " + list.removeFirst());
        System.out.println("Список: " + list.toStringForward() + ", size=" + list.size());

        System.out.println("\\nremoveLast() → " + list.removeLast());
        System.out.println("Список: " + list.toStringForward() + ", size=" + list.size());

        System.out.println("\\nУдаляем всё:");
        System.out.println("removeFirst() → " + list.removeFirst());
        System.out.println("removeFirst() → " + list.removeFirst());
        System.out.println("isEmpty: " + list.isEmpty() + ", size=" + list.size());
    }
}`,
      explanation: 'LinkedList — двусвязный список узлов. addFirst/addLast — O(1), removeFirst/removeLast — O(1), get — O(n). Преимущество перед ArrayList: вставка/удаление в начале — O(1) vs O(n). Недостаток: get(index) — O(n), нет локальности кеша (каждый узел в разном месте памяти). Реальный java.util.LinkedList оптимизирует get() — если index > size/2, идёт с конца.'
    },
    {
      id: 3,
      title: 'Реализация HashMap с нуля',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте MyHashMap с массивом бакетов, хеш-функцией, обработкой коллизий через chaining (связный список в бакете). Поддержите put, get, remove, resize при загрузке > 0.75.',
      requirements: [
        'Внутренний класс Entry<K,V> с key, value, next',
        'Массив бакетов Entry[] начальной ёмкости 16',
        'Методы: put(K, V), get(K), remove(K), containsKey(K), size()',
        'Обработка коллизий — связный список в бакете',
        'Resize при loadFactor > 0.75',
        'Корректная работа с null ключами (в бакете 0)'
      ],
      expectedOutput: `=== MyHashMap ===
put: один=1, два=2, три=3
get("один"): 1
get("два"): 2
get("три"): 3
size: 3

Обновление: put("два", 22)
get("два"): 22
size: 3

remove("один"): 1
containsKey("один"): false
size: 2

--- Тест коллизий и resize ---
Добавлено 20 элементов
size: 20
get("key-0"): value-0
get("key-19"): value-19

--- null ключ ---
put(null, "nullValue")
get(null): nullValue`,
      hint: 'Индекс бакета: hash(key) & (capacity - 1). При коллизии — добавляем в начало связного списка бакета. При put() с существующим ключом — обновляем значение. При resize — создаём массив x2 и перехешируем все entry.',
      solution: `public class Main {
    static class MyHashMap<K, V> {
        static class Entry<K, V> {
            K key; V value; Entry<K, V> next;
            Entry(K key, V value, Entry<K, V> next) {
                this.key = key; this.value = value; this.next = next;
            }
        }

        @SuppressWarnings("unchecked")
        private Entry<K, V>[] buckets = new Entry[16];
        private int size = 0;
        private static final double LOAD_FACTOR = 0.75;

        private int index(K key) {
            if (key == null) return 0;
            return (key.hashCode() & 0x7fffffff) % buckets.length;
        }

        void put(K key, V value) {
            if ((double) size / buckets.length > LOAD_FACTOR) resize();
            int idx = index(key);
            Entry<K, V> cur = buckets[idx];
            while (cur != null) {
                if (keyEquals(cur.key, key)) {
                    cur.value = value; // обновление
                    return;
                }
                cur = cur.next;
            }
            buckets[idx] = new Entry<>(key, value, buckets[idx]);
            size++;
        }

        V get(K key) {
            int idx = index(key);
            Entry<K, V> cur = buckets[idx];
            while (cur != null) {
                if (keyEquals(cur.key, key)) return cur.value;
                cur = cur.next;
            }
            return null;
        }

        V remove(K key) {
            int idx = index(key);
            Entry<K, V> cur = buckets[idx], prev = null;
            while (cur != null) {
                if (keyEquals(cur.key, key)) {
                    if (prev == null) buckets[idx] = cur.next;
                    else prev.next = cur.next;
                    size--;
                    return cur.value;
                }
                prev = cur;
                cur = cur.next;
            }
            return null;
        }

        boolean containsKey(K key) {
            return get(key) != null || (key == null && buckets[0] != null);
        }

        int size() { return size; }

        @SuppressWarnings("unchecked")
        private void resize() {
            Entry<K, V>[] old = buckets;
            buckets = new Entry[old.length * 2];
            size = 0;
            for (Entry<K, V> head : old) {
                Entry<K, V> cur = head;
                while (cur != null) {
                    put(cur.key, cur.value);
                    cur = cur.next;
                }
            }
        }

        private boolean keyEquals(K a, K b) {
            if (a == null) return b == null;
            return a.equals(b);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== MyHashMap ===");

        MyHashMap<String, Integer> map = new MyHashMap<>();
        System.out.println("put: один=1, два=2, три=3");
        map.put("один", 1); map.put("два", 2); map.put("три", 3);
        System.out.println("get(\\"один\\"): " + map.get("один"));
        System.out.println("get(\\"два\\"): " + map.get("два"));
        System.out.println("get(\\"три\\"): " + map.get("три"));
        System.out.println("size: " + map.size());

        System.out.println("\\nОбновление: put(\\"два\\", 22)");
        map.put("два", 22);
        System.out.println("get(\\"два\\"): " + map.get("два"));
        System.out.println("size: " + map.size());

        System.out.println("\\nremove(\\"один\\"): " + map.remove("один"));
        System.out.println("containsKey(\\"один\\"): " + map.containsKey("один"));
        System.out.println("size: " + map.size());

        // Тест коллизий и resize
        System.out.println("\\n--- Тест коллизий и resize ---");
        MyHashMap<String, String> bigMap = new MyHashMap<>();
        for (int i = 0; i < 20; i++) {
            bigMap.put("key-" + i, "value-" + i);
        }
        System.out.println("Добавлено 20 элементов");
        System.out.println("size: " + bigMap.size());
        System.out.println("get(\\"key-0\\"): " + bigMap.get("key-0"));
        System.out.println("get(\\"key-19\\"): " + bigMap.get("key-19"));

        // null ключ
        System.out.println("\\n--- null ключ ---");
        MyHashMap<String, String> nullMap = new MyHashMap<>();
        nullMap.put(null, "nullValue");
        System.out.println("put(null, \\"nullValue\\")");
        System.out.println("get(null): " + nullMap.get(null));
    }
}`,
      explanation: 'HashMap — массив бакетов (Entry[]). Индекс бакета = hash(key) % capacity. При коллизии (два ключа в одном бакете) — chaining: связный список. Load factor 0.75 — при заполнении 75% происходит resize (x2) и rehash всех элементов. В JDK 8+ при длине цепочки > 8 — bucket превращается в красно-чёрное дерево (O(log n) вместо O(n)). Наша реализация упрощённая, но демонстрирует ключевые принципы.'
    },
    {
      id: 4,
      title: 'Реализация Stack через массив',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте стек MyStack на основе массива. Поддержите push, pop, peek, isEmpty, size. Используйте стек для проверки баланса скобок — классическая задача.',
      requirements: [
        'Класс MyStack<T> с внутренним массивом Object[]',
        'Методы: push(T), pop(), peek(), isEmpty(), size()',
        'Автоматическое расширение массива при заполнении',
        'EmptyStackException при pop/peek на пустом стеке',
        'Применение: проверка баланса скобок (){}[]'
      ],
      expectedOutput: `=== MyStack ===
push: 10, 20, 30
peek: 30
size: 3

pop: 30
pop: 20
pop: 10
isEmpty: true

pop на пустом: EmptyStackException!

--- Баланс скобок ---
"((){}[])": balanced = true
"({[)]}": balanced = false
"((())": balanced = false
"": balanced = true
"[{()}]": balanced = true`,
      hint: 'Стек — LIFO. Верхушка стека — data[size-1]. push: data[size++] = element. pop: return data[--size]. Для проверки скобок: при открывающей — push, при закрывающей — pop и проверить пару. В конце стек должен быть пуст.',
      solution: `import java.util.EmptyStackException;

public class Main {
    static class MyStack<T> {
        private Object[] data;
        private int size;

        MyStack() { data = new Object[8]; size = 0; }

        void push(T item) {
            if (size == data.length) {
                Object[] newData = new Object[data.length * 2];
                System.arraycopy(data, 0, newData, 0, size);
                data = newData;
            }
            data[size++] = item;
        }

        @SuppressWarnings("unchecked")
        T pop() {
            if (isEmpty()) throw new EmptyStackException();
            T item = (T) data[--size];
            data[size] = null;
            return item;
        }

        @SuppressWarnings("unchecked")
        T peek() {
            if (isEmpty()) throw new EmptyStackException();
            return (T) data[size - 1];
        }

        boolean isEmpty() { return size == 0; }
        int size() { return size; }
    }

    static boolean isBalanced(String s) {
        MyStack<Character> stack = new MyStack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else if (c == ')' || c == '}' || c == ']') {
                if (stack.isEmpty()) return false;
                char open = stack.pop();
                if (c == ')' && open != '(') return false;
                if (c == '}' && open != '{') return false;
                if (c == ']' && open != '[') return false;
            }
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        System.out.println("=== MyStack ===");

        MyStack<Integer> stack = new MyStack<>();
        System.out.println("push: 10, 20, 30");
        stack.push(10); stack.push(20); stack.push(30);
        System.out.println("peek: " + stack.peek());
        System.out.println("size: " + stack.size());

        System.out.println("\\npop: " + stack.pop());
        System.out.println("pop: " + stack.pop());
        System.out.println("pop: " + stack.pop());
        System.out.println("isEmpty: " + stack.isEmpty());

        System.out.println("\\npop на пустом: ");
        try { stack.pop(); } catch (EmptyStackException e) {
            System.out.println("EmptyStackException!");
        }

        System.out.println("\\n--- Баланс скобок ---");
        String[] tests = {"((){}[])", "({[)]}", "((())", "", "[{()}]"};
        for (String test : tests) {
            System.out.println("\\"" + test + "\\": balanced = " + isBalanced(test));
        }
    }
}`,
      explanation: 'Стек (LIFO) — одна из простейших структур данных. Все операции — O(1) амортизированно. В Java есть java.util.Stack (устаревший, наследует Vector) и ArrayDeque (рекомендуемый). Проверка баланса скобок — классическое применение стека: открывающая скобка — push, закрывающая — pop и проверка пары. Если в конце стек пуст — выражение сбалансировано.'
    },
    {
      id: 5,
      title: 'LRU Cache',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте LRU (Least Recently Used) Cache с ограниченной ёмкостью. При добавлении элемента сверх ёмкости удаляется наименее используемый. Два подхода: через LinkedHashMap и через свою структуру DoublyLinkedList + HashMap.',
      requirements: [
        'Интерфейс LRUCache<K,V> с get(K) и put(K,V)',
        'Реализация 1: LinkedHashMap с переопределением removeEldestEntry',
        'Реализация 2: DoublyLinkedList + HashMap для O(1) get и put',
        'Ёмкость кеша задаётся при создании',
        'При get() элемент перемещается в «свежие»',
        'При put() если кеш полон — удаляется самый старый элемент'
      ],
      expectedOutput: `=== LRU Cache ===

--- LinkedHashMap LRU (capacity=3) ---
put: A=1, B=2, C=3
Кеш: {A=1, B=2, C=3}
get(A): 1 (A стал свежим)
put: D=4 (вытеснит B — самый старый)
Кеш: {C=3, A=1, D=4}
get(B): null (вытеснен)

--- Custom LRU (capacity=3) ---
put: X=10, Y=20, Z=30
get(X): 10 (X стал свежим)
put: W=40 (вытеснит Y)
get(Y): null (вытеснен)
get(X): 10
get(Z): 30
get(W): 40`,
      hint: 'LinkedHashMap с accessOrder=true автоматически перемещает элемент при get(). Переопределите removeEldestEntry: return size() > capacity. Для ручной реализации: HashMap<K, Node> + DoublyLinkedList. При get/put перемещайте узел в хвост (свежий). При переполнении удаляйте голову (старый).',
      solution: `import java.util.*;

public class Main {
    // Подход 1: LinkedHashMap
    static class LHMLruCache<K, V> extends LinkedHashMap<K, V> {
        private final int capacity;

        LHMLruCache(int capacity) {
            super(capacity, 0.75f, true); // accessOrder = true!
            this.capacity = capacity;
        }

        @Override
        protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
            return size() > capacity;
        }
    }

    // Подход 2: Custom DoublyLinkedList + HashMap
    static class CustomLruCache<K, V> {
        private static class Node<K, V> {
            K key; V value;
            Node<K, V> prev, next;
            Node(K key, V value) { this.key = key; this.value = value; }
        }

        private final int capacity;
        private final Map<K, Node<K, V>> map = new HashMap<>();
        private final Node<K, V> head = new Node<>(null, null); // dummy
        private final Node<K, V> tail = new Node<>(null, null); // dummy

        CustomLruCache(int capacity) {
            this.capacity = capacity;
            head.next = tail;
            tail.prev = head;
        }

        V get(K key) {
            Node<K, V> node = map.get(key);
            if (node == null) return null;
            moveToTail(node);
            return node.value;
        }

        void put(K key, V value) {
            Node<K, V> node = map.get(key);
            if (node != null) {
                node.value = value;
                moveToTail(node);
            } else {
                if (map.size() == capacity) {
                    Node<K, V> oldest = head.next;
                    removeNode(oldest);
                    map.remove(oldest.key);
                }
                Node<K, V> newNode = new Node<>(key, value);
                addToTail(newNode);
                map.put(key, newNode);
            }
        }

        private void removeNode(Node<K, V> node) {
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }

        private void addToTail(Node<K, V> node) {
            node.prev = tail.prev;
            node.next = tail;
            tail.prev.next = node;
            tail.prev = node;
        }

        private void moveToTail(Node<K, V> node) {
            removeNode(node);
            addToTail(node);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== LRU Cache ===");

        // LinkedHashMap LRU
        System.out.println("\\n--- LinkedHashMap LRU (capacity=3) ---");
        LHMLruCache<String, Integer> lhm = new LHMLruCache<>(3);
        System.out.println("put: A=1, B=2, C=3");
        lhm.put("A", 1); lhm.put("B", 2); lhm.put("C", 3);
        System.out.println("Кеш: " + lhm);
        System.out.println("get(A): " + lhm.get("A") + " (A стал свежим)");
        System.out.println("put: D=4 (вытеснит B — самый старый)");
        lhm.put("D", 4);
        System.out.println("Кеш: " + lhm);
        System.out.println("get(B): " + lhm.get("B") + " (вытеснен)");

        // Custom LRU
        System.out.println("\\n--- Custom LRU (capacity=3) ---");
        CustomLruCache<String, Integer> custom = new CustomLruCache<>(3);
        System.out.println("put: X=10, Y=20, Z=30");
        custom.put("X", 10); custom.put("Y", 20); custom.put("Z", 30);
        System.out.println("get(X): " + custom.get("X") + " (X стал свежим)");
        System.out.println("put: W=40 (вытеснит Y)");
        custom.put("W", 40);
        System.out.println("get(Y): " + custom.get("Y") + " (вытеснен)");
        System.out.println("get(X): " + custom.get("X"));
        System.out.println("get(Z): " + custom.get("Z"));
        System.out.println("get(W): " + custom.get("W"));
    }
}`,
      explanation: 'LRU Cache — одна из самых популярных задач на собеседованиях (LeetCode #146). Два подхода: 1) LinkedHashMap с accessOrder=true — элегантный Java-способ, переопределяем removeEldestEntry(); 2) HashMap + DoublyLinkedList — классический подход, O(1) для get и put. Dummy head/tail упрощают граничные случаи. Кеш используется повсеместно: CPU cache, database cache, CDN, in-memory кеши (Redis, Caffeine).'
    },
    {
      id: 6,
      title: 'Очередь с приоритетами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте PriorityQueue с custom Comparator для обработки заказов. Заказы с высоким приоритетом обрабатываются первыми. При равном приоритете — по времени создания (FIFO).',
      requirements: [
        'Класс Order: id, customerName, priority (1=HIGH, 2=MEDIUM, 3=LOW), timestamp',
        'PriorityQueue с Comparator: сначала по priority (меньше = важнее), затем по timestamp',
        'Добавить 6 заказов разных приоритетов',
        'Обработать (poll) все заказы в правильном порядке',
        'Показать размер очереди после каждой операции'
      ],
      expectedOutput: `=== PriorityQueue: Заказы ===
Добавлены заказы:
  #1 Алексей (LOW) в 10:00
  #2 Мария (HIGH) в 10:01
  #3 Борис (MEDIUM) в 10:02
  #4 Дина (HIGH) в 10:03
  #5 Ержан (LOW) в 10:04
  #6 Катя (MEDIUM) в 10:05

Обработка заказов (по приоритету):
  1. #2 Мария [HIGH] — обработан (осталось: 5)
  2. #4 Дина [HIGH] — обработан (осталось: 4)
  3. #3 Борис [MEDIUM] — обработан (осталось: 3)
  4. #6 Катя [MEDIUM] — обработан (осталось: 2)
  5. #1 Алексей [LOW] — обработан (осталось: 1)
  6. #5 Ержан [LOW] — обработан (осталось: 0)`,
      hint: 'PriorityQueue — min-heap по умолчанию. Comparator.comparingInt(Order::getPriority).thenComparingLong(Order::getTimestamp) — сначала по приоритету (1 < 2 < 3), затем по времени. poll() возвращает элемент с наименьшим значением.',
      solution: `import java.util.*;

public class Main {
    static class Order {
        int id;
        String customer;
        int priority; // 1=HIGH, 2=MEDIUM, 3=LOW
        long timestamp;

        Order(int id, String customer, int priority, long timestamp) {
            this.id = id; this.customer = customer;
            this.priority = priority; this.timestamp = timestamp;
        }

        String priorityName() {
            return switch (priority) {
                case 1 -> "HIGH";
                case 2 -> "MEDIUM";
                case 3 -> "LOW";
                default -> "UNKNOWN";
            };
        }
    }

    public static void main(String[] args) {
        System.out.println("=== PriorityQueue: Заказы ===");

        Comparator<Order> comp = Comparator
            .comparingInt((Order o) -> o.priority)
            .thenComparingLong(o -> o.timestamp);

        PriorityQueue<Order> queue = new PriorityQueue<>(comp);

        long base = System.currentTimeMillis();
        Order[] orders = {
            new Order(1, "Алексей", 3, base),
            new Order(2, "Мария", 1, base + 60000),
            new Order(3, "Борис", 2, base + 120000),
            new Order(4, "Дина", 1, base + 180000),
            new Order(5, "Ержан", 3, base + 240000),
            new Order(6, "Катя", 2, base + 300000)
        };

        System.out.println("Добавлены заказы:");
        String[] times = {"10:00", "10:01", "10:02", "10:03", "10:04", "10:05"};
        for (int i = 0; i < orders.length; i++) {
            queue.add(orders[i]);
            System.out.printf("  #%d %s (%s) в %s%n",
                orders[i].id, orders[i].customer, orders[i].priorityName(), times[i]);
        }

        System.out.println("\\nОбработка заказов (по приоритету):");
        int num = 1;
        while (!queue.isEmpty()) {
            Order o = queue.poll();
            System.out.printf("  %d. #%d %s [%s] — обработан (осталось: %d)%n",
                num++, o.id, o.customer, o.priorityName(), queue.size());
        }
    }
}`,
      explanation: 'PriorityQueue — куча (heap), не гарантирует порядок при итерации, но poll() всегда возвращает минимальный элемент. Сложность: offer/poll — O(log n), peek — O(1). Comparator с thenComparing обеспечивает стабильную сортировку: сначала по приоритету, затем FIFO при равных приоритетах. Используется в планировщиках задач, алгоритмах Dijkstra, A*, Huffman coding.'
    },
    {
      id: 7,
      title: 'TreeMap: навигация по данным',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте TreeMap и NavigableMap для работы с отсортированными данными. Продемонстрируйте методы floorKey, ceilingKey, subMap, headMap, tailMap, firstEntry, lastEntry на примере биржевых котировок.',
      requirements: [
        'TreeMap<LocalDate, Double> — история цен акций',
        'floorKey/floorEntry — ближайшая дата <= заданной',
        'ceilingKey/ceilingEntry — ближайшая дата >= заданной',
        'subMap — диапазон дат',
        'headMap/tailMap — до/после даты',
        'firstEntry/lastEntry — первая/последняя запись'
      ],
      expectedOutput: `=== TreeMap: Котировки акций ===
Все котировки:
  2024-01-02: 150.0
  2024-01-05: 155.5
  2024-01-10: 148.3
  2024-01-15: 162.0
  2024-01-20: 158.7
  2024-01-25: 170.2

--- Навигация ---
floorKey(2024-01-12): 2024-01-10 → 148.3
ceilingKey(2024-01-12): 2024-01-15 → 162.0

--- Диапазон 05.01 — 20.01 ---
  2024-01-05: 155.5
  2024-01-10: 148.3
  2024-01-15: 162.0

--- До 2024-01-10 ---
  2024-01-02: 150.0
  2024-01-05: 155.5

--- После 2024-01-15 ---
  2024-01-15: 162.0
  2024-01-20: 158.7
  2024-01-25: 170.2

Первая: 2024-01-02=150.0, Последняя: 2024-01-25=170.2`,
      hint: 'TreeMap — красно-чёрное дерево, ключи отсортированы. floorKey(k) — наибольший ключ <= k. ceilingKey(k) — наименьший ключ >= k. subMap(from, to) — поддиапазон [from, to). Все навигационные операции — O(log n).',
      solution: `import java.time.LocalDate;
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== TreeMap: Котировки акций ===");

        TreeMap<LocalDate, Double> prices = new TreeMap<>();
        prices.put(LocalDate.of(2024, 1, 2), 150.0);
        prices.put(LocalDate.of(2024, 1, 5), 155.5);
        prices.put(LocalDate.of(2024, 1, 10), 148.3);
        prices.put(LocalDate.of(2024, 1, 15), 162.0);
        prices.put(LocalDate.of(2024, 1, 20), 158.7);
        prices.put(LocalDate.of(2024, 1, 25), 170.2);

        System.out.println("Все котировки:");
        prices.forEach((date, price) ->
            System.out.printf("  %s: %.1f%n", date, price));

        // Навигация
        System.out.println("\\n--- Навигация ---");
        LocalDate query = LocalDate.of(2024, 1, 12);
        Map.Entry<LocalDate, Double> floor = prices.floorEntry(query);
        Map.Entry<LocalDate, Double> ceiling = prices.ceilingEntry(query);
        System.out.printf("floorKey(%s): %s → %.1f%n", query, floor.getKey(), floor.getValue());
        System.out.printf("ceilingKey(%s): %s → %.1f%n", query, ceiling.getKey(), ceiling.getValue());

        // subMap
        LocalDate from = LocalDate.of(2024, 1, 5);
        LocalDate to = LocalDate.of(2024, 1, 20);
        System.out.printf("\\n--- Диапазон %02d.%02d — %02d.%02d ---%n",
            from.getDayOfMonth(), from.getMonthValue(), to.getDayOfMonth(), to.getMonthValue());
        prices.subMap(from, true, to, false).forEach((d, p) ->
            System.out.printf("  %s: %.1f%n", d, p));

        // headMap
        LocalDate before = LocalDate.of(2024, 1, 10);
        System.out.println("\\n--- До " + before + " ---");
        prices.headMap(before, false).forEach((d, p) ->
            System.out.printf("  %s: %.1f%n", d, p));

        // tailMap
        LocalDate after = LocalDate.of(2024, 1, 15);
        System.out.println("\\n--- После " + after + " ---");
        prices.tailMap(after, true).forEach((d, p) ->
            System.out.printf("  %s: %.1f%n", d, p));

        // First / Last
        System.out.printf("\\nПервая: %s=%.1f, Последняя: %s=%.1f%n",
            prices.firstEntry().getKey(), prices.firstEntry().getValue(),
            prices.lastEntry().getKey(), prices.lastEntry().getValue());
    }
}`,
      explanation: 'TreeMap реализует NavigableMap на основе красно-чёрного дерева. Все ключи хранятся отсортированными. Методы навигации: floorKey/ceilingKey — поиск ближайшего ключа; subMap — подмножество; headMap/tailMap — «до»/«после». Все операции O(log n). Идеально для временных рядов, интервалов, диапазонных запросов. В отличие от HashMap (O(1) get), TreeMap медленнее для точечных запросов, но поддерживает диапазоны.'
    },
    {
      id: 8,
      title: 'Collections утилиты',
      type: 'practice',
      difficulty: 'easy',
      description: 'Изучите утилитный класс java.util.Collections: unmodifiableList, synchronizedList, frequency, disjoint, singletonList, nCopies, swap, rotate. Покажите применение каждого метода.',
      requirements: [
        'unmodifiableList — создание неизменяемого представления',
        'synchronizedList — потокобезопасная обёртка',
        'frequency — подсчёт вхождений элемента',
        'disjoint — проверка отсутствия общих элементов',
        'nCopies, singletonList — создание специальных списков',
        'swap, rotate — манипуляции с элементами'
      ],
      expectedOutput: `=== Collections утилиты ===

--- unmodifiableList ---
Список: [Java, Python, Go]
Попытка add: UnsupportedOperationException!

--- frequency ---
Список: [Java, Python, Java, Go, Java, Python]
Частота "Java": 3
Частота "Python": 2
Частота "C++": 0

--- disjoint ---
set1: [Java, Python, Go]
set2: [C++, Rust, Kotlin]
set3: [Java, Rust]
disjoint(set1, set2): true (нет общих)
disjoint(set1, set3): false (есть общие)

--- nCopies и singletonList ---
nCopies(5, "★"): [★, ★, ★, ★, ★]
singletonList("только один"): [только один]

--- swap и rotate ---
До swap: [A, B, C, D, E]
swap(0, 4): [E, B, C, D, A]
rotate(2): [D, A, E, B, C]`,
      hint: 'Collections — утилитный класс с static методами для работы с коллекциями. unmodifiableList() оборачивает список и бросает UnsupportedOperationException при попытке изменения. synchronizedList() оборачивает в synchronized обёртку. frequency() считает вхождения через equals().',
      solution: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Collections утилиты ===");

        // unmodifiableList
        System.out.println("\\n--- unmodifiableList ---");
        List<String> original = new ArrayList<>(Arrays.asList("Java", "Python", "Go"));
        List<String> unmodifiable = Collections.unmodifiableList(original);
        System.out.println("Список: " + unmodifiable);
        try {
            unmodifiable.add("C++");
        } catch (UnsupportedOperationException e) {
            System.out.println("Попытка add: UnsupportedOperationException!");
        }

        // frequency
        System.out.println("\\n--- frequency ---");
        List<String> langs = Arrays.asList("Java", "Python", "Java", "Go", "Java", "Python");
        System.out.println("Список: " + langs);
        System.out.println("Частота \\"Java\\": " + Collections.frequency(langs, "Java"));
        System.out.println("Частота \\"Python\\": " + Collections.frequency(langs, "Python"));
        System.out.println("Частота \\"C++\\": " + Collections.frequency(langs, "C++"));

        // disjoint
        System.out.println("\\n--- disjoint ---");
        List<String> set1 = Arrays.asList("Java", "Python", "Go");
        List<String> set2 = Arrays.asList("C++", "Rust", "Kotlin");
        List<String> set3 = Arrays.asList("Java", "Rust");
        System.out.println("set1: " + set1);
        System.out.println("set2: " + set2);
        System.out.println("set3: " + set3);
        System.out.println("disjoint(set1, set2): " + Collections.disjoint(set1, set2)
            + " (нет общих)");
        System.out.println("disjoint(set1, set3): " + Collections.disjoint(set1, set3)
            + " (есть общие)");

        // nCopies и singletonList
        System.out.println("\\n--- nCopies и singletonList ---");
        System.out.println("nCopies(5, \\"★\\"): " + Collections.nCopies(5, "★"));
        System.out.println("singletonList(\\"только один\\"): "
            + Collections.singletonList("только один"));

        // swap и rotate
        System.out.println("\\n--- swap и rotate ---");
        List<String> letters = new ArrayList<>(Arrays.asList("A", "B", "C", "D", "E"));
        System.out.println("До swap: " + letters);
        Collections.swap(letters, 0, 4);
        System.out.println("swap(0, 4): " + letters);
        Collections.rotate(letters, 2);
        System.out.println("rotate(2): " + letters);
    }
}`,
      explanation: 'Класс Collections — набор static утилит для работы с коллекциями (не путать с Collection — интерфейсом). Ключевые методы: unmodifiableList/Set/Map — иммутабельные обёртки (Java 9+ есть List.of()); synchronizedList — потокобезопасная обёртка; frequency — O(n) подсчёт; disjoint — O(n) проверка; nCopies — immutable список из N одинаковых элементов; rotate — циклический сдвиг.'
    },
    {
      id: 9,
      title: 'Deque как Stack и Queue',
      type: 'practice',
      difficulty: 'medium',
      description: 'ArrayDeque — универсальная структура, которая может работать как Stack (LIFO) и как Queue (FIFO). Продемонстрируйте оба режима и используйте Deque для BFS и DFS обхода графа.',
      requirements: [
        'ArrayDeque как Stack: push, pop, peek',
        'ArrayDeque как Queue: offer, poll, peek',
        'Простой граф на Map<String, List<String>>',
        'BFS обход с помощью Queue (ArrayDeque)',
        'DFS обход с помощью Stack (ArrayDeque)',
        'Вывод порядка посещения для BFS и DFS'
      ],
      expectedOutput: `=== Deque как Stack и Queue ===

--- Stack (LIFO) ---
push: A, B, C
pop: C, B, A

--- Queue (FIFO) ---
offer: A, B, C
poll: A, B, C

--- Граф ---
    A
   / \\
  B   C
 / \\   \\
D   E   F

--- BFS (Queue) от A ---
Порядок: A → B → C → D → E → F

--- DFS (Stack) от A ---
Порядок: A → C → F → B → E → D`,
      hint: 'ArrayDeque — рекомендуемая замена Stack и LinkedList для LIFO/FIFO. Как Stack: push/pop/peek работают с головой. Как Queue: offer добавляет в хвост, poll берёт из головы. BFS: queue.offer → queue.poll. DFS: stack.push → stack.pop.',
      solution: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Deque как Stack и Queue ===");

        // Stack
        System.out.println("\\n--- Stack (LIFO) ---");
        Deque<String> stack = new ArrayDeque<>();
        System.out.println("push: A, B, C");
        stack.push("A"); stack.push("B"); stack.push("C");
        System.out.println("pop: " + stack.pop() + ", " + stack.pop() + ", " + stack.pop());

        // Queue
        System.out.println("\\n--- Queue (FIFO) ---");
        Deque<String> queue = new ArrayDeque<>();
        System.out.println("offer: A, B, C");
        queue.offer("A"); queue.offer("B"); queue.offer("C");
        System.out.println("poll: " + queue.poll() + ", " + queue.poll() + ", " + queue.poll());

        // Граф
        System.out.println("\\n--- Граф ---");
        System.out.println("    A");
        System.out.println("   / \\\\");
        System.out.println("  B   C");
        System.out.println(" / \\\\   \\\\");
        System.out.println("D   E   F");

        Map<String, List<String>> graph = new LinkedHashMap<>();
        graph.put("A", Arrays.asList("B", "C"));
        graph.put("B", Arrays.asList("D", "E"));
        graph.put("C", Arrays.asList("F"));
        graph.put("D", Collections.emptyList());
        graph.put("E", Collections.emptyList());
        graph.put("F", Collections.emptyList());

        // BFS
        System.out.println("\\n--- BFS (Queue) от A ---");
        System.out.print("Порядок: ");
        bfs(graph, "A");

        // DFS
        System.out.println("\\n\\n--- DFS (Stack) от A ---");
        System.out.print("Порядок: ");
        dfs(graph, "A");
        System.out.println();
    }

    static void bfs(Map<String, List<String>> graph, String start) {
        Deque<String> queue = new ArrayDeque<>();
        Set<String> visited = new LinkedHashSet<>();
        queue.offer(start);
        visited.add(start);
        boolean first = true;

        while (!queue.isEmpty()) {
            String node = queue.poll();
            if (!first) System.out.print(" → ");
            System.out.print(node);
            first = false;

            for (String neighbor : graph.getOrDefault(node, Collections.emptyList())) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(neighbor);
                }
            }
        }
    }

    static void dfs(Map<String, List<String>> graph, String start) {
        Deque<String> stack = new ArrayDeque<>();
        Set<String> visited = new LinkedHashSet<>();
        stack.push(start);
        boolean first = true;

        while (!stack.isEmpty()) {
            String node = stack.pop();
            if (visited.contains(node)) continue;
            visited.add(node);
            if (!first) System.out.print(" → ");
            System.out.print(node);
            first = false;

            List<String> neighbors = graph.getOrDefault(node, Collections.emptyList());
            for (int i = neighbors.size() - 1; i >= 0; i--) {
                if (!visited.contains(neighbors.get(i))) {
                    stack.push(neighbors.get(i));
                }
            }
        }
    }
}`,
      explanation: 'ArrayDeque — кольцевой буфер на массиве, O(1) для всех операций на концах. Javadoc рекомендует ArrayDeque вместо Stack и LinkedList. BFS использует Queue (FIFO): сначала все соседи текущего уровня, потом следующий уровень. DFS использует Stack (LIFO): идёт вглубь. BFS находит кратчайший путь в невзвешенном графе, DFS — для обхода, топологической сортировки, поиска компонент.'
    },
    {
      id: 10,
      title: 'Iterator и fail-fast',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте свой Iterator для коллекции, продемонстрируйте ConcurrentModificationException (fail-fast поведение) и покажите безопасные способы удаления элементов во время итерации.',
      requirements: [
        'Класс NumberRange implements Iterable<Integer> — диапазон чисел',
        'Внутренний класс RangeIterator implements Iterator<Integer>',
        'Демонстрация ConcurrentModificationException при модификации ArrayList во время for-each',
        'Безопасное удаление через Iterator.remove()',
        'Безопасное удаление через removeIf()',
        'Безопасная итерация через CopyOnWriteArrayList'
      ],
      expectedOutput: `=== Iterator и fail-fast ===

--- Custom Iterator: NumberRange(1, 5) ---
for-each: 1 2 3 4 5

--- ConcurrentModificationException ---
Попытка list.remove() в for-each:
ConcurrentModificationException! Fail-fast!

--- Безопасное удаление: Iterator.remove() ---
До: [10, 15, 20, 25, 30]
Удаляем чётные через Iterator.remove()...
После: [15, 25]

--- Безопасное удаление: removeIf() ---
До: [10, 15, 20, 25, 30]
removeIf(n -> n > 20)
После: [10, 15, 20]

--- CopyOnWriteArrayList ---
Безопасная итерация с модификацией: OK
Список после: [Java, Go, Kotlin]`,
      hint: 'fail-fast: ArrayList хранит modCount, Iterator при создании запоминает expectedModCount. При каждом next()/remove() сравнивает — если отличаются, бросает ConcurrentModificationException. Iterator.remove() корректно обновляет оба счётчика. removeIf() — Java 8, safe. CopyOnWriteArrayList — итератор работает со снимком.',
      solution: `import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

public class Main {
    // Custom Iterable
    static class NumberRange implements Iterable<Integer> {
        private final int from, to;

        NumberRange(int from, int to) { this.from = from; this.to = to; }

        @Override
        public Iterator<Integer> iterator() {
            return new Iterator<>() {
                int current = from;

                @Override
                public boolean hasNext() { return current <= to; }

                @Override
                public Integer next() {
                    if (!hasNext()) throw new NoSuchElementException();
                    return current++;
                }
            };
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Iterator и fail-fast ===");

        // Custom Iterator
        System.out.println("\\n--- Custom Iterator: NumberRange(1, 5) ---");
        NumberRange range = new NumberRange(1, 5);
        System.out.print("for-each: ");
        for (int n : range) System.out.print(n + " ");
        System.out.println();

        // ConcurrentModificationException
        System.out.println("\\n--- ConcurrentModificationException ---");
        List<String> list = new ArrayList<>(Arrays.asList("A", "B", "C", "D"));
        System.out.println("Попытка list.remove() в for-each:");
        try {
            for (String s : list) {
                if (s.equals("B")) list.remove(s); // fail-fast!
            }
        } catch (ConcurrentModificationException e) {
            System.out.println("ConcurrentModificationException! Fail-fast!");
        }

        // Безопасное удаление: Iterator.remove()
        System.out.println("\\n--- Безопасное удаление: Iterator.remove() ---");
        List<Integer> nums = new ArrayList<>(Arrays.asList(10, 15, 20, 25, 30));
        System.out.println("До: " + nums);
        System.out.println("Удаляем чётные через Iterator.remove()...");
        Iterator<Integer> it = nums.iterator();
        while (it.hasNext()) {
            if (it.next() % 2 == 0) it.remove(); // safe!
        }
        System.out.println("После: " + nums);

        // removeIf
        System.out.println("\\n--- Безопасное удаление: removeIf() ---");
        List<Integer> nums2 = new ArrayList<>(Arrays.asList(10, 15, 20, 25, 30));
        System.out.println("До: " + nums2);
        System.out.println("removeIf(n -> n > 20)");
        nums2.removeIf(n -> n > 20);
        System.out.println("После: " + nums2);

        // CopyOnWriteArrayList
        System.out.println("\\n--- CopyOnWriteArrayList ---");
        CopyOnWriteArrayList<String> cowList = new CopyOnWriteArrayList<>(
            Arrays.asList("Java", "Python", "Go"));
        for (String s : cowList) {
            if (s.equals("Python")) {
                cowList.remove(s);     // safe — итератор на снимке
                cowList.add("Kotlin"); // safe
            }
        }
        System.out.println("Безопасная итерация с модификацией: OK");
        System.out.println("Список после: " + cowList);
    }
}`,
      explanation: 'Fail-fast итератор: ArrayList хранит счётчик модификаций modCount. При создании Iterator запоминается expectedModCount. Если во время итерации коллекция изменена (add/remove не через Iterator), modCount != expectedModCount → ConcurrentModificationException. Безопасные способы: 1) Iterator.remove() — обновляет оба счётчика; 2) removeIf() — Java 8, безопасен; 3) CopyOnWriteArrayList — итератор работает со снимком, мутации создают новый массив.'
    }
  ]
};
