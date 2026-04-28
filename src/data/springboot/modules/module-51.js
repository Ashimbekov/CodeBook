export default {
  id: 51,
  title: 'Практикум: JPA продвинутый',
  description: 'Продвинутые техники Spring Data JPA: кастомные запросы, Specifications, проекции, аудит, батч-вставки, оптимистическая блокировка и soft delete.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Custom @Query с JPQL',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте репозиторий Product с кастомными JPQL-запросами для поиска, агрегации и обновления данных.',
      requirements: [
        'Entity Product: id, name, category, price, stock, active (boolean), createdAt',
        'JPQL-запрос: найти все продукты по категории с ценой выше указанной',
        'JPQL-запрос: получить среднюю цену продуктов по категории',
        'JPQL-запрос: @Modifying UPDATE — обновить stock у продукта',
        'JPQL-запрос: найти топ-5 самых дорогих продуктов',
        'JPQL-запрос: посчитать количество активных продуктов по категориям'
      ],
      expectedOutput: 'findByCategoryAndPriceGreaterThan("Electronics", 100.0):\n[{id:1, name:"Laptop", price:999.99}, {id:2, name:"Phone", price:599.99}]\n\ngetAveragePriceByCategory("Electronics") → 799.99\n\nupdateStock(1, 50) → UPDATE products SET stock=50 WHERE id=1\n\nfindTop5Expensive():\n[{name:"Laptop",price:999.99}, {name:"Phone",price:599.99}, ...]\n\ncountActiveByCategory():\n[["Electronics", 5], ["Books", 12], ["Clothing", 8]]',
      hint: 'Для @Modifying запросов добавьте @Transactional и clearAutomatically=true. Для агрегации используйте SELECT AVG(p.price) FROM Product p WHERE p.category = :cat.',
      solution: '@Entity\npublic class Product {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    private String name;\n    private String category;\n    private BigDecimal price;\n    private Integer stock;\n    private boolean active = true;\n    @CreationTimestamp\n    private LocalDateTime createdAt;\n}\n\npublic interface ProductRepository extends JpaRepository<Product, Long> {\n\n    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.price > :minPrice")\n    List<Product> findByCategoryAndPriceGreaterThan(@Param("category") String category,\n                                                    @Param("minPrice") BigDecimal minPrice);\n\n    @Query("SELECT AVG(p.price) FROM Product p WHERE p.category = :category")\n    BigDecimal getAveragePriceByCategory(@Param("category") String category);\n\n    @Modifying(clearAutomatically = true)\n    @Transactional\n    @Query("UPDATE Product p SET p.stock = :stock WHERE p.id = :id")\n    int updateStock(@Param("id") Long id, @Param("stock") Integer stock);\n\n    @Query("SELECT p FROM Product p ORDER BY p.price DESC")\n    List<Product> findTop5Expensive(Pageable pageable);\n\n    @Query("SELECT p.category, COUNT(p) FROM Product p WHERE p.active = true GROUP BY p.category")\n    List<Object[]> countActiveByCategory();\n}',
      explanation: '@Query позволяет писать JPQL-запросы вместо derived query methods. @Modifying нужен для UPDATE/DELETE запросов. clearAutomatically=true очищает persistence context после модификации, чтобы повторный SELECT возвращал актуальные данные.'
    },
    {
      id: 2,
      title: 'Задача: Native SQL запросы',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте репозиторий с native SQL-запросами для случаев, когда JPQL недостаточно.',
      requirements: [
        'Native-запрос: полнотекстовый поиск по name и description с PostgreSQL tsvector',
        'Native-запрос: получить продукты с рангом релевантности',
        'Native-запрос: вставка нескольких записей одним INSERT',
        'Native-запрос: оконная функция — ранг продукта по цене в категории',
        'Native-запрос: рекурсивный CTE для дерева категорий',
        'Маппинг результата native-запроса на DTO через @SqlResultSetMapping'
      ],
      expectedOutput: 'fullTextSearch("spring boot"):\n[{id:1, name:"Spring Boot Guide", rank:0.85}, {id:3, name:"Spring Framework", rank:0.62}]\n\ngetProductRankInCategory(1):\n{id:1, name:"Laptop", category:"Electronics", price:999.99, rankInCategory:1}\n\ngetCategoryTree(parentId=null):\n[{id:1,name:"Electronics",level:0,children:[{id:2,name:"Phones",level:1}]}]',
      hint: 'Для native-запросов используйте nativeQuery=true. Для маппинга на DTO используйте interface-based projection или @SqlResultSetMapping.',
      solution: `public interface ProductRepository extends JpaRepository<Product, Long> {\n\n    @Query(value = "SELECT p.*, ts_rank(to_tsvector(\\'russian\\', p.name || \\' \\' || p.description), " +\n           "plainto_tsquery(\\'russian\\', :query)) AS rank " +\n           "FROM products p " +\n           "WHERE to_tsvector(\\'russian\\', p.name || \\' \\' || p.description) @@ plainto_tsquery(\\'russian\\', :query) " +\n           "ORDER BY rank DESC", nativeQuery = true)\n    List<Object[]> fullTextSearch(@Param("query") String query);\n\n    @Query(value = "SELECT p.id, p.name, p.category, p.price, " +\n           "RANK() OVER (PARTITION BY p.category ORDER BY p.price DESC) as rank_in_category " +\n           "FROM products p WHERE p.id = :id", nativeQuery = true)\n    Object[] getProductRankInCategory(@Param("id") Long id);\n\n    @Modifying\n    @Transactional\n    @Query(value = "INSERT INTO products (name, category, price, stock, active) VALUES " +\n           "(:name, :category, :price, :stock, true)", nativeQuery = true)\n    void insertProduct(@Param("name") String name, @Param("category") String category,\n                       @Param("price") BigDecimal price, @Param("stock") Integer stock);\n\n    @Query(value = "WITH RECURSIVE category_tree AS (" +\n           "  SELECT id, name, parent_id, 0 as level FROM categories WHERE parent_id IS NULL " +\n           "  UNION ALL " +\n           "  SELECT c.id, c.name, c.parent_id, ct.level + 1 " +\n           "  FROM categories c JOIN category_tree ct ON c.parent_id = ct.id" +\n           ") SELECT * FROM category_tree ORDER BY level, name", nativeQuery = true)\n    List<Object[]> getCategoryTree();\n}`,
      explanation: 'Native SQL запросы дают доступ к специфичным возможностям СУБД: полнотекстовый поиск PostgreSQL, оконные функции (RANK, ROW_NUMBER), рекурсивные CTE. Используйте их когда JPQL не может выразить нужный запрос.'
    },
    {
      id: 3,
      title: 'Задача: Specifications для динамических запросов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте динамическую фильтрацию продуктов с помощью JPA Specifications.',
      requirements: [
        'ProductRepository extends JpaSpecificationExecutor<Product>',
        'Specification: фильтр по категории',
        'Specification: фильтр по диапазону цен (minPrice, maxPrice)',
        'Specification: фильтр по наличию на складе (stock > 0)',
        'Specification: поиск по имени (LIKE)',
        'ProductService: метод search с комбинацией спецификаций',
        'ProductFilterRequest DTO с необязательными полями: category, minPrice, maxPrice, inStock, search'
      ],
      expectedOutput: `GET /api/products?category=Electronics&minPrice=100&maxPrice=1000&inStock=true&search=lap\n\nSpecifications combined:\nWHERE category = \\'Electronics\\'\n  AND price >= 100 AND price <= 1000\n  AND stock > 0\n  AND LOWER(name) LIKE \\'%lap%\\'\n\nResult: [{id:1, name:"Laptop", category:"Electronics", price:999.99, stock:10}]`,
      hint: 'Используйте Specification.where(spec1).and(spec2).and(spec3) для комбинации. Каждая спецификация проверяет null-параметр и возвращает null если фильтр не нужен.',
      solution: 'public class ProductSpecifications {\n\n    public static Specification<Product> hasCategory(String category) {\n        return (root, query, cb) ->\n            category == null ? null : cb.equal(root.get("category"), category);\n    }\n\n    public static Specification<Product> priceBetween(BigDecimal min, BigDecimal max) {\n        return (root, query, cb) -> {\n            if (min == null && max == null) return null;\n            if (min != null && max != null)\n                return cb.between(root.get("price"), min, max);\n            if (min != null)\n                return cb.greaterThanOrEqualTo(root.get("price"), min);\n            return cb.lessThanOrEqualTo(root.get("price"), max);\n        };\n    }\n\n    public static Specification<Product> inStock() {\n        return (root, query, cb) -> cb.greaterThan(root.get("stock"), 0);\n    }\n\n    public static Specification<Product> nameLike(String search) {\n        return (root, query, cb) ->\n            search == null ? null : cb.like(cb.lower(root.get("name")),\n                "%" + search.toLowerCase() + "%");\n    }\n}\n\n@Service\npublic class ProductService {\n    @Autowired ProductRepository repo;\n\n    public Page<Product> search(ProductFilterRequest filter, Pageable pageable) {\n        Specification<Product> spec = Specification\n            .where(ProductSpecifications.hasCategory(filter.getCategory()))\n            .and(ProductSpecifications.priceBetween(filter.getMinPrice(), filter.getMaxPrice()))\n            .and(filter.getInStock() != null && filter.getInStock() ?\n                 ProductSpecifications.inStock() : null)\n            .and(ProductSpecifications.nameLike(filter.getSearch()));\n\n        return repo.findAll(spec, pageable);\n    }\n}',
      explanation: 'JPA Specifications реализуют паттерн Specification из DDD. Каждая спецификация — это отдельный предикат, который можно комбинировать через and/or. Возврат null из спецификации означает "без фильтра". Это позволяет строить динамические запросы без конкатенации строк.'
    },
    {
      id: 4,
      title: 'Задача: Projections — интерфейсные и классовые',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте проекции JPA для оптимизации запросов — загружайте только нужные поля.',
      requirements: [
        'Interface-based projection: ProductSummary (id, name, price)',
        'Interface-based projection: ProductWithCategory (name, category, price) с вычисляемым полем priceWithTax',
        'Class-based projection (DTO): ProductStats (category, count, avgPrice, maxPrice)',
        'Dynamic projection: метод репозитория с <T> T findById(Long id, Class<T> type)',
        'Closed projection для списка: List<ProductSummary> findByCategory(String category)',
        'Проекция с вложенными данными: ProductDetail с информацией о категории'
      ],
      expectedOutput: 'findAllSummaries():\n[{id:1, name:"Laptop", price:999.99}, {id:2, name:"Phone", price:599.99}]\nSQL: SELECT p.id, p.name, p.price FROM products p\n\nfindProductStats():\n[{category:"Electronics", count:5, avgPrice:650.00, maxPrice:999.99}]\n\nfindById(1, ProductSummary.class) → {id:1, name:"Laptop", price:999.99}\nfindById(1, ProductDetail.class) → {id:1, name:"Laptop", price:999.99, category:{...}}',
      hint: 'Interface-based projection работает автоматически — Spring Data генерирует proxy. Для вычисляемых полей используйте @Value("#{target.price * 1.12}") в интерфейсе.',
      solution: `// Interface-based projection\npublic interface ProductSummary {\n    Long getId();\n    String getName();\n    BigDecimal getPrice();\n}\n\npublic interface ProductWithCategory {\n    String getName();\n    String getCategory();\n    BigDecimal getPrice();\n\n    @Value("#{target.price.multiply(new java.math.BigDecimal(\\'1.12\\'))}")\n    BigDecimal getPriceWithTax();\n}\n\n// Class-based projection\npublic record ProductStats(\n    String category,\n    Long count,\n    Double avgPrice,\n    BigDecimal maxPrice\n) {}\n\n// Repository\npublic interface ProductRepository extends JpaRepository<Product, Long> {\n\n    List<ProductSummary> findAllProjectedBy();\n\n    List<ProductSummary> findByCategory(String category);\n\n    <T> T findById(Long id, Class<T> type);\n\n    @Query("SELECT new com.example.dto.ProductStats(p.category, COUNT(p), AVG(p.price), MAX(p.price)) " +\n           "FROM Product p GROUP BY p.category")\n    List<ProductStats> findProductStats();\n\n    List<ProductWithCategory> findTop10ByOrderByPriceDesc();\n}`,
      explanation: 'Проекции позволяют загружать из БД только нужные столбцы. Interface-based проекции создают прокси автоматически. Class-based (DTO) проекции требуют конструктор, совпадающий с SELECT. @Value позволяет вычислять поля на лету через SpEL.'
    },
    {
      id: 5,
      title: 'Задача: Entity Graph для оптимизации загрузки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Решите проблему N+1 запросов с помощью @EntityGraph и @NamedEntityGraph.',
      requirements: [
        'Entity Order с @ManyToOne Customer и @OneToMany OrderItems (LAZY)',
        'Entity OrderItem с @ManyToOne Product (LAZY)',
        '@NamedEntityGraph на Order: загрузка с Customer',
        '@NamedEntityGraph на Order: загрузка с Customer + OrderItems + Products',
        'Repository метод с @EntityGraph для загрузки заказов с items',
        'Сравнение: без EntityGraph (N+1) vs с EntityGraph (1 запрос)'
      ],
      expectedOutput: 'Без EntityGraph (N+1 проблема):\nSELECT * FROM orders                        -- 1 запрос\nSELECT * FROM customers WHERE id=1           -- N запросов\nSELECT * FROM order_items WHERE order_id=1   -- N запросов\nИтого: 1 + N + N запросов\n\nС EntityGraph (1 запрос):\nSELECT o.*, c.*, oi.*, p.*\nFROM orders o\nLEFT JOIN customers c ON o.customer_id = c.id\nLEFT JOIN order_items oi ON oi.order_id = o.id\nLEFT JOIN products p ON oi.product_id = p.id\nИтого: 1 запрос',
      hint: 'Используйте @NamedEntityGraph с subgraphs для вложенных связей. В репозитории примените @EntityGraph(value = "Order.withItemsAndProducts").',
      solution: '@Entity\n@NamedEntityGraph(name = "Order.withCustomer",\n    attributeNodes = @NamedAttributeNode("customer"))\n@NamedEntityGraph(name = "Order.withItemsAndProducts",\n    attributeNodes = {\n        @NamedAttributeNode("customer"),\n        @NamedAttributeNode(value = "items", subgraph = "items-product")\n    },\n    subgraphs = @NamedSubgraph(name = "items-product",\n        attributeNodes = @NamedAttributeNode("product")))\npublic class Order {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    private LocalDateTime orderDate;\n    private BigDecimal totalAmount;\n\n    @ManyToOne(fetch = FetchType.LAZY)\n    private Customer customer;\n\n    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY, cascade = CascadeType.ALL)\n    private List<OrderItem> items = new ArrayList<>();\n}\n\n@Entity\npublic class OrderItem {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    private Integer quantity;\n    private BigDecimal price;\n\n    @ManyToOne(fetch = FetchType.LAZY)\n    private Order order;\n\n    @ManyToOne(fetch = FetchType.LAZY)\n    private Product product;\n}\n\npublic interface OrderRepository extends JpaRepository<Order, Long> {\n\n    @EntityGraph(value = "Order.withCustomer")\n    List<Order> findAll();\n\n    @EntityGraph(value = "Order.withItemsAndProducts")\n    @Query("SELECT o FROM Order o WHERE o.id = :id")\n    Optional<Order> findByIdWithItems(@Param("id") Long id);\n\n    @EntityGraph(attributePaths = {"customer", "items", "items.product"})\n    List<Order> findByCustomerId(Long customerId);\n}',
      explanation: '@EntityGraph переопределяет FetchType для конкретного запроса. @NamedEntityGraph объявляется на entity и используется повторно. subgraphs позволяют загружать вложенные связи. attributePaths — альтернатива без @NamedEntityGraph.'
    },
    {
      id: 6,
      title: 'Задача: Auditing — @CreatedDate и @LastModifiedDate',
      type: 'practice',
      difficulty: 'easy',
      description: 'Настройте автоматический аудит сущностей: кто и когда создал/изменил запись.',
      requirements: [
        'Базовый класс Auditable с @CreatedDate, @LastModifiedDate, @CreatedBy, @LastModifiedBy',
        '@EnableJpaAuditing в конфигурации',
        'AuditorAware<String> — реализация получения текущего пользователя из SecurityContext',
        'Entity Article extends Auditable',
        'Все даты заполняются автоматически при save/update',
        'AuditRevisionEntity для хранения полной истории изменений (Hibernate Envers)'
      ],
      expectedOutput: 'articleRepo.save(new Article("Title", "Content")):\n{\n  id: 1,\n  title: "Title",\n  createdDate: "2024-01-15T10:30:00",\n  lastModifiedDate: "2024-01-15T10:30:00",\n  createdBy: "admin@example.com",\n  lastModifiedBy: "admin@example.com"\n}\n\narticle.setTitle("Updated Title");\narticleRepo.save(article):\n{\n  createdDate: "2024-01-15T10:30:00",         // не изменилось\n  lastModifiedDate: "2024-01-15T11:00:00",    // обновилось\n  createdBy: "admin@example.com",              // не изменилось\n  lastModifiedBy: "editor@example.com"         // обновилось\n}',
      hint: 'Используйте @MappedSuperclass для базового класса. AuditorAware должен возвращать Optional<String> из SecurityContextHolder.',
      solution: '@MappedSuperclass\n@EntityListeners(AuditingEntityListener.class)\npublic abstract class Auditable {\n\n    @CreatedDate\n    @Column(updatable = false)\n    private LocalDateTime createdDate;\n\n    @LastModifiedDate\n    private LocalDateTime lastModifiedDate;\n\n    @CreatedBy\n    @Column(updatable = false)\n    private String createdBy;\n\n    @LastModifiedBy\n    private String lastModifiedBy;\n}\n\n@Configuration\n@EnableJpaAuditing(auditorAwareRef = "auditorProvider")\npublic class JpaAuditingConfig {\n\n    @Bean\n    public AuditorAware<String> auditorProvider() {\n        return () -> {\n            Authentication auth = SecurityContextHolder.getContext().getAuthentication();\n            if (auth == null || !auth.isAuthenticated()) {\n                return Optional.of("system");\n            }\n            return Optional.of(auth.getName());\n        };\n    }\n}\n\n@Entity\npublic class Article extends Auditable {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    private String title;\n    @Column(columnDefinition = "TEXT")\n    private String content;\n}',
      explanation: '@EntityListeners(AuditingEntityListener.class) перехватывает события persist/update и заполняет аудит-поля. @CreatedDate устанавливается только при INSERT. @LastModifiedDate обновляется при каждом UPDATE. AuditorAware возвращает имя текущего пользователя из Spring Security.'
    },
    {
      id: 7,
      title: 'Задача: Batch Insert — массовая вставка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Оптимизируйте массовую вставку данных с помощью batch insert и JDBC.',
      requirements: [
        'Настройка hibernate.jdbc.batch_size=50 в application.properties',
        'spring.jpa.properties.hibernate.order_inserts=true',
        'Сервис для массовой вставки 10000 продуктов',
        'Периодический flush и clear EntityManager каждые 50 записей',
        'Альтернатива: JdbcTemplate.batchUpdate для максимальной скорости',
        'Сравнение времени: saveAll vs batch flush vs JDBC batch'
      ],
      expectedOutput: 'Вставка 10000 записей:\n\nМетод 1 — saveAll(): 12.5 секунд (10000 отдельных INSERT)\nМетод 2 — batch flush/clear: 2.3 секунды (200 batch INSERT по 50)\nМетод 3 — JdbcTemplate batch: 0.8 секунды (200 batch INSERT по 50)\n\nSQL с batch_size=50:\nINSERT INTO products (name, category, price) VALUES\n  (?,?,?),(?,?,?),(?,?,?),...  -- 50 строк за раз',
      hint: 'Для batch insert через JPA не забудьте GenerationType.SEQUENCE вместо IDENTITY — IDENTITY отключает batching. Для JDBC используйте JdbcTemplate.batchUpdate().',
      solution: '// application.properties\n// spring.jpa.properties.hibernate.jdbc.batch_size=50\n// spring.jpa.properties.hibernate.order_inserts=true\n// spring.jpa.properties.hibernate.order_updates=true\n\n@Service\npublic class ProductBatchService {\n\n    @PersistenceContext\n    private EntityManager em;\n\n    @Autowired\n    private JdbcTemplate jdbcTemplate;\n\n    @Transactional\n    public void batchInsertJpa(List<Product> products) {\n        int batchSize = 50;\n        for (int i = 0; i < products.size(); i++) {\n            em.persist(products.get(i));\n            if (i > 0 && i % batchSize == 0) {\n                em.flush();\n                em.clear();\n            }\n        }\n        em.flush();\n        em.clear();\n    }\n\n    public void batchInsertJdbc(List<Product> products) {\n        String sql = "INSERT INTO products (name, category, price, stock, active) VALUES (?, ?, ?, ?, ?)";\n\n        jdbcTemplate.batchUpdate(sql, products, 50,\n            (PreparedStatement ps, Product p) -> {\n                ps.setString(1, p.getName());\n                ps.setString(2, p.getCategory());\n                ps.setBigDecimal(3, p.getPrice());\n                ps.setInt(4, p.getStock());\n                ps.setBoolean(5, p.isActive());\n            });\n    }\n}',
      explanation: 'Hibernate batch insert группирует несколько INSERT в один сетевой пакет. flush() отправляет SQL в БД, clear() освобождает память EntityManager. IDENTITY-генерация ID отключает batching, потому что Hibernate должен знать ID сразу. JdbcTemplate.batchUpdate() — самый быстрый способ, так как обходит JPA overhead.'
    },
    {
      id: 8,
      title: 'Задача: Optimistic Locking с @Version',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте оптимистическую блокировку для предотвращения конфликтов при одновременном редактировании.',
      requirements: [
        'Добавить @Version поле в Entity Account (balance)',
        'Обработка OptimisticLockException в сервисе',
        'Retry механизм при конфликте (до 3 попыток)',
        'Controller возвращает 409 Conflict при неразрешимом конфликте',
        'Тест: два потока одновременно обновляют balance',
        'Pessimistic lock альтернатива: @Lock(LockModeType.PESSIMISTIC_WRITE)'
      ],
      expectedOutput: 'Сценарий конкурентного обновления:\n\nThread-1: SELECT * FROM accounts WHERE id=1 → version=0, balance=1000\nThread-2: SELECT * FROM accounts WHERE id=1 → version=0, balance=1000\n\nThread-1: UPDATE accounts SET balance=900, version=1 WHERE id=1 AND version=0 → OK\nThread-2: UPDATE accounts SET balance=800, version=1 WHERE id=1 AND version=0 → FAIL!\n\nOptimisticLockException: Row was updated by another transaction\nRetry 1: SELECT (version=1, balance=900) → UPDATE SET balance=700, version=2 → OK',
      hint: 'Используйте @Retryable из spring-retry или ручной цикл с catch(OptimisticLockException). Передайте версию через DTO чтобы клиент тоже мог обнаружить конфликт.',
      solution: '@Entity\npublic class Account {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    private String owner;\n    private BigDecimal balance;\n\n    @Version\n    private Long version;\n}\n\n@Service\npublic class AccountService {\n    @Autowired AccountRepository repo;\n    private static final int MAX_RETRIES = 3;\n\n    @Transactional\n    public Account withdraw(Long accountId, BigDecimal amount) {\n        int retries = 0;\n        while (retries < MAX_RETRIES) {\n            try {\n                Account account = repo.findById(accountId)\n                    .orElseThrow(() -> new AccountNotFoundException(accountId));\n                if (account.getBalance().compareTo(amount) < 0) {\n                    throw new InsufficientFundsException();\n                }\n                account.setBalance(account.getBalance().subtract(amount));\n                return repo.saveAndFlush(account);\n            } catch (OptimisticLockException e) {\n                retries++;\n                if (retries >= MAX_RETRIES) {\n                    throw new ConflictException("Не удалось обновить после " + MAX_RETRIES + " попыток");\n                }\n            }\n        }\n        throw new ConflictException("Неожиданная ошибка");\n    }\n}\n\n// Pessimistic lock альтернатива\npublic interface AccountRepository extends JpaRepository<Account, Long> {\n    @Lock(LockModeType.PESSIMISTIC_WRITE)\n    @Query("SELECT a FROM Account a WHERE a.id = :id")\n    Optional<Account> findByIdForUpdate(@Param("id") Long id);\n}\n\n@ExceptionHandler(ConflictException.class)\n@ResponseStatus(HttpStatus.CONFLICT)\npublic ErrorResponse handleConflict(ConflictException ex) {\n    return new ErrorResponse(409, ex.getMessage());\n}',
      explanation: '@Version добавляет столбец версии. При UPDATE Hibernate автоматически добавляет WHERE version=N. Если строка уже обновлена другой транзакцией — версия не совпадает и выбрасывается OptimisticLockException. Retry переполучает актуальные данные и повторяет операцию.'
    },
    {
      id: 9,
      title: 'Задача: Soft Delete — мягкое удаление',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте soft delete — вместо удаления записи помечать её как удалённую.',
      requirements: [
        'Добавить поля deleted (boolean) и deletedAt (LocalDateTime) в Entity',
        '@SQLDelete для перехвата DELETE и замены на UPDATE',
        '@Where(clause = "deleted = false") для автоматической фильтрации',
        'Метод restore для восстановления удалённых записей',
        'Метод findAllIncludingDeleted — получить все записи (включая удалённые)',
        'Cascade soft delete: при удалении заказа удалять и его items'
      ],
      expectedOutput: 'productRepo.deleteById(1):\nSQL: UPDATE products SET deleted=true, deleted_at=NOW() WHERE id=1\n\nproductRepo.findAll():\nSQL: SELECT * FROM products WHERE deleted=false\nResult: [Product(id=2), Product(id=3)]  // id=1 не видим\n\nproductRepo.findAllIncludingDeleted():\nResult: [Product(id=1,deleted=true), Product(id=2), Product(id=3)]\n\nproductService.restore(1):\nSQL: UPDATE products SET deleted=false, deleted_at=null WHERE id=1',
      hint: 'Используйте @SQLDelete(sql = "UPDATE products SET deleted = true WHERE id = ?") на Entity. @FilterDef и @Filter более гибкие чем @Where — позволяют включать/отключать фильтр.',
      solution: '@Entity\n@Table(name = "products")\n@SQLDelete(sql = "UPDATE products SET deleted = true, deleted_at = NOW() WHERE id = ?")\n@Where(clause = "deleted = false")\npublic class Product {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    private String name;\n    private BigDecimal price;\n\n    private boolean deleted = false;\n    private LocalDateTime deletedAt;\n}\n\npublic interface ProductRepository extends JpaRepository<Product, Long> {\n\n    @Query("SELECT p FROM Product p WHERE p.deleted = true")\n    List<Product> findAllDeleted();\n\n    @Query(value = "SELECT * FROM products", nativeQuery = true)\n    List<Product> findAllIncludingDeleted();\n\n    @Modifying\n    @Transactional\n    @Query("UPDATE Product p SET p.deleted = false, p.deletedAt = null WHERE p.id = :id")\n    void restore(@Param("id") Long id);\n}\n\n@Service\npublic class ProductService {\n    @Autowired ProductRepository repo;\n\n    @Transactional\n    public void softDelete(Long id) {\n        repo.deleteById(id); // @SQLDelete перехватит\n    }\n\n    @Transactional\n    public void restore(Long id) {\n        repo.restore(id);\n    }\n\n    public List<Product> findAllIncludingDeleted() {\n        return repo.findAllIncludingDeleted();\n    }\n\n    public List<Product> findAllDeleted() {\n        return repo.findAllDeleted();\n    }\n}',
      explanation: '@SQLDelete заменяет SQL команду DELETE на UPDATE. @Where автоматически добавляет WHERE deleted=false ко всем JPQL/HQL запросам. Для native-запросов @Where не работает — нужно добавлять условие вручную. Для получения удалённых записей используйте native query или JPQL без @Where.'
    },
    {
      id: 10,
      title: 'Задача: Custom Repository Implementation',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте кастомную реализацию репозитория с EntityManager для сложной бизнес-логики.',
      requirements: [
        'Интерфейс ProductRepositoryCustom с методами: complexSearch, bulkUpdatePrices, getStatistics',
        'Класс ProductRepositoryImpl implements ProductRepositoryCustom',
        'ProductRepository extends JpaRepository<Product, Long>, ProductRepositoryCustom',
        'complexSearch: CriteriaBuilder с динамическими условиями',
        'bulkUpdatePrices: CriteriaUpdate для массового обновления',
        'getStatistics: Tuple-запрос для агрегации нескольких метрик одним запросом'
      ],
      expectedOutput: `productRepo.complexSearch(filter):\nCriteria Query:\n  SELECT p FROM Product p\n  WHERE p.category IN (\\'Electronics\\', \\'Books\\')\n    AND p.price BETWEEN 10 AND 1000\n    AND p.active = true\n  ORDER BY p.price ASC\nResult: [Product{...}, Product{...}]\n\nproductRepo.bulkUpdatePrices("Electronics", 1.10):\nUPDATE products SET price = price * 1.10 WHERE category = \\'Electronics\\'\nUpdated: 25 rows\n\nproductRepo.getStatistics():\n{totalProducts:100, avgPrice:45.50, maxPrice:999.99, categories:15}`,
      hint: 'Класс реализации ДОЛЖЕН называться {RepositoryName}Impl — это соглашение Spring Data. Используйте CriteriaBuilder для типобезопасных запросов. @PersistenceContext для получения EntityManager.',
      solution: 'public interface ProductRepositoryCustom {\n    List<Product> complexSearch(ProductSearchCriteria criteria);\n    int bulkUpdatePrices(String category, BigDecimal multiplier);\n    ProductStatistics getStatistics();\n}\n\npublic class ProductRepositoryImpl implements ProductRepositoryCustom {\n\n    @PersistenceContext\n    private EntityManager em;\n\n    @Override\n    public List<Product> complexSearch(ProductSearchCriteria criteria) {\n        CriteriaBuilder cb = em.getCriteriaBuilder();\n        CriteriaQuery<Product> cq = cb.createQuery(Product.class);\n        Root<Product> root = cq.from(Product.class);\n\n        List<Predicate> predicates = new ArrayList<>();\n\n        if (criteria.getCategories() != null && !criteria.getCategories().isEmpty()) {\n            predicates.add(root.get("category").in(criteria.getCategories()));\n        }\n        if (criteria.getMinPrice() != null) {\n            predicates.add(cb.greaterThanOrEqualTo(root.get("price"), criteria.getMinPrice()));\n        }\n        if (criteria.getMaxPrice() != null) {\n            predicates.add(cb.lessThanOrEqualTo(root.get("price"), criteria.getMaxPrice()));\n        }\n        if (criteria.getActive() != null) {\n            predicates.add(cb.equal(root.get("active"), criteria.getActive()));\n        }\n\n        cq.where(predicates.toArray(new Predicate[0]));\n        cq.orderBy(cb.asc(root.get("price")));\n\n        return em.createQuery(cq).getResultList();\n    }\n\n    @Override\n    @Transactional\n    public int bulkUpdatePrices(String category, BigDecimal multiplier) {\n        CriteriaBuilder cb = em.getCriteriaBuilder();\n        CriteriaUpdate<Product> update = cb.createCriteriaUpdate(Product.class);\n        Root<Product> root = update.from(Product.class);\n\n        update.set(root.get("price"),\n            cb.prod(root.get("price"), multiplier));\n        update.where(cb.equal(root.get("category"), category));\n\n        return em.createQuery(update).executeUpdate();\n    }\n\n    @Override\n    public ProductStatistics getStatistics() {\n        CriteriaBuilder cb = em.getCriteriaBuilder();\n        CriteriaQuery<Tuple> cq = cb.createTupleQuery();\n        Root<Product> root = cq.from(Product.class);\n\n        cq.multiselect(\n            cb.count(root).alias("total"),\n            cb.avg(root.get("price")).alias("avgPrice"),\n            cb.max(root.get("price")).alias("maxPrice"),\n            cb.countDistinct(root.get("category")).alias("categories")\n        );\n\n        Tuple result = em.createQuery(cq).getSingleResult();\n        return new ProductStatistics(\n            result.get("total", Long.class),\n            result.get("avgPrice", Double.class),\n            result.get("maxPrice", BigDecimal.class),\n            result.get("categories", Long.class)\n        );\n    }\n}\n\npublic interface ProductRepository extends JpaRepository<Product, Long>, ProductRepositoryCustom {\n}',
      explanation: 'Custom Repository позволяет добавлять произвольную логику к Spring Data репозиториям. Суффикс Impl обязателен — Spring Data автоматически подключает реализацию. CriteriaBuilder обеспечивает типобезопасные запросы без строковой конкатенации. CriteriaUpdate позволяет массовое обновление без загрузки сущностей в память.'
    }
  ]
}
