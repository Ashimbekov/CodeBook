export default {
  id: 17,
  title: 'Iterator',
  description: 'Паттерн Iterator: последовательный обход коллекций без раскрытия внутренней структуры',
  lessons: [
    {
      id: 1,
      title: 'Что такое Iterator?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Iterator (Итератор) — поведенческий паттерн, предоставляющий способ последовательного доступа к элементам составного объекта, не раскрывая его внутреннего представления.' },
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Нужно обходить коллекцию, не зная её внутренней структуры (массив, дерево, граф)',
          'Нужно поддержать несколько способов обхода одной коллекции',
          'Нужен единый интерфейс для обхода разных коллекций',
          'Java Iterable/Iterator, JavaScript Symbol.iterator, Python __iter__/__next__'
        ]},
        { type: 'note', value: 'В Java и TypeScript итераторы встроены в язык. for-of, for-each, spread-оператор, Stream API — все используют итераторы. Но полезно понимать, как они работают внутри.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java',
      type: 'theory',
      content: [
        { type: 'code', language: 'java', value: '// Коллекция — бинарное дерево\nclass TreeNode<T> {\n    T value;\n    TreeNode<T> left, right;\n\n    TreeNode(T value) { this.value = value; }\n}\n\n// Итератор для in-order обхода дерева\nclass InOrderIterator<T> implements Iterator<T> {\n    private Deque<TreeNode<T>> stack = new ArrayDeque<>();\n\n    InOrderIterator(TreeNode<T> root) {\n        pushLeft(root);\n    }\n\n    private void pushLeft(TreeNode<T> node) {\n        while (node != null) {\n            stack.push(node);\n            node = node.left;\n        }\n    }\n\n    public boolean hasNext() { return !stack.isEmpty(); }\n\n    public T next() {\n        TreeNode<T> node = stack.pop();\n        pushLeft(node.right);\n        return node.value;\n    }\n}\n\n// Коллекция с поддержкой Iterable\nclass BinaryTree<T> implements Iterable<T> {\n    TreeNode<T> root;\n\n    BinaryTree(TreeNode<T> root) { this.root = root; }\n\n    @Override\n    public Iterator<T> iterator() {\n        return new InOrderIterator<>(root);\n    }\n}\n\n// Использование — стандартный for-each!\npublic class Main {\n    public static void main(String[] args) {\n        TreeNode<Integer> root = new TreeNode<>(4);\n        root.left = new TreeNode<>(2);\n        root.right = new TreeNode<>(6);\n        root.left.left = new TreeNode<>(1);\n        root.left.right = new TreeNode<>(3);\n        root.right.left = new TreeNode<>(5);\n\n        BinaryTree<Integer> tree = new BinaryTree<>(root);\n\n        for (int val : tree) {\n            System.out.print(val + " "); // 1 2 3 4 5 6\n        }\n    }\n}' },
        { type: 'tip', value: 'Реализация Iterable позволяет использовать for-each, Stream API и любые стандартные методы Java для работы с коллекциями.' }
      ]
    },
    {
      id: 3,
      title: 'Iterator на TypeScript: Symbol.iterator',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: '// Пользовательский диапазон с итератором\nclass Range implements Iterable<number> {\n    constructor(private start: number, private end: number, private step: number = 1) {}\n\n    [Symbol.iterator](): Iterator<number> {\n        let current = this.start;\n        const end = this.end;\n        const step = this.step;\n\n        return {\n            next(): IteratorResult<number> {\n                if (current <= end) {\n                    const value = current;\n                    current += step;\n                    return { value, done: false };\n                }\n                return { value: undefined as any, done: true };\n            }\n        };\n    }\n}\n\n// Использование — стандартный for-of и spread!\nconst range = new Range(1, 10, 2);\n\nfor (const n of range) {\n    console.log(n); // 1, 3, 5, 7, 9\n}\n\nconst arr = [...new Range(0, 5)];\nconsole.log(arr); // [0, 1, 2, 3, 4, 5]' },
        { type: 'heading', value: 'Генераторы — упрощённые итераторы' },
        { type: 'code', language: 'typescript', value: '// Generator функция — yield делает итератор автоматически\nfunction* fibonacci(limit: number): Generator<number> {\n    let a = 0, b = 1;\n    while (a <= limit) {\n        yield a;\n        [a, b] = [b, a + b];\n    }\n}\n\nfor (const n of fibonacci(100)) {\n    console.log(n); // 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89\n}\n\n// Генератор для обхода дерева\nfunction* inOrder<T>(node: TreeNode<T> | null): Generator<T> {\n    if (node) {\n        yield* inOrder(node.left);\n        yield node.value;\n        yield* inOrder(node.right);\n    }\n}' },
        { type: 'note', value: 'Генераторы (function*) — синтаксический сахар для итераторов. yield приостанавливает выполнение и возвращает значение. yield* делегирует другому генератору.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: итератор для пагинации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте итератор для постраничного обхода данных из API.',
      requirements: [
        'Класс PaginatedCollection<T> с данными, pageSize и реализацией Iterable',
        'PageIterator — итерирует по страницам, возвращая массив элементов',
        'ItemIterator — итерирует по отдельным элементам',
        'Поддержка for-of в TypeScript',
        'Демонстрация: 25 элементов, страницы по 10'
      ],
      hint: 'PageIterator возвращает slice данных. ItemIterator использует PageIterator внутри и выдаёт элементы по одному.',
      expectedOutput: 'Страница 1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nСтраница 2: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]\nСтраница 3: [21, 22, 23, 24, 25]\nВсе элементы: 1, 2, 3, ... 25',
      solution: 'class PaginatedCollection<T> {\n    constructor(private items: T[], private pageSize: number) {}\n\n    *pages(): Generator<T[]> {\n        for (let i = 0; i < this.items.length; i += this.pageSize) {\n            yield this.items.slice(i, i + this.pageSize);\n        }\n    }\n\n    [Symbol.iterator](): Iterator<T> {\n        let index = 0;\n        const items = this.items;\n        return {\n            next(): IteratorResult<T> {\n                if (index < items.length) {\n                    return { value: items[index++], done: false };\n                }\n                return { value: undefined as any, done: true };\n            }\n        };\n    }\n\n    getTotalPages(): number {\n        return Math.ceil(this.items.length / this.pageSize);\n    }\n}\n\nconst data = Array.from({ length: 25 }, (_, i) => i + 1);\nconst collection = new PaginatedCollection(data, 10);\n\nlet pageNum = 1;\nfor (const page of collection.pages()) {\n    console.log(`Страница ${pageNum++}: [${page.join(", ")}]`);\n}\n\nconst allItems = [...collection];\nconsole.log(`Все элементы: ${allItems.slice(0, 3).join(", ")}, ... ${allItems[allItems.length - 1]}`);',
      explanation: 'PaginatedCollection предоставляет два итератора: pages() — генератор, выдающий страницы (массивы), и Symbol.iterator — для поэлементного обхода. Оба работают с for-of и spread.'
    },
    {
      id: 5,
      title: 'Практика: итератор для графа на Java',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте BFS и DFS итераторы для обхода графа.',
      requirements: [
        'Класс Graph с addEdge(from, to) и реализацией Iterable',
        'BfsIterator — обход в ширину (очередь)',
        'DfsIterator — обход в глубину (стек)',
        'Graph.bfs(start) и Graph.dfs(start) возвращают Iterable',
        'Оба итератора отслеживают посещённые вершины'
      ],
      hint: 'BFS использует Queue (LinkedList), DFS — Stack (ArrayDeque). Оба хранят Set<T> visited.',
      expectedOutput: 'BFS от A: A → B → C → D → E → F\nDFS от A: A → C → F → E → B → D',
      solution: 'import java.util.*;\n\nclass Graph {\n    private Map<String, List<String>> adj = new HashMap<>();\n\n    void addEdge(String from, String to) {\n        adj.computeIfAbsent(from, k -> new ArrayList<>()).add(to);\n        adj.computeIfAbsent(to, k -> new ArrayList<>());\n    }\n\n    Iterable<String> bfs(String start) {\n        return () -> new Iterator<>() {\n            Queue<String> queue = new LinkedList<>(List.of(start));\n            Set<String> visited = new HashSet<>(Set.of(start));\n\n            public boolean hasNext() { return !queue.isEmpty(); }\n\n            public String next() {\n                String node = queue.poll();\n                for (String neighbor : adj.getOrDefault(node, List.of())) {\n                    if (visited.add(neighbor)) {\n                        queue.add(neighbor);\n                    }\n                }\n                return node;\n            }\n        };\n    }\n\n    Iterable<String> dfs(String start) {\n        return () -> new Iterator<>() {\n            Deque<String> stack = new ArrayDeque<>(List.of(start));\n            Set<String> visited = new HashSet<>();\n\n            public boolean hasNext() { return !stack.isEmpty(); }\n\n            public String next() {\n                String node;\n                do { node = stack.pop(); } while (visited.contains(node) && !stack.isEmpty());\n                visited.add(node);\n                List<String> neighbors = adj.getOrDefault(node, List.of());\n                for (int i = neighbors.size() - 1; i >= 0; i--) {\n                    if (!visited.contains(neighbors.get(i))) {\n                        stack.push(neighbors.get(i));\n                    }\n                }\n                return node;\n            }\n        };\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Graph g = new Graph();\n        g.addEdge("A", "B");\n        g.addEdge("A", "C");\n        g.addEdge("B", "D");\n        g.addEdge("B", "E");\n        g.addEdge("C", "E");\n        g.addEdge("C", "F");\n\n        System.out.print("BFS от A: ");\n        for (String node : g.bfs("A")) System.out.print(node + " → ");\n        System.out.println();\n\n        System.out.print("DFS от A: ");\n        for (String node : g.dfs("A")) System.out.print(node + " → ");\n    }\n}',
      explanation: 'BFS и DFS итераторы скрывают алгоритм обхода за стандартным интерфейсом Iterator. Клиент использует for-each и не знает, какой алгоритм применяется. Это позволяет легко переключаться между стратегиями обхода.'
    },
    {
      id: 6,
      title: 'Практика: ленивый итератор на TypeScript',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте lazy-итератор с методами map, filter, take — как в Stream API.',
      requirements: [
        'Класс Lazy<T> оборачивает Iterable<T>',
        'Метод map(fn) — ленивое преобразование',
        'Метод filter(fn) — ленивая фильтрация',
        'Метод take(n) — взять первые N элементов',
        'Метод toArray() — материализация результата',
        'Все операции ленивые — выполняются только при toArray()'
      ],
      hint: 'Используйте генераторы (function*) для каждой операции. Каждый метод возвращает новый Lazy с генератором, обрабатывающим предыдущий.',
      expectedOutput: '[2, 8, 18, 32, 50]',
      solution: 'class Lazy<T> {\n    constructor(private source: Iterable<T>) {}\n\n    static from<T>(iterable: Iterable<T>): Lazy<T> {\n        return new Lazy(iterable);\n    }\n\n    static range(start: number, end: number): Lazy<number> {\n        return new Lazy(function* () {\n            for (let i = start; i <= end; i++) yield i;\n        }());\n    }\n\n    map<U>(fn: (item: T) => U): Lazy<U> {\n        const source = this.source;\n        return new Lazy(function* () {\n            for (const item of source) yield fn(item);\n        }());\n    }\n\n    filter(predicate: (item: T) => boolean): Lazy<T> {\n        const source = this.source;\n        return new Lazy(function* () {\n            for (const item of source) {\n                if (predicate(item)) yield item;\n            }\n        }());\n    }\n\n    take(n: number): Lazy<T> {\n        const source = this.source;\n        return new Lazy(function* () {\n            let count = 0;\n            for (const item of source) {\n                if (count >= n) return;\n                yield item;\n                count++;\n            }\n        }());\n    }\n\n    toArray(): T[] {\n        return [...this.source];\n    }\n\n    [Symbol.iterator]() {\n        return this.source[Symbol.iterator]();\n    }\n}\n\nconst result = Lazy.range(1, 100)\n    .filter(n => n % 2 === 0)\n    .map(n => n * n)\n    .take(5)\n    .toArray();\n\nconsole.log(result); // [4, 16, 36, 64, 100] — но вычислено лениво!\n\n// Ленивость: range генерирует до 100, но take(5) останавливает на 10-м числе',
      explanation: 'Каждая операция (map, filter, take) создаёт новый генератор, обрабатывающий предыдущий. Вычисления не происходят до вызова toArray(). take(5) останавливает всю цепочку после 5 результатов — нет необходимости обрабатывать все 100 чисел.'
    }
  ]
}
