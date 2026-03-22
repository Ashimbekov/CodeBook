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
      expectedOutput: 'Приложение запускается с ddl-auto=create-drop.\nHibernate создаёт таблицы:\nCREATE TABLE posts (id BIGSERIAL, title VARCHAR(255), content TEXT, status VARCHAR(20), author_id BIGINT, created_at TIMESTAMP, updated_at TIMESTAMP)\nCREATE TABLE tags (id BIGSERIAL, name VARCHAR(255) UNIQUE)\nCREATE TABLE comments (id BIGSERIAL, post_id BIGINT, author_id BIGINT, content TEXT, created_at TIMESTAMP)\nCREATE TABLE post_tags (post_id BIGINT, tag_id BIGINT)\n\nINFO  Started Application in 3.5 seconds',
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
      expectedOutput: 'PostRepository содержит следующие методы:\n- findByStatus(PUBLISHED, pageable) — использует индекс по status\n- findByTitleContainingIgnoreCaseAndStatus(q, PUBLISHED, pageable) — поиск по заголовку\n- findByTagName(tag, pageable) — кастомный @Query с JOIN\n\npostService.create(req, authorId=1) — сохраняет пост со статусом DRAFT\npostService.findById(99) бросает PostNotFoundException: "Пост с id 99 не найден"\n\npostService.publish(1) — меняет статус на PUBLISHED\nSELECT * FROM posts WHERE id=1 FOR UPDATE\nUPDATE posts SET status=\'PUBLISHED\' WHERE id=1',
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
      expectedOutput: 'GET /api/posts?page=0&size=10:\n{"content":[{"id":1,"title":"Spring Boot Guide","status":"PUBLISHED"}],"totalElements":1,"totalPages":1}\n\nGET /api/posts/search?q=spring:\n{"content":[{"id":1,"title":"Spring Boot Guide"}],"totalElements":1}\n\nGET /api/posts/tag/java:\n{"content":[{"id":2,"title":"Java 21 features"}],"totalElements":1}\n\nPOST /api/posts {"title":"Новый пост","content":"Содержание"}:\nHTTP 201 Created\n{"id":3,"title":"Новый пост","status":"DRAFT"}\n\nPOST /api/posts/3/publish:\nHTTP 200 OK\n{"id":3,"title":"Новый пост","status":"PUBLISHED"}\n\nGET /api/posts/99:\nHTTP 404 Not Found\n{"error":"Пост с id 99 не найден"}',
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
      expectedOutput: 'GET /api/tags:\n[{"id":1,"name":"spring"},{"id":2,"name":"java"},{"id":3,"name":"docker"}]\n\nGET /api/tags/cloud:\n[{"name":"spring","postCount":15},{"name":"java","postCount":10},{"name":"docker","postCount":5}]\n\nPOST /api/posts/1/tags {"tags":["spring","новый-тег"]}:\n- Тег "spring" найден в БД и привязан.\n- Тег "новый-тег" не найден — создан автоматически.\nHTTP 200 OK\n{"id":1,"title":"Spring Guide","tags":["spring","новый-тег"]}\n\nDELETE /api/posts/1/tags/2:\nHTTP 204 No Content\nТег java удалён у поста 1.',
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
      expectedOutput: 'GET /api/posts/1/comments:\n[\n  {\n    "id": 1,\n    "content": "Отличная статья!",\n    "authorId": 2,\n    "createdAt": "2026-03-21T10:00:00",\n    "replies": [\n      {\n        "id": 3,\n        "content": "Согласен!",\n        "authorId": 3,\n        "replies": []\n      }\n    ]\n  },\n  {\n    "id": 2,\n    "content": "Спасибо за разъяснение.",\n    "authorId": 4,\n    "replies": []\n  }\n]\n\nPOST /api/posts/1/comments {"content":"Мой комментарий"}:\nHTTP 201 Created\n{"id":5,"content":"Мой комментарий","createdAt":"2026-03-21T10:05:00","replies":[]}\n\nDELETE /api/comments/1 (другой пользователь без ADMIN):\nHTTP 403 Forbidden',
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
      expectedOutput: 'GET /api/posts/fulltext?q=spring+boot:\n[\n  {\n    "id": 1,\n    "title": "Введение в Spring Boot",\n    "snippet": "...изучим как работает <b>Spring</b> <b>Boot</b> и его автоконфигурацию..."\n  },\n  {\n    "id": 5,\n    "title": "Spring Boot Security",\n    "snippet": "...настройка безопасности в <b>Spring</b> <b>Boot</b> приложениях..."\n  }\n]\n\nGET /api/posts/fulltext?q=микросервисы:\n[\n  {\n    "id": 8,\n    "title": "Архитектура микросервисов",\n    "snippet": "...разбиение на независимые <b>микросервисы</b>..."\n  }\n]\n\nБез результатов при несуществующем запросе:\n[]',
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
      expectedOutput: 'Первые 100 запросов с IP 192.168.1.1:\nHTTP 200 OK\nX-Rate-Limit-Limit: 100\nX-Rate-Limit-Remaining: 99\n\nПосле 100 запросов:\nX-Rate-Limit-Remaining: 0\n\n101-й запрос:\nHTTP 429 Too Many Requests\nRetry-After: 60\nX-Rate-Limit-Limit: 100\nX-Rate-Limit-Remaining: 0\n{"error":"Превышен лимит запросов"}\n\nЧерез 60 секунд ключ в Redis истекает, счётчик сбрасывается.\nСледующий запрос:\nHTTP 200 OK\nX-Rate-Limit-Remaining: 99\n\nGET /actuator/health (исключён из rate limiting):\nHTTP 200 OK без заголовков X-Rate-Limit',
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
      expectedOutput: 'При создании поста id=10:\nINSERT INTO post_audit (post_id, action, new_value, timestamp) VALUES (10, "CREATE", {...}, NOW())\n\nПри обновлении поста id=10:\nINSERT INTO post_audit (post_id, action, old_value, new_value, timestamp) VALUES (10, "UPDATE", {...}, {...}, NOW())\n\nGET /api/posts/10/audit:\n[\n  {"id":1,"postId":10,"action":"CREATE","timestamp":"2026-03-21T09:00:00","oldValue":null,"newValue":{"title":"Первый вариант"}},\n  {"id":2,"postId":10,"action":"UPDATE","timestamp":"2026-03-21T10:00:00","oldValue":{"title":"Первый вариант"},"newValue":{"title":"Второй вариант"}}\n]\n\nЕсли основная транзакция откатилась — аудит всё равно сохранён (REQUIRES_NEW).',
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
      expectedOutput: 'Первый GET /api/posts/1:\nSELECT * FROM posts WHERE id=1  -- запрос к БД\nCachePut: posts[key=1]\n\nВторой GET /api/posts/1:\nCache hit: posts[key=1] — запрос к БД не выполняется\n\nPOST /api/posts/1/publish:\nCacheEvict: posts[key=1]\nCacheEvict: posts-page (allEntries=true)\n\nTретий GET /api/posts/1:\nSELECT * FROM posts WHERE id=1  -- снова запрос к БД\n\nGET /api/posts?page=0&size=10:\nSELECT * FROM posts WHERE status=\'PUBLISHED\' LIMIT 10\nCachePut: posts-page[key="0-10"]\n\nПовторный GET /api/posts?page=0&size=10:\nCache hit: posts-page[key="0-10"] — TTL 5 минут\n\nRedis: posts TTL=1800s, posts-page TTL=300s',
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
      expectedOutput: 'Testcontainers запускает PostgreSQL 15 и Redis 7.\n\nPostControllerIT:\n  createAndPublishPost() PASSED\n  draftNotVisibleInPublicList() PASSED\n  pagination_15posts_page2() PASSED\n  return404ForMissingPost() PASSED\n  addTagsToPost() PASSED\n\nCommentControllerIT:\n  addCommentToPost() PASSED\n  getCommentTree() PASSED\n\nTests run: 7, Failures: 0, Errors: 0, Skipped: 0\nTime: 12.5 seconds\n\nВ pagination тесте: создано 15 постов, запрошена страница 1 (вторая):\nresult.totalElements == 15\nresult.content.size() == 5\nresult.number == 1',
      solution: '@SpringBootTest(webEnvironment = RANDOM_PORT)\n@Testcontainers\nclass PostControllerIT extends AbstractBlogIT {\n    @Autowired TestRestTemplate rest;\n    @Autowired PostRepository postRepo;\n    @Autowired TagRepository tagRepo;\n\n    @BeforeEach void clean() { postRepo.deleteAll(); tagRepo.deleteAll(); }\n\n    @Test\n    void createAndPublishPost() {\n        var req = new CreatePostRequest("Заголовок", "Контент");\n        var created = rest.postForEntity("/api/posts", req, PostResponse.class);\n        assertThat(created.getStatusCode()).isEqualTo(HttpStatus.CREATED);\n\n        Long id = created.getBody().getId();\n        rest.postForEntity("/api/posts/" + id + "/publish", null, PostResponse.class);\n\n        var found = rest.getForObject("/api/posts/" + id, PostResponse.class);\n        assertThat(found.getStatus()).isEqualTo("PUBLISHED");\n    }\n\n    @Test\n    void draftNotVisibleInPublicList() {\n        postRepo.save(new Post("Черновик", "Контент", PostStatus.DRAFT));\n        var page = rest.getForObject("/api/posts", PageImpl.class);\n        assertThat(page.getTotalElements()).isEqualTo(0);\n    }\n}',
      explanation: 'Testcontainers с реальной PostgreSQL гарантирует тесты, идентичные продакшену. @BeforeEach с deleteAll() изолирует тесты. TestRestTemplate делает настоящие HTTP запросы к запущенному серверу.'
    }
  ]
}
