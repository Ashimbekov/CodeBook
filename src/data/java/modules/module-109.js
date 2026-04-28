export default {
  id: 109,
  title: 'Реальная разработка: Телеком и биллинг',
  description: 'Задачи Java-разработчика в телекоме: тарифные планы, биллинг, CDR-обработка, баланс, роуминг, бонусы и абонентский учёт.',
  lessons: [
    {
      id: 1,
      title: 'Tariff Plans: Тарифные планы',
      type: 'practice',
      difficulty: 'easy',
      description: 'Команда Product, спринт "Каталог тарифов". Jira TEL-101: Реализовать модель тарифных планов (prepaid/postpaid) для каталога абонентских предложений Kcell. Поля: название, абонентская плата, минуты, SMS, трафик в ГБ, допуслуги. Сравнение тарифов и рекомендация на основе паттерна использования абонента.',
      requirements: [
        'Создать класс TariffPlan с полями: name, type (PREPAID/POSTPAID), monthlyFee (KZT), minutes, sms, dataGB, extras (List<String>)',
        'Enum TariffType: PREPAID, POSTPAID',
        'Метод comparePlans(TariffPlan a, TariffPlan b) — вывести сравнительную таблицу двух тарифов',
        'Метод recommendPlan(int avgMinutes, int avgSms, double avgDataGB, List<TariffPlan> plans) — подобрать оптимальный тариф по паттерну использования',
        'Критерий: тариф покрывает все потребности с минимальной ценой',
        'Создать 3-4 тарифа (аналоги реальных: "Всё включено", "Интернет MAX", "Базовый", "Безлимит")'
      ],
      expectedOutput: `=== Каталог тарифов ===
Всё включено [POSTPAID] — 5990 KZT/мес | 500 мин | 500 SMS | 15.0 GB
Интернет MAX [PREPAID] — 3990 KZT/мес | 100 мин | 100 SMS | 30.0 GB
Базовый [PREPAID] — 1990 KZT/мес | 200 мин | 200 SMS | 5.0 GB
Безлимит [POSTPAID] — 8990 KZT/мес | 9999 мин | 9999 SMS | 50.0 GB

=== Сравнение тарифов ===
Параметр        | Всё включено     | Интернет MAX
Тип             | POSTPAID         | PREPAID
Цена            | 5990 KZT        | 3990 KZT
Минуты          | 500              | 100
SMS             | 500              | 100
Интернет        | 15.0 GB          | 30.0 GB

=== Рекомендация тарифа ===
Паттерн: 150 мин, 50 SMS, 8.0 GB
Рекомендован: Всё включено — 5990 KZT/мес`,
      hint: 'Для рекомендации отфильтруй тарифы, которые покрывают потребности (minutes >= avgMinutes и т.д.), затем отсортируй по цене и верни самый дешёвый. Если ни один не подходит — предложи самый большой.',
      solution: `import java.util.*;

public class Main {
    enum TariffType { PREPAID, POSTPAID }

    static String[] planNames;
    static TariffType[] planTypes;
    static int[] monthlyFees;
    static int[] planMinutes;
    static int[] planSms;
    static double[] planDataGB;
    static String[][] planExtras;
    static int planCount = 0;

    static void addPlan(String name, TariffType type, int fee, int min, int sms, double data, String[] extras) {
        planNames[planCount] = name;
        planTypes[planCount] = type;
        monthlyFees[planCount] = fee;
        planMinutes[planCount] = min;
        planSms[planCount] = sms;
        planDataGB[planCount] = data;
        planExtras[planCount] = extras;
        planCount++;
    }

    static void printCatalog() {
        System.out.println("=== Каталог тарифов ===");
        for (int i = 0; i < planCount; i++) {
            System.out.printf("%s [%s] — %d KZT/мес | %d мин | %d SMS | %.1f GB%n",
                planNames[i], planTypes[i], monthlyFees[i], planMinutes[i], planSms[i], planDataGB[i]);
        }
    }

    static void comparePlans(int a, int b) {
        System.out.println("\\n=== Сравнение тарифов ===");
        System.out.printf("%-16s| %-17s| %s%n", "Параметр", planNames[a], planNames[b]);
        System.out.printf("%-16s| %-17s| %s%n", "Тип", planTypes[a], planTypes[b]);
        System.out.printf("%-16s| %-17s| %s%n", "Цена", monthlyFees[a] + " KZT", monthlyFees[b] + " KZT");
        System.out.printf("%-16s| %-17s| %s%n", "Минуты", planMinutes[a], planMinutes[b]);
        System.out.printf("%-16s| %-17s| %s%n", "SMS", planSms[a], planSms[b]);
        System.out.printf("%-16s| %-17s| %s%n", "Интернет", planDataGB[a] + " GB", planDataGB[b] + " GB");
    }

    static void recommendPlan(int avgMin, int avgSms, double avgData) {
        System.out.println("\\n=== Рекомендация тарифа ===");
        System.out.printf("Паттерн: %d мин, %d SMS, %.1f GB%n", avgMin, avgSms, avgData);

        int bestIdx = -1;
        int bestPrice = Integer.MAX_VALUE;

        for (int i = 0; i < planCount; i++) {
            if (planMinutes[i] >= avgMin && planSms[i] >= avgSms && planDataGB[i] >= avgData) {
                if (monthlyFees[i] < bestPrice) {
                    bestPrice = monthlyFees[i];
                    bestIdx = i;
                }
            }
        }

        if (bestIdx == -1) {
            bestIdx = 0;
            for (int i = 1; i < planCount; i++) {
                if (monthlyFees[i] > monthlyFees[bestIdx]) bestIdx = i;
            }
        }

        System.out.printf("Рекомендован: %s — %d KZT/мес%n", planNames[bestIdx], monthlyFees[bestIdx]);
    }

    public static void main(String[] args) {
        planNames = new String[10];
        planTypes = new TariffType[10];
        monthlyFees = new int[10];
        planMinutes = new int[10];
        planSms = new int[10];
        planDataGB = new double[10];
        planExtras = new String[10][];

        addPlan("Всё включено", TariffType.POSTPAID, 5990, 500, 500, 15.0,
            new String[]{"Caller ID", "Ожидание вызова"});
        addPlan("Интернет MAX", TariffType.PREPAID, 3990, 100, 100, 30.0,
            new String[]{"Безлимит YouTube"});
        addPlan("Базовый", TariffType.PREPAID, 1990, 200, 200, 5.0,
            new String[]{});
        addPlan("Безлимит", TariffType.POSTPAID, 8990, 9999, 9999, 50.0,
            new String[]{"Caller ID", "Роуминг CIS"});

        printCatalog();
        comparePlans(0, 1);
        recommendPlan(150, 50, 8.0);
    }
}`,
      explanation: 'Каталог тарифов — основа любой телеком-системы. Оператор (Kcell, Beeline KZ) предлагает линейку тарифов с разными параметрами. Prepaid — предоплата, postpaid — абонентская плата. Рекомендательная логика фильтрует тарифы, покрывающие потребности абонента, и выбирает минимальный по цене.'
    },
    {
      id: 2,
      title: 'Balance Management: Управление балансом',
      type: 'practice',
      difficulty: 'easy',
      description: 'Команда Billing, спринт "Баланс абонента". Jira TEL-102: Реализовать систему управления балансом prepaid-абонента Beeline KZ. Пополнение, списание за звонки/SMS/данные, история транзакций, оповещение при низком балансе (<500 KZT), автоблокировка при нуле.',
      requirements: [
        'Переменная balance (double) — текущий баланс в KZT',
        'Метод topUp(double amount) — пополнение баланса',
        'Метод charge(String type, double amount) — списание (CALL/SMS/DATA), возвращает успех',
        'Массив транзакций (тип, сумма, остаток, время)',
        'При балансе < 500 KZT — вывести предупреждение "Низкий баланс!"',
        'При балансе <= 0 — блокировка, отказ в услугах',
        'Метод printStatement() — вывести выписку по счёту'
      ],
      expectedOutput: `=== Баланс абонента +7 701 123 4567 ===
Пополнение: +2000.0 KZT | Баланс: 2000.0 KZT
Звонок 5 мин: -200.0 KZT | Баланс: 1800.0 KZT
SMS: -50.0 KZT | Баланс: 1750.0 KZT
Интернет 100MB: -300.0 KZT | Баланс: 1450.0 KZT
Звонок 20 мин: -800.0 KZT | Баланс: 650.0 KZT
Звонок 10 мин: -400.0 KZT | Баланс: 250.0 KZT
⚠ Низкий баланс! Пополните счёт.
Звонок 15 мин: ОТКАЗАНО — недостаточно средств
Пополнение: +1000.0 KZT | Баланс: 1250.0 KZT

=== Выписка по счёту ===
1. TOP_UP        | +2000.0 KZT | Остаток: 2000.0 KZT
2. CALL          | -200.0 KZT  | Остаток: 1800.0 KZT
3. SMS           | -50.0 KZT   | Остаток: 1750.0 KZT
4. DATA          | -300.0 KZT  | Остаток: 1450.0 KZT
5. CALL          | -800.0 KZT  | Остаток: 650.0 KZT
6. CALL          | -400.0 KZT  | Остаток: 250.0 KZT
7. TOP_UP        | +1000.0 KZT | Остаток: 1250.0 KZT
Текущий баланс: 1250.0 KZT`,
      hint: 'Храни транзакции в массиве строк. При каждом списании проверяй: если баланс после списания < 0 — отказ, если < 500 — предупреждение. Пополнение снимает блокировку.',
      solution: `public class Main {
    static double balance = 0;
    static String[] txTypes = new String[50];
    static double[] txAmounts = new double[50];
    static double[] txBalances = new double[50];
    static int txCount = 0;
    static boolean blocked = false;

    static void addTx(String type, double amount) {
        txTypes[txCount] = type;
        txAmounts[txCount] = amount;
        txBalances[txCount] = balance;
        txCount++;
    }

    static void topUp(double amount) {
        balance += amount;
        blocked = false;
        addTx("TOP_UP", amount);
        System.out.printf("Пополнение: +%.1f KZT | Баланс: %.1f KZT%n", amount, balance);
    }

    static boolean charge(String desc, String type, double amount) {
        if (blocked || balance < amount) {
            System.out.printf("%s: ОТКАЗАНО — недостаточно средств%n", desc);
            return false;
        }
        balance -= amount;
        addTx(type, -amount);
        System.out.printf("%s: -%.1f KZT | Баланс: %.1f KZT%n", desc, amount, balance);
        if (balance < 500) {
            System.out.println("⚠ Низкий баланс! Пополните счёт.");
            if (balance <= 0) blocked = true;
        }
        return true;
    }

    static void printStatement() {
        System.out.println("\\n=== Выписка по счёту ===");
        for (int i = 0; i < txCount; i++) {
            String sign = txAmounts[i] >= 0 ? "+" : "";
            System.out.printf("%d. %-13s | %s%.1f KZT | Остаток: %.1f KZT%n",
                i + 1, txTypes[i], sign, txAmounts[i], txBalances[i]);
        }
        System.out.printf("Текущий баланс: %.1f KZT%n", balance);
    }

    public static void main(String[] args) {
        System.out.println("=== Баланс абонента +7 701 123 4567 ===");

        topUp(2000);
        charge("Звонок 5 мин", "CALL", 200);
        charge("SMS", "SMS", 50);
        charge("Интернет 100MB", "DATA", 300);
        charge("Звонок 20 мин", "CALL", 800);
        charge("Звонок 10 мин", "CALL", 400);
        charge("Звонок 15 мин", "CALL", 600);
        topUp(1000);

        printStatement();
    }
}`,
      explanation: 'Prepaid-баланс — ядро биллинга в телекоме. Каждая транзакция (звонок, SMS, интернет) списывает средства в реальном времени. При исчерпании баланса оператор (Beeline KZ, Kcell) блокирует исходящие услуги. Порог 500 KZT — типичный для казахстанских операторов уровень предупреждения.'
    },
    {
      id: 3,
      title: 'CDR Processing: Обработка звонков',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Billing, спринт "CDR-конвейер". Jira TEL-201: Реализовать обработку Call Detail Records (CDR) — записей о звонках. Каждый CDR содержит номера, время, длительность, тип. Рассчитать стоимость по тарифу с учётом внутрисетевых и внесетевых вызовов (Kcell→Kcell дешевле, чем Kcell→Beeline).',
      requirements: [
        'Класс CDR: callerNumber, calledNumber, startTime, durationSec, type (VOICE/SMS/DATA)',
        'Внутрисетевой звонок (оба номера +7 700...): 10 KZT/мин',
        'Внесетевой звонок: 25 KZT/мин',
        'SMS внутрисеть: 15 KZT, внесеть: 30 KZT',
        'DATA: 5 KZT/MB',
        'Метод processCDR() — рассчитать стоимость одного CDR',
        'Обработать пакет CDR и вывести суммарный отчёт',
        'Определение сети по префиксу: +7 700, +7 708 — Kcell; +7 705, +7 771 — Beeline; +7 707, +7 747 — Tele2'
      ],
      expectedOutput: `=== Обработка CDR ===
CDR-1: VOICE +7 700 111 1111 → +7 700 222 2222 | 180 сек | Внутрисеть | 30.0 KZT
CDR-2: VOICE +7 700 111 1111 → +7 705 333 3333 | 300 сек | Внесеть   | 125.0 KZT
CDR-3: SMS   +7 700 111 1111 → +7 708 444 4444 | Внутрисеть | 15.0 KZT
CDR-4: SMS   +7 700 111 1111 → +7 707 555 5555 | Внесеть   | 30.0 KZT
CDR-5: DATA  +7 700 111 1111 | 250 MB | 1250.0 KZT

=== Итого по абоненту +7 700 111 1111 ===
Звонки: 2 шт, 480 сек, 155.0 KZT
SMS:    2 шт, 45.0 KZT
Данные: 250 MB, 1250.0 KZT
ИТОГО: 1450.0 KZT`,
      hint: 'Определи оператора по первым 6 символам номера (+7 700 = Kcell). Для VOICE: округляй до минут вверх (180 сек = 3 мин, 200 сек = 4 мин). Для DATA durationSec используется как объём в MB.',
      solution: `public class Main {
    static String[] cdrTypes = new String[20];
    static String[] callers = new String[20];
    static String[] calleds = new String[20];
    static int[] durations = new int[20];
    static double[] costs = new double[20];
    static boolean[] inNetwork = new boolean[20];
    static int cdrCount = 0;

    static String getOperator(String number) {
        String prefix = number.substring(0, 6).replace(" ", "");
        if (prefix.equals("+7700") || prefix.equals("+7708")) return "Kcell";
        if (prefix.equals("+7705") || prefix.equals("+7771")) return "Beeline";
        if (prefix.equals("+7707") || prefix.equals("+7747")) return "Tele2";
        return "Other";
    }

    static boolean isSameNetwork(String num1, String num2) {
        return getOperator(num1).equals(getOperator(num2));
    }

    static double processCDR(String type, String caller, String called, int duration) {
        cdrTypes[cdrCount] = type;
        callers[cdrCount] = caller;
        calleds[cdrCount] = called;
        durations[cdrCount] = duration;

        double cost = 0;
        boolean sameNet = false;

        switch (type) {
            case "VOICE":
                sameNet = isSameNetwork(caller, called);
                int minutes = (duration + 59) / 60;
                cost = sameNet ? minutes * 10.0 : minutes * 25.0;
                inNetwork[cdrCount] = sameNet;
                System.out.printf("CDR-%d: VOICE %s → %s | %d сек | %s | %.1f KZT%n",
                    cdrCount + 1, caller, called, duration,
                    sameNet ? "Внутрисеть" : "Внесеть  ", cost);
                break;
            case "SMS":
                sameNet = isSameNetwork(caller, called);
                cost = sameNet ? 15.0 : 30.0;
                inNetwork[cdrCount] = sameNet;
                System.out.printf("CDR-%d: SMS   %s → %s | %s | %.1f KZT%n",
                    cdrCount + 1, caller, called,
                    sameNet ? "Внутрисеть" : "Внесеть  ", cost);
                break;
            case "DATA":
                cost = duration * 5.0;
                System.out.printf("CDR-%d: DATA  %s | %d MB | %.1f KZT%n",
                    cdrCount + 1, caller, duration, cost);
                break;
        }

        costs[cdrCount] = cost;
        cdrCount++;
        return cost;
    }

    static void printSummary(String subscriber) {
        System.out.printf("\\n=== Итого по абоненту %s ===\\n", subscriber);
        int voiceCount = 0, voiceSec = 0, smsCount = 0, dataMB = 0;
        double voiceCost = 0, smsCost = 0, dataCost = 0;

        for (int i = 0; i < cdrCount; i++) {
            switch (cdrTypes[i]) {
                case "VOICE": voiceCount++; voiceSec += durations[i]; voiceCost += costs[i]; break;
                case "SMS": smsCount++; smsCost += costs[i]; break;
                case "DATA": dataMB += durations[i]; dataCost += costs[i]; break;
            }
        }

        System.out.printf("Звонки: %d шт, %d сек, %.1f KZT%n", voiceCount, voiceSec, voiceCost);
        System.out.printf("SMS:    %d шт, %.1f KZT%n", smsCount, smsCost);
        System.out.printf("Данные: %d MB, %.1f KZT%n", dataMB, dataCost);
        System.out.printf("ИТОГО: %.1f KZT%n", voiceCost + smsCost + dataCost);
    }

    public static void main(String[] args) {
        System.out.println("=== Обработка CDR ===");

        processCDR("VOICE", "+7 700 111 1111", "+7 700 222 2222", 180);
        processCDR("VOICE", "+7 700 111 1111", "+7 705 333 3333", 300);
        processCDR("SMS",   "+7 700 111 1111", "+7 708 444 4444", 0);
        processCDR("SMS",   "+7 700 111 1111", "+7 707 555 5555", 0);
        processCDR("DATA",  "+7 700 111 1111", "", 250);

        printSummary("+7 700 111 1111");
    }
}`,
      explanation: 'CDR (Call Detail Record) — основной источник данных для биллинга. Каждый звонок, SMS, сессия данных генерирует CDR. Система обрабатывает миллионы CDR в сутки. Различие внутрисетевых/внесетевых тарифов — стандартная практика (Kcell→Kcell дешевле, чем Kcell→Beeline). Оператор определяется по DEF-коду (префиксу номера).'
    },
    {
      id: 4,
      title: 'Data Usage Tracker: Трекинг трафика',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Product, спринт "Контроль трафика". Jira TEL-202: Реализовать трекинг мобильного интернета абонента Altel. Тариф содержит лимит (например, 20 GB). Категоризация трафика: соцсети, видео, общий. При превышении лимита — снижение скорости до 128 Кбит/с. Возможность докупить пакет трафика.',
      requirements: [
        'Тарифный лимит трафика (например, 20 GB)',
        'Учёт трафика по категориям: SOCIAL, VIDEO, GENERAL',
        'Метод useData(String category, double amountMB) — использовать трафик',
        'При исчерпании лимита — вывести "Скорость снижена до 128 Кбит/с"',
        'Метод buyDataPack(double sizeGB, int priceKZT) — докупить пакет',
        'Метод printUsageReport() — отчёт по использованию с разбивкой по категориям',
        'Прогресс-бар использования: [████████░░] 80%'
      ],
      expectedOutput: `=== Трекинг трафика — Altel ===
Тариф: Интернет 20 GB

Использование: SOCIAL 2048.0 MB (2.0 GB)
Использование: VIDEO 5120.0 MB (5.0 GB)
Использование: GENERAL 3072.0 MB (3.0 GB)
Использование: VIDEO 8192.0 MB (8.0 GB)
Использование: SOCIAL 2560.0 MB (2.5 GB)
⚠ Осталось менее 10% трафика!
Использование: GENERAL 512.0 MB (0.5 GB)
⛔ Лимит исчерпан! Скорость снижена до 128 Кбит/с.

Докупка пакета: 5.0 GB за 1500 KZT
✓ Скорость восстановлена.

=== Отчёт по трафику ===
Лимит: 25.0 GB (20.0 + 5.0 докуп.)
Использовано: 21504.0 MB (21.0 GB)
Осталось: 4096.0 MB (4.0 GB)
[████████████████████░░░░░] 84%

По категориям:
  SOCIAL:  4608.0 MB (4.5 GB) — 21.4%
  VIDEO:   13312.0 MB (13.0 GB) — 61.9%
  GENERAL: 3584.0 MB (3.5 GB) — 16.7%`,
      hint: 'Храни использование в массивах по категориям. Лимит — сумма базового пакета и докупок. Прогресс-бар: кол-во символов █ = (used / limit * 25). При превышении 90% — предупреждение.',
      solution: `public class Main {
    static double limitMB = 20 * 1024.0;
    static double extraMB = 0;
    static double[] categoryUsage = new double[3]; // SOCIAL, VIDEO, GENERAL
    static String[] categoryNames = {"SOCIAL", "VIDEO", "GENERAL"};
    static double totalUsed = 0;
    static boolean throttled = false;

    static int catIndex(String cat) {
        for (int i = 0; i < categoryNames.length; i++)
            if (categoryNames[i].equals(cat)) return i;
        return 2;
    }

    static void useData(String category, double amountMB) {
        double totalLimit = limitMB + extraMB;

        if (throttled) {
            System.out.printf("⛔ Скорость 128 Кбит/с. Докупите пакет.%n");
            return;
        }

        totalUsed += amountMB;
        categoryUsage[catIndex(category)] += amountMB;
        System.out.printf("Использование: %s %.1f MB (%.1f GB)%n",
            category, amountMB, amountMB / 1024.0);

        if (totalUsed >= totalLimit) {
            System.out.println("⛔ Лимит исчерпан! Скорость снижена до 128 Кбит/с.");
            throttled = true;
        } else if (totalUsed >= totalLimit * 0.9) {
            System.out.println("⚠ Осталось менее 10% трафика!");
        }
    }

    static void buyDataPack(double sizeGB, int priceKZT) {
        extraMB += sizeGB * 1024;
        System.out.printf("\\nДокупка пакета: %.1f GB за %d KZT%n", sizeGB, priceKZT);
        if (throttled && totalUsed < limitMB + extraMB) {
            throttled = false;
            System.out.println("✓ Скорость восстановлена.");
        }
    }

    static void printUsageReport() {
        double totalLimit = limitMB + extraMB;
        double remaining = totalLimit - totalUsed;
        double percent = (totalUsed / totalLimit) * 100;

        System.out.println("\\n=== Отчёт по трафику ===");
        if (extraMB > 0) {
            System.out.printf("Лимит: %.1f GB (%.1f + %.1f докуп.)%n",
                totalLimit / 1024, limitMB / 1024, extraMB / 1024);
        } else {
            System.out.printf("Лимит: %.1f GB%n", totalLimit / 1024);
        }
        System.out.printf("Использовано: %.1f MB (%.1f GB)%n", totalUsed, totalUsed / 1024);
        System.out.printf("Осталось: %.1f MB (%.1f GB)%n", remaining, remaining / 1024);

        int barLen = 25;
        int filled = (int)(percent / 100 * barLen);
        StringBuilder bar = new StringBuilder("[");
        for (int i = 0; i < barLen; i++) bar.append(i < filled ? "█" : "░");
        bar.append("]");
        System.out.printf("%s %d%%%n", bar, (int) percent);

        System.out.println("\\nПо категориям:");
        for (int i = 0; i < categoryNames.length; i++) {
            double pct = totalUsed > 0 ? (categoryUsage[i] / totalUsed * 100) : 0;
            System.out.printf("  %-8s %.1f MB (%.1f GB) — %.1f%%%n",
                categoryNames[i] + ":", categoryUsage[i], categoryUsage[i] / 1024, pct);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Трекинг трафика — Altel ===");
        System.out.println("Тариф: Интернет 20 GB\\n");

        useData("SOCIAL", 2048);
        useData("VIDEO", 5120);
        useData("GENERAL", 3072);
        useData("VIDEO", 8192);
        useData("SOCIAL", 2560);
        useData("GENERAL", 512);

        buyDataPack(5.0, 1500);

        printUsageReport();
    }
}`,
      explanation: 'Трекинг трафика — критичная функция для телеком-оператора. Абонент Altel/Tele2 имеет лимит по тарифу. После превышения скорость снижается (throttling) до 128 Кбит/с — стандартная практика казахстанских операторов. Категоризация трафика нужна для аналитики и zero-rating (бесплатные соцсети). Докупка пакетов — источник дохода.'
    },
    {
      id: 5,
      title: 'Roaming Calculator: Роуминг',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Product, спринт "Роуминг". Jira TEL-203: Реализовать калькулятор роуминга для абонентов Kcell. Зонирование стран, тарификация звонков/SMS/данных в роуминге. Предложение роуминг-пакетов. Оценка стоимости поездки по паттерну использования.',
      requirements: [
        'Зоны роуминга: ZONE_1 (СНГ: Россия, Узбекистан, Кыргызстан) — 50 KZT/мин, ZONE_2 (Европа: Турция, Германия, Франция) — 200 KZT/мин, ZONE_3 (прочие: США, ОАЭ, Китай) — 500 KZT/мин',
        'SMS: ZONE_1 — 30 KZT, ZONE_2 — 80 KZT, ZONE_3 — 150 KZT',
        'Данные: ZONE_1 — 500 KZT/MB, ZONE_2 — 1500 KZT/MB, ZONE_3 — 2000 KZT/MB',
        'Метод calculateRoamingCost(String country, int minutes, int sms, double dataMB) — стоимость',
        'Роуминг-пакеты: "СНГ 7 дней" (100 мин + 500 MB = 5000 KZT), "Европа 7 дней" (50 мин + 200 MB = 15000 KZT)',
        'Метод estimateTripCost(String country, int days, int dailyMin, int dailySms, double dailyDataMB) — оценка поездки',
        'Сравнение стоимости без пакета vs с пакетом'
      ],
      expectedOutput: `=== Роуминг-калькулятор Kcell ===

--- Тарифы роуминга ---
ZONE_1 (СНГ):    50 KZT/мин | 30 KZT/SMS  | 500 KZT/MB
ZONE_2 (Европа): 200 KZT/мин | 80 KZT/SMS  | 1500 KZT/MB
ZONE_3 (Прочие): 500 KZT/мин | 150 KZT/SMS | 2000 KZT/MB

--- Расчёт: Турция, 30 мин, 10 SMS, 50.0 MB ---
Звонки: 30 × 200 = 6000 KZT
SMS:    10 × 80 = 800 KZT
Данные: 50.0 × 1500 = 75000 KZT
Итого без пакета: 81800 KZT

--- Оценка поездки: Турция, 7 дней ---
Ежедневно: 10 мин, 5 SMS, 20.0 MB
Без пакета: 7 дней × 14400 KZT/день = 100800 KZT
С пакетом "Европа 7 дней" (15000 KZT):
  Покрыто: 50 мин, 200.0 MB
  Сверх пакета: 20 мин × 200 + 0 SMS + 0.0 MB
  Итого с пакетом: 21800 KZT
Экономия: 79000 KZT (78%)`,
      hint: 'Создай Map<String, Integer> для маппинга страна→зона. Для оценки поездки: рассчитай суммарное использование за N дней, вычти включённое в пакет, остаток тарифицируй по роуминговым ставкам.',
      solution: `public class Main {
    static String[] countries = {"Россия","Узбекистан","Кыргызстан","Турция","Германия","Франция","США","ОАЭ","Китай"};
    static int[] countryZones = {1, 1, 1, 2, 2, 2, 3, 3, 3};

    static int[] voiceRates = {0, 50, 200, 500};
    static int[] smsRates =   {0, 30, 80, 150};
    static int[] dataRates =  {0, 500, 1500, 2000};

    static int getZone(String country) {
        for (int i = 0; i < countries.length; i++)
            if (countries[i].equals(country)) return countryZones[i];
        return 3;
    }

    static String zoneName(int zone) {
        return switch (zone) { case 1 -> "СНГ"; case 2 -> "Европа"; default -> "Прочие"; };
    }

    static long calculateRoamingCost(String country, int minutes, int sms, double dataMB) {
        int z = getZone(country);
        long voiceCost = (long) minutes * voiceRates[z];
        long smsCost = (long) sms * smsRates[z];
        long dataCost = (long)(dataMB * dataRates[z]);
        System.out.printf("--- Расчёт: %s, %d мин, %d SMS, %.1f MB ---%n", country, minutes, sms, dataMB);
        System.out.printf("Звонки: %d × %d = %d KZT%n", minutes, voiceRates[z], voiceCost);
        System.out.printf("SMS:    %d × %d = %d KZT%n", sms, smsRates[z], smsCost);
        System.out.printf("Данные: %.1f × %d = %d KZT%n", dataMB, dataRates[z], dataCost);
        long total = voiceCost + smsCost + dataCost;
        System.out.printf("Итого без пакета: %d KZT%n", total);
        return total;
    }

    static void estimateTripCost(String country, int days, int dailyMin, int dailySms, double dailyDataMB) {
        int z = getZone(country);
        int totalMin = dailyMin * days;
        int totalSms = dailySms * days;
        double totalData = dailyDataMB * days;

        long dailyCost = (long) dailyMin * voiceRates[z] + (long) dailySms * smsRates[z]
                        + (long)(dailyDataMB * dataRates[z]);
        long noPkgTotal = dailyCost * days;

        System.out.printf("\\n--- Оценка поездки: %s, %d дней ---%n", country, days);
        System.out.printf("Ежедневно: %d мин, %d SMS, %.1f MB%n", dailyMin, dailySms, dailyDataMB);
        System.out.printf("Без пакета: %d дней × %d KZT/день = %d KZT%n", days, dailyCost, noPkgTotal);

        String pkgName = z <= 2 ? (z == 1 ? "СНГ 7 дней" : "Европа 7 дней") : "";
        int pkgPrice = z == 1 ? 5000 : 15000;
        int pkgMin = z == 1 ? 100 : 50;
        double pkgData = z == 1 ? 500 : 200;

        if (!pkgName.isEmpty()) {
            int extraMin = Math.max(0, totalMin - pkgMin);
            double extraData = Math.max(0, totalData - pkgData);
            long extraCost = (long) extraMin * voiceRates[z] + (long)(extraData * dataRates[z]);
            long withPkg = pkgPrice + extraCost + (long) totalSms * smsRates[z];

            System.out.printf("С пакетом \"%s\" (%d KZT):%n", pkgName, pkgPrice);
            System.out.printf("  Покрыто: %d мин, %.1f MB%n", pkgMin, pkgData);
            System.out.printf("  Сверх пакета: %d мин × %d + %d SMS + %.1f MB%n",
                extraMin, voiceRates[z], totalSms, extraData);
            System.out.printf("  Итого с пакетом: %d KZT%n", withPkg);
            long saved = noPkgTotal - withPkg;
            System.out.printf("Экономия: %d KZT (%d%%)%n", saved, saved * 100 / noPkgTotal);
        }
    }

    static void printRates() {
        System.out.println("--- Тарифы роуминга ---");
        for (int z = 1; z <= 3; z++) {
            System.out.printf("ZONE_%d (%-6s): %d KZT/мин | %d KZT/SMS  | %d KZT/MB%n",
                z, zoneName(z), voiceRates[z], smsRates[z], dataRates[z]);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Роуминг-калькулятор Kcell ===\\n");
        printRates();
        System.out.println();
        calculateRoamingCost("Турция", 30, 10, 50.0);
        estimateTripCost("Турция", 7, 10, 5, 20.0);
    }
}`,
      explanation: 'Роуминг — высокомаржинальная услуга телеком-оператора. Зонирование стран (СНГ, Европа, прочие) определяет стоимость. Данные в роуминге — самая дорогая позиция. Роуминг-пакеты значительно снижают стоимость и стимулируют использование. Калькулятор помогает абоненту Kcell оценить расходы до поездки.'
    },
    {
      id: 6,
      title: 'Number Portability: Перенос номера (MNP)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда CRM, спринт "MNP-процесс". Jira TEL-204: Реализовать процесс переноса мобильного номера (Mobile Number Portability) между операторами. Валидация: отсутствие задолженности, нет активного контракта, соблюдение 90-дневного кулдауна. Статусы: REQUEST → DONOR_APPROVAL → TECHNICAL_PORT → ACTIVATED.',
      requirements: [
        'Данные абонента: phoneNumber, currentOperator, targetOperator, balance, contractEndDate, lastMnpDate',
        'Валидация: баланс >= 0 (нет долга), контракт истёк, прошло >= 90 дней с последнего MNP',
        'Статусы MNP: REQUEST, VALIDATION, DONOR_APPROVAL, TECHNICAL_PORT, ACTIVATED, REJECTED',
        'Метод validateMNP() — проверить все условия, вернуть список ошибок',
        'Метод processMNP() — пошагово провести через все стадии',
        'Вывод лога процесса с временными метками',
        'Обработать 2-3 заявки: успешная, с долгом, с кулдауном'
      ],
      expectedOutput: `=== MNP — Перенос номера ===

--- Заявка #1: +7 705 111 2233 (Beeline → Kcell) ---
[Шаг 1] REQUEST: Заявка принята
[Шаг 2] VALIDATION: Проверка условий...
  ✓ Задолженность: нет (баланс 1500 KZT)
  ✓ Контракт: истёк
  ✓ Кулдаун 90 дней: соблюдён (последний MNP: 2025-06-01)
[Шаг 3] DONOR_APPROVAL: Запрос к Beeline — одобрено
[Шаг 4] TECHNICAL_PORT: Техническое переключение...
[Шаг 5] ACTIVATED: Номер +7 705 111 2233 теперь обслуживается Kcell
Статус: ACTIVATED ✓

--- Заявка #2: +7 707 444 5566 (Tele2 → Altel) ---
[Шаг 1] REQUEST: Заявка принята
[Шаг 2] VALIDATION: Проверка условий...
  ✗ Задолженность: долг -2300 KZT
  ✗ Контракт: активен до 2026-12-01
Статус: REJECTED ✗ (не пройдена валидация)

--- Заявка #3: +7 700 777 8899 (Kcell → Beeline) ---
[Шаг 1] REQUEST: Заявка принята
[Шаг 2] VALIDATION: Проверка условий...
  ✓ Задолженность: нет (баланс 500 KZT)
  ✓ Контракт: истёк
  ✗ Кулдаун 90 дней: не соблюдён (последний MNP: 2026-03-01, осталось 53 дней)
Статус: REJECTED ✗ (не пройдена валидация)`,
      hint: 'Используй LocalDate для проверки дат (контракт, кулдаун). ChronoUnit.DAYS.between() для расчёта дней. Каждый шаг — изменение статуса с логированием.',
      solution: `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Main {
    static void processMNP(int reqNum, String phone, String fromOp, String toOp,
                           double balance, String contractEnd, String lastMnp) {
        System.out.printf("--- Заявка #%d: %s (%s → %s) ---%n", reqNum, phone, fromOp, toOp);

        LocalDate today = LocalDate.of(2026, 4, 7);
        LocalDate contractDate = contractEnd != null ? LocalDate.parse(contractEnd) : LocalDate.of(2020, 1, 1);
        LocalDate mnpDate = lastMnp != null ? LocalDate.parse(lastMnp) : LocalDate.of(2020, 1, 1);

        System.out.println("[Шаг 1] REQUEST: Заявка принята");
        System.out.println("[Шаг 2] VALIDATION: Проверка условий...");

        boolean valid = true;

        if (balance >= 0) {
            System.out.printf("  ✓ Задолженность: нет (баланс %.0f KZT)%n", balance);
        } else {
            System.out.printf("  ✗ Задолженность: долг %.0f KZT%n", balance);
            valid = false;
        }

        if (!contractDate.isAfter(today)) {
            System.out.println("  ✓ Контракт: истёк");
        } else {
            System.out.printf("  ✗ Контракт: активен до %s%n", contractEnd);
            valid = false;
        }

        long daysSinceMnp = ChronoUnit.DAYS.between(mnpDate, today);
        if (daysSinceMnp >= 90) {
            System.out.printf("  ✓ Кулдаун 90 дней: соблюдён (последний MNP: %s)%n", lastMnp);
        } else {
            long remaining = 90 - daysSinceMnp;
            System.out.printf("  ✗ Кулдаун 90 дней: не соблюдён (последний MNP: %s, осталось %d дней)%n",
                lastMnp, remaining);
            valid = false;
        }

        if (!valid) {
            System.out.println("Статус: REJECTED ✗ (не пройдена валидация)");
            System.out.println();
            return;
        }

        System.out.printf("[Шаг 3] DONOR_APPROVAL: Запрос к %s — одобрено%n", fromOp);
        System.out.println("[Шаг 4] TECHNICAL_PORT: Техническое переключение...");
        System.out.printf("[Шаг 5] ACTIVATED: Номер %s теперь обслуживается %s%n", phone, toOp);
        System.out.println("Статус: ACTIVATED ✓");
        System.out.println();
    }

    public static void main(String[] args) {
        System.out.println("=== MNP — Перенос номера ===\\n");

        processMNP(1, "+7 705 111 2233", "Beeline", "Kcell",
            1500, "2025-12-01", "2025-06-01");

        processMNP(2, "+7 707 444 5566", "Tele2", "Altel",
            -2300, "2026-12-01", "2025-01-15");

        processMNP(3, "+7 700 777 8899", "Kcell", "Beeline",
            500, "2025-08-01", "2026-03-01");
    }
}`,
      explanation: 'MNP (Mobile Number Portability) — регуляторное требование, позволяющее абоненту сменить оператора (например, с Beeline на Kcell) с сохранением номера. В Казахстане MNP регулируется Министерством цифрового развития. 90-дневный кулдаун предотвращает злоупотребления. Процесс включает согласование с оператором-донором и техническое переключение в сети.'
    },
    {
      id: 7,
      title: 'Bonus Program: Бонусная программа',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда CRM, спринт "Лояльность". Jira TEL-205: Реализовать бонусную программу лояльности для абонентов Beeline KZ. Начисление баллов (1 KZT = 1 балл). Уровни: BRONZE, SILVER, GOLD. Бенефиты: бонусные минуты, данные, скидки. Сгорание баллов через 12 месяцев.',
      requirements: [
        'Уровни: BRONZE (0-4999 баллов), SILVER (5000-19999), GOLD (20000+)',
        'Начисление: 1 KZT расходов = 1 балл',
        'GOLD: +100 бонус мин, +2 GB, скидка 10%; SILVER: +50 мин, +1 GB, скидка 5%; BRONZE: без бонусов',
        'Метод earnPoints(int spentKZT, String month) — начислить баллы',
        'Метод checkTier() — определить текущий уровень и бенефиты',
        'Метод expirePoints() — сгорание баллов старше 12 месяцев',
        'Метод printLoyaltyCard() — карта лояльности абонента',
        'Хранить историю начислений по месяцам для сгорания'
      ],
      expectedOutput: `=== Бонусная программа Beeline KZ ===
Абонент: +7 771 222 3344

Начисление: 3500 баллов (март 2025) | Всего: 3500 | Уровень: BRONZE
Начисление: 4200 баллов (июнь 2025) | Всего: 7700 | Уровень: SILVER ↑
Начисление: 5800 баллов (сентябрь 2025) | Всего: 13500 | Уровень: SILVER
Начисление: 8000 баллов (декабрь 2025) | Всего: 21500 | Уровень: GOLD ↑
Начисление: 2000 баллов (март 2026) | Всего: 23500 | Уровень: GOLD

Сгорание баллов старше 12 месяцев...
Сгорело: 3500 баллов (март 2025)
Остаток: 20000 баллов | Уровень: GOLD

=== Карта лояльности ===
Абонент: +7 771 222 3344
Уровень: ★★★ GOLD
Баллы: 20000
Бенефиты:
  +100 бонусных минут
  +2.0 GB трафика
  Скидка 10% на абонентскую плату
Прогресс: [████████████████████████████████████] GOLD достигнут!`,
      hint: 'Храни начисления в массиве с месяцем. При сгорании проверяй разницу между текущей датой и месяцем начисления. Уровень пересчитывается после каждого начисления и сгорания.',
      solution: `public class Main {
    static int[] earnedPoints = new int[50];
    static String[] earnedMonths = new String[50];
    static int earnCount = 0;
    static int totalPoints = 0;
    static String phone = "+7 771 222 3344";

    static String getTier(int points) {
        if (points >= 20000) return "GOLD";
        if (points >= 5000) return "SILVER";
        return "BRONZE";
    }

    static void earnPoints(int spent, String month) {
        String oldTier = getTier(totalPoints);
        earnedPoints[earnCount] = spent;
        earnedMonths[earnCount] = month;
        earnCount++;
        totalPoints += spent;
        String newTier = getTier(totalPoints);
        String arrow = !newTier.equals(oldTier) ? " ↑" : "";
        System.out.printf("Начисление: %d баллов (%s) | Всего: %d | Уровень: %s%s%n",
            spent, month, totalPoints, newTier, arrow);
    }

    static void expirePoints(String currentMonth, int currentYear) {
        System.out.println("\\nСгорание баллов старше 12 месяцев...");
        String[] monthNames = {"январь","февраль","март","апрель","май","июнь",
            "июль","август","сентябрь","октябрь","ноябрь","декабрь"};

        int curMonthIdx = 0;
        for (int i = 0; i < monthNames.length; i++)
            if (monthNames[i].equals(currentMonth)) { curMonthIdx = i; break; }
        int curTotal = currentYear * 12 + curMonthIdx;

        for (int i = 0; i < earnCount; i++) {
            if (earnedPoints[i] == 0) continue;
            String[] parts = earnedMonths[i].split(" ");
            String mon = parts[0];
            int yr = Integer.parseInt(parts[1]);
            int mIdx = 0;
            for (int j = 0; j < monthNames.length; j++)
                if (monthNames[j].equals(mon)) { mIdx = j; break; }
            int earnTotal = yr * 12 + mIdx;

            if (curTotal - earnTotal >= 12) {
                System.out.printf("Сгорело: %d баллов (%s)%n", earnedPoints[i], earnedMonths[i]);
                totalPoints -= earnedPoints[i];
                earnedPoints[i] = 0;
            }
        }
        System.out.printf("Остаток: %d баллов | Уровень: %s%n", totalPoints, getTier(totalPoints));
    }

    static void printLoyaltyCard() {
        String tier = getTier(totalPoints);
        String stars = switch (tier) {
            case "GOLD" -> "★★★ GOLD";
            case "SILVER" -> "★★ SILVER";
            default -> "★ BRONZE";
        };

        System.out.println("\\n=== Карта лояльности ===");
        System.out.printf("Абонент: %s%n", phone);
        System.out.printf("Уровень: %s%n", stars);
        System.out.printf("Баллы: %d%n", totalPoints);
        System.out.println("Бенефиты:");

        switch (tier) {
            case "GOLD":
                System.out.println("  +100 бонусных минут");
                System.out.println("  +2.0 GB трафика");
                System.out.println("  Скидка 10% на абонентскую плату");
                break;
            case "SILVER":
                System.out.println("  +50 бонусных минут");
                System.out.println("  +1.0 GB трафика");
                System.out.println("  Скидка 5% на абонентскую плату");
                break;
            default:
                System.out.println("  Нет бонусов. Накопите 5000 баллов для SILVER.");
        }

        int barLen = 35;
        if (tier.equals("GOLD")) {
            StringBuilder bar = new StringBuilder("[");
            for (int i = 0; i < barLen; i++) bar.append("█");
            bar.append("]");
            System.out.printf("Прогресс: %s GOLD достигнут!%n", bar);
        } else {
            int target = tier.equals("SILVER") ? 20000 : 5000;
            int filled = (int)((double) totalPoints / target * barLen);
            StringBuilder bar = new StringBuilder("[");
            for (int i = 0; i < barLen; i++) bar.append(i < filled ? "█" : "░");
            bar.append("]");
            String next = tier.equals("SILVER") ? "GOLD" : "SILVER";
            System.out.printf("Прогресс: %s до %s (%d/%d)%n", bar, next, totalPoints, target);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Бонусная программа Beeline KZ ===");
        System.out.printf("Абонент: %s%n%n", phone);

        earnPoints(3500, "март 2025");
        earnPoints(4200, "июнь 2025");
        earnPoints(5800, "сентябрь 2025");
        earnPoints(8000, "декабрь 2025");
        earnPoints(2000, "март 2026");

        expirePoints("апрель", 2026);

        printLoyaltyCard();
    }
}`,
      explanation: 'Программы лояльности — инструмент удержания абонентов. Beeline KZ, Kcell используют бонусные баллы для снижения оттока (churn). Уровневая система (BRONZE/SILVER/GOLD) мотивирует увеличивать расходы. Сгорание баллов через 12 месяцев — стандартная практика, предотвращающая неограниченное накопление обязательств.'
    },
    {
      id: 8,
      title: 'Invoice Generation: Выставление счёта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Billing, спринт "Счета postpaid". Jira TEL-206: Реализовать генерацию ежемесячного счёта для postpaid-абонента Tele2. Позиции: абонентская плата, сверхлимитные минуты, данные, роуминг, доп. услуги (Caller ID и пр.). НДС 12%. Срок оплаты. Форматированный текстовый счёт.',
      requirements: [
        'Данные абонента: ФИО, номер, тариф, период',
        'Позиции счёта: абонентская плата, сверх лимита (минуты × ставка), сверх лимита (данные × ставка), роуминг, допуслуги',
        'НДС 12% на все позиции',
        'Срок оплаты: 20 число следующего месяца',
        'Метод addLineItem(String description, double amount) — добавить позицию',
        'Метод generateInvoice() — сформировать текстовый счёт',
        'Форматирование: выровненные столбцы, разделители, итоги'
      ],
      expectedOutput: `╔══════════════════════════════════════════════════╗
║           СЧЁТ ЗА УСЛУГИ СВЯЗИ — Tele2           ║
╠══════════════════════════════════════════════════╣
║ Абонент: Касымов Арман Бекович                   ║
║ Номер:   +7 707 999 8877                         ║
║ Тариф:   Всё включено L                          ║
║ Период:  01.03.2026 — 31.03.2026                 ║
║ Счёт №:  INV-2026-03-001                         ║
╠══════════════════════════════════════════════════╣
║ Описание                          Сумма (KZT)    ║
╠══════════════════════════════════════════════════╣
║ Абонентская плата                      7990.00   ║
║ Сверх лимита: 45 мин × 40 KZT         1800.00   ║
║ Сверх лимита: 3.5 GB × 800 KZT        2800.00   ║
║ Роуминг (Турция, 2 дня)               4500.00   ║
║ Caller ID                              390.00   ║
║ Антиспам                               290.00   ║
╠══════════════════════════════════════════════════╣
║ Подитого:                             17770.00   ║
║ НДС (12%):                             2132.40   ║
╠══════════════════════════════════════════════════╣
║ ИТОГО К ОПЛАТЕ:                       19902.40   ║
╠══════════════════════════════════════════════════╣
║ Срок оплаты: 20.04.2026                         ║
║ Оплата: Kaspi, банковский перевод, касса Tele2   ║
╚══════════════════════════════════════════════════╝`,
      hint: 'Храни позиции в массиве. Подитого — сумма всех позиций. НДС = подитого × 0.12. Итого = подитого + НДС. Для рамки используй символы ╔╗╚╝║═╠╣.',
      solution: `public class Main {
    static String[] itemDescs = new String[20];
    static double[] itemAmounts = new double[20];
    static int itemCount = 0;

    static void addLineItem(String desc, double amount) {
        itemDescs[itemCount] = desc;
        itemAmounts[itemCount] = amount;
        itemCount++;
    }

    static void generateInvoice(String name, String phone, String tariff,
                                 String periodStart, String periodEnd,
                                 String invoiceNum, String dueDate) {
        int w = 50;
        String border = "═".repeat(w);

        System.out.println("╔" + border + "╗");
        printCenter("СЧЁТ ЗА УСЛУГИ СВЯЗИ — Tele2", w);
        System.out.println("╠" + border + "╣");
        printLeft("Абонент: " + name, w);
        printLeft("Номер:   " + phone, w);
        printLeft("Тариф:   " + tariff, w);
        printLeft("Период:  " + periodStart + " — " + periodEnd, w);
        printLeft("Счёт №:  " + invoiceNum, w);
        System.out.println("╠" + border + "╣");
        printRow("Описание", "Сумма (KZT)", w);
        System.out.println("╠" + border + "╣");

        double subtotal = 0;
        for (int i = 0; i < itemCount; i++) {
            printRow(itemDescs[i], String.format("%.2f", itemAmounts[i]), w);
            subtotal += itemAmounts[i];
        }

        double vat = subtotal * 0.12;
        double total = subtotal + vat;

        System.out.println("╠" + border + "╣");
        printRow("Подитого:", String.format("%.2f", subtotal), w);
        printRow("НДС (12%):", String.format("%.2f", vat), w);
        System.out.println("╠" + border + "╣");
        printRow("ИТОГО К ОПЛАТЕ:", String.format("%.2f", total), w);
        System.out.println("╠" + border + "╣");
        printLeft("Срок оплаты: " + dueDate, w);
        printLeft("Оплата: Kaspi, банковский перевод, касса Tele2", w);
        System.out.println("╚" + border + "╝");
    }

    static void printCenter(String text, int w) {
        int pad = (w - text.length()) / 2;
        String line = " ".repeat(Math.max(pad, 1)) + text;
        System.out.printf("║%-" + w + "s║%n", line);
    }

    static void printLeft(String text, int w) {
        System.out.printf("║ %-" + (w - 1) + "s║%n", text);
    }

    static void printRow(String desc, String amount, int w) {
        int amountWidth = 14;
        int descWidth = w - amountWidth - 2;
        System.out.printf("║ %-" + descWidth + "s%" + amountWidth + "s ║%n", desc, amount);
    }

    public static void main(String[] args) {
        addLineItem("Абонентская плата", 7990.00);
        addLineItem("Сверх лимита: 45 мин × 40 KZT", 1800.00);
        addLineItem("Сверх лимита: 3.5 GB × 800 KZT", 2800.00);
        addLineItem("Роуминг (Турция, 2 дня)", 4500.00);
        addLineItem("Caller ID", 390.00);
        addLineItem("Антиспам", 290.00);

        generateInvoice(
            "Касымов Арман Бекович",
            "+7 707 999 8877",
            "Всё включено L",
            "01.03.2026", "31.03.2026",
            "INV-2026-03-001",
            "20.04.2026"
        );
    }
}`,
      explanation: 'Счёт (invoice) — основной финансовый документ для postpaid-абонентов. Tele2, Kcell ежемесячно формируют счета с детализацией: абонплата, сверхлимитное использование, роуминг, допуслуги. НДС 12% — ставка в Казахстане. Срок оплаты обычно 15-20 число следующего месяца. Оплата через Kaspi — самый популярный способ в РК.'
    },
    {
      id: 9,
      title: 'Churn Prediction: Прогноз оттока',
      type: 'practice',
      difficulty: 'hard',
      description: 'Команда Analytics, спринт "Антиотток". Jira TEL-301: Реализовать скоринг риска оттока (churn) абонентов Kcell. Факторы: снижение использования, обращения в поддержку, просрочки оплаты, понижение тарифа, использование предложений конкурентов. Оценка 0-100. Рекомендации по удержанию.',
      requirements: [
        'Данные абонента: номер, тариф, стаж (месяцев), история использования за 3 месяца',
        'Факторы оттока: usageDecline (снижение трафика), supportCalls (обращения в поддержку), overduePayments (просрочки), planDowngrade (понижение тарифа), competitorOffers (использование предложений конкурентов)',
        'Каждый фактор вносит вклад в скор: usageDecline (0-25), supportCalls (0-20), overdue (0-20), downgrade (0-15), competitor (0-20)',
        'Итоговый скор 0-100. Категории: LOW (0-30), MEDIUM (31-60), HIGH (61-80), CRITICAL (81-100)',
        'Рекомендации: LOW — стандарт, MEDIUM — ретеншн-предложение, HIGH — персональный звонок, CRITICAL — VIP-апгрейд',
        'Обработать 4-5 абонентов и вывести dashboard'
      ],
      expectedOutput: `=== Churn Prediction Dashboard — Kcell ===

Абонент: +7 700 100 2001 | Тариф: Базовый | Стаж: 8 мес
  Снижение трафика:    -45% → 18 баллов
  Обращения в поддержку: 5 → 15 баллов
  Просрочки оплаты:    2 → 12 баллов
  Понижение тарифа:    да → 15 баллов
  Предложения конкурента: нет → 0 баллов
  СКОР ОТТОКА: 60 / 100 — MEDIUM
  Рекомендация: Ретеншн-предложение (скидка 20% на 3 мес)

Абонент: +7 700 200 3002 | Тариф: Всё включено | Стаж: 36 мес
  Снижение трафика:    -10% → 4 баллов
  Обращения в поддержку: 0 → 0 баллов
  Просрочки оплаты:    0 → 0 баллов
  Понижение тарифа:    нет → 0 баллов
  Предложения конкурента: нет → 0 баллов
  СКОР ОТТОКА: 4 / 100 — LOW
  Рекомендация: Стандартное обслуживание

Абонент: +7 700 300 4003 | Тариф: Интернет MAX | Стаж: 14 мес
  Снижение трафика:    -70% → 25 баллов
  Обращения в поддержку: 8 → 20 баллов
  Просрочки оплаты:    3 → 18 баллов
  Понижение тарифа:    да → 15 баллов
  Предложения конкурента: да → 20 баллов
  СКОР ОТТОКА: 98 / 100 — CRITICAL
  Рекомендация: VIP-апгрейд + персональный менеджер

Абонент: +7 700 400 5004 | Тариф: Безлимит | Стаж: 24 мес
  Снижение трафика:    -30% → 12 баллов
  Обращения в поддержку: 3 → 9 баллов
  Просрочки оплаты:    1 → 6 баллов
  Понижение тарифа:    нет → 0 баллов
  Предложения конкурента: да → 20 баллов
  СКОР ОТТОКА: 47 / 100 — MEDIUM
  Рекомендация: Ретеншн-предложение (скидка 20% на 3 мес)

=== Сводка ===
Всего абонентов: 4
LOW: 1 | MEDIUM: 2 | HIGH: 0 | CRITICAL: 1
Средний скор: 52
Требуют внимания (HIGH+CRITICAL): 1`,
      hint: 'Рассчитай каждый фактор линейно: usageDecline: score = min(25, abs(decline%) * 0.4). supportCalls: score = min(20, calls * 3). overdue: score = min(20, count * 6). Категории определи if-else по порогам.',
      solution: `public class Main {
    static int scoreUsageDecline(int declinePercent) {
        return Math.min(25, (int)(Math.abs(declinePercent) * 0.4));
    }

    static int scoreSupportCalls(int calls) {
        return Math.min(20, calls * 3);
    }

    static int scoreOverdue(int count) {
        return Math.min(20, count * 6);
    }

    static int scoreDowngrade(boolean downgraded) {
        return downgraded ? 15 : 0;
    }

    static int scoreCompetitor(boolean usedOffer) {
        return usedOffer ? 20 : 0;
    }

    static String getCategory(int score) {
        if (score >= 81) return "CRITICAL";
        if (score >= 61) return "HIGH";
        if (score >= 31) return "MEDIUM";
        return "LOW";
    }

    static String getRecommendation(String category) {
        return switch (category) {
            case "CRITICAL" -> "VIP-апгрейд + персональный менеджер";
            case "HIGH" -> "Персональный звонок + индивидуальное предложение";
            case "MEDIUM" -> "Ретеншн-предложение (скидка 20% на 3 мес)";
            default -> "Стандартное обслуживание";
        };
    }

    static int processSubscriber(String phone, String tariff, int tenure,
                                  int usageDecline, int supportCalls,
                                  int overduePayments, boolean downgrade,
                                  boolean competitor) {
        int s1 = scoreUsageDecline(usageDecline);
        int s2 = scoreSupportCalls(supportCalls);
        int s3 = scoreOverdue(overduePayments);
        int s4 = scoreDowngrade(downgrade);
        int s5 = scoreCompetitor(competitor);
        int total = Math.min(100, s1 + s2 + s3 + s4 + s5);
        String cat = getCategory(total);

        System.out.printf("Абонент: %s | Тариф: %s | Стаж: %d мес%n", phone, tariff, tenure);
        System.out.printf("  Снижение трафика:    %d%% → %d баллов%n", usageDecline, s1);
        System.out.printf("  Обращения в поддержку: %d → %d баллов%n", supportCalls, s2);
        System.out.printf("  Просрочки оплаты:    %d → %d баллов%n", overduePayments, s3);
        System.out.printf("  Понижение тарифа:    %s → %d баллов%n", downgrade ? "да" : "нет", s4);
        System.out.printf("  Предложения конкурента: %s → %d баллов%n", competitor ? "да" : "нет", s5);
        System.out.printf("  СКОР ОТТОКА: %d / 100 — %s%n", total, cat);
        System.out.printf("  Рекомендация: %s%n%n", getRecommendation(cat));

        return total;
    }

    public static void main(String[] args) {
        System.out.println("=== Churn Prediction Dashboard — Kcell ===\\n");

        int[] scores = new int[4];
        scores[0] = processSubscriber("+7 700 100 2001", "Базовый", 8,
            -45, 5, 2, true, false);
        scores[1] = processSubscriber("+7 700 200 3002", "Всё включено", 36,
            -10, 0, 0, false, false);
        scores[2] = processSubscriber("+7 700 300 4003", "Интернет MAX", 14,
            -70, 8, 3, true, true);
        scores[3] = processSubscriber("+7 700 400 5004", "Безлимит", 24,
            -30, 3, 1, false, true);

        int low = 0, med = 0, high = 0, crit = 0, sum = 0;
        for (int s : scores) {
            sum += s;
            String cat = getCategory(s);
            switch (cat) {
                case "LOW": low++; break;
                case "MEDIUM": med++; break;
                case "HIGH": high++; break;
                case "CRITICAL": crit++; break;
            }
        }

        System.out.println("=== Сводка ===");
        System.out.printf("Всего абонентов: %d%n", scores.length);
        System.out.printf("LOW: %d | MEDIUM: %d | HIGH: %d | CRITICAL: %d%n", low, med, high, crit);
        System.out.printf("Средний скор: %d%n", sum / scores.length);
        System.out.printf("Требуют внимания (HIGH+CRITICAL): %d%n", high + crit);
    }
}`,
      explanation: 'Churn prediction — ключевая задача аналитики в телекоме. Казахстанские операторы (Kcell, Beeline KZ) теряют 15-25% абонентов ежегодно. Скоринговая модель анализирует поведенческие паттерны: снижение использования, жалобы, просрочки. Раннее выявление позволяет применить ретеншн-меры: скидки, апгрейды, персональные предложения. Стоимость удержания абонента в 5-7 раз ниже привлечения нового.'
    },
    {
      id: 10,
      title: 'Network Capacity: Планирование ёмкости',
      type: 'practice',
      difficulty: 'hard',
      description: 'Команда Network, спринт "Планирование сети". Jira TEL-302: Реализовать анализ нагрузки базовых станций (cell tower) сети Altel. Количество абонентов на вышку, пиковое использование, пропускная способность. Идентификация перегруженных вышек (>80%). Рекомендации: новая вышка, апгрейд, балансировка нагрузки. Отчёт по планированию ёмкости.',
      requirements: [
        'Данные вышки: id, location, maxCapacity (абонентов), currentLoad, peakHourLoad, dataThrough putMbps, maxThroughputMbps',
        'Метод analyzeLoad(tower) — рассчитать загрузку в % (currentLoad/maxCapacity)',
        'Перегрузка: >80% — WARNING, >95% — CRITICAL',
        'Рекомендации: CRITICAL — новая вышка, WARNING — апгрейд оборудования, 60-80% — балансировка, <60% — норма',
        'Метод findOverloaded() — найти все перегруженные вышки',
        'Метод generateCapacityReport() — сводный отчёт по сети',
        'Обработать 6-8 вышек в разных районах Алматы/Астаны'
      ],
      expectedOutput: `=== Планирование ёмкости сети — Altel ===

--- Анализ базовых станций ---
BTS-001 | Алматы, Достык     | Загрузка: 450/500  (90%) ⚠ WARNING
BTS-002 | Алматы, Абая       | Загрузка: 380/400  (95%) ⛔ CRITICAL
BTS-003 | Алматы, Сатпаева   | Загрузка: 200/500  (40%) ✓ НОРМА
BTS-004 | Астана, Кенесары    | Загрузка: 480/500  (96%) ⛔ CRITICAL
BTS-005 | Астана, Мангилик    | Загрузка: 350/500  (70%) ~ БАЛАНСИРОВКА
BTS-006 | Астана, Сыганак     | Загрузка: 150/500  (30%) ✓ НОРМА
BTS-007 | Алматы, Розыбакиева | Загрузка: 420/500  (84%) ⚠ WARNING
BTS-008 | Астана, Бейбитшилик | Загрузка: 290/400  (72%) ~ БАЛАНСИРОВКА

--- Перегруженные вышки ---
⛔ BTS-002: Алматы, Абая — 95%. Рекомендация: НОВАЯ ВЫШКА в радиусе 500м
⛔ BTS-004: Астана, Кенесары — 96%. Рекомендация: НОВАЯ ВЫШКА в радиусе 500м
⚠ BTS-001: Алматы, Достык — 90%. Рекомендация: АПГРЕЙД оборудования (4G→5G)
⚠ BTS-007: Алматы, Розыбакиева — 84%. Рекомендация: АПГРЕЙД оборудования (4G→5G)

--- Пропускная способность ---
BTS-001 | 850/1000 Mbps  (85%) ⚠
BTS-002 | 380/400 Mbps   (95%) ⛔
BTS-003 | 300/1000 Mbps  (30%) ✓
BTS-004 | 950/1000 Mbps  (95%) ⛔
BTS-005 | 600/1000 Mbps  (60%) ✓
BTS-006 | 200/1000 Mbps  (20%) ✓
BTS-007 | 750/1000 Mbps  (75%) ~
BTS-008 | 280/400 Mbps   (70%) ~

=== Сводный отчёт ===
Всего вышек: 8
CRITICAL: 2 | WARNING: 2 | БАЛАНСИРОВКА: 2 | НОРМА: 2
Средняя загрузка: 72%
Средняя пропускная способность: 63%
Требуется инвестиция: 2 новых вышки, 2 апгрейда
Оценка бюджета: 2 × 45 000 000 + 2 × 15 000 000 = 120 000 000 KZT`,
      hint: 'Храни данные вышек в параллельных массивах. Загрузка = (currentLoad * 100) / maxCapacity. Для бюджета: новая вышка ~45 млн KZT, апгрейд ~15 млн KZT. Балансировка — перенаправление абонентов на соседние менее загруженные вышки.',
      solution: `public class Main {
    static String[] towerIds = {"BTS-001","BTS-002","BTS-003","BTS-004","BTS-005","BTS-006","BTS-007","BTS-008"};
    static String[] locations = {"Алматы, Достык","Алматы, Абая","Алматы, Сатпаева","Астана, Кенесары",
        "Астана, Мангилик","Астана, Сыганак","Алматы, Розыбакиева","Астана, Бейбитшилик"};
    static int[] maxCapacity =   {500, 400, 500, 500, 500, 500, 500, 400};
    static int[] currentLoad =   {450, 380, 200, 480, 350, 150, 420, 290};
    static int[] dataThroughput = {850, 380, 300, 950, 600, 200, 750, 280};
    static int[] maxThroughput =  {1000, 400, 1000, 1000, 1000, 1000, 1000, 400};
    static int count = 8;

    static int loadPercent(int idx) {
        return currentLoad[idx] * 100 / maxCapacity[idx];
    }

    static int throughputPercent(int idx) {
        return dataThroughput[idx] * 100 / maxThroughput[idx];
    }

    static String statusIcon(int pct) {
        if (pct >= 95) return "⛔ CRITICAL";
        if (pct >= 80) return "⚠ WARNING";
        if (pct >= 60) return "~ БАЛАНСИРОВКА";
        return "✓ НОРМА";
    }

    static String shortIcon(int pct) {
        if (pct >= 95) return "⛔";
        if (pct >= 80) return "⚠";
        if (pct >= 60) return "~";
        return "✓";
    }

    static void analyzeAll() {
        System.out.println("--- Анализ базовых станций ---");
        for (int i = 0; i < count; i++) {
            int pct = loadPercent(i);
            System.out.printf("%-7s | %-21s | Загрузка: %d/%-4d (%d%%) %s%n",
                towerIds[i], locations[i], currentLoad[i], maxCapacity[i], pct, statusIcon(pct));
        }
    }

    static void findOverloaded() {
        System.out.println("\\n--- Перегруженные вышки ---");
        for (int i = 0; i < count; i++) {
            int pct = loadPercent(i);
            if (pct >= 95) {
                System.out.printf("⛔ %s: %s — %d%%. Рекомендация: НОВАЯ ВЫШКА в радиусе 500м%n",
                    towerIds[i], locations[i], pct);
            }
        }
        for (int i = 0; i < count; i++) {
            int pct = loadPercent(i);
            if (pct >= 80 && pct < 95) {
                System.out.printf("⚠ %s: %s — %d%%. Рекомендация: АПГРЕЙД оборудования (4G→5G)%n",
                    towerIds[i], locations[i], pct);
            }
        }
    }

    static void analyzeThroughput() {
        System.out.println("\\n--- Пропускная способность ---");
        for (int i = 0; i < count; i++) {
            int pct = throughputPercent(i);
            System.out.printf("%-7s | %d/%-4d Mbps  (%d%%) %s%n",
                towerIds[i], dataThroughput[i], maxThroughput[i], pct, shortIcon(pct));
        }
    }

    static void generateReport() {
        int critical = 0, warning = 0, balance = 0, normal = 0;
        int loadSum = 0, tpSum = 0;

        for (int i = 0; i < count; i++) {
            int pct = loadPercent(i);
            loadSum += pct;
            tpSum += throughputPercent(i);
            if (pct >= 95) critical++;
            else if (pct >= 80) warning++;
            else if (pct >= 60) balance++;
            else normal++;
        }

        System.out.println("\\n=== Сводный отчёт ===");
        System.out.printf("Всего вышек: %d%n", count);
        System.out.printf("CRITICAL: %d | WARNING: %d | БАЛАНСИРОВКА: %d | НОРМА: %d%n",
            critical, warning, balance, normal);
        System.out.printf("Средняя загрузка: %d%%%n", loadSum / count);
        System.out.printf("Средняя пропускная способность: %d%%%n", tpSum / count);
        System.out.printf("Требуется инвестиция: %d новых вышки, %d апгрейда%n", critical, warning);

        long newTowerCost = 45_000_000L;
        long upgradeCost = 15_000_000L;
        long totalBudget = critical * newTowerCost + warning * upgradeCost;
        System.out.printf("Оценка бюджета: %d × 45 000 000 + %d × 15 000 000 = %,d KZT%n",
            critical, warning, totalBudget);
    }

    public static void main(String[] args) {
        System.out.println("=== Планирование ёмкости сети — Altel ===\\n");

        analyzeAll();
        findOverloaded();
        analyzeThroughput();
        generateReport();
    }
}`,
      explanation: 'Планирование ёмкости — задача сетевых инженеров. Базовые станции (BTS) имеют ограниченную ёмкость по числу абонентов и пропускной способности. В Алматы и Астане вышки в центре перегружены (ТРЦ, бизнес-центры). Altel/Tele2 инвестируют в новые вышки (~45 млн KZT) или апгрейд (4G→5G, ~15 млн KZT). Балансировка нагрузки перенаправляет абонентов на менее загруженные соседние вышки.'
    }
  ]
};
