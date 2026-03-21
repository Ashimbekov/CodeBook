export default {
  id: 31,
  title: 'Comparable и Comparator',
  description: 'Изучаем как задавать порядок сортировки объектов через интерфейсы Comparable и Comparator',
  lessons: [
    {
      id: 1, title: 'Натуральный порядок: Comparable', type: 'theory',
      content: [
        { type: 'text', value: 'Когда у тебя есть список объектов своего класса (например, Student, Product), Java не знает как их сортировать. Чтобы научить Java — реализуй интерфейс Comparable.' },
        { type: 'tip', value: 'Comparable — это как научить объект отвечать на вопрос "ты больше или меньше другого такого же объекта?". Реализовав Comparable, ты задаёшь правило для сравнения.' },
        { type: 'heading', value: 'Интерфейс Comparable' },
        { type: 'code', language: 'java', value: '// Comparable<T> имеет один метод:\n// int compareTo(T other)\n//\n// Возвращает:\n//   отрицательное число — если this МЕНЬШЕ other\n//   0                  — если они РАВНЫ\n//   положительное число — если this БОЛЬШЕ other\n\npublic class Student implements Comparable<Student> {\n    String name;\n    int grade;\n\n    public Student(String name, int grade) {\n        this.name = name;\n        this.grade = grade;\n    }\n\n    // Сортируем по оценке (натуральный порядок)\n    @Override\n    public int compareTo(Student other) {\n        return this.grade - other.grade;\n        // Если this.grade < other.grade — отрицательное (this меньше)\n        // Если this.grade > other.grade — положительное (this больше)\n        // Если равны — 0\n    }\n\n    @Override\n    public String toString() {\n        return name + "(" + grade + ")";\n    }\n}' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\nimport java.util.Collections;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<Student> students = new ArrayList<>();\n        students.add(new Student("Анна", 92));\n        students.add(new Student("Борис", 75));\n        students.add(new Student("Виктор", 88));\n        students.add(new Student("Дмитрий", 65));\n\n        System.out.println("До: " + students);\n        Collections.sort(students); // использует compareTo!\n        System.out.println("После: " + students);\n        // [Дмитрий(65), Борис(75), Виктор(88), Анна(92)]\n    }\n}' }
      ]
    },
    {
      id: 2, title: 'Метод compareTo подробно', type: 'theory',
      content: [
        { type: 'text', value: 'Метод compareTo — это основа для сравнения объектов. Важно правильно его реализовывать.' },
        { type: 'heading', value: 'Сравнение чисел' },
        { type: 'code', language: 'java', value: '// Для чисел — вычитание (если нет риска переполнения)\npublic int compareTo(Person other) {\n    return this.age - other.age; // по возрасту\n}\n\n// Безопаснее через Integer.compare:\npublic int compareTo(Person other) {\n    return Integer.compare(this.age, other.age);\n}\n\n// Строки — через метод compareTo String:\npublic int compareTo(Person other) {\n    return this.name.compareTo(other.name); // по имени алфавит\n}' },
        { type: 'heading', value: 'Цепочка сравнений' },
        { type: 'code', language: 'java', value: 'public class Product implements Comparable<Product> {\n    String name;\n    double price;\n    int quantity;\n\n    public Product(String name, double price, int quantity) {\n        this.name = name;\n        this.price = price;\n        this.quantity = quantity;\n    }\n\n    // Сначала по цене, если цена одинакова — по имени\n    @Override\n    public int compareTo(Product other) {\n        // Сначала сравниваем цены\n        int priceCompare = Double.compare(this.price, other.price);\n        if (priceCompare != 0) {\n            return priceCompare; // цены разные — используем это\n        }\n        // Цены одинаковые — сравниваем по имени\n        return this.name.compareTo(other.name);\n    }\n\n    @Override\n    public String toString() {\n        return name + "(" + price + "р)";\n    }\n}' },
        { type: 'code', language: 'java', value: 'ArrayList<Product> products = new ArrayList<>();\nproducts.add(new Product("Хлеб", 50.0, 100));\nproducts.add(new Product("Молоко", 80.0, 50));\nproducts.add(new Product("Вода", 50.0, 200));\nproducts.add(new Product("Сок", 120.0, 30));\n\nCollections.sort(products);\nSystem.out.println(products);\n// [Вода(50.0р), Хлеб(50.0р), Молоко(80.0р), Сок(120.0р)]\n// Вода и Хлеб имеют одинаковую цену, отсортированы по алфавиту!' }
      ]
    },
    {
      id: 3, title: 'Кастомный порядок: Comparator', type: 'theory',
      content: [
        { type: 'text', value: 'Comparable задаёт один "натуральный" порядок сортировки. Но что если нужно сортировать по-разному в разных ситуациях? Для этого есть Comparator — отдельный объект с логикой сравнения.' },
        { type: 'tip', value: 'Comparator — как судья на соревновании. В разных соревнованиях разные судьи с разными критериями оценки. Один судья оценивает по скорости, другой — по технике. Comparator — это судья с определённым критерием.' },
        { type: 'heading', value: 'Создание Comparator' },
        { type: 'code', language: 'java', value: 'import java.util.Comparator;\n\npublic class Student {\n    String name;\n    int grade;\n    int age;\n\n    public Student(String name, int grade, int age) {\n        this.name = name;\n        this.grade = grade;\n        this.age = age;\n    }\n\n    @Override\n    public String toString() {\n        return name + "(оценка=" + grade + ", возраст=" + age + ")";\n    }\n}\n\n// Компаратор по имени\nComparator<Student> byName = new Comparator<Student>() {\n    @Override\n    public int compare(Student a, Student b) {\n        return a.name.compareTo(b.name);\n    }\n};\n\n// Компаратор по оценке\nComparator<Student> byGrade = new Comparator<Student>() {\n    @Override\n    public int compare(Student a, Student b) {\n        return Integer.compare(a.grade, b.grade);\n    }\n};\n\n// Компаратор по возрасту (убывание)\nComparator<Student> byAgeDesc = new Comparator<Student>() {\n    @Override\n    public int compare(Student a, Student b) {\n        return Integer.compare(b.age, a.age); // b и a поменяны!\n    }\n};' },
        { type: 'code', language: 'java', value: 'ArrayList<Student> students = new ArrayList<>();\nstudents.add(new Student("Виктор", 88, 20));\nstudents.add(new Student("Анна", 92, 18));\nstudents.add(new Student("Борис", 75, 22));\n\n// Сортируем по имени\nCollections.sort(students, byName);\nSystem.out.println("По имени: " + students);\n\n// Сортируем по оценке\nCollections.sort(students, byGrade);\nSystem.out.println("По оценке: " + students);\n\n// Сортируем по возрасту убывающе\nCollections.sort(students, byAgeDesc);\nSystem.out.println("По возрасту (убыв): " + students);' }
      ]
    },
    {
      id: 4, title: 'Сортировка через Collections.sort', type: 'theory',
      content: [
        { type: 'text', value: 'Collections.sort() — основной метод для сортировки List в Java. Он принимает либо только список (использует Comparable), либо список и Comparator.' },
        { type: 'heading', value: 'Разные способы сортировки' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.Comparator;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> names = new ArrayList<>();\n        names.add("Пётр"); names.add("Анна"); names.add("Борис");\n\n        // Натуральный порядок (Comparable)\n        Collections.sort(names);\n        System.out.println("По алфавиту: " + names);\n\n        // С компаратором: обратный порядок\n        Collections.sort(names, Collections.reverseOrder());\n        System.out.println("Обратно: " + names);\n\n        // С компаратором: по длине строки\n        Collections.sort(names, Comparator.comparingInt(String::length));\n        System.out.println("По длине: " + names);\n\n        // list.sort() — то же самое, метод самого списка\n        names.sort(Comparator.naturalOrder());\n        System.out.println("Снова по алфавиту: " + names);\n    }\n}' },
        { type: 'heading', value: 'Arrays.sort для массивов' },
        { type: 'code', language: 'java', value: 'import java.util.Arrays;\nimport java.util.Comparator;\n\nint[] nums = {5, 2, 8, 1, 9};\nArrays.sort(nums); // для примитивных массивов\nSystem.out.println(Arrays.toString(nums)); // [1, 2, 5, 8, 9]\n\nString[] words = {"банан", "яблоко", "ёж"};\nArrays.sort(words); // по Comparable (алфавит)\nSystem.out.println(Arrays.toString(words));\n\n// Сортировка объектного массива с компаратором\nString[] lengths = {"длинное", "кот", "слон", "ёж"};\nArrays.sort(lengths, Comparator.comparingInt(String::length));\nSystem.out.println(Arrays.toString(lengths)); // [ёж, кот, слон, длинное]' }
      ]
    },
    {
      id: 5, title: 'Lambda Comparator', type: 'theory',
      content: [
        { type: 'text', value: 'Comparator — функциональный интерфейс (один абстрактный метод), поэтому его можно заменить лямбда-выражением. Код становится намного короче.' },
        { type: 'heading', value: 'Comparator через лямбду' },
        { type: 'code', language: 'java', value: 'import java.util.ArrayList;\nimport java.util.Comparator;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> words = new ArrayList<>();\n        words.add("Банан"); words.add("Яблоко");\n        words.add("Ёж"); words.add("Апельсин");\n\n        // Старый стиль (анонимный класс)\n        words.sort(new Comparator<String>() {\n            @Override\n            public int compare(String a, String b) {\n                return a.length() - b.length();\n            }\n        });\n\n        // Новый стиль (лямбда)\n        words.sort((a, b) -> a.length() - b.length());\n\n        // Ещё короче — через Comparator.comparingInt\n        words.sort(Comparator.comparingInt(String::length));\n\n        System.out.println(words); // [Ёж, Банан, Яблоко, Апельсин]\n    }\n}' },
        { type: 'heading', value: 'Цепочка компараторов' },
        { type: 'code', language: 'java', value: 'class Person {\n    String name;\n    int age;\n    Person(String n, int a) { name = n; age = a; }\n    public String toString() { return name + "(" + age + ")"; }\n}\n\nArrayList<Person> people = new ArrayList<>();\npeople.add(new Person("Анна", 25));\npeople.add(new Person("Борис", 30));\npeople.add(new Person("Анна", 22));\npeople.add(new Person("Борис", 28));\n\n// Сначала по имени, потом по возрасту\npeople.sort(\n    Comparator.comparing((Person p) -> p.name)\n              .thenComparingInt(p -> p.age)\n);\n\nSystem.out.println(people);\n// [Анна(22), Анна(25), Борис(28), Борис(30)]' },
        { type: 'tip', value: 'thenComparing() — добавить дополнительный критерий сортировки, если предыдущий дал равенство. Можно выстроить цепочку из любого количества критериев.' }
      ]
    },
    {
      id: 6, title: 'Практика: Сортировка товаров', type: 'practice', difficulty: 'medium',
      description: 'Создай класс Product, реализуй Comparable для сортировки по цене, и создай Comparator для сортировки по названию и по остатку.',
      requirements: [
        'Создай класс Product с полями: name, price, stock (остаток)',
        'Реализуй Comparable для сортировки по цене (возрастание)',
        'Создай Comparator для сортировки по имени (алфавит)',
        'Создай Comparator для сортировки по остатку (убывание)',
        'Продемонстрируй все три вида сортировки'
      ],
      expectedOutput: 'Исходный список:\nМолоко(80.0р, остаток:50)\nХлеб(50.0р, остаток:100)\nСыр(200.0р, остаток:20)\nКефир(90.0р, остаток:75)\n\nПо цене (Comparable):\nХлеб(50.0р, остаток:100)\nМолоко(80.0р, остаток:50)\nКефир(90.0р, остаток:75)\nСыр(200.0р, остаток:20)\n\nПо имени (Comparator):\nКефир(90.0р, остаток:75)\nМолоко(80.0р, остаток:50)\nСыр(200.0р, остаток:20)\nХлеб(50.0р, остаток:100)\n\nПо остатку убывание (Comparator):\nХлеб(50.0р, остаток:100)\nКефир(90.0р, остаток:75)\nМолоко(80.0р, остаток:50)\nСыр(200.0р, остаток:20)',
      hint: 'Для Comparator по убыванию поменяй порядок параметров: (b, a) вместо (a, b), или используй Comparator.reversed().',
      solution: 'import java.util.ArrayList;\nimport java.util.Collections;\nimport java.util.Comparator;\n\npublic class Product implements Comparable<Product> {\n    String name;\n    double price;\n    int stock;\n\n    public Product(String name, double price, int stock) {\n        this.name = name;\n        this.price = price;\n        this.stock = stock;\n    }\n\n    @Override\n    public int compareTo(Product other) {\n        return Double.compare(this.price, other.price);\n    }\n\n    @Override\n    public String toString() {\n        return name + "(" + price + "р, остаток:" + stock + ")";\n    }\n}\n\nclass Main {\n    public static void main(String[] args) {\n        ArrayList<Product> products = new ArrayList<>();\n        products.add(new Product("Молоко", 80.0, 50));\n        products.add(new Product("Хлеб", 50.0, 100));\n        products.add(new Product("Сыр", 200.0, 20));\n        products.add(new Product("Кефир", 90.0, 75));\n\n        System.out.println("Исходный список:");\n        products.forEach(System.out::println);\n\n        Collections.sort(products);\n        System.out.println("\\nПо цене (Comparable):");\n        products.forEach(System.out::println);\n\n        products.sort(Comparator.comparing(p -> p.name));\n        System.out.println("\\nПо имени (Comparator):");\n        products.forEach(System.out::println);\n\n        products.sort((a, b) -> Integer.compare(b.stock, a.stock));\n        System.out.println("\\nПо остатку убывание (Comparator):");\n        products.forEach(System.out::println);\n    }\n}',
      explanation: 'Comparable задаёт базовый (натуральный) порядок класса — по цене. Comparator-ы добавляют альтернативные порядки. Лямбда-компараторы (a, b) -> ... намного короче анонимных классов. Для убывания меняем порядок: b-a вместо a-b.'
    }
  ]
}
