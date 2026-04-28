export default {
  id: 113,
  title: 'Реальная разработка: Складская логистика',
  description: 'Задачи Java-разработчика в WMS: приёмка товара, размещение, сборка заказов, инвентаризация, маршрутизация и отгрузка.',
  lessons: [
    {
      id: 1,
      title: 'Product Registration: Приёмка товара',
      type: 'practice',
      difficulty: 'easy',
      description: 'Спринт команды Inbound. Jira-задача WMS-101: "Реализовать регистрацию входящей поставки". Товар прибывает на склад от поставщика — необходимо зарегистрировать каждую позицию: SKU, наименование, количество, поставщик, срок годности, вес. Система должна генерировать штрихкод в формате EAN-13 (упрощённый) и валидировать данные. Аналогичный модуль используется в SAP WMS и на складах Kaspi fulfillment.',
      requirements: [
        'Создай класс IncomingProduct с полями: sku, name, quantity, supplier, expiryDate (LocalDate), weightKg (double)',
        'Метод validate() — проверяет: quantity > 0, expiryDate не в прошлом, weightKg > 0, sku не пустой',
        'Метод generateBarcode(String sku) — генерирует штрихкод EAN-13: "200" + первые 9 цифр хэша SKU + контрольная цифра (сумма всех цифр % 10)',
        'Зарегистрируй 3 товара, выведи информацию и штрихкод. Один товар с невалидными данными (quantity = 0)'
      ],
      expectedOutput: `=== Приёмка товара на склад ===
Товар: Молоко Lactel 1л | SKU: MLK-001 | Кол-во: 500 | Поставщик: FoodDistrib KZ
Срок годности: 2026-05-15 | Вес: 1.05 кг
Штрихкод: 2004785361240
Статус: ПРИНЯТ

Товар: Рис Басмати 5кг | SKU: RCE-045 | Кол-во: 200 | Поставщик: AgroTrade
Срок годности: 2027-01-10 | Вес: 5.0 кг
Штрихкод: 2007283491560
Статус: ПРИНЯТ

Товар: Сок Добрый 1л | SKU: JCE-112 | Кол-во: 0 | Поставщик: BeverageCo
ОШИБКА: Количество должно быть > 0
Статус: ОТКЛОНЁН

Итого принято: 2 из 3 позиций`,
      hint: 'Для генерации EAN-13 используй Math.abs(sku.hashCode()) и форматируй через String.format("%09d", ...). Контрольная цифра — сумма всех 12 цифр % 10.',
      solution: `import java.time.LocalDate;

public class Main {
    static String[] skus = {"MLK-001", "RCE-045", "JCE-112"};
    static String[] names = {"Молоко Lactel 1л", "Рис Басмати 5кг", "Сок Добрый 1л"};
    static int[] quantities = {500, 200, 0};
    static String[] suppliers = {"FoodDistrib KZ", "AgroTrade", "BeverageCo"};
    static String[] expiryDates = {"2026-05-15", "2027-01-10", "2026-06-01"};
    static double[] weights = {1.05, 5.0, 1.0};

    static String generateBarcode(String sku) {
        long hash = Math.abs((long) sku.hashCode());
        String base = "200" + String.format("%09d", hash % 1000000000L);
        int sum = 0;
        for (char c : base.toCharArray()) {
            sum += c - '0';
        }
        return base + (sum % 10);
    }

    static boolean validate(int quantity, LocalDate expiryDate, double weightKg, String sku) {
        if (sku == null || sku.isEmpty()) {
            System.out.println("ОШИБКА: SKU не может быть пустым");
            return false;
        }
        if (quantity <= 0) {
            System.out.println("ОШИБКА: Количество должно быть > 0");
            return false;
        }
        if (expiryDate.isBefore(LocalDate.now())) {
            System.out.println("ОШИБКА: Срок годности истёк");
            return false;
        }
        if (weightKg <= 0) {
            System.out.println("ОШИБКА: Вес должен быть > 0");
            return false;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println("=== Приёмка товара на склад ===");
        int accepted = 0;

        for (int i = 0; i < skus.length; i++) {
            LocalDate expiry = LocalDate.parse(expiryDates[i]);
            System.out.println("Товар: " + names[i] + " | SKU: " + skus[i]
                + " | Кол-во: " + quantities[i] + " | Поставщик: " + suppliers[i]);

            boolean valid = validate(quantities[i], expiry, weights[i], skus[i]);

            if (valid) {
                System.out.println("Срок годности: " + expiryDates[i]
                    + " | Вес: " + weights[i] + " кг");
                System.out.println("Штрихкод: " + generateBarcode(skus[i]));
                System.out.println("Статус: ПРИНЯТ");
                accepted++;
            } else {
                System.out.println("Статус: ОТКЛОНЁН");
            }
            System.out.println();
        }
        System.out.println("Итого принято: " + accepted + " из " + skus.length + " позиций");
    }
}`,
      explanation: 'Приёмка товара — первый этап складской логистики. В реальных WMS-системах (SAP WMS, Oracle WMS) каждый товар проходит валидацию при поступлении. EAN-13 — международный стандарт штрихкодирования из 13 цифр. Валидация критична: просроченный товар или нулевое количество не должны попасть в систему. На складах Kaspi fulfillment аналогичный процесс автоматизирован через сканеры штрихкодов.'
    },
    {
      id: 2,
      title: 'Storage Location: Размещение на складе',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Storage. Jira-задача WMS-205: "Автоматическое назначение ячейки хранения". Склад разделён на зоны: A (приёмка), B (хранение), C (комплектация), D (отгрузка). В каждой зоне ряды 1-20, полки 1-5, позиции 1-10. Нужно автоматически назначить ячейку по типу товара и отслеживать заполненность. Формат адреса: "B-12-3-07". Используется на складах Wildberries для быстрого размещения.',
      requirements: [
        'Создай систему адресации: зона (A-D), ряд (1-20), полка (1-5), позиция (1-10)',
        'Каждая ячейка имеет вместимость (capacity) и текущую загрузку (used)',
        'Метод assignLocation(productType) — автоматически находит свободную ячейку в нужной зоне (FOOD→B-1..10, ELECTRONICS→B-11..20, FRAGILE→B-1..5 полка 1)',
        'Метод formatLocation(zone, row, shelf, pos) — возвращает строку "B-12-03-07"',
        'Размести 3 товара, покажи назначенные ячейки и загрузку зоны'
      ],
      expectedOutput: `=== Размещение товаров на складе ===
Товар: Молоко Lactel | Тип: FOOD
Назначена ячейка: B-03-02-01 | Вместимость: 50 | Занято: 1
Товар: iPhone 15 | Тип: ELECTRONICS
Назначена ячейка: B-11-01-01 | Вместимость: 30 | Занято: 1
Товар: Ваза хрустальная | Тип: FRAGILE
Назначена ячейка: B-01-01-01 | Вместимость: 20 | Занято: 1

--- Загрузка зоны B ---
Ряды 1-10 (FOOD): 1/500 (0.2%)
Ряды 11-20 (ELECTRONICS): 1/300 (0.3%)
Хрупкие (ряды 1-5, полка 1): 1/100 (1.0%)`,
      hint: 'Используй HashMap<String, int[]> где ключ — адрес ячейки, значение — {capacity, used}. Для поиска свободной ячейки перебирай ряды и позиции нужной зоны.',
      solution: `import java.util.*;

public class Main {
    static Map<String, int[]> cells = new HashMap<>();
    static int foodCount = 0, elecCount = 0, fragileCount = 0;

    static String formatLoc(String zone, int row, int shelf, int pos) {
        return zone + "-" + String.format("%02d", row) + "-"
            + String.format("%02d", shelf) + "-" + String.format("%02d", pos);
    }

    static void initCells() {
        for (int r = 1; r <= 20; r++) {
            for (int s = 1; s <= 5; s++) {
                for (int p = 1; p <= 10; p++) {
                    int cap = (r <= 10) ? 50 : 30;
                    if (r <= 5 && s == 1) cap = 20;
                    cells.put(formatLoc("B", r, s, p), new int[]{cap, 0});
                }
            }
        }
    }

    static String assignLocation(String productType) {
        int rowStart, rowEnd, shelfStart, shelfEnd;
        switch (productType) {
            case "FRAGILE":
                rowStart = 1; rowEnd = 5; shelfStart = 1; shelfEnd = 1;
                break;
            case "ELECTRONICS":
                rowStart = 11; rowEnd = 20; shelfStart = 1; shelfEnd = 5;
                break;
            default:
                rowStart = 1; rowEnd = 10; shelfStart = 1; shelfEnd = 5;
        }
        for (int r = rowStart; r <= rowEnd; r++) {
            for (int s = shelfStart; s <= shelfEnd; s++) {
                for (int p = 1; p <= 10; p++) {
                    String loc = formatLoc("B", r, s, p);
                    int[] cell = cells.get(loc);
                    if (cell[1] < cell[0]) {
                        cell[1]++;
                        return loc;
                    }
                }
            }
        }
        return "НЕТ МЕСТ";
    }

    public static void main(String[] args) {
        initCells();
        System.out.println("=== Размещение товаров на складе ===");

        String[] products = {"Молоко Lactel", "iPhone 15", "Ваза хрустальная"};
        String[] types = {"FOOD", "ELECTRONICS", "FRAGILE"};

        for (int i = 0; i < products.length; i++) {
            System.out.println("Товар: " + products[i] + " | Тип: " + types[i]);
            String loc = assignLocation(types[i]);
            int[] cell = cells.get(loc);
            System.out.println("Назначена ячейка: " + loc
                + " | Вместимость: " + cell[0] + " | Занято: " + cell[1]);
        }

        System.out.println();
        System.out.println("--- Загрузка зоны B ---");
        int foodUsed = 0, foodCap = 0, elecUsed = 0, elecCap = 0;
        int fragUsed = 0, fragCap = 0;
        for (var entry : cells.entrySet()) {
            String key = entry.getKey();
            int row = Integer.parseInt(key.split("-")[1]);
            int shelf = Integer.parseInt(key.split("-")[2]);
            if (row <= 10) { foodUsed += entry.getValue()[1]; foodCap += entry.getValue()[0]; }
            if (row >= 11) { elecUsed += entry.getValue()[1]; elecCap += entry.getValue()[0]; }
            if (row <= 5 && shelf == 1) { fragUsed += entry.getValue()[1]; fragCap += entry.getValue()[0]; }
        }
        System.out.printf("Ряды 1-10 (FOOD): %d/%d (%.1f%%)%n", foodUsed, foodCap,
            foodUsed * 100.0 / foodCap);
        System.out.printf("Ряды 11-20 (ELECTRONICS): %d/%d (%.1f%%)%n", elecUsed, elecCap,
            elecUsed * 100.0 / elecCap);
        System.out.printf("Хрупкие (ряды 1-5, полка 1): %d/%d (%.1f%%)%n", fragUsed, fragCap,
            fragUsed * 100.0 / fragCap);
    }
}`,
      explanation: 'Адресное хранение — основа современных WMS. Каждая ячейка имеет уникальный адрес (зона-ряд-полка-позиция). Автоматическое размещение по типу товара ускоряет приёмку и упрощает поиск. На складах Wildberries используется аналогичная адресация с зонированием по категориям. В SAP WMS это называется "putaway strategy" — стратегия размещения.'
    },
    {
      id: 3,
      title: 'Inventory Tracking: Остатки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Inventory. Jira-задача WMS-310: "Система учёта остатков в реальном времени". Необходимо отслеживать остатки по каждому SKU и локации. Поддержать резервирование (для заказов, ещё не собранных), списание и alert при достижении точки перезаказа (reorder point). Критически важно для Kaspi fulfillment — задержка обновления остатков = овер-продажи.',
      requirements: [
        'Map<String, Integer> stock — текущий остаток по SKU',
        'Map<String, Integer> reserved — зарезервированное количество по SKU',
        'Методы: getStock(sku), reserveStock(sku, qty), releaseReserve(sku, qty), deductStock(sku, qty)',
        'Alert если доступный остаток (stock - reserved) < reorderPoint',
        'Выведи отчёт по остаткам и алерты'
      ],
      expectedOutput: `=== Система учёта остатков ===
Загрузка начальных остатков...
MLK-001 (Молоко): 500 шт
RCE-045 (Рис): 200 шт
JCE-112 (Сок): 50 шт

--- Операции ---
Резерв: MLK-001 x 480 → OK (доступно: 20)
Резерв: JCE-112 x 45 → OK (доступно: 5)
⚠ ALERT: JCE-112 — доступно 5 шт, ниже reorder point (10)
Резерв: RCE-045 x 250 → ОШИБКА: недостаточно (доступно: 200)
Списание: MLK-001 x 480 → OK (остаток: 20)
Освобождение резерва: MLK-001 x 480

--- Отчёт по остаткам ---
SKU        | Остаток | Резерв | Доступно | Статус
MLK-001    |      20 |      0 |       20 | ⚠ НИЗКИЙ
RCE-045    |     200 |      0 |      200 | ✓ OK
JCE-112    |      50 |     45 |        5 | ⚠ НИЗКИЙ`,
      hint: 'Доступный остаток = stock.get(sku) - reserved.get(sku). Резервирование не списывает товар — оно только "блокирует" его для конкретного заказа.',
      solution: `import java.util.*;

public class Main {
    static Map<String, Integer> stock = new LinkedHashMap<>();
    static Map<String, Integer> reserved = new LinkedHashMap<>();
    static Map<String, String> names = new LinkedHashMap<>();
    static Map<String, Integer> reorderPoints = new HashMap<>();

    static int getAvailable(String sku) {
        return stock.getOrDefault(sku, 0) - reserved.getOrDefault(sku, 0);
    }

    static boolean reserveStock(String sku, int qty) {
        int available = getAvailable(sku);
        if (qty > available) {
            System.out.println("Резерв: " + sku + " x " + qty
                + " → ОШИБКА: недостаточно (доступно: " + available + ")");
            return false;
        }
        reserved.merge(sku, qty, Integer::sum);
        int newAvailable = getAvailable(sku);
        System.out.println("Резерв: " + sku + " x " + qty
            + " → OK (доступно: " + newAvailable + ")");
        int reorder = reorderPoints.getOrDefault(sku, 10);
        if (newAvailable < reorder) {
            System.out.println("⚠ ALERT: " + sku + " — доступно " + newAvailable
                + " шт, ниже reorder point (" + reorder + ")");
        }
        return true;
    }

    static void releaseReserve(String sku, int qty) {
        int cur = reserved.getOrDefault(sku, 0);
        reserved.put(sku, Math.max(0, cur - qty));
        System.out.println("Освобождение резерва: " + sku + " x " + qty);
    }

    static void deductStock(String sku, int qty) {
        int cur = stock.getOrDefault(sku, 0);
        stock.put(sku, cur - qty);
        System.out.println("Списание: " + sku + " x " + qty
            + " → OK (остаток: " + stock.get(sku) + ")");
    }

    public static void main(String[] args) {
        System.out.println("=== Система учёта остатков ===");
        System.out.println("Загрузка начальных остатков...");

        stock.put("MLK-001", 500); names.put("MLK-001", "Молоко");
        stock.put("RCE-045", 200); names.put("RCE-045", "Рис");
        stock.put("JCE-112", 50);  names.put("JCE-112", "Сок");
        for (String sku : stock.keySet()) reserved.put(sku, 0);
        reorderPoints.put("MLK-001", 30);
        reorderPoints.put("RCE-045", 20);
        reorderPoints.put("JCE-112", 10);

        for (var e : stock.entrySet()) {
            System.out.println(e.getKey() + " (" + names.get(e.getKey())
                + "): " + e.getValue() + " шт");
        }

        System.out.println("\n--- Операции ---");
        reserveStock("MLK-001", 480);
        reserveStock("JCE-112", 45);
        reserveStock("RCE-045", 250);
        deductStock("MLK-001", 480);
        releaseReserve("MLK-001", 480);

        System.out.println("\n--- Отчёт по остаткам ---");
        System.out.printf("%-10s | %7s | %6s | %8s | %s%n",
            "SKU", "Остаток", "Резерв", "Доступно", "Статус");
        for (String sku : stock.keySet()) {
            int s = stock.get(sku);
            int r = reserved.get(sku);
            int a = s - r;
            int rp = reorderPoints.getOrDefault(sku, 10);
            String status = a < rp ? "⚠ НИЗКИЙ" : "✓ OK";
            System.out.printf("%-10s | %7d | %6d | %8d | %s%n", sku, s, r, a, status);
        }
    }
}`,
      explanation: 'Управление остатками — сердце WMS. Резервирование (soft lock) критически важно: товар ещё на полке, но уже забронирован под заказ. Без резервирования возникают овер-продажи — один товар продан нескольким клиентам. В Kaspi fulfillment и Oracle WMS система остатков обновляется в реальном времени. Reorder point — точка, при которой нужно заказать новую партию у поставщика.'
    },
    {
      id: 4,
      title: 'Order Picking: Сборка заказов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Outbound. Jira-задача WMS-412: "Генерация picking-листа с оптимальным маршрутом". Когда приходит заказ, система должна определить, где лежит каждый товар, сгенерировать picking-лист и оптимизировать маршрут сборщика — сортировка по зоне → ряду → полке для минимизации пробега. Аналогичная логика используется на складах Wildberries.',
      requirements: [
        'Класс PickItem: sku, name, quantity, location (zone-row-shelf-pos)',
        'Метод generatePickList(order) — находит товары на складе и создаёт список сборки',
        'Метод optimizeRoute(pickList) — сортирует по зоне, затем ряду, затем полке',
        'Рассчитай оценочное время сборки (30 сек на позицию + 15 сек переход между рядами)',
        'Трекинг: собрано / осталось'
      ],
      expectedOutput: `=== Сборка заказа ORD-20260407-001 ===
Позиций в заказе: 4

--- Picking лист (оптимизированный маршрут) ---
#1 | B-02-01-03 | MLK-001 Молоко        | Кол-во: 2 | [ ]
#2 | B-03-02-05 | YGT-008 Йогурт        | Кол-во: 3 | [ ]
#3 | B-08-04-01 | BRD-019 Хлеб          | Кол-во: 1 | [ ]
#4 | B-14-01-02 | PHN-055 Чехол Samsung  | Кол-во: 1 | [ ]

Оценочное время сборки: 3 мин 30 сек
Переходы между рядами: 3

--- Процесс сборки ---
✓ Собрано: MLK-001 Молоко x2 (1/4)
✓ Собрано: YGT-008 Йогурт x3 (2/4)
✓ Собрано: BRD-019 Хлеб x1 (3/4)
✓ Собрано: PHN-055 Чехол Samsung x1 (4/4)

Заказ ORD-20260407-001 полностью собран!
Фактическое время: 3 мин 15 сек`,
      hint: 'Для оптимизации маршрута используй Comparator.comparing() с цепочкой thenComparing() — сначала по зоне, потом по ряду, потом по полке.',
      solution: `import java.util.*;

public class Main {
    static String[] itemSkus = {"MLK-001", "YGT-008", "BRD-019", "PHN-055"};
    static String[] itemNames = {"Молоко", "Йогурт", "Хлеб", "Чехол Samsung"};
    static int[] itemQtys = {2, 3, 1, 1};
    static String[] itemLocs = {"B-02-01-03", "B-03-02-05", "B-08-04-01", "B-14-01-02"};

    static int getRow(String loc) { return Integer.parseInt(loc.split("-")[1]); }
    static int getShelf(String loc) { return Integer.parseInt(loc.split("-")[2]); }
    static String getZone(String loc) { return loc.split("-")[0]; }

    public static void main(String[] args) {
        String orderId = "ORD-20260407-001";
        System.out.println("=== Сборка заказа " + orderId + " ===");
        System.out.println("Позиций в заказе: " + itemSkus.length);

        Integer[] indices = {0, 1, 2, 3};
        Arrays.sort(indices, (a, b) -> {
            int cmp = getZone(itemLocs[a]).compareTo(getZone(itemLocs[b]));
            if (cmp != 0) return cmp;
            cmp = getRow(itemLocs[a]) - getRow(itemLocs[b]);
            if (cmp != 0) return cmp;
            return getShelf(itemLocs[a]) - getShelf(itemLocs[b]);
        });

        System.out.println("\n--- Picking лист (оптимизированный маршрут) ---");
        int transitions = 0;
        int prevRow = -1;
        for (int n = 0; n < indices.length; n++) {
            int i = indices[n];
            int row = getRow(itemLocs[i]);
            if (prevRow != -1 && row != prevRow) transitions++;
            prevRow = row;
            System.out.printf("#%d | %s | %s %-16s | Кол-во: %d | [ ]%n",
                n + 1, itemLocs[i], itemSkus[i], itemNames[i], itemQtys[i]);
        }

        int pickTimeSec = indices.length * 30 + transitions * 15;
        System.out.printf("%nОценочное время сборки: %d мин %d сек%n",
            pickTimeSec / 60, pickTimeSec % 60);
        System.out.println("Переходы между рядами: " + transitions);

        System.out.println("\n--- Процесс сборки ---");
        for (int n = 0; n < indices.length; n++) {
            int i = indices[n];
            System.out.printf("✓ Собрано: %s %s x%d (%d/%d)%n",
                itemSkus[i], itemNames[i], itemQtys[i],
                n + 1, indices.length);
        }

        int actualSec = pickTimeSec - 15;
        System.out.printf("%nЗаказ %s полностью собран!%n", orderId);
        System.out.printf("Фактическое время: %d мин %d сек%n",
            actualSec / 60, actualSec % 60);
    }
}`,
      explanation: 'Оптимизация маршрута сборки (pick path optimization) — одна из ключевых функций WMS. На больших складах Wildberries сборщик проходит 10-15 км за смену, и оптимальный маршрут сокращает пробег на 30-40%. Сортировка по зоне → ряд → полка — базовый S-образный маршрут (serpentine strategy). В SAP WMS используются более сложные алгоритмы с учётом приоритета товаров и весовых ограничений.'
    },
    {
      id: 5,
      title: 'Batch & Expiry: Партии и сроки годности',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Storage. Jira-задача WMS-518: "Управление партиями и FIFO-принцип". Для продовольственных товаров критически важно соблюдать FIFO (First In, First Out) — сначала отгружаются старые партии. Система должна отслеживать партии, предупреждать об истекающих сроках и блокировать просроченные товары. На складах Kaspi fulfillment просроченные товары автоматически блокируются.',
      requirements: [
        'Класс Batch: batchId, sku, productionDate, expiryDate, quantity, location',
        'Метод pickByFIFO(sku, qty) — выбирает партии начиная с самой старой (по productionDate)',
        'Метод getExpiringBatches(days) — возвращает партии, истекающие через N дней',
        'Блокировка: если expiryDate <= сегодня → статус BLOCKED, нельзя отгружать',
        'Отчёт: скоро истекающие и просроченные партии'
      ],
      expectedOutput: `=== Управление партиями ===
Загружено 5 партий для SKU: MLK-001

--- Все партии (отсортированы по дате производства) ---
BTH-001 | Произв: 2026-02-10 | Годен до: 2026-04-12 | Кол-во: 100 | ⚠ ИСТЕКАЕТ ЧЕРЕЗ 5 ДНЕЙ
BTH-002 | Произв: 2026-02-20 | Годен до: 2026-04-25 | Кол-во: 150 | ✓ OK
BTH-003 | Произв: 2026-03-01 | Годен до: 2026-05-01 | Кол-во: 200 | ✓ OK
BTH-004 | Произв: 2026-03-15 | Годен до: 2026-05-15 | Кол-во: 120 | ✓ OK
BTH-005 | Произв: 2025-12-01 | Годен до: 2026-04-01 | Кол-во: 80 | 🚫 ПРОСРОЧЕНО

--- FIFO-сборка: нужно 200 шт MLK-001 ---
Партия BTH-005 ЗАБЛОКИРОВАНА — пропуск
Взято из BTH-001: 100 шт (осталось в партии: 0)
Взято из BTH-002: 100 шт (осталось в партии: 50)
Итого собрано: 200 шт из 2 партий

--- Отчёт по срокам ---
⚠ Истекает в течение 30 дней: 1 партия (100 шт)
🚫 Просрочено: 1 партия (80 шт) — требуется списание на 24 000 KZT`,
      hint: 'Отсортируй партии по productionDate. При FIFO-сборке пропускай BLOCKED партии, из каждой бери Math.min(нужно, доступно).',
      solution: `import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

public class Main {
    static String[] batchIds = {"BTH-001","BTH-002","BTH-003","BTH-004","BTH-005"};
    static String[] prodDates = {"2026-02-10","2026-02-20","2026-03-01","2026-03-15","2025-12-01"};
    static String[] expDates = {"2026-04-12","2026-04-25","2026-05-01","2026-05-15","2026-04-01"};
    static int[] quantities = {100, 150, 200, 120, 80};
    static double pricePerUnit = 300.0;
    static LocalDate today = LocalDate.of(2026, 4, 7);

    static boolean isExpired(int i) {
        return LocalDate.parse(expDates[i]).isBefore(today) || LocalDate.parse(expDates[i]).isEqual(today);
    }

    static long daysUntilExpiry(int i) {
        return ChronoUnit.DAYS.between(today, LocalDate.parse(expDates[i]));
    }

    public static void main(String[] args) {
        System.out.println("=== Управление партиями ===");
        System.out.println("Загружено " + batchIds.length + " партий для SKU: MLK-001");

        Integer[] sorted = {0, 1, 2, 3, 4};
        Arrays.sort(sorted, Comparator.comparing(i -> LocalDate.parse(prodDates[i])));

        System.out.println("\n--- Все партии (отсортированы по дате производства) ---");
        for (int i : sorted) {
            long days = daysUntilExpiry(i);
            String status;
            if (isExpired(i)) {
                status = "🚫 ПРОСРОЧЕНО";
            } else if (days <= 30) {
                status = "⚠ ИСТЕКАЕТ ЧЕРЕЗ " + days + " ДНЕЙ";
            } else {
                status = "✓ OK";
            }
            System.out.printf("%s | Произв: %s | Годен до: %s | Кол-во: %d | %s%n",
                batchIds[i], prodDates[i], expDates[i], quantities[i], status);
        }

        int need = 200;
        System.out.println("\n--- FIFO-сборка: нужно " + need + " шт MLK-001 ---");
        int totalPicked = 0;
        int batchesUsed = 0;
        int[] remaining = Arrays.copyOf(quantities, quantities.length);

        for (int i : sorted) {
            if (totalPicked >= need) break;
            if (isExpired(i)) {
                System.out.println("Партия " + batchIds[i] + " ЗАБЛОКИРОВАНА — пропуск");
                continue;
            }
            int take = Math.min(need - totalPicked, remaining[i]);
            remaining[i] -= take;
            totalPicked += take;
            batchesUsed++;
            System.out.println("Взято из " + batchIds[i] + ": " + take
                + " шт (осталось в партии: " + remaining[i] + ")");
        }
        System.out.println("Итого собрано: " + totalPicked + " шт из " + batchesUsed + " партий");

        System.out.println("\n--- Отчёт по срокам ---");
        int expiringCount = 0, expiringQty = 0;
        int expiredCount = 0, expiredQty = 0;
        for (int i = 0; i < batchIds.length; i++) {
            if (isExpired(i)) {
                expiredCount++; expiredQty += quantities[i];
            } else if (daysUntilExpiry(i) <= 30) {
                expiringCount++; expiringQty += quantities[i];
            }
        }
        System.out.printf("⚠ Истекает в течение 30 дней: %d партия (%d шт)%n",
            expiringCount, expiringQty);
        System.out.printf("🚫 Просрочено: %d партия (%d шт) — требуется списание на %.0f KZT%n",
            expiredCount, expiredQty, expiredQty * pricePerUnit);
    }
}`,
      explanation: 'FIFO (First In, First Out) — обязательный принцип для продовольственных складов. Сначала отгружаются самые старые партии, чтобы минимизировать просрочку. Блокировка просроченных партий предотвращает отгрузку некачественного товара. В Oracle WMS и SAP WMS batch management — отдельный модуль с автоматическими алертами. На складах Kaspi fulfillment просроченный товар автоматически перемещается в зону списания.'
    },
    {
      id: 6,
      title: 'Shipping: Отгрузка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Outbound. Jira-задача WMS-620: "Подготовка и отгрузка заказа". После сборки заказа необходимо: проверить комплектность, рассчитать вес и объём, выбрать перевозчика по весу и направлению, сгенерировать транспортную накладную с трек-номером "WH-YYYYMMDD-XXXX" и распечатать упаковочный лист.',
      requirements: [
        'Проверь что все позиции заказа собраны (picked == ordered)',
        'Рассчитай общий вес (кг) и объём (м³)',
        'Выбор перевозчика: до 5кг → KazPost (500 KZT), до 30кг → Pony Express (1500 KZT), >30кг → JetLogistics (3000 KZT)',
        'Генерация трек-номера в формате WH-YYYYMMDD-XXXX (XXXX — случайный)',
        'Вывод: накладная + упаковочный лист'
      ],
      expectedOutput: `=== Отгрузка заказа ORD-20260407-001 ===

--- Проверка комплектности ---
✓ MLK-001 Молоко x2 — собрано
✓ YGT-008 Йогурт x3 — собрано
✓ BRD-019 Хлеб x1 — собрано
Статус: ВСЕ ПОЗИЦИИ СОБРАНЫ

--- Расчёт груза ---
Общий вес: 8.45 кг
Общий объём: 0.032 м³
Кол-во мест: 1

--- Выбор перевозчика ---
Перевозчик: Pony Express (до 30 кг)
Стоимость доставки: 1 500 KZT
Направление: Алматы → Астана

--- Транспортная накладная ---
Трек-номер: WH-20260407-4827
Отправитель: Склад WH-01, Алматы
Получатель: Иванов А.К., Астана
Дата отгрузки: 2026-04-07
Перевозчик: Pony Express

--- Упаковочный лист ---
#1 | MLK-001 | Молоко         | 2 шт | 2.10 кг
#2 | YGT-008 | Йогурт         | 3 шт | 1.35 кг
#3 | BRD-019 | Хлеб           | 1 шт | 0.50 кг
                        ИТОГО: 6 шт | 3.95 кг
Подпись кладовщика: _________ Дата: 2026-04-07`,
      hint: 'Для трек-номера используй String.format("WH-%s-%04d", date, random.nextInt(10000)). Перевозчика выбирай через if-else по общему весу.',
      solution: `import java.util.*;

public class Main {
    static String[] skus = {"MLK-001", "YGT-008", "BRD-019"};
    static String[] names = {"Молоко", "Йогурт", "Хлеб"};
    static int[] ordered = {2, 3, 1};
    static int[] picked = {2, 3, 1};
    static double[] unitWeights = {1.05, 0.45, 0.50};
    static double[] unitVolumes = {0.002, 0.001, 0.005};

    public static void main(String[] args) {
        String orderId = "ORD-20260407-001";
        String date = "2026-04-07";
        System.out.println("=== Отгрузка заказа " + orderId + " ===");

        System.out.println("\n--- Проверка комплектности ---");
        boolean allPicked = true;
        for (int i = 0; i < skus.length; i++) {
            if (picked[i] == ordered[i]) {
                System.out.println("✓ " + skus[i] + " " + names[i]
                    + " x" + ordered[i] + " — собрано");
            } else {
                System.out.println("✗ " + skus[i] + " " + names[i]
                    + " x" + ordered[i] + " — собрано только " + picked[i]);
                allPicked = false;
            }
        }
        System.out.println("Статус: " + (allPicked ? "ВСЕ ПОЗИЦИИ СОБРАНЫ" : "НЕКОМПЛЕКТ"));

        double totalWeight = 0, totalVolume = 0;
        int totalQty = 0;
        for (int i = 0; i < skus.length; i++) {
            totalWeight += unitWeights[i] * picked[i];
            totalVolume += unitVolumes[i] * picked[i];
            totalQty += picked[i];
        }
        // Добавляем вес упаковки
        double packWeight = totalWeight * 0.1;
        double shipWeight = totalWeight + packWeight;

        System.out.println("\n--- Расчёт груза ---");
        System.out.printf("Общий вес: %.2f кг%n", shipWeight);
        System.out.printf("Общий объём: %.3f м³%n", totalVolume);
        System.out.println("Кол-во мест: 1");

        String carrier;
        int cost;
        if (shipWeight <= 5) {
            carrier = "KazPost (до 5 кг)"; cost = 500;
        } else if (shipWeight <= 30) {
            carrier = "Pony Express (до 30 кг)"; cost = 1500;
        } else {
            carrier = "JetLogistics (> 30 кг)"; cost = 3000;
        }

        System.out.println("\n--- Выбор перевозчика ---");
        System.out.println("Перевозчик: " + carrier);
        System.out.printf("Стоимость доставки: %,d KZT%n", cost);
        System.out.println("Направление: Алматы → Астана");

        Random rnd = new Random(42);
        String trackNumber = String.format("WH-%s-%04d",
            date.replace("-", ""), rnd.nextInt(10000));

        System.out.println("\n--- Транспортная накладная ---");
        System.out.println("Трек-номер: " + trackNumber);
        System.out.println("Отправитель: Склад WH-01, Алматы");
        System.out.println("Получатель: Иванов А.К., Астана");
        System.out.println("Дата отгрузки: " + date);
        System.out.println("Перевозчик: " + carrier.split(" \\(")[0]);

        System.out.println("\n--- Упаковочный лист ---");
        double printedWeight = 0;
        for (int i = 0; i < skus.length; i++) {
            double w = unitWeights[i] * picked[i];
            printedWeight += w;
            System.out.printf("#%d | %s | %-14s | %d шт | %.2f кг%n",
                i + 1, skus[i], names[i], picked[i], w);
        }
        System.out.printf("                        ИТОГО: %d шт | %.2f кг%n",
            totalQty, printedWeight);
        System.out.println("Подпись кладовщика: _________ Дата: " + date);
    }
}`,
      explanation: 'Отгрузка — финальный этап складской обработки заказа. Проверка комплектности предотвращает отправку неполных заказов. Выбор перевозчика по весу и направлению оптимизирует стоимость доставки. Трек-номер с префиксом склада обеспечивает трассировку. В WMS-системах транспортная накладная автоматически передаётся в TMS (Transport Management System). На складах Kaspi fulfillment этот процесс полностью автоматизирован.'
    },
    {
      id: 7,
      title: 'Returns Processing: Возвраты',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Inbound. Jira-задача WMS-725: "Обработка возвратов с классификацией качества". Возвращённый товар проходит инспекцию: GOOD → возврат на полку, DAMAGED → списание, DEFECTIVE → возврат поставщику. Каждый возврат документируется. На Wildberries и Kaspi возврат — до 15% от всех заказов.',
      requirements: [
        'Классификация: GOOD (товарный вид), DAMAGED (повреждён), DEFECTIVE (брак производителя)',
        'GOOD → restock: вернуть на склад, обновить остатки',
        'DAMAGED → write-off: списать, зафиксировать убыток',
        'DEFECTIVE → supplier return: оформить возврат поставщику',
        'Сгенерировать документ возврата и рассчитать сумму возврата клиенту'
      ],
      expectedOutput: `=== Обработка возвратов ===
Заказ: ORD-20260401-033 | Клиент: Петрова М.А.

--- Инспекция товаров ---
#1 | PHN-055 Чехол Samsung | Причина: Не подошёл размер
   Состояние: GOOD → Возврат на полку B-14-01-02
   Возврат клиенту: 4 500 KZT

#2 | HDN-012 Наушники JBL | Причина: Не работает левый динамик
   Состояние: DEFECTIVE → Возврат поставщику (TechSupply KZ)
   Возврат клиенту: 15 900 KZT

#3 | CUP-088 Кружка керамическая | Причина: Разбита при доставке
   Состояние: DAMAGED → Списание
   Возврат клиенту: 2 200 KZT
   Убыток склада: 1 800 KZT

--- Итоги возвратов ---
Всего позиций: 3
Возврат на склад: 1 (товар восстановлен)
Возврат поставщику: 1 (претензия оформлена)
Списание: 1 (убыток: 1 800 KZT)
Общая сумма возврата клиенту: 22 600 KZT

Документ возврата: RET-20260407-033 сформирован`,
      hint: 'Используй switch по состоянию товара. Для DAMAGED рассчитай убыток как costPrice. Для GOOD обнови stock. Для DEFECTIVE создай supplier claim.',
      solution: `public class Main {
    static String[] skus = {"PHN-055", "HDN-012", "CUP-088"};
    static String[] names = {"Чехол Samsung", "Наушники JBL", "Кружка керамическая"};
    static String[] reasons = {"Не подошёл размер", "Не работает левый динамик",
        "Разбита при доставке"};
    static String[] conditions = {"GOOD", "DEFECTIVE", "DAMAGED"};
    static int[] refundPrices = {4500, 15900, 2200};
    static int[] costPrices = {3200, 11000, 1800};
    static String[] locations = {"B-14-01-02", "", ""};
    static String[] suppliers = {"", "TechSupply KZ", ""};

    public static void main(String[] args) {
        System.out.println("=== Обработка возвратов ===");
        System.out.println("Заказ: ORD-20260401-033 | Клиент: Петрова М.А.");
        System.out.println("\n--- Инспекция товаров ---");

        int restocked = 0, supplierReturn = 0, writtenOff = 0;
        int totalRefund = 0, totalLoss = 0;

        for (int i = 0; i < skus.length; i++) {
            System.out.printf("#%d | %s %s | Причина: %s%n",
                i + 1, skus[i], names[i], reasons[i]);

            switch (conditions[i]) {
                case "GOOD":
                    System.out.println("   Состояние: GOOD → Возврат на полку "
                        + locations[i]);
                    restocked++;
                    break;
                case "DEFECTIVE":
                    System.out.println("   Состояние: DEFECTIVE → Возврат поставщику ("
                        + suppliers[i] + ")");
                    supplierReturn++;
                    break;
                case "DAMAGED":
                    System.out.println("   Состояние: DAMAGED → Списание");
                    totalLoss += costPrices[i];
                    writtenOff++;
                    break;
            }

            totalRefund += refundPrices[i];
            System.out.printf("   Возврат клиенту: %,d KZT%n", refundPrices[i]);
            if (conditions[i].equals("DAMAGED")) {
                System.out.printf("   Убыток склада: %,d KZT%n", costPrices[i]);
            }
            System.out.println();
        }

        System.out.println("--- Итоги возвратов ---");
        System.out.println("Всего позиций: " + skus.length);
        System.out.println("Возврат на склад: " + restocked + " (товар восстановлен)");
        System.out.println("Возврат поставщику: " + supplierReturn
            + " (претензия оформлена)");
        System.out.printf("Списание: %d (убыток: %,d KZT)%n", writtenOff, totalLoss);
        System.out.printf("Общая сумма возврата клиенту: %,d KZT%n", totalRefund);
        System.out.println("\nДокумент возврата: RET-20260407-033 сформирован");
    }
}`,
      explanation: 'Обработка возвратов — важный бизнес-процесс в e-commerce логистике. На Wildberries и Kaspi возвраты составляют 10-15% от заказов. Классификация качества определяет дальнейшую судьбу товара: качественный возвращается в оборот, бракованный — поставщику (с претензией), повреждённый — списывается. В SAP WMS это модуль "Returns Management" с автоматической маршрутизацией по результатам инспекции.'
    },
    {
      id: 8,
      title: 'Inventory Count: Инвентаризация',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спринт команды Inventory. Jira-задача WMS-830: "Проведение инвентаризации и обработка расхождений". Сравнить системные остатки с фактическим подсчётом, найти расхождения (излишки, недостачи), рассчитать стоимость расхождений и обновить остатки после утверждения. Инвентаризация на складах проводится минимум раз в квартал.',
      requirements: [
        'Системные остатки (из БД) vs фактический подсчёт (физический обход)',
        'Найти расхождения: surplus (факт > система), shortage (факт < система)',
        'Рассчитать стоимость каждого расхождения (quantity * unitPrice)',
        'Сгенерировать акт инвентаризации',
        'Обновить остатки после "утверждения" (симулировать approval)'
      ],
      expectedOutput: `=== Инвентаризация склада WH-01 ===
Дата: 2026-04-07 | Зона: B (хранение)

--- Сверка остатков ---
SKU        | Наименование       | Система | Факт | Разница | Статус
MLK-001    | Молоко Lactel      |     500 |  498 |      -2 | НЕДОСТАЧА
RCE-045    | Рис Басмати        |     200 |  200 |       0 | OK
JCE-112    | Сок Добрый         |      50 |   53 |      +3 | ИЗЛИШЕК
PHN-055    | Чехол Samsung      |      80 |   78 |      -2 | НЕДОСТАЧА
HDN-012    | Наушники JBL       |      30 |   30 |       0 | OK

--- Расхождения ---
MLK-001: недостача 2 шт × 300 KZT = 600 KZT
JCE-112: излишек 3 шт × 450 KZT = 1 350 KZT
PHN-055: недостача 2 шт × 4 500 KZT = 9 000 KZT

Итого недостача: 9 600 KZT
Итого излишек: 1 350 KZT
Чистый убыток: 8 250 KZT

--- Утверждение ---
✓ Акт инвентаризации INV-20260407-01 утверждён
✓ Остатки обновлены по фактическим данным`,
      hint: 'Разница = фактическое - системное. Если < 0 — недостача, если > 0 — излишек. Используй Math.abs() для расчёта стоимости.',
      solution: `public class Main {
    static String[] skus = {"MLK-001", "RCE-045", "JCE-112", "PHN-055", "HDN-012"};
    static String[] names = {"Молоко Lactel", "Рис Басмати", "Сок Добрый",
        "Чехол Samsung", "Наушники JBL"};
    static int[] systemQty = {500, 200, 50, 80, 30};
    static int[] actualQty = {498, 200, 53, 78, 30};
    static int[] unitPrices = {300, 850, 450, 4500, 15900};

    public static void main(String[] args) {
        System.out.println("=== Инвентаризация склада WH-01 ===");
        System.out.println("Дата: 2026-04-07 | Зона: B (хранение)");

        System.out.println("\n--- Сверка остатков ---");
        System.out.printf("%-10s | %-18s | %7s | %4s | %7s | %s%n",
            "SKU", "Наименование", "Система", "Факт", "Разница", "Статус");

        for (int i = 0; i < skus.length; i++) {
            int diff = actualQty[i] - systemQty[i];
            String status;
            String diffStr;
            if (diff < 0) {
                status = "НЕДОСТАЧА";
                diffStr = String.valueOf(diff);
            } else if (diff > 0) {
                status = "ИЗЛИШЕК";
                diffStr = "+" + diff;
            } else {
                status = "OK";
                diffStr = "0";
            }
            System.out.printf("%-10s | %-18s | %7d | %4d | %7s | %s%n",
                skus[i], names[i], systemQty[i], actualQty[i], diffStr, status);
        }

        System.out.println("\n--- Расхождения ---");
        int totalShortage = 0, totalSurplus = 0;
        for (int i = 0; i < skus.length; i++) {
            int diff = actualQty[i] - systemQty[i];
            if (diff == 0) continue;
            int cost = Math.abs(diff) * unitPrices[i];
            if (diff < 0) {
                System.out.printf("%s: недостача %d шт × %,d KZT = %,d KZT%n",
                    skus[i], Math.abs(diff), unitPrices[i], cost);
                totalShortage += cost;
            } else {
                System.out.printf("%s: излишек %d шт × %,d KZT = %,d KZT%n",
                    skus[i], diff, unitPrices[i], cost);
                totalSurplus += cost;
            }
        }

        System.out.printf("%nИтого недостача: %,d KZT%n", totalShortage);
        System.out.printf("Итого излишек: %,d KZT%n", totalSurplus);
        System.out.printf("Чистый убыток: %,d KZT%n", totalShortage - totalSurplus);

        System.out.println("\n--- Утверждение ---");
        System.out.println("✓ Акт инвентаризации INV-20260407-01 утверждён");

        for (int i = 0; i < skus.length; i++) {
            systemQty[i] = actualQty[i];
        }
        System.out.println("✓ Остатки обновлены по фактическим данным");
    }
}`,
      explanation: 'Инвентаризация — процесс сверки системных данных с реальными остатками на складе. Недостача может означать воровство, ошибки при сборке или учёте. Излишек — ошибки при приёмке. В Oracle WMS инвентаризация проводится cycle count (постоянный подсчёт по зонам) и full inventory (полная ревизия). Акт инвентаризации — юридический документ, на основании которого корректируются остатки и списываются убытки.'
    },
    {
      id: 9,
      title: 'Warehouse KPIs: Метрики склада',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт команды Analytics. Jira-задача WMS-935: "Дашборд ключевых метрик склада". Построить дашборд с KPI: заказы в день, точность сборки, среднее время сборки, утилизация площади, оборачиваемость запасов, процент брака. Каждый KPI сравнивается с целевым значением и получает статус: зелёный (в норме), жёлтый (внимание), красный (проблема).',
      requirements: [
        'Метрики: ordersPerDay, pickAccuracy%, avgPickTimeMin, spaceUtilization%, stockTurnover, damagedRate%',
        'Целевые значения (targets) для каждой метрики',
        'Логика статуса: GREEN (≥ target), YELLOW (≥ 80% target), RED (< 80% target). Для damagedRate и avgPickTime — инверсия (меньше = лучше)',
        'Сравнение текущей недели с прошлой (trend: ↑ ↓ →)',
        'Итоговый статус склада: GREEN/YELLOW/RED по худшему показателю'
      ],
      expectedOutput: `=== Дашборд KPI склада WH-01 ===
Период: 01.04.2026 — 07.04.2026

Метрика                | Факт    | Цель    | %     | Тренд | Статус
Заказов/день           |     285 |     300 | 95.0% |   ↑   | 🟢 GREEN
Точность сборки        |  98.5%  |  99.0%  | 99.5% |   →   | 🟢 GREEN
Среднее время сборки   |   4.2м  |   5.0м  | 84.0% |   ↑   | 🟢 GREEN
Утилизация площади     |  78.0%  |  85.0%  | 91.8% |   ↓   | 🟡 YELLOW
Оборачиваемость запаса |    8.5  |   10.0  | 85.0% |   ↓   | 🟡 YELLOW
Процент брака          |  0.8%   |  0.5%   | 62.5% |   ↑   | 🔴 RED

--- Анализ ---
⚠ Утилизация площади: ниже целевого. Рекомендация: оптимизировать размещение
⚠ Оборачиваемость: замедление. Рекомендация: ревизия ассортимента
🚨 Процент брака: критически высокий. Рекомендация: аудит процесса приёмки

Общий статус склада: 🔴 RED (есть критические показатели)
Рекомендация: провести разбор с командами Inbound и Storage`,
      hint: 'Для инверсных метрик (время, брак) — меньше значит лучше. Рассчитывай achievement как target/actual для таких метрик. Статус определяй по achievement: >= 100% GREEN, >= 80% YELLOW, < 80% RED.',
      solution: `public class Main {
    static String[] metricNames = {
        "Заказов/день", "Точность сборки", "Среднее время сборки",
        "Утилизация площади", "Оборачиваемость запаса", "Процент брака"
    };
    static double[] actuals = {285, 98.5, 4.2, 78.0, 8.5, 0.8};
    static double[] targets = {300, 99.0, 5.0, 85.0, 10.0, 0.5};
    static double[] prevWeek = {270, 98.5, 4.5, 80.0, 9.0, 0.7};
    static boolean[] inverse = {false, false, true, false, false, true};
    static String[] units = {"", "%", "м", "%", "", "%"};

    static double achievement(int i) {
        if (inverse[i]) {
            return (targets[i] / actuals[i]) * 100.0;
        }
        return (actuals[i] / targets[i]) * 100.0;
    }

    static String status(int i) {
        double ach = achievement(i);
        if (ach >= 95) return "🟢 GREEN";
        if (ach >= 80) return "🟡 YELLOW";
        return "🔴 RED";
    }

    static String trend(int i) {
        boolean better;
        if (inverse[i]) {
            better = actuals[i] < prevWeek[i];
        } else {
            better = actuals[i] > prevWeek[i];
        }
        if (Math.abs(actuals[i] - prevWeek[i]) < 0.01) return "→";
        return better ? "↑" : "↓";
    }

    public static void main(String[] args) {
        System.out.println("=== Дашборд KPI склада WH-01 ===");
        System.out.println("Период: 01.04.2026 — 07.04.2026");
        System.out.println();

        System.out.printf("%-22s | %7s | %7s | %5s | %5s | %s%n",
            "Метрика", "Факт", "Цель", "%", "Тренд", "Статус");

        int worstLevel = 0; // 0=green, 1=yellow, 2=red

        for (int i = 0; i < metricNames.length; i++) {
            String factStr;
            String targetStr;
            if (units[i].equals("%")) {
                factStr = String.format("%.1f%%", actuals[i]);
                targetStr = String.format("%.1f%%", targets[i]);
            } else if (units[i].equals("м")) {
                factStr = String.format("%.1f%s", actuals[i], units[i]);
                targetStr = String.format("%.1f%s", targets[i], units[i]);
            } else {
                factStr = String.format("%.0f", actuals[i]);
                targetStr = String.format("%.0f", targets[i]);
            }

            double ach = achievement(i);
            String st = status(i);
            String tr = trend(i);

            System.out.printf("%-22s | %7s | %7s | %4.1f%% | %3s   | %s%n",
                metricNames[i], factStr, targetStr, ach, tr, st);

            if (st.contains("RED")) worstLevel = 2;
            else if (st.contains("YELLOW") && worstLevel < 2) worstLevel = 1;
        }

        System.out.println("\n--- Анализ ---");
        for (int i = 0; i < metricNames.length; i++) {
            double ach = achievement(i);
            if (ach >= 95) continue;
            if (ach >= 80) {
                String rec = "";
                if (i == 3) rec = "оптимизировать размещение";
                else if (i == 4) rec = "ревизия ассортимента";
                else rec = "обратить внимание";
                System.out.println("⚠ " + metricNames[i]
                    + ": ниже целевого. Рекомендация: " + rec);
            } else {
                String rec = "";
                if (i == 5) rec = "аудит процесса приёмки";
                else rec = "немедленное расследование";
                System.out.println("🚨 " + metricNames[i]
                    + ": критически высокий. Рекомендация: " + rec);
            }
        }

        String[] levels = {"🟢 GREEN", "🟡 YELLOW", "🔴 RED"};
        String[] reasons = {
            "(все показатели в норме)",
            "(есть показатели требующие внимания)",
            "(есть критические показатели)"
        };
        System.out.println("\nОбщий статус склада: " + levels[worstLevel]
            + " " + reasons[worstLevel]);
        if (worstLevel == 2) {
            System.out.println("Рекомендация: провести разбор с командами Inbound и Storage");
        }
    }
}`,
      explanation: 'KPI дашборд — инструмент управления складом. Ключевые метрики: заказы/день (производительность), точность сборки (качество), время сборки (скорость), утилизация (эффективность пространства), оборачиваемость (скорость продаж), брак (потери). В SAP WMS и Oracle WMS дашборды обновляются в реальном времени. Инверсные метрики (время, брак) — чем меньше, тем лучше. Общий статус определяется по худшему показателю — один красный KPI делает весь склад "красным".'
    },
    {
      id: 10,
      title: 'Multi-warehouse: Распределение по складам',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спринт команды Analytics. Jira-задача WMS-1042: "Оптимальная маршрутизация заказа по сети складов". Заказ нужно направить на оптимальный склад: есть товар в наличии, ближайший к клиенту, минимальная загруженность. Если ни один склад не имеет полного набора — разделить заказ между складами. Рассчитать стоимость доставки по каждому варианту. Аналог логики Kaspi fulfillment и Wildberries multi-warehouse.',
      requirements: [
        'Склады: WH-ALA (Алматы), WH-AST (Астана), WH-SHY (Шымкент) — каждый с остатками и загрузкой',
        'Для каждого склада: проверить наличие всех товаров заказа',
        'Рассчитать стоимость доставки по расстоянию (10 KZT/км × вес)',
        'Если один склад имеет всё — выбрать cheapest. Если нет — split order по складам',
        'Вывести все варианты и выбрать оптимальный'
      ],
      expectedOutput: `=== Маршрутизация заказа ORD-20260407-055 ===
Клиент: Сергеев И.Л., Караганда
Позиции: MLK-001 x10, RCE-045 x5, PHN-055 x2

--- Проверка складов ---
WH-ALA (Алматы):   MLK-001 ✓(500)  RCE-045 ✓(200)  PHN-055 ✓(80)  | Загрузка: 72%
  Расстояние: 950 км | Стоимость: 14 250 KZT
WH-AST (Астана):    MLK-001 ✓(300)  RCE-045 ✓(150)  PHN-055 ✗(0)   | Загрузка: 85%
  Расстояние: 230 км | НЕ ПОЛНЫЙ НАБОР
WH-SHY (Шымкент):  MLK-001 ✓(400)  RCE-045 ✗(0)    PHN-055 ✓(45)  | Загрузка: 60%
  Расстояние: 1200 км | НЕ ПОЛНЫЙ НАБОР

--- Варианты ---
Вариант 1: Один склад WH-ALA → 14 250 KZT
Вариант 2: Split WH-AST + WH-SHY
  WH-AST → MLK-001 x10, RCE-045 x5 (230 км) = 5 175 KZT
  WH-SHY → PHN-055 x2 (1200 км) = 2 400 KZT
  Итого: 7 575 KZT

✓ Оптимальный: Вариант 2 (split) — экономия 6 675 KZT
Заказы созданы: SUB-055-AST, SUB-055-SHY`,
      hint: 'Сначала проверь каждый склад на полный набор. Если есть — рассчитай стоимость. Для split: жадно назначай товары ближайшему складу, который их имеет.',
      solution: `import java.util.*;

public class Main {
    static String[] warehouses = {"WH-ALA", "WH-AST", "WH-SHY"};
    static String[] cities = {"Алматы", "Астана", "Шымкент"};
    static int[] distances = {950, 230, 1200};
    static int[] loadPercent = {72, 85, 60};

    static String[] orderSkus = {"MLK-001", "RCE-045", "PHN-055"};
    static String[] orderNames = {"Молоко", "Рис", "Чехол Samsung"};
    static int[] orderQtys = {10, 5, 2};
    static double[] orderWeights = {1.05, 5.0, 0.15};

    // stock[warehouse][sku]
    static int[][] stock = {
        {500, 200, 80},
        {300, 150, 0},
        {400, 0, 45}
    };

    static double calcShipping(int distKm, double totalWeightKg) {
        return distKm * 10.0 * (totalWeightKg / (totalWeightKg + 5));
    }

    public static void main(String[] args) {
        System.out.println("=== Маршрутизация заказа ORD-20260407-055 ===");
        System.out.println("Клиент: Сергеев И.Л., Караганда");
        System.out.print("Позиции: ");
        for (int i = 0; i < orderSkus.length; i++) {
            if (i > 0) System.out.print(", ");
            System.out.print(orderSkus[i] + " x" + orderQtys[i]);
        }
        System.out.println();

        System.out.println("\n--- Проверка складов ---");
        int fullWarehouse = -1;
        double fullWarehouseCost = Double.MAX_VALUE;

        for (int w = 0; w < warehouses.length; w++) {
            System.out.printf("%s (%s): ", warehouses[w], cities[w]);
            boolean hasAll = true;
            double totalWeight = 0;

            for (int s = 0; s < orderSkus.length; s++) {
                boolean has = stock[w][s] >= orderQtys[s];
                System.out.printf("  %s %s(%d)", orderSkus[s],
                    has ? "✓" : "✗", stock[w][s]);
                if (!has) hasAll = false;
                if (has) totalWeight += orderWeights[s] * orderQtys[s];
            }
            System.out.printf("  | Загрузка: %d%%%n", loadPercent[w]);

            if (hasAll) {
                totalWeight = 0;
                for (int s = 0; s < orderSkus.length; s++) {
                    totalWeight += orderWeights[s] * orderQtys[s];
                }
                double cost = calcShipping(distances[w], totalWeight);
                System.out.printf("  Расстояние: %d км | Стоимость: %,.0f KZT%n",
                    distances[w], cost);
                if (cost < fullWarehouseCost) {
                    fullWarehouse = w;
                    fullWarehouseCost = cost;
                }
            } else {
                System.out.printf("  Расстояние: %d км | НЕ ПОЛНЫЙ НАБОР%n",
                    distances[w]);
            }
        }

        System.out.println("\n--- Варианты ---");

        if (fullWarehouse >= 0) {
            System.out.printf("Вариант 1: Один склад %s → %,.0f KZT%n",
                warehouses[fullWarehouse], fullWarehouseCost);
        }

        // Split: assign each SKU to closest warehouse that has it
        Map<Integer, List<Integer>> splitAssign = new LinkedHashMap<>();
        double splitTotalCost = 0;

        for (int s = 0; s < orderSkus.length; s++) {
            int bestWh = -1;
            int bestDist = Integer.MAX_VALUE;
            for (int w = 0; w < warehouses.length; w++) {
                if (stock[w][s] >= orderQtys[s] && distances[w] < bestDist) {
                    bestDist = distances[w];
                    bestWh = w;
                }
            }
            if (bestWh >= 0) {
                splitAssign.computeIfAbsent(bestWh, k -> new ArrayList<>()).add(s);
            }
        }

        if (splitAssign.size() > 1) {
            System.out.print("Вариант 2: Split");
            List<Integer> whList = new ArrayList<>(splitAssign.keySet());
            for (int i = 0; i < whList.size(); i++) {
                if (i > 0) System.out.print(" +");
                System.out.print(" " + warehouses[whList.get(i)]);
            }
            System.out.println();

            for (var entry : splitAssign.entrySet()) {
                int w = entry.getKey();
                List<Integer> items = entry.getValue();
                double weight = 0;
                StringBuilder sb = new StringBuilder();
                for (int idx = 0; idx < items.size(); idx++) {
                    int s = items.get(idx);
                    if (idx > 0) sb.append(", ");
                    sb.append(orderSkus[s]).append(" x").append(orderQtys[s]);
                    weight += orderWeights[s] * orderQtys[s];
                }
                double cost = calcShipping(distances[w], weight);
                splitTotalCost += cost;
                System.out.printf("  %s → %s (%d км) = %,.0f KZT%n",
                    warehouses[w], sb, distances[w], cost);
            }
            System.out.printf("  Итого: %,.0f KZT%n", splitTotalCost);
        }

        System.out.println();
        if (splitAssign.size() > 1 && splitTotalCost < fullWarehouseCost) {
            System.out.printf("✓ Оптимальный: Вариант 2 (split) — экономия %,.0f KZT%n",
                fullWarehouseCost - splitTotalCost);
            String[] suffixes = {"ALA", "AST", "SHY"};
            for (int w : splitAssign.keySet()) {
                System.out.printf("Заказ создан: SUB-055-%s%n", suffixes[w]);
            }
        } else if (fullWarehouse >= 0) {
            System.out.printf("✓ Оптимальный: Вариант 1 (%s) — один склад%n",
                warehouses[fullWarehouse]);
        }
    }
}`,
      explanation: 'Multi-warehouse fulfillment — сложная задача логистики. Kaspi и Wildberries используют сеть складов по Казахстану и России. Оптимальный выбор склада учитывает: наличие товара, расстояние до клиента, загруженность склада. Split order (разделение заказа) может быть выгоднее, если товары распределены по разным складам ближе к клиенту. В реальных системах это NP-задача, решаемая через линейное программирование или жадные эвристики.'
    }
  ]
}
