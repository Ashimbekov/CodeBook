export default {
  id: 13,
  title: 'Практикум: Unit-тесты',
  description: 'Практические задачи на unit-тестирование: тестирование калькулятора, строковых утилит, коллекций, валидаторов и других базовых компонентов',
  lessons: [
    {
      id: 1,
      title: 'Тестирование калькулятора',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте калькулятор с операциями add, subtract, multiply, divide и напишите полный набор unit-тестов, включая деление на ноль.',
      requirements: [
        'Реализуйте методы: add, subtract, multiply, divide (возвращают double)',
        'Создайте assertEquals и assertThrows хелперы',
        'Напишите тесты для каждой операции с положительными и отрицательными числами',
        'Протестируйте деление на ноль — должно бросать ArithmeticException',
        'Протестируйте операции с нулём: add(0, 5), multiply(0, 100)',
        'Все тесты следуют паттерну AAA'
      ],
      expectedOutput: 'PASS: testAdd\nPASS: testAddNegative\nPASS: testSubtract\nPASS: testMultiply\nPASS: testMultiplyByZero\nPASS: testDivide\nPASS: testDivideByZero\nPASS: testDivideNegative\nИтого: 8/8',
      hint: 'Для assertThrows оберните вызов в try-catch. Если исключение не выброшено — тест провален. Если выброшено ожидаемое исключение — тест пройден.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Калькулятор ---
    static double add(double a, double b) { return a + b; }
    static double subtract(double a, double b) { return a - b; }
    static double multiply(double a, double b) { return a * b; }
    static double divide(double a, double b) {
        if (b == 0) throw new ArithmeticException("Деление на ноль");
        return a / b;
    }

    // --- Хелперы ---
    static void assertEquals(double expected, double actual) {
        if (Math.abs(expected - actual) > 0.0001) {
            throw new RuntimeException(
                "Ожидали " + expected + ", получили " + actual);
        }
    }

    static void assertThrows(Class<? extends Exception> expected, Runnable code) {
        try {
            code.run();
            throw new RuntimeException(
                "Ожидали исключение " + expected.getSimpleName() + ", но оно не было выброшено");
        } catch (Exception e) {
            if (!expected.isInstance(e)) {
                throw new RuntimeException(
                    "Ожидали " + expected.getSimpleName() + ", получили " + e.getClass().getSimpleName());
            }
        }
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
        runTest("testAdd", () -> {
            // Arrange & Act & Assert
            assertEquals(5.0, add(2, 3));
            assertEquals(0.0, add(0, 0));
        });

        runTest("testAddNegative", () -> {
            assertEquals(-1.0, add(-3, 2));
            assertEquals(-5.0, add(-2, -3));
        });

        runTest("testSubtract", () -> {
            assertEquals(7.0, subtract(10, 3));
            assertEquals(-3.0, subtract(2, 5));
        });

        runTest("testMultiply", () -> {
            assertEquals(12.0, multiply(3, 4));
            assertEquals(-6.0, multiply(-2, 3));
        });

        runTest("testMultiplyByZero", () -> {
            assertEquals(0.0, multiply(0, 100));
            assertEquals(0.0, multiply(999, 0));
        });

        runTest("testDivide", () -> {
            assertEquals(5.0, divide(10, 2));
            assertEquals(2.5, divide(5, 2));
        });

        runTest("testDivideByZero", () -> {
            assertThrows(ArithmeticException.class, () -> divide(10, 0));
        });

        runTest("testDivideNegative", () -> {
            assertEquals(-5.0, divide(-10, 2));
            assertEquals(5.0, divide(-10, -2));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Калькулятор — классический пример для unit-тестов. Мы тестируем каждую операцию отдельно, включая граничные случаи (ноль, отрицательные числа, деление на ноль). assertThrows проверяет, что исключение выброшено — важный паттерн для тестирования ошибок.'
    },
    {
      id: 2,
      title: 'Тестирование строковых утилит',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте класс StringUtils с методами обработки строк и напишите тесты для каждого метода, включая null и пустые строки.',
      requirements: [
        'Реализуйте: reverse(String), capitalize(String), countWords(String), isPalindrome(String)',
        'reverse — переворачивает строку',
        'capitalize — первая буква заглавная, остальные строчные',
        'countWords — количество слов (разделитель — пробел)',
        'isPalindrome — проверяет палиндром (без учёта регистра)',
        'Протестируйте null, пустые строки, одно слово, специальные случаи'
      ],
      expectedOutput: 'PASS: testReverse\nPASS: testReverseEmpty\nPASS: testCapitalize\nPASS: testCapitalizeNull\nPASS: testCountWords\nPASS: testCountWordsEmpty\nPASS: testIsPalindrome\nPASS: testIsNotPalindrome\nИтого: 8/8',
      hint: 'Для reverse используйте StringBuilder.reverse(). Для countWords разделите строку по пробелу с помощью split и отфильтруйте пустые элементы.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    // --- StringUtils ---
    static String reverse(String s) {
        if (s == null) return null;
        return new StringBuilder(s).reverse().toString();
    }

    static String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
    }

    static int countWords(String s) {
        if (s == null || s.trim().isEmpty()) return 0;
        return s.trim().split("\\\\s+").length;
    }

    static boolean isPalindrome(String s) {
        if (s == null) return false;
        String lower = s.toLowerCase().replaceAll("\\\\s+", "");
        return lower.equals(new StringBuilder(lower).reverse().toString());
    }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (expected == null && actual == null) return;
        if (expected == null || !expected.equals(actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Ожидали true");
    }

    static void assertFalse(boolean c) {
        if (c) throw new RuntimeException("Ожидали false");
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
        runTest("testReverse", () -> {
            assertEquals("olleh", reverse("hello"));
            assertEquals("a", reverse("a"));
        });

        runTest("testReverseEmpty", () -> {
            assertEquals("", reverse(""));
            assertEquals(null, reverse(null));
        });

        runTest("testCapitalize", () -> {
            assertEquals("Hello", capitalize("hello"));
            assertEquals("Hello", capitalize("HELLO"));
            assertEquals("Java", capitalize("jAVA"));
        });

        runTest("testCapitalizeNull", () -> {
            assertEquals(null, capitalize(null));
            assertEquals("", capitalize(""));
        });

        runTest("testCountWords", () -> {
            assertEquals(3, countWords("hello world java"));
            assertEquals(1, countWords("hello"));
        });

        runTest("testCountWordsEmpty", () -> {
            assertEquals(0, countWords(""));
            assertEquals(0, countWords(null));
            assertEquals(0, countWords("   "));
        });

        runTest("testIsPalindrome", () -> {
            assertTrue(isPalindrome("madam"));
            assertTrue(isPalindrome("Racecar"));
            assertTrue(isPalindrome("A"));
        });

        runTest("testIsNotPalindrome", () -> {
            assertFalse(isPalindrome("hello"));
            assertFalse(isPalindrome(null));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Строковые утилиты — частый объект unit-тестирования. Каждый метод тестируется отдельно. Обратите внимание на тестирование null и пустых строк — это граничные случаи, которые часто вызывают NullPointerException. isPalindrome приведён к нижнему регистру для корректного сравнения.'
    },
    {
      id: 3,
      title: 'Тестирование коллекций',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте утилиты для работы с коллекциями и напишите unit-тесты: поиск максимума, фильтрация, удаление дубликатов.',
      requirements: [
        'Реализуйте: findMax(List<Integer>), filterPositive(List<Integer>), removeDuplicates(List<Integer>), sum(List<Integer>)',
        'findMax — возвращает максимальный элемент (исключение для пустого списка)',
        'filterPositive — возвращает только положительные числа',
        'removeDuplicates — удаляет дубликаты, сохраняя порядок',
        'sum — сумма всех элементов',
        'Протестируйте пустые списки, один элемент, отрицательные числа'
      ],
      expectedOutput: 'PASS: testFindMax\nPASS: testFindMaxSingleElement\nPASS: testFindMaxEmpty\nPASS: testFilterPositive\nPASS: testRemoveDuplicates\nPASS: testSum\nPASS: testSumEmpty\nИтого: 7/7',
      hint: 'Для removeDuplicates используйте LinkedHashSet — он сохраняет порядок добавления. Для filterPositive пройдитесь по списку и добавьте только элементы > 0.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Collection Utils ---
    static int findMax(List<Integer> list) {
        if (list == null || list.isEmpty()) {
            throw new IllegalArgumentException("Список пуст");
        }
        int max = list.get(0);
        for (int n : list) {
            if (n > max) max = n;
        }
        return max;
    }

    static List<Integer> filterPositive(List<Integer> list) {
        if (list == null) return new ArrayList<>();
        List<Integer> result = new ArrayList<>();
        for (int n : list) {
            if (n > 0) result.add(n);
        }
        return result;
    }

    static List<Integer> removeDuplicates(List<Integer> list) {
        if (list == null) return new ArrayList<>();
        return new ArrayList<>(new LinkedHashSet<>(list));
    }

    static int sum(List<Integer> list) {
        if (list == null || list.isEmpty()) return 0;
        int s = 0;
        for (int n : list) s += n;
        return s;
    }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (!Objects.equals(expected, actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertThrows(Class<? extends Exception> expected, Runnable code) {
        try {
            code.run();
            throw new RuntimeException("Ожидали исключение " + expected.getSimpleName());
        } catch (Exception e) {
            if (!expected.isInstance(e)) {
                throw new RuntimeException(
                    "Ожидали " + expected.getSimpleName() + ", получили " + e.getClass().getSimpleName());
            }
        }
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
        runTest("testFindMax", () -> {
            assertEquals(9, findMax(Arrays.asList(3, 7, 1, 9, 4)));
            assertEquals(5, findMax(Arrays.asList(-1, 5, 3)));
        });

        runTest("testFindMaxSingleElement", () -> {
            assertEquals(42, findMax(Arrays.asList(42)));
        });

        runTest("testFindMaxEmpty", () -> {
            assertThrows(IllegalArgumentException.class,
                () -> findMax(new ArrayList<>()));
        });

        runTest("testFilterPositive", () -> {
            List<Integer> result = filterPositive(
                Arrays.asList(-3, 0, 5, -1, 8, 2));
            assertEquals(Arrays.asList(5, 8, 2), result);
        });

        runTest("testRemoveDuplicates", () -> {
            List<Integer> result = removeDuplicates(
                Arrays.asList(1, 2, 3, 2, 1, 4));
            assertEquals(Arrays.asList(1, 2, 3, 4), result);
        });

        runTest("testSum", () -> {
            assertEquals(15, sum(Arrays.asList(1, 2, 3, 4, 5)));
            assertEquals(-3, sum(Arrays.asList(-1, -2, 0)));
        });

        runTest("testSumEmpty", () -> {
            assertEquals(0, sum(new ArrayList<>()));
            assertEquals(0, sum(null));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Тестирование коллекций требует проверки разных состояний: пустой список, один элемент, много элементов, отрицательные числа, дубликаты. findMax бросает исключение для пустого списка — это проверяется через assertThrows. removeDuplicates использует LinkedHashSet для сохранения порядка.'
    },
    {
      id: 4,
      title: 'Тестирование валидатора паролей',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте валидатор паролей с несколькими правилами и протестируйте все граничные случаи.',
      requirements: [
        'Реализуйте метод validatePassword(String), который возвращает список ошибок (List<String>)',
        'Правила: минимум 8 символов, хотя бы одна заглавная буква, одна строчная, одна цифра, один спецсимвол',
        'Пустой список ошибок = пароль валидный',
        'Протестируйте: идеальный пароль, слишком короткий, без цифр, без заглавных, null',
        'Каждый тест проверяет конкретное правило'
      ],
      expectedOutput: 'PASS: testValidPassword\nPASS: testTooShort\nPASS: testNoUpperCase\nPASS: testNoDigit\nPASS: testNoSpecialChar\nPASS: testNullPassword\nPASS: testAllRulesFailed\nИтого: 7/7',
      hint: 'Пройдитесь по символам пароля, проверяя Character.isUpperCase, isLowerCase, isDigit. Специальный символ — всё, что не буква и не цифра.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Валидатор паролей ---
    static List<String> validatePassword(String password) {
        List<String> errors = new ArrayList<>();
        if (password == null || password.isEmpty()) {
            errors.add("Пароль не может быть пустым");
            return errors;
        }
        if (password.length() < 8) {
            errors.add("Минимум 8 символов");
        }
        boolean hasUpper = false, hasLower = false;
        boolean hasDigit = false, hasSpecial = false;
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isLowerCase(c)) hasLower = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else hasSpecial = true;
        }
        if (!hasUpper) errors.add("Нужна заглавная буква");
        if (!hasLower) errors.add("Нужна строчная буква");
        if (!hasDigit) errors.add("Нужна цифра");
        if (!hasSpecial) errors.add("Нужен спецсимвол");
        return errors;
    }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Ожидали true");
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
        runTest("testValidPassword", () -> {
            List<String> errors = validatePassword("MyPass1!");
            assertTrue(errors.isEmpty());
        });

        runTest("testTooShort", () -> {
            List<String> errors = validatePassword("Ab1!");
            assertTrue(errors.contains("Минимум 8 символов"));
        });

        runTest("testNoUpperCase", () -> {
            List<String> errors = validatePassword("mypass12!");
            assertTrue(errors.contains("Нужна заглавная буква"));
        });

        runTest("testNoDigit", () -> {
            List<String> errors = validatePassword("MyPasswo!");
            assertTrue(errors.contains("Нужна цифра"));
        });

        runTest("testNoSpecialChar", () -> {
            List<String> errors = validatePassword("MyPass123");
            assertTrue(errors.contains("Нужен спецсимвол"));
        });

        runTest("testNullPassword", () -> {
            List<String> errors = validatePassword(null);
            assertTrue(errors.contains("Пароль не может быть пустым"));
        });

        runTest("testAllRulesFailed", () -> {
            List<String> errors = validatePassword("aaa");
            assertEquals(4, errors.size()); // короткий + нет верхней + нет цифры + нет спецсимвола
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Валидатор паролей возвращает список ошибок, а не просто boolean. Это позволяет тестировать каждое правило отдельно. Тест testAllRulesFailed проверяет, что все правила срабатывают одновременно. Такой подход к валидации — лучшая практика: пользователь видит ВСЕ ошибки сразу.'
    },
    {
      id: 5,
      title: 'Тестирование конвертера температуры',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте конвертер температуры между Цельсием, Фаренгейтом и Кельвином. Протестируйте все направления конвертации и граничные значения.',
      requirements: [
        'Реализуйте: celsiusToFahrenheit, fahrenheitToCelsius, celsiusToKelvin, kelvinToCelsius',
        'Протестируйте известные значения: 0°C = 32°F = 273.15K',
        'Протестируйте: 100°C = 212°F, -40°C = -40°F',
        'Протестируйте абсолютный ноль: -273.15°C = 0K',
        'Бросьте исключение при температуре ниже абсолютного нуля в Кельвинах',
        'Используйте assertEquals с погрешностью (delta) для double'
      ],
      expectedOutput: 'PASS: testCelsiusToFahrenheit\nPASS: testFahrenheitToCelsius\nPASS: testCelsiusToKelvin\nPASS: testKelvinToCelsius\nPASS: testAbsoluteZero\nPASS: testBelowAbsoluteZero\nPASS: testMinusFortyCrossover\nИтого: 7/7',
      hint: 'Формулы: F = C * 9/5 + 32, K = C + 273.15. Абсолютный ноль = -273.15°C = 0K. При -40 значения совпадают в Цельсии и Фаренгейте.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Конвертер ---
    static double celsiusToFahrenheit(double c) {
        return c * 9.0 / 5.0 + 32;
    }

    static double fahrenheitToCelsius(double f) {
        return (f - 32) * 5.0 / 9.0;
    }

    static double celsiusToKelvin(double c) {
        double k = c + 273.15;
        if (k < 0) throw new IllegalArgumentException(
            "Температура ниже абсолютного нуля");
        return k;
    }

    static double kelvinToCelsius(double k) {
        if (k < 0) throw new IllegalArgumentException(
            "Кельвин не может быть отрицательным");
        return k - 273.15;
    }

    // --- Хелперы ---
    static void assertEquals(double expected, double actual, double delta) {
        if (Math.abs(expected - actual) > delta) {
            throw new RuntimeException(
                "Ожидали " + expected + " (±" + delta + "), получили " + actual);
        }
    }

    static void assertThrows(Class<? extends Exception> expected, Runnable code) {
        try {
            code.run();
            throw new RuntimeException("Ожидали исключение " + expected.getSimpleName());
        } catch (Exception e) {
            if (!expected.isInstance(e)) {
                throw new RuntimeException(
                    "Ожидали " + expected.getSimpleName() + ", получили " + e.getClass().getSimpleName());
            }
        }
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
        runTest("testCelsiusToFahrenheit", () -> {
            assertEquals(32.0, celsiusToFahrenheit(0), 0.01);
            assertEquals(212.0, celsiusToFahrenheit(100), 0.01);
        });

        runTest("testFahrenheitToCelsius", () -> {
            assertEquals(0.0, fahrenheitToCelsius(32), 0.01);
            assertEquals(100.0, fahrenheitToCelsius(212), 0.01);
        });

        runTest("testCelsiusToKelvin", () -> {
            assertEquals(273.15, celsiusToKelvin(0), 0.01);
            assertEquals(373.15, celsiusToKelvin(100), 0.01);
        });

        runTest("testKelvinToCelsius", () -> {
            assertEquals(0.0, kelvinToCelsius(273.15), 0.01);
            assertEquals(-273.15, kelvinToCelsius(0), 0.01);
        });

        runTest("testAbsoluteZero", () -> {
            assertEquals(0.0, celsiusToKelvin(-273.15), 0.01);
            assertEquals(-273.15, kelvinToCelsius(0), 0.01);
        });

        runTest("testBelowAbsoluteZero", () -> {
            assertThrows(IllegalArgumentException.class,
                () -> celsiusToKelvin(-300));
            assertThrows(IllegalArgumentException.class,
                () -> kelvinToCelsius(-1));
        });

        runTest("testMinusFortyCrossover", () -> {
            // -40°C = -40°F — единственная точка пересечения
            assertEquals(-40.0, celsiusToFahrenheit(-40), 0.01);
            assertEquals(-40.0, fahrenheitToCelsius(-40), 0.01);
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Конвертер температуры демонстрирует тестирование математических вычислений. Ключевой момент — assertEquals с delta (погрешностью), потому что double не всегда точен. Граничные случаи: абсолютный ноль (физический предел), -40°C = -40°F (точка пересечения шкал). Исключение при температуре ниже абсолютного нуля — защита от невозможных значений.'
    },
    {
      id: 6,
      title: 'Тестирование стека',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте структуру данных Stack и напишите полный набор unit-тестов: push, pop, peek, isEmpty, size, переполнение.',
      requirements: [
        'Реализуйте Stack на массиве с ограниченной ёмкостью (capacity)',
        'Методы: push(int), pop(), peek(), isEmpty(), size()',
        'push бросает исключение при переполнении (StackOverflowError)',
        'pop и peek бросают исключение для пустого стека',
        'Протестируйте LIFO порядок: push(1), push(2), pop() = 2',
        'Минимум 8 тестов покрывающих все сценарии'
      ],
      expectedOutput: 'PASS: testPushAndPop\nPASS: testPeek\nPASS: testIsEmpty\nPASS: testSize\nPASS: testLifoOrder\nPASS: testPopEmpty\nPASS: testPeekEmpty\nPASS: testOverflow\nИтого: 8/8',
      hint: 'Используйте массив int[] и переменную top (индекс вершины). push увеличивает top, pop уменьшает. Проверяйте границы перед каждой операцией.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Stack ---
    static int[] stack;
    static int top;
    static int capacity;

    static void initStack(int cap) {
        capacity = cap;
        stack = new int[cap];
        top = -1;
    }

    static void push(int value) {
        if (top >= capacity - 1) {
            throw new RuntimeException("Stack overflow");
        }
        stack[++top] = value;
    }

    static int pop() {
        if (top < 0) {
            throw new RuntimeException("Stack is empty");
        }
        return stack[top--];
    }

    static int peek() {
        if (top < 0) {
            throw new RuntimeException("Stack is empty");
        }
        return stack[top];
    }

    static boolean isEmpty() { return top < 0; }
    static int size() { return top + 1; }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Ожидали true");
    }

    static void assertFalse(boolean c) {
        if (c) throw new RuntimeException("Ожидали false");
    }

    static void assertThrows(Runnable code) {
        try {
            code.run();
            throw new RuntimeException("Ожидали исключение");
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Ожидали исключение")) throw e;
            // Ожидаемое исключение — тест пройден
        }
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
        runTest("testPushAndPop", () -> {
            initStack(5);
            push(10);
            assertEquals(10, pop());
        });

        runTest("testPeek", () -> {
            initStack(5);
            push(42);
            assertEquals(42, peek());
            assertEquals(1, size()); // peek не удаляет
        });

        runTest("testIsEmpty", () -> {
            initStack(5);
            assertTrue(isEmpty());
            push(1);
            assertFalse(isEmpty());
            pop();
            assertTrue(isEmpty());
        });

        runTest("testSize", () -> {
            initStack(5);
            assertEquals(0, size());
            push(1);
            push(2);
            push(3);
            assertEquals(3, size());
            pop();
            assertEquals(2, size());
        });

        runTest("testLifoOrder", () -> {
            initStack(5);
            push(1);
            push(2);
            push(3);
            assertEquals(3, pop());
            assertEquals(2, pop());
            assertEquals(1, pop());
        });

        runTest("testPopEmpty", () -> {
            initStack(5);
            assertThrows(() -> pop());
        });

        runTest("testPeekEmpty", () -> {
            initStack(5);
            assertThrows(() -> peek());
        });

        runTest("testOverflow", () -> {
            initStack(2);
            push(1);
            push(2);
            assertThrows(() -> push(3));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Стек — отличный пример для тестирования структуры данных. Мы проверяем: основные операции (push/pop/peek), свойства (isEmpty/size), LIFO-порядок, и граничные случаи (пустой стек, переполнение). Каждый тест начинает с initStack — аналог @BeforeEach в JUnit.'
    },
    {
      id: 7,
      title: 'Тестирование парсера дат',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте парсер дат, который разбирает строку формата "dd.MM.yyyy" в компоненты, и напишите тесты для корректных и некорректных дат.',
      requirements: [
        'Реализуйте метод parseDate(String) — возвращает массив [day, month, year]',
        'Валидация: день 1-31, месяц 1-12, год > 0',
        'Обработка невалидного формата: null, пустая строка, неправильный разделитель',
        'Обработка невалидных значений: 32.01.2025, 01.13.2025',
        'Протестируйте граничные даты: 01.01.0001, 31.12.9999',
        'Протестируйте февраль: 29.02 (високосный) vs 29.02 (обычный)'
      ],
      expectedOutput: 'PASS: testValidDate\nPASS: testFirstDayOfYear\nPASS: testLastDayOfYear\nPASS: testInvalidDay\nPASS: testInvalidMonth\nPASS: testInvalidFormat\nPASS: testNullDate\nPASS: testLeapYear\nИтого: 8/8',
      hint: 'Используйте split("\\\\.") для разбора. Проверьте длину массива после split. Для високосного года: год делится на 4, но не на 100, или делится на 400.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Парсер дат ---
    static int[] parseDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) {
            throw new IllegalArgumentException("Дата не может быть пустой");
        }
        String[] parts = dateStr.split("\\\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Неверный формат: " + dateStr);
        }
        try {
            int day = Integer.parseInt(parts[0]);
            int month = Integer.parseInt(parts[1]);
            int year = Integer.parseInt(parts[2]);

            if (year <= 0) throw new IllegalArgumentException("Неверный год: " + year);
            if (month < 1 || month > 12) throw new IllegalArgumentException("Неверный месяц: " + month);

            int maxDay = getMaxDay(month, year);
            if (day < 1 || day > maxDay) throw new IllegalArgumentException("Неверный день: " + day);

            return new int[]{day, month, year};
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Неверный формат числа: " + dateStr);
        }
    }

    static int getMaxDay(int month, int year) {
        switch (month) {
            case 2: return isLeapYear(year) ? 29 : 28;
            case 4: case 6: case 9: case 11: return 30;
            default: return 31;
        }
    }

    static boolean isLeapYear(int year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertArrayEquals(int[] expected, int[] actual) {
        if (expected.length != actual.length) {
            throw new RuntimeException("Разная длина массивов");
        }
        for (int i = 0; i < expected.length; i++) {
            if (expected[i] != actual[i]) {
                throw new RuntimeException(
                    "Элемент [" + i + "]: ожидали " + expected[i] + ", получили " + actual[i]);
            }
        }
    }

    static void assertThrows(Runnable code) {
        try {
            code.run();
            throw new RuntimeException("Ожидали исключение");
        } catch (IllegalArgumentException e) {
            // Ожидаемое — тест пройден
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Ожидали исключение")) throw e;
        }
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
        runTest("testValidDate", () -> {
            assertArrayEquals(new int[]{15, 6, 2025}, parseDate("15.06.2025"));
            assertArrayEquals(new int[]{1, 1, 2000}, parseDate("01.01.2000"));
        });

        runTest("testFirstDayOfYear", () -> {
            assertArrayEquals(new int[]{1, 1, 1}, parseDate("01.01.0001"));
        });

        runTest("testLastDayOfYear", () -> {
            assertArrayEquals(new int[]{31, 12, 9999}, parseDate("31.12.9999"));
        });

        runTest("testInvalidDay", () -> {
            assertThrows(() -> parseDate("32.01.2025"));
            assertThrows(() -> parseDate("00.01.2025"));
        });

        runTest("testInvalidMonth", () -> {
            assertThrows(() -> parseDate("01.13.2025"));
            assertThrows(() -> parseDate("01.00.2025"));
        });

        runTest("testInvalidFormat", () -> {
            assertThrows(() -> parseDate("2025-01-15"));
            assertThrows(() -> parseDate("hello"));
            assertThrows(() -> parseDate(""));
        });

        runTest("testNullDate", () -> {
            assertThrows(() -> parseDate(null));
        });

        runTest("testLeapYear", () -> {
            // 2024 — високосный
            assertArrayEquals(new int[]{29, 2, 2024}, parseDate("29.02.2024"));
            // 2023 — не високосный
            assertThrows(() -> parseDate("29.02.2023"));
            // 2000 — високосный (делится на 400)
            assertArrayEquals(new int[]{29, 2, 2000}, parseDate("29.02.2000"));
            // 1900 — НЕ високосный (делится на 100, но не на 400)
            assertThrows(() -> parseDate("29.02.1900"));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Парсер дат — пример с большим количеством граничных случаев. Мы тестируем: корректные даты, невалидные дни/месяцы, неверный формат, null, и особые случаи (високосный год). Правило високосного года: делится на 4, НО не на 100, ИЛИ делится на 400. Тест assertArrayEquals проверяет массивы поэлементно.'
    },
    {
      id: 8,
      title: 'Тестирование HashMap (мини-версия)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте упрощённую версию HashMap и протестируйте основные операции: put, get, remove, containsKey, size.',
      requirements: [
        'Реализуйте SimpleMap с методами: put(key, value), get(key), remove(key), containsKey(key), size()',
        'Используйте массив пар (ключ-значение) для хранения',
        'put обновляет значение при существующем ключе',
        'get возвращает null для несуществующего ключа',
        'Протестируйте: добавление, обновление, удаление, проверку наличия ключа'
      ],
      expectedOutput: 'PASS: testPut\nPASS: testGet\nPASS: testGetMissing\nPASS: testUpdate\nPASS: testRemove\nPASS: testContainsKey\nPASS: testSize\nPASS: testMultipleEntries\nИтого: 8/8',
      hint: 'Храните данные в двух массивах: String[] keys и String[] values. При put ищите существующий ключ, если найден — обновляйте значение.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    // --- SimpleMap ---
    static String[] keys;
    static String[] values;
    static int mapSize;

    static void initMap() {
        keys = new String[100];
        values = new String[100];
        mapSize = 0;
    }

    static void put(String key, String value) {
        for (int i = 0; i < mapSize; i++) {
            if (keys[i].equals(key)) {
                values[i] = value;
                return;
            }
        }
        keys[mapSize] = key;
        values[mapSize] = value;
        mapSize++;
    }

    static String get(String key) {
        for (int i = 0; i < mapSize; i++) {
            if (keys[i].equals(key)) return values[i];
        }
        return null;
    }

    static boolean remove(String key) {
        for (int i = 0; i < mapSize; i++) {
            if (keys[i].equals(key)) {
                // Сдвигаем элементы
                for (int j = i; j < mapSize - 1; j++) {
                    keys[j] = keys[j + 1];
                    values[j] = values[j + 1];
                }
                mapSize--;
                return true;
            }
        }
        return false;
    }

    static boolean containsKey(String key) {
        for (int i = 0; i < mapSize; i++) {
            if (keys[i].equals(key)) return true;
        }
        return false;
    }

    static int mapSize() { return mapSize; }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (expected == null && actual == null) return;
        if (expected == null || !expected.equals(actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Ожидали true");
    }

    static void assertFalse(boolean c) {
        if (c) throw new RuntimeException("Ожидали false");
    }

    static void assertNull(Object obj) {
        if (obj != null) throw new RuntimeException(
            "Ожидали null, получили [" + obj + "]");
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
        runTest("testPut", () -> {
            initMap();
            put("name", "John");
            assertEquals(1, mapSize());
        });

        runTest("testGet", () -> {
            initMap();
            put("name", "John");
            assertEquals("John", get("name"));
        });

        runTest("testGetMissing", () -> {
            initMap();
            assertNull(get("nonexistent"));
        });

        runTest("testUpdate", () -> {
            initMap();
            put("name", "John");
            put("name", "Jane"); // обновление
            assertEquals("Jane", get("name"));
            assertEquals(1, mapSize()); // размер не изменился
        });

        runTest("testRemove", () -> {
            initMap();
            put("name", "John");
            assertTrue(remove("name"));
            assertNull(get("name"));
            assertEquals(0, mapSize());
        });

        runTest("testContainsKey", () -> {
            initMap();
            put("name", "John");
            assertTrue(containsKey("name"));
            assertFalse(containsKey("age"));
        });

        runTest("testSize", () -> {
            initMap();
            assertEquals(0, mapSize());
            put("a", "1");
            put("b", "2");
            assertEquals(2, mapSize());
            remove("a");
            assertEquals(1, mapSize());
        });

        runTest("testMultipleEntries", () -> {
            initMap();
            put("name", "John");
            put("age", "25");
            put("city", "Moscow");
            assertEquals("John", get("name"));
            assertEquals("25", get("age"));
            assertEquals("Moscow", get("city"));
            assertEquals(3, mapSize());
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Тестирование собственной структуры данных — хорошая практика unit-тестирования. Мы проверяем: CRUD операции (put/get/remove), обновление существующего ключа, поведение при обращении к несуществующему ключу. initMap() вызывается в каждом тесте — это аналог @BeforeEach, обеспечивающий независимость тестов.'
    },
    {
      id: 9,
      title: 'Тестирование матричных операций',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте базовые матричные операции (сложение, транспонирование) и напишите unit-тесты с проверкой каждого элемента.',
      requirements: [
        'Реализуйте: addMatrices(a, b), transpose(matrix), multiply(a, b)',
        'addMatrices — поэлементное сложение двух матриц одинакового размера',
        'transpose — транспонирование (строки становятся столбцами)',
        'multiply — умножение матриц (строка на столбец)',
        'Бросьте исключение при несовместимых размерах',
        'Протестируйте: 2x2 матрицы, единичную матрицу, нулевую матрицу'
      ],
      expectedOutput: 'PASS: testAddMatrices\nPASS: testAddIncompatible\nPASS: testTranspose\nPASS: testTransposeSquare\nPASS: testMultiply\nPASS: testMultiplyIdentity\nPASS: testMultiplyIncompatible\nИтого: 7/7',
      hint: 'При умножении матриц A(m×n) и B(n×p) результат C(m×p): C[i][j] = сумма A[i][k] * B[k][j] по k. Размеры совместимы, если столбцов A = строк B.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Матричные операции ---
    static int[][] addMatrices(int[][] a, int[][] b) {
        if (a.length != b.length || a[0].length != b[0].length) {
            throw new IllegalArgumentException("Матрицы разного размера");
        }
        int[][] result = new int[a.length][a[0].length];
        for (int i = 0; i < a.length; i++) {
            for (int j = 0; j < a[0].length; j++) {
                result[i][j] = a[i][j] + b[i][j];
            }
        }
        return result;
    }

    static int[][] transpose(int[][] matrix) {
        int rows = matrix.length;
        int cols = matrix[0].length;
        int[][] result = new int[cols][rows];
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                result[j][i] = matrix[i][j];
            }
        }
        return result;
    }

    static int[][] multiply(int[][] a, int[][] b) {
        if (a[0].length != b.length) {
            throw new IllegalArgumentException(
                "Несовместимые размеры: " + a[0].length + " != " + b.length);
        }
        int[][] result = new int[a.length][b[0].length];
        for (int i = 0; i < a.length; i++) {
            for (int j = 0; j < b[0].length; j++) {
                for (int k = 0; k < a[0].length; k++) {
                    result[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        return result;
    }

    // --- Хелперы ---
    static void assertMatrixEquals(int[][] expected, int[][] actual) {
        if (expected.length != actual.length) {
            throw new RuntimeException("Разное число строк");
        }
        for (int i = 0; i < expected.length; i++) {
            if (expected[i].length != actual[i].length) {
                throw new RuntimeException("Разное число столбцов в строке " + i);
            }
            for (int j = 0; j < expected[i].length; j++) {
                if (expected[i][j] != actual[i][j]) {
                    throw new RuntimeException(
                        "Элемент [" + i + "][" + j + "]: ожидали " +
                        expected[i][j] + ", получили " + actual[i][j]);
                }
            }
        }
    }

    static void assertThrows(Runnable code) {
        try {
            code.run();
            throw new RuntimeException("Ожидали исключение");
        } catch (IllegalArgumentException e) {
            // Ожидаемое — OK
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Ожидали исключение")) throw e;
        }
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
        runTest("testAddMatrices", () -> {
            int[][] a = {{1, 2}, {3, 4}};
            int[][] b = {{5, 6}, {7, 8}};
            int[][] expected = {{6, 8}, {10, 12}};
            assertMatrixEquals(expected, addMatrices(a, b));
        });

        runTest("testAddIncompatible", () -> {
            int[][] a = {{1, 2}, {3, 4}};
            int[][] b = {{1, 2, 3}};
            assertThrows(() -> addMatrices(a, b));
        });

        runTest("testTranspose", () -> {
            int[][] matrix = {{1, 2, 3}, {4, 5, 6}};
            int[][] expected = {{1, 4}, {2, 5}, {3, 6}};
            assertMatrixEquals(expected, transpose(matrix));
        });

        runTest("testTransposeSquare", () -> {
            int[][] matrix = {{1, 2}, {3, 4}};
            int[][] expected = {{1, 3}, {2, 4}};
            assertMatrixEquals(expected, transpose(matrix));
        });

        runTest("testMultiply", () -> {
            int[][] a = {{1, 2}, {3, 4}};
            int[][] b = {{5, 6}, {7, 8}};
            int[][] expected = {{19, 22}, {43, 50}};
            assertMatrixEquals(expected, multiply(a, b));
        });

        runTest("testMultiplyIdentity", () -> {
            int[][] a = {{3, 7}, {2, 5}};
            int[][] identity = {{1, 0}, {0, 1}};
            assertMatrixEquals(a, multiply(a, identity));
        });

        runTest("testMultiplyIncompatible", () -> {
            int[][] a = {{1, 2}, {3, 4}};
            int[][] b = {{1, 2}, {3, 4}, {5, 6}};
            assertThrows(() -> multiply(a, b));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Матричные операции — хороший пример для тестирования с массивами. assertMatrixEquals проверяет каждый элемент и выдаёт точное сообщение об ошибке. Умножение на единичную матрицу (identity) — классический тест: результат должен быть равен исходной матрице. Проверка несовместимых размеров защищает от некорректных входных данных.'
    },
    {
      id: 10,
      title: 'Тестирование сортировки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте алгоритм сортировки и напишите исчерпывающие тесты: отсортированный массив, обратный порядок, дубликаты, один элемент, пустой массив.',
      requirements: [
        'Реализуйте bubbleSort(int[]) — сортировка пузырьком',
        'Протестируйте: обычный массив, уже отсортированный, обратный порядок',
        'Протестируйте: дубликаты, один элемент, пустой массив',
        'Протестируйте: массив с отрицательными числами',
        'Создайте assertSorted — проверяет, что массив отсортирован',
        'Проверьте, что длина массива не меняется после сортировки'
      ],
      expectedOutput: 'PASS: testSortRegular\nPASS: testSortAlreadySorted\nPASS: testSortReverse\nPASS: testSortDuplicates\nPASS: testSortSingleElement\nPASS: testSortEmpty\nPASS: testSortNegative\nPASS: testSortPreservesLength\nИтого: 8/8',
      hint: 'Bubble sort: два вложенных цикла, сравниваем соседние элементы и меняем местами. assertSorted проверяет, что каждый элемент <= следующего.',
      solution: `import java.util.Arrays;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Сортировка ---
    static void bubbleSort(int[] arr) {
        if (arr == null) return;
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    // --- Хелперы ---
    static void assertArrayEquals(int[] expected, int[] actual) {
        if (expected.length != actual.length) {
            throw new RuntimeException("Разная длина: " +
                expected.length + " vs " + actual.length);
        }
        for (int i = 0; i < expected.length; i++) {
            if (expected[i] != actual[i]) {
                throw new RuntimeException(
                    "Элемент [" + i + "]: ожидали " + expected[i] +
                    ", получили " + actual[i]);
            }
        }
    }

    static void assertSorted(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            if (arr[i] > arr[i + 1]) {
                throw new RuntimeException(
                    "Не отсортировано: arr[" + i + "]=" + arr[i] +
                    " > arr[" + (i + 1) + "]=" + arr[i + 1]);
            }
        }
    }

    static void assertEquals(int expected, int actual) {
        if (expected != actual) {
            throw new RuntimeException(
                "Ожидали " + expected + ", получили " + actual);
        }
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
        runTest("testSortRegular", () -> {
            int[] arr = {5, 3, 8, 1, 9, 2};
            bubbleSort(arr);
            assertArrayEquals(new int[]{1, 2, 3, 5, 8, 9}, arr);
        });

        runTest("testSortAlreadySorted", () -> {
            int[] arr = {1, 2, 3, 4, 5};
            bubbleSort(arr);
            assertArrayEquals(new int[]{1, 2, 3, 4, 5}, arr);
        });

        runTest("testSortReverse", () -> {
            int[] arr = {5, 4, 3, 2, 1};
            bubbleSort(arr);
            assertArrayEquals(new int[]{1, 2, 3, 4, 5}, arr);
        });

        runTest("testSortDuplicates", () -> {
            int[] arr = {3, 1, 3, 2, 1};
            bubbleSort(arr);
            assertArrayEquals(new int[]{1, 1, 2, 3, 3}, arr);
        });

        runTest("testSortSingleElement", () -> {
            int[] arr = {42};
            bubbleSort(arr);
            assertArrayEquals(new int[]{42}, arr);
        });

        runTest("testSortEmpty", () -> {
            int[] arr = {};
            bubbleSort(arr);
            assertArrayEquals(new int[]{}, arr);
        });

        runTest("testSortNegative", () -> {
            int[] arr = {-3, 5, -1, 0, -8, 2};
            bubbleSort(arr);
            assertSorted(arr);
            assertArrayEquals(new int[]{-8, -3, -1, 0, 2, 5}, arr);
        });

        runTest("testSortPreservesLength", () -> {
            int[] arr = {5, 3, 1, 4, 2};
            int originalLength = arr.length;
            bubbleSort(arr);
            assertEquals(originalLength, arr.length);
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Тестирование сортировки — классика. Мы проверяем: обычный массив, уже отсортированный (лучший случай), обратный порядок (худший случай), дубликаты, один элемент, пустой массив. assertSorted — универсальная проверка, что каждый элемент <= следующего. Важно проверить сохранение длины массива — сортировка не должна терять/добавлять элементы.'
    }
  ]
}
