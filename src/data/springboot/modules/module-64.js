export default {
  id: 64,
  title: 'Практикум: Batch и расписание',
  description: 'Практические задачи по пакетной обработке и планированию задач в Spring Boot: @Scheduled, @Async, Spring Batch Jobs, ItemReader/Writer, параллельное выполнение и генерация отчётов.',
  lessons: [
    {
      id: 1,
      title: 'Задача: @Scheduled cron задачи',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте планирование задач с помощью @Scheduled: периодическая очистка, отправка отчётов и мониторинг.',
      requirements: [
        '@EnableScheduling и @Scheduled с fixedRate, fixedDelay, cron',
        'Cron-задача для ежедневной очистки устаревших данных (каждый день в 2:00)',
        'Периодическая проверка здоровья внешних сервисов (каждые 30 секунд)',
        'Еженедельная генерация отчёта (понедельник 9:00)'
      ],
      expectedOutput: '[fixedRate=30000] HealthCheck: PaymentService=UP, EmailService=UP\n[cron 0 0 2 * * *] Cleanup: Удалено 150 устаревших записей\n[cron 0 0 9 * * MON] Report: Еженедельный отчёт отправлен на admin@example.com\n\nGET /api/admin/scheduled-tasks → [{"name":"cleanup","lastRun":"...","nextRun":"...","status":"OK"}]',
      hint: 'Cron формат в Spring: "секунды минуты часы день месяц деньНедели". fixedRate — интервал между стартами, fixedDelay — интервал между завершением и следующим стартом.',
      solution: `// --- Application Config ---
@SpringBootApplication
@EnableScheduling
public class Application { }

// --- Scheduled Tasks ---
@Component
@Slf4j
@RequiredArgsConstructor
public class ScheduledTasks {

    private final DataCleanupService cleanupService;
    private final HealthCheckService healthCheckService;
    private final ReportService reportService;

    // Каждые 30 секунд — проверка здоровья
    @Scheduled(fixedRate = 30000)
    public void healthCheck() {
        Map<String, String> status = healthCheckService.checkAll();
        log.info("HealthCheck: {}", status);
    }

    // Каждый день в 2:00 — очистка
    @Scheduled(cron = "0 0 2 * * *")
    public void dailyCleanup() {
        int deleted = cleanupService.deleteExpiredRecords();
        log.info("Cleanup: Удалено {} устаревших записей", deleted);
    }

    // Каждый понедельник в 9:00 — отчёт
    @Scheduled(cron = "0 0 9 * * MON")
    public void weeklyReport() {
        reportService.generateAndSendWeeklyReport();
        log.info("Report: Еженедельный отчёт отправлен");
    }

    // Каждые 5 минут с задержкой старта 10 секунд
    @Scheduled(fixedDelay = 300000, initialDelay = 10000)
    public void processQueue() {
        int processed = cleanupService.processRetryQueue();
        log.info("Queue: Обработано {} сообщений из retry очереди", processed);
    }

    // Конфигурация из application.yml
    @Scheduled(cron = "\${scheduler.cleanup.cron:0 0 3 * * *}")
    public void configurableCleanup() {
        log.info("Configurable cleanup executed");
    }
}

// --- DataCleanupService ---
@Service
@RequiredArgsConstructor
@Transactional
public class DataCleanupService {

    private final SessionRepository sessionRepository;
    private final AuditLogRepository auditLogRepository;

    public int deleteExpiredRecords() {
        int expiredSessions = sessionRepository
                .deleteByExpiresAtBefore(LocalDateTime.now());

        int oldAuditLogs = auditLogRepository
                .deleteByCreatedAtBefore(LocalDateTime.now().minusDays(90));

        return expiredSessions + oldAuditLogs;
    }

    public int processRetryQueue() {
        // обработка очереди повторных попыток
        return 0;
    }
}

// --- Task Tracker ---
@Component
@Slf4j
public class ScheduledTaskTracker {

    private final Map<String, TaskExecutionInfo> taskHistory = new ConcurrentHashMap<>();

    public void recordExecution(String taskName, long durationMs, boolean success) {
        taskHistory.put(taskName, new TaskExecutionInfo(
                taskName, LocalDateTime.now(), durationMs, success));
    }

    public List<TaskExecutionInfo> getTaskHistory() {
        return new ArrayList<>(taskHistory.values());
    }
}`,
      explanation: '@Scheduled запускает метод по расписанию. fixedRate — фиксированный интервал между стартами (параллельные запуски возможны). fixedDelay — интервал после завершения. cron — POSIX-подобное выражение с 6 полями (включая секунды). initialDelay задаёт задержку первого запуска. Настройки из application.yml через SpEL позволяют менять расписание без пересборки.'
    },
    {
      id: 2,
      title: 'Задача: Асинхронное выполнение с @Async',
      type: 'practice',
      difficulty: 'easy',
      description: 'Настройте асинхронное выполнение задач с помощью @Async и кастомного ThreadPoolTaskExecutor.',
      requirements: [
        '@EnableAsync и кастомная конфигурация ThreadPoolTaskExecutor',
        '@Async метод для отправки email без блокировки основного потока',
        'CompletableFuture для асинхронных операций с возвратом результата',
        'Обработка ошибок в асинхронных методах через AsyncUncaughtExceptionHandler'
      ],
      expectedOutput: 'POST /api/orders → 201 Created (50ms) — email отправляется асинхронно\n\n[async-pool-1] EmailService: Отправка email на user@example.com\n[async-pool-1] EmailService: Email отправлен успешно (2000ms)\n\nCompletableFuture: результат всех 3 задач получен за 3с вместо 9с (параллельно)',
      hint: 'Создайте отдельный bean ThreadPoolTaskExecutor. @Async("taskExecutor") указывает конкретный executor. CompletableFuture<T> позволяет await результат.',
      solution: `// --- Async Config ---
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(25);
        executor.setThreadNamePrefix("async-pool-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);
        executor.initialize();
        return executor;
    }

    @Bean(name = "emailExecutor")
    public Executor emailExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(50);
        executor.setThreadNamePrefix("email-pool-");
        executor.initialize();
        return executor;
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (throwable, method, params) -> {
            log.error("Async error in {}: {}", method.getName(), throwable.getMessage());
        };
    }
}

// --- Async Email Service ---
@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Async("emailExecutor")
    public void sendOrderConfirmation(String to, Order order) {
        log.info("Отправка email на {}", to);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Заказ #" + order.getId() + " подтверждён");
            message.setText("Ваш заказ на сумму " + order.getTotal() + " подтверждён.");
            mailSender.send(message);
            log.info("Email отправлен на {}", to);
        } catch (Exception e) {
            log.error("Ошибка отправки email на {}: {}", to, e.getMessage());
        }
    }

    @Async("taskExecutor")
    public CompletableFuture<String> sendAndConfirm(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            return CompletableFuture.completedFuture("sent:" + to);
        } catch (Exception e) {
            return CompletableFuture.failedFuture(e);
        }
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final EmailService emailService;

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@RequestBody CreateOrderRequest request) {
        Order order = orderService.create(request);

        // Email отправляется асинхронно — контроллер не ждёт
        emailService.sendOrderConfirmation(request.getEmail(), order);

        return ResponseEntity.status(201).body(OrderDto.from(order));
    }
}

// --- Параллельные CompletableFuture ---
@Service
@RequiredArgsConstructor
public class ReportService {

    private final DataService dataService;

    @Async("taskExecutor")
    public CompletableFuture<Report> generateReport() {
        CompletableFuture<List<Order>> orders = dataService.getOrdersAsync();
        CompletableFuture<List<User>> users = dataService.getUsersAsync();
        CompletableFuture<Stats> stats = dataService.getStatsAsync();

        return CompletableFuture.allOf(orders, users, stats)
                .thenApply(v -> new Report(orders.join(), users.join(), stats.join()));
    }
}`,
      explanation: '@Async выполняет метод в отдельном потоке из пула. Вызывающий код не ждёт завершения. ThreadPoolTaskExecutor настраивает размер пула: corePoolSize — постоянные потоки, maxPoolSize — максимум при высокой нагрузке, queueCapacity — очередь ожидания. CallerRunsPolicy выполняет задачу в вызывающем потоке если очередь полна. CompletableFuture.allOf() запускает задачи параллельно.'
    },
    {
      id: 3,
      title: 'Задача: Spring Batch Job — CSV в базу',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Spring Batch Job для чтения CSV-файла, обработки данных и записи в базу данных.',
      requirements: [
        'Job с одним Step: read CSV → process → write to DB',
        'FlatFileItemReader для чтения CSV с заголовками',
        'ItemProcessor для валидации и трансформации данных',
        'JdbcBatchItemWriter для пакетной записи в БД'
      ],
      expectedOutput: 'Job "importProductsJob" started\nStep "importStep" executing: chunk[100]\n  Read: 1000 products from products.csv\n  Processed: 950 valid, 50 skipped\n  Written: 950 products to DB\nJob completed: status=COMPLETED, duration=5.2s',
      hint: 'Используйте chunk(100) для обработки по 100 записей. FlatFileItemReader.setLinesToSkip(1) пропускает заголовок CSV.',
      solution: `// --- pom.xml ---
// <dependency>
//     <groupId>org.springframework.boot</groupId>
//     <artifactId>spring-boot-starter-batch</artifactId>
// </dependency>

// --- Product CSV DTO ---
@Data @NoArgsConstructor @AllArgsConstructor
public class ProductCsv {
    private String name;
    private String category;
    private String price;
    private String stock;
    private String description;
}

// --- Batch Configuration ---
@Configuration
@EnableBatchProcessing
@RequiredArgsConstructor
public class ProductImportBatchConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final DataSource dataSource;

    @Bean
    public Job importProductsJob(Step importStep) {
        return new JobBuilder("importProductsJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(importStep)
                .build();
    }

    @Bean
    public Step importStep(ItemReader<ProductCsv> reader,
                            ItemProcessor<ProductCsv, Product> processor,
                            ItemWriter<Product> writer) {
        return new StepBuilder("importStep", jobRepository)
                .<ProductCsv, Product>chunk(100, transactionManager)
                .reader(reader)
                .processor(processor)
                .writer(writer)
                .faultTolerant()
                .skip(Exception.class)
                .skipLimit(50)
                .build();
    }

    // --- Reader ---
    @Bean
    public FlatFileItemReader<ProductCsv> reader() {
        return new FlatFileItemReaderBuilder<ProductCsv>()
                .name("productCsvReader")
                .resource(new ClassPathResource("products.csv"))
                .delimited()
                .delimiter(",")
                .names("name", "category", "price", "stock", "description")
                .linesToSkip(1) // пропуск заголовка
                .fieldSetMapper(new BeanWrapperFieldSetMapper<>() {{
                    setTargetType(ProductCsv.class);
                }})
                .build();
    }

    // --- Processor ---
    @Bean
    public ItemProcessor<ProductCsv, Product> processor() {
        return csvProduct -> {
            // Валидация
            if (csvProduct.getName() == null || csvProduct.getName().isBlank()) {
                return null; // skip
            }

            BigDecimal price;
            try {
                price = new BigDecimal(csvProduct.getPrice());
                if (price.compareTo(BigDecimal.ZERO) <= 0) return null;
            } catch (NumberFormatException e) {
                return null; // skip invalid price
            }

            // Трансформация
            return Product.builder()
                    .name(csvProduct.getName().trim())
                    .category(csvProduct.getCategory().trim().toUpperCase())
                    .price(price)
                    .stock(Integer.parseInt(csvProduct.getStock()))
                    .description(csvProduct.getDescription())
                    .active(true)
                    .createdAt(LocalDateTime.now())
                    .build();
        };
    }

    // --- Writer ---
    @Bean
    public JdbcBatchItemWriter<Product> writer() {
        return new JdbcBatchItemWriterBuilder<Product>()
                .dataSource(dataSource)
                .sql("INSERT INTO products (name, category, price, stock, description, active, created_at) " +
                     "VALUES (:name, :category, :price, :stock, :description, :active, :createdAt)")
                .beanMapped()
                .build();
    }
}

// --- Controller для запуска Job ---
@RestController
@RequestMapping("/api/admin/batch")
@RequiredArgsConstructor
public class BatchController {

    private final JobLauncher jobLauncher;
    private final Job importProductsJob;

    @PostMapping("/import-products")
    public ResponseEntity<Map<String, Object>> importProducts() throws Exception {
        JobParameters params = new JobParametersBuilder()
                .addLong("startTime", System.currentTimeMillis())
                .toJobParameters();

        JobExecution execution = jobLauncher.run(importProductsJob, params);

        return ResponseEntity.ok(Map.of(
                "jobId", execution.getJobId(),
                "status", execution.getStatus().toString(),
                "startTime", execution.getStartTime().toString()));
    }
}`,
      explanation: 'Spring Batch обрабатывает данные чанками (chunk). FlatFileItemReader читает CSV по строкам. ItemProcessor трансформирует и валидирует каждую запись (null = skip). JdbcBatchItemWriter записывает пакетно в БД. chunk(100) — обрабатываем по 100 записей за транзакцию. faultTolerant().skip(50) пропускает до 50 ошибочных записей без остановки Job.'
    },
    {
      id: 4,
      title: 'Задача: Разные ItemReader реализации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте различные ItemReader для чтения данных из CSV, базы данных и JSON API.',
      requirements: [
        'FlatFileItemReader для CSV-файлов с кастомным маппингом',
        'JdbcCursorItemReader для чтения из БД через курсор',
        'JdbcPagingItemReader для чтения из БД с пагинацией',
        'Кастомный ItemReader для чтения из внешнего REST API'
      ],
      expectedOutput: 'CSV Reader: 1000 записей прочитано из products.csv\nJDBC Cursor Reader: 5000 записей из таблицы orders (streaming)\nJDBC Paging Reader: 10000 записей, по 500 за страницу\nAPI Reader: 200 записей из https://api.example.com/data',
      hint: 'JdbcCursorItemReader читает через JDBC cursor (streaming) — эффективно по памяти. JdbcPagingItemReader использует LIMIT/OFFSET — безопаснее для длинных транзакций.',
      solution: `// --- JDBC Cursor Reader ---
@Bean
public JdbcCursorItemReader<Order> jdbcCursorReader(DataSource dataSource) {
    return new JdbcCursorItemReaderBuilder<Order>()
            .name("orderCursorReader")
            .dataSource(dataSource)
            .sql("SELECT id, user_id, total, status, created_at FROM orders WHERE status = ?")
            .preparedStatementSetter(ps -> ps.setString(1, "PENDING"))
            .rowMapper((rs, rowNum) -> Order.builder()
                    .id(rs.getLong("id"))
                    .userId(rs.getLong("user_id"))
                    .total(rs.getBigDecimal("total"))
                    .status(OrderStatus.valueOf(rs.getString("status")))
                    .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                    .build())
            .fetchSize(100)
            .build();
}

// --- JDBC Paging Reader ---
@Bean
public JdbcPagingItemReader<Order> jdbcPagingReader(DataSource dataSource) {
    Map<String, Order> sortKeys = new LinkedHashMap<>();
    sortKeys.put("id", Order.ASCENDING);

    PostgresPagingQueryProvider queryProvider = new PostgresPagingQueryProvider();
    queryProvider.setSelectClause("id, user_id, total, status, created_at");
    queryProvider.setFromClause("orders");
    queryProvider.setWhereClause("status = 'PENDING'");
    queryProvider.setSortKeys(sortKeys);

    return new JdbcPagingItemReaderBuilder<Order>()
            .name("orderPagingReader")
            .dataSource(dataSource)
            .queryProvider(queryProvider)
            .pageSize(500)
            .rowMapper((rs, rowNum) -> Order.builder()
                    .id(rs.getLong("id"))
                    .userId(rs.getLong("user_id"))
                    .total(rs.getBigDecimal("total"))
                    .status(OrderStatus.valueOf(rs.getString("status")))
                    .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                    .build())
            .build();
}

// --- REST API Reader ---
public class RestApiItemReader implements ItemReader<ExternalProduct> {

    private final RestTemplate restTemplate;
    private final String apiUrl;
    private List<ExternalProduct> items;
    private int currentIndex = 0;
    private int currentPage = 0;
    private final int pageSize = 100;
    private boolean hasMore = true;

    public RestApiItemReader(RestTemplate restTemplate, String apiUrl) {
        this.restTemplate = restTemplate;
        this.apiUrl = apiUrl;
    }

    @Override
    public ExternalProduct read() throws Exception {
        if (items == null || currentIndex >= items.size()) {
            if (!hasMore) return null;
            fetchNextPage();
            if (items.isEmpty()) return null;
        }

        if (currentIndex < items.size()) {
            return items.get(currentIndex++);
        }
        return null;
    }

    private void fetchNextPage() {
        String url = apiUrl + "?page=" + currentPage + "&size=" + pageSize;
        ResponseEntity<ApiPageResponse> response = restTemplate.exchange(
                url, HttpMethod.GET, null,
                new ParameterizedTypeReference<ApiPageResponse>() {});

        ApiPageResponse body = response.getBody();
        items = body.getContent();
        currentIndex = 0;
        currentPage++;
        hasMore = currentPage < body.getTotalPages();
    }
}

// --- Конфигурация Job с разными readers ---
@Configuration
public class MultiSourceBatchConfig {

    @Bean
    @StepScope
    public ItemReader<?> itemReader(@Value("#{jobParameters['source']}") String source,
                                     DataSource dataSource) {
        return switch (source) {
            case "csv" -> csvReader();
            case "db-cursor" -> jdbcCursorReader(dataSource);
            case "db-paging" -> jdbcPagingReader(dataSource);
            case "api" -> new RestApiItemReader(new RestTemplate(), "https://api.example.com/data");
            default -> throw new IllegalArgumentException("Unknown source: " + source);
        };
    }
}`,
      explanation: 'JdbcCursorItemReader использует database cursor для streaming чтения — минимальное потребление памяти, но держит DB-соединение открытым. JdbcPagingItemReader читает страницами через LIMIT/OFFSET — не держит соединение, но менее эффективен. Кастомный REST API Reader реализует пагинацию API и возвращает элементы по одному. @StepScope позволяет выбрать reader по параметру Job.'
    },
    {
      id: 5,
      title: 'Задача: ItemProcessor и ItemWriter',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте обработку и запись данных: трансформация, фильтрация, композитный processor и различные writer-ы.',
      requirements: [
        'ItemProcessor для валидации, обогащения и трансформации данных',
        'CompositeItemProcessor для цепочки обработчиков',
        'JdbcBatchItemWriter для записи в БД',
        'CompositeItemWriter для записи в несколько мест одновременно'
      ],
      expectedOutput: 'Processor chain:\n  1. ValidationProcessor: 950/1000 valid\n  2. EnrichmentProcessor: добавлен categoryId из справочника\n  3. TransformProcessor: цена конвертирована USD → RUB\n\nWriter:\n  1. DB Writer: 950 записей в products\n  2. Elasticsearch Writer: 950 документов проиндексировано\n  3. Audit Writer: 950 записей в audit_log',
      hint: 'CompositeItemProcessor принимает список процессоров и выполняет последовательно. CompositeItemWriter записывает в несколько мест. Processor возвращает null для skip.',
      solution: `// --- Validation Processor ---
@Component
@Slf4j
public class ValidationProcessor implements ItemProcessor<ProductCsv, ProductCsv> {

    @Override
    public ProductCsv process(ProductCsv item) {
        if (item.getName() == null || item.getName().isBlank()) {
            log.warn("Skipping: empty name");
            return null; // skip
        }
        try {
            new BigDecimal(item.getPrice());
        } catch (NumberFormatException e) {
            log.warn("Skipping: invalid price '{}'", item.getPrice());
            return null;
        }
        return item;
    }
}

// --- Enrichment Processor ---
@Component
@RequiredArgsConstructor
public class EnrichmentProcessor implements ItemProcessor<ProductCsv, Product> {

    private final CategoryRepository categoryRepository;
    private final Map<String, Long> categoryCache = new ConcurrentHashMap<>();

    @Override
    public Product process(ProductCsv item) {
        Long categoryId = categoryCache.computeIfAbsent(
                item.getCategory(),
                cat -> categoryRepository.findByName(cat)
                        .map(Category::getId)
                        .orElse(null));

        return Product.builder()
                .name(item.getName().trim())
                .category(item.getCategory())
                .categoryId(categoryId)
                .price(new BigDecimal(item.getPrice()))
                .stock(Integer.parseInt(item.getStock()))
                .description(item.getDescription())
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();
    }
}

// --- Composite Processor Config ---
@Bean
public CompositeItemProcessor<ProductCsv, Product> compositeProcessor(
        ValidationProcessor validationProcessor,
        EnrichmentProcessor enrichmentProcessor) {

    CompositeItemProcessor<ProductCsv, Product> composite = new CompositeItemProcessor<>();
    composite.setDelegates(List.of(validationProcessor, enrichmentProcessor));
    return composite;
}

// --- Composite Writer ---
@Bean
public CompositeItemWriter<Product> compositeWriter(
        JdbcBatchItemWriter<Product> dbWriter,
        ItemWriter<Product> elasticsearchWriter,
        ItemWriter<Product> auditWriter) {

    CompositeItemWriter<Product> composite = new CompositeItemWriter<>();
    composite.setDelegates(List.of(dbWriter, elasticsearchWriter, auditWriter));
    return composite;
}

@Bean
public JdbcBatchItemWriter<Product> dbWriter(DataSource dataSource) {
    return new JdbcBatchItemWriterBuilder<Product>()
            .dataSource(dataSource)
            .sql("INSERT INTO products (name, category, category_id, price, stock, description, active, created_at) " +
                 "VALUES (:name, :category, :categoryId, :price, :stock, :description, :active, :createdAt)")
            .beanMapped()
            .build();
}

@Bean
public ItemWriter<Product> elasticsearchWriter(ProductSearchRepository searchRepo) {
    return items -> {
        List<ProductDocument> docs = items.getItems().stream()
                .map(ProductDocument::fromEntity)
                .collect(Collectors.toList());
        searchRepo.saveAll(docs);
    };
}

@Bean
public ItemWriter<Product> auditWriter(AuditLogRepository auditRepo) {
    return items -> {
        List<AuditLog> logs = items.getItems().stream()
                .map(p -> AuditLog.builder()
                        .action("IMPORT")
                        .entity("Product")
                        .entityId(p.getId())
                        .details("Imported: " + p.getName())
                        .timestamp(LocalDateTime.now())
                        .build())
                .collect(Collectors.toList());
        auditRepo.saveAll(logs);
    };
}

// --- Step с composite ---
@Bean
public Step importStep(ItemReader<ProductCsv> reader,
                        CompositeItemProcessor<ProductCsv, Product> processor,
                        CompositeItemWriter<Product> writer) {
    return new StepBuilder("importStep", jobRepository)
            .<ProductCsv, Product>chunk(100, transactionManager)
            .reader(reader)
            .processor(processor)
            .writer(writer)
            .build();
}`,
      explanation: 'CompositeItemProcessor выполняет цепочку обработчиков последовательно. Если любой процессор вернёт null — запись пропускается. CompositeItemWriter записывает каждую запись в несколько мест: БД, Elasticsearch, аудит лог. Кеширование категорий в EnrichmentProcessor предотвращает N+1 запросы. Lambda-writer удобен для простых случаев.'
    },
    {
      id: 6,
      title: 'Задача: Step listeners и callbacks',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте listeners для мониторинга выполнения Spring Batch Job: логирование, метрики, уведомления.',
      requirements: [
        'JobExecutionListener для логирования начала и завершения Job',
        'StepExecutionListener для сбора статистики по каждому Step',
        'ChunkListener для логирования прогресса обработки чанков',
        'SkipListener для логирования и сохранения пропущенных записей'
      ],
      expectedOutput: 'Job[importProducts] STARTED at 2024-03-10 14:00:00\n  Step[import] STARTED\n    Chunk 1: read=100, write=98, skip=2\n    Chunk 2: read=100, write=100, skip=0\n    ...\n    Chunk 10: read=100, write=95, skip=5\n  Step[import] COMPLETED: read=1000, written=950, skipped=50, duration=5.2s\nJob[importProducts] COMPLETED in 5.5s\n\nSkipped records saved to: /logs/skipped-2024-03-10.csv',
      hint: 'Реализуйте интерфейсы JobExecutionListener, StepExecutionListener, ChunkListener, SkipListener. Или используйте аннотации @BeforeStep, @AfterStep и т.д.',
      solution: `// --- Job Listener ---
@Component
@Slf4j
@RequiredArgsConstructor
public class JobCompletionListener implements JobExecutionListener {

    private final EmailService emailService;
    private final MetricsService metricsService;

    @Override
    public void beforeJob(JobExecution jobExecution) {
        log.info("Job[{}] STARTED at {}",
                jobExecution.getJobInstance().getJobName(),
                jobExecution.getStartTime());
    }

    @Override
    public void afterJob(JobExecution jobExecution) {
        long durationMs = Duration.between(
                jobExecution.getStartTime(), jobExecution.getEndTime()).toMillis();

        log.info("Job[{}] {} in {}ms",
                jobExecution.getJobInstance().getJobName(),
                jobExecution.getStatus(),
                durationMs);

        metricsService.recordJobExecution(
                jobExecution.getJobInstance().getJobName(),
                jobExecution.getStatus().toString(),
                durationMs);

        if (jobExecution.getStatus() == BatchStatus.FAILED) {
            emailService.sendAlert("Batch Job Failed",
                    "Job: " + jobExecution.getJobInstance().getJobName() +
                    "\\nError: " + jobExecution.getAllFailureExceptions());
        }
    }
}

// --- Step Listener ---
@Component
@Slf4j
public class StepProgressListener implements StepExecutionListener {

    @Override
    public void beforeStep(StepExecution stepExecution) {
        log.info("  Step[{}] STARTED", stepExecution.getStepName());
    }

    @Override
    public ExitStatus afterStep(StepExecution stepExecution) {
        log.info("  Step[{}] {}: read={}, written={}, skipped={}, duration={}ms",
                stepExecution.getStepName(),
                stepExecution.getStatus(),
                stepExecution.getReadCount(),
                stepExecution.getWriteCount(),
                stepExecution.getSkipCount(),
                Duration.between(stepExecution.getStartTime(),
                        stepExecution.getEndTime()).toMillis());

        return stepExecution.getExitStatus();
    }
}

// --- Chunk Listener ---
@Component
@Slf4j
public class ChunkProgressListener implements ChunkListener {

    private final AtomicInteger chunkCount = new AtomicInteger(0);

    @Override
    public void beforeChunk(ChunkContext context) {
        // до обработки чанка
    }

    @Override
    public void afterChunk(ChunkContext context) {
        int chunk = chunkCount.incrementAndGet();
        StepExecution stepExecution = context.getStepContext().getStepExecution();
        log.info("    Chunk {}: read={}, written={}, skipped={}",
                chunk,
                stepExecution.getReadCount(),
                stepExecution.getWriteCount(),
                stepExecution.getSkipCount());
    }

    @Override
    public void afterChunkError(ChunkContext context) {
        log.error("    Chunk error in step: {}",
                context.getStepContext().getStepName());
    }
}

// --- Skip Listener ---
@Component
@Slf4j
public class ProductSkipListener implements SkipListener<ProductCsv, Product> {

    private final List<ProductCsv> skippedItems =
            Collections.synchronizedList(new ArrayList<>());

    @Override
    public void onSkipInRead(Throwable t) {
        log.warn("Skip in read: {}", t.getMessage());
    }

    @Override
    public void onSkipInProcess(ProductCsv item, Throwable t) {
        log.warn("Skip in process: name={}, error={}", item.getName(), t.getMessage());
        skippedItems.add(item);
    }

    @Override
    public void onSkipInWrite(Product item, Throwable t) {
        log.warn("Skip in write: id={}, error={}", item.getId(), t.getMessage());
    }

    public List<ProductCsv> getSkippedItems() {
        return new ArrayList<>(skippedItems);
    }
}

// --- Step с listeners ---
@Bean
public Step importStep() {
    return new StepBuilder("importStep", jobRepository)
            .<ProductCsv, Product>chunk(100, transactionManager)
            .reader(reader())
            .processor(processor())
            .writer(writer())
            .faultTolerant()
            .skip(Exception.class)
            .skipLimit(100)
            .listener(stepProgressListener)
            .listener(chunkProgressListener)
            .listener(productSkipListener)
            .build();
}`,
      explanation: 'Listeners — точки расширения для мониторинга Batch Job. JobExecutionListener вызывается при старте и завершении Job. StepExecutionListener — для каждого Step с доступом к статистике (readCount, writeCount). ChunkListener — для каждого чанка. SkipListener — для каждой пропущенной записи с причиной. Это позволяет логировать прогресс, собирать метрики и отправлять уведомления.'
    },
    {
      id: 7,
      title: 'Задача: Job параметры и перезапуск',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте параметризацию Job и механизм перезапуска с продолжением с места остановки.',
      requirements: [
        'JobParameters для передачи параметров (inputFile, date, batchSize)',
        '@StepScope bean-ы для доступа к параметрам внутри Step',
        'Restartability: перезапуск Job с того места, где он остановился',
        'Контроллер для запуска с параметрами и просмотра статуса'
      ],
      expectedOutput: 'POST /api/batch/run?inputFile=data.csv&date=2024-03-10\n→ { "jobId":1, "status":"STARTED" }\n\n(Job fails at record 500)\nPOST /api/batch/restart/1\n→ { "jobId":1, "status":"STARTED", "restartAt":"record 500" }\n\nGET /api/batch/status/1\n→ { "jobId":1, "status":"COMPLETED", "read":1000, "written":998, "startedAt":"...", "duration":"5.2s" }',
      hint: `Используйте @StepScope и @Value("#{jobParameters[\\'inputFile\\']}") для доступа к параметрам. Job по умолчанию restartable — Spring Batch запоминает последний обработанный чанк.`,
      solution: `// --- Job Config с параметрами ---
@Configuration
@RequiredArgsConstructor
public class ParameterizedJobConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;

    @Bean
    public Job parameterizedJob(Step paramStep) {
        return new JobBuilder("parameterizedJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(paramStep)
                .build();
    }

    @Bean
    public Step paramStep(
            @Qualifier("paramReader") ItemReader<ProductCsv> reader,
            ItemProcessor<ProductCsv, Product> processor,
            ItemWriter<Product> writer) {
        return new StepBuilder("paramStep", jobRepository)
                .<ProductCsv, Product>chunk(100, transactionManager)
                .reader(reader)
                .processor(processor)
                .writer(writer)
                .allowStartIfComplete(false) // не перезапускать если COMPLETED
                .build();
    }

    // @StepScope — создаётся при каждом запуске Step
    @Bean
    @StepScope
    @Qualifier("paramReader")
    public FlatFileItemReader<ProductCsv> paramReader(
            @Value("#{jobParameters['inputFile']}") String inputFile) {

        return new FlatFileItemReaderBuilder<ProductCsv>()
                .name("paramProductReader")
                .resource(new FileSystemResource(inputFile))
                .delimited()
                .names("name", "category", "price", "stock", "description")
                .linesToSkip(1)
                .fieldSetMapper(new BeanWrapperFieldSetMapper<>() {{
                    setTargetType(ProductCsv.class);
                }})
                .saveState(true) // сохранять позицию для restart
                .build();
    }

    @Bean
    @StepScope
    public ItemProcessor<ProductCsv, Product> paramProcessor(
            @Value("#{jobParameters['date']}") String dateStr) {

        LocalDate importDate = LocalDate.parse(dateStr);
        return item -> Product.builder()
                .name(item.getName())
                .category(item.getCategory())
                .price(new BigDecimal(item.getPrice()))
                .stock(Integer.parseInt(item.getStock()))
                .importDate(importDate)
                .active(true)
                .build();
    }
}

// --- Batch Controller ---
@RestController
@RequestMapping("/api/batch")
@RequiredArgsConstructor
public class BatchController {

    private final JobLauncher jobLauncher;
    private final JobLauncher asyncJobLauncher;
    private final Job parameterizedJob;
    private final JobExplorer jobExplorer;
    private final JobRepository jobRepository;

    @PostMapping("/run")
    public ResponseEntity<Map<String, Object>> runJob(
            @RequestParam String inputFile,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) throws Exception {

        JobParameters params = new JobParametersBuilder()
                .addString("inputFile", inputFile)
                .addString("date", date.toString())
                .addLong("timestamp", System.currentTimeMillis())
                .toJobParameters();

        JobExecution execution = asyncJobLauncher.run(parameterizedJob, params);

        return ResponseEntity.ok(Map.of(
                "jobId", execution.getJobId(),
                "status", execution.getStatus().toString()));
    }

    @PostMapping("/restart/{jobId}")
    public ResponseEntity<Map<String, Object>> restartJob(@PathVariable Long jobId) throws Exception {
        JobExecution lastExecution = jobExplorer.getJobExecution(jobId);
        if (lastExecution == null) {
            throw new RuntimeException("Job not found: " + jobId);
        }

        JobExecution execution = jobLauncher.run(
                parameterizedJob, lastExecution.getJobParameters());

        return ResponseEntity.ok(Map.of(
                "jobId", execution.getJobId(),
                "status", execution.getStatus().toString(),
                "restartAt", "continuation from last checkpoint"));
    }

    @GetMapping("/status/{jobId}")
    public ResponseEntity<Map<String, Object>> getStatus(@PathVariable Long jobId) {
        JobExecution execution = jobExplorer.getJobExecution(jobId);
        if (execution == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> result = new HashMap<>();
        result.put("jobId", execution.getJobId());
        result.put("status", execution.getStatus().toString());
        result.put("startTime", execution.getStartTime());
        result.put("endTime", execution.getEndTime());

        execution.getStepExecutions().forEach(step -> {
            result.put("read", step.getReadCount());
            result.put("written", step.getWriteCount());
            result.put("skipped", step.getSkipCount());
        });

        return ResponseEntity.ok(result);
    }
}`,
      explanation: 'JobParameters передают конфигурацию в Job. @StepScope создаёт bean при каждом запуске Step с доступом к параметрам через SpEL. saveState(true) в Reader сохраняет текущую позицию — при restart Job продолжит с последнего чанка. JobExplorer позволяет просматривать историю выполнения. AsyncJobLauncher запускает Job в отдельном потоке.'
    },
    {
      id: 8,
      title: 'Задача: Условные Step-ы',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте условное выполнение Step-ов: ветвление, решения и переходы в зависимости от результата.',
      requirements: [
        'FlowBuilder для условных переходов: on("COMPLETED").to(nextStep)',
        'JobExecutionDecider для принятия решений между Step-ами',
        'Conditional flow: если ошибок > порога — перейти к notificationStep',
        'Split для параллельного выполнения независимых Step-ов'
      ],
      expectedOutput: 'Scenario 1 (мало ошибок):\n  importStep → COMPLETED → transformStep → COMPLETED → exportStep → COMPLETED\n\nScenario 2 (много ошибок):\n  importStep → COMPLETED → decider → TOO_MANY_ERRORS → notificationStep → errorReportStep\n\nScenario 3 (параллельно):\n  importStep → [emailReportStep || pdfReportStep] → cleanupStep',
      hint: 'JobExecutionDecider.decide() возвращает FlowExecutionStatus. Используйте FlowBuilder.from(step).on("*").to(nextStep) для переходов.',
      solution: `// --- Decider ---
@Component
public class ErrorThresholdDecider implements JobExecutionDecider {

    private static final int ERROR_THRESHOLD = 50;

    @Override
    public FlowExecutionStatus decide(JobExecution jobExecution, StepExecution stepExecution) {
        int skipCount = stepExecution != null ? stepExecution.getSkipCount() : 0;

        if (skipCount > ERROR_THRESHOLD) {
            return new FlowExecutionStatus("TOO_MANY_ERRORS");
        }
        return new FlowExecutionStatus("CONTINUE");
    }
}

// --- Conditional Job Config ---
@Configuration
@RequiredArgsConstructor
public class ConditionalJobConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final ErrorThresholdDecider errorDecider;

    @Bean
    public Job conditionalJob() {
        return new JobBuilder("conditionalJob", jobRepository)
                .start(importStep())
                .next(errorDecider)
                    .on("TOO_MANY_ERRORS").to(notificationStep()).next(errorReportStep())
                    .from(errorDecider).on("CONTINUE").to(transformStep())
                .next(exportStep())
                .end()
                .build();
    }

    // --- Job с параллельными step-ами ---
    @Bean
    public Job parallelJob() {
        Flow emailFlow = new FlowBuilder<SimpleFlow>("emailFlow")
                .start(emailReportStep())
                .build();

        Flow pdfFlow = new FlowBuilder<SimpleFlow>("pdfFlow")
                .start(pdfReportStep())
                .build();

        Flow parallelFlow = new FlowBuilder<SimpleFlow>("parallelFlow")
                .split(new SimpleAsyncTaskExecutor())
                .add(emailFlow, pdfFlow)
                .build();

        return new JobBuilder("parallelJob", jobRepository)
                .start(importStep())
                .next(parallelFlow)
                .next(cleanupStep())
                .end()
                .build();
    }

    @Bean
    public Step importStep() {
        return new StepBuilder("importStep", jobRepository)
                .<ProductCsv, Product>chunk(100, transactionManager)
                .reader(csvReader())
                .processor(processor())
                .writer(dbWriter())
                .faultTolerant()
                .skip(Exception.class).skipLimit(200)
                .build();
    }

    @Bean
    public Step transformStep() {
        return new StepBuilder("transformStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("Transforming imported data...");
                    // трансформация данных
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    @Bean
    public Step exportStep() {
        return new StepBuilder("exportStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("Exporting processed data...");
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    @Bean
    public Step notificationStep() {
        return new StepBuilder("notificationStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.warn("Слишком много ошибок — отправка уведомления");
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    @Bean
    public Step errorReportStep() {
        return new StepBuilder("errorReportStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("Генерация отчёта об ошибках");
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    @Bean
    public Step emailReportStep() {
        return new StepBuilder("emailReportStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    Thread.sleep(3000);
                    log.info("Email report generated");
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    @Bean
    public Step pdfReportStep() {
        return new StepBuilder("pdfReportStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    Thread.sleep(5000);
                    log.info("PDF report generated");
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }

    @Bean
    public Step cleanupStep() {
        return new StepBuilder("cleanupStep", jobRepository)
                .tasklet((contribution, chunkContext) -> {
                    log.info("Cleanup temporary files");
                    return RepeatStatus.FINISHED;
                }, transactionManager)
                .build();
    }
}`,
      explanation: 'FlowBuilder создаёт условные переходы между Step-ами. Decider.decide() возвращает FlowExecutionStatus для принятия решения. on("STATUS").to(step) определяет переход. split() с AsyncTaskExecutor запускает Flow-ы параллельно — emailReportStep и pdfReportStep выполняются одновременно. cleanupStep ждёт завершения обоих параллельных flow.'
    },
    {
      id: 9,
      title: 'Задача: Параллельное выполнение Step-ов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте параллельную обработку данных: multi-threaded step, partitioning и parallel chunks.',
      requirements: [
        'Multi-threaded Step с TaskExecutor для параллельных чанков',
        'Partitioner для разделения данных между потоками',
        'Remote partitioning через StepExecutionSplitter',
        'Контроль concurrency и thread safety в reader/writer'
      ],
      expectedOutput: 'Multi-threaded Step:\n  Thread[batch-1]: processing chunk 1 (records 1-100)\n  Thread[batch-2]: processing chunk 2 (records 101-200)\n  Thread[batch-3]: processing chunk 3 (records 201-300)\n  ...\n  Total: 10000 records processed in 4 threads, duration=12s (vs 45s single-thread)\n\nPartitioned Step:\n  Partition 0: records id 1-2500\n  Partition 1: records id 2501-5000\n  Partition 2: records id 5001-7500\n  Partition 3: records id 7501-10000',
      hint: 'TaskExecutor в Step для multi-threading. Partitioner.partition(gridSize) делит данные. Используйте synchronized reader или thread-safe реализацию.',
      solution: `// --- Multi-threaded Step ---
@Bean
public Step multiThreadedStep() {
    return new StepBuilder("multiThreadedStep", jobRepository)
            .<Order, ProcessedOrder>chunk(100, transactionManager)
            .reader(synchronizedReader())
            .processor(orderProcessor())
            .writer(orderWriter())
            .taskExecutor(batchTaskExecutor())
            .throttleLimit(4) // максимум 4 потока
            .build();
}

@Bean
public TaskExecutor batchTaskExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(4);
    executor.setMaxPoolSize(8);
    executor.setThreadNamePrefix("batch-");
    executor.initialize();
    return executor;
}

// Synchronized wrapper для thread-safe чтения
@Bean
public SynchronizedItemStreamReader<Order> synchronizedReader() {
    JdbcCursorItemReader<Order> reader = new JdbcCursorItemReaderBuilder<Order>()
            .name("orderReader")
            .dataSource(dataSource)
            .sql("SELECT * FROM orders WHERE status = 'PENDING' ORDER BY id")
            .rowMapper(new OrderRowMapper())
            .build();

    SynchronizedItemStreamReader<Order> syncReader = new SynchronizedItemStreamReader<>();
    syncReader.setDelegate(reader);
    return syncReader;
}

// --- Partitioned Step ---
@Bean
public Step partitionedMasterStep() {
    return new StepBuilder("partitionedMaster", jobRepository)
            .partitioner("workerStep", rangePartitioner())
            .step(workerStep())
            .gridSize(4)
            .taskExecutor(batchTaskExecutor())
            .build();
}

@Bean
public Partitioner rangePartitioner() {
    return gridSize -> {
        Map<String, ExecutionContext> partitions = new HashMap<>();

        long totalRecords = orderRepository.count();
        long partitionSize = totalRecords / gridSize;

        for (int i = 0; i < gridSize; i++) {
            ExecutionContext context = new ExecutionContext();
            long minId = i * partitionSize + 1;
            long maxId = (i == gridSize - 1) ? totalRecords : (i + 1) * partitionSize;

            context.putLong("minId", minId);
            context.putLong("maxId", maxId);
            context.putString("partitionName", "partition-" + i);

            partitions.put("partition-" + i, context);
        }

        return partitions;
    };
}

@Bean
public Step workerStep() {
    return new StepBuilder("workerStep", jobRepository)
            .<Order, ProcessedOrder>chunk(100, transactionManager)
            .reader(partitionedReader(null, null))
            .processor(orderProcessor())
            .writer(orderWriter())
            .build();
}

@Bean
@StepScope
public JdbcPagingItemReader<Order> partitionedReader(
        @Value("#{stepExecutionContext['minId']}") Long minId,
        @Value("#{stepExecutionContext['maxId']}") Long maxId) {

    Map<String, Object> params = new HashMap<>();
    params.put("minId", minId);
    params.put("maxId", maxId);

    PostgresPagingQueryProvider queryProvider = new PostgresPagingQueryProvider();
    queryProvider.setSelectClause("*");
    queryProvider.setFromClause("orders");
    queryProvider.setWhereClause("id >= :minId AND id <= :maxId AND status = 'PENDING'");
    queryProvider.setSortKeys(Map.of("id", Order.ASCENDING));

    JdbcPagingItemReader<Order> reader = new JdbcPagingItemReader<>();
    reader.setDataSource(dataSource);
    reader.setQueryProvider(queryProvider);
    reader.setParameterValues(params);
    reader.setPageSize(100);
    reader.setRowMapper(new OrderRowMapper());
    return reader;
}`,
      explanation: 'Multi-threaded Step использует TaskExecutor для параллельной обработки чанков в нескольких потоках. SynchronizedItemStreamReader оборачивает reader для thread-safe чтения. Partitioner делит данные на диапазоны (по id), каждая партиция обрабатывается своим worker Step. gridSize=4 создаёт 4 партиции. @StepScope + stepExecutionContext даёт каждому worker свой диапазон данных.'
    },
    {
      id: 10,
      title: 'Задача: Генерация отчётов Batch',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте Batch Job для генерации ежемесячного отчёта: агрегация данных, генерация PDF и отправка по email.',
      requirements: [
        'Step 1: агрегация данных из БД (заказы, выручка, топ продукты)',
        'Step 2: генерация PDF отчёта с таблицами и графиками',
        'Step 3: отправка отчёта по email администраторам',
        'Планирование через @Scheduled cron для первого числа каждого месяца'
      ],
      expectedOutput: 'Job[monthlyReportJob] STARTED\n  Step[aggregateData]: собрано 30 дней данных — 1500 заказов, $125,000 выручки\n  Step[generatePdf]: PDF сгенерирован — /reports/report-2024-03.pdf (2.5 MB)\n  Step[sendEmail]: отчёт отправлен admin@example.com, manager@example.com\nJob[monthlyReportJob] COMPLETED in 15s',
      hint: 'Используйте Tasklet для каждого Step. Для PDF — библиотеку iText или Apache PDFBox. Для передачи данных между Step-ами используйте ExecutionContext.',
      solution: `// --- Report Job Config ---
@Configuration
@RequiredArgsConstructor
public class MonthlyReportJobConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;

    @Bean
    public Job monthlyReportJob() {
        return new JobBuilder("monthlyReportJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(aggregateDataStep())
                .next(generatePdfStep())
                .next(sendEmailStep())
                .listener(new JobCompletionListener())
                .build();
    }

    @Bean
    public Step aggregateDataStep() {
        return new StepBuilder("aggregateData", jobRepository)
                .tasklet(aggregateDataTasklet(null), transactionManager)
                .build();
    }

    @Bean
    public Step generatePdfStep() {
        return new StepBuilder("generatePdf", jobRepository)
                .tasklet(generatePdfTasklet(), transactionManager)
                .build();
    }

    @Bean
    public Step sendEmailStep() {
        return new StepBuilder("sendEmail", jobRepository)
                .tasklet(sendEmailTasklet(), transactionManager)
                .build();
    }

    // --- Step 1: Aggregate Data ---
    @Bean
    @StepScope
    public Tasklet aggregateDataTasklet(
            @Value("#{jobParameters['month'] ?: T(java.time.YearMonth).now().minusMonths(1).toString()}")
            String monthStr) {

        return (contribution, chunkContext) -> {
            YearMonth month = YearMonth.parse(monthStr);
            LocalDateTime from = month.atDay(1).atStartOfDay();
            LocalDateTime to = month.atEndOfMonth().atTime(23, 59, 59);

            // Агрегация
            ReportData data = new ReportData();
            data.setMonth(month);
            data.setTotalOrders(orderRepository.countByCreatedAtBetween(from, to));
            data.setTotalRevenue(orderRepository.sumTotalByCreatedAtBetween(from, to));
            data.setAvgOrderValue(data.getTotalRevenue()
                    .divide(BigDecimal.valueOf(data.getTotalOrders()), RoundingMode.HALF_UP));
            data.setTopProducts(orderItemRepository.findTopProducts(from, to, 10));
            data.setOrdersByDay(orderRepository.countByDay(from, to));
            data.setRevenueByCategory(orderRepository.revenueByCategory(from, to));

            // Передача в следующий Step через ExecutionContext
            ExecutionContext context = chunkContext.getStepContext()
                    .getStepExecution().getJobExecution().getExecutionContext();
            context.put("reportData", objectMapper.writeValueAsString(data));

            log.info("Агрегировано: {} заказов, {} выручки", data.getTotalOrders(), data.getTotalRevenue());
            return RepeatStatus.FINISHED;
        };
    }

    // --- Step 2: Generate PDF ---
    @Bean
    public Tasklet generatePdfTasklet() {
        return (contribution, chunkContext) -> {
            ExecutionContext context = chunkContext.getStepContext()
                    .getStepExecution().getJobExecution().getExecutionContext();
            ReportData data = objectMapper.readValue(
                    context.getString("reportData"), ReportData.class);

            String filePath = "/reports/report-" + data.getMonth() + ".pdf";

            try (PdfWriter writer = new PdfWriter(filePath);
                 PdfDocument pdf = new PdfDocument(writer);
                 Document document = new Document(pdf)) {

                // Заголовок
                document.add(new Paragraph("Ежемесячный отчёт: " + data.getMonth())
                        .setFontSize(20).setBold());

                // Сводка
                document.add(new Paragraph("Всего заказов: " + data.getTotalOrders()));
                document.add(new Paragraph("Выручка: " + data.getTotalRevenue() + " руб."));
                document.add(new Paragraph("Средний чек: " + data.getAvgOrderValue() + " руб."));

                // Таблица топ-продуктов
                Table table = new Table(3);
                table.addHeaderCell("Продукт");
                table.addHeaderCell("Количество");
                table.addHeaderCell("Выручка");
                for (TopProduct p : data.getTopProducts()) {
                    table.addCell(p.getName());
                    table.addCell(String.valueOf(p.getQuantity()));
                    table.addCell(p.getRevenue().toString());
                }
                document.add(table);
            }

            context.putString("pdfPath", filePath);
            log.info("PDF сгенерирован: {}", filePath);
            return RepeatStatus.FINISHED;
        };
    }

    // --- Step 3: Send Email ---
    @Bean
    public Tasklet sendEmailTasklet() {
        return (contribution, chunkContext) -> {
            ExecutionContext context = chunkContext.getStepContext()
                    .getStepExecution().getJobExecution().getExecutionContext();
            String pdfPath = context.getString("pdfPath");

            List<String> recipients = List.of("admin@example.com", "manager@example.com");

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(recipients.toArray(new String[0]));
            helper.setSubject("Ежемесячный отчёт");
            helper.setText("В приложении ежемесячный отчёт.");
            helper.addAttachment("report.pdf", new File(pdfPath));
            mailSender.send(message);

            log.info("Отчёт отправлен: {}", recipients);
            return RepeatStatus.FINISHED;
        };
    }
}

// --- Scheduler ---
@Component
@RequiredArgsConstructor
public class ReportScheduler {

    private final JobLauncher jobLauncher;
    private final Job monthlyReportJob;

    @Scheduled(cron = "0 0 6 1 * *") // 1-е число каждого месяца в 6:00
    public void generateMonthlyReport() throws Exception {
        JobParameters params = new JobParametersBuilder()
                .addString("month", YearMonth.now().minusMonths(1).toString())
                .addLong("timestamp", System.currentTimeMillis())
                .toJobParameters();
        jobLauncher.run(monthlyReportJob, params);
    }
}`,
      explanation: 'Report Job состоит из 3 Tasklet Step-ов: агрегация данных, генерация PDF, отправка email. ExecutionContext передаёт данные между Step-ами (serialized JSON). iText создаёт PDF с таблицами. MimeMessageHelper отправляет email с вложением. @Scheduled(cron) запускает Job 1-го числа каждого месяца. JobParameters содержат месяц отчёта.'
    }
  ]
}
