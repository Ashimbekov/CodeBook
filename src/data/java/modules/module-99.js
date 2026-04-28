export default {
  id: 99,
  title: 'Реальная разработка: Маркетплейс',
  description: 'Задачи backend-разработчика в маркетплейсе: каталог, корзина, поиск товаров, скидки, склад, отзывы и рекомендации.',
  lessons: [
    {
      id: 1,
      title: 'Product Catalog — фильтрация товаров',
      type: 'practice',
      difficulty: 'easy',
      description: 'Спринт: Catalog Team. MKT-101: Реализовать фильтрацию каталога товаров по категории, диапазону цен и минимальному рейтингу. Отсортировать результат по цене (от дешёвых к дорогим). Вывести название, цену в KZT и рейтинг.',
      requirements: [
        'Record Product(String name, String category, long priceKzt, double rating)',
        'Метод filterProducts(List<Product>, String category, long minPrice, long maxPrice, double minRating)',
        'Фильтрация: если category != null — по категории; ценовой диапазон [minPrice, maxPrice]; рейтинг >= minRating',
        'Результат отсортирован по цене (возрастание)',
        'Формат вывода: "name — priceKzt KZT (rating)"'
      ],
      expectedOutput: 'Xiaomi Redmi Note 12 — 89990 KZT (4.3)\nSamsung Galaxy A54 — 159990 KZT (4.5)\nApple iPhone 15 — 499990 KZT (4.8)\n---\nSony WH-1000XM5 — 179990 KZT (4.9)',
      hint: 'Используй Stream API: filter() для каждого критерия, sorted() по цене, map() для форматирования. Record упрощает хранение данных товара.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Product(String name, String category, long priceKzt, double rating) {}

    static List<String> filterProducts(List<Product> products, String category,
            long minPrice, long maxPrice, double minRating) {
        return products.stream()
                .filter(p -> category == null || p.category().equals(category))
                .filter(p -> p.priceKzt() >= minPrice && p.priceKzt() <= maxPrice)
                .filter(p -> p.rating() >= minRating)
                .sorted(Comparator.comparingLong(Product::priceKzt))
                .map(p -> String.format("%s — %d KZT (%.1f)", p.name(), p.priceKzt(), p.rating()))
                .collect(Collectors.toList());
    }

    public static void main(String[] args) {
        List<Product> catalog = List.of(
            new Product("Apple iPhone 15", "smartphones", 499990, 4.8),
            new Product("Samsung Galaxy A54", "smartphones", 159990, 4.5),
            new Product("Xiaomi Redmi Note 12", "smartphones", 89990, 4.3),
            new Product("Sony WH-1000XM5", "audio", 179990, 4.9),
            new Product("JBL Tune 510BT", "audio", 24990, 3.8),
            new Product("Lenovo IdeaPad 3", "laptops", 249990, 4.1)
        );

        filterProducts(catalog, "smartphones", 50000, 500000, 4.0)
                .forEach(System.out::println);
        System.out.println("---");
        filterProducts(catalog, "audio", 100000, 300000, 4.5)
                .forEach(System.out::println);
    }
}`,
      explanation: 'В Kaspi Магазин и Wildberries каталог — это основа всего маркетплейса. Фильтрация по категории, цене и рейтингу — самый частый запрос пользователей. В реальности фильтры реализованы через ElasticSearch facets, а не Stream API, потому что каталог содержит миллионы товаров. Kaspi использует гибридный подход: PostgreSQL для основных данных + ElasticSearch для полнотекстового поиска и фасетной фильтрации. Кэширование популярных фильтров через Redis сокращает latency до 50мс.'
    },
    {
      id: 2,
      title: 'Shopping Cart — корзина покупок',
      type: 'practice',
      difficulty: 'easy',
      description: 'Спринт: Cart Team. MKT-115: Реализовать корзину покупок с возможностью добавления, удаления товаров, изменения количества и подсчёта итоговой суммы. При добавлении существующего товара — увеличивать количество.',
      requirements: [
        'Record CartItem(String productId, String name, long priceKzt, int quantity)',
        'Класс ShoppingCart с методами: addItem(), removeItem(productId), getTotal(), getItems()',
        'addItem: если товар уже в корзине — увеличить quantity',
        'removeItem: полностью удаляет товар из корзины',
        'getTotal: возвращает сумму (price * quantity) всех товаров',
        'Использовать Map<String, CartItem> для хранения'
      ],
      expectedOutput: 'Корзина (3 позиции):\n  iPhone 15 x1 — 499990 KZT\n  Чехол x2 — 7990 KZT\n  AirPods Pro x1 — 129990 KZT\nИтого: 645960 KZT\n---\nПосле удаления чехла:\nИтого: 629970 KZT',
      hint: 'Map.merge() или computeIfPresent() для увеличения количества существующего товара. values().stream().mapToLong() для подсчёта итого.',
      solution: `import java.util.*;

public class Main {
    record CartItem(String productId, String name, long priceKzt, int quantity) {
        CartItem withQuantity(int newQty) {
            return new CartItem(productId, name, priceKzt, newQty);
        }
    }

    static class ShoppingCart {
        private final Map<String, CartItem> items = new LinkedHashMap<>();

        void addItem(String productId, String name, long priceKzt, int quantity) {
            items.merge(productId,
                new CartItem(productId, name, priceKzt, quantity),
                (old, nw) -> old.withQuantity(old.quantity() + nw.quantity()));
        }

        void removeItem(String productId) {
            items.remove(productId);
        }

        long getTotal() {
            return items.values().stream()
                    .mapToLong(i -> i.priceKzt() * i.quantity())
                    .sum();
        }

        Collection<CartItem> getItems() { return items.values(); }
        int size() { return items.size(); }
    }

    public static void main(String[] args) {
        ShoppingCart cart = new ShoppingCart();
        cart.addItem("iphone15", "iPhone 15", 499990, 1);
        cart.addItem("case-01", "Чехол", 3995, 1);
        cart.addItem("case-01", "Чехол", 3995, 1);
        cart.addItem("airpods", "AirPods Pro", 129990, 1);

        System.out.println("Корзина (" + cart.size() + " позиции):");
        for (var item : cart.getItems()) {
            System.out.printf("  %s x%d — %d KZT%n", item.name(), item.quantity(),
                    item.priceKzt() * item.quantity());
        }
        System.out.println("Итого: " + cart.getTotal() + " KZT");

        System.out.println("---");
        cart.removeItem("case-01");
        System.out.println("После удаления чехла:");
        System.out.println("Итого: " + cart.getTotal() + " KZT");
    }
}`,
      explanation: 'Корзина — один из самых критичных компонентов маркетплейса. В Kaspi и Ozon корзина хранится в Redis (для скорости) с периодической синхронизацией в PostgreSQL. Wildberries использует event sourcing для корзины: каждое действие (add/remove/change qty) — это событие, а текущее состояние вычисляется из цепочки событий. Merge при добавлении существующего товара — стандартный UX паттерн всех маркетплейсов.'
    },
    {
      id: 3,
      title: 'Discount Engine — система скидок',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Cart Team. MKT-203: Реализовать систему скидок для маркетплейса. Три типа: PERCENT (процент от суммы), FIXED (фиксированная скидка в KZT), COMBO (купи N — получи скидку на M-й товар). Применить лучшую из доступных скидок к заказу.',
      requirements: [
        'Sealed interface Discount с реализациями: PercentDiscount(int percent), FixedDiscount(long amountKzt), ComboDiscount(int buyCount, int percentOff)',
        'Метод applyDiscount(long orderTotal, int itemCount, Discount discount) возвращает long — итог после скидки',
        'PercentDiscount: итог * (100 - percent) / 100',
        'FixedDiscount: итог - amountKzt (минимум 0)',
        'ComboDiscount: если itemCount >= buyCount, скидка percentOff% на 1 товар (orderTotal / itemCount)',
        'Метод bestDiscount(long orderTotal, int itemCount, List<Discount>) — выбирает скидку с минимальным итогом'
      ],
      expectedOutput: 'Заказ: 150000 KZT (3 товара)\nСкидка 10%: 135000 KZT\nФикс -5000: 145000 KZT\nКомбо 3+1: 135000 KZT\nЛучшая скидка: 135000 KZT',
      hint: 'Sealed interface + switch expression с pattern matching. Для bestDiscount используй Stream.min() по результату применения каждой скидки.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    sealed interface Discount permits PercentDiscount, FixedDiscount, ComboDiscount {}
    record PercentDiscount(int percent) implements Discount {}
    record FixedDiscount(long amountKzt) implements Discount {}
    record ComboDiscount(int buyCount, int percentOff) implements Discount {}

    static long applyDiscount(long orderTotal, int itemCount, Discount discount) {
        return switch (discount) {
            case PercentDiscount p -> orderTotal * (100 - p.percent()) / 100;
            case FixedDiscount f -> Math.max(0, orderTotal - f.amountKzt());
            case ComboDiscount c -> {
                if (itemCount >= c.buyCount()) {
                    long perItem = orderTotal / itemCount;
                    long discountAmount = perItem * c.percentOff() / 100;
                    yield orderTotal - discountAmount;
                }
                yield orderTotal;
            }
        };
    }

    static long bestDiscount(long orderTotal, int itemCount, List<Discount> discounts) {
        return discounts.stream()
                .mapToLong(d -> applyDiscount(orderTotal, itemCount, d))
                .min()
                .orElse(orderTotal);
    }

    public static void main(String[] args) {
        long orderTotal = 150000;
        int itemCount = 3;

        Discount percent = new PercentDiscount(10);
        Discount fixed = new FixedDiscount(5000);
        Discount combo = new ComboDiscount(3, 30);

        System.out.println("Заказ: " + orderTotal + " KZT (" + itemCount + " товара)");
        System.out.println("Скидка 10%: " + applyDiscount(orderTotal, itemCount, percent) + " KZT");
        System.out.println("Фикс -5000: " + applyDiscount(orderTotal, itemCount, fixed) + " KZT");
        System.out.println("Комбо 3+1: " + applyDiscount(orderTotal, itemCount, combo) + " KZT");
        System.out.println("Лучшая скидка: " + bestDiscount(orderTotal, itemCount,
                List.of(percent, fixed, combo)) + " KZT");
    }
}`,
      explanation: 'Система скидок на Wildberries и Ozon — одна из самых сложных подсистем. Sealed interface идеально моделирует фиксированный набор типов скидок. В реальности Amazon использует «стек скидок»: промокод, скидка продавца, акция маркетплейса, кэшбэк — каждый уровень применяется последовательно. Kaspi Red (рассрочка) — по сути тоже тип скидки, только оплату берёт на себя банк. Pattern matching в switch — элегантная альтернатива цепочке if-instanceof.'
    },
    {
      id: 4,
      title: 'Inventory Management — управление остатками',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Fulfillment Team. MKT-287: Реализовать управление складскими остатками с поддержкой резервирования. При оформлении заказа товар резервируется (уменьшается available, увеличивается reserved). При отмене — возвращается. При подтверждении отправки — списывается из reserved.',
      requirements: [
        'Record StockItem(String sku, String name, int available, int reserved)',
        'Класс Inventory с методами: reserve(sku, qty), cancelReservation(sku, qty), confirmShipment(sku, qty), getStock(sku)',
        'reserve: available -= qty, reserved += qty. Если available < qty — выбросить сообщение об ошибке',
        'cancelReservation: reserved -= qty, available += qty',
        'confirmShipment: reserved -= qty (товар ушёл со склада)',
        'Вывод остатков: "sku: available=X, reserved=Y"'
      ],
      expectedOutput: 'Начальный склад:\nSKU-001: available=100, reserved=0\n---\nПосле резерва 5шт: available=95, reserved=5\nПосле резерва 3шт: available=92, reserved=8\nОтмена 2шт: available=94, reserved=6\nОтправка 4шт: available=94, reserved=2\n---\nОшибка: Недостаточно товара SKU-002 (доступно: 2, запрошено: 10)',
      hint: 'Храни Map<String, StockItem>. При каждой операции создавай новый StockItem (record immutable). Проверяй граничные условия перед изменением.',
      solution: `import java.util.*;

public class Main {
    record StockItem(String sku, String name, int available, int reserved) {}

    static class Inventory {
        private final Map<String, StockItem> stock = new HashMap<>();

        void addProduct(String sku, String name, int available) {
            stock.put(sku, new StockItem(sku, name, available, 0));
        }

        String reserve(String sku, int qty) {
            StockItem item = stock.get(sku);
            if (item == null) return "Ошибка: Товар " + sku + " не найден";
            if (item.available() < qty) {
                return String.format("Ошибка: Недостаточно товара %s (доступно: %d, запрошено: %d)",
                        sku, item.available(), qty);
            }
            stock.put(sku, new StockItem(sku, item.name(), item.available() - qty, item.reserved() + qty));
            return String.format("После резерва %dшт: available=%d, reserved=%d",
                    qty, item.available() - qty, item.reserved() + qty);
        }

        String cancelReservation(String sku, int qty) {
            StockItem item = stock.get(sku);
            stock.put(sku, new StockItem(sku, item.name(), item.available() + qty, item.reserved() - qty));
            return String.format("Отмена %dшт: available=%d, reserved=%d",
                    qty, item.available() + qty, item.reserved() - qty);
        }

        String confirmShipment(String sku, int qty) {
            StockItem item = stock.get(sku);
            stock.put(sku, new StockItem(sku, item.name(), item.available(), item.reserved() - qty));
            return String.format("Отправка %dшт: available=%d, reserved=%d",
                    qty, item.available(), item.reserved() - qty);
        }

        String getStock(String sku) {
            StockItem item = stock.get(sku);
            return String.format("%s: available=%d, reserved=%d", sku, item.available(), item.reserved());
        }
    }

    public static void main(String[] args) {
        Inventory inv = new Inventory();
        inv.addProduct("SKU-001", "Кроссовки Nike Air", 100);
        inv.addProduct("SKU-002", "Футболка Adidas", 2);

        System.out.println("Начальный склад:");
        System.out.println(inv.getStock("SKU-001"));
        System.out.println("---");
        System.out.println(inv.reserve("SKU-001", 5));
        System.out.println(inv.reserve("SKU-001", 3));
        System.out.println(inv.cancelReservation("SKU-001", 2));
        System.out.println(inv.confirmShipment("SKU-001", 4));
        System.out.println("---");
        System.out.println(inv.reserve("SKU-002", 10));
    }
}`,
      explanation: 'Управление остатками — критический процесс на любом маркетплейсе. Wildberries и Ozon используют двухфазную схему: reserve (при оформлении заказа) и commit (при отправке). Это предотвращает overselling — когда два покупателя заказывают последний товар одновременно. В Kaspi Магазин остатки синхронизируются между продавцом и маркетплейсом через API каждые 15 минут. Amazon использует distributed locking (DynamoDB) для атомарного резервирования при высоком concurrency.'
    },
    {
      id: 5,
      title: 'Order Processing — обработка заказа',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Fulfillment Team. MKT-310: Реализовать конвейер обработки заказа. Заказ проходит стадии: CREATED → VALIDATED → PAID → PICKING → SHIPPED → DELIVERED. Каждый переход валидируется. Невалидный переход отклоняется с сообщением об ошибке.',
      requirements: [
        'Enum OrderStatus: CREATED, VALIDATED, PAID, PICKING, SHIPPED, DELIVERED, CANCELLED',
        'Record Order(String id, String customer, long totalKzt, OrderStatus status)',
        'Метод transition(Order, OrderStatus) возвращает Order с новым статусом или сообщение об ошибке',
        'Валидные переходы: CREATED→VALIDATED, VALIDATED→PAID, PAID→PICKING, PICKING→SHIPPED, SHIPPED→DELIVERED',
        'Из любого статуса (кроме DELIVERED и SHIPPED) можно перейти в CANCELLED',
        'Вывод каждого шага: "orderId: OLD_STATUS → NEW_STATUS"'
      ],
      expectedOutput: 'ORD-5001: CREATED → VALIDATED\nORD-5001: VALIDATED → PAID\nORD-5001: PAID → PICKING\nORD-5001: PICKING → SHIPPED\nORD-5001: SHIPPED → DELIVERED\n---\nORD-5002: CREATED → VALIDATED\nORD-5002: VALIDATED → CANCELLED\n---\nОшибка: Нельзя перейти из CREATED в SHIPPED',
      hint: 'Map<OrderStatus, Set<OrderStatus>> для хранения валидных переходов. switch expression для определения допустимости перехода. Record with-pattern для создания нового Order с обновлённым статусом.',
      solution: `import java.util.*;

public class Main {
    enum OrderStatus { CREATED, VALIDATED, PAID, PICKING, SHIPPED, DELIVERED, CANCELLED }

    record Order(String id, String customer, long totalKzt, OrderStatus status) {
        Order withStatus(OrderStatus newStatus) {
            return new Order(id, customer, totalKzt, newStatus);
        }
    }

    private static final Map<OrderStatus, Set<OrderStatus>> VALID_TRANSITIONS = Map.of(
        OrderStatus.CREATED, Set.of(OrderStatus.VALIDATED, OrderStatus.CANCELLED),
        OrderStatus.VALIDATED, Set.of(OrderStatus.PAID, OrderStatus.CANCELLED),
        OrderStatus.PAID, Set.of(OrderStatus.PICKING, OrderStatus.CANCELLED),
        OrderStatus.PICKING, Set.of(OrderStatus.SHIPPED, OrderStatus.CANCELLED),
        OrderStatus.SHIPPED, Set.of(OrderStatus.DELIVERED),
        OrderStatus.DELIVERED, Set.of(),
        OrderStatus.CANCELLED, Set.of()
    );

    static String transition(Order[] orderRef, OrderStatus newStatus) {
        Order order = orderRef[0];
        Set<OrderStatus> allowed = VALID_TRANSITIONS.get(order.status());
        if (!allowed.contains(newStatus)) {
            return "Ошибка: Нельзя перейти из " + order.status() + " в " + newStatus;
        }
        Order updated = order.withStatus(newStatus);
        orderRef[0] = updated;
        return order.id() + ": " + order.status() + " → " + newStatus;
    }

    public static void main(String[] args) {
        Order[] order1 = { new Order("ORD-5001", "Айгерим", 89990, OrderStatus.CREATED) };
        System.out.println(transition(order1, OrderStatus.VALIDATED));
        System.out.println(transition(order1, OrderStatus.PAID));
        System.out.println(transition(order1, OrderStatus.PICKING));
        System.out.println(transition(order1, OrderStatus.SHIPPED));
        System.out.println(transition(order1, OrderStatus.DELIVERED));

        System.out.println("---");
        Order[] order2 = { new Order("ORD-5002", "Берик", 45000, OrderStatus.CREATED) };
        System.out.println(transition(order2, OrderStatus.VALIDATED));
        System.out.println(transition(order2, OrderStatus.CANCELLED));

        System.out.println("---");
        Order[] order3 = { new Order("ORD-5003", "Дана", 120000, OrderStatus.CREATED) };
        System.out.println(transition(order3, OrderStatus.SHIPPED));
    }
}`,
      explanation: 'State machine заказа — ядро любого маркетплейса. В Ozon заказ проходит 12+ стадий, включая проверку fraud, сборку на складе, передачу курьеру. Kaspi Магазин использует аналогичный конвейер: продавец подтверждает → собирает → передаёт в Kaspi Post. Amazon реализует это через Step Functions (AWS) — каждый шаг конвейера изолирован в отдельном микросервисе. Невалидные переходы логируются в систему мониторинга для обнаружения багов в клиентских приложениях.'
    },
    {
      id: 6,
      title: 'Product Search — поиск товаров по ключевым словам',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Search Team. MKT-412: Реализовать поиск товаров по ключевым словам с ранжированием по релевантности. Релевантность считается по количеству совпавших слов запроса в названии и описании товара. Совпадение в названии весит x3, в описании x1.',
      requirements: [
        'Record Product(String name, String description, long priceKzt)',
        'Метод search(List<Product>, String query) возвращает список товаров, отсортированных по score (убывание)',
        'Score = совпадения_в_названии * 3 + совпадения_в_описании * 1',
        'Поиск регистронезависимый',
        'Товары с score = 0 не включаются в результат',
        'Вывод: "name (score: X) — priceKzt KZT"'
      ],
      expectedOutput: 'Запрос: "беспроводные наушники bluetooth"\nSony WH-1000XM5 Беспроводные Наушники (score: 7) — 179990 KZT\nApple AirPods Pro Беспроводные (score: 4) — 129990 KZT\nJBL Tune Наушники Bluetooth (score: 4) — 24990 KZT',
      hint: 'Разбей query на слова через split("\\\\s+"). Для каждого слова проверь contains() в toLowerCase() названия и описания. Суммируй score и сортируй по убыванию.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Product(String name, String description, long priceKzt) {}

    record SearchResult(Product product, int score) {}

    static int countMatches(String text, String[] queryWords) {
        String lower = text.toLowerCase();
        int count = 0;
        for (String word : queryWords) {
            if (lower.contains(word.toLowerCase())) count++;
        }
        return count;
    }

    static List<String> search(List<Product> products, String query) {
        String[] queryWords = query.split("\\\\s+");
        return products.stream()
                .map(p -> {
                    int nameScore = countMatches(p.name(), queryWords) * 3;
                    int descScore = countMatches(p.description(), queryWords);
                    return new SearchResult(p, nameScore + descScore);
                })
                .filter(sr -> sr.score() > 0)
                .sorted(Comparator.comparingInt(SearchResult::score).reversed())
                .map(sr -> String.format("%s (score: %d) — %d KZT",
                        sr.product().name(), sr.score(), sr.product().priceKzt()))
                .collect(Collectors.toList());
    }

    public static void main(String[] args) {
        List<Product> catalog = List.of(
            new Product("Sony WH-1000XM5 Беспроводные Наушники",
                    "Флагманские беспроводные наушники с шумоподавлением, Bluetooth 5.2", 179990),
            new Product("Apple AirPods Pro Беспроводные",
                    "Наушники с активным шумоподавлением от Apple", 129990),
            new Product("JBL Tune Наушники Bluetooth",
                    "Беспроводные наушники с мощным басом", 24990),
            new Product("Samsung Galaxy Watch 5",
                    "Умные часы с мониторингом здоровья", 149990),
            new Product("Чехол для iPhone 15",
                    "Силиконовый чехол, все цвета", 3990)
        );

        String query = "беспроводные наушники bluetooth";
        System.out.println("Запрос: \\"" + query + "\\"");
        search(catalog, query).forEach(System.out::println);
    }
}`,
      explanation: 'Поиск товаров — самая нагруженная функция маркетплейса. Wildberries обрабатывает миллионы поисковых запросов в минуту. В реальности используется ElasticSearch с BM25 ранжированием (усовершенствованный TF-IDF). Amazon добавляет персонализацию: история покупок, просмотров, A9 Algorithm учитывает CTR и конверсию. Ozon использует ML-модели для ранжирования результатов поиска. Наш упрощённый score (вес названия x3) имитирует field boosting в ElasticSearch.'
    },
    {
      id: 7,
      title: 'Seller Rating — рейтинг продавца',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Seller Team. MKT-501: Рассчитать рейтинг продавца на основе метрик: средняя скорость доставки, процент возвратов, средняя оценка покупателей. Формула: rating = reviewScore * 0.4 + deliveryScore * 0.35 + returnScore * 0.25. Каждая метрика нормализуется в диапазон 0-5.',
      requirements: [
        'Record SellerMetrics(String sellerId, String name, double avgReviewScore, double avgDeliveryDays, double returnRatePercent)',
        'deliveryScore: 5.0 если <= 2 дней, 4.0 если <= 3, 3.0 если <= 5, 2.0 если <= 7, 1.0 иначе',
        'returnScore: 5.0 если <= 1%, 4.0 если <= 3%, 3.0 если <= 5%, 2.0 если <= 10%, 1.0 иначе',
        'Итоговый рейтинг: reviewScore * 0.4 + deliveryScore * 0.35 + returnScore * 0.25',
        'Вывести продавцов отсортированных по рейтингу (убывание)',
        'Формат: "name — rating (review: X, delivery: X, returns: X%)"'
      ],
      expectedOutput: 'TechStore — 4.70 (review: 4.8, delivery: 5.0, returns: 0.5%)\nDigital World — 3.90 (review: 4.2, delivery: 4.0, returns: 2.5%)\nGadget Plus — 3.15 (review: 3.5, delivery: 3.0, returns: 6.0%)\nCheap Goods — 2.10 (review: 2.5, delivery: 2.0, returns: 12.0%)',
      hint: 'Вынеси deliveryScore и returnScore в отдельные методы. Используй switch expression для диапазонов (или if-else chain). Stream.sorted() по computed рейтингу.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record SellerMetrics(String sellerId, String name, double avgReviewScore,
                         double avgDeliveryDays, double returnRatePercent) {}

    static double deliveryScore(double days) {
        if (days <= 2) return 5.0;
        if (days <= 3) return 4.0;
        if (days <= 5) return 3.0;
        if (days <= 7) return 2.0;
        return 1.0;
    }

    static double returnScore(double rate) {
        if (rate <= 1) return 5.0;
        if (rate <= 3) return 4.0;
        if (rate <= 5) return 3.0;
        if (rate <= 10) return 2.0;
        return 1.0;
    }

    static double calculateRating(SellerMetrics m) {
        return m.avgReviewScore() * 0.4
             + deliveryScore(m.avgDeliveryDays()) * 0.35
             + returnScore(m.returnRatePercent()) * 0.25;
    }

    public static void main(String[] args) {
        List<SellerMetrics> sellers = List.of(
            new SellerMetrics("S001", "TechStore", 4.8, 1.5, 0.5),
            new SellerMetrics("S002", "Digital World", 4.2, 3.0, 2.5),
            new SellerMetrics("S003", "Gadget Plus", 3.5, 4.5, 6.0),
            new SellerMetrics("S004", "Cheap Goods", 2.5, 6.0, 12.0)
        );

        sellers.stream()
            .sorted(Comparator.comparingDouble(Main::calculateRating).reversed())
            .forEach(s -> System.out.printf("%s — %.2f (review: %.1f, delivery: %.1f, returns: %.1f%%)%n",
                    s.name(), calculateRating(s),
                    s.avgReviewScore(), s.avgDeliveryDays(), s.returnRatePercent()));
    }
}`,
      explanation: 'Рейтинг продавца критически влияет на видимость товаров в поиске. На Kaspi Магазин продавцы с низким рейтингом теряют позиции и могут быть заблокированы. Wildberries использует индекс локализации (WBI) — комплексную метрику из 7+ параметров. Amazon Buy Box Algorithm учитывает цену, рейтинг, скорость доставки и наличие FBA. Ozon использует аналогичный weighted score для ранжирования предложений разных продавцов на одну карточку товара.'
    },
    {
      id: 8,
      title: 'Price History — история цен',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт: Analytics Team. MKT-605: Реализовать отслеживание истории цен товара. Найти минимальную, максимальную и среднюю цену за период. Определить лучший момент для покупки (минимальная цена) и тренд (растёт/падает/стабильно).',
      requirements: [
        'Record PriceEntry(String date, long priceKzt)',
        'Метод analyze(List<PriceEntry>) возвращает статистику: min, max, avg, bestDate, trend',
        'Trend: RISING если последняя цена > первой на 5%+, FALLING если < на 5%+, STABLE иначе',
        'bestDate — дата с минимальной ценой',
        'Использовать Stream API и IntSummaryStatistics/LongSummaryStatistics',
        'Вывести историю, статистику и рекомендацию'
      ],
      expectedOutput: 'История цен: iPhone 15\n2024-01-15: 549990 KZT\n2024-02-20: 529990 KZT\n2024-03-10: 499990 KZT\n2024-04-01: 479990 KZT\n2024-05-15: 499990 KZT\n---\nМин: 479990 KZT (2024-04-01)\nМакс: 549990 KZT\nСредняя: 511990 KZT\nТренд: FALLING\nРекомендация: Цена снижается — хороший момент для покупки!',
      hint: 'LongSummaryStatistics через stream().mapToLong().summaryStatistics(). Для bestDate — min() с Comparator по цене. Тренд — сравни первую и последнюю цену.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record PriceEntry(String date, long priceKzt) {}

    enum Trend { RISING, FALLING, STABLE }

    static Trend detectTrend(long firstPrice, long lastPrice) {
        double change = (double)(lastPrice - firstPrice) / firstPrice * 100;
        if (change > 5) return Trend.RISING;
        if (change < -5) return Trend.FALLING;
        return Trend.STABLE;
    }

    static void analyze(String productName, List<PriceEntry> history) {
        System.out.println("История цен: " + productName);
        history.forEach(e -> System.out.println(e.date() + ": " + e.priceKzt() + " KZT"));
        System.out.println("---");

        LongSummaryStatistics stats = history.stream()
                .mapToLong(PriceEntry::priceKzt)
                .summaryStatistics();

        PriceEntry best = history.stream()
                .min(Comparator.comparingLong(PriceEntry::priceKzt))
                .orElseThrow();

        Trend trend = detectTrend(history.get(0).priceKzt(),
                history.get(history.size() - 1).priceKzt());

        System.out.println("Мин: " + stats.getMin() + " KZT (" + best.date() + ")");
        System.out.println("Макс: " + stats.getMax() + " KZT");
        System.out.println("Средняя: " + (long) stats.getAverage() + " KZT");
        System.out.println("Тренд: " + trend);

        String recommendation = switch (trend) {
            case FALLING -> "Цена снижается — хороший момент для покупки!";
            case RISING -> "Цена растёт — лучше поторопиться.";
            case STABLE -> "Цена стабильна — можно не спешить.";
        };
        System.out.println("Рекомендация: " + recommendation);
    }

    public static void main(String[] args) {
        List<PriceEntry> history = List.of(
            new PriceEntry("2024-01-15", 549990),
            new PriceEntry("2024-02-20", 529990),
            new PriceEntry("2024-03-10", 499990),
            new PriceEntry("2024-04-01", 479990),
            new PriceEntry("2024-05-15", 499990)
        );

        analyze("iPhone 15", history);
    }
}`,
      explanation: 'Отслеживание цен — ключевая функция для покупателей. Kaspi показывает историю цен прямо на карточке товара, что повышает доверие. Amazon CamelCamelCamel — популярный сторонний сервис для трекинга цен. Ozon и Wildberries используют ML для прогнозирования цен и уведомления пользователей о снижении. В backend данные хранятся в time-series БД (InfluxDB/TimescaleDB) — идеально для таких задач с временными рядами.'
    },
    {
      id: 9,
      title: 'Recommendation Engine — рекомендации товаров',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт: Analytics Team. MKT-720: Реализовать систему рекомендаций "С этим товаром покупают". Построить граф совместных покупок из истории заказов. Для заданного товара найти топ-N рекомендаций по частоте совместных покупок.',
      requirements: [
        'Record Order(String orderId, List<String> productIds)',
        'Построить граф совместных покупок: Map<String, Map<String, Integer>> — для каждого товара частота совместных покупок с другими',
        'Метод recommend(String productId, int topN) — возвращает топ-N рекомендаций',
        'Из рекомендаций исключить сам товар',
        'Сортировка по частоте (убывание), при равной частоте — по имени (алфавит)',
        'Вывод: "productId (совместных покупок: X)"'
      ],
      expectedOutput: 'Рекомендации для "iPhone 15":\n  Чехол iPhone (совместных покупок: 3)\n  AirPods Pro (совместных покупок: 2)\n  Защитное стекло (совместных покупок: 2)\n---\nРекомендации для "MacBook Pro":\n  Мышь Logitech (совместных покупок: 2)\n  USB-C хаб (совместных покупок: 2)',
      hint: 'Для каждого заказа перебирай все пары товаров (двойной цикл). Для каждой пары (A, B) увеличивай счётчик в графе для обоих направлений. Для рекомендаций сортируй entries по value (desc).',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Order(String orderId, List<String> productIds) {}

    static Map<String, Map<String, Integer>> buildCoPurchaseGraph(List<Order> orders) {
        Map<String, Map<String, Integer>> graph = new HashMap<>();
        for (Order order : orders) {
            List<String> items = order.productIds();
            for (int i = 0; i < items.size(); i++) {
                for (int j = 0; j < items.size(); j++) {
                    if (i == j) continue;
                    graph.computeIfAbsent(items.get(i), k -> new HashMap<>())
                         .merge(items.get(j), 1, Integer::sum);
                }
            }
        }
        return graph;
    }

    static List<String> recommend(Map<String, Map<String, Integer>> graph,
                                   String productId, int topN) {
        Map<String, Integer> related = graph.getOrDefault(productId, Map.of());
        return related.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed()
                        .thenComparing(Map.Entry::getKey))
                .limit(topN)
                .map(e -> e.getKey() + " (совместных покупок: " + e.getValue() + ")")
                .collect(Collectors.toList());
    }

    public static void main(String[] args) {
        List<Order> orders = List.of(
            new Order("O-1", List.of("iPhone 15", "Чехол iPhone", "AirPods Pro")),
            new Order("O-2", List.of("iPhone 15", "Чехол iPhone", "Защитное стекло")),
            new Order("O-3", List.of("iPhone 15", "Чехол iPhone", "AirPods Pro", "Защитное стекло")),
            new Order("O-4", List.of("MacBook Pro", "Мышь Logitech", "USB-C хаб")),
            new Order("O-5", List.of("MacBook Pro", "Мышь Logitech", "USB-C хаб")),
            new Order("O-6", List.of("Samsung TV", "HDMI кабель", "Саундбар"))
        );

        var graph = buildCoPurchaseGraph(orders);

        System.out.println("Рекомендации для \\"iPhone 15\\":");
        recommend(graph, "iPhone 15", 3).forEach(r -> System.out.println("  " + r));
        System.out.println("---");
        System.out.println("Рекомендации для \\"MacBook Pro\\":");
        recommend(graph, "MacBook Pro", 2).forEach(r -> System.out.println("  " + r));
    }
}`,
      explanation: 'Рекомендации "с этим товаром покупают" — один из главных драйверов продаж. Amazon генерирует 35% выручки через рекомендации. Наш подход — collaborative filtering на основе co-purchase матрицы. В реальности Ozon и Wildberries используют item-to-item collaborative filtering (алгоритм Amazon из 2003 года), дополненный ML-моделями (matrix factorization, neural collaborative filtering). Kaspi комбинирует рекомендации из покупок и просмотров. Граф совместных покупок обновляется batch-процессом через Apache Spark каждые несколько часов.'
    },
    {
      id: 10,
      title: 'Warehouse Routing — распределение заказов по складам',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт: Fulfillment Team. MKT-830: Реализовать алгоритм распределения заказов по складам. Каждый склад имеет координаты и список доступных товаров. Для заказа нужно найти оптимальный склад (или комбинацию складов), минимизируя расстояние до покупателя. Предпочтение — отправка с одного склада.',
      requirements: [
        'Record Warehouse(String id, String city, double lat, double lon, Set<String> products)',
        'Record CustomerOrder(String orderId, List<String> productIds, double customerLat, double customerLon)',
        'Метод routeOrder(CustomerOrder, List<Warehouse>) — найти лучший план отгрузки',
        'Сначала проверить: есть ли склад с ВСЕМИ товарами заказа (single-warehouse). Если да — выбрать ближайший',
        'Если нет — разбить заказ: для каждого товара найти ближайший склад (multi-warehouse)',
        'Расстояние: Math.sqrt((lat1-lat2)^2 + (lon1-lon2)^2) * 111 км',
        'Вывод плана: "orderId → warehouse (city), distance km — [products]"'
      ],
      expectedOutput: 'Заказ ORD-801 (Алматы):\n  [Единый склад] WH-ALM (Алматы), 5.5 км — [iPhone 15, Чехол iPhone]\n---\nЗаказ ORD-802 (Астана):\n  [Разделённый заказ]\n  WH-AST (Астана), 4.4 км — [MacBook Pro]\n  WH-ALM (Алматы), 1050.2 км — [AirPods Pro]',
      hint: 'Сначала filter склады, содержащие все товары (containsAll). Если найдены — min по расстоянию. Иначе — для каждого товара находи ближайший склад, содержащий его. Группируй товары по складу для вывода.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record Warehouse(String id, String city, double lat, double lon, Set<String> products) {}
    record CustomerOrder(String orderId, List<String> productIds, double customerLat, double customerLon) {}

    static double distance(double lat1, double lon1, double lat2, double lon2) {
        return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2)) * 111;
    }

    static void routeOrder(CustomerOrder order, List<Warehouse> warehouses) {
        double cLat = order.customerLat(), cLon = order.customerLon();
        Set<String> needed = new HashSet<>(order.productIds());

        // Попытка single-warehouse
        Optional<Warehouse> single = warehouses.stream()
                .filter(w -> w.products().containsAll(needed))
                .min(Comparator.comparingDouble(w -> distance(w.lat(), w.lon(), cLat, cLon)));

        System.out.println("Заказ " + order.orderId() + ":");
        if (single.isPresent()) {
            Warehouse w = single.get();
            double dist = distance(w.lat(), w.lon(), cLat, cLon);
            System.out.printf("  [Единый склад] %s (%s), %.1f км — %s%n",
                    w.id(), w.city(), dist, order.productIds());
        } else {
            System.out.println("  [Разделённый заказ]");
            Map<Warehouse, List<String>> plan = new LinkedHashMap<>();
            for (String productId : order.productIds()) {
                Warehouse best = warehouses.stream()
                        .filter(w -> w.products().contains(productId))
                        .min(Comparator.comparingDouble(w -> distance(w.lat(), w.lon(), cLat, cLon)))
                        .orElseThrow(() -> new RuntimeException("Товар " + productId + " отсутствует на складах"));
                plan.computeIfAbsent(best, k -> new ArrayList<>()).add(productId);
            }
            plan.forEach((w, products) -> {
                double dist = distance(w.lat(), w.lon(), cLat, cLon);
                System.out.printf("  %s (%s), %.1f км — %s%n", w.id(), w.city(), dist, products);
            });
        }
    }

    public static void main(String[] args) {
        List<Warehouse> warehouses = List.of(
            new Warehouse("WH-ALM", "Алматы", 43.25, 76.95,
                    Set.of("iPhone 15", "Чехол iPhone", "AirPods Pro", "Защитное стекло")),
            new Warehouse("WH-AST", "Астана", 51.13, 71.43,
                    Set.of("MacBook Pro", "Samsung TV", "iPhone 15")),
            new Warehouse("WH-SHM", "Шымкент", 42.32, 69.60,
                    Set.of("iPhone 15", "Samsung TV", "Чехол iPhone"))
        );

        CustomerOrder order1 = new CustomerOrder("ORD-801",
                List.of("iPhone 15", "Чехол iPhone"), 43.20, 76.90);
        routeOrder(order1, warehouses);

        System.out.println("---");

        CustomerOrder order2 = new CustomerOrder("ORD-802",
                List.of("MacBook Pro", "AirPods Pro"), 51.10, 71.40);
        routeOrder(order2, warehouses);
    }
}`,
      explanation: 'Warehouse routing — стратегически важная задача. Ozon распределяет заказы между 20+ складами по России, минимизируя стоимость и время доставки. Amazon использует supply chain optimization с учётом загруженности складов, стоимости доставки и SLA. Kaspi развивает сеть Kaspi Postomatов и сортировочных центров по Казахстану. Разделение заказа (split shipment) увеличивает стоимость логистики, поэтому single-warehouse всегда приоритетнее. В реальности добавляют факторы: загруженность склада, стоимость доставки, обещанное время SLA.'
    }
  ]
}
