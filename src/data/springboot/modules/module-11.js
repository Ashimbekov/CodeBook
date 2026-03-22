export default {
  id: 11,
  title: 'JPA запросы',
  description: 'Написание запросов через @Query, JPQL, нативный SQL, Specification и проекции',
  lessons: [
    {
      id: 1,
      title: '@Query с JPQL',
      type: 'theory',
      content: [
        { type: 'text', value: 'JPQL (Java Persistence Query Language) — язык запросов JPA. Похож на SQL, но работает с Entity классами, а не с таблицами.' },
        { type: 'code', language: 'java', value: 'public interface UserRepository extends JpaRepository<User, Long> {\n\n    // JPQL: FROM User (класс), не users (таблица)\n    @Query("SELECT u FROM User u WHERE u.email = :email")\n    Optional<User> findByEmailJpql(@Param("email") String email);\n\n    // Именованные параметры\n    @Query("SELECT u FROM User u WHERE u.age >= :minAge AND u.active = true")\n    List<User> findActiveUsersOverAge(@Param("minAge") int minAge);\n\n    // Positional параметры (по номеру)\n    @Query("SELECT u FROM User u WHERE u.name = ?1 OR u.email = ?2")\n    List<User> findByNameOrEmail(String name, String email);\n\n    // JOIN FETCH — решение проблемы N+1\n    @Query("SELECT u FROM User u LEFT JOIN FETCH u.orders WHERE u.id = :id")\n    Optional<User> findByIdWithOrders(@Param("id") Long id);\n\n    // DISTINCT для избежания дублей при JOIN\n    @Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles")\n    List<User> findAllWithRoles();\n}' },
        { type: 'heading', value: 'JPQL vs SQL' },
        { type: 'list', items: [
          'JPQL: FROM User u (имя класса), SQL: FROM users (имя таблицы)',
          'JPQL: u.orders (поле Java), SQL: JOIN orders ON user_id',
          'JPQL: u.email (поле Java), SQL: email (колонка)',
          'JPQL не поддерживает некоторые SQL функции — тогда используй native query'
        ]},
        { type: 'note', value: '@Param("name") — обязателен для именованных параметров (:name) в @Query. Для числовых (?1) — не нужен, параметры маппятся по позиции.' }
      ]
    },
    {
      id: 2,
      title: 'Native SQL запросы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда JPQL недостаточно (специфичные SQL функции, оконные функции, сложные подзапросы) — используй нативный SQL с nativeQuery = true.' },
        { type: 'code', language: 'java', value: 'public interface ProductRepository extends JpaRepository<Product, Long> {\n\n    // nativeQuery = true — настоящий SQL\n    @Query(value = "SELECT * FROM products WHERE category = :category\n                    ORDER BY price ASC LIMIT :limit",\n           nativeQuery = true)\n    List<Product> findCheapestByCategory(\n        @Param("category") String category,\n        @Param("limit") int limit\n    );\n\n    // Нативный запрос с пагинацией\n    @Query(\n        value = "SELECT * FROM products WHERE price > :minPrice",\n        countQuery = "SELECT COUNT(*) FROM products WHERE price > :minPrice",\n        nativeQuery = true\n    )\n    Page<Product> findExpensiveProducts(\n        @Param("minPrice") double minPrice,\n        Pageable pageable\n    );\n\n    // Агрегация\n    @Query(value = "SELECT category, AVG(price) as avg_price,\n                           COUNT(*) as count\n                    FROM products\n                    GROUP BY category",\n           nativeQuery = true)\n    List<Object[]> getStatsByCategory();\n}' },
        { type: 'warning', value: 'Нативные запросы привязаны к конкретной СУБД. Запрос для PostgreSQL может не работать в MySQL. Используй нативные запросы только когда JPQL не справляется.' }
      ]
    },
    {
      id: 3,
      title: 'Modifying запросы: UPDATE и DELETE',
      type: 'theory',
      content: [
        { type: 'text', value: '@Modifying используется для запросов которые изменяют данные (UPDATE, DELETE). Без него Spring бросит исключение.' },
        { type: 'code', language: 'java', value: 'public interface UserRepository extends JpaRepository<User, Long> {\n\n    // UPDATE запрос\n    @Modifying\n    @Transactional\n    @Query("UPDATE User u SET u.active = :active WHERE u.id = :id")\n    int updateActiveStatus(@Param("id") Long id, @Param("active") boolean active);\n    // Возвращает количество изменённых записей\n\n    // DELETE запрос\n    @Modifying\n    @Transactional\n    @Query("DELETE FROM User u WHERE u.active = false AND u.createdAt < :date")\n    int deleteInactiveUsersBefore(@Param("date") LocalDateTime date);\n\n    // Нативный UPDATE\n    @Modifying\n    @Transactional\n    @Query(value = "UPDATE users SET last_login = NOW() WHERE id = :id",\n           nativeQuery = true)\n    void updateLastLogin(@Param("id") Long id);\n}' },
        { type: 'note', value: '@Modifying + @Transactional — обязательная пара. @Transactional можно поставить на метод сервиса который вызывает repository метод. @Modifying без @Transactional вызовет ошибку.' }
      ]
    },
    {
      id: 4,
      title: 'Проекции: получаем только нужные поля',
      type: 'theory',
      content: [
        { type: 'text', value: 'Проекции позволяют загружать не весь Entity, а только нужные поля. Это уменьшает нагрузку на БД и сеть.' },
        { type: 'code', language: 'java', value: '// Interface-based проекция\npublic interface UserSummary {\n    Long getId();\n    String getName();\n    String getEmail();\n    // Только 3 поля вместо всего User\n}\n\npublic interface UserRepository extends JpaRepository<User, Long> {\n    // Spring автоматически маппит поля интерфейса\n    List<UserSummary> findAllProjectedBy();\n\n    Optional<UserSummary> findById(Long id, Class<UserSummary> type);\n}\n\n// Использование:\nList<UserSummary> users = userRepository.findAllProjectedBy();\n// SQL: SELECT id, name, email FROM users (не SELECT *)' },
        { type: 'code', language: 'java', value: '// DTO проекция через конструктор в JPQL\npublic class UserDto {\n    private final Long id;\n    private final String name;\n\n    public UserDto(Long id, String name) {\n        this.id = id;\n        this.name = name;\n    }\n    // геттеры\n}\n\n@Query("SELECT new com.example.dto.UserDto(u.id, u.name) FROM User u")\nList<UserDto> findAllAsDto();\n// Создаёт UserDto объекты напрямую из JPQL' },
        { type: 'tip', value: 'Проекции особенно полезны в API где нужно вернуть только часть данных Entity. Они уменьшают количество передаваемых данных и избавляют от необходимости вручную маппить Entity в DTO.' }
      ]
    },
    {
      id: 5,
      title: 'Specification: динамические запросы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Specification позволяет строить сложные динамические запросы программно. Полезен когда набор условий фильтрации зависит от входящих параметров.' },
        { type: 'code', language: 'java', value: '// Репозиторий должен расширить JpaSpecificationExecutor\npublic interface ProductRepository\n    extends JpaRepository<Product, Long>,\n            JpaSpecificationExecutor<Product> {}\n\n// Класс со спецификациями\npublic class ProductSpecifications {\n\n    public static Specification<Product> hasCategory(String category) {\n        return (root, query, cb) -> {\n            if (category == null) return null;  // нет условия\n            return cb.equal(root.get("category"), category);\n        };\n    }\n\n    public static Specification<Product> priceBetween(Double min, Double max) {\n        return (root, query, cb) -> {\n            if (min == null && max == null) return null;\n            if (min == null) return cb.lessThanOrEqualTo(root.get("price"), max);\n            if (max == null) return cb.greaterThanOrEqualTo(root.get("price"), min);\n            return cb.between(root.get("price"), min, max);\n        };\n    }\n}\n\n// Использование в сервисе\npublic List<Product> search(String category, Double minPrice, Double maxPrice) {\n    Specification<Product> spec = Specification\n        .where(ProductSpecifications.hasCategory(category))\n        .and(ProductSpecifications.priceBetween(minPrice, maxPrice));\n    return productRepository.findAll(spec);\n}' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Поиск с фильтрами через @Query',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай систему поиска продуктов с несколькими фильтрами используя @Query.',
      requirements: [
        'Product: id, name, category, price, inStock',
        '@Query для поиска по категории с ценой в диапазоне',
        '@Query для поиска по подстроке в названии (LIKE)',
        'Нативный запрос для статистики: топ-3 категории по количеству',
        'GET /products/search?category=X&minPrice=0&maxPrice=5000'
      ],
      expectedOutput: 'GET /products/search?category=electronics&minPrice=1000&maxPrice=50000 => список продуктов\nGET /products/stats/top-categories => [{"category":"electronics","count":15}]',
      hint: '@Query("SELECT p FROM Product p WHERE (:category IS NULL OR p.category = :category) AND p.price BETWEEN :min AND :max"). Для статистики — nativeQuery = true.',
      solution: '// ProductRepository.java\npublic interface ProductRepository extends JpaRepository<Product, Long> {\n\n    @Query("SELECT p FROM Product p WHERE " +\n           "(:category IS NULL OR p.category = :category) AND " +\n           "p.price BETWEEN :minPrice AND :maxPrice AND " +\n           "(:inStock IS NULL OR p.inStock = :inStock)")\n    List<Product> searchProducts(\n        @Param("category") String category,\n        @Param("minPrice") double minPrice,\n        @Param("maxPrice") double maxPrice,\n        @Param("inStock") Boolean inStock\n    );\n\n    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT(\'%\', :keyword, \'%\'))")\n    List<Product> searchByKeyword(@Param("keyword") String keyword);\n\n    @Query(value = "SELECT category, COUNT(*) as cnt FROM products " +\n                   "GROUP BY category ORDER BY cnt DESC LIMIT 3",\n           nativeQuery = true)\n    List<Object[]> getTopCategories();\n}\n\n// ProductController.java\n@RestController\n@RequestMapping("/products")\npublic class ProductController {\n    private final ProductRepository productRepository;\n\n    @GetMapping("/search")\n    public List<Product> search(\n            @RequestParam(required = false) String category,\n            @RequestParam(defaultValue = "0") double minPrice,\n            @RequestParam(defaultValue = "999999") double maxPrice,\n            @RequestParam(required = false) Boolean inStock) {\n        return productRepository.searchProducts(category, minPrice, maxPrice, inStock);\n    }\n\n    @GetMapping("/stats/top-categories")\n    public List<Map<String, Object>> getTopCategories() {\n        return productRepository.getTopCategories().stream()\n            .map(row -> Map.of(\n                "category", row[0],\n                "count", row[1]\n            ))\n            .collect(Collectors.toList());\n    }\n}',
      explanation: 'В JPQL можно сделать параметр опциональным через (:param IS NULL OR условие). Это позволяет одному запросу работать с разными комбинациями фильтров. LOWER + LIKE для поиска без учёта регистра. Нативный запрос возвращает Object[] — каждый элемент это строка, каждый row[i] это значение колонки.'
    },
    {
      id: 7,
      title: 'Практика: Статистические запросы',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй набор аналитических запросов для интернет-магазина.',
      requirements: [
        'Общая сумма заказов пользователя: SUM через @Query',
        'Средняя стоимость заказа по месяцам: GROUP BY в нативном запросе',
        'Список пользователей без заказов: LEFT JOIN + WHERE IS NULL',
        'Топ-5 самых дорогих продуктов через проекцию (id, name, price)'
      ],
      expectedOutput: 'GET /stats/user/1/total => {"userId":1,"totalSpent":15000.0}\nGET /products/top5 => [{"id":3,"name":"iPhone","price":90000}...]',
      hint: '@Query("SELECT SUM(o.total) FROM Order o WHERE o.user.id = :userId"). LEFT JOIN + IS NULL для пользователей без заказов. Проекция интерфейс ProductSummary с getId, getName, getPrice.',
      solution: '// OrderRepository.java\npublic interface OrderRepository extends JpaRepository<Order, Long> {\n\n    @Query("SELECT SUM(o.total) FROM Order o WHERE o.user.id = :userId")\n    Double getTotalByUserId(@Param("userId") Long userId);\n\n    @Query(value = "SELECT DATE_TRUNC(\'month\', created_at) as month,\n                          AVG(total) as avg_total,\n                          COUNT(*) as order_count\n                   FROM orders\n                   GROUP BY month\n                   ORDER BY month DESC",\n           nativeQuery = true)\n    List<Object[]> getMonthlyStats();\n\n    @Query("SELECT u FROM User u WHERE u.id NOT IN " +\n           "(SELECT DISTINCT o.user.id FROM Order o)")\n    List<User> findUsersWithoutOrders();\n}\n\n// ProductRepository.java — топ 5\npublic interface ProductSummary {\n    Long getId();\n    String getName();\n    Double getPrice();\n}\n\n// в ProductRepository:\n@Query("SELECT p FROM Product p ORDER BY p.price DESC")\nList<ProductSummary> findTop5ByOrderByPriceDesc(Pageable pageable);\n\n// использование:\nList<ProductSummary> top5 = productRepository\n    .findTop5ByOrderByPriceDesc(PageRequest.of(0, 5));\n\n// StatsController.java\n@GetMapping("/stats/user/{id}/total")\npublic Map<String, Object> getUserTotal(@PathVariable Long id) {\n    Double total = orderRepository.getTotalByUserId(id);\n    return Map.of("userId", id, "totalSpent", total != null ? total : 0.0);\n}',
      explanation: 'SUM, AVG, COUNT — агрегатные функции работают как в SQL. DATE_TRUNC — PostgreSQL функция, поэтому нативный запрос. Подзапрос (NOT IN SELECT) для поиска пользователей без заказов. Проекционный интерфейс позволяет получить только нужные поля без создания полного DTO класса.'
    }
  ]
}
