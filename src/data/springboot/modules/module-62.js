export default {
  id: 62,
  title: 'Практикум: Поиск и фильтрация',
  description: 'Практические задачи по реализации поиска и фильтрации в Spring Boot: JPA Specifications, полнотекстовый поиск, Elasticsearch, cursor-пагинация, автодополнение и фасетный поиск.',
  lessons: [
    {
      id: 1,
      title: 'Задача: JPA Specification фильтрация',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте динамическую фильтрацию продуктов с помощью JPA Specifications и CriteriaBuilder.',
      requirements: [
        'Репозиторий ProductRepository extends JpaSpecificationExecutor<Product>',
        'ProductSpecification с методами: byCategory, byPriceRange, byNameContaining',
        'Комбинирование спецификаций через Specification.where().and().or()',
        'REST endpoint GET /api/products?category=...&minPrice=...&maxPrice=...&name=...'
      ],
      expectedOutput: 'GET /api/products?category=Electronics&minPrice=100&maxPrice=500\n→ 200 [{ "name":"Wireless Mouse", "price":29.99, "category":"Electronics" }, ...]\n\nGET /api/products?name=phone&category=Electronics\n→ 200 [{ "name":"iPhone 15", "category":"Electronics" }]\n\nGET /api/products (без фильтров) → 200 [все продукты]',
      hint: 'Каждый метод в Specification возвращает Specification<Product>. Null-safe: если параметр null, возвращайте null — Spring Data JPA игнорирует null спецификации.',
      solution: `// --- ProductSpecification ---
public class ProductSpecification {

    public static Specification<Product> byCategory(String category) {
        if (category == null || category.isBlank()) return null;
        return (root, query, cb) -> cb.equal(root.get("category"), category);
    }

    public static Specification<Product> byPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }
            return predicates.isEmpty() ? null : cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<Product> byNameContaining(String name) {
        if (name == null || name.isBlank()) return null;
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    public static Specification<Product> byActive(Boolean active) {
        if (active == null) return null;
        return (root, query, cb) -> cb.equal(root.get("active"), active);
    }

    public static Specification<Product> byStockGreaterThan(Integer minStock) {
        if (minStock == null) return null;
        return (root, query, cb) -> cb.greaterThan(root.get("stock"), minStock);
    }
}

// --- ProductService ---
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public Page<Product> search(ProductFilterDto filter, Pageable pageable) {
        Specification<Product> spec = Specification
                .where(ProductSpecification.byCategory(filter.getCategory()))
                .and(ProductSpecification.byPriceRange(filter.getMinPrice(), filter.getMaxPrice()))
                .and(ProductSpecification.byNameContaining(filter.getName()))
                .and(ProductSpecification.byActive(filter.getActive()))
                .and(ProductSpecification.byStockGreaterThan(filter.getMinStock()));

        return productRepository.findAll(spec, pageable);
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<Product>> search(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) Integer minStock,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        ProductFilterDto filter = ProductFilterDto.builder()
                .category(category).minPrice(minPrice).maxPrice(maxPrice)
                .name(name).active(active).minStock(minStock).build();

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(productService.search(filter, pageable));
    }
}`,
      explanation: 'JPA Specifications позволяют строить динамические запросы. Каждая спецификация — отдельный предикат, комбинируемый через and/or. Если параметр null, спецификация возвращает null и игнорируется. CriteriaBuilder создаёт SQL-условия: equal, like, greaterThan и т.д. JpaSpecificationExecutor добавляет findAll(Specification, Pageable).'
    },
    {
      id: 2,
      title: 'Задача: Динамический конструктор запросов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте гибкий конструктор запросов, который комбинирует спецификации с поддержкой AND/OR логики и вложенных условий.',
      requirements: [
        'SpecificationBuilder с fluent API: with(key, operation, value)',
        'Поддержка операций: EQUAL, NOT_EQUAL, GREATER_THAN, LESS_THAN, LIKE, IN, BETWEEN',
        'Комбинирование через AND и OR с вложенностью',
        'Парсинг фильтров из query string: ?filter=price>100,category:Electronics'
      ],
      expectedOutput: 'new SpecificationBuilder<Product>()\n  .with("category", EQUAL, "Electronics")\n  .with("price", GREATER_THAN, 100)\n  .with("name", LIKE, "phone")\n  .build()\n→ WHERE category = "Electronics" AND price > 100 AND name LIKE "%phone%"\n\n?filter=price>100,category:Electronics,name~phone → аналогичный результат',
      hint: 'Создайте SearchCriteria(key, operation, value) и конвертируйте каждый в Predicate. Используйте enum для операций.',
      solution: `// --- SearchCriteria ---
@Data @AllArgsConstructor
public class SearchCriteria {
    private String key;
    private SearchOperation operation;
    private Object value;
    private Object valueTo; // для BETWEEN
}

public enum SearchOperation {
    EQUAL, NOT_EQUAL, GREATER_THAN, LESS_THAN,
    GREATER_THAN_OR_EQUAL, LESS_THAN_OR_EQUAL,
    LIKE, IN, BETWEEN
}

// --- GenericSpecification ---
public class GenericSpecification<T> implements Specification<T> {

    private final SearchCriteria criteria;

    public GenericSpecification(SearchCriteria criteria) {
        this.criteria = criteria;
    }

    @Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        return switch (criteria.getOperation()) {
            case EQUAL -> cb.equal(root.get(criteria.getKey()), criteria.getValue());
            case NOT_EQUAL -> cb.notEqual(root.get(criteria.getKey()), criteria.getValue());
            case GREATER_THAN -> cb.greaterThan(root.get(criteria.getKey()),
                    (Comparable) criteria.getValue());
            case LESS_THAN -> cb.lessThan(root.get(criteria.getKey()),
                    (Comparable) criteria.getValue());
            case GREATER_THAN_OR_EQUAL -> cb.greaterThanOrEqualTo(root.get(criteria.getKey()),
                    (Comparable) criteria.getValue());
            case LESS_THAN_OR_EQUAL -> cb.lessThanOrEqualTo(root.get(criteria.getKey()),
                    (Comparable) criteria.getValue());
            case LIKE -> cb.like(cb.lower(root.get(criteria.getKey())),
                    "%" + criteria.getValue().toString().toLowerCase() + "%");
            case IN -> root.get(criteria.getKey()).in((Collection<?>) criteria.getValue());
            case BETWEEN -> cb.between(root.get(criteria.getKey()),
                    (Comparable) criteria.getValue(), (Comparable) criteria.getValueTo());
        };
    }
}

// --- SpecificationBuilder ---
public class SpecificationBuilder<T> {

    private final List<SearchCriteria> params = new ArrayList<>();
    private final List<Specification<T>> orSpecs = new ArrayList<>();

    public SpecificationBuilder<T> with(String key, SearchOperation operation, Object value) {
        params.add(new SearchCriteria(key, operation, value, null));
        return this;
    }

    public SpecificationBuilder<T> withBetween(String key, Object from, Object to) {
        params.add(new SearchCriteria(key, SearchOperation.BETWEEN, from, to));
        return this;
    }

    public SpecificationBuilder<T> or(Specification<T> spec) {
        orSpecs.add(spec);
        return this;
    }

    public Specification<T> build() {
        if (params.isEmpty() && orSpecs.isEmpty()) return null;

        Specification<T> result = new GenericSpecification<>(params.get(0));
        for (int i = 1; i < params.size(); i++) {
            result = Specification.where(result)
                    .and(new GenericSpecification<>(params.get(i)));
        }

        for (Specification<T> orSpec : orSpecs) {
            result = Specification.where(result).or(orSpec);
        }

        return result;
    }
}

// --- Filter Parser ---
@Component
public class FilterParser {

    public <T> Specification<T> parse(String filterString) {
        if (filterString == null || filterString.isBlank()) return null;

        SpecificationBuilder<T> builder = new SpecificationBuilder<>();
        String[] filters = filterString.split(",");

        for (String filter : filters) {
            if (filter.contains(">=")) {
                String[] parts = filter.split(">=");
                builder.with(parts[0], SearchOperation.GREATER_THAN_OR_EQUAL, parseValue(parts[1]));
            } else if (filter.contains(">")) {
                String[] parts = filter.split(">");
                builder.with(parts[0], SearchOperation.GREATER_THAN, parseValue(parts[1]));
            } else if (filter.contains("<=")) {
                String[] parts = filter.split("<=");
                builder.with(parts[0], SearchOperation.LESS_THAN_OR_EQUAL, parseValue(parts[1]));
            } else if (filter.contains("<")) {
                String[] parts = filter.split("<");
                builder.with(parts[0], SearchOperation.LESS_THAN, parseValue(parts[1]));
            } else if (filter.contains("~")) {
                String[] parts = filter.split("~");
                builder.with(parts[0], SearchOperation.LIKE, parts[1]);
            } else if (filter.contains(":")) {
                String[] parts = filter.split(":");
                builder.with(parts[0], SearchOperation.EQUAL, parseValue(parts[1]));
            }
        }

        return builder.build();
    }

    private Object parseValue(String value) {
        try { return new BigDecimal(value); } catch (Exception ignored) {}
        return value;
    }
}`,
      explanation: 'SpecificationBuilder предоставляет fluent API для построения запросов. SearchCriteria хранит ключ, операцию и значение. GenericSpecification конвертирует критерий в JPA Predicate через CriteriaBuilder. FilterParser парсит строковые фильтры из query parameters. Паттерн Builder позволяет гибко комбинировать условия.'
    },
    {
      id: 3,
      title: 'Задача: Полнотекстовый поиск PostgreSQL',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте полнотекстовый поиск с использованием tsvector и tsquery в PostgreSQL через native queries.',
      requirements: [
        'Native query с to_tsvector и plainto_tsquery для поиска по нескольким полям',
        'Ранжирование результатов по релевантности через ts_rank',
        'Поддержка русского и английского языков в поиске',
        'Создание GIN-индекса для ускорения полнотекстового поиска'
      ],
      expectedOutput: 'GET /api/products/search?q=wireless mouse\n→ [{ "name":"Wireless Mouse", "rank":0.95 }, { "name":"Mouse Pad", "rank":0.35 }]\n\nGET /api/articles/search?q=spring boot\n→ [{ "title":"Spring Boot Guide", "rank":0.88 }, { "title":"Spring Framework", "rank":0.42 }]',
      hint: `Используйте to_tsvector(\\'english\\', name || \\' \\' || description) для объединения полей. plainto_tsquery автоматически обрабатывает пробелы в запросе.`,
      solution: `// --- Flyway Migration ---
// CREATE INDEX idx_products_fulltext ON products
//     USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));
//
// CREATE INDEX idx_articles_fulltext ON articles
//     USING GIN (to_tsvector('russian', title || ' ' || COALESCE(content, '')));

// --- Repository ---
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(value = """
            SELECT p.*, ts_rank(
                to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')),
                plainto_tsquery('english', :query)
            ) AS rank
            FROM products p
            WHERE to_tsvector('english', p.name || ' ' || COALESCE(p.description, ''))
                @@ plainto_tsquery('english', :query)
            ORDER BY rank DESC
            LIMIT :limit OFFSET :offset
            """, nativeQuery = true)
    List<Object[]> fullTextSearch(@Param("query") String query,
                                   @Param("limit") int limit,
                                   @Param("offset") int offset);

    @Query(value = """
            SELECT COUNT(*) FROM products p
            WHERE to_tsvector('english', p.name || ' ' || COALESCE(p.description, ''))
                @@ plainto_tsquery('english', :query)
            """, nativeQuery = true)
    long fullTextSearchCount(@Param("query") String query);

    // Мульти-языковый поиск
    @Query(value = """
            SELECT p.*, ts_rank(
                setweight(to_tsvector('english', p.name), 'A') ||
                setweight(to_tsvector('english', COALESCE(p.description, '')), 'B'),
                plainto_tsquery('english', :query)
            ) AS rank
            FROM products p
            WHERE (
                setweight(to_tsvector('english', p.name), 'A') ||
                setweight(to_tsvector('english', COALESCE(p.description, '')), 'B')
            ) @@ plainto_tsquery('english', :query)
            ORDER BY rank DESC
            """, nativeQuery = true)
    List<Object[]> weightedFullTextSearch(@Param("query") String query);
}

// --- SearchService ---
@Service
@RequiredArgsConstructor
public class SearchService {

    private final ProductRepository productRepository;

    public SearchResultDto search(String query, int page, int size) {
        List<Object[]> results = productRepository.fullTextSearch(query, size, page * size);
        long total = productRepository.fullTextSearchCount(query);

        List<ProductSearchResult> products = results.stream()
                .map(row -> new ProductSearchResult(
                        ((Number) row[0]).longValue(),  // id
                        (String) row[1],                 // name
                        (String) row[2],                 // description
                        (BigDecimal) row[3],             // price
                        ((Number) row[row.length - 1]).doubleValue()  // rank
                ))
                .collect(Collectors.toList());

        return new SearchResultDto(products, total, page, size);
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductSearchController {

    private final SearchService searchService;

    @GetMapping("/search")
    public ResponseEntity<SearchResultDto> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(searchService.search(q, page, size));
    }
}`,
      explanation: 'PostgreSQL tsvector/tsquery обеспечивает полнотекстовый поиск с морфологическим анализом. ts_rank ранжирует результаты по релевантности. setweight позволяет дать больший вес совпадениям в названии (A) чем в описании (B). GIN-индекс ускоряет полнотекстовый поиск на больших объёмах данных.'
    },
    {
      id: 4,
      title: 'Задача: Интеграция с Elasticsearch',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте поисковую систему на основе Elasticsearch с помощью spring-data-elasticsearch.',
      requirements: [
        'Elasticsearch document entity с аннотациями @Document, @Field',
        'ElasticsearchRepository для CRUD операций',
        'Кастомный поиск через ElasticsearchOperations и NativeQuery',
        'Синхронизация данных между PostgreSQL и Elasticsearch'
      ],
      expectedOutput: 'POST /api/products (сохранение в PostgreSQL + индексация в Elasticsearch)\n\nGET /api/products/search?q=wireless&category=Electronics&minPrice=10\n→ Elasticsearch query → [{ "name":"Wireless Mouse", "score":12.5 }]\n\nGET /api/products/search/suggest?prefix=wire\n→ ["Wireless Mouse", "Wireless Keyboard", "Wireless Charger"]',
      hint: 'Используйте @Document(indexName="products") для Elasticsearch entity. ElasticsearchOperations.search() для кастомных запросов. @AfterReturning AOP для синхронизации.',
      solution: `// --- Elasticsearch Document ---
@Document(indexName = "products")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductDocument {

    @Id
    private String id;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String name;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String description;

    @Field(type = FieldType.Keyword)
    private String category;

    @Field(type = FieldType.Double)
    private BigDecimal price;

    @Field(type = FieldType.Integer)
    private Integer stock;

    @Field(type = FieldType.Boolean)
    private boolean active;

    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    private LocalDateTime createdAt;

    @CompletionField(maxInputLength = 100)
    private Completion suggest;
}

// --- Elasticsearch Repository ---
public interface ProductSearchRepository extends ElasticsearchRepository<ProductDocument, String> {
    List<ProductDocument> findByNameContaining(String name);
    List<ProductDocument> findByCategoryAndPriceGreaterThan(String category, BigDecimal price);
}

// --- Search Service ---
@Service
@RequiredArgsConstructor
@Slf4j
public class ProductElasticService {

    private final ElasticsearchOperations elasticsearchOperations;
    private final ProductSearchRepository searchRepository;

    public SearchPage<ProductDocument> search(String query, String category,
                                                BigDecimal minPrice, BigDecimal maxPrice,
                                                int page, int size) {
        BoolQuery.Builder boolQuery = new BoolQuery.Builder();

        if (query != null && !query.isBlank()) {
            boolQuery.must(m -> m.multiMatch(mm -> mm
                    .query(query)
                    .fields("name^3", "description")
                    .fuzziness("AUTO")));
        }

        if (category != null) {
            boolQuery.filter(f -> f.term(t -> t.field("category").value(category)));
        }

        if (minPrice != null) {
            boolQuery.filter(f -> f.range(r -> r.field("price")
                    .gte(JsonData.of(minPrice))));
        }

        if (maxPrice != null) {
            boolQuery.filter(f -> f.range(r -> r.field("price")
                    .lte(JsonData.of(maxPrice))));
        }

        NativeQuery searchQuery = NativeQuery.builder()
                .withQuery(q -> q.bool(boolQuery.build()))
                .withPageable(PageRequest.of(page, size))
                .withSort(Sort.by("_score").descending())
                .build();

        SearchHits<ProductDocument> hits =
                elasticsearchOperations.search(searchQuery, ProductDocument.class);

        return SearchHitSupport.searchPageFor(hits, searchQuery.getPageable());
    }

    public List<String> suggest(String prefix) {
        // autocomplete через completion suggester
        NativeQuery query = NativeQuery.builder()
                .withQuery(q -> q.prefix(p -> p.field("name").value(prefix)))
                .withPageable(PageRequest.of(0, 10))
                .build();

        SearchHits<ProductDocument> hits =
                elasticsearchOperations.search(query, ProductDocument.class);

        return hits.getSearchHits().stream()
                .map(hit -> hit.getContent().getName())
                .collect(Collectors.toList());
    }
}

// --- Sync Service ---
@Component
@RequiredArgsConstructor
@Slf4j
public class ElasticSyncService {

    private final ProductSearchRepository searchRepository;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onProductSaved(ProductSavedEvent event) {
        Product product = event.getProduct();
        ProductDocument doc = ProductDocument.builder()
                .id(product.getId().toString())
                .name(product.getName())
                .description(product.getDescription())
                .category(product.getCategory())
                .price(product.getPrice())
                .stock(product.getStock())
                .active(product.isActive())
                .createdAt(product.getCreatedAt())
                .build();
        searchRepository.save(doc);
        log.info("Product indexed in Elasticsearch: id={}", product.getId());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onProductDeleted(ProductDeletedEvent event) {
        searchRepository.deleteById(event.getProductId().toString());
        log.info("Product removed from Elasticsearch: id={}", event.getProductId());
    }
}`,
      explanation: 'Elasticsearch обеспечивает быстрый полнотекстовый поиск с fuzzy-matching и ранжированием. @Document маппит Java-класс на Elasticsearch index. BoolQuery комбинирует must (текстовый поиск) и filter (фильтрация без влияния на score). @TransactionalEventListener синхронизирует данные между PostgreSQL и Elasticsearch после коммита транзакции.'
    },
    {
      id: 5,
      title: 'Задача: Cursor-based пагинация',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте cursor-based (keyset) пагинацию, которая эффективнее offset-based для больших наборов данных.',
      requirements: [
        'Пагинация через WHERE id > :lastId ORDER BY id LIMIT :size',
        'Поддержка сортировки по нескольким полям с cursor',
        'Кодирование cursor в Base64 для передачи клиенту',
        'Ответ с nextCursor и hasPrevious/hasNext флагами'
      ],
      expectedOutput: 'GET /api/products?size=3\n→ { "data":[{id:1},{id:2},{id:3}], "nextCursor":"eyJpZCI6M30=", "hasNext":true }\n\nGET /api/products?size=3&cursor=eyJpZCI6M30=\n→ { "data":[{id:4},{id:5},{id:6}], "nextCursor":"eyJpZCI6Nn0=", "hasNext":true }\n\nGET /api/products?size=3&cursor=eyJpZCI6Nn0=\n→ { "data":[{id:7},{id:8}], "nextCursor":null, "hasNext":false }',
      hint: 'Cursor — это Base64-закодированный JSON с id последнего элемента. Используйте ORDER BY id ASC, LIMIT size+1 для определения hasNext.',
      solution: `// --- CursorPage DTO ---
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CursorPage<T> {
    private List<T> data;
    private String nextCursor;
    private String prevCursor;
    private boolean hasNext;
    private boolean hasPrevious;
    private int size;
}

// --- Cursor Helper ---
@Component
public class CursorHelper {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String encode(Map<String, Object> cursorData) {
        try {
            String json = objectMapper.writeValueAsString(cursorData);
            return Base64.getUrlEncoder().encodeToString(json.getBytes());
        } catch (Exception e) {
            throw new RuntimeException("Cursor encoding failed", e);
        }
    }

    public Map<String, Object> decode(String cursor) {
        try {
            String json = new String(Base64.getUrlDecoder().decode(cursor));
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid cursor", e);
        }
    }
}

// --- Repository ---
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE p.id > :lastId ORDER BY p.id ASC")
    List<Product> findAfterCursor(@Param("lastId") Long lastId, Pageable pageable);

    @Query("SELECT p FROM Product p ORDER BY p.id ASC")
    List<Product> findFirstPage(Pageable pageable);

    // Cursor по нескольким полям (createdAt, id)
    @Query("""
            SELECT p FROM Product p
            WHERE (p.createdAt < :lastDate)
               OR (p.createdAt = :lastDate AND p.id < :lastId)
            ORDER BY p.createdAt DESC, p.id DESC
            """)
    List<Product> findAfterCursorMultiSort(
            @Param("lastDate") LocalDateTime lastDate,
            @Param("lastId") Long lastId,
            Pageable pageable);
}

// --- Service ---
@Service
@RequiredArgsConstructor
public class ProductCursorService {

    private final ProductRepository productRepository;
    private final CursorHelper cursorHelper;

    public CursorPage<ProductDto> findAll(String cursor, int size) {
        List<Product> products;

        if (cursor != null) {
            Map<String, Object> cursorData = cursorHelper.decode(cursor);
            Long lastId = ((Number) cursorData.get("id")).longValue();
            products = productRepository.findAfterCursor(lastId, PageRequest.of(0, size + 1));
        } else {
            products = productRepository.findFirstPage(PageRequest.of(0, size + 1));
        }

        boolean hasNext = products.size() > size;
        if (hasNext) {
            products = products.subList(0, size);
        }

        String nextCursor = null;
        if (hasNext && !products.isEmpty()) {
            Product last = products.get(products.size() - 1);
            nextCursor = cursorHelper.encode(Map.of("id", last.getId()));
        }

        List<ProductDto> dtos = products.stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());

        return CursorPage.<ProductDto>builder()
                .data(dtos)
                .nextCursor(nextCursor)
                .hasNext(hasNext)
                .hasPrevious(cursor != null)
                .size(dtos.size())
                .build();
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductCursorService cursorService;

    @GetMapping
    public ResponseEntity<CursorPage<ProductDto>> findAll(
            @RequestParam(required = false) String cursor,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(cursorService.findAll(cursor, Math.min(size, 100)));
    }
}`,
      explanation: 'Cursor-based пагинация использует WHERE id > :lastId вместо OFFSET, что гарантирует O(1) производительность на любой странице. Cursor кодируется в Base64 и содержит id последнего элемента. Запрос size+1 позволяет определить hasNext без дополнительного COUNT запроса. Для сортировки по нескольким полям cursor содержит все поля сортировки.'
    },
    {
      id: 6,
      title: 'Задача: Многопольная сортировка',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте сортировку по нескольким полям с поддержкой направления и валидацией допустимых полей.',
      requirements: [
        'Парсинг параметров сортировки: ?sort=price,asc&sort=name,desc',
        'Валидация допустимых полей сортировки (whitelist)',
        'Значение по умолчанию при отсутствии параметра сортировки',
        'Поддержка вложенных полей: category.name, assignee.firstName'
      ],
      expectedOutput: 'GET /api/products?sort=price,asc&sort=name,desc\n→ ORDER BY price ASC, name DESC\n\nGET /api/products?sort=invalid,asc\n→ 400 { "message":"Недопустимое поле сортировки: invalid. Доступные: name, price, category, createdAt" }\n\nGET /api/products (без sort)\n→ ORDER BY createdAt DESC (по умолчанию)',
      hint: 'Spring MVC автоматически парсит ?sort=field,direction в Sort объект при использовании Pageable. Для кастомной валидации создайте SortValidator.',
      solution: `// --- SortValidator ---
@Component
public class SortValidator {

    private static final Map<String, Set<String>> ALLOWED_SORT_FIELDS = Map.of(
            "products", Set.of("name", "price", "category", "stock", "createdAt", "rating"),
            "tasks", Set.of("title", "status", "priority", "createdAt", "dueDate", "assignee.name"),
            "users", Set.of("email", "firstName", "lastName", "createdAt")
    );

    public Sort validateAndParse(String entity, List<String> sortParams) {
        if (sortParams == null || sortParams.isEmpty()) {
            return Sort.by(Sort.Direction.DESC, "createdAt");
        }

        Set<String> allowed = ALLOWED_SORT_FIELDS.getOrDefault(entity, Set.of());
        List<Sort.Order> orders = new ArrayList<>();

        for (String param : sortParams) {
            String[] parts = param.split(",");
            String field = parts[0].trim();

            if (!allowed.contains(field)) {
                throw new BadRequestException(
                        "Недопустимое поле сортировки: " + field +
                        ". Доступные: " + String.join(", ", allowed));
            }

            Sort.Direction direction = parts.length > 1 && "desc".equalsIgnoreCase(parts[1])
                    ? Sort.Direction.DESC : Sort.Direction.ASC;

            orders.add(new Sort.Order(direction, field));
        }

        return Sort.by(orders);
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final SortValidator sortValidator;

    @GetMapping
    public ResponseEntity<Page<ProductDto>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(name = "sort", required = false) List<String> sortParams) {

        Sort sort = sortValidator.validateAndParse("products", sortParams);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ProductDto> products = productRepository.findAll(pageable)
                .map(ProductDto::fromEntity);

        return ResponseEntity.ok(products);
    }
}

// --- SortInfo в ответе ---
@Data @Builder
public class PageResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean hasNext;
    private boolean hasPrevious;
    private List<SortInfo> sort;
}

@Data @AllArgsConstructor
public class SortInfo {
    private String field;
    private String direction;
}`,
      explanation: 'SortValidator проверяет что клиент сортирует только по разрешённым полям — это защита от SQL injection через параметры сортировки. Whitelist подход безопаснее blacklist. Значение по умолчанию (createdAt DESC) обеспечивает предсказуемый порядок. Sort.by(List<Order>) поддерживает несколько полей сортировки.'
    },
    {
      id: 7,
      title: 'Задача: Автодополнение и подсказки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте функцию автодополнения (autocomplete) для поиска с подсказками при вводе текста.',
      requirements: [
        'Поиск по префиксу через LIKE с использованием индекса',
        'Триграммное сходство через расширение pg_trgm для fuzzy-matching',
        'Ограничение результатов до 10 подсказок с сортировкой по релевантности',
        'Кеширование частых запросов через @Cacheable'
      ],
      expectedOutput: 'GET /api/products/suggest?prefix=wir\n→ ["Wireless Mouse", "Wireless Keyboard", "Wireless Charger"]\n\nGET /api/products/suggest?prefix=moues (опечатка)\n→ ["Mouse", "Wireless Mouse"] (через триграммное сходство)\n\nGET /api/products/suggest?prefix=ip\n→ ["iPhone 15", "iPhone 14", "iPad Pro"]',
      hint: 'Используйте pg_trgm расширение: CREATE EXTENSION IF NOT EXISTS pg_trgm. Функция similarity(name, query) возвращает число от 0 до 1.',
      solution: `// --- Migration ---
// CREATE EXTENSION IF NOT EXISTS pg_trgm;
// CREATE INDEX idx_products_name_trgm ON products USING GIN (name gin_trgm_ops);
// CREATE INDEX idx_products_name_prefix ON products (lower(name) varchar_pattern_ops);

// --- Repository ---
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Поиск по префиксу
    @Query(value = """
            SELECT DISTINCT name FROM products
            WHERE lower(name) LIKE lower(:prefix || '%')
            ORDER BY name
            LIMIT 10
            """, nativeQuery = true)
    List<String> findSuggestionsByPrefix(@Param("prefix") String prefix);

    // Fuzzy поиск через триграммное сходство
    @Query(value = """
            SELECT name, similarity(name, :query) AS sim
            FROM products
            WHERE similarity(name, :query) > 0.2
            ORDER BY sim DESC
            LIMIT 10
            """, nativeQuery = true)
    List<Object[]> findSuggestionsFuzzy(@Param("query") String query);

    // Комбинированный: сначала prefix, потом fuzzy
    @Query(value = """
            (SELECT name, 1.0 AS score FROM products
             WHERE lower(name) LIKE lower(:query || '%')
             ORDER BY name LIMIT 5)
            UNION ALL
            (SELECT name, similarity(name, :query) AS score FROM products
             WHERE similarity(name, :query) > 0.3
               AND lower(name) NOT LIKE lower(:query || '%')
             ORDER BY score DESC LIMIT 5)
            ORDER BY score DESC
            LIMIT 10
            """, nativeQuery = true)
    List<Object[]> findSuggestionsCombined(@Param("query") String query);
}

// --- Service с кешированием ---
@Service
@RequiredArgsConstructor
public class SuggestionService {

    private final ProductRepository productRepository;

    @Cacheable(value = "suggestions", key = "#prefix",
            condition = "#prefix.length() >= 2",
            unless = "#result.isEmpty()")
    public List<String> getSuggestions(String prefix) {
        if (prefix == null || prefix.length() < 2) {
            return Collections.emptyList();
        }

        List<Object[]> results = productRepository.findSuggestionsCombined(prefix);
        return results.stream()
                .map(row -> (String) row[0])
                .distinct()
                .collect(Collectors.toList());
    }

    public List<SuggestionDto> getSuggestionsWithScore(String prefix) {
        List<Object[]> results = productRepository.findSuggestionsCombined(prefix);
        return results.stream()
                .map(row -> new SuggestionDto((String) row[0], ((Number) row[1]).doubleValue()))
                .collect(Collectors.toList());
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class SuggestionController {

    private final SuggestionService suggestionService;

    @GetMapping("/suggest")
    public ResponseEntity<List<String>> suggest(@RequestParam String prefix) {
        return ResponseEntity.ok(suggestionService.getSuggestions(prefix));
    }
}`,
      explanation: 'Автодополнение использует два подхода: prefix match (LIKE "wire%") для точных совпадений начала слова, и триграммное сходство (pg_trgm) для fuzzy-matching с опечатками. GIN-индекс ускоряет триграммный поиск. UNION ALL объединяет оба подхода с приоритетом prefix. @Cacheable кеширует частые запросы для снижения нагрузки на БД.'
    },
    {
      id: 8,
      title: 'Задача: Фасетный поиск',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте фасетный (faceted) поиск: подсчёт количества товаров в каждой категории/бренде с учётом активных фильтров.',
      requirements: [
        'GROUP BY для подсчёта количества товаров по каждому фасету (категория, бренд, рейтинг)',
        'Пересчёт фасетов при активации фильтров',
        'Поддержка range-фасетов для цены (0-50, 50-100, 100-500, 500+)',
        'Ответ с данными товаров и фасетами в одном запросе'
      ],
      expectedOutput: 'GET /api/products/search?q=mouse\n→ {\n  "products": [...],\n  "facets": {\n    "categories": [{"name":"Electronics","count":15}, {"name":"Gaming","count":8}],\n    "brands": [{"name":"Logitech","count":10}, {"name":"Razer","count":5}],\n    "priceRanges": [{"range":"0-50","count":12}, {"range":"50-100","count":8}]\n  }\n}',
      hint: 'Выполните отдельные GROUP BY запросы для каждого фасета с теми же условиями WHERE. Или используйте один запрос с GROUPING SETS.',
      solution: `// --- Facet DTOs ---
@Data @AllArgsConstructor
public class FacetItem {
    private String name;
    private long count;
}

@Data @AllArgsConstructor
public class RangeFacetItem {
    private String range;
    private BigDecimal from;
    private BigDecimal to;
    private long count;
}

@Data @Builder
public class FacetedSearchResult {
    private List<ProductDto> products;
    private long totalCount;
    private Map<String, List<FacetItem>> facets;
    private List<RangeFacetItem> priceRanges;
}

// --- Repository ---
public interface ProductRepository extends JpaRepository<Product, Long>,
        JpaSpecificationExecutor<Product> {

    @Query("""
            SELECT p.category, COUNT(p) FROM Product p
            WHERE (:name IS NULL OR lower(p.name) LIKE lower(concat('%', :name, '%')))
            AND (:brand IS NULL OR p.brand = :brand)
            AND (:minPrice IS NULL OR p.price >= :minPrice)
            AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            GROUP BY p.category ORDER BY COUNT(p) DESC
            """)
    List<Object[]> countByCategory(@Param("name") String name,
                                    @Param("brand") String brand,
                                    @Param("minPrice") BigDecimal minPrice,
                                    @Param("maxPrice") BigDecimal maxPrice);

    @Query("""
            SELECT p.brand, COUNT(p) FROM Product p
            WHERE (:name IS NULL OR lower(p.name) LIKE lower(concat('%', :name, '%')))
            AND (:category IS NULL OR p.category = :category)
            AND (:minPrice IS NULL OR p.price >= :minPrice)
            AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            GROUP BY p.brand ORDER BY COUNT(p) DESC
            """)
    List<Object[]> countByBrand(@Param("name") String name,
                                 @Param("category") String category,
                                 @Param("minPrice") BigDecimal minPrice,
                                 @Param("maxPrice") BigDecimal maxPrice);

    @Query(value = """
            SELECT
                CASE
                    WHEN price < 50 THEN '0-50'
                    WHEN price < 100 THEN '50-100'
                    WHEN price < 500 THEN '100-500'
                    ELSE '500+'
                END AS price_range,
                COUNT(*) as cnt
            FROM products
            WHERE (:name IS NULL OR lower(name) LIKE lower(concat('%', :name, '%')))
            AND (:category IS NULL OR category = :category)
            GROUP BY price_range ORDER BY MIN(price)
            """, nativeQuery = true)
    List<Object[]> countByPriceRange(@Param("name") String name,
                                      @Param("category") String category);
}

// --- FacetedSearchService ---
@Service
@RequiredArgsConstructor
public class FacetedSearchService {

    private final ProductRepository productRepository;

    public FacetedSearchResult search(ProductFilterDto filter, Pageable pageable) {
        // Получаем товары
        Specification<Product> spec = buildSpec(filter);
        Page<Product> page = productRepository.findAll(spec, pageable);

        // Считаем фасеты (каждый фасет исключает собственный фильтр)
        List<FacetItem> categories = productRepository
                .countByCategory(filter.getName(), filter.getBrand(),
                        filter.getMinPrice(), filter.getMaxPrice())
                .stream()
                .map(row -> new FacetItem((String) row[0], (Long) row[1]))
                .collect(Collectors.toList());

        List<FacetItem> brands = productRepository
                .countByBrand(filter.getName(), filter.getCategory(),
                        filter.getMinPrice(), filter.getMaxPrice())
                .stream()
                .map(row -> new FacetItem((String) row[0], (Long) row[1]))
                .collect(Collectors.toList());

        List<RangeFacetItem> priceRanges = productRepository
                .countByPriceRange(filter.getName(), filter.getCategory())
                .stream()
                .map(row -> new RangeFacetItem((String) row[0], null, null, ((Number) row[1]).longValue()))
                .collect(Collectors.toList());

        return FacetedSearchResult.builder()
                .products(page.getContent().stream().map(ProductDto::fromEntity).collect(Collectors.toList()))
                .totalCount(page.getTotalElements())
                .facets(Map.of("categories", categories, "brands", brands))
                .priceRanges(priceRanges)
                .build();
    }
}`,
      explanation: 'Фасетный поиск подсчитывает количество товаров по каждому значению фильтра. Ключевой принцип: при подсчёте фасета исключается собственный фильтр (категории считаются без фильтра категории), чтобы показать альтернативы. Range-фасеты используют CASE для группировки непрерывных значений (цена) в диапазоны.'
    },
    {
      id: 9,
      title: 'Задача: Парсинг фильтров из query параметров',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте кастомную аннотацию @Filter и FilterParser для автоматического парсинга фильтров из query string.',
      requirements: [
        'Кастомная аннотация @Filterable на полях DTO для указания фильтруемых полей',
        'HandlerMethodArgumentResolver для автоматического парсинга фильтров',
        'Поддержка операторов: eq, ne, gt, lt, gte, lte, like, in',
        'Формат: ?filter[status]=eq:ACTIVE&filter[price]=gte:100'
      ],
      expectedOutput: 'GET /api/products?filter[status]=eq:ACTIVE&filter[price]=gte:100&filter[name]=like:phone\n→ Автоматический парсинг в ProductFilter{status=ACTIVE, price>=100, name LIKE "%phone%"}\n\nGET /api/products?filter[category]=in:Electronics,Gaming\n→ ProductFilter{category IN ("Electronics", "Gaming")}',
      hint: 'Создайте HandlerMethodArgumentResolver и зарегистрируйте через WebMvcConfigurer.addArgumentResolvers(). Используйте request.getParameterMap() для извлечения filter[field] параметров.',
      solution: `// --- @Filterable annotation ---
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Filterable {
    String field() default "";
    FilterOperation[] operations() default {FilterOperation.EQUAL};
}

public enum FilterOperation {
    EQUAL("eq"), NOT_EQUAL("ne"), GREATER_THAN("gt"), LESS_THAN("lt"),
    GREATER_THAN_OR_EQUAL("gte"), LESS_THAN_OR_EQUAL("lte"),
    LIKE("like"), IN("in");

    private final String code;
    FilterOperation(String code) { this.code = code; }

    public static FilterOperation fromCode(String code) {
        return Arrays.stream(values())
                .filter(op -> op.code.equals(code))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unknown operation: " + code));
    }
}

// --- Filter DTO ---
@Data
public class ProductFilter {
    @Filterable(operations = {FilterOperation.EQUAL, FilterOperation.IN})
    private String category;

    @Filterable(field = "price", operations = {
            FilterOperation.GREATER_THAN_OR_EQUAL, FilterOperation.LESS_THAN_OR_EQUAL})
    private BigDecimal price;

    @Filterable(operations = {FilterOperation.LIKE})
    private String name;

    @Filterable(operations = {FilterOperation.EQUAL})
    private String status;
}

// --- FilterArgumentResolver ---
@Component
public class FilterArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(RequestFilter.class);
    }

    @Override
    public Specification<?> resolveArgument(MethodParameter parameter,
                                             ModelAndViewContainer mavContainer,
                                             NativeWebRequest webRequest,
                                             WebDataBinderFactory binderFactory) {

        HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);
        Map<String, String[]> params = request.getParameterMap();

        List<SearchCriteria> criteriaList = new ArrayList<>();

        params.forEach((key, values) -> {
            if (key.startsWith("filter[") && key.endsWith("]")) {
                String field = key.substring(7, key.length() - 1);
                String value = values[0];

                String[] parts = value.split(":", 2);
                if (parts.length == 2) {
                    FilterOperation op = FilterOperation.fromCode(parts[0]);
                    String val = parts[1];

                    if (op == FilterOperation.IN) {
                        criteriaList.add(new SearchCriteria(
                                field, SearchOperation.IN, Arrays.asList(val.split(","))));
                    } else {
                        criteriaList.add(new SearchCriteria(
                                field, toSearchOperation(op), parseValue(val), null));
                    }
                }
            }
        });

        if (criteriaList.isEmpty()) return null;

        SpecificationBuilder<Object> builder = new SpecificationBuilder<>();
        criteriaList.forEach(c -> builder.with(c.getKey(), c.getOperation(), c.getValue()));
        return builder.build();
    }
}

// --- WebConfig ---
@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final FilterArgumentResolver filterArgumentResolver;

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(filterArgumentResolver);
    }
}

// --- Controller ---
@GetMapping
public ResponseEntity<Page<ProductDto>> findAll(
        @RequestFilter Specification<Product> filter,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {

    Pageable pageable = PageRequest.of(page, size);
    Page<Product> products = productRepository.findAll(
            filter != null ? filter : Specification.where(null), pageable);
    return ResponseEntity.ok(products.map(ProductDto::fromEntity));
}`,
      explanation: 'HandlerMethodArgumentResolver перехватывает параметры вида filter[field]=op:value и автоматически строит JPA Specification. @Filterable аннотация определяет допустимые операции для каждого поля. Формат filter[status]=eq:ACTIVE интуитивен для клиентов. Resolver регистрируется через WebMvcConfigurer и работает со всеми контроллерами.'
    },
    {
      id: 10,
      title: 'Задача: Подсветка результатов поиска',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте подсветку (highlighting) найденных совпадений в результатах поиска, оборачивая совпадения в HTML-теги.',
      requirements: [
        'Оборачивание совпадающего текста в <em> теги для клиентской подсветки',
        'Поддержка подсветки в нескольких полях (title, description)',
        'Контекстные сниппеты: показ фрагмента текста вокруг совпадения',
        'PostgreSQL ts_headline для серверной подсветки'
      ],
      expectedOutput: 'GET /api/articles/search?q=spring boot\n→ [{\n  "title": "Введение в <em>Spring Boot</em>",\n  "snippet": "...фреймворк <em>Spring Boot</em> позволяет быстро создавать..."\n}]\n\nGET /api/articles/search?q=security&highlight=true\n→ [{\n  "title": "<em>Security</em> в Spring",\n  "snippet": "Настройка <em>Security</em> для REST API..."\n}]',
      hint: 'Используйте PostgreSQL функцию ts_headline(config, document, query, options) для серверной подсветки. Опции: StartSel, StopSel, MaxFragments, MaxWords.',
      solution: `// --- Repository с подсветкой ---
public interface ArticleRepository extends JpaRepository<Article, Long> {

    @Query(value = """
            SELECT a.id, a.title,
                ts_headline('russian', a.title, plainto_tsquery('russian', :query),
                    'StartSel=<em>, StopSel=</em>, MaxWords=50') AS highlighted_title,
                ts_headline('russian', a.content, plainto_tsquery('russian', :query),
                    'StartSel=<em>, StopSel=</em>, MaxFragments=3, MaxWords=30, MinWords=10')
                    AS snippet,
                ts_rank(to_tsvector('russian', a.title || ' ' || a.content),
                    plainto_tsquery('russian', :query)) AS rank
            FROM articles a
            WHERE to_tsvector('russian', a.title || ' ' || a.content)
                @@ plainto_tsquery('russian', :query)
            ORDER BY rank DESC
            LIMIT :limit OFFSET :offset
            """, nativeQuery = true)
    List<Object[]> searchWithHighlighting(@Param("query") String query,
                                           @Param("limit") int limit,
                                           @Param("offset") int offset);
}

// --- Highlighting DTO ---
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SearchHit {
    private Long id;
    private String title;
    private String highlightedTitle;
    private String snippet;
    private double score;
}

// --- Highlighting Service ---
@Service
@RequiredArgsConstructor
public class SearchHighlightService {

    private final ArticleRepository articleRepository;

    public List<SearchHit> searchWithHighlighting(String query, int page, int size) {
        List<Object[]> results = articleRepository.searchWithHighlighting(
                query, size, page * size);

        return results.stream()
                .map(row -> SearchHit.builder()
                        .id(((Number) row[0]).longValue())
                        .title((String) row[1])
                        .highlightedTitle((String) row[2])
                        .snippet((String) row[3])
                        .score(((Number) row[4]).doubleValue())
                        .build())
                .collect(Collectors.toList());
    }

    // Java-based highlighting (без зависимости от БД)
    public String highlight(String text, String query, String startTag, String endTag) {
        if (text == null || query == null) return text;

        String[] words = query.toLowerCase().split("\\\\s+");
        String result = text;

        for (String word : words) {
            result = result.replaceAll(
                    "(?i)(" + Pattern.quote(word) + ")",
                    startTag + "$1" + endTag);
        }

        return result;
    }

    public String createSnippet(String text, String query, int contextWords) {
        if (text == null || query == null) return null;

        String lowerText = text.toLowerCase();
        String lowerQuery = query.toLowerCase().split("\\\\s+")[0];
        int index = lowerText.indexOf(lowerQuery);

        if (index == -1) return text.substring(0, Math.min(text.length(), 200)) + "...";

        String[] words = text.split("\\\\s+");
        int wordIndex = 0;
        int charCount = 0;

        for (int i = 0; i < words.length; i++) {
            charCount += words[i].length() + 1;
            if (charCount > index) {
                wordIndex = i;
                break;
            }
        }

        int start = Math.max(0, wordIndex - contextWords);
        int end = Math.min(words.length, wordIndex + contextWords + 1);

        String snippet = String.join(" ", Arrays.copyOfRange(words, start, end));
        snippet = highlight(snippet, query, "<em>", "</em>");

        return (start > 0 ? "..." : "") + snippet + (end < words.length ? "..." : "");
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleSearchController {

    private final SearchHighlightService highlightService;

    @GetMapping("/search")
    public ResponseEntity<List<SearchHit>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(highlightService.searchWithHighlighting(q, page, size));
    }
}`,
      explanation: 'PostgreSQL ts_headline автоматически оборачивает совпадения в StartSel/StopSel теги. MaxFragments определяет количество фрагментов, MaxWords/MinWords — размер каждого фрагмента. Java-based highlighting через regex даёт контроль над процессом без зависимости от СУБД. Сниппеты показывают контекст вокруг совпадения.'
    }
  ]
}
