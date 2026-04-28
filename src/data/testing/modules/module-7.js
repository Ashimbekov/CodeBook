export default {
  id: 7,
  title: 'Тестирование исключений и граничных случаев',
  description: 'Тестирование edge cases, null, пустых значений, границ диапазонов',
  lessons: [
    {
      id: 1,
      title: 'Граничные случаи (Edge Cases)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Граничные случаи — это крайние значения входных данных, при которых код чаще всего ломается. Хороший тестировщик проверяет не только "happy path", но и границы.' },
        { type: 'heading', value: 'Типичные граничные случаи' },
        { type: 'list', items: [
          'null — передали null вместо объекта',
          'Пустая строка "" — не null, но пусто',
          'Пустая коллекция — список без элементов',
          'Один элемент — коллекция с одним элементом',
          'Граница числа — 0, -1, Integer.MAX_VALUE, Integer.MIN_VALUE',
          'Дубликаты — одинаковые элементы в коллекции',
          'Очень большие данные — строка из 10 000 символов',
          'Специальные символы — пробелы, табуляция, юникод'
        ]},
        { type: 'heading', value: 'Паттерн: Boundary Value Analysis' },
        { type: 'code', language: 'java', value: '// Метод принимает возраст от 18 до 65\n// Тестируем ГРАНИЦЫ:\ntestAge(17);  // ниже — должен отклонить\ntestAge(18);  // на границе — должен принять\ntestAge(19);  // выше границы — должен принять\ntestAge(64);  // ниже верхней границы — принять\ntestAge(65);  // на верхней границе — принять\ntestAge(66);  // выше — должен отклонить' },
        { type: 'heading', value: 'Эквивалентное разбиение' },
        { type: 'text', value: 'Входные данные делятся на классы эквивалентности — достаточно проверить по одному значению из каждого класса.' },
        { type: 'code', language: 'java', value: '// Для возраста 18-65:\n// Класс 1: < 18 (невалидный) -> тестируем 5\n// Класс 2: 18-65 (валидный) -> тестируем 30\n// Класс 3: > 65 (невалидный) -> тестируем 80' },
        { type: 'tip', value: 'Баги прячутся на границах! 90% всех ошибок — это off-by-one (на единицу) или null pointer.' }
      ]
    },
    {
      id: 2,
      title: 'Тестирование null и пустых значений',
      type: 'theory',
      content: [
        { type: 'text', value: 'NullPointerException — #1 ошибка в Java. Каждый метод должен быть протестирован с null-аргументами.' },
        { type: 'heading', value: 'Стратегии обработки null' },
        { type: 'code', language: 'java', value: '// Стратегия 1: Бросить исключение\nString process(String input) {\n    if (input == null) {\n        throw new IllegalArgumentException("input cannot be null");\n    }\n    return input.toUpperCase();\n}\n\n// Тест:\nassertThrows(IllegalArgumentException.class,\n    () -> process(null));\n\n// Стратегия 2: Вернуть значение по умолчанию\nString processOrDefault(String input) {\n    if (input == null || input.isEmpty()) {\n        return "default";\n    }\n    return input.toUpperCase();\n}\n\n// Тест:\nassertEquals("default", processOrDefault(null));\nassertEquals("default", processOrDefault(""));' },
        { type: 'heading', value: 'Чек-лист null-тестов' },
        { type: 'list', items: [
          'null как аргумент метода',
          'null как элемент коллекции',
          'null как ключ или значение в Map',
          'null как результат зависимости (мок возвращает null)',
          'Цепочка вызовов: user.getAddress().getCity() — что если address = null?'
        ]},
        { type: 'warning', value: 'Не забывайте про пустую строку "" — это НЕ null! Проверяйте оба случая: null и "".' }
      ]
    },
    {
      id: 3,
      title: 'Тестирование числовых границ',
      type: 'theory',
      content: [
        { type: 'text', value: 'Числовые границы — источник коварных багов: переполнение, деление на ноль, дробная арифметика.' },
        { type: 'heading', value: 'Переполнение (overflow)' },
        { type: 'code', language: 'java', value: '// Integer.MAX_VALUE = 2_147_483_647\nint a = Integer.MAX_VALUE;\nint b = a + 1; // = -2_147_483_648 (переполнение!)\n\n// Тест:\nvoid testOverflow() {\n    // Наш метод должен корректно обработать\n    assertThrows(ArithmeticException.class,\n        () -> safeAdd(Integer.MAX_VALUE, 1));\n}' },
        { type: 'heading', value: 'Дробная арифметика' },
        { type: 'code', language: 'java', value: '// 0.1 + 0.2 != 0.3 в Java!\ndouble result = 0.1 + 0.2; // = 0.30000000000000004\n\n// НЕЛЬЗЯ:\nassertEquals(0.3, 0.1 + 0.2); // FAIL!\n\n// ПРАВИЛЬНО: с допуском (delta)\nassertEquals(0.3, 0.1 + 0.2, 0.0001); // PASS!\n\n// Или используйте BigDecimal для финансовых расчётов' },
        { type: 'heading', value: 'Что тестировать в числах' },
        { type: 'list', items: [
          '0 — граница между положительными и отрицательными',
          '-1 — минимальное отрицательное рядом с нулём',
          'Integer.MAX_VALUE, Integer.MIN_VALUE — пределы типа',
          'Деление на ноль',
          'Очень маленькие дробные числа (0.0001)',
          'Отрицательные значения для unsigned-операций'
        ]},
        { type: 'tip', value: 'Для денежных расчётов НИКОГДА не используйте double. Используйте BigDecimal или считайте в копейках (int cents).' }
      ]
    },
    {
      id: 4,
      title: 'Практика: Тестирование граничных случаев',
      type: 'practice',
      difficulty: 'medium',
      description: 'Протестируйте метод findMax с полным покрытием граничных случаев.',
      requirements: [
        'Создайте метод findMax(int[] array) — находит максимум в массиве',
        'Протестируйте: обычный массив, один элемент, отрицательные числа',
        'Протестируйте: null -> исключение, пустой массив -> исключение',
        'Протестируйте: MAX_VALUE, MIN_VALUE, дубликаты',
        'Минимум 7 тестов'
      ],
      expectedOutput: 'PASS: testNormalArray\nPASS: testSingleElement\nPASS: testNegativeNumbers\nPASS: testNullArray\nPASS: testEmptyArray\nPASS: testMaxValue\nPASS: testDuplicates\nИтого: 7/7',
      hint: 'findMax должен бросать IllegalArgumentException для null и пустого массива.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Expected " + expected + ", got " + actual);
        }
    }

    static void assertThrows(Runnable code) {
        try {
            code.run();
            throw new RuntimeException("Ожидали исключение");
        } catch (IllegalArgumentException e) {
            // OK — ожидаемое исключение
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Ожидали исключение")) throw e;
        }
    }

    // --- Тестируемый код ---
    static int findMax(int[] array) {
        if (array == null || array.length == 0) {
            throw new IllegalArgumentException(
                "Массив не может быть null или пустым");
        }
        int max = array[0];
        for (int i = 1; i < array.length; i++) {
            if (array[i] > max) max = array[i];
        }
        return max;
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
        runTest("testNormalArray", () -> {
            assertEquals(5, findMax(new int[]{1, 3, 5, 2, 4}));
        });

        runTest("testSingleElement", () -> {
            assertEquals(42, findMax(new int[]{42}));
        });

        runTest("testNegativeNumbers", () -> {
            assertEquals(-1, findMax(new int[]{-5, -3, -1, -10}));
        });

        runTest("testNullArray", () -> {
            assertThrows(() -> findMax(null));
        });

        runTest("testEmptyArray", () -> {
            assertThrows(() -> findMax(new int[]{}));
        });

        runTest("testMaxValue", () -> {
            assertEquals(Integer.MAX_VALUE,
                findMax(new int[]{1, Integer.MAX_VALUE, 100}));
        });

        runTest("testDuplicates", () -> {
            assertEquals(5, findMax(new int[]{5, 5, 5, 5}));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы протестировали findMax с 7 граничными случаями: нормальный, один элемент, отрицательные, null, пустой массив, MAX_VALUE, дубликаты. Это полное покрытие edge cases. В реальных проектах такой набор тестов предотвращает 95% багов.'
    },
    {
      id: 5,
      title: 'Практика: Тестирование валидатора',
      type: 'practice',
      difficulty: 'medium',
      description: 'Протестируйте валидатор возраста с полным покрытием граничных значений (Boundary Value Analysis).',
      requirements: [
        'Метод validateAge(int age) — валидный возраст: 0-150',
        'Возвращает строку: "valid" или сообщение об ошибке',
        'Протестируйте все граничные значения: -1, 0, 1, 149, 150, 151',
        'Протестируйте экстремальные: Integer.MIN_VALUE, Integer.MAX_VALUE',
        'Протестируйте классы эквивалентности: отрицательные, нормальные, слишком большие'
      ],
      expectedOutput: 'PASS: testBoundary_minus1\nPASS: testBoundary_0\nPASS: testBoundary_1\nPASS: testBoundary_149\nPASS: testBoundary_150\nPASS: testBoundary_151\nPASS: testExtreme_minValue\nPASS: testExtreme_maxValue\nPASS: testEquivalence_normal\nИтого: 9/9',
      hint: 'Для каждой границы проверяйте: значение на границе, значение на 1 меньше, значение на 1 больше.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Expected [" + expected + "], got [" + actual + "]");
        }
    }

    // --- Тестируемый код ---
    static String validateAge(int age) {
        if (age < 0) return "Возраст не может быть отрицательным";
        if (age > 150) return "Возраст не может быть больше 150";
        return "valid";
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
        // Boundary Value Analysis: нижняя граница (0)
        runTest("testBoundary_minus1", () -> {
            assertEquals("Возраст не может быть отрицательным",
                validateAge(-1));
        });

        runTest("testBoundary_0", () -> {
            assertEquals("valid", validateAge(0));
        });

        runTest("testBoundary_1", () -> {
            assertEquals("valid", validateAge(1));
        });

        // Boundary Value Analysis: верхняя граница (150)
        runTest("testBoundary_149", () -> {
            assertEquals("valid", validateAge(149));
        });

        runTest("testBoundary_150", () -> {
            assertEquals("valid", validateAge(150));
        });

        runTest("testBoundary_151", () -> {
            assertEquals("Возраст не может быть больше 150",
                validateAge(151));
        });

        // Экстремальные значения
        runTest("testExtreme_minValue", () -> {
            assertEquals("Возраст не может быть отрицательным",
                validateAge(Integer.MIN_VALUE));
        });

        runTest("testExtreme_maxValue", () -> {
            assertEquals("Возраст не может быть больше 150",
                validateAge(Integer.MAX_VALUE));
        });

        // Класс эквивалентности: нормальный возраст
        runTest("testEquivalence_normal", () -> {
            assertEquals("valid", validateAge(25));
            assertEquals("valid", validateAge(50));
            assertEquals("valid", validateAge(75));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Мы применили Boundary Value Analysis: для каждой границы (0 и 150) проверили значение на границе, на 1 меньше и на 1 больше. Также проверили экстремальные значения (MIN/MAX_VALUE) и нормальный класс эквивалентности. Это системный подход к тестированию.'
    },
    {
      id: 6,
      title: 'Практика: Тестирование строкового парсера',
      type: 'practice',
      difficulty: 'hard',
      description: 'Протестируйте парсер CSV-строки с полным набором edge cases.',
      requirements: [
        'Метод parseCsv(String line) — разбивает CSV на массив значений',
        'Обработка null, пустой строки, строки с пробелами',
        'Обработка запятых в начале/конце: ",a,b" -> ["", "a", "b"]',
        'Обработка пробелов вокруг значений: " a , b " -> ["a", "b"]',
        'Обработка только запятых: ",,," -> ["", "", "", ""]',
        'Минимум 8 тестов'
      ],
      expectedOutput: 'PASS: testNormal\nPASS: testNull\nPASS: testEmpty\nPASS: testSingleValue\nPASS: testLeadingComma\nPASS: testTrailingComma\nPASS: testSpaces\nPASS: testOnlyCommas\nИтого: 8/8',
      hint: 'split(",", -1) сохранит пустые строки в конце. trim() уберёт пробелы.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Expected [" + expected + "], got [" + actual + "]");
        }
    }

    static void assertArrayEquals(String[] expected, String[] actual) {
        if (expected.length != actual.length) {
            throw new RuntimeException(
                "Длина: ожидали " + expected.length +
                ", получили " + actual.length);
        }
        for (int i = 0; i < expected.length; i++) {
            if (!expected[i].equals(actual[i])) {
                throw new RuntimeException(
                    "Индекс " + i + ": ожидали [" + expected[i] +
                    "], получили [" + actual[i] + "]");
            }
        }
    }

    static void assertNull(Object obj) {
        if (obj != null) {
            throw new RuntimeException("Ожидали null");
        }
    }

    // --- Тестируемый код ---
    static String[] parseCsv(String line) {
        if (line == null) return null;
        if (line.isEmpty()) return new String[]{""};

        String[] parts = line.split(",", -1);
        for (int i = 0; i < parts.length; i++) {
            parts[i] = parts[i].trim();
        }
        return parts;
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
        runTest("testNormal", () -> {
            assertArrayEquals(
                new String[]{"a", "b", "c"},
                parseCsv("a,b,c")
            );
        });

        runTest("testNull", () -> {
            assertNull(parseCsv(null));
        });

        runTest("testEmpty", () -> {
            assertArrayEquals(
                new String[]{""},
                parseCsv("")
            );
        });

        runTest("testSingleValue", () -> {
            assertArrayEquals(
                new String[]{"hello"},
                parseCsv("hello")
            );
        });

        runTest("testLeadingComma", () -> {
            assertArrayEquals(
                new String[]{"", "a", "b"},
                parseCsv(",a,b")
            );
        });

        runTest("testTrailingComma", () -> {
            assertArrayEquals(
                new String[]{"a", "b", ""},
                parseCsv("a,b,")
            );
        });

        runTest("testSpaces", () -> {
            assertArrayEquals(
                new String[]{"a", "b", "c"},
                parseCsv(" a , b , c ")
            );
        });

        runTest("testOnlyCommas", () -> {
            assertArrayEquals(
                new String[]{"", "", "", ""},
                parseCsv(",,,")
            );
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'CSV-парсер — отличный пример для edge case тестирования. Мы проверили: null, пустую строку, один элемент, запятые в начале/конце, пробелы, только запятые. split(",", -1) — ключевой трюк: без -1 пустые строки в конце будут отброшены. В реальных проектах парсинг CSV — источник множества багов.'
    }
  ]
}
