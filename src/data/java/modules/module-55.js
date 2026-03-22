export default {
  id: 55,
  title: 'Практикум: Коллекции',
  description: 'Практические задачи на работу с коллекциями Java: ArrayList, HashMap, LinkedHashMap, HashSet и стандартные алгоритмы — сортировка, поиск, группировка, объединение',
  lessons: [
    {
      id: 1,
      title: 'Задача: Удаление дубликатов из ArrayList',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши метод, который удаляет все дублирующиеся элементы из списка ArrayList и возвращает новый список с уникальными элементами, сохраняя исходный порядок.',
      requirements: [
        'Метод removeDuplicates(List<Integer> list) возвращает List<Integer>',
        'Порядок элементов должен сохраняться (первое вхождение остаётся)',
        'Исходный список не изменяется',
        'Реализуй два способа: через LinkedHashSet и через stream().distinct()',
        'Проверь на списке с целыми числами и на списке строк',
        'Метод должен работать с пустым списком'
      ],
      expectedOutput: 'Исходный: [1, 2, 3, 2, 4, 1, 5, 3]\nБез дубликатов: [1, 2, 3, 4, 5]\nИсходный (строки): [яблоко, банан, яблоко, вишня, банан]\nБез дубликатов: [яблоко, банан, вишня]\nПустой список: []',
      hint: 'LinkedHashSet сохраняет порядок вставки и автоматически отбрасывает дубли. new LinkedHashSet<>(list) создаёт множество из списка. new ArrayList<>(set) конвертирует обратно. Или list.stream().distinct().collect(Collectors.toList()).',
      solution: 'import java.util.*;\nimport java.util.stream.Collectors;\n\npublic class RemoveDuplicates {\n\n    // Способ 1: через LinkedHashSet\n    public static <T> List<T> removeDuplicatesViaSet(List<T> list) {\n        return new ArrayList<>(new LinkedHashSet<>(list));\n    }\n\n    // Способ 2: через Stream API\n    public static <T> List<T> removeDuplicatesViaStream(List<T> list) {\n        return list.stream()\n                .distinct()\n                .collect(Collectors.toList());\n    }\n\n    public static void main(String[] args) {\n        List<Integer> numbers = new ArrayList<>(Arrays.asList(1, 2, 3, 2, 4, 1, 5, 3));\n        System.out.println("Исходный: " + numbers);\n        System.out.println("Без дубликатов: " + removeDuplicatesViaSet(numbers));\n        System.out.println("Исходный после: " + numbers); // не изменился\n\n        List<String> fruits = new ArrayList<>(Arrays.asList("яблоко", "банан", "яблоко", "вишня", "банан"));\n        System.out.println("Исходный (строки): " + fruits);\n        System.out.println("Без дубликатов: " + removeDuplicatesViaStream(fruits));\n\n        List<Integer> empty = new ArrayList<>();\n        System.out.println("Пустой список: " + removeDuplicatesViaSet(empty));\n    }\n}',
      explanation: 'LinkedHashSet — это хэш-множество, которое запоминает порядок добавления элементов. При создании LinkedHashSet из списка все дубликаты отбрасываются (Set не допускает повторений), а порядок первых вхождений сохраняется. Преобразование: List → LinkedHashSet → ArrayList — классический идиом Java. Метод stream().distinct() работает аналогично: использует equals() для определения дублей и сохраняет первое вхождение. Generics <T> делают метод универсальным — работает с любым типом.'
    },
    {
      id: 2,
      title: 'Задача: Счётчик частоты слов (HashMap)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши программу, которая подсчитывает частоту встречаемости каждого слова в тексте, используя HashMap. Слова должны быть нечувствительны к регистру.',
      requirements: [
        'Метод wordFrequency(String text) возвращает Map<String, Integer>',
        'Разбивай текст по пробелам и знакам препинания',
        'Приводи слова к нижнему регистру',
        'Пустые строки после разбивки игнорируй',
        'Метод printTopN(Map<String, Integer> freq, int n) — вывести N самых частых слов',
        'Отсортируй вывод по убыванию частоты'
      ],
      expectedOutput: 'Частоты слов:\nслово -> 3\nпривет -> 2\nмир -> 2\nкак -> 1\nдела -> 1\n---\nТоп-3:\nслово: 3\nпривет: 2\nмир: 2',
      hint: 'Для разбивки используй text.split("[\\\\s.,!?;:]+"). getOrDefault(key, 0) + 1 обновляет счётчик. Или Map.merge(word, 1, Integer::sum). Для сортировки: entrySet().stream().sorted(Map.Entry.comparingByValue(Comparator.reverseOrder())).',
      solution: 'import java.util.*;\nimport java.util.stream.Collectors;\n\npublic class WordFrequency {\n\n    public static Map<String, Integer> wordFrequency(String text) {\n        Map<String, Integer> frequency = new HashMap<>();\n        String[] words = text.split("[\\\\s.,!?;:]+");\n        for (String word : words) {\n            if (word.isBlank()) continue;\n            String normalized = word.toLowerCase();\n            frequency.merge(normalized, 1, Integer::sum);\n        }\n        return frequency;\n    }\n\n    public static void printTopN(Map<String, Integer> freq, int n) {\n        System.out.println("Топ-" + n + ":");\n        freq.entrySet().stream()\n                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))\n                .limit(n)\n                .forEach(e -> System.out.println(e.getKey() + ": " + e.getValue()));\n    }\n\n    public static void main(String[] args) {\n        String text = "Привет мир! Привет слово слово слово мир как дела";\n        Map<String, Integer> freq = wordFrequency(text);\n\n        System.out.println("Частоты слов:");\n        freq.entrySet().stream()\n                .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))\n                .forEach(e -> System.out.println(e.getKey() + " -> " + e.getValue()));\n        System.out.println("---");\n\n        printTopN(freq, 3);\n    }\n}',
      explanation: 'Map.merge(key, 1, Integer::sum) — это атомарная операция: если ключа нет — кладёт 1, если есть — применяет функцию (сложение с существующим значением). Это лаконичнее чем getOrDefault + put. Map.Entry.comparingByValue() создаёт Comparator для сортировки по значению. Comparator.reverseOrder() переворачивает порядок (по убыванию). limit(n) берёт только первые n элементов стрима. Цепочка sorted().limit().forEach() — типичный Stream API паттерн.'
    },
    {
      id: 3,
      title: 'Задача: Уникальные элементы двух списков',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши методы для нахождения элементов, которые присутствуют только в одном из двух списков, а также их пересечения.',
      requirements: [
        'Метод onlyInFirst(List<T> a, List<T> b) — элементы только в первом списке',
        'Метод onlyInSecond(List<T> a, List<T> b) — элементы только во втором списке',
        'Метод intersection(List<T> a, List<T> b) — элементы в обоих списках',
        'Метод symmetricDifference(List<T> a, List<T> b) — элементы только в одном из двух',
        'Дубликаты внутри одного списка не учитываются (работай с множествами)',
        'Порядок в результате не важен'
      ],
      expectedOutput: 'Список A: [1, 2, 3, 4, 5]\nСписок B: [3, 4, 5, 6, 7]\nТолько в A: [1, 2]\nТолько в B: [6, 7]\nПересечение: [3, 4, 5]\nСимметричная разность: [1, 2, 6, 7]',
      hint: 'Преобрази списки в HashSet. Для "только в A": создай копию Set(A), вызови removeAll(B). Для пересечения: копия Set(A), вызови retainAll(B). Симметричная разность = onlyInFirst + onlyInSecond.',
      solution: 'import java.util.*;\nimport java.util.stream.Collectors;\nimport java.util.stream.Stream;\n\npublic class SetOperations {\n\n    public static <T> List<T> onlyInFirst(List<T> a, List<T> b) {\n        Set<T> setA = new HashSet<>(a);\n        Set<T> setB = new HashSet<>(b);\n        setA.removeAll(setB);\n        return new ArrayList<>(setA);\n    }\n\n    public static <T> List<T> onlyInSecond(List<T> a, List<T> b) {\n        return onlyInFirst(b, a);\n    }\n\n    public static <T> List<T> intersection(List<T> a, List<T> b) {\n        Set<T> setA = new HashSet<>(a);\n        Set<T> setB = new HashSet<>(b);\n        setA.retainAll(setB);\n        return new ArrayList<>(setA);\n    }\n\n    public static <T> List<T> symmetricDifference(List<T> a, List<T> b) {\n        List<T> onlyA = onlyInFirst(a, b);\n        List<T> onlyB = onlyInSecond(a, b);\n        return Stream.concat(onlyA.stream(), onlyB.stream())\n                .collect(Collectors.toList());\n    }\n\n    public static void main(String[] args) {\n        List<Integer> listA = Arrays.asList(1, 2, 3, 4, 5);\n        List<Integer> listB = Arrays.asList(3, 4, 5, 6, 7);\n\n        System.out.println("Список A: " + listA);\n        System.out.println("Список B: " + listB);\n        System.out.println("Только в A: " + onlyInFirst(listA, listB));\n        System.out.println("Только в B: " + onlyInSecond(listA, listB));\n        System.out.println("Пересечение: " + intersection(listA, listB));\n        System.out.println("Симметричная разность: " + symmetricDifference(listA, listB));\n    }\n}',
      explanation: 'HashSet — идеальная структура для операций над множествами. removeAll(collection) удаляет все элементы, присутствующие в другой коллекции — это вычитание множеств (A \\ B). retainAll(collection) оставляет только элементы, присутствующие в другой коллекции — это пересечение (A ∩ B). Важно: методы removeAll и retainAll изменяют множество на месте — поэтому мы сначала делаем копию new HashSet<>(list), чтобы не изменять исходные данные. Stream.concat() объединяет два стрима в один.'
    },
    {
      id: 4,
      title: 'Задача: Группировка студентов по оценке',
      type: 'practice',
      difficulty: 'medium',
      description: 'Сгруппируй список студентов по их буквенной оценке (A, B, C, D, F) используя HashMap<String, List<String>>. Буквенная оценка вычисляется из числовой.',
      requirements: [
        'Класс Student с полями name и gpa (double)',
        'Метод getLetterGrade(double gpa): A(>=4.5), B(>=3.5), C(>=2.5), D(>=1.5), F иначе',
        'Метод groupByGrade(List<Student> students) возвращает Map<String, List<String>>',
        'Ключ — буквенная оценка, значение — список имён студентов',
        'Сортируй имена внутри каждой группы по алфавиту',
        'Выведи группы в порядке A, B, C, D, F'
      ],
      expectedOutput: 'Группа A: [Анна, Дмитрий]\nГруппа B: [Иван, Мария]\nГруппа C: [Олег]\nГруппа D: []\nГруппа F: [Петр]',
      hint: 'Используй computeIfAbsent(grade, k -> new ArrayList<>()).add(name) чтобы добавить студента в группу. Или Collectors.groupingBy() с последующим преобразованием. TreeMap автоматически сортирует ключи по алфавиту.',
      solution: 'import java.util.*;\nimport java.util.stream.Collectors;\n\npublic class StudentGrouping {\n\n    static class Student {\n        String name;\n        double gpa;\n\n        Student(String name, double gpa) {\n            this.name = name;\n            this.gpa = gpa;\n        }\n    }\n\n    public static String getLetterGrade(double gpa) {\n        if (gpa >= 4.5) return "A";\n        if (gpa >= 3.5) return "B";\n        if (gpa >= 2.5) return "C";\n        if (gpa >= 1.5) return "D";\n        return "F";\n    }\n\n    public static Map<String, List<String>> groupByGrade(List<Student> students) {\n        Map<String, List<String>> groups = new HashMap<>();\n        // Инициализируем все группы\n        for (String grade : Arrays.asList("A", "B", "C", "D", "F")) {\n            groups.put(grade, new ArrayList<>());\n        }\n\n        for (Student s : students) {\n            String grade = getLetterGrade(s.gpa);\n            groups.get(grade).add(s.name);\n        }\n\n        // Сортируем имена в каждой группе\n        groups.values().forEach(Collections::sort);\n        return groups;\n    }\n\n    // Альтернатива через Stream API\n    public static Map<String, List<String>> groupByGradeStream(List<Student> students) {\n        return students.stream()\n                .collect(Collectors.groupingBy(\n                        s -> getLetterGrade(s.gpa),\n                        Collectors.mapping(s -> s.name,\n                                Collectors.collectingAndThen(\n                                        Collectors.toList(),\n                                        list -> { Collections.sort(list); return list; }))));\n    }\n\n    public static void main(String[] args) {\n        List<Student> students = Arrays.asList(\n                new Student("Иван", 3.8),\n                new Student("Мария", 3.7),\n                new Student("Анна", 4.9),\n                new Student("Дмитрий", 4.6),\n                new Student("Олег", 2.8),\n                new Student("Петр", 1.2)\n        );\n\n        Map<String, List<String>> groups = groupByGrade(students);\n\n        for (String grade : Arrays.asList("A", "B", "C", "D", "F")) {\n            System.out.println("Группа " + grade + ": " + groups.get(grade));\n        }\n    }\n}',
      explanation: 'computeIfAbsent(key, mappingFn) — атомарная операция: если ключа нет — создаёт значение через mappingFn и возвращает его, если есть — просто возвращает существующее. Идеально для паттерна "группировка". Альтернатива — Collectors.groupingBy() со Stream API — более декларативный подход. Collectors.mapping() трансформирует элементы перед сборкой (Student → String). collectingAndThen() позволяет постобработать результат коллектора (сортировку). Инициализация всех групп заранее гарантирует, что пустые группы тоже присутствуют в результате.'
    },
    {
      id: 5,
      title: 'Задача: Телефонный справочник',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй телефонный справочник с операциями добавления, поиска и удаления контактов. Один человек может иметь несколько телефонов.',
      requirements: [
        'Класс PhoneBook, хранящий данные в Map<String, List<String>>',
        'Метод addContact(String name, String phone) — добавить телефон к контакту',
        'Метод findPhones(String name) — найти все телефоны по имени',
        'Метод findByPhone(String phone) — найти имя по номеру телефона',
        'Метод removeContact(String name) — удалить контакт полностью',
        'Метод removePhone(String name, String phone) — удалить один телефон',
        'Метод printAll() — вывести весь справочник отсортированно по имени'
      ],
      expectedOutput: 'Контакты:\nАнна: [+7-111-222, +7-333-444]\nИван: [+7-555-666]\nМария: [+7-777-888, +7-999-000]\n---\nТелефоны Анны: [+7-111-222, +7-333-444]\nВладелец +7-555-666: Иван\nПосле удаления Ивана:\nАнна: [+7-111-222, +7-333-444]\nМария: [+7-777-888, +7-999-000]',
      hint: 'Используй TreeMap<String, List<String>> для автоматической сортировки по имени. computeIfAbsent(name, k -> new ArrayList<>()).add(phone) удобно для добавления. Для поиска по номеру перебирай entrySet().',
      solution: 'import java.util.*;\n\npublic class PhoneBook {\n    private Map<String, List<String>> contacts;\n\n    public PhoneBook() {\n        this.contacts = new TreeMap<>(); // TreeMap сортирует по ключу\n    }\n\n    public void addContact(String name, String phone) {\n        contacts.computeIfAbsent(name, k -> new ArrayList<>()).add(phone);\n    }\n\n    public List<String> findPhones(String name) {\n        return contacts.getOrDefault(name, Collections.emptyList());\n    }\n\n    public String findByPhone(String phone) {\n        for (Map.Entry<String, List<String>> entry : contacts.entrySet()) {\n            if (entry.getValue().contains(phone)) {\n                return entry.getKey();\n            }\n        }\n        return null;\n    }\n\n    public boolean removeContact(String name) {\n        return contacts.remove(name) != null;\n    }\n\n    public boolean removePhone(String name, String phone) {\n        List<String> phones = contacts.get(name);\n        if (phones == null) return false;\n        boolean removed = phones.remove(phone);\n        if (phones.isEmpty()) {\n            contacts.remove(name); // удаляем контакт если телефонов не осталось\n        }\n        return removed;\n    }\n\n    public void printAll() {\n        contacts.forEach((name, phones) ->\n                System.out.println(name + ": " + phones));\n    }\n\n    public static void main(String[] args) {\n        PhoneBook book = new PhoneBook();\n        book.addContact("Иван", "+7-555-666");\n        book.addContact("Анна", "+7-111-222");\n        book.addContact("Анна", "+7-333-444");\n        book.addContact("Мария", "+7-777-888");\n        book.addContact("Мария", "+7-999-000");\n\n        System.out.println("Контакты:");\n        book.printAll();\n        System.out.println("---");\n\n        System.out.println("Телефоны Анны: " + book.findPhones("Анна"));\n        System.out.println("Владелец +7-555-666: " + book.findByPhone("+7-555-666"));\n\n        book.removeContact("Иван");\n        System.out.println("После удаления Ивана:");\n        book.printAll();\n    }\n}',
      explanation: 'TreeMap хранит ключи в отсортированном порядке (по умолчанию — алфавитном для String). Это лучше HashMap когда нужна сортировка. Collections.emptyList() возвращает неизменяемый пустой список — это лучше чем возвращать null, т.к. вызывающий код может безопасно итерировать по результату без проверки на null. Map.Entry<K, V> позволяет одновременно получить ключ и значение при итерации по entrySet(). После удаления последнего телефона контакт удаляется — хорошая практика поддерживать "чистоту" данных.'
    },
    {
      id: 6,
      title: 'Задача: Сортировка объектов по нескольким полям',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай список сотрудников и реализуй их сортировку по нескольким критериям: сначала по отделу (алфавит), затем по зарплате (убывание), затем по имени.',
      requirements: [
        'Класс Employee с полями name, department, salary',
        'Реализуй Comparable<Employee> с сортировкой по умолчанию (по имени)',
        'Метод sortByDepartmentThenSalary — сортировка по отделу, затем по зарплате убывая',
        'Метод sortBySalaryDesc — только по зарплате убывая',
        'Метод sortByDepartmentThenNameThenSalary — три критерия',
        'Используй Comparator.comparing().thenComparing()',
        'Выведи каждый список отсортированных сотрудников'
      ],
      expectedOutput: 'По отделу и зарплате (убыв.):\nИТ: Мария (120000.0)\nИТ: Иван (100000.0)\nМаркетинг: Анна (95000.0)\nМаркетинг: Дмитрий (80000.0)\n---\nТолько по зарплате (убыв.):\nМария (120000.0), Иван (100000.0), Анна (95000.0), Дмитрий (80000.0)',
      hint: 'Comparator.comparing(Employee::getDepartment) создаёт компаратор по отделу. .thenComparing(Comparator.comparingDouble(Employee::getSalary).reversed()) добавляет второй критерий. list.stream().sorted(comparator).collect(Collectors.toList()) — сортировка через стрим.',
      solution: 'import java.util.*;\nimport java.util.stream.Collectors;\n\npublic class EmployeeSorting {\n\n    static class Employee implements Comparable<Employee> {\n        private String name;\n        private String department;\n        private double salary;\n\n        Employee(String name, String department, double salary) {\n            this.name = name;\n            this.department = department;\n            this.salary = salary;\n        }\n\n        public String getName() { return name; }\n        public String getDepartment() { return department; }\n        public double getSalary() { return salary; }\n\n        @Override\n        public int compareTo(Employee other) {\n            return this.name.compareTo(other.name); // по умолчанию по имени\n        }\n\n        @Override\n        public String toString() {\n            return department + ": " + name + " (" + salary + ")";\n        }\n    }\n\n    public static List<Employee> sortByDepartmentThenSalary(List<Employee> employees) {\n        return employees.stream()\n                .sorted(Comparator.comparing(Employee::getDepartment)\n                        .thenComparing(Comparator.comparingDouble(Employee::getSalary).reversed()))\n                .collect(Collectors.toList());\n    }\n\n    public static List<Employee> sortBySalaryDesc(List<Employee> employees) {\n        return employees.stream()\n                .sorted(Comparator.comparingDouble(Employee::getSalary).reversed())\n                .collect(Collectors.toList());\n    }\n\n    public static List<Employee> sortByDepartmentThenNameThenSalary(List<Employee> employees) {\n        return employees.stream()\n                .sorted(Comparator.comparing(Employee::getDepartment)\n                        .thenComparing(Employee::getName)\n                        .thenComparing(Comparator.comparingDouble(Employee::getSalary).reversed()))\n                .collect(Collectors.toList());\n    }\n\n    public static void main(String[] args) {\n        List<Employee> employees = Arrays.asList(\n                new Employee("Иван", "ИТ", 100000.0),\n                new Employee("Мария", "ИТ", 120000.0),\n                new Employee("Анна", "Маркетинг", 95000.0),\n                new Employee("Дмитрий", "Маркетинг", 80000.0)\n        );\n\n        System.out.println("По отделу и зарплате (убыв.):");\n        sortByDepartmentThenSalary(employees).forEach(System.out::println);\n        System.out.println("---");\n\n        List<String> bySalary = sortBySalaryDesc(employees).stream()\n                .map(e -> e.getName() + " (" + e.getSalary() + ")")\n                .collect(Collectors.toList());\n        System.out.println("Только по зарплате (убыв.):\\n" + String.join(", ", bySalary));\n    }\n}',
      explanation: 'Comparator.comparing(keyExtractor) создаёт компаратор по одному полю. thenComparing() добавляет следующий критерий — применяется только когда предыдущий критерий даёт равенство. reversed() переворачивает порядок компаратора (для убывающей сортировки). Интерфейс Comparable определяет "естественный порядок" объектов — используется при Collections.sort() без явного компаратора. Comparator — внешний компаратор, более гибкий: можно создавать разные стратегии сортировки без изменения класса.'
    },
    {
      id: 7,
      title: 'Задача: Топ-3 самых частых слова в тексте',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши программу, которая находит три самых часто встречающихся слова в тексте, игнорируя стоп-слова (предлоги, союзы, местоимения).',
      requirements: [
        'Подсчитай частоту всех слов (без регистра и пунктуации)',
        'Исключи стоп-слова: ["и", "в", "на", "с", "по", "из", "у", "к", "о", "а", "но", "да", "не", "или"]',
        'Верни Top-3 слова с их количеством',
        'При одинаковой частоте сортируй по алфавиту',
        'Метод getTopNWords(String text, int n) возвращает List<Map.Entry<String, Integer>>',
        'Если слов меньше N — вернуть сколько есть'
      ],
      expectedOutput: 'Текст проанализирован\nТоп-3 слова:\n1. java: 4\n2. программирование: 3\n3. код: 2',
      hint: 'Set<String> stopWords = new HashSet<>(Arrays.asList("и", "в", ...)). После подсчёта частот: filter(e -> !stopWords.contains(e.getKey())).sorted по убыванию частоты, при равенстве — по ключу. Map.Entry.comparingByValue(reversed()).thenComparing(Map.Entry.comparingByKey()).',
      solution: 'import java.util.*;\nimport java.util.stream.Collectors;\n\npublic class TopWords {\n    private static final Set<String> STOP_WORDS = new HashSet<>(Arrays.asList(\n            "и", "в", "на", "с", "по", "из", "у", "к", "о", "а", "но", "да", "не", "или",\n            "то", "что", "как", "это", "же", "бы", "при", "для", "от", "до"\n    ));\n\n    public static Map<String, Integer> countWords(String text) {\n        Map<String, Integer> freq = new HashMap<>();\n        for (String word : text.split("[\\\\s.,!?;:\\\"()]+")) {\n            if (word.isBlank()) continue;\n            String w = word.toLowerCase();\n            if (!STOP_WORDS.contains(w)) {\n                freq.merge(w, 1, Integer::sum);\n            }\n        }\n        return freq;\n    }\n\n    public static List<Map.Entry<String, Integer>> getTopNWords(String text, int n) {\n        Map<String, Integer> freq = countWords(text);\n        return freq.entrySet().stream()\n                .sorted(Map.Entry.<String, Integer>comparingByValue(Comparator.reverseOrder())\n                        .thenComparing(Map.Entry.comparingByKey()))\n                .limit(n)\n                .collect(Collectors.toList());\n    }\n\n    public static void main(String[] args) {\n        String text = "Java это язык программирования. " +\n                "Java используется для программирования серверов. " +\n                "Хороший код на Java — это чистый код. " +\n                "Java и программирование неразделимы.";\n\n        List<Map.Entry<String, Integer>> top = getTopNWords(text, 3);\n        System.out.println("Текст проанализирован");\n        System.out.println("Топ-3 слова:");\n        for (int i = 0; i < top.size(); i++) {\n            System.out.println((i + 1) + ". " + top.get(i).getKey() + ": " + top.get(i).getValue());\n        }\n    }\n}',
      explanation: 'Использование константы STOP_WORDS как static final Set позволяет один раз инициализировать набор стоп-слов и использовать его во всех вызовах. HashSet обеспечивает O(1) проверку contains(). Сложная сортировка с двумя критериями: Map.Entry.comparingByValue(reversed()) — по убыванию частоты, thenComparing(comparingByKey()) — по алфавиту при равной частоте. Это гарантирует стабильный (детерминированный) результат при равных частотах. merge(w, 1, Integer::sum) — идиоматичный способ подсчёта частот в Java.'
    },
    {
      id: 8,
      title: 'Задача: Объединение двух Map',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй различные стратегии объединения двух Map. При конфликте ключей применяй разные правила: взять первое, взять второе, сложить значения, взять максимум.',
      requirements: [
        'Метод mergeKeepFirst(Map<K,V> m1, Map<K,V> m2) — при конфликте берём из m1',
        'Метод mergeKeepSecond(Map<K,V> m1, Map<K,V> m2) — при конфликте берём из m2',
        'Метод mergeSumValues(Map<String,Integer> m1, Map<String,Integer> m2) — суммируем значения',
        'Метод mergeMaxValues(Map<String,Integer> m1, Map<String,Integer> m2) — берём максимум',
        'Метод mergeCombineLists(Map<String,List<String>> m1, Map<String,List<String>> m2) — объединяем списки',
        'Использовать Map.merge() где возможно'
      ],
      expectedOutput: 'Map1: {a=1, b=2, c=3}\nMap2: {b=20, c=30, d=40}\nKeepFirst: {a=1, b=2, c=3, d=40}\nKeepSecond: {a=1, b=20, c=30, d=40}\nSumValues: {a=1, b=22, c=33, d=40}\nMaxValues: {a=1, b=20, c=30, d=40}',
      hint: 'putIfAbsent(k, v) добавляет только если ключа нет. putAll() перезаписывает. merge(key, value, (v1, v2) -> v1) оставляет первое. merge(key, value, Integer::sum) суммирует. Math::max выбирает максимум.',
      solution: 'import java.util.*;\nimport java.util.stream.Collectors;\nimport java.util.stream.Stream;\n\npublic class MapMerge {\n\n    public static <K, V> Map<K, V> mergeKeepFirst(Map<K, V> m1, Map<K, V> m2) {\n        Map<K, V> result = new HashMap<>(m1);\n        m2.forEach((k, v) -> result.putIfAbsent(k, v));\n        return result;\n    }\n\n    public static <K, V> Map<K, V> mergeKeepSecond(Map<K, V> m1, Map<K, V> m2) {\n        Map<K, V> result = new HashMap<>(m1);\n        result.putAll(m2); // перезаписывает при конфликте\n        return result;\n    }\n\n    public static Map<String, Integer> mergeSumValues(\n            Map<String, Integer> m1, Map<String, Integer> m2) {\n        Map<String, Integer> result = new HashMap<>(m1);\n        m2.forEach((k, v) -> result.merge(k, v, Integer::sum));\n        return result;\n    }\n\n    public static Map<String, Integer> mergeMaxValues(\n            Map<String, Integer> m1, Map<String, Integer> m2) {\n        Map<String, Integer> result = new HashMap<>(m1);\n        m2.forEach((k, v) -> result.merge(k, v, Math::max));\n        return result;\n    }\n\n    public static Map<String, List<String>> mergeCombineLists(\n            Map<String, List<String>> m1, Map<String, List<String>> m2) {\n        Map<String, List<String>> result = new HashMap<>();\n        m1.forEach((k, v) -> result.put(k, new ArrayList<>(v)));\n        m2.forEach((k, v) -> result.computeIfAbsent(k, __ -> new ArrayList<>()).addAll(v));\n        return result;\n    }\n\n    public static void main(String[] args) {\n        Map<String, Integer> m1 = new LinkedHashMap<>();\n        m1.put("a", 1); m1.put("b", 2); m1.put("c", 3);\n\n        Map<String, Integer> m2 = new LinkedHashMap<>();\n        m2.put("b", 20); m2.put("c", 30); m2.put("d", 40);\n\n        System.out.println("Map1: " + m1);\n        System.out.println("Map2: " + m2);\n        System.out.println("KeepFirst: " + mergeKeepFirst(m1, m2));\n        System.out.println("KeepSecond: " + mergeKeepSecond(m1, m2));\n        System.out.println("SumValues: " + mergeSumValues(m1, m2));\n        System.out.println("MaxValues: " + mergeMaxValues(m1, m2));\n    }\n}',
      explanation: 'Map.merge(key, value, remappingFn) — мощный метод: если ключа нет — добавляет (key, value); если ключ есть — применяет remappingFn(oldValue, newValue) и сохраняет результат. Это позволяет элегантно выразить разные стратегии слияния: Integer::sum для сложения, Math::max для максимума, (v1, v2) -> v1 для сохранения первого. putIfAbsent() добавляет только если ключа нет — эквивалент "не перезаписывай". putAll() перезаписывает — эквивалент "последнее побеждает".'
    },
    {
      id: 9,
      title: 'Задача: LRU-кэш на LinkedHashMap',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй LRU-кэш (Least Recently Used — вытесняет давно не использованный элемент) используя LinkedHashMap с параметром accessOrder=true.',
      requirements: [
        'Класс LRUCache<K, V> с параметром capacity (ёмкость)',
        'Метод get(K key) — получить значение (null если нет), обновляет порядок доступа',
        'Метод put(K key, V value) — добавить/обновить, при превышении ёмкости удаляет старейший',
        'Метод size() — текущий размер кэша',
        'Метод containsKey(K key) — проверить наличие',
        'Использовать LinkedHashMap(capacity, 0.75f, true) с переопределением removeEldestEntry',
        'Продемонстрировать вытеснение: добавить 4 элемента при capacity=3'
      ],
      expectedOutput: 'Добавлено: A, B, C\nКэш: {A=1, B=2, C=3}\nget(A) = 1 (A стал последним)\nДобавлено D — вытеснен B\nКэш содержит A: true\nКэш содержит B: false\nРазмер: 3',
      hint: 'LinkedHashMap(initialCapacity, loadFactor, accessOrder=true) — при accessOrder=true порядок элементов определяется последним доступом (get или put). Переопредели removeEldestEntry(entry): return size() > capacity; — это вызывается автоматически после каждого put.',
      solution: 'import java.util.*;\n\npublic class LRUCache<K, V> {\n    private final int capacity;\n    private final Map<K, V> cache;\n\n    public LRUCache(int capacity) {\n        this.capacity = capacity;\n        // accessOrder=true: при get() элемент перемещается в конец\n        this.cache = new LinkedHashMap<K, V>(capacity, 0.75f, true) {\n            @Override\n            protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {\n                // Вызывается после каждого put — удаляет если превышена ёмкость\n                return size() > capacity;\n            }\n        };\n    }\n\n    public V get(K key) {\n        // LinkedHashMap с accessOrder=true автоматически\n        // перемещает элемент в конец при get\n        return cache.getOrDefault(key, null);\n    }\n\n    public void put(K key, V value) {\n        cache.put(key, value);\n    }\n\n    public boolean containsKey(K key) {\n        return cache.containsKey(key);\n    }\n\n    public int size() {\n        return cache.size();\n    }\n\n    @Override\n    public String toString() {\n        return cache.toString();\n    }\n\n    public static void main(String[] args) {\n        LRUCache<String, Integer> lru = new LRUCache<>(3);\n\n        lru.put("A", 1);\n        lru.put("B", 2);\n        lru.put("C", 3);\n        System.out.println("Добавлено: A, B, C");\n        System.out.println("Кэш: " + lru);\n\n        int valA = lru.get("A");\n        System.out.println("get(A) = " + valA + " (A стал последним)");\n        // Теперь порядок: B, C, A (B — самый старый)\n\n        lru.put("D", 4); // B вытесняется (самый давно использованный)\n        System.out.println("Добавлено D — вытеснен B");\n        System.out.println("Кэш содержит A: " + lru.containsKey("A"));\n        System.out.println("Кэш содержит B: " + lru.containsKey("B"));\n        System.out.println("Размер: " + lru.size());\n    }\n}',
      explanation: 'LinkedHashMap с accessOrder=true — встроенная в JDK основа для LRU-кэша. В обычном режиме (accessOrder=false) элементы хранятся в порядке вставки. В режиме accessOrder=true после каждого get() или put() элемент перемещается в конец списка — начало соответствует "самым старым" доступам. removeEldestEntry() — защищённый метод LinkedHashMap, вызываемый после каждого put(). Если вернуть true — элемент eldest (самый давний) удаляется автоматически. LRU-кэш — классическая задача на собеседованиях: реализация за O(1) для get и put.'
    },
    {
      id: 10,
      title: 'Задача: Операции над множествами (объединение/пересечение/разность)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй класс SetCalculator для выполнения всех стандартных теоретико-множественных операций над коллекциями, с поддержкой произвольного числа входных множеств.',
      requirements: [
        'Класс SetCalculator<T> с методами работы с множествами',
        'union(Set<T>... sets) — объединение произвольного числа множеств',
        'intersect(Set<T>... sets) — пересечение произвольного числа множеств',
        'difference(Set<T> base, Set<T>... others) — разность: base минус все others',
        'symmetricDifference(Set<T> a, Set<T> b) — симметричная разность',
        'isSubset(Set<T> sub, Set<T> superSet) — проверка подмножества',
        'cartesianProduct(Set<T> a, Set<T> b) — декартово произведение (список пар)',
        'Все методы не изменяют исходные множества'
      ],
      expectedOutput: 'A = {1, 2, 3, 4}\nB = {3, 4, 5, 6}\nC = {4, 5, 6, 7}\nA ∪ B ∪ C: {1, 2, 3, 4, 5, 6, 7}\nA ∩ B ∩ C: {4}\nA \\ B: {1, 2}\nA △ B: {1, 2, 5, 6}\n{3,4} подмножество A: true\nДекартово A×{x,y}: [(1,x), (1,y), (2,x), (2,y), ...]',
      hint: 'Varargs (@SafeVarargs Set<T>... sets) позволяет принимать любое число аргументов. Для union: создай новый HashSet, добавь все элементы через addAll. Для intersect: начни с копии первого, применяй retainAll к остальным. Декартово произведение: два вложенных цикла.',
      solution: 'import java.util.*;\nimport java.util.stream.Collectors;\n\npublic class SetCalculator<T> {\n\n    @SafeVarargs\n    public final Set<T> union(Set<T>... sets) {\n        Set<T> result = new HashSet<>();\n        for (Set<T> set : sets) {\n            result.addAll(set);\n        }\n        return result;\n    }\n\n    @SafeVarargs\n    public final Set<T> intersect(Set<T>... sets) {\n        if (sets.length == 0) return new HashSet<>();\n        Set<T> result = new HashSet<>(sets[0]);\n        for (int i = 1; i < sets.length; i++) {\n            result.retainAll(sets[i]);\n        }\n        return result;\n    }\n\n    @SafeVarargs\n    public final Set<T> difference(Set<T> base, Set<T>... others) {\n        Set<T> result = new HashSet<>(base);\n        for (Set<T> other : others) {\n            result.removeAll(other);\n        }\n        return result;\n    }\n\n    public Set<T> symmetricDifference(Set<T> a, Set<T> b) {\n        Set<T> onlyA = difference(a, b);\n        Set<T> onlyB = difference(b, a);\n        return union(onlyA, onlyB);\n    }\n\n    public boolean isSubset(Set<T> sub, Set<T> superSet) {\n        return superSet.containsAll(sub);\n    }\n\n    public <U> List<String> cartesianProduct(Set<T> a, Set<U> b) {\n        List<String> result = new ArrayList<>();\n        for (T elemA : a) {\n            for (U elemB : b) {\n                result.add("(" + elemA + "," + elemB + ")");\n            }\n        }\n        return result;\n    }\n\n    public static void main(String[] args) {\n        SetCalculator<Integer> calc = new SetCalculator<>();\n\n        Set<Integer> A = new TreeSet<>(Arrays.asList(1, 2, 3, 4));\n        Set<Integer> B = new TreeSet<>(Arrays.asList(3, 4, 5, 6));\n        Set<Integer> C = new TreeSet<>(Arrays.asList(4, 5, 6, 7));\n\n        System.out.println("A = " + A);\n        System.out.println("B = " + B);\n        System.out.println("C = " + C);\n        System.out.println("A \\u222a B \\u222a C: " + new TreeSet<>(calc.union(A, B, C)));\n        System.out.println("A \\u2229 B \\u2229 C: " + new TreeSet<>(calc.intersect(A, B, C)));\n        System.out.println("A \\\\ B: " + new TreeSet<>(calc.difference(A, B)));\n        System.out.println("A \\u25b3 B: " + new TreeSet<>(calc.symmetricDifference(A, B)));\n\n        Set<Integer> sub = new HashSet<>(Arrays.asList(3, 4));\n        System.out.println("{3,4} подмножество A: " + calc.isSubset(sub, A));\n\n        Set<String> XY = new LinkedHashSet<>(Arrays.asList("x", "y"));\n        SetCalculator<Integer> calc2 = new SetCalculator<>();\n        List<String> product = calc2.cartesianProduct(A, XY);\n        System.out.println("Декартово A\\u00d7{x,y}: " + product.subList(0, 4) + "...");\n    }\n}',
      explanation: '@SafeVarargs подавляет предупреждение компилятора о возможных проблемах при использовании varargs с generics — безопасна, если метод не записывает в массив varargs. Varargs (Set<T>... sets) позволяет вызывать метод с любым числом аргументов: union(A, B), union(A, B, C), union(A, B, C, D). containsAll(collection) возвращает true если данное множество содержит все элементы коллекции — это проверка подмножества. TreeSet при создании из HashSet автоматически сортирует элементы — удобно для вывода. Декартово произведение — O(n*m): каждый элемент первого множества с каждым элементом второго.'
    }
  ]
}
