export default {
  id: 104,
  title: 'Проект с нуля: Sprint 2 — Доставка и трекинг',
  description: 'QuickBite Sprint 2: назначение курьеров, отслеживание заказа в реальном времени, расчёт маршрутов и уведомления.',
  lessons: [
    {
      id: 1,
      title: 'Courier Entity: Модель курьера',
      type: 'practice',
      difficulty: 'easy',
      description: 'Sprint 2 начинается. CTO: «Мы запустили приём заказов, но доставлять-то кто будет? Нам нужна модель курьера — имя, телефон, транспорт, GPS-координаты, статус. Без этого не двинемся дальше. Сделай record Courier и красивый вывод карточки курьера с иконками статуса.»',
      requirements: [
        'Enum Vehicle: BICYCLE, SCOOTER, CAR',
        'Enum CourierStatus: OFFLINE, AVAILABLE, BUSY',
        'Record Courier(int id, String name, String phone, Vehicle vehicle, double currentLat, double currentLon, CourierStatus status, double rating, int completedOrders)',
        'Метод printCourierCard(Courier) — выводит карточку с иконками: OFFLINE=⛔, AVAILABLE=✅, BUSY=🚗',
        'Метод getVehicleIcon(Vehicle) — BICYCLE=🚲, SCOOTER=🛵, CAR=🚗',
        'Создать 3-х курьеров с разными статусами и транспортом',
        'Вывести карточку каждого курьера'
      ],
      expectedOutput: '=== Карточка курьера ===\n#1 Алексей Ким\nТелефон: +7-701-111-1111\nТранспорт: 🚲 BICYCLE\nЛокация: 43.2380, 76.9450\nСтатус: ✅ AVAILABLE\nРейтинг: 4.8 ⭐ (152 заказов)\n========================\n=== Карточка курьера ===\n#2 Данияр Серик\nТелефон: +7-702-222-2222\nТранспорт: 🛵 SCOOTER\nЛокация: 43.2550, 76.9280\nСтатус: 🚗 BUSY\nРейтинг: 4.5 ⭐ (98 заказов)\n========================\n=== Карточка курьера ===\n#3 Марат Жумабаев\nТелефон: +7-705-333-3333\nТранспорт: 🚗 CAR\nЛокация: 43.2100, 76.6700\nСтатус: ⛔ OFFLINE\nРейтинг: 4.9 ⭐ (310 заказов)\n========================',
      hint: 'Используй Java 17 record для Courier. Для иконок статуса — switch expression. String.format для форматирования координат с 4 знаками.',
      solution: `public class Main {
    enum Vehicle { BICYCLE, SCOOTER, CAR }
    enum CourierStatus { OFFLINE, AVAILABLE, BUSY }

    record Courier(int id, String name, String phone, Vehicle vehicle,
                   double currentLat, double currentLon,
                   CourierStatus status, double rating, int completedOrders) {}

    static String getVehicleIcon(Vehicle v) {
        return switch (v) {
            case BICYCLE -> "🚲";
            case SCOOTER -> "🛵";
            case CAR -> "🚗";
        };
    }

    static String getStatusIcon(CourierStatus s) {
        return switch (s) {
            case OFFLINE -> "⛔";
            case AVAILABLE -> "✅";
            case BUSY -> "🚗";
        };
    }

    static void printCourierCard(Courier c) {
        System.out.println("=== Карточка курьера ===");
        System.out.println("#" + c.id() + " " + c.name());
        System.out.println("Телефон: " + c.phone());
        System.out.println("Транспорт: " + getVehicleIcon(c.vehicle()) + " " + c.vehicle());
        System.out.printf("Локация: %.4f, %.4f%n", c.currentLat(), c.currentLon());
        System.out.println("Статус: " + getStatusIcon(c.status()) + " " + c.status());
        System.out.printf("Рейтинг: %.1f ⭐ (%d заказов)%n", c.rating(), c.completedOrders());
        System.out.println("========================");
    }

    public static void main(String[] args) {
        var couriers = java.util.List.of(
            new Courier(1, "Алексей Ким", "+7-701-111-1111",
                Vehicle.BICYCLE, 43.2380, 76.9450,
                CourierStatus.AVAILABLE, 4.8, 152),
            new Courier(2, "Данияр Серик", "+7-702-222-2222",
                Vehicle.SCOOTER, 43.2550, 76.9280,
                CourierStatus.BUSY, 4.5, 98),
            new Courier(3, "Марат Жумабаев", "+7-705-333-3333",
                Vehicle.CAR, 43.2100, 76.6700,
                CourierStatus.OFFLINE, 4.9, 310)
        );

        couriers.forEach(Main::printCourierCard);
    }
}`,
      explanation: 'В Glovo и Яндекс Еде модель курьера — одна из ключевых сущностей. GPS-координаты обновляются каждые 3-5 секунд через WebSocket. Статус курьера определяет, можно ли ему назначить заказ. Vehicle влияет на радиус доставки и скорость. Рейтинг вычисляется как weighted moving average последних N доставок. В Wolt курьеры могут переключать статус в приложении, но система автоматически ставит OFFLINE после 30 минут без активности.'
    },
    {
      id: 2,
      title: 'Courier Assignment: Назначение курьера',
      type: 'practice',
      difficulty: 'medium',
      description: 'PM: «У нас уже 50 курьеров в Алматы! Нужен алгоритм назначения лучшего курьера на заказ. Критерии: расстояние до ресторана, рейтинг, опыт. Если свободных нет — заказ в очередь ожидания. Это критичная фича — от неё зависит время доставки.»',
      requirements: [
        'Record Courier(int id, String name, double lat, double lon, String status, double rating, int completedOrders)',
        'Record Order(int id, double restaurantLat, double restaurantLon)',
        'Метод calcDistance(double lat1, double lon1, double lat2, double lon2) — евклидово расстояние * 111 (км)',
        'Метод calcScore(Courier, Order) — score = (1 / (distance + 0.1)) * 0.4 + rating * 0.3 + (completedOrders / 100.0) * 0.3',
        'Метод assignCourier(List<Courier>, Order) — найти AVAILABLE с лучшим score',
        'Если нет свободных — вернуть "В очередь ожидания"',
        'Вывести скоринг каждого кандидата и результат назначения'
      ],
      expectedOutput: '--- Назначение курьера для заказа #101 ---\nКандидаты (AVAILABLE):\n  Алексей: расстояние=1.2 км, score=2.11\n  Марат: расстояние=3.5 км, score=1.68\nНазначен: Алексей (score: 2.11)\n\n--- Назначение курьера для заказа #102 ---\nНет свободных курьеров!\nЗаказ #102 добавлен в очередь ожидания (позиция: 1)',
      hint: 'Отфильтруй курьеров со статусом AVAILABLE, посчитай score для каждого, отсортируй по убыванию. Для очереди используй LinkedList.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Courier(int id, String name, double lat, double lon,
                   String status, double rating, int completedOrders) {}
    record Order(int id, double restaurantLat, double restaurantLon) {}

    static double calcDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = lat1 - lat2;
        double dLon = lon1 - lon2;
        return Math.sqrt(dLat * dLat + dLon * dLon) * 111;
    }

    static double calcScore(Courier c, Order o) {
        double dist = calcDistance(c.lat(), c.lon(), o.restaurantLat(), o.restaurantLon());
        return (1.0 / (dist + 0.1)) * 0.4 + c.rating() * 0.3
               + (c.completedOrders() / 100.0) * 0.3;
    }

    static Queue<Integer> waitingQueue = new LinkedList<>();

    static void assignCourier(List<Courier> couriers, Order order) {
        System.out.println("--- Назначение курьера для заказа #" + order.id() + " ---");

        List<Courier> available = couriers.stream()
                .filter(c -> c.status().equals("AVAILABLE"))
                .collect(Collectors.toList());

        if (available.isEmpty()) {
            System.out.println("Нет свободных курьеров!");
            waitingQueue.add(order.id());
            System.out.println("Заказ #" + order.id()
                + " добавлен в очередь ожидания (позиция: " + waitingQueue.size() + ")");
            return;
        }

        System.out.println("Кандидаты (AVAILABLE):");
        Map<Courier, Double> scores = new LinkedHashMap<>();
        for (Courier c : available) {
            double dist = calcDistance(c.lat(), c.lon(),
                order.restaurantLat(), order.restaurantLon());
            double score = calcScore(c, order);
            scores.put(c, score);
            System.out.printf("  %s: расстояние=%.1f км, score=%.2f%n",
                c.name(), dist, score);
        }

        Courier best = scores.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .get().getKey();
        System.out.printf("Назначен: %s (score: %.2f)%n", best.name(), scores.get(best));
    }

    public static void main(String[] args) {
        List<Courier> couriers = List.of(
            new Courier(1, "Алексей", 43.238, 76.945, "AVAILABLE", 4.8, 152),
            new Courier(2, "Данияр", 43.255, 76.928, "BUSY", 4.5, 98),
            new Courier(3, "Марат", 43.210, 76.900, "AVAILABLE", 4.9, 310)
        );

        Order order1 = new Order(101, 43.240, 76.950);
        assignCourier(couriers, order1);

        System.out.println();

        List<Courier> allBusy = couriers.stream()
                .map(c -> new Courier(c.id(), c.name(), c.lat(), c.lon(),
                    "BUSY", c.rating(), c.completedOrders()))
                .collect(Collectors.toList());
        Order order2 = new Order(102, 43.250, 76.940);
        assignCourier(allBusy, order2);
    }
}`,
      explanation: 'Алгоритм назначения курьера — ядро любого delivery-сервиса. В Яндекс Еде используется Hungarian Algorithm для оптимального матчинга курьеров и заказов. Glovo учитывает: расстояние, время простоя курьера, батчинг (совмещение заказов), предпочтения курьера по зоне. Wolt использует machine learning для предсказания, какой курьер доставит быстрее. Uber Eats применяет real-time аукцион: заказ предлагается ближайшим курьерам, первый принявший получает его.'
    },
    {
      id: 3,
      title: 'Route Calculation: Расчёт маршрута',
      type: 'practice',
      difficulty: 'medium',
      description: 'Team Lead: «Клиенты хотят знать ETA — estimated time of arrival. Нужно рассчитать маршрут: курьер → ресторан → клиент. Учти тип транспорта и трафик в зависимости от часа. В час-пик в Алматы на Аль-Фараби пробки — коэффициент 1.8.»',
      requirements: [
        'Enum Vehicle: BICYCLE(15), SCOOTER(30), CAR(40) — скорость в км/ч',
        'Метод calcDistance(lat1, lon1, lat2, lon2) — евклидово * 111 км',
        'Метод getTrafficMultiplier(int hour) — 7-9: 1.8, 12-14: 1.3, 17-20: 2.0, остальное: 1.0',
        'Record RouteSegment(String from, String to, double distanceKm, int estimatedMinutes)',
        'Метод calculateRoute(courier, restaurant, customer, Vehicle, int hour)',
        'Вывести оба сегмента маршрута, общее расстояние и ETA',
        'Формат времени: "X мин" или "X ч Y мин" если > 60'
      ],
      expectedOutput: '🗺️ Маршрут доставки (SCOOTER, 18:00)\nТрафик: x2.0 (час-пик вечер)\n──────────────────────────\n📍 Курьер → Ресторан: 2.3 км (~9 мин)\n📍 Ресторан → Клиент: 4.1 км (~16 мин)\n──────────────────────────\n📦 Итого: 6.4 км, ~25 мин\n\n🗺️ Маршрут доставки (BICYCLE, 11:00)\nТрафик: x1.0 (свободно)\n──────────────────────────\n📍 Курьер → Ресторан: 2.3 км (~9 мин)\n📍 Ресторан → Клиент: 4.1 км (~16 мин)\n──────────────────────────\n📦 Итого: 6.4 км, ~25 мин',
      hint: 'Время = (расстояние / скорость) * trafficMultiplier * 60 минут. Bicycle не зависит от трафика (траффик-множитель = 1.0 для велосипеда). Округляй Math.round().',
      solution: `public class Main {
    enum Vehicle {
        BICYCLE(15), SCOOTER(30), CAR(40);
        final int speedKmh;
        Vehicle(int s) { this.speedKmh = s; }
    }

    record Point(String name, double lat, double lon) {}
    record RouteSegment(String from, String to, double distanceKm, int estimatedMinutes) {}

    static double calcDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = lat1 - lat2;
        double dLon = lon1 - lon2;
        return Math.sqrt(dLat * dLat + dLon * dLon) * 111;
    }

    static double getTrafficMultiplier(int hour) {
        if (hour >= 7 && hour <= 9) return 1.8;
        if (hour >= 12 && hour <= 14) return 1.3;
        if (hour >= 17 && hour <= 20) return 2.0;
        return 1.0;
    }

    static String trafficLabel(double multiplier) {
        if (multiplier >= 2.0) return "час-пик вечер";
        if (multiplier >= 1.8) return "час-пик утро";
        if (multiplier >= 1.3) return "умеренный трафик";
        return "свободно";
    }

    static String formatTime(int minutes) {
        if (minutes > 60) return (minutes / 60) + " ч " + (minutes % 60) + " мин";
        return minutes + " мин";
    }

    static void calculateRoute(Point courier, Point restaurant, Point customer,
                                Vehicle vehicle, int hour) {
        double traffic = vehicle == Vehicle.BICYCLE ? 1.0 : getTrafficMultiplier(hour);

        double dist1 = calcDistance(courier.lat(), courier.lon(),
            restaurant.lat(), restaurant.lon());
        double dist2 = calcDistance(restaurant.lat(), restaurant.lon(),
            customer.lat(), customer.lon());

        int time1 = (int) Math.round((dist1 / vehicle.speedKmh) * traffic * 60);
        int time2 = (int) Math.round((dist2 / vehicle.speedKmh) * traffic * 60);

        double totalDist = dist1 + dist2;
        int totalTime = time1 + time2;

        System.out.printf("🗺️ Маршрут доставки (%s, %d:00)%n", vehicle, hour);
        System.out.printf("Трафик: x%.1f (%s)%n", traffic, trafficLabel(traffic));
        System.out.println("──────────────────────────");
        System.out.printf("📍 Курьер → Ресторан: %.1f км (~%s)%n", dist1, formatTime(time1));
        System.out.printf("📍 Ресторан → Клиент: %.1f км (~%s)%n", dist2, formatTime(time2));
        System.out.println("──────────────────────────");
        System.out.printf("📦 Итого: %.1f км, ~%s%n", totalDist, formatTime(totalTime));
    }

    public static void main(String[] args) {
        Point courier = new Point("Курьер", 43.238, 76.945);
        Point restaurant = new Point("Ресторан", 43.250, 76.930);
        Point customer = new Point("Клиент", 43.270, 76.900);

        calculateRoute(courier, restaurant, customer, Vehicle.SCOOTER, 18);
        System.out.println();
        calculateRoute(courier, restaurant, customer, Vehicle.BICYCLE, 11);
    }
}`,
      explanation: 'В Яндекс Еде ETA — ключевая метрика. Они используют собственный роутинг на основе данных Яндекс.Карт с учётом пробок в реальном времени. Glovo использует Google Maps Directions API для построения маршрутов. Wolt учитывает время приготовления в ресторане + время доставки. Uber Eats обновляет ETA каждые 30 секунд на основе GPS-данных курьера. В реальности маршрут не прямолинейный — нужен граф дорог и алгоритм Dijkstra/A*, но для MVP евклидово расстояние с коэффициентом — рабочий подход.'
    },
    {
      id: 4,
      title: 'Order Tracking: Трекинг в реальном времени',
      type: 'practice',
      difficulty: 'medium',
      description: 'PM: «Клиенты постоянно спрашивают "где мой заказ?". Нужен real-time трекинг: симулируем движение курьера по маршруту, каждый тик обновляем позицию и считаем оставшееся расстояние. Показывать "Курьер в X км от вас, прибудет через Y мин".»',
      requirements: [
        'Record Position(double lat, double lon)',
        'Enum DeliveryStage: GOING_TO_RESTAURANT, PICKING_UP, GOING_TO_CUSTOMER, DELIVERED',
        'Метод calcDistance(Position, Position) — евклидово * 111 км',
        'Метод simulateMovement(Position from, Position to, int steps) — возвращает List<Position> промежуточных точек',
        'Симуляция: курьер движется к ресторану, затем к клиенту, каждый шаг — обновление',
        'На каждом шаге выводить: этап, расстояние до цели, ETA',
        'Скорость курьера: 30 км/ч (скутер)'
      ],
      expectedOutput: '📦 Заказ #501 — трекинг\n\n🔄 Этап: GOING_TO_RESTAURANT\n  [1/3] Позиция: 43.2420, 76.9400 | До ресторана: 1.3 км | ETA: 3 мин\n  [2/3] Позиция: 43.2460, 76.9350 | До ресторана: 0.7 км | ETA: 1 мин\n  [3/3] Позиция: 43.2500, 76.9300 | До ресторана: 0.0 км | ETA: 0 мин\n\n🍳 Ресторан готовит заказ... (5 мин)\n\n🔄 Этап: GOING_TO_CUSTOMER\n  [1/4] Позиция: 43.2550, 76.9225 | До клиента: 1.2 км | ETA: 2 мин\n  [2/4] Позиция: 43.2600, 76.9150 | До клиента: 0.8 км | ETA: 2 мин\n  [3/4] Позиция: 43.2650, 76.9075 | До клиента: 0.4 км | ETA: 1 мин\n  [4/4] Позиция: 43.2700, 76.9000 | До клиента: 0.0 км | ETA: 0 мин\n\n✅ Заказ #501 доставлен!',
      hint: 'Для simulateMovement разбей путь на steps шагов: на каждом шаге lat += (toLat - fromLat) / steps, аналогично lon. ETA = distance / speed * 60.',
      solution: `import java.util.*;

public class Main {
    record Position(double lat, double lon) {}
    enum DeliveryStage { GOING_TO_RESTAURANT, PICKING_UP, GOING_TO_CUSTOMER, DELIVERED }

    static double calcDistance(Position a, Position b) {
        double dLat = a.lat() - b.lat();
        double dLon = a.lon() - b.lon();
        return Math.sqrt(dLat * dLat + dLon * dLon) * 111;
    }

    static List<Position> simulateMovement(Position from, Position to, int steps) {
        List<Position> path = new ArrayList<>();
        double dLat = (to.lat() - from.lat()) / steps;
        double dLon = (to.lon() - from.lon()) / steps;
        for (int i = 1; i <= steps; i++) {
            path.add(new Position(from.lat() + dLat * i, from.lon() + dLon * i));
        }
        return path;
    }

    static int calcEta(double distanceKm, double speedKmh) {
        return (int) Math.round((distanceKm / speedKmh) * 60);
    }

    public static void main(String[] args) {
        int orderId = 501;
        double speedKmh = 30;

        Position courier = new Position(43.238, 76.945);
        Position restaurant = new Position(43.250, 76.930);
        Position customer = new Position(43.270, 76.900);

        System.out.println("📦 Заказ #" + orderId + " — трекинг");

        // Этап 1: курьер -> ресторан
        System.out.println("\\n🔄 Этап: GOING_TO_RESTAURANT");
        List<Position> toRestaurant = simulateMovement(courier, restaurant, 3);
        for (int i = 0; i < toRestaurant.size(); i++) {
            Position pos = toRestaurant.get(i);
            double dist = calcDistance(pos, restaurant);
            int eta = calcEta(dist, speedKmh);
            System.out.printf("  [%d/%d] Позиция: %.4f, %.4f | До ресторана: %.1f км | ETA: %d мин%n",
                i + 1, toRestaurant.size(), pos.lat(), pos.lon(), dist, eta);
        }

        // Этап 2: ожидание в ресторане
        System.out.println("\\n🍳 Ресторан готовит заказ... (5 мин)");

        // Этап 3: ресторан -> клиент
        System.out.println("\\n🔄 Этап: GOING_TO_CUSTOMER");
        List<Position> toCustomer = simulateMovement(restaurant, customer, 4);
        for (int i = 0; i < toCustomer.size(); i++) {
            Position pos = toCustomer.get(i);
            double dist = calcDistance(pos, customer);
            int eta = calcEta(dist, speedKmh);
            System.out.printf("  [%d/%d] Позиция: %.4f, %.4f | До клиента: %.1f км | ETA: %d мин%n",
                i + 1, toCustomer.size(), pos.lat(), pos.lon(), dist, eta);
        }

        System.out.println("\\n✅ Заказ #" + orderId + " доставлен!");
    }
}`,
      explanation: 'В Glovo и Wolt клиент видит курьера на карте в реальном времени. GPS-координаты приходят через WebSocket каждые 3-5 секунд. ETA пересчитывается на сервере с учётом актуальных пробок. Яндекс Еда показывает три стадии: "Ресторан готовит", "Курьер в пути", "Курьер рядом". Uber Eats использует Kafka для обработки потока GPS-событий — до 1 млн обновлений в секунду. В нашей симуляции мы упрощаем до линейного движения по прямой, но принцип тот же.'
    },
    {
      id: 5,
      title: 'Push Notifications: Уведомления о статусе',
      type: 'practice',
      difficulty: 'medium',
      description: 'CTO: «Клиенты должны получать пуши на каждом этапе: заказ принят, готовится, курьер забрал, курьер рядом, доставлено. Это снижает anxiety и количество звонков в поддержку на 40%. Шаблоны должны содержать детали заказа.»',
      requirements: [
        'Enum OrderStatus: ACCEPTED, PREPARING, COURIER_ASSIGNED, PICKED_UP, NEARBY, DELIVERED',
        'Record OrderInfo(int orderId, String restaurantName, String courierName, String customerName, double distanceKm)',
        'Record Notification(String title, String body, String channel)',
        'Метод generateNotification(OrderStatus, OrderInfo) — генерирует уведомление по шаблону',
        'NEARBY — когда расстояние <= 0.5 км',
        'Channel: PUSH для всех, + SMS для DELIVERED',
        'Провести заказ через все статусы и вывести уведомления'
      ],
      expectedOutput: '📱 Уведомления для заказа #301\n\n[PUSH] ✅ Заказ принят!\n  Ресторан \"Sultan\" принял ваш заказ #301. Ожидайте обновления.\n\n[PUSH] 🍳 Готовим!\n  Ресторан \"Sultan\" готовит ваш заказ #301.\n\n[PUSH] 🛵 Курьер назначен!\n  Курьер Алексей забирает ваш заказ из \"Sultan\".\n\n[PUSH] 📦 Заказ забран!\n  Алексей забрал ваш заказ #301 и едет к вам.\n\n[PUSH] 📍 Курьер рядом!\n  Алексей в 0.3 км от вас. Выходите встречать!\n\n[PUSH+SMS] 🎉 Доставлено!\n  Заказ #301 доставлен. Спасибо, Айгерим! Оцените доставку.',
      hint: 'Switch expression по OrderStatus. Каждый case возвращает new Notification() с нужным шаблоном. String.format для подстановки данных из OrderInfo.',
      solution: `public class Main {
    enum OrderStatus {
        ACCEPTED, PREPARING, COURIER_ASSIGNED, PICKED_UP, NEARBY, DELIVERED
    }

    record OrderInfo(int orderId, String restaurantName, String courierName,
                     String customerName, double distanceKm) {}

    record Notification(String title, String body, String channel) {}

    static Notification generateNotification(OrderStatus status, OrderInfo info) {
        return switch (status) {
            case ACCEPTED -> new Notification(
                "✅ Заказ принят!",
                String.format("Ресторан \\"%s\\" принял ваш заказ #%d. Ожидайте обновления.",
                    info.restaurantName(), info.orderId()),
                "PUSH");
            case PREPARING -> new Notification(
                "🍳 Готовим!",
                String.format("Ресторан \\"%s\\" готовит ваш заказ #%d.",
                    info.restaurantName(), info.orderId()),
                "PUSH");
            case COURIER_ASSIGNED -> new Notification(
                "🛵 Курьер назначен!",
                String.format("Курьер %s забирает ваш заказ из \\"%s\\".",
                    info.courierName(), info.restaurantName()),
                "PUSH");
            case PICKED_UP -> new Notification(
                "📦 Заказ забран!",
                String.format("%s забрал ваш заказ #%d и едет к вам.",
                    info.courierName(), info.orderId()),
                "PUSH");
            case NEARBY -> new Notification(
                "📍 Курьер рядом!",
                String.format("%s в %.1f км от вас. Выходите встречать!",
                    info.courierName(), info.distanceKm()),
                "PUSH");
            case DELIVERED -> new Notification(
                "🎉 Доставлено!",
                String.format("Заказ #%d доставлен. Спасибо, %s! Оцените доставку.",
                    info.orderId(), info.customerName()),
                "PUSH+SMS");
        };
    }

    public static void main(String[] args) {
        OrderInfo info = new OrderInfo(301, "Sultan", "Алексей", "Айгерим", 0.3);

        System.out.println("📱 Уведомления для заказа #" + info.orderId());

        for (OrderStatus status : OrderStatus.values()) {
            Notification n = generateNotification(status, info);
            System.out.printf("%n[%s] %s%n  %s%n", n.channel(), n.title(), n.body());
        }
    }
}`,
      explanation: 'Push-уведомления — критическая часть UX в delivery-приложениях. Glovo отправляет 5-7 уведомлений за один заказ. Яндекс Еда использует Firebase Cloud Messaging (FCM) для Android и APNs для iOS. Uber Eats добавляет SMS как fallback для финального уведомления о доставке. В backend уведомления обычно отправляются через event-driven архитектуру: OrderStatusChanged event → NotificationService → FCM/APNs/SMS gateway. Wolt показывает live-activity на iPhone с прогрессом доставки.'
    },
    {
      id: 6,
      title: 'Delivery Fee Calculator: Стоимость доставки',
      type: 'practice',
      difficulty: 'medium',
      description: 'PM: «Финансисты просят динамическое ценообразование доставки. Базовая стоимость зависит от расстояния, но в дождь наценка +30%, в час-пик surge x1.5, а для заказов от 5000 KZT — бесплатно. Клиент должен видеть полную разбивку стоимости.»',
      requirements: [
        'Базовая ставка: первые 2 км бесплатно, далее 150 KZT/км',
        'Surge pricing: 7-9 и 17-20 часов — x1.5',
        'Погода: CLEAR=x1.0, RAIN=x1.3, SNOW=x1.5',
        'Если сумма заказа >= 5000 — доставка бесплатно',
        'Минимальная стоимость доставки: 400 KZT (если не бесплатно)',
        'Record DeliveryFee(int baseFee, int surgeFee, int weatherFee, int discount, int totalFee, boolean isFree)',
        'Вывести разбивку стоимости для 3 разных заказов'
      ],
      expectedOutput: '🧾 Расчёт доставки заказа #1\n  Расстояние: 5.0 км\n  Базовая: 450 KZT (3.0 км × 150)\n  Surge (час-пик): +225 KZT (x1.5)\n  Погода (RAIN): +203 KZT (x1.3)\n  Итого: 878 KZT\n\n🧾 Расчёт доставки заказа #2\n  Расстояние: 1.5 км\n  Базовая: 0 KZT (в пределах 2 км)\n  Мин. стоимость: 400 KZT\n  Итого: 400 KZT\n\n🧾 Расчёт доставки заказа #3\n  Расстояние: 7.0 км\n  Сумма заказа >= 5000 KZT — БЕСПЛАТНАЯ ДОСТАВКА!\n  Итого: 0 KZT',
      hint: 'Считай по шагам: base = max(0, (distance - 2)) * 150. Затем surge = base * 0.5 если час-пик. Затем weather = (base + surge) * weatherMultiplier. Потом проверь минимум и бесплатный порог.',
      solution: `public class Main {
    enum Weather { CLEAR, RAIN, SNOW }

    record DeliveryFee(int baseFee, int surgeFee, int weatherFee,
                       int totalFee, boolean isFree) {}

    static double getWeatherMultiplier(Weather w) {
        return switch (w) {
            case CLEAR -> 1.0;
            case RAIN -> 1.3;
            case SNOW -> 1.5;
        };
    }

    static boolean isSurgeHour(int hour) {
        return (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20);
    }

    static DeliveryFee calculateFee(double distanceKm, int hour,
                                     Weather weather, int orderAmountKzt) {
        if (orderAmountKzt >= 5000) {
            return new DeliveryFee(0, 0, 0, 0, true);
        }

        int baseFee = (int) (Math.max(0, distanceKm - 2.0) * 150);
        int surgeFee = isSurgeHour(hour) ? (int) (baseFee * 0.5) : 0;
        double wm = getWeatherMultiplier(weather);
        int weatherFee = wm > 1.0 ? (int) ((baseFee + surgeFee) * (wm - 1.0)) : 0;

        int total = baseFee + surgeFee + weatherFee;
        if (total > 0 && total < 400) total = 400;
        if (total == 0 && distanceKm <= 2.0) total = 400;

        return new DeliveryFee(baseFee, surgeFee, weatherFee, total, false);
    }

    static void printFeeBreakdown(int orderNum, double distance, int hour,
                                   Weather weather, int orderAmount) {
        DeliveryFee fee = calculateFee(distance, hour, weather, orderAmount);
        System.out.println("🧾 Расчёт доставки заказа #" + orderNum);
        System.out.printf("  Расстояние: %.1f км%n", distance);

        if (fee.isFree()) {
            System.out.println("  Сумма заказа >= 5000 KZT — БЕСПЛАТНАЯ ДОСТАВКА!");
        } else if (fee.baseFee() > 0) {
            System.out.printf("  Базовая: %d KZT (%.1f км × 150)%n",
                fee.baseFee(), Math.max(0, distance - 2.0));
            if (fee.surgeFee() > 0)
                System.out.printf("  Surge (час-пик): +%d KZT (x1.5)%n", fee.surgeFee());
            if (fee.weatherFee() > 0)
                System.out.printf("  Погода (%s): +%d KZT (x%.1f)%n",
                    weather, fee.weatherFee(), getWeatherMultiplier(weather));
        } else {
            System.out.println("  Базовая: 0 KZT (в пределах 2 км)");
            System.out.println("  Мин. стоимость: 400 KZT");
        }

        System.out.printf("  Итого: %d KZT%n", fee.totalFee());
    }

    public static void main(String[] args) {
        printFeeBreakdown(1, 5.0, 18, Weather.RAIN, 3200);
        System.out.println();
        printFeeBreakdown(2, 1.5, 11, Weather.CLEAR, 2000);
        System.out.println();
        printFeeBreakdown(3, 7.0, 14, Weather.CLEAR, 5500);
    }
}`,
      explanation: 'Динамическое ценообразование — стандарт в delivery. Яндекс Еда использует surge pricing в зависимости от спроса/предложения в конкретном районе. Glovo показывает "повышенный спрос" и увеличивает стоимость доставки в 1.5-2 раза. Uber Eats использует ML-модель, учитывающую: расстояние, время суток, погоду, количество свободных курьеров, историю заказов пользователя. Wolt предлагает бесплатную доставку от определённой суммы (как в нашей задаче) — это увеличивает средний чек на 25-35%.'
    },
    {
      id: 7,
      title: 'Courier Earnings: Заработок курьера',
      type: 'practice',
      difficulty: 'medium',
      description: 'CTO: «Курьеры спрашивают — сколько мы заработали сегодня? Нужен отчёт: базовая ставка за заказ, бонус за расстояние, доплата в час-пик, чаевые, штрафы за опоздание. Всё прозрачно — курьер должен видеть каждую строку.»',
      requirements: [
        'Enum Vehicle: BICYCLE(300), SCOOTER(400), CAR(500) — базовая ставка за заказ в KZT',
        'Record Delivery(int orderId, double distanceKm, int hour, int tipKzt, boolean isLate)',
        'Бонус за расстояние: 50 KZT/км',
        'Час-пик (12-14, 18-21): +40% к базовой ставке',
        'Штраф за опоздание: -200 KZT',
        'Метод calculateDailyEarnings(Vehicle, List<Delivery>) — расчёт дневного заработка',
        'Вывести детальный отчёт по каждой доставке и итого'
      ],
      expectedOutput: '💰 Дневной отчёт курьера: Данияр (SCOOTER)\n════════════════════════════════════════\n#201 | База: 400 | Дист: +150 (3.0 км) | Пик: +160 | Чай: 300 | Штраф: 0 | = 1010 KZT\n#202 | База: 400 | Дист: +100 (2.0 км) | Пик: 0 | Чай: 0 | Штраф: -200 | = 300 KZT\n#203 | База: 400 | Дист: +250 (5.0 км) | Пик: +160 | Чай: 500 | Штраф: 0 | = 1310 KZT\n#204 | База: 400 | Дист: +75 (1.5 км) | Пик: 0 | Чай: 200 | Штраф: 0 | = 675 KZT\n════════════════════════════════════════\n📊 Итого за день:\n  Заказов: 4\n  Базовая: 1600 KZT\n  Дистанция: 575 KZT\n  Час-пик: 320 KZT\n  Чаевые: 1000 KZT\n  Штрафы: -200 KZT\n  ИТОГО: 3295 KZT',
      hint: 'Для каждой доставки: base = vehicle.baseRate, distBonus = distance * 50, peakBonus = isPeakHour ? base * 0.4 : 0, penalty = isLate ? -200 : 0. Суммируй по категориям для итого.',
      solution: `import java.util.*;

public class Main {
    enum Vehicle {
        BICYCLE(300), SCOOTER(400), CAR(500);
        final int baseRate;
        Vehicle(int r) { this.baseRate = r; }
    }

    record Delivery(int orderId, double distanceKm, int hour,
                    int tipKzt, boolean isLate) {}

    static boolean isPeakHour(int hour) {
        return (hour >= 12 && hour <= 14) || (hour >= 18 && hour <= 21);
    }

    public static void main(String[] args) {
        String courierName = "Данияр";
        Vehicle vehicle = Vehicle.SCOOTER;

        List<Delivery> deliveries = List.of(
            new Delivery(201, 3.0, 13, 300, false),
            new Delivery(202, 2.0, 10, 0, true),
            new Delivery(203, 5.0, 19, 500, false),
            new Delivery(204, 1.5, 16, 200, false)
        );

        System.out.printf("💰 Дневной отчёт курьера: %s (%s)%n", courierName, vehicle);
        System.out.println("════════════════════════════════════════");

        int totalBase = 0, totalDist = 0, totalPeak = 0, totalTips = 0, totalPenalty = 0;

        for (Delivery d : deliveries) {
            int base = vehicle.baseRate;
            int distBonus = (int) (d.distanceKm() * 50);
            int peakBonus = isPeakHour(d.hour()) ? (int) (base * 0.4) : 0;
            int penalty = d.isLate() ? -200 : 0;
            int total = base + distBonus + peakBonus + d.tipKzt() + penalty;

            totalBase += base;
            totalDist += distBonus;
            totalPeak += peakBonus;
            totalTips += d.tipKzt();
            totalPenalty += penalty;

            System.out.printf("#%d | База: %d | Дист: +%d (%.1f км) | Пик: %s | Чай: %d | Штраф: %d | = %d KZT%n",
                d.orderId(), base, distBonus, d.distanceKm(),
                peakBonus > 0 ? "+" + peakBonus : "0",
                d.tipKzt(), penalty, total);
        }

        int grandTotal = totalBase + totalDist + totalPeak + totalTips + totalPenalty;

        System.out.println("════════════════════════════════════════");
        System.out.println("📊 Итого за день:");
        System.out.println("  Заказов: " + deliveries.size());
        System.out.println("  Базовая: " + totalBase + " KZT");
        System.out.println("  Дистанция: " + totalDist + " KZT");
        System.out.println("  Час-пик: " + totalPeak + " KZT");
        System.out.println("  Чаевые: " + totalTips + " KZT");
        System.out.println("  Штрафы: " + totalPenalty + " KZT");
        System.out.println("  ИТОГО: " + grandTotal + " KZT");
    }
}`,
      explanation: 'В Glovo курьеры видят заработок в реальном времени в приложении. Яндекс Еда платит: фиксированная ставка за заказ + бонус за расстояние + surge. Uber Eats использует динамическую ставку: Boost zones (районы с повышенным спросом) дают +1.1x-2.0x. Wolt показывает earning breakdown после каждой доставки. Прозрачность заработка — ключевой фактор удержания курьеров. В реальности формулы сложнее: учитывается время ожидания в ресторане, batch-заказы (два заказа за одну поездку), квесты (сделай 10 заказов — получи бонус 5000 KZT).'
    },
    {
      id: 8,
      title: 'Rating System: Оценка после доставки',
      type: 'practice',
      difficulty: 'medium',
      description: 'PM: «После каждой доставки клиент ставит оценки: еда, скорость, доставка. Нужна система рейтинга с weighted moving average по последним 100 оценкам. Рейтинг влияет на приоритет назначения заказов — курьеры с рейтингом ниже 4.0 не получают заказы в час-пик.»',
      requirements: [
        'Record Rating(int foodScore, int deliveryScore, int speedScore) — оценки 1-5',
        'Класс CourierRating: name, List<Double> recentScores (макс 100), текущий средний',
        'Класс RestaurantRating: name, List<Double> recentScores (макс 100), текущий средний',
        'Метод addRating — добавляет оценку и пересчитывает среднее (если > 100 — удалить старую)',
        'Средний балл курьера = (deliveryScore + speedScore) / 2.0',
        'Средний балл ресторана = foodScore',
        'Вывести рейтинг до и после новых оценок'
      ],
      expectedOutput: '⭐ Система рейтинга QuickBite\n\n📊 ДО новых оценок:\n  Курьер Алексей: 4.50 (20 оценок)\n  Ресторан Sultan: 4.30 (20 оценок)\n\n📝 Новые оценки:\n  Заказ #1: еда=5, доставка=5, скорость=4 → курьер: 4.5, ресторан: 5.0\n  Заказ #2: еда=3, доставка=4, скорость=3 → курьер: 3.5, ресторан: 3.0\n  Заказ #3: еда=5, доставка=5, скорость=5 → курьер: 5.0, ресторан: 5.0\n\n📊 ПОСЛЕ новых оценок:\n  Курьер Алексей: 4.50 → 4.50 (23 оценок)\n  Ресторан Sultan: 4.30 → 4.33 (23 оценок)',
      hint: 'Используй LinkedList — при добавлении нового элемента, если size > 100, удали первый (removeFirst). Среднее пересчитывай через stream().mapToDouble().average().',
      solution: `import java.util.*;

public class Main {
    record Rating(int foodScore, int deliveryScore, int speedScore) {}

    static class EntityRating {
        String name;
        LinkedList<Double> recentScores = new LinkedList<>();
        static final int MAX_HISTORY = 100;

        EntityRating(String name) { this.name = name; }

        void addScore(double score) {
            recentScores.add(score);
            if (recentScores.size() > MAX_HISTORY) {
                recentScores.removeFirst();
            }
        }

        double getAverage() {
            return recentScores.stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);
        }

        int getCount() { return recentScores.size(); }
    }

    static void seedRatings(EntityRating entity, double baseRating, int count) {
        Random rnd = new Random(42);
        for (int i = 0; i < count; i++) {
            double score = baseRating + (rnd.nextDouble() - 0.5) * 0.6;
            score = Math.max(1, Math.min(5, score));
            entity.addScore(score);
        }
    }

    public static void main(String[] args) {
        EntityRating courierRating = new EntityRating("Курьер Алексей");
        EntityRating restaurantRating = new EntityRating("Ресторан Sultan");

        seedRatings(courierRating, 4.5, 20);
        seedRatings(restaurantRating, 4.3, 20);

        System.out.println("⭐ Система рейтинга QuickBite");
        System.out.println("\\n📊 ДО новых оценок:");
        System.out.printf("  %s: %.2f (%d оценок)%n",
            courierRating.name, courierRating.getAverage(), courierRating.getCount());
        System.out.printf("  %s: %.2f (%d оценок)%n",
            restaurantRating.name, restaurantRating.getAverage(), restaurantRating.getCount());

        double oldCourier = courierRating.getAverage();
        double oldRestaurant = restaurantRating.getAverage();

        List<Rating> newRatings = List.of(
            new Rating(5, 5, 4),
            new Rating(3, 4, 3),
            new Rating(5, 5, 5)
        );

        System.out.println("\\n📝 Новые оценки:");
        int orderNum = 1;
        for (Rating r : newRatings) {
            double courierScore = (r.deliveryScore() + r.speedScore()) / 2.0;
            double restaurantScore = r.foodScore();

            courierRating.addScore(courierScore);
            restaurantRating.addScore(restaurantScore);

            System.out.printf("  Заказ #%d: еда=%d, доставка=%d, скорость=%d → курьер: %.1f, ресторан: %.1f%n",
                orderNum++, r.foodScore(), r.deliveryScore(), r.speedScore(),
                courierScore, restaurantScore);
        }

        System.out.println("\\n📊 ПОСЛЕ новых оценок:");
        System.out.printf("  %s: %.2f → %.2f (%d оценок)%n",
            courierRating.name, oldCourier, courierRating.getAverage(), courierRating.getCount());
        System.out.printf("  %s: %.2f → %.2f (%d оценок)%n",
            restaurantRating.name, oldRestaurant, restaurantRating.getAverage(), restaurantRating.getCount());
    }
}`,
      explanation: 'В Яндекс Еде рейтинг курьера — weighted moving average последних 100 заказов. Курьеры с рейтингом ниже 4.0 попадают в «жёлтую зону» и не получают заказы в час-пик. Glovo использует отдельные рейтинги для курьера и ресторана. Uber Eats показывает три оценки: food quality, delivery, speed. Wolt учитывает "thumbs up/down" вместо 5-балльной шкалы для упрощения UX. В production рейтинг хранится в Redis для быстрого доступа при назначении заказов.'
    },
    {
      id: 9,
      title: 'Incident Handling: Проблемы с заказом',
      type: 'practice',
      difficulty: 'hard',
      description: 'Team Lead: «Не все доставки проходят гладко. Еда может быть повреждена, заказ перепутан, курьер опоздал. Нужна система обработки инцидентов: каждый тип проблемы → свой flow решения (возврат, передоставка, промокод). Рассчитать сумму компенсации автоматически.»',
      requirements: [
        'Enum IncidentType: FOOD_DAMAGED, WRONG_ORDER, LATE_DELIVERY, COURIER_UNREACHABLE',
        'Enum Resolution: FULL_REFUND, PARTIAL_REFUND, REDELIVERY, PROMO_CODE',
        'Record Incident(int orderId, IncidentType type, int orderAmountKzt)',
        'Record ResolutionResult(Resolution resolution, int refundAmount, String promoCode, String message)',
        'FOOD_DAMAGED → FULL_REFUND (100%)',
        'WRONG_ORDER → REDELIVERY + PROMO_CODE (15% от заказа на следующий)',
        'LATE_DELIVERY → PARTIAL_REFUND (30% если > 15 мин, 50% если > 30 мин)',
        'COURIER_UNREACHABLE → FULL_REFUND + PROMO_CODE (500 KZT)',
        'Метод resolveIncident(Incident, int lateMinutes) — определяет решение',
        'Вывести обработку 4 инцидентов'
      ],
      expectedOutput: '🚨 Система обработки инцидентов QuickBite\n\n--- Инцидент: заказ #401 ---\nТип: FOOD_DAMAGED\nСумма заказа: 3500 KZT\nРешение: FULL_REFUND\nВозврат: 3500 KZT\nСообщение: Приносим извинения! Полный возврат 3500 KZT на карту в течение 24 часов.\n\n--- Инцидент: заказ #402 ---\nТип: WRONG_ORDER\nСумма заказа: 4200 KZT\nРешение: REDELIVERY + PROMO_CODE\nПромокод: SORRY-402 на 630 KZT\nСообщение: Курьер уже едет с правильным заказом! Бонус: промокод SORRY-402 на 630 KZT.\n\n--- Инцидент: заказ #403 ---\nТип: LATE_DELIVERY (опоздание: 25 мин)\nСумма заказа: 2800 KZT\nРешение: PARTIAL_REFUND (30%)\nВозврат: 840 KZT\nСообщение: Извините за ожидание! Возврат 840 KZT (30%) за опоздание на 25 мин.\n\n--- Инцидент: заказ #404 ---\nТип: COURIER_UNREACHABLE\nСумма заказа: 5100 KZT\nРешение: FULL_REFUND + PROMO_CODE\nВозврат: 5100 KZT\nПромокод: SORRY-404 на 500 KZT\nСообщение: Курьер не выходит на связь. Полный возврат 5100 KZT + промокод SORRY-404 на 500 KZT.',
      hint: 'Switch expression по IncidentType. Для LATE_DELIVERY используй lateMinutes для определения процента возврата. Промокод формируй как "SORRY-" + orderId.',
      solution: `public class Main {
    enum IncidentType { FOOD_DAMAGED, WRONG_ORDER, LATE_DELIVERY, COURIER_UNREACHABLE }
    enum Resolution { FULL_REFUND, PARTIAL_REFUND, REDELIVERY, PROMO_CODE }

    record Incident(int orderId, IncidentType type, int orderAmountKzt) {}
    record ResolutionResult(String resolution, int refundAmount,
                            String promoCode, int promoAmount, String message) {}

    static ResolutionResult resolveIncident(Incident inc, int lateMinutes) {
        return switch (inc.type()) {
            case FOOD_DAMAGED -> new ResolutionResult(
                "FULL_REFUND",
                inc.orderAmountKzt(),
                null, 0,
                String.format("Приносим извинения! Полный возврат %d KZT на карту в течение 24 часов.",
                    inc.orderAmountKzt()));

            case WRONG_ORDER -> {
                int promoAmount = (int) (inc.orderAmountKzt() * 0.15);
                String promo = "SORRY-" + inc.orderId();
                yield new ResolutionResult(
                    "REDELIVERY + PROMO_CODE",
                    0, promo, promoAmount,
                    String.format("Курьер уже едет с правильным заказом! Бонус: промокод %s на %d KZT.",
                        promo, promoAmount));
            }

            case LATE_DELIVERY -> {
                int percent = lateMinutes > 30 ? 50 : 30;
                int refund = (int) (inc.orderAmountKzt() * percent / 100.0);
                yield new ResolutionResult(
                    String.format("PARTIAL_REFUND (%d%%)", percent),
                    refund, null, 0,
                    String.format("Извините за ожидание! Возврат %d KZT (%d%%) за опоздание на %d мин.",
                        refund, percent, lateMinutes));
            }

            case COURIER_UNREACHABLE -> {
                String promo = "SORRY-" + inc.orderId();
                yield new ResolutionResult(
                    "FULL_REFUND + PROMO_CODE",
                    inc.orderAmountKzt(),
                    promo, 500,
                    String.format("Курьер не выходит на связь. Полный возврат %d KZT + промокод %s на 500 KZT.",
                        inc.orderAmountKzt(), promo));
            }
        };
    }

    static void printIncident(Incident inc, int lateMinutes) {
        ResolutionResult res = resolveIncident(inc, lateMinutes);

        System.out.println("--- Инцидент: заказ #" + inc.orderId() + " ---");
        String typeLabel = inc.type().name();
        if (inc.type() == IncidentType.LATE_DELIVERY) {
            typeLabel += " (опоздание: " + lateMinutes + " мин)";
        }
        System.out.println("Тип: " + typeLabel);
        System.out.println("Сумма заказа: " + inc.orderAmountKzt() + " KZT");
        System.out.println("Решение: " + res.resolution());
        if (res.refundAmount() > 0) {
            System.out.println("Возврат: " + res.refundAmount() + " KZT");
        }
        if (res.promoCode() != null) {
            System.out.println("Промокод: " + res.promoCode() + " на " + res.promoAmount() + " KZT");
        }
        System.out.println("Сообщение: " + res.message());
    }

    public static void main(String[] args) {
        System.out.println("🚨 Система обработки инцидентов QuickBite");

        var incidents = java.util.List.of(
            new Incident(401, IncidentType.FOOD_DAMAGED, 3500),
            new Incident(402, IncidentType.WRONG_ORDER, 4200),
            new Incident(403, IncidentType.LATE_DELIVERY, 2800),
            new Incident(404, IncidentType.COURIER_UNREACHABLE, 5100)
        );
        int[] lateMinutes = {0, 0, 25, 0};

        for (int i = 0; i < incidents.size(); i++) {
            System.out.println();
            printIncident(incidents.get(i), lateMinutes[i]);
        }
    }
}`,
      explanation: 'В Glovo инциденты обрабатываются через тикет-систему с автоматическими правилами. Яндекс Еда использует decision tree: тип проблемы → фото подтверждение → автоматический или ручной рефанд. Uber Eats автоматически одобряет рефанды до определённой суммы ($15) без вмешательства саппорта. Wolt даёт credits (внутреннюю валюту) вместо реального возврата — это дешевле для компании и увеличивает retention. В production anti-fraud система отслеживает пользователей, которые слишком часто жалуются на "повреждённую еду".'
    },
    {
      id: 10,
      title: 'Daily Analytics: Дашборд менеджера',
      type: 'practice',
      difficulty: 'hard',
      description: 'CTO: «Sprint 2 почти закончен! Последняя задача — дашборд для операционного менеджера. Агрегировать дневную статистику: сколько заказов, выручка, среднее время, рейтинг, топ ресторанов и курьеров, час-пик, процент отмен. Это наш command center.»',
      requirements: [
        'Record CompletedOrder(int id, String restaurant, String courier, int amountKzt, int deliveryMinutes, double rating, int hour, boolean cancelled)',
        'Агрегировать: общее количество, выручка, среднее время доставки, средний рейтинг',
        'Топ-3 ресторана по количеству заказов',
        'Топ-3 курьера по количеству доставок',
        'Час-пик (час с максимумом заказов)',
        'Процент отменённых заказов',
        'Вывести форматированный дашборд'
      ],
      expectedOutput: '╔══════════════════════════════════════╗\n║    📊 QuickBite Daily Dashboard      ║\n║         2026-04-07 (Алматы)          ║\n╠══════════════════════════════════════╣\n║ Всего заказов:        12             ║\n║ Выполнено:            10             ║\n║ Отменено:             2 (16.7%)      ║\n║ Выручка:              38500 KZT      ║\n║ Ср. время доставки:   28 мин         ║\n║ Ср. рейтинг:          4.4 ⭐         ║\n╠══════════════════════════════════════╣\n║ 🏆 Топ-3 ресторана:                  ║\n║   1. Sultan — 4 заказа               ║\n║   2. Pizza Hit — 3 заказа            ║\n║   3. Bao House — 3 заказа            ║\n╠══════════════════════════════════════╣\n║ 🚴 Топ-3 курьера:                    ║\n║   1. Алексей — 4 доставки            ║\n║   2. Данияр — 3 доставки             ║\n║   3. Марат — 3 доставки              ║\n╠══════════════════════════════════════╣\n║ ⏰ Час-пик: 13:00 (4 заказа)         ║\n╚══════════════════════════════════════╝',
      hint: 'Stream API + Collectors.groupingBy для группировки по ресторану/курьеру/часу. Collectors.counting() для подсчёта. Сортировка Map.Entry по value в обратном порядке.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record CompletedOrder(int id, String restaurant, String courier,
                          int amountKzt, int deliveryMinutes,
                          double rating, int hour, boolean cancelled) {}

    public static void main(String[] args) {
        List<CompletedOrder> orders = List.of(
            new CompletedOrder(1, "Sultan", "Алексей", 3500, 25, 4.5, 12, false),
            new CompletedOrder(2, "Pizza Hit", "Данияр", 4200, 30, 4.0, 12, false),
            new CompletedOrder(3, "Sultan", "Марат", 2800, 35, 4.8, 13, false),
            new CompletedOrder(4, "Bao House", "Алексей", 3100, 22, 4.2, 13, false),
            new CompletedOrder(5, "Sultan", "Данияр", 5100, 28, 4.5, 13, false),
            new CompletedOrder(6, "Pizza Hit", "Алексей", 2900, 40, 3.5, 14, false),
            new CompletedOrder(7, "Bao House", "Марат", 4500, 20, 5.0, 18, false),
            new CompletedOrder(8, "Sultan", "Алексей", 3800, 32, 4.7, 19, false),
            new CompletedOrder(9, "Pizza Hit", "Данияр", 3200, 25, 4.3, 13, false),
            new CompletedOrder(10, "Bao House", "Марат", 5400, 23, 4.6, 19, false),
            new CompletedOrder(11, "Sultan", "Данияр", 0, 0, 0, 11, true),
            new CompletedOrder(12, "Pizza Hit", "Марат", 0, 0, 0, 15, true)
        );

        int totalOrders = orders.size();
        List<CompletedOrder> completed = orders.stream()
            .filter(o -> !o.cancelled()).collect(Collectors.toList());
        List<CompletedOrder> cancelled = orders.stream()
            .filter(CompletedOrder::cancelled).collect(Collectors.toList());

        int revenue = completed.stream().mapToInt(CompletedOrder::amountKzt).sum();
        int avgTime = (int) completed.stream()
            .mapToInt(CompletedOrder::deliveryMinutes).average().orElse(0);
        double avgRating = completed.stream()
            .mapToDouble(CompletedOrder::rating).average().orElse(0);
        double cancelRate = (cancelled.size() * 100.0) / totalOrders;

        // Топ-3 ресторана
        List<Map.Entry<String, Long>> topRestaurants = orders.stream()
            .collect(Collectors.groupingBy(CompletedOrder::restaurant, Collectors.counting()))
            .entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(3)
            .collect(Collectors.toList());

        // Топ-3 курьера (только выполненные)
        List<Map.Entry<String, Long>> topCouriers = completed.stream()
            .collect(Collectors.groupingBy(CompletedOrder::courier, Collectors.counting()))
            .entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(3)
            .collect(Collectors.toList());

        // Час-пик
        Map.Entry<Integer, Long> peakHour = orders.stream()
            .collect(Collectors.groupingBy(CompletedOrder::hour, Collectors.counting()))
            .entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .orElseThrow();

        // Дашборд
        System.out.println("╔══════════════════════════════════════╗");
        System.out.println("║    📊 QuickBite Daily Dashboard      ║");
        System.out.println("║         2026-04-07 (Алматы)          ║");
        System.out.println("╠══════════════════════════════════════╣");
        System.out.printf("║ Всего заказов:        %-15s║%n", totalOrders);
        System.out.printf("║ Выполнено:            %-15s║%n", completed.size());
        System.out.printf("║ Отменено:             %d (%.1f%%)%s║%n",
            cancelled.size(), cancelRate,
            cancelRate < 10 ? "      " : "      ");
        System.out.printf("║ Выручка:              %-15s║%n", revenue + " KZT");
        System.out.printf("║ Ср. время доставки:   %-15s║%n", avgTime + " мин");
        System.out.printf("║ Ср. рейтинг:          %.1f ⭐%s║%n",
            avgRating, "         ");
        System.out.println("╠══════════════════════════════════════╣");
        System.out.println("║ 🏆 Топ-3 ресторана:                  ║");
        for (int i = 0; i < topRestaurants.size(); i++) {
            var e = topRestaurants.get(i);
            String line = String.format("  %d. %s — %d заказа",
                i + 1, e.getKey(), e.getValue());
            System.out.printf("║ %-37s║%n", line);
        }
        System.out.println("╠══════════════════════════════════════╣");
        System.out.println("║ 🚴 Топ-3 курьера:                    ║");
        for (int i = 0; i < topCouriers.size(); i++) {
            var e = topCouriers.get(i);
            String line = String.format("  %d. %s — %d доставки",
                i + 1, e.getKey(), e.getValue());
            System.out.printf("║ %-37s║%n", line);
        }
        System.out.println("╠══════════════════════════════════════╣");
        System.out.printf("║ ⏰ Час-пик: %d:00 (%d заказа)%s║%n",
            peakHour.getKey(), peakHour.getValue(), "         ");
        System.out.println("╚══════════════════════════════════════╝");
    }
}`,
      explanation: 'Операционные дашборды — must-have для delivery-бизнеса. Яндекс Еда использует Grafana + ClickHouse для real-time аналитики: SLA доставки, heat map заказов по районам, нагрузка на курьеров. Glovo мониторит unit economics: стоимость привлечения клиента, средний чек, маржинальность доставки. Uber Eats отслеживает "unhappy deliveries" (рейтинг < 3) и автоматически эскалирует их. В production дашборд обновляется в реальном времени через WebSocket и показывает live-карту с курьерами.'
    }
  ]
};
