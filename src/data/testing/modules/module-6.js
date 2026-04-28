export default {
  id: 6,
  title: 'TDD: Test-Driven Development',
  description: 'Цикл Red-Green-Refactor, написание тестов перед кодом, практика TDD',
  lessons: [
    {
      id: 1,
      title: 'Что такое TDD?',
      type: 'theory',
      content: [
        { type: 'text', value: 'TDD (Test-Driven Development) — методология, при которой тесты пишутся ДО кода. Сначала пишете тест, потом — минимальный код, чтобы тест прошёл.' },
        { type: 'heading', value: 'Цикл Red-Green-Refactor' },
        { type: 'code', language: 'text', value: '🔴 RED    → Напиши тест, который ПАДАЕТ\n🟢 GREEN  → Напиши МИНИМАЛЬНЫЙ код, чтобы тест прошёл\n🔵 REFACTOR → Улучши код, не ломая тесты\n\nПовтори цикл для следующего требования.' },
        { type: 'heading', value: 'Пример цикла TDD' },
        { type: 'code', language: 'java', value: '// Шаг 1 (RED): пишем тест — компилируется, но падает\nvoid testAdd() {\n    Calculator calc = new Calculator();\n    assertEquals(5, calc.add(2, 3)); // FAIL: метод не существует\n}\n\n// Шаг 2 (GREEN): минимальный код\nint add(int a, int b) {\n    return a + b; // тест проходит!\n}\n\n// Шаг 3 (REFACTOR): улучшаем (если нужно)\n// В данном случае код уже простой' },
        { type: 'heading', value: 'Преимущества TDD' },
        { type: 'list', items: [
          'Код всегда покрыт тестами — 100% по определению',
          'Простой дизайн — пишете только то, что нужно',
          'Быстрая обратная связь — баги находятся сразу',
          'Документация — тесты описывают, что код ДОЛЖЕН делать',
          'Уверенность при рефакторинге'
        ]},
        { type: 'warning', value: 'TDD — это дисциплина. Не пишите код до теста! Даже если "и так понятно". Соблюдайте цикл строго.' }
      ]
    },
    {
      id: 2,
      title: 'Baby Steps: маленькие шаги',
      type: 'theory',
      content: [
        { type: 'text', value: 'Главное правило TDD: делайте маленькие шаги. Один тест — одно поведение. Не пытайтесь реализовать всё сразу.' },
        { type: 'heading', value: 'Пример: FizzBuzz через TDD' },
        { type: 'code', language: 'java', value: '// Итерация 1: обычное число\n// RED: тест\nvoid testNumber() {\n    assertEquals("1", fizzBuzz(1));\n}\n// GREEN: код\nString fizzBuzz(int n) { return String.valueOf(n); }\n\n// Итерация 2: делится на 3\n// RED: тест\nvoid testFizz() {\n    assertEquals("Fizz", fizzBuzz(3));\n}\n// GREEN: код\nString fizzBuzz(int n) {\n    if (n % 3 == 0) return "Fizz";\n    return String.valueOf(n);\n}\n\n// Итерация 3: делится на 5\n// RED: тест\nvoid testBuzz() {\n    assertEquals("Buzz", fizzBuzz(5));\n}\n// GREEN: код\nString fizzBuzz(int n) {\n    if (n % 3 == 0) return "Fizz";\n    if (n % 5 == 0) return "Buzz";\n    return String.valueOf(n);\n}\n\n// Итерация 4: делится на 15\n// RED: тест\nvoid testFizzBuzz() {\n    assertEquals("FizzBuzz", fizzBuzz(15));\n}\n// GREEN: код\nString fizzBuzz(int n) {\n    if (n % 15 == 0) return "FizzBuzz";\n    if (n % 3 == 0) return "Fizz";\n    if (n % 5 == 0) return "Buzz";\n    return String.valueOf(n);\n}' },
        { type: 'heading', value: 'Правила Baby Steps' },
        { type: 'list', items: [
          'Один тест за раз — не пишите 10 тестов сразу',
          'Минимальный код — пишите ровно столько, чтобы тест прошёл',
          'Не предвосхищайте — решайте только текущую задачу',
          'Рефакторите после каждого зелёного теста'
        ]},
        { type: 'tip', value: 'Если вы в GREEN фазе пишете больше кода, чем нужно для текущего теста — остановитесь. Лишний код = лишняя сложность без покрытия.' }
      ]
    },
    {
      id: 3,
      title: 'Треугольник TDD',
      type: 'theory',
      content: [
        { type: 'text', value: 'Треугольник (Triangulation) — техника TDD, когда вы добавляете тесты с разными данными, чтобы "вынудить" обобщение кода.' },
        { type: 'heading', value: 'Пример: метод max()' },
        { type: 'code', language: 'java', value: '// Тест 1:\nvoid testMax_firstGreater() {\n    assertEquals(5, max(5, 3));\n}\n// Можно написать: return a; // тест пройдёт!\nint max(int a, int b) { return a; }\n\n// Тест 2 — триангуляция!\nvoid testMax_secondGreater() {\n    assertEquals(7, max(4, 7));\n}\n// Теперь return a; не работает.\n// Нужно обобщить:\nint max(int a, int b) { return a > b ? a : b; }' },
        { type: 'heading', value: 'Зачем триангуляция?' },
        { type: 'text', value: 'Без второго теста можно было написать return a; и тест прошёл бы. Триангуляция заставляет писать правильный алгоритм.' },
        { type: 'heading', value: 'Стратегии GREEN-фазы' },
        { type: 'list', items: [
          'Fake it — верните константу: return 5;',
          'Obvious implementation — если очевидно, пишите сразу',
          'Triangulation — добавьте тест, который ломает fake'
        ]},
        { type: 'note', value: 'Fake it кажется глупым, но это осознанная стратегия. Она помогает фокусироваться на одном шаге и не забегать вперёд.' }
      ]
    },
    {
      id: 4,
      title: 'Когда НЕ использовать TDD',
      type: 'theory',
      content: [
        { type: 'text', value: 'TDD — мощный инструмент, но не серебряная пуля. Есть ситуации, когда TDD неэффективен.' },
        { type: 'heading', value: 'TDD НЕ подходит для:' },
        { type: 'list', items: [
          'Прототипы и эксперименты — код будет выброшен',
          'UI/верстка — визуальные тесты лучше ручных',
          'Spike (исследование) — когда не знаете, что тестировать',
          'Тривиальный код — getters/setters, toString',
          'Код с сильной зависимостью от внешних систем без абстракций'
        ]},
        { type: 'heading', value: 'TDD отлично подходит для:' },
        { type: 'list', items: [
          'Бизнес-логика — скидки, расчёты, правила',
          'Алгоритмы — сортировка, поиск, обработка данных',
          'Валидация — проверка входных данных',
          'Сервисный слой — UserService, OrderService',
          'Утилиты — StringUtils, DateUtils'
        ]},
        { type: 'heading', value: 'Распространённые ошибки TDD' },
        { type: 'list', items: [
          'Тест проверяет реализацию, а не поведение — хрупкий тест',
          'Слишком большие шаги — пишут много кода за раз',
          'Пропускают рефакторинг — GREEN достаточно, забывают REFACTOR',
          'Тестируют private-методы — тестируйте через public API'
        ]},
        { type: 'tip', value: 'TDD — это навык, который требует практики. Первые разы будет медленно и неестественно. Через 2-3 недели станет привычкой.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: TDD — StringCalculator',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте StringCalculator в стиле TDD. Каждый тест добавляет новое требование, код пишется после теста.',
      requirements: [
        'Метод add(String numbers): принимает строку чисел, разделённых запятыми',
        'Пустая строка -> 0',
        '"1" -> 1',
        '"1,2" -> 3',
        '"1,2,3,4,5" -> 15',
        'Покажите процесс TDD: каждый тест -> минимальный код'
      ],
      expectedOutput: 'TDD Iteration 1: testEmptyString\n  RED -> GREEN: PASS\nTDD Iteration 2: testSingleNumber\n  RED -> GREEN: PASS\nTDD Iteration 3: testTwoNumbers\n  RED -> GREEN: PASS\nTDD Iteration 4: testMultipleNumbers\n  RED -> GREEN: PASS\nTDD Iteration 5: testWithSpaces\n  RED -> GREEN: PASS\nTDD Complete: 5/5 тестов пройдено',
      hint: 'Начните с return 0, потом Integer.parseInt, потом split и цикл.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    static void assertEquals(int expected, int actual) {
        if (expected != actual) {
            throw new RuntimeException(
                "Expected " + expected + ", got " + actual);
        }
    }

    // --- StringCalculator (развивается через TDD) ---
    static int add(String numbers) {
        // Итерация 1: пустая строка -> 0
        if (numbers == null || numbers.trim().isEmpty()) {
            return 0;
        }

        // Итерация 2-4: парсим и суммируем
        String[] parts = numbers.split(",");
        int sum = 0;
        for (String part : parts) {
            sum += Integer.parseInt(part.trim());
        }
        return sum;
    }

    static void tddIteration(int num, String testName, Runnable test) {
        total++;
        System.out.println("TDD Iteration " + num + ": " + testName);
        try {
            test.run();
            passed++;
            System.out.println("  RED -> GREEN: PASS");
        } catch (Exception e) {
            System.out.println("  RED -> GREEN: FAIL - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        // Итерация 1: пустая строка
        tddIteration(1, "testEmptyString", () -> {
            assertEquals(0, add(""));
            assertEquals(0, add(null));
        });

        // Итерация 2: одно число
        tddIteration(2, "testSingleNumber", () -> {
            assertEquals(1, add("1"));
            assertEquals(42, add("42"));
        });

        // Итерация 3: два числа
        tddIteration(3, "testTwoNumbers", () -> {
            assertEquals(3, add("1,2"));
            assertEquals(15, add("7,8"));
        });

        // Итерация 4: много чисел
        tddIteration(4, "testMultipleNumbers", () -> {
            assertEquals(15, add("1,2,3,4,5"));
            assertEquals(10, add("1,1,1,1,1,1,1,1,1,1"));
        });

        // Итерация 5: пробелы
        tddIteration(5, "testWithSpaces", () -> {
            assertEquals(6, add("1 , 2 , 3"));
            assertEquals(3, add(" 1 , 2 "));
        });

        System.out.println("TDD Complete: " + passed + "/" + total
            + " тестов пройдено");
    }
}`,
      explanation: 'Мы прошли классическую TDD-кату "StringCalculator". Каждая итерация добавляет требование: пустая строка, одно число, два, много, пробелы. Код add() эволюционирует от return 0 до полного решения. Это типичный пример baby steps в TDD.'
    },
    {
      id: 6,
      title: 'Практика: TDD — PasswordValidator',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте валидатор паролей через TDD. Каждая итерация добавляет новое правило.',
      requirements: [
        'Минимум 8 символов',
        'Содержит хотя бы одну заглавную букву',
        'Содержит хотя бы одну цифру',
        'Содержит хотя бы один спецсимвол (!@#$%)',
        'Метод validate(password) возвращает список ошибок',
        'Покажите TDD-итерации'
      ],
      expectedOutput: 'TDD 1: testTooShort -> PASS\nTDD 2: testNoUpperCase -> PASS\nTDD 3: testNoDigit -> PASS\nTDD 4: testNoSpecialChar -> PASS\nTDD 5: testValidPassword -> PASS\nTDD 6: testMultipleErrors -> PASS\nTDD Complete: 6/6',
      hint: 'validate возвращает List<String> с сообщениями об ошибках. Пустой список = пароль валиден.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static int passed = 0;
    static int total = 0;

    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Expected [" + expected + "], got [" + actual + "]");
        }
    }

    static void assertTrue(boolean c, String msg) {
        if (!c) throw new RuntimeException(msg);
    }

    // --- PasswordValidator (TDD) ---
    static List<String> validate(String password) {
        List<String> errors = new ArrayList<>();

        if (password == null || password.length() < 8) {
            errors.add("Минимум 8 символов");
        }

        if (password == null || !password.chars().anyMatch(Character::isUpperCase)) {
            errors.add("Нужна заглавная буква");
        }

        if (password == null || !password.chars().anyMatch(Character::isDigit)) {
            errors.add("Нужна цифра");
        }

        String specials = "!@#$%^&*";
        if (password == null || password.chars().noneMatch(c -> specials.indexOf(c) >= 0)) {
            errors.add("Нужен спецсимвол");
        }

        return errors;
    }

    static void tddTest(int num, String name, Runnable test) {
        total++;
        try {
            test.run();
            passed++;
            System.out.println("TDD " + num + ": " + name + " -> PASS");
        } catch (Exception e) {
            System.out.println("TDD " + num + ": " + name + " -> FAIL - "
                + e.getMessage());
        }
    }

    public static void main(String[] args) {
        // Итерация 1: слишком короткий
        tddTest(1, "testTooShort", () -> {
            List<String> errors = validate("Ab1!");
            assertTrue(errors.contains("Минимум 8 символов"),
                "Должна быть ошибка о длине");
        });

        // Итерация 2: нет заглавной
        tddTest(2, "testNoUpperCase", () -> {
            List<String> errors = validate("abcdefg1!");
            assertTrue(errors.contains("Нужна заглавная буква"),
                "Должна быть ошибка о заглавной");
        });

        // Итерация 3: нет цифры
        tddTest(3, "testNoDigit", () -> {
            List<String> errors = validate("Abcdefgh!");
            assertTrue(errors.contains("Нужна цифра"),
                "Должна быть ошибка о цифре");
        });

        // Итерация 4: нет спецсимвола
        tddTest(4, "testNoSpecialChar", () -> {
            List<String> errors = validate("Abcdefg1");
            assertTrue(errors.contains("Нужен спецсимвол"),
                "Должна быть ошибка о спецсимволе");
        });

        // Итерация 5: валидный пароль
        tddTest(5, "testValidPassword", () -> {
            List<String> errors = validate("Abcdef1!");
            assertTrue(errors.isEmpty(),
                "Валидный пароль не должен иметь ошибок");
        });

        // Итерация 6: несколько ошибок
        tddTest(6, "testMultipleErrors", () -> {
            List<String> errors = validate("abc");
            assertEquals(4, errors.size());
        });

        System.out.println("TDD Complete: " + passed + "/" + total);
    }
}`,
      explanation: 'Валидатор паролей — идеальная задача для TDD. Каждое правило — отдельная итерация: длина, заглавная буква, цифра, спецсимвол. Метод validate возвращает СПИСОК ошибок, а не boolean — это позволяет пользователю увидеть ВСЕ проблемы сразу, а не по одной.'
    },
    {
      id: 7,
      title: 'Практика: TDD — RomanNumerals',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте конвертер арабских чисел в римские через TDD. Классическая TDD-ката.',
      requirements: [
        '1 -> "I", 2 -> "II", 3 -> "III"',
        '4 -> "IV", 5 -> "V", 9 -> "IX"',
        '10 -> "X", 40 -> "XL", 50 -> "L"',
        '100 -> "C", 500 -> "D", 1000 -> "M"',
        'Сложные: 1994 -> "MCMXCIV", 3999 -> "MMMCMXCIX"',
        'Покажите пошаговый TDD-процесс'
      ],
      expectedOutput: 'TDD 1: simple (I,II,III) -> PASS\nTDD 2: subtractive (IV,IX) -> PASS\nTDD 3: tens (X,XL,L,XC) -> PASS\nTDD 4: hundreds (C,CD,D,CM) -> PASS\nTDD 5: thousands (M) -> PASS\nTDD 6: complex numbers -> PASS\nTDD Complete: 6/6',
      hint: 'Используйте массив пар [значение, символ] от большего к меньшему: {1000,"M"}, {900,"CM"}, {500,"D"} и т.д.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Expected [" + expected + "], got [" + actual + "]");
        }
    }

    // --- RomanNumerals (TDD-ката) ---
    static int[] values =    {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
    static String[] symbols = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};

    static String toRoman(int number) {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < values.length; i++) {
            while (number >= values[i]) {
                result.append(symbols[i]);
                number -= values[i];
            }
        }
        return result.toString();
    }

    static void tddTest(int num, String name, Runnable test) {
        total++;
        try {
            test.run();
            passed++;
            System.out.println("TDD " + num + ": " + name + " -> PASS");
        } catch (Exception e) {
            System.out.println("TDD " + num + ": " + name +
                " -> FAIL - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        tddTest(1, "simple (I,II,III)", () -> {
            assertEquals("I", toRoman(1));
            assertEquals("II", toRoman(2));
            assertEquals("III", toRoman(3));
        });

        tddTest(2, "subtractive (IV,IX)", () -> {
            assertEquals("IV", toRoman(4));
            assertEquals("V", toRoman(5));
            assertEquals("IX", toRoman(9));
        });

        tddTest(3, "tens (X,XL,L,XC)", () -> {
            assertEquals("X", toRoman(10));
            assertEquals("XL", toRoman(40));
            assertEquals("L", toRoman(50));
            assertEquals("XC", toRoman(90));
        });

        tddTest(4, "hundreds (C,CD,D,CM)", () -> {
            assertEquals("C", toRoman(100));
            assertEquals("CD", toRoman(400));
            assertEquals("D", toRoman(500));
            assertEquals("CM", toRoman(900));
        });

        tddTest(5, "thousands (M)", () -> {
            assertEquals("M", toRoman(1000));
            assertEquals("MM", toRoman(2000));
            assertEquals("MMM", toRoman(3000));
        });

        tddTest(6, "complex numbers", () -> {
            assertEquals("MCMXCIV", toRoman(1994));
            assertEquals("MMMCMXCIX", toRoman(3999));
            assertEquals("XLII", toRoman(42));
            assertEquals("CDXLIV", toRoman(444));
        });

        System.out.println("TDD Complete: " + passed + "/" + total);
    }
}`,
      explanation: 'RomanNumerals — классическая TDD-ката. Через итерации мы "открываем" элегантный алгоритм с массивами values/symbols. Каждая итерация добавляет уровень: единицы, десятки, сотни, тысячи. Алгоритм вычитания (жадный) появляется естественно через TDD.'
    }
  ]
}
