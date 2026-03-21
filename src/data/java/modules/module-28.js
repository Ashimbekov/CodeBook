export default {
  id: 28,
  title: 'TreeMap и TreeSet',
  description: 'Изучаем отсортированные коллекции TreeMap и TreeSet — данные всегда в порядке',
  lessons: [
    {
      id: 1, title: 'Отсортированные коллекции', type: 'theory',
      content: [
        { type: 'text', value: 'TreeMap и TreeSet — это коллекции, которые всегда хранят элементы в отсортированном порядке. Не нужно вручную сортировать — коллекция делает это сама при каждом добавлении.' },
        { type: 'tip', value: 'Представь библиотеку: если это обычный HashSet/HashMap, книги стоят как попало. Если это TreeSet/TreeMap — книги всегда расставлены по алфавиту. Как только ты ставишь новую книгу, она сразу встаёт на правильное место.' },
        { type: 'heading', value: 'TreeSet vs HashSet' },
        { type: 'code', language: 'java', value: 'import java.util.HashSet;\nimport java.util.TreeSet;\n\npublic class Main {\n    public static void main(String[] args) {\n        HashSet<String> hashSet = new HashSet<>();\n        hashSet.add("Банан");\n        hashSet.add("Яблоко");\n        hashSet.add("Апельсин");\n        System.out.println("HashSet: " + hashSet);\n        // Непредсказуемый порядок: [Банан, Апельсин, Яблоко]\n\n        TreeSet<String> treeSet = new TreeSet<>();\n        treeSet.add("Банан");\n        treeSet.add("Яблоко");\n        treeSet.add("Апельсин");\n        System.out.println("TreeSet: " + treeSet);\n        // Всегда по алфавиту: [Апельсин, Банан, Яблоко]\n    }\n}' },
        { type: 'heading', value: 'Цена сортировки' },
        { type: 'list', items: [
          'HashSet/HashMap: add/remove/contains работают за O(1) — мгновенно',
          'TreeSet/TreeMap: add/remove/contains работают за O(log n) — чуть медленнее',
          'Зато TreeSet/TreeMap всегда отсортированы без дополнительных действий',
          'Для миллиона элементов: HashSet ~1 шаг, TreeSet ~20 шагов — всё равно быстро'
        ]},
        { type: 'note', value: 'Используй TreeSet/TreeMap когда тебе нужно, чтобы данные всегда были отсортированы. Используй Hash-версии когда важна скорость, а порядок не важен.' }
      ]
    },
    {
      id: 2, title: 'TreeMap — основы', type: 'theory',
      content: [
        { type: 'text', value: 'TreeMap — это HashMap, который всегда держит ключи отсортированными. Все методы те же что у HashMap, но плюс дополнительные методы для навигации.' },
        { type: 'heading', value: 'Базовые операции TreeMap' },
        { type: 'code', language: 'java', value: 'import java.util.TreeMap;\n\npublic class Main {\n    public static void main(String[] args) {\n        TreeMap<String, Integer> scores = new TreeMap<>();\n\n        scores.put("Пётр", 85);\n        scores.put("Анна", 92);\n        scores.put("Виктор", 78);\n        scores.put("Дмитрий", 95);\n\n        // Автоматически отсортировано по ключу (алфавит)\n        System.out.println(scores);\n        // {Анна=92, Виктор=78, Дмитрий=95, Пётр=85}\n\n        // Стандартные операции работают как в HashMap\n        System.out.println(scores.get("Анна")); // 92\n        System.out.println(scores.size()); // 4\n        System.out.println(scores.containsKey("Виктор")); // true\n    }\n}' },
        { type: 'heading', value: 'Специальные методы TreeMap' },
        { type: 'code', language: 'java', value: 'TreeMap<Integer, String> map = new TreeMap<>();\nmap.put(5, "Пять");\nmap.put(2, "Два");\nmap.put(8, "Восемь");\nmap.put(1, "Один");\nmap.put(6, "Шесть");\n\nSystem.out.println("Первый ключ: " + map.firstKey()); // 1\nSystem.out.println("Последний ключ: " + map.lastKey()); // 8\n\n// Наибольший ключ <= 5\nSystem.out.println("floorKey(5): " + map.floorKey(5)); // 5\n// Наибольший ключ < 5\nSystem.out.println("lowerKey(5): " + map.lowerKey(5)); // 2\n\n// Наименьший ключ >= 5\nSystem.out.println("ceilingKey(5): " + map.ceilingKey(5)); // 5\n// Наименьший ключ > 5\nSystem.out.println("higherKey(5): " + map.higherKey(5)); // 6' },
        { type: 'heading', value: 'Подкарты (subMap, headMap, tailMap)' },
        { type: 'code', language: 'java', value: 'TreeMap<Integer, String> map = new TreeMap<>();\nmap.put(1, "A"); map.put(2, "B"); map.put(3, "C");\nmap.put(4, "D"); map.put(5, "E");\n\n// Часть карты от ключа 2 до 4 (4 не включается)\nSystem.out.println("subMap(2,4): " + map.subMap(2, 4)); // {2=B, 3=C}\n\n// Всё до ключа 3 (3 не включается)\nSystem.out.println("headMap(3): " + map.headMap(3)); // {1=A, 2=B}\n\n// Всё начиная с ключа 3 (3 включается)\nSystem.out.println("tailMap(3): " + map.tailMap(3)); // {3=C, 4=D, 5=E}' }
      ]
    },
    {
      id: 3, title: 'TreeSet — основы', type: 'theory',
      content: [
        { type: 'text', value: 'TreeSet — это HashSet, который всегда держит элементы отсортированными. Отлично подходит для поддержания упорядоченного набора уникальных значений.' },
        { type: 'heading', value: 'Базовые операции TreeSet' },
        { type: 'code', language: 'java', value: 'import java.util.TreeSet;\n\npublic class Main {\n    public static void main(String[] args) {\n        TreeSet<Integer> set = new TreeSet<>();\n\n        set.add(5);\n        set.add(2);\n        set.add(8);\n        set.add(1);\n        set.add(8); // дубликат — не добавится\n\n        System.out.println(set); // [1, 2, 5, 8] — всегда отсортировано!\n\n        System.out.println("Первый: " + set.first());  // 1\n        System.out.println("Последний: " + set.last()); // 8\n        System.out.println("Содержит 5: " + set.contains(5)); // true\n    }\n}' },
        { type: 'heading', value: 'Специальные методы TreeSet' },
        { type: 'code', language: 'java', value: 'TreeSet<Integer> set = new TreeSet<>();\nset.add(10); set.add(20); set.add(30); set.add(40); set.add(50);\n\n// Наибольший <= 25\nSystem.out.println("floor(25): " + set.floor(25));     // 20\n// Наибольший < 25\nSystem.out.println("lower(25): " + set.lower(25));     // 20\n// Наименьший >= 25\nSystem.out.println("ceiling(25): " + set.ceiling(25)); // 30\n// Наименьший > 25\nSystem.out.println("higher(25): " + set.higher(25));   // 30\n\n// Часть набора\nSystem.out.println("subSet(20,40): " + set.subSet(20, 40)); // [20, 30]\nSystem.out.println("headSet(30): " + set.headSet(30));       // [10, 20]\nSystem.out.println("tailSet(30): " + set.tailSet(30));       // [30, 40, 50]' },
        { type: 'heading', value: 'Descending — в обратном порядке' },
        { type: 'code', language: 'java', value: 'TreeSet<String> names = new TreeSet<>();\nnames.add("Виктор");\nnames.add("Анна");\nnames.add("Дмитрий");\nnames.add("Борис");\n\nSystem.out.println("По возрастанию: " + names);\n// [Анна, Борис, Виктор, Дмитрий]\n\nSystem.out.println("По убыванию: " + names.descendingSet());\n// [Дмитрий, Виктор, Борис, Анна]' }
      ]
    },
    {
      id: 4, title: 'Натуральный порядок', type: 'theory',
      content: [
        { type: 'text', value: 'TreeSet и TreeMap знают, как сортировать числа (по возрастанию), строки (по алфавиту) и другие стандартные типы. Это называется "натуральный порядок" (natural ordering).' },
        { type: 'heading', value: 'Натуральный порядок встроенных типов' },
        { type: 'code', language: 'java', value: 'import java.util.TreeSet;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Числа — по возрастанию\n        TreeSet<Integer> nums = new TreeSet<>();\n        nums.add(100); nums.add(5); nums.add(50); nums.add(1);\n        System.out.println("Числа: " + nums); // [1, 5, 50, 100]\n\n        // Строки — по алфавиту (лексикографически)\n        TreeSet<String> words = new TreeSet<>();\n        words.add("яблоко"); words.add("Банан"); words.add("апельсин");\n        System.out.println("Слова: " + words);\n        // Важно: заглавные буквы идут ПЕРЕД строчными в Unicode!\n        // [Банан, апельсин, яблоко]\n\n        // Символы — по коду Unicode\n        TreeSet<Character> chars = new TreeSet<>();\n        chars.add(\'z\'); chars.add(\'a\'); chars.add(\'m\');\n        System.out.println("Символы: " + chars); // [a, m, z]\n    }\n}' },
        { type: 'warning', value: 'Строки сортируются лексикографически по Unicode. Заглавные буквы (A-Z, код 65-90) идут перед строчными (a-z, код 97-122). "Банан" будет перед "апельсин", потому что "Б" (1041) > "а" (1072) — нет! "Б" = 1041, "а" = 1072, значит Б < а.' },
        { type: 'code', language: 'java', value: '// Чтобы сортировать строки без учёта регистра:\nTreeSet<String> caseInsensitive = new TreeSet<>(String.CASE_INSENSITIVE_ORDER);\ncaseInsensitive.add("Банан");\ncaseInsensitive.add("апельсин");\ncaseInsensitive.add("ЯБЛОКО");\nSystem.out.println(caseInsensitive); // [апельсин, Банан, ЯБЛОКО]' }
      ]
    },
    {
      id: 5, title: 'Кастомный Comparator для Tree-коллекций', type: 'theory',
      content: [
        { type: 'text', value: 'Что если нужна нестандартная сортировка? Например, числа по убыванию, или строки по длине? Для этого передаём Comparator в конструктор.' },
        { type: 'heading', value: 'Comparator для TreeSet' },
        { type: 'code', language: 'java', value: 'import java.util.Comparator;\nimport java.util.TreeSet;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Числа по убыванию\n        TreeSet<Integer> descending = new TreeSet<>(Comparator.reverseOrder());\n        descending.add(5);\n        descending.add(2);\n        descending.add(8);\n        descending.add(1);\n        System.out.println("По убыванию: " + descending); // [8, 5, 2, 1]\n\n        // Строки по длине\n        TreeSet<String> byLength = new TreeSet<>(\n            Comparator.comparingInt(String::length)\n        );\n        byLength.add("Кот");\n        byLength.add("Слон");\n        byLength.add("Ёж");\n        System.out.println("По длине: " + byLength); // [Ёж, Кот, Слон]\n    }\n}' },
        { type: 'heading', value: 'Comparator для TreeMap' },
        { type: 'code', language: 'java', value: 'import java.util.Comparator;\nimport java.util.TreeMap;\n\n// TreeMap с ключами Integer по убыванию\nTreeMap<Integer, String> map = new TreeMap<>(Comparator.reverseOrder());\nmap.put(1, "Один");\nmap.put(3, "Три");\nmap.put(2, "Два");\n\nSystem.out.println(map);\n// {3=Три, 2=Два, 1=Один}' },
        { type: 'heading', value: 'Сортировка по нескольким полям' },
        { type: 'code', language: 'java', value: '// Сначала по длине, потом по алфавиту\nTreeSet<String> multiSort = new TreeSet<>(\n    Comparator.comparingInt(String::length)\n              .thenComparing(Comparator.naturalOrder())\n);\n\nmultiSort.add("банан");\nmultiSort.add("ёж");\nmultiSort.add("кот");\nmultiSort.add("яблоко");\nmultiSort.add("кит");\n\nSystem.out.println(multiSort);\n// [ёж, кит, кот, банан, яблоко]\n// Сначала по длине (2, 3, 3, 5, 6), при одинаковой длине — по алфавиту' }
      ]
    },
    {
      id: 6, title: 'Практика: Рейтинг студентов', type: 'practice', difficulty: 'medium',
      description: 'Создай программу, которая хранит оценки студентов в TreeMap, автоматически поддерживает их отсортированными и выводит различную статистику.',
      requirements: [
        'Создай TreeMap<String, Integer> с именами и оценками студентов',
        'Добавь минимум 5 студентов с оценками',
        'Выведи весь список (он будет отсортирован по имени)',
        'Найди студента с наибольшим именем по алфавиту (lastKey)',
        'Найди студентов с оценкой выше 80',
        'Добавь нового студента и покажи, что список остался отсортированным'
      ],
      expectedOutput: 'Рейтинг студентов:\nАнна: 92\nБорис: 75\nВиктор: 88\nДмитрий: 65\nЕлена: 95\n\nПоследний по алфавиту: Елена\nСтуденты с оценкой > 80:\n  Анна: 92\n  Виктор: 88\n  Елена: 95\n\nДобавляем Алексея (83)...\nОбновлённый список:\nАлексей: 83\nАнна: 92\nБорис: 75\nВиктор: 88\nДмитрий: 65\nЕлена: 95',
      hint: 'Для поиска студентов с оценкой > 80 используй entrySet() и проверяй getValue() > 80.',
      solution: 'import java.util.Map;\nimport java.util.TreeMap;\n\npublic class Main {\n    public static void main(String[] args) {\n        TreeMap<String, Integer> students = new TreeMap<>();\n        students.put("Борис", 75);\n        students.put("Елена", 95);\n        students.put("Анна", 92);\n        students.put("Дмитрий", 65);\n        students.put("Виктор", 88);\n\n        System.out.println("Рейтинг студентов:");\n        for (Map.Entry<String, Integer> e : students.entrySet()) {\n            System.out.println(e.getKey() + ": " + e.getValue());\n        }\n\n        System.out.println();\n        System.out.println("Последний по алфавиту: " + students.lastKey());\n\n        System.out.println("Студенты с оценкой > 80:");\n        for (Map.Entry<String, Integer> e : students.entrySet()) {\n            if (e.getValue() > 80) {\n                System.out.println("  " + e.getKey() + ": " + e.getValue());\n            }\n        }\n\n        System.out.println();\n        System.out.println("Добавляем Алексея (83)...");\n        students.put("Алексей", 83);\n\n        System.out.println("Обновлённый список:");\n        for (Map.Entry<String, Integer> e : students.entrySet()) {\n            System.out.println(e.getKey() + ": " + e.getValue());\n        }\n    }\n}',
      explanation: 'TreeMap автоматически поддерживает ключи (имена) в алфавитном порядке. Когда мы добавляем "Алексей", он сам встаёт на первое место — никакой ручной сортировки не нужно. lastKey() и firstKey() — удобные методы для получения крайних ключей.'
    }
  ]
}
