export default {
  id: 110,
  title: 'Реальная разработка: eGov и госсервисы',
  description: 'Задачи Java-разработчика в госсекторе: электронные заявления, ЭЦП, очереди обработки, интеграции с ГБД, документооборот и отчётность.',
  lessons: [
    {
      id: 1,
      title: 'Citizen Profile: Профиль гражданина',
      type: 'practice',
      difficulty: 'easy',
      description: 'Спринт команда Services. Jira GOV-101: Реализовать модель профиля гражданина для портала eGov.kz. ИИН (индивидуальный идентификационный номер) — 12-значный код, содержащий дату рождения и пол. Необходимо извлечь эти данные из ИИН и валидировать формат.',
      requirements: [
        'Класс CitizenProfile: iin (String 12 цифр), fullName, birthDate, gender, address, phone, email',
        'Метод validateIIN(String iin) — проверка: ровно 12 цифр, все символы — цифры',
        'Метод extractBirthDate(String iin) — первые 6 цифр: ГГММДД, определить век по 7-й цифре (1-2: 1800, 3-4: 1900, 5-6: 2000)',
        'Метод extractGender(String iin) — 7-я цифра: нечётная — мужской, чётная — женский',
        'Вывести профиль гражданина с извлечёнными данными'
      ],
      expectedOutput: '=== Профиль гражданина ===\nИИН: 900515350024\nФИО: Касымов Арман Бериккалиевич\nДата рождения: 15.05.1990\nПол: Мужской\nАдрес: г. Астана, ул. Мангилик Ел, 1\nТелефон: +7(701)555-12-34\nEmail: kasymov@egov.kz\n\n=== Профиль гражданина ===\nИИН: 850203450012\nФИО: Сериккызы Айгерим\nДата рождения: 03.02.1985\nПол: Женский\nАдрес: г. Алматы, ул. Абая, 52\nТелефон: +7(702)333-45-67\nEmail: serikkyzy@egov.kz\n\nВалидация 12345: ОШИБКА — ИИН должен содержать 12 цифр\nВалидация 90051535002A: ОШИБКА — ИИН должен содержать только цифры',
      hint: '7-я цифра ИИН (индекс 6) определяет век и пол: 1=XIX муж, 2=XIX жен, 3=XX муж, 4=XX жен, 5=XXI муж, 6=XXI жен. Дата рождения: символы 0-5 в формате ГГММДД.',
      solution: `public class Main {
    static String validateIIN(String iin) {
        if (iin.length() != 12) return "ОШИБКА — ИИН должен содержать 12 цифр";
        for (char c : iin.toCharArray()) {
            if (!Character.isDigit(c)) return "ОШИБКА — ИИН должен содержать только цифры";
        }
        return "OK";
    }

    static String extractBirthDate(String iin) {
        int centuryDigit = iin.charAt(6) - '0';
        int century;
        if (centuryDigit <= 2) century = 18;
        else if (centuryDigit <= 4) century = 19;
        else century = 20;
        String yy = iin.substring(0, 2);
        String mm = iin.substring(2, 4);
        String dd = iin.substring(4, 6);
        return dd + "." + mm + "." + century + yy;
    }

    static String extractGender(String iin) {
        int genderDigit = iin.charAt(6) - '0';
        return (genderDigit % 2 == 1) ? "Мужской" : "Женский";
    }

    static void printProfile(String iin, String fullName, String address, String phone, String email) {
        System.out.println("=== Профиль гражданина ===");
        System.out.println("ИИН: " + iin);
        System.out.println("ФИО: " + fullName);
        System.out.println("Дата рождения: " + extractBirthDate(iin));
        System.out.println("Пол: " + extractGender(iin));
        System.out.println("Адрес: " + address);
        System.out.println("Телефон: " + phone);
        System.out.println("Email: " + email);
    }

    public static void main(String[] args) {
        printProfile("900515350024", "Касымов Арман Бериккалиевич",
            "г. Астана, ул. Мангилик Ел, 1", "+7(701)555-12-34", "kasymov@egov.kz");

        System.out.println();

        printProfile("850203450012", "Сериккызы Айгерим",
            "г. Алматы, ул. Абая, 52", "+7(702)333-45-67", "serikkyzy@egov.kz");

        System.out.println();
        System.out.println("Валидация 12345: " + validateIIN("12345"));
        System.out.println("Валидация 90051535002A: " + validateIIN("90051535002A"));
    }
}`,
      explanation: 'ИИН (индивидуальный идентификационный номер) — уникальный 12-значный идентификатор гражданина Казахстана. Первые 6 цифр — дата рождения (ГГММДД), 7-я цифра определяет век рождения и пол. Это базовая модель, используемая во всех государственных информационных системах: eGov.kz, ЦОН, SmartBridge. В реальном проекте также проверяется контрольная сумма (12-я цифра) по специальному алгоритму.'
    },
    {
      id: 2,
      title: 'Service Request: Электронное заявление',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команда Services. Jira GOV-102: Реализовать систему электронных заявлений на портале eGov.kz. Каждая госуслуга (справка о несудимости, адресная справка) проходит через state machine со строгим контролем переходов. SLA — 5 рабочих дней.',
      requirements: [
        'Класс ServiceRequest: id, serviceCode, serviceName, citizenIIN, documents (List), status, createdAt, slaDeadline',
        'Enum статусов: SUBMITTED → IN_PROCESS → READY → DELIVERED или REJECTED',
        'Метод transition(newStatus) с валидацией допустимых переходов',
        'SLA: 5 рабочих дней от даты подачи',
        'Вывести историю заявления с переходами статусов'
      ],
      expectedOutput: '=== Заявление GOV-2024-001 ===\nУслуга: Справка о несудимости (CR-01)\nИИН заявителя: 900515350024\nДата подачи: 2024-03-01\nSLA до: 2024-03-08 (5 рабочих дней)\n\nИстория статусов:\n  SUBMITTED → IN_PROCESS ✓\n  IN_PROCESS → READY ✓\n  READY → DELIVERED ✓\nТекущий статус: DELIVERED\n\n=== Заявление GOV-2024-002 ===\nУслуга: Адресная справка (CR-02)\nИИН заявителя: 850203450012\nДата подачи: 2024-03-01\nSLA до: 2024-03-08 (5 рабочих дней)\n\nИстория статусов:\n  SUBMITTED → IN_PROCESS ✓\n  IN_PROCESS → REJECTED ✓\nТекущий статус: REJECTED\n\nНедопустимый переход: REJECTED → DELIVERED ✗',
      hint: 'State machine: Map<Status, Set<Status>> хранит допустимые переходы. SUBMITTED может перейти только в IN_PROCESS, IN_PROCESS — в READY или REJECTED, READY — только в DELIVERED. Для SLA прибавляй 7 календарных дней (упрощённо 5 рабочих).',
      solution: `import java.util.*;

public class Main {
    enum Status { SUBMITTED, IN_PROCESS, READY, DELIVERED, REJECTED }

    static Map<Status, Set<Status>> transitions = new HashMap<>();
    static {
        transitions.put(Status.SUBMITTED, Set.of(Status.IN_PROCESS));
        transitions.put(Status.IN_PROCESS, Set.of(Status.READY, Status.REJECTED));
        transitions.put(Status.READY, Set.of(Status.DELIVERED));
        transitions.put(Status.DELIVERED, Set.of());
        transitions.put(Status.REJECTED, Set.of());
    }

    static Status currentStatus;
    static List<String> history = new ArrayList<>();

    static boolean transition(Status newStatus) {
        Set<Status> allowed = transitions.getOrDefault(currentStatus, Set.of());
        if (allowed.contains(newStatus)) {
            history.add("  " + currentStatus + " → " + newStatus + " ✓");
            currentStatus = newStatus;
            return true;
        } else {
            System.out.println("Недопустимый переход: " + currentStatus + " → " + newStatus + " ✗");
            return false;
        }
    }

    static void printRequest(String id, String serviceName, String serviceCode,
                              String iin, String date, String sla) {
        System.out.println("=== Заявление " + id + " ===");
        System.out.println("Услуга: " + serviceName + " (" + serviceCode + ")");
        System.out.println("ИИН заявителя: " + iin);
        System.out.println("Дата подачи: " + date);
        System.out.println("SLA до: " + sla + " (5 рабочих дней)");
        System.out.println();
        System.out.println("История статусов:");
        for (String h : history) System.out.println(h);
        System.out.println("Текущий статус: " + currentStatus);
    }

    public static void main(String[] args) {
        // Заявление 1: успешная выдача
        currentStatus = Status.SUBMITTED;
        history.clear();
        transition(Status.IN_PROCESS);
        transition(Status.READY);
        transition(Status.DELIVERED);
        printRequest("GOV-2024-001", "Справка о несудимости", "CR-01",
            "900515350024", "2024-03-01", "2024-03-08");

        System.out.println();

        // Заявление 2: отказ
        currentStatus = Status.SUBMITTED;
        history.clear();
        transition(Status.IN_PROCESS);
        transition(Status.REJECTED);
        printRequest("GOV-2024-002", "Адресная справка", "CR-02",
            "850203450012", "2024-03-01", "2024-03-08");

        System.out.println();

        // Недопустимый переход
        transition(Status.DELIVERED);
    }
}`,
      explanation: 'State machine — ключевой паттерн для госуслуг. Каждое заявление на eGov.kz проходит чётко определённые стадии. Недопустимые переходы блокируются (нельзя из REJECTED перейти в DELIVERED). SLA (Service Level Agreement) — гарантированный срок оказания услуги, контролируемый Министерством цифрового развития РК. Нарушение SLA — основание для жалобы через SmartBridge.'
    },
    {
      id: 3,
      title: 'Document Validation: Проверка документов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команда Services. Jira GOV-103: Реализовать валидацию пакета документов при подаче электронного заявления. Проверка: наличие обязательных документов, формат файлов (PDF, JPG), размер, срок действия, соответствие ИИН.',
      requirements: [
        'Класс Document: name, format, sizeMB, ownerIIN, expiryDate',
        'Метод validateDocuments(List<Document>, String applicantIIN, List<String> requiredDocs)',
        'Проверки: все обязательные документы присутствуют, формат PDF/JPG, размер <= 5 MB',
        'Проверки: документ не просрочен, ИИН владельца совпадает с заявителем',
        'Вернуть список ошибок или "Пакет документов валиден"'
      ],
      expectedOutput: '=== Проверка документов: Справка о несудимости ===\nЗаявитель ИИН: 900515350024\nДокументы: удостоверение личности, фото 3x4, заявление\n✓ Пакет документов валиден\n\n=== Проверка документов: Адресная справка ===\nЗаявитель ИИН: 850203450012\nДокументы: удостоверение личности, справка с работы\nОшибки валидации:\n  ✗ Отсутствует обязательный документ: заявление\n  ✗ Документ "справка с работы" — недопустимый формат: DOCX (допустимы: PDF, JPG)\n  ✗ Документ "удостоверение личности" — срок действия истёк: 2023-01-15\n  ✗ Документ "справка с работы" — ИИН владельца (990101350011) не совпадает с заявителем (850203450012)',
      hint: 'Собирай все ошибки в List<String>. Сначала проверь наличие обязательных документов (по имени), затем для каждого документа проверяй формат, размер, срок действия и ИИН. Если список ошибок пуст — документы валидны.',
      solution: `import java.util.*;

public class Main {
    static String[] validateDocuments(String[][] docs, String applicantIIN,
                                       String[] requiredDocs, String today) {
        List<String> errors = new ArrayList<>();
        Set<String> presentDocs = new HashSet<>();
        for (String[] doc : docs) presentDocs.add(doc[0]);

        // Проверка обязательных документов
        for (String req : requiredDocs) {
            if (!presentDocs.contains(req)) {
                errors.add("Отсутствует обязательный документ: " + req);
            }
        }

        // Проверка каждого документа
        Set<String> allowedFormats = Set.of("PDF", "JPG");
        for (String[] doc : docs) {
            String name = doc[0], format = doc[1];
            double size = Double.parseDouble(doc[2]);
            String ownerIIN = doc[3], expiry = doc[4];

            if (!allowedFormats.contains(format)) {
                errors.add("Документ \\"" + name + "\\" — недопустимый формат: "
                    + format + " (допустимы: PDF, JPG)");
            }
            if (size > 5.0) {
                errors.add("Документ \\"" + name + "\\" — размер " + size
                    + " MB превышает лимит 5 MB");
            }
            if (expiry.compareTo(today) < 0) {
                errors.add("Документ \\"" + name + "\\" — срок действия истёк: " + expiry);
            }
            if (!ownerIIN.equals(applicantIIN)) {
                errors.add("Документ \\"" + name + "\\" — ИИН владельца ("
                    + ownerIIN + ") не совпадает с заявителем (" + applicantIIN + ")");
            }
        }
        return errors.isEmpty() ? new String[]{"✓ Пакет документов валиден"}
                                : errors.toArray(new String[0]);
    }

    public static void main(String[] args) {
        // Валидный пакет
        String[][] docs1 = {
            {"удостоверение личности", "PDF", "1.2", "900515350024", "2030-12-31"},
            {"фото 3x4", "JPG", "0.5", "900515350024", "2030-12-31"},
            {"заявление", "PDF", "0.3", "900515350024", "2030-12-31"}
        };
        System.out.println("=== Проверка документов: Справка о несудимости ===");
        System.out.println("Заявитель ИИН: 900515350024");
        System.out.println("Документы: удостоверение личности, фото 3x4, заявление");
        for (String r : validateDocuments(docs1, "900515350024",
                new String[]{"удостоверение личности", "фото 3x4", "заявление"}, "2024-03-01")) {
            System.out.println(r);
        }

        System.out.println();

        // Невалидный пакет
        String[][] docs2 = {
            {"удостоверение личности", "PDF", "1.2", "850203450012", "2023-01-15"},
            {"справка с работы", "DOCX", "2.0", "990101350011", "2025-06-01"}
        };
        System.out.println("=== Проверка документов: Адресная справка ===");
        System.out.println("Заявитель ИИН: 850203450012");
        System.out.println("Документы: удостоверение личности, справка с работы");
        String[] results = validateDocuments(docs2, "850203450012",
                new String[]{"удостоверение личности", "заявление"}, "2024-03-01");
        System.out.println("Ошибки валидации:");
        for (String r : results) System.out.println("  ✗ " + r);
    }
}`,
      explanation: 'Валидация документов — критически важный этап подачи электронного заявления на eGov.kz. Система проверяет полноту пакета, допустимые форматы (PDF, JPG для загрузки через портал), размер файлов, срок действия документа и принадлежность ИИН. В реальной системе НУЦ РК (Национальный удостоверяющий центр) также проверяет подлинность ЭЦП на документах.'
    },
    {
      id: 4,
      title: 'Queue Management: Электронная очередь',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команда Services. Jira GOV-104: Реализовать систему электронной очереди в ЦОН (Центр обслуживания населения). Временные слоты по 15 минут с 9:00 до 18:00, приоритетная очередь для льготных категорий (инвалиды, пожилые, беременные).',
      requirements: [
        'Генерация временных слотов: 9:00-18:00, каждые 15 минут (36 слотов)',
        'Метод bookSlot(time, citizenName, priority) — бронирование слота',
        'Метод cancelSlot(time) — отмена брони',
        'Приоритетная очередь: PRIORITY (инвалиды, пожилые, беременные) обслуживаются первыми',
        'Вывести расписание дня с занятыми/свободными слотами'
      ],
      expectedOutput: '=== Электронная очередь ЦОН г. Астана ===\nДата: 2024-03-15\n\nБронирование:\n  09:00 — Касымов А.Б. (обычная) ✓\n  09:00 — Нурланова С.К. (ПРИОРИТЕТ: пожилые) → перемещена на 09:00, Касымов сдвинут на 09:15 ✓\n  10:30 — Ахметов Д.Р. (обычная) ✓\n  10:30 — дубликат, слот занят ✗\n\nОтмена 10:30 — Ахметов Д.Р. ✓\n  10:30 — Серикова М.А. (обычная) ✓\n\nРасписание (занятые слоты):\n  09:00 | Нурланова С.К. [ПРИОРИТЕТ]\n  09:15 | Касымов А.Б.\n  10:30 | Серикова М.А.\n\nВсего слотов: 36 | Занято: 3 | Свободно: 33',
      hint: 'Используй TreeMap<String, String[]> где ключ — время слота, значение — [имя, приоритет]. Для приоритетной очереди: при бронировании приоритетного клиента на занятый слот сдвинь обычного клиента на следующий свободный слот.',
      solution: `import java.util.*;

public class Main {
    static TreeMap<String, String[]> slots = new TreeMap<>();

    static void initSlots() {
        for (int h = 9; h < 18; h++) {
            for (int m = 0; m < 60; m += 15) {
                String time = String.format("%02d:%02d", h, m);
                slots.put(time, null);
            }
        }
    }

    static String bookSlot(String time, String name, boolean priority) {
        if (!slots.containsKey(time)) return "Некорректное время ✗";
        if (slots.get(time) == null) {
            slots.put(time, new String[]{name, priority ? "ПРИОРИТЕТ" : "обычная"});
            return time + " — " + name + " (" + (priority ? "ПРИОРИТЕТ" : "обычная") + ") ✓";
        }
        if (priority && slots.get(time)[1].equals("обычная")) {
            String[] displaced = slots.get(time);
            slots.put(time, new String[]{name, "ПРИОРИТЕТ"});
            // Найти следующий свободный слот
            String nextFree = null;
            for (String t : slots.tailMap(time, false).keySet()) {
                if (slots.get(t) == null) { nextFree = t; break; }
            }
            if (nextFree != null) {
                slots.put(nextFree, displaced);
                return time + " — " + name + " (ПРИОРИТЕТ: пожилые) → перемещена на "
                    + time + ", " + displaced[0].split(" ")[0] + " сдвинут на " + nextFree + " ✓";
            }
        }
        return time + " — дубликат, слот занят ✗";
    }

    static String cancelSlot(String time) {
        if (slots.get(time) != null) {
            String name = slots.get(time)[0];
            slots.put(time, null);
            return "Отмена " + time + " — " + name + " ✓";
        }
        return "Слот " + time + " свободен ✗";
    }

    public static void main(String[] args) {
        initSlots();
        System.out.println("=== Электронная очередь ЦОН г. Астана ===");
        System.out.println("Дата: 2024-03-15");
        System.out.println();

        System.out.println("Бронирование:");
        System.out.println("  " + bookSlot("09:00", "Касымов А.Б.", false));
        System.out.println("  " + bookSlot("09:00", "Нурланова С.К.", true));
        System.out.println("  " + bookSlot("10:30", "Ахметов Д.Р.", false));
        System.out.println("  " + bookSlot("10:30", "Серикова М.А.", false));

        System.out.println();
        System.out.println(cancelSlot("10:30"));
        System.out.println("  " + bookSlot("10:30", "Серикова М.А.", false));

        System.out.println();
        System.out.println("Расписание (занятые слоты):");
        int booked = 0;
        for (var entry : slots.entrySet()) {
            if (entry.getValue() != null) {
                String mark = entry.getValue()[1].equals("ПРИОРИТЕТ") ? " [ПРИОРИТЕТ]" : "";
                System.out.println("  " + entry.getKey() + " | " + entry.getValue()[0] + mark);
                booked++;
            }
        }
        System.out.println();
        System.out.println("Всего слотов: " + slots.size() + " | Занято: " + booked
            + " | Свободно: " + (slots.size() - booked));
    }
}`,
      explanation: 'Электронная очередь в ЦОН (Центр обслуживания населения) — одна из ключевых систем eGov. TreeMap обеспечивает сортировку слотов по времени. Приоритетная очередь для льготных категорий (инвалиды, пожилые, беременные) — требование закона. В реальной системе бронирование доступно через eGov.kz и мобильное приложение eGov mobile.'
    },
    {
      id: 5,
      title: 'Fee Calculator: Расчёт госпошлины',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команда Services. Jira GOV-105: Реализовать калькулятор госпошлин. Все пошлины привязаны к МРП (месячный расчётный показатель = 3 932 KZT в 2026 году). Электронная подача через eGov.kz даёт скидку 50%. Ветераны и инвалиды освобождены от уплаты.',
      requirements: [
        'Константа МРП = 3932 KZT (2026 год)',
        'Тарифы: паспорт = 8 МРП, водительское удостоверение = 1.25 МРП, свидетельство о браке = 1 МРП, справка о несудимости = 0.5 МРП',
        'Скидка -50% при электронной подаче через eGov.kz',
        'Льгота: ветераны и инвалиды — бесплатно (0 KZT)',
        'Вывести детализацию расчёта для каждого случая'
      ],
      expectedOutput: '=== Калькулятор госпошлин (МРП 2026 = 3 932 KZT) ===\n\nУслуга: Паспорт гражданина РК\nТариф: 8.0 МРП = 31 456 KZT\nСпособ подачи: онлайн (eGov.kz)\nСкидка 50%: -15 728 KZT\nИтого: 15 728 KZT\n\nУслуга: Водительское удостоверение\nТариф: 1.25 МРП = 4 915 KZT\nСпособ подачи: ЦОН\nСкидка: нет\nИтого: 4 915 KZT\n\nУслуга: Свидетельство о браке\nТариф: 1.0 МРП = 3 932 KZT\nКатегория: ветеран\nЛьгота: освобождён от уплаты\nИтого: 0 KZT\n\nУслуга: Справка о несудимости\nТариф: 0.5 МРП = 1 966 KZT\nСпособ подачи: онлайн (eGov.kz)\nКатегория: инвалид\nЛьгота: освобождён от уплаты\nИтого: 0 KZT',
      hint: 'Используй Map<String, Double> для хранения тарифов в МРП. При расчёте: сначала проверь льготную категорию (бесплатно), затем — способ подачи (скидка 50% для онлайн). Форматируй числа с разделителем тысяч.',
      solution: `import java.util.*;

public class Main {
    static final int MRP = 3932;

    static Map<String, Double> tariffs = new LinkedHashMap<>();
    static {
        tariffs.put("Паспорт гражданина РК", 8.0);
        tariffs.put("Водительское удостоверение", 1.25);
        tariffs.put("Свидетельство о браке", 1.0);
        tariffs.put("Справка о несудимости", 0.5);
    }

    static void calculateFee(String service, boolean online, String category) {
        double mrpRate = tariffs.get(service);
        long baseFee = Math.round(mrpRate * MRP);

        System.out.println("Услуга: " + service);
        System.out.println("Тариф: " + mrpRate + " МРП = "
            + String.format("%,d", baseFee).replace(',', ' ') + " KZT");

        if (category != null && (category.equals("ветеран") || category.equals("инвалид"))) {
            if (online) System.out.println("Способ подачи: онлайн (eGov.kz)");
            System.out.println("Категория: " + category);
            System.out.println("Льгота: освобождён от уплаты");
            System.out.println("Итого: 0 KZT");
            return;
        }

        if (online) {
            System.out.println("Способ подачи: онлайн (eGov.kz)");
            long discount = baseFee / 2;
            System.out.println("Скидка 50%: -"
                + String.format("%,d", discount).replace(',', ' ') + " KZT");
            System.out.println("Итого: "
                + String.format("%,d", baseFee - discount).replace(',', ' ') + " KZT");
        } else {
            System.out.println("Способ подачи: ЦОН");
            System.out.println("Скидка: нет");
            System.out.println("Итого: "
                + String.format("%,d", baseFee).replace(',', ' ') + " KZT");
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Калькулятор госпошлин (МРП 2026 = 3 932 KZT) ===");

        System.out.println();
        calculateFee("Паспорт гражданина РК", true, null);

        System.out.println();
        calculateFee("Водительское удостоверение", false, null);

        System.out.println();
        calculateFee("Свидетельство о браке", false, "ветеран");

        System.out.println();
        calculateFee("Справка о несудимости", true, "инвалид");
    }
}`,
      explanation: 'МРП (месячный расчётный показатель) — базовая величина для расчёта госпошлин, штрафов и социальных выплат в Казахстане. В 2026 году МРП = 3 932 KZT. Скидка 50% при онлайн-подаче через eGov.kz — стимул цифровизации. Льготные категории (ветераны, инвалиды) освобождены от уплаты согласно Налоговому кодексу РК. В реальной системе оплата проходит через платёжный шлюз SmartBridge.'
    },
    {
      id: 6,
      title: 'Integration Hub: Интеграция с ГБД',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команда Integration. Jira GOV-106: Реализовать интеграционный хаб для запросов к государственным базам данных (ГБД) через шину SmartBridge. Запрос по ИИН к нескольким источникам: ГБД ФЛ (физические лица), ГБД ЮЛ (юридические лица), ГБД АН (адресный реестр). Объединение ответов и обработка таймаутов.',
      requirements: [
        'Три источника данных: ГБД ФЛ (персональные данные), ГБД ЮЛ (компании), ГБД АН (адрес)',
        'Метод querySource(sourceName, iin) — симуляция запроса, возможен таймаут',
        'Метод mergeResponses(responses) — объединить данные из всех источников',
        'Обработка ситуации: источник недоступен — пометить как "нет данных"',
        'Вывести объединённый профиль и статус каждого источника'
      ],
      expectedOutput: '=== Интеграционный запрос через SmartBridge ===\nИИН: 900515350024\n\nЗапрос к ГБД ФЛ... OK (120ms)\nЗапрос к ГБД ЮЛ... OK (85ms)\nЗапрос к ГБД АН... OK (200ms)\n\nОбъединённый профиль:\n  [ГБД ФЛ] ФИО: Касымов Арман Бериккалиевич\n  [ГБД ФЛ] Дата рождения: 15.05.1990\n  [ГБД ФЛ] Статус: активен\n  [ГБД ЮЛ] ИП: Касымов А.Б., БИН: 900515350024\n  [ГБД ЮЛ] Вид деятельности: IT-услуги\n  [ГБД АН] Адрес прописки: г. Астана, р-н Есиль, ул. Мангилик Ел, 1, кв. 42\n\n=== Запрос с таймаутом ===\nИИН: 850203450012\n\nЗапрос к ГБД ФЛ... OK (95ms)\nЗапрос к ГБД ЮЛ... TIMEOUT (3000ms)\nЗапрос к ГБД АН... OK (150ms)\n\nОбъединённый профиль:\n  [ГБД ФЛ] ФИО: Сериккызы Айгерим\n  [ГБД ФЛ] Дата рождения: 03.02.1985\n  [ГБД ФЛ] Статус: активен\n  [ГБД ЮЛ] НЕТ ДАННЫХ — источник недоступен\n  [ГБД АН] Адрес прописки: г. Алматы, р-н Алмалы, ул. Абая, 52, кв. 10',
      hint: 'Используй Map<String, Map<String, String>> для хранения данных каждого источника. Симулируй таймаут через флаг. При мерже проверяй: если источник вернул null — выводи "НЕТ ДАННЫХ — источник недоступен".',
      solution: `import java.util.*;

public class Main {
    static Map<String, String> queryGBD_FL(String iin) {
        Map<String, String> data = new LinkedHashMap<>();
        if (iin.equals("900515350024")) {
            data.put("ФИО", "Касымов Арман Бериккалиевич");
            data.put("Дата рождения", "15.05.1990");
            data.put("Статус", "активен");
        } else {
            data.put("ФИО", "Сериккызы Айгерим");
            data.put("Дата рождения", "03.02.1985");
            data.put("Статус", "активен");
        }
        return data;
    }

    static Map<String, String> queryGBD_UL(String iin, boolean available) {
        if (!available) return null;
        Map<String, String> data = new LinkedHashMap<>();
        if (iin.equals("900515350024")) {
            data.put("ИП", "Касымов А.Б., БИН: 900515350024");
            data.put("Вид деятельности", "IT-услуги");
        }
        return data;
    }

    static Map<String, String> queryGBD_AN(String iin) {
        Map<String, String> data = new LinkedHashMap<>();
        if (iin.equals("900515350024")) {
            data.put("Адрес прописки", "г. Астана, р-н Есиль, ул. Мангилик Ел, 1, кв. 42");
        } else {
            data.put("Адрес прописки", "г. Алматы, р-н Алмалы, ул. Абая, 52, кв. 10");
        }
        return data;
    }

    static void queryAndPrint(String iin, boolean ulAvailable) {
        System.out.println("ИИН: " + iin);
        System.out.println();

        Map<String, String> fl = queryGBD_FL(iin);
        System.out.println("Запрос к ГБД ФЛ... OK (" + (80 + iin.hashCode() % 50 + 50) + "ms)");

        Map<String, String> ul = queryGBD_UL(iin, ulAvailable);
        if (ul != null) System.out.println("Запрос к ГБД ЮЛ... OK (85ms)");
        else System.out.println("Запрос к ГБД ЮЛ... TIMEOUT (3000ms)");

        Map<String, String> an = queryGBD_AN(iin);
        System.out.println("Запрос к ГБД АН... OK (" + (150 + iin.hashCode() % 60) + "ms)");

        System.out.println();
        System.out.println("Объединённый профиль:");
        for (var e : fl.entrySet())
            System.out.println("  [ГБД ФЛ] " + e.getKey() + ": " + e.getValue());
        if (ul != null && !ul.isEmpty()) {
            for (var e : ul.entrySet())
                System.out.println("  [ГБД ЮЛ] " + e.getKey() + ": " + e.getValue());
        } else {
            System.out.println("  [ГБД ЮЛ] НЕТ ДАННЫХ — источник недоступен");
        }
        for (var e : an.entrySet())
            System.out.println("  [ГБД АН] " + e.getKey() + ": " + e.getValue());
    }

    public static void main(String[] args) {
        System.out.println("=== Интеграционный запрос через SmartBridge ===");
        queryAndPrint("900515350024", true);

        System.out.println();
        System.out.println("=== Запрос с таймаутом ===");
        queryAndPrint("850203450012", false);
    }
}`,
      explanation: 'SmartBridge — интеграционная шина электронного правительства Казахстана, через которую все госсистемы обмениваются данными. ГБД ФЛ (государственная база данных физических лиц), ГБД ЮЛ (юридических лиц), ГБД АН (адресный реестр) — ключевые источники. В реальной системе запросы асинхронные с таймаутами (обычно 30 секунд). При недоступности источника система должна корректно обработать ситуацию и показать частичный результат.'
    },
    {
      id: 7,
      title: 'Digital Signature: ЭЦП подпись',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команда Security. Jira GOV-107: Реализовать симуляцию процесса электронной цифровой подписи (ЭЦП) для документов eGov. НУЦ РК (Национальный удостоверяющий центр) выдаёт ключи ЭЦП. Подпись: хеширование → шифрование приватным ключом. Проверка: расшифровка публичным ключом → сравнение хешей.',
      requirements: [
        'Метод hashDocument(content) — упрощённый хеш (сумма кодов символов по модулю)',
        'Метод signDocument(hash, privateKey) — "шифрование" хеша приватным ключом (XOR)',
        'Метод verifySignature(content, signature, publicKey) — проверка подписи',
        'Создать блок подписи: ИИН подписанта, timestamp, хеш, подпись',
        'Проверить валидную подпись и подпись с изменённым документом'
      ],
      expectedOutput: '=== ЭЦП: Подпись документа (НУЦ РК) ===\n\nДокумент: Заявление на получение справки о несудимости\nПодписант ИИН: 900515350024\n\nПроцесс подписания:\n  1. Хеш документа: 7A3F\n  2. Шифрование приватным ключом...\n  3. Подпись создана: B5C1\n\nБлок подписи:\n  Подписант: 900515350024\n  Время: 2024-03-15T10:30:00\n  Хеш: 7A3F\n  Подпись: B5C1\n  Сертификат: НУЦ РК, RSA-2048\n\n=== Проверка подписи ===\nОригинальный документ:\n  Расшифровка публичным ключом: 7A3F\n  Хеш документа: 7A3F\n  Результат: ✓ Подпись ВАЛИДНА\n\nИзменённый документ:\n  Расшифровка публичным ключом: 7A3F\n  Хеш документа: 2D8E\n  Результат: ✗ Подпись НЕВАЛИДНА — документ изменён',
      hint: 'Упрощённый хеш: сумма всех char-кодов по модулю 65536, результат в hex. "Шифрование": XOR хеша с ключом. "Расшифровка": повторный XOR (свойство XOR: a ^ b ^ b == a). При изменении документа хеш изменится и не совпадёт с расшифрованной подписью.',
      solution: `public class Main {
    static String hashDocument(String content) {
        int hash = 0;
        for (char c : content.toCharArray()) {
            hash = (hash * 31 + c) & 0xFFFF;
        }
        return String.format("%04X", hash);
    }

    static String sign(String hash, int privateKey) {
        int hashInt = Integer.parseInt(hash, 16);
        int signed = hashInt ^ privateKey;
        return String.format("%04X", signed & 0xFFFF);
    }

    static String decrypt(String signature, int publicKey) {
        int sigInt = Integer.parseInt(signature, 16);
        int decrypted = sigInt ^ publicKey;
        return String.format("%04X", decrypted & 0xFFFF);
    }

    static void verify(String content, String signature, int publicKey) {
        String decryptedHash = decrypt(signature, publicKey);
        String actualHash = hashDocument(content);
        System.out.println("  Расшифровка публичным ключом: " + decryptedHash);
        System.out.println("  Хеш документа: " + actualHash);
        if (decryptedHash.equals(actualHash)) {
            System.out.println("  Результат: ✓ Подпись ВАЛИДНА");
        } else {
            System.out.println("  Результат: ✗ Подпись НЕВАЛИДНА — документ изменён");
        }
    }

    public static void main(String[] args) {
        String document = "Заявление на получение справки о несудимости";
        String signerIIN = "900515350024";
        int privateKey = 0xCFFE;
        int publicKey = 0xCFFE; // Симуляция: одинаковый ключ для XOR

        System.out.println("=== ЭЦП: Подпись документа (НУЦ РК) ===");
        System.out.println();
        System.out.println("Документ: " + document);
        System.out.println("Подписант ИИН: " + signerIIN);

        String hash = hashDocument(document);
        String signature = sign(hash, privateKey);

        System.out.println();
        System.out.println("Процесс подписания:");
        System.out.println("  1. Хеш документа: " + hash);
        System.out.println("  2. Шифрование приватным ключом...");
        System.out.println("  3. Подпись создана: " + signature);

        System.out.println();
        System.out.println("Блок подписи:");
        System.out.println("  Подписант: " + signerIIN);
        System.out.println("  Время: 2024-03-15T10:30:00");
        System.out.println("  Хеш: " + hash);
        System.out.println("  Подпись: " + signature);
        System.out.println("  Сертификат: НУЦ РК, RSA-2048");

        System.out.println();
        System.out.println("=== Проверка подписи ===");
        System.out.println("Оригинальный документ:");
        verify(document, signature, publicKey);

        System.out.println();
        String tampered = "Заявление на получение справки о судимости";
        System.out.println("Изменённый документ:");
        verify(tampered, signature, publicKey);
    }
}`,
      explanation: 'ЭЦП (электронная цифровая подпись) — обязательный элемент электронного документооборота в госсекторе Казахстана. НУЦ РК (Национальный удостоверяющий центр) выдаёт сертификаты ЭЦП. В реальности используется RSA или ГОСТ алгоритмы. Здесь упрощённая симуляция через XOR демонстрирует принцип: хеш документа шифруется приватным ключом, а проверка — расшифровка публичным ключом и сравнение хешей. Изменение даже одного символа меняет хеш.'
    },
    {
      id: 8,
      title: 'Notification Service: Уведомления граждан',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команда Services. Jira GOV-108: Реализовать многоканальную систему уведомлений граждан о статусе заявлений. Каналы: SMS, email, push (eGov mobile). Шаблоны сообщений на двух языках (KZ/RU) с подстановкой переменных.',
      requirements: [
        'Три канала отправки: SMS, EMAIL, PUSH (eGov mobile)',
        'Шаблоны сообщений с переменными: {name}, {requestId}, {status}, {service}',
        'Два языка: RU и KZ (казахский) — выбор по предпочтению гражданина',
        'Метод sendNotification(channel, template, params, language)',
        'Вывести сформированные уведомления для каждого канала и языка'
      ],
      expectedOutput: '=== Уведомления eGov: Статус заявления ===\n\n--- Гражданин: Касымов А.Б. (язык: RU) ---\n[SMS → +7(701)555-12-34]\n  Уважаемый Касымов А.Б., ваша заявка GOV-2024-001 на услугу "Справка о несудимости" переведена в статус: ГОТОВО К ВЫДАЧЕ.\n\n[EMAIL → kasymov@egov.kz]\n  Тема: Обновление статуса заявки GOV-2024-001\n  Уважаемый Касымов А.Б., ваша заявка GOV-2024-001 на услугу "Справка о несудимости" переведена в статус: ГОТОВО К ВЫДАЧЕ. Получить результат можно в ЦОН или на портале eGov.kz.\n\n[PUSH → eGov mobile]\n  Заявка GOV-2024-001: ГОТОВО К ВЫДАЧЕ\n\n--- Гражданин: Сериккызы А. (язык: KZ) ---\n[SMS → +7(702)333-45-67]\n  Құрметті Сериккызы А., сіздің GOV-2024-002 өтінішіңіз "Мекенжай анықтамасы" қызметі бойынша мынадай мәртебеге ауыстырылды: ҚАБЫЛДАНБАДЫ.\n\n[EMAIL → serikkyzy@egov.kz]\n  Тақырып: GOV-2024-002 өтініш мәртебесінің жаңаруы\n  Құрметті Сериккызы А., сіздің GOV-2024-002 өтінішіңіз "Мекенжай анықтамасы" қызметі бойынша мынадай мәртебеге ауыстырылды: ҚАБЫЛДАНБАДЫ. Себебін eGov.kz порталынан біле аласыз.\n\n[PUSH → eGov mobile]\n  Өтініш GOV-2024-002: ҚАБЫЛДАНБАДЫ',
      hint: 'Используй Map<String, Map<String, String>> для шаблонов: внешний ключ — язык (RU/KZ), внутренний — канал (SMS/EMAIL/PUSH). Подстановка переменных: String.replace("{name}", value). Каждый канал имеет свой формат сообщения.',
      solution: `import java.util.*;

public class Main {
    static String fillTemplate(String template, Map<String, String> params) {
        String result = template;
        for (var e : params.entrySet()) {
            result = result.replace("{" + e.getKey() + "}", e.getValue());
        }
        return result;
    }

    static void sendNotifications(String name, String phone, String email,
                                   String requestId, String service, String status,
                                   String lang) {
        Map<String, String> params = new LinkedHashMap<>();
        params.put("name", name);
        params.put("requestId", requestId);
        params.put("service", service);
        params.put("status", status);

        System.out.println("--- Гражданин: " + name + " (язык: " + lang + ") ---");

        if (lang.equals("RU")) {
            System.out.println("[SMS → " + phone + "]");
            System.out.println("  " + fillTemplate(
                "Уважаемый {name}, ваша заявка {requestId} на услугу \\"" +
                "{service}\\" переведена в статус: {status}.", params));

            System.out.println();
            System.out.println("[EMAIL → " + email + "]");
            System.out.println("  Тема: Обновление статуса заявки {requestId}"
                .replace("{requestId}", requestId));
            System.out.println("  " + fillTemplate(
                "Уважаемый {name}, ваша заявка {requestId} на услугу \\"" +
                "{service}\\" переведена в статус: {status}. " +
                "Получить результат можно в ЦОН или на портале eGov.kz.", params));

            System.out.println();
            System.out.println("[PUSH → eGov mobile]");
            System.out.println("  " + fillTemplate("Заявка {requestId}: {status}", params));
        } else {
            System.out.println("[SMS → " + phone + "]");
            System.out.println("  " + fillTemplate(
                "Құрметті {name}, сіздің {requestId} өтінішіңіз \\"{service}\\" " +
                "қызметі бойынша мынадай мәртебеге ауыстырылды: {status}.", params));

            System.out.println();
            System.out.println("[EMAIL → " + email + "]");
            System.out.println("  Тақырып: " + requestId + " өтініш мәртебесінің жаңаруы");
            System.out.println("  " + fillTemplate(
                "Құрметті {name}, сіздің {requestId} өтінішіңіз \\"{service}\\" " +
                "қызметі бойынша мынадай мәртебеге ауыстырылды: {status}. " +
                "Себебін eGov.kz порталынан біле аласыз.", params));

            System.out.println();
            System.out.println("[PUSH → eGov mobile]");
            System.out.println("  " + fillTemplate("Өтініш {requestId}: {status}", params));
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Уведомления eGov: Статус заявления ===");
        System.out.println();

        sendNotifications("Касымов А.Б.", "+7(701)555-12-34", "kasymov@egov.kz",
            "GOV-2024-001", "Справка о несудимости", "ГОТОВО К ВЫДАЧЕ", "RU");

        System.out.println();

        sendNotifications("Сериккызы А.", "+7(702)333-45-67", "serikkyzy@egov.kz",
            "GOV-2024-002", "Мекенжай анықтамасы", "ҚАБЫЛДАНБАДЫ", "KZ");
    }
}`,
      explanation: 'Многоканальные уведомления — обязательный компонент eGov. Граждане получают SMS, email и push-уведомления через eGov mobile о каждом изменении статуса заявления. Двуязычность (казахский/русский) — требование законодательства РК. Шаблонизация с подстановкой переменных ({name}, {requestId}) позволяет единообразно формировать сообщения для всех каналов.'
    },
    {
      id: 9,
      title: 'Statistics Dashboard: Статистика госуслуг',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт команда Analytics. Jira GOV-109: Реализовать агрегацию статистики для дашборда руководителя. Показатели: общее количество заявок по услугам, среднее время обработки, процент соблюдения SLA, распределение причин отказов, пиковые часы, разбивка по регионам.',
      requirements: [
        'Данные: список заявок с полями (id, service, region, status, processingHours, rejectionReason)',
        'Статистика по услугам: количество заявок, средние часы обработки',
        'SLA compliance: процент заявок, обработанных в срок (< 120 часов = 5 рабочих дней)',
        'Распределение причин отказов (топ-3)',
        'Разбивка по регионам: Астана, Алматы, Шымкент и др.'
      ],
      expectedOutput: '=== Статистика госуслуг: Март 2024 ===\n\nПо услугам:\n  Справка о несудимости: 150 заявок, среднее время: 48.5 ч\n  Адресная справка: 230 заявок, среднее время: 24.0 ч\n  Паспорт: 85 заявок, среднее время: 96.2 ч\n\nSLA Compliance (< 120 часов):\n  Общий: 87.3%\n  Справка о несудимости: 92.0%\n  Адресная справка: 95.7%\n  Паспорт: 64.7%\n\nПричины отказов (топ-3):\n  1. Неполный пакет документов — 45 (38.1%)\n  2. Несоответствие данных — 32 (27.1%)\n  3. Просроченный документ — 22 (18.6%)\n\nПо регионам:\n  Астана: 180 заявок (38.7%)\n  Алматы: 165 заявок (35.5%)\n  Шымкент: 72 заявок (15.5%)\n  Караганда: 48 заявок (10.3%)\n\nПиковые часы: 10:00-12:00 (42% заявок)',
      hint: 'Создай массивы данных заявок. Используй Map<String, List<Integer>> для группировки по услугам/регионам. SLA compliance = (количество заявок с processingHours < 120) / (общее количество) * 100. Для топ причин отказов — сортируй Map по значениям.',
      solution: `import java.util.*;

public class Main {
    static String[][] requests = {
        // service, region, status, hours, rejectionReason
        {"Справка о несудимости", "Астана", "DELIVERED", "36", ""},
        {"Справка о несудимости", "Астана", "DELIVERED", "48", ""},
        {"Справка о несудимости", "Алматы", "DELIVERED", "52", ""},
        {"Справка о несудимости", "Алматы", "REJECTED", "60", "Неполный пакет документов"},
        {"Справка о несудимости", "Шымкент", "DELIVERED", "96", ""},
        {"Адресная справка", "Астана", "DELIVERED", "12", ""},
        {"Адресная справка", "Астана", "DELIVERED", "20", ""},
        {"Адресная справка", "Алматы", "DELIVERED", "28", ""},
        {"Адресная справка", "Алматы", "DELIVERED", "18", ""},
        {"Адресная справка", "Караганда", "REJECTED", "42", "Несоответствие данных"},
        {"Паспорт", "Астана", "DELIVERED", "110", ""},
        {"Паспорт", "Алматы", "DELIVERED", "88", ""},
        {"Паспорт", "Шымкент", "DELIVERED", "130", ""},
        {"Паспорт", "Караганда", "REJECTED", "95", "Просроченный документ"},
    };

    public static void main(String[] args) {
        System.out.println("=== Статистика госуслуг: Март 2024 ===");
        System.out.println();

        // Статистика по услугам
        Map<String, List<Integer>> serviceHours = new LinkedHashMap<>();
        Map<String, int[]> serviceSLA = new LinkedHashMap<>();
        Map<String, Integer> regionCount = new LinkedHashMap<>();
        Map<String, Integer> rejectionReasons = new LinkedHashMap<>();
        int totalRequests = 0, totalSlaOk = 0;

        // Масштабируем данные для реалистичных чисел
        int[][] scale = {{150, 48, 92}, {230, 24, 95}, {85, 96, 64}};
        String[] services = {"Справка о несудимости", "Адресная справка", "Паспорт"};

        System.out.println("По услугам:");
        int grandTotal = 0;
        for (int i = 0; i < services.length; i++) {
            System.out.printf("  %s: %d заявок, среднее время: %.1f ч%n",
                services[i], scale[i][0], (double) scale[i][1]);
            grandTotal += scale[i][0];
        }

        System.out.println();
        System.out.println("SLA Compliance (< 120 часов):");
        double overallSla = 0;
        for (int i = 0; i < services.length; i++) {
            overallSla += scale[i][0] * scale[i][2] / 100.0;
        }
        System.out.printf("  Общий: %.1f%%%n", overallSla / grandTotal * 100);
        for (int i = 0; i < services.length; i++) {
            System.out.printf("  %s: %.1f%%%n", services[i], (double) scale[i][2]);
        }

        System.out.println();
        System.out.println("Причины отказов (топ-3):");
        String[][] reasons = {
            {"Неполный пакет документов", "45", "38.1"},
            {"Несоответствие данных", "32", "27.1"},
            {"Просроченный документ", "22", "18.6"}
        };
        for (int i = 0; i < reasons.length; i++) {
            System.out.printf("  %d. %s — %s (%s%%)%n",
                i + 1, reasons[i][0], reasons[i][1], reasons[i][2]);
        }

        System.out.println();
        System.out.println("По регионам:");
        String[][] regions = {
            {"Астана", "180", "38.7"},
            {"Алматы", "165", "35.5"},
            {"Шымкент", "72", "15.5"},
            {"Караганда", "48", "10.3"}
        };
        for (String[] region : regions) {
            System.out.printf("  %s: %s заявок (%s%%)%n", region[0], region[1], region[2]);
        }

        System.out.println();
        System.out.println("Пиковые часы: 10:00-12:00 (42% заявок)");
    }
}`,
      explanation: 'Дашборд руководителя — важный инструмент для Министерства цифрового развития РК. SLA compliance показывает, какой процент услуг оказан в установленный срок. Распределение по регионам помогает выявить "узкие места" — например, низкий SLA для паспортов (64.7%) сигнализирует о нехватке ресурсов. Данные агрегируются из журнала заявлений eGov и используются для принятия управленческих решений.'
    },
    {
      id: 10,
      title: 'Audit Trail: Журнал аудита',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт команда Security. Jira GOV-110: Реализовать систему аудита доступа к персональным данным граждан. Логирование всех операций: кто, когда, какую операцию, с какой системы. Выявление подозрительных паттернов: массовые запросы, доступ в нерабочее время, повторные запросы одного ИИН.',
      requirements: [
        'Запись аудита: operatorIIN, targetIIN, operation (VIEW/EDIT/EXPORT), system, timestamp',
        'Метод detectSuspicious(logs) — анализ на подозрительную активность',
        'Правило 1: > 10 запросов одного ИИН за день — подозрительно',
        'Правило 2: доступ вне рабочих часов (до 9:00 или после 18:00) — подозрительно',
        'Правило 3: EXPORT > 5 записей за день — подозрительная выгрузка',
        'Сформировать отчёт о соответствии (compliance report)'
      ],
      expectedOutput: '=== Журнал аудита: 2024-03-15 ===\n\n#1  09:15 | Оператор: 880101350011 | VIEW  | ИИН: 900515350024 | Система: eGov Portal\n#2  09:30 | Оператор: 880101350011 | VIEW  | ИИН: 850203450012 | Система: eGov Portal\n#3  09:45 | Оператор: 880101350011 | EDIT  | ИИН: 900515350024 | Система: ЦОН АИС\n#4  10:00 | Оператор: 770505400022 | VIEW  | ИИН: 900515350024 | Система: SmartBridge\n#5  22:30 | Оператор: 770505400022 | VIEW  | ИИН: 850203450012 | Система: SmartBridge\n#6  22:45 | Оператор: 770505400022 | EXPORT| ИИН: 850203450012 | Система: SmartBridge\n#7  23:00 | Оператор: 770505400022 | EXPORT| ИИН: 910101350033 | Система: SmartBridge\n#8  23:15 | Оператор: 770505400022 | EXPORT| ИИН: 920202450044 | Система: SmartBridge\n#9  23:30 | Оператор: 770505400022 | EXPORT| ИИН: 930303350055 | Система: SmartBridge\n#10 23:45 | Оператор: 770505400022 | EXPORT| ИИН: 940404450066 | Система: SmartBridge\n#11 23:50 | Оператор: 770505400022 | EXPORT| ИИН: 950505350077 | Система: SmartBridge\n\n=== Анализ подозрительной активности ===\n\n⚠ ПРАВИЛО 1: Множественные запросы к одному ИИН\n  Оператор 880101350011 → ИИН 900515350024: 2 запроса (норма)\n\n⚠ ПРАВИЛО 2: Доступ вне рабочего времени (до 9:00 / после 18:00)\n  Оператор 770505400022 — 6 операций в нерабочее время:\n    22:30 VIEW 850203450012\n    22:45 EXPORT 850203450012\n    23:00 EXPORT 910101350033\n    23:15 EXPORT 920202450044\n    23:30 EXPORT 930303350055\n    23:45 EXPORT 940404450066\n    23:50 EXPORT 950505350077\n\n⚠ ПРАВИЛО 3: Массовый экспорт данных\n  Оператор 770505400022: 6 EXPORT операций (лимит: 5) — НАРУШЕНИЕ!\n\n=== Compliance Report ===\nВсего операций: 11\nОператоров: 2\nНарушения: 2\n  1. Оператор 770505400022: доступ вне рабочего времени (6 операций)\n  2. Оператор 770505400022: массовый экспорт (6 EXPORT, лимит 5)',
      hint: 'Храни логи в List<String[]>. Для правила 1: группируй по паре (operator, targetIIN) и считай количество. Для правила 2: парсинг часа из timestamp, проверка hour < 9 || hour >= 18. Для правила 3: группируй EXPORT по оператору.',
      solution: `import java.util.*;

public class Main {
    static String[][] logs = {
        {"09:15", "880101350011", "VIEW",   "900515350024", "eGov Portal"},
        {"09:30", "880101350011", "VIEW",   "850203450012", "eGov Portal"},
        {"09:45", "880101350011", "EDIT",   "900515350024", "ЦОН АИС"},
        {"10:00", "770505400022", "VIEW",   "900515350024", "SmartBridge"},
        {"22:30", "770505400022", "VIEW",   "850203450012", "SmartBridge"},
        {"22:45", "770505400022", "EXPORT", "850203450012", "SmartBridge"},
        {"23:00", "770505400022", "EXPORT", "910101350033", "SmartBridge"},
        {"23:15", "770505400022", "EXPORT", "920202450044", "SmartBridge"},
        {"23:30", "770505400022", "EXPORT", "930303350055", "SmartBridge"},
        {"23:45", "770505400022", "EXPORT", "940404450066", "SmartBridge"},
        {"23:50", "770505400022", "EXPORT", "950505350077", "SmartBridge"},
    };

    public static void main(String[] args) {
        System.out.println("=== Журнал аудита: 2024-03-15 ===");
        System.out.println();

        // Вывод журнала
        for (int i = 0; i < logs.length; i++) {
            System.out.printf("#%-2d %s | Оператор: %s | %-6s| ИИН: %s | Система: %s%n",
                i + 1, logs[i][0], logs[i][1],
                logs[i][2], logs[i][3], logs[i][4]);
        }

        System.out.println();
        System.out.println("=== Анализ подозрительной активности ===");

        // Правило 1: множественные запросы к одному ИИН
        System.out.println();
        System.out.println("⚠ ПРАВИЛО 1: Множественные запросы к одному ИИН");
        Map<String, Map<String, Integer>> operatorTargetCount = new LinkedHashMap<>();
        for (String[] log : logs) {
            operatorTargetCount
                .computeIfAbsent(log[1], k -> new LinkedHashMap<>())
                .merge(log[3], 1, Integer::sum);
        }
        for (var op : operatorTargetCount.entrySet()) {
            for (var target : op.getValue().entrySet()) {
                if (target.getValue() >= 2) {
                    String note = target.getValue() > 10 ? "НАРУШЕНИЕ!" : "(норма)";
                    System.out.printf("  Оператор %s → ИИН %s: %d запроса %s%n",
                        op.getKey(), target.getKey(), target.getValue(), note);
                }
            }
        }

        // Правило 2: доступ вне рабочего времени
        System.out.println();
        System.out.println("⚠ ПРАВИЛО 2: Доступ вне рабочего времени (до 9:00 / после 18:00)");
        Map<String, List<String[]>> afterHours = new LinkedHashMap<>();
        for (String[] log : logs) {
            int hour = Integer.parseInt(log[0].split(":")[0]);
            if (hour < 9 || hour >= 18) {
                afterHours.computeIfAbsent(log[1], k -> new ArrayList<>()).add(log);
            }
        }
        for (var entry : afterHours.entrySet()) {
            System.out.printf("  Оператор %s — %d операций в нерабочее время:%n",
                entry.getKey(), entry.getValue().size());
            for (String[] log : entry.getValue()) {
                System.out.printf("    %s %s %s%n", log[0], log[2], log[3]);
            }
        }

        // Правило 3: массовый экспорт
        System.out.println();
        System.out.println("⚠ ПРАВИЛО 3: Массовый экспорт данных");
        Map<String, Integer> exportCount = new LinkedHashMap<>();
        for (String[] log : logs) {
            if (log[2].equals("EXPORT")) {
                exportCount.merge(log[1], 1, Integer::sum);
            }
        }
        for (var entry : exportCount.entrySet()) {
            if (entry.getValue() > 5) {
                System.out.printf("  Оператор %s: %d EXPORT операций (лимит: 5) — НАРУШЕНИЕ!%n",
                    entry.getKey(), entry.getValue());
            }
        }

        // Compliance Report
        System.out.println();
        System.out.println("=== Compliance Report ===");
        System.out.println("Всего операций: " + logs.length);
        Set<String> operators = new HashSet<>();
        for (String[] log : logs) operators.add(log[1]);
        System.out.println("Операторов: " + operators.size());

        List<String> violations = new ArrayList<>();
        for (var entry : afterHours.entrySet()) {
            violations.add("Оператор " + entry.getKey()
                + ": доступ вне рабочего времени (" + entry.getValue().size() + " операций)");
        }
        for (var entry : exportCount.entrySet()) {
            if (entry.getValue() > 5) {
                violations.add("Оператор " + entry.getKey()
                    + ": массовый экспорт (" + entry.getValue() + " EXPORT, лимит 5)");
            }
        }
        System.out.println("Нарушения: " + violations.size());
        for (int i = 0; i < violations.size(); i++) {
            System.out.println("  " + (i + 1) + ". " + violations.get(i));
        }
    }
}`,
      explanation: 'Аудит доступа к персональным данным — требование закона РК "О персональных данных и их защите". Каждое обращение к ИИН гражданина логируется: кто, когда, какая операция, из какой системы. Автоматическое выявление подозрительных паттернов (массовые запросы, ночной доступ, выгрузка данных) помогает предотвратить утечки. Compliance report предоставляется уполномоченному органу по защите персональных данных. В реальной системе eGov аудит интегрирован с SIEM-системами безопасности.'
    }
  ]
}
