export default {
  id: 30,
  title: 'Generics (обобщения)',
  description: 'Изучаем дженерики — мощный инструмент Java для написания универсального типобезопасного кода',
  lessons: [
    {
      id: 1, title: 'Зачем нужны дженерики?', type: 'theory',
      content: [
        { type: 'text', value: 'Дженерики (generics) позволяют писать классы и методы, которые работают с любым типом данных, но при этом остаются типобезопасными — компилятор проверяет типы на этапе компиляции, а не в runtime.' },
        { type: 'tip', value: 'Представь, что у тебя есть коробка. Без дженериков это просто "коробка" — туда можно положить всё: яблоко, автомобиль, слона — и потом ты не знаешь что там внутри. С дженериками ты говоришь: "Коробка для яблок" — и компилятор гарантирует, что туда можно положить только яблоки.' },
        { type: 'heading', value: 'Проблема без дженериков' },
        { type: 'code', language: 'java', value: '// До дженериков (Java 1.4 и раньше):\nimport java.util.ArrayList;\n\nArrayList list = new ArrayList(); // нет типа!\nlist.add("Строка");\nlist.add(42);        // можно добавить число!\nlist.add(3.14);      // и double!\n\n// При получении нужно кастовать — и можно ошибиться:\nString s = (String) list.get(0); // OK\nString s2 = (String) list.get(1); // ClassCastException в runtime!\n// Ошибка обнаружится только при запуске, а не при компиляции' },
        { type: 'heading', value: 'С дженериками — безопасно' },
        { type: 'code', language: 'java', value: '// С дженериками:\nimport java.util.ArrayList;\n\nArrayList<String> list = new ArrayList<>(); // только String!\nlist.add("Строка"); // OK\n// list.add(42);    // ОШИБКА КОМПИЛЯЦИИ — нельзя положить int!\n\nString s = list.get(0); // не нужен каст, компилятор знает тип\nSystem.out.println(s.toUpperCase()); // можно сразу вызывать методы String' },
        { type: 'note', value: 'Дженерики — это проверка на этапе компиляции. В runtime информация о типе стирается (type erasure). Это значит что ArrayList<String> и ArrayList<Integer> в runtime — одно и то же.' }
      ]
    },
    {
      id: 2, title: 'Generic классы', type: 'theory',
      content: [
        { type: 'text', value: 'Можно создать собственный класс с дженериком. Тип параметра указывается в угловых скобках и используется внутри класса.' },
        { type: 'heading', value: 'Создание generic класса' },
        { type: 'code', language: 'java', value: '// T — это тип-параметр (placeholder для реального типа)\n// Буква T — соглашение (T = Type, E = Element, K = Key, V = Value)\npublic class Box<T> {\n    private T content; // поле типа T\n\n    public void put(T item) {\n        this.content = item;\n    }\n\n    public T get() {\n        return content;\n    }\n\n    public boolean isEmpty() {\n        return content == null;\n    }\n\n    @Override\n    public String toString() {\n        return "Box[" + content + "]";\n    }\n}' },
        { type: 'code', language: 'java', value: 'public class Main {\n    public static void main(String[] args) {\n        // Box для String\n        Box<String> stringBox = new Box<>();\n        stringBox.put("Привет!");\n        String text = stringBox.get(); // не нужен каст!\n        System.out.println(text.toUpperCase()); // ПРИВЕТ!\n\n        // Box для Integer\n        Box<Integer> intBox = new Box<>();\n        intBox.put(42);\n        int number = intBox.get();\n        System.out.println(number * 2); // 84\n\n        // Box для Double\n        Box<Double> doubleBox = new Box<>();\n        doubleBox.put(3.14);\n        System.out.println(doubleBox); // Box[3.14]\n    }\n}' },
        { type: 'heading', value: 'Класс с несколькими типами' },
        { type: 'code', language: 'java', value: '// Пара значений разных типов\npublic class Pair<K, V> {\n    private K first;\n    private V second;\n\n    public Pair(K first, V second) {\n        this.first = first;\n        this.second = second;\n    }\n\n    public K getFirst() { return first; }\n    public V getSecond() { return second; }\n\n    @Override\n    public String toString() {\n        return "(" + first + ", " + second + ")";\n    }\n}\n\n// Использование:\nPair<String, Integer> person = new Pair<>("Иван", 25);\nSystem.out.println(person.getFirst() + " лет " + person.getSecond());\n// Иван лет 25\n\nPair<String, String> translation = new Pair<>("кот", "cat");\nSystem.out.println(translation); // (кот, cat)' }
      ]
    },
    {
      id: 3, title: 'Generic методы', type: 'theory',
      content: [
        { type: 'text', value: 'Кроме generic классов, можно создавать generic методы — методы с собственным типом-параметром, независимо от класса.' },
        { type: 'heading', value: 'Синтаксис generic метода' },
        { type: 'code', language: 'java', value: 'public class Utils {\n    // <T> перед типом возврата — объявляем тип-параметр\n    public static <T> void printArray(T[] array) {\n        for (T item : array) {\n            System.out.print(item + " ");\n        }\n        System.out.println();\n    }\n\n    // Метод, возвращающий максимум из двух сравнимых значений\n    public static <T extends Comparable<T>> T max(T a, T b) {\n        return a.compareTo(b) >= 0 ? a : b;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Integer[] ints = {1, 2, 3, 4, 5};\n        String[] strs = {"Привет", "Мир", "Java"};\n        Double[] dbls = {1.1, 2.2, 3.3};\n\n        Utils.printArray(ints);  // 1 2 3 4 5\n        Utils.printArray(strs);  // Привет Мир Java\n        Utils.printArray(dbls);  // 1.1 2.2 3.3\n\n        System.out.println(Utils.max(10, 20));     // 20\n        System.out.println(Utils.max("яблоко", "банан")); // яблоко\n    }\n}' },
        { type: 'heading', value: 'Обмен элементов массива' },
        { type: 'code', language: 'java', value: '// Generic метод для обмена двух элементов массива\npublic static <T> void swap(T[] array, int i, int j) {\n    T temp = array[i];\n    array[i] = array[j];\n    array[j] = temp;\n}\n\nString[] names = {"Анна", "Борис", "Виктор"};\nSystem.out.println(java.util.Arrays.toString(names));\n// [Анна, Борис, Виктор]\n\nswap(names, 0, 2);\nSystem.out.println(java.util.Arrays.toString(names));\n// [Виктор, Борис, Анна]' },
        { type: 'tip', value: 'Generic методы позволяют написать один метод, который работает с любым типом, вместо перегрузки (overloading) для каждого типа.' }
      ]
    },
    {
      id: 4, title: 'Ограниченные типы (bounded types)', type: 'theory',
      content: [
        { type: 'text', value: 'Иногда нужно ограничить, какие типы можно использовать в дженерике. Например, разрешить только числа, или только классы, реализующие определённый интерфейс.' },
        { type: 'heading', value: '<T extends ВерхняяГраница>' },
        { type: 'code', language: 'java', value: '// T должен быть Number или его потомком\n// (Integer, Double, Long, Float, Short...)\npublic static <T extends Number> double sum(T[] array) {\n    double total = 0;\n    for (T item : array) {\n        total += item.doubleValue();\n    }\n    return total;\n}\n\nInteger[] ints = {1, 2, 3, 4, 5};\nDouble[] dbls = {1.5, 2.5, 3.0};\n\nSystem.out.println(sum(ints)); // 15.0\nSystem.out.println(sum(dbls)); // 7.0\n\n// String[] strs = {"a", "b"};\n// sum(strs); // ОШИБКА: String не является Number' },
        { type: 'heading', value: 'Несколько ограничений' },
        { type: 'code', language: 'java', value: '// T должен быть потомком Animal И реализовывать Comparable\n// Используется & для нескольких ограничений\npublic class SortedCage<T extends Animal & Comparable<T>> {\n    // ...\n}\n\n// Пример с реальными классами:\n// T должен быть числом И сравниваемым\npublic static <T extends Number & Comparable<T>> T findMax(T[] arr) {\n    T max = arr[0];\n    for (T item : arr) {\n        if (item.compareTo(max) > 0) {\n            max = item;\n        }\n    }\n    return max;\n}\n\nInteger[] nums = {5, 3, 8, 1, 9, 2};\nSystem.out.println("Максимум: " + findMax(nums)); // 9' },
        { type: 'note', value: 'В <T extends A & B & C> первое ограничение может быть классом, остальные — только интерфейсами.' }
      ]
    },
    {
      id: 5, title: 'Wildcards (подстановочные символы)', type: 'theory',
      content: [
        { type: 'text', value: 'Wildcards (?) используются когда мы хотим принять коллекцию любого типа, но с определёнными ограничениями. ? означает "неизвестный тип".' },
        { type: 'heading', value: '? extends T — принять T и его потомков' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\nimport java.util.List;\n\n// Принимает список любых чисел (Integer, Double, Long...)\npublic static double sumList(List<? extends Number> list) {\n    double total = 0;\n    for (Number n : list) {\n        total += n.doubleValue();\n    }\n    return total;\n}\n\npublic static void main(String[] args) {\n    ArrayList<Integer> ints = new ArrayList<>();\n    ints.add(1); ints.add(2); ints.add(3);\n\n    ArrayList<Double> dbls = new ArrayList<>();\n    dbls.add(1.5); dbls.add(2.5);\n\n    System.out.println(sumList(ints)); // 6.0\n    System.out.println(sumList(dbls)); // 4.0\n    // Без wildcard нельзя было бы передать оба типа!\n}' },
        { type: 'heading', value: '? super T — принять T и его предков' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\nimport java.util.List;\n\n// Принимает список Integer или любого его предка (Number, Object)\npublic static void addNumbers(List<? super Integer> list) {\n    for (int i = 1; i <= 5; i++) {\n        list.add(i);\n    }\n}\n\nArrayList<Integer> ints = new ArrayList<>();\nArrayList<Number> nums = new ArrayList<>();\n\naddNumbers(ints); // OK\naddNumbers(nums); // OK — Number является предком Integer\n\nSystem.out.println(ints); // [1, 2, 3, 4, 5]\nSystem.out.println(nums); // [1, 2, 3, 4, 5]' },
        { type: 'tip', value: 'Правило PECS: Producer Extends, Consumer Super. Если метод читает из коллекции (Producer) — используй ? extends. Если записывает (Consumer) — ? super.' }
      ]
    },
    {
      id: 6, title: 'Практика: Generic стек', type: 'practice', difficulty: 'medium',
      description: 'Реализуй универсальный стек (Stack) как generic класс, который работает с любым типом данных.',
      requirements: [
        'Создай класс Stack<T> с полем ArrayList<T> для хранения',
        'Реализуй метод push(T item) — положить элемент',
        'Реализуй метод pop() — забрать верхний элемент (и удалить)',
        'Реализуй метод peek() — посмотреть верхний элемент (не удалять)',
        'Реализуй метод isEmpty() и size()',
        'Протестируй со стеком строк и стеком чисел'
      ],
      expectedOutput: '=== Стек строк ===\nДобавляем: Java\nДобавляем: Python\nДобавляем: Go\nВерхний: Go\nРазмер: 3\nИзвлекаем: Go\nИзвлекаем: Python\nОсталось: 1\n\n=== Стек чисел ===\nДобавляем числа: 10 20 30\nСумма извлечённых: 60',
      hint: 'В ArrayList последний элемент — вершина стека. pop() — это list.remove(list.size() - 1), peek() — list.get(list.size() - 1).',
      solution: 'import java.util.ArrayList;\n\npublic class Stack<T> {\n    private ArrayList<T> data = new ArrayList<>();\n\n    public void push(T item) {\n        data.add(item);\n    }\n\n    public T pop() {\n        if (isEmpty()) throw new RuntimeException("Стек пуст!");\n        return data.remove(data.size() - 1);\n    }\n\n    public T peek() {\n        if (isEmpty()) throw new RuntimeException("Стек пуст!");\n        return data.get(data.size() - 1);\n    }\n\n    public boolean isEmpty() {\n        return data.isEmpty();\n    }\n\n    public int size() {\n        return data.size();\n    }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        System.out.println("=== Стек строк ===");\n        Stack<String> stringStack = new Stack<>();\n        String[] langs = {"Java", "Python", "Go"};\n        for (String lang : langs) {\n            System.out.println("Добавляем: " + lang);\n            stringStack.push(lang);\n        }\n        System.out.println("Верхний: " + stringStack.peek());\n        System.out.println("Размер: " + stringStack.size());\n        System.out.println("Извлекаем: " + stringStack.pop());\n        System.out.println("Извлекаем: " + stringStack.pop());\n        System.out.println("Осталось: " + stringStack.size());\n\n        System.out.println();\n        System.out.println("=== Стек чисел ===");\n        Stack<Integer> numStack = new Stack<>();\n        System.out.println("Добавляем числа: 10 20 30");\n        numStack.push(10);\n        numStack.push(20);\n        numStack.push(30);\n        int sum = 0;\n        while (!numStack.isEmpty()) {\n            sum += numStack.pop();\n        }\n        System.out.println("Сумма извлечённых: " + sum);\n    }\n}',
      explanation: 'Generic класс Stack<T> работает с любым типом данных. Один класс — бесконечное применение. ArrayList хранит элементы, последний из которых является вершиной стека. Благодаря дженерику компилятор проверяет, что в Stack<String> нельзя добавить число.'
    },
    {
      id: 7, title: 'Практика: Утилитный класс', type: 'practice', difficulty: 'hard',
      description: 'Создай класс CollectionUtils с набором generic методов для работы с коллекциями.',
      requirements: [
        'Метод <T> printAll(List<T> list) — вывести все элементы через запятую',
        'Метод <T extends Comparable<T>> T findMin(List<T> list) — найти минимум',
        'Метод <T extends Comparable<T>> T findMax(List<T> list) — найти максимум',
        'Метод <T> List<T> filter(List<T> list, T element) — вернуть список без указанного элемента',
        'Метод <T> void swap(List<T> list, int i, int j) — поменять элементы местами',
        'Протестируй все методы со списками строк и чисел'
      ],
      expectedOutput: 'Строки: Java, Python, Go, Rust, Kotlin\nМин: Go\nМакс: Rust\nБез Python: [Java, Go, Rust, Kotlin]\nПосле swap(0,4): [Kotlin, Python, Go, Rust, Java]\n\nЧисла: 5, 3, 8, 1, 9, 2\nМин: 1\nМакс: 9\nБез 8: [5, 3, 1, 9, 2]',
      hint: 'filter() должен создать новый список и добавить туда все элементы кроме указанного. Используй метод equals() для сравнения.',
      solution: 'import java.util.ArrayList;\nimport java.util.List;\n\npublic class CollectionUtils {\n    public static <T> void printAll(List<T> list) {\n        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < list.size(); i++) {\n            sb.append(list.get(i));\n            if (i < list.size() - 1) sb.append(", ");\n        }\n        System.out.println(sb.toString());\n    }\n\n    public static <T extends Comparable<T>> T findMin(List<T> list) {\n        T min = list.get(0);\n        for (T item : list) {\n            if (item.compareTo(min) < 0) min = item;\n        }\n        return min;\n    }\n\n    public static <T extends Comparable<T>> T findMax(List<T> list) {\n        T max = list.get(0);\n        for (T item : list) {\n            if (item.compareTo(max) > 0) max = item;\n        }\n        return max;\n    }\n\n    public static <T> List<T> filter(List<T> list, T element) {\n        List<T> result = new ArrayList<>();\n        for (T item : list) {\n            if (!item.equals(element)) result.add(item);\n        }\n        return result;\n    }\n\n    public static <T> void swap(List<T> list, int i, int j) {\n        T temp = list.get(i);\n        list.set(i, list.get(j));\n        list.set(j, temp);\n    }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        List<String> langs = new ArrayList<>();\n        langs.add("Java"); langs.add("Python"); langs.add("Go");\n        langs.add("Rust"); langs.add("Kotlin");\n\n        System.out.print("Строки: ");\n        CollectionUtils.printAll(langs);\n        System.out.println("Мин: " + CollectionUtils.findMin(langs));\n        System.out.println("Макс: " + CollectionUtils.findMax(langs));\n        System.out.println("Без Python: " + CollectionUtils.filter(langs, "Python"));\n        CollectionUtils.swap(langs, 0, 4);\n        System.out.print("После swap(0,4): ");\n        System.out.println(langs);\n\n        System.out.println();\n        List<Integer> nums = new ArrayList<>();\n        nums.add(5); nums.add(3); nums.add(8); nums.add(1); nums.add(9); nums.add(2);\n        System.out.print("Числа: ");\n        CollectionUtils.printAll(nums);\n        System.out.println("Мин: " + CollectionUtils.findMin(nums));\n        System.out.println("Макс: " + CollectionUtils.findMax(nums));\n        System.out.println("Без 8: " + CollectionUtils.filter(nums, 8));\n    }\n}',
      explanation: 'Generic методы с <T extends Comparable<T>> работают с любым типом, который можно сравнивать. Это и String (по алфавиту), и Integer (по числу), и многие другие. Один класс CollectionUtils заменяет множество специализированных утилит.'
    }
  ]
}
