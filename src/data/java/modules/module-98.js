export default {
  id: 98,
  title: 'Реальная разработка: Банковская система',
  description: 'Задачи Java-разработчика в банке/финтехе: переводы, валюта, кредитный скоринг, транзакции, лимиты, уведомления и антифрод.',
  lessons: [
    {
      id: 1,
      title: 'Money Transfer: Перевод между счетами',
      type: 'practice',
      difficulty: 'easy',
      description: 'Команда Core Banking, спринт "Переводы v2". BANK-301: Реализовать перевод средств между счетами с валидацией баланса. Если средств недостаточно — отклонить операцию.',
      requirements: [
        'Класс Account с полями: id (String), ownerName (String), balance (double)',
        'Метод transfer(Account from, Account to, double amount) возвращает boolean',
        'Валидация: amount > 0, баланс отправителя >= amount',
        'При успешном переводе: списать с отправителя, зачислить получателю',
        'Вывести результат каждого перевода: "OK: from -> to: сумма" или "REJECTED: причина"',
        'Округление до 2 знаков после запятой'
      ],
      expectedOutput: 'OK: ACC-001 -> ACC-002: 50000.00 KZT\nREJECTED: Insufficient funds (need 2000000.00, have 150000.00)\nREJECTED: Invalid amount\nBalance ACC-001: 150000.00 KZT\nBalance ACC-002: 100000.00 KZT',
      hint: 'Простая проверка баланса перед списанием. В реальных системах нужен pessimistic lock на строку БД (SELECT ... FOR UPDATE), но для задачи достаточно последовательной логики.',
      solution: `public class Main {
    static String transfer(double[] balances, String[] ids, int from, int to, double amount) {
        if (amount <= 0) return "REJECTED: Invalid amount";
        if (balances[from] < amount)
            return String.format("REJECTED: Insufficient funds (need %.2f, have %.2f)", amount, balances[from]);
        balances[from] -= amount;
        balances[to] += amount;
        return String.format("OK: %s -> %s: %.2f KZT", ids[from], ids[to], amount);
    }

    public static void main(String[] args) {
        String[] ids = {"ACC-001", "ACC-002"};
        double[] balances = {200000.00, 50000.00};

        System.out.println(transfer(balances, ids, 0, 1, 50000));
        System.out.println(transfer(balances, ids, 0, 1, 2000000));
        System.out.println(transfer(balances, ids, 0, 1, -500));
        System.out.printf("Balance %s: %.2f KZT%n", ids[0], balances[0]);
        System.out.printf("Balance %s: %.2f KZT%n", ids[1], balances[1]);
    }
}`,
      explanation: 'В Kaspi Bank и Halyk Bank переводы между счетами — самая частая операция. В реальности это транзакция в БД с блокировкой строк (SELECT FOR UPDATE), чтобы два параллельных перевода не вызвали race condition. Также используется паттерн Double Entry Bookkeeping — каждая операция создаёт две записи (дебет и кредит). В production-коде баланс хранится как BigDecimal, а не double, чтобы избежать ошибок округления.'
    },
    {
      id: 2,
      title: 'Currency Exchange: Конвертация валют',
      type: 'practice',
      difficulty: 'easy',
      description: 'Команда Payments, спринт "Multi-Currency". BANK-315: Реализовать обмен валют по текущим курсам. Поддержать KZT, USD, EUR, RUB. Курсы задаются относительно KZT.',
      requirements: [
        'Map с курсами: USD=450.50, EUR=490.00, RUB=5.20, KZT=1.0',
        'Метод convert(double amount, String from, String to) возвращает double',
        'Логика: сначала в KZT (amount * rateFrom), потом в целевую (/ rateTo)',
        'Округление до 2 знаков',
        'Вывести результат: "1000.00 USD = 450500.00 KZT"'
      ],
      expectedOutput: '1000.00 USD = 450500.00 KZT\n450500.00 KZT = 918.88 EUR\n100.00 EUR = 9423.08 RUB\n500.00 USD = 500.00 USD',
      hint: 'Все курсы хранятся относительно одной базовой валюты (KZT). Для конвертации A->B: сначала A->KZT (умножить на курс A), потом KZT->B (разделить на курс B).',
      solution: `import java.util.Map;

public class Main {
    static final Map<String, Double> RATES = Map.of(
        "KZT", 1.0,
        "USD", 450.50,
        "EUR", 490.00,
        "RUB", 5.20
    );

    static double convert(double amount, String from, String to) {
        double inKzt = amount * RATES.get(from);
        return Math.round(inKzt / RATES.get(to) * 100.0) / 100.0;
    }

    public static void main(String[] args) {
        System.out.printf("1000.00 USD = %.2f KZT%n", convert(1000, "USD", "KZT"));
        System.out.printf("450500.00 KZT = %.2f EUR%n", convert(450500, "KZT", "EUR"));
        System.out.printf("100.00 EUR = %.2f RUB%n", convert(100, "EUR", "RUB"));
        System.out.printf("500.00 USD = %.2f USD%n", convert(500, "USD", "USD"));
    }
}`,
      explanation: 'В Kaspi и Revolut курсы обновляются в реальном времени через фиды от Reuters/Bloomberg. Курсы хранятся как пары BASE/QUOTE (например USD/KZT = 450.50). Все внутренние расчёты идут через базовую валюту. Revolut зарабатывает на spread (разнице между buy и sell курсом). В production используют BigDecimal и RoundingMode.HALF_UP для банковского округления.'
    },
    {
      id: 3,
      title: 'Transaction History: Фильтрация транзакций',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Analytics, спринт "Statement v3". BANK-342: Реализовать фильтрацию и агрегацию транзакций за период. Подсчитать итоги по категориям.',
      requirements: [
        'Record Transaction(String id, String category, double amount, String date)',
        'Фильтрация по диапазону дат (включительно)',
        'Группировка по категориям с суммой',
        'Общий итог за период',
        'Использовать Stream API: filter, collect, groupingBy, summingDouble',
        'Вывод: категория -> сумма, отсортировано по имени категории'
      ],
      expectedOutput: 'Транзакции за период 2024-03-01 .. 2024-03-31:\nГрупповка по категориям:\n  GROCERY: 45800.00 KZT\n  RESTAURANT: 15500.00 KZT\n  TRANSFER: 150000.00 KZT\n  UTILITY: 28500.00 KZT\nИтого: 239800.00 KZT\nВсего операций: 6',
      hint: 'Stream API с Collectors.groupingBy(category, Collectors.summingDouble(amount)). Для фильтрации по датам — сравнение строк в формате yyyy-MM-dd работает лексикографически.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Transaction(String id, String category, double amount, String date) {}

    public static void main(String[] args) {
        var transactions = List.of(
            new Transaction("TX-001", "GROCERY", 12500.00, "2024-03-02"),
            new Transaction("TX-002", "TRANSFER", 150000.00, "2024-03-05"),
            new Transaction("TX-003", "RESTAURANT", 8500.00, "2024-03-07"),
            new Transaction("TX-004", "UTILITY", 15000.00, "2024-03-10"),
            new Transaction("TX-005", "GROCERY", 33300.00, "2024-03-15"),
            new Transaction("TX-006", "RESTAURANT", 7000.00, "2024-03-20"),
            new Transaction("TX-007", "UTILITY", 13500.00, "2024-03-25"),
            new Transaction("TX-008", "GROCERY", 9200.00, "2024-02-28"),
            new Transaction("TX-009", "TRANSFER", 50000.00, "2024-04-01")
        );

        String from = "2024-03-01", to = "2024-03-31";

        var filtered = transactions.stream()
            .filter(t -> t.date().compareTo(from) >= 0 && t.date().compareTo(to) <= 0)
            .toList();

        var byCategory = filtered.stream()
            .collect(Collectors.groupingBy(
                Transaction::category,
                TreeMap::new,
                Collectors.summingDouble(Transaction::amount)
            ));

        double total = filtered.stream().mapToDouble(Transaction::amount).sum();

        System.out.printf("Транзакции за период %s .. %s:%n", from, to);
        System.out.println("Группировка по категориям:");
        byCategory.forEach((cat, sum) ->
            System.out.printf("  %s: %.2f KZT%n", cat, sum));
        System.out.printf("Итого: %.2f KZT%n", total);
        System.out.printf("Всего операций: %d%n", filtered.size());
    }
}`,
      explanation: 'В Kaspi Bank история транзакций — одна из самых нагруженных таблиц (миллиарды строк). Для производительности используют партиционирование по дате, read-replica для аналитики, и CQRS для разделения записи и чтения. Tinkoff использует ClickHouse для аналитических запросов по транзакциям. В мобильных приложениях банков категоризация транзакций (MCC-коды) помогает пользователям видеть расходы по категориям.'
    },
    {
      id: 4,
      title: 'Credit Scoring: Кредитный рейтинг',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Risk, спринт "Scoring Engine v2". BANK-378: Реализовать расчёт кредитного скоринга по параметрам клиента. Балл от 300 до 850. На основе балла — решение по кредиту.',
      requirements: [
        'Record ClientData(int age, double monthlyIncome, double existingDebt, int employmentYears, boolean hasDefaultHistory)',
        'Метод calculateScore(ClientData client) возвращает int (300-850)',
        'Факторы: доход (+), долговая нагрузка (-), стаж (+), возраст (+/-), дефолты (-)',
        'Debt-to-income ratio > 50% — штраф',
        'Решение: >= 750 "APPROVED", 650-749 "MANUAL_REVIEW", < 650 "REJECTED"',
        'Вывод: параметры клиента, скоринг-балл и решение'
      ],
      expectedOutput: 'Клиент: возраст=35, доход=500000, долг=100000, стаж=8, дефолты=false\n  DTI: 20.0%\n  Скоринг: 780\n  Решение: APPROVED\n\nКлиент: возраст=22, доход=180000, долг=150000, стаж=1, дефолты=false\n  DTI: 83.3%\n  Скоринг: 480\n  Решение: REJECTED\n\nКлиент: возраст=45, доход=350000, долг=80000, стаж=15, дефолты=true\n  DTI: 22.9%\n  Скоринг: 650\n  Решение: MANUAL_REVIEW',
      hint: 'Начни с базового балла (600), затем добавляй/вычитай баллы за каждый фактор. DTI = (existingDebt / monthlyIncome) * 100. Используй switch expression для решения.',
      solution: `public class Main {
    record ClientData(int age, double monthlyIncome, double existingDebt,
                      int employmentYears, boolean hasDefaultHistory) {}

    static int calculateScore(ClientData c) {
        int score = 600;

        // Income factor
        if (c.monthlyIncome() >= 500000) score += 80;
        else if (c.monthlyIncome() >= 300000) score += 50;
        else if (c.monthlyIncome() >= 150000) score += 20;
        else score -= 30;

        // DTI factor
        double dti = (c.existingDebt() / c.monthlyIncome()) * 100;
        if (dti < 20) score += 60;
        else if (dti < 40) score += 20;
        else if (dti < 60) score -= 40;
        else score -= 100;

        // Employment years
        if (c.employmentYears() >= 10) score += 50;
        else if (c.employmentYears() >= 5) score += 30;
        else if (c.employmentYears() >= 2) score += 10;
        else score -= 20;

        // Age factor
        if (c.age() >= 30 && c.age() <= 55) score += 30;
        else if (c.age() >= 25) score += 10;
        else score -= 20;

        // Default history
        if (c.hasDefaultHistory()) score -= 150;

        return Math.max(300, Math.min(850, score));
    }

    static String decide(int score) {
        return switch (score) {
            case int s when s >= 750 -> "APPROVED";
            case int s when s >= 650 -> "MANUAL_REVIEW";
            default -> "REJECTED";
        };
    }

    public static void main(String[] args) {
        var clients = new ClientData[] {
            new ClientData(35, 500000, 100000, 8, false),
            new ClientData(22, 180000, 150000, 1, false),
            new ClientData(45, 350000, 80000, 15, true)
        };

        for (var c : clients) {
            double dti = Math.round(c.existingDebt() / c.monthlyIncome() * 1000.0) / 10.0;
            int score = calculateScore(c);
            System.out.printf("Клиент: возраст=%d, доход=%.0f, долг=%.0f, стаж=%d, дефолты=%s%n",
                c.age(), c.monthlyIncome(), c.existingDebt(), c.employmentYears(), c.hasDefaultHistory());
            System.out.printf("  DTI: %.1f%%%n", dti);
            System.out.printf("  Скоринг: %d%n", score);
            System.out.printf("  Решение: %s%n%n", decide(score));
        }
    }
}`,
      explanation: 'В Halyk Bank и Kaspi скоринг-модели — ядро кредитного бизнеса. Реальные модели используют ML (logistic regression, gradient boosting) и десятки параметров: кредитная история из ПКБ (Первое кредитное бюро), данные мобильного оператора, платежи за коммуналку. Решение MANUAL_REVIEW означает передачу андеррайтеру для ручной проверки. DTI (Debt-to-Income) — ключевой показатель: в Казахстане НБ РК рекомендует DTI не более 50%.'
    },
    {
      id: 5,
      title: 'Transfer Limits: Дневные и месячные лимиты',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Compliance, спринт "AML Limits". BANK-401: Реализовать проверку дневных и месячных лимитов переводов. При превышении — блокировать операцию.',
      requirements: [
        'Дневной лимит: 1 000 000 KZT, месячный: 5 000 000 KZT',
        'Record Transfer(double amount, String date) — история переводов',
        'Метод checkLimit(List<Transfer> history, Transfer newTransfer) возвращает результат проверки',
        'Подсчитать сумму за текущий день и текущий месяц',
        'Вернуть: ALLOWED, DAILY_LIMIT_EXCEEDED или MONTHLY_LIMIT_EXCEEDED',
        'Вывод: сумма перевода, дневной итог, месячный итог, решение'
      ],
      expectedOutput: 'Перевод: 300000.00 KZT (2024-03-15)\n  Дневной итог: 300000.00 / 1000000.00\n  Месячный итог: 3100000.00 / 5000000.00\n  Статус: ALLOWED\n\nПеревод: 800000.00 KZT (2024-03-15)\n  Дневной итог: 1100000.00 / 1000000.00\n  Месячный итог: 3900000.00 / 5000000.00\n  Статус: DAILY_LIMIT_EXCEEDED\n\nПеревод: 500000.00 KZT (2024-03-20)\n  Дневной итог: 500000.00 / 1000000.00\n  Месячный итог: 3400000.00 / 5000000.00\n  Статус: ALLOWED\n\nПеревод: 2000000.00 KZT (2024-03-25)\n  Дневной итог: 2000000.00 / 1000000.00\n  Месячный итог: 5400000.00 / 5000000.00\n  Статус: DAILY_LIMIT_EXCEEDED',
      hint: 'Фильтруй историю по дате (для дневного) и по месяцу (для месячного). Суммируй через stream().mapToDouble().sum(). Проверяй лимиты включая новый перевод.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Transfer(double amount, String date) {}

    static final double DAILY_LIMIT = 1_000_000;
    static final double MONTHLY_LIMIT = 5_000_000;

    static String checkLimit(List<Transfer> history, Transfer newTx) {
        String day = newTx.date();
        String month = day.substring(0, 7);

        double dailyTotal = history.stream()
            .filter(t -> t.date().equals(day))
            .mapToDouble(Transfer::amount).sum() + newTx.amount();

        double monthlyTotal = history.stream()
            .filter(t -> t.date().startsWith(month))
            .mapToDouble(Transfer::amount).sum() + newTx.amount();

        System.out.printf("Перевод: %.2f KZT (%s)%n", newTx.amount(), newTx.date());
        System.out.printf("  Дневной итог: %.2f / %.2f%n", dailyTotal, DAILY_LIMIT);
        System.out.printf("  Месячный итог: %.2f / %.2f%n", monthlyTotal, MONTHLY_LIMIT);

        String status;
        if (dailyTotal > DAILY_LIMIT) status = "DAILY_LIMIT_EXCEEDED";
        else if (monthlyTotal > MONTHLY_LIMIT) status = "MONTHLY_LIMIT_EXCEEDED";
        else status = "ALLOWED";

        System.out.printf("  Статус: %s%n%n", status);
        return status;
    }

    public static void main(String[] args) {
        var history = new ArrayList<>(List.of(
            new Transfer(500000, "2024-03-01"),
            new Transfer(400000, "2024-03-05"),
            new Transfer(350000, "2024-03-08"),
            new Transfer(250000, "2024-03-10"),
            new Transfer(300000, "2024-03-12")
        ));

        var tx1 = new Transfer(300000, "2024-03-15");
        checkLimit(history, tx1);
        history.add(tx1);

        var tx2 = new Transfer(800000, "2024-03-15");
        checkLimit(history, tx2);

        var tx3 = new Transfer(500000, "2024-03-20");
        checkLimit(history, tx3);

        var tx4 = new Transfer(2000000, "2024-03-25");
        checkLimit(history, tx4);
    }
}`,
      explanation: 'Лимиты переводов — обязательное требование регулятора (НБ РК, ЦБ РФ). В Kaspi Bank лимиты зависят от уровня идентификации клиента (упрощённая, стандартная, полная). В Revolut лимиты различаются по тарифным планам. Реальная реализация использует Redis для хранения счётчиков (INCRBY + TTL) — это позволяет проверять лимиты за O(1) без запросов в основную БД. Превышение лимитов также триггерит AML-проверку (Anti Money Laundering).'
    },
    {
      id: 6,
      title: 'Card Masking & Validation: Алгоритм Луна',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Cards, спринт "Card Security". BANK-425: Реализовать маскирование номера карты для отображения в UI и валидацию через алгоритм Луна (Luhn).',
      requirements: [
        'Метод maskCard(String number) — маскирование: "4400 **** **** 1234"',
        'Метод isValidLuhn(String number) — проверка контрольной суммы по алгоритму Луна',
        'Алгоритм Луна: справа налево, каждая вторая цифра удваивается, если > 9 — вычесть 9',
        'Сумма всех цифр должна быть кратна 10',
        'Поддержка номеров с пробелами (удалять перед проверкой)',
        'Вывод: маскированный номер и результат валидации'
      ],
      expectedOutput: 'Карта: 4400 4302 1187 5234\n  Маска: 4400 **** **** 5234\n  Luhn:  true\n\nКарта: 5578 7210 3650 8790\n  Маска: 5578 **** **** 8790\n  Luhn:  false\n\nКарта: 4111 1111 1111 1111\n  Маска: 4111 **** **** 1111\n  Luhn:  true',
      hint: 'Luhn: пройди справа налево, удваивай каждую вторую цифру (начиная со второй с конца). Если результат > 9 — вычти 9. Сумма всех цифр % 10 == 0 — валидно.',
      solution: `public class Main {
    static String maskCard(String number) {
        String clean = number.replace(" ", "");
        return clean.substring(0, 4) + " **** **** " + clean.substring(clean.length() - 4);
    }

    static boolean isValidLuhn(String number) {
        String clean = number.replace(" ", "");
        int sum = 0;
        boolean doubleNext = false;
        for (int i = clean.length() - 1; i >= 0; i--) {
            int digit = clean.charAt(i) - '0';
            if (doubleNext) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            doubleNext = !doubleNext;
        }
        return sum % 10 == 0;
    }

    public static void main(String[] args) {
        var cards = new String[] {
            "4400 4302 1187 5234",
            "5578 7210 3650 8790",
            "4111 1111 1111 1111"
        };

        for (var card : cards) {
            System.out.printf("Карта: %s%n", card);
            System.out.printf("  Маска: %s%n", maskCard(card));
            System.out.printf("  Luhn:  %s%n%n", isValidLuhn(card));
        }
    }
}`,
      explanation: 'Алгоритм Луна используется во всех платёжных системах (Visa, Mastercard, UnionPay) для проверки корректности номера карты. Маскирование — требование PCI DSS (Payment Card Industry Data Security Standard): в логах, UI, чеках нельзя показывать полный номер карты. В Kaspi Gold карты начинаются с 4400 (Visa). В Halyk — 4405. Тестовый номер 4111 1111 1111 1111 — стандартный тестовый номер Visa, который проходит проверку Луна.'
    },
    {
      id: 7,
      title: 'Installment Calculator: Аннуитетные платежи',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Lending, спринт "Installments v4". BANK-456: Реализовать калькулятор рассрочки/кредита с аннуитетными платежами. Вывести график платежей.',
      requirements: [
        'Аннуитетный платёж: A = P * [r(1+r)^n] / [(1+r)^n - 1]',
        'P — сумма кредита, r — месячная ставка, n — кол-во месяцев',
        'Вывести: ежемесячный платёж, общую сумму, переплату',
        'График первых 3 и последнего платежа: основной долг, проценты, остаток',
        'Два примера: рассрочка 0% и кредит 24% годовых',
        'Округление до целых тенге'
      ],
      expectedOutput: '=== Рассрочка 0%: 300000 KZT на 6 мес ===\nЕжемесячный платёж: 50000 KZT\nОбщая сумма: 300000 KZT\nПереплата: 0 KZT\n\n=== Кредит 24%: 1000000 KZT на 12 мес ===\nЕжемесячный платёж: 94560 KZT\nОбщая сумма: 1134720 KZT\nПереплата: 134720 KZT\nГрафик платежей:\n  #1:  основной=74560, проценты=20000, остаток=925440\n  #2:  основной=76051, проценты=18509, остаток=849389\n  #3:  основной=77572, проценты=16988, остаток=771817\n  ...\n  #12: основной=92697, проценты=1863, остаток=0',
      hint: 'Месячная ставка r = годовая / 12 / 100. Для 0% — просто P/n. Для графика: проценты = остаток * r, основной долг = платёж - проценты, новый остаток = старый - основной долг.',
      solution: `public class Main {
    static long annuityPayment(long principal, double annualRate, int months) {
        if (annualRate == 0) return principal / months;
        double r = annualRate / 12 / 100;
        double payment = principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
        return Math.round(payment);
    }

    static void printSchedule(long principal, double annualRate, int months) {
        double r = annualRate / 12 / 100;
        long payment = annuityPayment(principal, annualRate, months);
        long totalPaid = payment * months;

        String label = annualRate == 0
            ? String.format("Рассрочка 0%%: %d KZT на %d мес", principal, months)
            : String.format("Кредит %.0f%%: %d KZT на %d мес", annualRate, principal, months);

        System.out.printf("=== %s ===%n", label);
        System.out.printf("Ежемесячный платёж: %d KZT%n", payment);
        System.out.printf("Общая сумма: %d KZT%n", totalPaid);
        System.out.printf("Переплата: %d KZT%n", totalPaid - principal);

        if (annualRate > 0) {
            System.out.println("График платежей:");
            double balance = principal;
            for (int i = 1; i <= months; i++) {
                long interest = Math.round(balance * r);
                long principalPart;
                if (i == months) {
                    principalPart = Math.round(balance);
                    balance = 0;
                } else {
                    principalPart = payment - interest;
                    balance -= principalPart;
                }
                if (i <= 3 || i == months) {
                    if (i == 4) System.out.println("  ...");
                    System.out.printf("  #%d:  основной=%d, проценты=%d, остаток=%d%n",
                        i, principalPart, interest, Math.round(balance));
                }
            }
        }
    }

    public static void main(String[] args) {
        printSchedule(300000, 0, 6);
        System.out.println();
        printSchedule(1000000, 24, 12);
    }
}`,
      explanation: 'В Kaspi Bank рассрочка 0% — маркетинговый продукт, где комиссию платит мерчант (3-10%). Аннуитетные платежи — стандарт в Казахстане и России. В Halyk Bank и Тинькофф используют дифференцированную схему как альтернативу. Формула аннуитетного платежа A = P*r(1+r)^n/((1+r)^n-1) — ключевая для всех калькуляторов. Реальные системы учитывают ГЭСВ (годовую эффективную ставку вознаграждения), страховку, комиссии.'
    },
    {
      id: 8,
      title: 'Notification Service: Push/SMS уведомления',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Notifications, спринт "Event-Driven Alerts". BANK-489: Реализовать генерацию push/SMS уведомлений по банковским событиям. Разные шаблоны для разных событий.',
      requirements: [
        'Enum EventType: TRANSFER_IN, TRANSFER_OUT, LOW_BALANCE, LOGIN, CARD_BLOCKED',
        'Record BankEvent(EventType type, String accountId, double amount, String details)',
        'Метод generateNotification(BankEvent event) возвращает String с текстом уведомления',
        'Использовать switch expression по типу события',
        'Формат суммы: с разделителем тысяч и "тг"',
        'Уведомления должны быть информативными и краткими (как в реальных банках)'
      ],
      expectedOutput: '[SMS] ACC-001: Поступление +150 000,00 тг от Асхат М. Баланс: 650 000,00 тг\n[PUSH] ACC-001: Перевод -50 000,00 тг получатель Мария К. Баланс: 600 000,00 тг\n[PUSH] ACC-001: Внимание! Баланс ниже 10 000 тг. Текущий баланс: 8 500,00 тг\n[PUSH] ACC-001: Вход в аккаунт с устройства iPhone 15, Алматы\n[SMS] ACC-002: Карта *5234 заблокирована. Причина: 3 неверных PIN. Обратитесь: 7700',
      hint: 'Switch expression с pattern matching по EventType. Для форматирования суммы используй DecimalFormat или String.format с разделителем тысяч.',
      solution: `import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.List;
import java.util.Locale;

public class Main {
    enum EventType { TRANSFER_IN, TRANSFER_OUT, LOW_BALANCE, LOGIN, CARD_BLOCKED }

    record BankEvent(EventType type, String accountId, double amount, String details) {}

    static final DecimalFormat FMT;
    static {
        var symbols = new DecimalFormatSymbols(Locale.FRANCE);
        symbols.setGroupingSeparator(' ');
        symbols.setDecimalSeparator(',');
        FMT = new DecimalFormat("#,##0.00", symbols);
    }

    static String money(double amount) { return FMT.format(amount) + " тг"; }

    static String generateNotification(BankEvent e) {
        return switch (e.type()) {
            case TRANSFER_IN -> String.format("[SMS] %s: Поступление +%s от %s. Баланс: %s",
                e.accountId(), money(e.amount()), e.details().split("\\|")[0], money(Double.parseDouble(e.details().split("\\|")[1])));
            case TRANSFER_OUT -> String.format("[PUSH] %s: Перевод -%s получатель %s. Баланс: %s",
                e.accountId(), money(e.amount()), e.details().split("\\|")[0], money(Double.parseDouble(e.details().split("\\|")[1])));
            case LOW_BALANCE -> String.format("[PUSH] %s: Внимание! Баланс ниже 10 000 тг. Текущий баланс: %s",
                e.accountId(), money(e.amount()));
            case LOGIN -> String.format("[PUSH] %s: Вход в аккаунт с устройства %s",
                e.accountId(), e.details());
            case CARD_BLOCKED -> String.format("[SMS] %s: Карта %s заблокирована. Причина: %s. Обратитесь: 7700",
                e.accountId(), e.details().split("\\|")[0], e.details().split("\\|")[1]);
        };
    }

    public static void main(String[] args) {
        var events = List.of(
            new BankEvent(EventType.TRANSFER_IN, "ACC-001", 150000, "Асхат М.|650000"),
            new BankEvent(EventType.TRANSFER_OUT, "ACC-001", 50000, "Мария К.|600000"),
            new BankEvent(EventType.LOW_BALANCE, "ACC-001", 8500, ""),
            new BankEvent(EventType.LOGIN, "ACC-001", 0, "iPhone 15, Алматы"),
            new BankEvent(EventType.CARD_BLOCKED, "ACC-002", 0, "*5234|3 неверных PIN")
        );

        events.stream()
            .map(Main::generateNotification)
            .forEach(System.out::println);
    }
}`,
      explanation: 'В Kaspi Bank push-уведомления отправляются мгновенно через Firebase Cloud Messaging (Android) и APNs (iOS). SMS — резервный канал для критичных событий (блокировка карты, крупные переводы). В Revolut уведомления обрабатываются через Apache Kafka: событие записывается в топик, сервис уведомлений читает и маршрутизирует по каналам. Шаблоны хранятся в CMS для быстрого обновления без деплоя. В Тинькофф используют A/B тестирование текстов уведомлений для повышения конверсии.'
    },
    {
      id: 9,
      title: 'Fraud Detection: Антифрод система',
      type: 'practice',
      difficulty: 'hard',
      description: 'Команда Security, спринт "AntiFraud v5". BANK-512: Реализовать систему обнаружения подозрительных транзакций на основе правил. Каждое правило даёт штрафные баллы. Сумма баллов определяет уровень риска.',
      requirements: [
        'Record Transaction(String id, double amount, String country, String time, String merchantCategory, boolean isOnline)',
        'Правила: крупная сумма (>500000 = +30), ночное время 00-06 (+20), иностранная транзакция (+25), онлайн-казино (+40), частые операции (+15)',
        'Риск: 0-29 LOW, 30-59 MEDIUM, 60-79 HIGH, 80+ BLOCKED',
        'Метод analyzeTransaction возвращает FraudResult(int score, String level, List<String> triggers)',
        'Вывести для каждой транзакции: id, сумму, score, level и сработавшие правила',
        'Использовать List для накопления сработавших правил'
      ],
      expectedOutput: 'TX-001: 25000.00 KZT | Score: 0 | Level: LOW\n  Правила: нет\n\nTX-002: 750000.00 KZT | Score: 50 | Level: MEDIUM\n  Правила: LARGE_AMOUNT(+30), NIGHT_TIME(+20)\n\nTX-003: 150000.00 KZT | Score: 65 | Level: HIGH\n  Правила: FOREIGN_COUNTRY(+25), GAMBLING_MCC(+40)\n\nTX-004: 1200000.00 KZT | Score: 90 | Level: BLOCKED\n  Правила: LARGE_AMOUNT(+30), NIGHT_TIME(+20), GAMBLING_MCC(+40)',
      hint: 'Создай список правил как функции (Predicate + score). Для каждой транзакции пройди по всем правилам, накопи баллы и сработавшие правила. Время парси как int (час).',
      solution: `import java.util.*;

public class Main {
    record Transaction(String id, double amount, String country, String time,
                       String merchantCategory, boolean isOnline) {}

    record FraudResult(int score, String level, List<String> triggers) {}

    static FraudResult analyzeTransaction(Transaction tx) {
        var triggers = new ArrayList<String>();
        int score = 0;

        // Rule 1: Large amount
        if (tx.amount() > 500000) {
            score += 30;
            triggers.add("LARGE_AMOUNT(+30)");
        }

        // Rule 2: Night time (00:00 - 05:59)
        int hour = Integer.parseInt(tx.time().split(":")[0]);
        if (hour >= 0 && hour < 6) {
            score += 20;
            triggers.add("NIGHT_TIME(+20)");
        }

        // Rule 3: Foreign country
        if (!tx.country().equals("KZ")) {
            score += 25;
            triggers.add("FOREIGN_COUNTRY(+25)");
        }

        // Rule 4: Gambling merchant category
        if (tx.merchantCategory().equals("GAMBLING")) {
            score += 40;
            triggers.add("GAMBLING_MCC(+40)");
        }

        // Rule 5: High-risk online transaction
        if (tx.isOnline() && tx.amount() > 200000) {
            score += 15;
            triggers.add("ONLINE_HIGH_AMOUNT(+15)");
        }

        String level = switch (score) {
            case int s when s >= 80 -> "BLOCKED";
            case int s when s >= 60 -> "HIGH";
            case int s when s >= 30 -> "MEDIUM";
            default -> "LOW";
        };

        return new FraudResult(score, level, triggers);
    }

    public static void main(String[] args) {
        var transactions = List.of(
            new Transaction("TX-001", 25000, "KZ", "14:30", "GROCERY", false),
            new Transaction("TX-002", 750000, "KZ", "03:15", "TRANSFER", true),
            new Transaction("TX-003", 150000, "CY", "16:00", "GAMBLING", true),
            new Transaction("TX-004", 1200000, "KZ", "02:45", "GAMBLING", true)
        );

        for (var tx : transactions) {
            var result = analyzeTransaction(tx);
            System.out.printf("TX-%s: %.2f KZT | Score: %d | Level: %s%n",
                tx.id().replace("TX-", ""), tx.amount(), result.score(), result.level());
            if (result.triggers().isEmpty()) {
                System.out.println("  Правила: нет");
            } else {
                System.out.printf("  Правила: %s%n", String.join(", ", result.triggers()));
            }
            System.out.println();
        }
    }
}`,
      explanation: 'Антифрод — критическая система в любом банке. В Kaspi Bank система обрабатывает миллионы транзакций в день в реальном времени. Rule-based подход (как в этой задаче) — первый уровень. Второй — ML-модели (Random Forest, Neural Networks), обученные на исторических данных о фроде. В Revolut используют комбинацию: быстрые правила на уровне API Gateway (отклоняют очевидный фрод за <50мс), а ML-модель работает асинхронно для сложных случаев. MCC (Merchant Category Code) — международная классификация, код 7995 = gambling. Ночные транзакции и foreign transactions — классические триггеры в антифроде.'
    },
    {
      id: 10,
      title: 'Account Statement: Банковская выписка',
      type: 'practice',
      difficulty: 'hard',
      description: 'Команда Core Banking, спринт "Statements v6". BANK-550: Реализовать формирование банковской выписки с группировкой по дням, расчётом running balance и итогами.',
      requirements: [
        'Record Transaction(String id, String type, String description, double amount, String date)',
        'type: "CREDIT" (поступление) или "DEBIT" (списание)',
        'Группировка по датам, внутри каждой даты — список операций',
        'Running balance: начальный баланс + поступления - списания',
        'Итоги: общие поступления, списания, количество операций',
        'Формат как в реальной банковской выписке',
        'Использовать TreeMap для сортировки по дате, Stream API для итогов'
      ],
      expectedOutput: '╔══════════════════════════════════════════════════════╗\n║       ВЫПИСКА ПО СЧЕТУ KZ12345 (KZT)                ║\n║       Период: 2024-03-01 — 2024-03-05               ║\n╠══════════════════════════════════════════════════════╣\n║ Начальный баланс:                     500 000.00 KZT║\n╠══════════════════════════════════════════════════════╣\n║ 2024-03-01                                          ║\n║   + TX-001 Зарплата ТОО "TechCo"     350 000.00    ║\n║   - TX-002 Аренда квартиры            120 000.00    ║\n║                          Итого дня:   230 000.00    ║\n║                          Баланс:      730 000.00    ║\n╠══════════════════════════════════════════════════════╣\n║ 2024-03-03                                          ║\n║   - TX-003 Kaspi Магазин               45 000.00    ║\n║   - TX-004 Коммунальные платежи        18 500.00    ║\n║                          Итого дня:   -63 500.00    ║\n║                          Баланс:      666 500.00    ║\n╠══════════════════════════════════════════════════════╣\n║ 2024-03-05                                          ║\n║   + TX-005 Перевод от Асхат М.         75 000.00    ║\n║   - TX-006 Ресторан "Del Papa"         12 800.00    ║\n║   - TX-007 Glovo доставка               3 200.00    ║\n║                          Итого дня:    59 000.00    ║\n║                          Баланс:      725 500.00    ║\n╠══════════════════════════════════════════════════════╣\n║ ИТОГО                                               ║\n║   Поступления (3):                    425 000.00 KZT║\n║   Списания (4):                       199 500.00 KZT║\n║   Конечный баланс:                    725 500.00 KZT║\n╚══════════════════════════════════════════════════════╝',
      hint: 'TreeMap<String, List<Transaction>> для группировки по дате. Running balance — аккумулятор по дням. Для красивого форматирования используй String.format с фиксированной шириной.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Transaction(String id, String type, String description, double amount, String date) {}

    public static void main(String[] args) {
        double openBalance = 500000.00;
        var transactions = List.of(
            new Transaction("TX-001", "CREDIT", "Зарплата ТОО \\"TechCo\\"", 350000, "2024-03-01"),
            new Transaction("TX-002", "DEBIT", "Аренда квартиры", 120000, "2024-03-01"),
            new Transaction("TX-003", "DEBIT", "Kaspi Магазин", 45000, "2024-03-03"),
            new Transaction("TX-004", "DEBIT", "Коммунальные платежи", 18500, "2024-03-03"),
            new Transaction("TX-005", "CREDIT", "Перевод от Асхат М.", 75000, "2024-03-05"),
            new Transaction("TX-006", "DEBIT", "Ресторан \\"Del Papa\\"", 12800, "2024-03-05"),
            new Transaction("TX-007", "DEBIT", "Glovo доставка", 3200, "2024-03-05")
        );

        var byDate = transactions.stream()
            .collect(Collectors.groupingBy(Transaction::date, TreeMap::new, Collectors.toList()));

        String line = "══════════════════════════════════════════════════════";
        System.out.println("╔" + line + "╗");
        System.out.printf("║       ВЫПИСКА ПО СЧЕТУ KZ12345 (KZT)                ║%n");
        System.out.printf("║       Период: 2024-03-01 — 2024-03-05               ║%n");
        System.out.println("╠" + line + "╣");
        System.out.printf("║ Начальный баланс:                     %,10.2f KZT║%n", openBalance);
        System.out.println("╠" + line + "╣");

        double balance = openBalance;
        double totalCredits = 0, totalDebits = 0;
        int creditCount = 0, debitCount = 0;

        for (var entry : byDate.entrySet()) {
            System.out.printf("║ %-52s║%n", entry.getKey());
            double dayTotal = 0;

            for (var tx : entry.getValue()) {
                String sign = tx.type().equals("CREDIT") ? "+" : "-";
                double signed = tx.type().equals("CREDIT") ? tx.amount() : -tx.amount();
                dayTotal += signed;

                if (tx.type().equals("CREDIT")) { totalCredits += tx.amount(); creditCount++; }
                else { totalDebits += tx.amount(); debitCount++; }

                System.out.printf("║   %s %-6s %-24s%,10.2f    ║%n",
                    sign, tx.id(), tx.description(), tx.amount());
            }

            balance += dayTotal;
            System.out.printf("║ %40s%,10.2f    ║%n", "Итого дня:", dayTotal);
            System.out.printf("║ %40s%,10.2f    ║%n", "Баланс:", balance);
            System.out.println("╠" + line + "╣");
        }

        System.out.printf("║ %-54s║%n", "ИТОГО");
        System.out.printf("║   Поступления (%d):                    %,10.2f KZT║%n", creditCount, totalCredits);
        System.out.printf("║   Списания (%d):                       %,10.2f KZT║%n", debitCount, totalDebits);
        System.out.printf("║   Конечный баланс:                    %,10.2f KZT║%n", balance);
        System.out.println("╚" + line + "╝");
    }
}`,
      explanation: 'Банковская выписка — регуляторное требование НБ РК. Каждый банк обязан предоставлять выписку клиенту. В Kaspi это доступно в мобильном приложении и PDF. В Halyk Bank выписки формируются из CQRS read-модели (отдельная БД, оптимизированная для чтения). Running balance — критически важен для бухгалтерии. В enterprise-системах выписки генерируются через Jasper Reports или Apache POI (для Excel). Формат MT940 (SWIFT) используется для межбанковских выписок. В Тинькофф выписки кешируются в S3 и генерируются по расписанию, а не по запросу.'
    }
  ]
}
