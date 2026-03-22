export default {
  id: 31,
  title: 'Практикум: полноценный REST API',
  description: 'Серия практических задач для самостоятельного построения REST API блог-платформы с нуля: CRUD, поиск, теги, комментарии и публикация',
  lessons: [
    {
      id: 1,
      title: 'Задача: структура проекта и модели',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте основу блог-платформы: настройте Spring Boot проект, создайте Entity классы для Post, Tag, Comment и настройте PostgreSQL.',
      requirements: [
        'Создай Spring Boot проект с зависимостями: web, data-jpa, postgresql, validation',
        'Сущность Post: id, title, content, summary, authorId, status (DRAFT/PUBLISHED), createdAt, updatedAt',
        'Сущность Tag: id, name (unique)',
        'Сущность Comment: id, postId, authorId, content, createdAt',
        'Post имеет @ManyToMany с Tag',
        'Настрой DataSource для PostgreSQL через application.properties',
        'spring.jpa.hibernate.ddl-auto=create-drop для разработки'
      ],
      hint: 'Используй @ManyToMany с @JoinTable для связи Post-Tag. @CreationTimestamp и @UpdateTimestamp автоматически заполняют даты.',
      solution: '@Entity @Table(name = "posts")\npublic class Post {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    @NotBlank @Size(max = 255) private String title;\n    @NotBlank @Column(columnDefinition = "TEXT") private String content;\n    private String summary;\n    private Long authorId;\n    @Enumerated(EnumType.STRING) private PostStatus status = PostStatus.DRAFT;\n    @ManyToMany @JoinTable(name = "post_tags",\n        joinColumns = @JoinColumn(name = "post_id"),\n        inverseJoinColumns = @JoinColumn(name = "tag_id"))\n    private Set<Tag> tags = new HashSet<>();\n    @CreationTimestamp private LocalDateTime createdAt;\n    @UpdateTimestamp private LocalDateTime updatedAt;\n}\n\npublic enum PostStatus { DRAFT, PUBLISHED }\n\n@Entity @Table(name = "tags")\npublic class Tag {\n    @Id @GeneratedValue private Long id;\n    @Column(unique = true) private String name;\n}\n\n@Entity @Table(name = "comments")\npublic class Comment {\n    @Id @GeneratedValue private Long id;\n    private Long postId;\n    private Long authorId;\n    @Column(columnDefinition = "TEXT") private String content;\n    @CreationTimestamp private LocalDateTime createdAt;\n}',
      explanation: '@Enumerated(STRING) хранит статус как строку в БД. @ManyToMany создаёт промежуточную таблицу. Set вместо List для тегов предотвращает дублирование.'
    },
    {
      id: 2,
      title: 'Задача: Repository и Service слой',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте репозитории и сервисный слой для Post с пользовательскими запросами.',
      requirements: [
        'PostRepository extends JpaRepository<Post, Long>',
        'Метод: Page<Post> findByStatus(PostStatus status, Pageable pageable)',
        'Метод: Page<Post> findByTitleContainingIgnoreCase(String title, Pageable pageable)',
        'Метод: @Query поиск опубликованных постов по тегу',
        'PostService: createPost, publishPost, updatePost, deletePost, findById',
        'publishPost меняет статус на PUBLISHED и устанавливает дату публикации',
        'Если пост не найден — бросать PostNotFoundException (extends RuntimeException)'
      ],
      hint: '@Query("SELECT p FROM Post p JOIN p.tags t WHERE t.name = :tagName AND p.status = PUBLISHED") Page<Post> findByTag(@Param("tagName") String tag, Pageable pageable)',
      solution: 'public interface PostRepository extends JpaRepository<Post, Long> {\n    Page<Post> findByStatus(PostStatus status, Pageable pageable);\n    Page<Post> findByTitleContainingIgnoreCaseAndStatus(String title, PostStatus status, Pageable pageable);\n\n    @Query("SELECT p FROM Post p JOIN p.tags t WHERE t.name = :tag AND p.status = "PUBLISHED"")\n    Page<Post> findByTagName(@Param("tag") String tag, Pageable pageable);\n}\n\n@Service @Transactional\npublic class PostService {\n    @Autowired PostRepository repo;\n\n    public Post findById(Long id) {\n        return repo.findById(id).orElseThrow(() -> new PostNotFoundException(id));\n    }\n\n    public Post create(CreatePostRequest req, Long authorId) {\n        Post post = new Post();\n        post.setTitle(req.getTitle());\n        post.setContent(req.getContent());\n        post.setAuthorId(authorId);\n        return repo.save(post);\n    }\n\n    public Post publish(Long id) {\n        Post post = findById(id);\n        post.setStatus(PostStatus.PUBLISHED);\n        return repo.save(post);\n    }\n}',
      explanation: '@Transactional на сервисе оборачивает каждый метод в транзакцию. Кастомное исключение PostNotFoundException позволяет GlobalExceptionHandler вернуть 404.'
    },
    {
      id: 3,
      title: 'Задача: PostController с CRUD',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте полный CRUD контроллер для постов с пагинацией и поиском.',
      requirements: [
        'GET /api/posts?page=0&size=10 — список опубликованных постов',
        'GET /api/posts/search?q=spring&page=0 — поиск по названию',
        'GET /api/posts/tag/{tagName} — посты по тегу',
        'GET /api/posts/{id} — конкретный пост',
        'POST /api/posts — создать черновик',
        'PUT /api/posts/{id} — обновить пост',
        'POST /api/posts/{id}/publish — опубликовать',
        'DELETE /api/posts/{id} — удалить'
      ],
      hint: 'Возвращай PostResponse DTO (не Entity). Для публикации используй отдельный endpoint /publish — это семантически правильнее чем PUT с полем status.',
      solution: '@RestController @RequestMapping("/api/posts") @Slf4j\npublic class PostController {\n    @Autowired PostService service;\n\n    @GetMapping\n    public Page<PostResponse> getPublished(\n        @RequestParam(defaultValue = "0") int page,\n        @RequestParam(defaultValue = "10") int size) {\n        return service.findPublished(PageRequest.of(page, size)).map(PostResponse::from);\n    }\n\n    @GetMapping("/search")\n    public Page<PostResponse> search(@RequestParam String q,\n        @RequestParam(defaultValue = "0") int page) {\n        return service.search(q, PageRequest.of(page, 10)).map(PostResponse::from);\n    }\n\n    @GetMapping("/{id}")\n    public PostResponse getById(@PathVariable Long id) {\n        return PostResponse.from(service.findById(id));\n    }\n\n    @PostMapping @ResponseStatus(HttpStatus.CREATED)\n    public PostResponse create(@Valid @RequestBody CreatePostRequest req) {\n        return PostResponse.from(service.create(req, getCurrentUserId()));\n    }\n\n    @PostMapping("/{id}/publish")\n    public PostResponse publish(@PathVariable Long id) {\n        return PostResponse.from(service.publish(id));\n    }\n\n    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)\n    public void delete(@PathVariable Long id) { service.delete(id); }\n}',
      explanation: 'Отдельный /publish endpoint лучше чем передавать status в PUT — это RESTful действие. Page<PostResponse> автоматически сериализуется в JSON с метаданными пагинации.'
    },
    {
      id: 4,
      title: 'Задача: система тегов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте управление тегами: создание тегов, добавление к постам, удаление, получение облака тегов.',
      requirements: [
        'GET /api/tags — все теги',
        'GET /api/tags/cloud — облако тегов (название + количество постов)',
        'POST /api/tags — создать тег',
        'POST /api/posts/{id}/tags — добавить теги к посту (список имён)',
        'DELETE /api/posts/{id}/tags/{tagId} — убрать тег у поста',
        'При создании поста — создавать несуществующие теги автоматически',
        'TagCloudItem: record с полями name, postCount'
      ],
      hint: 'Для облака тегов: @Query("SELECT t.name, COUNT(p) FROM Tag t JOIN t.posts p GROUP BY t.name ORDER BY COUNT(p) DESC"). Используй findByNameOrCreate паттерн.',
      solution: '@Service @Transactional\npublic class TagService {\n    @Autowired TagRepository tagRepo;\n\n    public Tag findOrCreate(String name) {\n        return tagRepo.findByName(name.toLowerCase())\n            .orElseGet(() -> tagRepo.save(new Tag(name.toLowerCase())));\n    }\n\n    public List<TagCloudItem> getCloud() {\n        return tagRepo.findTagCloud();\n    }\n}\n\n// PostService\npublic Post addTags(Long postId, List<String> tagNames) {\n    Post post = findById(postId);\n    tagNames.stream()\n        .map(tagService::findOrCreate)\n        .forEach(post.getTags()::add);\n    return repo.save(post);\n}\n\n// TagRepository\n@Query("SELECT new com.example.TagCloudItem(t.name, COUNT(p)) FROM Tag t JOIN t.posts p GROUP BY t.name")\nList<TagCloudItem> findTagCloud();\n\npublic record TagCloudItem(String name, Long postCount) {}',
      explanation: 'findOrCreate паттерн (findByName или create) — идемпотентная операция. @Query с new создаёт DTO прямо в JPQL запросе для оптимальной выборки данных.'
    },
    {
      id: 5,
      title: 'Задача: комментарии с вложенностью',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте систему комментариев: добавление к посту, получение дерева комментариев, удаление.',
      requirements: [
        'GET /api/posts/{id}/comments — все комментарии поста',
        'POST /api/posts/{id}/comments — добавить комментарий',
        'DELETE /api/comments/{id} — удалить комментарий (автор или администратор)',
        'Comment может иметь parentId для вложенных ответов',
        'CommentResponse включает: id, content, authorId, createdAt, replies (список вложенных)',
        'Используй @EntityGraph для загрузки комментариев с ответами одним запросом'
      ],
      hint: 'Для дерева комментариев: загрузи все комментарии поста, потом группируй в Java: корневые (parentId=null) + добавляй replies. Не делай рекурсивные запросы к БД.',
      solution: '@Entity\npublic class Comment {\n    @Id @GeneratedValue private Long id;\n    private Long postId;\n    private Long authorId;\n    private Long parentId;  // null для корневых комментариев\n    private String content;\n    @CreationTimestamp private LocalDateTime createdAt;\n}\n\n@Service\npublic class CommentService {\n    public List<CommentResponse> getCommentTree(Long postId) {\n        List<Comment> all = repo.findByPostIdOrderByCreatedAt(postId);\n        Map<Long, CommentResponse> map = new LinkedHashMap<>();\n        List<CommentResponse> roots = new ArrayList<>();\n\n        for (Comment c : all) {\n            CommentResponse r = CommentResponse.from(c);\n            map.put(c.getId(), r);\n            if (c.getParentId() == null) {\n                roots.add(r);\n            } else {\n                CommentResponse parent = map.get(c.getParentId());\n                if (parent != null) parent.getReplies().add(r);\n            }\n        }\n        return roots;\n    }\n}',
      explanation: 'Строить дерево в Java из flat-списка эффективнее чем рекурсивные SQL запросы. LinkedHashMap сохраняет порядок вставки. Один SQL запрос + O(n) обработка в памяти.'
    },
    {
      id: 6,
      title: 'Задача: Full-text поиск с Hibernate Search',
      type: 'practice',
      difficulty: 'hard',
      description: 'Добавьте полнотекстовый поиск по постам используя PostgreSQL full-text search через нативный запрос.',
      requirements: [
        'Добавь индекс GIN на tsvector колонку в PostgreSQL',
        'Нативный @Query с to_tsvector и plainto_tsquery',
        'GET /api/posts/fulltext?q=spring+boot — полнотекстовый поиск',
        'Результаты ранжировать по релевантности через ts_rank',
        'Поддержка русского языка: конфигурация "russian" для tsvector',
        'Возвращать postId, title, snippet (часть текста с совпадением)'
      ],
      hint: 'SELECT p.id, p.title, ts_headline("russian", p.content, query) as snippet FROM posts p, plainto_tsquery("russian", :query) query WHERE to_tsvector("russian", p.title || " " || p.content) @@ query ORDER BY ts_rank(...) DESC',
      solution: 'public interface PostRepository extends JpaRepository<Post, Long> {\n\n    @Query(value = "SELECT p.id, p.title, " +\n        "ts_headline(\'russian\', p.content, plainto_tsquery(\'russian\', :query), " +\n        "\'MaxWords=20,MinWords=10\') as snippet, " +\n        "ts_rank(to_tsvector(\'russian\', p.title || \' \' || p.content), " +\n        "plainto_tsquery(\'russian\', :query)) as rank " +\n        "FROM posts p " +\n        "WHERE to_tsvector(\'russian\', p.title || \' \' || p.content) @@ plainto_tsquery(\'russian\', :query) " +\n        "AND p.status = \'PUBLISHED\' " +\n        "ORDER BY rank DESC " +\n        "LIMIT :limit OFFSET :offset",\n        nativeQuery = true)\n    List<Object[]> fullTextSearch(@Param("query") String query,\n        @Param("limit") int limit, @Param("offset") int offset);\n}',
      explanation: 'PostgreSQL full-text search эффективнее LIKE для русского текста. ts_headline генерирует сниппет с выделенными совпадениями. GIN индекс ускоряет поиск на больших таблицах.'
    },
    {
      id: 7,
      title: 'Задача: Rate Limiting для публичного API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Добавьте ограничение частоты запросов для публичного API: не более 100 запросов в минуту с одного IP адреса, с использованием Redis для счётчиков.',
      requirements: [
        'RateLimitFilter — OncePerRequestFilter',
        'Ключ: "rate_limit:" + IP адрес',
        'Redis INCR + EXPIRE для счётчика',
        'При превышении лимита — 429 Too Many Requests с заголовком Retry-After',
        'Исключить /actuator/** из rate limiting',
        'Добавить заголовки X-Rate-Limit-Limit и X-Rate-Limit-Remaining в ответ',
        'Лимит настраивается через @ConfigurationProperties'
      ],
      hint: 'Используй StringRedisTemplate.execute() для атомарного INCR+EXPIRE. RedisTemplate.opsForValue().increment() возвращает новое значение.',
      solution: '@Component\npublic class RateLimitFilter extends OncePerRequestFilter {\n    @Autowired StringRedisTemplate redis;\n    @Value("${app.ratelimit.requests:100}") int limit;\n    @Value("${app.ratelimit.window:60}") int windowSec;\n\n    @Override\n    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,\n                                    FilterChain chain) throws IOException, ServletException {\n        if (req.getRequestURI().startsWith("/actuator")) {\n            chain.doFilter(req, res); return;\n        }\n        String ip = req.getRemoteAddr();\n        String key = "rate_limit:" + ip;\n        Long count = redis.opsForValue().increment(key);\n        if (count == 1) redis.expire(key, Duration.ofSeconds(windowSec));\n\n        res.setHeader("X-Rate-Limit-Limit", String.valueOf(limit));\n        res.setHeader("X-Rate-Limit-Remaining", String.valueOf(Math.max(0, limit - count)));\n\n        if (count > limit) {\n            res.setStatus(429);\n            res.setHeader("Retry-After", String.valueOf(windowSec));\n            res.getWriter().write("{\"error\":\"Превышен лимит запросов\"}");\n            return;\n        }\n        chain.doFilter(req, res);\n    }\n}',
      explanation: 'Redis INCR атомарен — нет race condition. EXPIRE устанавливается только при первом запросе (count == 1). Заголовки X-Rate-Limit-* — стандарт информирования клиентов о лимитах.'
    },
    {
      id: 8,
      title: 'Задача: Аудит изменений с @EntityListeners',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте аудит изменений постов: сохраняйте каждое изменение в PostAudit таблицу с информацией кто, когда и что изменил.',
      requirements: [
        'Сущность PostAudit: id, postId, userId, action (CREATE/UPDATE/DELETE), timestamp, oldValue (JSON), newValue (JSON)',
        'AuditListener — @EntityListeners класс с @PreUpdate, @PostPersist, @PreRemove',
        'Сериализация старого и нового значения в JSON через ObjectMapper',
        'GET /api/posts/{id}/audit — история изменений поста',
        'AuditService.getCurrentUserId() из SecurityContext',
        'Сохранение аудита через отдельную транзакцию (@Transactional(REQUIRES_NEW))'
      ],
      hint: '@Transactional(propagation = REQUIRES_NEW) для AuditService гарантирует сохранение аудита даже если основная транзакция откатится.',
      solution: '@Entity\npublic class PostAudit {\n    @Id @GeneratedValue private Long id;\n    private Long postId;\n    private Long userId;\n    @Enumerated(EnumType.STRING) private AuditAction action;\n    private LocalDateTime timestamp;\n    @Column(columnDefinition = "TEXT") private String oldValue;\n    @Column(columnDefinition = "TEXT") private String newValue;\n}\n\n@Component\npublic class PostAuditListener {\n    @Autowired PostAuditRepository auditRepo;\n    @Autowired ObjectMapper mapper;\n\n    @PostPersist\n    public void onSave(Post post) { saveAudit(post.getId(), AuditAction.CREATE, null, post); }\n\n    @PreUpdate\n    public void onUpdate(Post post) { /* загрузить old value из БД и сохранить */ }\n\n    private void saveAudit(Long postId, AuditAction action, Post old, Post newPost) {\n        PostAudit audit = new PostAudit();\n        audit.setPostId(postId);\n        audit.setAction(action);\n        audit.setTimestamp(LocalDateTime.now());\n        try {\n            if (old != null) audit.setOldValue(mapper.writeValueAsString(old));\n            if (newPost != null) audit.setNewValue(mapper.writeValueAsString(newPost));\n        } catch (Exception ignored) {}\n        auditRepo.save(audit);\n    }\n}',
      explanation: '@EntityListeners позволяет отреагировать на JPA события без изменения Entity. @Transactional(REQUIRES_NEW) создаёт отдельную транзакцию — аудит сохраняется даже при откате основной.'
    },
    {
      id: 9,
      title: 'Задача: кеширование с инвалидацией',
      type: 'practice',
      difficulty: 'medium',
      description: 'Добавьте Redis кеширование для публичного API: кешировать опубликованные посты, инвалидировать при изменениях.',
      requirements: [
        'Кешировать findById() через @Cacheable(value = "posts", key = "#id")',
        'Кешировать findPublished() через @Cacheable(value = "posts-page", key = "#pageable.pageNumber + \'-\' + #pageable.pageSize")',
        'При publish() и update() — @CacheEvict для конкретного поста',
        'При delete() — очищать весь кеш posts',
        'TTL для "posts" кеша — 30 минут, для "posts-page" — 5 минут',
        'Настроить RedisCacheManager через @Bean'
      ],
      hint: 'allEntries = true в @CacheEvict очищает весь кеш. Для "posts-page" при любом изменении инвалидируй весь кеш так как пагинация зависит от данных.',
      solution: '@Service @CacheConfig(cacheNames = "posts")\npublic class PostService {\n\n    @Cacheable(key = "#id")\n    public Post findById(Long id) {\n        return repo.findById(id).orElseThrow(() -> new PostNotFoundException(id));\n    }\n\n    @Cacheable(value = "posts-page", key = "#p.pageNumber + \'-\' + #p.pageSize")\n    public Page<Post> findPublished(Pageable p) {\n        return repo.findByStatus(PostStatus.PUBLISHED, p);\n    }\n\n    @Caching(evict = {\n        @CacheEvict(key = "#id"),\n        @CacheEvict(value = "posts-page", allEntries = true)\n    })\n    public Post publish(Long id) {\n        Post post = findById(id);\n        post.setStatus(PostStatus.PUBLISHED);\n        return repo.save(post);\n    }\n\n    @Caching(evict = {\n        @CacheEvict(key = "#id"),\n        @CacheEvict(value = "posts-page", allEntries = true)\n    })\n    public void delete(Long id) { repo.deleteById(id); }\n}',
      explanation: '@CacheConfig на классе устанавливает default cache name. @Caching объединяет несколько операций с кешем. При publish/delete инвалидируем оба кеша: конкретный пост и все страницы.'
    },
    {
      id: 10,
      title: 'Задача: интеграционные тесты всего API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите полный набор интеграционных тестов для блог-API используя Testcontainers с реальной PostgreSQL.',
      requirements: [
        'AbstractBlogIT — базовый класс с PostgreSQL и Redis контейнерами',
        'PostControllerIT — тест создания, публикации, поиска постов',
        'Тест пагинации: создать 15 постов, запросить страницу 2 по 10',
        'Тест 404 при запросе несуществующего поста',
        'Тест добавления тегов к посту',
        'Тест что черновик не отображается в публичном API',
        'CommentControllerIT — тест добавления и получения дерева комментариев',
        'Использовать @BeforeEach для создания тестовых данных'
      ],
      hint: 'Используй TestRestTemplate для HTTP запросов. Создавай тестовые данные через репозиторий напрямую в @BeforeEach для скорости.',
      solution: '@SpringBootTest(webEnvironment = RANDOM_PORT)\n@Testcontainers\nclass PostControllerIT extends AbstractBlogIT {\n    @Autowired TestRestTemplate rest;\n    @Autowired PostRepository postRepo;\n    @Autowired TagRepository tagRepo;\n\n    @BeforeEach void clean() { postRepo.deleteAll(); tagRepo.deleteAll(); }\n\n    @Test\n    void createAndPublishPost() {\n        var req = new CreatePostRequest("Заголовок", "Контент");\n        var created = rest.postForEntity("/api/posts", req, PostResponse.class);\n        assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);\n\n        Long id = created.getBody().getId();\n        rest.postForEntity("/api/posts/" + id + "/publish", null, PostResponse.class);\n\n        var found = rest.getForObject("/api/posts/" + id, PostResponse.class);\n        assertThat(found.getStatus()).isEqualTo("PUBLISHED");\n    }\n\n    @Test\n    void draftNotVisibleInPublicList() {\n        postRepo.save(new Post("Черновик", "Контент", PostStatus.DRAFT));\n        var page = rest.getForObject("/api/posts", PageImpl.class);\n        assertThat(page.getTotalElements()).isEqualTo(0);\n    }\n}',
      explanation: 'Testcontainers с реальной PostgreSQL гарантирует тесты, идентичные продакшену. @BeforeEach с deleteAll() изолирует тесты. TestRestTemplate делает настоящие HTTP запросы к запущенному серверу.'
    }
  ]
}
