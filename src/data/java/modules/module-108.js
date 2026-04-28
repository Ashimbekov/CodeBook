export default {
  id: 108,
  title: 'Реальная разработка: Страхование',
  description: 'Задачи Java-разработчика в страховой компании: полисы, расчёт премий, страховые случаи, выплаты, риски и актуарные расчёты.',
  lessons: [
    {
      id: 1,
      title: 'Policy Creation: Оформление полиса',
      type: 'practice',
      difficulty: 'easy',
      description: 'Спринт: Underwriting Team. Задача из Jira: "INS-201: Реализовать создание страхового полиса с валидацией дат и генерацией номера". Клиент оформляет полис (ОСАГО, КАСКО, Life, Health) в Kaspi Страхование. Система должна принять данные страхователя, тип покрытия, суммы и сгенерировать уникальный номер полиса.',
      requirements: [
        'Класс Policy: String number, String type (OSAGO/KASKO/LIFE/HEALTH), String holderName, String iin, double coverageAmount, double premium, String startDate, String endDate',
        'Генерация номера в формате "POL-YYYY-XXXXXX" где YYYY — текущий год, XXXXXX — 6-значный порядковый номер',
        'Валидация: endDate должен быть позже startDate',
        'Валидация: coverageAmount > 0 и premium > 0',
        'Вывести полис со всеми полями'
      ],
      expectedOutput: '=== Kaspi Страхование: Оформление полиса ===\nПолис: POL-2024-000001\nТип: OSAGO\nСтрахователь: Ермеков Асхат\nИИН: 920415300123\nПокрытие: 5000000.0 KZT\nПремия: 42300.0 KZT\nНачало: 2024-01-15\nОкончание: 2025-01-15\nСтатус: ACTIVE\n\nПолис: POL-2024-000002\nТип: KASKO\nСтрахователь: Сериков Даулет\nИИН: 880920350456\nПокрытие: 12000000.0 KZT\nПремия: 480000.0 KZT\nНачало: 2024-03-01\nОкончание: 2025-03-01\nСтатус: ACTIVE\n\nОшибка: Дата окончания должна быть позже даты начала',
      hint: 'Используй LocalDate.parse() для парсинга дат и isBefore()/isAfter() для сравнения. Для генерации номера — static counter с String.format("%06d", counter).',
      solution: `import java.time.LocalDate;

public class Main {
    static int policyCounter = 0;

    static String generatePolicyNumber() {
        policyCounter++;
        return String.format("POL-%d-%06d", 2024, policyCounter);
    }

    static void createPolicy(String type, String holderName, String iin,
                             double coverageAmount, double premium,
                             String startDateStr, String endDateStr) {
        LocalDate startDate = LocalDate.parse(startDateStr);
        LocalDate endDate = LocalDate.parse(endDateStr);

        if (!endDate.isAfter(startDate)) {
            System.out.println("Ошибка: Дата окончания должна быть позже даты начала");
            return;
        }
        if (coverageAmount <= 0 || premium <= 0) {
            System.out.println("Ошибка: Сумма покрытия и премия должны быть > 0");
            return;
        }

        String number = generatePolicyNumber();
        System.out.println("Полис: " + number);
        System.out.println("Тип: " + type);
        System.out.println("Страхователь: " + holderName);
        System.out.println("ИИН: " + iin);
        System.out.println("Покрытие: " + coverageAmount + " KZT");
        System.out.println("Премия: " + premium + " KZT");
        System.out.println("Начало: " + startDate);
        System.out.println("Окончание: " + endDate);
        System.out.println("Статус: ACTIVE");
    }

    public static void main(String[] args) {
        System.out.println("=== Kaspi Страхование: Оформление полиса ===");

        createPolicy("OSAGO", "Ермеков Асхат", "920415300123",
            5_000_000, 42_300, "2024-01-15", "2025-01-15");

        System.out.println();
        createPolicy("KASKO", "Сериков Даулет", "880920350456",
            12_000_000, 480_000, "2024-03-01", "2025-03-01");

        System.out.println();
        createPolicy("OSAGO", "Тестов Тест", "900101000000",
            5_000_000, 42_300, "2025-01-15", "2024-01-15");
    }
}`,
      explanation: 'В страховых компаниях (Kaspi Страхование, Halyk Life) оформление полиса — ключевой бизнес-процесс. Номер полиса генерируется по корпоративному формату. Валидация дат критична — полис не может истечь до начала действия. В реальности используется UUID + последовательность из БД, данные хранятся в PostgreSQL, а полис проходит стадии: DRAFT → ACTIVE → EXPIRED.'
    },
    {
      id: 2,
      title: 'Premium Calculator: Расчёт премии ОСАГО',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Actuarial Team. Задача из Jira: "INS-215: Реализовать калькулятор премии ОСАГО с коэффициентами региона, возраста, мощности и КБМ". Freedom Insurance запускает онлайн-калькулятор. Страховая премия = базовый тариф * коэффициенты. Каждый коэффициент зависит от параметров водителя и авто.',
      requirements: [
        'Базовый тариф: 18 378 KZT (МРП-based)',
        'Коэффициент региона (Кт): Алматы 1.78, Астана 1.56, Шымкент 1.35, другие 1.0',
        'Коэффициент возраст/стаж (Квс): до 25 и стаж < 3 → 1.87, до 25 и стаж >= 3 → 1.66, старше 25 и стаж < 3 → 1.63, иначе 1.0',
        'Коэффициент мощности (Км): до 70 л.с. → 0.6, 71-100 → 1.0, 101-150 → 1.2, 151-200 → 1.4, свыше 200 → 1.6',
        'Коэффициент бонус-малус (КБМ): начальный 1.0, без аварий -5% в год (мин 0.5), авария +15% (макс 2.45)',
        'Вывести разбивку по каждому коэффициенту'
      ],
      expectedOutput: '=== Freedom Insurance: Калькулятор ОСАГО ===\n--- Расчёт для: Касымов Ержан ---\nРегион: Алматы\nВозраст: 32, Стаж: 10 лет\nМощность: 150 л.с.\nЛет без аварий: 3\n\nБазовый тариф: 18378 KZT\nКт (регион):    1.78\nКвс (возраст):  1.0\nКм (мощность):  1.2\nКБМ (бонус):    0.85\nИтого премия:   33344 KZT\n\n--- Расчёт для: Алиев Тимур ---\nРегион: Шымкент\nВозраст: 22, Стаж: 1 лет\nМощность: 249 л.с.\nЛет без аварий: 0\n\nБазовый тариф: 18378 KZT\nКт (регион):    1.35\nКвс (возраст):  1.87\nКм (мощность):  1.6\nКБМ (бонус):    1.0\nИтого премия:   74224 KZT',
      hint: 'Каждый коэффициент — отдельный метод. КБМ: Math.max(0.5, 1.0 - yearsNoAccident * 0.05). Итого = Math.round(base * Кт * Квс * Км * КБМ).',
      solution: `public class Main {
    static final double BASE_RATE = 18_378;

    static double regionCoeff(String region) {
        return switch (region) {
            case "Алматы" -> 1.78;
            case "Астана" -> 1.56;
            case "Шымкент" -> 1.35;
            default -> 1.0;
        };
    }

    static double ageExpCoeff(int age, int experience) {
        if (age <= 25 && experience < 3) return 1.87;
        if (age <= 25 && experience >= 3) return 1.66;
        if (age > 25 && experience < 3) return 1.63;
        return 1.0;
    }

    static double powerCoeff(int hp) {
        if (hp <= 70) return 0.6;
        if (hp <= 100) return 1.0;
        if (hp <= 150) return 1.2;
        if (hp <= 200) return 1.4;
        return 1.6;
    }

    static double bonusMalusCoeff(int yearsNoAccident) {
        double kbm = 1.0 - yearsNoAccident * 0.05;
        return Math.max(0.5, Math.min(2.45, kbm));
    }

    static void calculate(String name, String region, int age,
                          int experience, int hp, int yearsNoAccident) {
        double kt = regionCoeff(region);
        double kvs = ageExpCoeff(age, experience);
        double km = powerCoeff(hp);
        double kbm = bonusMalusCoeff(yearsNoAccident);
        long premium = Math.round(BASE_RATE * kt * kvs * km * kbm);

        System.out.println("--- Расчёт для: " + name + " ---");
        System.out.println("Регион: " + region);
        System.out.println("Возраст: " + age + ", Стаж: " + experience + " лет");
        System.out.println("Мощность: " + hp + " л.с.");
        System.out.println("Лет без аварий: " + yearsNoAccident);
        System.out.println();
        System.out.println("Базовый тариф: " + (int) BASE_RATE + " KZT");
        System.out.println("Кт (регион):    " + kt);
        System.out.println("Квс (возраст):  " + kvs);
        System.out.println("Км (мощность):  " + km);
        System.out.println("КБМ (бонус):    " + kbm);
        System.out.println("Итого премия:   " + premium + " KZT");
    }

    public static void main(String[] args) {
        System.out.println("=== Freedom Insurance: Калькулятор ОСАГО ===");
        calculate("Касымов Ержан", "Алматы", 32, 10, 150, 3);
        System.out.println();
        calculate("Алиев Тимур", "Шымкент", 22, 1, 249, 0);
    }
}`,
      explanation: 'ОСАГО — обязательное страхование автогражданской ответственности. Каждый коэффициент утверждается регулятором (в Казахстане — НБ РК). КБМ стимулирует безаварийную езду. В реальных системах (Freedom Insurance, Kaspi) коэффициенты хранятся в БД и обновляются по нормативным актам. Калькулятор — один из самых посещаемых разделов сайта.'
    },
    {
      id: 3,
      title: 'КАСКО Calculator: Расчёт КАСКО',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Product Team. Задача из Jira: "INS-230: Калькулятор КАСКО с франшизой и опциональными рисками". Halyk Life расширяет продуктовую линейку. КАСКО — добровольное страхование автомобиля. Базовая ставка зависит от стоимости и возраста авто. Франшиза (deductible) снижает премию. Дополнительные опции увеличивают покрытие.',
      requirements: [
        'Базовая ставка по возрасту авто: до 1 года — 3%, 1-3 года — 4%, 3-5 лет — 5%, 5-7 лет — 6.5%, старше 7 лет — 8%',
        'Франшиза: безусловная вычитаемая сумма. Если франшиза > 0, премия снижается: 50K → -5%, 100K → -10%, 200K → -15%',
        'Коэффициенты: гараж/паркинг -10%, сигнализация -5%, стаж < 3 лет +20%',
        'Опциональные риски: угон (+15% к премии), стихийные бедствия (+8%)',
        'Вывести детальный расчёт с разбивкой'
      ],
      expectedOutput: '=== Halyk Life: Калькулятор КАСКО ===\n--- Toyota Camry 70, 2021 ---\nСтоимость авто: 15000000 KZT\nВозраст авто: 3 лет\nБазовая ставка: 5.0%\nБазовая премия: 750000 KZT\nФраншиза 100000 KZT: -10.0%\nГараж: -10.0%\nСигнализация: -5.0%\nУгон: +15.0%\nИтого премия: 675000 KZT\n\n--- BMW X5, 2018 ---\nСтоимость авто: 22000000 KZT\nВозраст авто: 6 лет\nБазовая ставка: 6.5%\nБазовая премия: 1430000 KZT\nФраншиза 200000 KZT: -15.0%\nСтаж < 3: +20.0%\nСтихия: +8.0%\nИтого премия: 1615900 KZT',
      hint: 'Считай базовую премию = стоимость * ставка. Затем применяй каждый коэффициент как процент от базовой: totalMultiplier = 1.0 + сумма всех модификаторов. Итого = Math.round(base * totalMultiplier).',
      solution: `public class Main {
    static double baseRate(int carAge) {
        if (carAge < 1) return 0.03;
        if (carAge <= 3) return 0.04;
        if (carAge <= 5) return 0.05;
        if (carAge <= 7) return 0.065;
        return 0.08;
    }

    static double franchiseDiscount(long franchise) {
        if (franchise >= 200_000) return -0.15;
        if (franchise >= 100_000) return -0.10;
        if (franchise >= 50_000) return -0.05;
        return 0.0;
    }

    static void calculate(String car, int carAge, long carValue, long franchise,
                          boolean garage, boolean alarm, boolean lowExp,
                          boolean theft, boolean naturalDisaster) {
        double rate = baseRate(carAge);
        long basePremium = Math.round(carValue * rate);

        System.out.println("--- " + car + " ---");
        System.out.println("Стоимость авто: " + carValue + " KZT");
        System.out.println("Возраст авто: " + carAge + " лет");
        System.out.println("Базовая ставка: " + (rate * 100) + "%");
        System.out.println("Базовая премия: " + basePremium + " KZT");

        double modifier = 0.0;
        if (franchise > 0) {
            double fd = franchiseDiscount(franchise);
            modifier += fd;
            System.out.println("Франшиза " + franchise + " KZT: " + (fd * 100) + "%");
        }
        if (garage) { modifier -= 0.10; System.out.println("Гараж: -10.0%"); }
        if (alarm) { modifier -= 0.05; System.out.println("Сигнализация: -5.0%"); }
        if (lowExp) { modifier += 0.20; System.out.println("Стаж < 3: +20.0%"); }
        if (theft) { modifier += 0.15; System.out.println("Угон: +15.0%"); }
        if (naturalDisaster) { modifier += 0.08; System.out.println("Стихия: +8.0%"); }

        long totalPremium = Math.round(basePremium * (1.0 + modifier));
        System.out.println("Итого премия: " + totalPremium + " KZT");
    }

    public static void main(String[] args) {
        System.out.println("=== Halyk Life: Калькулятор КАСКО ===");
        calculate("Toyota Camry 70, 2021", 3, 15_000_000, 100_000,
            true, true, false, true, false);
        System.out.println();
        calculate("BMW X5, 2018", 6, 22_000_000, 200_000,
            false, false, true, false, true);
    }
}`,
      explanation: 'КАСКО — добровольное страхование, поэтому страховщик свободнее в ценообразовании. Франшиза — сумма, которую клиент платит сам при наступлении страхового случая. Чем выше франшиза — тем дешевле полис. В Halyk Life и Freedom Insurance расчёт идёт через онлайн-калькулятор, а коэффициенты настраиваются product-менеджерами через админку.'
    },
    {
      id: 4,
      title: 'Claim Processing: Обработка страхового случая',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Claims Team. Задача из Jira: "INS-248: Реализовать обработку страховых случаев с машиной состояний и валидацией покрытия". Клиент Kaspi Страхование подаёт заявку на выплату. Система проверяет активность полиса, соответствие типа покрытия инциденту, вычитает франшизу и проводит заявку через состояния.',
      requirements: [
        'Состояния заявки: FILED → UNDER_REVIEW → APPROVED/REJECTED → PAID',
        'Проверка: полис должен быть ACTIVE и не истёкший',
        'Проверка: тип инцидента соответствует типу полиса (ДТП → OSAGO/KASKO, Угон → KASKO, Болезнь → HEALTH)',
        'Расчёт выплаты: сумма ущерба - франшиза, но не более покрытия полиса',
        'Причины отказа: полис не активен, тип не покрывается, полис истёк'
      ],
      expectedOutput: '=== Kaspi Страхование: Обработка заявок ===\n--- Заявка CLM-001 ---\nПолис: POL-2024-000001 (KASKO, ACTIVE)\nИнцидент: ДТП\nУщерб: 850000 KZT\nФраншиза: 100000 KZT\nСтатус: FILED → UNDER_REVIEW → APPROVED\nВыплата: 750000 KZT\nСтатус: PAID\n\n--- Заявка CLM-002 ---\nПолис: POL-2024-000002 (OSAGO, ACTIVE)\nИнцидент: Угон\nСтатус: FILED → UNDER_REVIEW → REJECTED\nПричина: Угон не покрывается полисом OSAGO\n\n--- Заявка CLM-003 ---\nПолис: POL-2024-000003 (HEALTH, EXPIRED)\nИнцидент: Болезнь\nСтатус: FILED → REJECTED\nПричина: Полис истёк',
      hint: 'State machine через enum и метод transition(). Проверки — цепочка if-else. Типы покрытия — Map<String, Set<String>> incidentCoverage.',
      solution: `import java.util.*;

public class Main {
    static final Map<String, Set<String>> COVERAGE = Map.of(
        "OSAGO", Set.of("ДТП"),
        "KASKO", Set.of("ДТП", "Угон", "Стихия", "Вандализм"),
        "HEALTH", Set.of("Болезнь", "Травма", "Госпитализация"),
        "LIFE", Set.of("Смерть", "Инвалидность")
    );

    static void processClaim(String claimId, String policyNumber, String policyType,
                             String policyStatus, String incident,
                             long damageAmount, long franchise) {
        System.out.println("--- Заявка " + claimId + " ---");
        System.out.println("Полис: " + policyNumber + " (" + policyType + ", " + policyStatus + ")");
        System.out.println("Инцидент: " + incident);

        // FILED
        String status = "FILED";

        // Проверка истёкшего полиса
        if (policyStatus.equals("EXPIRED")) {
            System.out.println("Статус: " + status + " → REJECTED");
            System.out.println("Причина: Полис истёк");
            return;
        }

        // Проверка активности
        if (!policyStatus.equals("ACTIVE")) {
            System.out.println("Статус: " + status + " → REJECTED");
            System.out.println("Причина: Полис не активен");
            return;
        }

        // UNDER_REVIEW
        status = "FILED → UNDER_REVIEW";

        // Проверка покрытия
        Set<String> covered = COVERAGE.getOrDefault(policyType, Set.of());
        if (!covered.contains(incident)) {
            System.out.println("Статус: " + status + " → REJECTED");
            System.out.println("Причина: " + incident + " не покрывается полисом " + policyType);
            return;
        }

        // APPROVED
        long payout = damageAmount - franchise;
        if (payout < 0) payout = 0;

        System.out.println("Ущерб: " + damageAmount + " KZT");
        if (franchise > 0) System.out.println("Франшиза: " + franchise + " KZT");
        System.out.println("Статус: " + status + " → APPROVED");
        System.out.println("Выплата: " + payout + " KZT");
        System.out.println("Статус: PAID");
    }

    public static void main(String[] args) {
        System.out.println("=== Kaspi Страхование: Обработка заявок ===");

        processClaim("CLM-001", "POL-2024-000001", "KASKO", "ACTIVE",
            "ДТП", 850_000, 100_000);
        System.out.println();

        processClaim("CLM-002", "POL-2024-000002", "OSAGO", "ACTIVE",
            "Угон", 5_000_000, 0);
        System.out.println();

        processClaim("CLM-003", "POL-2024-000003", "HEALTH", "EXPIRED",
            "Болезнь", 300_000, 0);
    }
}`,
      explanation: 'Обработка заявок (claims processing) — ядро работы страховой компании. State machine гарантирует, что заявка проходит строго определённые этапы. В реальных системах Kaspi Страхование каждый переход логируется, требует подтверждения менеджера, а выплаты проходят через платёжный шлюз. Отклонённые заявки можно обжаловать.'
    },
    {
      id: 5,
      title: 'Damage Assessment: Оценка ущерба',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Claims Team. Задача из Jira: "INS-265: Реализовать калькулятор оценки ущерба при ДТП с учётом износа и порога тотального ущерба". При ДТП оценщик составляет список повреждённых деталей. Система должна рассчитать стоимость ремонта/замены, применить износ по возрасту авто и определить: ремонт или тотал (если ущерб > 70% стоимости авто).',
      requirements: [
        'Список деталей с ценами ремонта и замены',
        'Износ по возрасту авто: до 1 года — 0%, 1-3 года — 10%, 3-5 лет — 25%, 5-7 лет — 40%, 7+ лет — 50%',
        'Если деталь повреждена критически (severity HIGH) — замена, иначе ремонт',
        'Тотальный ущерб: если общий ущерб > 70% стоимости авто',
        'Выплата при тотале: стоимость авто с учётом износа - годные остатки (15%)'
      ],
      expectedOutput: '=== Оценка ущерба: ДТП ===\nАвто: Toyota Camry, 2019 (5 лет)\nРыночная стоимость: 12000000 KZT\nИзнос: 25%\n\nПовреждения:\n  Бампер передний: ремонт — 120000 KZT\n  Капот: замена — 450000 KZT\n  Фара левая: замена — 280000 KZT\n  Крыло переднее: ремонт — 95000 KZT\nИтого до износа: 945000 KZT\nИтого с износом: 708750 KZT\nПорог тотала (70%): 8400000 KZT\nРешение: РЕМОНТ\nВыплата: 708750 KZT\n\n=== Оценка ущерба: Тотальный случай ===\nАвто: Hyundai Accent, 2015 (9 лет)\nРыночная стоимость: 5500000 KZT\nИзнос: 50%\n\nПовреждения:\n  Кузов: замена — 2500000 KZT\n  Двигатель: замена — 1800000 KZT\n  Подвеска: замена — 600000 KZT\n  Электрика: замена — 400000 KZT\nИтого до износа: 5300000 KZT\nИтого с износом: 2650000 KZT\nПорог тотала (70%): 3850000 KZT\nРешение: РЕМОНТ\nВыплата: 2650000 KZT',
      hint: 'Износ применяется к стоимости запчастей при замене. Если severity == HIGH → цена замены, иначе цена ремонта. Тотал: totalDamage > carValue * 0.7.',
      solution: `import java.util.*;

public class Main {
    static double wearRate(int carAge) {
        if (carAge < 1) return 0.0;
        if (carAge <= 3) return 0.10;
        if (carAge <= 5) return 0.25;
        if (carAge <= 7) return 0.40;
        return 0.50;
    }

    static void assess(String car, int carAge, long carValue,
                       String[] parts, long[] repairCosts, long[] replaceCosts,
                       String[] severities) {
        double wear = wearRate(carAge);
        System.out.println("Авто: " + car + " (" + carAge + " лет)");
        System.out.println("Рыночная стоимость: " + carValue + " KZT");
        System.out.println("Износ: " + (int)(wear * 100) + "%");
        System.out.println();
        System.out.println("Повреждения:");

        long totalBeforeWear = 0;
        for (int i = 0; i < parts.length; i++) {
            boolean replace = severities[i].equals("HIGH");
            long cost = replace ? replaceCosts[i] : repairCosts[i];
            totalBeforeWear += cost;
            String action = replace ? "замена" : "ремонт";
            System.out.println("  " + parts[i] + ": " + action + " — " + cost + " KZT");
        }

        long totalWithWear = Math.round(totalBeforeWear * (1.0 - wear));
        long totalThreshold = Math.round(carValue * 0.70);

        System.out.println("Итого до износа: " + totalBeforeWear + " KZT");
        System.out.println("Итого с износом: " + totalWithWear + " KZT");
        System.out.println("Порог тотала (70%): " + totalThreshold + " KZT");

        if (totalBeforeWear > totalThreshold) {
            long wornValue = Math.round(carValue * (1.0 - wear));
            long salvage = Math.round(carValue * 0.15);
            long payout = wornValue - salvage;
            System.out.println("Решение: ТОТАЛ");
            System.out.println("Стоимость с износом: " + wornValue + " KZT");
            System.out.println("Годные остатки (15%): " + salvage + " KZT");
            System.out.println("Выплата: " + payout + " KZT");
        } else {
            System.out.println("Решение: РЕМОНТ");
            System.out.println("Выплата: " + totalWithWear + " KZT");
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Оценка ущерба: ДТП ===");
        assess("Toyota Camry, 2019", 5, 12_000_000,
            new String[]{"Бампер передний", "Капот", "Фара левая", "Крыло переднее"},
            new long[]{120_000, 200_000, 100_000, 95_000},
            new long[]{350_000, 450_000, 280_000, 250_000},
            new String[]{"LOW", "HIGH", "HIGH", "LOW"});

        System.out.println();
        System.out.println("=== Оценка ущерба: Тотальный случай ===");
        assess("Hyundai Accent, 2015", 9, 5_500_000,
            new String[]{"Кузов", "Двигатель", "Подвеска", "Электрика"},
            new long[]{800_000, 500_000, 200_000, 150_000},
            new long[]{2_500_000, 1_800_000, 600_000, 400_000},
            new String[]{"HIGH", "HIGH", "HIGH", "HIGH"});
    }
}`,
      explanation: 'Оценка ущерба — один из самых спорных процессов в страховании. Износ уменьшает выплату: чем старше авто, тем меньше стоимость запчастей. Тотальный ущерб означает, что ремонт нецелесообразен. В Freedom Insurance и Kaspi Страхование оценку проводят аккредитованные эксперты, а данные загружаются в систему через мобильное приложение с фотофиксацией.'
    },
    {
      id: 6,
      title: 'Risk Assessment: Оценка рисков',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Actuarial Team. Задача из Jira: "INS-280: Реализовать скоринг рисков для медицинского страхования". Halyk Life внедряет автоматическую оценку рисков. По профилю клиента (возраст, ИМТ, курение, хронические заболевания, профессия) рассчитывается балл риска и класс. Класс риска определяет множитель к базовой премии.',
      requirements: [
        'Факторы риска: возраст (18-30 → 0 баллов, 31-45 → 10, 46-60 → 25, 60+ → 40)',
        'ИМТ: < 18.5 → 10, 18.5-24.9 → 0, 25-29.9 → 10, 30+ → 25',
        'Курение: да → +30 баллов',
        'Хронические заболевания: +20 за каждое (макс 3)',
        'Профессия: офис → 0, производство → 10, опасная (шахтёр, пожарный) → 25',
        'Класс риска: 0-20 LOW (x1.0), 21-45 MEDIUM (x1.3), 46-70 HIGH (x1.7), 71+ VERY_HIGH (x2.5)',
        'Вывести разбивку баллов и итоговый множитель'
      ],
      expectedOutput: '=== Halyk Life: Оценка рисков ===\n--- Клиент: Нурланова Айгуль ---\nВозраст: 28 → 0 баллов\nИМТ: 22.5 → 0 баллов\nКурение: нет → 0 баллов\nХронические: 0 → 0 баллов\nПрофессия: офис → 0 баллов\nИтого баллов: 0\nКласс риска: LOW\nМножитель премии: x1.0\nБазовая премия: 180000 KZT\nИтого премия: 180000 KZT\n\n--- Клиент: Жумабаев Канат ---\nВозраст: 52 → 25 баллов\nИМТ: 31.2 → 25 баллов\nКурение: да → 30 баллов\nХронические: 2 → 40 баллов\nПрофессия: производство → 10 баллов\nИтого баллов: 130\nКласс риска: VERY_HIGH\nМножитель премии: x2.5\nБазовая премия: 180000 KZT\nИтого премия: 450000 KZT',
      hint: 'Каждый фактор — метод, возвращающий int (баллы). Суммируй все баллы, определи класс по порогам. Множитель — switch по классу.',
      solution: `public class Main {
    static int ageScore(int age) {
        if (age <= 30) return 0;
        if (age <= 45) return 10;
        if (age <= 60) return 25;
        return 40;
    }

    static int bmiScore(double bmi) {
        if (bmi < 18.5) return 10;
        if (bmi < 25) return 0;
        if (bmi < 30) return 10;
        return 25;
    }

    static int smokingScore(boolean smoker) {
        return smoker ? 30 : 0;
    }

    static int chronicScore(int count) {
        return Math.min(count, 3) * 20;
    }

    static int occupationScore(String type) {
        return switch (type) {
            case "офис" -> 0;
            case "производство" -> 10;
            case "опасная" -> 25;
            default -> 5;
        };
    }

    static String riskClass(int totalScore) {
        if (totalScore <= 20) return "LOW";
        if (totalScore <= 45) return "MEDIUM";
        if (totalScore <= 70) return "HIGH";
        return "VERY_HIGH";
    }

    static double premiumMultiplier(String riskClass) {
        return switch (riskClass) {
            case "LOW" -> 1.0;
            case "MEDIUM" -> 1.3;
            case "HIGH" -> 1.7;
            case "VERY_HIGH" -> 2.5;
            default -> 1.0;
        };
    }

    static void assess(String name, int age, double bmi, boolean smoker,
                       int chronicDiseases, String occupation, long basePremium) {
        int s1 = ageScore(age);
        int s2 = bmiScore(bmi);
        int s3 = smokingScore(smoker);
        int s4 = chronicScore(chronicDiseases);
        int s5 = occupationScore(occupation);
        int total = s1 + s2 + s3 + s4 + s5;
        String rc = riskClass(total);
        double mult = premiumMultiplier(rc);

        System.out.println("--- Клиент: " + name + " ---");
        System.out.println("Возраст: " + age + " → " + s1 + " баллов");
        System.out.println("ИМТ: " + bmi + " → " + s2 + " баллов");
        System.out.println("Курение: " + (smoker ? "да" : "нет") + " → " + s3 + " баллов");
        System.out.println("Хронические: " + chronicDiseases + " → " + s4 + " баллов");
        System.out.println("Профессия: " + occupation + " → " + s5 + " баллов");
        System.out.println("Итого баллов: " + total);
        System.out.println("Класс риска: " + rc);
        System.out.println("Множитель премии: x" + mult);
        System.out.println("Базовая премия: " + basePremium + " KZT");
        System.out.println("Итого премия: " + Math.round(basePremium * mult) + " KZT");
    }

    public static void main(String[] args) {
        System.out.println("=== Halyk Life: Оценка рисков ===");
        assess("Нурланова Айгуль", 28, 22.5, false, 0, "офис", 180_000);
        System.out.println();
        assess("Жумабаев Канат", 52, 31.2, true, 2, "производство", 180_000);
    }
}`,
      explanation: 'Андеррайтинг (оценка рисков) — основа прибыльности страховой компании. Актуарии Halyk Life разрабатывают скоринговые модели, которые балансируют между доступностью полисов и убыточностью портфеля. В реальности используются ML-модели на исторических данных. VERY_HIGH риск может привести к отказу в страховании или требованию медицинского обследования.'
    },
    {
      id: 7,
      title: 'Renewal Service: Продление полисов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Product Team. Задача из Jira: "INS-302: Сервис автоматического продления полисов с программой лояльности". Freedom Insurance хочет увеличить retention. Система ежедневно проверяет истекающие полисы (в течение 30 дней), рассчитывает цену продления с учётом скидки лояльности и генерирует предложения.',
      requirements: [
        'Найти полисы, истекающие в ближайшие 30 дней от текущей даты',
        'Скидка лояльности: -5% за каждый год с компанией, максимум -20%',
        'Статусы продления: OFFER_SENT, RENEWED, EXPIRED, CANCELLED',
        'Генерация предложения с новой ценой и сроком',
        'Вывести отчёт по всем обработанным полисам'
      ],
      expectedOutput: '=== Freedom Insurance: Продление полисов ===\nДата проверки: 2024-06-15\nПолисов к продлению: 3\n\nPOL-2024-000101 | Ахметов Марат | OSAGO\n  Истекает: 2024-07-01 (через 16 дней)\n  Лет с компанией: 4 → скидка 20%\n  Текущая премия: 45000 KZT\n  Цена продления: 36000 KZT\n  Статус: OFFER_SENT\n\nPOL-2024-000102 | Бекова Дана | KASKO\n  Истекает: 2024-06-28 (через 13 дней)\n  Лет с компанией: 1 → скидка 5%\n  Текущая премия: 520000 KZT\n  Цена продления: 494000 KZT\n  Статус: OFFER_SENT\n\nPOL-2024-000103 | Серикова Алия | HEALTH\n  Истекает: 2024-07-10 (через 25 дней)\n  Лет с компанией: 6 → скидка 20%\n  Текущая премия: 200000 KZT\n  Цена продления: 160000 KZT\n  Статус: OFFER_SENT\n\nИтого предложений: 3\nОбщая экономия клиентов: 75000 KZT',
      hint: 'LocalDate.now() заменить на фиксированную дату для стабильного вывода. ChronoUnit.DAYS.between() для разницы дат. Скидка: Math.min(0.20, years * 0.05).',
      solution: `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Main {
    static void processRenewals(LocalDate checkDate, String[] policyNumbers,
                                String[] holders, String[] types,
                                String[] endDates, long[] premiums,
                                int[] yearsWithCompany) {
        System.out.println("Дата проверки: " + checkDate);

        int count = 0;
        for (int i = 0; i < endDates.length; i++) {
            LocalDate end = LocalDate.parse(endDates[i]);
            long daysLeft = ChronoUnit.DAYS.between(checkDate, end);
            if (daysLeft > 0 && daysLeft <= 30) count++;
        }
        System.out.println("Полисов к продлению: " + count);
        System.out.println();

        long totalSavings = 0;
        int offers = 0;

        for (int i = 0; i < endDates.length; i++) {
            LocalDate end = LocalDate.parse(endDates[i]);
            long daysLeft = ChronoUnit.DAYS.between(checkDate, end);

            if (daysLeft <= 0 || daysLeft > 30) continue;

            int years = yearsWithCompany[i];
            double discount = Math.min(0.20, years * 0.05);
            long renewalPrice = Math.round(premiums[i] * (1.0 - discount));
            long savings = premiums[i] - renewalPrice;
            totalSavings += savings;
            offers++;

            System.out.println(policyNumbers[i] + " | " + holders[i] + " | " + types[i]);
            System.out.println("  Истекает: " + end + " (через " + daysLeft + " дней)");
            System.out.println("  Лет с компанией: " + years + " → скидка " +
                (int)(discount * 100) + "%");
            System.out.println("  Текущая премия: " + premiums[i] + " KZT");
            System.out.println("  Цена продления: " + renewalPrice + " KZT");
            System.out.println("  Статус: OFFER_SENT");
            System.out.println();
        }

        System.out.println("Итого предложений: " + offers);
        System.out.println("Общая экономия клиентов: " + totalSavings + " KZT");
    }

    public static void main(String[] args) {
        System.out.println("=== Freedom Insurance: Продление полисов ===");

        LocalDate checkDate = LocalDate.parse("2024-06-15");

        processRenewals(checkDate,
            new String[]{"POL-2024-000101", "POL-2024-000102", "POL-2024-000103"},
            new String[]{"Ахметов Марат", "Бекова Дана", "Серикова Алия"},
            new String[]{"OSAGO", "KASKO", "HEALTH"},
            new String[]{"2024-07-01", "2024-06-28", "2024-07-10"},
            new long[]{45_000, 520_000, 200_000},
            new int[]{4, 1, 6}
        );
    }
}`,
      explanation: 'Retention (удержание клиентов) — критичная метрика для Freedom Insurance и других страховщиков. Стоимость привлечения нового клиента в 5-7 раз выше, чем удержание существующего. Автоматические напоминания отправляются через SMS/push/email. Программа лояльности мотивирует клиентов не уходить к конкурентам. В реальности система интегрирована с CRM и notification-сервисом.'
    },
    {
      id: 8,
      title: 'Bonus-Malus: Система КБМ',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Actuarial Team. Задача из Jira: "INS-318: Реализовать полную систему бонус-малус (КБМ) с 13 классами и историей водителя". КБМ — ключевой механизм ОСАГО. Начальный класс 3 (коэффициент 1.0). Безаварийный год — класс вверх (дешевле). Авария — класс вниз (дороже). Система отслеживает историю и показывает прогрессию.',
      requirements: [
        '13 классов КБМ: от М (2.45) до 13 (0.5)',
        'Класс 3 — начальный (коэффициент 1.0)',
        'Без аварий за год: класс +1 (следующий по таблице)',
        'Авария: класс -2 (но не ниже М)',
        'Таблица: М=2.45, 0=2.3, 1=1.55, 2=1.4, 3=1.0, 4=0.95, 5=0.9, 6=0.85, 7=0.8, 8=0.75, 9=0.7, 10=0.65, 11=0.6, 12=0.55, 13=0.5',
        'Показать историю изменений класса за несколько лет'
      ],
      expectedOutput: '=== Система КБМ (Бонус-Малус) ===\n--- Водитель: Касымов Ержан ---\nНачальный класс: 3 (КБМ = 1.0)\n\nИстория:\n  2019: без аварий → класс 4 (КБМ = 0.95)\n  2020: без аварий → класс 5 (КБМ = 0.9)\n  2021: без аварий → класс 6 (КБМ = 0.85)\n  2022: АВАРИЯ → класс 4 (КБМ = 0.95)\n  2023: без аварий → класс 5 (КБМ = 0.9)\n\nТекущий класс: 5, КБМ = 0.9\nБазовая премия: 18378 KZT → Итого: 16540 KZT\n\n--- Водитель: Алиев Тимур ---\nНачальный класс: 3 (КБМ = 1.0)\n\nИстория:\n  2021: АВАРИЯ → класс 1 (КБМ = 1.55)\n  2022: АВАРИЯ → класс М (КБМ = 2.45)\n  2023: без аварий → класс 0 (КБМ = 2.3)\n\nТекущий класс: 0, КБМ = 2.3\nБазовая премия: 18378 KZT → Итого: 42269 KZT',
      hint: 'Массив коэффициентов по индексу класса. Класс М = индекс 0, класс 0 = индекс 1, ... класс 13 = индекс 14. При аварии: newIndex = Math.max(0, currentIndex - 2). Без аварий: newIndex = Math.min(14, currentIndex + 1).',
      solution: `public class Main {
    static final String[] CLASS_NAMES = {"М", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"};
    static final double[] COEFFICIENTS = {2.45, 2.3, 1.55, 1.4, 1.0, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5};
    static final int START_CLASS = 4; // индекс класса 3
    static final double BASE_PREMIUM = 18_378;

    static void simulateDriver(String name, int[] years, boolean[] accidents) {
        System.out.println("--- Водитель: " + name + " ---");
        int classIndex = START_CLASS;
        System.out.println("Начальный класс: " + CLASS_NAMES[classIndex]
            + " (КБМ = " + COEFFICIENTS[classIndex] + ")");
        System.out.println();
        System.out.println("История:");

        for (int i = 0; i < years.length; i++) {
            if (accidents[i]) {
                classIndex = Math.max(0, classIndex - 2);
                System.out.println("  " + years[i] + ": АВАРИЯ → класс "
                    + CLASS_NAMES[classIndex] + " (КБМ = " + COEFFICIENTS[classIndex] + ")");
            } else {
                classIndex = Math.min(CLASS_NAMES.length - 1, classIndex + 1);
                System.out.println("  " + years[i] + ": без аварий → класс "
                    + CLASS_NAMES[classIndex] + " (КБМ = " + COEFFICIENTS[classIndex] + ")");
            }
        }

        double kbm = COEFFICIENTS[classIndex];
        long totalPremium = Math.round(BASE_PREMIUM * kbm);
        System.out.println();
        System.out.println("Текущий класс: " + CLASS_NAMES[classIndex] + ", КБМ = " + kbm);
        System.out.println("Базовая премия: " + (int) BASE_PREMIUM + " KZT → Итого: " + totalPremium + " KZT");
    }

    public static void main(String[] args) {
        System.out.println("=== Система КБМ (Бонус-Малус) ===");

        simulateDriver("Касымов Ержан",
            new int[]{2019, 2020, 2021, 2022, 2023},
            new boolean[]{false, false, false, true, false});

        System.out.println();
        simulateDriver("Алиев Тимур",
            new int[]{2021, 2022, 2023},
            new boolean[]{true, true, false});
    }
}`,
      explanation: 'КБМ (коэффициент бонус-малус) — единая система в Казахстане, управляемая ЕСБД (Единая страховая база данных). Каждый страховщик обязан запрашивать КБМ водителя перед оформлением ОСАГО. Безаварийные водители платят до 50% меньше (класс 13), а аварийные — до 145% больше (класс М). Это стимулирует безопасное вождение и является аналогом кредитного скоринга в страховании.'
    },
    {
      id: 9,
      title: 'Reinsurance: Перестрахование',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт: Underwriting Team. Задача из Jira: "INS-335: Реализовать модуль перестрахования для крупных рисков с многоуровневой структурой". Kaspi Страхование не может нести все риски самостоятельно. Если покрытие > 50М KZT — часть риска передаётся перестраховщику. Реализуй расчёт долей, переданных премий и максимальной ответственности для каждого уровня.',
      requirements: [
        'Если покрытие <= 50M KZT — полное собственное удержание, перестрахование не нужно',
        'Если покрытие > 50M KZT: собственное удержание 30%, передача перестраховщику 70%',
        'Премия перестраховщику: пропорционально доле (70% от премии) минус комиссия 15%',
        'Многоуровневое перестрахование: если доля перестраховщика > 100M KZT, второй уровень (ретроцессия)',
        'Второй уровень: перестраховщик удерживает 60%, передаёт ретроцессионеру 40%',
        'Вывести полную структуру распределения риска'
      ],
      expectedOutput: '=== Kaspi Страхование: Перестрахование ===\n--- Полис: Завод КазМунайГаз ---\nПокрытие: 500000000 KZT\nПремия: 7500000 KZT\n\nУровень 1: Прямой страховщик (Kaspi)\n  Удержание: 30% = 150000000 KZT\n  Премия удержанная: 2250000 KZT\n  Передано: 70% = 350000000 KZT\n\nУровень 2: Перестраховщик (Munich Re)\n  Получено: 350000000 KZT\n  Премия полученная: 5250000 KZT\n  Комиссия Kaspi (15%): 787500 KZT\n  Премия нетто: 4462500 KZT\n  Удержание: 60% = 210000000 KZT\n  Передано ретроцессионеру: 40% = 140000000 KZT\n\nУровень 3: Ретроцессионер (Swiss Re)\n  Получено: 140000000 KZT\n  Премия: 1785000 KZT\n\nИтого распределение риска:\n  Kaspi:     150000000 KZT (30.0%)\n  Munich Re: 210000000 KZT (42.0%)\n  Swiss Re:  140000000 KZT (28.0%)\n\n--- Полис: ТОО Астана-Строй ---\nПокрытие: 40000000 KZT\nПремия: 800000 KZT\nПерестрахование не требуется (покрытие <= 50M KZT)\nПолное собственное удержание: 40000000 KZT',
      hint: 'Рекурсивная или поуровневая структура. Каждый уровень: retention = amount * retentionRate, ceded = amount - retention. Комиссия вычитается из переданной премии. Если ceded > 100M → следующий уровень.',
      solution: `public class Main {
    static final long REINSURANCE_THRESHOLD = 50_000_000;
    static final long RETROCESSION_THRESHOLD = 100_000_000;

    static void processReinsurance(String policyName, long coverage, long premium) {
        System.out.println("--- Полис: " + policyName + " ---");
        System.out.println("Покрытие: " + coverage + " KZT");
        System.out.println("Премия: " + premium + " KZT");

        if (coverage <= REINSURANCE_THRESHOLD) {
            System.out.println("Перестрахование не требуется (покрытие <= 50M KZT)");
            System.out.println("Полное собственное удержание: " + coverage + " KZT");
            return;
        }

        System.out.println();

        // Уровень 1: Прямой страховщик
        double retentionRate1 = 0.30;
        long retained1 = Math.round(coverage * retentionRate1);
        long ceded1 = coverage - retained1;
        long premiumRetained1 = Math.round(premium * retentionRate1);
        long premiumCeded1 = premium - premiumRetained1;

        System.out.println("Уровень 1: Прямой страховщик (Kaspi)");
        System.out.println("  Удержание: " + (int)(retentionRate1 * 100) + "% = " + retained1 + " KZT");
        System.out.println("  Премия удержанная: " + premiumRetained1 + " KZT");
        System.out.println("  Передано: " + (int)((1 - retentionRate1) * 100) + "% = " + ceded1 + " KZT");

        // Уровень 2: Перестраховщик
        System.out.println();
        long commission = Math.round(premiumCeded1 * 0.15);
        long premiumNet2 = premiumCeded1 - commission;

        System.out.println("Уровень 2: Перестраховщик (Munich Re)");
        System.out.println("  Получено: " + ceded1 + " KZT");
        System.out.println("  Премия полученная: " + premiumCeded1 + " KZT");
        System.out.println("  Комиссия Kaspi (15%): " + commission + " KZT");
        System.out.println("  Премия нетто: " + premiumNet2 + " KZT");

        long retained2, ceded2;
        if (ceded1 > RETROCESSION_THRESHOLD) {
            double retentionRate2 = 0.60;
            retained2 = Math.round(ceded1 * retentionRate2);
            ceded2 = ceded1 - retained2;
            long premiumRetro = Math.round(premiumNet2 * 0.40);

            System.out.println("  Удержание: 60% = " + retained2 + " KZT");
            System.out.println("  Передано ретроцессионеру: 40% = " + ceded2 + " KZT");

            // Уровень 3: Ретроцессионер
            System.out.println();
            System.out.println("Уровень 3: Ретроцессионер (Swiss Re)");
            System.out.println("  Получено: " + ceded2 + " KZT");
            System.out.println("  Премия: " + premiumRetro + " KZT");

            System.out.println();
            System.out.println("Итого распределение риска:");
            System.out.printf("  Kaspi:     %d KZT (%.1f%%)%n", retained1, retained1 * 100.0 / coverage);
            System.out.printf("  Munich Re: %d KZT (%.1f%%)%n", retained2, retained2 * 100.0 / coverage);
            System.out.printf("  Swiss Re:  %d KZT (%.1f%%)%n", ceded2, ceded2 * 100.0 / coverage);
        } else {
            System.out.println("  Полное удержание: " + ceded1 + " KZT");
            System.out.println();
            System.out.println("Итого распределение риска:");
            System.out.printf("  Kaspi:     %d KZT (%.1f%%)%n", retained1, retained1 * 100.0 / coverage);
            System.out.printf("  Munich Re: %d KZT (%.1f%%)%n", ceded1, ceded1 * 100.0 / coverage);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Kaspi Страхование: Перестрахование ===");
        processReinsurance("Завод КазМунайГаз", 500_000_000, 7_500_000);

        System.out.println();
        processReinsurance("ТОО Астана-Строй", 40_000_000, 800_000);
    }
}`,
      explanation: 'Перестрахование — способ управления рисками, когда страховщик передаёт часть ответственности другой компании. Munich Re и Swiss Re — крупнейшие перестраховщики мира. Комиссия (15%) — вознаграждение прямого страховщика за привлечение клиента и обслуживание. Ретроцессия — перестрахование перестраховщика. Без перестрахования ни одна казахстанская компания не может страховать крупные промышленные объекты.'
    },
    {
      id: 10,
      title: 'Portfolio Analytics: Аналитика портфеля',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт: Analytics Team. Задача из Jira: "INS-350: Квартальный отчёт по страховому портфелю с loss ratio и анализом сегментов". Руководство Freedom Insurance запрашивает аналитику: сколько полисов по типам, сколько собрано премий, сколько выплачено по убыткам, какие сегменты прибыльные, а какие убыточные. Loss ratio > 70% — сигнал тревоги.',
      requirements: [
        'Агрегация по типам полисов: количество, сумма премий, сумма выплат',
        'Loss ratio = выплаты / премии * 100% (для каждого сегмента и общий)',
        'Combined ratio = loss ratio + expense ratio (расходы 25% от премий)',
        'Определить прибыльные (loss ratio < 50%) и убыточные (> 70%) сегменты',
        'Сформировать квартальный отчёт с рекомендациями'
      ],
      expectedOutput: '=== Freedom Insurance: Квартальный отчёт Q1 2024 ===\n\nСегмент     | Полисов | Премии (KZT)  | Выплаты (KZT) | Loss Ratio\nOSAGO       |    1250 |   62,500,000  |   43,750,000  |    70.0%  ⚠️\nKASKO       |     380 |  190,000,000  |   76,000,000  |    40.0%  ✓\nHEALTH      |     820 |  164,000,000  |  131,200,000  |    80.0%  ✗\nLIFE        |     150 |   45,000,000  |    9,000,000  |    20.0%  ✓\n\nИтого       |    2600 |  461,500,000  |  259,950,000  |    56.3%\n\nExpense Ratio: 25.0%\nCombined Ratio: 81.3%\n\n=== Анализ сегментов ===\nПрибыльные (LR < 50%): KASKO (40.0%), LIFE (20.0%)\nУбыточные  (LR > 70%): OSAGO (70.0%), HEALTH (80.0%)\n\n=== Рекомендации ===\n- OSAGO: Пересмотреть тарифы, ужесточить андеррайтинг\n- HEALTH: Критический LR! Увеличить премии или ограничить покрытие\n- KASKO: Стабильный сегмент, возможно расширение\n- LIFE: Высокомаржинальный сегмент, инвестировать в продажи',
      hint: 'Массивы данных по сегментам. Loss ratio = claims / premiums. Combined = loss + expense. String.format для форматирования таблицы. Условная логика для рекомендаций.',
      solution: `public class Main {
    public static void main(String[] args) {
        String[] segments = {"OSAGO", "KASKO", "HEALTH", "LIFE"};
        int[] policies =    {1250, 380, 820, 150};
        long[] premiums =   {62_500_000, 190_000_000, 164_000_000, 45_000_000};
        long[] claims =     {43_750_000, 76_000_000, 131_200_000, 9_000_000};

        System.out.println("=== Freedom Insurance: Квартальный отчёт Q1 2024 ===");
        System.out.println();

        System.out.printf("%-12s| %7s | %-13s | %-13s | %s%n",
            "Сегмент", "Полисов", "Премии (KZT)", "Выплаты (KZT)", "Loss Ratio");

        long totalPremiums = 0, totalClaims = 0;
        int totalPolicies = 0;
        double[] lossRatios = new double[segments.length];

        for (int i = 0; i < segments.length; i++) {
            totalPremiums += premiums[i];
            totalClaims += claims[i];
            totalPolicies += policies[i];
            lossRatios[i] = (double) claims[i] / premiums[i] * 100;

            String status = lossRatios[i] > 70 ? "✗" : lossRatios[i] >= 70 ? "⚠️" : "✓";
            System.out.printf("%-12s| %7d | %,13d  | %,13d  | %7.1f%%  %s%n",
                segments[i], policies[i], premiums[i], claims[i], lossRatios[i], status);
        }

        double totalLR = (double) totalClaims / totalPremiums * 100;
        System.out.printf("%n%-12s| %7d | %,13d  | %,13d  | %7.1f%%%n",
            "Итого", totalPolicies, totalPremiums, totalClaims, totalLR);

        double expenseRatio = 25.0;
        double combinedRatio = totalLR + expenseRatio;
        System.out.println();
        System.out.println("Expense Ratio: " + expenseRatio + "%");
        System.out.printf("Combined Ratio: %.1f%%%n", combinedRatio);

        // Анализ сегментов
        System.out.println();
        System.out.println("=== Анализ сегментов ===");

        StringBuilder profitable = new StringBuilder();
        StringBuilder unprofitable = new StringBuilder();

        for (int i = 0; i < segments.length; i++) {
            if (lossRatios[i] < 50) {
                if (profitable.length() > 0) profitable.append(", ");
                profitable.append(segments[i]).append(String.format(" (%.1f%%)", lossRatios[i]));
            }
            if (lossRatios[i] >= 70) {
                if (unprofitable.length() > 0) unprofitable.append(", ");
                unprofitable.append(segments[i]).append(String.format(" (%.1f%%)", lossRatios[i]));
            }
        }

        System.out.println("Прибыльные (LR < 50%): " + profitable);
        System.out.println("Убыточные  (LR > 70%): " + unprofitable);

        // Рекомендации
        System.out.println();
        System.out.println("=== Рекомендации ===");
        for (int i = 0; i < segments.length; i++) {
            String rec;
            if (lossRatios[i] >= 80) {
                rec = "Критический LR! Увеличить премии или ограничить покрытие";
            } else if (lossRatios[i] >= 70) {
                rec = "Пересмотреть тарифы, ужесточить андеррайтинг";
            } else if (lossRatios[i] >= 50) {
                rec = "Стабильный сегмент, возможно расширение";
            } else if (lossRatios[i] >= 30) {
                rec = "Стабильный сегмент, возможно расширение";
            } else {
                rec = "Высокомаржинальный сегмент, инвестировать в продажи";
            }
            System.out.println("- " + segments[i] + ": " + rec);
        }
    }
}`,
      explanation: 'Loss ratio (коэффициент убыточности) — главная метрика страховой компании. Если LR > 100% — компания выплачивает больше, чем собирает. Combined ratio включает операционные расходы: если CR > 100% — страхование убыточно. В Freedom Insurance и Kaspi Страхование аналитики строят такие отчёты в BI-системах (Tableau, Power BI), а данные поступают из хранилища (ClickHouse, PostgreSQL). Сегментация помогает фокусировать продажи на прибыльных продуктах.'
    }
  ]
};
