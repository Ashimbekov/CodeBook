export default {
  id: 107,
  title: 'Банкинг: Кредитование и риски',
  description: 'Задачи кредитного отдела: скоринг, расчёт кредита, графики платежей, просрочка, коллекшн, резервирование и отчётность.',
  lessons: [
    {
      id: 1,
      title: 'Credit Application: Заявка на кредит',
      type: 'practice',
      difficulty: 'easy',
      description: 'Спринт команды Lending в Kaspi Bank. Jira-задача CRED-101: "Реализовать приём и валидацию кредитной заявки. Заёмщик указывает доход, расходы, стаж, возраст. Система должна проверить базовые требования и рассчитать долговую нагрузку (DTI). Если клиент не проходит — отказ на этапе заявки без обращения к скоринговой модели."',
      requirements: [
        'Record Borrower(String name, int age, double income, double expenses, double existingDebt, int employmentMonths)',
        'Record ApplicationResult(boolean accepted, String reason, double dti)',
        'Метод validateApplication(Borrower b) возвращает ApplicationResult',
        'Валидация: возраст 21-65, доход > 100_000 KZT, стаж >= 6 месяцев',
        'Рассчитать DTI (debt-to-income) = (расходы + существующий долг) / доход * 100',
        'DTI > 50% — отказ с причиной "Высокая долговая нагрузка"',
        'Протестировать 3 заявки: одобренную, отказ по возрасту, отказ по DTI'
      ],
      expectedOutput: '=== Кредитные заявки ===\nЗаявка: Айдар Касымов, 32 года, доход: 450000.0 KZT\n  DTI: 33.3%\n  Результат: ПРИНЯТА\n\nЗаявка: Мария Петрова, 19 лет, доход: 200000.0 KZT\n  Результат: ОТКАЗ — Возраст должен быть от 21 до 65 лет\n\nЗаявка: Болат Сериков, 45 лет, доход: 150000.0 KZT\n  DTI: 60.0%\n  Результат: ОТКАЗ — Высокая долговая нагрузка (DTI > 50%)',
      hint: 'DTI = (expenses + existingDebt) / income * 100. Проверяйте условия последовательно: сначала возраст, потом доход, потом стаж, и только потом DTI.',
      solution: `public class Main {
    record Borrower(String name, int age, double income, double expenses,
                    double existingDebt, int employmentMonths) {}

    record ApplicationResult(boolean accepted, String reason, double dti) {}

    static ApplicationResult validateApplication(Borrower b) {
        if (b.age() < 21 || b.age() > 65) {
            return new ApplicationResult(false, "Возраст должен быть от 21 до 65 лет", 0);
        }
        if (b.income() <= 100_000) {
            return new ApplicationResult(false, "Доход должен быть более 100 000 KZT", 0);
        }
        if (b.employmentMonths() < 6) {
            return new ApplicationResult(false, "Стаж работы менее 6 месяцев", 0);
        }
        double dti = (b.expenses() + b.existingDebt()) / b.income() * 100;
        if (dti > 50) {
            return new ApplicationResult(false,
                String.format("Высокая долговая нагрузка (DTI > 50%%)"), dti);
        }
        return new ApplicationResult(true, "Заявка одобрена", dti);
    }

    static void printResult(Borrower b, ApplicationResult r) {
        System.out.printf("Заявка: %s, %d лет, доход: %.1f KZT%n",
            b.name(), b.age(), b.income());
        if (r.dti() > 0) {
            System.out.printf("  DTI: %.1f%%%n", r.dti());
        }
        if (r.accepted()) {
            System.out.println("  Результат: ПРИНЯТА");
        } else {
            System.out.println("  Результат: ОТКАЗ — " + r.reason());
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Кредитные заявки ===");

        var b1 = new Borrower("Айдар Касымов", 32, 450_000, 100_000, 50_000, 24);
        var r1 = validateApplication(b1);
        printResult(b1, r1);

        System.out.println();

        var b2 = new Borrower("Мария Петрова", 19, 200_000, 50_000, 0, 12);
        var r2 = validateApplication(b2);
        printResult(b2, r2);

        System.out.println();

        var b3 = new Borrower("Болат Сериков", 45, 150_000, 60_000, 30_000, 36);
        var r3 = validateApplication(b3);
        printResult(b3, r3);
    }
}`,
      explanation: 'Record-классы Java 17 идеальны для DTO кредитной заявки — immutable, компактные, с автоматическими equals/hashCode/toString. DTI (Debt-to-Income) — ключевая метрика банков для оценки платёжеспособности. В реальном Kaspi Bank DTI-лимит обычно 50%, в Halyk — до 60% для зарплатных клиентов.'
    },
    {
      id: 2,
      title: 'Scoring Engine: Кредитный скоринг',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Risk в Halyk Bank. Jira-задача CRED-205: "Реализовать скоринговую модель. Оценить заёмщика по нескольким факторам: возраст, доход, стаж, количество действующих кредитов, кредитная история. Каждый фактор даёт баллы 0-200. Итого 0-1000. Решение: APPROVED (>600), MANUAL_REVIEW (400-600), REJECTED (<400)."',
      requirements: [
        'Record ScoringInput(int age, double income, int employmentMonths, int existingLoans, boolean hasDelays, boolean hasDefaults)',
        'Record ScoringResult(int totalScore, String decision, Map<String, Integer> breakdown)',
        'Метод calculateScore(ScoringInput input) возвращает ScoringResult',
        'Факторы: возраст (25-45 → 200, 21-24 или 46-55 → 150, иначе 100), доход (>500k → 200, >300k → 150, >150k → 100, иначе 50)',
        'Стаж (>36 мес → 200, >12 → 150, >6 → 100, иначе 50), кредиты (0 → 200, 1 → 150, 2 → 100, 3+ → 50)',
        'Кредитная история: нет просрочек → 200, были просрочки → 100, были дефолты → 0',
        'Decision: >600 APPROVED, 400-600 MANUAL_REVIEW, <400 REJECTED',
        'Протестировать 3 клиента: отличный, средний, плохой'
      ],
      expectedOutput: '=== Скоринг: Кредитная модель ===\n--- Клиент: Асель Нурланова ---\n  Возраст:    200 баллов\n  Доход:      200 баллов\n  Стаж:       200 баллов\n  Кредиты:    200 баллов\n  История:    200 баллов\n  ИТОГО:      1000 баллов → APPROVED\n\n--- Клиент: Данияр Ахметов ---\n  Возраст:    150 баллов\n  Доход:      150 баллов\n  Стаж:       150 баллов\n  Кредиты:    150 баллов\n  История:    100 баллов\n  ИТОГО:      700 баллов → APPROVED\n\n--- Клиент: Тимур Жанов ---\n  Возраст:    100 баллов\n  Доход:      50 баллов\n  Стаж:       50 баллов\n  Кредиты:    50 баллов\n  История:    0 баллов\n  ИТОГО:      250 баллов → REJECTED',
      hint: 'Используйте LinkedHashMap чтобы сохранить порядок факторов при выводе. Каждый фактор — отдельный метод scoreAge(), scoreIncome() и т.д.',
      solution: `import java.util.*;

public class Main {
    record ScoringInput(int age, double income, int employmentMonths,
                        int existingLoans, boolean hasDelays, boolean hasDefaults) {}

    record ScoringResult(int totalScore, String decision,
                         Map<String, Integer> breakdown) {}

    static int scoreAge(int age) {
        if (age >= 25 && age <= 45) return 200;
        if ((age >= 21 && age < 25) || (age > 45 && age <= 55)) return 150;
        return 100;
    }

    static int scoreIncome(double income) {
        if (income > 500_000) return 200;
        if (income > 300_000) return 150;
        if (income > 150_000) return 100;
        return 50;
    }

    static int scoreEmployment(int months) {
        if (months > 36) return 200;
        if (months > 12) return 150;
        if (months > 6) return 100;
        return 50;
    }

    static int scoreExistingLoans(int loans) {
        if (loans == 0) return 200;
        if (loans == 1) return 150;
        if (loans == 2) return 100;
        return 50;
    }

    static int scoreCreditHistory(boolean hasDelays, boolean hasDefaults) {
        if (hasDefaults) return 0;
        if (hasDelays) return 100;
        return 200;
    }

    static ScoringResult calculateScore(ScoringInput input) {
        Map<String, Integer> breakdown = new LinkedHashMap<>();
        breakdown.put("Возраст", scoreAge(input.age()));
        breakdown.put("Доход", scoreIncome(input.income()));
        breakdown.put("Стаж", scoreEmployment(input.employmentMonths()));
        breakdown.put("Кредиты", scoreExistingLoans(input.existingLoans()));
        breakdown.put("История", scoreCreditHistory(input.hasDelays(), input.hasDefaults()));

        int total = breakdown.values().stream().mapToInt(Integer::intValue).sum();
        String decision;
        if (total > 600) decision = "APPROVED";
        else if (total >= 400) decision = "MANUAL_REVIEW";
        else decision = "REJECTED";

        return new ScoringResult(total, decision, breakdown);
    }

    public static void main(String[] args) {
        System.out.println("=== Скоринг: Кредитная модель ===");

        var clients = List.of(
            Map.entry("Асель Нурланова",
                new ScoringInput(30, 700_000, 60, 0, false, false)),
            Map.entry("Данияр Ахметов",
                new ScoringInput(23, 350_000, 18, 1, true, false)),
            Map.entry("Тимур Жанов",
                new ScoringInput(62, 120_000, 4, 3, true, true))
        );

        for (var entry : clients) {
            ScoringResult result = calculateScore(entry.getValue());
            System.out.printf("--- Клиент: %s ---%n", entry.getKey());
            for (var factor : result.breakdown().entrySet()) {
                System.out.printf("  %-10s %d баллов%n", factor.getKey() + ":", factor.getValue());
            }
            System.out.printf("  %-10s %d баллов → %s%n%n",
                "ИТОГО:", result.totalScore(), result.decision());
        }
    }
}`,
      explanation: 'Скоринговая модель — ядро кредитного процесса. В реальных банках (Halyk, Kaspi) используют ML-модели, но логика та же: каждый фактор вносит вклад в итоговый балл. LinkedHashMap сохраняет порядок вставки для корректного вывода. Пороги 400/600 — типичные для казахстанских банков.'
    },
    {
      id: 3,
      title: 'Loan Calculator: Калькулятор кредита',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Lending в Forte Bank. Jira-задача CRED-310: "Реализовать калькулятор кредита. Клиент вводит сумму, срок, ставку. Система считает аннуитетный и дифференцированный платёж, переплату, ГЭСВ (годовая эффективная ставка вознаграждения). Вывести сравнительную таблицу двух схем."',
      requirements: [
        'Record LoanParams(double amount, int termMonths, double annualRate)',
        'Метод calcAnnuity(LoanParams p) — рассчитать аннуитетный ежемесячный платёж',
        'Формула аннуитета: payment = P * r * (1+r)^n / ((1+r)^n - 1), где r = годовая ставка / 12 / 100',
        'Метод calcDifferentiated(LoanParams p, int month) — платёж за конкретный месяц',
        'Дифференцированный: основной долг = P/n, проценты = остаток * r',
        'Рассчитать общую переплату для обеих схем',
        'ГЭСВ для аннуитета = ((totalPayment / P) ^ (12/n) - 1) * 100',
        'Вывести первые 3 и последние 3 месяца графика для обеих схем'
      ],
      expectedOutput: '=== Калькулятор кредита (Forte Bank) ===\nСумма: 5000000.0 KZT, Срок: 24 мес, Ставка: 18.0%\n\n--- Аннуитетная схема ---\nЕжемесячный платёж: 249240.18 KZT\nОбщая выплата:      5981764.30 KZT\nПереплата:          981764.30 KZT\nГЭСВ:               19.56%\n\nМесяц | Основной долг | Проценты  | Платёж     | Остаток\n  1   |    174240.18  |  75000.00 | 249240.18  | 4825759.82\n  2   |    176853.78  |  72386.40 | 249240.18  | 4648906.04\n  3   |    179507.09  |  69733.59 | 249240.18  | 4469398.95\n ...\n 22   |    238263.77  |  10976.41 | 249240.18  |  492387.32\n 23   |    241837.73  |   7402.45 | 249240.18  |  250549.58\n 24   |    250549.58  |   3758.24 | 254307.83  |      0.00\n\n--- Дифференцированная схема ---\nПервый платёж: 283333.33 KZT\nПоследний платёж: 211458.33 KZT\nОбщая выплата:   5937500.00 KZT\nПереплата:        937500.00 KZT',
      hint: 'Месячная ставка r = annualRate / 12 / 100. Для аннуитета используйте Math.pow(1 + r, n). Для дифференцированного: основной = сумма / срок (фиксирован), проценты = остаток * r (убывают).',
      solution: `public class Main {
    record LoanParams(double amount, int termMonths, double annualRate) {}

    static double calcAnnuity(LoanParams p) {
        double r = p.annualRate() / 12.0 / 100.0;
        int n = p.termMonths();
        return p.amount() * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    }

    static double calcDifferentiated(LoanParams p, int month) {
        double r = p.annualRate() / 12.0 / 100.0;
        double principalPart = p.amount() / p.termMonths();
        double remainingDebt = p.amount() - principalPart * (month - 1);
        return principalPart + remainingDebt * r;
    }

    public static void main(String[] args) {
        var loan = new LoanParams(5_000_000, 24, 18.0);
        double r = loan.annualRate() / 12.0 / 100.0;
        double annuity = calcAnnuity(loan);

        System.out.println("=== Калькулятор кредита (Forte Bank) ===");
        System.out.printf("Сумма: %.1f KZT, Срок: %d мес, Ставка: %.1f%%%n%n",
            loan.amount(), loan.termMonths(), loan.annualRate());

        // --- Аннуитетная схема ---
        System.out.println("--- Аннуитетная схема ---");
        System.out.printf("Ежемесячный платёж: %.2f KZT%n", annuity);

        double totalAnnuity = 0;
        double balance = loan.amount();
        System.out.printf("%nМесяц | Основной долг | Проценты  | Платёж     | Остаток%n");

        for (int m = 1; m <= loan.termMonths(); m++) {
            double interest = balance * r;
            double principal = annuity - interest;
            if (m == loan.termMonths()) {
                principal = balance;
                interest = balance * r;
            }
            double payment = principal + interest;
            totalAnnuity += payment;
            balance -= principal;
            if (balance < 0) balance = 0;

            if (m <= 3 || m >= loan.termMonths() - 2) {
                System.out.printf(" %2d   | %12.2f  | %9.2f | %10.2f  | %9.2f%n",
                    m, principal, interest, payment, balance);
            }
            if (m == 3) System.out.println(" ...");
        }

        double overpayAnnuity = totalAnnuity - loan.amount();
        double gesv = (Math.pow(totalAnnuity / loan.amount(), 12.0 / loan.termMonths()) - 1) * 100;
        System.out.printf("%nОбщая выплата:      %.2f KZT%n", totalAnnuity);
        System.out.printf("Переплата:          %.2f KZT%n", overpayAnnuity);
        System.out.printf("ГЭСВ:               %.2f%%%n", gesv);

        // --- Дифференцированная схема ---
        System.out.println("\\n--- Дифференцированная схема ---");
        double totalDiff = 0;
        for (int m = 1; m <= loan.termMonths(); m++) {
            totalDiff += calcDifferentiated(loan, m);
        }
        System.out.printf("Первый платёж: %.2f KZT%n", calcDifferentiated(loan, 1));
        System.out.printf("Последний платёж: %.2f KZT%n", calcDifferentiated(loan, loan.termMonths()));
        System.out.printf("Общая выплата:   %.2f KZT%n", totalDiff);
        System.out.printf("Переплата:        %.2f KZT%n", totalDiff - loan.amount());
    }
}`,
      explanation: 'Аннуитетный платёж — фиксированная сумма каждый месяц (удобно для клиента). Дифференцированный — убывающий (меньше переплата, но высокий первый платёж). ГЭСВ (аналог APR) — реальная стоимость кредита с учётом всех комиссий. В Казахстане банки обязаны указывать ГЭСВ по закону.'
    },
    {
      id: 4,
      title: 'Payment Schedule: График погашения',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Lending в Kaspi Bank. Jira-задача CRED-415: "Генерация детального графика погашения с поддержкой досрочного погашения и пени за просрочку. При досрочном — пересчёт графика. При просрочке — начисление штрафных процентов."',
      requirements: [
        'Record ScheduleRow(int month, double principal, double interest, double payment, double balance)',
        'Метод generateSchedule(double amount, int term, double rate) — полный график аннуитетных платежей',
        'Метод applyEarlyRepayment(List<ScheduleRow> schedule, int month, double extraAmount) — досрочное погашение',
        'При досрочном погашении пересчитать оставшийся график (уменьшить сумму платежа, срок тот же)',
        'Метод applyLatePayment(ScheduleRow row, int daysLate) — штраф 0.5% от платежа за каждый день просрочки',
        'Вывести исходный график, затем график с досрочным погашением в месяце 3',
        'Показать расчёт пени за просрочку 10 дней'
      ],
      expectedOutput: '=== График погашения (Kaspi Bank) ===\nКредит: 2000000.0 KZT, Срок: 12 мес, Ставка: 24.0%\n\nМесяц | Основной   | Проценты | Платёж     | Остаток\n  1   | 148700.81  | 40000.00 | 188700.81  | 1851299.19\n  2   | 151674.82  | 37025.98 | 188700.81  | 1699624.37\n  3   | 154708.32  | 33992.49 | 188700.81  | 1544916.05\n  4   | 157802.48  | 30898.32 | 188700.81  | 1387113.56\n  5   | 160958.53  | 27742.27 | 188700.81  | 1226155.03\n  6   | 164177.70  | 24523.10 | 188700.81  | 1061977.33\n  7   | 167461.26  | 21239.55 | 188700.81  |  894516.07\n  8   | 170810.48  | 17890.32 | 188700.81  |  723705.59\n  9   | 174226.69  | 14474.11 | 188700.81  |  549478.90\n 10   | 177711.22  | 10989.58 | 188700.81  |  371767.68\n 11   | 181265.45  |  7435.35 | 188700.81  |  190502.23\n 12   | 190502.23  |  3810.04 | 194312.27  |      0.00\n\nОбщая переплата: 264409.66 KZT\n\n--- Досрочное погашение 500000 KZT в месяце 3 ---\nНовый остаток: 1044916.05 KZT\nНовый платёж:  127571.67 KZT (было 188700.81)\nЭкономия на процентах: 96735.86 KZT\n\n--- Просрочка 10 дней ---\nПлатёж: 188700.81 KZT\nПени (0.5%/день × 10 дней): 9435.04 KZT\nИтого к оплате: 198135.85 KZT',
      hint: 'При досрочном погашении: уменьшите остаток, пересчитайте аннуитет для оставшегося срока с новым остатком. Пеня = платёж * 0.005 * daysLate.',
      solution: `import java.util.*;

public class Main {
    record ScheduleRow(int month, double principal, double interest,
                       double payment, double balance) {}

    static double calcAnnuity(double amount, int term, double annualRate) {
        double r = annualRate / 12.0 / 100.0;
        return amount * r * Math.pow(1 + r, term) / (Math.pow(1 + r, term) - 1);
    }

    static List<ScheduleRow> generateSchedule(double amount, int term, double annualRate) {
        double r = annualRate / 12.0 / 100.0;
        double annuity = calcAnnuity(amount, term, annualRate);
        List<ScheduleRow> schedule = new ArrayList<>();
        double balance = amount;

        for (int m = 1; m <= term; m++) {
            double interest = balance * r;
            double principal = annuity - interest;
            if (m == term) {
                principal = balance;
                interest = balance * r;
            }
            double payment = principal + interest;
            balance -= principal;
            if (balance < 0.01) balance = 0;
            schedule.add(new ScheduleRow(m, principal, interest, payment, balance));
        }
        return schedule;
    }

    static double applyEarlyRepayment(List<ScheduleRow> schedule, int month,
                                       double extraAmount, double annualRate) {
        ScheduleRow row = schedule.get(month - 1);
        double newBalance = row.balance() - extraAmount;
        int remainingTerm = schedule.size() - month;
        return calcAnnuity(newBalance, remainingTerm, annualRate);
    }

    static double calcPenalty(double payment, int daysLate) {
        return payment * 0.005 * daysLate;
    }

    public static void main(String[] args) {
        double amount = 2_000_000;
        int term = 12;
        double rate = 24.0;

        System.out.println("=== График погашения (Kaspi Bank) ===");
        System.out.printf("Кредит: %.1f KZT, Срок: %d мес, Ставка: %.1f%%%n%n", amount, term, rate);

        List<ScheduleRow> schedule = generateSchedule(amount, term, rate);

        System.out.println("Месяц | Основной   | Проценты | Платёж     | Остаток");
        double totalPaid = 0;
        for (ScheduleRow row : schedule) {
            System.out.printf(" %2d   | %10.2f  | %8.2f | %10.2f  | %9.2f%n",
                row.month(), row.principal(), row.interest(), row.payment(), row.balance());
            totalPaid += row.payment();
        }
        System.out.printf("%nОбщая переплата: %.2f KZT%n", totalPaid - amount);

        // Досрочное погашение
        double extraPayment = 500_000;
        int earlyMonth = 3;
        ScheduleRow atMonth = schedule.get(earlyMonth - 1);
        double newBalance = atMonth.balance() - extraPayment;
        int remaining = term - earlyMonth;
        double newAnnuity = calcAnnuity(newBalance, remaining, rate);

        List<ScheduleRow> newSchedule = generateSchedule(newBalance, remaining, rate);
        double newTotal = 0;
        for (int i = 0; i < earlyMonth; i++) newTotal += schedule.get(i).payment();
        newTotal += extraPayment;
        for (ScheduleRow row : newSchedule) newTotal += row.payment();
        double savings = totalPaid - newTotal;

        System.out.printf("%n--- Досрочное погашение %.0f KZT в месяце %d ---%n",
            extraPayment, earlyMonth);
        System.out.printf("Новый остаток: %.2f KZT%n", newBalance);
        System.out.printf("Новый платёж:  %.2f KZT (было %.2f)%n", newAnnuity, calcAnnuity(amount, term, rate));
        System.out.printf("Экономия на процентах: %.2f KZT%n", savings);

        // Просрочка
        int daysLate = 10;
        double payment = schedule.get(0).payment();
        double penalty = calcPenalty(payment, daysLate);
        System.out.printf("%n--- Просрочка %d дней ---%n", daysLate);
        System.out.printf("Платёж: %.2f KZT%n", payment);
        System.out.printf("Пени (0.5%%/день × %d дней): %.2f KZT%n", daysLate, penalty);
        System.out.printf("Итого к оплате: %.2f KZT%n", payment + penalty);
    }
}`,
      explanation: 'График погашения — основной документ кредитного договора. Аннуитетный платёж пересчитывается при досрочном погашении: новая сумма, тот же оставшийся срок. Пеня 0.5%/день — типичная ставка в казахстанских банках (максимум ограничен законом). В Kaspi можно делать частичное досрочное погашение через приложение.'
    },
    {
      id: 5,
      title: 'Overdue Management: Просрочка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Collections в Halyk Bank. Jira-задача CRED-520: "Классификация просроченных кредитов по дням просрочки. Расчёт штрафных процентов (0.1% в день, не более 10% от суммы кредита). Определение коллекшн-действия: SMS, звонок, юридическое."',
      requirements: [
        'Enum OverdueCategory: CURRENT, DAYS_1_30, DAYS_31_60, DAYS_61_90, DAYS_90_PLUS',
        'Record OverdueLoan(String borrower, double loanAmount, double paymentDue, int daysOverdue, String product)',
        'Record OverdueReport(OverdueCategory category, double penalty, String action)',
        'Метод classifyOverdue(OverdueLoan loan) возвращает OverdueReport',
        'Пеня: 0.1% от суммы просроченного платежа за каждый день, максимум 10% от суммы кредита',
        'Действия: 0 дней — нет, 1-30 — SMS-напоминание, 31-60 — звонок коллектора, 61-90 — юрист, 90+ — передача в суд',
        'Обработать список из 5 кредитов, вывести сводку по категориям'
      ],
      expectedOutput: '=== Управление просрочкой (Halyk Bank) ===\n\nЗаёмщик          | Продукт      | Дни | Категория  | Пеня KZT    | Действие\nКанат Ибраев     | Потреб.       |   0 | CURRENT    |        0.00 | Нет действий\nАйгуль Тасова    | Потреб.       |  15 | 1-30 дней  |     3750.00 | SMS-напоминание\nРуслан Омаров    | Авто          |  45 | 31-60 дней |    22500.00 | Звонок коллектора\nДана Муратова    | Ипотека       |  75 | 61-90 дней |   150000.00 | Юридическое уведомление\nСерик Калиев     | Бизнес        | 120 | 90+ дней   |   200000.00 | Передача в суд\n\n--- Сводка портфеля просрочки ---\nCURRENT:    1 кредит(ов), пеня:        0.00 KZT\n1-30 дней:  1 кредит(ов), пеня:     3750.00 KZT\n31-60 дней: 1 кредит(ов), пеня:    22500.00 KZT\n61-90 дней: 1 кредит(ов), пеня:   150000.00 KZT\n90+ дней:   1 кредит(ов), пеня:   200000.00 KZT',
      hint: 'Пеня = min(paymentDue * 0.001 * daysOverdue, loanAmount * 0.1). Для классификации используйте if-else или TreeMap с порогами.',
      solution: `import java.util.*;

public class Main {
    enum OverdueCategory {
        CURRENT("CURRENT"), DAYS_1_30("1-30 дней"), DAYS_31_60("31-60 дней"),
        DAYS_61_90("61-90 дней"), DAYS_90_PLUS("90+ дней");

        final String label;
        OverdueCategory(String label) { this.label = label; }
    }

    record OverdueLoan(String borrower, double loanAmount, double paymentDue,
                       int daysOverdue, String product) {}

    record OverdueReport(OverdueCategory category, double penalty, String action) {}

    static OverdueReport classifyOverdue(OverdueLoan loan) {
        OverdueCategory cat;
        String action;

        if (loan.daysOverdue() == 0) {
            cat = OverdueCategory.CURRENT;
            action = "Нет действий";
        } else if (loan.daysOverdue() <= 30) {
            cat = OverdueCategory.DAYS_1_30;
            action = "SMS-напоминание";
        } else if (loan.daysOverdue() <= 60) {
            cat = OverdueCategory.DAYS_31_60;
            action = "Звонок коллектора";
        } else if (loan.daysOverdue() <= 90) {
            cat = OverdueCategory.DAYS_61_90;
            action = "Юридическое уведомление";
        } else {
            cat = OverdueCategory.DAYS_90_PLUS;
            action = "Передача в суд";
        }

        double penalty = Math.min(
            loan.paymentDue() * 0.001 * loan.daysOverdue(),
            loan.loanAmount() * 0.1
        );
        if (loan.daysOverdue() == 0) penalty = 0;

        return new OverdueReport(cat, penalty, action);
    }

    public static void main(String[] args) {
        System.out.println("=== Управление просрочкой (Halyk Bank) ===\\n");

        var loans = List.of(
            new OverdueLoan("Канат Ибраев", 1_500_000, 250_000, 0, "Потреб."),
            new OverdueLoan("Айгуль Тасова", 2_000_000, 250_000, 15, "Потреб."),
            new OverdueLoan("Руслан Омаров", 5_000_000, 500_000, 45, "Авто"),
            new OverdueLoan("Дана Муратова", 20_000_000, 2_000_000, 75, "Ипотека"),
            new OverdueLoan("Серик Калиев", 2_000_000, 350_000, 120, "Бизнес")
        );

        System.out.printf("%-16s | %-12s | %3s | %-10s | %11s | %s%n",
            "Заёмщик", "Продукт", "Дни", "Категория", "Пеня KZT", "Действие");

        Map<OverdueCategory, List<OverdueReport>> summary = new LinkedHashMap<>();
        for (OverdueCategory c : OverdueCategory.values()) summary.put(c, new ArrayList<>());

        for (OverdueLoan loan : loans) {
            OverdueReport report = classifyOverdue(loan);
            summary.get(report.category()).add(report);
            System.out.printf("%-16s | %-12s | %3d | %-10s | %11.2f | %s%n",
                loan.borrower(), loan.product(), loan.daysOverdue(),
                report.category().label, report.penalty(), report.action());
        }

        System.out.println("\\n--- Сводка портфеля просрочки ---");
        for (var entry : summary.entrySet()) {
            double totalPenalty = entry.getValue().stream()
                .mapToDouble(OverdueReport::penalty).sum();
            System.out.printf("%-11s %d кредит(ов), пеня: %12.2f KZT%n",
                entry.getKey().label + ":", entry.getValue().size(), totalPenalty);
        }
    }
}`,
      explanation: 'Классификация просрочки по бакетам (0, 1-30, 31-60, 61-90, 90+) — стандарт банковской отчётности. Пеня 0.1%/день с кэпом 10% — требование НБ РК. В Halyk Bank эти пороги определяют эскалацию: от автоматических SMS до передачи дела в суд. NPL (non-performing loans) — кредиты с просрочкой 90+ дней.'
    },
    {
      id: 6,
      title: 'Loan Portfolio: Портфель кредитов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Analytics в Kaspi Bank. Jira-задача CRED-630: "Агрегировать статистику кредитного портфеля: общий объём, остаток задолженности, NPL ratio, средняя ставка, распределение по продуктам (потребительский, ипотека, авто, бизнес). Рассчитать риск-метрики."',
      requirements: [
        'Record Loan(String id, String product, double issuedAmount, double outstandingBalance, double rate, int daysOverdue)',
        'Record PortfolioStats(double totalIssued, double totalOutstanding, double nplRatio, double avgRate, Map<String, Double> productDistribution)',
        'Метод analyzePortfolio(List<Loan> loans) возвращает PortfolioStats',
        'NPL ratio = сумма остатков кредитов с просрочкой >90 дней / общий остаток * 100',
        'Средняя ставка — средневзвешенная по остатку',
        'Распределение по продуктам — доля каждого продукта в общем остатке',
        'Вывести полный отчёт с метриками и распределением'
      ],
      expectedOutput: '=== Портфель кредитов (Kaspi Bank) ===\n\nОбщие показатели:\n  Количество кредитов:   8\n  Выдано всего:          45500000.00 KZT\n  Текущий остаток:       28200000.00 KZT\n  Средневзвешенная ставка: 21.28%\n\nКачество портфеля:\n  Просрочка 0 дней:    5 кредитов, 18700000.00 KZT (66.3%)\n  Просрочка 1-90 дней: 2 кредита,  6500000.00 KZT (23.0%)\n  NPL (90+ дней):      1 кредит,   3000000.00 KZT (10.6%)\n  NPL Ratio:           10.64%\n\nРаспределение по продуктам:\n  Потребительский: 28.4% (8000000.00 KZT)\n  Ипотека:         53.2% (15000000.00 KZT)\n  Авто:            10.6% (3000000.00 KZT)\n  Бизнес:           7.8% (2200000.00 KZT)',
      hint: 'Средневзвешенная ставка = sum(rate_i * balance_i) / sum(balance_i). Для группировки по продуктам используйте Collectors.groupingBy с Collectors.summingDouble.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Loan(String id, String product, double issuedAmount,
                double outstandingBalance, double rate, int daysOverdue) {}

    record PortfolioStats(double totalIssued, double totalOutstanding,
                          double nplRatio, double avgRate,
                          Map<String, Double> productDistribution) {}

    static PortfolioStats analyzePortfolio(List<Loan> loans) {
        double totalIssued = loans.stream().mapToDouble(Loan::issuedAmount).sum();
        double totalOutstanding = loans.stream().mapToDouble(Loan::outstandingBalance).sum();

        double nplBalance = loans.stream()
            .filter(l -> l.daysOverdue() > 90)
            .mapToDouble(Loan::outstandingBalance).sum();
        double nplRatio = totalOutstanding > 0 ? nplBalance / totalOutstanding * 100 : 0;

        double weightedRateSum = loans.stream()
            .mapToDouble(l -> l.rate() * l.outstandingBalance()).sum();
        double avgRate = totalOutstanding > 0 ? weightedRateSum / totalOutstanding : 0;

        Map<String, Double> productDist = loans.stream()
            .collect(Collectors.groupingBy(Loan::product,
                Collectors.summingDouble(Loan::outstandingBalance)));

        return new PortfolioStats(totalIssued, totalOutstanding, nplRatio, avgRate, productDist);
    }

    public static void main(String[] args) {
        var loans = List.of(
            new Loan("KP-001", "Потребительский", 3_000_000, 2_000_000, 24.0, 0),
            new Loan("KP-002", "Потребительский", 5_000_000, 3_500_000, 22.0, 15),
            new Loan("KP-003", "Потребительский", 4_000_000, 2_500_000, 26.0, 0),
            new Loan("KP-004", "Ипотека", 20_000_000, 15_000_000, 16.0, 0),
            new Loan("KP-005", "Авто", 6_000_000, 3_000_000, 20.0, 120),
            new Loan("KP-006", "Бизнес", 3_500_000, 2_200_000, 28.0, 45),
            new Loan("KP-007", "Потребительский", 2_000_000, 0, 24.0, 0),
            new Loan("KP-008", "Ипотека", 2_000_000, 0, 18.0, 0)
        );

        // Учитываем только активные (с остатком > 0)
        var active = loans.stream().filter(l -> l.outstandingBalance() > 0).toList();
        var stats = analyzePortfolio(active);

        System.out.println("=== Портфель кредитов (Kaspi Bank) ===\\n");
        System.out.println("Общие показатели:");
        System.out.printf("  Количество кредитов:   %d%n", active.size());
        System.out.printf("  Выдано всего:          %.2f KZT%n", stats.totalIssued());
        System.out.printf("  Текущий остаток:       %.2f KZT%n", stats.totalOutstanding());
        System.out.printf("  Средневзвешенная ставка: %.2f%%%n", stats.avgRate());

        long current = active.stream().filter(l -> l.daysOverdue() == 0).count();
        double currentBal = active.stream().filter(l -> l.daysOverdue() == 0)
            .mapToDouble(Loan::outstandingBalance).sum();
        long overdue1_90 = active.stream()
            .filter(l -> l.daysOverdue() > 0 && l.daysOverdue() <= 90).count();
        double overdueBal = active.stream()
            .filter(l -> l.daysOverdue() > 0 && l.daysOverdue() <= 90)
            .mapToDouble(Loan::outstandingBalance).sum();
        long nplCount = active.stream().filter(l -> l.daysOverdue() > 90).count();
        double nplBal = active.stream().filter(l -> l.daysOverdue() > 90)
            .mapToDouble(Loan::outstandingBalance).sum();

        System.out.println("\\nКачество портфеля:");
        System.out.printf("  Просрочка 0 дней:    %d кредитов, %.2f KZT (%.1f%%)%n",
            current, currentBal, currentBal / stats.totalOutstanding() * 100);
        System.out.printf("  Просрочка 1-90 дней: %d кредита,  %.2f KZT (%.1f%%)%n",
            overdue1_90, overdueBal, overdueBal / stats.totalOutstanding() * 100);
        System.out.printf("  NPL (90+ дней):      %d кредит,   %.2f KZT (%.1f%%)%n",
            nplCount, nplBal, nplBal / stats.totalOutstanding() * 100);
        System.out.printf("  NPL Ratio:           %.2f%%%n", stats.nplRatio());

        System.out.println("\\nРаспределение по продуктам:");
        var sortedProducts = stats.productDistribution().entrySet().stream()
            .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
            .toList();
        for (var entry : sortedProducts) {
            double pct = entry.getValue() / stats.totalOutstanding() * 100;
            System.out.printf("  %-16s %.1f%% (%.2f KZT)%n",
                entry.getKey() + ":", pct, entry.getValue());
        }
    }
}`,
      explanation: 'Портфельный анализ — ключевая задача Risk-команды банка. NPL Ratio (доля неработающих кредитов) — главный индикатор качества портфеля. В Kaspi Bank NPL ratio ~5-7%. Средневзвешенная ставка показывает реальную доходность портфеля. Stream API с Collectors.groupingBy идеально подходит для агрегации по продуктам.'
    },
    {
      id: 7,
      title: 'Provision Calculation: Резервирование',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт команды Risk в Forte Bank. Jira-задача CRED-745: "Рассчитать провизии (резервы) по МСФО 9 (IFRS 9). Stage 1 — работающие кредиты (12-месячный ECL). Stage 2 — значительное увеличение риска (lifetime ECL). Stage 3 — дефолтные (lifetime ECL, высокий LGD). Рассчитать суммы резервов по каждой стадии."',
      requirements: [
        'Enum Stage: STAGE_1, STAGE_2, STAGE_3 с описанием',
        'Record LoanForProvision(String id, double balance, double pd12m, double pdLifetime, double lgd, int daysOverdue, boolean significantRiskIncrease)',
        'Record ProvisionResult(Stage stage, double ecl, double provisionAmount)',
        'Метод calculateProvision(LoanForProvision loan) возвращает ProvisionResult',
        'Stage 1: ECL = balance × PD_12m × LGD; Stage 2: ECL = balance × PD_lifetime × LGD; Stage 3: ECL = balance × LGD',
        'Классификация: >90 дней просрочки → Stage 3, significantRiskIncrease или >30 дней → Stage 2, иначе Stage 1',
        'Рассчитать портфель из 6 кредитов, вывести итоги по стадиям и общий объём резервов'
      ],
      expectedOutput: '=== Резервирование IFRS 9 (Forte Bank) ===\n\nID       | Остаток        | PD(12m) | PD(life)| LGD   | Дни | Стадия  | ECL\nFL-001   |   5000000.00   |  2.0%   |  8.0%   | 40.0% |   0 | Stage 1 |      40000.00\nFL-002   |   3000000.00   |  5.0%   | 20.0%   | 45.0% |   0 | Stage 2 |     270000.00\nFL-003   |   8000000.00   |  3.0%   | 12.0%   | 40.0% |  10 | Stage 1 |      96000.00\nFL-004   |   2000000.00   | 10.0%   | 35.0%   | 50.0% |  45 | Stage 2 |     350000.00\nFL-005   |   4000000.00   | 15.0%   | 50.0%   | 60.0% |  95 | Stage 3 |    2400000.00\nFL-006   |   1500000.00   | 20.0%   | 60.0%   | 70.0% | 180 | Stage 3 |    1050000.00\n\n--- Итого по стадиям ---\nStage 1: 2 кредита, остаток: 13000000.00, резерв:    136000.00 (1.0%)\nStage 2: 2 кредита, остаток:  5000000.00, резерв:    620000.00 (12.4%)\nStage 3: 2 кредита, остаток:  5500000.00, резерв:   3450000.00 (62.7%)\n\nОбщий объём резервов: 4206000.00 KZT\nCoverage ratio:       17.9%',
      hint: 'Stage 3: PD фактически = 100%, поэтому ECL = balance × LGD. PD (Probability of Default), LGD (Loss Given Default) — стандартные параметры IFRS 9. Coverage ratio = total provisions / total outstanding.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    enum Stage {
        STAGE_1("Stage 1", "Performing — 12-month ECL"),
        STAGE_2("Stage 2", "Significant risk increase — Lifetime ECL"),
        STAGE_3("Stage 3", "Credit-impaired — Lifetime ECL");

        final String label, description;
        Stage(String label, String description) {
            this.label = label; this.description = description;
        }
    }

    record LoanForProvision(String id, double balance, double pd12m,
                            double pdLifetime, double lgd, int daysOverdue,
                            boolean significantRiskIncrease) {}

    record ProvisionResult(Stage stage, double ecl) {}

    static ProvisionResult calculateProvision(LoanForProvision loan) {
        Stage stage;
        if (loan.daysOverdue() > 90) {
            stage = Stage.STAGE_3;
        } else if (loan.significantRiskIncrease() || loan.daysOverdue() > 30) {
            stage = Stage.STAGE_2;
        } else {
            stage = Stage.STAGE_1;
        }

        double ecl = switch (stage) {
            case STAGE_1 -> loan.balance() * loan.pd12m() * loan.lgd();
            case STAGE_2 -> loan.balance() * loan.pdLifetime() * loan.lgd();
            case STAGE_3 -> loan.balance() * loan.lgd(); // PD = 100%
        };

        return new ProvisionResult(stage, ecl);
    }

    public static void main(String[] args) {
        var loans = List.of(
            new LoanForProvision("FL-001", 5_000_000, 0.02, 0.08, 0.40, 0, false),
            new LoanForProvision("FL-002", 3_000_000, 0.05, 0.20, 0.45, 0, true),
            new LoanForProvision("FL-003", 8_000_000, 0.03, 0.12, 0.40, 10, false),
            new LoanForProvision("FL-004", 2_000_000, 0.10, 0.35, 0.50, 45, false),
            new LoanForProvision("FL-005", 4_000_000, 0.15, 0.50, 0.60, 95, false),
            new LoanForProvision("FL-006", 1_500_000, 0.20, 0.60, 0.70, 180, false)
        );

        System.out.println("=== Резервирование IFRS 9 (Forte Bank) ===\\n");
        System.out.printf("%-8s | %-14s | %-7s | %-7s | %-5s | %-3s | %-7s | %s%n",
            "ID", "Остаток", "PD(12m)", "PD(life)", "LGD", "Дни", "Стадия", "ECL");

        Map<Stage, List<double[]>> stageData = new LinkedHashMap<>();
        for (Stage s : Stage.values()) stageData.put(s, new ArrayList<>());

        double totalProvisions = 0;
        double totalOutstanding = 0;

        for (var loan : loans) {
            var result = calculateProvision(loan);
            stageData.get(result.stage()).add(new double[]{loan.balance(), result.ecl()});
            totalProvisions += result.ecl();
            totalOutstanding += loan.balance();

            System.out.printf("%-8s | %14.2f | %5.1f%%  | %5.1f%%  | %4.1f%% | %3d | %-7s | %13.2f%n",
                loan.id(), loan.balance(),
                loan.pd12m() * 100, loan.pdLifetime() * 100, loan.lgd() * 100,
                loan.daysOverdue(), result.stage().label, result.ecl());
        }

        System.out.println("\\n--- Итого по стадиям ---");
        for (var entry : stageData.entrySet()) {
            var items = entry.getValue();
            int count = items.size();
            double balance = items.stream().mapToDouble(a -> a[0]).sum();
            double provision = items.stream().mapToDouble(a -> a[1]).sum();
            double coverage = balance > 0 ? provision / balance * 100 : 0;
            System.out.printf("%-7s: %d кредита, остаток: %13.2f, резерв: %13.2f (%.1f%%)%n",
                entry.getKey().label, count, balance, provision, coverage);
        }

        double coverageRatio = totalProvisions / totalOutstanding * 100;
        System.out.printf("\\nОбщий объём резервов: %.2f KZT%n", totalProvisions);
        System.out.printf("Coverage ratio:       %.1f%%%n", coverageRatio);
    }
}`,
      explanation: 'IFRS 9 (МСФО 9) — международный стандарт резервирования, обязательный для казахстанских банков с 2018 года. Три стадии: Stage 1 (работающие, 12-месячный ECL), Stage 2 (ухудшение кредитного качества, lifetime ECL), Stage 3 (дефолтные, LGD × balance). ECL = PD × LGD × EAD. Coverage ratio показывает, какая доля портфеля покрыта резервами. НБ РК требует coverage ratio не менее 100% для Stage 3.'
    },
    {
      id: 8,
      title: 'Collection Strategy: Коллекшн',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Collections в Kaspi Bank. Jira-задача CRED-830: "Автоматизировать коллекшн-стратегию. Назначить действия по стадии просрочки: 1-15 дней — авто-SMS, 16-30 — авто-звонок, 31-60 — назначить коллектора, 60-90 — предложить реструктуризацию, 90+ — юридический отдел. Приоритизировать по сумме. Вывести дневную очередь коллектора."',
      requirements: [
        'Enum CollectionAction: AUTO_SMS, AUTO_CALL, COLLECTOR_ASSIGNED, RESTRUCTURING_OFFER, LEGAL',
        'Record DebtCase(String borrower, double overdueAmount, int daysOverdue, String phone)',
        'Record CollectionTask(DebtCase debtCase, CollectionAction action, int priority)',
        'Метод assignAction(DebtCase dc) возвращает CollectionTask',
        'Приоритет: 1 (высший) для сумм > 1_000_000, 2 для > 500_000, 3 для остальных',
        'Сортировать очередь: сначала по приоритету, потом по сумме (убывание)',
        'Вывести дневную очередь коллектора с группировкой по действиям'
      ],
      expectedOutput: '=== Коллекшн-очередь (Kaspi Bank) ===\nДата: 2026-04-07\n\n[LEGAL] — Юридический отдел (2 дела):\n  P1 | Мурат Досымов     | 2500000.00 KZT | 120 дней | +7701*****34\n  P2 | Алия Сагынова      |  800000.00 KZT |  95 дней | +7705*****89\n\n[RESTRUCTURING_OFFER] — Реструктуризация (1 дело):\n  P1 | Ернар Бекмуратов   | 1200000.00 KZT |  75 дней | +7702*****56\n\n[COLLECTOR_ASSIGNED] — Коллектор (2 дела):\n  P2 | Жанна Калиева      |  650000.00 KZT |  45 дней | +7707*****12\n  P3 | Нурлан Ахметов     |  350000.00 KZT |  35 дней | +7708*****90\n\n[AUTO_CALL] — Автозвонок (1 дело):\n  P3 | Динара Оспанова    |  180000.00 KZT |  22 дня  | +7700*****45\n\n[AUTO_SMS] — SMS-напоминание (2 дела):\n  P3 | Бауыржан Касымов   |  120000.00 KZT |   8 дней | +7771*****67\n  P3 | Камила Нуртаева    |   45000.00 KZT |   3 дня  | +7747*****23\n\nИтого: 8 дел, сумма к взысканию: 5845000.00 KZT',
      hint: 'Используйте Comparator.comparingInt(CollectionTask::priority).thenComparing(t -> t.debtCase().overdueAmount(), Comparator.reverseOrder()) для сортировки.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    enum CollectionAction {
        AUTO_SMS("SMS-напоминание"), AUTO_CALL("Автозвонок"),
        COLLECTOR_ASSIGNED("Коллектор"), RESTRUCTURING_OFFER("Реструктуризация"),
        LEGAL("Юридический отдел");

        final String label;
        CollectionAction(String label) { this.label = label; }
    }

    record DebtCase(String borrower, double overdueAmount, int daysOverdue, String phone) {}
    record CollectionTask(DebtCase debtCase, CollectionAction action, int priority) {}

    static CollectionTask assignAction(DebtCase dc) {
        CollectionAction action;
        if (dc.daysOverdue() <= 15) action = CollectionAction.AUTO_SMS;
        else if (dc.daysOverdue() <= 30) action = CollectionAction.AUTO_CALL;
        else if (dc.daysOverdue() <= 60) action = CollectionAction.COLLECTOR_ASSIGNED;
        else if (dc.daysOverdue() <= 90) action = CollectionAction.RESTRUCTURING_OFFER;
        else action = CollectionAction.LEGAL;

        int priority;
        if (dc.overdueAmount() > 1_000_000) priority = 1;
        else if (dc.overdueAmount() > 500_000) priority = 2;
        else priority = 3;

        return new CollectionTask(dc, action, priority);
    }

    public static void main(String[] args) {
        var cases = List.of(
            new DebtCase("Мурат Досымов", 2_500_000, 120, "+7701*****34"),
            new DebtCase("Алия Сагынова", 800_000, 95, "+7705*****89"),
            new DebtCase("Ернар Бекмуратов", 1_200_000, 75, "+7702*****56"),
            new DebtCase("Жанна Калиева", 650_000, 45, "+7707*****12"),
            new DebtCase("Нурлан Ахметов", 350_000, 35, "+7708*****90"),
            new DebtCase("Динара Оспанова", 180_000, 22, "+7700*****45"),
            new DebtCase("Бауыржан Касымов", 120_000, 8, "+7771*****67"),
            new DebtCase("Камила Нуртаева", 45_000, 3, "+7747*****23")
        );

        List<CollectionTask> tasks = cases.stream()
            .map(Main::assignAction)
            .sorted(Comparator.comparingInt(CollectionTask::priority)
                .thenComparing(t -> t.debtCase().overdueAmount(), Comparator.reverseOrder()))
            .toList();

        System.out.println("=== Коллекшн-очередь (Kaspi Bank) ===");
        System.out.println("Дата: 2026-04-07\\n");

        // Группировка по действиям (в порядке эскалации, reversed)
        Map<CollectionAction, List<CollectionTask>> grouped = tasks.stream()
            .collect(Collectors.groupingBy(CollectionTask::action,
                LinkedHashMap::new, Collectors.toList()));

        // Сортируем по порядку эскалации (от серьёзных к лёгким)
        var orderedActions = List.of(
            CollectionAction.LEGAL, CollectionAction.RESTRUCTURING_OFFER,
            CollectionAction.COLLECTOR_ASSIGNED, CollectionAction.AUTO_CALL,
            CollectionAction.AUTO_SMS
        );

        for (var action : orderedActions) {
            var group = grouped.getOrDefault(action, List.of());
            if (group.isEmpty()) continue;
            System.out.printf("[%s] — %s (%d %s):%n",
                action.name(), action.label, group.size(),
                group.size() == 1 ? "дело" : "дела");
            for (var task : group) {
                var dc = task.debtCase();
                System.out.printf("  P%d | %-18s | %10.2f KZT | %3d %-5s | %s%n",
                    task.priority(), dc.borrower(), dc.overdueAmount(),
                    dc.daysOverdue(),
                    dc.daysOverdue() % 10 == 1 && dc.daysOverdue() != 11 ? "день" :
                    dc.daysOverdue() % 10 >= 2 && dc.daysOverdue() % 10 <= 4 &&
                    (dc.daysOverdue() < 10 || dc.daysOverdue() > 20) ? "дня" : "дней",
                    dc.phone());
            }
            System.out.println();
        }

        double totalAmount = tasks.stream()
            .mapToDouble(t -> t.debtCase().overdueAmount()).sum();
        System.out.printf("Итого: %d дел, сумма к взысканию: %.2f KZT%n",
            tasks.size(), totalAmount);
    }
}`,
      explanation: 'Коллекшн-стратегия — автоматизация работы с просроченной задолженностью. В Kaspi Bank этот процесс сильно автоматизирован: SMS и звонки делает робот. Приоритизация по сумме позволяет коллекторам фокусироваться на крупных долгах. Группировка по действиям формирует дневную очередь для каждого отдела.'
    },
    {
      id: 9,
      title: 'Restructuring: Реструктуризация',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Lending в Halyk Bank. Jira-задача CRED-940: "Реализовать реструктуризацию проблемного кредита. Три варианта: продление срока, снижение ставки, грейс-период (только проценты N месяцев). Сравнить старый и новый графики. Рассчитать потери банка от реструктуризации."',
      requirements: [
        'Record LoanTerms(double balance, int remainingMonths, double annualRate)',
        'Record RestructuredTerms(LoanTerms newTerms, String type, double oldPayment, double newPayment, double bankLoss)',
        'Метод extendTerm(LoanTerms old, int extraMonths) — продление срока',
        'Метод reduceRate(LoanTerms old, double newRate) — снижение ставки',
        'Метод gracePeriod(LoanTerms old, int graceMonths) — грейс-период (только проценты)',
        'Потери банка = разница в NPV (чистой приведённой стоимости) денежных потоков',
        'Сравнить все три варианта для одного кредита, вывести таблицу сравнения'
      ],
      expectedOutput: '=== Реструктуризация кредита (Halyk Bank) ===\nТекущий кредит: остаток 3000000.00 KZT, 12 мес, ставка 24.0%\nТекущий платёж: 283401.49 KZT/мес\nОбщая выплата:  3400817.83 KZT\n\n--- Вариант 1: Продление срока (+12 мес) ---\nНовый платёж:  158369.94 KZT/мес (-44.1%)\nНовый срок:    24 мес\nОбщая выплата: 3800878.54 KZT\nПотери банка (NPV): 142985.62 KZT\n\n--- Вариант 2: Снижение ставки (24% → 14%) ---\nНовый платёж:  269435.49 KZT/мес (-4.9%)\nОбщая выплата: 3233225.88 KZT\nПотери банка (NPV): 167591.95 KZT\n\n--- Вариант 3: Грейс-период (3 мес — только проценты) ---\nПлатёж в грейс-период: 60000.00 KZT/мес\nПлатёж после грейса:   369685.23 KZT/мес\nОбщая выплата:         3506167.09 KZT\nПотери банка (NPV): 58721.14 KZT\n\n--- Сравнение вариантов ---\nВариант              | Платёж      | Общая выплата  | Потери банка\nТекущий              | 283401.49   | 3400817.83     |          —\nПродление (+12 мес)  | 158369.94   | 3800878.54     |  142985.62\nСнижение ставки (14%)| 269435.49   | 3233225.88     |  167591.95\nГрейс-период (3 мес) | 369685.23   | 3506167.09     |   58721.14',
      hint: 'NPV потерь = сумма(старый_платёж_i / (1+r)^i) - сумма(новый_платёж_i / (1+r)^i), где r — дисконт-ставка (используйте исходную ставку). Грейс-период: первые N месяцев платёж = остаток * месячная_ставка.',
      solution: `public class Main {
    record LoanTerms(double balance, int remainingMonths, double annualRate) {}

    static double calcAnnuity(double amount, int term, double annualRate) {
        double r = annualRate / 12.0 / 100.0;
        return amount * r * Math.pow(1 + r, term) / (Math.pow(1 + r, term) - 1);
    }

    static double calcNPV(double[] payments, double annualDiscountRate) {
        double r = annualDiscountRate / 12.0 / 100.0;
        double npv = 0;
        for (int i = 0; i < payments.length; i++) {
            npv += payments[i] / Math.pow(1 + r, i + 1);
        }
        return npv;
    }

    static double[] generatePayments(double payment, int months) {
        double[] payments = new double[months];
        java.util.Arrays.fill(payments, payment);
        return payments;
    }

    public static void main(String[] args) {
        var current = new LoanTerms(3_000_000, 12, 24.0);
        double currentPayment = calcAnnuity(current.balance(), current.remainingMonths(), current.annualRate());
        double currentTotal = currentPayment * current.remainingMonths();
        double[] currentPayments = generatePayments(currentPayment, current.remainingMonths());
        double currentNPV = calcNPV(currentPayments, current.annualRate());

        System.out.println("=== Реструктуризация кредита (Halyk Bank) ===");
        System.out.printf("Текущий кредит: остаток %.2f KZT, %d мес, ставка %.1f%%%n",
            current.balance(), current.remainingMonths(), current.annualRate());
        System.out.printf("Текущий платёж: %.2f KZT/мес%n", currentPayment);
        System.out.printf("Общая выплата:  %.2f KZT%n", currentTotal);

        // Вариант 1: Продление срока
        int extraMonths = 12;
        int newTerm1 = current.remainingMonths() + extraMonths;
        double newPayment1 = calcAnnuity(current.balance(), newTerm1, current.annualRate());
        double total1 = newPayment1 * newTerm1;
        double[] payments1 = generatePayments(newPayment1, newTerm1);
        double npv1 = calcNPV(payments1, current.annualRate());
        double loss1 = currentNPV - npv1;

        System.out.printf("%n--- Вариант 1: Продление срока (+%d мес) ---%n", extraMonths);
        System.out.printf("Новый платёж:  %.2f KZT/мес (%.1f%%)%n",
            newPayment1, (newPayment1 - currentPayment) / currentPayment * 100);
        System.out.printf("Новый срок:    %d мес%n", newTerm1);
        System.out.printf("Общая выплата: %.2f KZT%n", total1);
        System.out.printf("Потери банка (NPV): %.2f KZT%n", loss1);

        // Вариант 2: Снижение ставки
        double newRate = 14.0;
        double newPayment2 = calcAnnuity(current.balance(), current.remainingMonths(), newRate);
        double total2 = newPayment2 * current.remainingMonths();
        double[] payments2 = generatePayments(newPayment2, current.remainingMonths());
        double npv2 = calcNPV(payments2, current.annualRate());
        double loss2 = currentNPV - npv2;

        System.out.printf("%n--- Вариант 2: Снижение ставки (%.0f%% → %.0f%%) ---%n",
            current.annualRate(), newRate);
        System.out.printf("Новый платёж:  %.2f KZT/мес (%.1f%%)%n",
            newPayment2, (newPayment2 - currentPayment) / currentPayment * 100);
        System.out.printf("Общая выплата: %.2f KZT%n", total2);
        System.out.printf("Потери банка (NPV): %.2f KZT%n", loss2);

        // Вариант 3: Грейс-период
        int graceMonths = 3;
        double monthlyRate = current.annualRate() / 12.0 / 100.0;
        double gracePayment = current.balance() * monthlyRate;
        int remainingAfterGrace = current.remainingMonths() - graceMonths;
        double paymentAfterGrace = calcAnnuity(current.balance(), remainingAfterGrace, current.annualRate());
        double total3 = gracePayment * graceMonths + paymentAfterGrace * remainingAfterGrace;

        double[] payments3 = new double[current.remainingMonths()];
        for (int i = 0; i < graceMonths; i++) payments3[i] = gracePayment;
        for (int i = graceMonths; i < payments3.length; i++) payments3[i] = paymentAfterGrace;
        double npv3 = calcNPV(payments3, current.annualRate());
        double loss3 = currentNPV - npv3;

        System.out.printf("%n--- Вариант 3: Грейс-период (%d мес — только проценты) ---%n", graceMonths);
        System.out.printf("Платёж в грейс-период: %.2f KZT/мес%n", gracePayment);
        System.out.printf("Платёж после грейса:   %.2f KZT/мес%n", paymentAfterGrace);
        System.out.printf("Общая выплата:         %.2f KZT%n", total3);
        System.out.printf("Потери банка (NPV): %.2f KZT%n", loss3);

        // Сравнение
        System.out.println("\\n--- Сравнение вариантов ---");
        System.out.printf("%-20s | %-11s | %-14s | %s%n",
            "Вариант", "Платёж", "Общая выплата", "Потери банка");
        System.out.printf("%-20s | %11.2f | %14.2f | %10s%n",
            "Текущий", currentPayment, currentTotal, "—");
        System.out.printf("%-20s | %11.2f | %14.2f | %10.2f%n",
            "Продление (+" + extraMonths + " мес)", newPayment1, total1, loss1);
        System.out.printf("%-20s | %11.2f | %14.2f | %10.2f%n",
            "Снижение ставки (" + (int) newRate + "%)", newPayment2, total2, loss2);
        System.out.printf("%-20s | %11.2f | %14.2f | %10.2f%n",
            "Грейс-период (" + graceMonths + " мес)", paymentAfterGrace, total3, loss3);
    }
}`,
      explanation: 'Реструктуризация — альтернатива принудительному взысканию. Банк теряет часть дохода (NPV потерь), но сохраняет работающий кредит вместо дефолтного. NPV (чистая приведённая стоимость) дисконтирует будущие платежи к текущему моменту. В Halyk Bank реструктуризация предлагается автоматически на стадии 60-90 дней просрочки.'
    },
    {
      id: 10,
      title: 'Regulatory Report: Отчётность в НБ РК',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт команды Compliance в Forte Bank. Jira-задача CRED-1050: "Сформировать регуляторный отчёт для Национального Банка Республики Казахстан. Агрегировать: кредиты по категориям, средневзвешенные ставки, структуру просрочки, coverage ratio провизий, проверку достаточности капитала (CAR ≥ 10%). Форматированный отчёт."',
      requirements: [
        'Record ReportLoan(String category, double outstanding, double provision, double rate, int daysOverdue)',
        'Record RegulatoryReport(Map<String, Double> loansByCategory, Map<String, Double> weightedRates, Map<String, Double> overdueStructure, double totalProvisions, double coverageRatio, double car, boolean carCompliant)',
        'Метод generateReport(List<ReportLoan> loans, double bankCapital) возвращает RegulatoryReport',
        'Категории: Потребительский, Ипотека, Авто, МСБ (малый и средний бизнес)',
        'Средневзвешенная ставка по каждой категории',
        'Структура просрочки: текущие, 1-30, 31-90, 90+ дней — в % от портфеля',
        'Coverage ratio = провизии / NPL (90+ дней)',
        'CAR (Capital Adequacy Ratio) = капитал / сумма рисковых активов * 100, норматив ≥ 10%',
        'Форматированный отчёт с заголовком, датой, секциями'
      ],
      expectedOutput: '╔══════════════════════════════════════════════════╗\n║  ОТЧЁТ ДЛЯ НАЦИОНАЛЬНОГО БАНКА РК               ║\n║  Forte Bank | Дата: 2026-04-07                   ║\n╚══════════════════════════════════════════════════╝\n\n1. КРЕДИТНЫЙ ПОРТФЕЛЬ ПО КАТЕГОРИЯМ\n─────────────────────────────────────────\nКатегория        | Остаток KZT      | Доля   | Ср.ставка\nПотребительский  |   12500000.00    | 25.0%  | 23.20%\nИпотека          |   25000000.00    | 50.0%  | 15.60%\nАвто             |    7500000.00    | 15.0%  | 19.00%\nМСБ              |    5000000.00    | 10.0%  | 26.00%\nИТОГО            |   50000000.00    | 100.0% | 19.32%\n\n2. СТРУКТУРА ПРОСРОЧКИ\n─────────────────────────────────────────\nКатегория     | Сумма KZT      | Доля портфеля\nТекущие       |  35000000.00   | 70.0%\n1-30 дней     |   5000000.00   | 10.0%\n31-90 дней    |   5000000.00   | 10.0%\n90+ дней (NPL)|   5000000.00   | 10.0%\n\n3. ПРОВИЗИИ И ПОКРЫТИЕ\n─────────────────────────────────────────\nОбщий объём провизий: 6200000.00 KZT\nNPL (90+ дней):       5000000.00 KZT\nCoverage Ratio:       124.0%    [НОРМА: ≥100%]\n\n4. ДОСТАТОЧНОСТЬ КАПИТАЛА\n─────────────────────────────────────────\nСобственный капитал:  8000000.00 KZT\nРисковые активы:      50000000.00 KZT\nCAR (k1):             16.0%     [НОРМА: ≥10%] ✓\n\nСтатус: СООТВЕТСТВУЕТ НОРМАТИВАМ НБ РК',
      hint: 'Для форматирования таблиц используйте String.format с фиксированной шириной. CAR = капитал / рисковые_активы * 100. Coverage = провизии / NPL * 100.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record ReportLoan(String category, double outstanding, double provision,
                      double rate, int daysOverdue) {}

    static void generateReport(List<ReportLoan> loans, double bankCapital) {
        double totalOutstanding = loans.stream().mapToDouble(ReportLoan::outstanding).sum();
        double totalProvisions = loans.stream().mapToDouble(ReportLoan::provision).sum();

        // 1. По категориям
        Map<String, Double> byCategory = loans.stream()
            .collect(Collectors.groupingBy(ReportLoan::category,
                LinkedHashMap::new, Collectors.summingDouble(ReportLoan::outstanding)));

        Map<String, Double> weightedRates = new LinkedHashMap<>();
        for (var cat : byCategory.keySet()) {
            var catLoans = loans.stream().filter(l -> l.category().equals(cat)).toList();
            double catBal = catLoans.stream().mapToDouble(ReportLoan::outstanding).sum();
            double wRate = catLoans.stream()
                .mapToDouble(l -> l.rate() * l.outstanding()).sum() / catBal;
            weightedRates.put(cat, wRate);
        }
        double portfolioRate = loans.stream()
            .mapToDouble(l -> l.rate() * l.outstanding()).sum() / totalOutstanding;

        // 2. Просрочка
        double current = loans.stream().filter(l -> l.daysOverdue() == 0)
            .mapToDouble(ReportLoan::outstanding).sum();
        double d1_30 = loans.stream().filter(l -> l.daysOverdue() > 0 && l.daysOverdue() <= 30)
            .mapToDouble(ReportLoan::outstanding).sum();
        double d31_90 = loans.stream().filter(l -> l.daysOverdue() > 30 && l.daysOverdue() <= 90)
            .mapToDouble(ReportLoan::outstanding).sum();
        double npl = loans.stream().filter(l -> l.daysOverdue() > 90)
            .mapToDouble(ReportLoan::outstanding).sum();

        // 3. Coverage и CAR
        double coverageRatio = npl > 0 ? totalProvisions / npl * 100 : 0;
        double car = totalOutstanding > 0 ? bankCapital / totalOutstanding * 100 : 0;

        // Вывод отчёта
        System.out.println("\\u2554\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2557");
        System.out.println("\\u2551  ОТЧЁТ ДЛЯ НАЦИОНАЛЬНОГО БАНКА РК               \\u2551");
        System.out.println("\\u2551  Forte Bank | Дата: 2026-04-07                   \\u2551");
        System.out.println("\\u255A\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u2550\\u255D");

        System.out.println("\\n1. КРЕДИТНЫЙ ПОРТФЕЛЬ ПО КАТЕГОРИЯМ");
        System.out.println("\\u2500".repeat(41));
        System.out.printf("%-16s | %-16s | %-6s | %s%n",
            "Категория", "Остаток KZT", "Доля", "Ср.ставка");

        for (var entry : byCategory.entrySet()) {
            double pct = entry.getValue() / totalOutstanding * 100;
            System.out.printf("%-16s | %16.2f | %5.1f%% | %5.2f%%%n",
                entry.getKey(), entry.getValue(), pct, weightedRates.get(entry.getKey()));
        }
        System.out.printf("%-16s | %16.2f | %5.1f%% | %5.2f%%%n",
            "ИТОГО", totalOutstanding, 100.0, portfolioRate);

        System.out.println("\\n2. СТРУКТУРА ПРОСРОЧКИ");
        System.out.println("\\u2500".repeat(41));
        System.out.printf("%-14s | %-14s | %s%n", "Категория", "Сумма KZT", "Доля портфеля");
        System.out.printf("%-14s | %14.2f | %5.1f%%%n", "Текущие", current, current / totalOutstanding * 100);
        System.out.printf("%-14s | %14.2f | %5.1f%%%n", "1-30 дней", d1_30, d1_30 / totalOutstanding * 100);
        System.out.printf("%-14s | %14.2f | %5.1f%%%n", "31-90 дней", d31_90, d31_90 / totalOutstanding * 100);
        System.out.printf("%-14s | %14.2f | %5.1f%%%n", "90+ дней (NPL)", npl, npl / totalOutstanding * 100);

        System.out.println("\\n3. ПРОВИЗИИ И ПОКРЫТИЕ");
        System.out.println("\\u2500".repeat(41));
        System.out.printf("Общий объём провизий: %.2f KZT%n", totalProvisions);
        System.out.printf("NPL (90+ дней):       %.2f KZT%n", npl);
        System.out.printf("Coverage Ratio:       %.1f%%    [НОРМА: >=100%%]%n", coverageRatio);

        System.out.println("\\n4. ДОСТАТОЧНОСТЬ КАПИТАЛА");
        System.out.println("\\u2500".repeat(41));
        System.out.printf("Собственный капитал:  %.2f KZT%n", bankCapital);
        System.out.printf("Рисковые активы:      %.2f KZT%n", totalOutstanding);
        String carStatus = car >= 10 ? "\\u2713" : "\\u2717 НАРУШЕНИЕ";
        System.out.printf("CAR (k1):             %.1f%%     [НОРМА: >=10%%] %s%n", car, carStatus);

        boolean compliant = car >= 10 && coverageRatio >= 100;
        System.out.printf("\\nСтатус: %s%n",
            compliant ? "СООТВЕТСТВУЕТ НОРМАТИВАМ НБ РК"
                      : "ВНИМАНИЕ: НАРУШЕНИЕ НОРМАТИВОВ НБ РК");
    }

    public static void main(String[] args) {
        var loans = List.of(
            // Потребительские
            new ReportLoan("Потребительский", 5_000_000, 500_000, 24.0, 0),
            new ReportLoan("Потребительский", 3_000_000, 300_000, 22.0, 15),
            new ReportLoan("Потребительский", 2_000_000, 800_000, 24.0, 95),
            new ReportLoan("Потребительский", 2_500_000, 250_000, 23.0, 0),
            // Ипотека
            new ReportLoan("Ипотека", 15_000_000, 300_000, 16.0, 0),
            new ReportLoan("Ипотека", 7_000_000, 700_000, 14.0, 0),
            new ReportLoan("Ипотека", 3_000_000, 1_200_000, 17.0, 120),
            // Авто
            new ReportLoan("Авто", 4_500_000, 450_000, 18.0, 0),
            new ReportLoan("Авто", 3_000_000, 600_000, 20.0, 60),
            // МСБ
            new ReportLoan("МСБ", 3_000_000, 300_000, 28.0, 45),
            new ReportLoan("МСБ", 2_000_000, 800_000, 24.0, 0)
        );

        double bankCapital = 8_000_000;
        generateReport(loans, bankCapital);
    }
}`,
      explanation: 'Регуляторная отчётность — обязательное требование НБ РК для всех банков. CAR (Capital Adequacy Ratio / коэффициент достаточности капитала) k1 ≥ 10% — ключевой норматив. Coverage Ratio показывает покрытие NPL провизиями. В Forte Bank эти отчёты генерируются автоматически и отправляются через систему ЕСБП (единая система банковской подотчётности). Нарушение нормативов грозит санкциями НБ РК вплоть до отзыва лицензии.'
    }
  ]
}
