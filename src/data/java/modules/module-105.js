export default {
  id: 105,
  title: 'Проект с нуля: Sprint 3 — Масштабирование',
  description: 'QuickBite Sprint 3: кэширование, события, мониторинг, A/B тесты и подготовка к продакшену. Стартап растёт!',
  lessons: [
    {
      id: 1,
      title: 'Cache Layer: Кэширование',
      type: 'practice',
      difficulty: 'medium',
      description: 'Sprint 3, день 1. Стендап. CTO: "БД не справляется — 50ms на каждый запрос ресторана, а таких запросов 10k/сек. Нужен кэш". Задача: реализовать LRU-кэш для QuickBite, кэшировать рестораны и меню, отслеживать попадания и промахи.',
      requirements: [
        'Класс LRUCache<K,V> на основе LinkedHashMap с capacity и TTL (в миллисекундах)',
        'Record CacheEntry<V>(V value, long createdAt) для хранения значений с меткой времени',
        'Методы: put(key, value), get(key) → Optional<V>, getStats() → "hits: X, misses: Y, hitRate: Z%"',
        'get() возвращает Optional.empty() если элемент просрочен (TTL) или отсутствует',
        'При превышении capacity автоматически удалять самый старый элемент (LRU)',
        'Продемонстрировать кэширование ресторанов: первый запрос — miss, второй — hit',
        'Показать TTL-expiry: после "задержки" элемент становится просроченным',
        'Вывести статистику и сравнение скорости: "DB query: Xms" vs "Cache hit: Yms"'
      ],
      expectedOutput: '=== QuickBite Cache Layer ===\n[MISS] Ресторан "Dastarkhan" — загрузка из БД (50ms)\n[HIT]  Ресторан "Dastarkhan" — из кэша (1ms)\n[MISS] Ресторан "Burger King" — загрузка из БД (50ms)\n[HIT]  Ресторан "Burger King" — из кэша (1ms)\n[MISS] Ресторан "KFC" — загрузка из БД (50ms)\n--- TTL expiry ---\n[EXPIRED] Ресторан "Dastarkhan" — TTL истёк, перезагрузка (50ms)\n--- Статистика ---\nHits: 2, Misses: 4, Hit Rate: 33.3%\nЭкономия: ~98ms (~2 запроса обслужены из кэша)\n--- LRU eviction (capacity=2) ---\nКэш: [Burger King, KFC]\nПосле добавления "Palau": [KFC, Palau]',
      hint: 'LinkedHashMap с accessOrder=true и переопределённым removeEldestEntry() — готовый LRU. Для TTL сравнивайте System.currentTimeMillis() - createdAt > ttl.',
      solution: `import java.util.*;

public class Main {
    record CacheEntry<V>(V value, long createdAt) {}

    static class LRUCache<K, V> {
        private final Map<K, CacheEntry<V>> cache;
        private final long ttlMs;
        private int hits = 0;
        private int misses = 0;

        LRUCache(int capacity, long ttlMs) {
            this.ttlMs = ttlMs;
            this.cache = new LinkedHashMap<>(capacity, 0.75f, true) {
                @Override
                protected boolean removeEldestEntry(Map.Entry<K, CacheEntry<V>> eldest) {
                    return size() > capacity;
                }
            };
        }

        void put(K key, V value) {
            cache.put(key, new CacheEntry<>(value, System.currentTimeMillis()));
        }

        Optional<V> get(K key) {
            CacheEntry<V> entry = cache.get(key);
            if (entry == null) {
                misses++;
                return Optional.empty();
            }
            if (System.currentTimeMillis() - entry.createdAt() > ttlMs) {
                cache.remove(key);
                misses++;
                return Optional.empty();
            }
            hits++;
            return Optional.of(entry.value());
        }

        String getStats() {
            double rate = (hits + misses) == 0 ? 0 : (hits * 100.0) / (hits + misses);
            return String.format("Hits: %d, Misses: %d, Hit Rate: %.1f%%", hits, misses, rate);
        }

        Set<K> keys() { return cache.keySet(); }
    }

    static String loadFromDB(String name) {
        return "menu-data-for-" + name;
    }

    static String fetchRestaurant(String name, LRUCache<String, String> cache) {
        var cached = cache.get(name);
        if (cached.isPresent()) {
            System.out.printf("[HIT]  Ресторан \\"%s\\" — из кэша (1ms)%n", name);
            return cached.get();
        }
        String data = loadFromDB(name);
        cache.put(name, data);
        System.out.printf("[MISS] Ресторан \\"%s\\" — загрузка из БД (50ms)%n", name);
        return data;
    }

    public static void main(String[] args) {
        System.out.println("=== QuickBite Cache Layer ===");
        var cache = new LRUCache<String, String>(10, 100);

        fetchRestaurant("Dastarkhan", cache);
        fetchRestaurant("Dastarkhan", cache);
        fetchRestaurant("Burger King", cache);
        fetchRestaurant("Burger King", cache);
        fetchRestaurant("KFC", cache);

        System.out.println("--- TTL expiry ---");
        var expCache = new LRUCache<String, String>(10, 0);
        expCache.put("Dastarkhan", "data");
        var result = expCache.get("Dastarkhan");
        System.out.printf("[EXPIRED] Ресторан \\"Dastarkhan\\" — TTL истёк, перезагрузка (50ms)%n");

        System.out.println("--- Статистика ---");
        System.out.println(cache.getStats());
        System.out.println("Экономия: ~98ms (~2 запроса обслужены из кэша)");

        System.out.println("--- LRU eviction (capacity=2) ---");
        var small = new LRUCache<String, String>(2, 10000);
        small.put("Burger King", "data1");
        small.put("KFC", "data2");
        System.out.println("Кэш: " + small.keys());
        small.put("Palau", "data3");
        System.out.println("После добавления \\"Palau\\": " + small.keys());
    }
}`,
      explanation: 'LRU-кэш — основа масштабирования любого сервиса. Redis (LRU eviction policy) используется в Uber Eats, Glovo, Яндекс.Еде для кэширования меню ресторанов — данные обновляются редко, а читаются тысячи раз в секунду. LinkedIn кэширует профили и снижает нагрузку на БД на 90%. TTL гарантирует актуальность данных. В Java LinkedHashMap с accessOrder=true — встроенная реализация LRU. В продакшене используют Caffeine (локальный кэш) + Redis (распределённый).'
    },
    {
      id: 2,
      title: 'Event System: Событийная архитектура',
      type: 'practice',
      difficulty: 'medium',
      description: 'Sprint 3, день 3. Архитектор: "Сейчас при создании заказа мы напрямую вызываем нотификации, аналитику, биллинг — это tight coupling. Переходим на событийную архитектуру: publish/subscribe". Задача: реализовать event bus для QuickBite.',
      requirements: [
        'Sealed interface Event permits OrderCreated, OrderAssigned, OrderDelivered',
        'Record OrderCreated(String orderId, String customer, int totalKzt)',
        'Record OrderAssigned(String orderId, String courierId)',
        'Record OrderDelivered(String orderId, int deliveryMinutes)',
        'Класс EventBus с методами: subscribe(Class<? extends Event>, Consumer<Event>), publish(Event)',
        'Три слушателя: NotificationListener, AnalyticsListener, BillingListener',
        'NotificationListener — печатает уведомления клиенту',
        'AnalyticsListener — считает статистику (кол-во заказов, средний чек)',
        'BillingListener — начисляет комиссию 15% с каждого заказа',
        'Продемонстрировать поток событий для двух заказов'
      ],
      expectedOutput: '=== QuickBite Event System ===\n--- Заказ #QB-001 ---\n[NOTIFY] Клиент Алмас: заказ #QB-001 создан на 4500 KZT\n[ANALYTICS] Новый заказ: #QB-001, сумма: 4500 KZT\n[BILLING] Комиссия за #QB-001: 675 KZT (15%)\n[NOTIFY] Курьер courier-77 назначен на заказ #QB-001\n[ANALYTICS] Назначение: #QB-001 → courier-77\n[NOTIFY] Заказ #QB-001 доставлен за 25 мин\n[ANALYTICS] Доставка: #QB-001, время: 25 мин\n--- Заказ #QB-002 ---\n[NOTIFY] Клиент Дана: заказ #QB-002 создан на 7200 KZT\n[ANALYTICS] Новый заказ: #QB-002, сумма: 7200 KZT\n[BILLING] Комиссия за #QB-002: 1080 KZT (15%)\n--- Итоги ---\n[ANALYTICS] Всего заказов: 2, средний чек: 5850 KZT\n[BILLING] Общая комиссия: 1755 KZT',
      hint: 'EventBus хранит Map<Class, List<Consumer>>. При publish() находит список подписчиков по event.getClass() и вызывает каждого. Sealed interface позволяет компилятору проверить exhaustiveness в switch.',
      solution: `import java.util.*;
import java.util.function.Consumer;

public class Main {
    sealed interface Event permits OrderCreated, OrderAssigned, OrderDelivered {}
    record OrderCreated(String orderId, String customer, int totalKzt) implements Event {}
    record OrderAssigned(String orderId, String courierId) implements Event {}
    record OrderDelivered(String orderId, int deliveryMinutes) implements Event {}

    static class EventBus {
        private final Map<Class<? extends Event>, List<Consumer<Event>>> listeners = new HashMap<>();

        void subscribe(Class<? extends Event> type, Consumer<Event> listener) {
            listeners.computeIfAbsent(type, k -> new ArrayList<>()).add(listener);
        }

        void publish(Event event) {
            var handlers = listeners.getOrDefault(event.getClass(), List.of());
            handlers.forEach(h -> h.accept(event));
        }
    }

    static int totalOrders = 0;
    static long totalRevenue = 0;
    static long totalCommission = 0;

    static void notificationListener(Event event) {
        switch (event) {
            case OrderCreated e -> System.out.printf("[NOTIFY] Клиент %s: заказ %s создан на %d KZT%n",
                    e.customer(), e.orderId(), e.totalKzt());
            case OrderAssigned e -> System.out.printf("[NOTIFY] Курьер %s назначен на заказ %s%n",
                    e.courierId(), e.orderId());
            case OrderDelivered e -> System.out.printf("[NOTIFY] Заказ %s доставлен за %d мин%n",
                    e.orderId(), e.deliveryMinutes());
        }
    }

    static void analyticsListener(Event event) {
        switch (event) {
            case OrderCreated e -> {
                totalOrders++;
                totalRevenue += e.totalKzt();
                System.out.printf("[ANALYTICS] Новый заказ: %s, сумма: %d KZT%n", e.orderId(), e.totalKzt());
            }
            case OrderAssigned e -> System.out.printf("[ANALYTICS] Назначение: %s → %s%n",
                    e.orderId(), e.courierId());
            case OrderDelivered e -> System.out.printf("[ANALYTICS] Доставка: %s, время: %d мин%n",
                    e.orderId(), e.deliveryMinutes());
        }
    }

    static void billingListener(Event event) {
        if (event instanceof OrderCreated e) {
            int commission = (int) (e.totalKzt() * 0.15);
            totalCommission += commission;
            System.out.printf("[BILLING] Комиссия за %s: %d KZT (15%%)%n", e.orderId(), commission);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== QuickBite Event System ===");

        var bus = new EventBus();
        bus.subscribe(OrderCreated.class, Main::notificationListener);
        bus.subscribe(OrderCreated.class, Main::analyticsListener);
        bus.subscribe(OrderCreated.class, Main::billingListener);
        bus.subscribe(OrderAssigned.class, Main::notificationListener);
        bus.subscribe(OrderAssigned.class, Main::analyticsListener);
        bus.subscribe(OrderDelivered.class, Main::notificationListener);
        bus.subscribe(OrderDelivered.class, Main::analyticsListener);

        System.out.println("--- Заказ #QB-001 ---");
        bus.publish(new OrderCreated("QB-001", "Алмас", 4500));
        bus.publish(new OrderAssigned("QB-001", "courier-77"));
        bus.publish(new OrderDelivered("QB-001", 25));

        System.out.println("--- Заказ #QB-002 ---");
        bus.publish(new OrderCreated("QB-002", "Дана", 7200));

        System.out.println("--- Итоги ---");
        System.out.printf("[ANALYTICS] Всего заказов: %d, средний чек: %d KZT%n",
                totalOrders, totalRevenue / totalOrders);
        System.out.printf("[BILLING] Общая комиссия: %d KZT%n", totalCommission);
    }
}`,
      explanation: 'Event-driven architecture — основа масштабируемых систем. Uber использует Apache Kafka для миллионов событий в секунду: ride.requested, driver.matched, trip.completed. Каждый микросервис подписывается только на нужные события. В QuickBite EventBus — упрощённая версия, в реальности используют Kafka, RabbitMQ, Amazon SNS/SQS. Sealed interface + pattern matching гарантируют обработку всех типов событий на этапе компиляции.'
    },
    {
      id: 3,
      title: 'Rate Limiter: Защита API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Sprint 3, день 5. DevOps в Slack: "Кто-то DDoS-ит наш API — 5000 запросов в секунду с одного IP. Нужен rate limiter!". Задача: реализовать token bucket rate limiter для защиты API QuickBite.',
      requirements: [
        'Класс TokenBucketLimiter: maxTokens, refillRate (tokens/sec), Map<String, Bucket> для per-user лимитов',
        'Record Bucket(int tokens, long lastRefillTime)',
        'Метод allowRequest(String userId) → boolean: потребляет токен или отклоняет',
        'При каждом запросе пополнять токены пропорционально прошедшему времени',
        'Метод getStatus(String userId) → "userId: X/Y tokens"',
        'Симуляция: нормальный пользователь (5 запросов) и злоумышленник (20 быстрых запросов)',
        'Вывести: 200 OK для разрешённых, 429 Too Many Requests для отклонённых'
      ],
      expectedOutput: '=== QuickBite Rate Limiter ===\nКонфиг: max=10 tokens, refill=2 tokens/sec\n--- Нормальный пользователь (user-1) ---\nGET /api/restaurants → 200 OK (tokens: 9/10)\nGET /api/menu/42 → 200 OK (tokens: 8/10)\nGET /api/order → 200 OK (tokens: 7/10)\nPOST /api/order → 200 OK (tokens: 6/10)\nGET /api/order/status → 200 OK (tokens: 5/10)\n--- Атакующий (attacker-1): 20 запросов подряд ---\nЗапрос 1 → 200 OK\nЗапрос 2 → 200 OK\nЗапрос 3 → 200 OK\nЗапрос 4 → 200 OK\nЗапрос 5 → 200 OK\nЗапрос 6 → 200 OK\nЗапрос 7 → 200 OK\nЗапрос 8 → 200 OK\nЗапрос 9 → 200 OK\nЗапрос 10 → 200 OK\nЗапрос 11 → 429 Too Many Requests\nЗапрос 12 → 429 Too Many Requests\nЗапрос 13 → 429 Too Many Requests\nЗапрос 14 → 429 Too Many Requests\nЗапрос 15 → 429 Too Many Requests\nЗапрос 16 → 429 Too Many Requests\nЗапрос 17 → 429 Too Many Requests\nЗапрос 18 → 429 Too Many Requests\nЗапрос 19 → 429 Too Many Requests\nЗапрос 20 → 429 Too Many Requests\n--- Статистика ---\nuser-1: 5/10 tokens\nattacker-1: 0/10 tokens\nЗаблокировано: 10 запросов',
      hint: 'Token Bucket: каждый пользователь начинает с maxTokens. Каждый запрос тратит 1 токен. Токены пополняются со скоростью refillRate за секунду. Если tokens <= 0 — отклоняем запрос (429).',
      solution: `import java.util.*;

public class Main {
    static class TokenBucketLimiter {
        private final int maxTokens;
        private final double refillRate;
        private final Map<String, long[]> buckets = new HashMap<>();

        TokenBucketLimiter(int maxTokens, double refillRate) {
            this.maxTokens = maxTokens;
            this.refillRate = refillRate;
        }

        boolean allowRequest(String userId) {
            long now = System.nanoTime();
            buckets.putIfAbsent(userId, new long[]{maxTokens, now});
            long[] bucket = buckets.get(userId);

            long elapsed = now - bucket[1];
            double refill = (elapsed / 1_000_000_000.0) * refillRate;
            bucket[0] = Math.min(maxTokens, bucket[0] + (long) refill);
            bucket[1] = now;

            if (bucket[0] > 0) {
                bucket[0]--;
                return true;
            }
            return false;
        }

        String getStatus(String userId) {
            long[] bucket = buckets.getOrDefault(userId, new long[]{maxTokens, 0});
            return String.format("%s: %d/%d tokens", userId, bucket[0], maxTokens);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== QuickBite Rate Limiter ===");
        System.out.println("Конфиг: max=10 tokens, refill=2 tokens/sec");

        var limiter = new TokenBucketLimiter(10, 2);

        System.out.println("--- Нормальный пользователь (user-1) ---");
        String[] endpoints = {
            "GET /api/restaurants", "GET /api/menu/42",
            "GET /api/order", "POST /api/order", "GET /api/order/status"
        };
        for (String ep : endpoints) {
            limiter.allowRequest("user-1");
            long[] b = limiter.buckets.get("user-1");
            System.out.printf("%s → 200 OK (tokens: %d/10)%n", ep, b[0]);
        }

        System.out.println("--- Атакующий (attacker-1): 20 запросов подряд ---");
        int blocked = 0;
        for (int i = 1; i <= 20; i++) {
            boolean allowed = limiter.allowRequest("attacker-1");
            if (allowed) {
                System.out.printf("Запрос %d → 200 OK%n", i);
            } else {
                blocked++;
                System.out.printf("Запрос %d → 429 Too Many Requests%n", i);
            }
        }

        System.out.println("--- Статистика ---");
        System.out.println(limiter.getStatus("user-1"));
        System.out.println(limiter.getStatus("attacker-1"));
        System.out.printf("Заблокировано: %d запросов%n", blocked);
    }
}`,
      explanation: 'Rate limiting — must-have для любого публичного API. Cloudflare блокирует ~86 млрд кибер-атак в день. GitHub API лимитирует 5000 запросов/час. Token Bucket — самый популярный алгоритм: используется в Nginx, Envoy, AWS API Gateway. Stripe использует sliding window для платёжного API. Google Cloud дополнительно различает лимиты per-user, per-project и per-region. В QuickBite rate limiter защищает от abuse и гарантирует Fair Use для всех клиентов.'
    },
    {
      id: 4,
      title: 'Config Management: Конфигурация',
      type: 'practice',
      difficulty: 'medium',
      description: 'Sprint 3, день 7. Product manager: "Хотим запустить новый checkout flow, но только для 50% пользователей — A/B тест. И нужен тёмный режим для бета-тестеров". Задача: реализовать систему feature flags и A/B тестов для QuickBite.',
      requirements: [
        'Класс FeatureConfig с Map<String, FeatureFlag> для хранения конфигов',
        'Record FeatureFlag(String name, boolean enabled, int rolloutPercent, List<String> variants)',
        'Метод isEnabled(String feature) → boolean: проверка включён ли фича-флаг',
        'Метод getVariant(String feature, String userId) → String: детерминированный выбор варианта A/B теста на основе userId.hashCode()',
        'Метод getRollout(String feature, String userId) → boolean: включено ли для этого пользователя (по rolloutPercent)',
        'Конфиги: dark_mode (enabled, 20% rollout), new_checkout (enabled, 50%, variants: A/B), promo_banner (disabled)',
        'Показать разные результаты для 5 пользователей'
      ],
      expectedOutput: '=== QuickBite Feature Config ===\n--- Feature Flags ---\ndark_mode: enabled=true, rollout=20%\nnew_checkout: enabled=true, rollout=50%, variants=[A, B]\npromo_banner: enabled=false\n--- Проверка для пользователей ---\nuser-1: dark_mode=false, checkout=A, promo=false\nuser-2: dark_mode=false, checkout=B, promo=false\nuser-3: dark_mode=true, checkout=A, promo=false\nuser-4: dark_mode=false, checkout=B, promo=false\nuser-5: dark_mode=true, checkout=A, promo=false\n--- A/B тест: new_checkout ---\nВариант A: 3 пользователей\nВариант B: 2 пользователей',
      hint: 'Для детерминированного A/B теста: Math.abs(userId.hashCode()) % variants.size() → индекс варианта. Для rollout: Math.abs(userId.hashCode()) % 100 < rolloutPercent.',
      solution: `import java.util.*;

public class Main {
    record FeatureFlag(String name, boolean enabled, int rolloutPercent, List<String> variants) {
        FeatureFlag(String name, boolean enabled, int rolloutPercent) {
            this(name, enabled, rolloutPercent, List.of());
        }
    }

    static class FeatureConfig {
        private final Map<String, FeatureFlag> flags = new LinkedHashMap<>();

        void register(FeatureFlag flag) {
            flags.put(flag.name(), flag);
        }

        boolean isEnabled(String feature) {
            var flag = flags.get(feature);
            return flag != null && flag.enabled();
        }

        boolean getRollout(String feature, String userId) {
            var flag = flags.get(feature);
            if (flag == null || !flag.enabled()) return false;
            return Math.abs((userId + feature).hashCode()) % 100 < flag.rolloutPercent();
        }

        String getVariant(String feature, String userId) {
            var flag = flags.get(feature);
            if (flag == null || !flag.enabled() || flag.variants().isEmpty()) return "none";
            int idx = Math.abs((userId + feature).hashCode()) % flag.variants().size();
            return flag.variants().get(idx);
        }

        Collection<FeatureFlag> allFlags() { return flags.values(); }
    }

    public static void main(String[] args) {
        System.out.println("=== QuickBite Feature Config ===");

        var config = new FeatureConfig();
        config.register(new FeatureFlag("dark_mode", true, 20));
        config.register(new FeatureFlag("new_checkout", true, 50, List.of("A", "B")));
        config.register(new FeatureFlag("promo_banner", false, 0));

        System.out.println("--- Feature Flags ---");
        for (var flag : config.allFlags()) {
            String info = flag.name() + ": enabled=" + flag.enabled() + ", rollout=" + flag.rolloutPercent() + "%";
            if (!flag.variants().isEmpty()) info += ", variants=" + flag.variants();
            System.out.println(info);
        }

        System.out.println("--- Проверка для пользователей ---");
        List<String> users = List.of("user-1", "user-2", "user-3", "user-4", "user-5");
        Map<String, Integer> variantCounts = new HashMap<>();

        for (String uid : users) {
            boolean dark = config.getRollout("dark_mode", uid);
            String checkout = config.getVariant("new_checkout", uid);
            boolean promo = config.isEnabled("promo_banner");
            System.out.printf("%s: dark_mode=%s, checkout=%s, promo=%s%n",
                    uid, dark, checkout, promo);
            variantCounts.merge(checkout, 1, Integer::sum);
        }

        System.out.println("--- A/B тест: new_checkout ---");
        variantCounts.forEach((variant, count) ->
                System.out.printf("Вариант %s: %d пользователей%n", variant, count));
    }
}`,
      explanation: 'Feature flags — стандарт в индустрии. LaunchDarkly обслуживает триллионы feature flag evaluations в день. Netflix использует feature flags для канареечных релизов — новый код сначала раскатывается на 1% пользователей, потом 5%, 25%, 100%. Uber запускает новый surge pricing через A/B тест: вариант A (старый алгоритм) vs B (новый), сравнивают конверсию и выручку. В Казахстане Kaspi.kz активно тестирует интерфейсы через A/B. Детерминированность через hashCode гарантирует: один userId всегда видит один и тот же вариант.'
    },
    {
      id: 5,
      title: 'Health Check: Мониторинг сервисов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Sprint 3, день 9. SRE: "Нужен health endpoint — чтобы Kubernetes знал, когда перезапускать сервис. И дашборд для дежурных инженеров". Задача: реализовать систему health checks для всех компонентов QuickBite.',
      requirements: [
        'Enum Status { UP, DOWN, DEGRADED }',
        'Record ComponentHealth(String name, Status status, long responseTimeMs, String details)',
        'Record SystemHealth(Status overall, List<ComponentHealth> components, long checkedAt)',
        'Проверки: database, cache, payment-api, maps-api, notification-service',
        'Симуляция: database=UP(5ms), cache=UP(1ms), payment-api=DEGRADED(450ms, slow response), maps-api=DOWN(timeout), notification=UP(15ms)',
        'Overall status = worst component status (DOWN > DEGRADED > UP)',
        'Вывести health dashboard с цветными статусами и общим временем проверки'
      ],
      expectedOutput: '=== QuickBite Health Dashboard ===\nTimestamp: 2024-01-15 10:30:00\n╔══════════════════════════════════════════════════╗\n║ Component              Status    Response  Info  ║\n╠══════════════════════════════════════════════════╣\n║ database               UP        5ms       OK    ║\n║ cache                  UP        1ms       OK    ║\n║ payment-api            DEGRADED  450ms     slow response ║\n║ maps-api               DOWN      0ms       connection timeout ║\n║ notification-service   UP        15ms      OK    ║\n╠══════════════════════════════════════════════════╣\n║ OVERALL: DOWN                                    ║\n║ Total check time: 471ms                          ║\n║ Healthy: 3/5 components                          ║\n╚══════════════════════════════════════════════════╝\n\n⚠ ALERT: System is DOWN!\n  - maps-api: connection timeout\n  - payment-api: slow response',
      hint: 'Для overall status используй compareTo на enum: DOWN > DEGRADED > UP (по ordinal, если определить в таком порядке UP, DEGRADED, DOWN). Или stream().map(ComponentHealth::status).max().',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    enum Status { UP, DEGRADED, DOWN }

    record ComponentHealth(String name, Status status, long responseTimeMs, String details) {}
    record SystemHealth(Status overall, List<ComponentHealth> components, long totalMs) {}

    static ComponentHealth checkDatabase() {
        return new ComponentHealth("database", Status.UP, 5, "OK");
    }
    static ComponentHealth checkCache() {
        return new ComponentHealth("cache", Status.UP, 1, "OK");
    }
    static ComponentHealth checkPaymentApi() {
        return new ComponentHealth("payment-api", Status.DEGRADED, 450, "slow response");
    }
    static ComponentHealth checkMapsApi() {
        return new ComponentHealth("maps-api", Status.DOWN, 0, "connection timeout");
    }
    static ComponentHealth checkNotification() {
        return new ComponentHealth("notification-service", Status.UP, 15, "OK");
    }

    static SystemHealth checkAll() {
        var components = List.of(
            checkDatabase(), checkCache(), checkPaymentApi(),
            checkMapsApi(), checkNotification()
        );
        Status overall = components.stream()
                .map(ComponentHealth::status)
                .max(Comparator.comparingInt(Enum::ordinal))
                .orElse(Status.UP);
        long totalMs = components.stream().mapToLong(ComponentHealth::responseTimeMs).sum();
        return new SystemHealth(overall, components, totalMs);
    }

    public static void main(String[] args) {
        System.out.println("=== QuickBite Health Dashboard ===");
        System.out.println("Timestamp: 2024-01-15 10:30:00");

        var health = checkAll();
        long healthy = health.components().stream().filter(c -> c.status() == Status.UP).count();

        System.out.println("╔══════════════════════════════════════════════════╗");
        System.out.println("║ Component              Status    Response  Info  ║");
        System.out.println("╠══════════════════════════════════════════════════╣");
        for (var c : health.components()) {
            System.out.printf("║ %-22s %-9s %-9s %s ║%n",
                    c.name(), c.status(), c.responseTimeMs() + "ms", c.details());
        }
        System.out.println("╠══════════════════════════════════════════════════╣");
        System.out.printf("║ OVERALL: %-40s ║%n", health.overall());
        System.out.printf("║ Total check time: %-31s ║%n", health.totalMs() + "ms");
        System.out.printf("║ Healthy: %d/%d components %25s ║%n",
                healthy, health.components().size(), "");
        System.out.println("╚══════════════════════════════════════════════════╝");

        if (health.overall() != Status.UP) {
            System.out.printf("%n⚠ ALERT: System is %s!%n", health.overall());
            health.components().stream()
                    .filter(c -> c.status() != Status.UP)
                    .sorted(Comparator.comparingInt((ComponentHealth c) -> c.status().ordinal()).reversed())
                    .forEach(c -> System.out.printf("  - %s: %s%n", c.name(), c.details()));
        }
    }
}`,
      explanation: 'Health checks — обязательная часть production-ready сервиса. Kubernetes использует liveness probe (перезапуск при DOWN) и readiness probe (исключение из балансировки при DEGRADED). Spring Boot Actuator предоставляет /health endpoint из коробки. В Netflix health check включает проверку Circuit Breaker, connection pool, disk space. PagerDuty/OpsGenie шлёт алерты дежурным инженерам. Kaspi.kz мониторит сотни микросервисов — если payment-api деградирует, трафик переключается на резервный дата-центр.'
    },
    {
      id: 6,
      title: 'Retry & Circuit Breaker: Отказоустойчивость',
      type: 'practice',
      difficulty: 'hard',
      description: 'Sprint 3, день 11. Инцидент: платёжный шлюз Kaspi Pay периодически таймаутит — 30% запросов падают. Без retry пользователи не могут оплатить заказ. Без circuit breaker мы DDoS-им упавший сервис. Задача: реализовать retry с exponential backoff и circuit breaker.',
      requirements: [
        'Класс RetryPolicy: maxRetries, метод execute(Supplier<T>) с exponential backoff (задержки 1s, 2s, 4s — в симуляции без реального sleep)',
        'Enum CircuitState { CLOSED, OPEN, HALF_OPEN }',
        'Класс CircuitBreaker: failureThreshold (5), recoveryTimeMs (30000), state, failureCount',
        'CircuitBreaker.execute(Supplier<T>): CLOSED → нормальная работа, при failureThreshold ошибок → OPEN',
        'OPEN → сразу выбрасывает исключение (fast fail), после recoveryTime → HALF_OPEN',
        'HALF_OPEN → пробует один запрос: успех → CLOSED, неудача → OPEN',
        'Симулировать flaky KaspiPay API: первые 6 вызовов → ошибка, потом → успех',
        'Показать: retry логи, переход CLOSED → OPEN → HALF_OPEN → CLOSED'
      ],
      expectedOutput: '=== QuickBite Circuit Breaker ===\n--- Retry с Exponential Backoff ---\n[RETRY] Попытка 1/3: KaspiPay API... ОШИБКА (Payment timeout)\n[RETRY] Ожидание 1000ms...\n[RETRY] Попытка 2/3: KaspiPay API... ОШИБКА (Payment timeout)\n[RETRY] Ожидание 2000ms...\n[RETRY] Попытка 3/3: KaspiPay API... ОШИБКА (Payment timeout)\n[RETRY] Все попытки исчерпаны!\n--- Circuit Breaker ---\n[CB] State: CLOSED\n[CB] Запрос 1: FAIL (failures: 1/5)\n[CB] Запрос 2: FAIL (failures: 2/5)\n[CB] Запрос 3: FAIL (failures: 3/5)\n[CB] Запрос 4: FAIL (failures: 4/5)\n[CB] Запрос 5: FAIL (failures: 5/5)\n[CB] State: CLOSED → OPEN (слишком много ошибок!)\n[CB] Запрос 6: FAST FAIL (circuit is OPEN)\n[CB] Запрос 7: FAST FAIL (circuit is OPEN)\n--- Восстановление (симуляция 30s паузы) ---\n[CB] State: OPEN → HALF_OPEN (пробуем один запрос)\n[CB] Запрос 8: SUCCESS!\n[CB] State: HALF_OPEN → CLOSED (сервис восстановился)\n[CB] Запрос 9: SUCCESS!\n[CB] Запрос 10: SUCCESS!',
      hint: 'Circuit Breaker — конечный автомат (state machine). В CLOSED считай ошибки, при threshold → OPEN. В OPEN проверяй время: если прошло recoveryTime → HALF_OPEN. В HALF_OPEN: один успех → CLOSED, одна ошибка → обратно OPEN.',
      solution: `import java.util.function.Supplier;

public class Main {
    static class RetryPolicy {
        private final int maxRetries;
        private final long baseDelayMs;

        RetryPolicy(int maxRetries, long baseDelayMs) {
            this.maxRetries = maxRetries;
            this.baseDelayMs = baseDelayMs;
        }

        <T> T execute(Supplier<T> action, String name) {
            for (int i = 1; i <= maxRetries; i++) {
                try {
                    System.out.printf("[RETRY] Попытка %d/%d: %s... ", i, maxRetries, name);
                    T result = action.get();
                    System.out.println("УСПЕХ!");
                    return result;
                } catch (RuntimeException e) {
                    System.out.println("ОШИБКА (" + e.getMessage() + ")");
                    if (i < maxRetries) {
                        long delay = baseDelayMs * (1L << (i - 1));
                        System.out.printf("[RETRY] Ожидание %dms...%n", delay);
                    }
                }
            }
            System.out.println("[RETRY] Все попытки исчерпаны!");
            return null;
        }
    }

    enum CircuitState { CLOSED, OPEN, HALF_OPEN }

    static class CircuitBreaker {
        private CircuitState state = CircuitState.CLOSED;
        private int failureCount = 0;
        private final int failureThreshold;
        private long lastFailureTime = 0;
        private final long recoveryTimeMs;

        CircuitBreaker(int failureThreshold, long recoveryTimeMs) {
            this.failureThreshold = failureThreshold;
            this.recoveryTimeMs = recoveryTimeMs;
        }

        <T> T execute(Supplier<T> action, int reqNum) {
            if (state == CircuitState.OPEN) {
                long elapsed = System.currentTimeMillis() - lastFailureTime;
                if (elapsed >= recoveryTimeMs) {
                    state = CircuitState.HALF_OPEN;
                    System.out.println("[CB] State: OPEN → HALF_OPEN (пробуем один запрос)");
                } else {
                    System.out.printf("[CB] Запрос %d: FAST FAIL (circuit is OPEN)%n", reqNum);
                    return null;
                }
            }

            try {
                T result = action.get();
                System.out.printf("[CB] Запрос %d: SUCCESS!%n", reqNum);
                if (state == CircuitState.HALF_OPEN) {
                    System.out.println("[CB] State: HALF_OPEN → CLOSED (сервис восстановился)");
                }
                state = CircuitState.CLOSED;
                failureCount = 0;
                return result;
            } catch (RuntimeException e) {
                failureCount++;
                lastFailureTime = System.currentTimeMillis();
                System.out.printf("[CB] Запрос %d: FAIL (failures: %d/%d)%n",
                        reqNum, failureCount, failureThreshold);
                if (failureCount >= failureThreshold) {
                    System.out.println("[CB] State: CLOSED → OPEN (слишком много ошибок!)");
                    state = CircuitState.OPEN;
                }
                return null;
            }
        }

        void simulateRecoveryPause() {
            lastFailureTime -= recoveryTimeMs;
        }

        CircuitState getState() { return state; }
    }

    static int callCount = 0;

    static String flakyKaspiPay() {
        callCount++;
        if (callCount <= 7) throw new RuntimeException("Payment timeout");
        return "payment-confirmed";
    }

    public static void main(String[] args) {
        System.out.println("=== QuickBite Circuit Breaker ===");

        System.out.println("--- Retry с Exponential Backoff ---");
        var retry = new RetryPolicy(3, 1000);
        callCount = 0;
        retry.execute(Main::flakyKaspiPay, "KaspiPay API");

        System.out.println("--- Circuit Breaker ---");
        callCount = 0;
        var cb = new CircuitBreaker(5, 30000);
        System.out.println("[CB] State: " + cb.getState());

        for (int i = 1; i <= 7; i++) {
            cb.execute(Main::flakyKaspiPay, i);
        }

        System.out.println("--- Восстановление (симуляция 30s паузы) ---");
        cb.simulateRecoveryPause();
        callCount = 7;

        for (int i = 8; i <= 10; i++) {
            cb.execute(Main::flakyKaspiPay, i);
        }
    }
}`,
      explanation: 'Circuit Breaker паттерн (Мартин Фаулер, 2007) — стандарт отказоустойчивости. Netflix Hystrix (теперь Resilience4j) предотвратил каскадные падения: если рекомендательный сервис умер, остальные продолжают работать. Retry с exponential backoff используется в AWS SDK, Google Cloud Client — избегает thundering herd (все ретраят одновременно). В Uber при сбое платежей circuit breaker переключает на резервный процессинг. В продакшене важно добавить jitter (случайная добавка к задержке) чтобы избежать синхронных ретраев.'
    },
    {
      id: 7,
      title: 'Batch Processing: Массовые операции',
      type: 'practice',
      difficulty: 'medium',
      description: 'Sprint 3, день 14. Финансовый директор: "Курьеры жалуются — выплаты вручную занимают полдня. Нужна автоматическая ежедневная выгрузка для банков". Задача: реализовать batch-обработку выплат курьерам QuickBite.',
      requirements: [
        'Record CourierPayout(String courierId, String name, String iban, int amountKzt, String bank)',
        'Record PayoutResult(String courierId, boolean success, String message)',
        'Валидация: IBAN начинается с "KZ", длина 20 символов; сумма > 0 и <= 500000',
        'Группировка по банкам: Map<String, List<CourierPayout>>',
        'Генерация "batch файла" для каждого банка: банк, кол-во, общая сумма',
        'Обработка ошибок: невалидный IBAN, отрицательная сумма, превышение лимита',
        'Финальный отчёт: успешных, ошибок, общая сумма выплат'
      ],
      expectedOutput: '=== QuickBite Batch Payouts ===\nДата: 2024-01-15\nКурьеров к выплате: 7\n--- Валидация ---\n✓ courier-1 Арман: 45000 KZT → OK\n✓ courier-2 Болат: 38000 KZT → OK\n✗ courier-3 Серик: -5000 KZT → Ошибка: отрицательная сумма\n✓ courier-4 Данияр: 52000 KZT → OK\n✗ courier-5 Ернар: 12000 KZT → Ошибка: невалидный IBAN (не KZ или длина != 20)\n✓ courier-6 Жанат: 41000 KZT → OK\n✗ courier-7 Канат: 600000 KZT → Ошибка: сумма превышает лимит 500000 KZT\n--- Batch файлы по банкам ---\n[Kaspi Bank] 2 выплат, сумма: 83000 KZT\n  - courier-1 Арман: 45000 KZT\n  - courier-2 Болат: 38000 KZT\n[Halyk Bank] 1 выплат, сумма: 52000 KZT\n  - courier-4 Данияр: 52000 KZT\n[Forte Bank] 1 выплат, сумма: 41000 KZT\n  - courier-6 Жанат: 41000 KZT\n--- Итоговый отчёт ---\nУспешно: 4 из 7\nОшибки: 3\nОбщая сумма выплат: 176000 KZT',
      hint: 'Для группировки используй Collectors.groupingBy(CourierPayout::bank). Для валидации создай отдельный метод validate(), возвращающий Optional<String> (ошибку) или Optional.empty() (всё ок).',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record CourierPayout(String courierId, String name, String iban, int amountKzt, String bank) {}
    record PayoutResult(String courierId, String name, boolean success, String message, int amount) {}

    static Optional<String> validate(CourierPayout p) {
        if (p.amountKzt() <= 0) return Optional.of("отрицательная сумма");
        if (p.amountKzt() > 500000) return Optional.of("сумма превышает лимит 500000 KZT");
        if (!p.iban().startsWith("KZ") || p.iban().length() != 20)
            return Optional.of("невалидный IBAN (не KZ или длина != 20)");
        return Optional.empty();
    }

    public static void main(String[] args) {
        System.out.println("=== QuickBite Batch Payouts ===");
        System.out.println("Дата: 2024-01-15");

        var payouts = List.of(
            new CourierPayout("courier-1", "Арман", "KZ12345678901234ABCD", 45000, "Kaspi Bank"),
            new CourierPayout("courier-2", "Болат", "KZ98765432109876EFGH", 38000, "Kaspi Bank"),
            new CourierPayout("courier-3", "Серик", "KZ11111111111111IJKL", -5000, "Halyk Bank"),
            new CourierPayout("courier-4", "Данияр", "KZ22222222222222MNOP", 52000, "Halyk Bank"),
            new CourierPayout("courier-5", "Ернар", "INVALID_IBAN", 12000, "Forte Bank"),
            new CourierPayout("courier-6", "Жанат", "KZ33333333333333QRST", 41000, "Forte Bank"),
            new CourierPayout("courier-7", "Канат", "KZ44444444444444UVWX", 600000, "Kaspi Bank")
        );

        System.out.println("Курьеров к выплате: " + payouts.size());
        System.out.println("--- Валидация ---");

        List<PayoutResult> results = new ArrayList<>();
        List<CourierPayout> valid = new ArrayList<>();

        for (var p : payouts) {
            var error = validate(p);
            if (error.isEmpty()) {
                results.add(new PayoutResult(p.courierId(), p.name(), true, "OK", p.amountKzt()));
                valid.add(p);
                System.out.printf("✓ %s %s: %d KZT → OK%n", p.courierId(), p.name(), p.amountKzt());
            } else {
                results.add(new PayoutResult(p.courierId(), p.name(), false, error.get(), p.amountKzt()));
                System.out.printf("✗ %s %s: %d KZT → Ошибка: %s%n",
                        p.courierId(), p.name(), p.amountKzt(), error.get());
            }
        }

        System.out.println("--- Batch файлы по банкам ---");
        var grouped = valid.stream().collect(Collectors.groupingBy(CourierPayout::bank,
                LinkedHashMap::new, Collectors.toList()));

        for (var entry : grouped.entrySet()) {
            int total = entry.getValue().stream().mapToInt(CourierPayout::amountKzt).sum();
            System.out.printf("[%s] %d выплат, сумма: %d KZT%n",
                    entry.getKey(), entry.getValue().size(), total);
            for (var p : entry.getValue()) {
                System.out.printf("  - %s %s: %d KZT%n", p.courierId(), p.name(), p.amountKzt());
            }
        }

        long successCount = results.stream().filter(PayoutResult::success).count();
        long errorCount = results.size() - successCount;
        int totalAmount = valid.stream().mapToInt(CourierPayout::amountKzt).sum();

        System.out.println("--- Итоговый отчёт ---");
        System.out.printf("Успешно: %d из %d%n", successCount, results.size());
        System.out.printf("Ошибки: %d%n", errorCount);
        System.out.printf("Общая сумма выплат: %d KZT%n", totalAmount);
    }
}`,
      explanation: 'Batch processing — ежедневная реальность финтеха. Kaspi Bank обрабатывает миллионы выплат через ACH-подобную систему. Glovo и Delivery Hero выплачивают курьерам через batch: валидация → группировка по банкам → SFTP-файлы в банк. ISO 20022 (PAIN.001) — стандарт batch-платежей в Европе. Ошибки обязательно логируются: в Uber Eats невалидный банковский счёт блокирует выплату до исправления, а остальные обрабатываются. Двойная выплата — самый дорогой баг (Revolut потеряла $20M из-за дубликатов).'
    },
    {
      id: 8,
      title: 'Data Migration: Миграция данных',
      type: 'practice',
      difficulty: 'medium',
      description: 'Sprint 3, день 17. Техдолг: "Старая система хранила рестораны в pipe-separated формате — нужно мигрировать в новый формат. 500 записей, часть с ошибками". Задача: реализовать миграцию данных из старого формата в новый с валидацией.',
      requirements: [
        'Старый формат: "name|address|phone|rating" — pipe-separated строка',
        'Record Restaurant(String name, String address, String phone, double rating, String city)',
        'Парсинг: извлечь город из адреса (первое слово после последней запятой или "Unknown")',
        'Валидация: name не пустой, phone начинается с "+7" или "8", rating 0.0-5.0',
        'Обработка грязных данных: пустые поля, некорректный rating, отсутствующие разделители',
        'Три категории: migrated (успешно), skipped (warning, частично), errors (критические)',
        'Итоговый отчёт: кол-во и процент каждой категории'
      ],
      expectedOutput: '=== QuickBite Data Migration ===\nИсточник: legacy_restaurants.csv (pipe-separated)\nЗаписей к миграции: 8\n--- Миграция ---\n[OK] "Dastarkhan" → Restaurant(Dastarkhan, ул. Абая 15, Алматы, +77011234567, 4.5)\n[OK] "Burger House" → Restaurant(Burger House, пр. Назарбаева 88, Астана, +77021234567, 4.2)\n[SKIP] ""|пр. Ленина 5, Караганда|+77031111111|3.0" → пустое имя ресторана\n[OK] "Lagman House" → Restaurant(Lagman House, ул. Тулебаева 10, Алматы, 87771234567, 3.8)\n[ERROR] "Pizza King|ул. Байтурсынова" → недостаточно полей (2 из 4)\n[SKIP] "Шашлычная #1|ул. Гоголя 3, Шымкент|+77019999999|6.5" → рейтинг вне диапазона 0-5\n[OK] "KFC Express" → Restaurant(KFC Express, ул. Сатпаева 22, Алматы, +77017777777, 4.0)\n[ERROR] "" → пустая строка\n--- Отчёт о миграции ---\nУспешно:  4 (50.0%)\nПропущено: 2 (25.0%)\nОшибки:   2 (25.0%)\n--- Мигрированные записи ---\n1. Dastarkhan (Алматы) — ★4.5\n2. Burger House (Астана) — ★4.2\n3. Lagman House (Алматы) — ★3.8\n4. KFC Express (Алматы) — ★4.0',
      hint: 'Используй String.split("\\\\|") для pipe-separated. Для города: найди последнюю запятую в address, trim() после неё. Try-catch для parseDouble на rating. Три списка: migrated, skipped, errors.',
      solution: `import java.util.*;

public class Main {
    record Restaurant(String name, String address, String city, String phone, double rating) {}
    enum MigrationStatus { OK, SKIP, ERROR }
    record MigrationResult(MigrationStatus status, String source, String message, Restaurant restaurant) {}

    static String extractCity(String address) {
        int lastComma = address.lastIndexOf(',');
        if (lastComma >= 0 && lastComma < address.length() - 1) {
            return address.substring(lastComma + 1).trim();
        }
        return "Unknown";
    }

    static MigrationResult migrate(String line) {
        if (line == null || line.isBlank()) {
            return new MigrationResult(MigrationStatus.ERROR, "\\"\\"", "пустая строка", null);
        }

        String[] parts = line.split("\\\\|");
        if (parts.length < 4) {
            return new MigrationResult(MigrationStatus.ERROR,
                    "\\"" + line + "\\"", "недостаточно полей (" + parts.length + " из 4)", null);
        }

        String name = parts[0].trim();
        String address = parts[1].trim();
        String phone = parts[2].trim();
        String ratingStr = parts[3].trim();

        if (name.isEmpty()) {
            return new MigrationResult(MigrationStatus.SKIP, "\\"\\"|" + line.substring(1),
                    "пустое имя ресторана", null);
        }

        double rating;
        try {
            rating = Double.parseDouble(ratingStr);
        } catch (NumberFormatException e) {
            return new MigrationResult(MigrationStatus.SKIP,
                    "\\"" + name + "\\"", "некорректный рейтинг: " + ratingStr, null);
        }

        if (rating < 0 || rating > 5) {
            return new MigrationResult(MigrationStatus.SKIP,
                    "\\"" + name + "|" + address + "|" + phone + "|" + ratingStr + "\\"",
                    "рейтинг вне диапазона 0-5", null);
        }

        if (!phone.startsWith("+7") && !phone.startsWith("8")) {
            return new MigrationResult(MigrationStatus.SKIP,
                    "\\"" + name + "\\"", "некорректный телефон: " + phone, null);
        }

        String city = extractCity(address);
        var restaurant = new Restaurant(name, address, city, phone, rating);
        return new MigrationResult(MigrationStatus.OK, "\\"" + name + "\\"", null, restaurant);
    }

    public static void main(String[] args) {
        System.out.println("=== QuickBite Data Migration ===");
        System.out.println("Источник: legacy_restaurants.csv (pipe-separated)");

        var legacyData = List.of(
            "Dastarkhan|ул. Абая 15, Алматы|+77011234567|4.5",
            "Burger House|пр. Назарбаева 88, Астана|+77021234567|4.2",
            "|пр. Ленина 5, Караганда|+77031111111|3.0",
            "Lagman House|ул. Тулебаева 10, Алматы|87771234567|3.8",
            "Pizza King|ул. Байтурсынова",
            "Шашлычная #1|ул. Гоголя 3, Шымкент|+77019999999|6.5",
            "KFC Express|ул. Сатпаева 22, Алматы|+77017777777|4.0",
            ""
        );

        System.out.println("Записей к миграции: " + legacyData.size());
        System.out.println("--- Миграция ---");

        List<MigrationResult> results = new ArrayList<>();
        for (var line : legacyData) {
            var result = migrate(line);
            results.add(result);
            switch (result.status()) {
                case OK -> System.out.printf("[OK] %s → Restaurant(%s, %s, %s, %s, %.1f)%n",
                        result.source(), result.restaurant().name(), result.restaurant().address(),
                        result.restaurant().city(), result.restaurant().phone(), result.restaurant().rating());
                case SKIP -> System.out.printf("[SKIP] %s → %s%n", result.source(), result.message());
                case ERROR -> System.out.printf("[ERROR] %s → %s%n", result.source(), result.message());
            }
        }

        long ok = results.stream().filter(r -> r.status() == MigrationStatus.OK).count();
        long skip = results.stream().filter(r -> r.status() == MigrationStatus.SKIP).count();
        long err = results.stream().filter(r -> r.status() == MigrationStatus.ERROR).count();
        int total = results.size();

        System.out.println("--- Отчёт о миграции ---");
        System.out.printf("Успешно:  %d (%.1f%%)%n", ok, ok * 100.0 / total);
        System.out.printf("Пропущено: %d (%.1f%%)%n", skip, skip * 100.0 / total);
        System.out.printf("Ошибки:   %d (%.1f%%)%n", err, err * 100.0 / total);

        System.out.println("--- Мигрированные записи ---");
        int idx = 1;
        for (var r : results) {
            if (r.status() == MigrationStatus.OK) {
                System.out.printf("%d. %s (%s) — ★%.1f%n",
                        idx++, r.restaurant().name(), r.restaurant().city(), r.restaurant().rating());
            }
        }
    }
}`,
      explanation: 'Миграция данных — неизбежная часть роста стартапа. Twitter мигрировал с MySQL на Manhattan (собственная NoSQL) — миграция длилась 2 года. Spotify переносил данные из PostgreSQL в Google Cloud Spanner — использовали dual-write (пишем в обе базы, читаем из старой, сверяем). Главные правила: 1) никогда не удаляй старые данные до полной проверки, 2) миграция должна быть идемпотентной (можно запускать повторно), 3) обязательный отчёт с метриками. В Казахстане банки мигрируют данные при слияниях: Kaspi поглотил несколько банков и каждый раз мигрировал миллионы записей.'
    },
    {
      id: 9,
      title: 'Load Testing Simulator: Нагрузочный тест',
      type: 'practice',
      difficulty: 'hard',
      description: 'Sprint 3, день 19. QA-лид: "Перед запуском нужно понять, сколько заказов система выдержит. Сейчас 100 заказов/мин, в пике ожидаем 1000/мин. Симулируем нагрузку". Задача: написать симулятор нагрузочного теста для QuickBite.',
      requirements: [
        'Record LoadTestResult(int totalRequests, int successful, int failed, double avgMs, double p50, double p95, double p99)',
        'Метод simulateRequest(int currentLoad, int maxCapacity) → long (response time ms)',
        'При нагрузке < 50% capacity: responseTime = 20-50ms (быстро)',
        'При 50-80%: responseTime = 50-200ms (замедление)',
        'При 80-100%: responseTime = 200-1000ms (деградация)',
        'При > 100%: 30% запросов падают с ошибкой',
        'Метод calculatePercentile(List<Long>, int percentile) → double',
        'Прогнать тесты для нагрузок: 50, 200, 500, 800, 1200 запросов (capacity=1000)',
        'Вывести таблицу результатов для каждой нагрузки'
      ],
      expectedOutput: '=== QuickBite Load Test ===\nCapacity: 1000 req/min\n╔══════════════════════════════════════════════════════════════╗\n║ Load     Total  Success  Failed  Avg(ms)  P50   P95   P99  ║\n╠══════════════════════════════════════════════════════════════╣\n║ 50       50     50       0       35       35    48    50    ║\n║ 200      200    200      0       42       40    55    58    ║\n║ 500      500    500      0       125      120   190   198   ║\n║ 800      800    800      0       450      400   900   980   ║\n║ 1200     1200   840      360     680      600   950   990   ║\n╠══════════════════════════════════════════════════════════════╣\n║ ВЫВОД: Система стабильна до 500 req/min                     ║\n║ Деградация начинается при 800 req/min                       ║\n║ При 1200 req/min — 30% запросов падают                      ║\n╚══════════════════════════════════════════════════════════════╝',
      hint: 'Для симуляции response time используй Random с seed для воспроизводимости. Percentile: отсортируй список, p95 = list[size * 0.95]. ThreadLocalRandom для генерации latency в диапазоне.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    record LoadTestResult(int total, int success, int failed,
                          long avg, long p50, long p95, long p99) {}

    static final Random rng = new Random(42);

    static long simulateRequest(int currentLoad, int maxCapacity) {
        double ratio = (double) currentLoad / maxCapacity;
        if (ratio > 1.0 && rng.nextDouble() < 0.30) {
            return -1;
        }
        if (ratio <= 0.5) {
            return 20 + rng.nextInt(31);
        } else if (ratio <= 0.8) {
            return 50 + rng.nextInt(151);
        } else {
            return 200 + rng.nextInt(801);
        }
    }

    static long percentile(List<Long> sorted, int p) {
        int idx = (int) Math.ceil(sorted.size() * p / 100.0) - 1;
        return sorted.get(Math.max(0, Math.min(idx, sorted.size() - 1)));
    }

    static LoadTestResult runLoadTest(int load, int capacity) {
        List<Long> latencies = new ArrayList<>();
        int success = 0, failed = 0;

        for (int i = 0; i < load; i++) {
            long ms = simulateRequest(load, capacity);
            if (ms < 0) {
                failed++;
            } else {
                success++;
                latencies.add(ms);
            }
        }

        if (latencies.isEmpty()) {
            return new LoadTestResult(load, 0, failed, 0, 0, 0, 0);
        }

        Collections.sort(latencies);
        long avg = latencies.stream().mapToLong(Long::longValue).sum() / latencies.size();
        return new LoadTestResult(load, success, failed, avg,
                percentile(latencies, 50), percentile(latencies, 95), percentile(latencies, 99));
    }

    public static void main(String[] args) {
        System.out.println("=== QuickBite Load Test ===");
        System.out.println("Capacity: 1000 req/min");

        int capacity = 1000;
        int[] loads = {50, 200, 500, 800, 1200};

        System.out.println("╔══════════════════════════════════════════════════════════════╗");
        System.out.println("║ Load     Total  Success  Failed  Avg(ms)  P50   P95   P99  ║");
        System.out.println("╠══════════════════════════════════════════════════════════════╣");

        String stableLimit = "";
        String degradeStart = "";

        for (int load : loads) {
            var r = runLoadTest(load, capacity);
            System.out.printf("║ %-8d %-6d %-8d %-7d %-8d %-5d %-5d %-5d║%n",
                    load, r.total(), r.success(), r.failed(),
                    r.avg(), r.p50(), r.p95(), r.p99());

            if (r.failed() == 0 && r.avg() < 100) stableLimit = load + " req/min";
            if (r.avg() > 200 && degradeStart.isEmpty()) degradeStart = load + " req/min";
        }

        System.out.println("╠══════════════════════════════════════════════════════════════╣");
        System.out.printf("║ ВЫВОД: Система стабильна до %-32s║%n", stableLimit);
        System.out.printf("║ Деградация начинается при %-34s║%n", degradeStart);
        System.out.printf("║ При 1200 req/min — 30%% запросов падают %21s║%n", "");
        System.out.println("╚══════════════════════════════════════════════════════════════╝");
    }
}`,
      explanation: 'Нагрузочное тестирование — обязательный этап перед релизом. Netflix Chaos Monkey убивает случайные сервисы в продакшене (!) чтобы проверить устойчивость. JMeter, Gatling, k6 — инструменты для load testing. Ключевые метрики: P50 (медиана), P95, P99 — именно P99 определяет пользовательский опыт. Amazon установил правило: если P99 latency > 200ms — это баг. В Uber перед запуском в новом городе прогоняют нагрузочный тест на x3 ожидаемого трафика. QuickBite перед запуском в Алматы должен выдержать 3000 req/min в пике обеденного времени.'
    },
    {
      id: 10,
      title: 'Production Checklist: Готовность к запуску',
      type: 'practice',
      difficulty: 'hard',
      description: 'Sprint 3, день 21. CTO в Slack: "Запускаемся в понедельник! Нужна финальная проверка — всё ли готово к продакшену. Собираем checklist и считаем readiness score". Момент истины для QuickBite!',
      requirements: [
        'Enum CheckCategory { INFRASTRUCTURE, SECURITY, MONITORING, DATA, OPERATIONS }',
        'Record CheckItem(String name, CheckCategory category, boolean passed, String details)',
        'Проверки: health checks (pass), rate limiting (pass), circuit breaker (pass), SSL/TLS (fail — not configured), logging (pass), backup (fail — no backup strategy), monitoring alerts (pass), data migration (pass), load test (pass — supports 1000 rps), rollback plan (fail — not documented), error handling (pass), API docs (pass), secrets management (pass), GDPR compliance (fail — need consent flow)',
        'Score = (passed / total) * 100%, округлить',
        'Вывести: статус по категориям, общий score, блокирующие проблемы',
        'Рекомендация: >= 90% → GO, 70-89% → CONDITIONAL GO, < 70% → NO GO'
      ],
      expectedOutput: '=== QuickBite Production Readiness ===\nДата проверки: 2024-01-15\nВерсия: v1.3.0-rc1\n\n╔══════════════════════════════════════════════════╗\n║           PRODUCTION READINESS CHECKLIST         ║\n╠══════════════════════════════════════════════════╣\n║ INFRASTRUCTURE                                   ║\n║  ✓ Health checks configured                      ║\n║  ✓ Rate limiting enabled                         ║\n║  ✓ Circuit breaker configured                    ║\n║  ✗ SSL/TLS certificates — not configured         ║\n║  ✓ Load test passed — supports 1000 rps          ║\n║                                                  ║\n║ SECURITY                                         ║\n║  ✓ Secrets management                            ║\n║  ✗ GDPR compliance — need consent flow           ║\n║                                                  ║\n║ MONITORING                                       ║\n║  ✓ Logging configured                            ║\n║  ✓ Monitoring alerts active                      ║\n║                                                  ║\n║ DATA                                             ║\n║  ✓ Data migration complete                       ║\n║  ✗ Backup strategy — no backup strategy          ║\n║                                                  ║\n║ OPERATIONS                                       ║\n║  ✓ Error handling                                ║\n║  ✓ API documentation                             ║\n║  ✗ Rollback plan — not documented                ║\n╠══════════════════════════════════════════════════╣\n║ SCORE: 71% (10/14)                               ║\n║ VERDICT: ⚠ CONDITIONAL GO                        ║\n╠══════════════════════════════════════════════════╣\n║ BLOCKERS:                                        ║\n║  1. SSL/TLS certificates — not configured        ║\n║  2. GDPR compliance — need consent flow          ║\n║  3. Backup strategy — no backup strategy         ║\n║  4. Rollback plan — not documented               ║\n╚══════════════════════════════════════════════════╝\n\nРекомендация: Исправить SSL и backup до запуска.\nGDPR и rollback plan можно закрыть в Sprint 4.',
      hint: 'Сгруппируй CheckItem по категориям через Collectors.groupingBy. Для score: stream().filter(CheckItem::passed).count(). Блокеры — это непройденные проверки.',
      solution: `import java.util.*;
import java.util.stream.*;

public class Main {
    enum CheckCategory { INFRASTRUCTURE, SECURITY, MONITORING, DATA, OPERATIONS }

    record CheckItem(String name, CheckCategory category, boolean passed, String details) {}

    public static void main(String[] args) {
        System.out.println("=== QuickBite Production Readiness ===");
        System.out.println("Дата проверки: 2024-01-15");
        System.out.println("Версия: v1.3.0-rc1");
        System.out.println();

        var checks = List.of(
            new CheckItem("Health checks configured", CheckCategory.INFRASTRUCTURE, true, "all services UP"),
            new CheckItem("Rate limiting enabled", CheckCategory.INFRASTRUCTURE, true, "100 req/min per user"),
            new CheckItem("Circuit breaker configured", CheckCategory.INFRASTRUCTURE, true, "threshold: 5, recovery: 30s"),
            new CheckItem("SSL/TLS certificates", CheckCategory.INFRASTRUCTURE, false, "not configured"),
            new CheckItem("Load test passed", CheckCategory.INFRASTRUCTURE, true, "supports 1000 rps"),
            new CheckItem("Secrets management", CheckCategory.SECURITY, true, "env variables, no hardcoded secrets"),
            new CheckItem("GDPR compliance", CheckCategory.SECURITY, false, "need consent flow"),
            new CheckItem("Logging configured", CheckCategory.MONITORING, true, "structured JSON logs"),
            new CheckItem("Monitoring alerts active", CheckCategory.MONITORING, true, "PagerDuty integrated"),
            new CheckItem("Data migration complete", CheckCategory.DATA, true, "500 restaurants migrated"),
            new CheckItem("Backup strategy", CheckCategory.DATA, false, "no backup strategy"),
            new CheckItem("Error handling", CheckCategory.OPERATIONS, true, "global exception handler"),
            new CheckItem("API documentation", CheckCategory.OPERATIONS, true, "OpenAPI 3.0 spec"),
            new CheckItem("Rollback plan", CheckCategory.OPERATIONS, false, "not documented")
        );

        long passed = checks.stream().filter(CheckItem::passed).count();
        int total = checks.size();
        int score = (int) Math.round(passed * 100.0 / total);

        String verdict = score >= 90 ? "✓ GO" : score >= 70 ? "⚠ CONDITIONAL GO" : "✗ NO GO";

        var grouped = checks.stream().collect(
                Collectors.groupingBy(CheckItem::category, LinkedHashMap::new, Collectors.toList()));

        System.out.println("╔══════════════════════════════════════════════════╗");
        System.out.println("║           PRODUCTION READINESS CHECKLIST         ║");
        System.out.println("╠══════════════════════════════════════════════════╣");

        for (var entry : grouped.entrySet()) {
            System.out.printf("║ %-49s║%n", entry.getKey());
            for (var item : entry.getValue()) {
                String mark = item.passed() ? "✓" : "✗";
                String line = item.passed()
                        ? String.format("  %s %s", mark, item.name())
                        : String.format("  %s %s — %s", mark, item.name(), item.details());
                System.out.printf("║ %-49s║%n", line);
            }
            System.out.printf("║ %-49s║%n", "");
        }

        System.out.println("╠══════════════════════════════════════════════════╣");
        System.out.printf("║ SCORE: %d%% (%d/%d) %-34s║%n", score, passed, total, "");
        System.out.printf("║ VERDICT: %-41s║%n", verdict);
        System.out.println("╠══════════════════════════════════════════════════╣");
        System.out.printf("║ %-49s║%n", "BLOCKERS:");

        int blockerNum = 1;
        for (var item : checks) {
            if (!item.passed()) {
                System.out.printf("║  %d. %-46s║%n", blockerNum++,
                        item.name() + " — " + item.details());
            }
        }
        System.out.println("╚══════════════════════════════════════════════════╝");

        System.out.println();
        System.out.println("Рекомендация: Исправить SSL и backup до запуска.");
        System.out.println("GDPR и rollback plan можно закрыть в Sprint 4.");
    }
}`,
      explanation: 'Production readiness review — практика из Google SRE книги. В Google нет запуска без PRR (Production Readiness Review): SRE-инженер проверяет мониторинг, SLA, capacity, incident response plan. В Uber перед запуском в новом городе чеклист включает 150+ пунктов. Amazon использует "operational readiness review" с автоматическими проверками. Score-система помогает объективно оценить готовность: Stripe не запускает сервис с readiness < 85%. Для QuickBite 71% — это CONDITIONAL GO: критичные фичи работают, но есть риски. В реальности CTO может принять решение запуститься с техническим долгом, если бизнес-окно закрывается.'
    }
  ]
};
