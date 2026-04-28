export default {
  id: 126,
  title: 'Практикум: Clean Code рефакторинг',
  description: 'Практические задачи на рефакторинг кода: именование, извлечение методов, удаление дублирования, упрощение условий, SRP, Tell Don\'t Ask, полиморфизм, DI.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Именование переменных',
      type: 'practice',
      difficulty: 'easy',
      description: 'Перепиши код с плохими именами переменных (a, x, temp, data, flag) на осмысленные. Имя должно отвечать на вопрос "что это?" без комментариев.',
      requirements: [
        'Переименуй: int a → int totalPrice, String x → String customerName и т.д.',
        'Массив d[] → orders[], boolean f → isEligibleForDiscount',
        'Методы: calc() → calculateTotalWithDiscount(), proc() → processOrder()',
        'Код до и после рефакторинга должен давать одинаковый результат'
      ],
      expectedOutput: '=== ДО рефакторинга (плохие имена) ===\na=1000, x=Alice, d=[500, 300, 200], f=true\nres: 900\n\n=== ПОСЛЕ рефакторинга (хорошие имена) ===\ntotalPrice=1000, customerName=Alice\norders=[500, 300, 200], isEligibleForDiscount=true\ndiscountedTotal: 900\n\nРезультаты совпадают: true',
      hint: 'Хорошее имя: описывает назначение (totalPrice), не тип (intVar). Булевы переменные: is/has/can (isActive, hasDiscount). Коллекции: множественное число (orders, users).',
      solution: `public class Main {

    // ДО: плохие имена
    static int calc(int a, int[] d, boolean f) {
        int res = a;
        for (int i = 0; i < d.length; i++) {
            res += d[i];
        }
        if (f) res = (int)(res * 0.9);
        return res;
    }

    // ПОСЛЕ: хорошие имена
    static int calculateTotalWithDiscount(int basePrice, int[] orderAmounts,
                                          boolean isEligibleForDiscount) {
        int totalPrice = basePrice;
        for (int orderAmount : orderAmounts) {
            totalPrice += orderAmount;
        }
        if (isEligibleForDiscount) {
            totalPrice = (int)(totalPrice * 0.9);
        }
        return totalPrice;
    }

    public static void main(String[] args) {
        // ДО рефакторинга
        System.out.println("=== ДО рефакторинга (плохие имена) ===");
        int a = 1000;
        String x = "Alice";
        int[] d = {500, 300, 200};
        boolean f = true;
        System.out.println("a=" + a + ", x=" + x + ", d=[500, 300, 200], f=" + f);
        int res = calc(a, d, f);
        System.out.println("res: " + res);

        // ПОСЛЕ рефакторинга
        System.out.println("\\n=== ПОСЛЕ рефакторинга (хорошие имена) ===");
        int totalPrice = 1000;
        String customerName = "Alice";
        int[] orders = {500, 300, 200};
        boolean isEligibleForDiscount = true;
        System.out.println("totalPrice=" + totalPrice + ", customerName=" + customerName);
        System.out.println("orders=[500, 300, 200], isEligibleForDiscount=" + isEligibleForDiscount);
        int discountedTotal = calculateTotalWithDiscount(totalPrice, orders, isEligibleForDiscount);
        System.out.println("discountedTotal: " + discountedTotal);

        System.out.println("\\nРезультаты совпадают: " + (res == discountedTotal));
    }
}`,
      explanation: 'Именование — основа читаемого кода. Правила: 1) Имя отвечает на "что это?" (totalPrice, not a). 2) Булевы: is/has/can (isActive). 3) Коллекции: множественное число (orders). 4) Методы: глагол + существительное (calculateTotal). 5) Избегай: однобуквенных имён (кроме i в циклах), аббревиатур (usr→user), общих слов (data, info, temp). Код читают в 10 раз чаще, чем пишут — инвестиция в имена окупается.'
    },
    {
      id: 2,
      title: 'Задача: Извлечение метода',
      type: 'practice',
      difficulty: 'easy',
      description: 'Разбей длинный метод processOrder() (50+ строк) на 5 маленьких с понятными именами. Каждый метод делает одну вещь и помещается на один экран.',
      requirements: [
        'Разбей processOrder на: validateOrder, calculateTotal, applyDiscount, generateInvoice, sendNotification',
        'Каждый метод — 5-10 строк, одна ответственность',
        'processOrder вызывает методы по порядку как "оглавление"',
        'Результат до и после рефакторинга идентичен'
      ],
      expectedOutput: '=== ДО: один большой метод processOrder() ===\nВалидация заказа... OK\nТовар: Laptop, цена: 1000\nТовар: Mouse, цена: 50\nИтого: 1050\nСкидка 10%: 945\nСчёт #INV-001 сгенерирован\nEmail отправлен: order confirmed\n\n=== ПОСЛЕ: 5 маленьких методов ===\n1. validateOrder() → OK\n2. calculateTotal() → 1050\n3. applyDiscount(10%) → 945\n4. generateInvoice() → INV-001\n5. sendNotification() → email sent\nИтог: 945',
      hint: 'Метод processOrder() после рефакторинга читается как оглавление книги. Каждый подметод можно понять, тестировать и изменять отдельно.',
      solution: `public class Main {

    static String[] items = {"Laptop", "Mouse"};
    static int[] prices = {1000, 50};

    // ДО: один большой метод
    static void processOrderBefore() {
        System.out.println("=== ДО: один большой метод processOrder() ===");
        // Валидация
        if (items.length == 0) { System.out.println("Ошибка: пустой заказ"); return; }
        System.out.println("Валидация заказа... OK");

        // Расчёт суммы
        int total = 0;
        for (int i = 0; i < items.length; i++) {
            System.out.println("Товар: " + items[i] + ", цена: " + prices[i]);
            total += prices[i];
        }
        System.out.println("Итого: " + total);

        // Скидка
        int discount = 10;
        total = total - (total * discount / 100);
        System.out.println("Скидка " + discount + "%: " + total);

        // Счёт
        String invoiceId = "INV-001";
        System.out.println("Счёт #" + invoiceId + " сгенерирован");

        // Уведомление
        System.out.println("Email отправлен: order confirmed");
    }

    // ПОСЛЕ: 5 маленьких методов
    static boolean validateOrder() {
        if (items.length == 0) return false;
        System.out.println("1. validateOrder() → OK");
        return true;
    }

    static int calculateTotal() {
        int total = 0;
        for (int price : prices) total += price;
        System.out.println("2. calculateTotal() → " + total);
        return total;
    }

    static int applyDiscount(int total, int discountPercent) {
        int discounted = total - (total * discountPercent / 100);
        System.out.println("3. applyDiscount(" + discountPercent + "%) → " + discounted);
        return discounted;
    }

    static String generateInvoice() {
        String id = "INV-001";
        System.out.println("4. generateInvoice() → " + id);
        return id;
    }

    static void sendNotification() {
        System.out.println("5. sendNotification() → email sent");
    }

    static void processOrderAfter() {
        System.out.println("\\n=== ПОСЛЕ: 5 маленьких методов ===");
        if (!validateOrder()) return;
        int total = calculateTotal();
        total = applyDiscount(total, 10);
        generateInvoice();
        sendNotification();
        System.out.println("Итог: " + total);
    }

    public static void main(String[] args) {
        processOrderBefore();
        processOrderAfter();
    }
}`,
      explanation: 'Извлечение метода (Extract Method) — самый частый рефакторинг. Длинный метод разбивается на маленькие с говорящими именами. Результат: processOrder() читается как оглавление: validate → calculate → discount → invoice → notify. Каждый подметод можно понять за 5 секунд, тестировать изолированно и переиспользовать. Правило: метод делает одну вещь и помещается на экран (10-15 строк).'
    },
    {
      id: 3,
      title: 'Задача: Удаление дублирования',
      type: 'practice',
      difficulty: 'medium',
      description: 'Найди и устрани copy-paste дублирование в трёх классах: UserReport, OrderReport, ProductReport. Все три имеют одинаковый код генерации отчёта — различаются только данные.',
      requirements: [
        'Найди общий код в трёх классах (header, body, footer одинаковы)',
        'Извлеки общую логику в базовый класс или метод',
        'Каждый тип отчёта только предоставляет свои данные',
        'DRY: Don\'t Repeat Yourself'
      ],
      expectedOutput: '=== ДО: три класса с copy-paste ===\n--- User Report ---\n====================\nOTЧЁТ: Users\n====================\n| Alice | 30 |\n| Bob | 25 |\n====================\nИтого: 2 записей\n\n--- Order Report ---\n====================\nOTЧЁТ: Orders\n====================\n| ORD-1 | 500 |\n| ORD-2 | 300 |\n====================\nИтого: 2 записей\n\n=== ПОСЛЕ: один метод generateReport() ===\n(Тот же вывод, но без дублирования кода)',
      hint: 'Общая логика: printHeader → printRows → printFooter. Различия: title, данные, форматирование. Извлеки общий метод generateReport(title, data).',
      solution: `public class Main {

    // ДО: дублирование в каждом "классе"
    static void userReportBefore() {
        System.out.println("--- User Report ---");
        System.out.println("====================");
        System.out.println("ОТЧЁТ: Users");
        System.out.println("====================");
        System.out.println("| Alice | 30 |");
        System.out.println("| Bob | 25 |");
        System.out.println("====================");
        System.out.println("Итого: 2 записей");
    }

    static void orderReportBefore() {
        System.out.println("\\n--- Order Report ---");
        System.out.println("====================");
        System.out.println("ОТЧЁТ: Orders");
        System.out.println("====================");
        System.out.println("| ORD-1 | 500 |");
        System.out.println("| ORD-2 | 300 |");
        System.out.println("====================");
        System.out.println("Итого: 2 записей");
    }

    // ПОСЛЕ: один универсальный метод
    static void generateReport(String title, String[][] rows) {
        System.out.println("\\n--- " + title + " Report ---");
        System.out.println("====================");
        System.out.println("ОТЧЁТ: " + title);
        System.out.println("====================");
        for (String[] row : rows) {
            StringBuilder sb = new StringBuilder("| ");
            for (int i = 0; i < row.length; i++) {
                if (i > 0) sb.append(" | ");
                sb.append(row[i]);
            }
            sb.append(" |");
            System.out.println(sb.toString());
        }
        System.out.println("====================");
        System.out.println("Итого: " + rows.length + " записей");
    }

    public static void main(String[] args) {
        System.out.println("=== ДО: три класса с copy-paste ===");
        userReportBefore();
        orderReportBefore();

        System.out.println("\\n=== ПОСЛЕ: один метод generateReport() ===");
        System.out.println("(Тот же вывод, но без дублирования кода)");

        generateReport("Users", new String[][]{
            {"Alice", "30"},
            {"Bob", "25"}
        });

        generateReport("Orders", new String[][]{
            {"ORD-1", "500"},
            {"ORD-2", "300"}
        });

        generateReport("Products", new String[][]{
            {"Laptop", "1000"},
            {"Mouse", "50"}
        });
    }
}`,
      explanation: 'DRY (Don\'t Repeat Yourself) — один из главных принципов. Дублирование = баг в будущем: изменив код в одном месте, забудешь в другом. Решение: извлечь общую логику в один метод/класс, а различия передавать через параметры. Здесь три "класса" отчётов заменены одним generateReport(title, data). При изменении формата — правим одно место. В реальных проектах используют Template Method или Strategy для различий.'
    },
    {
      id: 4,
      title: 'Задача: Замена magic numbers',
      type: 'practice',
      difficulty: 'easy',
      description: 'Замени все "магические числа" в коде на именованные константы. Magic number — числовой литерал без объяснения, что он означает.',
      requirements: [
        'Найди все магические числа: 0.18, 100, 3600, 86400, 7, 30, 1024',
        'Замени на константы: TAX_RATE, MAX_RETRIES, SECONDS_IN_HOUR и т.д.',
        'Используй static final для констант',
        'Код с константами читается как документация'
      ],
      expectedOutput: '=== ДО: магические числа ===\nЦена: 1000, налог: 180.0, итого: 1180.0\nВремя: 7200 секунд = 2.0 часов\nФайл: 5242880 байт = 5.0 МБ\nПопытка 1 из 3\n\n=== ПОСЛЕ: именованные константы ===\nЦена: 1000, налог (TAX_RATE=0.18): 180.0, итого: 1180.0\nВремя: 7200 секунд = 2.0 часов (SECONDS_IN_HOUR=3600)\nФайл: 5242880 байт = 5.0 МБ (BYTES_IN_MB=1048576)\nПопытка 1 из MAX_RETRIES=3',
      hint: 'Если число не очевидно (0, 1, -1 обычно ок), замени константой. Имя константы = документация: TAX_RATE = 0.18 понятнее, чем просто 0.18.',
      solution: `public class Main {

    // ПОСЛЕ: именованные константы
    static final double TAX_RATE = 0.18;
    static final int SECONDS_IN_HOUR = 3600;
    static final int BYTES_IN_MB = 1024 * 1024;
    static final int MAX_RETRIES = 3;

    // ДО: магические числа
    static void beforeRefactoring() {
        System.out.println("=== ДО: магические числа ===");
        int price = 1000;
        double tax = price * 0.18;
        System.out.println("Цена: " + price + ", налог: " + tax + ", итого: " + (price + tax));

        int seconds = 7200;
        System.out.println("Время: " + seconds + " секунд = " + (seconds / 3600.0) + " часов");

        int bytes = 5242880;
        System.out.println("Файл: " + bytes + " байт = " + (bytes / 1048576.0) + " МБ");

        System.out.println("Попытка 1 из 3");
    }

    // ПОСЛЕ: константы
    static void afterRefactoring() {
        System.out.println("\\n=== ПОСЛЕ: именованные константы ===");
        int price = 1000;
        double tax = price * TAX_RATE;
        System.out.println("Цена: " + price + ", налог (TAX_RATE=" + TAX_RATE + "): " +
                           tax + ", итого: " + (price + tax));

        int seconds = 7200;
        System.out.println("Время: " + seconds + " секунд = " +
                           (seconds / (double) SECONDS_IN_HOUR) + " часов (SECONDS_IN_HOUR=" +
                           SECONDS_IN_HOUR + ")");

        int bytes = 5 * BYTES_IN_MB;
        System.out.println("Файл: " + bytes + " байт = " +
                           (bytes / (double) BYTES_IN_MB) + " МБ (BYTES_IN_MB=" + BYTES_IN_MB + ")");

        System.out.println("Попытка 1 из MAX_RETRIES=" + MAX_RETRIES);
    }

    public static void main(String[] args) {
        beforeRefactoring();
        afterRefactoring();
    }
}`,
      explanation: 'Magic numbers — числа без контекста: что означает 0.18? 3600? 1024? Константы решают проблему: TAX_RATE = 0.18 — сразу понятно. Правила: 1) static final для неизменяемых значений. 2) UPPER_SNAKE_CASE для имён. 3) 0, 1, -1 обычно не нуждаются в константах. 4) Если число встречается в двух местах — 100% нужна константа. 5) Группируй связанные константы в enum или интерфейс.'
    },
    {
      id: 5,
      title: 'Задача: Упрощение условий',
      type: 'practice',
      difficulty: 'medium',
      description: 'Перепиши глубоко вложенные if-else (arrow code) через early return и guard clauses. Замени сложные условия на методы с понятными именами.',
      requirements: [
        'Замени 5 уровней вложенности на guard clauses с early return',
        'Извлеки сложные условия в методы: isValidAge(), hasPermission()',
        'Используй отрицание условий для раннего выхода',
        'Результат: максимум 1-2 уровня вложенности'
      ],
      expectedOutput: '=== ДО: arrow code (5 уровней вложенности) ===\nprocessRequest(user=admin, age=25, active=true, verified=true)\n  → if user != null\n    → if active\n      → if verified\n        → if age >= 18\n          → if hasPermission\n            → RESULT: Access granted\n\n=== ПОСЛЕ: guard clauses (0 вложенности) ===\nprocessRequest(user=admin, age=25, active=true, verified=true)\n  guard: user != null ✓\n  guard: isActive ✓\n  guard: isVerified ✓\n  guard: age >= 18 ✓\n  guard: hasPermission ✓\n  → RESULT: Access granted\n\nprocessRequest(user=null) → "User is null"\nprocessRequest(active=false) → "User is not active"\nprocessRequest(age=15) → "User is underage"',
      hint: 'Guard clause: если условие не выполнено — return сразу. Это "выравнивает" код, убирая вложенность. Читается: "если не X — уходи, если не Y — уходи, ... делай работу".',
      solution: `public class Main {

    // ДО: arrow code
    static String processRequestBefore(String user, int age, boolean active,
                                       boolean verified, boolean hasPermission) {
        if (user != null) {
            if (active) {
                if (verified) {
                    if (age >= 18) {
                        if (hasPermission) {
                            return "Access granted";
                        } else { return "No permission"; }
                    } else { return "User is underage"; }
                } else { return "User is not verified"; }
            } else { return "User is not active"; }
        } else { return "User is null"; }
    }

    // ПОСЛЕ: guard clauses
    static String processRequestAfter(String user, int age, boolean active,
                                      boolean verified, boolean hasPermission) {
        if (user == null) return "User is null";
        if (!active) return "User is not active";
        if (!verified) return "User is not verified";
        if (age < 18) return "User is underage";
        if (!hasPermission) return "No permission";
        return "Access granted";
    }

    public static void main(String[] args) {
        // ДО
        System.out.println("=== ДО: arrow code (5 уровней вложенности) ===");
        System.out.println("processRequest(user=admin, age=25, active=true, verified=true)");
        System.out.println("  → if user != null");
        System.out.println("    → if active");
        System.out.println("      → if verified");
        System.out.println("        → if age >= 18");
        System.out.println("          → if hasPermission");
        String r1 = processRequestBefore("admin", 25, true, true, true);
        System.out.println("            → RESULT: " + r1);

        // ПОСЛЕ
        System.out.println("\\n=== ПОСЛЕ: guard clauses (0 вложенности) ===");
        System.out.println("processRequest(user=admin, age=25, active=true, verified=true)");
        System.out.println("  guard: user != null ✓");
        System.out.println("  guard: isActive ✓");
        System.out.println("  guard: isVerified ✓");
        System.out.println("  guard: age >= 18 ✓");
        System.out.println("  guard: hasPermission ✓");
        String r2 = processRequestAfter("admin", 25, true, true, true);
        System.out.println("  → RESULT: " + r2);

        // Тесты guard clauses
        System.out.println("\\nprocessRequest(user=null) → \\"" +
                           processRequestAfter(null, 25, true, true, true) + "\\"");
        System.out.println("processRequest(active=false) → \\"" +
                           processRequestAfter("user", 25, false, true, true) + "\\"");
        System.out.println("processRequest(age=15) → \\"" +
                           processRequestAfter("user", 15, true, true, true) + "\\"");
    }
}`,
      explanation: 'Guard clause — ранний выход при невыполнении условия. Вместо глубокой вложенности (arrow code) проверяем негативные случаи в начале метода: if (invalid) return error. Оставшийся код — happy path без вложенности. Правила: 1) Проверяй ошибки первыми. 2) Используй early return. 3) Сложные условия выноси в методы: isEligible(), hasPermission(). 4) Максимум 2 уровня вложенности. Код читается сверху вниз как список проверок.'
    },
    {
      id: 6,
      title: 'Задача: Single Responsibility',
      type: 'practice',
      difficulty: 'medium',
      description: 'Разбей God-класс UserManager (300+ строк, 20+ методов) на маленькие классы с одной ответственностью. Каждый класс делает одну вещь хорошо.',
      requirements: [
        'UserManager → UserValidator + UserRepository + UserNotifier + UserService',
        'UserValidator: валидация данных пользователя',
        'UserRepository: работа с хранилищем данных',
        'UserNotifier: отправка уведомлений',
        'UserService: координация (вызывает остальные)'
      ],
      expectedOutput: '=== ДО: God-класс UserManager (всё в одном) ===\nUserManager.register(): валидация + сохранение + email + лог\n\n=== ПОСЛЕ: 4 маленьких класса ===\nUserValidator.validate("Alice", "a@b.com") → OK\nUserRepository.save("Alice") → id=1\nUserNotifier.sendWelcome("a@b.com") → email sent\nUserService.register() → координация всех шагов\n\nUserValidator.validate("", "invalid") → [name required, email format]\nUserRepository.findById(1) → Alice\nUserRepository.findById(99) → null',
      hint: 'SRP: класс должен иметь только одну причину для изменения. UserManager менялся при изменении валидации, БД, email, логирования — 4 причины = 4 класса.',
      solution: `import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Main {

    // ПОСЛЕ: UserValidator
    static List<String> validate(String name, String email) {
        List<String> errors = new ArrayList<>();
        if (name == null || name.isEmpty()) errors.add("name required");
        if (email == null || !email.contains("@")) errors.add("email format");
        return errors;
    }

    // ПОСЛЕ: UserRepository
    static Map<Integer, String> repo = new HashMap<>();
    static int nextId = 1;

    static int repoSave(String name) {
        int id = nextId++;
        repo.put(id, name);
        return id;
    }

    static String repoFind(int id) {
        return repo.get(id);
    }

    // ПОСЛЕ: UserNotifier
    static void sendWelcome(String email) {
        System.out.println("UserNotifier.sendWelcome(\\"" + email + "\\") → email sent");
    }

    // ПОСЛЕ: UserService (координация)
    static void register(String name, String email) {
        // 1. Валидация
        List<String> errors = validate(name, email);
        if (!errors.isEmpty()) {
            System.out.println("UserService.register() → ОШИБКА: " + errors);
            return;
        }
        System.out.println("UserValidator.validate(\\"" + name + "\\", \\"" + email + "\\") → OK");

        // 2. Сохранение
        int id = repoSave(name);
        System.out.println("UserRepository.save(\\"" + name + "\\") → id=" + id);

        // 3. Уведомление
        sendWelcome(email);

        // 4. Координация
        System.out.println("UserService.register() → координация всех шагов");
    }

    public static void main(String[] args) {
        System.out.println("=== ДО: God-класс UserManager (всё в одном) ===");
        System.out.println("UserManager.register(): валидация + сохранение + email + лог");

        System.out.println("\\n=== ПОСЛЕ: 4 маленьких класса ===");
        register("Alice", "a@b.com");

        System.out.println("\\nUserValidator.validate(\\"\\", \\"invalid\\") → " +
                           validate("", "invalid"));

        System.out.println("UserRepository.findById(1) → " + repoFind(1));
        System.out.println("UserRepository.findById(99) → " + repoFind(99));
    }
}`,
      explanation: 'SRP (Single Responsibility Principle) — класс имеет одну причину для изменения. God-класс UserManager нарушал SRP: менялся при изменении валидации, БД, email, логики. Решение: разделить на 4 класса по ответственности. UserService — фасад, координирующий остальные. Каждый класс прост, тестируем, заменяем. Например, замена email на SMS затрагивает только UserNotifier, а не весь UserManager.'
    },
    {
      id: 7,
      title: 'Задача: Tell Don\'t Ask',
      type: 'practice',
      difficulty: 'medium',
      description: 'Преобразуй код с "getters + if" на "Tell Don\'t Ask": вместо получения данных и принятия решения снаружи — попроси объект сделать это самому.',
      requirements: [
        'ДО: if (account.getBalance() >= amount) account.setBalance(balance - amount)',
        'ПОСЛЕ: account.withdraw(amount) — объект сам решает и действует',
        'Перенеси бизнес-логику из вызывающего кода внутрь объекта',
        'Объект инкапсулирует данные И поведение'
      ],
      expectedOutput: '=== ДО: Ask (getters + if снаружи) ===\nif (account.getBalance() >= 300)\n  account.setBalance(account.getBalance() - 300)\nБаланс: 700\nif (account.getBalance() >= 1000)\n  → недостаточно средств (решение СНАРУЖИ)\n\n=== ПОСЛЕ: Tell (метод с поведением) ===\naccount.withdraw(300) → OK, баланс: 700\naccount.withdraw(1000) → Недостаточно средств (решение ВНУТРИ)\naccount.deposit(500) → OK, баланс: 1200\naccount.transferTo(other, 200) → OK',
      hint: 'Tell Don\'t Ask: вместо "дай мне данные, я решу" — "сделай это сам". Перемести if-логику из вызывающего кода в метод объекта.',
      solution: `public class Main {

    // Данные аккаунта
    static int balance1 = 1000;
    static int balance2 = 500;

    // ДО: Ask — getters + внешняя логика
    static void withdrawAsk(int amount) {
        if (balance1 >= amount) {
            balance1 -= amount;
            System.out.println("  account.setBalance(account.getBalance() - " + amount + ")");
            System.out.println("Баланс: " + balance1);
        } else {
            System.out.println("  → недостаточно средств (решение СНАРУЖИ)");
        }
    }

    // ПОСЛЕ: Tell — метод с поведением внутри
    static boolean withdraw(int amount) {
        if (balance1 < amount) {
            System.out.println("account.withdraw(" + amount + ") → Недостаточно средств (решение ВНУТРИ)");
            return false;
        }
        balance1 -= amount;
        System.out.println("account.withdraw(" + amount + ") → OK, баланс: " + balance1);
        return true;
    }

    static void deposit(int amount) {
        balance1 += amount;
        System.out.println("account.deposit(" + amount + ") → OK, баланс: " + balance1);
    }

    static boolean transferTo(int amount) {
        if (balance1 < amount) return false;
        balance1 -= amount;
        balance2 += amount;
        System.out.println("account.transferTo(other, " + amount + ") → OK");
        return true;
    }

    public static void main(String[] args) {
        // ДО
        System.out.println("=== ДО: Ask (getters + if снаружи) ===");
        System.out.println("if (account.getBalance() >= 300)");
        balance1 = 1000;
        withdrawAsk(300);
        System.out.println("if (account.getBalance() >= 1000)");
        withdrawAsk(1000);

        // ПОСЛЕ
        System.out.println("\\n=== ПОСЛЕ: Tell (метод с поведением) ===");
        balance1 = 1000;
        withdraw(300);
        withdraw(1000);
        deposit(500);
        transferTo(200);
    }
}`,
      explanation: 'Tell Don\'t Ask — принцип ООП: не спрашивай объект о его состоянии для принятия решения. Вместо этого попроси объект выполнить действие. ДО: if (account.getBalance() >= amount) — логика снаружи. ПОСЛЕ: account.withdraw(amount) — объект сам проверяет и действует. Это улучшает инкапсуляцию: только Account знает правила списания. При изменении правил (комиссия, лимит) правим одно место.'
    },
    {
      id: 8,
      title: 'Задача: Replace switch с полиморфизмом',
      type: 'practice',
      difficulty: 'medium',
      description: 'Замени длинный switch по типу на полиморфизм. Вместо switch(shape.type) создай иерархию классов, где каждый класс знает, как вычислить свою площадь.',
      requirements: [
        'ДО: switch(type) с case "circle", "rectangle", "triangle"',
        'ПОСЛЕ: интерфейс Shape с методом area(), каждый класс реализует свой',
        'Добавление нового типа: ДО — правка switch в 5 местах, ПОСЛЕ — новый класс',
        'Open/Closed: открыт для расширения, закрыт для модификации'
      ],
      expectedOutput: '=== ДО: switch по типу ===\ncalcArea("circle", 5, 0) = 78.54\ncalcArea("rectangle", 4, 6) = 24.00\ncalcArea("triangle", 3, 4) = 6.00\nДобавить "pentagon" → правка ВСЕХ switch!\n\n=== ПОСЛЕ: полиморфизм ===\ncircle.area() = 78.54\nrectangle.area() = 24.00\ntriangle.area() = 6.00\nДобавить Pentagon → новый класс, старый код НЕ меняется!',
      hint: 'Switch по типу — антипаттерн. Каждый новый тип требует правки ВСЕХ switch. С полиморфизмом — добавляешь новый класс, и он сам знает свою логику.',
      solution: `public class Main {

    // ДО: switch
    static double calcAreaSwitch(String type, double a, double b) {
        switch (type) {
            case "circle": return Math.PI * a * a;
            case "rectangle": return a * b;
            case "triangle": return 0.5 * a * b;
            default: throw new IllegalArgumentException("Unknown: " + type);
        }
    }

    // ПОСЛЕ: полиморфизм
    interface Shape {
        double area();
        String name();
    }

    static class Circle implements Shape {
        double radius;
        Circle(double r) { this.radius = r; }
        public double area() { return Math.PI * radius * radius; }
        public String name() { return "circle"; }
    }

    static class Rectangle implements Shape {
        double w, h;
        Rectangle(double w, double h) { this.w = w; this.h = h; }
        public double area() { return w * h; }
        public String name() { return "rectangle"; }
    }

    static class Triangle implements Shape {
        double base, height;
        Triangle(double b, double h) { this.base = b; this.height = h; }
        public double area() { return 0.5 * base * height; }
        public String name() { return "triangle"; }
    }

    public static void main(String[] args) {
        // ДО
        System.out.println("=== ДО: switch по типу ===");
        System.out.printf("calcArea(\\"circle\\", 5, 0) = %.2f%n",
                          calcAreaSwitch("circle", 5, 0));
        System.out.printf("calcArea(\\"rectangle\\", 4, 6) = %.2f%n",
                          calcAreaSwitch("rectangle", 4, 6));
        System.out.printf("calcArea(\\"triangle\\", 3, 4) = %.2f%n",
                          calcAreaSwitch("triangle", 3, 4));
        System.out.println("Добавить \\"pentagon\\" → правка ВСЕХ switch!");

        // ПОСЛЕ
        System.out.println("\\n=== ПОСЛЕ: полиморфизм ===");
        Shape[] shapes = {
            new Circle(5),
            new Rectangle(4, 6),
            new Triangle(3, 4)
        };
        for (Shape s : shapes) {
            System.out.printf("%s.area() = %.2f%n", s.name(), s.area());
        }
        System.out.println("Добавить Pentagon → новый класс, старый код НЕ меняется!");
    }
}`,
      explanation: 'Switch по типу — code smell: при добавлении нового типа нужно найти и исправить ВСЕ switch (их может быть 5-10 по коду). Полиморфизм решает проблему: каждый класс знает своё поведение. Добавление Pentagon = новый класс Pentagon implements Shape — ни одна строка старого кода не меняется. Это принцип Open/Closed (SOLID): код открыт для расширения (новые классы), закрыт для модификации (старые классы не трогаем).'
    },
    {
      id: 9,
      title: 'Задача: Dependency Injection',
      type: 'practice',
      difficulty: 'hard',
      description: 'Убери жёсткие зависимости (new внутри классов) и внедри их через конструктор. Это делает код тестируемым и гибким — зависимости можно заменить моками или альтернативными реализациями.',
      requirements: [
        'ДО: OrderService создаёт new MySQLRepository() и new SmtpEmailSender() внутри',
        'ПОСЛЕ: OrderService получает Repository и EmailSender через конструктор',
        'Покажи, как легко заменить MySQL на MongoDB или SMTP на SendGrid',
        'Покажи, как подставить мок для тестирования'
      ],
      expectedOutput: '=== ДО: жёсткие зависимости (new внутри) ===\nOrderService → new MySQLRepository() (жёстко привязан!)\nOrderService → new SmtpEmailSender() (жёстко привязан!)\norder.save() → MySQL: saved\norder.notify() → SMTP: sent\nТестировать невозможно без реальной MySQL и SMTP!\n\n=== ПОСЛЕ: Dependency Injection ===\n--- Production ---\nOrderService(MySQL, SMTP)\norder.save() → MySQL: saved\norder.notify() → SMTP: sent\n\n--- Замена реализации ---\nOrderService(MongoDB, SendGrid)\norder.save() → MongoDB: saved\norder.notify() → SendGrid: sent\n\n--- Тестирование с моками ---\nOrderService(MockRepo, MockEmail)\norder.save() → Mock: saved\norder.notify() → Mock: sent\nТест пройден без реальных зависимостей!',
      hint: 'DI: вместо new MySQLRepository() внутри класса — передай Repository через конструктор. Теперь можно подставить любую реализацию: MySQL, MongoDB, MockRepository.',
      solution: `public class Main {

    // Интерфейсы
    interface Repository {
        String save(String data);
        String name();
    }

    interface EmailSender {
        String send(String to, String msg);
        String name();
    }

    // Реализации
    static class MySQLRepo implements Repository {
        public String save(String data) { return "MySQL: saved"; }
        public String name() { return "MySQL"; }
    }

    static class MongoDBRepo implements Repository {
        public String save(String data) { return "MongoDB: saved"; }
        public String name() { return "MongoDB"; }
    }

    static class MockRepo implements Repository {
        public String save(String data) { return "Mock: saved"; }
        public String name() { return "MockRepo"; }
    }

    static class SmtpSender implements EmailSender {
        public String send(String to, String msg) { return "SMTP: sent"; }
        public String name() { return "SMTP"; }
    }

    static class SendGridSender implements EmailSender {
        public String send(String to, String msg) { return "SendGrid: sent"; }
        public String name() { return "SendGrid"; }
    }

    static class MockSender implements EmailSender {
        public String send(String to, String msg) { return "Mock: sent"; }
        public String name() { return "MockEmail"; }
    }

    // OrderService с DI
    static void processOrder(Repository repo, EmailSender sender) {
        System.out.println("OrderService(" + repo.name() + ", " + sender.name() + ")");
        System.out.println("order.save() → " + repo.save("order-1"));
        System.out.println("order.notify() → " + sender.send("user@mail.com", "confirmed"));
    }

    public static void main(String[] args) {
        // ДО
        System.out.println("=== ДО: жёсткие зависимости (new внутри) ===");
        System.out.println("OrderService → new MySQLRepository() (жёстко привязан!)");
        System.out.println("OrderService → new SmtpEmailSender() (жёстко привязан!)");
        System.out.println("order.save() → MySQL: saved");
        System.out.println("order.notify() → SMTP: sent");
        System.out.println("Тестировать невозможно без реальной MySQL и SMTP!");

        // ПОСЛЕ: Production
        System.out.println("\\n=== ПОСЛЕ: Dependency Injection ===");
        System.out.println("--- Production ---");
        processOrder(new MySQLRepo(), new SmtpSender());

        // Замена реализации
        System.out.println("\\n--- Замена реализации ---");
        processOrder(new MongoDBRepo(), new SendGridSender());

        // Тестирование
        System.out.println("\\n--- Тестирование с моками ---");
        processOrder(new MockRepo(), new MockSender());
        System.out.println("Тест пройден без реальных зависимостей!");
    }
}`,
      explanation: 'Dependency Injection (DI) — принцип: класс НЕ создаёт свои зависимости, а ПОЛУЧАЕТ их извне (через конструктор). ДО: OrderService жёстко привязан к MySQL и SMTP. ПОСЛЕ: OrderService работает с интерфейсами Repository и EmailSender. Преимущества: 1) Тестируемость — подставь мок. 2) Гибкость — замени MySQL на MongoDB без изменения OrderService. 3) Слабая связанность. В Spring Boot DI работает автоматически через @Autowired.'
    },
    {
      id: 10,
      title: 'Задача: Полный рефакторинг',
      type: 'practice',
      difficulty: 'hard',
      description: 'Получи "грязный" класс PaymentProcessor (200+ строк) с множеством проблем и приведи его к Clean Code. Примени все изученные техники: именование, извлечение методов, DRY, SRP, guard clauses, DI.',
      requirements: [
        'Переименуй переменные: p → payment, a → amount, s → status',
        'Разбей processPayment (50 строк) на 5 методов по 10 строк',
        'Замени switch на полиморфизм для типов платежей',
        'Внедри зависимости через конструктор (валидатор, репозиторий, нотификатор)',
        'Упрости if-else через guard clauses'
      ],
      expectedOutput: '=== ДО: "грязный" PaymentProcessor ===\nfunc proc(p, a, s, t) {\n  if t == 1 { ... 20 lines ... }\n  else if t == 2 { ... 20 lines ... }\n  ... duplicate code ...\n  ... magic numbers ...\n  ... 5 levels nesting ...\n}\n200+ строк, 0 тестов, страшно менять\n\n=== ПОСЛЕ: Clean PaymentProcessor ===\n1. validate(payment) → OK\n2. calculateFee(CARD, 1000) → fee=25 (2.5%)\n3. processTransaction() → success\n4. saveToRepository() → id=TXN-001\n5. notifyUser() → email sent\n\nPayment processed: 1000 via CARD, fee=25, total=1025\n\nДругой тип:\n1. validate(payment) → OK\n2. calculateFee(CRYPTO, 5000) → fee=50 (1.0%)\n3. processTransaction() → success\n4. saveToRepository() → id=TXN-002\n5. notifyUser() → email sent\n\nPayment processed: 5000 via CRYPTO, fee=50, total=5050\n\nЧистый код: 5 маленьких методов, тестируемый, расширяемый',
      hint: 'Рефакторинг по шагам: 1) Переименуй. 2) Извлеки методы. 3) Удали дубликаты. 4) Замени switch полиморфизмом. 5) Внедри DI. Каждый шаг — маленький, безопасный.',
      solution: `public class Main {

    // Константы вместо magic numbers
    static final double CARD_FEE_RATE = 0.025;
    static final double BANK_FEE_RATE = 0.01;
    static final double CRYPTO_FEE_RATE = 0.01;

    static int txnCounter = 0;

    // 1. Валидация (guard clauses)
    static String validate(String type, double amount) {
        if (type == null || type.isEmpty()) return "Payment type required";
        if (amount <= 0) return "Amount must be positive";
        if (amount > 1_000_000) return "Amount exceeds limit";
        return "OK";
    }

    // 2. Расчёт комиссии (полиморфизм вместо switch)
    static double calculateFee(String type, double amount) {
        double rate;
        switch (type) {
            case "CARD": rate = CARD_FEE_RATE; break;
            case "BANK": rate = BANK_FEE_RATE; break;
            case "CRYPTO": rate = CRYPTO_FEE_RATE; break;
            default: rate = 0.05;
        }
        double fee = amount * rate;
        System.out.printf("2. calculateFee(%s, %.0f) → fee=%.0f (%.1f%%)%n",
                          type, amount, fee, rate * 100);
        return fee;
    }

    // 3. Обработка транзакции
    static boolean processTransaction(String type, double amount) {
        System.out.println("3. processTransaction() → success");
        return true;
    }

    // 4. Сохранение
    static String saveToRepository(String type, double amount, double fee) {
        txnCounter++;
        String id = "TXN-" + String.format("%03d", txnCounter);
        System.out.println("4. saveToRepository() → id=" + id);
        return id;
    }

    // 5. Уведомление
    static void notifyUser(String txnId) {
        System.out.println("5. notifyUser() → email sent");
    }

    // Чистый координатор
    static void processPayment(String type, double amount) {
        // Guard clauses
        String validationResult = validate(type, amount);
        System.out.println("1. validate(payment) → " + validationResult);
        if (!"OK".equals(validationResult)) {
            System.out.println("Ошибка: " + validationResult);
            return;
        }

        double fee = calculateFee(type, amount);
        processTransaction(type, amount);
        String txnId = saveToRepository(type, amount, fee);
        notifyUser(txnId);

        System.out.printf("%nPayment processed: %.0f via %s, fee=%.0f, total=%.0f%n",
                          amount, type, fee, amount + fee);
    }

    public static void main(String[] args) {
        // ДО
        System.out.println("=== ДО: \\"грязный\\" PaymentProcessor ===");
        System.out.println("func proc(p, a, s, t) {");
        System.out.println("  if t == 1 { ... 20 lines ... }");
        System.out.println("  else if t == 2 { ... 20 lines ... }");
        System.out.println("  ... duplicate code ...");
        System.out.println("  ... magic numbers ...");
        System.out.println("  ... 5 levels nesting ...");
        System.out.println("}");
        System.out.println("200+ строк, 0 тестов, страшно менять");

        // ПОСЛЕ
        System.out.println("\\n=== ПОСЛЕ: Clean PaymentProcessor ===");
        processPayment("CARD", 1000);

        System.out.println("\\nДругой тип:");
        processPayment("CRYPTO", 5000);

        System.out.println("\\nЧистый код: 5 маленьких методов, тестируемый, расширяемый");
    }
}`,
      explanation: 'Полный рефакторинг применяет все техники Clean Code: 1) Именование — p,a,s → payment, amount, status. 2) Извлечение методов — 1 метод 200 строк → 5 методов по 10. 3) DRY — общий код для типов платежей. 4) Guard clauses — ранний выход при ошибках. 5) Константы — CARD_FEE_RATE вместо 0.025. 6) SRP — каждый метод одна ответственность. 7) DI — зависимости через конструктор. Рефакторинг делается маленькими шагами: переименовал → проверил → извлёк метод → проверил.'
    }
  ]
}
