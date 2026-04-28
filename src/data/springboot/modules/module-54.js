export default {
  id: 54,
  title: 'Практикум: Redis и кеширование',
  description: 'Redis и Spring Cache: @Cacheable, @CacheEvict, TTL, SpEL ключи, RedisTemplate, сессии, rate limiting, распределённые блокировки, Pub/Sub и прогрев кеша.',
  lessons: [
    {
      id: 1,
      title: 'Задача: @Cacheable — основы кеширования',
      type: 'practice',
      difficulty: 'easy',
      description: 'Настройте Spring Cache с Redis и кешируйте результаты методов сервиса.',
      requirements: [
        'Подключить spring-boot-starter-data-redis и spring-boot-starter-cache',
        '@EnableCaching в конфигурации',
        'Настроить RedisCacheManager с JSON сериализацией',
        '@Cacheable("products") на методе findById',
        '@Cacheable(value="products", key="#category") на методе findByCategory',
        'Логирование: показать когда данные берутся из БД vs из кеша'
      ],
      expectedOutput: 'Первый вызов productService.findById(1):\n[DB] SELECT * FROM products WHERE id=1\nResult: Product(id=1, name="Laptop")\nRedis: SET products::1 → {"id":1,"name":"Laptop"}\n\nВторой вызов productService.findById(1):\n[CACHE HIT] Redis GET products::1\nResult: Product(id=1, name="Laptop")\nSQL запрос НЕ выполняется!',
      hint: 'Используйте GenericJackson2JsonRedisSerializer для JSON-сериализации в Redis. Кеш-ключ по умолчанию: cacheName::methodArg.',
      solution: '@Configuration\n@EnableCaching\npublic class RedisConfig {\n\n    @Bean\n    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {\n        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()\n            .entryTtl(Duration.ofMinutes(30))\n            .serializeKeysWith(RedisSerializationContext.SerializationPair\n                .fromSerializer(new StringRedisSerializer()))\n            .serializeValuesWith(RedisSerializationContext.SerializationPair\n                .fromSerializer(new GenericJackson2JsonRedisSerializer()))\n            .disableCachingNullValues();\n\n        return RedisCacheManager.builder(factory)\n            .cacheDefaults(config)\n            .build();\n    }\n}\n\n@Service\n@Slf4j\npublic class ProductService {\n    @Autowired ProductRepository repo;\n\n    @Cacheable(value = "products", key = "#id")\n    public Product findById(Long id) {\n        log.info("[DB] Loading product {} from database", id);\n        return repo.findById(id)\n            .orElseThrow(() -> new ResourceNotFoundException("Product", id));\n    }\n\n    @Cacheable(value = "products-by-category", key = "#category")\n    public List<Product> findByCategory(String category) {\n        log.info("[DB] Loading products for category: {}", category);\n        return repo.findByCategory(category);\n    }\n\n    @Cacheable(value = "product-count")\n    public long count() {\n        log.info("[DB] Counting products");\n        return repo.count();\n    }\n}',
      explanation: '@Cacheable перехватывает вызов метода: если результат уже в кеше — возвращает его, иначе выполняет метод и сохраняет результат. GenericJackson2JsonRedisSerializer хранит данные в JSON, что удобно для отладки через redis-cli. disableCachingNullValues() не кеширует null.'
    },
    {
      id: 2,
      title: 'Задача: @CacheEvict и @CachePut',
      type: 'practice',
      difficulty: 'easy',
      description: 'Управляйте инвалидацией кеша при изменении данных.',
      requirements: [
        '@CacheEvict при удалении продукта',
        '@CacheEvict(allEntries=true) при массовом обновлении',
        '@CachePut при обновлении продукта (обновить кеш без удаления)',
        '@Caching для комбинации нескольких операций с кешем',
        'Инвалидация связанных кешей: при обновлении продукта очистить кеш категории',
        'Условная инвалидация: evict только если продукт активный'
      ],
      expectedOutput: 'productService.update(1, updateReq):\n@CachePut: Redis SET products::1 → updated product\n@CacheEvict: Redis DEL products-by-category::Electronics\n\nproductService.delete(1):\n@CacheEvict: Redis DEL products::1\n\nproductService.importProducts(list):\n@CacheEvict(allEntries=true): Redis DEL products::*',
      hint: 'Используйте @Caching(evict={...}, put={...}) для множественных операций. condition и unless позволяют кешировать/инвалидировать условно.',
      solution: '@Service\n@Slf4j\npublic class ProductService {\n    @Autowired ProductRepository repo;\n\n    @CachePut(value = "products", key = "#id")\n    @CacheEvict(value = "products-by-category", key = "#result.category")\n    public Product update(Long id, UpdateProductRequest request) {\n        Product product = repo.findById(id)\n            .orElseThrow(() -> new ResourceNotFoundException("Product", id));\n        product.setName(request.name());\n        product.setPrice(request.price());\n        log.info("Updating product {} and refreshing cache", id);\n        return repo.save(product);\n    }\n\n    @Caching(evict = {\n        @CacheEvict(value = "products", key = "#id"),\n        @CacheEvict(value = "products-by-category", allEntries = true),\n        @CacheEvict(value = "product-count")\n    })\n    public void delete(Long id) {\n        log.info("Deleting product {} and evicting caches", id);\n        repo.deleteById(id);\n    }\n\n    @CacheEvict(value = {"products", "products-by-category", "product-count"}, allEntries = true)\n    public void importProducts(List<Product> products) {\n        log.info("Importing {} products, clearing all caches", products.size());\n        repo.saveAll(products);\n    }\n\n    // Условная инвалидация\n    @CacheEvict(value = "products", key = "#id", condition = "#result != null && #result.active")\n    public Product deactivate(Long id) {\n        Product product = repo.findById(id).orElse(null);\n        if (product != null) {\n            product.setActive(false);\n            return repo.save(product);\n        }\n        return null;\n    }\n}',
      explanation: '@CachePut всегда выполняет метод и обновляет кеш — используйте для UPDATE. @CacheEvict удаляет запись из кеша — используйте для DELETE. allEntries=true очищает весь кеш — используйте при массовых операциях. @Caching комбинирует несколько операций. condition контролирует когда применять аннотацию.'
    },
    {
      id: 3,
      title: 'Задача: TTL конфигурация',
      type: 'practice',
      difficulty: 'easy',
      description: 'Настройте разные TTL (Time-To-Live) для разных типов кешей.',
      requirements: [
        'Глобальный TTL: 30 минут',
        'Кеш "products": TTL 1 час',
        'Кеш "user-sessions": TTL 24 часа',
        'Кеш "hot-deals": TTL 5 минут',
        'Конфигурация через application.yml',
        'Программная конфигурация через RedisCacheManagerBuilderCustomizer'
      ],
      expectedOutput: 'Redis TTL проверка:\nredis-cli> TTL products::1 → 3600 (1 час)\nredis-cli> TTL user-sessions::42 → 86400 (24 часа)\nredis-cli> TTL hot-deals::summer → 300 (5 минут)\nredis-cli> TTL default-cache::key → 1800 (30 минут по умолчанию)',
      hint: 'Используйте RedisCacheManager.builder().withCacheConfiguration() для per-cache настройки. Или Map<String, RedisCacheConfiguration> для множества кешей.',
      solution: '// application.yml\n// spring:\n//   cache:\n//     type: redis\n//   data:\n//     redis:\n//       host: localhost\n//       port: 6379\n\n@Configuration\n@EnableCaching\npublic class CacheConfig {\n\n    @Bean\n    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {\n        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()\n            .entryTtl(Duration.ofMinutes(30))\n            .serializeValuesWith(RedisSerializationContext.SerializationPair\n                .fromSerializer(new GenericJackson2JsonRedisSerializer()));\n\n        Map<String, RedisCacheConfiguration> cacheConfigs = Map.of(\n            "products", defaultConfig.entryTtl(Duration.ofHours(1)),\n            "user-sessions", defaultConfig.entryTtl(Duration.ofHours(24)),\n            "hot-deals", defaultConfig.entryTtl(Duration.ofMinutes(5)),\n            "product-count", defaultConfig.entryTtl(Duration.ofMinutes(10)),\n            "user-profiles", defaultConfig.entryTtl(Duration.ofHours(2))\n        );\n\n        return RedisCacheManager.builder(factory)\n            .cacheDefaults(defaultConfig)\n            .withInitialCacheConfigurations(cacheConfigs)\n            .transactionAware()\n            .build();\n    }\n}\n\n// Альтернатива: через properties\n@ConfigurationProperties(prefix = "app.cache")\npublic record CacheProperties(\n    Duration defaultTtl,\n    Map<String, Duration> ttls\n) {}\n\n// application.yml:\n// app:\n//   cache:\n//     default-ttl: 30m\n//     ttls:\n//       products: 1h\n//       user-sessions: 24h\n//       hot-deals: 5m',
      explanation: 'Разные TTL для разных кешей — важная стратегия: часто меняющиеся данные (hot-deals) имеют короткий TTL, стабильные данные (products) — длинный. transactionAware() синхронизирует кеш-операции с транзакциями БД. withInitialCacheConfigurations() задаёт per-cache настройки.'
    },
    {
      id: 4,
      title: 'Задача: Cache ключи с SpEL',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создавайте сложные ключи кеша с помощью SpEL выражений.',
      requirements: [
        'Ключ из нескольких параметров: key="#userId + \':\' + #category"',
        'Ключ из полей объекта: key="#request.userId + \':\' + #request.page"',
        'Условное кеширование: condition="#result != null && #result.size() > 0"',
        'unless="#result == null": не кешировать null',
        'Кастомный KeyGenerator для стандартизации ключей',
        'SpEL: #root.method.name, #root.target.class.simpleName'
      ],
      expectedOutput: 'findByUserAndCategory(42, "Electronics"):\nCache key: "user-products::42:Electronics"\n\nsearch(SearchRequest(userId=1, query="phone", page=0)):\nCache key: "search::1:phone:0"\n\nCustom KeyGenerator:\nCache key: "ProductService.findByCategory:Electronics"\n\nCondition: результат пустой → НЕ кешируется\nCondition: результат непустой → кешируется',
      hint: 'SpEL в @Cacheable: #paramName, #result, #root.method, #root.target, #root.args[0]. Для комбинированных ключей используйте T(String).valueOf().',
      solution: `@Service\npublic class ProductService {\n\n    // Многосоставной ключ\n    @Cacheable(value = "user-products", key = "#userId + \\':\\' + #category")\n    public List<Product> findByUserAndCategory(Long userId, String category) {\n        return repo.findByUserIdAndCategory(userId, category);\n    }\n\n    // Ключ из полей объекта\n    @Cacheable(value = "search", key = "#request.userId + \\':\\' + #request.query + \\':\\' + #request.page")\n    public Page<Product> search(SearchRequest request) {\n        return repo.search(request);\n    }\n\n    // Условное кеширование\n    @Cacheable(value = "products-by-status",\n        key = "#status",\n        condition = "#status != \\'DRAFT\\'",\n        unless = "#result == null || #result.isEmpty()")\n    public List<Product> findByStatus(String status) {\n        return repo.findByStatus(status);\n    }\n\n    // Ключ с именем метода\n    @Cacheable(value = "stats", key = "#root.methodName + \\':\\' + #category")\n    public ProductStats getStats(String category) {\n        return calculateStats(category);\n    }\n}\n\n// Кастомный KeyGenerator\n@Configuration\npublic class CacheKeyConfig {\n\n    @Bean("customKeyGenerator")\n    public KeyGenerator keyGenerator() {\n        return (target, method, params) -> {\n            StringBuilder sb = new StringBuilder();\n            sb.append(target.getClass().getSimpleName());\n            sb.append(".");\n            sb.append(method.getName());\n            for (Object param : params) {\n                sb.append(":").append(param != null ? param.toString() : "null");\n            }\n            return sb.toString();\n        };\n    }\n}\n\n// Использование кастомного KeyGenerator\n@Cacheable(value = "products", keyGenerator = "customKeyGenerator")\npublic List<Product> findByCategory(String category) {\n    return repo.findByCategory(category);\n}\n// Key: "ProductService.findByCategory:Electronics"`,
      explanation: 'SpEL (Spring Expression Language) позволяет создавать динамические ключи кеша. condition проверяется ДО вызова метода — определяет нужно ли проверять кеш. unless проверяется ПОСЛЕ вызова — определяет нужно ли кешировать результат. KeyGenerator стандартизирует формат ключей для всего приложения.'
    },
    {
      id: 5,
      title: 'Задача: RedisTemplate операции',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте RedisTemplate для прямых операций с Redis: строки, хеши, списки, множества.',
      requirements: [
        'StringRedisTemplate для строковых операций',
        'RedisTemplate<String, Object> для объектов',
        'Хранение объектов как Hash: HSET user:1 name "Иван" email "ivan@mail.ru"',
        'Список последних действий: LPUSH recent-actions:user:1 "..."',
        'Множество онлайн-пользователей: SADD online-users "user:1"',
        'Sorted Set для рейтинга: ZADD leaderboard 100 "user:1"'
      ],
      expectedOutput: 'Redis String:\nSET product:1:views "150" EX 3600\nGET product:1:views → "150"\nINCR product:1:views → 151\n\nRedis Hash:\nHSET user:1 name "Иван" email "ivan@mail.ru" role "ADMIN"\nHGETALL user:1 → {name:"Иван", email:"ivan@mail.ru", role:"ADMIN"}\n\nRedis List:\nLPUSH recent:user:1 "viewed product 5" "created order 3"\nLRANGE recent:user:1 0 9 → последние 10 действий\n\nRedis Set:\nSADD online-users "user:1" "user:2" "user:3"\nSCARD online-users → 3',
      hint: 'RedisTemplate имеет opsForValue(), opsForHash(), opsForList(), opsForSet(), opsForZSet() для разных типов данных.',
      solution: '@Service\npublic class RedisService {\n    @Autowired StringRedisTemplate stringRedis;\n    @Autowired RedisTemplate<String, Object> redisTemplate;\n\n    // String операции\n    public void incrementViews(Long productId) {\n        String key = "product:" + productId + ":views";\n        stringRedis.opsForValue().increment(key);\n        stringRedis.expire(key, Duration.ofHours(1));\n    }\n\n    public Long getViews(Long productId) {\n        String val = stringRedis.opsForValue().get("product:" + productId + ":views");\n        return val != null ? Long.parseLong(val) : 0L;\n    }\n\n    // Hash операции\n    public void saveUserProfile(Long userId, Map<String, String> profile) {\n        String key = "user:" + userId;\n        stringRedis.opsForHash().putAll(key, profile);\n        stringRedis.expire(key, Duration.ofHours(24));\n    }\n\n    public Map<Object, Object> getUserProfile(Long userId) {\n        return stringRedis.opsForHash().entries("user:" + userId);\n    }\n\n    // List операции — последние действия\n    public void addRecentAction(Long userId, String action) {\n        String key = "recent:" + userId;\n        stringRedis.opsForList().leftPush(key, action);\n        stringRedis.opsForList().trim(key, 0, 9); // хранить только 10 последних\n        stringRedis.expire(key, Duration.ofDays(7));\n    }\n\n    public List<String> getRecentActions(Long userId) {\n        return stringRedis.opsForList().range("recent:" + userId, 0, 9);\n    }\n\n    // Set операции — онлайн пользователи\n    public void setOnline(Long userId) {\n        stringRedis.opsForSet().add("online-users", "user:" + userId);\n    }\n\n    public void setOffline(Long userId) {\n        stringRedis.opsForSet().remove("online-users", "user:" + userId);\n    }\n\n    public Long getOnlineCount() {\n        return stringRedis.opsForSet().size("online-users");\n    }\n\n    // Sorted Set — рейтинг\n    public void updateScore(String leaderboard, Long userId, double score) {\n        stringRedis.opsForZSet().add(leaderboard, "user:" + userId, score);\n    }\n\n    public Set<String> getTopPlayers(String leaderboard, int count) {\n        return stringRedis.opsForZSet().reverseRange(leaderboard, 0, count - 1);\n    }\n}',
      explanation: 'RedisTemplate предоставляет прямой доступ к Redis структурам данных. Каждый тип (String, Hash, List, Set, ZSet) имеет свои операции через opsFor*(). String — для счётчиков и простых значений. Hash — для объектов с отдельными полями. List — для очередей и истории. Set — для уникальных коллекций. ZSet — для рейтингов.'
    },
    {
      id: 6,
      title: 'Задача: Хранение сессий в Redis',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настройте Spring Session с Redis для распределённого хранения сессий.',
      requirements: [
        'Подключить spring-session-data-redis',
        '@EnableRedisHttpSession в конфигурации',
        'Настроить maxInactiveIntervalInSeconds = 1800 (30 минут)',
        'Хранение данных корзины в сессии',
        'Сессия доступна на нескольких инстансах приложения',
        'Просмотр активных сессий пользователя'
      ],
      expectedOutput: 'POST /api/cart/add {productId:1, quantity:2}:\nSession-ID: abc-123-def\nRedis: HSET spring:session:sessions:abc-123-def cart "[{productId:1,qty:2}]"\n\nGET /api/cart (другой инстанс приложения):\nSession-ID: abc-123-def (тот же)\nRedis: HGET spring:session:sessions:abc-123-def cart\nResult: [{productId:1, quantity:2}]\n\nСессия доступна на любом инстансе!',
      hint: 'Spring Session автоматически заменяет HttpSession на Redis-backed имплементацию. Данные в сессии сериализуются в Redis.',
      solution: '@Configuration\n@EnableRedisHttpSession(maxInactiveIntervalInSeconds = 1800)\npublic class SessionConfig {\n\n    @Bean\n    public CookieSerializer cookieSerializer() {\n        DefaultCookieSerializer serializer = new DefaultCookieSerializer();\n        serializer.setCookieName("SESSION");\n        serializer.setCookiePath("/");\n        serializer.setSameSite("Lax");\n        return serializer;\n    }\n}\n\n@RestController\n@RequestMapping("/api/cart")\npublic class CartController {\n\n    @PostMapping("/add")\n    public CartResponse addToCart(@RequestBody AddToCartRequest request,\n                                  HttpSession session) {\n        @SuppressWarnings("unchecked")\n        List<CartItem> cart = (List<CartItem>) session.getAttribute("cart");\n        if (cart == null) cart = new ArrayList<>();\n\n        cart.stream()\n            .filter(i -> i.getProductId().equals(request.productId()))\n            .findFirst()\n            .ifPresentOrElse(\n                item -> item.setQuantity(item.getQuantity() + request.quantity()),\n                () -> cart.add(new CartItem(request.productId(), request.quantity()))\n            );\n\n        session.setAttribute("cart", cart);\n        return new CartResponse(cart, cart.stream().mapToInt(CartItem::getQuantity).sum());\n    }\n\n    @GetMapping\n    public CartResponse getCart(HttpSession session) {\n        @SuppressWarnings("unchecked")\n        List<CartItem> cart = (List<CartItem>) session.getAttribute("cart");\n        if (cart == null) cart = Collections.emptyList();\n        return new CartResponse(cart, cart.stream().mapToInt(CartItem::getQuantity).sum());\n    }\n\n    @DeleteMapping\n    public void clearCart(HttpSession session) {\n        session.removeAttribute("cart");\n    }\n}\n\n// Просмотр активных сессий\n@Service\npublic class SessionService {\n    @Autowired\n    private FindByIndexNameSessionRepository<? extends Session> sessionRepository;\n\n    public Map<String, ? extends Session> getUserSessions(String username) {\n        return sessionRepository.findByPrincipalName(username);\n    }\n}',
      explanation: 'Spring Session Redis хранит HttpSession в Redis вместо памяти сервера. Это позволяет горизонтально масштабировать приложение — сессия доступна на любом инстансе. maxInactiveIntervalInSeconds задаёт TTL сессии. FindByIndexNameSessionRepository позволяет находить сессии по имени пользователя.'
    },
    {
      id: 7,
      title: 'Задача: Rate Limiting с Redis',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте ограничение частоты запросов (rate limiting) с помощью Redis.',
      requirements: [
        'Fixed Window: максимум 100 запросов в минуту на IP',
        'Sliding Window: более точный подсчёт',
        'Token Bucket: аннотация @RateLimit на контроллере',
        'Разные лимиты для разных endpoint-ов',
        'HTTP 429 Too Many Requests при превышении лимита',
        'Заголовки: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset'
      ],
      expectedOutput: 'Первые 100 запросов:\nHTTP 200 OK\nX-RateLimit-Limit: 100\nX-RateLimit-Remaining: 95\nX-RateLimit-Reset: 1705312800\n\n101-й запрос:\nHTTP 429 Too Many Requests\n{\n  "error": "Rate limit exceeded",\n  "retryAfter": 45\n}\nRetry-After: 45',
      hint: 'Используйте Redis INCR с EXPIRE для Fixed Window. Для Sliding Window — ZRANGEBYSCORE с timestamp. AOP-аспект для аннотации @RateLimit.',
      solution: '@Target(ElementType.METHOD)\n@Retention(RetentionPolicy.RUNTIME)\npublic @interface RateLimit {\n    int requests() default 100;\n    int timeWindowSeconds() default 60;\n}\n\n@Aspect\n@Component\npublic class RateLimitAspect {\n    @Autowired StringRedisTemplate redis;\n\n    @Around("@annotation(rateLimit)")\n    public Object checkRateLimit(ProceedingJoinPoint pjp, RateLimit rateLimit) throws Throwable {\n        HttpServletRequest request = ((ServletRequestAttributes)\n            RequestContextHolder.getRequestAttributes()).getRequest();\n        HttpServletResponse response = ((ServletRequestAttributes)\n            RequestContextHolder.getRequestAttributes()).getResponse();\n\n        String clientIp = request.getRemoteAddr();\n        String key = "rate-limit:" + clientIp + ":" + request.getRequestURI();\n\n        Long currentCount = redis.opsForValue().increment(key);\n        if (currentCount == 1) {\n            redis.expire(key, Duration.ofSeconds(rateLimit.timeWindowSeconds()));\n        }\n\n        Long ttl = redis.getExpire(key, TimeUnit.SECONDS);\n        int remaining = Math.max(0, rateLimit.requests() - currentCount.intValue());\n\n        response.setHeader("X-RateLimit-Limit", String.valueOf(rateLimit.requests()));\n        response.setHeader("X-RateLimit-Remaining", String.valueOf(remaining));\n        response.setHeader("X-RateLimit-Reset", String.valueOf(\n            Instant.now().plusSeconds(ttl).getEpochSecond()));\n\n        if (currentCount > rateLimit.requests()) {\n            response.setHeader("Retry-After", String.valueOf(ttl));\n            throw new RateLimitExceededException(ttl);\n        }\n\n        return pjp.proceed();\n    }\n}\n\n// Sliding Window реализация\n@Service\npublic class SlidingWindowRateLimiter {\n    @Autowired StringRedisTemplate redis;\n\n    public boolean isAllowed(String clientId, int maxRequests, int windowSeconds) {\n        String key = "sliding-rate:" + clientId;\n        long now = Instant.now().toEpochMilli();\n        long windowStart = now - (windowSeconds * 1000L);\n\n        redis.opsForZSet().removeRangeByScore(key, 0, windowStart);\n        Long count = redis.opsForZSet().size(key);\n\n        if (count != null && count >= maxRequests) {\n            return false;\n        }\n\n        redis.opsForZSet().add(key, String.valueOf(now), now);\n        redis.expire(key, Duration.ofSeconds(windowSeconds));\n        return true;\n    }\n}\n\n@RestController\npublic class ApiController {\n    @GetMapping("/api/data")\n    @RateLimit(requests = 100, timeWindowSeconds = 60)\n    public ResponseEntity<Data> getData() {\n        return ResponseEntity.ok(dataService.getData());\n    }\n}',
      explanation: 'Fixed Window: INCR + EXPIRE — простой, но имеет проблему на границе окна (можно отправить 200 запросов за 2 секунды). Sliding Window: ZSET с timestamp — точнее, но сложнее. Token Bucket: позволяет burst-запросы. AOP-аспект применяет rate limit декларативно через аннотацию.'
    },
    {
      id: 8,
      title: 'Задача: Распределённая блокировка (Distributed Lock)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте распределённую блокировку с Redis для предотвращения гонок в кластерной среде.',
      requirements: [
        'Redis SET NX EX для атомарной блокировки',
        'Автоматическое освобождение блокировки по TTL',
        'Безопасное освобождение: проверить что блокировка принадлежит текущему процессу',
        'Retry-механизм при неудачной попытке захвата блокировки',
        'Аннотация @DistributedLock для декларативного использования',
        'Redisson RLock как production-альтернатива'
      ],
      expectedOutput: 'Instance-1: acquireLock("order:123") → true (захватил)\nInstance-2: acquireLock("order:123") → false (занято)\n\nRedis: SET lock:order:123 "instance-1-uuid" NX EX 30\n\nInstance-1: releaseLock("order:123") → true\nInstance-2: acquireLock("order:123") → true (теперь свободно)\n\nTTL expiry: блокировка автоматически снимается через 30 сек',
      hint: 'Используйте SET key value NX EX ttl — атомарная операция. Для удаления используйте Lua-скрипт: проверить значение + удалить в одной атомарной операции.',
      solution: `@Service\npublic class DistributedLockService {\n    @Autowired StringRedisTemplate redis;\n    private static final String LOCK_PREFIX = "lock:";\n\n    public boolean acquireLock(String key, String owner, Duration ttl) {\n        Boolean acquired = redis.opsForValue()\n            .setIfAbsent(LOCK_PREFIX + key, owner, ttl);\n        return Boolean.TRUE.equals(acquired);\n    }\n\n    public boolean releaseLock(String key, String owner) {\n        // Lua-скрипт для атомарной проверки и удаления\n        String script = "if redis.call(\\'get\\', KEYS[1]) == ARGV[1] then " +\n                        "return redis.call(\\'del\\', KEYS[1]) else return 0 end";\n        Long result = redis.execute(\n            new DefaultRedisScript<>(script, Long.class),\n            List.of(LOCK_PREFIX + key),\n            owner);\n        return result != null && result > 0;\n    }\n\n    public <T> T executeWithLock(String key, Duration ttl, int maxRetries, Supplier<T> action) {\n        String owner = UUID.randomUUID().toString();\n        int retries = 0;\n        while (retries < maxRetries) {\n            if (acquireLock(key, owner, ttl)) {\n                try {\n                    return action.get();\n                } finally {\n                    releaseLock(key, owner);\n                }\n            }\n            retries++;\n            try { Thread.sleep(100 * retries); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }\n        }\n        throw new LockAcquisitionException("Не удалось получить блокировку для " + key);\n    }\n}\n\n// Аннотация\n@Target(ElementType.METHOD)\n@Retention(RetentionPolicy.RUNTIME)\npublic @interface DistributedLock {\n    String key();\n    long ttlSeconds() default 30;\n    int maxRetries() default 3;\n}\n\n@Aspect\n@Component\npublic class DistributedLockAspect {\n    @Autowired DistributedLockService lockService;\n\n    @Around("@annotation(lock)")\n    public Object around(ProceedingJoinPoint pjp, DistributedLock lock) throws Throwable {\n        return lockService.executeWithLock(\n            lock.key(), Duration.ofSeconds(lock.ttlSeconds()), lock.maxRetries(),\n            () -> {\n                try { return pjp.proceed(); }\n                catch (Throwable e) { throw new RuntimeException(e); }\n            }\n        );\n    }\n}\n\n// Использование\n@Service\npublic class OrderService {\n    @DistributedLock(key = "order-processing", ttlSeconds = 60)\n    public Order processOrder(Long orderId) {\n        // Безопасно: только один инстанс обрабатывает заказ\n        return doProcessOrder(orderId);\n    }\n}`,
      explanation: 'Распределённая блокировка нужна когда несколько инстансов могут обрабатывать один ресурс. SET NX (Not eXists) — атомарная операция. EX (Expire) — автоматическое освобождение по TTL (защита от deadlock). Lua-скрипт для release гарантирует что блокировку снимает только владелец. В production используйте Redisson — он реализует RedLock алгоритм.'
    },
    {
      id: 9,
      title: 'Задача: Pub/Sub с Redis',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Pub/Sub паттерн с Redis для обмена сообщениями между сервисами.',
      requirements: [
        'MessageListener для подписки на каналы',
        'RedisTemplate.convertAndSend() для публикации',
        'Канал "notifications": отправка уведомлений пользователям',
        'Канал "cache-invalidation": синхронизация кешей между инстансами',
        'Pattern-based подписка: subscribe "events.*"',
        'JSON сериализация сообщений'
      ],
      expectedOutput: 'Publisher (Instance-1):\nredis.convertAndSend("notifications", {userId:42, message:"Новый заказ"})\n\nSubscriber (Instance-2):\n[notifications] Received: {userId:42, message:"Новый заказ"}\n→ Sending push notification to user 42\n\nPattern subscribe:\n[events.order.created] Received: {orderId:1}\n[events.order.shipped] Received: {orderId:1}\n[events.payment.completed] Received: {paymentId:5}',
      hint: 'Используйте RedisMessageListenerContainer для подписки. MessageListenerAdapter оборачивает POJO в MessageListener.',
      solution: '@Configuration\npublic class RedisPubSubConfig {\n\n    @Bean\n    public RedisMessageListenerContainer container(RedisConnectionFactory factory,\n            MessageListenerAdapter notificationListener,\n            MessageListenerAdapter cacheListener) {\n        RedisMessageListenerContainer container = new RedisMessageListenerContainer();\n        container.setConnectionFactory(factory);\n        container.addMessageListener(notificationListener, new ChannelTopic("notifications"));\n        container.addMessageListener(cacheListener, new ChannelTopic("cache-invalidation"));\n        container.addMessageListener(notificationListener, new PatternTopic("events.*"));\n        return container;\n    }\n\n    @Bean\n    public MessageListenerAdapter notificationListener(NotificationSubscriber subscriber) {\n        return new MessageListenerAdapter(subscriber, "onMessage");\n    }\n\n    @Bean\n    public MessageListenerAdapter cacheListener(CacheInvalidationSubscriber subscriber) {\n        return new MessageListenerAdapter(subscriber, "onMessage");\n    }\n}\n\n@Component\n@Slf4j\npublic class NotificationSubscriber {\n    @Autowired ObjectMapper objectMapper;\n\n    public void onMessage(String message, String channel) {\n        try {\n            NotificationEvent event = objectMapper.readValue(message, NotificationEvent.class);\n            log.info("[{}] Received notification for user {}: {}",\n                channel, event.userId(), event.message());\n            // Отправить push/websocket\n        } catch (Exception e) {\n            log.error("Error processing notification", e);\n        }\n    }\n}\n\n@Component\n@Slf4j\npublic class CacheInvalidationSubscriber {\n    @Autowired CacheManager cacheManager;\n\n    public void onMessage(String message, String channel) {\n        CacheInvalidationEvent event = parseEvent(message);\n        Cache cache = cacheManager.getCache(event.cacheName());\n        if (cache != null) {\n            if (event.key() != null) {\n                cache.evict(event.key());\n                log.info("Evicted cache {}::{}", event.cacheName(), event.key());\n            } else {\n                cache.clear();\n                log.info("Cleared cache {}", event.cacheName());\n            }\n        }\n    }\n}\n\n// Publisher\n@Service\npublic class EventPublisher {\n    @Autowired StringRedisTemplate redis;\n    @Autowired ObjectMapper objectMapper;\n\n    public void publishNotification(Long userId, String message) {\n        NotificationEvent event = new NotificationEvent(userId, message, Instant.now());\n        redis.convertAndSend("notifications", toJson(event));\n    }\n\n    public void publishCacheInvalidation(String cacheName, String key) {\n        CacheInvalidationEvent event = new CacheInvalidationEvent(cacheName, key);\n        redis.convertAndSend("cache-invalidation", toJson(event));\n    }\n\n    private String toJson(Object obj) {\n        try { return objectMapper.writeValueAsString(obj); }\n        catch (Exception e) { throw new RuntimeException(e); }\n    }\n}',
      explanation: 'Redis Pub/Sub — лёгкий способ обмена сообщениями между сервисами. Subscriber получает сообщения в реальном времени. PatternTopic("events.*") подписывается на все каналы начинающиеся с "events.". Cache invalidation через Pub/Sub синхронизирует локальные кеши между инстансами. В отличие от Kafka, Redis Pub/Sub не хранит историю.'
    },
    {
      id: 10,
      title: 'Задача: Стратегия прогрева кеша',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте прогрев кеша при старте приложения для избежания "холодного старта".',
      requirements: [
        'Прогрев при старте: ApplicationReadyEvent или CommandLineRunner',
        'Прогрев популярных данных: топ-100 продуктов, все категории',
        'Асинхронный прогрев: не блокировать старт приложения',
        'Прогресс прогрева: логирование и health indicator',
        'Периодический прогрев: @Scheduled обновление горячих данных',
        'Graceful degradation: если Redis недоступен — работать без кеша'
      ],
      expectedOutput: 'Application starting...\n[CacheWarmer] Starting cache warm-up...\n[CacheWarmer] Loading top 100 products... done (150ms)\n[CacheWarmer] Loading all categories... done (50ms)\n[CacheWarmer] Loading price ranges... done (30ms)\n[CacheWarmer] Cache warm-up completed in 230ms. Loaded 115 entries.\n\nHealth: /actuator/health\n{"cache-warmer": {"status": "UP", "details": {"loaded": 115, "lastWarmUp": "2024-01-15T10:00:00"}}}\n\n[Scheduled] Refreshing hot cache at 2024-01-15T11:00:00...',
      hint: 'Используйте @EventListener(ApplicationReadyEvent.class) для прогрева после полного старта. @Async для неблокирующего прогрева. HealthIndicator для мониторинга.',
      solution: '@Component\n@Slf4j\npublic class CacheWarmer {\n    @Autowired ProductRepository productRepo;\n    @Autowired CategoryRepository categoryRepo;\n    @Autowired CacheManager cacheManager;\n\n    private final AtomicBoolean warmUpComplete = new AtomicBoolean(false);\n    private final AtomicInteger loadedEntries = new AtomicInteger(0);\n    private Instant lastWarmUp;\n\n    @Async\n    @EventListener(ApplicationReadyEvent.class)\n    public void warmUp() {\n        long start = System.currentTimeMillis();\n        log.info("Starting cache warm-up...");\n\n        try {\n            warmUpProducts();\n            warmUpCategories();\n            warmUpPriceRanges();\n\n            warmUpComplete.set(true);\n            lastWarmUp = Instant.now();\n            log.info("Cache warm-up completed in {}ms. Loaded {} entries.",\n                System.currentTimeMillis() - start, loadedEntries.get());\n        } catch (Exception e) {\n            log.warn("Cache warm-up failed, app will work without cache: {}", e.getMessage());\n        }\n    }\n\n    private void warmUpProducts() {\n        log.info("Loading top 100 products...");\n        List<Product> topProducts = productRepo.findTop100ByOrderByViewsDesc();\n        Cache productCache = cacheManager.getCache("products");\n        if (productCache != null) {\n            topProducts.forEach(p -> productCache.put(p.getId(), p));\n            loadedEntries.addAndGet(topProducts.size());\n        }\n    }\n\n    private void warmUpCategories() {\n        log.info("Loading all categories...");\n        List<Category> categories = categoryRepo.findAll();\n        Cache cache = cacheManager.getCache("categories");\n        if (cache != null) {\n            categories.forEach(c -> cache.put(c.getId(), c));\n            loadedEntries.addAndGet(categories.size());\n        }\n    }\n\n    private void warmUpPriceRanges() {\n        log.info("Loading price ranges...");\n        // Кешировать агрегатные данные\n        Cache cache = cacheManager.getCache("price-ranges");\n        if (cache != null) {\n            cache.put("all", productRepo.getPriceRanges());\n            loadedEntries.incrementAndGet();\n        }\n    }\n\n    // Периодическое обновление горячих данных\n    @Scheduled(fixedRate = 3600000) // каждый час\n    public void refreshHotCache() {\n        log.info("Refreshing hot cache...");\n        loadedEntries.set(0);\n        warmUpProducts();\n        lastWarmUp = Instant.now();\n    }\n\n    public boolean isReady() { return warmUpComplete.get(); }\n    public int getLoadedEntries() { return loadedEntries.get(); }\n    public Instant getLastWarmUp() { return lastWarmUp; }\n}\n\n// Health Indicator\n@Component\npublic class CacheWarmerHealthIndicator implements HealthIndicator {\n    @Autowired CacheWarmer warmer;\n\n    @Override\n    public Health health() {\n        if (!warmer.isReady()) {\n            return Health.status("WARMING_UP")\n                .withDetail("loaded", warmer.getLoadedEntries())\n                .build();\n        }\n        return Health.up()\n            .withDetail("loaded", warmer.getLoadedEntries())\n            .withDetail("lastWarmUp", warmer.getLastWarmUp())\n            .build();\n    }\n}\n\n// Graceful degradation\n@Service\n@Slf4j\npublic class ResilientCacheService {\n    @Autowired(required = false) CacheManager cacheManager;\n\n    public <T> T getFromCache(String cacheName, Object key, Supplier<T> fallback) {\n        try {\n            if (cacheManager != null) {\n                Cache cache = cacheManager.getCache(cacheName);\n                if (cache != null) {\n                    Cache.ValueWrapper wrapper = cache.get(key);\n                    if (wrapper != null) return (T) wrapper.get();\n                }\n            }\n        } catch (Exception e) {\n            log.warn("Cache {} unavailable, using fallback: {}", cacheName, e.getMessage());\n        }\n        return fallback.get();\n    }\n}',
      explanation: 'Прогрев кеша устраняет "холодный старт" — первые запросы после рестарта не будут медленными. @Async не блокирует старт приложения. @Scheduled периодически обновляет горячие данные. HealthIndicator показывает статус прогрева. Graceful degradation позволяет работать без Redis — просто обращаясь к БД.'
    }
  ]
}
