export default {
  id: 111,
  title: 'Реальная разработка: Авиакомпания',
  description: 'Задачи Java-разработчика в авиакомпании: поиск рейсов, бронирование, тарифы, регистрация, багаж, программа лояльности и расписание.',
  lessons: [
    {
      id: 1,
      title: 'Flight Search: Поиск рейсов',
      type: 'practice',
      difficulty: 'easy',
      description: 'Команда Digital, спринт "Поиск". Jira FLY-101: Реализовать поиск рейсов для системы бронирования Air Astana. Аналог поиска в Amadeus GDS — пассажир вводит маршрут и дату, система возвращает доступные рейсы с фильтрами и сортировкой. Используется в мобильном приложении и на сайте.',
      requirements: [
        'Класс Flight: flightNumber, origin, destination, departureTime, arrivalTime, price, stops (0 = прямой)',
        'Метод searchFlights(flights, origin, destination, date) — базовый поиск',
        'Фильтры: directOnly (stops == 0), maxPrice, preferredTime (MORNING 06-12, AFTERNOON 12-18, EVENING 18-23)',
        'Сортировка: по цене (дешёвые первые) или по длительности (быстрые первые)',
        'Форматированный вывод: KC901 | ALA→NQZ | 07:00-10:30 | 3ч 30м | 25 400 KZT',
        'Маршруты: Almaty(ALA), Astana(NQZ), Istanbul(IST), Dubai(DXB), Shymkent(CIT)'
      ],
      expectedOutput: `=== Поиск: ALA → NQZ, 2025-03-15 ===
--- Все рейсы ---
KC901 | ALA→NQZ | 07:00-10:30 | 3ч 30м | 25400 KZT
KC903 | ALA→NQZ | 12:00-15:20 | 3ч 20м | 32000 KZT
FZ801 | ALA→NQZ | 09:00-12:30 | 3ч 30м | 15900 KZT
KC905 | ALA→NQZ | 18:00-21:15 | 3ч 15м | 28500 KZT
KC907 | ALA→NQZ | 14:00-19:00 | 5ч 0м | 19900 KZT (1 stop)

--- Только прямые, до 30000 KZT, утро ---
KC901 | ALA→NQZ | 07:00-10:30 | 3ч 30м | 25400 KZT
FZ801 | ALA→NQZ | 09:00-12:30 | 3ч 30м | 15900 KZT

--- Сортировка по цене ---
FZ801 | ALA→NQZ | 09:00-12:30 | 3ч 30м | 15900 KZT
KC901 | ALA→NQZ | 07:00-10:30 | 3ч 30м | 25400 KZT`,
      hint: 'Создайте список рейсов и фильтруйте через Stream API: filter() для каждого условия, sorted(Comparator.comparingInt(f -> f.price)) для сортировки. Длительность считайте через Duration.between(departure, arrival).',
      solution: `import java.time.LocalTime;
import java.time.Duration;
import java.util.*;
import java.util.stream.*;

public class Main {
    enum TimePreference { MORNING, AFTERNOON, EVENING }

    static class Flight {
        String flightNumber, origin, destination;
        LocalTime departure, arrival;
        int price, stops;

        Flight(String fn, String orig, String dest, String dep, String arr, int price, int stops) {
            this.flightNumber = fn; this.origin = orig; this.destination = dest;
            this.departure = LocalTime.parse(dep); this.arrival = LocalTime.parse(arr);
            this.price = price; this.stops = stops;
        }

        long durationMinutes() {
            long mins = Duration.between(departure, arrival).toMinutes();
            return mins < 0 ? mins + 1440 : mins;
        }

        String format() {
            long dur = durationMinutes();
            String stopInfo = stops > 0 ? " (" + stops + " stop)" : "";
            return String.format("%s | %s→%s | %s-%s | %dч %dм | %d KZT%s",
                flightNumber, origin, destination,
                departure, arrival, dur / 60, dur % 60, price, stopInfo);
        }
    }

    static List<Flight> search(List<Flight> flights, String origin, String dest,
                                boolean directOnly, int maxPrice, TimePreference timePref, String sortBy) {
        Stream<Flight> stream = flights.stream()
            .filter(f -> f.origin.equals(origin) && f.destination.equals(dest));
        if (directOnly) stream = stream.filter(f -> f.stops == 0);
        if (maxPrice > 0) stream = stream.filter(f -> f.price <= maxPrice);
        if (timePref != null) {
            stream = stream.filter(f -> {
                int h = f.departure.getHour();
                return switch (timePref) {
                    case MORNING -> h >= 6 && h < 12;
                    case AFTERNOON -> h >= 12 && h < 18;
                    case EVENING -> h >= 18 && h < 23;
                };
            });
        }
        if ("price".equals(sortBy)) stream = stream.sorted(Comparator.comparingInt(f -> f.price));
        else if ("duration".equals(sortBy)) stream = stream.sorted(Comparator.comparingLong(Flight::durationMinutes));
        return stream.collect(Collectors.toList());
    }

    public static void main(String[] args) {
        List<Flight> flights = List.of(
            new Flight("KC901", "ALA", "NQZ", "07:00", "10:30", 25400, 0),
            new Flight("KC903", "ALA", "NQZ", "12:00", "15:20", 32000, 0),
            new Flight("FZ801", "ALA", "NQZ", "09:00", "12:30", 15900, 0),
            new Flight("KC905", "ALA", "NQZ", "18:00", "21:15", 28500, 0),
            new Flight("KC907", "ALA", "NQZ", "14:00", "19:00", 19900, 1)
        );

        System.out.println("=== Поиск: ALA → NQZ, 2025-03-15 ===");
        System.out.println("--- Все рейсы ---");
        search(flights, "ALA", "NQZ", false, 0, null, null).forEach(f -> System.out.println(f.format()));

        System.out.println("\\n--- Только прямые, до 30000 KZT, утро ---");
        search(flights, "ALA", "NQZ", true, 30000, TimePreference.MORNING, null)
            .forEach(f -> System.out.println(f.format()));

        System.out.println("\\n--- Сортировка по цене ---");
        search(flights, "ALA", "NQZ", true, 30000, TimePreference.MORNING, "price")
            .forEach(f -> System.out.println(f.format()));
    }
}`,
      explanation: 'Поиск рейсов — основная функция любого GDS (Amadeus, Sabre). Stream API идеально подходит для цепочки фильтров: каждый filter() добавляет условие, sorted() сортирует результат. В реальных системах данные приходят из GDS API, здесь упрощено до in-memory коллекции. TimePreference через switch expression (Java 17+) — чистый способ классификации времени вылета.'
    },
    {
      id: 2,
      title: 'Seat Map: Карта мест',
      type: 'practice',
      difficulty: 'easy',
      description: 'Команда Digital, спринт "Seat Selection". Jira FLY-102: Реализовать модель карты мест самолёта для выбора места при онлайн-регистрации Air Astana. Airbus A320 — 30 рядов, 6 мест в ряду (A-F). Бизнес-класс ряды 1-5, эконом 6-30. Система должна показывать свободные/занятые места и позволять бронировать.',
      requirements: [
        'Класс Seat: row, column (A-F), type (WINDOW/MIDDLE/AISLE), seatClass (BUSINESS/ECONOMY), status (AVAILABLE/OCCUPIED/BLOCKED)',
        'Класс SeatMap: двумерная структура 30 рядов x 6 мест (A=WINDOW, B=MIDDLE, C=AISLE, D=AISLE, E=MIDDLE, F=WINDOW)',
        'Метод findAvailableSeats(seatClass, seatType) — поиск свободных мест по классу и типу',
        'Метод bookSeat(row, column) — бронирование места (AVAILABLE → OCCUPIED)',
        'Визуализация ряда: [1A✓] [1B✓] [1C✓]   [1D✓] [1E✓] [1F✗]',
        'Статистика: всего мест, свободно, занято по классам'
      ],
      expectedOutput: `=== Карта мест: Airbus A320 (KC901) ===
Ряд 1 (BUSINESS): [1A ✓] [1B ✓] [1C ✓]   [1D ✓] [1E ✓] [1F ✓]
Ряд 2 (BUSINESS): [2A ✗] [2B ✓] [2C ✓]   [2D ✓] [2E ✗] [2F ✓]

--- Свободные окна в бизнесе ---
1A (BUSINESS, WINDOW)
1F (BUSINESS, WINDOW)
2F (BUSINESS, WINDOW)

--- Бронирование 1A ---
Место 1A забронировано!
Ряд 1 (BUSINESS): [1A ✗] [1B ✓] [1C ✓]   [1D ✓] [1E ✓] [1F ✓]

--- Статистика ---
BUSINESS: 26/30 свободно
ECONOMY: 142/150 свободно`,
      hint: 'Используйте enum для SeatType и SeatStatus. Карту мест можно хранить как Seat[][] или Map<String, Seat>. A/F = WINDOW, B/E = MIDDLE, C/D = AISLE определяется по индексу столбца.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    enum SeatType { WINDOW, MIDDLE, AISLE }
    enum SeatClass { BUSINESS, ECONOMY }
    enum SeatStatus { AVAILABLE, OCCUPIED, BLOCKED }

    static class Seat {
        int row; char col; SeatType type; SeatClass seatClass; SeatStatus status;
        Seat(int row, char col, SeatType type, SeatClass sc) {
            this.row = row; this.col = col; this.type = type;
            this.seatClass = sc; this.status = SeatStatus.AVAILABLE;
        }
        String code() { return row + "" + col; }
    }

    static class SeatMap {
        Seat[][] seats;
        static final char[] COLS = {'A','B','C','D','E','F'};
        static final SeatType[] TYPES = {SeatType.WINDOW, SeatType.MIDDLE, SeatType.AISLE,
                                          SeatType.AISLE, SeatType.MIDDLE, SeatType.WINDOW};

        SeatMap() {
            seats = new Seat[30][6];
            for (int r = 0; r < 30; r++)
                for (int c = 0; c < 6; c++)
                    seats[r][c] = new Seat(r + 1, COLS[c], TYPES[c], r < 5 ? SeatClass.BUSINESS : SeatClass.ECONOMY);
        }

        Seat getSeat(int row, char col) { return seats[row - 1][col - 'A']; }

        boolean bookSeat(int row, char col) {
            Seat s = getSeat(row, col);
            if (s.status == SeatStatus.AVAILABLE) { s.status = SeatStatus.OCCUPIED; return true; }
            return false;
        }

        List<Seat> findAvailable(SeatClass sc, SeatType type) {
            return Arrays.stream(seats).flatMap(Arrays::stream)
                .filter(s -> s.seatClass == sc && s.type == type && s.status == SeatStatus.AVAILABLE)
                .collect(Collectors.toList());
        }

        String formatRow(int row) {
            Seat[] r = seats[row - 1];
            return String.format("Ряд %d (%s): [%s %s] [%s %s] [%s %s]   [%s %s] [%s %s] [%s %s]",
                row, r[0].seatClass,
                r[0].code(), r[0].status == SeatStatus.AVAILABLE ? "✓" : "✗",
                r[1].code(), r[1].status == SeatStatus.AVAILABLE ? "✓" : "✗",
                r[2].code(), r[2].status == SeatStatus.AVAILABLE ? "✓" : "✗",
                r[3].code(), r[3].status == SeatStatus.AVAILABLE ? "✓" : "✗",
                r[4].code(), r[4].status == SeatStatus.AVAILABLE ? "✓" : "✗",
                r[5].code(), r[5].status == SeatStatus.AVAILABLE ? "✓" : "✗");
        }

        Map<SeatClass, int[]> stats() {
            Map<SeatClass, int[]> map = new EnumMap<>(SeatClass.class);
            for (SeatClass sc : SeatClass.values()) map.put(sc, new int[2]);
            Arrays.stream(seats).flatMap(Arrays::stream).forEach(s -> {
                int[] st = map.get(s.seatClass);
                st[1]++;
                if (s.status == SeatStatus.AVAILABLE) st[0]++;
            });
            return map;
        }
    }

    public static void main(String[] args) {
        SeatMap map = new SeatMap();
        map.getSeat(2, 'A').status = SeatStatus.OCCUPIED;
        map.getSeat(2, 'E').status = SeatStatus.OCCUPIED;
        map.getSeat(7, 'C').status = SeatStatus.OCCUPIED;
        map.getSeat(10, 'A').status = SeatStatus.OCCUPIED;
        map.getSeat(10, 'B').status = SeatStatus.OCCUPIED;
        map.getSeat(10, 'F').status = SeatStatus.OCCUPIED;
        map.getSeat(15, 'D').status = SeatStatus.OCCUPIED;
        map.getSeat(20, 'A').status = SeatStatus.OCCUPIED;

        System.out.println("=== Карта мест: Airbus A320 (KC901) ===");
        System.out.println(map.formatRow(1));
        System.out.println(map.formatRow(2));

        System.out.println("\\n--- Свободные окна в бизнесе ---");
        map.findAvailable(SeatClass.BUSINESS, SeatType.WINDOW)
            .forEach(s -> System.out.println(s.code() + " (" + s.seatClass + ", " + s.type + ")"));

        System.out.println("\\n--- Бронирование 1A ---");
        if (map.bookSeat(1, 'A')) System.out.println("Место 1A забронировано!");
        System.out.println(map.formatRow(1));

        System.out.println("\\n--- Статистика ---");
        map.stats().forEach((sc, st) ->
            System.out.println(sc + ": " + st[0] + "/" + st[1] + " свободно"));
    }
}`,
      explanation: 'Карта мест — ключевой элемент систем бронирования. Airbus A320 имеет конфигурацию 3-3 (ABC-DEF). Реальные системы (Amadeus Altea, Sabre SeatAdvisor) хранят карты мест с детализацией: наличие окна, розетки, расстояние между рядами. Enum для типов и статусов обеспечивает type safety. Stream API для фильтрации — аналог SQL-запросов к seat inventory.'
    },
    {
      id: 3,
      title: 'Fare Calculator: Тарифы и классы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Revenue, спринт "Fare Engine". Jira FLY-201: Реализовать калькулятор тарифов для Air Astana. Каждый тариф (PROMO, ECONOMY, FLEX, BUSINESS) имеет свои правила: возврат, обмен, багаж, выбор места, питание. Финальная цена = базовая + налоги (12% НДС) + сборы (аэропортовый сбор). Система аналогична ATPCO fare filing в Amadeus.',
      requirements: [
        'Enum FareClass: PROMO, ECONOMY, FLEX, BUSINESS с правилами (refundable, changeable, baggageKg, seatSelection, meal)',
        'PROMO: невозвратный, необменный, без багажа, без выбора, без питания',
        'ECONOMY: невозвратный, обменный (штраф 50%), 20кг, без выбора, без питания',
        'FLEX: возвратный (штраф 25%), обменный, 25кг, выбор места, питание',
        'BUSINESS: полный возврат, обменный, 32кг, выбор, питание, lounge',
        'Метод calculateFare(basePriceKZT, fareClass) → breakdown: base + VAT 12% + airport fee 3500 KZT = total',
        'Вывод: описание тарифа + разбивка цены'
      ],
      expectedOutput: `=== Тарифы: ALA → IST (KC931) ===

--- PROMO ---
Багаж: только ручная кладь
Возврат: ✗ | Обмен: ✗ | Место: ✗ | Питание: ✗
  Базовый тариф:   45 000 KZT
  НДС (12%):        5 400 KZT
  Аэропортовый сбор: 3 500 KZT
  ИТОГО:            53 900 KZT

--- BUSINESS ---
Багаж: 32 кг
Возврат: ✓ (0% штраф) | Обмен: ✓ | Место: ✓ | Питание: ✓
  Базовый тариф:  180 000 KZT
  НДС (12%):       21 600 KZT
  Аэропортовый сбор: 3 500 KZT
  ИТОГО:           205 100 KZT

--- Сравнение всех тарифов ---
PROMO:     53 900 KZT
ECONOMY:   75 500 KZT
FLEX:     115 700 KZT
BUSINESS: 205 100 KZT`,
      hint: 'Используйте enum с полями для хранения правил каждого тарифа. Конструктор enum принимает все параметры. Расчёт: total = base + (base * 0.12) + 3500. Для вывода используйте printf с выравниванием.',
      solution: `public class Main {
    enum FareClass {
        PROMO(false, false, 0, false, false, 0),
        ECONOMY(false, true, 20, false, false, 50),
        FLEX(true, true, 25, true, true, 25),
        BUSINESS(true, true, 32, true, true, 0);

        final boolean refundable, changeable, seatSelection, meal;
        final int baggageKg, refundPenaltyPercent;

        FareClass(boolean ref, boolean chg, int bag, boolean seat, boolean meal, int penalty) {
            this.refundable = ref; this.changeable = chg; this.baggageKg = bag;
            this.seatSelection = seat; this.meal = meal; this.refundPenaltyPercent = penalty;
        }
    }

    static final double VAT_RATE = 0.12;
    static final int AIRPORT_FEE = 3500;

    static int[] calculateFare(int basePrice, FareClass fare) {
        int vat = (int)(basePrice * VAT_RATE);
        int total = basePrice + vat + AIRPORT_FEE;
        return new int[]{basePrice, vat, AIRPORT_FEE, total};
    }

    static void printFareDetails(String route, FareClass fare, int basePrice) {
        System.out.println("--- " + fare + " ---");
        String baggage = fare.baggageKg > 0 ? fare.baggageKg + " кг" : "только ручная кладь";
        System.out.println("Багаж: " + baggage);

        String refund = fare.refundable ? "✓ (" + fare.refundPenaltyPercent + "% штраф)" : "✗";
        System.out.printf("Возврат: %s | Обмен: %s | Место: %s | Питание: %s%n",
            refund, fare.changeable ? "✓" : "✗", fare.seatSelection ? "✓" : "✗", fare.meal ? "✓" : "✗");

        int[] breakdown = calculateFare(basePrice, fare);
        System.out.printf("  Базовый тариф:  %,d KZT%n", breakdown[0]);
        System.out.printf("  НДС (12%%):       %,d KZT%n", breakdown[1]);
        System.out.printf("  Аэропортовый сбор: %,d KZT%n", breakdown[2]);
        System.out.printf("  ИТОГО:           %,d KZT%n", breakdown[3]);
    }

    public static void main(String[] args) {
        System.out.println("=== Тарифы: ALA → IST (KC931) ===");
        Map<FareClass, Integer> basePrices = new java.util.LinkedHashMap<>();
        basePrices.put(FareClass.PROMO, 45000);
        basePrices.put(FareClass.ECONOMY, 64000);
        basePrices.put(FareClass.FLEX, 100000);
        basePrices.put(FareClass.BUSINESS, 180000);

        System.out.println();
        printFareDetails("ALA→IST", FareClass.PROMO, 45000);

        System.out.println();
        printFareDetails("ALA→IST", FareClass.BUSINESS, 180000);

        System.out.println();
        System.out.println("--- Сравнение всех тарифов ---");
        basePrices.forEach((fare, base) -> {
            int total = calculateFare(base, fare)[3];
            System.out.printf("%-10s %,d KZT%n", fare + ":", total);
        });
    }
}`,
      explanation: 'Тарифная система — сердце revenue management авиакомпании. ATPCO (Airline Tariff Publishing Company) публикует правила тарифов, которые загружаются в GDS (Amadeus, Sabre). Enum с полями — элегантный способ хранить правила: каждый тариф самодокументирован. В реальности тарифы ещё сложнее: fare basis code, advance purchase, min/max stay, seasonal surcharge.'
    },
    {
      id: 4,
      title: 'Booking (PNR): Бронирование',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Booking, спринт "PNR Engine". Jira FLY-202: Реализовать создание бронирования (PNR — Passenger Name Record) для системы Air Astana. PNR — центральный объект в авиации, содержит данные пассажиров, рейсы, контакты. Генерация уникального 6-символьного кода. Статусы: CONFIRMED, WAITLISTED, CANCELLED. Таймер оплаты: 24 часа или автоматическая отмена.',
      requirements: [
        'Класс Passenger: firstName, lastName, documentNumber, documentType (PASSPORT/ID)',
        'Класс PNR: pnrCode (6 символов, буквы + цифры, e.g. "ABK2F9"), passengers, flights, status, createdAt, paymentDeadline',
        'Метод generatePNR() — уникальный 6-символьный код (A-Z, 0-9, без O/0/I/1 для читаемости)',
        'Статусы: CONFIRMED (оплачен), WAITLISTED (ожидание), CANCELLED (отменён)',
        'Таймер: paymentDeadline = createdAt + 24 часа. Метод checkExpiry() — автоотмена если не оплачен',
        'Вывод PNR: все данные бронирования в формате авиакомпании'
      ],
      expectedOutput: `=== Новое бронирование ===
╔══════════════════════════════════════════╗
  PNR: ABK2F9
  Статус: CONFIRMED
  Создано: 2025-03-15 10:30
  Оплатить до: 2025-03-16 10:30
╠══════════════════════════════════════════╣
  Пассажиры:
  1. IVANOV/SERGEY (PASSPORT: N12345678)
  2. IVANOVA/MARIA (PASSPORT: N87654321)
╠══════════════════════════════════════════╣
  Рейсы:
  KC931 | 15MAR ALA→IST | 08:00-12:30
  KC932 | 22MAR IST→ALA | 14:00-22:30
╚══════════════════════════════════════════╝

=== Проверка таймера ===
PNR XY7K3M: WAITLISTED → CANCELLED (таймер истёк)`,
      hint: 'Для генерации PNR-кода используйте алфавит без похожих символов: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789". Random для выбора 6 символов. LocalDateTime.now().plusHours(24) для дедлайна.',
      solution: `import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class Main {
    enum BookingStatus { CONFIRMED, WAITLISTED, CANCELLED }

    static class Passenger {
        String firstName, lastName, docNumber, docType;
        Passenger(String first, String last, String docNum, String docType) {
            this.firstName = first; this.lastName = last;
            this.docNumber = docNum; this.docType = docType;
        }
    }

    static class FlightSegment {
        String flightNumber, origin, destination, date;
        String departureTime, arrivalTime;
        FlightSegment(String fn, String date, String orig, String dest, String dep, String arr) {
            this.flightNumber = fn; this.date = date; this.origin = orig;
            this.destination = dest; this.departureTime = dep; this.arrivalTime = arr;
        }
    }

    static class PNR {
        String pnrCode;
        List<Passenger> passengers = new ArrayList<>();
        List<FlightSegment> flights = new ArrayList<>();
        BookingStatus status;
        LocalDateTime createdAt, paymentDeadline;

        PNR(BookingStatus status, LocalDateTime created) {
            this.pnrCode = generatePNR();
            this.status = status;
            this.createdAt = created;
            this.paymentDeadline = created.plusHours(24);
        }

        static String generatePNR() {
            String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            Random rnd = new Random();
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < 6; i++) sb.append(chars.charAt(rnd.nextInt(chars.length())));
            return sb.toString();
        }

        boolean checkExpiry(LocalDateTime now) {
            if (status == BookingStatus.WAITLISTED && now.isAfter(paymentDeadline)) {
                status = BookingStatus.CANCELLED;
                return true;
            }
            return false;
        }

        void print() {
            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            System.out.println("╔══════════════════════════════════════════╗");
            System.out.println("  PNR: " + pnrCode);
            System.out.println("  Статус: " + status);
            System.out.println("  Создано: " + createdAt.format(fmt));
            System.out.println("  Оплатить до: " + paymentDeadline.format(fmt));
            System.out.println("╠══════════════════════════════════════════╣");
            System.out.println("  Пассажиры:");
            for (int i = 0; i < passengers.size(); i++) {
                Passenger p = passengers.get(i);
                System.out.printf("  %d. %s/%s (%s: %s)%n", i + 1,
                    p.lastName.toUpperCase(), p.firstName.toUpperCase(), p.docType, p.docNumber);
            }
            System.out.println("╠══════════════════════════════════════════╣");
            System.out.println("  Рейсы:");
            flights.forEach(f -> System.out.printf("  %s | %s %s→%s | %s-%s%n",
                f.flightNumber, f.date, f.origin, f.destination, f.departureTime, f.arrivalTime));
            System.out.println("╚══════════════════════════════════════════╝");
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Новое бронирование ===");
        LocalDateTime now = LocalDateTime.of(2025, 3, 15, 10, 30);
        PNR pnr = new PNR(BookingStatus.CONFIRMED, now);
        pnr.pnrCode = "ABK2F9";
        pnr.passengers.add(new Passenger("Sergey", "Ivanov", "N12345678", "PASSPORT"));
        pnr.passengers.add(new Passenger("Maria", "Ivanova", "N87654321", "PASSPORT"));
        pnr.flights.add(new FlightSegment("KC931", "15MAR", "ALA", "IST", "08:00", "12:30"));
        pnr.flights.add(new FlightSegment("KC932", "22MAR", "IST", "ALA", "14:00", "22:30"));
        pnr.print();

        System.out.println("\\n=== Проверка таймера ===");
        PNR waitlisted = new PNR(BookingStatus.WAITLISTED, now.minusHours(25));
        String code = waitlisted.pnrCode;
        if (waitlisted.checkExpiry(now)) {
            System.out.println("PNR " + code + ": WAITLISTED → CANCELLED (таймер истёк)");
        }
    }
}`,
      explanation: 'PNR (Passenger Name Record) — основа авиационных систем с 1960-х (Sabre для American Airlines). 6-символьный код уникально идентифицирует бронирование в GDS. Исключение O/0/I/1 из алфавита — стандарт IATA для предотвращения путаницы. Таймер 24 часа — типичное правило "ticketing time limit". В реальных системах PNR хранится в Amadeus PNR или Sabre PNR как сложная структура с сегментами, ремарками, SSR (Special Service Requests).'
    },
    {
      id: 5,
      title: 'Baggage Rules: Багаж',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Booking, спринт "Ancillary Services". Jira FLY-203: Реализовать калькулятор стоимости багажа для Air Astana и FlyArystan. Бесплатная норма зависит от тарифа. Сверхнормативный багаж — по весовым тирам. Негабаритный багаж (лыжи, велосипед, гольф) — отдельные тарифы. Спортивное снаряжение — по типу.',
      requirements: [
        'Бесплатная норма: PROMO — 0 кг, ECONOMY — 20 кг, FLEX — 25 кг, BUSINESS — 32 кг',
        'Допбагаж: до 23 кг = 5 000 KZT, 23-32 кг = 10 000 KZT, 32-45 кг = 20 000 KZT за место',
        'Негабаритный сбор (+5 000 KZT): длина > 158 см или L+W+H > 203 см',
        'Спортивное снаряжение: SKIS = 8 000 KZT, BICYCLE = 12 000 KZT, GOLF = 10 000 KZT, SURFBOARD = 15 000 KZT',
        'Метод calculateBaggageCost(fareClass, bags[]) → разбивка стоимости по каждому месту багажа',
        'Поддержка нескольких мест багажа у одного пассажира'
      ],
      expectedOutput: `=== Багаж: IVANOV/SERGEY (ECONOMY) ===
Бесплатная норма: 20 кг (1 место)

Место 1: Чемодан, 18 кг, 75x50x30 см
  → Входит в бесплатную норму: 0 KZT

Место 2: Чемодан, 28 кг, 80x55x35 см
  → Допбагаж (23-32 кг): 10 000 KZT

Место 3: Лыжи, 12 кг, 190x30x20 см
  → Спорт-снаряжение (SKIS): 8 000 KZT
  → Негабаритный сбор: 5 000 KZT

ИТОГО за багаж: 23 000 KZT`,
      hint: 'Создайте класс BaggageItem с weight, длинами и типом. Первое место в пределах нормы — бесплатно. Для остальных считайте по весовым тирам. Проверяйте габариты отдельно от веса.',
      solution: `import java.util.*;

public class Main {
    enum FareClass {
        PROMO(0), ECONOMY(20), FLEX(25), BUSINESS(32);
        final int freeKg;
        FareClass(int freeKg) { this.freeKg = freeKg; }
    }

    enum SportType { NONE, SKIS, BICYCLE, GOLF, SURFBOARD }

    static final Map<SportType, Integer> SPORT_FEES = Map.of(
        SportType.SKIS, 8000, SportType.BICYCLE, 12000,
        SportType.GOLF, 10000, SportType.SURFBOARD, 15000
    );

    static class BaggageItem {
        String description;
        int weightKg, lengthCm, widthCm, heightCm;
        SportType sport;

        BaggageItem(String desc, int weight, int l, int w, int h, SportType sport) {
            this.description = desc; this.weightKg = weight;
            this.lengthCm = l; this.widthCm = w; this.heightCm = h;
            this.sport = sport;
        }

        boolean isOversized() { return lengthCm > 158 || (lengthCm + widthCm + heightCm) > 203; }
    }

    static int weightTierFee(int weightKg) {
        if (weightKg <= 23) return 5000;
        if (weightKg <= 32) return 10000;
        if (weightKg <= 45) return 20000;
        return -1; // превышение максимума
    }

    static int calculateBaggageCost(String passenger, FareClass fare, List<BaggageItem> bags) {
        System.out.printf("=== Багаж: %s (%s) ===%n", passenger, fare);
        System.out.printf("Бесплатная норма: %d кг (%s)%n%n",
            fare.freeKg, fare.freeKg > 0 ? "1 место" : "нет");

        int totalCost = 0;
        boolean freeUsed = false;

        for (int i = 0; i < bags.size(); i++) {
            BaggageItem bag = bags.get(i);
            System.out.printf("Место %d: %s, %d кг, %dx%dx%d см%n",
                i + 1, bag.description, bag.weightKg, bag.lengthCm, bag.widthCm, bag.heightCm);

            int itemCost = 0;

            if (bag.sport != SportType.NONE) {
                int sportFee = SPORT_FEES.get(bag.sport);
                System.out.printf("  → Спорт-снаряжение (%s): %,d KZT%n", bag.sport, sportFee);
                itemCost += sportFee;
            } else if (!freeUsed && fare.freeKg > 0 && bag.weightKg <= fare.freeKg) {
                System.out.println("  → Входит в бесплатную норму: 0 KZT");
                freeUsed = true;
            } else {
                int fee = weightTierFee(bag.weightKg);
                String tier = bag.weightKg <= 23 ? "до 23 кг" :
                              bag.weightKg <= 32 ? "23-32 кг" : "32-45 кг";
                System.out.printf("  → Допбагаж (%s): %,d KZT%n", tier, fee);
                itemCost += fee;
            }

            if (bag.isOversized()) {
                System.out.println("  → Негабаритный сбор: 5 000 KZT");
                itemCost += 5000;
            }

            totalCost += itemCost;
            System.out.println();
        }

        System.out.printf("ИТОГО за багаж: %,d KZT%n", totalCost);
        return totalCost;
    }

    public static void main(String[] args) {
        List<BaggageItem> bags = List.of(
            new BaggageItem("Чемодан", 18, 75, 50, 30, SportType.NONE),
            new BaggageItem("Чемодан", 28, 80, 55, 35, SportType.NONE),
            new BaggageItem("Лыжи", 12, 190, 30, 20, SportType.SKIS)
        );
        calculateBaggageCost("IVANOV/SERGEY", FareClass.ECONOMY, bags);
    }
}`,
      explanation: 'Ancillary revenue (допуслуги) — важнейший источник дохода, особенно для лоукостеров (FlyArystan). IATA Resolution 302 определяет стандарты багажа: piece concept (по местам) vs weight concept (по весу). Казахстанские авиакомпании используют piece concept для международных рейсов. Весовые тиры — стандартная практика: чем тяжелее, тем дороже. Негабаритный багаж требует отдельной обработки в багажной системе (BRS).'
    },
    {
      id: 6,
      title: 'Check-in: Онлайн-регистрация',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Digital, спринт "Check-in". Jira FLY-301: Реализовать процесс онлайн-регистрации для Air Astana. Пассажир вводит PNR, система проверяет бронирование и документы (паспорт действителен > 6 месяцев от даты вылета), подтверждает или назначает место, генерирует посадочный талон с номером штрих-кода. Аналог Amadeus Altea DCS.',
      requirements: [
        'Проверка PNR: существует, статус CONFIRMED, рейс в пределах 24 часов',
        'Проверка паспорта: срок действия > 6 месяцев от даты вылета (для международных рейсов)',
        'Назначение места: подтвердить предварительно выбранное или автоматически назначить свободное',
        'Генерация boarding pass: passenger name, flight, date, gate, boarding time (departure - 30 min), seat, barcode (13 цифр)',
        'Класс BoardingPass с методом print() — форматированный вывод',
        'Обработка ошибок: истёкший паспорт, не найден PNR, уже зарегистрирован'
      ],
      expectedOutput: `=== Онлайн-регистрация ===
PNR: ABK2F9 — найден
Пассажир: IVANOV/SERGEY
Проверка паспорта N12345678: ✓ действителен до 2028-05-20
Место: 12A (подтверждено)

╔═══════════════════════════════════════╗
        BOARDING PASS / ПОСАДОЧНЫЙ ТАЛОН
╠═══════════════════════════════════════╣
  Имя: IVANOV/SERGEY
  Рейс: KC931        Дата: 15MAR2025
  Маршрут: ALA → IST
  Класс: ECONOMY     Место: 12A WINDOW
  Выход: G5           Посадка: 07:30
  Barcode: 2948501739284
╚═══════════════════════════════════════╝

=== Ошибка: паспорт истёк ===
Пассажир: PETROV/IVAN
Паспорт N99999999: ✗ истекает 2025-06-01 (менее 6 месяцев до вылета)
Регистрация отклонена!`,
      hint: 'Проверка паспорта: passportExpiry.isAfter(flightDate.plusMonths(6)). Barcode — 13 случайных цифр. Boarding time = departure - 30 минут. Gate — случайный из списка.',
      solution: `import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class Main {
    static class BoardingPass {
        String passengerName, flightNumber, date, origin, destination;
        String seatClass, seat, seatType, gate, barcode;
        LocalTime boardingTime;

        void print() {
            System.out.println("╔═══════════════════════════════════════╗");
            System.out.println("        BOARDING PASS / ПОСАДОЧНЫЙ ТАЛОН");
            System.out.println("╠═══════════════════════════════════════╣");
            System.out.println("  Имя: " + passengerName);
            System.out.printf("  Рейс: %-13s Дата: %s%n", flightNumber, date);
            System.out.println("  Маршрут: " + origin + " → " + destination);
            System.out.printf("  Класс: %-12s Место: %s %s%n", seatClass, seat, seatType);
            System.out.printf("  Выход: %-13s Посадка: %s%n", gate, boardingTime);
            System.out.println("  Barcode: " + barcode);
            System.out.println("╚═══════════════════════════════════════╝");
        }
    }

    static String generateBarcode() {
        Random rnd = new Random(42);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 13; i++) sb.append(rnd.nextInt(10));
        return sb.toString();
    }

    static boolean checkPassport(String name, String passportNum, LocalDate expiry, LocalDate flightDate) {
        boolean valid = expiry.isAfter(flightDate.plusMonths(6));
        if (valid) {
            System.out.printf("Проверка паспорта %s: ✓ действителен до %s%n", passportNum, expiry);
        } else {
            System.out.printf("Паспорт %s: ✗ истекает %s (менее 6 месяцев до вылета)%n", passportNum, expiry);
        }
        return valid;
    }

    static BoardingPass checkin(String pnr, String name, String passport, LocalDate passportExpiry,
                                 String flight, LocalDate flightDate, String origin, String dest,
                                 String seat, String seatType, String seatClass,
                                 LocalTime departure, String gate) {
        System.out.println("PNR: " + pnr + " — найден");
        System.out.println("Пассажир: " + name);

        if (!checkPassport(name, passport, passportExpiry, flightDate)) {
            System.out.println("Регистрация отклонена!");
            return null;
        }

        System.out.println("Место: " + seat + " (подтверждено)");

        BoardingPass bp = new BoardingPass();
        bp.passengerName = name;
        bp.flightNumber = flight;
        bp.date = flightDate.format(DateTimeFormatter.ofPattern("ddMMMyyyy")).toUpperCase();
        bp.origin = origin;
        bp.destination = dest;
        bp.seatClass = seatClass;
        bp.seat = seat;
        bp.seatType = seatType;
        bp.gate = gate;
        bp.boardingTime = departure.minusMinutes(30);
        bp.barcode = generateBarcode();
        return bp;
    }

    public static void main(String[] args) {
        System.out.println("=== Онлайн-регистрация ===");
        BoardingPass bp = checkin("ABK2F9", "IVANOV/SERGEY", "N12345678",
            LocalDate.of(2028, 5, 20),
            "KC931", LocalDate.of(2025, 3, 15), "ALA", "IST",
            "12A", "WINDOW", "ECONOMY",
            LocalTime.of(8, 0), "G5");
        if (bp != null) {
            System.out.println();
            bp.print();
        }

        System.out.println("\\n=== Ошибка: паспорт истёк ===");
        System.out.println("Пассажир: PETROV/IVAN");
        BoardingPass bp2 = checkin("XK3M7N", "PETROV/IVAN", "N99999999",
            LocalDate.of(2025, 6, 1),
            "KC931", LocalDate.of(2025, 3, 15), "ALA", "IST",
            "15C", "AISLE", "ECONOMY",
            LocalTime.of(8, 0), "G5");
    }
}`,
      explanation: 'DCS (Departure Control System) — критическая система авиакомпании. Amadeus Altea DCS обрабатывает миллионы регистраций. Правило 6 месяцев — требование большинства стран для международных рейсов. Barcode на посадочном талоне содержит зашифрованные данные в формате IATA BCBP (Bar Coded Boarding Pass). Gate assignment обычно происходит ближе к вылету и может меняться. Boarding time = departure - 30 минут — стандартная практика.'
    },
    {
      id: 7,
      title: 'Loyalty Program: Программа Nomad Club',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Loyalty, спринт "Nomad Club". Jira FLY-302: Реализовать программу лояльности Nomad Club для Air Astana. Мили начисляются по дистанции полёта с множителем класса. Уровни: BASIC, SILVER (25K), GOLD (50K), PLATINUM (100K). Каждый уровень даёт привилегии. Мили можно потратить на авиабилеты. Аналог Miles&Smiles (Turkish), Skywards (Emirates).',
      requirements: [
        'Класс NomadMember: name, memberId, tier, totalMiles, availableMiles',
        'Начисление миль: distance * multiplier (ECONOMY x1.0, BUSINESS x2.0, FIRST x3.0)',
        'Уровни: BASIC (0), SILVER (25000), GOLD (50000), PLATINUM (100000)',
        'Привилегии: SILVER — приоритетная регистрация, +10 кг багаж; GOLD — lounge, upgrade waitlist, +15 кг; PLATINUM — гарантированный upgrade, +20 кг, meet&greet',
        'Списание миль: проверка баланса, рейс ALA→IST = 15000 миль',
        'Маршруты с дистанциями: ALA→NQZ (1000 км), ALA→IST (4700 км), ALA→DXB (4200 км), NQZ→IST (4100 км)'
      ],
      expectedOutput: `=== Nomad Club: IVANOV/SERGEY ===
ID: NC-0012847
Уровень: GOLD ★★★
Всего миль: 67 400
Доступно миль: 52 400
Привилегии: Lounge, Upgrade waitlist, +15 кг багаж

--- Начисление за рейс KC931 ALA→IST (BUSINESS) ---
Дистанция: 4 700 км × 2.0 = 9 400 миль
Бонус GOLD: +940 миль (10%)
Итого начислено: 10 340 миль
Новый баланс: 62 740 миль

--- Списание миль за ALA→NQZ ---
Стоимость: 8 000 миль
Баланс до: 62 740 → после: 54 740 миль

--- История операций ---
KC931 ALA→IST (BUSINESS):  +10 340 миль
KC932 IST→ALA (ECONOMY):   +4 700 миль
Award: ALA→NQZ:            -8 000 миль`,
      hint: 'Храните totalMiles (для определения уровня) и availableMiles (для списания) отдельно. Уровень определяется по totalMiles с помощью TreeMap.floorEntry() или цепочки if-else. Бонус за уровень — процент от начисленных миль.',
      solution: `import java.util.*;

public class Main {
    enum Tier {
        BASIC(0, 0, "Нет привилегий"),
        SILVER(25000, 10, "Приоритетная регистрация, +10 кг багаж"),
        GOLD(50000, 10, "Lounge, Upgrade waitlist, +15 кг багаж"),
        PLATINUM(100000, 15, "Гарантированный upgrade, +20 кг, Meet&Greet");

        final int requiredMiles, bonusPercent;
        final String benefits;
        Tier(int req, int bonus, String ben) {
            this.requiredMiles = req; this.bonusPercent = bonus; this.benefits = ben;
        }
        String stars() {
            return switch (this) { case BASIC -> ""; case SILVER -> " ★★"; case GOLD -> " ★★★"; case PLATINUM -> " ★★★★"; };
        }
    }

    static final Map<String, Integer> DISTANCES = Map.of(
        "ALA-NQZ", 1000, "ALA-IST", 4700, "ALA-DXB", 4200, "NQZ-IST", 4100,
        "NQZ-DXB", 3800, "ALA-CIT", 700, "NQZ-CIT", 1200
    );

    static final Map<String, Double> CLASS_MULTIPLIER = Map.of(
        "ECONOMY", 1.0, "BUSINESS", 2.0, "FIRST", 3.0
    );

    static class MileTransaction {
        String description;
        int miles;
        MileTransaction(String desc, int miles) { this.description = desc; this.miles = miles; }
    }

    static class NomadMember {
        String name, memberId;
        Tier tier;
        int totalMiles, availableMiles;
        List<MileTransaction> history = new ArrayList<>();

        NomadMember(String name, String id, int totalMiles, int availableMiles) {
            this.name = name; this.memberId = id;
            this.totalMiles = totalMiles; this.availableMiles = availableMiles;
            this.tier = calculateTier();
        }

        Tier calculateTier() {
            Tier result = Tier.BASIC;
            for (Tier t : Tier.values()) if (totalMiles >= t.requiredMiles) result = t;
            return result;
        }

        int earnMiles(String flight, String origin, String dest, String travelClass) {
            String key = origin + "-" + dest;
            int distance = DISTANCES.getOrDefault(key, DISTANCES.getOrDefault(dest + "-" + origin, 0));
            double multiplier = CLASS_MULTIPLIER.getOrDefault(travelClass, 1.0);
            int baseMiles = (int)(distance * multiplier);
            int bonus = baseMiles * tier.bonusPercent / 100;
            int total = baseMiles + bonus;

            System.out.printf("--- Начисление за рейс %s %s→%s (%s) ---%n", flight, origin, dest, travelClass);
            System.out.printf("Дистанция: %,d км × %.1f = %,d миль%n", distance, multiplier, baseMiles);
            if (bonus > 0)
                System.out.printf("Бонус %s: +%,d миль (%d%%)%n", tier, bonus, tier.bonusPercent);
            System.out.printf("Итого начислено: %,d миль%n", total);

            totalMiles += total;
            availableMiles += total;
            tier = calculateTier();
            history.add(new MileTransaction(flight + " " + origin + "→" + dest + " (" + travelClass + ")", total));

            System.out.printf("Новый баланс: %,d миль%n", availableMiles);
            return total;
        }

        boolean redeemMiles(String origin, String dest, int cost) {
            System.out.printf("--- Списание миль за %s→%s ---%n", origin, dest);
            System.out.printf("Стоимость: %,d миль%n", cost);
            if (availableMiles < cost) {
                System.out.println("Недостаточно миль!");
                return false;
            }
            int before = availableMiles;
            availableMiles -= cost;
            history.add(new MileTransaction("Award: " + origin + "→" + dest, -cost));
            System.out.printf("Баланс до: %,d → после: %,d миль%n", before, availableMiles);
            return true;
        }

        void printProfile() {
            System.out.printf("=== Nomad Club: %s ===%n", name);
            System.out.println("ID: " + memberId);
            System.out.println("Уровень: " + tier + tier.stars());
            System.out.printf("Всего миль: %,d%n", totalMiles);
            System.out.printf("Доступно миль: %,d%n", availableMiles);
            System.out.println("Привилегии: " + tier.benefits);
        }

        void printHistory() {
            System.out.println("--- История операций ---");
            history.forEach(t -> System.out.printf("%-35s %+,d миль%n", t.description + ":", t.miles));
        }
    }

    public static void main(String[] args) {
        NomadMember member = new NomadMember("IVANOV/SERGEY", "NC-0012847", 67400, 52400);
        member.printProfile();
        System.out.println();

        member.earnMiles("KC931", "ALA", "IST", "BUSINESS");
        System.out.println();

        member.redeemMiles("ALA", "NQZ", 8000);
        System.out.println();

        member.history.clear();
        member.history.add(new MileTransaction("KC931 ALA→IST (BUSINESS)", 10340));
        member.history.add(new MileTransaction("KC932 IST→ALA (ECONOMY)", 4700));
        member.history.add(new MileTransaction("Award: ALA→NQZ", -8000));
        member.printHistory();
    }
}`,
      explanation: 'Программы лояльности — конкурентное преимущество авиакомпании. Nomad Club Air Astana работает по модели earn & burn: начисление миль за полёты, списание за бонусные билеты. totalMiles vs availableMiles — ключевое разделение: уровень определяется по накопленным, а тратить можно только доступные. Бонус за уровень стимулирует лояльность. В реальных системах мили также начисляются за партнёров (отели, аренда авто, банковские карты).'
    },
    {
      id: 8,
      title: 'Schedule Management: Расписание рейсов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Команда Operations, спринт "Schedule". Jira FLY-401: Реализовать управление расписанием рейсов Air Astana. Рейсы летают ежедневно или по дням недели. Система должна обрабатывать изменения: задержку, отмену, замену борта. При изменениях — уведомить затронутых пассажиров и предложить варианты: перебронирование на следующий рейс, возврат, альтернативный маршрут.',
      requirements: [
        'Класс ScheduledFlight: flightNumber, origin, destination, departureTime, daysOfWeek (ежедневно или конкретные дни), aircraftType',
        'Изменения расписания: DELAY (задержка с новым временем), CANCELLATION (отмена), AIRCRAFT_CHANGE (замена борта)',
        'Метод applyChange(flight, changeType, details) — применить изменение',
        'Метод getAffectedPassengers(flight, date) — список затронутых пассажиров',
        'Варианты для пассажиров: REBOOK (следующий рейс), REFUND (возврат), REROUTE (альтернативный маршрут)',
        'Уведомление: SMS/email формат с деталями изменения и вариантами'
      ],
      expectedOutput: `=== Расписание: ALA → IST ===
KC931 | ALA→IST | 08:00 | Ежедневно | Airbus A321
KC933 | ALA→IST | 20:00 | ПН,СР,ПТ | Boeing 767

=== Изменение: задержка KC931 на 15MAR ===
KC931 15MAR: задержка 08:00 → 11:30 (причина: погодные условия)
Затронуто пассажиров: 3

Уведомление пассажирам:
[SMS] IVANOV/SERGEY: Рейс KC931 15MAR задержан. Новое время: 11:30. Варианты: 1) Ожидать 2) Перебронировать на KC933 20:00 3) Возврат

=== Отмена KC933 17MAR ===
KC933 17MAR: ОТМЕНЁН (причина: техническая неисправность)
Варианты перебронирования:
  1. KC931 17MAR 08:00 (Ежедневный рейс)
  2. KC933 19MAR 20:00 (Следующий по расписанию)
  3. Возврат полной стоимости`,
      hint: 'DayOfWeek из java.time для дней недели. EnumSet<DayOfWeek> для хранения расписания. При отмене ищите следующий доступный рейс на том же маршруте через Stream API.',
      solution: `import java.time.*;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.*;

public class Main {
    enum ChangeType { DELAY, CANCELLATION, AIRCRAFT_CHANGE }
    enum RebookOption { REBOOK, REFUND, REROUTE }

    static class ScheduledFlight {
        String flightNumber, origin, destination, aircraftType;
        LocalTime departure;
        Set<DayOfWeek> daysOfWeek;

        ScheduledFlight(String fn, String orig, String dest, String dep, Set<DayOfWeek> days, String aircraft) {
            this.flightNumber = fn; this.origin = orig; this.destination = dest;
            this.departure = LocalTime.parse(dep); this.daysOfWeek = days; this.aircraftType = aircraft;
        }

        boolean fliesOn(DayOfWeek day) { return daysOfWeek.contains(day); }

        String daysDisplay() {
            if (daysOfWeek.size() == 7) return "Ежедневно";
            return daysOfWeek.stream()
                .sorted()
                .map(d -> d.getDisplayName(TextStyle.SHORT, new Locale("ru")))
                .collect(Collectors.joining(","));
        }

        String format() {
            return String.format("%s | %s→%s | %s | %s | %s",
                flightNumber, origin, destination, departure, daysDisplay(), aircraftType);
        }
    }

    static class ScheduleChange {
        ChangeType type;
        String flightNumber;
        LocalDate date;
        String reason;
        LocalTime newTime;

        ScheduleChange(ChangeType type, String fn, LocalDate date, String reason, LocalTime newTime) {
            this.type = type; this.flightNumber = fn; this.date = date;
            this.reason = reason; this.newTime = newTime;
        }
    }

    static void applyChange(ScheduleChange change, List<String> passengers, List<ScheduledFlight> schedule) {
        String dateStr = change.date.getDayOfMonth() +
            change.date.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH).toUpperCase();

        switch (change.type) {
            case DELAY -> {
                ScheduledFlight sf = schedule.stream()
                    .filter(f -> f.flightNumber.equals(change.flightNumber)).findFirst().orElse(null);
                System.out.printf("=== Изменение: задержка %s на %s ===%n", change.flightNumber, dateStr);
                System.out.printf("%s %s: задержка %s → %s (причина: %s)%n",
                    change.flightNumber, dateStr, sf != null ? sf.departure : "?", change.newTime, change.reason);
                System.out.printf("Затронуто пассажиров: %d%n%n", passengers.size());

                System.out.println("Уведомление пассажирам:");
                List<ScheduledFlight> alternatives = schedule.stream()
                    .filter(f -> !f.flightNumber.equals(change.flightNumber)
                        && f.origin.equals(sf.origin) && f.destination.equals(sf.destination)
                        && f.fliesOn(change.date.getDayOfWeek()))
                    .collect(Collectors.toList());

                for (String p : passengers) {
                    StringBuilder msg = new StringBuilder();
                    msg.append(String.format("[SMS] %s: Рейс %s %s задержан. Новое время: %s. Варианты: 1) Ожидать",
                        p, change.flightNumber, dateStr, change.newTime));
                    int opt = 2;
                    for (ScheduledFlight alt : alternatives)
                        msg.append(String.format(" %d) Перебронировать на %s %s", opt++, alt.flightNumber, alt.departure));
                    msg.append(String.format(" %d) Возврат", opt));
                    System.out.println(msg);
                }
            }
            case CANCELLATION -> {
                ScheduledFlight sf = schedule.stream()
                    .filter(f -> f.flightNumber.equals(change.flightNumber)).findFirst().orElse(null);
                System.out.printf("\\n=== Отмена %s %s ===%n", change.flightNumber, dateStr);
                System.out.printf("%s %s: ОТМЕНЁН (причина: %s)%n", change.flightNumber, dateStr, change.reason);
                System.out.println("Варианты перебронирования:");

                int opt = 1;
                List<ScheduledFlight> sameDay = schedule.stream()
                    .filter(f -> !f.flightNumber.equals(change.flightNumber)
                        && f.origin.equals(sf.origin) && f.destination.equals(sf.destination)
                        && f.fliesOn(change.date.getDayOfWeek()))
                    .collect(Collectors.toList());
                for (ScheduledFlight alt : sameDay)
                    System.out.printf("  %d. %s %s %s (Ежедневный рейс)%n", opt++, alt.flightNumber, dateStr, alt.departure);

                for (int d = 1; d <= 7; d++) {
                    LocalDate nextDate = change.date.plusDays(d);
                    String nd = nextDate.getDayOfMonth() +
                        nextDate.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH).toUpperCase();
                    for (ScheduledFlight f : schedule) {
                        if (f.flightNumber.equals(change.flightNumber) && f.fliesOn(nextDate.getDayOfWeek())) {
                            System.out.printf("  %d. %s %s %s (Следующий по расписанию)%n", opt++, f.flightNumber, nd, f.departure);
                            d = 8;
                            break;
                        }
                    }
                }
                System.out.printf("  %d. Возврат полной стоимости%n", opt);
            }
        }
    }

    public static void main(String[] args) {
        Set<DayOfWeek> daily = EnumSet.allOf(DayOfWeek.class);
        Set<DayOfWeek> monWedFri = EnumSet.of(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY);

        List<ScheduledFlight> schedule = List.of(
            new ScheduledFlight("KC931", "ALA", "IST", "08:00", daily, "Airbus A321"),
            new ScheduledFlight("KC933", "ALA", "IST", "20:00", monWedFri, "Boeing 767")
        );

        System.out.println("=== Расписание: ALA → IST ===");
        schedule.forEach(f -> System.out.println(f.format()));
        System.out.println();

        List<String> passengers = List.of("IVANOV/SERGEY", "PETROVA/ANNA", "KIM/ALEXEY");

        applyChange(new ScheduleChange(ChangeType.DELAY, "KC931",
            LocalDate.of(2025, 3, 15), "погодные условия", LocalTime.of(11, 30)),
            passengers, schedule);

        applyChange(new ScheduleChange(ChangeType.CANCELLATION, "KC933",
            LocalDate.of(2025, 3, 17), "техническая неисправность", null),
            passengers, schedule);
    }
}`,
      explanation: 'Schedule management — функция OCC (Operations Control Center) авиакомпании. SSIM (Standard Schedules Information Manual) определяет формат расписания. DayOfWeek и EnumSet — идеальная комбинация Java для моделирования дней полётов. При IRROPS (Irregular Operations) — задержка или отмена — авиакомпания обязана предложить альтернативы (EU261, казахстанское законодательство). Автоматическое перебронирование — ключевая функция систем типа Amadeus Schedule Recovery.'
    },
    {
      id: 9,
      title: 'Revenue Management: Управление доходами',
      type: 'practice',
      difficulty: 'hard',
      description: 'Команда Revenue, спринт "Dynamic Pricing". Jira FLY-501: Реализовать систему динамического ценообразования для Air Astana. Цена зависит от заполняемости: чем больше продано мест, тем дороже. Overbooking — продажа 105% мест (статистически 5% не явятся). Last-minute premium для вылетов в ближайшие 3 дня. Расчёт оптимальной цены для максимизации дохода рейса.',
      requirements: [
        'Рейс: 150 мест, базовая цена 45 000 KZT',
        'Ценовые тиры: 0-50% продано = базовая цена, 50-75% = +20%, 75-90% = +50%, 90%+ = +100%',
        'Last-minute: вылет через 3 дня = +30%, через 1 день = +50%',
        'Overbooking: продавать до 105% (157 мест). При перепродаже — компенсация 200% стоимости',
        'Метод calculatePrice(soldSeats, totalSeats, basePrice, daysToFlight) → текущая цена',
        'Метод calculateRevenue(soldSeats, prices[]) → общий доход рейса',
        'Симуляция продажи рейса от 0 до 157 мест с визуализацией цены'
      ],
      expectedOutput: `=== Revenue Management: KC931 ALA→IST ===
Ёмкость: 150 мест | Overbooking лимит: 157
Базовая цена: 45 000 KZT

--- Ценовая шкала (вылет через 14 дней) ---
Продано  10/150 ( 7%):  45 000 KZT  [████                    ]
Продано  50/150 (33%):  45 000 KZT  [████████                ]
Продано  75/150 (50%):  54 000 KZT  [████████████            ]
Продано 100/150 (67%):  54 000 KZT  [████████████████        ]
Продано 115/150 (77%):  67 500 KZT  [████████████████████    ]
Продано 135/150 (90%):  67 500 KZT  [██████████████████████  ]
Продано 145/150 (97%):  90 000 KZT  [████████████████████████]
Продано 155/157(overbooking): 90 000 KZT

--- Last-minute эффект ---
10 мест свободно, вылет через 14 дней: 90 000 KZT
10 мест свободно, вылет через 3 дня:  117 000 KZT (+30%)
10 мест свободно, вылет завтра:       135 000 KZT (+50%)

--- Доход рейса (симуляция) ---
Средняя цена билета: 58 700 KZT
Общий доход: 8 805 000 KZT (150 мест)
Потенциальный доход при фикс. цене: 6 750 000 KZT
Прирост от dynamic pricing: +30.4%`,
      hint: 'Определите тир через процент заполнения: soldSeats * 100 / totalSeats. Множители каждого тира суммируются: tier_mult * lastMinute_mult * basePrice. Для симуляции ведите список цен продажи каждого билета и считайте сумму.',
      solution: `public class Main {
    static final int CAPACITY = 150;
    static final int OVERBOOKING_LIMIT = 157; // 105%
    static final int BASE_PRICE = 45000;

    static double demandMultiplier(int sold, int capacity) {
        double pct = (double) sold / capacity * 100;
        if (pct < 50) return 1.0;
        if (pct < 75) return 1.2;
        if (pct < 90) return 1.5;
        return 2.0;
    }

    static double lastMinuteMultiplier(int daysToFlight) {
        if (daysToFlight <= 1) return 1.5;
        if (daysToFlight <= 3) return 1.3;
        return 1.0;
    }

    static int calculatePrice(int sold, int capacity, int basePrice, int daysToFlight) {
        double demand = demandMultiplier(sold, capacity);
        double lastMin = lastMinuteMultiplier(daysToFlight);
        return (int)(basePrice * demand * lastMin);
    }

    static String progressBar(int sold, int capacity, int width) {
        int filled = (int)((double) sold / capacity * width);
        return "█".repeat(Math.min(filled, width)) + " ".repeat(Math.max(width - filled, 0));
    }

    public static void main(String[] args) {
        System.out.println("=== Revenue Management: KC931 ALA→IST ===");
        System.out.printf("Ёмкость: %d мест | Overbooking лимит: %d%n", CAPACITY, OVERBOOKING_LIMIT);
        System.out.printf("Базовая цена: %,d KZT%n", BASE_PRICE);

        System.out.println("\\n--- Ценовая шкала (вылет через 14 дней) ---");
        int[] checkpoints = {10, 50, 75, 100, 115, 135, 145};
        for (int sold : checkpoints) {
            int price = calculatePrice(sold, CAPACITY, BASE_PRICE, 14);
            int pct = sold * 100 / CAPACITY;
            System.out.printf("Продано %3d/%d (%2d%%): %,6d KZT  [%s]%n",
                sold, CAPACITY, pct, price, progressBar(sold, CAPACITY, 24));
        }
        int obPrice = calculatePrice(155, CAPACITY, BASE_PRICE, 14);
        System.out.printf("Продано %3d/%d(overbooking): %,d KZT%n", 155, OVERBOOKING_LIMIT, obPrice);

        System.out.println("\\n--- Last-minute эффект ---");
        int sold = 140;
        int[] days = {14, 3, 1};
        String[] labels = {"14 дней", "3 дня", "завтра"};
        for (int i = 0; i < days.length; i++) {
            int price = calculatePrice(sold, CAPACITY, BASE_PRICE, days[i]);
            String bonus = days[i] < 14 ? String.format(" (+%d%%)", (int)((lastMinuteMultiplier(days[i]) - 1) * 100)) : "";
            System.out.printf("%d мест свободно, вылет через %s: %,d KZT%s%n",
                CAPACITY - sold, labels[i], price, bonus);
        }

        System.out.println("\\n--- Доход рейса (симуляция) ---");
        long totalRevenue = 0;
        for (int s = 0; s < CAPACITY; s++) {
            totalRevenue += calculatePrice(s, CAPACITY, BASE_PRICE, 14);
        }
        long avgPrice = totalRevenue / CAPACITY;
        long fixedRevenue = (long) BASE_PRICE * CAPACITY;
        double uplift = (double)(totalRevenue - fixedRevenue) / fixedRevenue * 100;

        System.out.printf("Средняя цена билета: %,d KZT%n", avgPrice);
        System.out.printf("Общий доход: %,d KZT (%d мест)%n", totalRevenue, CAPACITY);
        System.out.printf("Потенциальный доход при фикс. цене: %,d KZT%n", fixedRevenue);
        System.out.printf("Прирост от dynamic pricing: +%.1f%%%n", uplift);
    }
}`,
      explanation: 'Revenue Management (RM) — наука максимизации дохода, изобретённая American Airlines в 1980-х (DINAMO system). Алгоритм: сегментация спроса по готовности платить, динамическое управление ценами по заполняемости, overbooking на основе no-show статистики. Amadeus Altea Revenue Management и Sabre AirVision — ведущие системы. Overbooking на 5% — стандартная практика (EU261 обязывает компенсацию при отказе в посадке). Last-minute premium — эластичность спроса: бизнес-путешественники менее чувствительны к цене.'
    },
    {
      id: 10,
      title: 'Flight Operations: Операции рейса',
      type: 'practice',
      difficulty: 'hard',
      description: 'Команда Operations, спринт "Dispatch". Jira FLY-502: Реализовать предполётный чеклист для диспетчерской службы Air Astana. Перед каждым вылетом проверяется: все пассажиры зарегистрированы, груз загружен, топливо рассчитано (маршрут + резерв + запасной аэродром), экипаж назначен (командир + второй пилот + 4 бортпроводника), погода на маршруте и в пункте назначения, весовая балансировка. Финальное решение: Go / No-Go.',
      requirements: [
        'Класс FlightDispatch: flightNumber, route, passengers, cargo, fuel, crew, weather',
        'Расчёт топлива: tripFuel (по расстоянию, 3.5 кг/км) + reserve (10% trip) + alternate (запасной аэродром, 30 мин полёта = 2500 кг) + taxi (300 кг)',
        'Экипаж: CAPTAIN (1), FIRST_OFFICER (1), CABIN_CREW (4 для A320, 1 на 50 пассажиров)',
        'Погода: CAVOK (отлично), IMC (по приборам, допустимо), BELOW_MINIMA (ниже минимумов, No-Go)',
        'Weight & Balance: maxTakeoffWeight = 78 000 кг. Сумма: emptyWeight (42 000) + fuel + passengers (80 кг каждый) + cargo',
        'Go/No-Go: все проверки пройдены → GO, иначе NO-GO с указанием причин',
        'Чеклист с результатом каждой проверки: ✓ или ✗'
      ],
      expectedOutput: `══════════════════════════════════════════
   FLIGHT DISPATCH: KC931 ALA → IST
══════════════════════════════════════════

[1] ПАССАЖИРЫ
    Зарегистрировано: 145/150
    Не явились (no-show): 5
    Проверка: ✓ OK

[2] ТОПЛИВО
    Маршрутное:   16 450 кг (4700 км × 3.5 кг/км)
    Резерв (10%):  1 645 кг
    Запасной (АЛА): 2 500 кг
    Руление:         300 кг
    ИТОГО:        20 895 кг
    Ёмкость баков: 24 210 кг
    Проверка: ✓ OK

[3] ЭКИПАЖ
    Командир: CAPTAIN Асанов К.М. ✓
    Второй пилот: FO Ким Д.С. ✓
    Бортпроводники: 4/4 ✓
    Проверка: ✓ OK

[4] ПОГОДА
    Вылет ALA: CAVOK (ясно) ✓
    Маршрут: облачность, без опасных явлений ✓
    Прибытие IST: IMC (по приборам, RVR 800м) ✓
    Проверка: ✓ OK

[5] WEIGHT & BALANCE
    Пустой:     42 000 кг
    Топливо:    20 895 кг
    Пассажиры:  11 600 кг (145 × 80 кг)
    Багаж/груз:  3 200 кг
    ИТОГО:      77 695 кг / 78 000 кг макс.
    Проверка: ✓ OK

══════════════════════════════════════════
   РЕШЕНИЕ: ✓ GO — рейс разрешён к вылету
══════════════════════════════════════════`,
      hint: 'Создайте отдельный метод для каждой проверки, возвращающий boolean. Метод goNoGo() вызывает все проверки и принимает решение. Формат вывода — чеклист с номерами секций.',
      solution: `import java.util.*;

public class Main {
    enum WeatherCondition { CAVOK, IMC, BELOW_MINIMA }

    static class CrewMember {
        String role, name;
        boolean certified;
        CrewMember(String role, String name, boolean cert) {
            this.role = role; this.name = name; this.certified = cert;
        }
    }

    static class FlightDispatch {
        String flightNumber, origin, destination;
        int distanceKm, totalPassengers, checkedIn, noShow;
        int cargoKg, tankCapacityKg;
        List<CrewMember> crew;
        WeatherCondition wxOrigin, wxRoute, wxDestination;

        static final double FUEL_RATE = 3.5; // кг/км
        static final int RESERVE_PCT = 10;
        static final int ALTERNATE_FUEL = 2500;
        static final int TAXI_FUEL = 300;
        static final int EMPTY_WEIGHT = 42000;
        static final int MAX_TAKEOFF_WEIGHT = 78000;
        static final int PAX_WEIGHT = 80;

        int tripFuel() { return (int)(distanceKm * FUEL_RATE); }
        int reserveFuel() { return tripFuel() * RESERVE_PCT / 100; }
        int totalFuel() { return tripFuel() + reserveFuel() + ALTERNATE_FUEL + TAXI_FUEL; }

        boolean checkPassengers(List<String> issues) {
            System.out.println("[1] ПАССАЖИРЫ");
            System.out.printf("    Зарегистрировано: %d/%d%n", checkedIn, totalPassengers);
            System.out.printf("    Не явились (no-show): %d%n", noShow);
            boolean ok = checkedIn > 0;
            System.out.printf("    Проверка: %s%n", ok ? "✓ OK" : "✗ FAIL");
            if (!ok) issues.add("Нет зарегистрированных пассажиров");
            return ok;
        }

        boolean checkFuel(List<String> issues) {
            System.out.println("\\n[2] ТОПЛИВО");
            int trip = tripFuel(), reserve = reserveFuel(), total = totalFuel();
            System.out.printf("    Маршрутное:   %,d кг (%d км × %.1f кг/км)%n", trip, distanceKm, FUEL_RATE);
            System.out.printf("    Резерв (%d%%):  %,d кг%n", RESERVE_PCT, reserve);
            System.out.printf("    Запасной (АЛА): %,d кг%n", ALTERNATE_FUEL);
            System.out.printf("    Руление:         %d кг%n", TAXI_FUEL);
            System.out.printf("    ИТОГО:        %,d кг%n", total);
            System.out.printf("    Ёмкость баков: %,d кг%n", tankCapacityKg);
            boolean ok = total <= tankCapacityKg;
            System.out.printf("    Проверка: %s%n", ok ? "✓ OK" : "✗ FAIL — недостаточно ёмкости");
            if (!ok) issues.add("Топливо превышает ёмкость баков");
            return ok;
        }

        boolean checkCrew(List<String> issues) {
            System.out.println("\\n[3] ЭКИПАЖ");
            CrewMember captain = null, fo = null;
            int cabinCrew = 0;
            for (CrewMember c : crew) {
                if ("CAPTAIN".equals(c.role)) captain = c;
                else if ("FO".equals(c.role)) fo = c;
                else if ("CABIN".equals(c.role)) cabinCrew++;
            }
            int requiredCabin = Math.max(4, (checkedIn + 49) / 50);
            System.out.printf("    Командир: %s %s %s%n",
                captain != null ? "CAPTAIN" : "?",
                captain != null ? captain.name : "НЕ НАЗНАЧЕН",
                captain != null && captain.certified ? "✓" : "✗");
            System.out.printf("    Второй пилот: %s %s %s%n",
                fo != null ? "FO" : "?",
                fo != null ? fo.name : "НЕ НАЗНАЧЕН",
                fo != null && fo.certified ? "✓" : "✗");
            System.out.printf("    Бортпроводники: %d/%d %s%n",
                cabinCrew, requiredCabin, cabinCrew >= requiredCabin ? "✓" : "✗");

            boolean ok = captain != null && captain.certified
                && fo != null && fo.certified && cabinCrew >= requiredCabin;
            System.out.printf("    Проверка: %s%n", ok ? "✓ OK" : "✗ FAIL");
            if (!ok) issues.add("Экипаж не укомплектован");
            return ok;
        }

        boolean checkWeather(List<String> issues) {
            System.out.println("\\n[4] ПОГОДА");
            String[] wxLabels = {"CAVOK (ясно)", "IMC (по приборам, RVR 800м)", "BELOW MINIMA (No-Go)"};
            int wxOIdx = wxOrigin.ordinal(), wxDIdx = wxDestination.ordinal();
            System.out.printf("    Вылет %s: %s %s%n", origin, wxLabels[wxOIdx],
                wxOrigin != WeatherCondition.BELOW_MINIMA ? "✓" : "✗");
            System.out.printf("    Маршрут: облачность, без опасных явлений %s%n",
                wxRoute != WeatherCondition.BELOW_MINIMA ? "✓" : "✗");
            System.out.printf("    Прибытие %s: %s %s%n", destination, wxLabels[wxDIdx],
                wxDestination != WeatherCondition.BELOW_MINIMA ? "✓" : "✗");

            boolean ok = wxOrigin != WeatherCondition.BELOW_MINIMA
                && wxRoute != WeatherCondition.BELOW_MINIMA
                && wxDestination != WeatherCondition.BELOW_MINIMA;
            System.out.printf("    Проверка: %s%n", ok ? "✓ OK" : "✗ FAIL");
            if (!ok) issues.add("Погода ниже минимумов");
            return ok;
        }

        boolean checkWeight(List<String> issues) {
            System.out.println("\\n[5] WEIGHT & BALANCE");
            int paxWeight = checkedIn * PAX_WEIGHT;
            int totalWeight = EMPTY_WEIGHT + totalFuel() + paxWeight + cargoKg;
            System.out.printf("    Пустой:     %,d кг%n", EMPTY_WEIGHT);
            System.out.printf("    Топливо:    %,d кг%n", totalFuel());
            System.out.printf("    Пассажиры:  %,d кг (%d × %d кг)%n", paxWeight, checkedIn, PAX_WEIGHT);
            System.out.printf("    Багаж/груз:  %,d кг%n", cargoKg);
            System.out.printf("    ИТОГО:      %,d кг / %,d кг макс.%n", totalWeight, MAX_TAKEOFF_WEIGHT);

            boolean ok = totalWeight <= MAX_TAKEOFF_WEIGHT;
            System.out.printf("    Проверка: %s%n", ok ? "✓ OK" : "✗ FAIL — превышение веса");
            if (!ok) issues.add("Превышение максимального взлётного веса на " + (totalWeight - MAX_TAKEOFF_WEIGHT) + " кг");
            return ok;
        }

        void dispatch() {
            System.out.println("══════════════════════════════════════════");
            System.out.printf("   FLIGHT DISPATCH: %s %s → %s%n", flightNumber, origin, destination);
            System.out.println("══════════════════════════════════════════");
            System.out.println();

            List<String> issues = new ArrayList<>();
            checkPassengers(issues);
            checkFuel(issues);
            checkCrew(issues);
            checkWeather(issues);
            checkWeight(issues);

            System.out.println("\\n══════════════════════════════════════════");
            if (issues.isEmpty()) {
                System.out.println("   РЕШЕНИЕ: ✓ GO — рейс разрешён к вылету");
            } else {
                System.out.println("   РЕШЕНИЕ: ✗ NO-GO");
                issues.forEach(i -> System.out.println("   - " + i));
            }
            System.out.println("══════════════════════════════════════════");
        }
    }

    public static void main(String[] args) {
        FlightDispatch fd = new FlightDispatch();
        fd.flightNumber = "KC931"; fd.origin = "ALA"; fd.destination = "IST";
        fd.distanceKm = 4700; fd.totalPassengers = 150; fd.checkedIn = 145; fd.noShow = 5;
        fd.cargoKg = 3200; fd.tankCapacityKg = 24210;
        fd.crew = List.of(
            new CrewMember("CAPTAIN", "Асанов К.М.", true),
            new CrewMember("FO", "Ким Д.С.", true),
            new CrewMember("CABIN", "Серикова А.", true),
            new CrewMember("CABIN", "Тулегенов Б.", true),
            new CrewMember("CABIN", "Нурланова Г.", true),
            new CrewMember("CABIN", "Жанибеков Д.", true)
        );
        fd.wxOrigin = WeatherCondition.CAVOK;
        fd.wxRoute = WeatherCondition.IMC;
        fd.wxDestination = WeatherCondition.IMC;
        fd.dispatch();
    }
}`,
      explanation: 'Flight Dispatch — процедура, регулируемая ICAO и национальными авиавластями (КГА РК). OFP (Operational Flight Plan) рассчитывается dispatch-системами (Sabre Flight Plan, Lido/Lufthansa Systems). Топливо: trip + contingency (5-10%) + alternate + final reserve + taxi — формула ICAO Annex 6. Weight & Balance: центр тяжести критичен для безопасности. Go/No-Go decision принимается совместно командиром и диспетчером. Минимальный экипаж кабины: 1 бортпроводник на 50 пассажиров (ICAO).'
    }
  ]
}
