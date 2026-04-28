export default {
  id: 96,
  title: 'Реальная разработка: Такси-сервис',
  description: 'Типичные задачи Java-разработчика в такси-компании: surge pricing, matching водителей, расчёт ETA, обработка событий, платежи, рейтинги и фрод-детекция.',
  lessons: [
    {
      id: 1,
      title: 'Surge Pricing: Динамическое ценообразование',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Pricing Team. Задача из Jira: "PRICE-142: Реализовать расчёт surge-коэффициента на основе спроса и предложения в зоне". В такси-компаниях цена поездки растёт, когда спрос превышает предложение. Реализуй сервис расчёта surge-множителя.',
      requirements: [
        'Класс SurgePricingService с методом calculateMultiplier(int demand, int supply)',
        'Если supply == 0, вернуть MAX_SURGE = 5.0',
        'Коэффициент = demand / supply, но не меньше 1.0 и не больше 5.0',
        'Округление до 1 знака после запятой',
        'Метод calculatePrice(double basePrice, int demand, int supply) — basePrice * multiplier'
      ],
      expectedOutput: 'Zone A: demand=50, supply=20 → surge=2.5, price=625.0\nZone B: demand=10, supply=30 → surge=1.0, price=250.0\nZone C: demand=100, supply=5 → surge=5.0, price=1250.0\nZone D: demand=80, supply=0 → surge=5.0, price=1250.0',
      hint: 'Math.round(value * 10.0) / 10.0 для округления. Math.max(1.0, Math.min(MAX_SURGE, ratio)) для ограничения диапазона.',
      solution: `public class Main {
    static final double MAX_SURGE = 5.0;

    static double calculateMultiplier(int demand, int supply) {
        if (supply == 0) return MAX_SURGE;
        double ratio = (double) demand / supply;
        double multiplier = Math.max(1.0, Math.min(MAX_SURGE, ratio));
        return Math.round(multiplier * 10.0) / 10.0;
    }

    static double calculatePrice(double basePrice, int demand, int supply) {
        return basePrice * calculateMultiplier(demand, supply);
    }

    public static void main(String[] args) {
        int[][] zones = {{50, 20}, {10, 30}, {100, 5}, {80, 0}};
        String[] names = {"A", "B", "C", "D"};
        double basePrice = 250.0;

        for (int i = 0; i < zones.length; i++) {
            int demand = zones[i][0], supply = zones[i][1];
            double surge = calculateMultiplier(demand, supply);
            double price = calculatePrice(basePrice, demand, supply);
            System.out.println("Zone " + names[i] + ": demand=" + demand
                + ", supply=" + supply + " → surge=" + surge
                + ", price=" + price);
        }
    }
}`,
      explanation: 'Surge pricing — ключевая фича в такси. Когда водителей мало, а заказов много — цена растёт, мотивируя водителей выходить на линию. В реальности коэффициент считается по геозонам (H3 hexagons) каждые 5 минут и кэшируется в Redis. Формула сложнее — учитывает ML-прогнозы, погоду, события.'
    },
    {
      id: 2,
      title: 'Driver Matching: Поиск ближайшего водителя',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Matching Team. Задача: "MATCH-87: Найти ближайшего свободного водителя к пассажиру по координатам". Используй формулу расстояния между двумя точками (упрощённо — евклидово расстояние). Из списка водителей верни ближайшего свободного.',
      requirements: [
        'Класс Driver с полями: String name, double lat, double lon, boolean available',
        'Метод findNearest(double passengerLat, double passengerLon, List<Driver> drivers)',
        'Возвращает имя ближайшего СВОБОДНОГО водителя (available = true)',
        'Если свободных водителей нет — вернуть "NO_DRIVER"',
        'При равном расстоянии — первый в списке'
      ],
      expectedOutput: 'Nearest driver: Bolat (dist=1.41)\nNearest driver: Aisha (dist=2.24)\nNo available drivers: NO_DRIVER',
      hint: 'Расстояние: Math.sqrt((x2-x1)^2 + (y2-y1)^2). Фильтруй по available, затем ищи минимум.',
      solution: `import java.util.*;

public class Main {
    static String name;
    static double lat, lon;
    static boolean available;

    record Driver(String name, double lat, double lon, boolean available) {}

    static String findNearest(double pLat, double pLon, List<Driver> drivers) {
        String best = "NO_DRIVER";
        double minDist = Double.MAX_VALUE;

        for (Driver d : drivers) {
            if (!d.available()) continue;
            double dist = Math.sqrt(Math.pow(d.lat() - pLat, 2)
                                  + Math.pow(d.lon() - pLon, 2));
            if (dist < minDist) {
                minDist = dist;
                best = d.name();
            }
        }
        return best;
    }

    static double distance(double pLat, double pLon, Driver d) {
        return Math.sqrt(Math.pow(d.lat() - pLat, 2) + Math.pow(d.lon() - pLon, 2));
    }

    public static void main(String[] args) {
        List<Driver> drivers = List.of(
            new Driver("Arman", 10, 10, false),
            new Driver("Bolat", 6, 7, true),
            new Driver("Aisha", 3, 4, true),
            new Driver("Dana", 15, 15, true)
        );

        // Test 1: passenger at (5,6)
        String d1 = findNearest(5, 6, drivers);
        System.out.println("Nearest driver: " + d1
            + " (dist=" + String.format("%.2f", distance(5, 6,
                drivers.stream().filter(d -> d.name().equals(d1)).findFirst().get()))
            + ")");

        // Test 2: passenger at (1,2)
        String d2 = findNearest(1, 2, drivers);
        System.out.println("Nearest driver: " + d2
            + " (dist=" + String.format("%.2f", distance(1, 2,
                drivers.stream().filter(d -> d.name().equals(d2)).findFirst().get()))
            + ")");

        // Test 3: no available
        List<Driver> busy = List.of(
            new Driver("X", 1, 1, false),
            new Driver("Y", 2, 2, false)
        );
        System.out.println("No available drivers: " + findNearest(0, 0, busy));
    }
}`,
      explanation: 'Driver matching — самая критичная часть такси. В реальности используют не евклидово расстояние, а Haversine-формулу (координаты на сфере) и дорожное расстояние через OSRM/Google Maps. Водители хранятся в геоиндексе (H3, GeoHash) в Redis. Поиск идёт в радиусе с расширением, если водителей мало.'
    },
    {
      id: 3,
      title: 'ETA Calculation: Расчёт времени прибытия',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Rider Experience. Задача: "RIDE-203: Рассчитать ETA (Estimated Time of Arrival) водителя до пассажира с учётом пробок". Коэффициент пробок зависит от времени суток. Утренний и вечерний час-пик увеличивают время.',
      requirements: [
        'Метод calculateETA(double distanceKm, int hour) возвращает int (минуты)',
        'Базовая скорость: 40 км/ч',
        'Час-пик утро (7-9): коэффициент 2.5',
        'Час-пик вечер (17-19): коэффициент 2.0',
        'День (10-16): коэффициент 1.2',
        'Ночь (остальное): коэффициент 0.8',
        'Минимальный ETA: 2 минуты',
        'Результат округлить вверх (Math.ceil)'
      ],
      expectedOutput: 'ETA at 8:00 (morning rush): 19 min for 5.0 km\nETA at 14:00 (daytime): 9 min for 5.0 km\nETA at 18:00 (evening rush): 15 min for 5.0 km\nETA at 23:00 (night): 6 min for 5.0 km\nETA at 3:00 (short trip): 2 min for 0.5 km',
      hint: 'Время = (расстояние / скорость) * 60 * коэффициент. Не забудь Math.ceil и Math.max(2, ...).',
      solution: `public class Main {
    static final double BASE_SPEED_KMH = 40.0;

    static double getTrafficMultiplier(int hour) {
        if (hour >= 7 && hour <= 9) return 2.5;   // morning rush
        if (hour >= 17 && hour <= 19) return 2.0;  // evening rush
        if (hour >= 10 && hour <= 16) return 1.2;  // daytime
        return 0.8;                                 // night
    }

    static int calculateETA(double distanceKm, int hour) {
        double timeHours = distanceKm / BASE_SPEED_KMH;
        double timeMinutes = timeHours * 60 * getTrafficMultiplier(hour);
        return Math.max(2, (int) Math.ceil(timeMinutes));
    }

    public static void main(String[] args) {
        System.out.println("ETA at 8:00 (morning rush): "
            + calculateETA(5.0, 8) + " min for 5.0 km");
        System.out.println("ETA at 14:00 (daytime): "
            + calculateETA(5.0, 14) + " min for 5.0 km");
        System.out.println("ETA at 18:00 (evening rush): "
            + calculateETA(5.0, 18) + " min for 5.0 km");
        System.out.println("ETA at 23:00 (night): "
            + calculateETA(5.0, 23) + " min for 5.0 km");
        System.out.println("ETA at 3:00 (short trip): "
            + calculateETA(0.5, 3) + " min for 0.5 km");
    }
}`,
      explanation: 'ETA — то, что видит пассажир после заказа ("водитель будет через 7 минут"). В реальности ETA считается через дорожный граф, учитывая реальный трафик с GPS-данных водителей, дорожные работы, погоду. Обновляется в реальном времени каждые 10-15 секунд. Точность ETA — один из главных KPI команды.'
    },
    {
      id: 4,
      title: 'Ride Events: Обработка событий поездки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Platform Team. Задача: "PLAT-55: Реализовать обработчик событий жизненного цикла поездки". В микросервисной архитектуре события поездки идут через Kafka. Реализуй конечный автомат (state machine) для поездки.',
      requirements: [
        'Enum RideStatus: REQUESTED, DRIVER_ASSIGNED, DRIVER_ARRIVED, IN_PROGRESS, COMPLETED, CANCELLED',
        'Класс Ride с полями: String rideId, RideStatus status, String driverName, long startTime',
        'Метод processEvent(Ride ride, String event) — переводит в следующий статус',
        'Валидные переходы: REQUESTED→DRIVER_ASSIGNED, DRIVER_ASSIGNED→DRIVER_ARRIVED, DRIVER_ARRIVED→IN_PROGRESS, IN_PROGRESS→COMPLETED',
        'REQUESTED и DRIVER_ASSIGNED можно CANCELLED',
        'Невалидный переход — выбросить IllegalStateException'
      ],
      expectedOutput: 'ride-001: REQUESTED → assign → DRIVER_ASSIGNED\nride-001: DRIVER_ASSIGNED → arrive → DRIVER_ARRIVED\nride-001: DRIVER_ARRIVED → start → IN_PROGRESS\nride-001: IN_PROGRESS → complete → COMPLETED\nride-002: REQUESTED → cancel → CANCELLED\nride-003: IN_PROGRESS → cancel → ERROR: Cannot cancel ride in status IN_PROGRESS',
      hint: 'Switch по текущему статусу + event. Каждый статус знает свои допустимые переходы.',
      solution: `public class Main {
    enum RideStatus {
        REQUESTED, DRIVER_ASSIGNED, DRIVER_ARRIVED,
        IN_PROGRESS, COMPLETED, CANCELLED
    }

    static RideStatus status;
    static String rideId;

    static RideStatus processEvent(RideStatus current, String event) {
        return switch (current) {
            case REQUESTED -> switch (event) {
                case "assign" -> RideStatus.DRIVER_ASSIGNED;
                case "cancel" -> RideStatus.CANCELLED;
                default -> throw new IllegalStateException(
                    "Cannot " + event + " ride in status " + current);
            };
            case DRIVER_ASSIGNED -> switch (event) {
                case "arrive" -> RideStatus.DRIVER_ARRIVED;
                case "cancel" -> RideStatus.CANCELLED;
                default -> throw new IllegalStateException(
                    "Cannot " + event + " ride in status " + current);
            };
            case DRIVER_ARRIVED -> switch (event) {
                case "start" -> RideStatus.IN_PROGRESS;
                default -> throw new IllegalStateException(
                    "Cannot " + event + " ride in status " + current);
            };
            case IN_PROGRESS -> switch (event) {
                case "complete" -> RideStatus.COMPLETED;
                default -> throw new IllegalStateException(
                    "Cannot " + event + " ride in status " + current);
            };
            case COMPLETED, CANCELLED -> throw new IllegalStateException(
                "Cannot " + event + " ride in status " + current);
        };
    }

    static void tryProcess(String rideId, RideStatus[] statusHolder, String event) {
        RideStatus before = statusHolder[0];
        try {
            statusHolder[0] = processEvent(before, event);
            System.out.println(rideId + ": " + before + " → "
                + event + " → " + statusHolder[0]);
        } catch (IllegalStateException e) {
            System.out.println(rideId + ": " + before + " → "
                + event + " → ERROR: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        // Happy path
        RideStatus[] ride1 = {RideStatus.REQUESTED};
        tryProcess("ride-001", ride1, "assign");
        tryProcess("ride-001", ride1, "arrive");
        tryProcess("ride-001", ride1, "start");
        tryProcess("ride-001", ride1, "complete");

        // Cancel
        RideStatus[] ride2 = {RideStatus.REQUESTED};
        tryProcess("ride-002", ride2, "cancel");

        // Invalid cancel
        RideStatus[] ride3 = {RideStatus.IN_PROGRESS};
        tryProcess("ride-003", ride3, "cancel");
    }
}`,
      explanation: 'State machine поездки — центр всей бизнес-логики. В реальности каждый переход генерирует Kafka-событие (ride.assigned, ride.started, ride.completed). Десятки микросервисов подписаны на эти события: биллинг, аналитика, push-уведомления, ETL. Невалидные переходы ловятся и логируются для расследования багов.'
    },
    {
      id: 5,
      title: 'Payment Splitting: Расчёт комиссий',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Payments Team. Задача: "PAY-91: Реализовать расчёт распределения платежа между водителем, компанией и налогами". После каждой поездки сумма делится: комиссия компании, налоги и остаток водителю.',
      requirements: [
        'Метод splitPayment(double totalAmount, String rideType)',
        'Возвращает Map<String, Double> с ключами: driver, company, tax',
        'Economy: компания 20%, налог 12% от суммы компании',
        'Comfort: компания 25%, налог 12% от суммы компании',
        'Business: компания 30%, налог 12% от суммы компании',
        'driver = total - company - tax',
        'Все суммы округлить до 2 знаков (копейки)'
      ],
      expectedOutput: 'Economy ride: 1000.0 KZT\n  Company: 200.00, Tax: 24.00, Driver: 776.00\nComfort ride: 2000.0 KZT\n  Company: 500.00, Tax: 60.00, Driver: 1440.00\nBusiness ride: 5000.0 KZT\n  Company: 1500.00, Tax: 180.00, Driver: 3320.00',
      hint: 'company = total * rate. tax = company * 0.12. driver = total - company - tax. Округление: Math.round(x * 100.0) / 100.0.',
      solution: `import java.util.*;

public class Main {
    static Map<String, Double> splitPayment(double total, String rideType) {
        double companyRate = switch (rideType.toLowerCase()) {
            case "economy" -> 0.20;
            case "comfort" -> 0.25;
            case "business" -> 0.30;
            default -> throw new IllegalArgumentException("Unknown type: " + rideType);
        };

        double company = round(total * companyRate);
        double tax = round(company * 0.12);
        double driver = round(total - company - tax);

        return Map.of("company", company, "tax", tax, "driver", driver);
    }

    static double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    public static void main(String[] args) {
        String[] types = {"Economy", "Comfort", "Business"};
        double[] amounts = {1000.0, 2000.0, 5000.0};

        for (int i = 0; i < types.length; i++) {
            Map<String, Double> split = splitPayment(amounts[i], types[i]);
            System.out.println(types[i] + " ride: " + amounts[i] + " KZT");
            System.out.printf("  Company: %.2f, Tax: %.2f, Driver: %.2f%n",
                split.get("company"), split.get("tax"), split.get("driver"));
        }
    }
}`,
      explanation: 'Платежи — самый чувствительный микросервис. Каждая копейка должна сходиться. В реальности есть ещё: НДС, бонусы водителя, штрафы, кэшбэк пассажиру, реферальные выплаты. Все финансовые операции пишутся в двойной записи (double-entry bookkeeping). Используют BigDecimal вместо double для точности.'
    },
    {
      id: 6,
      title: 'Driver Rating: Рейтинговая система',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Driver Management. Задача: "DRV-134: Реализовать скользящий средний рейтинг водителя за последние N поездок". Рейтинг обновляется после каждой оценки пассажира. Низкий рейтинг — предупреждение или блокировка.',
      requirements: [
        'Класс DriverRating: хранит очередь последних N оценок (по умолчанию 50)',
        'Метод addRating(int rating) — добавить оценку от 1 до 5',
        'Метод getAverage() — средний рейтинг, округлённый до 2 знаков',
        'Метод getStatus() — "GOOD" (>=4.5), "WARNING" (>=4.0), "CRITICAL" (<4.0)',
        'Если оценок больше N — удалить самую старую (FIFO)',
        'Невалидная оценка (не 1-5) — IllegalArgumentException'
      ],
      expectedOutput: 'After 5 rides: avg=4.60, status=GOOD\nAfter bad ride: avg=4.17, status=WARNING\nAfter 3 more bad rides: avg=3.33, status=CRITICAL\nInvalid rating: Rating must be 1-5, got: 6',
      hint: 'LinkedList как очередь (addLast / removeFirst). Средний рейтинг через stream().mapToInt().average().',
      solution: `import java.util.*;

public class Main {
    static class DriverRating {
        private final int maxRides;
        private final LinkedList<Integer> ratings = new LinkedList<>();

        DriverRating(int maxRides) { this.maxRides = maxRides; }
        DriverRating() { this(50); }

        void addRating(int rating) {
            if (rating < 1 || rating > 5)
                throw new IllegalArgumentException(
                    "Rating must be 1-5, got: " + rating);
            ratings.addLast(rating);
            if (ratings.size() > maxRides) ratings.removeFirst();
        }

        double getAverage() {
            if (ratings.isEmpty()) return 0.0;
            double avg = ratings.stream().mapToInt(Integer::intValue).average().orElse(0);
            return Math.round(avg * 100.0) / 100.0;
        }

        String getStatus() {
            double avg = getAverage();
            if (avg >= 4.5) return "GOOD";
            if (avg >= 4.0) return "WARNING";
            return "CRITICAL";
        }
    }

    public static void main(String[] args) {
        DriverRating dr = new DriverRating(6);

        // Good rides
        for (int r : new int[]{5, 5, 4, 5, 4}) dr.addRating(r);
        System.out.println("After 5 rides: avg=" + dr.getAverage()
            + ", status=" + dr.getStatus());

        // One bad ride
        dr.addRating(1);
        System.out.println("After bad ride: avg="
            + String.format("%.2f", dr.getAverage())
            + ", status=" + dr.getStatus());

        // More bad rides (old good ones pushed out)
        for (int r : new int[]{1, 1, 1}) dr.addRating(r);
        System.out.println("After 3 more bad rides: avg="
            + String.format("%.2f", dr.getAverage())
            + ", status=" + dr.getStatus());

        // Invalid
        try {
            dr.addRating(6);
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid rating: " + e.getMessage());
        }
    }
}`,
      explanation: 'Рейтинг водителя — скользящее окно последних 50-100 поездок. При CRITICAL (<4.0) водитель получает предупреждение, при продолжении — временная блокировка. В реальности учитывают ещё отмены, опоздания, жалобы. Рейтинг хранится в Redis для быстрого доступа и дублируется в PostgreSQL.'
    },
    {
      id: 7,
      title: 'Promo Code: Система промокодов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Growth Team. Задача: "GROW-78: Реализовать систему промокодов с проверкой условий". Промокоды — ключевой инструмент маркетинга. У каждого промокода есть условия и лимиты.',
      requirements: [
        'Класс PromoCode: code, discountPercent, maxUses, currentUses, minOrderAmount, expiryDate',
        'Метод applyPromo(PromoCode promo, double orderAmount, String currentDate) → double (скидка)',
        'Проверки: не истёк, не превышен лимит, минимальная сумма заказа',
        'Если промокод невалиден — вернуть 0.0 и напечатать причину',
        'Скидка = orderAmount * discountPercent / 100, но не больше 5000 KZT'
      ],
      expectedOutput: 'WELCOME50: order=3000.0 → discount=1500.0, final=1500.0\nSUMMER20: order=500.0 → REJECTED: min order is 1000.0\nOLD10: order=2000.0 → REJECTED: promo expired\nLIMIT30: order=2000.0 → REJECTED: usage limit reached\nBIG50: order=20000.0 → discount=5000.0, final=15000.0 (capped)',
      hint: 'Последовательные проверки: expiry → uses → minAmount. Скидка = Math.min(calculated, 5000).',
      solution: `public class Main {
    static class PromoCode {
        String code;
        int discountPercent;
        int maxUses, currentUses;
        double minOrderAmount;
        String expiryDate; // yyyy-MM-dd

        PromoCode(String code, int pct, int max, int cur, double minOrder, String expiry) {
            this.code = code;
            this.discountPercent = pct;
            this.maxUses = max;
            this.currentUses = cur;
            this.minOrderAmount = minOrder;
            this.expiryDate = expiry;
        }
    }

    static double applyPromo(PromoCode p, double orderAmount, String currentDate) {
        if (currentDate.compareTo(p.expiryDate) > 0) {
            System.out.println(p.code + ": order=" + orderAmount
                + " → REJECTED: promo expired");
            return 0.0;
        }
        if (p.currentUses >= p.maxUses) {
            System.out.println(p.code + ": order=" + orderAmount
                + " → REJECTED: usage limit reached");
            return 0.0;
        }
        if (orderAmount < p.minOrderAmount) {
            System.out.println(p.code + ": order=" + orderAmount
                + " → REJECTED: min order is " + p.minOrderAmount);
            return 0.0;
        }

        double discount = Math.min(orderAmount * p.discountPercent / 100.0, 5000.0);
        double finalPrice = orderAmount - discount;
        String cap = discount == 5000.0 ? " (capped)" : "";
        System.out.println(p.code + ": order=" + orderAmount
            + " → discount=" + discount + ", final=" + finalPrice + cap);
        p.currentUses++;
        return discount;
    }

    public static void main(String[] args) {
        String today = "2026-04-07";

        applyPromo(new PromoCode("WELCOME50", 50, 1000, 5, 1000, "2026-12-31"),
            3000.0, today);
        applyPromo(new PromoCode("SUMMER20", 20, 500, 10, 1000, "2026-08-31"),
            500.0, today);
        applyPromo(new PromoCode("OLD10", 10, 100, 20, 500, "2025-12-31"),
            2000.0, today);
        applyPromo(new PromoCode("LIMIT30", 30, 100, 100, 500, "2026-12-31"),
            2000.0, today);
        applyPromo(new PromoCode("BIG50", 50, 1000, 0, 1000, "2026-12-31"),
            20000.0, today);
    }
}`,
      explanation: 'Промокоды — один из главных инструментов growth-команды. В реальности промокоды хранятся в отдельном микросервисе, кэшируются в Redis, а использование трекается в Kafka для аналитики. Есть ещё реферальные коды, персональные скидки, промо для новых пользователей. Каждый промокод A/B тестируется.'
    },
    {
      id: 8,
      title: 'Geo-зоны: Тарификация по районам',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Pricing Team. Задача: "PRICE-156: Определить тарифную зону по координатам и рассчитать стоимость". Город разделён на зоны: центр (дороже), спальные районы, пригород. Стоимость зависит от зоны отправления.',
      requirements: [
        'Класс Zone: name, centerLat, centerLon, radius, pricePerKm',
        'Метод findZone(double lat, double lon, List<Zone> zones) — найти зону по координатам',
        'Точка в зоне, если расстояние до центра зоны <= radius',
        'Если точка в нескольких зонах — выбрать с наименьшим радиусом (более точная)',
        'Метод calculateFare(double distKm, Zone zone) = zone.pricePerKm * distKm + 200 (посадка)',
        'Если точка не в зоне — тариф "SUBURB" с фиксированной ценой 80 KZT/км'
      ],
      expectedOutput: 'Point (43.24, 76.95): Zone=CENTER, Fare=1100.0 KZT for 5.0 km\nPoint (43.20, 76.85): Zone=RESIDENTIAL, Fare=700.0 KZT for 5.0 km\nPoint (43.10, 76.70): Zone=SUBURB, Fare=600.0 KZT for 5.0 km',
      hint: 'Расстояние до центра зоны. Фильтруй зоны где dist <= radius, сортируй по radius ascending.',
      solution: `import java.util.*;

public class Main {
    record Zone(String name, double centerLat, double centerLon,
                double radius, double pricePerKm) {}

    static final double SUBURB_PRICE = 80.0;
    static final double BASE_FARE = 200.0;

    static double dist(double lat1, double lon1, double lat2, double lon2) {
        return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
    }

    static Zone findZone(double lat, double lon, List<Zone> zones) {
        return zones.stream()
            .filter(z -> dist(lat, lon, z.centerLat(), z.centerLon()) <= z.radius())
            .min(Comparator.comparingDouble(Zone::radius))
            .orElse(new Zone("SUBURB", 0, 0, 0, SUBURB_PRICE));
    }

    static double calculateFare(double distKm, Zone zone) {
        return zone.pricePerKm() * distKm + BASE_FARE;
    }

    public static void main(String[] args) {
        List<Zone> zones = List.of(
            new Zone("CENTER", 43.24, 76.95, 0.05, 180.0),
            new Zone("RESIDENTIAL", 43.22, 76.88, 0.10, 100.0)
        );

        double[][] points = {{43.24, 76.95}, {43.20, 76.85}, {43.10, 76.70}};
        double tripDist = 5.0;

        for (double[] p : points) {
            Zone z = findZone(p[0], p[1], zones);
            double fare = calculateFare(tripDist, z);
            System.out.printf("Point (%.2f, %.2f): Zone=%s, Fare=%.1f KZT for %.1f km%n",
                p[0], p[1], z.name(), fare, tripDist);
        }
    }
}`,
      explanation: 'Геозоны — основа тарификации. Uber использует H3 (гексагональная сетка), Яндекс — собственные полигоны. Каждая зона имеет свой тариф, surge-множитель, минимальную цену. Зоны хранятся в PostGIS и кэшируются. Есть ещё зоны аэропортов, вокзалов (фиксированные цены) и запретные зоны.'
    },
    {
      id: 9,
      title: 'Ride History: Агрегация статистики',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Analytics Team. Задача: "ANLT-45: Агрегировать статистику поездок водителя за период". Для дашборда водителя нужна статистика: количество поездок, заработок, средний рейтинг, время онлайн.',
      requirements: [
        'Record RideRecord: String rideId, double earnings, int rating, int durationMin, String date',
        'Метод aggregateStats(List<RideRecord> rides) возвращает Map<String, Object>',
        'Ключи: totalRides, totalEarnings, avgRating (2 знака), totalHours, avgEarningsPerHour',
        'Группировка по дням: Map<String, Double> dailyEarnings',
        'Лучший день по заработку'
      ],
      expectedOutput: 'Driver Stats:\n  Total rides: 6\n  Total earnings: 12500.0 KZT\n  Avg rating: 4.67\n  Total hours: 3.5\n  Avg earnings/hour: 3571.43 KZT\n  Best day: 2026-04-06 (5500.0 KZT)\nDaily breakdown:\n  2026-04-05: 3500.0 KZT\n  2026-04-06: 5500.0 KZT\n  2026-04-07: 3500.0 KZT',
      hint: 'Stream API: groupingBy для группировки по дате, summingDouble для сумм, average для средних.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record RideRecord(String rideId, double earnings, int rating,
                      int durationMin, String date) {}

    static void aggregateStats(List<RideRecord> rides) {
        int totalRides = rides.size();
        double totalEarnings = rides.stream()
            .mapToDouble(RideRecord::earnings).sum();
        double avgRating = rides.stream()
            .mapToInt(RideRecord::rating).average().orElse(0);
        double totalHours = rides.stream()
            .mapToInt(RideRecord::durationMin).sum() / 60.0;
        double avgPerHour = totalEarnings / totalHours;

        Map<String, Double> daily = rides.stream()
            .collect(Collectors.groupingBy(RideRecord::date,
                TreeMap::new,
                Collectors.summingDouble(RideRecord::earnings)));

        String bestDay = daily.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(e -> e.getKey() + " (" + e.getValue() + " KZT)")
            .orElse("N/A");

        System.out.println("Driver Stats:");
        System.out.println("  Total rides: " + totalRides);
        System.out.println("  Total earnings: " + totalEarnings + " KZT");
        System.out.printf("  Avg rating: %.2f%n", avgRating);
        System.out.println("  Total hours: " + totalHours);
        System.out.printf("  Avg earnings/hour: %.2f KZT%n", avgPerHour);
        System.out.println("  Best day: " + bestDay);
        System.out.println("Daily breakdown:");
        daily.forEach((day, sum) ->
            System.out.println("  " + day + ": " + sum + " KZT"));
    }

    public static void main(String[] args) {
        List<RideRecord> rides = List.of(
            new RideRecord("r1", 1500, 5, 25, "2026-04-05"),
            new RideRecord("r2", 2000, 5, 35, "2026-04-05"),
            new RideRecord("r3", 2500, 4, 40, "2026-04-06"),
            new RideRecord("r4", 3000, 5, 45, "2026-04-06"),
            new RideRecord("r5", 1500, 4, 20, "2026-04-07"),
            new RideRecord("r6", 2000, 5, 45, "2026-04-07")
        );
        aggregateStats(rides);
    }
}`,
      explanation: 'Аналитика — основа принятия решений. Реальные дашборды водителей показывают заработок в реальном времени, сравнение с прошлой неделей, heat map активных зон. Данные агрегируются через Apache Flink / Spark из Kafka-стримов и хранятся в ClickHouse / BigQuery. Stream API используется для in-memory агрегации.'
    },
    {
      id: 10,
      title: 'Fraud Detection: Обнаружение мошенничества',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт: Trust & Safety. Задача: "SAFE-22: Реализовать правила детекции подозрительных поездок". Фрод — это фейковые поездки, сговор водителя и пассажира, GPS-спуфинг. Реализуй набор правил для выявления подозрительных паттернов.',
      requirements: [
        'Record TripData: rideId, driverId, riderId, double distanceKm, int durationMin, double fare, int riderTripsToday',
        'Метод detectFraud(TripData trip) возвращает List<String> — список сработавших правил',
        'Правило 1: "SHORT_TRIP_HIGH_FARE" — расстояние < 1 км, но fare > 2000',
        'Правило 2: "IMPOSSIBLE_SPEED" — скорость > 200 км/ч (dist/time*60)',
        'Правило 3: "TOO_MANY_TRIPS" — riderTripsToday > 20',
        'Правило 4: "SUSPICIOUSLY_CHEAP" — fare < distanceKm * 50 (ниже себестоимости)',
        'Если правил 0 — вернуть список с "CLEAN"'
      ],
      expectedOutput: 'ride-001: [CLEAN]\nride-002: [SHORT_TRIP_HIGH_FARE]\nride-003: [IMPOSSIBLE_SPEED]\nride-004: [TOO_MANY_TRIPS, SUSPICIOUSLY_CHEAP]\nride-005: [SHORT_TRIP_HIGH_FARE, IMPOSSIBLE_SPEED]',
      hint: 'Каждое правило — отдельная проверка, результаты собираются в список. Скорость = distance / (duration / 60.0).',
      solution: `import java.util.*;

public class Main {
    record TripData(String rideId, String driverId, String riderId,
                    double distanceKm, int durationMin, double fare,
                    int riderTripsToday) {}

    static List<String> detectFraud(TripData t) {
        List<String> flags = new ArrayList<>();

        // Rule 1: short trip but high fare
        if (t.distanceKm() < 1.0 && t.fare() > 2000)
            flags.add("SHORT_TRIP_HIGH_FARE");

        // Rule 2: impossible speed
        if (t.durationMin() > 0) {
            double speedKmh = t.distanceKm() / (t.durationMin() / 60.0);
            if (speedKmh > 200) flags.add("IMPOSSIBLE_SPEED");
        }

        // Rule 3: too many trips per day
        if (t.riderTripsToday() > 20)
            flags.add("TOO_MANY_TRIPS");

        // Rule 4: suspiciously cheap
        if (t.fare() < t.distanceKm() * 50)
            flags.add("SUSPICIOUSLY_CHEAP");

        if (flags.isEmpty()) flags.add("CLEAN");
        return flags;
    }

    public static void main(String[] args) {
        List<TripData> trips = List.of(
            new TripData("ride-001", "d1", "r1", 5.0, 15, 800, 3),
            new TripData("ride-002", "d2", "r2", 0.5, 10, 5000, 1),
            new TripData("ride-003", "d3", "r3", 50.0, 10, 3000, 2),
            new TripData("ride-004", "d4", "r4", 10.0, 20, 200, 25),
            new TripData("ride-005", "d5", "r5", 0.8, 0, 3000, 1)
        );

        // Handle edge case: duration = 0 means instant trip (definitely fraud)
        for (TripData t : trips) {
            List<String> flags = detectFraud(t);
            System.out.println(t.rideId() + ": " + flags);
        }
    }
}`,
      explanation: 'Фрод-детекция — критически важный сервис. В реальности используют ML-модели (gradient boosting, anomaly detection), анализ GPS-трекинга, графы связей между водителями и пассажирами. Правила — первая линия защиты. Подозрительные поездки попадают в очередь ручной проверки (модерация). Потери от фрода могут составлять миллионы долларов.'
    }
  ]
}
