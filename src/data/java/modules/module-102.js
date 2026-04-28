export default {
  id: 102,
  title: 'Проект с нуля: Sprint 0 — Фундамент',
  description: 'Ты присоединился к стартапу QuickBite. Первый спринт: структура проекта, конфиги, модели данных, подключение БД и первый API endpoint.',
  lessons: [
    {
      id: 1,
      title: 'Project Init: Структура пакетов',
      type: 'practice',
      difficulty: 'easy',
      description: 'Добро пожаловать в QuickBite! Ты — новый Java-разработчик в стартапе по доставке еды в Казахстане. CTO на онбординге говорит: "Первое, что нужно сделать — создать структуру проекта. У нас Spring Boot, стандартная слоистая архитектура: controller, service, repository, dto, entity, config. Начни с конфигурации приложения." Создай enum AppConfig с константами приложения и методом, выводящим информацию о проекте.',
      requirements: [
        'Создай enum AppConfig с полями: APP_NAME("QuickBite"), VERSION("1.0.0"), BASE_URL("/api/v1")',
        'Каждый элемент enum хранит строковое значение (value)',
        'Метод getValue() возвращает значение константы',
        'Статический метод printProjectInfo() выводит информацию о проекте',
        'Выведи структуру пакетов проекта (controller, service, repository, dto, entity, config)'
      ],
      expectedOutput: `=== QuickBite Project Info ===
App Name: QuickBite
Version: 1.0.0
Base URL: /api/v1

=== Структура пакетов ===
kz.quickbite
├── controller/
├── service/
├── repository/
├── dto/
├── entity/
└── config/

Проект инициализирован!`,
      hint: 'Используй enum с конструктором, принимающим String value. Для printProjectInfo пройдись по values() или обратись к каждому элементу напрямую.',
      solution: `public class Main {
    enum AppConfig {
        APP_NAME("QuickBite"),
        VERSION("1.0.0"),
        BASE_URL("/api/v1");

        private final String value;

        AppConfig(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        public static void printProjectInfo() {
            System.out.println("=== " + APP_NAME.getValue() + " Project Info ===");
            System.out.println("App Name: " + APP_NAME.getValue());
            System.out.println("Version: " + VERSION.getValue());
            System.out.println("Base URL: " + BASE_URL.getValue());
        }
    }

    public static void main(String[] args) {
        AppConfig.printProjectInfo();

        System.out.println();
        System.out.println("=== Структура пакетов ===");
        System.out.println("kz.quickbite");

        String[] packages = {"controller", "service", "repository", "dto", "entity", "config"};
        for (int i = 0; i < packages.length; i++) {
            String prefix = (i == packages.length - 1) ? "└── " : "├── ";
            System.out.println(prefix + packages[i] + "/");
        }

        System.out.println();
        System.out.println("Проект инициализирован!");
    }
}`,
      explanation: 'В реальном Spring Boot проекте структура пакетов — это основа архитектуры. Controller обрабатывает HTTP-запросы, Service содержит бизнес-логику, Repository работает с БД, DTO — объекты для передачи данных, Entity — модели БД, Config — конфигурация. Enum для констант — чистый подход вместо магических строк разбросанных по коду.'
    },
    {
      id: 2,
      title: 'Entity: Модель ресторана',
      type: 'practice',
      difficulty: 'easy',
      description: 'CTO на дейли: "Начнём с ресторанов — это ядро нашей системы. Создай модель данных для ресторана. Не забудь валидацию — мы не хотим мусор в базе." Создай класс Restaurant с полями и валидацией, а затем создай несколько тестовых ресторанов.',
      requirements: [
        'Создай enum CuisineType: KAZAKH, KOREAN, ITALIAN, JAPANESE, FAST_FOOD',
        'Создай класс Restaurant с полями: id (int), name (String), address (String), rating (double), cuisineType (CuisineType), isActive (boolean)',
        'Метод validate() возвращает boolean: name не пустой, rating от 1.0 до 5.0',
        'Метод toString() с красивым форматированием',
        'Создай 3 тестовых ресторана и выведи их, проверь валидацию'
      ],
      expectedOutput: `=== Рестораны QuickBite ===

[ID: 1] Баурсак House
   Адрес: ул. Абая 15, Алматы
   Кухня: KAZAKH | Рейтинг: ★★★★☆ (4.5)
   Статус: Активен

[ID: 2] Seoul Kitchen
   Адрес: ул. Сатпаева 22, Алматы
   Кухня: KOREAN | Рейтинг: ★★★★★ (4.8)
   Статус: Активен

[ID: 3] Pizza Roma
   Адрес: пр. Назарбаева 44, Алматы
   Кухня: ITALIAN | Рейтинг: ★★★★☆ (4.2)
   Статус: Активен

=== Валидация ===
Баурсак House: valid = true
Невалидный (пустое имя): valid = false
Невалидный (рейтинг 6.0): valid = false`,
      hint: 'Для рейтинга в звёздах используй Math.round() и повтори символ ★ нужное количество раз, остальное заполни ☆.',
      solution: `public class Main {
    enum CuisineType { KAZAKH, KOREAN, ITALIAN, JAPANESE, FAST_FOOD }

    static int id;
    static String name;
    static String address;
    static double rating;
    static CuisineType cuisineType;
    static boolean isActive;

    static int[] ids = new int[10];
    static String[] names = new String[10];
    static String[] addresses = new String[10];
    static double[] ratings = new double[10];
    static CuisineType[] cuisineTypes = new CuisineType[10];
    static boolean[] actives = new boolean[10];
    static int count = 0;

    static int addRestaurant(int id, String name, String address,
                              double rating, CuisineType cuisine, boolean active) {
        int idx = count++;
        ids[idx] = id;
        names[idx] = name;
        addresses[idx] = address;
        ratings[idx] = rating;
        cuisineTypes[idx] = cuisine;
        actives[idx] = active;
        return idx;
    }

    static boolean validate(int idx) {
        return names[idx] != null && !names[idx].isEmpty()
            && ratings[idx] >= 1.0 && ratings[idx] <= 5.0;
    }

    static boolean validateData(String n, double r) {
        return n != null && !n.isEmpty() && r >= 1.0 && r <= 5.0;
    }

    static String ratingStars(double r) {
        int full = (int) Math.round(r);
        return "★".repeat(full) + "☆".repeat(5 - full);
    }

    static void printRestaurant(int idx) {
        System.out.println("[ID: " + ids[idx] + "] " + names[idx]);
        System.out.println("   Адрес: " + addresses[idx]);
        System.out.println("   Кухня: " + cuisineTypes[idx]
            + " | Рейтинг: " + ratingStars(ratings[idx])
            + " (" + ratings[idx] + ")");
        System.out.println("   Статус: " + (actives[idx] ? "Активен" : "Неактивен"));
    }

    public static void main(String[] args) {
        addRestaurant(1, "Баурсак House", "ул. Абая 15, Алматы",
            4.5, CuisineType.KAZAKH, true);
        addRestaurant(2, "Seoul Kitchen", "ул. Сатпаева 22, Алматы",
            4.8, CuisineType.KOREAN, true);
        addRestaurant(3, "Pizza Roma", "пр. Назарбаева 44, Алматы",
            4.2, CuisineType.ITALIAN, true);

        System.out.println("=== Рестораны QuickBite ===");
        for (int i = 0; i < count; i++) {
            System.out.println();
            printRestaurant(i);
        }

        System.out.println();
        System.out.println("=== Валидация ===");
        System.out.println(names[0] + ": valid = " + validate(0));
        System.out.println("Невалидный (пустое имя): valid = " + validateData("", 4.0));
        System.out.println("Невалидный (рейтинг 6.0): valid = " + validateData("Test", 6.0));
    }
}`,
      explanation: 'В реальном Spring Boot проекте Restaurant был бы @Entity с аннотациями JPA (@Id, @Column, @Enumerated). Валидация делается через Bean Validation (@NotBlank, @Min, @Max). Мы симулируем это чистой Java. CuisineType как enum — правильный подход: фиксированный набор значений вместо строк.'
    },
    {
      id: 3,
      title: 'Entity: Модель блюда',
      type: 'practice',
      difficulty: 'easy',
      description: 'Тимлид на ревью: "Ресторан есть — теперь нужно меню. Создай модель блюда с категориями. И покажи, как красиво вывести меню ресторана, сгруппировав блюда по категориям." Создай класс MenuItem и выведи меню, сгруппированное по категориям.',
      requirements: [
        'Создай enum Category: BURGER, PIZZA, SUSHI, DRINKS, DESSERT',
        'Класс/запись MenuItem с полями: id (int), restaurantId (int), name (String), price (int), category (Category), available (boolean)',
        'Валидация: price > 0',
        'Создай 8+ блюд для ресторана и выведи меню, сгруппированное по категориям',
        'Покажи итоговое количество позиций и средний чек'
      ],
      expectedOutput: `=== Меню ресторана #1 ===

🍔 BURGER:
  1. Classic Burger ............. 2500 тг
  2. Double Cheese Burger ....... 3500 тг

🍕 PIZZA:
  3. Margherita ................. 3200 тг
  4. Pepperoni .................. 3800 тг

🍣 SUSHI:
  5. Philadelphia Roll .......... 4200 тг
  6. Dragon Roll ................ 4800 тг

🥤 DRINKS:
  7. Coca-Cola .................. 500 тг
  8. Зеленый чай ................ 400 тг

🍰 DESSERT:
  9. Чизкейк ................... 1800 тг
  10. Тирамису .................. 2200 тг

Всего позиций: 10
Средняя цена: 2690 тг

Валидация цены 0: false
Валидация цены 2500: true`,
      hint: 'Для группировки по категориям пройдись по всем Category.values() и для каждой категории выведи блюда, фильтруя массив. Для форматирования используй String.format или точки для выравнивания.',
      solution: `public class Main {
    enum Category {
        BURGER("🍔"), PIZZA("🍕"), SUSHI("🍣"), DRINKS("🥤"), DESSERT("🍰");
        final String icon;
        Category(String icon) { this.icon = icon; }
    }

    static int[] ids = new int[20];
    static int[] restaurantIds = new int[20];
    static String[] itemNames = new String[20];
    static int[] prices = new int[20];
    static Category[] categories = new Category[20];
    static boolean[] availables = new boolean[20];
    static int itemCount = 0;

    static void addItem(int id, int restId, String name, int price,
                         Category cat, boolean available) {
        ids[itemCount] = id;
        restaurantIds[itemCount] = restId;
        itemNames[itemCount] = name;
        prices[itemCount] = price;
        categories[itemCount] = cat;
        availables[itemCount] = available;
        itemCount++;
    }

    static boolean validatePrice(int price) {
        return price > 0;
    }

    static String padWithDots(String name, int totalWidth) {
        int dots = totalWidth - name.length();
        if (dots < 2) dots = 2;
        return name + " " + ".".repeat(dots) + " ";
    }

    public static void main(String[] args) {
        addItem(1, 1, "Classic Burger", 2500, Category.BURGER, true);
        addItem(2, 1, "Double Cheese Burger", 3500, Category.BURGER, true);
        addItem(3, 1, "Margherita", 3200, Category.PIZZA, true);
        addItem(4, 1, "Pepperoni", 3800, Category.PIZZA, true);
        addItem(5, 1, "Philadelphia Roll", 4200, Category.SUSHI, true);
        addItem(6, 1, "Dragon Roll", 4800, Category.SUSHI, true);
        addItem(7, 1, "Coca-Cola", 500, Category.DRINKS, true);
        addItem(8, 1, "Зеленый чай", 400, Category.DRINKS, true);
        addItem(9, 1, "Чизкейк", 1800, Category.DESSERT, true);
        addItem(10, 1, "Тирамису", 2200, Category.DESSERT, true);

        System.out.println("=== Меню ресторана #1 ===");

        for (Category cat : Category.values()) {
            System.out.println();
            System.out.println(cat.icon + " " + cat + ":");
            for (int i = 0; i < itemCount; i++) {
                if (categories[i] == cat && restaurantIds[i] == 1) {
                    System.out.println("  " + ids[i] + ". "
                        + padWithDots(itemNames[i], 24) + prices[i] + " тг");
                }
            }
        }

        int total = 0;
        for (int i = 0; i < itemCount; i++) total += prices[i];

        System.out.println();
        System.out.println("Всего позиций: " + itemCount);
        System.out.println("Средняя цена: " + (total / itemCount) + " тг");

        System.out.println();
        System.out.println("Валидация цены 0: " + validatePrice(0));
        System.out.println("Валидация цены 2500: " + validatePrice(2500));
    }
}`,
      explanation: 'В реальном проекте MenuItem — это @Entity, связанная с Restaurant через @ManyToOne. Категории хранятся как @Enumerated(EnumType.STRING) в БД. Группировка в реальном API делается через Collectors.groupingBy() в Stream API. Мы симулируем это итерацией по категориям — тот же принцип, просто без стримов.'
    },
    {
      id: 4,
      title: 'Entity: Модель заказа',
      type: 'practice',
      difficulty: 'medium',
      description: 'CTO на планировании: "Заказ — самая важная сущность. Он связывает клиента, ресторан и блюда. Нужны статусы, таймстемпы, расчёт суммы. Продумай жизненный цикл заказа от создания до доставки." Создай модель заказа с элементами, статусами и вычислением итога.',
      requirements: [
        'Создай enum OrderStatus: CREATED, CONFIRMED, PREPARING, DELIVERING, DELIVERED, CANCELLED',
        'Класс OrderItem с полями: name (String), price (int), quantity (int) и метод getTotal()',
        'Класс Order с полями: id, items (массив OrderItem), status, createdAt (String), вместимость до 10 items',
        'Методы: addItem(), calculateTotal(), printOrder()',
        'Продемонстрируй жизненный цикл заказа: создание → подтверждение → готовка → доставка'
      ],
      expectedOutput: `=== Новый заказ #1 ===
Статус: CREATED
Время: 2025-01-15 12:30

Позиции:
  1. Classic Burger    x2    5000 тг
  2. Pepperoni         x1    3800 тг
  3. Coca-Cola         x3    1500 тг
─────────────────────────────
Итого: 10300 тг

=== Жизненный цикл заказа ===
[CREATED] → Заказ создан
[CONFIRMED] → Ресторан принял заказ
[PREPARING] → Готовится
[DELIVERING] → Курьер в пути
[DELIVERED] → Доставлен!

=== Валидация ===
Пустой заказ валиден: false
Заказ с позициями валиден: true`,
      hint: 'Для OrderItem используй record или простой класс. Для жизненного цикла заказа просто меняй статус и выводи переход.',
      solution: `public class Main {
    enum OrderStatus {
        CREATED("Заказ создан"),
        CONFIRMED("Ресторан принял заказ"),
        PREPARING("Готовится"),
        DELIVERING("Курьер в пути"),
        DELIVERED("Доставлен!"),
        CANCELLED("Отменён");

        final String description;
        OrderStatus(String desc) { this.description = desc; }
    }

    // OrderItem fields
    static String[] itemNames = new String[10];
    static int[] itemPrices = new int[10];
    static int[] itemQuantities = new int[10];
    static int itemCount = 0;

    // Order fields
    static int orderId = 1;
    static OrderStatus status = OrderStatus.CREATED;
    static String createdAt = "2025-01-15 12:30";

    static void addItem(String name, int price, int quantity) {
        itemNames[itemCount] = name;
        itemPrices[itemCount] = price;
        itemQuantities[itemCount] = quantity;
        itemCount++;
    }

    static int getItemTotal(int idx) {
        return itemPrices[idx] * itemQuantities[idx];
    }

    static int calculateTotal() {
        int total = 0;
        for (int i = 0; i < itemCount; i++) {
            total += getItemTotal(i);
        }
        return total;
    }

    static boolean isValid() {
        return itemCount > 0;
    }

    static void printOrder() {
        System.out.println("=== Новый заказ #" + orderId + " ===");
        System.out.println("Статус: " + status);
        System.out.println("Время: " + createdAt);
        System.out.println();
        System.out.println("Позиции:");
        for (int i = 0; i < itemCount; i++) {
            System.out.printf("  %d. %-17s x%d    %d тг%n",
                i + 1, itemNames[i], itemQuantities[i], getItemTotal(i));
        }
        System.out.println("─────────────────────────────");
        System.out.println("Итого: " + calculateTotal() + " тг");
    }

    public static void main(String[] args) {
        addItem("Classic Burger", 2500, 2);
        addItem("Pepperoni", 3800, 1);
        addItem("Coca-Cola", 500, 3);

        printOrder();

        System.out.println();
        System.out.println("=== Жизненный цикл заказа ===");
        OrderStatus[] lifecycle = {
            OrderStatus.CREATED, OrderStatus.CONFIRMED,
            OrderStatus.PREPARING, OrderStatus.DELIVERING,
            OrderStatus.DELIVERED
        };
        for (OrderStatus s : lifecycle) {
            status = s;
            System.out.println("[" + s + "] → " + s.description);
        }

        System.out.println();
        System.out.println("=== Валидация ===");
        int savedCount = itemCount;
        itemCount = 0;
        System.out.println("Пустой заказ валиден: " + isValid());
        itemCount = savedCount;
        System.out.println("Заказ с позициями валиден: " + isValid());
    }
}`,
      explanation: 'В реальном проекте Order — центральная сущность с @OneToMany к OrderItem. Статусы управляются через State Machine (Spring Statemachine) с валидными переходами. Нельзя перейти из DELIVERED в PREPARING. Timestamps хранятся как LocalDateTime с аннотацией @CreatedDate. Расчёт суммы может включать скидки, налоги, стоимость доставки.'
    },
    {
      id: 5,
      title: 'Repository: Хранилище данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Тимлид на код-ревью: "Пока базу данных не подключаем — сделай in-memory хранилище. Но интерфейс должен быть такой, чтобы потом легко заменить на JPA Repository. Стандартные CRUD + поиск по кухне и минимальному рейтингу." Реализуй RestaurantRepository с CRUD и поиском.',
      requirements: [
        'Создай класс RestaurantRepository с ArrayList внутри',
        'Методы: save(Restaurant), findById(int), findAll(), findByCuisine(String), findByMinRating(double)',
        'findById возвращает null если не найдено',
        'findByCuisine фильтрует по типу кухни',
        'findByMinRating возвращает рестораны с рейтингом >= заданного',
        'Продемонстрируй все CRUD операции и поиск'
      ],
      expectedOutput: `=== RestaurantRepository: CRUD Demo ===

Сохранено: Баурсак House (id=1)
Сохранено: Seoul Kitchen (id=2)
Сохранено: Pizza Roma (id=3)
Сохранено: Sushi Master (id=4)
Сохранено: BurgerKing (id=5)

Все рестораны (5):
  #1 Баурсак House [KAZAKH] ★4.5
  #2 Seoul Kitchen [KOREAN] ★4.8
  #3 Pizza Roma [ITALIAN] ★4.2
  #4 Sushi Master [JAPANESE] ★3.9
  #5 BurgerKing [FAST_FOOD] ★3.5

findById(2): Seoul Kitchen
findById(99): null

findByCuisine(KAZAKH):
  #1 Баурсак House [KAZAKH] ★4.5

findByMinRating(4.5):
  #1 Баурсак House [KAZAKH] ★4.5
  #2 Seoul Kitchen [KOREAN] ★4.8`,
      hint: 'Используй ArrayList<int[]> или параллельные массивы для хранения. Для фильтрации пройдись по списку и собери подходящие элементы в новый список.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    // Restaurant fields stored in parallel lists
    static List<Integer> ids = new ArrayList<>();
    static List<String> names = new ArrayList<>();
    static List<String> addresses = new ArrayList<>();
    static List<Double> ratings = new ArrayList<>();
    static List<String> cuisines = new ArrayList<>();
    static List<Boolean> actives = new ArrayList<>();

    // Repository methods
    static void save(int id, String name, String address,
                     double rating, String cuisine, boolean active) {
        ids.add(id);
        names.add(name);
        addresses.add(address);
        ratings.add(rating);
        cuisines.add(cuisine);
        actives.add(active);
        System.out.println("Сохранено: " + name + " (id=" + id + ")");
    }

    static int findById(int id) {
        for (int i = 0; i < ids.size(); i++) {
            if (ids.get(i) == id) return i;
        }
        return -1;
    }

    static List<Integer> findAll() {
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < ids.size(); i++) result.add(i);
        return result;
    }

    static List<Integer> findByCuisine(String cuisine) {
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < ids.size(); i++) {
            if (cuisines.get(i).equals(cuisine)) result.add(i);
        }
        return result;
    }

    static List<Integer> findByMinRating(double minRating) {
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < ids.size(); i++) {
            if (ratings.get(i) >= minRating) result.add(i);
        }
        return result;
    }

    static String formatRestaurant(int idx) {
        return "  #" + ids.get(idx) + " " + names.get(idx)
            + " [" + cuisines.get(idx) + "] ★" + ratings.get(idx);
    }

    static void printList(List<Integer> indices) {
        for (int idx : indices) {
            System.out.println(formatRestaurant(idx));
        }
    }

    public static void main(String[] args) {
        System.out.println("=== RestaurantRepository: CRUD Demo ===");
        System.out.println();

        save(1, "Баурсак House", "ул. Абая 15", 4.5, "KAZAKH", true);
        save(2, "Seoul Kitchen", "ул. Сатпаева 22", 4.8, "KOREAN", true);
        save(3, "Pizza Roma", "пр. Назарбаева 44", 4.2, "ITALIAN", true);
        save(4, "Sushi Master", "ул. Толе би 10", 3.9, "JAPANESE", true);
        save(5, "BurgerKing", "пр. Аль-Фараби 77", 3.5, "FAST_FOOD", true);

        System.out.println();
        List<Integer> all = findAll();
        System.out.println("Все рестораны (" + all.size() + "):");
        printList(all);

        System.out.println();
        int found = findById(2);
        System.out.println("findById(2): " + (found >= 0 ? names.get(found) : "null"));
        int notFound = findById(99);
        System.out.println("findById(99): " + (notFound >= 0 ? names.get(notFound) : "null"));

        System.out.println();
        System.out.println("findByCuisine(KAZAKH):");
        printList(findByCuisine("KAZAKH"));

        System.out.println();
        System.out.println("findByMinRating(4.5):");
        printList(findByMinRating(4.5));
    }
}`,
      explanation: 'В Spring Boot ты бы создал интерфейс RestaurantRepository extends JpaRepository<Restaurant, Long> и получил все CRUD-методы бесплатно. Кастомные запросы — через @Query или method naming convention (findByCuisineType). In-memory реализация полезна для тестов (паттерн Test Double). Мы симулируем Repository Pattern — абстракцию доступа к данным.'
    },
    {
      id: 6,
      title: 'Service: Бизнес-логика ресторанов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Архитектор на ревью: "Repository — это только доступ к данным. Вся бизнес-логика должна быть в Service. Валидация, фильтрация, сортировка — это Service-слой. Контроллер никогда не должен напрямую работать с Repository." Создай RestaurantService, который использует Repository и добавляет бизнес-логику.',
      requirements: [
        'RestaurantService использует методы Repository (вызовы функций хранилища)',
        'Метод registerRestaurant: валидация + сохранение (имя не пустое, рейтинг 1-5)',
        'Метод getActiveRestaurants: возвращает только активные',
        'Метод getTopRated(int limit): топ-N по рейтингу',
        'Метод searchByName(String query): поиск по подстроке (регистронезависимый)',
        'Продемонстрируй separation of concerns: Service вызывает Repository'
      ],
      expectedOutput: `=== RestaurantService Demo ===

--- registerRestaurant ---
[OK] Зарегистрирован: Баурсак House
[OK] Зарегистрирован: Seoul Kitchen
[OK] Зарегистрирован: Pizza Roma
[OK] Зарегистрирован: Sushi Master
[OK] Зарегистрирован: BurgerKing
[FAIL] Невалидные данные: имя пустое или рейтинг не 1-5
[FAIL] Невалидные данные: имя пустое или рейтинг не 1-5

--- getActiveRestaurants ---
Активные рестораны (4):
  Баурсак House ★4.5
  Seoul Kitchen ★4.8
  Pizza Roma ★4.2
  BurgerKing ★3.5

--- getTopRated(3) ---
Топ-3 ресторана:
  1. Seoul Kitchen ★4.8
  2. Баурсак House ★4.5
  3. Pizza Roma ★4.2

--- searchByName("sushi") ---
Результаты поиска "sushi":
  Sushi Master ★3.9`,
      hint: 'Service-слой — это прослойка между Controller и Repository. Он содержит бизнес-правила. Для сортировки по рейтингу используй простой пузырьковый sort или sort через Collections.',
      solution: `import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class Main {
    // --- Repository layer ---
    static List<String> repoNames = new ArrayList<>();
    static List<Double> repoRatings = new ArrayList<>();
    static List<Boolean> repoActives = new ArrayList<>();
    static int nextId = 1;

    static int repoSave(String name, double rating, boolean active) {
        repoNames.add(name);
        repoRatings.add(rating);
        repoActives.add(active);
        return nextId++;
    }

    static int repoSize() { return repoNames.size(); }

    // --- Service layer ---
    static boolean registerRestaurant(String name, double rating, boolean active) {
        if (name == null || name.isEmpty() || rating < 1.0 || rating > 5.0) {
            System.out.println("[FAIL] Невалидные данные: имя пустое или рейтинг не 1-5");
            return false;
        }
        repoSave(name, rating, active);
        System.out.println("[OK] Зарегистрирован: " + name);
        return true;
    }

    static List<Integer> getActiveRestaurants() {
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < repoSize(); i++) {
            if (repoActives.get(i)) result.add(i);
        }
        return result;
    }

    static List<Integer> getTopRated(int limit) {
        List<Integer> indices = new ArrayList<>();
        for (int i = 0; i < repoSize(); i++) indices.add(i);
        indices.sort((a, b) -> Double.compare(repoRatings.get(b), repoRatings.get(a)));
        return indices.subList(0, Math.min(limit, indices.size()));
    }

    static List<Integer> searchByName(String query) {
        List<Integer> result = new ArrayList<>();
        String q = query.toLowerCase();
        for (int i = 0; i < repoSize(); i++) {
            if (repoNames.get(i).toLowerCase().contains(q)) {
                result.add(i);
            }
        }
        return result;
    }

    public static void main(String[] args) {
        System.out.println("=== RestaurantService Demo ===");
        System.out.println();
        System.out.println("--- registerRestaurant ---");

        registerRestaurant("Баурсак House", 4.5, true);
        registerRestaurant("Seoul Kitchen", 4.8, true);
        registerRestaurant("Pizza Roma", 4.2, true);
        registerRestaurant("Sushi Master", 3.9, false);
        registerRestaurant("BurgerKing", 3.5, true);
        registerRestaurant("", 4.0, true);
        registerRestaurant("Bad Rating", 6.0, true);

        System.out.println();
        System.out.println("--- getActiveRestaurants ---");
        List<Integer> active = getActiveRestaurants();
        System.out.println("Активные рестораны (" + active.size() + "):");
        for (int idx : active) {
            System.out.println("  " + repoNames.get(idx) + " ★" + repoRatings.get(idx));
        }

        System.out.println();
        System.out.println("--- getTopRated(3) ---");
        List<Integer> top = getTopRated(3);
        System.out.println("Топ-3 ресторана:");
        int rank = 1;
        for (int idx : top) {
            System.out.println("  " + rank++ + ". " + repoNames.get(idx) + " ★" + repoRatings.get(idx));
        }

        System.out.println();
        System.out.println("--- searchByName(\\"sushi\\") ---");
        List<Integer> found = searchByName("sushi");
        System.out.println("Результаты поиска \\"sushi\\":");
        for (int idx : found) {
            System.out.println("  " + repoNames.get(idx) + " ★" + repoRatings.get(idx));
        }
    }
}`,
      explanation: 'Separation of Concerns — ключевой принцип. Repository знает КАК хранить данные, Service знает ЧТО с ними делать. В Spring Boot Service аннотируется @Service и внедряет Repository через @Autowired. Бизнес-правила (валидация, фильтрация, сортировка) — только в Service. Контроллер лишь принимает HTTP-запрос и вызывает Service.'
    },
    {
      id: 7,
      title: 'DTO: Data Transfer Objects',
      type: 'practice',
      difficulty: 'medium',
      description: 'Архитектор на дейли: "Никогда не отдавай Entity напрямую в API! Создай DTO — отдельные объекты для запросов и ответов. Entity содержит внутренние поля (timestamps, служебные флаги), клиент их видеть не должен." Создай DTO для ресторана: запрос на создание, ответ клиенту, и маппинг между Entity и DTO.',
      requirements: [
        'Создай record CreateRestaurantRequest(name, address, cuisine, rating) — входящий запрос',
        'Создай record RestaurantResponse(id, name, address, cuisine, rating, ratingStars, status) — ответ клиенту',
        'ratingStars: визуальное отображение рейтинга (★★★★☆)',
        'Метод маппинга toResponse() — из внутренних данных в DTO',
        'Метод маппинга fromRequest() — из DTO во внутреннее хранение',
        'Покажи полный цикл: Request → Entity → Response'
      ],
      expectedOutput: `=== DTO Mapping Demo ===

--- Входящий запрос (CreateRestaurantRequest) ---
{name: "Dastarkhan", address: "ул. Абылай хана 10", cuisine: "KAZAKH", rating: 4.7}

--- Маппинг: Request → Entity ---
Entity сохранён: id=1, name=Dastarkhan, active=true

--- Маппинг: Entity → Response ---
{
  "id": 1,
  "name": "Dastarkhan",
  "address": "ул. Абылай хана 10",
  "cuisine": "KAZAKH",
  "rating": 4.7,
  "ratingStars": "★★★★★",
  "status": "ACTIVE"
}

--- Список ресторанов (Response) ---
{id: 1, name: "Dastarkhan", stars: "★★★★★"}
{id: 2, name: "Burger Street", stars: "★★★★☆"}
{id: 3, name: "Noodle House", stars: "★★★☆☆"}`,
      hint: 'Java record — идеальный вариант для DTO. Они immutable и автоматически генерируют toString, equals, hashCode. Для маппинга создай статические методы.',
      solution: `public class Main {
    // --- Request DTO ---
    record CreateRestaurantRequest(String name, String address,
                                    String cuisine, double rating) {}

    // --- Response DTO ---
    record RestaurantResponse(int id, String name, String address,
                               String cuisine, double rating,
                               String ratingStars, String status) {
        String toJson() {
            return """
                    {
                      "id": %d,
                      "name": "%s",
                      "address": "%s",
                      "cuisine": "%s",
                      "rating": %s,
                      "ratingStars": "%s",
                      "status": "%s"
                    }""".formatted(id, name, address, cuisine, rating, ratingStars, status);
        }

        String toShortJson() {
            return "{id: " + id + ", name: \\"" + name + "\\", stars: \\"" + ratingStars + "\\"}";
        }
    }

    // --- Entity storage ---
    static int[] eIds = new int[10];
    static String[] eNames = new String[10];
    static String[] eAddresses = new String[10];
    static String[] eCuisines = new String[10];
    static double[] eRatings = new double[10];
    static boolean[] eActives = new boolean[10];
    static int count = 0;
    static int nextId = 1;

    static String toStars(double rating) {
        int full = (int) Math.round(rating);
        return "★".repeat(full) + "☆".repeat(5 - full);
    }

    // Request → Entity (save)
    static int fromRequest(CreateRestaurantRequest req) {
        int id = nextId++;
        eIds[count] = id;
        eNames[count] = req.name();
        eAddresses[count] = req.address();
        eCuisines[count] = req.cuisine();
        eRatings[count] = req.rating();
        eActives[count] = true;
        count++;
        return id;
    }

    // Entity → Response
    static RestaurantResponse toResponse(int idx) {
        return new RestaurantResponse(
            eIds[idx], eNames[idx], eAddresses[idx], eCuisines[idx],
            eRatings[idx], toStars(eRatings[idx]),
            eActives[idx] ? "ACTIVE" : "INACTIVE"
        );
    }

    public static void main(String[] args) {
        System.out.println("=== DTO Mapping Demo ===");

        // 1. Входящий запрос
        var req = new CreateRestaurantRequest("Dastarkhan",
            "ул. Абылай хана 10", "KAZAKH", 4.7);
        System.out.println();
        System.out.println("--- Входящий запрос (CreateRestaurantRequest) ---");
        System.out.println("{name: \\"" + req.name() + "\\", address: \\"" + req.address()
            + "\\", cuisine: \\"" + req.cuisine() + "\\", rating: " + req.rating() + "}");

        // 2. Request → Entity
        System.out.println();
        System.out.println("--- Маппинг: Request → Entity ---");
        int id = fromRequest(req);
        System.out.println("Entity сохранён: id=" + id + ", name=" + eNames[0] + ", active=true");

        // 3. Entity → Response
        System.out.println();
        System.out.println("--- Маппинг: Entity → Response ---");
        RestaurantResponse resp = toResponse(0);
        System.out.println(resp.toJson());

        // 4. Несколько ресторанов
        fromRequest(new CreateRestaurantRequest("Burger Street",
            "пр. Достык 5", "FAST_FOOD", 4.0));
        fromRequest(new CreateRestaurantRequest("Noodle House",
            "ул. Фурманова 33", "KOREAN", 3.2));

        System.out.println();
        System.out.println("--- Список ресторанов (Response) ---");
        for (int i = 0; i < count; i++) {
            System.out.println(toResponse(i).toShortJson());
        }
    }
}`,
      explanation: 'DTO — стандартный паттерн в enterprise Java. Entity содержит @Id, @CreatedDate, @Version, служебные поля — клиент их видеть не должен. В Spring Boot маппинг делается через MapStruct или ModelMapper. Record в Java 17+ — идеальный выбор для DTO: immutable, компактный, автогенерация equals/hashCode/toString. Разделение Request/Response DTO — best practice.'
    },
    {
      id: 8,
      title: 'Controller: Первый API endpoint',
      type: 'practice',
      difficulty: 'medium',
      description: 'CTO: "Пора делать API! Пока без Spring — симулируй контроллер как класс с методами. Каждый метод принимает строковый ввод и возвращает форматированный HTTP-ответ. Мне нужны GET all, GET by id, POST create и GET search." Создай класс-контроллер, симулирующий REST API.',
      requirements: [
        'Метод handleGetAll() — возвращает список всех ресторанов (200 OK)',
        'Метод handleGetById(int id) — ресторан по ID (200 OK или 404 Not Found)',
        'Метод handleCreate(String name, String address, String cuisine, double rating) — создание (201 Created или 400 Bad Request)',
        'Метод handleSearch(String query) — поиск по имени (200 OK)',
        'Каждый метод печатает HTTP-подобный ответ с статус-кодом',
        'Предзаполни 2 ресторана для демонстрации'
      ],
      expectedOutput: `=== REST Controller Demo ===

>>> GET /api/v1/restaurants
<<< 200 OK
[
  {"id": 1, "name": "Баурсак House", "rating": 4.5},
  {"id": 2, "name": "Seoul Kitchen", "rating": 4.8}
]

>>> GET /api/v1/restaurants/1
<<< 200 OK
{"id": 1, "name": "Баурсак House", "rating": 4.5}

>>> GET /api/v1/restaurants/99
<<< 404 Not Found
{"error": "Restaurant with id 99 not found"}

>>> POST /api/v1/restaurants
Body: {"name": "Pizza Roma", "rating": 4.2}
<<< 201 Created
{"id": 3, "name": "Pizza Roma", "rating": 4.2}

>>> POST /api/v1/restaurants
Body: {"name": "", "rating": 4.0}
<<< 400 Bad Request
{"error": "Validation failed: name is required"}

>>> GET /api/v1/restaurants/search?q=seoul
<<< 200 OK
[
  {"id": 2, "name": "Seoul Kitchen", "rating": 4.8}
]`,
      hint: 'Каждый метод контроллера — это обработчик HTTP-запроса. Форматируй вывод как реальный HTTP request/response лог. В Spring Boot это были бы методы с @GetMapping, @PostMapping.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    static List<Integer> ids = new ArrayList<>();
    static List<String> names = new ArrayList<>();
    static List<Double> ratings = new ArrayList<>();
    static int nextId = 1;

    static int save(String name, double rating) {
        int id = nextId++;
        ids.add(id);
        names.add(name);
        ratings.add(rating);
        return id;
    }

    static String toJson(int idx) {
        return "{\\"id\\": " + ids.get(idx) + ", \\"name\\": \\""
            + names.get(idx) + "\\", \\"rating\\": " + ratings.get(idx) + "}";
    }

    // GET /api/v1/restaurants
    static void handleGetAll() {
        System.out.println(">>> GET /api/v1/restaurants");
        System.out.println("<<< 200 OK");
        System.out.println("[");
        for (int i = 0; i < ids.size(); i++) {
            String comma = (i < ids.size() - 1) ? "," : "";
            System.out.println("  " + toJson(i) + comma);
        }
        System.out.println("]");
    }

    // GET /api/v1/restaurants/{id}
    static void handleGetById(int id) {
        System.out.println(">>> GET /api/v1/restaurants/" + id);
        int idx = -1;
        for (int i = 0; i < ids.size(); i++) {
            if (ids.get(i) == id) { idx = i; break; }
        }
        if (idx >= 0) {
            System.out.println("<<< 200 OK");
            System.out.println(toJson(idx));
        } else {
            System.out.println("<<< 404 Not Found");
            System.out.println("{\\"error\\": \\"Restaurant with id " + id + " not found\\"}");
        }
    }

    // POST /api/v1/restaurants
    static void handleCreate(String name, double rating) {
        System.out.println(">>> POST /api/v1/restaurants");
        System.out.println("Body: {\\"name\\": \\"" + name + "\\", \\"rating\\": " + rating + "}");
        if (name == null || name.isEmpty()) {
            System.out.println("<<< 400 Bad Request");
            System.out.println("{\\"error\\": \\"Validation failed: name is required\\"}");
            return;
        }
        int id = save(name, rating);
        int idx = ids.size() - 1;
        System.out.println("<<< 201 Created");
        System.out.println(toJson(idx));
    }

    // GET /api/v1/restaurants/search?q=...
    static void handleSearch(String query) {
        System.out.println(">>> GET /api/v1/restaurants/search?q=" + query);
        System.out.println("<<< 200 OK");
        String q = query.toLowerCase();
        List<Integer> found = new ArrayList<>();
        for (int i = 0; i < ids.size(); i++) {
            if (names.get(i).toLowerCase().contains(q)) found.add(i);
        }
        System.out.println("[");
        for (int i = 0; i < found.size(); i++) {
            String comma = (i < found.size() - 1) ? "," : "";
            System.out.println("  " + toJson(found.get(i)) + comma);
        }
        System.out.println("]");
    }

    public static void main(String[] args) {
        System.out.println("=== REST Controller Demo ===");

        save("Баурсак House", 4.5);
        save("Seoul Kitchen", 4.8);

        System.out.println();
        handleGetAll();

        System.out.println();
        handleGetById(1);

        System.out.println();
        handleGetById(99);

        System.out.println();
        handleCreate("Pizza Roma", 4.2);

        System.out.println();
        handleCreate("", 4.0);

        System.out.println();
        handleSearch("seoul");
    }
}`,
      explanation: 'В Spring Boot каждый метод контроллера аннотируется: @GetMapping("/restaurants") для handleGetAll, @GetMapping("/restaurants/{id}") для handleGetById, @PostMapping для handleCreate. ResponseEntity<> позволяет управлять статус-кодом: ResponseEntity.ok(), ResponseEntity.notFound(), ResponseEntity.status(201). REST — архитектурный стиль с чёткими соглашениями по URL, HTTP-методам и статус-кодам.'
    },
    {
      id: 9,
      title: 'Error Handling: Кастомные исключения',
      type: 'practice',
      difficulty: 'medium',
      description: 'Тимлид после инцидента: "Продакшен упал из-за NullPointerException. Нам нужны кастомные исключения с понятными сообщениями! Создай исключения для каждого типа ошибки и ErrorResponse для унифицированного формата ошибок." Реализуй систему обработки ошибок.',
      requirements: [
        'Создай исключения: RestaurantNotFoundException, InvalidDataException, DuplicateRestaurantException',
        'Все наследуют от RuntimeException с информативными сообщениями',
        'Создай record ErrorResponse(int status, String error, String message, String timestamp)',
        'Метод toJson() у ErrorResponse для вывода в JSON-формате',
        'Продемонстрируй try-catch в контроллере с кастомными исключениями',
        'Покажи как каждое исключение маппится в HTTP-статус (404, 400, 409)'
      ],
      expectedOutput: `=== Error Handling Demo ===

--- Тест 1: Ресторан не найден ---
>>> GET /api/v1/restaurants/999
{
  "status": 404,
  "error": "Not Found",
  "message": "Ресторан с id=999 не найден",
  "timestamp": "2025-01-15T12:00:00"
}

--- Тест 2: Невалидные данные ---
>>> POST /api/v1/restaurants
{
  "status": 400,
  "error": "Bad Request",
  "message": "Название ресторана не может быть пустым",
  "timestamp": "2025-01-15T12:00:01"
}

--- Тест 3: Дубликат ---
>>> POST /api/v1/restaurants
{
  "status": 409,
  "error": "Conflict",
  "message": "Ресторан 'Баурсак House' уже существует",
  "timestamp": "2025-01-15T12:00:02"
}

--- Тест 4: Успешный запрос ---
>>> POST /api/v1/restaurants
{
  "status": 201,
  "message": "Ресторан 'Seoul Kitchen' создан успешно"
}`,
      hint: 'Создай иерархию исключений. В catch-блоке определяй тип исключения и формируй соответствующий ErrorResponse. В Spring Boot это делается через @ControllerAdvice и @ExceptionHandler.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    // --- Custom Exceptions ---
    static class RestaurantNotFoundException extends RuntimeException {
        RestaurantNotFoundException(int id) {
            super("Ресторан с id=" + id + " не найден");
        }
    }

    static class InvalidDataException extends RuntimeException {
        InvalidDataException(String message) {
            super(message);
        }
    }

    static class DuplicateRestaurantException extends RuntimeException {
        DuplicateRestaurantException(String name) {
            super("Ресторан '" + name + "' уже существует");
        }
    }

    // --- ErrorResponse ---
    record ErrorResponse(int status, String error, String message, String timestamp) {
        String toJson() {
            return """
                    {
                      "status": %d,
                      "error": "%s",
                      "message": "%s",
                      "timestamp": "%s"
                    }""".formatted(status, error, message, timestamp);
        }
    }

    // --- Simple storage ---
    static List<String> names = new ArrayList<>();
    static int timeCounter = 0;

    static String getTimestamp() {
        return "2025-01-15T12:00:%02d".formatted(timeCounter++);
    }

    // --- Service methods that throw exceptions ---
    static void findById(int id) {
        if (id > names.size() || id < 1) {
            throw new RestaurantNotFoundException(id);
        }
    }

    static void createRestaurant(String name) {
        if (name == null || name.isEmpty()) {
            throw new InvalidDataException("Название ресторана не может быть пустым");
        }
        if (names.contains(name)) {
            throw new DuplicateRestaurantException(name);
        }
        names.add(name);
    }

    // --- Controller with error handling ---
    static void handleGet(int id) {
        System.out.println(">>> GET /api/v1/restaurants/" + id);
        try {
            findById(id);
            System.out.println("<<< 200 OK");
        } catch (RestaurantNotFoundException e) {
            var err = new ErrorResponse(404, "Not Found", e.getMessage(), getTimestamp());
            System.out.println(err.toJson());
        }
    }

    static void handlePost(String name) {
        System.out.println(">>> POST /api/v1/restaurants");
        try {
            createRestaurant(name);
            System.out.println("""
                    {
                      "status": 201,
                      "message": "Ресторан '%s' создан успешно"
                    }""".formatted(name));
        } catch (InvalidDataException e) {
            var err = new ErrorResponse(400, "Bad Request", e.getMessage(), getTimestamp());
            System.out.println(err.toJson());
        } catch (DuplicateRestaurantException e) {
            var err = new ErrorResponse(409, "Conflict", e.getMessage(), getTimestamp());
            System.out.println(err.toJson());
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Error Handling Demo ===");
        names.add("Баурсак House");

        System.out.println();
        System.out.println("--- Тест 1: Ресторан не найден ---");
        handleGet(999);

        System.out.println();
        System.out.println("--- Тест 2: Невалидные данные ---");
        handlePost("");

        System.out.println();
        System.out.println("--- Тест 3: Дубликат ---");
        handlePost("Баурсак House");

        System.out.println();
        System.out.println("--- Тест 4: Успешный запрос ---");
        handlePost("Seoul Kitchen");
    }
}`,
      explanation: 'В Spring Boot кастомные исключения обрабатываются через @ControllerAdvice — глобальный перехватчик. @ExceptionHandler(RestaurantNotFoundException.class) возвращает ResponseEntity с 404. Это убирает try-catch из каждого контроллера. Иерархия исключений: BusinessException → NotFoundException, ValidationException, ConflictException. Единый формат ErrorResponse — стандарт для REST API.'
    },
    {
      id: 10,
      title: 'Integration: Собираем всё вместе',
      type: 'practice',
      difficulty: 'hard',
      description: 'CTO на демо спринта: "Покажи полный флоу! Controller → Service → Repository. Симулируй серию API-запросов как реальный лог: создание ресторанов, получение списка, поиск, обработка ошибок. Хочу видеть, что архитектура работает end-to-end." Собери все слои вместе и продемонстрируй полный цикл работы API.',
      requirements: [
        'Полная архитектура: Controller → Service → Repository',
        'Серия API вызовов: создать 3 ресторана, получить все, поиск по имени, получить по ID, обработка ошибки 404, обработка дубликата 409',
        'Каждый вызов печатает request и response в формате HTTP-лога',
        'Используй кастомные исключения из урока 9',
        'Выведи итоговую статистику: всего запросов, успешных, ошибок'
      ],
      expectedOutput: `╔══════════════════════════════════════════╗
║   QuickBite API — Sprint 0 Demo         ║
╚══════════════════════════════════════════╝

[1] POST /api/v1/restaurants
    Body: {"name":"Баурсак House","cuisine":"KAZAKH","rating":4.5}
    ✅ 201 Created → id=1

[2] POST /api/v1/restaurants
    Body: {"name":"Seoul Kitchen","cuisine":"KOREAN","rating":4.8}
    ✅ 201 Created → id=2

[3] POST /api/v1/restaurants
    Body: {"name":"Pizza Roma","cuisine":"ITALIAN","rating":4.2}
    ✅ 201 Created → id=3

[4] GET /api/v1/restaurants
    ✅ 200 OK → 3 ресторана
    [1] Баурсак House (KAZAKH) ★4.5
    [2] Seoul Kitchen (KOREAN) ★4.8
    [3] Pizza Roma (ITALIAN) ★4.2

[5] GET /api/v1/restaurants/search?q=seoul
    ✅ 200 OK → найдено: 1
    [2] Seoul Kitchen (KOREAN) ★4.8

[6] GET /api/v1/restaurants/2
    ✅ 200 OK
    {"id":2,"name":"Seoul Kitchen","cuisine":"KOREAN","rating":4.8,"stars":"★★★★★"}

[7] GET /api/v1/restaurants/99
    ❌ 404 Not Found: Ресторан с id=99 не найден

[8] POST /api/v1/restaurants
    Body: {"name":"Баурсак House","cuisine":"KAZAKH","rating":4.5}
    ❌ 409 Conflict: Ресторан 'Баурсак House' уже существует

[9] POST /api/v1/restaurants
    Body: {"name":"","cuisine":"KAZAKH","rating":4.0}
    ❌ 400 Bad Request: Название ресторана не может быть пустым

[10] GET /api/v1/restaurants/top?limit=2
    ✅ 200 OK → топ-2
    1. Seoul Kitchen ★4.8
    2. Баурсак House ★4.5

══════════════════════════════════════════
📊 Итого: 10 запросов | ✅ 7 успешных | ❌ 3 ошибок
══════════════════════════════════════════`,
      hint: 'Создай все три слоя: Repository (хранит данные), Service (валидация + бизнес-логика + исключения), Controller (форматирует HTTP-ответ). Каждый API-вызов проходит через цепочку Controller → Service → Repository.',
      solution: `import java.util.ArrayList;
import java.util.List;

public class Main {
    // === Exceptions ===
    static class RestaurantNotFoundException extends RuntimeException {
        RestaurantNotFoundException(int id) { super("Ресторан с id=" + id + " не найден"); }
    }
    static class InvalidDataException extends RuntimeException {
        InvalidDataException(String msg) { super(msg); }
    }
    static class DuplicateRestaurantException extends RuntimeException {
        DuplicateRestaurantException(String name) { super("Ресторан '" + name + "' уже существует"); }
    }

    // === Repository ===
    static List<Integer> rIds = new ArrayList<>();
    static List<String> rNames = new ArrayList<>();
    static List<String> rCuisines = new ArrayList<>();
    static List<Double> rRatings = new ArrayList<>();
    static int nextId = 1;

    static int repoSave(String name, String cuisine, double rating) {
        int id = nextId++;
        rIds.add(id); rNames.add(name); rCuisines.add(cuisine); rRatings.add(rating);
        return id;
    }
    static int repoFindById(int id) {
        for (int i = 0; i < rIds.size(); i++) if (rIds.get(i) == id) return i;
        return -1;
    }
    static boolean repoExistsByName(String name) {
        return rNames.contains(name);
    }

    // === Service ===
    static int svcCreate(String name, String cuisine, double rating) {
        if (name == null || name.isEmpty()) throw new InvalidDataException("Название ресторана не может быть пустым");
        if (repoExistsByName(name)) throw new DuplicateRestaurantException(name);
        return repoSave(name, cuisine, rating);
    }
    static int svcGetById(int id) {
        int idx = repoFindById(id);
        if (idx < 0) throw new RestaurantNotFoundException(id);
        return idx;
    }
    static List<Integer> svcSearch(String query) {
        List<Integer> res = new ArrayList<>();
        String q = query.toLowerCase();
        for (int i = 0; i < rNames.size(); i++)
            if (rNames.get(i).toLowerCase().contains(q)) res.add(i);
        return res;
    }
    static List<Integer> svcTopRated(int limit) {
        List<Integer> indices = new ArrayList<>();
        for (int i = 0; i < rIds.size(); i++) indices.add(i);
        indices.sort((a, b) -> Double.compare(rRatings.get(b), rRatings.get(a)));
        return indices.subList(0, Math.min(limit, indices.size()));
    }

    static String stars(double r) {
        int f = (int) Math.round(r); return "★".repeat(f) + "☆".repeat(5 - f);
    }

    // === Controller + Stats ===
    static int reqNum = 0, okCount = 0, errCount = 0;

    static void ctrlCreate(String name, String cuisine, double rating) {
        reqNum++;
        System.out.println("[" + reqNum + "] POST /api/v1/restaurants");
        System.out.println("    Body: {\\"name\\":\\"" + name + "\\",\\"cuisine\\":\\"" + cuisine + "\\",\\"rating\\":" + rating + "}");
        try {
            int id = svcCreate(name, cuisine, rating);
            System.out.println("    ✅ 201 Created → id=" + id);
            okCount++;
        } catch (InvalidDataException e) {
            System.out.println("    ❌ 400 Bad Request: " + e.getMessage());
            errCount++;
        } catch (DuplicateRestaurantException e) {
            System.out.println("    ❌ 409 Conflict: " + e.getMessage());
            errCount++;
        }
    }

    static void ctrlGetAll() {
        reqNum++;
        System.out.println("[" + reqNum + "] GET /api/v1/restaurants");
        System.out.println("    ✅ 200 OK → " + rIds.size() + " ресторана");
        for (int i = 0; i < rIds.size(); i++) {
            System.out.println("    [" + rIds.get(i) + "] " + rNames.get(i) + " (" + rCuisines.get(i) + ") ★" + rRatings.get(i));
        }
        okCount++;
    }

    static void ctrlSearch(String query) {
        reqNum++;
        System.out.println("[" + reqNum + "] GET /api/v1/restaurants/search?q=" + query);
        List<Integer> found = svcSearch(query);
        System.out.println("    ✅ 200 OK → найдено: " + found.size());
        for (int idx : found) {
            System.out.println("    [" + rIds.get(idx) + "] " + rNames.get(idx) + " (" + rCuisines.get(idx) + ") ★" + rRatings.get(idx));
        }
        okCount++;
    }

    static void ctrlGetById(int id) {
        reqNum++;
        System.out.println("[" + reqNum + "] GET /api/v1/restaurants/" + id);
        try {
            int idx = svcGetById(id);
            System.out.println("    ✅ 200 OK");
            System.out.println("    {\\"id\\":" + rIds.get(idx) + ",\\"name\\":\\"" + rNames.get(idx)
                + "\\",\\"cuisine\\":\\"" + rCuisines.get(idx) + "\\",\\"rating\\":" + rRatings.get(idx)
                + ",\\"stars\\":\\"" + stars(rRatings.get(idx)) + "\\"}");
            okCount++;
        } catch (RestaurantNotFoundException e) {
            System.out.println("    ❌ 404 Not Found: " + e.getMessage());
            errCount++;
        }
    }

    static void ctrlTopRated(int limit) {
        reqNum++;
        System.out.println("[" + reqNum + "] GET /api/v1/restaurants/top?limit=" + limit);
        List<Integer> top = svcTopRated(limit);
        System.out.println("    ✅ 200 OK → топ-" + limit);
        int rank = 1;
        for (int idx : top) {
            System.out.println("    " + rank++ + ". " + rNames.get(idx) + " ★" + rRatings.get(idx));
        }
        okCount++;
    }

    public static void main(String[] args) {
        System.out.println("╔══════════════════════════════════════════╗");
        System.out.println("║   QuickBite API — Sprint 0 Demo         ║");
        System.out.println("╚══════════════════════════════════════════╝");
        System.out.println();

        ctrlCreate("Баурсак House", "KAZAKH", 4.5);
        System.out.println();
        ctrlCreate("Seoul Kitchen", "KOREAN", 4.8);
        System.out.println();
        ctrlCreate("Pizza Roma", "ITALIAN", 4.2);
        System.out.println();
        ctrlGetAll();
        System.out.println();
        ctrlSearch("seoul");
        System.out.println();
        ctrlGetById(2);
        System.out.println();
        ctrlGetById(99);
        System.out.println();
        ctrlCreate("Баурсак House", "KAZAKH", 4.5);
        System.out.println();
        ctrlCreate("", "KAZAKH", 4.0);
        System.out.println();
        ctrlTopRated(2);

        System.out.println();
        System.out.println("══════════════════════════════════════════");
        System.out.println("📊 Итого: " + reqNum + " запросов | ✅ " + okCount + " успешных | ❌ " + errCount + " ошибок");
        System.out.println("══════════════════════════════════════════");
    }
}`,
      explanation: 'Это полная симуляция слоистой архитектуры Spring Boot: Controller принимает запрос и форматирует ответ, Service содержит бизнес-логику и кидает исключения, Repository хранит данные. В реальном проекте Spring Boot автоматически связывает слои через Dependency Injection (@Autowired), исключения обрабатывает @ControllerAdvice, а данные хранятся в PostgreSQL через JPA. Но архитектурный паттерн — тот же самый. Это и есть Clean Architecture в действии.'
    }
  ]
}
