export default {
  id: 112,
  title: 'Реальная разработка: HR-система',
  description: 'Задачи Java-разработчика в HR/ERP: сотрудники, зарплата, отпуска, табель, KPI, оргструктура и кадровый документооборот.',
  lessons: [
    {
      id: 1,
      title: 'Employee Profile: Карточка сотрудника',
      type: 'practice',
      difficulty: 'easy',
      description: 'Спринт HR Core. Jira HR-101: "Реализовать карточку сотрудника". В любой HR-системе (1C:ЗУП, SAP HCM, BambooHR) основная сущность — карточка сотрудника. Она хранит персональные данные, должность, подразделение и дату приёма. Реализуй модель Employee и расчёт стажа работы по казахстанскому трудовому законодательству.',
      requirements: [
        'Создай enum Status: ACTIVE, ON_LEAVE, FIRED',
        'Класс Employee: id, name, iin (ИИН 12 цифр), position, department, hireDate (LocalDate), salary (BigDecimal), status',
        'Метод getExperience() — возвращает стаж в формате "X лет Y месяцев"',
        'Метод printCard() — выводит карточку сотрудника в табличном формате',
        'В main создай 2 сотрудников и выведи их карточки'
      ],
      expectedOutput: `════════════════════════════════════
  КАРТОЧКА СОТРУДНИКА
════════════════════════════════════
ID:           1
ФИО:          Асанов Нурлан Бекович
ИИН:          950315300125
Должность:    Senior Java Developer
Отдел:        IT Department
Дата приёма:  2021-03-15
Оклад:        850 000,00 KZT
Статус:       ACTIVE
Стаж:         5 лет 0 месяцев
════════════════════════════════════
════════════════════════════════════
  КАРТОЧКА СОТРУДНИКА
════════════════════════════════════
ID:           2
ФИО:          Каримова Айгуль Сериковна
ИИН:          880720400289
Должность:    HR Manager
Отдел:        HR Department
Дата приёма:  2019-07-01
Оклад:        650 000,00 KZT
Статус:       ACTIVE
Стаж:         6 лет 9 месяцев
════════════════════════════════════`,
      hint: 'Используй java.time.LocalDate и Period.between(hireDate, LocalDate.now()) для расчёта стажа. BigDecimal для зарплаты — избегай double для финансовых расчётов. DecimalFormat для форматирования суммы.',
      solution: `import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.time.LocalDate;
import java.time.Period;
import java.util.Locale;

public class Main {
    enum Status { ACTIVE, ON_LEAVE, FIRED }

    static int[] ids;
    static String[] names;
    static String[] iins;
    static String[] positions;
    static String[] departments;
    static LocalDate[] hireDates;
    static BigDecimal[] salaries;
    static Status[] statuses;
    static int count = 0;

    static void addEmployee(int id, String name, String iin, String position,
                            String department, LocalDate hireDate, BigDecimal salary, Status status) {
        ids[count] = id;
        names[count] = name;
        iins[count] = iin;
        positions[count] = position;
        departments[count] = department;
        hireDates[count] = hireDate;
        salaries[count] = salary;
        statuses[count] = status;
        count++;
    }

    static String getExperience(int index) {
        Period period = Period.between(hireDates[index], LocalDate.of(2026, 3, 15));
        return period.getYears() + " лет " + period.getMonths() + " месяцев";
    }

    static void printCard(int index) {
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.FRANCE);
        symbols.setGroupingSeparator(' ');
        symbols.setDecimalSeparator(',');
        DecimalFormat df = new DecimalFormat("#,##0.00", symbols);

        System.out.println("════════════════════════════════════");
        System.out.println("  КАРТОЧКА СОТРУДНИКА");
        System.out.println("════════════════════════════════════");
        System.out.println("ID:           " + ids[index]);
        System.out.println("ФИО:          " + names[index]);
        System.out.println("ИИН:          " + iins[index]);
        System.out.println("Должность:    " + positions[index]);
        System.out.println("Отдел:        " + departments[index]);
        System.out.println("Дата приёма:  " + hireDates[index]);
        System.out.println("Оклад:        " + df.format(salaries[index]) + " KZT");
        System.out.println("Статус:       " + statuses[index]);
        System.out.println("Стаж:         " + getExperience(index));
        System.out.println("════════════════════════════════════");
    }

    public static void main(String[] args) {
        ids = new int[10];
        names = new String[10];
        iins = new String[10];
        positions = new String[10];
        departments = new String[10];
        hireDates = new LocalDate[10];
        salaries = new BigDecimal[10];
        statuses = new Status[10];

        addEmployee(1, "Асанов Нурлан Бекович", "950315300125",
                "Senior Java Developer", "IT Department",
                LocalDate.of(2021, 3, 15), new BigDecimal("850000"), Status.ACTIVE);

        addEmployee(2, "Каримова Айгуль Сериковна", "880720400289",
                "HR Manager", "HR Department",
                LocalDate.of(2019, 7, 1), new BigDecimal("650000"), Status.ACTIVE);

        printCard(0);
        printCard(1);
    }
}`,
      explanation: 'Карточка сотрудника — базовая сущность любой HR-системы. В реальных проектах (1C:ЗУП, SAP) она содержит десятки полей. Мы используем BigDecimal для зарплаты (финансовые расчёты требуют точности), LocalDate для дат, enum для статусов. ИИН (индивидуальный идентификационный номер) — 12-значный код в Казахстане. Period.between() автоматически считает разницу в годах и месяцах.'
    },
    {
      id: 2,
      title: 'Salary Calculator: Расчёт зарплаты',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт Payroll. Jira HR-205: "Реализовать расчёт заработной платы". По казахстанскому законодательству из зарплаты удерживаются: ОПВ (10%), ИПН (10% от суммы после ОПВ), ВОСМС (2%). Работодатель дополнительно платит СО, ОСМС. Реализуй расчёт зарплаты с учётом бонуса и сверхурочных, как в модуле Payroll SAP или 1C:ЗУП.',
      requirements: [
        'Входные данные: baseSalary, bonus, overtimeHours, overtimeRate',
        'Рассчитай gross = baseSalary + bonus + overtimeHours * overtimeRate',
        'Удержания: ОПВ = gross * 10%, ИПН = (gross - ОПВ) * 10%, ВОСМС = gross * 2%',
        'Net = gross - ОПВ - ИПН - ВОСМС',
        'Выведи расчётный листок (payslip) с разбивкой всех начислений и удержаний',
        'Все суммы в KZT, форматировать с разделителями'
      ],
      expectedOutput: `╔══════════════════════════════════════════╗
║         РАСЧЁТНЫЙ ЛИСТОК                ║
║      Март 2026                          ║
╠══════════════════════════════════════════╣
║ Сотрудник: Асанов Нурлан                ║
║ Должность: Senior Java Developer        ║
╠══════════════════════════════════════════╣
║ НАЧИСЛЕНИЯ:                             ║
║   Оклад:              850 000 KZT       ║
║   Бонус:              120 000 KZT       ║
║   Сверхурочные (12ч): 36 000 KZT        ║
║   ─────────────────────────────          ║
║   GROSS:              1 006 000 KZT      ║
╠══════════════════════════════════════════╣
║ УДЕРЖАНИЯ:                              ║
║   ОПВ (10%):          100 600 KZT       ║
║   ИПН (10%):          90 540 KZT        ║
║   ВОСМС (2%):         20 120 KZT        ║
║   ─────────────────────────────          ║
║   Итого удержания:    211 260 KZT       ║
╠══════════════════════════════════════════╣
║   NET (на руки):      794 740 KZT       ║
╚══════════════════════════════════════════╝`,
      hint: 'ИПН считается от суммы за вычетом ОПВ: ИПН = (gross - ОПВ) * 10%. Используй long или BigDecimal для денежных сумм. В реальных системах формула сложнее: есть минимальный расчётный показатель (МРП), вычеты, льготы.',
      solution: `public class Main {
    public static void main(String[] args) {
        String name = "Асанов Нурлан";
        String position = "Senior Java Developer";
        long baseSalary = 850_000;
        long bonus = 120_000;
        int overtimeHours = 12;
        long overtimeRate = 3_000;

        long overtimePay = overtimeHours * overtimeRate;
        long gross = baseSalary + bonus + overtimePay;

        long opv = gross * 10 / 100;
        long ipn = (gross - opv) * 10 / 100;
        long vosms = gross * 2 / 100;
        long totalDeductions = opv + ipn + vosms;
        long net = gross - totalDeductions;

        System.out.println("╔══════════════════════════════════════════╗");
        System.out.println("║         РАСЧЁТНЫЙ ЛИСТОК                ║");
        System.out.println("║      Март 2026                          ║");
        System.out.println("╠══════════════════════════════════════════╣");
        System.out.printf("║ Сотрудник: %-30s║%n", name);
        System.out.printf("║ Должность: %-30s║%n", position);
        System.out.println("╠══════════════════════════════════════════╣");
        System.out.println("║ НАЧИСЛЕНИЯ:                             ║");
        System.out.printf("║   Оклад:              %-19s║%n", formatMoney(baseSalary));
        System.out.printf("║   Бонус:              %-19s║%n", formatMoney(bonus));
        System.out.printf("║   Сверхурочные (%dч): %-19s║%n", overtimeHours, formatMoney(overtimePay));
        System.out.println("║   ─────────────────────────────          ║");
        System.out.printf("║   GROSS:              %-19s║%n", formatMoney(gross));
        System.out.println("╠══════════════════════════════════════════╣");
        System.out.println("║ УДЕРЖАНИЯ:                              ║");
        System.out.printf("║   ОПВ (10%%):          %-19s║%n", formatMoney(opv));
        System.out.printf("║   ИПН (10%%):          %-19s║%n", formatMoney(ipn));
        System.out.printf("║   ВОСМС (2%%):         %-19s║%n", formatMoney(vosms));
        System.out.println("║   ─────────────────────────────          ║");
        System.out.printf("║   Итого удержания:    %-19s║%n", formatMoney(totalDeductions));
        System.out.println("╠══════════════════════════════════════════╣");
        System.out.printf("║   NET (на руки):      %-19s║%n", formatMoney(net));
        System.out.println("╚══════════════════════════════════════════╝");
    }

    static String formatMoney(long amount) {
        String s = String.valueOf(amount);
        StringBuilder sb = new StringBuilder();
        int count = 0;
        for (int i = s.length() - 1; i >= 0; i--) {
            if (count > 0 && count % 3 == 0) sb.insert(0, ' ');
            sb.insert(0, s.charAt(i));
            count++;
        }
        sb.append(" KZT");
        return sb.toString();
    }
}`,
      explanation: 'Расчёт зарплаты в Казахстане: ОПВ (обязательные пенсионные взносы) — 10% от gross, ИПН (индивидуальный подоходный налог) — 10% от (gross - ОПВ), ВОСМС (взносы на обязательное социальное медицинское страхование) — 2% от gross. В реальных системах (1C, SAP) добавляются вычеты (1 МЗП), льготы для инвалидов, больничные. Payslip — обязательный документ по Трудовому кодексу РК.'
    },
    {
      id: 3,
      title: 'Vacation Manager: Отпуска',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт HR Core. Jira HR-312: "Модуль управления отпусками". По ТК РК ежегодный оплачиваемый отпуск — минимум 24 календарных дня. Реализуй систему заявок на отпуск: проверка остатка дней, пересечений с коллегами, минимальной длительности (7 дней) и расчёт отпускных. Аналог модуля "Отпуска" в BambooHR или 1C:ЗУП.',
      requirements: [
        'Класс VacationRequest: employeeId, startDate, endDate, status (PENDING/APPROVED/REJECTED)',
        'Ежегодный лимит: 24 календарных дня',
        'Проверки: остаток дней, минимум 7 дней, нет пересечения с коллегой из того же отдела',
        'Расчёт отпускных: средняя зарплата * дней / 29.3',
        'Подать 3 заявки, одну одобрить, одну отклонить (пересечение), третью проверить (нехватка дней)'
      ],
      expectedOutput: `=== Система управления отпусками ===

Заявка #1: Асанов Нурлан, 2026-06-01 — 2026-06-14 (14 дней)
  Остаток дней: 24 → проверка пройдена
  Пересечение с отделом: нет
  Минимум 7 дней: OK
  ✓ Заявка ОДОБРЕНА
  Отпускные: 407 849 KZT (850000 * 14 / 29.3)

Заявка #2: Болатов Ержан, 2026-06-05 — 2026-06-15 (11 дней)
  Остаток дней: 24 → проверка пройдена
  Пересечение с отделом: КОНФЛИКТ с Асанов Нурлан (2026-06-05 — 2026-06-14)
  ✗ Заявка ОТКЛОНЕНА: пересечение с коллегой из отдела

Заявка #3: Асанов Нурлан, 2026-08-01 — 2026-08-18 (18 дней)
  Остаток дней: 10 (использовано 14)
  ✗ Заявка ОТКЛОНЕНА: недостаточно дней отпуска (запрошено 18, осталось 10)`,
      hint: 'Для проверки пересечения дат: overlap = start1 < end2 && start2 < end1. Среднедневной заработок по ТК РК: зарплата за 12 месяцев / 12 / 29.3 (среднее кол-во дней в месяце). ChronoUnit.DAYS.between() для подсчёта дней.',
      solution: `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Main {
    static final int ANNUAL_LIMIT = 24;

    // Employees
    static int[] empIds = {1, 2};
    static String[] empNames = {"Асанов Нурлан", "Болатов Ержан"};
    static String[] empDepts = {"IT Department", "IT Department"};
    static long[] empSalaries = {850_000, 720_000};
    static int[] usedDays = {0, 0};

    // Vacation requests
    static int[] reqEmpId = new int[10];
    static LocalDate[] reqStart = new LocalDate[10];
    static LocalDate[] reqEnd = new LocalDate[10];
    static String[] reqStatus = new String[10];
    static int reqCount = 0;

    static int findEmp(int id) {
        for (int i = 0; i < empIds.length; i++)
            if (empIds[i] == id) return i;
        return -1;
    }

    static boolean hasOverlap(int empIdx, LocalDate start, LocalDate end) {
        String dept = empDepts[empIdx];
        for (int i = 0; i < reqCount; i++) {
            if (!"APPROVED".equals(reqStatus[i])) continue;
            int otherIdx = findEmp(reqEmpId[i]);
            if (otherIdx == empIdx) continue;
            if (!empDepts[otherIdx].equals(dept)) continue;
            if (start.isBefore(reqEnd[i]) && reqStart[i].isBefore(end)) {
                System.out.println("  Пересечение с отделом: КОНФЛИКТ с " + empNames[otherIdx]
                        + " (" + reqStart[i] + " — " + reqEnd[i].minusDays(1) + ")");
                return true;
            }
        }
        System.out.println("  Пересечение с отделом: нет");
        return false;
    }

    static void submitRequest(int employeeId, LocalDate start, LocalDate end) {
        int empIdx = findEmp(employeeId);
        int days = (int) ChronoUnit.DAYS.between(start, end) + 1;

        System.out.printf("%nЗаявка #%d: %s, %s — %s (%d дней)%n",
                reqCount + 1, empNames[empIdx], start, end, days);

        int remaining = ANNUAL_LIMIT - usedDays[empIdx];
        if (remaining < days) {
            System.out.printf("  Остаток дней: %d (использовано %d)%n", remaining, usedDays[empIdx]);
            System.out.printf("  ✗ Заявка ОТКЛОНЕНА: недостаточно дней отпуска (запрошено %d, осталось %d)%n", days, remaining);
            reqStatus[reqCount] = "REJECTED";
            reqEmpId[reqCount] = employeeId;
            reqStart[reqCount] = start;
            reqEnd[reqCount] = end.plusDays(1);
            reqCount++;
            return;
        }
        System.out.printf("  Остаток дней: %d → проверка пройдена%n", remaining);

        if (hasOverlap(empIdx, start, end.plusDays(1))) {
            System.out.println("  ✗ Заявка ОТКЛОНЕНА: пересечение с коллегой из отдела");
            reqStatus[reqCount] = "REJECTED";
            reqEmpId[reqCount] = employeeId;
            reqStart[reqCount] = start;
            reqEnd[reqCount] = end.plusDays(1);
            reqCount++;
            return;
        }

        if (days < 7) {
            System.out.println("  ✗ Заявка ОТКЛОНЕНА: минимум 7 дней");
            reqStatus[reqCount] = "REJECTED";
            reqEmpId[reqCount] = employeeId;
            reqStart[reqCount] = start;
            reqEnd[reqCount] = end.plusDays(1);
            reqCount++;
            return;
        }
        System.out.println("  Минимум 7 дней: OK");

        reqStatus[reqCount] = "APPROVED";
        reqEmpId[reqCount] = employeeId;
        reqStart[reqCount] = start;
        reqEnd[reqCount] = end.plusDays(1);
        reqCount++;
        usedDays[empIdx] += days;

        long vacationPay = empSalaries[empIdx] * days * 10 / 293;
        System.out.println("  ✓ Заявка ОДОБРЕНА");
        System.out.printf("  Отпускные: %s KZT (%d * %d / 29.3)%n",
                formatMoney(vacationPay), empSalaries[empIdx], days);
    }

    static String formatMoney(long amount) {
        String s = String.valueOf(amount);
        StringBuilder sb = new StringBuilder();
        int c = 0;
        for (int i = s.length() - 1; i >= 0; i--) {
            if (c > 0 && c % 3 == 0) sb.insert(0, ' ');
            sb.insert(0, s.charAt(i));
            c++;
        }
        return sb.toString();
    }

    public static void main(String[] args) {
        System.out.println("=== Система управления отпусками ===");

        submitRequest(1, LocalDate.of(2026, 6, 1), LocalDate.of(2026, 6, 14));
        submitRequest(2, LocalDate.of(2026, 6, 5), LocalDate.of(2026, 6, 15));
        submitRequest(1, LocalDate.of(2026, 8, 1), LocalDate.of(2026, 8, 18));
    }
}`,
      explanation: 'Модуль отпусков — ключевая часть любой HR-системы. По ТК РК (ст. 88) минимальный отпуск — 24 календарных дня. Проверка пересечений предотвращает ситуацию, когда весь отдел уходит одновременно. Отпускные рассчитываются по среднедневному заработку (зарплата / 29.3 — среднемесячное число дней). В реальных системах учитываются: праздничные дни (не входят в отпуск), дополнительные дни за вредность, перенос остатка на следующий год.'
    },
    {
      id: 4,
      title: 'Timesheet: Табель учёта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт HR Core. Jira HR-415: "Модуль табельного учёта рабочего времени". Табель — обязательный документ по ТК РК. Реализуй учёт рабочих дней, больничных, отпусков, праздников. Рассчитай сверхурочные (>8ч в день) и работу в выходные (x2). Формат аналогичен Т-13 в 1C:ЗУП.',
      requirements: [
        'Массив записей за месяц: дата, тип дня (WORK/SICK/VACATION/HOLIDAY), часы',
        'Рабочий день: 8 часов, сверхурочные >8ч (x1.5 ставка)',
        'Работа в выходные: x2 ставка',
        'Считать: рабочих дней, часов всего, сверхурочных часов, больничных, отпускных',
        'Сгенерировать месячный отчёт табеля'
      ],
      expectedOutput: `═══════════════════════════════════════════
  ТАБЕЛЬ УЧЁТА РАБОЧЕГО ВРЕМЕНИ
  Сотрудник: Асанов Нурлан
  Период: Март 2026
═══════════════════════════════════════════
Дата        Тип        Часы  Примечание
──────────────────────────────────────────
02.03 Пн    WORK       8.0
03.03 Вт    WORK       9.5   +1.5ч сверхурочные
04.03 Ср    WORK       8.0
05.03 Чт    WORK       10.0  +2.0ч сверхурочные
06.03 Пт    WORK       8.0
07.03 Сб    WORK       6.0   выходной x2
08.03 Вс    HOLIDAY    0.0   Международный женский день
09.03 Пн    SICK       0.0   больничный
10.03 Вт    SICK       0.0   больничный
11.03 Ср    WORK       8.0
12.03 Чт    WORK       8.0
13.03 Пт    VACATION   0.0   отпуск
──────────────────────────────────────────
ИТОГО:
  Рабочих дней:       7
  Всего часов:        65.5
  Сверхурочных часов: 3.5 (x1.5 = 5.25ч оплата)
  Работа в выходные:  6.0ч (x2 = 12.0ч оплата)
  Больничных дней:    2
  Отпускных дней:     1
  Праздничных дней:   1
═══════════════════════════════════════════`,
      hint: 'Создай массивы для хранения данных табеля. Сверхурочные = часы - 8 если часы > 8. DayOfWeek для определения выходных (SATURDAY, SUNDAY). В Казахстане праздники: 1-2 янв, 8 мар, 22 мар, 1 мая, 7 мая, 9 мая, 6 июл, 30 авг, 1 дек, 16-17 дек.',
      solution: `import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class Main {
    public static void main(String[] args) {
        // Табель на часть марта 2026
        LocalDate[] dates = {
            LocalDate.of(2026,3,2), LocalDate.of(2026,3,3), LocalDate.of(2026,3,4),
            LocalDate.of(2026,3,5), LocalDate.of(2026,3,6), LocalDate.of(2026,3,7),
            LocalDate.of(2026,3,8), LocalDate.of(2026,3,9), LocalDate.of(2026,3,10),
            LocalDate.of(2026,3,11), LocalDate.of(2026,3,12), LocalDate.of(2026,3,13)
        };
        String[] types = {"WORK","WORK","WORK","WORK","WORK","WORK",
                          "HOLIDAY","SICK","SICK","WORK","WORK","VACATION"};
        double[] hours = {8.0, 9.5, 8.0, 10.0, 8.0, 6.0, 0.0, 0.0, 0.0, 8.0, 8.0, 0.0};
        String[] notes = {"", "+1.5ч сверхурочные", "", "+2.0ч сверхурочные", "",
                          "выходной x2", "Международный женский день",
                          "больничный", "больничный", "", "", "отпуск"};

        String[] dayNames = {"Пн","Вт","Ср","Чт","Пт","Сб","Вс"};
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd.MM");

        int workDays = 0, sickDays = 0, vacDays = 0, holidays = 0;
        double totalHours = 0, overtimeHours = 0, weekendHours = 0;

        System.out.println("═══════════════════════════════════════════");
        System.out.println("  ТАБЕЛЬ УЧЁТА РАБОЧЕГО ВРЕМЕНИ");
        System.out.println("  Сотрудник: Асанов Нурлан");
        System.out.println("  Период: Март 2026");
        System.out.println("═══════════════════════════════════════════");
        System.out.println("Дата        Тип        Часы  Примечание");
        System.out.println("──────────────────────────────────────────");

        for (int i = 0; i < dates.length; i++) {
            String day = dayNames[dates[i].getDayOfWeek().getValue() - 1];
            System.out.printf("%s %s    %-10s %.1f", fmt.format(dates[i]), day, types[i], hours[i]);
            if (!notes[i].isEmpty()) System.out.print("   " + notes[i]);
            System.out.println();

            switch (types[i]) {
                case "WORK":
                    workDays++;
                    totalHours += hours[i];
                    DayOfWeek dow = dates[i].getDayOfWeek();
                    if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
                        weekendHours += hours[i];
                    } else if (hours[i] > 8) {
                        overtimeHours += hours[i] - 8;
                    }
                    break;
                case "SICK": sickDays++; break;
                case "VACATION": vacDays++; break;
                case "HOLIDAY": holidays++; break;
            }
        }

        System.out.println("──────────────────────────────────────────");
        System.out.println("ИТОГО:");
        System.out.printf("  Рабочих дней:       %d%n", workDays);
        System.out.printf("  Всего часов:        %.1f%n", totalHours);
        System.out.printf("  Сверхурочных часов: %.1f (x1.5 = %.2fч оплата)%n", overtimeHours, overtimeHours * 1.5);
        System.out.printf("  Работа в выходные:  %.1fч (x2 = %.1fч оплата)%n", weekendHours, weekendHours * 2);
        System.out.printf("  Больничных дней:    %d%n", sickDays);
        System.out.printf("  Отпускных дней:     %d%n", vacDays);
        System.out.printf("  Праздничных дней:   %d%n", holidays);
        System.out.println("═══════════════════════════════════════════");
    }
}`,
      explanation: 'Табель учёта рабочего времени (форма Т-13) — обязательный документ по ТК РК. Сверхурочная работа оплачивается не менее x1.5 (ст. 108 ТК РК), работа в выходные — x2 (ст. 109). В 1C:ЗУП табель ведётся автоматически с интеграцией СКУД (системы контроля доступа). Праздничные дни в РК определены Законом о праздниках. DayOfWeek позволяет определить выходные программно.'
    },
    {
      id: 5,
      title: 'Org Structure: Оргструктура',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт HR Core. Jira HR-510: "Визуализация организационной структуры". Дерево подчинённости — обязательный модуль в SAP OM (Organization Management) и 1C:ЗУП. Реализуй древовидную оргструктуру: CEO → директора → менеджеры → сотрудники. Поиск подчинённых, цепочки управления, глубины.',
      requirements: [
        'Древовидная структура: id, name, position, parentId',
        'Метод findSubordinates(id) — все подчинённые (рекурсивно)',
        'Метод getManagerChain(id) — цепочка руководителей до CEO',
        'Метод getDeptHeadcount(id) — количество людей в поддереве',
        'Метод getMaxDepth() — максимальная глубина иерархии',
        'Вывести оргструктуру с отступами (indent tree)'
      ],
      expectedOutput: `=== ОРГАНИЗАЦИОННАЯ СТРУКТУРА ===

Ержанов А.К. (CEO)
  ├── Сатпаев Б.Н. (CTO)
  │   ├── Касымов Д.Р. (Team Lead Backend)
  │   │   ├── Асанов Н.Б. (Senior Developer)
  │   │   └── Омаров К.С. (Junior Developer)
  │   └── Нурланова А.Е. (Team Lead Frontend)
  │       └── Бекова Д.М. (Middle Developer)
  └── Тулегенова М.А. (CFO)
      └── Ибраев С.Т. (Бухгалтер)

--- Подчинённые CTO (Сатпаев Б.Н.) ---
  Касымов Д.Р. (Team Lead Backend)
  Асанов Н.Б. (Senior Developer)
  Омаров К.С. (Junior Developer)
  Нурланова А.Е. (Team Lead Frontend)
  Бекова Д.М. (Middle Developer)
Headcount: 5

--- Цепочка руководителей: Асанов Н.Б. → CEO ---
  Асанов Н.Б. → Касымов Д.Р. → Сатпаев Б.Н. → Ержанов А.К.

Максимальная глубина: 4`,
      hint: 'Храни parentId для каждого узла. Для дерева используй adjacency list: Map<Integer, List<Integer>> children. Рекурсия для обхода поддерева. Для красивого вывода используй "├── " и "└── " с вертикальными линиями "│   ".',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static int[] ids =      {1, 2, 3, 4, 5, 6, 7, 8};
    static String[] names = {"Ержанов А.К.", "Сатпаев Б.Н.", "Тулегенова М.А.",
                             "Касымов Д.Р.", "Нурланова А.Е.", "Асанов Н.Б.",
                             "Омаров К.С.", "Бекова Д.М."};
    static String[] posts = {"CEO", "CTO", "CFO", "Team Lead Backend",
                             "Team Lead Frontend", "Senior Developer",
                             "Junior Developer", "Middle Developer"};
    static int[] parentIds = {-1, 1, 1, 2, 2, 4, 4, 5};

    // Ибраев добавлен отдельно
    static final int SIZE = 9;
    static { ids = new int[]{1,2,3,4,5,6,7,8,9};
             names = new String[]{"Ержанов А.К.","Сатпаев Б.Н.","Тулегенова М.А.",
                     "Касымов Д.Р.","Нурланова А.Е.","Асанов Н.Б.",
                     "Омаров К.С.","Бекова Д.М.","Ибраев С.Т."};
             posts = new String[]{"CEO","CTO","CFO","Team Lead Backend",
                     "Team Lead Frontend","Senior Developer",
                     "Junior Developer","Middle Developer","Бухгалтер"};
             parentIds = new int[]{-1,1,1,2,2,4,4,5,3}; }

    static int indexOf(int id) {
        for (int i = 0; i < SIZE; i++) if (ids[i] == id) return i;
        return -1;
    }

    static List<Integer> getChildren(int id) {
        List<Integer> children = new ArrayList<>();
        for (int i = 0; i < SIZE; i++)
            if (parentIds[i] == id) children.add(ids[i]);
        return children;
    }

    static void printTree(int id, String prefix, boolean isLast) {
        int idx = indexOf(id);
        if (parentIds[idx] == -1) {
            System.out.println(names[idx] + " (" + posts[idx] + ")");
        } else {
            System.out.println(prefix + (isLast ? "└── " : "├── ") + names[idx] + " (" + posts[idx] + ")");
        }
        List<Integer> children = getChildren(id);
        for (int i = 0; i < children.size(); i++) {
            String newPrefix = parentIds[idx] == -1 ? "  " : prefix + (isLast ? "    " : "│   ");
            printTree(children.get(i), newPrefix, i == children.size() - 1);
        }
    }

    static void findAllSubordinates(int id, List<String> result) {
        for (int childId : getChildren(id)) {
            int ci = indexOf(childId);
            result.add(names[ci] + " (" + posts[ci] + ")");
            findAllSubordinates(childId, result);
        }
    }

    static int getHeadcount(int id) {
        int count = 0;
        for (int childId : getChildren(id)) {
            count += 1 + getHeadcount(childId);
        }
        return count;
    }

    static String getManagerChain(int id) {
        StringBuilder sb = new StringBuilder();
        int current = id;
        while (current != -1) {
            int idx = indexOf(current);
            if (sb.length() > 0) sb.append(" → ");
            sb.append(names[idx]);
            current = parentIds[idx];
        }
        return sb.toString();
    }

    static int getMaxDepth(int id) {
        List<Integer> children = getChildren(id);
        if (children.isEmpty()) return 1;
        int max = 0;
        for (int childId : children) {
            max = Math.max(max, getMaxDepth(childId));
        }
        return 1 + max;
    }

    public static void main(String[] args) {
        System.out.println("=== ОРГАНИЗАЦИОННАЯ СТРУКТУРА ===");
        System.out.println();
        printTree(1, "", true);

        System.out.println();
        System.out.println("--- Подчинённые CTO (Сатпаев Б.Н.) ---");
        List<String> subs = new ArrayList<>();
        findAllSubordinates(2, subs);
        for (String s : subs) System.out.println("  " + s);
        System.out.println("Headcount: " + getHeadcount(2));

        System.out.println();
        System.out.println("--- Цепочка руководителей: Асанов Н.Б. → CEO ---");
        System.out.println("  " + getManagerChain(6));

        System.out.println();
        System.out.println("Максимальная глубина: " + getMaxDepth(1));
    }
}`,
      explanation: 'Оргструктура — дерево с отношением "руководитель-подчинённый". В SAP OM это Organization Unit → Position → Person. parentId = -1 означает корень (CEO). Рекурсивный обход (DFS) позволяет найти всех подчинённых, а обход вверх по parentId — цепочку руководителей. Глубина дерева показывает количество уровней иерархии. В реальных системах добавляются: дата назначения, штатное расписание, замещения.'
    },
    {
      id: 6,
      title: 'KPI Tracking: Оценка эффективности',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт Analytics. Jira HR-620: "Система оценки KPI сотрудников". KPI (Key Performance Indicators) — основа для расчёта бонусов. Реализуй: набор показателей с весами, расчёт взвешенного KPI-балла, категоризацию (EXCEEDS/MEETS/BELOW/FAIL) и определение бонусного коэффициента. Аналог модуля Performance в BambooHR и SAP SuccessFactors.',
      requirements: [
        'KPI: key (название), targetValue, actualValue, weight (сумма весов = 100%)',
        'Взвешенный балл: sum(actual/target * weight) — результат 0-100%+',
        'Категории: EXCEEDS (>100%), MEETS (80-100%), BELOW (60-80%), FAIL (<60%)',
        'Бонусный коэффициент: EXCEEDS=1.5, MEETS=1.0, BELOW=0.5, FAIL=0.0',
        'Рассчитать KPI для 2 сотрудников, вывести детальный отчёт'
      ],
      expectedOutput: `════════════════════════════════════════════
  KPI ОТЧЁТ — Q1 2026
════════════════════════════════════════════

Сотрудник: Асанов Нурлан (Senior Developer)
────────────────────────────────────────────
Показатель            Цель    Факт    Вес   Балл
────────────────────────────────────────────
Story Points          40      45      30%   33.8%
Code Review           20      22      20%   22.0%
Bug Rate              5       3       25%   37.5%
Unit Test Coverage    80%     85%     15%   15.9%
Менторство            3       4       10%   13.3%
────────────────────────────────────────────
ИТОГО KPI:            122.5%
Категория:            EXCEEDS ★★★
Бонусный коэффициент: 1.5
Бонус:                127 500 KZT (85000 * 1.5)

Сотрудник: Омаров Кайрат (Junior Developer)
────────────────────────────────────────────
Показатель            Цель    Факт    Вес   Балл
────────────────────────────────────────────
Story Points          25      18      30%   21.6%
Code Review           10      8       20%   16.0%
Bug Rate              10      12      25%   20.8%
Unit Test Coverage    70%     55%     15%   11.8%
Обучение              5       4       10%   8.0%
────────────────────────────────────────────
ИТОГО KPI:            78.2%
Категория:            BELOW ★
Бонусный коэффициент: 0.5
Бонус:                25 000 KZT (50000 * 0.5)`,
      hint: 'Для Bug Rate (чем меньше — тем лучше) инвертируй формулу: target/actual вместо actual/target. Взвешенный балл = actual/target * weight для каждого KPI. Для процентных KPI (Coverage) target и actual уже в процентах.',
      solution: `public class Main {
    public static void main(String[] args) {
        System.out.println("════════════════════════════════════════════");
        System.out.println("  KPI ОТЧЁТ — Q1 2026");
        System.out.println("════════════════════════════════════════════");

        // Employee 1
        String[] kpiNames1 = {"Story Points", "Code Review", "Bug Rate", "Unit Test Coverage", "Менторство"};
        double[] targets1 = {40, 20, 5, 80, 3};
        double[] actuals1 = {45, 22, 3, 85, 4};
        int[] weights1 = {30, 20, 25, 15, 10};
        boolean[] inverse1 = {false, false, true, false, false};
        printKpiReport("Асанов Нурлан", "Senior Developer", 85_000,
                kpiNames1, targets1, actuals1, weights1, inverse1);

        // Employee 2
        String[] kpiNames2 = {"Story Points", "Code Review", "Bug Rate", "Unit Test Coverage", "Обучение"};
        double[] targets2 = {25, 10, 10, 70, 5};
        double[] actuals2 = {18, 8, 12, 55, 4};
        int[] weights2 = {30, 20, 25, 15, 10};
        boolean[] inverse2 = {false, false, true, false, false};
        printKpiReport("Омаров Кайрат", "Junior Developer", 50_000,
                kpiNames2, targets2, actuals2, weights2, inverse2);
    }

    static void printKpiReport(String name, String position, long bonusBase,
                                String[] kpiNames, double[] targets, double[] actuals,
                                int[] weights, boolean[] inverse) {
        System.out.printf("%nСотрудник: %s (%s)%n", name, position);
        System.out.println("────────────────────────────────────────────");
        System.out.printf("%-22s%-8s%-8s%-6s%-6s%n", "Показатель", "Цель", "Факт", "Вес", "Балл");
        System.out.println("────────────────────────────────────────────");

        double totalScore = 0;
        for (int i = 0; i < kpiNames.length; i++) {
            double ratio = inverse[i] ? targets[i] / actuals[i] : actuals[i] / targets[i];
            double score = ratio * weights[i];
            totalScore += score;

            String targetStr = kpiNames[i].contains("Coverage")
                    ? String.format("%.0f%%", targets[i]) : String.format("%.0f", targets[i]);
            String actualStr = kpiNames[i].contains("Coverage")
                    ? String.format("%.0f%%", actuals[i]) : String.format("%.0f", actuals[i]);

            System.out.printf("%-22s%-8s%-8s%-6s%.1f%%%n",
                    kpiNames[i], targetStr, actualStr, weights[i] + "%", score);
        }

        System.out.println("────────────────────────────────────────────");

        String category;
        String stars;
        double bonusCoeff;
        if (totalScore > 100) { category = "EXCEEDS"; stars = "★★★"; bonusCoeff = 1.5; }
        else if (totalScore >= 80) { category = "MEETS"; stars = "★★"; bonusCoeff = 1.0; }
        else if (totalScore >= 60) { category = "BELOW"; stars = "★"; bonusCoeff = 0.5; }
        else { category = "FAIL"; stars = "—"; bonusCoeff = 0.0; }

        long bonus = (long)(bonusBase * bonusCoeff);
        System.out.printf("ИТОГО KPI:            %.1f%%%n", totalScore);
        System.out.printf("Категория:            %s %s%n", category, stars);
        System.out.printf("Бонусный коэффициент: %.1f%n", bonusCoeff);
        System.out.printf("Бонус:                %s KZT (%d * %.1f)%n", formatMoney(bonus), bonusBase, bonusCoeff);
    }

    static String formatMoney(long amount) {
        String s = String.valueOf(amount);
        StringBuilder sb = new StringBuilder();
        int c = 0;
        for (int i = s.length() - 1; i >= 0; i--) {
            if (c > 0 && c % 3 == 0) sb.insert(0, ' ');
            sb.insert(0, s.charAt(i));
            c++;
        }
        return sb.toString();
    }
}`,
      explanation: 'KPI-система — основа Performance Management. В SAP SuccessFactors и BambooHR оценки привязаны к бонусам. Взвешенный KPI позволяет учитывать приоритет: Story Points важнее (30%), чем менторство (10%). Инверсия для Bug Rate означает "чем меньше багов — тем лучше". Бонусный коэффициент напрямую влияет на премию. Категоризация помогает HR принимать решения: FAIL может означать PIP (Performance Improvement Plan), EXCEEDS — повышение.'
    },
    {
      id: 7,
      title: 'Payroll Batch: Массовый расчёт зарплат',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт Payroll. Jira HR-730: "Пакетный расчёт зарплат за месяц". В конце каждого месяца HR запускает массовый расчёт для всех сотрудников. Реализуй batch-расчёт: зарплата каждого, группировка по отделам, итоги по компании и генерация банковского файла для перечисления. Обработай: сотрудников в отпуске (пропорционально) и уволенных (окончательный расчёт).',
      requirements: [
        'Массив сотрудников: name, department, salary, status, IBAN',
        'Для ACTIVE: полный расчёт (gross - удержания)',
        'Для ON_LEAVE: пропорционально отработанным дням (15 из 22)',
        'Для FIRED: окончательный расчёт + компенсация неиспользованного отпуска (10 дней)',
        'Группировка по отделам с subtotal',
        'Генерация банковского файла (имя, IBAN, сумма)'
      ],
      expectedOutput: `════════════════════════════════════════════════════
  ВЕДОМОСТЬ ЗАРПЛАТ — Март 2026
════════════════════════════════════════════════════

--- IT Department ---
  Асанов Нурлан       ACTIVE     850 000 → net 638 550 KZT
  Омаров Кайрат       ACTIVE     450 000 → net 337 950 KZT
  Бекова Динара       ON_LEAVE   600 000 → net 307 022 KZT (15/22 дней)
  Итого IT Department: 3 сотрудника, расход 1 283 522 KZT

--- HR Department ---
  Каримова Айгуль     ACTIVE     650 000 → net 488 150 KZT
  Итого HR Department: 1 сотрудник, расход 488 150 KZT

--- Finance Department ---
  Ибраев Серик        FIRED      550 000 → net 605 682 KZT (оконч. расчёт + компенсация)
  Итого Finance Department: 1 сотрудник, расход 605 682 KZT

════════════════════════════════════════════════════
ИТОГО ПО КОМПАНИИ: 5 сотрудников
Общий расход: 2 377 354 KZT
════════════════════════════════════════════════════

=== БАНКОВСКИЙ ФАЙЛ ===
Асанов Нурлан;KZ12345678901234;638550
Омаров Кайрат;KZ23456789012345;337950
Бекова Динара;KZ34567890123456;307022
Каримова Айгуль;KZ45678901234567;488150
Ибраев Серик;KZ56789012345678;605682`,
      hint: 'Для ON_LEAVE: proportionalSalary = salary * workedDays / totalWorkDays. Для FIRED: finalPay = salary + unusedVacationDays * dailyRate. Удержания (ОПВ 10%, ИПН 10%, ВОСМС 2%) применяются к gross. Банковский файл — CSV формат для загрузки в банк-клиент.',
      solution: `public class Main {
    static String[] names = {"Асанов Нурлан", "Омаров Кайрат", "Бекова Динара",
                             "Каримова Айгуль", "Ибраев Серик"};
    static String[] depts = {"IT Department", "IT Department", "IT Department",
                             "HR Department", "Finance Department"};
    static long[] salaries = {850_000, 450_000, 600_000, 650_000, 550_000};
    static String[] statuses = {"ACTIVE", "ACTIVE", "ON_LEAVE", "ACTIVE", "FIRED"};
    static String[] ibans = {"KZ12345678901234", "KZ23456789012345", "KZ34567890123456",
                             "KZ45678901234567", "KZ56789012345678"};
    static int totalWorkDays = 22;
    static int onLeaveWorkedDays = 15;
    static int unusedVacationDays = 10;

    static long calculateNet(long gross) {
        long opv = gross * 10 / 100;
        long ipn = (gross - opv) * 10 / 100;
        long vosms = gross * 2 / 100;
        return gross - opv - ipn - vosms;
    }

    public static void main(String[] args) {
        System.out.println("════════════════════════════════════════════════════");
        System.out.println("  ВЕДОМОСТЬ ЗАРПЛАТ — Март 2026");
        System.out.println("════════════════════════════════════════════════════");

        long[] netAmounts = new long[names.length];
        String[] processedDepts = new String[0];
        long companyTotal = 0;

        // Get unique departments in order
        String[] uniqueDepts = new String[10];
        int deptCount = 0;
        for (String d : depts) {
            boolean found = false;
            for (int j = 0; j < deptCount; j++)
                if (uniqueDepts[j].equals(d)) { found = true; break; }
            if (!found) uniqueDepts[deptCount++] = d;
        }

        // Calculate net for each
        for (int i = 0; i < names.length; i++) {
            long gross = salaries[i];
            switch (statuses[i]) {
                case "ON_LEAVE":
                    gross = salaries[i] * onLeaveWorkedDays / totalWorkDays;
                    netAmounts[i] = calculateNet(gross);
                    break;
                case "FIRED":
                    long dailyRate = salaries[i] / totalWorkDays;
                    long vacationComp = calculateNet(dailyRate * unusedVacationDays);
                    netAmounts[i] = calculateNet(salaries[i]) + vacationComp;
                    break;
                default:
                    netAmounts[i] = calculateNet(gross);
            }
        }

        // Print by department
        for (int d = 0; d < deptCount; d++) {
            System.out.printf("%n--- %s ---%n", uniqueDepts[d]);
            long deptTotal = 0;
            int deptEmpCount = 0;
            for (int i = 0; i < names.length; i++) {
                if (!depts[i].equals(uniqueDepts[d])) continue;
                deptEmpCount++;
                deptTotal += netAmounts[i];
                String suffix = "";
                if ("ON_LEAVE".equals(statuses[i]))
                    suffix = String.format(" (%d/%d дней)", onLeaveWorkedDays, totalWorkDays);
                else if ("FIRED".equals(statuses[i]))
                    suffix = " (оконч. расчёт + компенсация)";
                System.out.printf("  %-20s %-10s %s → net %s KZT%s%n",
                        names[i], statuses[i], formatMoney(salaries[i]),
                        formatMoney(netAmounts[i]), suffix);
            }
            companyTotal += deptTotal;
            System.out.printf("  Итого %s: %d %s, расход %s KZT%n",
                    uniqueDepts[d], deptEmpCount,
                    deptEmpCount == 1 ? "сотрудник" : "сотрудника",
                    formatMoney(deptTotal));
        }

        System.out.println();
        System.out.println("════════════════════════════════════════════════════");
        System.out.printf("ИТОГО ПО КОМПАНИИ: %d сотрудников%n", names.length);
        System.out.printf("Общий расход: %s KZT%n", formatMoney(companyTotal));
        System.out.println("════════════════════════════════════════════════════");

        System.out.println();
        System.out.println("=== БАНКОВСКИЙ ФАЙЛ ===");
        for (int i = 0; i < names.length; i++) {
            System.out.printf("%s;%s;%d%n", names[i], ibans[i], netAmounts[i]);
        }
    }

    static String formatMoney(long amount) {
        String s = String.valueOf(amount);
        StringBuilder sb = new StringBuilder();
        int c = 0;
        for (int i = s.length() - 1; i >= 0; i--) {
            if (c > 0 && c % 3 == 0) sb.insert(0, ' ');
            sb.insert(0, s.charAt(i));
            c++;
        }
        return sb.toString();
    }
}`,
      explanation: 'Массовый расчёт зарплат (Payroll Run) — ежемесячная процедура в любой компании. В 1C:ЗУП это документ "Начисление зарплаты". Для сотрудников ON_LEAVE зарплата пропорциональна отработанным дням. Для уволенных (FIRED) по ТК РК обязательна компенсация неиспользованного отпуска (ст. 96). Банковский файл (CSV/XML) загружается в систему дистанционного банковского обслуживания (ДБО) для массовых перечислений. IBAN в Казахстане начинается с "KZ".'
    },
    {
      id: 8,
      title: 'Recruitment Pipeline: Найм',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт Recruitment. Jira HR-840: "Воронка найма и аналитика рекрутмента". Tracking кандидатов через pipeline: APPLIED → SCREENING → INTERVIEW → OFFER → HIRED/REJECTED. Как в BambooHR ATS (Applicant Tracking System). Рассчитай конверсии между этапами, среднее время найма и найди bottleneck — этап с максимальным отсевом.',
      requirements: [
        'Массив кандидатов: name, vacancy, stage, appliedDate, stageDate',
        'Pipeline: APPLIED → SCREENING → INTERVIEW → OFFER → HIRED / REJECTED',
        'Для каждой вакансии: кол-во кандидатов на каждом этапе, конверсия между этапами',
        'Среднее время найма (от APPLIED до HIRED)',
        'Определить bottleneck — этап с самой низкой конверсией'
      ],
      expectedOutput: `════════════════════════════════════════════════
  ВОРОНКА НАЙМА — Q1 2026
════════════════════════════════════════════════

Вакансия: Senior Java Developer
──────────────────────────────────────────────
Этап           Кол-во    Конверсия
──────────────────────────────────────────────
APPLIED          45         —
SCREENING        30        66.7%
INTERVIEW        12        40.0%
OFFER             3        25.0%
HIRED             2        66.7%
REJECTED         18
──────────────────────────────────────────────
Итого: 45 кандидатов → 2 нанято
Конверсия воронки: 4.4%
Среднее время найма: 32 дня

Вакансия: QA Engineer
──────────────────────────────────────────────
Этап           Кол-во    Конверсия
──────────────────────────────────────────────
APPLIED          20         —
SCREENING        15        75.0%
INTERVIEW         8        53.3%
OFFER             2        25.0%
HIRED             1        50.0%
REJECTED          7
──────────────────────────────────────────────
Итого: 20 кандидатов → 1 нанято
Конверсия воронки: 5.0%
Среднее время найма: 28 дней

=== BOTTLENECK АНАЛИЗ ===
Senior Java Developer: INTERVIEW → OFFER (25.0%) — максимальный отсев!
QA Engineer: INTERVIEW → OFFER (25.0%) — максимальный отсев!
Рекомендация: улучшить процесс оффера или пересмотреть требования`,
      hint: 'Конверсия = кандидаты_на_этапе / кандидаты_на_предыдущем_этапе * 100. Bottleneck — минимальная конверсия. Время найма: ChronoUnit.DAYS.between(appliedDate, hiredDate). REJECTED могут быть на любом этапе.',
      solution: `public class Main {
    public static void main(String[] args) {
        String[] vacancies = {"Senior Java Developer", "QA Engineer"};
        int[][] stageCounts = {
            {45, 30, 12, 3, 2, 18},  // applied, screening, interview, offer, hired, rejected
            {20, 15, 8, 2, 1, 7}
        };
        int[] avgDays = {32, 28};
        String[] stageNames = {"APPLIED", "SCREENING", "INTERVIEW", "OFFER", "HIRED"};

        System.out.println("════════════════════════════════════════════════");
        System.out.println("  ВОРОНКА НАЙМА — Q1 2026");
        System.out.println("════════════════════════════════════════════════");

        String[] bottleneckStages = new String[vacancies.length];
        double[] bottleneckRates = new double[vacancies.length];

        for (int v = 0; v < vacancies.length; v++) {
            System.out.printf("%nВакансия: %s%n", vacancies[v]);
            System.out.println("──────────────────────────────────────────────");
            System.out.printf("%-15s%-10s%-10s%n", "Этап", "Кол-во", "Конверсия");
            System.out.println("──────────────────────────────────────────────");

            double minConversion = 100.0;
            String minStage = "";

            for (int s = 0; s < 5; s++) {
                String conversion = "—";
                if (s > 0) {
                    double rate = stageCounts[v][s] * 100.0 / stageCounts[v][s - 1];
                    conversion = String.format("%.1f%%", rate);
                    if (rate < minConversion) {
                        minConversion = rate;
                        minStage = stageNames[s - 1] + " → " + stageNames[s];
                    }
                }
                System.out.printf("%-15s%3d       %s%n", stageNames[s], stageCounts[v][s], conversion);
            }
            System.out.printf("%-15s%3d%n", "REJECTED", stageCounts[v][5]);

            bottleneckStages[v] = minStage;
            bottleneckRates[v] = minConversion;

            double funnelConversion = stageCounts[v][4] * 100.0 / stageCounts[v][0];
            System.out.println("──────────────────────────────────────────────");
            System.out.printf("Итого: %d кандидатов → %d нанято%n", stageCounts[v][0], stageCounts[v][4]);
            System.out.printf("Конверсия воронки: %.1f%%%n", funnelConversion);
            System.out.printf("Среднее время найма: %d %s%n", avgDays[v],
                    avgDays[v] % 10 == 1 ? "день" : (avgDays[v] % 10 < 5 ? "дня" : "дней"));
        }

        System.out.println();
        System.out.println("=== BOTTLENECK АНАЛИЗ ===");
        for (int v = 0; v < vacancies.length; v++) {
            System.out.printf("%s: %s (%.1f%%) — максимальный отсев!%n",
                    vacancies[v], bottleneckStages[v], bottleneckRates[v]);
        }
        System.out.println("Рекомендация: улучшить процесс оффера или пересмотреть требования");
    }
}`,
      explanation: 'Воронка найма (Recruitment Funnel) — стандартный инструмент рекрутмента. В BambooHR ATS и аналогах кандидаты проходят stages. Конверсия показывает, сколько % переходят на следующий этап. Bottleneck (узкое место) — этап с минимальной конверсией, требующий внимания. В нашем примере INTERVIEW → OFFER (25%) означает, что оффер получает только каждый четвёртый прошедший интервью. Time-to-hire — ключевая метрика: на рынке IT Казахстана средний показатель 30-45 дней.'
    },
    {
      id: 9,
      title: 'Document Generator: Кадровые документы',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт HR Core. Jira HR-920: "Генератор кадровых документов по шаблонам". Автоматическая генерация приказов и договоров — must-have для HR-системы. Реализуй template engine: шаблоны с переменными {employeeName}, {position}, {salary}, {date}, нумерация "HR-YYYY-NNNN", генерация трудового договора, приказа на отпуск и приказа об увольнении. Аналог модуля "Печатные формы" в 1C:ЗУП.',
      requirements: [
        'Шаблоны документов с переменными в {фигурных скобках}',
        'Template engine: замена {переменных} на значения из Map',
        'Нумерация документов: "HR-YYYY-NNNN" с автоинкрементом',
        'Генерация 3 документов: трудовой договор, приказ на отпуск, приказ об увольнении',
        'Регистрация документов в журнале (реестре)'
      ],
      expectedOutput: `=== ГЕНЕРАТОР КАДРОВЫХ ДОКУМЕНТОВ ===

Документ: HR-2026-0001
──────────────────────────────────────
              ТРУДОВОЙ ДОГОВОР

г. Астана                 15.03.2026

ТОО "TechCorp Kazakhstan" в лице директора Ержанова А.К.,
именуемое "Работодатель", и Асанов Нурлан Бекович,
именуемый "Работник", заключили настоящий договор:

1. Работник принимается на должность: Senior Java Developer
2. Отдел: IT Department
3. Дата начала работы: 15.03.2026
4. Оклад: 850 000 KZT в месяц
5. Испытательный срок: 3 месяца
6. Ежегодный отпуск: 24 календарных дня

Работодатель: ___________    Работник: ___________
──────────────────────────────────────

Документ: HR-2026-0002
──────────────────────────────────────
              ПРИКАЗ №HR-2026-0002
         О предоставлении отпуска

от 20.05.2026                г. Астана

Предоставить Каримовой Айгуль Сериковне,
должность: HR Manager, отдел: HR Department,
ежегодный оплачиваемый отпуск:
с 01.06.2026 по 14.06.2026 (14 календарных дней).
Отпускные: 310 580 KZT

Основание: заявление от 20.05.2026
Директор: ___________ Ержанов А.К.
──────────────────────────────────────

Документ: HR-2026-0003
──────────────────────────────────────
              ПРИКАЗ №HR-2026-0003
            Об увольнении работника

от 28.02.2026                г. Астана

Уволить Ибраева Серика Тулегеновича,
должность: Бухгалтер, отдел: Finance Department,
с 01.03.2026 по собственному желанию (п.5 ст.49 ТК РК).

Произвести окончательный расчёт:
  Зарплата за февраль: 550 000 KZT
  Компенсация отпуска (10 дней): 187 713 KZT
  Итого к выплате: 737 713 KZT

Основание: заявление от 14.02.2026
Директор: ___________ Ержанов А.К.
──────────────────────────────────────

=== РЕЕСТР ДОКУМЕНТОВ ===
HR-2026-0001  15.03.2026  Трудовой договор       Асанов Нурлан Бекович
HR-2026-0002  20.05.2026  Приказ на отпуск       Каримова Айгуль Сериковна
HR-2026-0003  28.02.2026  Приказ об увольнении   Ибраев Серик Тулегенович`,
      hint: 'Для template engine используй String.replace() или Pattern/Matcher для замены {переменных}. Нумерация: String.format("HR-%d-%04d", year, counter++). Шаблоны можно хранить как multiline строки (text blocks Java 17). Реестр — простой журнал всех сгенерированных документов.',
      solution: `import java.util.HashMap;
import java.util.Map;

public class Main {
    static int docCounter = 0;
    static String[] regNumbers = new String[10];
    static String[] regDates = new String[10];
    static String[] regTypes = new String[10];
    static String[] regNames = new String[10];
    static int regCount = 0;

    static String nextDocNumber() {
        docCounter++;
        return String.format("HR-2026-%04d", docCounter);
    }

    static String fillTemplate(String template, Map<String, String> vars) {
        String result = template;
        for (Map.Entry<String, String> e : vars.entrySet()) {
            result = result.replace("{" + e.getKey() + "}", e.getValue());
        }
        return result;
    }

    static void registerDoc(String number, String date, String type, String name) {
        regNumbers[regCount] = number;
        regDates[regCount] = date;
        regTypes[regCount] = type;
        regNames[regCount] = name;
        regCount++;
    }

    public static void main(String[] args) {
        System.out.println("=== ГЕНЕРАТОР КАДРОВЫХ ДОКУМЕНТОВ ===");

        // Document 1: Employment contract
        String contractTemplate = """
              ТРУДОВОЙ ДОГОВОР

г. Астана                 {date}

ТОО "TechCorp Kazakhstan" в лице директора Ержанова А.К.,
именуемое "Работодатель", и {employeeName},
именуемый "Работник", заключили настоящий договор:

1. Работник принимается на должность: {position}
2. Отдел: {department}
3. Дата начала работы: {date}
4. Оклад: {salary} KZT в месяц
5. Испытательный срок: 3 месяца
6. Ежегодный отпуск: 24 календарных дня

Работодатель: ___________    Работник: ___________""";

        Map<String, String> vars1 = new HashMap<>();
        vars1.put("employeeName", "Асанов Нурлан Бекович");
        vars1.put("position", "Senior Java Developer");
        vars1.put("department", "IT Department");
        vars1.put("salary", "850 000");
        vars1.put("date", "15.03.2026");

        String docNum1 = nextDocNumber();
        System.out.printf("%nДокумент: %s%n", docNum1);
        System.out.println("──────────────────────────────────────");
        System.out.println(fillTemplate(contractTemplate, vars1));
        System.out.println("──────────────────────────────────────");
        registerDoc(docNum1, "15.03.2026", "Трудовой договор", "Асанов Нурлан Бекович");

        // Document 2: Vacation order
        String vacationTemplate = """
              ПРИКАЗ №{docNumber}
         О предоставлении отпуска

от {orderDate}                г. Астана

Предоставить {employeeName},
должность: {position}, отдел: {department},
ежегодный оплачиваемый отпуск:
с {startDate} по {endDate} ({days} календарных дней).
Отпускные: {vacationPay} KZT

Основание: заявление от {orderDate}
Директор: ___________ Ержанов А.К.""";

        String docNum2 = nextDocNumber();
        Map<String, String> vars2 = new HashMap<>();
        vars2.put("docNumber", docNum2);
        vars2.put("employeeName", "Каримовой Айгуль Сериковне");
        vars2.put("position", "HR Manager");
        vars2.put("department", "HR Department");
        vars2.put("orderDate", "20.05.2026");
        vars2.put("startDate", "01.06.2026");
        vars2.put("endDate", "14.06.2026");
        vars2.put("days", "14");
        vars2.put("vacationPay", "310 580");

        System.out.printf("%nДокумент: %s%n", docNum2);
        System.out.println("──────────────────────────────────────");
        System.out.println(fillTemplate(vacationTemplate, vars2));
        System.out.println("──────────────────────────────────────");
        registerDoc(docNum2, "20.05.2026", "Приказ на отпуск", "Каримова Айгуль Сериковна");

        // Document 3: Termination order
        String terminationTemplate = """
              ПРИКАЗ №{docNumber}
            Об увольнении работника

от {orderDate}                г. Астана

Уволить {employeeName},
должность: {position}, отдел: {department},
с {terminationDate} по собственному желанию (п.5 ст.49 ТК РК).

Произвести окончательный расчёт:
  Зарплата за февраль: {salary} KZT
  Компенсация отпуска ({unusedDays} дней): {vacationComp} KZT
  Итого к выплате: {totalPay} KZT

Основание: заявление от {applicationDate}
Директор: ___________ Ержанов А.К.""";

        String docNum3 = nextDocNumber();
        Map<String, String> vars3 = new HashMap<>();
        vars3.put("docNumber", docNum3);
        vars3.put("employeeName", "Ибраева Серика Тулегеновича");
        vars3.put("position", "Бухгалтер");
        vars3.put("department", "Finance Department");
        vars3.put("orderDate", "28.02.2026");
        vars3.put("terminationDate", "01.03.2026");
        vars3.put("salary", "550 000");
        vars3.put("unusedDays", "10");
        vars3.put("vacationComp", "187 713");
        vars3.put("totalPay", "737 713");
        vars3.put("applicationDate", "14.02.2026");

        System.out.printf("%nДокумент: %s%n", docNum3);
        System.out.println("──────────────────────────────────────");
        System.out.println(fillTemplate(terminationTemplate, vars3));
        System.out.println("──────────────────────────────────────");
        registerDoc(docNum3, "28.02.2026", "Приказ об увольнении", "Ибраев Серик Тулегенович");

        // Registry
        System.out.println();
        System.out.println("=== РЕЕСТР ДОКУМЕНТОВ ===");
        for (int i = 0; i < regCount; i++) {
            System.out.printf("%-14s%-12s%-23s%s%n",
                    regNumbers[i], regDates[i], regTypes[i], regNames[i]);
        }
    }
}`,
      explanation: 'Генерация кадровых документов — критичный модуль HR-системы. В 1C:ЗУП это "Печатные формы", в SAP — Smart Forms. Наш template engine заменяет {переменные} на значения — упрощённая версия Mustache/Handlebars. Нумерация HR-YYYY-NNNN обеспечивает уникальность и прослеживаемость. В реальных проектах документы генерируются в PDF (Apache PDFBox), подписываются ЭЦП (NCALayer в Казахстане) и хранятся в ECM-системе. Ссылки на ТК РК (п.5 ст.49) — обязательны в приказах.'
    },
    {
      id: 10,
      title: 'HR Analytics: Аналитика',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт Analytics. Jira HR-1050: "HR-дашборд с ключевыми метриками". HR-аналитика — основа для принятия решений руководством. Реализуй дашборд: headcount по отделам, текучесть кадров (turnover rate), средний стаж, распределение зарплат, гендерное соотношение, средний возраст. Выяви отделы с высокой текучестью (>20%). Аналог SAP Analytics Cloud HR или People Analytics в BambooHR.',
      requirements: [
        'Headcount по отделам (сгруппировать)',
        'Turnover rate = уволенных за период / среднесписочная численность * 100%',
        'Средний стаж (в годах), средний возраст',
        'Распределение зарплат: min, max, median, avg по отделам',
        'Гендерное соотношение (M/F)',
        'Выделить отделы с turnover >20%',
        'Month-over-month: headcount за последние 3 месяца'
      ],
      expectedOutput: `╔══════════════════════════════════════════════════════╗
║              HR DASHBOARD — Q1 2026                  ║
╠══════════════════════════════════════════════════════╣

║ HEADCOUNT ПО ОТДЕЛАМ:                                ║
║ ──────────────────────────────────────────────        ║
║ IT Department          15 чел   ████████████████     ║
║ HR Department           5 чел   ██████               ║
║ Finance Department      8 чел   █████████            ║
║ Sales Department       12 чел   █████████████        ║
║ ──────────────────────────────────────────────        ║
║ ИТОГО:                 40 чел                        ║

║ ТЕКУЧЕСТЬ КАДРОВ (Turnover Rate):                    ║
║ ──────────────────────────────────────────────        ║
║ IT Department           6.7%    ✓ норма              ║
║ HR Department          20.0%    ✓ норма              ║
║ Finance Department     25.0%    ⚠ ВЫСОКАЯ ТЕКУЧЕСТЬ  ║
║ Sales Department       33.3%    ⚠ ВЫСОКАЯ ТЕКУЧЕСТЬ  ║

║ СРЕДНИЙ СТАЖ И ВОЗРАСТ:                              ║
║ ──────────────────────────────────────────────        ║
║ Средний стаж:          3.2 года                      ║
║ Средний возраст:       31.5 лет                      ║
║ Гендерное соотношение: М 62% / Ж 38%                 ║

║ РАСПРЕДЕЛЕНИЕ ЗАРПЛАТ (KZT):                         ║
║ ──────────────────────────────────────────────        ║
║ Отдел            Min       Max       Avg       Median ║
║ IT Department    350 000   1 200 000 680 000   650 000║
║ HR Department    400 000   750 000   560 000   550 000║
║ Finance          380 000   900 000   590 000   550 000║
║ Sales            300 000   850 000   520 000   480 000║

║ MONTH-OVER-MONTH HEADCOUNT:                          ║
║ ──────────────────────────────────────────────        ║
║ Январь 2026:    42 чел                               ║
║ Февраль 2026:   41 чел  (-1, -2.4%)                  ║
║ Март 2026:      40 чел  (-1, -2.4%)                  ║
║ Тренд: ↓ снижение                                    ║

╠══════════════════════════════════════════════════════╣
║ ⚠ ВНИМАНИЕ: отделы с высокой текучестью (>20%):      ║
║   - Finance Department (25.0%) — 2 увольнения        ║
║   - Sales Department (33.3%) — 4 увольнения          ║
║ Рекомендация: провести exit-интервью, пересмотреть   ║
║ компенсацию и условия труда в проблемных отделах.    ║
╚══════════════════════════════════════════════════════╝`,
      hint: 'Turnover Rate = (уволенных за квартал / среднесписочная) * 100%. Median — отсортировать зарплаты, взять среднее значение. Для визуальных баров используй символ █ пропорционально headcount. Нормальная текучесть IT — 10-15%, выше 20% — тревожный сигнал.',
      solution: `import java.util.Arrays;

public class Main {
    // Departments data
    static String[] depts = {"IT Department", "HR Department", "Finance Department", "Sales Department"};
    static int[] headcounts = {15, 5, 8, 12};
    static int[] firedQ1 = {1, 1, 2, 4};
    static int[] avgHeadcounts = {15, 5, 8, 12};

    // Salary distributions per department
    static long[][] salaries = {
        {350_000, 450_000, 520_000, 550_000, 600_000, 650_000, 650_000, 700_000,
         720_000, 750_000, 800_000, 850_000, 900_000, 1_000_000, 1_200_000},
        {400_000, 480_000, 550_000, 620_000, 750_000},
        {380_000, 420_000, 500_000, 550_000, 580_000, 620_000, 700_000, 900_000},
        {300_000, 350_000, 380_000, 420_000, 450_000, 480_000, 520_000, 580_000,
         650_000, 720_000, 800_000, 850_000}
    };

    // Demographics
    static int totalMale = 25;
    static int totalFemale = 15;
    static double avgTenure = 3.2;
    static double avgAge = 31.5;

    // Month over month
    static String[] months = {"Январь 2026", "Февраль 2026", "Март 2026"};
    static int[] monthlyHeadcount = {42, 41, 40};

    public static void main(String[] args) {
        int totalHC = 0;
        for (int h : headcounts) totalHC += h;

        System.out.println("╔══════════════════════════════════════════════════════╗");
        System.out.println("║              HR DASHBOARD — Q1 2026                  ║");
        System.out.println("╠══════════════════════════════════════════════════════╣");

        // Headcount
        System.out.println();
        System.out.println("║ HEADCOUNT ПО ОТДЕЛАМ:                                ║");
        System.out.println("║ ──────────────────────────────────────────────        ║");
        for (int i = 0; i < depts.length; i++) {
            String bar = "█".repeat(headcounts[i]);
            System.out.printf("║ %-22s%2d чел   %-21s║%n", depts[i], headcounts[i], bar);
        }
        System.out.println("║ ──────────────────────────────────────────────        ║");
        System.out.printf("║ ИТОГО:                 %2d чел                        ║%n", totalHC);

        // Turnover
        System.out.println();
        System.out.println("║ ТЕКУЧЕСТЬ КАДРОВ (Turnover Rate):                    ║");
        System.out.println("║ ──────────────────────────────────────────────        ║");
        for (int i = 0; i < depts.length; i++) {
            double rate = firedQ1[i] * 100.0 / avgHeadcounts[i];
            String status = rate > 20 ? "⚠ ВЫСОКАЯ ТЕКУЧЕСТЬ" : "✓ норма";
            System.out.printf("║ %-22s%5.1f%%    %-22s║%n", depts[i], rate, status);
        }

        // Demographics
        System.out.println();
        System.out.println("║ СРЕДНИЙ СТАЖ И ВОЗРАСТ:                              ║");
        System.out.println("║ ──────────────────────────────────────────────        ║");
        System.out.printf("║ Средний стаж:          %.1f года                      ║%n", avgTenure);
        System.out.printf("║ Средний возраст:       %.1f лет                      ║%n", avgAge);
        int malePercent = totalMale * 100 / (totalMale + totalFemale);
        int femalePercent = 100 - malePercent;
        System.out.printf("║ Гендерное соотношение: М %d%% / Ж %d%%                 ║%n",
                malePercent, femalePercent);

        // Salary distribution
        System.out.println();
        System.out.println("║ РАСПРЕДЕЛЕНИЕ ЗАРПЛАТ (KZT):                         ║");
        System.out.println("║ ──────────────────────────────────────────────        ║");
        System.out.printf("║ %-17s%-10s%-10s%-10s%-8s║%n", "Отдел", "Min", "Max", "Avg", "Median");
        for (int i = 0; i < depts.length; i++) {
            long[] s = salaries[i];
            Arrays.sort(s);
            long min = s[0];
            long max = s[s.length - 1];
            long sum = 0;
            for (long v : s) sum += v;
            long avg = sum / s.length;
            long median = s.length % 2 == 0
                    ? (s[s.length / 2 - 1] + s[s.length / 2]) / 2
                    : s[s.length / 2];
            String deptName = depts[i].length() > 17 ? depts[i].substring(0, 17) : depts[i];
            System.out.printf("║ %-17s%-10s%-10s%-10s%-8s║%n",
                    deptName, formatM(min), formatM(max), formatM(avg), formatM(median));
        }

        // Month over month
        System.out.println();
        System.out.println("║ MONTH-OVER-MONTH HEADCOUNT:                          ║");
        System.out.println("║ ──────────────────────────────────────────────        ║");
        for (int i = 0; i < months.length; i++) {
            if (i == 0) {
                System.out.printf("║ %-17s%2d чел                               ║%n",
                        months[i], monthlyHeadcount[i]);
            } else {
                int diff = monthlyHeadcount[i] - monthlyHeadcount[i - 1];
                double pct = diff * 100.0 / monthlyHeadcount[i - 1];
                System.out.printf("║ %-17s%2d чел  (%d, %.1f%%)                  ║%n",
                        months[i], monthlyHeadcount[i], diff, pct);
            }
        }
        String trend = monthlyHeadcount[2] < monthlyHeadcount[0] ? "↓ снижение" :
                        monthlyHeadcount[2] > monthlyHeadcount[0] ? "↑ рост" : "→ стабильно";
        System.out.printf("║ Тренд: %-46s║%n", trend);

        // Alerts
        System.out.println();
        System.out.println("╠══════════════════════════════════════════════════════╣");
        System.out.println("║ ⚠ ВНИМАНИЕ: отделы с высокой текучестью (>20%):      ║");
        for (int i = 0; i < depts.length; i++) {
            double rate = firedQ1[i] * 100.0 / avgHeadcounts[i];
            if (rate > 20) {
                System.out.printf("║   - %s (%.1f%%) — %d увольнения        ║%n",
                        depts[i], rate, firedQ1[i]);
            }
        }
        System.out.println("║ Рекомендация: провести exit-интервью, пересмотреть   ║");
        System.out.println("║ компенсацию и условия труда в проблемных отделах.    ║");
        System.out.println("╚══════════════════════════════════════════════════════╝");
    }

    static String formatM(long amount) {
        String s = String.valueOf(amount);
        StringBuilder sb = new StringBuilder();
        int c = 0;
        for (int i = s.length() - 1; i >= 0; i--) {
            if (c > 0 && c % 3 == 0) sb.insert(0, ' ');
            sb.insert(0, s.charAt(i));
            c++;
        }
        return sb.toString();
    }
}`,
      explanation: 'HR-аналитика (People Analytics) — стратегический инструмент. В SAP SuccessFactors Workforce Analytics и BambooHR Reports эти метрики доступны из коробки. Turnover Rate > 20% — тревожный сигнал, норма для IT — 10-15%. Медиана зарплаты точнее среднего (не искажается выбросами). Гендерное соотношение важно для ESG-отчётности. Month-over-month тренд показывает динамику роста/сокращения. В реальных проектах данные подтягиваются из хранилища (Data Warehouse) через SQL/OLAP, визуализируются в Grafana, Power BI или встроенных дашбордах.'
    }
  ]
}
