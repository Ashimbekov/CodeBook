export default {
  id: 21,
  title: 'Кеширование с @Cacheable',
  description: 'Реализация кеширования в Spring Boot с использованием @Cacheable, @CacheEvict, @CachePut и интеграция с Redis для распределённого кеша',
  lessons: [
    {
      id: 1,
      title: 'Введение в кеширование Spring',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кеширование сохраняет результат дорогостоящей операции (запрос к БД, внешнее API) и возвращает его при повторных вызовах без повторного выполнения. Spring Cache — абстракция над конкретными реализациями (EhCache, Redis, Caffeine).' },
        { type: 'tip', value: 'Представь кеш как блокнот с ответами на экзамене. Первый раз ищешь в учебнике — долго. Записываешь ответ в блокнот. Второй раз читаешь из блокнота — мгновенно.' },
        { type: 'heading', value: 'Включение кеширования' },
        { type: 'code', language: 'java', value: '@SpringBootApplication\n@EnableCaching  // обязательно!\npublic class Application {\n    public static void main(String[] args) {\n        SpringApplication.run(Application.class, args);\n    }\n}' },
        { type: 'heading', value: 'Зависимость для Caffeine (in-memory)' },
        { type: 'code', language: 'xml', value: '<dependency>\n    <groupId>com.github.ben-manes.caffeine</groupId>\n    <artifactId>caffeine</artifactId>\n</dependency>' }
      ]
    },
    {
      id: 2,
      title: '@Cacheable, @CacheEvict, @CachePut',
      type: 'theory',
      content: [
        { type: 'text', value: 'Три основные аннотации: @Cacheable — читает из кеша (или кеширует результат), @CacheEvict — удаляет из кеша, @CachePut — всегда выполняет и обновляет кеш.' },
        { type: 'heading', value: 'Основные аннотации' },
        { type: 'code', language: 'java', value: '@Service\npublic class ProductService {\n\n    // Кешировать результат. Ключ — id продукта\n    @Cacheable(value = "products", key = "#id")\n    public Product findById(Long id) {\n        // Выполняется только при cache miss\n        return repository.findById(id)\n            .orElseThrow(() -> new ProductNotFoundException(id));\n    }\n\n    // Кешировать список всех продуктов\n    @Cacheable(value = "products-list")\n    public List<Product> findAll() {\n        return repository.findAll();\n    }\n\n    // Обновить продукт и обновить кеш\n    @CachePut(value = "products", key = "#result.id")\n    public Product update(Long id, ProductRequest request) {\n        Product product = findById(id);\n        product.setName(request.getName());\n        return repository.save(product);\n    }\n\n    // Удалить из кеша при удалении продукта\n    @CacheEvict(value = {"products", "products-list"}, key = "#id")\n    public void delete(Long id) {\n        repository.deleteById(id);\n    }\n\n    // Очистить весь кеш\n    @CacheEvict(value = "products-list", allEntries = true)\n    public void clearCache() { }\n}' },
        { type: 'warning', value: '@Cacheable работает только при вызове через Spring proxy. Если метод вызывает другой метод в том же классе — кеш не сработает!' }
      ]
    },
    {
      id: 3,
      title: 'Redis как кеш',
      type: 'theory',
      content: [
        { type: 'text', value: 'Redis — популярный выбор для распределённого кеша в продакшене. Spring Boot автоматически использует Redis, если добавить зависимость spring-boot-starter-data-redis.' },
        { type: 'heading', value: 'Подключение Redis Cache' },
        { type: 'code', language: 'xml', value: '<dependency>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-data-redis</artifactId>\n</dependency>' },
        { type: 'code', language: 'java', value: '# application.properties\nspring.data.redis.host=localhost\nspring.data.redis.port=6379\n\n# TTL по умолчанию 10 минут\nspring.cache.redis.time-to-live=600000' },
        { type: 'heading', value: 'Настройка RedisCacheManager' },
        { type: 'code', language: 'java', value: '@Configuration\npublic class CacheConfig {\n\n    @Bean\n    public RedisCacheManager cacheManager(RedisConnectionFactory factory) {\n        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration\n            .defaultCacheConfig()\n            .entryTtl(Duration.ofMinutes(10))\n            .serializeValuesWith(\n                RedisSerializationContext.SerializationPair\n                    .fromSerializer(new GenericJackson2JsonRedisSerializer())\n            );\n\n        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();\n        // Продукты кешировать на 30 минут\n        cacheConfigs.put("products", defaultConfig.entryTtl(Duration.ofMinutes(30)));\n        // Список кешировать на 5 минут\n        cacheConfigs.put("products-list", defaultConfig.entryTtl(Duration.ofMinutes(5)));\n\n        return RedisCacheManager.builder(factory)\n            .cacheDefaults(defaultConfig)\n            .withInitialCacheConfigurations(cacheConfigs)\n            .build();\n    }\n}' },
        { type: 'tip', value: 'Используй GenericJackson2JsonRedisSerializer для хранения объектов в JSON. Так данные в Redis будут читаемы, а не в бинарном формате.' }
      ]
    },
    {
      id: 4,
      title: 'Условное кеширование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда нужно кешировать только при определённых условиях: только успешные результаты, только при больших объёмах данных. Параметры condition и unless позволяют это контролировать.' },
        { type: 'heading', value: 'Параметры condition и unless' },
        { type: 'code', language: 'java', value: '// condition — выполняется ДО метода, если false — кеш не используется\n@Cacheable(value = "products", key = "#id", condition = "#id > 0")\npublic Product findById(Long id) { ... }\n\n// unless — выполняется ПОСЛЕ, если true — результат не кешируется\n@Cacheable(value = "products", key = "#id", unless = "#result == null")\npublic Product findByIdOrNull(Long id) { ... }\n\n// Кешировать только списки больше 5 элементов\n@Cacheable(value = "products-list", unless = "#result.size() < 5")\npublic List<Product> findAll() { ... }\n\n// SpEL выражения в ключах\n@Cacheable(value = "user-products", key = "#user.id + '-' + #category")\npublic List<Product> findByUserAndCategory(User user, String category) { ... }' },
        { type: 'heading', value: 'Кеширование с несколькими кешами' },
        { type: 'code', language: 'java', value: '// Искать в нескольких кешах последовательно\n@Cacheable(value = {"products-hot", "products"}, key = "#id")\npublic Product findById(Long id) { ... }' }
      ]
    },
    {
      id: 5,
      title: '@CacheConfig и лучшие практики',
      type: 'theory',
      content: [
        { type: 'text', value: '@CacheConfig на уровне класса задаёт общие настройки для всех методов класса. Это уменьшает дублирование аннотаций.' },
        { type: 'heading', value: '@CacheConfig на классе' },
        { type: 'code', language: 'java', value: '@Service\n@CacheConfig(cacheNames = "products")  // все методы используют кеш "products"\npublic class ProductService {\n\n    @Cacheable(key = "#id")  // не нужно повторять value = "products"\n    public Product findById(Long id) { ... }\n\n    @CachePut(key = "#result.id")\n    public Product update(Long id, ProductRequest req) { ... }\n\n    @CacheEvict(key = "#id")\n    public void delete(Long id) { ... }\n}' },
        { type: 'heading', value: 'Cacheable на методах Repository' },
        { type: 'code', language: 'java', value: '// Кешировать можно не только в сервисах\npublic interface UserRepository extends JpaRepository<User, Long> {\n\n    @Cacheable(value = "users-by-email")\n    Optional<User> findByEmail(String email);\n\n    @CacheEvict(value = "users-by-email", key = "#result.email")\n    <S extends User> S save(S entity);\n}' },
        { type: 'warning', value: 'Не кешируй данные, которые часто меняются! Кеш подходит для: конфигурации, справочников, редко меняющихся сущностей. Для часто обновляемых данных — инвалидируй кеш при каждом изменении.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: кеш для CategoryService',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте кеширование в CategoryService: кешируйте список категорий и отдельные категории, инвалидируйте кеш при изменениях. Используйте Redis.',
      requirements: [
        'Подключи spring-boot-starter-data-redis',
        'Включи @EnableCaching в ApplicationConfig',
        'Аннотируй findAll() через @Cacheable(value = "categories")',
        'Аннотируй findById() через @Cacheable(value = "categories", key = "#id")',
        'Аннотируй save() через @CachePut(value = "categories", key = "#result.id")',
        'При save() также очищай кеш списка через @CacheEvict(value = "categories-list", allEntries = true)',
        'Настрой TTL 15 минут для categories через RedisCacheManager'
      ],
      hint: 'Для инвалидации нескольких кешей одним методом используй @Caching с несколькими @CacheEvict.',
      expectedOutput: 'Приложение запускается с Redis кешом. Первый вызов findAll() — запрос к БД:\nSELECT * FROM categories  -- выполнен запрос\nВозвращено 5 категорий.\n\nВторой вызов findAll() — данные из Redis (запрос к БД не выполняется):\nCache hit: categories-list\nВозвращено 5 категорий.\n\nПосле вызова save() кеш инвалидируется:\nCacheEvict: categories-list (allEntries=true)\nCachePut: categories[id=6]\n\nТретий вызов findAll() — снова запрос к БД (кеш сброшен):\nSELECT * FROM categories  -- выполнен новый запрос\nВозвращено 6 категорий.\n\nRedis: TTL для ключа "categories" установлен 900 секунд (15 минут).',
      solution: '@Service\npublic class CategoryService {\n\n    @Cacheable("categories-list")\n    public List<Category> findAll() { return repository.findAll(); }\n\n    @Cacheable(value = "categories", key = "#id")\n    public Category findById(Long id) {\n        return repository.findById(id).orElseThrow();\n    }\n\n    @Caching(\n        put = @CachePut(value = "categories", key = "#result.id"),\n        evict = @CacheEvict(value = "categories-list", allEntries = true)\n    )\n    public Category save(Category category) { return repository.save(category); }\n\n    @Caching(evict = {\n        @CacheEvict(value = "categories", key = "#id"),\n        @CacheEvict(value = "categories-list", allEntries = true)\n    })\n    public void delete(Long id) { repository.deleteById(id); }\n}',
      explanation: '@Caching позволяет комбинировать несколько операций с кешем на одном методе. При создании/обновлении категории нужно обновить кеш конкретной категории (CachePut) и инвалидировать список (CacheEvict allEntries).'
    }
  ]
}
