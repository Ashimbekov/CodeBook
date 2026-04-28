export default {
  id: 8,
  title: 'Тестирование коллекций и Stream API',
  description: 'Тестирование List, Map, Set, Stream-операций и их результатов',
  lessons: [
    {
      id: 1,
      title: 'Тестирование коллекций: List',
      type: 'theory',
      content: [
        { type: 'text', value: 'При тестировании коллекций важно проверять не только содержимое, но и порядок, размер, наличие/отсутствие элементов.' },
        { type: 'heading', value: 'Основные assertions для коллекций' },
        { type: 'code', language: 'java', value: '// Размер\nassertEquals(3, list.size());\nassertTrue(list.isEmpty());\nassertFalse(list.isEmpty());\n\n// Содержимое\nassertTrue(list.contains("apple"));\nassertFalse(list.contains("banana"));\n\n// Порядок — assertEquals для списков\nassertEquals(\n    List.of("a", "b", "c"),\n    actualList\n);\n\n// Первый и последний элемент\nassertEquals("first", list.get(0));\nassertEquals("last", list.get(list.size() - 1));' },
        { type: 'heading', value: 'AssertJ — fluent assertions для коллекций' },
        { type: 'code', language: 'java', value: '// В библиотеке AssertJ (часто используется с JUnit):\nassertThat(list)\n    .hasSize(3)\n    .contains("apple", "banana")\n    .doesNotContain("cherry")\n    .startsWith("apple")\n    .endsWith("cherry");\n\nassertThat(list)\n    .filteredOn(item -> item.startsWith("a"))\n    .hasSize(1);' },
        { type: 'heading', value: 'Сравнение списков' },
        { type: 'code', language: 'java', value: '// С учётом порядка:\nassertEquals(expected, actual);\n\n// Без учёта порядка:\nassertTrue(\n    expected.size() == actual.size() &&\n    expected.containsAll(actual)\n);\n\n// Или через сортировку:\nCollections.sort(expected);\nCollections.sort(actual);\nassertEquals(expected, actual);' },
        { type: 'tip', value: 'List.equals() проверяет и содержимое, и порядок. Set.equals() — только содержимое. Выбирайте тип коллекции, подходящий для теста.' }
      ]
    },
    {
      id: 2,
      title: 'Тестирование Map и Set',
      type: 'theory',
      content: [
        { type: 'text', value: 'Map и Set имеют свои особенности при тестировании: ключи, значения, отсутствие дубликатов.' },
        { type: 'heading', value: 'Тестирование Map' },
        { type: 'code', language: 'java', value: '// Размер\nassertEquals(3, map.size());\n\n// Содержит ключ\nassertTrue(map.containsKey("name"));\nassertFalse(map.containsKey("unknown"));\n\n// Содержит значение\nassertTrue(map.containsValue("John"));\n\n// Получение значения\nassertEquals("John", map.get("name"));\nassertNull(map.get("unknown"));\n\n// Проверка всей Map\nMap<String, Integer> expected = Map.of(\n    "a", 1, "b", 2, "c", 3\n);\nassertEquals(expected, actualMap);' },
        { type: 'heading', value: 'Тестирование Set' },
        { type: 'code', language: 'java', value: '// Set — нет дубликатов, нет порядка\nSet<String> actual = service.getUniqueNames();\n\nassertEquals(3, actual.size());\nassertTrue(actual.contains("John"));\nassertFalse(actual.contains("Unknown"));\n\n// Сравнение с ожидаемым Set\nassertEquals(\n    Set.of("John", "Jane", "Bob"),\n    actual\n);' },
        { type: 'heading', value: 'Тестирование трансформаций' },
        { type: 'code', language: 'java', value: '// Тестируем метод, который группирует по ключу:\n// groupByDepartment(employees) -> Map<String, List<Employee>>\nMap<String, List<Employee>> result =\n    groupByDepartment(employees);\n\nassertEquals(2, result.size()); // 2 отдела\nassertTrue(result.containsKey("IT"));\nassertEquals(3, result.get("IT").size()); // 3 в IT' },
        { type: 'note', value: 'Map.of() и Set.of() — удобные фабрики для создания ожидаемых коллекций в тестах. Они иммутабельные и выбрасывают NPE при null.' }
      ]
    },
    {
      id: 3,
      title: 'Тестирование Stream API',
      type: 'theory',
      content: [
        { type: 'text', value: 'Stream-операции (filter, map, reduce) часто используются в бизнес-логике. Тестировать нужно РЕЗУЛЬТАТ, а не сам stream.' },
        { type: 'heading', value: 'Тестирование filter' },
        { type: 'code', language: 'java', value: '// Метод: получить активных пользователей\nList<User> active = users.stream()\n    .filter(User::isActive)\n    .collect(Collectors.toList());\n\n// Тест:\nassertEquals(3, active.size());\nassertTrue(active.stream().allMatch(User::isActive));' },
        { type: 'heading', value: 'Тестирование map (трансформация)' },
        { type: 'code', language: 'java', value: '// Метод: получить имена пользователей\nList<String> names = users.stream()\n    .map(User::getName)\n    .collect(Collectors.toList());\n\n// Тест:\nassertEquals(List.of("John", "Jane", "Bob"), names);' },
        { type: 'heading', value: 'Тестирование reduce/collect' },
        { type: 'code', language: 'java', value: '// Сумма цен\ndouble total = orders.stream()\n    .mapToDouble(Order::getPrice)\n    .sum();\nassertEquals(250.0, total, 0.01);\n\n// Группировка\nMap<String, Long> countByCity = users.stream()\n    .collect(Collectors.groupingBy(\n        User::getCity, Collectors.counting()));\nassertEquals(2L, countByCity.get("Москва"));\nassertEquals(1L, countByCity.get("Астана"));' },
        { type: 'heading', value: 'Типичные ошибки' },
        { type: 'list', items: [
          'Не тестировать пустой stream — что будет при пустом списке?',
          'Не тестировать null в элементах stream',
          'Тестировать промежуточные операции вместо результата',
          'Забывать про порядок в stream от Set/Map'
        ]},
        { type: 'tip', value: 'Тестируйте РЕЗУЛЬТАТ stream, а не его внутреннее устройство. Метод может использовать stream или цикл — тесту не должно быть важно.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: Тестирование фильтрации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Протестируйте методы фильтрации и трансформации списка товаров.',
      requirements: [
        'Создайте список товаров (name, price, category)',
        'Реализуйте filterByCategory, filterByPriceRange, getNames, getTotalPrice',
        'Протестируйте каждый метод с обычными данными и edge cases',
        'Протестируйте пустой список и список с одним элементом',
        'Минимум 6 тестов'
      ],
      expectedOutput: 'PASS: testFilterByCategory\nPASS: testFilterByCategoryEmpty\nPASS: testFilterByPriceRange\nPASS: testGetNames\nPASS: testGetTotalPrice\nPASS: testEmptyList\nИтого: 6/6',
      hint: 'Используйте массивы String[] {name, category} и double[] {price} для хранения товаров.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Product data ---
    static String[] names;
    static double[] prices;
    static String[] categories;
    static int count;

    static void initProducts(String[][] products) {
        count = products.length;
        names = new String[count];
        prices = new double[count];
        categories = new String[count];
        for (int i = 0; i < count; i++) {
            names[i] = products[i][0];
            prices[i] = Double.parseDouble(products[i][1]);
            categories[i] = products[i][2];
        }
    }

    // --- Business methods ---
    static List<String> filterByCategory(String category) {
        List<String> result = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            if (categories[i].equals(category)) {
                result.add(names[i]);
            }
        }
        return result;
    }

    static List<String> filterByPriceRange(double min, double max) {
        List<String> result = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            if (prices[i] >= min && prices[i] <= max) {
                result.add(names[i]);
            }
        }
        return result;
    }

    static List<String> getNames() {
        List<String> result = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            result.add(names[i]);
        }
        return result;
    }

    static double getTotalPrice() {
        double sum = 0;
        for (int i = 0; i < count; i++) {
            sum += prices[i];
        }
        return sum;
    }

    // --- Assertions ---
    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Expected [" + expected + "], got [" + actual + "]");
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Expected true");
    }

    static void runTest(String name, Runnable test) {
        total++;
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        // Arrange: подготовка данных
        String[][] products = {
            {"Ноутбук", "50000", "Электроника"},
            {"Телефон", "30000", "Электроника"},
            {"Книга", "500", "Образование"},
            {"Курс Java", "15000", "Образование"},
            {"Наушники", "5000", "Электроника"}
        };

        runTest("testFilterByCategory", () -> {
            initProducts(products);
            List<String> electronics = filterByCategory("Электроника");
            assertEquals(3, electronics.size());
            assertTrue(electronics.contains("Ноутбук"));
            assertTrue(electronics.contains("Телефон"));
            assertTrue(electronics.contains("Наушники"));
        });

        runTest("testFilterByCategoryEmpty", () -> {
            initProducts(products);
            List<String> result = filterByCategory("Спорт");
            assertEquals(0, result.size());
        });

        runTest("testFilterByPriceRange", () -> {
            initProducts(products);
            List<String> result = filterByPriceRange(1000, 20000);
            assertEquals(2, result.size());
            assertTrue(result.contains("Курс Java"));
            assertTrue(result.contains("Наушники"));
        });

        runTest("testGetNames", () -> {
            initProducts(products);
            List<String> allNames = getNames();
            assertEquals(5, allNames.size());
            assertEquals("Ноутбук", allNames.get(0));
        });

        runTest("testGetTotalPrice", () -> {
            initProducts(products);
            double total = getTotalPrice();
            assertEquals(100500.0, total);
        });

        runTest("testEmptyList", () -> {
            initProducts(new String[][]{});
            assertEquals(0, filterByCategory("Электроника").size());
            assertEquals(0, getNames().size());
            assertEquals(0.0, getTotalPrice());
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы протестировали CRUD-операции над коллекцией товаров: фильтрация по категории, по диапазону цен, получение имён, суммирование. Ключевой edge case — пустой список: все методы должны корректно работать с ним. Это типичная задача в бэкенд-разработке.'
    },
    {
      id: 5,
      title: 'Практика: Тестирование группировки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Протестируйте метод группировки данных и подсчёта статистик.',
      requirements: [
        'Создайте данные студентов: имя, факультет, оценка',
        'Метод groupByFaculty() — группирует студентов по факультету',
        'Метод averageGradeByFaculty() — средняя оценка по факультету',
        'Метод topStudents(minGrade) — студенты с оценкой >= minGrade',
        'Протестируйте все методы включая edge cases'
      ],
      expectedOutput: 'PASS: testGroupByFaculty\nPASS: testGroupByFacultySize\nPASS: testAverageGrade\nPASS: testTopStudents\nPASS: testTopStudentsNone\nPASS: testEmptyData\nИтого: 6/6',
      hint: 'Используйте HashMap для группировки. Средняя оценка = сумма / количество.',
      solution: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Student data ---
    static List<String> sNames = new ArrayList<>();
    static List<String> sFaculties = new ArrayList<>();
    static List<Double> sGrades = new ArrayList<>();

    static void addStudent(String name, String faculty, double grade) {
        sNames.add(name);
        sFaculties.add(faculty);
        sGrades.add(grade);
    }

    static void clearStudents() {
        sNames.clear();
        sFaculties.clear();
        sGrades.clear();
    }

    // --- Business methods ---
    static Map<String, List<String>> groupByFaculty() {
        Map<String, List<String>> result = new HashMap<>();
        for (int i = 0; i < sNames.size(); i++) {
            result.computeIfAbsent(sFaculties.get(i),
                k -> new ArrayList<>()).add(sNames.get(i));
        }
        return result;
    }

    static Map<String, Double> averageGradeByFaculty() {
        Map<String, Double> sums = new HashMap<>();
        Map<String, Integer> counts = new HashMap<>();
        for (int i = 0; i < sNames.size(); i++) {
            String fac = sFaculties.get(i);
            sums.merge(fac, sGrades.get(i), Double::sum);
            counts.merge(fac, 1, Integer::sum);
        }
        Map<String, Double> result = new HashMap<>();
        for (String fac : sums.keySet()) {
            result.put(fac, sums.get(fac) / counts.get(fac));
        }
        return result;
    }

    static List<String> topStudents(double minGrade) {
        List<String> result = new ArrayList<>();
        for (int i = 0; i < sNames.size(); i++) {
            if (sGrades.get(i) >= minGrade) {
                result.add(sNames.get(i));
            }
        }
        return result;
    }

    // --- Assertions ---
    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Expected [" + expected + "], got [" + actual + "]");
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Expected true");
    }

    static void runTest(String name, Runnable test) {
        total++;
        clearStudents();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testGroupByFaculty", () -> {
            addStudent("Алексей", "ИТ", 4.5);
            addStudent("Мария", "ИТ", 4.8);
            addStudent("Иван", "Экономика", 3.5);
            addStudent("Анна", "Экономика", 4.0);
            addStudent("Борис", "ИТ", 3.9);

            Map<String, List<String>> groups = groupByFaculty();
            assertEquals(2, groups.size());
            assertTrue(groups.containsKey("ИТ"));
            assertTrue(groups.containsKey("Экономика"));
        });

        runTest("testGroupByFacultySize", () -> {
            addStudent("А", "ИТ", 4.0);
            addStudent("Б", "ИТ", 4.0);
            addStudent("В", "ИТ", 4.0);
            addStudent("Г", "Физика", 4.0);

            Map<String, List<String>> groups = groupByFaculty();
            assertEquals(3, groups.get("ИТ").size());
            assertEquals(1, groups.get("Физика").size());
        });

        runTest("testAverageGrade", () -> {
            addStudent("А", "ИТ", 4.0);
            addStudent("Б", "ИТ", 5.0);
            addStudent("В", "Физика", 3.0);

            Map<String, Double> avg = averageGradeByFaculty();
            assertEquals(4.5, avg.get("ИТ"));
            assertEquals(3.0, avg.get("Физика"));
        });

        runTest("testTopStudents", () -> {
            addStudent("Алексей", "ИТ", 4.5);
            addStudent("Мария", "ИТ", 4.8);
            addStudent("Иван", "ИТ", 3.5);

            List<String> top = topStudents(4.5);
            assertEquals(2, top.size());
            assertTrue(top.contains("Алексей"));
            assertTrue(top.contains("Мария"));
        });

        runTest("testTopStudentsNone", () -> {
            addStudent("Иван", "ИТ", 3.0);
            addStudent("Пётр", "ИТ", 2.5);

            List<String> top = topStudents(4.0);
            assertEquals(0, top.size());
        });

        runTest("testEmptyData", () -> {
            Map<String, List<String>> groups = groupByFaculty();
            assertEquals(0, groups.size());
            assertEquals(0, topStudents(4.0).size());
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы протестировали три операции над данными: группировку, вычисление средних и фильтрацию. Это типичные операции, которые в реальном коде пишутся через Stream API (groupingBy, averagingDouble, filter). Edge case — пустые данные — критически важен для предотвращения ArithmeticException при делении на ноль.'
    },
    {
      id: 6,
      title: 'Практика: Тестирование сортировки и поиска',
      type: 'practice',
      difficulty: 'medium',
      description: 'Протестируйте алгоритмы сортировки и бинарного поиска с разными данными.',
      requirements: [
        'Реализуйте bubbleSort(int[] arr) и binarySearch(int[] sortedArr, int target)',
        'Протестируйте сортировку: обычный массив, уже отсортированный, обратный порядок, дубликаты',
        'Протестируйте поиск: элемент есть, элемента нет, первый/последний элемент',
        'Проверьте пустой массив и массив из одного элемента'
      ],
      expectedOutput: 'PASS: testSortNormal\nPASS: testSortAlreadySorted\nPASS: testSortReverse\nPASS: testSortDuplicates\nPASS: testSearchFound\nPASS: testSearchNotFound\nPASS: testSearchFirstLast\nPASS: testSortEmpty\nИтого: 8/8',
      hint: 'binarySearch возвращает индекс или -1. Для проверки массива сравните поэлементно.',
      solution: `import java.util.Arrays;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Algorithms ---
    static int[] bubbleSort(int[] arr) {
        int[] result = Arrays.copyOf(arr, arr.length);
        for (int i = 0; i < result.length - 1; i++) {
            for (int j = 0; j < result.length - 1 - i; j++) {
                if (result[j] > result[j + 1]) {
                    int temp = result[j];
                    result[j] = result[j + 1];
                    result[j + 1] = temp;
                }
            }
        }
        return result;
    }

    static int binarySearch(int[] sortedArr, int target) {
        int left = 0, right = sortedArr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (sortedArr[mid] == target) return mid;
            if (sortedArr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    // --- Assertions ---
    static void assertArrayEquals(int[] expected, int[] actual) {
        if (expected.length != actual.length) {
            throw new RuntimeException("Длина: ожидали " +
                expected.length + ", получили " + actual.length);
        }
        for (int i = 0; i < expected.length; i++) {
            if (expected[i] != actual[i]) {
                throw new RuntimeException("Индекс " + i +
                    ": ожидали " + expected[i] +
                    ", получили " + actual[i]);
            }
        }
    }

    static void assertEquals(int expected, int actual) {
        if (expected != actual) {
            throw new RuntimeException(
                "Expected " + expected + ", got " + actual);
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Expected true");
    }

    static void runTest(String name, Runnable test) {
        total++;
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testSortNormal", () -> {
            assertArrayEquals(
                new int[]{1, 2, 3, 4, 5},
                bubbleSort(new int[]{5, 3, 1, 4, 2})
            );
        });

        runTest("testSortAlreadySorted", () -> {
            assertArrayEquals(
                new int[]{1, 2, 3},
                bubbleSort(new int[]{1, 2, 3})
            );
        });

        runTest("testSortReverse", () -> {
            assertArrayEquals(
                new int[]{1, 2, 3, 4},
                bubbleSort(new int[]{4, 3, 2, 1})
            );
        });

        runTest("testSortDuplicates", () -> {
            assertArrayEquals(
                new int[]{1, 1, 2, 2, 3},
                bubbleSort(new int[]{2, 1, 3, 1, 2})
            );
        });

        runTest("testSearchFound", () -> {
            int[] arr = {1, 3, 5, 7, 9};
            assertEquals(2, binarySearch(arr, 5));
        });

        runTest("testSearchNotFound", () -> {
            int[] arr = {1, 3, 5, 7, 9};
            assertEquals(-1, binarySearch(arr, 4));
        });

        runTest("testSearchFirstLast", () -> {
            int[] arr = {1, 3, 5, 7, 9};
            assertEquals(0, binarySearch(arr, 1));
            assertEquals(4, binarySearch(arr, 9));
        });

        runTest("testSortEmpty", () -> {
            assertArrayEquals(new int[]{}, bubbleSort(new int[]{}));
            assertEquals(-1, binarySearch(new int[]{}, 5));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы протестировали два алгоритма: bubbleSort и binarySearch. Для сортировки проверили: обычный массив, уже отсортированный, обратный порядок, дубликаты, пустой. Для поиска: найден, не найден, первый/последний элемент, пустой массив. Это демонстрирует системный подход к тестированию алгоритмов.'
    }
  ]
}
