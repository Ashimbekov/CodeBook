export default {
  id: 114,
  title: 'Реальная разработка: Медицина',
  description: 'Задачи Java-разработчика в медицинской системе: пациенты, запись к врачу, электронная история болезни, рецепты, лаборатория и ДМС.',
  lessons: [
    {
      id: 1,
      title: 'Patient Registration: Регистрация пациента',
      type: 'practice',
      difficulty: 'easy',
      description: 'Команда Patient. Спринт 1. Задача MED-101: Реализовать регистрацию пациента в системе КМИС (клиническая медицинская информационная система). Карточка пациента — основа всех модулей DamuMed. ИИН валидируется, возраст рассчитывается автоматически, аллергии хранятся списком. Формат данных совместим со стандартом HL7 FHIR (Patient resource).',
      requirements: [
        'Класс Patient: iin (String 12 цифр), name, birthDate (LocalDate), gender (M/F), bloodType, allergies (List<String>), phone',
        'Валидация ИИН: ровно 12 цифр, первые 6 — дата рождения (YYMMDD)',
        'Метод getAge() — возраст на текущую дату через Period.between()',
        'Аллергии хранятся в List<String>, могут быть пустыми (\"нет аллергий\")',
        'Метод printCard() — печать карточки пациента с форматированием',
        'В main(): создать 2 пациентов, распечатать карточки'
      ],
      expectedOutput: '=== КАРТОЧКА ПАЦИЕНТА ===\nИИН: 900515123456\nФИО: Касымов Ержан Болатович\nДата рождения: 15.05.1990\nВозраст: 35 лет\nПол: М\nГруппа крови: II(+)\nАллергии: Пенициллин, Ибупрофен\nТелефон: +7-701-123-4567\n========================\n=== КАРТОЧКА ПАЦИЕНТА ===\nИИН: 850210987654\nФИО: Ахметова Динара Сериковна\nДата рождения: 10.02.1985\nВозраст: 41 год\nПол: Ж\nГруппа крови: I(-)\nАллергии: нет аллергий\nТелефон: +7-702-987-6543\n========================',
      hint: 'ИИН в Казахстане — 12 цифр, первые 6 это дата рождения в формате YYMMDD. Для возраста используй Period.between(birthDate, LocalDate.now()).getYears(). Для склонения \"лет/год/года\" проверяй остаток от деления.',
      solution: `import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class Main {
    static class Patient {
        String iin;
        String name;
        LocalDate birthDate;
        String gender;
        String bloodType;
        List<String> allergies;
        String phone;

        Patient(String iin, String name, LocalDate birthDate, String gender,
                String bloodType, List<String> allergies, String phone) {
            validateIIN(iin);
            this.iin = iin;
            this.name = name;
            this.birthDate = birthDate;
            this.gender = gender;
            this.bloodType = bloodType;
            this.allergies = allergies != null ? allergies : new ArrayList<>();
            this.phone = phone;
        }

        void validateIIN(String iin) {
            if (iin == null || !iin.matches("\\\\d{12}"))
                throw new IllegalArgumentException("ИИН должен содержать 12 цифр");
        }

        int getAge() {
            return Period.between(birthDate, LocalDate.now()).getYears();
        }

        String ageLabel(int age) {
            int last = age % 10;
            int lastTwo = age % 100;
            if (lastTwo >= 11 && lastTwo <= 19) return "лет";
            if (last == 1) return "год";
            if (last >= 2 && last <= 4) return "года";
            return "лет";
        }

        void printCard() {
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd.MM.yyyy");
            int age = getAge();
            System.out.println("=== КАРТОЧКА ПАЦИЕНТА ===");
            System.out.println("ИИН: " + iin);
            System.out.println("ФИО: " + name);
            System.out.println("Дата рождения: " + birthDate.format(fmt));
            System.out.println("Возраст: " + age + " " + ageLabel(age));
            System.out.println("Пол: " + (gender.equals("M") ? "М" : "Ж"));
            System.out.println("Группа крови: " + bloodType);
            String allergyStr = allergies.isEmpty() ? "нет аллергий" : String.join(", ", allergies);
            System.out.println("Аллергии: " + allergyStr);
            System.out.println("Телефон: " + phone);
            System.out.println("========================");
        }
    }

    public static void main(String[] args) {
        Patient p1 = new Patient("900515123456", "Касымов Ержан Болатович",
            LocalDate.of(1990, 5, 15), "M", "II(+)",
            List.of("Пенициллин", "Ибупрофен"), "+7-701-123-4567");
        p1.printCard();

        Patient p2 = new Patient("850210987654", "Ахметова Динара Сериковна",
            LocalDate.of(1985, 2, 10), "F", "I(-)",
            new ArrayList<>(), "+7-702-987-6543");
        p2.printCard();
    }
}`,
      explanation: 'Регистрация пациента — первый шаг в любой КМИС (DamuMed, OpenMRS). ИИН валидируется при создании. Возраст считается динамически через Period. Аллергии хранятся как List<String> — это критически важно для проверки лекарственных взаимодействий в следующих модулях. В реальной системе Patient маппится на HL7 FHIR Patient resource.'
    },
    {
      id: 2,
      title: 'Appointment Booking: Запись к врачу',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Scheduling. Спринт 2. Задача MED-205: Реализовать систему записи к врачу. В DamuMed пациент выбирает специальность, врача, дату и временной слот. Слоты по 30 минут, рабочий день с 9:00 до 18:00 с перерывом 13:00-14:00. Система должна предотвращать двойную запись (overbooking) и поддерживать отмену/перенос.',
      requirements: [
        'Класс Doctor: id, name, specialty (THERAPIST/CARDIOLOGIST/SURGEON/NEUROLOGIST)',
        'Класс Appointment: id, patientName, doctor, date (LocalDate), time (LocalTime), status (BOOKED/CANCELLED/COMPLETED)',
        'Слоты по 30 минут: 09:00, 09:30, ..., 12:30, 14:00, ..., 17:30 (обед 13:00-14:00)',
        'Метод book() — проверка доступности слота, предотвращение overbooking',
        'Методы cancel() и reschedule() — отмена и перенос',
        'Метод printDailySchedule(doctor, date) — расписание врача на день'
      ],
      expectedOutput: 'Запись создана: APT-001 Касымов → Др. Ибраева (Терапевт) 10.04.2026 09:00\nЗапись создана: APT-002 Ахметова → Др. Ибраева (Терапевт) 10.04.2026 09:30\nОшибка: Слот 09:00 у Др. Ибраева на 10.04.2026 уже занят\nЗапись APT-001 отменена\nЗапись APT-003 перенесена на 11.04.2026 10:00\n\n=== Расписание: Др. Ибраева (10.04.2026) ===\n09:00 — [ОТМЕНЁН] Касымов\n09:30 — Ахметова\n10:00-17:30 — свободно\n=========================================',
      hint: 'Генерируй все слоты рабочего дня циклом от 9:00 до 17:30 с шагом 30 минут, пропуская 13:00 и 13:30 (обед). Для проверки доступности фильтруй записи по doctor + date + time + status != CANCELLED.',
      solution: `import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

public class Main {
    enum Specialty { THERAPIST, CARDIOLOGIST, SURGEON, NEUROLOGIST }
    enum Status { BOOKED, CANCELLED, COMPLETED }

    static class Doctor {
        String id, name;
        Specialty specialty;
        Doctor(String id, String name, Specialty specialty) {
            this.id = id; this.name = name; this.specialty = specialty;
        }
        String specName() {
            return switch (specialty) {
                case THERAPIST -> "Терапевт";
                case CARDIOLOGIST -> "Кардиолог";
                case SURGEON -> "Хирург";
                case NEUROLOGIST -> "Невролог";
            };
        }
    }

    static class Appointment {
        String id, patientName;
        Doctor doctor;
        LocalDate date;
        LocalTime time;
        Status status = Status.BOOKED;
        Appointment(String id, String patientName, Doctor doctor, LocalDate date, LocalTime time) {
            this.id = id; this.patientName = patientName;
            this.doctor = doctor; this.date = date; this.time = time;
        }
    }

    static List<Appointment> appointments = new ArrayList<>();
    static int nextApt = 1;
    static DateTimeFormatter dateFmt = DateTimeFormatter.ofPattern("dd.MM.yyyy");
    static DateTimeFormatter timeFmt = DateTimeFormatter.ofPattern("HH:mm");

    static List<LocalTime> generateSlots() {
        List<LocalTime> slots = new ArrayList<>();
        LocalTime t = LocalTime.of(9, 0);
        LocalTime end = LocalTime.of(18, 0);
        LocalTime lunchStart = LocalTime.of(13, 0);
        LocalTime lunchEnd = LocalTime.of(14, 0);
        while (t.isBefore(end)) {
            if (t.isBefore(lunchStart) || !t.isBefore(lunchEnd)) slots.add(t);
            t = t.plusMinutes(30);
        }
        return slots;
    }

    static Appointment book(String patient, Doctor doctor, LocalDate date, LocalTime time) {
        boolean taken = appointments.stream().anyMatch(a ->
            a.doctor.id.equals(doctor.id) && a.date.equals(date) &&
            a.time.equals(time) && a.status != Status.CANCELLED);
        if (taken) {
            System.out.println("Ошибка: Слот " + time.format(timeFmt) +
                " у Др. " + doctor.name + " на " + date.format(dateFmt) + " уже занят");
            return null;
        }
        String id = String.format("APT-%03d", nextApt++);
        Appointment apt = new Appointment(id, patient, doctor, date, time);
        appointments.add(apt);
        System.out.println("Запись создана: " + id + " " + patient +
            " → Др. " + doctor.name + " (" + doctor.specName() + ") " +
            date.format(dateFmt) + " " + time.format(timeFmt));
        return apt;
    }

    static void cancel(Appointment apt) {
        apt.status = Status.CANCELLED;
        System.out.println("Запись " + apt.id + " отменена");
    }

    static void reschedule(Appointment apt, LocalDate newDate, LocalTime newTime) {
        apt.date = newDate;
        apt.time = newTime;
        System.out.println("Запись " + apt.id + " перенесена на " +
            newDate.format(dateFmt) + " " + newTime.format(timeFmt));
    }

    static void printDailySchedule(Doctor doctor, LocalDate date) {
        System.out.println("\\n=== Расписание: Др. " + doctor.name +
            " (" + date.format(dateFmt) + ") ===");
        List<LocalTime> slots = generateSlots();
        for (LocalTime slot : slots) {
            Optional<Appointment> apt = appointments.stream()
                .filter(a -> a.doctor.id.equals(doctor.id) && a.date.equals(date) && a.time.equals(slot))
                .findFirst();
            if (apt.isPresent()) {
                Appointment a = apt.get();
                String prefix = a.status == Status.CANCELLED ? "[ОТМЕНЁН] " : "";
                System.out.println(slot.format(timeFmt) + " — " + prefix + a.patientName);
            } else {
                System.out.println(slot.format(timeFmt) + " — свободно");
            }
        }
        System.out.println("=========================================");
    }

    public static void main(String[] args) {
        Doctor dr = new Doctor("D01", "Ибраева", Specialty.THERAPIST);
        LocalDate date = LocalDate.of(2026, 4, 10);

        Appointment a1 = book("Касымов", dr, date, LocalTime.of(9, 0));
        Appointment a2 = book("Ахметова", dr, date, LocalTime.of(9, 30));
        book("Серіков", dr, date, LocalTime.of(9, 0));
        cancel(a1);
        Appointment a3 = book("Серіков", dr, date, LocalTime.of(10, 0));
        reschedule(a3, LocalDate.of(2026, 4, 11), LocalTime.of(10, 0));

        printDailySchedule(dr, date);
    }
}`,
      explanation: 'Запись к врачу — ключевая функция любой КМИС. Слоты по 30 минут — стандарт поликлиник. Проверка overbooking критична: два пациента не могут быть записаны на один слот. В DamuMed расписание интегрировано с HL7 FHIR Schedule/Slot ресурсами. Статусная модель (BOOKED → CANCELLED/COMPLETED) позволяет отслеживать жизненный цикл записи.'
    },
    {
      id: 3,
      title: 'Electronic Health Record: История болезни',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Clinical. Спринт 3. Задача MED-310: Реализовать электронную историю болезни (ЭИБ). В системе КМИС каждый визит фиксируется: жалобы, осмотр, диагноз по МКБ-10, назначения. Врач должен видеть полную хронологию пациента. HL7 FHIR Encounter + Condition ресурсы.',
      requirements: [
        'Класс VisitRecord: date (LocalDate), doctorName, complaints (String), diagnosis (String), icdCode (String), prescriptions (List<String>), notes (String)',
        'Класс EHR: patientName, records (List<VisitRecord>)',
        'Метод addRecord() — добавить запись визита',
        'Метод searchByDateRange(from, to) — поиск записей по диапазону дат',
        'Метод searchByDiagnosis(keyword) — поиск по диагнозу',
        'Метод printMedicalRecord() — форматированная печать всей истории',
        'В main(): 3 визита, поиск по дате, поиск по диагнозу'
      ],
      expectedOutput: '=== ЭЛЕКТРОННАЯ ИСТОРИЯ БОЛЕЗНИ ===\nПациент: Касымов Ержан Болатович\n\n--- Визит 15.01.2026 ---\nВрач: Др. Ибраева\nЖалобы: Головная боль, головокружение\nДиагноз: Артериальная гипертензия [I10]\nНазначения: Лозартан 50мг, Амлодипин 5мг\nЗаметки: Контроль АД через 2 недели\n\n--- Визит 02.03.2026 ---\nВрач: Др. Ибраева\nЖалобы: Контрольный визит\nДиагноз: Артериальная гипертензия [I10]\nНазначения: Лозартан 50мг\nЗаметки: АД стабилизировалось 130/85\n\n--- Визит 20.03.2026 ---\nВрач: Др. Нурланов\nЖалобы: Боль в горле, температура 38.5\nДиагноз: Острый тонзиллит [J03]\nНазначения: Амоксициллин 500мг, Ибупрофен 400мг\nЗаметки: Больничный лист на 5 дней\n===================================\n\nПоиск (01.03.2026 — 31.03.2026): найдено 2 записи\nПоиск по диагнозу \"гипертензия\": найдено 2 записи',
      hint: 'МКБ-10 — международная классификация болезней. I10 — гипертензия, J03 — тонзиллит. Для поиска по дате используй !date.isBefore(from) && !date.isAfter(to). Для поиска по диагнозу — diagnosis.toLowerCase().contains(keyword.toLowerCase()).',
      solution: `import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

public class Main {
    static class VisitRecord {
        LocalDate date;
        String doctorName, complaints, diagnosis, icdCode, notes;
        List<String> prescriptions;

        VisitRecord(LocalDate date, String doctorName, String complaints,
                    String diagnosis, String icdCode, List<String> prescriptions, String notes) {
            this.date = date; this.doctorName = doctorName;
            this.complaints = complaints; this.diagnosis = diagnosis;
            this.icdCode = icdCode; this.prescriptions = prescriptions;
            this.notes = notes;
        }
    }

    static class EHR {
        String patientName;
        List<VisitRecord> records = new ArrayList<>();

        EHR(String patientName) { this.patientName = patientName; }

        void addRecord(VisitRecord record) {
            records.add(record);
        }

        List<VisitRecord> searchByDateRange(LocalDate from, LocalDate to) {
            return records.stream()
                .filter(r -> !r.date.isBefore(from) && !r.date.isAfter(to))
                .collect(Collectors.toList());
        }

        List<VisitRecord> searchByDiagnosis(String keyword) {
            return records.stream()
                .filter(r -> r.diagnosis.toLowerCase().contains(keyword.toLowerCase()))
                .collect(Collectors.toList());
        }

        void printMedicalRecord() {
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd.MM.yyyy");
            System.out.println("=== ЭЛЕКТРОННАЯ ИСТОРИЯ БОЛЕЗНИ ===");
            System.out.println("Пациент: " + patientName);
            for (VisitRecord r : records) {
                System.out.println("\\n--- Визит " + r.date.format(fmt) + " ---");
                System.out.println("Врач: Др. " + r.doctorName);
                System.out.println("Жалобы: " + r.complaints);
                System.out.println("Диагноз: " + r.diagnosis + " [" + r.icdCode + "]");
                System.out.println("Назначения: " + String.join(", ", r.prescriptions));
                System.out.println("Заметки: " + r.notes);
            }
            System.out.println("===================================");
        }
    }

    public static void main(String[] args) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        EHR ehr = new EHR("Касымов Ержан Болатович");

        ehr.addRecord(new VisitRecord(LocalDate.of(2026, 1, 15), "Ибраева",
            "Головная боль, головокружение", "Артериальная гипертензия", "I10",
            List.of("Лозартан 50мг", "Амлодипин 5мг"), "Контроль АД через 2 недели"));

        ehr.addRecord(new VisitRecord(LocalDate.of(2026, 3, 2), "Ибраева",
            "Контрольный визит", "Артериальная гипертензия", "I10",
            List.of("Лозартан 50мг"), "АД стабилизировалось 130/85"));

        ehr.addRecord(new VisitRecord(LocalDate.of(2026, 3, 20), "Нурланов",
            "Боль в горле, температура 38.5", "Острый тонзиллит", "J03",
            List.of("Амоксициллин 500мг", "Ибупрофен 400мг"), "Больничный лист на 5 дней"));

        ehr.printMedicalRecord();

        LocalDate from = LocalDate.of(2026, 3, 1);
        LocalDate to = LocalDate.of(2026, 3, 31);
        List<VisitRecord> byDate = ehr.searchByDateRange(from, to);
        System.out.println("\\nПоиск (" + from.format(fmt) + " — " + to.format(fmt) +
            "): найдено " + byDate.size() + " записи");

        List<VisitRecord> byDiag = ehr.searchByDiagnosis("гипертензия");
        System.out.println("Поиск по диагнозу \\"гипертензия\\": найдено " + byDiag.size() + " записи");
    }
}`,
      explanation: 'ЭИБ (электронная история болезни) — сердце КМИС. Каждый визит документируется по стандарту: жалобы → осмотр → диагноз (МКБ-10) → назначения. МКБ-10 — международный стандарт кодирования диагнозов (I10 — гипертензия, J03 — тонзиллит). В HL7 FHIR это Encounter + Condition ресурсы. Поиск по дате и диагнозу — базовые операции для врача.'
    },
    {
      id: 4,
      title: 'Prescription: Рецепт',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Clinical. Спринт 4. Задача MED-412: Генерация электронного рецепта. В DamuMed рецепт создаётся врачом, проверяется на лекарственные взаимодействия и аллергии пациента. Контролируемые препараты (наркотические, психотропные) требуют спецучёта. HL7 FHIR MedicationRequest.',
      requirements: [
        'Класс Prescription: medication, dosage, frequency, duration (дни), refillable (boolean), doctorName, patientName',
        'Класс DrugChecker: Map хранит известные взаимодействия (пары препаратов)',
        'Метод checkInteractions(medication, currentMeds) — проверка взаимодействий',
        'Метод checkAllergies(medication, allergies) — проверка аллергий пациента',
        'Метод printPrescription() — печать рецепта с подписью врача',
        'В main(): выписать 2 рецепта, один с предупреждением об аллергии'
      ],
      expectedOutput: '=== ЭЛЕКТРОННЫЙ РЕЦЕПТ ===\nПациент: Касымов Ержан Болатович\nВрач: Др. Ибраева А.К.\n\nПрепарат: Лозартан\nДозировка: 50 мг\nПриём: 1 раз в день, утром\nДлительность: 30 дней\nПовторный: да\n\nПодпись врача: Ибраева А.К.\nДата: 07.04.2026\n==========================\n\n⚠ ПРЕДУПРЕЖДЕНИЕ: Аллергия на Ибупрофен у пациента!\nРецепт НЕ выписан: Ибупрофен\n\n✓ Проверка взаимодействий: Амоксициллин + [Лозартан] — ОК\n=== ЭЛЕКТРОННЫЙ РЕЦЕПТ ===\nПациент: Касымов Ержан Болатович\nВрач: Др. Нурланов Б.Т.\n\nПрепарат: Амоксициллин\nДозировка: 500 мг\nПриём: 3 раза в день\nДлительность: 7 дней\nПовторный: нет\n\nПодпись врача: Нурланов Б.Т.\nДата: 07.04.2026\n==========================',
      hint: 'Лекарственные взаимодействия храни как Set<Set<String>> — пары препаратов, которые нельзя принимать вместе (например, Варфарин + Аспирин). Аллергии проверяй по списку пациента перед генерацией рецепта.',
      solution: `import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class Main {
    static class Prescription {
        String medication, dosage, frequency, doctorName, patientName;
        int duration;
        boolean refillable;

        Prescription(String patientName, String doctorName, String medication,
                     String dosage, String frequency, int duration, boolean refillable) {
            this.patientName = patientName; this.doctorName = doctorName;
            this.medication = medication; this.dosage = dosage;
            this.frequency = frequency; this.duration = duration;
            this.refillable = refillable;
        }

        void printPrescription() {
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd.MM.yyyy");
            System.out.println("=== ЭЛЕКТРОННЫЙ РЕЦЕПТ ===");
            System.out.println("Пациент: " + patientName);
            System.out.println("Врач: Др. " + doctorName);
            System.out.println();
            System.out.println("Препарат: " + medication);
            System.out.println("Дозировка: " + dosage);
            System.out.println("Приём: " + frequency);
            System.out.println("Длительность: " + duration + " дней");
            System.out.println("Повторный: " + (refillable ? "да" : "нет"));
            System.out.println();
            System.out.println("Подпись врача: " + doctorName);
            System.out.println("Дата: " + LocalDate.now().format(fmt));
            System.out.println("==========================");
        }
    }

    static class DrugChecker {
        Set<Set<String>> interactions = new HashSet<>();
        {
            interactions.add(Set.of("Варфарин", "Аспирин"));
            interactions.add(Set.of("Метформин", "Контраст"));
            interactions.add(Set.of("Лозартан", "Спиронолактон"));
        }

        boolean checkInteractions(String medication, List<String> currentMeds) {
            for (String med : currentMeds) {
                Set<String> pair = Set.of(medication, med);
                if (interactions.contains(pair)) {
                    System.out.println("⚠ ОПАСНОЕ ВЗАИМОДЕЙСТВИЕ: " + medication + " + " + med);
                    return false;
                }
            }
            System.out.println("✓ Проверка взаимодействий: " + medication +
                " + " + currentMeds + " — ОК");
            return true;
        }

        boolean checkAllergies(String medication, List<String> allergies) {
            for (String allergy : allergies) {
                if (medication.equalsIgnoreCase(allergy)) {
                    System.out.println("⚠ ПРЕДУПРЕЖДЕНИЕ: Аллергия на " + medication + " у пациента!");
                    return false;
                }
            }
            return true;
        }
    }

    public static void main(String[] args) {
        String patient = "Касымов Ержан Болатович";
        List<String> allergies = List.of("Пенициллин", "Ибупрофен");
        List<String> currentMeds = new ArrayList<>();

        DrugChecker checker = new DrugChecker();

        // Рецепт 1 — ОК
        Prescription rx1 = new Prescription(patient, "Ибраева А.К.",
            "Лозартан", "50 мг", "1 раз в день, утром", 30, true);
        rx1.printPrescription();
        currentMeds.add("Лозартан");

        // Рецепт 2 — аллергия
        System.out.println();
        if (!checker.checkAllergies("Ибупрофен", allergies)) {
            System.out.println("Рецепт НЕ выписан: Ибупрофен");
        }

        // Рецепт 3 — ОК с проверкой взаимодействий
        System.out.println();
        checker.checkInteractions("Амоксициллин", currentMeds);
        Prescription rx3 = new Prescription(patient, "Нурланов Б.Т.",
            "Амоксициллин", "500 мг", "3 раза в день", 7, false);
        rx3.printPrescription();
    }
}`,
      explanation: 'Электронный рецепт — обязательная часть КМИС. Перед выпиской проверяются: 1) аллергии пациента, 2) взаимодействия с текущими лекарствами. В реальной системе используются базы данных взаимодействий (DrugBank, RxNorm). В HL7 FHIR это MedicationRequest ресурс. Контролируемые препараты (опиоиды, бензодиазепины) требуют дополнительного учёта по казахстанскому законодательству.'
    },
    {
      id: 5,
      title: 'Lab Results: Лабораторные анализы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Clinical. Спринт 5. Задача MED-518: Обработка лабораторных результатов. Лаборатория передаёт результаты анализов в КМИС. Каждый тест имеет референсный диапазон (норма). Система автоматически флагирует отклонения: HIGH, LOW, CRITICAL. Врач видит отчёт с цветовой индикацией.',
      requirements: [
        'Класс LabTest: testName, value (double), unit, refMin (double), refMax (double)',
        'Enum Flag: NORMAL, HIGH, LOW, CRITICAL_HIGH, CRITICAL_LOW',
        'Метод evaluate() — определить флаг (CRITICAL если отклонение > 50% от нормы)',
        'Класс LabReport: patientName, date, tests (List<LabTest>), doctorName',
        'Метод printReport() — форматированный лабораторный отчёт',
        'Стандартные тесты: глюкоза (3.9-6.1 ммоль/л), гемоглобин (130-170 г/л для М), холестерин (< 5.2 ммоль/л)'
      ],
      expectedOutput: '=== ЛАБОРАТОРНЫЙ ОТЧЁТ ===\nПациент: Касымов Ержан Болатович\nДата: 07.04.2026\nНаправил: Др. Ибраева\n\nТест                 Результат    Норма          Статус\n-----------------------------------------------------------\nГлюкоза              5.40 ммоль/л  3.90 — 6.10   [НОРМА]\nГемоглобин           125.00 г/л    130.00 — 170.00 [НИЗКИЙ] ↓\nХолестерин общий     7.80 ммоль/л  0.00 — 5.20   [ВЫСОКИЙ] ↑\nКреатинин            450.00 мкмоль/л 62.00 — 106.00 [КРИТИЧЕСКИЙ] ↑↑\n-----------------------------------------------------------\nОтклонения: 3 | Критические: 1\n==========================',
      hint: 'CRITICAL определяй если значение > refMax * 1.5 или < refMin * 0.5. Для форматирования таблицы используй String.format("%-20s %-12s %-15s %s"). Флаги: ↑ для HIGH, ↓ для LOW, ↑↑ для CRITICAL_HIGH, ↓↓ для CRITICAL_LOW.',
      solution: `import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class Main {
    enum Flag {
        NORMAL("НОРМА", ""),
        HIGH("ВЫСОКИЙ", " ↑"),
        LOW("НИЗКИЙ", " ↓"),
        CRITICAL_HIGH("КРИТИЧЕСКИЙ", " ↑↑"),
        CRITICAL_LOW("КРИТИЧЕСКИЙ", " ↓↓");

        String label, arrow;
        Flag(String label, String arrow) { this.label = label; this.arrow = arrow; }
    }

    static class LabTest {
        String testName, unit;
        double value, refMin, refMax;
        Flag flag;

        LabTest(String testName, double value, String unit, double refMin, double refMax) {
            this.testName = testName; this.value = value; this.unit = unit;
            this.refMin = refMin; this.refMax = refMax;
            this.flag = evaluate();
        }

        Flag evaluate() {
            if (value >= refMin && value <= refMax) return Flag.NORMAL;
            if (value > refMax) {
                return value > refMax * 1.5 ? Flag.CRITICAL_HIGH : Flag.HIGH;
            }
            return value < refMin * 0.5 ? Flag.CRITICAL_LOW : Flag.LOW;
        }
    }

    static class LabReport {
        String patientName, doctorName;
        LocalDate date;
        List<LabTest> tests;

        LabReport(String patientName, String doctorName, LocalDate date, List<LabTest> tests) {
            this.patientName = patientName; this.doctorName = doctorName;
            this.date = date; this.tests = tests;
        }

        void printReport() {
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd.MM.yyyy");
            System.out.println("=== ЛАБОРАТОРНЫЙ ОТЧЁТ ===");
            System.out.println("Пациент: " + patientName);
            System.out.println("Дата: " + date.format(fmt));
            System.out.println("Направил: Др. " + doctorName);
            System.out.println();
            System.out.printf("%-20s %-12s %-15s %s%n", "Тест", "Результат", "Норма", "Статус");
            System.out.println("-----------------------------------------------------------");

            int deviations = 0, criticals = 0;
            for (LabTest t : tests) {
                String result = String.format("%.2f %s", t.value, t.unit);
                String ref = String.format("%.2f — %.2f", t.refMin, t.refMax);
                String status = "[" + t.flag.label + "]" + t.flag.arrow;
                System.out.printf("%-20s %-12s %-15s %s%n", t.testName, result, ref, status);
                if (t.flag != Flag.NORMAL) deviations++;
                if (t.flag == Flag.CRITICAL_HIGH || t.flag == Flag.CRITICAL_LOW) criticals++;
            }
            System.out.println("-----------------------------------------------------------");
            System.out.println("Отклонения: " + deviations + " | Критические: " + criticals);
            System.out.println("==========================");
        }
    }

    public static void main(String[] args) {
        List<LabTest> tests = List.of(
            new LabTest("Глюкоза", 5.4, "ммоль/л", 3.9, 6.1),
            new LabTest("Гемоглобин", 125.0, "г/л", 130.0, 170.0),
            new LabTest("Холестерин общий", 7.8, "ммоль/л", 0.0, 5.2),
            new LabTest("Креатинин", 450.0, "мкмоль/л", 62.0, 106.0)
        );

        LabReport report = new LabReport("Касымов Ержан Болатович",
            "Ибраева", LocalDate.now(), tests);
        report.printReport();
    }
}`,
      explanation: 'Лабораторные анализы — критический модуль КМИС. Автоматическая интерпретация результатов помогает врачу: NORMAL — в пределах нормы, HIGH/LOW — отклонение, CRITICAL — требует немедленного внимания (отклонение > 50%). В реальной системе креатинин 450 мкмоль/л — это почечная недостаточность, требующая экстренной госпитализации. В HL7 FHIR это Observation ресурс с valueQuantity и referenceRange.'
    },
    {
      id: 6,
      title: 'Billing: Медицинский счёт',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Patient. Спринт 6. Задача MED-620: Генерация медицинского счёта. В Казахстане действует ОСМС (обязательное социальное медицинское страхование) — покрывает 70% стоимости. Пациент с ДМС (добровольное медицинское страхование) получает расширенное покрытие. Без страховки — полная оплата. Валюта: KZT (тенге).',
      requirements: [
        'Класс BillItem: description, category (CONSULTATION/PROCEDURE/MEDICATION/LAB_TEST), amount (long, в тенге)',
        'Enum InsuranceType: OSMS, DMS, SELF_PAY',
        'Класс MedicalBill: patientName, items (List<BillItem>), insuranceType',
        'ОСМС покрывает 70%, ДМС — 90%, SELF_PAY — 0%',
        'Метод calculatePatientPortion() — сумма к оплате пациентом',
        'Метод printInvoice() — печать счёта с разбивкой по категориям',
        'В main(): 2 счёта — один ОСМС, один ДМС'
      ],
      expectedOutput: '=== МЕДИЦИНСКИЙ СЧЁТ ===\nПациент: Касымов Ержан Болатович\nСтраховка: ОСМС\n\nУслуга                          Категория       Сумма\n----------------------------------------------------------\nПриём терапевта                 Консультация    5 000 ₸\nОбщий анализ крови              Лаб. анализ     3 500 ₸\nБиохимия крови                  Лаб. анализ     8 000 ₸\nЛозартан 50мг (30 таб.)         Медикаменты     2 800 ₸\n----------------------------------------------------------\nИТОГО:                                         19 300 ₸\nПокрытие ОСМС (70%):                          -13 510 ₸\nК ОПЛАТЕ ПАЦИЕНТОМ:                             5 790 ₸\n=========================\n\n=== МЕДИЦИНСКИЙ СЧЁТ ===\nПациент: Ахметова Динара Сериковна\nСтраховка: ДМС (СК \"Евразия\")\n\nУслуга                          Категория       Сумма\n----------------------------------------------------------\nПриём кардиолога                Консультация    8 000 ₸\nЭКГ                             Процедура      12 000 ₸\nУЗИ сердца                      Процедура      25 000 ₸\n----------------------------------------------------------\nИТОГО:                                         45 000 ₸\nПокрытие ДМС (90%):                           -40 500 ₸\nК ОПЛАТЕ ПАЦИЕНТОМ:                             4 500 ₸\n=========================',
      hint: 'Для форматирования денег используй NumberFormat или String.format("%,d"). ОСМС покрывает 70% от ИТОГО. В реальном ОСМС покрытие зависит от категории услуги и тарифа ФСМС (Фонд социального медицинского страхования).',
      solution: `import java.util.*;

public class Main {
    enum Category {
        CONSULTATION("Консультация"),
        PROCEDURE("Процедура"),
        MEDICATION("Медикаменты"),
        LAB_TEST("Лаб. анализ");

        String label;
        Category(String label) { this.label = label; }
    }

    enum InsuranceType {
        OSMS("ОСМС", 70),
        DMS("ДМС", 90),
        SELF_PAY("Без страховки", 0);

        String label;
        int coveragePercent;
        InsuranceType(String label, int coveragePercent) {
            this.label = label; this.coveragePercent = coveragePercent;
        }
    }

    static class BillItem {
        String description;
        Category category;
        long amount;
        BillItem(String description, Category category, long amount) {
            this.description = description; this.category = category; this.amount = amount;
        }
    }

    static class MedicalBill {
        String patientName, insuranceCompany;
        List<BillItem> items = new ArrayList<>();
        InsuranceType insuranceType;

        MedicalBill(String patientName, InsuranceType type, String insuranceCompany) {
            this.patientName = patientName; this.insuranceType = type;
            this.insuranceCompany = insuranceCompany;
        }

        void addItem(BillItem item) { items.add(item); }

        long getTotal() { return items.stream().mapToLong(i -> i.amount).sum(); }

        long getCoverage() { return getTotal() * insuranceType.coveragePercent / 100; }

        long getPatientPortion() { return getTotal() - getCoverage(); }

        String formatMoney(long amount) {
            return String.format("%,d", amount).replace(',', ' ') + " ₸";
        }

        void printInvoice() {
            System.out.println("=== МЕДИЦИНСКИЙ СЧЁТ ===");
            System.out.println("Пациент: " + patientName);
            String insLabel = insuranceType.label;
            if (insuranceCompany != null) insLabel += " (СК \"" + insuranceCompany + "\")";
            System.out.println("Страховка: " + insLabel);
            System.out.println();
            System.out.printf("%-32s %-15s %s%n", "Услуга", "Категория", "Сумма");
            System.out.println("----------------------------------------------------------");

            for (BillItem item : items) {
                System.out.printf("%-32s %-15s %s%n",
                    item.description, item.category.label, formatMoney(item.amount));
            }

            System.out.println("----------------------------------------------------------");
            System.out.printf("%-48s %s%n", "ИТОГО:", formatMoney(getTotal()));
            if (insuranceType != InsuranceType.SELF_PAY) {
                System.out.printf("%-48s -%s%n",
                    "Покрытие " + insuranceType.label + " (" + insuranceType.coveragePercent + "%):",
                    formatMoney(getCoverage()));
            }
            System.out.printf("%-48s %s%n", "К ОПЛАТЕ ПАЦИЕНТОМ:", formatMoney(getPatientPortion()));
            System.out.println("=========================");
        }
    }

    public static void main(String[] args) {
        MedicalBill bill1 = new MedicalBill("Касымов Ержан Болатович",
            InsuranceType.OSMS, null);
        bill1.addItem(new BillItem("Приём терапевта", Category.CONSULTATION, 5000));
        bill1.addItem(new BillItem("Общий анализ крови", Category.LAB_TEST, 3500));
        bill1.addItem(new BillItem("Биохимия крови", Category.LAB_TEST, 8000));
        bill1.addItem(new BillItem("Лозартан 50мг (30 таб.)", Category.MEDICATION, 2800));
        bill1.printInvoice();

        System.out.println();

        MedicalBill bill2 = new MedicalBill("Ахметова Динара Сериковна",
            InsuranceType.DMS, "Евразия");
        bill2.addItem(new BillItem("Приём кардиолога", Category.CONSULTATION, 8000));
        bill2.addItem(new BillItem("ЭКГ", Category.PROCEDURE, 12000));
        bill2.addItem(new BillItem("УЗИ сердца", Category.PROCEDURE, 25000));
        bill2.printInvoice();
    }
}`,
      explanation: 'Биллинг — важная часть HIS (Hospital Information System). В Казахстане ОСМС (обязательное соц. мед. страхование) управляется ФСМС. ДМС — добровольное страхование через частные СК (Евразия, Номад, Халык). Тарифы ОСМС утверждает Минздрав. В реальной системе покрытие зависит от тарификатора — конкретного кода услуги. Валюта — KZT (тенге).'
    },
    {
      id: 7,
      title: 'Ward Management: Управление палатами',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Patient. Спринт 7. Задача MED-725: Управление коечным фондом больницы. Палаты делятся по типу: общие, реанимация (ICU), родильное отделение. Система отслеживает свободные и занятые койки, госпитализацию и выписку. Администратор видит dashboard загруженности в реальном времени.',
      requirements: [
        'Класс Bed: id, ward (GENERAL/ICU/MATERNITY), occupied (boolean), patientName',
        'Класс Ward: type, beds (List<Bed>)',
        'Класс Hospital: wards (Map<WardType, Ward>)',
        'Метод admit(patientName, wardType) — госпитализация (проверка наличия мест)',
        'Метод discharge(patientName) — выписка (освободить койку)',
        'Метод printDashboard() — dashboard загруженности всех отделений',
        'В main(): госпитализировать 5 пациентов, выписать 1, показать dashboard'
      ],
      expectedOutput: '✓ Госпитализация: Касымов → Общая палата (койка G-01)\n✓ Госпитализация: Ахметова → Общая палата (койка G-02)\n✓ Госпитализация: Нурланов → Реанимация (койка I-01)\n✓ Госпитализация: Сериков → Реанимация (койка I-02)\n✓ Госпитализация: Айгерим → Родильное (койка M-01)\n✓ Выписка: Касымов (койка G-01 освобождена)\n\n=== ЗАГРУЖЕННОСТЬ СТАЦИОНАРА ===\nОтделение       Всего   Занято  Свободно  Загрузка\n---------------------------------------------------\nОбщая палата       10        1         9     10.0%\nРеанимация          5        2         3     40.0%\nРодильное           5        1         4     20.0%\n---------------------------------------------------\nИТОГО:             20        4        16     20.0%\n================================',
      hint: 'Для каждого типа палаты создай фиксированное количество коек (General: 10, ICU: 5, Maternity: 5). Для admit() найди первую свободную койку. Для discharge() найди койку по имени пациента. Dashboard считай процент загрузки: occupied / total * 100.',
      solution: `import java.util.*;
import java.util.stream.Collectors;

public class Main {
    enum WardType {
        GENERAL("Общая палата", "G"),
        ICU("Реанимация", "I"),
        MATERNITY("Родильное", "M");

        String label, prefix;
        WardType(String label, String prefix) { this.label = label; this.prefix = prefix; }
    }

    static class Bed {
        String id;
        WardType ward;
        boolean occupied;
        String patientName;

        Bed(String id, WardType ward) {
            this.id = id; this.ward = ward;
        }
    }

    static class Ward {
        WardType type;
        List<Bed> beds = new ArrayList<>();

        Ward(WardType type, int capacity) {
            this.type = type;
            for (int i = 1; i <= capacity; i++) {
                beds.add(new Bed(String.format("%s-%02d", type.prefix, i), type));
            }
        }

        Bed findFreeBed() {
            return beds.stream().filter(b -> !b.occupied).findFirst().orElse(null);
        }

        Bed findByPatient(String name) {
            return beds.stream()
                .filter(b -> b.occupied && name.equals(b.patientName))
                .findFirst().orElse(null);
        }

        long occupiedCount() { return beds.stream().filter(b -> b.occupied).count(); }
        int totalCount() { return beds.size(); }
        long freeCount() { return totalCount() - occupiedCount(); }
    }

    static class Hospital {
        Map<WardType, Ward> wards = new LinkedHashMap<>();

        Hospital() {
            wards.put(WardType.GENERAL, new Ward(WardType.GENERAL, 10));
            wards.put(WardType.ICU, new Ward(WardType.ICU, 5));
            wards.put(WardType.MATERNITY, new Ward(WardType.MATERNITY, 5));
        }

        void admit(String patientName, WardType wardType) {
            Ward ward = wards.get(wardType);
            Bed bed = ward.findFreeBed();
            if (bed == null) {
                System.out.println("✗ Нет мест в отделении: " + wardType.label);
                return;
            }
            bed.occupied = true;
            bed.patientName = patientName;
            System.out.println("✓ Госпитализация: " + patientName +
                " → " + wardType.label + " (койка " + bed.id + ")");
        }

        void discharge(String patientName) {
            for (Ward ward : wards.values()) {
                Bed bed = ward.findByPatient(patientName);
                if (bed != null) {
                    bed.occupied = false;
                    bed.patientName = null;
                    System.out.println("✓ Выписка: " + patientName +
                        " (койка " + bed.id + " освобождена)");
                    return;
                }
            }
            System.out.println("✗ Пациент не найден: " + patientName);
        }

        void printDashboard() {
            System.out.println("\\n=== ЗАГРУЖЕННОСТЬ СТАЦИОНАРА ===");
            System.out.printf("%-15s %7s %8s %9s %9s%n",
                "Отделение", "Всего", "Занято", "Свободно", "Загрузка");
            System.out.println("---------------------------------------------------");

            int totalAll = 0;
            long occupiedAll = 0;
            for (Ward ward : wards.values()) {
                int total = ward.totalCount();
                long occupied = ward.occupiedCount();
                long free = ward.freeCount();
                double rate = (double) occupied / total * 100;
                System.out.printf("%-15s %7d %8d %9d %8.1f%%%n",
                    ward.type.label, total, occupied, free, rate);
                totalAll += total;
                occupiedAll += occupied;
            }
            System.out.println("---------------------------------------------------");
            double totalRate = (double) occupiedAll / totalAll * 100;
            System.out.printf("%-15s %7d %8d %9d %8.1f%%%n",
                "ИТОГО:", totalAll, occupiedAll, totalAll - occupiedAll, totalRate);
            System.out.println("================================");
        }
    }

    public static void main(String[] args) {
        Hospital hospital = new Hospital();

        hospital.admit("Касымов", WardType.GENERAL);
        hospital.admit("Ахметова", WardType.GENERAL);
        hospital.admit("Нурланов", WardType.ICU);
        hospital.admit("Сериков", WardType.ICU);
        hospital.admit("Айгерим", WardType.MATERNITY);

        hospital.discharge("Касымов");

        hospital.printDashboard();
    }
}`,
      explanation: 'Управление коечным фондом — обязательный модуль HIS. В Казахстане загруженность стационара мониторится Минздравом. ICU (реанимация) — самое дорогое отделение, загрузка критически важна. В DamuMed койко-дни учитываются для расчёта стоимости госпитализации по тарифам ФСМС. Dashboard загруженности помогает администратору оперативно перераспределять пациентов.'
    },
    {
      id: 8,
      title: 'Medication Inventory: Аптечный склад',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Pharmacy. Спринт 8. Задача MED-830: Управление лекарственным складом больничной аптеки. Каждая партия имеет срок годности. Отпуск по FIFO (первая партия — первая на отпуск). Контролируемые препараты (наркотические, психотропные) на особом учёте. Система генерирует заявку на пополнение при достижении минимального остатка.',
      requirements: [
        'Класс MedBatch: medication, quantity, expiryDate (LocalDate), batchNumber, controlled (boolean)',
        'Класс Pharmacy: inventory (Map<String, List<MedBatch>>), minStock (Map<String, Integer>)',
        'Метод receive(batch) — приёмка партии на склад',
        'Метод dispense(medication, qty) — отпуск по FIFO, проверка срока годности',
        'Метод checkExpired() — найти просроченные партии',
        'Метод generateOrderList() — заявка на пополнение (stock < minStock)',
        'В main(): приёмка, отпуск, проверка остатков'
      ],
      expectedOutput: '✓ Приёмка: Амоксициллин партия B-001 (100 шт., годен до 15.12.2026)\n✓ Приёмка: Амоксициллин партия B-002 (50 шт., годен до 20.03.2027)\n✓ Приёмка: Морфин партия N-001 (20 шт., годен до 01.06.2026) [КОНТРОЛИРУЕМЫЙ]\n✓ Приёмка: Парацетамол партия B-003 (200 шт., годен до 10.01.2025)\n\n✓ Отпуск: Амоксициллин 30 шт. (партия B-001, осталось 70)\n⚠ Просроченные препараты:\n  Парацетамол партия B-003 (годен до 10.01.2025) — 200 шт.\n\n=== ЗАЯВКА НА ПОПОЛНЕНИЕ ===\nПрепарат            Остаток   Мин. запас  Заказать\n-----------------------------------------------------\nПарацетамол              0          50        50\n-----------------------------------------------------\nКонтролируемые: Морфин (20 шт.) — требует спецучёта\n============================',
      hint: 'Для FIFO сортируй партии по expiryDate. При отпуске бери из партии с самым ранним сроком годности. Перед отпуском проверяй: не просрочена ли партия. MinStock — минимальный остаток, ниже которого генерируется заявка.',
      solution: `import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

public class Main {
    static class MedBatch {
        String medication, batchNumber;
        int quantity;
        LocalDate expiryDate;
        boolean controlled;

        MedBatch(String medication, String batchNumber, int quantity,
                 LocalDate expiryDate, boolean controlled) {
            this.medication = medication; this.batchNumber = batchNumber;
            this.quantity = quantity; this.expiryDate = expiryDate;
            this.controlled = controlled;
        }

        boolean isExpired() { return expiryDate.isBefore(LocalDate.now()); }
    }

    static class Pharmacy {
        Map<String, List<MedBatch>> inventory = new LinkedHashMap<>();
        Map<String, Integer> minStock = new HashMap<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd.MM.yyyy");

        Pharmacy() {
            minStock.put("Амоксициллин", 30);
            minStock.put("Парацетамол", 50);
            minStock.put("Морфин", 10);
        }

        void receive(MedBatch batch) {
            inventory.computeIfAbsent(batch.medication, k -> new ArrayList<>()).add(batch);
            String extra = batch.controlled ? " [КОНТРОЛИРУЕМЫЙ]" : "";
            System.out.println("✓ Приёмка: " + batch.medication + " партия " +
                batch.batchNumber + " (" + batch.quantity + " шт., годен до " +
                batch.expiryDate.format(fmt) + ")" + extra);
        }

        void dispense(String medication, int qty) {
            List<MedBatch> batches = inventory.getOrDefault(medication, new ArrayList<>());
            batches.sort(Comparator.comparing(b -> b.expiryDate));

            for (MedBatch batch : batches) {
                if (batch.isExpired()) continue;
                if (batch.quantity <= 0) continue;

                int take = Math.min(batch.quantity, qty);
                batch.quantity -= take;
                qty -= take;
                System.out.println("✓ Отпуск: " + medication + " " + take +
                    " шт. (партия " + batch.batchNumber + ", осталось " + batch.quantity + ")");
                if (qty <= 0) break;
            }
            if (qty > 0) {
                System.out.println("✗ Недостаточно " + medication + ": не хватает " + qty + " шт.");
            }
        }

        void checkExpired() {
            System.out.println("⚠ Просроченные препараты:");
            boolean found = false;
            for (var entry : inventory.entrySet()) {
                for (MedBatch b : entry.getValue()) {
                    if (b.isExpired() && b.quantity > 0) {
                        System.out.println("  " + b.medication + " партия " +
                            b.batchNumber + " (годен до " + b.expiryDate.format(fmt) +
                            ") — " + b.quantity + " шт.");
                        found = true;
                    }
                }
            }
            if (!found) System.out.println("  Нет просроченных препаратов");
        }

        void generateOrderList() {
            System.out.println("\\n=== ЗАЯВКА НА ПОПОЛНЕНИЕ ===");
            System.out.printf("%-20s %8s %11s %9s%n",
                "Препарат", "Остаток", "Мин. запас", "Заказать");
            System.out.println("-----------------------------------------------------");

            List<String> controlledList = new ArrayList<>();
            boolean needsOrder = false;
            for (var entry : minStock.entrySet()) {
                String med = entry.getKey();
                int min = entry.getValue();
                int current = inventory.getOrDefault(med, List.of()).stream()
                    .filter(b -> !b.isExpired())
                    .mapToInt(b -> b.quantity).sum();

                if (current < min) {
                    System.out.printf("%-20s %8d %11d %9d%n", med, current, min, min - current);
                    needsOrder = true;
                }

                // Контролируемые
                inventory.getOrDefault(med, List.of()).stream()
                    .filter(b -> b.controlled && b.quantity > 0)
                    .forEach(b -> controlledList.add(med + " (" + b.quantity + " шт.)"));
            }

            if (!needsOrder) System.out.println("Все препараты в достаточном количестве");
            System.out.println("-----------------------------------------------------");
            if (!controlledList.isEmpty()) {
                System.out.println("Контролируемые: " + String.join(", ", controlledList) +
                    " — требует спецучёта");
            }
            System.out.println("============================");
        }
    }

    public static void main(String[] args) {
        Pharmacy pharmacy = new Pharmacy();

        pharmacy.receive(new MedBatch("Амоксициллин", "B-001", 100,
            LocalDate.of(2026, 12, 15), false));
        pharmacy.receive(new MedBatch("Амоксициллин", "B-002", 50,
            LocalDate.of(2027, 3, 20), false));
        pharmacy.receive(new MedBatch("Морфин", "N-001", 20,
            LocalDate.of(2026, 6, 1), true));
        pharmacy.receive(new MedBatch("Парацетамол", "B-003", 200,
            LocalDate.of(2025, 1, 10), false));

        System.out.println();
        pharmacy.dispense("Амоксициллин", 30);
        pharmacy.checkExpired();
        pharmacy.generateOrderList();
    }
}`,
      explanation: 'Аптечный склад — критический модуль больницы. FIFO (First In, First Out) — обязательный принцип: отпускаем сначала партии с ближайшим сроком годности. Просроченные лекарства списываются. Контролируемые препараты (морфин, промедол) — на предметно-количественном учёте по приказу Минздрава РК. Система заявок автоматизирует закупки. В DamuMed аптечный модуль интегрирован с электронным рецептом.'
    },
    {
      id: 9,
      title: 'Insurance Claims: Работа с ДМС',
      type: 'practice',
      difficulty: 'hard',
      description: 'Команда Patient. Спринт 9. Задача MED-935: Обработка страховых заявок. Клиника отправляет заявки в страховую компанию (ДМС). Каждая заявка проходит проверки: действует ли полис, покрывается ли услуга, в рамках ли лимита. Страховая может одобрить, частично одобрить или отклонить заявку. Полный цикл: SUBMITTED → APPROVED / PARTIALLY_APPROVED / REJECTED.',
      requirements: [
        'Класс InsurancePolicy: policyNumber, patientName, company, validFrom, validTo, annualLimit (long), usedAmount (long), coveredServices (Set<String>), excludedServices (Set<String>)',
        'Класс Claim: id, policy, services (List<ClaimService>), status, approvedAmount, rejectionReason',
        'Enum ClaimStatus: SUBMITTED, UNDER_REVIEW, APPROVED, PARTIALLY_APPROVED, REJECTED',
        'Метод submitClaim() — подать заявку с проверками (полис, покрытие, лимит)',
        'Метод processClaim() — обработка: одобрение, частичное одобрение, отказ',
        'Печать результата обработки с деталями',
        'В main(): 3 заявки — одобренная, частичная, отклонённая'
      ],
      expectedOutput: '=== СТРАХОВАЯ ЗАЯВКА CLM-001 ===\nПолис: DMS-2026-001 (СК \"Евразия\")\nПациент: Касымов Ержан Болатович\n\nУслуги:\n  1. Приём кардиолога           8 000 ₸  [ПОКРЫВАЕТСЯ]\n  2. ЭКГ                       12 000 ₸  [ПОКРЫВАЕТСЯ]\n  3. УЗИ сердца                25 000 ₸  [ПОКРЫВАЕТСЯ]\n\nИтого заявлено: 45 000 ₸\nСтатус: ОДОБРЕНО\nОдобренная сумма: 45 000 ₸\n================================\n\n=== СТРАХОВАЯ ЗАЯВКА CLM-002 ===\nПолис: DMS-2026-001 (СК \"Евразия\")\nПациент: Касымов Ержан Болатович\n\nУслуги:\n  1. МРТ головного мозга       45 000 ₸  [ПОКРЫВАЕТСЯ]\n  2. Косметическая процедура   30 000 ₸  [ИСКЛЮЧЕНА]\n\nИтого заявлено: 75 000 ₸\nСтатус: ЧАСТИЧНО ОДОБРЕНО\nОдобренная сумма: 45 000 ₸\nИсключено: Косметическая процедура — не входит в покрытие\n================================\n\n=== СТРАХОВАЯ ЗАЯВКА CLM-003 ===\nПолис: DMS-2026-002 (СК \"Номад\")\nПациент: Ахметова Динара Сериковна\n\nУслуги:\n  1. Операция на позвоночнике 850 000 ₸  [ПОКРЫВАЕТСЯ]\n\nИтого заявлено: 850 000 ₸\nСтатус: ОТКЛОНЕНО\nПричина: Превышен годовой лимит (доступно: 200 000 ₸ из 500 000 ₸)\n================================',
      hint: 'Проверки при обработке: 1) Полис действителен (дата). 2) Услуга не в excludedServices. 3) Сумма не превышает оставшийся лимит (annualLimit - usedAmount). Если часть услуг исключена — PARTIALLY_APPROVED. Если лимит исчерпан — REJECTED.',
      solution: `import java.time.LocalDate;
import java.util.*;

public class Main {
    enum ClaimStatus {
        SUBMITTED("ПОДАНА"), UNDER_REVIEW("НА РАССМОТРЕНИИ"),
        APPROVED("ОДОБРЕНО"), PARTIALLY_APPROVED("ЧАСТИЧНО ОДОБРЕНО"),
        REJECTED("ОТКЛОНЕНО");
        String label;
        ClaimStatus(String label) { this.label = label; }
    }

    static class InsurancePolicy {
        String policyNumber, patientName, company;
        LocalDate validFrom, validTo;
        long annualLimit, usedAmount;
        Set<String> coveredServices, excludedServices;

        InsurancePolicy(String policyNumber, String patientName, String company,
                        LocalDate validFrom, LocalDate validTo, long annualLimit, long usedAmount,
                        Set<String> coveredServices, Set<String> excludedServices) {
            this.policyNumber = policyNumber; this.patientName = patientName;
            this.company = company; this.validFrom = validFrom; this.validTo = validTo;
            this.annualLimit = annualLimit; this.usedAmount = usedAmount;
            this.coveredServices = coveredServices; this.excludedServices = excludedServices;
        }

        boolean isValid() {
            LocalDate now = LocalDate.now();
            return !now.isBefore(validFrom) && !now.isAfter(validTo);
        }

        long remainingLimit() { return annualLimit - usedAmount; }
    }

    static class ClaimService {
        String name;
        long amount;
        boolean covered;
        String exclusionReason;

        ClaimService(String name, long amount) {
            this.name = name; this.amount = amount; this.covered = true;
        }
    }

    static class Claim {
        String id;
        InsurancePolicy policy;
        List<ClaimService> services;
        ClaimStatus status = ClaimStatus.SUBMITTED;
        long approvedAmount;
        String rejectionReason;

        Claim(String id, InsurancePolicy policy, List<ClaimService> services) {
            this.id = id; this.policy = policy; this.services = services;
        }

        void process() {
            if (!policy.isValid()) {
                status = ClaimStatus.REJECTED;
                rejectionReason = "Полис недействителен";
                return;
            }

            long coveredTotal = 0;
            List<String> excluded = new ArrayList<>();

            for (ClaimService svc : services) {
                if (policy.excludedServices.contains(svc.name)) {
                    svc.covered = false;
                    svc.exclusionReason = "не входит в покрытие";
                    excluded.add(svc.name + " — " + svc.exclusionReason);
                } else {
                    coveredTotal += svc.amount;
                }
            }

            long remaining = policy.remainingLimit();
            if (coveredTotal > remaining && excluded.isEmpty()) {
                status = ClaimStatus.REJECTED;
                rejectionReason = String.format("Превышен годовой лимит (доступно: %s из %s)",
                    formatMoney(remaining), formatMoney(policy.annualLimit));
                return;
            }

            if (!excluded.isEmpty()) {
                status = ClaimStatus.PARTIALLY_APPROVED;
                approvedAmount = Math.min(coveredTotal, remaining);
                rejectionReason = String.join("; ", excluded);
            } else {
                status = ClaimStatus.APPROVED;
                approvedAmount = coveredTotal;
            }
            policy.usedAmount += approvedAmount;
        }

        void printClaim() {
            System.out.println("=== СТРАХОВАЯ ЗАЯВКА " + id + " ===");
            System.out.println("Полис: " + policy.policyNumber +
                " (СК \\"" + policy.company + "\\")");
            System.out.println("Пациент: " + policy.patientName);
            System.out.println();
            System.out.println("Услуги:");
            long total = 0;
            int i = 1;
            for (ClaimService svc : services) {
                String flag = svc.covered ? "ПОКРЫВАЕТСЯ" : "ИСКЛЮЧЕНА";
                System.out.printf("  %d. %-25s %s  [%s]%n", i++, svc.name,
                    formatMoney(svc.amount), flag);
                total += svc.amount;
            }
            System.out.println();
            System.out.println("Итого заявлено: " + formatMoney(total));
            System.out.println("Статус: " + status.label);

            if (status == ClaimStatus.APPROVED || status == ClaimStatus.PARTIALLY_APPROVED) {
                System.out.println("Одобренная сумма: " + formatMoney(approvedAmount));
            }
            if (status == ClaimStatus.PARTIALLY_APPROVED) {
                System.out.println("Исключено: " + rejectionReason);
            }
            if (status == ClaimStatus.REJECTED) {
                System.out.println("Причина: " + rejectionReason);
            }
            System.out.println("================================");
        }
    }

    static String formatMoney(long amount) {
        return String.format("%,d", amount).replace(',', ' ') + " ₸";
    }

    public static void main(String[] args) {
        InsurancePolicy policy1 = new InsurancePolicy("DMS-2026-001",
            "Касымов Ержан Болатович", "Евразия",
            LocalDate.of(2026, 1, 1), LocalDate.of(2026, 12, 31),
            500_000, 0,
            Set.of("Приём кардиолога", "ЭКГ", "УЗИ сердца", "МРТ головного мозга",
                   "Операция на позвоночнике"),
            Set.of("Косметическая процедура", "Стоматология эстетическая"));

        // Заявка 1 — полное одобрение
        Claim claim1 = new Claim("CLM-001", policy1, new ArrayList<>(List.of(
            new ClaimService("Приём кардиолога", 8_000),
            new ClaimService("ЭКГ", 12_000),
            new ClaimService("УЗИ сердца", 25_000)
        )));
        claim1.process();
        claim1.printClaim();

        // Заявка 2 — частичное одобрение (исключённая услуга)
        System.out.println();
        Claim claim2 = new Claim("CLM-002", policy1, new ArrayList<>(List.of(
            new ClaimService("МРТ головного мозга", 45_000),
            new ClaimService("Косметическая процедура", 30_000)
        )));
        claim2.process();
        claim2.printClaim();

        // Заявка 3 — отклонение (превышен лимит)
        System.out.println();
        InsurancePolicy policy2 = new InsurancePolicy("DMS-2026-002",
            "Ахметова Динара Сериковна", "Номад",
            LocalDate.of(2026, 1, 1), LocalDate.of(2026, 12, 31),
            500_000, 300_000,
            Set.of("Операция на позвоночнике"),
            Set.of());

        Claim claim3 = new Claim("CLM-003", policy2, new ArrayList<>(List.of(
            new ClaimService("Операция на позвоночнике", 850_000)
        )));
        claim3.process();
        claim3.printClaim();
    }
}`,
      explanation: 'Работа с ДМС — сложный бизнес-процесс. Каждая заявка проверяется: 1) валидность полиса по дате, 2) покрывается ли услуга (excluded list), 3) хватает ли годового лимита. Статусная модель: SUBMITTED → UNDER_REVIEW → APPROVED/PARTIALLY_APPROVED/REJECTED. В Казахстане крупнейшие ДМС-компании: СК Евразия, Номад, Халык. Интеграция клиника-страховая идёт через API или EDI (electronic data interchange).'
    },
    {
      id: 10,
      title: 'Clinical Analytics: Аналитика клиники',
      type: 'practice',
      difficulty: 'hard',
      description: 'Команда Analytics. Спринт 10. Задача MED-1040: Dashboard аналитики клиники. Руководство принимает решения на основе данных: поток пациентов, загрузка врачей, финансовые показатели, заполняемость стационара. Система агрегирует данные за период и выявляет узкие места (bottlenecks). Ключевые KPI для КМИС и DamuMed.',
      requirements: [
        'Класс Visit: date, doctorName, department, diagnosis, waitMinutes, revenue (long)',
        'Класс Analytics: visits (List<Visit>), beds (total/occupied)',
        'Метод patientsPerDay() — среднее число пациентов в день',
        'Метод avgWaitTime() — среднее время ожидания (минуты)',
        'Метод topDiagnoses(n) — топ-N диагнозов',
        'Метод doctorWorkload() — нагрузка на врачей (визитов на врача)',
        'Метод revenueByDepartment() — выручка по отделениям',
        'Метод printDashboard() — полный dashboard с KPI',
        'В main(): сгенерировать данные за месяц, показать dashboard'
      ],
      expectedOutput: '=== АНАЛИТИКА КЛИНИКИ: Март 2026 ===\n\n📊 КЛЮЧЕВЫЕ ПОКАЗАТЕЛИ (KPI)\nПациентов за месяц:          120\nСреднее в день:              6.0\nСреднее ожидание:            23 мин\nЗагрузка стационара:         72.0% (36/50)\nПовторные визиты:            15.0%\n\n📋 ТОП-5 ДИАГНОЗОВ\n  1. ОРВИ (J06)                  28 (23.3%)\n  2. Гипертензия (I10)           22 (18.3%)\n  3. Гастрит (K29)               18 (15.0%)\n  4. Остеохондроз (M42)          15 (12.5%)\n  5. Диабет 2 типа (E11)         12 (10.0%)\n\n👨‍⚕️ НАГРУЗКА ВРАЧЕЙ\n  Др. Ибраева       35 визитов  (1.7/день)\n  Др. Нурланов      30 визитов  (1.4/день)\n  Др. Сатпаева      28 визитов  (1.3/день)\n  Др. Касымбеков    27 визитов  (1.3/день)\n\n💰 ВЫРУЧКА ПО ОТДЕЛЕНИЯМ\n  Кардиология          1 250 000 ₸  (28.5%)\n  Терапия                980 000 ₸  (22.3%)\n  Хирургия              850 000 ₸  (19.4%)\n  Неврология            720 000 ₸  (16.4%)\n  Лаборатория           590 000 ₸  (13.4%)\n  ─────────────────────────────────\n  ИТОГО:              4 390 000 ₸\n\n⚠ УЗКИЕ МЕСТА\n  • Среднее ожидание > 20 мин — рассмотреть доп. слоты\n  • Загрузка стационара > 70% — контроль коечного фонда\n=====================================',
      hint: 'Для топ-N диагнозов: Map<String, Long> с Collectors.groupingBy + counting(), затем сортируй по значению. Для bottleneck-анализа: если waitTime > 20 мин или occupancy > 70% — сигнал. Для врачей: группируй визиты по doctorName, считай среднее в день.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    static class Visit {
        String date, doctorName, department, diagnosis;
        int waitMinutes;
        long revenue;
        boolean isReturn;

        Visit(String date, String doctorName, String department,
              String diagnosis, int waitMinutes, long revenue, boolean isReturn) {
            this.date = date; this.doctorName = doctorName;
            this.department = department; this.diagnosis = diagnosis;
            this.waitMinutes = waitMinutes; this.revenue = revenue;
            this.isReturn = isReturn;
        }
    }

    static class Analytics {
        List<Visit> visits;
        int totalBeds, occupiedBeds;

        Analytics(List<Visit> visits, int totalBeds, int occupiedBeds) {
            this.visits = visits; this.totalBeds = totalBeds;
            this.occupiedBeds = occupiedBeds;
        }

        int totalPatients() { return visits.size(); }

        double patientsPerDay() {
            long days = visits.stream().map(v -> v.date).distinct().count();
            return days == 0 ? 0 : (double) visits.size() / days;
        }

        int avgWaitTime() {
            return (int) visits.stream().mapToInt(v -> v.waitMinutes).average().orElse(0);
        }

        double occupancyRate() {
            return (double) occupiedBeds / totalBeds * 100;
        }

        double returnRate() {
            long returns = visits.stream().filter(v -> v.isReturn).count();
            return (double) returns / visits.size() * 100;
        }

        List<Map.Entry<String, Long>> topDiagnoses(int n) {
            return visits.stream()
                .collect(Collectors.groupingBy(v -> v.diagnosis, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(n)
                .collect(Collectors.toList());
        }

        Map<String, Long> doctorWorkload() {
            return visits.stream()
                .collect(Collectors.groupingBy(v -> v.doctorName, LinkedHashMap::new,
                    Collectors.counting()));
        }

        Map<String, Long> revenueByDepartment() {
            return visits.stream()
                .collect(Collectors.groupingBy(v -> v.department, LinkedHashMap::new,
                    Collectors.summingLong(v -> v.revenue)));
        }

        String formatMoney(long amount) {
            return String.format("%,d", amount).replace(',', ' ') + " ₸";
        }

        void printDashboard() {
            long days = visits.stream().map(v -> v.date).distinct().count();

            System.out.println("=== АНАЛИТИКА КЛИНИКИ: Март 2026 ===");
            System.out.println();

            // KPI
            System.out.println("📊 КЛЮЧЕВЫЕ ПОКАЗАТЕЛИ (KPI)");
            System.out.printf("%-30s %d%n", "Пациентов за месяц:", totalPatients());
            System.out.printf("%-30s %.1f%n", "Среднее в день:", patientsPerDay());
            System.out.printf("%-30s %d мин%n", "Среднее ожидание:", avgWaitTime());
            System.out.printf("%-30s %.1f%% (%d/%d)%n", "Загрузка стационара:",
                occupancyRate(), occupiedBeds, totalBeds);
            System.out.printf("%-30s %.1f%%%n", "Повторные визиты:", returnRate());

            // Топ диагнозов
            System.out.println();
            System.out.println("📋 ТОП-5 ДИАГНОЗОВ");
            var topDiag = topDiagnoses(5);
            int rank = 1;
            for (var entry : topDiag) {
                double pct = (double) entry.getValue() / visits.size() * 100;
                System.out.printf("  %d. %-28s %d (%.1f%%)%n",
                    rank++, entry.getKey(), entry.getValue(), pct);
            }

            // Нагрузка врачей
            System.out.println();
            System.out.println("👨\u200D⚕️ НАГРУЗКА ВРАЧЕЙ");
            var workload = doctorWorkload().entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .collect(Collectors.toList());
            for (var entry : workload) {
                double perDay = (double) entry.getValue() / days;
                System.out.printf("  %-18s %d визитов  (%.1f/день)%n",
                    "Др. " + entry.getKey(), entry.getValue(), perDay);
            }

            // Выручка
            System.out.println();
            System.out.println("💰 ВЫРУЧКА ПО ОТДЕЛЕНИЯМ");
            var revenue = revenueByDepartment().entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .collect(Collectors.toList());
            long totalRevenue = revenue.stream().mapToLong(Map.Entry::getValue).sum();
            for (var entry : revenue) {
                double pct = (double) entry.getValue() / totalRevenue * 100;
                System.out.printf("  %-20s %15s  (%.1f%%)%n",
                    entry.getKey(), formatMoney(entry.getValue()), pct);
            }
            System.out.println("  ─────────────────────────────────");
            System.out.printf("  %-20s %15s%n", "ИТОГО:", formatMoney(totalRevenue));

            // Узкие места
            System.out.println();
            System.out.println("⚠ УЗКИЕ МЕСТА");
            if (avgWaitTime() > 20)
                System.out.println("  • Среднее ожидание > 20 мин — рассмотреть доп. слоты");
            if (occupancyRate() > 70)
                System.out.println("  • Загрузка стационара > 70% — контроль коечного фонда");
            if (returnRate() > 10)
                System.out.println("  • Повторные визиты > 10% — анализ качества лечения");

            System.out.println("=====================================");
        }
    }

    public static void main(String[] args) {
        List<Visit> visits = new ArrayList<>();
        String[] doctors = {"Ибраева", "Нурланов", "Сатпаева", "Касымбеков"};
        String[][] diagnosisData = {
            {"ОРВИ (J06)", "Терапия"}, {"Гипертензия (I10)", "Кардиология"},
            {"Гастрит (K29)", "Терапия"}, {"Остеохондроз (M42)", "Неврология"},
            {"Диабет 2 типа (E11)", "Терапия"}
        };
        int[] diagCounts = {28, 22, 18, 15, 12};
        long[] deptRevenue = {980000, 1250000, 980000, 720000, 980000};
        int visitId = 0;
        Random rnd = new Random(42);

        for (int d = 0; d < diagnosisData.length; d++) {
            for (int i = 0; i < diagCounts[d]; i++) {
                int day = (visitId % 20) + 1;
                String date = String.format("2026-03-%02d", day);
                String doctor = doctors[visitId % doctors.length];
                String dept = diagnosisData[d][1];
                if (doctor.equals("Ибраева") || doctor.equals("Сатпаева"))
                    dept = d == 1 ? "Кардиология" : diagnosisData[d][1];
                if (doctor.equals("Касымбеков")) dept = "Хирургия";

                int wait = 10 + rnd.nextInt(30);
                long rev = 15000 + rnd.nextInt(35000);
                boolean isReturn = rnd.nextInt(100) < 15;

                visits.add(new Visit(date, doctor, dept, diagnosisData[d][0],
                    wait, rev, isReturn));
                visitId++;
            }
        }

        // Скорректировать выручку по отделениям для реалистичных цифр
        Map<String, Long> revByDept = new LinkedHashMap<>();
        revByDept.put("Кардиология", 1250000L);
        revByDept.put("Терапия", 980000L);
        revByDept.put("Хирургия", 850000L);
        revByDept.put("Неврология", 720000L);
        revByDept.put("Лаборатория", 590000L);

        // Создаём финальные визиты с правильной выручкой
        List<Visit> finalVisits = new ArrayList<>();
        Map<String, List<Visit>> byDept = visits.stream()
            .collect(Collectors.groupingBy(v -> v.department));

        for (var entry : revByDept.entrySet()) {
            String dept = entry.getKey();
            long targetRev = entry.getValue();
            List<Visit> deptVisits = byDept.getOrDefault(dept, new ArrayList<>());
            if (deptVisits.isEmpty()) {
                // Добавить визиты для лаборатории
                for (int i = 0; i < 25; i++) {
                    int day = (i % 20) + 1;
                    finalVisits.add(new Visit(String.format("2026-03-%02d", day),
                        doctors[i % doctors.length], dept, "Лаб. анализы",
                        5 + rnd.nextInt(15), targetRev / 25, i % 7 == 0));
                }
            } else {
                long perVisit = targetRev / deptVisits.size();
                for (Visit v : deptVisits) {
                    v.department = dept;
                    v.revenue = perVisit;
                    finalVisits.add(v);
                }
            }
        }

        Analytics analytics = new Analytics(finalVisits, 50, 36);
        analytics.printDashboard();
    }
}`,
      explanation: 'Аналитика — уровень BI (Business Intelligence) для руководства клиники. KPI: поток пациентов, время ожидания, загрузка стационара, выручка. Топ диагнозов показывает эпидемиологическую картину (ОРВИ зимой — #1). Bottleneck-анализ: ожидание > 20 мин = нужно больше слотов, загрузка > 70% = риск переполнения. В DamuMed аналитика агрегируется на уровне области и республики для Минздрава. Stream API идеально подходит для агрегации данных.'
    }
  ]
};
