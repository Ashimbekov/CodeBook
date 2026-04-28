export default {
  id: 15,
  title: 'Практикум: TDD реальные задачи',
  description: 'Практические задачи с подходом TDD: сначала пишем тесты (утверждения), потом реализуем решение. Реальные сценарии: корзина, банк, валидатор и др.',
  lessons: [
    {
      id: 1,
      title: 'TDD: Корзина покупок',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используя TDD-подход, создайте корзину покупок: добавление товаров, подсчёт суммы, удаление, изменение количества. Сначала напишите тесты, потом реализуйте.',
      requirements: [
        'Реализуйте ShoppingCart: addItem(name, price, qty), removeItem(name), getTotal(), getItemCount()',
        'addItem с существующим товаром увеличивает количество',
        'removeItem удаляет товар полностью',
        'getTotal — сумма (price * qty) всех товаров',
        'getItemCount — общее количество всех товаров',
        'Пустая корзина: total = 0, itemCount = 0'
      ],
      expectedOutput: 'PASS: testEmptyCart\nPASS: testAddOneItem\nPASS: testAddMultipleItems\nPASS: testAddSameItemTwice\nPASS: testRemoveItem\nPASS: testGetTotal\nPASS: testGetItemCount\nPASS: testRemoveNonExistent\nИтого: 8/8',
      hint: 'TDD-цикл: напишите тест (RED) -> реализуйте минимум кода (GREEN) -> рефакторите (REFACTOR). Храните товары в Map<String, double[]>, где double[] = {price, qty}.',
      solution: `import java.util.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Shopping Cart ---
    static Map<String, double[]> cart; // name -> [price, qty]

    static void initCart() {
        cart = new HashMap<>();
    }

    static void addItem(String name, double price, int qty) {
        if (cart.containsKey(name)) {
            double[] item = cart.get(name);
            item[1] += qty; // увеличиваем количество
        } else {
            cart.put(name, new double[]{price, qty});
        }
    }

    static boolean removeItem(String name) {
        return cart.remove(name) != null;
    }

    static double getTotal() {
        double sum = 0;
        for (double[] item : cart.values()) {
            sum += item[0] * item[1]; // price * qty
        }
        return sum;
    }

    static int getItemCount() {
        int count = 0;
        for (double[] item : cart.values()) {
            count += (int) item[1];
        }
        return count;
    }

    static int getUniqueItemCount() {
        return cart.size();
    }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertDoubleEquals(double expected, double actual) {
        if (Math.abs(expected - actual) > 0.01) {
            throw new RuntimeException(
                "Ожидали " + expected + ", получили " + actual);
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
        initCart();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        // TDD: тесты написаны ПЕРВЫМИ, реализация — по тестам

        runTest("testEmptyCart", () -> {
            assertDoubleEquals(0.0, getTotal());
            assertEquals(0, getItemCount());
        });

        runTest("testAddOneItem", () -> {
            addItem("Молоко", 500, 1);
            assertEquals(1, getUniqueItemCount());
            assertEquals(1, getItemCount());
        });

        runTest("testAddMultipleItems", () -> {
            addItem("Хлеб", 200, 1);
            addItem("Масло", 800, 1);
            addItem("Сыр", 1500, 1);
            assertEquals(3, getUniqueItemCount());
        });

        runTest("testAddSameItemTwice", () -> {
            addItem("Вода", 100, 2);
            addItem("Вода", 100, 3);
            assertEquals(1, getUniqueItemCount()); // один товар
            assertEquals(5, getItemCount()); // 2 + 3 = 5 штук
        });

        runTest("testRemoveItem", () -> {
            addItem("Молоко", 500, 1);
            addItem("Хлеб", 200, 1);
            assertTrue(removeItem("Молоко"));
            assertEquals(1, getUniqueItemCount());
            assertDoubleEquals(200.0, getTotal());
        });

        runTest("testGetTotal", () -> {
            addItem("Ноутбук", 500000, 1);
            addItem("Мышка", 5000, 2);
            addItem("Коврик", 2000, 1);
            // 500000 + 10000 + 2000 = 512000
            assertDoubleEquals(512000.0, getTotal());
        });

        runTest("testGetItemCount", () -> {
            addItem("Ручка", 50, 10);
            addItem("Тетрадь", 100, 5);
            assertEquals(15, getItemCount()); // 10 + 5
        });

        runTest("testRemoveNonExistent", () -> {
            assertFalse(removeItem("Фантом"));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'TDD-подход: тесты описывают ПОВЕДЕНИЕ корзины до написания кода. testEmptyCart — первый тест (самый простой). Затем постепенно добавляем функциональность: один товар, несколько, одинаковый товар дважды (количество суммируется), удаление. Каждый тест добавляет одно требование. Реализация создаётся минимально для прохождения тестов.'
    },
    {
      id: 2,
      title: 'TDD: Банковский счёт',
      type: 'practice',
      difficulty: 'medium',
      description: 'TDD-подход: создайте банковский счёт с операциями deposit, withdraw, transfer. Сначала тесты, потом реализация.',
      requirements: [
        'BankAccount: deposit(amount), withdraw(amount), getBalance(), transfer(toAccount, amount)',
        'Начальный баланс = 0',
        'withdraw бросает исключение при недостаточном балансе',
        'deposit и withdraw бросают исключение при отрицательной сумме',
        'transfer: списывает у одного, пополняет у другого',
        'Ведите историю операций: [тип, сумма, дата]'
      ],
      expectedOutput: 'PASS: testInitialBalance\nPASS: testDeposit\nPASS: testWithdraw\nPASS: testWithdrawInsufficient\nPASS: testNegativeAmount\nPASS: testTransfer\nPASS: testTransferInsufficient\nPASS: testTransactionHistory\nИтого: 8/8',
      hint: 'Используйте два массива для двух счетов. История — List<String>. При transfer проверьте баланс ДО перевода, чтобы не оставить систему в inconsistent state.',
      solution: `import java.util.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Bank Accounts ---
    static double[] balances;
    static List<List<String>> histories; // для каждого аккаунта

    static void initBank(int accountCount) {
        balances = new double[accountCount];
        histories = new ArrayList<>();
        for (int i = 0; i < accountCount; i++) {
            histories.add(new ArrayList<>());
        }
    }

    static void deposit(int accountId, double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Сумма должна быть положительной");
        }
        balances[accountId] += amount;
        histories.get(accountId).add("DEPOSIT:" + amount);
    }

    static void withdraw(int accountId, double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Сумма должна быть положительной");
        }
        if (balances[accountId] < amount) {
            throw new RuntimeException("Недостаточно средств");
        }
        balances[accountId] -= amount;
        histories.get(accountId).add("WITHDRAW:" + amount);
    }

    static double getBalance(int accountId) {
        return balances[accountId];
    }

    static void transfer(int fromId, int toId, double amount) {
        if (amount <= 0) {
            throw new IllegalArgumentException("Сумма должна быть положительной");
        }
        if (balances[fromId] < amount) {
            throw new RuntimeException("Недостаточно средств для перевода");
        }
        balances[fromId] -= amount;
        balances[toId] += amount;
        histories.get(fromId).add("TRANSFER_OUT:" + amount + "->acc" + toId);
        histories.get(toId).add("TRANSFER_IN:" + amount + "<-acc" + fromId);
    }

    static List<String> getHistory(int accountId) {
        return histories.get(accountId);
    }

    // --- Хелперы ---
    static void assertDoubleEquals(double expected, double actual) {
        if (Math.abs(expected - actual) > 0.01) {
            throw new RuntimeException(
                "Ожидали " + expected + ", получили " + actual);
        }
    }

    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertThrows(Runnable code) {
        try {
            code.run();
            throw new RuntimeException("Ожидали исключение");
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Ожидали исключение")) throw e;
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
        runTest("testInitialBalance", () -> {
            initBank(2);
            assertDoubleEquals(0.0, getBalance(0));
        });

        runTest("testDeposit", () -> {
            initBank(2);
            deposit(0, 1000);
            assertDoubleEquals(1000.0, getBalance(0));
            deposit(0, 500);
            assertDoubleEquals(1500.0, getBalance(0));
        });

        runTest("testWithdraw", () -> {
            initBank(2);
            deposit(0, 1000);
            withdraw(0, 300);
            assertDoubleEquals(700.0, getBalance(0));
        });

        runTest("testWithdrawInsufficient", () -> {
            initBank(2);
            deposit(0, 100);
            assertThrows(() -> withdraw(0, 500));
            // Баланс не изменился
            assertDoubleEquals(100.0, getBalance(0));
        });

        runTest("testNegativeAmount", () -> {
            initBank(2);
            assertThrows(() -> deposit(0, -100));
            assertThrows(() -> withdraw(0, -50));
        });

        runTest("testTransfer", () -> {
            initBank(2);
            deposit(0, 5000);
            transfer(0, 1, 2000);
            assertDoubleEquals(3000.0, getBalance(0));
            assertDoubleEquals(2000.0, getBalance(1));
        });

        runTest("testTransferInsufficient", () -> {
            initBank(2);
            deposit(0, 100);
            assertThrows(() -> transfer(0, 1, 500));
            // Оба баланса не изменились
            assertDoubleEquals(100.0, getBalance(0));
            assertDoubleEquals(0.0, getBalance(1));
        });

        runTest("testTransactionHistory", () -> {
            initBank(2);
            deposit(0, 1000);
            withdraw(0, 200);
            transfer(0, 1, 300);

            List<String> history = getHistory(0);
            assertEquals(3, history.size());
            assertTrue(history.get(0).startsWith("DEPOSIT"));
            assertTrue(history.get(1).startsWith("WITHDRAW"));
            assertTrue(history.get(2).startsWith("TRANSFER_OUT"));

            // Получатель тоже имеет историю
            List<String> history1 = getHistory(1);
            assertEquals(1, history1.size());
            assertTrue(history1.get(0).startsWith("TRANSFER_IN"));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'TDD для банковского счёта: начинаем с testInitialBalance (баланс = 0), затем deposit, withdraw, transfer. Каждый тест добавляет одну функцию. Важные тесты: withdraw с недостаточным балансом НЕ меняет баланс (атомарность), transfer — атомарная операция (оба баланса согласованы). История операций — аудит-лог для отслеживания.'
    },
    {
      id: 3,
      title: 'TDD: Валидатор email',
      type: 'practice',
      difficulty: 'medium',
      description: 'TDD-подход: создайте продвинутый валидатор email с подробными ошибками. Тесты определяют все правила валидации.',
      requirements: [
        'validateEmail возвращает ValidationResult(isValid, List<String> errors)',
        'Правила: содержит @, есть символы до @, есть домен после @, домен содержит точку',
        'Дополнительно: нет пробелов, нет двойных точек, корректные символы в localpart',
        'Допустимые символы localpart: буквы, цифры, точка, дефис, подчёркивание',
        'Тесты покрывают: валидный email, каждое правило отдельно, комбинации ошибок',
        'Возвращайте ВСЕ ошибки, а не только первую'
      ],
      expectedOutput: 'PASS: testValidEmail\nPASS: testNoAtSign\nPASS: testEmptyLocalPart\nPASS: testNoDomain\nPASS: testNoDotInDomain\nPASS: testSpaces\nPASS: testDoubleDots\nPASS: testMultipleErrors\nИтого: 8/8',
      hint: 'Разбейте email по @. Проверяйте каждую часть отдельно. Для проверки символов пройдитесь по каждому char и проверьте через Character.isLetterOrDigit() и допустимые спецсимволы.',
      solution: `import java.util.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Email Validator ---
    static boolean resultValid;
    static List<String> resultErrors;

    static void validateEmail(String email) {
        resultErrors = new ArrayList<>();

        if (email == null || email.isEmpty()) {
            resultErrors.add("Email не может быть пустым");
            resultValid = false;
            return;
        }

        // Проверка пробелов
        if (email.contains(" ")) {
            resultErrors.add("Email не должен содержать пробелы");
        }

        // Проверка @
        int atIndex = email.indexOf('@');
        if (atIndex < 0) {
            resultErrors.add("Отсутствует символ @");
            resultValid = resultErrors.isEmpty();
            return;
        }

        // Проверка localpart (до @)
        String localPart = email.substring(0, atIndex);
        if (localPart.isEmpty()) {
            resultErrors.add("Пустая локальная часть (до @)");
        } else {
            for (char c : localPart.toCharArray()) {
                if (!Character.isLetterOrDigit(c) && c != '.' && c != '-' && c != '_') {
                    resultErrors.add("Недопустимый символ в локальной части: " + c);
                    break;
                }
            }
        }

        // Проверка домена (после @)
        String domain = email.substring(atIndex + 1);
        if (domain.isEmpty()) {
            resultErrors.add("Пустой домен (после @)");
        } else if (!domain.contains(".")) {
            resultErrors.add("Домен должен содержать точку");
        }

        // Двойные точки
        if (email.contains("..")) {
            resultErrors.add("Email не должен содержать двойные точки");
        }

        resultValid = resultErrors.isEmpty();
    }

    // --- Хелперы ---
    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Ожидали true");
    }

    static void assertFalse(boolean c) {
        if (c) throw new RuntimeException("Ожидали false");
    }

    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertContains(List<String> list, String substring) {
        for (String s : list) {
            if (s.contains(substring)) return;
        }
        throw new RuntimeException(
            "Список не содержит строку с [" + substring + "]: " + list);
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
        runTest("testValidEmail", () -> {
            validateEmail("user@example.com");
            assertTrue(resultValid);
            assertTrue(resultErrors.isEmpty());
        });

        runTest("testNoAtSign", () -> {
            validateEmail("userexample.com");
            assertFalse(resultValid);
            assertContains(resultErrors, "@");
        });

        runTest("testEmptyLocalPart", () -> {
            validateEmail("@example.com");
            assertFalse(resultValid);
            assertContains(resultErrors, "локальная часть");
        });

        runTest("testNoDomain", () -> {
            validateEmail("user@");
            assertFalse(resultValid);
            assertContains(resultErrors, "домен");
        });

        runTest("testNoDotInDomain", () -> {
            validateEmail("user@localhost");
            assertFalse(resultValid);
            assertContains(resultErrors, "точку");
        });

        runTest("testSpaces", () -> {
            validateEmail("us er@example.com");
            assertFalse(resultValid);
            assertContains(resultErrors, "пробелы");
        });

        runTest("testDoubleDots", () -> {
            validateEmail("user..name@example.com");
            assertFalse(resultValid);
            assertContains(resultErrors, "двойные точки");
        });

        runTest("testMultipleErrors", () -> {
            validateEmail("@");
            assertFalse(resultValid);
            assertTrue(resultErrors.size() >= 2); // пустая локальная часть + пустой домен
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'TDD для валидатора email: каждый тест определяет одно правило. Тесты написаны ДО реализации — они являются спецификацией. validateEmail возвращает ВСЕ ошибки (не останавливается на первой), что удобно для UX. assertContains — хелпер для проверки, что хотя бы одна ошибка содержит нужную подстроку. testMultipleErrors проверяет, что несколько ошибок обнаруживаются одновременно.'
    },
    {
      id: 4,
      title: 'TDD: Стек вызовов (Call Stack)',
      type: 'practice',
      difficulty: 'medium',
      description: 'TDD-подход: реализуйте симуляцию стека вызовов (call stack) для отладчика. Поддержка push/pop фреймов, вывод stack trace.',
      requirements: [
        'CallStack: pushFrame(methodName), popFrame(), getCurrentMethod(), getDepth()',
        'getStackTrace() — возвращает строку с цепочкой вызовов',
        'Максимальная глубина 100 — StackOverflowError при превышении',
        'popFrame на пустом стеке бросает исключение',
        'Stack trace формат: "main() -> service() -> dao()" (от нижнего к верхнему)',
        'Тесты определяют поведение до реализации'
      ],
      expectedOutput: 'PASS: testEmptyStack\nPASS: testPushFrame\nPASS: testPopFrame\nPASS: testGetCurrentMethod\nPASS: testGetDepth\nPASS: testStackTrace\nPASS: testStackOverflow\nPASS: testPopEmpty\nИтого: 8/8',
      hint: 'Используйте массив String[] для хранения фреймов и int top для текущей позиции. getStackTrace формирует строку, перебирая фреймы от 0 до top.',
      solution: `public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Call Stack ---
    static final int MAX_DEPTH = 100;
    static String[] frames;
    static int top;

    static void initCallStack() {
        frames = new String[MAX_DEPTH];
        top = -1;
    }

    static void pushFrame(String methodName) {
        if (top >= MAX_DEPTH - 1) {
            throw new StackOverflowError("Превышена максимальная глубина: " + MAX_DEPTH);
        }
        frames[++top] = methodName;
    }

    static String popFrame() {
        if (top < 0) {
            throw new RuntimeException("Стек вызовов пуст");
        }
        return frames[top--];
    }

    static String getCurrentMethod() {
        if (top < 0) return null;
        return frames[top];
    }

    static int getDepth() {
        return top + 1;
    }

    static String getStackTrace() {
        if (top < 0) return "<пустой стек>";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i <= top; i++) {
            if (i > 0) sb.append(" -> ");
            sb.append(frames[i]).append("()");
        }
        return sb.toString();
    }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (expected == null && actual == null) return;
        if (expected == null || !expected.equals(actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertNull(Object obj) {
        if (obj != null) throw new RuntimeException(
            "Ожидали null, получили [" + obj + "]");
    }

    static void assertThrows(Runnable code) {
        try {
            code.run();
            throw new RuntimeException("Ожидали исключение");
        } catch (StackOverflowError | RuntimeException e) {
            if (e instanceof RuntimeException &&
                e.getMessage().equals("Ожидали исключение")) {
                throw (RuntimeException) e;
            }
        }
    }

    static void runTest(String name, Runnable test) {
        total++;
        initCallStack();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testEmptyStack", () -> {
            assertEquals(0, getDepth());
            assertNull(getCurrentMethod());
            assertEquals("<пустой стек>", getStackTrace());
        });

        runTest("testPushFrame", () -> {
            pushFrame("main");
            assertEquals(1, getDepth());
            assertEquals("main", getCurrentMethod());
        });

        runTest("testPopFrame", () -> {
            pushFrame("main");
            pushFrame("process");
            String popped = popFrame();
            assertEquals("process", popped);
            assertEquals("main", getCurrentMethod());
        });

        runTest("testGetCurrentMethod", () -> {
            pushFrame("main");
            assertEquals("main", getCurrentMethod());
            pushFrame("service");
            assertEquals("service", getCurrentMethod());
            pushFrame("repository");
            assertEquals("repository", getCurrentMethod());
        });

        runTest("testGetDepth", () -> {
            assertEquals(0, getDepth());
            pushFrame("a");
            assertEquals(1, getDepth());
            pushFrame("b");
            pushFrame("c");
            assertEquals(3, getDepth());
            popFrame();
            assertEquals(2, getDepth());
        });

        runTest("testStackTrace", () -> {
            pushFrame("main");
            pushFrame("orderService");
            pushFrame("paymentService");
            pushFrame("bankApi");
            String trace = getStackTrace();
            assertEquals("main() -> orderService() -> paymentService() -> bankApi()", trace);
        });

        runTest("testStackOverflow", () -> {
            assertThrows(() -> {
                for (int i = 0; i < 101; i++) {
                    pushFrame("method" + i);
                }
            });
        });

        runTest("testPopEmpty", () -> {
            assertThrows(() -> popFrame());
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Call Stack — реальная структура данных JVM. TDD-тесты определяют контракт: пустой стек, push/pop, текущий метод, глубина, stack trace. Stack trace формат "main() -> service() -> dao()" имитирует реальный Java stack trace. Ограничение глубины (100) предотвращает бесконечную рекурсию — аналог настоящего StackOverflowError.'
    },
    {
      id: 5,
      title: 'TDD: Система скидок',
      type: 'practice',
      difficulty: 'hard',
      description: 'TDD-подход: создайте гибкую систему скидок с правилами: процентная скидка, фиксированная скидка, скидка по промокоду, каскадные скидки.',
      requirements: [
        'DiscountEngine поддерживает: процентная скидка (10%), фиксированная (500 тг), промокод',
        'Правила применяются по приоритету: промокод -> процент -> фиксированная',
        'Максимальная скидка не может превышать цену товара (цена >= 0)',
        'Промокод: одноразовый, после использования не работает',
        'Комбинация скидок: промокод + процент (но не промокод + фиксированная)',
        'Тесты определяют логику комбинирования'
      ],
      expectedOutput: 'PASS: testNoDiscount\nPASS: testPercentDiscount\nPASS: testFixedDiscount\nPASS: testPromoCode\nPASS: testPromoCodeOneTime\nPASS: testCombinedDiscounts\nPASS: testMaxDiscountCap\nPASS: testInvalidPromoCode\nИтого: 8/8',
      hint: 'Сначала проверьте промокод, потом примените процент, потом фиксированную скидку. После каждого шага проверяйте, что цена >= 0. Промокоды храните в Set<String> для отслеживания использованных.',
      solution: `import java.util.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Discount Engine ---
    static Map<String, Double> promoCodes; // code -> discount percentage
    static Set<String> usedCodes;
    static double percentDiscount; // 0-100
    static double fixedDiscount;   // фиксированная сумма

    static void initDiscountEngine() {
        promoCodes = new HashMap<>();
        usedCodes = new HashSet<>();
        percentDiscount = 0;
        fixedDiscount = 0;
    }

    static void addPromoCode(String code, double discountPercent) {
        promoCodes.put(code, discountPercent);
    }

    static void setPercentDiscount(double percent) {
        percentDiscount = percent;
    }

    static void setFixedDiscount(double amount) {
        fixedDiscount = amount;
    }

    static double calculatePrice(double originalPrice, String promoCode) {
        double price = originalPrice;

        // 1. Промокод (приоритет)
        if (promoCode != null && !promoCode.isEmpty()) {
            Double promoDiscount = promoCodes.get(promoCode);
            if (promoDiscount != null && !usedCodes.contains(promoCode)) {
                price = price * (1 - promoDiscount / 100.0);
                usedCodes.add(promoCode);
                // С промокодом можно комбинировать процент, но не фиксированную
                if (percentDiscount > 0) {
                    price = price * (1 - percentDiscount / 100.0);
                }
                return Math.max(0, Math.round(price * 100.0) / 100.0);
            }
        }

        // 2. Процентная скидка
        if (percentDiscount > 0) {
            price = price * (1 - percentDiscount / 100.0);
        }

        // 3. Фиксированная скидка
        if (fixedDiscount > 0) {
            price = price - fixedDiscount;
        }

        return Math.max(0, Math.round(price * 100.0) / 100.0);
    }

    // --- Хелперы ---
    static void assertDoubleEquals(double expected, double actual) {
        if (Math.abs(expected - actual) > 0.01) {
            throw new RuntimeException(
                "Ожидали " + expected + ", получили " + actual);
        }
    }

    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void runTest(String name, Runnable test) {
        total++;
        initDiscountEngine();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testNoDiscount", () -> {
            double price = calculatePrice(10000, null);
            assertDoubleEquals(10000.0, price);
        });

        runTest("testPercentDiscount", () -> {
            setPercentDiscount(10); // 10%
            double price = calculatePrice(10000, null);
            assertDoubleEquals(9000.0, price); // 10000 - 10% = 9000
        });

        runTest("testFixedDiscount", () -> {
            setFixedDiscount(500);
            double price = calculatePrice(3000, null);
            assertDoubleEquals(2500.0, price); // 3000 - 500 = 2500
        });

        runTest("testPromoCode", () -> {
            addPromoCode("SALE20", 20);
            double price = calculatePrice(5000, "SALE20");
            assertDoubleEquals(4000.0, price); // 5000 - 20% = 4000
        });

        runTest("testPromoCodeOneTime", () -> {
            addPromoCode("ONCE50", 50);
            // Первое использование — работает
            double price1 = calculatePrice(10000, "ONCE50");
            assertDoubleEquals(5000.0, price1);
            // Второе использование — не работает
            double price2 = calculatePrice(10000, "ONCE50");
            assertDoubleEquals(10000.0, price2); // без скидки
        });

        runTest("testCombinedDiscounts", () -> {
            addPromoCode("PROMO10", 10);
            setPercentDiscount(5); // дополнительные 5%
            // Промокод 10% + процент 5%
            double price = calculatePrice(10000, "PROMO10");
            // 10000 * 0.9 = 9000 * 0.95 = 8550
            assertDoubleEquals(8550.0, price);
        });

        runTest("testMaxDiscountCap", () -> {
            setFixedDiscount(5000);
            double price = calculatePrice(3000, null);
            // 3000 - 5000 = -2000, но цена не может быть < 0
            assertDoubleEquals(0.0, price);
        });

        runTest("testInvalidPromoCode", () -> {
            double price = calculatePrice(10000, "INVALID");
            assertDoubleEquals(10000.0, price); // Невалидный код — без скидки
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Система скидок — реальная бизнес-задача с множеством правил. TDD помогает: каждый тест определяет одно бизнес-правило. Порядок применения скидок (промокод -> процент -> фиксированная) определён тестами. Одноразовость промокода проверяется двойным использованием. Math.max(0, price) гарантирует, что цена не уйдёт в минус. Комбинирование скидок — сложная логика, которую без тестов легко сломать при рефакторинге.'
    },
    {
      id: 6,
      title: 'TDD: Система рейтингов',
      type: 'practice',
      difficulty: 'hard',
      description: 'TDD-подход: создайте систему рейтингов для товаров. Средний рейтинг, фильтрация по рейтингу, топ товаров.',
      requirements: [
        'RatingSystem: addRating(productId, userId, score 1-5), getAverage(productId)',
        'Один пользователь может оставить только одну оценку (обновляется при повторной)',
        'getTopProducts(n) — топ-N товаров по среднему рейтингу',
        'getProductsAbove(threshold) — товары с рейтингом выше порога',
        'getRatingCount(productId) — количество оценок',
        'Невалидный рейтинг (< 1 или > 5) бросает исключение'
      ],
      expectedOutput: 'PASS: testAddRating\nPASS: testAverageRating\nPASS: testUpdateRating\nPASS: testInvalidRating\nPASS: testTopProducts\nPASS: testProductsAboveThreshold\nPASS: testRatingCount\nPASS: testNoRatings\nИтого: 8/8',
      hint: 'Храните Map<String, Map<String, Integer>> — productId -> (userId -> score). Средний рейтинг — сумма всех оценок / количество. Для topProducts отсортируйте по среднему.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Rating System ---
    static Map<String, Map<String, Integer>> ratings; // productId -> (userId -> score)

    static void initRatingSystem() {
        ratings = new HashMap<>();
    }

    static void addRating(String productId, String userId, int score) {
        if (score < 1 || score > 5) {
            throw new IllegalArgumentException(
                "Рейтинг должен быть от 1 до 5, получили: " + score);
        }
        ratings.computeIfAbsent(productId, k -> new HashMap<>())
               .put(userId, score);
    }

    static double getAverage(String productId) {
        Map<String, Integer> productRatings = ratings.get(productId);
        if (productRatings == null || productRatings.isEmpty()) return 0.0;
        double sum = 0;
        for (int score : productRatings.values()) sum += score;
        return Math.round(sum / productRatings.size() * 100.0) / 100.0;
    }

    static int getRatingCount(String productId) {
        Map<String, Integer> productRatings = ratings.get(productId);
        return productRatings == null ? 0 : productRatings.size();
    }

    static List<String> getTopProducts(int n) {
        List<String> products = new ArrayList<>(ratings.keySet());
        products.sort((a, b) -> Double.compare(getAverage(b), getAverage(a)));
        return products.subList(0, Math.min(n, products.size()));
    }

    static List<String> getProductsAbove(double threshold) {
        List<String> result = new ArrayList<>();
        for (String productId : ratings.keySet()) {
            if (getAverage(productId) >= threshold) {
                result.add(productId);
            }
        }
        return result;
    }

    // --- Хелперы ---
    static void assertDoubleEquals(double expected, double actual) {
        if (Math.abs(expected - actual) > 0.01) {
            throw new RuntimeException(
                "Ожидали " + expected + ", получили " + actual);
        }
    }

    static void assertEquals(Object expected, Object actual) {
        if (!expected.equals(actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Ожидали true");
    }

    static void assertThrows(Runnable code) {
        try {
            code.run();
            throw new RuntimeException("Ожидали исключение");
        } catch (IllegalArgumentException e) {
            // OK
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Ожидали исключение")) throw e;
        }
    }

    static void runTest(String name, Runnable test) {
        total++;
        initRatingSystem();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testAddRating", () -> {
            addRating("product1", "user1", 5);
            assertEquals(1, getRatingCount("product1"));
        });

        runTest("testAverageRating", () -> {
            addRating("product1", "user1", 5);
            addRating("product1", "user2", 3);
            addRating("product1", "user3", 4);
            assertDoubleEquals(4.0, getAverage("product1")); // (5+3+4)/3
        });

        runTest("testUpdateRating", () -> {
            addRating("product1", "user1", 2);
            addRating("product1", "user1", 5); // обновление
            assertEquals(1, getRatingCount("product1")); // всё ещё 1 оценка
            assertDoubleEquals(5.0, getAverage("product1")); // обновлённая оценка
        });

        runTest("testInvalidRating", () -> {
            assertThrows(() -> addRating("product1", "user1", 0));
            assertThrows(() -> addRating("product1", "user1", 6));
            assertThrows(() -> addRating("product1", "user1", -1));
        });

        runTest("testTopProducts", () -> {
            addRating("A", "u1", 5);
            addRating("A", "u2", 5); // avg 5.0
            addRating("B", "u1", 3);
            addRating("B", "u2", 4); // avg 3.5
            addRating("C", "u1", 4);
            addRating("C", "u2", 5); // avg 4.5

            List<String> top = getTopProducts(2);
            assertEquals(2, top.size());
            assertEquals("A", top.get(0));  // 5.0
            assertEquals("C", top.get(1));  // 4.5
        });

        runTest("testProductsAboveThreshold", () -> {
            addRating("A", "u1", 5); // avg 5.0
            addRating("B", "u1", 2); // avg 2.0
            addRating("C", "u1", 4); // avg 4.0

            List<String> good = getProductsAbove(4.0);
            assertEquals(2, good.size());
            assertTrue(good.contains("A"));
            assertTrue(good.contains("C"));
        });

        runTest("testRatingCount", () -> {
            addRating("product1", "user1", 5);
            addRating("product1", "user2", 4);
            addRating("product1", "user3", 3);
            assertEquals(3, getRatingCount("product1"));
        });

        runTest("testNoRatings", () -> {
            assertDoubleEquals(0.0, getAverage("unknown"));
            assertEquals(0, getRatingCount("unknown"));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Система рейтингов — реальный сценарий из e-commerce. TDD-тесты определяют ключевые бизнес-правила: один пользователь = одна оценка (put обновляет), средний рейтинг, топ товаров. Map<String, Map<String, Integer>> — двухуровневая структура (product -> user -> score). getTopProducts сортирует по среднему рейтингу. testUpdateRating — важный тест: повторная оценка обновляет, а не дублирует.'
    },
    {
      id: 7,
      title: 'TDD: Планировщик задач (Task Scheduler)',
      type: 'practice',
      difficulty: 'hard',
      description: 'TDD-подход: создайте планировщик задач с приоритетами, дедлайнами и зависимостями между задачами.',
      requirements: [
        'TaskScheduler: addTask(name, priority, deadline), getNextTask(), completeTask(name)',
        'getNextTask возвращает задачу с наивысшим приоритетом (1 = высший)',
        'Задача не может быть выполнена, если она зависит от незавершённой задачи',
        'addDependency(task, dependsOn) — добавляет зависимость',
        'getOverdueTasks(currentDay) — просроченные задачи',
        'Протестируйте: приоритет, зависимости, просрочка, завершение'
      ],
      expectedOutput: 'PASS: testAddTask\nPASS: testPriority\nPASS: testCompleteTask\nPASS: testDependency\nPASS: testBlockedTask\nPASS: testOverdueTasks\nPASS: testCompleteDependencyUnblocks\nPASS: testEmptyScheduler\nИтого: 8/8',
      hint: 'Храните задачи в Map<String, int[]> (name -> [priority, deadline, completed]). Зависимости: Map<String, List<String>>. getNextTask фильтрует незавершённые и неблокированные, затем выбирает с минимальным priority.',
      solution: `import java.util.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Task Scheduler ---
    static Map<String, int[]> tasks; // name -> [priority, deadline, completed(0/1)]
    static Map<String, List<String>> dependencies; // task -> depends on

    static void initScheduler() {
        tasks = new LinkedHashMap<>();
        dependencies = new HashMap<>();
    }

    static void addTask(String name, int priority, int deadline) {
        tasks.put(name, new int[]{priority, deadline, 0});
    }

    static void addDependency(String task, String dependsOn) {
        dependencies.computeIfAbsent(task, k -> new ArrayList<>()).add(dependsOn);
    }

    static boolean isBlocked(String taskName) {
        List<String> deps = dependencies.get(taskName);
        if (deps == null) return false;
        for (String dep : deps) {
            int[] depTask = tasks.get(dep);
            if (depTask != null && depTask[2] == 0) return true; // зависимость не завершена
        }
        return false;
    }

    static String getNextTask() {
        String best = null;
        int bestPriority = Integer.MAX_VALUE;

        for (Map.Entry<String, int[]> entry : tasks.entrySet()) {
            int[] info = entry.getValue();
            if (info[2] == 1) continue; // уже завершена
            if (isBlocked(entry.getKey())) continue; // заблокирована

            if (info[0] < bestPriority) {
                bestPriority = info[0];
                best = entry.getKey();
            }
        }
        return best;
    }

    static boolean completeTask(String name) {
        int[] task = tasks.get(name);
        if (task == null || task[2] == 1) return false;
        if (isBlocked(name)) return false;
        task[2] = 1;
        return true;
    }

    static List<String> getOverdueTasks(int currentDay) {
        List<String> overdue = new ArrayList<>();
        for (Map.Entry<String, int[]> entry : tasks.entrySet()) {
            int[] info = entry.getValue();
            if (info[2] == 0 && info[1] < currentDay) {
                overdue.add(entry.getKey());
            }
        }
        return overdue;
    }

    static int getPendingCount() {
        int count = 0;
        for (int[] info : tasks.values()) {
            if (info[2] == 0) count++;
        }
        return count;
    }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (!Objects.equals(expected, actual)) {
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
        initScheduler();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testAddTask", () -> {
            addTask("Дизайн", 2, 10);
            assertEquals(1, getPendingCount());
        });

        runTest("testPriority", () -> {
            addTask("Деплой", 3, 15);
            addTask("Баг-фикс", 1, 5);   // приоритет 1 — наивысший
            addTask("Рефакторинг", 2, 10);
            assertEquals("Баг-фикс", getNextTask());
        });

        runTest("testCompleteTask", () -> {
            addTask("Тесты", 1, 5);
            assertTrue(completeTask("Тесты"));
            assertEquals(0, getPendingCount());
            assertNull(getNextTask());
        });

        runTest("testDependency", () -> {
            addTask("Backend", 1, 10);
            addTask("Frontend", 1, 15);
            addDependency("Frontend", "Backend");
            // Frontend заблокирован, хотя приоритет одинаковый
            assertEquals("Backend", getNextTask());
        });

        runTest("testBlockedTask", () -> {
            addTask("DB", 2, 5);
            addTask("API", 1, 10);
            addDependency("API", "DB");
            // API имеет приоритет 1, но заблокирован
            assertFalse(completeTask("API")); // нельзя завершить
            assertTrue(isBlocked("API"));
        });

        runTest("testOverdueTasks", () -> {
            addTask("A", 1, 5);
            addTask("B", 2, 10);
            addTask("C", 3, 3);
            // Текущий день = 7
            List<String> overdue = getOverdueTasks(7);
            assertEquals(2, overdue.size()); // A(дедлайн 5) и C(дедлайн 3)
            assertTrue(overdue.contains("A"));
            assertTrue(overdue.contains("C"));
        });

        runTest("testCompleteDependencyUnblocks", () -> {
            addTask("Setup", 1, 5);
            addTask("Develop", 2, 10);
            addDependency("Develop", "Setup");
            assertTrue(isBlocked("Develop"));

            // Завершаем зависимость
            completeTask("Setup");
            assertFalse(isBlocked("Develop")); // Разблокирован!
            assertTrue(completeTask("Develop"));
        });

        runTest("testEmptyScheduler", () -> {
            assertNull(getNextTask());
            assertEquals(0, getPendingCount());
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Планировщик задач — комплексная TDD-задача. Тесты определяют бизнес-логику: приоритет (меньше = важнее), зависимости (заблокированная задача не может быть завершена), просрочка (дедлайн < текущий день). testCompleteDependencyUnblocks — ключевой тест: после завершения Setup задача Develop разблокируется. isBlocked проверяет, все ли зависимости завершены.'
    },
    {
      id: 8,
      title: 'TDD: Конвертер валют',
      type: 'practice',
      difficulty: 'medium',
      description: 'TDD-подход: создайте конвертер валют с динамическими курсами. Конвертация, обратная конвертация, цепочка конвертаций.',
      requirements: [
        'CurrencyConverter: setRate(from, to, rate), convert(amount, from, to)',
        'setRate("USD", "KZT", 450) означает 1 USD = 450 KZT',
        'Обратный курс вычисляется автоматически: KZT->USD = 1/450',
        'Конвертация через промежуточную валюту: EUR->KZT через EUR->USD->KZT',
        'Исключение при отсутствии курса',
        'Конвертация в ту же валюту возвращает ту же сумму'
      ],
      expectedOutput: 'PASS: testDirectConversion\nPASS: testReverseConversion\nPASS: testSameCurrency\nPASS: testUpdateRate\nPASS: testTransitiveConversion\nPASS: testUnknownCurrency\nPASS: testZeroAmount\nPASS: testMultipleConversions\nИтого: 8/8',
      hint: 'Храните курсы в Map<String, Double> с ключом "USD->KZT". При setRate добавляйте и обратный курс. Для транзитивной конвертации найдите общую валюту через пересечение ключей.',
      solution: `import java.util.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Currency Converter ---
    static Map<String, Double> rates; // "USD->KZT" -> 450.0

    static void initConverter() {
        rates = new HashMap<>();
    }

    static void setRate(String from, String to, double rate) {
        rates.put(from + "->" + to, rate);
        rates.put(to + "->" + from, 1.0 / rate);
    }

    static double convert(double amount, String from, String to) {
        if (from.equals(to)) return amount;

        // Прямой курс
        String key = from + "->" + to;
        if (rates.containsKey(key)) {
            return Math.round(amount * rates.get(key) * 100.0) / 100.0;
        }

        // Транзитивная конвертация: ищем промежуточную валюту
        for (String rateKey : rates.keySet()) {
            if (rateKey.startsWith(from + "->")) {
                String mid = rateKey.substring(rateKey.indexOf("->") + 2);
                String midToTarget = mid + "->" + to;
                if (rates.containsKey(midToTarget)) {
                    double midAmount = amount * rates.get(rateKey);
                    return Math.round(midAmount * rates.get(midToTarget) * 100.0) / 100.0;
                }
            }
        }

        throw new RuntimeException("Курс " + from + " -> " + to + " не найден");
    }

    // --- Хелперы ---
    static void assertDoubleEquals(double expected, double actual) {
        if (Math.abs(expected - actual) > 0.01) {
            throw new RuntimeException(
                "Ожидали " + expected + ", получили " + actual);
        }
    }

    static void assertThrows(Runnable code) {
        try {
            code.run();
            throw new RuntimeException("Ожидали исключение");
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Ожидали исключение")) throw e;
        }
    }

    static void runTest(String name, Runnable test) {
        total++;
        initConverter();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testDirectConversion", () -> {
            setRate("USD", "KZT", 450);
            assertDoubleEquals(4500.0, convert(10, "USD", "KZT"));
        });

        runTest("testReverseConversion", () -> {
            setRate("USD", "KZT", 450);
            // 450 KZT = 1 USD
            assertDoubleEquals(1.0, convert(450, "KZT", "USD"));
        });

        runTest("testSameCurrency", () -> {
            assertDoubleEquals(100.0, convert(100, "USD", "USD"));
        });

        runTest("testUpdateRate", () -> {
            setRate("USD", "KZT", 450);
            assertDoubleEquals(4500.0, convert(10, "USD", "KZT"));
            // Курс изменился
            setRate("USD", "KZT", 480);
            assertDoubleEquals(4800.0, convert(10, "USD", "KZT"));
        });

        runTest("testTransitiveConversion", () -> {
            setRate("EUR", "USD", 1.1);
            setRate("USD", "KZT", 450);
            // EUR -> USD -> KZT
            // 10 EUR * 1.1 = 11 USD * 450 = 4950 KZT
            assertDoubleEquals(4950.0, convert(10, "EUR", "KZT"));
        });

        runTest("testUnknownCurrency", () -> {
            setRate("USD", "KZT", 450);
            assertThrows(() -> convert(100, "GBP", "KZT"));
        });

        runTest("testZeroAmount", () -> {
            setRate("USD", "KZT", 450);
            assertDoubleEquals(0.0, convert(0, "USD", "KZT"));
        });

        runTest("testMultipleConversions", () -> {
            setRate("USD", "KZT", 450);
            setRate("EUR", "KZT", 490);
            setRate("RUB", "KZT", 5);
            assertDoubleEquals(45000.0, convert(100, "USD", "KZT"));
            assertDoubleEquals(49000.0, convert(100, "EUR", "KZT"));
            assertDoubleEquals(500.0, convert(100, "RUB", "KZT"));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Конвертер валют демонстрирует TDD для алгоритмической задачи. Обратный курс вычисляется автоматически (1/rate), транзитивная конвертация (EUR->USD->KZT) ищет промежуточную валюту. Тесты определяют: прямая и обратная конвертация, та же валюта, обновление курса, транзитивность, несуществующий курс. Math.round обеспечивает точность до копеек.'
    },
    {
      id: 9,
      title: 'TDD: Библиотечная система',
      type: 'practice',
      difficulty: 'hard',
      description: 'TDD-подход: создайте систему управления библиотекой. Каталог книг, выдача, возврат, штрафы за просрочку.',
      requirements: [
        'Library: addBook(title, author, copies), borrowBook(userId, title), returnBook(userId, title)',
        'borrowBook уменьшает доступные копии, returnBook увеличивает',
        'Нельзя взять книгу, если копий нет (доступно = 0)',
        'Один пользователь не может взять 2 копии одной книги',
        'calculateFine(userId, title, currentDay) — штраф за просрочку (100 тг/день)',
        'Срок выдачи = 14 дней, штраф начисляется за каждый лишний день'
      ],
      expectedOutput: 'PASS: testAddBook\nPASS: testBorrowBook\nPASS: testReturnBook\nPASS: testNoCopiesAvailable\nPASS: testDuplicateBorrow\nPASS: testCalculateFine\nPASS: testNoFineOnTime\nPASS: testMultipleUsers\nИтого: 8/8',
      hint: 'Книги: Map<String, int[]> title -> [totalCopies, availableCopies]. Выдачи: Map<String, Map<String, Integer>> userId -> (title -> borrowDay). Штраф: max(0, currentDay - borrowDay - 14) * 100.',
      solution: `import java.util.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Library ---
    static Map<String, String[]> books;      // title -> [author, total, available]
    static Map<String, Map<String, Integer>> borrows; // userId -> (title -> borrowDay)
    static int currentDay;

    static void initLibrary(int day) {
        books = new HashMap<>();
        borrows = new HashMap<>();
        currentDay = day;
    }

    static void addBook(String title, String author, int copies) {
        books.put(title, new String[]{author, String.valueOf(copies), String.valueOf(copies)});
    }

    static boolean borrowBook(String userId, String title) {
        String[] book = books.get(title);
        if (book == null) return false;

        int available = Integer.parseInt(book[2]);
        if (available <= 0) return false;

        // Проверка: уже взял?
        Map<String, Integer> userBorrows = borrows.get(userId);
        if (userBorrows != null && userBorrows.containsKey(title)) {
            return false;
        }

        // Выдаём
        book[2] = String.valueOf(available - 1);
        borrows.computeIfAbsent(userId, k -> new HashMap<>()).put(title, currentDay);
        return true;
    }

    static boolean returnBook(String userId, String title) {
        Map<String, Integer> userBorrows = borrows.get(userId);
        if (userBorrows == null || !userBorrows.containsKey(title)) {
            return false;
        }

        userBorrows.remove(title);
        String[] book = books.get(title);
        int available = Integer.parseInt(book[2]);
        book[2] = String.valueOf(available + 1);
        return true;
    }

    static int calculateFine(String userId, String title, int checkDay) {
        Map<String, Integer> userBorrows = borrows.get(userId);
        if (userBorrows == null || !userBorrows.containsKey(title)) return 0;

        int borrowDay = userBorrows.get(title);
        int overdueDays = checkDay - borrowDay - 14;
        return Math.max(0, overdueDays * 100); // 100 тг/день
    }

    static int getAvailableCopies(String title) {
        String[] book = books.get(title);
        return book == null ? 0 : Integer.parseInt(book[2]);
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
        runTest("testAddBook", () -> {
            initLibrary(1);
            addBook("Java Concurrency", "Brian Goetz", 3);
            assertEquals(3, getAvailableCopies("Java Concurrency"));
        });

        runTest("testBorrowBook", () -> {
            initLibrary(1);
            addBook("Clean Code", "Robert Martin", 2);
            assertTrue(borrowBook("user1", "Clean Code"));
            assertEquals(1, getAvailableCopies("Clean Code"));
        });

        runTest("testReturnBook", () -> {
            initLibrary(1);
            addBook("Refactoring", "Martin Fowler", 2);
            borrowBook("user1", "Refactoring");
            assertEquals(1, getAvailableCopies("Refactoring"));
            assertTrue(returnBook("user1", "Refactoring"));
            assertEquals(2, getAvailableCopies("Refactoring"));
        });

        runTest("testNoCopiesAvailable", () -> {
            initLibrary(1);
            addBook("Rare Book", "Author", 1);
            assertTrue(borrowBook("user1", "Rare Book"));
            assertFalse(borrowBook("user2", "Rare Book")); // 0 копий
        });

        runTest("testDuplicateBorrow", () -> {
            initLibrary(1);
            addBook("Effective Java", "Joshua Bloch", 5);
            assertTrue(borrowBook("user1", "Effective Java"));
            assertFalse(borrowBook("user1", "Effective Java")); // уже взял
            assertEquals(4, getAvailableCopies("Effective Java")); // списана только 1
        });

        runTest("testCalculateFine", () -> {
            initLibrary(1);
            addBook("Test Book", "Author", 3);
            borrowBook("user1", "Test Book"); // взял на день 1
            // Проверяем на день 20: 20 - 1 - 14 = 5 дней просрочки
            assertEquals(500, calculateFine("user1", "Test Book", 20));
        });

        runTest("testNoFineOnTime", () -> {
            initLibrary(1);
            addBook("Quick Read", "Author", 3);
            borrowBook("user1", "Quick Read"); // день 1
            // Проверяем на день 10: 10 - 1 - 14 = -5, max(0, -5) = 0
            assertEquals(0, calculateFine("user1", "Quick Read", 10));
            // Ровно 14 дней: 15 - 1 - 14 = 0
            assertEquals(0, calculateFine("user1", "Quick Read", 15));
        });

        runTest("testMultipleUsers", () -> {
            initLibrary(1);
            addBook("Popular Book", "Author", 3);
            assertTrue(borrowBook("user1", "Popular Book"));
            assertTrue(borrowBook("user2", "Popular Book"));
            assertTrue(borrowBook("user3", "Popular Book"));
            assertEquals(0, getAvailableCopies("Popular Book"));
            assertFalse(borrowBook("user4", "Popular Book")); // все копии выданы

            returnBook("user1", "Popular Book");
            assertEquals(1, getAvailableCopies("Popular Book"));
            assertTrue(borrowBook("user4", "Popular Book")); // теперь можно
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Библиотечная система — комплексный TDD-сценарий. Тесты определяют: добавление книг, выдача (уменьшение копий), возврат (увеличение копий), ограничения (0 копий, повторная выдача), штрафы. Штраф: max(0, days - 14) * 100 — начисляется после 14 дней. testMultipleUsers проверяет конкурентный доступ к ограниченным копиям. Каждый тест изолирован через initLibrary.'
    },
    {
      id: 10,
      title: 'TDD: Интернет-магазин (комплексный)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Финальная TDD-задача: создайте мини-интернет-магазин, объединяющий каталог, корзину, скидки, оплату и историю заказов.',
      requirements: [
        'Каталог товаров: addProduct(id, name, price, stock)',
        'Корзина: addToCart(userId, productId, qty), removeFromCart, getCartTotal',
        'Оформление заказа: checkout(userId) — проверяет наличие, списывает товар и баланс',
        'Скидка 10% при сумме корзины > 10000',
        'История заказов: getOrderHistory(userId) — список прошлых заказов',
        'Полное покрытие: happy path, edge cases, ошибки'
      ],
      expectedOutput: 'PASS: testAddToCart\nPASS: testCartTotal\nPASS: testCheckoutSuccess\nPASS: testCheckoutOutOfStock\nPASS: testCheckoutInsufficientFunds\nPASS: testDiscountApplied\nPASS: testOrderHistory\nPASS: testCartClearedAfterCheckout\nPASS: testStockDecreasedAfterCheckout\nPASS: testFullScenario\nИтого: 10/10',
      hint: 'Разделите систему на модули: каталог, корзина, платежи, заказы. checkout — координатор: проверяет наличие -> считает сумму -> применяет скидку -> списывает -> очищает корзину -> сохраняет в историю.',
      solution: `import java.util.*;

public class Main {
    static int passed = 0;
    static int total = 0;

    // --- Каталог ---
    static Map<Integer, String[]> catalog; // id -> [name, price, stock]

    static void addProduct(int id, String name, double price, int stock) {
        catalog.put(id, new String[]{name, String.valueOf(price), String.valueOf(stock)});
    }

    static String getProductName(int id) {
        String[] p = catalog.get(id);
        return p != null ? p[0] : null;
    }

    static double getProductPrice(int id) {
        String[] p = catalog.get(id);
        return p != null ? Double.parseDouble(p[1]) : 0;
    }

    static int getProductStock(int id) {
        String[] p = catalog.get(id);
        return p != null ? Integer.parseInt(p[2]) : 0;
    }

    static void decreaseStock(int id, int qty) {
        String[] p = catalog.get(id);
        p[2] = String.valueOf(Integer.parseInt(p[2]) - qty);
    }

    // --- Корзина ---
    static Map<String, Map<Integer, Integer>> carts; // userId -> (productId -> qty)

    static boolean addToCart(String userId, int productId, int qty) {
        if (!catalog.containsKey(productId)) return false;
        Map<Integer, Integer> cart = carts.computeIfAbsent(userId, k -> new HashMap<>());
        cart.merge(productId, qty, Integer::sum);
        return true;
    }

    static void removeFromCart(String userId, int productId) {
        Map<Integer, Integer> cart = carts.get(userId);
        if (cart != null) cart.remove(productId);
    }

    static double getCartTotal(String userId) {
        Map<Integer, Integer> cart = carts.get(userId);
        if (cart == null) return 0;
        double sum = 0;
        for (Map.Entry<Integer, Integer> entry : cart.entrySet()) {
            sum += getProductPrice(entry.getKey()) * entry.getValue();
        }
        return sum;
    }

    // --- Балансы ---
    static Map<String, Double> balances;

    static void setBalance(String userId, double amount) {
        balances.put(userId, amount);
    }

    static double getBalance(String userId) {
        return balances.getOrDefault(userId, 0.0);
    }

    // --- Заказы ---
    static Map<String, List<String>> orderHistory; // userId -> list of order descriptions

    static String checkout(String userId) {
        Map<Integer, Integer> cart = carts.get(userId);
        if (cart == null || cart.isEmpty()) return "ERROR:EMPTY_CART";

        // Проверка наличия
        for (Map.Entry<Integer, Integer> item : cart.entrySet()) {
            if (getProductStock(item.getKey()) < item.getValue()) {
                return "ERROR:OUT_OF_STOCK:" + getProductName(item.getKey());
            }
        }

        // Расчёт суммы
        double total = getCartTotal(userId);
        // Скидка 10% при сумме > 10000
        if (total > 10000) {
            total = total * 0.9;
        }
        total = Math.round(total * 100.0) / 100.0;

        // Проверка баланса
        if (getBalance(userId) < total) {
            return "ERROR:INSUFFICIENT_FUNDS";
        }

        // Оформление
        balances.put(userId, getBalance(userId) - total);
        for (Map.Entry<Integer, Integer> item : cart.entrySet()) {
            decreaseStock(item.getKey(), item.getValue());
        }

        // Сохранение заказа
        StringBuilder orderDesc = new StringBuilder("Заказ:");
        for (Map.Entry<Integer, Integer> item : cart.entrySet()) {
            orderDesc.append(" ").append(getProductName(item.getKey()))
                     .append("x").append(item.getValue());
        }
        orderDesc.append(" = ").append(total);
        orderHistory.computeIfAbsent(userId, k -> new ArrayList<>())
                    .add(orderDesc.toString());

        // Очистка корзины
        cart.clear();
        return "OK:" + total;
    }

    static List<String> getOrderHistory(String userId) {
        return orderHistory.getOrDefault(userId, new ArrayList<>());
    }

    static void initShop() {
        catalog = new HashMap<>();
        carts = new HashMap<>();
        balances = new HashMap<>();
        orderHistory = new HashMap<>();
    }

    // --- Хелперы ---
    static void assertEquals(Object expected, Object actual) {
        if (!Objects.equals(expected, actual)) {
            throw new RuntimeException(
                "Ожидали [" + expected + "], получили [" + actual + "]");
        }
    }

    static void assertDoubleEquals(double expected, double actual) {
        if (Math.abs(expected - actual) > 0.01) {
            throw new RuntimeException(
                "Ожидали " + expected + ", получили " + actual);
        }
    }

    static void assertTrue(boolean c) {
        if (!c) throw new RuntimeException("Ожидали true");
    }

    static void runTest(String name, Runnable test) {
        total++;
        initShop();
        try {
            test.run();
            passed++;
            System.out.println("PASS: " + name);
        } catch (Exception e) {
            System.out.println("FAIL: " + name + " - " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        runTest("testAddToCart", () -> {
            addProduct(1, "Телефон", 200000, 10);
            assertTrue(addToCart("user1", 1, 1));
        });

        runTest("testCartTotal", () -> {
            addProduct(1, "Мышка", 5000, 10);
            addProduct(2, "Клавиатура", 8000, 10);
            addToCart("user1", 1, 2);
            addToCart("user1", 2, 1);
            assertDoubleEquals(18000.0, getCartTotal("user1"));
        });

        runTest("testCheckoutSuccess", () -> {
            addProduct(1, "USB-кабель", 1000, 10);
            setBalance("user1", 50000);
            addToCart("user1", 1, 3);
            String result = checkout("user1");
            assertTrue(result.startsWith("OK:"));
        });

        runTest("testCheckoutOutOfStock", () -> {
            addProduct(1, "Редкий товар", 5000, 2);
            setBalance("user1", 100000);
            addToCart("user1", 1, 5); // хотим 5, на складе 2
            String result = checkout("user1");
            assertTrue(result.startsWith("ERROR:OUT_OF_STOCK"));
        });

        runTest("testCheckoutInsufficientFunds", () -> {
            addProduct(1, "Ноутбук", 500000, 5);
            setBalance("user1", 100000); // недостаточно
            addToCart("user1", 1, 1);
            String result = checkout("user1");
            assertEquals("ERROR:INSUFFICIENT_FUNDS", result);
        });

        runTest("testDiscountApplied", () -> {
            addProduct(1, "Товар", 6000, 10);
            setBalance("user1", 100000);
            addToCart("user1", 1, 2); // 12000 > 10000 -> скидка 10%
            String result = checkout("user1");
            // 12000 * 0.9 = 10800
            assertEquals("OK:10800.0", result);
        });

        runTest("testOrderHistory", () -> {
            addProduct(1, "Книга", 3000, 10);
            setBalance("user1", 100000);
            addToCart("user1", 1, 1);
            checkout("user1");
            List<String> history = getOrderHistory("user1");
            assertEquals(1, history.size());
            assertTrue(history.get(0).contains("Книга"));
        });

        runTest("testCartClearedAfterCheckout", () -> {
            addProduct(1, "Товар", 1000, 10);
            setBalance("user1", 50000);
            addToCart("user1", 1, 2);
            checkout("user1");
            assertDoubleEquals(0.0, getCartTotal("user1"));
        });

        runTest("testStockDecreasedAfterCheckout", () -> {
            addProduct(1, "Наушники", 10000, 5);
            setBalance("user1", 100000);
            addToCart("user1", 1, 3);
            checkout("user1");
            assertEquals(2, getProductStock(1)); // 5 - 3 = 2
        });

        runTest("testFullScenario", () -> {
            // Полный сценарий покупки
            addProduct(1, "Телефон", 150000, 3);
            addProduct(2, "Чехол", 5000, 20);
            addProduct(3, "Защитное стекло", 3000, 15);
            setBalance("user1", 200000);

            addToCart("user1", 1, 1);  // 150000
            addToCart("user1", 2, 2);  //  10000
            addToCart("user1", 3, 1);  //   3000
            // Итого: 163000 > 10000 -> скидка 10%
            // 163000 * 0.9 = 146700

            String result = checkout("user1");
            assertTrue(result.startsWith("OK:"));
            assertDoubleEquals(53300.0, getBalance("user1")); // 200000 - 146700
            assertEquals(2, getProductStock(1));
            assertEquals(18, getProductStock(2));
            assertEquals(14, getProductStock(3));
            assertEquals(1, getOrderHistory("user1").size());
            assertDoubleEquals(0.0, getCartTotal("user1"));
        });

        System.out.println("Итого: " + passed + "/" + total);
    }
}`,
      explanation: 'Финальная задача объединяет все концепции TDD и тестирования. Интернет-магазин — реальная система с несколькими компонентами: каталог, корзина, платежи, заказы. checkout — координатор, который проверяет все условия, применяет скидку, списывает средства, обновляет склад, сохраняет историю и очищает корзину. testFullScenario — интеграционный тест всего потока. Каждый отдельный тест проверяет одно поведение, а финальный тест собирает всё вместе.'
    }
  ]
}
