export default {
  id: 11,
  title: 'Code Coverage',
  description: 'JaCoCo, метрики покрытия, что покрывать, а что нет',
  lessons: [
    {
      id: 1,
      title: 'Что такое Code Coverage?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Code Coverage (покрытие кода) — это метрика, показывающая, какой процент кода выполняется при запуске тестов. Инструмент #1 для Java — JaCoCo.' },
        { type: 'heading', value: 'Виды покрытия' },
        { type: 'list', items: [
          'Line Coverage — процент строк, которые были выполнены',
          'Branch Coverage — процент ветвлений (if/else), которые были пройдены',
          'Method Coverage — процент методов, которые были вызваны',
          'Class Coverage — процент классов, в которых запускались тесты',
          'Instruction Coverage — процент байткод-инструкций'
        ]},
        { type: 'heading', value: 'Пример' },
        { type: 'code', language: 'java', value: 'String getDiscount(double price) {\n    if (price > 1000) {       // Branch 1\n        return "10%";          // Line A\n    } else if (price > 500) { // Branch 2\n        return "5%";           // Line B\n    } else {                  // Branch 3\n        return "0%";           // Line C\n    }\n}\n\n// Тест:\nvoid test() {\n    assertEquals("10%", getDiscount(2000)); // Покрыл Branch 1, Line A\n    assertEquals("5%", getDiscount(700));   // Покрыл Branch 2, Line B\n}\n// Line Coverage: 4/5 = 80% (Line C не покрыта)\n// Branch Coverage: 2/3 = 67% (Branch 3 не покрыта)' },
        { type: 'heading', value: 'JaCoCo — инструмент для Java' },
        { type: 'code', language: 'xml', value: '<!-- Maven plugin: -->\n<plugin>\n  <groupId>org.jacoco</groupId>\n  <artifactId>jacoco-maven-plugin</artifactId>\n  <version>0.8.11</version>\n  <executions>\n    <execution>\n      <goals><goal>prepare-agent</goal></goals>\n    </execution>\n    <execution>\n      <id>report</id>\n      <phase>test</phase>\n      <goals><goal>report</goal></goals>\n    </execution>\n  </executions>\n</plugin>' },
        { type: 'tip', value: 'JaCoCo генерирует HTML-отчёт: target/site/jacoco/index.html. Зелёный = покрыто, красный = не покрыто, жёлтый = частично.' }
      ]
    },
    {
      id: 2,
      title: 'Какое покрытие считается хорошим?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Вечный вопрос: сколько процентов покрытия нужно? Ответ: зависит от проекта, но есть общие ориентиры.' },
        { type: 'heading', value: 'Рекомендуемые пороги' },
        { type: 'code', language: 'text', value: '70% — минимум для большинства проектов\n80% — хороший уровень для production\n90%+ — для критических систем (финансы, медицина)\n100% — утопия и часто бессмысленно' },
        { type: 'heading', value: 'Почему 100% — плохая цель?' },
        { type: 'list', items: [
          'Закон убывающей отдачи — последние 10% стоят больше, чем первые 80%',
          'Тесты ради тестов — покрываем getters/setters, toString',
          'Хрупкие тесты — привязаны к реализации, ломаются при рефакторинге',
          '100% покрытие != 0 багов — тесты могут не проверять правильность'
        ]},
        { type: 'heading', value: 'Что ОБЯЗАТЕЛЬНО покрывать' },
        { type: 'list', items: [
          'Бизнес-логика — расчёты, правила, валидация',
          'Граничные случаи — null, 0, пустые коллекции',
          'Обработка ошибок — catch-блоки, fallback',
          'Критический код — платежи, авторизация, данные'
        ]},
        { type: 'heading', value: 'Что можно НЕ покрывать' },
        { type: 'list', items: [
          'Простые getters/setters, toString, hashCode',
          'Конфигурационные классы',
          'DTO (Data Transfer Objects) без логики',
          'Код, сгенерированный инструментами (Lombok)'
        ]},
        { type: 'warning', value: 'Покрытие — это метрика КОЛИЧЕСТВА, а не КАЧЕСТВА тестов. Можно покрыть 100% и не проверить ни одного assert. Важнее: что вы ПРОВЕРЯЕТЕ, а не что вы ЗАПУСКАЕТЕ.' }
      ]
    },
    {
      id: 3,
      title: 'Настройка порогов и исключений',
      type: 'theory',
      content: [
        { type: 'text', value: 'JaCoCo позволяет задать минимальные пороги покрытия — если покрытие ниже, сборка упадёт.' },
        { type: 'heading', value: 'Минимальный порог в Maven' },
        { type: 'code', language: 'xml', value: '<execution>\n  <id>check</id>\n  <goals><goal>check</goal></goals>\n  <configuration>\n    <rules>\n      <rule>\n        <element>BUNDLE</element>\n        <limits>\n          <limit>\n            <counter>LINE</counter>\n            <value>COVEREDRATIO</value>\n            <minimum>0.80</minimum> <!-- 80% -->\n          </limit>\n          <limit>\n            <counter>BRANCH</counter>\n            <value>COVEREDRATIO</value>\n            <minimum>0.70</minimum> <!-- 70% -->\n          </limit>\n        </limits>\n      </rule>\n    </rules>\n  </configuration>\n</execution>' },
        { type: 'heading', value: 'Исключение классов из покрытия' },
        { type: 'code', language: 'xml', value: '<configuration>\n  <excludes>\n    <exclude>**/dto/**</exclude>\n    <exclude>**/config/**</exclude>\n    <exclude>**/Application.class</exclude>\n    <exclude>**/*Dto.class</exclude>\n  </excludes>\n</configuration>' },
        { type: 'heading', value: 'Покрытие в CI/CD' },
        { type: 'list', items: [
          'Интегрируйте JaCoCo в CI pipeline (GitHub Actions, Jenkins)',
          'Покрытие должно быть gate — PR не мёрджится с покрытием ниже порога',
          'Отслеживайте тренд — покрытие не должно падать',
          'SonarQube — агрегирует покрытие + другие метрики'
        ]},
        { type: 'tip', value: 'Правило ratchet: новый код должен быть покрыт минимум на 80%, но старый можно не трогать. Постепенно покрытие вырастет.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: Анализ покрытия',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте анализатор покрытия: подсчитайте, какие методы покрыты тестами, а какие нет.',
      requirements: [
        'Создайте класс MathService с 6 методами: add, subtract, multiply, divide, power, factorial',
        'Создайте систему отслеживания вызовов: какие методы были вызваны при тестировании',
        'Напишите тесты только для 4 из 6 методов (намеренно не покрывайте 2)',
        'Посчитайте и выведите отчёт: method coverage, какие методы не покрыты',
        'Рассчитайте процент покрытия'
      ],
      expectedOutput: 'Запуск тестов...\nPASS: testAdd\nPASS: testSubtract\nPASS: testMultiply\nPASS: testDivide\n\n=== Coverage Report ===\nadd         : COVERED\nsubtract    : COVERED\nmultiply    : COVERED\ndivide      : COVERED\npower       : NOT COVERED\nfactorial   : NOT COVERED\nMethod Coverage: 4/6 (67%)',
      hint: 'Используйте Set<String> для записи вызванных методов. Для отчёта сравните с полным списком методов.',
      solution: `import java.util.LinkedHashSet;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Coverage tracking ---
    static Set<String> coveredMethods = new LinkedHashSet<>();
    static Map<String, Boolean> allMethods = new LinkedHashMap<>();

    static {
        allMethods.put("add", false);
        allMethods.put("subtract", false);
        allMethods.put("multiply", false);
        allMethods.put("divide", false);
        allMethods.put("power", false);
        allMethods.put("factorial", false);
    }

    static void trackCoverage(String method) {
        coveredMethods.add(method);
        allMethods.put(method, true);
    }

    // --- MathService ---
    static int add(int a, int b) {
        trackCoverage("add");
        return a + b;
    }

    static int subtract(int a, int b) {
        trackCoverage("subtract");
        return a - b;
    }

    static int multiply(int a, int b) {
        trackCoverage("multiply");
        return a * b;
    }

    static double divide(int a, int b) {
        trackCoverage("divide");
        if (b == 0) throw new ArithmeticException("/ by zero");
        return (double) a / b;
    }

    static long power(int base, int exp) {
        trackCoverage("power");
        long result = 1;
        for (int i = 0; i < exp; i++) result *= base;
        return result;
    }

    static long factorial(int n) {
        trackCoverage("factorial");
        if (n < 0) throw new IllegalArgumentException("n < 0");
        long result = 1;
        for (int i = 2; i <= n; i++) result *= i;
        return result;
    }

    // --- Assertions ---
    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Expected " + expected + ", got " + actual);
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

    // --- Coverage Report ---
    static void printCoverageReport() {
        System.out.println("\\n=== Coverage Report ===");
        int covered = 0;
        for (Map.Entry<String, Boolean> entry : allMethods.entrySet()) {
            String status = entry.getValue() ? "COVERED" : "NOT COVERED";
            System.out.printf("%-12s: %s%n", entry.getKey(), status);
            if (entry.getValue()) covered++;
        }
        int totalMethods = allMethods.size();
        int percent = (int) ((covered * 100.0) / totalMethods);
        System.out.println("Method Coverage: " + covered + "/"
            + totalMethods + " (" + percent + "%)");
    }

    public static void main(String[] args) {
        System.out.println("Запуск тестов...");

        // Намеренно тестируем только 4 из 6 методов
        runTest("testAdd", () -> {
            assertEquals(5, add(2, 3));
            assertEquals(0, add(-1, 1));
        });

        runTest("testSubtract", () -> {
            assertEquals(7, subtract(10, 3));
        });

        runTest("testMultiply", () -> {
            assertEquals(12, multiply(3, 4));
        });

        runTest("testDivide", () -> {
            assertEquals(2.5, divide(5, 2));
        });

        // power и factorial НЕ тестируются!

        printCoverageReport();
    }
}`,
      explanation: 'Мы создали мини-JaCoCo: trackCoverage записывает каждый вызванный метод. Отчёт показывает, что power и factorial не покрыты (67% coverage). В реальном JaCoCo инструментирование происходит на уровне байт-кода, но принцип тот же: отслеживание выполненных строк/методов.'
    },
    {
      id: 5,
      title: 'Практика: Повышение покрытия',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дан класс с низким покрытием. Добавьте тесты для достижения 100% branch coverage.',
      requirements: [
        'Класс UserValidator: validateAge, validateEmail, validatePassword, validateUsername',
        'Каждый метод имеет несколько if/else ветвей',
        'Отслеживайте line и branch coverage',
        'Добавьте тесты для КАЖДОЙ ветви',
        'Достигните 100% branch coverage'
      ],
      expectedOutput: 'Запуск тестов...\nPASS: testAgeValid\nPASS: testAgeTooYoung\nPASS: testAgeTooOld\nPASS: testEmailValid\nPASS: testEmailNoAt\nPASS: testEmailNull\nPASS: testPasswordValid\nPASS: testPasswordShort\nPASS: testPasswordNoDigit\nPASS: testUsernameValid\nPASS: testUsernameShort\nPASS: testUsernameInvalidChars\n\n=== Coverage Report ===\nBranches covered: 12/12 (100%)\nLines covered: 16/16 (100%)',
      hint: 'Для каждого if нужно два теста: один для true, один для false ветви.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;
    static int branchesCovered = 0;
    static int totalBranches = 12;
    static int linesCovered = 0;
    static int totalLines = 16;
    static boolean[] branchHit = new boolean[12];
    static boolean[] lineHit = new boolean[16];

    static void hitBranch(int id) {
        if (!branchHit[id]) { branchHit[id] = true; branchesCovered++; }
    }
    static void hitLine(int id) {
        if (!lineHit[id]) { lineHit[id] = true; linesCovered++; }
    }

    // --- UserValidator (instrumented) ---
    static String validateAge(int age) {
        hitLine(0);
        if (age < 18) {          hitBranch(0); hitLine(1); return "Минимум 18 лет"; }
        else if (age > 120) {    hitBranch(1); hitLine(2); return "Максимум 120 лет"; }
        else {                   hitBranch(2); hitLine(3); return "OK"; }
    }

    static String validateEmail(String email) {
        hitLine(4);
        if (email == null) {     hitBranch(3); hitLine(5); return "Email обязателен"; }
        if (!email.contains("@")) { hitBranch(4); hitLine(6); return "Нужен символ @"; }
        hitBranch(5); hitLine(7);
        return "OK";
    }

    static String validatePassword(String password) {
        hitLine(8);
        if (password == null || password.length() < 8) {
            hitBranch(6); hitLine(9); return "Минимум 8 символов";
        }
        if (!password.chars().anyMatch(Character::isDigit)) {
            hitBranch(7); hitLine(10); return "Нужна цифра";
        }
        hitBranch(8); hitLine(11);
        return "OK";
    }

    static String validateUsername(String username) {
        hitLine(12);
        if (username == null || username.length() < 3) {
            hitBranch(9); hitLine(13); return "Минимум 3 символа";
        }
        if (!username.matches("[a-zA-Z0-9_]+")) {
            hitBranch(10); hitLine(14); return "Только буквы, цифры, _";
        }
        hitBranch(11); hitLine(15);
        return "OK";
    }

    // --- Assertions ---
    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Expected [" + expected + "], got [" + actual + "]");
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
        System.out.println("Запуск тестов...");

        // validateAge: 3 ветви
        runTest("testAgeValid", () -> assertEquals("OK", validateAge(25)));
        runTest("testAgeTooYoung", () -> assertEquals("Минимум 18 лет", validateAge(15)));
        runTest("testAgeTooOld", () -> assertEquals("Максимум 120 лет", validateAge(150)));

        // validateEmail: 3 ветви
        runTest("testEmailValid", () -> assertEquals("OK", validateEmail("a@b.com")));
        runTest("testEmailNoAt", () -> assertEquals("Нужен символ @", validateEmail("abc")));
        runTest("testEmailNull", () -> assertEquals("Email обязателен", validateEmail(null)));

        // validatePassword: 3 ветви
        runTest("testPasswordValid", () -> assertEquals("OK", validatePassword("abcdef1!")));
        runTest("testPasswordShort", () -> assertEquals("Минимум 8 символов", validatePassword("ab1")));
        runTest("testPasswordNoDigit", () -> assertEquals("Нужна цифра", validatePassword("abcdefgh")));

        // validateUsername: 3 ветви
        runTest("testUsernameValid", () -> assertEquals("OK", validateUsername("john_doe")));
        runTest("testUsernameShort", () -> assertEquals("Минимум 3 символа", validateUsername("ab")));
        runTest("testUsernameInvalidChars", () -> assertEquals("Только буквы, цифры, _", validateUsername("john doe!")));

        System.out.println("\\n=== Coverage Report ===");
        System.out.println("Branches covered: " + branchesCovered + "/" + totalBranches +
            " (" + (branchesCovered * 100 / totalBranches) + "%)");
        System.out.println("Lines covered: " + linesCovered + "/" + totalLines +
            " (" + (linesCovered * 100 / totalLines) + "%)");
    }
}`,
      explanation: 'Мы "инструментировали" код (как JaCoCo): hitBranch и hitLine записывают, какие ветви и строки были выполнены. Для 100% branch coverage нужно пройти КАЖДУЮ ветвь if/else. 12 ветвей = 12 тестов. Это показывает, почему branch coverage важнее line coverage: строка может быть покрыта, но не все ветви пройдены.'
    }
  ]
}
