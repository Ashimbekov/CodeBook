export default {
  id: 97,
  title: 'Реальная разработка: Delivery-сервис',
  description: 'Задачи backend-разработчика в delivery-компании: расчёт доставки, очереди заказов, назначение курьеров, трекинг, батчинг и аналитика.',
  lessons: [
    {
      id: 1,
      title: 'Order Pricing — расчёт стоимости доставки',
      type: 'practice',
      difficulty: 'easy',
      description: 'Спринт: Logistics Team. DEL-101: Реализовать калькулятор стоимости доставки. Стоимость складывается из базовой ставки, надбавки за расстояние и вес, а также surge-множителя в часы пик. Формула: (baseFee + distanceKm * 100 + max(0, weightKg - 3) * 150) * surgeMultiplier. Округление до целых тенге.',
      requirements: [
        'Метод calculateDeliveryPrice(double distanceKm, double weightKg, double surgeMultiplier) возвращает long (тенге)',
        'Базовая ставка (baseFee) = 500 KZT',
        'Надбавка за расстояние: distanceKm * 100 KZT',
        'Надбавка за вес: первые 3 кг бесплатно, далее 150 KZT/кг',
        'Surge-множитель применяется ко всей сумме',
        'Результат округлить Math.round()'
      ],
      expectedOutput: '1100\n1500\n2625',
      hint: 'Формула: (500 + distanceKm * 100 + Math.max(0, weightKg - 3) * 150) * surgeMultiplier. Не забудь Math.round() для округления до целых.',
      solution: `public class Main {
    static long calculateDeliveryPrice(double distanceKm, double weightKg, double surgeMultiplier) {
        double baseFee = 500;
        double distanceFee = distanceKm * 100;
        double weightFee = Math.max(0, weightKg - 3) * 150;
        double total = (baseFee + distanceFee + weightFee) * surgeMultiplier;
        return Math.round(total);
    }

    public static void main(String[] args) {
        System.out.println(calculateDeliveryPrice(3.0, 2.0, 1.0));
        System.out.println(calculateDeliveryPrice(5.0, 1.0, 1.5));
        System.out.println(calculateDeliveryPrice(7.0, 5.0, 1.5));
    }
}`,
      explanation: 'В реальных delivery-сервисах (Glovo, Wolt, Yandex Eats) стоимость доставки — динамическая. Базовая ставка покрывает операционные расходы, расстояние — затраты на топливо, вес — нагрузку на курьера. Surge pricing (1.5x–3x) включается в часы пик, плохую погоду или при нехватке курьеров. Yandex Eats и Glovo пересчитывают surge каждые 5 минут на основе спроса и предложения.'
    },
    {
      id: 2,
      title: 'Restaurant Search — поиск ресторанов по радиусу',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Discovery Team. DEL-205: Реализовать поиск ресторанов в заданном радиусе от пользователя. Использовать формулу евклидова расстояния для упрощения. Фильтрация по кухне и минимальному рейтингу. Сортировка по расстоянию.',
      requirements: [
        'Record Restaurant(String name, double lat, double lon, String cuisine, double rating)',
        'Метод searchRestaurants(List<Restaurant>, double userLat, double userLon, double radiusKm, String cuisineFilter, double minRating)',
        'Расстояние = Math.sqrt((lat1-lat2)^2 + (lon1-lon2)^2) * 111 (грубое приближение в км)',
        'Фильтрация: если cuisineFilter != null — по кухне, если minRating > 0 — по рейтингу',
        'Результат сортирован по расстоянию (ближайшие первые)',
        'Вывести: "name (cuisine) - distance km, rating: X.X"'
      ],
      expectedOutput: 'Burger King (fastfood) - 1.1 km, rating: 4.2\nMcDonalds (fastfood) - 2.2 km, rating: 4.0\n---\nSushi Master (japanese) - 3.3 km, rating: 4.8',
      hint: 'Используй record для Restaurant. Stream API с filter, sorted, map для цепочки обработки. Расстояние вычисляй отдельным методом.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Restaurant(String name, double lat, double lon, String cuisine, double rating) {}

    static double distance(double lat1, double lon1, double lat2, double lon2) {
        return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2)) * 111;
    }

    static List<String> searchRestaurants(List<Restaurant> restaurants,
            double userLat, double userLon, double radiusKm,
            String cuisineFilter, double minRating) {
        return restaurants.stream()
                .filter(r -> distance(r.lat(), r.lon(), userLat, userLon) <= radiusKm)
                .filter(r -> cuisineFilter == null || r.cuisine().equals(cuisineFilter))
                .filter(r -> r.rating() >= minRating)
                .sorted(Comparator.comparingDouble(r -> distance(r.lat(), r.lon(), userLat, userLon)))
                .map(r -> String.format("%s (%s) - %.1f km, rating: %.1f",
                        r.name(), r.cuisine(),
                        distance(r.lat(), r.lon(), userLat, userLon), r.rating()))
                .collect(Collectors.toList());
    }

    public static void main(String[] args) {
        List<Restaurant> restaurants = List.of(
            new Restaurant("Burger King", 43.24, 76.95, "fastfood", 4.2),
            new Restaurant("McDonalds", 43.25, 76.97, "fastfood", 4.0),
            new Restaurant("Sushi Master", 43.27, 76.94, "japanese", 4.8),
            new Restaurant("Pizza Hut", 43.30, 77.00, "italian", 3.5),
            new Restaurant("KFC", 43.40, 77.10, "fastfood", 3.9)
        );
        double userLat = 43.23, userLon = 76.94;

        searchRestaurants(restaurants, userLat, userLon, 3.0, "fastfood", 4.0)
                .forEach(System.out::println);
        System.out.println("---");
        searchRestaurants(restaurants, userLat, userLon, 5.0, "japanese", 4.5)
                .forEach(System.out::println);
    }
}`,
      explanation: 'В Glovo и Wolt поиск ресторанов — одна из самых нагруженных операций (тысячи запросов в секунду). В реальности используют geohash-индексы и PostGIS/ElasticSearch для пространственного поиска. Фильтрация по кухне, рейтингу и времени доставки — ключевые параметры. Wolt использует ML-модели для персонализированного ранжирования результатов.'
    },
    {
      id: 3,
      title: 'Order Queue — приоритетная очередь заказов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Order Processing Team. DEL-312: Реализовать приоритетную очередь заказов. VIP-клиенты обрабатываются первыми, внутри одного приоритета — по времени создания (FIFO). Приоритеты: VIP > PREMIUM > REGULAR.',
      requirements: [
        'Record Order(String id, String customer, String priority, long createdAt)',
        'Класс OrderQueue с методами: addOrder(), processNext(), size()',
        'Приоритет: VIP=0, PREMIUM=1, REGULAR=2 (чем меньше — тем раньше)',
        'При одинаковом приоритете — FIFO (по createdAt)',
        'PriorityQueue с кастомным Comparator',
        'processNext() возвращает и удаляет следующий заказ'
      ],
      expectedOutput: 'Очередь: 5 заказов\nОбработка: ORD-3 (VIP-Алексей) VIP\nОбработка: ORD-5 (VIP-Мария) VIP\nОбработка: ORD-2 (Борис) PREMIUM\nОбработка: ORD-1 (Иван) REGULAR\nОбработка: ORD-4 (Серик) REGULAR',
      hint: 'Comparator.comparingInt для приоритета, thenComparingLong для createdAt. Map.of("VIP", 0, "PREMIUM", 1, "REGULAR", 2) для маппинга приоритетов.',
      solution: `import java.util.*;

public class Main {
    record Order(String id, String customer, String priority, long createdAt) {}

    static class OrderQueue {
        private static final Map<String, Integer> PRIORITY_MAP = Map.of(
            "VIP", 0, "PREMIUM", 1, "REGULAR", 2
        );

        private final PriorityQueue<Order> queue = new PriorityQueue<>(
            Comparator.<Order, Integer>comparing(o -> PRIORITY_MAP.get(o.priority()))
                      .thenComparingLong(Order::createdAt)
        );

        void addOrder(Order order) { queue.add(order); }
        Order processNext() { return queue.poll(); }
        int size() { return queue.size(); }
        boolean isEmpty() { return queue.isEmpty(); }
    }

    public static void main(String[] args) {
        OrderQueue oq = new OrderQueue();
        oq.addOrder(new Order("ORD-1", "Иван", "REGULAR", 1000));
        oq.addOrder(new Order("ORD-2", "Борис", "PREMIUM", 1001));
        oq.addOrder(new Order("ORD-3", "VIP-Алексей", "VIP", 1002));
        oq.addOrder(new Order("ORD-4", "Серик", "REGULAR", 1003));
        oq.addOrder(new Order("ORD-5", "VIP-Мария", "VIP", 1004));

        System.out.println("Очередь: " + oq.size() + " заказов");
        while (!oq.isEmpty()) {
            Order o = oq.processNext();
            System.out.printf("Обработка: %s (%s) %s%n", o.id(), o.customer(), o.priority());
        }
    }
}`,
      explanation: 'В Yandex Eats и Glovo заказы обрабатываются приоритетной очередью. VIP/Plus подписчики получают приоритет в обработке и назначении курьера. В реальности очередь реализована через Apache Kafka с партиционированием по приоритету или Redis Sorted Sets (ZADD с весами). Это критично для SLA — VIP-клиенты должны получать заказ быстрее.'
    },
    {
      id: 4,
      title: 'Delivery Assignment — назначение курьера',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Dispatch Team. DEL-418: Алгоритм назначения курьера на заказ. Выбирать ближайшего свободного курьера с учётом текущей загрузки (не более 3 активных заказов). Если все заняты — вернуть null.',
      requirements: [
        'Record Courier(String id, String name, double lat, double lon, int activeOrders, boolean online)',
        'Метод assignCourier(List<Courier>, double restaurantLat, double restaurantLon) → Courier или null',
        'Курьер доступен если: online == true И activeOrders < 3',
        'Из доступных выбрать ближайшего к ресторану',
        'При равном расстоянии — выбрать с меньшим числом активных заказов',
        'Расстояние: евклидово * 111 (км)'
      ],
      expectedOutput: 'Заказ из ресторана (43.25, 76.95):\nНазначен: Серик (1.1 км, загрузка: 0)\n---\nЗаказ из ресторана (43.30, 77.00):\nНазначен: Борис (2.2 км, загрузка: 2)\n---\nВсе курьеры заняты: null',
      hint: 'Stream API: filter(online && activeOrders < 3), sorted по расстоянию, затем по activeOrders. findFirst() для Optional.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Courier(String id, String name, double lat, double lon, int activeOrders, boolean online) {}

    static double distance(double lat1, double lon1, double lat2, double lon2) {
        return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2)) * 111;
    }

    static Courier assignCourier(List<Courier> couriers, double rLat, double rLon) {
        return couriers.stream()
                .filter(c -> c.online() && c.activeOrders() < 3)
                .sorted(Comparator.<Courier, Double>comparing(c -> distance(c.lat(), c.lon(), rLat, rLon))
                        .thenComparingInt(Courier::activeOrders))
                .findFirst()
                .orElse(null);
    }

    public static void main(String[] args) {
        List<Courier> couriers = List.of(
            new Courier("C-1", "Серик", 43.24, 76.94, 0, true),
            new Courier("C-2", "Борис", 43.28, 76.98, 2, true),
            new Courier("C-3", "Алмас", 43.22, 76.90, 3, true),
            new Courier("C-4", "Дима", 43.26, 76.96, 1, false)
        );

        System.out.println("Заказ из ресторана (43.25, 76.95):");
        Courier c1 = assignCourier(couriers, 43.25, 76.95);
        System.out.printf("Назначен: %s (%.1f км, загрузка: %d)%n",
                c1.name(), distance(c1.lat(), c1.lon(), 43.25, 76.95), c1.activeOrders());

        System.out.println("---");
        System.out.println("Заказ из ресторана (43.30, 77.00):");
        Courier c2 = assignCourier(couriers, 43.30, 77.00);
        System.out.printf("Назначен: %s (%.1f км, загрузка: %d)%n",
                c2.name(), distance(c2.lat(), c2.lon(), 43.30, 77.00), c2.activeOrders());

        System.out.println("---");
        List<Courier> allBusy = List.of(
            new Courier("C-1", "Серик", 43.24, 76.94, 3, true),
            new Courier("C-2", "Борис", 43.28, 76.98, 3, true)
        );
        System.out.println("Все курьеры заняты: " + assignCourier(allBusy, 43.25, 76.95));
    }
}`,
      explanation: 'Назначение курьера (dispatch) — ядро delivery-платформы. Glovo использует алгоритм «Hungarian» для оптимального матчинга курьер-заказ. Wolt комбинирует расстояние, загрузку и предсказываемое ETA. В Yandex Eats dispatch-сервис обрабатывает тысячи назначений в минуту, балансируя скорость доставки и нагрузку на курьеров. Максимум 3 заказа — реальное ограничение в большинстве сервисов.'
    },
    {
      id: 5,
      title: 'Order Tracking — state machine заказа',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Order Lifecycle Team. DEL-523: Реализовать конечный автомат (state machine) для статусов заказа. Допустимые переходы: PLACED→CONFIRMED→PREPARING→READY→DELIVERING→DELIVERED. Также PLACED/CONFIRMED→CANCELLED. Невалидный переход — выбросить исключение.',
      requirements: [
        'Enum OrderStatus: PLACED, CONFIRMED, PREPARING, READY, DELIVERING, DELIVERED, CANCELLED',
        'Класс OrderTracker: orderId, currentStatus, statusHistory (List)',
        'Метод transition(OrderStatus newStatus) — проверяет допустимость перехода',
        'Map<OrderStatus, Set<OrderStatus>> для хранения допустимых переходов',
        'При невалидном переходе — IllegalStateException с описанием',
        'Метод getHistory() — список всех статусов с временными метками'
      ],
      expectedOutput: 'ORD-777: PLACED\n→ CONFIRMED\n→ PREPARING\n→ READY\n→ DELIVERING\n→ DELIVERED\nИстория: [PLACED, CONFIRMED, PREPARING, READY, DELIVERING, DELIVERED]\n---\nОшибка: Недопустимый переход: PLACED → DELIVERING\nОшибка: Недопустимый переход: DELIVERED → PREPARING',
      hint: 'Map.of() для допустимых переходов. Каждый статус маппится на Set допустимых следующих статусов. transition() проверяет transitions.get(current).contains(newStatus).',
      solution: `import java.util.*;

public class Main {
    enum OrderStatus { PLACED, CONFIRMED, PREPARING, READY, DELIVERING, DELIVERED, CANCELLED }

    static class OrderTracker {
        private final String orderId;
        private OrderStatus currentStatus;
        private final List<OrderStatus> history = new ArrayList<>();

        private static final Map<OrderStatus, Set<OrderStatus>> TRANSITIONS = Map.of(
            OrderStatus.PLACED, Set.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED),
            OrderStatus.CONFIRMED, Set.of(OrderStatus.PREPARING, OrderStatus.CANCELLED),
            OrderStatus.PREPARING, Set.of(OrderStatus.READY),
            OrderStatus.READY, Set.of(OrderStatus.DELIVERING),
            OrderStatus.DELIVERING, Set.of(OrderStatus.DELIVERED),
            OrderStatus.DELIVERED, Set.of(),
            OrderStatus.CANCELLED, Set.of()
        );

        OrderTracker(String orderId) {
            this.orderId = orderId;
            this.currentStatus = OrderStatus.PLACED;
            this.history.add(OrderStatus.PLACED);
        }

        void transition(OrderStatus newStatus) {
            Set<OrderStatus> allowed = TRANSITIONS.get(currentStatus);
            if (!allowed.contains(newStatus)) {
                throw new IllegalStateException(
                    "Недопустимый переход: " + currentStatus + " → " + newStatus);
            }
            currentStatus = newStatus;
            history.add(newStatus);
        }

        OrderStatus getStatus() { return currentStatus; }
        List<OrderStatus> getHistory() { return Collections.unmodifiableList(history); }
    }

    public static void main(String[] args) {
        OrderTracker tracker = new OrderTracker("ORD-777");
        System.out.println("ORD-777: " + tracker.getStatus());

        for (var status : List.of(OrderStatus.CONFIRMED, OrderStatus.PREPARING,
                OrderStatus.READY, OrderStatus.DELIVERING, OrderStatus.DELIVERED)) {
            tracker.transition(status);
            System.out.println("→ " + status);
        }
        System.out.println("История: " + tracker.getHistory());
        System.out.println("---");

        try {
            OrderTracker t2 = new OrderTracker("ORD-778");
            t2.transition(OrderStatus.DELIVERING);
        } catch (IllegalStateException e) {
            System.out.println("Ошибка: " + e.getMessage());
        }

        try {
            OrderTracker t3 = new OrderTracker("ORD-779");
            t3.transition(OrderStatus.CONFIRMED);
            t3.transition(OrderStatus.PREPARING);
            t3.transition(OrderStatus.READY);
            t3.transition(OrderStatus.DELIVERING);
            t3.transition(OrderStatus.DELIVERED);
            t3.transition(OrderStatus.PREPARING);
        } catch (IllegalStateException e) {
            System.out.println("Ошибка: " + e.getMessage());
        }
    }
}`,
      explanation: 'State machine — фундаментальный паттерн в delivery-сервисах. В Glovo заказ проходит ~8 статусов, в Wolt — до 12 (включая payment_pending, restaurant_accepted и т.д.). Невалидные переходы предотвращают ошибки: нельзя доставить заказ, который ещё не готов. В реальности state machine реализуют через Spring StateMachine или Temporal.io для оркестрации workflow. Каждый переход генерирует event для Kafka.'
    },
    {
      id: 6,
      title: 'Delivery Time Estimation — расчёт ETA',
      type: 'practice',
      difficulty: 'easy',
      description: 'Спринт: ETA Team. DEL-610: Реализовать расчёт предполагаемого времени доставки. ETA = время приготовления + время в пути. Время в пути = расстояние / средняя скорость курьера. Добавить буфер для непредвиденных задержек.',
      requirements: [
        'Record DeliveryEstimate(int cookingMinutes, double distanceKm, int bufferMinutes, String description)',
        'Метод estimateDelivery(int cookingMin, double distanceKm) возвращает DeliveryEstimate',
        'Средняя скорость курьера: 25 км/ч (на скутере)',
        'Буфер: 5 мин (при distance < 3 км), 10 мин (3-7 км), 15 мин (> 7 км)',
        'Общее ETA = cookingMin + travelMin + bufferMin',
        'Вывести в формате: "ETA: XX мин (готовка: XX + путь: XX + буфер: XX)"'
      ],
      expectedOutput: 'ETA: 27 мин (готовка: 15 + путь: 7 + буфер: 5)\nETA: 39 мин (готовка: 20 + путь: 14 + буфер: 5)\nETA: 55 мин (готовка: 25 + путь: 15 + буфер: 15)',
      hint: 'travelMinutes = (int) Math.ceil(distanceKm / 25.0 * 60). Буфер через тернарный оператор или switch expression.',
      solution: `public class Main {
    record DeliveryEstimate(int cookingMinutes, int travelMinutes, int bufferMinutes, String description) {
        int totalMinutes() { return cookingMinutes + travelMinutes + bufferMinutes; }
    }

    static DeliveryEstimate estimateDelivery(int cookingMin, double distanceKm) {
        int travelMin = (int) Math.ceil(distanceKm / 25.0 * 60);
        int bufferMin = distanceKm < 3 ? 5 : distanceKm <= 7 ? 5 : 15;
        int total = cookingMin + travelMin + bufferMin;
        String desc = String.format("ETA: %d мин (готовка: %d + путь: %d + буфер: %d)",
                total, cookingMin, travelMin, bufferMin);
        return new DeliveryEstimate(cookingMin, travelMin, bufferMin, desc);
    }

    public static void main(String[] args) {
        System.out.println(estimateDelivery(15, 2.5).description());
        System.out.println(estimateDelivery(20, 5.5).description());
        System.out.println(estimateDelivery(25, 6.0).description());
    }
}`,
      explanation: 'ETA — один из важнейших показателей для delivery-сервиса. Wolt показывает пользователю "30-40 мин" (диапазон с буфером). Yandex Eats использует ML-модели, учитывающие историю ресторана (реальное время готовки vs заявленное), пробки в реальном времени, погоду и загруженность района. Точность ETA напрямую влияет на удовлетворённость клиентов — завышенный ETA снижает конверсию, заниженный — вызывает негатив.'
    },
    {
      id: 7,
      title: 'Courier Earnings — расчёт заработка курьера',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Payments Team. DEL-715: Рассчитать заработок курьера за смену. Базовая оплата за заказ + бонус за расстояние + чаевые + бонус за количество заказов (порог). Вычесть комиссию платформы.',
      requirements: [
        'Record CompletedDelivery(String orderId, double distanceKm, int tipKzt)',
        'Метод calculateEarnings(List<CompletedDelivery> deliveries) → EarningsSummary',
        'Базовая оплата за заказ: 600 KZT',
        'Бонус за расстояние: 80 KZT/км (свыше 2 км)',
        'Бонус за количество: +2000 KZT если >= 10 заказов, +5000 KZT если >= 20',
        'Комиссия платформы: 15% от (базовая + бонус за расстояние), НЕ от чаевых',
        'Итого: (базовая + distance_bonus) * 0.85 + tips + quantity_bonus'
      ],
      expectedOutput: 'Смена: 5 заказов\nБазовая: 3000 KZT\nБонус расстояние: 1120 KZT\nЧаевые: 1500 KZT\nБонус заказы: 0 KZT\nКомиссия (15%): -618 KZT\nИТОГО: 5002 KZT',
      hint: 'distanceBonus для каждого заказа: Math.max(0, distance - 2) * 80. Комиссия: (totalBase + totalDistanceBonus) * 0.15. Итого: (totalBase + totalDistanceBonus) * 0.85 + tips + quantityBonus.',
      solution: `import java.util.*;

public class Main {
    record CompletedDelivery(String orderId, double distanceKm, int tipKzt) {}

    static void calculateEarnings(List<CompletedDelivery> deliveries) {
        int count = deliveries.size();
        long totalBase = count * 600L;
        long totalDistanceBonus = 0;
        long totalTips = 0;

        for (var d : deliveries) {
            totalDistanceBonus += Math.round(Math.max(0, d.distanceKm() - 2) * 80);
            totalTips += d.tipKzt();
        }

        int quantityBonus = count >= 20 ? 5000 : count >= 10 ? 2000 : 0;
        long commission = Math.round((totalBase + totalDistanceBonus) * 0.15);
        long total = totalBase + totalDistanceBonus - commission + totalTips + quantityBonus;

        System.out.println("Смена: " + count + " заказов");
        System.out.println("Базовая: " + totalBase + " KZT");
        System.out.println("Бонус расстояние: " + totalDistanceBonus + " KZT");
        System.out.println("Чаевые: " + totalTips + " KZT");
        System.out.println("Бонус заказы: " + quantityBonus + " KZT");
        System.out.println("Комиссия (15%): -" + commission + " KZT");
        System.out.println("ИТОГО: " + total + " KZT");
    }

    public static void main(String[] args) {
        List<CompletedDelivery> shift = List.of(
            new CompletedDelivery("ORD-1", 3.0, 300),
            new CompletedDelivery("ORD-2", 5.5, 500),
            new CompletedDelivery("ORD-3", 1.5, 200),
            new CompletedDelivery("ORD-4", 4.0, 0),
            new CompletedDelivery("ORD-5", 7.0, 500)
        );
        calculateEarnings(shift);
    }
}`,
      explanation: 'Расчёт заработка курьера — критичная часть delivery-платформы. В Glovo курьер получает базу + distance fee, Wolt добавляет бонусы за часы пик. Yandex Eats имеет сложную формулу с зонами, временем суток и рейтингом курьера. Чаевые всегда 100% идут курьеру — это стандарт индустрии. Комиссия платформы 15-30% от delivery fee — основной доход компании. Бонусы за количество мотивируют курьеров работать полную смену.'
    },
    {
      id: 8,
      title: 'Menu Management — валидация меню ресторана',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Merchant Team. DEL-822: Реализовать систему управления меню ресторана. Валидация позиций (цена > 0, название не пустое), стоп-лист (недоступные позиции), группировка по категориям, расчёт средней стоимости.',
      requirements: [
        'Record MenuItem(String id, String name, String category, int priceKzt, boolean available)',
        'Метод validateMenu(List<MenuItem>) → List<String> (список ошибок)',
        'Метод getAvailableByCategory(List<MenuItem>) → Map<String, List<MenuItem>>',
        'Метод getStopList(List<MenuItem>) → List<MenuItem> (unavailable items)',
        'Валидация: name не пустое, price > 0, category не пустая',
        'Средняя цена по категории для доступных позиций'
      ],
      expectedOutput: 'Ошибки валидации:\n- [M-3]: цена должна быть > 0\n- [M-6]: название не может быть пустым\nСтоп-лист: [Том ям, Ролл Филадельфия]\nМеню по категориям:\n  Бургеры: Чизбургер (1800), Двойной бургер (2500)\n  Напитки: Кола (500)\nСредняя цена:\n  Бургеры: 2150 KZT\n  Напитки: 500 KZT',
      hint: 'Stream API: filter для валидации, Collectors.groupingBy для категорий, averagingInt для средней цены. Три отдельных метода — принцип единственной ответственности.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record MenuItem(String id, String name, String category, int priceKzt, boolean available) {}

    static List<String> validateMenu(List<MenuItem> menu) {
        List<String> errors = new ArrayList<>();
        for (var item : menu) {
            if (item.name() == null || item.name().isBlank())
                errors.add("[" + item.id() + "]: название не может быть пустым");
            if (item.priceKzt() <= 0)
                errors.add("[" + item.id() + "]: цена должна быть > 0");
            if (item.category() == null || item.category().isBlank())
                errors.add("[" + item.id() + "]: категория не может быть пустой");
        }
        return errors;
    }

    static List<MenuItem> getStopList(List<MenuItem> menu) {
        return menu.stream().filter(m -> !m.available()).collect(Collectors.toList());
    }

    static Map<String, List<MenuItem>> getAvailableByCategory(List<MenuItem> menu) {
        return menu.stream()
                .filter(MenuItem::available)
                .filter(m -> m.priceKzt() > 0 && m.name() != null && !m.name().isBlank())
                .collect(Collectors.groupingBy(MenuItem::category, LinkedHashMap::new, Collectors.toList()));
    }

    public static void main(String[] args) {
        List<MenuItem> menu = List.of(
            new MenuItem("M-1", "Чизбургер", "Бургеры", 1800, true),
            new MenuItem("M-2", "Двойной бургер", "Бургеры", 2500, true),
            new MenuItem("M-3", "Том ям", "Супы", -500, false),
            new MenuItem("M-4", "Кола", "Напитки", 500, true),
            new MenuItem("M-5", "Ролл Филадельфия", "Роллы", 2800, false),
            new MenuItem("M-6", "", "Десерты", 900, true)
        );

        var errors = validateMenu(menu);
        System.out.println("Ошибки валидации:");
        errors.forEach(e -> System.out.println("- " + e));

        var stopList = getStopList(menu);
        System.out.println("Стоп-лист: " + stopList.stream()
                .map(MenuItem::name).filter(n -> !n.isBlank()).collect(Collectors.toList()));

        var byCategory = getAvailableByCategory(menu);
        System.out.println("Меню по категориям:");
        byCategory.forEach((cat, items) -> {
            String itemsStr = items.stream()
                    .map(i -> i.name() + " (" + i.priceKzt() + ")")
                    .collect(Collectors.joining(", "));
            System.out.println("  " + cat + ": " + itemsStr);
        });

        System.out.println("Средняя цена:");
        byCategory.forEach((cat, items) -> {
            int avg = (int) items.stream().mapToInt(MenuItem::priceKzt).average().orElse(0);
            System.out.println("  " + cat + ": " + avg + " KZT");
        });
    }
}`,
      explanation: 'Управление меню — ежедневная задача в delivery-платформе. В Wolt ресторан может обновлять меню в реальном времени через merchant portal. Стоп-лист критичен: если позиция закончилась, её надо мгновенно скрыть (WebSocket push). Glovo валидирует меню при загрузке: фото, описание, калорийность, аллергены. В Yandex Eats модерация меню частично автоматизирована ML — проверка фото на соответствие, определение дубликатов.'
    },
    {
      id: 9,
      title: 'Order Batching — группировка заказов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт: Optimization Team. DEL-931: Реализовать алгоритм батчинга заказов. Заказы из одного ресторана, с близкими адресами доставки (< 2 км друг от друга) группируются в один batch для одного курьера. Максимум 3 заказа в batch. Цель — минимизировать общее расстояние.',
      requirements: [
        'Record Order(String id, String restaurantId, double deliveryLat, double deliveryLon, long createdAt)',
        'Record Batch(String batchId, String restaurantId, List<Order> orders, double totalDistanceKm)',
        'Метод createBatches(List<Order>) → List<Batch>',
        'Группировка по restaurantId, затем кластеризация по расстоянию (< 2 км)',
        'Максимум 3 заказа в batch',
        'Вычислить общее расстояние между точками доставки в batch',
        'Оставшиеся заказы — отдельные batch по 1'
      ],
      expectedOutput: 'Batch B-1 (rest-A): [ORD-1, ORD-2, ORD-4] dist: 1.7 km\nBatch B-2 (rest-A): [ORD-5] dist: 0.0 km\nBatch B-3 (rest-B): [ORD-3, ORD-6] dist: 1.3 km',
      hint: 'Сначала groupingBy(restaurantId). Для каждой группы — greedy кластеризация: берём первый заказ, добавляем ближайшие (< 2 км от любого в кластере) пока size < 3. Repeat для оставшихся.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Order(String id, String restaurantId, double deliveryLat, double deliveryLon, long createdAt) {}
    record Batch(String batchId, String restaurantId, List<Order> orders, double totalDistanceKm) {}

    static double distance(double lat1, double lon1, double lat2, double lon2) {
        return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2)) * 111;
    }

    static double batchDistance(List<Order> orders) {
        double total = 0;
        for (int i = 0; i < orders.size() - 1; i++) {
            total += distance(orders.get(i).deliveryLat(), orders.get(i).deliveryLon(),
                    orders.get(i + 1).deliveryLat(), orders.get(i + 1).deliveryLon());
        }
        return Math.round(total * 10.0) / 10.0;
    }

    static boolean isCloseToCluster(Order order, List<Order> cluster) {
        return cluster.stream().anyMatch(o ->
                distance(o.deliveryLat(), o.deliveryLon(),
                        order.deliveryLat(), order.deliveryLon()) < 2.0);
    }

    static List<Batch> createBatches(List<Order> orders) {
        Map<String, List<Order>> byRestaurant = orders.stream()
                .collect(Collectors.groupingBy(Order::restaurantId, LinkedHashMap::new, Collectors.toList()));

        List<Batch> batches = new ArrayList<>();
        int batchNum = 1;

        for (var entry : byRestaurant.entrySet()) {
            String restId = entry.getKey();
            List<Order> remaining = new ArrayList<>(entry.getValue());
            remaining.sort(Comparator.comparingLong(Order::createdAt));

            while (!remaining.isEmpty()) {
                List<Order> cluster = new ArrayList<>();
                cluster.add(remaining.remove(0));

                Iterator<Order> it = remaining.iterator();
                while (it.hasNext() && cluster.size() < 3) {
                    Order candidate = it.next();
                    if (isCloseToCluster(candidate, cluster)) {
                        cluster.add(candidate);
                        it.remove();
                    }
                }

                double dist = batchDistance(cluster);
                batches.add(new Batch("B-" + batchNum++, restId, cluster, dist));
            }
        }
        return batches;
    }

    public static void main(String[] args) {
        List<Order> orders = List.of(
            new Order("ORD-1", "rest-A", 43.250, 76.950, 1000),
            new Order("ORD-2", "rest-A", 43.255, 76.955, 1001),
            new Order("ORD-3", "rest-B", 43.300, 77.000, 1002),
            new Order("ORD-4", "rest-A", 43.260, 76.960, 1003),
            new Order("ORD-5", "rest-A", 43.400, 77.100, 1004),
            new Order("ORD-6", "rest-B", 43.305, 77.005, 1005)
        );

        List<Batch> batches = createBatches(orders);
        for (var b : batches) {
            String orderIds = b.orders().stream().map(Order::id).collect(Collectors.joining(", "));
            System.out.printf("Batch %s (%s): [%s] dist: %.1f km%n",
                    b.batchId(), b.restaurantId(), orderIds, b.totalDistanceKm());
        }
    }
}`,
      explanation: 'Order batching — ключевая оптимизация в delivery. Glovo называет это "stacking" — курьер берёт 2-3 заказа из одного ресторана и развозит по ближайшим адресам. Wolt использует ML для предсказания батчей: если через 2 минуты придёт ещё заказ из того же ресторана — стоит подождать. В Yandex Eats батчинг сокращает среднее время доставки на 15-20% и повышает заработок курьера. Алгоритм кластеризации в реальности — вариация DBSCAN или жадного алгоритма с ограничениями.'
    },
    {
      id: 10,
      title: 'Review & Rating — агрегация отзывов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт: Trust & Safety Team. DEL-1042: Система агрегации отзывов ресторана с фильтрацией подозрительных (фейковых) отзывов. Подозрительный отзыв: текст < 10 символов с оценкой 5 или 1, или несколько отзывов с одного аккаунта за час, или отзыв в первые 5 минут после заказа.',
      requirements: [
        'Record Review(String id, String userId, String restaurantId, int rating, String text, long timestamp, long orderTimestamp)',
        'Метод filterSuspicious(List<Review>) → Map с ключами "valid" и "suspicious"',
        'Подозрительный если: (rating==5 || rating==1) И text.length() < 10',
        'Подозрительный если: тот же userId оставил > 1 отзыва за 3600 секунд',
        'Подозрительный если: timestamp - orderTimestamp < 300 (5 минут)',
        'Метод aggregateRating(List<Review> validReviews) → средний рейтинг с округлением до 1 знака',
        'Вывести статистику: общее количество, валидные, подозрительные, средний рейтинг'
      ],
      expectedOutput: 'Всего отзывов: 8\nВалидных: 5\nПодозрительных: 3\nПричины:\n  R-3: короткий текст с экстремальной оценкой\n  R-5: множественные отзывы за короткий период\n  R-7: отзыв слишком быстро после заказа\nСредний рейтинг (валидные): 4.0',
      hint: 'Для обнаружения множественных отзывов: сгруппируй по userId, отсортируй по timestamp, проверь разницу между соседними. Set<String> suspiciousIds для накопления подозрительных.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Review(String id, String userId, String restaurantId, int rating,
                  String text, long timestamp, long orderTimestamp) {}

    static Map<String, List<Review>> filterSuspicious(List<Review> reviews) {
        Set<String> suspiciousIds = new LinkedHashSet<>();
        Map<String, String> reasons = new LinkedHashMap<>();

        // Правило 1: короткий текст + экстремальная оценка
        for (var r : reviews) {
            if ((r.rating() == 5 || r.rating() == 1) && r.text().length() < 10) {
                suspiciousIds.add(r.id());
                reasons.put(r.id(), "короткий текст с экстремальной оценкой");
            }
        }

        // Правило 2: несколько отзывов одного юзера за 3600 сек
        Map<String, List<Review>> byUser = reviews.stream()
                .collect(Collectors.groupingBy(Review::userId));
        for (var entry : byUser.entrySet()) {
            List<Review> userReviews = entry.getValue();
            if (userReviews.size() > 1) {
                userReviews.sort(Comparator.comparingLong(Review::timestamp));
                for (int i = 1; i < userReviews.size(); i++) {
                    if (userReviews.get(i).timestamp() - userReviews.get(i - 1).timestamp() < 3600) {
                        suspiciousIds.add(userReviews.get(i).id());
                        reasons.put(userReviews.get(i).id(), "множественные отзывы за короткий период");
                    }
                }
            }
        }

        // Правило 3: отзыв < 5 мин после заказа
        for (var r : reviews) {
            if (r.timestamp() - r.orderTimestamp() < 300) {
                suspiciousIds.add(r.id());
                reasons.put(r.id(), "отзыв слишком быстро после заказа");
            }
        }

        List<Review> valid = new ArrayList<>();
        List<Review> suspicious = new ArrayList<>();
        for (var r : reviews) {
            if (suspiciousIds.contains(r.id())) suspicious.add(r);
            else valid.add(r);
        }

        // Вывод
        System.out.println("Всего отзывов: " + reviews.size());
        System.out.println("Валидных: " + valid.size());
        System.out.println("Подозрительных: " + suspicious.size());
        System.out.println("Причины:");
        for (var r : suspicious) {
            System.out.println("  " + r.id() + ": " + reasons.get(r.id()));
        }

        double avgRating = valid.stream().mapToInt(Review::rating).average().orElse(0);
        System.out.printf("Средний рейтинг (валидные): %.1f%n", avgRating);

        return Map.of("valid", valid, "suspicious", suspicious);
    }

    public static void main(String[] args) {
        List<Review> reviews = List.of(
            new Review("R-1", "U-1", "rest-A", 5, "Отличная еда, быстрая доставка!", 10000, 5000),
            new Review("R-2", "U-2", "rest-A", 4, "Хорошее качество, буду заказывать ещё", 10100, 5100),
            new Review("R-3", "U-3", "rest-A", 5, "Круто!", 10200, 5200),
            new Review("R-4", "U-4", "rest-A", 3, "Нормально, но доставка задержалась на 15 минут", 10300, 5300),
            new Review("R-5", "U-1", "rest-A", 5, "Заказываю второй раз, всё супер!", 10500, 6000),
            new Review("R-6", "U-5", "rest-A", 4, "Вкусные бургеры, рекомендую всем друзьям", 10600, 5600),
            new Review("R-7", "U-6", "rest-A", 5, "Быстро приготовили и доставили, спасибо!", 10700, 10500),
            new Review("R-8", "U-7", "rest-A", 4, "Порции большие, цена адекватная", 10800, 5800)
        );
        filterSuspicious(reviews);
    }
}`,
      explanation: 'Фильтрация фейковых отзывов — задача Trust & Safety команды. В Wolt и Glovo используют ML-модели для обнаружения подозрительных паттернов: одинаковый IP, похожие тексты, слишком быстрые отзывы, массовые 5-звёздочные от новых аккаунтов. Yandex Eats анализирует behavioral signals: время просмотра заказа, историю пользователя, устройство. В реальности система присваивает "trust score" каждому отзыву, а не бинарный valid/suspicious. Средний рейтинг считается только по валидным отзывам.'
    }
  ]
}
